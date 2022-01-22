const HEROKU_URL_BASE = "https://kalle-studio.herokuapp.com/api/v1";
const LOCAL_URL_BASE = "https://kalle-studio-test.herokuapp.com/api/v1";

// eslint-disable-next-line no-undef
export const SERVER_URL_BASE = __DEV__ ? LOCAL_URL_BASE : HEROKU_URL_BASE;
