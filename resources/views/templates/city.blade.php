<table class="table table-bordered my_block">
    <tr>
        <th> City</th>
        <th> City subdivision</th>
        <th> Time zone</th>
        <th> ISO
        </th>
    </tr>
    @foreach($cities as $one)
        <tr>
            <td>
                <a href="{{asset('city/'.$one->city_name)}}">
                    {{$one->city_name}}
                </a>
            </td>
            <td>{{$one->subdivision_1_name}}</td>
            <td>{{$one->time_zone}}</td>
            <td>
                <a href="{{asset($one->country_iso_code)}}">{{$one->country_iso_code}}</a> / {{$one->subdivision_1_iso_code}}
            </td>
        </tr>
    @endforeach
</table>