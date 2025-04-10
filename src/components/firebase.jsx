import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAQAuKEaswJip4w4OoGYwsBEcy-mrZSqkM",
    authDomain: "attend-cbb41.firebaseapp.com",
    projectId: "attend-cbb41",
    storageBucket: "attend-cbb41.firebasestorage.app",
    messagingSenderId: "232745772044",
    appId: "1:232745772044:web:8ba2281e82ce47f0267a29",
    measurementId: "G-GLCZKJGMRB"
  };
  

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);