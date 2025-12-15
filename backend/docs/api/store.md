# Store API

All Store API endpoints require authentication.

## Update store information

**PUT** `/api/v1/store`

**Authentication Required:** Bearer Token

### Request Body

```json
{
  "name": "string",
  "address": "string"
}
```

### Parameters

| Name    | Type   | Required | Description   |
|---------|--------|----------|---------------|
| name    | string | false    | Store name    |
| address | string | false    | Store address |

### Responses

| Status | Description                |
|--------|----------------------------|
| 200    | Store information updated  |
| 401    | Unauthorized               |

---

## Add products to store

**POST** `/api/v1/store/products`

**Authentication Required:** Bearer Token

### Request Body

```json
{
  "products": [
    {
      "barcode": "string",
      "price": 0
    }
  ]
}
```

### Parameters

| Name              | Type   | Required | Description    |
|-------------------|--------|----------|----------------|
| products          | array  | false    | Product array  |
| products[].barcode| string | false    | Product barcode|
| products[].price  | number | false    | Product price  |

### Responses

| Status | Description               |
|--------|---------------------------|
| 201    | Products added successfully|
| 401    | Unauthorized              |

---

## Add discount to store product

**PUT** `/api/v1/store/products/{storeProductId}/discount`

**Authentication Required:** Bearer Token

### Request Body

```json
{
  "discount": 0
}
```

### Parameters

| Name           | In   | Type   | Required | Description       |
|----------------|------|--------|----------|-------------------|
| storeProductId | path | string | true     | Store product ID  |
| discount       | body | number | false    | Discount amount   |

### Responses

| Status | Description              |
|--------|--------------------------|
| 200    | Discount added successfully|
| 401    | Unauthorized             |
