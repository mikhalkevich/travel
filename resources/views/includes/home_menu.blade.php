<li>
   @if($world == 'home')
        <div class="home_world">
        {{__('messages.links')}}
        </div>
   @else
    <a href="{{asset('/home')}}" class="link">
        {{__('messages.links')}}
    </a>
    @endif
</li>
<li>
    @if($world == 'events')
        <div class="home_world">
        {{__('messages.events')}}
        </div>
    @else
    <a href="{{asset('/home/events')}}" class="link">
        {{__('messages.events')}}
    </a>
    @endif
</li>
<li>
    @if($world == 'info')
        <div class="home_world">
        {{__('messages.info')}}
        </div>
    @else
    <a href="{{asset('/home/info')}}" class="link">
        {{__('messages.info')}}
    </a>
    @endif
</li>
<li>
    @if($world == 'parsers')
        <div class="home_world">
        {{__('messages.parser')}}
        </div>
    @else
    <a href="{{asset('/home/parsers')}}" class="link">
        {{__('messages.parser')}}
    </a>
    @endif
</li>
