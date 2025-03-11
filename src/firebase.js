import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDNiKNw7-jiDOF4hqR6DcMnVXTK8uToAos",
  authDomain: "quizgame-ds.firebaseapp.com",
  projectId: "quizgame-ds",
  storageBucket: "quizgame-ds.appspot.com",
  messagingSenderId: "332749221526",
  appId: "1:332749221526:web:2fb5c7df97c67c2cb61cb7",
  measurementId: "G-F9TLZEQ4NL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db= getFirestore(app);

const database = getDatabase(app);
const analytics = getAnalytics(app);

export { app, auth, db,database, analytics };
