const {test}=require('node:test');const assert=require('node:assert/strict');
const {resolveFirebaseConfig}=require('./compiled/firebase-public-config');
test('registered website configuration enables login without Vercel env overrides',()=>{
 const c=resolveFirebaseConfig({apiKey:'',authDomain:'',projectId:'boodoo-e5d55'});
 assert.equal(c.projectId,'boodoo-e5d55');assert.ok(c.apiKey);assert.match(c.appId,/:web:/);
 assert.equal(c.storageBucket,'boodoo-e5d55.firebasestorage.app');
});
test('alternate projects never inherit production keys or app identifiers',()=>{
 const c=resolveFirebaseConfig({projectId:'demo-isolated'});
 assert.deepEqual(c,{projectId:'demo-isolated'});
});
