'use client';
import { useCallback,useEffect,useRef,useState,type FormEvent } from 'react';
import { onAuthStateChanged,signInWithEmailAndPassword,createUserWithEmailAndPassword,sendEmailVerification,signOut,type User } from 'firebase/auth';
import { ref,uploadBytes,getBlob } from 'firebase/storage';
import { prepareSession,firebaseClient,friendlyError } from '@/lib/v2/firebase';
import { scopeLabels,fieldLabels,type Doctor,type Status,type Patient } from './types';
import { ProfessionalOverview, ProfessionalProfile, portalPanels } from './professional-space';
import type { PediatricsPortalAction } from '@/lib/pediatrics/portal-policy';
import s from './portal.module.css';

const errors:Record<string,string>={portal_disabled:'The professional portal is not enabled in this environment.',pediatric_service_not_launched:'Pediatrics is not enabled on this server yet.',registration_not_launched:'Professional registration is not open yet.',clinical_access_not_launched:'Clinical record sharing is not enabled yet.',verified_email_required:'Please verify your email before applying.',professional_checks_required:'Complete all professional verification checks.',insurance_expired:'The approval cannot extend beyond the verified insurance expiry.',guardian_access_required:'The guardian no longer authorizes this access.',consent_required:'The family has revoked or not granted this access.',scope_denied:'The family has not authorized this category.',doctor_unavailable:'This professional profile is not currently eligible.',profile_review_required:'This profile requires review before it can be changed.',invalid_number:'Check the values and dates.',action_not_available:'This action is not available in this workspace.',invalid_text:'Complete all required fields.',service_unavailable:'The service is unavailable. Please retry shortly.'};
type RecordRow={id:string;data:Record<string,unknown>};
const day=(value:number)=>new Date(value).toLocaleDateString();

