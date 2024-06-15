# API DOCUMENTATION - BUYINGS

#### SERVER ADDRESS:

&nbsp;

&nbsp;

## Global Error

> __Response (401 - UNAUTHORIZED)__

```json
{
  "message": "Unauthorized Access. Please LogIn"
}
```

> __Response (403 - FORBIDDEN)__

```json
{
  "message": "You Do Not Have This Access!"
}
```

> __Response (500 - INTERNAL SERVER ERROR)__

```json
{
  "message": "Internal Server Error. Please Contact Server Administrator"
}
```

## GET /expenses/buyings

### header:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

> __Response (200 - OK)__

```json
{
  "message": "Success Read All Document: Buying Expenses",
  "data": [
    {
      "id": 1,
      "date": "2024-01-01",
      "amount": 10400,
      "docStatus": "Draft",
      "description": "lorem ipsum",
      "createdBy": "Haji Mamat",
      "postedBy": null,
      "createdAt": "2024-06-08",
      "updatedAt": "2024-06-08",
      "BuyingDetails": [
        {
          "id": 1,
          "quantity": 10,
          "price": 5200,
          "ingredientName": "Beras",
          "unit": "Kilogram",
          "ExpenseId": 1
        },
        {
          "id": 2,
          "quantity": 10,
          "price": 5200,
          "ingredientName": "Bawang goreng",
          "unit": "Gram",
          "ExpenseId": 1
        }
      ]
    }
  ]
}
```

## GET /expenses/buyings/:id

### header:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

> __Response (200 - OK)__

```json
{
  "message": "Success Read All Document: Buying Expenses",
  "data": {
    "id": 1,
    "date": "2024-01-01",
    "amount": 10400,
    "docStatus": "Draft",
    "description": "lorem ipsum",
    "createdBy": "Haji Mamat",
    "postedBy": null,
    "createdAt": "2024-06-08",
    "updatedAt": "2024-06-08",
    "BuyingDetails": [
      {
        "id": 1,
        "quantity": 10,
        "price": 5200,
        "ingredientName": "Beras",
        "unit": "Kilogram",
        "toDelete": false,
        "ExpenseId": 1
      },
      {
        "id": 2,
        "quantity": 10,
        "price": 5200,
        "ingredientName": "Bawang goreng",
        "unit": "Gram",
        "toDelete": false,
        "ExpenseId": 1
      }
    ]
  }
}
```

> __Response (404 - NOT FOUND)__

```json
{
  "message": "Data with id <id> not found"
}
```

## POST /expenses/buyings

### header:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

### body:

```json
{
  "date": "2024-01-01",
  "amount": 1230000,
  "description": "lorem ipsum",
  "details": [
    {
      "quantity": 10,
      "price": 5200,
      "ingredientName": "Beras",
      "unit": "Kilogram"
    },
    {
      "quantity": 10,
      "price": 5200,
      "ingredientName": "Bawang goreng",
      "unit": "Gram"
    }
  ]
}
```

> __Response (201 - CREATED)__

```json
{
  "message": "Success Create: Buying Document",
  "newData": {
    "id": 1,
    "date": "2024-01-01T00:00:00.000Z",
    "amount": 10400,
    "docStatus": "Draft",
    "description": "lorem ipsum",
    "createdBy": "Haji Mamat",
    "postedBy": null,
    "createdAt": "2024-06-08T16:31:58.822Z",
    "updatedAt": "2024-06-08T16:31:58.822Z"
  }
}
```

> __Response (400 - BAD REQUEST)__

```json
{
  "message": "<Field> is required"
}
```

## PUT /expenses/buyings/:id

### header:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

### body:

```json
{
  "date": "2024-01-01",
  "amount": 1230000,
  "description": "lorem ipsum",
  "details": [
    {
      "id": 1,
      "quantity": 10,
      "price": 5200,
      "ingredientName": "Beras",
      "unit": "Kilogram",
      "ExpenseId": 1
    },
    {
      "id": 2,
      "quantity": 10,
      "price": 15200,
      "ingredientName": "Banana",
      "unit": "Piece",
      "ExpenseId": 1
    }
  ]
}
```

> __Response (200 - OK)__

```json
{
  "message": "Document Updated"
}
```

> __Response (400 - BAD REQUEST)__

```json
{
  "message": "<Field> is required"
}
```

> __Response (403 - FORBIDDEN)__

```json
{
  "message": "Cannot Modify POSTED Document"
}
```

> __Response (404 - NOT FOUND)__

```json
{
  "message": "Data with id <id> not found"
}
```

## DELETE /expenses/buyingDetails/:id

### header:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

> __Response (200 - OK)__

```json
{
  "message": "Deleted Item"
}
```

> __Response (404 - NOT FOUND)__

```json
{
  "message": "Data with id <id> not found"
}
```

## PATCH /expenses/buyings/:id

### header:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

### body:

```json
{
  "updateTo": "Draft / On Process / Posted"
}
```

> __Response (200 - OK)__

```json
{
  "message": "Document <new_status_name>"
}
```

> __Response (400 - BAD REQUEST)__

```json
{
  "message": "Invalid input"
}
```

> __Response (403 - FORBIDDEN)__

```json
{
  "message": "Cannot Modify POSTED Document"
}
```

> __Response (404 - NOT FOUND)__

```json
{
  "message": "Data with id <id> not found"
}
```

## DELETE /expenses/buyings/:id

### header:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

> __Response (200 - OK)__

```json
{
  "message": "Deleted Document"
}
```

> __Response (403 - FORBIDDEN)__

```json
{
  "message": "Cannot Modify POSTED Document"
}
```

> __Response (404 - NOT FOUND)__

```json
{
  "message": "Data with id <id> not found"
}
```