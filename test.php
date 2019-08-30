<?php
include_once('simple_html_dom.php');
//include ('ChromePhp.php');
//    phpinfo();.
//$html = new simple_html_dom();
//$html->load('http://futurama.fox-fan.tv/seasons.php?id=701');

for ($j = 1; $j < 2; $j++) {
    for ($i = 701; $i < 733; $i++) {

        $ch = curl_init('http://futurama.fox-fan.tv/series.php?id='.$i);
//        $ch = curl_init('http://futurama.fox-fan.tv/series.php?id=701');

        $headers = array('Content-type: text/html; charset=utf-8');
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

        $result = curl_exec($ch);

        curl_close($ch);

        $html = str_get_html($result);
        $array = $html->find('script');

//        print_r(count($array));
//        for ($j = 25; $j < count($array); $j++) {
//            echo ($array[$j]->innertext);
//            echo '<br> '.$j.' - ';
//        }

        echo $array[29]->innertext;
        echo '<br>link:<br>';
        $pieces = explode('"', $array[29]->innertext);
        echo '<br>';
        echo $pieces[9];
        echo '<br>';
    }
}





?>
