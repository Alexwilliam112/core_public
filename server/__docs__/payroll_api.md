# API DOCUMENTATION - PAYROLL EXPENSES

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

## GET /expenses/payroll

### header:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

> __Response (200 - OK)__

```json
{
  "message": "Success Read All Document: Payroll Expenses",
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
      "updatedAt": "2024-06-08"
    }
  ]
}
```

## GET /expenses/payroll/:id

### header:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

> __Response (200 - OK)__

```json
{
  "message": "Success Read All Document: Payroll Expenses",
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
    "PayrollDetails": [
      {
        "id": 1,
        "employeeName": "John Cena",
        "salaryPaid": 5200,
        "EmploymentId": 1,
        "PayId": 1,
        "toDelete": false
      },
      {
        "id": 2,
        "employeeName": "John Wick",
        "salaryPaid": 5200,
        "EmploymentId": 2,
        "PayId": 1,
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

## POST /expenses/payroll

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
  "description": "lorem ipsum"
}
```

> __Response (201 - CREATED)__

```json
{
  "message": "Success Create: PayrollExpense Document",
  "newData": {
    "id": 7,
    "date": "2024-01-01T00:00:00.000Z",
    "amount": 13500000,
    "docStatus": "Draft",
    "description": "lorem ipsum",
    "createdBy": "Haji Mamat",
    "postedBy": null,
    "createdAt": "2024-06-11T05:27:29.974Z",
    "updatedAt": "2024-06-11T05:27:29.974Z"
  }
}
```

> __Response (400 - BAD REQUEST)__

```json
{
  "message": "<Field> is required"
}
```

## PUT /expenses/payroll/:id

### header:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

### body:
property "toDelete" in details ARRAY mark for items to be deleted.

```json
{
  "date": "2024-01-01",
  "amount": 1230000,
  "description": "lorem ipsum",
  "details": [
    {
      "id": 5,
      "employeeName": "Haji Mamat",
      "salaryPaid": 0,
      "bank": "BCA",
      "accountNumber": "12001291",
      "EmploymentId": 1,
      "PayId": 5,
      "toDelete": true
    },
    {
      "id": 6,
      "employeeName": "John Wick",
      "salaryPaid": 5600000,
      "bank": "BCA",
      "accountNumber": "22330209",
      "EmploymentId": 2,
      "PayId": 5,
      "toDelete": false
    },
    {
      "id": 7,
      "employeeName": "Gerard Butler",
      "salaryPaid": 15200,
      "bank": "BCA",
      "accountNumber": "12390101",
      "EmploymentId": 3,
      "PayId": 5,
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

## PATCH /expenses/payroll/:id

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

## DELETE /expenses/payroll/:id

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