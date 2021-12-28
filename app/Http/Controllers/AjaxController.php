<?php

namespace App\Http\Controllers;

use App\Parser\GoogleNewsParse;
use App\Country;
use App\City;
use App\NewsStatus;
use App\GoogleNews;
use App\Link;

class AjaxController extends Controller
{
    public function getNews()
    {
        if (isset($_POST['alpha3'])) {
            $alpha3 = $_POST['alpha3'];
        } else {
            $alpha3 = 'BLR';
        }
        $country = Country::where('alpha3', $alpha3)->first();
        $obj     = new GoogleNewsParse;
        $obj->getParse($country);

        $por = GoogleNews::where('alpha3', $alpha3)->where('putdate', date('Y-m-d'))->orderBy('id', 'DESC')->first();
    }

    public function postLinks()
    {
        if (isset($_POST['country_id'])) {
            $country_id = $_POST['country_id'];
        } else {
            $country_id = '21';
        }
        $pro = Link::where('country_id', $country_id)->get();

        return view('ajax.links', compact('pro'));
    }

    public function postCountry()
    {
        $id     = $_POST['id'];
        $cities = City::where('country_id', $id)->get();

        return view('ajax.cities', compact('cities'));
    }
}
