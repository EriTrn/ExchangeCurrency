# API Documentation

## Overview

This document provides detailed information about all API endpoints available in the Currency Exchange application.

## Base URL

```
http://localhost:5000/api
```

## Authentication

Currently, no authentication is required for API endpoints. In production, consider implementing API key authentication.

## Endpoints

### 1. Get Exchange Rates

Retrieve current exchange rates for a specific base currency.

**Endpoint:** `GET /api/rates`

**Parameters:**
| Parameter | Type   | Required | Default | Description                    |
|-----------|--------|----------|---------|--------------------------------|
| base      | string | No       | USD     | Base currency code (ISO 4217)  |

**Example Request:**
```bash
curl "http://localhost:5000/api/rates?base=USD"
```

**Success Response (200 OK):**
```json
{
  "result": "success",
  "base_code": "USD",
  "conversion_rates": {
    "IDR": 15750.50,
    "EUR": 0.92,
    "GBP": 0.79,
    "JPY": 149.50,
    "SGD": 1.34,
    "AUD": 1.52,
    "CNY": 7.24
  },
  "time_last_update_utc": "Tue, 27 Jan 2025 10:30:00 +0000"
}
```

---

### 2. Convert Currency

Convert an amount from one currency to another with fee calculation.

**Endpoint:** `POST /api/convert`

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "amount": 1000000,
  "base_currency": "IDR",
  "target_currency": "USD",
  "provider": "Bank Central"
}
```

**Parameters:**
| Field          | Type   | Required | Description                           |
|----------------|--------|----------|---------------------------------------|
| amount         | number | Yes      | Amount to convert                     |
| base_currency  | string | Yes      | Source currency code                  |
| target_currency| string | Yes      | Target currency code                  |
| provider       | string | No       | Exchange provider name                |

**Example Request:**
```bash
curl -X POST http://localhost:5000/api/convert \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1000000,
    "base_currency": "IDR",
    "target_currency": "USD",
    "provider": "Bank Central"
  }'
```

**Success Response (200 OK):**
```json
{
  "original_amount": 1000000,
  "base_currency": "IDR",
  "target_currency": "USD",
  "exchange_rate": 0.0000625,
  "converted_amount": 62.50,
  "fee": 0.31,
  "fee_type": "percentage",
  "final_amount": 62.19,
  "exchangeable": 62.00,
  "remainder": 0.19,
  "provider": "Bank Central",
  "timestamp": "2025-01-27T10:30:00.000000"
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Invalid currency pair"
}
```

**Error Response (500 Internal Server Error):**
```json
{
  "error": "Failed to fetch exchange rates"
}
```

---

### 3. Compare Providers

Compare exchange rates and fees across all available providers.

**Endpoint:** `POST /api/compare`

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "amount": 1000000,
  "base_currency": "IDR",
  "target_currency": "USD"
}
```

**Parameters:**
| Field          | Type   | Required | Description          |
|----------------|--------|----------|----------------------|
| amount         | number | Yes      | Amount to convert    |
| base_currency  | string | Yes      | Source currency code |
| target_currency| string | Yes      | Target currency code |

**Example Request:**
```bash
curl -X POST http://localhost:5000/api/compare \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1000000,
    "base_currency": "IDR",
    "target_currency": "USD"
  }'
```

**Success Response (200 OK):**
```json
{
  "comparisons": [
    {
      "provider": "Money Changer A",
      "rate": 0.0000629,
      "spread": "1.0%",
      "converted_amount": 62.90,
      "fee": 0.19,
      "final_amount": 62.71,
      "exchangeable": 62.00,
      "remainder": 0.71
    },
    {
      "provider": "Bank Central",
      "rate": 0.0000625,
      "spread": "1.5%",
      "converted_amount": 62.50,
      "fee": 0.31,
      "final_amount": 62.19,
      "exchangeable": 62.00,
      "remainder": 0.19
    }
  ],
  "timestamp": "2025-01-27T10:30:00.000000"
}
```

---

### 4. Get Historical Data

Retrieve historical exchange rate data for a currency pair.

**Endpoint:** `GET /api/historical`

**Parameters:**
| Parameter | Type   | Required | Default | Description                    |
|-----------|--------|----------|---------|--------------------------------|
| base      | string | No       | USD     | Base currency code             |
| target    | string | No       | IDR     | Target currency code           |
| days      | integer| No       | 7       | Number of days (7 or 30)       |

**Example Request:**
```bash
curl "http://localhost:5000/api/historical?base=USD&target=IDR&days=7"
```

**Success Response (200 OK):**
```json
{
  "base_currency": "USD",
  "target_currency": "IDR",
  "data": [
    {
      "date": "2025-01-20",
      "rate": 15723.45
    },
    {
      "date": "2025-01-21",
      "rate": 15735.20
    },
    {
      "date": "2025-01-22",
      "rate": 15742.10
    },
    {
      "date": "2025-01-23",
      "rate": 15738.50
    },
    {
      "date": "2025-01-24",
      "rate": 15745.30
    },
    {
      "date": "2025-01-25",
      "rate": 15750.50
    },
    {
      "date": "2025-01-26",
      "rate": 15748.20
    },
    {
      "date": "2025-01-27",
      "rate": 15750.50
    }
  ]
}
```

