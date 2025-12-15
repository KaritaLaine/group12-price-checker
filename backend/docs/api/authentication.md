# Authentication API

## Register a new user

**POST** `/api/v1/auth/register`

### Request Body

```json
{
  "username": "storeuser123",
  "email": "user@example.com",
  "password": "SecurePass123!",
  "storeName": "My Store",
  "latitude": 60.1699,
  "longitude": 24.9384
}
```

### Parameters

| Name      | Type            | Required | Description |
|-----------|-----------------|----------|-------------|
| username  | string          | true     | Username    |
| email     | string (email)  | true     | Email       |
| password  | string          | true     | Password    |
| storeName | string          | true     | Store name  |
| latitude  | number (double) | true     | Latitude    |
| longitude | number (double) | true     | Longitude   |

### Responses

| Status | Description                 |
|--------|-----------------------------|
| 201    | User successfully registered|
| 400    | Invalid input               |

---

## Login user

**POST** `/api/v1/auth/login`

### Request Body

```json
{
  "email": "user@example.com",
  "password": "pa$$word"
}
```

### Parameters

| Name     | Type           | Required | Description |
|----------|----------------|----------|-------------|
| email    | string (email) | true     | Email       |
| password | string         | true     | Password    |

### Responses

| Status | Description          |
|--------|----------------------|
| 200    | Successful login     |
| 401    | Invalid credentials  |

### Response Schema (200)

```json
{
  "token": "string"
}
```

---

## Refresh authentication token

**POST** `/api/v1/auth/refresh`

### Responses

| Status | Description                   |
|--------|-------------------------------|
| 200    | Token refreshed successfully  |
| 401    | Invalid or expired token      |
