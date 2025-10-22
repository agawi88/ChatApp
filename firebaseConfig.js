import {
  initializeAuth,
  getReactNativePersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { initializeApp,  } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from "react-native";

// Optionally import the services that you want to use
// import {...} from 'firebase/database';
// import {...} from 'firebase/functions';
// import {...} from 'firebase/storage';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBihgTR-xnxRYcW6TEy9IdpReCX_7AstBg",
  authDomain: "agas-shopping-list-demo.firebaseapp.com",
  projectId: "agas-shopping-list-demo",
  storageBucket: "agas-shopping-list-demo.firebasestorage.app",
  messagingSenderId: "326283031177",
  appId: "1:326283031177:web:614a2b367bbe8f39294c58"
};

const app = initializeApp(firebaseConfig);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
const db = getFirestore(app);

// code for supporting all three platforms: iOS, Android and Web. https://github.com/expo/fyi/blob/main/firebase-js-auth-setup.md
let auth;

if (Platform.OS === "web") {
  auth = initializeAuth(app, {
    persistance: browserLocalPersistence,
  });
}
else {
  auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)  
}); 
}


export { app, db, auth };
