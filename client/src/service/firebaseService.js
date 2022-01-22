import { initializeApp, getApps } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
	apiKey: "AIzaSyBiEI6KOBj9vIIRiyv89v7rpGFfXAN5hKU"
};
if (getApps().length < 1) {
	initializeApp(firebaseConfig);
}

const auth = getAuth();

export const signIn = async (email, password) => {
	const userCredential = await signInWithEmailAndPassword(auth, email, password);
	return getUserInfo(userCredential);
};
export const createUser = async (email, password) => {
	const userCredential = await createUserWithEmailAndPassword(auth, email, password);
	return getUserInfo(userCredential);
};

const getUserInfo = (userCredential) => {
	const { user } = userCredential;
	const { uid, stsTokenManager } = user;
	const { accessToken } = stsTokenManager;
	return { uid, accessToken };
};