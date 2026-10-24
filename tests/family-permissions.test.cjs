const {test}=require('node:test');
const assert=require('node:assert/strict');
const {familyPermission}=require('./compiled/family-permissions');
test('only current full or legacy membership permits family history',()=>{
 assert.equal(familyPermission(true,{}),'full');
 assert.equal(familyPermission(true,{accessMode:'full'}),'full');
 assert.equal(familyPermission(true,{accessMode:'input'}),'input');
 for(const accessMode of ['owner','admin','',null,{},false])assert.equal(familyPermission(true,{accessMode}),'removed');
 assert.equal(familyPermission(false,{accessMode:'full'}),'removed');
 assert.equal(familyPermission(false,{accessMode:'input'}),'removed');
});
