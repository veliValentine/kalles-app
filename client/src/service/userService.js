import instance, { getAuthHeader } from "../service/instance/apiInstance";

export const getUser = async (token = throwUndefined(), id = throwUndefined()) => {
	try {
		const options = {
			headers: getAuthHeader(token),
		};
		const { data } = await instance.get(`/users/${id}`, options);
		return data;
	} catch (error) {
		apiError(error);
	}
};

export const createUser = async (token = throwUndefined(), id = throwUndefined(), username = throwUndefined()) => {
	try {
		const body = {
			id,
			username
		};
		const options = {
			headers: getAuthHeader(token),
		};
		const { data } = await instance.post("/users", body, options);
		return data;
	} catch (error) {
		apiError(error);
	}
};

const apiError = (error) => {
	console.log("Api error");
	console.log(error.message);
};

const throwUndefined = () => { throw new Error("Undefined"); };