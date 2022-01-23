import React, { useEffect } from "react";
import Main from "./src/Main";

import { NativeRouter } from "react-router-native";
import instance from "./src/service/instance/apiInstance";

const wakeApiServer = async () => {
	const { data } = await instance.get("/health");
	console.log(`Health data ${data}`);
};

const App = () => {
	useEffect(wakeApiServer, []);
	return (
		<NativeRouter>
			<Main />
		</NativeRouter>
	);
};

export default App;
