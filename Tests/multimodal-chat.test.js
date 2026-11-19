import test from 'node:test';import assert from 'node:assert/strict';
import {parseFileQuestion,ANALYZABLE_MIMES} from '../src/file-understanding.js';
test('MP4 and MOV are recognized for bounded analysis',()=>{assert.ok(ANALYZABLE_MIMES.has('video/mp4'));assert.ok(ANALYZABLE_MIMES.has('video/quicktime'))});
test('explicit chat analysis targets named files',()=>{assert.deepEqual(parseFileQuestion('analyze file demo.mp4: What happens at the end?'),{filename:'demo.mp4',prompt:'What happens at the end?'});assert.equal(parseFileQuestion('What happened today?'),null)});
test('transcription request recognized',()=>{assert.equal(parseFileQuestion('transcribe voice.m4a').filename,'voice.m4a')});
