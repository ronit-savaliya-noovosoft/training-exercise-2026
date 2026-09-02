### 0) Login API

- URL: POST auth/login

- Request: 
````json
{
  "username": "ronit savaliya",
  "password": "******"
}
````

- Response:
````
Set-Cookies: access_token=<JWT>
````
````json
{
  "message": "Successfully logged in",
  ...
}
````

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

- Status Code: 200(Ok)

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

- Status Code: 200(Ok)

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

- Status Code: 200(Ok)

### 4) Crew API

- URL: GET /movies/{id}/crew

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

- Status Code: 200(Ok)

### 5) Rating(Add) API

- URL: POST /movies/{id}/rating

    Note: JWT Required

- Request: 
````json
{
  "id": "RT101",
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

- Status Code: 200(Ok)/201(Created)

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

- Status Code: 200(Ok)/206(Partial Content)

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

- Status Code: 200(Ok)

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

- Status Code: 200(Ok)

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

- Status Code: 200(Ok)

### 10) Booking API

- URL: POST /booking

    Note: JWT Required

- Headers: 
````
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
````

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

- Status Code: 200(Ok)/201(Created)

### 11) Booking Details API

- URL: GET /booking/{id}

    Note: JWT Required

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

- Status Code: 200(Ok)

### 13) Events API

- URL: GET /events/categories

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

- Status Code: 200(Ok)

### 14) Activities API

- URL: GET /activities

- Request: Not Required

- Response:
````json
{
  "data": [
    {
      "id": "ACT101",
      "name": "rohini garba learn garba in 3 days",
      "address": "Nahata lawns Pune",
      ...
    },
    ...
  ]
}
````

- Status Code: 200(Ok)

### 15) Plays API

- URL: GET /plays

- Request: Not Required

- Response:
````json
{
  "data": [
    {
      "id": "PLY101",
      "name": "Shikalya gelo ek",
      "language": "Marathi",
      ...
    },
    ...
  ]
}
````

- Status Code: 200(Ok)

### 16) Reviews API

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
- Status Code: 200(Ok)

### 17) Edit Review API

- URL: PATCH /movies/{movie_id}/reviews/{review_id}

  Note: JWT Required

- Request:
````json
{
  "rate": 7,
  "review": "...",
  ...
}
````

- Response:
````json
{
  "message": "successfully edited",
  ...
}
````

- Status Code: 200(Ok)

### 18) Delete Review API

- URL: DELETE /movies/{movie_id}/reviews/{review_id}

    Note: JWT Required

- Request: Not Required

- Response:
````json
{
  "message": "successfully deleted",
  ...
}
````

- Status Code: 200(Ok)


### May Failure Status Code for all above APIs
- 404 - if page is not found(API not exist)
- 403 - if user have no permission for do that specific task
- 401 - user if not authorized
- 429 - too many requests at a time


### API response

````json
{
  "success":  true,
  "message": "Created Successfully",
  "data": object,
  "statusCode": 200,
  "errors": []
}
````