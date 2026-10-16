'use client';
import { useState } from 'react';
import type { User } from 'firebase/auth';
type Money = { amount: string; currency: string } | null;
type Estimate = { shippingMethod: string; items: Money; shipping: Money };
function money(value: Money) { return value ? `${value.currency} ${value.amount}` : 'Not returned'; }
export function PrintPricing({ user, demo }: { user: User | null; demo: boolean }) {
  const [country, setCountry] = useState('US');
  const [pages, setPages] = useState(24);
  const [copies, setCopies] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [estimates, setEstimates] = useState<Estimate[] | null>(null);
  const clear = () => { setEstimates(null); setError(''); };
  async function quote() {
    if (!user || demo) return;
    setBusy(true); clear();
    try {
      const response = await fetch('/api/print/sandbox-quote', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${await user.getIdToken()}` }, body: JSON.stringify({ destinationCountryCode: country, currencyCode: country === 'US' ? 'USD' : country === 'GB' ? 'GBP' : 'EUR', pageCount: pages, copies }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not retrieve pricing.');
      setEstimates(data.estimates);
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not retrieve pricing.'); }
    finally { setBusy(false); }
  }
  return <details className="print-checks"><summary>Test print pricing with Prodigi</summary>
    <p>Sandbox supplier estimates for a sample book configuration. These are not checkout prices and do not submit this draft for printing. Taxes, BooDoo pricing, and final print files are not included.</p>
    {demo || !user ? <p>Sign in with your BooDoo account to use the same print-pricing test as the iOS app. The demo does not request supplier quotes.</p> : <>
      <div className="date-range">
        <label>Destination<select value={country} disabled={busy} onChange={e => { setCountry(e.target.value); clear(); }}>{[['US','United States'],['NL','Netherlands'],['BE','Belgium'],['GB','United Kingdom'],['PT','Portugal']].map(([v,n]) => <option key={v} value={v}>{n}</option>)}</select></label>
        <label>Sample interior pages<input type="number" min={24} max={200} value={pages} disabled={busy} onChange={e => { setPages(Number(e.target.value)); clear(); }}/></label>
        <label>Copies<input type="number" min={1} max={10} value={copies} disabled={busy} onChange={e => { setCopies(Number(e.target.value)); clear(); }}/></label>
      </div>
      <button className="v2-button outline small" disabled={busy || !Number.isInteger(pages) || pages < 24 || pages > 200 || !Number.isInteger(copies) || copies < 1 || copies > 10} onClick={() => void quote()}>{busy ? 'Getting estimate…' : 'Get sandbox estimate'}</button>
    </>}
    {error && <p className="error-message" role="alert">{error}</p>}
    {estimates && <div role="status">{estimates.length ? estimates.map((e,i) => <p key={i}><strong>{e.shippingMethod}</strong> · Book production: {money(e.items)} · Shipping: {money(e.shipping)}</p>) : <p>No estimates were returned for this configuration.</p>}</div>}
  </details>;
}
