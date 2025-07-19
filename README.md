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

### Step 1: Create Laravel Project

1. The Laravel project is located inside the `backend/` folder.

If you want to create it from scratch:

composer create-project laravel/laravel backend

2.  Install xampp, setup mysql, put mysql to running on your computer.
    In your Laravel project’s .env, configure:
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=towing_db
    DB_USERNAME=root
    DB_PASSWORD=
    (leave DB_PASSWORD empty)

3. Open phpMyAdmin to create your database(go to http://localhost/phpmyadmin)
    Create your Laravel project database: Click on the Databases tab at the top.Under Create database give Database name: towing_db (or any name you prefer, note it for .env)
    Collation: leave default (utf8mb4_general_ci)
    Click Create. 

4. Go to vs code, make sure you are this path : towing-request-system/backend. Run migration : php artisan migrate(this command will      create tables in your database if they don’t exist yet.) If successful, you will see: go to phpMyAdmin → towing_request_system → Tables to confirm default tables (users, password_reset_tokens, etc.) are created.

5. Go to vs code, make sure you are in this path : towing-request-system/backend. Run: php artisan make:model TowingRequest -m. This will create a file xxxx_xx_xx_xxxxxx_create_towing_requests_table.php. This file will represent our towing_request_system table in Laravel, allowing us to interact with it in code. -m stands for new migration file.

6. In database/migrations/xxxx_xx_xx_create_towing_requests_table.php, define:
    public function up(): void
{
    Schema::create('towing_requests', function (Blueprint $table) {
        $table->id();
        $table->string('customer_name');
        $table->string('location');
        $table->text('note')->nullable();
        $table->timestamps();
    });
}

7. Run migrations: php artisan migrate
    Check that the towing_requests table is created in your towing_db.

8. Since Laravel v12 does not include api.php by default, create it:
    In routes/api.php, paste the following code:
    ```php
    <?php

    use Illuminate\Support\Facades\Route;
    use App\Http\Controllers\TowingRequestController;

    Route::post('/requests', [TowingRequestController::class, 'store']);
    Route::get('/requests', [TowingRequestController::class, 'index']);
    ```

9. php artisan make:provider RouteServiceProvider
    Inside app/Providers/RouteServiceProvider.php, add:
    
    use Illuminate\Support\Facades\Route;
    use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;

    class RouteServiceProvider extends ServiceProvider
    {
        public function boot(): void
        {
            Route::middleware('api')
                ->prefix('api')
                ->group(base_path('routes/api.php'));

            Route::middleware('web')
                ->group(base_path('routes/web.php'));
        }
    }


10. php artisan optimize:clear

11. php artisan make:controller TowingRequestController

12. Inside app/Http/Controllers/TowingRequestController.php:

    <?php

    namespace App\Http\Controllers;

    use App\Models\TowingRequest;
    use Illuminate\Http\Request;

    class TowingRequestController extends Controller
    {
        // POST /api/requests
        public function store(Request $request)
        {
            $validated = $request->validate([
                'customer_name' => 'required|string|max:255',
                'location' => 'required|string|max:255',
                'note' => 'nullable|string',
            ]);

            $requestRecord = TowingRequest::create($validated);

            return response()->json($requestRecord, 201);
        }

        // GET /api/requests
        public function index()
        {
            $requests = TowingRequest::all();
            return response()->json($requests);
        }
    }

13. In app/Models/TowingRequest.php, add:
     
    protected $fillable = [
        'customer_name',
        'location',
        'note',
    ];

14. php artisan serve(server should start running now at http://127.0.0.1:8000)

15. Install Postman to test API.
    Test POST /api/requests
    URL: http://127.0.0.1:8000/api/requests
    Method: POST
    Body → raw → JSON:
    {
        "customer_name": "John Doe",
        "location": "123 Main Street",
        "note": "Flat tire"
    }

16. Click Send
    You should get:
    {
        "id": 1,
        "customer_name": "John Doe",
        "location": "123 Main Street",
        "note": "Flat tire",
        "created_at": "2025-07-18T14:20:00.000000Z",
        "updated_at": "2025-07-18T14:20:00.000000Z"
    }
    
17. Test GET /api/requests
    URL: http://127.0.0.1:8000/api/requests
    Method: GET
    Click Send
    You will receive an array of all towing requests stored in your database.

18. Ensure your Laravel backend (backend/) has CORS enabled to accept requests from http://localhost:3000
    If config/cors.php does not exist(laravel 12.0 version doesnot come with cors.php installed  by default), we will create our own config/cors.php for custom control.
    Under the backend folder, run : touch config/cors.php

    Add:

    <?php

    return [
        'paths' => ['api/*'],
        'allowed_methods' => ['*'],
        'allowed_origins' => ['*'],
        'allowed_headers' => ['*'],
        'exposed_headers' => [],
        'max_age' => 0,
        'supports_credentials' => false,
    ];

19. Clear config cache: php artisan config:clear

20. Check if everything is working properly or not via php artisan serve


## Frontend Web Setup (React)

1. cd path/to/towing-request-system (go to root project folder)
    npx create-react-app web-customer
    cd web-customer
    npm start

2. Your React app will run at: http://localhost:3000

3. Clean up the project a bit:
    Inside web-customer/src/:
        Delete App.test.js, logo.svg for simplicity
        Open App.js and replace it with below code.

4. Inside src/App.js:
    Replace contents with:

    import React, { useState } from 'react';
    import './App.css';

    function App() {
        const [form, setForm] = useState({
            customer_name: '',
            location: '',
            note: '',
        });

        const [successMessage, setSuccessMessage] = useState('');

        const handleChange = (e) => {
            setForm({ ...form, [e.target.name]: e.target.value });
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            try {
            const res = await fetch('http://127.0.0.1:8000/api/requests', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });

            if (res.ok) {
                setSuccessMessage('Request submitted successfully!');
                setForm({
                customer_name: '',
                location: '',
                note: '',
                });
            } else {
                const errorData = await res.json();
                setSuccessMessage(`Error: ${errorData.message || 'Failed to submit'}`);
            }
            } catch (error) {
            setSuccessMessage('Error submitting request.');
            console.error(error);
            }
        };

        return (
            <div className="App">
            <h2>Towing Request Form</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '400px', margin: 'auto' }}>
                <input
                type="text"
                name="customer_name"
                placeholder="Customer Name"
                value={form.customer_name}
                onChange={handleChange}
                required
                style={{ marginBottom: '10px', padding: '8px' }}
                />
                <input
                type="text"
                name="location"
                placeholder="Location"
                value={form.location}
                onChange={handleChange}
                required
                style={{ marginBottom: '10px', padding: '8px' }}
                />
                <textarea
                name="note"
                placeholder="Note (optional)"
                value={form.note}
                onChange={handleChange}
                style={{ marginBottom: '10px', padding: '8px' }}
                />
                <button type="submit" style={{ padding: '10px' }}>Submit Request</button>
            </form>
            {successMessage && <p style={{ color: 'green', marginTop: '20px' }}>{successMessage}</p>}
            </div>
        );
        }

        export default App;

