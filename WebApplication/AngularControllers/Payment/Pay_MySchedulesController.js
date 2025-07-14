app.controller('Pay_MySchedulesController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    //====================== APPROVAL_HEADERS_FOR_SUBMITTER_LISTList =====================================
    $scope.APPROVAL_HEADERS_FOR_SUBMITTER_LIST = [];
    $scope.COMMON_CODE_CHANGE();
    $scope.SchedularViewSearch = {
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        ACTIVE: 1,
        COMMENT: '',
        PAYMENT_DATE: '',
        TOTAL_INVOICES: 0,
        SUPPLIERS_COUNT: 0,
        TOTAL_AMOUNT: 0,
        PAYMENT_AMOUNT: 0,
        STATUS_IDS: null,
        SELF_FALG: 1,
        SCHEDULE_DATE_TEXT: 'Schedule Date',

        REFRRENCE_ID: 1,
        SUPPLIER_COUNT: 2,
        SCHEDULE_NAME: 3,
        SCHEDULE_DATE: 4,
        OVERALL_STATUS: 5,
        TOTAL_INVOICES: 6,
        TOTAL_AMOUNT: 7,
        PAYMENT_AMOUNT: 8,
        CREATED_BY: 9,
        CREATED_DATE: 10,

        REFRRENCE_IDS_SO: true,
        SUPPLIER_COUNT_SO: true,
        SCHEDULE_NAME_SO: true,
        SCHEDULE_DATE_SO: true,
        OVERALL_STATUS_SO: true,
        TOTAL_INVOICES_SO: true,
        TOTAL_AMOUNT_SO: true,
        PAYMENT_AMOUNT_SO: true,
        CREATED_BY_SO: true,
        CREATED_DATE_SO: true,
        BRANCH_IDS: parseInt($cookies.get("BRANCH_ID")),
    };
    $scope.IS_ONE_SIXTY == $scope.$parent.CheckSubModuleAccess(160);
    if ($scope.IS_ONE_SIXTY) {
        $scope.Headers = [
            { NAME: "Ref No.", ID: 1, CLASS_NAME: '', width: '' },
            { NAME: "Name", ID: 3, CLASS_NAME: '', width: '' },
            { NAME: "Date", ID: 4, CLASS_NAME: 'text-left', width: '' },
            { NAME: "Status", ID: 5, CLASS_NAME: 'text-center', width: '' },
            { NAME: "Suppliers", ID: 2, CLASS_NAME: 'text-center', width: '' },
            { NAME: "Invoices", ID: 6, CLASS_NAME: 'text-center', width: '' },
            { NAME: "Sync Error", ID: 6, CLASS_NAME: 'text-center', width: '' },
            { NAME: "Currency", ID: 6, CLASS_NAME: '', width: '' },
            { NAME: "Amount to pay", ID: 7, CLASS_NAME: 'text-right', width: '' },
            { NAME: "Scheduled Amount ", ID: 8, CLASS_NAME: 'text-right', width: '' },
            { NAME: "Created Date", ID: 10, CLASS_NAME: 'text-left', width: '' }
        ];
    } else {
        $scope.Headers = [
            { NAME: "Ref No.", ID: 1, CLASS_NAME: '', width: '' },
            { NAME: "Name", ID: 3, CLASS_NAME: '', width: '' },
            { NAME: "Date", ID: 4, CLASS_NAME: 'text-left', width: '' },
            { NAME: "Status", ID: 5, CLASS_NAME: 'text-center', width: '' },
            { NAME: "Suppliers", ID: 2, CLASS_NAME: 'text-center', width: '' },
            { NAME: "Invoices", ID: 6, CLASS_NAME: 'text-center', width: '' },
            { NAME: "Currency", ID: 6, CLASS_NAME: '', width: '' },
            { NAME: "Amount to pay", ID: 7, CLASS_NAME: 'text-right', width: '' },
            { NAME: "Scheduled Amount ", ID: 8, CLASS_NAME: 'text-right', width: '' },
            { NAME: "Created Date", ID: 10, CLASS_NAME: 'text-left', width: '' }
        ];
    }

    $scope.MY_STATUS = [];
    $scope.APPROVALS_STATUS = [{ NAME: "APPROVED", ID: 37 }, { NAME: "REJECTED", ID: 38 }, { NAME: "PENDING", ID: 39 }, { NAME: "CANCELLED", ID: 42 }];
    if ($scope.$parent.CheckSubModuleAccess(57)) {

        $scope.MY_STATUS = [{ NAME: "All Schedules", ID: 0 }, { NAME: "My Schedules", ID: 1 }];
    }
    else {
        $scope.MY_STATUS = [{ NAME: "My Schedules", ID: 1 }];
    }
    function reportShdlScheduledaterange(startDate, endDate) {
        $scope.SchedularViewSearch.PYMNT_START_DATE = startDate.format($scope.$parent.Datelocaleformat.format);
        $scope.SchedularViewSearch.PYMNT_END_DATE = endDate.format($scope.$parent.Datelocaleformat.format);
        $('#reportShdlScheduledaterange span').html(startDate.format($scope.$parent.Datelocaleformat.format) + ' - ' + endDate.format($scope.$parent.Datelocaleformat.format));
    };
    $(function () {
        startDate = moment().startOf('month');//moment().startOf('isoWeek');//moment().subtract(6, 'days');
        endDate = moment().endOf('month'); //moment().subtract(0, 'days');
        $scope.$parent.SetUpDateRangeMultiDatePicker('reportShdlScheduledaterange', startDate, endDate, reportShdlScheduledaterange, 1);
    });
    $(document).on("click", ".ranges ul li", function (event) {
        var a = $(this).attr("data-range-key");
        if (a == "Custom Date" && ($scope.loader == 1)) {
            $scope.loader = 2;
            var start = moment().startOf('month');
            var end = moment().add(1, 'M').endOf('month');
            //$('#' + ControlName).trigger('show.daterangepicker')
            $scope.$parent.SetUpDateRangeMultiDatePicker('reportrange', start, end, reportrange, 1, "right", 'Open');
            $('#reportrange').data('daterangepicker').show();
        }
        else {
            $scope.loader = 1;
        }
    });
    $scope.loader = 1;
    $scope.GET_APPROVAL_HEADERS_FOR_SUBMITTER_LAZY_LOAD = function () {
        $scope.GET_APPROVAL_HEADERS_FOR_SUBMITTER(2, $scope.SORT_COLUMN_NO, $scope.SORT_ORDER_NO_ASCDESC);
    };
    $scope.RESET_XERO_INVOICES_FILTER = function () {
        $scope.SchedularViewSearch = {
            PAGE_NO: 1,
            PAGE_SIZE: 10,
            ACTIVE: 1,
            BRANCH_IDS: parseInt($cookies.get("BRANCH_ID")),
        };
    }




    $scope.RESET_MY_SHDL = function () {
        $scope.SchedularViewSearch.PYMNT_START_DATE = "";
        $scope.SchedularViewSearch.PYMNT_END_DATE = "";
        $scope.SchedularViewSearch.STATUS_IDS = null;
        $scope.SchedularViewSearch.BRANCH_LOGIN_ID = parseInt($cookies.get("BRANCH_ID"));
        $('#reportShdlScheduledaterange span').html($scope.SchedularViewSearch.SCHEDULE_DATE_TEXT);
        $scope.GET_APPROVAL_HEADERS_FOR_SUBMITTER(1, $scope.SORT_COLUMN_NO, $scope.SORT_ORDER_NO_ASCDESC);
    }
    $scope.GET_APPROVAL_HEADERS_FOR_SUBMITTER = function (FLAG, SORT_COLUMN_NO, SORT_ORDER_NO_ASCDESC) {
        $scope.SORT_COLUMN_NO = SORT_COLUMN_NO;
        $scope.SORT_ORDER_NO_ASCDESC = SORT_ORDER_NO_ASCDESC;
        $scope.$parent.overlay_loadingNew = 'block';
        var PaymentModelObj = new Object();
        if (FLAG == 1) {
            $scope.APPROVAL_HEADERS_FOR_SUBMITTER_LIST = [];
            $scope.SchedularViewSearch.PAGE_NO = 1;
        }

        PaymentModelObj.APPROVAL_TYPE_ID = 1//$scope.SchedularViewSearch.APPROVAL_TYPE_ID;
        PaymentModelObj.PYMNT_START_DATE = $scope.SchedularViewSearch.PYMNT_START_DATE;
        PaymentModelObj.PYMNT_END_DATE = $scope.SchedularViewSearch.PYMNT_END_DATE;
        PaymentModelObj.SELF_FLAG = $scope.SchedularViewSearch.SELF_FALG;// -- 1 FOR CREATED BY USER AND 0 FOR ALL
        PaymentModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PaymentModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PaymentModelObj.LOCATION_IDS = $scope.SchedularViewSearch.LOCATION_IDS;
        PaymentModelObj.BRANCH_IDS = $scope.SchedularViewSearch.BRANCH_IDS;
        PaymentModelObj.STATUS_IDS = $scope.SchedularViewSearch.STATUS_IDS == null ? '37,38,39,42' : $scope.SchedularViewSearch.STATUS_IDS;
        PaymentModelObj.PAGE_NO = $scope.SchedularViewSearch.PAGE_NO;
        PaymentModelObj.PAGE_SIZE = $scope.SchedularViewSearch.PAGE_SIZE;
        PaymentModelObj.SORT_ORDER_NO = SORT_ORDER_NO_ASCDESC ? 1 : -1;//1 FOR ASC -1 FOR DESC
        PaymentModelObj.SORT_COLUMN_NO = SORT_COLUMN_NO;
        PrcCommMethods.PAYMENT_API(PaymentModelObj, 'GET_APPROVAL_HEADERS_FOR_SUBMITTER').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.$parent.overlay_loadingNew = 'none';
                $scope.APPROVAL_HEADERS_FOR_SUBMITTER_LIST = $scope.APPROVAL_HEADERS_FOR_SUBMITTER_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.SchedularViewSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.SchedularViewSearch.PAGE_NO = parseInt($scope.SchedularViewSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            } else {
                if ($scope.APPROVAL_HEADERS_FOR_SUBMITTER_LIST.length == 0) { }
                $scope.GetData = false;
                $scope.$parent.overlay_loadingNew = 'none';
            }
        })
    }
    $scope.GET_APPROVAL_HEADERS_FOR_SUBMITTER(1, 4, false);
    $scope.GO_TO_APPROVAL = function (LIST) {
        var URLPRAM = { HEADER_ID: LIST.APPROVAL_HEADER_ID, TYPE_ID: LIST.APPROVAL_TYPE_ID, FLAG: 2 };
        $location.path('Approvals_View').search(URLPRAM);
    }
    $scope.CANCEL_PAYMENT_SCHEDULE = function (ASL) {
        //
        if (ASL.OVERALL_STATUS_ID == 37) {
            $scope.$parent.ShowAlert('Error', 'you cannot cancel a approved schedule.', 5000);
        } else if (ASL.OVERALL_STATUS_ID == 38) {
            $scope.$parent.ShowAlert('Error', 'It is already cancelled', 5000);
        }
        else if (ASL.OVERALL_STATUS_ID == 42) {
            $scope.$parent.ShowAlert('Error', 'you cannot cancel a rejected schedule', 5000);
        }

        else {
            if (ASL.EDIT_FLAG == 0) { // if flag is 0 then restricted and 1 for allow 
                $scope.$parent.ShowAlert('Error', 'You cannot cancel this schedule, it is already in approval process.', 5000);
            }
            else {
                if (confirm("Are you sure, You want to cancel this approval process?")) {
                    $scope.CANCEL_APPROVALS(ASL);
                }
            }
        }
    }

    $scope.CANCEL_APPROVALS = function (ASL) {
        var PaymentModelObj = new Object();
        PaymentModelObj.APPROVAL_HEADER_ID = parseInt(ASL.APPROVAL_HEADER_ID);
        PaymentModelObj.APPROVAL_LINE_IDS = null;
        PaymentModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PaymentModelObj.COMMENT = null
        PrcCommMethods.PAYMENT_API(PaymentModelObj, 'CANCEL_APPROVALS').then(function (data) {
            if (data.data == 0) {
                $scope.$parent.ShowAlert('Error', $scope.$parent.SOMETHINGWENTWRONG, 5000);
            }
            if (data.data == 1) {
                $scope.$parent.ShowAlert('Success', 'Your submission has been save.', 5000);
                $scope.GET_APPROVAL_HEADERS_FOR_SUBMITTER(1, $scope.SORT_COLUMN_NO, $scope.SORT_ORDER_NO_ASCDESC);
            }
        })
    }

    $scope.GET_PYMNT_SUPPLIER = function () {
        var PaymentModelObj = new Object();
        PaymentModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PaymentModelObj.BRANCH_LOGIN_ID = parseInt($cookies.get("BRANCH_ID"));
        PaymentModelObj.PAGE_NO = 0;
        PaymentModelObj.PAGE_SIZE = 0;
        PaymentModelObj.SUPPLIER_NAME = null;
        PaymentModelObj.FLAG = 1;
        PrcCommMethods.PAYMENT_API(PaymentModelObj, 'GET_PYMNT_SUPPLIER').then(function (data) {
            if (data.data != undefined && data.data.Table.length > 0) {
                $scope.SUPPLIER_LIST = data.data.Table;
            } else {
                $scope.SUPPLIER_LIST = [];
            }
        })
    }
    //$scope.GET_PYMNT_SUPPLIER();
    $scope.DELETE_INVOICE = function (IN_LIST, index) {
        if ($scope.XERO_INVOICES_SELECTED_LIST.length == 0) {
            $scope.SchedularViewSearch.IS_ALL_SELECTED = false;
            $scope.APPROVAL_HEADERS_FOR_SUBMITTER_LIST.filter(function (x) { x.IS_SELECTED = false; });
            $scope.SCHEDULE_CLICK = true;
        } else {
            $scope.APPROVAL_HEADERS_FOR_SUBMITTER_LIST.filter(function (x) { if (IN_LIST.ID == x.ID) { x.IS_SELECTED = false } });
        };

        $scope.XERO_INVOICES_SELECTED_LIST.splice(index, 1);
    }

});
