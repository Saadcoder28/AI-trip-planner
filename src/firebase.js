import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, setDoc, doc } from "firebase/firestore"; // ✅ Combined import

const firebaseConfig = {
  apiKey: "AIzaSyBjpvM0ZY5f3U39Hhc4oeKMX31ywLFkYnY",
  authDomain: "ai-trip-planner-c7244.firebaseapp.com",
  projectId: "ai-trip-planner-c7244",
  storageBucket: "ai-trip-planner-c7244.appspot.com", // ✅ fix extension
  messagingSenderId: "808581986899",
  appId: "1:808581986899:web:726a006fce70f9bf4ce4a6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// ✅ Test Firestore write AFTER db is initialized
setDoc(doc(db, "test", "testDoc"), { hello: "world" })
  .then(() => console.log("✅ Write succeeded"))
  .catch((err) => console.error("❌ Write failed:", err));


  export { onAuthStateChanged } from "firebase/auth";