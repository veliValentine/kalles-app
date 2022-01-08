# Message API

## Base path
All endpoints requires base path after URL host

`/api/v1/messages`

## Endpoints

## GET all messages
Return all messages.

Returned body contains distance to message if coordinates are given.

Require owner privileges to get messages with location.

Require admin privileges to get messages without location.
### Request
#### URL
`/?latitude=:latitude&longitude=:longitude`
#### HTTP method
`GET`
#### Required Headers
```
{
	"Authorization": "Bearer TOKEN"
}
```
#### Optional Route Params
Coordinates to calculate the distance to messages
- `:latitude`: Number
- `:longitude`: Number
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
        "username": String,
        "id": messageId
    },
    {
        "location": {
            "latitude": Number,
            "longitude": Number
        },
        "created": Date,
        "likes": Number,
        "message": String,
        "username": String,
        "id": messageId,
        "distance": Number, optional
    }
]
```
#### Response Status
- `200`, successful request
- `400`, invalid `latitude` or `longitude`
- `401`, missing valid authorization header
- `403`, missing privileges

## POST Create message
Creates a new message.

Require owner privileges to get messages with location.
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
  "username": String,
  "message": String,
  "location": {
            "latitude": Number,
            "longitude": Number
        }
}
```
### Response
#### Response Body
```
{
    "location": {
        "latitude": Number,
        "longitude": Number
    },
    "created": Date,
    "likes": Number,
    "message": String,
    "username": String,
    "id": messageId,
    "distance": Number
}
```
#### Response Status
- `201`, successful request
- `400`, bad request
- `401`, missing valid authorization header
- `403`, missing privileges

## GET message
Returns a message.

Returned body contains distance to message if coordinates are given.

Require owner privileges to get messages with location.

Require admin privileges to get messages without location.
### Request
#### URL
`/:id?latitude=:latitude&longitude=:longitude`
#### HTTP method
`GET`
#### Required Headers
```
{
	"Authorization": "Bearer TOKEN"
}
```
#### Required Route Params
Message id
- `:id`: messageId
#### Optional Route Params
Coordinates to calculate the distance to messages
- `:latitude`: Number
- `:longitude`: Number
### Response
#### Response Body
```
{
    "location": {
        "latitude": Number,
        "longitude": Number
    },
    "created": Date,
    "likes": Number,
    "message": String,
    "username": String,
    "id": messageId,
    "distance": Number, optional
}
```
#### Response Status
- `200`, successful request
- `400`, invalid `latitude`, `longitude` or `id`
- `401`, missing valid authorization header
- `403`, missing privileges
- `404`, message not found

## DELETE message
Removes a message

Require owner privileges.
### Request
#### URL
`/:id`
#### HTTP method
`DELETE`
#### Required Headers
```
{
	"Authorization": "Bearer TOKEN"
}
```
#### Required Route Params
Message id
- `:id`: messageId
### Response
#### Response Status
- `204`, successful request
- `401`, missing valid authorization header
- `403`, missing privileges
- `404`, message not found

## POST Like a message
Adds like to a message.

Require owner privileges.
### Request
#### URL
`/:id/like?latitude=:latitude&longitude=:longitude`
#### HTTP method
`POST`
#### Required Headers
```
{
	"Authorization": "Bearer TOKEN"
}
```
#### Required Route Params
Message id
- `:id`: messageId
#### Optional Route Params
Coordinates to calculate the distance to messages
- `:latitude`: Number
- `:longitude`: Number
### Response
#### Response Body
```
{
    "location": {
        "latitude": Number,
        "longitude": Number
    },
    "created": Date,
    "likes": Number,
    "message": String,
    "username": String,
    "id": messageId,
    "distance": Number, optional
}
```
#### Response Status
- `200`, successful request
- `401`, missing valid authorization header
- `403`, missing privileges
- `404`, message not found
