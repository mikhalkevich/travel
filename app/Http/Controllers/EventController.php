<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Calendar;
use DateTime;
use DateInterval;
use App\Event;

class EventController extends Controller
{
    public function getIndex()
    {
        $data = Event::all();
        if($data->count()){
            foreach ($data as $key => $value) {
                $events[] = Calendar::event(
                    $value->name,
                    true,
                    new DateTime($value->date_start),
                    new DateTime($value->date_start.' +'.$value->days.' day'),
                    $value->id,
                    [
                        'url' => '/event/'.$value->id,
                        //'color' => 'orange'
                        'className' => 'event '.$value->country->alpha3
                    ]
                );
            }
        }
        $calendar = Calendar::addEvents($events);

        return view('events', compact('calendar'));
    }

    public function getOne(Event $event){
        return view('event', compact('event'));
    }

}