**Error Response (500 Internal Server Error):**
```json
{
  "error": "Failed to fetch historical data"
}
```

---

### 5. Get Supported Currencies

Retrieve a list of all supported currencies.

**Endpoint:** `GET /api/currencies`

**Example Request:**
```bash
curl "http://localhost:5000/api/currencies"
```

**Success Response (200 OK):**
```json
{
  "USD": "US Dollar",
  "EUR": "Euro",
  "GBP": "British Pound",
  "JPY": "Japanese Yen",
  "IDR": "Indonesian Rupiah",
  "SGD": "Singapore Dollar",
  "AUD": "Australian Dollar",
  "CNY": "Chinese Yuan"
}
```

---

### 6. Get Exchange Providers

Retrieve a list of all available exchange providers.

**Endpoint:** `GET /api/providers`

**Example Request:**
```bash
curl "http://localhost:5000/api/providers"
```

**Success Response (200 OK):**
```json
[
  "Bank Central",
  "Bank Mandiri",
  "Bank BCA",
  "Money Changer A",
  "Money Changer B",
  "Airport Exchange"
]
```

---

## Response Codes

| Code | Description                                          |
|------|------------------------------------------------------|
| 200  | Success - Request completed successfully             |
| 400  | Bad Request - Invalid parameters or request body     |
| 404  | Not Found - Endpoint doesn't exist                   |
| 500  | Internal Server Error - Server-side error occurred   |

---

## Rate Limiting

Currently, there is no rate limiting implemented. For production use, consider implementing:
- Rate limiting per IP address
- API key-based authentication
- Request throttling

---

## Caching

The application implements caching for exchange rates:
- Cache duration: 60 seconds (configurable)
- Reduces external API calls
- Improves response time

---

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error description here"
}
```

Common error scenarios:
1. Invalid currency codes
2. Missing required parameters
3. External API failures
4. Network connectivity issues

---

## Data Models

### ExchangeRate
```python
{
  "base_code": str,           # Base currency code
  "conversion_rates": dict,   # Dictionary of rates
  "time_last_update_utc": str # Last update timestamp
}
```

### ConversionResult
```python
{
  "original_amount": float,      # Input amount
  "base_currency": str,          # Source currency
  "target_currency": str,        # Target currency
  "exchange_rate": float,        # Applied exchange rate
  "converted_amount": float,     # Amount before fees
  "fee": float,                  # Service fee
  "fee_type": str,               # 'percentage' or 'fixed'
  "final_amount": float,         # Amount after fees
  "exchangeable": float,         # Amount in valid denominations
  "remainder": float,            # Unexchangeable remainder
  "provider": str,               # Provider name
  "timestamp": str               # ISO 8601 timestamp
}
```

### ProviderComparison
```python
{
  "provider": str,              # Provider name
  "rate": float,                # Exchange rate
  "spread": str,                # Spread percentage
  "converted_amount": float,    # Converted amount
  "fee": float,                 # Service fee
  "final_amount": float,        # Final amount
  "exchangeable": float,        # Exchangeable amount
  "remainder": float            # Remainder
}
```

### HistoricalData
```python
{
  "date": str,      # Date in YYYY-MM-DD format
  "rate": float     # Exchange rate for that date
}
```

---

## Integration Examples

### JavaScript (Fetch API)

```javascript
// Convert currency
async function convertCurrency(amount, from, to, provider) {
  const response = await fetch('/api/convert', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      amount: amount,
      base_currency: from,
      target_currency: to,
      provider: provider
    })
  });
  
  const result = await response.json();
  return result;
}

// Get exchange rates
async function getRates(baseCurrency) {
  const response = await fetch(`/api/rates?base=${baseCurrency}`);
  const data = await response.json();
  return data;
}
```

### Python (requests)

```python
import requests

# Convert currency
def convert_currency(amount, from_curr, to_curr, provider):
    url = 'http://localhost:5000/api/convert'
    data = {
        'amount': amount,
        'base_currency': from_curr,
        'target_currency': to_curr,
        'provider': provider
    }
    response = requests.post(url, json=data)
    return response.json()

# Get exchange rates
def get_rates(base_currency='USD'):
    url = f'http://localhost:5000/api/rates?base={base_currency}'
    response = requests.get(url)
    return response.json()
```

### cURL

```bash
# Get rates
curl "http://localhost:5000/api/rates?base=USD"

# Convert currency
curl -X POST http://localhost:5000/api/convert \
  -H "Content-Type: application/json" \
  -d '{"amount":1000000,"base_currency":"IDR","target_currency":"USD","provider":"Bank Central"}'

# Compare providers
curl -X POST http://localhost:5000/api/compare \
  -H "Content-Type: application/json" \
  -d '{"amount":1000000,"base_currency":"IDR","target_currency":"USD"}'

# Get historical data
curl "http://localhost:5000/api/historical?base=USD&target=IDR&days=7"
```

---

## Changelog

### Version 1.0.0 (2025-01-27)
- Initial API release
- All core endpoints implemented
- Caching mechanism added
- Error handling implemented

---

## Support

For API-related questions or issues, please refer to the main README.md file or check the application logs.
