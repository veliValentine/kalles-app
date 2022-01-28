# Server

This api supports [client side](../client/README.md) of application.

This api is build with
* [node](https://nodejs.org/en/) version `14.17.3`
* [npm](https://www.npmjs.com/) `6.14.13`


- [Server](#server)
	- [Get started](#get-started)
	- [Commands](#commands)
		- [Development mode](#development-mode)
		- [Production mode](#production-mode)
		- [Testing](#testing)
		- [Eslint](#eslint)
	- [Setup enviroment variables locally](#setup-enviroment-variables-locally)
	- [Instances](#instances)
		- [Test server](#test-server)
		- [Production server](#production-server)
	- [Database](#database)
	- [Api documentation](#api-documentation)

## Get started
1. Install supported node and npm versions
2. Run: `npm i`
3. [Setup env variables](#setup-enviroment-variables-locally)
4. Start application: `npm start`'

## Commands
### Development mode
Run: `npm run dev`

### Production mode
Run: `npm start`

### Testing
Run: `npm run test`

To specify by test name run: `npm run test -- "test name"`

### Eslint
Run: `npm run lint`

## Setup enviroment variables locally
Locally project uses [.env dependency](https://www.npmjs.com/package/dotenv) for managing enviroment variables. Folow their [guide](https://www.npmjs.com/package/dotenv#usage) to get started.

Used enviroment variables:
* PORT
  * port in which the application starts
  * defaults to `3001`
* MONGO_URI
  * The url for mongo database
* MESSAGE_EXPIRES_TIME_MINUTES
  * Used value to determine the time messages are saved in database
  * defaults to 7 days
* TEST_USERNAME
  * test user for integration tests
* TEST_PASSWORD
  * test password for integration tests
* FIREBASE_APP_API_KEY
  * firebase app api key
* PROJECT_ID
  * firebase project id
* PRIVATE_KEY
  * firebase project id
* CLIENT_EMAIL
  * firebase client email

## Instances
Server has two running instance. One for testing and one for production.

### Test server
Is build based on master branch source code.

Instance of test server can be found [https://kalle-studio-test.herokuapp.com/api/v1/health](https://kalle-studio-test.herokuapp.com/api/v1/health)

### Production server
Is build based on production branch source code.

Instance of server can be found [https://kalle-studio.herokuapp.com/api/v1/health](https://kalle-studio.herokuapp.com/api/v1/health)

Only difference with these are the database they are connected to.

## Database

[Mongo db](https://www.mongodb.com/) is used for data persistence.

Picture of database [schema can be found here](https://github.com/veliValentine/kalles-app/wiki/Models).

## Api documentation
User api documentation [can be found here](./documentation/api/USER_API.md)

Message api documentation [can be found here](./documentation/api/MESSAGE_API.md)

Auth api documentation [can be found here](./documentation/api/AUTH_API.md)
