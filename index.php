<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title>A.I.R. - Australia In Review</title>
        <meta name="description" content="GovHack Project by BradAndGlen.com (Team Atomic 51)">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
        <link rel="stylesheet" href="css/entypo.css">
        <link rel="stylesheet" href="css/normalize.css">
        <link rel="stylesheet" href="css/main.css">
        <link rel="stylesheet" href="css/a51.css">
        <link href='http://fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,700italic,800italic,400,300,600,700,800' rel='stylesheet' type='text/css'>
        <link href="css/ui-lightness/jquery-ui-1.10.3.custom.css" rel="stylesheet">
        <script src="js/vendor/modernizr-2.6.2.min.js"></script>
    </head>
    <body>
        <!--[if lt IE 7]>
            <p class="chromeframe">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">activate Google Chrome Frame</a> to improve your experience.</p>
        <![endif]-->

    <div id="wrapper">

        <div id="header">
            <div id="middle_title"><img src="img/air_logo.png" /></div>
            <div id="api_icon"></div>
            <div id="share_icon"></div>
            <div id="api_options">
                <div id="join_arrow"></div>
                <span>Data Set</span>
                <select id="api_set_selection">
                    <option value="">All</option>
                    <?php
                        $dataSources = array('national_debt', 'budget_breakdown', 'prime_ministers', 'demographics_age_groups_male', 'demographics_age_groups_female','demographics_births_deaths_change', 'demographics_religion', 'demographics_migration', 'quality_of_life_house_prices', 'quality_of_life_cpi', 'quality_of_life_household_income', 'quality_of_life_employment_sectors', 'news_headlines');
                        for($i=0;$i<sizeof($dataSources);$i++) {
                            echo '<option value="'.$dataSources[$i].'">'.ucwords(str_replace("_", " ", $dataSources[$i])).'</option>'."\n";
                        }
                    ?>
                </select>
                <span>Year</span>
                <select id="api_year_selection">
                    <option value="">All</option>
                    <?php
                        for($i=1973;$i<2013;$i++) {
                            echo '<option value="'.$i.'">'.$i.'</option>'."\n";
                        }
                    ?>
                </select>
                <div id="query_api_btn">GO</div>
            </div>
        </div>

        <div id="main">
            <div id="top_selection_wrapper">
                <div id="top_selection_header">BUDGET SURPLUS / DEFECIT</div>
                <div id="center_line"></div>
                <div id="yearly_graph"></div>
                <div id="time_series">
                    <ul></ul>
                </div>
            </div>

            <div id="selection_gutter">
                <div id="selection_tool">
                    <div id="bar">
                        <div id="over_bar"></div>
                        <div id="under_bar"></div>
                    </div>
                    <div id="handle"></div>
                </div>
            </div>

            <div class="section" id="budget">
                <div class="title"><img src="img/budget_and_politics.png" /></div>
                <div id="budget_pm_img"></div>
                <div id="budget_pm_name"><span class="pm_name"></span><span class="pm_party"></span></div>
                <div class="budget_item">
                    <div class="budget_center_dot"></div>
                    <div class="budget_center_dot_2"></div>
                    <div class="budget_graph"></div>
                    <div class="budget_text">DEFENCE</div>
                </div>
                <div class="budget_item">
                    <div class="budget_center_dot"></div>
                    <div class="budget_center_dot_2"></div>
                    <div class="budget_graph"></div>
                    <div class="budget_text">EDUCATION</div>
                </div>
                <div class="budget_item">
                    <div class="budget_center_dot"></div>
                    <div class="budget_center_dot_2"></div>
                    <div class="budget_graph"></div>
                    <div class="budget_text">HEALTH</div>
                </div>
                <div class="budget_item">
                    <div class="budget_center_dot"></div>
                    <div class="budget_center_dot_2"></div>
                    <div class="budget_graph"></div>
                    <div class="budget_text">WELFARE</div>
                </div>
                <div class="budget_item">
                    <div class="budget_center_dot"></div>
                    <div class="budget_center_dot_2"></div>
                    <div class="budget_graph"></div>
                    <div class="budget_text">HOUSING</div>
                </div>
                <div class="budget_item">
                    <div class="budget_center_dot"></div>
                    <div class="budget_center_dot_2"></div>
                    <div class="budget_graph"></div>
                    <div class="budget_text">CULTURE</div>
                </div>
            </div>
            <div class="section" id="demographics">
                <div class="title"><img src="img/demographics.png" /></div>
                <div id="gender">
                    <div id="male_wrapper">
                        <div id="male_overlay">
                            <div id="male_percentage"></div>
                        </div>
                        
                    </div>
                    <div id="female_wrapper">
                        <div id="female_overlay">
                            <div id="female_percentage"></div>
                        </div>
                        
                    </div>
                </div>
                <div id="mid">
                    <div id="religion_wrapper">
                        <div class="tooltip"></div>
                        <div class="heading">RELIGION</div>
                        <div class="bars">
                            <div class="bar1"></div>
                            <div class="bar2"></div>
                            <div class="bar3"></div>
                        </div>
                    </div>

                    <div id="immigration_wrapper">
                        <div class="tooltip"></div>
                        <div class="heading">IMMIGRATION</div>
                        <div class="bars">
                            <div class="bar1"></div>
                            <div class="bar2"></div>
                            <div class="bar3"></div>
                        </div>
                    </div>
                </div>
                <div id="rhs">
                    <div id="age_wrapper">
                        <div id="d_9">
                            <span class="age_bracket">0-9</span>
                            <span class="bar_graph"></span>
                        </div>
                        <div id="d_19">
                            <span class="age_bracket">10-19</span>
                            <span class="bar_graph"></span>
                        </div>
                        <div id="d_29">
                            <span class="age_bracket">20-29</span>
                            <span class="bar_graph"></span>
                        </div>
                        <div id="d_39">
                            <span class="age_bracket">30-39</span>
                            <span class="bar_graph"></span>
                        </div>
                        <div id="d_49">
                            <span class="age_bracket">40-49</span>
                            <span class="bar_graph"></span>
                        </div>
                        <div id="d_59">
                            <span class="age_bracket">50-59</span>
                            <span class="bar_graph"></span>
                        </div>
                        <div id="d_60">
                            <span class="age_bracket">60+</span>
                            <span class="bar_graph"></span>
                        </div>
                    </div>
                    <div id="births_deaths_wrapper">
                        <div id="births_deaths_graph"></div>
                        <div id="current_natural_change"></div>
                        <div id="births_wrapper">BIRTHS<span class="num"></span></div>
                        <div id="deaths_wrapper">DEATHS<span class="num"></span></div>
                    </div>
                    <div id="pop_growth_heading">POPULATION GROWTH</div>

                </div>
            </div>
            <div class="section" id="quality">
                <div id="employment_heading"><span>EMPLOYMENT</span>BY INDUSTRY</div>
                <div id="employment_by_sector_graph"></div>
                <div id="employment_by_sector_shadow"></div>
                <div id="ebsg_tooltip"><span class="industry_name"><p></p></span></div>
                <div class="title"><img src="img/quality_of_life.png" /></div>
                <div id="median_house_graph"></div>
                <div id="current_median_price"></div>

                <div id="household_income_wrapper">
                    <div class="qol_numeric_txt"></div>
                    <div class="coin_shadow"></div>
                    <div class="inside_text">HOUSEHOLD <span>INCOME</span></div>
                </div>
                <div id="vs_txt">&amp;</div>
                <div id="cost_of_living_wrapper">
                    <div class="qol_numeric_txt"></div>
                    <div class="coin_shadow"></div>
                    <div class="inside_text">COST OF <span>LIVING</span></div>
                </div>
                <div id="mean_housing_price_title">MEDIAN HOUSING PRICES</div>
            </div>

            <div class="section" id="events">
                <div class="title"><img src="img/significant_events.png" /></div>
                <div id="np_title"><span class="t">THE AUSTRALIA IN REVIEW GAZETTE</span><span class="date">2001</span></div>
                <div class="head1 mainline"></div>
                <div class="head2 headline"></div>
                <div class="head3 headline"></div>
                <div class="np_image"></div>
            </div>
        </div>

    </div>


    <script src="js/vendor/jquery-1.9.1.min.js"></script>
    <script src="js/flot/jquery.flot.min.js"></script>
    <script src="js/flot/jquery.flot.pie.min.js"></script>
    <script src="js/flot/jquery.flot.curvedlines.js"></script>
    <script src="js/jquery-ui-1.10.3.custom.min.js"></script>
    <script src="js/plugins.js"></script>
    <script src="js/main.js"></script>

    <script>
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

      ga('create', 'UA-39789286-2', 'bradandglen.com');
      ga('send', 'pageview');

    </script>
    </body>
</html>
