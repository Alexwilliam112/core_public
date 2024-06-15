# API DOCUMENTATION - AUTHENTICATIONS

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

## POST /login

### body:

```json
{
  "username": "string",
  "password": "string"
}
```

> __Response (200 - OK)__

```json
{
  "newUser": "boolean",
  "auth": "array of object",
  "access_token": "string"
}
```

> __Response (400 - BAD REQUEST)__

```json
{
  "message": "Email and Password is required"
}
```

> __Response (401 - UNAUTHORIZED)__

```json
{
  "message": "Incorrect Username or Password"
}
```

## POST /changePass

### header:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

### body:

```json
{
  "newPassword": "string",
  "repeatPassword": "string"
}
```

> __Response (200 - OK)__

```json
{
  "message": "Successfully Change Password"
}
```

> __Response (400 - BAD REQUEST)__

```json
{
  "message": "Retyped password is not the same!"
}
```

> __Response (401 - UNAUTHORIZED)__

```json
{
  "message": "Unauthorized Access. Please LogIn"
}
```

