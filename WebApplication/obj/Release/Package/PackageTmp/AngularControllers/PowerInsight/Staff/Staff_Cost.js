app.controller('PI_Staff_CostController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $localStorage) {
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(2);
    $scope.$parent.CURRENT_PATH = window.location.hash;
    $scope.$parent.overlay_loading_powerInsight = 'none';
    $scope.Input_Model = {
        GET_PAGE_DATA: true,
        GET_FILTER_DATA: true,
        USER_ID: parseInt($cookies.get("USERID")),
        APP_PAGE_ID: 34,
        DISPLAY_TEXT_SITE: "Select Sites",
        ENTITY_BRANCH_LIST: [],
        WEEK_DATE: new Date(),
        START_DAY_OF_WEEK: 1,
        WEEK_NO: 9,
        WEEK_SELECTED_SALES_PER_HOR_TEXT: 'All',
        DEFAULT_DISPLAY: 'All',
        WEEK_DISPLAY_TEXT_1: 'All',
        WEEK_SELECTED_SALES_PER_DAY_TEXT: 'All',
        HOURLY_WAGE_COST_TEXT: 'All',
        SHOW_WAGE_COST: false,
        SELECTED_STAFF_COST: 'Current Week',
        //CURRENCY_ID: $cookies.get("CURRENCY_ID"),
        //DISPLAY_TEXT_CURRENCY: $cookies.get("CURRENCY_CODE") + '-' + $cookies.get("CURRENCY_SYMBOL"),
    }

    $scope.START_DAY_OF_WEEK = 1;
    $scope.WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    $scope.STAFF_COST_LIST = [{ ID: 1, NAME: "Current Week" }, { ID: 3, NAME: "6 Rolling Months" }, { ID: 4, NAME: "12 Rolling Months" }, { ID: 2, NAME: "13 Rolling Week" }]
    $scope.LOAD_APP_COMPONENTS = 0;
    $scope.GET_THIS_PAGE_COMPONENTS = function () {
        var _app_page_components_list = JSON.parse($localStorage.APP_PAGE_COMPONENTS_LIST);
        $scope.THIS_APP_PAGE_COMPONENTS_LIST = _app_page_components_list.filter(function (x) { return x.APP_PAGE_ID == $scope.Input_Model.APP_PAGE_ID && x.ACTIVE });
        $scope.LOAD_APP_COMPONENTS = 1;
    }
    $scope.HEAT_CHART = function (CHART_NAME, DATA, CHART_DATA, TYPE) {
        $('#' + CHART_NAME).empty();
        //Hourly_Headcount 
        var options = {
            series: CHART_DATA.HeatMapDataList,
            chart: {
                height: 300,
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
                            from: CHART_DATA.MIN,
                            to: CHART_DATA.MedianstarttoMin,
                            name: 'Low (< ' + CHART_DATA.MedianstarttoMin + ')',
                            color: '#4fe4a8'
                        },
                        {
                            from: CHART_DATA.MedianstarttoMin + 1,
                            to: CHART_DATA.Median,
                            name: 'Medium (' + CHART_DATA.MedianstarttoMin + '-' + CHART_DATA.Median + ')',
                            color: '#9a803a'
                        },
                        {
                            from: CHART_DATA.Median + 1,
                            to: CHART_DATA.MAX,
                            name: 'High (> ' + CHART_DATA.Median + ')',
                            color: '#ff9ab5'
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
                },
            },
            yaxis: [{
                show: CHART_DATA.SHOWYAXIS,
                labels: {

                    //formatter: (val) => {
                    //    return val < $scope.$parent.K_M_T_VALUE_INIT ? $scope.$parent.NUMBER_WITH_COMMAS(val) : $scope.$parent.NUMBER_WITH_COMMAS(val / 1000) + 'K';
                    //}
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
                labels: {
                    show: CHART_DATA.SHOWYAXIS,
                    formatter: (val) => {
                        return val < $scope.$parent.K_M_T_VALUE_INIT ? $scope.$parent.NUMBER_WITH_COMMAS(val) : $scope.$parent.NUMBER_WITH_COMMAS(val / 1000) + 'K';
                    }
                },
            }, tooltip: {
                y: {
                    formatter: function (val) {
                        return $scope.$parent.NUMBER_WITH_COMMAS(val);
                    }
                }
            },
        };
        var ChartOutput = new ApexCharts(document.querySelector("#" + CHART_NAME), ChartOutputOption);
        ChartOutput.render();
    };
    $scope.AREA_LINE_BAR_CHART = function (CHART_NAME, DATA, CHART_DATA, TYPE) {
        //Avg_Staff_Cost_vs_Revenue
        $('#' + CHART_NAME).empty();
        //var optionsbar = {
        //    series: CHART_DATA.MULTISERIESDATALIST,
        //    chart: {
        //        height: 250,
        //        type: 'line',
        //        stacked: false,
        //        zoom: {
        //            enabled: $scope.APPLY_ZOOM
        //        },
        //        toolbar: {
        //            show: false,
        //        },
        //    },
        //    stroke: {
        //        width: [1, 1, 4]
        //    },
        //    plotOptions: {
        //    },
        //    dataLabels: {
        //        enabled: false
        //    },
        //    stroke: {
        //        width: [1, 1, 3],
        //        curve: "smooth",
        //    },
        //    title: {
        //        align: 'left',
        //    },
        //    xaxis: {
        //        show: CHART_DATA.SHOWXAXIS,
        //        categories: CHART_DATA.LABELS,
        //    },
        //    yaxis: [
        //        {
        //            seriesName: 'Sales',
        //            show: true, //CHART_DATA.SHOWY2AXIS,
        //            opposite: true,
        //            labels: {
        //                show: true,
        //                formatter: (val) => {
        //                    return val < $scope.$parent.K_M_T_VALUE_INIT ? $scope.$parent.NUMBER_WITH_COMMAS(parseFloat(val).toFixed(0)) : $scope.$parent.NUMBER_WITH_COMMAS(parseFloat(val).toFixed(0) / 1000) + 'K';
        //                }
        //            },
        //            title: {
        //                style: {
        //                    color: '#00E396',
        //                }
        //            },
        //        },
        //        {
        //            seriesName: 'Actual Hrs.',
        //            show: true, // CHART_DATA.SHOWYAXIS,
        //            logarithmic: true,
        //            labels: {
        //                show: CHART_DATA.SHOWYAXIS,
        //                formatter: (val) => {
        //                    return val < $scope.$parent.K_M_T_VALUE_INIT ? $scope.$parent.NUMBER_WITH_COMMAS(parseFloat(val).toFixed(0)) : $scope.$parent.NUMBER_WITH_COMMAS(parseFloat(val).toFixed(0) / 1000) + 'K';
        //                }
        //            },
        //        },

        //    ],
        //    tooltip: {
        //        y: {
        //            formatter: function (y) {
        //                if (y == undefined) {
        //                    return "";
        //                }
        //                else {
        //                    return $scope.$parent.NUMBER_WITH_COMMAS(y.toFixed(0));
        //                }
        //            }
        //        },
        //        x: {
        //            formatter: function (x) {
        //                return $scope.$parent.NUMBER_WITH_COMMAS(x.toFixed(0));
        //            }
        //        },
        //    },
        //    legend: {
        //        horizontalAlign: 'center',
        //        fontFamily: 'Rubik, sans-serif',
        //    },
        //    colors: CHART_DATA.COLORS,
        //}
        //var chartbar = new ApexCharts(document.querySelector("#" + CHART_NAME), optionsbar);
        //chartbar.render();

        var options = {
            series: CHART_DATA.MULTISERIESDATALIST,
            chart: {
                height: 250,
                type: 'line',
                stacked: false,
                dropShadow: {

                    enabledOnSeries: undefined,
                    top: -5,
                    left: 0,
                    blur: 4,
                    color: '#888788',
                    opacity: 0.22
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
                zoom: {
                    enabled: $scope.APPLY_ZOOM
                },
            },
            plotOptions: {
                bar: {
                    borderRadius: 5,
                    borderRadiusApplication: "end",
                    borderRadiusWhenStacked: "first",
                    columnWidth: "50%",
                },
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                width: [1, 1, 3, 3],
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
            },
            colors: CHART_DATA.COLORS,
            yaxis: [
                {
                    seriesName: ['Actual Hrs.', 'Scheduled Hrs.'],
                    showAlways: true,
                    show: true,
                    axisTicks: {
                        show: true,
                    },
                    axisBorder: {
                        show: true,
                        color: '#008FFB'
                    },
                    labels: {
                        style: {
                            colors: '#008FFB',
                        },
                        show: CHART_DATA.SHOWYAXIS,
                        formatter: (val) => {
                            return val < $scope.$parent.K_M_T_VALUE_INIT ? $scope.$parent.NUMBER_WITH_COMMAS(parseFloat(val).toFixed(0)) : $scope.$parent.NUMBER_WITH_COMMAS(parseFloat(val).toFixed(0) / 1000) + 'K';
                        }
                    },
                    title: {
                        //text: "Income (thousand crores)",
                        style: {
                            color: '#008FFB',
                        }
                    },
                    tooltip: {
                        //enabled: true
                    }
                }, {
                    seriesName: ['Staff Cost', 'Sales'],
                    showAlways: true,
                    show: true,
                    opposite: true,
                    axisTicks: {
                        show: true,
                    },
                    axisBorder: {
                        show: true,
                        color: '#008FFB'
                    },
                    labels: {
                        style: {
                            colors: '#008FFB',
                        },
                        show: CHART_DATA.SHOWYAXIS,
                        formatter: (val) => {
                            return val < $scope.$parent.K_M_T_VALUE_INIT ? $scope.$parent.NUMBER_WITH_COMMAS(parseFloat(val).toFixed(0)) : $scope.$parent.NUMBER_WITH_COMMAS(parseFloat(val).toFixed(0) / 1000) + 'K';
                        }
                    },
                    title: {
                        //text: "Income (thousand crores)",
                        style: {
                            color: '#008FFB',
                        }
                    },
                    tooltip: {
                        //enabled: true
                    }
                },
            ],
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
            },
            legend: {
                horizontalAlign: 'center',
                offsetX: 40,
                fontFamily: 'Rubik, sans-serif',
                fontWeight: 400,
            }
        };

        var chart = new ApexCharts(document.querySelector("#" + CHART_NAME), options);
        chart.render();
    }
    $scope.AREA_LINE_BAR_STAFF_CHART = function (CHART_NAME, DATA, CHART_DATA, TYPE) {
        $('#' + CHART_NAME).empty();
        var optionsstaff = {
            chart: {
                height: 250,
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
                    borderRadius: 1,
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
            tickAmount: 13,
            labels: CHART_DATA.LABELS,
            markers: {
                size: 0
            },
            // xaxis: {
            //     type:'week'
            // },
            yaxis: [
                {
                    show: CHART_DATA.SHOWYAXIS,
                    showAlways: true,
                    axisTicks: {
                        show: true,
                    },
                    axisBorder: {
                        show: true,
                        color: '#008FFB'
                    },
                    labels: {
                        show: CHART_DATA.SHOWYAXIS,
                        style: {
                            colors: '#008FFB',
                        },
                        formatter: (val) => {
                            return val < $scope.$parent.K_M_T_VALUE_INIT ? $scope.$parent.NUMBER_WITH_COMMAS(val) : $scope.$parent.NUMBER_WITH_COMMAS(val / 1000) + 'K';
                        }
                    },

                    title: {
                        //text: "Income (thousand crores)",
                        style: {
                            color: '#008FFB',
                        }
                    },
                    tooltip: {
                        enabled: false
                    }
                },
                {
                    seriesName: 'Staff Cost',
                    show: false,
                    showAlways: true,
                    opposite: true,
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
                        },
                        formatter: (val) => {
                            return val < $scope.$parent.K_M_T_VALUE_INIT ? $scope.$parent.NUMBER_WITH_COMMAS(val) : $scope.$parent.NUMBER_WITH_COMMAS(val / 1000) + 'K';
                        }
                    },
                    title: {
                        //text: "Operating Cashflow (thousand crores)",
                        style: {
                            color: '#2e93fa',
                        }
                    },
                },
                {
                    seriesName: 'Revenue',
                    opposite: true,
                    showAlways: true,
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
                        formatter: (val) => {
                            return val < $scope.$parent.K_M_T_VALUE_INIT ? $scope.$parent.NUMBER_WITH_COMMAS(val) : $scope.$parent.NUMBER_WITH_COMMAS(val / 1000) + 'K';
                        }
                    },
                    title: {
                        //text: "Revenue (thousand crores)",
                        style: {
                            color: '#f8507b',
                        }
                    }
                },
            ],
            tooltip: {
                shared: true,
                intersect: false,

            },
            legend: {
                position: "bottom",
                horizontalAlign: "center",
                fontFamily: "Rubik, sans-serif",
                fontSize: "12px",
            },
            colors: CHART_DATA.COLORS,
        }
        var chartstaff = new ApexCharts(document.querySelector("#" + CHART_NAME), optionsstaff);
        chartstaff.render();
    }

    $scope.LINE_CHART = function (CHART_NAME, DATA, CHART_DATA, TYPE, ALLOW_FLAG_TOOLTIP) {
        $('#' + CHART_NAME).empty();
        if (document.querySelector("#" + CHART_NAME).hasChildNodes()) {
            document.querySelector("#" + CHART_NAME).innerHTML = '';
        }
        var Lineoptions = {
            series: CHART_DATA.SERIESDATALIST,
            chart: {
                height: 250,
                type: 'line',
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
            },
            colors: CHART_DATA.COLORS,
            stroke: {
                width: 3,
                curve: 'smooth'
            },
            xaxis: {
                show: DATA.ShowXAxis,
                type: 'category',
                categories: CHART_DATA.LABELS,
                //tickAmount: 10,
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
                    enabled: true,
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
                // min: 0,
                // max: 28,
                labels: {
                    show: DATA.SHOWYAXIS,
                    formatter: (val) => {
                        return val < $scope.$parent.K_M_T_VALUE_INIT ? $scope.$parent.NUMBER_WITH_COMMAS(val) : $scope.$parent.NUMBER_WITH_COMMAS(val / 1000) + 'K';
                    }
                }
            },
                //{
                //show: CHART_DATA.SHOWY2AXIS,
                //opposite: true,
                //labels: {
                //    show: DATA.SHOWY2AXIS,
                //    formatter: (val) => {
                //        return val < $scope.$parent.K_M_T_VALUE_INIT ? $scope.$parent.NUMBER_WITH_COMMAS(val) : $scope.$parent.NUMBER_WITH_COMMAS(val / 1000) + 'K';
                //    }
                //}
                //}

            ], legend: {
                //  inverseOrder: false,
                showForSingleSeries: true,
            }, tooltip: {
                y: {
                    formatter: function (val) {
                        return $scope.$parent.NUMBER_WITH_COMMAS(val) + '' + (ALLOW_FLAG_TOOLTIP ? '%' : '');
                    }
                }
            },
        };
        var LineChart = new ApexCharts(document.querySelector("#" + CHART_NAME), Lineoptions);
        LineChart.render();
    };
    $scope.LINE_LABOUR_CHART = function (CHART_NAME, DATA, CHART_DATA, TYPE, ALLOW_FLAG_TOOLTIP) {
        $('#' + CHART_NAME).empty();
        var Lineoptionschart = {
            series: CHART_DATA.SERIESDATALIST,
            chart: {
                height: 250,
                type: 'line',
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
                //tickAmount: 10,
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
                    enabled: true,
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
                seriesName: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                show: CHART_DATA.SHOWYAXIS,
                // min: 0,
                // max: 28,
                //labels: {
                //    show: DATA.SHOWYAXIS,
                //}
                labels: {
                    show: DATA.SHOWYAXIS,
                    formatter: (val) => {
                        return val < $scope.$parent.K_M_T_VALUE_INIT ? $scope.$parent.NUMBER_WITH_COMMAS(val) : $scope.$parent.NUMBER_WITH_COMMAS(val / 1000) + 'K';
                    }
                },
                title: {
                    // text: "Staff Cost as % of Sales",
                    style: {
                        // color: "#000000",
                        //  fontSize: 10,
                    }
                }
            }, {

                seriesName: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                show: CHART_DATA.SHOWY2AXIS,
                opposite: true,
                showAlways: true,
                title: {
                    show: true,
                    showAlways: true,
                    text: "Staff Cost as % of Sales",
                    style: {
                        // color: "#000000",
                        //  fontSize: 10,
                    }
                },
                labels: {
                    show: DATA.SHOWY2AXIS,
                    formatter: (val) => {
                        return val < $scope.$parent.K_M_T_VALUE_INIT ? $scope.$parent.NUMBER_WITH_COMMAS(val) : $scope.$parent.NUMBER_WITH_COMMAS(val / 1000) + 'K';
                    }
                },
            }], tooltip: {
                x: {
                    formatter: function (x) {
                        return x == 0 ? "00" : x - 1 + ":00";
                    }
                    //formatter: function (val) {
                    //    return $scope.$parent.NUMBER_WITH_COMMAS(val);
                    //}
                },
                y: {
                    formatter: function (val) {
                        return $scope.$parent.NUMBER_WITH_COMMAS(val) + '' + (ALLOW_FLAG_TOOLTIP ? '%' : '');
                    }
                }
            },
        };
        var LinelabChart = new ApexCharts(document.querySelector("#" + CHART_NAME), Lineoptionschart);
        LinelabChart.render();
    };

    $scope.LINE_LABOUR_CHART_1 = function (CHART_NAME, DATA, CHART_DATA, TYPE) {
        $('#' + CHART_NAME).empty();
        var Lineoptions = {
            series: CHART_DATA.SERIESDATALIST,
            chart: {
                height: 250,
                type: 'line',
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
                    show: CHART_DATA.SHOWYAXIS,
                    formatter: (val) => {
                        return val < $scope.$parent.K_M_T_VALUE_INIT ? $scope.$parent.NUMBER_WITH_COMMAS(val) : $scope.$parent.NUMBER_WITH_COMMAS(val / 1000) + 'K';
                    }
                },

                title: {
                    text: "Actual Hours (HC)",
                    style: {
                    }
                },
            }, {
                show: CHART_DATA.SHOWY2AXIS,
                opposite: true,
                labels: {
                    show: CHART_DATA.SHOWY2AXIS,
                    formatter: (val) => {
                        return val < $scope.$parent.K_M_T_VALUE_INIT ? $scope.$parent.NUMBER_WITH_COMMAS(val) : $scope.$parent.NUMBER_WITH_COMMAS(val / 1000) + 'K';
                    }
                },
                title: {
                    text: "Staff Cost as % of Sales:",
                    style: {
                        // color: "#000000",
                        //  fontSize: 10,
                    }
                }

            }], tooltip: {
                y: {
                    formatter: function (val) {
                        return $scope.$parent.NUMBER_WITH_COMMAS(val);
                    }
                },
                x: {
                    formatter: function (y, x) {
                        return 'Staff Cost as % of Sales:' + y + ":00";
                    }

                }
            },
        };
        var LineChart = new ApexCharts(document.querySelector("#" + CHART_NAME), Lineoptions);
        LineChart.render();
    };

    $scope.AREA_LINE_LABOUR_CHART = function (CHART_NAME, DATA, CHART_DATA, TYPE) {
        //Labour_by_Hour

        //  var SeriesName = [];
        //  var SeriesNamey2 = [];
        //angular.forEach(CHART_DATA.MULTISERIESDATALIST, function (_loop_value, index) {
        //    if (index < 7) {
        //        SeriesName.push(_loop_value.name);
        //        SeriesNamey2.push(_loop_value.name);
        //    };
        //});

        $('#' + CHART_NAME).empty();
        var chartColor = ['#008ffb', '#008ffb', '#00da93', '#00da93', '#feb019', '#feb019', '#ff86a5', '#ff86a5', '#ff4560', '#ff4560', '#775dd0', '#775dd0', '#f43e94', '#f43e94', '#008ffb', '#008ffb'];
        var chartColor1 = ['#008ffb', '#00da93', '#feb019', '#ff86a5', '#ff4560', '#775dd0', '#f43e94', '#008ffb', '#00da93', '#feb019', '#ff86a5', '#ff4560', '#775dd0', '#f43e94'];
        var labelM = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        // var chartColor = ['#008ffb', '#008ffb', '#00da93', '#00da93', '#feb019', '#ff86a5', '#ff4560', '#775dd0', '#f43e94', '#008ffb', '#00da93', '#feb019', '#ff86a5', '#ff4560', '#775dd0', '#f43e94'];
        var options7 = {
            chart: {
                height: 250,
                type: 'line',
                stacked: false,
                dropShadow: {
                    enabled: true,
                    //    enabledOnSeries: undefined,
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
                    borderRadius: 2,
                    borderRadiusApplication: "end",
                    borderRadiusWhenStacked: "first",
                    horizontal: false,
                    //columnWidth: "70%",
                },
            },
            series: CHART_DATA.MULTISERIESDATALIST,
            //tickAmount: 25,
            labels: CHART_DATA.LABELS,
            markers: { size: 0 },
            xaxis: {
                tooltip: {
                    enabled: false,
                }
            },
            yaxis: [
                {
                    seriesName: ["Mon1", "Tue1", "Wed1", "Thu1", "Fri1", "Sat1", "Sun1"],
                    // show: true,
                    axisTicks: {
                        show: true,
                    },
                    axisBorder: {
                        show: true,
                        color: '#008FFB'
                    },
                    labels: {
                        style: {
                            colors: '#008FFB',
                        },
                        formatter: (val) => {
                            return val < $scope.$parent.K_M_T_VALUE_INIT ? $scope.$parent.NUMBER_WITH_COMMAS(val) : $scope.$parent.NUMBER_WITH_COMMAS(val / 1000) + 'K';
                        }
                    },
                    title: {
                        text: "Headcount",
                        style: {
                            // color: "#05a6f0",
                            // fontSize: 10,
                        }
                    },
                    tooltip: {
                        enabled: false,
                    }
                },
                {
                    seriesName: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],

                    opposite: true,
                    axisTicks: {
                        show: true,
                    },
                    axisBorder: {
                        show: true,
                        color: '#f8507b'
                    },
                    labels: {
                        // style: {
                        //   colors: '#f8507b',
                        // },
                        formatter: (val) => {
                            return val < $scope.$parent.K_M_T_VALUE_INIT ? $scope.$parent.NUMBER_WITH_COMMAS(val) : $scope.$parent.NUMBER_WITH_COMMAS(val / 1000) + 'K';
                        }
                    },
                    title: {
                        text: "Staff Cost as % of Sales:",
                        style: {
                            // color: "#05a6f0",
                            //fontSize: 10,
                        }
                    }
                },
            ],
            tooltip: {
                shared: false,
                intersect: true,
                y: {
                    title: {
                        formatter: function (y, ops) {
                            return y.replace("1", '');
                        },
                    },
                    formatter: function (y, ops) {
                        return y
                    }
                },
                x: {
                    title: {
                        formatter: (seriesName) => seriesName,
                    },
                    //formatter: function (x) {
                    //    return "Head Count:" + x == 0 ? "00" : x - 1 + ":00";
                    //}
                },
            },
            stroke: {
                width: [0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3],
                curve: "smooth",
            },
            legend: {
                inverseOrder: false,
                showForSingleSeries: true,
                floating: false,
                showForNullSeries: true,
                showForZeroSeries: true,
                customLegendItems: $scope.WEEK,
                markers: {
                    width: 12,
                    height: 12,
                    strokeWidth: 0,
                    strokeColor: '#fff',
                    fillColors: chartColor1,
                    radius: 12,
                    customHTML: undefined,
                    onClick: undefined,
                    offsetX: 0,
                    offsetY: 0
                },
                labels: {
                    colors: [
                        function ({ value, seriesIndex, dataPointIndex, w }) {
                            return chartColor1[seriesIndex];
                        }
                    ],
                    useSeriesColors: false
                },
            },
            // colors: ['#008ffb', '#00da93', '#feb019', '#ff86a5', '#ff4560', '#775dd0', '#f43e94', '#008ffb', '#00da93', '#feb019', '#ff86a5', '#ff4560', '#775dd0', '#f43e94'],
            colors: [
                function ({ value, seriesIndex, dataPointIndex, w }) {
                    return chartColor1[seriesIndex];
                    //if (seriesIndex == 1 || seriesIndex == 0) {
                    //    return chartColor[0];
                    //}
                    //else if (seriesIndex == 3) {
                    //    // w.globals.seriesColors[1] = chartColor[1];
                    //    return chartColor[1];
                    //}
                    //else if (seriesIndex == 5) {
                    //    return chartColor[2];
                    //}
                    //else if (seriesIndex == 7) {
                    //    return chartColor[3];
                    //}
                    //else if (seriesIndex == 9) {
                    //    return chartColor[4];
                    //}
                    //else if (seriesIndex == 11) {
                    //    return chartColor[5];
                    //}
                    //else if (seriesIndex == 13) {
                    //    return chartColor[6];
                    //}
                    //else {
                    //    return chartColor[seriesIndex];
                    //}
                }
            ]
        }
        var chart7 = new ApexCharts(document.querySelector("#" + CHART_NAME), options7);
        chart7.render();
    }

    $scope.LINE_BAR_CHAR = function (CHART_NAME, DATA, CHART_DATA, TYPE) {
        $('#' + CHART_NAME).empty();
        //Hourly_Wage_Cost_by_Department
        var SeriesName = CHART_DATA.MULTISERIESDATALIST.filter(function name(params) { return params.name != 'Sales' }).map(function (val) { return val.name });

        var options = {
            series: CHART_DATA.MULTISERIESDATALIST,
            chart: {
                height: 250,
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
                width: [3, 3, 3],
                curve: "smooth",
            },
            title: {
                //text: 'XYZ - Stock Analysis (2009 - 2016)',
                align: 'left',
                offsetX: 110
            },
            xaxis: {
                categories: CHART_DATA.LABELS,
                rotate: -45,
                rotateAlways: true,
                //tickAmount: 23,
            },
            yaxis: [
                {
                    seriesName: SeriesName,
                    show: true,

                    showAlways: true,
                    //axisTicks: {
                    //    show: false,
                    //},
                    labels: {
                        formatter: (val) => {
                            return val < $scope.$parent.K_M_T_VALUE_INIT ? $scope.$parent.NUMBER_WITH_COMMAS(parseInt(val)) : parseFloat($scope.$parent.NUMBER_WITH_COMMAS(val / 1000)).toFixed(0) + 'K';
                        }
                    },
                },
                {
                    seriesName: 'Sales',
                    show: true,
                    opposite: true,
                    //logarithmic: true,
                    showAlways: true,
                    labels: {
                        show: true,
                        style: {
                            colors: '#008FFB',
                        },
                        formatter: (val) => {
                            //return val;
                            return val < $scope.$parent.K_M_T_VALUE_INIT ? $scope.$parent.NUMBER_WITH_COMMAS(parseInt(val)) : parseFloat($scope.$parent.NUMBER_WITH_COMMAS(val / 1000)).toFixed(0) + 'K';
                        }
                    },
                    //title: {
                    //    //text: "Income (thousand crores)",
                    //    style: {
                    //        color: '#008FFB',
                    //    }
                    //},
                },
                //{
                //    //seriesName: undefined,
                //    logarithmic: true,
                //    show: false,
                //    labels: {
                //        style: {
                //            colors: '#008FFB',
                //        },
                //        formatter: (val) => {
                //            //return val;
                //            return val < $scope.$parent.K_M_T_VALUE_INIT ? $scope.$parent.NUMBER_WITH_COMMAS(parseInt(val)) : parseFloat($scope.$parent.NUMBER_WITH_COMMAS(val / 1000)).toFixed(0) + 'K';
                //        }
                //    },
                //    title: {
                //        //text: "Income (thousand crores)",
                //        style: {
                //            color: '#008FFB',
                //        }
                //    },
                //},

            ],
            tooltip: {
                y: {
                    formatter: function (val) {
                        return $scope.$parent.NUMBER_WITH_COMMAS(val);
                    }
                }
            },
            legend: {
                horizontalAlign: 'center',
                offsetX: 40,
                fontFamily: 'Rubik, sans-serif',
                fontWeight: 400,
            }
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
    $scope.DAYOFWEEKNAMES = [{ ID: 0, NAME: "All" }, { ID: 2, NAME: "Mon" }, { ID: 3, NAME: "Tue" }, { ID: 4, NAME: "Wed" }, { ID: 5, NAME: "Thu" }, { ID: 6, NAME: "Fri" }, { ID: 7, NAME: "Sat" }, { ID: 1, NAME: "Sun" }];

    $scope.GetChartData = function () {
        $scope.RESET_AFTER_FILTER_Fn();
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
            _pi_input_model_obj.FLAG = $scope.Input_Model.FLAG ? 1 : 0;
            _pi_input_model_obj.TYPE_ID = 1;
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
            case 100:
                //"Hourly Headcount" //HeatMapDataList MAX MIN //
                $scope.Display_Model.HOURLY_HEADCOUNT_DATA = data;
                data.Median = parseInt((data.MAX + data.MIN) / 2);
                data.MedianstarttoMin = parseInt((data.MIN + data.Median) / 2);
                //  data.MedianGotoMax2 = ((data.Median) + data.MAX) / 2;
                $scope.HEAT_CHART("Hourly_Headcount", data, data, "string");
                break;
            case 101:
                //"Staff Cost Trend"
                $scope.Display_Model.STAFF_COST_TREND = data;
                break;
            case 102:
                //"Weekly Staff Cost"
                $scope.Display_Model.WEEKLY_STAFF_COST = data;
                $scope.LINE_CHART("Weekly_Staff_Cost", data, data, "string");
                break;
            case 103:
                //"Weekly Staff Cost by Site"
                $scope.Display_Model.Weekly_Staff_Cost_by_Site = data;
                $scope.LINE_CHART("Weekly_Staff_Cost_by_Site", data, data, "string");
                break;
            case 104:
                //"Hourly Staff Cost"
                $scope.Display_Model.Hourly_Staff_Cost = data.COVERS_AREA_SESSION_LIST;
                $scope.LINE_CHART("Hourly_Staff_Cost", data, data, "string");
                break;
            case 105:
                //"Staff Cost Trend"
                $scope.Display_Model.STAFF_COST_TREND_GRID = data;
                break;
            case 106:
                $scope.Display_Model.STAFF_COST_SALES_DATA = data.CHART_OUTPUT_LIST;//"Staff Cost vs Sales per Hour"
                $scope.Display_Model.STAFF_COST_SALES = data.CHART_OUTPUT_LIST.filter(function (x) { return x.WEEKDAY_ID == 0 && x.COMPONENT_TYPE_ID == 1 });//"Staff Cost vs Sales per Hour"
                if ($scope.Display_Model.STAFF_COST_SALES.length > 0) {
                    $scope.LINE_CHART("Staff_Cost_vs_Sales_per_Hour", $scope.Display_Model.STAFF_COST_SALES[0], $scope.Display_Model.STAFF_COST_SALES[0], "string");
                };
                $scope.Display_Model.STAFF_COST_PER_OF_SALES = data.CHART_OUTPUT_LIST.filter(function (x) { return x.WEEKDAY_ID == 0 && x.COMPONENT_TYPE_ID == 2 });///"Staff Cost as a % of Sales"
                if ($scope.Display_Model.STAFF_COST_PER_OF_SALES.length > 0) {
                    $scope.LINE_CHART("Staff_Cost_Per_of_Sales", $scope.Display_Model.STAFF_COST_PER_OF_SALES[0], $scope.Display_Model.STAFF_COST_PER_OF_SALES[0], "string", true);
                };
                //"Staff Cost Compared To Sales:Staff Cost vs Sales per Hour:Staff Cost as a % of Sales"
                break;
            case 107:
                ///"Staff Cost vs Sales (per cover)"
                $scope.Display_Model.STAFF_COST_SALES_PER_COVERS = data;//done
                var ALL_DATA = data.CHART_OUTPUT_LIST.filter(function (x) { return x.COMPONENT_TYPE_ID == 1 });
                $scope.AREA_LINE_BAR_STAFF_CHART("Staff_Cost_vs_Sales_per_Cover", ALL_DATA[0], ALL_DATA[0], "string");
                $scope.Display_Model.STAFF_COST_SALES_PER_COVERS.component = component;//done
                $scope.Display_Model.STAFF_COST_SALES_PER_COVERS.component.TITLE = component.COMPONENT_NAME;//done
                break;
            case 108: // TABLE
                //"Staff Cost Compared To Sales"
                $scope.Display_Model.STAFF_COST_COMPARED_TO_SALES = data; //done
                break;
            case 109:
                //"Sales Per Headcount:Sales per Actual Hour:Labour & Staff Cost as a % of Sales"
                $scope.Display_Model.SALES_PER_ACTUAL_DATA = data;
                $scope.Display_Model.SALES_PER_ACTUAL_HOUR = data.CHART_OUTPUT_LIST.filter(function (x) { return x.COMPONENT_TYPE_ID == 1 });//"Sales per Actual Hour"
                if ($scope.Display_Model.SALES_PER_ACTUAL_HOUR.length > 0) {
                    $scope.LINE_CHART("Sales_per_Actual_Hour", $scope.Display_Model.SALES_PER_ACTUAL_HOUR[0], $scope.Display_Model.SALES_PER_ACTUAL_HOUR[0], "string");
                };
                $scope.Display_Model.LABOUR_WAGE_COST_TABLE = [];
                $scope.Display_Model.LABOUR__WAGE_COST = data.CHART_OUTPUT_LIST.filter(function (x) { return x.COMPONENT_TYPE_ID == 2 });//"Labour & staff Cost as a % of Sales"
                if ($scope.Display_Model.LABOUR__WAGE_COST.length > 0) {
                    $scope.AREA_LINE_LABOUR_CHART("Labour_by_Hour", $scope.Display_Model.LABOUR__WAGE_COST[0], $scope.Display_Model.LABOUR__WAGE_COST[0], "string");
                    $scope.Display_Model.LABOUR_WAGE_COST_TABLE = $scope.Display_Model.LABOUR__WAGE_COST[0].UnstructuredData;
                    $scope.Display_Model.LABOUR_WAGE_COST_TABLE_LABELS = $scope.Display_Model.LABOUR__WAGE_COST[0].LABELS;
                };
                //ActualHours
                //CostSalesPercent
                //Staffcost
                break;
            case 110:
                //"Hourly Wage Cost by Department"
                $scope.Display_Model.HOURLY_WAGE_COST = data;
                $scope.HOURLY_WAGE_COST = [];
                $scope.Display_Model.HOURLY_WAGE_COST_DATA = data.CHART_OUTPUT_LIST.filter(function (x) { return x.WEEKDAY_ID == 0 });;
                if ($scope.Display_Model.HOURLY_WAGE_COST_DATA.length > 0) {
                    $scope.HOURLY_WAGE_COST_LIST = $scope.Display_Model.HOURLY_WAGE_COST_DATA[0];
                    $scope.LINE_BAR_CHAR("Hourly_Wage_Cost_by_Department", $scope.Display_Model.HOURLY_WAGE_COST_DATA[0], $scope.Display_Model.HOURLY_WAGE_COST_DATA[0], "string");
                }
                break;
            case 111:
                //TITLE "Scheduled Vs Actuals:Scheduled vs Actuals by Week:Scheduled vs Actuals by Day:Compared to Sales"
                $scope.Display_Model.SCHEDULED_VS_ACTUALS_DATA = data.CHART_OUTPUT_LIST;
                $scope.Display_Model.SCHEDULED_VS_ACTUALS = data.CHART_OUTPUT_LIST.filter(function (x) { return x.WEEKDAY_ID == 0 && x.COMPONENT_TYPE_ID == 1 });
                //"Staff Cost vs Sales per Hour"
                if ($scope.Display_Model.SCHEDULED_VS_ACTUALS.length > 0) {
                    $scope.LINE_CHART("Scheduled_vs_Actuals_by_Day", $scope.Display_Model.SCHEDULED_VS_ACTUALS[0], $scope.Display_Model.SCHEDULED_VS_ACTUALS[0], "string");
                };
                $scope.Display_Model.COMPARED_TO_SALES = data.CHART_OUTPUT_LIST.filter(function (x) { return x.COMPONENT_TYPE_ID == 2 });///"Compared to Sales"
                if ($scope.Display_Model.COMPARED_TO_SALES.length > 0) {
                    // Compared to Sales
                    $scope.AREA_LINE_BAR_CHART("Scheduled_vs_Actuals_vs_Sales", $scope.Display_Model.COMPARED_TO_SALES[0], $scope.Display_Model.COMPARED_TO_SALES[0], "string");
                    $scope.Display_Model.COMPARED_TO_SALES_TABLE = $scope.Display_Model.COMPARED_TO_SALES[0].UnstructuredData;
                    $scope.Display_Model.COMPARED_TO_SALES_LABELS = $scope.Display_Model.SCHEDULED_VS_ACTUALS[0].LABELS;
                };
                $scope.Display_Model.COMPARED_TO_SALES_DATA = data.CHART_OUTPUT_LIST.filter(function (x) { return x.COMPONENT_TYPE_ID == 3 });
                // Scheduled vs Actuals by Week
                if ($scope.Display_Model.COMPARED_TO_SALES_DATA.length > 0) {
                    $scope.LINE_CHART("Scheduled_vs_Actuals_by_Week", $scope.Display_Model.COMPARED_TO_SALES_DATA[0], $scope.Display_Model.COMPARED_TO_SALES_DATA[0], "string");
                };
                break;
        }
    }

    $scope.Fn_SALES_PER_HOUR = function (WEEK_DAY) {
        var STAFF_COST_SALES = $scope.Display_Model.STAFF_COST_SALES_DATA.filter(function (x) { return x.WEEKDAY_ID == WEEK_DAY.ID });//"Staff Cost vs Sales per Hour"
        if (STAFF_COST_SALES.length > 0) {
            $scope.Input_Model.WEEK_SELECTED_SALES_PER_HOR_TEXT = WEEK_DAY.NAME;
            $scope.LINE_CHART("Staff_Cost_vs_Sales_per_Hour", STAFF_COST_SALES[0], STAFF_COST_SALES[0], "string");
        } else {

        };
    };
    $scope.Fn_RESET_SALES_PER_HOUR = function () {
        var obj = new Object();
        obj.NAME = $scope.Input_Model.DEFAULT_DISPLAY;
        obj.ID = 0;
        $scope.Input_Model.WEEK_SELECTED_SALES_PER_HOR_TEXT = $scope.Input_Model.DEFAULT_DISPLAY;
        $scope.Fn_SALES_PER_HOUR(obj);
    }

    $scope.Fn_RESET_HOUR_DEPARTMEN = function () {
        var obj = new Object();
        obj.NAME = $scope.Input_Model.DEFAULT_DISPLAY;
        obj.ID = 0;
        $scope.Input_Model.HOURLY_WAGE_COST_TEXT = $scope.Input_Model.DEFAULT_DISPLAY;
        $scope.Fn_HOUR_DEPARTMENT(obj);
    }
    $scope.Fn_HOUR_DEPARTMENT = function (WEEK_DAY) {
        var STAFF_COST_SALES = $scope.Display_Model.HOURLY_WAGE_COST.CHART_OUTPUT_LIST.filter(function (x) { return x.WEEKDAY_ID == WEEK_DAY.ID });//"Staff Cost vs Sales per Hour"
        if (STAFF_COST_SALES.length > 0) {
            $scope.Input_Model.HOURLY_WAGE_COST_TEXT = WEEK_DAY.NAME;
            if (document.querySelector("#Hourly_Wage_Cost_by_Department").hasChildNodes()) {
                document.querySelector("#Hourly_Wage_Cost_by_Department").innerHTML = '';
            }
            $scope.LINE_BAR_CHAR("Hourly_Wage_Cost_by_Department", STAFF_COST_SALES[0], STAFF_COST_SALES[0], "string");
        } else {
        };
    };

    $scope.Fn_ACTUAL_COST = function () {
        $scope.GetChartData();
    }
    $scope.Fn_SCHEDULED_VS_ACTUALS_BY_DAY = function (WEEK_DAY) {
        var STAFF_COST_SALES = $scope.Display_Model.SCHEDULED_VS_ACTUALS_DATA.filter(function (x) { return x.WEEKDAY_ID == WEEK_DAY.ID });//"Staff Cost vs Sales per Hour"
        if (STAFF_COST_SALES.length > 0) {
            $scope.Input_Model.WEEK_SELECTED_SALES_PER_DAY_TEXT = WEEK_DAY.NAME;
            $scope.LINE_CHART("Scheduled_vs_Actuals_by_Day", STAFF_COST_SALES[0], STAFF_COST_SALES[0], "string");
        } else { };
    };
    $scope.Fn_RESET_SCHEDULED_VS_ACTUALS_BY_DAY = function () {
        var obj = new Object();
        obj.NAME = $scope.Input_Model.DEFAULT_DISPLAY;
        obj.ID = 0;
        $scope.Input_Model.WEEK_SELECTED_SALES_PER_DAY_TEXT = $scope.Input_Model.DEFAULT_DISPLAY;
        $scope.Fn_SCHEDULED_VS_ACTUALS_BY_DAY(obj);
    }

    //$scope.GET_THIS_PAGE_COMPONENTS();
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
    };
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
    };

    //$scope.SITE_COUNT_FLAG = 0;
    $scope.Fn_BLUR_SITES = function () {
        $scope.Fn_Fill_ENTITY_BRANCH_LIST();
        if ($scope.SITE_LIST.filter(function (x) { return x.IS_CHECK }).length == 0) {
            $scope.$parent.ShowAlert("Attention", $scope.$parent.PI_MESSAGE, 3000);
            $scope.SELCTED_SITE();
        }
        else {
            $scope.Fn_CHANGE_FILTER("SITECHANGE");
            $scope.SELCTED_SITE();
        }
    };
    $scope.SELCTED_SITE = function () {
        var resultlength = ($scope.$parent.SITE_LIST.filter(function (x) { x.IS_APPLAY_CHECK = x.IS_CHECK; return x.IS_CHECK }));
        $scope.Input_Model.DISPLAY_TEXT_SITE = resultlength.length + " Site Selected";
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

    $scope.Fn_CLICK_STAFF_COST = function (BY_CALL) {
        $scope.Input_Model.SELECTED_STAFF_COST = BY_CALL.NAME;
        var ALL_DATA = $scope.Display_Model.STAFF_COST_SALES_PER_COVERS.CHART_OUTPUT_LIST.filter(function (x) { return x.COMPONENT_TYPE_ID == BY_CALL.ID });
        $scope.AREA_LINE_BAR_STAFF_CHART("Staff_Cost_vs_Sales_per_Cover", ALL_DATA[0], ALL_DATA[0], "string");
    }

    $scope.CURRENCY_Fn = function (currency) {
        $scope.Input_Model.DISPLAY_TEXT_CURRENCY = currency.Value;
        $scope.Input_Model.CURRENCY_ID = currency.Key;
        $scope.CHANGE_FILTER_Fn(2)
    }
    $scope.CHANGE_FILTER_Fn = function () {
        $scope.GetChartData();
    };

    $scope.Fn_CHANGE_HEADE_COUNT = function () {
        var ALL_DATA = angular.copy($scope.Display_Model.LABOUR__WAGE_COST);
        var HEADE_COUNT = ALL_DATA[0].MULTISERIESDATALIST.filter(function (x) { return x.type == "line" && $scope.Input_Model.SHOW_WAGE_COST || !$scope.Input_Model.SHOW_WAGE_COST });//"Labour & Wage Cost as a % of Sales"
        if (HEADE_COUNT.length > 0) {
            ALL_DATA[0].SERIESDATALIST = [];
            ALL_DATA[0].SERIESDATALIST = HEADE_COUNT;
            if ($scope.Input_Model.SHOW_WAGE_COST) {
                $scope.LINE_LABOUR_CHART("Labour_by_Hour", ALL_DATA[0], ALL_DATA[0], "string", true);
            }
            else {
                $scope.AREA_LINE_LABOUR_CHART("Labour_by_Hour", ALL_DATA[0], ALL_DATA[0], "string");
            }
        };
    }
    $scope.RESET_AFTER_FILTER_Fn = function () {
        $scope.Input_Model.SELECTED_STAFF_COST = 'Current Week';
        $scope.Input_Model.WEEK_SELECTED_SALES_PER_HOR_TEXT = 'All';
        $scope.Input_Model.DEFAULT_DISPLAY = 'All';
        $scope.Input_Model.WEEK_DISPLAY_TEXT_1 = 'All';
        $scope.Input_Model.WEEK_SELECTED_SALES_PER_DAY_TEXT = 'All';
        $scope.Input_Model.HOURLY_WAGE_COST_TEXT = 'All';
        $scope.Input_Model.SHOW_WAGE_COST = 0;
    }

    $scope.RESET_FILTER = function () {
        $scope.Input_Model.SELECTED_STAFF_COST = 'Current Week';
        $scope.Input_Model.WEEK_SELECTED_SALES_PER_HOR_TEXT = 'All';
        $scope.Input_Model.DEFAULT_DISPLAY = 'All';
        $scope.Input_Model.WEEK_DISPLAY_TEXT_1 = 'All';
        $scope.Input_Model.WEEK_SELECTED_SALES_PER_DAY_TEXT = 'All';
        $scope.Input_Model.HOURLY_WAGE_COST_TEXT = 'All';
        $scope.Input_Model.SHOW_WAGE_COST = 0;
        angular.forEach($scope.SITE_LIST, function (site) { site.IS_CHECK = true; site.IS_APPLAY_CHECK = true; });
        $scope.SELCTED_SITE();
        $scope.Fn_Fill_ENTITY_BRANCH_LIST();
        $scope.CURRENCY_Fn($scope.CURRENCY_LIST[0]);
        $scope.SELCTED_SITE();
        //$scope.Fn_CHANGE_FILTER("Reset");
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
        // $scope.$parent.$parent.overlay_loadingNew = 'block';
        $scope.CONTROLLER_LOAD();
    };
    //Avg_Staff_Cost_vs_Revenue
    $scope.$parent.PI_child_scope = $scope;
});