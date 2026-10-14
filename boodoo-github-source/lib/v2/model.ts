export type RecordData = { id: string; [key: string]: unknown };
export type Child = RecordData & { babyName: string; birthDateTimestamp: number };
export type MomentFraming = {
  layout: "entirePhoto" | "fillFrame";
  zoom: number;
  offsetX: number;
  offsetY: number;
};
export type Moment = {
  id: string;
  title: string;
  notes: string;
  date: string;
  image?: string;
  hasPhotoReference?: boolean;
  width?: number;
  height?: number;
  // Presentation-only, shared with iOS. Never modify source photo bytes.
  photoFraming?: MomentFraming;
};
export type Album = { id: string; title: string; childID: string; style: string; period: string; updatedAt: string; moments: Moment[] };
export const bookStyles = ['Boodoo Classic', 'Soft Childhood', 'Minimal', 'Color Story'];
export const periods = ['Our First Month', 'Three Months Together', 'Six Months Together', 'My First Year', 'My Second Year', 'My Third Year', 'My Fourth Year', 'My Fifth Year', 'Annual Book', 'Custom Book'];
export const collectionNames = ['feeds', 'sleep', 'nursing', 'diapers', 'stools', 'growth', 'milestones', 'careEntries'] as const;
export type CollectionName = typeof collectionNames[number];
export type FamilyRecords = Record<CollectionName, RecordData[]>;
export function emptyRecords(): FamilyRecords { return {feeds:[],sleep:[],nursing:[],diapers:[],stools:[],growth:[],milestones:[],careEntries:[]}; }
export function recordTime(row: RecordData): number { const raw = row.date ?? row.startDate; return typeof raw === 'string' ? new Date(raw).getTime() : 0; }
export function todaysStats(records: FamilyRecords, now = new Date()) {
  const start = new Date(now); start.setHours(0,0,0,0); const end=new Date(start); end.setDate(end.getDate()+1);
  const today=(r:RecordData)=>recordTime(r)>=+start&&recordTime(r)<+end;
  const sleepMinutes=records.sleep.reduce((total,r)=> { const a=Date.parse(String(r.startDate));const b=Date.parse(String(r.endDate));return total+(Number.isFinite(a)&&Number.isFinite(b)?Math.max(0,Math.min(b,+end)-Math.max(a,+start))/60000:0);},0);
  return { feedCount:records.feeds.filter(today).length+records.nursing.filter(today).length, milk:records.feeds.filter(today).reduce((a,r)=>a+Number(r.amount||0),0),sleepMinutes:Math.round(sleepMinutes),diapers:records.diapers.filter(today).length,memories:records.milestones.length };
}
export function albumIssues(album:Album):string[]{
 const issues:string[]=[];if(!album.title.trim())issues.push('Give your book a title.');if(album.moments.length===0)issues.push('Add at least one memory to your book.');
 album.moments.forEach((m,i)=>{if(!m.title.trim()&&!m.notes.trim()&&!m.image)issues.push(`Page ${i+2} is empty.`);if(m.image&&(!m.width||!m.height))issues.push(`Page ${i+2}: image resolution needs checking.`);else if(m.image&&Math.min(m.width!,m.height!)<1800)issues.push(`Page ${i+2}: use a higher-resolution photo for a 6-inch image at 300 dpi.`);});
 return issues;
}
export function addMonthsClamped(date:Date,months:number){const d=new Date(date);const day=d.getDate();d.setDate(1);d.setMonth(d.getMonth()+months);const last=new Date(d.getFullYear(),d.getMonth()+1,0).getDate();d.setDate(Math.min(day,last));return d;}
export function selectPeriod(moments:Moment[],period:string,birthDateTimestamp:number,now=new Date(),customStart?:string,customEnd?:string){
 let start=new Date(birthDateTimestamp*1000);let end=new Date(start);const index=periods.indexOf(period);
 if(index===9){start=customStart?new Date(customStart+'T00:00:00'):new Date(0);end=customEnd?new Date(+new Date(customEnd+'T00:00:00')+86400000):now;}
 else if(index<=3&&index>=0){end=addMonthsClamped(end,[1,3,6,12][index]);}
 else {const age=Math.max(0,now.getFullYear()-start.getFullYear()-(now.getMonth()<start.getMonth()||(now.getMonth()===start.getMonth()&&now.getDate()<start.getDate())?1:0));const offset=index===8?age:index-3;start.setFullYear(start.getFullYear()+offset);end=new Date(start);end.setFullYear(end.getFullYear()+1);}
 return moments.filter(m=>Date.parse(m.date)>=+start&&Date.parse(m.date)<Math.min(+end,+now+1)).sort((a,b)=>Date.parse(a.date)-Date.parse(b.date));
}
export const demoChildren:Child[]=[{id:'demo-ella',babyName:'Ella',birthDateTimestamp:Date.parse('2026-04-10')/1000},{id:'demo-noah',babyName:'Noah',birthDateTimestamp:Date.parse('2023-04-12')/1000}];
export function demoRecords(childID:string):FamilyRecords{const r=emptyRecords();const d=new Date();const at=(h:number,m=0)=>{const x=new Date(d);x.setHours(h,m,0,0);return x.toISOString()};if(childID==='demo-noah'){r.milestones=[{id:'n1',title:'A very big little adventure',notes:'The whole walk to the park, holding hands and asking a hundred questions.',date:at(9)}];r.growth=[{id:'g1',date:at(8),weightKg:15.2,heightCm:98}];return r;}
 r.feeds=[{id:'f1',date:at(7,15),amount:150,sourceRaw:'formula'},{id:'f2',date:at(10,30),amount:120,sourceRaw:'pumped'},{id:'f3',date:at(13,15),amount:150,sourceRaw:'formula'}];r.sleep=[{id:'s1',startDate:at(0),endDate:at(6,45)},{id:'s2',startDate:at(9),endDate:at(10)}];r.diapers=[{id:'d1',date:at(7,20),type:'wet'},{id:'d2',date:at(11),type:'mixed'}];
 r.milestones=[{id:'m1',title:'That little morning smile',notes:'You woke up, saw us, and gave us the biggest smile. A tiny moment we never want to forget.',date:at(7)},{id:'m2',title:'A whole new world of flavors',notes:'Your first taste of avocado. The expression on your face said it all.',date:new Date(+d-86400000*4).toISOString()},{id:'m3',title:'The best place in the world',notes:'An afternoon nap in our arms, with nowhere else we needed to be.',date:new Date(+d-86400000*9).toISOString()}];r.growth=[{id:'g1',date:new Date(+d-86400000*60).toISOString(),weightKg:5.8,heightCm:61},{id:'g2',date:new Date(+d-86400000*30).toISOString(),weightKg:6.3,heightCm:63},{id:'g3',date:at(8),weightKg:6.8,heightCm:65}];return r;}
