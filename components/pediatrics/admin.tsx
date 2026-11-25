'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth';
import { getBlob, ref } from 'firebase/storage';
import { prepareSession, firebaseClient } from '@/lib/v2/firebase';
import type { AdminAuditEntry, AdminConfig, AdminCountryConfig, AdminDoctor, AdminFlag, AdminUser, Doctor, Status } from './types';
import type { PediatricsPortalAction } from '@/lib/pediatrics/portal-policy';
import s from './portal.module.css';

const FLAGS: { key: AdminFlag; label: string; description: string }[] = [
  { key: 'enabled', label: 'Pediatrics', description: 'Master switch for the service in this country.' },
  { key: 'registrationEnabled', label: 'Professional registration', description: 'Allows new doctors to submit an application.' },
  { key: 'clinicalEnabled', label: 'Shared records', description: 'Allows consented clinical record access.' },
  { key: 'engagementsEnabled', label: 'Consultations', description: 'Allows chat and appointment workflows.' },
  { key: 'paymentsEnabled', label: 'Payments', description: 'Allows Stripe test payments when secrets are present.' },
  { key: 'videoEnabled', label: 'Video', description: 'Allows paid video rooms when the provider is configured.' },
];
const COUNTRIES = ['BE', 'NL', 'FR', 'DE', 'LU', 'ES', 'PT'];
const flagValue = (config: AdminConfig | null, country: string | null, key: AdminFlag) => {
  if (!config) return false;
  if (country && config.countries[country]) return config.countries[country][key];
  return config[key];
};
const formatDate = (value: number | string | null | undefined) => {
  if (value == null) return '—';
  const date = typeof value === 'number' ? new Date(value) : new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString();
};

type Call = <T = unknown>(action: PediatricsPortalAction, fields?: Record<string, unknown>) => Promise<T>;

