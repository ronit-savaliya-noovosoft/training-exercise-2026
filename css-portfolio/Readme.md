# Audix - Hear every detail

---

- Run Commands

````
docker build -t express-form-api .
````

````
docker run -p 3000:3000 -v "%cd%":/usr/src/app -v /usr/src/app/node_modules express-form-api
````