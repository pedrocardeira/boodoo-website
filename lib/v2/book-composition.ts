import type { Album, Moment, MomentFraming } from './model';
import { addMonthsClamped } from './model';
// Portable v2 page/slot vocabulary matches BooDooBookCompositionV2 on iOS.
// Web additions are optional; original Moment objects are never rewritten.
export const layouts = {
 one: ['1 photo · full bleed',1], twoVertical:['2 photos · side by side',2], twoHorizontal:['2 photos · stacked',2],
 three:['3 photos · editorial',3], four:['4 photos · grid',4], photoCaption:['Photo + caption',1],
 milestoneLeft:['Milestone left',1], milestoneRight:['Milestone right',1],
 spreadPanorama:['Spread · panoramic photo',1], spreadPair:['Spread · two photos',2], spreadLarge:['Spread · hero + supporting',3],
 spreadMilestone:['Spread · photo + milestone',1], spreadEditorial:['Spread · editorial collage',4],
} as const;
export type Layout = keyof typeof layouts;
export type Slot = { id:string; momentID:string; framing:MomentFraming };
export type Page = { id:string; layout:Layout; sourceIDs:string[]; slots:Slot[] };
export type Composition = { version:2; pages:Page[]; coverMomentID?:string; backMomentID?:string; coverFraming:MomentFraming; backFraming:MomentFraming; ageTitle:string; babyName:string; textEdits:Record<string,{title:string;notes:string}> };
export const centered=():MomentFraming=>({layout:'fillFrame',zoom:1,offsetX:0,offsetY:0});
const uid=()=>crypto.randomUUID();
export const slot=(m:Moment):Slot=>({id:uid(),momentID:m.id,framing:m.photoFraming?{...m.photoFraming,layout:'fillFrame'}:centered()});
export const isSpread=(p:Page)=>p.layout.startsWith('spread');
export function meaningfulTitle(title:string){return /^(day memory|daily photo|the story continues)$/i.test(title.trim())?'':title;}
export function completedMonths(birth:Date,date:Date){if(date<birth)return 0;let n=(date.getFullYear()-birth.getFullYear())*12+date.getMonth()-birth.getMonth();if(addMonthsClamped(birth,n)>date)n--;return Math.max(0,n);}
const age=(n:number)=>n===0?'birth':n%12===0?`${n/12} year${n===12?'':'s'}`:`${n} month${n===1?'':'s'}`;
export function ageTitle(birthSeconds:number,moments:Moment[]){const dates=moments.map(m=>new Date(m.date)).filter(d=>Number.isFinite(+d)).sort((a,b)=>+a-+b);if(!dates.length)return 'Our story';const birth=new Date(birthSeconds*1000);const start=completedMonths(birth,dates[0]),end=completedMonths(birth,dates.at(-1)!);return start===end?(start===0?'From birth':`At ${age(start)}`):`From ${age(start)} to ${age(end)}`;}
function page(m:Moment,ids=[m.id]):Page{return {id:uid(),layout:'one',sourceIDs:ids,slots:m.image?[slot(m)]:[]};}
export function makeComposition(album:Album,birth:number,name:string):Composition{
 const ordered=album.moments.filter(m=>m.image||m.hasPhotoReference||m.title.trim()||m.notes.trim()).sort((a,b)=>Date.parse(a.date)-Date.parse(b.date));const pages:Page[]=[];let pending:string[]=[];
 for(const m of ordered){if(!m.image){pending.push(m.id);continue;}const p=page(m,[...pending,m.id]);if(pending.length)p.layout='milestoneLeft';pages.push(p);pending=[];}
 if(pending.length){if(pages.length){pages.at(-1)!.sourceIDs.push(...pending);pages.at(-1)!.layout='milestoneRight';}else pages.push({id:uid(),layout:'photoCaption',sourceIDs:pending,slots:[]});}
 const photos=ordered.filter(m=>m.image);
 return {version:2,pages,...(photos.length?{coverMomentID:photos[0].id,backMomentID:photos.at(-1)!.id}:{}),coverFraming:centered(),backFraming:centered(),ageTitle:ageTitle(birth,ordered),babyName:name,textEdits:{}};
}
export function migrateAlbum(album:Album,birth:number,name:string):Album & {composition:Composition}{
 if(album.composition){if(album.composition.version!==2)throw new Error('This draft uses a newer editor. Keep its backup and open it with the matching version.');return {...album,composition:structuredClone(album.composition)};}
 return {...album,composition:makeComposition(album,birth,name)};
}
// Overflow gets real pages, never hidden slots. Source references survive every operation.
export function changeLayout(c:Composition,index:number,layout:Layout,catalog:Moment[]):Composition{
 const next=structuredClone(c),p=next.pages[index];if(!p)return next;const count=layouts[layout][1];const extra=p.slots.splice(count);p.sourceIDs=p.sourceIDs.filter(id=>!extra.some(s=>s.momentID===id)||p.slots.some(s=>s.momentID===id));p.layout=layout;
 const photos=catalog.filter(m=>m.image);for(let i=p.slots.length;i<count&&photos.length;i++){const m=photos.find(m=>!p.slots.some(s=>s.momentID===m.id))??photos[i%photos.length];p.slots.push(slot(m));if(!p.sourceIDs.includes(m.id))p.sourceIDs.push(m.id);}
 const overflow=extra.map(s=>({id:uid(),layout:'one' as Layout,sourceIDs:[s.momentID],slots:[s]}));next.pages.splice(index+1,0,...overflow);return next;
}
export function joinPages(c:Composition,index:number):Composition{const n=structuredClone(c);const a=n.pages[index],b=n.pages[index+1];if(!a||!b||isSpread(a)||isSpread(b))return n;a.sourceIDs=[...new Set([...a.sourceIDs,...b.sourceIDs])];a.slots.push(...b.slots);a.layout=a.slots.length>2?'spreadEditorial':a.slots.length>1?'spreadPair':'spreadMilestone';n.pages.splice(index+1,1);const extra=a.slots.splice(layouts[a.layout][1]);n.pages.splice(index+1,0,...extra.map(s=>({id:uid(),layout:'one' as Layout,sourceIDs:[s.momentID],slots:[s]})));return n;}
export function splitSpread(c:Composition,index:number):Composition{const n=structuredClone(c),p=n.pages[index];if(!p||!isSpread(p))return n;if(!p.slots.length){p.layout='photoCaption';return n;}const mid=Math.ceil(p.slots.length/2);const left=p.slots.slice(0,mid),right=p.slots.slice(mid);if(!right.length&&left.length)right.push({...left[0],id:uid(),framing:{...left[0].framing}});const rightIDs=right.map(s=>s.momentID);n.pages.splice(index,1,{...p,layout:left.length>1?'twoVertical':'photoCaption',slots:left,sourceIDs:p.sourceIDs.filter(id=>!rightIDs.includes(id)||left.some(s=>s.momentID===id))},{id:uid(),layout:right.length>1?'twoVertical':'one',slots:right,sourceIDs:rightIDs});return n;}
export function replaceSlot(c:Composition,index:number,slotIndex:number,m:Moment):Composition{const n=structuredClone(c),p=n.pages[index],old=p.slots[slotIndex];if(!old||old.momentID===m.id)return n;p.slots[slotIndex]={id:old.id,momentID:m.id,framing:centered()};if(!p.sourceIDs.includes(m.id))p.sourceIDs.push(m.id);if(!n.pages.some(page=>page.slots.some(s=>s.momentID===old.momentID)))n.pages.splice(index+1,0,{id:uid(),layout:'one',sourceIDs:[old.momentID],slots:[old]});return n;}
export function cropGeometry(iw:number,ih:number,w:number,h:number,f:MomentFraming){const scale=Math.max(w/iw,h/ih)*Math.max(1,Math.min(4,f.zoom));const width=iw*scale,height=ih*scale;const maxX=(width-w)/2,maxY=(height-h)/2;return {width,height,x:Math.max(-1,Math.min(1,f.offsetX))*maxX,y:Math.max(-1,Math.min(1,f.offsetY))*maxY,maxX,maxY};}
export function printIssues(album:Album,c:Composition):string[]{const issues=['Printing is locked: verified product dimensions, trim, bleed, gutter, spine and a production renderer are not configured.'];const shown=new Set(c.pages.flatMap(p=>[...p.sourceIDs,...p.slots.map(s=>s.momentID)]));for(const m of album.moments)if(!shown.has(m.id))issues.push(`Memory not represented: ${m.title||m.id}`);for(const [i,p] of c.pages.entries()){if(!p.slots.length)issues.push(`Page ${i+1}: add a photograph before printing.`);for(const s of p.slots){const m=album.moments.find(m=>m.id===s.momentID);if(!m?.image)issues.push(`Page ${i+1}: photo unavailable.`);else if(!m.width||!m.height)issues.push(`Page ${i+1}: source resolution unverified.`);else if(Math.min(m.width,m.height)/s.framing.zoom<1800)issues.push(`Page ${i+1}: crop may be too small for print; effective resolution needs product-specific validation.`);}const length=p.sourceIDs.reduce((n,id)=>{const m=c.textEdits[id]??album.moments.find(m=>m.id===id);return n+(m?.notes.length??0)+(m?.title.length??0);},0);if(length>600)issues.push(`Page ${i+1}: long text needs print typesetting review.`);}if(!c.coverMomentID||!c.backMomentID)issues.push('Choose photographs for both covers.');return issues;}

