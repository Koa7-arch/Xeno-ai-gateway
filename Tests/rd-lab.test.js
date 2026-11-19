import test from 'node:test';
import assert from 'node:assert/strict';
import {calculate} from '../src/rd-lab.js';
test('area and volume calculations',()=>{assert.equal(calculate({operation:'rectangle_area',a:4,b:5}).result,20);assert.equal(calculate({operation:'cylinder_volume',a:2,b:3}).result,12*Math.PI)});
test('force and pressure calculations',()=>{assert.equal(calculate({operation:'force',a:5,b:9.81}).result,49.050000000000004);assert.equal(calculate({operation:'pressure',a:100,b:2}).result,50)});
test('reject invalid values and division by zero',()=>{assert.throws(()=>calculate({operation:'divide',a:1,b:0}),/zero/);assert.throws(()=>calculate({operation:'force',a:'5',b:2}),/Finite/);assert.throws(()=>calculate({operation:'unknown',a:2,b:2}),/Unsupported/)});
