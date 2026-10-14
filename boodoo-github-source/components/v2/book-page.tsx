'use client';
import { useEffect, useRef, useState } from 'react';
import type { Moment, MomentFraming } from '@/lib/v2/model';
import { cropGeometry, isSpread, meaningfulTitle, type Composition, type Page, type Slot } from '@/lib/v2/book-composition';

export function PhotoSlot({moment,slot,active,onSelect,onChange}:{moment?:Moment;slot:Slot;active?:boolean;onSelect?:()=>void;onChange?:(f:MomentFraming)=>void}){
 const el=useRef<HTMLDivElement>(null);const [size,setSize]=useState({w:1,h:1});const [natural,setNatural]=useState({w:moment?.width||1,h:moment?.height||1});const [failed,setFailed]=useState(false);
 const pointers=useRef(new Map<number,{x:number;y:number}>());const drag=useRef({x:0,y:0,distance:0,framing:slot.framing});
 useEffect(()=>{setFailed(false);},[moment?.image]);
 useEffect(()=>{const node=el.current;if(!node)return;const r=new ResizeObserver(entries=>{const b=entries[0].contentRect;setSize({w:b.width,h:b.height});});r.observe(node);return()=>r.disconnect();},[]);
 const g=cropGeometry(natural.w,natural.h,size.w,size.h,slot.framing);
 function baseline(){const ps=[...pointers.current.values()];drag.current={x:ps[0]?.x||0,y:ps[0]?.y||0,distance:ps.length===2?Math.hypot(ps[0].x-ps[1].x,ps[0].y-ps[1].y):0,framing:{...slot.framing}};}
 return <div ref={el} className={'premium-photo'+(active?' active':'')} role={onSelect?'button':undefined} tabIndex={onSelect?0:undefined} aria-label={onSelect?'Edit photograph '+(moment?.title||'Untitled'):undefined} onClick={onSelect} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onSelect?.();}}}
 onPointerDown={e=>{if(!onChange)return;onSelect?.();e.currentTarget.setPointerCapture(e.pointerId);pointers.current.set(e.pointerId,{x:e.clientX,y:e.clientY});baseline();}}
 onPointerMove={e=>{if(!onChange||!pointers.current.has(e.pointerId))return;pointers.current.set(e.pointerId,{x:e.clientX,y:e.clientY});const ps=[...pointers.current.values()],b=drag.current;if(ps.length===2&&b.distance){const d=Math.hypot(ps[0].x-ps[1].x,ps[0].y-ps[1].y);onChange({...b.framing,zoom:Math.min(4,Math.max(1,b.framing.zoom*d/b.distance))});}else{const bounds=cropGeometry(natural.w,natural.h,size.w,size.h,b.framing);onChange({...b.framing,offsetX:Math.min(1,Math.max(-1,b.framing.offsetX+(e.clientX-b.x)/(bounds.maxX||Infinity))),offsetY:Math.min(1,Math.max(-1,b.framing.offsetY+(e.clientY-b.y)/(bounds.maxY||Infinity)))});}}}
 onPointerUp={e=>{pointers.current.delete(e.pointerId);baseline();}} onPointerCancel={e=>{pointers.current.delete(e.pointerId);baseline();}}>
 {moment?.image&&!failed?<img src={moment.image} draggable={false} alt={meaningfulTitle(moment.title)||'Family photograph'} onError={()=>setFailed(true)} onLoad={e=>setNatural({w:e.currentTarget.naturalWidth,h:e.currentTarget.naturalHeight})} style={{width:g.width,height:g.height,left:'50%',top:'50%',transform:`translate(-50%, -50%) translate(${g.x}px, ${g.y}px)`}}/>:<span className="premium-unavailable">Photograph unavailable · original reference retained</span>}
 </div>;
}
export function BookPage({page,composition,moments,activeSlot,onSelect,onCrop}:{page:Page;composition:Composition;moments:Moment[];activeSlot?:number;onSelect?:(i:number)=>void;onCrop?:(i:number,f:MomentFraming)=>void}){
 const texts=page.sourceIDs.map(id=>({id,...(composition.textEdits[id]??moments.find(m=>m.id===id)??{title:'',notes:''})})).filter(m=>meaningfulTitle(m.title)||m.notes);
 return <div className={'premium-page layout-'+page.layout+(isSpread(page)?' facing':'')+(texts.length?' has-text':'')+(!page.slots.length?' no-photo':'')}>
 <div className="premium-photo-grid">{page.slots.map((s,i)=><PhotoSlot key={s.id} slot={s} moment={moments.find(m=>m.id===s.momentID)} active={activeSlot===i} onSelect={onSelect?()=>onSelect(i):undefined} onChange={onCrop?f=>onCrop(i,f):undefined}/>)}</div>
 {texts.length>0&&<div className="premium-page-text">{texts.map(m=><div key={m.id}>{meaningfulTitle(m.title)&&<h3>{meaningfulTitle(m.title)}</h3>}{m.notes&&<p>{m.notes}</p>}</div>)}</div>}
 {isSpread(page)&&<div className="premium-gutter" aria-label="Illustrative center gutter"/>}
 </div>;
}
export function BookCover({composition,moments,back=false,title,onCrop}:{composition:Composition;moments:Moment[];back?:boolean;title:string;onCrop?:(f:MomentFraming)=>void}){const id=back?composition.backMomentID:composition.coverMomentID;return <div className="premium-cover">{id&&<PhotoSlot moment={moments.find(m=>m.id===id)} slot={{id:'cover',momentID:id,framing:back?composition.backFraming:composition.coverFraming}} onChange={onCrop}/>}<div className="premium-cover-type"><span className="premium-brand"><img src="/icons/boodoo-mark.png" alt=""/>BooDoo</span>{!back&&<><h2>{title}</h2><p>{composition.ageTitle}</p></>}</div></div>;}
