# TripDivide API Specification

This document defines the REST API contract for the TripDivide travel expense settlement service.
All endpoints return JSON responses and follow RESTful resource naming conventions.

## `GET /demo/:demoKey/trips`

### Response

```json
{
  "trips": [
    {
      "id": "sdasd1",
      "title": "유럽 여행",
      "status": "OPEN",
      "createdAt": "2026-03-06T12:00:00Z"
    }
  ]
}
```

## `POST /demo/:demoKey/trips`

### Request

```json
{
  "title": "유럽 여행"
}
```

### Response

```json
{
  "id": "sdasd1",
  "title": "유럽 여행",
  "status": "OPEN",
  "createdAt": "2026-03-06T12:00:00Z"
}
```

## `GET /trips/:tripId`

### Response

```json
{
  "id": "sdasd2",
  "title": "유럽 여행",
  "status": "OPEN",
  "createdAt": "2026-03-06T12:00:00Z",
  "participants": [
    {
      "id": "hgrg55",
      "name": "지연"
    },
    {
      "id": "ngthn",
      "name": "승우"
    }
  ],
  "expenses": [
    {
      "id": "ngthn",
      "title": "파스타",
      "amount": 50000,
      "paidBy": {
        "id": "hti45",
        "name": "승우"
      },
      "splits": [
        {
          "id": "hgrg55",
          "name": "지연",
          "shareAmount": 25000
        },
        {
          "id": "ngthn",
          "name": "승우",
          "shareAmount": 25000
        }
      ],
      "createdAt": "2026-03-06T13:00:00Z"
    }
  ]
}
```

## `GET /trips/:tripId/participants`

### Response

```json
{
  "participants": [
    {
      "id": "hgrg55",
      "name": "지연"
    },
    {
      "id": "ngthn",
      "name": "승우"
    }
  ]
}
```

## `POST /trips/:tripId/participants`

### Request

```json
{
  "name": "루이"
}
```

### Response

```json
{
  "id": "gt4",
  "name": "루이"
}
```

## `POST /trips/:tripId/expenses`

### Request

```json
{
  "title": "돌로미티 렌트비",
  "amount": 100000,
  "paidById": "hgrg55",
  "splits": [
    {
      "participantId": "hgrg55",
      "shareAmount": 50000
    },
    {
      "participantId": "ngthn",
      "shareAmount": 50000
    }
  ]
}
```

### Response

```json
{
  "id": "giun",
  "title": "돌로미티 렌트비",
  "amount": 100000,
  "paidBy": {
    "id": "hgrg55",
    "name": "지연"
  },
  "splits": [
    {
      "id": "hgrg55",
      "name": "지연",
      "shareAmount": 50000
    },
    {
      "id": "ngthn",
      "name": "승우",
      "shareAmount": 50000
    }
  ],
  "createdAt": "2026-03-06T12:00:00Z"
}
```

## `GET /trips/:tripId/expenses`

### Response

```json
{
  "expenses": [
    {
      "id": "giun",
      "title": "돌로미티 렌트비",
      "amount": 100000,
      "paidBy": {
        "id": "hgrg55",
        "name": "지연"
      },
      "splits": [
        {
          "id": "hgrg55",
          "name": "지연",
          "shareAmount": 50000
        },
        {
          "id": "ngthn",
          "name": "승우",
          "shareAmount": 50000
        }
      ],
      "createdAt": "2026-03-06T12:00:00Z"
    }
  ]
}
```

## `GET /trips/:tripId/settlement`

### Response

```json
{
  "trip": {
    "title": "유럽 여행",
    "status": "OPEN"
  },
  "summary": {
    "totalExpense": 100000
  },
  "transactions": [
    {
      "from": {
        "id": "ngthn",
        "name": "승우"
      },
      "to": {
        "id": "hgrg55",
        "name": "지연"
      },
      "amount": 50000
    }
  ],
  "updatedAt": "2026-03-06T13:00:00Z"
}
```
