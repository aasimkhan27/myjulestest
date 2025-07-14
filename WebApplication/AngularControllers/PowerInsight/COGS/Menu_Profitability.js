app.controller('PI_Menu_ProfitabilityController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $localStorage) {
    $scope.$parent.CURRENT_PATH = window.location.hash;
    $scope.$parent.overlay_loading_powerInsight = 'none';
    $scope.THIS_APP_PAGE_COMPONENTS_LIST = [];
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(2);
    $scope.Input_Model = {
        GET_PAGE_DATA: true,
        GET_FILTER_DATA: true,
        USER_ID: parseInt($cookies.get("USERID")),
        APP_PAGE_ID: 29,
        DISPLAY_TEXT_SITE: "Select Sites",
        ENTITY_BRANCH_LIST: [],
        WEEK_DATE: new Date(),
        START_DAY_OF_WEEK: 1,
        WEEK_NO: 9,
        PAGE_SIZE: 10
    }
    $scope.LOAD_APP_COMPONENTS = 0;
    $scope.GET_THIS_PAGE_COMPONENTS = function () {
        var _app_page_components_list = JSON.parse($localStorage.APP_PAGE_COMPONENTS_LIST);
        $scope.THIS_APP_PAGE_COMPONENTS_LIST = _app_page_components_list.filter(function (x) { return x.APP_PAGE_ID == $scope.Input_Model.APP_PAGE_ID && x.ACTIVE });
        $scope.LOAD_APP_COMPONENTS = 1;
    }

    function weekYear(date) {
        var currentDate = new Date(date);
        var year = new Date(currentDate.getFullYear(), 0, 1);
        var days = Math.floor((currentDate - year) / (24 * 60 * 60 * 1000));
        var week = Math.ceil((currentDate.getDay() + 1 + days) / 7);
        return week;
    }
    $scope.Fn_CHANGE_FILTER = function () {
        if ($scope.$parent.PI_INDEX_JS_LOAD == 2) {
            //  $scope.$parent.$parent.overlay_loadingNew = 'block';
        }
        // $scope.GetChartData("onchange");
        $scope.Fn_VIEW_ONLOAD_DATA("onchange", 1);
    };
    $scope.set_week_picker = function (date, FLAG) {
        $scope.start_date = new Date(date.getFullYear(), date.getMonth(), parseInt($scope.START_DAY_OF_WEEK) + date.getDate() - date.getDay());//new Date(date.getFullYear(), date.getMonth(), 1 + date.getDate() - date.getDay());
        $scope.end_date = new Date(date.getFullYear(), date.getMonth(), parseInt($scope.START_DAY_OF_WEEK) + date.getDate() - date.getDay() + 6); //new Date(date.getFullYear(), date.getMonth(), $scope.start_date.getDate() + (6));
        if ($scope.start_date > date) {
            if (FLAG == 1) {
                var increasedays = $scope.start_date.getDate() - date.getDate();
                $scope.start_date = new Date(date.getFullYear(), date.getMonth(), $scope.start_date.getDate() - ((7 - increasedays) + increasedays));
                //  $scope.end_date = new Date(date.getFullYear(), date.getMonth(), $scope.start_date.getDate() + (6));
                $scope.end_date = $scope.$parent.addDays(new Date($scope.start_date), 6);
            }
        }
        var StartDD = $scope.start_date.getDate();
        var Startmm = $scope.start_date.getMonth() + 1;
        var start_dateyyyy = $scope.start_date.getFullYear();

        var EndDD = $scope.end_date.getDate();
        var Endmm = $scope.end_date.getMonth() + 1;
        var Endyyyy = $scope.end_date.getFullYear();

        if (StartDD < 10) { StartDD = '0' + StartDD; }
        if (Startmm < 10) { Startmm = '0' + Startmm; }
        var start_dateddmmyy = StartDD + '/' + Startmm + '/' + start_dateyyyy;

        if (EndDD < 10) { EndDD = '0' + EndDD; }
        if (Endmm < 10) { Endmm = '0' + Endmm; }
        var end_dateddmmyy = EndDD + '/' + Endmm + '/' + Endyyyy;

        $scope.weekpicker.datepicker('update', $scope.start_date); //(($scope.start_date.getMonth() + 1) + '/' + $scope.start_date.getDate() + '/' + $scope.start_date.getFullYear() + ' - ' + ($scope.end_date.getMonth() + 1) + '/' + $scope.end_date.getDate() + '/' + $scope.end_date.getFullYear()));
        $scope.weekpicker.val(start_dateddmmyy + ' - ' + end_dateddmmyy);

        $scope.filterweekpicker.datepicker('update', $scope.start_date); //(($scope.start_date.getMonth() + 1) + '/' + $scope.start_date.getDate() + '/' + $scope.start_date.getFullYear() + ' - ' + ($scope.end_date.getMonth() + 1) + '/' + $scope.end_date.getDate() + '/' + $scope.end_date.getFullYear()));
        $scope.filterweekpicker.val(start_dateddmmyy + ' - ' + end_dateddmmyy);


        $scope.Input_Model.START_DATE = $scope.start_date;
        $scope.Input_Model.END_DATE = $scope.end_date;
        $scope.Input_Model.WEEK_NO = weekYear($scope.start_date);

        if (!$scope.$$phase) { $scope.$apply(); }

        $scope.Fn_CHANGE_FILTER("DateChange");
    };
    $scope.DATE_WEEK_PICKER = function (date) {
        $scope.weekpicker = $('.week-picker');
        $scope.weekpicker.datepicker({
            weekStart: parseInt($scope.START_DAY_OF_WEEK),
            autoclose: true,
            forceParse: false,
            todayHighlight: true,
            container: '#week-picker-wrapper',
            calendarWeeks: true,

        }).on("changeDate", function (e) {
            $scope.set_week_picker(e.date);
            });

        $scope.filterweekpicker = $('.week-picker-copy');
        $scope.filterweekpicker.datepicker({
            weekStart: parseInt($scope.START_DAY_OF_WEEK),
            autoclose: true,
            forceParse: false,
            todayHighlight: true,
            container: '#week-picker-copy-wrapper',
            calendarWeeks: true,

        }).on("changeDate", function (e) {
            $scope.set_week_picker(e.date);
            });

        $('.week-prev').on('click', function () {
            var prev = new Date($scope.start_date.getTime());
            prev.setDate(prev.getDate() - 6);
            $scope.set_week_picker(prev);
        });
        $('.week-next').on('click', function () {
            var next = new Date($scope.end_date.getTime());
            next.setDate(next.getDate() + 1);
            $scope.set_week_picker(next);
        });
        $scope.set_week_picker(date, 1);
    };
    $scope.GET_UTC_TIME = function () {
        var ModelObj = new Object();
        ModelObj.TIMEZONE_OFFSET = $cookies.get("TIMEZONE_OFFSET");
        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        ModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
        PrcCommMethods.HR_API(ModelObj, 'GET_UTC_TIME').then(function (data) {
            var _day = $scope.$parent.addDays(new Date(data.data), -6);
            $scope.DATE_WEEK_PICKER(_day)
        });
    };
    //Food_Bubbles_Chart
    $scope.BUBBLE_CHART = function (CHART_NAME, DATA, CHART_DATA, TYPE) {
        $('#' + CHART_NAME).empty();
        var options = {
            series: CHART_DATA.BUBBLECHARTDATALIST,
            chart: {
                height: 550,
                type: 'bubble',
                zoom: {
                    enabled: $scope.APPLY_ZOOM
                },
                toolbar: {
                    show: false
                }
            },
            plotOptions: {
                bubble: {
                    zScaling: true,
                    minBubbleRadius: 5,
                    maxBubbleRadius: 100,
                }
            },
            dataLabels: {
                enabled: false
            },
            colors: CHART_DATA.COLORS,
            fill: {
                opacity: 0.3
            },
            title: {
                // text: 'Simple Bubble Chart'
            },
            xaxis: {
                tickAmount: 30,
                title: {
                    show: true,
                    position: 'bottom',
                    text: "Cost",
                    style: {
                        color: "#05a6f0",
                        fontSize: 14,
                    }
                },
            },
            yaxis: {
                show: CHART_DATA.SHOWYAXIS,
                min: 0,
                max: 110,
                title: {
                    text: "GP %",
                    style: {
                        color: "#05a6f0",
                        fontSize: 14,
                    }
                },
                labels: {
                    show: CHART_DATA.SHOWYAXIS,
                    formatter: (val) => {
                        return val < $scope.$parent.K_M_T_VALUE_INIT ? $scope.$parent.NUMBER_WITH_COMMAS(val) : $scope.$parent.NUMBER_WITH_COMMAS(val / 1000) + 'K';
                    }
                }
            },
            tooltip: {
                custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                    return  ('<ul class="menu-profitability">' +
                        '<li class="header"> <span class="dots" style="background-color:' + w.globals.colors[seriesIndex] +'"></span> ' + w.globals.seriesNames[seriesIndex] + ': '+   w.globals.initialSeries[seriesIndex].DISPLAY_DATA[dataPointIndex]  + '</li>' +
                        '<li>Sales Value: ' + $scope.$parent.NUMBER_WITH_COMMAS(w.globals.initialSeries[seriesIndex].data[dataPointIndex][2])  + '</li>' +
                        '<li>GP%: '  + series[seriesIndex][dataPointIndex]  + '</li>' +
                        '</ul>');
                },
            },
            legend: {
                show: true,
                position: 'bottom',
                offsetX: 1,
                offsetY: 5,
                labels: {
                    position: 'bottom',
                },
            },
            responsive: [
                {
                    breakpoint: 1367,
                    options: {
                        chart: {
                            height: 290,
                        }
                    }
                },
                {
                    breakpoint: 1920,
                    options: {
                        chart: {
                            height: 380,
                        }
                    }
                },
                {
                    breakpoint: 2736,
                    options: {
                        chart: {
                            height: 400,
                        }
                    }
                },
            ]
        };
        var chart = new ApexCharts(document.querySelector("#" + CHART_NAME), options);
        chart.render();
    }

    $scope.GetChartData = function () {
        $scope.$parent.$parent.overlay_loading_powerInsight = 'block';
        if ($scope.Input_Model.ENTITY_BRANCH_LIST.length == 0) {
            $scope.Fn_Fill_ENTITY_BRANCH_LIST();
        };
        $scope.$parent.GET_CONVERSION_RATES_BY_BRANCH_FOR_POWER_INSIGHTS($scope.Input_Model.START_DATE,
            $scope.Input_Model.END_DATE, $scope.Input_Model.CURRENCY_ID, $scope.Input_Model.ENTITY_BRANCH_LIST,
            $scope.Input_Model.DISPLAY_TEXT_CURRENCY
        );
        $scope.Display_Model = {};
        angular.forEach($scope.THIS_APP_PAGE_COMPONENTS_LIST, function (component, index) {
            var _pi_input_model_obj = new Object();
            _pi_input_model_obj.USER_ID = parseInt($cookies.get("USERID"));
            _pi_input_model_obj.MODULE_ID = 16;
            _pi_input_model_obj.SUB_MODULE_ID = 0;
            _pi_input_model_obj.APP_PAGE_ID = $scope.Input_Model.APP_PAGE_ID;
            _pi_input_model_obj.COMPONENT_ID = component.COMPONENT_ID;
            _pi_input_model_obj.COMPONENT_TYPE_ID = component.COMPONENT_ID;// for now i am passing component id- component.COMPONENT_TYPE_ID;
            _pi_input_model_obj.SP_NAME = component.STORED_PROCEDURE;
            _pi_input_model_obj.SP_PARAMETERS = component.PARAMETERS;
            _pi_input_model_obj.TITLE = component.COMPONENT_NAME;
            _pi_input_model_obj.CURRENCY_ID = $scope.Input_Model.CURRENCY_ID;
            _pi_input_model_obj.START_DATE = new Date($scope.Input_Model.START_DATE).toDateString();
            _pi_input_model_obj.END_DATE = new Date($scope.Input_Model.END_DATE).toDateString();
            _pi_input_model_obj.ENTITY_BRANCH_LIST = $scope.Input_Model.ENTITY_BRANCH_LIST;
            _pi_input_model_obj.CATEGORY_MASTER_ID = 0;
            _pi_input_model_obj.SORT_ORDER = component.COMPONENT_ID == 86 ? -1 : 1;
            _pi_input_model_obj.PAGE_NO = 1;
            _pi_input_model_obj.PAGE_SIZE = $scope.Input_Model.PAGE_SIZE;
            PrcCommMethods.DASHBOARD_MODULES_API(_pi_input_model_obj, 'GETDATAFORCHART', 'POWERINSIGHTAPI').then(function (data) {
                // $scope.$parent.overlay_loading_powerInsight = 'none';
                $scope.CardLineData = [];
                if (data.data != null) {
                    $scope.SetDisplayObjects(data.data, data.data.COMPONENT_TYPE_ID, index);
                    if ($scope.THIS_APP_PAGE_COMPONENTS_LIST.length - 1 == index && $scope.$parent.PI_INDEX_JS_LOAD == 2) {
                        // $scope.$parent.$parent.overlay_loadingNew = 'none';
                    }
                }
            });
        });
        if ($scope.$parent.PI_INDEX_JS_LOAD == 1) {
            $scope.$parent.PI_INDEX_JS_LOAD = 2;
        };
    };
    $scope.SetDisplayObjects = function (data) {
        switch (data.COMPONENT_TYPE_ID) {
            case 85:
                $scope.Display_Model.BUBBLES_CHART = data;
                $scope.BUBBLE_CHART("Food_Bubbles_Chart", data, data, "string");
                break;
            case 86:
                //
                $scope.Display_Model.TOP_MENUPROFITABILITY_OBJECT_LIST = data;
                $scope.Display_Model.TOP_OBJ_PI_INPUT_MODEL = data.OBJ_PI_INPUT_MODEL;
                break;
            case 87:
                $scope.Display_Model.BOTTOM_MENUPROFITABILITY_OBJECT_LIST = data;
                $scope.Display_Model.BOTTOM_OBJ_PI_INPUT_MODEL = data.OBJ_PI_INPUT_MODEL;
                break;
            case 88:
                break;
        }
    }

    $scope.Get_TOP_Bottom_Data = function (OBJ_PI_INPUT_MODEL, component) {
        $scope.$parent.$parent.overlay_loading_powerInsight = 'block';
        if ($scope.Input_Model.ENTITY_BRANCH_LIST.length == 0) { $scope.Fn_Fill_ENTITY_BRANCH_LIST(); };
        var _pi_input_model_obj = new Object();
        _pi_input_model_obj.USER_ID = parseInt($cookies.get("USERID"));
        _pi_input_model_obj.MODULE_ID = 16;
        _pi_input_model_obj.SUB_MODULE_ID = 0;
        _pi_input_model_obj.APP_PAGE_ID = $scope.Input_Model.APP_PAGE_ID;
        _pi_input_model_obj.COMPONENT_ID = OBJ_PI_INPUT_MODEL.COMPONENT_ID;
        _pi_input_model_obj.COMPONENT_TYPE_ID = OBJ_PI_INPUT_MODEL.COMPONENT_ID;// for now i am passing component id- component.COMPONENT_TYPE_ID;
        _pi_input_model_obj.SP_NAME = OBJ_PI_INPUT_MODEL.SP_NAME;
        _pi_input_model_obj.SP_PARAMETERS = OBJ_PI_INPUT_MODEL.SP_PARAMETERS;
        _pi_input_model_obj.TITLE = component.TITLE;
        _pi_input_model_obj.CURRENCY_ID = $scope.Input_Model.CURRENCY_ID;
        _pi_input_model_obj.START_DATE = new Date($scope.Input_Model.START_DATE).toDateString();
        _pi_input_model_obj.END_DATE = new Date($scope.Input_Model.END_DATE).toDateString();
        _pi_input_model_obj.ENTITY_BRANCH_LIST = $scope.Input_Model.ENTITY_BRANCH_LIST;
        _pi_input_model_obj.CATEGORY_MASTER_ID = component.CATEGORY_MASTER_ID;
        _pi_input_model_obj.SORT_ORDER = OBJ_PI_INPUT_MODEL.COMPONENT_ID == 86 ? -1 : 1;
        component.PAGE_NO == undefined ? component.PAGE_NO = 1 : '';
        _pi_input_model_obj.PAGE_NO = component.PAGE_NO + 1;
        _pi_input_model_obj.PAGE_SIZE = 10;
        PrcCommMethods.DASHBOARD_MODULES_API(_pi_input_model_obj, 'GETDATAFORCHART', 'POWERINSIGHTAPI').then(function (data) {
            if (data.data != null) {
            //    component.PAGE_NO = component.PAGE_NO + 1;
                if (data.data.MENUPROFITABILITY_OBJECT_LIST[0].MENUPROFITABILITY_OBJECT_LIST.length > 0) {
                    component.MENUPROFITABILITY_OBJECT_LIST = component.MENUPROFITABILITY_OBJECT_LIST.concat(data.data.MENUPROFITABILITY_OBJECT_LIST[0].MENUPROFITABILITY_OBJECT_LIST);
                    if (data.data.MENUPROFITABILITY_OBJECT_LIST[0].MENUPROFITABILITY_OBJECT_LIST.length < 10) {
                        component.GetData = false;
                    }
                    else {
                        component.PAGE_NO = parseInt(component.PAGE_NO) + 1;
                        component.GetData = true;
                    }
                }
                else {
                    component.GetData = false;
                }


            }
        });
    };

    $scope.SITE_All_Fn = function (FLAG) {
        $scope.IS_ALL_SITE_CHECK = !$scope.IS_ALL_SITE_CHECK;
        $scope.Input_Model.DISPLAY_TEXT_SITE = "Select Sites";
        angular.forEach($scope.SITE_LIST, function (site) {
            site.IS_CHECK = $scope.IS_ALL_SITE_CHECK;
            if ($scope.Input_Model.DISPLAY_TEXT_SITE == "Select Sites") {
                if (site.IS_CHECK) {
                    //$scope.Input_Model.DISPLAY_TEXT_SITE = site.Value;
                };
            }
            else if ($scope.Input_Model.DISPLAY_TEXT_SITE != "Select Sites") {
                if (site.IS_CHECK) {
                    // $scope.Input_Model.DISPLAY_TEXT_SITE = $scope.Input_Model.DISPLAY_TEXT_SITE + "," + site.Value;
                };
            };
        });
        if (FLAG == 1) {
            $scope.SELCTED_SITE();
        }
        if (!$scope.$parent.APPLY_BTN_SHOW) {
            $scope.Fn_BLUR_SITES();
        }
    }
    $scope.SITE_Fn = function (site, FLAG) {
        site.IS_CHECK = !site.IS_CHECK;
        if ($scope.Input_Model.DISPLAY_TEXT_SITE == "Select Sites") {
            if (site.IS_CHECK) {
                //$scope.Input_Model.DISPLAY_TEXT_SITE = site.Value;
            };
        }
        else if ($scope.Input_Model.DISPLAY_TEXT_SITE != "Select Sites") {
            if (site.IS_CHECK) {
                //  $scope.Input_Model.DISPLAY_TEXT_SITE = $scope.Input_Model.DISPLAY_TEXT_SITE + "," + site.Value;
            };
        };
        if (FLAG == 1 && $scope.SITE_LIST.filter(function (x) { return x.IS_CHECK }).length > 0 || FLAG == 2 && $scope.$parent.APPLY_BTN_SHOW == false) {
            $scope.Fn_BLUR_SITES();
        }
        if (FLAG == 1 && $scope.SITE_LIST.filter(function (x) { return x.IS_CHECK }).length == 0) {
            $scope.$parent.ShowAlert("Attention", $scope.$parent.PI_MESSAGE, 3000);
            site.IS_CHECK = !site.IS_CHECK;
        }
    }

    $scope.Fn_BLUR_SITES = function () {
        $scope.Fn_Fill_ENTITY_BRANCH_LIST();
        if ($scope.SITE_LIST.filter(function (x) { return x.IS_CHECK }).length == 0) {
            $scope.$parent.ShowAlert("Attention", $scope.$parent.PI_MESSAGE, 3000);
        }
        else {
            $scope.Fn_CHANGE_FILTER("SITECHANGE");
        }
        $scope.SELCTED_SITE();
    }
    $scope.SELCTED_SITE = function () {
        var resultlength = ($scope.$parent.SITE_LIST.filter(function (x) { x.IS_APPLAY_CHECK = x.IS_CHECK; return x.IS_CHECK }));
        $scope.Input_Model.DISPLAY_TEXT_SITE = resultlength.length + " Site Selected";
    }
    $scope.Fn_Fill_ENTITY_BRANCH_LIST = function () {
        $scope.Input_Model.ENTITY_BRANCH_LIST = [];
        angular.forEach($scope.SITE_LIST, function (site) {
            if (site.IS_CHECK) {
                var _entity_site = site.Key.split(',');
                var _model = Object();
                _model.ENTITY_ID = _entity_site[0];
                _model.BRANCH_ID = _entity_site[1];
                $scope.Input_Model.ENTITY_BRANCH_LIST.push(_model);
            };
        });
    };
    $scope.CURRENCY_Fn = function (currency) {
        $scope.Input_Model.DISPLAY_TEXT_CURRENCY = currency.Value;
        $scope.Input_Model.CURRENCY_ID = currency.Key;
        $scope.CHANGE_FILTER_Fn(2)
    }
    $scope.CHANGE_FILTER_Fn = function () {
        $scope.GetChartData();
    };
    $scope.RESET_FILTER = function () {
        angular.forEach($scope.SITE_LIST, function (site) { site.IS_CHECK = true; site.IS_APPLAY_CHECK = true; });
        $scope.Fn_Fill_ENTITY_BRANCH_LIST();
        $scope.RESET_SITES_Fn();
        $scope.CURRENCY_Fn($scope.CURRENCY_LIST[0]);
        $scope.Fn_CHANGE_FILTER("Reset");
        window.scrollTo(0, 0);
    }
    $scope.RESET_SITES_Fn = function () {
        $scope.IS_ALL_SITE_CHECK = false;
        $scope.SITE_All_Fn(1);
    }

    $scope.CONTROLLER_LOAD = function () {
        $scope.GET_UTC_TIME(3);
    }

    $scope.Fn_VIEW_ONLOAD_DATA = function (APPLY_METHOD, FLAG) {
        if ($scope.$parent.CURRENCY_LIST.length > 0 && (FLAG != 1 || $scope.Input_Model.CURRENCY_ID == undefined)) {
            var _currency = $scope.$parent.CURRENCY_LIST.filter(function (x) { return x.Key == parseInt($cookies.get("CURRENCY_ID")) });
            if (_currency.length > 0) {
                $scope.Input_Model.CURRENCY_ID = _currency[0].Key;
                $scope.Input_Model.DISPLAY_TEXT_CURRENCY = _currency[0].Value;
            };
            $scope.SELCTED_SITE();
            $scope.GET_THIS_PAGE_COMPONENTS();
        };
        $scope.GetChartData();
    };
    if ($scope.$parent.PI_INDEX_JS_LOAD == 2) {
        // $scope.$parent.$parent.overlay_loadingNew = 'block';
        $scope.CONTROLLER_LOAD();
    };
    $scope.$parent.TOOLTIP_ENABLE_Fn();
    $scope.$parent.PI_child_scope = $scope;
});