<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', 'BaseController@getIndex')->middleware('cookie');

Auth::routes();
Route::get('auth/login', 'AuthController@login');
Route::get('auth/logout', 'AuthController@logout');
Route::get('auth/token', 'AuthController@token');
Route::get('auth/tokenid', 'AuthController@tokenId');
Route::get('auth/me', 'AuthController@me');

Route::post('ajax/news', 'AjaxController@getNews');
Route::post('ajax/links', 'AjaxController@postLinks');
Route::post('ajax/country', 'AjaxController@postCountry');
//user
Route::get('home', 'HomeController@index');
Route::get('home/events', 'HomeEventController@getIndex');
Route::get('home/parsers', 'HomeParserController@getIndex');

Route::post('home/event', 'HomeEventController@postIndex');
Route::post('/home/translate_for_country/', 'HomeParserController@translateForCountry');
Route::get('home/event/{event}/delete', 'HomeEventController@deleteEvent');
Route::post('parser/states', 'HomeParserController@postCountryState');
Route::post('parser/cities_form', 'HomeParserController@postCitiesForm');
//all
Route::get('catalog', 'LinkController@getAll');
Route::get('chat/{id?}', 'ChatController@getIndex');
Route::get('{url}', 'CountryController@getIndex')->where('url', '[A-Za-z]{2}');
Route::get('city/{url}', 'CityController@getIndex');
Route::get('{url}/{name}', 'CountryController@getName')->where('url', '[A-Za-z]{3}')->middleware('cookie');
