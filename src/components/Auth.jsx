import { useEffect } from "react";
import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

export default function Auth({ user, setUser }) {
  /* watch auth */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, [setUser]);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    await signInWithPopup(auth, provider);
  };

  const logout = () => signOut(auth);

  return user ? (
    <button
      onClick={logout}
      className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-md text-xs sm:text-sm font-medium"
    >
      Logout
    </button>
  ) : (
    <button
      onClick={login}
      className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-md text-xs sm:text-sm font-medium"
    >
      Login
    </button>
  );
}
