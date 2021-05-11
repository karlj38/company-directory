<?php

$executionStartTime = microtime(true);
$conn = new mysqli($host, $login, $pass, $db);
if ($conn->connect_errno) {
    http_response_code(500);
    $output['status']['code'] = 500;
    $output['status']['name'] = "failure";
    $output['status']['description'] = "database unavailable";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $conn->close();
    echo json_encode($output);
    exit;
}
