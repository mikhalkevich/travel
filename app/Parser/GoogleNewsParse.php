<?php

namespace App\Parser;

use Symfony\Component\DomCrawler\Crawler;
//use App\ProductUser;
use App\GoogleNews;
use Auth;

class GoogleNewsParse implements ParseContract
{
    use ParseTrait;
    public $crawler;

    public function __construct()
    {
        set_time_limit(0);
        header('Content-Type: text/html; charset=utf-8');
    }

    public function getParse($english = null, $alpha3 = null)
    {
        $ff = 'https://news.google.ru/search?q='.str_replace(' ', '+', $english);
        $file = file_get_contents("$ff");
        $this->crawler = new Crawler($file);
        $tt = $this->html($this->crawler, 'main');
        //echo $tt;
        //dd($ff, $english);
        $news = new GoogleNews;
        $news->name = 'Новости '.date('Y-m-d');
        $news->body = $tt;
        $news->alpha3 = $alpha3;
        $news->putdate = date('Y-m-d');
        $news->url = $ff;
        $news->save();
        /*
        $this->crawler->filter('.section-stream-content .blended-wrapper')->each(function (Crawler $node, $i) {
            $name = $this->text($node, ".titletext");
            sleep(1);
        });
        */
    }
}