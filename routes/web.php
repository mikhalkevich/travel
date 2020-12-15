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

Route::get('/', function () {
    return view('welcome');
})->middleware('cookie');

Auth::routes();
 Route::get('auth/login', 'AuthController@login');
 Route::get('auth/logout', 'AuthController@logout');
 Route::get('auth/token', 'AuthController@token');
 Route::get('auth/tokenid', 'AuthController@tokenId');
 Route::get('auth/me', 'AuthController@me');
Route::post('ajax/news', 'AjaxController@getNews');
Route::post('ajax/links', 'AjaxController@postLinks');
Route::post('home/link', 'HomeController@postLink');
Route::get('home', 'HomeController@index')->name('home');
Route::get('cv', 'CVController@getIndex')->name('home');
Route::get('catalog', 'LinkController@getAll');
Route::get('chat/{id?}', 'ChatController@getIndex');

Route::get('{url}', 'CountryController@getIndex')->where('url', '[A-Za-z]{2}');
Route::get('city/{url}', 'CityController@getIndex');
Route::get('{url}/{name}', 'CountryController@getName')->where('url', '[A-Za-z]{3}')->middleware('cookie');
