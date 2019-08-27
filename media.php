<?php
/**
 * Created by PhpStorm.
 * User: vitalii
 * Date: 27.08.19
 * Time: 17:18
 */

    if (isset($_GET['id'])) {
        $id = $_GET['id'];
        echo $id;

    } else {
        $result = [
            "status" => "error",
            "data" => [
                "message" => "Неверный id"
            ]
        ];
        header('Access-Control-Allow-Origin: *');
        header('Content-type: application/json');
        echo json_encode( $result );
    }
?>