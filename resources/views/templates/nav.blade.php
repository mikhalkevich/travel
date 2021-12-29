
<nav class="navbar navbar-inverse nav-my">
    <div class="container-fluid">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle" data-toggle="collapse"
                    data-target="#bs-example-navbar-collapse-8" aria-expanded="true">
                <span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span
                        class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a href="/" class="navbar-brand" id="logo">{{ config('app.name', '&#8853;') }}</a>
        </div>
        <div class="navbar-collapse collapse out" id="bs-example-navbar-collapse-8" aria-expanded="false" style="">
            <ul class="nav navbar-nav mynav">
                <li>
                    <a href="{{asset('/catalog')}}">
                        {{__('messages.catalog')}}
                    </a>
                </li>
                <li>
                    <a href="{{asset('/events')}}">
                        {{__('messages.events')}}
                    </a>
                </li>
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle tt" data-toggle="dropdown" role="button"
                       aria-expanded="false">{{__('messages.auth')}}
                        <span class="caret"></span></a>
                    <ul class="dropdown-menu" role="menu">
                        @if (auth::guest())
                            <li><a href="{{ route('register') }}">{{__('messages.register')}}</a></li>
                            <li><a href="{{ route('login') }}">{{__('messages.login')}}</a></li>
                        @else
                            @include('includes.home_menu')
                            <li>
                                @if(Auth::user()->facebook_id)
                                    <a href="{{asset('/auth/logout')}}" class="link">{{__('messages.logout')}}</a>
                                @else
                                    <a href="{{ route('logout') }}" class="link"
                                       onclick="event.preventDefault();
                                                     document.getElementById('logout-form').submit();">
                                        Logout
                                    </a>
                                    <form id="logout-form" action="{{ route('logout') }}" method="POST"
                                          style="display: none;">
                                        {{ csrf_field() }}
                                    </form>
                                @endif
                            </li>
                        @endif
                    </ul>
                </li>
            </ul>
            <ul class="nav navbar-nav navbar-right">
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">
                        <img id="imgNavSel" src="{{asset('/img/flag/'.$lang_pic)}}" alt="..." class="img-thumbnail icon-small">  
                        <span id="lanNavSel">{{$lang_name}}</span> <span class="caret"></span></a>
                    <ul class="dropdown-menu mumu" role="menu">
                        <li><a id="navIta" href="#" class="language">

                                <img id="imgNavIta" src="{{asset('/img/flag/ita_40.jpg')}}" alt="..." class="img-thumbnail icon-small"> 
                                <span id="lanNavIta">Italiano</span> 
                            </a></li>
                        <li><a id="navDeu" href="#" class="language">

                                <img id="imgNavDeu" src="{{asset('/img/flag/deu_40.jpg')}}" alt="..." class="img-thumbnail icon-small"> 
                                <span id="lanNavDeu">Deutsch</span> 
                            </a></li>
                        <li><a id="navFra" href="#" class="language">

                                <img id="imgNavFra" src="{{asset('/img/flag/fra_40.jpg')}}" alt="..." class="img-thumbnail icon-small"> 
                                <span id="lanNavFra">Francais</span> 
                            </a></li>
                        <li><a id="navEng" href="#" class="language">

                                <img id="imgNavEng" src="{{asset('/img/flag/eng_40.jpg')}}" alt="..." class="img-thumbnail icon-small"> 
                                <span id="lanNavEng">English</span> 
                            </a></li>
                        <li><a id="navRus" href="#" class="language">
                                <img id="imgNavRus" src="{{asset('/img/flag/rus.jpg')}}" alt="..." class="img-thumbnail icon-small"> 
                                <span id="lanNavRus">Russia</span> 
                            </a></li>
                    </ul>
                </li>
            </ul>
            <br style="clear:both"/>

        </div>
    </div>
</nav>
