<?php

namespace App\Providers;
use View;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        View::composer(['welcome', 'country', 'home', 'home_events', 'home_parser', 'templates.nav'],
                       'App\Providers\ViewComposers\CookieComposer');
        View::composer('includes.home_menu', 'App\Providers\ViewComposers\UrlComposer');
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }
}
