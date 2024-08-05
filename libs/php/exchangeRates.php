<?php
ini_set('display_errors', 'On');
// error_reporting(E_ALL);

// $executionStartTime = microtime(true);

// #$baseCurrency = 'GBP'; // Set the base currency to British Pound
// // The base currency requires a pay account! Letting it be USD for now
// $apiKey = '49b2c9edd8db4070a56ee507784b52b1'; 

// // Construct the exchange rates API URL with the base currency and API key
// $url = "https://openexchangerates.org/api/latest.json?base=GBP&app_id={$apiKey}";

// $ch = curl_init();
// curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
// curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
// curl_setopt($ch, CURLOPT_URL, $url);

// $result = curl_exec($ch);

// curl_close($ch);

// $decode = json_decode($result, true);

$jsonFilePath = 'currencyrates.json';

// Read the JSON data from the file
$jsonData = file_get_contents($jsonFilePath);

// Check if the data was successfully read
if ($jsonData === false) {
    die("Error reading JSON data from file");
}

// Decode the JSON data into a PHP associative array
$decode = json_decode($jsonData, true);

// Check if the JSON decoding was successful
if ($decode === null) {
    die("Error decoding JSON data");
}
















$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
// $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
$output['data'] = $decode['rates'];

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);
?>
