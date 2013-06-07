var top_graph = {};
var data_load_timer = null;
var oDataResults = null;
var coin_timer = null;
var showing_api_opts = false;
$(document).ready(function() {

	preloader(['bob_hawke.jpg', 'gough_whitlam.jpg', 'john_howard.jpg', 'julia_gillard.jpg', 'kevin_rudd.jpg', 'malcolm_fraser.jpg', 'paul_keating.jpg']);
	getYearlyData();

	$('#api_icon').click(function(){
		if(!showing_api_opts) {
			showing_api_opts;
			$('#api_options').show();
		} else {
			showing_api_opts = false;
			$('#api_options').hide();
		}
	});

	$('#query_api_btn').click(function() {
		location.href = 'api_endpoint.php?s='+$('#api_set_selection').val()+'&y='+$('#api_year_selection').val();
	});

	$('#share_icon').click(function() {
		location='http://www.facebook.com/sharer.php?u='+encodeURIComponent(document.location)+'&amp;t='+encodeURIComponent(document.title);
	});

	$('#middle_title img').click(function() {
		$("html, body").animate({ scrollTop: 0 }, 600);
	});

	handleGutterClicks();

});

function handleGutterClicks() {

	$('#selection_gutter').click(function(e) {
		cancelDataLoad();
		var currentIndex = Math.floor((e.clientX - $(this).offset().left) / 24) - 1;
		$('#selection_tool').animate({'left':currentIndex * 24 + 'px'}, 250, function (){
			prepareToLoadData(currentIndex);
		});
	});	

}

$(window).scroll(function() {

	if($(window).scrollTop() > 241) {
		$('#budget').css({'margin-top':'350px'});
		$('#selection_gutter').css({'position':'fixed', 'bottom':'auto', 'top':'115px', 'left':'50%', 'margin-left':'-500px'});
		$('#top_selection_wrapper').css({'position':'fixed', 'margin-top':'-565px', 'left':'50%', 'margin-left':'-500px'});
	} else {
		$('#budget').css({'margin-top':'20px'});
		$('#selection_gutter').css({'position':'relative', 'top':'auto', 'bottom':'0px', 'margin-top':'0px', 'left':'50%', 'margin-left':'-500px'});
		$('#top_selection_wrapper').css({'position':'relative', 'margin-top':'20px', 'left':'auto', 'margin-left':'auto'});
	}

});


function getYearlyData() {

	oDataResults = null;

	$.ajax({
		url:'api.php',
		data:{},
		dataType:'JSON',
		success:function(d) {
			if(d) {
				console.log(d);
				oDataResults = d;
				var xMin = 9999999;
				var xMax = -9999999;
				var yMin = 9999999;
				var yMax = -9999999;
				var chartData = [];
				var seriesTicks = [];
				$.each(oDataResults.national_debt, function(i,el) {
					if(el[0] < xMin) {
						xMin = el[0];
					}
					if(el[0] > xMax) {
						xMax = el[0];
					}
					if(el[1] < yMin) {
						yMin = el[1];
					}
					if(el[1] > yMax) {
						yMax = el[1];
					}
					chartData.push([parseInt(el[0]), -1 * parseInt(el[1])]);
					seriesTicks.push(parseInt(el[0]));
					
				});

				$.each(seriesTicks, function(i, el) {
					$('#time_series ul').append('<li>'+seriesTicks[i]+'</li>');
				});
				console.log(chartData);

				var options = { 
						series: {
							lines: { 
								show: true,
								lineWidth:10
							},
							curvedLines: {
								active: true
							},
							points: { show: false },
							color: '#676767'
						},
						yaxis: {
							max: 2 * yMax,
							min: -2 * yMax,
							ticks:false
						},
						xaxis: {
							max:2012,
							min:1973,					
							tickLength:0,
							font: {
								size: 12,
								family:"Open Sans",
								color:'#ffffff'
							},
							tickColor:'#d8d5ce',
							ticks:false
						},
						grid: { 
							borderWidth: 0 
						} 
   					};
   				prepareToLoadData(0);
   				//preload newspaper images
   				preloadNewspaperImages();
				top_graph = $.plot("#yearly_graph", [{data: chartData, lines: { show: true, lineWidth: 10}, curvedLines: {apply:true}}],options);
			}
		}
	});

	$( "#selection_tool" ).draggable({ 
		axis: "x", 
		containment: "#top_selection_wrapper", 
		scroll: false, 
		grid:[24,0],
		start:function(){
			cancelDataLoad();
		},
		drag:function(){},
		stop:function(){
			var oData = top_graph.getData();
			var currentOffset = $('#selection_tool').position().left;
			var currentIndex = currentOffset / 24;
			console.log(oData[0]['data'][currentIndex]);
			prepareToLoadData(currentIndex);

		}
	});
	//setTimeout(function(){console.log(top_graph.getData());},2000);

}

