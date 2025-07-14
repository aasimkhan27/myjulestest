app.controller('CashupListControllerNew', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.CASHUPLIST = [];
    $scope.BRANCH_LIST = [];
    $scope.VIEW_CHECK_MODULE_ACCESS = false;
    $scope.EDIT_CHECK_MODULE_ACCESS = false;
    var startDate;
    var endDate;
    $scope.CashupSearch = {
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        ACTIVE: 1
    };

    function reportrange(startDate, endDate) {

        $scope.CashupSearch.START_DATE = startDate.format($scope.$parent.Datelocaleformat.format);
        $scope.CashupSearch.END_DATE = endDate.format($scope.$parent.Datelocaleformat.format);
        $('#reportrange span').html(startDate.format($scope.$parent.Datelocaleformat.format) + ' - ' + endDate.format($scope.$parent.Datelocaleformat.format));
    };
    $(function () {

        startDate = new moment().add(0, 'months').date(0);//new moment().subtract(1, 'months').date(1); //moment().add('months', 1).date(0);//moment().startOf('month');   //moment().startOf('isoWeek');//moment().subtract(6, 'days');
        endDate = moment().endOf('month'); //moment().subtract(0, 'days');
        $scope.$parent.SetUpDateRangeMultiDatePicker('reportrange', startDate, endDate, reportrange);
        $('#reportrange span').html(startDate.format($scope.$parent.Datelocaleformat.format) + ' - ' + endDate.format($scope.$parent.Datelocaleformat.format));
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
    $scope.LAZY_GET_CASHUP_LIST = function () {
        $scope.GET_CASHUP_LIST();
    };
    $scope.GET_CASHUP_LIST = function (FLAG) {
        var CashupModelObj = new Object();
        if (FLAG == 1) {
            $scope.CASHUPLIST = [];
            $scope.CashupSearch.PAGE_NO = 1;
        }

        CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
        CashupModelObj.CASHUP_DATE_START = $scope.CashupSearch.START_DATE == undefined ? moment().startOf('month').format($scope.$parent.Datelocaleformat.format) : $scope.CashupSearch.START_DATE;
        CashupModelObj.CASHUP_DATE_END = $scope.CashupSearch.END_DATE == undefined ? moment().endOf('month').format($scope.$parent.Datelocaleformat.format) : $scope.CashupSearch.END_DATE;
        CashupModelObj.STATUS_IDS = $scope.CashupSearch.STATUS_ID == null ? '' : $scope.CashupSearch.STATUS_ID;
        CashupModelObj.BRANCH_IDS = $scope.CashupSearch.BRANCH_ID == null ? '' : $scope.CashupSearch.BRANCH_ID;
        CashupModelObj.PAGE_NO = $scope.CashupSearch.PAGE_NO;
        CashupModelObj.PAGE_SIZE = $scope.CashupSearch.PAGE_SIZE;
        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_CASHUP_LIST').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.CASHUPLIST = $scope.CASHUPLIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.CashupSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.CashupSearch.PAGE_NO = parseInt($scope.CashupSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else {
                $scope.GetData = false;
                //$scope.CASHUPLIST = [];
            }
            $scope.EDIT_CHECK_MODULE_ACCESS = $scope.CheckSubModuleAccess(9);
            $scope.VIEW_CHECK_MODULE_ACCESS = $scope.CheckSubModuleAccess(11);
        });
        //  $scope.EDIT_PROFILE_CHECK_MODULE_ACCESS = $scope.$parent.CHECK_MODULE_ACCESS(1, 1);

        //$scope.IS_VIEW_FLAG = true;
        //if ($scope.EmpID == parseInt($cookies.get("EMPLOYEE_ID"))) {
        //    $scope.IS_VIEW_FLAG = false;
        //    $scope.EDIT_PROFILE_CHECK_MODULE_ACCESS = $scope.CheckSubModuleAccess(4);
        //}
        //else {
        //    $scope.EDIT_PROFILE_CHECK_MODULE_ACCESS = $scope.$parent.CHECK_MODULE_ACCESS(3, 3);
        //}
    };
    $scope.CashUpEntry = function (Cashup, Flag) {

        if (Flag == 'Edit') {
            $scope.$parent.CashUp_Main_ID = Cashup.ID;
            $scope.$parent.CashUp_Main_STATUS_ID = Cashup.STATUS_ID;
            $scope.$parent.CashUp_Main_CASHUP_DATE = Cashup.CASHUP_DATE;
            $scope.$parent.CashUp_Main_BRANCH_ID = Cashup.BRANCH_ID;
            $scope.$parent.CashUp_Main_BRANCH_NAME = Cashup.BRANCH_NAME;
            $scope.$parent.CashUp_Main_BRANCH_CODE = Cashup.BRANCH_CODE;
            window.location.href = '../Cashup/CashupIndex#!/CEN?CMID=' + $scope.$parent.CashUp_Main_ID;
        } else if (Flag == 'View') {
            $scope.$parent.CashUp_Main_ID = Cashup.ID;
            $scope.$parent.CashUp_Main_STATUS_ID = Cashup.STATUS_ID;
            $scope.$parent.CashUp_Main_CASHUP_DATE = Cashup.CASHUP_DATE;
            $scope.$parent.CashUp_Main_BRANCH_ID = Cashup.BRANCH_ID;
            $scope.$parent.CashUp_Main_BRANCH_NAME = Cashup.BRANCH_NAME;
            $scope.$parent.CashUp_Main_BRANCH_CODE = Cashup.BRANCH_CODE;
            window.location.href = '../Cashup/CashupIndex#!/CEN_VIEW?FG=VIEW&CMID=' + $scope.$parent.CashUp_Main_ID;
        }
        //$location.path('CE');
    };

    var USER_ID = parseInt($cookies.get("USERID"));
    PrcCommMethods.GET_BRANCH_LIST(parseInt($cookies.get("ENTITY_ID")), USER_ID, 1).then(function (data) {
        $scope.BRANCH_LIST = data;
        if ($scope.BRANCH_LIST.length > 0) {
            $scope.CashupSearch.BRANCH_ID = $scope.BRANCH_LIST[0].BRANCH_ID;
            $scope.GET_CASHUP_LIST(1);
        }
        // $scope. $scope.CheckSubModuleAccess(11);
    });


});
app.controller('ApprovalListControllerNew', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.CASHUPLIST = [];
    var startDate;
    var endDate;
    $scope.CashupSearch = {
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        ACTIVE: 1,
        STATUS_ID: '3,4,5'
    };
    function reportrange(startDate, endDate) {
        $scope.CashupSearch.START_DATE = startDate.format($scope.$parent.Datelocaleformat.format);
        $scope.CashupSearch.END_DATE = endDate.format($scope.$parent.Datelocaleformat.format);
        $('#reportrange span').html(startDate.format($scope.$parent.Datelocaleformat.format) + ' - ' + endDate.format($scope.$parent.Datelocaleformat.format));

    };
    $(function () {
        startDate = new moment().add(0, 'months').date(0);//moment().startOf('month');// moment().startOf('month');//('isoWeek');//moment().subtract(6, 'days');
        endDate = moment().endOf('month');//moment().subtract(0, 'days');
        $scope.$parent.SetUpDateRangeMultiDatePicker('reportrange', startDate, endDate, reportrange);
        $('#reportrange span').html(startDate.format($scope.$parent.Datelocaleformat.format) + ' - ' + endDate.format($scope.$parent.Datelocaleformat.format));
    });
    $(document).on("click", ".ranges ul li", function (event) {
        // reportrange(startDate, endDate)
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
    $scope.GET_CASHUP_LIST = function (FLAG) {

        var CashupModelObj = new Object();
        if (FLAG == 1) {
            $scope.CASHUPLIST = [];
            $scope.CashupSearch.PAGE_NO = 1;
        }
        CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
        CashupModelObj.CASHUP_DATE_START = $scope.CashupSearch.START_DATE == undefined ? moment().startOf('month').format($scope.$parent.Datelocaleformat.format) : $scope.CashupSearch.START_DATE;
        CashupModelObj.CASHUP_DATE_END = $scope.CashupSearch.END_DATE == undefined ? moment().endOf('month').format($scope.$parent.Datelocaleformat.format) : $scope.CashupSearch.END_DATE;
        CashupModelObj.STATUS_IDS = $scope.CashupSearch.STATUS_ID;
        CashupModelObj.BRANCH_IDS = $scope.CashupSearch.BRANCH_ID == null ? '' : $scope.CashupSearch.BRANCH_ID;
        CashupModelObj.PAGE_NO = $scope.CashupSearch.PAGE_NO;
        CashupModelObj.PAGE_SIZE = $scope.CashupSearch.PAGE_SIZE;
        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_CASHUP_LIST_FOR_APPROVER').then(function (data) {
            if (data.data.length > 0) {
                $scope.CASHUPLIST = $scope.CASHUPLIST.concat(data.data);
                if (data.data.length < $scope.CashupSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.CashupSearch.PAGE_NO = parseInt($scope.CashupSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else {
                $scope.GetData = false;
                //$scope.CASHUPLIST = [];
            }
        });
    };
    $scope.CashUpEntry = function (Cashup) {

        $scope.$parent.CashUp_Main_ID = Cashup.ID;
        $scope.$parent.CashUp_Main_STATUS_ID = Cashup.STATUS_ID;
        $scope.$parent.CashUp_Main_CASHUP_DATE = Cashup.CASHUP_DATE;
        $scope.$parent.CashUp_Main_BRANCH_ID = Cashup.BRANCH_ID;
        $scope.$parent.CashUp_Main_BRANCH_NAME = Cashup.BRANCH_NAME;
        $scope.$parent.CashUp_Main_BRANCH_CODE = Cashup.BRANCH_CODE;
        window.location.href = '../Cashup/CashupIndex#!/CEN?CMID=' + $scope.$parent.CashUp_Main_ID;
        // $location.path('CE');
    };


    //$scope.GET_BRANCH_LIST();
    var USER_ID = parseInt($cookies.get("USERID"));
    PrcCommMethods.GET_BRANCH_LIST(parseInt($cookies.get("ENTITY_ID")), USER_ID, 1).then(function (data) {
        $scope.BRANCH_LIST = data;
        if ($scope.BRANCH_LIST.length > 0) {
            $scope.CashupSearch.BRANCH_ID = $scope.BRANCH_LIST[0].BRANCH_ID;
            $scope.GET_CASHUP_LIST(1);
        }
    });

    $scope.LAZY_GET_CASHUP_LIST = function () {
        $scope.GET_CASHUP_LIST();
    };



    $scope.RESET_TO_DRAFT_CASHUP = function (CASHUP_MAIN_ID) {
        if (confirm('Are you sure you want to reset the cashup to draft?')) {
            var CashupModelObj = new Object();
            CashupModelObj.CASHUP_MAIN_ID = CASHUP_MAIN_ID;
            CashupModelObj.STATUS_ID = 1;
            CashupModelObj.NOTE = "";
            CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.CASHUP_API(CashupModelObj, 'APP_REJ_CASHUP').then(function (data) {
                $scope.GET_CASHUP_LIST(1);
            });
        }

    };
});
app.filter('total', function () {
    return function (input, property) {
        var total = 0;
        if (input != undefined) {
            var i = input.length;
            while (i--)
                total += (input[i][property]) * 1;
        }
        return total;
    }
});
app.controller('CashSubMasterControllerNew', function ($scope, $http, $interval, CommService, $cookies, $filter, PrcCommMethods, $location, readFileData, readFileDataNew, $sce) {

    $scope.$parent.CashUp_Main_ID = (getUrlParameter('CMID', $location.absUrl()) != undefined) || (getUrlParameter('CMID', $location.absUrl()) != null) || (getUrlParameter('CMID', $location.absUrl()) != 0) ? getUrlParameter('CMID', $location.absUrl()) : 0;
    $scope.CHID = 0; $scope.$parent.FG = null;
    $scope.CHID = getUrlParameter('CHID', $location.absUrl());
    $scope.$parent.FG = getUrlParameter('FG', $location.absUrl());
    if ($scope.$parent.FG == null && $scope.$parent.FG == undefined) {
        var x = "";
        var url = window.location.href.split('/')[5];
        var temp = url.split('?')[0];
        var x = temp.split('_')[1];
        if (x != "" && x != undefined && x.toUpperCase() == "VIEW") {
            $scope.$parent.FG = "VIEW";
        }
        //if (temp == "CEN") {
        //    $scope.$parent.FG = null;
        //} else {
        //    var x = temp.split('_')[1];
        //    if (x.toUpperCase() == "VIEW") {
        //        $scope.$parent.FG = "VIEW";
        //    } else {
        //        $scope.$parent.FG = null;
        //    }
        //}

        //if (url.split('?')[0] == 'CEN_VIEW') {
        //    $scope.$parent.FG = "VIEW";
        //}
        //else {
        //    $scope.$parent.FG = "EDIT";
        //}
    }
    $scope.CASHUP = {
        CASHUP_MAIN_ID: $scope.$parent.CashUp_Main_ID,
        FG: $scope.$parent.FG,
        ID: 0,
        ENTITY_ID: parseInt($cookies.get('ENTITY_ID')),
        BRANCH_ID: $scope.$parent.CashUp_Main_BRANCH_ID,
        BRANCH_NAME: $scope.$parent.CashUp_Main_BRANCH_NAME,
        BRANCH_CODE: $scope.$parent.CashUp_Main_BRANCH_CODE,
        AREA_ID: null,
        TILL_ID: null,
        PDQ_ID: null,
        SESSION_ID: null,
        IS_TILL_BASED: null,
        IS_SESSION_BASED: null,
        SESSION: null,
        TYPE: 1,
        CASHUP_DATE: $scope.$parent.CashUp_Main_CASHUP_DATE,// $scope.$parent.CashUp_Main_CASHUP_DATE,
        STEP_NO: 0,
        ACTUAL_STEP_NO: 0,
        TOTAL_FLOAT_EPOS: 0,
        TOTAL_FLOAT: 0,
        VARIANCE_FLOAT: 0,
        TOTAL_CASH_EPOS: 0,
        TOTAL_CASH: 0,
        VARIANCE_CASH: 0,
        TOTAL_CARD_EPOS: 0,
        TOTAL_CARD: 0,
        VARIANCE_CARD: 0,
        TOTAL_PETTY_CASH_EPOS: 0,
        TOTAL_PETTY_CASH: 0,
        VARIANCE_PETTY_CASH: 0,
        TOTAL_CHEQUE_EPOS: 0,
        TOTAL_CHEQUE: 0,
        VARIANCE_CHEQUE: 0,
        ACCOUNT_TOTAL_EPOS: 0,
        ACCOUNT_TOTAL: 0,
        ACCOUNT_RECEIVED_TOTAL: 0,
        VARIANCE_ACCOUNT: 0,
        ISSUE_TOTAL_EPOS: 0,
        ISSUE_TOTAL: 0,
        VARIANCE_ISSUE: 0,
        REDEEMED_TOTAL_EPOS: 0,
        REDEEMED_TOTAL: 0,
        VARIANCE_REDEEMED: 0,
        DEPOSIT_TOTAL_EPOS: 0,
        DEPOSIT_TOTAL: 0,
        VARIANCE_DEPOSIT: 0,
        DEPOSIT_REDEEMED_TOTAL_EPOS: 0,
        DEPOSIT_REDEEMED_TOTAL: 0,
        VARIANCE_DEPOSIT_REDEEMED: 0,
        VOID_TOTAL_EPOS: 0,
        VOID_TOTAL: 0,
        VARIANCE_VOID: 0,
        COMP_TOTAL_EPOS: 0,
        COMP_TOTAL: 0,
        VARIANCE_COMP: 0,
        ORIGINAL_FILE_NAME: null,
        UPL_ID: 0,
        COMP_NOTES: null,
        REV_NOTES: null,
        FLOAT_NOTES: null,
        CASH_NOTES: null,
        CARD_NOTES: null,
        PCASH_NOTES: null,
        COMP_NOTES_ID: 0,
        REV_NOTES_ID: 0,
        FLOAT_NOTES_ID: 0,
        CASH_NOTES_ID: 0,
        CARD_NOTES_ID: 0,
        PCASH_NOTES_ID: 0,
        COMPLETED_GROUP_ID: null,
        INTEGRATION_SYSTEM_ID: 0,
        PETTYCASHVALID: true,
        COMPLEMENTARYVALID: true,
        VOUCHERVALID: true,
        DEPOSITSVALID: true,
        INDEX: 0,
        KeyColor: "",
        REVENUE_CENTERS: [],
        SessionListData: null,
        EPOS_CAT_DATA: [],
        EPOS_DATA: [],
        MEDIA_DATA: null,
        EPOS_TOTAL: 0,
        EPOS_HEADER_DATA: [],
        COMP_REASONS: null,
        DECLERATION_MASTER: [],
        AreaList: null,
        TABLIST: null,
        CashUp_Main_STATUS_ID: 0,
        CompValid: false,
        BackValid: false,
        AutoValid_Void: [],
        AutoValid_Comp: [],
        PettyCashValid: false,
        AutoValid_Petty: [],
        AUTOVALID_VOUCHER: [],
        AUTOVALIDVOUCHER: false,
        AUTOVALID_DEPOSITE: [],
        AUTOVALIDDEPOSITE: false,
        TAB_CLICK: false,
        ACC_CUSTOMER_LIST: [],
        ACC_CUSTOMER_RED_LIST: [],
        ACCOUNT_CREDIT_VALID: true,
        BTNFlag: false,
        ALLOW_RESYNC: false,
        TOTAL_CASH_CONVERSION: 0,
        TOTAL_CASH_CURRENCYWISE: 0,
        TOTAL_CASH_BASE: 0,
        TOTAL_CASH_MAIN: 0,
        CASH_TIPS: null
    };

    $scope.CASHUP_RESET = function () {
        $scope.CASHUP = {
            CASHUP_MAIN_ID: $scope.$parent.CashUp_Main_ID,
            FG: $scope.$parent.FG,
            ID: 0,
            ENTITY_ID: parseInt($cookies.get('ENTITY_ID')),
            BRANCH_ID: $scope.$parent.CashUp_Main_BRANCH_ID,
            BRANCH_NAME: $scope.$parent.CashUp_Main_BRANCH_NAME,
            BRANCH_CODE: $scope.$parent.CashUp_Main_BRANCH_CODE,
            AREA_ID: null,
            TILL_ID: null,
            PDQ_ID: null,
            SESSION_ID: null,
            IS_TILL_BASED: null,
            IS_SESSION_BASED: null,
            SESSION: null,
            TYPE: 1,
            CASHUP_DATE: null,// $scope.$parent.CashUp_Main_CASHUP_DATE,
            STEP_NO: 0,
            ACTUAL_STEP_NO: 0,
            TOTAL_FLOAT_EPOS: 0,
            TOTAL_FLOAT: 0,
            VARIANCE_FLOAT: 0,
            TOTAL_CASH_EPOS: 0,
            TOTAL_CASH: 0,
            VARIANCE_CASH: 0,
            TOTAL_CARD_EPOS: 0,
            TOTAL_CARD: 0,
            VARIANCE_CARD: 0,
            TOTAL_PETTY_CASH_EPOS: 0,
            TOTAL_PETTY_CASH: 0,
            VARIANCE_PETTY_CASH: 0,
            TOTAL_CHEQUE_EPOS: 0,
            TOTAL_CHEQUE: 0,
            VARIANCE_CHEQUE: 0,
            ACCOUNT_TOTAL_EPOS: 0,
            ACCOUNT_TOTAL: 0,
            ACCOUNT_RECEIVED_TOTAL: 0,
            VARIANCE_ACCOUNT: 0,
            ISSUE_TOTAL_EPOS: 0,
            ISSUE_TOTAL: 0,
            VARIANCE_ISSUE: 0,
            REDEEMED_TOTAL_EPOS: 0,
            REDEEMED_TOTAL: 0,
            VARIANCE_REDEEMED: 0,
            DEPOSIT_TOTAL_EPOS: 0,
            DEPOSIT_TOTAL: 0,
            VARIANCE_DEPOSIT: 0,
            DEPOSIT_REDEEMED_TOTAL_EPOS: 0,
            DEPOSIT_REDEEMED_TOTAL: 0,
            VARIANCE_DEPOSIT_REDEEMED: 0,
            VOID_TOTAL_EPOS: 0,
            VOID_TOTAL: 0,
            VARIANCE_VOID: 0,
            COMP_TOTAL_EPOS: 0,
            COMP_TOTAL: 0,
            VARIANCE_COMP: 0,
            ORIGINAL_FILE_NAME: null,
            UPL_ID: 0,
            COMP_NOTES: null,
            REV_NOTES: null,
            FLOAT_NOTES: null,
            CASH_NOTES: null,
            CARD_NOTES: null,
            PCASH_NOTES: null,
            COMP_NOTES_ID: 0,
            REV_NOTES_ID: 0,
            FLOAT_NOTES_ID: 0,
            CASH_NOTES_ID: 0,
            CARD_NOTES_ID: 0,
            PCASH_NOTES_ID: 0,
            COMPLETED_GROUP_ID: null,
            INTEGRATION_SYSTEM_ID: 0,
            PETTYCASHVALID: true,
            COMPLEMENTARYVALID: true,
            VOUCHERVALID: true,
            DEPOSITSVALID: true,
            KeyColor: "",
            REVENUE_CENTERS: [],
            SessionListData: null,
            EPOS_CAT_DATA: [],
            EPOS_DATA: [],
            MEDIA_DATA: null,
            EPOS_TOTAL: 0,
            EPOS_HEADER_DATA: [],
            COMP_REASONS: null,
            DECLERATION_MASTER: [],
            AreaList: null,
            TABLIST: null,
            CashUp_Main_STATUS_ID: 0,
            CompValid: false,
            BackValid: false,
            AutoValid_Void: [],
            AutoValid_Comp: [],
            PettyCashValid: false,
            AutoValid_Petty: [],
            AUTOVALID_VOUCHER: [],
            AUTOVALIDVOUCHER: false,
            AUTOVALID_DEPOSITE: [],
            AUTOVALIDDEPOSITE: false,
            TAB_CLICK: false,
            ACC_CUSTOMER_LIST: [],
            ACC_CUSTOMER_RED_LIST: [],
            ACCOUNT_CREDIT_VALID: true,
            BTNFlag: false,
            ALLOW_RESYNC: false,
            TOTAL_CASH_CONVERSION: 0,
            TOTAL_CASH_CURRENCYWISE: 0,
            TOTAL_CASH_BASE: 0,
            TOTAL_CASH_MAIN: 0,
            CASH_TIPS: null
        };
    };

    $scope.ChangeLink = function (val) {

        if (val == "CashEntry") {
            $scope.CASHUP.KeyColor = val;
            $scope.CASHUP.STEP_NO = 1;
            if ($scope.$parent.FG == null) {
                $location.path("CEN").search({ CMID: $scope.$parent.CashUp_Main_ID });
            } else if ($scope.$parent.FG == "VIEW") {
                $location.path("CEN_VIEW").search({ CMID: $scope.$parent.CashUp_Main_ID });
            }
        } else if (val == "Float") {

            $scope.CASHUP.STEP_NO = 2;
            if ($scope.VALIDATE_STEPS()) {
                $scope.INS_UPD_REVENUE_CENTERS();
                $scope.InsertCashUpHeader_1();
            } else {
                alert("Please complete previous steps to proceed.");
            }
        }
        else if (val == "Cash") {

            $scope.CASHUP.STEP_NO = 3;
            if ($scope.CASHUP.ID != 0 && $scope.CASHUP.SESSION != null) {
                // $location.path("Cash").search({ CHID: $scope.CASHUP.ID, CMID: $scope.$parent.CashUp_Main_ID });
                if ($scope.$parent.FG == null) {
                    $location.path("Cash").search({ CHID: $scope.CASHUP.ID, CMID: $scope.$parent.CashUp_Main_ID });
                } else if ($scope.$parent.FG == "VIEW") {
                    $location.path("Cash_View").search({ CHID: $scope.CASHUP.ID, CMID: $scope.$parent.CashUp_Main_ID });
                }
                $scope.CASHUP.KeyColor = val;
            } else {
                alert("Please complete previous steps to proceed.");
            }
        }
        else if (val == "Cards") {
            $scope.CASHUP.STEP_NO = 4;
            if ($scope.CASHUP.ID != 0 && $scope.CASHUP.SESSION != null) {
                //$location.path("Cards").search({ CHID: $scope.CASHUP.ID, CMID: $scope.$parent.CashUp_Main_ID });
                if ($scope.$parent.FG == null) {
                    $location.path("Cards").search({ CHID: $scope.CASHUP.ID, CMID: $scope.$parent.CashUp_Main_ID });
                } else if ($scope.$parent.FG == "VIEW") {
                    $location.path("Cards_View").search({ CHID: $scope.CASHUP.ID, CMID: $scope.$parent.CashUp_Main_ID });
                }
                $scope.CASHUP.KeyColor = val;
            } else {
                alert("Please complete previous steps to proceed.");
            }
        }
        else if (val == "PtyCash") {
            $scope.CASHUP.STEP_NO = 5;
            if ($scope.CASHUP.ID != 0 && $scope.CASHUP.SESSION != null) {
                //  $location.path("PtyCash").search({ CHID: $scope.CASHUP.ID, CMID: $scope.$parent.CashUp_Main_ID });
                if ($scope.$parent.FG == null) {
                    $location.path("PtyCash").search({ CHID: $scope.CASHUP.ID, CMID: $scope.$parent.CashUp_Main_ID });
                } else if ($scope.$parent.FG == "VIEW") {
                    $location.path("PtyCash_View").search({ CHID: $scope.CASHUP.ID, CMID: $scope.$parent.CashUp_Main_ID });
                }
                $scope.CASHUP.KeyColor = val;
            } else {
                alert("Please complete previous steps to proceed.");
            }
        }
        else if (val == "Delivery") {
            $scope.CASHUP.STEP_NO = 6;
            if ($scope.CASHUP.ID != 0 && $scope.CASHUP.SESSION != null) {
                // $location.path("Delivery").search({ CHID: $scope.CASHUP.ID, CMID: $scope.$parent.CashUp_Main_ID });
                if ($scope.$parent.FG == null) {
                    $location.path("Delivery").search({ CHID: $scope.CASHUP.ID, CMID: $scope.$parent.CashUp_Main_ID });
                } else if ($scope.$parent.FG == "VIEW") {
                    $location.path("Delivery_View").search({ CHID: $scope.CASHUP.ID, CMID: $scope.$parent.CashUp_Main_ID });
                }
                $scope.CASHUP.KeyColor = val;
            } else {
                alert("Please complete previous steps to proceed.");
            }
        }
        else if (val == "AccountCustomer") {
            $scope.CASHUP.STEP_NO = 7;
            if ($scope.CASHUP.ID != 0 && $scope.CASHUP.SESSION != null) {
                // $location.path("AccountCustomer").search({ CHID: $scope.CASHUP.ID, CMID: $scope.$parent.CashUp_Main_ID });
                if ($scope.$parent.FG == null) {
                    $location.path("AccountCustomer").search({ CHID: $scope.CASHUP.ID, CMID: $scope.$parent.CashUp_Main_ID });
                } else if ($scope.$parent.FG == "VIEW") {
                    $location.path("AccountCustomer_View").search({ CHID: $scope.CASHUP.ID, CMID: $scope.$parent.CashUp_Main_ID });
                }
                $scope.CASHUP.KeyColor = val;
            } else {
                alert("Please complete previous steps to proceed.");
            }
        }
        else if (val == "Vouchers") {
            $scope.CASHUP.STEP_NO = 8;
            if ($scope.CASHUP.ID != 0 && $scope.CASHUP.SESSION != null) {
                //$location.path("Vouchers").search({ CHID: $scope.CASHUP.ID, CMID: $scope.$parent.CashUp_Main_ID });
                if ($scope.$parent.FG == null) {
                    $location.path("Vouchers").search({ CHID: $scope.CASHUP.ID, CMID: $scope.$parent.CashUp_Main_ID });
                } else if ($scope.$parent.FG == "VIEW") {
                    $location.path("Vouchers_View").search({ CHID: $scope.CASHUP.ID, CMID: $scope.$parent.CashUp_Main_ID });
                }
                $scope.CASHUP.KeyColor = val;
            } else {
                alert("Please complete previous steps to proceed.");
            }
        }
        else if (val == "Deposits") {
            $scope.CASHUP.STEP_NO = 9;
            if ($scope.CASHUP.ID != 0 && $scope.CASHUP.SESSION != null) {
                //$location.path("Deposits").search({ CHID: $scope.CASHUP.ID, CMID: $scope.$parent.CashUp_Main_ID });
                if ($scope.$parent.FG == null) {
                    $location.path("Deposits").search({ CHID: $scope.CASHUP.ID, CMID: $scope.$parent.CashUp_Main_ID });
                } else if ($scope.$parent.FG == "VIEW") {
                    $location.path("Deposits_View").search({ CHID: $scope.CASHUP.ID, CMID: $scope.$parent.CashUp_Main_ID });
                }
                $scope.CASHUP.KeyColor = val;
            } else {
                alert("Please complete previous steps to proceed.");
            }
        }
        else if (val == "Complimentary") {
            $scope.CASHUP.STEP_NO = 10;
            if ($scope.CASHUP.ID != 0 && $scope.CASHUP.SESSION != null) {
                //  $location.path("Complimentary").search({ CHID: $scope.CASHUP.ID, CMID: $scope.$parent.CashUp_Main_ID });
                if ($scope.$parent.FG == null) {
                    $location.path("Complimentary").search({ CHID: $scope.CASHUP.ID, CMID: $scope.$parent.CashUp_Main_ID });
                } else if ($scope.$parent.FG == "VIEW") {
                    $location.path("Complimentary_View").search({ CHID: $scope.CASHUP.ID, CMID: $scope.$parent.CashUp_Main_ID });
                }
                $scope.CASHUP.KeyColor = val;
            } else {
                alert("Please complete previous steps to proceed.");
            }
        }
        else if (val == "Review") {

            if ($scope.CASHUP.ID != 0 && $scope.CASHUP.SESSION != null) {
                //$location.path("Reviews").search({ CHID: $scope.CASHUP.ID, CMID: $scope.$parent.CashUp_Main_ID });
                if ($scope.$parent.FG == null) {
                    $location.path("Reviews").search({ CHID: $scope.CASHUP.ID, CMID: $scope.$parent.CashUp_Main_ID });
                } else if ($scope.$parent.FG == "VIEW") {
                    $location.path("Reviews_View").search({ CHID: $scope.CASHUP.ID, CMID: $scope.$parent.CashUp_Main_ID });
                }
                $scope.CASHUP.KeyColor = val;

            } else {
                alert("Please complete previous steps to proceed.");
            }

        }
    }

    $scope.ChangeLink_View = function (val) {

        if (val == "CashEntry") {
            $scope.CASHUP.KeyColor = val;
            $scope.CASHUP.STEP_NO = 1;
            $location.path("CEN_VIEW").search({ CMID: $scope.$parent.CashUp_Main_ID });
        } else if (val == "Float") {

            $scope.CASHUP.STEP_NO = 2;
            if ($scope.VALIDATE_STEPS()) {
                $scope.INS_UPD_REVENUE_CENTERS();
                $scope.InsertCashUpHeader_1();
            } else {
                alert("Please complete previous steps to proceed.");
            }
        }
        else if (val == "Cash") {

            $scope.CASHUP.STEP_NO = 3;
            if ($scope.CASHUP.ID != 0 && $scope.CASHUP.SESSION != null) {
                $location.path("Cash_View").search({ CHID: $scope.CASHUP.ID, CMID: $scope.$parent.CashUp_Main_ID });
                $scope.CASHUP.KeyColor = val;
            } else {
                alert("Please complete previous steps to proceed.");
            }
        }
        else if (val == "Cards") {
            $scope.CASHUP.STEP_NO = 4;
            if ($scope.CASHUP.ID != "" && $scope.CASHUP.SESSION != null) {
                $location.path("Cards_View").search({ CHID: $scope.CASHUP.ID, CMID: $scope.$parent.CashUp_Main_ID });
                $scope.CASHUP.KeyColor = val;
            } else {
                alert("Please complete previous steps to proceed.");
            }
        }
        else if (val == "PtyCash") {
            $scope.CASHUP.STEP_NO = 5;
            if ($scope.CASHUP.ID != 0 && $scope.CASHUP.SESSION != null) {
                $location.path("PtyCash_View").search({ CHID: $scope.CASHUP.ID, CMID: $scope.$parent.CashUp_Main_ID });
                $scope.CASHUP.KeyColor = val;
            } else {
                alert("Please complete previous steps to proceed.");
            }
        }
        else if (val == "Delivery") {
            $scope.CASHUP.STEP_NO = 6;
            if ($scope.CASHUP.ID != 0 && $scope.CASHUP.SESSION != null) {
                $location.path("Delivery_View").search({ CHID: $scope.CASHUP.ID, CMID: $scope.$parent.CashUp_Main_ID });
                $scope.CASHUP.KeyColor = val;
            } else {
                alert("Please complete previous steps to proceed.");
            }
        }
        else if (val == "AccountCustomer") {
            $scope.CASHUP.STEP_NO = 7;
            if ($scope.CASHUP.ID != 0 && $scope.CASHUP.SESSION != null) {
                $location.path("AccountCustomer_View").search({ CHID: $scope.CASHUP.ID, CMID: $scope.$parent.CashUp_Main_ID });
                $scope.CASHUP.KeyColor = val;
            } else {
                alert("Please complete previous steps to proceed.");
            }
        }
        else if (val == "Vouchers") {
            $scope.CASHUP.STEP_NO = 8;
            if ($scope.CASHUP.ID != 0 && $scope.CASHUP.SESSION != null) {
                $location.path("Vouchers_View").search({ CHID: $scope.CASHUP.ID, CMID: $scope.$parent.CashUp_Main_ID });
                $scope.CASHUP.KeyColor = val;
            } else {
                alert("Please complete previous steps to proceed.");
            }
        }
        else if (val == "Deposits") {
            $scope.CASHUP.STEP_NO = 9;
            if ($scope.CASHUP.ID != 0 && $scope.CASHUP.SESSION != null) {
                $location.path("Deposits_View").search({ CHID: $scope.CASHUP.ID, CMID: $scope.$parent.CashUp_Main_ID });
                $scope.CASHUP.KeyColor = val;
            } else {
                alert("Please complete previous steps to proceed.");
            }
        }
        else if (val == "Complimentary") {
            $scope.CASHUP.STEP_NO = 10;
            if ($scope.CASHUP.ID != 0 && $scope.CASHUP.SESSION != null) {
                $location.path("Complimentary_View").search({ CHID: $scope.CASHUP.ID, CMID: $scope.$parent.CashUp_Main_ID });
                $scope.CASHUP.KeyColor = val;
            } else {
                alert("Please complete previous steps to proceed.");
            }
        }
        else if (val == "Review") {

            if ($scope.CASHUP.ID != 0 && $scope.CASHUP.SESSION != null) {
                $location.path("Reviews_View").search({ CHID: $scope.CASHUP.ID, CMID: $scope.$parent.CashUp_Main_ID });
                $scope.CASHUP.KeyColor = val;

            } else {
                alert("Please complete previous steps to proceed.");
            }

        }
    }

    if ($scope.$parent.FG == null) {
        if ($scope.$parent.CashUp_Main_ID != 0 && $scope.CHID == undefined) {
            $scope.ChangeLink("CashEntry");
        } else if ($scope.$parent.CashUp_Main_ID != 0 && $scope.CHID != 0) {
            $location.path("CLN").search({});

        }
    } else if ($scope.$parent.FG == "VIEW") {
        if ($scope.$parent.CashUp_Main_ID != 0 && $scope.CHID == undefined) {
            $scope.ChangeLink_View("CashEntry");
        } else if ($scope.$parent.CashUp_Main_ID != 0 && $scope.CHID != 0) {
            $location.path("CLN").search({});

        }
    }


    $scope.Validation = {
        CashupEntry: {
            IS_VALID: true,
            Session_Valid: true
        }
    };
    $scope.VALIDATE_STEPS = function () {

        var IS_VALID = true;
        //if ($scope.CASHUP.SESSION == null || $scope.CASHUP.ID == 0) {
        if ($scope.CASHUP.SESSION == null) {
            IS_VALID = false;
            $scope.Validation.CashupEntry.Session_Valid = false;
        }
        $scope.Validation.CashupEntry.IS_VALID = IS_VALID;
        return IS_VALID;
    };
    $scope.INS_UPD_REVENUE_CENTERS = function () {
        var CashupModelObj = new Object();
        CashupModelObj.ID = $scope.CASHUP.ID;
        CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
        var REVENUE_DETAILS = [];
        var UNIQUE_SESSIONS = $filter('unique')($scope.CASHUP.REVENUE_CENTERS, 'SESSION_NAME');
        //angular.forEach(UNIQUE_SESSIONS, function (session) {
        angular.forEach($scope.CASHUP.REVENUE_CENTERS, function (rc) {
            var detailobj = new Object();
            detailobj.TABLE_ID = rc.TABLE_ID;
            detailobj.REVENUECENTER = rc.REVENUECENTER;
            detailobj.ROWINDEX = rc.ROWINDEX;
            detailobj.SESSION_ID = rc.SESSION_ID;
            detailobj.COVERS = rc.COVERS;
            detailobj.ACTIVE = 1;
            REVENUE_DETAILS.push(detailobj);
        });
        CashupModelObj.DECLARATION_DETAILS = REVENUE_DETAILS;
        PrcCommMethods.CASHUP_API(CashupModelObj, 'INS_UPD_REVENUE_CENTERS').then(function (data) {
            if ($scope.CASHUP.ID != 0) {
                $scope.GET_REVENUE_CENTERS();
            }
        });
    };
    $scope.GET_REVENUE_CENTERS = function () {
        var CashupModelObj = new Object();
        CashupModelObj.ID = $scope.CASHUP.ID;
        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_REVENUE_CENTERS').then(function (data) {

            if (data != undefined && data.data != undefined) {
                // $scope.CASHUP.REVENUE_CENTERS = [];
                $scope.CASHUP.REVENUE_CENTERS = data.data.Table;
            }
        });
    };
    $scope.InsertCashUpHeader_1 = function () {

        $scope.CASHUP.KeyColor = "Float";
        var CashupModelObj = new Object();
        CashupModelObj.ID = $scope.CASHUP.ID;
        CashupModelObj.CASHUP_MAIN_ID = $scope.CASHUP.CASHUP_MAIN_ID;
        CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CashupModelObj.BRANCH_ID = $scope.CASHUP.BRANCH_ID;
        CashupModelObj.TILL_ID = $scope.CASHUP.TYPE == 1 ? $scope.CASHUP.TILL_ID : null;
        CashupModelObj.SESSION_ID = $scope.CASHUP.TYPE == 2 ? $scope.CASHUP.SESSION_ID : null;
        CashupModelObj.AREA_ID = $scope.CASHUP.AREA_ID;
        CashupModelObj.CASHUP_DATE = $scope.CASHUP.CASHUP_DATE;
        CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
        CashupModelObj.TYPE = $scope.CASHUP.TYPE;
        CashupModelObj.STEP_NO = 0;
        PrcCommMethods.CASHUP_API(CashupModelObj, 'INS_CASHUP_HEADER').then(function (data) {
            $scope.CASHUP.ID = data.data;

            if ($scope.$parent.FG == null) {
                $location.path("Float").search({ CHID: $scope.CASHUP.ID, CMID: $scope.$parent.CashUp_Main_ID });
            } else if ($scope.$parent.FG == "VIEW") {
                $location.path("Float_View").search({ CHID: $scope.CASHUP.ID, CMID: $scope.$parent.CashUp_Main_ID });
            }
        });
    };
    $scope.DateSetUp = function () {
        var date_inputs = document.getElementsByName("datecontrol_m") //our date input has the name "date"

        if (date_inputs.length > 0) {
            for (var i = 0; i < date_inputs.length; i++) {
                var date_input = $('input[name="' + date_inputs[i].name + '"]'); //our date input has the name "date"
                var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
                var date = new Date();
                var options = {
                    todayBtn: "linked",
                    daysOfWeekHighlighted: "0,6",
                    autoclose: true,
                    todayHighlight: true,
                    format: 'M dd, yyyy'
                    //  startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate())
                };
                date_input.datepicker(options);
            }
        };
    };

});
app.controller('CashEntryControllerNew', function ($scope, $http, $interval, CommService, $cookies, $filter, PrcCommMethods, $location, readFileData, readFileDataNew, $sce) {
    $scope.$parent.CashUp_Main_ID = getUrlParameter('CMID', $location.absUrl());
    //alert(1);
    $scope.$parent.CASHUP.FG = null;
    //$scope.CHID = getUrlParameter('CHID', $location.absUrl());
    $scope.$parent.CASHUP.FG = getUrlParameter('FG', $location.absUrl());

    if ($scope.$parent.CASHUP.FG == null && $scope.$parent.CASHUP.FG == undefined) {
        var x = "";
        var url = window.location.href.split('/')[5];
        var temp = url.split('?')[0];
        var x = temp.split('_')[1];
        if (x != "" && x != undefined && x.toUpperCase() == "VIEW") {
            $scope.$parent.CASHUP.FG = "VIEW";
        }
        //var url = window.location.href.split('/')[5];
        //if (url.split('?')[0] == 'CEN_VIEW') {
        //    $scope.$parent.CASHUP.FG = "VIEW";
        //}
    }
    if ($scope.$parent.CASHUP.ACTUAL_STEP_NO <= 1) {
        $scope.$parent.CASHUP.ACTUAL_STEP_NO = 1;
    }
    $scope.KeyFlag = false;
    if ($scope.CASHUP.KeyColor == "Float") {
        $scope.KeyFlag = false;
    } else if ($scope.CASHUP.KeyColor != "CashEntry") {
        $scope.KeyFlag = true;
    }
    $scope.CASHUP.KeyColor = "CashEntry";

    $scope.MENU_CLICK(6, 'CLN')
    $scope.GET_MASTERDATA_FOR_CASHUP = function () {
        var CashupModelObj = new Object();
        CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CashupModelObj.CURRENCY_ID = parseInt($cookies.get("CURRENCY_ID"));
        CashupModelObj.ID = $scope.$parent.CASHUP.ID;
        CashupModelObj.CASHUP_MAIN_ID = $scope.$parent.CASHUP.CASHUP_MAIN_ID;
        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_MASTERDATA_FOR_CASHUP').then(function (data) {

            $scope.BranchList = data.data.Table;
            $scope.$parent.CASHUP.AreaList = data.data.Table1;
            if ($scope.$parent.CASHUP.AreaList.length > 0) {
                $scope.$parent.CASHUP.AREA_ID = $scope.$parent.CASHUP.AreaList[0].ID;
                $scope.$parent.CASHUP.CashUp_Main_STATUS_ID = $scope.$parent.CASHUP.AreaList[0].STATUS != null ? $scope.$parent.CASHUP.AreaList[0].STATUS : 0;
            }
            if ($scope.$parent.CASHUP.CashUp_Main_STATUS_ID == 4 || $scope.$parent.CASHUP.CashUp_Main_STATUS_ID == 5) {
                $scope.$parent.CASHUP.REV_NOTES = $scope.$parent.CASHUP.AreaList[0].REJECTION_COMMENTS != null ? $scope.$parent.CASHUP.AreaList[0].REJECTION_COMMENTS : null;
            }
            $scope.TillList = data.data.Table2;

            //$scope.$parent.CASHUP.ALLOW_RESYNC = data.data.Table3[0].ALLOW_RESYNC;
            var SessionChk_ID = 0; $scope.SessionList = [];
            angular.forEach(data.data.Table3, function (Sess_Chk) {
                if (Sess_Chk.SESSION_MAPPING_ID != SessionChk_ID) {
                    $scope.SessionList.push(Sess_Chk);
                }
                SessionChk_ID = Sess_Chk.SESSION_MAPPING_ID;
            })
            //$scope.SessionList = data.data.Table3;
            //$filter('orderBy')($scope.SessionList, 'SESSION_MAPPING_ID');


            for (var i = 0; i < $scope.$parent.CASHUP.AreaList.length; i++) {
                for (var j = 0; j < $scope.BranchList.length; j++) {
                    if ($scope.$parent.CASHUP.AreaList[i].BRANCH_ID == $scope.BranchList[j].ID) {
                        $scope.$parent.CASHUP.BRANCH_ID = $scope.BranchList[j].ID;
                        $scope.$parent.CASHUP.BRANCH_NAME = $scope.BranchList[j].NAME;
                        $scope.$parent.CASHUP.BRANCH_CODE = $scope.BranchList[j].CODE;
                        break;
                    }
                }
            }

            $scope.$parent.CASHUP.CASHUP_DATE = $scope.$parent.CASHUP.CASHUP_DATE;// $scope.SessionList[0].CASHUP_DATE;

            angular.forEach($scope.SessionList, function (sessn) {
                if (sessn.STATUS_ID == 2 && sessn.SESSION_MASTER_ID == '4') {
                    $scope.$parent.CASHUP.COMPLETED_GROUP_ID = sessn.GROUP_ID;

                }
                //else if (sessn.STATUS_ID == 0 && sessn.SESSION_MASTER_ID == '4' && parseInt($cookies.get("ENTITY_ID"))==62 && ($scope.$parent.CASHUP.CashUp_Main_STATUS_ID == 3 || $scope.$parent.CASHUP.CashUp_Main_STATUS_ID == 4)) {
                //    $scope.$parent.CASHUP.COMPLETED_GROUP_ID = sessn.GROUP_ID;
                //    sessn.STATUS_ID = 2;
                //    sessn.STEP_NO = 10;
                //}
            });

            $scope.SessionList.filter(function (x) {
                x.RDO_FLAG = false;
            });
            //$scope.$parent.CASHUP.SessionListData = $scope.SessionList;//data.data.Table3;
            $scope.$parent.CASHUP.DECLERATION_MASTER = data.data.Table4;
            $scope.$parent.CASHUP.TABLIST = data.data.Table6;
            $scope.$parent.CASHUP.IS_TILL_BASED = data.data.Table5[0].IS_TILL_BASED;
            $scope.$parent.CASHUP.IS_SESSION_BASED = data.data.Table5[0].IS_SESSION_BASED;
            $scope.$parent.CASHUP.IS_TILL_BASED ? $scope.$parent.CASHUP.TYPE = 1 : '';
            $scope.$parent.CASHUP.IS_SESSION_BASED ? $scope.$parent.CASHUP.TYPE = 2 : '';
            $scope.$parent.CASHUP.IS_TILL_BASED && $scope.$parent.CASHUP.IS_SESSION_BASED ? $scope.$parent.CASHUP.TYPE = null : '';
            $scope.DateSetUp();
            //$scope.SessionListFilter = null;
            if ($scope.$parent.CASHUP.CashUp_Main_STATUS_ID == 3 || $scope.$parent.CASHUP.CashUp_Main_STATUS_ID == 4) {

                if ($scope.$parent.CASHUP.SESSION != null) {

                    angular.forEach($scope.SessionList, function (sess) {
                        if ($scope.$parent.CASHUP.SESSION.SESSION_MAPPING_ID == sess.SESSION_MAPPING_ID) {
                            sess.SELECTED = true;
                            // sess.GROUP_ID = 1;
                            $scope.$parent.CASHUP.SESSION = sess;
                            $scope.InsertCashUpHeader_12();
                            $scope.$parent.CASHUP.SESSION.SESSION_ID = sess.SESSION_MAPPING_ID;
                            $scope.GET_CASHUP_BY_ID1();
                            $scope.$parent.CASHUP.COMP_NOTES = null;
                            $scope.$parent.CASHUP.REV_NOTES = null;
                            $scope.$parent.CASHUP.FLOAT_NOTES = null;
                            $scope.$parent.CASHUP.CASH_NOTES = null;
                            $scope.$parent.CASHUP.CARD_NOTES = null;
                            $scope.$parent.CASHUP.PCASH_NOTES = null;
                            //$scope.$parent.CASHUP.INDEX = index;
                            if (sess.SESSION_MASTER_ID == '4' && sess.STATUS_ID == '2') {
                                sess.GROUP_ID = 1;
                            }
                        } else {
                            sess.SELECTED = false;
                            // sess.GROUP_ID = 0;
                        }
                    });
                } else {
                    $scope.SessionListFilter = null;
                    if ($scope.$parent.CASHUP.COMPLETED_GROUP_ID != null) {
                        $scope.SessionListFilter = $filter('filter')($scope.SessionList, { GROUP_ID: $scope.$parent.CASHUP.COMPLETED_GROUP_ID }, true);
                    } else {
                        $scope.SessionListFilter = $filter('filter')($scope.SessionList, { GROUP_ID: 0 }, true);
                    }

                    if ($scope.SessionListFilter != null) {
                        angular.forEach($scope.SessionList, function (sess) {
                            if ($scope.SessionListFilter[0].GROUP_ID == sess.GROUP_ID) {
                                sess.SELECTED = true;
                                $scope.$parent.CASHUP.SESSION = sess;
                                // $scope.SELECT_SESSION_Init(sess, 0);
                                //$scope.InsertCashUpHeader_12();
                                $scope.$parent.CASHUP.SESSION_ID = sess.SESSION_MAPPING_ID;
                                $scope.GET_CASHUP_BY_ID();
                            } else {
                                sess.SELECTED = false;
                                sess.GROUP_ID = 0;
                            }
                        });
                    }
                }
                $scope.$parent.CASHUP.INDEX = 0;
                angular.forEach($scope.SessionList, function (sess) {
                    if (sess.STATUS_ID == '2') {
                        sess.RDO_FLAG = false;
                    } else if (sess.STATUS_ID == '1' || sess.STATUS_ID == '0') {
                        sess.RDO_FLAG = true;
                    }
                })

            } else {

                if ($scope.$parent.CASHUP.SESSION != null) {
                    angular.forEach($scope.SessionList, function (sess, index) {
                        if ($scope.$parent.CASHUP.SESSION.SESSION_MAPPING_ID == sess.SESSION_MAPPING_ID) {
                            sess.SELECTED = true;
                            // sess.GROUP_ID = 1;
                            $scope.$parent.CASHUP.SESSION = sess;
                            $scope.InsertCashUpHeader_12();
                            $scope.$parent.CASHUP.SESSION.SESSION_ID = sess.SESSION_MAPPING_ID;
                            $scope.GET_CASHUP_BY_ID1();
                            $scope.$parent.CASHUP.COMP_NOTES = null;
                            $scope.$parent.CASHUP.REV_NOTES = null;
                            $scope.$parent.CASHUP.FLOAT_NOTES = null;
                            $scope.$parent.CASHUP.CASH_NOTES = null;
                            $scope.$parent.CASHUP.CARD_NOTES = null;
                            $scope.$parent.CASHUP.PCASH_NOTES = null;
                            $scope.$parent.CASHUP.INDEX = index;
                            if (sess.SESSION_MASTER_ID == '4' && sess.STATUS_ID == '2') {
                                sess.GROUP_ID = 1;
                            }
                            //sess.RDO_FLAG = false;

                        }
                        else {
                            sess.SELECTED = false;
                            // sess.GROUP_ID = 0;
                            //sess.RDO_FLAG = true;
                        }
                    });
                    //angular.forEach($scope.SessionList, function (sess) {
                    //    if (sess.GROUP_ID == 0 && $scope.$parent.CASHUP.COMPLETED_GROUP_ID == null) {
                    //        sess.RDO_FLAG = true;
                    //    } else if (sess.GROUP_ID == 1 && $scope.$parent.CASHUP.COMPLETED_GROUP_ID == 1) {
                    //        sess.RDO_FLAG = true;
                    //    }
                    //})
                    var FlagValid = false;
                    $scope.SessionList.filter(function (x) {
                        if (x.STATUS_ID == '2') {
                            FlagValid = true;
                        }
                    });
                    if (FlagValid) {
                        $scope.SessionListFilter1 = null;
                        if ($scope.$parent.CASHUP.COMPLETED_GROUP_ID == null) {
                            $scope.SessionListFilter1 = $filter('filter')($scope.SessionList, { GROUP_ID: 0 }, true);

                            angular.forEach($scope.SessionList, function (SL) {
                                angular.forEach($scope.SessionListFilter1, function (SF) {
                                    if (SF.GROUP_ID != SL.GROUP_ID) {
                                        SL.RDO_FLAG = true;
                                    }
                                })
                            })
                        }
                    }

                }
                else {
                    var Flag1 = false;
                    $scope.SessionList.filter(function (x) {
                        if (x.STATUS_ID == '2') {
                            Flag1 = true;
                        }
                    });
                    if (Flag1) {
                        $scope.SessionListFilter2 = null;
                        if ($scope.$parent.CASHUP.COMPLETED_GROUP_ID == null) {
                            $scope.SessionListFilter2 = $filter('filter')($scope.SessionList, { GROUP_ID: 0 }, true);

                            angular.forEach($scope.SessionList, function (SL) {
                                angular.forEach($scope.SessionListFilter2, function (SF) {
                                    if (SF.GROUP_ID != SL.GROUP_ID) {
                                        SL.RDO_FLAG = true;
                                    }
                                })
                            })
                        }
                    }
                    //angular.forEach($scope.SessionList, function (sess) {
                    //    if (sess.STATUS_ID == '2') {
                    //        sess.RDO_FLAG = true;
                    //    } else if (sess.STATUS_ID == '1' || sess.STATUS_ID == '0') {
                    //        sess.RDO_FLAG = false;
                    //    }
                    //})
                    //    $scope.SessionList.filter(function (x) {
                    //        if (x.SESSION_MASTER_ID != '4' && x.STATUS_ID == '2') {
                    //            x.RDO_FLAG = false;
                    //        } else if (x.SESSION_MASTER_ID == '4' && (x.STATUS_ID == '0' || x.STATUS_ID == '1')) {
                    //            x.RDO_FLAG = true;
                    //        } else {
                    //            x.RDO_FLAG = false;
                    //        }
                    //});
                }

            }
            $scope.$parent.CASHUP.SessionListData = $scope.SessionList;//data.data.Table3;
            $scope.$parent.CASHUP.COMP_REASONS = data.data.Table7;
        });
    };

    $scope.DateSetUp = function () {
        var date_inputs = document.getElementsByName("datecontrol_m") //our date input has the name "date"
        if (date_inputs.length > 0) {
            for (var i = 0; i < date_inputs.length; i++) {

                var date_input = $('input[name="' + date_inputs[i].name + '"]'); //our date input has the name "date"
                var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
                var date = new Date();
                var options = {
                    todayBtn: "linked",
                    daysOfWeekHighlighted: "0,6",
                    autoclose: true,
                    todayHighlight: true,
                    format: 'M dd, yyyy'
                    //  startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate())
                };
                date_input.datepicker(options);
            }
        };
    };
    $scope.GET_MASTERDATA_FOR_CASHUP();
    $scope.SELECT_SESSION = function (SESSION, index) {

        if (SESSION.RDO_FLAG == false) {
            angular.forEach($scope.SessionList, function (sess) {
                sess.SELECTED = false;
                document.getElementById("SessionRadio" + sess.SESSION_MAPPING_ID).checked = false;
            });
            angular.forEach($scope.$parent.CASHUP.SessionListData, function (sess) {
                sess.SELECTED = false;
                document.getElementById("SessionRadio" + sess.SESSION_MAPPING_ID).checked = false;
            });

            $scope.$parent.overlay_loading_coffee = 'block';
            document.getElementById("SessionRadio" + SESSION.SESSION_MAPPING_ID).checked = true;
            $scope.$parent.CASHUP.SESSION = SESSION;
            // $scope.$parent.CASHUP.SESSION.SESSION_NAME = $scope.$parent.CASHUP.SESSION.SESSION_NAME; 
            SESSION.SELECTED = true;
            $scope.$parent.CASHUP.SESSION_ID = $scope.$parent.CASHUP.SESSION.SESSION_MAPPING_ID;
            //  $scope.$parent.CASHUP.SESSION_NAME = SESSION.SESSION_NAME;
            //$scope.ReviewTab(index);
            $scope.GET_CASHUP_BY_ID();
            $scope.$parent.CASHUP.COMP_NOTES = null;
            $scope.$parent.CASHUP.REV_NOTES = null;
            $scope.$parent.CASHUP.FLOAT_NOTES = null;
            $scope.$parent.CASHUP.CASH_NOTES = null;
            $scope.$parent.CASHUP.CARD_NOTES = null;
            $scope.$parent.CASHUP.PCASH_NOTES = null;
            $scope.$parent.CASHUP.ACC_CUSTOMER_RED_LIST = null;
            //$scope.$parent.CASHUP.ACCOUNT_RECEIVED_TOTAL = 0;
            $scope.$parent.CASHUP.INDEX = index;
        } else {
            alert("Any one session can be submitted, 'ALL' or 'Lunch & Dinner'");
        }

    }
    $scope.SELECT_SESSION_Init = function (SESSION, index) {

        $scope.$parent.overlay_loading_coffee = 'block';
        $scope.$parent.CASHUP.SESSION = SESSION;
        SESSION.SELECTED = true;
        $scope.$parent.CASHUP.SESSION_ID = $scope.$parent.CASHUP.SESSION.SESSION_MAPPING_ID;

        $scope.GET_CASHUP_BY_ID();
        $scope.$parent.CASHUP.COMP_NOTES = null;
        $scope.$parent.CASHUP.REV_NOTES = null;
        $scope.$parent.CASHUP.FLOAT_NOTES = null;
        $scope.$parent.CASHUP.CASH_NOTES = null;
        $scope.$parent.CASHUP.CARD_NOTES = null;
        $scope.$parent.CASHUP.PCASH_NOTES = null;
        $scope.$parent.CASHUP.ACC_CUSTOMER_RED_LIST = null;
        // $scope.$parent.CASHUP.ACCOUNT_RECEIVED_TOTAL = 0;
        $scope.$parent.CASHUP.INDEX = index;
    }
    $scope.NextLink = function (val) {

        $scope.KeyColor = val;
        $scope.INS_UPD_REVENUE_CENTERS();
        $scope.VALIDATE_STEPS() ? $scope.InsertCashUpHeader_1() : '';

    }
    $scope.NextLink_View = function (val) {

        $scope.KeyColor = val;
        $scope.INS_UPD_REVENUE_CENTERS();
        $scope.VALIDATE_STEPS() ? $scope.InsertCashUpHeader_View() : '';

    }
    $scope.InsertCashUpHeader_View = function () {

        var CashupModelObj = new Object();
        CashupModelObj.ID = $scope.$parent.CASHUP.ID;
        CashupModelObj.CASHUP_MAIN_ID = $scope.$parent.CASHUP.CASHUP_MAIN_ID;
        CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CashupModelObj.BRANCH_ID = $scope.$parent.CASHUP.BRANCH_ID;
        CashupModelObj.TILL_ID = $scope.$parent.CASHUP.TYPE == 1 ? $scope.$parent.CASHUP.TILL_ID : null;
        CashupModelObj.SESSION_ID = $scope.$parent.CASHUP.TYPE == 2 ? $scope.$parent.CASHUP.SESSION_ID : null;
        CashupModelObj.AREA_ID = $scope.$parent.CASHUP.AREA_ID;
        CashupModelObj.CASHUP_DATE = $scope.$parent.CASHUP.CASHUP_DATE;
        CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
        CashupModelObj.TYPE = $scope.$parent.CASHUP.TYPE;
        CashupModelObj.STEP_NO = 0;

        PrcCommMethods.CASHUP_API(CashupModelObj, 'INS_CASHUP_HEADER').then(function (data) {

            $scope.$parent.CASHUP.ID = data.data;
            //$scope.$parent.CASHUP.ACTUAL_STEP_NO = 1;
            if ($scope.$parent.CASHUP.TABLIST[1].FLAG == 1) {
                $location.path("Float_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
            } else if ($scope.$parent.CASHUP.TABLIST[2].FLAG == 1) {
                $location.path("Cash_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
            } else if ($scope.$parent.CASHUP.TABLIST[3].FLAG == 1) {
                $location.path("Cards_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
            } else if ($scope.$parent.CASHUP.TABLIST[4].FLAG == 1) {
                $location.path("PtyCash_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
            } else if ($scope.$parent.CASHUP.TABLIST[5].FLAG == 1) {
                $location.path("Delivery_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
            } else if ($scope.$parent.CASHUP.TABLIST[6].FLAG == 1) {
                $location.path("AccountCustomer_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
            } else if ($scope.$parent.CASHUP.TABLIST[7].FLAG == 1) {
                $location.path("Vouchers_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
            } else if ($scope.$parent.CASHUP.TABLIST[8].FLAG == 1) {
                $location.path("Deposits_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
            } else if ($scope.$parent.CASHUP.TABLIST[9].FLAG == 1) {
                $location.path("Complimentary_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
            }
        });
    };
    $scope.GOTOSTEP = function (STEP_NO) {

        // $scope.$parent.CASHUP.STEP_NO > 1 ? $scope.GET_EPOS_HEADER() : '';
        switch (STEP_NO) {
            case 0:
                $scope.CASHUP.KeyColor = "CashEntry";
                break;
            case 1:
                if ($scope.$parent.CASHUP.TABLIST[1].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Float";
                    $location.path("Float").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[2].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Cash";
                    $location.path("Cash").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[3].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Cards";
                    $location.path("Cards").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[4].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "PtyCash";
                    $location.path("PtyCash").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[5].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Delivery";
                    $location.path("Delivery").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[6].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "AccountCustomer";
                    $location.path("AccountCustomer").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[7].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Vouchers";
                    $location.path("Vouchers").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[8].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Deposits";
                    $location.path("Deposits").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[9].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Complimentary";
                    $location.path("Complimentary").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                }
                break;
            case 2:
                if ($scope.$parent.CASHUP.TABLIST[2].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Cash";
                    $location.path("Cash").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[3].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Cards";
                    $location.path("Cards").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[4].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "PtyCash";
                    $location.path("PtyCash").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[5].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Delivery";
                    $location.path("Delivery").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[6].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "AccountCustomer";
                    $location.path("AccountCustomer").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[7].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Vouchers";
                    $location.path("Vouchers").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[8].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Deposits";
                    $location.path("Deposits").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[9].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Complimentary";
                    $location.path("Complimentary").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                }
                break;
            case 3:
                if ($scope.$parent.CASHUP.TABLIST[3].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Cards";
                    $location.path("Cards").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[4].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "PtyCash";
                    $location.path("PtyCash").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[5].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Delivery";
                    $location.path("Delivery").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[6].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "AccountCustomer";
                    $location.path("AccountCustomer").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[7].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Vouchers";
                    $location.path("Vouchers").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[8].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Deposits";
                    $location.path("Deposits").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[9].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Complimentary";
                    $location.path("Complimentary").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                }
                break;
            case 4:
                if ($scope.$parent.CASHUP.TABLIST[4].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "PtyCash";
                    $location.path("PtyCash").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[5].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Delivery";
                    $location.path("Delivery").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[6].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "AccountCustomer";
                    $location.path("AccountCustomer").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[7].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Vouchers";
                    $location.path("Vouchers").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[8].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Deposits";
                    $location.path("Deposits").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[9].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Complimentary";
                    $location.path("Complimentary").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                }
                break;
            case 5:
                if ($scope.$parent.CASHUP.TABLIST[5].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Delivery";
                    $location.path("Delivery").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[6].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "AccountCustomer";
                    $location.path("AccountCustomer").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[7].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Vouchers";
                    $location.path("Vouchers").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[8].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Deposits";
                    $location.path("Deposits").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[9].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Complimentary";
                    $location.path("Complimentary").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                }
                break;
            case 6:
                if ($scope.$parent.CASHUP.TABLIST[6].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "AccountCustomer";
                    $location.path("AccountCustomer").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[7].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Vouchers";
                    $location.path("Vouchers").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[8].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Deposits";
                    $location.path("Deposits").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[9].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Complimentary";
                    $location.path("Complimentary").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                }
                break;
            case 7:
                if ($scope.$parent.CASHUP.TABLIST[7].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Vouchers";
                    $location.path("Vouchers").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[8].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Deposits";
                    $location.path("Deposits").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[9].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Complimentary";
                    $location.path("Complimentary").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                }
                break;
            case 8:
                if ($scope.$parent.CASHUP.TABLIST[8].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Deposits";
                    $location.path("Deposits").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[9].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Complimentary";
                    $location.path("Complimentary").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                }
                break;
            case 9:
                if ($scope.$parent.CASHUP.TABLIST[9].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Complimentary";
                    $location.path("Complimentary").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else {
                    $scope.CASHUP.KeyColor = "Review";
                    $location.path("Reviews").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                }
                break;
            case 10:
                $scope.CASHUP.KeyColor = "Review";
                $location.path("Reviews").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                break;
            default:
                break;

        }
    };
    $scope.GOTOSTEP_View = function (STEP_NO) {

        // $scope.$parent.CASHUP.STEP_NO > 1 ? $scope.GET_EPOS_HEADER() : '';
        switch (STEP_NO) {
            case 0:
                $scope.CASHUP.KeyColor = "CashEntry";
                break;
            case 1:
                if ($scope.$parent.CASHUP.TABLIST[1].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Float";
                    $location.path("Float_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[2].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Cash";
                    $location.path("Cash_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[3].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Cards";
                    $location.path("Cards_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[4].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "PtyCash";
                    $location.path("PtyCash_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[5].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Delivery";
                    $location.path("Delivery_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[6].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "AccountCustomer";
                    $location.path("AccountCustomer_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[7].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Vouchers";
                    $location.path("Vouchers_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[8].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Deposits";
                    $location.path("Deposits_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[9].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Complimentary";
                    $location.path("Complimentary_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                }
                break;
            case 2:
                if ($scope.$parent.CASHUP.TABLIST[2].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Cash";
                    $location.path("Cash_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[3].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Cards";
                    $location.path("Cards_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[4].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "PtyCash";
                    $location.path("PtyCash_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[5].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Delivery";
                    $location.path("Delivery_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[6].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "AccountCustomer";
                    $location.path("AccountCustomer_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[7].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Vouchers";
                    $location.path("Vouchers_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[8].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Deposits";
                    $location.path("Deposits_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[9].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Complimentary";
                    $location.path("Complimentary_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                }
                break;
            case 3:
                if ($scope.$parent.CASHUP.TABLIST[3].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Cards";
                    $location.path("Cards_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[4].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "PtyCash";
                    $location.path("PtyCash_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[5].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Delivery";
                    $location.path("Delivery_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[6].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "AccountCustomer";
                    $location.path("AccountCustomer_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[7].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Vouchers";
                    $location.path("Vouchers_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[8].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Deposits";
                    $location.path("Deposits_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[9].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Complimentary";
                    $location.path("Complimentary_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                }
                break;
            case 4:
                if ($scope.$parent.CASHUP.TABLIST[4].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "PtyCash";
                    $location.path("PtyCash_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[5].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Delivery";
                    $location.path("Delivery_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[6].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "AccountCustomer";
                    $location.path("AccountCustomer_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[7].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Vouchers";
                    $location.path("Vouchers_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[8].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Deposits";
                    $location.path("Deposits_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[9].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Complimentary";
                    $location.path("Complimentary_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                }
                break;
            case 5:
                if ($scope.$parent.CASHUP.TABLIST[5].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Delivery";
                    $location.path("Delivery_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[6].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "AccountCustomer";
                    $location.path("AccountCustomer_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[7].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Vouchers";
                    $location.path("Vouchers_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[8].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Deposits";
                    $location.path("Deposits_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[9].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Complimentary";
                    $location.path("Complimentary_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                }
                break;
            case 6:
                if ($scope.$parent.CASHUP.TABLIST[6].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "AccountCustomer";
                    $location.path("AccountCustomer_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[7].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Vouchers";
                    $location.path("Vouchers_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[8].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Deposits";
                    $location.path("Deposits_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[9].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Complimentary";
                    $location.path("Complimentary_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                }
                break;
            case 7:
                if ($scope.$parent.CASHUP.TABLIST[7].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Vouchers";
                    $location.path("Vouchers_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[8].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Deposits";
                    $location.path("Deposits_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[9].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Complimentary";
                    $location.path("Complimentary_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                }
                break;
            case 8:
                if ($scope.$parent.CASHUP.TABLIST[8].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Deposits";
                    $location.path("Deposits_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else if ($scope.$parent.CASHUP.TABLIST[9].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Complimentary";
                    $location.path("Complimentary_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                }
                break;
            case 9:
                if ($scope.$parent.CASHUP.TABLIST[9].FLAG == 1) {
                    $scope.CASHUP.KeyColor = "Complimentary";
                    $location.path("Complimentary_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                } else {
                    $scope.CASHUP.KeyColor = "Review";
                    $location.path("Reviews_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                }
                break;
            case 10:
                $scope.CASHUP.KeyColor = "Review";
                $location.path("Reviews_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                break;
            default:
                break;

        }
    };
    $scope.Validation = {
        CashupEntry: {
            IS_VALID: true,
            Session_Valid: true
        }
    };
    $scope.VALIDATE_STEPS = function () {

        var IS_VALID = true;
        if ($scope.$parent.CASHUP.SESSION == null) {
            IS_VALID = false;
            $scope.Validation.CashupEntry.Session_Valid = false;
        }
        $scope.Validation.CashupEntry.IS_VALID = IS_VALID;
        return IS_VALID;
    };


    $scope.DOWNLOAD_TEMPLATE_Fn = function () {
        var CashupModelObj = new Object();
        CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
        CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CashupModelObj.CASHUP_HEADER_ID = $scope.$parent.CASHUP.ID;
        CashupModelObj.INTEGRATION_SYSTEM_ID = $scope.$parent.CASHUP.INTEGRATION_SYSTEM_ID;
        CashupModelObj.SESSION_ID = $scope.$parent.CASHUP.SESSION_ID;
        CashupModelObj.EPOS_SALES_START_DATE = $scope.$parent.CASHUP.SESSION.SESSION_START;
        CashupModelObj.EPOS_SALES_END_DATE = $scope.$parent.CASHUP.SESSION.SESSION_END;
        CashupModelObj.CASHUP_MAIN_ID = parseInt($scope.$parent.CASHUP.CASHUP_MAIN_ID);
        CashupModelObj.BRANCH_ID = $scope.$parent.CASHUP.BRANCH_ID;
        CashupModelObj.ENTITY_NAME = $cookies.get("ENTITY_NAME");
        CashupModelObj.BRANCH_NAME = $scope.$parent.CASHUP.BRANCH_NAME;
        CashupModelObj.FILE_PATH = "CashUp" + '/' + parseInt($cookies.get("ENTITY_ID")) + '/' + parseInt($cookies.get("USERID")) + '/';
        CashupModelObj.FILE_NAME = "CashUp";
        PrcCommMethods.CASHUP_API(CashupModelObj, 'DOWNLOAD_TEMPLATE_CASHUP_SALES', 'PO').then(function (data) {
            window.open(data.data, '_blank');
        });
    }
    $scope.init_decleration_details = function (declaration) {
        declaration.QUANTITY == 0 ? declaration.QUANTITY = null : '';
    };
    $scope.INS_UPD_REVENUE_CENTERS = function () {

        var CashupModelObj = new Object();
        CashupModelObj.ID = $scope.$parent.CASHUP.ID;
        CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
        var REVENUE_DETAILS = [];
        var UNIQUE_SESSIONS = $filter('unique')($scope.$parent.CASHUP.REVENUE_CENTERS, 'SESSION_NAME');
        //angular.forEach(UNIQUE_SESSIONS, function (session) {
        angular.forEach($scope.$parent.CASHUP.REVENUE_CENTERS, function (rc) {

            var detailobj = new Object();
            detailobj.TABLE_ID = rc.TABLE_ID;
            detailobj.REVENUECENTER = rc.REVENUECENTER;
            detailobj.ROWINDEX = rc.ROWINDEX;
            detailobj.SESSION_ID = rc.SESSION_ID;
            detailobj.COVERS = rc.COVERS;
            detailobj.ACTIVE = 1;
            REVENUE_DETAILS.push(detailobj);
        });
        //  });

        CashupModelObj.DECLARATION_DETAILS = REVENUE_DETAILS;
        PrcCommMethods.CASHUP_API(CashupModelObj, 'INS_UPD_REVENUE_CENTERS').then(function (data) {
            $scope.GET_REVENUE_CENTERS();
        });
    };

    $scope.InsertCashUpHeader_1 = function () {

        var CashupModelObj = new Object();
        CashupModelObj.ID = $scope.$parent.CASHUP.ID;
        CashupModelObj.CASHUP_MAIN_ID = $scope.$parent.CASHUP.CASHUP_MAIN_ID;
        CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CashupModelObj.BRANCH_ID = $scope.$parent.CASHUP.BRANCH_ID;
        CashupModelObj.TILL_ID = $scope.$parent.CASHUP.TYPE == 1 ? $scope.$parent.CASHUP.TILL_ID : null;
        CashupModelObj.SESSION_ID = $scope.$parent.CASHUP.TYPE == 2 ? $scope.$parent.CASHUP.SESSION_ID : null;
        CashupModelObj.AREA_ID = $scope.$parent.CASHUP.AREA_ID;
        CashupModelObj.CASHUP_DATE = $scope.$parent.CASHUP.CASHUP_DATE;
        CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
        CashupModelObj.TYPE = $scope.$parent.CASHUP.TYPE;
        CashupModelObj.STEP_NO = 0;

        PrcCommMethods.CASHUP_API(CashupModelObj, 'INS_CASHUP_HEADER').then(function (data) {

            $scope.$parent.CASHUP.ID = data.data;
            //$scope.$parent.CASHUP.ACTUAL_STEP_NO = 1;
            if ($scope.$parent.CASHUP.TABLIST[1].FLAG == 1) {
                $location.path("Float").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
            } else if ($scope.$parent.CASHUP.TABLIST[2].FLAG == 1) {
                $location.path("Cash").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
            } else if ($scope.$parent.CASHUP.TABLIST[3].FLAG == 1) {
                $location.path("Cards").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
            } else if ($scope.$parent.CASHUP.TABLIST[4].FLAG == 1) {
                $location.path("PtyCash").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
            } else if ($scope.$parent.CASHUP.TABLIST[5].FLAG == 1) {
                $location.path("Delivery").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
            } else if ($scope.$parent.CASHUP.TABLIST[6].FLAG == 1) {
                $location.path("AccountCustomer").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
            } else if ($scope.$parent.CASHUP.TABLIST[7].FLAG == 1) {
                $location.path("Vouchers").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
            } else if ($scope.$parent.CASHUP.TABLIST[8].FLAG == 1) {
                $location.path("Deposits").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
            } else if ($scope.$parent.CASHUP.TABLIST[9].FLAG == 1) {
                $location.path("Complimentary").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
            }
        });
    };
    $scope.InsertCashUpHeader_12 = function () {

        var CashupModelObj = new Object();
        CashupModelObj.ID = $scope.$parent.CASHUP.ID;
        CashupModelObj.CASHUP_MAIN_ID = $scope.$parent.CASHUP.CASHUP_MAIN_ID;
        CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CashupModelObj.BRANCH_ID = $scope.$parent.CASHUP.BRANCH_ID;
        CashupModelObj.TILL_ID = $scope.$parent.CASHUP.TYPE == 1 ? $scope.$parent.CASHUP.TILL_ID : null;
        CashupModelObj.SESSION_ID = $scope.$parent.CASHUP.TYPE == 2 ? $scope.$parent.CASHUP.SESSION_ID : null;
        CashupModelObj.AREA_ID = $scope.$parent.CASHUP.AREA_ID;
        CashupModelObj.CASHUP_DATE = $scope.$parent.CASHUP.CASHUP_DATE;
        CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
        CashupModelObj.TYPE = $scope.$parent.CASHUP.TYPE;
        CashupModelObj.STEP_NO = 0;

        PrcCommMethods.CASHUP_API(CashupModelObj, 'INS_CASHUP_HEADER').then(function (data) {
            $scope.$parent.CASHUP.ID = data.data;

        });
    };

    $scope.GET_CASHUP_BY_ID = function () {

        var CashupModelObj = new Object();
        CashupModelObj.CASHUP_MAIN_ID = $scope.$parent.CASHUP.CASHUP_MAIN_ID;
        CashupModelObj.SESSION_ID = $scope.$parent.CASHUP.SESSION_ID;
        CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_CASHUP_BY_ID').then(function (data) {

            if (data != undefined && data.data != undefined && data.data.Table.length > 0) {
                $scope.$parent.CASHUP.ID = data.data.Table[0].ID;
                $scope.GET_REVENUE_CENTERS();
                $scope.$parent.CASHUP.BRANCH_ID = data.data.Table[0].BRANCH_ID;
                //$scope.$parent.CASHUP.AREA_ID = data.data[0].AREA_ID;
                $scope.$parent.CASHUP.TILL_ID = data.data.Table[0].TILL_ID;
                //$scope.$parent.CASHUP.SESSION_ID = data.data.Table[0].SESSION_ID;
                //$scope.$parent.CASHUP.SESSION = data.data.Table[0];
                $scope.$parent.CASHUP.SESSION.CASHUP_HEADER_ID = data.data.Table[0].ID;
                $scope.$parent.CASHUP.TYPE = data.data.Table[0].CASHUP_TYPE;
                $scope.$parent.CASHUP.CASHUP_DATE = data.data.Table[0].CASHUP_DATE;
                //$scope.$parent.CASHUP.STEP_NO = angular.copy(data.data.Table[0].STEP_NO);

                $scope.$parent.CASHUP.STEP_NO = data.data.Table[0].STEP_NO;
                $scope.$parent.CASHUP.ACTUAL_STEP_NO = data.data.Table[0].STEP_NO;
                $scope.$parent.CASHUP.TOTAL_FLOAT = data.data.Table[0].FLOAT_TOTAL != null ? parseFloat(data.data.Table[0].FLOAT_TOTAL) : 0;;
                $scope.$parent.CASHUP.TOTAL_CASH = data.data.Table[0].CASH_TOTAL != null ? parseFloat(data.data.Table[0].CASH_TOTAL) : 0;;

                $scope.$parent.CASHUP.TOTAL_CARD = data.data.Table[0].CARDS_TOTAL != null ? parseFloat(data.data.Table[0].CARDS_TOTAL) : 0;
                $scope.$parent.CASHUP.TOTAL_TOTAL_VAL = data.data.Table[0].PETTY_CASH != null ? parseFloat(data.data.Table[0].PETTY_CASH) : 0;
                $scope.$parent.CASHUP.TOTAL_CHEQUE = data.data.Table[0].CHEQUE != null ? parseFloat(data.data.Table[0].CHEQUE) : 0;
                $scope.$parent.CASHUP.ACCOUNT_TOTAL = data.data.Table[0].ACCOUNT_TOTAL != null ? parseFloat(data.data.Table[0].ACCOUNT_TOTAL) : 0;
                $scope.$parent.CASHUP.ACCOUNT_RECEIVED_TOTAL = data.data.Table[0].ACCOUNT_RECEIVED_TOTAL != null ? parseFloat(data.data.Table[0].ACCOUNT_RECEIVED_TOTAL) : 0;

                $scope.$parent.CASHUP.DEPOSIT_TOTAL = data.data.Table[0].DEPOSIT_RECEIVED_TOTAL != null ? parseFloat(data.data.Table[0].DEPOSIT_RECEIVED_TOTAL) : 0;
                $scope.$parent.CASHUP.DEPOSIT_REDEEMED_TOTAL = data.data.Table[0].DEPOSIT_REDEEMED_TOTAL != null ? parseFloat(data.data.Table[0].DEPOSIT_REDEEMED_TOTAL) : 0;
                $scope.$parent.CASHUP.ISSUE_TOTAL = data.data.Table[0].VOUCHER_ISSUED_TOTAL != null ? parseFloat(data.data.Table[0].VOUCHER_ISSUED_TOTAL) : 0;
                $scope.$parent.CASHUP.REDEEMED_TOTAL = data.data.Table[0].VOUCHER_REDEEMED_TOTAL != null ? parseFloat(data.data.Table[0].VOUCHER_REDEEMED_TOTAL) : 0;
                $scope.$parent.CASHUP.VOID_TOTAL = data.data.Table[0].VOID_TOTAL != null ? parseFloat(data.data.Table[0].VOID_TOTAL) : 0;
                $scope.$parent.CASHUP.COMP_TOTAL = data.data.Table[0].COMPLIMENTARY_TOTAL != null ? parseFloat(data.data.Table[0].COMPLIMENTARY_TOTAL) : 0;
                $scope.$parent.CASHUP.CASH_TIPS = (data.data.Table[0].CASH_TIPS != null && data.data.Table[0].CASH_TIPS != 0) ? parseFloat(data.data.Table[0].CASH_TIPS).toFixed(2) : null;


                $scope.$parent.CASHUP.ORIGINAL_FILE_NAME = data.data.Table[0].ORIGINAL_FILE_NAME;
                $scope.$parent.CASHUP.UPL_ID = data.data.Table[0].UPL_ID;
                $scope.$parent.CASHUP.INTEGRATION_SYSTEM_ID = data.data.Table[0].INTEGRATION_SYSTEM_ID;
                //if ($scope.$parent.CASHUP.ACC_CUSTOMER_RED_LIST == null) {
                //    $scope.$parent.CASHUP.ACCOUNT_RECEIVED_TOTAL = 0;
                //}

                // $scope.$parent.CASHUP.INTEGRATION_SYSTEM_ID = 12;
                //  $scope.$parent.CASHUP.INTEGRATION_SYSTEM_ID = 0;

                $scope.$parent.CASHUP.INTEGRATION_URL = data.data.Table[0].URL_PATH;
                $scope.$parent.CASHUP.ACCESS_TOKEN = data.data.Table[0].API_KEY;
                $scope.$parent.CASHUP.ACC_CUSTOMER_RED_LIST = [];
                //   $scope.GOTOSTEP($scope.$parent.CASHUP.STEP_NO+1);
                // window.location.href = '../Cashup/CashupIndex#!/Float?CMID=' + $scope.$parent.CashUp_Main_ID;
                //$scope.InsertCashUpHeader_12();
                $scope.GET_CASHUP_CATEGORY_BIFURCATION();
                //  $scope.GET_EPOS_HEADER();
                $scope.GET_EPOS_DATA();

                //for (var i = 0; i < data.data.Table1.length; i++) {
                //    if (data.data.Table1[i].NOTE_TYPE_ID == 1) {
                //        $scope.$parent.CASHUP.FLOAT_NOTES_ID = data.data.Table1[i].ID != 0 ? data.data.Table1[i].ID : 0;
                //        $scope.$parent.CASHUP.FLOAT_NOTES = data.data.Table1[i].NOTE;
                //    }
                //    else if (data.data.Table1[i].NOTE_TYPE_ID == 2) {
                //        $scope.$parent.CASHUP.CASH_NOTES_ID = data.data.Table1[i].ID != 0 ? data.data.Table1[i].ID : 0;
                //        $scope.$parent.CASHUP.CASH_NOTES = data.data.Table1[i].NOTE;
                //    }
                //    else if (data.data.Table1[i].NOTE_TYPE_ID == 3) {
                //        $scope.$parent.CASHUP.CARD_NOTES_ID = data.data.Table1[i].ID != 0 ? data.data.Table1[i].ID : 0;
                //        $scope.$parent.CASHUP.CARD_NOTES = data.data.Table1[i].NOTE;
                //    }
                //    else if (data.data.Table1[i].NOTE_TYPE_ID == 4) {
                //        $scope.$parent.CASHUP.PCASH_NOTES_ID = data.data.Table1[i].ID != 0 ? data.data.Table1[i].ID : 0;
                //        $scope.$parent.CASHUP.PCASH_NOTES = data.data.Table1[i].NOTE;
                //    }
                //    else if (data.data.Table1[i].NOTE_TYPE_ID == 5) {
                //        $scope.$parent.CASHUP.COMP_NOTES_ID = data.data.Table1[i].ID != 0 ? data.data.Table1[i].ID : 0;
                //        $scope.$parent.CASHUP.COMP_NOTES = data.data.Table1[i].NOTE;
                //    }
                //    else if (data.data.Table1[i].NOTE_TYPE_ID == 6) {
                //        if ($scope.$parent.CASHUP.CashUp_Main_STATUS_ID == 4 || $scope.$parent.CASHUP.CashUp_Main_STATUS_ID == 5) {
                //            $scope.$parent.CASHUP.REV_NOTES_ID = data.data.Table1[i].ID != 0 ? data.data.Table1[i].ID : 0;
                //            $scope.$parent.CASHUP.REV_NOTES = $scope.$parent.CASHUP.AreaList[0].REJECTION_COMMENTS;
                //        } else {
                //            $scope.$parent.CASHUP.REV_NOTES_ID = data.data.Table1[i].ID != 0 ? data.data.Table1[i].ID : 0;
                //            $scope.$parent.CASHUP.REV_NOTES = data.data.Table1[i].NOTE;
                //        }
                //    }
                //}

                if ($scope.$parent.CASHUP.FG == "VIEW") {
                    $scope.$parent.CASHUP.STEP_NO = 0;
                    $scope.$parent.CASHUP.ACTUAL_STEP_NO = 0;
                }
            }
            //else {
            //    $scope.CASHUP_RESET();
            //}

        });

    };
    $scope.GET_REVENUE_CENTERS = function () {

        var CashupModelObj = new Object();
        CashupModelObj.ID = $scope.$parent.CASHUP.ID;
        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_REVENUE_CENTERS').then(function (data) {
            //$scope.$parent.CASHUP.REVENUE_CENTERS = [];

            if (data != undefined && data.data != undefined) {
                //$scope.$parent.CASHUP.REVENUE_CENTERS = [];
                $scope.$parent.CASHUP.REVENUE_CENTERS = data.data.Table;
            }
        });
    };
    $scope.GET_EPOS_HEADER = function () {

        var CashupModelObj = new Object();
        CashupModelObj.ID = $scope.$parent.CASHUP.ID;

        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_EPOS_HEADER').then(function (data) {
            if (data != undefined && data.data != undefined && data.data.length > 0) {

                $scope.$parent.CASHUP.EPOS_HEADER_DATA = [];
                $scope.$parent.CASHUP.EPOS_HEADER_DATA = data.data;
            }
            $scope.GET_CASHUP_CATEGORY_BIFURCATION();
        });
    };
    $scope.GET_CASHUP_CATEGORY_BIFURCATION = function () {
        if ($scope.$parent.CASHUP.ID != null && $scope.$parent.CASHUP.ID != undefined) {
            var CashupModelObj = new Object();
            CashupModelObj.ID = $scope.$parent.CASHUP.ID;
            PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_CASHUP_CATEGORY_BIFURCATION').then(function (data) {

                if (data != undefined && data.data != undefined) {
                    $scope.$parent.CASHUP.EPOS_CAT_DATA = data.data.Table1;
                    $scope.$parent.CASHUP.EPOS_DATA = data.data.Table2;
                    $scope.$parent.CASHUP.MEDIA_DATA = data.data.Table5;
                    $scope.$parent.CASHUP.EPOS_TOTAL = 0;
                    if (data.data.Table3.length > 0) {
                        $scope.$parent.CASHUP.EPOS_HEADER_DATA = [];
                        $scope.$parent.CASHUP.EPOS_HEADER_DATA = data.data.Table3;
                    }
                    //var Flag_VCASH = true;
                    //var Flag_VCARD = true;
                    //var Flag_VPETTYCASH = true;
                    //var Flag_VACCOUNT = true;
                    //var Flag_VDELIVERY = true;
                    //var Flag_VVOUCHER_RED = true;
                    //var Flag_VVOUCHER_ISSUE = true;
                    //var Flag_VDEPREDEEMED = true;
                    //var Flag_VTRANSITORY = true;

                    //var Flag_VDEPRECIVED = true;

                    //angular.forEach($scope.$parent.CASHUP.EPOS_DATA, function (EPOSVAL) {
                    //   
                    //    if (EPOSVAL.MEDIA.toUpperCase() == 'CASH') {
                    //        $scope.$parent.CASHUP.VARIANCE_CASH = EPOSVAL.SALES_AMT * -1 - $scope.$parent.CASHUP.TOTAL_CASH * -1;
                    //        Flag_VCASH = false;
                    //    } else if (EPOSVAL.MEDIA.toUpperCase() == 'CARDS') {
                    //        $scope.$parent.CASHUP.VARIANCE_CARD = EPOSVAL.SALES_AMT * -1 - $scope.$parent.CASHUP.TOTAL_CARD * -1;
                    //        Flag_VCARD = false;
                    //    } else if (EPOSVAL.MEDIA.toUpperCase() == 'PETTY CASH') {
                    //        $scope.$parent.CASHUP.VARIANCE_PETTY_CASH = EPOSVAL.SALES_AMT * -1 - $scope.$parent.CASHUP.TOTAL_TOTAL_VAL * -1;
                    //        Flag_VPETTYCASH = false;
                    //    } else if (EPOSVAL.MEDIA.toUpperCase() == 'ACCOUNT CREDIT') {
                    //        $scope.$parent.CASHUP.VARIANCE_ACCOUNT = EPOSVAL.SALES_AMT * -1 - $scope.$parent.CASHUP.ACCOUNT_TOTAL * -1;
                    //        Flag_VACCOUNT = false;
                    //    } else if (EPOSVAL.MEDIA.toUpperCase() == "DELIVERY") {
                    //        $scope.$parent.CASHUP.VARIANCE_CHEQUE = EPOSVAL.SALES_AMT * -1 - $scope.$parent.CASHUP.TOTAL_CHEQUE * -1;
                    //        Flag_VDELIVERY = false;
                    //    } else if (EPOSVAL.MEDIA.toUpperCase() == "VOUCHER REDEEMED") {
                    //        $scope.$parent.CASHUP.VARIANCE_REDEEMED = EPOSVAL.SALES_AMT * -1 - $scope.$parent.CASHUP.REDEEMED_TOTAL * -1;
                    //        Flag_VVOUCHER_RED = false;
                    //    } else if (EPOSVAL.MEDIA.toUpperCase() == "VOUCHER ISSUE") {
                    //        $scope.$parent.CASHUP.VARIANCE_ISSUE = EPOSVAL.SALES_AMT * -1 - $scope.$parent.CASHUP.ISSUE_TOTAL * -1;
                    //        Flag_VVOUCHER_ISSUE = false;
                    //    } else if (EPOSVAL.MEDIA.toUpperCase() == 'DEPOSIT REDEEMED') {
                    //        $scope.$parent.CASHUP.VARIANCE_DEPOSIT_REDEEMED = EPOSVAL.SALES_AMT * -1 - $scope.$parent.CASHUP.DEPOSIT_REDEEMED_TOTAL * -1;
                    //        Flag_VDEPREDEEMED = false;
                    //    }
                    //    //else if (EPOSVAL.MEDIA.toUpperCase() == "DEPOSIT RECEIVED") {
                    //    //    $scope.$parent.CASHUP.VARIANCE_DEPOSIT = EPOSVAL.SALES_AMT * -1 - $scope.$parent.CASHUP.DEPOSIT_TOTAL * -1;
                    //    //    Flag_VDEPRECIVED = false;
                    //    //} 

                    //    //else if (EPOSVAL.MEDIA.toUpperCase() == "TRANSITORY") {
                    //    //    $scope.$parent.CASHUP.VARIANCE_DEPOSIT_REDEEMED = EPOSVAL.SALES_AMT * -1 - $scope.$parent.CASHUP.DEPOSIT_REDEEMED_TOTAL * -1;
                    //    //    Flag_VDEPREDEEMED = false;
                    //    //}
                    //})
                    //if (Flag_VCASH) {
                    //    $scope.$parent.CASHUP.VARIANCE_CASH = $scope.$parent.CASHUP.TOTAL_CASH;
                    //}
                    //if (Flag_VCARD) {
                    //    $scope.$parent.CASHUP.VARIANCE_CARD = $scope.$parent.CASHUP.TOTAL_CARD;
                    //}
                    //if (Flag_VPETTYCASH) {
                    //    $scope.$parent.CASHUP.VARIANCE_PETTY_CASH = $scope.$parent.CASHUP.TOTAL_TOTAL_VAL;
                    //}
                    //if (Flag_VACCOUNT) {
                    //    $scope.$parent.CASHUP.VARIANCE_ACCOUNT = $scope.$parent.CASHUP.ACCOUNT_TOTAL;
                    //}
                    //if (Flag_VDELIVERY) {
                    //    $scope.$parent.CASHUP.VARIANCE_CHEQUE = $scope.$parent.CASHUP.TOTAL_CHEQUE;
                    //}
                    //if (Flag_VVOUCHER_RED) {
                    //    $scope.$parent.CASHUP.VARIANCE_REDEEMED = $scope.$parent.CASHUP.REDEEMED_TOTAL;
                    //}
                    //if (Flag_VVOUCHER_ISSUE) {
                    //    $scope.$parent.CASHUP.VARIANCE_ISSUE = $scope.$parent.CASHUP.ISSUE_TOTAL;
                    //}
                    //if (Flag_VDEPREDEEMED) {
                    //    $scope.$parent.CASHUP.VARIANCE_DEPOSIT_REDEEMED = $scope.$parent.CASHUP.DEPOSIT_REDEEMED_TOTAL;
                    //}
                    ////if (Flag_VDEPRECIVED) {
                    ////    $scope.$parent.CASHUP.VARIANCE_DEPOSIT = $scope.$parent.CASHUP.DEPOSIT_TOTAL;
                    ////}

                    ////if ($scope.$parent.CASHUP.EPOS_HEADER_DATA.length > 0) {
                    ////    if (parseInt($scope.$parent.CASHUP.EPOS_HEADER_DATA[0].GIFT_CERT_TOTAL) != 0) {
                    ////        $scope.$parent.CASHUP.VARIANCE_ISSUE = parseInt($scope.$parent.CASHUP.EPOS_HEADER_DATA[0].GIFT_CERT_TOTAL) * -1 - $scope.$parent.CASHUP.ISSUE_TOTAL * -1;
                    ////    } else {
                    ////        $scope.$parent.CASHUP.VARIANCE_ISSUE = $scope.$parent.CASHUP.ISSUE_TOTAL;
                    ////    }
                    ////} else {
                    ////    $scope.$parent.CASHUP.VARIANCE_ISSUE = $scope.$parent.CASHUP.ISSUE_TOTAL;
                    ////}

                    //$scope.$parent.CASHUP.REV_CASHUP_TOTAL = $scope.$parent.CASHUP.TOTAL_CASH + $scope.$parent.CASHUP.TOTAL_TOTAL_VAL + $scope.$parent.CASHUP.TOTAL_CHEQUE + $scope.$parent.CASHUP.TOTAL_CARD + $scope.$parent.CASHUP.REDEEMED_TOTAL + $scope.$parent.CASHUP.ACCOUNT_TOTAL + $scope.$parent.CASHUP.DEPOSIT_REDEEMED_TOTAL + $scope.$parent.CASHUP.ISSUE_TOTAL;

                    //$scope.$parent.CASHUP.VARIANCE_TOTAL = (($scope.$parent.CASHUP.VARIANCE_CASH * -1) + ($scope.$parent.CASHUP.VARIANCE_CARD * -1) + ($scope.$parent.CASHUP.VARIANCE_REDEEMED * -1) + ($scope.$parent.CASHUP.VARIANCE_ACCOUNT * -1) + ($scope.$parent.CASHUP.VARIANCE_PETTY_CASH * -1) + ($scope.$parent.CASHUP.VARIANCE_DEPOSIT_REDEEMED * -1) + ($scope.$parent.CASHUP.VARIANCE_CHEQUE * -1) + ($scope.$parent.CASHUP.VARIANCE_ISSUE * -1)) * 1;


                }

                //if ($scope.KeyFlag) {

                //    $location.path("Reviews").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                //}

                if ($scope.$parent.CASHUP.FG == null) {
                    $scope.GOTOSTEP($scope.$parent.CASHUP.STEP_NO);
                } else if ($scope.$parent.CASHUP.FG == "VIEW") {
                    $scope.GOTOSTEP_View($scope.$parent.CASHUP.STEP_NO);
                }
                $scope.$parent.$parent.overlay_loading_coffee = 'none';
            });
        }
    };

    //-----------------------------------------------------------------------------------
    $scope.GET_CASHUP_BY_ID1 = function () {

        var CashupModelObj = new Object();
        CashupModelObj.CASHUP_MAIN_ID = $scope.$parent.CASHUP.CASHUP_MAIN_ID;
        CashupModelObj.SESSION_ID = $scope.$parent.CASHUP.SESSION_ID;
        CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_CASHUP_BY_ID').then(function (data) {

            if (data != undefined && data.data != undefined && data.data.Table.length > 0) {
                $scope.$parent.CASHUP.ID = data.data.Table[0].ID;
                $scope.GET_REVENUE_CENTERS1();
                $scope.$parent.CASHUP.BRANCH_ID = data.data.Table[0].BRANCH_ID;
                //$scope.$parent.CASHUP.AREA_ID = data.data[0].AREA_ID;
                $scope.$parent.CASHUP.TILL_ID = data.data.Table[0].TILL_ID;
                //$scope.$parent.CASHUP.SESSION_ID = data.data.Table[0].SESSION_ID;
                //$scope.$parent.CASHUP.SESSION = data.data.Table[0];
                $scope.$parent.CASHUP.SESSION.CASHUP_HEADER_ID = data.data.Table[0].ID;
                $scope.$parent.CASHUP.TYPE = data.data.Table[0].CASHUP_TYPE;
                $scope.$parent.CASHUP.CASHUP_DATE = data.data.Table[0].CASHUP_DATE;
                $scope.$parent.CASHUP.STEP_NO = angular.copy(data.data.Table[0].STEP_NO);
                $scope.$parent.CASHUP.ACTUAL_STEP_NO = data.data.Table[0].STEP_NO;
                //$scope.$parent.CASHUP.TOTAL_FLOAT = data.data.Table[0].FLOAT_TOTAL;
                //$scope.$parent.CASHUP.TOTAL_CASH = data.data.Table[0].CASH_TOTAL;

                $scope.$parent.CASHUP.TOTAL_FLOAT = data.data.Table[0].FLOAT_TOTAL != null ? parseFloat(data.data.Table[0].FLOAT_TOTAL) : 0;;
                $scope.$parent.CASHUP.TOTAL_CASH = data.data.Table[0].CASH_TOTAL != null ? parseFloat(data.data.Table[0].CASH_TOTAL) : 0;;

                $scope.$parent.CASHUP.TOTAL_CARD = data.data.Table[0].CARDS_TOTAL != null ? parseFloat(data.data.Table[0].CARDS_TOTAL) : 0;
                $scope.$parent.CASHUP.TOTAL_TOTAL_VAL = data.data.Table[0].PETTY_CASH != null ? parseFloat(data.data.Table[0].PETTY_CASH) : 0;
                $scope.$parent.CASHUP.TOTAL_CHEQUE = data.data.Table[0].CHEQUE != null ? parseFloat(data.data.Table[0].CHEQUE) : 0;
                $scope.$parent.CASHUP.ACCOUNT_TOTAL = data.data.Table[0].ACCOUNT_TOTAL != null ? parseFloat(data.data.Table[0].ACCOUNT_TOTAL) : 0;
                $scope.$parent.CASHUP.ACCOUNT_RECEIVED_TOTAL = data.data.Table[0].ACCOUNT_RECEIVED_TOTAL != null ? parseFloat(data.data.Table[0].ACCOUNT_RECEIVED_TOTAL) : 0;

                $scope.$parent.CASHUP.DEPOSIT_TOTAL = data.data.Table[0].DEPOSIT_RECEIVED_TOTAL != null ? parseFloat(data.data.Table[0].DEPOSIT_RECEIVED_TOTAL) : 0;
                $scope.$parent.CASHUP.DEPOSIT_REDEEMED_TOTAL = data.data.Table[0].DEPOSIT_REDEEMED_TOTAL != null ? parseFloat(data.data.Table[0].DEPOSIT_REDEEMED_TOTAL) : 0;
                $scope.$parent.CASHUP.ISSUE_TOTAL = data.data.Table[0].VOUCHER_ISSUED_TOTAL != null ? parseFloat(data.data.Table[0].VOUCHER_ISSUED_TOTAL) : 0;
                $scope.$parent.CASHUP.REDEEMED_TOTAL = data.data.Table[0].VOUCHER_REDEEMED_TOTAL != null ? parseFloat(data.data.Table[0].VOUCHER_REDEEMED_TOTAL) : 0;
                $scope.$parent.CASHUP.VOID_TOTAL = data.data.Table[0].VOID_TOTAL != null ? parseFloat(data.data.Table[0].VOID_TOTAL) : 0;
                $scope.$parent.CASHUP.COMP_TOTAL = data.data.Table[0].COMPLIMENTARY_TOTAL != null ? parseFloat(data.data.Table[0].COMPLIMENTARY_TOTAL) : 0;
                $scope.$parent.CASHUP.CASH_TIPS = (data.data.Table[0].CASH_TIPS != null && data.data.Table[0].CASH_TIPS != 0) ? parseFloat(data.data.Table[0].CASH_TIPS).toFixed(2) : null;


                $scope.$parent.CASHUP.ORIGINAL_FILE_NAME = data.data.Table[0].ORIGINAL_FILE_NAME;
                $scope.$parent.CASHUP.UPL_ID = data.data.Table[0].UPL_ID;
                $scope.$parent.CASHUP.INTEGRATION_SYSTEM_ID = data.data.Table[0].INTEGRATION_SYSTEM_ID;
                // $scope.$parent.CASHUP.INTEGRATION_SYSTEM_ID = 12;
                //  $scope.$parent.CASHUP.INTEGRATION_SYSTEM_ID = 0;

                $scope.$parent.CASHUP.INTEGRATION_URL = data.data.Table[0].URL_PATH;
                $scope.$parent.CASHUP.ACCESS_TOKEN = data.data.Table[0].API_KEY;
                $scope.$parent.CASHUP.ACC_CUSTOMER_RED_LIST = [];

                //   $scope.GOTOSTEP($scope.$parent.CASHUP.STEP_NO+1);
                // window.location.href = '../Cashup/CashupIndex#!/Float?CMID=' + $scope.$parent.CashUp_Main_ID;
                $scope.GET_CASHUP_CATEGORY_BIFURCATION1();
                // $scope.GET_EPOS_HEADER1();
                $scope.GET_EPOS_DATA1();
                //for (var i = 0; i < data.data.Table1.length; i++) {
                //    if (data.data.Table1[i].NOTE_TYPE_ID == 1) {
                //        $scope.$parent.CASHUP.FLOAT_NOTES_ID = data.data.Table1[i].ID != 0 ? data.data.Table1[i].ID : 0;
                //        $scope.$parent.CASHUP.FLOAT_NOTES = data.data.Table1[i].NOTE;
                //    }
                //    else if (data.data.Table1[i].NOTE_TYPE_ID == 2) {
                //        $scope.$parent.CASHUP.CASH_NOTES_ID = data.data.Table1[i].ID != 0 ? data.data.Table1[i].ID : 0;
                //        $scope.$parent.CASHUP.CASH_NOTES = data.data.Table1[i].NOTE;
                //    }
                //    else if (data.data.Table1[i].NOTE_TYPE_ID == 3) {
                //        $scope.$parent.CASHUP.CARD_NOTES_ID = data.data.Table1[i].ID != 0 ? data.data.Table1[i].ID : 0;
                //        $scope.$parent.CASHUP.CARD_NOTES = data.data.Table1[i].NOTE;
                //    }
                //    else if (data.data.Table1[i].NOTE_TYPE_ID == 4) {
                //        $scope.$parent.CASHUP.PCASH_NOTES_ID = data.data.Table1[i].ID != 0 ? data.data.Table1[i].ID : 0;
                //        $scope.$parent.CASHUP.PCASH_NOTES = data.data.Table1[i].NOTE;
                //    }
                //    else if (data.data.Table1[i].NOTE_TYPE_ID == 5) {
                //        $scope.$parent.CASHUP.COMP_NOTES_ID = data.data.Table1[i].ID != 0 ? data.data.Table1[i].ID : 0;
                //        $scope.$parent.CASHUP.COMP_NOTES = data.data.Table1[i].NOTE;
                //    }
                //    else if (data.data.Table1[i].NOTE_TYPE_ID == 6) {
                //        if ($scope.$parent.CASHUP.CashUp_Main_STATUS_ID == 4 || $scope.$parent.CASHUP.CashUp_Main_STATUS_ID == 5) {
                //            $scope.$parent.CASHUP.REV_NOTES_ID = data.data.Table1[i].ID != 0 ? data.data.Table1[i].ID : 0;
                //            $scope.$parent.CASHUP.REV_NOTES = $scope.$parent.CASHUP.AreaList[0].REJECTION_COMMENTS;
                //        } else {
                //            $scope.$parent.CASHUP.REV_NOTES_ID = data.data.Table1[i].ID != 0 ? data.data.Table1[i].ID : 0;
                //            $scope.$parent.CASHUP.REV_NOTES = data.data.Table1[i].NOTE;
                //        }
                //    }
                //}

                if ($scope.$parent.CASHUP.FG == "VIEW") {
                    $scope.$parent.CASHUP.STEP_NO = 1;
                    $scope.$parent.CASHUP.ACTUAL_STEP_NO = 1;
                }
            }
            else {
                $scope.CASHUP_RESET();
            }
            $scope.$parent.$parent.overlay_loading_coffee = 'none';
        });
    };
    $scope.GET_REVENUE_CENTERS1 = function () {

        var CashupModelObj = new Object();
        CashupModelObj.ID = $scope.$parent.CASHUP.ID;
        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_REVENUE_CENTERS').then(function (data) {


            // $scope.CASHUP.REVENUE_CENTERS= [];
            if (data != undefined && data.data != undefined) {
                //$scope.$parent.CASHUP.REVENUE_CENTERS = [];
                $scope.$parent.CASHUP.REVENUE_CENTERS = data.data.Table;
            }
        });
    };
    $scope.GET_EPOS_HEADER1 = function () {

        var CashupModelObj = new Object();
        CashupModelObj.ID = $scope.$parent.CASHUP.ID;

        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_EPOS_HEADER').then(function (data) {

            if (data != undefined && data.data != undefined && data.data.length > 0) {
                $scope.$parent.CASHUP.EPOS_HEADER_DATA = [];
                $scope.$parent.CASHUP.EPOS_HEADER_DATA = data.data;

            }
            //else {
            //    $scope.$parent.CASHUP.EPOS_HEADER_DATA = [];
            //}
            $scope.GET_CASHUP_CATEGORY_BIFURCATION1();
        });
    };
    $scope.GET_CASHUP_CATEGORY_BIFURCATION1 = function () {

        var CashupModelObj = new Object();
        CashupModelObj.ID = $scope.$parent.CASHUP.ID;
        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_CASHUP_CATEGORY_BIFURCATION').then(function (data) {
            $scope.$parent.CASHUP.EPOS_CAT_DATA = [];
            $scope.$parent.CASHUP.EPOS_DATA = [];

            if (data != undefined && data.data != undefined) {
                $scope.$parent.CASHUP.EPOS_CAT_DATA = data.data.Table1;
                $scope.$parent.CASHUP.EPOS_DATA = data.data.Table2;
                $scope.$parent.CASHUP.MEDIA_DATA = data.data.Table5;
                $scope.$parent.CASHUP.EPOS_TOTAL = 0;
                if (data.data.Table3.length > 0) {
                    $scope.$parent.CASHUP.EPOS_HEADER_DATA = [];
                    $scope.$parent.CASHUP.EPOS_HEADER_DATA = data.data.Table3;
                }
                //var Flag_VCASH = true;
                //var Flag_VCARD = true;
                //var Flag_VPETTYCASH = true;
                //var Flag_VACCOUNT = true;
                //var Flag_VDELIVERY = true;
                //var Flag_VVOUCHER_RED = true;
                //var Flag_VVOUCHER_ISSUE = true;
                //var Flag_VDEPREDEEMED = true;
                //var Flag_VTRANSITORY = true;

                //var Flag_VDEPRECIVED = true;

                //angular.forEach($scope.$parent.CASHUP.EPOS_DATA, function (EPOSVAL) {
                //   
                //    if (EPOSVAL.MEDIA.toUpperCase() == 'CASH') {
                //        $scope.$parent.CASHUP.VARIANCE_CASH = EPOSVAL.SALES_AMT * -1 - $scope.$parent.CASHUP.TOTAL_CASH * -1;
                //        Flag_VCASH = false;
                //    } else if (EPOSVAL.MEDIA.toUpperCase() == 'CARDS') {
                //        $scope.$parent.CASHUP.VARIANCE_CARD = EPOSVAL.SALES_AMT * -1 - $scope.$parent.CASHUP.TOTAL_CARD * -1;
                //        Flag_VCARD = false;
                //    } else if (EPOSVAL.MEDIA.toUpperCase() == 'PETTY CASH') {
                //        $scope.$parent.CASHUP.VARIANCE_PETTY_CASH = EPOSVAL.SALES_AMT * -1 - $scope.$parent.CASHUP.TOTAL_TOTAL_VAL * -1;
                //        Flag_VPETTYCASH = false;
                //    } else if (EPOSVAL.MEDIA.toUpperCase() == 'ACCOUNT CREDIT') {
                //        $scope.$parent.CASHUP.VARIANCE_ACCOUNT = EPOSVAL.SALES_AMT * -1 - $scope.$parent.CASHUP.ACCOUNT_TOTAL * -1;
                //        Flag_VACCOUNT = false;
                //    } else if (EPOSVAL.MEDIA.toUpperCase() == "DELIVERY") {
                //        $scope.$parent.CASHUP.VARIANCE_CHEQUE = EPOSVAL.SALES_AMT * -1 - $scope.$parent.CASHUP.TOTAL_CHEQUE * -1;
                //        Flag_VDELIVERY = false;
                //    } else if (EPOSVAL.MEDIA.toUpperCase() == "VOUCHER REDEEMED") {
                //        $scope.$parent.CASHUP.VARIANCE_REDEEMED = EPOSVAL.SALES_AMT * -1 - $scope.$parent.CASHUP.REDEEMED_TOTAL * -1;
                //        Flag_VVOUCHER_RED = false;
                //    } else if (EPOSVAL.MEDIA.toUpperCase() == "VOUCHER ISSUE") {
                //        $scope.$parent.CASHUP.VARIANCE_ISSUE = EPOSVAL.SALES_AMT * -1 - $scope.$parent.CASHUP.ISSUE_TOTAL * -1;
                //        Flag_VVOUCHER_ISSUE = false;
                //    } else if (EPOSVAL.MEDIA.toUpperCase() == 'DEPOSIT REDEEMED') {
                //        $scope.$parent.CASHUP.VARIANCE_DEPOSIT_REDEEMED = EPOSVAL.SALES_AMT * -1 - $scope.$parent.CASHUP.DEPOSIT_REDEEMED_TOTAL * -1;
                //        Flag_VDEPREDEEMED = false;
                //    }
                //    //else if (EPOSVAL.MEDIA.toUpperCase() == "DEPOSIT RECEIVED") {
                //    //    $scope.$parent.CASHUP.VARIANCE_DEPOSIT = EPOSVAL.SALES_AMT * -1 - $scope.$parent.CASHUP.DEPOSIT_TOTAL * -1;
                //    //    Flag_VDEPRECIVED = false;
                //    //} 

                //    //else if (EPOSVAL.MEDIA.toUpperCase() == "TRANSITORY") {
                //    //    $scope.$parent.CASHUP.VARIANCE_DEPOSIT_REDEEMED = EPOSVAL.SALES_AMT * -1 - $scope.$parent.CASHUP.DEPOSIT_REDEEMED_TOTAL * -1;
                //    //    Flag_VDEPREDEEMED = false;
                //    //}
                //})
                //if (Flag_VCASH) {
                //    $scope.$parent.CASHUP.VARIANCE_CASH = $scope.$parent.CASHUP.TOTAL_CASH;
                //}
                //if (Flag_VCARD) {
                //    $scope.$parent.CASHUP.VARIANCE_CARD = $scope.$parent.CASHUP.TOTAL_CARD;
                //}
                //if (Flag_VPETTYCASH) {
                //    $scope.$parent.CASHUP.VARIANCE_PETTY_CASH = $scope.$parent.CASHUP.TOTAL_TOTAL_VAL;
                //}
                //if (Flag_VACCOUNT) {
                //    $scope.$parent.CASHUP.VARIANCE_ACCOUNT = $scope.$parent.CASHUP.ACCOUNT_TOTAL;
                //}
                //if (Flag_VDELIVERY) {
                //    $scope.$parent.CASHUP.VARIANCE_CHEQUE = $scope.$parent.CASHUP.TOTAL_CHEQUE;
                //}
                //if (Flag_VVOUCHER_RED) {
                //    $scope.$parent.CASHUP.VARIANCE_REDEEMED = $scope.$parent.CASHUP.REDEEMED_TOTAL;
                //}
                //if (Flag_VVOUCHER_ISSUE) {
                //    $scope.$parent.CASHUP.VARIANCE_ISSUE = $scope.$parent.CASHUP.ISSUE_TOTAL;
                //}
                //if (Flag_VDEPREDEEMED) {
                //    $scope.$parent.CASHUP.VARIANCE_DEPOSIT_REDEEMED = $scope.$parent.CASHUP.DEPOSIT_REDEEMED_TOTAL;
                //}
                ////if (Flag_VDEPRECIVED) {
                ////    $scope.$parent.CASHUP.VARIANCE_DEPOSIT = $scope.$parent.CASHUP.DEPOSIT_TOTAL;
                ////}

                ////if ($scope.$parent.CASHUP.EPOS_HEADER_DATA.length > 0) {
                ////    if (parseInt($scope.$parent.CASHUP.EPOS_HEADER_DATA[0].GIFT_CERT_TOTAL) != 0) {
                ////        $scope.$parent.CASHUP.VARIANCE_ISSUE = parseInt($scope.$parent.CASHUP.EPOS_HEADER_DATA[0].GIFT_CERT_TOTAL) * -1 - $scope.$parent.CASHUP.ISSUE_TOTAL * -1;
                ////    } else {
                ////        $scope.$parent.CASHUP.VARIANCE_ISSUE = $scope.$parent.CASHUP.ISSUE_TOTAL;
                ////    }
                ////} else {
                ////    $scope.$parent.CASHUP.VARIANCE_ISSUE = $scope.$parent.CASHUP.ISSUE_TOTAL;
                ////}

                //$scope.$parent.CASHUP.REV_CASHUP_TOTAL = $scope.$parent.CASHUP.TOTAL_CASH + $scope.$parent.CASHUP.TOTAL_TOTAL_VAL + $scope.$parent.CASHUP.TOTAL_CHEQUE + $scope.$parent.CASHUP.TOTAL_CARD + $scope.$parent.CASHUP.REDEEMED_TOTAL + $scope.$parent.CASHUP.ACCOUNT_TOTAL + $scope.$parent.CASHUP.DEPOSIT_REDEEMED_TOTAL + $scope.$parent.CASHUP.ISSUE_TOTAL;

                //$scope.$parent.CASHUP.VARIANCE_TOTAL = (($scope.$parent.CASHUP.VARIANCE_CASH * -1) + ($scope.$parent.CASHUP.VARIANCE_CARD * -1) + ($scope.$parent.CASHUP.VARIANCE_REDEEMED * -1) + ($scope.$parent.CASHUP.VARIANCE_ACCOUNT * -1) + ($scope.$parent.CASHUP.VARIANCE_PETTY_CASH * -1) + ($scope.$parent.CASHUP.VARIANCE_DEPOSIT_REDEEMED * -1) + ($scope.$parent.CASHUP.VARIANCE_CHEQUE * -1) + ($scope.$parent.CASHUP.VARIANCE_ISSUE * -1)) * 1;

                if ($scope.KeyFlag) {
                    if ($scope.$parent.CASHUP.FG == "VIEW") {
                        $location.path("Reviews_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                    } else if ($scope.$parent.CASHUP.FG == null) {
                        $location.path("Reviews").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                    }
                }
            }
            $scope.$parent.$parent.overlay_loading_coffee = 'none';
        });
    };

    $scope.EPOS_ACCOUNT_GROUPS_DATA = [];
    $scope.GET_EPOS_DATA = function () {

        var CashupModelObj = new Object();
        CashupModelObj.ID = $scope.$parent.CASHUP.ID;
        CashupModelObj.INTEGRATION_SYSTEM_ID = $scope.$parent.CASHUP.INTEGRATION_SYSTEM_ID;

        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_EPOS_DATA').then(function (data) {

            if (data != undefined && data.data != undefined && data.data.length > 0) {
                $scope.EPOS_ACCOUNT_GROUPS_DATA = data.data;
                $scope.stop();
            }
            else {
                $scope.EPOS_ACCOUNT_GROUPS_DATA = [];

            }
        });
    };
    $scope.GET_EPOS_DATA1 = function () {

        var CashupModelObj = new Object();
        CashupModelObj.ID = $scope.$parent.CASHUP.ID;
        CashupModelObj.INTEGRATION_SYSTEM_ID = $scope.$parent.CASHUP.INTEGRATION_SYSTEM_ID;

        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_EPOS_DATA').then(function (data) {

            if (data != undefined && data.data != undefined && data.data.length > 0) {
                $scope.EPOS_ACCOUNT_GROUPS_DATA = data.data;
                $scope.stop();
            }
            else {
                $scope.EPOS_ACCOUNT_GROUPS_DATA = [];

            }
        });
    };
    $scope.RESET_CASHUP_HEADER = function (SESSION, index) {

        if (confirm('Are you sure you want to reset the Session Data?')) {
            var CashupModelObj = new Object();
            CashupModelObj.ID = SESSION.CASHUP_HEADER_ID;
            PrcCommMethods.CASHUP_API(CashupModelObj, 'RESET_CASHUP_HEADER').then(function (data) {

                var SESSION = data.data[0];
                // $scope.SessionList[index] = data.data[0];
                angular.forEach($scope.SessionList, function (sess) {
                    if (sess.SESSION_MAPPING_ID == SESSION.SESSION_MAPPING_ID) {
                        sess.SELECTED = false;
                        document.getElementById("SessionRadio" + sess.SESSION_MAPPING_ID).checked = false;
                    }
                });
                $scope.$parent.CASHUP.COMPLETED_GROUP_ID = null;
                $scope.$parent.CASHUP.ACTUAL_STEP_NO = '1';
                angular.forEach($scope.SessionList, function (sessn) {
                    if (sessn.STATUS_ID == 2 && sessn.SESSION_MASTER_ID == '4') {
                        $scope.$parent.CASHUP.COMPLETED_GROUP_ID = sessn.GROUP_ID;
                    }
                });
                $scope.$parent.CASHUP.SESSION = null;
                $scope.$parent.CASHUP.INTEGRATION_SYSTEM_ID = 0;
                $scope.$parent.CASHUP.CARD_NOTES = null;
                $scope.$parent.CASHUP.FLOAT_NOTES = null;
                $scope.$parent.CASHUP.CASH_NOTES = null;
                $scope.$parent.CASHUP.COMP_NOTES = null;
                $scope.$parent.CASHUP.PCASH_NOTES = null;
                $scope.$parent.CASHUP.REV_NOTES = null;
                $scope.$parent.CASHUP.ACC_CUSTOMER_RED_LIST = null;

                // $scope.$parent.CASHUP.ACCOUNT_RECEIVED_TOTAL = null;
                $scope.$parent.CASHUP.UPL_ID = 0;
                $scope.GET_MASTERDATA_FOR_CASHUP();
                $scope.$parent.CASHUP.ACCOUNT_RECEIVED_TOTAL = 0;
            });
        }
    };
    $scope.EPOS_REFRESH_HOMESTEAD = function () {

        if (confirm('Are you sure you want to Refresh EPOS Data?')) {

            $scope.$parent.$parent.overlay_loading_coffee = 'block';
            var CashupModelObj = new Object();
            CashupModelObj.CASHUP_MAIN_ID = $scope.$parent.CASHUP.CASHUP_MAIN_ID;
            CashupModelObj.BRANCH_ID = $scope.$parent.CashUp_Main_BRANCH_ID;
            CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
            CashupModelObj.CASHUP_DATE = $scope.$parent.CASHUP.CASHUP_DATE;
            CashupModelObj.INTEGRATION_URL = $scope.$parent.CASHUP.INTEGRATION_URL;
            CashupModelObj.ACCESS_TOKEN = $scope.$parent.CASHUP.ACCESS_TOKEN;
            PrcCommMethods.CASHUP_API(CashupModelObj, 'EPOS_REFRESH_HOMESTEAD').then(function (data) {
                //  $scope.GET_EPOS_HEADER1();
                $scope.GET_CASHUP_CATEGORY_BIFURCATION1();
                $scope.GET_EPOS_DATA1();
                $scope.GET_REVENUE_CENTERS1();
                $scope.$parent.$parent.overlay_loading_coffee = 'none';
            });
        }

    };

    $scope.uploadFile_CSV = function () {
        if ($scope.$parent.CASHUP.INTEGRATION_SYSTEM_ID == 0) {
            $scope.fileDataObj = readFileData.processData($scope.imagesrc[0].Src, ',');
            delete $scope.fileDataObj[0];
            var someStr = 'He said "Hello, my name is Foo"';
            console.log(someStr.replace(/['"]+/g, ''));
            // delete $scope.fileDataObj[1];
            //$scope.fileDataObj = $scope.fileDataObj.splice(0, 1);
            //$scope.fileDataObj = $scope.fileDataObj.splice(1, 1);
            //$scope.fileData = JSON.stringify($scope.fileDataObj);
            $scope.DataTable = [];
            var count = 0;
            angular.forEach($scope.fileDataObj, function (value, index) {
                var array = value[0].split(';');

                if (array[0].replace(/['"]+/g, '') == 'Payment methods') {
                    count++;
                }
                if (array[0] != "" && array[0] != 'Payment methods' && count == 0) {
                    var EPObj = {
                        'Accounting groups': array[0].replace(/['"]+/g, ''),
                        'Quantity': parseFloat(array[1].replace(/['"]+/g, '')),
                        'Total': parseFloat(array[2].replace(/['"]+/g, '')),
                        'Discounts': parseFloat(array[3].replace(/['"]+/g, '')),
                        'Total with tax Less discounts': parseFloat(array[4].replace(/['"]+/g, '')),
                        'Amount charged': parseFloat(array[5].replace(/['"]+/g, '')),
                        'Service charge 12.5%': parseFloat(array[6].replace(/['"]+/g, '')),
                        'Amount taxed': parseFloat(array[7].replace(/['"]+/g, '')),
                        'VAT 5%': parseFloat(array[8].replace(/['"]+/g, '')),
                        'Amount taxed': parseFloat(array[9].replace(/['"]+/g, '')),
                        'VAT 20%': parseFloat(array[10].replace(/['"]+/g, '')),
                        'Amount taxed': parseFloat(array[11].replace(/['"]+/g, '')),
                        'Tax Exempt': parseFloat(array[12].replace(/['"]+/g, '')),
                        'Total taxes': parseFloat(array[13].replace(/['"]+/g, '')),
                        '%': parseFloat(array[14].replace(/['"]+/g, '')),
                        'Total without tax': parseFloat(array[15].replace(/['"]+/g, ''))
                    }
                    $scope.DataTable.push(EPObj);
                }
                else if (array[0] != "" && count != 0) {
                    var EPObj = {
                        'Accounting groups': array[0].replace(/['"]+/g, ''),
                        'Quantity': parseFloat(array[1].replace(/['"]+/g, '')),
                        'Total': 0,
                        'Discounts': 0,
                        'Total with tax Less discounts': 0,
                        'Amount charged': 0,
                        'Service charge 12.5%': 0,
                        'Amount taxed': 0,
                        'VAT 5%': 0,
                        'Amount taxed': 0,
                        'VAT 20%': 0,
                        'Amount taxed': 0,
                        'Tax Exempt': 0,
                        'Total taxes': 0,
                        '%': 0,
                        'Total without tax': 0
                    }
                    $scope.DataTable.push(EPObj);
                }
            });
            var fileUpload = document.getElementById("ngexcelfile");
            $scope.uploadFilesx(1, 0, 0, $scope.DataTable, fileUpload.value);
        }
        else if ($scope.$parent.CASHUP.INTEGRATION_SYSTEM_ID == 12) {

            var rows = $scope.imagesrc[0].Src.split("\r\n");
            $scope.DataTable = [];
            if (rows.length > 0) {
                var count = 0;
                for (var i = 3; i < rows.length; i++) {
                    var array = splitComponentsByComma(rows[i]);
                    if (array.length > 1 && array[0] !== "") {
                        count++;
                        if (array[0] != "" && count == 1) {
                            var EPObj = {
                                'Description': array[0].replace(/['"]+/g, ''),
                                'Units': (array[1].replace(/['"]+/g, '')),
                                'Gross': (array[2].replace(/['"]+/g, '')),
                                'Disc/Cpn': (array[3].replace(/['"]+/g, '')),
                                'VAT Tax': (array[4].replace(/['"]+/g, '')),
                                'Net': array[5].replace(/['"]+/g, '') == undefined || array[5].replace(/['"]+/g, '') == '' || array[5].replace(/['"]+/g, '') == null ? 0 : (array[5].replace(/['"]+/g, '')),
                                '% Total': (array[6].replace(/['"]+/g, '')),
                                'H': array[7] == undefined ? '' : (array[7].replace(/['"]+/g, '')),
                            }
                            $scope.DataTable.push(EPObj);
                        }

                        else if (array[0] != "" && count != 1) {
                            var EPObj = {
                                'Description': array[0].replace(/['"]+/g, ''),
                                'Units': (array[1].replace(/['"]+/g, '')),
                                'Gross': (array[2].replace(/['"]+/g, '')),
                                'Disc/Cpn': (array[3].replace(/['"]+/g, '')),
                                'VAT Tax': (array[4].replace(/['"]+/g, '')),
                                'Net': array[5].replace(/['"]+/g, '') == undefined || array[5].replace(/['"]+/g, '') == '' || array[5].replace(/['"]+/g, '') == null ? 0 : (array[5].replace(/['"]+/g, '')),
                                '% Total': (array[6].replace(/['"]+/g, '')),
                                'H': array[7] == undefined ? '' : (array[7].replace(/['"]+/g, '')),
                            }
                            $scope.DataTable.push(EPObj);
                        }
                    }
                }
                var array = splitComponentsByComma(rows[2]);
                var EPObj = {
                    'Description': 'Start_Date',
                    'Units': array[1].split('From')[1].split('to')[0],
                    'Gross': array[1].split('From')[1].split('to')[1].split('to')[0].split(',')[0],
                    'Disc/Cpn': "",
                    'VAT Tax': "",
                    'Net': "",
                    '% Total': "",
                    'H': "",
                };
                $scope.DataTable.push(EPObj);
                // $scope.uploadFilesx(1, 0, 0, $scope.DataTable, fileUpload.value);
                var fileUpload = document.getElementById("ngexcelfile");
                $scope.uploadFilesx(1, 0, 0, $scope.DataTable, fileUpload.value);

            }
            else {
                $scope.$parent.ShowAlert("Warning", "no record found", 30000);
            }
        }
        else if ($scope.$parent.CASHUP.INTEGRATION_SYSTEM_ID == 11) {
            var rows = $scope.imagesrc[0].Src.split("\r\n");
            $scope.DataTable = [];
            if (rows.length > 0) {
                var count = 0;
                for (var i = 3; i < rows.length; i++) {
                    var array = splitComponentsByComma(rows[i]);
                    if (array.length > 1 && array[0] !== "") {
                        count++;
                        if (array[0] != "" && count == 1) {
                            var EPObj = {
                                'Description': array[0].replace(/['"]+/g, ''),
                                'Units': (array[1].replace(/['"]+/g, '')),
                                'Gross': (array[2].replace(/['"]+/g, '')),
                                'Disc/Cpn': (array[3].replace(/['"]+/g, '')),
                                'VAT Tax': (array[4].replace(/['"]+/g, '')),
                                'Net': array[5].replace(/['"]+/g, '') == undefined || array[5].replace(/['"]+/g, '') == '' || array[5].replace(/['"]+/g, '') == null ? 0 : (array[5].replace(/['"]+/g, '')),
                                '% Total': (array[6].replace(/['"]+/g, '')),
                                'H': array[7] == undefined ? '' : (array[7].replace(/['"]+/g, '')),
                            }
                            $scope.DataTable.push(EPObj);
                        }

                        else if (array[0] != "" && count != 1) {
                            var EPObj = {
                                'Description': array[0].replace(/['"]+/g, ''),
                                'Units': (array[1].replace(/['"]+/g, '')),
                                'Gross': (array[2].replace(/['"]+/g, '')),
                                'Disc/Cpn': (array[3].replace(/['"]+/g, '')),
                                'VAT Tax': (array[4].replace(/['"]+/g, '')),
                                'Net': array[5].replace(/['"]+/g, '') == undefined || array[5].replace(/['"]+/g, '') == '' || array[5].replace(/['"]+/g, '') == null ? 0 : (array[5].replace(/['"]+/g, '')),
                                '% Total': (array[6].replace(/['"]+/g, '')),
                                'H': array[7] == undefined ? '' : (array[7].replace(/['"]+/g, '')),
                            }
                            $scope.DataTable.push(EPObj);
                        }
                    }
                }
                // $scope.uploadFilesx(1, 0, 0, $scope.DataTable, fileUpload.value);
                var fileUpload = document.getElementById("ngexcelfile");
                $scope.uploadFilesx(1, 0, 0, $scope.DataTable, fileUpload.value);

            }
            else {
                $scope.$parent.ShowAlert("Warning", "no record found", 30000);
            }
        }
        else if ($scope.$parent.CASHUP.INTEGRATION_SYSTEM_ID == 17) {
            var rows = $scope.imagesrc[0].Src.split("\r\n");
            $scope.DataTable = [];
            if (rows.length > 0) {
                var count = 0;
                for (var i = 1; i < rows.length; i++) {
                    var array = splitComponentsByComma(rows[i]);
                    if (array.length > 1 && array[0] !== "") {
                        count++;
                        console.log(i);
                        //if (array[0] != "" && count == 1) {
                        //    var EPObj = {
                        //        'Description': array[0].replace(/['"]+/g, ''),
                        //        'Units': (array[1].replace(/['"]+/g, '')),
                        //        'Gross': (array[2].replace(/['"]+/g, '')),
                        //        'Disc/Cpn': (array[3].replace(/['"]+/g, '')),
                        //        'VAT Tax': (array[4].replace(/['"]+/g, '')),
                        //        'Net': array[5].replace(/['"]+/g, '') == undefined || array[5].replace(/['"]+/g, '') == '' || array[5].replace(/['"]+/g, '') == null ? 0 : (array[5].replace(/['"]+/g, '')),
                        //        //'% Total': (array[6].replace(/['"]+/g, '')),
                        //'H': array[7] == undefined ? '' : (array[7].replace(/['"]+/g, '')),
                        //    }
                        //    $scope.DataTable.push(EPObj);
                        //}

                        //else if (array[0] != "" && count != 1) {
                        var EPObj = {
                            'Description': array[0].replace(/['"]+/g, ''),
                            'Units': (array[2].replace(/['"]+/g, '')),
                            'Gross': (array[4].replace(/['"]+/g, '')),
                            'Disc/Cpn': (array[3].replace(/['"]+/g, '')),
                            'VAT Tax': (array[4].replace(/['"]+/g, '')),
                            'Net': array[5] == undefined ? 0 : (array[5].replace(/['"]+/g, '')),
                            '% Total': (array[3].replace(/['"]+/g, '')),
                            'H': array[1] == undefined ? '' : (array[1].replace(/['"]+/g, '')),
                        }
                        $scope.DataTable.push(EPObj);
                        //}
                    }
                }
                // $scope.uploadFilesx(1, 0, 0, $scope.DataTable, fileUpload.value);
                var fileUpload = document.getElementById("ngexcelfile");
                $scope.uploadFilesx(1, 0, 0, $scope.DataTable, fileUpload.value);

            }
            else {
                $scope.$parent.ShowAlert("Warning", "no record found", 30000);
            }
        }

    };
    $scope.ShowWait = false;
    $scope.EPOS_REFRESH_SQUIRREL = function () {

        var CashupModelObj = new Object();
        CashupModelObj.CASHUP_MAIN_ID = $scope.$parent.CASHUP.CASHUP_MAIN_ID;
        CashupModelObj.INTEGRATION_STATUS = 0;
        PrcCommMethods.CASHUP_API(CashupModelObj, 'UPD_CASHUP_MAIN_FOR_INTEGRATION').then(function (data) {
            if (data.data == 1) {
                $scope.ShowWait = true;
            }
            $scope.start();
        });
    };

    $scope.EPOS_REFRESH = function (INTEGRATION_STATUS) {
        if (confirm('Are you sure you want to Refresh EPOS Data?')) {
            $scope.$parent.$parent.overlay_loading_coffee = 'block';

            var CashupModelObj = new Object();
            CashupModelObj.CASHUP_MAIN_ID = $scope.$parent.CASHUP.CASHUP_MAIN_ID;
            CashupModelObj.INTEGRATION_STATUS = INTEGRATION_STATUS;
            CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
            CashupModelObj.SYNC_SOURCE = 2; //1 Auto Sync, 2 Web App, 3 Monitoring, 4 DB
            PrcCommMethods.CASHUP_API(CashupModelObj, 'UPD_CASHUP_MAIN_FOR_INTEGRATION').then(function (data) {
                if (data.data == 1) {
                    $scope.ShowWait = true;
                }
                $scope.start();


            });
        }
    };

    var promise;
    $scope.countx = 0;
    $scope.start = function () {
        // stops any running interval to avoid two intervals running at the same time
        // store the interval promise
        promise = $interval(setRandomizedCollection, 3000);
    };
    // stops the interval
    $scope.stop = function () {
        $interval.cancel(promise);
    };
    function setRandomizedCollection() {

        // items to randomize 1 - 11
        $scope.GET_CASHUP_CATEGORY_BIFURCATION1();
        //  $scope.GET_EPOS_HEADER1();
        $scope.GET_EPOS_DATA1();
        $scope.$parent.$parent.overlay_loading_coffee = 'none';
        //$scope.countx = $scope.countx + 1;
        //if ($scope.countx > 5) {

        //  //  alert($scope.countx);
        //}
    }

    $scope.ReadExcelData = function () {
        if (document.getElementById("ngexcelfile").value != '') {
            if ($scope.$parent.CASHUP.ID != 0) {
                $scope.Uploading = true;
                var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xlsx|.xls)$/;
                var fileUpload = document.getElementById("ngexcelfile");
                if (fileUpload.value.toLowerCase().indexOf('.xls') != -1 || fileUpload.value.toLowerCase().indexOf('.xlsx') != -1) {
                    /*Checks whether the file is a valid excel file*/
                    if (true) {
                        var xlsxflag = false; /*Flag for checking whether excel is .xls format or .xlsx format*/
                        if ($("#ngexcelfile").val().toLowerCase().indexOf(".xlsx") > 0) {
                            xlsxflag = true;
                        }
                        /*Checks whether the browser supports HTML5*/
                        if (typeof (FileReader) != "undefined") {
                            var reader = new FileReader();
                            reader.onload = function (e) {
                                var data = e.target.result;
                                /*Converts the excel data in to object*/
                                if ($scope.$parent.CASHUP.INTEGRATION_SYSTEM_ID == 37) {
                                    if (xlsxflag) {
                                        //var workbook = XLSX.read(data, { type: 'binary' });
                                        var workbook = XLSX.read(data, { type: 'array' });
                                    }
                                    else {
                                        var workbook = XLS.read(data, { type: 'array' });
                                    }
                                }
                                else {
                                    if (xlsxflag) {
                                        //var workbook = XLSX.read(data, { type: 'binary' });
                                        var workbook = XLSX.read(data, { type: 'binary' });
                                    }
                                    else {
                                        var workbook = XLS.read(data, { type: 'binary' });
                                    }
                                }

                                /*Gets all the sheetnames of excel in to a variable*/
                                var sheet_name_list = workbook.SheetNames;
                                var cnt = 0; /*This is used for restricting the script to consider only first sheet of excel*/
                                sheet_name_list.forEach(function (y) { /*Iterate through all sheets*/
                                    /*Convert the cell value to Json*/
                                    if (xlsxflag) {
                                        var worksheet = workbook.Sheets[y];
                                        if ($scope.$parent.CASHUP.INTEGRATION_SYSTEM_ID == 37) {
                                            delete worksheet.A2;
                                            delete worksheet.A3;
                                            delete worksheet.A4;
                                            delete worksheet.A5;
                                            worksheet["!ref"] = "A5:H165";
                                        }
                                        else {
                                            delete worksheet.A2;
                                            delete worksheet.A3;
                                            worksheet["!ref"] = "A4:H165";
                                        }
                                        //for (z in worksheet) {
                                        //    /* all keys that do not begin with "!" correspond to cell addresses */
                                        //    if(z[0] === '!' || z[0]==="A1" || z[0]==="A2"){
                                        //    }
                                        //    else{
                                        //        console.log(y + "!" + z + "=" + JSON.stringify(worksheet[z].v));
                                        //    }
                                        //}
                                        var exceljson = XLSX.utils.sheet_to_row_object_array(worksheet);
                                    }
                                    else {
                                        var exceljson = XLS.utils.sheet_to_row_object_array(workbook.Sheets[y]);
                                    }
                                    if (exceljson.length > 0) {
                                        if (exceljson.length > 0) {
                                            //for (var i = 0; i < exceljson.length; i++) {
                                            //    var FAV_FOLDER_UPD_Obj = new Object();
                                            //    FAV_FOLDER_UPD_Obj.PRODUCT_SKU = exceljson[i].PRODUCT_SKU;
                                            //    FAV_FOLDER_UPD_Obj.QUANTITY = exceljson[i].QUANTITY;
                                            //    $scope.RFQ_RESPONSE_UPDATE_LIST_Obj[i] = FAV_FOLDER_UPD_Obj;
                                            //}
                                            $scope.uploadFilesx(1, 0, 0, exceljson, fileUpload.value);
                                        }
                                        else {
                                            alert("Please enter the data in excel file");
                                        }
                                    }
                                });
                            }
                            if (xlsxflag) {/*If excel file is .xlsx extension than creates a Array Buffer from excel*/
                                reader.readAsArrayBuffer($("#ngexcelfile")[0].files[0]);
                            }
                            else {
                                reader.readAsBinaryString($("#ngexcelfile")[0].files[0]);
                            }
                        }
                        else {
                            alert("Sorry! Your browser does not support HTML5!");
                        }
                    }
                    else {
                        alert("Please upload a valid Excel file1!");
                    }
                }
                else if (fileUpload.value.toLowerCase().indexOf('.csv')) {
                    $scope.uploadFile_CSV();
                }
                else {
                    alert("Please upload a valid Excel file.");
                }
            }
            else {
                $scope.Uploading = false;
                alert('Please select a Session.');

            }
        }
        else {
            alert("Please select a file to upload.");
        }
    };
    $scope.ReadExcelData_Micros = function () {
        if (document.getElementById("ngexcelfile").value != '') {
            if ($scope.$parent.CASHUP.ID != 0) {
                $scope.Uploading = true;
                var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xlsx|.xls)$/;
                var fileUpload = document.getElementById("ngexcelfile");
                if (fileUpload.value.toLowerCase().indexOf('.xls') != -1 || fileUpload.value.toLowerCase().indexOf('.xlsx') != -1) {
                    /*Checks whether the file is a valid excel file*/
                    if (true) {
                        var xlsxflag = false; /*Flag for checking whether excel is .xls format or .xlsx format*/
                        if ($("#ngexcelfile").val().toLowerCase().indexOf(".xlsx") > 0) {
                            xlsxflag = true;
                        }
                        /*Checks whether the browser supports HTML5*/
                        if (typeof (FileReader) != "undefined") {
                            var reader = new FileReader();
                            reader.onload = function (e) {

                                var data = e.target.result;
                                /*Converts the excel data in to object*/
                                if (xlsxflag) {
                                    //var workbook = XLSX.read(data, { type: 'binary' });

                                    var workbook = XLSX.read(data, { type: 'array' });
                                }
                                else {
                                    var workbook = XLS.read(data, { type: 'binary' });
                                }
                                /*Gets all the sheetnames of excel in to a variable*/
                                var sheet_name_list = workbook.SheetNames;
                                var cnt = 0; /*This is used for restricting the script to consider only first sheet of excel*/
                                sheet_name_list.forEach(function (y) { /*Iterate through all sheets*/
                                    /*Convert the cell value to Json*/
                                    if (xlsxflag) {
                                        var worksheet = workbook.Sheets[y];
                                        delete worksheet.A0;
                                        worksheet.A1.v = 'T';
                                        worksheet.A1.r = 'T';
                                        worksheet.A1.h = 'T';
                                        worksheet.A1.w = 'T';
                                        var exceljson = XLSX.utils.sheet_to_row_object_array(worksheet);
                                    }
                                    else {
                                        var exceljson = XLS.utils.sheet_to_row_object_array(workbook.Sheets[y]);
                                    }
                                    if (exceljson.length > 0) {
                                        if (exceljson.length > 0) {
                                            $scope.MICROS_DATA_HEADER(1, 0, 0, '', exceljson, fileUpload.value);
                                            //$scope.uploadFilesx(1, 0, 0, exceljson, fileUpload.value);
                                        }
                                        else {
                                            alert("Please enter the data in excel file");
                                        }
                                    }
                                });
                            }
                            if (xlsxflag) {/*If excel file is .xlsx extension than creates a Array Buffer from excel*/
                                reader.readAsArrayBuffer($("#ngexcelfile")[0].files[0]);
                            }
                            else {
                                reader.readAsBinaryString($("#ngexcelfile")[0].files[0]);
                            }
                        }
                        else {
                            alert("Sorry! Your browser does not support HTML5!");
                        }
                    }
                    else {
                        alert("Please upload a valid Excel file1!");
                    }
                }

                else {
                    alert("Please upload a valid Excel file.");
                }
            }
            else {
                $scope.Uploading = false;
                alert('Please select a Session.');
            }
        }
        else {
            alert("Please select a file to upload.");
        }
    };


    $scope.DELETE_UPLOAD = function () {
        if (confirm('Are you sure you want to delete the EPOS file?')) {
            var CashupModelObj = new Object();
            CashupModelObj.ID = $scope.$parent.CASHUP.UPL_ID;
            PrcCommMethods.CASHUP_API(CashupModelObj, 'DELETE_UPLOAD').then(function (data) {
                $scope.$parent.CASHUP.UPL_ID = 0;
            });
        }

    };
    function splitComponentsByComma(str) {
        //var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
        //var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
        var ret = [];
        var arr = str.match(/(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,"\s\\]*(?:\s+[^,"\s\\]+)*))\s*(?:,|$)/g); //(/(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g);
        for (let i in arr) {
            let element = arr[i];
            if ('"' === element[0]) {
                element = element.substr(1, element.length - 2);
            } else {
                element = arr[i].replace(/,/g, '').trim();
            }
            ret.push(element);
        }
        return ret;
    }
    $scope.GET_ACCOUNT_GROUP_DETAILS = function (EPOS_ACCOUNT_GROUP_DATA) {
        var CashupModelObj = new Object();
        CashupModelObj.ID = $scope.$parent.CASHUP.ID;
        CashupModelObj.PRODUCT_IDS = EPOS_ACCOUNT_GROUP_DATA.PRODUCT_ID;
        CashupModelObj.INTEGRATION_SYSTEM_ID = $scope.$parent.CASHUP.INTEGRATION_SYSTEM_ID;
        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_ACCOUNT_GROUP_DETAILS').then(function (data) {
            if (data != undefined && data.data != undefined && data.data.length > 0) {
                EPOS_ACCOUNT_GROUP_DATA.EPOS_ACCOUNT_GROUP_DETAILS = data.data;
                EPOS_ACCOUNT_GROUP_DATA.SHOWDETAILS = !EPOS_ACCOUNT_GROUP_DATA.SHOWDETAILS;
            }
            else {
                EPOS_ACCOUNT_GROUP_DATA.EPOS_ACCOUNT_GROUP_DETAILS = [];
                EPOS_ACCOUNT_GROUP_DATA.SHOWDETAILS = !EPOS_ACCOUNT_GROUP_DATA.SHOWDETAILS;
            }
        });
    };
    $scope.uploadFilesx = function (Attachment_UPLOAD_TYPE_ID, var1, var2, exceljson, filename, FLAG) {
        if (($scope.Files != undefined && $scope.Files.length > 0)) {
            $scope.DocImageResult = [];
            var data = new FormData();
            data.append("CASHUP_HEADER_ID", $scope.$parent.CASHUP.ID);
            data.append("UPLOAD_TYPE_ID", Attachment_UPLOAD_TYPE_ID);
            data.append("VIRTUALPATH", parseInt($cookies.get("ENTITY_ID")) + '/' + Attachment_UPLOAD_TYPE_ID + '/' + $scope.$parent.CASHUP.INTEGRATION_SYSTEM_ID + '/');
            data.append("UPLOAD_ID", 0);
            data.append("USER_ID", parseInt($cookies.get("USERID")));
            data.append("TABLE", JSON.stringify(exceljson));
            data.append("ORIGINAL_FILE_NAME", filename);
            //data.append("USER_ID", ($cookies.get("USERID")));
            for (var i in $scope.Files) {
                data.append("uploadedFile", $scope.Files[i]);
            }

            var request = {
                method: 'POST',
                url: CommService.Get_CASHUP_API() + "api/CashupAPI/UPLOADFILES",
                data: data,
                headers: {
                    'Content-Type': undefined
                }
            };
            $http(request).then(function (d) {

                $scope.UploadedFiles = d.data;
                if ($scope.$parent.CASHUP.INTEGRATION_SYSTEM_ID == 0) {
                    FLAG == 1 ? $scope.DECLARATION_DETAILS_UPLOAD_FLAG = true : '';
                    FLAG == 2 ? $scope.PAYMENT_DETAILS_UPLOAD_FLAG = true : '';
                    FLAG == 3 ? $scope.DEPARTMENT_DETAILS_UPLOAD_FLAG = true : '';
                    if ($scope.DEPARTMENT_DETAILS_UPLOAD_FLAG && $scope.PAYMENT_DETAILS_UPLOAD_FLAG && $scope.DECLARATION_DETAILS_UPLOAD_FLAG) {
                        var CashupModelObj = new Object();
                        CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
                        CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
                        CashupModelObj.CASHUP_HEADER_ID = $scope.$parent.CASHUP.ID;//23//24
                        CashupModelObj.SESSION_ID = $scope.$parent.CASHUP.SESSION_ID; // $scope.SESSION_ID;              
                        CashupModelObj.DECLARATION_DETAILS = $scope.DECLARATION_DETAILS;
                        CashupModelObj.PAYMENT_DETAILS = $scope.PAYMENT_DETAILS;
                        CashupModelObj.SQUIRREL_INTEGRATION_DATA = $scope.DEPARTMENT_DETAILS;
                        PrcCommMethods.CASHUP_API(CashupModelObj, "EPOS_FILE_UPLOAD_ITEMSALES_SQUIRREL").then(function (data) {
                            $scope.Uploading = false;
                            //alert('File Uploaded Succesfully');
                            $scope.$parent.ShowAlert('Success', 'File Uploaded Succesfully', 2000);

                            $scope.ItemSalesFileValid = true;
                            $scope.PaymentsFileValid = true;
                            $scope.DepartmentFileValid = true;

                            $scope.DECLARATION_DETAILS_UPLOAD_FLAG = false;
                            $scope.PAYMENT_DETAILS_UPLOAD_FLAG = false;
                            $scope.DEPARTMENT_DETAILS_UPLOAD_FLAG = false;

                            angular.element("input[id='ngexcelfile_Deartments_Squirrel']").val(null);
                            angular.element("input[id='ngexcelfile_Payments_Squirrel']").val(null);
                            angular.element("input[id='ngexcelfile_ItemSales_Squirrel']").val(null);

                        });
                    }
                }
                if ($scope.$parent.CASHUP.INTEGRATION_SYSTEM_ID == 12) {
                    var CashupModelObj = new Object();
                    CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
                    CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
                    CashupModelObj.CASHUP_HEADER_ID = $scope.$parent.CASHUP.ID;
                    CashupModelObj.INTEGRATION_SYSTEM_ID = $scope.$parent.CASHUP.INTEGRATION_SYSTEM_ID;
                    CashupModelObj.SESSION_ID = $scope.$parent.CASHUP.SESSION_ID;;
                    CashupModelObj.UPLOADED_JSON_ARRAY = JSON.stringify(exceljson);
                    CashupModelObj.BRANCH_ID = $scope.$parent.CASHUP.BRANCH_ID;
                    CashupModelObj.CASHUP_MAIN_ID = parseInt($scope.$parent.CASHUP.CASHUP_MAIN_ID);
                    PrcCommMethods.CASHUP_API(CashupModelObj, "EPOS_FILE_UPLOAD_ALINES").then(function (data) {
                        if (data.data == null) {
                            $scope.$parent.ShowAlert('Warning', "We found some changes in file, please validate uploaded file with support team", 30000);
                        }
                        else {
                            $scope.Uploading = false;
                            $scope.$parent.ShowAlert('Success', 'File Uploaded Succesfully', 2000);
                            $scope.SELECT_SESSION($scope.$parent.CASHUP.SESSION, $scope.$parent.CASHUP.INDEX);
                        }
                    });
                }
                if ($scope.$parent.CASHUP.INTEGRATION_SYSTEM_ID == 15) {
                    var CashupModelObj = new Object();
                    CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
                    CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
                    CashupModelObj.CASHUP_HEADER_ID = $scope.$parent.CASHUP.ID;
                    CashupModelObj.INTEGRATION_SYSTEM_ID = $scope.$parent.CASHUP.INTEGRATION_SYSTEM_ID;
                    CashupModelObj.SESSION_ID = $scope.$parent.CASHUP.SESSION_ID;;
                    CashupModelObj.UPLOADED_JSON_ARRAY = JSON.stringify(exceljson);
                    CashupModelObj.BRANCH_ID = $scope.$parent.CASHUP.BRANCH_ID;
                    CashupModelObj.CASHUP_MAIN_ID = parseInt($scope.$parent.CASHUP.CASHUP_MAIN_ID);
                    PrcCommMethods.CASHUP_API(CashupModelObj, "EPOS_FILE_UPLOAD_MICROS").then(function (data) {
                        if (data.data == null) {
                            $scope.$parent.ShowAlert('Warning', "We found some changes in file, please validate uploaded file with support team", 30000);
                        }
                        else {
                            $scope.Uploading = false;
                            $scope.$parent.ShowAlert('Success', 'File Uploaded Succesfully', 2000);
                            $scope.SELECT_SESSION($scope.$parent.CASHUP.SESSION, $scope.$parent.CASHUP.INDEX);
                        }
                    });
                }
                if ($scope.$parent.CASHUP.INTEGRATION_SYSTEM_ID == 17) {
                    var CashupModelObj = new Object();
                    CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
                    CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
                    CashupModelObj.CASHUP_HEADER_ID = $scope.$parent.CASHUP.ID;
                    CashupModelObj.INTEGRATION_SYSTEM_ID = $scope.$parent.CASHUP.INTEGRATION_SYSTEM_ID;
                    CashupModelObj.SESSION_ID = $scope.$parent.CASHUP.SESSION_ID;;
                    CashupModelObj.UPLOADED_JSON_ARRAY = JSON.stringify(exceljson);
                    PrcCommMethods.CASHUP_API(CashupModelObj, "EPOS_FILE_UPLOAD_BIZZON").then(function (data) {
                        if (data.data == null) {
                            $scope.$parent.ShowAlert('Warning', "We found some changes in file, please validate uploaded file with support team", 30000);
                        }
                        else {
                            $scope.Uploading = false;
                            $scope.$parent.ShowAlert('Success', 'File Uploaded Succesfully', 2000);
                            $scope.SELECT_SESSION($scope.$parent.CASHUP.SESSION, $scope.$parent.CASHUP.INDEX);
                        }
                    });
                }
                if ($scope.$parent.CASHUP.INTEGRATION_SYSTEM_ID == 37) {
                    var CashupModelObj = new Object();
                    CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
                    CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
                    CashupModelObj.CASHUP_HEADER_ID = $scope.$parent.CASHUP.ID;
                    CashupModelObj.INTEGRATION_SYSTEM_ID = $scope.$parent.CASHUP.INTEGRATION_SYSTEM_ID;
                    CashupModelObj.SESSION_ID = $scope.$parent.CASHUP.SESSION_ID;;
                    CashupModelObj.EPOS_SALES_START_DATE = $scope.$parent.CASHUP.SESSION.SESSION_START;
                    CashupModelObj.EPOS_SALES_END_DATE = $scope.$parent.CASHUP.SESSION.SESSION_END;
                    CashupModelObj.UPLOADED_JSON_ARRAY = JSON.stringify(exceljson);
                    CashupModelObj.CASHUP_MAIN_ID = parseInt($scope.$parent.CASHUP.CASHUP_MAIN_ID);
                    CashupModelObj.BRANCH_ID = $scope.$parent.CASHUP.BRANCH_ID;
                    PrcCommMethods.CASHUP_API(CashupModelObj, "EPOS_FILE_UPLOAD_COMMON").then(function (data) {
                        if (data.data == null) {
                            $scope.$parent.ShowAlert('Warning', "We found some changes in file, please validate uploaded file with support team", 30000);
                        }
                        else {
                            $scope.Uploading = false;
                            $scope.$parent.ShowAlert('Success', 'File Uploaded Succesfully', 2000);
                            $scope.SELECT_SESSION($scope.$parent.CASHUP.SESSION, $scope.$parent.CASHUP.INDEX);
                        }
                    });
                }
            });
        }

    };

    $scope.MICROS_DATA_HEADER = function (Attachment_UPLOAD_TYPE_ID, var1, var2, exceljson, filename) {

        $scope.DataList = [];
        $scope.H = [];
        $scope.P = []; $scope.P_Obj = [];
        $scope.L = []; $scope.L_Obj = [];
        $scope.D = [];
        $scope.CHKID = null;
        $scope.Revenue_Center = null;

        $scope.count = 0;
        $scope.H_Tax = 0;
        $scope.Returns = 0;
        $scope.Voids = 0;
        $scope.Mgr_Voids = 0;
        $scope.CashTipsDecl = 0;
        $scope.IndirectTips = 0;

        var HEADER = {
            'CHECK_ID': '',
            'CHECK_NO': '',
            'OPEN_TIME': '',
            'CLOSE_TIME': '',
            'COVERS': 0,
            'REVENUE_CENTRE_CODE': '',
            'REVENUE_CENTRE_DESC': '',
            'SERVE_MODE': 'Eat In',
            'NET': 0,
            'TAX': 0,
            'GROSS': 0,
            'DISCOUNT': 0,
            'COMP': 0,
            'VOID': 0,
            'TIPS': 0,
            'SERVICE_CHARGE': 0,
            'DONATION': 0,
            'CURRENCY': null,
            'IS_TRAINING': false,
            'INTEGRATION_SYSTEM_ID': 15,
            'STAFF_ID': null,
            'STAFF_NAME': null
        };

        $scope.H = exceljson.filter(p => p.T == 'Business Dates' || p.T == 'Dine In' || p.T == 'Revenue Centers' || p.T == 'Net Sales' || p.T == '+Tax Collected'
            || p.T == 'Total Discounts' || p.T == 'Returns' || p.T == 'Voids' || p.T == 'Mgr Voids' || p.T == '+Cash Tips Decl' || p.T == '+Indirect Tips' || p.T == '+Charge Tips');
        $scope.P = exceljson.filter(p => p.T == 'VISA' || p.T == 'MASTER CARD' || p.T == 'SPADES' || p.T == 'AMEX' || p.T == 'CASH' || p.T == 'PM' || p.T == 'QLUB' || p.T == 'CUSTOMER CREDIT'
            || p.T == 'DEPOSIT' || p.T == 'ADVANCE PAYMENT' || p.T == 'ADDMIND');
        $scope.L = exceljson.filter(p => p.T.toLowerCase() == 'Food'.toLowerCase() || p.T.toLowerCase() == 'Alc Beverage'.toLowerCase() || p.T.toLowerCase() == 'Alc Wine'.toLowerCase()
            || p.T.toLowerCase() == 'Non Alcoholic Beverage'.toLowerCase() || p.T.toLowerCase() == 'Tobacco'.toLowerCase() || p.T.toLowerCase() == 'Condiment'.toLowerCase()
            || p.T.toLowerCase() == 'BEVERAGE'.toLowerCase() || p.T.toLowerCase() == 'OTHER'.toLowerCase());

        //head
        angular.forEach($scope.H, function (item) {
            if ($scope.count == 0) {
                $scope.CHKID = parseInt(new Date(item.__EMPTY).getFullYear()).toString() + parseInt(new Date(item.__EMPTY).getMonth() + 1).toString() + parseInt(new Date(item.__EMPTY).getDay()).toString() + new Date().getHours().toString() + new Date().getMinutes().toString() + new Date().getSeconds().toString() + new Date().getMilliseconds().toString();
                HEADER["CHECK_ID"] = $scope.CHKID;
                HEADER["CHECK_NO"] = $scope.CHKID;
                HEADER["OPEN_TIME"] = item.__EMPTY;
                HEADER["CLOSE_TIME"] = item.__EMPTY;
                $scope.count += 1;
            }
            if (item.T.toLowerCase() == "Dine In".toLowerCase())
                HEADER["COVERS"] = parseFloat(item.__EMPTY_2.toString().replace(/[',]+/g, ''));
            if (item.T.toLowerCase() == "Revenue Centers".toLowerCase()) {
                HEADER["REVENUE_CENTRE_CODE"] = item.__EMPTY;
                $scope.Revenue_Center = item.__EMPTY;;
            }
            if (item.T.toLowerCase() == "Revenue Centers".toLowerCase())
                HEADER["REVENUE_CENTRE_DESC"] = item.__EMPTY;
            if (item.T.toLowerCase() == "Net Sales".toLowerCase())
                HEADER["NET"] = parseFloat(item.__EMPTY_1.toString().replace(/[',]+/g, ''));
            if (item.T.toLowerCase() == "+Tax Collected".toLowerCase()) {
                HEADER["TAX"] = parseFloat(item.__EMPTY_1.toString().replace(/[',]+/g, ''));
                $scope.H_Tax = parseFloat(item.__EMPTY_1.toString().replace(/[',]+/g, ''));
            }
            if (item.T.toLowerCase() == "Total Discounts".toLowerCase()) {
                HEADER["DISCOUNT"] = parseFloat(item.__EMPTY_1.toString().replace(/[',]+/g, ''));
                $scope.Discount = parseFloat(item.__EMPTY_1.toString().replace(/[',]+/g, ''));
            }
            if (item.T.toLowerCase() == "Returns".toLowerCase())
                $scope.Returns = parseFloat(item.__EMPTY_1.toString().replace(/[',]+/g, ''));
            if (item.T.toLowerCase() == "Voids".toLowerCase())
                $scope.Voids = parseFloat(item.__EMPTY_1.toString().replace(/[',]+/g, ''));
            if (item.T.toLowerCase() == "Mgr Voids".toLowerCase())
                $scope.Mgr_Voids = parseFloat(item.__EMPTY_1.toString().replace(/[',]+/g, ''));
            if (item.T.toLowerCase() == "+Cash Tips Decl".toLowerCase())
                $scope.CashTipsDecl = parseFloat(item.__EMPTY_1.toString().replace(/[',]+/g, ''));
            if (item.T.toLowerCase() == "+Indirect Tips".toLowerCase())
                $scope.CashTipsDecl = parseFloat(item.__EMPTY_1.toString().replace(/[',]+/g, ''));
            if (item.T.toLowerCase() == "+Charge Tips".toLowerCase())
                HEADER["SERVICE_CHARGE"] = parseFloat(item.__EMPTY_1.toString().replace(/[',]+/g, ''));
        });
        HEADER["GROSS"] = parseFloat(HEADER["NET"]) + parseFloat(HEADER["TAX"]);
        HEADER["VOID"] = (parseFloat($scope.Returns) + parseFloat($scope.Voids) + parseFloat($scope.Mgr_Voids)) * -1;
        HEADER["TIPS"] = parseFloat($scope.CashTipsDecl) + parseFloat($scope.IndirectTips);
        HEADER["TYPE"] = 1;
        $scope.DataList.push(HEADER);
        $scope.count = 0;
        //pay
        angular.forEach($scope.P, function (item) {
            $scope.PAYMENT = [];
            $scope.PAYMENT = {
                "CHECK_ID": $scope.CHKID,
                "PAYMENT_METHOD_ID": null,
                "PAYMENT_METHOD_CODE": item.T,
                "PAYMENT_METHOD_DESC": item.T,
                "TOTAL_AMOUNT_WITH_TIPS": parseFloat(item.__EMPTY.toString().replace(/[',]+/g, '')),
                "TIPS": 0,
                "TYPE": 3
            };
            $scope.DataList.push($scope.PAYMENT);
        });
        //line
        angular.forEach($scope.L, function (item) {
            $scope.LINE = [];
            $scope.count += 1;
            $scope.LINE = {
                "CHECK_ID": $scope.CHKID,
                "REVENUE_CENTER_ID": $scope.Revenue_Center,
                "REVENUE_CENTER": $scope.Revenue_Center,
                "ACCOUNT_GROUP_ID": item.T,
                "ACCOUNT_GROUP_CODE": item.T,
                "ACCOUNT_GROUP_NAME": item.T,
                "CATEGORY_ID": item.T,
                "CATEGORY_CODE": item.T,
                "CATEGORY_NAME": item.T,
                "PRODUCT_SKU": item.T,
                "PRODUCT_NAME": item.T,
                "QUANITY": parseFloat(item.__EMPTY.toString().replace(/[',]+/g, '')),
                "NET": parseFloat(item.__EMPTY_3.toString().replace(/[',]+/g, '')),
                "TAX": 0,
                "GROSS": 0,
                "DISCOUNT": parseFloat(item.__EMPTY_2.toString().replace(/[',()]+/g, '')),
                "COMP": 0,
                "VOID": 0,
                "TIME_OF_SALE": HEADER["OPEN_TIME"],
                "STAFF_ID": null,
                "STAFF_NAME": null,
                "VOID_ID": null,
                "VOID_REASON": null,
                "DISCOUNT_ID": parseFloat(item.__EMPTY_2.toString().replace(/[',()]+/g, '')) != 0 ? '' : null,
                "DISCOUNT_REASON": parseFloat(item.__EMPTY_2.toString().replace(/[',()]+/g, '')) != 0 ? '' : null,
                "DISCOUNT_RATE": 0,
                "TAX_RATE": 0,
                "TYPE": 2
            };
            $scope.DataList.push($scope.LINE);
            if ($scope.count == 1 && (parseFloat($scope.Returns) + parseFloat($scope.Voids) + parseFloat($scope.Mgr_Voids)) > 0) {
                $scope.LINE = [];
                $scope.LINE = {
                    "CHECK_ID": $scope.CHKID,
                    "REVENUE_CENTER_ID": $scope.Revenue_Center,
                    "REVENUE_CENTER": $scope.Revenue_Center,
                    "ACCOUNT_GROUP_ID": item.T,
                    "ACCOUNT_GROUP_CODE": item.T,
                    "ACCOUNT_GROUP_NAME": item.T,
                    "CATEGORY_ID": item.T,
                    "CATEGORY_CODE": item.T,
                    "CATEGORY_NAME": item.T,
                    "PRODUCT_SKU": item.T,
                    "PRODUCT_NAME": item.T,
                    "QUANITY": 0,
                    "NET": 0,
                    "TAX": 0,
                    "GROSS": 0,
                    "DISCOUNT": 0,
                    "COMP": 0,
                    "VOID": (parseFloat($scope.Returns) + parseFloat($scope.Voids) + parseFloat($scope.Mgr_Voids)) * -1,
                    "TIME_OF_SALE": HEADER["OPEN_TIME"],
                    "STAFF_ID": null,
                    "STAFF_NAME": null,
                    "VOID_ID": '',
                    "VOID_REASON": '',
                    "DISCOUNT_ID": null,
                    "DISCOUNT_REASON": null,
                    "DISCOUNT_RATE": 0,
                    "TAX_RATE": 0,
                    "TYPE": 2
                };
                $scope.DataList.push($scope.LINE);
            }

        });
        //dis
        angular.forEach($scope.L, function (item) {
            if (parseFloat(item.__EMPTY_2.toString().replace(/[',()]+/g, '')) != 0) {
                $scope.DISCOUNT = [];
                $scope.DISCOUNT = {
                    "CHECK_ID": $scope.CHKID,
                    "DISCOUNT_ID": "",
                    "DISCOUNT_DESCRIPTION": "",
                    "DISCOUNT_AMOUNT": parseFloat(item.__EMPTY_2.toString().replace(/[',()]+/g, '')),
                    "STAFF_ID": "",
                    "STAFF_NAME": "",
                    "TYPE": 4
                };
                $scope.DataList.push($scope.DISCOUNT);
            }
        });

        $scope.uploadFilesx(1, 0, 0, $scope.DataList, filename);

    };    ////////////////////////////////////OLD ////////////////////////////////////////


});
app.controller('RevenueSummaryController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    //$scope.CASHUPLIST = [];
    $scope.BRANCH_LIST = [];

    var startDate;
    var endDate;
    $scope.RevenueSearch = {
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        ACTIVE: 1
    };

    function reportrange(startDate, endDate) {

        $scope.RevenueSearch.START_DATE = startDate.format($scope.$parent.Datelocaleformat.format);
        $scope.RevenueSearch.END_DATE = endDate.format($scope.$parent.Datelocaleformat.format);
        $('#reportrange span').html(startDate.format($scope.$parent.Datelocaleformat.format) + ' - ' + endDate.format($scope.$parent.Datelocaleformat.format));
    };
    $(function () {

        startDate = new moment().add(0, 'months').date(0);//new moment().subtract(1, 'months').date(1); //moment().add('months', 1).date(0);//moment().startOf('month');   //moment().startOf('isoWeek');//moment().subtract(6, 'days');
        endDate = moment().endOf('month'); //moment().subtract(0, 'days');
        $scope.$parent.SetUpDateRangeMultiDatePicker('reportrange', startDate, endDate, reportrange);
        $('#reportrange span').html(startDate.format($scope.$parent.Datelocaleformat.format) + ' - ' + endDate.format($scope.$parent.Datelocaleformat.format));
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
    $scope.LAZY_GET_CASHUP_LIST = function () {
        $scope.GET_CASHUP_LIST();
    };
    $scope.GET_REVENUE_SUMMARY = function (FLAG) {
        var CashupModelObj = new Object();
        //if (FLAG == 1) {
        //    $scope.CASHUPLIST = [];
        //    $scope.CashupSearch.PAGE_NO = 1;
        //}

        CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CashupModelObj.BRANCH_ID = $scope.RevenueSearch.BRANCH_ID == null ? '' : $scope.RevenueSearch.BRANCH_ID;
        CashupModelObj.START_DATE = $scope.RevenueSearch.START_DATE == undefined ? moment().startOf('month').format($scope.$parent.Datelocaleformat.format) : $scope.RevenueSearch.START_DATE;
        CashupModelObj.END_DATE = $scope.RevenueSearch.END_DATE == undefined ? moment().endOf('month').format($scope.$parent.Datelocaleformat.format) : $scope.RevenueSearch.END_DATE;

        //CashupModelObj.PAGE_NO = $scope.CashupSearch.PAGE_NO;
        //CashupModelObj.PAGE_SIZE = $scope.CashupSearch.PAGE_SIZE;
        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_REVENUE_SUMMARY').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.CASHUPLIST = $scope.CASHUPLIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.CashupSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.CashupSearch.PAGE_NO = parseInt($scope.CashupSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else {
                $scope.GetData = false;
                //$scope.CASHUPLIST = [];
            }
            //$scope.EDIT_CHECK_MODULE_ACCESS = $scope.CheckSubModuleAccess(9);
            // $scope.VIEW_CHECK_MODULE_ACCESS = $scope.CheckSubModuleAccess(11);
        });

    };


    var USER_ID = parseInt($cookies.get("USERID"));
    PrcCommMethods.GET_BRANCH_LIST(parseInt($cookies.get("ENTITY_ID")), USER_ID, 1).then(function (data) {
        $scope.BRANCH_LIST = data;
        if ($scope.BRANCH_LIST.length > 0) {
            $scope.CashupSearch.BRANCH_ID = $scope.BRANCH_LIST[0].BRANCH_ID;
            $scope.GET_CASHUP_LIST(1);
        }
        // $scope. $scope.CheckSubModuleAccess(11);
    });


});
