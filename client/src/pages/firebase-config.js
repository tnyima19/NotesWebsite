// firebase-config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCiIL4099cxkmEb2QqKAQHi3ZltsDK1IyU",
  authDomain: "notescape-login.firebaseapp.com",
  databaseURL: "https://notescape-login-default-rtdb.firebaseio.com",
  projectId: "notescape-login",
  storageBucket: "notescape-login.appspot.com",
  messagingSenderId: "604506993725",
  appId: "1:604506993725:web:5c0e3b23082b08379a2654",
  measurementId: "G-5BCZVDLP2W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export { auth };
