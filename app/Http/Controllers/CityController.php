<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\City;


class CityController extends Controller
{
    public function getIndex($url = null){
        //$obj = CountryEn::where('country_iso_code', $url)->first();
        $city = City::where('name_eng', $url)->first();
        //dd($cities);
        return view('city',compact('city'));
    }
}
