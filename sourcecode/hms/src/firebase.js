import firebase from "firebase";

const config = {
  apiKey: "AIzaSyCOdTPjtq0jUhUurJ5483aV1vJFhtPLEB0",
  authDomain: "hospital-management-syst-e86b6.firebaseapp.com",
  databaseURL: "https://hospital-management-syst-e86b6-default-rtdb.firebaseio.com",
  projectId: "hospital-management-syst-e86b6",
  storageBucket: "hospital-management-syst-e86b6.appspot.com",
  messagingSenderId:"159898780251",
  appId: "1:159898780251:web:7c60f7712c928d2fcc357e",
  //measurementId: "***************",
};

// const db = firebaseApp.firestore();
// const storage = firebaseApp.storage();
firebase.initializeApp(config);
export default firebase;
