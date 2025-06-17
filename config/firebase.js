// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyALzZoEuSAqdpux2QPTlOUzpsR8BMkM9uo",
  authDomain: "games-c03f8.firebaseapp.com",
  projectId: "games-c03f8",
  storageBucket: "games-c03f8.firebasestorage.app",
  messagingSenderId: "127931121139",
  appId: "1:127931121139:web:eb16b9b7c4f1b6f86ea686",
  measurementId: "G-3VTVC4JK47"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db=getFirestore(app);
export const storage = getStorage(app);
const analytics = getAnalytics(app);