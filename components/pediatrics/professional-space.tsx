import { useState, type FormEvent } from 'react';
import type { Doctor, Pricing } from './types';
import s from './portal.module.css';

export const portalPanels = [
  { id: 'overview', label: 'Overview', title: 'Your professional space', reviewerOnly: false },
  { id: 'profile', label: 'Registration', title: 'Professional registration', reviewerOnly: false },
  { id: 'patients', label: 'Shared records', title: 'Authorized records', reviewerOnly: false },
  { id: 'verification', label: 'Verification', title: 'Professional verification', reviewerOnly: true },
] as const;

export function ProfessionalOverview({ profile, authorizationCount, busy, onRegistration, onCopyProfile }: {
  profile: Doctor | null;
  authorizationCount: number;
  busy: boolean;
  onRegistration: () => void;
  onCopyProfile: () => void;
}) {
  return <>
    <div className={s.grid}>
      <section className={s.card}>
        <h2>{profile?.name ?? 'Introduce yourself'}</h2>
        <span className={s.badge}>{profile?.status ?? 'No application yet'}</span>
        <p>{profile
          ? 'Your professional verification determines whether families can find you.'
          : 'Prepare your identity, Belgian professional registration, visa, pediatric qualification and insurance evidence.'}</p>
        <button className={s.button} onClick={onRegistration}>View registration</button>
      </section>
      <section className={s.card}>
        <h2>Permission comes first.</h2>
        <p>A QR code identifies you. It never authorizes records. Families choose each child, each category and an expiry date, and can revoke access.</p>
        <strong>{authorizationCount} active authorizations</strong>
      </section>
    </div>
    <section className={s.card}>
      <h2>Connect through your profile.</h2>
      <p>Show your QR code in the iPhone professional area, or share your profile link. A parent can then choose which medical records to share with you in BooDoo.</p>
      {profile?.status === 'verified' && profile.profileCode && <button className={s.secondary} disabled={busy} onClick={onCopyProfile}>Copy profile link</button>}
    </section>
  </>;
}

const centsToEuros=(value:number|undefined|null)=>value==null?'':(value/100).toFixed(2);
const eurosToCents=(value:string)=>{const amount=Number(value.replace(',','.'));return Number.isFinite(amount)&&amount>=0&&amount<=10000?Math.round(amount*100):null;};
const money=(value:number|undefined|null,currency:string)=>value==null?'—':new Intl.NumberFormat(undefined,{style:'currency',currency}).format(value/100);

