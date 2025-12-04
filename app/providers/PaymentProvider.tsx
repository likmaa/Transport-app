import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

// Optional persistence
let AsyncStorage: any;
try { AsyncStorage = require('@react-native-async-storage/async-storage').default; } catch {}

export type PaymentMethod = 'cash' | 'mobile_money' | 'card' | 'wallet' | 'qr';
export type PaymentStatus = 'idle' | 'processing' | 'ready' | 'failed';

type PaymentState = {
  method: PaymentMethod;
  setMethod: (m: PaymentMethod) => void;
  walletBalance: number; // FCFA
  addFunds: (amount: number) => void;
  debit: (amount: number) => boolean; // returns success
  paymentStatus: PaymentStatus;
  setPaymentStatus: (s: PaymentStatus) => void;
};

const Ctx = createContext<PaymentState | null>(null);

export function PaymentProvider({ children }: { children: React.ReactNode }) {
  const [method, setMethodState] = useState<PaymentMethod>('cash');
  const [walletBalance, setWalletBalance] = useState<number>(5000); // solde fictif
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');

  useEffect(() => {
    (async () => {
      if (!AsyncStorage) return;
      try {
        const m = await AsyncStorage.getItem('payment_method');
        const b = await AsyncStorage.getItem('wallet_balance');
        if (m) setMethodState(m as PaymentMethod);
        if (b) setWalletBalance(Number(b));
      } catch {}
    })();
  }, []);

  useEffect(() => {
    (async () => { if (AsyncStorage) try { await AsyncStorage.setItem('payment_method', method); } catch {} })();
  }, [method]);
  useEffect(() => {
    (async () => { if (AsyncStorage) try { await AsyncStorage.setItem('wallet_balance', String(walletBalance)); } catch {} })();
  }, [walletBalance]);

  const setMethod = (m: PaymentMethod) => {
    setMethodState(m);
    // Reset status when method changes
    setPaymentStatus('idle');
  };
  const addFunds = (amount: number) => setWalletBalance(b => Math.max(0, b + amount));
  const debit = (amount: number) => {
    if (method !== 'wallet') return true; // other methods simulated as success
    if (walletBalance >= amount) {
      setWalletBalance(b => b - amount);
      return true;
    }
    return false;
  };

  const value = useMemo<PaymentState>(() => ({ method, setMethod, walletBalance, addFunds, debit, paymentStatus, setPaymentStatus }), [method, walletBalance, paymentStatus]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePaymentStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('usePaymentStore must be used within PaymentProvider');
  return ctx;
}
