<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    public function country(){
        return $this->belongsTo(Country::class);
    }
}
