import Firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';

// import {seedDatabase} from '../seed';

const config = {
    apiKey: "AIzaSyAKB2P8UIf0XNqE80TfWVsXba-Ca4sPvPM",
    authDomain: "margatsni-itss.firebaseapp.com",
    projectId: "margatsni-itss",
    storageBucket: "margatsni-itss.appspot.com",
    messagingSenderId: "510433080525",
    appId: "1:510433080525:web:326a8b8bf47523732e2584"
};

const firebase = Firebase.initializeApp(config);
const { FieldValue } = Firebase.firestore;
const storage = Firebase.storage();

// Create Seed data
// seedDatabase(firebase);
export { firebase, FieldValue, storage };

export const uiConfig = {
    signInFlow: 'popup',
    signInSuccessUrl: '/',
    signInOptions: [
        Firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        Firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    ],
  };


