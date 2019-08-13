<?php
/**
 * Created by PhpStorm.
 * User: vitalii
 * Date: 07.08.19
 * Time: 17:52
 */
/*
$data = [
            "id" => 1,
            "item_id" => 1,
            "program"=> [[
                "id_item" => 0,
                "name" => "Дежурный по Нью-Йорку",
                "parentalControl" => false,
                "programm_id" => 16201300,
                "start" => 1564526100,
                "starts_at_dotted" => "2019-07-30 22:35:00",
                "stop" => 1564527600
            ]],
            "genre" => "Мульт"
];

$result = [
    "status" => "ok",
    "data" => $data
];
header('Access-Control-Allow-Origin: *');
header('Content-type: application/json');
echo json_encode( $result );
*/

///     http://futurama1.000webhostapp.com/getTVChannel.php?item_id=1


require_once 'connection.php';

$link = mysqli_connect($host, $user, $password, $database)
or die("Ошибка " . mysqli_error($link));
if (isset($_POST['item_id'])) {
    $query = "SELECT * FROM programs";
} else {
    $query = "SELECT * FROM programs";
}
$result = mysqli_query($link, $query) or die("Ошибка " . mysqli_error($link));
if($result) {
//    $num_rows = mysqli_fetch_all($result);
    $dataArr = array();
    while($row = mysqli_fetch_array($result)) {
        array_push($dataArr, [
            "id" => $row['id'],
            "channel_id" => $row['channel_id'],
            "item_id" =>  $row['item_id'],
            "title" => $row['title'],
            "description" => $row['description'],
        ]);

//        echo "Номер: ".$row['id']."<br>\n";
//        echo "title: ".$row['title']."<br>\n";
//        echo "logo: ".$row['logo']."<br><hr>\n";
    }
    $result = [
        "status" => "ok",
        "data" => [
            "id" => 1,
            "item_id" => 1,
            "program"=> $dataArr,
            "genre" => "Мульт"
        ]
    ];
    header('Access-Control-Allow-Origin: *');
    header('Content-type: application/json');
    echo json_encode( $result );
}
mysqli_close($link);
?>