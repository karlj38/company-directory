<?php
include "config.php";

if ($_SERVER["REQUEST_METHOD"] == "DELETE") {
    parse_str(file_get_contents("php://input"), $_DELETE);
    if ($id = $_DELETE["id"] ?? null) {
        $id = escape($id);

        $query = "SELECT COUNT(id) as count FROM personnel WHERE id = '$id'";
        $checkExists = db($query);
        while ($row = $checkExists->fetch_assoc()) {
            if ($row["count"]) {
                $query = "DELETE FROM personnel WHERE id = '$id'";

                // echo $query;
                // exit;
                $result = db($query);
                json(200, "ok", "deleted");
            } else {
                json(400, "bad request", "id not found");
            }
        }
    } else {
        json(400, "bad request", "no id");
    }
} else {
    json(400, "bad rqeuest", "invalid http method");
}
