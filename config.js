
import firebase from "firebase";
require("@firebase/firestore");

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCwNxvMEPTyeQe0sSf4_tR_2dfo-9i4Eyc",
  authDomain: "biblioteca-legal.firebaseapp.com",
  projectId: "biblioteca-legal",
  storageBucket: "biblioteca-legal.appspot.com",
  messagingSenderId: "932662006852",
  appId: "1:932662006852:web:8019ea7f68c42225b61811"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase.firestore();