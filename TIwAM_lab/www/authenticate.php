<?php
$db = new PDO('sqlite:imiona.db');

$user = substr(strip_tags($_POST['user']), 0, 32);
$pass = substr(strip_tags($_POST['pass']), 0, 64);

$debug = [];


// $sql = "SELECT * FROM users WHERE login=admin1 AND password=admin1";
$sql = "SELECT * FROM users WHERE login=:user AND password=:pass";

$stmt = $db->prepare($sql); 


$stmt->bindParam(':user', $user, PDO::PARAM_STR, 32); 
$stmt->bindParam(':pass', $pass, PDO::PARAM_STR, 64);


$stmt->execute(array($sql));

$res = $db->prepare('SELECT * FROM users WHERE login="admin2" AND password="admin2"');
$res->execute();



$debug['executed'] = $stmt;


$arr = $res->fetchAll(PDO::FETCH_ASSOC);
// $arr = $stmt->fetchAll(PDO::FETCH_ASSOC);

// $debug['query_result'] = $data;
$debug['query_result'] = $arr;

$response = [];
if ($arr) {
    $response['authenticated'] = true;
} else {
    $response['authenticated'] = false;
}

$response['debug'] = $debug;
header('Content-Type: application/json');
echo json_encode($response);


// if ($arr) {
//     echo json_encode(['authenticated' => true]);
// } else {
//     echo json_encode(['authenticated' => false]);
// }

// $data = json_decode(file_get_contents("php://input"));

// $username = $data->username ?? '';
// $password = $data->password ?? '';

// $sql = "SELECT * FROM users WHERE login = :username AND password = :password";
// $res = $db->prepare($sql);
// $res->bindValue(':username', $username);
// $res->bindValue(':password', $password);
// $res->execute();

// $user = $res->fetch(PDO::FETCH_ASSOC);

// if ($user) {
//     echo json_encode(['authenticated' => true]);
// } else {
//     echo json_encode(['authenticated' => false]);
// }



