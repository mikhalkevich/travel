@extends('layouts.app')
@push('styles')
    <link rel="stylesheet" href="{{asset('css/fullcalendar.min.css')}}"/>
    <link rel="stylesheet" href="{{asset('css/scheduler.min.css')}}"/>
    <link href="{{ asset('css/calendar.css')}}" rel="stylesheet">
    <link href="{{ asset('css/countries.css')}}" rel="stylesheet">
@endpush
@push('scripts')
    <script src="{{asset('js/moment.min.js')}}"></script>
    <script src="{{asset('js/fullcalendar.min.js')}}"></script>
    <script src="{{asset('js/scheduler.min.js')}}"></script>
    {!! $calendar->script() !!}
@endpush
@section('content')
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                {!! $calendar->calendar() !!}
            </div>
        </div>
    </div>
@endsection
