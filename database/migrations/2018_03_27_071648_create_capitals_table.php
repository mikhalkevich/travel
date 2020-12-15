<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCapitalsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('capitals', function (Blueprint $table) {
            $table->increments('id');
			$table->integer('geoname_id')->nullable();
			$table->string('name')->nullable();
			$table->string('population')->nullable();
			$table->string('weather_url')->nullable();
			$table->string('date_of_foundation')->nullable();
			$table->string('tel_code')->nullable();
			$table->string('local_time')->nullable();
			$table->text('description')->nullable();
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
        Schema::dropIfExists('capitals');
    }
}
