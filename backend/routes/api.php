<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TowingRequestController;

Route::post('/requests', [TowingRequestController::class, 'store']);
Route::get('/requests', [TowingRequestController::class, 'index']);
