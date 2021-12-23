<?php

namespace App\Providers\ViewComposers;

use Illuminate\Support\Facades\App;
use Illuminate\Contracts\View\View;

class CookieComposer
{

    public function compose(View $view)
    {
        if (isset($_GET['lang'])) {
            $str = ltrim($_GET['lang'], 'nav');
            $lang = $str;
        } else {
            if (isset($_COOKIE['lang'])) {
                $lang = $_COOKIE['lang'];
            } else {
                $lang = 'eng';
            }
        }

        switch ($lang) {
            case 'Eng':
               $lang_name = 'England';
               $lang_pic = 'eng_40.jpg';
               $locale = 'en';
                break;
            case 'Fra':
               $lang_name = 'France';
                $lang_pic = 'fra_40.jpg';
                $locale = 'fr';
                break;
            case 'Deu':
                $lang_name = 'Deutschland';
                $lang_pic = 'deu_40.jpg';
                $locale = 'de';
                break;
            case 'Ita':
                $lang_name = 'Italia';
                $lang_pic = 'ita_40.jpg';
                $locale = 'it';
                break;
            case 'Rus':
                $lang_name = 'Russia';
                $lang_pic = 'Rus_40.jpg';
                $locale = 'ru';
                break;
            default:
                $lang_name = 'England';
                $lang_pic = 'eng_40.jpg';
                $locale = 'en';
                break;
        }
        App::setLocale($locale);
        $view->with('lang', $lang)->with('lang_pic', $lang_pic)->with('lang_name', $lang_name);
    }

}
