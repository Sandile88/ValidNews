"use client";

import { useEffect } from 'react';

export function MiniAppReady() {
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).parent !== window) {
      import('@farcaster/miniapp-sdk').then(({ sdk }) => {
        sdk.actions.ready();
      }).catch(() => {
        console.log('Running as standalone app');
      });
    }
  }, []);

  return null; 
}