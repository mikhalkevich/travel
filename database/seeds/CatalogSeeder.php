<?php

use Illuminate\Database\Seeder;
use App\Catalog;

class CatalogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Catalog::create(['name_rus'=>'Официальный сайт', 'name_eng' => 'Official site']);
        Catalog::create(['name_rus'=>'Торговая площадка', 'name_eng' => 'Web market']);
        Catalog::create(['name_rus'=>'Информационный ресурс', 'name_eng' => 'Information service']);
        Catalog::create(['name_rus'=>'Новостной ресурс', 'name_eng' => 'News service']);
    }
}
