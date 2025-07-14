app.controller('CashupReprotsVoucherController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(2);
    $scope.$parent.CASHUP_COMMON_RESET_Fn();
    $scope.REPORTS_PRIVILEGE_ID = '1172';
    $scope.REPORTS_VOUCHERS_Obj = {
        SELECTED_SITE: null,
        START_DATE: null,
        END_DATE: null,
        STATUS_FLAG: false,
        MODE_OF_PAYMENT:null,
        SEARCH_TEXT: '',
        PAGE_NO: 1,
        PAGE_SIZE: 10
    }
    $scope.MODE_OF_PAYMENT_LIST = [];
    $scope.VOUCHERS_LIST = [];
    $scope.GetData = true;
    $scope.$parent.GET_PRIVILEGE($scope.REPORTS_PRIVILEGE_ID);
    $scope.$watch('REPORTS_SITES_LIST', function (newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.selectSite($scope.REPORTS_SITES_LIST[0]);
        }
    });
    $scope.$watch('REPORTS_VOUCHERS_Obj.STATUS_FLAG', function (newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.GET_CASHUP_VOUCHER_REPORT();
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

    $scope.GET_CASHUP_VOUCHER_REPORT = function (flag) {
        if (flag == null || flag == undefined) {
            $scope.REPORTS_VOUCHERS_Obj.PAGE_NO = 1;
            $scope.GetData = true;
        }

        var CashupAppModelObj = new Object();

        //CashupAppModelObj.ENTITY_ID = 100;
        //CashupAppModelObj.BRANCH_ID = 145;
        //CashupAppModelObj.START_DATE = '2023-01-01'
        //CashupAppModelObj.END_DATE = '2025-07-01'
        //CashupAppModelObj.SEARCH_TEXT = $scope.REPORTS_VOUCHERS_Obj.SEARCH_TEXT;
        //CashupAppModelObj.STATUS_FLAG = $scope.REPORTS_VOUCHERS_Obj.STATUS_FLAG == false ? 1 : 2;
        //CashupAppModelObj.PAYMENT_MODE_ID = null;
        //CashupAppModelObj.PAGE_NO = $scope.REPORTS_VOUCHERS_Obj.PAGE_NO;
        //CashupAppModelObj.PAGE_SIZE = $scope.REPORTS_VOUCHERS_Obj.PAGE_SIZE;


        CashupAppModelObj.ENTITY_ID = parseInt($cookies.get('ENTITY_ID'));
        CashupAppModelObj.BRANCH_ID = $scope.REPORTS_VOUCHERS_Obj.SELECTED_SITE.BRANCH_ID;
        CashupAppModelObj.START_DATE = $scope.REPORTS_VOUCHERS_Obj.START_DATE;
        CashupAppModelObj.END_DATE = $scope.REPORTS_VOUCHERS_Obj.END_DATE;
        CashupAppModelObj.SEARCH_TEXT = $scope.REPORTS_VOUCHERS_Obj.SEARCH_TEXT;
        CashupAppModelObj.STATUS_FLAG = $scope.REPORTS_VOUCHERS_Obj.STATUS_FLAG==false?1:2;
        CashupAppModelObj.MODE_OF_PAYMENT_ID = $scope.REPORTS_VOUCHERS_Obj.MODE_OF_PAYMENT == null || $scope.REPORTS_VOUCHERS_Obj.MODE_OF_PAYMENT==undefined?null:$scope.REPORTS_VOUCHERS_Obj.MODE_OF_PAYMENT.MODE_OF_PAYMENT_ID;
        CashupAppModelObj.PAGE_NO = $scope.REPORTS_VOUCHERS_Obj.PAGE_NO;
        CashupAppModelObj.PAGE_SIZE = $scope.REPORTS_VOUCHERS_Obj.PAGE_SIZE;
        

        PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'GET_CASHUP_VOUCHER_REPORT').then(function (data) {
            if (data.data && data.data.Table.length > 0) {
                if (flag == null || flag == undefined) {
                    $scope.VOUCHERS_LIST = data.data.Table;
                }
                else if (flag == 1) {
                    $scope.VOUCHERS_LIST = $scope.VOUCHERS_LIST.concat(data.data.Table);
                }
                if (data.data.Table.length < $scope.REPORTS_VOUCHERS_Obj.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.REPORTS_VOUCHERS_Obj.PAGE_NO = parseInt($scope.REPORTS_VOUCHERS_Obj.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else if ($scope.REPORTS_VOUCHERS_Obj.PAGE_NO > 1 && data.data.Table.length == 0) {
                $scope.GetData = false;
            }
            else if ($scope.REPORTS_VOUCHERS_Obj.PAGE_NO == 1 && data.data.Table.length == 0) {
                $scope.VOUCHERS_LIST = [];
                $scope.GetData = false;
            }
        });

    }

    $scope.selectSite = function (_site) {
        $scope.REPORTS_VOUCHERS_Obj.SELECTED_SITE = _site;
        $scope.MODE_OF_PAYMENT_LIST = [];
        $scope.REPORTS_VOUCHERS_Obj.MODE_OF_PAYMENT = null;
        $scope.GET_MODE_OF_PAYMENTS(_site.BRANCH_ID);
        $scope.GET_CASHUP_VOUCHER_REPORT();
    }

    $scope.selectMethod = function (_method) {
        if (_method == 'Choose') {
            $scope.REPORTS_VOUCHERS_Obj.MODE_OF_PAYMENT = null;
        }
        else {
            $scope.REPORTS_VOUCHERS_Obj.MODE_OF_PAYMENT = _method;
        }
        $scope.GET_CASHUP_VOUCHER_REPORT();
    }

    $scope.getColspan = function () {
        if (!$scope.VOUCHERS_LIST || !$scope.VOUCHERS_LIST[0]) return 1;
        return Object.keys($scope.VOUCHERS_LIST[0]).filter(k => k !== 'PAGING').length;
    };

    function reportrange(startDate, endDate) {
        if (!$scope.$$phase && !$scope.$root.$$phase) {
            $scope.$apply(function () {
                $scope.REPORTS_VOUCHERS_Obj.START_DATE = startDate.format($scope.$parent.DB_DATE_FORMAT);
                $scope.REPORTS_VOUCHERS_Obj.END_DATE = endDate.format($scope.$parent.DB_DATE_FORMAT);
            });
        } else {
            $scope.REPORTS_VOUCHERS_Obj.START_DATE = startDate.format($scope.$parent.DB_DATE_FORMAT);
            $scope.REPORTS_VOUCHERS_Obj.END_DATE = endDate.format($scope.$parent.DB_DATE_FORMAT);
        }
        $('#reportrange span').html(startDate.format($scope.$parent.DATE_RANGE_FORMAT) + ' - ' + endDate.format($scope.$parent.DATE_RANGE_FORMAT));
        $scope.GET_CASHUP_VOUCHER_REPORT();
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
});