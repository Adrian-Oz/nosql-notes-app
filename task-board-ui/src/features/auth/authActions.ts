import { auth } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
export function useAuthActions() {
  async function signUp(body: { email: string; password: string }) {
    try {
      await createUserWithEmailAndPassword(auth, body.email, body.password);
    } catch (e) {
      if (e instanceof FirebaseError) throw e;
    }
  }

  async function signIn(body: { email: string; password: string }) {
    try {
      await signInWithEmailAndPassword(auth, body.email, body.password);
    } catch (e) {
      if (e instanceof FirebaseError) throw e;
    }
  }
  async function signOut() {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      if (e instanceof FirebaseError) throw e;
    }
  }

  return {
    signUp,
    signIn,
    signOut,
  };
}
