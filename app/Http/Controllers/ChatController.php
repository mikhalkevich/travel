<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function getIndex($id = null){

        return view('chat', compact('id'));
    }
}
