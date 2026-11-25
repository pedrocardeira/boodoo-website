import { useEffect, useState, type FormEvent } from 'react';
import type { Doctor, Pricing, Status } from './types';
import type { PediatricsPortalAction } from '@/lib/pediatrics/portal-policy';
import s from './portal.module.css';

export const portalPanels = [
  { id: 'overview', label: 'Overview', title: 'Your professional space', reviewerOnly: false },
  { id: 'profile', label: 'Registration', title: 'Professional registration', reviewerOnly: false },
  { id: 'consultations', label: 'Consultations', title: 'Consultation workspace', reviewerOnly: false },
  { id: 'patients', label: 'Shared records', title: 'Authorized records', reviewerOnly: false },
  { id: 'verification', label: 'Verification', title: 'Professional verification', reviewerOnly: true },
] as const;

export function ProfessionalOverview({ profile, status, authorizationCount, busy, onRegistration, onCopyProfile }: {
  profile: Doctor | null;
  status?: Status | null;
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
    <section className={s.card}>
      <h2>Consultation workspace</h2>
      <p>You work from this browser portal. Families use the iPhone app to request and pay for a service; a video consultation opens the same protected web room for both sides.</p>
      <span className={s.badge}>Payments and calls are {status?.paymentsEnabled ? 'enabled in this environment' : 'waiting for launch configuration'}</span>
    </section>
  </>;
}

const centsToEuros=(value:number|undefined|null)=>value==null?'':(value/100).toFixed(2);
const eurosToCents=(value:string)=>{const amount=Number(value.replace(',','.'));return Number.isFinite(amount)&&amount>=0&&amount<=10000?Math.round(amount*100):null;};
const money=(value:number|undefined|null,currency:string)=>value==null?'—':new Intl.NumberFormat(undefined,{style:'currency',currency}).format(value/100);
const MESSAGE_RESPONSE_OPTIONS=[{hours:4,label:'Within 4 hours'},{hours:12,label:'Within 12 hours'},{hours:24,label:'Within 24 hours'},{hours:48,label:'Within 48 hours'},{hours:72,label:'Within 72 hours'}] as const;
const SUGGESTED_PRICES={message:'25.00',video20:'45.00',video30:'60.00',monthly:'90.00'} as const;
const responseLabel=(hours:number|undefined|null)=>MESSAGE_RESPONSE_OPTIONS.find(option=>option.hours===hours)?.label??'Not set';

export function ProfessionalProfile({ profile, status, busy, onAvailability, onSavePricing, onSavePhoto }: {
  profile: Doctor;
  status?: Status | null;
  busy: boolean;
  onAvailability: () => void;
  onSavePricing: (pricing: Pricing|null) => Promise<void>;
  onSavePhoto: (photo: File|null) => Promise<void>;
}) {
  const pricing=profile.pricing??null;
  const [currency,setCurrency]=useState(pricing?.currency??'EUR');
  const [messageEnabled,setMessageEnabled]=useState(pricing?.messageCents!=null);
  const [messagePrice,setMessagePrice]=useState(centsToEuros(pricing?.messageCents));
  const [messageResponseHours,setMessageResponseHours]=useState(String(pricing?.messageResponseHours??24));
  const [videoEnabled,setVideoEnabled]=useState(pricing?.videoCents!=null);
  const [videoPrice,setVideoPrice]=useState(centsToEuros(pricing?.videoCents));
  const [videoMinutes,setVideoMinutes]=useState(String(pricing?.videoMinutes??30));
  const [monthlyEnabled,setMonthlyEnabled]=useState(pricing?.monthlyCents!=null);
  const [monthlyPrice,setMonthlyPrice]=useState(centsToEuros(pricing?.monthlyCents));
  const [cancellation,setCancellation]=useState(pricing?.cancellationPolicy??'');
  const [photoFile,setPhotoFile]=useState<File|null>(null);
  const [formError,setFormError]=useState('');
  const save=async(event:FormEvent<HTMLFormElement>)=>{
    event.preventDefault();setFormError('');
    const messageCents=messageEnabled?eurosToCents(messagePrice):null;
    const responseHours=messageEnabled?Number(messageResponseHours):null;
    const videoCents=videoEnabled?eurosToCents(videoPrice):null;
    const monthlyCents=monthlyEnabled?eurosToCents(monthlyPrice):null;
    if((messageEnabled&&messageCents==null)||(videoEnabled&&videoCents==null)||(monthlyEnabled&&monthlyCents==null))return setFormError('Enter valid prices in euros.');
    if(messageEnabled&&!MESSAGE_RESPONSE_OPTIONS.some(option=>option.hours===responseHours))return setFormError('Choose an expected response time for message consultations.');
    if((messageCents!=null||videoCents!=null||monthlyCents!=null)&&!cancellation.trim())return setFormError('Add a cancellation policy before publishing prices.');
    const value:Pricing={currency:currency.trim().toUpperCase(),messageCents,messageResponseHours:responseHours,videoCents,videoMinutes:videoCents==null?null:Number(videoMinutes),monthlyCents,cancellationPolicy:cancellation.trim()||null};
    await onSavePricing(value.messageCents==null&&value.videoCents==null&&value.monthlyCents==null?null:value);
  };
  const applySuggestion=(service:'message'|'video'|'monthly')=>{
    if(service==='message'){setMessageEnabled(true);setMessagePrice(SUGGESTED_PRICES.message);setMessageResponseHours('24');}
    if(service==='video'){setVideoEnabled(true);setVideoPrice(videoMinutes==='20'?SUGGESTED_PRICES.video20:SUGGESTED_PRICES.video30);}
    if(service==='monthly'){setMonthlyEnabled(true);setMonthlyPrice(SUGGESTED_PRICES.monthly);}
  };
  return <section className={`${s.card} ${s.form}`}>
    <div style={{display:'flex',gap:18,alignItems:'center',flexWrap:'wrap'}}>
      {profile.photoURL?<img src={profile.photoURL} alt={`${profile.name} profile`} style={{width:88,height:88,borderRadius:'50%',objectFit:'cover',border:'1px solid #c9d9d0'}}/>:<div aria-hidden="true" style={{width:88,height:88,borderRadius:'50%',display:'grid',placeItems:'center',background:'#e9efe9',color:'#31574d',fontSize:30,fontWeight:700}}>{profile.name.slice(0,1).toUpperCase()}</div>}
      <div><h2>{profile.name}</h2><span className={s.badge}>{profile.status}</span></div>
    </div>
    <p>{profile.biography}</p>
    <p>{profile.city} · {profile.languages}</p>
    {profile.status === 'verified' && <>
      <div className={s.notice} role="status"><strong>{profile.acceptingPatients?'Accepting new patients':'Not accepting new patients'}</strong><p>{profile.acceptingPatients?'Families can request one of your published services.':'New requests are paused; existing authorized records remain available.'}</p></div>
      <button type="button" disabled={busy} className={s.secondary} onClick={onAvailability}>
        {profile.acceptingPatients ? 'Stop accepting new patients' : 'Accept new patients'}
      </button>
      <section className={s.notice} aria-label="Professional profile photo">
        <strong>Profile photo</strong>
        <p>Use a clear head-and-shoulders photo. It is visible to families with your verified profile. JPG, PNG or WebP, maximum 5 MB.</p>
        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={event=>setPhotoFile(event.target.files?.[0]??null)}/>
        <div className={s.actions}><button type="button" className={s.secondary} disabled={busy||!photoFile} onClick={()=>{if(photoFile)void onSavePhoto(photoFile);}}>Save photo</button>{profile.photoURL&&<button type="button" className={s.danger} disabled={busy} onClick={()=>void onSavePhoto(null)}>Remove photo</button>}</div>
      </section>
    </>}
    {profile.status==='verified'&&<>
      <h2>Published consultation prices</h2>
      <div className={s.notice} role="status">
        {status?.paymentsEnabled
          ? 'Payments and appointment requests are enabled for this test environment. Clinical chat and video rooms appear only after the corresponding service is paid and confirmed.'
          : 'Prices are published for families to compare. Payments and appointment requests are waiting for this environment to be enabled.'}
      </div>
      {pricing&&<dl><dt>Message consultation</dt><dd>{money(pricing.messageCents,pricing.currency)}</dd><dt>Expected message response</dt><dd>{pricing.messageCents==null?'—':responseLabel(pricing.messageResponseHours)}</dd><dt>Video consultation</dt><dd>{pricing.videoCents==null?'—':`${money(pricing.videoCents,pricing.currency)} · ${pricing.videoMinutes??30} min`}</dd><dt>Monthly plan</dt><dd>{money(pricing.monthlyCents,pricing.currency)}</dd><dt>Cancellation</dt><dd>{pricing.cancellationPolicy||'Not published'}</dd></dl>}
      {!pricing&&<p className={s.muted}>No prices published yet. Families will see that prices are still to be confirmed.</p>}
      <div className={s.notice}><strong>Suggested starting prices · editable</strong><p>These are only starting points; choose the services you actually provide and change any amount before publishing.</p><div className={s.actions}><button type="button" className={s.secondary} onClick={()=>applySuggestion('message')}>Message · €25 · reply within 24h</button><button type="button" className={s.secondary} onClick={()=>applySuggestion('video')}>Video · €{videoMinutes==='20'?'45':'60'} · {videoMinutes} min</button><button type="button" className={s.secondary} onClick={()=>applySuggestion('monthly')}>Monthly · €90</button></div></div>
      <div className={s.notice}><strong>What you must provide</strong><ul><li>Currency and a price for every service you enable.</li><li>An expected response time for message consultations.</li><li>Video duration (20 or 30 minutes) when video is enabled.</li><li>A clear cancellation policy before prices can be published.</li></ul></div>
      <form className={s.form} onSubmit={save}>
        <label>Currency (ISO)<input value={currency} maxLength={3} onChange={event=>setCurrency(event.target.value)}/></label>
        <label className={s.check}><input type="checkbox" checked={messageEnabled} onChange={event=>setMessageEnabled(event.target.checked)}/>Message consultation</label>
        {messageEnabled&&<><label>Price ({currency.trim().toUpperCase()||'ISO'})<input type="number" min="0" max="10000" step="0.01" required value={messagePrice} onChange={event=>setMessagePrice(event.target.value)}/></label><label>Expected response time<select value={messageResponseHours} onChange={event=>setMessageResponseHours(event.target.value)}>{MESSAGE_RESPONSE_OPTIONS.map(option=><option key={option.hours} value={option.hours}>{option.label}</option>)}</select><span className={s.muted}>This commitment is shown to families before they request a message consultation.</span></label></>}
        <label className={s.check}><input type="checkbox" checked={videoEnabled} onChange={event=>setVideoEnabled(event.target.checked)}/>Video consultation</label>
        {videoEnabled&&<><label>Price ({currency.trim().toUpperCase()||'ISO'})<input type="number" min="0" max="10000" step="0.01" required value={videoPrice} onChange={event=>setVideoPrice(event.target.value)}/></label><label>Duration<select value={videoMinutes} onChange={event=>setVideoMinutes(event.target.value)}><option value="20">20 minutes</option><option value="30">30 minutes</option></select></label></>}
        <label className={s.check}><input type="checkbox" checked={monthlyEnabled} onChange={event=>setMonthlyEnabled(event.target.checked)}/>Monthly plan</label>
        {monthlyEnabled&&<label>Price ({currency.trim().toUpperCase()||'ISO'})<input type="number" min="0" max="10000" step="0.01" required value={monthlyPrice} onChange={event=>setMonthlyPrice(event.target.value)}/></label>}
        <label>Cancellation policy<textarea required={messageEnabled||videoEnabled||monthlyEnabled} value={cancellation} onChange={event=>setCancellation(event.target.value)} placeholder="Example: free cancellation up to 24 hours before."/></label>
        {formError&&<p className={s.error}>{formError}</p>}
        <div className={s.actions}><button className={s.button} disabled={busy}>Publish prices</button><button type="button" className={s.danger} disabled={busy} onClick={()=>void onSavePricing(null)}>Remove prices</button></div>
      </form>
    </>}
    <p className={s.muted}>Changes to verified identity or credentials require a new professional review. Published prices are reconstructed by the server at checkout; the browser never sets a consultation amount.</p>
  </section>;
}

type ConsultationCall = <T = unknown>(action: PediatricsPortalAction, fields?: Record<string, unknown>) => Promise<T>;
type Slot = { id: string; startAt: number; minutes: number; bookingStatus?: string; bookingID?: string };
type Booking = { id: string; startAt: number; minutes: number; status: string; paymentStatus: string; childID: string; pricing?: { currency?: string; amountCents?: number; serviceType?: string } };
type Thread = { id: string; status: string; paymentStatus?: string; childID: string; createdAt?: number; updatedAt?: number };
type ThreadMessage = { id: string; senderUID: string; text: string; createdAt: number };

export function ConsultationWorkspace({ status, busy, call }: { status: Status; busy: boolean; call: ConsultationCall }) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedThreadID, setSelectedThreadID] = useState<string | null>(null);
  const [messages, setMessages] = useState<ThreadMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [slotAt, setSlotAt] = useState('');
  const [minutes, setMinutes] = useState('30');
  const [message, setMessage] = useState('');
  const load = async () => {
    try {
      const [schedule, current] = await Promise.all([
        call<{ slots: Slot[] }>('schedule'),
        call<{ bookings: Booking[] }>('bookings', { asDoctor: true }),
      ]);
      const conversations = await call<{ threads: Thread[] }>('threads', { asDoctor: true });
      setSlots(schedule.slots ?? []); setBookings(current.bookings ?? []); setThreads(conversations.threads ?? []); setMessage('');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not load consultations.'); }
  };
  useEffect(() => { if (status.clinicalEnabled) void load(); }, [status.clinicalEnabled]);
  const saveSlot = async (event: FormEvent) => {
    event.preventDefault();
    const startAt = Date.parse(slotAt);
    if (!Number.isFinite(startAt) || ![20, 30].includes(Number(minutes))) { setMessage('Choose a future date and a 20 or 30 minute duration.'); return; }
    try {
      const next = [...slots.filter(slot => slot.startAt > Date.now()), { id: crypto.randomUUID(), startAt, minutes: Number(minutes) }]
        .sort((a, b) => a.startAt - b.startAt);
      await call('saveSlots', { slots: next });
      setSlotAt(''); await load();
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not save the slot.'); }
  };
  const openRoom = async (bookingID: string) => {
    try {
      const room = await call<{ url: string }>('createVideoRoom', { bookingID });
      if (!room.url.startsWith('https://')) throw new Error('The video room URL is not secure.');
      window.open(room.url, '_blank', 'noopener,noreferrer');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'The video room is not available.'); }
  };
  const openThread = async (threadID: string) => {
    setSelectedThreadID(threadID); setMessages([]);
    try {
      const result = await call<{ messages: ThreadMessage[] }>('threadMessages', { threadID });
      setMessages(result.messages ?? []);
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not load messages.'); }
  };
  const sendMessage = async (event: FormEvent) => {
    event.preventDefault();
    const threadID = selectedThreadID;
    const text = draft.trim();
    if (!threadID || !text || busy) return;
    try {
      await call('sendThreadMessage', { threadID, messageID: crypto.randomUUID(), text });
      setDraft('');
      const result = await call<{ messages: ThreadMessage[] }>('threadMessages', { threadID });
      setMessages(result.messages ?? []);
      await load();
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not send the message.'); }
  };
  return <>
    <section className={s.card}>
      <h2>Where consultations happen</h2>
      <p>You stay in this browser portal. Families book and pay from the iPhone app; a confirmed video booking opens the same protected browser room for both participants.</p>
      {!status.paymentsEnabled && <div className={s.notice}>Payments are not configured for this environment, so no booking or room can be opened yet.</div>}
      {status.paymentsEnabled && !status.videoEnabled && <div className={s.notice}>Payments are configured, but video is still waiting for a provider/TURN room configuration.</div>}
    </section>
    {status.clinicalEnabled && <section className={s.card}>
      <h2>Video availability</h2>
      <form className={s.form} onSubmit={saveSlot}>
        <label>New slot<input type="datetime-local" required value={slotAt} onChange={event => setSlotAt(event.target.value)} /></label>
        <label>Duration<select value={minutes} onChange={event => setMinutes(event.target.value)}><option value="20">20 minutes</option><option value="30">30 minutes</option></select></label>
        <button className={s.button} disabled={busy || !status.videoEnabled}>Save availability</button>
      </form>
      {slots.length > 0 && <ul>{slots.map(slot => <li key={slot.id}>{new Date(slot.startAt).toLocaleString()} · {slot.minutes} min</li>)}</ul>}
    </section>}
    {status.clinicalEnabled && <section className={s.card}>
      <h2>Bookings</h2>
      {bookings.length === 0 ? <p className={s.muted}>No bookings yet.</p> : bookings.map(booking => <div className={s.patient} key={booking.id}>
        <div><strong>{new Date(booking.startAt).toLocaleString()}</strong><p className={s.muted}>Child · {booking.childID.slice(0, 8)} · {booking.status} · {booking.paymentStatus}</p></div>
        {booking.status === 'confirmed' && booking.paymentStatus === 'paid' && <button className={s.secondary} disabled={busy || !status.videoEnabled} onClick={() => void openRoom(booking.id)}>Open video room</button>}
      </div>)}
    </section>}
    {status.clinicalEnabled && <section className={s.card}>
      <h2>Clinical messages</h2>
      <p className={s.muted}>Messages are available only after the family has completed payment. Do not use this channel for emergencies.</p>
      {threads.length === 0 ? <p className={s.muted}>No message consultations yet.</p> : <>
        <div className={s.actions}>{threads.map(thread => <button key={thread.id} type="button" className={selectedThreadID === thread.id ? s.button : s.secondary} onClick={() => void openThread(thread.id)}>
          Child · {thread.childID.slice(0, 8)} · {thread.paymentStatus === 'paid' ? thread.status : 'payment pending'}
        </button>)}</div>
        {selectedThreadID && <div className={s.form}>
          {messages.length === 0 ? <p className={s.muted}>No messages available yet. The conversation may still be awaiting payment.</p> : <div aria-live="polite">{messages.map(item => <article className={s.notice} key={item.id}><strong>Message</strong><p>{item.text}</p><small>{new Date(item.createdAt).toLocaleString()}</small></article>)}</div>}
          <form className={s.form} onSubmit={sendMessage}><label>Reply<textarea value={draft} maxLength={8000} onChange={event => setDraft(event.target.value)} /></label><button className={s.button} disabled={busy || !draft.trim()}>Send message</button></form>
        </div>}
      </>}
    </section>}
    {message && <p className={s.error} role="alert">{message}</p>}
  </>;
}
