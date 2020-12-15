@extends('layouts.app')
@section('styles')
<link href="{{asset('css/table.css')}}" rel="stylesheet" />
    @parent
@endsection
@section('content')
    <div id="container"></div>
    <div class="container fly">
            <div class="col-md-10 col-md-offset-2">
                <div class="panel panel-default">
                    <div class="panel-heading">{{$city->name}}
                        <a href="/" class="close">&times;</a>
                    </div>

                    <div class="panel-body">
                        {{$city->countries->name}}    
						<!--вывод названия страны-->
                    </div>
                </div>
            </div>
    </div>
@endsection
