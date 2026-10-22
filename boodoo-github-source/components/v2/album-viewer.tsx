'use client';
import { useMemo, useState } from 'react';
import { migrateAlbum, isSpread } from '@/lib/v2/book-composition';
import type { Album } from '@/lib/v2/model';
import { BookCover, BookPage } from './book-page';

/** Read-only projection. Never writes migrations or changes back to the saved album. */
export default function AlbumViewer({initial,birthDate,babyName,onClose}:{initial:Album;birthDate:number;babyName:string;onClose:()=>void}) {
 const album=useMemo(()=>migrateAlbum(initial,birthDate,babyName),[initial,birthDate,babyName]);
 const c=album.composition!;const [index,setIndex]=useState(-1);
 function backup(){const url=URL.createObjectURL(new Blob([JSON.stringify(initial,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='boodoo-book-backup.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 return <section className="album-viewer">
  <div className="studio-toolbar"><button className="text-link" onClick={onClose}>← Albums</button><span>VIEW & EXPORT</span></div>
  <h2>{album.title}</h2><p className="quiet-note">Create and edit books in the BooDoo iPhone app. This view keeps the saved book unchanged.</p>
  <div className="premium-actions"><button className="v2-button" onClick={()=>window.print()}>Print / save as PDF</button><button className="v2-button outline" onClick={backup}>Download book backup</button></div>
  <p className="quiet-note">Choose Save as PDF in your browser’s print dialog. This is a personal reading copy, not a supplier-ready print file. The backup preserves all saved content, including text that may not fit a page preview.</p>
  <div className="premium-canvas">{index===-1||index===c.pages.length?<BookCover composition={c} moments={album.moments} title={album.title} back={index===c.pages.length}/>:<BookPage page={c.pages[index]} composition={c} moments={album.moments}/>}</div>
  <div className="page-navigation"><button className="v2-button outline small" disabled={index===-1} onClick={()=>setIndex(i=>i-1)}>Previous page</button><span>{index+2} / {c.pages.length+2}</span><button className="v2-button outline small" disabled={index===c.pages.length} onClick={()=>setIndex(i=>i+1)}>Next page</button></div>
  <div className="page-strip"><button onClick={()=>setIndex(-1)}>Cover</button>{c.pages.map((p,i)=><button key={p.id} onClick={()=>setIndex(i)} aria-pressed={index===i}>{isSpread(p)?'Spread':'Page'} {i+1}</button>)}<button onClick={()=>setIndex(c.pages.length)}>Back cover</button></div>
  <div className="viewer-print-pages"><BookCover composition={c} moments={album.moments} title={album.title}/>{c.pages.map(p=><BookPage key={p.id} page={p} composition={c} moments={album.moments}/>)}<BookCover composition={c} moments={album.moments} title={album.title} back/></div>
 </section>;
}
