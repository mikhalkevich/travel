@extends('layouts.app')
@section('content')
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="panel panel-default">
                    <div class="panel-heading">{{__('messages.catalog')}}</div>
                    <div class="panel-body">
                        <table width="100%">
                            <tr>
                                <th>{{__('messages.name')}}</th>
                                <th>{{__('messages.link')}}</th>
                            </tr>
                        @foreach($links as $link)
                            <tr>
                                <td><a href="{{$link->url}}" target="_blank">{{$link->name}}</a></td>
                                <td>{{$link->url}}</td>
                            </tr>
                        @endforeach
                        </table>
                        <p align="center">{!! $links->links() !!}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
