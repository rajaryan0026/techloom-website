'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('cookie-consent')) setShow(true);
  }, []);

  const accept = () => {
    localStorage.setItem('cookie-consent', 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 max-w-sm rounded-2xl border border-border/10 bg-background/95 p-4 shadow-2xl backdrop-blur-xl">
      <p className="text-sm text-surface-gray">
        We use cookies to improve your experience. By continuing, you agree to our cookie policy.
      </p>
      <div className="mt-3 flex gap-2">
        <Button size="sm" onClick={accept}>Accept</Button>
        <Button size="sm" variant="outline" onClick={() => setShow(false)}>Decline</Button>
      </div>
    </div>
  );
}