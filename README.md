# kalles-app

This project is part of University of Helsinki full stack cource project.

The application is a full stack location based messaging application, where users can leave messages for other users to read.

The application currently runs only on expo-go. Follow [get started](./GET_STARTED.md) documentation to try it out!

## Table of contents
- [kalles-app](#kalles-app)
	- [Table of contents](#table-of-contents)
	- [Get started](#get-started)
	- [Hours](#hours)
	- [Client side source code](#client-side-source-code)
		- [Expo instance](#expo-instance)
	- [Server(API) source code](#serverapi-source-code)
	- [Pipelines and github actions](#pipelines-and-github-actions)
		- [Publish pipeline](#publish-pipeline)
			- [Server](#server)
			- [Client](#client)
		- [Test/lint action](#testlint-action)

## Get started

[Read get started documentation here](./GET_STARTED.md)

## Hours

[The project hours can be found here](./hours.md)

## Client side source code
[client source code](./client)

Client side is an expo/react-native front end application running at expo servers.

### Expo instance

Expo project: https://expo.dev/@velivalentine/kalles-studios


## Server(API) source code

[server source code](./server)

Server is build using docker and node. It is running at heroku servers.

## Pipelines and github actions
There are three publish pipelines and one test/lint github action.

### Publish pipeline
#### Server
When pull request is merged to master branch a server-build action triggers. This action builds server container based on [Dockerfile](./server/Dockerfile) and publish it to [test server](./server/README.md#test-server).

When pull request is merged to production branch a server-build action triggers. This action builds server container based on [Dockerfile](./server/Dockerfile) and publish it to [production server](./server/README.md#production-server).

#### Client
When pull request is merger to master branch a build action is triggered. This action builds and publish the [client side](./client) to expo servers.

### Test/lint action
Server code has lint/test action. When creating a pull request this action is triggered. It runs eslint command on [server code](./server) and all server tests.