app.controller('CashupReportsWeeklySalesController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location,$localStorage) {
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(2);
    $scope.$parent.CASHUP_COMMON_RESET_Fn();
    $scope.CASHUP_PRIVILEGE = '1172';
    $scope.$parent.GET_PRIVILEGE($scope.CASHUP_PRIVILEGE);
    $scope.$watch('REPORTS_SITES_LIST', function (newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.selectSite($scope.REPORTS_SITES_LIST[0]);
        }
    });
    $scope.REPORT_HEADER = [' ', 'M', 'T', 'W', 'T', 'F', 'S', 'S', 'Total', 'MTD', 'YTD'];
    var startDate;
    var endDate;
    var prv_6;
    Date.prototype.addDays = function (days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    };
    $scope.REPORT_MASTER_DATA = [];
    $scope.SALES_DATA = [];
    $scope.SALES_TOTALS = [];
    $scope.SALES_BY_PAYMENT_TYPE = [];
    $scope.REPORT_WEEKLY_Obj = {
        SELECTED_SITE: null,
        START_DATE: null,
        END_DATE: null,
        NET_GROSS_TOGGLE: 0

    }
    $scope.$watch('REPORT_WEEKLY_Obj.START_DATE', function (newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.GET_CASHUP_WEEKLY_SALES_REPORT();
        }
    });
    $scope.$watch('REPORT_WEEKLY_Obj.NET_GROSS_TOGGLE', function (newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.GET_CASHUP_WEEKLY_SALES_REPORT();
        }
    });
    $scope.selectSite = function (_site) {
        $scope.REPORT_WEEKLY_Obj.SELECTED_SITE = _site;
        $scope.GET_CASHUP_WEEKLY_SALES_REPORT();
    }

    $scope.GET_CASHUP_WEEKLY_SALES_REPORT = function(){
        var CashupAppModelObj = new Object();
        CashupAppModelObj.BRANCH_ID = $scope.REPORT_WEEKLY_Obj.SELECTED_SITE.BRANCH_ID;
        CashupAppModelObj.START_DATE = moment($scope.REPORT_WEEKLY_Obj.START_DATE).format($scope.$parent.DB_DATE_FORMAT);//$scope.REPORT_WEEKLY_Obj.START_DATE;
        CashupAppModelObj.END_DATE = moment($scope.REPORT_WEEKLY_Obj.END_DATE).format($scope.$parent.DB_DATE_FORMAT);//$scope.REPORT_WEEKLY_Obj.END_DATE;

        //CashupAppModelObj.BRANCH_ID = 145;
        //CashupAppModelObj.START_DATE = '2024-06-03';
        //CashupAppModelObj.END_DATE = '2024-06-09';
        CashupAppModelObj.GROSS_NET_FLAG = $scope.REPORT_WEEKLY_Obj.NET_GROSS_TOGGLE == 0?2:1;
        PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'GET_CASHUP_WEEKLY_SALES_REPORT').then(function (data) {
            if (data.data.length > 0) {
                $scope.REPORT_MASTER_DATA = data.data;
                if ($scope.REPORT_MASTER_DATA.filter(x => x.TYPE == 1).length > 0) {
                    $scope.SALES_DATA = $scope.REPORT_MASTER_DATA.filter(x => x.TYPE == 1);
                }
                else {
                    $scope.SALES_DATA = [];
                }
                if ($scope.REPORT_MASTER_DATA.filter(x => x.TYPE == 2).length > 0) {
                    $scope.SALES_TOTALS = $scope.REPORT_MASTER_DATA.filter(x => x.TYPE == 2);
                }
                else {
                    $scope.SALES_TOTALS = [];
                }
                if ($scope.REPORT_MASTER_DATA.filter(x => x.TYPE == 3).length > 0) {
                    $scope.SALES_BY_PAYMENT_TYPE = $scope.REPORT_MASTER_DATA.filter(x => x.TYPE == 3);
                }
                else {
                    $scope.SALES_BY_PAYMENT_TYPE = [];
                }


                $scope.ROW_COUNT = 0;

                $scope.EXCEL_EXPORT_LIST = [];

                $scope.SALES_DATA_EXPORT = angular.copy($scope.SALES_DATA);
                $scope.TOTAL_SALES_EXPORT = angular.copy($scope.SALES_TOTALS);
                $scope.SALES_BY_PAYMENT_TYPE_EXPORT = angular.copy($scope.SALES_BY_PAYMENT_TYPE);

                angular.forEach($scope.SALES_DATA_EXPORT, function (_row) {
                    angular.forEach(_row.WEEKLY_SALES_SESSION_DATA, function (_item) {
                        _item.SESSION = _row.SESSION_NAME;
                        if (_item.CATEGORY_NAME != 'Total') {
                            $scope.ROW_COUNT++;
                        }
                    })


                    $scope.EXCEL_EXPORT_LIST = $scope.EXCEL_EXPORT_LIST.concat(_row.WEEKLY_SALES_SESSION_DATA);
                })
                angular.forEach($scope.TOTAL_SALES_EXPORT, function (_row) {
                    angular.forEach(_row.WEEKLY_SALES_SESSION_DATA, function (_item) {
                        _item.SESSION = _row.SESSION_NAME;

                    })
                    $scope.EXCEL_EXPORT_LIST = $scope.EXCEL_EXPORT_LIST.concat(_row.WEEKLY_SALES_SESSION_DATA);
                })
                angular.forEach($scope.SALES_BY_PAYMENT_TYPE_EXPORT, function (_row) {
                    angular.forEach(_row.WEEKLY_SALES_SESSION_DATA, function (_item) {
                        _item.SESSION = _row.SESSION_NAME;
                        if (_item.CATEGORY_NAME != 'Total') {
                            $scope.ROW_COUNT++;
                        }
                    })
                    $scope.EXCEL_EXPORT_LIST = $scope.EXCEL_EXPORT_LIST.concat(_row.WEEKLY_SALES_SESSION_DATA);
                })

            }
            else {
                $scope.REPORT_MASTER_DATA = [];
                $scope.SALES_DATA = [];
                $scope.SALES_TOTALS = [];
                $scope.SALES_BY_PAYMENT_TYPE = [];
                $scope.EXCEL_EXPORT_LIST = [];
            }

        });
    }

    $scope.START_DAY_OF_WEEK = 0;
    if (JSON.parse($localStorage.ENTITY_SETTINGS).length > 0) {
        $scope.START_DAY_OF_WEEK = JSON.parse($localStorage.ENTITY_SETTINGS).filter(x => x.SETTING_ID == 4)[0]["SETTING_VALUE"];
        if ($scope.START_DAY_OF_WEEK == null || $scope.START_DAY_OF_WEEK == undefined || $scope.START_DAY_OF_WEEK == '') {
            $scope.START_DAY_OF_WEEK = 0;
        }
    }
    function set_week_picker(date, FLAG) {
        var count = 0;
        if (parseInt($scope.START_DAY_OF_WEEK) == 6) {
            if (parseInt(prv_6) == 6) {
                start_date = new Date(date.getFullYear(), date.getMonth(), parseInt($scope.START_DAY_OF_WEEK) + date.getDate() - date.getDay());
                end_date = new Date(start_date).addDays(6);
            }
            else {
                start_date = new Date(date.getFullYear(), date.getMonth(), parseInt($scope.START_DAY_OF_WEEK) - 7 + date.getDate() - date.getDay());
                end_date = new Date(date.getFullYear(), date.getMonth(), parseInt($scope.START_DAY_OF_WEEK) - 7 + date.getDate() - date.getDay()).addDays(6);
            }
        }
        else {
            start_date = new Date(date.getFullYear(), date.getMonth(), parseInt($scope.START_DAY_OF_WEEK) + date.getDate() - date.getDay());
            end_date = new Date(date.getFullYear(), date.getMonth(), parseInt($scope.START_DAY_OF_WEEK) + date.getDate() - date.getDay() + 6);
        }
        //start_date = new Date(date.getFullYear(), date.getMonth(), parseInt($scope.START_DAY_OF_WEEK) + date.getDate() - date.getDay());        
        if (start_date > date) {
            if (FLAG == 1) {
                var increasedays = start_date.getDate() - date.getDate();
                start_date = new Date(date.getFullYear(), date.getMonth(), start_date.getDate() - ((7 - increasedays) + increasedays));
                end_date = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() + (1 + increasedays));
            }
        }

        weekpicker.datepicker('update', start_date);
        $scope.REPORT_WEEKLY_Obj.START_DATE = start_date;
        $scope.REPORT_WEEKLY_Obj.END_DATE = end_date;

        var StartDD = start_date.getDate();
        var Startmm = start_date.getMonth() + 1;
        var start_dateyyyy = start_date.getFullYear();
        var EndDD = end_date.getDate();
        var Endmm = end_date.getMonth() + 1;
        var Endyyyy = end_date.getFullYear();

        if (StartDD < 10) { StartDD = '0' + StartDD; }
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
            prv_6 = "";
            set_week_picker(prev);
        });
        $('.week-next').on('click', function () {
            var next = new Date(end_date.getTime());
            next.setDate(next.getDate() + 1);
            parseInt($scope.START_DAY_OF_WEEK) == 6 ? prv_6 = "6" : prv_6 = "";
            set_week_picker(next);
        });
        set_week_picker(date, 1);
    }
    $scope.DATEPICKERDATE_FY(new Date())



    $scope.EXPORT_WEEKLY_CASHUP_REPORT = function (export_flag) {
        var CashupAppModelObj = new Object();
        //var excelList = [];

        //$scope.SALES_DATA_EXPORT = angular.copy($scope.SALES_DATA);
        //$scope.TOTAL_SALES_EXPORT = angular.copy($scope.SALES_TOTALS);
        //$scope.SALES_BY_PAYMENT_TYPE_EXPORT = angular.copy($scope.SALES_BY_PAYMENT_TYPE);

        //angular.forEach($scope.SALES_DATA_EXPORT, function (_row) {
        //    angular.forEach(_row.WEEKLY_SALES_SESSION_DATA, function (_item) {
        //        _item.SESSION = _row.SESSION_NAME; 
        //    })


        //    excelList = excelList.concat(_row.WEEKLY_SALES_SESSION_DATA);
        //}) 
        //angular.forEach($scope.TOTAL_SALES_EXPORT, function (_row) {
        //    angular.forEach(_row.WEEKLY_SALES_SESSION_DATA, function (_item) {
        //        _item.SESSION = _row.SESSION_NAME; 
                
        //    })
        //    excelList = excelList.concat(_row.WEEKLY_SALES_SESSION_DATA);
        //})
        //angular.forEach($scope.SALES_BY_PAYMENT_TYPE_EXPORT, function (_row) {
        //    angular.forEach(_row.WEEKLY_SALES_SESSION_DATA, function (_item) {
        //        _item.SESSION = _row.SESSION_NAME;

        //    })
        //    excelList = excelList.concat(_row.WEEKLY_SALES_SESSION_DATA);
        //})
        
        CashupAppModelObj.CASHUP_EXPORT_LIST = $scope.EXCEL_EXPORT_LIST;
        CashupAppModelObj.CASHUP_REPORT_TYPE = 3;
        CashupAppModelObj.EXPORT_FLAG = export_flag;
        CashupAppModelObj.FILE_PATH = "/WEEKLY_SALES_REPORT_" + "/CUSTOMER_" + $cookies.get('ENTITY_ID') + "/" + "USER_ID_" + $cookies.get('USERID') + "/" + (export_flag == 1 ? "CSV" : "XLSX") + "/";
        CashupAppModelObj.FILE_NAME = "Weekly Sales Report";
        PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'EXPORT_CASHUP_REPORTS').then(function (data) {
            if (data.data != null) {
                $scope.SERVER_FILE_PATH = '/' + data.data.FOLDER_NAME + data.data.RETURN_FILE_NAME;
                $scope.FILE_NAME = CashupAppModelObj.FILE_NAME;
                window.location.href = $scope.SERVER_FILE_PATH;
            } else {
                alert("Export failed. Please try again.");
            }
        });
    }
});