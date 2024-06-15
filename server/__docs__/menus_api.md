# API DOCUMENTATION - MENUS

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

## GET /inventory/menus

### header:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

> __Response (200 - OK)__

```json
{
  "message": "Success Read All Document: Menus",
  "data": [
    {
      "id": 2,
      "name": "Nasi Goreng",
      "price": 56000,
      "imgUrl": "htts://google.com",
      "updatedBy": "Haji Mamat",
      "createdAt": "2024-06-08",
      "updatedAt": "2024-06-08"
    },
        {
      "id": 3,
      "name": "Soto Betawi Santan",
      "price": 37000,
      "imgUrl": "htts://google.com",
      "updatedBy": "Haji Mamat",
      "createdAt": "2024-06-08",
      "updatedAt": "2024-06-08"
    }
  ]
}
```

## GET /inventory/menus/:id

### header:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

> __Response (200 - OK)__

```json
{
  "message": "Success Read All Document: Menus",
  "data": {
    "id": 2,
    "name": "Nasi Goreng",
    "price": 56000,
    "imgUrl": "htts://google.com",
    "MenuIngredients": [
      {
        "id": 3,
        "quantity": 2,
        "toDelete": false,
        "Ingredients": {
          "id": 4,
          "ingredientName": "beras",
          "unit": "Kilogram"
        }
      },
      {
        "id": 4,
        "quantity": 2,
        "toDelete": false,
        "Ingredients": {
          "id": 6,
          "ingredientName": "bawah goreng",
          "unit": "Gram"
        }
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

## POST /inventory/menus

### header:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

### body:

```json
{
  "name": "Nasi Goreng",
  "price": 56000,
  "image": "FILE",
  "ingredients": [
    {
      "quantity": 2,
      "IngredientId": 1
    },
    {
      "quantity": 2,
      "IngredientId": 2
    },
    {
      "quantity": 2,
      "IngredientId": 3
    }
  ]
}
```

> __Response (201 - CREATED)__

```json
{
  "message": "Success Create: Nasi Goreng",
  "newData": {
    "id": 2,
    "name": "Nasi Goreng",
    "price": 56000,
    "updatedBy": "Haji Mamat",
    "createdAt": "2024-06-08T15:32:51.924Z",
    "updatedAt": "2024-06-08T15:32:51.924Z"
  }
}
```

> __Response (400 - BAD REQUEST)__

```json
{
  "message": "<Field> is required"
}
```

## PUT /inventory/menus/:id

### header:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

### body:

```json
{
  "name": "Nasi Goreng",
  "price": 56000,
  "image": "FILE",
  "ingredients": [
    {
      "id": 3,
      "quantity": 2,
      "toDelete": false,
      "IngredientId": 4,
      "MenuId": 2
    },
    {
      "id": 4,
      "quantity": 2,
      "toDelete": false,
      "IngredientId": 6,
      "MenuId": 2
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

> __Response (404 - NOT FOUND)__

```json
{
  "message": "Data with id <id> not found"
}
```

## DELETE /inventory/menus/:id

### header:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

> __Response (200 - OK)__

```json
{
  "message": "Deleted <Menu_Name>"
}
```

> __Response (404 - NOT FOUND)__

```json
{
  "message": "Data with id <id> not found"
}
```