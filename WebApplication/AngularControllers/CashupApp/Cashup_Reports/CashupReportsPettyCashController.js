app.controller('CashupReportsPettyCashController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(2);
    $scope.$parent.CASHUP_COMMON_RESET_Fn();
    $scope.CASHUP_PRIVILEGE = '1172';
    $scope.REPORTS_PETTY_CASH_Obj = {
        SELECTED_SITE: null,
        START_DATE: null,
        END_DATE: null,
        COST_CATEGORY: null,
        SEARCH_TEXT: null,
        PAGE_NO: 1,
        PAGE_SIZE: 10

    }
    $scope.ENTITY_ID = parseInt($cookies.get('ENTITY_ID'));
    $scope.USER_ID = parseInt($cookies.get('USERID'));
    $scope.COST_CATEGORY_LIST = [];
    $scope.GetData = true;
    $scope.PETTY_CASH_LIST = [];
    $scope.$parent.GET_PRIVILEGE($scope.CASHUP_PRIVILEGE);
    $scope.$watch('REPORTS_SITES_LIST', function (newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.selectSite($scope.$parent.REPORTS_SITES_LIST[0]);
        }
    });

    $scope.GET_PETTY_CASH_COST_CATEGORIES = function (_branchId) {
        var CashupAppModelObj = new Object();
        CashupAppModelObj.BRANCH_ID = _branchId;
        PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'GET_PETTY_CASH_COST_CATEGORIES').then(function (data) {
            if (data.data != null && data.data!=undefined && data.data.Table.length > 0) {
                $scope.COST_CATEGORY_LIST = data.data.Table;
            }
            else {
                $scope.COST_CATEGORY_LIST = [];
            }
        });
    };
    

    $scope.GET_CASHUP_PETTY_CASH_REPORT = function (flag) {
        if (flag == null || flag == undefined) {
            $scope.REPORTS_PETTY_CASH_Obj.PAGE_NO = 1;
            $scope.GetData = true;
        }

        var CashupAppModelObj = new Object();
        CashupAppModelObj.BRANCH_ID = $scope.REPORTS_PETTY_CASH_Obj.SELECTED_SITE.BRANCH_ID;
        CashupAppModelObj.START_DATE = $scope.REPORTS_PETTY_CASH_Obj.START_DATE;
        CashupAppModelObj.END_DATE = $scope.REPORTS_PETTY_CASH_Obj.END_DATE;
        CashupAppModelObj.COST_CATEGORY_ID = $scope.REPORTS_PETTY_CASH_Obj.COST_CATEGORY != null ? $scope.REPORTS_PETTY_CASH_Obj.COST_CATEGORY.PETTY_CASH_COST_CATEGORIE_ID:null;
        CashupAppModelObj.SEARCH_TEXT = $scope.REPORTS_PETTY_CASH_Obj.SEARCH_TEXT;
        CashupAppModelObj.PAGE_NO = $scope.REPORTS_PETTY_CASH_Obj.PAGE_NO;
        CashupAppModelObj.PAGE_SIZE = $scope.REPORTS_PETTY_CASH_Obj.PAGE_SIZE;

        //CashupAppModelObj.BRANCH_ID = 92;
        //CashupAppModelObj.START_DATE = '2019-01-01';//$scope.REPORTS_TOTAL_CASH_Obj.START_DATE;
        //CashupAppModelObj.END_DATE = '2025-07-02';//$scope.REPORTS_TOTAL_CASH_Obj.END_DATE;
        //CashupAppModelObj.SESSION_ID = null;
        //CashupAppModelObj.AREA_ID = null;
        //CashupAppModelObj.PAGE_NO = 0;
        //CashupAppModelObj.PAGE_SIZE = 0;

        PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'GET_CASHUP_PETTY_CASH_REPORT').then(function (data) {
            if (data.data && data.data.Table.length > 0) {
                if (flag == null || flag == undefined) {
                    $scope.PETTY_CASH_LIST = data.data.Table;
                }
                else if (flag == 1) {
                    $scope.PETTY_CASH_LIST = $scope.PETTY_CASH_LIST.concat(data.data.Table);
                }
                if (data.data.Table.length < $scope.REPORTS_PETTY_CASH_Obj.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.REPORTS_PETTY_CASH_Obj.PAGE_NO = parseInt($scope.REPORTS_PETTY_CASH_Obj.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else if ($scope.REPORTS_PETTY_CASH_Obj.PAGE_NO > 1 && data.data.Table.length == 0) {
                $scope.GetData = false;
            }
            else if ($scope.REPORTS_PETTY_CASH_Obj.PAGE_NO == 1 && data.data.Table.length == 0) {
                $scope.PETTY_CASH_LIST = [];
                $scope.GetData = false;
            }
        });
    }

    $scope.nginit_pettyCash = function (_row) {
        if (_row["FILE_NAME"] != null && _row["FILE_NAME"] != undefined) {
            var files = [];
            var filePath = _row["FILE_NAME"].split(':;:')[0];
            var fileNames = _row["FILE_NAME"].split(':;:').slice(1);
            angular.forEach(fileNames, function (fileName) {
                var fileObject = new Object();
                fileObject.FILE_PATH = filePath;
                fileObject.SERVER_FILE_NAME = fileName;
                files.push(fileObject)
            });
            _row["FILE_NAME"] = files;
        }
        
    }

    $scope.selectSite = function (_site) {
        $scope.REPORTS_PETTY_CASH_Obj.SELECTED_SITE = _site;
        $scope.GET_PETTY_CASH_COST_CATEGORIES(_site.BRANCH_ID);
        $scope.GET_CASHUP_PETTY_CASH_REPORT();
    }

    $scope.selectCostCategory = function (_cc) {
        if (_cc == 'Choose') {
            $scope.REPORTS_PETTY_CASH_Obj.COST_CATEGORY = null;
        }
        else {
            $scope.REPORTS_PETTY_CASH_Obj.COST_CATEGORY = _cc;
        }
        $scope.GET_CASHUP_PETTY_CASH_REPORT();
    }
    $scope.getColspan = function () {
        if (!$scope.PETTY_CASH_LIST || !$scope.PETTY_CASH_LIST[0]) return 1;
        return Object.keys($scope.PETTY_CASH_LIST[0]).filter(k => k !== 'PAGING').length;
    };

    
    function reportrange(startDate, endDate) {
        if (!$scope.$$phase && !$scope.$root.$$phase) {
            $scope.$apply(function () {
                $scope.REPORTS_PETTY_CASH_Obj.START_DATE = startDate.format($scope.$parent.DB_DATE_FORMAT);
                $scope.REPORTS_PETTY_CASH_Obj.END_DATE = endDate.format($scope.$parent.DB_DATE_FORMAT);
            });
        } else {
            $scope.REPORTS_PETTY_CASH_Obj.START_DATE = startDate.format($scope.$parent.DB_DATE_FORMAT);
            $scope.REPORTS_PETTY_CASH_Obj.END_DATE = endDate.format($scope.$parent.DB_DATE_FORMAT);
        }
        $('#reportrange span').html(startDate.format($scope.$parent.DATE_RANGE_FORMAT) + ' - ' + endDate.format($scope.$parent.DATE_RANGE_FORMAT));
        $scope.GET_CASHUP_PETTY_CASH_REPORT();
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


    $scope.EXPORT_PETTY_CASH = function (export_flag) {
        var CashupAppModelObj = new Object();
        CashupAppModelObj.BRANCH_ID = $scope.REPORTS_PETTY_CASH_Obj.SELECTED_SITE.BRANCH_ID;
        CashupAppModelObj.START_DATE = $scope.REPORTS_PETTY_CASH_Obj.START_DATE;
        CashupAppModelObj.END_DATE = $scope.REPORTS_PETTY_CASH_Obj.END_DATE;
        CashupAppModelObj.COST_CATEGORY_ID = $scope.REPORTS_PETTY_CASH_Obj.COST_CATEGORY != null ? $scope.REPORTS_PETTY_CASH_Obj.COST_CATEGORY.PETTY_CASH_COST_CATEGORIE_ID : null;
        CashupAppModelObj.SEARCH_TEXT = $scope.REPORTS_PETTY_CASH_Obj.SEARCH_TEXT;
        CashupAppModelObj.PAGE_NO = 0;
        CashupAppModelObj.PAGE_SIZE = 0;
        CashupAppModelObj.CASHUP_REPORT_TYPE = 7;
        CashupAppModelObj.EXPORT_FLAG = export_flag;
        CashupAppModelObj.FILE_PATH = "/PETTY_CASH_REPORT_" + "/CUSTOMER_" + $scope.ENTITY_ID + "/" + "USER_ID_" + $scope.USER_ID + "/" + (export_flag == 1 ? "CSV" : "XLSX") + "/";
        CashupAppModelObj.FILE_NAME = "PETTY Cash Report";
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