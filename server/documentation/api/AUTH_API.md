# Auth API
Helper api for getting bearer tokens.

**NOT** available in production enviroment!

## Base path

`/api/v1/`

## POST login
### Request
#### URL
`/login`
#### HTTP method
`POST`
#### Request Body
```js
{
    "email":"String",
    "password":"String"
}
```
### Response
#### Response Body
```JS
{
    "token": "token",
    "bearer": "Bearer token"
}
```
#### Response Status
- `200`
- `400`