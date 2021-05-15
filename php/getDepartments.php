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

$order = $order ? "$order" : "d.name";

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

$query = "SELECT d.id, d.name, l.id as locID, l.name as location, COUNT(p.departmentID) as personnel
FROM department d
LEFT JOIN location l ON (l.id = d.locationID)
LEFT JOIN personnel p ON (p.departmentID = d.ID)
$where
GROUP BY d.name
ORDER BY $order ";

$query = $sort ? $query . $sort : $query;
// echo $query;
// exit;
$result = db($query);
$data = [];
while ($row = $result->fetch_assoc()) {
    array_push($data, $row);
}
json(200, "ok", "success", $data);
