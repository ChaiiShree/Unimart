import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyB-on-CzoEi8ingMKT0Jk-5WngmQSlYDPo",
    authDomain: "unipal-af10a.firebaseapp.com",  
    projectId: "unipal-af10a",  
    storageBucket: "unipal-af10a.appspot.com",  
    messagingSenderId: "821015065291",  
    appId: "1:821015065291:web:cc9881bc7fe4410fa1a14e",  
    measurementId: "G-YJ6LS127YG"
    };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