function preloadNewspaperImages() {

	var imgsToPreload = [];
	$.each(oDataResults.news_headlines, function(i, el) {
		imgsToPreload.push('event_'+el[0]+'.jpg');
	});

	preloader(imgsToPreload);

}

function cancelDataLoad() {

	clearTimeout(data_load_timer);
	$('#under_bar').stop().animate({'height':'0px'}, 100);
	//$('#time_series ul li').animate({'font-size':'12px','line-height':'38px'},1000);
	$('#time_series ul li').removeClass('active');
	$('#time_series ul li').removeClass('inactive');
}

function prepareToLoadData(c) {

	$('#under_bar').animate({'height':'280px'}, 1000, function() {});
	$('#time_series ul li:eq('+c+')').addClass('active');
	$('#time_series ul li').not(':eq('+c+')').addClass('inactive');
	//$('#time_series ul li:eq('+c+')').animate({'font-size':'18px','line-height':'30px'},1000);

	data_load_timer = setTimeout(updateSegments,990);

}

function updateSegments() {
	updateBudget();
	updateDemographics();
	updateQualityOfLife();
	updateSignificantEvents();
	//etc
}

function updateBudget() {

	var currentOffset = $('#selection_tool').position().left;
	var currentIndex = currentOffset / 24;
	var thisYear = oDataResults.budget_breakdown[currentIndex];
	var totalBudget = 0;
	var budget_defence = parseInt(thisYear[1]);
	var budget_education = parseInt(thisYear[2]);
	var budget_health = parseInt(thisYear[3]);
	var budget_social = parseInt(thisYear[4]);
	var budget_housing = parseInt(thisYear[5]);
	var budget_recreation = parseInt(thisYear[6]);

	totalBudget = budget_defence + budget_education + budget_health + budget_social + budget_housing + budget_recreation;

	var multiplier = 340;
	var defence_delta = multiplier * budget_defence / totalBudget;
	$('.budget_item:eq(0) > .budget_graph').animate({
		'width':defence_delta + 'px', 
		'height':defence_delta + 'px',
		'margin-left':-1 * defence_delta / 2 + 'px',
		'margin-top':-1 * defence_delta / 2 + 'px'
		}, 
		250);
	
	var education_delta = multiplier * budget_education / totalBudget
	$('.budget_item:eq(1) > .budget_graph').animate({
		'width':education_delta + 'px', 
		'height':education_delta + 'px',
		'margin-left':-1 * education_delta / 2 + 'px',
		'margin-top':-1 * education_delta / 2 + 'px'
	}, 250);
	
	var health_delta = multiplier * budget_health / totalBudget;
	$('.budget_item:eq(2) > .budget_graph').animate({
		'width':health_delta + 'px', 
		'height':health_delta + 'px',
		'margin-left':-1 * health_delta / 2 + 'px',
		'margin-top':-1 * health_delta / 2 + 'px'
	}, 250);
	
	var social_delta = multiplier * budget_social / totalBudget;
	$('.budget_item:eq(3) > .budget_graph').animate({
		'width':social_delta + 'px',
		'height':social_delta + 'px',
		'margin-left':-1 * social_delta / 2 + 'px',
		'margin-top':-1 * social_delta / 2 + 'px'
	}, 250);
	
	var housing_delta = multiplier * budget_housing / totalBudget;
	$('.budget_item:eq(4) > .budget_graph').animate({
		'width':housing_delta + 'px', 
		'height':housing_delta + 'px',
		'margin-left':-1 * housing_delta / 2 + 'px',
		'margin-top':-1 * housing_delta / 2 + 'px'
	}, 250);
	
	var recreation_delta = multiplier * budget_recreation / totalBudget;
	$('.budget_item:eq(5) > .budget_graph').animate({
		'width':recreation_delta + 'px', 
		'height':recreation_delta + 'px',
		'margin-left':-1 * recreation_delta / 2 + 'px',
		'margin-top':-1 * recreation_delta / 2 + 'px'
	}, 250);

	//who was in power
	var pm = oDataResults.prime_ministers[currentIndex];
	if(pm[2]=='Labor') {
		$('#budget').addClass('labor');
		$('#budget_pm_name .pm_party').addClass('labor_txt');
	} else {
		$('#budget').removeClass('labor');
		$('#budget_pm_name .pm_party').removeClass('labor_txt');
	}

	$('#budget_pm_img').animate({'opacity':'0'},500, function() {
		$('#budget_pm_img').css({'background':'url(img/'+pm[1].toLowerCase().replace(' ','_')+'.jpg)'});
		$('#budget_pm_img').animate({'opacity':'1'}, 1000);		
	});

	$('#budget_pm_name .pm_name').html(pm[1]);
	$('#budget_pm_name .pm_party').html(pm[2]);



}

