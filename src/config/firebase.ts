import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyD0kEHdiybNvukdvTSp-D5KGmy-mHCFNQ4",
    authDomain: "strokeaware-platform.firebaseapp.com",
    projectId: "strokeaware-platform",
    storageBucket: "strokeaware-platform.firebasestorage.app",
    messagingSenderId: "16554802662",
    appId: "1:16554802662:web:f79b9d49f52ed3bf3cea27",
    measurementId: "G-G7HFF0N88B"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);
