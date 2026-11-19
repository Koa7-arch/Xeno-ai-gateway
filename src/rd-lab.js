import {reply,readJson,requireId} from './security.js';
const stamp=()=>new Date().toISOString();
const text=(v,n)=>typeof v==='string'&&v.trim()&&v.length<=n?v.trim():null;
const kinds=['research','design','experiment','calculation','prototype','specification','code','report'];
const statuses=['draft','review','approved','archived'];
const bad=(error,status=400)=>reply({error},status);
export function calculate(input){
 const op=input?.operation;const n=x=>typeof x==='number'&&Number.isFinite(x)?x:null;
 const a=n(input?.a),b=n(input?.b);
 if(!['add','subtract','multiply','divide','rectangle_area','circle_area','cylinder_volume','density','force','pressure'].includes(op))throw Error('Unsupported calculation');
 if(a===null||b===null)throw Error('Finite numeric inputs required');
 if((op==='divide'||op==='density'||op==='pressure')&&b===0)throw Error('Division by zero');
 const v={add:()=>a+b,subtract:()=>a-b,multiply:()=>a*b,divide:()=>a/b,rectangle_area:()=>a*b,circle_area:()=>Math.PI*a*a,cylinder_volume:()=>Math.PI*a*a*b,density:()=>a/b,force:()=>a*b,pressure:()=>a/b}[op]();
 if(!Number.isFinite(v))throw Error('Non-finite result');
 const units={rectangle_area:'square units',circle_area:'square units',cylinder_volume:'cubic units',density:'mass/volume',force:'N if kg and m/s²',pressure:'Pa if N and m²'};
 return {operation:op,result:v,units:units[op]||'input-derived',inputs:{a,b},assumptions:'Use consistent units; results are preliminary and require independent engineering verification.'};
}
export async function rdLab(req,db,path){
 const parts=path.split('/').filter(Boolean),pid=parts[2],kind=parts[3],itemId=parts[4];
 if(!pid)return bad('Project required',404);requireId(pid);
 const project=await db.prepare('SELECT id FROM projects WHERE id=?').bind(pid).first();if(!project)return bad('Project not found',404);
 if(kind==='calculate'&&req.method==='POST'){
  const input=await readJson(req,2500);try{return reply(calculate(input))}catch(e){return bad(e.message)}
 }
 if(kind==='artifacts'&&req.method==='GET'){
  const rows=await db.prepare('SELECT id,project_id,title,kind,status,revision,updated_at FROM rd_artifacts WHERE project_id=? ORDER BY updated_at DESC LIMIT 200').bind(pid).all();return reply({items:rows.results||[]});
 }
 if(kind==='artifacts'&&req.method==='POST'){
  const b=await readJson(req,30000),title=text(b.title,180),content=text(b.content,20000),type=b.kind||'design';if(!title||!content||!kinds.includes(type))return bad('Invalid artifact');
  const id=crypto.randomUUID(),t=stamp();await db.prepare('INSERT INTO rd_artifacts(id,project_id,title,kind,status,revision,content,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?)').bind(id,pid,title,type,'draft',1,content,t,t).run();
  await db.prepare('INSERT INTO rd_revisions(id,artifact_id,revision,content,reason,created_at) VALUES(?,?,?,?,?,?)').bind(crypto.randomUUID(),id,1,content,'Initial version',t).run();return reply({id,revision:1,created:true},201);
 }
 if(kind==='artifacts'&&itemId){requireId(itemId);const a=await db.prepare('SELECT * FROM rd_artifacts WHERE id=? AND project_id=?').bind(itemId,pid).first();if(!a)return bad('Artifact not found',404);
  if(req.method==='GET'){
   const revisions=await db.prepare('SELECT id,revision,reason,created_at FROM rd_revisions WHERE artifact_id=? ORDER BY revision DESC LIMIT 100').bind(itemId).all();return reply({artifact:a,revisions:revisions.results||[]});
  }
  if(req.method==='PATCH'){
   const b=await readJson(req,30000);if(b.expected_revision!==a.revision)return bad('Revision conflict: reload the latest artifact',409);
   const title=text(b.title??a.title,180),content=text(b.content??a.content,20000),status=b.status??a.status,reason=text(b.reason||'Edited',300);
   if(!title||!content||!reason||!statuses.includes(status))return bad('Invalid artifact revision');
   if(a.status==='approved'&&(content!==a.content||title!==a.title))return bad('Approved artifact is locked; create a new artifact for changes',409);
   const rev=a.revision+1,t=stamp();await db.prepare('UPDATE rd_artifacts SET title=?,content=?,status=?,revision=?,updated_at=? WHERE id=? AND project_id=? AND revision=?').bind(title,content,status,rev,t,itemId,pid,a.revision).run();
   await db.prepare('INSERT INTO rd_revisions(id,artifact_id,revision,content,reason,created_at) VALUES(?,?,?,?,?,?)').bind(crypto.randomUUID(),itemId,rev,content,reason,t).run();return reply({updated:true,revision:rev});
  }
 }
 if(kind==='sources'&&req.method==='GET'){
  const rows=await db.prepare('SELECT * FROM rd_sources WHERE project_id=? ORDER BY created_at DESC LIMIT 200').bind(pid).all();return reply({items:rows.results||[]});
 }
 if(kind==='sources'&&req.method==='POST'){
  const b=await readJson(req,10000),title=text(b.title,180),url=text(b.url||'local',2000),summary=text(b.summary,6000),quality=b.quality||'unverified';if(!title||!url||!summary||!['unverified','reviewed','verified'].includes(quality))return bad('Invalid research source');
  const id=crypto.randomUUID();await db.prepare('INSERT INTO rd_sources(id,project_id,title,url,summary,quality,created_at) VALUES(?,?,?,?,?,?,?)').bind(id,pid,title,url,summary,quality,stamp()).run();return reply({created:true,id},201);
 }
 return bad('Unsupported R&D operation',405);
}
export async function rdContext(db,pid){requireId(pid);const [art,sources]=await Promise.all([db.prepare('SELECT title,kind,status,revision,substr(content,1,800) AS excerpt FROM rd_artifacts WHERE project_id=? ORDER BY updated_at DESC LIMIT 10').bind(pid).all(),db.prepare('SELECT title,url,quality,substr(summary,1,500) AS summary FROM rd_sources WHERE project_id=? ORDER BY created_at DESC LIMIT 10').bind(pid).all()]);return JSON.stringify({artifacts:art.results||[],sources:sources.results||[]}).slice(0,10500)}
