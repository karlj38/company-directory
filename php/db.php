<?php

$executionStartTime = microtime(true);
$conn = new mysqli($host, $login, $pass, $db);
if ($conn->connect_errno) {
    json(500, "failure", "database unavailable");
}
