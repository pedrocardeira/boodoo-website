'use client';
import { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';

type OrderRow = { id: string; albumId: string; createdAt: string;
  status: string; amountTotal: number; currency: string; prodigiStage?: string | null; tracking?: Array<{ url?: string; number?: string }> };

export default function BookOrders({ user }: { user: User | null }) {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [state, setState] = useState<'loading'|'ready'|'error'>('loading');
  useEffect(() => {
    if (!user) { setState('ready'); return; }
    let cancelled = false;
    (async () => {
      try {
        const token = await user.getIdToken();
        const response = await fetch('/api/print/orders', {
          headers: { Authorization: 'Bearer ' + token }, cache: 'no-store',
        });
        if (!response.ok) throw new Error('Could not load orders');
        const result = await response.json() as { orders: OrderRow[] };
        if (!cancelled) { setOrders(result.orders); setState('ready'); }
      } catch { if (!cancelled) setState('error'); }
    })();
    return () => { cancelled = true; };
  }, [user]);
  if (!user) return null;
  return <section className="family-card" style={{ marginTop: 22 }}>
    <h2>Your printed book orders</h2>
    {state === 'loading' && <p>Checking your orders…</p>}
    {state === 'error' && <p>Order history is unavailable. Please try again later.</p>}
    {state === 'ready' && !orders.length && <p>No printed book orders yet.</p>}
    {state === 'ready' && orders.map(order =>
      <div className="settings-row" key={order.id}>
        <div>
          <strong>Book order {order.id.slice(0, 8)}</strong>
          <p>{new Date(order.createdAt).toLocaleDateString()} · {order.status.replaceAll('_', ' ')}
            {order.prodigiStage ? ' · Printing: ' + order.prodigiStage : ''}</p>
          {order.tracking?.map((t, i) => t.url ? <a key={i} href={t.url} target="_blank" rel="noopener noreferrer">Track shipment{t.number ? ' ' + t.number : ''}</a> :
            <span key={i}>Tracking: {t.number}</span>)}
        </div>
        <span>{new Intl.NumberFormat(undefined, { style: 'currency', currency: order.currency.toUpperCase() })
          .format(order.amountTotal / 100)}</span>
      </div>)}
    <p className="quiet-note">A payment confirmation page does not guarantee an order is paid. Status updates after Stripe verifies payment.</p>
  </section>;
}
