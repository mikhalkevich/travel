<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\App;

class CountryEn extends Model
{
    protected $table = 'countries_en';

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
        if(isset($_COOKIE['lang'])){
            if ($_COOKIE['lang'] == 'en') {
                $lang = 'en';
            } elseif ($_COOKIE['lang'] == 'de') {
                $lang = 'de';
            } elseif ($_COOKIE['lang'] == 'fr') {
                $lang = 'fr';
            } elseif ($_COOKIE['lang'] == 'ru') {
                $lang = 'ru';
            } else {
                $lang = 'en';
            }
        }else{
            $lang = 'en';
        }
        $this->table = 'countries_' . $lang;
    }
}
