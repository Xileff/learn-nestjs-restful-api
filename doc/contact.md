# Contact API Spec

## Create Contact

Endpoint : POST /api/contacts

Headers :

- Authorization : token

Request Body :

```json
{
  "firstName": "Felix Savero",
  "lastName": "Felix Savero",
  "email": "felix@example.com",
  "phone": "089999999999"
}
```

Response Body (Success) :

```json
{
  "data": {
    "id": 1,
    "firstName": "Felix Savero",
    "lastName": "Felix Savero",
    "email": "felix@example.com",
    "phone": "089999999999"
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "Error message"
}
```

## Get Contact

Endpoint : GET /api/contacts/:contactId

Headers :

- Authorization : token

Response Body (Success) :

```json
{
  "data": {
    "id": 1,
    "firstName": "Felix Savero",
    "lastName": "Felix Savero",
    "email": "felix@example.com",
    "phone": "089999999999"
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "Error message"
}
```

## Update Contact

Endpoint : PUT /api/contacts/:contactId

Headers :

- Authorization : token

Request Body :

```json
{
  "firstName": "Felix Savero",
  "lastName": "Felix Savero",
  "email": "felix@example.com",
  "phone": "089999999999"
}
```

Response Body (Success) :

```json
{
  "data": {
    "id": 1,
    "firstName": "Felix Savero",
    "lastName": "Felix Savero",
    "email": "felix@example.com",
    "phone": "089999999999"
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "Error message"
}
```

## Remove Contact

Endpoint : DELETE /api/contacts/:contactId

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
  "errors": "Unauthorized, ..."
}
```

## Search Contact

Endpoint : GET /api/contacts

Headers :

- Authorization : token

Query params :

- name: string, contact first name or contact last name, optional
- phone: string, contact phone, optional
- email: string, contact email, optional
- page: number, default 1
- size: number, default 10

Response Body (Success) :

```json
{
  "data": [
    {
      "id": 1,
      "firstName": "Felix Savero",
      "lastName": "Felix Savero",
      "email": "felix@example.com",
      "phone": "089999999999"
    },
    {
      "id": 2,
      "firstName": "Felix Savero",
      "lastName": "Felix Savero",
      "email": "felix@example.com",
      "phone": "089999999999"
    }
  ],
  "paging": {
    "currentPage": 1,
    "totalPage": 10,
    "size": 10
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "Error message"
}
```
