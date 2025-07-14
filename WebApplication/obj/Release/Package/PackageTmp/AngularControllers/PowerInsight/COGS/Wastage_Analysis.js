app.controller('PI_Wastage_AnalysisController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $localStorage) {
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(2);
    $scope.$parent.CURRENT_PATH = window.location.hash;
    $scope.$parent.overlay_loading_powerInsight = 'none';
    $scope.THIS_APP_PAGE_COMPONENTS_LIST = [];
    $scope.Input_Model = {
        GET_PAGE_DATA: true,
        GET_FILTER_DATA: true,
        USER_ID: parseInt($cookies.get("USERID")),
        APP_PAGE_ID: 28,
        DISPLAY_TEXT_SITE: "Select Sites",
        ENTITY_BRANCH_LIST: [],
        WEEK_DATE: new Date(),
        START_DAY_OF_WEEK: 1,
        WEEK_NO: 9,
    }
    $scope.LOAD_APP_COMPONENTS = 0;
    $scope.GET_THIS_PAGE_COMPONENTS = function () {
        var _app_page_components_list = JSON.parse($localStorage.APP_PAGE_COMPONENTS_LIST);
        $scope.THIS_APP_PAGE_COMPONENTS_LIST = _app_page_components_list.filter(function (x) { return x.APP_PAGE_ID == $scope.Input_Model.APP_PAGE_ID && x.ACTIVE });
        $scope.LOAD_APP_COMPONENTS = 1;
    }

    $scope.BAR_CHART = function (CHART_NAME, HEADER_DATA, CHART_DATA, TYPE) {
        $('#' + CHART_NAME).empty();
        var _category_options = {
            chart: {
                height: 285,
                type: 'bar',
                fontFamily: "Rubik, sans-serif",
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
                    show: false
                }
            },
            plotOptions: {
                bar: {
                    columnWidth: '45%',
                    borderRadius: 5,
                    borderRadiusApplication: "end",
                    borderRadiusWhenStacked: "first",
                    dataLabels: {
                        position: 'top'
                    },
                },
            },
            dataLabels: {
                formatter: (val) => {
                    return $scope.$parent.NUMBER_WITH_COMMAS(val.toFixed(0))
                },
                enabled: true,
                offsetX: -8,
                offsetY: -16,
                textAnchor: "start",
                style: {
                    fontSize: '10px',
                    colors: ['#797979'],
                }
            },
            series: [
                {
                    name: 'Value',
                    data: CHART_DATA.SERIES
                }
            ],
            xaxis: {
                show: CHART_DATA.SHOWXAXIS,
                categories: CHART_DATA.LABELS,
                labels: {
                    trim: true,
                    rotate: -90,
                }
            },
            yaxis: [{
                show: CHART_DATA.SHOWYAXIS,
                labels: {
                    show: CHART_DATA.SHOWYAXIS,
                    formatter: (val) => {
                        return val < $scope.$parent.K_M_T_VALUE_INIT ? $scope.$parent.NUMBER_WITH_COMMAS(val) : $scope.$parent.NUMBER_WITH_COMMAS(val / 1000) + 'K';
                    }
                },
                axisBorder: {
                    show: false
                },
                axisTicks: {
                    show: false,
                },
            },
            {
                show: CHART_DATA.SHOWY2AXIS,
                opposite: true,
                labels: {
                    show: CHART_DATA.SHOWYAXIS,
                    formatter: (val) => {
                        return val < $scope.$parent.K_M_T_VALUE_INIT ? $scope.$parent.NUMBER_WITH_COMMAS(val) : $scope.$parent.NUMBER_WITH_COMMAS(val / 1000) + 'K';
                    }
                }
            }],
            legend: {
                position: "bottom",
                horizontalAlign: "center",
                fontFamily: "Rubik, sans-serif",
                fontSize: "12px",
                show: false
            },
            colors: CHART_DATA.COLORS,
        }
        var _category = new ApexCharts(document.querySelector("#" + CHART_NAME), _category_options);
        _category.render();
    };

    $scope.GROUP_BAR_CHART = function (CHART_NAME, HEADER_DATA, CHART_DATA, TYPE) {
        $('#' + CHART_NAME).empty();
        var _last_four_options = {
            series: CHART_DATA.SERIESDATALIST,
            chart: {
                type: 'bar',
                height: 350,
                fontFamily: "Rubik, sans-serif",
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
                    show: false
                }
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    endingShape: 'rounded',
                    borderRadius: 3,
                    borderRadiusApplication: "end",
                    borderRadiusWhenStacked: "first",
                },
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent']
            },
            xaxis: {
                categories: CHART_DATA.LABELS,
                labels: {
                    trim: true,
                    rotate: -90,
                }
            },
            yaxis: {
                show: CHART_DATA.SHOWYAXIS,
                labels: {
                    show: CHART_DATA.SHOWYAXIS,
                    formatter: (val) => {
                        return val < $scope.$parent.K_M_T_VALUE_INIT ? $scope.$parent.NUMBER_WITH_COMMAS(val) : $scope.$parent.NUMBER_WITH_COMMAS(val / 1000) + 'K';
                    }
                }
            },
            fill: {
                opacity: 1
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return $scope.$parent.NUMBER_WITH_COMMAS(val.toFixed(0));

                    }
                }
            },
            colors: CHART_DATA.COLORS,
        }
        var _last_four = new ApexCharts(document.querySelector("#" + CHART_NAME), _last_four_options);
        _last_four.render();
    };

    $scope.HEAT_CHART = function (CHART_NAME, HEADER_DATA, CHART_DATA, TYPE) {
        $('#' + CHART_NAME).empty();
        var options = {
            series: [
                {
                    data: CHART_DATA.data,
                }
            ],
            legend: {
                show: false
            },
            dataLabels: {
                enabled: true,
                style: {
                    fontFamily: "Rubik, sans-serif",
                    fontSize: '12px',
                },
                formatter: function (text, op) {
                    return [text, op.value]
                },
                offsetY: -4
            },
            chart: {
                height: 350,
                type: 'treemap',
                zoom: {
                    enabled: $scope.APPLY_ZOOM
                },
                toolbar: {
                    show: false
                }
            },
            colors: CHART_DATA.COLORS,
            title: {
                //text: 'Basic Treemap'
            }
        };
        var chart = new ApexCharts(document.querySelector("#" + CHART_NAME), options);
        chart.render();
    };
    $scope.LINE_BAR_AREA = function (CHART_NAME, DATA, CHART_DATA, TYPE) {
        //Voids
        $('#' + CHART_NAME).empty();
        var options7 = {
            chart: {
                height: 300,
                type: 'line',
                stacked: false,
                dropShadow: {
                    enabled: true,
                    enabledOnSeries: undefined,
                    top: 5,
                    left: 0,
                    blur: 4,
                    color: '#ccc',
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
            stroke: {
                width: [0, 2, 5],
                curve: 'smooth'
            },
            plotOptions: {
                bar: {
                    borderRadius: 3,
                    borderRadiusApplication: "end",
                    borderRadiusWhenStacked: "last",
                    columnWidth: '50%'
                }
            },
            series: CHART_DATA.MULTISERIESDATALIST,
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
            labels: CHART_DATA.LABELS,
            markers: {
                size: 0
            },
            xaxis: {
                show: CHART_DATA.SHOWXAXIS,
                type: 'week'
            },
            yaxis: [{
                show: CHART_DATA.SHOWYAXIS,
                title: {
                    text: '',
                },
                labels: {
                    show: CHART_DATA.SHOWYAXIS,
                    formatter: (val) => {
                        return val < $scope.$parent.K_M_T_VALUE_INIT ? $scope.$parent.NUMBER_WITH_COMMAS(val) : $scope.$parent.NUMBER_WITH_COMMAS(val / 1000) + 'K';
                    }
                },
            }, {
                show: CHART_DATA.SHOWY2AXIS,
                opposite: true,
                title: {
                    text: ''
                }
                , labels: {
                    show: CHART_DATA.SHOWY2AXIS,
                    formatter: (val) => {
                        return val < $scope.$parent.K_M_T_VALUE_INIT ? $scope.$parent.NUMBER_WITH_COMMAS(val) : $scope.$parent.NUMBER_WITH_COMMAS(val / 1000) + 'K';
                    }
                },
            }],
            tooltip: {
                y: {
                    formatter: function (value, opts) {
                        // const sum = opts.series[0].reduce((a, b) => a + b, 0);
                        // const percent = (value / sum) * 100;
                        // return percent.toFixed(0) + '%';
                        //return '(' + $scope.$parent.NUMBER_WITH_COMMAS(parseFloat(opts.w.globals.initialSeries[opts.seriesIndex].DISPLAY_DATA[opts.dataPointIndex]).toFixed(2)) + ') ' + $scope.$parent.NUMBER_WITH_COMMAS(value.toFixed(0)) + '%'
                        //if (opts.seriesIndex == 1) {
                        //    return value + '  (' + ((opts.w.globals.initialSeries[opts.seriesIndex].DISPLAY_DATA[opts.dataPointIndex])) + ') ';
                        //}
                        return $scope.$parent.NUMBER_WITH_COMMAS(value)
                    },
                }, x: {
                    formatter: function (value, opts) {
                        //if (opts.seriesIndex == 1) {
                        //    return CHART_DATA.LABELS[opts.dataPointIndex] +   ' (' + ((opts.w.globals.initialSeries[opts.seriesIndex].DISPLAY_DATA[opts.dataPointIndex])) + ') ';
                        //}
                        return CHART_DATA.LABELS[opts.dataPointIndex] + ', Net Sales: ' + ((opts.w.globals.initialSeries[1].DISPLAY_DATA[opts.dataPointIndex])) + '';
                    },
                }
            },
            legend: {
                labels: {
                    useSeriesColors: true
                },
            },
            colors: CHART_DATA.COLORS,
        }
        var chart7 = new ApexCharts(document.querySelector("#" + CHART_NAME), options7);
        chart7.render();
        $scope.$parent.EQUALIZER();
    }

    $scope.Fn_BIND_CHART = function (CHART_NAME, DATA, CHART_DATA, TYPE) {
        $('#' + CHART_NAME).empty();
        var ChartOutputOption = {
            series: CHART_DATA.SERIESDATALIST,
            chart: {
                height: 250,
                type: CHART_DATA.TYPE,
                stacked: CHART_DATA.STACKED,
                stackType: '100%',
                fontFamily: 'Rubik, sans-serif',
                toolbar: {
                    show: false
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

            colors: CHART_DATA.COLORS,
            stroke: {
                width: 3,
                curve: 'smooth'
            },
            xaxis: {
                show: CHART_DATA.SHOWXAXIS,
                type: 'category',
                categories: CHART_DATA.LABELS,
                tickAmount: 10,
                labels: {
                    show: CHART_DATA.SHOWXAXIS,
                    style: {
                        fontFamily: 'Rubik, sans-serif',
                    },
                },
                axisTicks: {
                    show: false
                },
                axisBorder: {
                    show: true
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
            yaxis: {
                show: CHART_DATA.SHOWYAXIS,
                // min: 0,
                // max: 28,
                labels: {
                    show: CHART_DATA.SHOWYAXIS,
                }
            },
            tooltip: {
                y: {
                    formatter: function (value, opts) {
                        return $scope.$parent.NUMBER_WITH_COMMAS(value)
                    },
                },
            },
        };
        var ChartOutput = new ApexCharts(document.querySelector("#" + CHART_NAME), ChartOutputOption);
        ChartOutput.render();
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
            case 81: // Drinkg, other, Category_Wastage ,  Category
                $scope.Display_Model.CATEGORY_LIST = data;

                break;
            case 82: //Last_Four_Weeks /// Last 4 Weeks (Top 10)
                $scope.Display_Model.LAST_FOUR_WEEK_LIST = data;
                $scope.GROUP_BAR_CHART("Last_Four_Weeks", data, data, "string");

                break;
            case 83:///Wastage By Reason 
                $scope.Display_Model.WASTAGE_BY_REASON_LIST = data;
                var TABLE = data.CHART_OUTPUT_LIST.filter(function (x) { return x.COMPONENT_TYPE_ID == 2 })
                if (TABLE.length > 0) {
                    $scope.Display_Model.WASTAGE_BY_REASON_LIST_DATE_TABLE = TABLE[0];
                }

                break;
            case 84:///Wastage Summary - Last 13 Weeks
                $scope.Display_Model.LINE_BAR_AREA_LIST = data;
                $scope.LINE_BAR_AREA("Wastage_Summary_13", data, data, "string");
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
    $scope.$on('ngRepeatFinishedCategoryRender', function (ngRepeatFinishedEvent) {
        angular.forEach($scope.Display_Model.CATEGORY_LIST.CHART_OUTPUT_LIST, function (chartdata, index) {
            $scope.BAR_CHART("Category_Wastage_" + (index + 1), chartdata, chartdata, "string");
        });
        $scope.$parent.TOOLTIP_ENABLE_Fn();
    });

    $scope.$on('ngRepeatFinishedWastageRender', function (ngRepeatFinishedEvent) {
        angular.forEach($scope.Display_Model.WASTAGE_BY_REASON_LIST.CHART_OUTPUT_LIST, function (chartdata, index) {
            if (chartdata.COMPONENT_TYPE_ID == 0) {
                $scope.HEAT_CHART("Reason_Wastage_" + (index + 1), chartdata, chartdata, "string");
            }
        });
        $scope.$parent.TOOLTIP_ENABLE_Fn();
    });

    $scope.$parent.PI_child_scope = $scope;
});