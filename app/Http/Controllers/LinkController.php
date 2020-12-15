<?php

namespace App\Http\Controllers;
use App\Link;

class LinkController extends Controller
{
    public function getAll(){
        $links = Link::orderBy('id', 'DESC')->paginate(100);
        return view('links', compact('links'));
    }
}
