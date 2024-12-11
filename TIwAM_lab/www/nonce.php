<?php

session_start();

$nonce = sha1(uniqid());

$_SESSION['nonce'] = $nonce;

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$json = json_encode(array('nonce'=>$nonce));

print($json);