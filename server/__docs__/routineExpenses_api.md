# API DOCUMENTATION - ROUTINE EXPENSES

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

## GET /expenses/routine

### header:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

> __Response (200 - OK)__

```json
{
  "message": "Success Read All Document: Routine Expenses",
  "data": [
    {
      "id": 2,
      "date": "2024-01-01",
      "amount": 1230000,
      "docStatus": "Draft",
      "description": "lorem ipsum",
      "TypeId": 1,
      "createdBy": "Haji Mamat",
      "postedBy": null,
      "createdAt": "2024-06-08",
      "updatedAt": "2024-06-08",
      "ExpenseType": {
        "name": "Electricity"
      }
    }
  ]
}
```

## GET /expenses/routine/:id

### header:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

> __Response (200 - OK)__

```json
{
  "message": "Success Read All Document: Routine Expenses",
  "data": {
    "id": 2,
    "date": "2024-01-01",
    "amount": 1230000,
    "docStatus": "Draft",
    "description": "lorem ipsum",
    "TypeId": 1,
    "createdBy": "Haji Mamat",
    "postedBy": null,
    "createdAt": "2024-06-08",
    "updatedAt": "2024-06-08",
    "ExpenseType": {
      "name": "Electricity"
    }
  }
}
```

> __Response (404 - NOT FOUND)__

```json
{
  "message": "Data with id <id> not found"
}
```

## POST /expenses/routine

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
  "TypeId": 1
}
```

> __Response (201 - CREATED)__

```json
{
  "message": "Success Create: Routine Expense Document",
  "newData": {
    "docStatus": "Draft",
    "id": 3,
    "date": "2024-01-01T00:00:00.000Z",
    "amount": 1230000,
    "description": "lorem ipsum",
    "TypeId": 1,
    "createdBy": "Haji Mamat",
    "updatedAt": "2024-06-08T16:44:38.973Z",
    "createdAt": "2024-06-08T16:44:38.973Z",
    "postedBy": null
  }
}
```

> __Response (400 - BAD REQUEST)__

```json
{
  "message": "<Field> is required"
}
```

## PUT /expenses/routine/:id

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
  "TypeId": 1
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

## PATCH /expenses/routine/:id

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

## DELETE /expenses/routine/:id

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