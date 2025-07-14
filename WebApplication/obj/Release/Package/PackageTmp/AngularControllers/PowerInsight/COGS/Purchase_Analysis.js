app.controller('PI_Purchase_AnalysisController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $localStorage) {
    $scope.$parent.CURRENT_PATH = window.location.hash;
    $scope.$parent.overlay_loading_powerInsight = 'none';
    $scope.THIS_APP_PAGE_COMPONENTS_LIST = [];
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(2);
    $scope.Input_Model = {
        GET_PAGE_DATA: true,
        GET_FILTER_DATA: true,
        USER_ID: parseInt($cookies.get("USERID")),
        APP_PAGE_ID: 26,
        DISPLAY_TEXT_SITE: "Select Sites",
        ENTITY_BRANCH_LIST: [],
        WEEK_DATE: new Date(),
        START_DAY_OF_WEEK: 1,
        WEEK_NO: 9,
        SELECTED_CAT_TEXT: 'All',
        SELECTED_BY_CATEGORY_TEXT: 'All',
        SELECTED_BY_SUPPLIER_TEXT: 'All',
    }
    $scope.LOAD_APP_COMPONENTS = 0;
    $scope.GET_THIS_PAGE_COMPONENTS = function () {
        var _app_page_components_list = JSON.parse($localStorage.APP_PAGE_COMPONENTS_LIST);
        $scope.THIS_APP_PAGE_COMPONENTS_LIST = _app_page_components_list.filter(function (x) { return x.APP_PAGE_ID == $scope.Input_Model.APP_PAGE_ID && x.ACTIVE });
        $scope.LOAD_APP_COMPONENTS = 1;
    }
    $scope.BAR_CHART = function (CHART_NAME, HEADER_DATA, CHART_DATA, TYPE) {
        $('#' + CHART_NAME).empty();
        //Cost_by_Category   
        var BarChartoptions = {
            series: CHART_DATA.SERIESDATALIST,
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
                    borderRadius: 5,
                    borderRadiusApplication: "end",
                    borderRadiusWhenStacked: "last",
                    horizontal: true,
                    columnWidth: "20%",
                    barHeight: '40%',
                    dataLabels: {
                        position: 'center',
                        show: false,
                    }
                },
            },
            dataLabels: {
                enabled: true,
                formatter: function (value, gl) {
                    return $scope.$parent.NUMBER_WITH_COMMAS(value.toFixed(0)) + "%";
                    //    return   parseFloat(gl.globals.seriesPercent[gl.seriesIndex]).toFixed(0) + "%";
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
            xaxis: {
                show: CHART_DATA.SHOWXAXIS,                
                categories: CHART_DATA.LABELS,
                labels: {
                    show: false,
                    //formatter: function (val) {
                    //    return $scope.$parent.NUMBER_WITH_COMMAS(val.toFixed(0)) + "%"
                    //},
                },
                axisBorder: {
                    show: false
                },
                axisTicks: {
                    show: true
                }
            },
            
            tooltip: {
                y: {
                    formatter: function (val, opts) {
                        return $scope.$parent.NUMBER_WITH_COMMAS(parseFloat(opts.w.globals.initialSeries[opts.seriesIndex].DISPLAY_DATA[opts.dataPointIndex]));
                      // return $scope.$parent.NUMBER_WITH_COMMAS(val.toFixed(0));
                    }
                }
            },
            colors: CHART_DATA.COLORS,
            fill: {
                opacity: 1
            },
            legend: {
                floating: true,
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
        var BarChart = new ApexCharts(document.querySelector('#' + CHART_NAME), BarChartoptions);
        BarChart.render();
    };
    $scope.LINE_BAR_AREA = function (CHART_NAME, DATA, CHART_DATA, TYPE) {
        //Voids
        $('#' + CHART_NAME).empty();
        var LineBarAreaoptions = {
            chart: {
                height: 307,
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
                width: [2, 2, 2, 2],
                curve: 'smooth'
            },
            plotOptions: {
                bar: {
                    borderRadius: 3,
                    borderRadiusApplication: "end",
                    borderRadiusWhenStacked: "first",
                    horizontal: false,
                    columnWidth: "50%",
                },
            },
            series: CHART_DATA.MULTISERIESDATALIST,
            fill: {
                opacity: [1, 1, 0.25, 0.25],
                gradient: {
                    inverseColors: false,
                    shade: 'light',
                    //type: "vertical",
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
                // seriesName: undefined,
                show: CHART_DATA.SHOWXAXIS,

                labels: {
                    trim: true,
                    rotate: -90,
                    rotateAlways: true,
                }
            },
            yaxis: [
                {
                    seriesName: ["Invoice Count","LW Count"],
                    show: CHART_DATA.SHOWYAXIS,
                    showAlways: true,
                    labels: {
                        show: CHART_DATA.SHOWYAXIS,
                        formatter: (val) => {
                            return parseFloat(val) < $scope.$parent.K_M_T_VALUE_INIT ? $scope.$parent.NUMBER_WITH_COMMAS(parseFloat(val).toFixed(0)) : $scope.$parent.NUMBER_WITH_COMMAS(val / 1000) + 'K'
                        }
                    },
                },
                //{
                //    //seriesName: "LW Count",
                //    show: false,
                //    showAlways: true,
                //    labels: {
                //        show: CHART_DATA.SHOWY2AXIS,
                //        formatter: (val) => {
                //            return parseFloat(val) < $scope.$parent.K_M_T_VALUE_INIT ? $scope.$parent.NUMBER_WITH_COMMAS(parseFloat(val).toFixed(0)) : $scope.$parent.NUMBER_WITH_COMMAS(val / 1000) + 'K'
                //        }
                //    },
                //},
                {
            //        seriesName: "Invoice Amount",
                    show: CHART_DATA.SHOWYAXIS,
                    //logarithmic: true,
                    opposite: true,
                    showAlways: true,
                    labels: {
                        show: CHART_DATA.SHOWYAXIS,
                        formatter: (val) => {
                            //            return parseFloat(val) < $scope.$parent.K_M_T_VALUE_INIT ? $scope.$parent.NUMBER_WITH_COMMAS(val) : $scope.$parent.NUMBER_WITH_COMMAS(val / 1000) + 'K'
                            return val <= ($scope.$parent.K_M_T_VALUE_INIT) * -1 ? $scope.$parent.NUMBER_WITH_COMMAS(val / 1000) + 'K' : val < $scope.$parent.K_M_T_VALUE_INIT ? $scope.$parent.NUMBER_WITH_COMMAS(val) : $scope.$parent.NUMBER_WITH_COMMAS(val / 1000) + 'K';
                        }
                    },
                },
                //{
                //   // seriesName: "LW Amount",
                //    show: false,
                //    logarithmic: true,
                //    opposite: false,
                //    labels: {
                //        show: CHART_DATA.SHOWY2AXIS,
                //        formatter: (val) => {
                //            // return val <= ($scope.$parent.K_M_T_VALUE_INIT) * -1 ? parseFloat(val) < $scope.$parent.K_M_T_VALUE_INIT  $scope.$parent.NUMBER_WITH_COMMAS(val) : $scope.$parent.NUMBER_WITH_COMMAS(val / 1000) + 'K';
                //            return val <= ($scope.$parent.K_M_T_VALUE_INIT) * -1 ? $scope.$parent.NUMBER_WITH_COMMAS(val / 1000) + 'K' : val < $scope.$parent.K_M_T_VALUE_INIT ? $scope.$parent.NUMBER_WITH_COMMAS(val) : $scope.$parent.NUMBER_WITH_COMMAS(val / 1000) + 'K';
                //        }
                //    },
                //}
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

                    }
                }
            },

            responsive: [{
                breakpoint: undefined,
                options: {},
            }],

            legend: {
                position: "bottom",
                horizontalAlign: "center",
                fontFamily: "Rubik, sans-serif",
                fontSize: "12px",
            },
            colors: CHART_DATA.COLORS,
        }
        var LineBarArea = new ApexCharts(document.querySelector("#" + CHART_NAME), LineBarAreaoptions);
        LineBarArea.render();
    }
    $scope.HORIZONTAL_BAR = function (CHART_NAME, DATA, CHART_DATA, TYPE) {
        // Weekly_Purchase_Category
        $('#' + CHART_NAME).empty();
        var _h_bar_options = {
            series: CHART_DATA.SERIESDATALIST,
            chart: {
                type: "bar",
                height: 583,
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
                    borderRadius: 2,
                    borderRadiusApplication: "end",
                    borderRadiusWhenStacked: "last",
                    horizontal: true,
                    columnWidth: "50%",
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
                offsetX: 15,
                textAnchor: "start",
                style: {
                    fontSize: '10px',
                    colors: ['#7a7a7a'],
                }
            },
            stroke: {
                show: true,
                width: 1,
                colors: ["transparent"],
            },
            grid: {
                show: true,
                borderColor: "var(--chart-border)",
                xaxis: {
                    lines: {
                        show: false,
                    },
                },
            },
            colors: CHART_DATA.COLORS,
            xaxis: {
                show: CHART_DATA.SHOWXAXIS,
                categories: CHART_DATA.LABELS,
                tickAmount: 4,
                tickPlacement: "between",
                labels: {
                    show: CHART_DATA.SHOWXAXIS,
                    style: {
                        fontFamily: "Rubik, sans-serif",
                    },
                    formatter: (value, opts) => {
                        return $scope.$parent.NUMBER_WITH_COMMAS(value.toFixed(0)) + '%'
                        //return $scope.$parent.NUMBER_WITH_COMMAS(value.toFixed(0)) + '' + "\n\n" + '(' + ((opts.w.globals.initialSeries[opts.seriesIndex].DISPLAY_DATA[opts.dataPointIndex])) + ') '
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
                show: CHART_DATA.SHOWYAXIS,
                labels: {
                    show: CHART_DATA.SHOWYAXIS,
                    style: {
                        fontFamily: "Rubik, sans-serif",
                    },

                },
            }],

            fill: {
                opacity: 1,
            },
            legend: {
                position: "bottom",
                horizontalAlign: "center",
                fontFamily: "Rubik, sans-serif",
                fontSize: "12px",
                labels: {
                    colors: "var(--chart-text-color)",
                },
                markers: {
                    width: 10,
                    height: 10,
                    radius: 12,
                },
                itemMargin: {
                    horizontal: 10,
                },
            },
            tooltip: {
                y: {
                    show: true,
                    formatter: function (val) {
                        return $scope.$parent.NUMBER_WITH_COMMAS(val.toFixed(0));
                    }
                }
            },
            responsive: [
                {
                    breakpoint: 1366,
                    options: {
                        plotOptions: {
                            bar: {
                                columnWidth: "80%",
                            },
                        },
                        grid: {
                            padding: {
                                right: 0,
                            },
                        },
                    },
                },
                {
                    breakpoint: 992,
                    options: {
                        plotOptions: {
                            bar: {
                                columnWidth: "70%",
                            },
                        },
                    },
                },
                {
                    breakpoint: 576,
                    options: {
                        plotOptions: {
                            bar: {
                                columnWidth: "60%",
                            },
                        },
                        grid: {
                            padding: {
                                right: 5,
                            },
                        },
                    },
                },
            ],
        };
        var _h_bar = new ApexCharts(document.querySelector("#" + CHART_NAME), _h_bar_options);
        _h_bar.render();;
    }
    $scope.VERTICAL_BAR = function (CHART_NAME, DATA, CHART_DATA, TYPE) {
        $('#' + CHART_NAME).empty();
        var _v_bar_options = {
            chart: {
                height: 260,
                type: 'bar',
                stacked: false,
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
            stroke: {
                width: [2, 2, 2, 2],
                curve: 'smooth'
            },

            plotOptions: {
                bar: {
                    borderRadius: 2,
                    borderRadiusApplication: "end",
                    borderRadiusWhenStacked: "first",
                    horizontal: false,
                    columnWidth: "50%",
                },
            },
            dataLabels: {
                enabled: false,
            },
            series: CHART_DATA.SERIESDATALIST,

            labels: CHART_DATA.LABELS,
            markers: {
                size: 0
            },

            xaxis: {
                show: CHART_DATA.SHOWXAXIS,
                labels: {
                    trim: true,
                    rotate: -90,
                },
            },
            yaxis: [{
                show: CHART_DATA.SHOWYAXIS,
                labels: {
                    show: CHART_DATA.SHOWYAXIS,
                    formatter: (val) => {
                        return val <= ($scope.$parent.K_M_T_VALUE_INIT) * -1 ? $scope.$parent.NUMBER_WITH_COMMAS(val / 1000) + 'K' : val < $scope.$parent.K_M_T_VALUE_INIT ? $scope.$parent.NUMBER_WITH_COMMAS(val) : $scope.$parent.NUMBER_WITH_COMMAS(val / 1000) + 'K';
                    }
                }
            },
                //{
                //    show: CHART_DATA.SHOWY2AXIS,
                //    opposite: CHART_DATA.SHOWY2AXIS,
                //    logarithmic: CHART_DATA.SHOWY2AXIS,
                //    labels: {
                //        show: CHART_DATA.SHOWY2AXIS,
                //        formatter: (val) => {
                //            return val <= ($scope.$parent.K_M_T_VALUE_INIT) * -1 ? $scope.$parent.NUMBER_WITH_COMMAS(val / 1000) + 'K' : val < $scope.$parent.K_M_T_VALUE_INIT ? $scope.$parent.NUMBER_WITH_COMMAS(val) : $scope.$parent.NUMBER_WITH_COMMAS(val / 1000) + 'K';
                //        }
                //    }
                //    }

            ],
            tooltip: {
                y: {
                    formatter: function (val) {
                        return $scope.$parent.NUMBER_WITH_COMMAS(val.toFixed(0));
                    }
                }
            },
            legend: {
                position: "bottom",
                horizontalAlign: "center",
                fontFamily: "Rubik, sans-serif",
                fontSize: "12px",
            },
            colors: CHART_DATA.COLORS,
        };
        var _v_bar = new ApexCharts(document.querySelector("#" + CHART_NAME), _v_bar_options);
        _v_bar.render();
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
            yaxis: [{
                show: CHART_DATA.SHOWYAXIS,
                labels: {
                    show: CHART_DATA.SHOWY2AXIS,
                    formatter: (val) => {
                        return val < $scope.$parent.K_M_T_VALUE_INIT ? $scope.$parent.NUMBER_WITH_COMMAS(val) : $scope.$parent.NUMBER_WITH_COMMAS(val / 1000) + 'K';
                    }
                }
            },
            {
                show: CHART_DATA.SHOWY2AXIS,
                opposite: true,
                labels: {
                    show: CHART_DATA.SHOWY2AXIS,
                    formatter: (val) => {
                        return val < $scope.$parent.K_M_T_VALUE_INIT ? $scope.$parent.NUMBER_WITH_COMMAS(val) : $scope.$parent.NUMBER_WITH_COMMAS(val / 1000) + 'K';
                    }
                }
            }],
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
    $scope.IS_STAFF_COST = true;
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
        if ($scope.Input_Model.ENTITY_BRANCH_LIST.length > 0) {
            angular.forEach($scope.THIS_APP_PAGE_COMPONENTS_LIST, function (component, index) {
                var _pi_input_model_obj = new Object();
                _pi_input_model_obj.USER_ID = parseInt($cookies.get("USERID"));
                _pi_input_model_obj.MODULE_ID = 16;
                _pi_input_model_obj.SUB_MODULE_ID = 0;
                _pi_input_model_obj.APP_PAGE_ID = $scope.Input_Model.APP_PAGE_ID;
                _pi_input_model_obj.COMPONENT_ID = component.COMPONENT_ID;
                _pi_input_model_obj.CATEGORY_MASTER_ID = 0;
                _pi_input_model_obj.COMPONENT_TYPE_ID = component.COMPONENT_ID;// for now i am passing component id- component.COMPONENT_TYPE_ID;
                _pi_input_model_obj.SP_NAME = component.STORED_PROCEDURE;
                _pi_input_model_obj.SP_PARAMETERS = component.PARAMETERS;
                _pi_input_model_obj.TITLE = component.COMPONENT_NAME;
                _pi_input_model_obj.CURRENCY_ID = $scope.Input_Model.CURRENCY_ID;
                _pi_input_model_obj.START_DATE = new Date($scope.Input_Model.START_DATE).toDateString();
                _pi_input_model_obj.END_DATE = new Date($scope.Input_Model.END_DATE).toDateString();
                _pi_input_model_obj.SORT_ORDER = component.SORT_ORDER;
                _pi_input_model_obj.ENTITY_BRANCH_LIST = $scope.Input_Model.ENTITY_BRANCH_LIST;
                PrcCommMethods.DASHBOARD_MODULES_API(_pi_input_model_obj, 'GETDATAFORCHART', 'POWERINSIGHTAPI').then(function (data) {
                    // $scope.$parent.overlay_loading_powerInsight = 'none';
                    $scope.CardLineData = [];
                    if (data.data != null) {
                        $scope.SetDisplayObjects(data.data, component, index);
                        if ($scope.THIS_APP_PAGE_COMPONENTS_LIST.length - 1 == index && $scope.$parent.PI_INDEX_JS_LOAD == 2) {
                            // $scope.$parent.$parent.overlay_loadingNew = 'none';
                        }
                    }
                });

            });
            if ($scope.$parent.PI_INDEX_JS_LOAD == 1) {
                $scope.$parent.PI_INDEX_JS_LOAD = 2;
            };
            $scope.CATEGORY_MASTER_LIST = [];
            var _pi_cat_input_model_obj = new Object();
            _pi_cat_input_model_obj.ENTITY_BRANCH_LIST = $scope.Input_Model.ENTITY_BRANCH_LIST;
            PrcCommMethods.DASHBOARD_MODULES_API(_pi_cat_input_model_obj, 'PI_GET_CATEGORY_MASTER', 'POWERINSIGHTAPI').then(function (data) {
                if (data.data != null && data.data.Table.length > 0) {
                    $scope.CATEGORY_MASTER_LIST = data.data.Table.filter(function (x) { return x.IS_REVENUE_CATEGORY });
                }
            });
        }
        if ($scope.Input_Model.ENTITY_BRANCH_LIST.length == 0) {
            //$scope.$parent.ShowAlert("Attention", "Please Select atlease one site to proceed", 3000);
            // $('#SITE_POP').modal('show');
        }
    };
    $scope.SetDisplayObjects = function (data, component) {
        switch (data.COMPONENT_TYPE_ID) {
            case 74://Purchase_by_Supplier
                $scope.Display_Model.PURCHASE_BY_SUPPLIER = data;
                $scope.Display_Model.PURCHASE_BY_SUPPLIER_COMPONENT = component;
                $scope.LINE_BAR_AREA("Purchase_by_Supplier", data, data, "string");
                break;
            case 75:
                $scope.Display_Model.COST_BY_CATEGORY = data;
                $scope.BAR_CHART("Cost_by_Category", data, data, "string");
                break;
            case 76:
                ///Weekly Purchase By Category
                $scope.Display_Model.WEEKLY_PURCHASE_BY_CATEGORY = data;
                $scope.Display_Model.WEEKLY_PURCHASE_BY_CATEGORY_COMPONENT = component;
                $scope.HORIZONTAL_BAR("Weekly_Purchase_Category", data, data, "string");
                break;
            case 77:
                $scope.Display_Model.ORDER_VALUE_COMPARISON = data;
                $scope.VERTICAL_BAR("Order_Value_Comparison", data, data, "string");
                break;
            case 78:

                $scope.Display_Model.CHEF_REPORT_LIST = data;
                break;
            case 79:
                $scope.Display_Model.FOOD_GP_LIST = data;
                break;
        }
    }
    $scope.Fn_SELECT_CATEGORY = function (CLICK_FLAG, CATEGORY) {
        if (CLICK_FLAG == "BY_CATEGORY") {
            $scope.BY_Filter_ChartData($scope.Display_Model.WEEKLY_PURCHASE_BY_CATEGORY_COMPONENT, CATEGORY);
            $scope.Input_Model.SELECTED_BY_CATEGORY_TEXT = CATEGORY.CATEGORY_NAME;
        }
        if (CLICK_FLAG == "BY_SUPPLIER") {
            $scope.BY_Filter_ChartData($scope.Display_Model.PURCHASE_BY_SUPPLIER_COMPONENT, CATEGORY);
            $scope.Input_Model.SELECTED_BY_SUPPLIER_TEXT = CATEGORY.CATEGORY_NAME;
        }
    }
    $scope.Fn_RESET_CAT_FILTER = function (CLICK_FLAG) {
        var CATEGORY = new Object();
        CATEGORY.ID = 0;
        if (CLICK_FLAG == "BY_CATEGORY") {
            $scope.BY_Filter_ChartData($scope.Display_Model.WEEKLY_PURCHASE_BY_CATEGORY_COMPONENT, CATEGORY);
            $scope.Input_Model.SELECTED_BY_CATEGORY_TEXT = $scope.Input_Model.SELECTED_CAT_TEXT;
        }
        if (CLICK_FLAG == "BY_SUPPLIER") {
            $scope.BY_Filter_ChartData($scope.Display_Model.PURCHASE_BY_SUPPLIER_COMPONENT, CATEGORY);
            $scope.Input_Model.SELECTED_BY_SUPPLIER_TEXT = $scope.Input_Model.SELECTED_CAT_TEXT;
        }
    }
    $scope.BY_Filter_ChartData = function (component, CATEGORY) {
        $scope.$parent.$parent.overlay_loading_powerInsight = 'block';
        if ($scope.Input_Model.ENTITY_BRANCH_LIST.length == 0) {
            $scope.Fn_Fill_ENTITY_BRANCH_LIST();
        };
        var _pi_input_model_obj = new Object();
        _pi_input_model_obj.USER_ID = parseInt($cookies.get("USERID"));
        _pi_input_model_obj.MODULE_ID = 16;
        _pi_input_model_obj.SUB_MODULE_ID = 0;
        _pi_input_model_obj.APP_PAGE_ID = $scope.Input_Model.APP_PAGE_ID;
        _pi_input_model_obj.COMPONENT_ID = component.COMPONENT_ID;
        _pi_input_model_obj.CATEGORY_MASTER_ID = CATEGORY.ID;
        _pi_input_model_obj.COMPONENT_TYPE_ID = component.COMPONENT_ID;// for now i am passing component id- component.COMPONENT_TYPE_ID;
        _pi_input_model_obj.SP_NAME = component.STORED_PROCEDURE;
        _pi_input_model_obj.SP_PARAMETERS = component.PARAMETERS;
        _pi_input_model_obj.TITLE = component.COMPONENT_NAME;
        _pi_input_model_obj.CURRENCY_ID = $scope.Input_Model.CURRENCY_ID;
        _pi_input_model_obj.START_DATE = new Date($scope.Input_Model.START_DATE).toDateString();
        _pi_input_model_obj.END_DATE = new Date($scope.Input_Model.END_DATE).toDateString();
        _pi_input_model_obj.SORT_ORDER = component.SORT_ORDER;
        _pi_input_model_obj.ENTITY_BRANCH_LIST = $scope.Input_Model.ENTITY_BRANCH_LIST;
        PrcCommMethods.DASHBOARD_MODULES_API(_pi_input_model_obj, 'GETDATAFORCHART', 'POWERINSIGHTAPI').then(function (data) {
            if (data.data != null) {
                $scope.SetDisplayObjects(data.data, component);
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
        $scope.Fn_RESET_CAT_FILTER('BY_CATEGORY')
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
        $scope.Input_Model.SELECTED_CAT_TEXT = 'All';
        $scope.Input_Model.SELECTED_BY_CATEGORY_TEXT = 'All';
        $scope.Input_Model.SELECTED_BY_SUPPLIER_TEXT = 'All';

        $scope.RESET_SITES_Fn();
        $scope.CURRENCY_Fn($scope.CURRENCY_LIST[0]);
        $scope.Fn_CHANGE_FILTER("Reset");
        window.scrollTo(0, 0);
    }
    $scope.RESET_SITES_Fn = function () {


        $scope.IS_ALL_SITE_CHECK = false;
        $scope.SITE_All_Fn(1);
    }

    $scope.Fn_STAFF_COST = function () {
        if ($scope.Display_Model.FOOD_GP_LIST != undefined) {
            angular.forEach($scope.Display_Model.FOOD_GP_LIST.listvalue, function (val) {
                val.IS_VISIBLE = false;
                if (val.Val1 == 'GP') {
                    if ($scope.IS_STAFF_COST) {
                        //val.Val2 = val.Val6;
                        val.Val3 = val.Val6;
                        val.Val5 = val.Val7;

                        val.Val2 = val.Val23;
                        val.Val4 = val.Val24;
                    }
                    else {
                        val.Val3 = val.Val8;
                        val.Val5 = val.Val9;

                        val.Val2 = val.Val10;
                        val.Val4 = val.Val22;

                    }
                }
                if (val.Val1 == 'Staff Food') {
                    val.IS_VISIBLE = !$scope.IS_STAFF_COST;
                }
            });
        }
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
    $scope.$parent.PI_child_scope = $scope;
});
