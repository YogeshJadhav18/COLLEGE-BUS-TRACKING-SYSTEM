import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../services/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log("🔄 Auth State Changed: ", currentUser);
      if (currentUser) {
        setUser(currentUser);
        await fetchUserData(currentUser.uid);
      } else {
        setUser(null);
        setUserData(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /**
   * Fetch user data from Firestore
   */
  const fetchUserData = async (uid) => {
    try {
      console.log(`📡 Fetching Firestore data for UID: ${uid}`);
      const userDoc = await getDoc(doc(db, "users", uid));

      if (userDoc.exists()) {
        console.log("✅ Firestore Data Found:", userDoc.data());
        const userData = userDoc.data();
        setUserData(userData);
        setRole(userData.userType); // Ensure 'userType' field is used for role
      } else {
        console.log("❌ No Firestore Data Found");
        setUserData(null);
        setRole(null);
      }
    } catch (error) {
      console.error("❌ Error fetching user data:", error);
    }
  };

  /**
   * Login function
   */
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const loggedInUser = userCredential.user;
      setUser(loggedInUser);
      await fetchUserData(loggedInUser.uid);
    } catch (error) {
      console.error("❌ Login Error:", error);
      throw error;
    }
  };

  /**
   * Signup function (stores user details)
   */
  const signup = async (
    email,
    password,
    name,
    rollNumber,
    userType = "student"
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const newUser = userCredential.user;

      // ✅ Store user details in Firestore
      await setDoc(doc(db, "users", newUser.uid), {
        uid: newUser.uid,
        email: newUser.email,
        name: name,
        rollNumber: rollNumber,
        userType: userType, // Ensure consistency in Firestore field names
      });

      setUser(newUser);
      setRole(userType);
      setUserData({
        uid: newUser.uid,
        email: newUser.email,
        name,
        rollNumber,
        userType,
      });
    } catch (error) {
      console.error("❌ Signup Error:", error);
      throw error;
    }
  };

  /**
   * Logout function
   */
  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setUserData(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, userData, role, login, signup, logout }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
