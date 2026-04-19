import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../config/firebase";

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
    const [user, setUser] = useState<User | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                const userRef = doc(db, 'users', currentUser.uid);
                
                try {
                    // 1. Fetch the user's document
                    const userSnap = await getDoc(userRef);
                    
                    if (userSnap.exists()) {
                        // 2. [DOCUMENT EXISTS] Do absolutely NO overwriting! Just read the role.
                        console.log("🟢 User exists. Loaded role:", userSnap.data().role);
                        setUserRole(userSnap.data().role);
                    } else {
                        // 3. [DOCUMENT DOES NOT EXIST] Safe to create a new profile!
                        console.log("🟠 New User! Creating default 'student' profile...");
                        await setDoc(userRef, {
                            email: currentUser.email,
                            role: 'student',
                            createdAt: serverTimestamp(),
                        });
                        setUserRole('student');
                    }
                } catch (error) {
                    console.error("❌ Firestore read/write error:", error);
                    setUserRole(null);
                }
            } else {
                console.log("⚪ User logged out. Clearing states.");
                setUser(null);
                setUserRole(null);
            }
            
            setLoading(false);
        });

        // Cleanup subscription
        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, userRole, initialising: loading }}>
            {children}
        </AuthContext.Provider>
    );
};
