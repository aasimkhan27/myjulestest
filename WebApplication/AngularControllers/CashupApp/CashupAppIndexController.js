app.controller('CashupAppIndexController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $interval) {
    $scope.ngshow_cashup_entry_tabs = function () {
        switch ($location.url()) {
            case "/CashUpApp_Entry":
                return 1;
                break;
            case "/CashUpApp_Cash":
                return 1;
                break;
            case "/CashUpApp_Cards":
                return 1;
                break;
            case "/CashUpApp_PettyCash":
                return 1;
                break;
            case "/CashUpApp_Delivery":
                return 1;
                break;
            case "/CashUpApp_Account":
                return 1;
                break;
            case "/CashUpApp_Vouchers":
                return 1;
                break;
            case "/CashUpApp_Deposits":
                return 1;
                break;
            case "/CashUpApp_Complimentary":
                return 1;
                break;
            case "/CashUpApp_Review":
                return 1;
                break;
            default:
                return 0;
        }
    }
    $scope.SELECTED_SITE = null;
    $scope.SELECTED_AREA = null;
    $scope.SELECTED_SESSION = null;
    $scope.CASHUP_BY_AREA = null;
    $scope.CASHUP_DATE = null;
    $scope.ENTITY_NAME = $cookies.get("ENTITY_NAME");
    $scope.CASHUP_ENTRY_SEARCH = {
        CUSTOMER_ID: $cookies.get("CUSTOMER_ID"),
        ENTITY_ID: $cookies.get("ENTITY_ID"),
        BRANCH_ID: null,
        AREA_ID: 0,
        SESSION_ID: 0,
        CASHUP_DATE: null,
        CASHUP_HEADER_ID: null,
        CASHUP_MAIN_ID: null,
        FILTERED_SITES_LIST: [],
        STANDARD_ROLE_ID: null,
        IS_DATA_ENTRY_ENABLED: false,
        IS_SUBMIT_BUTTON: false,
        //IS_RETURN_BUTTON: false,
        //IS_APPROVE_BUTTON: false,
        CASHUP_APPROVAL: false,
        CASHUP_HEADER_LIST: [],
        CASHUP_DATA_UPLOAD_TYPE: null,
        INTEGRATION_SYSTEM_ID: null,
        SYSTEM_NAME: null,
        SESSION_START: null,
        SESSION_END: null,
        USER_PRIVILEGE_IDS: ''

    };
    $scope.CONVERSION_DATE_FORMAT = "DD/MM/YYYY"; //CAUTION!!! Changing this will affect all SP calls where date is passed, Angular/JS Date format to SQL Date format conversion will fail!!!
    $scope.DISPLAY_DATE_FORMAT = "dd/MM/yyyy"; // CAUTION!! Changing this will affect all Display Date format in HTML pages
    $scope.CALENDAR_DATE_FORMAT = 'dd/mm/yyyy'; // CAUTION!! Changing this will affect all Calender/ Date picker display format
    $scope.DATE_RANGE_FORMAT = 'DD/MM/YYYY'; // CAUTION!! Changing this will affect all Date Range format
    $scope.DB_DATE_FORMAT = 'YYYY-MM-DD'; // CAUTION!!! Changing this will affect all SP calls where date is passed, Angular/JS Date format to SQL Date format conversion will fail!!!
    $scope.CURRENCY_SYMBOL = decodeURIComponent($cookies.get("CURRENCY_SYMBOL")); 
    $scope.REDIRECT_REGISTER_ENTRY = false;
    $scope.DISPLAY_FLAG = false;
    $scope.$parent.DISPLAY_FLAG = false;
    $scope.$parent.$parent.DISPLAY_FLAG = false;
    $scope.PAGINATION_TEXT = "Load More..."
    $scope.LOAD_FETCH_TEXT = "No Records";
    //$scope.DISPLAY_FLAG = true;
    //$scope.$parent.DISPLAY_FLAG = false;
    //$scope.$parent.$parent.DISPLAY_FLAG = true;


    $scope.$parent.HR_MODULE = false;
    $scope.$parent.CASHUP_MODULE = true;
    $scope.$parent.$parent.CASHUP_MODULE = true;
    $scope.CASHUP_MODULE = true;
    $scope.rd_absence = 1;
    $scope.Fn_TAB_CLICK = function (TAB_ID) {
        $scope.TAB_ID = TAB_ID;
    }

    $scope.PLACE_HOLDER = "Type here.."
    $scope.DD_DEFAULT_TEXT = 'Choose';
    $scope.Fn_TAB_CLICK(1);
    $scope.Fn_RD_ABSENCE_CHANGES = function (FLAG) {
        console.log($scope.rd_absence);
        $scope.ACCRUE_FLAG = FLAG;
    }
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn = function (IS_ADMIN_FLAG) {
        if (IS_ADMIN_FLAG == 1) {
            $scope.$parent.DISPLAY_FLAG = true;
        } else {
            $scope.$parent.DISPLAY_FLAG = false;
        };
    }
    $scope.CASHUP_COMMON_CODE_Fn = function () {
        $scope.ASSIGNED_REPORT_LIST = [];
        if (window.location.hash.split('?').length > 0) {
            $scope.$parent.$parent.CURRENT_PATH = window.location.hash.split('?')[0];
        }
        else {
            $scope.$parent.$parent.CURRENT_PATH = window.location.hash;
        }
        window.scrollTo(0, 0);
        if ($cookies.get("USERID") == undefined || $cookies.get("USERID") == null || $cookies.get("USERID") == '' || $cookies.get("USERID") == "null" || parseInt($cookies.get("USERID")) == 0) {
            $window.location.href = '/Login';
            return;
        }
        $(".modal-backdrop").remove();
        $(".tooltip").remove();
    }
    $scope.Fn_INTERNAL_TAB_CLICK = function (TAB_INTERNAL_ID) {
        $scope.TAB_INTERNAL_ID = TAB_INTERNAL_ID;
    }

    $scope.HR_COMMON_CODE_Fn = function () {
        $scope.ASSIGNED_REPORT_LIST = [];
        if (window.location.hash.split('?').length > 0) {
            $scope.CURRENT_PATH = window.location.hash.split('?')[0];
        }
        else {
            $scope.CURRENT_PATH = window.location.hash;
        }
        window.scrollTo(0, 0);
        if ($cookies.get("USERID") == undefined || $cookies.get("USERID") == null || $cookies.get("USERID") == '' || $cookies.get("USERID") == "null" || parseInt($cookies.get("USERID")) == 0) {
            $window.location.href = '/Login';
            return;
        }
        $(".modal-backdrop").remove();
        $(".tooltip").remove();
    }



    ///////****** SITE PICKER WITH PRIVILEGE FOR REPORTS PAGE *******/////
    $scope.GET_CASHUP_TYPE = function (Sites) {
        var CashupModelObj = {
            CUSTOMER_ID: parseInt($cookies.get("CUSTOMER_ID")),
            ENTITY_ID: parseInt($cookies.get("ENTITY_ID"))
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
                $scope.REPORTS_SITES_LIST = Sites;
                if ($scope.REPORTS_SITES_LIST && $scope.REPORTS_SITES_LIST.length > 0) {
                    $scope.REPORTS_SITES_LIST[0].IS_SELECTED = true;
                    $scope.CASHUP_REPORTS_PRIVILEGE = true;
                }
                else {
                    $scope.CASHUP_REPORTS_PRIVILEGE = false;
                }
            }
            else {
                $scope.CASHUP_REPORTS_PRIVILEGE = false;
            }
        });
    }

    $scope.GET_PRIVILEGE = function (cashup_privilege_id) {
        if ($scope.$parent.CHECK_CASHUP_PRIVILEGE(cashup_privilege_id)) {
            $scope.REPORTS_SITES_LIST = $scope.$parent.CHECK_CASHUP_USER_PRIVILEGE(cashup_privilege_id, parseInt($cookies.get("ENTITY_ID")));
            if ($scope.REPORTS_SITES_LIST && $scope.REPORTS_SITES_LIST.length > 0) {
                $scope.GET_CASHUP_TYPE($scope.REPORTS_SITES_LIST);
            }
            else {
                $scope.CASHUP_REPORTS_PRIVILEGE = false;
            }
        }
        else {
            $scope.CASHUP_REPORTS_PRIVILEGE = false;
        }
    };






    $scope.CASHUP_COMMON_RESET_Fn = function () {
        $scope.CASHUP_ENTRY_SEARCH.BRANCH_ID = null;
        $scope.CASHUP_ENTRY_SEARCH.AREA_ID = null;
        $scope.CASHUP_ENTRY_SEARCH.SESSION_ID = null;
        $scope.CASHUP_ENTRY_SEARCH.CASHUP_DATE = null;
        $scope.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_ID = null;
        $scope.CASHUP_ENTRY_SEARCH.FILTERED_SITES_LIST = [];
        $scope.CASHUP_ENTRY_SEARCH.STANDARD_ROLE_ID = null;
        $scope.CASHUP_ENTRY_SEARCH.IS_DATA_ENTRY_ENABLED = false;
        $scope.CASHUP_ENTRY_SEARCH.IS_SUBMIT_BUTTON = false;
        $scope.CASHUP_ENTRY_SEARCH.CASHUP_APPROVAL = false;
        $scope.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_LIST = [];
        $scope.SELECTED_SITE = null;
        $scope.SELECTED_AREA = null;
        $scope.SELECTED_SESSION = null;
        $scope.CASHUP_BY_AREA = null;
        $scope.CASHUP_DATE = null;
        $scope.TAB_ACTIVE_LIST.ENTRY.ACTIVE = false;
        $scope.TAB_ACTIVE_LIST.CASH.ACTIVE = false;
        $scope.TAB_ACTIVE_LIST.CARDS.ACTIVE = false;
        $scope.TAB_ACTIVE_LIST.PETTY_CASH.ACTIVE = false;
        $scope.TAB_ACTIVE_LIST.DELIVERY.ACTIVE = false;
        $scope.TAB_ACTIVE_LIST.ACCOUNT.ACTIVE = false;
        $scope.TAB_ACTIVE_LIST.VOUCHERS.ACTIVE = false;
        $scope.TAB_ACTIVE_LIST.DEPOSITS.ACTIVE = false;
        $scope.TAB_ACTIVE_LIST.COMPLIMENTARY.ACTIVE = false;
        $scope.TAB_ACTIVE_LIST.REVIEW.ACTIVE = false;
    }

    ///////****** SITE PICKER WITH PRIVILEGE FOR REPORTS PAGE *******/////



    //// sales chart
    //var salesOptions = {
    //    series: [
    //        {
    //            name: 'Breakfast',
    //            type: 'column',
    //            data: [1040000, 2800000, 6040000, 3610000, 3170000, 4030000, 1810000, 420000, 1420000, 2900000, 2370000, 1400000],
    //            yaxisIndex: 0
    //        },
    //        {
    //            name: 'Lunch',
    //            type: 'column',
    //            data: [2800000, 6100000, 1300000, 2500000, 5200000, 3000000, 4500000, 1000000, 4500000, 4000000, 3100000, 2500000],
    //            yaxisIndex: 0
    //        },
    //        {
    //            name: 'Dinner',
    //            type: 'column',
    //            data: [1400000, 2800000, 2200000, 6600000, 3100000, 3800000, 2300000, 3900000, 2800000, 2000000, 1300000, 3700000],
    //            yaxisIndex: 0
    //        },
    //        {
    //            name: 'Covers',
    //            type: 'line',
    //            data: [8800000, 6100000, 1300000, 2500000, 5200000, 3000000, 4500000, 7700000, 4500000, 4000000, 3100000, 7500000],
    //            yaxisIndex: 1
    //        }
    //    ],
    //    chart: {
    //        height: 350,
    //        type: 'line',
    //        fontFamily: 'Montserrat',
    //        stacked: true,
    //        toolbar: {
    //            show: false
    //        },
    //    },
    //    stroke: {
    //        width: [0, 0, 0, 2],
    //        curve: 'smooth',
    //    },
    //    dataLabels: {
    //        enabled: false
    //    },
    //    fill: {
    //        opacity: [1, 1, 1, 1],
    //    },
    //    yaxis: [
    //        {
    //            labels: {
    //                formatter: function (value) {
    //                    return (value / 1000000).toFixed(1) + 'M';
    //                },
    //                style: {
    //                    colors: '#94A3B8',
    //                    fontFamily: 'Montserrat',
    //                    fontWeight: 500,
    //                    fontSize: '12px'
    //                },
    //            },
    //        },
    //        {
    //            opposite: true,
    //            labels: {
    //                formatter: function (value) {
    //                    return (value / 1000000).toFixed(1) + 'M';
    //                },
    //                style: {
    //                    colors: '#94A3B8',
    //                    fontFamily: 'Montserrat',
    //                    fontWeight: 500,
    //                    fontSize: '12px'
    //                },
    //            },
    //        }
    //    ],
    //    xaxis: {
    //        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    //        labels: {
    //            style: {
    //                colors: '#94A3B8',
    //                fontFamily: 'Montserrat',
    //                fontWeight: 500,
    //                fontSize: '12px'
    //            }
    //        },
    //    },
    //    tooltip: {
    //        shared: true,
    //        intersect: false,
    //    },
    //    colors: ['#05A6F0', '#1DCA5D', '#F3A515', '#1E2432'],
    //    plotOptions: {
    //        bar: {
    //            borderRadius: 3,
    //            borderRadiusApplication: 'end',

    //        }
    //    },
    //    legend: {
    //        position: 'bottom',
    //        horizontalAlign: 'center',
    //        fontWeight: 500,
    //        labels: {
    //            colors: '#6B7C94',
    //            fontFamily: 'Montserrat',

    //            fontSize: '12px'
    //        }
    //    },
    //};


    //var salesChart = new ApexCharts(document.querySelector("#sales"), salesOptions);
    //salesChart.render();



    //// cashup variance chart

    //var cashupVarianceOptions = {
    //    series: [{
    //        name: 'Epos',
    //        type: 'column',
    //        data: [5400000, 3000000, 1140000, 1710000, 1270000, 1130000, 2010000, 3520000, 1520000, 3200000, 2570000, 1600000, 4600000]
    //    }, {
    //        name: 'Actuals',
    //        type: 'column',
    //        data: [1300000, 1200000, 1500000, 2700000, 1300000, 2200000, 1700000, 1100000, 1200000, 2200000, 1200000, 1600000, 3600000]
    //    }],
    //    chart: {
    //        height: 350,
    //        type: 'bar',
    //        fontFamily: 'Montserrat',
    //        stacked: false,
    //        toolbar: {
    //            show: false
    //        },
    //    },
    //    stroke: {
    //        width: [0, 0, 0, 2]
    //    },
    //    dataLabels: {
    //        enabled: false
    //    },
    //    fill: {
    //        opacity: [1, 1, 1, 1],
    //    },
    //    yaxis: {
    //        labels: {
    //            formatter: function (value) {
    //                return (value / 1000000).toFixed(1) + 'M';
    //            },
    //            style: {
    //                colors: '#94A3B8',
    //                fontFamily: 'Montserrat',
    //                fontWeight: 500,
    //                fontSize: '12px'
    //            }
    //        },
    //    },
    //    xaxis: {
    //        categories: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'],
    //        title: {
    //            text: 'Week',
    //            position: 'bottom',

    //            style: {
    //                fontSize: '12px',
    //                fontWeight: '500',
    //                color: '#475569'
    //            }
    //        },
    //        labels: {
    //            style: {
    //                colors: '#94A3B8',
    //                fontFamily: 'Montserrat',
    //                fontWeight: 500,
    //                fontSize: '12px'
    //            }
    //        },
    //    },
    //    tooltip: {
    //        shared: true,
    //        intersect: false,
    //    },

    //    colors: ['#05A6F0', '#1DCA5D'],
    //    plotOptions: {
    //        bar: {
    //            borderRadius: 3,
    //            borderRadiusApplication: 'end',
    //        }
    //    },
    //    legend: {
    //        fontWeight: 500,
    //        position: 'bottom',
    //        horizontalAlign: 'center',
    //        labels: {
    //            colors: '#6B7C94',
    //            fontFamily: 'Montserrat',

    //            fontSize: '12px'
    //        }
    //    },
    //};

    //var cashupVarianceChart = new ApexCharts(document.querySelector("#Cashup_Variance"), cashupVarianceOptions);
    //cashupVarianceChart.render();

    //// payment type chart

    //var paymentTypeOptions = {
    //    series: [{
    //        name: 'Amex',
    //        type: 'column',
    //        data: [1400000, 3000000, 1140000, 1710000, 1270000, 130000, 20100, 3520000, 152000, 320000, 25700, 16000, 22000]
    //    }, {
    //        name: 'Card',
    //        type: 'column',
    //        data: [1300000, 1200000, 15000, 2700000, 130000, 2200000, 1700000, 1100000, 120000, 2200000, 1200000, 16000, 352000]
    //    }, {
    //        name: 'Cash',
    //        type: 'column',
    //        data: [1500000, 3200000, 25000, 1700000, 1300000, 1200000, 1700000, 2100000, 3200000, 220000, 130000, 140000, 41000]
    //    }, {
    //        name: 'Others',
    //        type: 'column',
    //        data: [150000, 12000, 250000, 1700000, 3300000, 4200000, 1700000, 2100000, 3200000, 2200000, 1400000, 4100000, 700000]
    //    }],

    //    chart: {
    //        height: 350,
    //        type: 'bar',
    //        fontFamily: 'Montserrat',
    //        stacked: true,
    //        toolbar: {
    //            show: false
    //        },
    //    },
    //    stroke: {
    //        width: [0, 0, 0, 0]
    //    },
    //    dataLabels: {
    //        enabled: false
    //    },
    //    fill: {
    //        opacity: [1, 1, 1, 1],
    //    },
    //    yaxis: [
    //        {
    //            labels: {
    //                formatter: function (value) {
    //                    return (value / 1000000).toFixed(1) + 'M';
    //                },
    //                style: {
    //                    colors: '#94A3B8',
    //                    fontFamily: 'Montserrat',
    //                    fontWeight: 500,
    //                    fontSize: '12px'
    //                }
    //            },
    //        },

    //    ],
    //    xaxis: {
    //        categories: ['Week-13', 'Week-12', 'Week-11', 'Week-10', 'Week-9', 'Week-8', 'Week-7', 'Week-6', 'Week-5', 'Week-4', 'Week-3', 'Week-2', 'Week-1'],
    //        labels: {
    //            style: {
    //                colors: '#94A3B8',
    //                fontFamily: 'Montserrat',
    //                fontWeight: 500,
    //                fontSize: '12px'
    //            }
    //        },
    //    },
    //    tooltip: {
    //        shared: true,
    //        intersect: false,
    //    },

    //    colors: ['#05A6F0', '#1DCA5D', '#F3A515', '#1E2432'],

    //    plotOptions: {
    //        bar: {
    //            borderRadius: 2,
    //            borderRadiusApplication: 'end',
    //            columnWidth: '30%'
    //        }
    //    },
    //    legend: {
    //        position: 'bottom',
    //        fontWeight: 500,

    //        horizontalAlign: 'center',
    //        labels: {
    //            colors: '#6B7C94',
    //            fontFamily: 'Montserrat',
    //            fontSize: '12px'
    //        }
    //    },
    //};
    //var paymentTypeChart = new ApexCharts(document.querySelector("#Payment_Type"), paymentTypeOptions);
    //paymentTypeChart.render();

    //// Sales by session

    //var salesBySessionOptions = {
    //    series: [1344, 2020, 1333],
    //    labels: ['Breakfast', 'Lunch', 'Dinner'],
    //    plotOptions: {
    //        pie: {
    //            donut: {
    //                labels: {
    //                    show: true,
    //                    total: {
    //                        fontSize: '12px',
    //                        color: '#94A3B8',
    //                        style: {
    //                            fontWeight: '500',
    //                            textTransform: 'uppercase'
    //                        },
    //                        show: true,
    //                        formatter: function (w) {

    //                            let total = '£ ' + w.globals.seriesTotals.reduce((a, b) => a + b, 0);
    //                            return total;
    //                        }
    //                    }
    //                }
    //            }
    //        }
    //    },
    //    chart: {
    //        height: 350,
    //        type: 'donut',
    //        fontFamily: 'Montserrat',
    //        stacked: true,
    //        toolbar: {
    //            show: false
    //        },
    //    },
    //    dataLabels: {
    //        enabled: false
    //    },
    //    donut: {
    //        labels: {
    //            show: true,
    //            total: {
    //                show: true,
    //            }
    //        }
    //    },
    //    responsive: [{
    //        breakpoint: 480,
    //        options: {
    //            chart: {
    //                width: 200
    //            },
    //            legend: {
    //                show: true
    //            }
    //        }
    //    }],
    //    legend: {
    //        position: 'bottom',
    //        horizontalAlign: 'center',
    //        fontWeight: 500,
    //        labels: {
    //            colors: '#6B7C94',
    //            fontFamily: 'Montserrat',

    //            fontSize: '12px'
    //        }
    //    },
    //    colors: ['#05A6F0', '#1DCA5D', '#F3A515', '#3B80F2', '#ACE1FA', '#77DF9E', '#F4D36B', '#89B3F7', '#CDEDFC', '#EEFFF4', '#FFF7DE'],

    //};

    //var salesBySessionChart = new ApexCharts(document.querySelector("#Sales_by_Session"), salesBySessionOptions);
    //salesBySessionChart.render();

    //// Sales by category

    //var salesByCategoryOptions = {
    //    series: [3344, 5020, 2333],
    //    labels: ['Food', 'Drinks', 'Others'],
    //    plotOptions: {
    //        pie: {
    //            donut: {
    //                labels: {
    //                    show: true,
    //                    total: {
    //                        fontSize: '12px',
    //                        color: '#94A3B8',
    //                        fontWeight: '500',
    //                        show: true,
    //                        formatter: function (w) {
    //                            return '£ ' + w.globals.seriesTotals.reduce((a, b) => a + b, 0);
    //                        }
    //                    }
    //                }
    //            }
    //        }
    //    },
    //    chart: {
    //        height: 350,
    //        type: 'donut',
    //        fontFamily: 'Montserrat',
    //        stacked: true,
    //        toolbar: {
    //            show: false
    //        },
    //    },
    //    dataLabels: {
    //        enabled: false
    //    },
    //    donut: {
    //        labels: {
    //            show: true,
    //            total: {
    //                show: true,
    //            }
    //        }
    //    },
    //    responsive: [{
    //        breakpoint: 480,
    //        options: {
    //            chart: {
    //                width: 200
    //            },
    //            legend: {
    //                show: true
    //            }
    //        }
    //    }],
    //    legend: {
    //        position: 'bottom',
    //        horizontalAlign: 'center',
    //        fontWeight: 500,
    //        labels: {
    //            colors: '#6B7C94',
    //            fontFamily: 'Montserrat',

    //            fontSize: '12px'
    //        }
    //    },
    //    colors: ['#05A6F0', '#1DCA5D', '#F3A515', '#3B80F2', '#ACE1FA', '#77DF9E', '#F4D36B', '#89B3F7', '#CDEDFC', '#EEFFF4', '#FFF7DE'],

    //};

    //var salesByCategoryChart = new ApexCharts(document.querySelector("#Sales_by_Category"), salesByCategoryOptions);
    //salesByCategoryChart.render();

    //// Sales by Media

    //var salesByMediaOptions = {
    //    series: [3344, 5020, 2333, 1030],
    //    labels: ['Card', 'Cash', 'Amex', 'Others'],
    //    plotOptions: {
    //        pie: {
    //            donut: {
    //                labels: {
    //                    show: true,
    //                    total: {
    //                        fontSize: '12px',
    //                        color: '#94A3B8',
    //                        fontWeight: '500',
    //                        show: true,
    //                        formatter: function (w) {
    //                            return '£ ' + w.globals.seriesTotals.reduce((a, b) => a + b, 0);
    //                        }
    //                    }
    //                }
    //            }
    //        }
    //    },
    //    chart: {
    //        height: 350,
    //        type: 'donut',
    //        fontFamily: 'Montserrat',
    //        stacked: true,
    //        toolbar: {
    //            show: false
    //        },
    //    },
    //    dataLabels: {
    //        enabled: false
    //    },
    //    donut: {
    //        labels: {
    //            show: true,
    //            total: {
    //                show: true,
    //            }
    //        }
    //    },
    //    responsive: [{
    //        breakpoint: 480,
    //        options: {
    //            chart: {
    //                width: 200
    //            },
    //            legend: {
    //                show: true
    //            }
    //        }
    //    }],
    //    legend: {
    //        position: 'bottom',
    //        horizontalAlign: 'center',
    //        fontWeight: 500,
    //        labels: {
    //            colors: '#6B7C94',
    //            fontFamily: 'Montserrat',

    //            fontSize: '12px'
    //        }
    //    },
    //    colors: ['#05A6F0', '#1DCA5D', '#F3A515', '#3B80F2', '#ACE1FA', '#77DF9E', '#F4D36B', '#89B3F7', '#CDEDFC', '#EEFFF4', '#FFF7DE'],

    //};

    //var salesByMediaChart = new ApexCharts(document.querySelector("#Sales_by_Media"), salesByMediaOptions);
    //salesByMediaChart.render();

    //// Sales by Area

    //var salesByAreaOptions = {
    //    series: [8344, 1020, 4333],
    //    labels: ['Restaurant', 'Bar', 'Terrace'],
    //    plotOptions: {
    //        pie: {
    //            donut: {
    //                labels: {
    //                    show: true,
    //                    total: {
    //                        fontSize: '12px',
    //                        color: '#94A3B8',
    //                        fontWeight: '500',
    //                        show: true,
    //                        formatter: function (w) {
    //                            return '£ ' + w.globals.seriesTotals.reduce((a, b) => a + b, 0);
    //                        }
    //                    }
    //                }
    //            }
    //        }
    //    },
    //    chart: {
    //        height: 350,
    //        type: 'donut',
    //        fontFamily: 'Montserrat',
    //        stacked: true,
    //        toolbar: {
    //            show: false
    //        },
    //    },
    //    dataLabels: {
    //        enabled: false
    //    },
    //    donut: {
    //        labels: {
    //            show: true,
    //            total: {
    //                show: true,
    //            }
    //        }
    //    },
    //    responsive: [{
    //        breakpoint: 480,
    //        options: {
    //            chart: {
    //                width: 200
    //            },
    //            legend: {
    //                show: true
    //            }
    //        }
    //    }],
    //    legend: {
    //        position: 'bottom',
    //        fontWeight: 500,
    //        horizontalAlign: 'center',
    //        labels: {
    //            colors: '#6B7C94',
    //            fontFamily: 'Montserrat',

    //            fontSize: '12px'
    //        }
    //    },
    //    colors: ['#05A6F0', '#1DCA5D', '#F3A515', '#3B80F2', '#ACE1FA', '#77DF9E', '#F4D36B', '#89B3F7', '#CDEDFC', '#EEFFF4', '#FFF7DE'],

    //};

    //var salesByAreaChart = new ApexCharts(document.querySelector("#Sales_by_Area"), salesByAreaOptions);
    //salesByAreaChart.render();

    //// Sales by Revenue Type

    //var salesByRevenueTypeOptions = {
    //    series: [1344, 1020, 2001],
    //    labels: ['Eat In', 'Takeaway', 'Deliveroo'],
    //    plotOptions: {
    //        pie: {
    //            donut: {
    //                labels: {
    //                    show: true,
    //                    total: {
    //                        fontSize: '12px',
    //                        color: '#94A3B8',
    //                        fontWeight: '500',
    //                        show: true,
    //                        formatter: function (w) {
    //                            return '£ ' + w.globals.seriesTotals.reduce((a, b) => a + b, 0);
    //                        }
    //                    }
    //                }
    //            }
    //        }
    //    },
    //    chart: {
    //        height: 350,
    //        type: 'donut',
    //        fontFamily: 'Montserrat',
    //        stacked: true,
    //        toolbar: {
    //            show: false
    //        },
    //    },
    //    dataLabels: {
    //        enabled: false
    //    },
    //    donut: {
    //        labels: {
    //            show: true,
    //            total: {
    //                show: true,
    //            }
    //        }
    //    },
    //    responsive: [{
    //        breakpoint: 480,
    //        options: {
    //            chart: {
    //                width: 200
    //            },
    //            legend: {
    //                show: true
    //            }
    //        }
    //    }],
    //    legend: {
    //        position: 'bottom',
    //        horizontalAlign: 'center',
    //        fontWeight: 500,

    //        labels: {
    //            colors: '#6B7C94',
    //            fontFamily: 'Montserrat',
    //            fontSize: '12px'
    //        }
    //    },
    //    colors: ['#05A6F0', '#1DCA5D', '#F3A515', '#3B80F2', '#ACE1FA', '#77DF9E', '#F4D36B', '#89B3F7', '#CDEDFC', '#EEFFF4', '#FFF7DE'],

    //};

    //var salesByRevenueTypeChart = new ApexCharts(document.querySelector("#Sales_by_Revenue_Type"), salesByRevenueTypeOptions);
    //salesByRevenueTypeChart.render();


    //// Complimentary / Void
    //var complimentaryVoidOptions = {
    //    series: [1344, 1020],
    //    labels: ['Complimentary', 'Void'],
    //    plotOptions: {
    //        pie: {
    //            donut: {
    //                labels: {
    //                    show: true,
    //                    total: {
    //                        fontSize: '12px',
    //                        color: '#94A3B8',
    //                        fontWeight: '500',
    //                        show: true,
    //                        formatter: function (w) {
    //                            return '£ ' + w.globals.seriesTotals.reduce((a, b) => a + b, 0);
    //                        }
    //                    }
    //                }
    //            }
    //        }
    //    },
    //    chart: {
    //        height: 350,
    //        type: 'donut',
    //        fontFamily: 'Montserrat',
    //        stacked: true,
    //        toolbar: {
    //            show: false
    //        },
    //    },
    //    dataLabels: {
    //        enabled: false
    //    },
    //    donut: {
    //        labels: {
    //            show: true,
    //            total: {
    //                show: true,
    //            }
    //        }
    //    },
    //    responsive: [{
    //        breakpoint: 480,
    //        options: {
    //            chart: {
    //                width: 200
    //            },
    //            legend: {
    //                show: true
    //            }
    //        }
    //    }],
    //    legend: {
    //        position: 'bottom',
    //        fontWeight: 500,
    //        horizontalAlign: 'center',
    //        labels: {
    //            colors: '#6B7C94',
    //            fontFamily: 'Montserrat',
    //            fontSize: '12px'
    //        }
    //    },
    //    colors: ['#05A6F0', '#1DCA5D', '#F3A515', '#3B80F2', '#ACE1FA', '#77DF9E', '#F4D36B', '#89B3F7', '#CDEDFC', '#EEFFF4', '#FFF7DE'],

    //};

    //var complimentaryVoidChart = new ApexCharts(document.querySelector("#Complimentary_Void"), complimentaryVoidOptions);
    //complimentaryVoidChart.render();

    //// Petty Cash

    //var pettyCashOptions = {
    //    series: [211, 221, 220, 118, 110],
    //    labels: ['Repair', 'Travel', 'Miscellaneous', 'Bar consumables', 'Cleaning'],
    //    plotOptions: {
    //        pie: {
    //            donut: {
    //                labels: {
    //                    show: true,
    //                    total: {
    //                        fontSize: '12px',
    //                        color: '#94A3B8',
    //                        fontWeight: 500,
    //                        show: true,
    //                        formatter: function (w) {
    //                            return '£ ' + w.globals.seriesTotals.reduce((a, b) => a + b, 0);
    //                        }
    //                    }
    //                }
    //            }
    //        }
    //    },
    //    chart: {
    //        height: 350,
    //        type: 'donut',
    //        fontFamily: 'Montserrat',
    //        stacked: true,
    //        toolbar: {
    //            show: false
    //        },
    //    },
    //    dataLabels: {
    //        enabled: false
    //    },
    //    donut: {
    //        labels: {
    //            show: true,
    //            total: {
    //                show: true,
    //            }
    //        }
    //    },
    //    responsive: [{
    //        breakpoint: 480,
    //        options: {
    //            chart: {
    //                width: 200
    //            },
    //            legend: {
    //                show: true
    //            }
    //        }
    //    }],
    //    legend: {
    //        position: 'bottom',
    //        fontWeight: 500,
    //        horizontalAlign: 'center',
    //        labels: {
    //            colors: '#6B7C94',
    //            fontFamily: 'Montserrat',
    //            fontSize: '12px'
    //        }
    //    },

    //    colors: ['#05A6F0', '#1DCA5D', '#F3A515', '#3B80F2', '#ACE1FA', '#77DF9E', '#F4D36B', '#89B3F7', '#CDEDFC', '#EEFFF4', '#FFF7DE'],

    //};

    //var pettyCashChart = new ApexCharts(document.querySelector("#Petty_Cash"), pettyCashOptions);
    //pettyCashChart.render();

    //$scope.START_DAY_OF_WEEK = 1;
    //$scope.addDays = function (date, days) { date.setDate(date.getDate() + days); return date; }
    //$scope.set_week_picker = function (date, FLAG) {
    //    $scope.start_date = new Date(date.getFullYear(), date.getMonth(), parseInt($scope.START_DAY_OF_WEEK) + date.getDate() - date.getDay());//new Date(date.getFullYear(), date.getMonth(), 1 + date.getDate() - date.getDay());
    //    $scope.end_date = new Date(date.getFullYear(), date.getMonth(), parseInt($scope.START_DAY_OF_WEEK) + date.getDate() - date.getDay() + 6); //new Date(date.getFullYear(), date.getMonth(), $scope.start_date.getDate() + (6));
    //    if ($scope.start_date > date) {
    //        if (FLAG == 1) {
    //            var increasedays = $scope.start_date.getDate() - date.getDate();
    //            $scope.start_date = new Date(date.getFullYear(), date.getMonth(), $scope.start_date.getDate() - ((7 - increasedays) + increasedays));
    //            //  $scope.end_date = new Date(date.getFullYear(), date.getMonth(), $scope.start_date.getDate() + (6));
    //            $scope.end_date = $scope.addDays(new Date($scope.start_date), 6);
    //        }
    //    }
    //    var StartDD = $scope.start_date.getDate();
    //    var Startmm = $scope.start_date.getMonth() + 1;
    //    var start_dateyyyy = $scope.start_date.getFullYear();

    //    var EndDD = $scope.end_date.getDate();
    //    var Endmm = $scope.end_date.getMonth() + 1;
    //    var Endyyyy = $scope.end_date.getFullYear();

    //    if (StartDD < 10) { StartDD = '0' + StartDD; }
    //    if (Startmm < 10) { Startmm = '0' + Startmm; }
    //    var start_dateddmmyy = StartDD + '/' + Startmm + '/' + start_dateyyyy;

    //    if (EndDD < 10) { EndDD = '0' + EndDD; }
    //    if (Endmm < 10) { Endmm = '0' + Endmm; }
    //    var end_dateddmmyy = EndDD + '/' + Endmm + '/' + Endyyyy;

    //    $scope.weekpicker.datepicker('update', $scope.start_date); //(($scope.start_date.getMonth() + 1) + '/' + $scope.start_date.getDate() + '/' + $scope.start_date.getFullYear() + ' - ' + ($scope.end_date.getMonth() + 1) + '/' + $scope.end_date.getDate() + '/' + $scope.end_date.getFullYear()));
    //    $scope.weekpicker.val(start_dateddmmyy + ' - ' + end_dateddmmyy);

    //    $scope.START_DATE = $scope.start_date;
    //    $scope.END_DATE = $scope.end_date;
    //    // $scope.WEEK_NO = weekYear($scope.start_date);
    //    if (!$scope.$$phase) { $scope.$apply(); }
    //};
    //$scope.DATE_WEEK_PICKER = function (date, FLAG) {
    //    $scope.weekpicker = $('.week-picker');
    //    $scope.weekpicker.datepicker({
    //        weekStart: parseInt($scope.START_DAY_OF_WEEK),
    //        autoclose: true,
    //        forceParse: false,
    //        todayHighlight: true,
    //        container: '#week-picker-wrapper',
    //        calendarWeeks: true,

    //    }).on("changeDate", function (e) {
    //        $scope.set_week_picker(e.date);
    //    });
    //    $('.week-prev').on('click', function () {
    //        var prev = new Date($scope.start_date.getTime());
    //        prev.setDate(prev.getDate() - 6);
    //        $scope.set_week_picker(prev);
    //    });
    //    $('.week-next').on('click', function () {
    //        var next = new Date($scope.end_date.getTime());
    //        next.setDate(next.getDate() + 1);
    //        $scope.set_week_picker(next);
    //    });
    //    $scope.set_week_picker(date, FLAG != undefined ? 2 : 1);
    //};
    //var _day = $scope.addDays(new Date(), 0);
    //$scope.DATE_WEEK_PICKER(_day, 1);
    //$scope.dateinputddmmyy = function (index) {
    //    $(document).ready(function () {
    //        var date_inputs = document.getElementsByClassName("dateinputddmmyy") //our date input has the name "date"
    //        if (date_inputs.length > 0) {
    //            for (var i = 0; i < date_inputs.length; i++) {
    //                var date_input = $('input[name="' + date_inputs[i].name + '"]'); //our date input has the name "date"
    //                var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
    //                // var date = new Date();
    //                var options = {
    //                    todayBtn: "linked",
    //                    daysOfWeekHighlighted: "0,6",
    //                    autoclose: true,
    //                    todayHighlight: false,
    //                    format: 'dd/mm/yyyy',
    //                    clearBtn: true,
    //                    closeBtn: true,// close button visible
    //                    //  startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate())
    //                };
    //                date_input.datepicker(options).on("hide", function (e) {

    //                })
    //            }
    //        }
    //    });
    //}
    //$scope.dateinputddmmyy(1);


    ////$scope.OPEN_SIDE_BAR = function (url, FLAG) {
    ////    document.getElementById("PO_PDF").style.zIndex = "1500";
    ////    document.getElementById("PO_PDF").style.width = "35%";
    ////}
    ////$scope.CLOSE_PDF = function () {
    ////    document.getElementById("PO_PDF").style.width = "35%";
    ////    document.getElementById("PO_PDF").style.zIndex = "1500";
    ////}
    //$scope.START_DAY_OF_WEEK = 1;
    //$scope.addDays = function (date, days) { date.setDate(date.getDate() + days); return date; }
    //$scope.set_week_picker = function (date, FLAG) {
    //    $scope.start_date = new Date(date.getFullYear(), date.getMonth(), parseInt($scope.START_DAY_OF_WEEK) + date.getDate() - date.getDay());//new Date(date.getFullYear(), date.getMonth(), 1 + date.getDate() - date.getDay());
    //    $scope.end_date = new Date(date.getFullYear(), date.getMonth(), parseInt($scope.START_DAY_OF_WEEK) + date.getDate() - date.getDay() + 6); //new Date(date.getFullYear(), date.getMonth(), $scope.start_date.getDate() + (6));
    //    if ($scope.start_date > date) {
    //        if (FLAG == 1) {
    //            var increasedays = $scope.start_date.getDate() - date.getDate();
    //            $scope.start_date = new Date(date.getFullYear(), date.getMonth(), $scope.start_date.getDate() - ((7 - increasedays) + increasedays));
    //            //  $scope.end_date = new Date(date.getFullYear(), date.getMonth(), $scope.start_date.getDate() + (6));
    //            $scope.end_date = $scope.addDays(new Date($scope.start_date), 6);
    //        }
    //    }
    //    var StartDD = $scope.start_date.getDate();
    //    var Startmm = $scope.start_date.getMonth() + 1;
    //    var start_dateyyyy = $scope.start_date.getFullYear();

    //    var EndDD = $scope.end_date.getDate();
    //    var Endmm = $scope.end_date.getMonth() + 1;
    //    var Endyyyy = $scope.end_date.getFullYear();

    //    if (StartDD < 10) { StartDD = '0' + StartDD; }
    //    if (Startmm < 10) { Startmm = '0' + Startmm; }
    //    var start_dateddmmyy = StartDD + '/' + Startmm + '/' + start_dateyyyy;

    //    if (EndDD < 10) { EndDD = '0' + EndDD; }
    //    if (Endmm < 10) { Endmm = '0' + Endmm; }
    //    var end_dateddmmyy = EndDD + '/' + Endmm + '/' + Endyyyy;

    //    $scope.weekpicker.datepicker('update', $scope.start_date); //(($scope.start_date.getMonth() + 1) + '/' + $scope.start_date.getDate() + '/' + $scope.start_date.getFullYear() + ' - ' + ($scope.end_date.getMonth() + 1) + '/' + $scope.end_date.getDate() + '/' + $scope.end_date.getFullYear()));
    //    $scope.weekpicker.val(start_dateddmmyy + ' - ' + end_dateddmmyy);

    //    $scope.START_DATE = $scope.start_date;
    //    $scope.END_DATE = $scope.end_date;
    //    // $scope.WEEK_NO = weekYear($scope.start_date);
    //    if (!$scope.$$phase) { $scope.$apply(); }
    //};
    //$scope.DATE_WEEK_PICKER = function (date, FLAG) {
    //    $scope.weekpicker = $('.week-picker');
    //    $scope.weekpicker.datepicker({
    //        weekStart: parseInt($scope.START_DAY_OF_WEEK),
    //        autoclose: true,
    //        forceParse: false,
    //        todayHighlight: true,
    //        container: '#week-picker-wrapper',
    //        calendarWeeks: true,

    //    }).on("changeDate", function (e) {
    //        $scope.set_week_picker(e.date);
    //    });
    //    $('.week-prev').on('click', function () {
    //        var prev = new Date($scope.start_date.getTime());
    //        prev.setDate(prev.getDate() - 6);
    //        $scope.set_week_picker(prev);
    //    });
    //    $('.week-next').on('click', function () {
    //        var next = new Date($scope.end_date.getTime());
    //        next.setDate(next.getDate() + 1);
    //        $scope.set_week_picker(next);
    //    });
    //    $scope.set_week_picker(date, FLAG != undefined ? 2 : 1);
    //};
    //var _day = $scope.addDays(new Date(), 0);
    //$scope.DATE_WEEK_PICKER(_day, 1);
    //$scope.dateinputddmmyy = function (index) {
    //    $(document).ready(function () {
    //        var date_inputs = document.getElementsByClassName("dateinputddmmyy") //our date input has the name "date"
    //        if (date_inputs.length > 0) {
    //            for (var i = 0; i < date_inputs.length; i++) {
    //                var date_input = $('input[name="' + date_inputs[i].name + '"]'); //our date input has the name "date"
    //                var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
    //                // var date = new Date();
    //                var options = {
    //                    todayBtn: "linked",
    //                    daysOfWeekHighlighted: "0,6",
    //                    autoclose: true,
    //                    todayHighlight: false,
    //                    format: 'dd/mm/yyyy',
    //                    clearBtn: true,
    //                    closeBtn: true,// close button visible
    //                    //  startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate())
    //                };
    //                date_input.datepicker(options).on("hide", function (e) {

    //                })
    //            }
    //        }
    //    });
    //}
    //$scope.dateinputddmmyy(1);

    $scope.GET_CASHUP_INTEGRATION_FOR_EPOS_UPLOAD = function () {
        var CashupAppModelObj = new Object();
        CashupAppModelObj.ENTITY_ID = $scope.CASHUP_ENTRY_SEARCH.ENTITY_ID;
        CashupAppModelObj.BRANCH_ID = $scope.CASHUP_ENTRY_SEARCH.BRANCH_ID;
        PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'GET_CASHUP_INTEGRATION_FOR_EPOS_UPLOAD').then(function (data) {
            if (data.data != null && data.data != undefined && data.data.Table.length > 0) {
                //var active = data.data.Table.filter(_row=>_row.)
                var active = data.data.Table;
                $scope.CASHUP_ENTRY_SEARCH.INTEGRATION_SYSTEM_ID = active[0].INTEGRATION_SYSTEM_ID;
                $scope.CASHUP_ENTRY_SEARCH.SYSTEM_NAME = active[0].SYSTEM_NAME;
                //$scope.CASHUP_ENTRY_SEARCH.SESSION_START
                //$scope.CASHUP_ENTRY_SEARCH.SESSION_END

            }
            else {
                $scope.CASHUP_ENTRY_SEARCH.INTEGRATION_SYSTEM_ID = null;
                $scope.CASHUP_ENTRY_SEARCH.SYSTEM_NAME = null;
            }
        });
    }

    $scope.Fn_Cashup_entry_TAB_CLICK = function (TAB_ID, _flag) {
        if (_flag != undefined) {
            if (_flag == 0 && TAB_ID != 1) {

                let previousTabID = null;
                for (let key in $scope.TAB_ACTIVE_LIST) {
                    let tab = $scope.TAB_ACTIVE_LIST[key];
                    if (tab.ACTIVE && tab.TAB_ID < TAB_ID) {
                        if (previousTabID === null || tab.TAB_ID > previousTabID) {
                            previousTabID = tab.TAB_ID;
                        }
                    }
                }
                $scope.CALL_FUNCTIONS_TAB_WISE(previousTabID);
            }
            else if (_flag != 0 && TAB_ID != 10) {
                let nextTabID = null;

                // Iterate through all tabs in TAB_ACTIVE_LIST
                for (let key in $scope.TAB_ACTIVE_LIST) {
                    let tab = $scope.TAB_ACTIVE_LIST[key];

                    // Check if the tab is active and its TAB_ID is greater than the CURRENT_TAB_ID
                    if (tab.ACTIVE && tab.TAB_ID > TAB_ID) {
                        if (nextTabID === null || tab.TAB_ID < nextTabID) {
                            nextTabID = tab.TAB_ID;
                        }
                    }
                }
                $scope.CALL_FUNCTIONS_TAB_WISE(nextTabID);
            }
        }
        else {
            $scope.CALL_FUNCTIONS_TAB_WISE(TAB_ID);
        }
    };

    $scope.CALL_FUNCTIONS_TAB_WISE = function (_tab_id) {
        switch (_tab_id) {
            case 1:
                $location.path('CashUpApp_Entry');
                break;
            case 2:
                $location.path('CashUpApp_Cash');
                break;
            case 3:
                $location.path('CashUpApp_Cards');
                break;
            case 4:
                $location.path('CashUpApp_PettyCash');
                break;
            case 5:
                $location.path('CashUpApp_Delivery');
                break;
            case 6:
                $location.path('CashUpApp_Account');
                break;
            case 7:
                $location.path('CashUpApp_Vouchers');
                break;
            case 8:
                $location.path('CashUpApp_Deposits');
                break;
            case 9:
                $location.path('CashUpApp_Complimentary');
                break;
            case 10:
                $location.path('CashUpApp_Review');
                break;
            default:
                $location.path('CashUpApp_Entry');;
        }
    };

    $scope.TAB_LIST = [];
    $scope.TAB_ACTIVE_LIST = new Object();
    $scope.TAB_ACTIVE_LIST.ENTRY = {
        TAB_ID: 1,
        DB_TAB_ID: 1,
        ACTIVE: false
    }
    $scope.TAB_ACTIVE_LIST.CASH = {
        TAB_ID: 2,
        DB_TAB_ID: 3,
        ACTIVE: false
    }
    $scope.TAB_ACTIVE_LIST.CARDS = {
        TAB_ID: 3,
        DB_TAB_ID: 4,
        ACTIVE: false
    }
    $scope.TAB_ACTIVE_LIST.PETTY_CASH = {
        TAB_ID: 4,
        DB_TAB_ID: 5,
        ACTIVE: false
    }
    $scope.TAB_ACTIVE_LIST.DELIVERY = {
        TAB_ID: 5,
        DB_TAB_ID: 6,
        ACTIVE: false
    }
    $scope.TAB_ACTIVE_LIST.ACCOUNT = {
        TAB_ID: 6,
        DB_TAB_ID: 7,
        ACTIVE: false
    }
    $scope.TAB_ACTIVE_LIST.VOUCHERS = {
        TAB_ID: 7,
        DB_TAB_ID: 8,
        ACTIVE: false
    }
    $scope.TAB_ACTIVE_LIST.DEPOSITS = {
        TAB_ID: 8,
        DB_TAB_ID: 9,
        ACTIVE: false
    }
    $scope.TAB_ACTIVE_LIST.COMPLIMENTARY = {
        TAB_ID: 9,
        DB_TAB_ID: 10,
        ACTIVE: false
    }
    $scope.TAB_ACTIVE_LIST.REVIEW = {
        TAB_ID: 10,
        DB_TAB_ID: 11,
        ACTIVE: false
    }
    $scope.GET_CASHUP_MANAGE_ENTRY_TABS = function (_branchId) {
        var CashupModelObj = {
            CUSTOMER_ID: $scope.CASHUP_ENTRY_SEARCH.CUSTOMER_ID,
            ENTITY_ID: $scope.CASHUP_ENTRY_SEARCH.ENTITY_ID
        };

        PrcCommMethods.CASHUP_APP_API(CashupModelObj, 'GET_CASHUP_MANAGE_ENTRY_TABS').then(function (data) {
            if (data.data != null && data.data.Table.length > 0) {
                $scope.TAB_LIST = data.data.Table.filter(item => item.BRANCH_ID === _branchId);

                $scope.TAB_ACTIVE_LIST.ENTRY.ACTIVE = $scope.TAB_LIST.some(function (item) {
                    return item.CASHUP_TAB_ID === 1 && item.ACTIVE === true;
                });
                $scope.TAB_ACTIVE_LIST.CASH.ACTIVE = $scope.TAB_LIST.some(function (item) {
                    return item.CASHUP_TAB_ID === 3 && item.ACTIVE === true;
                });
                $scope.TAB_ACTIVE_LIST.CARDS.ACTIVE = $scope.TAB_LIST.some(function (item) {
                    return item.CASHUP_TAB_ID === 4 && item.ACTIVE === true;
                });
                $scope.TAB_ACTIVE_LIST.PETTY_CASH.ACTIVE = $scope.TAB_LIST.some(function (item) {
                    return item.CASHUP_TAB_ID === 5 && item.ACTIVE === true;
                });
                $scope.TAB_ACTIVE_LIST.DELIVERY.ACTIVE = $scope.TAB_LIST.some(function (item) {
                    return item.CASHUP_TAB_ID === 6 && item.ACTIVE === true;
                });
                $scope.TAB_ACTIVE_LIST.ACCOUNT.ACTIVE = $scope.TAB_LIST.some(function (item) {
                    return item.CASHUP_TAB_ID === 7 && item.ACTIVE === true;
                });
                $scope.TAB_ACTIVE_LIST.VOUCHERS.ACTIVE = $scope.TAB_LIST.some(function (item) {
                    return item.CASHUP_TAB_ID === 8 && item.ACTIVE === true;
                });
                $scope.TAB_ACTIVE_LIST.DEPOSITS.ACTIVE = $scope.TAB_LIST.some(function (item) {
                    return item.CASHUP_TAB_ID === 9 && item.ACTIVE === true;
                });
                $scope.TAB_ACTIVE_LIST.COMPLIMENTARY.ACTIVE = $scope.TAB_LIST.some(function (item) {
                    return item.CASHUP_TAB_ID === 10 && item.ACTIVE === true;
                });
                $scope.TAB_ACTIVE_LIST.REVIEW.ACTIVE = $scope.TAB_LIST.some(function (item) {
                    return item.CASHUP_TAB_ID === 11 && item.ACTIVE === true;
                });
            } else {
                $scope.CashupTypeData = [];
                alert("No Cashup Types available.");
            }
        }).catch(function (error) {
            alert("Error fetching Cashup Types:", error);
        });
    };
    $scope.CASHUP_HEADER_VALUES = {};
    $scope.CASHUP_HEADER_VALUES.CASH = {
        "ACTUAL": 0,
        "EPOS": 0,
        "VARIANCE":0
    }
    $scope.CASHUP_HEADER_VALUES.CARDS = {
        "ACTUAL": 0,
        "EPOS": 0,
        "VARIANCE": 0
    }
    $scope.CASHUP_HEADER_VALUES.PETTY_CASH = {
        "ACTUAL": 0,
        "EPOS": 0,
        "VARIANCE": 0
    }
    $scope.CASHUP_HEADER_VALUES.DELIVERY = {
        "ACTUAL": 0,
        "EPOS": 0,
        "VARIANCE": 0
    }
    $scope.CASHUP_HEADER_VALUES.ACCOUNT_RECEIVED = {
        "ACTUAL": 0,
        "EPOS": 0,
        "VARIANCE": 0
    }
    $scope.CASHUP_HEADER_VALUES.ACCOUNT_CREDIT = {
        "ACTUAL": 0,
        "EPOS": 0,
        "VARIANCE": 0
    }
    $scope.CASHUP_HEADER_VALUES.VOUCHER_ISSUED = {
        "ACTUAL": 0,
        "EPOS": 0,
        "VARIANCE": 0
    }
    $scope.CASHUP_HEADER_VALUES.VOUCHER_REDEEMED = {
        "ACTUAL": 0,
        "EPOS": 0,
        "VARIANCE": 0
    }
    $scope.CASHUP_HEADER_VALUES.DEPOSIT_RECEIVED = {
        "ACTUAL": 0,
        "EPOS": 0,
        "VARIANCE": 0
    }
    $scope.CASHUP_HEADER_VALUES.DEPOSIT_REDEEMED = {
        "ACTUAL": 0,
        "EPOS": 0,
        "VARIANCE": 0
    }
    $scope.CASHUP_HEADER_VALUES.COMPLIMENTARY = {
        "ACTUAL": 0,
        "EPOS": 0,
        "VARIANCE": 0
    }
    $scope.CASHUP_HEADER_VALUES.VOID = {
        "ACTUAL": 0,
        "EPOS": 0,
        "VARIANCE": 0
    }
    $scope.CASHUP_HEADER_VALUES.UNCLASSIFIED = {
        "ACTUAL": 0,
        "EPOS": 0,
        "VARIANCE": 0
    }
    const uiConfig = {

        //STATUS_ROLE:IS_DATA_ENTRY_ENABLED
        //// Pending State

        //Pending State Viewer Standard Role 19 can not do any thing just view
        "0_19": {
            IS_DATA_ENTRY_ENABLED: false, // 
            IS_SUBMIT_BUTTON: false,
            IS_RETURN_BUTTON: false,
            IS_APPROVE_BUTTON: false
        },
        //Pending State Submitter Standard Role 18 can do data entry and click on submit to send cashup for approval
        "0_18": {
            IS_DATA_ENTRY_ENABLED: true,
            IS_SUBMIT_BUTTON: true,
            IS_RETURN_BUTTON: false,
            IS_APPROVE_BUTTON: false
        },
        //Pending State Approver Standard Role 17 can do data entry and click on submit to send cashup for approval
        "0_17": {
            IS_DATA_ENTRY_ENABLED: true,
            IS_SUBMIT_BUTTON: true,
            IS_RETURN_BUTTON: false,
            IS_APPROVE_BUTTON: false
        },
        //Pending State Admin Standard Role 16 can do data entry and click on submit to send cashup for approval
        "0_16": {
            IS_DATA_ENTRY_ENABLED: true,
            IS_SUBMIT_BUTTON: true,
            IS_RETURN_BUTTON: false,
            IS_APPROVE_BUTTON: false
        }, 
        //////////Draft State
        //Viewer Standard Role 19 can not do any thing just view
        "1_19": {
            IS_DATA_ENTRY_ENABLED: false,
            IS_SUBMIT_BUTTON: false,
            IS_RETURN_BUTTON: false,
            IS_APPROVE_BUTTON: false
        },
        //Submitter Standard Role 18 can do data entry and click on submit to send cashup for approval
        "1_18": {
            IS_DATA_ENTRY_ENABLED: true,
            IS_SUBMIT_BUTTON: true,
            IS_RETURN_BUTTON: false,
            IS_APPROVE_BUTTON: false
        }, 
        //Approver Standard Role 17 can do data entry and click on submit to send cashup for approval
        "1_17": {
            IS_DATA_ENTRY_ENABLED: true,
            IS_SUBMIT_BUTTON: true,
            IS_RETURN_BUTTON: false,
            IS_APPROVE_BUTTON: false
        }, 
        //Admin Standard Role 16 can do data entry and click on submit to send cashup for approval
        "1_16": {
            IS_DATA_ENTRY_ENABLED: true,
            IS_SUBMIT_BUTTON: true,
            IS_RETURN_BUTTON: false,
            IS_APPROVE_BUTTON: false
        }, 
        ///////////    Submitted State is not being used in the application but database has entry
        "2_19": {
            IS_DATA_ENTRY_ENABLED: false,
            IS_SUBMIT_BUTTON: false,
            IS_RETURN_BUTTON: false,
            IS_APPROVE_BUTTON: false
        },
        "2_18": {
            IS_DATA_ENTRY_ENABLED: false,
            IS_SUBMIT_BUTTON: false,
            IS_RETURN_BUTTON: false,
            IS_APPROVE_BUTTON: false
        }, 
        "2_17": {
            IS_DATA_ENTRY_ENABLED: false,
            IS_SUBMIT_BUTTON: false,
            IS_RETURN_BUTTON: false,
            IS_APPROVE_BUTTON: false
        }, 
        "2_16": {
            IS_DATA_ENTRY_ENABLED: false,
            IS_SUBMIT_BUTTON: false,
            IS_RETURN_BUTTON: false,
            IS_APPROVE_BUTTON: false
        }, 
        /////       In approval State
        // Viewer cannot do anything at all, no buttons will appear for them
        "3_19": {
            IS_DATA_ENTRY_ENABLED: false,
            IS_SUBMIT_BUTTON: false,
            IS_RETURN_BUTTON: false,
            IS_APPROVE_BUTTON: false
        },
        //Submitter cannot do anything at all, no buttons will appear for them
        "3_18": {
            IS_DATA_ENTRY_ENABLED: false,
            IS_SUBMIT_BUTTON: false,
            IS_RETURN_BUTTON: false,
            IS_APPROVE_BUTTON: false
        },
        //Approver can do data entry, Return to rejected State # 5
        "3_17": {
            IS_DATA_ENTRY_ENABLED: true,
            IS_SUBMIT_BUTTON: false,
            IS_RETURN_BUTTON: true,
            IS_APPROVE_BUTTON: true
        },
        //Admin can do data entry, Return to rejected State # 5
        "3_16": {
            IS_DATA_ENTRY_ENABLED: true,
            IS_SUBMIT_BUTTON: false,
            IS_RETURN_BUTTON: true,
            IS_APPROVE_BUTTON: true
        },
        //////// Approved State
        // No one can do anything at this stage but only view
        "4_19": {
            IS_DATA_ENTRY_ENABLED: false,
            IS_SUBMIT_BUTTON: false,
            IS_RETURN_BUTTON: false,
            IS_APPROVE_BUTTON: false
        },
        "4_18": {
            IS_DATA_ENTRY_ENABLED: false,
            IS_SUBMIT_BUTTON: false,
            IS_RETURN_BUTTON: false,
            IS_APPROVE_BUTTON: false
        },
        "4_17": {
            IS_DATA_ENTRY_ENABLED: false,
            IS_SUBMIT_BUTTON: false,
            IS_RETURN_BUTTON: false,
            IS_APPROVE_BUTTON: false
        },
        "4_16": {
            IS_DATA_ENTRY_ENABLED: false,
            IS_SUBMIT_BUTTON: false,
            IS_RETURN_BUTTON: false,
            IS_APPROVE_BUTTON: false
        },
        ///// Rejected / Returned State. Will work similar to Draft State But Approver/Admin can directly Approve this.
        "5_19": {
            IS_DATA_ENTRY_ENABLED: false,
            IS_SUBMIT_BUTTON: false,
            IS_RETURN_BUTTON: false,
            IS_APPROVE_BUTTON: false
        },
        "5_18": {
            IS_DATA_ENTRY_ENABLED: true,
            IS_SUBMIT_BUTTON: true,
            IS_RETURN_BUTTON: false,
            IS_APPROVE_BUTTON: false
        },
        "5_17": {
            IS_DATA_ENTRY_ENABLED: true,
            IS_SUBMIT_BUTTON: true,
            IS_RETURN_BUTTON: false,
            IS_APPROVE_BUTTON: true
        },
        "5_16": {
            IS_DATA_ENTRY_ENABLED: true,
            IS_SUBMIT_BUTTON: true,
            IS_RETURN_BUTTON: false,
            IS_APPROVE_BUTTON: true
        },
        "null_17": {
            IS_DATA_ENTRY_ENABLED: true,
            IS_SUBMIT_BUTTON: true,
            IS_RETURN_BUTTON: false,
            IS_APPROVE_BUTTON: true
        },
        "null_16": {
            IS_DATA_ENTRY_ENABLED: true,
            IS_SUBMIT_BUTTON: true,
            IS_RETURN_BUTTON: false,
            IS_APPROVE_BUTTON: true
        }
    };
    function getUIBehavior(statusId, roleId) {
        const key = `${statusId}_${roleId}`;
        return uiConfig[key] || {
            IS_DATA_ENTRY_ENABLED: false,
            IS_SUBMIT_BUTTON: false,
            IS_RETURN_BUTTON: false,
            IS_APPROVE_BUTTON: false
        }; // Default fallback
    }
    $scope.GET_CASHUP_ENTRY_HEADER = function (_cashup_header_id,flag) {
        var CashupAppModelObj = new Object();
        CashupAppModelObj.CASHUP_HEADER_ID = _cashup_header_id;
        PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'GET_CASHUP_ENTRY_HEADER').then(function (data) {
            if (data.data.Table.length > 0) {
                if (data.data.Table.filter(row => row.CASHUP_PAYMENT_METHOD_MAPPING_ID == 1).length > 0) {
                    $scope.CASHUP_HEADER_VALUES.CASH.EPOS = parseFloat(data.data.Table.filter(row => row.CASHUP_PAYMENT_METHOD_MAPPING_ID == 1)[0].EPOS_DATA);
                }
                else {
                    $scope.CASHUP_HEADER_VALUES.CASH.EPOS = 0;
                }
                if (data.data.Table.filter(row => row.CASHUP_PAYMENT_METHOD_MAPPING_ID == 2).length > 0) {
                    $scope.CASHUP_HEADER_VALUES.CARDS.EPOS = parseFloat(data.data.Table.filter(row => row.CASHUP_PAYMENT_METHOD_MAPPING_ID == 2)[0].EPOS_DATA);
                }
                else {
                    $scope.CASHUP_HEADER_VALUES.CARDS.EPOS = 0;
                }
                if (data.data.Table.filter(row => row.CASHUP_PAYMENT_METHOD_MAPPING_ID == 3).length > 0) {
                    $scope.CASHUP_HEADER_VALUES.PETTY_CASH.EPOS = parseFloat(data.data.Table.filter(row => row.CASHUP_PAYMENT_METHOD_MAPPING_ID == 3)[0].EPOS_DATA);
                }
                else {
                    $scope.CASHUP_HEADER_VALUES.PETTY_CASH.EPOS = 0;
                }
                if (data.data.Table.filter(row => row.CASHUP_PAYMENT_METHOD_MAPPING_ID == 4).length > 0) {
                    $scope.CASHUP_HEADER_VALUES.DELIVERY.EPOS = parseFloat(data.data.Table.filter(row => row.CASHUP_PAYMENT_METHOD_MAPPING_ID == 4)[0].EPOS_DATA);
                }
                else {
                    $scope.CASHUP_HEADER_VALUES.DELIVERY.EPOS = 0;
                }
                if (data.data.Table.filter(row => row.CASHUP_PAYMENT_METHOD_MAPPING_ID == 5).length > 0) {
                    $scope.CASHUP_HEADER_VALUES.ACCOUNT_CREDIT.EPOS = parseFloat(data.data.Table.filter(row => row.CASHUP_PAYMENT_METHOD_MAPPING_ID == 5)[0].EPOS_DATA);
                }
                else {
                    $scope.CASHUP_HEADER_VALUES.ACCOUNT_CREDIT.EPOS = 0;
                }
                if (data.data.Table.filter(row => row.CASHUP_PAYMENT_METHOD_MAPPING_ID == 6).length > 0) {
                    $scope.CASHUP_HEADER_VALUES.ACCOUNT_RECEIVED.EPOS = parseFloat(data.data.Table.filter(row => row.CASHUP_PAYMENT_METHOD_MAPPING_ID == 6)[0].EPOS_DATA);
                }
                else {
                    $scope.CASHUP_HEADER_VALUES.ACCOUNT_RECEIVED.EPOS = 0;
                }
                if (data.data.Table.filter(row => row.CASHUP_PAYMENT_METHOD_MAPPING_ID == 7).length > 0) {
                    $scope.CASHUP_HEADER_VALUES.VOUCHER_REDEEMED.EPOS = parseFloat(data.data.Table.filter(row => row.CASHUP_PAYMENT_METHOD_MAPPING_ID == 7)[0].EPOS_DATA);
                }
                else {
                    $scope.CASHUP_HEADER_VALUES.VOUCHER_REDEEMED.EPOS = 0;
                }
                if (data.data.Table.filter(row => row.CASHUP_PAYMENT_METHOD_MAPPING_ID == 8).length > 0) {
                    $scope.CASHUP_HEADER_VALUES.VOUCHER_ISSUED.EPOS = parseFloat(data.data.Table.filter(row => row.CASHUP_PAYMENT_METHOD_MAPPING_ID == 8)[0].EPOS_DATA);
                }
                else {
                    $scope.CASHUP_HEADER_VALUES.VOUCHER_ISSUED.EPOS = 0;
                }
                if (data.data.Table.filter(row => row.CASHUP_PAYMENT_METHOD_MAPPING_ID == 9).length > 0) {
                    $scope.CASHUP_HEADER_VALUES.DEPOSIT_REDEEMED.EPOS = parseFloat(data.data.Table.filter(row => row.CASHUP_PAYMENT_METHOD_MAPPING_ID == 9)[0].EPOS_DATA);
                }
                else {
                    $scope.CASHUP_HEADER_VALUES.DEPOSIT_REDEEMED.EPOS = 0;
                }
                if (data.data.Table.filter(row => row.CASHUP_PAYMENT_METHOD_MAPPING_ID == 10).length > 0) {
                    $scope.CASHUP_HEADER_VALUES.DEPOSIT_RECEIVED.EPOS = parseFloat(data.data.Table.filter(row => row.CASHUP_PAYMENT_METHOD_MAPPING_ID == 10)[0].EPOS_DATA);
                }
                else {
                    $scope.CASHUP_HEADER_VALUES.DEPOSIT_RECEIVED.EPOS = 0;
                }
            }

            if (data.data.Table1.length > 0) {
                $scope.CASHUP_HEADER_VALUES.CASH.ACTUAL = parseFloat(data.data.Table1[0].CASH_TOTAL);
                $scope.CASHUP_HEADER_VALUES.CARDS.ACTUAL = parseFloat(data.data.Table1[0].CARDS_TOTAL);
                $scope.CASHUP_HEADER_VALUES.PETTY_CASH.ACTUAL = parseFloat(data.data.Table1[0].PETTY_CASH);
                $scope.CASHUP_HEADER_VALUES.DELIVERY.ACTUAL = parseFloat(data.data.Table1[0].DELIVERY_AMOUNT);
                $scope.CASHUP_HEADER_VALUES.ACCOUNT_RECEIVED.ACTUAL = parseFloat(data.data.Table1[0].ACCOUNT_RECEIVED_TOTAL);
                $scope.CASHUP_HEADER_VALUES.ACCOUNT_CREDIT.ACTUAL = parseFloat(data.data.Table1[0].ACCOUNT_TOTAL);
                $scope.CASHUP_HEADER_VALUES.VOUCHER_ISSUED.ACTUAL = parseFloat(data.data.Table1[0].VOUCHER_ISSUED_TOTAL);
                $scope.CASHUP_HEADER_VALUES.VOUCHER_REDEEMED.ACTUAL = parseFloat(data.data.Table1[0].VOUCHER_REDEEMED_TOTAL);
                $scope.CASHUP_HEADER_VALUES.DEPOSIT_REDEEMED.ACTUAL = parseFloat(data.data.Table1[0].DEPOSIT_REDEEMED_TOTAL);
                $scope.CASHUP_HEADER_VALUES.DEPOSIT_RECEIVED.ACTUAL = parseFloat(data.data.Table1[0].DEPOSIT_RECEIVED_TOTAL);
                $scope.CASHUP_HEADER_VALUES.COMPLIMENTARY.ACTUAL = parseFloat(data.data.Table1[0].COMPLIMENTARY_TOTAL);
                $scope.CASHUP_HEADER_VALUES.VOID.ACTUAL = parseFloat(data.data.Table1[0].VOID_TOTAL);
                //$scope.CASHUP_ENTRY_SEARCH.INTEGRATION_SYSTEM_ID = data.data.Table1[0].INTEGRATION_SYSTEM_ID;
                //$scope.CASHUP_ENTRY_SEARCH.SYSTEM_NAME = data.data.Table1[0].SYSTEM_NAME;
                $scope.CASHUP_ENTRY_SEARCH.SESSION_START = data.data.Table1[0].SESSION_START;
                $scope.CASHUP_ENTRY_SEARCH.SESSION_END = data.data.Table1[0].SESSION_END;
                $scope.STEP_NO = data.data.Table1[0].STEP_NO;
                $scope.STATUS = data.data.Table1[0].STATUS;
            }
            if (data.data.Table2.length > 0) {
                $scope.CASHUP_HEADER_VALUES.VOID.EPOS = parseFloat(data.data.Table2[0].EPOS_DATA_VOID);
            }
            else {
                $scope.CASHUP_HEADER_VALUES.VOID.EPOS = 0;
            }
            if (data.data.Table3.length > 0) {
                $scope.CASHUP_HEADER_VALUES.COMPLIMENTARY.EPOS = parseFloat(data.data.Table3[0].EPOS_DATA_COMP);
            }
            else {
                $scope.CASHUP_HEADER_VALUES.COMPLIMENTARY.EPOS = 0;
            }
            if (data.data.Table4.length > 0 && data.data.Table4.filter(row => row.MEDIA == 'Unclassified').length > 0) {
                $scope.CASHUP_HEADER_VALUES.UNCLASSIFIED.EPOS = parseFloat(data.data.Table4.filter(row => row.MEDIA == 'Unclassified')[0].SALES_AMT);
            }
            else {
                $scope.CASHUP_HEADER_VALUES.UNCLASSIFIED.EPOS = 0;
            }
            var uibehaviourResult = getUIBehavior($scope.STATUS, $scope.CASHUP_ENTRY_SEARCH.STANDARD_ROLE_ID);

            $scope.CASHUP_APPROVER_PRIVILEGE_ID = '1163';
            var CASHUP_APPROVER_PRIVILEGE = $scope.CASHUP_ENTRY_SEARCH.USER_PRIVILEGE_IDS.includes($scope.CASHUP_APPROVER_PRIVILEGE_ID);

            if ($scope.STATUS == 3 && ($scope.CASHUP_ENTRY_SEARCH.STANDARD_ROLE_ID == 16 || $scope.CASHUP_ENTRY_SEARCH.STANDARD_ROLE_ID == 17)) {
                $scope.CASHUP_ENTRY_SEARCH.IS_DATA_ENTRY_ENABLED = CASHUP_APPROVER_PRIVILEGE && uibehaviourResult.IS_DATA_ENTRY_ENABLED;
            }
            else {
                $scope.CASHUP_ENTRY_SEARCH.IS_DATA_ENTRY_ENABLED = uibehaviourResult.IS_DATA_ENTRY_ENABLED;
            }
            
            $scope.CASHUP_ENTRY_SEARCH.IS_SUBMIT_BUTTON = uibehaviourResult.IS_SUBMIT_BUTTON;
            


            //$scope.CASHUP_ENTRY_SEARCH.IS_DATA_ENTRY_ENABLED = getUIBehavior($scope.STATUS, $scope.CASHUP_ENTRY_SEARCH.STANDARD_ROLE_ID);
            if (flag == 1) {
                $scope.CALL_FUNCTIONS_TAB_WISE($scope.STEP_NO);
            }
        });
    }
    $scope.CLOSE_CASHUP_HEADER_PRIVILEGE=function(_session_mapping_id, _area_id){
        var status = $scope.GET_HEADER_VALUE_FOR_PROMPT('status', _session_mapping_id, _area_id);
        var roleId = $scope.CASHUP_ENTRY_SEARCH.STANDARD_ROLE_ID;

        if ((status == 0 || status == 1) && (roleId == 16 || roleId == 17 || roleId == 18)) {
            return true;
        }
        else {
            return false;
        }
        
    }
    $scope.GET_HEADER_VALUE_FOR_PROMPT = function (_variable, _session_mapping_id,_area_id) {
        if (_variable == 'epos') {
            if ($scope.CASHUP_BY_AREA == false) {
                if ($scope.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_LIST.filter(_row => _row.SESSION_MAPPING_ID == _session_mapping_id).length > 0) {
                    return $scope.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_LIST.filter(_row => _row.SESSION_MAPPING_ID == _session_mapping_id)[0].EPOS_TOTAL;
                }
                else {
                    return null;
                }
            }
            else {
                if ($scope.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_LIST.filter(_row => _row.AREA_ID == $scope.CASHUP_ENTRY_SEARCH.AREA_ID && _row.SESSION_MAPPING_ID == _session_mapping_id).length>0) {
                    return $scope.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_LIST.filter(_row => _row.AREA_ID == $scope.CASHUP_ENTRY_SEARCH.AREA_ID && _row.SESSION_MAPPING_ID == _session_mapping_id)[0].EPOS_TOTAL;
                }
                else {
                    return null;
                }
            }
        }
        if (_variable == 'actual') {
            if ($scope.CASHUP_BY_AREA == false) {
                if ($scope.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_LIST.filter(_row => _row.SESSION_MAPPING_ID == _session_mapping_id).length>0) {
                    return $scope.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_LIST.filter(_row => _row.SESSION_MAPPING_ID == _session_mapping_id)[0].ACTUAL_TOTAL;
                }
                else {
                    return null;
                }

                //return $scope.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_LIST.filter(_row => _row.SESSION_MAPPING_ID == _session_mapping_id)[0].ACTUAL_TOTAL;
            }
            else {
                if ($scope.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_LIST.filter(_row => _row.AREA_ID == $scope.CASHUP_ENTRY_SEARCH.AREA_ID && _row.SESSION_MAPPING_ID == _session_mapping_id).length>0) {
                    return $scope.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_LIST.filter(_row => _row.AREA_ID == $scope.CASHUP_ENTRY_SEARCH.AREA_ID && _row.SESSION_MAPPING_ID == _session_mapping_id)[0].ACTUAL_TOTAL;
                }
                else {
                    return null;
                }
            }
        }
        if (_variable == 'varience') {
            if ($scope.CASHUP_BY_AREA == false) {
                if ($scope.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_LIST.filter(_row => _row.SESSION_MAPPING_ID == _session_mapping_id).length > 0) {
                    var epos = parseFloat($scope.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_LIST.filter(_row => _row.SESSION_MAPPING_ID == _session_mapping_id)[0].EPOS_TOTAL);
                    var actual = parseFloat($scope.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_LIST.filter(_row => _row.SESSION_MAPPING_ID == _session_mapping_id)[0].ACTUAL_TOTAL);
                    return (actual - epos)
                }
                else {
                    return null;
                }
                
                
            }
            else {
                if ($scope.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_LIST.filter(_row => _row.AREA_ID == $scope.CASHUP_ENTRY_SEARCH.AREA_ID && _row.SESSION_MAPPING_ID == _session_mapping_id).length) {
                    var epos = parseFloat($scope.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_LIST.filter(_row => _row.AREA_ID == $scope.CASHUP_ENTRY_SEARCH.AREA_ID && _row.SESSION_MAPPING_ID == _session_mapping_id)[0].EPOS_TOTAL);
                    var actual = parseFloat($scope.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_LIST.filter(_row => _row.AREA_ID == $scope.CASHUP_ENTRY_SEARCH.AREA_ID && _row.SESSION_MAPPING_ID == _session_mapping_id)[0].ACTUAL_TOTAL);
                    return (actual - epos)
                }
                else {
                    return null;
                }
            }
        }
        if (_variable == 'status') {
            if ($scope.CASHUP_BY_AREA == false) {
                if ($scope.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_LIST.filter(_row => _row.SESSION_MAPPING_ID == _session_mapping_id).length > 0) {
                    return $scope.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_LIST.filter(_row => _row.SESSION_MAPPING_ID == _session_mapping_id)[0].STATUS;
                }
                else {
                    return null;
                }
            }
            else {
                if ($scope.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_LIST.filter(_row => _row.AREA_ID == _area_id && _row.SESSION_MAPPING_ID == _session_mapping_id).length > 0) {
                    return $scope.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_LIST.filter(_row => _row.AREA_ID == _area_id && _row.SESSION_MAPPING_ID == _session_mapping_id)[0].STATUS;
                }
                else {
                    return null;
                }
            }
            //if ($scope.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_LIST.filter(_row => _row.SESSION_MAPPING_ID == _session_mapping_id).length > 0) {
            //    return $scope.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_LIST.filter(_row => _row.SESSION_MAPPING_ID == _session_mapping_id)[0].STATUS;
            //}
            //else {
            //    return null;
            //}
        }
        //if (_variable == 'header') {
        //    if ($scope.CASHUP_BY_AREA == false) {
        //        if ($scope.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_LIST.filter(_row => _row.SESSION_MAPPING_ID == _session_mapping_id).length > 0) {
        //            return $scope.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_LIST.filter(_row => _row.SESSION_MAPPING_ID == _session_mapping_id)[0].CASHUP_HEADER_ID;
        //        }
        //        else {
        //            return null;
        //        }
        //    }
        //    else {
        //        if ($scope.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_LIST.filter(_row => _row.AREA_ID == _area_id && _row.SESSION_MAPPING_ID == _session_mapping_id).length > 0) {
        //            return $scope.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_LIST.filter(_row => _row.AREA_ID == _area_id && _row.SESSION_MAPPING_ID == _session_mapping_id)[0].CASHUP_HEADER_ID;
        //        }
        //        else {
        //            return null;
        //        }
        //    }
        //}
    }

    $scope.CASHUP_REVIEW = function () {
        var TABLE_ID_LIST = [];
        var CashupAppModelObj = new Object();
        angular.forEach($scope.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_LIST, function (_row) {
            var _header = new Object();
            _header.TABLE_ID = _row.CASHUP_HEADER_ID;
            TABLE_ID_LIST.push(_header);
        })
        CashupAppModelObj.TABLE_ID_LIST = TABLE_ID_LIST;
        PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'CASHUP_REVIEW').then(function (data) {
            angular.forEach($scope.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_LIST, function (_header) {
                _header.EPOS_TOTAL = 0;
                _header.ACTUAL_TOTAL = 0;
                if (data.data.Table.length > 0) {
                    var tempTable = data.data.Table;
                    let filteredData = tempTable.filter(_row => _row.CASHUP_HEADER_ID == _header.CASHUP_HEADER_ID);

                    if (filteredData.filter(row => row.CASHUP_PAYMENT_METHOD_MAPPING_ID == 1).length > 0) {
                        _header.EPOS_TOTAL += parseFloat(filteredData.filter(row => row.CASHUP_PAYMENT_METHOD_MAPPING_ID == 1)[0].EPOS_DATA);
                    }
                    if (filteredData.filter(row => row.CASHUP_PAYMENT_METHOD_MAPPING_ID == 2).length > 0) {
                        _header.EPOS_TOTAL += parseFloat(filteredData.filter(row => row.CASHUP_PAYMENT_METHOD_MAPPING_ID == 2)[0].EPOS_DATA);
                    }
                    if (filteredData.filter(row => row.CASHUP_PAYMENT_METHOD_MAPPING_ID == 3).length > 0) {
                        _header.EPOS_TOTAL += parseFloat(filteredData.filter(row => row.CASHUP_PAYMENT_METHOD_MAPPING_ID == 3)[0].EPOS_DATA);
                    }
                    if (filteredData.filter(row => row.CASHUP_PAYMENT_METHOD_MAPPING_ID == 4).length > 0) {
                        _header.EPOS_TOTAL += parseFloat(filteredData.filter(row => row.CASHUP_PAYMENT_METHOD_MAPPING_ID == 4)[0].EPOS_DATA);
                    }
                    if (filteredData.filter(row => row.CASHUP_PAYMENT_METHOD_MAPPING_ID == 5).length > 0) {
                        _header.EPOS_TOTAL += parseFloat(filteredData.filter(row => row.CASHUP_PAYMENT_METHOD_MAPPING_ID == 5)[0].EPOS_DATA);
                    }
                    if (filteredData.filter(row => row.CASHUP_PAYMENT_METHOD_MAPPING_ID == 6).length > 0) {
                        _header.EPOS_TOTAL += parseFloat(filteredData.filter(row => row.CASHUP_PAYMENT_METHOD_MAPPING_ID == 6)[0].EPOS_DATA);
                    }
                    if (filteredData.filter(row => row.CASHUP_PAYMENT_METHOD_MAPPING_ID == 7).length > 0) {
                        _header.EPOS_TOTAL += parseFloat(filteredData.filter(row => row.CASHUP_PAYMENT_METHOD_MAPPING_ID == 7)[0].EPOS_DATA);
                    }
                    if (filteredData.filter(row => row.CASHUP_PAYMENT_METHOD_MAPPING_ID == 8).length > 0) {
                        _header.EPOS_TOTAL += parseFloat(filteredData.filter(row => row.CASHUP_PAYMENT_METHOD_MAPPING_ID == 8)[0].EPOS_DATA);
                    }
                    if (filteredData.filter(row => row.CASHUP_PAYMENT_METHOD_MAPPING_ID == 9).length > 0) {
                        _header.EPOS_TOTAL += parseFloat(filteredData.filter(row => row.CASHUP_PAYMENT_METHOD_MAPPING_ID == 9)[0].EPOS_DATA);
                    }
                    if (filteredData.filter(row => row.CASHUP_PAYMENT_METHOD_MAPPING_ID == 10).length > 0) {
                        _header.EPOS_TOTAL += parseFloat(filteredData.filter(row => row.CASHUP_PAYMENT_METHOD_MAPPING_ID == 10)[0].EPOS_DATA);
                    }

                }

                if (data.data.Table1.length > 0) {
                    var tempTable1 = data.data.Table1;
                    filteredData1 = tempTable1.filter(_row => _row.CASHUP_HEADER_ID == _header.CASHUP_HEADER_ID);

                    _header.ACTUAL_TOTAL += parseFloat(filteredData1[0].CASH_TOTAL);
                    _header.ACTUAL_TOTAL += parseFloat(filteredData1[0].CARDS_TOTAL);
                    _header.ACTUAL_TOTAL += parseFloat(filteredData1[0].PETTY_CASH);
                    _header.ACTUAL_TOTAL += parseFloat(filteredData1[0].DELIVERY_AMOUNT);
                    _header.ACTUAL_TOTAL += parseFloat(filteredData1[0].ACCOUNT_RECEIVED_TOTAL);
                    _header.ACTUAL_TOTAL += parseFloat(filteredData1[0].ACCOUNT_TOTAL);
                    _header.ACTUAL_TOTAL += parseFloat(filteredData1[0].VOUCHER_ISSUED_TOTAL);
                    _header.ACTUAL_TOTAL += parseFloat(filteredData1[0].VOUCHER_REDEEMED_TOTAL);
                    _header.ACTUAL_TOTAL += parseFloat(filteredData1[0].DEPOSIT_REDEEMED_TOTAL);
                    _header.ACTUAL_TOTAL += parseFloat(filteredData1[0].DEPOSIT_RECEIVED_TOTAL);
                    _header.ACTUAL_TOTAL += parseFloat(filteredData1[0].COMPLIMENTARY_TOTAL);
                    _header.ACTUAL_TOTAL += parseFloat(filteredData1[0].VOID_TOTAL);
                    _header.STATUS = filteredData1[0].STATUS;
                }

                if (data.data.Table2.length > 0) {
                    var tempTable2 = data.data.Table2;
                    filteredData2 = tempTable2.filter(_row => _row.CASHUP_HEADER_ID == _header.CASHUP_HEADER_ID);
                    _header.EPOS_TOTAL += parseFloat(filteredData2[0].EPOS_DATA_VOID);
                }
                if (data.data.Table3.length > 0) {
                    var tempTable3 = data.data.Table3;
                    filteredData3 = tempTable3.filter(_row => _row.CASHUP_HEADER_ID == _header.CASHUP_HEADER_ID);
                    _header.EPOS_TOTAL += parseFloat(filteredData3[0].EPOS_DATA_COMP);
                }
                if (data.data.Table6.length > 0 && data.data.Table6.filter(row => row.MEDIA == 'Unclassified').length > 0) {
                    _header.EPOS_TOTAL += parseFloat(data.data.Table6.filter(row => row.MEDIA == 'Unclassified')[0].SALES_AMT);
                }
            })
        });
    }

    $scope.CLOSE_CASHUP_HEADER = function (_session_mapping_id,_area_id) {
        if ($scope.CASHUP_BY_AREA == false) {
            if ($scope.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_LIST.filter(_row => _row.SESSION_MAPPING_ID == _session_mapping_id).length > 0) {
                $scope.UPD_CASHUP_REVIEW_STATUS($scope.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_LIST.filter(_row => _row.SESSION_MAPPING_ID == _session_mapping_id)[0].CASHUP_HEADER_ID,3);
            }
            else {
                $scope.$paren.ShowAlertBox('Error', 'Something went wrong!');
            }
        }
        else {
            if ($scope.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_LIST.filter(_row => _row.AREA_ID == _area_id && _row.SESSION_MAPPING_ID == _session_mapping_id).length > 0) {
                $scope.UPD_CASHUP_REVIEW_STATUS($scope.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_LIST.filter(_row => _row.AREA_ID == _area_id && _row.SESSION_MAPPING_ID == _session_mapping_id)[0].CASHUP_HEADER_ID,3);
            }
            else {
                $scope.$paren.ShowAlertBox('Error', 'Something went wrong!');
            }
        }
    }

    $scope.UPD_CASHUP_REVIEW_STATUS = function (_header_id,flag) {
        var TABLE_ID_LIST = [];
        var CashupAppModelObj = new Object();
        CashupAppModelObj.STATUS_FLAG = flag;
        var _header = new Object();
        _header.TABLE_ID = _header_id;
        TABLE_ID_LIST.push(_header);
        CashupAppModelObj.TABLE_ID_LIST = TABLE_ID_LIST;
        CashupAppModelObj.USER_ID = $scope.USER_ID;
        CashupAppModelObj.REJECTION_COMMENT = null;
        
        PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'UPD_CASHUP_REVIEW_STATUS').then(function (data) {
            $scope.CASHUP_REVIEW();
        });
    }


    //$scope.EXPORT_PAGE_TO_PDF = function (ID,FILE_NAME) {
    //    window.scrollTo(0, 0);
    //    document.getElementById("loader").style.display = "block";
    //    const node = document.getElementById('#PRINT_REPORT');
    //    const clone = node.cloneNode(true);
    //    if (clone.getElementsByClassName('table-responsive').length != 0 && clone.getElementsByClassName('table-responsive') != undefined) {
    //        for (let i = 0; i < clone.getElementsByClassName('table-responsive').length; i++) {
    //            clone.getElementsByClassName('table-responsive')[i].classList.remove('scrollbar-wrapper');
    //            clone.getElementsByClassName('table-responsive')[i].classList.remove('mx-height-400');
    //            //clone.getElementsByClassName('table-responsive')[i].getElementsByClassName('mb-0')[0].getElementsByClassName('t_foot_fixed')[0].setAttribute("style", "display:none");
    //        }
    //        for (let i = 0; i < clone.getElementsByClassName('table-responsive')[0].getElementsByClassName('ng-hide').length; i++) {
    //            clone.getElementsByClassName('table-responsive')[0].getElementsByClassName('ng-hide')[i].setAttribute("style", "display:none")
    //            //clone.getElementsByClassName('table-responsive')[0].classList.remove('fa-chevron-down');
    //        }
    //        //for (let i = 0; i < clone.getElementsByClassName('table-responsive')[0].getElementsByClassName('fa-chevron-down').length; i++) {
    //        //    clone.getElementsByClassName('table-responsive')[0].classList.remove('fa-chevron-down');
    //        //    //clone.getElementsByClassName('table-responsive')[0].classList.remove('fa-chevron-down');
    //        //}
    //    }
    //    if (clone.getElementsByClassName('dropdown-menu scrollbar-wrapper w-auto show').length != 0 && clone.getElementsByClassName('dropdown-menu DontHideOnClick scrollbar-wrapper w-auto show') != undefined) {
    //        for (let i = 0; i < clone.getElementsByClassName('dropdown-menu scrollbar-wrapper w-auto show').length; i++) {
    //            clone.getElementsByClassName('dropdown-menu scrollbar-wrapper w-auto show')[i].setAttribute("style", "display:none");
    //        }
    //    }

    //    clone.getElementsByClassName('col-xxl-auto col-xl-auto col-md-auto CASHUP_SITE_DROPDOWN')[0].setAttribute("style", "display:none");
    //    clone.getElementsByClassName('col-xxl-auto col-xl-auto col-md-auto CASHUP_DATE_RANGE_FILTER')[0].setAttribute("style", "display:none");
        
    //}
});
