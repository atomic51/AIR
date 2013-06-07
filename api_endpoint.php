<?php

$src = $_GET['s'];
$year = $_GET['y'];

$dataSources = array('national_debt', 'budget_breakdown', 'prime_ministers', 'demographics_age_groups_male', 'demographics_age_groups_female','demographics_births_deaths_change', 'demographics_religion', 'demographics_migration', 'quality_of_life_house_prices', 'quality_of_life_cpi', 'quality_of_life_household_income', 'quality_of_life_employment_sectors', 'news_headlines');

if($src!='') {
	$dataSources = array($src);
}


$aResult = array();
for($i=0;$i<sizeof($dataSources);$i++) {
	$aResult = array();
	if (($handle = fopen('datasources/'.$dataSources[$i].'.csv', "r")) !== FALSE) {
	    while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
	    	if($year!='') {
	    		if($data[0]==$year) {
	    			$aResult[] = $data;
	    		}
	    	} else {
	            $aResult[] =  $data;
	        }
	    }
	    fclose($handle);
	}
	$aReturn[$dataSources[$i]] = $aResult;
}

echo json_encode($aReturn);

?>