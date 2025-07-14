app.controller('PI_CoversController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $localStorage) {
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(2);
    $scope.$parent.CURRENT_PATH = window.location.hash;
    $scope.$parent.overlay_loading_powerInsight = 'none';
    $scope.Input_Model = {
        GET_PAGE_DATA: true,
        GET_FILTER_DATA: true,
        USER_ID: parseInt($cookies.get("USERID")),
        APP_PAGE_ID: 21,
        DISPLAY_TEXT_SITE: "Select Sites",
        DD_DEFAULT_TEXT: $scope.$parent.DDL_DISPLAY_TEXT,
        DISPLAY_TEXT_YEAR: $scope.$parent.DDL_DISPLAY_TEXT,
        DISPLAY_TEXT_QUARTERS: $scope.$parent.DDL_DISPLAY_TEXT,
        ENTITY_BRANCH_LIST: [],
        WEEK_DATE: new Date(),
        START_DAY_OF_WEEK: 1,
        WEEK_NO: 9,
        PERIOD_TYPE_ID: 1,
        SETTING_47: $scope.$parent.MASTER_GET_CUSTOMER_SETTINGS_VALUES(47),
        SELECTED_PERIOD_TYPE: 'Week',
        //CURRENCY_ID: $cookies.get("CURRENCY_ID"),
        //DISPLAY_TEXT_CURRENCY: $cookies.get("CURRENCY_CODE") + '-' + $cookies.get("CURRENCY_SYMBOL"),
    }
    $scope.START_DAY_OF_WEEK = 1;
    var container;
    $scope.LOAD_APP_COMPONENTS = 0;
    $scope.GET_THIS_PAGE_COMPONENTS = function () {
        var _app_page_components_list = JSON.parse($localStorage.APP_PAGE_COMPONENTS_LIST);
        $scope.THIS_APP_PAGE_COMPONENTS_LIST = _app_page_components_list.filter(function (x) { return x.APP_PAGE_ID == $scope.Input_Model.APP_PAGE_ID && x.ACTIVE });
        $scope.LOAD_APP_COMPONENTS = 1;
    }
    $scope.BAR_CHART = function (CHART_NAME, DATA, CHART_DATA, TYPE) {
        //Reservations_by_Source
        $('#' + CHART_NAME).empty();
        var options = {
            series: CHART_DATA.SERIESDATALIST,
            chart: {
                type: 'bar',
                height: 245,
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
                    top: 0,
                    left: 4,
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
            dataLabels: {
                formatter: (val) => {
                    return parseFloat(val).toFixed(0) + '%'
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
                tickAmount: 100,

                //categories: ['M-6', 'M-5', 'M-4', 'M-3', 'M-2', 'M-1', 'CM'],
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

                // min: 0,
                // max: 100,
                labels: {
                    show: true
                }
            }
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
                fontFamily: 'Rubik, sans-serif',
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
                padding: {
                    left: 40,
                    right: 20 // Also you may want to increase this (based on the length of your labels)
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
                categoriesX: CHART_DATA.DISPLAY_DATA,
                tickAmount: 10,
                labels: {
                    show: CHART_DATA.SHOWXAXIS,
                    //rotate: -90,
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
                    formatter: (val) => {
                        return val < $scope.$parent.K_M_T_VALUE_INIT ? $scope.$parent.NUMBER_WITH_COMMAS(val) : $scope.$parent.NUMBER_WITH_COMMAS(val / 1000) + 'K';
                    }
                }
            }, tooltip: {
                y: {
                    formatter: function (val) {
                        return $scope.$parent.NUMBER_WITH_COMMAS(val);
                    }
                },
                x: {
                    formatter: function (x, opts, m) {
                        var Header = opts.w.globals.categoryLabels[opts.dataPointIndex];
                        if ($scope.Input_Model.PERIOD_TYPE_ID == 3 || $scope.Input_Model.PERIOD_TYPE_ID == 4) {
                            Header = opts.w.globals.initialConfig.xaxis.categoriesX[opts.dataPointIndex];
                        }
                        return Header;
                    }
                },
            },
        };
        var ChartOutput = new ApexCharts(document.querySelector("#" + CHART_NAME), ChartOutputOption);
        ChartOutput.render();
    };
    $scope.LINE_CHART = function (CHART_NAME, DATA, HEADER_DATA, TYPE) {
        $('#' + CHART_NAME).empty();
        var Lineoptions = {
            series: DATA.ChartOutputData,
            chart: {
                height: 250,
                type: 'line',
                fontFamily: 'Rubik, sans-serif',
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
                    show: DATA.ShowXAxis,
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
                show: DATA.ShowYAxis,
                // min: 0,
                // max: 28,
                labels: {
                    show: DATA.ShowYAxis,
                    formatter: (val) => {
                        return val < $scope.$parent.K_M_T_VALUE_INIT ? $scope.$parent.NUMBER_WITH_COMMAS(val) : $scope.$parent.NUMBER_WITH_COMMAS(val / 1000) + 'K';
                    }
                }
            }, tooltip: {
                y: {
                    formatter: function (val) {
                        return $scope.$parent.NUMBER_WITH_COMMAS(val);
                    }
                }
            },
        };
        var LineChart = new ApexCharts(document.querySelector("#" + CHART_NAME), Lineoptions);
        LineChart.render();
    };
    $scope.HEAT_CHART = function (CHART_NAME, DATA, CHART_DATA, TYPE) {
        //Heat_Map 
        //var options = {

        //    plotOptions: {
        //        heatmap: {
        //            shadeIntensity: 0.5,
        //            radius: 0,
        //            useFillColorAsStroke: true,
        //            colorScale: {
        //                ranges: [{
        //                    from: 0,
        //                    to: 4,
        //                    name: 'Low (< 5)',
        //                    color: '#ff9ab5'
        //                },
        //                {
        //                    from: 5,
        //                    to: 10,
        //                    name: 'Medium (5-10)',
        //                    color: '#70c1ff'
        //                },
        //                {
        //                    from: 11,
        //                    to: 100,
        //                    name: 'High (> 10)',
        //                    color: '#4fe4a8'
        //                },
        //                    // {
        //                    //   from: 46,
        //                    //   to: 55,
        //                    //   name: 'extreme',
        //                    //   color: '#FF0000'
        //                    // }
        //                ]
        //            }
        //        }
        //    },
        //    dataLabels: {
        //        enabled: true,
        //        style: {
        //            colors: ['#626262'],
        //        },
        //    },
        //    stroke: {
        //        width: 1
        //    },
        //    title: {
        //        //text: 'HeatMap Chart with Color Range'
        //    },
        //    legend: {
        //        position: 'bottom',
        //        horizontalAlign: 'center',
        //        fontFamily: "Rubik, sans-serif",
        //    },
        //};
        //var chart = new ApexCharts(document.querySelector("#" + CHART_NAME), options);
        //chart.render();


        $('#' + CHART_NAME).empty();
        //Hourly_Headcount 
        var options = {
            series: CHART_DATA.HeatMapDataList,
            chart: {
                height: 280,
                type: 'heatmap',
                dropShadow: {
                    enabled: true,
                    enabledOnSeries: undefined,
                    top: 5,
                    left: 0,
                    blur: 6,
                    color: '#000',
                    opacity: 0.15
                },
                zoom: {
                    enabled: $scope.APPLY_ZOOM
                },
                toolbar: {
                    show: false
                }
            },
            plotOptions: {
                heatmap: {
                    shadeIntensity: 0.5,
                    radius: 0,
                    useFillColorAsStroke: true,
                    colorScale: {
                        ranges: [{
                            from: 1,
                            to: CHART_DATA.MedianstarttoMin,
                            name: 'Low (< ' + CHART_DATA.MedianstarttoMin + ')',
                            color: '#ff9ab5'
                        },
                        {
                            from: CHART_DATA.MedianstarttoMin + 0.1,
                            to: CHART_DATA.Median,
                            name: 'Medium (' + CHART_DATA.MedianstarttoMin + '-' + CHART_DATA.Median + ')',
                            color: '#70c1ff'
                        },
                        {
                            from: CHART_DATA.Median + 0.1,
                            to: CHART_DATA.MAX,

                            name: 'High (> ' + CHART_DATA.Median + ')',
                            color: '#4fe4a8'
                        },
                            // {
                            //   from: 46,
                            //   to: 55,
                            //   name: 'extreme',
                            //   color: '#FF0000'
                            // }
                        ]
                    }
                }
            },
            dataLabels: {
                enabled: true,
                style: {
                    colors: ['#626262'],
                },
            },
            stroke: {
                width: 1
            },
            title: {
                //text: 'HeatMap Chart with Color Range'
            },
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                fontFamily: "Rubik, sans-serif",
            },
            xaxis: {
                show: CHART_DATA.SHOWXAXIS,
                labels: {
                    rotate: -45,
                    rotateAlways: true,
                }
            },
            yaxis: [{
                show: CHART_DATA.SHOWYAXIS,
                labels: {
                },
            },
            {
                show: CHART_DATA.SHOWY2AXIS,
                opposite: true,
                labels: {
                    formatter: (val) => {
                        return val < $scope.$parent.K_M_T_VALUE_INIT ? $scope.$parent.NUMBER_WITH_COMMAS(val) : $scope.$parent.NUMBER_WITH_COMMAS(val / 1000) + 'K';
                    }
                },
            }],
            labels: CHART_DATA.LABELS,
        };

        var chart = new ApexCharts(document.querySelector("#" + CHART_NAME), options);
        chart.render();
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
    $scope.DATE_WEEK_RANGE_PICKER = function (date, FLAG) {
        var display, input, datepicker, dates;
        dates = [];
        container = $('#week-picker-range');
        input = $('#firstDate');
        display = container.find('.form-control');
        var startDate;
        var endDate;

        function getWeekStartEnd(start, end, HitAllow) {
            if (start == undefined) {
                start = new Date();
            }
            if (end == undefined) {
                end = new Date(start);
            }
            start.setDate(start.getDate() - start.getDay() + parseInt($scope.START_DAY_OF_WEEK));
            if (end.getDay() == 0) {
                end.setDate(end.getDate() - end.getDay());
            }
            else {
                end.setDate(end.getDate() - end.getDay() + 6 + parseInt($scope.START_DAY_OF_WEEK));
            }

            startDate = start;
            endDate = end;
            //display.html($filter('DISPLAY_RANGE_START_DATE')(startDate, 'dd/MM/yyyy') + ' - ' + $filter('date')(endDate, 'dd/MM/yyyy'));
            if (HitAllow == 1) {
                $scope.HIT_ALLOW = 1;

                $scope.Input_Model.START_DATE = startDate;
                $scope.Input_Model.END_DATE = endDate;

                $scope.Input_Model.PERIOD_START_DATE = angular.copy(startDate);
                $scope.Input_Model.PERIOD_END_DATE = angular.copy(endDate);


                $scope.Fn_CHANGE_FILTER();
                $('.datepicker').hide();

            }
        }
        function selectWeek() {
            container.find(".selected a").addClass('ui-state-active');
        }
        getWeekStartEnd(undefined, undefined, 1);
        container.datepicker({
            weekStart: parseInt($scope.START_DAY_OF_WEEK),
            // dateFormat: dateFormat,
            showOtherMonths: true,
            changeMonth: true,
            changeYear: true,
            selectOtherMonths: true,
            calendarWeeks: true,
            // autoclose: true,
            beforeShowDay: function (date) {
                //var i, j;
                //for (i = 0, j = dates.length; i < j; i += 1) {
                //    if (dates[i].getTime() === date.getTime()) {
                //        return { classes: 'active' };
                //    }
                //}
                //var dayClass = "";
                if (date >= startDate && date <= endDate) {
                    return { classes: 'active' };
                }
                //return [true, dayClass];
            }
        }).data("selected", false).on("changeDate", function (dt, inst) {
            if ($(this).data("selected")) {
                endDate = dt.date;
                $(this).data("selected", false);
                getWeekStartEnd(startDate, endDate, 1);
            } else {
                startDate = dt.date;
                $(this).data("selected", true);
                getWeekStartEnd(startDate);
            }
        });
        datepicker = container.data('datepicker');

        // This take weekStart option as a week base
        // But it can be removed if needed
        function setDates(date) {
            var diffToWeekStart, weekStart, i, nd;
            diffToWeekStart = datepicker.o.weekStart - date.getDay();
            if (diffToWeekStart > 0) {
                diffToWeekStart = diffToWeekStart - 7;
            }

            // Getting first day of the week
            weekStart = new Date(date.valueOf());
            weekStart.setDate(weekStart.getDate() + diffToWeekStart);
            //input.val(weekStart.toISOString());

            // Saving week days
            dates = [];
            for (i = 0; i < 7; i += 1) {
                nd = new Date(weekStart.valueOf());
                nd.setDate(nd.getDate() + i);
                dates.push(nd);
            }
            datepicker.update();
        }
        function setDisplay() {
        }
        function ajaxCall() {
            $("#belowContainer").load('@(Url.Action("Getcourses","Home",null, Request.Url.Scheme))?dateVal=' + dates[0]);
        }
        container.on('changeDate', function () {
            setDates(datepicker.getDate());
            //setDisplay();
            ajaxCall();
        });
        // Propagate display click to bootstrap group-addon
        display.on('click', function () {
            container.find('.week_picker_range').trigger('click');
        });
    };
    $scope.QuartersList = [];
    $scope.DATE_QUARTER_VIEW_LOAD = function (eDate, FLAG) {
        $scope.QuartersList = $scope.$parent.getFiscalQuarterDates(new Date(eDate).getFullYear(), new Date(eDate)).split(',');
        $scope.Input_Model.START_DATE = new Date($scope.QuartersList[0]);
        $scope.Input_Model.END_DATE = new Date($scope.QuartersList[1]);
        $scope.Input_Model.WEEK_NO = $scope.QuartersList[2];
        const normalizeDate = (str) => new Date(str).toISOString().split("T")[0];
        if (FLAG == 1 && normalizeDate(new Date($scope.Input_Model.START_DATE)) !== normalizeDate(new Date($scope.Input_Model.QUARTER_START_DATE))) {
            $scope.Fn_CHANGE_FILTER()
        }
        $scope.Input_Model.DISPLAY_QUARTER_START_DATE = $filter('date')($scope.Input_Model.START_DATE, "dd/MM/yyyy") + " - " + $filter('date')($scope.Input_Model.END_DATE, "dd/MM/yyyy");
        $scope.Input_Model.QUARTER_START_DATE = angular.copy(new Date($scope.QuartersList[0]));
        $scope.Input_Model.QUARTER_END_DATE = angular.copy(new Date($scope.QuartersList[1]));
        if (FLAG == 3) {
            $(".QuarterView").datepicker("setDate", $scope.Input_Model.START_DATE);
        }
    };
    $scope.DATE_MONTH_VIEW_LOAD = function (eDate, FLAG) {
        const year = eDate.getFullYear();
        const month = eDate.getMonth();
        const startDate = $scope.$parent.getStartOfMonth(year, month);
        const endDate = $scope.$parent.getEndOfMonth(year, month);
        $scope.Input_Model.START_DATE = startDate;
        $scope.Input_Model.END_DATE = endDate;
        $scope.Input_Model.WEEK_NO = new Date(startDate).getMonth() + 1;
        $scope.Input_Model.MONTH_START_DATE = angular.copy(startDate);
        $scope.Input_Model.MONTH_END_DATE = angular.copy(endDate);
        if (FLAG == 2) {
            $(".MonthView").datepicker("setDate", $scope.Input_Model.START_DATE);
        }
    }
    $scope.DateMonthView = function () {
        $(document).ready(function () {
            var date_inputsMonth = document.getElementsByClassName("MonthView") //our date input has the name "date"
            if (date_inputsMonth.length > 0) {
                for (var i = 0; i < date_inputsMonth.length; i++) {
                    var date_inputMonth = $('input[name="' + date_inputsMonth[i].name + '"]'); //our date input has the name "date"
                    var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
                    var options = {
                        format: "mm/yyyy",
                        viewMode: "months",
                        minViewMode: "months",
                        autoclose: true,
                        clearBtn: true,
                        closeText: 'nasur',
                    };
                    date_inputMonth.datepicker(options).on("hide", function (e) {
                        if (e != undefined) {
                            if ($scope.Input_Model.PERIOD_TYPE_ID == 2) {
                                if ($scope.Input_Model.M_HISTORY_START_DATE == undefined || new Date($scope.Input_Model.M_HISTORY_START_DATE).getMonth() !== new Date(e.date).getMonth()) {
                                    $scope.Input_Model.M_HISTORY_START_DATE = e.date;
                                    $scope.DATE_MONTH_VIEW_LOAD(e.date);
                                    $scope.Fn_CHANGE_FILTER()
                                }
                            }
                        }
                    });
                }
            }
        });
    }
    $scope.DateQuarterView = function () {
        $(document).ready(function () {
            var date_inputs = document.getElementsByClassName("QuarterView") //our date input has the name "date"
            if (date_inputs.length > 0) {
                for (var i = 0; i < date_inputs.length; i++) {
                    var date_input = $('input[name="' + date_inputs[i].name + '"]'); //our date input has the name "date"
                    var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
                    var options = {
                        format: "mm/yyyy",
                        viewMode: "months",
                        minViewMode: "months",
                        autoclose: true,
                        clearBtn: true,
                        closeText: 'nasur',
                    };
                    date_input.datepicker(options).on("hide", function (e) {
                        if (e != undefined) {
                            if ($scope.Input_Model.PERIOD_TYPE_ID == 3) {
                                $scope.DATE_QUARTER_VIEW_LOAD(e.date, 1);
                            }
                        }
                    });
                }
            }
        });
    }
    $scope.FILTER_BY_PERIOD_TYPE_Fn = function (PERIOD_TYPE_ID) {
        $scope.Input_Model.PERIOD_TYPE_ID = PERIOD_TYPE_ID;
        if (PERIOD_TYPE_ID == 1) {
            $scope.Input_Model.SELECTED_PERIOD_TYPE = 'Week';
            $scope.Input_Model.START_DATE = $scope.start_date;
            $scope.Input_Model.END_DATE = $scope.end_date;
            $scope.Input_Model.WEEK_NO = weekYear($scope.start_date);
            $scope.Fn_CHANGE_FILTER();
        }
        else if (PERIOD_TYPE_ID == 2) {
            $scope.Input_Model.SELECTED_PERIOD_TYPE = 'Month';
            if ($scope.Input_Model.MONTH_START_DATE == undefined || $scope.Input_Model.MONTH_START_DATE == null || $scope.Input_Model.MONTH_START_DATE == '') {
                $scope.Input_Model.M_HISTORY_START_DATE = new Date($scope.Input_Model.START_DATE);
                $scope.DATE_MONTH_VIEW_LOAD(new Date($scope.Input_Model.START_DATE), 2);
            }
            else {
                $scope.Input_Model.START_DATE = angular.copy($scope.Input_Model.MONTH_START_DATE);
                $scope.Input_Model.END_DATE = angular.copy($scope.Input_Model.MONTH_END_DATE);
            }
            $scope.Input_Model.WEEK_NO = new Date($scope.Input_Model.MONTH_START_DATE).getMonth() + 1;
            $scope.Fn_CHANGE_FILTER();
        }
        else if (PERIOD_TYPE_ID == 3) {
            $scope.Input_Model.SELECTED_PERIOD_TYPE = 'Quarter';
            if ($scope.Input_Model.QUARTER_START_DATE == undefined || $scope.Input_Model.QUARTER_START_DATE == null || $scope.Input_Model.QUARTER_START_DATE == '') {
                $scope.DATE_QUARTER_VIEW_LOAD(new Date($scope.Input_Model.START_DATE), 3);
            }
            else {
                $scope.Input_Model.START_DATE = angular.copy($scope.Input_Model.QUARTER_START_DATE);
                $scope.Input_Model.END_DATE = angular.copy($scope.Input_Model.QUARTER_END_DATE);
                $scope.Input_Model.WEEK_NO = $scope.QuartersList[2];
                $scope.Input_Model.DISPLAY_QUARTER_START_DATE = $filter('date')($scope.Input_Model.START_DATE, "dd/MM/yyyy") + " - " + $filter('date')($scope.Input_Model.END_DATE, "dd/MM/yyyy");

            }
            $scope.Fn_CHANGE_FILTER();
        }
        else if (PERIOD_TYPE_ID == 4) {
            if (container == null) {
                $scope.DATE_WEEK_RANGE_PICKER();
            }
            $scope.Input_Model.SELECTED_PERIOD_TYPE = 'Period';
            if ($scope.HIT_ALLOW == 1) {
                $scope.Input_Model.START_DATE = angular.copy($scope.Input_Model.PERIOD_START_DATE);
                $scope.Input_Model.END_DATE = angular.copy($scope.Input_Model.PERIOD_END_DATE);
                $scope.Fn_CHANGE_FILTER();
            }
        }

    }

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
            _pi_input_model_obj.PERIOD_TYPE_ID = $scope.Input_Model.PERIOD_TYPE_ID;
            _pi_input_model_obj.SETTING_47 = $scope.Input_Model.SETTING_47;
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
            case 31:
                $scope.Display_Model.COVERS_AREA_SESSION_LIST = data.COVERS_AREA_SESSION_LIST;
                break;
            case 32:
                $scope.Display_Model.COVERS_BY_SESSION_LIST = data.COVERS_AREA_SESSION_LIST;
                break;
            case 33:
                $scope.Display_Model.RESERVATIONS_BY_SOURCE_LIST = data;
                $scope.BAR_CHART("Reservations_by_Source", data, data.ChartOutputData, "string");
                break;
            case 34:
                $scope.Display_Model.RESERVATIONS_STATUS_LIST = data;
                break;
            case 35:
                $scope.Display_Model.AVERAGE_SPEND_BY_AREA_LIST = data.COVERS_AREA_SESSION_LIST;
                break;
            case 36:
                $scope.Display_Model.AVERAGE_SPEND_BY_SESSION_LIST = data.COVERS_AREA_SESSION_LIST;
                break;
            case 37:
                $scope.Display_Model.PARTY_SIZE_LIST = data;
                break;
            case 38:
                $scope.Display_Model.HEAT_MAP = data;
                data.Median = parseInt((data.MAX + data.MIN) / 2);
                data.MedianstarttoMin = parseInt((data.MIN + data.Median) / 2);
                $scope.HEAT_CHART("Heat_Map", data, data, "string");
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
        $scope.GetChartData(1);
    };
    if ($scope.$parent.PI_INDEX_JS_LOAD == 2) {
        $scope.CONTROLLER_LOAD();
    };
    $scope.SESSION_MTD_VALUE = 0;
    $scope.SESSION_YTD_VALUE = 0;
    $scope.AREA_MTD_VALUE = 0;
    $scope.AREA_YTD_VALUE = 0;
    $scope.SPEND_MTD_VALUE = 0;
    $scope.SPEND_YTD_VALUE = 0;
    $scope.AVERAGE_MTD_VALUE = 0;
    $scope.AVERAGE_YTD_VALUE = 0;

    $scope.$on('ngRepeatFinishedCoversByAreaRender', function (ngRepeatFinishedEvent) {
        $scope.AREA_MTD_VALUE = 0;
        $scope.AREA_YTD_VALUE = 0;
        angular.forEach($scope.Display_Model.COVERS_AREA_SESSION_LIST, function (Cover_Session, index) {
            let MTD_VALUE = Cover_Session.MTD_VALUE.replace(",", "");
            let YTD_VALUE = Cover_Session.YTD_VALUE.replace(",", "");

            $scope.AREA_MTD_VALUE = parseFloat($scope.AREA_MTD_VALUE) + parseFloat(MTD_VALUE);
            $scope.AREA_YTD_VALUE = parseFloat($scope.AREA_YTD_VALUE) + parseFloat(YTD_VALUE);

            $scope.Fn_BIND_CHART("area_restaurant_chart_" + index, Cover_Session, Cover_Session.ChartOutputData, "string");
        });
        $scope.$parent.TOOLTIP_ENABLE_Fn();
    });
    $scope.$on('ngRepeatFinishedCoversBySessionRender', function (ngRepeatFinishedEvent) {
        $scope.SESSION_MTD_VALUE = 0;
        $scope.SESSION_YTD_VALUE = 0;
        angular.forEach($scope.Display_Model.COVERS_BY_SESSION_LIST, function (Cover_Session, index) {
            let MTD_VALUE = Cover_Session.MTD_VALUE.replace(",", "");
            let YTD_VALUE = Cover_Session.YTD_VALUE.replace(",", "");

            $scope.SESSION_MTD_VALUE = parseFloat($scope.SESSION_MTD_VALUE) + parseFloat(MTD_VALUE);
            $scope.SESSION_YTD_VALUE = parseFloat($scope.SESSION_YTD_VALUE) + parseFloat(YTD_VALUE);
            $scope.Fn_BIND_CHART("brkfst_session_chart_" + index, Cover_Session, Cover_Session.ChartOutputData, "string");
        });
        $scope.$parent.TOOLTIP_ENABLE_Fn();
    });
    $scope.$on('ngRepeatFinishedAverageSpendByAreaRender', function (ngRepeatFinishedEvent) {
        $scope.AVERAGE_SPEND_MTD_VALUE = 0;
        $scope.AVERAGE_SPEND_YTD_VALUE = 0;
        angular.forEach($scope.Display_Model.AVERAGE_SPEND_BY_AREA_LIST, function (Cover_Session, index) {

            let MTD_VALUE = Cover_Session.MTD_VALUE.replace(",", "");
            let YTD_VALUE = Cover_Session.YTD_VALUE.replace(",", "");

            $scope.AVERAGE_SPEND_MTD_VALUE = parseFloat($scope.AVERAGE_SPEND_MTD_VALUE) + parseFloat(MTD_VALUE);
            $scope.AVERAGE_SPEND_YTD_VALUE = parseFloat($scope.AVERAGE_SPEND_YTD_VALUE) + parseFloat(YTD_VALUE);
            $scope.Fn_BIND_CHART("Restaurant_spend_chart_" + index, Cover_Session, Cover_Session.ChartOutputData, "string");
        });
        $scope.$parent.TOOLTIP_ENABLE_Fn();
    });
    $scope.$on('ngRepeatFinishedAverageSpendBySessionRender', function (ngRepeatFinishedEvent) {
        $scope.AVERAGE_SESSION_MTD_VALUE = 0;
        $scope.AVERAGE_SESSION_YTD_VALUE = 0;
        angular.forEach($scope.Display_Model.AVERAGE_SPEND_BY_SESSION_LIST, function (Cover_Session, index) {

            let MTD_VALUE = Cover_Session.MTD_VALUE.replace(",", "");
            let YTD_VALUE = Cover_Session.YTD_VALUE.replace(",", "");

            $scope.AVERAGE_SESSION_MTD_VALUE = parseFloat($scope.AVERAGE_SESSION_MTD_VALUE) + parseFloat(MTD_VALUE);
            $scope.AVERAGE_SESSION_YTD_VALUE = parseFloat($scope.AVERAGE_SESSION_YTD_VALUE) + parseFloat(YTD_VALUE);

            $scope.Fn_BIND_CHART("Breakfast_session_chart_" + index, Cover_Session, Cover_Session.ChartOutputData, "string");
        });
        $scope.$parent.TOOLTIP_ENABLE_Fn();
    });
    $scope.DateMonthView();
    $scope.DateQuarterView();
    $scope.$parent.PI_child_scope = $scope;
});
