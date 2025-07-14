app.controller('PI_Weekly_P_LController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $localStorage) {
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(2);
    $scope.$parent.overlay_loading_powerInsight = 'none';
    $scope.$parent.CURRENT_PATH = window.location.hash;
    $scope.THIS_APP_PAGE_COMPONENTS_LIST = [];
    $scope.$parent.COMMON_CODE_CHANGE();
    $scope.Input_Model = {
        GET_PAGE_DATA: true,
        GET_FILTER_DATA: true,
        USER_ID: parseInt($cookies.get("USERID")),
        APP_PAGE_ID: 31,
        DISPLAY_TEXT_SITE: "Select Sites",
        ENTITY_BRANCH_LIST: [],
        WEEK_DATE: new Date(),
        START_DAY_OF_WEEK: 1,
        WEEK_NO: 9,
        //CURRENCY_ID: $cookies.get("CURRENCY_ID"),
        //DISPLAY_TEXT_CURRENCY: $cookies.get("CURRENCY_CODE") + '-' + $cookies.get("CURRENCY_SYMBOL"),
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
        $scope.Fn_VIEW_ONLOAD_DATA("onchange", 1);
    };

    $scope.set_week_picker = function (date, FLAG) {
        $scope.start_date = new Date(date.getFullYear(), date.getMonth(), parseInt($scope.$parent.START_DAY_OF_WEEK) + date.getDate() - date.getDay());//new Date(date.getFullYear(), date.getMonth(), 1 + date.getDate() - date.getDay());
        $scope.end_date = new Date(date.getFullYear(), date.getMonth(), parseInt($scope.$parent.START_DAY_OF_WEEK) + date.getDate() - date.getDay() + 6); //new Date(date.getFullYear(), date.getMonth(), $scope.start_date.getDate() + (6));
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
    $scope.DATE_WEEK_PICKER = function (date, FLAG) {
        $scope.weekpicker = $('.week-picker');
        $scope.weekpicker.datepicker({
            weekStart: parseInt($scope.$parent.START_DAY_OF_WEEK),
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
        $scope.set_week_picker(date, FLAG != undefined ? 2 : 1);
    };
    $scope.GET_UTC_TIME = function (FLAG) {
        var ModelObj = new Object();
        ModelObj.TIMEZONE_OFFSET = $cookies.get("TIMEZONE_OFFSET");
        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        ModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
        PrcCommMethods.HR_API(ModelObj, 'GET_UTC_TIME').then(function (data) {
            var _day = $scope.$parent.addDays(new Date(data.data), -6);
            $scope.DATE_WEEK_PICKER(_day, 1);
        });
    };

    $scope.AREA_LINE_CHART = function (CHART_NAME, DATA, HEADER_DATA, TYPE) {
        $('#' + CHART_NAME).empty();
        //$('#chart').html('<canvas id="survey_result"  width="400" height="200"></canvas>'); // then load chart.
        var optionslinechart = {
            series: DATA.LineSeriesList2,
            chart: {
                zoom: {
                    enabled: $scope.APPLY_ZOOM
                },
                toolbar: {
                    show: $scope.APPLY_TOOL_BAR,
                    tools: {
                        download: $scope.APPLY_TOOL_BAR_DOWNLOAD,
                        selection: $scope.APPLY_TOOL_BAR_SELECTION,
                        zoom: $scope.APPLY_TOOL_BAR_ZOOM,
                        zoomin: $scope.APPLY_TOOL_BAR_ZOOMIN,
                        zoomout: $scope.APPLY_TOOL_BAR_ZOOMOUT,
                        pan: $scope.APPLY_TOOL_BAR_PAN,
                        reset: $scope.APPLY_TOOL_BAR_RESET
                    }
                },
                height: 300,
                type: 'line',
            },
            dataLabels: {
                enabled: false
            },
            colors: DATA.Color,
            stroke: {
                width: 3,
                curve: "smooth",
            },
            xaxis: {
                type: 'category',
                categories: DATA.LABELS,
                tickAmount: 10,
            }, yaxis: [{
                //seriesName: "Budget",
                //show: true,
                opposite: true,
                //logarithmic: true,
                axisTicks: {
                    show: true
                },
                labels: {
                    show: DATA.ShowYAxis,
                    formatter: (val) => {
                        return val < $scope.$parent.K_M_T_VALUE_INIT ? $scope.$parent.NUMBER_WITH_COMMAS(parseFloat(val).toFixed(0)) : $scope.$parent.NUMBER_WITH_COMMAS(parseFloat(val / 1000).toFixed(0)) + 'K';
                    }
                }
            }, {
                //seriesName: "CY",
                //show: true,
                //logarithmic: true,
                axisTicks: {
                    show: true
                },
                labels: {
                    show: true,
                    formatter: (val) => {
                        return val < $scope.$parent.K_M_T_VALUE_INIT ? $scope.$parent.NUMBER_WITH_COMMAS(parseFloat(val).toFixed(0)) : $scope.$parent.NUMBER_WITH_COMMAS(parseFloat(val / 1000).toFixed(0)) + 'K';
                    }
                }
            },],
            fill: {
                //opacity: [0.85, 0.25, 1],
                //gradient: {
                //    inverseColors: false,
                //    shade: 'light',
                //    type: "vertical",
                //    opacityFrom: 0.85,
                //    opacityTo: 0.55,
                //    stops: [0, 100, 100, 100]
                //}
            },
            tooltip: {
                x: {
                    format: 'dd/MM/yy HH:mm'
                },
            },
        };
        var chartlinechart = new ApexCharts(document.querySelector("#" + CHART_NAME), optionslinechart);
        chartlinechart.render();
    };

    $scope.GetChartData = function (_pram_grid_click) {
        $scope.$parent.$parent.overlay_loading_powerInsight = 'block';
        if ($scope.Input_Model.ENTITY_BRANCH_LIST.length == 0) {
            $scope.Fn_Fill_ENTITY_BRANCH_LIST();
        };
        $scope.$parent.GET_CONVERSION_RATES_BY_BRANCH_FOR_POWER_INSIGHTS($scope.Input_Model.START_DATE,
            $scope.Input_Model.END_DATE, $scope.Input_Model.CURRENCY_ID, $scope.Input_Model.ENTITY_BRANCH_LIST,
            $scope.Input_Model.DISPLAY_TEXT_CURRENCY
        );
        $scope.Display_Model = {
            Grid_data: {
                GridOutputList:[],
            }
        };
        angular.forEach($scope.THIS_APP_PAGE_COMPONENTS_LIST, function (component, index) {
            if (component.COMPONENT_TYPE_ID != 93) {
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
                _pi_input_model_obj.NAME = component.COMPONENT_ID == 93 ? "" : '';
                _pi_input_model_obj.NAME_TYPE = component.COMPONENT_ID == 93 ? "" : '';
                ///--1 FOR HEADER,2 FOR SUBHEADER AND 3 FOR DISPLAY NAME 4 FOR NET REVENUE 5 FOR GP
                PrcCommMethods.DASHBOARD_MODULES_API(_pi_input_model_obj, 'GETDATAFORCHART', 'POWERINSIGHTAPI').then(function (data) {
                    // $scope.$parent.overlay_loading_powerInsight = 'none';
                    $scope.CardLineData = [];
                    if (data.data != null) {
                        $scope.SetDisplayObjects(data.data, component.COMPONENT_TYPE_ID, index);
                        if ($scope.THIS_APP_PAGE_COMPONENTS_LIST.length - 1 == index && $scope.$parent.PI_INDEX_JS_LOAD == 2) {
                            // $scope.$parent.$parent.overlay_loadingNew = 'none';
                        }
                    }
                });
            }
        });
        if ($scope.$parent.PI_INDEX_JS_LOAD == 1) {
            $scope.$parent.PI_INDEX_JS_LOAD = 2;
        };
    };
    $scope.SetDisplayObjects = function (data, COMPONENT_TYPE_ID) {
        switch (data.COMPONENT_TYPE_ID) {
            case 92:
                $scope.Display_Model.PNL_DATA_LIST = data.DATAGRID_VALUES;
                break;
            case 93:
                $scope.AREA_LINE_CHART("Net_Sales_Chart", data, data, "string");
                break;
            default:
                break;
        }
    }

    $scope.SITE_All_Fn = function (FLAG) {
        $scope.IS_ALL_SITE_CHECK = !$scope.IS_ALL_SITE_CHECK;
        $scope.Input_Model.DISPLAY_TEXT_SITE = "Select Sites";
        angular.forEach($scope.SITE_LIST, function (site) {
            site.IS_CHECK = $scope.IS_ALL_SITE_CHECK;
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
    };
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
        $scope.Fn_CHANGE_FILTER("CurrencyChange");
    };

    $scope.ONCLICK_TOGGLE_SHOW_Fn = function (_pram_pnl, index) {
        _pram_pnl.IS_HEADER_CHECK = !_pram_pnl.IS_HEADER_CHECK;
        var result = $scope.Display_Model.PNL_DATA_LIST.filter(function (_fn_pnl) { return _fn_pnl.Val14 == _pram_pnl.Val12 });
        for (var i = 0; i < result.length; i++) {
            result[i].IS_HEADER_CHECK = _pram_pnl.IS_HEADER_CHECK;
            if (_pram_pnl.Val12 != result[i].Val14) {
                break;
            }
        };
        //$scope.GRAPH_CLICK_Fn(_pram_pnl)
    }

    $scope.GRAPH_CLICK_Fn = function (_pram_grid_click,index) {
        // $scope.GetChartData(_pnl);
        angular.forEach($scope.Display_Model.PNL_DATA_LIST, function (_pram_value) { _pram_value.IS_GRAPH_ACTIVE = false; });
        _pram_grid_click.IS_GRAPH_ACTIVE = !_pram_grid_click.IS_GRAPH_ACTIVE;
        if (index == undefined) {
            _pram_grid_click.IS_HEADER_CHECK = !_pram_grid_click.IS_HEADER_CHECK;
        }
        else if (index == 0) {
            _pram_grid_click.IS_HEADER_CHECK = false;
        }

        $scope.SELECTED_GRAPH = _pram_grid_click;
        var component_result = $scope.THIS_APP_PAGE_COMPONENTS_LIST.filter(function (x) { return x.COMPONENT_ID == 93 });
        if (component_result.length > 0) {
            var component = component_result[0];
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
            _pi_input_model_obj.NAME = _pram_grid_click == undefined ? "" : _pram_grid_click.Val1;
            _pi_input_model_obj.NAME_TYPE = _pram_grid_click == undefined ? "" : _pram_grid_click.Val15;
            ///--1 FOR HEADER,2 FOR SUBHEADER AND 3 FOR DISPLAY NAME 4 FOR NET REVENUE 5 FOR GP
            PrcCommMethods.DASHBOARD_MODULES_API(_pi_input_model_obj, 'GETDATAFORCHART', 'POWERINSIGHTAPI').then(function (data) {
                $scope.CardLineData = [];
                if (data.data != null) {
                    $scope.SetDisplayObjects(data.data, component.COMPONENT_TYPE_ID);
                }
            });
        }
    }

    $scope.RESET_FILTER = function () {
        angular.forEach($scope.SITE_LIST, function (site) { site.IS_CHECK = true; site.IS_APPLAY_CHECK = true; });
        $scope.Fn_Fill_ENTITY_BRANCH_LIST();
        $scope.RESET_SITES_Fn();
        $scope.SELCTED_SITE();
        $scope.CURRENCY_Fn($scope.CURRENCY_LIST[0]);
        $scope.Fn_CHANGE_FILTER("Reset");
        window.scrollTo(0, 0);
    };
    $scope.RESET_SITES_Fn = function () {
        $scope.IS_ALL_SITE_CHECK = false;
        $scope.SITE_All_Fn();
    }

    $scope.SELCTED_SITE = function () {
        var resultlength = ($scope.$parent.SITE_LIST.filter(function (x) { x.IS_APPLAY_CHECK = x.IS_CHECK; return x.IS_CHECK }));
        $scope.Input_Model.DISPLAY_TEXT_SITE = resultlength.length + " Site Selected";
    }
    $scope.CONTROLLER_LOAD = function () {
        $scope.GET_UTC_TIME(3);
    }
    if ($scope.$parent.PI_INDEX_JS_LOAD == 2) {
        // $scope.$parent.$parent.overlay_loadingNew = 'block';
        $scope.CONTROLLER_LOAD();
    };
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
        $scope.GetChartData(1);
    };
    if ($scope.$parent.PI_INDEX_JS_LOAD == 2) {
        // $scope.$parent.$parent.overlay_loadingNew = 'block';
        $scope.CONTROLLER_LOAD();
    };

    //Net_Sales_Chart
    var options = {
        series: [{
            name: 'Budget',
            type: 'line',
            data: [10, 13, 15, 20, 15, 12, 13, 10, 20, 12, 15, 18, 15, 20, 15, 21]
        }, {
            name: 'CY',
            type: 'area',
            data: [15, 18, 10, 20, 15, 11, 15, 20, 18, 12, 15, 10, 10, 20, 15, 18]
        }, {
            name: 'LY',
            type: 'line',
            data: [18, 15, 12, 10, 20, 25, 8, 15, 11, 16, 12, 20, 12, 10, 20, 15]
        }],
        chart: {
            zoom: {
                enabled: $scope.APPLY_ZOOM
            },
            toolbar: {
                show: false,
            },
            height: 300,
            type: 'line',
        },

        dataLabels: {
            enabled: false
        },
        colors: ['#66da26', '#2e93fa', '#f8507b'],
        stroke: {
            width: 3,
            curve: "smooth",
        },
        xaxis: {
            type: 'category',
            categories: ['Wk 01', 'Wk 02', 'Wk 03', 'Wk 04', 'Wk 05', 'Wk 06', 'Wk 07', 'Wk 08', 'Wk 09', 'Wk 10', 'Wk 11', 'Wk 12', 'Wk 13', 'Wk 14', 'Wk 15', 'CW'],
        },
        fill: {
            opacity: [0.85, 0.25, 1],
            gradient: {
                inverseColors: false,
                shade: 'light',
                type: "vertical",
                opacityFrom: 0.85,
                opacityTo: 0.55,
                stops: [0, 100, 100, 100]
            }
        },
        tooltip: {
            x: {
                format: 'dd/MM/yy HH:mm'
            },
        },
    };

    // var chart = new ApexCharts(document.querySelector("#Net_Sales_Chart"), options);
    // chart.render();

    // time 
    function startTime() {
        var today = new Date();
        var h = today.getHours();
        var m = today.getMinutes();
        // var s = today.getSeconds();
        var ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12;
        h = h ? h : 12;
        m = checkTime(m);
        // s = checkTime(s);
        document.getElementById('txt').innerHTML =
            h + ":" + m + ' ' + ampm;
        var t = setTimeout(startTime, 500);
    }
    function checkTime(i) {
        if (i < 10) { i = "0" + i };  // add zero in front of numbers < 10
        return i;
    }
    /*Line chart*/
    $scope.$parent.PI_child_scope = $scope;

});