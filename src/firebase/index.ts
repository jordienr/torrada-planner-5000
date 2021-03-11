import firebase from 'firebase/app'
import 'firebase/database'

const firebaseConfig = {
  apiKey: "AIzaSyCw-zcZ5MDoSSzdHRt8pQKhMVzwg39g4ck",
  authDomain: "torradaplanner.firebaseapp.com",
  databaseURL: "https://torradaplanner-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "torradaplanner",
  storageBucket: "torradaplanner.appspot.com",
  messagingSenderId: "724150023429",
  appId: "1:724150023429:web:1198aa1d6619a78a4df36c"
};
// Initialize Firebase

firebase.initializeApp(firebaseConfig);

export const rtdb = firebase.database()
