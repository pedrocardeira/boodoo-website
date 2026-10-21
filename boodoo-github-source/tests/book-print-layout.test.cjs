const {test}=require('node:test');const assert=require('node:assert/strict');
const {pageGeometry}=require('./compiled/book-layout.js');
const {layouts,centered}=require('./compiled/book-composition.js');
const {createPrintProof}=require('./compiled/print-pdf.js');
function album(layout='one'){
 const moments=Array.from({length:22},(_,i)=>({id:String(i),title:'',notes:'',date:'2026-01-01',image:'/photo'+i,width:12000,height:12000}));
 return {id:'a',childID:'c',title:'Eva',period:'First year',style:'Minimal',updatedAt:'2026-01-02',moments,composition:{version:2,babyName:'Eva Maria',ageTitle:'From birth to 1 year',coverMomentID:'0',backMomentID:'21',coverFraming:centered(),backFraming:centered(),textEdits:{},pages:moments.map(m=>({id:m.id,layout,sourceIDs:[m.id],slots:[{id:m.id,momentID:m.id,framing:centered()}]}))}};
}
test('all layouts have bounded independent photo rectangles',()=>{for(const [layout,[,count]] of Object.entries(layouts)){const p={layout,slots:Array(count).fill({})};const g=pageGeometry(p,true);assert.equal(g.photos.length,count);for(const r of g.photos){assert(r.w>0&&r.h>0);assert(r.x>=0&&r.y>=0&&r.x+r.w<=1.000001&&r.y+r.h<=1.000001);}}});
test('captionless single photo fills entire page',()=>assert.deepEqual(pageGeometry({layout:'photoCaption',slots:[{}]},false).photos,[{x:0,y:0,w:1,h:1}]));
function browser(){
 const draws=[];class Photo {width=12000;height=12000;async decode(){}}
 global.Image=Photo;global.window={location:{origin:'https://boodoo.app'}};global.document={createElement:()=>{const canvas={width:1,height:1};const ctx={fillRect(){},fillText(){},measureText:t=>({width:t.length*30}),drawImage(...a){draws.push(a)},save(){},restore(){},beginPath(){},rect(){},clip(){},createLinearGradient:()=>({addColorStop(){}})};canvas.getContext=()=>ctx;canvas.toBlob=cb=>cb(new Blob([new Uint8Array([255,216,255,217])],{type:'image/jpeg'}));return canvas}};return draws;
}
test('composition PDF uses selected cover, slot crop, physical spread halves and unchanged sources',async()=>{const draws=browser(),a=album();a.composition.pages[0].layout='spreadPanorama';a.composition.pages[1].layout='spreadPair';a.composition.pages[0].slots[0].framing.zoom=2;a.composition.coverMomentID='5';const before=JSON.stringify(a);const result=await createPrintProof(a);assert.equal(result.pageCount,26);assert.equal(JSON.stringify(a),before);assert.equal(draws[0][0].src,'/photo5');const body=await result.blob.text();assert(body.includes('/Count 26'));assert(draws.some(d=>d.length===9&&d[1]>0),'second spread half copied');});
test('odd counts reject without adding filler',async()=>{browser();const a=album();a.composition.pages[0].layout='spreadPanorama';await assert.rejects(()=>createPrintProof(a),/even page count/)});
test('missing images, missing memories and overflowing text fail closed',async()=>{browser();let a=album();delete a.moments[0].image;await assert.rejects(()=>createPrintProof(a),/photograph/);a=album();a.moments.push({...a.moments[0],id:'lost'});await assert.rejects(()=>createPrintProof(a),/not represented/);a=album();a.composition.textEdits['0']={title:'Memory',notes:('a long story ').repeat(3000)};await assert.rejects(()=>createPrintProof(a),/cut|too long/)});
