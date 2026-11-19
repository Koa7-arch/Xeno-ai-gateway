import test from 'node:test';import assert from 'node:assert/strict';import {parseWorkspaceCommand} from '../src/workspace-commands.js';import {makePdf,makeDocx} from '../src/file-hub.js';
test('explicit project command',()=>assert.deepEqual(parseWorkspaceCommand('create physical project named Ranch House'),{kind:'project',type:'physical',name:'Ranch House'}));
test('explicit task command',()=>assert.equal(parseWorkspaceCommand('add task Design foundation to project Ranch House').kind,'project_item'));
test('no unprompted mutation',()=>assert.equal(parseWorkspaceCommand('Tell me about my ranch house'),null));
test('pdf signature',()=>assert.equal(new TextDecoder().decode(makePdf('Report','Some content').slice(0,8)),'%PDF-1.4'));
test('docx zip signature',()=>assert.deepEqual(Array.from(makeDocx('Report','Some content').slice(0,4)),[80,75,3,4]));
