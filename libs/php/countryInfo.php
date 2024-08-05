<?php


  // echo $_POST['Cname'];
  // echo  ($_REQUEST['Cname']);
   //echo  ($_REQUEST['countryName']);
   $name=  ($_POST['countryName']);
   //var_dump($_POST);


	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);
    
	// echo $_POST['Cname'];



	
    $url='https://api.opencagedata.com/geocode/v1/json?q='. $name .'&key=4524669a072a44b8a71ea81107053b1a&language=en&pretty=1';

    
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

	$decode = json_decode($result,true);
	
	//var_dump($decode['results'][0]);

	// if (isset($decode['results'][0]['geometry']['lat']) && isset($decode['results'][0]['geometry']['lng'])) {
		$output['status']['code'] = "200";
		$output['status']['name'] = "ok";
		$output['status']['description'] = "success";
		$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
		$output['data']['lat'] = $decode['results'][0]['geometry']['lat'];
		$output['data']['lng'] = $decode['results'][0]['geometry']['lng'];
		$output['data']['currency'] = $decode['results'][0]['annotations']['currency']['iso_code'];
		
		header('Content-Type: application/json; charset=UTF-8');
		echo json_encode($output);
	// } else {
	// 	// Handle the case where lat and lng data are not available in the response
	// 	$output['status']['code'] = "404";
	// 	$output['status']['name'] = "not found";
	// 	$output['status']['description'] = "Lat and Lng data not found for the specified country.";
		
	// 	header('Content-Type: application/json; charset=UTF-8');
	// 	echo json_encode($output);
	// }
	?>



