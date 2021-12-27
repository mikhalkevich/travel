@extends('layouts.app')
@push('styles')
    <link href="{{asset('css/home.css')}}" rel="stylesheet"/>
@endpush
@push('scripts')
    <script src="{{asset('js/parser.js')}}"></script>
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
                        <br style="clear:both"/>
                    </div>
                    <div class="panel-body">
                        <div class="row">
                            <div class="col-sm-6">
                                <p>
                                    {{__('messages.cities')}}
                                    <a href="#" id="parse_countries_states">
                                         <b>countries_states.json</b>
                                    </a>
                                </p>
                            </div>
                            <div class="col-sm-6">
                                <div id="empty_for_parse">---</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
