
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB2kOWwcpmnQzX4JH6_b28oR9e17s2f96U",
  authDomain: "invoice-app-dbfda.firebaseapp.com",
  projectId: "invoice-app-dbfda",
  storageBucket: "invoice-app-dbfda.appspot.com",
  messagingSenderId: "559410327942",
  appId: "1:559410327942:web:05c42899a7072e595afc07",
  measurementId: "G-7V6DS7R5L9"
};


export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore(app);
