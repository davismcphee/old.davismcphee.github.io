<?php

$name = $_POST["name"];
$email = $_POST["email"];
$message = $_POST["message"];
$adminEmail = "davismcphee@hotmail.com";

$success = mail($adminEmail, "Contact Message From: " . $name . " - " . date("Y-m-d"), $message, "From:" . $email);

if ($success) {
    echo("Message sent successfully! Thanks for the feedback.");
} else {
    echo("Message didn't send! Please try again.");
}
