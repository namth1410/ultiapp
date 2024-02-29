// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDx4JmmBhw73-kqvODCy8r8wmwOhvaFeNs",
  authDomain: "ultiapp-255c3.firebaseapp.com",
  projectId: "ultiapp-255c3",
  storageBucket: "ultiapp-255c3.appspot.com",
  messagingSenderId: "300926945427",
  appId: "1:300926945427:web:a010057810d80625306566",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);

export default app;
