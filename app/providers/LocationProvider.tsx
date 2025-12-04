import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
// Optional persistence without hard dependency
let AsyncStorage: any;
try { AsyncStorage = require('@react-native-async-storage/async-storage').default; } catch {}

export type Place = {
  address: string;
  lat: number;
  lon: number;
};

export type LocationState = {
  origin: Place | null;
  destination: Place | null;
  home: Place | null;
  work: Place | null;
  setOrigin: (p: Place | null) => void;
  setDestination: (p: Place | null) => void;
  setHome: (p: Place | null) => void;
  setWork: (p: Place | null) => void;
  reset: () => void;
};

const Ctx = createContext<LocationState | null>(null);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [origin, setOrigin] = useState<Place | null>(null);
  const [destination, setDestination] = useState<Place | null>(null);
  const [home, setHome] = useState<Place | null>(null);
  const [work, setWork] = useState<Place | null>(null);

  // Load favorites on mount
  useEffect(() => {
    (async () => {
      if (!AsyncStorage) return;
      try {
        const h = await AsyncStorage.getItem('fav_home');
        const w = await AsyncStorage.getItem('fav_work');
        if (h) setHome(JSON.parse(h));
        if (w) setWork(JSON.parse(w));
      } catch {}
    })();
  }, []);

  // Persist favorites when changed
  useEffect(() => {
    (async () => {
      if (!AsyncStorage) return;
      try { await AsyncStorage.setItem('fav_home', JSON.stringify(home)); } catch {}
    })();
  }, [home]);
  useEffect(() => {
    (async () => {
      if (!AsyncStorage) return;
      try { await AsyncStorage.setItem('fav_work', JSON.stringify(work)); } catch {}
    })();
  }, [work]);

  const value = useMemo<LocationState>(() => ({
    origin,
    destination,
    home,
    work,
    setOrigin,
    setDestination,
    setHome,
    setWork,
    reset: () => { setOrigin(null); setDestination(null); },
  }), [origin, destination, home, work]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLocationStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useLocationStore must be used within LocationProvider');
  return ctx;
}
