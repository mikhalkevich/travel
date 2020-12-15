<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\LinkRequest;
use App\Country;
use App\Link;
use Auth;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        //$this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $countries = Country::orderBy('name')->get();
        $links = Link::where('user_id', Auth::user()->id)->with('countries')->paginate(100);
        return view('home', compact('countries', 'links'));
    }
    public function postLink(LinkRequest $r){
        $r['user_id'] = Auth::user()->id;
        Link::create($r->all());
        return redirect()->back();
    }
}
