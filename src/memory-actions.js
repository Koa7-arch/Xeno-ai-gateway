// XENO 3.0 — explicit conversational memory commands. No LLM-generated SQL.
// Only explicit user requests may write; retrieved content is never interpreted as a command.
const now=()=>new Date().toISOString();
const clean=s=>String(s||'').trim().replace(/[\s.]+$/,'');
const normalize=s=>clean(s).toLowerCase().replace(/[^a-z0-9 ]/g,'').replace(/\s+/g,' ');
export function parseMemoryCommand(input){
 if(typeof input!=='string'||input.length>3000)return null;
 const s=input.trim();let m;
 if((m=s.match(/^(?:please\s+)?(?:remember(?:\s+that)?|save(?:\s+this)?(?:\s+memory)?(?:\s+that)?|memorize(?:\s+that)?)\s*[:,-]?\s+(.+)$/is))){
   const content=clean(m[1]);if(content.length<3||content.length>1800)return null;
   return {kind:'save',content};
 }
 if((m=s.match(/^(?:please\s+)?(?:update|change|correct|replace)\s+(?:my\s+)?(?:saved\s+)?(.+?)\s+memory[.:]\s+(.+)$/is))){const query=clean(m[1]),content=clean(m[2]);if(query.length>=3&&content.length>=3&&content.length<=1800)return {kind:'update',query,content};}
 if((m=s.match(/^(?:please\s+)?(?:update|change|correct|replace)\s+(?:my\s+)?(?:saved\s+)?(?:memory\s+(?:about|for)\s+)?(.+?)\s+(?:to|with|so\s+that\s+it\s+says)\s+(.+)$/is))){
   const query=clean(m[1]),content=clean(m[2]);if(query.length<3||content.length<3||content.length>1800)return null;
   return {kind:'update',query,content};
 }
 if((m=s.match(/^(?:please\s+)?(?:forget|delete\s+(?:my\s+)?(?:saved\s+)?memory\s+(?:about|for)\s+)\s*(.+)$/is))){
   const query=clean(m[1]);if(query.length<3)return null;return {kind:'delete-request',query};
 }
 return null;
}
export async function executeMemoryCommand(db,command){
 if(!db) return {handled:true,ok:false,reply:'Memory storage is not configured. Nothing was saved.'};
 if(command.kind==='save'){
   const existing=(await db.prepare('SELECT id,title,content FROM memories ORDER BY updated_at DESC LIMIT 100').all()).results||[];
   const content=command.content;
   const exact=existing.find(r=>normalize(r.content)===normalize(content));
   if(exact)return {handled:true,ok:true,reply:`Already saved in memory: ${exact.content}`,memoryId:exact.id};
   // Do not overwrite a related but non-identical memory without a targeted update.
   const id=crypto.randomUUID(),title=content.slice(0,110);
   await db.prepare('INSERT INTO memories(id,title,content,scope,updated_at) VALUES(?,?,?,?,?)').bind(id,title,content,'private',now()).run();
   const check=await db.prepare('SELECT id,content FROM memories WHERE id=?').bind(id).first();
   if(!check||check.content!==content)return {handled:true,ok:false,reply:'Memory write could not be verified. Please check the Memory dashboard.'};
   return {handled:true,ok:true,reply:`Saved to long-term memory: ${content}`,memoryId:id};
 }
 if(command.kind==='update'||command.kind==='delete-request'){
   const rows=(await db.prepare('SELECT id,title,content FROM memories ORDER BY updated_at DESC LIMIT 100').all()).results||[];
   const q=normalize(command.query);const found=rows.filter(r=>normalize(r.title).includes(q)||normalize(r.content).includes(q));
   if(found.length===0)return {handled:true,ok:false,reply:`No matching memory found for “${command.query}”. Nothing changed. You can save the new information with “Remember that …”.`};
   if(found.length>1)return {handled:true,ok:false,reply:`Multiple memories match “${command.query}”. Nothing changed. Please use a more specific description or edit in Memory.`};
   const target=found[0];
   if(command.kind==='delete-request')return {handled:true,ok:false,reply:`I found “${target.title}”. For safety, delete it from the Memory dashboard using its confirmation prompt. Nothing was deleted.`};
   await db.prepare('UPDATE memories SET content=?,title=?,updated_at=? WHERE id=?').bind(command.content,command.content.slice(0,110),now(),target.id).run();
   const check=await db.prepare('SELECT content FROM memories WHERE id=?').bind(target.id).first();
   if(!check||check.content!==command.content)return {handled:true,ok:false,reply:'Memory update could not be verified.'};
   return {handled:true,ok:true,reply:`Updated long-term memory to: ${command.content}`,memoryId:target.id};
 }
 return {handled:false};
}
