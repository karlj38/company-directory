<?php
include "config.php";

if ($_SERVER["REQUEST_METHOD"] == "DELETE") {
    parse_str(file_get_contents("php://input"), $_DELETE);
    if ($table = $_DELETE["table"] ?? null) {
        if ($table == "department" || $table == "location" || $table == "personnel") {
            if ($id = $_DELETE["id"] ?? null) {
                $id = escape($id);
                $table = escape($table);

                $query = "DELETE FROM $table WHERE id = '$id'";

                // echo $query;
                // exit;
                $result = db($query);
                json(200, "ok", "deleted");
            } else {
                json(400, "bad request", "no id");
            }
        } else {
            json(400, "bad request", "invalid table");
        }
    } else {
        json(400, "bad request", "no table");
    }
} else {
    json(400, "bad request", "invalid http method");
}
