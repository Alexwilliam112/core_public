# API DOCUMENTATION - MasterIngredient

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

## GET /inventory/ingredients

### header:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

> __Response (200 - OK)__

```json
{
  "message": "Success Read All Document: Master Ingredients",
  "data": [
    {
      "id": 1,
      "ingredientName": "terigu",
      "unit": "Gram",
      "updatedBy": "Haji Mamat"
    },
    {
      "id": 2,
      "ingredientName": "sambal",
      "unit": "Piece",
      "updatedBy": "Haji Mamat"
    }
  ]
}
```

## GET /inventory/ingredients/:id

### header:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

> __Response (200 - OK)__

```json
{
  "message": "Success Read All Document: Master Ingredients",
  "data": {
    "id": 1,
    "ingredientName": "terigu",
    "unit": "Gram",
    "updatedBy": "Haji Mamat"
  }
}
```

> __Response (404 - NOT FOUND)__

```json
{
  "message": "Data with id <id> not found"
}
```

## POST /inventory/ingredients

### header:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

### body:

```json
{
  "ingredientName": "beras",
  "unit": "Kilogram"
}
```

> __Response (201 - CREATED)__

```json
{
  "message": "Success Create: beras",
  "newData": {
    "id": 4,
    "ingredientName": "beras",
    "unit": "Kilogram",
    "updatedBy": "Haji Mamat"
  }
}
```

> __Response (400 - BAD REQUEST)__

```json
{
  "message": "<Field> is required"
}
```

## PUT /inventory/ingredients/:id

### header:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

### body:

```json
{
  "ingredientName": "bawang putih",
  "unit": "Gram"
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

## DELETE /inventory/ingredients/:id

### header:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

> __Response (200 - OK)__

```json
{
  "message": "Deleted <ingredientName>"
}
```

> __Response (404 - NOT FOUND)__

```json
{
  "message": "Data with id <id> not found"
}
```