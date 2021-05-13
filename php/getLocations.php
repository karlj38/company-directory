<?php
include "config.php";

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

$order = $order ? "$order" : "l.name";

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

$query = "SELECT l.id, l.name
FROM location l
$where
ORDER BY $order ";

$query = $sort ? $query . $sort : $query;
// echo $query;
// exit;
$result = db($query);
$data = [];
while ($row = $result->fetch_assoc()) {
    $id = $row["id"];
    $query = "SELECT COUNT(*) as departments FROM department WHERE locationID = '$id'";
    $countD = db($query);
    while ($count = $countD->fetch_assoc()) {
        $row["departments"] = $count["departments"];
    }
    $query = "SELECT COUNT(*) as personnel
    FROM personnel p
    LEFT JOIN department d ON (d.id = p.departmentID)
    LEFT JOIN location l ON (l.id = d.locationID)
    WHERE l.id = '$id'";
    $countP = db($query);
    while ($count = $countP->fetch_assoc()) {
        $row["personnel"] = $count["personnel"];
    }
    array_push($data, $row);
}
json(200, "ok", "success", $data);
