// src/components/Login.jsx
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";

export default function Login({ setUser }) {
  const handleLogin = async () => {
    const result = await signInWithPopup(auth, provider);
    setUser(result.user); // Save user in state
  };

  return (
    <button onClick={handleLogin} className="bg-blue-600 text-white px-4 py-2 rounded">
      Sign in with Google
    </button>
  );
}
