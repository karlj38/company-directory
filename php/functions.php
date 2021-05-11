<?php

function db($query)
{
    global $conn;
    global $executionStartTime;

    $result = $conn->query($query);
    if (!$result) {
        json(400, "executed", "query failed");
    }
    return $result;
}

function escape($str)
{
    global $conn;
    return $conn->real_escape_string(trim($str));
}

function json($code, $name, $desc, $data = null)
{
    global $conn;
    global $executionStartTime;

    http_response_code($code);
    $output['status']['code'] = $code;
    $output['status']['name'] = $name;
    $output['status']['description'] = $desc;
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = $data;

    $conn->close();
    echo json_encode($output);
    exit;
}
