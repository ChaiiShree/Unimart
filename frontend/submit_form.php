<?php
// Database connection parameters
$servername = "http://localhost:5173/";
$username = "root@localhost";
$password = "mysql@232026";
$database = "UniPal";

// Create connection
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get form data
$productName = $_POST['productName'];
$category = $_POST['category'];
$description = $_POST['description'];
$price = $_POST['price'];
$email = $_POST['email'];
$hostel = $_POST['hostel'];
$phone = $_POST['phone'];

// SQL query to insert data into database
$sql = "INSERT INTO products (productName, category, description, price, email, hostel, phone)
VALUES ('$productName', '$category', '$description', '$price', '$email', '$hostel', '$phone')";

if ($conn->query($sql) === TRUE) {
    echo "New record created successfully";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>
