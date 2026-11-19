import test from 'node:test';
import assert from 'node:assert/strict';
import {analyzeStoredFile} from '../src/file-understanding.js';
function fixture(mime='application/pdf',size=3){return {DB:{prepare:()=>({bind:()=>({first:async()=>({id:'11111111-1111-4111-8111-111111111111',name:'report.pdf',mime,size})})})},FILES:{get:async()=>({arrayBuffer:async()=>new TextEncoder().encode('abc').buffer})},GEMINI_API_KEY:'test-key'}}
const id='11111111-1111-4111-8111-111111111111';
const req=(prompt)=>new Request('https://xeno.example/api/files/'+id+'/analyze',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({prompt})});
test('Gemini analyzes a stored PDF only after explicit request',async()=>{let sent;const res=await analyzeStoredFile(req('Summarize the report'),fixture(),id,{fetchFn:async(url,opts)=>{sent=JSON.parse(opts.body);return new Response(JSON.stringify({candidates:[{content:{parts:[{text:'Three findings.'}]}}]}),{status:200})}});assert.equal(res.status,200);assert.equal((await res.json()).answer,'Three findings.');assert.equal(sent.contents[0].parts[1].inline_data.mime_type,'application/pdf')});
test('DOCX explicitly reports unsupported rather than hallucinating',async()=>{const res=await analyzeStoredFile(req('Summarize'),fixture('application/vnd.openxmlformats-officedocument.wordprocessingml.document'),id);assert.equal(res.status,415)});
test('Large files are rejected',async()=>{const res=await analyzeStoredFile(req('Summarize'),fixture('application/pdf',8*1024*1024),id);assert.equal(res.status,413)});
test('Missing Gemini key does not disclose private files',async()=>{const env=fixture();delete env.GEMINI_API_KEY;const res=await analyzeStoredFile(req('Summarize'),env,id);assert.equal(res.status,503)});
