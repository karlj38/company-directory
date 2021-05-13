<?php
include "config.php";

if ($table = $_GET["table"] ?? null) {
    $col = $_GET["column"] ?? null;
    $col = $col ? escape($col) : null;
    $operator = $_GET["operator"] ?? null;
    $operator = $operator ? escape($operator) : null;
    $condition = $_GET["condition"] ?? null;
    $condition = $condition ? escape($condition) : null;
    $sort = $_GET["sort"] ?? null;
    $sort = $sort ? escape($sort) : null;
    $order = $_GET["order"] ?? null;
    $order = $order ? escape($order) : null;
    $where = "";

    switch ($table) {
        case 'department':
            $order = $order ? "$order" : "d.name";
            break;
        case 'personnel':
            $order = $order ? "$order" : "p.lastName";
            break;
        case 'location':
            $order = $order ? "$order" : "l.name";
            break;
        default:
            json(400, "bad request", "invalid type");
            break;
    }

    if ($col && $operator && $condition) {
        switch ($operator) {
            case 'equal':
                $operator = "=";
                break;
            case 'notEqual':
                $operator = "!=";
                break;
            case 'like':
                $operator = "LIKE";
                $condition = "%$condition%";
                break;
            default:
                json(400, "bad request", "invalid operator");
                break;
        }
        $where = "WHERE $col $operator '$condition'";
    }

    switch ($table) {
        case 'department':
            $query = "SELECT d.id, d.name, l.name as location, COUNT(*) as personnel
            FROM department d
            LEFT JOIN location l ON (l.id = d.locationID)
            LEFT JOIN personnel p ON (p.departmentID = d.ID)
            $where
            GROUP BY d.name
            ORDER BY $order ";
            break;
        case 'personnel':
            $query = "SELECT p.id, p.lastName, p.firstName, p.jobTitle, p.email, d.name as department, l.name as location
            FROM personnel p
            LEFT JOIN department d ON (d.id = p.departmentID)
            LEFT JOIN location l ON (l.id = d.locationID)
            $where
            ORDER BY $order ";
            break;
        case 'location':
            $query = "SELECT l.id, l.name, COUNT(*) as personnel
            FROM location l
            LEFT JOIN department d ON (d.locationID = l.id)
            LEFT JOIN personnel p ON (p.departmentID = d.id)
            $where
			GROUP BY l.name
            ORDER BY $order ";
            break;
    }
    $query = $sort ? $query . $sort : $query;
    // echo $query;
    // exit;
    $result = db($query);
    $data = [];
    while ($row = $result->fetch_assoc()) {
        if ($table == "location") {
            $id = $row["id"];
            $query = "SELECT COUNT(*) as departments FROM department WHERE locationID = '$id'";
            $countResult = db($query);
            while ($countRow = $countResult->fetch_assoc()) {
                $row["departments"] = $countRow["departments"];
            }
        }
        array_push($data, $row);
    }
    json(200, "ok", "success", $data);
} else {
    json(400, "bad request", "no table");
}