function updateDemographics() {

	var currentOffset = $('#selection_tool').position().left;
	var currentIndex = currentOffset / 24;
	var male_groups = [];
	var female_groups = []

	$.each(oDataResults.demographics_age_groups_male, function(i, el) {
		male_groups.push(oDataResults.demographics_age_groups_male[i][currentIndex+1]);
	});

	$.each(oDataResults.demographics_age_groups_female, function(i, el) {
		female_groups.push(oDataResults.demographics_age_groups_female[i][currentIndex+1]);
	});


	var female_total = 0;
	var male_total = 0;

	$.each(female_groups, function(i,el) {
		female_total+=parseInt(female_groups[i]);
	});
	$.each(male_groups, function(i,el) {
		male_total += parseInt(male_groups[i]);
	});

	if(isNaN(female_total) || (isNaN(male_total))) {
		$('#gender').animate({'opacity':'0.5'});
		$('#male_percentage').html('');
		$('#female_percentage').html('');
		$('#male_overlay').animate({'height':'0px'});
		$('#female_overlay').animate({'height':'0px'});
		return;
	} else {
		$('#gender').animate({'opacity':'1'});
	}

	var population_total = male_total + female_total;

	var male_percentage = male_total / population_total;
	var female_percentage = female_total / population_total;

	var m_final_p = Math.round(10 * (100*male_percentage)) / 10;
	var f_final_p = Math.round(10 * (100*female_percentage)) / 10;
	var m_final;
	var f_fina;

	if(m_final_p > f_final_p) {
		m_final = 96 + (10 * (m_final_p - f_final_p));
		f_final = 98 - (10 * (m_final_p - f_final_p));
	} else {
		m_final = 96 - (10 * (f_final_p - m_final_p));
		f_final = 98 + (10 * (f_final_p - m_final_p));		
	}

	$('#female_overlay').animate({'height':f_final+'px'});
	$('#male_overlay').animate({'height':m_final+'px'});
	$('#male_percentage').html(m_final_p);
	$('#female_percentage').html(f_final_p);

	var multiplier = 650;

	var d9, d19, d29, d39, d49, d59, d60;

	d9 = parseFloat((parseInt(male_groups[0]) + parseInt(female_groups[0])) / population_total);
	d19 = parseFloat((parseInt(male_groups[1]) + parseInt(female_groups[1])) / population_total);
	d29 = parseFloat((parseInt(male_groups[2]) + parseInt(female_groups[2])) / population_total);
	d39 = parseFloat((parseInt(male_groups[3]) + parseInt(female_groups[3])) / population_total);
	d49 = parseFloat((parseInt(male_groups[4]) + parseInt(female_groups[4])) / population_total);
	d59 = parseFloat((parseInt(male_groups[5]) + parseInt(female_groups[5])) / population_total);
	d60 = parseFloat((parseInt(male_groups[6]) + parseInt(female_groups[6])) / population_total);

	$('#d_9 > span.bar_graph').animate({'height':d9 * multiplier+'px'},1000);
	$('#d_19 > span.bar_graph').animate({'height':d19 * multiplier+'px'},1000);
	$('#d_29 > span.bar_graph').animate({'height':d29 * multiplier+'px'},1000);
	$('#d_39 > span.bar_graph').animate({'height':d39 * multiplier+'px'},1000);
	$('#d_49 > span.bar_graph').animate({'height':d49 * multiplier+'px'},1000);
	$('#d_59 > span.bar_graph').animate({'height':d59 * multiplier+'px'},1000);
	$('#d_60 > span.bar_graph').animate({'height':d60 * multiplier+'px'},1000);

	//year, population, births, deaths, natural change
	console.log(oDataResults.demographics_births_deaths_change[currentIndex]);
	var births = parseInt(oDataResults.demographics_births_deaths_change[currentIndex][2]);
	var deaths = parseInt(oDataResults.demographics_births_deaths_change[currentIndex][3]);
	$('#births_wrapper span.num').html(births);
	$('#deaths_wrapper span.num').html(deaths);

	//births_deaths_graph
	var options = { 
		series: {
			lines: { 
				show: true,
				lineWidth:1,
				fillColor:false
			},
			curvedLines: {
				active: true
			},
			points: { show: false },
			color: '#00396e',
			shadowSize:0
		},
		yaxis: {
			max: 165000,
			min: 100000,
			ticks:false
		},
		xaxis: {
			max:2012,
			min:1973,					
			tickLength:0,
			font: {
				size: 12,
				family:"Open Sans",
				color:'#ffffff'
			},
			tickColor:'#00396e',
			ticks:false
		},
		grid: { 
			borderWidth: 0,
			labelMargin: 0,
			axisMargin:0,
			borderWidth:0,
			minBorderMargin:0
		} 
	};
	var chartData = [];

	$.each(oDataResults.demographics_births_deaths_change, function(i,el) {
		chartData.push([parseInt(el[0]), parseInt(el[4])]);
		
	});

	$('#current_natural_change').animate({left:(currentIndex * 8) + 3},1000)

	$.plot("#births_deaths_graph", [{data: chartData, lines: { show: true, lineWidth: 1, fill:true}, curvedLines: {apply:true}}],options);
			

	//religion
	var religions = oDataResults.demographics_religion[currentIndex];
	var christian = religions[1];
	var otherreligion = religions[2];
	var noreligion = religions[3];
	var total_religion = parseInt(christian) + parseInt(noreligion) + parseInt(otherreligion);

	var ch_delta = (parseFloat(christian / total_religion) * 250);
	var ot_delta = (parseFloat(otherreligion / total_religion) * 250);
	var no_delta = 250 - (ch_delta + ot_delta);

	$('#religion_wrapper .bars .bar1').animate({'width':ch_delta+'px'},1000);
	$('#religion_wrapper .bars .bar2').animate({'width':ot_delta+'px'},1000);
	$('#religion_wrapper .bars .bar3').animate({'width':no_delta+'px'},1000);

	$('#religion_wrapper .bars .bar1').unbind();
	$('#religion_wrapper .bars .bar1').on('mouseenter', function(){
		$('#religion_wrapper .tooltip').html('CHRISTIANITY');
		$('#religion_wrapper .tooltip').css({'top':'36px', 'left':25 + (ch_delta/2)+'px', 'opacity':'0', 'display':'block'});
		$('#religion_wrapper .tooltip').css({'opacity':'1'});
	});
	$('#religion_wrapper .bars .bar1').on('mouseleave', function(){
		//$('#religion_wrapper .tooltip').animate({'opacity':'0'}, 75, function() {
			$('#religion_wrapper .tooltip').css({'opacity':'0', 'display':'none'});
		//});
	});

	$('#religion_wrapper .bars .bar2').unbind();
	$('#religion_wrapper .bars .bar2').on('mouseenter', function(){
		$('#religion_wrapper .tooltip').html('OTHER');
		$('#religion_wrapper .tooltip').css({'top':'36px', 'left':19 + parseFloat(ch_delta) + (ot_delta/2)+'px', 'opacity':'0', 'display':'block'});
		$('#religion_wrapper .tooltip').css({'opacity':'1'});
	});
	$('#religion_wrapper .bars .bar2').on('mouseleave', function(){
		//$('#religion_wrapper .tooltip').animate({'opacity':'0'}, 75, function() {
			$('#religion_wrapper .tooltip').css({'opacity':'0', 'display':'none'});
		//});
	});

	$('#religion_wrapper .bars .bar3').unbind();
	$('#religion_wrapper .bars .bar3').on('mouseenter', function(){
		$('#religion_wrapper .tooltip').html('NO RELIGION');
		$('#religion_wrapper .tooltip').css({'top':'36px', 'left':20 + parseFloat(ch_delta) + parseFloat(ot_delta) + (no_delta/2)+'px', 'opacity':'0', 'display':'block'});
		$('#religion_wrapper .tooltip').css({'opacity':'1'});
	});
	$('#religion_wrapper .bars .bar3').on('mouseleave', function(){
		//$('#religion_wrapper .tooltip').animate({'opacity':'0'}, 75, function() {
			$('#religion_wrapper .tooltip').css({'opacity':'0', 'display':'none'});
		//});
	});

	//migration
	var migrations = oDataResults.demographics_migration[currentIndex];
	var uk_mig = migrations[2];
	var sa_mig = migrations[4];
	var chi_mig = migrations[6];
	var total_migrations = parseInt(uk_mig) + parseInt(sa_mig) + parseInt(chi_mig);

	var uk_delta = (parseFloat(uk_mig / total_migrations) * 250);
	var sa_delta = (parseFloat(sa_mig / total_migrations) * 250);
	var chi_delta = 250 - (uk_delta + sa_delta);

	$('#immigration_wrapper .bars .bar1').animate({'width':uk_delta+'px'},1000);
	$('#immigration_wrapper .bars .bar2').animate({'width':sa_delta+'px'},1000);
	$('#immigration_wrapper .bars .bar3').animate({'width':chi_delta+'px'},1000);

	$('#immigration_wrapper .bars .bar1').unbind();
	$('#immigration_wrapper .bars .bar1').on('mouseenter', function(){
		$('#immigration_wrapper .tooltip').html('UK');
		$('#immigration_wrapper .tooltip').css({'top':'170px', 'left':25 + (uk_delta/2)+'px', 'opacity':'0', 'display':'block'});
		$('#immigration_wrapper .tooltip').css({'opacity':'1'});
	});
	$('#immigration_wrapper .bars .bar1').on('mouseleave', function(){
		//$('#immigration_wrapper .tooltip').animate({'opacity':'0'}, 75, function() {
			$('#immigration_wrapper .tooltip').css({'opacity':'0', 'display':'none'});
		//});
	});

	$('#immigration_wrapper .bars .bar2').unbind();
	$('#immigration_wrapper .bars .bar2').on('mouseenter', function(){
		$('#immigration_wrapper .tooltip').html('S. AFRICA');
		$('#immigration_wrapper .tooltip').css({'top':'170px', 'left':19 + parseFloat(uk_delta) + (sa_delta/2)+'px', 'opacity':'0', 'display':'block'});
		$('#immigration_wrapper .tooltip').css({'opacity':'1'});
	});
	$('#immigration_wrapper .bars .bar2').on('mouseleave', function(){
		//$('#immigration_wrapper .tooltip').animate({'opacity':'0'}, 75, function() {
			$('#immigration_wrapper .tooltip').css({'opacity':'0', 'display':'none'});
		//});
	});

	$('#immigration_wrapper .bars .bar3').unbind();
	$('#immigration_wrapper .bars .bar3').on('mouseenter', function(){
		$('#immigration_wrapper .tooltip').html('CHINA');
		$('#immigration_wrapper .tooltip').css({'top':'170px', 'left':20 + parseFloat(uk_delta) + parseFloat(sa_delta) + (chi_delta/2)+'px', 'opacity':'0', 'display':'block'});
		$('#immigration_wrapper .tooltip').css({'opacity':'1'});
	});
	$('#immigration_wrapper .bars .bar3').on('mouseleave', function(){
		//$('#immigration_wrapper .tooltip').animate({'opacity':'0'}, 75, function() {
			$('#immigration_wrapper .tooltip').css({'opacity':'0', 'display':'none'});
		//});
	});


}

