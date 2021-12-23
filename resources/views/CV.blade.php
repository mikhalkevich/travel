@extends('layouts.app')
@section('content')
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="panel panel-default">
                    <div class="panel-heading">{{__('messages.cv')}}</div>
                    <div class="panel-body">
                        <div id="map">
                            <form method="post" action="{{asset('home/cv')}}">
                                {{ csrf_field() }}
                                <div class="form-group row">
                                    <div class="{{($errors->has('country_id'))?'alert alert-danger':''}}" role="alert">
                                    <label for="staticEmail" class="col-sm-4 col-form-label">Cтраны для рассылки</label>
                                    <div class="col-sm-8">
                                        <select class="form-control" name="country_id">
                                            <option value="">Страна</option>
                                            @foreach($countries as $one)
                                                <option value="{{$one->id}}">{{$one->name}}</option>
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
                                    <label for="staticEmail" class="col-sm-4 col-form-label">Каталог</label>
                                    <div class="col-sm-8">
                                        <select class="form-control" name="type">
                                            <option value="official">Программирование</option>
                                            <option value="official">Купля/продажа</option>
                                            <option value="official">Строительство и архитектура</option>
                                            <option value="official">Образование</option>
                                            <option value="official"></option>
                                            <option value="official">Транспорт и логистика</option>
                                        </select>
                                            @if($errors->has('type'))
                                               {{$errors->first('type')}}
                                            @endif
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <div class="{{($errors->has('name'))?'alert alert-danger':''}}" role="alert">
                                        <label for="name" class="col-sm-4 col-form-label">Фамилия Имя Отчество</label>
                                        <div class="col-sm-8">
                                            <input type="text" class="form-control" name="name" id="name">
                                        </div>
                                        @if($errors->has('name'))
                                            {{$errors->first('name')}}
                                        @endif
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <div class="{{($errors->has('contacts'))?'alert alert-danger':''}}" role="alert">
                                    <label for="contacts" class="col-sm-4 col-form-label">Контактные данные</label>
                                    <div class="col-sm-8">
                                        <textarea name="contacts" class="form-control" id="contacts" cols="30" rows="10"></textarea>
                                    </div>
                                        @if($errors->has('contacts'))
                                            {{$errors->first('contacts')}}
                                        @endif
                                    </div>
                                </div>

                                <div class="form-group row">
                                    <div class="{{($errors->has('school'))?'alert alert-danger':''}}" role="alert">
                                        <label for="school" class="col-sm-4 col-form-label">Образование</label>
                                        <div class="col-sm-8">
                                            <textarea name="school" id="school" class="form-control" cols="30" rows="10"></textarea>
                                        </div>
                                        @if($errors->has('school'))
                                            {{$errors->first('school')}}
                                        @endif
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <div class="{{($errors->has('school'))?'alert alert-danger':''}}" role="alert">
                                        <label for="info" class="col-sm-4 col-form-label">Дополнительная информация</label>
                                        <div class="col-sm-8">
                                            <textarea name="info" id="info" class="form-control" cols="30" rows="10"></textarea>
                                        </div>
                                        @if($errors->has('info'))
                                            {{$errors->first('info')}}
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

                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
