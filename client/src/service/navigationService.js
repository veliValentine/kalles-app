import { Alert, BackHandler } from "react-native";

export const MAP_PAGE = "/map";

export const exitApplication = () => {
	Alert.alert(
		"Exit",
		"Are you sure you want to exit the application?",
		[
			{
				text: "No",
				onPress: () => null,
				style: "cancel"
			},
			{
				text: "Yes",
				onPress: () => BackHandler.exitApp(),
				style: "default"
			}
		],
		{
			cancelable: true
		}
	);
	return true;
};
