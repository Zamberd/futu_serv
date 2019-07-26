<?php
/**
 * Created by PhpStorm.
 * User: vitalii
 * Date: 26.07.19
 * Time: 11:51
 */

//    require_once 'connection.php';
//$link = mysqli_connect($host, $user, $password, $database)
//or die("Ошибка " . mysqli_error($link));
//
//$query = "SELECT * FROM channels";
//$result = mysqli_query($link, $query) or die("Ошибка " . mysqli_error($link));
//if($result) {
//    $num_rows = mysqli_fetch_all($result);
//    while ($row)
//    print_r($num_rows);
////    header('Content-type: application/json');
////    echo json_encode( $num_rows );
//}
//mysqli_close($link);




    $data = [
        "channels" => [
            [
                "id" => 1,
                "title" => "Футурама",
                "genres"=> [1],
                "genre" => "Мульт"
            ]
        ]
    ];

    $result = [
        "status" => "ok",
        "data" => $data
    ];
    header('Access-Control-Allow-Origin: *');
    header('Content-type: application/json');
    echo json_encode( $result );

?>