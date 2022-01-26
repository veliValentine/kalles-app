# Kalle studios client

Front end of kalle-studio react-native full stack application.

## Get started
1. Install expo client: `npm i --global expo-cli`
2. Install dependencies: `npm i`
3. Start application: `npm start`

## Commands

### Eslint

Run: `npm run lint`

### Production mode

Run: `npm run production`

### Run dev server
Follow server [get-started documentation](../server/README.md#get-started)

Run: `npm run server`

## Publish

### Expo go 

1. Follow get [get started](#get-started)
2. Run: `expo publish`

### Android build
1. Install eas client: `npm i -g eas-cli`
2. Login: `eas login`
3. Build for android: `eas build --platform android`