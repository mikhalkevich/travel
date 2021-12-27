<option>
    {{__('messages.city')}}
</option>
@foreach($cities as $one)
        <option value="{{$one->id}}">
            {{$one->name_eng}} {{$one->name_eng}}
        </option>
@endforeach
