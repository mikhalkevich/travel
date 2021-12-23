<ul>
@foreach($pro as $one)
        <li>
            <a href="{{$one->url}}" target="_blank">
            {{$one->name}}
            </a> ({{$one->url}})
        </li>
@endforeach
</ul>