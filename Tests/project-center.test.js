import test from 'node:test';
import assert from 'node:assert/strict';
import {projectCenter,projectContext} from '../src/project-center.js';
const db={prepare(sql){return {bind(...params){return {async first(){return null},async all(){return {results:[]}}}}}}};
test('project command center rejects unknown projects without modifying records',async()=>{
 const id='11111111-1111-4111-8111-111111111111';
 const r=await projectCenter(new Request('https://example.com/api/project-center/'+id),db,'/api/project-center/'+id);
 assert.equal(r.status,404);assert.equal((await r.json()).error,'Project not found');
});
test('project context does not leak another project on missing ID',async()=>{
 const result=await projectContext(db,'11111111-1111-4111-8111-111111111111');assert.equal(result,null);
});
