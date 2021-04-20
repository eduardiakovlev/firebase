//  // Your web app's Firebase configuration
//   // For Firebase JS SDK v7.20.0 and later, measurementId is optional
//   var firebaseConfig = {

//   };
//   // Initialize Firebase
//   firebase.initializeApp(firebaseConfig);
//   firebase.analytics();

import firebase from "firebase";


const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAFcMykDdfk4Lbrmf5jTE3eX52FR8Qr3tM",
    authDomain: "todoapp-ba1c0.firebaseapp.com",
    databaseURL: "https://todoapp-ba1c0-default-rtdb.firebaseio.com/",
    projectId: "todoapp-ba1c0",    
    storageBucket: "todoapp-ba1c0.appspot.com",
    messagingSenderId: "1019299984887",
    appId: "1:1019299984887:web:f8dd3f0707cde236b8eaf2",
    measurementId: "G-FBH1X7ZJYT"
});

const db = firebaseApp.firestore();
// const auth = firebase.auth();

export default db;