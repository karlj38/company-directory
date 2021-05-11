<?php
include "config.php";

if ($id = $_GET["id"] ?? null) {
    $id = escape($id);
    if (preg_match("/[0-9]{1,6}/", $id)) {
        $query = "SELECT p.lastName, p.firstName, p.jobTitle, p.email, d.name as department, l.name as location
FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID)
LEFT JOIN location l ON (l.id = d.locationID)
WHERE p.id = '$id'
ORDER BY p.lastName, p.firstName, d.name, l.name";

        $result = db($query);
        $data = [];
        while ($row = $result->fetch_assoc()) {
            array_push($data, $row);
        }
        json(200, "ok", "success", $data);
    } else {
        json(400, "bad request", "invalid ID");
    }
} else {
    json(400, "bad request", "no employee ID");
}
