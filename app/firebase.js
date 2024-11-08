// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getStorage} from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDdo70COnP_AaKjUfgDxqUD6JU4aJwgtTk",
  authDomain: "caps-bd781.firebaseapp.com",
  projectId: "caps-bd781",
  storageBucket: "caps-bd781.appspot.com",
  messagingSenderId: "315981863949",
  appId: "1:315981863949:web:ab1584ad307f25ad404944",
  measurementId: "G-TKPW3GY6GW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const storage  =  getStorage()