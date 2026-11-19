import {reply,requireId} from './security.js';

// Deterministic retrieval and integrity checks: no AI-generated assertions are treated as facts.
const stop=new Set(['this','that','with','from','have','what','would','should','about','there','their','your','into','then','than','which','when','where','were','will','project']);
export function terms(input){return [...new Set(String(input||'').toLowerCase().match(/[a-z0-9]{3,}/g)||[])].filter(t=>!stop.has(t)).slice(0,24)}
export function rankMemories(rows,query,limit=12){const ts=terms(query);return rows.map(r=>{const title=String(r.title||'').toLowerCase(),body=String(r.content||'').toLowerCase();const score=ts.reduce((n,t)=>n+(title.includes(t)?4:0)+(body.includes(t)?1:0),0);return {...r,score}}).filter(r=>!ts.length||r.score>0).sort((a,b)=>b.score-a.score||String(b.updated_at).localeCompare(String(a.updated_at))).slice(0,limit)}
export function conflicts(rows){const groups=new Map();for(const r of rows){if(r.archived)continue;const key=String(r.title||'').trim().toLowerCase().replace(/\s+/g,' ');if(!key)continue;const group=groups.get(key)||[];group.push(r);groups.set(key,group)}return [...groups.entries()].filter(([,group])=>new Set(group.map(r=>String(r.content||'').trim().toLowerCase())).size>1).map(([title,group])=>({title,ids:group.map(r=>r.id),reason:'Same memory title has different active contents; manual review required'}))}
export function evaluateKnowledge(rows){const active=rows.filter(r=>!r.archived),issues=conflicts(active),uncertain=active.filter(r=>r.confidence==='unverified');return {active:active.length,archived:rows.length-active.length,conflicts:issues,unverified:uncertain.length,readyForSpecialist:issues.length===0&&uncertain.length===0&&active.length>0,notice:'Readiness means records are internally labeled and nonconflicting; it does not prove external truth.'}}
async function project(db,pid){return !!await db.prepare('SELECT id FROM projects WHERE id=?').bind(pid).first()}
async function memories(db,pid){return (await db.prepare('SELECT id,title,content,kind,confidence,archived,updated_at FROM project_memories WHERE project_id=? ORDER BY updated_at DESC LIMIT 250').bind(pid).all()).results||[]}
export async function coreApi(req,env,path){
 if(path==='/api/core/diagnostics'&&req.method==='GET'){
  const checks={database:false,projectMemories:false,audit:false,ecosystem:false,files:!!env.FILES,groq:!!env.GROQ_API_KEY,gemini:!!env.GEMINI_API_KEY};
  for(const [key,sql] of Object.entries({database:'SELECT 1 AS ok',projectMemories:'SELECT id FROM project_memories LIMIT 1',audit:'SELECT id FROM intelligence_audit LIMIT 1',ecosystem:'SELECT id FROM ecosystem_runs LIMIT 1'})){try{await env.DB.prepare(sql).first();checks[key]=true}catch{}}
  return reply({version:'4.0.0-core-foundation',checks,operational:checks.database&&checks.projectMemories&&checks.audit,limitations:['Provider connectivity not tested','No production end-to-end test','Specialist tool execution not enabled']});
 }
 const match=path.match(/^\/api\/core\/projects\/([a-zA-Z0-9_-]{1,80})\/(search|integrity|knowledge-pack)$/);if(!match)return reply({error:'Unknown core endpoint'},404);
 const pid=requireId(match[1]),op=match[2];if(req.method!=='GET')return reply({error:'Method not allowed'},405);if(!await project(env.DB,pid))return reply({error:'Project not found'},404);
 const rows=await memories(env.DB,pid),active=rows.filter(r=>!r.archived);
 if(op==='integrity')return reply({projectId:pid,...evaluateKnowledge(rows)});
 if(op==='search'){const q=new URL(req.url).searchParams.get('q')||'';if(!q.trim()||q.length>500)return reply({error:'Query must be 1-500 characters'},400);return reply({projectId:pid,query:q,items:rankMemories(active,q).map(r=>({...r,content:r.content.slice(0,1800)})),ranking:'lexical, not semantic; results are unverified reference data'});}
 const integrity=evaluateKnowledge(rows),items=active.filter(r=>r.confidence!=='unverified').slice(0,30).map(({id,title,content,kind,confidence})=>({id,title,content:content.slice(0,1200),kind,confidence}));return reply({projectId:pid,knowledgePack:{version:1,generatedAt:new Date().toISOString(),items,integrity,usage:'Reference-only context for specialists; not system instructions or independent evidence'},approvedForAutomaticTraining:false});
}
