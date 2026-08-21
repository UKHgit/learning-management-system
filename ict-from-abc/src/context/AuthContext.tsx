import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User as FirebaseUser, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider 
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, set, onDisconnect, onValue, remove } from 'firebase/database';
import { auth, googleProvider, db, rtdb, ADMIN_UID, ADMIN_EMAIL } from '../lib/firebase';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  isAdmin: boolean;
  onlineCount: number;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [onlineCount, setOnlineCount] = useState(0);

  useEffect(() => {
    // Set up presence system for online users
    const connectedRef = ref(rtdb, '.info/connected');
    const userPresenceRef = ref(rtdb, `presence/${firebaseUser?.uid}`);
    
    const handleConnectionChange = (snapshot: any) => {
      if (snapshot.val() === true && firebaseUser) {
        // On connect, set presence
        const presenceData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          lastSeen: Date.now(),
        };
        
        set(userPresenceRef, presenceData);
        onDisconnect(userPresenceRef).update({ lastSeen: Date.now() });
      }
    };

    onValue(connectedRef, handleConnectionChange);

    // Listen to all presence for online count
    const presenceRef = ref(rtdb, 'presence');
    const unsubscribePresence = onValue(presenceRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const now = Date.now();
        const fiveMinutesAgo = now - 5 * 60 * 1000;
        const activeUsers = Object.values(data as any).filter((u: any) => 
          u.lastSeen > fiveMinutesAgo
        );
        setOnlineCount(activeUsers.length);
      } else {
        setOnlineCount(0);
      }
    });

    return () => {
      unsubscribePresence();
    };
  }, [firebaseUser]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        // Get or create user profile in Firestore
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            role: userData.role || 'student',
            createdAt: userData.createdAt?.toDate() || new Date(),
          });
        } else {
          // Create new user profile
          const isAdmin = firebaseUser.uid === ADMIN_UID || firebaseUser.email === ADMIN_EMAIL;
          const newUser: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            role: isAdmin ? 'admin' : 'student',
            createdAt: new Date(),
          };
          
          await setDoc(userRef, {
            ...newUser,
            createdAt: serverTimestamp(),
          });
          
          setUser(newUser);
        }
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (firebaseUser) {
        // Remove from presence
        const userPresenceRef = ref(rtdb, `presence/${firebaseUser.uid}`);
        await remove(userPresenceRef);
      }
      await signOut(auth);
    } catch (error) {
      console.error('Logout Error:', error);
      throw error;
    }
  };

  const isAdmin = user?.role === 'admin' || user?.uid === ADMIN_UID;

  const value: AuthContextType = {
    user,
    firebaseUser,
    loading,
    isAdmin,
    onlineCount,
    signInWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
