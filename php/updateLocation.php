<?php
include "config.php";

if ($_SERVER["REQUEST_METHOD"] == "PUT") {
    parse_str(file_get_contents("php://input"), $_PUT);
    if (($id = $_PUT["id"] ?? null) && ($name = $_PUT["name"] ?? null)) {
        $name = escape($name);
        $id = escape($id);
        $query = "SELECT COUNT(id) as count FROM location WHERE id = '$id'";
        $checkExists = db($query);
        while ($row = $checkExists->fetch_assoc()) {
            if ($row["count"]) {
                $query = "UPDATE location SET name = '$name' WHERE id = '$id'";

                // echo $query;
                // exit;
                $result = db($query);
                json(200, "ok", "updated");
            } else {
                json(400, "bad request", "id not found");
            }
        }
    } else {
        json(400, "bad request", "missing one or more parameters");
    }
} else {
    json(400, "bad rqeuest", "invalid http method");
}
