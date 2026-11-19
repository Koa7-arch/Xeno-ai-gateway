import test from 'node:test';
import assert from 'node:assert/strict';
import {projectMemoryContext,intelligenceApi} from '../src/intelligence.js';
import {readFileSync} from 'node:fs';
const code=readFileSync(new URL('../src/index.js',import.meta.url),'utf8');
test('selected-project chat excludes global memory retrieval',()=>{
 assert.match(code,/if\(env\.DB && !body\.projectId && body\.useMemory!==false\)/);
 assert.match(code,/if\(env\.DB&&!body\.projectId\)\{try\{const related/);
 assert.match(code,/if\(env\.DB&&env\.FILES&&!body\.projectId\)/);
});
test('project context only queries scoped and unarchived memory',async()=>{
 const seen=[];
 const db={prepare(sql){seen.push(sql);return {bind(...args){assert.deepEqual(args,['project-a']);return {all:async()=>({results:[{id:'m1',title:'Design decision',content:'Use six ductless zones',kind:'decision',confidence:'user-confirmed',updated_at:'2026-11-18'}]})}}}}};
 const value=JSON.parse(await projectMemoryContext(db,'project-a'));
 assert.equal(value[0].title,'Design decision');
 assert.match(seen[0],/WHERE project_id=\? AND archived=0/);
});
test('project memory rejects missing project without writing',async()=>{
 const db={prepare(){return {bind(){return {first:async()=>null}}}}};
 const request=new Request('https://xeno.example/api/intelligence/projects/abc/memories',{method:'GET'});
 const result=await intelligenceApi(request,db,'/api/intelligence/projects/abc/memories');
 assert.equal(result.status,404);
});
test('audit API is project-scoped when projectId supplied',async()=>{
 const calls=[];
 const db={prepare(sql){calls.push(sql);return {bind(id){assert.equal(id,'abc');return {all:async()=>({results:[]})}}}}};
 const req=new Request('https://xeno.example/api/intelligence/audit?projectId=abc');
 const res=await intelligenceApi(req,db,'/api/intelligence/audit');
 assert.equal(res.status,200);assert.match(calls[0],/WHERE project_id=\?/);
});
