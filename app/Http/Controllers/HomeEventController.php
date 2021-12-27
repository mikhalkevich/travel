<?php

namespace App\Http\Controllers;

use Auth;
use Storage;
use App\Country;
use App\Event;
use App\EventType;
use Illuminate\Http\Request;
use App\Http\Requests\EventRequest;
class HomeEventController extends Controller
{
    public function getIndex(){
        $countries = Country::orderBy('name')->get();
        $types = EventType::orderBy('name_eng')->get();
        $events = Event::where('user_id', Auth::user()->id)->orderBy('id','DESC')->paginate(10);
        return view('home_events', compact('countries', 'types', 'events'));
    }

    public function postIndex(EventRequest $request){
       $event = new Event;
       $picture = null;
       if($request->hasFile('picture1')){
           $pic = \App::make('\App\Utils\Imag')->url($request->file('picture1'));
           $picture = $pic;
       }
       $event->name = $request->name;
       $event->country_id = $request->country_id;
       $event->user_id = Auth::user()->id;
       $event->type_id = $request->type_id;
       $event->address = $request->address;
       $event->date_start = $request->date_start;
       $event->days = $request->days;
       $event->description = $request->info;
       $event->link = $request->link;
       $event->lang = (isset($_COOKIE['lang']))?$_COOKIE['lang']:'eng';
       $event->picture = $picture;
       $event->save();
       return redirect()->back();
    }
    public function deleteEvent(Event $event){
        Storage::delete('uploads/'.$event->user_id.'/'.$event->picture);
        Storage::delete('uploads/'.$event->user_id.'/s_'.$event->picture);
        $event->delete();
        return redirect()->back();
    }
}
