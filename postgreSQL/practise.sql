-- Using table aliases in join clauses
SELECT
    c.customer_id,
    c.first_name,
    p.amount,
    p.payment_date
FROM
    customer c
        INNER JOIN payment p ON p.customer_id = c.customer_id
ORDER BY
    p.payment_date DESC;

-- Simple
SELECT f.title
FROM film AS f
ORDER BY f.title
    LIMIT 5;

-- Using table aliases in self-join
SELECT
    f1.title,
    f2.title,
    f1.length
FROM
    film f1
        INNER JOIN film f2
                   ON f1.film_id <> f2.film_id AND
                      f1.length = f2.length;


-- Basic PostgreSQL subquery example
SELECT
    city
FROM
    city
WHERE
    country_id = (
        SELECT
            country_id
        FROM
            country
        WHERE
            country = 'United States'
    )
ORDER BY
    city;

-- Using a subquery with the IN operator
SELECT
    film_id,
    title
FROM
    film
WHERE
    film_id IN (
        SELECT
            film_id
        FROM
            film_category
                INNER JOIN category USING(category_id)
        WHERE
            name = 'Action'
    )
ORDER BY
    film_id;


-- find customers who have paid at least one rental with an amount greater than 11
SELECT
    first_name,
    last_name
FROM
    customer c
WHERE
    EXISTS (
        SELECT
            1
        FROM
            payment p
        WHERE
            p.customer_id = c.customer_id
          AND amount > 11
    )
ORDER BY
    first_name,
    last_name;

-- Any
SELECT
    *
FROM
    employees
WHERE
    salary = ANY (
        SELECT
            salary
        FROM
            managers
    );

-- All
SELECT
    *
FROM
    employees
WHERE
    salary > ALL(
        select
            salary
        from
            managers
    );

-- find the films with higher lengths than average for their respective ratings
SELECT film_id, title, length, rating
FROM film f
WHERE length > (
    SELECT AVG(length)
    FROM film
    WHERE rating = f.rating
);

-- Date & String!
SELECT NOW();
SELECT CURRENT_DATE;

SELECT TO_CHAR(CURRENT_DATE, 'Mon dd, yyyy');


SELECT now()- '2005/10/05';
SELECT age('2005/10/05'::date);

SELECT EXTRACT(YEAR FROM '2005/10/05'::date);

SELECT FORMAT('Hello %s','PostgreSQL');

SELECT RIGHT('RONIT SAVALIYA',5);

SELECT LPAD('123', 6, '102');

SELECT LTRIM('Ronronitironit', 'Rronit');

SELECT MD5('00123');

SELECT position('n' in 'ROnit');

SELECT REPEAT('A', 7);

SELECT
    FORMAT('%1$s apple, %2$s orange, %1$s banana', 'small', 'big');

-- ADD DATA (Temporary tables for practise)
CREATE TABLE employees (
                           id SERIAL PRIMARY KEY,
                           first_name VARCHAR(255) NOT NULL,
                           last_name VARCHAR(255) NOT NULL,
                           salary DECIMAL(10, 2) NOT NULL
);

CREATE TABLE managers(
                         id SERIAL PRIMARY KEY,
                         first_name VARCHAR(255) NOT NULL,
                         last_name VARCHAR(255) NOT NULL,
                         salary DECIMAL(10, 2) NOT NULL
);

INSERT INTO employees (first_name, last_name, salary)
VALUES
    ('Bob', 'Williams', 45000.00),
    ('Charlie', 'Davis', 55000.00),
    ('David', 'Jones', 50000.00),
    ('Emma', 'Brown', 48000.00),
    ('Frank', 'Miller', 52000.00),
    ('Grace', 'Wilson', 49000.00),
    ('Harry', 'Taylor', 53000.00),
    ('Ivy', 'Moore', 47000.00),
    ('Jack', 'Anderson', 56000.00),
    ('Kate', 'Hill',  44000.00),
    ('Liam', 'Clark', 59000.00),
    ('Mia', 'Parker', 42000.00);

INSERT INTO managers(first_name, last_name, salary)
VALUES
    ('John', 'Doe',  60000.00),
    ('Jane', 'Smith', 55000.00),
    ('Alice', 'Johnson',  58000.00);

SELECT * from managers;

UPDATE managers
SET salary = 62000
WHERE first_name = 'John';

INSERT INTO managers (id, first_name, last_name, salary)
VALUES (1, 'John', 'Doe', 60000)
    ON CONFLICT(id)
    DO UPDATE SET
    last_name = EXCLUDED.last_name,
               salary = EXCLUDED.salary;

-- REGEX
SELECT 'PostgreSQL' ~ 'greS';
SELECT 'PostgreSQL' ~* 'gres';
SELECT 'PostgreSQL' !~ 'mysql';
SELECT 'PostgreSQL' !~* 'MYSQL';