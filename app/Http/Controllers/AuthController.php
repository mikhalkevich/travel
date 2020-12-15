<?php

namespace App\Http\Controllers;

use Auth;
use App\Http\Controllers\Controller;

class AuthController extends Controller
{

    public function login()
    {
        $credentials = request(['email', 'password']);
        //$credentials = ['email'=>'mikhalkevich@ya.ru', 'password'=>'11111111'];

        if (! $token = auth('web')->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return $this->respondWithToken($token);
    }

    public function tokenId(){


        if (! $token = auth('api')->tokenById(Auth::user()->id)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return $this->respondWithToken($token);
    }

    public function me()
    {
        //dd(Auth::user());
        return response()->json(auth('web')->user());
    }

    public function token()
    {
        //dd(Auth::user());
        return response()->json(auth('web')->user()->getRememberToken());
    }

    public function logout()
    {
        auth()->logout();
        return response()->json(['user'=>'logout']);
    }


    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60
        ]);
    }
}