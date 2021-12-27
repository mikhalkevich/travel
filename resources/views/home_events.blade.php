@extends('layouts.app')
@push('styles')
    <link href="{{asset('css/home.css')}}" rel="stylesheet" />
@endpush
@section('content')
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <ul class="nav navbar-nav mynav">
                            @include('includes.home_menu')
                        </ul>
                        <br style="clear:both" />
                    </div>
                    <div class="panel-body">
                        <div id="map">
                            <form method="post" action="{{asset('home/event')}}">
                                {{ csrf_field() }}
                                <div class="form-group row">
                                    <div class="{{($errors->has('country_id'))?'alert alert-danger':''}}" role="alert">
                                    <label for="staticEmail" class="col-sm-2 col-form-label">{{__('messages.country')}}</label>
                                    <div class="col-sm-10">
                                        <select class="form-control" name="country_id">
                                            <option value="">{{__('messages.country_choose')}}</option>
                                            @foreach($countries as $one)
                                                <option value="{{$one->id}}">{{($lang == 'Rus')?$one->name:$one->english}}</option>
                                            @endforeach
                                        </select>
                                        </div>
                                        @if($errors->has('country_id'))
                                            {{$errors->first('country_id')}}
                                        @endif
                                    </div>
                                </div>

                                <div class="form-group row">
                                    <div class="{{($errors->has('address'))?'alert alert-danger':''}}" role="alert">
                                        <label for="name" class="col-sm-2 col-form-label">{{__('messages.locale')}}</label>
                                        <div class="col-sm-10">
                                            <div class="row">
                                                <div class="col-sm-8">
                                                    <input type="text" name="address" class="form-control" placeholder="{{__('messages.address')}}">
                                                </div>
                                                <div class="col-sm-4">
                                                    <input type="text" name="city_id" class="form-control" placeholder="{{__('messages.city')}}">
                                                </div>
                                            </div>
                                        </div>
                                        @if($errors->has('address'))
                                            {{$errors->first('address')}}
                                        @endif
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <div class="{{($errors->has('type_id'))?'alert alert-danger':''}}" role="alert">
                                    <label for="staticEmail" class="col-sm-2 col-form-label">{{__('messages.event_type')}}</label>
                                    <div class="col-sm-10">
                                        <select class="form-control" name="type_id">
                                            @foreach($types as $one)
                                                <option value="{{$one->id}}">{{($lang == 'Rus')?$one->name_rus:$one->name_eng}}</option>
                                            @endforeach
                                        </select>
                                            @if($errors->has('type_id'))
                                               {{$errors->first('type_id')}}
                                            @endif
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <div class="{{($errors->has('name'))?'alert alert-danger':''}}" role="alert">
                                        <label for="contacts" class="col-sm-2 col-form-label">{{__('messages.event_name')}}</label>
                                        <div class="col-sm-10">
                                            <textarea name="name" class="form-control" id="contacts" cols="30" rows="2"></textarea>
                                        </div>
                                        @if($errors->has('name'))
                                            {{$errors->first('name')}}
                                        @endif
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <div class="{{($errors->has('date_start'))?'alert alert-danger':''}}" role="alert">
                                        <label for="school" class="col-sm-2 col-form-label">{{__('messages.date_start')}} / {{__('messages.days')}}</label>
                                        <div class="col-sm-10">
                                            <div class="row">
                                                <div class="col-sm-8">
                                            <input type="date" name="date_start" class="form-control">
                                                </div>
                                                <div class="col-sm-2">
                                                <input type="number" name="days" min="1" value="1" class="form-control" />
                                                </div>
                                            </div>
                                        </div>
                                        @if($errors->has('date_start'))
                                            {{$errors->first('date_start')}}
                                        @endif
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <div class="{{($errors->has('info'))?'alert alert-danger':''}}" role="alert">
                                        <label for="info" class="col-sm-2 col-form-label">{{__('messages.event_about')}}</label>
                                        <div class="col-sm-10">
                                            <textarea name="info" id="info" class="form-control" cols="30" rows="10"></textarea>
                                        </div>
                                        @if($errors->has('info'))
                                            {{$errors->first('info')}}
                                        @endif
                                    </div>
                                </div>
                                <div class="row">
                                    <div>
                                        <label for="file" class="col-sm-2 col-form-label">{{__('messages.picture')}}</label>
                                        <div class="col-sm-10">
                                            <input type="file" name="picture1" />
                                        </div>
                                    </div>
                                </div>
                                <br style="clear: both" />
                                <div class="form-group row">
                                    <label for="name" class="col-sm-2 col-form-label">{{__('messages.action')}}</label>
                                    <div class="col-sm-10">
                                        <input type="submit" class="btn btn-primary btn-block" value="{{__('messages.save')}}">
                                    </div>
                                </div>
                            </form>
                            <table width="100%" class="table table-striped table-bordered">
                                <tr>
                                    <th width="200px">Picture</th>
                                    <th>Event name</th>
                                    <th>Link</th>
                                    <th>Date start</th>
                                    <th>Days</th>
                                    <th>Action</th>
                                </tr>
                            @foreach($events as $event)
                                    <tr>
                                        <td>--</td>
                                        <td>{{$event->name}}</td>
                                        <td>{{$event->link}}</td>
                                        <td>{{$event->date_start}}</td>
                                        <td>{{$event->days}}</td>
                                        <td>
                                            <a href="{{asset('home/event/'.$event->id.'/delete')}}">Delete</a>
                                        </td>
                                    </tr>
                            @endforeach
                            </table>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
