import type { Doctor } from './types';
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

export function ProfessionalProfile({ profile, busy, onAvailability }: {
  profile: Doctor;
  busy: boolean;
  onAvailability: () => void;
}) {
  return <section className={s.card}>
    <h2>{profile.name}</h2>
    <span className={s.badge}>{profile.status}</span>
    <p>{profile.biography}</p>
    <p>{profile.city} · {profile.languages}</p>
    {profile.status === 'verified' && <button disabled={busy} className={s.secondary} onClick={onAvailability}>
      {profile.acceptingPatients ? 'Pause new connections' : 'Accept new connections'}
    </button>}
    <p className={s.muted}>Changes to verified identity or credentials require a new professional review.</p>
  </section>;
}
