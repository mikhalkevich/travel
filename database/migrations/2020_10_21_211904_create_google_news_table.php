<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateGoogleNewsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('google_news', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->text('body')->nullable();
            $table->string('country')->nullable();
            $table->string('alpha3')->nullable();
            $table->string('url')->nullable();
            $table->string('picture')->nullable();
            $table->string('putdate')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('google_news');
    }
}