function updateQualityOfLife() {

	var sectors = ['Agriculture Forestry and Fishing', 'Mining', 'Manufacturing', 'Electricity Gas Water and Waste Services', 'Construction', 'Wholesale Trade', 'Retail Trade', 'Accommodation and Food Services', 'Transport Postal and Warehousing', 'Information Media and Telecommunications', 'Financial and Insurance Services', 'Rental Hiring and Real Estate Services', 'Professional Scientific and Technical Services', 'Administrative and Support Services', 'Public Administration and Safety', 'Education and Training', 'Health Care and Social Assistance', 'Arts and Recreation Services', 'Other Services'];
	var currentOffset = $('#selection_tool').position().left;
	var currentIndex = currentOffset / 24;

	var options = { 
		series: {
			lines: { 
				show: true,
				lineWidth:10,
				fillColor:false
			},
			curvedLines: {
				active: true
			},
			points: { show: false },
			color: '#1e5e03',
			shadowSize:0
		},
		yaxis: {
			max: 400000,
			min: 10000,
			ticks:false
		},
		xaxis: {
			max:2012,
			min:1973,					
			tickLength:0,
			font: {
				size: 12,
				family:"Open Sans",
				color:'#ffffff'
			},
			tickColor:'#1e5e03',
			ticks:false
		},
		grid: { 
			borderWidth: 0,
			labelMargin: 0,
			axisMargin:0,
			borderWidth:0,
			minBorderMargin:0
		} 
	};
	var chartData = [];

	$.each(oDataResults.quality_of_life_house_prices, function(i,el) {
		chartData.push([parseInt(el[0]), parseInt(el[3])]);
		
	});

	var po = (oDataResults.quality_of_life_house_prices[currentIndex][3] / (400000 - 10000)) * 280;
	
	$('#current_median_price').animate({left:(currentIndex * 24) + 32},1000)

	$.plot("#median_house_graph", [{data: chartData, lines: { show: true, lineWidth: 1, fill:true}, curvedLines: {apply:true}}],options);


	var donut_options = {
		series: {
			pie: {
				innerRadius: 0.75,
				show: true,
				highlight: {
					opacity:0.1
				},
				stroke: {
					width:0,
					color:'#2b760b'
				},
				label: {
					show:false
				},
				fill:1
			}
		},
		grid: {
			hoverable: true
		},
		legend: {
			show:false
		}
	};

	var sectorData = [];

	$.each(sectors, function(i, el) {

		sectorData.push({label:sectors[i], data:oDataResults.quality_of_life_employment_sectors[currentIndex][i+1]});

	});
	console.log(sectorData);
	$.plot("#employment_by_sector_graph", sectorData, donut_options);
	$('#employment_by_sector_graph').unbind('plothover');
	var previousPoint = null;
	$('#employment_by_sector_graph').bind('plothover', function (e, p, i) {
		e.preventDefault();
		e.stopPropagation();
		
		if(i) {
			if (previousPoint != i.seriesIndex) {

				previousPoint = i.seriesIndex;
				console.log(i);

				$('#ebsg_tooltip span.industry_name').html(i.series.label);
				$('#ebsg_tooltip ').css({'background-color':'rgba(0,0,0,0)'})
				$('#ebsg_tooltip').css({'display':'block','opacity':'1'});
				$('#ebsg_tooltip span').css({'margin-top':((190 - $('#ebsg_tooltip span').height())/2)+'px'});
				//$('#ebsg_tooltip').stop().animate({'opacity':'1'},150);

			}

		} else {
			//$('#ebsg_tooltip').stop().animate({'opacity':'0'},150, function(){
				$('#ebsg_tooltip').css({'display':'none'});
			//});

			previousPoint = null;
		}
	});

	var max_hh_income = 0;
	$.each(oDataResults.quality_of_life_household_income, function(i, el) {
		var mi = el[1];
		var fi = el[2];
		var ci = parseFloat(mi) + parseFloat(fi);
		if(ci > max_hh_income) {
			max_hh_income = ci;
		}
	});

	var m_hh_inc = oDataResults.quality_of_life_household_income[currentIndex][1];
	var f_hh_inc = oDataResults.quality_of_life_household_income[currentIndex][2];
	var cur_hh_inc = parseFloat(m_hh_inc) + parseFloat(f_hh_inc);

	$('#household_income_wrapper .qol_numeric_txt').html('$'+(cur_hh_inc*52));
	var numCoins = Math.floor(parseFloat(cur_hh_inc / max_hh_income) * 16);
	$('#household_income_wrapper .qol_numeric_txt').animate({'bottom':((numCoins*9) + 100)+'px'});
	if($('#household_income_wrapper div.coin').length) {
		$('#household_income_wrapper div.coin').animate({'opacity':'0'}, function() {
			$('#household_income_wrapper div.coin').remove();
			dropCoins(1, '#household_income_wrapper', 70, numCoins);		
		});
	} else {
		dropCoins(1, '#household_income_wrapper', 70, numCoins);
	}

	var max_col = 0;
	$.each(oDataResults.quality_of_life_cpi, function(i, el) {
		var cpi = parseFloat(el[1]);
		if(cpi > max_col) {
			max_col = cpi;
		}
	});

	var c_cpi = oDataResults.quality_of_life_cpi[currentIndex][1];
	$('#cost_of_living_wrapper .qol_numeric_txt').html(c_cpi);

	var numColCoins = Math.floor(parseFloat(c_cpi / max_col) * 16);

	$('#cost_of_living_wrapper .qol_numeric_txt').animate({'bottom':((numColCoins*9) + 96)+'px'});

	if($('#cost_of_living_wrapper div.coin').length) {
		$('#cost_of_living_wrapper div.coin').animate({'opacity':'0'}, function() {
			$('#cost_of_living_wrapper div.coin').remove();
			dropCoins(1, '#cost_of_living_wrapper', 125, numColCoins);		
		});
	} else {
		dropCoins(1, '#cost_of_living_wrapper', 125, numColCoins);
	}


}


function updateSignificantEvents() {

	var currentOffset = $('#selection_tool').position().left;
	var currentIndex = currentOffset / 24;

	var events = oDataResults.news_headlines[currentIndex];
	console.log(events);

            $('#np_title span.date').html(events[0]);
            $('.head1').html(events[1]);
            $('.head2').html(events[2]);
            $('.head3').html(events[3]);
            $('.np_image').css({'background':'url(img/event_'+events[0]+'.jpg)'});

}

function preloader(a) {
	for(i=0;i<a.length;i++) {var m = new Image();m.src = 'img/'+a[i];}
}


function dropCoins(n, el, lo, f) {

	if((n>=0) && (n <= f)) {
		var newN = n+1;
		var c = $('<div class="coin"></div>');
		var rnd = lo + ((Math.random() * 4) - 2);
		c.css({'bottom':'300px', 'opacity':'0', 'left':rnd+'px'});
		$(el).append(c);
		c.animate({'bottom':(((newN-1)*9) + 78)+'px', 'opacity':'1'}, 250+(n*25));
		dropCoins(newN, el, lo, f);
	} 

}