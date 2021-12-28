
<div class="col-md-12 bodycon">
    <div class="main_page">
        <!-- Nav tabs -->
        <ul class="nav nav-tabs nav-mama" role="tablist">
            <li role="presentation" class="active"><a href="#home" aria-controls="home" role="tab"
                                                      data-toggle="tab">{{__('messages.info')}}</a></li>
            <li role="presentation"><a href="#news" id="link_news" data-alpha3="{{$obj->alpha3}}" aria-controls="profile" role="tab"
                                       data-toggle="tab">{{__('messages.news')}}</a></li>
            <li role="presentation"><a href="#cities" aria-controls="calculate" role="tab"
                                       data-toggle="tab">{{__('messages.cities')}}</a></li>
            <li role="presentation"><a href="#links" id="link_links" aria-controls="messages" data-country="{{$obj->id}}" role="tab"
                                       data-toggle="tab">{{__('messages.links')}}</a></li>
            <li role="presentation"><a href="#vacancy" id="link_vacancy" aria-controls="vacancy" data-country="{{$obj->id}}" role="tab"
                                       data-toggle="tab">{{__('messages.events')}}</a></li>
            <li role="presentation"><a href="#resume" id="link_resume" aria-controls="vacancy" data-country="{{$obj->id}}" role="tab"
                                       data-toggle="tab">{{__('messages.conferences')}}</a></li>
            <li role="presentation"><a href="#services" id="link_services" aria-controls="vacancy" data-country="{{$obj->id}}" role="tab"
                                       data-toggle="tab">{{__('messages.services')}}</a></li>
        </ul>
        <!-- Tab panes -->
        <div class="tab-content">
            <div role="tabpanel" class="tab-pane active" id="home">
                <div class="alert" id="continent_code">

                    <table class="table table-bordered table-hover">
                        <tr>
                            <td>{{__('messages.continent')}}</td>
                            <td>{{__('messages.country')}}</td>
                            <td>Alpha2</td>
                            <td>Alpha3</td>
                            <td>ISO</td>
                        </tr>
                        <tr>
                            <td>
                                <a href="{{asset('continent/'.$obj->location)}}">
                                    {{$obj->location}}
                                </a>
                            </td>
                            <td>
                                <a href="{{asset('country/'.$obj->country_name)}}">
                                    {{$obj->name}} / {{$name}} <br />
                                    {{$obj->fullname}} / {{$obj->english}}
                                </a>
                            </td>
                            <td>{{$obj->alpha2}}</td>
                            <td>{{$obj->alpha3}}</td>
                            <td>{{$obj->iso}}</td>
                        </tr>
                    </table>
                    <br/>


                    <table cellspacing="0" id="maket" cellpadding="0" border="0">
                        <tr>
                            <td>
                                <h1 id="name">
                                    {{$obj->name}}
                                </h1>
                                <div align="center">
                                    <img src="{{asset('/img/flags-normal/'.strtolower($obj->alpha2).'.png')}}"/>
                                    <p><br></p>
                                </div>
                            </td>
                            <td id="spacer"></td>

                        </tr>
                    </table>
                    {!! $obj->map_iframe  !!}
                    <div align="right">
                        <a href="https://google.{{$obj->alpha3}}" target="_blank">
                            Google.{{$obj->alpha3}}
                        </a>
                        <a href="https://www.google.com/maps/place/{{$obj->name}}" target="_blank">
                           Google map
                        </a>
                    </div>
                </div>
            </div>
            <div role="tabpanel" class="tab-pane" id="cities">

                <ul>
                    @if(isset($states))
                        @foreach($states as $one)
                            <li>
                                <a href="{{asset('city/'.$one)}}">
                                    {{$one}}
                                </a>
                            </li>
                        @endforeach
                    @endif
                </ul>

                <br style="clear: both;">
                <div class="text">
                </div>
            </div>
            <div role="tabpanel" class="tab-pane" id="vacancy">
                V

                <br style="clear: both;">
                <div class="text">
                </div>
            </div>
            <div role="tabpanel" class="tab-pane" id="resume">
                R

                <br style="clear: both;">
                <div class="text">
                </div>
            </div>
            <div role="tabpanel" class="tab-pane" id="services">
                S

                <br style="clear: both;">
                <div class="text">
                </div>
            </div>

            <div role="tabpanel" class="tab-pane" id="news">
                News
                <div class="empty"></div>
            </div>
            <div role="tabpanel" class="tab-pane" id="links">
                Links
                <div class="empty_links"></div>
            </div>
        </div>
    </div>

</div>
