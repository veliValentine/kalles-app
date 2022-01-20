import axios from "axios";
import { SERVER_URL_BASE } from "../../utils/URL";

const instance = axios.create({
	baseURL: SERVER_URL_BASE,
});

export const getAuthHeader = (token) => ({
	Authorization: `Bearer ${token}`,
});

export default instance;
