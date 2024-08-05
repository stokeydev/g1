<?php

  $executionStartTime = microtime(true);

  $countryData = json_decode(file_get_contents("../js/countryBorders.geo.json"), true);

  $country = [];

  if (isset($_GET['country_code'])) {
    $countryCode = strtoupper($_GET['country_code']);

    $founded = array_values(array_filter($countryData['features'], function ($feature) use ($countryCode) {
        return $feature['properties']['iso_a2'] === $countryCode;
    }));

    if (isset($founded[0])) {
        $country = $founded[0]['geometry'];
    }
  } else {
    foreach ($countryData['features'] as $feature) {
        $temp = null;
        $temp['code'] = $feature["properties"]['iso_a2'];
        $temp['name'] = $feature["properties"]['name'];

        array_push($country, $temp);
    }
 }

  //usort($country, function ($item1, $item2) {

  //    return $item1['name'] <=> $item2['name'];

  //});

  $output['status']['code'] = "200";
  $output['status']['name'] = "ok";
  $output['status']['description'] = "success";
  $output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
  $output['data'] = $country;
  
  header('Content-Type: application/json; charset=UTF-8');

  echo json_encode($output);