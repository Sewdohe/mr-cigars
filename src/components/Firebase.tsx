import { FirebaseApp, initializeApp } from "firebase/app";

import { getFirestore, Firestore } from "firebase/firestore";
import { getMessaging, getToken, Messaging, onMessage } from "firebase/messaging";
import { Auth, getAuth, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.GATSBY_FIREBASE_API_KEY,
  authDomain: process.env.GATSBY_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.GATSBY_FIREBASE_DATABASE_URL,
  projectId: process.env.GATSBY_FIREBASE_PROJECT_ID,
  storageBucket: process.env.GATSBY_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.GATSBY_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.GATSBY_FIREBASE_APP_ID,
  measurementId: process.env.GATSBY_FIREBASE_MEASUREMENT_ID,
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let messaging: Messaging;

if (typeof window !== "undefined") {
  app = app! || initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  // messaging = getMessaging(app);

  // getToken(messaging, {
  //   vapidKey:
  //     "BKSSMaQX_L713UQj5-QOXyXDZKECB7Fq-e-UMMNuztdpOxAt915O-H1iMNYaChB94QswmjvYjhm139LtQGZCzhY",
  // }).then((currentToken) => {
  //   if (currentToken) {
  //     console.log("got token!");
  //   } else {
  //     console.log("no token! Let's get one!");
  //   }
  // });

  // onMessage(messaging, (payload) => {
  //   console.log('Message received. ', payload);
  //   // ...
  // });
}


export { auth, db, onAuthStateChanged, messaging };
