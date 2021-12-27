<?php

use Illuminate\Database\Seeder;
use App\EventType;

class TypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        EventType::create(['name_rus'=>'Научная конференция', 'name_eng' => 'Conference']);
        EventType::create(['name_rus'=>'Спортивное событие', 'name_eng' => 'Sport']);
        EventType::create(['name_rus'=>'Культурное мероприятие', 'name_eng' => 'Action']); //Фильмы, театры, цирк, концерты, выставки
        EventType::create(['name_rus'=>'Массовое мероприятие', 'name_eng' => 'Meeting']); //праздники, свадьбы, похороны, походы
    }
}
