<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Event;

class BaseController extends Controller
{
    public function getIndex(){
        $events = Event::where('date_start', '>', date('Y-m-d'))->limit(60)->get();
        return view('welcome', compact('events'));
    }
}
