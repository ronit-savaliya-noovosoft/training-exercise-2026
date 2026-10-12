## Basic APIs 

### 1) Login API

- URL: POST /api/auth/login
- Role: Manager, Customer

- Request:
````json
{
  "email": "ronit.savaliya@gmail.com",
  "password": "******"
}
````

- Response:
````
Set-Cookies: access_token=<JWT>
Content-type: application/json
````
````json
{
  "message": "Successfully logged in",
  "id": "USR101"
}
````

### 2) Sign Up (Add User)

- URL: POST /api/auth/signup
- Role: Customer
- Request: 
````json
{
  "name": "Someone",
  "email": "someone@gmail.com",
  "password": "something",
  "role": "customer",
  "balance": 10000
}
````

- Response:
````json
{
  "message": "Customer add successfully",
  "id": "CS101"
}
````

### 3) Get logged-in user

- URL: GET /api/auth/me
- Request: Not Required
- Response:

````json
{
  "id": "USR101",
  "name": "Someone",
  "email": "someone@gmail.com",
  "role": "customer",
  "account": {
    "id": "ACT101",
    "balance": 100000
  }
}
````

### 4) Get Customer List

- URL: GET /api/users/customers
- Role: Manager, Customer
- Request: Not Required
- Response:

````json
{
  "data": [
    {
      "id": "USR101",
      "name": "Someone",
      "account_id": "ACT101",
      "balance": 100000
    },
    ...
  ]
}
````


### 5) List out the Transactions

- URL: GET /api/transactions?page=1&limit=10
- Role: Manager, Customer

- Request: Not Required

- Response:
````json
{
  "data": [
    {
      "id": "TR101",
      "type": "Deposit",
      "from": null,
      "to": "Person",
      "amonut": 1000
    },
    ...
  ]
}
````


### 6) Deposit Amount

- URL: POST /api/transactions/deposit 
- Role: Manager, Customer
    
    Note: JWT Required

- Request:
````json    
{
  "to": "Person",
  "amount": 1000,
}
````

- Response:
````json
{
  "message": "Successfully deposit",
  "current_balance": 2000
}
````
- Status Code: 200(Ok)

### 7) Withdraw Amount

- URL: POST /api/transactions/withdrawal
- Role: Manager, Customer

    Note: JWT Required

- Request:
````json
{
  "from": "Person",
  "amount": 500
}
````

- Response:
````json
{
  "message": "Successfully withdraw",
  "current_balance": 2000
}
````
- Status Code: 200(Ok)

### 8) Transfer Amount

- URL: POST /api/transactions/transfer
- Role: Manager, Customer
    
    Note: JWT Required

- Request:
````json
{
  "from": "Person1",
  "to": "Person2",
  "amount": 2000,
}
````

- Response:
````json
{
  "message": "Successfully transfer",
  "current_balance_debit_acc": 2000,
  "current_balance_credit_acc": 5000
}
````
- Status Code: 200(Ok)

### 9) Get transaction history in email

- URL: GET /api/transactions/mail
- Role: Customer

- Request: 
````json
{
  "cust_id": "CST101",
  "type": "deposit",
  "status": "all"
}
````

- Response:
````json
{
  "data": [
    {
      "id": "TR101",
      "type": "Deposit",
      "from": null,
      "to": "Person",
      "amonut": 1000
    },
    ...
  ]
}
````


### 10) Logged out

- URL: POST /api/auth/logout
- Role: Manager, Customer

- Request: Not Required
- Response:
````json
{
  "message": "Successfully Logged-Out"
}
````

## Common Response DTO

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

### Page Results

````json
{
  "items": [...],
  "total_count": 100,
  "page": 1,
  "limit": 10
}
````



## Basic Database Tables

### 1) Users
- id    [primary key]
- email [unique]
- name
- password
- role (Manager, Customer)

### 2) Accounts
- id    [primary key]
- cust_id (user_id)
- balance      
- created_at

### 3) transactions
- id    [primary key]
- type (Deposit, Withdraw, Transfer)
- from (account_id)
- to   (account_id)
- amount
- status (Success, Failed)
- created_by (user_id)
- created_at