export default function PediatricsPortal(){
  const [user,setUser]=useState<User|null>(null),[ready,setReady]=useState(false),[email,setEmail]=useState(''),[password,setPassword]=useState('');
  const [status,setStatus]=useState<Status|null>(null),[profile,setProfile]=useState<Doctor|null>(null),[patients,setPatients]=useState<Patient[]>([]),[queue,setQueue]=useState<Doctor[]>([]);
  const [panel,setPanel]=useState('overview'),[busy,setBusy]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState('');
  const [recordTarget,setRecordTarget]=useState<{linkID:string;scope:string}|null>(null),[records,setRecords]=useState<RecordRow[]>([]);
  const generation=useRef(0);
  useEffect(()=>{let unsubscribe:(()=>void)|undefined;let disposed=false;
    prepareSession().then(({auth})=>{if(disposed)return;unsubscribe=onAuthStateChanged(auth,current=>{
      generation.current++;setUser(current);setStatus(null);setProfile(null);setPatients([]);setQueue([]);setRecords([]);setRecordTarget(null);setError('');setNotice('');setReady(true);
    });}).catch(e=>{setError(friendlyError(e));setReady(true);});
    return()=>{disposed=true;generation.current++;unsubscribe?.();};
  },[]);
  const call=useCallback(async<T,>(action:PediatricsPortalAction,fields:Record<string,unknown>={}):Promise<T>=>{
    const current=firebaseClient().auth.currentUser;
    if(!current||current.isAnonymous)throw Error('Sign in with a registered BooDoo account.');
    const id=current.uid,run=generation.current;
    const token=await current.getIdToken();
    const response=await fetch('/api/pediatrics',{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify({...fields,action}),cache:'no-store'});
    const result=await response.json();
    if(generation.current!==run||firebaseClient().auth.currentUser?.uid!==id)throw Error('Your account changed. Please reopen this page.');
    if(!response.ok)throw Error(errors[result.error]??'The request could not be completed. Please check your details and retry.');
    return result;
  },[]);
  const refresh=useCallback(async()=>{
    const next=await call<Status>('status');setStatus(next);
    if(!next.enabled)return;
    const result=await call<{profile:Doctor|null}>('profile');setProfile(result.profile);
    if(result.profile?.status==='verified'&&next.clinicalEnabled)setPatients((await call<{patients:Patient[]}>('patients')).patients);
    if(next.reviewer)setQueue((await call<{profiles:Doctor[]}>('reviewQueue')).profiles);
  },[call]);
  useEffect(()=>{if(user)refresh().catch(e=>setError(e.message));},[user,refresh]);
  useEffect(()=>{
    if(!recordTarget)return;
    let cancelled=false;setRecords([]);
    const read=async()=>{try{const data=await call<{records:RecordRow[]}>('medicalRecords',recordTarget);if(!cancelled)setRecords(data.records);}catch(e){if(!cancelled){setRecords([]);setError(e instanceof Error?e.message:'Access unavailable');}}};
    void read();const timer=setInterval(read,15000);
    const hide=()=>{if(document.hidden){cancelled=true;setRecords([]);setRecordTarget(null);}};
    document.addEventListener('visibilitychange',hide);
    return()=>{cancelled=true;clearInterval(timer);document.removeEventListener('visibilitychange',hide);};
  },[recordTarget,call]);
  async function run(fn:()=>Promise<void>){if(busy)return;setBusy(true);setError('');setNotice('');try{await fn();}catch(e){setError(e instanceof Error?e.message:'Could not complete the request.');}finally{setBusy(false);}}
  async function authenticate(event:FormEvent,create=false){event.preventDefault();await run(async()=>{
    const {auth}=await prepareSession();
    if(create){const result=await createUserWithEmailAndPassword(auth,email,password);await sendEmailVerification(result.user);setNotice('Verification email sent. Verify your email before submitting professional documents.');}
    else await signInWithEmailAndPassword(auth,email,password);
    setPassword('');
  });}
  const title=portalPanels.find(item=>item.id===panel)?.title??'Your professional space';
  return <main id="main" className={s.shell}>
    <aside className={s.rail}><div><div className={s.brand}><img src="/icons/boodoo-mark.png" alt=""/>BooDoo</div><p className={s.eyebrow}>Pediatrics · Belgium</p></div>
      {user&&<nav className={s.nav} aria-label="Professional portal">{portalPanels.filter(item=>!item.reviewerOnly||status?.reviewer).map(({id,label})=><button key={id} aria-current={panel===id?'page':undefined} onClick={()=>setPanel(id)}>{label}</button>)}</nav>}
      <small>Private professional workspace.<br/>Medical record access requires family consent.</small>
    </aside>
    <section className={s.content}>
      <header className={s.header}><div><span className={s.badge}>Development · not a live consultation service</span><h1>{user?title:'Care starts with trust.'}</h1><p>{user?'Your profile and the medical records families choose to share.':'A private workspace for verified pediatricians. Sign in with your registered BooDoo account.'}</p></div>
      {user&&<button className={s.secondary} onClick={()=>void signOut(firebaseClient().auth)}>Sign out</button>}</header>
      {error&&<div className={s.error} role="alert">{error}</div>}{notice&&<div className={s.notice} role="status">{notice}</div>}
      {!ready?<p>Opening your workspace…</p>:!user?<form className={`${s.card} ${s.form} ${s.login}`} onSubmit={authenticate}>
        <h2>Welcome to BooDoo Pediatrics</h2><label>Email<input type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)}/></label>
        <label>Password<input type="password" minLength={8} autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)}/></label>
        <button className={s.button} disabled={busy}>Sign in</button><button type="button" className={s.secondary} disabled={busy||!email||password.length<8} onClick={e=>void authenticate(e,true)}>Create professional account</button>
        <p className={s.muted}>Account creation does not publish a medical profile. Every application must be checked before it appears to families.</p>
      </form>:!status?.enabled?<section className={s.card}><h2>Registration is being prepared</h2><p>This environment is not connected to an enabled Pediatrics service. Professional profiles and shared medical records are not available here.</p><button className={s.secondary} onClick={()=>void run(refresh)}>Check again</button></section>:<>
        {!user.emailVerified&&<div className={s.notice}>Verify your email before applying. <button className={s.secondary} onClick={()=>void run(async()=>{await sendEmailVerification(user);setNotice('Verification email sent.');})}>Send verification email</button> <button className={s.secondary} onClick={()=>void run(async()=>{await user.reload();await user.getIdToken(true);setNotice(user.emailVerified?'Email verified.':'Email is not verified yet.');})}>I have verified my email</button></div>}
        {panel==='overview'&&<ProfessionalOverview profile={profile} authorizationCount={patients.length} busy={busy} onRegistration={()=>setPanel('profile')} onCopyProfile={()=>void run(async()=>{if(!profile)return;await navigator.clipboard.writeText(`boodoo://pediatrician?code=${profile.profileCode}`);setNotice('Profile link copied. You can show the QR in the iPhone professional area.');})}/>}
        {panel==='profile'&&(profile?.status==='verified'||profile?.status==='suspended'?<ProfessionalProfile profile={profile} busy={busy} onAvailability={()=>void run(async()=>{await call('setAvailability',{acceptingPatients:!profile.acceptingPatients});await refresh();})}/>:status.registrationEnabled?<Registration key={profile?.uid??'new'} profile={profile} busy={busy} onSubmit={fields=>run(async()=>{const file=fields.file as File;delete fields.file;const current=firebaseClient().auth.currentUser;if(!current?.emailVerified)throw Error('Verify your email first.');const ext=file.name.split('.').pop()?.toLowerCase();const normalized=ext==='jpeg'?'jpg':ext;if(!['pdf','jpg','png'].includes(normalized??'')||file.size<1||file.size>10*1024*1024)throw Error('Use a PDF, JPG or PNG up to 10 MB.');const path=`pediatricCredentials/${current.uid}/${crypto.randomUUID()}.${normalized}`;const types:Record<string,string>={pdf:'application/pdf',jpg:'image/jpeg',png:'image/png'};await uploadBytes(ref(firebaseClient().storage,path),file,{contentType:types[normalized!]});await call('register',{...fields,credentialPath:path,country:'BE',requestedRegions:['BE']});await refresh();setNotice('Application submitted for review. Your profile remains private.');})}/>:<p>Registration is not open yet.</p>)}
        {panel==='patients'&&<section className={s.card}><h2>Family-authorized records</h2><p>Only authorized categories are returned. Records are cleared when you leave the tab. Each new request checks current permission.</p>{patients.length===0?<div className={s.empty}>No active authorizations.</div>:patients.map(patient=><div className={s.patient} key={patient.id}><div><strong>Child · {patient.childID.slice(0,8)}</strong><p className={s.muted}>Permission ends {day(patient.expiresAt)}</p></div><div className={s.actions}>{patient.scopes.map(scope=><button className={s.secondary} key={scope} onClick={()=>setRecordTarget({linkID:patient.id,scope})}>{scopeLabels[scope]??scope}</button>)}</div></div>)}</section>}
        {panel==='verification'&&status.reviewer&&<><div className={s.notice}>Approval requires external identity, visa, registration, specialty and insurance checks. Uploading a document is not verification. You cannot approve yourself.</div>{queue.length===0?<section className={s.card}>No pending applications.</section>:queue.map(doctor=><Review key={doctor.uid} doctor={doctor} busy={busy} onDocument={()=>run(async()=>{const path=doctor.verification?.credentialPath;if(!path)throw Error('No private document available.');const blob=await getBlob(ref(firebaseClient().storage,path),10*1024*1024);const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download='professional-evidence';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);})} onReview={fields=>run(async()=>{await call('review',{...fields,doctorUID:doctor.uid});await refresh();setNotice('Review recorded.');})}/>)}</>}
      </>}
    </section>
    {recordTarget&&<div className={s.modal}><section className={s.dialog} role="dialog" aria-modal="true" aria-label="Authorized clinical records"><header><h2>{scopeLabels[recordTarget.scope]}</h2><button className={s.secondary} onClick={()=>{setRecordTarget(null);setRecords([]);}}>Close</button></header>{error&&<p role="alert">{error}</p>}{records.length===0?<p>No records to display.</p>:records.map(record=><article className={s.card} key={record.id}><dl>{Object.entries(record.data).map(([key,value])=><div style={{display:'contents'}} key={key}><dt>{fieldLabels[key]??key}</dt><dd>{typeof value==='object'?JSON.stringify(value):String(value)}</dd></div>)}</dl></article>)}</section></div>}
  </main>;
}

