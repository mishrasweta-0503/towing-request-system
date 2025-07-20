# Towing Request System

This project implements a basic towing request system with a Laravel 12.20.0 +  MySQL backend.

## Features

- **POST /api/requests**: Create a towing request (`customer_name`, `location`, `note`)
- **GET /api/requests**: List all towing requests
- No authentication required

## Setup Instructions

## Backend Setup (Laravel API MYSQL)

- PHP >= 8.1
- Composer
- MySQL server running

1. Install Xampp (operating system specific) for php and mysql. (https://www.apachefriends.org/)
2. After the installation, make sure Apache and MySQL are running.(MySQL runs on port 3306, make sure port 3306 is free)
3. Check whether php is properly installed or not. Run:
    ```bash
    php --version
4. Install composer (a dependency manager for php) (https://getcomposer.org/)
5. Go to visual studio code. Open a new terminal. Through the new terminal, under any folder of your choice in your system, 
    Run:
    ```bash
    git clone https://github.com/mishrasweta-0503/towing-request-system.git
6. This will create a towing-request-system folder with three sub folders(backend, web-customer, mobile-driver) and README.md file.
7. Navigate to `backend/` folder. Run:

    ```bash
    composer install
    cp .env.example .env
    php artisan key:generate

8. In your Laravel project’s .env, configure:
    ```env
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=towing_db
    DB_USERNAME=root
    DB_PASSWORD=
    ```
    (leave DB_PASSWORD empty)


9. Open phpMyAdmin to create your database(go to http://localhost/phpmyadmin)
    Create your Laravel project database: Click on the Databases tab at the top.Under Create database give Database name: towing_db (or any name you prefer, note it for .env)
    Collation: leave default (utf8mb4_general_ci)
    Click Create. 

10. Go to vs code, make sure you are this path : towing-request-system/backend. 
    Run migration : php artisan migrate(this command will create tables in your database if they don’t exist yet.)  
    If successful, you will see: go to phpMyAdmin → towing_request_system → Tables to confirm default tables (users, password_reset_tokens, etc.) are created.

    Then Run :
    ```bash
    php artisan serve 
    (you should ensure your server running at http://127.0.0.1:8000/)


11. Install Postman to test API.
    Test POST /api/requests
    URL: http://127.0.0.1:8000/api/requests
    Method: POST
    Body → raw → JSON:
    ```json
    {
        "customer_name": "John Doe",
        "location": "123 Main Street",
        "note": "Flat tire"
    }
    ```

12. Click Send
    You should get:
    ```json
    {
        "id": 1,
        "customer_name": "John Doe",
        "location": "123 Main Street",
        "note": "Flat tire",
        "created_at": "2025-07-18T14:20:00.000000Z",
        "updated_at": "2025-07-18T14:20:00.000000Z"
    }
    ```
13. Test GET /api/requests
    URL: http://127.0.0.1:8000/api/requests
    Method: GET
    Click Send
    You will receive an array of all towing requests stored in your database.


## Frontend Web Setup (React)

1. Navigate : cd ../web-customer

2. Run:
    npm install
    npm start

3. Test the Application:
    Ensure your React app (npm start) is running, also make sure your laravel backend is also running.
    Open http://localhost:3000
    Fill in the form with relevant details.
    Click Submit Request.
    You should see: “Request submitted successfully!”

4. Verify in Postman:
    Method: GET
    URL: http://127.0.0.1:8000/api/requests
    Click Send. You will get a 200 OK response with JSON data containing the details you have filled in the form.

## Mobile App Setup (React Native)

1. Navigate : cd ../mobile-driver

2. Run:
    ```bash
    npm install
    npm start
    ```

3. Replace:
    fetch('http://192.168.1.80:8000/api/requests')
    with your local IP address to connect to your Laravel backend.
    This should be done in index.tsx

4. How to know local IP address? 
    (ipconfig for windows or ifconfig for macbook)

5. Now, run laravel server from your root backend folder.(make sure your laptop and mobile are on the same wifi network)
    Run via : php artisan serve --host=0.0.0.0 --port=8000 (this allows your mobile device to access your Laravel backend over the local network. )

6. Make sure your web browser is also running from root web-customer folder 

7. from your root mobile driver folder, start mobile app.
     Now you can see the towing requests and the status of the towing requests as well. If you click on "Accept Request", the status
     will change to "Assigned."
