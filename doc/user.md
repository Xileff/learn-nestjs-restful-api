# User API Spec

## Register User

Endpoint : POST /api/users

Request Body :

```json
{
  "username": "felixsavero",
  "password": "rahasia",
  "name": "Felix Savero"
}
```

Response Body (Success) :

```json
{
  "data": {
    "username": "felixsavero",
    "name": "Felix Savero"
  }
}
```

Response Body (Failed) :

```json
{
  "data": {
    "errors": "Username already registered"
  }
}
```

## Login User

Endpoint : POST /api/users/login

Request Body :

```json
{
  "username": "felixsavero",
  "password": "rahasia"
}
```

Response Body (Success) :

```json
{
  "data": {
    "username": "felixsavero",
    "name": "Felix Savero",
    "token": "session_id_generated"
  }
}
```

Response Body (Failed) :

```json
{
  "data": {
    "errors": "Invalid username or password"
  }
}
```

## Get User

Endpoint : GET /api/users/current

Headers :

- Authorization : token

Response Body (Success) :

```json
{
  "data": {
    "username": "felixsavero",
    "name": "Felix Savero"
  }
}
```

Response Body (Failed) :

```json
{
  "data": {
    "errors": "Unauthorized"
  }
}
```

## Update User

Endpoint : PATCH /api/users/current

Headers :

- Authorization : token

Request Body :

```json
{
  "password": "rahasia", // optional
  "name": "Felix Savero" // optional
}
```

Response Body (Success) :

```json
{
  "data": {
    "username": "felixsavero",
    "name": "Felix Savero"
  }
}
```

Response Body (Failed) :

```json
{
  "data": {
    "errors": "Unauthorized"
  }
}
```

## Logout User

Endpoint : DELETE /api/users/current

Headers :

- Authorization : token

Response Body (Success) :

```json
{
  "data": true
}
```

Response Body (Failed) :

```json
{
  "data": {
    "errors": "Unauthorized"
  }
}
```