// Never default a six-month-old child to a First Year book. Keep the chapter
// catalog consistent with BooDoo iOS and count Moments already synced from it.
export function ageCompletedBookPeriods(birthDateTimestamp:number,now=new Date()):string[] {
 const birth=new Date(birthDateTimestamp*1000);
 if(!Number.isFinite(+birth)||+birth>+now)return [];
 const thresholds=[1,3,6,12,24,36,48,60];
 return thresholds.flatMap((months,i)=>addMonthsClamped(birth,months)<=now?[periods[i]]:[]);
}
export function readyBookPeriods(child:Child,moments:Moment[],now=new Date()):string[] {
 return ageCompletedBookPeriods(child.birthDateTimestamp,now).filter(period=>
   selectPeriod(moments,period,child.birthDateTimestamp,now)
     .filter(m=>m.title.trim()||m.notes.trim()||m.image||m.hasPhotoReference).length>=3
 );
}
export function newAlbum(child:Child,moments:Moment[],period?:string,now=new Date()):Album {
 const chosen=period??readyBookPeriods(child,moments,now).at(-1)??'Custom Book';
 return{id:crypto.randomUUID(),title:`${child.babyName}’s ${chosen.replace(/^(My|Our) /, "").toLowerCase()}`,childID:child.id,style:bookStyles[0],period:chosen,updatedAt:now.toISOString(),moments:selectPeriod(moments,chosen,child.birthDateTimestamp,now)};
}
