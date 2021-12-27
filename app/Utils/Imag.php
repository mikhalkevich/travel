<?php

namespace App\Utils;

use Image;
use Illuminate\Http\File;
use Auth;
use Storage;

class Imag
{
    public function url($path = null)
    {
        if ($path != null) {

            $filename = time();
            $photo = Image::make($path)
                ->resize(800, null, function ($constraint) { $constraint->aspectRatio(); } )
                ->encode('jpg',80);
            Storage::disk('local')->put('/uploads/'. Auth::user()->id.'/'.$filename, $photo);
            $photo2 = Image::make($path)
                ->resize(200, null, function ($constraint) { $constraint->aspectRatio(); } )
                ->encode('jpg',80);
            Storage::disk('local')->put('/uploads/'. Auth::user()->id.'/s_'.$filename, $photo2);
            return $filename;
        } else {
            return false;
        }
    }
}
