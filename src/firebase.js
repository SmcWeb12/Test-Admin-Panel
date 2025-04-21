// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDZvcoLZT6hgQGwyyKOc-N-Eo9O1CuvyWY",
    authDomain: "chatweb-23a8b.firebaseapp.com",
    databaseURL: "https://chatweb-23a8b-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "chatweb-23a8b",
    storageBucket: "chatweb-23a8b.appspot.com",
    messagingSenderId: "965118182848",
    appId: "1:965118182848:web:6000225991cf23035a7425",
    measurementId: "G-4EDDGWPR8D"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
