### 1) Movie List API

- URL: GET /movies

- Request: Not required

- Response:
````json
{
  "data":[
    {
      "id" "MV101",
      "name": "hanuman ansh",
      "genres": ["devotionl","drama"],
      "rating": 9.8,
      "likes": 433000,
      ...
    },
  ]
}
````

### 2) Movie Details API

- URL: GET /movies/{id}

- Request: Not Required

- Response:
````json
{
  "id": "MV101",
  "title": "hanuman ansh",
  "duration_minutes": 143,
  "certification": "UA13+",
  ...
}
````

### 3) Cast API

- URL: GET /movie/{id}/cast

- Request: Not Required

- Response:
````json
{
  "data": [
    {
      "id": "CST101",
      "name": "Chandan Ananad",
      "img_url": "...",
      ...
    },
    ...
  ]
}
````

### 4) Crew API

- URL: GET 

- Request: Not Required

- Response: 
````json
{
  "data": [
    {
      "id": "CRW101",
      "name": "Vishal Chaturvedi",
      "roles": ["director", "producer"]
    },
    ...
  ]
}
````

### 5) Rating(Add) API

- URL: POST /movies/{id}/rating

- Request: 
````json
{
  "id": "RT101",
  "user_id": "1",
  "rate": 7,
  "review": "...",
  ...
}
````

- Response:
````json
{
  "message": "successfully added",
  ...
}
````

### 6) Movie Trailers API

- URL: GET /movies/{id}/trailers

- Request: Not Required

- Response:
```json
{
  "data":[
    {
      "id": "TR101",
      "title": "hanuman ansh teaser",
      "languages": ["Hindi", "English"],
      ...
    }
  ]
}
```

### 7) Cinema List API

- URL: GET /cinemas

- Query Parameter:
````json
{
  "city": "Pune",
  "movie_id": "MV101",
  ...
}
````

- Request: Not Required

- Response:
````json
{
  "data":[
    {
      "id": "CN101",
      "name": "PVR: Icon",
      "address": "...",
      ...
    },
    ...
  ]
}
````

### 8) Movie Showtimes API

- URL: GET /movies/{id}/shows

- Query Parameter:
````json
{
  "city": "Pune",
  "movie_id": "MV101",
  ...
}
````

- Request: Not Required

- Response:
````json
{
  "data":[
    {
      "id": "SW101",
      "cinema_id": "CN101",
      "start_time": "10:30 PM",
      "address": "...",
      ...
    },
    ...
  ]
}
````

### 9) Seat Layout API

- URL: GET /shows/{id}/seats

- Request: Not Required 

- Response: 
````json
{
  "show_id": "SW101",
  "data": [
    {
      "id": "ST101",
      "row": "A",
      "number": 1,
      "type": "PREMIUM",
      "price": 250,
      "status": "booked",
      ...
    },
    ...
  ]
}
````

### 10) Booking API

- URL: POST /booking

- Request:
````json
{
  "show_id": "SW101",
  "seats": ["A1", "A2"],
  ...
}
````

- Response:
````json
{
  "booking_id": "BK101",
  "amount": 500,
  "status": "pending_payment",
  ...
}
````

### 11) Booking Details API

- URL: GET /booking/{id}

- Request: Not Required

- Response:
````json
{
  "booking_id": "BK101",
  "amount": 500,
  "status": "confirm",
  "movie": {
    "title": "hanuman ansh",
    ...
  },
  ...
}
````

### 13) Events API

- URL: GET /events

- Request: Not Required

- Response:
````json
{
  "data": [
    {
      "id": "EVN101",
      "name": "comedy shows",
      "description": "135+ events",
      ...
    },
    ...
  ]
}
````

### 14) Reviews API

- URL: GET /movies/{id}/reviews

- Request: Not Required

- Response:
````json
{
  "data": [
    {
      "user_id": "USR101",
      "name": "Aryaman",
      "rating": 10,
      "reviews": "Don’t have enough words to express how touching the story is. Literally have goosebumps writing this review.",
      ...
    },
    ...
  ]
}
````