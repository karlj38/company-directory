<?php
include "config.php";

if ($type = $_GET["type"] ?? null) {
    $query = "";
    switch ($type) {
        case 'departments':
            $query = "SELECT d.id, d.name, l.name as location, COUNT(*) as personnel
            FROM department d
            LEFT JOIN location l ON (l.id = d.locationID)
            LEFT JOIN personnel p ON (p.departmentID = d.ID)
            GROUP BY d.name
            ORDER BY d.name";
            break;
        case 'employees':
            $query = $query = "SELECT p.id, p.lastName, p.firstName, p.jobTitle, p.email, d.name as department, l.name as location
            FROM personnel p
            LEFT JOIN department d ON (d.id = p.departmentID)
            LEFT JOIN location l ON (l.id = d.locationID)
            ORDER BY p.lastName, p.firstName, d.name, l.name";
            break;
        case 'locations':
            $query = "SELECT l.id, l.name, d.name as dept, COUNT(*) as personnel
            FROM location l
            LEFT JOIN department d ON (d.locationID = l.id)
            LEFT JOIN personnel p ON (p.departmentID = d.id)
			GROUP BY l.name
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