/** Validate imported backups before state or persistent drafts can be replaced. */
export function validateBackup(value:unknown,childID:string):Album {
 const fail=()=>{throw new Error('Invalid BooDoo backup. Choose a supported draft for this child.');};
 if(!value||typeof value!=='object')return fail();const a=value as Album;
 if(a.childID!==childID||typeof a.id!=='string'||typeof a.title!=='string'||typeof a.style!=='string'||typeof a.period!=='string'||typeof a.updatedAt!=='string'||!Array.isArray(a.moments)||a.moments.length>300)return fail();
 const ids=new Set<string>();for(const m of a.moments){if(!m||typeof m.id!=='string'||ids.has(m.id)||typeof m.title!=='string'||typeof m.notes!=='string'||typeof m.date!=='string'||!Number.isFinite(Date.parse(m.date)))return fail();ids.add(m.id);if(m.image&&(!(typeof m.image==='string')||!(/^(https?:\/\/|\/(?!\/)|data:image\/(jpeg|png|webp);base64,)/.test(m.image))))return fail();}
 if(a.composition){const c=a.composition;if(c.version!==2||!Array.isArray(c.pages)||c.pages.length>1000||typeof c.babyName!=='string'||typeof c.ageTitle!=='string'||!c.textEdits||typeof c.textEdits!=='object')return fail();
 const frame=(f:MomentFraming)=>f&&f.layout==='fillFrame'&&[f.zoom,f.offsetX,f.offsetY].every(Number.isFinite)&&f.zoom>=1&&f.zoom<=4&&Math.abs(f.offsetX)<=1&&Math.abs(f.offsetY)<=1;
 if(!frame(c.coverFraming)||!frame(c.backFraming)||c.coverMomentID&&!ids.has(c.coverMomentID)||c.backMomentID&&!ids.has(c.backMomentID))return fail();
 const pageIDs=new Set<string>();for(const p of c.pages){if(!p||typeof p.id!=='string'||pageIDs.has(p.id)||!Object.hasOwn(layouts,p.layout)||!Array.isArray(p.sourceIDs)||!p.sourceIDs.every(id=>ids.has(id))||!Array.isArray(p.slots)||p.slots.length>layouts[p.layout][1])return fail();pageIDs.add(p.id);const slotIDs=new Set<string>();for(const s of p.slots){if(!s||typeof s.id!=='string'||slotIDs.has(s.id)||!ids.has(s.momentID)||!frame(s.framing))return fail();slotIDs.add(s.id);}}
 for(const [id,t] of Object.entries(c.textEdits))if(!ids.has(id)||!t||typeof t.title!=='string'||typeof t.notes!=='string')return fail();
 }return a;
}
