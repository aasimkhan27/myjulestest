app.controller('CashupReportsDepositController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(2);
    $scope.$parent.CASHUP_COMMON_RESET_Fn();
    $scope.CASHUP_PRIVILEGE = '1172';
    $scope.REPORTS_DEPOSITS_Obj = {
        SELECTED_SITE: null,
        START_DATE: null,
        END_DATE: null,
        STATUS_FLAG: 0,
        MODE_OF_PAYMENT: null,
        SEARCH_TEXT: null,
        PAGE_NO: 1,
        PAGE_SIZE: 10
    }

    $scope.ENTITY_ID = parseInt($cookies.get('ENTITY_ID'));
    $scope.USER_ID = parseInt($cookies.get('USERID'));
    $scope.GetData = true;
    $scope.DEPOSITS_LIST = [];
    $scope.MODE_OF_PAYMENT_LIST = [];
    $scope.$parent.GET_PRIVILEGE($scope.CASHUP_PRIVILEGE);
    $scope.$watch('REPORTS_SITES_LIST', function (newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.selectSite($scope.$parent.REPORTS_SITES_LIST[0]);
        }
    });

    $scope.$watch('REPORTS_DEPOSITS_Obj.STATUS_FLAG', function (newValue, oldValue) {
        if (newValue !== oldValue) {
            $scope.GET_CASHUP_DEPOSIT_REPORT();
        }
    });
    $scope.GET_MODE_OF_PAYMENTS = function (_branchId) {
        var ModelObj = new Object();
        ModelObj.BRANCH_ID = _branchId;
        PrcCommMethods.CASHUP_APP_API(ModelObj, 'GET_MODE_OF_PAYMENTS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.MODE_OF_PAYMENT_LIST = data.data.Table;
            }
            else {
                $scope.MODE_OF_PAYMENT_LIST = [];
            }
        });
    };



    $scope.GET_CASHUP_DEPOSIT_REPORT = function (flag) {
        if (flag == null || flag == undefined) {
            $scope.REPORTS_DEPOSITS_Obj.PAGE_NO = 1;
            $scope.GetData = true;
        }

        var CashupAppModelObj = new Object();
        CashupAppModelObj.ENTITY_ID = $scope.ENTITY_ID;
        CashupAppModelObj.START_DATE = $scope.REPORTS_DEPOSITS_Obj.START_DATE;
        CashupAppModelObj.END_DATE = $scope.REPORTS_DEPOSITS_Obj.END_DATE;
        CashupAppModelObj.BRANCH_ID = $scope.REPORTS_DEPOSITS_Obj.SELECTED_SITE.BRANCH_ID;
        CashupAppModelObj.STATUS_FLAG = $scope.REPORTS_DEPOSITS_Obj.STATUS_FLAG==0?1:2;
        CashupAppModelObj.PAYMENT_MODE_ID = $scope.REPORTS_DEPOSITS_Obj.MODE_OF_PAYMENT != null ? $scope.REPORTS_DEPOSITS_Obj.MODE_OF_PAYMENT.MODE_OF_PAYMENT_ID : null;
        CashupAppModelObj.SEARCH_TEXT = $scope.REPORTS_DEPOSITS_Obj.SEARCH_TEXT;
        CashupAppModelObj.PAGE_NO = $scope.REPORTS_DEPOSITS_Obj.PAGE_NO;
        CashupAppModelObj.PAGE_SIZE = $scope.REPORTS_DEPOSITS_Obj.PAGE_SIZE;

        //CashupAppModelObj.ENTITY_ID = 72;
        //CashupAppModelObj.START_DATE = '2019-01-01';
        //CashupAppModelObj.END_DATE = '2025-07-02';
        //CashupAppModelObj.BRANCH_ID = 92;
        //CashupAppModelObj.STATUS_FLAG = 1;
        //CashupAppModelObj.PAYMENT_MODE_ID = null;
        //CashupAppModelObj.SEARCH_TEXT = '';
        //CashupAppModelObj.PAGE_NO = 0;
        //CashupAppModelObj.PAGE_SIZE = 0;

        PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'GET_CASHUP_DEPOSIT_REPORT').then(function (data) {
            if (data.data && data.data.Table.length > 0) {
                if (flag == null || flag == undefined) {
                    $scope.DEPOSITS_LIST = data.data.Table;
                }
                else if (flag == 1) {
                    $scope.DEPOSITS_LIST = $scope.DEPOSITS_LIST.concat(data.data.Table);
                }
                if (data.data.Table.length < $scope.REPORTS_DEPOSITS_Obj.PAGE_SIZE) {
                    $scope.GetData = false; 
                }
                else {
                    $scope.REPORTS_DEPOSITS_Obj.PAGE_NO = parseInt($scope.REPORTS_DEPOSITS_Obj.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else if ($scope.REPORTS_DEPOSITS_Obj.PAGE_NO > 1 && data.data.Table.length == 0) {
                $scope.GetData = false;
            }
            else if ($scope.REPORTS_DEPOSITS_Obj.PAGE_NO == 1 && data.data.Table.length == 0) {
                $scope.DEPOSITS_LIST = [];
                $scope.GetData = false;
            }
        });
    }


    $scope.selectSite = function (_site) {
        $scope.REPORTS_DEPOSITS_Obj.SELECTED_SITE = _site;
        $scope.GET_MODE_OF_PAYMENTS(_site.BRANCH_ID);
        $scope.GET_CASHUP_DEPOSIT_REPORT();
    }

    $scope.selectModeOfPayment = function (_mode) {
        if (_mode == 'Choose') {
            $scope.REPORTS_DEPOSITS_Obj.MODE_OF_PAYMENT = null;
        }
        else {
            $scope.REPORTS_DEPOSITS_Obj.MODE_OF_PAYMENT = _mode;
        }
        
        $scope.GET_CASHUP_DEPOSIT_REPORT();
    }

    $scope.getColspan = function () {
        if (!$scope.DEPOSITS_LIST || !$scope.DEPOSITS_LIST[0]) return 1;
        return Object.keys($scope.DEPOSITS_LIST[0]).filter(k => k !== 'PAGING').length;
    };



    function reportrange(startDate, endDate) {
        if (!$scope.$$phase && !$scope.$root.$$phase) {
            $scope.$apply(function () {
                $scope.REPORTS_DEPOSITS_Obj.START_DATE = startDate.format($scope.$parent.DB_DATE_FORMAT);
                $scope.REPORTS_DEPOSITS_Obj.END_DATE = endDate.format($scope.$parent.DB_DATE_FORMAT);
            });
        } else {
            $scope.REPORTS_DEPOSITS_Obj.START_DATE = startDate.format($scope.$parent.DB_DATE_FORMAT);
            $scope.REPORTS_DEPOSITS_Obj.END_DATE = endDate.format($scope.$parent.DB_DATE_FORMAT);
        }
        $('#reportrange span').html(startDate.format($scope.$parent.DATE_RANGE_FORMAT) + ' - ' + endDate.format($scope.$parent.DATE_RANGE_FORMAT));
        $scope.GET_CASHUP_DEPOSIT_REPORT();
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



    $scope.EXPORT_DIPOSITS = function (export_flag) {
        var CashupAppModelObj = new Object();
        CashupAppModelObj.ENTITY_ID = $scope.ENTITY_ID;
        CashupAppModelObj.START_DATE = $scope.REPORTS_DEPOSITS_Obj.START_DATE;
        CashupAppModelObj.END_DATE = $scope.REPORTS_DEPOSITS_Obj.END_DATE;
        CashupAppModelObj.BRANCH_ID = $scope.REPORTS_DEPOSITS_Obj.SELECTED_SITE.BRANCH_ID;
        CashupAppModelObj.STATUS_FLAG = $scope.REPORTS_DEPOSITS_Obj.STATUS_FLAG == 0 ? 1 : 2;
        CashupAppModelObj.PAYMENT_MODE_ID = $scope.REPORTS_DEPOSITS_Obj.MODE_OF_PAYMENT != null ? $scope.REPORTS_DEPOSITS_Obj.MODE_OF_PAYMENT.MODE_OF_PAYMENT_ID : null;
        CashupAppModelObj.SEARCH_TEXT = $scope.REPORTS_DEPOSITS_Obj.SEARCH_TEXT;
        CashupAppModelObj.PAGE_NO = 0;
        CashupAppModelObj.PAGE_SIZE = 0;
        CashupAppModelObj.CASHUP_REPORT_TYPE = 6;
        CashupAppModelObj.EXPORT_FLAG = export_flag;
        CashupAppModelObj.FILE_PATH = "/DEPOSIT_REPORT_" + "/CUSTOMER_" + $scope.ENTITY_ID + "/" + "USER_ID_" + $scope.USER_ID + "/" + (export_flag == 1 ? "CSV" : "XLSX") + "/";
        CashupAppModelObj.FILE_NAME = "Deposit Report";
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