export default function PediatricsAdmin() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<Status | null>(null);
  const [config, setConfig] = useState<AdminConfig | null>(null);
  const [doctors, setDoctors] = useState<AdminDoctor[]>([]);
  const [queue, setQueue] = useState<Doctor[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [audit, setAudit] = useState<AdminAuditEntry[]>([]);
  const [search, setSearch] = useState('');
  const [panel, setPanel] = useState<'overview' | 'countries' | 'doctors' | 'users' | 'audit'>('overview');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const call = useCallback(async <T,>(action: PediatricsPortalAction, fields: Record<string, unknown> = {}): Promise<T> => {
    const current = firebaseClient().auth.currentUser;
    if (!current || current.isAnonymous) throw Error('Sign in with your BooDoo administrator account.');
    const token = await current.getIdToken();
    const response = await fetch('/api/pediatrics', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...fields, action }),
      cache: 'no-store',
    });
    const result = await response.json();
    if (!response.ok) {
      const messages: Record<string, string> = {
        admin_required: 'This account is not an administrator.',
        admin_auth_unavailable: 'Firebase Admin user listing is not available yet.',
        authentication_required: 'Sign in again.',
        service_unavailable: 'The service is temporarily unavailable.',
        invalid_configuration: 'Choose at least one valid setting.',
      };
      throw Error(messages[result.error] ?? 'The request could not be completed.');
    }
    return result;
  }, []);

  const refresh = useCallback(async () => {
    const next = await call<Status>('status');
    setStatus(next);
    if (!next.admin) return;
    const [configResult, doctorsResult, queueResult, usersResult, auditResult] = await Promise.all([
      call<{ config: AdminConfig }>('adminConfig'),
      call<{ doctors: AdminDoctor[] }>('adminDoctors'),
      call<{ profiles: Doctor[] }>('reviewQueue'),
      call<{ users: AdminUser[] }>('adminUsers', { search, limit: 100 }),
      call<{ entries: AdminAuditEntry[] }>('adminAudit'),
    ]);
    setConfig(configResult.config);
    setDoctors(doctorsResult.doctors ?? []);
    setQueue(queueResult.profiles ?? []);
    setUsers(usersResult.users ?? []);
    setAudit(auditResult.entries ?? []);
  }, [call, search]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let disposed = false;
    prepareSession().then(({ auth }) => {
      if (disposed) return;
      unsubscribe = onAuthStateChanged(auth, current => {
        setUser(current);
        setStatus(null);
        setReady(true);
        setError('');
      });
    }).catch(errorValue => { setError(errorValue instanceof Error ? errorValue.message : 'Could not open sign in.'); setReady(true); });
    return () => { disposed = true; unsubscribe?.(); };
  }, []);

  useEffect(() => { if (user) refresh().catch(errorValue => setError(errorValue instanceof Error ? errorValue.message : 'Could not load administration.')); }, [user, refresh]);

  const run = async (operation: () => Promise<void>) => {
    if (busy) return;
    setBusy(true); setError(''); setNotice('');
    try { await operation(); } catch (errorValue) { setError(errorValue instanceof Error ? errorValue.message : 'Could not complete the request.'); }
    finally { setBusy(false); }
  };

  const authenticate = async (event: FormEvent) => {
    event.preventDefault();
    await run(async () => { const { auth } = await prepareSession(); await signInWithEmailAndPassword(auth, email, password); setPassword(''); });
  };

  const saveFlags = async (countryCode: string | null, values: Partial<Record<AdminFlag, boolean>>) => {
    await run(async () => {
      await call('adminUpdateConfig', { ...(countryCode ? { countryCode } : {}), ...values });
      await refresh();
      setNotice(countryCode ? `${countryCode} settings saved.` : 'Global settings saved.');
    });
  };

  if (!ready) return <main className={s.shell}><section className={s.content}><p>Opening administration…</p></section></main>;
  if (!user) return <main className={s.shell}><section className={s.content}><header className={s.header}><div><span className={s.badge}>Private administration</span><h1>BooDoo control centre</h1><p>Sign in with the owner account to manage launch regions, professionals and accounts.</p></div></header><form className={`${s.card} ${s.form} ${s.login}`} onSubmit={authenticate}><h2>Administrator sign in</h2><label>Email<input type="email" autoComplete="email" required value={email} onChange={event => setEmail(event.target.value)} /></label><label>Password<input type="password" autoComplete="current-password" required value={password} onChange={event => setPassword(event.target.value)} /></label><button className={s.button} disabled={busy}>Sign in</button>{error && <p className={s.error}>{error}</p>}</form></section></main>;
  if (!status?.admin) return <main className={s.shell}><section className={s.content}><header className={s.header}><div><span className={s.badge}>Private administration</span><h1>Access restricted</h1><p>This account is signed in, but it does not have the BooDoo administrator claim. Doctors and reviewers cannot open this area.</p></div><button className={s.secondary} onClick={() => void signOut(firebaseClient().auth)}>Sign out</button></header><section className={s.card}><h2>Administrator access required</h2><p>Assign <code>pediatricAdmin: true</code> (or <code>boodooAdmin: true</code>) to the owner account in Firebase Authentication, then sign in again.</p></section></section></main>;

  const pending = queue.length;
  const verified = doctors.filter(doctor => doctor.status === 'verified').length;
  const activeUsers = users.filter(item => !item.disabled).length;
  return <main className={s.shell}>
    <aside className={s.rail}><div><div className={s.brand}><img src="/icons/boodoo-mark.png" alt="" />BooDoo</div><p className={s.eyebrow}>Admin · private</p></div><nav className={s.nav} aria-label="Administration"><button aria-current={panel === 'overview' ? 'page' : undefined} onClick={() => setPanel('overview')}>Overview</button><button aria-current={panel === 'countries' ? 'page' : undefined} onClick={() => setPanel('countries')}>Countries</button><button aria-current={panel === 'doctors' ? 'page' : undefined} onClick={() => setPanel('doctors')}>Doctors</button><button aria-current={panel === 'users' ? 'page' : undefined} onClick={() => setPanel('users')}>Users</button><button aria-current={panel === 'audit' ? 'page' : undefined} onClick={() => setPanel('audit')}>Audit log</button></nav><small>Owner-only controls.<br />Clinical data is never listed here.</small></aside>
    <section className={s.content}><header className={s.header}><div><span className={s.badge}>Administrator · server-enforced</span><h1>{panel === 'overview' ? 'BooDoo control centre' : panel[0].toUpperCase() + panel.slice(1)}</h1><p>Manage access and availability without opening family medical records.</p></div><div className={s.actions}><button className={s.secondary} disabled={busy} onClick={() => void run(async () => { await refresh(); setNotice('Data refreshed.'); })}>Refresh</button><button className={s.secondary} onClick={() => void signOut(firebaseClient().auth)}>Sign out</button></div></header>{error && <div className={s.error} role="alert">{error}</div>}{notice && <div className={s.notice} role="status">{notice}</div>}
      {panel === 'overview' && <><div className={s.grid}><section className={s.card}><h2>Launch status</h2><p>Global deployment flags are the safety boundary. Country flags can only narrow them.</p><dl><dt>Environment</dt><dd>Sandbox / preview</dd><dt>Service</dt><dd>{status.enabled ? 'Enabled' : 'Paused'}</dd><dt>Verified doctors</dt><dd>{verified}</dd><dt>Pending approvals</dt><dd>{pending}</dd><dt>Visible accounts</dt><dd>{activeUsers}</dd></dl></section><section className={s.card}><h2>Safety boundary</h2><p>Admin tools show account metadata and professional status. They never display baby records, memories, photos, chats or video content.</p><p className={s.muted}>Payments, consultations and video remain subject to the same server-side launch gates used by the app.</p></section></div><section className={s.card}><h2>Global settings</h2><div className={s.adminFlags}>{FLAGS.map(flag => <label className={s.check} key={flag.key}><input type="checkbox" checked={config?.[flag.key] ?? false} onChange={event => void saveFlags(null, { [flag.key]: event.target.checked })} disabled={busy} /><span><strong>{flag.label}</strong><small>{flag.description}</small></span></label>)}</div></section></>}
      {panel === 'countries' && <Countries config={config} busy={busy} onSave={saveFlags} />}
      {panel === 'doctors' && <Doctors queue={queue} doctors={doctors} busy={busy} call={call} onRefresh={() => void run(async () => { await refresh(); setNotice('Doctor list refreshed.'); })} />}
      {panel === 'users' && <Users users={users} search={search} setSearch={setSearch} busy={busy} onSearch={() => void run(async () => { await refresh(); })} />}
      {panel === 'audit' && <Audit entries={audit} />}
    </section>
  </main>;
}

