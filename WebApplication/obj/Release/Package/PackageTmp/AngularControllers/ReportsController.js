app.controller('ReportMainController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.REDIRECTION_PAGE = function (Path) {
        $location.path(Path)
    };

});
app.controller('LightSpeedController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.$parent.TabActive(3);
    var myLineChart;
    $scope.LightSpeedSearch = {
        ABSENCE_TYPE_ID: null,
        HOURS: '',
        DAYS: '',
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        COMMENT: '',
        SORT_BY: '',
        DEPARTMENT_IDS: '',
        POSITION_IDS: '',
        REPORTING_MANAGER_ID: '',
        START_DATE: '',
        END_DATE: '',
    }
    var colors = [['#a90000'], ['#012e93'], ['#087e01'], ['#f83b00']];
    $scope.colours_Session = ["#0277bd", "#0288d1", "#039be5", "#03a9f4", "#29b6f6"],
        $scope.colours_Sales = ["#0277bd", "#0288d1", "#039be5", "#03a9f4", "#29b6f6"],
        $scope.colours_Area = ["#0277bd", "#0288d1", "#039be5", "#03a9f4", "#29b6f6"],
        $scope.colours_Category = ["#057091", "#039be5", "#03a9f4", "#29b6f6", "#0C7185"],
        $scope.colours_Media = ["#e1f5fe", "#b3e5fc", "#81d4fa", "#4fc3f7", "#29b6f6", "#03a9f4", "#039be5", "#0288d1"],
        $scope.colours_YTDGrossSales = ["#4472c4", "#4472c4", "#4472c4", "#4472c4", "#4472c4", "#4472c4", "#4472c4", "#4472c4"],
        $scope.colours_NetSales = ["#e1f5fe", "#b3e5fc", "#81d4fa", "#4fc3f7", "#29b6f6", "#03a9f4", "#039be5", "#0288d1"],
        $scope.colours_Weekly_RestaurantCash = ["#B1E3FA", "#8ADAFF", "#43BEF7", "#11AEF7", "#29b6f6", "#03a9f4", "#039be5", "#29b6f6", "#03a9f4", "#039be5", "#0288d1"],

        $scope.WeekNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    $scope.textlabelsSocial = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    $scope.PAGE_LOAD = function () {
        $scope.DAILY_GROSS_LIST = [];
        $scope.DAILY_GROSS_LIST.FETCH_FLAG = 1;
        $scope.GROSS_SALES_LIST = [];
        $scope.GROSS_SALES_LIST.FETCH_FLAG = 1;
        $scope.SPEND_PER_TRANSACTION_LIST = [];
        $scope.SPEND_PER_TRANSACTION_LIST.FETCH_FLAG = 1;
        $scope.NETSALESCHART_12_LIST = [];
        $scope.NETSALESCHART_12_LIST.FETCH_FLAG = 1;
        $scope.YTD_GROSS_SALES_LIST = [];
        $scope.YTD_GROSS_SALES_LIST.FETCH_FLAG = 1;
        $scope.DAILY_DISCOUNT_LIST = [];
        $scope.DAILY_DISCOUNT_LIST.FETCH_FLAG = 1;

        $scope.DAILY_TRANSACTION_LIST = [];
        $scope.DAILY_TRANSACTION_LIST.FETCH_FLAG = 1;

        $scope.WEEK_TO_DATE_GROSS_SALES_LIST = [];
        $scope.WEEK_TO_DATE_GROSS_SALES_LIST.FETCH_FLAG = 1;
        $scope.DAILY_FLASH_REPORT_LIGHTSPEED = [];
        $scope.DAILY_FLASH_REPORT_LIGHTSPEED.FETCH_FLAG = 1;
    };
    $scope.RESET_LEAVE = function () {
        $scope.LightSpeedSearch = {
            ABSENCE_TYPE_ID: null,
            HOURS: '',
            DAYS: '',
            PAGE_NO: 1,
            PAGE_SIZE: 10,
            COMMENT: '',
        }
    };
    $scope.$parent.dateinputOpenDate();
    $scope.options = {
        legend: {
            display: false,
            position: 'right',
            align: "start"
        },
        scales: {
            yAxes: [
                {
                    scaleLabel: {
                        display: true,
                        labelString: 'Total Amount '
                    },
                    position: 'right',
                    ticks: {
                        beginAtZero: true
                    },
                    gridLines: {
                        drawOnChartArea: false,
                        drawBorder: false,
                        display: false
                    }
                }, {
                    display: true,
                    position: 'left',
                    ticks: {
                        beginAtZero: true,
                        max: 45,
                        min: 0,
                        stepSize: 5
                    }
                }
            ],

            xAxes: [
                {

                    type: 'time',
                    time: {
                        format: 'hh:MM:ss TT',
                        tooltipFormat: 'll'
                    },
                    position: 'right',
                    ticks: {
                        beginAtZero: true
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Time'
                    },
                    gridLines: {
                        drawOnChartArea: false,
                        drawBorder: false,
                        display: false
                    }
                }
            ]
        },

    };
    $scope.dayOfWeekNamesShort = [];
    $scope.dayOfWeekNamesShort = [{ ID: 1, NAME: "Mon" }, { ID: 2, NAME: "Tue" }, { ID: 3, NAME: "Wed" }, { ID: 4, NAME: "Thu" }, { ID: 5, NAME: "Fri" }, { ID: 6, NAME: "Sat" }, { ID: 7, NAME: "Sun" }];
    $scope.monthNames = [
        { ID: 1, NAME: "January" },
        { ID: 2, NAME: "February" },
        { ID: 3, NAME: "March" },
        { ID: 4, NAME: "April" },
        { ID: 5, NAME: "May" },
        { ID: 6, NAME: "June" },
        { ID: 7, NAME: "July" },
        { ID: 8, NAME: "August" },
        { ID: 9, NAME: "September" },
        { ID: 10, NAME: "October" },
        { ID: 11, NAME: "November" },
        { ID: 12, NAME: "December" }];
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    var curr = new Date; // get current date
    var currdate = new Date; // get current date
    $scope.CURR_DAY = curr.getDay();
    $scope.CURRENT_YEAR = curr.getFullYear();
    var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
    var LAST_DATE = first + 6;
    var Month = curr.getMonth();
    $scope.CURRENT_MONTH = $scope.monthNames.filter(function (x) { return x.ID == (Month + 1) })[0].NAME;
    var START_DATE = new Date(curr.setDate(first)).toUTCString();
    var myFutureDate = new Date(START_DATE);
    myFutureDate.setDate(myFutureDate.getDate() + LAST_DATE)
    angular.forEach($scope.dayOfWeekNamesShort, function (val) {
        var setdays = first + val.ID;
        var days = new Date(curr.setDate(setdays)).toUTCString();
        var Wekday = new Date(days);
        val.Days = Wekday.getDate()
        val.CurrentDate = currdate.getDate();
    })
    function reportrange(start, end) {
        $scope.LightSpeedSearch.START_DATE = start.format($scope.$parent.Datelocaleformat.format);
        $scope.LightSpeedSearch.END_DATE = end.format($scope.$parent.Datelocaleformat.format);
        //$scope.LightSpeedSearch.START_DATE = 'Jul/23/2021' 
        //$('#reportrange span').html('Jul/23/2021');
        $('#reportrange span').html(start.format($scope.$parent.Datelocaleformat.format));
        $scope.PAGE_LOAD();
        $scope.GET_DAILY_FLASH_REPORT_LIGHTSPEED();
    };
    $(function () {
        var start = moment().startOf('isoWeek');//moment().subtract(6, 'days');
        var end = moment().subtract(0, 'days');
        $scope.$parent.SetUpDateRangePicker('reportrange', start, end, reportrange);
    });
    //$scope.WeekNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    $scope.DAILY_GROSS = function (data) {
        $scope.DAILY_GROSS_LIST = data;
        var myChart
        $scope.DailyGross = [];
        var UNI_WEEK = $filter('unique')(data, 'CURRENT_WEEK');
        angular.forEach(UNI_WEEK, function (val) {
            var obj = new Object();
            if (val.CURRENT_WEEK == 1) {
                obj.label = 'Current Week'
                obj.backgroundColor = '#00b050'
            }
            if (val.CURRENT_WEEK == 0) {
                obj.label = 'Last Week'
                obj.backgroundColor = '#0070c0'
            }
            obj.borderWidth = 2,
                obj.data = [];
            angular.forEach($scope.dayOfWeekNamesShort, function (Weekval) {
                var CurrentLastWeek = data.filter(function (x) { return x.WEEKDAY_NO == Weekval.ID && x.CURRENT_WEEK == val.CURRENT_WEEK });
                if (CurrentLastWeek.length > 0) {
                    obj.data.push(CurrentLastWeek[0].GROSS_AMOUNT);
                }
                else {
                    obj.data.push(0);
                }
            })
            $scope.DailyGross.push(obj);
        });
        var options = {
            legend: {
                position: 'top',
                display: true
            },
            tooltips: {
                mode: 'index'
            },
            scales: {
                yAxes: [{
                    gridLines: {
                        display: false
                    }
                }]
            }

        };
        document.getElementById("DailyGrossId").innerHTML = '<canvas id="DailyGross"></canvas>';
        var ctx = document.getElementById('DailyGross').getContext('2d');
        if (myChart) {
            myChart.destroy();
        }
        myChart = new Chart(ctx, {
            //type: 'horizontalBar',
            type: 'bar',
            data: {
                labels: $scope.WeekNames,
                datasets: $scope.DailyGross
            },
            options: options
        });


    };
    function GROSS_SALES(data) {
        $scope.GROSS_SALES_LIST = data;
        $scope.ARRAY_FAST = [];
        $scope.DatasetArray = [];
        var count = 0;
        angular.forEach($scope.PRODUCT_LIST_COPY, function (stc, index) {
            var arry2 = new Object();
            arry2.label = stc.PRODUCT_TYPE,
                arry2.data = [],
                arry2.backgroundColor = $scope.colours_Weekly_RestaurantCash[count],
                //arry2.stack = 1
                angular.forEach($scope.dayOfWeekNamesShort, function (Week) {
                    var CurrentWeek = $scope.PRODUCT_LIST_ALL.filter(function (x) {
                        return stc.PRODUCT_TYPE_ID == x.PRODUCT_TYPE_ID && x.WEEKDAY_NO == Week.ID
                    });
                    if (CurrentWeek.length > 0) {
                        arry2.data.push(CurrentWeek[0].GROSS_BEFORE_DISCOUNT);
                    }
                    else {
                        arry2.data.push(0)
                    }
                })
            $scope.DatasetArray.push(arry2)
            count++;
        })
        var options = {
            legend: {
                position: 'right',
                display: true
            },
            tooltips: {
                mode: 'index'
            },
            scales: {
                yAxes: [{
                    gridLines: {
                        display: false
                    }
                }]
            }

        };
        Chart.defaults.global.defaultFontSize = 9;
        document.getElementById("GROSS_SALESID").innerHTML = '<canvas id="GROSS_SALES"></canvas>';
        var ctx = document.getElementById('GROSS_SALES').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: $scope.WeekNames,
                datasets: $scope.DatasetArray
            },
            options: options,
        });
    };
    $scope.WEEK_TO_DATE_GROSS_SALES = function (data) {
        $scope.WEEK_TO_DATE_GROSS_SALES_LIST = data;
        var myChart
        $scope.WeekTodate = [];
        $scope.WeekToDatelabel = [];
        var UNI_WEEK = $filter('unique')(data, 'CURRENT_WEEK');
        var PRODUCT_LIST = $filter('unique')(data, 'PRODUCT_TYPE');
        angular.forEach(UNI_WEEK, function (val, index) {
            var obj = new Object();
            obj.borderWidth = 2,
                obj.data = [];
            if (val.CURRENT_WEEK == 1) {
                obj.label = 'Current Week'
                obj.backgroundColor = '#4472c4'
            }
            if (val.CURRENT_WEEK == 0) {
                obj.label = 'Last Week'
                obj.backgroundColor = '#a5a5a5'
            }
            angular.forEach(PRODUCT_LIST, function (Weekval) {
                var CurrentLastWeek = data.filter(function (x) { return Weekval.PRODUCT_TYPE_ID == x.PRODUCT_TYPE_ID && x.WEEKDAY_NO == Weekval.WEEKDAY_NO && x.CURRENT_WEEK == val.CURRENT_WEEK });
                if (CurrentLastWeek.length > 0) {
                    obj.data.push(CurrentLastWeek[0].GROSS_AMOUNT);
                }
                else {
                    obj.data.push(0);
                }
                if (index == 0) {
                    $scope.WeekToDatelabel.push('Total ' + Weekval.PRODUCT_TYPE);
                }
            })
            $scope.WeekTodate.push(obj);
        });
        var options = {
            legend: {
                position: 'right',
                display: true
            },
            tooltips: {
                mode: 'index'
            },
            scales: {
                yAxes: [{
                    gridLines: {
                        display: false
                    }
                }]
            }

        };
        document.getElementById("WeekToDateGrossSalesIds").innerHTML = '<canvas id="WeekToDateGrossSales"></canvas>';
        var ctx = document.getElementById('WeekToDateGrossSales').getContext('2d');
        if (myChart) {
            myChart.destroy();
        }
        myChart = new Chart(ctx, {
            type: 'horizontalBar',
            data: {
                labels: $scope.WeekToDatelabel,
                datasets: $scope.WeekTodate
            },
            options: options
        });


    };
    $scope.SpendPerTransaction = function (data) {
        $scope.SPEND_PER_TRANSACTION_LIST = data;
        $scope.datasets = [];
        var UNI_WEEK = $filter('unique')(data, 'CURRENT_WEEK');
        var i = 0;
        angular.forEach(UNI_WEEK, function (value) {
            datasetobj = new Object();
            if (value.CURRENT_WEEK == 1) {
                datasetobj.label = 'Current Week'
                datasetobj.borderColor = '#70ad47'
            }
            if (value.CURRENT_WEEK == 0) {
                datasetobj.label = 'Last Week'
                datasetobj.borderColor = '#5b9bd5'
            }
            var dateaobj = [];
            var Qut = UNI_WEEK.filter(function (x) { return x.WEEKDAY_NO == value.ID });
            angular.forEach($scope.dayOfWeekNamesShort, function (line) {
                var Data = data.filter(function (x) { return line.ID == x.WEEKDAY_NO && value.CURRENT_WEEK == x.CURRENT_WEEK })
                if (Data.length > 0) {
                    dateaobj.push(parseFloat((Data[0].AMOUNT_PER_TRANSACTION)));
                }
                else {
                    dateaobj.push(0);
                }
            });
            datasetobj.fill = false,
                //  datasetobj.borderColor = colors[i];
                datasetobj.data = dateaobj;
            datasetobj.tension = 0.1
            $scope.datasets.push(datasetobj);
            i++;
        })

        document.getElementById("SpendPerTransactionids").innerHTML = '<canvas id="SpendPerTransaction"></canvas>';
        var ctx = document.getElementById("SpendPerTransaction").getContext('2d');
        if (myChart) {
            myChart.destroy();
        }
        var options = {
            legend: {
                position: 'bottom',
                display: true
            },
            tooltips: {
                mode: 'index'
            },
        };
        var data = {
            labels: $scope.WeekNames,
            datasets: $scope.datasets
        };
        var myChart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: options,
        });
    };
    $scope.DAILY_TRANSACTION = function (data) {
        $scope.DAILY_TRANSACTION_LIST = data;
        var myChart
        $scope.DailyTransaction = [];
        var UNI_WEEK = $filter('unique')(data, 'CURRENT_WEEK');
        angular.forEach(UNI_WEEK, function (val) {
            var obj = new Object();
            if (val.CURRENT_WEEK == 1) {
                obj.label = 'Current Week'
                obj.backgroundColor = '#00b050'
            }
            if (val.CURRENT_WEEK == 0) {
                obj.label = 'Last Week'
                obj.backgroundColor = '#a1c490'
            }
            obj.borderWidth = 2,
                obj.data = [];
            angular.forEach($scope.dayOfWeekNamesShort, function (Weekval) {
                var CurrentLastWeek = data.filter(function (x) { return x.WEEKDAY_NO == Weekval.ID && x.CURRENT_WEEK == val.CURRENT_WEEK });
                if (CurrentLastWeek.length > 0) {
                    obj.data.push(CurrentLastWeek[0].TRANSACTIONS);
                }
                else {
                    obj.data.push(0);
                }
            })
            $scope.DailyTransaction.push(obj);
        });
        var options = {
            legend: {
                position: 'top',
                display: true
            },
            tooltips: {
                mode: 'index'
            },
            scales: {
                yAxes: [{
                    gridLines: {
                        display: false
                    }
                }]
            }

        };

        document.getElementById("DailyTransactionIds").innerHTML = '<canvas id="DailyTransaction"></canvas>';
        var ctx = document.getElementById('DailyTransaction').getContext('2d');

        if (myChart) {
            myChart.destroy();
        }
        myChart = new Chart(ctx, {
            //type: 'horizontalBar',
            type: 'bar',
            data: {
                labels: $scope.WeekNames,
                datasets: $scope.DailyTransaction
            },
            options: options
        });


    };
    $scope.DailyDiscount = function (data) {
        $scope.DAILY_DISCOUNT_LIST = data;
        $scope.datasets2 = [];
        // var UNI_WEEK = $filter('unique')(data, 'CURRENT_WEEK');
        var i = 0;
        //  angular.forEach(UNI_WEEK, function (value) {
        datasetobj = new Object();
        datasetobj.label = 'Daily Discount/Comps';
        var dateaobj = [];
        //   var Qut = UNI_WEEK.filter(function (x) { return x.WEEKDAY_NO == value.ID });
        angular.forEach($scope.dayOfWeekNamesShort, function (line) {
            var Data = data.filter(function (x) { return line.ID == x.WEEKDAY_NO })
            if (Data.length > 0) {
                dateaobj.push(parseFloat((Data[0].DISCOUNT)));
            }
            else {
                dateaobj.push(0);
            }
        });
        datasetobj.fill = false,
            datasetobj.borderColor = colors[i];
        datasetobj.data = dateaobj;
        datasetobj.borderColor = colors[i];
        datasetobj.tension = 0.1
        $scope.datasets2.push(datasetobj);
        i++;
        // })
        if (myLineChart) {
            myLineChart.destroy();
        }

        document.getElementById("DailyDiscountChartids").innerHTML = '<canvas id="DailyDiscountChart"></canvas>';
        var ctx = document.getElementById("DailyDiscountChart").getContext('2d');
        if (myChart) {
            myChart.destroy();
        }
        var ctx = document.getElementById("DailyDiscountChart").getContext('2d');
        var options = {
            legend: {
                position: 'right',
                display: true
            },
            tooltips: {
                mode: 'index'
            },
        };

        var data = {
            labels: $scope.WeekNames,
            datasets: $scope.datasets2
        };
        var myChart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: options
        });

    };
    $scope.YTD_GROSS_SALES = function (data) {
        $scope.YTD_GROSS_SALES_LIST = data;
        $scope.totaldata_Buyer = 0;
        $scope.data_Buyer = [];
        $scope.labels_Buyer = [];
        $scope.Buyercolor = [];
        $scope.options = [];
        $scope.BUYER_RECOMMENDED_SAVINGS_ALL = [];
        $scope.BUYER_RECOMMENDED_SAVINGS = [];
        if (data.length > 0) {
            angular.forEach(data, function (value) {
                $scope.data_Buyer.push(value.GROSS_AMOUNT);
                $scope.labels_Buyer.push(value.PRODUCT_TYPE);
            });
            $scope.options = {
                //onClick: BY_BUYER,
                legend: {
                    position: 'right',
                    display: false
                },
                tooltips: {
                    callbacks: {
                        label: function (tooltipItem, data) {
                            var label = data.datasets[tooltipItem.datasetIndex].label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += tooltipItem.xLabel;
                            return label + " " + $scope.CURRENCY;
                        }
                    }
                },
                //scales: {
                //    xAxes: [
                //        {
                //            //ticks: {
                //            //    callback: function (label, index, labels) {
                //            //        return label + " " + $scope.SPEND_SUP_LIST[0].CURRENCY_CODE;
                //            //    }
                //            //},
                //            scaleLabel: {
                //                display: true,
                //            }
                //        }
                //    ],
                //}
            };
        }
        Chart.defaults.global.defaultFontSize = 9;
        document.getElementById("YTDGROSSSALES").innerHTML = '<canvas id="chartContainer"></canvas>';
        var ctx = document.getElementById("chartContainer").getContext('2d');
        if (myChart) {
            myChart.destroy();
        }
        var myChart = new Chart(ctx, {
            type: 'horizontalBar',
            data: {
                labels: $scope.labels_Buyer,
                datasets: [
                    {
                        backgroundColor: $scope.colours_YTDGrossSales,
                        data: $scope.data_Buyer
                    }
                ]
            },
            options: $scope.options,
        });
    };
    $scope.NetSalesChart_12 = function (data) {
        $scope.NETSALESCHART_12_LIST = data;
        $scope.data_NetSales = [];
        $scope.labels_NetSales = [];
        $scope.optionsNetSales = [];
        $scope.textlabelsWeek = [];
        var len = 12;
        for (var j = len; j > -1; j--) {
            if (j == 0) {

            }
            else {
                var label = {
                    week: "Week " + j,
                    ID: j,
                }
                $scope.textlabelsWeek.push(label);
            }
        }
        angular.forEach($scope.textlabelsWeek, function (week) {
            var value = data.filter(function (x) { return x.WEEK == week.ID });
            if (value.length > 0) {
                $scope.data_NetSales.push(value[0].GROSS_AMOUNT);
                $scope.labels_NetSales.push("Week " + value[0].WEEK);
            }
        });
        $scope.optionsNetSales = {
            //onClick: BY_BUYER,
            legend: {
                position: 'top',
                display: false
            },
            tooltips: {
                callbacks: {
                    label: function (tooltipItem, data) {
                        var label = data.datasets[tooltipItem.datasetIndex].label || '';
                        if (label) {
                            label += ': ';
                        }
                        label += tooltipItem.xLabel;
                        return label + " " + $scope.CURRENCY;
                    }
                }
            },
            scales: {
                xAxes: [
                    {
                        //ticks: {
                        //    callback: function (label, index, labels) {
                        //        return label + " " + $scope.SPEND_SUP_LIST[0].CURRENCY_CODE;
                        //    }
                        //},
                        scaleLabel: {
                            display: true,
                        }
                    }
                ],
            }
        };
        Chart.defaults.global.defaultFontSize = 9;
        document.getElementById("NetSales_bar_chart").innerHTML = '<canvas id="NetSalesContainer"></canvas>';
        var ctx = document.getElementById("NetSalesContainer").getContext('2d');
        if (myChart) {
            myChart.destroy();
        }
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: $scope.labels_NetSales,
                datasets: [
                    {
                        backgroundColor: $scope.colours_NetSales,
                        data: $scope.data_NetSales
                    }
                ]
            },
            options: $scope.optionsNetSales,
        });


    };

    $scope.GET_DAILY_FLASH_REPORT_LIGHTSPEED = function () {

        var ReportModelObj = new Object();
        ReportModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        ReportModelObj.DATE = $scope.LightSpeedSearch.START_DATE;
        PrcCommMethods.REPORT_API(ReportModelObj, 'GET_DAILY_FLASH_REPORT_LIGHTSPEED').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.DAILY_FLASH_REPORT_LIGHTSPEED = data.data;
                $scope.CURRENCY = "£";
                $scope.PRODUCT_LIST_ALL = angular.copy(data.data.Table1);
                $scope.PRODUCT_LIST = $filter('unique')(data.data.Table1, 'PRODUCT_TYPE');
                $scope.PRODUCT_LIST_COPY = angular.copy($scope.PRODUCT_LIST);
                $scope.PRODUCT_LIST.push({ PRODUCT_TYPE: "Total Gross Before Discount", ID: -1, COLOR: "text-blue" });
                $scope.PRODUCT_LIST.push({ PRODUCT_TYPE: "Total Discount", ID: -2, COLOR: "text-blue" });
                $scope.PRODUCT_LIST.push({ PRODUCT_TYPE: "Total Gross Sales", ID: -3, COLOR: "text-success" });
                $scope.PRODUCT_LIST.push({ PRODUCT_TYPE: "Total Transactions", ID: -4, COLOR: "" });
                $scope.PRODUCT_LIST.push({ PRODUCT_TYPE: "Spend Per Transaction", ID: -5, COLOR: "" });
                $scope.PRODUCT_LIST.push({ PRODUCT_TYPE: "VAT", ID: -6 });
                GROSS_SALES($scope.PRODUCT_LIST_COPY);
                $scope.DailyDiscount(data.data.Table2);
                $scope.SpendPerTransaction(data.data.Table6);
                $scope.YTD_GROSS_SALES(data.data.Table8);
                $scope.NetSalesChart_12(data.data.Table9);
                $scope.DAILY_TRANSACTION(data.data.Table7);
                $scope.DAILY_GROSS(data.data.Table4);
                $scope.WEEK_TO_DATE_GROSS_SALES(data.data.Table5);
            }
        });
    };
    $scope.nginitusercalendarlist = function (val) {
        //   angular.forEach($scope.USERS_CALENDAR_LIST, function (val) {
        val.dayOfWeekNamesShort = angular.copy($scope.dayOfWeekNamesShort)
        //var Date1 = new Date(val.START_DATE);
        //var Date2 = new Date(val.END_DATE);
        //val.Leavestartday = Date1.getDate();
        //val.Leaveendday = Date2.getDate();
        //val.count = 0;
        //val.IS_CURRENT = false;
        //});
    };
    $scope.nginitdayOfWeekNamesShort = function (week, index, val) {
        week.LIGHTSPEED = [];
        var LIGHTSPEED = $scope.DAILY_FLASH_REPORT_LIGHTSPEED.Table1.filter(function (x) { return x.WEEKDAY_NO == week.ID && x.PRODUCT_TYPE_ID == val.PRODUCT_TYPE_ID });
        week.VAR_GROSS_BEFORE_DISCOUNT = 0;
        if (LIGHTSPEED.length > 0) {
            angular.forEach(LIGHTSPEED, function (LS) {
                week.VAR_GROSS_BEFORE_DISCOUNT += parseFloat(LS.GROSS_BEFORE_DISCOUNT);
            });
        }
        if (val.ID == -1) {
            var LIGHTSPEED = $scope.DAILY_FLASH_REPORT_LIGHTSPEED.Table1.filter(function (x) { return x.WEEKDAY_NO == week.ID });
            week.VAR_GROSS_BEFORE_DISCOUNT = 0;
            week.COLOR = "text-blue";
            if (LIGHTSPEED.length > 0) {
                angular.forEach(LIGHTSPEED, function (LS) {
                    week.VAR_GROSS_BEFORE_DISCOUNT += parseFloat(LS.GROSS_BEFORE_DISCOUNT);
                });
            }
        }
        if (val.ID == -2) {
            var LIGHTSPEED = $scope.DAILY_FLASH_REPORT_LIGHTSPEED.Table2.filter(function (x) { return x.WEEKDAY_NO == week.ID });
            week.VAR_GROSS_BEFORE_DISCOUNT = 0;
            week.COLOR = "text-blue";
            if (LIGHTSPEED.length > 0) {
                angular.forEach(LIGHTSPEED, function (LS) {
                    week.VAR_GROSS_BEFORE_DISCOUNT += parseFloat(LS.DISCOUNT);
                });
            }
        }
        if (val.ID == -3) {
            var BEFORE_DISCOUNT = $scope.PRODUCT_LIST.filter(function (x) { return x.ID == -1 });
            var TOTAL_DISCOUNT = $scope.PRODUCT_LIST.filter(function (x) { return x.ID == -2 });
            week.VAR_GROSS_BEFORE_DISCOUNT = 0;
            week.COLOR = "text-success";
            if (BEFORE_DISCOUNT.length > 0) {
                angular.forEach(BEFORE_DISCOUNT, function (BS) {
                    var LT = BS.dayOfWeekNamesShort.filter(function (x) { return x.ID == week.ID });
                    var TD = TOTAL_DISCOUNT[0].dayOfWeekNamesShort.filter(function (x) { return x.ID == week.ID });
                    week.VAR_GROSS_BEFORE_DISCOUNT += parseFloat(LT[0].VAR_GROSS_BEFORE_DISCOUNT - TD[0].VAR_GROSS_BEFORE_DISCOUNT);

                });
            }
        }
        if (val.ID == -4) {
            var LIGHTSPEED = $scope.DAILY_FLASH_REPORT_LIGHTSPEED.Table2.filter(function (x) { return x.WEEKDAY_NO == week.ID });
            week.VAR_GROSS_BEFORE_DISCOUNT = 0;
            week.COLOR = "text-blue";
            if (LIGHTSPEED.length > 0) {
                angular.forEach(LIGHTSPEED, function (LS) {
                    week.VAR_GROSS_BEFORE_DISCOUNT += parseFloat(LS.TRANSACTIONS);
                });
            }
        }
        if (val.ID == -5) {
            var CURRENT_WEEK = $scope.DAILY_FLASH_REPORT_LIGHTSPEED.Table6.filter(function (x) { return x.CURRENT_WEEK == 1 });
            if (CURRENT_WEEK.length > 0) {
                var LIGHTSPEED = CURRENT_WEEK.filter(function (x) { return x.WEEKDAY_NO == week.ID });
            }
            week.VAR_GROSS_BEFORE_DISCOUNT = 0;
            week.COLOR = "text-blue";
            if (LIGHTSPEED.length > 0) {
                angular.forEach(LIGHTSPEED, function (LS) {
                    week.VAR_GROSS_BEFORE_DISCOUNT += parseFloat(LS.AMOUNT_PER_TRANSACTION);
                });
            }
        }
        if (val.ID == -6) {
            var LIGHTSPEED = $scope.DAILY_FLASH_REPORT_LIGHTSPEED.Table3.filter(function (x) { return x.WEEKDAY_NO == week.ID });
            week.VAR_GROSS_BEFORE_DISCOUNT = 0;
            week.VAR_TAXRATEPERCENTAGE = 0;
            week.COLOR = "";
            if (LIGHTSPEED.length > 0) {
                angular.forEach(LIGHTSPEED, function (LS) {
                    week.VAR_GROSS_BEFORE_DISCOUNT += parseFloat(LS.TAX_AMOUNT);
                    week.VAR_TAXRATEPERCENTAGE += parseFloat(LS.TAXRATEPERCENTAGE);
                });
            }
        }
    };

});
app.controller('ReportsController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $localStorage) {
    $scope.$parent.TabActive(7);
    $scope.$parent.dateinputOpenDate();
    $scope.REPORT_DATA_LIST = [];
    $scope.ROTA_STATUS_FLAG = [];
    $scope.CASHUP_CONSOLIDATED_SALES_REPORT_LIST = [];
    $scope.CASHUP_PAYMENT_DETAILS_REPORT_DATA_LIST = [];
    $scope.CASHUP_VOUCHER_REPORT = [];
    $scope.ROTA_STATUS_FLAG = [{ STATUS_ID: null, 'DISPLAY_TEXT': "ALL" }, { STATUS_ID: 1, 'DISPLAY_TEXT': "APPROVED" }, { STATUS_ID: 2, 'DISPLAY_TEXT': "UNAPPROVED" }];
    $scope.REPORT_NAME = null;
    $scope.JSON_COLUMN_NAME = null;
    $scope.IS_ALL_SITE_CHECK = true;
    $scope.ReportSearch = {
        START_DATE: null,
        END_DATE: null, STATUS_ID: null,
        LOCATION_ID: null,
        ROTA_START_DATE: null,
        ROTA_END_DATE: null, BRANCH_ID: null,
        SECTION_ID: null, STATUS_ID: 0
    };
    var RPTModelObj;
    $scope.REPORT_LIST = [];
    $scope.EXCEL_REPORT_DATA_LIST = [];
    $scope.REPORT_DATA_LIST_CSV = [];
    $scope.GenerateButtonText = 'Generate';
    $scope.LOADER_ICON = false;
    $scope.ReportSearch = {
        REPORT_START_DATE: null,
        REPORT_END_DATE: null,
        BRANCH_ID: null
    };
    function reportrange(start, end) {
        $scope.ReportSearch.START_DATE = start.format($scope.$parent.Datelocaleformat.format);
        $scope.ReportSearch.END_DATE = end.format($scope.$parent.Datelocaleformat.format);
        $('#reportrange span').html(start.format($scope.$parent.Datelocaleformat.format) + ' - ' + end.format($scope.$parent.Datelocaleformat.format));
    };
    $scope.RESET_DATE_PICKER = function () {
        $(function () {
            start = moment().startOf('month');//moment().startOf('isoWeek');//moment().subtract(6, 'days');
            end = moment().endOf('month');;//moment().subtract(0, 'days');
            //"startDate": moment().startOf('isoWeek'),
            //"endDate": moment(),
            $scope.$parent.SetUpDateRangeMultiDatePicker('reportrange', start, end, reportrange);
            $('#reportrange span').html(start.format($scope.$parent.Datelocaleformat.format) + ' - ' + end.format($scope.$parent.Datelocaleformat.format));
        });
    }
    $scope.RESET_DATE_PICKER();
    $scope.HR_GET_USER_REPORT_LIST = function () {
        RPTModelObj = new Object();
        RPTModelObj.ENTITY_ID = parseInt($cookies.get('ENTITY_ID'));
        RPTModelObj.USER_ID = parseInt($cookies.get('USERID'));
        RPTModelObj.MODULE_ID = parseInt($cookies.get('MODULE_ID'));
        if (window.location.href.toLowerCase().indexOf("report/reportindex") != -1) {
            RPTModelObj.MODULE_ID = 0;
        }
        PrcCommMethods.HR_API(RPTModelObj, 'GET_USER_REPORT_LIST').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.REPORT_LIST = data.data.Table;
            }
        });

    };
    $scope.HR_GET_USER_REPORT_LIST();
    $scope.DOWNLOAD_SHOW_POP = function (RPTID) {
        //alert(RPTID)
        $scope.REPORT_DATA_LIST = [];
        $scope.EXCEL_REPORT_DATA_LIST = [];
        //$scope.ReportSearch.START_DATE = null;
        //$scope.ReportSearch.END_DATE = null;
        $scope.JSON_COLUMN_NAME = null;

        if (RPTID == 1) {
            $scope.REPORT_NAME = 'Employee Headcount Report';
            $scope.RPTID = RPTID;
            $scope.HR_EMPLOYEE_REPORT();
        }
        if (RPTID == 2) {
            $scope.REPORT_DATA_LIST_CSV = [];
            $scope.REPORT_NAME = 'Leavers Report'; $('#Report_Date').modal('show');
            $scope.RESET(RPTID);
        }
        if (RPTID == 3) {
            $scope.REPORT_DATA_LIST_CSV = [];
            $scope.REPORT_NAME = 'Starter Report'; $('#Report_Date').modal('show');
        }
        if (RPTID == 4) {
            $scope.REPORT_NAME = 'EMPLOYEE COMPENSATION REPORT';
            $scope.RPTID = RPTID;
            $scope.HR_EMPLOYEE_COMPENSATION_REPORT();
        }
        if (RPTID == 5) {
            $scope.REPORT_NAME = 'EMPLOYEE ABSENCE REPORT'; $('#Report_Date').modal('show');
            $scope.RESET();
        }
        if (RPTID == 6) {
            $scope.REPORT_NAME = 'EMPLOYEE LEAVE ENTITLEMENT REPORT'; $('#Report_Date').modal('show');
            $scope.RESET();
        }
        if (RPTID == 7) {
            $scope.REPORT_NAME = 'ROTA SHIFT BREAKDOWN REPORT'; $('#Report_Date').modal('show');
            $scope.RESET(RPTID);
        }
        if (RPTID == 8) {
            $scope.REPORT_NAME = 'Leavers Report'; $('#CASHUP_REPORT').modal('show');
        }
        if (RPTID == 9) {
            $scope.REPORT_NAME = 'ROTA SHIFT DURATION REPORT'; $('#Report_Date').modal('show');
            $scope.RESET(RPTID);
        }
        if (RPTID == 10) {
            $scope.REPORT_NAME = 'Leavers Report'; $('#CASHUP_REPORT').modal('show');
        }
        if (RPTID == 11) {
            $scope.REPORT_NAME = 'Leavers Report'; $('#CASHUP_REPORT').modal('show');
        }
        if (RPTID == 12) {
            $scope.REPORT_NAME = 'Total Float Report'; $('#CASHUP_REPORT').modal('show');
        }
        if (RPTID == 13) {
            $scope.REPORT_NAME = 'Total Cash Report'; $('#CASHUP_REPORT').modal('show');
        }
        if (RPTID == 14 || RPTID == 15) {
            RPTID == 14 ? $scope.REPORT_NAME = 'Complimentary Report' : $scope.REPORT_NAME = 'Cashup Vouchers Report';
            $('#CASHUP_REPORT').modal('show');
        }
        if (RPTID == 16) {
            $scope.REPORT_NAME = 'MARKETMAN COGS REPORT'; $('#Report_Date').modal('show');
            $scope.RESET();
        }
        if (RPTID == 17) {
            $scope.REPORT_NAME = 'Marketman Waste Event Report'; $('#CASHUP_REPORT').modal('show');
        }
        if (RPTID == 18) {
            $scope.REPORT_NAME = 'Marketman Menu Profitability Report'; $('#CASHUP_REPORT').modal('show');
        }
        if (RPTID == 19) {
            $scope.IS_CUSTOME_DATE_SELECTED = 1;
            $scope.REPORT_NAME = 'Daily Sales Report';
            $('#CASHUP_REPORT').modal('show');
        }
        if (RPTID == 20) {
            $scope.IS_CUSTOME_DATE_SELECTED = 1;
            $scope.REPORT_NAME = 'Petty Cash Report';
            $('#CASHUP_REPORT').modal('show');
        }
        if (RPTID == 21) {
            $scope.IS_CUSTOME_DATE_SELECTED = 1;
            $scope.REPORT_NAME = 'Deposits Report';
            $('#CASHUP_REPORT').modal('show');
        }
        if (RPTID == 22) {
            $scope.IS_CUSTOME_DATE_SELECTED = 1;
            $scope.REPORT_NAME = 'Account Customer Report';
            $('#CASHUP_REPORT').modal('show');
        }
        if (RPTID == 23) {
            $scope.COMMON_CASHUP_REPORT_DATA_FOR_HTML = [];
            $scope.COMMON_JSON_COLUMN_NAME_FOR_HTML = [];
            $scope.IS_CUSTOME_DATE_SELECTED = 1;
            $scope.REPORT_NAME = 'Account Customer Report';
            $('#CASHUP_REPORT').modal('show');
        }
        if (RPTID == 24) {
            $scope.REPORT_NAME = 'HR Employe Compensation Change Report'; $('#Report_Date').modal('show');
            $scope.RESET(RPTID);
        }
        if (RPTID == 25) {
            $scope.REPORT_NAME = 'HR Right To Work Document Report'; $('#Report_Date').modal('show');
        }
        if (RPTID == 26) {
            $scope.REPORT_NAME = 'ROTA SHIFT NO SHOW REPORT'; $('#Report_Date').modal('show');
            $scope.RESET(RPTID);
        }
        if (RPTID == 27) {
            $scope.IS_CUSTOME_DATE_SELECTED = 1;
            $scope.REPORT_NAME = 'Weekly Cashup Report By Session';
            $('#CASHUP_REPORT').modal('show');
        }
        if (RPTID == 28) {
            $scope.IS_CUSTOME_DATE_SELECTED = 1;
            $scope.REPORT_NAME = 'Weekly Cashup Report By Session Category';
            $('#CASHUP_REPORT').modal('show');
        }
        if (RPTID == 29) {
            $scope.REPORT_NAME = 'EPOS Sales extract'; $('#CASHUP_REPORT').modal('show');
        }
        if (RPTID == 30) {
            $scope.REPORT_NAME = 'Shift Breakdown by Wage'; $('#Report_Date').modal('show');
            $scope.RESET(RPTID);
        }
        if (RPTID == 31) {
            $scope.REPORT_NAME = 'PO pending approval report'; $('#Report_Date').modal('show');
            $scope.RESET(RPTID);
        }
        if (RPTID == 32) {
            $scope.REPORT_NAME = 'Invoice pending approval report'; $('#Report_Date').modal('show');
            $scope.RESET(RPTID);
        }
        if (RPTID == 33) {
            $scope.REPORT_NAME = 'Approved PO report'; $('#Report_Date').modal('show');
            $scope.RESET(RPTID);
        }
        if (RPTID == 34) {
            $scope.REPORT_NAME = 'All purchase request report'; $('#Report_Date').modal('show');
            $scope.RESET(RPTID);
        }
        if (RPTID == 35) {
            $scope.REPORT_NAME = 'All PO report'; $('#Report_Date').modal('show');
            $scope.RESET(RPTID);
        }
        if (RPTID == 36) {
            $scope.IS_CUSTOME_DATE_SELECTED = 1;
            $scope.REPORT_NAME = 'Revenue Summary Report';
            $('#CASHUP_REPORT').modal('show');
        }
        if (RPTID == 37) {
            $scope.IS_CUSTOME_DATE_SELECTED = 1;
            $scope.REPORT_NAME = 'EPOS Card Payments Reports';
            $('#CASHUP_REPORT').modal('show');
        }
        if (RPTID == 38) {
            $scope.REPORT_NAME = 'Sales Performance Reports';
            $('#Report_Date').modal('show');
            $scope.RESET(RPTID);
        }
        if (RPTID == 52) {
            $scope.REPORT_NAME = 'Cash Tips Reports';
            $('#CASHUP_REPORT').modal('show');
            $scope.RESET(RPTID);
        }
        if (RPTID == 54) {
            $scope.REPORT_NAME = 'Budget Consumption Reports';
            $('#Report_Date').modal('show');
            $scope.RESET(RPTID);
        } if (RPTID == 55) {
            $scope.REPORT_NAME = 'PO Tracking Reports';
            $('#Report_Date').modal('show');
            $scope.RESET(RPTID);
        }
        if (RPTID == 57) {
            $scope.REPORT_NAME = 'Approved Bills Report';
            $('#Report_Date').modal('show');
            $scope.RESET(RPTID);
        }
        $scope.RPTID = RPTID;
    };
    $scope.dateinputOpenDate = function () {
        $(document).ready(function () {
            var date_inputs = document.getElementsByClassName("dateinputOpenDate") //our date input has the name "date"
            if (date_inputs.length > 0) {
                for (var i = 0; i < date_inputs.length; i++) {
                    var date_input = $('input[name="' + date_inputs[i].name + '"]'); //our date input has the name "date"
                    var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
                    // var date = new Date();
                    var options = {
                        todayBtn: "linked",
                        daysOfWeekHighlighted: "0,6",
                        autoclose: true,
                        todayHighlight: true,
                        format: 'M dd, yyyy',
                        clearBtn: true,
                        closeBtn: true,// close button visible
                        //  startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate())
                    };
                    date_input.datepicker(options);
                }
            }
        });
    };
    $scope.HR_EMPLOYEE_REPORT = function () {

        $scope.enable = "false";
        $scope.LOADER_ICON = true;
        if ($scope.RPTID == 2 || $scope.RPTID == 3) {
            var IS_VALID_CNT = 0;
            if ($scope.ReportSearch.END_DATE == undefined || $scope.ReportSearch.END_DATE == null || $scope.ReportSearch.END_DATE == '' || $scope.ReportSearch.START_DATE == undefined || $scope.ReportSearch.START_DATE == null || $scope.ReportSearch.START_DATE == '') {
                $scope.$parent.ShowAlert("Error", "Please select Start and End Date", 3000);
                $scope.enable = "true";
                $scope.LOADER_ICON = false;
                IS_VALID_CNT = 1;
            }
            else if (new Date($scope.ReportSearch.END_DATE) < new Date($scope.ReportSearch.START_DATE)) {
                $scope.$parent.ShowAlert("Error", "End Date should be greater than start date", 3000);
                $scope.enable = "true";
                $scope.LOADER_ICON = false;
                IS_VALID_CNT = 2;
            }
            if (IS_VALID_CNT == 0) {
                RPTModelObj = new Object();
                RPTModelObj.ENTITY_ID = parseInt($cookies.get('ENTITY_ID'));
                RPTModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
                RPTModelObj.START_DATE = $scope.ReportSearch.START_DATE;
                RPTModelObj.END_DATE = $scope.ReportSearch.END_DATE;
                RPTModelObj.REPORT_ID = $scope.RPTID;
                RPTModelObj.USER_ID = parseInt($cookies.get("USERID"));
                RPTModelObj.EMP_PRS_ID = 0;
                RPTModelObj.BRANCH_ID = $scope.ReportSearch.BRANCH_ID == undefined || $scope.ReportSearch.BRANCH_ID == null || $scope.ReportSearch.BRANCH_ID == "" ? 0 : $scope.ReportSearch.BRANCH_ID;
                PrcCommMethods.HR_API(RPTModelObj, 'HR_EMPLOYEE_REPORT').then(function (data) {
                    if (data.data.Table.length > 0) {
                        $scope.REPORT_DATA_LIST = data.data.Table;
                        $scope.JSON_COLUMN_NAME = Object.keys(data.data.Table[0]);
                        angular.forEach($scope.REPORT_DATA_LIST, function (item) {
                            $scope.SELECTED_DATA = [];
                            for (var i = 0; i < $scope.JSON_COLUMN_NAME.length; i++) {
                                if ($scope.JSON_COLUMN_NAME[i] == 'Termination Date' || $scope.JSON_COLUMN_NAME[i] == 'Terminated On') {
                                    item[$scope.JSON_COLUMN_NAME[i]] == null ? item[$scope.JSON_COLUMN_NAME[i]] = "" : item[$scope.JSON_COLUMN_NAME[i]] = moment(item[$scope.JSON_COLUMN_NAME[i]]).format('DD/MM/YYYY');
                                }
                                else {
                                    item[$scope.JSON_COLUMN_NAME[i]] == null ? item[$scope.JSON_COLUMN_NAME[i]] = "" : item[$scope.JSON_COLUMN_NAME[i]] = item[$scope.JSON_COLUMN_NAME[i]];
                                }
                                item["Search By Start Date"] = moment($scope.ReportSearch.START_DATE).format('DD/MM/YYYY');
                                item["Search By End Date"] = moment($scope.ReportSearch.END_DATE).format('DD/MM/YYYY');
                            }
                            $scope.EXCEL_REPORT_DATA_LIST.push(item);
                        });
                        $scope.DOWNLOAD_EXCEL();
                        //$scope.JSON_COLUMN_NAME = Object.keys(data.data.Table[0]);
                        //$scope.REPORT_DATA_LIST_CSV = data.data.Table;
                    }
                    else {
                        $scope.$parent.ShowAlert("Success", "No Records Found.", 3000);
                    }
                    $scope.enable = "true";
                    $scope.LOADER_ICON = false;
                });
            }
        }
        if ($scope.RPTID == 1) {
            RPTModelObj = new Object();
            RPTModelObj.ENTITY_ID = parseInt($cookies.get('ENTITY_ID'));
            RPTModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
            RPTModelObj.START_DATE = null;
            RPTModelObj.END_DATE = null;
            RPTModelObj.REPORT_ID = $scope.RPTID;
            RPTModelObj.USER_ID = parseInt($cookies.get("USERID"));
            RPTModelObj.EMP_PRS_ID = 0;
            RPTModelObj.BRANCH_ID = $scope.ReportSearch.BRANCH_ID == undefined || $scope.ReportSearch.BRANCH_ID == null || $scope.ReportSearch.BRANCH_ID == "" ? 0 : $scope.ReportSearch.BRANCH_ID;
            PrcCommMethods.HR_API(RPTModelObj, 'HR_EMPLOYEE_REPORT').then(function (data) {
                if (data.data == null) {
                    $scope.$parent.ShowAlert("Attention", "No Records Found.", 3000);
                }
                else if (data.data.Table.length > 0) {
                    $scope.REPORT_DATA_LIST = data.data.Table;
                    $scope.JSON_COLUMN_NAME = Object.keys(data.data.Table[0]);
                    angular.forEach($scope.REPORT_DATA_LIST, function (item) {
                        $scope.SELECTED_DATA = [];
                        for (var i = 0; i < $scope.JSON_COLUMN_NAME.length; i++) {
                            item[$scope.JSON_COLUMN_NAME[i]] == null ? item[$scope.JSON_COLUMN_NAME[i]] = "" : item[$scope.JSON_COLUMN_NAME[i]] = item[$scope.JSON_COLUMN_NAME[i]];
                            item["As Of Date"] = moment(new Date()).format('DD/MM/YYYY');
                        }
                        $scope.EXCEL_REPORT_DATA_LIST.push(item);
                    });
                    //$scope.EXCEL_REPORT_DATA_LIST = data.data.Table;
                    $scope.DOWNLOAD_EXCEL();
                }
                else {
                    $scope.$parent.ShowAlert("Success", "No Records Found.", 3000);
                }
            });
            $scope.enable = "true";
            $scope.LOADER_ICON = false;
        }
    };
    $scope.HR_EMPLOYEE_COMPENSATION_REPORT = function () {
        $scope.enable = "false";
        $scope.LOADER_ICON = true;
        RPTModelObj = new Object();
        RPTModelObj.ENTITY_ID = parseInt($cookies.get('ENTITY_ID'));
        RPTModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        RPTModelObj.USER_ID = parseInt($cookies.get("USERID"));
        RPTModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
        RPTModelObj.SELF_98 = $scope.$parent.CheckSubModuleAccess(98) ? 1 : 0;
        RPTModelObj.BELOW_99 = $scope.$parent.CheckSubModuleAccess(99) ? 1 : 0;
        RPTModelObj.ALL_100 = $scope.$parent.CheckSubModuleAccess(100) ? 1 : 0;
        RPTModelObj.ADMIN_FLAG = $localStorage.USER_PRIVILEGE != undefined ? $scope.$parent.CheckSubModuleAccess(48) ? 1 : 0 : 0;
        PrcCommMethods.REPORT_API(RPTModelObj, 'HR_EMPLOYEE_COMPENSATION_REPORT').then(function (data) {
            //if (data.data.length != undefined) {
            if (data.data.Table.length > 0) {
                $scope.REPORT_DATA_LIST = data.data.Table;
                $scope.JSON_COLUMN_NAME = Object.keys(data.data.Table[0]);
                angular.forEach($scope.REPORT_DATA_LIST, function (item) {
                    $scope.SELECTED_DATA = [];
                    for (var i = 0; i < $scope.JSON_COLUMN_NAME.length; i++) {
                        item[$scope.JSON_COLUMN_NAME[i]] == null ? item[$scope.JSON_COLUMN_NAME[i]] = "" : item[$scope.JSON_COLUMN_NAME[i]] = item[$scope.JSON_COLUMN_NAME[i]];
                        item["As Of Date"] = moment(new Date()).format('DD/MM/YYYY');
                    }
                    $scope.EXCEL_REPORT_DATA_LIST.push(item);
                });
                $scope.DOWNLOAD_EXCEL();
            }
            else {
                $scope.$parent.ShowAlert("Attention", "No Records Found.", 3000);
            }
            //}
            //else {
            //    $scope.$parent.ShowAlert("Success", "No Records Found.", 3000);
            //}
            $scope.enable = "true";
            $scope.LOADER_ICON = false;
        });

    };
    $scope.COMMON_REPORT_GENERATE_FILE = function (RPTID) {

        switch (RPTID) {
            case 5:
                $scope.HR_EMPLOYEE_ABSENCE_REPORT($scope.RPTID);
                break;
            case 6:
                $scope.HR_EMPLOYEE_LEAVE_ENTITLEMENT_REPORT($scope.RPTID);
                break;
            case 7:
                $scope.ROTA_SHIFT_BREAKDOWN_REPORT($scope.RPTID);
                break;
            case 8:
                $scope.GET_WEEKLY_CASHUP_REPORT($scope.RPTID);
                break;
            case 9:
                $scope.ROTA_SHIFT_DURATION_REPORT($scope.RPTID);
                break;
            case 10:
                $scope.CASHUP_CONSOLIDATED_SALES_REPORT($scope.RPTID);
                break;
            case 11:
                $scope.CASHUP_PAYMENT_DETAILS_REPORT($scope.RPTID);
                break;
            case 12:
                $scope.CASHUP_FLOAT_CASH_REPORT($scope.RPTID);
                break;
            case 13:
                $scope.CASHUP_FLOAT_CASH_REPORT($scope.RPTID);
                break;
            case 14:
                $scope.CASHUP_COMP_REPORT($scope.RPTID);
                break;
            case 15:
                $scope.CASHUP_VOUCHER_REPORT($scope.RPTID);
                break;
            case 16:
                $scope.MRKTMN_COGS_REPORT($scope.RPTID);
                break;
            case 17:
                $scope.MRKTMN_WASTE_EVENT_REPORT($scope.RPTID);
                break;
            case 18:
                $scope.MRKTMN_MENU_PROFITABILITY_REPORT($scope.RPTID);
                break;
            case 19:
                $scope.GET_DAILY_SALES($scope.RPTID);
                break;
            case 20:
                $scope.CASHUP_PETTY_CASH_REPORT($scope.RPTID);
                break;
            case 21:
                $scope.CASHUP_DEPOSIT_REPORT($scope.RPTID);
                break;
            case 22:
                $scope.CASHUP_ACCOUNT_CUSTOMER_REPORT($scope.RPTID);
                break;
            case 23:
                $scope.GET_CASH_BANKING_REPORT($scope.RPTID);
                break;
            case 24:
                $scope.HR_EMPLOYEE_COMPENSATION_CHANGE_REPORT($scope.RPTID);
                break;
            case 25:
                $scope.HR_RIGHT_TO_WORK_DOCUMENTS_REPORT($scope.RPTID);
                break;
            case 26:
                $scope.ROTA_SHIFT_NO_SHOW_REPORT($scope.RPTID);
                break;
            case 27:
                $scope.GET_WEEKLY_CASHUP_REPORT_BY_SESSION_CATEGORY($scope.RPTID);
                break;
            case 28:
                $scope.GET_WEEKLY_CASHUP_REPORT_BY_SESSION_CATEGORY($scope.RPTID);
                break;
            case 29:
                $scope.GET_EPOS_SALES_REPORT($scope.RPTID);
                break;
            case 30:
                $scope.ROTA_SHIFT_BREAKDOWN_BY_SHIFT_TYPE_REPORT($scope.RPTID);
                break;
            case 31:
                $scope.PO_PENDING_APPROVAL_REPORT($scope.RPTID);
                break;
            case 32:
                $scope.INVOICE_PENDING_APPROVAL_REPORT($scope.RPTID);
                break;
            case 33:
                $scope.APPROVED_PO_REPORT($scope.RPTID);
                break;
            case 34:
                $scope.ALL_PURCHASE_REQUEST_REPORT($scope.RPTID);
                break;
            case 35:
                $scope.ALL_PO_REPORT($scope.RPTID);
                break;
            case 36:
                $scope.GET_REVENUE_SUMMARY($scope.RPTID);
                break;
            case 37:
                $scope.GET_EPOS_CARD_PAYMENTS_REPORT($scope.RPTID);
                break;
            case 38:
                $scope.GET_SALES_PERFORMANCE($scope.RPTID);
                break;
            case 52:
                $scope.CASHUP_FLOAT_CASH_REPORT($scope.RPTID);
                break;
            case 54:
                $scope.BUDGET_CONSUMPTION_REPORT($scope.RPTID);
                break;
            case 55:
                $scope.PR_PO_TRACKING_REPORT($scope.RPTID);
                break;
            case 57:
                $scope.APPROVED_INVOICES_REPORT($scope.RPTID);
                break;
            default:

        }
    };
    $scope.ROTA_SHIFT_BREAKDOWN_REPORT = function (RPTID) {

        $scope.enable = "false";
        $scope.LOADER_ICON = true;
        if ($scope.RPTID == 7) {
            var IS_VALID_CNT = 0;
            if ($scope.ReportSearch.ROTA_END_DATE == undefined || $scope.ReportSearch.ROTA_END_DATE == null || $scope.ReportSearch.ROTA_END_DATE == '' || $scope.ReportSearch.ROTA_START_DATE == undefined || $scope.ReportSearch.ROTA_START_DATE == null || $scope.ReportSearch.ROTA_START_DATE == '') {
                $scope.$parent.ShowAlert("Error", "Please select Start and End Date", 3000);
                $scope.enable = "true";
                $scope.LOADER_ICON = false;
                IS_VALID_CNT = 1;
            }
            else if (new Date($scope.ReportSearch.ROTA_END_DATE) < new Date($scope.ReportSearch.ROTA_START_DATE)) {
                $scope.$parent.ShowAlert("Error", "End Date should be greater than start date", 3000);
                $scope.enable = "true";
                $scope.LOADER_ICON = false;
                IS_VALID_CNT = 2;
            }
            if (IS_VALID_CNT == 0) {
                //if ($scope.ReportSearch.ROTA_END_DATE != undefined && $scope.ReportSearch.ROTA_START_DATE != undefined) {
                RPTModelObj = new Object();
                RPTModelObj.ENTITY_ID = parseInt($cookies.get('ENTITY_ID'));
                RPTModelObj.START_DATE = $scope.ReportSearch.ROTA_START_DATE;
                RPTModelObj.END_DATE = $scope.ReportSearch.ROTA_END_DATE;
                RPTModelObj.BRANCH_IDS = $scope.ReportSearch.BRANCH_ID == null ? "" : $scope.ReportSearch.BRANCH_ID;
                RPTModelObj.SECTION_IDS = $scope.ReportSearch.SECTION_ID == null ? "" : $scope.ReportSearch.SECTION_ID;
                RPTModelObj.STATUS_FLAG = $scope.ReportSearch.STATUS_ID == null ? 0 : $scope.ReportSearch.STATUS_ID;
                PrcCommMethods.REPORT_API(RPTModelObj, 'ROTA_SHIFT_BREAKDOWN_REPORT').then(function (data) {
                    if (data.data.Table.length > 0) {
                        $scope.REPORT_DATA_LIST = [];
                        $scope.REPORT_DATA_LIST = data.data.Table;
                        $scope.JSON_COLUMN_NAME = Object.keys(data.data.Table[0]);
                        angular.forEach($scope.REPORT_DATA_LIST, function (item) {

                            $scope.SELECTED_DATA = [];
                            $scope.SELECTED_DATA =
                                {
                                    'EMPLOYEE NAME': item.EMPLOYEE_NAME,
                                    'EMPLOYEE NO': item.EMPLOYEE_NO,
                                    'PAID BY': item.PAID_BY == null ? '' : item.PAID_BY,
                                    'BRANCH NAME': item.BRANCH_NAME == null ? '' : item.BRANCH_NAME,
                                    'SECTION NAME': item.SECTION_NAME == null ? '' : item.SECTION_NAME,
                                    'COST CENTER CODE': item.COST_CENTER_CODE == null ? '' : item.COST_CENTER_CODE,
                                    'COST CENTER DESCRIPTION': item.COST_CENTER_DESCRIPTION == null ? '' : item.COST_CENTER_DESCRIPTION,
                                    'LEAVE TYPE': item.LEAVE_TYPE == null ? '' : item.LEAVE_TYPE,
                                    'SHIFT DATE': item.SHIFT_DATE == null ? '' : item.SHIFT_DATE = moment(item.SHIFT_DATE).format('DD/MM/YYYY'),
                                    'START TIME': item.START_TIME == null ? '' : item.START_TIME,
                                    'END TIME': item.END_TIME == null ? '' : item.END_TIME,
                                    'BREAK TYPE': item.BREAK_TYPE == null ? '' : item.BREAK_TYPE,
                                    'BREAK DURATION': item.BREAK_DURATION == null ? '' : item.BREAK_DURATION,
                                    'BREAK START': item.BREAK_START == null ? '' : item.BREAK_START,
                                    'BREAK END': item.BREAK_END == null ? '' : item.BREAK_END,
                                    'SHIFT COUNT': item.SHIFT_COUNT == null ? '' : item.SHIFT_COUNT,
                                    'CLOCK IN': item.CLOCK_IN == null ? '' : item.CLOCK_IN,
                                    'CLOCK OUT': item.CLOCK_OUT == null ? '' : item.CLOCK_OUT,
                                    'APPROVED CLOCK IN': item.APPROVED_CLOCK_IN == null ? '' : item.APPROVED_CLOCK_IN,
                                    'APPROVED CLOCK OUT': item.APPROVED_CLOCK_OUT == null ? '' : item.APPROVED_CLOCK_OUT,
                                    'TOTAL HOURS': item.TOTAL_HOURS == null ? '' : item.TOTAL_HOURS,
                                    'APPROVED TOTAL HOURS': item.APPROVED_TOTAL_HOURS == null ? '' : item.APPROVED_TOTAL_HOURS,
                                    'STATUS': item.STATUS == null ? '' : item.STATUS,
                                    'Search By Start Date': moment($scope.ReportSearch.ROTA_START_DATE).format('DD/MM/YYYY'),
                                    'Search By End Date': moment($scope.ReportSearch.ROTA_END_DATE).format('DD/MM/YYYY'),
                                    'Search By Location': $scope.ReportSearch.LOCATION_ID == null ? "" : $scope.LOCATION.filter(p => p.LOCATION_ID == $scope.ReportSearch.LOCATION_ID)[0]['LOCATION_NAME'],
                                    'Search By Branch': $scope.ReportSearch.BRANCH_ID == null ? "" : $scope.BRANCH_LIST.filter(p => p.BRANCH_ID == $scope.ReportSearch.BRANCH_ID)[0]['BRANCH_NAME'],
                                    'Search By Status': $scope.ReportSearch.STATUS_ID == null ? "All" : $scope.ROTA_STATUS_FLAG.filter(p => p.STATUS_ID == $scope.ReportSearch.STATUS_ID)[0]['DISPLAY_TEXT'],
                                    'Search By Section': $scope.ReportSearch.SECTION_ID == null ? "" : $scope.SECTIONS.filter(p => p.TABLE_ID == $scope.ReportSearch.SECTION_ID)[0]['DISPLAY_TEXT'],
                                };
                            $scope.EXCEL_REPORT_DATA_LIST.push($scope.SELECTED_DATA);
                        });
                        $scope.DOWNLOAD_EXCEL();
                    }
                    else {
                        $scope.$parent.ShowAlert("Success", "No Records Found.", 3000);
                    }
                    $scope.enable = "true";
                    $scope.LOADER_ICON = false;
                });

            }
            //else {

            //    $scope.$parent.ShowAlert("Error", "Please select Mandatory Fields", 3000);
            //    $scope.enable = "true";
            //    $scope.LOADER_ICON = false;
            //    return false;
            //}

        }
    };

    $scope.MRKTMN_COGS_REPORT = function (RPTID) {
        $scope.enable = "false";
        $scope.LOADER_ICON = true;
        if ($scope.RPTID == 16) {
            var IS_VALID_CNT = 0;
            if ($scope.ReportSearch.ROTA_END_DATE == undefined || $scope.ReportSearch.ROTA_END_DATE == null || $scope.ReportSearch.ROTA_END_DATE == '' || $scope.ReportSearch.ROTA_START_DATE == undefined || $scope.ReportSearch.ROTA_START_DATE == null || $scope.ReportSearch.ROTA_START_DATE == '') {
                $scope.$parent.ShowAlert("Error", "Please select Start and End Date", 3000);
                $scope.enable = "true";
                $scope.LOADER_ICON = false;
                IS_VALID_CNT = 1;
            }
            else if (new Date($scope.ReportSearch.ROTA_END_DATE) < new Date($scope.ReportSearch.ROTA_START_DATE)) {
                $scope.$parent.ShowAlert("Error", "End Date should be greater than start date", 3000);
                $scope.enable = "true";
                $scope.LOADER_ICON = false;
                IS_VALID_CNT = 2;
            }
            if (IS_VALID_CNT == 0) {
                ///if ($scope.ReportSearch.ROTA_END_DATE != undefined && $scope.ReportSearch.ROTA_START_DATE != undefined) {
                RPTModelObj = new Object();
                RPTModelObj.START_DATE = $scope.ReportSearch.ROTA_START_DATE;
                RPTModelObj.END_DATE = $scope.ReportSearch.ROTA_END_DATE;
                RPTModelObj.BRANCH_ID = $scope.ReportSearch.BRANCH_ID == null ? "" : $scope.ReportSearch.BRANCH_ID;
                PrcCommMethods.REPORT_API(RPTModelObj, 'MRKTMN_COGS_REPORT').then(function (data) {
                    if (data.data.Table.length > 0) {
                        $scope.REPORT_DATA_LIST = [];
                        $scope.REPORT_DATA_LIST = data.data.Table;
                        $scope.JSON_COLUMN_NAME = Object.keys(data.data.Table[0]);
                        angular.forEach($scope.REPORT_DATA_LIST, function (item) {
                            $scope.SELECTED_DATA = [];
                            for (var i = 0; i < $scope.JSON_COLUMN_NAME.length; i++) {
                                item[$scope.JSON_COLUMN_NAME[i]] == null ? item[$scope.JSON_COLUMN_NAME[i]] = "" : item[$scope.JSON_COLUMN_NAME[i]] = item[$scope.JSON_COLUMN_NAME[i]];
                            }
                            $scope.EXCEL_REPORT_DATA_LIST.push(item);
                        });
                        $scope.DOWNLOAD_EXCEL();
                    }
                    else {
                        $scope.$parent.ShowAlert("Success", "No Records Found.", 3000);
                    }
                    $scope.enable = "true";
                    $scope.LOADER_ICON = false;
                });

            }
            //else {
            //    $scope.$parent.ShowAlert("Error", "Please select Mandatory Fields", 3000);
            //    $scope.enable = "true";
            //    $scope.LOADER_ICON = false;
            //    return false;
            //}

        }
    };

    $scope.ROTA_SHIFT_DURATION_REPORT = function (RPTID) {
        $scope.enable = "false";
        $scope.RPTID = RPTID;
        $scope.LOADER_ICON = true;
        var IS_VALID_CNT = 0;
        if ($scope.ReportSearch.ROTA_END_DATE == undefined || $scope.ReportSearch.ROTA_END_DATE == null || $scope.ReportSearch.ROTA_END_DATE == '' || $scope.ReportSearch.ROTA_START_DATE == undefined || $scope.ReportSearch.ROTA_START_DATE == null || $scope.ReportSearch.ROTA_START_DATE == '') {
            $scope.$parent.ShowAlert("Error", "Please select Start and End Date", 3000);
            $scope.enable = "true";
            $scope.LOADER_ICON = false;
            IS_VALID_CNT = 1;
        }
        else if (new Date($scope.ReportSearch.ROTA_END_DATE) < new Date($scope.ReportSearch.ROTA_START_DATE)) {
            $scope.$parent.ShowAlert("Error", "End Date should be greater than start date", 3000);
            $scope.enable = "true";
            $scope.LOADER_ICON = false;
            IS_VALID_CNT = 2;
        }
        if (IS_VALID_CNT == 0) {
            //if ($scope.ReportSearch.ROTA_END_DATE != undefined && $scope.ReportSearch.ROTA_START_DATE != undefined) {
            RPTModelObj = new Object();
            RPTModelObj.ENTITY_ID = parseInt($cookies.get('ENTITY_ID'));
            RPTModelObj.START_DATE = $scope.ReportSearch.ROTA_START_DATE;
            RPTModelObj.END_DATE = $scope.ReportSearch.ROTA_END_DATE;
            RPTModelObj.BRANCH_IDS = $scope.ReportSearch.BRANCH_ID == null ? "" : $scope.ReportSearch.BRANCH_ID;
            RPTModelObj.SECTION_IDS = $scope.ReportSearch.SECTION_ID == null ? "" : $scope.ReportSearch.SECTION_ID;
            RPTModelObj.FLAG_103 = $scope.$parent.CheckSubModuleAccess(103);
            RPTModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
            RPTModelObj.SELF_98 = $scope.$parent.CheckSubModuleAccess(98) ? 1 : 0;
            RPTModelObj.BELOW_99 = $scope.$parent.CheckSubModuleAccess(99) ? 1 : 0;
            RPTModelObj.ALL_100 = $scope.$parent.CheckSubModuleAccess(100) ? 1 : 0;
            RPTModelObj.ADMIN_FLAG_48 = $scope.$parent.CheckSubModuleAccess(48) ? 1 : 0;///--1 FOR ADMIN AND 0 FOR OTHERS (FILL BY PREVILEGE 48)

            PrcCommMethods.REPORT_API(RPTModelObj, 'ROTA_SHIFT_DURATION_REPORT').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.REPORT_DATA_LIST = [];
                    $scope.REPORT_DATA_LIST = data.data.Table;
                    $scope.JSON_COLUMN_NAME = Object.keys(data.data.Table[0]);
                    angular.forEach($scope.REPORT_DATA_LIST, function (item) {
                        $scope.SELECTED_DATA = [];
                        for (var i = 0; i < $scope.JSON_COLUMN_NAME.length; i++) {
                            item[$scope.JSON_COLUMN_NAME[i]] == null ? item[$scope.JSON_COLUMN_NAME[i]] = "" : item[$scope.JSON_COLUMN_NAME[i]] = item[$scope.JSON_COLUMN_NAME[i]];
                            if ($scope.JSON_COLUMN_NAME[i].toLowerCase() == "ANNUAL SALARY".toLowerCase()) {
                                if (item["ANNUAL SALARY"] == '********') {
                                    item["ANNUAL SALARY"] = '********';
                                }
                                else
                                    item["ANNUAL SALARY"] = item["ANNUAL SALARY"] == "" ? item["ANNUAL SALARY"] = 0 : parseFloat(parseFloat(item["ANNUAL SALARY"]).toFixed(2));
                            }
                            if ($scope.JSON_COLUMN_NAME[i].toLowerCase() == "RATE".toLowerCase()) {
                                if (item["RATE"] == '********') {
                                    item["RATE"] = '********';
                                }
                                else
                                    item["RATE"] = item["RATE"] == "" ? 0 : parseFloat(parseFloat(item["RATE"]).toFixed(2));
                            }
                            if ($scope.JSON_COLUMN_NAME[i].toLowerCase() == "CLOCKED IN SHIFT DURATION".toLowerCase()) {
                                item["CLOCKED IN SHIFT DURATION"] = parseFloat(parseFloat(item["CLOCKED IN SHIFT DURATION"]).toFixed(2));
                            }
                            if ($scope.JSON_COLUMN_NAME[i].toLowerCase() == "ASSIGNED SHIFT DURATION".toLowerCase()) {
                                item["ASSIGNED SHIFT DURATION"] = parseFloat(parseFloat(item["ASSIGNED SHIFT DURATION"]).toFixed(2));
                            }
                            if ($scope.JSON_COLUMN_NAME[i].toLowerCase() == "ASSIGNED SHIFT COST".toLowerCase()) {
                                if (item["ASSIGNED SHIFT COST"] == '****') {
                                    item["ASSIGNED SHIFT COST"] = '****';
                                }
                                else
                                    item["ASSIGNED SHIFT COST"] = item["ASSIGNED SHIFT COST"] == "" ? 0 : parseFloat(parseFloat(item["ASSIGNED SHIFT COST"]).toFixed(2));
                            }
                            if ($scope.JSON_COLUMN_NAME[i].toLowerCase() == "ASSIGNED + EMPLOYER SHIFT COST".toLowerCase()) {
                                if (item["ASSIGNED + EMPLOYER SHIFT COST"] == '****') {
                                    item["ASSIGNED + EMPLOYER SHIFT COST"] = '****';
                                }
                                else
                                    item["ASSIGNED + EMPLOYER SHIFT COST"] = item["ASSIGNED + EMPLOYER SHIFT COST"] == "" ? 0 : parseFloat(parseFloat(item["ASSIGNED + EMPLOYER SHIFT COST"]).toFixed(2));
                            }
                            if ($scope.JSON_COLUMN_NAME[i].toLowerCase() == "APPROVED SHIFT COST".toLowerCase()) {
                                if (item["APPROVED SHIFT COST"] == '****') {
                                    item["APPROVED SHIFT COST"] = '****';
                                }
                                else
                                    item["APPROVED SHIFT COST"] = item["APPROVED SHIFT COST"] == "" ? 0 : parseFloat(parseFloat(item["APPROVED SHIFT COST"]).toFixed(2));
                            }
                            if ($scope.JSON_COLUMN_NAME[i].toLowerCase() == "APPROVED + EMPLOYER SHIFT COST".toLowerCase()) {
                                if (item["APPROVED + EMPLOYER SHIFT COST"] == '****') {
                                    item["APPROVED + EMPLOYER SHIFT COST"] = '****';
                                }
                                else
                                    item["APPROVED + EMPLOYER SHIFT COST"] = item["APPROVED + EMPLOYER SHIFT COST"] == "" ? 0 : parseFloat(parseFloat(item["APPROVED + EMPLOYER SHIFT COST"]).toFixed(2));
                            }
                            if ($scope.JSON_COLUMN_NAME[i].toLowerCase() == "APPROVED SHIFT COST".toLowerCase()) {
                                if (item["ASSIGNED SHIFT COST"] == '****') {
                                    item["VARIANCE"] = '****';
                                }
                                else
                                    item["VARIANCE"] = item["ASSIGNED SHIFT COST"] == "" ? parseFloat(0 - parseFloat(item[$scope.JSON_COLUMN_NAME[i]])) : parseFloat(parseFloat(item["ASSIGNED SHIFT COST"]) - parseFloat(item[$scope.JSON_COLUMN_NAME[i]]));
                            }
                        }
                        $scope.EXCEL_REPORT_DATA_LIST.push(item);
                    });
                    angular.forEach($scope.REPORT_DATA_LIST, function (items) {
                        items["Search By Start Date"] = moment($scope.ReportSearch.ROTA_START_DATE).format('DD/MM/YYYY'),
                            items["Search By End Date"] = moment($scope.ReportSearch.ROTA_END_DATE).format('DD/MM/YYYY'),
                            items["Search By Location"] = $scope.ReportSearch.LOCATION_ID == null ? "" : $scope.LOCATION.filter(p => p.LOCATION_ID == $scope.ReportSearch.LOCATION_ID)[0]['LOCATION_NAME'],
                            items["Search By Branch"] = $scope.ReportSearch.BRANCH_ID == null ? "" : $scope.BRANCH_LIST.filter(p => p.BRANCH_ID == $scope.ReportSearch.BRANCH_ID)[0]['BRANCH_NAME'],
                            items["Search By Section"] = $scope.ReportSearch.SECTION_ID == null ? "" : $scope.SECTIONS.filter(p => p.TABLE_ID == $scope.ReportSearch.SECTION_ID)[0]['DISPLAY_TEXT']
                    });

                    $scope.DOWNLOAD_EXCEL();
                }
                else {
                    $scope.$parent.ShowAlert("Success", "No Records Found.", 3000);
                }
                $scope.enable = "true";
                $scope.LOADER_ICON = false;
            });
        }
        //else {
        //    $scope.$parent.ShowAlert("Error", "Please select Mandatory Fields", 3000);
        //    $scope.enable = "true";
        //    $scope.LOADER_ICON = false;
        //    return false;
        //}
    };
    $scope.HR_EMPLOYEE_ABSENCE_REPORT = function (RPTID) {
        $scope.enable = "false";
        $scope.RPTID = RPTID;
        $scope.LOADER_ICON = true;
        var IS_VALID_CNT = 0;
        if ($scope.ReportSearch.END_DATE == undefined || $scope.ReportSearch.END_DATE == null || $scope.ReportSearch.END_DATE == '' || $scope.ReportSearch.START_DATE == undefined || $scope.ReportSearch.START_DATE == null || $scope.ReportSearch.START_DATE == '') {
            $scope.$parent.ShowAlert("Error", "Please select Start and End Date", 3000);
            $scope.enable = "true";
            $scope.LOADER_ICON = false;
            IS_VALID_CNT = 1;
        }
        else if (new Date($scope.ReportSearch.END_DATE) < new Date($scope.ReportSearch.START_DATE)) {
            $scope.$parent.ShowAlert("Error", "End Date should be greater than start date", 3000);
            $scope.enable = "true";
            $scope.LOADER_ICON = false;
            IS_VALID_CNT = 2;
        }
        if (IS_VALID_CNT == 0) {
            //if ($scope.ReportSearch.END_DATE != undefined && $scope.ReportSearch.START_DATE != undefined) {
            RPTModelObj = new Object();
            RPTModelObj.ENTITY_ID = parseInt($cookies.get('ENTITY_ID'));
            RPTModelObj.START_DATE = $scope.ReportSearch.START_DATE;
            RPTModelObj.END_DATE = $scope.ReportSearch.END_DATE;
            RPTModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.REPORT_API(RPTModelObj, 'HR_EMPLOYEE_ABSENCE_REPORT').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.REPORT_DATA_LIST = data.data.Table;
                    angular.forEach($scope.REPORT_DATA_LIST, function (items) {
                        items["Leave Comments"] == null ? items["Leave Comments"] = '' : items["Leave Comments"];
                        items["Approved / Rejected Date"] == null ? items["Approved / Rejected Date"] = '' : items["Approved / Rejected Date"] = moment(items["Approved / Rejected Date"]).format('DD/MM/YYYY');
                        items["Approval / Rejection Comments"] == null ? items["Approval / Rejection Comments"] = '' : items["Approval / Rejection Comments"];
                        items["Approved / Rejected By"] == null ? items["Approved / Rejected By"] = '' : items["Approved / Rejected By"];
                        items["Start Date"] = moment(items["Start Date"]).format('DD/MM/YYYY');
                        items["End Date"] = moment(items["End Date"]).format('DD/MM/YYYY');
                        items["Total Duration"] == null ? items["Total Duration"] = 0 : items["Total Duration"];
                        items["Unpaid Duration"] == null ? items["Unpaid Duration"] = 0 : items["Unpaid Duration"];
                        items["Termination Date"] == null ? items["Termination Date"] = "" : items["Termination Date"] = moment(items["Termination Date"]).format('DD/MM/YYYY');
                        items["Terminated On"] == null ? items["Terminated On"] = "" : items["Terminated On"] = moment(items["Terminated On"]).format('DD/MM/YYYY');
                        items["Paid Duration"] == null ? items["Paid Duration"] = "" : items["Paid Duration"];
                    });
                    angular.forEach($scope.REPORT_DATA_LIST, function (items) {
                        items["Search By Start Date"] = moment($scope.ReportSearch.START_DATE).format('DD/MM/YYYY');
                        items["Search By End Date"] = moment($scope.ReportSearch.END_DATE).format('DD/MM/YYYY');
                    });
                    $scope.EXCEL_REPORT_DATA_LIST = $scope.REPORT_DATA_LIST;//data.data.Table;
                    $scope.DOWNLOAD_EXCEL();
                }
                else {
                    $scope.$parent.ShowAlert("Success", "No Records Found.", 3000);
                }
                $scope.enable = "true";
                $scope.LOADER_ICON = false;
            });
        }
        //else {

        //    $scope.$parent.ShowAlert("Error", "Please select Mandatory Fields", 3000);
        //    $scope.enable = "true";
        //    $scope.LOADER_ICON = false;
        //    return false;
        //}
    };
    $scope.HR_EMPLOYEE_LEAVE_ENTITLEMENT_REPORT = function (RPTID) {
        $scope.enable = "false";
        $scope.RPTID = RPTID;
        $scope.LOADER_ICON = true;
        var IS_VALID_CNT = 0;
        if ($scope.ReportSearch.END_DATE == undefined || $scope.ReportSearch.END_DATE == null || $scope.ReportSearch.END_DATE == '' || $scope.ReportSearch.START_DATE == undefined || $scope.ReportSearch.START_DATE == null || $scope.ReportSearch.START_DATE == '') {
            $scope.$parent.ShowAlert("Error", "Please select Start and End Date", 3000);
            $scope.enable = "true";
            $scope.LOADER_ICON = false;
            IS_VALID_CNT = 1;
        }
        else if (new Date($scope.ReportSearch.END_DATE) < new Date($scope.ReportSearch.START_DATE)) {
            $scope.$parent.ShowAlert("Error", "End Date should be greater than start date", 3000);
            $scope.enable = "true";
            $scope.LOADER_ICON = false;
            IS_VALID_CNT = 2;
        }
        if (IS_VALID_CNT == 0) {
            //if ($scope.ReportSearch.END_DATE != undefined && $scope.ReportSearch.START_DATE != undefined) {
            RPTModelObj = new Object();
            RPTModelObj.ENTITY_ID = parseInt($cookies.get('ENTITY_ID'));
            RPTModelObj.START_DATE = $scope.ReportSearch.START_DATE;
            RPTModelObj.END_DATE = $scope.ReportSearch.END_DATE;
            RPTModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.REPORT_API(RPTModelObj, 'HR_EMPLOYEE_LEAVE_ENTITLEMENT_REPORT').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.REPORT_DATA_LIST = data.data.Table;
                    $scope.JSON_COLUMN_NAME = Object.keys(data.data.Table[0]);
                    angular.forEach($scope.REPORT_DATA_LIST, function (item) {
                        $scope.SELECTED_DATA = [];
                        for (var i = 0; i < $scope.JSON_COLUMN_NAME.length; i++) {
                            if ($scope.JSON_COLUMN_NAME[i] == "Validity Start" || $scope.JSON_COLUMN_NAME[i] == "Validity End")
                                item[$scope.JSON_COLUMN_NAME[i]] = moment(item[$scope.JSON_COLUMN_NAME[i]]).format('DD/MM/YYYY');
                            else
                                item[$scope.JSON_COLUMN_NAME[i]] == null ? item[$scope.JSON_COLUMN_NAME[i]] = "" : item[$scope.JSON_COLUMN_NAME[i]] = item[$scope.JSON_COLUMN_NAME[i]];
                        }
                        item["Search By Start Date"] = moment($scope.ReportSearch.START_DATE).format('DD/MM/YYYY');
                        item["Search By End Date"] = moment($scope.ReportSearch.END_DATE).format('DD/MM/YYYY');
                        $scope.EXCEL_REPORT_DATA_LIST.push(item);
                    });
                    $scope.DOWNLOAD_EXCEL();
                    $scope.enable = "true";
                    $scope.LOADER_ICON = false;
                }
                else {
                    $scope.$parent.ShowAlert("Success", "No Records Found.", 3000);
                }
                $scope.enable = "true";
                $scope.LOADER_ICON = false;
            });

        }
        //else {
        //    $scope.$parent.ShowAlert("Error", "Please select Mandatory Fields", 3000);
        //    $scope.enable = "true";
        //    $scope.LOADER_ICON = false;
        //    return false;
        //}


    };
    $scope.ADMIN_GET_LOCATION = function () {
        ModelObj = new Object()
        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));//ENT[0].ENTITY_ID;
        ModelObj.CUSTOMER_ID = parseInt($cookies.get('CUSTOMER_ID'));
        ModelObj.LOCATION_NAME = null;
        ModelObj.LOCATION_CODE = null;
        ModelObj.ACTIVE = 1;
        ModelObj.PAGE_NO = 1;
        ModelObj.PAGE_SIZE = 999;
        ModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.ADMIN_API(ModelObj, 'ADMIN_GET_LOCATION').then(function (data) {
            $scope.LOCATION = data.data.Table;
        });
    };
    $scope.ADMIN_GET_LOCATION();

    $scope.ADMIN_GET_BRANCH = function () {
        $scope.SHOW_WEEKLY_CASHUP_HTML_TABLE_FLAG = false;
        ModelObj = new Object();
        ModelObj.CUSTOMER_ID = parseInt($cookies.get('CUSTOMER_ID'));
        ModelObj.ENTITY_ID = parseInt($cookies.get('ENTITY_ID'));
        ModelObj.BRANCH_CODE = null;//$scope.GroupSearch.BRANCH_CODE;
        ModelObj.BRANCH_NAME = null;// $scope.GroupSearch.BRANCH_NAME;
        ModelObj.CONTACT_NAME = null;// $scope.GroupSearch.CONTACT_NAME;
        ModelObj.LOCATION_IDS = $scope.ReportSearch.LOCATION_ID == null || $scope.ReportSearch.LOCATION_ID == undefined ? null : $scope.ReportSearch.LOCATION_ID;
        ModelObj.ACTIVE = 1;//$scope.BrachSearch.ACTIVE ? 1 : 0;
        ModelObj.PAGE_NO = 0;
        ModelObj.PAGE_SIZE = 0;
        ModelObj.USER_ID = parseInt($cookies.get("USERID"));
        //if ($scope.ReportSearch.LOCATION_ID != null) {
        PrcCommMethods.ADMIN_API(ModelObj, 'ADMIN_GET_BRANCH').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.BRANCH_LIST = data.data.Table;
            }
            else
                $scope.BRANCH_LIST = [];
        });
        //}
        //else {
        //    $scope.BRANCH_LIST = [];
        //}
    };
    $scope.ADMIN_GET_BRANCH();
    $scope.ROTA_GET_SECTION = function () {

        ModelObj = new Object();
        ModelObj.SECTION_NAME = null;
        ModelObj.DEPARTMENT_NAME = null;
        ModelObj.ENTITY_ID = parseInt($cookies.get('ENTITY_ID'));;
        ModelObj.ACTIVE = 1;
        ModelObj.PAGE_NO = 1;
        ModelObj.PAGE_SIZE = 999;
        ModelObj.BRANCH_ID = 0;
        PrcCommMethods.HR_API(ModelObj, 'ROTA_GET_SECTION').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.SECTIONS = data.data.Table;
                $scope.DEPARTMENTS = $filter('unique')(data.data.Table, 'DEPARTMENT_ID');
                $scope.BRANCH_LIST = $filter('unique')(data.data.Table, 'BRANCH_ID');
                $scope.FINAL_SECTIONS = [];
                angular.forEach($scope.SECTIONS, function (x) {
                    if (x.ACTIVE) {
                        var section = new Object()
                        section.id = x.TABLE_ID;
                        section.text = x.DISPLAY_TEXT;
                        section.html = '<a class="text-sm d-inline-block text-limitations"><i class="fas fa-circle fa-sm d-inline mr-2" style="color:#' + x.SECTION_COLOR + '" ></i><div class="d-inline text-limitations">' + x.DISPLAY_TEXT + '</div></a>';
                        $scope.FINAL_SECTIONS.push(section);
                    }
                })
            }
        });

    };
    $scope.ROTA_GET_SECTION();
    $scope.DOWNLOAD_EXCEL = function () {
        alasql('SELECT * INTO XLSX("' + $scope.REPORT_NAME + '",{headers:true}) FROM ?', [$scope.EXCEL_REPORT_DATA_LIST]);
        $scope.EXCEL_REPORT_DATA_LIST = [];
    };
    $scope.RESET = function (REPORT_ID) {
        $scope.ReportSearch = {
            START_DATE: null,
            END_DATE: null, STATUS_ID: null,
            LOCATION_ID: null,
            ROTA_START_DATE: null,
            ROTA_END_DATE: null, BRANCH_ID: null,
            SECTION_ID: null
        };
        $scope.EXCEL_REPORT_DATA_LIST = [];
        $scope.REPORT_DATA_LIST = [];
        if (REPORT_ID == 9 || REPORT_ID == 7 || REPORT_ID == 30)
            $scope.BRANCH_LIST = [];

        $scope.REPORT_DATA_LIST_CSV = [];
        $scope.LOADER_ICON = false;
        $scope.enable = "true"
    };
    $scope.GET_WEEKLY_CASHUP_REPORT = function (RPTID, DISPLAY_HTML_FLAG) {

        if ($scope.ReportForm.$valid) {
            $scope.CASHUP_REPORT_DATA_LIST = [];
            $scope.EXCEL_REPORT_DATA_LIST = [];
            $scope.enable = "false";
            $scope.LOADER_ICON = true;
            CashupModel = new Object();
            CashupModel.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            CashupModel.BRANCH_ID = $scope.ReportSearch.BRANCH_ID;
            CashupModel.START_DATE = (new Date($scope.ReportSearch.REPORT_START_DATE)).toDateString();
            CashupModel.END_DATE = (new Date($scope.ReportSearch.REPORT_END_DATE)).toDateString();
            PrcCommMethods.REPORT_API(CashupModel, 'GET_WEEKLY_CASHUP_REPORT').then(function (data) {
                if (data.data != null && data.data.Table1 != undefined) {
                    $scope.CASHUP_REPORT_DATA_LIST = data.data.Table1;
                    $scope.JSON_COLUMN_NAME = Object.keys(data.data.Table1[0]);
                    angular.forEach($scope.CASHUP_REPORT_DATA_LIST, function (item) {
                        $scope.SELECTED_DATA = [];

                        if (item.Session == "NET_REVENUE") { item.Session = "NET REVENUE"; }
                        if (item.Session == "SRVC_CHARGE") { item.Session = "SERVICE CHARGE"; }
                        if (item.Session == "TOTAL_REVENUE") { item.Session = "TOTAL REVENUE"; }
                        if (item.Session == "VOID" || item.Session == "CASH") {

                            $scope.SELECTED_DATA =
                                {
                                    'SESSION NAME': ' ',
                                    'MONDAY': ' ',
                                    'TUESDAY': ' ',
                                    'WEDNESDAY': ' ',
                                    'THURSDAY': ' ',
                                    'FRIDAY': ' ',
                                    'SATURDAY': ' ',
                                    'SUNDAY': ' ',
                                    'TOTALWEEK': ' ',
                                    'VAR. LAST WEEK': ' ',
                                    'VAR. LAST YEAR': ' ',

                                };
                            $scope.EXCEL_REPORT_DATA_LIST.push($scope.SELECTED_DATA);
                            //  $scope.CASHUP_REPORT_DATA_LIST.push($scope.SELECTED_DATA);
                        }
                        if (item.Session == "TotalWeek") { item.Session = "TOTAL WEEK"; $scope.CSS_APPLY = "card-footer"; }
                        if (item.Session == "PETTY_CASH") { item.Session = "PETTY CASH"; }
                        if (item.Session == "VOUCHER_SOLD") { item.Session = "VOUCHER SOLD"; }
                        if (item.Session == "VOUCHER_REDEEMED") { item.Session = "VOUCHER REDEEMED"; }
                        if (item.Session == "DEPOSIT_SOLD") { item.Session = "DEPOSIT SOLD"; }
                        if (item.Session == "DEPOSIT_REDEEMED") { item.Session = "DEPOSIT REDEEMED"; }
                        if (item.Session == "Total Collection") { item.Session = "TOTAL COLLECTION"; $scope.CSS_APPLY = "card-footer"; }
                        $scope.SELECTED_DATA =
                            {
                                'SESSION NAME': item.Session,
                                'MONDAY': item.MONDAY == null ? '--' : item.MONDAY.toFixed(2),
                                'TUESDAY': item.TUESDAY == null ? '--' : item.TUESDAY.toFixed(2),
                                'WEDNESDAY': item.WEDNESDAY == null ? '--' : item.WEDNESDAY.toFixed(2),
                                'THURSDAY': item.THURSDAY == null ? '--' : item.THURSDAY.toFixed(2),
                                'FRIDAY': item.FRIDAY == null ? '--' : item.FRIDAY.toFixed(2),
                                'SATURDAY': item.SATURDAY == null ? '--' : item.SATURDAY.toFixed(2),
                                'SUNDAY': item.SUNDAY == null ? '--' : item.SUNDAY.toFixed(2),
                                'TOTALWEEK': item.TotalWeek == null ? '--' : parseFloat(item.TotalWeek).toFixed(2),
                                'VAR. LAST WEEK': item.Var_Last_Week == null || item.Var_Last_Week == '--' ? '--' : parseFloat(item.Var_Last_Week).toFixed(2) + "%",
                                'VAR. LAST YEAR': item.Var_Last_Year == null || item.Var_Last_Year == "--" ? '--' : parseFloat(item.Var_Last_Year).toFixed(2) + "%",

                            };
                        $scope.EXCEL_REPORT_DATA_LIST.push($scope.SELECTED_DATA);
                        $scope.enable = "true";
                        $scope.LOADER_ICON = false;
                        $scope.CSS_APPLY = null;
                    });
                    alasql('SELECT * INTO XLSX("WEEKLY_CASHUP_REPORT ' + $scope.REPORT_BETWEEN_DATE + '",{headers:true}) FROM ?', [$scope.EXCEL_REPORT_DATA_LIST]);
                }
                else {
                    $scope.$parent.ShowAlert("Attention", "No Records Found.", 3000);
                    $scope.enable = "true";
                    $scope.LOADER_ICON = false;
                }
            });
        }
    };
    $scope.CASHUP_CONSOLIDATED_SALES_REPORT = function (RPTID, DISPLAY_HTML_FLAG) {
        $scope.CASHUP_CONSOLIDATED_SALES_REPORT_LIST = [];
        $scope.CASHUP_REPORT_DATA_LIST = [];
        $scope.EXCEL_REPORT_DATA_LIST = [];
        $scope.SHOW_WEEKLY_CASHUP_HTML_TABLE_FLAG = false;
        $scope.ReportForm.submitted = true;
        if ($scope.ReportForm.$valid) {
            $scope.enable = "false";
            $scope.LOADER_ICON = true;
            CashupModel = new Object();
            CashupModel.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            CashupModel.BRANCH_IDS = $scope.ReportSearch.BRANCH_ID == null ? '' : $scope.ReportSearch.BRANCH_ID;
            CashupModel.START_DATE = $scope.ReportSearch.START_DATE;
            CashupModel.END_DATE = $scope.ReportSearch.END_DATE;
            PrcCommMethods.REPORT_API(CashupModel, 'CASHUP_CONSOLIDATED_SALES_REPORT').then(function (data) {
                if (data.data.Table != undefined && data.data.Table.length > 0) {
                    $scope.CASHUP_CONSOLIDATED_SALES_REPORT_LIST = data.data.Table;
                    $scope.JSON_COLUMN_NAME = Object.keys(data.data.Table[0]);
                    if (DISPLAY_HTML_FLAG == undefined) { alasql('SELECT * INTO XLSX("CASHUP_CONSOLIDATED_SALES_REPORT",{headers:true}) FROM ?', [$scope.CASHUP_CONSOLIDATED_SALES_REPORT_LIST]); }
                    if (DISPLAY_HTML_FLAG == 2) {
                        $scope.DISPLAY_HTML_FLAG = DISPLAY_HTML_FLAG;
                        if ($scope.CASHUP_CONSOLIDATED_SALES_REPORT_LIST.length > 0) {
                            $scope.SHOW_WEEKLY_CASHUP_HTML_TABLE_FLAG = true;
                            $('#CASHUP_REPORT').modal('hide');
                            $scope.DISPLAY_HTML_FLAG = null;
                        }
                    }
                    $scope.enable = "true";
                    $scope.LOADER_ICON = false;
                }
                else {
                    $scope.$parent.ShowAlert("Attention", "No Records Found.", 2000);
                    $scope.enable = "true";
                    $scope.LOADER_ICON = false;
                }
            });
        }
    };
    $scope.CASHUP_PAYMENT_DETAILS_REPORT = function (RPTID) {
        $scope.SHOW_WEEKLY_CASHUP_HTML_TABLE_FLAG = false;
        $scope.ReportForm.submitted = true;
        $scope.CASHUP_PAYMENT_DETAILS_REPORT_EXCEL_FILE_NAME = null;
        if ($scope.ReportForm.$valid) {
            $scope.CASHUP_REPORT_DATA_LIST = [];
            $scope.EXCEL_REPORT_DATA_LIST = [];
            $scope.CASHUP_PAYMENT_DETAILS_REPORT_DATA_LIST = [];
            $scope.enable = "false";
            $scope.LOADER_ICON = true;
            CashupModel = new Object();
            CashupModel.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            CashupModel.BRANCH_IDS = $scope.ReportSearch.BRANCH_ID;
            CashupModel.START_DATE = $scope.ReportSearch.START_DATE;
            CashupModel.END_DATE = $scope.ReportSearch.END_DATE;
            PrcCommMethods.REPORT_API(CashupModel, 'CASHUP_PAYMENT_DETAILS_REPORT').then(function (data) {
                if (data.data != undefined) {
                    var Table_count = 0;
                    angular.forEach(data.data, function (data) {
                        Table_count += 1;
                    })
                    for (var i = 0; i < Table_count; i++) {
                        $scope.CASHUP_PAYMENT_DETAILS_REPORT_EXCEL_FILE_NAME = null;
                        $scope.CASHUP_PAYMENT_DETAILS_REPORT_DATA_LIST = [];
                        if (i == 0 && data.data.Table.length > 0) {
                            $scope.CASHUP_PAYMENT_DETAILS_REPORT_EXCEL_FILE_NAME = data.data.Table[0]["Payee"];
                            $scope.CASHUP_PAYMENT_DETAILS_REPORT_DATA_LIST = data.data.Table;
                            alasql('SELECT * INTO XLSX("' + $scope.CASHUP_PAYMENT_DETAILS_REPORT_EXCEL_FILE_NAME + '",{headers:true}) FROM ?', [$scope.CASHUP_PAYMENT_DETAILS_REPORT_DATA_LIST]);
                        }
                        if (i == 1 && data.data.Table1.length > 0) {
                            $scope.CASHUP_PAYMENT_DETAILS_REPORT_EXCEL_FILE_NAME = data.data.Table1[0]["Payee"];
                            $scope.CASHUP_PAYMENT_DETAILS_REPORT_DATA_LIST = data.data.Table1;
                            alasql('SELECT * INTO XLSX("' + $scope.CASHUP_PAYMENT_DETAILS_REPORT_EXCEL_FILE_NAME + '",{headers:true}) FROM ?', [$scope.CASHUP_PAYMENT_DETAILS_REPORT_DATA_LIST]);
                        }
                        if (i == 2 && data.data.Table2.length > 0) {
                            $scope.CASHUP_PAYMENT_DETAILS_REPORT_EXCEL_FILE_NAME = data.data.Table2[0]["Payee"];
                            $scope.CASHUP_PAYMENT_DETAILS_REPORT_DATA_LIST = data.data.Table2;
                            alasql('SELECT * INTO XLSX("' + $scope.CASHUP_PAYMENT_DETAILS_REPORT_EXCEL_FILE_NAME + '",{headers:true}) FROM ?', [$scope.CASHUP_PAYMENT_DETAILS_REPORT_DATA_LIST]);
                        }
                        if (i == 3 && data.data.Table3.length > 0) {
                            $scope.CASHUP_PAYMENT_DETAILS_REPORT_EXCEL_FILE_NAME = data.data.Table3[0]["Payee"];
                            $scope.CASHUP_PAYMENT_DETAILS_REPORT_DATA_LIST = data.data.Table3;
                            alasql('SELECT * INTO XLSX("' + $scope.CASHUP_PAYMENT_DETAILS_REPORT_EXCEL_FILE_NAME + '",{headers:true}) FROM ?', [$scope.CASHUP_PAYMENT_DETAILS_REPORT_DATA_LIST]);
                        }
                        if (i == 4 && data.data.Table4.length > 0) {
                            $scope.CASHUP_PAYMENT_DETAILS_REPORT_EXCEL_FILE_NAME = data.data.Table4[0]["Payee"];
                            $scope.CASHUP_PAYMENT_DETAILS_REPORT_DATA_LIST = data.data.Table4;
                            alasql('SELECT * INTO XLSX("' + $scope.CASHUP_PAYMENT_DETAILS_REPORT_EXCEL_FILE_NAME + '",{headers:true}) FROM ?', [$scope.CASHUP_PAYMENT_DETAILS_REPORT_DATA_LIST]);
                        }
                        if (i == 5 && data.data.Table5.length > 0) {
                            $scope.CASHUP_PAYMENT_DETAILS_REPORT_EXCEL_FILE_NAME = data.data.Table5[0]["Payee"];
                            $scope.CASHUP_PAYMENT_DETAILS_REPORT_DATA_LIST = data.data.Table5;
                            alasql('SELECT * INTO XLSX("' + $scope.CASHUP_PAYMENT_DETAILS_REPORT_EXCEL_FILE_NAME + '",{headers:true}) FROM ?', [$scope.CASHUP_PAYMENT_DETAILS_REPORT_DATA_LIST]);
                        }
                    }
                    //$scope.CASHUP_PAYMENT_DETAILS_REPORT_DATA_LIST = data.data.Table;
                    if (Table_count == 0) { $scope.$parent.ShowAlert("Attention", "No Records Found.", 2000); }
                    $scope.enable = "true";
                    $scope.LOADER_ICON = false;
                }
                else {
                    $scope.$parent.ShowAlert("Attention", "No Records Found.", 2000);
                    $scope.enable = "true";
                    $scope.LOADER_ICON = false;
                }
            });
        }
    };
    $scope.CASHUP_FLOAT_CASH_REPORT = function (RPTID) {
        var SELECT_FLAG = 0;
        if (RPTID == 12) {
            SELECT_FLAG = 1;  //For Flaot
        } else if (RPTID == 13) {
            SELECT_FLAG = 2; //For Cash
        } else if (RPTID == 52) {
            SELECT_FLAG = 3; //For Cash Tips
        }
        $scope.CASHUP_FLOAT_CASH_LIST = [];
        $scope.EXCEL_REPORT_DATA_LIST = [];
        $scope.enable = "false";
        $scope.LOADER_ICON = true;
        CashupModel = new Object();
        CashupModel.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CashupModel.START_DATE = (new Date($scope.ReportSearch.START_DATE)).toDateString();
        CashupModel.END_DATE = (new Date($scope.ReportSearch.END_DATE)).toDateString();
        CashupModel.BRANCH_ID = $scope.ReportSearch.BRANCH_ID;
        CashupModel.FLAG = SELECT_FLAG; //RPTID == 12 ? 1 : 2;
        PrcCommMethods.REPORT_API(CashupModel, 'CASHUP_FLOAT_CASH_REPORT').then(function (data) {
            if (data.data != null && data.data.Table != undefined) {
                if ($scope.ReportSearch.BRANCH_ID == null)
                    $scope.CASHUP_FLOAT_CASH_LIST = data.data.Table;
                else {
                    $scope.CASHUP_FLOAT_CASH_LIST = data.data.Table;
                    let branch_name = $scope.BRANCH_LIST.filter(p => p.BRANCH_ID == $scope.ReportSearch.BRANCH_ID)[0]['BRANCH_NAME'].toUpperCase();
                    $scope.CASHUP_FLOAT_CASH_LIST = $scope.CASHUP_FLOAT_CASH_LIST.filter(p => p.BRANCH_NAME.toUpperCase() == branch_name);
                }
                $scope.TOTAL_AMOUNT = 0;
                angular.forEach($scope.CASHUP_FLOAT_CASH_LIST, function (x) {
                    $scope.TOTAL_AMOUNT = $scope.TOTAL_AMOUNT + x.TOTAL_AMOUNT;
                    //add .00 in total amount if TOTAL_AMOUNT have no decimal. else set to TOTAL_AMOUNT amount.
                    x.TOTAL_AMOUNT = x.TOTAL_AMOUNT.toString().split('.').length > 1 ? x.TOTAL_AMOUNT.toString() : x.TOTAL_AMOUNT + '.00';
                    $scope.SELECTED_DATA = [];
                    $scope.SELECTED_DATA =
                        {
                            'BRANCH_NAME': x.BRANCH_NAME,
                            'CASHUP_DATE': x.CASHUP_DATE,
                            //add .00 in total amount if TOTAL_AMOUNT have no decimal. else set to TOTAL_AMOUNT amount.
                            'TOTAL_AMOUNT': x.TOTAL_AMOUNT
                        };
                    $scope.EXCEL_REPORT_DATA_LIST.push($scope.SELECTED_DATA);
                });
                $scope.SELECTED_DATA =
                    {
                        'BRANCH_NAME': '',
                        'CASHUP_DATE': 'Total',
                        //add .00 in total amount if TOTAL_AMOUNT have no decimal. else set to TOTAL_AMOUNT amount.
                        'TOTAL_AMOUNT': $scope.TOTAL_AMOUNT.toFixed(2)
                    };
                $scope.EXCEL_REPORT_DATA_LIST.push($scope.SELECTED_DATA);
                //$scope.EXCEL_REPORT_DATA_LIST = $scope.CASHUP_FLOAT_CASH_LIST;
                //var Name = RPTID == 12 ? "TOTAL_FLOAT_REPORT" : "TOTAL_CASH_REPORT";
                if (RPTID == 12) {
                    alasql('SELECT * INTO XLSX("TOTAL_FLOAT_REPORT",{headers:true}) FROM ?', [$scope.EXCEL_REPORT_DATA_LIST]);
                }
                else if (RPTID == 13) {
                    alasql('SELECT * INTO XLSX("TOTAL_CASH_REPORT",{headers:true}) FROM ?', [$scope.EXCEL_REPORT_DATA_LIST]);
                } else if (RPTID == 52) {
                    alasql('SELECT * INTO XLSX("TOTAL_CASH_TIPS_REPORT",{headers:true}) FROM ?', [$scope.EXCEL_REPORT_DATA_LIST]);
                }

                $('#CASHUP_REPORT').modal('hide');
                $scope.LOADER_ICON = false;
                $scope.enable = "true";
            }
            else {
                $scope.$parent.ShowAlert("Attention", "No Records Found.", 3000);
                $scope.enable = "true";
                $scope.LOADER_ICON = false;
            }
        });

    };
    $scope.CASHUP_COMP_REPORT = function (RPTID) {
        $scope.CASHUP_COMP_LIST = [];
        $scope.EXCEL_REPORT_DATA_LIST = [];
        $scope.enable = "false";
        $scope.LOADER_ICON = true;
        CashupModel = new Object();
        CashupModel.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CashupModel.START_DATE = (new Date($scope.ReportSearch.START_DATE)).toDateString();
        CashupModel.END_DATE = (new Date($scope.ReportSearch.END_DATE)).toDateString();
        CashupModel.BRANCH_IDS = $scope.ReportSearch.BRANCH_ID;
        PrcCommMethods.REPORT_API(CashupModel, 'CASHUP_COMP_REPORT').then(function (data) {
            if (data.data != null && data.data.Table.length > 0) {
                $scope.CASHUP_COMP_LIST = data.data.Table;
                //AMOUNT: 30
                //AUTHORISED_BY: "Megan"
                //BRANCH_NAME: "51 Lamb’s Conduit St"
                //CASHUP_DATE: "06 Dec 2021"
                //CHECK_NO: "1347604945"
                //COVERS: "0"
                //NOTE: "2 gls freddie emile"
                //REASON_FOR_COMP: "DNL"
                //TABLE_NO: "0"
                //TIME: "0"
                $scope.AMOUNT = 0;
                $scope.COVERS = 0;
                angular.forEach($scope.CASHUP_COMP_LIST, function (x) {
                    if (parseFloat(x.AMOUNT) > 0) {
                        $scope.AMOUNT = $scope.AMOUNT + x.AMOUNT;
                    }
                    if (parseFloat(x.COVERS) > 0) {
                        $scope.COVERS = $scope.COVERS + parseFloat(x.COVERS);
                    }
                })
                $scope.SELECTED_DATA = {
                    'BRANCH_NAME': '',
                    'CASHUP_DATE': '',
                    'AUTHORISED_BY': '',
                    'CHECK_NO': '',
                    'TABLE_NO': '',
                    'COVERS': $scope.COVERS,
                    'TIME': '',
                    'AMOUNT': $scope.AMOUNT,
                    'NOTE': '',
                };
                $scope.CASHUP_COMP_LIST.push($scope.SELECTED_DATA);
                $scope.EXCEL_REPORT_DATA_LIST = $scope.CASHUP_COMP_LIST;
                alasql('SELECT * INTO XLSX("COMPLIMENTARY_REPORT",{headers:true}) FROM ?', [$scope.EXCEL_REPORT_DATA_LIST]);
                $('#CASHUP_REPORT').modal('hide');
                $scope.LOADER_ICON = false;
                $scope.enable = "true"
            }
            else {
                $scope.$parent.ShowAlert("Attention", "No Records Found.", 3000);
                $scope.enable = "true";
                $scope.LOADER_ICON = false;
            }
        });

    };
    $scope.CASHUP_VOUCHER_REPORT = function (RPTID) {
        $scope.CASHUP_COMP_LIST = [];
        $scope.EXCEL_REPORT_DATA_LIST = [];
        $scope.enable = "false";
        $scope.LOADER_ICON = true;
        CashupModel = new Object();
        CashupModel.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CashupModel.START_DATE = (new Date($scope.ReportSearch.START_DATE)).toDateString();
        CashupModel.END_DATE = (new Date($scope.ReportSearch.END_DATE)).toDateString();
        CashupModel.BRANCH_IDS = $scope.ReportSearch.BRANCH_ID;
        PrcCommMethods.REPORT_API(CashupModel, 'CASHUP_VOUCHER_REPORT').then(function (data) {
            if (data.data != null && data.data.Table.length > 0) {
                $scope.CASHUP_VOUCHER_REPORT = data.data.Table;
                angular.forEach($scope.CASHUP_VOUCHER_REPORT, function (item) {
                    $scope.SELECTED_DATA = [];
                    $scope.SELECTED_DATA =
                        {
                            'ENTITY NAME': item.ENTITY_NAME,
                            'BRANCH NAME': item.BRANCH_NAME,
                            'CASHUP DATE': item.CASHUP_DATE == null ? '' : PrcCommMethods.formatDate(new Date(item.CASHUP_DATE), 'dd/MM/yyyy'),
                            'SESSION NAME': item.SESSION_NAME == null ? '' : item.SESSION_NAME,
                            'REEDEEMED/SOLD': item.REEDEEMED_SOLD == null ? '' : item.REEDEEMED_SOLD,
                            'VOUCHER TYPE': item.VOUCHER_TYPE == null ? '00' : item.VOUCHER_TYPE,
                            'VOUCHER NO.': item.VOUCHER_NO == null ? 0 : item.VOUCHER_NO,
                            'AMOUNT': parseFloat(item.AMOUNT),
                            'VALIDITY DATE': item.VALIDITY_DATE == null ? '' : PrcCommMethods.formatDate(new Date(item.VALIDITY_DATE), 'dd/MM/yyyy'),
                            'SOLD TO/REDEMED BY': item.SOLD_TO_REDEMED_BY == null ? '' : item.SOLD_TO_REDEMED_BY,
                            'PAYMENT METHOD': item.PAYMENT_METHOD == null ? '' : item.PAYMENT_METHOD,
                            'INVOICE NO.': item.INVOICE_NO == null ? '' : item.INVOICE_NO
                        };
                    $scope.EXCEL_REPORT_DATA_LIST.push($scope.SELECTED_DATA);
                });
                //$scope.CASHUP_VOUCHER_REPORT.push($scope.SELECTED_DATA);
                //$scope.EXCEL_REPORT_DATA_LIST = $scope.CASHUP_VOUCHER_REPORT;
                alasql('SELECT * INTO XLSX("CASHUP VOUCHERS REPORT",{headers:true}) FROM ?', [$scope.EXCEL_REPORT_DATA_LIST]);
                $('#CASHUP_REPORT').modal('hide');
                $scope.LOADER_ICON = false;
                $scope.enable = "true"
            }
            else {
                $scope.$parent.ShowAlert("Attention", "No Records Found.", 3000);
                $scope.enable = "true";
                $scope.LOADER_ICON = false;
            }
        });

    };

    var weekpicker, start_date, end_date;
    $scope.START_DAY_OF_WEEK = 0;
    //if (JSON.parse($localStorage.ENTITY_SETTINGS).length > 0) {
    //    $scope.START_DAY_OF_WEEK = JSON.parse($localStorage.ENTITY_SETTINGS).filter(x => x.SETTING_ID == 4)[0]["SETTING_VALUE"];
    //    if ($scope.START_DAY_OF_WEEK == null || $scope.START_DAY_OF_WEEK == undefined || $scope.START_DAY_OF_WEEK == '') {
    //        $scope.START_DAY_OF_WEEK = 0;
    //    }
    //}
    function set_week_picker(date, FLAG) {
        var count = 0;
        start_date = new Date(date.getFullYear(), date.getMonth(), parseInt($scope.START_DAY_OF_WEEK) + date.getDate() - date.getDay());
        end_date = new Date(date.getFullYear(), date.getMonth(), parseInt($scope.START_DAY_OF_WEEK) + date.getDate() - date.getDay() + 6);
        if (start_date > date) {
            if (FLAG == 1) {
                var increasedays = start_date.getDate() - date.getDate();
                start_date = new Date(date.getFullYear(), date.getMonth(), start_date.getDate() - ((7 - increasedays) + increasedays));
                end_date = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() + (1 + increasedays));
            }
        }
        weekpicker.datepicker('update', start_date);
        $scope.ReportSearch.REPORT_START_DATE = start_date;
        $scope.ReportSearch.REPORT_END_DATE = end_date;

        var StartDD = start_date.getDate();
        var Startmm = start_date.getMonth() + 1;
        var start_dateyyyy = start_date.getFullYear();
        var EndDD = end_date.getDate();
        var Endmm = end_date.getMonth() + 1;
        var Endyyyy = end_date.getFullYear();

        if (StartDD < 10) { dd = '0' + StartDD; }
        if (Startmm < 10) { Startmm = '0' + Startmm; }
        var start_dateddmmyy = StartDD + '/' + Startmm + '/' + start_dateyyyy;
        if (EndDD < 10) { EndDD = '0' + EndDD; }
        if (Endmm < 10) { Endmm = '0' + Endmm; }
        var end_dateddmmyy = EndDD + '/' + Endmm + '/' + Endyyyy;
        weekpicker.val(start_dateddmmyy + ' - ' + end_dateddmmyy);
        $scope.REPORT_BETWEEN_DATE = start_dateddmmyy + ' - ' + end_dateddmmyy;
    };
    $scope.DATEPICKERDATE_FY = function (date) {
        weekpicker = $('.week-picker');
        weekpicker.datepicker({
            weekStart: parseInt($scope.START_DAY_OF_WEEK),
            autoclose: true,
            forceParse: false,
            container: '#week-picker-wrapper',

        }).on("changeDate", function (e) {
            set_week_picker(e.date);
        });
        $('.week-prev').on('click', function () {
            var prev = new Date(start_date.getTime());
            prev.setDate(prev.getDate() - 6);
            set_week_picker(prev);
        });
        $('.week-next').on('click', function () {
            var next = new Date(end_date.getTime());
            next.setDate(next.getDate() + 1);
            set_week_picker(next);
        });
        set_week_picker(date, 1);
    }
    $scope.DATEPICKERDATE_FY(new Date());
    $scope.MRKTMN_WASTE_EVENT_REPORT = function (RPTID) {
        $scope.MRKTMN_WASTE_EVENT_LIST = [];
        $scope.EXCEL_REPORT_DATA_LIST = [];
        $scope.enable = "false";

        RPTModelObj = new Object();
        RPTModelObj.START_DATE = (new Date($scope.ReportSearch.START_DATE)).toDateString();
        RPTModelObj.END_DATE = (new Date($scope.ReportSearch.END_DATE)).toDateString();
        RPTModelObj.BRANCH_ID = $scope.ReportSearch.BRANCH_ID == null ? "" : $scope.ReportSearch.BRANCH_ID;
        if ($scope.ReportSearch.BRANCH_ID == null || $scope.ReportSearch.BRANCH_ID == "") {
            $scope.$parent.ShowAlert('Attention', 'Please Select Branch.', 3000);
            $scope.LOADER_ICON = false;
        }
        else {
            $scope.LOADER_ICON = true;
            PrcCommMethods.REPORT_API(RPTModelObj, 'MRKTMN_WASTE_EVENT_REPORT').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.REPORT_DATA_LIST = [];
                    $scope.REPORT_DATA_LIST = data.data.Table;
                    $scope.JSON_COLUMN_NAME = Object.keys(data.data.Table[0]);
                    angular.forEach($scope.REPORT_DATA_LIST, function (item) {
                        $scope.SELECTED_DATA = [];
                        for (var i = 0; i < $scope.JSON_COLUMN_NAME.length; i++) {
                            item[$scope.JSON_COLUMN_NAME[i]] == null ? item[$scope.JSON_COLUMN_NAME[i]] = "" : item[$scope.JSON_COLUMN_NAME[i]] = item[$scope.JSON_COLUMN_NAME[i]];
                        }
                        $scope.EXCEL_REPORT_DATA_LIST.push(item);
                    });
                    $scope.DOWNLOAD_EXCEL();
                }
                else {
                    $scope.$parent.ShowAlert("Success", "No Records Found.", 3000);
                }
                $scope.enable = "true";
                $scope.LOADER_ICON = false;
            });
        }
    };
    $scope.MRKTMN_MENU_PROFITABILITY_REPORT = function (RPTID) {
        $scope.MRKTMN_WASTE_EVENT_LIST = [];
        $scope.EXCEL_REPORT_DATA_LIST = [];
        $scope.enable = "false";

        RPTModelObj = new Object();
        RPTModelObj.START_DATE = (new Date($scope.ReportSearch.START_DATE)).toDateString();
        RPTModelObj.END_DATE = (new Date($scope.ReportSearch.END_DATE)).toDateString();
        RPTModelObj.BRANCH_ID = $scope.ReportSearch.BRANCH_ID == null ? "" : $scope.ReportSearch.BRANCH_ID;
        if ($scope.ReportSearch.BRANCH_ID == null || $scope.ReportSearch.BRANCH_ID == "") {
            $scope.$parent.ShowAlert('Attention', 'Please Select Branch.', 3000);
            $scope.LOADER_ICON = false;
        }
        else {
            $scope.LOADER_ICON = true;
            PrcCommMethods.REPORT_API(RPTModelObj, 'MRKTMN_MENU_PROFITABILITY_REPORT').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.REPORT_DATA_LIST = [];
                    $scope.REPORT_DATA_LIST = data.data.Table;
                    $scope.JSON_COLUMN_NAME = Object.keys(data.data.Table[0]);
                    angular.forEach($scope.REPORT_DATA_LIST, function (item) {
                        $scope.SELECTED_DATA = [];
                        for (var i = 0; i < $scope.JSON_COLUMN_NAME.length; i++) {
                            item[$scope.JSON_COLUMN_NAME[i]] == null ? item[$scope.JSON_COLUMN_NAME[i]] = "" : item[$scope.JSON_COLUMN_NAME[i]] = item[$scope.JSON_COLUMN_NAME[i]];
                        }
                        $scope.EXCEL_REPORT_DATA_LIST.push(item);
                    });
                    $scope.DOWNLOAD_EXCEL();
                }
                else {
                    $scope.$parent.ShowAlert("Success", "No Records Found.", 3000);
                }
                $scope.enable = "true";
                $scope.LOADER_ICON = false;
            });
        }
    };
    $scope.HR_EMPLOYEE_COMPENSATION_CHANGE_REPORT = function (RPTID) {
        $scope.enable = "false";
        $scope.RPTID = RPTID;
        $scope.LOADER_ICON = true;
        var IS_VALID_CNT = 0;
        if ($scope.ReportSearch.END_DATE == undefined || $scope.ReportSearch.END_DATE == null || $scope.ReportSearch.END_DATE == '' || $scope.ReportSearch.START_DATE == undefined || $scope.ReportSearch.START_DATE == null || $scope.ReportSearch.START_DATE == '') {
            $scope.$parent.ShowAlert("Error", "Please select Start and End Date", 3000);
            $scope.enable = "true";
            $scope.LOADER_ICON = false;
            IS_VALID_CNT = 1;
        }
        else if (new Date($scope.ReportSearch.END_DATE) < new Date($scope.ReportSearch.START_DATE)) {
            $scope.$parent.ShowAlert("Error", "End Date should be greater than start date", 3000);
            $scope.enable = "true";
            $scope.LOADER_ICON = false;
            IS_VALID_CNT = 2;
        }
        if (IS_VALID_CNT == 0) {

            RPTModelObj = new Object();
            RPTModelObj.ENTITY_ID = parseInt($cookies.get('ENTITY_ID'));
            RPTModelObj.BRANCH_ID = $scope.ReportSearch.BRANCH_ID;
            RPTModelObj.START_DATE = $scope.ReportSearch.START_DATE;
            RPTModelObj.END_DATE = $scope.ReportSearch.END_DATE;
            PrcCommMethods.REPORT_API(RPTModelObj, 'HR_EMPLOYEE_COMPENSATION_CHANGE_REPORT').then(function (data) {
                if (data.data != null && data.data.Table.length > 0) {
                    $scope.REPORT_DATA_LIST = [];
                    $scope.REPORT_DATA_LIST = data.data.Table;
                    $scope.JSON_COLUMN_NAME = Object.keys(data.data.Table[0]);
                    angular.forEach($scope.REPORT_DATA_LIST, function (item) {
                        $scope.SELECTED_DATA = [];
                        for (var i = 0; i < $scope.JSON_COLUMN_NAME.length; i++) {
                            if ($scope.JSON_COLUMN_NAME[i] == 'Is Archived') {

                                item[$scope.JSON_COLUMN_NAME[i]] == 0 ? item[$scope.JSON_COLUMN_NAME[i]] = 'true' : item[$scope.JSON_COLUMN_NAME[i]] = 'false';
                            }
                            else if ($scope.JSON_COLUMN_NAME[i] == 'Archive Date') {
                                item[$scope.JSON_COLUMN_NAME[i]] == null ? item[$scope.JSON_COLUMN_NAME[i]] = "" : item[$scope.JSON_COLUMN_NAME[i]] = moment(item[$scope.JSON_COLUMN_NAME[i]]).format('DD/MM/YYYY');
                            }
                            else {
                                item[$scope.JSON_COLUMN_NAME[i]] == null ? item[$scope.JSON_COLUMN_NAME[i]] = "" : item[$scope.JSON_COLUMN_NAME[i]] = item[$scope.JSON_COLUMN_NAME[i]];
                            }
                            item["Search By Branch"] = $scope.ReportSearch.BRANCH_ID == null ? "" : $scope.BRANCH_LIST.filter(p => p.BRANCH_ID == $scope.ReportSearch.BRANCH_ID)[0]['BRANCH_NAME'];
                            item["Search By Start Date"] = moment($scope.ReportSearch.START_DATE).format('DD/MM/YYYY');
                            item["Search By End Date"] = moment($scope.ReportSearch.END_DATE).format('DD/MM/YYYY');
                        }
                        $scope.EXCEL_REPORT_DATA_LIST.push(item);
                    });
                    $scope.DOWNLOAD_EXCEL();
                }
                else {
                    $scope.$parent.ShowAlert("Success", "No Records Found.", 3000);
                    $scope.enable = "true";
                    $scope.LOADER_ICON = false;
                }
                $scope.enable = "true";
                $scope.LOADER_ICON = false;
            });
        }
    };

    $scope.HR_RIGHT_TO_WORK_DOCUMENTS_REPORT = function (RPTID) {
        $scope.enable = "false";
        $scope.RPTID = RPTID;
        $scope.LOADER_ICON = true;
        RPTModelObj = new Object();
        RPTModelObj.ENTITY_ID = parseInt($cookies.get('ENTITY_ID'));
        RPTModelObj.BRANCH_IDS = $scope.ReportSearch.BRANCH_ID == null ? "" : $scope.ReportSearch.BRANCH_ID;
        PrcCommMethods.REPORT_API(RPTModelObj, 'HR_RIGHT_TO_WORK_DOCUMENTS_REPORT').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.REPORT_DATA_LIST = data.data.Table;
                $scope.JSON_COLUMN_NAME = Object.keys(data.data.Table[0]);
                angular.forEach($scope.REPORT_DATA_LIST, function (item) {
                    $scope.SELECTED_DATA = [];
                    for (var i = 0; i < $scope.JSON_COLUMN_NAME.length; i++) {
                        if ($scope.JSON_COLUMN_NAME[i].toLowerCase() == "Right to work has been checked".toLowerCase()) {
                            if (item[$scope.JSON_COLUMN_NAME[i]] == null)
                                item[$scope.JSON_COLUMN_NAME[i]] = "";
                            else
                                item[$scope.JSON_COLUMN_NAME[i]] == true ? item[$scope.JSON_COLUMN_NAME[i]] = "Yes" : item[$scope.JSON_COLUMN_NAME[i]] = "No";
                        }
                        else {
                            item[$scope.JSON_COLUMN_NAME[i]] == null ? item[$scope.JSON_COLUMN_NAME[i]] = "" : item[$scope.JSON_COLUMN_NAME[i]] = item[$scope.JSON_COLUMN_NAME[i]];
                        }

                    }
                    $scope.EXCEL_REPORT_DATA_LIST.push(item);
                });
                $scope.DOWNLOAD_EXCEL();
                $scope.enable = "true";
                $scope.LOADER_ICON = false;
            }
            else {
                $scope.$parent.ShowAlert("Attention", "No Records Found.", 3000);
                $scope.enable = "true";
                $scope.LOADER_ICON = false;
            }

        });

    };
    $scope.ROTA_SHIFT_NO_SHOW_REPORT = function (RPTID) {
        $scope.enable = "false";
        $scope.RPTID = RPTID;
        $scope.LOADER_ICON = true;
        var IS_VALID_CNT = 0;
        if ($scope.ReportSearch.ROTA_END_DATE == undefined || $scope.ReportSearch.ROTA_END_DATE == null || $scope.ReportSearch.ROTA_END_DATE == '' || $scope.ReportSearch.ROTA_START_DATE == undefined || $scope.ReportSearch.ROTA_START_DATE == null || $scope.ReportSearch.ROTA_START_DATE == '') {
            $scope.$parent.ShowAlert("Error", "Please select Start and End Date", 3000);
            $scope.enable = "true";
            $scope.LOADER_ICON = false;
            IS_VALID_CNT = 1;
        }
        else if (new Date($scope.ReportSearch.ROTA_END_DATE) < new Date($scope.ReportSearch.ROTA_START_DATE)) {
            $scope.$parent.ShowAlert("Error", "End Date should be greater than start date", 3000);
            $scope.enable = "true";
            $scope.LOADER_ICON = false;
            IS_VALID_CNT = 2;
        }
        if (IS_VALID_CNT == 0) {
            //if ($scope.ReportSearch.ROTA_END_DATE != undefined && $scope.ReportSearch.ROTA_START_DATE != undefined) {
            RPTModelObj = new Object();
            RPTModelObj.ENTITY_ID = parseInt($cookies.get('ENTITY_ID'));
            RPTModelObj.START_DATE = $scope.ReportSearch.ROTA_START_DATE;
            RPTModelObj.END_DATE = $scope.ReportSearch.ROTA_END_DATE;
            RPTModelObj.BRANCH_IDS = $scope.ReportSearch.BRANCH_ID == null ? "" : $scope.ReportSearch.BRANCH_ID;
            RPTModelObj.SECTION_IDS = $scope.ReportSearch.SECTION_ID == null ? "" : $scope.ReportSearch.SECTION_ID;
            RPTModelObj.FLAG_103 = $scope.$parent.CheckSubModuleAccess(103);
            RPTModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
            RPTModelObj.SELF_98 = $scope.$parent.CheckSubModuleAccess(98) ? 1 : 0;
            RPTModelObj.BELOW_99 = $scope.$parent.CheckSubModuleAccess(99) ? 1 : 0;
            RPTModelObj.ALL_100 = $scope.$parent.CheckSubModuleAccess(100) ? 1 : 0;
            PrcCommMethods.REPORT_API(RPTModelObj, 'ROTA_SHIFT_NO_SHOW_REPORT').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.REPORT_DATA_LIST = [];
                    $scope.REPORT_DATA_LIST = data.data.Table;
                    $scope.JSON_COLUMN_NAME = Object.keys(data.data.Table[0]);
                    angular.forEach($scope.REPORT_DATA_LIST, function (item) {
                        $scope.SELECTED_DATA = [];
                        for (var i = 0; i < $scope.JSON_COLUMN_NAME.length; i++) {
                            item[$scope.JSON_COLUMN_NAME[i]] == null ? item[$scope.JSON_COLUMN_NAME[i]] = "" : item[$scope.JSON_COLUMN_NAME[i]] = item[$scope.JSON_COLUMN_NAME[i]];
                        }
                        $scope.EXCEL_REPORT_DATA_LIST.push(item);
                    });
                    angular.forEach($scope.REPORT_DATA_LIST, function (items) {
                        items["Search By Start Date"] = moment($scope.ReportSearch.ROTA_START_DATE).format('DD/MM/YYYY'),
                            items["Search By End Date"] = moment($scope.ReportSearch.ROTA_END_DATE).format('DD/MM/YYYY'),
                            items["Search By Location"] = $scope.ReportSearch.LOCATION_ID == null ? "" : $scope.LOCATION.filter(p => p.LOCATION_ID == $scope.ReportSearch.LOCATION_ID)[0]['LOCATION_NAME'],
                            items["Search By Branch"] = $scope.ReportSearch.BRANCH_ID == null ? "" : $scope.BRANCH_LIST.filter(p => p.BRANCH_ID == $scope.ReportSearch.BRANCH_ID)[0]['BRANCH_NAME'],
                            items["Search By Section"] = $scope.ReportSearch.SECTION_ID == null ? "" : $scope.SECTIONS.filter(p => p.TABLE_ID == $scope.ReportSearch.SECTION_ID)[0]['DISPLAY_TEXT']
                    });

                    $scope.DOWNLOAD_EXCEL();
                }
                else {
                    $scope.$parent.ShowAlert("Success", "No Records Found.", 3000);
                }
                $scope.enable = "true";
                $scope.LOADER_ICON = false;
            });
        }
        //else {
        //    $scope.$parent.ShowAlert("Error", "Please select Mandatory Fields", 3000);
        //    $scope.enable = "true";
        //    $scope.LOADER_ICON = false;
        //    return false;
        //}
    };
    $scope.GET_WEEKLY_CASHUP_REPORT_BY_SESSION_CATEGORY = function (RPTID, DISPLAY_HTML_FLAG) {
        $scope.CASHUP_REPORT_DATA_LIST = [];
        $scope.EXCEL_REPORT_DATA_LIST = [];
        $scope.enable = "false";
        $scope.LOADER_ICON = true;
        CashupModel = new Object();
        CashupModel.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CashupModel.START_DATE = (new Date($scope.ReportSearch.REPORT_START_DATE)).toDateString();
        CashupModel.END_DATE = (new Date($scope.ReportSearch.REPORT_END_DATE)).toDateString();
        CashupModel.BRANCH_ID = $scope.ReportSearch.BRANCH_ID;
        if (RPTID == 27)
            CashupModel.INCLUDE_CATEGORY_BIFURCATION_IN_REPORT = 0;
        if (RPTID == 28)
            CashupModel.INCLUDE_CATEGORY_BIFURCATION_IN_REPORT = 1;

        PrcCommMethods.REPORT_API(CashupModel, 'GET_WEEKLY_CASHUP_REPORT_BY_SESSION_CATEGORY').then(function (data) {
            if (data.data != null && data.data.Table1 != undefined) {

                $scope.CASHUP_REPORT_DATA_LIST = data.data.Table1;
                $scope.JSON_COLUMN_NAME = Object.keys(data.data.Table1[0]);
                $scope.CASHUP_REPORT_DATA_FOR_HTML = [];
                angular.forEach($scope.CASHUP_REPORT_DATA_LIST, function (item) {
                    var getEntityDate = new Date($scope.ReportSearch.REPORT_START_DATE);
                    CashupModel = new Object();
                    CashupModel.Session = item.Session;
                    for (var i = 0; i < 7; i++) {
                        var getDay = getEntityDate.getDay();
                        if (getDay == 0) {
                            CashupModel.SUNDAY = item.SUNDAY == null || item.SUNDAY == undefined ? item.SUNDAY : item.SUNDAY.toFixed(2);
                        }
                        if (getDay == 1) {
                            CashupModel.MONDAY = item.MONDAY == null || item.MONDAY == undefined ? item.MONDAY : item.MONDAY.toFixed(2);
                        }
                        if (getDay == 2) {
                            CashupModel.TUESDAY = item.TUESDAY == null || item.TUESDAY == undefined ? item.TUESDAY : item.TUESDAY.toFixed(2);
                        }
                        if (getDay == 3) {
                            CashupModel.WEDNESDAY = item.WEDNESDAY == null || item.WEDNESDAY == undefined ? item.WEDNESDAY : item.WEDNESDAY.toFixed(2);
                        }
                        if (getDay == 4) {
                            CashupModel.THURSDAY = item.THURSDAY == null || item.THURSDAY == undefined ? item.THURSDAY : item.THURSDAY.toFixed(2);
                        }
                        if (getDay == 5) {
                            CashupModel.FRIDAY = item.FRIDAY == null || item.FRIDAY == undefined ? item.FRIDAY : item.FRIDAY.toFixed(2);
                        }
                        if (getDay == 6) {
                            CashupModel.SATURDAY = item.SATURDAY == null || item.SATURDAY == undefined ? item.SATURDAY : item.SATURDAY.toFixed(2);
                        }
                        getEntityDate = getEntityDate.addDays(1);
                    }
                    CashupModel.TotalWeek = item.TotalWeek == null ? item.TotalWeek : item.TotalWeek.toFixed(2);
                    CashupModel.Var_Last_Week = item.Var_Last_Week == null ? item.Var_Last_Week : item.Var_Last_Week.toFixed(2);
                    CashupModel.Var_Last_Year = item.Var_Last_Year == null ? item.Var_Last_Year : item.Var_Last_Year.toFixed(2);
                    $scope.CASHUP_REPORT_DATA_FOR_HTML.push(CashupModel);

                });
                $scope.JSON_COLUMN_NAME = Object.keys($scope.CASHUP_REPORT_DATA_FOR_HTML[0]);
                $scope.JSON_COLUMN_NAME_FOR_HTML = Object.keys($scope.CASHUP_REPORT_DATA_FOR_HTML[0]);
                $scope.TEMP = [];
                angular.forEach($scope.JSON_COLUMN_NAME_FOR_HTML, function (jsonitem) {
                    if (jsonitem == "Session")
                        jsonitem = 'SESSION NAME';
                    if (jsonitem == "TotalWeek")
                        jsonitem = 'TOTAL WEEK';
                    if (jsonitem == "Var_Last_Week")
                        jsonitem = 'VAR. LAST WEEK';
                    if (jsonitem == "Var_Last_Year")
                        jsonitem = 'VAR. LAST YEAR';
                    $scope.TEMP.push(jsonitem);
                });
                $scope.JSON_COLUMN_NAME_FOR_HTML = []; $scope.JSON_COLUMN_NAME_FOR_HTML = $scope.TEMP;
                angular.forEach($scope.CASHUP_REPORT_DATA_FOR_HTML, function (item) {
                    $scope.SELECTED_DATA = [];
                    if (item.Session == "NET_REVENUE") { item.Session = "NET REVENUE"; }
                    if (item.Session == "Drinks") { item.Session = "DRINKS"; }
                    if (item.Session == "Food") { item.Session = "FOOD"; }
                    if (item.Session == "SRVC_CHARGE") { item.Session = "SERVICE CHARGE"; }
                    if (item.Session == "TOTAL_REVENUE") { item.Session = "TOTAL REVENUE"; }
                    if (item.Session == "TotalWeek") { item.Session = "TOTAL WEEK"; $scope.CSS_APPLY = "card-footer"; }
                    if (item.Session == "PETTY_CASH") { item.Session = "PETTY CASH"; }
                    if (item.Session == "VOUCHER_SOLD") { item.Session = "VOUCHER SOLD"; }
                    if (item.Session == "VOUCHER_REDEEMED") { item.Session = "VOUCHER REDEEMED"; }
                    if (item.Session == "DEPOSIT_SOLD") { item.Session = "DEPOSIT SOLD"; }
                    if (item.Session == "DEPOSIT_REDEEMED") { item.Session = "DEPOSIT REDEEMED"; }
                    if (item.Session == "ACCOUNT_RECEIVED") { item.Session = "ACCOUNT RECEIVED"; }
                    if (item.Session == "ACCOUNT_CREDIT") { item.Session = "ACCOUNT CREDIT"; }
                    if (item.Session == "Total Collection") { item.Session = "TOTAL COLLECTION"; $scope.CSS_APPLY = "card-footer"; }
                    if (item.Session == "VOID" || item.Session == "CASH") {
                        $scope.SELECTED_DATA[$scope.JSON_COLUMN_NAME[0]] = ' ';
                        $scope.SELECTED_DATA[$scope.JSON_COLUMN_NAME[1]] = ' ';
                        $scope.SELECTED_DATA[$scope.JSON_COLUMN_NAME[2]] = ' ';
                        $scope.SELECTED_DATA[$scope.JSON_COLUMN_NAME[3]] = ' ';
                        $scope.SELECTED_DATA[$scope.JSON_COLUMN_NAME[4]] = ' ';
                        $scope.SELECTED_DATA[$scope.JSON_COLUMN_NAME[5]] = ' ';
                        $scope.SELECTED_DATA[$scope.JSON_COLUMN_NAME[6]] = ' ';
                        $scope.SELECTED_DATA[$scope.JSON_COLUMN_NAME[7]] = ' ';
                        $scope.SELECTED_DATA[$scope.JSON_COLUMN_NAME[8]] = ' ';
                        $scope.SELECTED_DATA[$scope.JSON_COLUMN_NAME[9]] = ' ';
                        $scope.SELECTED_DATA[$scope.JSON_COLUMN_NAME[10]] = ' ';

                        $scope.EXCEL_REPORT_DATA_LIST.push($scope.SELECTED_DATA); $scope.SELECTED_DATA = [];
                    }

                    $scope.SELECTED_DATA[$scope.JSON_COLUMN_NAME[0]] = item[$scope.JSON_COLUMN_NAME[0]] == null ? '--' : item[$scope.JSON_COLUMN_NAME[0]];
                    $scope.SELECTED_DATA[$scope.JSON_COLUMN_NAME[1]] = item[$scope.JSON_COLUMN_NAME[1]] == null ? '--' : parseFloat(item[$scope.JSON_COLUMN_NAME[1]]).toFixed(2);
                    $scope.SELECTED_DATA[$scope.JSON_COLUMN_NAME[2]] = item[$scope.JSON_COLUMN_NAME[2]] == null ? '--' : parseFloat(item[$scope.JSON_COLUMN_NAME[2]]).toFixed(2);
                    $scope.SELECTED_DATA[$scope.JSON_COLUMN_NAME[3]] = item[$scope.JSON_COLUMN_NAME[3]] == null ? '--' : parseFloat(item[$scope.JSON_COLUMN_NAME[3]]).toFixed(2);
                    $scope.SELECTED_DATA[$scope.JSON_COLUMN_NAME[4]] = item[$scope.JSON_COLUMN_NAME[4]] == null ? '--' : parseFloat(item[$scope.JSON_COLUMN_NAME[4]]).toFixed(2);
                    $scope.SELECTED_DATA[$scope.JSON_COLUMN_NAME[5]] = item[$scope.JSON_COLUMN_NAME[5]] == null ? '--' : parseFloat(item[$scope.JSON_COLUMN_NAME[5]]).toFixed(2);
                    $scope.SELECTED_DATA[$scope.JSON_COLUMN_NAME[6]] = item[$scope.JSON_COLUMN_NAME[6]] == null ? '--' : parseFloat(item[$scope.JSON_COLUMN_NAME[6]]).toFixed(2);
                    $scope.SELECTED_DATA[$scope.JSON_COLUMN_NAME[7]] = item[$scope.JSON_COLUMN_NAME[7]] == null ? '--' : parseFloat(item[$scope.JSON_COLUMN_NAME[7]]).toFixed(2);
                    $scope.SELECTED_DATA[$scope.JSON_COLUMN_NAME[8]] = item[$scope.JSON_COLUMN_NAME[8]] == null ? '--' : parseFloat(item[$scope.JSON_COLUMN_NAME[8]]).toFixed(2);
                    $scope.SELECTED_DATA[$scope.JSON_COLUMN_NAME[9]] = item[$scope.JSON_COLUMN_NAME[9]] == null || item[$scope.JSON_COLUMN_NAME[9]] == '--' ? '--' : parseFloat(item[$scope.JSON_COLUMN_NAME[9]]).toFixed(2) + "%";
                    $scope.SELECTED_DATA[$scope.JSON_COLUMN_NAME[10]] = item[$scope.JSON_COLUMN_NAME[10]] == null || item[$scope.JSON_COLUMN_NAME[10]] == '--' ? '--' : parseFloat(item[$scope.JSON_COLUMN_NAME[10]]).toFixed(2) + "%";

                    $scope.EXCEL_REPORT_DATA_LIST.push($scope.SELECTED_DATA);
                    $scope.enable = "true";
                    $scope.LOADER_ICON = false;
                    $scope.CSS_APPLY = null;
                });
                if (DISPLAY_HTML_FLAG == undefined) {
                    {
                        if (RPTID == 27)
                            alasql('SELECT * INTO XLSX("WEEKLY CASHUP REPORT BY SESSION",{headers:true}) FROM ?', [$scope.EXCEL_REPORT_DATA_LIST]);
                        if (RPTID == 28)
                            alasql('SELECT * INTO XLSX("WEEKLY CASHUP REPORT BY SESSION CATEGORY",{headers:true}) FROM ?', [$scope.EXCEL_REPORT_DATA_LIST]);
                    }
                }
                if (DISPLAY_HTML_FLAG == 2) {
                    $scope.DISPLAY_HTML_FLAG = DISPLAY_HTML_FLAG;
                    if ($scope.CASHUP_REPORT_DATA_LIST.length > 0) {
                        $scope.SHOW_WEEKLY_CASHUP_HTML_TABLE_FLAG = true;
                        $('#CASHUP_REPORT').modal('hide');
                        $scope.DISPLAY_HTML_FLAG = null;
                    }
                }
                $('#CASHUP_REPORT').modal('hide');
                $scope.LOADER_ICON = false;
                $scope.enable = "true"
            }
            else {
                $scope.$parent.ShowAlert("Attention", "No Records Found.", 3000);
                $scope.enable = "true";
                $scope.LOADER_ICON = false;
            }
        });

    };
    $scope.GET_EPOS_SALES_REPORT = function (RPTID) {
        $scope.ReportForm.submitted = true;
        if ($scope.ReportForm.$valid) {
            $scope.enable = "false";
            $scope.LOADER_ICON = true;
            RPTModelObj = new Object();
            RPTModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            RPTModelObj.START_DATE = (new Date($scope.ReportSearch.START_DATE)).toDateString();
            RPTModelObj.END_DATE = (new Date($scope.ReportSearch.END_DATE)).toDateString();
            RPTModelObj.BRANCH_ID = $scope.ReportSearch.BRANCH_ID;
            PrcCommMethods.REPORT_API(RPTModelObj, 'GET_EPOS_SALES_REPORT').then(function (data) {
                if (data.data != null && data.data.Table.length > 0) {
                    var Table_count = 0;
                    var dataTableArray = [];
                    angular.forEach(data.data, function (data) {
                        dataTableArray[Table_count] = data;
                        Table_count += 1;
                    });
                    for (var i = 0; i < Table_count; i++) {
                        $scope.CASHUP_PAYMENT_DETAILS_REPORT_EXCEL_FILE_NAME = null;
                        $scope.CASHUP_REPORT_DATA_LIST = [];
                        if (i == 0 && data.data.Table.length > 0) {
                            $scope.CASHUP_PAYMENT_DETAILS_REPORT_EXCEL_FILE_NAME = dataTableArray[i][0]["NAME"];
                            $scope.JSON_COLUMN_NAME = [];
                            $scope.EXCEL_REPORT_DATA_LIST = [];
                            $scope.CASHUP_REPORT_DATA_LIST = [];
                            $scope.JSON_COLUMN_NAME = Object.keys(dataTableArray[i][0]);
                            $scope.CASHUP_REPORT_DATA_LIST = dataTableArray[i];
                            angular.forEach($scope.CASHUP_REPORT_DATA_LIST, function (item) {
                                for (var i = 0; i < $scope.JSON_COLUMN_NAME.length; i++) {
                                    item[$scope.JSON_COLUMN_NAME[i]] == null ? item[$scope.JSON_COLUMN_NAME[i]] = "" : item[$scope.JSON_COLUMN_NAME[i]] = item[$scope.JSON_COLUMN_NAME[i]];
                                    if ($scope.JSON_COLUMN_NAME[i] == "CASHUP_DATE")
                                        item["CASHUP_DATE"] = moment(new Date(item["CASHUP_DATE"])).format('DD/MM/YYYY');
                                    if ($scope.JSON_COLUMN_NAME[i] == "OPEN_TIME")
                                        item["OPEN_TIME"] = moment(new Date(item["OPEN_TIME"])).format('HH:mm:ss');
                                    if ($scope.JSON_COLUMN_NAME[i] == "CLOSE_TIME")
                                        item["CLOSE_TIME"] = moment(new Date(item["CLOSE_TIME"])).format('HH:mm:ss');
                                }
                                $scope.EXCEL_REPORT_DATA_LIST.push(item);
                            });
                            alasql('SELECT * INTO XLSX("' + $scope.CASHUP_PAYMENT_DETAILS_REPORT_EXCEL_FILE_NAME + '",{headers:true}) FROM ?', [$scope.EXCEL_REPORT_DATA_LIST]);
                        }
                        else//(i == 1 && data.data.Table1.length > 0)
                        {
                            $scope.CASHUP_PAYMENT_DETAILS_REPORT_EXCEL_FILE_NAME = dataTableArray[i][0]["NAME"];
                            $scope.JSON_COLUMN_NAME = [];
                            $scope.EXCEL_REPORT_DATA_LIST = [];
                            $scope.CASHUP_REPORT_DATA_LIST = [];
                            $scope.JSON_COLUMN_NAME = Object.keys(dataTableArray[i][0]);
                            $scope.CASHUP_REPORT_DATA_LIST = dataTableArray[i];
                            angular.forEach($scope.CASHUP_REPORT_DATA_LIST, function (item) {
                                for (var i = 0; i < $scope.JSON_COLUMN_NAME.length; i++) {
                                    item[$scope.JSON_COLUMN_NAME[i]] == null ? item[$scope.JSON_COLUMN_NAME[i]] = "" : item[$scope.JSON_COLUMN_NAME[i]] = item[$scope.JSON_COLUMN_NAME[i]];
                                    if ($scope.JSON_COLUMN_NAME[i] == "CASHUP_DATE")
                                        item["CASHUP_DATE"] = moment(new Date(item["CASHUP_DATE"])).format('DD/MM/YYYY');
                                    if ($scope.JSON_COLUMN_NAME[i] == "TIME_OF_SALE")
                                        item["TIME_OF_SALE"] = moment(new Date(item["TIME_OF_SALE"])).format('HH:mm:ss');
                                }
                                $scope.EXCEL_REPORT_DATA_LIST.push(item);
                            });
                            alasql('SELECT * INTO XLSX("' + $scope.CASHUP_PAYMENT_DETAILS_REPORT_EXCEL_FILE_NAME + '",{headers:true}) FROM ?', [$scope.EXCEL_REPORT_DATA_LIST]);
                        }

                    }
                    $scope.LOADER_ICON = false;
                }
                else {
                    $scope.$parent.ShowAlert("Attention", "No Records Found.", 3000);
                    $scope.enable = "true";
                    $scope.LOADER_ICON = false;
                }
            });
        }
    };

    $scope.ROTA_SHIFT_BREAKDOWN_BY_SHIFT_TYPE_REPORT = function (RPTID) {
        $scope.enable = "false";
        $scope.RPTID = RPTID;
        $scope.LOADER_ICON = true;
        var IS_VALID_CNT = 0;
        if ($scope.ReportSearch.ROTA_END_DATE == undefined || $scope.ReportSearch.ROTA_END_DATE == null || $scope.ReportSearch.ROTA_END_DATE == '' || $scope.ReportSearch.ROTA_START_DATE == undefined || $scope.ReportSearch.ROTA_START_DATE == null || $scope.ReportSearch.ROTA_START_DATE == '') {
            $scope.$parent.ShowAlert("Error", "Please select Start and End Date", 3000);
            $scope.enable = "true";
            $scope.LOADER_ICON = false;
            IS_VALID_CNT = 1;
        }
        else if (new Date($scope.ReportSearch.ROTA_END_DATE) < new Date($scope.ReportSearch.ROTA_START_DATE)) {
            $scope.$parent.ShowAlert("Error", "End Date should be greater than start date", 3000);
            $scope.enable = "true";
            $scope.LOADER_ICON = false;
            IS_VALID_CNT = 2;
        }
        if (IS_VALID_CNT == 0) {
            //if ($scope.ReportSearch.ROTA_END_DATE != undefined && $scope.ReportSearch.ROTA_START_DATE != undefined) {
            RPTModelObj = new Object();
            RPTModelObj.ENTITY_ID = parseInt($cookies.get('ENTITY_ID'));
            RPTModelObj.START_DATE = $scope.ReportSearch.ROTA_START_DATE;
            RPTModelObj.END_DATE = $scope.ReportSearch.ROTA_END_DATE;
            RPTModelObj.BRANCH_IDS = $scope.ReportSearch.BRANCH_ID == null ? "" : $scope.ReportSearch.BRANCH_ID;
            RPTModelObj.SECTION_IDS = $scope.ReportSearch.SECTION_ID == null ? "" : $scope.ReportSearch.SECTION_ID;
            RPTModelObj.FLAG_103 = $scope.$parent.CheckSubModuleAccess(103);
            RPTModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
            RPTModelObj.SELF_98 = $scope.$parent.CheckSubModuleAccess(98) ? 1 : 0;
            RPTModelObj.BELOW_99 = $scope.$parent.CheckSubModuleAccess(99) ? 1 : 0;
            RPTModelObj.ALL_100 = $scope.$parent.CheckSubModuleAccess(100) ? 1 : 0;
            RPTModelObj.ADMIN_FLAG_48 = $scope.$parent.CheckSubModuleAccess(48) ? 1 : 0;///--1 FOR ADMIN AND 0 FOR OTHERS (FILL BY PREVILEGE 48)
            RPTModelObj.STATUS_FLAG = $scope.ReportSearch.STATUS_ID == null ? 0 : $scope.ReportSearch.STATUS_ID;
            PrcCommMethods.REPORT_API(RPTModelObj, 'ROTA_SHIFT_BREAKDOWN_BY_SHIFT_TYPE_REPORT').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.REPORT_DATA_LIST = [];
                    $scope.REPORT_DATA_LIST = data.data.Table;
                    $scope.JSON_COLUMN_NAME = Object.keys(data.data.Table[0]);
                    angular.forEach($scope.REPORT_DATA_LIST, function (item) {
                        $scope.SELECTED_DATA = [];
                        for (var i = 0; i < $scope.JSON_COLUMN_NAME.length; i++) {
                            item[$scope.JSON_COLUMN_NAME[i]] == null ? item[$scope.JSON_COLUMN_NAME[i]] = "" : item[$scope.JSON_COLUMN_NAME[i]] = item[$scope.JSON_COLUMN_NAME[i]];
                            if ($scope.JSON_COLUMN_NAME[i].toLowerCase() == "ANNUAL SALARY".toLowerCase()) {
                                if (item["ANNUAL SALARY"] == '********') {
                                    item["ANNUAL SALARY"] = '********';
                                }
                                else
                                    item["ANNUAL SALARY"] = item["ANNUAL SALARY"] == "" ? item["ANNUAL SALARY"] = 0 : parseFloat(parseFloat(item["ANNUAL SALARY"]).toFixed(2));
                            }
                            if ($scope.JSON_COLUMN_NAME[i].toLowerCase() == "RATE".toLowerCase()) {
                                if (item["RATE"] == '********') {
                                    item["RATE"] = '********';
                                }
                                else
                                    item["RATE"] = item["RATE"] == "" ? 0 : parseFloat(parseFloat(item["RATE"]).toFixed(2));
                            }
                            if ($scope.JSON_COLUMN_NAME[i].toLowerCase() == "CLOCKED IN SHIFT DURATION".toLowerCase()) {
                                item["CLOCKED IN SHIFT DURATION"] = parseFloat(parseFloat(item["CLOCKED IN SHIFT DURATION"]).toFixed(2));
                            }
                            if ($scope.JSON_COLUMN_NAME[i].toLowerCase() == "ASSIGNED SHIFT DURATION".toLowerCase()) {
                                item["ASSIGNED SHIFT DURATION"] = parseFloat(parseFloat(item["ASSIGNED SHIFT DURATION"]).toFixed(2));
                            }
                            if ($scope.JSON_COLUMN_NAME[i].toLowerCase() == "ASSIGNED SHIFT COST".toLowerCase()) {
                                if (item["ASSIGNED SHIFT COST"] == '****') {
                                    item["ASSIGNED SHIFT COST"] = '****';
                                }
                                else
                                    item["ASSIGNED SHIFT COST"] = item["ASSIGNED SHIFT COST"] == "" ? 0 : parseFloat(parseFloat(item["ASSIGNED SHIFT COST"]).toFixed(2));
                            }
                            if ($scope.JSON_COLUMN_NAME[i].toLowerCase() == "ASSIGNED + EMPLOYER SHIFT COST".toLowerCase()) {
                                if (item["ASSIGNED + EMPLOYER SHIFT COST"] == '****') {
                                    item["ASSIGNED + EMPLOYER SHIFT COST"] = '****';
                                }
                                else
                                    item["ASSIGNED + EMPLOYER SHIFT COST"] = item["ASSIGNED + EMPLOYER SHIFT COST"] == "" ? 0 : parseFloat(parseFloat(item["ASSIGNED + EMPLOYER SHIFT COST"]).toFixed(2));
                            }
                            if ($scope.JSON_COLUMN_NAME[i].toLowerCase() == "APPROVED SHIFT COST".toLowerCase()) {
                                if (item["APPROVED SHIFT COST"] == '****') {
                                    item["APPROVED SHIFT COST"] = '****';
                                }
                                else
                                    item["APPROVED SHIFT COST"] = item["APPROVED SHIFT COST"] == "" ? 0 : parseFloat(parseFloat(item["APPROVED SHIFT COST"]).toFixed(2));
                            }
                            if ($scope.JSON_COLUMN_NAME[i].toLowerCase() == "APPROVED + EMPLOYER SHIFT COST".toLowerCase()) {
                                if (item["APPROVED + EMPLOYER SHIFT COST"] == '****') {
                                    item["APPROVED + EMPLOYER SHIFT COST"] = '****';
                                }
                                else
                                    item["APPROVED + EMPLOYER SHIFT COST"] = item["APPROVED + EMPLOYER SHIFT COST"] == "" ? 0 : parseFloat(parseFloat(item["APPROVED + EMPLOYER SHIFT COST"]).toFixed(2));
                            }
                            if ($scope.JSON_COLUMN_NAME[i].toLowerCase() == "SHIFT DATE".toLowerCase()) {
                                item["SHIFT DATE"] = moment(item["SHIFT DATE"]).format('DD/MM/YYYY');
                            }
                            if ($scope.JSON_COLUMN_NAME[i].toLowerCase() == "APPROVED SHIFT COST".toLowerCase()) {
                                if (item["ASSIGNED SHIFT COST"] == '****') {
                                    item["VARIANCE"] = '****';
                                }
                                else
                                    item["VARIANCE"] = item["ASSIGNED SHIFT COST"] == "" ? parseFloat(0 - parseFloat(item[$scope.JSON_COLUMN_NAME[i]])) : parseFloat(parseFloat(item["ASSIGNED SHIFT COST"]) - parseFloat(item[$scope.JSON_COLUMN_NAME[i]]));
                            }
                        }
                        $scope.EXCEL_REPORT_DATA_LIST.push(item);
                    });
                    angular.forEach($scope.REPORT_DATA_LIST, function (items) {
                        items["Search By Start Date"] = moment($scope.ReportSearch.ROTA_START_DATE).format('DD/MM/YYYY'),
                            items["Search By End Date"] = moment($scope.ReportSearch.ROTA_END_DATE).format('DD/MM/YYYY'),
                            items["Search By Location"] = $scope.ReportSearch.LOCATION_ID == null ? "" : $scope.LOCATION.filter(p => p.LOCATION_ID == $scope.ReportSearch.LOCATION_ID)[0]['LOCATION_NAME'],
                            items["Search By Branch"] = $scope.ReportSearch.BRANCH_ID == null ? "" : $scope.BRANCH_LIST.filter(p => p.BRANCH_ID == $scope.ReportSearch.BRANCH_ID)[0]['BRANCH_NAME'],
                            items['Search By Status'] = $scope.ReportSearch.STATUS_ID == null ? "All" : $scope.ROTA_STATUS_FLAG.filter(p => p.STATUS_ID == $scope.ReportSearch.STATUS_ID)[0]['DISPLAY_TEXT']
                        items["Search By Section"] = $scope.ReportSearch.SECTION_ID == null ? "" : $scope.SECTIONS.filter(p => p.TABLE_ID == $scope.ReportSearch.SECTION_ID)[0]['DISPLAY_TEXT']
                    });

                    $scope.DOWNLOAD_EXCEL();
                }
                else {
                    $scope.$parent.ShowAlert("Success", "No Records Found.", 3000);
                }
                $scope.enable = "true";
                $scope.LOADER_ICON = false;
            });
        }
        //else {
        //    $scope.$parent.ShowAlert("Error", "Please select Mandatory Fields", 3000);
        //    $scope.enable = "true";
        //    $scope.LOADER_ICON = false;
        //    return false;
        //}
    };
    $scope.PO_PENDING_APPROVAL_REPORT = function (RPTID) {
        $scope.enable = "false"; $scope.LOADER_ICON = true;
        $scope.Fn_Fill_ENTITY_BRANCH_LIST();
        RPTModelObj = new Object();
        //RPTModelObj.ENTITY_ID = parseInt($cookies.get('ENTITY_ID'));
        //RPTModelObj.BRANCH_ID = $scope.ReportSearch.BRANCH_ID == null ? "" : $scope.ReportSearch.BRANCH_ID;
        RPTModelObj.ENTITY_BRANCH_LIST = $scope.ReportSearch.ENTITY_BRANCH_LIST;
        if ($scope.ReportSearch.ENTITY_BRANCH_LIST.length > 0) {
            PrcCommMethods.REPORT_API(RPTModelObj, 'PO_PENDING_APPROVAL_REPORT').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.REPORT_DATA_LIST = [];
                    $scope.REPORT_DATA_LIST = data.data.Table;
                    $scope.JSON_COLUMN_NAME = Object.keys(data.data.Table[0]);
                    angular.forEach($scope.REPORT_DATA_LIST, function (item) {
                        $scope.SELECTED_DATA = [];
                        for (var i = 0; i < $scope.JSON_COLUMN_NAME.length; i++) {
                            if ($scope.JSON_COLUMN_NAME[i].toLowerCase() == "Date".toLowerCase()) {
                                item["Date"] = moment(new Date(item[$scope.JSON_COLUMN_NAME[i]])).format('DD/MM/YYYY');
                            }
                            else if ($scope.JSON_COLUMN_NAME[i].toLowerCase() == "Pending Since".toLowerCase()) {
                                item["Pending Since"] = moment(new Date(item[$scope.JSON_COLUMN_NAME[i]])).format('DD/MM/YYYY');
                            }
                            else
                                item[$scope.JSON_COLUMN_NAME[i]] == null ? item[$scope.JSON_COLUMN_NAME[i]] = "" : item[$scope.JSON_COLUMN_NAME[i]] = item[$scope.JSON_COLUMN_NAME[i]];

                        }
                        $scope.EXCEL_REPORT_DATA_LIST.push(item);
                    });
                    //angular.forEach($scope.REPORT_DATA_LIST, function (items) {
                    //    items["Search By Branch"] = $scope.ReportSearch.BRANCH_ID == null ? "" : $scope.BRANCH_LIST.filter(p => p.BRANCH_ID == $scope.ReportSearch.BRANCH_ID)[0]['BRANCH_NAME']
                    //});
                    $scope.DOWNLOAD_EXCEL();
                }
                else {
                    $scope.$parent.ShowAlert("Success", "No Records Found.", 3000);
                }
                $scope.enable = "true";
                $scope.LOADER_ICON = false;
            });
        }
        else {
            $scope.$parent.ShowAlert("Attention", "Atleast one site should be selected", 3000);
            $scope.enable = "true";
            $scope.LOADER_ICON = false;
        }
    };
    $scope.INVOICE_PENDING_APPROVAL_REPORT = function (RPTID) {
        $scope.enable = "false"; $scope.LOADER_ICON = true;
        $scope.Fn_Fill_ENTITY_BRANCH_LIST();
        RPTModelObj = new Object();
        RPTModelObj.ENTITY_BRANCH_LIST = $scope.ReportSearch.ENTITY_BRANCH_LIST;
        PrcCommMethods.REPORT_API(RPTModelObj, 'INVOICE_PENDING_APPROVAL_REPORT').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.REPORT_DATA_LIST = [];
                $scope.REPORT_DATA_LIST = data.data.Table;
                $scope.JSON_COLUMN_NAME = Object.keys(data.data.Table[0]);
                angular.forEach($scope.REPORT_DATA_LIST, function (item) {
                    $scope.SELECTED_DATA = [];
                    for (var i = 0; i < $scope.JSON_COLUMN_NAME.length; i++) {
                        if ($scope.JSON_COLUMN_NAME[i].toLowerCase() == "Invoice Date".toLowerCase()) {
                            item["Invoice Date"] = moment(new Date(item[$scope.JSON_COLUMN_NAME[i]])).format('DD/MM/YYYY');
                        }
                        else if ($scope.JSON_COLUMN_NAME[i].toLowerCase() == "Pending Since".toLowerCase()) {
                            item["Pending Since"] = moment(new Date(item[$scope.JSON_COLUMN_NAME[i]])).format('DD/MM/YYYY');
                        }
                        else
                            item[$scope.JSON_COLUMN_NAME[i]] == null ? item[$scope.JSON_COLUMN_NAME[i]] = "" : item[$scope.JSON_COLUMN_NAME[i]] = item[$scope.JSON_COLUMN_NAME[i]];

                    }
                    $scope.EXCEL_REPORT_DATA_LIST.push(item);
                });
                //angular.forEach($scope.REPORT_DATA_LIST, function (items) {
                //    items["Search By Branch"] = $scope.ReportSearch.BRANCH_ID == null ? "" : $scope.BRANCH_LIST.filter(p => p.BRANCH_ID == $scope.ReportSearch.BRANCH_ID)[0]['BRANCH_NAME']
                //});
                $scope.DOWNLOAD_EXCEL();
            }
            else {
                $scope.$parent.ShowAlert("Success", "No Records Found.", 3000);
            }
            $scope.enable = "true";
            $scope.LOADER_ICON = false;
        });

    };
    $scope.APPROVED_PO_REPORT = function (RPTID) {
        $scope.enable = "false";
        $scope.RPTID = RPTID;
        $scope.LOADER_ICON = true;
        var IS_VALID_CNT = 0;
        if ($scope.ReportSearch.END_DATE == undefined || $scope.ReportSearch.END_DATE == null || $scope.ReportSearch.END_DATE == '' || $scope.ReportSearch.START_DATE == undefined || $scope.ReportSearch.START_DATE == null
            || $scope.ReportSearch.START_DATE == '') {
            $scope.$parent.ShowAlert("Error", "Please select Start and End Date", 3000);
            $scope.enable = "true";
            $scope.LOADER_ICON = false;
            IS_VALID_CNT = 1;
        }
        else if (new Date($scope.ReportSearch.END_DATE) < new Date($scope.ReportSearch.START_DATE)) {
            $scope.$parent.ShowAlert("Error", "End Date should be greater than start date", 3000);
            $scope.enable = "true";
            $scope.LOADER_ICON = false;
            IS_VALID_CNT = 2;
        }
        if (IS_VALID_CNT == 0) {
            RPTModelObj = new Object();
            RPTModelObj.ENTITY_ID = parseInt($cookies.get('ENTITY_ID'));
            RPTModelObj.BRANCH_ID = $scope.ReportSearch.BRANCH_ID == null ? "" : $scope.ReportSearch.BRANCH_ID;
            RPTModelObj.START_DATE = $scope.ReportSearch.START_DATE;
            RPTModelObj.END_DATE = $scope.ReportSearch.END_DATE;
            PrcCommMethods.REPORT_API(RPTModelObj, 'APPROVED_PO_REPORT').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.REPORT_DATA_LIST = [];
                    $scope.REPORT_DATA_LIST = data.data.Table;
                    $scope.JSON_COLUMN_NAME = Object.keys(data.data.Table[0]);
                    angular.forEach($scope.REPORT_DATA_LIST, function (item) {
                        $scope.SELECTED_DATA = [];
                        for (var i = 0; i < $scope.JSON_COLUMN_NAME.length; i++) {
                            if ($scope.JSON_COLUMN_NAME[i].toLowerCase() == "Delivery Date".toLowerCase()) {
                                item["Delivery Date"] = moment(new Date(item[$scope.JSON_COLUMN_NAME[i]])).format('DD/MM/YYYY');
                            }
                            else if ($scope.JSON_COLUMN_NAME[i].toLowerCase() == "Decision Date".toLowerCase()) {
                                item["Decision Date"] = moment(new Date(item[$scope.JSON_COLUMN_NAME[i]])).format('DD/MM/YYYY');
                            }
                            else if ($scope.JSON_COLUMN_NAME[i].toLowerCase() == "PO Date".toLowerCase()) {
                                item["PO Date"] = moment(new Date(item[$scope.JSON_COLUMN_NAME[i]])).format('DD/MM/YYYY');
                            }
                            else
                                item[$scope.JSON_COLUMN_NAME[i]] == null ? item[$scope.JSON_COLUMN_NAME[i]] = "" : item[$scope.JSON_COLUMN_NAME[i]] = item[$scope.JSON_COLUMN_NAME[i]];

                        }
                        $scope.EXCEL_REPORT_DATA_LIST.push(item);
                    });
                    angular.forEach($scope.REPORT_DATA_LIST, function (items) {
                        items["Search By Branch"] = $scope.ReportSearch.BRANCH_ID == null ? "" : $scope.BRANCH_LIST.filter(p => p.BRANCH_ID == $scope.ReportSearch.BRANCH_ID)[0]['BRANCH_NAME'],
                            items["Search By Start Date"] = moment($scope.ReportSearch.START_DATE).format('DD/MM/YYYY'),
                            items["Search By End Date"] = moment($scope.ReportSearch.END_DATE).format('DD/MM/YYYY')
                    });
                    $scope.DOWNLOAD_EXCEL();
                }
                else {
                    $scope.$parent.ShowAlert("Success", "No Records Found.", 3000);
                }
                $scope.enable = "true";
                $scope.LOADER_ICON = false;
            });
        }
    };
    $scope.ALL_PURCHASE_REQUEST_REPORT = function (RPTID) {
        $scope.enable = "false";
        $scope.RPTID = RPTID;
        $scope.LOADER_ICON = true;
        var IS_VALID_CNT = 0;
        if ($scope.ReportSearch.END_DATE == undefined || $scope.ReportSearch.END_DATE == null || $scope.ReportSearch.END_DATE == '' || $scope.ReportSearch.START_DATE == undefined || $scope.ReportSearch.START_DATE == null
            || $scope.ReportSearch.START_DATE == '') {
            $scope.$parent.ShowAlert("Error", "Please select Start and End Date", 3000);
            $scope.enable = "true";
            $scope.LOADER_ICON = false;
            IS_VALID_CNT = 1;
        }
        else if (new Date($scope.ReportSearch.END_DATE) < new Date($scope.ReportSearch.START_DATE)) {
            $scope.$parent.ShowAlert("Error", "End Date should be greater than start date", 3000);
            $scope.enable = "true";
            $scope.LOADER_ICON = false;
            IS_VALID_CNT = 2;
        }
        if (IS_VALID_CNT == 0) {
            RPTModelObj = new Object();
            RPTModelObj.ENTITY_ID = parseInt($cookies.get('ENTITY_ID'));
            RPTModelObj.BRANCH_ID = $scope.ReportSearch.BRANCH_ID == null ? "" : $scope.ReportSearch.BRANCH_ID;
            RPTModelObj.START_DATE = $scope.ReportSearch.START_DATE;
            RPTModelObj.END_DATE = $scope.ReportSearch.END_DATE;
            PrcCommMethods.REPORT_API(RPTModelObj, 'ALL_PURCHASE_REQUEST_REPORT').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.REPORT_DATA_LIST = [];
                    $scope.REPORT_DATA_LIST = data.data.Table;
                    $scope.JSON_COLUMN_NAME = Object.keys(data.data.Table[0]);
                    angular.forEach($scope.REPORT_DATA_LIST, function (item) {
                        $scope.SELECTED_DATA = [];
                        for (var i = 0; i < $scope.JSON_COLUMN_NAME.length; i++) {
                            if ($scope.JSON_COLUMN_NAME[i].toLowerCase() == "Delivery Date".toLowerCase()) {
                                item["Delivery Date"] = moment(new Date(item[$scope.JSON_COLUMN_NAME[i]])).format('DD/MM/YYYY');
                            }
                            else if ($scope.JSON_COLUMN_NAME[i].toLowerCase() == "Decision Date".toLowerCase()) {
                                item["Decision Date"] = moment(new Date(item[$scope.JSON_COLUMN_NAME[i]])).format('DD/MM/YYYY');
                            }
                            else if ($scope.JSON_COLUMN_NAME[i].toLowerCase() == "Request Date".toLowerCase()) {
                                item["Request Date"] = moment(new Date(item[$scope.JSON_COLUMN_NAME[i]])).format('DD/MM/YYYY');
                            }
                            else
                                item[$scope.JSON_COLUMN_NAME[i]] == null ? item[$scope.JSON_COLUMN_NAME[i]] = "" : item[$scope.JSON_COLUMN_NAME[i]] = item[$scope.JSON_COLUMN_NAME[i]];

                        }
                        $scope.EXCEL_REPORT_DATA_LIST.push(item);
                    });
                    angular.forEach($scope.REPORT_DATA_LIST, function (items) {
                        items["Search By Branch"] = $scope.ReportSearch.BRANCH_ID == null ? "" : $scope.BRANCH_LIST.filter(p => p.BRANCH_ID == $scope.ReportSearch.BRANCH_ID)[0]['BRANCH_NAME'],
                            items["Search By Start Date"] = moment($scope.ReportSearch.START_DATE).format('DD/MM/YYYY'),
                            items["Search By End Date"] = moment($scope.ReportSearch.END_DATE).format('DD/MM/YYYY')
                    });
                    $scope.DOWNLOAD_EXCEL();
                }
                else {
                    $scope.$parent.ShowAlert("Success", "No Records Found.", 3000);
                }
                $scope.enable = "true";
                $scope.LOADER_ICON = false;
            });
        }
    };
    $scope.ALL_PO_REPORT = function (RPTID) {
        $scope.enable = "false";
        $scope.RPTID = RPTID;
        $scope.LOADER_ICON = true;
        var IS_VALID_CNT = 0;
        if ($scope.ReportSearch.END_DATE == undefined || $scope.ReportSearch.END_DATE == null || $scope.ReportSearch.END_DATE == '' || $scope.ReportSearch.START_DATE == undefined || $scope.ReportSearch.START_DATE == null
            || $scope.ReportSearch.START_DATE == '') {
            $scope.$parent.ShowAlert("Error", "Please select Start and End Date", 3000);
            $scope.enable = "true";
            $scope.LOADER_ICON = false;
            IS_VALID_CNT = 1;
        }
        else if (new Date($scope.ReportSearch.END_DATE) < new Date($scope.ReportSearch.START_DATE)) {
            $scope.$parent.ShowAlert("Error", "End Date should be greater than start date", 3000);
            $scope.enable = "true";
            $scope.LOADER_ICON = false;
            IS_VALID_CNT = 2;
        }
        if (IS_VALID_CNT == 0) {
            RPTModelObj = new Object();
            RPTModelObj.ENTITY_ID = parseInt($cookies.get('ENTITY_ID'));
            RPTModelObj.BRANCH_ID = $scope.ReportSearch.BRANCH_ID == null ? "" : $scope.ReportSearch.BRANCH_ID;
            RPTModelObj.START_DATE = $scope.ReportSearch.START_DATE;
            RPTModelObj.END_DATE = $scope.ReportSearch.END_DATE;
            PrcCommMethods.REPORT_API(RPTModelObj, 'ALL_PO_REPORT').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.REPORT_DATA_LIST = [];
                    $scope.REPORT_DATA_LIST = data.data.Table;
                    $scope.JSON_COLUMN_NAME = Object.keys(data.data.Table[0]);
                    angular.forEach($scope.REPORT_DATA_LIST, function (item) {
                        $scope.SELECTED_DATA = [];
                        for (var i = 0; i < $scope.JSON_COLUMN_NAME.length; i++) {
                            if ($scope.JSON_COLUMN_NAME[i].toLowerCase() == "PO Date".toLowerCase()) {
                                item["PO Date"] = moment(new Date(item[$scope.JSON_COLUMN_NAME[i]])).format('DD/MM/YYYY');
                            }
                            else if ($scope.JSON_COLUMN_NAME[i].toLowerCase() == "Delivery Date".toLowerCase()) {
                                item["Delivery Date"] = moment(new Date(item[$scope.JSON_COLUMN_NAME[i]])).format('DD/MM/YYYY');
                            }
                            else if ($scope.JSON_COLUMN_NAME[i].toLowerCase() == "Decision Date".toLowerCase()) {
                                item["Decision Date"] = moment(new Date(item[$scope.JSON_COLUMN_NAME[i]])).format('DD/MM/YYYY');
                            }
                            else
                                item[$scope.JSON_COLUMN_NAME[i]] == null ? item[$scope.JSON_COLUMN_NAME[i]] = "" : item[$scope.JSON_COLUMN_NAME[i]] = item[$scope.JSON_COLUMN_NAME[i]];

                        }
                        $scope.EXCEL_REPORT_DATA_LIST.push(item);
                    });
                    angular.forEach($scope.REPORT_DATA_LIST, function (items) {

                        items["Search By Branch"] = $scope.ReportSearch.BRANCH_ID == null ? "" : $scope.BRANCH_LIST.filter(p => p.BRANCH_ID == $scope.ReportSearch.BRANCH_ID)[0]['BRANCH_NAME'],
                            items["Search By Start Date"] = moment($scope.ReportSearch.START_DATE).format('DD/MM/YYYY'),
                            items["Search By End Date"] = moment($scope.ReportSearch.END_DATE).format('DD/MM/YYYY')
                    });
                    $scope.DOWNLOAD_EXCEL();
                }
                else {
                    $scope.$parent.ShowAlert("Success", "No Records Found.", 3000);
                }
                $scope.enable = "true";
                $scope.LOADER_ICON = false;
            });
        }
    };
    $scope.CASHUP_PETTY_CASH_REPORT = function (RPTID) {
        $scope.CASHUP_COMP_LIST = [];
        $scope.EXCEL_REPORT_DATA_LIST = [];
        $scope.enable = "false";
        $scope.LOADER_ICON = true;
        CashupModel = new Object();
        CashupModel.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CashupModel.START_DATE = (new Date($scope.ReportSearch.START_DATE)).toDateString();
        CashupModel.END_DATE = (new Date($scope.ReportSearch.END_DATE)).toDateString();
        CashupModel.BRANCH_IDS = $scope.ReportSearch.BRANCH_ID;
        PrcCommMethods.REPORT_API(CashupModel, 'CASHUP_PETTY_CASH_REPORT').then(function (data) {
            if (data.data != null && data.data.Table.length > 0) {
                $scope.CASHUP_PETTY_CASH_REPORT = data.data.Table;

                angular.forEach($scope.CASHUP_PETTY_CASH_REPORT, function (item) {
                    $scope.SELECTED_DATA = [];
                    $scope.SELECTED_DATA =
                        {
                            'ENTITY NAME': item.ENTITY_NAME == null ? '' : item.ENTITY_NAME,
                            'BRANCH NAME': item.BRANCH_NAME == null ? '' : item.BRANCH_NAME,
                            'CASHUP DATE': item.CASHUP_DATE == null ? '' : PrcCommMethods.formatDate(new Date(item.CASHUP_DATE), 'dd/MM/yyyy'),
                            'SESSION NAME': item.SESSION_NAME == null ? '' : item.SESSION_NAME,
                            'VENDOR': item.VENDOR == null ? '' : item.VENDOR,
                            'CATEGORY NAME': item.CATEGORY_NAME == null ? '' : item.CATEGORY_NAME,
                            'GOODS': item.GOODS == null ? '' : item.GOODS,
                            'GROSS': item.GROSS == null ? '' : item.GROSS,
                            'APPROVER': item.APPROVER == null ? '' : item.APPROVER,
                            'VAT AMOUNT': item.VAT_AMOUNT == null ? '' : item.VAT_AMOUNT,
                            'NET AMOUNT': item.NET_AMOUNT == null ? 0 : parseFloat(item.NET_AMOUNT),
                        };
                    $scope.EXCEL_REPORT_DATA_LIST.push($scope.SELECTED_DATA);
                });
                alasql('SELECT * INTO XLSX("PETTY_CASH_REPORT",{headers:true}) FROM ?', [$scope.EXCEL_REPORT_DATA_LIST]);
                $('#CASHUP_REPORT').modal('hide');
                $scope.LOADER_ICON = false;
                $scope.enable = "true"
            }
            else {
                $scope.$parent.ShowAlert("Attention", "No Records Found.", 3000);
                $scope.enable = "true";
                $scope.LOADER_ICON = false;
            }
        });
    };
    $scope.CASHUP_DEPOSIT_REPORT = function (RPTID) {
        $scope.CASHUP_COMP_LIST = [];
        $scope.EXCEL_REPORT_DATA_LIST = [];
        $scope.enable = "false";
        $scope.LOADER_ICON = true;
        CashupModel = new Object();
        CashupModel.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CashupModel.START_DATE = (new Date($scope.ReportSearch.START_DATE)).toDateString();
        CashupModel.END_DATE = (new Date($scope.ReportSearch.END_DATE)).toDateString();
        CashupModel.BRANCH_IDS = $scope.ReportSearch.BRANCH_ID;
        PrcCommMethods.REPORT_API(CashupModel, 'CASHUP_DEPOSIT_REPORT').then(function (data) {
            if (data.data != null && data.data.Table.length > 0) {
                $scope.CASHUP_DEPOSIT_REPORT = data.data.Table;
                angular.forEach($scope.CASHUP_DEPOSIT_REPORT, function (item) {
                    $scope.SELECTED_DATA = [];
                    $scope.SELECTED_DATA =
                        {
                            'ENTITY NAME': item.ENTITY_NAME == null ? '' : item.ENTITY_NAME,
                            'BRANCH NAME': item.BRANCH_NAME == null ? '' : item.BRANCH_NAME,
                            'DATE': item.CASHUP_DATE == null ? '' : PrcCommMethods.formatDate(new Date(item.CASHUP_DATE), 'dd/MM/yyyy'),
                            'DEPOSIT_REFERENCE': item.DEPOSIT_REFERENCE == null ? '' : item.DEPOSIT_REFERENCE,
                            'DEPOSIT (Redeemed/Received)': item.DEPOSIT == null ? '' : item.DEPOSIT,
                            'AMOUNT': item.AMOUNT == null ? 0 : parseFloat(item.AMOUNT),
                            'INVOICE NO': item.INVOICE_NO == null ? '' : item.INVOICE_NO,
                            'NAME OF PAYEE': item.NAME_OF_PAYEE == null ? '' : item.NAME_OF_PAYEE,
                            'PAYMENT METHOD': item.PAYMENT_METHOD == null ? '' : item.PAYMENT_METHOD,
                            'NOTE': item.NOTE == null ? '' : item.NOTE,
                        };
                    $scope.EXCEL_REPORT_DATA_LIST.push($scope.SELECTED_DATA);
                });
                alasql('SELECT * INTO XLSX("CASHUP_DEPOSIT_REPORT",{headers:true}) FROM ?', [$scope.EXCEL_REPORT_DATA_LIST]);
                $('#CASHUP_REPORT').modal('hide');
                $scope.LOADER_ICON = false;
                $scope.enable = "true"
            }
            else {
                $scope.$parent.ShowAlert("Attention", "No Records Found.", 3000);
                $scope.enable = "true";
                $scope.LOADER_ICON = false;
            }
        });
    };
    $scope.CASHUP_ACCOUNT_CUSTOMER_REPORT = function (RPTID) {
        $scope.CASHUP_COMP_LIST = [];
        $scope.EXCEL_REPORT_DATA_LIST = [];
        $scope.enable = "false";
        $scope.LOADER_ICON = true;
        CashupModel = new Object();
        CashupModel.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CashupModel.START_DATE = (new Date($scope.ReportSearch.START_DATE)).toDateString();
        CashupModel.END_DATE = (new Date($scope.ReportSearch.END_DATE)).toDateString();
        CashupModel.BRANCH_IDS = $scope.ReportSearch.BRANCH_ID;
        PrcCommMethods.REPORT_API(CashupModel, 'CASHUP_ACCOUNT_CUSTOMER_REPORT').then(function (data) {
            if (data.data != null && data.data.Table.length > 0) {
                $scope.CASHUP_ACCOUNT_CUSTOMER_REPORT = data.data.Table;
                angular.forEach($scope.CASHUP_ACCOUNT_CUSTOMER_REPORT, function (item) {
                    $scope.SELECTED_DATA = [];
                    $scope.SELECTED_DATA =
                        {
                            'ENTITY NAME': item.ENTITY_NAME == null ? '' : item.ENTITY_NAME,
                            'BRANCH NAME': item.BRANCH_NAME == null ? '' : item.BRANCH_NAME,
                            'DATE': item.CASHUP_DATE == null ? '' : PrcCommMethods.formatDate(new Date(item.CASHUP_DATE), 'dd/MM/yyyy'),
                            'CUSTOMER NAME': item.CUSTOMER_NAME == null ? '' : item.CUSTOMER_NAME,
                            'COMPANY': item.COMPANY == null ? '' : item.COMPANY,
                            'AMOUNT': item.AMOUNT == null ? 0 : parseFloat(item.AMOUNT),
                            'INVOICE NO': item.INVOICE_NO == null ? '' : item.INVOICE_NO,
                            'PAYMENT_METHOD': item.PAYMENT_METHOD == null ? '' : item.PAYMENT_METHOD,
                            'NOTE': item.NOTE == null ? '' : item.NOTE,
                            'ACCOUNT(CREDIT/RECEIVED)': item.ACCOUNT == null ? '' : item.ACCOUNT,
                        };
                    $scope.EXCEL_REPORT_DATA_LIST.push($scope.SELECTED_DATA);
                });

                alasql('SELECT * INTO XLSX("ACCOUNT_CUSTOMER_REPORT",{headers:true}) FROM ?', [$scope.EXCEL_REPORT_DATA_LIST]);
                $('#CASHUP_REPORT').modal('hide');
                $scope.LOADER_ICON = false;
                $scope.enable = "true"
            }
            else {
                $scope.$parent.ShowAlert("Attention", "No Records Found.", 3000);
                $scope.enable = "true";
                $scope.LOADER_ICON = false;
            }
        });
    };
    $scope.GET_CASH_BANKING_REPORT = function (RPTID, DISPLAY_HTML_FLAG) {
        $scope.CASH_BANKING_REPORT_LIST = [];
        $scope.EXCEL_REPORT_DATA_LIST = [];

        $scope.enable = "false";
        $scope.LOADER_ICON = true;
        CashupModel = new Object();
        CashupModel.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CashupModel.START_DATE = (new Date($scope.ReportSearch.START_DATE)).toDateString();
        CashupModel.END_DATE = (new Date($scope.ReportSearch.END_DATE)).toDateString();
        CashupModel.BRANCH_ID = $scope.ReportSearch.BRANCH_ID;
        CashupModel.FLAG = RPTID == 12 ? 1 : 2;
        $scope.CASH_BANKING_TOTAL = 0;
        $scope.REPORT_BETWEEN_DATE = moment(new Date($scope.ReportSearch.START_DATE)).format("DD/MM/YYYY") + ' - ' + moment(new Date($scope.ReportSearch.END_DATE)).format("DD/MM/YYYY");
        PrcCommMethods.REPORT_API(CashupModel, 'GET_CASH_BANKING_REPORT').then(function (data) {

            if (data.data != null && data.data.Table.length > 0 && data.data.Table != undefined) {
                $scope.CASH_BANKING_REPORT_LIST = data.data.Table;
                $scope.EXCEL_REPORT_DATA_LIST = [];
                angular.forEach($scope.CASH_BANKING_REPORT_LIST, function (item) {
                    $scope.SELECTED_DATA = [];
                    $scope.SELECTED_DATA =
                        {
                            "ENTRY DATE": PrcCommMethods.formatDate(new Date(item.ENTRY_DATE), 'dd/MM/yyyy'),
                            "BANKED AMOUNT": item.BANKED_AMOUNT == null ? "" : parseFloat(item.BANKED_AMOUNT).toFixed(2),
                            "DEPOSITED BY": item.DEPOSITED_BY == null ? "" : item.DEPOSITED_BY,
                            "DEPOSIT DATE": item.DEPOSIT_DATE == null ? "" : PrcCommMethods.formatDate(new Date(item.DEPOSIT_DATE), 'dd/MM/yyyy'),
                            "BANK SLIP": item.BANK_SLIP == null ? "" : item.BANK_SLIP,
                            "NOTES": item.NOTES == null ? "" : item.NOTES,
                            'CASH-UP DATE RANGE - FROM': $scope.ReportSearch.START_DATE,
                            'CASH-UP DATE RANGE - TO': $scope.ReportSearch.END_DATE,
                            'BRANCH NAME': $scope.BRANCH_LIST.filter(p => p.BRANCH_ID == $scope.ReportSearch.BRANCH_ID).length == 0 ? "" : $scope.BRANCH_LIST.filter(p => p.BRANCH_ID == $scope.ReportSearch.BRANCH_ID)[0]['BRANCH_NAME']
                        };
                    if (item.BANKED_AMOUNT != null && item.BANKED_AMOUNT != "") {
                        $scope.CASH_BANKING_TOTAL += parseFloat(item.BANKED_AMOUNT);
                    }
                    $scope.EXCEL_REPORT_DATA_LIST.push($scope.SELECTED_DATA);
                });

                $scope.SELECTED_DATA = [];
                $scope.SELECTED_DATA =
                    {
                        "ENTRY DATE": "Total ",
                        "BANKED AMOUNT": $scope.CASH_BANKING_TOTAL,
                        "DEPOSITED BY": " ",
                        "DEPOSIT DATE": " ",
                        "BANK SLIP": " ",
                        "NOTES": " ",
                        "": "",
                        "": ""
                    };
                $scope.COMMON_CASHUP_REPORT_DATA_FOR_HTML = angular.copy($scope.EXCEL_REPORT_DATA_LIST);// only adding data without last column, which is adding amonut.
                $scope.EXCEL_REPORT_DATA_LIST.push($scope.SELECTED_DATA);

                // adding last column which sum of amout
                $scope.SELECTED_DATA = [];
                $scope.SELECTED_DATA =
                    {
                        "COMMON_TOTAL": "COMMON_TOTAL",
                        "COMMON_AMOUNT": $scope.CASH_BANKING_TOTAL,
                        "DEPOSITED BY": "",
                        "DEPOSIT DATE": "",
                        "BANK SLIP": "",
                        "NOTES": "",
                        "": "",
                        "": ""
                    };
                $scope.COMMON_CASHUP_REPORT_DATA_FOR_HTML.push($scope.SELECTED_DATA);
                $scope.COMMON_JSON_COLUMN_NAME_FOR_HTML = Object.keys($scope.COMMON_CASHUP_REPORT_DATA_FOR_HTML[0]);
                //------------//

                if (DISPLAY_HTML_FLAG == undefined)
                    alasql('SELECT * INTO XLSX("CASH_BANKING_REPORT",{headers:true}) FROM ?', [$scope.EXCEL_REPORT_DATA_LIST]);

                if (DISPLAY_HTML_FLAG == 2) {
                    $scope.DISPLAY_HTML_FLAG = DISPLAY_HTML_FLAG;
                    if ($scope.COMMON_CASHUP_REPORT_DATA_FOR_HTML.length > 0) {
                        $scope.COMMON_CASHUP_HTML_TABLE_FLAG = true;
                        //$('#CASHUP_REPORT').modal('hide');
                        $scope.DISPLAY_HTML_FLAG = null;
                    }
                }
                $scope.LOADER_ICON = false;
                $scope.enable = "true";
            }
            else {
                $scope.$parent.ShowAlert("Attention", "No Records Found.", 3000);
                $scope.enable = "true";
                $scope.LOADER_ICON = false;
            }
        });
    };
    $scope.GET_REVENUE_SUMMARY = function (RPTID, DISPLAY_HTML_FLAG) {

        $scope.DAYS_FLAG = false;
        var startdate = new Date($scope.ReportSearch.START_DATE);
        var enddate = new Date($scope.ReportSearch.END_DATE);
        var Difference_In_Time = enddate.getTime() - startdate.getTime();
        // Calculating the no. of days between
        // two dates
        var Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));
        if (Difference_In_Days <= 30) {
            $scope.DAYS_FLAG = true;
        }
        if ($scope.DAYS_FLAG) {
            $scope.CASHUP_REPORT_DATA_LIST = [];
            $scope.EXCEL_REPORT_DATA_LIST = [];
            $scope.enable = "false";
            $scope.LOADER_ICON = true;
            RPTModelObj = new Object();
            RPTModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            RPTModelObj.BRANCH_IDS = $scope.ReportSearch.BRANCH_ID == null ? '' : $scope.ReportSearch.BRANCH_ID;
            RPTModelObj.START_DATE = $scope.ReportSearch.START_DATE;//(new Date($scope.CashupReportSearch.REPORT_START_DATE)).toDateString(); //"Mon Jun 10 2024"; 
            RPTModelObj.END_DATE = $scope.ReportSearch.END_DATE;//(new Date($scope.CashupReportSearch.REPORT_END_DATE)).toDateString();//"Mon Jun 10 2024";
            $scope.ENTITY_LOGO = $cookies.get("LOGO_PATH");
            PrcCommMethods.REPORT_API(RPTModelObj, 'GET_REVENUE_SUMMARY').then(function (data) {

                if (data.data != null && data.data.Table1 != undefined) {
                    $scope.TAB_OPENLIST = data.data.Table;
                    $scope.EPOS_DATA = data.data.Table1;
                    $scope.ACTUAL_DATA = data.data.Table2;
                    $scope.EPOS_CAT_DATA = data.data.Table3;
                    $scope.EPOS_HEADER_DATA = data.data.Table4;
                    $scope.TABLIST = data.data.Table5;
                    $scope.CURRENCYLIST = data.data.Table6;

                    $scope.EPOS_ACTUAL_LIST = [];
                    $scope.EPOS_ACTUAL_LIST.push({ ADD_IN_DAILY_TAKINGS: false, CASHUP_TAB_ID: 2, MEDIA: 'Float', SALES_AMT: 0, SORT_ORDER: 0, ACTUAL_AMT: $scope.ACTUAL_DATA[0].ACTUAL_FLOAT, VARIANCE_AMT: 0, FLAG: 0 });

                    for (var i = 0; i < $scope.TAB_OPENLIST.length; i++) {
                        var flag = true;
                        for (var j = 0; j < $scope.EPOS_DATA.length; j++) {
                            if ($scope.EPOS_DATA[j].MEDIA == $scope.TAB_OPENLIST[i].DISPLAY_NAME) {
                                $scope.EPOS_ACTUAL_LIST.push({ ADD_IN_DAILY_TAKINGS: $scope.EPOS_DATA[j].ADD_IN_DAILY_TAKINGS, CASHUP_TAB_ID: $scope.EPOS_DATA[j].CASHUP_TAB_ID, MEDIA: $scope.EPOS_DATA[j].MEDIA, SALES_AMT: $scope.EPOS_DATA[j].SALES_AMT, SORT_ORDER: $scope.EPOS_DATA[j].SORT_ORDER, ACTUAL_AMT: 0, VARIANCE_AMT: 0, FLAG: 0 });
                                flag = false;
                                break;
                            }
                        }
                        if (flag) {
                            $scope.EPOS_ACTUAL_LIST.push({ ADD_IN_DAILY_TAKINGS: $scope.TAB_OPENLIST[i].ADD_IN_DAILY_TAKINGS, CASHUP_TAB_ID: $scope.TAB_OPENLIST[i].CASHUP_TAB_ID, MEDIA: $scope.TAB_OPENLIST[i].DISPLAY_NAME, SALES_AMT: 0, SORT_ORDER: $scope.TAB_OPENLIST[i].ID, ACTUAL_AMT: 0, VARIANCE_AMT: 0, FLAG: 0 });

                        }
                    }
                    $scope.EPOS_DATA.filter(function (x) {

                        if (x.MEDIA == "Unclassified") {
                            if (x.SALES_AMT != 0) {
                                $scope.EPOS_ACTUAL_LIST.push({ ADD_IN_DAILY_TAKINGS: x.ADD_IN_DAILY_TAKINGS, CASHUP_TAB_ID: x.CASHUP_TAB_ID, MEDIA: x.MEDIA, SALES_AMT: x.SALES_AMT, SORT_ORDER: x.SORT_ORDER, ACTUAL_AMT: 0, VARIANCE_AMT: 0, FLAG: 0 });
                            }
                        }
                    });
                    if ($scope.EPOS_ACTUAL_LIST.length > 0) {
                        angular.forEach($scope.EPOS_ACTUAL_LIST, function (val) {
                            for (var i = 0; i < $scope.TABLIST.length; i++) {
                                if (val.CASHUP_TAB_ID == $scope.TABLIST[i].CASHUP_TABS_ID) {
                                    val.FLAG = $scope.TABLIST[i].FLAG;
                                    break;
                                }
                            }
                        })
                    }
                    angular.forEach($scope.EPOS_ACTUAL_LIST, function (val) {
                        if (val.MEDIA == 'Cash') {
                            val.ACTUAL_AMT = $scope.ACTUAL_DATA[0].ACTUAL_CASH;
                            val.VARIANCE_AMT = $scope.ACTUAL_DATA[0].ACTUAL_CASH - val.SALES_AMT;
                        } else if (val.MEDIA == 'Cards') {
                            val.ACTUAL_AMT = $scope.ACTUAL_DATA[0].ACTUAL_CARDS;
                            val.VARIANCE_AMT = $scope.ACTUAL_DATA[0].ACTUAL_CARDS - val.SALES_AMT;
                        } else if (val.MEDIA == 'Petty Cash') {
                            val.ACTUAL_AMT = $scope.ACTUAL_DATA[0].ACTUAL_PETTY_CASH;
                            val.VARIANCE_AMT = $scope.ACTUAL_DATA[0].ACTUAL_PETTY_CASH - val.SALES_AMT;
                        } else if (val.MEDIA == 'Delivery') {
                            val.ACTUAL_AMT = $scope.ACTUAL_DATA[0].CHEQUE;
                            val.VARIANCE_AMT = $scope.ACTUAL_DATA[0].CHEQUE - val.SALES_AMT;
                        } else if (val.MEDIA == 'Account Credit') {
                            val.ACTUAL_AMT = $scope.ACTUAL_DATA[0].ACTUAL_ACCOUNT_TOTAL;
                            val.VARIANCE_AMT = $scope.ACTUAL_DATA[0].ACTUAL_ACCOUNT_TOTAL - val.SALES_AMT;
                        } else if (val.MEDIA == 'Voucher Redeemed') {
                            val.ACTUAL_AMT = $scope.ACTUAL_DATA[0].ACTUAL_VOUCHER_REDEEMED;
                            val.VARIANCE_AMT = $scope.ACTUAL_DATA[0].ACTUAL_VOUCHER_REDEEMED - val.SALES_AMT;
                        } else if (val.MEDIA == 'Deposit Redeemed') {
                            val.ACTUAL_AMT = $scope.ACTUAL_DATA[0].DEPOSIT_REDEEMED;
                            val.VARIANCE_AMT = $scope.ACTUAL_DATA[0].DEPOSIT_REDEEMED - val.SALES_AMT;
                        } else if (val.MEDIA == 'Account Received') {
                            val.ACTUAL_AMT = $scope.ACTUAL_DATA[0].ACCOUNT_RECEIVED_TOTAL;
                            val.VARIANCE_AMT = $scope.ACTUAL_DATA[0].ACCOUNT_RECEIVED_TOTAL - val.SALES_AMT;
                        } else if (val.MEDIA == 'Voucher Issued') {
                            val.ACTUAL_AMT = $scope.ACTUAL_DATA[0].ACTUAL_VOUCHER_ISSUED;
                            val.VARIANCE_AMT = $scope.ACTUAL_DATA[0].ACTUAL_VOUCHER_ISSUED - val.SALES_AMT;
                        } else if (val.MEDIA == 'Deposit Received') {
                            val.ACTUAL_AMT = $scope.ACTUAL_DATA[0].DEPOSIT_RECEIVED;
                            val.VARIANCE_AMT = $scope.ACTUAL_DATA[0].DEPOSIT_RECEIVED - val.SALES_AMT;
                        } else if (val.MEDIA == 'Transitory') {
                            val.ACTUAL_AMT = val.SALES_AMT;
                            val.VARIANCE_AMT = 0;
                            val.FLAG = 1;

                        } else if (val.MEDIA == 'Unclassified') {
                            val.ACTUAL_AMT = 0;
                            val.VARIANCE_AMT = - val.SALES_AMT;
                            val.FLAG = 1;
                        }
                    })
                    $scope.VARIANCE_TOTAL = 0;
                    $scope.ACTUAL_TOTAL = 0;
                    $scope.EPOS_TOTAL = 0;
                    angular.forEach($scope.EPOS_ACTUAL_LIST, function (Variance) {
                        if (Variance.ADD_IN_DAILY_TAKINGS) {
                            $scope.VARIANCE_TOTAL += Variance.VARIANCE_AMT;
                            $scope.ACTUAL_TOTAL += Variance.ACTUAL_AMT;
                            $scope.EPOS_TOTAL += Variance.SALES_AMT;
                        }
                    })
                    $scope.VARIANCE_TOTAL_INVALID = 0;
                    $scope.ACTUAL_TOTAL_INVALID = 0;
                    angular.forEach($scope.EPOS_ACTUAL_LIST, function (Variance) {
                        if (!Variance.ADD_IN_DAILY_TAKINGS) {
                            $scope.VARIANCE_TOTAL_INVALID += Variance.VARIANCE_AMT;
                            $scope.ACTUAL_TOTAL_INVALID += Variance.ACTUAL_AMT;
                        }
                    })

                    $scope.CASHUP_REPORT_DATA_LIST = data.data.Table2;
                    //$scope.SHOW_REVENUE_CASHUP_HTML_TABLE_FLAG = true;
                    $scope.ARY_LIST = [];
                    angular.forEach($scope.EPOS_ACTUAL_LIST, function (x) {
                        if (x.ADD_IN_DAILY_TAKINGS == true && x.FLAG == 1) {
                            $scope.ARY_LIST.push({ 'MEDIA': x.MEDIA, 'EPOS': x.SALES_AMT.toFixed(2), 'Actual': x.ACTUAL_AMT.toFixed(2), 'Variance': x.VARIANCE_AMT.toFixed(2), 'NET_TOTAL': '' });
                        }
                    })
                    $scope.ARY_LIST.push({ 'MEDIA': 'Total (' + $scope.CURRENCYLIST[0].CODE + ')', 'EPOS': $scope.EPOS_TOTAL.toFixed(2), 'Actual': $scope.ACTUAL_TOTAL.toFixed(2), 'Variance': $scope.VARIANCE_TOTAL.toFixed(2), 'NET_TOTAL': '' });

                    angular.forEach($scope.EPOS_ACTUAL_LIST, function (x) {
                        if (x.ADD_IN_DAILY_TAKINGS == false && x.FLAG == 1) {
                            $scope.ARY_LIST.push({ 'MEDIA': x.MEDIA, 'EPOS': x.SALES_AMT.toFixed(2), 'Actual': x.ACTUAL_AMT.toFixed(2), 'Variance': x.VARIANCE_AMT.toFixed(2), 'NET_TOTAL': '' });
                        }
                    })
                    $scope.ARY_LIST.push({ 'MEDIA': '', 'EPOS': '', 'Actual': '', 'Variance': '', 'NET_TOTAL': '' });
                    //$scope.ARY_CATDATA = [];
                    $scope.ARY_LIST.push({ 'MEDIA': 'Revenue Type', 'EPOS': 'Gross Exc. Disc.', 'Actual': 'Disc.', 'Variance': 'Vat', 'NET_TOTAL': 'Net_Exc_Disc' });
                    var EPOS_TOTAL_GROSS = 0; var EPOS_TOTAL_DISC_CPN = 0; var EPOS_TOTAL_VAT_TAX = 0; var EPOS_NET_TOTAL = 0;
                    angular.forEach($scope.EPOS_CAT_DATA, function (x) {
                        $scope.ARY_LIST.push({ 'MEDIA': x.CATEGORY_NAME, 'EPOS': (x.TOTAL_GROSS).toFixed(2), 'Actual': (x.TOTAL_DISC_CPN).toFixed(2), 'Variance': (x.TOTAL_VAT_TAX).toFixed(2), 'NET_TOTAL': (x.NET_TOTAL).toFixed(2) });

                        //  $scope.ARY_LIST.push({ 'CATEGORY_NAME': x.CATEGORY_NAME, 'TOTAL_GROSS': x.TOTAL_GROSS, 'TOTAL_DISC_CPN': x.TOTAL_DISC_CPN, 'TOTAL_VAT_TAX': x.TOTAL_VAT_TAX, 'NET_TOTAL': x.NET_TOTAL });
                        EPOS_TOTAL_GROSS += x.TOTAL_GROSS;
                        EPOS_TOTAL_DISC_CPN += x.TOTAL_DISC_CPN;
                        EPOS_TOTAL_VAT_TAX += x.TOTAL_VAT_TAX;
                        EPOS_NET_TOTAL += x.NET_TOTAL;
                    })
                    $scope.ARY_LIST.push({ 'MEDIA': 'Total (' + $scope.CURRENCYLIST[0].CODE + ')', 'EPOS': (EPOS_TOTAL_GROSS).toFixed(2), 'Actual': (EPOS_TOTAL_DISC_CPN).toFixed(2), 'Variance': (EPOS_TOTAL_VAT_TAX).toFixed(2), 'NET_TOTAL': (EPOS_NET_TOTAL).toFixed(2) });
                    $scope.ARY_LIST.push({ 'MEDIA': 'Service Charge', 'EPOS': '', 'Actual': '', 'Variance': '', 'NET_TOTAL': ($scope.EPOS_HEADER_DATA[0].SERVICE_CHARGE == null ? '0.00' : ($scope.EPOS_HEADER_DATA[0].SERVICE_CHARGE).toFixed(2)) });
                    $scope.ARY_LIST.push({ 'MEDIA': 'House Tips', 'EPOS': '', 'Actual': '', 'Variance': '', 'NET_TOTAL': ($scope.EPOS_HEADER_DATA[0].TIPS == null ? '0.00' : ($scope.EPOS_HEADER_DATA[0].TIPS).toFixed(2)) });
                    $scope.ARY_LIST.push({ 'MEDIA': '', 'EPOS': '', 'Actual': '', 'Variance': '', 'NET_TOTAL': '' });

                    //$scope.ARY_LIST.push({ 'MEDIA': 'Cashup_Entries', 'EPOS': 'EPOS', 'Actual': 'Actual', 'Variance': 'Variance', 'NET_TOTAL': '' });
                    if ($scope.EPOS_HEADER_DATA[0].VOID == null) {
                        $scope.EPOS_HEADER_DATA[0].VOID = 0;
                    }
                    if ($scope.EPOS_HEADER_DATA[0].COMPLIMENTARY == null) {
                        $scope.EPOS_HEADER_DATA[0].COMPLIMENTARY = 0;
                    }
                    //$scope.ARY_LIST.push({ 'MEDIA': 'Cashup_Entries', 'EPOS': 'EPOS', 'Actual': 'Actual', 'Variance': 'Variance', 'NET_TOTAL': '' });
                    $scope.ARY_LIST.push({ 'MEDIA': 'Void', 'EPOS': ($scope.EPOS_HEADER_DATA[0].VOID).toFixed(2), 'Actual': ($scope.ACTUAL_DATA[0].ACTUAL_VOID).toFixed(2), 'Variance': ($scope.ACTUAL_DATA[0].ACTUAL_VOID - ($scope.EPOS_HEADER_DATA[0].VOID.toFixed(2))).toFixed(2), 'NET_TOTAL': '' });
                    $scope.ARY_LIST.push({ 'MEDIA': 'Complimentary', 'EPOS': ($scope.EPOS_HEADER_DATA[0].COMPLIMENTARY).toFixed(2), 'Actual': ($scope.ACTUAL_DATA[0].ACTUAL_COMP).toFixed(2), 'Variance': ($scope.ACTUAL_DATA[0].ACTUAL_COMP - ($scope.EPOS_HEADER_DATA[0].COMPLIMENTARY.toFixed(2))).toFixed(2), 'NET_TOTAL': '' });

                    //$scope.ARY_CATDATA = [];
                    //var EPOS_TOTAL_GROSS = 0; var EPOS_TOTAL_DISC_CPN = 0; var EPOS_TOTAL_VAT_TAX = 0; var EPOS_NET_TOTAL = 0;
                    //angular.forEach($scope.EPOS_CAT_DATA, function (x) {

                    //    $scope.ARY_CATDATA.push({ 'CATEGORY_NAME': x.CATEGORY_NAME, 'TOTAL_GROSS': x.TOTAL_GROSS, 'TOTAL_DISC_CPN': x.TOTAL_DISC_CPN, 'TOTAL_VAT_TAX': x.TOTAL_VAT_TAX, 'NET_TOTAL': x.NET_TOTAL });
                    //    EPOS_TOTAL_GROSS += x.TOTAL_GROSS;
                    //    EPOS_TOTAL_DISC_CPN += x.TOTAL_DISC_CPN;
                    //    EPOS_TOTAL_VAT_TAX += x.TOTAL_VAT_TAX;
                    //    EPOS_NET_TOTAL += x.NET_TOTAL;
                    //})
                    //$scope.ARY_CATDATA.push({ 'CATEGORY_NAME': 'Total', 'TOTAL_GROSS': EPOS_TOTAL_GROSS, 'TOTAL_DISC_CPN': EPOS_TOTAL_DISC_CPN, 'TOTAL_VAT_TAX': EPOS_TOTAL_VAT_TAX, 'NET_TOTAL': EPOS_NET_TOTAL });

                    angular.forEach($scope.ARY_LIST, function (x) {
                        $scope.SELECTED_DATA = [];
                        $scope.SELECTED_DATA =
                            {
                                'Cashup_Entries': x.MEDIA,
                                'EPOS': x.EPOS,
                                'Actual': x.Actual,
                                'Variance': x.Variance,
                                '': ((x.NET_TOTAL != '' && x.NET_TOTAL != 0) || x.NET_TOTAL == '0.00') ? x.NET_TOTAL : ''
                            };
                        $scope.EXCEL_REPORT_DATA_LIST.push($scope.SELECTED_DATA);


                    });


                    if (DISPLAY_HTML_FLAG == undefined) {
                        $scope.enable = "true";
                        $scope.LOADER_ICON = false;
                        //$('#CASHUP_REPORT').modal('hide');
                        alasql('SELECT * INTO XLSX("REVENUE_SUMMARY_REPORT ' + $scope.ReportSearch.START_DATE + '-' + $scope.ReportSearch.END_DATE + '",{headers:true}) FROM ?', [$scope.EXCEL_REPORT_DATA_LIST]);
                    }

                    if (DISPLAY_HTML_FLAG == 2) {
                        $scope.DISPLAY_HTML_FLAG = DISPLAY_HTML_FLAG;
                        if ($scope.EPOS_ACTUAL_LIST.length > 0) {
                            $scope.SHOW_REVENUE_CASHUP_HTML_TABLE_FLAG = true;
                            $('#CASHUP_REPORT').modal('hide');
                            $scope.DISPLAY_HTML_FLAG = null;
                            $scope.LOADER_ICON = false;
                        }
                    }
                }
                else {
                    $scope.$parent.ShowAlert("Attention", "No Records Found.", 3000);
                    $scope.enable = "true";
                    $scope.LOADER_ICON = false;
                }
            });
        } else {
            $scope.$parent.ShowAlert("Attention", "No of days not greater than 30 days.", 3000);
        }

    };
    $scope.GET_EPOS_CARD_PAYMENTS_REPORT = function (RPTID) {

        $scope.EPOS_CARD_PAYMENT = [];
        $scope.EXCEL_REPORT_DATA_LIST = [];
        $scope.enable = "false";
        $scope.LOADER_ICON = true;
        RPTModelObj = new Object();
        RPTModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        RPTModelObj.BRANCH_IDS = $scope.ReportSearch.BRANCH_ID == null ? '' : $scope.CashupReportSearch.BRANCH_ID;
        RPTModelObj.START_DATE = $scope.ReportSearch.START_DATE;//(new Date($scope.CashupReportSearch.REPORT_START_DATE)).toDateString(); //"Mon Jun 10 2024"; 
        RPTModelObj.END_DATE = $scope.ReportSearch.END_DATE;//(new Date($scope.CashupReportSearch.REPORT_END_DATE)).toDateString();//"Mon Jun 10 2024";

        PrcCommMethods.REPORT_API(RPTModelObj, 'GET_EPOS_CARD_PAYMENTS_REPORT').then(function (data) {

            if (data.data != null && data.data.Table != undefined) {
                $scope.EPOS_CARD_PAYMENT = data.data.Table;


                angular.forEach($scope.EPOS_CARD_PAYMENT, function (x) {
                    $scope.SELECTED_DATA = [];
                    $scope.SELECTED_DATA =
                        {
                            'Check Closing Time': $filter('date')(new Date(x.DATE_AND_TIME), 'MMM-dd-yyyy h:mm a'),
                            'Payment Method Code': x.PAYMENT_METHOD_CODE,
                            'Payment Method Description': x.PAYMENT_METHOD_DESCRIPTION,
                            'Check No': x.RECIPT_NUMBER,
                            'AMOUNT': x.AMOUNT
                        };
                    $scope.EXCEL_REPORT_DATA_LIST.push($scope.SELECTED_DATA);
                });

                if (RPTID == 37) {
                    alasql('SELECT * INTO XLSX("EPOS_CARD_PAYMENTS_REPORT",{headers:true}) FROM ?', [$scope.EXCEL_REPORT_DATA_LIST]);
                }


                $('#CASHUP_REPORT').modal('hide');
                $scope.LOADER_ICON = false;
                $scope.enable = "true";
            }
            else {
                $scope.$parent.ShowAlert("Attention", "No Records Found.", 3000);
                $scope.enable = "true";
                $scope.LOADER_ICON = false;
            }
        });


    };
    $scope.GET_SALES_PERFORMANCE = function (RPTID) {
        $scope.enable = "false";
        $scope.RPTID = RPTID;
        $scope.LOADER_ICON = true;
        var IS_VALID_CNT = 0;
        if ($scope.ReportSearch.END_DATE == undefined || $scope.ReportSearch.END_DATE == null || $scope.ReportSearch.END_DATE == '' || $scope.ReportSearch.START_DATE == undefined || $scope.ReportSearch.START_DATE == null
            || $scope.ReportSearch.START_DATE == '') {
            $scope.$parent.ShowAlert("Error", "Please select Start and End Date", 3000);
            $scope.enable = "true";
            $scope.LOADER_ICON = false;
            IS_VALID_CNT = 1;
        }
        else if (new Date($scope.ReportSearch.END_DATE) < new Date($scope.ReportSearch.START_DATE)) {
            $scope.$parent.ShowAlert("Error", "End Date should be greater than start date", 3000);
            $scope.enable = "true";
            $scope.LOADER_ICON = false;
            IS_VALID_CNT = 2;
        }
        if (IS_VALID_CNT == 0) {
            RPTModelObj = new Object();
            RPTModelObj.ENTITY_ID = parseInt($cookies.get('ENTITY_ID'));
            RPTModelObj.START_DATE = $scope.ReportSearch.START_DATE;
            RPTModelObj.END_DATE = $scope.ReportSearch.END_DATE;
            PrcCommMethods.REPORT_API(RPTModelObj, 'GET_SALES_PERFORMANCE').then(function (data) {
                if (data.data != null && data.data.Table.length > 0) {
                    var Table_count = 0;
                    var dataTableArray = [];
                    angular.forEach(data.data, function (data) {
                        dataTableArray[Table_count] = data;
                        Table_count += 1;
                    });
                    $scope.EXCEL_REPORT_DATA_LIST = [];
                    for (var i = 0; i < Table_count; i++) {
                        if (data.data.Table.length > 0 && dataTableArray[i].length > 0) {
                            $scope.EXCEL_SHEET_NAME = i == 0 ? "SALES" : (i == 1 ? "COVERS" : "BUDGET");
                            $scope.JSON_COLUMN_NAME = [];
                            $scope.JSON_COLUMN_NAME = Object.keys(dataTableArray[i][0]);
                            angular.forEach(dataTableArray[i], function (item) {
                                for (var j = 0; j < $scope.JSON_COLUMN_NAME.length; j++) {
                                    item[$scope.JSON_COLUMN_NAME[j]] == null ? item[$scope.JSON_COLUMN_NAME[j]] = "" : item[$scope.JSON_COLUMN_NAME[j]] = item[$scope.JSON_COLUMN_NAME[j]];
                                    if ($scope.JSON_COLUMN_NAME[j] == "DATE")
                                        item["DATE"] = moment(new Date(item["DATE"])).format('DD/MM/YYYY');
                                    if ($scope.JSON_COLUMN_NAME[j] == "CASHUP_DATE")
                                        item["CASHUP_DATE"] = moment(new Date(item["CASHUP_DATE"])).format('DD/MM/YYYY');
                                    if ($scope.JSON_COLUMN_NAME[j] == "BUDGET_DATE")
                                        item["BUDGET_DATE"] = moment(new Date(item["BUDGET_DATE"])).format('DD/MM/YYYY');

                                    item["Search By Start Date"] = moment($scope.ReportSearch.START_DATE).format('DD/MM/YYYY');
                                    item["Search By End Date"] = moment($scope.ReportSearch.END_DATE).format('DD/MM/YYYY');
                                }
                                $scope.EXCEL_REPORT_DATA_LIST.push(item);
                            });
                            alasql('SELECT * INTO XLSX("' + $cookies.get('ENTITY_NAME') + '-' + $scope.EXCEL_SHEET_NAME + '",{headers:true}) FROM ?', [$scope.EXCEL_REPORT_DATA_LIST]);
                            $scope.EXCEL_REPORT_DATA_LIST = [];
                        }
                    }
                }
                else {
                    $scope.$parent.ShowAlert("Success", "No Records Found.", 3000);
                }
                $scope.enable = "true";
                $scope.LOADER_ICON = false;
            });
        }
    };
    $scope.GET_DAILY_SALES = function (RPTID) {
        $scope.CASHUP_COMP_LIST = [];
        $scope.EXCEL_REPORT_DATA_LIST = [];
        $scope.enable = "false";
        $scope.LOADER_ICON = true;
        CashupModel = new Object();
        CashupModel.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CashupModel.START_DATE = (new Date($scope.ReportSearch.START_DATE)).toDateString();
        CashupModel.END_DATE = (new Date($scope.ReportSearch.START_DATE)).toDateString();
        CashupModel.BRANCH_ID = $scope.ReportSearch.BRANCH_ID;
        PrcCommMethods.REPORT_API(CashupModel, 'GET_DAILY_SALES').then(function (data) {
            if (data.data != null && data.data.Table != undefined) {
                const SALES_TOTAL_EXCL_TAX = data.data.Table.reduce((previousValue, currentValue) => previousValue + currentValue.SALES_TOTAL_EXCL_TAX, 0);
                const SALES_TOTAL_INC_TAX = data.data.Table.reduce((previousValue, currentValue) => previousValue + currentValue.SALES_TOTAL_INC_TAX, 0);
                $scope.ARRAY = [{
                    A: "Begin date",
                    B: (new Date($scope.ReportSearch.START_DATE)).toDateString(),
                },
                {
                    A: "End date",
                    B: (new Date($scope.ReportSearch.START_DATE)).toDateString(),
                },
                {
                    A: "Total revenue excl. tax",
                    B: SALES_TOTAL_EXCL_TAX,
                },
                {
                    A: "Total revenue inc. tax",
                    B: SALES_TOTAL_INC_TAX,
                }]
                //  $scope.CASHUP_VOUCHER_REPORT = data.data.Table;
                angular.forEach($scope.ARRAY, function (item) {
                    $scope.SELECTED_DATA = [];
                    $scope.SELECTED_DATA =
                        {
                            'Location name': item.A,
                            'Bar Du Port': item.B,
                            '-': ' ',
                            '--': ' ',
                            '---': ' ',
                            '----': ' ',
                            '-----': ' ',
                        };
                    $scope.EXCEL_REPORT_DATA_LIST.push($scope.SELECTED_DATA);
                });

                $scope.SELECTED_DATA =
                    {
                        'Location name': '',
                        'Bar Du Port': '',
                        '-': ' ',
                        '--': ' ',
                        '---': ' ',
                        '----': ' ',
                        '-----': ' ',
                    };
                $scope.EXCEL_REPORT_DATA_LIST.push($scope.SELECTED_DATA);


                $scope.SELECTED_DATA =
                    {
                        'Location name': 'Menu item name',
                        'Bar Du Port': 'Menu item code',
                        '-': 'Menu item list price',
                        '--': 'Quantity sold',
                        '---': 'Sales total excl. tax',
                        '----': 'Sales total inc. tax',
                        '-----': 'Category',
                    };

                $scope.EXCEL_REPORT_DATA_LIST.push($scope.SELECTED_DATA);


                angular.forEach(data.data.Table, function (item) {
                    $scope.SELECTED_DATA = {
                        'Location name': item.MENU_ITEM_NAME,
                        'Bar Du Port': item.MENU_ITEM_CODE,
                        '-': item.MENU_ITEM_LIST_PRICE,
                        '--': item.QUANTITY_SOLD,
                        '---': item.SALES_TOTAL_EXCL_TAX,
                        '----': item.SALES_TOTAL_INC_TAX,
                        '-----': item.CATEGORY,
                    };
                    $scope.EXCEL_REPORT_DATA_LIST.push($scope.SELECTED_DATA);
                });

                alasql('SELECT * INTO XLSX("DAILY SALES REPORT",{headers:true}) FROM ?', [$scope.EXCEL_REPORT_DATA_LIST]);
                $('#CASHUP_REPORT').modal('hide');
                $scope.LOADER_ICON = false;
                $scope.enable = "true"
            }
            else {
                $scope.$parent.ShowAlert("Attention", "No Records Found.", 3000);
                $scope.enable = "true";
                $scope.LOADER_ICON = false;
            }
        });
    };

    $scope.GET_BRANCH_LIST_BY_USER_PRIVILEGE = function () {
        RPTModelObj = new Object();
        RPTModelObj.USER_ID = parseInt($cookies.get('USERID'));
        RPTModelObj.MODULE_ID = 0;
        RPTModelObj.PRIVILEGE_ID = 145;
        PrcCommMethods.REPORT_API(RPTModelObj, 'GET_BRANCH_LIST_BY_USER_PRIVILEGE').then(function (data) {
            if (data.data != null && data.data.Table.length > 0) {
                $scope.BRANCH_LIST_BY_USER_PRIVILEGE = data.data.Table;
                angular.forEach($scope.BRANCH_LIST_BY_USER_PRIVILEGE, function (item) {
                    item.IS_CHECK = false;
                });

            }
        });
    };
    $scope.GET_BRANCH_LIST_BY_USER_PRIVILEGE();

    $scope.SITE_All_Fn = function (FLAG) {

        $scope.IS_ALL_SITE_CHECK = !$scope.IS_ALL_SITE_CHECK;

        angular.forEach($scope.BRANCH_LIST_BY_USER_PRIVILEGE, function (site) {
            site.IS_CHECK = $scope.IS_ALL_SITE_CHECK;
        });
        if (FLAG == 1) {
            $scope.SELCTED_SITE();
        }
        //if (!$scope.$parent.APPLY_BTN_SHOW) {
        //    $scope.Fn_BLUR_SITES();
        //}
    };
    $scope.SITE_Fn = function (site, FLAG) {
        site.IS_CHECK = !site.IS_CHECK;
        if (FLAG == 1 && $scope.BRANCH_LIST_BY_USER_PRIVILEGE.filter(function (x) { return x.IS_CHECK }).length > 0 || FLAG == 2 && $scope.$parent.APPLY_BTN_SHOW == false) {
            // $scope.Fn_BLUR_SITES();
        }
        if (FLAG == 1 && $scope.BRANCH_LIST_BY_USER_PRIVILEGE.filter(function (x) { return x.IS_CHECK }).length == 0) {
            $scope.$parent.ShowAlert("Attention", $scope.$parent.PI_MESSAGE, 3000);
            site.IS_CHECK = !site.IS_CHECK;
        }
        if (FLAG == 2) {
            angular.forEach($scope.BRANCH_LIST_BY_USER_PRIVILEGE, function (item) {
                if (item.ENTITY_ID == site.ENTITY_ID && item.BRANCH_ID == site.BRANCH_ID) {
                    item.IS_CHECK = true;
                }
                else
                    item.IS_CHECK = false;
            });
        }
    };
    $scope.Fn_Fill_ENTITY_BRANCH_LIST = function () {
        $scope.ReportSearch.ENTITY_BRANCH_LIST = [];
        angular.forEach($scope.BRANCH_LIST_BY_USER_PRIVILEGE, function (site) {
            if (site.IS_CHECK) {
                var _model = Object();
                _model.ENTITY_ID = site.ENTITY_ID;
                _model.BRANCH_ID = site.BRANCH_ID;
                $scope.ReportSearch.ENTITY_BRANCH_LIST.push(_model);
            };
        });
    };
    $scope.BUDGET_CONSUMPTION_REPORT_YEAR_LIST = function () {
        let _default_YEAR = 2024;
        $scope.YEAR_LIST = [];
        let _year_DIFF = parseInt(new Date().getFullYear()) - parseInt(_default_YEAR);
        for (let i = 0; i <= _year_DIFF + 1; i++) {
            var _model = Object();
            _model.ID = _default_YEAR + i;
            _model.NAME = _default_YEAR + i;
            $scope.YEAR_LIST.push(_model);
        }
    };
    $scope.BUDGET_CONSUMPTION_REPORT_YEAR_LIST();

    $scope.BUDGET_CONSUMPTION_REPORT = function (RPTID) {
        $scope.enable = "false";
        $scope.RPTID = RPTID;
        $scope.LOADER_ICON = true;

        $scope.Fn_Fill_ENTITY_BRANCH_LIST();
        RPTModelObj = new Object();
        RPTModelObj.FILE_NAME = "Budget Consumption Report"
        RPTModelObj.YEAR = parseInt($scope.ReportSearch.BUDGET_CONSUMPTION_REPORT_YEAR);
        RPTModelObj.ENTITY_BRANCH_LIST = $scope.ReportSearch.ENTITY_BRANCH_LIST;
        if ($scope.ReportSearch.BUDGET_CONSUMPTION_REPORT_YEAR != null && $scope.ReportSearch.BUDGET_CONSUMPTION_REPORT_YEAR != "") {
            PrcCommMethods.REPORT_API(RPTModelObj, 'BUDGET_CONSUMPTION_REPORT').then(function (data) {
                if (data.data != null) {
                    $scope.SERVER_FILE_PATH = data.data[0]["BUDGET_FOLDER_NAME"];
                    $scope.FILE_NAME = "BUDGET_CONSUMPTION";// RPTModelObj.FILE_NAME;
                    $scope.ORIGINAL_FILE_NAME = data.data[0]["ORIGINAL_FILE_NAME"];
                    window.location.href = "/Uploads" + data.data[0]["RETURN_FILE_NAME"];
                    $scope.enable = "true";
                    $scope.LOADER_ICON = false;
                    //setTimeout(function () { $scope.DELETE_BUDGET_CONSUMPTION_REPORT_FILE() }, 10000);

                }
                else {
                    $scope.enable = "true";
                    $scope.LOADER_ICON = false;
                    //setTimeout(function () { //$scope.DELETE_BUDGET_CONSUMPTION_REPORT_FILE()}, 10000);
                }
            });
        }
        else {
            $scope.enable = "true";
            $scope.LOADER_ICON = false;
            $scope.$parent.ShowAlert("Attention", "Please select the year and site to generate report.", 3000);
        }
    };
    $scope.DELETE_BUDGET_CONSUMPTION_REPORT_FILE = function () {
        RPTModelObj = new Object();
        RPTModelObj.FILE_NAME = $scope.ORIGINAL_FILE_NAME;
        PrcCommMethods.REPORT_API(RPTModelObj, 'DELETE_BUDGET_CONSUMPTION_REPORT_FILE').then(function (data) {
            if (data.data != null) {
                var a = "";
            }
        });
    };
    $scope.PR_PO_TRACKING_REPORT = function (RPTID) {

        $scope.EPOS_CARD_PAYMENT = [];
        $scope.EXCEL_REPORT_DATA_LIST = [];
        $scope.enable = "false";
        $scope.LOADER_ICON = true;
        $scope.enable = "false";
        $scope.RPTID = RPTID;
        $scope.LOADER_ICON = true;
        var IS_VALID_CNT = 0;
        if ($scope.ReportSearch.START_DATE == undefined || $scope.ReportSearch.START_DATE == null || $scope.ReportSearch.START_DATE == '' || $scope.ReportSearch.START_DATE == undefined || $scope.ReportSearch.START_DATE == null || $scope.ReportSearch.START_DATE == '') {
            $scope.$parent.ShowAlert("Error", "Please select Start and End Date", 3000);
            $scope.enable = "true";
            $scope.LOADER_ICON = false;
            IS_VALID_CNT = 1;
        }
        else if (new Date($scope.ReportSearch.START_DATE) < new Date($scope.ReportSearch.START_DATE)) {
            $scope.$parent.ShowAlert("Error", "End Date should be greater than start date", 3000);
            $scope.enable = "true";
            $scope.LOADER_ICON = false;
            IS_VALID_CNT = 2;
        }
        if (IS_VALID_CNT == 0) {
            RPTModelObj = new Object();
            RPTModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            RPTModelObj.BRANCH_ID = $scope.ReportSearch.BRANCH_ID == null ? '' : $scope.ReportSearch.BRANCH_ID;
            RPTModelObj.START_DATE = $scope.ReportSearch.START_DATE;
            RPTModelObj.END_DATE = $scope.ReportSearch.END_DATE;
            RPTModelObj.PAGE_NO = 0;
            RPTModelObj.PAGE_SIZE = 0;
            PrcCommMethods.REPORT_API(RPTModelObj, 'PR_PO_TRACKING_REPORT').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.REPORT_DATA_LIST = data.data.Table;                    
                    angular.forEach($scope.REPORT_DATA_LIST, function (item) {
                        delete item.PAGING;
                        $scope.JSON_COLUMN_NAME = Object.keys(item);
                        $scope.SELECTED_DATA = [];
                        for (var i = 0; i < $scope.JSON_COLUMN_NAME.length; i++) {
                            if ($scope.JSON_COLUMN_NAME[i] == 'PR Date' || $scope.JSON_COLUMN_NAME[i] == 'PO Date' || $scope.JSON_COLUMN_NAME[i] == 'PO Approval Date') {
                                item[$scope.JSON_COLUMN_NAME[i]] == null ? item[$scope.JSON_COLUMN_NAME[i]] = "" : item[$scope.JSON_COLUMN_NAME[i]] = moment(item[$scope.JSON_COLUMN_NAME[i]]).format('DD/MM/YYYY');
                            }
                            else
                                item[$scope.JSON_COLUMN_NAME[i]] == null ? item[$scope.JSON_COLUMN_NAME[i]] = "" : item[$scope.JSON_COLUMN_NAME[i]] = item[$scope.JSON_COLUMN_NAME[i]];
                        }
                        $scope.EXCEL_REPORT_DATA_LIST.push(item);

                    });
                    $scope.DOWNLOAD_EXCEL();
                    $scope.enable = "true";
                    $scope.LOADER_ICON = false;
                }
                else {
                    $scope.$parent.ShowAlert("Attention", "No Records Found.", 3000);
                    $scope.enable = "true";
                    $scope.LOADER_ICON = false;
                }

            });
        }
    };
    $scope.APPROVED_INVOICES_REPORT = function (RPTID) {
        debugger;
        $scope.Fn_Fill_ENTITY_BRANCH_LIST();
        $scope.EXCEL_REPORT_DATA_LIST = [];
        $scope.enable = "false";
        $scope.LOADER_ICON = true;
        $scope.enable = "false";
        $scope.RPTID = RPTID;
        $scope.LOADER_ICON = true;
        var IS_VALID_CNT = 0;
        if ($scope.ReportSearch.END_DATE == undefined || $scope.ReportSearch.END_DATE == null || $scope.ReportSearch.END_DATE == '' || $scope.ReportSearch.START_DATE == undefined || $scope.ReportSearch.START_DATE == null
            || $scope.ReportSearch.START_DATE == '') {
            $scope.$parent.ShowAlert("Attention", "Please select Start and End Date", 3000);
            $scope.enable = "true";
            $scope.LOADER_ICON = false;
            IS_VALID_CNT = 1;
        }
        else if (new Date($scope.ReportSearch.END_DATE) < new Date($scope.ReportSearch.START_DATE)) {
            $scope.$parent.ShowAlert("Attention", "End Date should be greater than start date", 3000);
            $scope.enable = "true";
            $scope.LOADER_ICON = false;
            IS_VALID_CNT = 2;
        }
        else if ($scope.ReportSearch.ENTITY_BRANCH_LIST.length == 0) {
            $scope.$parent.ShowAlert("Attention", "Atleast one site should be selected", 3000);
            $scope.enable = "true";
            $scope.LOADER_ICON = false;
            IS_VALID_CNT +=1 ;
        }
        if (IS_VALID_CNT == 0) {
            RPTModelObj = new Object();
            RPTModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            //RPTModelObj.BRANCH_ID = $scope.ReportSearch.BRANCH_ID == null ? '' : $scope.ReportSearch.BRANCH_ID;
            RPTModelObj.ENTITY_BRANCH_LIST = $scope.ReportSearch.ENTITY_BRANCH_LIST;
            RPTModelObj.START_DATE = $scope.ReportSearch.START_DATE;
            RPTModelObj.END_DATE = $scope.ReportSearch.END_DATE;
            RPTModelObj.PAGE_NO = 0;
            RPTModelObj.PAGE_SIZE = 0;
            PrcCommMethods.REPORT_API(RPTModelObj, 'APPROVED_INVOICES_REPORT').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.REPORT_DATA_LIST = data.data.Table;
                    angular.forEach($scope.REPORT_DATA_LIST, function (item) {                         
                        $scope.JSON_COLUMN_NAME = Object.keys(item);
                        $scope.SELECTED_DATA = [];
                        for (var i = 0; i < $scope.JSON_COLUMN_NAME.length; i++) {
                            if ($scope.JSON_COLUMN_NAME[i] == 'Approved Date' || $scope.JSON_COLUMN_NAME[i] == 'Invoice Date' ) {
                                item[$scope.JSON_COLUMN_NAME[i]] == null ? item[$scope.JSON_COLUMN_NAME[i]] = "" : item[$scope.JSON_COLUMN_NAME[i]] = moment(item[$scope.JSON_COLUMN_NAME[i]]).format('DD/MM/YYYY HH:mm:ss');
                            }
                            else if ($scope.JSON_COLUMN_NAME[i] == 'Invoice Date') {
                                item[$scope.JSON_COLUMN_NAME[i]] == null ? item[$scope.JSON_COLUMN_NAME[i]] = "" : item[$scope.JSON_COLUMN_NAME[i]] = moment(item[$scope.JSON_COLUMN_NAME[i]]).format('DD/MM/YYYY');
                            }
                            else
                                item[$scope.JSON_COLUMN_NAME[i]] == null ? item[$scope.JSON_COLUMN_NAME[i]] = "" : item[$scope.JSON_COLUMN_NAME[i]] = item[$scope.JSON_COLUMN_NAME[i]];
                        }
                        $scope.EXCEL_REPORT_DATA_LIST.push(item);

                    });
                    $scope.DOWNLOAD_EXCEL();
                    $scope.enable = "true";
                    $scope.LOADER_ICON = false;
                }
                else {
                    $scope.$parent.ShowAlert("Attention", "No Records Found.", 3000);
                    $scope.enable = "true";
                    $scope.LOADER_ICON = false;
                }

            });
        }
    };
});
app.controller('BIDashBoardController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $localStorage, $sce) {
    $scope.SELECTED_MODULE = JSON.parse($localStorage.SELECTED_MODULE);
    $scope.BI_PATH = $scope.SELECTED_MODULE.SECONDARY_PATH;
    //"https://app.powerbi.com/reportEmbed?reportId=76e20f8b-9fc9-4e50-a44d-fa2180695243&autoAuth=true&ctid=566d5f2b-cf2b-47a7-91e4-6b9e0b7a2502&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXVrLXNvdXRoLWItcHJpbWFyeS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldC8ifQ%3D%3D";
    $scope.trustSrc = function (src) { return $sce.trustAsResourceUrl(src); };
});

