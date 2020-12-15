<?php

namespace App\Http\Controllers;

use App\Parser\GoogleNewsParse;
use App\Country;
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
        $status = GoogleNews::where('alpha3', $alpha3)->where('putdate', date('Y-m-d'))->first();
        if (empty($status)) {
            $country = Country::where('alpha3', $alpha3)->first();
            $obj = new GoogleNewsParse;
            $obj->getParse($country->english, $country->alpha3);
        } else {

        }
        $por = GoogleNews::where('alpha3', $alpha3)->where('putdate', date('Y-m-d'))->orderBy('id','DESC')->first();
        echo $por->body;
    }
    public function postLinks(){
        if (isset($_POST['country_id'])) {
            $country_id = $_POST['country_id'];
        } else {
            $country_id = '21';
        }
        $pro = Link::where('country_id', $country_id)->get();
        return view('ajax.links', compact('pro'));
    }
}
