<?php
include "config.php";

if (($name = $_POST["name"] ?? null) && ($locID = $_POST["locID"] ?? null)) {
    $name = escape($name);
    $locID = escape($locID);
    $query = "INSERT INTO department (name, locationID) VALUES ('$name', '$locID')";

    // echo $query;
    // exit;
    $result = db($query);
    json(201, "ok", "created");
} else {
    json(400, "bad request", "missing one or more parameters");
}
