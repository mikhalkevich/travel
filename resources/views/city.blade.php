@extends('layouts.app')
@push('styles')
<link href="{{asset('css/table.css')}}" rel="stylesheet" />
@endpush
@section('content')
    <div id="container"></div>
    <div class="container fly">
            <div class="col-md-10 col-md-offset-2">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <a href="#">{{$city->country->name}} {{$city->country->english}}</a>
                    </div>

                    <div class="panel-body">
                        <h2>{{$city->name_rus}} {{$city->name_eng}}</h2>
						<!--вывод названия страны-->
                    </div>
                </div>
            </div>
    </div>
@endsection
