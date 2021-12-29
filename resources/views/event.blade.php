@extends('layouts.app')


@section('content')
    <div id="container"></div>
    <div class="container fly">
            <div class="col-md-10 col-md-offset-2">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <a href="/">{{($lang == 'Rus')?$event->country->name:$event->country->english}}</a>
                    </div>

                    <div class="panel-body">
                        <h2>{{$event->name}}</h2>
                        <p align="center">
                            @if($event->picture)
                                <img src="{{url('/storage/uploads/'.$event->user_id.'/'.$event->picture)}}" />
                            @endif
                        </p>
                        <hr />
                        <div class="row">
                            <div class="col-md-6">
                                <p><b>{{$event->address}}</b></p>
                                <p><a href="{{$event->link}}" target="_blank">{{$event->link}}</a></p>
                            </div>
                            <div class="col-md-6">
                                <p>{{__('messages.date_start')}}: <b>{{$event->date_start}}</b></p>
                                <p>{{__('messages.days')}}: <b>{{$event->days}}</b></p>
                            </div>
                        </div>
                        <hr />
                        <div class="about">
                            {!! $event->description !!}
                        </div>
                    </div>
                </div>
            </div>
    </div>
@endsection
