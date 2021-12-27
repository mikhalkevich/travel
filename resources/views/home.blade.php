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
                            <form method="post" action="{{asset('home/link')}}">
                                {{ csrf_field() }}
                                <div class="form-group row">
                                    <div class="{{($errors->has('country_id'))?'alert alert-danger':''}}" role="alert">
                                    <label for="staticEmail" class="col-sm-2 col-form-label">{{__('messages.country')}}</label>
                                    <div class="col-sm-10">
                                        <select class="form-control" name="country_id">
                                            <option value="">Выберите страну</option>
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
                                    <div class="{{($errors->has('type'))?'alert alert-danger':''}}" role="alert">
                                    <label for="staticEmail" class="col-sm-2 col-form-label">Тип ссылки</label>
                                    <div class="col-sm-10">
                                        <select class="form-control" name="type">
                                            <option value="official">Официальный сайт</option>
                                            <option value="shop">Новостной ресурс</option>
                                            <option value="shop">Купля/продажа</option>
                                            <option value="meeting">Знакомства</option>
                                            <option value="work">Поиск работы</option>
                                            <option value="music">Музыка</option>
                                            <option value="film">Фильмы</option>
                                            <option value="photo">Фото</option>
                                        </select>
                                            @if($errors->has('type'))
                                               {{$errors->first('type')}}
                                            @endif
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <div class="{{($errors->has('url'))?'alert alert-danger':''}}" role="alert">
                                    <label for="url" class="col-sm-2 col-form-label">{{__('messages.link')}}</label>
                                    <div class="col-sm-10">
                                        <input type="text" class="form-control" name="url" id="url">
                                    </div>
                                        @if($errors->has('url'))
                                            {{$errors->first('url')}}
                                        @endif
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <div class="{{($errors->has('name'))?'alert alert-danger':''}}" role="alert">
                                    <label for="name" class="col-sm-2 col-form-label">Наименование</label>
                                    <div class="col-sm-10">
                                        <input type="text" class="form-control" name="name" id="name">
                                    </div>
                                        @if($errors->has('name'))
                                            {{$errors->first('name')}}
                                        @endif
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label for="name" class="col-sm-2 col-form-label">Действия</label>
                                    <div class="col-sm-10">
                                        <input type="submit" class="btn btn-primary btn-block" value="Сохранить">
                                    </div>
                                </div>
                            </form>
                        </div>
                        <table width="100%" class="table table-bordered table-hover table-striped">
                            <tr>
                                <th width="100px">Страна</th>
                                <th>Наименование</th>
                                <th>Ссылка</th>
                                <th>Тип ссылки</th>
                            </tr>
                            @foreach($links as $one)
                                <tr>
                                    <td width="100px"><img src="{{asset('/img/flags-normal/'.strtolower($one->countries->alpha2).'.png')}}" width="100px"/></td>
                                    <td>{{$one->name}}</td>
                                    <td>{{$one->url}}</td>
                                    <td>{{$one->type}}</td>
                                    <td>Удалить</td>
                                </tr>
                            @endforeach
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
