<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

$lat = $_POST['lat'];
$lng = $_POST['lng'];

//$apiKey = 'd3304b94d20947c099b222909232209';
$apiKey = 'b3eef77b1fa9e5abe3b3b7b5336fb037';

// Construct the weather API URL with latitude, longitude, and API key

    '&appid=' . $apiKey;
    $url= "http://api.weatherapi.com/v1/forecast.json?key=d3304b94d20947c099b222909232209&q=".$lat.",".$lng."&days=3&aqi=no";




$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

$result = curl_exec($ch);

curl_close($ch);

$decode = json_decode($result, true);

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
$output['data'] = $decode;

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);
?>
