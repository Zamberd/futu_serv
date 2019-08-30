<?php
/**
 * Created by PhpStorm.
 * User: vitalii
 * Date: 27.08.19
 * Time: 17:18
 */
include_once('simple_html_dom.php');

header('Access-Control-Allow-Origin: *');
header('Content-type: application/json');
$resultRequest = [
    "status" => "error",
    "data" => [
        "message" => "Неверный id"
    ]
];
    if (isset($_GET['programm_id'])) {
        $id = $_GET['programm_id'];
        echo $id;

        $ch = curl_init('http://futurama.fox-fan.tv/series.php?id='.$id);

        $headers = array('Content-type: text/html; charset=utf-8');
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        $result = curl_exec($ch);
        curl_close($ch);
        $html = str_get_html($result);
        $array = $html->find('script');


        if (isset($array[29])) {
            $pieces = explode('"', $array[29]->innertext);
            if (isset($pieces[9])) {
                $resultRequest = [
                    "status" => "ok",
                    "data" => [
                        "media_url" => $pieces[9]
                    ]
                ];
            }
        }

//        echo $pieces[9];


//        echo json_encode( $resultRequest );
    }
//    else {
//        $result = [
//            "status" => "error",
//            "data" => [
//                "message" => "Неверный id"
//            ]
//        ];
//        echo json_encode( $resultRequest );
//    }

    echo json_encode( $resultRequest );
?>