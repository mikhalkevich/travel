@extends('layouts.app')
@push('styles')
<link href="{{asset('public/css/table.css')}}" rel="stylesheet" />
<link href="{{asset('css/table.css')}}" rel="stylesheet" />
@endpush
@push('scripts')
    <script src="{{asset('plugins/datamaps/d3.min.js')}}"></script>
    <script src="{{asset('plugins/datamaps/topojson.min.js')}}"></script>
    <script src="{{asset('plugins/datamaps/dist/datamaps.world.min.js')}}"></script>
    <script src="{{asset('js/country.js')}}"></script>
    <script>
        var map = new Datamap({
            element: document.getElementById('container'),
        });
        map.updateChoropleth({us: 'green'}, {reset: true})
    </script>
@endpush

@section('content')
    <div id="container"></div>
    <div class="container fly">
            <div class="col-md-10 col-md-offset-2">
                <div class="panel panel-default">
                    <div class="panel-heading">{{($lang == 'Rus')?$obj->name:$obj->english}}
                        <a href="/" class="close">&times;</a>
                    </div>

                    <div class="panel-body">
                            @include('templates.country')
                    </div>
                </div>
            </div>
    </div>
@endsection
