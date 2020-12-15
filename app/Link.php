<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Link extends Model
{
    public $fillable = ['ico', 'type', 'user_id', 'name', 'url', 'country_id'];

    public function countries(){
        return $this->belongsTo('App\Country', 'country_id');
    }
}
