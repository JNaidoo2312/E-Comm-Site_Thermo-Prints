<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$servername="containers-us-west-146.railway.app:5598";
$username="root";
$password="tuO5SeceAq20Cdz2OPIG";
$dbname="railway";
// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
} 
$sqlq = mysqli_query($conn, "SELECT * FROM store_items");
$rows = array();
while($r = mysqli_fetch_assoc($sqlq)) {
    $rows[] = $r;
}

$json = json_encode($rows);

if ($json === false) {
    // Avoid echo of empty string (which is invalid JSON), and
    // JSONify the error message instead:
    $json = json_encode(["jsonError" => json_last_error_msg()]);
    if ($json === false) {
        // This should not happen, but we go all the way now:
        $json = '{"jsonError":"unknown"}';
    }
    // Set HTTP response status code to: 500 - Internal Server Error
    http_response_code(500);
}
echo $json;
?>
