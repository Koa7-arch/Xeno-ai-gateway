import {reply,readJson,requireId} from './security.js';
const now=()=>new Date().toISOString();
const fail=(error,status=400)=>reply({error},status);
const field=(x,max)=>typeof x==='string'&&x.trim()&&x.length<=max?x.trim():null;
const kinds=['note','decision','specification','research','revision','log'];
const priorities=['low','normal','high','urgent'];
async function project(db,id){return db.prepare('SELECT * FROM projects WHERE id=?').bind(id).first()}
async function activity(db,pid,action,detail){await db.prepare('INSERT INTO project_activity(id,project_id,action,detail,created_at) VALUES(?,?,?,?,?)').bind(crypto.randomUUID(),pid,action,detail.slice(0,500),now()).run()}
export async function projectCenter(req,db,path){
 const parts=path.split('/').filter(Boolean);const id=parts[2];const sub=parts[3];
 if(path==='/api/project-center'&&req.method==='GET'){
  const [projects,tasks,files]=await Promise.all([db.prepare('SELECT * FROM projects ORDER BY updated_at DESC LIMIT 250').all(),db.prepare('SELECT project_id,status,COUNT(*) AS count FROM project_items GROUP BY project_id,status').all(),db.prepare('SELECT project_id,COUNT(*) AS count FROM files WHERE project_id IS NOT NULL GROUP BY project_id').all()]);
  return reply({projects:projects.results||[],taskCounts:tasks.results||[],fileCounts:files.results||[]});
 }
 if(!id)return fail('Project identifier required',404);
 requireId(id);const p=await project(db,id);if(!p)return fail('Project not found',404);
 if(!sub&&req.method==='GET'){
  const [tasks,notes,files,activityRows]=await Promise.all([
   db.prepare('SELECT i.*,t.parent_item_id,t.priority,t.phase FROM project_items i LEFT JOIN project_task_tree t ON i.id=t.item_id WHERE i.project_id=? ORDER BY i.created_at ASC LIMIT 250').bind(id).all(),
   db.prepare('SELECT * FROM project_notes WHERE project_id=? ORDER BY updated_at DESC LIMIT 200').bind(id).all(),
   db.prepare('SELECT id,name,mime,size,created_at FROM files WHERE project_id=? ORDER BY created_at DESC LIMIT 200').bind(id).all(),
   db.prepare('SELECT * FROM project_activity WHERE project_id=? ORDER BY created_at DESC LIMIT 80').bind(id).all()]);
  return reply({project:p,tasks:tasks.results||[],notes:notes.results||[],files:files.results||[],activity:activityRows.results||[]});
 }
 if(sub==='notes'&&req.method==='POST'){
  const b=await readJson(req,16000),title=field(b.title,180),content=field(b.content,12000),kind=kinds.includes(b.kind)?b.kind:'note';
  if(!title||!content)return fail('Title and content required');const uid=crypto.randomUUID(),t=now();
  await db.prepare('INSERT INTO project_notes(id,project_id,title,content,kind,created_at,updated_at) VALUES(?,?,?,?,?,?,?)').bind(uid,id,title,content,kind,t,t).run();
  await activity(db,id,'note_created',title);return reply({id:uid,created:true},201);
 }
 if(sub==='notes'&&parts[4]&&['PATCH','DELETE'].includes(req.method)){
  const noteId=requireId(parts[4]);const note=await db.prepare('SELECT * FROM project_notes WHERE id=? AND project_id=?').bind(noteId,id).first();if(!note)return fail('Note not found',404);
  if(req.method==='DELETE'){await db.prepare('DELETE FROM project_notes WHERE id=? AND project_id=?').bind(noteId,id).run();await activity(db,id,'note_deleted',note.title);return reply({deleted:true})}
  const b=await readJson(req,16000),title=field(b.title??note.title,180),content=field(b.content??note.content,12000),kind=b.kind??note.kind;
  if(!title||!content||!kinds.includes(kind))return fail('Invalid note');await db.prepare('UPDATE project_notes SET title=?,content=?,kind=?,updated_at=? WHERE id=? AND project_id=?').bind(title,content,kind,now(),noteId,id).run();await activity(db,id,'note_updated',title);return reply({updated:true});
 }
 if(sub==='tasks'&&req.method==='POST'){
  const b=await readJson(req,12000),title=field(b.title,200),details=typeof b.details==='string'&&b.details.length<=4000?b.details:'',parent=b.parent_item_id||null,priority=b.priority||'normal',phase=b.phase||'';
  if(!title||!priorities.includes(priority)||typeof phase!=='string'||phase.length>100)return fail('Invalid task');
  if(parent){requireId(parent);const match=await db.prepare('SELECT id FROM project_items WHERE id=? AND project_id=?').bind(parent,id).first();if(!match)return fail('Parent must belong to the same project')}
  const uid=crypto.randomUUID(),t=now();await db.prepare('INSERT INTO project_items(id,project_id,title,details,status,due_at,updated_at,created_at) VALUES(?,?,?,?,?,?,?,?)').bind(uid,id,title,details,'todo',field(b.due_at,40),t,t).run();
  await db.prepare('INSERT INTO project_task_tree(item_id,parent_item_id,priority,phase) VALUES(?,?,?,?)').bind(uid,parent,priority,phase).run();await activity(db,id,'task_created',title);return reply({id:uid,created:true},201);
 }
 if(sub==='tasks'&&parts[4]&&req.method==='PATCH'){
  const taskId=requireId(parts[4]);const task=await db.prepare('SELECT * FROM project_items WHERE id=? AND project_id=?').bind(taskId,id).first();if(!task)return fail('Task not found',404);
  const b=await readJson(req,12000),status=b.status??task.status,title=b.title??task.title,details=b.details??task.details;
  if(!['todo','doing','blocked','done'].includes(status)||!field(title,200)||typeof details!=='string'||details.length>4000)return fail('Invalid task update');
  if(Object.hasOwn(b,'parent_item_id')){
   const parent=b.parent_item_id||null;if(parent){requireId(parent);if(parent===taskId)return fail('Task cannot parent itself');const rows=(await db.prepare('SELECT i.id,t.parent_item_id FROM project_items i LEFT JOIN project_task_tree t ON i.id=t.item_id WHERE i.project_id=?').bind(id).all()).results||[];const lookup=new Map(rows.map(x=>[x.id,x.parent_item_id]));if(!lookup.has(parent))return fail('Parent must belong to the same project');let node=parent;const visited=new Set();while(node){if(node===taskId)return fail('Task nesting would create a cycle');if(visited.has(node))return fail('Existing task cycle');visited.add(node);node=lookup.get(node)}}
   await db.prepare('INSERT INTO project_task_tree(item_id,parent_item_id,priority,phase) VALUES(?,?,?,?) ON CONFLICT(item_id) DO UPDATE SET parent_item_id=excluded.parent_item_id').bind(taskId,parent,'normal','').run();
  }
  await db.prepare('UPDATE project_items SET title=?,details=?,status=?,updated_at=? WHERE id=? AND project_id=?').bind(title,details,status,now(),taskId,id).run();
  if(Object.hasOwn(b,'priority')||Object.hasOwn(b,'phase')){const priority=b.priority||'normal',phase=b.phase||'';if(!priorities.includes(priority)||typeof phase!=='string'||phase.length>100)return fail('Invalid task metadata');await db.prepare('INSERT INTO project_task_tree(item_id,parent_item_id,priority,phase) VALUES(?,NULL,?,?) ON CONFLICT(item_id) DO UPDATE SET priority=excluded.priority,phase=excluded.phase').bind(taskId,priority,phase).run()}
  await activity(db,id,'task_updated',title);return reply({updated:true});
 }
 if(sub==='files'&&req.method==='POST'){
  const b=await readJson(req,2000),fid=requireId(b.file_id);const file=await db.prepare('SELECT id,project_id FROM files WHERE id=?').bind(fid).first();if(!file)return fail('File not found',404);
  if(file.project_id&&file.project_id!==id)return fail('File already belongs to another project; unlink it first',409);
  await db.prepare('UPDATE files SET project_id=? WHERE id=?').bind(id,fid).run();await activity(db,id,'file_attached',fid);return reply({attached:true});
 }
 if(sub==='files'&&parts[4]&&req.method==='DELETE'){
  const fid=requireId(parts[4]);const result=await db.prepare('UPDATE files SET project_id=NULL WHERE id=? AND project_id=?').bind(fid,id).run();if(!(result.meta?.changes))return fail('File not attached to project',404);await activity(db,id,'file_unlinked',fid);return reply({unlinked:true});
 }
 return fail('Unsupported project operation',405);
}
export async function projectContext(db,id){requireId(id);const p=await project(db,id);if(!p)return null;
 const [notes,tasks,files]=await Promise.all([
  db.prepare('SELECT title,content,kind FROM project_notes WHERE project_id=? ORDER BY updated_at DESC LIMIT 12').bind(id).all(),
  db.prepare('SELECT title,details,status FROM project_items WHERE project_id=? ORDER BY updated_at DESC LIMIT 25').bind(id).all(),
  db.prepare('SELECT name,mime FROM files WHERE project_id=? ORDER BY created_at DESC LIMIT 30').bind(id).all()]);
 return JSON.stringify({project:p,notes:(notes.results||[]).map(n=>({...n,content:n.content.slice(0,1100)})),tasks:tasks.results||[],files:files.results||[]}).slice(0,14500);
}
