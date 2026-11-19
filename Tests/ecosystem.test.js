import test from 'node:test';import assert from 'node:assert/strict';import {chooseSpecialists,SPECIALISTS,runEcosystem} from '../src/ecosystem.js';
test('all seven original specialists registered',()=>assert.equal(Object.keys(SPECIALISTS).length,7));
test('auto routing picks software specialist',()=>assert.deepEqual(chooseSpecialists('debug my app'),['WORKSHOP']));
test('manual routing rejects duplicate agents',()=>assert.throws(()=>chooseSpecialists('x',['FORGE','FORGE'])));
test('manual routing rejects unknown agent',()=>assert.throws(()=>chooseSpecialists('x',['ADMIN'])));
test('auto routing caps specialists',()=>assert.ok(chooseSpecialists('engineer research budget code music').length<=3));
test('invalid project id rejected before DB access',async()=>await assert.rejects(()=>runEcosystem({db:{},env:{},projectId:'bad',request:'test'})));
