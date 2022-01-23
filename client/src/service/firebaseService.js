import axios from "axios";
import { initializeApp, getApps } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import RefreshTokenStorage from "./storage/refreshTokenStorage";
import UserUidStorage from "./storage/userUidStorage";

const firebaseConfig = {
	apiKey: "AIzaSyBiEI6KOBj9vIIRiyv89v7rpGFfXAN5hKU"
};
if (getApps().length < 1) {
	initializeApp(firebaseConfig);
}

const auth = getAuth();
const refreshTokenStorage = RefreshTokenStorage();
const userUidStorage = UserUidStorage();

export const signIn = async (email, password) => {
	const userCredential = await signInWithEmailAndPassword(auth, email, password);
	return getUserInfo(userCredential);
};
export const createUser = async (email, password) => {
	const userCredential = await createUserWithEmailAndPassword(auth, email, password);
	return getUserInfo(userCredential);
};

export const refreshAccessToken = async (refreshToken) => {
	const body = {
		grant_type: "refresh_token",
		refresh_token: refreshToken,
	};
	const url = `https://securetoken.googleapis.com/v1/token?key=${firebaseConfig.apiKey}`;
	const { data } = await axios.post(url, body);
	return data.access_token;
};

const getUserInfo = (userCredential) => {
	const { user } = userCredential;
	const { uid, stsTokenManager } = user;
	const { accessToken, refreshToken } = stsTokenManager;
	saveRefreshToken(refreshToken);
	saveUserUid(uid);
	return { uid, accessToken };
};

const saveRefreshToken = async (token) => {
	await refreshTokenStorage.saveToken(token);
};

const saveUserUid = async (uid) => {
	await userUidStorage.saveUserUid(uid);
};