<div class="row">
        <div class="col-sm-5">
                <h2>{{$country->english}}</h2>
        </div>
        <div class="col-sm-7">
                <h2>{{$country->name}}</h2>
        </div>
</div>


<form method="post" action="{{asset('/home/translate_for_country/')}}">
        <input type="hidden" name="_token" value="{{ csrf_token() }}" />
@foreach($cities as $one)
                <div class="form-group row">
                        <div class="{{($errors->has('address'))?'alert alert-danger':''}}" role="alert">
                                <label for="name" class="col-sm-5 col-form-label">{{$one->name_eng}}</label>
                                <div class="col-sm-7">
                                        <div class="row">
                                                <div class="col-sm-12">
                                                        <input type="text" name="{{$one->id}}" class="form-control" value="{{$one->name_rus}}">
                                                </div>
                                        </div>
                                </div>
                        </div>
                </div>
@endforeach
        <input type="submit" value="{{__('messages.save')}}" class="btn btn-primary btn-block" />
</form>
