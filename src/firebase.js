// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDx4JmmBhw73-kqvODCy8r8wmwOhvaFeNs",
  authDomain: "ultiapp-255c3.firebaseapp.com",
  projectId: "ultiapp-255c3",
  storageBucket: "ultiapp-255c3.appspot.com",
  messagingSenderId: "300926945427",
  appId: "1:300926945427:web:a010057810d80625306566",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      localStorage.setItem(
        "ulti_auth",
        JSON.stringify({
          accessToken: result.user.stsTokenManager.accessToken,
          refreshToken: result.user.stsTokenManager.refreshToken,
        })
      );
      localStorage.setItem(
        "ulti_user",
        JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          profilePic: result.user.photoURL,
        })
      );
      return result;
    })
    .catch((error) => {
      console.log(error);
    });
};
export default app;
