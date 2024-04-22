import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCcepnwjdovFOXRyO8k24edVOyDY9bQSqo",
  authDomain: "tarefasplus-7437f.firebaseapp.com",
  projectId: "tarefasplus-7437f",
  storageBucket: "tarefasplus-7437f.appspot.com",
  messagingSenderId: "990134831774",
  appId: "1:990134831774:web:78ea2445b2831c5b7d098f"
};

const fireBaseApp = initializeApp(firebaseConfig);

const db = getFirestore(fireBaseApp);

export{ db };