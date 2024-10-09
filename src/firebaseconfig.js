import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyAKqKQSdtOQ9V8m_-E2b6dWP2IM8SpW0wk",
    authDomain: "kalyug-chronicles.firebaseapp.com",
    projectId: "kalyug-chronicles",
    storageBucket: "kalyug-chronicles.appspot.com",
    messagingSenderId: "408148767826",
    appId: "1:408148767826:web:6626e1947beca8e82b9b8b",
    databaseURL: "https://kalyug-chronicles-default-rtdb.firebaseio.com/",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
export { auth, db };
