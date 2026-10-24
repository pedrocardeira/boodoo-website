'use client';

import { useEffect } from 'react';

type Props = { result: 'success' | 'cancel' };

export default function ReturnToBooDoo({ result }: Props) {
  const deepLink = `boodoo://books/payment/${result}`;
  useEffect(() => {
    // The server webhook, not this redirect, decides whether payment succeeded.
    // A short delay lets the confirmation page render if iOS blocks app switching.
    const timeout = window.setTimeout(() => {
      window.location.assign(deepLink);
    }, 450);
    return () => window.clearTimeout(timeout);
  }, [deepLink]);
  return <p><a className="v2-button" href={deepLink}>Open BooDoo app</a></p>;
}
