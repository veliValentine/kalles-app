# User API

## Base path
All endpoints requires base path after URL host

`/api/v1/users`

## Endpoints
- [GET all users](#get-all-users)
- [POST Create new user](#post-create-new-user)
- [GET user](#get-user)
- [GET users messages](#get-users-messages)
- [GET users liked messages](#get-users-liked-messages)

## GET all users
Return all users

Require admin privileges
### Request
#### HTTP method
`GET`
#### Required Headers
```
{
	"Authorization": "Bearer TOKEN"
}
```
### Response
#### Response Body
```
[
    {
    	"id": userId,
    	"username": String,
    	"messages": [ messageId ],
    	"liked": [ messageId ]
	}
]
```
#### Response Status
`200`



## POST Create new user
Creates new user.

Require owner privileges.

### Request
#### HTTP method
`POST`
#### Required Headers
```
{
	"Authorization": "Bearer TOKEN"
}
```
#### Request Body
```
{
	"id": userId,
	"username": String
}
```
### Response
#### Response Body
```
{
    "id": userId,
    "username": String,
    "messages": [],
    "liked": []
}
```
#### Response Status
- `201`, successful request
- `400`, bad request
- `401`, missing valid authorization header
- `403`, missing privileges

## GET User
Returns user matching given id

Require owner privileges
### Request
#### URL
`/:id`
#### HTTP method
`GET`
#### Required Headers
```
{
	"Authorization": "Bearer TOKEN"
}
```
#### Required Route Params
- `:id` user id
### Response
#### Response Body
```
{
    "id": userId,
    "username": String,
    "messages": [ messageId ],
    "liked": [ messageId ]
}
```
#### Response Status
- `200`, successful request
- `400`, invalid `id`
- `401`, missing valid authorization header
- `403`, missing privileges
- `404`, user not found

## GET users messages
Returns users messages

Require owner privileges
### Request
#### URL
`/:id/messages`
#### HTTP method
`GET`
#### Required Headers
```
{
	"Authorization": "Bearer TOKEN"
}
```
#### Required Route Params
- `:id` user id
### Response
#### Response Body
```
[
	{
        "location": {
            "latitude": Number,
            "longitude": Number
        },
        "created": Date,
        "likes": Number,
        "message": String,
        "username": ,
        "id": messageId
    }
]
```
#### Response Status
- `200`, successful request
- `400`, invalid `id`
- `401`, missing valid authorization header
- `403`, missing privileges
- `404`, user not found

## GET users liked messages
Returns users liked messages

Require owner privileges
### Request
#### URL
`/:id/liked`
#### HTTP method
`GET`
#### Required Headers
```
{
	"Authorization": "Bearer TOKEN"
}
```
#### Required Route Params
- `:id` user id
### Response
#### Response Body
```
[
	{
        "location": {
            "latitude": Number,
            "longitude": Number
        },
        "created": Date,
        "likes": Number,
        "message": String,
        "username": ,
        "id": messageId
    }
]
```
#### Response Status
- `200`, successful request
- `400`, invalid `id`
- `401`, missing valid authorization header
- `403`, missing privileges
- `404`, user not found