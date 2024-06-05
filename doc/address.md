# Address API Spec

## Create Address

Endpoint : POST /api/contacts/:contactId/addresses

Headers :

- Authorization : token

Request Body :

```json
{
  "street": "jalan contoh", // optional
  "city": "kota contoh", // optional
  "province": "provinsi contoh", // optional
  "country": "country contoh",
  "postalCode": "112233"
}
```

Response Body (Success) :

```json
{
  "data": {
    "id": 1,
    "street": "jalan contoh",
    "city": "kota contoh",
    "province": "provinsi contoh",
    "country": "country contoh",
    "postalCode": "112233"
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "Unauthorized"
}
```

## Get Address

Endpoint : GET /api/contacts/:contactId/addresses/:addressId

Headers :

- Authorization : token

Response Body (Success) :

```json
{
  "data": {
    "id": 1,
    "street": "jalan contoh",
    "city": "kota contoh",
    "province": "provinsi contoh",
    "country": "country contoh",
    "postalCode": "112233"
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "Unauthorized"
}
```

## Update Address

Endpoint : PUT /api/contacts/:contactId/addresses/:addressId

Headers :

- Authorization : token

Request Body :

```json
{
  "street": "jalan contoh", // optional
  "city": "kota contoh", // optional
  "province": "provinsi contoh", // optional
  "country": "country contoh",
  "postalCode": "112233"
}
```

Response Body (Success) :

```json
{
  "data": {
    "id": 1,
    "street": "jalan contoh",
    "city": "kota contoh",
    "province": "provinsi contoh",
    "country": "country contoh",
    "postalCode": "112233"
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "Unauthorized"
}
```

## Remove Address

Endpoint : DELETE /api/contacts/:contactId/addresses/:addressId

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
  "errors": "Unauthorized"
}
```

## List Address

Endpoint : GET /api/contacts/:contactId/addresses

Headers :

- Authorization : token

Response Body :

```json
{
  "data": [
    {
      "id": 1,
      "street": "jalan contoh",
      "city": "kota contoh",
      "province": "provinsi contoh",
      "country": "country contoh",
      "postalCode": "112233"
    },
    {
      "id": 2,
      "street": "jalan contoh",
      "city": "kota contoh",
      "province": "provinsi contoh",
      "country": "country contoh",
      "postalCode": "112233"
    }
  ]
}
```
