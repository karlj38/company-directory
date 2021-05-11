<?php

function db($query)
{
    global $conn;
    global $executionStartTime;

    $result = $conn->query($query);
    if (!$result) {
        http_response_code(400);
        $output['status']['code'] = 400;
        $output['status']['name'] = "executed";
        $output['status']['description'] = "query failed";
        $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
        $conn->close();
        echo json_encode($output);
        exit;
    }
    return $result;
}
