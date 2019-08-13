<?php
/**
 * Created by PhpStorm.
 * User: vitalii
 * Date: 26.07.19
 * Time: 11:51
 */

    require_once 'connection.php';
$link = mysqli_connect($host, $user, $password, $database)
or die("Ошибка " . mysqli_error($link));

$query = "SELECT * FROM channels";
$result = mysqli_query($link, $query) or die("Ошибка " . mysqli_error($link));
if($result) {
//    $num_rows = mysqli_fetch_all($result);
    $dataArr = array();
    while($row = mysqli_fetch_array($result)) {
        array_push($dataArr, [
            "id" => $row['id'],
            "title" => $row['title'],
            "genres"=> [1],
            "genre" => "Мульт"
        ]);

//        echo "Номер: ".$row['id']."<br>\n";
//        echo "title: ".$row['title']."<br>\n";
//        echo "logo: ".$row['logo']."<br><hr>\n";
    }
    $result = [
        "status" => "ok",
        "data" => [ "channels" => $dataArr]
    ];
    header('Access-Control-Allow-Origin: *');
    header('Content-type: application/json');
    echo json_encode( $result );
}
mysqli_close($link);



/*
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
*/
?>