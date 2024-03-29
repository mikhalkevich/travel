<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\City;
use App\Country;

class HomeParserController extends Controller
{
    public function getIndex(){
        $countries = Country::orderBy('english')->get();
        return view('home_parser', compact('countries'));
    }
    public function postCountryState(){
        $path = config_path() . '/countries_states.json';
        $json = file_get_contents($path);
        $data = json_decode($json, true);
        $cities = [];
        foreach ($data['countries'] as $i => $v) {
                $states = $v['states'];
                $country = Country::where('alpha3',  $v['alpha3'])->first();
                $cities[$v['alpha3']] = [];
                if($country){
                    foreach($states as $state){
                        $city = City::where('name_eng', $state)->where('country_id', $country->id)->first();
                        if(!$city){
                            $city = new City;
                            $city->name_eng = $state;
                            $city->name_rus = "";
                            $city->country_id = $country->id;
                            $city->save();
                        }
                        $cities[$v['alpha3']][] = $state;
                    }
                }

        }
        return print_r($cities);
    }
    public function postCitiesForm(){
        $country_id = $_POST['id'];
        $cities = City::where('country_id', $country_id)->orderBy('name_eng')->get();
        $country = Country::find($country_id);
        return view('ajax.parser_cities_form', compact('cities', 'country'));
    }
    public function translateForCountry(){
        foreach($_POST as $key => $value){
            $city_id = (int)$key;
            $city = City::find($city_id);
            if($city){
                $city->name_rus = $value;
                $city->save();
            }
        }
        return redirect()->back();
    }
}
