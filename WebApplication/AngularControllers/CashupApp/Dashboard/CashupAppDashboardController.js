app.controller('CashupAppDashboardController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $interval,$localStorage) {
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(2);
    $scope.$parent.CASHUP_COMMON_RESET_Fn();
    $scope.DASHBOARD_SEARCH_OBJ = {
        CUSTOMER_ID: parseInt($cookies.get("CUSTOMER_ID")),
        ENTITY_ID: parseInt($cookies.get("ENTITY_ID")),
        USER_ID: parseInt($cookies.get("USERID")),
        START_DATE: null,
        END_DATE: null,
        SELECTED_SITE: null
    }
    $scope.K_M_T_VALUE_INIT = 1000;
    $scope.FILTERED_SITES_LIST = [];
    $scope.DASHBOARD_SALES = {
        SALES: {
            CURRENT: 0,
            PREVIOUS:0
        },
        NET: {
            CURRENT: 0,
            PREVIOUS: 0
        },
        TAX: {
            CURRENT: 0,
            PREVIOUS: 0
        },
        COVERS: {
            CURRENT: 0,
            PREVIOUS: 0
        },
        COMPS: {
            CURRENT: 0,
            PREVIOUS: 0
        },
        VOIDS: {
            CURRENT: 0,
            PREVIOUS: 0
        },
        PETTY_CASH: {
            CURRENT: 0,
            PREVIOUS: 0
        },
        SPEND: {
            CURRENT: null,
            PREVIOUS: null
        }
        
    };
    $scope.CURRENCY_SYMBOL = decodeURIComponent($cookies.get("CURRENCY_SYMBOL")); 
    $scope.GET_CASHUP_TYPE = function (Sites) {
        var CashupModelObj = {
            CUSTOMER_ID: $scope.DASHBOARD_SEARCH_OBJ.CUSTOMER_ID,
            ENTITY_ID: $scope.DASHBOARD_SEARCH_OBJ.ENTITY_ID
        };
        PrcCommMethods.CASHUP_APP_API(CashupModelObj, 'GET_CASHUP_TYPE').then(function (data) {
            if (data.data) {
                $scope.CashupTypeData = data.data;
                Sites.forEach(function (site) {
                    var matchedData = $scope.CashupTypeData.Table.find(function (cashup) {
                        return cashup.BRANCH_ID === site.BRANCH_ID;
                    });
                    if (matchedData) {
                        site.CASHUP_TYPE = matchedData.CASHUP_TYPE;
                        site.CASHUP_TYPE_MSTR_ID = matchedData.CASHUP_TYPE_MSTR_ID;
                        site.WILl_USE_IN_CASHUP = true;
                    }
                    else {
                        site.WILl_USE_IN_CASHUP = false;
                    }
                });
                Sites = Sites.filter(_site => _site.WILl_USE_IN_CASHUP == true);
                $scope.FILTERED_SITES_LIST = Sites;
                if ($scope.FILTERED_SITES_LIST && $scope.FILTERED_SITES_LIST.length > 0) {
                    $scope.FILTERED_SITES_LIST[0].IS_SELECTED = true;
                    $scope.SELECT_SITE($scope.FILTERED_SITES_LIST[0]);
                    $scope.CASHUP_PRIVILEGE = true;
                }
                else {
                    $scope.CASHUP_PRIVILEGE = false;
                }
                $scope.SELECT_SITE(Sites[0]);
            } else {
                $scope.CASHUP_PRIVILEGE = false;
            }
        }).catch(function (error) {
            $scope.CASHUP_PRIVILEGE = false;
        });
    }
    $scope.SALES_BY_SESSION = {
        series: [],
        labels:[]
    }
    $scope.SALES_BY_MEDIA = {
        series: [],
        labels: []
    }
    $scope.SALES_BY_REVENUE = {
        series: [],
        labels: []
    }
    $scope.SALES_BY_CATEGORY = {
        series: [],
        labels: []
    }
    $scope.SALES_BY_COMP_VOID = {
        series: [],
        labels: []
    }

    $scope.SALES_BY_AREA = {
        series: [],
        labels: []
    }
    $scope.salesByMediaChart = null;
    $scope.salesBySessionChart = null;
    $scope.salesByRevenueTypeChart = null;
    $scope.salesByCategoryChart = null;
    $scope.complimentaryVoidChart = null;
    $scope.salesByAreaChart = null;


    //$scope.ADMIN_GET_BRANCH = function () {
    //    var CashupAppModelObj = new Object();
    //    CashupAppModelObj.CUSTOMER_ID = $scope.DASHBOARD_SEARCH_OBJ.CUSTOMER_ID;
    //    CashupAppModelObj.ENTITY_ID = $scope.DASHBOARD_SEARCH_OBJ.ENTITY_ID;
    //    CashupAppModelObj.BRANCH_CODE = '';
    //    CashupAppModelObj.BRANCH_NAME = '';
    //    CashupAppModelObj.CONTACT_NAME = '';
    //    CashupAppModelObj.LOCATION_IDS = '';
    //    CashupAppModelObj.ACTIVE = 1;
    //    CashupAppModelObj.PAGE_NO = 1;
    //    CashupAppModelObj.PAGE_SIZE = 1000;
    //    CashupAppModelObj.USER_ID = $scope.DASHBOARD_SEARCH_OBJ.USER_ID;
    //    PrcCommMethods.ADMIN_API(CashupAppModelObj, 'ADMIN_GET_BRANCH').then(function (data) {
    //        if (data.data != null && data.data.Table.length > 0) {
    //            $scope.GET_CASHUP_TYPE(data.data.Table);
    //        }
    //        else {
    //            $scope.FILTERED_SITES_LIST = [];
    //        }
    //    });
    //};
    //$scope.ADMIN_GET_BRANCH();

    if ($localStorage.USER_ROLES_BY_USER_ID != null && $localStorage.USER_ROLES_BY_USER_ID != undefined) {
        $scope.GET_CASHUP_TYPE(JSON.parse($localStorage.USER_ROLES_BY_USER_ID));
    }
    else {
        $scope.FILTERED_SITES_LIST = [];
    }
    $scope.SELECT_SITE = function (site) {
        $scope.DASHBOARD_SEARCH_OBJ.SELECTED_SITE = site;
        if ($scope.DASHBOARD_SEARCH_OBJ.START_DATE != null && $scope.DASHBOARD_SEARCH_OBJ.END_DATE != null) {
            $scope.GET_CASHUP_DSHBRD_SALES();
            $scope.GET_CASHUP_PIE_CHARTS();
            $scope.GET_CASHUP_BAR_CHARTS();
        }
        
    }
    $scope.charts = {}; 
    $scope.DOUGHNUT = function (CHART_NAME,CHART_DATA) {
        $('#' + CHART_NAME).empty();
        //if (chart != null) {
        //    chart.destroy();
        //}

        if ($scope.charts[CHART_NAME] != null) {
            $scope.charts[CHART_NAME].destroy();
        }

        var chartOptions = {
            series: CHART_DATA.SERIES.map(Math.abs),
            labels: CHART_DATA.LABELS,
            plotOptions: {
                pie: {
                    donut: {
                        labels: {
                            show: true,
                            total: {
                                fontSize: '12px',
                                color: '#94A3B8',
                                style: {
                                    fontWeight: '500',
                                    textTransform: 'uppercase'
                                },
                                show: true,
                                formatter: function (w) {

                                    let total = $scope.CURRENCY_SYMBOL + ' ' + w.globals.seriesTotals.reduce((a, b) => Math.abs(a) + Math.abs(b), 0);
                                    return total;
                                }
                            }
                        }
                    }
                }
            },
            chart: {
                height: 350,
                type: 'donut',
                fontFamily: 'Montserrat',
                stacked: true,
                toolbar: {
                    show: false
                },
            },
            dataLabels: {
                enabled: false
            },
            donut: {
                labels: {
                    show: true,
                    total: {
                        show: true,
                    }
                }
            },
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200
                    },
                    legend: {
                        show: true
                    }
                }
            }],
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                fontWeight: 500,
                labels: {
                    colors: '#6B7C94',
                    fontFamily: 'Montserrat',

                    fontSize: '12px'
                }
            },
            colors: ['#05A6F0', '#1DCA5D', '#F3A515', '#3B80F2', '#ACE1FA', '#77DF9E', '#F4D36B', '#89B3F7', '#CDEDFC', '#EEFFF4', '#FFF7DE'],

        }

        var newChart = new ApexCharts(document.querySelector("#" + CHART_NAME), chartOptions);
        $scope.charts[CHART_NAME] = newChart;
        newChart.render();
        //chart = new ApexCharts(document.querySelector("#" + CHART_NAME), chartOptions);
        //chart.render();
    }

    $scope.bar_charts = {}; 
    $scope.BARCHART_WITH_LINE = function (CHART_NAME, CHART_DATA) {
        $('#' + CHART_NAME).empty();

        if ($scope.charts[CHART_NAME] != null) {
            $scope.charts[CHART_NAME].destroy();
        }
        //var yAxisSeries = [];

        //angular.forEach(CHART_DATA.BAR_CHART_SERIES, function (item) {
        //    delete item.yaxisIndex;
        //    var yAxisObj = new Object();

        //    yAxisObj.labels = {
        //        formatter: function (value) {
        //            return value < $scope.K_M_T_VALUE_INIT ? $scope.NUMBER_WITH_COMMAS(value) : $scope.NUMBER_WITH_COMMAS(value / 1000) + 'K';  //(value / 1000000).toFixed(1) + 'M';
        //        },
        //        style: {
        //            colors: '#94A3B8',
        //            fontFamily: 'Montserrat',
        //            fontWeight: 500,
        //            fontSize: '12px'
        //        },
        //        seriesName: item.name,
        //        opposite: item.name == "Covers" ? true : false
        //    }
        //    yAxisSeries.push(yAxisObj);

        //});
        var barChartOptions = {
            series: CHART_DATA.BAR_CHART_SERIES,
            chart: {
                height: 350,
                type: 'line',
                fontFamily: 'Montserrat',
                stacked: true,
                toolbar: {
                    show: false
                },
            },
            stroke: {
                width: [0, 0, 0, 2],
                curve: 'smooth',
            },
            dataLabels: {
                enabled: false
            },
            fill: {
                opacity: [1, 1, 1, 1],
            },
            yaxis: [
                {
                    
                    labels: {
                        formatter: function (value) {
                            return value < $scope.K_M_T_VALUE_INIT ? $scope.NUMBER_WITH_COMMAS(value) : $scope.NUMBER_WITH_COMMAS(value / 1000) + 'K';  //(value / 1000000).toFixed(1) + 'M';
                        },
                        style: {
                            colors: '#94A3B8',
                            fontFamily: 'Montserrat',
                            fontWeight: 500,
                            fontSize: '12px'
                        },
                    },
                },
                {
                    
                    opposite: true,
                    labels: {
                        formatter: function (value) {
                            return value < $scope.K_M_T_VALUE_INIT ? $scope.NUMBER_WITH_COMMAS(value) : $scope.NUMBER_WITH_COMMAS(value / 1000) + 'K';
                        },
                        style: {
                            colors: '#94A3B8',
                            fontFamily: 'Montserrat',
                            fontWeight: 500,
                            fontSize: '12px'
                        },
                    },
                }
            ],
            xaxis: {
                categories: CHART_DATA.categories,
                labels: {
                    style: {
                        colors: '#94A3B8',
                        fontFamily: 'Montserrat',
                        fontWeight: 500,
                        fontSize: '12px'
                    }
                },
            },
            tooltip: {
                shared: true,
                intersect: false,
            },
            colors: ['#05A6F0', '#1DCA5D', '#F3A515', '#1E2432'],
            plotOptions: {
                bar: {
                    borderRadius: 3,
                    borderRadiusApplication: 'end',

                }
            },
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                fontWeight: 500,
                labels: {
                    colors: '#6B7C94',
                    fontFamily: 'Montserrat',

                    fontSize: '12px'
                }
            },
        };
        

        var newBarChart = new ApexCharts(document.querySelector("#" + CHART_NAME), barChartOptions);
        $scope.bar_charts[CHART_NAME] = newBarChart;
        newBarChart.render();
    }

    $scope.bar_charts2 = {};
    $scope.BARCHART = function (CHART_NAME, CHART_DATA,type) {
        $('#' + CHART_NAME).empty();

        if ($scope.bar_charts2[CHART_NAME] != null) {
            $scope.bar_charts2[CHART_NAME].destroy();
        }

        angular.forEach(CHART_DATA.BAR_CHART_SERIES, function (item) {
            delete item.type;
        });
        
        var options = {
            series: CHART_DATA.BAR_CHART_SERIES,

            chart: {
                height: 350,
                type: CHART_DATA.CHART_TYPE,
                fontFamily: 'Montserrat',
                stacked: CHART_DATA.STACKED,
                toolbar: {
                    show: false
                },
            },
            stroke: {
                width: CHART_DATA.STROKE_WIDTH
            },
            dataLabels: {
                enabled: false
            },
            fill: {
                opacity: [1, 1, 1, 1],
            },
            yaxis: {

                labels: {
                    formatter: function (value) {
                        return value < $scope.K_M_T_VALUE_INIT ? $scope.NUMBER_WITH_COMMAS(value) : $scope.NUMBER_WITH_COMMAS(value / 1000) + 'K';
                    },
                    style: {
                        colors: '#94A3B8',
                        fontFamily: 'Montserrat',
                        fontWeight: 500,
                        fontSize: '12px'
                    }
                },
            },
            xaxis: {
                categories: CHART_DATA.categories,
                title: {
                    text: 'Week',
                    position: 'bottom',
                    style: {
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#475569'
                    }
                },
                labels: {
                    style: {
                        colors: '#94A3B8',
                        fontFamily: 'Montserrat',
                        fontWeight: 500,
                        fontSize: '12px'
                    }
                },
            },
            tooltip: {
                shared: true,
                intersect: false,
            },

            colors: CHART_DATA.COLORS,

            plotOptions: {
                bar: {
                    borderRadius: CHART_DATA.BORDER_RADIUS,
                    borderRadiusApplication: 'end',
                    columnWidth: CHART_DATA.COLOUMN_WIDTH + '%'
                }
            },
            legend: {
                position: 'bottom',
                fontWeight: 500,

                horizontalAlign: 'center',
                labels: {
                    colors: '#6B7C94',
                    fontFamily: 'Montserrat',
                    fontSize: '12px'
                }
            },
        };
        
        var newBarChart = new ApexCharts(document.querySelector("#" + CHART_NAME), options);
        $scope.bar_charts2[CHART_NAME] = newBarChart;
        newBarChart.render();
    }


    $scope.GET_CASHUP_PIE_CHARTS = function () {
        var CashupAppModelObject = new Object();

        // HARDCODED HERE!!! FOR TESTING
        //CashupAppModelObject.ENTITY_ID = 100;
        //CashupAppModelObject.BRANCH_ID = 145;
        //CashupAppModelObject.START_DATE = '2025-01-01';
        //CashupAppModelObject.END_DATE = '2025-06-30';


        CashupAppModelObject.ENTITY_ID = $scope.DASHBOARD_SEARCH_OBJ.ENTITY_ID;
        CashupAppModelObject.BRANCH_ID = $scope.DASHBOARD_SEARCH_OBJ.SELECTED_SITE.BRANCH_ID;
        CashupAppModelObject.START_DATE = $scope.DASHBOARD_SEARCH_OBJ.START_DATE;
        CashupAppModelObject.END_DATE = $scope.DASHBOARD_SEARCH_OBJ.END_DATE;
        PrcCommMethods.CASHUP_APP_API(CashupAppModelObject, 'GET_CASHUP_PIE_CHARTS').then(function (data) {
            if (data.data != null && data.data.length > 0) {
                var SALES_CHART_DATA = new Object();
                SALES_CHART_DATA.SERIES = data.data[0].SERIES;
                SALES_CHART_DATA.LABELS = data.data[0].LABELS;
                $scope.SALES_BY_SESSION_SERIES = data.data[0].SERIES;
                $scope.DOUGHNUT('Sales_by_Session', SALES_CHART_DATA);

                var MEDIA_CHART_DATA = new Object();
                MEDIA_CHART_DATA.SERIES = data.data[1].SERIES;
                MEDIA_CHART_DATA.LABELS = data.data[1].LABELS;
                $scope.SALES_BY_MEDIA_SERIES = data.data[1].SERIES;
                $scope.DOUGHNUT('Sales_by_Media', MEDIA_CHART_DATA);


                var REVENUE_CHART_DATA = new Object();
                REVENUE_CHART_DATA.SERIES = data.data[2].SERIES;
                REVENUE_CHART_DATA.LABELS = data.data[2].LABELS;
                $scope.SALES_BY_REVENUE_SERIES = data.data[2].SERIES;
                $scope.DOUGHNUT('Sales_by_Revenue_Type', REVENUE_CHART_DATA);

                var CATEGORY_CHART_DATA = new Object();
                CATEGORY_CHART_DATA.SERIES = data.data[3].SERIES;
                CATEGORY_CHART_DATA.LABELS = data.data[3].LABELS;
                $scope.SALES_BY_CATEGORY_SERIES = data.data[3].SERIES;
                $scope.DOUGHNUT('Sales_by_Category', CATEGORY_CHART_DATA);


                var COMP_CHART_DATA = new Object();
                COMP_CHART_DATA.SERIES = data.data[4].SERIES;
                COMP_CHART_DATA.LABELS = data.data[4].LABELS;
                $scope.SALES_BY_COMP_SERIES = data.data[4].SERIES;
                $scope.SALES_BY_COMP_EMPTY = data.data[4].SERIES.reduce((acc, val) => acc + val, 0) == 0 ? true : false;
                $scope.DOUGHNUT('Complimentary_Void', COMP_CHART_DATA);

                var AREA_CHART_DATA = new Object();
                AREA_CHART_DATA.SERIES = data.data[5].SERIES;
                AREA_CHART_DATA.LABELS = data.data[5].LABELS;
                $scope.SALES_BY_AREA_SERIES = data.data[5].SERIES;
                $scope.DOUGHNUT('Sales_by_Area', AREA_CHART_DATA);
            }
            else {
                $scope.SALES_BY_SESSION_SERIES = [];
                $scope.SALES_BY_MEDIA_SERIES = [];
                $scope.SALES_BY_REVENUE_SERIES = [];
                $scope.SALES_BY_CATEGORY_SERIES = []
                $scope.SALES_BY_COMP_SERIES = [];
                $scope.SALES_BY_AREA_SERIES = [];
                $scope.SALES_BY_COMP_EMPTY = true;
            }
        });
        
    }


    $scope.$on('$destroy', function () {
        if ($scope.salesBySessionChart) {
            $scope.salesBySessionChart.destroy();
        }
        if ($scope.salesByMediaChart) {
            $scope.salesByMediaChart.destroy();
        }
    });
    $scope.GET_CASHUP_BAR_CHARTS = function () {
        var CashupAppModelObject = new Object();
        //CashupAppModelObject.BRANCH_ID = 145;
        //CashupAppModelObject.YEAR = '2024';

        CashupAppModelObject.BRANCH_ID = $scope.DASHBOARD_SEARCH_OBJ.SELECTED_SITE.BRANCH_ID;
        CashupAppModelObject.YEAR = new Date().getFullYear().toString();

        PrcCommMethods.CASHUP_APP_API(CashupAppModelObject, 'GET_CASHUP_BAR_CHARTS').then(function (data) {
            if (data.data != null && data.data.length>0) {
                var SALES_TREND_BAR_CHART_DATA = new Object();
                SALES_TREND_BAR_CHART_DATA.BAR_CHART_SERIES = data.data[0].BAR_CHART_SERIES;

                if (data.data[0].BAR_CHART_SERIES.length == 1 && data.data[0].BAR_CHART_SERIES[0].name == 'Covers' && data.data[0].BAR_CHART_SERIES[0].data.reduce((acc, val) => acc + val, 0) == 0) {
                    $scope.SALES_TREND_EMPTY = true;
                }
                else {
                    $scope.SALES_TREND_EMPTY = false;
                }
                if (data.data[1].BAR_CHART_SERIES.length == 0) {
                    $scope.PAYMENT_TYPE_EMPTY = true;
                }
                else {
                    $scope.PAYMENT_TYPE_EMPTY = false;
                }
                if (data.data[2].BAR_CHART_SERIES[0].data.reduce((acc, val) => acc + val, 0) == 0 && data.data[2].BAR_CHART_SERIES[1].data.reduce((acc, val) => acc + val, 0) == 0) {
                    $scope.VARIANCE_EMPTY = true;
                }
                else {
                    $scope.VARIANCE_EMPTY = false;
                }

                SALES_TREND_BAR_CHART_DATA.categories = data.data[0].categories;
                $scope.BARCHART_WITH_LINE('sales', SALES_TREND_BAR_CHART_DATA);
                $scope.BARCHART('Payment_Type', data.data[1]);
                $scope.BARCHART('Cashup_Variance', data.data[2]);

            }
            else {
                $scope.SALES_TREND_EMPTY = true;
                $scope.PAYMENT_TYPE_EMPTY = true;
                $scope.VARIANCE_EMPTY = true;
            }
        });
    }
    
    
    $scope.GET_CASHUP_DSHBRD_SALES = function () {
        var CashupAppModelObj = new Object();
        CashupAppModelObj.CURRENCY_ID = parseInt($cookies.get("CURRENCY_ID"));
        CashupAppModelObj.START_DATE = $scope.DASHBOARD_SEARCH_OBJ.START_DATE;
        CashupAppModelObj.END_DATE = $scope.DASHBOARD_SEARCH_OBJ.END_DATE;
        CashupAppModelObj.BRANCH_ID = $scope.DASHBOARD_SEARCH_OBJ.SELECTED_SITE.BRANCH_ID;
        PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'GET_CASHUP_DSHBRD_SALES').then(function (data) {
            if (data.data != null && data.data.Table.length > 1) {
                var current = data.data.Table.filter(_row => _row.PERIOD == 0);
                var previous = data.data.Table.filter(_row => _row.PERIOD == -1);
                if (current != null || current != undefined) {
                    $scope.DASHBOARD_SALES.SALES.CURRENT = current[0].SALES;
                    $scope.DASHBOARD_SALES.NET.CURRENT = current[0].NET;
                    $scope.DASHBOARD_SALES.TAX.CURRENT = current[0].TAX;
                    $scope.DASHBOARD_SALES.COVERS.CURRENT = current[0].COVERS;
                    $scope.DASHBOARD_SALES.COMPS.CURRENT = current[0].COMPS;
                    $scope.DASHBOARD_SALES.VOIDS.CURRENT = current[0].VOIDS;
                    $scope.DASHBOARD_SALES.PETTY_CASH.CURRENT = current[0].PETTY_CASH;
                }
                if (previous != null || previous != undefined) {
                    $scope.DASHBOARD_SALES.SALES.PREVIOUS = previous[0].SALES;
                    $scope.DASHBOARD_SALES.NET.PREVIOUS = previous[0].NET;
                    $scope.DASHBOARD_SALES.TAX.PREVIOUS = previous[0].TAX;
                    $scope.DASHBOARD_SALES.COVERS.PREVIOUS = previous[0].COVERS;
                    $scope.DASHBOARD_SALES.COMPS.PREVIOUS = previous[0].COMPS;
                    $scope.DASHBOARD_SALES.VOIDS.PREVIOUS = previous[0].VOIDS;
                    $scope.DASHBOARD_SALES.PETTY_CASH.PREVIOUS = previous[0].PETTY_CASH;
                }

                $scope.DASHBOARD_SALES.SPEND.CURRENT = $scope.SPEND_CALCULATION($scope.DASHBOARD_SALES.SALES.CURRENT, $scope.DASHBOARD_SALES.COVERS.CURRENT);
                $scope.DASHBOARD_SALES.SPEND.PREVIOUS = $scope.SPEND_CALCULATION($scope.DASHBOARD_SALES.SALES.PREVIOUS, $scope.DASHBOARD_SALES.COVERS.PREVIOUS);

            }
            else {
                $scope.DASHBOARD_SALES = {
                    SALES: {
                        CURRENT: 0,
                        PREVIOUS: 0
                    },
                    NET: {
                        CURRENT: 0,
                        PREVIOUS: 0
                    },
                    TAX: {
                        CURRENT: 0,
                        PREVIOUS: 0
                    },
                    COVERS: {
                        CURRENT: 0,
                        PREVIOUS: 0
                    },
                    COMPS: {
                        CURRENT: 0,
                        PREVIOUS: 0
                    },
                    VOIDS: {
                        CURRENT: 0,
                        PREVIOUS: 0
                    },
                    PETTY_CASH: {
                        CURRENT: 0,
                        PREVIOUS: 0
                    },
                    SPEND: {
                        CURRENT: null,
                        PREVIOUS:null
                    }
                };
            }
        });
    }
    $scope.SALES_PERCENT_CALCULATION = function (_current, _previous) {
        if (_current == 0 || _previous == 0) {
            return null;
        }
        else {
            return (_current - _previous) * 100 / _current;
        }
    }
    $scope.SPEND_CALCULATION = function (_sales,_covers) {
        if (_covers == 0) {
            return null;
        }
        else {
            return (_sales / _covers);
        }
    }

    
    function reportrange(startDate, endDate) {
        if (!$scope.$$phase && !$scope.$root.$$phase) {
            $scope.$apply(function () {
                $scope.DASHBOARD_SEARCH_OBJ.START_DATE = startDate.format($scope.$parent.DB_DATE_FORMAT);
                $scope.DASHBOARD_SEARCH_OBJ.END_DATE = endDate.format($scope.$parent.DB_DATE_FORMAT);
            });
        } else {
            $scope.DASHBOARD_SEARCH_OBJ.START_DATE = startDate.format($scope.$parent.DB_DATE_FORMAT);
            $scope.DASHBOARD_SEARCH_OBJ.END_DATE = endDate.format($scope.$parent.DB_DATE_FORMAT);
        }

        $('#reportrange span').html(startDate.format($scope.$parent.DATE_RANGE_FORMAT) + ' - ' + endDate.format($scope.$parent.DATE_RANGE_FORMAT));
        if ($scope.DASHBOARD_SEARCH_OBJ.SELECTED_SITE != null && $scope.DASHBOARD_SEARCH_OBJ.SELECTED_SITE != undefined) {
            $scope.GET_CASHUP_DSHBRD_SALES();
            $scope.GET_CASHUP_PIE_CHARTS();
            $scope.GET_CASHUP_BAR_CHARTS(); 
        }
        
        
    }
    $(function () {

        startDate = new moment().add(0, 'months').date(1);
        endDate = moment().endOf('month');
        $scope.$parent.SetUpDateRangeMultiDatePicker('reportrange', startDate, endDate, reportrange);
        $('#reportrange span').html(startDate.format($scope.$parent.DATE_RANGE_FORMAT) + ' - ' + endDate.format($scope.$parent.DATE_RANGE_FORMAT));
    });

    $(document).on("click", ".ranges ul li", function (event) {

        var a = $(this).attr("data-range-key");
        if (a == "Custom Date" && ($scope.loader == 1)) {
            $scope.loader = 2;
            var start = moment().startOf('month');
            var end = moment().add(1, 'M').endOf('month');
            
            $scope.$parent.SetUpDateRangeMultiDatePicker('reportrange', start, end, reportrange, 1, "right", 'Open');
            $('#reportrange').data('daterangepicker').show();
        }
        else {
            $scope.loader = 1;
        }
    });


    $scope.Fn_CURRENCY_CULTURE = function (Number) {
        return Number;
    };
    $scope.NUMBER_WITH_COMMAS = function (x) {
        if (x == undefined) {
            return '';
        }
        else {
            return $scope.Fn_CURRENCY_CULTURE(x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
        }
    };
    
    // Petty Cash

    var pettyCashOptions = {
        series: [211, 221, 220, 118, 110],
        labels: ['Repair', 'Travel', 'Miscellaneous', 'Bar consumables', 'Cleaning'],
        plotOptions: {
            pie: {
                donut: {
                    labels: {
                        show: true,
                        total: {
                            fontSize: '12px',
                            color: '#94A3B8',
                            fontWeight: 500,
                            show: true,
                            formatter: function (w) {
                                return '£ ' + w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                            }
                        }
                    }
                }
            }
        },
        chart: {
            height: 350,
            type: 'donut',
            fontFamily: 'Montserrat',
            stacked: true,
            toolbar: {
                show: false
            },
        },
        dataLabels: {
            enabled: false
        },
        donut: {
            labels: {
                show: true,
                total: {
                    show: true,
                }
            }
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    show: true
                }
            }
        }],
        legend: {
            position: 'bottom',
            fontWeight: 500,
            horizontalAlign: 'center',
            labels: {
                colors: '#6B7C94',
                fontFamily: 'Montserrat',
                fontSize: '12px'
            }
        },

        colors: ['#05A6F0', '#1DCA5D', '#F3A515', '#3B80F2', '#ACE1FA', '#77DF9E', '#F4D36B', '#89B3F7', '#CDEDFC', '#EEFFF4', '#FFF7DE'],

    };

    var pettyCashChart = new ApexCharts(document.querySelector("#Petty_Cash"), pettyCashOptions);
    pettyCashChart.render();




    $scope.REDIRECT_CASHUP_ENTRY = function () {
        $scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID = null;
        $scope.$parent.CASHUP_ENTRY_SEARCH.AREA_ID = null;
        $scope.$parent.CASHUP_ENTRY_SEARCH.SESSION_ID = null;
        $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_DATE = null;
        $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_ID = null;
        $scope.$parent.CASHUP_ENTRY_SEARCH.FILTERED_SITES_LIST = [];
        $scope.$parent.CASHUP_ENTRY_SEARCH.STANDARD_ROLE_ID = null;
        $scope.$parent.CASHUP_ENTRY_SEARCH.IS_DATA_ENTRY_ENABLED = false;
        $scope.$parent.CASHUP_ENTRY_SEARCH.IS_SUBMIT_BUTTON = false;
        $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_APPROVAL = false;
        $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_LIST = [];
        $scope.$parent.SELECTED_SITE = null;
        $scope.$parent.SELECTED_AREA = null;
        $scope.$parent.SELECTED_SESSION = null;
        $scope.$parent.CASHUP_BY_AREA = null;
        $scope.$parent.CASHUP_DATE = null;
        $location.path('CashUpApp_Entry');
    }

    $scope.EXPORT_PAGE_TO_PDF = function () {
        window.scrollTo(0, 0);
        document.getElementById("loader").style.display = "block";
        const node = document.getElementById("PRINT_REPORT");
        const clone = node.cloneNode(true);

        

        elementsToRemove = clone.querySelectorAll('#cashup-report-hide');
        elementsToRemove.forEach(el => el.remove());

        clone.querySelectorAll('[title]').forEach(el => el.removeAttribute('title'));
        clone.querySelectorAll('[data-bs-toggle="tooltip"], [tooltip]').forEach(el => el.remove());
        clone.querySelectorAll('.tooltip, .bs-tooltip-top, .bs-tooltip-bottom, .bs-tooltip-start, .bs-tooltip-end').forEach(el => el.remove());
        //const liveSiteFilterValue = document.querySelector('#select_label') ?.textContent.trim();
        //const liveDateRangeValue = document.querySelector('#reportrange span') ?.textContent.trim();


        //var elementsToRemove = clone.querySelectorAll('.col-xxl-2.col-xl-2.col-md-2, .col-xxl-auto.col-xl-auto.col-md-auto');
        //elementsToRemove.forEach(el => el.remove());

        //elementsToRemove = clone.querySelectorAll('#cashup-report-hide');
        //elementsToRemove.forEach(el => el.remove());
        

        

        //// --- Filter Display Logic (uses the new variables) ---
        //const filterDisplayBar = document.createElement('div');
        //filterDisplayBar.style.display = 'flex';
        //filterDisplayBar.style.flexWrap = 'wrap';
        //filterDisplayBar.style.gap = '25px';
        //filterDisplayBar.style.marginBottom = '20px';
        //filterDisplayBar.style.padding = '10px';
        //filterDisplayBar.style.border = '1px solid #e0e0e0';
        //filterDisplayBar.style.borderRadius = '5px';
        //filterDisplayBar.style.backgroundColor = '#f9f9f9';
        //filterDisplayBar.style.alignItems = 'center';

        //// Use the value read from the LIVE document
        //if (liveSiteFilterValue) {
        //    const siteDisplay = document.createElement('div');
        //    siteDisplay.innerHTML = `<strong>Site:</strong> ${liveSiteFilterValue}`;
        //    filterDisplayBar.appendChild(siteDisplay);
        //}

        //// Use the value read from the LIVE document
        //if (liveDateRangeValue) {
        //    const dateDisplay = document.createElement('div');
        //    dateDisplay.innerHTML = `<strong>Date Range:</strong> ${liveDateRangeValue}`;
        //    filterDisplayBar.appendChild(dateDisplay);
        //}

        //// Now, remove the original container from the clone
        //const originalFilterContainer = clone.querySelector('.resCashupHeader');
        //if (originalFilterContainer) {
        //    originalFilterContainer.remove();
        //}

        //// Remove overflow so all rows render fully in the iframe
        //const tableWrapper = clone.querySelector('.table-responsive');
        //if (tableWrapper) {
        //    tableWrapper.style.overflow = 'visible';
        //    tableWrapper.style.maxHeight = 'none';
        //}

        
        // --- END: Filter Display Logic ---

        var HTML = '<html><head><link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/timepicker/1.3.5/jquery.timepicker.min.css">' +
            '<link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />' +
            '<link href="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/fontawesome-pro-6.5.1-web/css/fontawesome.min.css" rel="stylesheet" />' +
            '<link href="https://app.wenodo.com/E_Scripts/Select2angularjs/select2.css" rel="stylesheet" />' +
            '<link href="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/fontawesome-pro-6.5.1-web/css/light.css" rel="stylesheet" />' +
            '<link href="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/fontawesome-pro-6.5.1-web/css/regular.css" rel="stylesheet" />' +
            '<link href="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/fontawesome-pro-6.5.1-web/css/solid.css" rel="stylesheet" />' +
            '<link href="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/fontawesome-pro-6.5.1-web/css/brands.css" rel="stylesheet" />' +
            '<link rel="stylesheet" href="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/bootstrap/bootstrap.css" />' +
            '<link href="https://app.wenodo.com/E_Scripts/daterangepicker-master/daterangepicker.css" rel="stylesheet" />' +
            '<link href="https://app.wenodo.com/E_Scripts/bootstrap-datepicker-1.6.4-dist/css/bootstrap-datepicker3.css" rel="stylesheet" />' +
            '<link href=" https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/css/select2.min.css" rel="stylesheet" />' +
            '<link rel="stylesheet" type="text/css" href="https://app.wenodo.com/E_Content/CustomCss/HR/hr-style.css?v=2" />' +
            '<link rel="stylesheet" type="text/css" href="https://app.wenodo.com/E_Content/CustomCss/HR/responsive.css">' +
            '<link rel="stylesheet" type="text/css" href="https://app.wenodo.com/E_Content/CustomCss/wenodo-style.css">' +
            '<link href="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/Countries/intltelinput.min.css" rel="stylesheet" />' +
            '<script src="https://app.wenodo.com/AngularControllers/MasterCntrl.js"></script>' +
            '<script src="https://app.wenodo.com/AngularControllers/HumanResource/HRIndexController.js"></script>' +
            '<script src="https://app.wenodo.com/AngularControllers/HumanResource/UserJourneyController.js"></script>' +
            '<script src="https://app.wenodo.com/E_Scripts/angular-sanitize.min.js"></script>' +
            '<script src="https://app.wenodo.com/E_Scripts/MomentTimePicker/moment-with-locales.min.js"></script>' +
            '<script src="https://app.wenodo.com/E_Scripts/MomentTimePicker/angular-moment-picker.min.js"></script>' +
            '<link href="https://app.wenodo.com/E_Scripts/MomentTimePicker/angular-moment-picker.min.css" rel="stylesheet" />' +
            '<link href="https://app.wenodo.com/E_Content/plugins/croppie/croppie.css" rel="stylesheet" />' +
            '<script src="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/bootstrap/bootstrap.bundle.min.js"></script>' +
            '<script src="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/scrollbar/simplebar.js"></script>' +
            '<script src="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/scrollbar/custom.js"></script>' +
            '<script src="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/apex-chart/apex-chart.js"></script>' +
            '<script src="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/bootstrap/bootstrap-notify.min.js"></script>' +
            '<script src="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/wow/wow.min.js"></script>' +
            '<script src="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/tooltip-init.js"></script>' +
            '<script src="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/script.js"></script>' +
            '<script src="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/height-equal.js"></script>' +
            '<script src="https://app.wenodo.com/E_Scripts/bootstrap-datepicker-1.6.4-dist/js/bootstrap-datepicker.js"></script>' +
            '<script src="https://app.wenodo.com/E_Scripts/daterangepicker-master/daterangepicker.js"></script>' +
            '<script type="text/javascript" src="https://app.wenodo.com/E_Scripts/ExcelPdfJS/html2canvas.min.js"></script>' +
            '<script src="https://app.wenodo.com/E_Scripts/ExcelPdfJS/jspdf.min.js"></script>' +
            '<script src="https://app.wenodo.com/E_Scripts/Calendar/ui-bootstrap-tpls.min.js"></script>' +
            '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css">' +
            '<script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js"></script>' +
            '<script src="//cdnjs.cloudflare.com/ajax/libs/timepicker/1.3.5/jquery.timepicker.min.js"></script>' +
            '<script src="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/sidebar-menu.js"></script>' +
            '<script src="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/Countries/telephone-input.js"></script>' +
            '<script src="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/Countries/intltelinput.min.js"></script>' +
            '<script src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js"></script>' +
            '<script src="https://app.wenodo.com/E_Scripts/Select2angularjs/select2.js"></script>' +
            '<script src="https://app.wenodo.com/E_Scripts/Select2angularjs/select2_locale_sv.js"></script>' +
            '<script src="https://app.wenodo.com/E_Scripts/Select2angularjs/sc-select2.directive.js"></script>' +
            '<script src="https://app.wenodo.com/E_Scripts/ExcelPdfJS/alasql.min.js"></script>' +
            '<script src="https://app.wenodo.com/E_Scripts/ExcelPdfJS/xlsx.core.min.js"></script>' +
            '<script src="https://app.wenodo.com/E_Content/plugins/croppie/croppie.min.js"></script><script src ="https://app.wenodo.com/AngularControllers/CommonMethod.js"></script></head><body>' + clone.innerHTML + '</body></html>';
        let iframe = document.createElement("iframe");
        iframe.style.visibility = "hidden";
        iframe.height = "1200px";
        iframe.width = "2400px";
        document.body.appendChild(iframe);
        let iframedoc = iframe.contentDocument || iframe.contentWindow.document;
        iframedoc.body.innerHTML = HTML;
        html2canvas(iframedoc.body, { useCORS: true, scale: 2 }).then(function (canvas) {
            FILE_NAME = "Dashboard Export";
            var imgBase64 = canvas.toDataURL('image/jpeg', 2.0);
            var doc = "";
            doc = new jsPDF("l", "pt", [canvas.width, canvas.height]);
            const pageWidth = doc.internal.pageSize.width;
            const pageHeight = doc.internal.pageSize.height;
            const widthRatio = pageWidth / canvas.width;
            const heightRatio = pageHeight / canvas.height;
            const ratio = widthRatio > heightRatio ? heightRatio : widthRatio;
            const canvasHeight = canvas.height * ratio;
            const ratio_1 = heightRatio > widthRatio ? widthRatio : heightRatio;
            const canvasWidth = canvas.width * ratio;
            doc.addImage(imgBase64, 'PNG', 20, 50, canvasWidth - 40, canvasHeight);
            doc.save(FILE_NAME + '.pdf');
            document.getElementById("loader").style.display = "none";
            document.querySelectorAll('iframe').forEach(
                function (elem) {
                    elem.parentNode.removeChild(elem);
                });
        });
    }



    $scope.$on('$destroy', function () {
        $('.modal.show').modal('hide');
    });
});


