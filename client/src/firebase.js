import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB08wYQ86FqHzb2LCRNs6_-k-nEl3hdpqg",
  authDomain: "roxa-ai.firebaseapp.com",
  projectId: "roxa-ai",
  storageBucket: "roxa-ai.firebasestorage.app",
  messagingSenderId: "251768779483",
  appId: "1:251768779483:web:d67dc23285d7fad76912fe",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();