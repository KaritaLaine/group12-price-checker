# Admin API

All Admin API endpoints require authentication with admin role.

## Get all users

**GET** `/api/v1/admin/users`

**Authentication Required:** Bearer Token (Admin Role)

### Responses

| Status | Description      |
|--------|------------------|
| 200    | List of all users|
| 401    | Unauthorized     |
| 403    | Forbidden        |

### Response Schema (200)

```json
[
  {
    "id": "string",
    "email": "user@example.com",
    "name": "string",
    "role": "user"
  }
]
```

**Role Values:** `user`, `store`, `admin`

---

## Approve store user

**PATCH** `/api/v1/admin/approve/{userId}`

**Authentication Required:** Bearer Token (Admin Role)

### Parameters

| Name   | In   | Type   | Required | Description |
|--------|------|--------|----------|-------------|
| userId | path | string | true     | User ID     |

### Responses

| Status | Description   |
|--------|---------------|
| 200    | User approved |
| 401    | Unauthorized  |
| 403    | Forbidden     |

---

## Decline store user

**PATCH** `/api/v1/admin/decline/{userId}`

**Authentication Required:** Bearer Token (Admin Role)

### Parameters

| Name   | In   | Type   | Required | Description |
|--------|------|--------|----------|-------------|
| userId | path | string | true     | User ID     |

### Responses

| Status | Description   |
|--------|---------------|
| 200    | User declined |
| 401    | Unauthorized  |
| 403    | Forbidden     |

---

## Update store user status

**PATCH** `/api/v1/admin/user-status/{userId}`

**Authentication Required:** Bearer Token (Admin Role)

### Request Body

```json
{
  "status": "string"
}
```

### Parameters

| Name   | In   | Type   | Required | Description |
|--------|------|--------|----------|-------------|
| userId | path | string | true     | User ID     |
| status | body | string | false    | New status  |

### Responses

| Status | Description         |
|--------|---------------------|
| 200    | User status updated |
| 401    | Unauthorized        |
| 403    | Forbidden           |

---

## Delete store user

**DELETE** `/api/v1/admin/delete/{userId}`

**Authentication Required:** Bearer Token (Admin Role)

### Parameters

| Name   | In   | Type   | Required | Description |
|--------|------|--------|----------|-------------|
| userId | path | string | true     | User ID     |

### Responses

| Status | Description  |
|--------|--------------|
| 200    | User deleted |
| 401    | Unauthorized |
| 403    | Forbidden    |

---

## Create new admin user

**POST** `/api/v1/admin/create-admin`

**Authentication Required:** Bearer Token (Admin Role)

### Request Body

```json
{
  "email": "user@example.com",
  "password": "string",
  "name": "string"
}
```

### Parameters

| Name     | Type           | Required | Description |
|----------|----------------|----------|-------------|
| email    | string (email) | true     | Email       |
| password | string         | true     | Password    |
| name     | string         | true     | Name        |

### Responses

| Status | Description                |
|--------|----------------------------|
| 201    | Admin created successfully |
| 401    | Unauthorized               |
| 403    | Forbidden                  |