function Countries({ config, busy, onSave }: { config: AdminConfig | null; busy: boolean; onSave: (country: string | null, values: Partial<Record<AdminFlag, boolean>>) => Promise<void> }) {
  return <section className={s.card}><h2>Availability by country</h2><p>Belgium is the currently supported clinical region. The remaining rows are prepared for staged rollout and do not bypass the backend’s supported-region check.</p><div className={s.countryGrid}>{COUNTRIES.map(country => <article className={s.countryCard} key={country}><header><h3>{country}</h3><span className={s.badge}>{flagValue(config, country, 'enabled') ? 'Enabled' : 'Paused'}</span></header>{FLAGS.map(flag => <label className={s.check} key={flag.key}><input type="checkbox" checked={flagValue(config, country, flag.key)} onChange={event => { const current = config?.countries[country] ?? config; void onSave(country, { [flag.key]: event.target.checked, ...(flag.key === 'enabled' && !event.target.checked ? { registrationEnabled: false, clinicalEnabled: false, engagementsEnabled: false, paymentsEnabled: false, videoEnabled: false } : {}) }); }} disabled={busy || (country !== 'BE' && flag.key !== 'enabled')} /><span>{flag.label}</span></label>)}</article>)}</div></section>;
}

function Doctors({ queue, doctors, busy, call, onRefresh }: { queue: Doctor[]; doctors: AdminDoctor[]; busy: boolean; call: Call; onRefresh: () => void }) {
  const [selected, setSelected] = useState<Doctor | null>(null);
  const [message, setMessage] = useState('');
  const [source, setSource] = useState('');
  const [expiry, setExpiry] = useState('');
  const [checks, setChecks] = useState({ identity: false, license: false, specialty: false, insurance: false });
  const review = async (doctor: Doctor, status: 'verified' | 'rejected') => {
    try {
      if (status === 'verified') {
        if (!source.startsWith('https://') || !expiry || !Object.values(checks).every(Boolean)) throw Error('Add registry evidence, an expiry date and complete every verification check.');
        await call('review', { doctorUID: doctor.uid, status, verificationSource: source, verificationExpiresAt: Date.parse(`${expiry}T23:59:59Z`), licensedRegions: ['BE'], identityVerified: checks.identity, licenseVerified: checks.license, specialistVerified: checks.specialty, insuranceVerified: checks.insurance });
      } else await call('review', { doctorUID: doctor.uid, status });
      setSelected(null); setSource(''); setExpiry(''); setChecks({ identity: false, license: false, specialty: false, insurance: false }); onRefresh();
    } catch (errorValue) { setMessage(errorValue instanceof Error ? errorValue.message : 'Review failed.'); }
  };
  const downloadEvidence = async (doctor: Doctor) => {
    const path = doctor.verification?.credentialPath;
    if (!path) { setMessage('No private evidence file is attached.'); return; }
    try { const blob = await getBlob(ref(firebaseClient().storage, path), 10 * 1024 * 1024); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `professional-evidence-${doctor.uid}`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); } catch (errorValue) { setMessage(errorValue instanceof Error ? errorValue.message : 'Could not download private evidence.'); }
  };
  return <><section className={s.card}><div className={s.header}><div><h2>Doctor approvals</h2><p>Review each application and keep an evidence trail. Approval is always enforced by the server.</p></div><button className={s.secondary} onClick={onRefresh}>Refresh</button></div>{queue.length === 0 ? <div className={s.empty}>No pending applications.</div> : queue.map(doctor => <article className={s.patient} key={doctor.uid}><div><strong>{doctor.name}</strong><p className={s.muted}>{doctor.city} · {doctor.languages} · {doctor.uid}</p><p className={s.muted}>Registration: {doctor.verification?.registrationNumber ?? '—'} · Insurance until: {doctor.verification ? formatDate(doctor.verification.insuranceValidUntil) : '—'}</p></div><button className={s.secondary} disabled={busy} onClick={() => { setSelected(doctor); setMessage(''); }}>Review</button></article>)}</section><section className={s.card}><h2>All professional profiles</h2><table className={s.table}><thead><tr><th>Name</th><th>Country</th><th>Status</th><th>Accepting</th><th>Updated</th></tr></thead><tbody>{doctors.map(doctor => <tr key={doctor.uid}><td>{doctor.name ?? '—'}</td><td>{doctor.country ?? '—'}</td><td>{doctor.status ?? '—'}</td><td>{doctor.acceptingPatients ? 'Yes' : 'No'}</td><td>{formatDate(doctor.updatedAt)}</td></tr>)}</tbody></table></section>{selected && <div className={s.modal}><section className={s.dialog} role="dialog" aria-modal="true" aria-label="Review doctor"><header><h2>{selected.name}</h2><button className={s.secondary} onClick={() => setSelected(null)}>Close</button></header><p>{selected.city} · {selected.languages}</p><button className={s.secondary} onClick={() => void downloadEvidence(selected)}>Download private evidence</button><label>Registry evidence URL<input type="url" required placeholder="https://..." value={source} onChange={event => setSource(event.target.value)} /></label><label>Approval expires<input type="date" required value={expiry} max={selected.verification ? new Date(selected.verification.insuranceValidUntil).toISOString().slice(0, 10) : undefined} onChange={event => setExpiry(event.target.value)} /></label><p className={s.muted}>Check the private dossier against the relevant identity, registration, specialty and insurance sources before approving.</p>{([['identity', 'Identity checked'], ['license', 'Active licence checked'], ['specialty', 'Pediatric specialty checked'], ['insurance', 'Insurance checked']] as const).map(([key, label]) => <label className={s.check} key={key}><input type="checkbox" checked={checks[key]} onChange={event => setChecks(previous => ({ ...previous, [key]: event.target.checked }))} />{label}</label>)}<div className={s.actions}><button className={s.button} disabled={busy} onClick={() => void review(selected, 'verified')}>Approve verified</button><button className={s.danger} disabled={busy} onClick={() => void review(selected, 'rejected')}>Reject</button></div>{message && <p className={s.error}>{message}</p>}</section></div>}</>;
}

