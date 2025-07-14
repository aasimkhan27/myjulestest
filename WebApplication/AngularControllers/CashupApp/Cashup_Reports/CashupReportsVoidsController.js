app.controller('CashupReportsVoidsController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(2);
    $scope.$parent.CASHUP_COMMON_RESET_Fn();
    $scope.REPORTS_PRIVILEGE_ID = '1172';
    $scope.REPORTS_VOIDS_Obj = {
        SELECTED_SITE: null,
        START_DATE: null,
        END_DATE: null,
        SELECTED_AREA: null,
        SELECTED_SESSION: null,
        SELECTED_VOID_TYPE: null,
        SEARCH_TEXT: '',
        PAGE_NO: 1,
        PAGE_SIZE: 10
        
    }
    $scope.ENTITY_ID = parseInt($cookies.get('ENTITY_ID'));
    $scope.USER_ID = parseInt($cookies.get('USERID'));

    $scope.AREA_LIST = [];
    $scope.SESSION_LIST = [];
    $scope.VOID_TYPE_LIST = [];
    $scope.VOID_LIST = [];
    $scope.GetData = true;
    $scope.$parent.GET_PRIVILEGE($scope.REPORTS_PRIVILEGE_ID);

    $scope.$watch('REPORTS_SITES_LIST', function (newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.selectSite($scope.REPORTS_SITES_LIST[0]);
        }
    });

    $scope.GET_SESSION_BY_BRANCH = function (_branchID) {
        var SessionObj = new Object();
        SessionObj.BRANCH_ID = _branchID;
        PrcCommMethods.CASHUP_APP_API(SessionObj, 'GET_SESSION_BY_BRANCH').then(function (data) {
            if (data.data && data.data.length > 0) {
                $scope.SESSION_LIST = data.data;
            } else {
                $scope.SESSION_LIST = [];
            }
        })
    };
    $scope.ADMIN_GET_AREA = function (_branchID) {
        var AreaModelObj = new Object();
        AreaModelObj.CUSTOMER_ID = $cookies.get("CUSTOMER_ID");
        AreaModelObj.AREA_CODE = null;
        AreaModelObj.AREA_NAME = null;
        AreaModelObj.ACTIVE = 1;
        AreaModelObj.PAGE_NO = 0;
        AreaModelObj.PAGE_SIZE = 0;
        AreaModelObj.BRANCH_ID = _branchID;
        PrcCommMethods.ADMIN_API(AreaModelObj, 'ADMIN_GET_AREA').then(function (data) {
            if (data.data && data.data.Table.length > 0) {
                $scope.AREA_LIST = data.data.Table;
            } else {
                $scope.AREA_LIST = [];
            }
        });
    };
    $scope.ADMIN_GET_REASON_FOR_VOID = function (_branch_id) {
        var CommonObj = new Object();
        CommonObj.CUSTOMER_ID = $cookies.get("CUSTOMER_ID");
        CommonObj.ENTITY_ID = $cookies.get("ENTITY_ID");
        CommonObj.LOCATION_ID = 0;
        CommonObj.BRANCH_ID = _branch_id;
        CommonObj.REASON = null;
        CommonObj.ACTIVE = 1;
        CommonObj.PAGE_NO = 0;
        CommonObj.PAGE_SIZE = 0;
        PrcCommMethods.CASHUP_APP_API(CommonObj, 'ADMIN_GET_REASON_FOR_VOID').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.VOID_TYPE_LIST = data.data.Table;
            }
            else {
                $scope.VOID_TYPE_LIST = [];
            }
        });
    };



    $scope.GET_CASHUP_VOID_REPORT = function (flag) {
        if (flag == null || flag == undefined) {
            $scope.REPORTS_VOIDS_Obj.PAGE_NO = 1;
            $scope.GetData = true;
        }
        var CashupAppModelObj = new Object();
        CashupAppModelObj.BRANCH_ID = $scope.REPORTS_VOIDS_Obj.SELECTED_SITE.BRANCH_ID;
        CashupAppModelObj.START_DATE = $scope.REPORTS_VOIDS_Obj.START_DATE;
        CashupAppModelObj.END_DATE = $scope.REPORTS_VOIDS_Obj.END_DATE;
        CashupAppModelObj.SESSION_ID = $scope.REPORTS_VOIDS_Obj.SELECTED_SESSION != null ? $scope.REPORTS_VOIDS_Obj.SELECTED_SESSION.SESSION_MASTER_ID : null;
        CashupAppModelObj.AREA_ID = $scope.REPORTS_VOIDS_Obj.SELECTED_AREA != null ? $scope.REPORTS_VOIDS_Obj.SELECTED_AREA.AREA_ID : null;
        CashupAppModelObj.VOID_TYPE_ID = $scope.REPORTS_VOIDS_Obj.SELECTED_VOID_TYPE != null ? $scope.REPORTS_VOIDS_Obj.SELECTED_VOID_TYPE.VOID_ID : null;
        CashupAppModelObj.SEARCH_TEXT = $scope.REPORTS_VOIDS_Obj.SEARCH_TEXT;
        CashupAppModelObj.PAGE_NO = $scope.REPORTS_VOIDS_Obj.PAGE_NO;
        CashupAppModelObj.PAGE_SIZE = $scope.REPORTS_VOIDS_Obj.PAGE_SIZE;


        //CashupAppModelObj.BRANCH_ID = 145;
        //CashupAppModelObj.START_DATE = '2024-01-01';
        //CashupAppModelObj.END_DATE = '2025-07-03';
        //CashupAppModelObj.SESSION_ID = null;
        //CashupAppModelObj.AREA_ID = null;
        //CashupAppModelObj.VOID_TYPE_ID = null;
        //CashupAppModelObj.SEARCH_TEXT = '';
        //CashupAppModelObj.PAGE_NO = $scope.REPORTS_VOIDS_Obj.PAGE_NO;
        //CashupAppModelObj.PAGE_SIZE = $scope.REPORTS_VOIDS_Obj.PAGE_SIZE;

        PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'GET_CASHUP_VOID_REPORT').then(function (data) {
            if (data.data && data.data.Table.length > 0) {
                if (flag == null || flag == undefined) {
                    $scope.VOID_LIST = data.data.Table;
                }
                else if (flag == 1) {
                    $scope.VOID_LIST = $scope.VOID_LIST.concat(data.data.Table);
                }
                if (data.data.Table.length < $scope.REPORTS_VOIDS_Obj.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.REPORTS_VOIDS_Obj.PAGE_NO = parseInt($scope.REPORTS_VOIDS_Obj.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else if ($scope.REPORTS_VOIDS_Obj.PAGE_NO > 1 && data.data.Table.length == 0) {
                $scope.GetData = false;
            }
            else if ($scope.REPORTS_VOIDS_Obj.PAGE_NO == 1 && data.data.Table.length == 0) {
                $scope.VOID_LIST = [];
                $scope.GetData = false;
            }
        });
    }



    $scope.selectSite = function (_site) {
        $scope.REPORTS_VOIDS_Obj.SELECTED_SITE = _site;
        $scope.REPORTS_VOIDS_Obj.SELECTED_AREA = null;
        $scope.REPORTS_VOIDS_Obj.SELECTED_SESSION = null;
        $scope.AREA_LIST = [];
        $scope.SESSION_LIST = [];
        $scope.VOID_TYPE_LIST = [];
        $scope.GET_SESSION_BY_BRANCH(_site.BRANCH_ID);
        $scope.ADMIN_GET_AREA(_site.BRANCH_ID);
        $scope.ADMIN_GET_REASON_FOR_VOID(_site.BRANCH_ID);
        $scope.GET_CASHUP_VOID_REPORT();
    }



    $scope.selectSession = function (_session) {
        if (_session == 'Choose') {
            $scope.REPORTS_VOIDS_Obj.SELECTED_SESSION = null;
        }
        else {
            $scope.REPORTS_VOIDS_Obj.SELECTED_SESSION = _session;
        }
        $scope.GET_CASHUP_VOID_REPORT();
    }

    $scope.selectArea = function (_area) {
        if (_area == 'Choose') {
            $scope.REPORTS_VOIDS_Obj.SELECTED_AREA = null;
        }
        else {
            $scope.REPORTS_VOIDS_Obj.SELECTED_AREA = _area;
        }
        $scope.GET_CASHUP_VOID_REPORT();
    }
    $scope.selectVoidReason = function (_reason) {
        if (_reason == 'Choose') {
            $scope.REPORTS_VOIDS_Obj.SELECTED_VOID_TYPE = null;
        }
        else {
            $scope.REPORTS_VOIDS_Obj.SELECTED_VOID_TYPE = _reason;
        }
        $scope.GET_CASHUP_VOID_REPORT();
    }

    $scope.getColspan = function () {
        if (!$scope.VOID_LIST || !$scope.VOID_LIST[0]) return 1;
        return Object.keys($scope.VOID_LIST[0]).filter(k => k !== 'PAGING').length;
    };

    function reportrange(startDate, endDate) {
        if (!$scope.$$phase && !$scope.$root.$$phase) {
            $scope.$apply(function () {
                $scope.REPORTS_VOIDS_Obj.START_DATE = startDate.format($scope.$parent.DB_DATE_FORMAT);
                $scope.REPORTS_VOIDS_Obj.END_DATE = endDate.format($scope.$parent.DB_DATE_FORMAT);
            });
        } else {
            $scope.REPORTS_VOIDS_Obj.START_DATE = startDate.format($scope.$parent.DB_DATE_FORMAT);
            $scope.REPORTS_VOIDS_Obj.END_DATE = endDate.format($scope.$parent.DB_DATE_FORMAT);
        }
        $('#reportrange span').html(startDate.format($scope.$parent.DATE_RANGE_FORMAT) + ' - ' + endDate.format($scope.$parent.DATE_RANGE_FORMAT));
        $scope.GET_CASHUP_VOID_REPORT();
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

    $scope.EXPORT_VOID = function (export_flag) {
        var CashupAppModelObj = new Object();
        CashupAppModelObj.BRANCH_ID = $scope.REPORTS_VOIDS_Obj.SELECTED_SITE.BRANCH_ID;
        CashupAppModelObj.START_DATE = $scope.REPORTS_VOIDS_Obj.START_DATE;
        CashupAppModelObj.END_DATE = $scope.REPORTS_VOIDS_Obj.END_DATE;
        CashupAppModelObj.SESSION_ID = $scope.REPORTS_VOIDS_Obj.SELECTED_SESSION != null ? $scope.REPORTS_VOIDS_Obj.SELECTED_SESSION.SESSION_MASTER_ID : null;
        CashupAppModelObj.AREA_ID = $scope.REPORTS_VOIDS_Obj.SELECTED_AREA != null ? $scope.REPORTS_VOIDS_Obj.SELECTED_AREA.AREA_ID : null;
        CashupAppModelObj.VOID_TYPE_ID = $scope.REPORTS_VOIDS_Obj.SELECTED_VOID_TYPE != null ? $scope.REPORTS_VOIDS_Obj.SELECTED_VOID_TYPE.VOID_ID : null;
        CashupAppModelObj.SEARCH_TEXT = $scope.REPORTS_VOIDS_Obj.SEARCH_TEXT;

        //CashupAppModelObj.BRANCH_ID = 145;
        //CashupAppModelObj.START_DATE = '2024-01-01';
        //CashupAppModelObj.END_DATE = '2025-07-03';
        //CashupAppModelObj.SESSION_ID = null;
        //CashupAppModelObj.AREA_ID = null;
        //CashupAppModelObj.VOID_TYPE_ID = null;
        //CashupAppModelObj.SEARCH_TEXT = '';



        CashupAppModelObj.PAGE_NO = 0;
        CashupAppModelObj.PAGE_SIZE = 0;

        CashupAppModelObj.CASHUP_REPORT_TYPE = 10;
        CashupAppModelObj.EXPORT_FLAG = export_flag;
        CashupAppModelObj.FILE_PATH = "/VOID_REPORT_" + "/CUSTOMER_" + $scope.ENTITY_ID + "/" + "USER_ID_" + $scope.USER_ID + "/" + (export_flag == 1 ? "CSV" : "XLSX") + "/";
        CashupAppModelObj.FILE_NAME = "VOID Report";
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