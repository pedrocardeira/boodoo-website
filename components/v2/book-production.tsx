'use client';
import { useState } from 'react';
import type { User } from 'firebase/auth';
import { ref, uploadBytes } from 'firebase/storage';
import type { Album } from '@/lib/v2/model';
import { cloudAlbumsEnabled, firebaseClient } from '@/lib/v2/firebase';
import { createPrintProof, SQUARE_HARDCOVER } from '@/lib/v2/print-pdf';
export function BookProduction({album,user,demo,dirty}:{album:Album;user:User|null;demo:boolean;dirty:boolean}) {
 const [busy,setBusy]=useState(false),[error,setError]=useState(''),[message,setMessage]=useState(''),[printProgress,setPrintProgress]=useState('');
 const shippingCountries=(process.env.NEXT_PUBLIC_BOOK_SHIPPING_COUNTRIES||'US').split(',').filter(v=>/^[A-Z]{2}$/.test(v));
 const [country,setCountry]=useState(shippingCountries[0]||'US');
 const checkoutAvailable=process.env.NEXT_PUBLIC_BOOK_CHECKOUT_ENABLED==='true';
 const meaningful=album.moments.filter(m=>m.title.trim()||m.notes.trim()||m.image);
 const meetsEditorialGoals=meaningful.length>=8&&meaningful.filter(m=>m.image).length>=3&&new Set(meaningful.map(m=>m.date.slice(0,10))).size>=3;
 const issues:string[]=[]; // Product and signed-artwork approval are enforced by the checkout endpoint.
 async function exportPrintProof(){
  setBusy(true);setError('');setMessage('');setPrintProgress('Preparing pages...');
  try{
    const print=await createPrintProof(album,SQUARE_HARDCOVER,(i,total)=>setPrintProgress('Rendering page '+i+' of '+total));
    const url=URL.createObjectURL(print.blob);
    const link=document.createElement('a');link.href=url;
    link.download='boodoo-'+album.id+'-'+print.pageCount+'-page-print-proof.pdf';
    link.click();setTimeout(()=>URL.revokeObjectURL(url),60000);
    if(!demo&&user&&cloudAlbumsEnabled&&!dirty){
      if(print.blob.size>75*1024*1024)throw new Error('The print PDF exceeds the safe 75 MB upload limit. Download succeeded; reduce the album size.');
      setPrintProgress('Saving private print proof...');
      const storagePath='users/'+user.uid+'/webAlbumProofs/'+album.id+'/'+crypto.randomUUID()+'.pdf';
      await uploadBytes(ref(firebaseClient().storage,storagePath),print.blob,{
        contentType:'application/pdf',
        customMetadata:{
          albumUpdatedAt:album.updatedAt,
          pageCount:String(print.pageCount),
          widthMm:String(print.widthMm),
          heightMm:String(print.heightMm),
          kind:'boodoo-print-proof',
        },
      });
      setMessage(print.pageCount+'-page PDF downloaded and securely uploaded for staff print review. Proof path: '+storagePath+'. Checkout remains subject to print approval.');
    }else{
      setMessage(print.pageCount+'-page 300dpi RGB PDF downloaded for review. Save your album to upload a private proof. This is not an approved production order.');
    }
  }catch(e){setError(e instanceof Error?e.message:'Unable to generate print PDF.');}
  finally{setBusy(false);setPrintProgress('');}
 }
 async function startCheckout(){
  if(!user||demo||dirty||!meetsEditorialGoals||issues.length) {
    setError('Save the completed album and resolve all print checks before checkout.');return;
  }
  setBusy(true);setError('');
  try {
    const token=await user.getIdToken();
    const response=await fetch('/api/stripe/checkout',{
      method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},
      body:JSON.stringify({albumId:album.id,countryCode:country}),
    });
    const result=await response.json() as {url?:string;error?:string};
    if(!response.ok||!result.url)throw new Error(result.error||'Checkout is not available.');
    if(!result.url.startsWith('https://checkout.stripe.com/'))throw new Error('Invalid checkout URL.');
    window.location.assign(result.url);
  }catch(e){setError(e instanceof Error?e.message:'Could not start checkout.');setBusy(false);}
 }

 return <section className="family-card"><h3>Print review & ordering</h3><p>A PDF proof preserves your selected pages, photographs and framing. It needs product-specific review before an order can be approved.</p><button className="v2-button outline small" disabled={busy||!album.moments.length} onClick={()=>void exportPrintProof()}>Generate print PDF</button>{printProgress&&<p role="status">{printProgress}</p>}{error&&<p role="alert" className="error-message">{error}</p>}{message&&<p role="status" className="info-message">{message}</p>}{checkoutAvailable&&!demo&&user?<><label>Ship to<select value={country} onChange={e=>setCountry(e.target.value)}>{shippingCountries.map(c=><option key={c}>{c}</option>)}</select></label><button className="v2-button small" disabled={busy||dirty||!meetsEditorialGoals} onClick={()=>void startCheckout()}>Order approved printed book</button><p>Save changes first. Checkout requires staff approval of this exact saved version. Stripe verifies payment before printing begins.</p></>:<p className="quiet-note">Printed ordering is awaiting production setup and approval. You can keep editing, saving and reviewing your book.</p>}</section>;
}
