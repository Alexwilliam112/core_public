# API DOCUMENTATION - CASHIER / POINT OF SALES

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

## GET /operations/sales

### header:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

> __Response (200 - OK)__

```json
{
  "message": "Success Read All Document: Sales",
  "data": [
    {
      "id": 1,
      "table": "1",
      "amount": 560000,
      "docStatus": "Draft",
      "cashier": "Haji Mamat",
      "createdAt": "2024-06-08",
      "updatedAt": "2024-06-08"
    },
    {
      "id": 2,
      "table": "11",
      "amount": 560000,
      "docStatus": "Draft",
      "cashier": "Haji Mamat",
      "createdAt": "2024-06-08",
      "updatedAt": "2024-06-08"
    }
  ]
}
```

## GET /operations/sales/:id

### header:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

> __Response (200 - OK)__

```json
{
  "message": "Success Read All Document: Sales",
  "data": {
    "id": 1,
    "table": "1",
    "amount": 560000,
    "docStatus": "Draft",
    "cashier": "Haji Mamat",
    "createdAt": "2024-06-08",
    "updatedAt": "2024-06-08",
    "SalesDetails": [
      {
        "id": 1,
        "menuName": "Nasi Goreng",
        "price": 15000,
        "quantity": 1,
        "SalesId": 1,
        "toDelete": false
      },
      {
        "id": 2,
        "menuName": "Ayam Goreng",
        "price": 35000,
        "quantity": 1,
        "SalesId": 1,
        "toDelete": false
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

## POST /operations/sales

### header:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

### body:

```json
{
  "table": "1",
  "amount": 560000,
  "orders": [
    {
      "menuName": "Nasi Goreng",
      "price": 15000,
      "quantity": 1
    },
    {
      "menuName": "Ayam Goreng",
      "price": 35000,
      "quantity": 1
    }
  ]
}
```

> __Response (201 - CREATED)__

```json
{
  "message": "Success Create: TABLE ORDER: <table>"
}
```

> __Response (400 - BAD REQUEST)__

```json
{
  "message": "<Field> is required"
}
```

> __Response (400 - BAD REQUEST)__

```json
{
  "message": "Please input minimum 1 order"
}
```

## PUT /operations/sales/:id

### header:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

### body:

```json
{
  "table": "1",
  "amount": 246000,
  "orders": [
    {
      "id": 7,
      "menuName": "Nasi Goreng",
      "price": 15000,
      "quantity": 1,
      "SalesId": 3,
      "toDelete": false
    },
    {
      "id": 8,
      "menuName": "Ayam Goreng",
      "price": 35000,
      "quantity": 1,
      "SalesId": 3,
      "toDelete": false
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

```json
{
  "message": "Please input minimum 1 order"
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

## PATCH /operations/sales/:id

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

## DELETE /operations/sales/:id

### header:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

> __Response (200 - OK)__

```json
{
  "message": "Deleted <docStatus> TRANSACTION"
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