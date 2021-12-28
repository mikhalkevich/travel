<?php

namespace App\Parser;

use Symfony\Component\DomCrawler\Crawler;
//use App\ProductUser;
use App\GoogleNews;
use App\Country;
use App\Link;
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

    public function getParse($country_par = null)
    {
        $country = Country::where('alpha3', $country_par->alpha3)->first();
        $link  = Link::where('type', 'google')->where('country_id', $country->id)->first();
            $name_rus = $country_par->name;
            $name_eng = $country_par->english;
        $ff_eng = '/search?q='.str_replace(' ', '+', $name_eng);
        $ff_rus = '/search?q='.str_replace(' ', '+', $name_rus);
        $this->link_google('https://news.google.com', $ff_eng);
        $this->link_google('https://news.google.ru',$ff_rus);
        //$tt = $this->html($this->crawler, 'main');
        //echo $tt;
        //dd($ff, $english);
        //$news = new GoogleNews;
        //$news->name = 'Новости '.date('Y-m-d');
        //$news->body = $tt;
        //$news->alpha3 = $alpha3;
        //$news->putdate = date('Y-m-d');
        //$news->url = $ff;
        //$news->save();
        /*
        $this->crawler->filter('.section-stream-content .blended-wrapper')->each(function (Crawler $node, $i) {
            $name = $this->text($node, ".titletext");
            sleep(1);
        });
        */
    }
    public function link_google($link, $ff = null){
        echo "<h3>".$link.$ff."</h3>";
        $file = file_get_contents($link.$ff);
        $this->crawler = new Crawler($file);
        $this->crawler->filter('main h3')->each(function (Crawler $node, $i) use ($link) {
            $a = $this->text($node, "a");
            $href = $this->attr($node, "a","href");
            $img = $this->html($node, "img");
            echo $img;
            echo "<a href='".$link.$href."' target='_blank'>";
            echo $a;
            echo "</a>";
            echo '<hr />';
        });
    }
}
