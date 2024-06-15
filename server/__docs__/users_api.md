# API DOCUMENTATION - USER MANAGEMENT

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

## GET /admin/users

### header:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

> __Response (200 - OK)__

```json
{
  "message": "Success Read All Document: Users",
  "data": [
    {
      "id": 1,
      "username": "sta22ff",
      "role": "User",
      "createdAt": "2024-06-08",
      "updatedAt": "2024-06-08",
      "Employment": {
        "id": 1,
        "employeeName": "John Cena",
        "docStatus": "Active",
        "employmentType": "Probation",
        "joinDate": "2024-08-09",
        "salary": 120050,
        "bank": "BCA",
        "accountNumber": "12312311",
        "Jobtitle": {
          "jobtitleName": "Manager"
        }
      }
    },
  ]
}
```

## GET /admin/users/:id

### header:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

> __Response (200 - OK)__

```json
{
  "message": "Success Read All Document: Users",
  "data": {
    "id": 1,
    "username": "sta22ff",
    "role": "User",
    "createdAt": "2024-06-08",
    "updatedAt": "2024-06-08",
    "Employment": {
      "id": 1,
      "employeeName": "John Cena",
      "docStatus": "Terminated",
      "employmentType": "Probation",
      "joinDate": "2024-08-09",
      "salary": 120050,
      "bank": "BCA",
      "accountNumber": "12312311",
      "Jobtitle": {
        "jobtitleName": "Manager"
      }
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

## POST /admin/users

### header:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

### body:

```json
{
  "username": "stasff",
  "password": "12345",
  "employeeName": "John Cena",
  "employmentType": "Employee",
  "joinDate": "2024-08-09",
  "salary": 120050,
  "bank": "BCA",
  "accountNumber": "12312311",
  "JobtitleId": 2
}
```

> __Response (201 - CREATED)__

```json
{
  "message": "Success Create: <username>"
}
```

> __Response (400 - BAD REQUEST)__

```json
{
  "message": "Data already exists"
}
```

```json
{
  "message": "<Field> is required"
}
```

## PATCH /admin/users/:id

### header:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

### body:

```json
{
  "updateTo": "Terminated / Active"
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

> __Response (404 - NOT FOUND)__

```json
{
  "message": "Data with id <id> not found"
}
```

## PUT /admin/users/:id

### header:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

### body:

```json
{
  "username": "staff",
  "password": "12345",
  "employeeName": "John Cena",
  "employmentType": "Probation",
  "joinDate": "2024-08-09",
  "salary": 120050,
  "bank": "BCA",
  "accountNumber": "12312311",
  "JobtitleId": 1
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

## DELETE /admin/users/:id

### header:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

> __Response (200 - OK)__

```json
{
  "message": "Deleted USER DOCUMENT"
}
```

> __Response (403 - FORBIDDEN)__

```json
{
  "message": "Cannot Modify ACTIVE Document"
}
```

> __Response (404 - NOT FOUND)__

```json
{
  "message": "Data with id <id> not found"
}
```

## GET /admin/auth/:id

### header:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

> __Response (200 - OK)__

```json
{
  "User_Id": "4",
  "auth": [
    {
      "id": 1,
      "authorization": "USER_MANAGEMENT_READ",
      "value": false,
      "UserId": 4
    },
    {
      "id": 2,
      "authorization": "USER_MANAGEMENT_EDIT",
      "value": false,
      "UserId": 4
    },
  ]
}
```

> __Response (404 - NOT FOUND)__

```json
{
  "message": "Data with id <id> not found"
}
```

## GET /admin/jobtitles

### header:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

> __Response (200 - OK)__

```json
{
  "message": "Success Read All Document: Jobtitles",
  "data": [
    {
      "id": 1,
      "jobtitleName": "Owner"
    },
    {
      "id": 2,
      "jobtitleName": "Manager"
    },
  ]
}
```

## GET /admin/jobtitles/:id

### header:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

> __Response (200 - OK)__

```json
{
  "message": "Success Read All Document: Jobtitles",
  "data": {
    "id": 2,
    "jobtitleName": "Manager"
  }
}
```

> __Response (404 - NOT FOUND)__

```json
{
  "message": "Data with id <id> not found"
}
```

## POST /admin/jobtitles

### header:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

### body:

```json
{
  "jobtitleName": "Waiter"
}
```

> __Response (201 - CREATED)__

```json
{
  "message": "Success Create: <jobtitleName>"
}
```

> __Response (400 - BAD REQUEST)__

```json
{
  "message": "Data already exists"
}
```

## PUT /admin/jobtitles/:id

### header:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

### body:

```json
{
  "jobtitleName": "Waiter"
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
  "message": "Data already exists"
}
```

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

## DELETE /admin/jobtitles/:id

### header:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

> __Response (200 - OK)__

```json
{
  "message": "Deleted <jobtitleName>"
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