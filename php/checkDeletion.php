<?php
include "config.php";

if ($table = $_GET["table"] ?? null) {
    if ($table == "department" || $table == "location") {
        if ($id = $_GET["id"] ?? null) {
            $id = escape($id);

            switch ($table) {
                case 'department':
                    $dependent = "personnel";
                    break;
                case 'location':
                    $dependent = "department";
                    break;
                default:

                    break;
            }

            $query = "SELECT COUNT(id) as count FROM $table WHERE id = '$id'";
            $checkExists = db($query);
            while ($row = $checkExists->fetch_assoc()) {
                if ($row["count"]) {

                    $query = "SELECT COUNT(id) as dependent FROM $dependent WHERE $table" . "ID = '$id'";
                    $canDelete = db($query);
                    while ($row = $canDelete->fetch_assoc()) {

                        if (!$row["dependent"]) {
                            json(200, "ok", "safe to delete");
                        } else {
                            json(200, "ok", "cannot delete");
                        }
                    }
                } else {
                    json(400, "bad request", "id not found");
                }
            }
        } else {
            json(400, "bad request", "no id");
        }
    } else {
        json(400, "bad request", "invalid table");
    }
} else {
    json(400, "bad request", "no table");
}
