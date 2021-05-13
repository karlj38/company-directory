<?php
include "config.php";

if ($name = $_POST["name"] ?? null) {
    $name = escape($name);
    $query = "INSERT INTO location (name) VALUES ('$name')";
    $result = db($query);
    json(201, "ok", "created");
} else {
    json(400, "bad request", "no name");
}
