import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';

const projectId = process.env.VUE_APP_FIREBASE_PROJECT_ID;
const apiKey = process.env.VUE_APP_FIREBASE_API_KEY;

const config = {
  apiKey,
  authDomain: `${projectId}.firebaseapp.com`,
  projectId,
};

const instance = firebase.initializeApp(config);

export default instance;

export const auth = instance.auth();
export const database = instance.firestore();
