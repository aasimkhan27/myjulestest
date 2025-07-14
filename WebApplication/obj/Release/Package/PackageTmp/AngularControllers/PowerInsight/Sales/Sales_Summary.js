app.controller('PI_Sales_SummaryController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $localStorage) {
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(2);
    $scope.$parent.CURRENT_PATH = window.location.hash;
    $scope.THIS_APP_PAGE_COMPONENTS_LIST = [];
    $scope.Input_Model = {
        GET_PAGE_DATA: true,
        GET_FILTER_DATA: true,
        USER_ID: parseInt($cookies.get("USERID")),
        APP_PAGE_ID: 19,
        DISPLAY_TEXT_SITE: "Select Sites",
        ENTITY_BRANCH_LIST: [],
        WEEK_DATE: new Date(),
        START_DAY_OF_WEEK: 1,
        IS_GROSS_NET: true,
    }
    $scope.LOAD_APP_COMPONENTS = 0;
    $scope.GET_THIS_PAGE_COMPONENTS = function () {
        var _app_page_components_list = JSON.parse($localStorage.APP_PAGE_COMPONENTS_LIST);
        $scope.THIS_APP_PAGE_COMPONENTS_LIST = _app_page_components_list.filter(function (x) { return x.APP_PAGE_ID == $scope.Input_Model.APP_PAGE_ID });
        $scope.LOAD_APP_COMPONENTS = 1;
    }

    var chartproductchart;
    var LineChart;

    $scope.LINE_CHART = function (CHART_NAME, DATA, HEADER_DATA, TYPE) {
        //AnnualSalesgrowthchart
        // growth chart
        $('#' + CHART_NAME).empty();
        if (LineChart) {
            LineChart.destroy();
        }
        // covers Spend
        var LineChartoptions = {
            series: DATA.LineSeriesList,
            chart: {
                height: 250,
                type: 'line',
                fontFamily: 'Rubik, sans-serif',
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
                zoom: {
                    enabled: $scope.APPLY_ZOOM
                },
                dropShadow: {
                    enabled: true,
                    enabledOnSeries: undefined,
                    top: 5,
                    left: 0,
                    blur: 4,
                    color: '#7366ff',
                    opacity: 0.22
                },
            },
            grid: {
                yaxis: {
                    lines: {
                        show: true
                    }
                },
            },
            colors: DATA.Color,
            stroke: {
                width: 3,
                curve: 'smooth'
            },
            xaxis: {
                show: DATA.ShowXAxis,
                type: 'category',
                categories: DATA.LABELS,
                tickAmount: 10,
                labels: {
                    style: {
                        fontFamily: 'Rubik, sans-serif',
                    },
                },
                axisTicks: {
                    show: false
                },
                axisBorder: {
                    show: false
                },
                tooltip: {
                    enabled: false,
                },
            },
            fill: {
                type: 'solid',
                gradient: {
                    shade: 'dark',
                    gradientToColors: ['#5527FF'],
                    shadeIntensity: 1,
                    type: 'horizontal',
                    opacityFrom: 1,
                    opacityTo: 1,
                    colorStops: [
                        {
                            offset: 0,
                            color: "#5527FF",
                            opacity: 1
                        },
                        {
                            offset: 100,
                            color: "#E069AE",
                            opacity: 1
                        },
                    ]
                    // stops: [0, 100, 100, 100]
                },
            },

            yaxis: [{
                seriesName: ['Covers', 'LY Covers'],
                show: DATA.ShowYAxis,
                showAlways: true,
                min: 0,

                // max: 28,
                labels: {
                    show: DATA.ShowYAxis,
                    formatter: (val) => {
                        return val < $scope.$parent.K_M_T_VALUE_INIT ? $scope.$parent.NUMBER_WITH_COMMAS(val) : $scope.$parent.NUMBER_WITH_COMMAS(val / 1000) + 'K';
                    }
                }
            }, {
                seriesName: ['SPH'],
                min: 0,
                opposite: true,
                labels: {
                    show: DATA.ShowYAxis,
                    formatter: (val) => {
                        return val < $scope.$parent.K_M_T_VALUE_INIT ? $scope.$parent.NUMBER_WITH_COMMAS(val) : $scope.$parent.NUMBER_WITH_COMMAS(val / 1000) + 'K';
                    }
                },
                title: {
                    text: ''
                }
            },], tooltip: {
                y: {
                    formatter: function (val) {
                        return $scope.$parent.NUMBER_WITH_COMMAS(val);
                    }
                }
            }
        };

         LineChart = new ApexCharts(document.querySelector("#" + CHART_NAME), LineChartoptions);
        LineChart.render();
    };
 
    $scope.AREA_LINE_CHART = function (CHART_NAME, DATA, HEADER_DATA, TYPE) {
        $('#' + CHART_NAME).empty();
        if (chartproductchart) {
            chartproductchart.destroy();
        }
        // Sales_Trend_Spline
        var optionsproductchart = {
            chart: {
                height: 250,
                fontFamily: 'Rubik, sans-serif',
                type: "area",
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
                zoom: {
                    enabled: $scope.APPLY_ZOOM
                },
            },
            stroke: {
                curve: "smooth",
                width: 0,
            },
            series: DATA.LineSeriesList,
            fill: {
                // colors: [CubaAdminConfig.primary, CubaAdminConfig.secondary],
                //colors: ['#66da26', '#2e93fa', '#f8507b', '#546e7a'],
                type: "gradient",
                gradient: {
                    shade: "light",
                    type: "vertical",
                    shadeIntensity: 0.4,
                    inverseColors: false,
                    opacityFrom: 0.9,
                    opacityTo: 0.8,
                    stops: [0, 100],
                },
            },
            dataLabels: {
                enabled: false,
            },
            grid: {
                borderColor: "rgba(196,196,196, 0.3)",
                padding: {
                    top: 0,
                    bottom: 10,
                    right: 0,
                },
            },
            //colors: [CubaAdminConfig.primary, CubaAdminConfig.secondary],
            colors: DATA.Color,
            labels: DATA.LABELS,
            markers: {
                size: 0,
            },
            xaxis: {
                show: DATA.ShowXAxis,
                axisTicks: {
                    show: false,
                },
                axisBorder: {
                    color: "rgba(196,196,196, 0.3)",
                },
                labels: {
                    show: DATA.ShowXAxis,
                    //formatter: (val) => {
                    //    return val < $scope.$parent.K_M_T_VALUE_INIT ? $scope.$parent.NUMBER_WITH_COMMAS(val) : $scope.$parent.NUMBER_WITH_COMMAS(val / 1000) + 'K';
                    //}
                }
            },
            yaxis: [{
                title: {
                    text: "",
                },
                labels: {
                    show: DATA.ShowYAxis,
                    formatter: (val) => {
                        return val < $scope.$parent.K_M_T_VALUE_INIT ? $scope.$parent.NUMBER_WITH_COMMAS(val) : $scope.$parent.NUMBER_WITH_COMMAS(val / 1000) + 'K';
                    }
                }
            },
            ],
            tooltip: {
                shared: true,
                intersect: false,
                y: {
                    formatter: function (y) {
                        if (typeof y !== "undefined") {
                            return $scope.$parent.NUMBER_WITH_COMMAS(y.toFixed(0)) + "";
                        }
                        return y;
                    },
                },
            },
        };
         chartproductchart = new ApexCharts(document.querySelector("#" + CHART_NAME), optionsproductchart);
        chartproductchart.render();
    }
    $scope.BAR_CHART = function (CHART_NAME, DATA, HEADER_DATA, TYPE) {
        // Category_Breakdown
        $('#' + CHART_NAME).empty();
        var optionsvisitor = {
            series: DATA.LineSeriesList,
            chart: {
                type: "bar",
                height: 250,
                toolbar: {
                    show: false,
                },
                zoom: {
                    enabled: $scope.APPLY_ZOOM
                },
                dropShadow: {
                    enabled: true,
                    enabledOnSeries: undefined,
                    top: 5,
                    left: 0,
                    blur: 4,
                    color: '#c8c8c8',
                    opacity: 0.30
                },
            },
            plotOptions: {
                bar: {
                    borderRadius: 3,
                    borderRadiusApplication: "end",
                    borderRadiusWhenStacked: "last",
                    horizontal: true,
                    columnWidth: "50%",
                    dataLabels: {
                        //position: 'top'
                    },
                },

            },
            dataLabels: {
                formatter: (val) => {
                    return val + '%'
                },
                enabled: true,
                offsetX: 10,
                //textAnchor: "start",
                style: {
                    fontSize: '10px',
                    colors: ['#797979'],
                }
            },
            //stroke: {
            //    show: true,
            //    width: 1,
            //    colors: ["transparent"],
            //},
            //grid: {
            //    show: true,
            //    borderColor: "var(--chart-border)",
            //    xaxis: {
            //        lines: {
            //            show: false,
            //        },
            //    },
            //},

            colors: DATA.Color,
            xaxis: {
                categories: DATA.LABELS,
                show: DATA.ShowXAxis,
                tickAmount: 4,
                tickPlacement: "between",
                labels: {
                    show: false,
                    style: {
                        fontFamily: "Rubik, sans-serif",
                    },
                    formatter: (val) => {
                        return $scope.$parent.NUMBER_WITH_COMMAS(val.toFixed(0)) + '%'
                    },
                },
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
            },
            yaxis: [{
                seriesName: undefined,
                show: DATA.ShowYAxis,
                //min: 0,
                //max: 100,
                //tickAmount: 5,
                //tickPlacement: "between",
                labels: {
                    show: true,
                    style: {
                        fontFamily: "Rubik, sans-serif",
                    },
                },

            }],
            tooltip: {
                y: {
                    formatter: function (value, opts) {
                        return '(' + $scope.$parent.NUMBER_WITH_COMMAS(parseFloat(opts.w.globals.initialSeries[opts.seriesIndex].DISPLAY_DATA[opts.dataPointIndex]).toFixed(2)) + ') ' + $scope.$parent.NUMBER_WITH_COMMAS(value.toFixed(0)) + '%'
                    },
                },
            },
        };
        var chartvisitor = new ApexCharts(document.querySelector("#" + CHART_NAME), optionsvisitor);
        chartvisitor.render();
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
            _pi_input_model_obj.IS_GROSS_NET = $scope.Input_Model.IS_GROSS_NET ? 2 : 1;// 1 gross and 2 for net
            PrcCommMethods.DASHBOARD_MODULES_API(_pi_input_model_obj, 'GETDATAFORCHART', 'POWERINSIGHTAPI').then(function (data) {
                // $scope.$parent.overlay_loading_powerInsight = 'none';
                $scope.CardLineData = [];
                if (data.data != null) {
                    $scope.SetDisplayObjects(data.data, component);
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
    $scope.SetDisplayObjects = function (data, component) {
        switch (data.COMPONENT_TYPE_ID) {
            case 23:
                $scope.Display_Model.SALES_TREND_SPLINE_LIST = data;
                $scope.AREA_LINE_CHART("Sales_Trend_Spline", data, data, "string");
                break;
            case 24:
                $scope.Display_Model.COVERSSPEND_LIST = data;
                $scope.LINE_CHART("coversspend", data, data, "string");
                break;
            case 25:
                $scope.Display_Model.CATEGORY_BREAKDOWN_LIST = data;
                $scope.BAR_CHART("Category_Breakdown", data, data, "string");
                break;
            case 91:
                $scope.Display_Model.Card_SalesSummaryList = data.Card_SalesSummaryList;
                break;
            default:
                break;
        }
    }

    $scope.Fn_CHANGE_FILTER = function () {
        if ($scope.$parent.PI_INDEX_JS_LOAD == 2) {
            //  $scope.$parent.$parent.overlay_loadingNew = 'block';
        }
        $scope.GetChartData("onchange");
    };
    $scope.DatelocaleAccountformat = { format: 'DD MMM YYYY' };
    $scope.DatelocaleAccountformatfordisplay = { format: 'DD/MM/YYYY' };
    function reportrange(start, end) {
        $scope.Input_Model.START_DATE = start.format($scope.DatelocaleAccountformat.format);
        $scope.Input_Model.END_DATE = end.format($scope.DatelocaleAccountformat.format);

        $('#reportrange span').html(start.format($scope.DatelocaleAccountformatfordisplay.format) + ' - ' + end.format($scope.DatelocaleAccountformatfordisplay.format));
        $('#reportrangeIpad span').html(start.format($scope.DatelocaleAccountformatfordisplay.format) + ' - ' + end.format($scope.DatelocaleAccountformatfordisplay.format));
        $scope.Fn_CHANGE_FILTER();

    };
    function reportrangeIpad(start, end) {
        $scope.Input_Model.START_DATE = start.format($scope.DatelocaleAccountformat.format);
        $scope.Input_Model.END_DATE = end.format($scope.DatelocaleAccountformat.format);
        $('#reportrange span').html(start.format($scope.DatelocaleAccountformatfordisplay.format) + ' - ' + end.format($scope.DatelocaleAccountformatfordisplay.format));
        $('#reportrangeIpad span').html(start.format($scope.DatelocaleAccountformatfordisplay.format) + ' - ' + end.format($scope.DatelocaleAccountformatfordisplay.format));
        $scope.Fn_CHANGE_FILTER();

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


    $scope.NG_CHANGE_GROSS_NET = function () {
        $scope.GetChartData();
    };

    $scope.CONTROLLER_LOAD = function () {
        data = new Date();
        var start = moment().subtract(6 + data.getDay(), 'days');   //moment().startOf('isoWeek');//moment().subtract(6, 'days');
        var end = moment().subtract(data.getDay(), 'days');   //moment().subtract(0, 'days');
        $scope.Input_Model.START_DATE = start.format($scope.DatelocaleAccountformat.format);
        $scope.Input_Model.END_DATE = end.format($scope.DatelocaleAccountformat.format);
        $scope.$parent.SetUpDateRangeMultiDatePicker('reportrange', start, end, reportrange, 1, "left");
        $scope.$parent.SetUpDateRangeMultiDatePicker('reportrangeIpad', start, end, reportrangeIpad, 1, "left");

        $('#reportrange span').html(start.format($scope.DatelocaleAccountformatfordisplay.format) + ' - ' + end.format($scope.DatelocaleAccountformatfordisplay.format));
        $('#reportrangeIpad span').html(start.format($scope.DatelocaleAccountformatfordisplay.format) + ' - ' + end.format($scope.DatelocaleAccountformatfordisplay.format));
        $scope.Fn_VIEW_ONLOAD_DATA();
    }
    $scope.Fn_VIEW_ONLOAD_DATA = function () {
        if ($scope.$parent.CURRENCY_LIST.length > 0 && $scope.Input_Model.CURRENCY_ID == undefined) {
            var _currency = $scope.$parent.CURRENCY_LIST.filter(function (x) { return x.Key == parseInt($cookies.get("CURRENCY_ID")) });
            if (_currency.length > 0) {
                $scope.Input_Model.CURRENCY_ID = _currency[0].Key;
                $scope.Input_Model.DISPLAY_TEXT_CURRENCY = _currency[0].Value;
            };
            $scope.SELCTED_SITE();
            $scope.GET_THIS_PAGE_COMPONENTS();
            $scope.GetChartData();
        };
    };

    if ($scope.$parent.PI_INDEX_JS_LOAD == 2) {
        // $scope.$parent.$parent.overlay_loadingNew = 'block';
        $scope.CONTROLLER_LOAD();
    };
    $scope.$parent.overlay_loading_powerInsight = 'none';
    $scope.$parent.PI_child_scope = $scope;
});
