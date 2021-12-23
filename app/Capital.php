<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Capital extends Model
{
    //
	public function countries(){
		return $this->belongsTo('App\Country', geoname_id);
	}
}
