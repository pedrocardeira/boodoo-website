'use client';
import { useEffect, useRef, useState } from 'react';
import type { User } from 'firebase/auth';
import { listAll, getMetadata, getBlob, ref } from 'firebase/storage';
import { firebaseClient } from '@/lib/v2/firebase';

import { publishedBooksPath, publishedBookFromMetadata, originalBookPDF, maxPublishedBookBytes, type PublishedBook as Book } from '@/lib/v2/published-books';
export default function PublishedBooks({user,childID}:{user:User|null;childID:string}) {
 const [books,setBooks]=useState<Book[]>([]),[error,setError]=useState(''),[busy,setBusy]=useState(false);
 const [opened,setOpened]=useState<{url:string;title:string}|null>(null),[revision,setRevision]=useState(0);
 const generation=useRef(0);const blobURL=useRef<string|null>(null);
 function release(){if(blobURL.current){URL.revokeObjectURL(blobURL.current);blobURL.current=null;}}
 useEffect(()=>{let cancelled=false;generation.current++;release();setOpened(null);setBooks([]);setError('');setBusy(false);
  if(!user||!childID)return;
  setBusy(true);
  (async()=>{try{
   const storage=firebaseClient().storage;
   const result=await listAll(ref(storage,publishedBooksPath(user.uid,childID)));
   const values=await Promise.all(result.items.map(async item=>publishedBookFromMetadata(await getMetadata(item),user.uid,childID)));
   if(!cancelled)setBooks(values.filter((b):b is Book=>b!==null).sort((a,b)=>b.date.localeCompare(a.date)));
  }catch{if(!cancelled)setError('Could not read your iPhone books. Check that this is the same account used to send them, and that private web-library access is enabled.');}
  finally{if(!cancelled)setBusy(false);}})();
  return()=>{cancelled=true;generation.current++;release();};
 },[user?.uid,childID,revision]);
 async function open(book:Book){if(!user||!childID)return;const current=generation.current;setBusy(true);setError('');
  try{
   const blob=await getBlob(ref(firebaseClient().storage,book.path),maxPublishedBookBytes);
   if(current!==generation.current)return;
   const pdf=await originalBookPDF(blob);
   if(current!==generation.current)return;
   release();const url=URL.createObjectURL(pdf);blobURL.current=url;setOpened({url,title:book.title});
  }catch{if(current===generation.current)setError('The PDF could not be opened. No book was changed. Please try again.');}
  finally{if(current===generation.current)setBusy(false);}
 }
 if(!user)return null;
 return <section className="family-card"><div className="card-heading"><h2>Books sent from your iPhone</h2><button className="text-link" disabled={busy} onClick={()=>setRevision(r=>r+1)}>Refresh books</button></div>
  <p className="quiet-note">In the app, open your book’s Review album screen and choose Send PDF to my web library. Sign in here with that same account. Each upload is a private snapshot; editing the app book does not change an earlier copy.</p>
  {error&&<p role="alert" className="error-message">{error}</p>}{busy&&<p role="status">Loading your books…</p>}
  {!busy&&!error&&!books.length&&<p>No PDFs sent from this account for this child yet.</p>}
  <div className="record-table">{books.map(book=><div className="record-row" key={book.path}><span>{book.title}<small>{new Date(book.date).toLocaleDateString()} · {book.pages} pages</small></span><button className="v2-button outline small" disabled={busy} onClick={()=>void open(book)}>View / download PDF</button></div>)}</div>
  {opened&&<section aria-label="Original iPhone PDF"><div className="premium-actions"><h3>{opened.title}</h3><a className="v2-button" href={opened.url} download="boodoo-book.pdf">Download original PDF</a><a className="text-link" href={opened.url} target="_blank" rel="noreferrer">Open PDF in a new tab</a><button className="text-link" onClick={()=>{release();setOpened(null);}}>Close PDF</button></div><p className="quiet-note">This is the original iPhone PDF. Page breaks and layout are preserved. If your browser cannot show the embedded preview, open or download the file.</p><iframe src={opened.url} title={opened.title+' · original PDF'} style={{width:'100%',height:'75vh',border:0,marginTop:20}}/></section>}
 </section>;
}
