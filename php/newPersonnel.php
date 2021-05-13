<?php
include "config.php";

if (($fName = $_POST["fName"] ?? null) &&
    ($lName = $_POST["lName"] ?? null) &&
    ($job = $_POST["job"] ?? null) &&
    ($email = $_POST["email"] ?? null) &&
    ($deptID = $_POST["deptID"] ?? null)
) {
    $fName = escape($fName);
    $lName = escape($lName);
    $job = escape($job);
    $email = escape($email);
    $deptID = escape($deptID);
    $query = "INSERT INTO personnel (firstName, lastName, jobTitle, email, departmentID) VALUES ('$fName', '$lName', '$job', '$email', '$deptID')";

    // echo $query;
    // exit;
    $result = db($query);
    json(201, "ok", "created");
} else {
    json(400, "bad request", "missing one or more parameters");
}
