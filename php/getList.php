<?php
include "config.php";

if ($type = $_GET["type"] ?? null) {
    $query = "";
    switch ($type) {
        case 'departments':
            $query = "SELECT d.name, l.name as location
            FROM department d
            LEFT JOIN location l ON (l.id = d.locationID)
            ORDER BY d.name";
            break;
        case 'employees':
            $query = $query = "SELECT p.lastName, p.firstName, p.jobTitle, p.email, d.name as department, l.name as location
            FROM personnel p
            LEFT JOIN department d ON (d.id = p.departmentID)
            LEFT JOIN location l ON (l.id = d.locationID)
            ORDER BY p.lastName, p.firstName, d.name, l.name";
            break;
        case 'locations':
            $query = "SELECT name FROM location
            ORDER BY name";
            break;
        default:
            json(400, "bad request", "invalid type");
            break;
    }

    $result = db($query);
    $data = [];
    while ($row = $result->fetch_assoc()) {
        array_push($data, $row);
    }
    json(200, "ok", "success", $data);
} else {
    json(400, "bad request", "no type");
}
