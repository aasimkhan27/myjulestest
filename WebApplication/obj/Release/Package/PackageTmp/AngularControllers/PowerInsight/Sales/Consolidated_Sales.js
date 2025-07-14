app.controller('PI_Consolidated_SalesController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $localStorage) {
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(2);
    $scope.$parent.CURRENT_PATH = window.location.hash;
    $scope.$parent.overlay_loading_powerInsight = 'none';
    $scope.Input_Model = {
        GET_PAGE_DATA: true,
        GET_FILTER_DATA: true,
        USER_ID: parseInt($cookies.get("USERID")),
        APP_PAGE_ID: 23,
        DISPLAY_TEXT_SITE: "Select Sites",
        ENTITY_BRANCH_LIST: [],
        START_DAY_OF_WEEK: 1,
        WEEK_NO: 9,
        //START_DATE: new Date(),
        //END_DATE: new Date(),
        DISPLAY_START_DATE: new Date().setDate(new Date().getDate() - 1),
        START_DATE: new Date().setDate(new Date().getDate() - 1),
        END_DATE: new Date().setDate(new Date().getDate() - 1),
        SELECTED_DATE: new Date(),
        WEEK_DATE: new Date(),
        MONTH_TO_DATE: new Date(),
        YEAR_TO_DATE: new Date()
    }
    $scope.Fn_CHANGE_FILTER = function () {
        if ($scope.$parent.PI_INDEX_JS_LOAD == 2) {
            //  $scope.$parent.$parent.overlay_loadingNew = 'block';
        }
        // $scope.GetChartData("onchange");
        $scope.Fn_VIEW_ONLOAD_DATA("onchange", 1);
    };
    $scope.CREATE_DATES = function (SELECTED_DATE) {
        if ($scope.$parent.START_DAY_OF_WEEK != null) {
            if (new Date(SELECTED_DATE).getDay() == $scope.$parent.START_DAY_OF_WEEK) {
                $scope.Input_Model.SELECTED_DATE = new Date(SELECTED_DATE);
                $scope.Input_Model.END_DATE = new Date(new Date($scope.Input_Model.SELECTED_DATE).setDate(new Date($scope.Input_Model.SELECTED_DATE).getDate() + (6)));
            }
            else {
                var lastWeek = new Date(new Date(SELECTED_DATE).getFullYear(), new Date(SELECTED_DATE).getMonth(), new Date(SELECTED_DATE).getDate() - 7);
                //
                var lastWeek_Date;
                var incriment_Day = new Date(lastWeek);
                for (var i = 0; i <= 7; i++) {
                    if (new Date(incriment_Day).getDay() == $scope.$parent.START_DAY_OF_WEEK) {
                        lastWeek_Date = new Date(incriment_Day);
                        break;
                    }
                    else {
                        incriment_Day = new Date(lastWeek).setDate(new Date(lastWeek).getDate() + i);
                        incriment_Day = new Date(incriment_Day);
                    }
                }
                $scope.Input_Model.SELECTED_DATE = new Date(lastWeek_Date);
                $scope.Input_Model.END_DATE = new Date(new Date(lastWeek_Date).setDate(new Date(lastWeek_Date).getDate() + (6)));
            }
        }
        if ($scope.$parent.START_DAY_OF_WEEK == null) {
            if (new Date(SELECTED_DATE).getDay() == 0) {
                $scope.Input_Model.SELECTED_DATE = new Date(SELECTED_DATE);
                $scope.Input_Model.END_DATE = new Date(new Date(SELECTED_DATE).setDate(new Date(SELECTED_DATE).getDate() + (6)));
            }
            else {
                var lastWeek = new Date(new Date(SELECTED_DATE).getFullYear(), new Date(SELECTED_DATE).getMonth(), new Date(SELECTED_DATE).getDate() - 7);
                var lastWeek_Date;
                var incriment_Day = new Date(lastWeek);
                for (var i = 0; i < 7; i++) {
                    if (new Date(incriment_Day).getDay() == 0) {
                        lastWeek_Date = new Date(incriment_Day);
                        break;
                    }
                    else {
                        incriment_Day = new Date(lastWeek).setDate(new Date(lastWeek).getDate() + i);
                        incriment_Day = new Date(incriment_Day);
                    }
                }
                $scope.Input_Model.SELECTED_DATE = new Date(incriment_Day);
                $scope.Input_Model.WEEK_DATE = new Date(new Date(incriment_Day).setDate(new Date(incriment_Day).getDate() + (6)));
            }
        }
        $scope.Input_Model.MONTH_TO_DATE = new Date($scope.Input_Model.WEEK_DATE.getFullYear(), $scope.Input_Model.WEEK_DATE.getMonth(), 1);
        $scope.Input_Model.YEAR_TO_DATE = new Date($scope.Input_Model.WEEK_DATE.getFullYear(), 0, 1);

    };
    $scope.AREA_LINE_CHART = function (CHART_NAME, DATA, HEADER_DATA, TYPE) {
        $('#' + CHART_NAME).empty();
        // Sales_Trend_Spline
        var optionsproductchart = {
            chart: {
                height: 250,
                fontFamily: 'Rubik, sans-serif',
                type: "area",
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
                show: DATA.ShowAxis,
                axisTicks: {
                    show: false,
                },
                axisBorder: {
                    color: "rgba(196,196,196, 0.3)",
                },
            },
            yaxis: [{
                show: DATA.ShowYAxis,
                labels: {
                    show: DATA.ShowYAxis,
                    formatter: (val) => {
                        return val < $scope.$parent.K_M_T_VALUE_INIT ? $scope.$parent.NUMBER_WITH_COMMAS(val) : $scope.$parent.NUMBER_WITH_COMMAS(val / 1000) + 'K';
                    }
                }
            },
            {
                show: DATA.SHOWY2AXIS,
                opposite: true,
                labels: {
                    show: DATA.ShowYAxis,
                    formatter: (val) => {
                        return val < $scope.$parent.K_M_T_VALUE_INIT ? $scope.$parent.NUMBER_WITH_COMMAS(val) : $scope.$parent.NUMBER_WITH_COMMAS(val / 1000) + 'K';
                    }
                }
            }],
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
            legend: {
                showForSingleSeries: true,
                showForNullSeries: true,
                showForZeroSeries: true,
                show: true,
                position: "bottom",
                horizontalAlign: "center",
                fontFamily: "Rubik, sans-serif",
                fontSize: "12px",
            },
        };
        var chartproductchart = new ApexCharts(document.querySelector("#" + CHART_NAME), optionsproductchart);
        chartproductchart.render();
    }
    $scope.SITE_SALES_MIX = function (CHART_NAME, DATA, HEADER_DATA, TYPE) {
        $('#' + CHART_NAME).empty();
        var optionsSalesMixChart = {
            series: DATA.LineSeriesList,
            chart: {
                type: 'bar',
                height: 250,
                stacked: true,
               stackType: '100%',
                dropShadow: {
                    enabled: true,
                    enabledOnSeries: undefined,
                    top: 5,
                    left: 0,
                    blur: 4,
                    color: '#7366ff',
                    opacity: 0.22
                },
                zoom: {
                    enabled: $scope.APPLY_ZOOM
                },
                toolbar: {
                    show: false,
                },
            },
            plotOptions: {
                bar: {
                    horizontal: true,
                    dataLabels: {
                        total: {
                            enabled: true,
                            offsetX: 0,
                            style: {
                                fontSize: '13px',
                                fontWeight: 900
                            }
                        }
                    }
                },
                bar: {
                    borderRadius: 5,
                    borderRadiusApplication: "end",
                    borderRadiusWhenStacked: "last",
                    horizontal: true,
                    columnWidth: "50%",
                    barHeight: '50%',
                    dataLabels: {
                        position: 'center',
                        show: false,
                    }
                },
            },
            dataLabels: {
                enabled: true,  
                formatter: function (val, opts) {
                    let percent = opts.w.globals.seriesPercent[opts.seriesIndex][opts.dataPointIndex];
                    return percent.toFixed(0) + '%'

                   // return val.toFixed(0) + "%";
                  //  return w.config.series[seriesIndex]
                },
                offsetY: 0,
                style: {
                    fontSize: '12px',
                    colors: ["#fff"]
                }
            },
            stroke: {
                width: 1,
                colors: ['#fff']
            },
            // title: {
            //   text: 'Fiction Books Sales'
            // },

            xaxis: {
                show: DATA.ShowXAxis,
                categories: DATA.LABELS,
                labels: {
                    show: false,
                },
                axisBorder: {
                    show: false
                },
                axisTicks: {
                    show: true
                }
            },
            yaxis: {
                show: DATA.ShowYAxis,
                title: {
                    text: undefined
                },
            },
            tooltip: {
                y: {
                    //formatter: function (val) {
                    //    return $scope.$parent.NUMBER_WITH_COMMAS(val);
                    //}
                    formatter: function (value, opts) {
                        // const sum = opts.series[0].reduce((a, b) => a + b, 0);
                        // const percent = (value / sum) * 100;
                        // return percent.toFixed(0) + '%';
                        return $scope.$parent.NUMBER_WITH_COMMAS(value.toFixed(0)) + '' + "\n\n" + '(' + ((opts.w.globals.initialSeries[opts.seriesIndex].DISPLAY_DATA[opts.dataPointIndex])) + ') '
                    },
                },
                fixed: {
                    enabled: true,
                    position: 'topRight',
                    offsetX: 0,
                    offsetY: 0,
                },
            },
            colors: DATA.Color,
            fill: {
                opacity: 1
            },
            legend: {
                showForSingleSeries: true,
                showForNullSeries: true,
                showForZeroSeries: true,
                show: true,
                position: "bottom",
                horizontalAlign: "center",
                fontFamily: "Rubik, sans-serif",
                fontSize: "12px",
            },
            grid: {
                yaxis: {
                    lines: {
                        show: false
                    }
                },
            },
        };

        var chart = new ApexCharts(document.querySelector('#' + CHART_NAME), optionsSalesMixChart);
        chart.render();
    };
    $scope.YTD_SITE_SALES_MIX = function (CHART_NAME, DATA, HEADER_DATA, TYPE) {
        $('#' + CHART_NAME).empty();
        var optionsSiteYTDSalesMixchart = {
            series: DATA.LineSeriesList,
            chart: {
                height: 250,
                type: 'radar',
                dropShadow: {
                    enabled: true,
                    enabledOnSeries: undefined,
                    top: 5,
                    left: 0,
                    blur: 4,
                    color: '#7366ff',
                    opacity: 0.22
                },
                zoom: {
                    enabled: $scope.APPLY_ZOOM
                },
                toolbar: {
                    show: false,
                },
            },
            colors: DATA.Color,
            stroke: {
                width: 2
            },
            fill: {
                opacity: 0.1
            },
            markers: {
                size: 5,
                hover: {
                    size: undefined,
                    sizeOffset: 3
                }
            },
            xaxis: {
                show: DATA.ShowXAxis,
                labels: {
                    show: DATA.ShowXAxis,
                },
                tickAmount: 12,
                categories: DATA.LABELS,
            },
            yaxis: {
                show: DATA.ShowYAxis,
                labels: {
                    show: DATA.ShowYAxis,
                },
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return $scope.$parent.NUMBER_WITH_COMMAS(val);
                    }
                }
            },
            legend: {
                showForSingleSeries: true,
                showForNullSeries: true,
                showForZeroSeries: true,
                show: true,
                position: "bottom",
                horizontalAlign: "center",
                fontFamily: "Rubik, sans-serif",
                fontSize: "12px",
            },
        };

        var chart = new ApexCharts(document.querySelector('#' + CHART_NAME), optionsSiteYTDSalesMixchart);
        chart.render();
    };
    $scope.LOAD_APP_COMPONENTS = 0;
    $scope.GET_THIS_PAGE_COMPONENTS = function () {
        var _app_page_components_list = JSON.parse($localStorage.APP_PAGE_COMPONENTS_LIST);
        $scope.THIS_APP_PAGE_COMPONENTS_LIST = _app_page_components_list.filter(function (x) { return x.APP_PAGE_ID == $scope.Input_Model.APP_PAGE_ID && x.ACTIVE });
        $scope.LOAD_APP_COMPONENTS = 1;
    }

    $scope.GetChartData = function () {
        $scope.$parent.$parent.overlay_loading_powerInsight = 'block';
        if ($scope.Input_Model.ENTITY_BRANCH_LIST.length == 0) {
            $scope.Fn_Fill_ENTITY_BRANCH_LIST();
        };
        $scope.CREATE_DATES($scope.Input_Model.START_DATE);
        $scope.$parent.GET_CONVERSION_RATES_BY_BRANCH_FOR_POWER_INSIGHTS($scope.Input_Model.START_DATE,
            $scope.Input_Model.START_DATE, $scope.Input_Model.CURRENCY_ID, $scope.Input_Model.ENTITY_BRANCH_LIST,
            $scope.Input_Model.DISPLAY_TEXT_CURRENCY
        );
        $scope.Display_Model = {};
        angular.forEach($scope.THIS_APP_PAGE_COMPONENTS_LIST, function (component) {
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
            _pi_input_model_obj.DATE = new Date($scope.Input_Model.START_DATE).toDateString();
            //@PI_TYPE                INT, --1 DAY, 2 WTD, 3 MTD, 4 YTD   
            // DAY  SELECTED DATE
            // WTD  WEEK TILL DATE 
            if (component.COMPONENT_ID == 55) {
                _pi_input_model_obj.TYPE_ID = 1;
                _pi_input_model_obj.START_DATE = new Date($scope.Input_Model.START_DATE).toDateString();
                _pi_input_model_obj.END_DATE = new Date($scope.Input_Model.START_DATE).toDateString();
            }
            else if (component.COMPONENT_ID == 56 || component.COMPONENT_ID == 54) {
                _pi_input_model_obj.TYPE_ID = component.COMPONENT_ID == 56 ? 2 : 0;//WTD
                _pi_input_model_obj.START_DATE = new Date($scope.Input_Model.SELECTED_DATE).toDateString();
                _pi_input_model_obj.END_DATE = new Date($scope.Input_Model.START_DATE).toDateString();
            }
            else if (component.COMPONENT_ID == 57) {
                const currentDate = new Date($scope.Input_Model.START_DATE);
                const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                _pi_input_model_obj.TYPE_ID = 3;//MTD
                _pi_input_model_obj.START_DATE = new Date(startOfMonth).toDateString();
                _pi_input_model_obj.END_DATE = new Date($scope.Input_Model.START_DATE).toDateString();
            }
            else if (component.COMPONENT_ID == 58 || component.COMPONENT_ID == 53 || component.COMPONENT_ID == 52) {
                _pi_input_model_obj.TYPE_ID = component.COMPONENT_ID == 58 ? 4 : 0; //YTD
                _pi_input_model_obj.START_DATE = new Date($scope.Input_Model.YEAR_TO_DATE).toDateString();
                _pi_input_model_obj.END_DATE = new Date($scope.Input_Model.START_DATE).toDateString();

            }
            else {
                _pi_input_model_obj.START_DATE = new Date($scope.Input_Model.START_DATE).toDateString();
                _pi_input_model_obj.END_DATE = new Date($scope.Input_Model.START_DATE).toDateString();
            }
            _pi_input_model_obj.ENTITY_BRANCH_LIST = $scope.Input_Model.ENTITY_BRANCH_LIST;

            PrcCommMethods.DASHBOARD_MODULES_API(_pi_input_model_obj, 'GETDATAFORCHART', 'POWERINSIGHTAPI').then(function (data) {
                // $scope.$parent.overlay_loading_powerInsight = 'none';
                $scope.CardLineData = [];
                if (data.data != null) {
                    $scope.SetDisplayObjects(data.data);
                    //if ($scope.THIS_APP_PAGE_COMPONENTS_LIST.length - 1 == index && $scope.$parent.PI_INDEX_JS_LOAD == 2) {
                    //    // $scope.$parent.$parent.overlay_loadingNew = 'none';
                    //}
                }
            });
        });
        $scope.$parent.GET_CONVERSION_RATES_BY_BRANCH_FOR_POWER_INSIGHTS($scope.Input_Model.START_DATE,
            $scope.Input_Model.END_DATE, $scope.Input_Model.CURRENCY_ID, $scope.Input_Model.ENTITY_BRANCH_LIST,
            $scope.Input_Model.DISPLAY_TEXT_CURRENCY
        );
        if ($scope.$parent.PI_INDEX_JS_LOAD == 1) {
            $scope.$parent.PI_INDEX_JS_LOAD = 2;
        };
    }
    $scope.SetDisplayObjects = function (data) {
        switch (data.COMPONENT_TYPE_ID) {
            case 52:
                $scope.SITE_SALES_MIX("Sales_Mix_Chart", data, data, "string");
                //$scope.Display_Model.Annual_Sales_Card_C06 = data;
                //$scope.LINE_CHART("AnnualSalesgrowthchart", data.Line_DataSet, data, "string");
                break;
            case 53:
                //$scope.Display_Model.Covers_Card_C07 = data;
                $scope.YTD_SITE_SALES_MIX("YTD_Sales_Mix_Chart", data, data, "string");
                break;
            case 54:
                $scope.AREA_LINE_CHART("Covers_Spend_Consolidated", data, data, "string");
                //$scope.LINE_BAR_CHAT("WeeklySpendchart", data, data, "string");
                break;
            case 55:
                $scope.Display_Model.Consolidated_Date_C55_List = data.ConsolidatedData_List;
                //$scope.GROUP_BAR_CHART("SalesByCategorychart", data, data, "string");
                break;
            case 56:
                $scope.Display_Model.Consolidated_Wtd_C56_List = data.ConsolidatedData_List;
                // $scope.LINE_CHART("COGSchart", data.Line_DataSet, data, "string");
                break;
            case 57:
                $scope.Display_Model.Consolidated_Mtd_C57_List = data.ConsolidatedData_List;
                //$scope.LINE_CHART("Staffchart", data.Line_DataSet, data, "string");
                break;
            case 58:
                $scope.Display_Model.Consolidated_Ytd_C58_List = data.ConsolidatedData_List;
                ///$scope.LINE_CHART("Profitabilitychart", data.Line_DataSet, data, "string");
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
        $scope.Fn_VIEW_ONLOAD_DATA();
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
        $scope.Fn_VIEW_ONLOAD_DATA();
    };
  
    $scope.dateinputConsolidated_Sales = function (LL) {
        $(document).ready(function () {
            var date_inputs = document.getElementsByClassName("DateInputLoadEndDate") //our date input has the name "date"
            $(function () {
                $('[data-toggle="tooltip"]').tooltip();
                $('[data-toggle="popover"]').popover();
            });
            if (date_inputs.length > 0) {
                for (var i = 0; i < date_inputs.length; i++) {
                    var date_input = $('input[name="' + date_inputs[i].name + '"]'); //our date input has the name "date"
                    var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
                    var Cdate = new Date();
                    var options = {
                        todayBtn: "linked",
                        //daysOfWeekHighlighted: "0,6",
                         weekStart:1,
                        autoclose: true,
                        todayHighlight: true,
                        format: 'dd/MM/yyyy',
                        clearBtn: false,
                        todayBtn: false,
                        calendarWeeks: true,
                        closeBtn: true,// close button visible
                        endDate: new Date(Cdate.getFullYear(), Cdate.getMonth(), Cdate.getDate())
                    };
                    date_input.datepicker(options).on("hide", function (e) {
                        if (e != undefined) {
                            $scope.Input_Model.START_DATE = $filter('date')(new Date(e.date));
                            $scope.Input_Model.DISPLAY_START_DATE = $filter('date')(new Date(e.date), 'dd/MM/yyyy');
                            console.log($scope.Input_Model.START_DATE);
                            $scope.Fn_CHANGE_FILTER();
                        }
                    });
                }
            }
        });
    }

    $scope.Input_Model.DISPLAY_START_DATE = $filter('date')(new Date($scope.Input_Model.START_DATE),'dd/MM/yyyy');
    

    $scope.dateinputConsolidated_Sales($scope.Input_Model);
    $scope.$parent.PI_child_scope = $scope;



});