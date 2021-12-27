<?php

namespace App\Providers\ViewComposers;

use Illuminate\Support\Facades\App;
use Illuminate\Contracts\View\View;

class UrlComposer
{

    public function compose(View $view)
    {
        $uri_arr = explode('/', $_SERVER['REQUEST_URI']);

        $view->with('world', end($uri_arr));
    }

}
