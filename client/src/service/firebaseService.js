import axios from "axios";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

import RefreshTokenStorage from "./storage/refreshTokenStorage";
import UserUidStorage from "./storage/userUidStorage";

const firebaseConfig = {
	apiKey: "AIzaSyBiEI6KOBj9vIIRiyv89v7rpGFfXAN5hKU"
};

if (firebase.apps.length < 1) {
	firebase.initializeApp(firebaseConfig);
}

const refreshTokenStorage = RefreshTokenStorage();
const userUidStorage = UserUidStorage();

export const refreshAccessToken = async (refreshToken) => {
	const body = {
		grant_type: "refresh_token",
		refresh_token: refreshToken,
	};
	const url = `https://securetoken.googleapis.com/v1/token?key=${firebaseConfig.apiKey}`;
	const { data } = await axios.post(url, body);
	return data.access_token;
};

export const signIn = async (email, password) => {
	const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
	return getUserInfo(userCredential);
};
export const createUser = async (email, password) => {
	const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
	return getUserInfo(userCredential);
};

const getUserInfo = (userCredential) => {
	const { user } = userCredential;
	const { uid, stsTokenManager } = user.toJSON();
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