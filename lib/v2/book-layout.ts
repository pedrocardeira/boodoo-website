import { isSpread, meaningfulTitle, type Page, type Composition } from './book-composition';
import type { Moment } from './model';
export type Rect = {x:number;y:number;w:number;h:number};
export function pageTexts(page:Page,c:Composition,moments:Moment[]) {
 return page.sourceIDs.map(id=>({id,...(c.textEdits[id]??moments.find(m=>m.id===id)??{title:'',notes:''})})).map(m=>({...m,title:meaningfulTitle(m.title)})).filter(m=>m.title||m.notes);
}
/** Normalized geometry shared by the interactive preview and PDF renderer. */
export function pageGeometry(page:Page,hasText:boolean):{photos:Rect[];text?:Rect;overlay:boolean} {
 let area:Rect={x:0,y:0,w:1,h:1},text:Rect|undefined,overlay=false;
 if(hasText){
  if(!page.slots.length) text={x:0,y:0,w:1,h:1};
  else if(page.layout==='photoCaption'){area.h=.76;text={x:0,y:.76,w:1,h:.24};}
  else if(page.layout==='milestoneLeft'||page.layout==='spreadMilestone'){const w=isSpread(page)?.5:.35;area={x:w,y:0,w:1-w,h:1};text={x:0,y:0,w,h:1};}
  else if(page.layout==='milestoneRight'){area.w=.65;text={x:.65,y:0,w:.35,h:1};}
  else {text={x:0,y:.65,w:1,h:.35};overlay=true;}
 }
 let cells:Rect[]=[{x:0,y:0,w:1,h:1}];
 if(page.layout==='twoVertical'||page.layout==='spreadPair')cells=[{x:0,y:0,w:.5,h:1},{x:.5,y:0,w:.5,h:1}];
 if(page.layout==='twoHorizontal')cells=[{x:0,y:0,w:1,h:.5},{x:0,y:.5,w:1,h:.5}];
 if(page.layout==='three'||page.layout==='spreadLarge')cells=[{x:0,y:0,w:.6,h:1},{x:.6,y:0,w:.4,h:.5},{x:.6,y:.5,w:.4,h:.5}];
 if(page.layout==='four')cells=[{x:0,y:0,w:.5,h:.5},{x:.5,y:0,w:.5,h:.5},{x:0,y:.5,w:.5,h:.5},{x:.5,y:.5,w:.5,h:.5}];
 if(page.layout==='spreadEditorial')cells=[{x:0,y:0,w:1.25/3.25,h:1},{x:1.25/3.25,y:0,w:1/3.25,h:.5},{x:2.25/3.25,y:0,w:1/3.25,h:.5},{x:1.25/3.25,y:.5,w:2/3.25,h:.5}];
 return {photos:cells.slice(0,page.slots.length).map(r=>({x:area.x+r.x*area.w,y:area.y+r.y*area.h,w:r.w*area.w,h:r.h*area.h})),text,overlay};
}
