<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

$apiKey = '09a6ea06940a4e18aff22debdb3e5fb6'; 
$countryCode = $_POST['countryCode'];


$newsApiUrl = "https://newsapi.org/v2/top-headlines?country=$countryCode&apiKey=$apiKey";


// Create a stream context with the User-Agent header
$context = stream_context_create([
    'http' => [
        'header' => "User-Agent: getnews/1.0\r\n", // Replaced 'YourAppName' with  application name
    ],
]);

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $newsApiUrl);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["User-Agent: getnews/1.0"]); 

$result = curl_exec($ch);

curl_close($ch);

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
$output['data'] = json_decode($result, true);

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);
?>