function Users({ users, search, setSearch, busy, onSearch }: { users: AdminUser[]; search: string; setSearch: (value: string) => void; busy: boolean; onSearch: () => void }) {
  return <section className={s.card}><h2>User directory</h2><p>Only account and professional metadata is shown here. Medical records remain outside the admin list.</p><form className={s.actions} onSubmit={event => { event.preventDefault(); onSearch(); }}><input aria-label="Search users" placeholder="Search email, name or UID" value={search} onChange={event => setSearch(event.target.value)} /><button className={s.button} disabled={busy}>Search</button></form><div className={s.userGrid}>{users.map(user => <article className={s.userCard} key={user.uid}><h3>{user.displayName || user.email || user.uid}</h3><p>{user.email ?? 'No email'} · {user.emailVerified ? 'verified email' : 'email not verified'}</p><p className={s.muted}>Created {formatDate(user.creationTime)} · Last sign-in {formatDate(user.lastSignInTime)}</p><p className={s.muted}>Roles: {user.roles.admin ? 'admin ' : ''}{user.roles.reviewer ? 'reviewer' : 'standard'}</p>{user.pediatricProfile && <p className={s.muted}>Professional profile: {user.pediatricProfile.status} · {user.pediatricProfile.country ?? '—'} · {user.pediatricProfile.city ?? '—'}</p>}</article>)}</div>{users.length === 0 && <div className={s.empty}>No accounts match this search.</div>}</section>;
}

function Audit({ entries }: { entries: AdminAuditEntry[] }) {
  return <section className={s.card}><h2>Audit log</h2><p>Recent administrative and clinical-control events, without clinical payloads.</p><table className={s.table}><thead><tr><th>When</th><th>Action</th><th>Actor</th><th>Target</th><th>Status</th></tr></thead><tbody>{entries.map((entry, index) => <tr key={`${entry.at}-${index}`}><td>{formatDate(entry.at)}</td><td>{entry.action ?? '—'}</td><td>{entry.actor ?? '—'}</td><td>{entry.doctorUID ?? entry.linkID ?? entry.bookingID ?? entry.threadID ?? entry.countryCode ?? '—'}</td><td>{entry.status ?? (entry.granted === undefined ? '—' : entry.granted ? 'granted' : 'revoked')}</td></tr>)}</tbody></table>{entries.length === 0 && <div className={s.empty}>No audit entries yet.</div>}</section>;
}
