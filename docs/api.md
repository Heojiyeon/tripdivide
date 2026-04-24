# TripDivide API Specification

This document defines the REST API contract for the TripDivide travel expense settlement service.
All endpoints return JSON responses and follow RESTful resource naming conventions.

Trips are scoped to a demoKey for demo usage.
Once created, trips are accessed via their unique tripId.

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

### Response - 201 Created

## `GET /demo/:demoKey/trips/:tripId`

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

## `GET /demo/:demoKey/trips/:tripId/participants`

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

## `POST /demo/:demoKey/trips/:tripId/participants`

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

### Response - 201 Created

## `POST /demo/:demoKey/trips/:tripId/expenses`

Validation rules

- sum(splits[].shareAmount) must equal amount

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

### Response - 201 Created

## `GET /demo/:demoKey/trips/:tripId/expenses`

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

## `GET /demo/:demoKey/trips/:tripId/settlement`

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

## `PATCH /demo/:demoKey/trips/:tripId`

Used to update trip status (e.g. OPEN -> SETTLED) and title

### Request

```json
{
  "title": "스위스 여행",
  "status": "SETTLED"
}
```

### Response

```json
{
  "id": "sdasd1",
  "title": "스위스 여행",
  "status": "SETTLED",
  "updatedAt": "2026-03-06T14:00:00Z"
}
```

## `PATCH /demo/:demoKey/trips/:tripId/expenses/:expenseId`

Validation rules

- sum(splits[].shareAmount) must equal amount

- paidById and all splits[].participantId must belong to the trip

- settled trip cannot be modified

### Request

```json
{
  "title": "스위스 렌트비",
  "amount": 120000,
  "paidById": "hgrg55",
  "splits": [
    {
      "participantId": "hgrg55",
      "shareAmount": 70000
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
  "title": "스위스 렌트비",
  "amount": 120000,
  "paidBy": {
    "id": "hgrg55",
    "name": "지연"
  },
  "splits": [
    {
      "id": "hgrg55",
      "name": "지연",
      "shareAmount": 70000
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

## `DELETE /demo/:demoKey/trips/:tripId`

### Response - 204 No Content

## `DELETE /demo/:demoKey/trips/:tripId/participants/:participantId`

기존에 지출에 추가된 참여자는 삭제 불가 (409)

### Response - 204 No Content

## `DELETE /demo/:demoKey/trips/:tripId/expenses/:expenseId`

### Response - 204 No Content

## Error Response Format

### Possible Errors

- 400 INVALID_SPLIT_SUM
- 404 TRIP_NOT_FOUND / PARTICIPANT_NOT_FOUND
- 409 TRIP_ALREADY_SETTLED / PARTICIPANT_HAS_EXPENSE_HISTORY

```json
{
  "code": "INVALID_SPLIT_SUM",
  "message": "Sum of split amounts must equal the total expense amount"
}
```
