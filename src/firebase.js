// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, collection, getDocs, getDoc, addDoc, doc, setDoc,Timestamp } from 'firebase/firestore';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBxeYjKLHrwrRMzc36P6z0MjsEIbQ_5b6U",
  authDomain: "bookstore2-9d8ff.firebaseapp.com",
  projectId: "bookstore2-9d8ff",
  storageBucket: "bookstore2-9d8ff.appspot.com",
  messagingSenderId: "213536862324",
  appId: "1:213536862324:web:1d17d6b34a022112fb6121"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, db, collection, getDocs,getDoc, addDoc, doc, setDoc, Timestamp, signOut};