import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// TODO: Remplace ces valeurs par celles de ton projet Firebase
const firebaseConfig = {
  apiKey: 'ttcc',
  authDomain: 'TON_PROJET.firebaseapp.com',
  projectId: 'ttcc-9f61d',
  storageBucket: 'TON_PROJET.appspot.com',
  messagingSenderId: 'TON_SENDER_ID',
  appId: '840854290688',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