export function ProfessionalProfile({ profile, busy, onAvailability, onSavePricing }: {
  profile: Doctor;
  busy: boolean;
  onAvailability: () => void;
  onSavePricing: (pricing: Pricing|null) => Promise<void>;
}) {
  const pricing=profile.pricing??null;
  const [currency,setCurrency]=useState(pricing?.currency??'EUR');
  const [messageEnabled,setMessageEnabled]=useState(pricing?.messageCents!=null);
  const [messagePrice,setMessagePrice]=useState(centsToEuros(pricing?.messageCents));
  const [videoEnabled,setVideoEnabled]=useState(pricing?.videoCents!=null);
  const [videoPrice,setVideoPrice]=useState(centsToEuros(pricing?.videoCents));
  const [videoMinutes,setVideoMinutes]=useState(String(pricing?.videoMinutes??30));
  const [monthlyEnabled,setMonthlyEnabled]=useState(pricing?.monthlyCents!=null);
  const [monthlyPrice,setMonthlyPrice]=useState(centsToEuros(pricing?.monthlyCents));
  const [cancellation,setCancellation]=useState(pricing?.cancellationPolicy??'');
  const [formError,setFormError]=useState('');
  const save=async(event:FormEvent<HTMLFormElement>)=>{
    event.preventDefault();setFormError('');
    const messageCents=messageEnabled?eurosToCents(messagePrice):null;
    const videoCents=videoEnabled?eurosToCents(videoPrice):null;
    const monthlyCents=monthlyEnabled?eurosToCents(monthlyPrice):null;
    if((messageEnabled&&messageCents==null)||(videoEnabled&&videoCents==null)||(monthlyEnabled&&monthlyCents==null))return setFormError('Enter valid prices in euros.');
    if((messageCents!=null||videoCents!=null||monthlyCents!=null)&&!cancellation.trim())return setFormError('Add a cancellation policy before publishing prices.');
    const value:Pricing={currency:currency.trim().toUpperCase(),messageCents,videoCents,videoMinutes:videoCents==null?null:Number(videoMinutes),monthlyCents,cancellationPolicy:cancellation.trim()||null};
    await onSavePricing(value.messageCents==null&&value.videoCents==null&&value.monthlyCents==null?null:value);
  };
  return <section className={`${s.card} ${s.form}`}>
    <h2>{profile.name}</h2>
    <span className={s.badge}>{profile.status}</span>
    <p>{profile.biography}</p>
    <p>{profile.city} · {profile.languages}</p>
    {profile.status === 'verified' && <button disabled={busy} className={s.secondary} onClick={onAvailability}>
      {profile.acceptingPatients ? 'Pause new connections' : 'Accept new connections'}
    </button>}
    {profile.status==='verified'&&<>
      <h2>Published consultation prices</h2>
      {pricing&&<dl><dt>Message consultation</dt><dd>{money(pricing.messageCents,pricing.currency)}</dd><dt>Video consultation</dt><dd>{pricing.videoCents==null?'—':`${money(pricing.videoCents,pricing.currency)} · ${pricing.videoMinutes??30} min`}</dd><dt>Monthly plan</dt><dd>{money(pricing.monthlyCents,pricing.currency)}</dd><dt>Cancellation</dt><dd>{pricing.cancellationPolicy||'Not published'}</dd></dl>}
      {!pricing&&<p className={s.muted}>No prices published yet. Families will see that prices are still to be confirmed.</p>}
      <form className={s.form} onSubmit={save}>
        <label>Currency (ISO)<input value={currency} maxLength={3} onChange={event=>setCurrency(event.target.value)}/></label>
        <label className={s.check}><input type="checkbox" checked={messageEnabled} onChange={event=>setMessageEnabled(event.target.checked)}/>Message consultation</label>
        {messageEnabled&&<label>Price in euros<input type="number" min="0" max="10000" step="0.01" required value={messagePrice} onChange={event=>setMessagePrice(event.target.value)}/></label>}
        <label className={s.check}><input type="checkbox" checked={videoEnabled} onChange={event=>setVideoEnabled(event.target.checked)}/>Video consultation</label>
        {videoEnabled&&<><label>Price in euros<input type="number" min="0" max="10000" step="0.01" required value={videoPrice} onChange={event=>setVideoPrice(event.target.value)}/></label><label>Duration<select value={videoMinutes} onChange={event=>setVideoMinutes(event.target.value)}><option value="20">20 minutes</option><option value="30">30 minutes</option></select></label></>}
        <label className={s.check}><input type="checkbox" checked={monthlyEnabled} onChange={event=>setMonthlyEnabled(event.target.checked)}/>Monthly plan</label>
        {monthlyEnabled&&<label>Price in euros<input type="number" min="0" max="10000" step="0.01" required value={monthlyPrice} onChange={event=>setMonthlyPrice(event.target.value)}/></label>}
        <label>Cancellation policy<textarea required={messageEnabled||videoEnabled||monthlyEnabled} value={cancellation} onChange={event=>setCancellation(event.target.value)} placeholder="Example: free cancellation up to 24 hours before."/></label>
        {formError&&<p className={s.error}>{formError}</p>}
        <div className={s.actions}><button className={s.button} disabled={busy}>Publish prices</button><button type="button" className={s.danger} disabled={busy} onClick={()=>void onSavePricing(null)}>Remove prices</button></div>
      </form>
    </>}
    <p className={s.muted}>Changes to verified identity or credentials require a new professional review. Prices are display-only in this development portal; payments and booking are not active.</p>
  </section>;
}