function Registration({profile,busy,onSubmit}:{profile:Doctor|null;busy:boolean;onSubmit:(fields:Record<string,unknown>)=>Promise<void>}){
  const submit=(event:FormEvent<HTMLFormElement>)=>{event.preventDefault();const f=new FormData(event.currentTarget);void onSubmit({name:f.get('name'),city:f.get('city'),languages:f.get('languages'),biography:f.get('biography'),registrationNumber:f.get('registrationNumber'),visaNumber:f.get('visaNumber'),authority:f.get('authority'),insuranceValidUntil:Date.parse(String(f.get('insuranceUntil'))+'T23:59:59Z'),file:f.get('file')});};
  return <form className={`${s.card} ${s.form}`} onSubmit={submit}><h2>Your professional profile</h2><p>Application status: {profile?.status??'new'}. Professional evidence remains private.</p>{[['name','Professional name',profile?.name],['city','City in Belgium',profile?.city],['languages','Consultation languages',profile?.languages]].map(([name,label,value])=><label key={name}>{label}<input name={name} required maxLength={160} defaultValue={value}/></label>)}<label>Biography<textarea name="biography" required maxLength={1600} defaultValue={profile?.biography}/></label><h2>Private verification</h2>{[['registrationNumber','Order of Physicians registration'],['authority','Provincial council'],['visaNumber','Professional visa number']].map(([name,label])=><label key={name}>{label}<input name={name} required maxLength={100}/></label>)}<label>Insurance valid until<input name="insuranceUntil" type="date" required min={new Date(Date.now()+86400000).toISOString().slice(0,10)}/></label><label>Evidence dossier · PDF, JPG or PNG, up to 10 MB<input name="file" type="file" required accept="application/pdf,image/jpeg,image/png"/></label><p className={s.muted}>Include professional identity, registration, visa, pediatric qualification and insurance. Only you and authorized reviewers can retrieve the file.</p><label className={s.check}><input type="checkbox" required/>I confirm these details and documents are mine and accurate.</label><button className={s.button} disabled={busy}>Submit for review</button></form>;
}
function Review({doctor,busy,onDocument,onReview}:{doctor:Doctor;busy:boolean;onDocument:()=>Promise<void>;onReview:(value:Record<string,unknown>)=>Promise<void>}){
  const submit=(event:FormEvent<HTMLFormElement>)=>{event.preventDefault();const f=new FormData(event.currentTarget);void onReview({status:'verified',verificationSource:f.get('source'),verificationExpiresAt:Date.parse(String(f.get('expiry'))+'T23:59:59Z'),licensedRegions:['BE'],identityVerified:f.has('identity'),licenseVerified:f.has('license'),specialistVerified:f.has('specialty'),insuranceVerified:f.has('insurance')});};
  return <form className={`${s.card} ${s.form}`} onSubmit={submit}><h2>{doctor.name}</h2><p>{doctor.city} · {doctor.languages}</p><dl><dt>Registration</dt><dd>{doctor.verification?.registrationNumber}</dd><dt>Visa</dt><dd>{doctor.verification?.visaNumber}</dd><dt>Provincial council</dt><dd>{doctor.verification?.authority}</dd><dt>Insurance expires</dt><dd>{doctor.verification?day(doctor.verification.insuranceValidUntil):'Missing'}</dd></dl><button type="button" className={s.secondary} disabled={busy} onClick={()=>void onDocument()}>Download private evidence</button><label>Verification evidence URL<input type="url" name="source" required placeholder="https://"/></label><label>Approval expires<input type="date" name="expiry" required max={doctor.verification?new Date(doctor.verification.insuranceValidUntil).toISOString().slice(0,10):undefined}/></label>{[['identity','Identity checked'],['license','Belgian visa and active registration checked'],['specialty','Pediatric specialty checked'],['insurance','Insurance checked']].map(([name,label])=><label key={name} className={s.check}><input name={name} type="checkbox" required/>{label}</label>)}<div className={s.actions}><button className={s.button} disabled={busy}>Approve verified profile</button><button type="button" className={s.danger} disabled={busy} onClick={()=>void onReview({status:'rejected'})}>Reject application</button></div></form>;
}
