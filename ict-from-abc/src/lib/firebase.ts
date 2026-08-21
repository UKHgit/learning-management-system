import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDY7IPhrsG_ySSb43vn3cPKrlKX1rL_vOs",
  authDomain: "learning-management-syst-23810.firebaseapp.com",
  projectId: "learning-management-syst-23810",
  storageBucket: "learning-management-syst-23810.firebasestorage.app",
  messagingSenderId: "638718953177",
  appId: "1:638718953177:web:de5c62a0f69554887ae0c8",
  measurementId: "G-LL34MCGRZT"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export const storage = getStorage(app);

// Admin UID configuration
export const ADMIN_UID = "xWReEjFS2qWzZ81JKF1a20grIr52";
export const ADMIN_EMAIL = "bimsarac44@gmail.com";
