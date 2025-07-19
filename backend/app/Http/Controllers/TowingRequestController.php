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
