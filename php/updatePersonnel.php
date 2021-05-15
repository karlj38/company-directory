<?php
include "config.php";

if ($_SERVER["REQUEST_METHOD"] == "PUT") {
    parse_str(file_get_contents("php://input"), $_PUT);
    if (($id = $_PUT["id"] ?? null) && ($fName = $_PUT["fName"] ?? null) && ($lName = $_PUT["lName"] ?? null) && ($job = $_PUT["job"] ?? null) && ($email = $_PUT["email"] ?? null) && ($deptID = $_PUT["deptID"] ?? null)) {
        $id = escape($id);
        $fName = escape($fName);
        $lName = escape(($lName));
        $job = escape(($job));
        $email = escape($email);
        $deptID = escape(($deptID));
        $query = "SELECT COUNT(id) as count FROM personnel WHERE id = '$id'";
        $checkExists = db($query);
        while ($row = $checkExists->fetch_assoc()) {
            if ($row["count"]) {
                $query = "UPDATE personnel SET firstName = '$fName', lastName = '$lName', jobTitle = '$job', email = '$email', departmentID = '$deptID' WHERE id = '$id'";

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
