import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
apiKey: "AIzaSyCPdCQQbTYhLZblMznqKCCT2wLDicnIYe8",
authDomain: "proyecto-1-598ba.firebaseapp.com",
projectId: "proyecto-1-598ba",
storageBucket: "proyecto-1-598ba.firebasestorage.app",
messagingSenderId: "328271285517",
appId: "1:328271285517:web:af5ec60c4e80341be4f444",
measurementId: "G-P485X4WEL1"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar auth y provider de Google
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Firestore
const db = getFirestore(app);

export { auth, googleProvider, db, signOut };
