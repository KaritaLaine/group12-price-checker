# Product API

## Get product prices by barcode

**GET** `/api/v1/product/compare/{barcode}`

### Parameters

| Name    | In   | Type   | Required | Description     |
|---------|------|--------|----------|-----------------|
| barcode | path | string | true     | Product barcode |

### Responses

| Status | Description                         |
|--------|-------------------------------------|
| 200    | Product prices retrieved successfully|
| 404    | Product not found                   |

### Response Schema (200)

```json
{
  "barcode": "string",
  "name": "string",
  "prices": [
    {}
  ]
}
```
