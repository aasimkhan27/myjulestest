app.controller('CashupReportsFloatController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(2);
    $scope.$parent.CASHUP_COMMON_RESET_Fn();
    $scope.CASHUP_PRIVILEGE = '1172';
    $scope.REPORTS_FLOAT_Obj = {
        SELECTED_SITE: null,
        START_DATE: null,
        END_DATE: null,
        PAGE_NO: 1,
        PAGE_SIZE: 10

    }
    $scope.ENTITY_ID = parseInt($cookies.get('ENTITY_ID'));
    $scope.USER_ID = parseInt($cookies.get('USERID'));

    $scope.GetData = true;
    $scope.FLOAT_LIST = [];
    $scope.$parent.GET_PRIVILEGE($scope.CASHUP_PRIVILEGE);
    $scope.$watch('REPORTS_SITES_LIST', function (newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.selectSite($scope.$parent.REPORTS_SITES_LIST[0]);
        }
    });


    $scope.selectSite = function (_site) {
        $scope.REPORTS_FLOAT_Obj.SELECTED_SITE = _site;
        $scope.GET_CASHUP_FLOAT_REPORT();
    }


    $scope.GET_CASHUP_FLOAT_REPORT = function (flag) {
        if (flag == null || flag == undefined) {
            $scope.REPORTS_FLOAT_Obj.PAGE_NO = 1;
            $scope.GetData = true;
        }


        var CashupAppModelObj = new Object();
        CashupAppModelObj.BRANCH_ID = $scope.REPORTS_FLOAT_Obj.SELECTED_SITE.BRANCH_ID;
        CashupAppModelObj.START_DATE = $scope.REPORTS_FLOAT_Obj.START_DATE;
        CashupAppModelObj.END_DATE = $scope.REPORTS_FLOAT_Obj.END_DATE;
        CashupAppModelObj.PAGE_NO = $scope.REPORTS_FLOAT_Obj.PAGE_NO;
        CashupAppModelObj.PAGE_SIZE = $scope.REPORTS_FLOAT_Obj.PAGE_SIZE;


        PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'GET_CASHUP_FLOAT_REPORT').then(function (data) {
            if (data.data && data.data.Table.length > 0) {
                //$scope.FLOAT_LIST = data.data.Table;
                if (flag == null || flag == undefined) {
                    $scope.FLOAT_LIST = data.data.Table;
                }
                else if (flag == 1) {
                    $scope.FLOAT_LIST = $scope.FLOAT_LIST.concat(data.data.Table);
                }
                if (data.data.Table.length < $scope.REPORTS_FLOAT_Obj.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.REPORTS_FLOAT_Obj.PAGE_NO = parseInt($scope.REPORTS_FLOAT_Obj.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else if ($scope.REPORTS_FLOAT_Obj.PAGE_NO > 1 && data.data.Table.length == 0) {
                $scope.GetData = false;
            }
            else if ($scope.REPORTS_FLOAT_Obj.PAGE_NO == 1 && data.data.Table.length == 0) {
                $scope.FLOAT_LIST = [];
                $scope.GetData = false;
                //$scope.LOAD_FETCH_TEXT = 'No Records Found !';
            }
            
        });
    }


    $scope.getColspan = function () {
        if (!$scope.FLOAT_LIST || !$scope.FLOAT_LIST[0]) return 1;
        return Object.keys($scope.FLOAT_LIST[0]).filter(k => k !== 'PAGING').length;
    };

    function reportrange(startDate, endDate) {
        if (!$scope.$$phase && !$scope.$root.$$phase) {
            $scope.$apply(function () {
                $scope.REPORTS_FLOAT_Obj.START_DATE = startDate.format($scope.$parent.DB_DATE_FORMAT);
                $scope.REPORTS_FLOAT_Obj.END_DATE = endDate.format($scope.$parent.DB_DATE_FORMAT);
            });
        } else {
            $scope.REPORTS_FLOAT_Obj.START_DATE = startDate.format($scope.$parent.DB_DATE_FORMAT);
            $scope.REPORTS_FLOAT_Obj.END_DATE = endDate.format($scope.$parent.DB_DATE_FORMAT);
        }
        $('#reportrange span').html(startDate.format($scope.$parent.DATE_RANGE_FORMAT) + ' - ' + endDate.format($scope.$parent.DATE_RANGE_FORMAT));
        $scope.GET_CASHUP_FLOAT_REPORT();
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


    $scope.EXPORT_FLOAT = function (export_flag) {
        var CashupAppModelObj = new Object();
        CashupAppModelObj.BRANCH_ID = $scope.REPORTS_FLOAT_Obj.SELECTED_SITE.BRANCH_ID;
        CashupAppModelObj.START_DATE = $scope.REPORTS_FLOAT_Obj.START_DATE;
        CashupAppModelObj.END_DATE = $scope.REPORTS_FLOAT_Obj.END_DATE;
        CashupAppModelObj.PAGE_NO = 0;
        CashupAppModelObj.PAGE_SIZE = 0;
        CashupAppModelObj.CASHUP_REPORT_TYPE = 11;
        CashupAppModelObj.EXPORT_FLAG = export_flag;
        CashupAppModelObj.FILE_PATH = "/FLOAT_REPORT_" + "/CUSTOMER_" + $scope.ENTITY_ID + "/" + "USER_ID_" + $scope.USER_ID + "/" + (export_flag == 1 ? "CSV" : "XLSX") + "/";
        CashupAppModelObj.FILE_NAME = "Float Report";
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