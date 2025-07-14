app.controller('PI_Staff_SummaryController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $localStorage) {
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(2);
    $scope.$parent.CURRENT_PATH = window.location.hash;
    $scope.$parent.overlay_loading_powerInsight = 'none';
    $scope.Input_Model = {
        GET_PAGE_DATA: true,
        GET_FILTER_DATA: true,
        USER_ID: parseInt($cookies.get("USERID")),
        APP_PAGE_ID: 32,
        DISPLAY_TEXT_SITE: "Select Sites",
        ENTITY_BRANCH_LIST: [],
        WEEK_DATE: new Date(),
        START_DAY_OF_WEEK: 1,
        WEEK_NO: 9,
    }
    $scope.START_DAY_OF_WEEK = 1;
    $scope.LOAD_APP_COMPONENTS = 0;
    $scope.GET_THIS_PAGE_COMPONENTS = function () {
        var _app_page_components_list = JSON.parse($localStorage.APP_PAGE_COMPONENTS_LIST);
        $scope.THIS_APP_PAGE_COMPONENTS_LIST = _app_page_components_list.filter(function (x) { return x.APP_PAGE_ID == $scope.Input_Model.APP_PAGE_ID && x.ACTIVE });
        $scope.LOAD_APP_COMPONENTS = 1;
    }
    var Staffcostpersite;
    $scope.Fn_BIND_CHART = function (CHART_NAME, DATA, CHART_DATA, TYPE) {
        $('#' + CHART_NAME).empty();
        if (Staffcostpersite) {
            Staffcostpersite.destroy();
        }
        var oldDiv = angular.element(document.getElementById("Headcount_Chart_2"));
        oldDiv.remove();
        var newDiv = angular.element("<div id='Headcount_Chart_2'></div>");
        angular.element(document.getElementById("HEADER_COUNT_MOBILE")).append(newDiv);

        var Staffcostpersiteoptions = {
            series: CHART_DATA.MULTISERIESDATALIST,
            fill: {
                opacity: [1, 0.25],
                gradient: {
                    inverseColors: false,
                    shade: 'light',
                    //  type: "vertical",
                    opacityFrom: 0.85,
                    opacityTo: 0.55,
                    stops: [0, 100, 100, 100]
                }
            },
            chart: {
                height: 290,
                type: 'line',
                stacked: false,
                dropShadow: {
                    enabled: true,
                    enabledOnSeries: undefined,
                    top: -5,
                    left: 0,
                    blur: 4,
                    color: '#888788',
                    opacity: 0.22
                },
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
            },
            plotOptions: {
                bar: {
                    borderRadius: 2,
                    borderRadiusApplication: "end",
                    borderRadiusWhenStacked: "first",
                },
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                width: [1, 1, 3],
                curve: "smooth",
            },
            title: {
                //text: 'XYZ - Stock Analysis (2009 - 2016)',
                align: 'left',
                offsetX: 110
            },
            markers: {
                size: 4,
                strokeColors: ["#EC3C07", "#04B96F", "#1881D0"],
                strokeWidth: 1,
                offsetX: 1,
                hover: {
                    size: 5
                },
                shape: "circle"
            },
            xaxis: {
                categories: CHART_DATA.LABELS,
                // tickAmount: 20,
                labels: {
                    rotate: -45,
                    rotateAlways: true,
                    // trim: true,
                },
                tooltip: {
                    enabled: false
                },
                labels: {
                    trim: true,
                    rotate: -90,
                },
            },
            yaxis: [{
                seriesName: 'Staff Cost',
                showAlways: true,
                show: CHART_DATA.SHOWYAXIS,
                axisTicks: {
                    show: false,
                },
                axisBorder: {
                    show: true,
                    color: '#2e93fa'
                },
                labels: {
                    style: {
                        colors: '#2e93fa',
                    }
                },
                title: {
                    style: {
                        color: '#2e93fa',
                    }
                },
                labels: {
                    show: CHART_DATA.SHOWYAXIS,
                    formatter: (val) => {
                        return val < $scope.$parent.K_M_T_VALUE_INIT ? $scope.$parent.NUMBER_WITH_COMMAS(val) : $scope.$parent.NUMBER_WITH_COMMAS(val / 1000) + 'K';
                    }
                }
            }, {
                seriesName: '% of Sales:',
                //logarithmic: true,
                showAlways: true,
                show: CHART_DATA.SHOWY2AXIS,
                opposite: true,
                axisTicks: {
                    show: true,
                },
                axisBorder: {
                    show: true,
                    color: '#f8507b'
                },
                labels: {
                    style: {
                        colors: '#f8507b',
                    },
                    show: CHART_DATA.SHOWY2AXIS,
                    formatter: (val) => {
                        return val < $scope.$parent.K_M_T_VALUE_INIT ? $scope.$parent.NUMBER_WITH_COMMAS(val) : $scope.$parent.NUMBER_WITH_COMMAS(val / 1000) + 'K';
                    }
                },
                title: {
                    style: {
                        color: '#f8507b',
                    }
                },
                tooltip: {
                    enabled: false
                }
            },],
            tooltip: {
                y: {
                    formatter: function (y, index) {
                        if (y == undefined) {
                            return "";
                        }
                        else {
                            return $scope.$parent.NUMBER_WITH_COMMAS(y.toFixed(0));
                        }
                    }
                },
                x: {
                    formatter: function (x, z, m) {
                        //dataPointIndex
                        //seriesIndex
                        sitename = z.w.globals.categoryLabels[z.dataPointIndex];
                        return sitename;
                    }
                },
            },
            legend: {
                horizontalAlign: 'left',
                offsetX: 40,
                fontFamily: 'Rubik, sans-serif',
                fontWeight: 400,
                fontSize: 11,
            },
            colors: CHART_DATA.COLORS
        };
        Staffcostpersite = new ApexCharts(document.querySelector("#" + CHART_NAME), Staffcostpersiteoptions);
        Staffcostpersite.render();
    };
    var StaffCostchart1;
    $scope.Fn_BIND_CHART_2 = function (CHART_NAME, DATA, CHART_DATA, TYPE) {
        $('#' + CHART_NAME).empty();
        //Staff_Cost_per_Site
        if (StaffCostchart1) {
            StaffCostchart1.destroy();
        }
        var oldDiv = angular.element(document.getElementById("Staff_Cost_per_Site"));
        oldDiv.remove();
        var newDiv = angular.element("<div id='Staff_Cost_per_Site'></div>");
        angular.element(document.getElementById("Staff_Cost_per_Site_DIV")).append(newDiv);

        var StaffCostoptions = {
            series: CHART_DATA.MULTISERIESDATALIST,
            chart: {
                height: 300,
                type: 'line',
                stacked: false,
                dropShadow: {
                    enabled: true,
                    enabledOnSeries: undefined,
                    top: -5,
                    left: 0,
                    blur: 4,
                    color: '#888788',
                    opacity: 0.22
                },
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
            },
            plotOptions: {
                bar: {
                    borderRadius: 2,
                    borderRadiusApplication: "end",
                    borderRadiusWhenStacked: "first",
                },
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                width: [1, 1, 3],
                curve: "smooth",
            },
            title: {
                //text: 'XYZ - Stock Analysis (2009 - 2016)',
                align: 'left',
                offsetX: 110
            },
            xaxis: {
                categories: CHART_DATA.LABELS,
                tickAmount: 13,
                labels: {
                    rotate: -45,
                    rotateAlways: true,
                },
                tooltip: {
                    enabled: false
                }
            },
            yaxis: [{
                seriesName: ['Sales', 'Staff Cost'],
                show: CHART_DATA.SHOWYAXIS,
                showAlways: true,
                axisTicks: {
                    show: false,
                },
                axisBorder: {
                    show: true,
                    color: '#00E396'
                },
                labels: {
                    style: {
                        colors: '#00E396',
                    },
                    formatter: (val) => {
                        return val < $scope.$parent.K_M_T_VALUE_INIT ? $scope.$parent.NUMBER_WITH_COMMAS(val) : $scope.$parent.NUMBER_WITH_COMMAS(val / 1000) + 'K';
                    }
                },
                title: {
                    //text: "Operating Cashflow (thousand crores)",
                    style: {
                        color: '#00E396',
                    }
                },
            },
            {
                seriesName: 'Head Count',
                //logarithmic: true,
                show: CHART_DATA.SHOWY2AXIS,
                showAlways: true,
                opposite: true,
                axisTicks: {
                    show: true,
                },
                axisBorder: {
                    show: true,
                    color: '#fdba3e'
                },
                labels: {
                    style: {
                        colors: '#fdba3e',
                    }
                },
                title: {
                    style: {
                        color: '#008FFB',
                    }
                },
                tooltip: {
                    enabled: false
                }
            },],
            tooltip: {
                y: {
                    formatter: function (y) {
                        if (y == undefined) {
                            return "";
                        }
                        else {
                            return $scope.$parent.NUMBER_WITH_COMMAS(y.toFixed(0));
                        }
                    }
                },
                x: {
                    formatter: function (x, z, m) {
                        return z.w.globals.categoryLabels[z.dataPointIndex];
                    },
                },
            },
            legend: {
                horizontalAlign: 'center',
                offsetX: 40,
                fontFamily: 'Rubik, sans-serif',
                fontWeight: 400,
            },
            colors: CHART_DATA.COLORS
        };
        StaffCostchart1 = new ApexCharts(document.querySelector("#" + CHART_NAME), StaffCostoptions);
        StaffCostchart1.render();
    };

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
            case 97: //Staff Cost Trend
                $scope.Display_Model.STAFF_COST_TREND = data;
                $scope.Fn_BIND_CHART_2("Staff_Cost_per_Site", data, data, "string");
                break;
            case 96:
                $scope.Display_Model.EMPLOYEE_COUNT = data;
                break;
            case 98:
                $scope.Fn_BIND_CHART("Headcount_Chart_2", data, data, "string");
                break;
            case 99:
                $scope.Display_Model.HEADER_DETAILS_LIST = data.DATAGRID_VALUES;
                break;
        }
    }

    //$scope.GET_THIS_PAGE_COMPONENTS();

    $scope.CHANGE_FILTER_Fn = function () {
        $scope.GetChartData();
    };

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

    $scope.RESET_SITES_Fn = function () {
        $scope.IS_ALL_SITE_CHECK = false;
        $scope.SITE_All_Fn();
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

    $scope.RESET_FILTER = function () {
        angular.forEach($scope.SITE_LIST, function (site) {
            site.IS_CHECK = true;
        });
        $scope.SELCTED_SITE();
        $scope.Fn_Fill_ENTITY_BRANCH_LIST();
        $scope.CURRENCY_Fn($scope.CURRENCY_LIST[0]);
        $scope.Fn_CHANGE_FILTER("Reset");
        window.scrollTo(0, 0);
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
        $scope.Fn_CHANGE_FILTER("CurrencyChange");
    };
    $scope.RESET_COVERS_FILTER = function () {
        $scope.IS_ALL_SITE_CHECK = false;
        $scope.SITE_All_Fn();
        $scope.CURRENCY_Fn($scope.CURRENCY_LIST[0]);
        $scope.CHANGE_FILTER_Fn(1)
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
        $scope.GetChartData(1);
    };
    if ($scope.$parent.PI_INDEX_JS_LOAD == 2) {
        // $scope.$parent.$parent.overlay_loadingNew = 'block';
        $scope.CONTROLLER_LOAD();
    };
    $scope.$parent.PI_child_scope = $scope;
});