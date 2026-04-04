// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCHCXq4F5urLo3-s_bj2-mOXRQhkwYRl3o",
  authDomain: "task-board-adrian.firebaseapp.com",
  projectId: "task-board-adrian",
  storageBucket: "task-board-adrian.firebasestorage.app",
  messagingSenderId: "597430601590",
  appId: "1:597430601590:web:3ecf3ae759180d1f289c57",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
