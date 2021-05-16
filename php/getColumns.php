<?php
include "config.php";

if ($table = $_GET["table"] ?? null) {
    if ($table == "department" || $table == "location" || $table == "personnel") {
        $query = "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='$db' AND TABLE_NAME='$table'";
        $result = db($query);
        $data = [];
        while ($row = $result->fetch_assoc()) {
            array_push($data, $row);
        }
        json(200, "ok", "success", $data);
    } else {
        json(400, "bad request", "invalid table");
    }
} else {
    json(400, "bad request", "no table");
}
