# API DOCUMENTATION - EXPENSE TYPES

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

## GET /expenses/expenseTypes

### header:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

> __Response (200 - OK)__

```json
{
  "message": "Success Read All Document: Expense Types",
  "data": [
    {
      "id": 1,
      "name": "Electricity",
      "description": "pembayaran listrik ruko bulanan"
    },
    {
      "id": 2,
      "name": "Water bill",
      "description": "pembayaran tagihan air"
    }
  ]
}
```

## GET /expenses/expenseTypes/:id

### header:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

> __Response (200 - OK)__

```json
{
  "message": "Success Read All Document: Expense Types",
  "data": {
    "id": 1,
    "name": "Electricity",
    "description": "pembayaran listrik ruko bulanan"
  }
}
```

> __Response (404 - NOT FOUND)__

```json
{
  "message": "Data with id <id> not found"
}
```

## POST /expenses/expenseTypes

### header:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

### body:

```json
{
  "name": "Electricity",
  "description": "pembayaran listrik ruko bulanan"
}
```

> __Response (201 - CREATED)__

```json
{
  "message": "Success Create: Electricity",
  "newData": {
    "id": 1,
    "name": "Electricity",
    "description": "pembayaran listrik ruko bulanan"
  }
}
```

> __Response (400 - BAD REQUEST)__

```json
{
  "message": "<Field> is required"
}
```

## PUT /expenses/expenseTypes/:id

### header:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

### body:

```json
{
  "name": "Electricity",
  "description": "pembayaran listrik ruko bulanan"
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

> __Response (404 - NOT FOUND)__

```json
{
  "message": "Data with id <id> not found"
}
```

## DELETE /expenses/expenseTypes/:id

### header:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

> __Response (200 - OK)__

```json
{
  "message": "Deleted <ExpenseType_Name>"
}
```

> __Response (400 - BAD REQUEST)__

```json
{
  "message": "Cannot Delete Data!"
}
```

> __Response (404 - NOT FOUND)__

```json
{
  "message": "Data with id <id> not found"
}
```