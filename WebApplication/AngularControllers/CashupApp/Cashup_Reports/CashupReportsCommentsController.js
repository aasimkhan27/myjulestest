app.controller('CashupReportsCommentsController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(2);
    $scope.$parent.CASHUP_COMMON_RESET_Fn();
    


    $scope.ENTITY_ID = parseInt($cookies.get('ENTITY_ID'));
    $scope.USER_ID = parseInt($cookies.get('USERID'));
    $scope.CUSTOMER_ID = parseInt($cookies.get('CUSTOMER_ID'));

    $scope.REPORTS_COMMENTS_Obj = {
        SELECTED_SITE: null,
        CASHUP_DATE: null,
        SELECTED_AREA: null,
        SELECTED_SESSION: null,

    }
    $scope.COMMENT_LIST = [];
    $scope.COMMENT_REVIEW_LIST = [];
    $scope.SESSION_LIST = [];
    $scope.AREA_LIST = [];

    $scope.CASHUP_PRIVILEGE = '1172';
    $scope.$parent.GET_PRIVILEGE($scope.CASHUP_PRIVILEGE);
    $scope.$watch('REPORTS_SITES_LIST', function (newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.selectSite($scope.$parent.REPORTS_SITES_LIST[0]);
        }
    });

    $scope.GET_CASHUP_COMMENTS_REPORT = function () {
        var CashupAppModelObj = new Object();
        CashupAppModelObj.BRANCH_ID = $scope.REPORTS_COMMENTS_Obj.SELECTED_SITE.BRANCH_ID;
        CashupAppModelObj.CASHUP_DATE = moment($scope.REPORTS_COMMENTS_Obj.CASHUP_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).format($scope.$parent.DB_DATE_FORMAT);
        CashupAppModelObj.AREA_ID = $scope.REPORTS_COMMENTS_Obj.SELECTED_AREA != null ? $scope.REPORTS_COMMENTS_Obj.SELECTED_AREA.AREA_ID : null;
        CashupAppModelObj.SESSION_ID = $scope.REPORTS_COMMENTS_Obj.SELECTED_SESSION != null ? $scope.REPORTS_COMMENTS_Obj.SELECTED_SESSION.SESSION_MAPPING_ID : null;
        PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'GET_CASHUP_COMMENTS_REPORT').then(function (data) {
            if (data.data.Table != null && data.data.Table != undefined && data.data.Table.length > 0) {
                $scope.COMMENT_LIST = data.data.Table;
            }
            else {
                $scope.COMMENT_LIST = [];
            }

            if (data.data.Table1 != null && data.data.Table1 != undefined && data.data.Table1.length > 0) {
                $scope.COMMENT_REVIEW_LIST = data.data.Table1;
            }
            else {
                $scope.COMMENT_REVIEW_LIST = [];
            }
        });
    }

    $scope.ADMIN_GET_CU_SESSION_MAPPING_Fn = function (_branchID) {
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
        AreaModelObj.CUSTOMER_ID = $scope.CUSTOMER_ID;
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
                $scope.AREA_LIST=[];
            }
        });
    };

    $scope.dateinputddmmyy = function (index) {
        $(document).ready(function () {
            var date_inputs = document.getElementsByClassName("dateinputddmmyy") //our date input has the name "date"
            if (date_inputs.length > 0) {
                for (var i = 0; i < date_inputs.length; i++) {
                    var date_input = $('input[name="' + date_inputs[i].name + '"]'); //our date input has the name "date"
                    var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
                    var today = new Date();
                    var options = {
                        todayBtn: "linked",
                        daysOfWeekHighlighted: "0,6",
                        autoclose: true,
                        todayHighlight: false,
                        format: 'yyyy-mm-dd',//,$scope.$parent.CALENDAR_DATE_FORMAT
                        format: $scope.$parent.CALENDAR_DATE_FORMAT,
                        clearBtn: true,
                        closeBtn: true,
                        endDate: today
                    };
                    date_input.off("hide").datepicker(options).on("hide", function (e) {
                        $scope.GET_CASHUP_COMMENTS_REPORT();
                    })
                }
            }
        });
    }
    $scope.dateinputddmmyy(1);

    $scope.selectSite = function (_site) {
        $scope.REPORTS_COMMENTS_Obj.SELECTED_SITE = _site;
        $scope.ADMIN_GET_CU_SESSION_MAPPING_Fn(_site.BRANCH_ID);
        $scope.ADMIN_GET_AREA(_site.BRANCH_ID);
        $scope.GET_CASHUP_COMMENTS_REPORT();
    }

    $scope.selectArea = function (_area) {
        if (_area == 'Choose') {
            $scope.REPORTS_COMMENTS_Obj.SELECTED_AREA = null;
        }
        else {
            $scope.REPORTS_COMMENTS_Obj.SELECTED_AREA = _area;
        }

        
        $scope.GET_CASHUP_COMMENTS_REPORT();
    }
    $scope.selectSession = function (_session) {
        if (_session == 'Choose') {
            $scope.REPORTS_COMMENTS_Obj.SELECTED_SESSION = null;
        }
        else {
            $scope.REPORTS_COMMENTS_Obj.SELECTED_SESSION = _session;
        }
        $scope.GET_CASHUP_COMMENTS_REPORT();
    }

});