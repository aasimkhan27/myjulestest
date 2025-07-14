app.controller('PI_COGS_SummaryController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $localStorage) {
    $scope.$parent.CURRENT_PATH = window.location.hash;
    $scope.$parent.overlay_loading_powerInsight = 'none';
    $scope.THIS_APP_PAGE_COMPONENTS_LIST = [];
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(2);
    $scope.Input_Model = {
        GET_PAGE_DATA: true,
        GET_FILTER_DATA: true,
        USER_ID: parseInt($cookies.get("USERID")),
        APP_PAGE_ID: 25,
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
    var chartlinechart = null;
    $scope.AREA_LINE_CHART = function (CHART_NAME, HEADER_DATA, CHART_DATA, TYPE) {
        /*Cogs_Sales*/
        if (chartlinechart != null) {
            chartlinechart.destroy();
        }

        $('#' + CHART_NAME).empty();
        if (document.querySelector("#" + CHART_NAME).hasChildNodes()) {
            document.querySelector("#" + CHART_NAME).innerHTML = '';
        }
        var Arealineoptionschart = {
            chart: {
                zoom: {
                    enabled: $scope.APPLY_ZOOM
                },
                toolbar: {
                    show: false,
                },
                height: 150,
                width: '100%',
                type: "area",
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                width: 3,
                curve: "smooth",
            },
            xaxis: {
                show: CHART_DATA.SHOWXAXIS,
                type: "week",
                categories: CHART_DATA.LABELS,
                labels: {
                    show: false,
                },
                axisBorder: {
                    show: false,
                },
                tooltip: {
                    enabled: false
                }
            },
            yaxis: {
                min: 0,// Math.min.apply(null, data.SERIESDATALIST[0].data),
                show: CHART_DATA.SHOWYAXIS,
                labels: {
                    show: false,
                },
            },
            grid: {
                show: false,
                padding: {
                    left: 0,
                    top: -10,
                    right: 0,
                    bottom: -20,
                },
            },
            fill: {
                opacity: 0.2,
            },
            // colors: [CubaAdminConfig.primary],
            colors: CHART_DATA.COLORS,
            series: CHART_DATA.SERIESDATALIST,
            tooltip: {
                x: {
                },
                y: {
                    formatter: function (value, opts) {
                        return $scope.$parent.NUMBER_WITH_COMMAS(value)
                    },
                },
            },
            responsive: [
                {
                    breakpoint: 576,
                    options: {
                        chart: {
                            height: 100,
                        }
                    }
                }
            ]
        };
        chartlinechart = new ApexCharts(document.querySelector("#" + CHART_NAME), Arealineoptionschart);
        chartlinechart.render();
    }
    $scope.BAR_CHART = function (CHART_NAME, HEADER_DATA, CHART_DATA, TYPE) {
        $('#' + CHART_NAME).empty();
        var optionsChart = {
            series: CHART_DATA.SERIESDATALIST,
            chart: {
                type: 'bar',
                height: 240,
                stacked: true,
                stackType: '100%',
                zoom: {
                    enabled: $scope.APPLY_ZOOM
                },
                toolbar: {
                    show: false
                },
                dropShadow: {
                    enabled: true,
                    enabledOnSeries: undefined,
                    top: 5,
                    left: 0,
                    blur: 10,
                    color: '#373737',
                    opacity: 0.10
                },
                zoom: {
                    enabled: true
                }
            },
            responsive: [{
                breakpoint: 480,
                options: {
                    legend: {
                        position: 'bottom',
                        offsetX: -10,
                        offsetY: 0
                    }
                }
            }],
            plotOptions: {
                bar: {
                    horizontal: false,
                    borderRadius: 0,
                    dataLabels: {
                        total: {
                            enabled: false,
                            style: {
                                fontSize: '12px',
                                fontWeight: 900
                            }
                        }
                    }
                },
            },
            grid: {
                show: false,
            },
            dataLabels: {
                formatter: (val) => {
                    return val.toFixed(0) + "%";
                },
                enabled: true,
                offsetX: -8,
                textAnchor: "start",
                style: {
                    fontSize: '10px',
                }
            },
            colors: CHART_DATA.COLORS,
            xaxis: {
                show: CHART_DATA.SHOWXAXIS,
                tickAmount: 20000,
                categories: CHART_DATA.LABELS,
            },
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                fontFamily: "Rubik, sans-serif",
            },
            fill: {
                opacity: 1
            },
            yaxis: {
                show: CHART_DATA.SHOWYAXIS,
                min: 0,
                max: 100,
                labels: {
                    show: false
                }
            }, tooltip: {
                y: {
                    formatter: function (value, opts) {
                        return $scope.$parent.NUMBER_WITH_COMMAS(value)
                    },
                },
            },
            zaxis: {
                show: CHART_DATA.SHOWY2AXIS,
            },
        };

        var chart12 = new ApexCharts(document.querySelector('#' + CHART_NAME), optionsChart);
        chart12.render();
    };
    $scope.DOUGHNUT = function (CHART_NAME, DATA, CHART_DATA, TYPE) {
        $('#' + CHART_NAME).empty();
        $scope.CHART_SERIES_DATA = angular.copy(CHART_DATA.SERIES);
        //CHART_DATA.SERIES = CHART_DATA.SERIES.filter(function (x) { return Math.abs(x) });
        CHART_DATA.SERIES1 = [];
        //CHART_DATA.SERIES1 = CHART_DATA.SERIES.filter(function (x) { return Math.abs(x) });
        angular.forEach(CHART_DATA.SERIES, function (x) {
            if (x < 0) {
                let a = x * -1;
                CHART_DATA.SERIES1.push(a);
            }
            else {
                CHART_DATA.SERIES1.push(x);
            };
        });

        var options8 = {
            chart: {
                height: 227,
                type: 'donut',
            },
            plotOptions: {
                pie: {
                    expandOnClick: false,
                    donut: {
                        labels: {
                            show: true,
                            value: {
                                formatter: function (val) {
                                    return $scope.$parent.NUMBER_WITH_COMMAS(parseFloat(val).toFixed(0));
                                },
                            },
                            total: {
                                show: true,
                                showAlways: false,
                                label: 'Total',
                                formatter: function (w) {
                                    return CHART_DATA.MAX;
                                },
                                //labels: {
                                //    show: true, 
                                //    total: {
                                //        show: true,
                                //        label: '',
                                //        formatter: () => 'Text you want'
                                //    }
                                //}
                            }
                        }
                    }
                }
            },
            labels: CHART_DATA.LABELS,
            series: CHART_DATA.SERIES1,
            dataLabels: {
                enabled: true,
                formatter: function (val) {
                    return $scope.$parent.NUMBER_WITH_COMMAS(parseFloat(val).toFixed(0));
                },
                dropShadow: {
                    enabled: false,
                    top: 1,
                    left: 1,
                    blur: 1,
                    color: '#000',
                    opacity: 0.45
                },
            },
            // fill: {
            //     type: 'gradient',
            //   },
            legend: {
                position: "right",
                horizontalAlign: "center",
                fontFamily: "Rubik, sans-serif",
                fontSize: "12px",
            },
            tooltip: {
                y: {
                    formatter: function (val, param_y) {
                        return $scope.$parent.NUMBER_WITH_COMMAS(parseFloat($scope.CHART_SERIES_DATA[param_y.seriesIndex] * 1).toFixed(0));
                    }
                },
            },
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200
                    },
                    legend: {
                        show: false
                    }
                },
                breakpoint: 1600,
                options: {
                    chart: {
                        height: 265,
                    },
                    legend: {
                        show: true,
                        position: "bottom",
                    }
                }
            }],
            colors: CHART_DATA.COLORS,
        }
        var chart8 = new ApexCharts(document.querySelector("#" + CHART_NAME), options8);
        chart8.render();
        $scope.$parent.EQUALIZER();
    }
    $scope.H_BAR_CHART = function (CHART_NAME, DATA, CHART_DATA, TYPE) {
        // GP_Categories
        $('#' + CHART_NAME).empty();
        var options_GP = {
            series: CHART_DATA.SERIESDATALIST,
            chart: {
                type: 'bar',
                height: 300,
                zoom: {
                    enabled: $scope.APPLY_ZOOM
                },
                toolbar: {
                    show: false
                },
                dropShadow: {
                    enabled: true,
                    enabledOnSeries: undefined,
                    top: 5,
                    left: 0,
                    blur: 6,
                    color: '#7366ff',
                    opacity: 0.15
                },
            },
            stroke: {
                width: 1,
                colors: ['#fff']
            },
            dataLabels: {
                formatter: (val) => {
                    return val + '%'
                }
            },
            plotOptions: {

                bar: {
                    borderRadius: 4,
                    borderRadiusApplication: "end",
                    borderRadiusWhenStacked: "first",
                    horizontal: true,
                    columnWidth: "50%",
                    dataLabels: {
                        position: 'center',
                        show: false,
                    }
                },
            },
            xaxis: {
                show: CHART_DATA.SHOWXAXIS,
                categories: CHART_DATA.LABELS,
                labels: {
                    show: false,
                    formatter: (val) => {
                        return $scope.$parent.NUMBER_WITH_COMMAS((val / 1000).toFixed(0)) + 'K'
                    }
                },
            },
            yaxis: {
                show: CHART_DATA.SHOWYAXIS,
            },
            zaxis: {
                show: CHART_DATA.SHOWY2AXIS,
            },
            grid: {
                yaxis: {
                    lines: {
                        show: false
                    }
                },
            },
            fill: {
                opacity: 1,
            },
            colors: CHART_DATA.COLORS,
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                fontFamily: "Rubik, sans-serif",
                fontSize: '12px',
                fontWeight: 400
            }
        };

        var chart1 = new ApexCharts(document.querySelector("#" + CHART_NAME), options_GP);
        chart1.render();
    }
    var _v_bar;
    $scope.VERTICAL_GROUP_BAR = function (CHART_NAME, DATA, CHART_DATA, TYPE) {
        $('#' + CHART_NAME).empty();
        if (_v_bar) {
            _v_bar.destroy();
        }
        var oldDiv = angular.element(document.getElementById("Week_Rolling_GP"));
        oldDiv.remove();
        var newDiv = angular.element("<div id='Week_Rolling_GP'></div>");
        angular.element(document.getElementById("Week_Rolling_GP_DIV")).append(newDiv);

        var _v_bar_options = {
            chart: {
                height: 217,
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
            dataLabels: {
                enabled: false,
                //formatter: (val) => {
                //    return val + '%'
                //}
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

                }
            },
            yaxis: [{
                show: CHART_DATA.SHOWYAXIS,
            }],
            tooltip: {
                y: {
                    formatter: function (val) {
                        return $scope.$parent.NUMBER_WITH_COMMAS(val.toFixed(0)) + "%";
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
    $scope.V_BAR_CHART = function (CHART_NAME, DATA, CHART_DATA, TYPE) {
        //Top_Contributors
        DATA.Median = (DATA.MAX + DATA.MIN) / 2;
        DATA.MedianstarttoMin = (DATA.MIN + DATA.Median) / 2;
        $('#' + CHART_NAME).empty();
        var options = {
            series: CHART_DATA.SERIESDATALIST,
            chart: {
                type: 'bar',
                height: 227,
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
            plotOptions: {
                bar: {
                    borderRadius: 4,
                    borderRadiusApplication: "end",
                    borderRadiusWhenStacked: "last",
                    colors: {
                        ranges: [{
                            from: DATA.MIN,
                            to: DATA.NEGATIVE_MAX,
                            color: '#FEB019'
                        }, {
                            from: DATA.NEGATIVE_MAX + 1,
                            to: DATA.MAX,
                            color: '#2c97fa'
                        }]
                    },
                    columnWidth: '80%',
                },
            },
            dataLabels: {
                enabled: false,
            },
            yaxis: {
                labels: {
                    formatter: function (y) {
                        return y.toFixed(0) < $scope.$parent.K_M_T_VALUE_INIT ? y.toFixed(0) : (y.toFixed(0) / 1000) + "K";
                    }
                }
            },
            xaxis: {
                categories: CHART_DATA.LABELS,
                labels: {
                    rotate: -45,
                    formatter: function (y) {
                        if (y.length > 10) {
                            y = y.substr(0, 10);
                        }
                        return y;
                    }
                }
            },
            tooltip: {
                y: {
                    show: true,
                    formatter: function (y) {
                        return $scope.$parent.NUMBER_WITH_COMMAS(y.toFixed(0));
                    },
                    //title: {
                    //    rotate: -45,
                    //    formatter: function (y) {
                    //        if (y.length > 10) {
                    //            y = y.substr(0, 10);
                    //        }
                    //        return y;
                    //    }
                    //},
                },
                x: {
                    show: true,
                    formatter: function (y, x) {
                        return x.w.globals.labels[x.dataPointIndex];
                    }
                }
            },
        };
        var chart = new ApexCharts(document.querySelector("#" + CHART_NAME), options);
        chart.render();

    }
    $scope.GROUP_BAR_CHART = function (CHART_NAME, DATA, CHART_DATA, TYPE) {
        //Week_Rolling_GP
        $('#' + CHART_NAME).empty();


        var options = {
            series: CHART_DATA.SERIESDATALIST,
            chart: {
                type: 'bar',
                height: 280,
                stacked: true,
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
                    blur: 10,
                    color: '#373737',
                    opacity: 0.10
                },
                zoom: {
                    enabled: true
                }
            },
            responsive: [{
                breakpoint: 480,
                options: {
                    legend: {
                        position: 'bottom',
                        offsetX: -10,
                        offsetY: 0
                    }
                }
            }],
            plotOptions: {
                bar: {
                    horizontal: false,
                    borderRadius: 0,
                    dataLabels: {
                        total: {
                            enabled: false,
                            style: {
                                fontSize: '12px',
                                fontWeight: 900
                            }
                        }
                    }
                },
                bar: {
                    borderRadius: 4,
                    borderRadiusApplication: "end",
                    borderRadiusWhenStacked: "last",
                },
            },
            grid: {
                show: false,
            },
            dataLabels: {
                formatter: (val) => {
                    return val + '%'
                },
                enabled: true,
                offsetX: -8,
                textAnchor: "start",
                style: {
                    fontSize: '10px',
                }
            },
            colors: CHART_DATA.COLORS,
            xaxis: {
                show: CHART_DATA.SHOWXAXIS,
                tickAmount: 100,
                categories: CHART_DATA.LABELS,
            },

            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                fontFamily: "Rubik, sans-serif",
            },
            fill: {
                opacity: 1
            },
            yaxis: {
                show: CHART_DATA.SHOWYAXIS,
                // min: 0,
                // max: 100,
                labels: {
                    show: false
                }
            },

        };
        var chart = new ApexCharts(document.querySelector("#" + CHART_NAME), options);
        chart.render();
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
                show: DATA.SHOWYAXIS,
            },
            {
                show: DATA.SHOWY2AXIS,
                opposite: true,
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
        $scope.SELCTED_SITE();
        $scope.Fn_Fill_ENTITY_BRANCH_LIST();
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
            case 61:
                $scope.Display_Model.Sales_data = {};
                $scope.Display_Model.Sales_data = data;
                $scope.AREA_LINE_CHART("Cogs_Sales", data, data, "string");

                break;
            case 69:
                $scope.Display_Model.VARIANCE_REPORT_LIST = [];
                var title = component.COMPONENT_NAME.split(':');
                var VARIANCE_REPORT = data.CHART_OUTPUT_LIST.filter(function (x) { return x.COMPONENT_TYPE_ID == 1 })
                if (VARIANCE_REPORT.length > 0) {
                    $scope.Display_Model.VARIANCE_REPORT_LIST = data.CHART_OUTPUT_LIST.filter(function (x) { return x.COMPONENT_TYPE_ID == 1 })[0];
                }
                var BRIDGE_REPORTING_CATEGORY = data.CHART_OUTPUT_LIST.filter(function (x) { return x.COMPONENT_TYPE_ID == 2 })
                if (BRIDGE_REPORTING_CATEGORY.length > 0) {
                    $scope.Display_Model.BRIDGE_REPORTING_CATEGORY = {};
                    $scope.Display_Model.BRIDGE_REPORTING_CATEGORY.TITLE = title.length > 2 ? title[1] : "Bridge Report By Category";
                    $scope.Display_Model.BRIDGE_REPORTING_CATEGORY.GRID_OUT_PUT = data.CHART_OUTPUT_LIST.filter(function (x) { return x.COMPONENT_TYPE_ID == 2 });
                }

                var VARIANCE_BY_REASON = data.CHART_OUTPUT_LIST.filter(function (x) { return x.COMPONENT_TYPE_ID == 3 });
                if (VARIANCE_BY_REASON.length > 0) {
                    $scope.DOUGHNUT("Variance_by_Reason", VARIANCE_BY_REASON[0], VARIANCE_BY_REASON[0], "string");
                    $scope.Display_Model.VARIANCE_BY_REASON_LIST = VARIANCE_BY_REASON[0];
                }
                else {
                    scope.Display_Model.VARIANCE_BY_REASON_LIST = VARIANCE_REPORT;
                    $scope.DOUGHNUT("Variance_by_Reason", VARIANCE_REPORT, VARIANCE_REPORT, "string");
                }
                break;
            case 72:
                $scope.Display_Model.TOP_CONTRIBUTORS = data;
                $scope.V_BAR_CHART('Top_Contributors', data, data, "string");
                break;
            case 73:
                var GP_BY_CATEGORY = data.CHART_OUTPUT_LIST.filter(function (x) { return x.COMPONENT_TYPE_ID == 1 })
                var WEEK_ROLLING_GP = data.CHART_OUTPUT_LIST.filter(function (x) { return x.COMPONENT_TYPE_ID == 2 });
                if (GP_BY_CATEGORY.length > 0) {
                    $scope.Display_Model.GP_BY_CATEGORY = GP_BY_CATEGORY[0];
                    $scope.H_BAR_CHART('GP_Categories', GP_BY_CATEGORY[0], GP_BY_CATEGORY[0], "string");
                }
                else {
                }
                if (WEEK_ROLLING_GP.length > 0) {
                    $scope.Display_Model.WEEK_ROLLING_GP = WEEK_ROLLING_GP[0];
                    $scope.VERTICAL_GROUP_BAR('Week_Rolling_GP', WEEK_ROLLING_GP[0], WEEK_ROLLING_GP[0], "string");
                    //$scope.V_BAR_CHART('Top_Contributors', VARIANCE_CONTRIBUTORS[0], VARIANCE_CONTRIBUTORS[0], "string");
                }
                else {
                }
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



    $scope.$parent.PI_child_scope = $scope;
});
