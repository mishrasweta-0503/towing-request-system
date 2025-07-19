<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TowingRequest extends Model
{
    //
    protected $fillable = [
        'customer_name',
        'location',
        'note',
    ];

}
