<?php

namespace App\Http\Controllers;

use App\Country;
use Illuminate\Http\Request;

class CVController extends Controller
{
    public function getIndex(){
        $countries = Country::orderBy('name')->get();
        return view('CV', compact('countries'));
    }
}
