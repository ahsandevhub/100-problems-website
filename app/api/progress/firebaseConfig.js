import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB9yhMcm7YCNxQkUvEXH9roc0AjJuIQnnk",
  authDomain: "sagor-100-problem-challange.firebaseapp.com",
  projectId: "sagor-100-problem-challange",
  storageBucket: "sagor-100-problem-challange.appspot.com",
  messagingSenderId: "749666446064",
  appId: "1:749666446064:web:3e41f7c2cad939baa87035",
  measurementId: "G-5TVYWEB6GT",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
