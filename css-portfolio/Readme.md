# Audix - Hear every detail

- Run Commands

````
docker compose up --build
````
### frontend

- visit localhost:8080 - Docker sends that traffic to port 80 inside the Nginx container to serve HTML

### backend

- frontend JS sends a request to localhost:5000 - Docker routes it to port 5000 inside the Express container