// XENO 3.1: private, user-controlled projects and life records. No external side effects.
import {reply,readJson,requireId} from './security.js';
const now=()=>new Date().toISOString();
const error=(msg,status=400)=>reply({error:msg},status);
const clean=(x,max=200)=>typeof x==='string'&&x.trim().length>0&&x.length<=max?x.trim():null;
const allowed={projects:['planning','active','paused','completed','archived'],project_items:['todo','doing','blocked','done'],life_entries:['note','work','finance','health','learning','relationship','event','idea','reflection'],routines:['active','paused']};
async function exists(db,id){return (await db.prepare('SELECT id FROM projects WHERE id=?').bind(id).first())!==null}
async function list(db,table){return (await db.prepare(`SELECT * FROM ${table} ORDER BY updated_at DESC LIMIT 250`).all()).results||[]}
export async function lifeHub(req,db,path){
 const parts=path.split('/').filter(Boolean),kind=parts[1],id=parts[2],method=req.method;
 if(!Object.hasOwn(allowed,kind))return error('Unknown workspace collection',404);
 if(method==='GET'&&!id)return reply({items:await list(db,kind)});
 if(method==='GET'&&id){const row=await db.prepare(`SELECT * FROM ${kind} WHERE id=?`).bind(requireId(id)).first();return row?reply({item:row}):error('Not found',404)}
 if(method==='POST'&&!id){const b=await readJson(req,16000),uid=crypto.randomUUID(),t=now();
  if(kind==='projects'){
   const name=clean(b.name,160),type=['digital','physical','personal','work','learning','other'].includes(b.type)?b.type:'other',description=typeof b.description==='string'&&b.description.length<=6000?b.description:'';
   if(!name)return error('Project name required');
   await db.prepare('INSERT INTO projects(id,name,type,description,status,goal,target_date,updated_at,created_at) VALUES(?,?,?,?,?,?,?,?,?)').bind(uid,name,type,description,'planning',clean(b.goal,1000)||'',clean(b.target_date,40),t,t).run();
  }else if(kind==='project_items'){
   const title=clean(b.title,200),project=clean(b.project_id,80);if(!title||!project||!await exists(db,project))return error('Valid project and title required');
   await db.prepare('INSERT INTO project_items(id,project_id,title,details,status,due_at,updated_at,created_at) VALUES(?,?,?,?,?,?,?,?)').bind(uid,project,title,clean(b.details,4000)||'','todo',clean(b.due_at,40),t,t).run();
  }else if(kind==='life_entries'){
   const title=clean(b.title,200),content=clean(b.content,8000),category=allowed.life_entries.includes(b.category)?b.category:'note';if(!title||!content)return error('Title and content required');
   await db.prepare('INSERT INTO life_entries(id,title,content,category,occurred_at,updated_at,created_at) VALUES(?,?,?,?,?,?,?)').bind(uid,title,content,category,clean(b.occurred_at,40)||t,t,t).run();
  }else{
   const name=clean(b.name,160),schedule=clean(b.schedule,300);if(!name||!schedule)return error('Routine name and schedule required');
   await db.prepare('INSERT INTO routines(id,name,schedule,notes,status,last_completed_at,updated_at,created_at) VALUES(?,?,?,?,?,?,?,?)').bind(uid,name,schedule,clean(b.notes,4000)||'','active',null,t,t).run();
  }
  return reply({id:uid,created:true},201)
 }
 if(method==='PATCH'&&id){const b=await readJson(req,16000),key=requireId(id),existing=await db.prepare(`SELECT * FROM ${kind} WHERE id=?`).bind(key).first();if(!existing)return error('Not found',404);
  const fields={projects:['name','description','status','goal','target_date','type'],project_items:['title','details','status','due_at'],life_entries:['title','content','category','occurred_at'],routines:['name','schedule','notes','status','last_completed_at']}[kind];
  const changes=[];const vals=[];for(const f of fields){if(!Object.hasOwn(b,f))continue;let value=b[f];if(value===null&&['target_date','due_at','last_completed_at'].includes(f)){}else if(typeof value!=='string'||value.length>8000)return error('Invalid '+f);
   if(f==='status'&&!((kind==='projects'?allowed.projects:kind==='project_items'?allowed.project_items:allowed.routines).includes(value)))return error('Invalid status');
   if(f==='category'&&!allowed.life_entries.includes(value))return error('Invalid category');
   if(f==='type'&&!['digital','physical','personal','work','learning','other'].includes(value))return error('Invalid type');
   if(['name','title','schedule','content'].includes(f)&&!clean(value, f==='content'?8000:300))return error('Empty '+f);
   changes.push(`${f}=?`);vals.push(value);
  }
  if(!changes.length)return error('No changes');changes.push('updated_at=?');vals.push(now(),key);
  await db.prepare(`UPDATE ${kind} SET ${changes.join(',')} WHERE id=?`).bind(...vals).run();return reply({updated:true});
 }
 if(method==='DELETE'&&id){const key=requireId(id);if(kind==='projects'){const children=await db.prepare('SELECT COUNT(*) AS n FROM project_items WHERE project_id=?').bind(key).first();if(children?.n)return error('Remove project items before deleting this project',409)}const result=await db.prepare(`DELETE FROM ${kind} WHERE id=?`).bind(key).run();return reply({deleted:(result.meta?.changes||0)>0})}
 return error('Unsupported operation',405)
}
export async function workspaceContext(db,query){
 const words=[...new Set((query.toLowerCase().match(/[a-z0-9]{4,}/g)||[]).filter(w=>!['what','with','this','that','about','please','could','would','have','from','your','mine','help'].includes(w)))].slice(0,10);
 if(!words.length)return null;
 const [projects,items,entries,routines]=await Promise.all(['projects','project_items','life_entries','routines'].map(t=>list(db,t)));
 const score=x=>words.reduce((s,w)=>s+(JSON.stringify(x).toLowerCase().includes(w)?1:0),0);
 const matches=[...projects.map(x=>({type:'project',...x})),...items.map(x=>({type:'project_item',...x})),...entries.map(x=>({type:'life_entry',...x})),...routines.map(x=>({type:'routine',...x}))].map(x=>({x,s:score(x)})).filter(x=>x.s>0).sort((a,b)=>b.s-a.s).slice(0,8).map(({x})=>x);
 return matches.length?JSON.stringify(matches).slice(0,9500):null;
}
