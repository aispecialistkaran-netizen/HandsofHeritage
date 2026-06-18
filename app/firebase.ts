import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDMsppEpIBxQb193MHTaKU0YGgCjkqKD9U",
  authDomain: "hoh1-e55a4.firebaseapp.com",
  projectId: "hoh1-e55a4",
  storageBucket: "hoh1-e55a4.firebasestorage.app",
  messagingSenderId: "76216355019",
  appId: "1:76216355019:web:19523e5b4eee0efb7e734e",
  measurementId: "G-8CLRSZ2QNQ"
};

// Prevent duplicate initializations during Next.js hot-reloads
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize analytics safely in the browser context only
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      getAnalytics(app);
    }
  });
}

export { db };
