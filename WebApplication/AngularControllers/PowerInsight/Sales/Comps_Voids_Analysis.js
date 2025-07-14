app.controller('PI_Comps_VoidController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $localStorage) {

    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(2);
    $scope.$parent.CURRENT_PATH = window.location.hash;
    $scope.$parent.overlay_loading_powerInsight = 'none';
    $scope.Input_Model = {
        GET_PAGE_DATA: true,
        GET_FILTER_DATA: true,
        USER_ID: parseInt($cookies.get("USERID")),
        APP_PAGE_ID: 22,
        DISPLAY_TEXT_SITE: "Select Sites",
        ENTITY_BRANCH_LIST: [],
        WEEK_DATE: new Date(),
        WEEK_NO: 9,
        DD_DEFAULT_TEXT: $scope.$parent.DDL_DISPLAY_TEXT,
        DISPLAY_TEXT_YEAR: $scope.$parent.DDL_DISPLAY_TEXT,
        DISPLAY_TEXT_QUARTERS: $scope.$parent.DDL_DISPLAY_TEXT,
        PERIOD_TYPE_ID: 1,
        SETTING_47: $scope.$parent.MASTER_GET_CUSTOMER_SETTINGS_VALUES(47),
        SELECTED_PERIOD_TYPE: 'Week',
        CONSTRUCTOR_51: 8
    }
    $scope.LOAD_APP_COMPONENTS = 0;
    $scope.GET_THIS_PAGE_COMPONENTS = function () {
        var _app_page_components_list = JSON.parse($localStorage.APP_PAGE_COMPONENTS_LIST);
        $scope.THIS_APP_PAGE_COMPONENTS_LIST = _app_page_components_list.filter(function (x) { return x.APP_PAGE_ID == $scope.Input_Model.APP_PAGE_ID && x.ACTIVE });
        $scope.LOAD_APP_COMPONENTS = 1;
    }
    var Hchart7 = null;
    var Hchart8 = null;
    var container;
    var chart43 = null;
    var chart46 = null;
    var chart42 = null;
    var chart45 = null;
    // Comps_by_Reason
    $scope.DOUGHNUT = function (CHART_NAME, DATA, CHART_DATA, TYPE, COMPONENT_TYPE_ID) {
        $('#' + CHART_NAME).empty();
        if (COMPONENT_TYPE_ID == 42) {
            if (chart42) {
                chart42.destroy();
            }
        }
        else if (COMPONENT_TYPE_ID == 45) {
            if (chart45) {
                chart45.destroy();
            }
        }
        var options8 = {
            chart: {
                height: 300,
                type: 'pie',
            },
            plotOptions: {
                pie: {
                    customScale: 1,
                    dataLabels: {
                        offset: 0,
                        size: 500,
                        _minAngleToShowLabel: 1,
                    }
                }
            },
            labels: CHART_DATA.LABELS,
            series: CHART_DATA.Data,
            dataLabels: {
                enabled: true,
                textAnchor: 'end',
                offsetX: 0,
                offsetY: 0,
                //style: {
                //    colors: ['black']
                //},
                formatter: function (val) {
                    return parseFloat(val).toFixed(0) + "%";
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
                position: "bottom",
                horizontalAlign: "center",
                fontFamily: "Rubik, sans-serif",
                fontSize: "12px",
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
                }
            }],
            tooltip: {
                y: {
                    formatter: function (val, gl, b) {
                        // return val < $scope.$parent.K_M_T_VALUE_INIT ? $scope.$parent.NUMBER_WITH_COMMAS(val) : $scope.$parent.NUMBER_WITH_COMMAS(parseFloat(parseFloat(val) / 1000).toFixed(1)) + 'K';
                        return val + ' | ' + parseFloat(gl.globals.seriesPercent[gl.seriesIndex]).toFixed(0) + "%";
                    },
                }
            },
            //colors:[ '#0890c2' , '#616264' , '#c8cfd7', '#425273', '#d93a50', '#1f3c50', '#794f77', '#ef701f', '#efd658']
            //colors:[ '#eea146' , '#e77924' , '#e44c27', '#ab3a1c', '#30425a', '#3b84a4', '#426579', '#4198a1', '#1cb4bf']
            colors: CHART_DATA.Color,
        }
      

        if (COMPONENT_TYPE_ID == 42) {
            chart42= new ApexCharts(document.querySelector("#" + CHART_NAME), options8);
            chart42.render();
        }
        else if (COMPONENT_TYPE_ID == 45) {
            chart45 = new ApexCharts(document.querySelector("#" + CHART_NAME), options8);
            chart45.render();
        }



    }
    $scope.LINE_AREA = function (CHART_NAME, DATA, CHART_DATA, TYPE) {
        // Comps
        $('#' + CHART_NAME).empty();
        if (chart43) {
            chart43.destroy();
        }
        var options = {
            series: CHART_DATA.LineSeriesList,
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
                type: 'area',
                fontFamily: "Rubik, sans-serif",
                dropShadow: {
                    enabled: true,
                    enabledOnSeries: undefined,
                    top: -5,
                    left: 0,
                    blur: 4,
                    color: '#c8c8c8',
                    opacity: 0.22
                },
            },

            dataLabels: {
                enabled: false
            },
            colors: CHART_DATA.Color,
            stroke: {
                width: 3,
                curve: "smooth",
            },
            xaxis: {
                show: CHART_DATA.ShowXAxis,
                type: 'category',
                categories: CHART_DATA.LABELS,
            },
            yaxis: {
                show: CHART_DATA.ShowYAxis,
                labels: {
                    show: DATA.ShowYAxis,
                    formatter: (val) => {
                        return val < $scope.$parent.K_M_T_VALUE_INIT ? $scope.$parent.NUMBER_WITH_COMMAS(val) : $scope.$parent.NUMBER_WITH_COMMAS(parseFloat(val).toFixed(0) / 1000) + 'K';
                    }
                }
            },
            tooltip: {
                x: {
                    format: 'dd/MM/yy HH:mm'
                },
                y: {
                    formatter: function (val) {
                        return val < $scope.$parent.K_M_T_VALUE_INIT ? $scope.$parent.NUMBER_WITH_COMMAS(val) : $scope.$parent.NUMBER_WITH_COMMAS(parseFloat(parseFloat(val) / 1000).toFixed(1)) + 'K';
                    },
                }
            },
        };

        chart43 = new ApexCharts(document.querySelector("#" + CHART_NAME), options);
        chart43.render();
    }
    $scope.LINE_BAR_AREA = function (CHART_NAME, DATA, CHART_DATA, TYPE) {
        //Voids
        $('#' + CHART_NAME).empty();
        if (chart46) {
            chart46.destroy();
        }

        var options7 = {
            chart: {
                height: 300,
                type: 'line',
                stacked: false,
                fontFamily: "Rubik, sans-serif",
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
            series: CHART_DATA.LineSeriesWithBarList,
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
                show: CHART_DATA.ShowXAxis,
                type: 'week'
            },
            yaxis: [{
                show: CHART_DATA.ShowYAxis,
                labels: {
                    show: DATA.ShowYAxis,
                    formatter: (val) => {
                        return val < $scope.$parent.K_M_T_VALUE_INIT ? $scope.$parent.NUMBER_WITH_COMMAS(val) : $scope.$parent.NUMBER_WITH_COMMAS(val / 1000) + 'K';
                    }
                }
            },
            {
                show: CHART_DATA.ShowY2Axis,
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
                            return y.toFixed(0) + "";
                        }
                        return y;

                    }
                }
            },
            legend: {
                labels: {
                    useSeriesColors: true
                },
            },
            colors: CHART_DATA.Color,
        }
        chart46 = new ApexCharts(document.querySelector("#" + CHART_NAME), options7);
        chart46.render();
    }

    $scope.HORIZONTAL_BAR = function (CHART_NAME, DATA, CHART_DATA, TYPE, COMPONENT_TYPE_ID) {
        //        Voids_by_Employee   
        $('#' + CHART_NAME).empty();
        if (COMPONENT_TYPE_ID == 44) {
            if (Hchart7) {
                Hchart7.destroy();
            }
        }
        else if (COMPONENT_TYPE_ID == 47) {
            if (Hchart8) {
                Hchart8.destroy();
            }
        }
        var options_H = {
            series: CHART_DATA.LineSeriesList,
            chart: {
                type: 'bar',
                fontFamily: "Rubik, sans-serif",
                height: 300,
                //stacked: true,
                dropShadow: {
                    enabled: true,
                    enabledOnSeries: undefined,
                    top: 3,
                    left: 0,
                    blur: 4,
                    color: '#006cff',
                    opacity: 0.2
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

                    //columnWidth: "50%",
                    dataLabels: {
                        position: 'top',
                        show: true,
                        style: {
                            fontFamily: "Rubik, sans-serif",
                        }
                    },
                },
            },
            dataLabels: {
                enabled: true,
                formatter: function (val) {
                    // var percentage =(val * 100 / parseFloat(CHART_DATA.CUMULATIVE_YTD)).toFixed(2);
                    return ((val * 100 / parseFloat(CHART_DATA.CUMULATIVE_YTD)).toFixed(0)) + "%" + " / " + $scope.$parent.NUMBER_WITH_COMMAS(parseFloat(val).toFixed(0)) + "";
                },
                offsetY: 0,
                offsetX: 50,

                style: {
                    fontFamily: "Rubik, sans-serif",
                    fontSize: '10px',
                    fontWeight: 'normal',
                    colors: ["#304758"]
                }
            },
            stroke: {
                width: 0,
                colors: ['#fff']
            },
            // title: {
            //   text: 'Fiction Books Sales'
            // },

            xaxis: {
                categories: CHART_DATA.LABELS,
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
                show: true,
                title: {
                    text: undefined
                },
                labels: {
                    show: true,
                    trim: true,
                    formatter: function (val) {
                        return val.length > 15 ? val.substring(0, 15) + '...' : val;
                    },
                    style: {
                        fontFamily: "Rubik, sans-serif",
                        fontSize: '9px',
                        //fontWeight: 'normal',
                        colors: ["#304758"]
                    },
                },
            },
            tooltip: {
                x: {
                    show: true
                },
                y: {
                    label: {
                        show: false
                    },
                    formatter: function (val) {
                        return ((val * 100 / parseFloat(CHART_DATA.CUMULATIVE_YTD)).toFixed(0)) + "%" + " / " + $scope.$parent.NUMBER_WITH_COMMAS(parseFloat(val).toFixed(0)) + "";
                    },
                }
            },
            fill: {
                opacity: 1
            },
            legend: {
                show: false,
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
            colors: CHART_DATA.Color,
        };
        if (COMPONENT_TYPE_ID == 44) {
            Hchart7 = new ApexCharts(document.querySelector("#" + CHART_NAME), options_H);
            Hchart7.render();
        }
        else if (COMPONENT_TYPE_ID == 47) {
            Hchart8 = new ApexCharts(document.querySelector("#" + CHART_NAME), options_H);
            Hchart8.render();
        }
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
    $scope.DATE_WEEK_PICKER = function (date) {
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
            // container.find('.week_picker_range').trigger('click');
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
            $scope.Input_Model.CONSTRUCTOR_51 = 8;
            $scope.Input_Model.WEEK_NO = weekYear($scope.start_date);
            $scope.Fn_CHANGE_FILTER();
        }
        else if (PERIOD_TYPE_ID == 2) {
            $scope.Input_Model.SELECTED_PERIOD_TYPE = 'Month';
            $scope.Input_Model.CONSTRUCTOR_51 = 7;
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
            $scope.Input_Model.CONSTRUCTOR_51 = 5;
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
            $scope.Input_Model.CONSTRUCTOR_51 = 8;
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
        ModelObj.IS_CALL_ALLOW = 1;
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
                    $scope.SetDisplayObjects(data.data, index);
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
            case 39:
                $scope.Display_Model.Sales = data;
                $scope.Display_Model.Sales_Data = data.Card_SalesSummaryList[0];
                break;
            case 40:
                $scope.Display_Model.Total_Comps = data;
                $scope.Display_Model.Total_Comps_Data = data.Card_SalesSummaryList[0];
                break;
            case 41:
                $scope.Display_Model.Total_Voids = data;
                $scope.Display_Model.Total_Voids_data = data.Card_SalesSummaryList[0];
                break;
            case 42:
                $scope.Display_Model.COMPS_BY_REASON_DATA = data;
                $scope.DOUGHNUT("Comps_by_Reason", data, data, "string", data.COMPONENT_TYPE_ID);
                break;
            case 43:
                $scope.Display_Model.COMPS_DATA = data;
                $scope.LINE_AREA("Comps", data, data, "string");
                break;
            case 44:
                $scope.Display_Model.COMPS_EMPL = data;
                $scope.HORIZONTAL_BAR("Comps_by_Employee", data, data, "string", data.COMPONENT_TYPE_ID);
                break;
            case 45:
                $scope.Display_Model.VOIDS_BY_REASON_DATA = data;
                $scope.DOUGHNUT("Voids_by_Reason", data, data, "string", data.COMPONENT_TYPE_ID);
                break;
            case 46:
                $scope.Display_Model.VOIDS_DATA = data;
                $scope.LINE_BAR_AREA("Voids", data, data, "string");
                break;
            case 47:
                $scope.Display_Model.VOIDS_BY_EMPLOYEE_DATA = data;

                $scope.HORIZONTAL_BAR("Voids_by_Employee", data, data, "string", data.COMPONENT_TYPE_ID);
                break;
            case 48:  //Complimentary
                $scope.Display_Model.Complimentary_C48_List = data.ComplimentaryVoidData_List;
                $scope.Display_Model.HEADER_LIST = data.HEADER_NAME;
                break;
            case 49: //Voids
                $scope.Display_Model.Void_C49_List = data.ComplimentaryVoidData_List;
                $scope.Display_Model.HEADER_LIST = data.HEADER_NAME;
                break;
            case 50:
                $scope.Display_Model.Void_C50_List = data;
                $scope.Display_Model.DISCOUNT_REASON = data.DISCOUNT_REASON;
                break;
            case 51:
                if ($scope.Input_Model.PERIOD_TYPE_ID == 4) {
                    $scope.Input_Model.CONSTRUCTOR_51 = data.voidSummaries[0].RowCount+1;
                };
                $scope.Display_Model.Void_C51_GrpDate_List = data.voidSummaries[0].GrpDate;
                $scope.Display_Model.Void_C51_GrpDay_List = data.voidSummaries[0].GrpDay;
                $scope.Display_Model.Void_C51_List = data.voidSummaries[0];
                $scope.Display_Model.Void_C51_Bottom_List = data.voidSummaries[0].groupDatas.length > 0 ? data.voidSummaries[0].groupDatas[0].UNIT_AMT_BOTTOM : [];
                $scope.Display_Model.Void_C51_Bottom_Total_List = data.voidSummaries[0].groupDatas.length > 0 ? data.voidSummaries[0].groupDatas[0].TOTAL_UNIT_AMT_BOTTOM : [];
                $scope.Display_Model.EMP_C51_List = data.voidSummaries[1];
                $scope.Display_Model.EMP_C51_Bottom_List = data.voidSummaries[1].groupDatas.length > 0 ? data.voidSummaries[1].groupDatas[0].UNIT_AMT_BOTTOM : [];
                $scope.Display_Model.EMP_C51_Bottom_Total_List = data.voidSummaries[1].groupDatas.length > 0 ? data.voidSummaries[1].groupDatas[0].TOTAL_UNIT_AMT_BOTTOM : [];
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
    $scope.DateMonthView();
    $scope.DateQuarterView();
    $scope.$parent.PI_child_scope = $scope;
});