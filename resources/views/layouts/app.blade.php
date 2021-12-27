<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="Cache-Control" content="no-cache">
    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">
@section('meta')
@show
    <title>{{ config('app.name', 'Map of Worlds') }}</title>

    <!-- Styles -->
    <link href="{{ asset('bootstrap/css/bootstrap.min.css') }}" rel="stylesheet">
    <link href="{{ asset('css/main.css') }}" rel="stylesheet">
    @stack('styles')
</head>
<body>
<div class="container">
    @include('templates.nav')
    <div class="col-md-12" id="logofon">
        <div class="cont">
            <div id="container" style="width: 100%"></div>
            <br style="clear:both"/>
        </div>
    </div>
</div>
@yield('content')
<div class="footer">
    <div class="social">
        <a href="#"> <img src="{{asset('img/pic_facebook.png')}}"/></a>
        <a href="#"> <img src="{{asset('img/pic_instogramm.png')}}"/></a>
        <a href="#"> <img src="{{asset('img/pic_pinterest.png')}}"/></a>
    </div>
    &copy; <a href="http://mikhalkevich.colony.by" target="_blank">mikhalkevich</a>
</div>
<!-- Scripts -->
<script src="{{ asset('js/app.js') }}"></script>
<script src="{{ asset('js/lang.js') }}"></script>
@stack('scripts')
</body>
</html>
