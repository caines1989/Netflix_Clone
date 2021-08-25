import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyCMru9l5DwopN8t9T4YOdt3r_uikezm_FA",
    authDomain: "netflix-clone-f5939.firebaseapp.com",
    projectId: "netflix-clone-f5939",
    storageBucket: "netflix-clone-f5939.appspot.com",
    messagingSenderId: "778492399718",
    appId: "1:778492399718:web:14acee0fe1d825f6d75da7"
  };

  const firebaseApp = firebase.initializeApp(firebaseConfig);
  const db = firebaseApp.firestore();
  const auth = firebase.auth();

  export { auth };
  export default { db };