5. Inside src/App.css add the below:

    .App {
        font-family: sans-serif;
        padding: 20px;
        text-align: center;
    }
    input, textarea {
        width: 100%;
        font-size: 16px;
    }
    button {
        background-color: #007BFF;
        color: white;
        border: none;
        cursor: pointer;
    }
    button:hover {
        background-color: #0056b3;
    }


6. Test the Application:
    Ensure your React app (npm start) is running.
    Open http://localhost:3000
    Fill in the form with relevant details.
    Click Submit Request.
    You should see: “Request submitted successfully!”

7. Verify in Postman:
    Method: GET
    URL: http://127.0.0.1:8000/api/requests
    Click Send. You will get a 200 OK response with JSON data containing the details you have filled in the form.

## Mobile App Setup (React Native)

1. From your root project folder:
    npx create-expo-app mobile-driver
    cd mobile-driver
    npm start

    This will:
        Initialize your React Native app using Expo.
        Allow you to scan the QR code with Expo Go on your physical device to test instantly.(Scan the QR code above with Expo Go (Android) or the Camera app (iOS))

2. Go to:
    mobile-driver/app/index.tsx
    Replace it with below code:

    import React, { useEffect, useState } from 'react';
    import { SafeAreaView, FlatList, Text, View, StyleSheet, ActivityIndicator } from 'react-native';

    type TowingRequest = {
    id: number;
    customer_name: string;
    location: string;
    note?: string | null;
    status?: string | null;
    };

    export default function Index() {
    const [requests, setRequests] = useState<TowingRequest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://192.168.1.80:8000/api/requests') // replace with your machine's local IP
        .then((response) => response.json())
        .then((data) => {
            setRequests(data);
            setLoading(false);
        })
        .catch((error) => {
            console.error('Error fetching towing requests:', error);
            setLoading(false);
        });
    }, []);

    const renderItem = ({ item }: { item: TowingRequest }) => (
        <View style={styles.card}>
        <Text style={styles.title}>{item.customer_name}</Text>
        <Text>Location: {item.location}</Text>
        <Text>Note: {item.note || 'N/A'}</Text>
        <Text>Status: {item.status || 'pending'}</Text>
        </View>
    );

    if (loading) {
        return (
        <SafeAreaView style={styles.container}>
            <ActivityIndicator size="large" color="#007BFF" />
        </SafeAreaView>
        );
    }

        return (
            <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Towing Requests</Text>
            <FlatList
                data={requests}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
            </SafeAreaView>
        );
        }

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 40,
        paddingHorizontal: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#f2f2f2',
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    });

3. Replace:
    fetch('http://192.168.1.80:8000/api/requests')
    with your local IP address to connect to your Laravel backend.

4. How to know local IP address? 
    (ipconfig for windows or ifconfig for macbook)

5. Now, run laravel server from your root backend folder.(make sure your laptop and mobile are on the same wifi network)
    Run via : php artisan serve --host=0.0.0.0 --port=8000 (this allows your mobile device to access your Laravel backend over the local network. )

6. Make sure your web browser is also running from root web-customer folder 

7. from your root mobile driver folder, start mobile app.
     Now you can see the towing requests.
