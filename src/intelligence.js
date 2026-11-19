import {reply,readJson,requireId} from './security.js';
const now=()=>new Date().toISOString();
const error=(message,status=400)=>reply({error:message},status);
const text=(s,max)=>typeof s==='string'&&s.trim().length>0&&s.length<=max?s.trim():null;
export async function writeAudit(db,{action,projectId=null,detail={}}){
 // Audit failure must not masquerade as an action failure after a successful write.
 try {await db.prepare('INSERT INTO intelligence_audit(id,project_id,action,detail,created_at) VALUES(?,?,?,?,?)').bind(crypto.randomUUID(),projectId,action,JSON.stringify(detail).slice(0,1500),now()).run();return true}catch{return false}
}
async function exists(db,id){return !!(await db.prepare('SELECT id FROM projects WHERE id=?').bind(id).first())}
export async function projectMemoryContext(db,id){
 requireId(id);
 const rows=(await db.prepare('SELECT id,title,content,kind,confidence,updated_at FROM project_memories WHERE project_id=? AND archived=0 ORDER BY updated_at DESC LIMIT 25').bind(id).all()).results||[];
 return rows.length?JSON.stringify(rows.map(r=>({...r,content:r.content.slice(0,1100)}))).slice(0,12500):'';
}
export async function intelligenceApi(req,db,path){
 const parts=path.split('/').filter(Boolean);
 if(path==='/api/intelligence/audit'&&req.method==='GET'){
  const pid=new URL(req.url).searchParams.get('projectId');if(pid)requireId(pid);
  const rows=pid?await db.prepare('SELECT * FROM intelligence_audit WHERE project_id=? ORDER BY created_at DESC LIMIT 100').bind(pid).all():await db.prepare('SELECT * FROM intelligence_audit ORDER BY created_at DESC LIMIT 100').all();
  return reply({items:rows.results||[]});
 }
 if(parts[2]!=='projects'||!parts[3]||parts[4]!=='memories')return error('Unknown intelligence endpoint',404);
 const pid=requireId(parts[3]);if(!(await exists(db,pid)))return error('Project not found',404);
 if(req.method==='GET'&&!parts[5]){
  const rows=await db.prepare('SELECT * FROM project_memories WHERE project_id=? ORDER BY updated_at DESC LIMIT 200').bind(pid).all();return reply({items:rows.results||[]});
 }
 if(req.method==='POST'&&!parts[5]){
  const b=await readJson(req,14000),title=text(b.title,160),content=text(b.content,10000);
  if(!title||!content||!['fact','decision','assumption','preference','requirement'].includes(b.kind||'fact')||!['unverified','user-confirmed','source-backed'].includes(b.confidence||'unverified'))return error('Invalid project memory');
  const kind=b.kind||'fact',confidence=b.confidence||'unverified';
  const duplicate=await db.prepare('SELECT id FROM project_memories WHERE project_id=? AND title=? AND content=? AND archived=0 LIMIT 1').bind(pid,title,content).first();
  if(duplicate)return reply({id:duplicate.id,created:false,duplicate:true});
  const id=crypto.randomUUID(),timestamp=now();
  await db.prepare('INSERT INTO project_memories(id,project_id,title,content,kind,confidence,archived,created_at,updated_at) VALUES(?,?,?,?,?,?,0,?,?)').bind(id,pid,title,content,kind,confidence,timestamp,timestamp).run();
  const check=await db.prepare('SELECT id,content FROM project_memories WHERE id=? AND project_id=?').bind(id,pid).first();
  if(!check||check.content!==content)return error('Write verification failed',500);
  await writeAudit(db,{action:'project_memory_created',projectId:pid,detail:{id,kind,confidence}});
  return reply({id,created:true,verified:true},201);
 }
 if(parts[5]&&req.method==='PATCH'){
  const id=requireId(parts[5]);const previous=await db.prepare('SELECT * FROM project_memories WHERE id=? AND project_id=?').bind(id,pid).first();if(!previous)return error('Project memory not found',404);
  const b=await readJson(req,14000),title=text(b.title??previous.title,160),content=text(b.content??previous.content,10000),kind=b.kind??previous.kind,confidence=b.confidence??previous.confidence,archived=b.archived??previous.archived;
  if(!title||!content||!['fact','decision','assumption','preference','requirement'].includes(kind)||!['unverified','user-confirmed','source-backed'].includes(confidence)||![0,1,true,false].includes(archived))return error('Invalid project memory update');
  const timestamp=now();await db.prepare('UPDATE project_memories SET title=?,content=?,kind=?,confidence=?,archived=?,updated_at=? WHERE id=? AND project_id=?').bind(title,content,kind,confidence,Number(archived),timestamp,id,pid).run();
  const check=await db.prepare('SELECT title,content,archived FROM project_memories WHERE id=? AND project_id=?').bind(id,pid).first();if(!check||check.content!==content||check.title!==title||check.archived!==Number(archived))return error('Update verification failed',500);
  await writeAudit(db,{action:archived?'project_memory_archived':'project_memory_updated',projectId:pid,detail:{id}});
  return reply({updated:true,verified:true});
 }
 return error('Unsupported intelligence operation',405);
}
