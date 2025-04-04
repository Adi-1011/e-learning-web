// Import necessary Firebase services
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB2BoDWYtjD9UMx2qwbwzicwLmLS5BzHj8",
  authDomain: "learnstack-b0068.firebaseapp.com",
  projectId: "learnstack-b0068",
  storageBucket: "learnstack-b0068.firebasestorage.app",
  messagingSenderId: "304417662136",
  appId: "1:304417662136:web:6166e691c68f53e78b804d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

// Export auth and firestore to use in other files
export { auth, firestore };