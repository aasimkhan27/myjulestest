app.controller('PI_Product_AnalysisController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $localStorage) {
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(2);
    $scope.$parent.CURRENT_PATH = window.location.hash;
    $scope.$parent.overlay_loading_powerInsight = 'none';
    $scope.Input_Model = {
        GET_PAGE_DATA: true,
        GET_FILTER_DATA: true,
        USER_ID: parseInt($cookies.get("USERID")),
        APP_PAGE_ID: 36,
        DISPLAY_TEXT_SITE: "Select Sites",
        ENTITY_BRANCH_LIST: [],
        WEEK_DATE: new Date(),
        START_DAY_OF_WEEK: 1,
        WEEK_NO: 9,
        PERIOD_TYPE_ID: 1,
        DD_DEFAULT_TEXT: $scope.$parent.DDL_DISPLAY_TEXT,
        DISPLAY_TEXT_YEAR: $scope.$parent.DDL_DISPLAY_TEXT,
        DISPLAY_TEXT_QUARTERS: $scope.$parent.DDL_DISPLAY_TEXT,
        SETTING_47: $scope.$parent.MASTER_GET_CUSTOMER_SETTINGS_VALUES(47),
        SELECTED_PERIOD_TYPE: 'Week',
        IS_PRODUCT: false,
        P_OR_C_NAME: "",
        DISPLAY_REVENUE: "Revenue",
        PRODUCT_OR_CATEGORY_IDS_LIST: [],
        PRODUCT_OR_CATEGORY_LIST: []
    }
    $scope.START_DAY_OF_WEEK = 1;
    $scope.LOAD_APP_COMPONENTS = 0;
    $scope.PRODUCT_LIST = [];
    $scope.ADD_PRODUCTS_LIST = [];
    $scope.REVENUE_LIST = [{ name: 'Revenue' }, { name: 'Quantity' }];

    $scope.GET_THIS_PAGE_COMPONENTS = function () {
        var _app_page_components_list = JSON.parse($localStorage.APP_PAGE_COMPONENTS_LIST);
        $scope.THIS_APP_PAGE_COMPONENTS_LIST = _app_page_components_list.filter(function (x) { return x.APP_PAGE_ID == $scope.Input_Model.APP_PAGE_ID && x.ACTIVE });
        $scope.LOAD_APP_COMPONENTS = 1;
    }

    $scope.PRDCT_ANLYS_GET_PRDCT_OR_CTGRY_NAMES = function () {
        $scope.PRODUCT_LIST = [];
        $scope.ADD_PRODUCTS_LIST = [];
        $scope.SALES_PRODUCTS_LIST = [];
        $scope.SALES_PRODUCTS_LIST = [];
        if ($scope.Input_Model.ENTITY_BRANCH_LIST.length == 0) {
            $scope.Fn_Fill_ENTITY_BRANCH_LIST();
        };
        var _pi_input_model_obj = new Object();
        _pi_input_model_obj.START_DATE = new Date($scope.Input_Model.START_DATE).toDateString();
        _pi_input_model_obj.END_DATE = new Date($scope.Input_Model.END_DATE).toDateString();
        _pi_input_model_obj.ENTITY_BRANCH_LIST = $scope.Input_Model.ENTITY_BRANCH_LIST;
        _pi_input_model_obj.P_OR_C_ID = $scope.Input_Model.IS_PRODUCT ? 2 : 1;
        _pi_input_model_obj.P_OR_C_NAME = $scope.Input_Model.P_OR_C_NAME;
        PrcCommMethods.DASHBOARD_MODULES_API(_pi_input_model_obj, 'PRDCT_ANLYS_GET_PRDCT_OR_CTGRY_NAMES', 'POWERINSIGHTAPI').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.PRODUCT_LIST = data.data.Table;
            }
            else {
                $scope.PRODUCT_LIST = [];
            };
        });
    }

    $scope.SetQValues = function (Supplier, index) {
        $('#AddCustomScroll_Contact').find('.dropdown-menu').addClass('scrollbar-wrapper');
    }
    $scope.SELECTED_PRODUCT_Fn = function (_Product) {
        var _alreadyproductlength = $scope.ADD_PRODUCTS_LIST.filter(function (_product) { return _product.PRODUCT_ID == _Product.PRODUCT_ID })
        if ($scope.ADD_PRODUCTS_LIST.length < 5) {
            if (_alreadyproductlength.length == 0) {
                $scope.Input_Model.PRODUCT_NAME = '';
                $scope.ADD_PRODUCTS_LIST.push(angular.copy(_Product));
                $scope.Fn_VIEW_ONLOAD_DATA("onchange", 1);
            }
            else {
                $scope.$parent.ShowAlertBox("Attention", ($scope.Input_Model.IS_PRODUCT ? 'sub-category' : 'product') + " already added", 3000);
                $scope.Input_Model.PRODUCT_NAME = "";
            }
        }
        else {
            $scope.$parent.ShowAlertBox("Attention", ("You cannot add more than five " + ($scope.Input_Model.IS_PRODUCT ? 'sub-category' : 'product')), 3000);
            $scope.Input_Model.PRODUCT_NAME = "";
        }
    };

    $scope.Fn_SALES_TREND = function (CHART_NAME, DATA, CHART_DATA, TYPE) {
        $('#' + CHART_NAME).empty();
        var options = {
            series: [{
                name: 'Unit Sold (P-1)',
                type: 'column',
                data: [10000, 2000, 7000, 6000, 3000, 9000, 5000,]
            }, {
                name: 'Unit Sold (P-2)',
                type: 'column',
                data: [10000, 3000, 8000, 5000, 2000, 6000, 20000,]
            }, {
                name: 'Sales (P-1)',
                type: 'line',
                data: [1000, 3000, 10000, 25000, 15000, 12000, 20000,]
            }, {
                name: 'Sales (P-2)',
                type: 'line',
                data: [20000, 10000, 45000, 18000, 44000, 30000, 50000,]
            }, {
                name: 'Best Sales',
                type: 'line',
                data: [10000, 3000, 8000, 5000, 2000, 6000, 20000,]
            }, {
                name: 'Average Sales',
                type: 'line',
                data: [10000, 2000, 7000, 6000, 3000, 9000, 5000,]
            }],
            chart: {
                height: 280,
                type: 'line',
                stacked: false,
                fontFamily: 'Rubik, sans-serif',
                dropShadow: {
                    enabled: true,
                    enabledOnSeries: undefined,
                    top: -5,
                    left: 0,
                    blur: 4,
                    color: '#888788',
                    opacity: 0.1
                },
                toolbar: {
                    show: false,
                },
            },
            plotOptions: {
                bar: {
                    borderRadius: 4,
                    borderRadiusApplication: "end",
                    borderRadiusWhenStacked: "first",
                },
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                width: [1, 1, 3, 3, 3, 3],
                curve: "smooth",
                dashArray: [0, 0, 0, 0, 5, 5]
            },
            title: {
                //text: 'XYZ - Stock Analysis (2009 - 2016)',
                align: 'left',
                offsetX: 110
            },
            xaxis: {
                categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                tickAmount: 13,
            },
            //colors: ['#4fdea6', '#50a4f2', '#fcc35a', '#0066ff', '#00a86f', '#b879f4'],
            colors: ['#50a4f2', '#4fdea6', '#50a4f2', '#4fdea6', '#ff7e00', '#b400ff'],
            yaxis: [
                {
                    axisTicks: {
                        show: true,
                    },
                    axisBorder: {
                        show: true,
                        color: '#4fdea6'
                    },
                    labels: {
                        style: {
                            colors: '#4fdea6',
                        }
                    },
                    title: {
                        //text: "Income (thousand crores)",
                        style: {
                            color: '#008FFB',
                        }
                    },
                },
                {
                    seriesName: 'Avg. Staff Cost',
                    show: false,
                    opposite: true,
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
                    seriesName: 'Revenue',
                    opposite: true,
                    axisTicks: {
                        show: true,
                    },
                    axisBorder: {
                        show: true,
                        color: '#0066ff'
                    },
                    labels: {
                        style: {
                            colors: '#0066ff',
                        },
                    },
                    title: {
                        //text: "Revenue (thousand crores)",
                        style: {
                            color: '#FEB019',
                        }
                    }
                },
            ],

            fill: {
                opacity: [1, 1, 1, 1, 1, 1],
                gradient: {
                    inverseColors: false,
                    shade: 'light',
                    //type: "vertical",
                    opacityFrom: 0.85,
                    opacityTo: 0.55,
                    stops: [0, 100, 100, 100]
                }
            },
            legend: {
                horizontalAlign: 'center',
                offsetX: 40,
                fontFamily: 'Rubik, sans-serif',
                fontWeight: 400,
            }
        };

        var chart = new ApexCharts(document.querySelector("#Sales_Trend"), options);
        chart.render();
    };
    // $scope.Fn_SALES_TREND()
    $scope.Fn_BIND_CHART_2 = function (CHART_NAME, DATA, CHART_DATA, TYPE) {
        $('#' + CHART_NAME).empty();
        //Staff_Cost_per_Site
        var options = {
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
                width: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
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
        var chart1 = new ApexCharts(document.querySelector("#" + CHART_NAME), options);
        chart1.render();
    };

    //var options = {
    //    series: [
    //        {
    //            name: 'Breakfast (P-1)',
    //            group: 'P1',
    //            data: [44000, 55000, 41000, 67000, 22000, 43000, 25000]
    //        },

    //        {
    //            name: 'Lunch (P-1)',
    //            group: 'P1',
    //            data: [13000, 36000, 20000, 8000, 13000, 27000, 40000]
    //        },
    //        {
    //            name: 'Dinner (P-1)',
    //            group: 'P1',
    //            data: [13000, 36000, 20000, 8000, 13000, 27000, 45000]
    //        },
    //        {
    //            name: 'Lunch (P-2)',
    //            group: 'P2',
    //            data: [20000, 40000, 25000, 10000, 12000, 28000, 35000]
    //        },

    //        {
    //            name: 'Dinner (P-2)',
    //            group: 'P2',
    //            data: [20000, 40000, 25000, 10000, 12000, 28000, 38000]
    //        }
    //        {
    //            name: 'Breakfast (P-2)',
    //            group: 'P2',
    //            data: [48000, 50000, 40000, 65000, 25000, 40000, 38000]
    //        },
    //    ],
    //    chart: {
    //        type: 'bar',
    //        height: 280,
    //        stacked: true,
    //        fontFamily: 'Rubik, sans-serif',
    //        toolbar: {
    //            show: false,
    //        },
    //    },
    //    plotOptions: {
    //        bar: {
    //            columnWidth: '60%',
    //            borderRadius: 4,
    //            borderRadiusWhenStacked: 'last',
    //            borderRadiusApplication: "end",
    //        }
    //    },
    //    stroke: {
    //        width: 0,
    //        colors: ['#fff']
    //    },
    //    dataLabels: {
    //        formatter: (val) => {
    //            return val / 1000 + 'K'
    //        },
    //        style: {
    //            fontSize: '10px',
    //            colors: ["#000"],

    //        }
    //    },
    //    plotOptions: {
    //        bar: {
    //            horizontal: false
    //        }
    //    },
    //    xaxis: {
    //        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    //    },
    //    fill: {
    //        opacity: 1,
    //        type: 'pattern',
    //        pattern: {
    //            style: ['verticalLines', 'verticalLines', 'slantedLines', 'slantedLines', 'horizontalLines', 'horizontalLines',],

    //        }
    //    },
    //    colors: ['#0062dc', '#00b422', '#2084ff', '#00ef2d', '#53a0ff', '#3cff61'],
    //    yaxis: {
    //        labels: {
    //            formatter: (val) => {
    //                return val / 1000 + 'K'
    //            },
    //        }
    //    },
    //    legend: {
    //        position: 'bottom',
    //        horizontalAlign: 'center'
    //    }
    //};
    $scope.Fn_SESSION_SALES = function (CHART_NAME, DATA, CHART_DATA, TYPE) {
        $('#' + CHART_NAME).empty();
        var options = {
            series: DATA.SERIESDATALIST,
            chart: {
                type: 'bar',
                height: 300,
                stacked: true,
                fontFamily: 'Rubik, sans-serif',
                toolbar: {
                    show: false,
                },
            },
            plotOptions: {
                bar: {
                    columnWidth: '60%',
                    borderRadius: 4,
                    borderRadiusWhenStacked: 'last',
                    borderRadiusApplication: "end",
                }
            },
            stroke: {
                width: 0,
                colors: ['#fff']
            },
            dataLabels: {
                formatter: (val) => {
                    return val / 1000 + 'K'
                },
                style: {
                    fontSize: '10px',
                    colors: ["#000"],
                }
            },
            plotOptions: {
                bar: {
                    horizontal: false
                }
            },
            xaxis: {
                categories: DATA.LABELS,
            },
            fill: {
                opacity: 1,
                type: 'pattern',
                pattern: {
                    style: ['verticalLines', 'verticalLines', 'slantedLines', 'slantedLines', 'horizontalLines', 'horizontalLines', 'circles', 'circles'],
                }
            },
            //colors: DATA.COLORS,
            colors: ['#0062dc', '#00b422', '#2084ff', '#00ef2d', '#53a0ff', '#3cff61'],
            yaxis: {
                labels: {
                    formatter: (val) => {
                        return val / 1000 + 'K'
                    },
                }
            },
            legend: {
                position: 'bottom',
                horizontalAlign: 'center'
            }
        };

        //var chart = new ApexCharts(document.querySelector("#"), options);
        //chart.render();
        var LineChart = new ApexCharts(document.querySelector("#" + CHART_NAME), options);
        LineChart.render();
    };
    $scope.Fn_Theotrical_GP = function (CHART_NAME, DATA, CHART_DATA, TYPE) {
        $('#' + CHART_NAME).empty();
        var options = {
            series: [{
                name: 'Inflation',
                data: [2.3, 3.1, 4.0, 10.1, 4.0, 3.6, 3.2]
            }, {
                name: 'ABC',
                data: [5, 18, 12, 8, 16, 14, 6]
            }],
            chart: {
                height: 280,
                type: 'bar',
                fontFamily: 'Rubik, sans-serif',
                toolbar: {
                    show: false,
                },
            },
            plotOptions: {
                bar: {
                    borderRadius: 4,
                    borderRadiusApplication: "end",
                    borderRadiusWhenStacked: "first",
                    dataLabels: {
                        position: 'top', // top, center, bottom
                        FontSize: '10',
                        orientation: 'vertical',
                    },
                }
            },
            dataLabels: {
                enabled: true,
                formatter: function (val) {
                    return val + "%";
                },
                offsetY: 5,
                style: {
                    fontSize: '10px',
                    colors: ["#304758"],

                }
            },

            xaxis: {
                categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                position: 'bottom',
                axisBorder: {
                    show: false
                },
                axisTicks: {
                    show: false
                },
                crosshairs: {
                    fill: {
                        type: 'gradient',
                        gradient: {
                            colorFrom: '#D8E3F0',
                            colorTo: '#BED1E6',
                            stops: [0, 100],
                            opacityFrom: 0.4,
                            opacityTo: 0.5,
                        }
                    }
                },
                tooltip: {
                    enabled: true,
                }
            },
            yaxis: {
                axisBorder: {
                    show: true
                },
                axisTicks: {
                    show: false,
                },
                labels: {
                    show: true,
                    formatter: function (val) {
                        return val + "%";
                    }
                }

            },
            title: {
                //text: 'Monthly Inflation in Argentina, 2002',
                floating: true,
                offsetY: 330,
                align: 'center',
                style: {
                    color: '#444'
                }
            }
        };

        var chart = new ApexCharts(document.querySelector("#Theotrical_GP"), options);
        chart.render();
    };
    $scope.Fn_Theotrical_GP()

    $scope.Fn_Unit_Price = function (CHART_NAME, DATA, CHART_DATA, TYPE) {
        $('#' + CHART_NAME).empty();
        var options = {
            series: [
                {
                    name: "Product 01",
                    data: [20, 20, 20, 20, 20, 20, 20]
                },
                {
                    name: "Product 02",
                    data: [16, 18, 18, 18, 18, 18, 18]
                }
            ],
            chart: {
                height: 280,
                type: 'line',
                fontFamily: 'Rubik, sans-serif',
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
                    enabled: false
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
            //colors: ['#77B6EA', '#545454'],
            dataLabels: {
                enabled: false,
            },
            stroke: {
                curve: 'stepline',
                width: '3',
            },

            grid: {
                borderColor: '#e7e7e7',
            },
            markers: {
                size: 0
            },
            xaxis: {
                categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            },
            yaxis: {
                //title: {
                //    text: 'Temperature'
                //},
                min: 5,
                max: 40
            },
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
            }
        };

        var chart = new ApexCharts(document.querySelector("#Unit_Price"), options);
        chart.render();
    };
    $scope.LINE_CHART = function (CHART_NAME, DATA, HEADER_DATA, TYPE) {
        $('#' + CHART_NAME).empty();
        var Lineoptions = {
            series: DATA.SERIESDATALIST,
            chart: {
                height: 300,
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
            colors: DATA.COLORS,
            stroke: {
                curve: 'stepline',
                //curve: 'smooth',
                width: '3',
            },
            grid: {
                borderColor: '#e7e7e7',
            },
            xaxis: {
                show: DATA.SHOWXAXIS,
                type: 'category',
                categories: DATA.LABELS,
                tickAmount: 10,
                labels: {
                    show: DATA.SHOWXAXIS,
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
                show: DATA.SHOWYAXIS,
                // min: 0,
                // max: 28,
                labels: {
                    show: DATA.SHOWYAXIS,
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
    $scope.Fn_Sales_Bubble_Chart = function (CHART_NAME, DATA, CHART_DATA, TYPE) {
        $('#' + CHART_NAME).empty();
        function generateData(baseval, count, yrange) {
            var i = 0;
            var series = [];
            while (i < count) {
                var x = Math.floor(Math.random() * (750 - 1 + 1)) + 1;;
                var y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
                var z = Math.floor(Math.random() * (75 - 15 + 1)) + 15;

                series.push([x, y, z]);
                baseval += 86400000;
                i++;
            }
            return series;
        }
        var options = {
            series: [{
                name: 'Summer Avocado Toast',
                data: generateData(new Date('11 Feb 2017 GMT').getTime(), 20, { min: 10, max: 60 })
            },
            {
                name: 'Apple & Pear Pancakes',
                data: generateData(new Date('11 Feb 2017 GMT').getTime(), 20, {
                    min: 10,
                    max: 60
                })
            },
            {
                name: 'Huevos Rancheros',
                data: generateData(new Date('11 Feb 2017 GMT').getTime(), 20, {
                    min: 10,
                    max: 60
                })
            },
            {
                name: 'Seoul Eggs GF',
                data: generateData(new Date('11 Feb 2017 GMT').getTime(), 20, {
                    min: 10,
                    max: 60
                })
            }, {
                name: 'Scrambled Eggs (DF)',
                data: generateData(new Date('11 Feb 2017 GMT').getTime(), 20, { min: 10, max: 60 })
            },],
            chart: {
                height: 350,
                type: 'bubble',
                fontFamily: 'Rubik, sans-serif',
                //   dropShadow: {
                //   enabled: true,
                //   enabledOnSeries: undefined,
                //   top: 5,
                //   left: 0,
                //   blur: 6,
                //   color: '#000',
                //   opacity: 0.15
                // },
                toolbar: {
                    show: false
                }
            },
            plotOptions: {
                bubble: {
                    zScaling: true,
                    minBubbleRadius: undefined,
                    maxBubbleRadius: undefined,
                }
            },
            dataLabels: {
                enabled: false
            },
            colors: ['#005a9e', '#e28000', '#9ffc6d', '#0074cb', '#61b135', '#0085ea', '#1098ff', '#31a6ff', '#539031', '#76d840', '#87f849'],
            fill: {
                opacity: 0.8
            },
            title: {
                // text: 'Simple Bubble Chart'
            },
            xaxis: {
                tickAmount: 12,
                //max: 100
                //type: 'category',
                title: {
                    text: "Price Range",
                    style: {
                        color: "#05a6f0",
                        fontSize: 14,
                        fontFamily: 'Rubik, sans-serif',
                        fontWeight: 500,
                    }
                },
            },
            yaxis: {
                max: 100,
                title: {
                    text: "Sales (£)",
                    style: {
                        color: "#05a6f0",
                        fontSize: 14,
                        fontFamily: 'Rubik, sans-serif',
                        fontWeight: 500,
                    }
                },
            },
            tooltip: {
                x: {
                    show: true,
                    format: 'dd MMM',
                    formatter: undefined,
                },
                y: {
                    formatter: undefined,
                    title: {
                        formatter: (seriesName) => seriesName,
                    },
                },
                z: {
                    formatter: undefined,
                    title: 'Size: '
                },
            },
            legend: {
                horizontalAlign: 'center',
                offsetX: 40,
                fontFamily: 'Rubik, sans-serif',
                fontWeight: 400,
            }
        };

        var chart = new ApexCharts(document.querySelector("#Sales_Bubble_Chart"), options);
        chart.render();
    };
    $scope.BUBBLE_CHART = function (CHART_NAME, DATA, CHART_DATA, TYPE) {
        $('#' + CHART_NAME).empty();
        var options = {
            series: CHART_DATA.BUBBLECHARTDATALIST,
            chart: {
                height: 300,
                type: 'bubble',
                zoom: {
                    enabled: $scope.APPLY_ZOOM
                },
                toolbar: {
                    show: false
                }
            },
            plotOptions: {
                bubble: {
                    zScaling: true,
                    minBubbleRadius: 5,
                    maxBubbleRadius: 100,
                }
            },
            dataLabels: {
                enabled: false
            },
            colors: CHART_DATA.COLORS,
            //fill: {
            //    opacity: 0.3
            //},
            title: {
                // text: 'Simple Bubble Chart'
            },
            xaxis: {
                tickAmount: 30,
                title: {
                    text: "Price Range",
                    style: {
                        color: "#05a6f0",
                        fontSize: 14,
                        fontFamily: 'Rubik, sans-serif',
                        fontWeight: 500,
                    }
                },
            },
            yaxis: {
                show: CHART_DATA.SHOWYAXIS,
                min: 0,
                max: CHART_DATA.MAX,
                title: {
                    text: "Sales (£)",
                    style: {
                        color: "#05a6f0",
                        fontSize: 14,
                        fontFamily: 'Rubik, sans-serif',
                        fontWeight: 500,
                    }
                },
                labels: {
                    show: CHART_DATA.SHOWYAXIS,
                    formatter: (val) => {
                        return val < $scope.$parent.K_M_T_VALUE_INIT ? $scope.$parent.NUMBER_WITH_COMMAS(val) : $scope.$parent.NUMBER_WITH_COMMAS(val / 1000) + 'K';
                    }
                }
            },
            tooltip: {
                fixed: { enabled: true, position: "topLeft" },
                custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                    const data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
                    const y = data[1];
                    // Set the position of your custom tooltip container manually
                    setTimeout(() => {
                        const tooltipEl = document.querySelector('.apexcharts-tooltip');
                        if (tooltipEl) {
                            tooltipEl.style.top = y - 40 + 'px';
                        }
                    }, 1);
                    return ('<ul class="menu-profitability">' +
                        '<li class="header"> <span class="dots" style="background-color:' + w.globals.colors[seriesIndex] + '"></span> ' + w.globals.seriesNames[seriesIndex] + ': ' + w.globals.initialSeries[seriesIndex].DISPLAY_DATA[dataPointIndex] + '</li>' +
                        '<li>Quantity: ' + $scope.$parent.NUMBER_WITH_COMMAS(w.globals.initialSeries[seriesIndex].data[dataPointIndex][2]) + '</li>' +
                        '<li>Net: ' + w.globals.initialSeries[seriesIndex].data[dataPointIndex][1] + '</li>' +
                        '<li>Unit Price: ' + w.globals.initialSeries[seriesIndex].data[dataPointIndex][0] + '</li>' +
                        '</ul>');
                },
            },
            legend: {
                show: CHART_DATA.LEGEND,
                position: 'bottom',
                offsetX: 1,
                offsetY: 5,
                labels: {
                    position: 'bottom',
                },
            },
            //responsive: [
            //    {
            //        breakpoint: 1367,
            //        options: {
            //            chart: {
            //                height: 290,
            //            }
            //        }
            //    },
            //    {
            //        breakpoint: 1920,
            //        options: {
            //            chart: {
            //                height: 380,
            //            }
            //        }
            //    },
            //    {
            //        breakpoint: 2736,
            //        options: {
            //            chart: {
            //                height: 400,
            //            }
            //        }
            //    },
            //]
        };
        var chart = new ApexCharts(document.querySelector("#" + CHART_NAME), options);
        chart.render();
    }
    var container;
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
        $scope.PRDCT_ANLYS_GET_PRDCT_OR_CTGRY_NAMES();
    };
    $scope.DATE_WEEK_PICKER = function (date, FLAG) {
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
        $scope.set_week_picker(date, FLAG != undefined ? 2 : 1);
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
            //end.setDate(end.getDate() - end.getDay() + 6 + parseInt($scope.START_DAY_OF_WEEK));
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
        $scope.Input_Model.DISPLAY_QUARTER_START_DATE = $filter('date')($scope.Input_Model.START_DATE, "dd/MM/yyyy") + " - " + $filter('date')($scope.Input_Model.END_DATE, "dd/MM/yyyy");
        const normalizeDate = (str) => new Date(str).toISOString().split("T")[0];
        if (FLAG == 1 && normalizeDate(new Date($scope.Input_Model.START_DATE)) !== normalizeDate(new Date($scope.Input_Model.QUARTER_START_DATE))) {
            $scope.Fn_CHANGE_FILTER()
        }
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
        //  if ($scope.Input_Model.PRODUCT_OR_CATEGORY_IDS_LIST.length == 0) {
        $scope.Fill_PRODUCT_OR_CATEGORY_IDS_LIST_Fn();
        //};
        if ($scope.Input_Model.PRODUCT_OR_CATEGORY_IDS_LIST.length > 0) {

            $scope.$parent.$parent.overlay_loading_powerInsight = 'block';
            if ($scope.Input_Model.ENTITY_BRANCH_LIST.length == 0) {
                $scope.Fn_Fill_ENTITY_BRANCH_LIST();
            };
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
                _pi_input_model_obj.P_OR_C_ID = $scope.Input_Model.IS_PRODUCT ? 2 : 1;
                _pi_input_model_obj.FLAG = $scope.Input_Model.DISPLAY_REVENUE == "Revenue" ? 1 : 2;
                _pi_input_model_obj.PRODUCT_OR_CATEGORY_IDS_LIST = $scope.Input_Model.PRODUCT_OR_CATEGORY_IDS_LIST;
                _pi_input_model_obj.PRODUCT_OR_CATEGORY_LIST = $scope.Input_Model.PRODUCT_OR_CATEGORY_LIST;
                PrcCommMethods.DASHBOARD_MODULES_API(_pi_input_model_obj, 'GETDATAFORCHART', 'POWERINSIGHTAPI').then(function (data) {
                    // $scope.$parent.overlay_loading_powerInsight = 'none';
                    $scope.CardLineData = [];
                    if (data.data != null) {
                        //if (component.COMPONENT_ID == 121) {
                        $scope.SetDisplayObjects(data.data, data.data.COMPONENT_TYPE_ID, index, component);
                        if ($scope.THIS_APP_PAGE_COMPONENTS_LIST.length - 1 == index && $scope.$parent.PI_INDEX_JS_LOAD == 2) {
                            // $scope.$parent.$parent.overlay_loadingNew = 'none';
                        }
                        // }
                    }
                });

            });
            if ($scope.$parent.PI_INDEX_JS_LOAD == 1) {
                $scope.$parent.PI_INDEX_JS_LOAD = 2;
            };
        };
    }
    $scope.SALES_PRODUCTS_LIST = [];
    $scope.SetDisplayObjects = function (data, COMPONENT_TYPE_ID, index, component) {
        switch (data.COMPONENT_TYPE_ID) {
            case 121:///Sales LP,MTP,YTD
                $scope.SALES_PRODUCTS_LIST = data.Salesdata;
                break;
            case 122: //Sales Trend
                $scope.Display_Model.STAFF_COST_TREND = data;
               // $scope.Fn_BIND_CHART_2("Sales_Trend", data, data, "string");
                break;
            case 123: //Sales Highlights
                $scope.HIGHLIGHT_DATA_LIST = data.HIGHLIGHT_DATA_LIST;
                if ($scope.HIGHLIGHT_DATA_LIST.length > 0) {
                    $scope.HIGHLIGHT_DATA_LIST[0].IS_HIGHLIGHT_ACTIVE = true;
                }
                break;
            case 124: //Sales Bubble Chart

                $scope.BUBBLE_CHART("Sales_Bubble_Chart", data, data, "string");
                break;
            case 125: //Unit Price Change
                $scope.LINE_CHART("Unit_Price", data.ChartOutputData, data, "string");
                break;
            case 126: //Rolling Sales Summary
                $scope.ROLLING_SALES_SUMMARY = data.DATAGRID_VALUES;
                break;
            case 127: //Session Wise Sales
                $scope.Display_Model.COMPONENT_127_DTL = data;
                $scope.COMPONENT_127_DTL = component;
                //$scope.Fn_SESSION_SALES("Session_Sales", data.ChartOutputData, data, "string");
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
    }
    $scope.PRODUCT_REMOVE_Fn = function (product, index) {
        $scope.ADD_PRODUCTS_LIST.splice(index, 1);
        if ($scope.ADD_PRODUCTS_LIST.length == 0) {
            $scope.SALES_PRODUCTS_LIST = [];
        }
        $scope.Fn_VIEW_ONLOAD_DATA("onchange", 1);
    }
    $scope.SELECTE_REVENUE_BY_Fn = function (_Renvenue) {
        $scope.Input_Model.DISPLAY_REVENUE = _Renvenue.name;
        $scope.GET_CHART_DATA($scope.COMPONENT_127_DTL, 1);
    }

    $scope.GET_CHART_DATA = function (component, index) {
        $scope.Fill_PRODUCT_OR_CATEGORY_IDS_LIST_Fn();
        if ($scope.Input_Model.PRODUCT_OR_CATEGORY_IDS_LIST.length > 0) {
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
            _pi_input_model_obj.P_OR_C_ID = $scope.Input_Model.IS_PRODUCT ? 2 : 1;
            _pi_input_model_obj.FLAG = $scope.Input_Model.DISPLAY_REVENUE == "Revenue" ? 1 : 2;
            _pi_input_model_obj.PRODUCT_OR_CATEGORY_IDS_LIST = $scope.Input_Model.PRODUCT_OR_CATEGORY_IDS_LIST;
            _pi_input_model_obj.PRODUCT_OR_CATEGORY_LIST = $scope.Input_Model.PRODUCT_OR_CATEGORY_LIST;
            PrcCommMethods.DASHBOARD_MODULES_API(_pi_input_model_obj, 'GETDATAFORCHART', 'POWERINSIGHTAPI').then(function (data) {
                $scope.CardLineData = [];
                if (data.data != null) {
                    $scope.SetDisplayObjects(data.data, data.data.COMPONENT_TYPE_ID, index, component);
                }
            });
        };
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
    $scope.Fill_PRODUCT_OR_CATEGORY_IDS_LIST_Fn = function () {
        $scope.Input_Model.PRODUCT_OR_CATEGORY_IDS_LIST = [];
        $scope.Input_Model.PRODUCT_OR_CATEGORY_LIST = [];
        angular.forEach($scope.ADD_PRODUCTS_LIST, function (_product, index) {
            var _model = Object();
            _model.ID = _product.PRODUCT_ID;
            $scope.Input_Model.PRODUCT_OR_CATEGORY_IDS_LIST.push(_model);
            var _modelObj = Object();
            _modelObj.PRODUCT_ID = _product.PRODUCT_ID;
            _modelObj.PRODUCT_NAME = _product.PRODUCT_NAME;
            _modelObj.DISPLAY_NAME = "(P-" + (index + 1) + ")";
            _modelObj.SORT_ORDER = index;
            $scope.Input_Model.PRODUCT_OR_CATEGORY_LIST.push(_modelObj);
        });
    }

    $scope.CURRENCY_Fn = function (currency) {
        $scope.Input_Model.DISPLAY_TEXT_CURRENCY = currency.Value;
        $scope.Input_Model.CURRENCY_ID = currency.Key;
        $scope.Fn_CHANGE_FILTER("CurrencyChange");
    };
    $scope.RESET_FILTER = function () {
        $scope.Input_Model.ENTITY_BRANCH_LIST = [];
        $scope.RESET_SITES_Fn();
        $scope.CURRENCY_Fn($scope.CURRENCY_LIST[0]);
        // $scope.Fn_CHANGE_FILTER("Reset");
        window.scrollTo(0, 0);

    };
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
        $scope.CONTROLLER_LOAD();
    };
    $scope.DateMonthView();
    $scope.DateQuarterView();
    $scope.$parent.PI_child_scope = $scope;
});