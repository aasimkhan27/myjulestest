app.controller('CashupMainController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.CashUp_Main_ID = 0;
    //ACCESS_ROLE_ID = [1, 2, 4, 8];    
});
//app.controller('CashupListController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
//    $scope.CASHUPLIST = [];
//    $scope.BRANCH_LIST = [];
//    var startDate;
//    var endDate;
//    $scope.CashupSearch = {
//        PAGE_NO: 1,
//        PAGE_SIZE: 10,
//        ACTIVE: 1
//    };
//    function reportrange(startDate, endDate) {
//        $scope.CashupSearch.START_DATE = startDate.format($scope.$parent.Datelocaleformat.format);
//        $scope.CashupSearch.END_DATE = endDate.format($scope.$parent.Datelocaleformat.format);
//        $('#reportrange span').html(startDate.format($scope.$parent.Datelocaleformat.format) + ' - ' + endDate.format($scope.$parent.Datelocaleformat.format));
//    };
//    $(function () {
//        startDate = moment().startOf('month');//moment().startOf('isoWeek');//moment().subtract(6, 'days');
//        endDate = moment().endOf('month'); //moment().subtract(0, 'days');
//        $scope.$parent.SetUpDateRangeMultiDatePicker('reportrange', startDate, endDate, reportrange);
//        $('#reportrange span').html(startDate.format($scope.$parent.Datelocaleformat.format) + ' - ' + endDate.format($scope.$parent.Datelocaleformat.format));
//    });
//    $(document).on("click", ".ranges ul li", function (event) {
//        var a = $(this).attr("data-range-key");
//        if (a == "Custom Date" && $scope.loader == 1) {
//            $scope.loader = 2;
//            var start = moment().startOf('month');
//            var end = moment().add(1, 'M').endOf('month');
//            //$('#' + ControlName).trigger('show.daterangepicker')
//            $scope.$parent.SetUpDateRangeMultiDatePicker('reportrange', start, end, reportrange, 1, "right", 'Open');
//            $('#reportrange').data('daterangepicker').show();
//        }
//        else {
//            $scope.loader = 1;
//        }
//    });
//    $scope.loader = 1;
//    $scope.LAZY_GET_CASHUP_LIST = function () {
//        $scope.GET_CASHUP_LIST();
//    };
//    $scope.GET_CASHUP_LIST = function (FLAG) {
//        var CashupModelObj = new Object();
//        if (FLAG == 1) {
//            $scope.CASHUPLIST = [];
//            $scope.CashupSearch.PAGE_NO = 1;
//        }
//        CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
//        CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
//        CashupModelObj.CASHUP_DATE_START = $scope.CashupSearch.START_DATE == undefined ? moment().startOf('month').format($scope.$parent.Datelocaleformat.format) : $scope.CashupSearch.START_DATE;
//        CashupModelObj.CASHUP_DATE_END = $scope.CashupSearch.END_DATE == undefined ? moment().endOf('month').format($scope.$parent.Datelocaleformat.format) : $scope.CashupSearch.END_DATE;
//        CashupModelObj.STATUS_IDS = $scope.CashupSearch.STATUS_ID == null ? '' : $scope.CashupSearch.STATUS_ID;
//        CashupModelObj.BRANCH_IDS = $scope.CashupSearch.BRANCH_ID == null ? '' : $scope.CashupSearch.BRANCH_ID;
//        CashupModelObj.PAGE_NO = $scope.CashupSearch.PAGE_NO;
//        CashupModelObj.PAGE_SIZE = $scope.CashupSearch.PAGE_SIZE;
//        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_CASHUP_LIST').then(function (data) {
//            if (data.data.Table.length > 0) {
//                $scope.CASHUPLIST = $scope.CASHUPLIST.concat(data.data.Table);
//                if (data.data.Table.length < $scope.CashupSearch.PAGE_SIZE) {
//                    $scope.GetData = false;
//                }
//                else {
//                    $scope.CashupSearch.PAGE_NO = parseInt($scope.CashupSearch.PAGE_NO) + 1;
//                    $scope.GetData = true;
//                }
//            }
//            else {
//                $scope.GetData = false;
//                //$scope.CASHUPLIST = [];
//            }
//        });
//    };
//    $scope.CashUpEntry = function (Cashup) {
//        $scope.$parent.CashUp_Main_ID = Cashup.ID;
//        $scope.$parent.CashUp_Main_STATUS_ID = Cashup.STATUS_ID;
//        $scope.$parent.CashUp_Main_CASHUP_DATE = Cashup.CASHUP_DATE;
//        $scope.$parent.CashUp_Main_BRANCH_ID = Cashup.BRANCH_ID;
//        $scope.$parent.CashUp_Main_BRANCH_NAME = Cashup.BRANCH_NAME;
//        $scope.$parent.CashUp_Main_BRANCH_CODE = Cashup.BRANCH_CODE;
//        $location.path('CE');
//    };
//    $scope.GET_CASHUP_LIST(1);
//    PrcCommMethods.GET_BRANCH_LIST(parseInt($cookies.get("ENTITY_ID")), parseInt($cookies.get("USERID"))).then(function (data) {
//        $scope.BRANCH_LIST = data;
//    });


//});
//app.controller('ApprovalListController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
//    $scope.CASHUPLIST = [];
//    var startDate;
//    var endDate;
//    $scope.CashupSearch = {
//        PAGE_NO: 1,
//        PAGE_SIZE: 10,
//        ACTIVE: 1,
//        STATUS_ID: '3,4,5'
//    };
//    function reportrange(startDate, endDate) {
//        $scope.CashupSearch.START_DATE = startDate.format($scope.$parent.Datelocaleformat.format);
//        $scope.CashupSearch.END_DATE = endDate.format($scope.$parent.Datelocaleformat.format);
//        $('#reportrange span').html(startDate.format($scope.$parent.Datelocaleformat.format) + ' - ' + endDate.format($scope.$parent.Datelocaleformat.format));
//    };
//    $(function () {
//        startDate = moment().startOf('month');// moment().startOf('month');//('isoWeek');//moment().subtract(6, 'days');
//        endDate = moment().endOf('month');//moment().subtract(0, 'days');
//        $scope.$parent.SetUpDateRangeMultiDatePicker('reportrange', startDate, endDate, reportrange);
//        $('#reportrange span').html(startDate.format($scope.$parent.Datelocaleformat.format) + ' - ' + endDate.format($scope.$parent.Datelocaleformat.format));
//    });
//    $(document).on("click", ".ranges ul li", function (event) {
//        var a = $(this).attr("data-range-key");
//        if (a == "Custom Date" && $scope.loader == 1) {
//            $scope.loader = 2;
//            var start = moment().startOf('month');
//            var end = moment().add(1, 'M').endOf('month');
//            //$('#' + ControlName).trigger('show.daterangepicker')
//            $scope.$parent.SetUpDateRangeMultiDatePicker('reportrange', start, end, reportrange, 1, "right", 'Open');
//            $('#reportrange').data('daterangepicker').show();
//        }
//        else {
//            $scope.loader = 1;
//        }
//    });
//    $scope.loader = 1;
//    $scope.GET_CASHUP_LIST = function (FLAG) {
//        var CashupModelObj = new Object();
//        if (FLAG == 1) {
//            $scope.CASHUPLIST = [];
//            $scope.CashupSearch.PAGE_NO = 1;
//        }
//        CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
//        CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
//        CashupModelObj.CASHUP_DATE_START = $scope.CashupSearch.START_DATE == undefined ? moment().startOf('month').format($scope.$parent.Datelocaleformat.format) : $scope.CashupSearch.START_DATE;
//        CashupModelObj.CASHUP_DATE_END = $scope.CashupSearch.END_DATE == undefined ? moment().endOf('month').format($scope.$parent.Datelocaleformat.format) : $scope.CashupSearch.END_DATE;
//        CashupModelObj.STATUS_IDS = $scope.CashupSearch.STATUS_ID;
//        CashupModelObj.BRANCH_IDS = $scope.CashupSearch.BRANCH_ID == null ? '' : $scope.CashupSearch.BRANCH_ID;
//        CashupModelObj.PAGE_NO = $scope.CashupSearch.PAGE_NO;
//        CashupModelObj.PAGE_SIZE = $scope.CashupSearch.PAGE_SIZE;
//        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_CASHUP_LIST_FOR_APPROVER').then(function (data) {
//            if (data.data.length > 0) {
//                $scope.CASHUPLIST = $scope.CASHUPLIST.concat(data.data);
//                if (data.data.length < $scope.CashupSearch.PAGE_SIZE) {
//                    $scope.GetData = false;
//                }
//                else {
//                    $scope.CashupSearch.PAGE_NO = parseInt($scope.CashupSearch.PAGE_NO) + 1;
//                    $scope.GetData = true;
//                }
//            }
//            else {
//                $scope.GetData = false;
//                //$scope.CASHUPLIST = [];
//            }
//        });
//    };
//    $scope.CashUpEntry = function (Cashup) {
//        $scope.$parent.CashUp_Main_ID = Cashup.ID;
//        $scope.$parent.CashUp_Main_STATUS_ID = Cashup.STATUS_ID;
//        $scope.$parent.CashUp_Main_CASHUP_DATE = Cashup.CASHUP_DATE;
//        $scope.$parent.CashUp_Main_BRANCH_ID = Cashup.BRANCH_ID;
//        $scope.$parent.CashUp_Main_BRANCH_NAME = Cashup.BRANCH_NAME;
//        $scope.$parent.CashUp_Main_BRANCH_CODE = Cashup.BRANCH_CODE;
//        $location.path('CE');
//    };
//    $scope.GET_CASHUP_LIST(1);
//    //$scope.GET_BRANCH_LIST = function () {
//    //    var CashupModelObj = new Object();
//    //    CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
//    //    PrcCommMethods.DASHBOARD_API(CashupModelObj, 'GET_BRANCH_LIST').then(function (data) {
//    //        $scope.BRANCH_LIST = data.data.Table;
//    //    });
//    //};
//    //$scope.GET_BRANCH_LIST();
//    PrcCommMethods.GET_BRANCH_LIST(parseInt($cookies.get("ENTITY_ID")), parseInt($cookies.get("USERID"))).then(function (data) {
//        $scope.BRANCH_LIST = data;
//    });

//    $scope.LAZY_GET_CASHUP_LIST = function () {
//        $scope.GET_CASHUP_LIST();
//    };



//    $scope.RESET_TO_DRAFT_CASHUP = function (CASHUP_MAIN_ID) {
//        if (confirm('Are you sure you want to reset the cashup to draft?')) {
//            var CashupModelObj = new Object();
//            CashupModelObj.CASHUP_MAIN_ID = CASHUP_MAIN_ID;
//            CashupModelObj.STATUS_ID = 1;
//            CashupModelObj.NOTE = "";
//            CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
//            PrcCommMethods.CASHUP_API(CashupModelObj, 'APP_REJ_CASHUP').then(function (data) {
//                $scope.GET_CASHUP_LIST();
//            });
//        }

//    };
//});
//app.filter('total', function () {
//    return function (input, property) {
//        var total = 0;
//        if (input != undefined) {
//            var i = input.length;
//            while (i--)
//                total += (input[i][property]) * 1;
//        }
//        return total;
//    }
//});
//app.controller('CashupEntryController', function ($scope, $http, $interval, CommService, $cookies, $filter, PrcCommMethods, $location, readFileData, readFileDataNew) {
//    if ($scope.$parent.CashUp_Main_ID == 0) {
//        $location.path('CL');
//    }
//    $scope.CASHUP = {
//        CASHUP_MAIN_ID: $scope.$parent.CashUp_Main_ID,
//        ID: 0,
//        ENTITY_ID: parseInt($cookies.get('ENTITY_ID')),
//        BRANCH_ID: $scope.$parent.CashUp_Main_BRANCH_ID,
//        BRANCH_NAME: $scope.$parent.CashUp_Main_BRANCH_NAME,
//        BRANCH_CODE: $scope.$parent.CashUp_Main_BRANCH_CODE,
//        AREA_ID: null,
//        TILL_ID: null,
//        PDQ_ID: null,
//        SESSION_ID: null,
//        IS_TILL_BASED: null,
//        IS_SESSION_BASED: null,
//        SESSION: null,
//        TYPE: 1,
//        CASHUP_DATE: $scope.$parent.CashUp_Main_CASHUP_DATE,
//        STEP_NO: 0,
//        ACTUAL_STEP_NO: 0,
//        TOTAL_FLOAT_EPOS: 0,
//        TOTAL_FLOAT: 0,
//        VARIANCE_FLOAT: 0,
//        TOTAL_CASH_EPOS: 0,
//        TOTAL_CASH: 0,
//        VARIANCE_CASH: 0,
//        TOTAL_CARD_EPOS: 0,
//        TOTAL_CARD: 0,
//        VARIANCE_CARD: 0,
//        TOTAL_PETTY_CASH_EPOS: 0,
//        TOTAL_PETTY_CASH: 0,
//        VARIANCE_PETTY_CASH: 0,
//        TOTAL_CHEQUE_EPOS: 0,
//        TOTAL_CHEQUE: 0,
//        VARIANCE_CHEQUE: 0,
//        ACCOUNT_TOTAL_EPOS: 0,
//        ACCOUNT_TOTAL: 0,
//        VARIANCE_ACCOUNT: 0,
//        ISSUE_TOTAL_EPOS: 0,
//        ISSUE_TOTAL: 0,
//        VARIANCE_ISSUE: 0,
//        REDEEMED_TOTAL_EPOS: 0,
//        REDEEMED_TOTAL: 0,
//        VARIANCE_REDEEMED: 0,
//        DEPOSIT_TOTAL_EPOS: 0,
//        DEPOSIT_TOTAL: 0,
//        VARIANCE_DEPOSIT: 0,
//        DEPOSIT_REDEEMED_TOTAL_EPOS: 0,
//        DEPOSIT_REDEEMED_TOTAL: 0,
//        VARIANCE_DEPOSIT_REDEEMED: 0,
//        VOID_TOTAL_EPOS: 0,
//        VOID_TOTAL: 0,
//        VARIANCE_VOID: 0,
//        COMP_TOTAL_EPOS: 0,
//        COMP_TOTAL: 0,
//        VARIANCE_COMP: 0,
//        ORIGINAL_FILE_NAME: null,
//        UPL_ID: 0,
//        COMP_NOTES: null,
//        REV_NOTES: null,
//        FLOAT_NOTES: null,
//        CASH_NOTES: null,
//        CARD_NOTES: null,
//        PCASH_NOTES: null,
//        COMPLETED_GROUP_ID: null,
//        INTEGRATION_SYSTEM_ID: 0,
//        PETTYCASHVALID: true,
//        COMPLEMENTARYVALID: true,
//        INDEX: "",
//    };
//    $scope.CASHUP_RESET = function () {
//        $scope.CASHUP = {
//            CASHUP_MAIN_ID: $scope.$parent.CashUp_Main_ID,
//            ID: 0,
//            ENTITY_ID: parseInt($cookies.get('ENTITY_ID')),
//            BRANCH_ID: $scope.$parent.CashUp_Main_BRANCH_ID,
//            BRANCH_NAME: $scope.$parent.CashUp_Main_BRANCH_NAME,
//            BRANCH_CODE: $scope.$parent.CashUp_Main_BRANCH_CODE,
//            AREA_ID: null,
//            TILL_ID: null,
//            PDQ_ID: null,
//            SESSION_ID: null,
//            IS_TILL_BASED: null,
//            IS_SESSION_BASED: null,
//            SESSION: null,
//            TYPE: 1,
//            CASHUP_DATE: $scope.$parent.CashUp_Main_CASHUP_DATE,
//            STEP_NO: 0,
//            ACTUAL_STEP_NO: 0,
//            TOTAL_FLOAT_EPOS: 0,
//            TOTAL_FLOAT: 0,
//            VARIANCE_FLOAT: 0,
//            TOTAL_CASH_EPOS: 0,
//            TOTAL_CASH: 0,
//            VARIANCE_CASH: 0,
//            TOTAL_CARD_EPOS: 0,
//            TOTAL_CARD: 0,
//            VARIANCE_CARD: 0,
//            TOTAL_PETTY_CASH_EPOS: 0,
//            TOTAL_PETTY_CASH: 0,
//            VARIANCE_PETTY_CASH: 0,
//            TOTAL_CHEQUE_EPOS: 0,
//            TOTAL_CHEQUE: 0,
//            VARIANCE_CHEQUE: 0,
//            ACCOUNT_TOTAL_EPOS: 0,
//            ACCOUNT_TOTAL: 0,
//            VARIANCE_ACCOUNT: 0,
//            ISSUE_TOTAL_EPOS: 0,
//            ISSUE_TOTAL: 0,
//            VARIANCE_ISSUE: 0,
//            REDEEMED_TOTAL_EPOS: 0,
//            REDEEMED_TOTAL: 0,
//            VARIANCE_REDEEMED: 0,
//            DEPOSIT_TOTAL_EPOS: 0,
//            DEPOSIT_TOTAL: 0,
//            VARIANCE_DEPOSIT: 0,
//            DEPOSIT_REDEEMED_TOTAL_EPOS: 0,
//            DEPOSIT_REDEEMED_TOTAL: 0,
//            VARIANCE_DEPOSIT_REDEEMED: 0,
//            VOID_TOTAL_EPOS: 0,
//            VOID_TOTAL: 0,
//            VARIANCE_VOID: 0,
//            COMP_TOTAL_EPOS: 0,
//            COMP_TOTAL: 0,
//            VARIANCE_COMP: 0,
//            ORIGINAL_FILE_NAME: null,
//            UPL_ID: 0,
//            COMP_NOTES: null,
//            REV_NOTES: null,
//            FLOAT_NOTES: null,
//            CASH_NOTES: null,
//            CARD_NOTES: null,
//            PCASH_NOTES: null,
//            COMPLETED_GROUP_ID: null,
//            INTEGRATION_SYSTEM_ID: 0,
//            PETTYCASHVALID: true
//        };
//    };
//    $scope.CardList = [];
//    $scope.PettyCashList = [];
//    $scope.AccCustomerList = [];
//    $scope.VoucherIssuedList = [];
//    $scope.VoucherRedeemedList = [];
//    $scope.DepositRecievedList = [];
//    $scope.DepositRedeemedList = [];
//    $scope.VoidList = [];
//    $scope.ComplimentaryList = [];
//    $scope.ChequeList = [];
//    $scope.PDQTerminal = [];

//    $scope.BlankCard = { ID: 0, PDQList: null, PDQ_ID: null, AREA_ID: null, AMOUNT: null, AUTH_CODE: null, VISA: null, MASTERCARD: null, AMEX: null, DINNER: null, SWITCH: null, NOTE: null, UPLOADS: null };
//    $scope.BlankPettyCash = { ID: 0, CategoryList: null, PETTY_CASH_CATEGORY_ID: null, PAID_TO: '', ITEM: '', TOTAL_VALUE: null, StaffList: null, AUTHORIZED_BY_ID: null, VAT_AMOUNT: null, NET_AMOUNT: null };
//    $scope.BlankAccCustomer = { ID: 0, CASHUP_HEADER_ID: 0, CHECK_NO: '', NAME: '', ACCOUNT: '', AMOUNT: '', MODE: null, NOTE: '', ACTIVE: false, CREATED_BY: 0, CREATED_DATE: null, MODIFIED_BY: null, MODIFIED_DATE: null };
//    $scope.BlankVoucherIssued = { ID: 0, ENTRY_TYPE_ID: 1, ENTRY_TYPE_DETAIL_ID: null, VOUCHER_TYPE: 'Pre-Defined', VOUCHER: null, VALUE: '', VALIDITY_DATE: '', CUSTOMER_NAME: '', MODE: null, CHECK_NO: '', NOTE: '', IS_REDEEMED: false, vouchernumbervisible: true };
//    $scope.BlankVoucherRedeem = { ID: 0, ENTRY_TYPE_ID: 1, ENTRY_TYPE_DETAIL_ID: null, VOUCHER_TYPE: 'Pre-Defined', VOUCHER: null, VALUE: '', VALIDITY_DATE: '', CUSTOMER_NAME: '', MODE: null, CHECK_NO: '', NOTE: '', IS_REDEEMED: true };
//    $scope.BlankDepositRecieved = { ID: 0, ENTRY_TYPE_ID: 3, ENTRY_TYPE_DETAIL_ID: 0, VOUCHER_TYPE: null, VOUCHER: null, VALUE: '', VALIDITY_DATE: '', CUSTOMER_NAME: '', MODE: null, CHECK_NO: '', NOTE: '', IS_REDEEMED: false };
//    $scope.BlankDepositRedeem = { ID: 0, ENTRY_TYPE_ID: 3, ENTRY_TYPE_DETAIL_ID: 0, VOUCHER_TYPE: null, VOUCHER: null, VALUE: '', VALIDITY_DATE: '', CUSTOMER_NAME: '', MODE: null, CHECK_NO: '', NOTE: '', IS_REDEEMED: true };
//    //    $scope.BlankComplimentary = { ENTRY_TYPE_ID: 6, ENTRY_TYPE_DETAIL_ID: 0, VOUCHER_TYPE: null, CODE: '', VALUE: '', CUSTOMER_NAME: null, MODE: null, CHECK_NO: '', NOTE: '', AUTHORIZED_BY: null, DISCOUNT: '', FOOD: '', DRINKS: '' };
//    $scope.BlankComplimentary = { ENTRY_TYPE_ID: 6, ENTRY_TYPE_DETAIL_ID: 0, VOUCHER_TYPE: null, CODE: '', VALUE: '', CUSTOMER_NAME: null, MODE: null, CHECK_NO: '', NOTE: '', AUTHORIZED_BY: null, DISCOUNT: '', FOOD: '', DRINKS: '', LIGHT_SPEED_ACCOUNTFISCID: null };
//    $scope.BlankCheque = { ID: 0, NAME: '', DATE: '', NUMBER: '', AMOUNT: null, PAID_BY_TYPE: null, TRANSFER_TYPE: null, NOTE: '' };

//    $scope.SetValues = function (VISS, IndexVal) {
//        angular.forEach($scope.MasterEntryList_Redeemed, function (value) {
//            if (value.CODE == VISS.CODE && value.ENTRY_TYPE_ID == 1) {
//                VISS.VALUE = value.AMOUNT;
//                VISS.CODE = value.CODE;
//                VISS.VALIDITY_DATE = value.VALIDITY_DATE;
//                VISS.MODE = value.MODE;
//                VISS.ENTRY_TYPE_DETAIL_ID = value.ID;
//            }
//        });
//    };
//    $scope.SetValues_Deposit = function (VISS, IndexVal) {
//        angular.forEach($scope.DepositsList, function (value) {
//            if (value.CODE == VISS.CODE && value.ENTRY_TYPE_ID == 3) {
//                VISS.VALUE = value.VALUE;
//                VISS.CODE = value.CODE;
//                VISS.VALIDITY_DATE = value.VALIDITY_DATE;
//                VISS.MODE = value.MODE;
//                VISS.ENTRY_TYPE_DETAIL_ID = value.ID;
//            }
//        });
//    };
//    $scope.CheckDecimal = function (VISS) {
//        if (VISS.VALUE == '.') {
//            VISS.VALUE = '';
//        }
//    };
//    $scope.DateSetUp = function () {
//        var date_inputs = document.getElementsByName("datecontrol_m") //our date input has the name "date"

//        if (date_inputs.length > 0) {
//            for (var i = 0; i < date_inputs.length; i++) {

//                var date_input = $('input[name="' + date_inputs[i].name + '"]'); //our date input has the name "date"
//                var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
//                var date = new Date();
//                var options = {
//                    todayBtn: "linked",
//                    daysOfWeekHighlighted: "0,6",
//                    autoclose: true,
//                    todayHighlight: true,
//                    format: 'M dd, yyyy'
//                    //  startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate())
//                };
//                date_input.datepicker(options);
//            }
//        };
//    };
//    $scope.SetVoucherValues_basisType = function (VISS) {
//        VISS.VOUCHER = null;
//        VISS.VALUE = null;
//        VISS.CODE = null;
//        VISS.VALIDITY_DATE = null;
//        VISS.ENTRY_TYPE_DETAIL_ID = null;
//        if (VISS.VOUCHER_TYPE == 'Open Voucher') {
//            VISS.vouchernumbervisible = false;
//        }
//        else {
//            VISS.vouchernumbervisible = true;
//        }
//    };
//    $scope.SetVoucherValues = function (VISS) {

//        if (VISS.ENTRY_TYPE_DETAIL_ID == null) {
//            VISS.VALUE = null;
//            VISS.CODE = null;
//            VISS.VALIDITY_DATE = null;
//        }
//        else {

//            angular.forEach($scope.MasterEntryList, function (value) {
//                if (value.ID == VISS.ENTRY_TYPE_DETAIL_ID && value.ENTRY_TYPE_ID == 1) {
//                    VISS.VALUE = value.AMOUNT;
//                    VISS.CODE = value.CODE;
//                    VISS.VALIDITY_DATE = value.VALIDITY_DATE;
//                    VISS.ENTRY_TYPE_DETAIL_ID = value.VOUCHER.ID;
//                }
//            });

//        }
//    };
//    $scope.AddCardLine = function () {
//        $scope.BlankCard.AREA_ID = $scope.CASHUP.AREA_ID;
//        $scope.CardList.push(angular.copy($scope.BlankCard));
//    };
//    $scope.AddPCashLine = function () {
//        $scope.PettyCashList.push(angular.copy($scope.BlankPettyCash));
//    };
//    $scope.AddCustomerLine = function () {
//        $scope.AccCustomerList.push(angular.copy($scope.BlankAccCustomer));
//    };
//    $scope.VoucherIssueLine = function () {
//        $scope.VoucherIssuedList.push(angular.copy($scope.BlankVoucherIssued));
//    };
//    $scope.VoucherRedeemLine = function () {
//        $scope.VoucherIssuedList.push(angular.copy($scope.BlankVoucherRedeem));
//    };
//    $scope.DepositRecievedLine = function () {
//        $scope.VoucherIssuedList.push(angular.copy($scope.BlankDepositRecieved));
//    };
//    $scope.DepositRedeemLine = function () {
//        $scope.VoucherIssuedList.push(angular.copy($scope.BlankDepositRedeem));
//    };
//    $scope.ComplimentaryLine = function () {
//        $scope.ComplimentaryList.push(angular.copy($scope.BlankComplimentary));
//    };
//    $scope.AddChequeLine = function () {
//        $scope.ChequeList.push(angular.copy($scope.BlankCheque));
//    };
//    $scope.InitVouchureIssuedList = function (VISS) {
//        VISS.VOUCHER = { ID: VISS.ENTRY_TYPE_DETAIL_ID, CODE: VISS.CODE, VALIDITY_DATE: VISS.VALIDITY_DATE, AMOUNT: VISS.VALUE, ENTRY_TYPE_ID: VISS.ENTRY_TYPE_ID };
//    };
//    //    $scope.AddCardLine();
//    //   $scope.AddPCashLine();
//    // $scope.AddCustomerLine();
//    $scope.VoucherIssueLine();
//    $scope.VoucherRedeemLine();
//    $scope.DepositRecievedLine();
//    $scope.DepositRedeemLine();
//    $scope.ComplimentaryLine();
//    //   $scope.ChequeLine();
//    $scope.GOTOSTEP = function (STEP_NO) {
//        $scope.CASHUP.STEP_NO > 1 ? $scope.GET_EPOS_HEADER() : '';
//        switch (STEP_NO) {
//            case 0:
//                break;
//            case 1:

//                $scope.GET_FLOAT_CASH_DECLARATION();
//                break;
//            case 2:
//                $scope.GET_FLOAT_CASH_DECLARATION();
//                break;
//            case 3:
//                $scope.GET_CARD_DECLERATION();
//                break;
//            case 4:
//                $scope.GET_PETTY_CASH_DECLERATION();

//                break;
//            case 5:
//                $scope.GET_CHEQUE_DECLARATION();

//                break;
//            case 6:
//                $scope.GET_ACC_CUST_DECLARATION();

//                break;
//            case 7:
//                $scope.GET_ENTRY_MASTER_DETAILS();
//                break;
//            case 8:
//                $scope.GET_ENTRY_MASTER_DETAILS();
//                break;
//            case 9:
//                $scope.GET_ENTRY_MASTER_DETAILS();
//                break;
//            case 10:
//                $scope.GET_FLOAT_CASH_DECLARATION();
//                $scope.GET_CARD_DECLERATION();
//                $scope.GET_PETTY_CASH_DECLERATION();
//                $scope.GET_CHEQUE_DECLARATION();
//                $scope.GET_ACC_CUST_DECLARATION();
//                $scope.GET_ENTRY_MASTER_DETAILS();
//                break;
//            default:
//                break;

//        }
//    };
//    $scope.Validation = {
//        CashupEntry: {
//            IS_VALID: true,
//            Session_Valid: true
//        }
//    };
//    $scope.VALIDATE_STEPS = function () {
//        var IS_VALID = true;
//        switch ($scope.CASHUP.STEP_NO) {
//            case 0:
//                if ($scope.CASHUP.SESSION == null) {
//                    IS_VALID = false;
//                    $scope.Validation.CashupEntry.Session_Valid = false;
//                }
//                $scope.Validation.CashupEntry.IS_VALID = IS_VALID;
//                break;
//            case 1:
//                $scope.InsertDeclerationDetails(1);
//                break;
//            case 2:
//                $scope.InsertDeclerationDetails(2);
//                $scope.GET_CARD_DECLERATION();
//                break;
//            case 3:
//                $scope.InsertCardDeclaration();
//                $scope.GET_PETTY_CASH_DECLERATION();
//                break;
//            case 4:
//                $scope.InsertPettyCashDeclaration();
//                $scope.GET_CHEQUE_DECLARATION();
//                break;
//            case 5:
//                $scope.InsertChequeDeclaration();
//                $scope.GET_ACC_CUST_DECLARATION();
//                break;
//            case 6:
//                $scope.INS_ACC_CUST_DECLARATION();
//                $scope.GET_ENTRY_MASTER_DETAILS();
//                break;
//            case 7:
//                $scope.InsertEntry_TypeDeclaration();
//                break;
//            case 8:
//                $scope.InsertEntry_DepositDeclaration();
//                break;
//            case 9:
//                $scope.InsertEntry_VoidDeclaration();
//                break;
//            default:
//                break;

//        }
//        return IS_VALID;
//    };
//    $scope.init_decleration_details = function (declaration) {
//        declaration.QUANTITY == 0 ? declaration.QUANTITY = null : '';
//    };
//    $scope.NextButtonClick = function () {
//        //loader
//        $scope.$parent.$parent.overlay_loading_coffee = 'block';
//        $scope.CASHUP.STEP_NO > 1 ? $scope.GET_EPOS_HEADER() : '';
//        switch ($scope.CASHUP.STEP_NO) {
//            case 0:
//                $scope.INS_UPD_REVENUE_CENTERS();
//                $scope.VALIDATE_STEPS() ? $scope.InsertCashUpHeader_1() : '';
//                $scope.GET_FLOAT_CASH_DECLARATION();//loader done
//                break;
//            case 1:
//                $scope.InsertDeclerationDetails(1);//loader done
//                break;
//            case 2:
//                $scope.InsertDeclerationDetails(2);
//                $scope.GET_CARD_DECLERATION();//loader done
//                break;
//            case 3:
//                $scope.InsertCardDeclaration();
//                $scope.GET_PETTY_CASH_DECLERATION();//loader done
//                break;
//            case 4:
//                $scope.InsertPettyCashDeclaration();
//                $scope.GET_CHEQUE_DECLARATION();//loader done
//                break;
//            case 5:
//                $scope.InsertChequeDeclaration();
//                $scope.GET_ACC_CUST_DECLARATION();//loader done
//                break;
//            case 6:
//                $scope.INS_ACC_CUST_DECLARATION();
//                $scope.GET_ENTRY_MASTER_DETAILS();//loader done in GET_ENTRY_TYPE_DECLARATION
//                break;
//            case 7:
//                $scope.InsertEntry_TypeDeclaration();//done
//                break;
//            case 8:
//                $scope.InsertEntry_DepositDeclaration();//done
//                break;
//            case 9:
//                $scope.InsertEntry_VoidDeclaration();//close
//                break;
//            default:
//                break;

//        }
//    };
//    $scope.GetNextStep = function () {
//        $scope.Active_Tabs = $scope.TABLIST.filter(function (x) { return x.FLAG == 1 || x.FLAG == 2 }); //$filter('filter')($scope.TABLIST, { FLAG: 1 }, true);
//        var Tab_Index = 0;
//        angular.forEach($scope.Active_Tabs, function (value, index) {
//            if (value.CASHUP_TABS_ID == $scope.CASHUP.STEP_NO + 1) {
//                Tab_Index = index;
//            }
//        });
//        var Tab_Index = $scope.Active_Tabs.findIndex(x => x.CASHUP_TABS_ID === ($scope.CASHUP.STEP_NO + 1));
//        $scope.CASHUP.STEP_NO = $scope.Active_Tabs[Tab_Index + 1].CASHUP_TABS_ID - 1;
//        return $scope.Active_Tabs[Tab_Index + 1].CASHUP_TABS_ID - 1;
//    };
//    $scope.GetPreviousStep = function () {
//        $scope.Active_Tabs = $scope.TABLIST.filter(function (x) { return x.FLAG == 1 || x.FLAG == 2 }); //$filter('filter')($scope.TABLIST, { FLAG: 1 }, true);
//        var Tab_Index = 0;
//        angular.forEach($scope.Active_Tabs, function (value, index) {
//            if (value.CASHUP_TABS_ID == $scope.CASHUP.STEP_NO + 1) {
//                Tab_Index = index;
//            }
//        });
//        $scope.CASHUP.STEP_NO = $scope.Active_Tabs[Tab_Index - 1].CASHUP_TABS_ID - 1;
//        return $scope.Active_Tabs[Tab_Index - 1].CASHUP_TABS_ID - 1;
//    };
//    $scope.InsertCashUpHeader_1 = function () {
//        var CashupModelObj = new Object();
//        CashupModelObj.ID = $scope.CASHUP.ID;
//        CashupModelObj.CASHUP_MAIN_ID = $scope.CASHUP.CASHUP_MAIN_ID;
//        CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
//        CashupModelObj.BRANCH_ID = $scope.CASHUP.BRANCH_ID;
//        CashupModelObj.TILL_ID = $scope.CASHUP.TYPE == 1 ? $scope.CASHUP.TILL_ID : null;
//        CashupModelObj.SESSION_ID = $scope.CASHUP.TYPE == 2 ? $scope.CASHUP.SESSION_ID : null;
//        CashupModelObj.AREA_ID = $scope.CASHUP.AREA_ID;
//        CashupModelObj.CASHUP_DATE = $scope.CASHUP.CASHUP_DATE;
//        CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
//        CashupModelObj.TYPE = $scope.CASHUP.TYPE;
//        CashupModelObj.STEP_NO = $scope.GetNextStep();
//        //var httprequest = $http({
//        //    method: 'POST',
//        //    url: CommService.Get_CASHUP_API() + 'api/CashupAPI/INS_CASHUP_HEADER',
//        //    data: CashupModelObj
//        //}).then(function (data) {
//        PrcCommMethods.CASHUP_API(CashupModelObj, 'INS_CASHUP_HEADER').then(function (data) {
//            $scope.CASHUP.ID = data.data;
//            // $scope.CASHUP.STEP_NO = $scope.GetNextStep();
//        });
//    };
//    $scope.InsertDeclerationDetails = function (DECLARATION_TYPE_ID) {
//        $scope.DECLERATION_MASTER.filter(function (x) {
//            if (x.AMOUNT > 0 || x.AMOUNT == 0) {
//                x.AMOUNT = '' + x.AMOUNT;
//            }
//        });
//        var CashupModelObj = new Object();
//        CashupModelObj.ID = $scope.CASHUP.ID;
//        CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
//        CashupModelObj.TOTAL_FLOAT = $scope.CASHUP.TOTAL_FLOAT;
//        CashupModelObj.TOTAL_CASH = $scope.CASHUP.TOTAL_CASH;
//        CashupModelObj.DECLARATION_DETAILS = $scope.DECLERATION_MASTER;
//        CashupModelObj.DECLARATION_TYPE_ID = DECLARATION_TYPE_ID;
//        CashupModelObj.STEP_NO = $scope.GetNextStep();
//        CashupModelObj.NOTE_TABLE_ID = DECLARATION_TYPE_ID == 1 ? $scope.CASHUP.FLOAT_NOTES_ID : $scope.CASHUP.CASH_NOTES_ID;
//        CashupModelObj.NOTE_TYPE_ID = DECLARATION_TYPE_ID;
//        CashupModelObj.NOTE = DECLARATION_TYPE_ID == 1 ? $scope.CASHUP.FLOAT_NOTES : $scope.CASHUP.CASH_NOTES;
//        PrcCommMethods.CASHUP_API(CashupModelObj, 'INS_DECLERATION_DETAILS').then(function (data) {
//            //  $scope.CASHUP.STEP_NO = $scope.GetNextStep();
//            if (DECLARATION_TYPE_ID == 1) {
//                $scope.$parent.$parent.overlay_loading_coffee = 'none';
//            }
//            $scope.CASHUP.ACTUAL_STEP_NO = $scope.CASHUP.STEP_NO;
//            DECLARATION_TYPE_ID == 1 ? $scope.CASHUP.FLOAT_NOTES_ID = data.data : $scope.CASHUP.CASH_NOTES_ID = data.data;
//        });
//    };
//    $scope.InsertCardDeclaration = function () {
//        var CashupModelObj = new Object();
//        CashupModelObj.ID = $scope.CASHUP.ID;
//        CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
//        CashupModelObj.BRANCH_ID = $scope.CASHUP.BRANCH_ID;
//        CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
//        CashupModelObj.TOTAL_CARD = $scope.CASHUP.TOTAL_CARD;
//        CashupModelObj.STEP_NO = $scope.GetNextStep();
//        CashupModelObj.DECLARATION_DETAILS = [];
//        angular.forEach($scope.CardList, function (x) {
//            if (x.UploadedFiles != undefined && x.UploadedFiles.length > 0) {
//                //if (UPLS == '') {
//                x.UPLOAD_IDS = x.UploadedFiles[0].ID;
//                //}
//                //if (FILE == '') {
//                x.FILE_NAME = x.UploadedFiles[0].FILE_PATH + ":;:" + x.UploadedFiles[0].SERVER_FILE_NAME + ":;:" + x.UploadedFiles[0].ORIGINAL_FILE_NAME;
//                //}
//            }
//            else {
//                x.UPLOAD_IDS = null;
//                x.FILE_NAME = null;
//            }
//            var ReadOnlyObj = new Object();
//            ReadOnlyObj.AREA_ID = x.AREA_ID;
//            ReadOnlyObj.PDQ_ID = x.PDQ_ID;
//            ReadOnlyObj.AMOUNT = parseFloat(x.AMOUNT).toFixed(2);
//            ReadOnlyObj.AUTH_CODE = x.AUTH_CODE;
//            ReadOnlyObj.VISA = x.VISA == "" || x.VISA == undefined || x.VISA == null ? '' + 0 : '' + parseFloat(x.VISA).toFixed(2);
//            ReadOnlyObj.MASTERCARD = x.MASTERCARD == "" || x.MASTERCARD == undefined || x.MASTERCARD == null ? '' + 0 : '' + parseFloat(x.MASTERCARD).toFixed(2);
//            ReadOnlyObj.AMEX = x.AMEX == "" || x.AMEX == undefined || x.AMEX == null ? '' + 0 : '' + parseFloat(x.AMEX).toFixed(2);
//            ReadOnlyObj.DINNER = x.DINNER == "" || x.DINNER == undefined || x.DINNER == null ? '' + 0 : '' + parseFloat(x.DINNER).toFixed(2);
//            ReadOnlyObj.SWITCH = x.SWITCH == "" || x.SWITCH == undefined || x.SWITCH == null ? '' + 0 : '' + parseFloat(x.SWITCH).toFixed(2);
//            ReadOnlyObj.NOTE = x.NOTE;
//            ReadOnlyObj.UPLOAD_IDS = x.UPLOAD_IDS;
//            ReadOnlyObj.FILE_NAME = x.FILE_NAME;
//            CashupModelObj.DECLARATION_DETAILS.push(ReadOnlyObj);
//        })
//        // CashupModelObj.DECLARATION_DETAILS = $scope.CardList;
//        CashupModelObj.NOTE_TABLE_ID = $scope.CASHUP.CARD_NOTES_ID;
//        CashupModelObj.NOTE_TYPE_ID = 3;
//        CashupModelObj.NOTE = $scope.CASHUP.CARD_NOTES;
//        PrcCommMethods.CASHUP_API(CashupModelObj, 'INS_CARD_DECLARATION').then(function (data) {
//            //$scope.CASHUP.STEP_NO = $scope.GetNextStep();
//            console.log(CashupModelObj.STEP_NO);
//            $scope.CASHUP.ACTUAL_STEP_NO = $scope.CASHUP.STEP_NO;
//            $scope.CASHUP.CARD_NOTES_ID = data.data;
//        });
//    };
//    $scope.ValidatePettyCash = function () {
//        $scope.CASHUP.PETTYCASHVALID = true;
//        angular.forEach($scope.PettyCashList, function (x) {
//            x.PETTY_CASH_CATEGORY_VALID = true;
//            x.TOTAL_VALUE_VALID = true;
//            x.AUTHORIZED_BY_ID_VALID = true;
//            if ((x.PAID_TO != null && x.PAID_TO != "") || (x.PETTY_CASH_CATEGORY_ID != null && x.PETTY_CASH_CATEGORY_ID != "") || (x.ITEM != null && x.ITEM != "") || (x.VAT_AMOUNT != null && x.VAT_AMOUNT != "") || (x.TOTAL_VALUE != null && x.TOTAL_VALUE != "") || (x.AUTHORIZED_BY_ID != null && x.AUTHORIZED_BY_ID != "")) {
//                if (x.PETTY_CASH_CATEGORY_ID == null || x.PETTY_CASH_CATEGORY_ID == "") {
//                    x.PETTY_CASH_CATEGORY_VALID = false;
//                }
//                if (x.TOTAL_VALUE == null || x.TOTAL_VALUE == 0 || x.TOTAL_VALUE == "") {
//                    x.TOTAL_VALUE_VALID = false;
//                }
//                if (x.AUTHORIZED_BY_ID == null || x.AUTHORIZED_BY_ID == "") {
//                    x.AUTHORIZED_BY_ID_VALID = false;
//                }
//            }
//            if (!x.PETTY_CASH_CATEGORY_VALID || !x.TOTAL_VALUE_VALID || !x.AUTHORIZED_BY_ID_VALID) {
//                $scope.CASHUP.PETTYCASHVALID = false;
//            }
//        });
//    }
//    $scope.SkipStep = function () {
//        if (confirm("You are skipping the step, the unsaved data will be lost. Do you wish to proceed?")) {
//            $scope.GetNextStep();
//        }
//    }
//    $scope.InsertPettyCashDeclaration = function () {
//        $scope.ValidatePettyCash();
//        if ($scope.CASHUP.PETTYCASHVALID) {
//            var CashupModelObj = new Object();
//            CashupModelObj.ID = $scope.CASHUP.ID;
//            CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
//            CashupModelObj.BRANCH_ID = $scope.CASHUP.BRANCH_ID;
//            CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
//            CashupModelObj.TOTAL_PETTY_CASH = $scope.CASHUP.TOTAL_TOTAL_VAL;
//            angular.forEach($scope.PettyCashList, function (Pcash) {
//                Pcash.UPLOAD_IDS = "";
//                angular.forEach(Pcash.UploadedFiles, function (fl) {
//                    Pcash.UPLOAD_IDS = Pcash.UPLOAD_IDS == "" ? fl.ID : Pcash.UPLOAD_IDS + ':;:' + fl.ID;
//                });
//            });
//            CashupModelObj.DECLARATION_DETAILS = $scope.PettyCashList;
//            CashupModelObj.NOTE_TABLE_ID = $scope.CASHUP.PCASH_NOTES_ID;
//            CashupModelObj.NOTE_TYPE_ID = 4;
//            CashupModelObj.NOTE = $scope.CASHUP.PCASH_NOTES;
//            PrcCommMethods.CASHUP_API(CashupModelObj, 'INS_PETTY_CASH_DECLARATION').then(function (data) {
//                $scope.CASHUP.STEP_NO = $scope.GetNextStep();
//                console.log('==========');
//                console.log($scope.CASHUP.STEP_NO);
//                $scope.CASHUP.ACTUAL_STEP_NO = $scope.CASHUP.STEP_NO;
//                $scope.CASHUP.PCASH_NOTES_ID = data.data;
//            });
//        }
//    };
//    $scope.InsertChequeDeclaration = function () {
//        var CashupModelObj = new Object();
//        CashupModelObj.ID = $scope.CASHUP.ID;
//        CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
//        CashupModelObj.BRANCH_ID = $scope.CASHUP.BRANCH_ID;
//        CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
//        CashupModelObj.TOTAL_CHEQUE = $scope.CASHUP.TOTAL_CHEQUE;
//        CashupModelObj.DECLARATION_DETAILS = $scope.ChequeList;
//        //var httprequest = $http({
//        //    method: 'POST',
//        //    url: CommService.Get_CASHUP_API() + 'api/CashupAPI/INS_CHEQUE_DECLARATION',
//        //    data: CashupModelObj
//        //}).then(function (data) {
//        PrcCommMethods.CASHUP_API(CashupModelObj, 'INS_CHEQUE_DECLARATION').then(function (data) {
//            $scope.CASHUP.STEP_NO = $scope.GetNextStep();
//            $scope.CASHUP.ACTUAL_STEP_NO = $scope.CASHUP.STEP_NO;
//        });
//    };
//    $scope.INS_ACC_CUST_DECLARATION = function () {
//        var CashupModelObj = new Object();
//        CashupModelObj.ID = $scope.CASHUP.ID;
//        CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
//        CashupModelObj.BRANCH_ID = $scope.CASHUP.BRANCH_ID;
//        CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
//        CashupModelObj.ACCOUNT_TOTAL = $scope.CASHUP.ACCOUNT_TOTAL;
//        var cnt = 0;
//        var acc_arr = [];
//        angular.forEach($scope.AccCustomerList, function (AccCustomer) {
//            if (AccCustomer.AMOUNT != '' && AccCustomer.AMOUNT != 0) {
//                acc_arr[cnt] = AccCustomer;
//                cnt++;
//            }
//        });

//        CashupModelObj.DECLARATION_DETAILS = acc_arr;//$scope.AccCustomerList;//angular.copy($filter('filter')($scope.AccCustomerList, { ID: '!0' }));
//        PrcCommMethods.CASHUP_API(CashupModelObj, 'INS_ACC_CUST_DECLARATION').then(function (data) {
//            $scope.CASHUP.STEP_NO = $scope.GetNextStep();
//            $scope.CASHUP.ACTUAL_STEP_NO = $scope.CASHUP.STEP_NO;
//        });
//    };
//    $scope.InsertEntry_TypeDeclaration = function () {
//        var VoucherList = [];
//        var cnt = 0;
//        angular.forEach($scope.VoucherIssuedList, function (voucherissue) {
//            if (voucherissue.VALUE != undefined && voucherissue.VALUE != '' && voucherissue.VALUE != '0' && voucherissue.ENTRY_TYPE_ID == 1) {
//                var voucher = new Object();
//                voucher.ENTRY_TYPE_ID = voucherissue.ENTRY_TYPE_ID;
//                voucher.ENTRY_TYPE_DETAIL_ID = voucherissue.ENTRY_TYPE_DETAIL_ID;
//                voucher.VOUCHER_TYPE = voucherissue.VOUCHER_TYPE;
//                voucher.CODE = voucherissue.CODE;
//                voucher.VALUE = parseFloat(voucherissue.VALUE).toFixed(2);
//                voucher.VALIDITY_DATE = voucherissue.VALIDITY_DATE;
//                voucher.CUSTOMER_NAME = voucherissue.CUSTOMER_NAME;
//                voucher.MODE = voucherissue.MODE;
//                voucher.CHECK_NO = voucherissue.CHECK_NO;
//                voucher.NOTE = voucherissue.NOTE;
//                voucher.IS_REDEEMED = voucherissue.IS_REDEEMED;
//                voucher.IS_COMPLIMENTARY = false;
//                VoucherList[cnt] = voucher;
//                cnt++;
//            }
//        })
//        var CashupModelObj = new Object();
//        CashupModelObj.ID = $scope.CASHUP.ID;
//        CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
//        CashupModelObj.BRANCH_ID = $scope.CASHUP.BRANCH_ID;
//        CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
//        CashupModelObj.ISSUE_TOTAL = $scope.CASHUP.ISSUE_TOTAL;
//        CashupModelObj.REDEEMED_TOTAL = $scope.CASHUP.REDEEMED_TOTAL;
//        CashupModelObj.DECLARATION_DETAILS = VoucherList;
//        //var httprequest = $http({
//        //    method: 'POST',
//        //    url: CommService.Get_CASHUP_API() + 'api/CashupAPI/INS_ENTRY_TYPE_DECLARATION',
//        //    data: CashupModelObj
//        //}).then(function (data) {
//        PrcCommMethods.CASHUP_API(CashupModelObj, 'INS_ENTRY_TYPE_DECLARATION').then(function (data) {
//            $scope.CASHUP.STEP_NO = $scope.GetNextStep();
//            $scope.CASHUP.ACTUAL_STEP_NO = $scope.CASHUP.STEP_NO;
//            $scope.$parent.$parent.overlay_loading_coffee = 'none';
//        });
//    };
//    $scope.InsertEntry_DepositDeclaration = function () {
//        var VoucherList = [];
//        var cnt = 0;
//        angular.forEach($scope.VoucherIssuedList, function (voucherissue) {
//            if (voucherissue.VALUE != undefined && voucherissue.VALUE != '' && voucherissue.VALUE != '0' && voucherissue.ENTRY_TYPE_ID == 3) {
//                var voucher = new Object();
//                voucher.ENTRY_TYPE_ID = voucherissue.ENTRY_TYPE_ID;
//                voucher.ENTRY_TYPE_DETAIL_ID = voucherissue.ENTRY_TYPE_DETAIL_ID;
//                voucher.VOUCHER_TYPE = voucherissue.VOUCHER_TYPE;
//                voucher.CODE = voucherissue.CODE;
//                voucher.VALUE = voucherissue.VALUE;
//                voucher.VALIDITY_DATE = voucherissue.VALIDITY_DATE;
//                voucher.CUSTOMER_NAME = voucherissue.CUSTOMER_NAME;
//                voucher.MODE = voucherissue.MODE;
//                voucher.CHECK_NO = voucherissue.CHECK_NO;
//                voucher.NOTE = voucherissue.NOTE;
//                voucher.IS_REDEEMED = voucherissue.IS_REDEEMED;
//                voucher.IS_COMPLIMENTARY = false;
//                VoucherList[cnt] = voucher;
//                cnt++;
//            }
//        })
//        var CashupModelObj = new Object();
//        CashupModelObj.ID = $scope.CASHUP.ID;
//        CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
//        CashupModelObj.BRANCH_ID = $scope.CASHUP.BRANCH_ID;
//        CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
//        CashupModelObj.ISSUE_TOTAL = $scope.CASHUP.DEPOSIT_TOTAL;
//        CashupModelObj.REDEEMED_TOTAL = $scope.CASHUP.DEPOSIT_REDEEMED_TOTAL;
//        CashupModelObj.DECLARATION_DETAILS = VoucherList;
//        //var httprequest = $http({
//        //    method: 'POST',
//        //    url: CommService.Get_CASHUP_API() + 'api/CashupAPI/INS_ENTRY_DEPOSIT_DECLARATION',
//        //    data: CashupModelObj
//        //}).then(function (data) {
//        PrcCommMethods.CASHUP_API(CashupModelObj, 'INS_ENTRY_DEPOSIT_DECLARATION').then(function (data) {
//            $scope.CASHUP.STEP_NO = $scope.GetNextStep();
//            $scope.CASHUP.ACTUAL_STEP_NO = $scope.CASHUP.STEP_NO;
//            $scope.$parent.$parent.overlay_loading_coffee = 'none';
//        });
//    };
//    $scope.ValidControls = function (x) {
//        x.DISCOUNT_VALID = true;
//        x.AUTHORIZED_BY_VALID = true;
//        x.REASON_VALID = true;
//    }
//    $scope.ValidateComplementary = function () {
//        $scope.CASHUP.COMPLEMENTARYVALID = true;
//        angular.forEach($scope.ComplimentaryList, function (x) {
//            x.DISCOUNT_VALID = true;
//            x.AUTHORIZED_BY_VALID = true;
//            x.REASON_VALID = true;
//            if ((x.AUTHORIZED_BY != null && x.AUTHORIZED_BY != "") || (x.CHECK_NO != null && x.CHECK_NO != "") || (x.VOUCHER_TYPE != null && x.VOUCHER_TYPE != "")
//                || (x.CUSTOMER_NAME != null && x.CUSTOMER_NAME != "") || (x.CODE != null && x.CODE != "") || (x.MODE != null && x.MODE != "")
//                || (x.DISCOUNT != null && x.DISCOUNT != "") || (x.NOTE != null && x.NOTE != "")) {

//                if (x.DISCOUNT == null || x.DISCOUNT == 0 || x.DISCOUNT == "") {
//                    x.DISCOUNT_VALID = false;
//                }
//                if (x.AUTHORIZED_BY == null || x.AUTHORIZED_BY == 0 || x.AUTHORIZED_BY == "") {
//                    x.AUTHORIZED_BY_VALID = false;
//                }
//                if (x.CUSTOMER_NAME == null || x.CUSTOMER_NAME == 0 || x.CUSTOMER_NAME == "") {
//                    x.REASON_VALID = false;
//                }

//            }
//            if (!x.DISCOUNT_VALID || !x.AUTHORIZED_BY_VALID || !x.REASON_VALID) {
//                $scope.CASHUP.COMPLEMENTARYVALID = false;
//            }
//        });
//    }
//    $scope.InsertEntry_VoidDeclaration = function () {
//        $scope.ValidateComplementary();
//        if ($scope.CASHUP.COMPLEMENTARYVALID) {
//            var CashupModelObj = new Object();
//            var VoucherList = [];
//            var cnt = 0;
//            angular.forEach($scope.VoidList, function (voucherissue) {
//                if (voucherissue.VALUE != undefined && voucherissue.VALUE != '' && voucherissue.ENTRY_TYPE_ID == 7) {
//                    var voucher = new Object();
//                    voucher.ENTRY_TYPE_ID = voucherissue.ENTRY_TYPE_ID;
//                    voucher.ENTRY_TYPE_DETAIL_ID = voucherissue.ID;
//                    voucher.CODE = voucherissue.CODE;
//                    voucher.VALUE = voucherissue.VALUE;
//                    voucher.CHECK_NO = voucherissue.CHECK_NO;
//                    VoucherList[cnt] = voucher;
//                    cnt++;
//                }
//            });
//            CashupModelObj.DECLARATION_DETAILS = VoucherList;
//            VoucherList = [];
//            cnt = 0;
//            angular.forEach($scope.ComplimentaryList, function (voucherissue) {
//                if (voucherissue.VALUE != undefined && voucherissue.VALUE != '' && voucherissue.ENTRY_TYPE_ID == 6) {
//                    var voucher = new Object();
//                    voucher.ENTRY_TYPE_ID = voucherissue.ENTRY_TYPE_ID;
//                    voucher.ENTRY_TYPE_DETAIL_ID = 0;//voucherissue.ENTRY_TYPE_DETAIL_ID;
//                    voucher.VOUCHER_TYPE = voucherissue.VOUCHER_TYPE;
//                    voucher.CODE = voucherissue.CODE;
//                    voucher.VALUE = parseFloat(voucherissue.VALUE).toFixed(2);
//                    voucher.CHECK_NO = voucherissue.CHECK_NO;
//                    voucher.CUSTOMER_NAME = voucherissue.CUSTOMER_NAME;
//                    voucher.MODE = voucherissue.MODE;
//                    voucher.NOTE = voucherissue.NOTE;
//                    voucher.AUTHORIZED_BY = voucherissue.AUTHORIZED_BY;
//                    voucher.DISCOUNT = parseFloat(voucherissue.DISCOUNT).toFixed(2);
//                    voucher.FOOD = voucherissue.FOOD;
//                    voucher.DRINKS = voucherissue.DRINKS;
//                    voucher.LIGHT_SPEED_ACCOUNTFISCID = voucherissue.LIGHT_SPEED_ACCOUNTFISCID;
//                    VoucherList[cnt] = voucher;
//                    cnt++;
//                }
//            });

//            CashupModelObj.COMP_DECLARATION = VoucherList;
//            CashupModelObj.ID = $scope.CASHUP.ID;
//            CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
//            CashupModelObj.BRANCH_ID = $scope.CASHUP.BRANCH_ID;
//            CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
//            CashupModelObj.VOID_TOTAL = $scope.CASHUP.VOID_TOTAL;
//            CashupModelObj.COMPLEMENTRY_TOTAL = $scope.CASHUP.COMP_TOTAL;
//            CashupModelObj.NOTE_TABLE_ID = $scope.CASHUP.COMP_NOTES_ID;
//            CashupModelObj.NOTE_TYPE_ID = 5;
//            CashupModelObj.NOTE = $scope.CASHUP.COMP_NOTES;
//            PrcCommMethods.CASHUP_API(CashupModelObj, 'INS_ENTRY_VOID_DECLARATION').then(function (data) {
//                $scope.CASHUP.STEP_NO = $scope.GetNextStep();
//                $scope.CASHUP.ACTUAL_STEP_NO = $scope.CASHUP.STEP_NO;
//                $scope.CASHUP.COMP_NOTES_ID = data.data;
//                $scope.$parent.$parent.overlay_loading_coffee = 'none';
//            });
//        }
//    };
//    $scope.SELECT_SESSION = function (SESSION, index) {
//        angular.forEach($scope.SessionList, function (sess) {
//            sess.SELECTED = false;
//            document.getElementById("SessionRadio" + sess.SESSION_MAPPING_ID).checked = false;
//        });
//        $scope.$parent.$parent.overlay_loading_coffee = 'block';
//        document.getElementById("SessionRadio" + SESSION.SESSION_MAPPING_ID).checked = true;
//        $scope.CASHUP.SESSION = SESSION;
//        SESSION.SELECTED = true;
//        $scope.CASHUP.SESSION_ID = $scope.CASHUP.SESSION.SESSION_MAPPING_ID;
//        $scope.ReviewTab(index);
//        $scope.GET_CASHUP_BY_ID();
//        $scope.CASHUP.COMP_NOTES = null;
//        $scope.CASHUP.REV_NOTES = null;
//        $scope.CASHUP.FLOAT_NOTES = null;
//        $scope.CASHUP.CASH_NOTES = null;
//        $scope.CASHUP.CARD_NOTES = null;
//        $scope.CASHUP.PCASH_NOTES = null;
//        $scope.CASHUP.INDEX = index;


//    }
//    $scope.SELECT_SESSION_Init = function (SESSION, index) {
//        angular.forEach($scope.SessionList, function (sess) {
//            sess.SELECTED = false;

//        });
//        $scope.$parent.$parent.overlay_loading_coffee = 'block';
//        $scope.CASHUP.SESSION = SESSION;
//        SESSION.SELECTED = true;
//        $scope.CASHUP.SESSION_ID = $scope.CASHUP.SESSION.SESSION_MAPPING_ID;
//        $scope.ReviewTab(index);
//        $scope.GET_CASHUP_BY_ID();
//        $scope.CASHUP.COMP_NOTES = null;
//        $scope.CASHUP.REV_NOTES = null;
//        $scope.CASHUP.FLOAT_NOTES = null;
//        $scope.CASHUP.CASH_NOTES = null;
//        $scope.CASHUP.CARD_NOTES = null;
//        $scope.CASHUP.PCASH_NOTES = null;

//    }
//    $scope.GET_CASHUP_BY_ID = function () {

//        var CashupModelObj = new Object();
//        CashupModelObj.CASHUP_MAIN_ID = $scope.CASHUP.CASHUP_MAIN_ID;
//        CashupModelObj.SESSION_ID = $scope.CASHUP.SESSION_ID;
//        CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
//        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_CASHUP_BY_ID').then(function (data) {
//            if (data != undefined && data.data != undefined && data.data.Table.length > 0) {

//                $scope.CASHUP.ID = data.data.Table[0].ID;
//                $scope.GET_REVENUE_CENTERS();
//                $scope.CASHUP.BRANCH_ID = data.data.Table[0].BRANCH_ID;
//                //$scope.CASHUP.AREA_ID = data.data[0].AREA_ID;
//                $scope.CASHUP.TILL_ID = data.data.Table[0].TILL_ID;
//                //$scope.CASHUP.SESSION_ID = data.data.Table[0].SESSION_ID;
//                $scope.CASHUP.SESSION.CASHUP_HEADER_ID = data.data.Table[0].ID;
//                $scope.CASHUP.TYPE = data.data.Table[0].CASHUP_TYPE;
//                $scope.CASHUP.CASHUP_DATE = data.data.Table[0].CASHUP_DATE;

//                $scope.CASHUP.STEP_NO = angular.copy(data.data.Table[0].STEP_NO);
//                $scope.CASHUP.ACTUAL_STEP_NO = data.data.Table[0].STEP_NO;

//                $scope.CASHUP.TOTAL_FLOAT = data.data.Table[0].FLOAT_TOTAL;
//                $scope.CASHUP.TOTAL_CASH = data.data.Table[0].CASH_TOTAL;
//                $scope.CASHUP.ORIGINAL_FILE_NAME = data.data.Table[0].ORIGINAL_FILE_NAME;
//                $scope.CASHUP.UPL_ID = data.data.Table[0].UPL_ID;
//                $scope.CASHUP.INTEGRATION_SYSTEM_ID = data.data.Table[0].INTEGRATION_SYSTEM_ID;

//                $scope.CASHUP.INTEGRATION_URL = data.data.Table[0].URL_PATH;
//                $scope.CASHUP.ACCESS_TOKEN = data.data.Table[0].API_KEY;
//                $scope.GOTOSTEP($scope.CASHUP.STEP_NO);
//                $scope.GET_EPOS_HEADER();
//                $scope.GET_EPOS_DATA();
//                for (var i = 0; i < data.data.Table1.length; i++) {
//                    if (data.data.Table1[i].NOTE_TYPE_ID == 1) {
//                        $scope.CASHUP.FLOAT_NOTES_ID = data.data.Table1[i].ID;
//                        $scope.CASHUP.FLOAT_NOTES = data.data.Table1[i].NOTE;
//                    }
//                    else if (data.data.Table1[i].NOTE_TYPE_ID == 2) {
//                        $scope.CASHUP.CASH_NOTES_ID = data.data.Table1[i].ID;
//                        $scope.CASHUP.CASH_NOTES = data.data.Table1[i].NOTE;
//                    }
//                    else if (data.data.Table1[i].NOTE_TYPE_ID == 3) {
//                        $scope.CASHUP.CARD_NOTES_ID = data.data.Table1[i].ID;
//                        $scope.CASHUP.CARD_NOTES = data.data.Table1[i].NOTE;
//                    }
//                    else if (data.data.Table1[i].NOTE_TYPE_ID == 4) {
//                        $scope.CASHUP.PCASH_NOTES_ID = data.data.Table1[i].ID;
//                        $scope.CASHUP.PCASH_NOTES = data.data.Table1[i].NOTE;
//                    }
//                    else if (data.data.Table1[i].NOTE_TYPE_ID == 5) {
//                        $scope.CASHUP.COMP_NOTES_ID = data.data.Table1[i].ID;
//                        $scope.CASHUP.COMP_NOTES = data.data.Table1[i].NOTE;
//                    }


//                }
//            }
//            else {
//                $scope.CASHUP_RESET();
//            }
//            $scope.$parent.$parent.overlay_loading_coffee = 'none';
//        });

//    };
//    $scope.GET_PDQ_BY_BRANCH = function () {
//        var CashupModelObj = new Object();
//        CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
//        CashupModelObj.BRANCH_ID = $scope.CASHUP.BRANCH_ID;
//        //var httprequest = $http({
//        //    method: 'POST',
//        //    url: CommService.Get_CASHUP_API() + 'api/CashupAPI/GET_PDQ_BY_BRANCH',
//        //    data: CashupModelObj
//        //}).then(function (data) {
//        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_PDQ_BY_BRANCH').then(function (data) {
//            if (data != undefined && data.data != undefined && data.data.length > 0) {
//                $scope.BlankCard.PDQList = data.data;
//                $scope.PDQList = data.data;
//                var count_blank = 0;
//                angular.forEach($scope.CardList, function (Card) {
//                    Card.PDQList = data.data;
//                    Card.AREA_ID = $scope.CASHUP.AREA_ID;
//                    Card.ID == 0 ? count_blank++ : '';
//                });
//                $scope.BlankCard.AREA_ID = $scope.CASHUP.AREA_ID;
//                count_blank == 0 ? $scope.CardList.push(angular.copy($scope.BlankCard)) : '';
//            }
//            $scope.$parent.$parent.overlay_loading_coffee = 'none';
//        });
//    };
//    $scope.GET_CARD_DECLERATION = function () {
//        var CashupModelObj = new Object();
//        CashupModelObj.ID = $scope.CASHUP.ID;
//        //var httprequest = $http({
//        //    method: 'POST',
//        //    url: CommService.Get_CASHUP_API() + 'api/CashupAPI/GET_CARD_DECLERATION',
//        //    data: CashupModelObj
//        //}).then(function (data) {
//        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_CARD_DECLERATION').then(function (data) {
//            if (data != undefined && data.data != undefined && data.data.length > 0) {
//                $scope.CardList = data.data;
//            }
//            else {
//                $scope.CardList = [];
//                $scope.AddCardLine();
//            }
//            $scope.GET_PDQ_BY_BRANCH();
//        });
//    };
//    $scope.DELETE_UPLOAD_CARD_ALL = function (Array, item, index, FLAG) {
//        if (confirm('Are you sure you want to delete?')) {
//            Array.UploadedFiles.splice(index, 1);
//            var CashupModelObj = new Object();
//            CashupModelObj.ID = parseInt(item.ID);
//            PrcCommMethods.CASHUP_API(CashupModelObj, 'DELETE_UPLOAD').then(function (data) {
//                $scope.ShowAlert('Success', 'Delete success.', 5000);

//            });
//        }
//    };
//    $scope.initcasdList = function (CARD_LINE) {
//        if (CARD_LINE.ID != 0) {
//            if (CARD_LINE.UploadedFiles == undefined) {
//                CARD_LINE.UploadedFiles = [];
//            }
//            var FileArray = CARD_LINE.FILE_NAME != "" ? CARD_LINE.FILE_NAME.split(':;:') : [];
//            if (FileArray.length > 0) {
//                var obj = new Object()
//                obj.ID = CARD_LINE.UPLOAD_IDS;
//                obj.FILE_PATH = FileArray[0];
//                obj.SERVER_FILE_NAME = FileArray[1];
//                obj.ORIGINAL_FILE_NAME = FileArray[2];
//                CARD_LINE.UploadedFiles.push(obj);
//            }
//        }
//    }
//    $scope.GET_PETTY_CASH_DECLERATION = function () {
//        var CashupModelObj = new Object();
//        CashupModelObj.ID = $scope.CASHUP.ID;
//        //var httprequest = $http({
//        //    method: 'POST',
//        //    url: CommService.Get_CASHUP_API() + 'api/CashupAPI/GET_PETTY_CASH_DECLERATION',
//        //    data: CashupModelObj
//        //}).then(function (data) {
//        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_PETTY_CASH_DECLERATION').then(function (data) {
//            $scope.PettyCashList = [];
//            if (data != undefined && data.data != undefined && data.data.length > 0) {
//                $scope.PettyCashList = data.data;
//            }
//            $scope.GET_PETTY_CASH_CATEGORIES();
//            $scope.$parent.$parent.overlay_loading_coffee = 'none';
//        });
//    };
//    $scope.GET_PETTY_CASH_CATEGORIES = function () {
//        var CashupModelObj = new Object();
//        CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
//        CashupModelObj.BRANCH_ID = $scope.CASHUP.BRANCH_ID;
//        //var httprequest = $http({
//        //    method: 'POST',
//        //    url: CommService.Get_CASHUP_API() + 'api/CashupAPI/GET_PETTY_CASH_CATEGORIES',
//        //    data: CashupModelObj
//        //}).then(function (data) {
//        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_PETTY_CASH_CATEGORIES').then(function (data) {
//            if (data != undefined && data.data != undefined && data.data.length > 0) {
//                $scope.BlankPettyCash.CategoryList = data.data;
//                //if ($scope.PettyCashList.length == 0) {
//                //    $scope.PettyCashList.push(angular.copy($scope.BlankPettyCash));
//                //}
//                $scope.CategoryList = data.data;
//                $scope.GET_ENTITY_STAFF();
//            }

//        });
//    };
//    $scope.GET_ENTITY_STAFF = function () {
//        var CashupModelObj = new Object();
//        CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
//        CashupModelObj.BRANCH_ID = $scope.CASHUP.BRANCH_ID;
//        //var httprequest = $http({
//        //    method: 'POST',
//        //    url: CommService.Get_CASHUP_API() + 'api/CashupAPI/GET_RESTAURANT_STAFF',
//        //    data: CashupModelObj
//        //}).then(function (data) {
//        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_ENTITY_STAFF').then(function (data) {
//            if (data != undefined && data.data != undefined && data.data.length > 0) {
//                $scope.BlankPettyCash.StaffList = data.data;
//                $scope.StaffList = data.data;
//                var PCASHCOUNT = 0;
//                angular.forEach($scope.PettyCashList, function (PCash) {
//                    PCash.CategoryList = $scope.CategoryList;
//                    PCash.StaffList = data.data;
//                    PCash.ID == 0 ? PCASHCOUNT++ : '';
//                    PCash.PETTY_CASH_CATEGORY_VALID = true;
//                    PCash.TOTAL_VALUE_VALID = true;
//                    PCash.AUTHORIZED_BY_ID_VALID = true;
//                });
//                PCASHCOUNT == 0 ? $scope.PettyCashList.push(angular.copy($scope.BlankPettyCash)) : '';
//            }

//        });
//    };
//    $scope.GET_DEPOSITS = function () {
//        var CashupModelObj = new Object();
//        CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
//        CashupModelObj.BRANCH_ID = $scope.CASHUP.BRANCH_ID;

//        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_DEPOSITS').then(function (data) {
//            $scope.DepositsList = [];
//            if (data != undefined && data.data != undefined && data.data.length > 0) {
//                $scope.DepositsList = data.data;
//            }

//        });
//    };
//    $scope.GET_EPOS_HEADER = function () {
//        var CashupModelObj = new Object();
//        CashupModelObj.ID = $scope.CASHUP.ID;

//        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_EPOS_HEADER').then(function (data) {
//            if (data != undefined && data.data != undefined && data.data.length > 0) {
//                $scope.EPOS_HEADER_DATA = data.data;

//            }
//            else {
//                $scope.EPOS_HEADER_DATA = [];

//            }
//            $scope.GET_CASHUP_CATEGORY_BIFURCATION();
//        });
//    };
//    $scope.EPOS_ACCOUNT_GROUPS_DATA = [];
//    $scope.GET_EPOS_DATA = function () {
//        var CashupModelObj = new Object();
//        CashupModelObj.ID = $scope.CASHUP.ID;
//        CashupModelObj.INTEGRATION_SYSTEM_ID = $scope.CASHUP.INTEGRATION_SYSTEM_ID;

//        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_EPOS_DATA').then(function (data) {
//            if (data != undefined && data.data != undefined && data.data.length > 0) {
//                $scope.EPOS_ACCOUNT_GROUPS_DATA = data.data;
//                $scope.stop();
//            }
//            else {
//                $scope.EPOS_ACCOUNT_GROUPS_DATA = [];

//            }
//        });
//    };
//    $scope.GET_ACCOUNT_GROUP_DETAILS = function (EPOS_ACCOUNT_GROUP_DATA) {
//        var CashupModelObj = new Object();
//        CashupModelObj.ID = $scope.CASHUP.ID;
//        CashupModelObj.PRODUCT_IDS = EPOS_ACCOUNT_GROUP_DATA.PRODUCT_ID;
//        CashupModelObj.INTEGRATION_SYSTEM_ID = $scope.CASHUP.INTEGRATION_SYSTEM_ID;
//        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_ACCOUNT_GROUP_DETAILS').then(function (data) {
//            if (data != undefined && data.data != undefined && data.data.length > 0) {
//                EPOS_ACCOUNT_GROUP_DATA.EPOS_ACCOUNT_GROUP_DETAILS = data.data;
//                EPOS_ACCOUNT_GROUP_DATA.SHOWDETAILS = !EPOS_ACCOUNT_GROUP_DATA.SHOWDETAILS;
//            }
//            else {
//                EPOS_ACCOUNT_GROUP_DATA.EPOS_ACCOUNT_GROUP_DETAILS = [];
//                EPOS_ACCOUNT_GROUP_DATA.SHOWDETAILS = !EPOS_ACCOUNT_GROUP_DATA.SHOWDETAILS;
//            }
//        });
//    };
//    $scope.GET_CHEQUE_DECLARATION = function () {
//        var CashupModelObj = new Object();
//        CashupModelObj.ID = $scope.CASHUP.ID;
//        //var httprequest = $http({
//        //    method: 'POST',
//        //    url: CommService.Get_CASHUP_API() + 'api/CashupAPI/GET_CHEQUE_DECLARATION',
//        //    data: CashupModelObj
//        //}).then(function (data) {
//        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_CHEQUE_DECLARATION').then(function (data) {
//            $scope.ChequeList = [];
//            if (data != undefined && data.data != undefined && data.data.length > 0) {
//                $scope.ChequeList = data.data;
//            }
//            var PCASHCOUNT = 0;
//            angular.forEach($scope.ChequeList, function (PCash) {
//                PCash.ID == 0 ? PCASHCOUNT++ : '';
//            });
//            PCASHCOUNT == 0 ? $scope.ChequeList.push(angular.copy($scope.BlankCheque)) : '';
//            $scope.$parent.$parent.overlay_loading_coffee = 'none';
//        });
//    };
//    $scope.GET_CASHUP_CATEGORY_BIFURCATION = function () {
//        var CashupModelObj = new Object();
//        CashupModelObj.ID = $scope.CASHUP.ID;
//        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_CASHUP_CATEGORY_BIFURCATION').then(function (data) {
//            $scope.CASHUP.EPOS_CAT_DATA = [];
//            $scope.CASHUP.EPOS_DATA = [];
//            if (data != undefined && data.data != undefined) {
//                $scope.CASHUP.EPOS_CAT_DATA = data.data.Table;
//                $scope.CASHUP.EPOS_DATA = data.data.Table1;
//                $scope.CASHUP.MEDIA_DATA = data.data.Table4;
//                $scope.EPOS_TOTAL = 0;
//                angular.forEach($scope.CASHUP.EPOS_DATA, function (value) {
//                    if (value.MEDIA != 'Transitory') {
//                        $scope.EPOS_TOTAL = $scope.EPOS_TOTAL + value.SALES_AMT;
//                    }
//                });
//                $scope.CASHUP.REV_CASHUP_TOTAL = $scope.CASHUP.DEPOSIT_TOTAL + $scope.CASHUP.TOTAL_CASH + $scope.CASHUP.TOTAL_TOTAL_VAL + $scope.CASHUP.TOTAL_CHEQUE + $scope.CASHUP.TOTAL_CARD + $scope.CASHUP.REDEEMED_TOTAL + $scope.CASHUP.ACCOUNT_TOTAL + $scope.CASHUP.DEPOSIT_REDEEMED_TOTAL + $scope.CASHUP.ISSUE_TOTAL;
//                //$scope.CASHUP.EPOS_HEADER_DATA = data.data.Table2;
//                // $scope.CASHUP.VARIANCE_TOTAL = $scope.CASHUP.VARIANCE_CASH + $scope.CASHUP.VARIANCE_CARD + $scope.CASHUP.VARIANCE_REDEEMED + $scope.CASHUP.VARIANCE_ACCOUNT + $scope.CASHUP.VARIANCE_PETTY_CASH;
//                $scope.CASHUP.VARIANCE_TOTAL = $scope.CASHUP.VARIANCE_CASH + $scope.CASHUP.VARIANCE_CARD + $scope.CASHUP.VARIANCE_REDEEMED + $scope.CASHUP.VARIANCE_ACCOUNT + $scope.CASHUP.VARIANCE_PETTY_CASH + $scope.CASHUP.DEPOSIT_TOTAL + $scope.CASHUP.DEPOSIT_REDEEMED_TOTAL;
//            }


//        });
//    };
//    $scope.GET_REVENUE_CENTERS = function () {
//        var CashupModelObj = new Object();
//        CashupModelObj.ID = $scope.CASHUP.ID;
//        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_REVENUE_CENTERS').then(function (data) {
//            $scope.CASHUP.REVENUE_CENTERS = [];
//            if (data != undefined && data.data != undefined) {
//                $scope.CASHUP.REVENUE_CENTERS = data.data.Table;
//            }
//        });
//    };
//    $scope.INS_UPD_REVENUE_CENTERS = function () {
//        var CashupModelObj = new Object();
//        CashupModelObj.ID = $scope.CASHUP.ID;
//        CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
//        var REVENUE_DETAILS = [];
//        var UNIQUE_SESSIONS = $filter('unique')($scope.CASHUP.REVENUE_CENTERS, 'SESSION_NAME');
//        //angular.forEach(UNIQUE_SESSIONS, function (session) {
//        angular.forEach($scope.CASHUP.REVENUE_CENTERS, function (rc) {
//            var detailobj = new Object();
//            detailobj.TABLE_ID = rc.TABLE_ID;
//            detailobj.REVENUECENTER = rc.REVENUECENTER;
//            detailobj.ROWINDEX = rc.ROWINDEX;
//            detailobj.SESSION_ID = rc.SESSION_ID;
//            detailobj.COVERS = rc.COVERS;
//            detailobj.ACTIVE = 1;
//            REVENUE_DETAILS.push(detailobj);
//        });
//        //  });
//        CashupModelObj.DECLARATION_DETAILS = REVENUE_DETAILS;
//        if ($scope.CASHUP.REVENUE_CENTERS != undefined) {
//            PrcCommMethods.CASHUP_API(CashupModelObj, 'INS_UPD_REVENUE_CENTERS').then(function (data) {
//                $scope.GET_REVENUE_CENTERS();
//            });
//        }
//    };
//    $scope.GET_ACC_CUST_DECLARATION = function () {
//        var CashupModelObj = new Object();
//        CashupModelObj.ID = $scope.CASHUP.ID;
//        //var httprequest = $http({
//        //    method: 'POST',
//        //    url: CommService.Get_CASHUP_API() + 'api/CashupAPI/GET_ACC_CUST_DECLARATION',
//        //    data: CashupModelObj
//        //}).then(function (data) {
//        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_ACC_CUST_DECLARATION').then(function (data) {
//            $scope.AccCustomerList = [];
//            if (data != undefined && data.data != undefined && data.data.length > 0) {
//                $scope.AccCustomerList = data.data;
//            }

//            var PCASHCOUNT = 0;
//            angular.forEach($scope.AccCustomerList, function (PCash) {
//                PCash.ID == 0 ? PCASHCOUNT++ : '';
//            });
//            PCASHCOUNT == 0 ? $scope.AccCustomerList.push(angular.copy($scope.BlankAccCustomer)) : '';
//            $scope.$parent.$parent.overlay_loading_coffee = 'none';
//        });
//    };
//    //INS_ENTRY_TYPE_DECLARATION
//    $scope.GET_ENTRY_TYPE_DECLARATION = function () {
//        var CashupModelObj = new Object();
//        CashupModelObj.ID = $scope.CASHUP.ID;
//        //var httprequest = $http({
//        //    method: 'POST',
//        //    url: CommService.Get_CASHUP_API() + 'api/CashupAPI/GET_ENTRY_TYPE_DECLARATION',
//        //    data: CashupModelObj
//        //}).then(function (data) {
//        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_ENTRY_TYPE_DECLARATION').then(function (data) {
//            var VISS_COUNT = 0;
//            var VISR_COUNT = 0;
//            var DISS_COUNT = 0;
//            var DIPR_COUNT = 0;
//            $scope.VoucherIssuedList = [];
//            if (data != undefined && data.data != undefined) {
//                $scope.VoucherIssuedList = data.data.Table;

//                $scope.GET_DEPOSITS();
//            }
//            angular.forEach($scope.VoucherIssuedList, function (VISS) {
//                if (VISS.ENTRY_TYPE_ID == 1) {
//                    VISS.VOUCHER = { ID: VISS.ENTRY_TYPE_DETAIL_ID, CODE: VISS.CODE, VALIDITY_DATE: VISS.VALIDITY_DATE, AMOUNT: VISS.VALUE, ENTRY_TYPE_ID: VISS.ENTRY_TYPE_ID };
//                    VISS.vouchernumbervisible = (VISS.VOUCHER_TYPE == 'Pre-Defined' ? true : false);
//                    VISS.ID == 0 && !VISS.IS_REDEEMED ? VISS_COUNT++ : '';
//                    VISS.ID == 0 && VISS.IS_REDEEMED ? VISR_COUNT++ : '';
//                }
//                if (VISS.ENTRY_TYPE_ID == 3) {
//                    VISS.ID == 0 && !VISS.IS_REDEEMED ? DISS_COUNT++ : '';
//                    VISS.ID == 0 && VISS.IS_REDEEMED ? DIPR_COUNT++ : '';
//                }
//            });

//            var VList = angular.copy($filter('filter')(data.data.Table, { ENTRY_TYPE_ID: 7 }));
//            if (VList.length > 0) {
//                angular.forEach($scope.VoidList, function (Void) {
//                    var VoidObj = angular.copy($filter('filter')(VList, { ENTRY_TYPE_ID: 7, ENTRY_TYPE_DETAIL_ID: Void.ID }, true));
//                    if (VoidObj.length > 0) {
//                        Void.CHECK_NO = VoidObj[0].CHECK_NO;
//                        Void.VALUE = VoidObj[0].VALUE;
//                    }
//                });
//            }
//            $scope.ComplimentaryList = $filter('orderBy')(data.data.Table1, 'ID');//.filter(function (x) { return x.ID != null });// angular.copy($filter('filter')(data.data, { ENTRY_TYPE_ID: 6 }));
//            $scope.GET_ENTITY_STAFF();
//            //   $scope.NotCapturedComps_List = data.data.Table1.filter(function (x) { return x.ID == null });
//            VISS_COUNT == 0 ? $scope.VoucherIssueLine() : '';
//            VISR_COUNT == 0 ? $scope.VoucherRedeemLine() : '';
//            DIPR_COUNT == 0 ? $scope.DepositRecievedLine() : '';
//            DISS_COUNT == 0 ? $scope.DepositRedeemLine() : '';
//            $scope.ComplimentaryLine();
//            $scope.GET_CASHUP_CATEGORY_BIFURCATION();
//            $scope.$parent.$parent.overlay_loading_coffee = 'none';
//        });
//    };
//    $scope.DeleteLine = function (Array, index, IS_REDEEMED, ENTRY_TYPE_ID) {
//        if (ENTRY_TYPE_ID == undefined) {
//            Array.splice(index, 1);
//        }
//        else {
//            Array = Array.filter(function (x) { return x.IS_REDEEMED == IS_REDEEMED && x.ENTRY_TYPE_ID == ENTRY_TYPE_ID }).splice(index, 1);
//        }
//    };
//    $scope.DeleteVoucherLine = function (Array, index, IS_REDEEMED, ENTRY_TYPE_ID) {
//        xArray = Array.filter(function (x) { return x.IS_REDEEMED == IS_REDEEMED && x.ENTRY_TYPE_ID == ENTRY_TYPE_ID });
//        xArray.splice(index, 1);
//        Array = xArray;
//    };
//    $scope.GET_ENTRY_MASTER_DETAILS = function () {
//        var CashupModelObj = new Object();
//        CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
//        CashupModelObj.BRANCH_ID = $scope.CASHUP.BRANCH_ID;
//        //var httprequest = $http({
//        //    method: 'POST',
//        //    url: CommService.Get_CASHUP_API() + 'api/CashupAPI/GET_ENTRY_MASTER_DETAILS',
//        //    data: CashupModelObj
//        //}).then(function (data) {
//        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_ENTRY_MASTER_DETAILS').then(function (data) {
//            if (data != undefined && data.data != undefined) {
//                $scope.MasterEntryList = data.data.Table;
//                $scope.MasterEntryList_Redeemed = data.data.Table;
//                $scope.MasterEntryList_Redeemed = $scope.MasterEntryList_Redeemed.concat(data.data.Table1);
//                $scope.VoidList = angular.copy($filter('filter')(data.data.Table, { ENTRY_TYPE_ID: 7 }));
//                $scope.GET_ENTRY_TYPE_DECLARATION();

//            }
//        });
//    };
//    $scope.GET_FLOAT_CASH_DECLARATION = function () {
//        var CashupModelObj = new Object();
//        CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
//        CashupModelObj.CURRENCY_ID = 1;
//        CashupModelObj.ID = $scope.CASHUP.ID;
//        CashupModelObj.CASHUP_MAIN_ID = $scope.CASHUP.CASHUP_MAIN_ID;
//        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_FLOAT_CASH_DECLARATION').then(function (data) {
//            $scope.DECLERATION_MASTER = data.data.Table;
//            $scope.$parent.$parent.overlay_loading_coffee = 'none';
//            // $scope.GOTOSTEP($scope.CASHUP.STEP_NO);
//        });
//    };
//    $scope.ShowWait = false;

//    $scope.EPOS_REFRESH = function (INTEGRATION_STATUS) {
//        if (confirm('Are you sure you want to Refresh EPOS Data?')) {
//            $scope.$parent.$parent.overlay_loading_coffee = 'block';

//            var CashupModelObj = new Object();
//            CashupModelObj.CASHUP_MAIN_ID = $scope.CASHUP.CASHUP_MAIN_ID;
//            CashupModelObj.INTEGRATION_STATUS = INTEGRATION_STATUS;
//            PrcCommMethods.CASHUP_API(CashupModelObj, 'UPD_CASHUP_MAIN_FOR_INTEGRATION').then(function (data) {
//                if (data.data == 1) {
//                    $scope.ShowWait = true;
//                }
//                $scope.start();


//            });
//        }
//    };
//    var promise;
//    $scope.countx = 0;
//    $scope.start = function () {
//        // stops any running interval to avoid two intervals running at the same time


//        // store the interval promise
//        promise = $interval(setRandomizedCollection, 3000);
//    };

//    // stops the interval
//    $scope.stop = function () {
//        $interval.cancel(promise);
//    };

//    function setRandomizedCollection() {
//        // items to randomize 1 - 11
//        $scope.GET_EPOS_HEADER();
//        $scope.GET_EPOS_DATA();
//        $scope.$parent.$parent.overlay_loading_coffee = 'none';
//        //$scope.countx = $scope.countx + 1;
//        //if ($scope.countx > 5) {

//        //  //  alert($scope.countx);
//        //}
//    }

//    $scope.GET_CASHUP_EPOS_COMPARISON = function () {
//        $scope.$parent.$parent.overlay_loading_coffee = 'block';
//        var CashupModelObj = new Object();
//        CashupModelObj.CASHUP_MAIN_ID = $scope.CASHUP.CASHUP_MAIN_ID;
//        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_CASHUP_EPOS_COMPARISON').then(function (data) {
//            var ACTUAL_DATA_LIST = data.data.Table;
//            $scope.TOTAL_EPOS_LIST = data.data.Table2;
//            $scope.MEDIANAMES = data.data.Table4;
//            $scope.TOTAL_EPOS_CAT_DATA = data.data.Table3;
//            $scope.TOTAL_DATA_CASHUP = {
//                ACTUAL: {
//                    FLOAT_TOTAL: 0,
//                    CASH_TOTAL: 0,
//                    CARDS_TOTAL: 0,
//                    PETTY_CASH: 0,
//                    CHEQUE: 0,
//                    ACCOUNT_TOTAL: 0,
//                    DEPOSIT_RECEIVED_TOTAL: 0,
//                    DEPOSIT_REDEEMED_TOTAL: 0,
//                    VOUCHER_ISSUED_TOTAL: 0,
//                    VOUCHER_REDEEMED_TOTAL: 0,
//                    VOID_TOTAL: 0,
//                    COMPLIMENTARY_TOTAL: 0
//                },
//                EPOS: {
//                    CASH_TOTAL: 0,
//                    CARDS_TOTAL: 0,
//                    PETTY_CASH: 0,
//                    CHEQUE: 0,
//                    ACCOUNT_TOTAL: 0,
//                    DEPOSIT_RECEIVED_TOTAL: 0,
//                    DEPOSIT_REDEEMED_TOTAL: 0,
//                    VOUCHER_ISSUED_TOTAL: 0,
//                    VOUCHER_REDEEMED_TOTAL: 0,
//                    VOID_TOTAL: 0,
//                    COMPLIMENTARY_TOTAL: 0
//                }
//            };
//            $scope.TOTAL_DATA_CASHUP.EPOS.VOUCHER_ISSUED_TOTAL = data.data.Table1[0].GIFT_CERT_TOTAL;
//            $scope.TOTAL_DATA_CASHUP.EPOS.VOID_TOTAL = data.data.Table1[0].VOID_TOTAL_AMOUNT;
//            $scope.TOTAL_DATA_CASHUP.EPOS.COMPLIMENTARY_TOTAL = data.data.Table1[0].DISCOUNT_TOTAL_AMOUNT;

//            angular.forEach(ACTUAL_DATA_LIST, function (VAL) {
//                $scope.TOTAL_DATA_CASHUP.ACTUAL.FLOAT_TOTAL = $scope.TOTAL_DATA_CASHUP.ACTUAL.FLOAT_TOTAL + VAL.FLOAT_TOTAL;
//                $scope.TOTAL_DATA_CASHUP.ACTUAL.CASH_TOTAL = $scope.TOTAL_DATA_CASHUP.ACTUAL.CASH_TOTAL + VAL.CASH_TOTAL;
//                $scope.TOTAL_DATA_CASHUP.ACTUAL.CARDS_TOTAL = $scope.TOTAL_DATA_CASHUP.ACTUAL.CARDS_TOTAL + VAL.CARDS_TOTAL;
//                $scope.TOTAL_DATA_CASHUP.ACTUAL.PETTY_CASH = $scope.TOTAL_DATA_CASHUP.ACTUAL.PETTY_CASH + VAL.PETTY_CASH;
//                $scope.TOTAL_DATA_CASHUP.ACTUAL.CHEQUE = $scope.TOTAL_DATA_CASHUP.ACTUAL.CHEQUE + parseFloat(VAL.CHEQUE == null ? 0 : VAL.CHEQUE);
//                $scope.TOTAL_DATA_CASHUP.ACTUAL.ACCOUNT_TOTAL = $scope.TOTAL_DATA_CASHUP.ACTUAL.ACCOUNT_TOTAL + VAL.ACCOUNT_TOTAL;
//                $scope.TOTAL_DATA_CASHUP.ACTUAL.DEPOSIT_RECEIVED_TOTAL = $scope.TOTAL_DATA_CASHUP.ACTUAL.DEPOSIT_RECEIVED_TOTAL + VAL.DEPOSIT_RECEIVED_TOTAL;
//                $scope.TOTAL_DATA_CASHUP.ACTUAL.DEPOSIT_REDEEMED_TOTAL = $scope.TOTAL_DATA_CASHUP.ACTUAL.DEPOSIT_REDEEMED_TOTAL + VAL.DEPOSIT_REDEEMED_TOTAL;
//                $scope.TOTAL_DATA_CASHUP.ACTUAL.VOUCHER_ISSUED_TOTAL = $scope.TOTAL_DATA_CASHUP.ACTUAL.VOUCHER_ISSUED_TOTAL + VAL.VOUCHER_ISSUED_TOTAL;
//                $scope.TOTAL_DATA_CASHUP.ACTUAL.VOUCHER_REDEEMED_TOTAL = $scope.TOTAL_DATA_CASHUP.ACTUAL.VOUCHER_REDEEMED_TOTAL + VAL.VOUCHER_REDEEMED_TOTAL;
//                $scope.TOTAL_DATA_CASHUP.ACTUAL.VOID_TOTAL = $scope.TOTAL_DATA_CASHUP.ACTUAL.VOID_TOTAL + VAL.VOID_TOTAL;
//                $scope.TOTAL_DATA_CASHUP.ACTUAL.COMPLIMENTARY_TOTAL = $scope.TOTAL_DATA_CASHUP.ACTUAL.COMPLIMENTARY_TOTAL + VAL.COMPLIMENTARY_TOTAL;

//            });
//            $scope.TOTAL_DATA_CASHUP.REV_TOTAL_EPOS = 0;
//            angular.forEach($scope.TOTAL_EPOS_LIST, function (value) {
//                if (value.MEDIA != 'Transitory') {
//                    $scope.TOTAL_DATA_CASHUP.REV_TOTAL_EPOS = $scope.TOTAL_DATA_CASHUP.REV_TOTAL_EPOS + value.SALES_AMT;
//                }
//            });
//            $scope.TOTAL_DATA_CASHUP.REV_TOTAL_CASHUP = $scope.TOTAL_DATA_CASHUP.ACTUAL.DEPOSIT_RECEIVED_TOTAL * 1 + $scope.TOTAL_DATA_CASHUP.ACTUAL.CASH_TOTAL * 1 + $scope.TOTAL_DATA_CASHUP.ACTUAL.PETTY_CASH * 1 + $scope.TOTAL_DATA_CASHUP.ACTUAL.CHEQUE * 1 + $scope.TOTAL_DATA_CASHUP.ACTUAL.CARDS_TOTAL * 1 + $scope.TOTAL_DATA_CASHUP.ACTUAL.VOUCHER_REDEEMED_TOTAL * 1 + $scope.TOTAL_DATA_CASHUP.ACTUAL.ACCOUNT_TOTAL * 1 + $scope.TOTAL_DATA_CASHUP.ACTUAL.DEPOSIT_REDEEMED_TOTAL * 1 + $scope.TOTAL_DATA_CASHUP.ACTUAL.VOUCHER_ISSUED_TOTAL * 1;
//            //   $scope.CASHUP.REV_CASHUP_TOTAL = $scope.CASHUP.TOTAL_FLOAT + $scope.CASHUP.DEPOSIT_TOTAL + $scope.CASHUP.TOTAL_CASH + $scope.CASHUP.TOTAL_TOTAL_VAL + $scope.CASHUP.TOTAL_CHEQUE + $scope.CASHUP.TOTAL_CARD + $scope.CASHUP.REDEEMED_TOTAL + $scope.CASHUP.ACCOUNT_TOTAL + $scope.CASHUP.DEPOSIT_REDEEMED_TOTAL + $scope.CASHUP.ISSUE_TOTAL;
//            //$scope.CASHUP.EPOS_HEADER_DATA = data.data.Table2;
//            //     $scope.CASHUP.VARIANCE_TOTAL = $scope.CASHUP.VARIANCE_CASH + $scope.CASHUP.VARIANCE_CARD + $scope.CASHUP.VARIANCE_REDEEMED + $scope.CASHUP.VARIANCE_ACCOUNT + $scope.CASHUP.VARIANCE_ISSUE;


//            $scope.$parent.$parent.overlay_loading_coffee = 'none';
//        });
//        $scope.ReviewTab(4);
//    };
//    $scope.GET_MASTERDATA_FOR_CASHUP = function () {
//        var CashupModelObj = new Object();
//        CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
//        CashupModelObj.CURRENCY_ID = 1;
//        CashupModelObj.ID = $scope.CASHUP.ID;
//        CashupModelObj.CASHUP_MAIN_ID = $scope.CASHUP.CASHUP_MAIN_ID;
//        //var httprequest = $http({
//        //    method: 'POST',
//        //    url: CommService.Get_CASHUP_API() + 'api/CashupAPI/GET_MASTERDATA_FOR_CASHUP',
//        //    data: CashupModelObj
//        //}).then(function (data) {
//        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_MASTERDATA_FOR_CASHUP').then(function (data) {
//            $scope.BranchList = data.data.Table;
//            $scope.AreaList = data.data.Table1;
//            if ($scope.AreaList.length == 1) {
//                $scope.CASHUP.AREA_ID = $scope.AreaList[0].ID;
//            }
//            $scope.TillList = data.data.Table2;
//            $scope.SessionList = data.data.Table3;
//            angular.forEach($scope.SessionList, function (sessn) {
//                if (sessn.STATUS_ID == 2) {
//                    $scope.CASHUP.COMPLETED_GROUP_ID = sessn.GROUP_ID;
//                }
//            });

//            $scope.DECLERATION_MASTER = data.data.Table4;
//            $scope.TABLIST = data.data.Table6;
//            $scope.GET_FLOAT_CASH_DECLARATION();
//            $scope.CASHUP.IS_TILL_BASED = data.data.Table5[0].IS_TILL_BASED;
//            $scope.CASHUP.IS_SESSION_BASED = data.data.Table5[0].IS_SESSION_BASED;
//            $scope.CASHUP.IS_TILL_BASED ? $scope.CASHUP.TYPE = 1 : '';
//            $scope.CASHUP.IS_SESSION_BASED ? $scope.CASHUP.TYPE = 2 : '';
//            $scope.CASHUP.IS_TILL_BASED && $scope.CASHUP.IS_SESSION_BASED ? $scope.CASHUP.TYPE = null : '';
//            $scope.DateSetUp();
//            if ($scope.$parent.CashUp_Main_STATUS_ID == 3 || $scope.$parent.CashUp_Main_STATUS_ID == 4) {
//                $scope.SessionList = $filter('filter')($scope.SessionList, { GROUP_ID: $scope.CASHUP.COMPLETED_GROUP_ID }, true);
//                $scope.SELECT_SESSION_Init($scope.SessionList[0], 0);
//            }
//            $scope.COMP_REASONS = data.data.Table7;
//        });
//    };
//    $scope.GET_MASTERDATA_FOR_CASHUP();
//    $scope.ShowDiv = function (STEP_NO) {
//        if ($scope.CASHUP.ID != 0 && STEP_NO <= $scope.CASHUP.ACTUAL_STEP_NO) {
//            $scope.CASHUP.STEP_NO = STEP_NO;
//            $scope.GOTOSTEP(STEP_NO);
//        }
//        else {
//            alert('Please complete previous steps to proceed.');
//        }
//    };
//    function splitComponentsByComma(str) {
//        //var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
//        //var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
//        var ret = [];
//        var arr = str.match(/(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g);
//        for (let i in arr) {
//            let element = arr[i];
//            if ('"' === element[0]) {
//                element = element.substr(1, element.length - 2);
//            } else {
//                element = arr[i].replace(/,/g, '').trim();
//            }
//            ret.push(element);
//        }
//        return ret;
//    }

//    $scope.uploadFile_CSV = function () {
//        if ($scope.CASHUP.INTEGRATION_SYSTEM_ID == 0) {
//            $scope.fileDataObj = readFileData.processData($scope.imagesrc[0].Src, ',');
//            delete $scope.fileDataObj[0];
//            var someStr = 'He said "Hello, my name is Foo"';
//            console.log(someStr.replace(/['"]+/g, ''));
//            // delete $scope.fileDataObj[1];
//            //$scope.fileDataObj = $scope.fileDataObj.splice(0, 1);
//            //$scope.fileDataObj = $scope.fileDataObj.splice(1, 1);
//            //$scope.fileData = JSON.stringify($scope.fileDataObj);
//            $scope.DataTable = [];
//            var count = 0;
//            angular.forEach($scope.fileDataObj, function (value, index) {
//                var array = value[0].split(';');

//                if (array[0].replace(/['"]+/g, '') == 'Payment methods') {
//                    count++;
//                }
//                if (array[0] != "" && array[0] != 'Payment methods' && count == 0) {
//                    var EPObj = {
//                        'Accounting groups': array[0].replace(/['"]+/g, ''),
//                        'Quantity': parseFloat(array[1].replace(/['"]+/g, '')),
//                        'Total': parseFloat(array[2].replace(/['"]+/g, '')),
//                        'Discounts': parseFloat(array[3].replace(/['"]+/g, '')),
//                        'Total with tax Less discounts': parseFloat(array[4].replace(/['"]+/g, '')),
//                        'Amount charged': parseFloat(array[5].replace(/['"]+/g, '')),
//                        'Service charge 12.5%': parseFloat(array[6].replace(/['"]+/g, '')),
//                        'Amount taxed': parseFloat(array[7].replace(/['"]+/g, '')),
//                        'VAT 5%': parseFloat(array[8].replace(/['"]+/g, '')),
//                        'Amount taxed': parseFloat(array[9].replace(/['"]+/g, '')),
//                        'VAT 20%': parseFloat(array[10].replace(/['"]+/g, '')),
//                        'Amount taxed': parseFloat(array[11].replace(/['"]+/g, '')),
//                        'Tax Exempt': parseFloat(array[12].replace(/['"]+/g, '')),
//                        'Total taxes': parseFloat(array[13].replace(/['"]+/g, '')),
//                        '%': parseFloat(array[14].replace(/['"]+/g, '')),
//                        'Total without tax': parseFloat(array[15].replace(/['"]+/g, ''))
//                    }
//                    $scope.DataTable.push(EPObj);
//                }
//                else if (array[0] != "" && count != 0) {
//                    var EPObj = {
//                        'Accounting groups': array[0].replace(/['"]+/g, ''),
//                        'Quantity': parseFloat(array[1].replace(/['"]+/g, '')),
//                        'Total': 0,
//                        'Discounts': 0,
//                        'Total with tax Less discounts': 0,
//                        'Amount charged': 0,
//                        'Service charge 12.5%': 0,
//                        'Amount taxed': 0,
//                        'VAT 5%': 0,
//                        'Amount taxed': 0,
//                        'VAT 20%': 0,
//                        'Amount taxed': 0,
//                        'Tax Exempt': 0,
//                        'Total taxes': 0,
//                        '%': 0,
//                        'Total without tax': 0
//                    }
//                    $scope.DataTable.push(EPObj);
//                }
//            });
//            var fileUpload = document.getElementById("ngexcelfile");
//            $scope.uploadFilesx(1, 0, 0, $scope.DataTable, fileUpload.value);
//        }
//        else if ($scope.CASHUP.INTEGRATION_SYSTEM_ID == 12) {
//            var rows = $scope.imagesrc[0].Src.split("\r\n");
//            $scope.DataTable = [];
//            if (rows.length > 0) {
//                var count = 0;
//                for (var i = 3; i < rows.length; i++) {
//                    var array = splitComponentsByComma(rows[i]);
//                    if (array.length > 1 && array[0] !== "") {
//                        count++;
//                        if (array[0] != "" && count == 1) {
//                            var EPObj = {
//                                'Description': array[0].replace(/['"]+/g, ''),
//                                'Units': (array[1].replace(/['"]+/g, '')),
//                                'Gross': (array[2].replace(/['"]+/g, '')),
//                                'Disc/Cpn': (array[3].replace(/['"]+/g, '')),
//                                'VAT Tax': (array[4].replace(/['"]+/g, '')),
//                                'Net': array[5].replace(/['"]+/g, '') == undefined || array[5].replace(/['"]+/g, '') == '' || array[5].replace(/['"]+/g, '') == null ? 0 : (array[5].replace(/['"]+/g, '')),
//                                '% Total': (array[6].replace(/['"]+/g, '')),
//                                'H': array[7] == undefined ? '' : (array[7].replace(/['"]+/g, '')),
//                            }
//                            $scope.DataTable.push(EPObj);
//                        }

//                        else if (array[0] != "" && count != 1) {
//                            var EPObj = {
//                                'Description': array[0].replace(/['"]+/g, ''),
//                                'Units': (array[1].replace(/['"]+/g, '')),
//                                'Gross': (array[2].replace(/['"]+/g, '')),
//                                'Disc/Cpn': (array[3].replace(/['"]+/g, '')),
//                                'VAT Tax': (array[4].replace(/['"]+/g, '')),
//                                'Net': array[5].replace(/['"]+/g, '') == undefined || array[5].replace(/['"]+/g, '') == '' || array[5].replace(/['"]+/g, '') == null ? 0 : (array[5].replace(/['"]+/g, '')),
//                                '% Total': (array[6].replace(/['"]+/g, '')),
//                                'H': array[7] == undefined ? '' : (array[7].replace(/['"]+/g, '')),
//                            }
//                            $scope.DataTable.push(EPObj);
//                        }
//                    }
//                }
//                // $scope.uploadFilesx(1, 0, 0, $scope.DataTable, fileUpload.value);
//                var fileUpload = document.getElementById("ngexcelfile");
//                $scope.uploadFilesx(1, 0, 0, '', $scope.DataTable, fileUpload.value);

//            }
//            else {
//                $scope.$parent.ShowAlert("Warning", "no record found", 30000);
//            }
//        }

//    };


//    $scope.uploadFile_CSV_changes = function () {
//        //  $scope.fileDataObj = readFileData.processData($scope.imagesrc[0].Src, ',');
//        // $scope.fileDataObj = readFileDataNew.processData($scope.imagesrc[0].Src, ',');
//        $scope.DataTable = [];
//        //   var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
//        //    if (regex.test($scope.SelectedFile.name.toLowerCase())) {
//        if (typeof (FileReader) != "undefined") {
//            var reader = new FileReader();
//            reader.onload = function (e) {
//                var count = 0;
//                var rows = e.target.result.split("\r\n");
//                //var row =readFileData.processData(e.target.result, ',');
//                for (var i = 3; i < rows.length; i++) {
//                    var array = splitComponentsByComma(rows[i]);
//                    if (i == 95) {
//                        a = "";
//                    }
//                    // var array = aa.split(",");
//                    if (array.length > 1 && array[0] !== "") {
//                        count++;
//                        if (array[0] != "" && count == 1) {
//                            var EPObj = {
//                                'Description': array[0].replace(/['"]+/g, ''),
//                                'Units': (array[1].replace(/['"]+/g, '')),
//                                'Gross': (array[2].replace(/['"]+/g, '')),
//                                'Disc/Cpn': (array[3].replace(/['"]+/g, '')),
//                                'VAT Tax': (array[4].replace(/['"]+/g, '')),
//                                'Net': array[5].replace(/['"]+/g, '') == undefined || array[5].replace(/['"]+/g, '') == '' || array[5].replace(/['"]+/g, '') == null ? 0 : (array[5].replace(/['"]+/g, '')),
//                                '% Total': (array[6].replace(/['"]+/g, '')),
//                                'H': array[7] == undefined ? '' : (array[7].replace(/['"]+/g, '')),
//                            }
//                            $scope.DataTable.push(EPObj);
//                        }

//                        else if (array[0] != "" && count != 1) {
//                            var EPObj = {
//                                'Description': array[0].replace(/['"]+/g, ''),
//                                'Units': (array[1].replace(/['"]+/g, '')),
//                                'Gross': (array[2].replace(/['"]+/g, '')),
//                                'Disc/Cpn': (array[3].replace(/['"]+/g, '')),
//                                'VAT Tax': (array[4].replace(/['"]+/g, '')),
//                                'Net': array[5].replace(/['"]+/g, '') == undefined || array[5].replace(/['"]+/g, '') == '' || array[5].replace(/['"]+/g, '') == null ? 0 : (array[5].replace(/['"]+/g, '')),
//                                '% Total': (array[6].replace(/['"]+/g, '')),
//                                'H': array[7] == undefined ? '' : (array[7].replace(/['"]+/g, '')),
//                            }
//                            $scope.DataTable.push(EPObj);
//                        }
//                        //$scope.$apply(function () {
//                        //    $scope.Customers = customers;
//                        //    $scope.IsVisible = true;
//                        //});
//                    }
//                }
//                var fileUpload = document.getElementById("ngexcelfile");
//                $scope.uploadFilesx(1, 0, 0, '', $scope.DataTable, fileUpload.value);
//            }
//            reader.readAsText($scope.SelectedFile);
//        } else {
//            $window.alert("This browser does not support HTML5.");
//        }
//        //  } else {
//        //  $window.alert("Please upload a valid CSV file.");

//        //$scope.fileDataObj = readFileData.processData($scope.imagesrc[0].Src, ',');
//        //delete $scope.fileDataObj[0];

//        //var someStr = 'He said "Hello, my name is Foo"';
//        //console.log(someStr.replace(/['"]+/g, ''));
//        //// delete $scope.fileDataObj[1];
//        ////$scope.fileDataObj = $scope.fileDataObj.splice(0, 1);
//        ////$scope.fileDataObj = $scope.fileDataObj.splice(1, 1);
//        ////$scope.fileData = JSON.stringify($scope.fileDataObj);
//        //$scope.DataTable = [];
//        //var count = 0;
//        //if ($scope.CASHUP.INTEGRATION_SYSTEM_ID == 0) {
//        //    angular.forEach($scope.fileDataObj, function (value, index) {
//        //        var array = value[0].split(';');
//        //        if (array[0].replace(/['"]+/g, '') == 'Payment methods') {
//        //            count++;
//        //        }
//        //        if (array[0] != "" && array[0] != 'Payment methods' && count == 0) {
//        //            var EPObj = {
//        //                'Accounting groups': array[0].replace(/['"]+/g, ''),
//        //                'Quantity': parseFloat(array[1].replace(/['"]+/g, '')),
//        //                'Total': parseFloat(array[2].replace(/['"]+/g, '')),
//        //                'Discounts': parseFloat(array[3].replace(/['"]+/g, '')),
//        //                'Total with tax Less discounts': parseFloat(array[4].replace(/['"]+/g, '')),
//        //                'Amount charged': parseFloat(array[5].replace(/['"]+/g, '')),
//        //                'Service charge 12.5%': parseFloat(array[6].replace(/['"]+/g, '')),
//        //                'Amount taxed': parseFloat(array[7].replace(/['"]+/g, '')),
//        //                'VAT 5%': parseFloat(array[8].replace(/['"]+/g, '')),
//        //                'Amount taxed': parseFloat(array[9].replace(/['"]+/g, '')),
//        //                'VAT 20%': parseFloat(array[10].replace(/['"]+/g, '')),
//        //                'Amount taxed': parseFloat(array[11].replace(/['"]+/g, '')),
//        //                'Tax Exempt': parseFloat(array[12].replace(/['"]+/g, '')),
//        //                'Total taxes': parseFloat(array[13].replace(/['"]+/g, '')),
//        //                '%': parseFloat(array[14].replace(/['"]+/g, '')),
//        //                'Total without tax': parseFloat(array[15].replace(/['"]+/g, ''))
//        //            }
//        //            $scope.DataTable.push(EPObj);
//        //        }
//        //        else if (array[0] != "" && count != 0) {
//        //            var EPObj = {
//        //                'Accounting groups': array[0].replace(/['"]+/g, ''),
//        //                'Quantity': parseFloat(array[1].replace(/['"]+/g, '')),
//        //                'Total': 0,
//        //                'Discounts': 0,
//        //                'Total with tax Less discounts': 0,
//        //                'Amount charged': 0,
//        //                'Service charge 12.5%': 0,
//        //                'Amount taxed': 0,
//        //                'VAT 5%': 0,
//        //                'Amount taxed': 0,
//        //                'VAT 20%': 0,
//        //                'Amount taxed': 0,
//        //                'Tax Exempt': 0,
//        //                'Total taxes': 0,
//        //                '%': 0,
//        //                'Total without tax': 0
//        //            }
//        //            $scope.DataTable.push(EPObj);
//        //        }
//        //    });
//        //}
//        //if ($scope.CASHUP.INTEGRATION_SYSTEM_ID == 12) {
//        //    delete $scope.fileDataObj[1];
//        //    $scope.DataTable = [];
//        //    var count = 0;
//        //    angular.forEach($scope.fileDataObj, function (array, index) {
//        //        //var array = value[0].split(';');
//        //        count++;
//        //        if (array[0] != "" && count == 1) {
//        //            var EPObj = {
//        //                'Description': array[0].replace(/['"]+/g, ''),
//        //                'Units': (array[1].replace(/['"]+/g, '')),
//        //                'Gross': (array[2].replace(/['"]+/g, '')),
//        //                'Disc/Cpn': (array[3].replace(/['"]+/g, '')),
//        //                'VAT Tax': (array[4].replace(/['"]+/g, '')),
//        //                'Net': (array[5].replace(/['"]+/g, '')),
//        //                '% Total': (array[6].replace(/['"]+/g, '')),
//        //                'H': (array[7].replace(/['"]+/g, '')),
//        //            }
//        //            $scope.DataTable.push(EPObj);
//        //        }
//        //        else if (array[0] != "" && count != 1) {
//        //            var EPObj = {
//        //                'Description': array[0].replace(/['"]+/g, ''),
//        //                'Units': (array[1].replace(/['"]+/g, '')),
//        //                'Gross': (array[2].replace(/['"]+/g, '')),
//        //                'Disc/Cpn': (array[3].replace(/['"]+/g, '')),
//        //                'VAT Tax': (array[4].replace(/['"]+/g, '')),
//        //                'Net': (array[5].replace(/['"]+/g, '')),
//        //                '% Total': (array[6].replace(/['"]+/g, '')),
//        //                'H': (array[7].replace(/['"]+/g, '')),
//        //            }
//        //            $scope.DataTable.push(EPObj);
//        //        }

//        //    });
//        // }

//    };
//    $scope.Uploading = false;
//    $scope.INS_SQUIRREL_DATA = function () {
//        var CashupModelObj = new Object();
//        CashupModelObj.CASHUP_HEADER_ID = $scope.CASHUP.ID;
//        CashupModelObj.SQUIRREL_INTEGRATION_DATA = $scope.DEPARTMENT_DETAILS;
//        PrcCommMethods.CASHUP_API(CashupModelObj, 'INS_SQUIRREL_DATA').then(function (data) {
//            if (data.data == 1) {
//            }
//        });

//    }

//    $scope.ReadExcelData = function () {
//        if (document.getElementById("ngexcelfile").value != '') {
//            if ($scope.CASHUP.ID != 0) {
//                $scope.Uploading = true;
//                var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xlsx|.xls)$/;
//                var fileUpload = document.getElementById("ngexcelfile");
//                if (fileUpload.value.toLowerCase().indexOf('.xls') != -1 || fileUpload.value.toLowerCase().indexOf('.xlsx') != -1) {
//                    /*Checks whether the file is a valid excel file*/
//                    if (true) {
//                        var xlsxflag = false; /*Flag for checking whether excel is .xls format or .xlsx format*/
//                        if ($("#ngexcelfile").val().toLowerCase().indexOf(".xlsx") > 0) {
//                            xlsxflag = true;
//                        }
//                        /*Checks whether the browser supports HTML5*/
//                        if (typeof (FileReader) != "undefined") {
//                            var reader = new FileReader();
//                            reader.onload = function (e) {
//                                var data = e.target.result;
//                                /*Converts the excel data in to object*/
//                                if (xlsxflag) {
//                                    //var workbook = XLSX.read(data, { type: 'binary' });
//                                    var workbook = XLSX.read(data, { type: 'binary' });
//                                }
//                                else {
//                                    var workbook = XLS.read(data, { type: 'binary' });
//                                }
//                                /*Gets all the sheetnames of excel in to a variable*/
//                                var sheet_name_list = workbook.SheetNames;
//                                var cnt = 0; /*This is used for restricting the script to consider only first sheet of excel*/
//                                sheet_name_list.forEach(function (y) { /*Iterate through all sheets*/
//                                    /*Convert the cell value to Json*/
//                                    if (xlsxflag) {
//                                        var worksheet = workbook.Sheets[y];
//                                        delete worksheet.A2;
//                                        delete worksheet.A3;
//                                        worksheet["!ref"] = "A4:H165";
//                                        //for (z in worksheet) {
//                                        //    /* all keys that do not begin with "!" correspond to cell addresses */
//                                        //    if(z[0] === '!' || z[0]==="A1" || z[0]==="A2"){

//                                        //    }
//                                        //    else{
//                                        //        console.log(y + "!" + z + "=" + JSON.stringify(worksheet[z].v));
//                                        //    }

//                                        //}

//                                        var exceljson = XLSX.utils.sheet_to_row_object_array(worksheet);


//                                    }
//                                    else {
//                                        var exceljson = XLS.utils.sheet_to_row_object_array(workbook.Sheets[y]);
//                                    }
//                                    if (exceljson.length > 0) {
//                                        if (exceljson.length > 0) {
//                                            //for (var i = 0; i < exceljson.length; i++) {
//                                            //    var FAV_FOLDER_UPD_Obj = new Object();
//                                            //    FAV_FOLDER_UPD_Obj.PRODUCT_SKU = exceljson[i].PRODUCT_SKU;
//                                            //    FAV_FOLDER_UPD_Obj.QUANTITY = exceljson[i].QUANTITY;
//                                            //    $scope.RFQ_RESPONSE_UPDATE_LIST_Obj[i] = FAV_FOLDER_UPD_Obj;
//                                            //}
//                                            $scope.uploadFilesx(1, 0, 0, exceljson, fileUpload.value);
//                                        }
//                                        else {
//                                            alert("Please enter the data in excel file");
//                                        }
//                                    }
//                                });
//                            }
//                            if (xlsxflag) {/*If excel file is .xlsx extension than creates a Array Buffer from excel*/
//                                reader.readAsArrayBuffer($("#ngexcelfile")[0].files[0]);
//                            }
//                            else {
//                                reader.readAsBinaryString($("#ngexcelfile")[0].files[0]);
//                            }
//                        }
//                        else {
//                            alert("Sorry! Your browser does not support HTML5!");
//                        }
//                    }
//                    else {
//                        alert("Please upload a valid Excel file1!");
//                    }
//                }
//                else if (fileUpload.value.toLowerCase().indexOf('.csv')) {
//                    $scope.uploadFile_CSV();
//                }
//                else {
//                    alert("Please upload a valid Excel file.");
//                }
//            }
//            else {
//                $scope.Uploading = false;
//                alert('Please select a Session.');

//            }
//        }
//        else {
//            alert("Please select a file to upload.");
//        }
//    };
//    // Enzogm76@gmail.com
//    $scope.ItemSalesFileValid = true;
//    $scope.PaymentsFileValid = true;
//    $scope.DepartmentFileValid = true;

//    $scope.ReadExcelData_ItemSales_Squirrel = function () {
//        if (document.getElementById("ngexcelfile_ItemSales_Squirrel").value != '') {
//            $scope.ItemSalesFileValid = true;
//            if ($scope.CASHUP.ID != 0) {
//                $scope.Uploading = true;
//                var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xlsx|.xls)$/;
//                var fileUpload = document.getElementById("ngexcelfile_ItemSales_Squirrel");
//                if (fileUpload.value.toLowerCase().indexOf('.xls') != -1 || fileUpload.value.toLowerCase().indexOf('.xlsx') != -1) {
//                    /*Checks whether the file is a valid excel file*/
//                    if (true) {
//                        var xlsxflag = false; /*Flag for checking whether excel is .xls format or .xlsx format*/
//                        if ($("#ngexcelfile_ItemSales_Squirrel").val().toLowerCase().indexOf(".xlsx") > 0) {
//                            xlsxflag = true;
//                        }
//                        /*Checks whether the browser supports HTML5*/
//                        if (typeof (FileReader) != "undefined") {
//                            var reader = new FileReader();
//                            reader.onload = function (e) {
//                                var data = e.target.result;
//                                /*Converts the excel data in to object*/
//                                if (xlsxflag) {
//                                    //var workbook = XLSX.read(data, { type: 'binary' });
//                                    var workbook = XLSX.read(data, { type: 'array' });
//                                }
//                                else {
//                                    var workbook = XLS.read(data, { type: 'binary' });
//                                }
//                                /*Gets all the sheetnames of excel in to a variable*/
//                                var sheet_name_list = workbook.SheetNames;
//                                var cnt = 0; /*This is used for restricting the script to consider only first sheet of excel*/
//                                sheet_name_list.forEach(function (y) { /*Iterate through all sheets*/
//                                    /*Convert the cell value to Json*/
//                                    if (xlsxflag) {
//                                        var worksheet = workbook.Sheets[y];
//                                        // delete worksheet.A2;
//                                        // delete worksheet.A3;
//                                        // worksheet["!ref"] = "A4:H165";
//                                        //for (z in worksheet) {
//                                        //    /* all keys that do not begin with "!" correspond to cell addresses */
//                                        //    if(z[0] === '!' || z[0]==="A1" || z[0]==="A2"){

//                                        //    }
//                                        //    else{
//                                        //        console.log(y + "!" + z + "=" + JSON.stringify(worksheet[z].v));
//                                        //    }

//                                        //}
//                                        //   var XL_row_object = XLSX.utils.sheet_to_row_object_array(worksheet);
//                                        var exceljson = XLSX.utils.sheet_to_json(worksheet);
//                                        //var exceljson = JSON.stringify(XL_row_object);
//                                        //var exceljson = XLSX.utils.sheet_to_row_object_array(worksheet);


//                                    }
//                                    else {
//                                        var exceljson = XLS.utils.sheet_to_row_object_array(workbook.Sheets[y]);
//                                    }
//                                    if (exceljson.length > 0) {
//                                        if (exceljson.length > 0) {
//                                            //for (var i = 0; i < exceljson.length; i++) {
//                                            //    var FAV_FOLDER_UPD_Obj = new Object();
//                                            //    FAV_FOLDER_UPD_Obj.PRODUCT_SKU = exceljson[i].PRODUCT_SKU;
//                                            //    FAV_FOLDER_UPD_Obj.QUANTITY = exceljson[i].QUANTITY;
//                                            //    $scope.RFQ_RESPONSE_UPDATE_LIST_Obj[i] = FAV_FOLDER_UPD_Obj;
//                                            //}
//                                            $scope.DECLARATION_DETAILS = exceljson;

//                                            $scope.uploadFilesx(1, 0, 0, fileUpload.value, exceljson, 1);
//                                            //  $scope.uploadFilesx(1, 0, 0, exceljson, fileUpload.value, 'EPOS_FILE_UPLOAD_ITEMSALES_SQUIRREL');
//                                        }
//                                        else {
//                                            alert("Please enter the data in excel file");
//                                        }
//                                    }
//                                });
//                            }
//                            if (xlsxflag) {/*If excel file is .xlsx extension than creates a Array Buffer from excel*/
//                                reader.readAsArrayBuffer($("#ngexcelfile_ItemSales_Squirrel")[0].files[0]);
//                            }
//                            else {
//                                reader.readAsBinaryString($("#ngexcelfile_ItemSales_Squirrel")[0].files[0]);
//                            }
//                        }
//                        else {
//                            alert("Sorry! Your browser does not support HTML5!");
//                        }
//                    }
//                    else {
//                        alert("Please upload a valid Excel file1!");
//                    }
//                }
//                else if (fileUpload.value.toLowerCase().indexOf('.csv')) {
//                    $scope.uploadFile_CSV();
//                    //Enzogm76@gmail.com
//                }
//                else {
//                    alert("Please upload a valid Excel file.");
//                }
//            }
//            else {
//                $scope.Uploading = false;
//                alert('Please select a Session.');

//            }
//        }
//        else {
//            $scope.ItemSalesFileValid = false; //   alert("Please select a file to upload.");
//        }

//    };
//    $scope.ReadExcelData_Payments_Squirrel = function () {
//        if (document.getElementById("ngexcelfile_Payments_Squirrel").value != '') {
//            $scope.PaymentsFileValid = true;
//            if ($scope.CASHUP.ID != 0) {
//                $scope.Uploading = true;
//                var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xlsx|.xls)$/;
//                var fileUpload = document.getElementById("ngexcelfile_Payments_Squirrel");
//                if (fileUpload.value.toLowerCase().indexOf('.xls') != -1 || fileUpload.value.toLowerCase().indexOf('.xlsx') != -1) {
//                    /*Checks whether the file is a valid excel file*/
//                    if (true) {
//                        var xlsxflag = false; /*Flag for checking whether excel is .xls format or .xlsx format*/
//                        if ($("#ngexcelfile_Payments_Squirrel").val().toLowerCase().indexOf(".xlsx") > 0) {
//                            xlsxflag = true;
//                        }
//                        /*Checks whether the browser supports HTML5*/
//                        if (typeof (FileReader) != "undefined") {
//                            var reader = new FileReader();
//                            reader.onload = function (e) {
//                                var data = e.target.result;
//                                /*Converts the excel data in to object*/
//                                if (xlsxflag) {
//                                    //var workbook = XLSX.read(data, { type: 'binary' });
//                                    var workbook = XLSX.read(data, { type: 'array' });
//                                }
//                                else {
//                                    var workbook = XLS.read(data, { type: 'binary' });
//                                }
//                                /*Gets all the sheetnames of excel in to a variable*/
//                                var sheet_name_list = workbook.SheetNames;
//                                var cnt = 0; /*This is used for restricting the script to consider only first sheet of excel*/
//                                sheet_name_list.forEach(function (y) { /*Iterate through all sheets*/
//                                    /*Convert the cell value to Json*/
//                                    if (xlsxflag) {
//                                        var worksheet = workbook.Sheets[y];
//                                        // delete worksheet.A2;
//                                        // delete worksheet.A3;
//                                        // worksheet["!ref"] = "A4:H165";
//                                        //for (z in worksheet) {
//                                        //    /* all keys that do not begin with "!" correspond to cell addresses */
//                                        //    if(z[0] === '!' || z[0]==="A1" || z[0]==="A2"){

//                                        //    }
//                                        //    else{
//                                        //        console.log(y + "!" + z + "=" + JSON.stringify(worksheet[z].v));
//                                        //    }

//                                        //}
//                                        //   var XL_row_object = XLSX.utils.sheet_to_row_object_array(worksheet);
//                                        var exceljson = XLSX.utils.sheet_to_json(worksheet);
//                                        //var exceljson = JSON.stringify(XL_row_object);
//                                        //var exceljson = XLSX.utils.sheet_to_row_object_array(worksheet);


//                                    }
//                                    else {
//                                        var exceljson = XLS.utils.sheet_to_row_object_array(workbook.Sheets[y]);
//                                    }
//                                    if (exceljson.length > 0) {
//                                        if (exceljson.length > 0) {
//                                            //for (var i = 0; i < exceljson.length; i++) {
//                                            //    var FAV_FOLDER_UPD_Obj = new Object();
//                                            //    FAV_FOLDER_UPD_Obj.PRODUCT_SKU = exceljson[i].PRODUCT_SKU;
//                                            //    FAV_FOLDER_UPD_Obj.QUANTITY = exceljson[i].QUANTITY;
//                                            //    $scope.RFQ_RESPONSE_UPDATE_LIST_Obj[i] = FAV_FOLDER_UPD_Obj;
//                                            //}
//                                            exceljson.splice(0, 1);
//                                            $scope.PAYMENT_DETAILS = exceljson;

//                                            $scope.uploadFilesx(1, 0, 0, fileUpload.value, exceljson, 2);
//                                            //  $scope.uploadFilesx(1, 0, 0, exceljson, fileUpload.value, 'EPOS_FILE_UPLOAD_ITEMSALES_SQUIRREL');
//                                        }
//                                        else {
//                                            alert("Please enter the data in excel file");
//                                        }
//                                    }
//                                });
//                            }
//                            if (xlsxflag) {/*If excel file is .xlsx extension than creates a Array Buffer from excel*/
//                                reader.readAsArrayBuffer($("#ngexcelfile_Payments_Squirrel")[0].files[0]);
//                            }
//                            else {
//                                reader.readAsBinaryString($("#ngexcelfile_Payments_Squirrel")[0].files[0]);
//                            }
//                        }
//                        else {
//                            alert("Sorry! Your browser does not support HTML5!");
//                        }
//                    }
//                    else {
//                        alert("Please upload a valid Excel file1!");
//                    }
//                }
//                else if (fileUpload.value.toLowerCase().indexOf('.csv')) {
//                    $scope.uploadFile_CSV();
//                }
//                else {
//                    alert("Please upload a valid Excel file.");
//                }
//            }
//            else {
//                $scope.Uploading = false;
//                alert('Please select a Session.');

//            }
//        }
//        else {
//            //  alert("Please select a file to upload.");
//            $scope.PaymentsFileValid = false;
//        }
//    };
//    $scope.ReadExcelData_Departments_Squirrel = function () {
//        if (document.getElementById("ngexcelfile_Deartments_Squirrel").value != '') {
//            $scope.DepartmentFileValid = true;
//            if ($scope.CASHUP.ID != 0) {
//                $scope.Uploading = true;
//                var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xlsx|.xls)$/;
//                var fileUpload = document.getElementById("ngexcelfile_Deartments_Squirrel");
//                if (fileUpload.value.toLowerCase().indexOf('.xls') != -1 || fileUpload.value.toLowerCase().indexOf('.xlsx') != -1) {
//                    /*Checks whether the file is a valid excel file*/
//                    if (true) {
//                        var xlsxflag = false; /*Flag for checking whether excel is .xls format or .xlsx format*/
//                        if ($("#ngexcelfile_Deartments_Squirrel").val().toLowerCase().indexOf(".xlsx") > 0) {
//                            xlsxflag = true;
//                        }
//                        /*Checks whether the browser supports HTML5*/
//                        if (typeof (FileReader) != "undefined") {
//                            var reader = new FileReader();
//                            reader.onload = function (e) {
//                                var data = e.target.result;
//                                /*Converts the excel data in to object*/
//                                if (xlsxflag) {
//                                    //var workbook = XLSX.read(data, { type: 'binary' });
//                                    var workbook = XLSX.read(data, { type: 'array' });
//                                }
//                                else {
//                                    var workbook = XLS.read(data, { type: 'binary' });
//                                }
//                                /*Gets all the sheetnames of excel in to a variable*/
//                                var sheet_name_list = workbook.SheetNames;
//                                var cnt = 0; /*This is used for restricting the script to consider only first sheet of excel*/
//                                sheet_name_list.forEach(function (y) { /*Iterate through all sheets*/
//                                    /*Convert the cell value to Json*/
//                                    if (xlsxflag) {
//                                        var worksheet = workbook.Sheets[y];
//                                        // delete worksheet.A2;
//                                        // delete worksheet.A3;
//                                        // worksheet["!ref"] = "A4:H165";
//                                        //for (z in worksheet) {
//                                        //    /* all keys that do not begin with "!" correspond to cell addresses */
//                                        //    if(z[0] === '!' || z[0]==="A1" || z[0]==="A2"){

//                                        //    }
//                                        //    else{
//                                        //        console.log(y + "!" + z + "=" + JSON.stringify(worksheet[z].v));
//                                        //    }

//                                        //}
//                                        //   var XL_row_object = XLSX.utils.sheet_to_row_object_array(worksheet);
//                                        var exceljson = XLSX.utils.sheet_to_json(worksheet);
//                                        //var exceljson = JSON.stringify(XL_row_object);
//                                        //var exceljson = XLSX.utils.sheet_to_row_object_array(worksheet);


//                                    }
//                                    else {
//                                        var exceljson = XLS.utils.sheet_to_row_object_array(workbook.Sheets[y]);
//                                    }
//                                    if (exceljson.length > 0) {
//                                        if (exceljson.length > 0) {
//                                            //Ave.CheckTime: 418
//                                            //Checks: 2
//                                            //Covers: 10
//                                            //Promo's: 74.75
//                                            //Sales: 267.75
//                                            //Service Chg: 40.16
//                                            //Tax: 12.75
//                                            //Time Zone: "ALL DAY"

//                                            //[DEPARTMENT] nvarchar(200) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
//                                            //[SALES] numeric(18, 5) NULL,
//                                            //[COVERS] numeric(18, 5) NULL);
//                                            //var text = exceljson.filter(function (x) { return x.Time Zone == 'ALL DAY' });




//                                            //for (var i = 0; i < exceljson.length; i++) {
//                                            //    var FAV_FOLDER_UPD_Obj = new Object();
//                                            //    FAV_FOLDER_UPD_Obj.PRODUCT_SKU = exceljson[i].PRODUCT_SKU;
//                                            //    FAV_FOLDER_UPD_Obj.QUANTITY = exceljson[i].QUANTITY;
//                                            //    $scope.RFQ_RESPONSE_UPDATE_LIST_Obj[i] = FAV_FOLDER_UPD_Obj;
//                                            //}


//                                            //__EMPTY: "Department: BASEMENT"

//                                            var dep_name = "";
//                                            var required_array = [];
//                                            //delete exceljson.Ave.CheckTime: 418
//                                            //delete exceljson.Checks;
//                                            //delete exceljson.Promo's                                            
//                                            //delete exceljson.Service Chg;
//                                            //delete exceljson.Tax;
//                                            //delete exceljson['Time Zone'];
//                                            //delete exceljson.__EMPTY;
//                                            for (var i = 0; i < exceljson.length - 1; i++) {
//                                                if (i != 0 && i % 2 != 0) {
//                                                    exceljson[i].DEPARTMENT = dep_name.replace('Department: ', '');
//                                                    exceljson[i].SERVICE_CHG = exceljson[i]['Service Chg'];
//                                                    dep_name = "";
//                                                    required_array.push(i);
//                                                }
//                                                else {
//                                                    dep_name = exceljson[i].__EMPTY;
//                                                    //splice_array.push(i);
//                                                    //                                                  //exceljson.splice(i, 1);
//                                                }
//                                            }
//                                            var FinalJson = [];
//                                            for (var i = 0; i < required_array.length; i++) {
//                                                FinalJson.push(exceljson[required_array[i]]);
//                                            }
//                                            $scope.DEPARTMENT_DETAILS = FinalJson;
//                                            //$scope.INS_SQUIRREL_DATA();

//                                            $scope.uploadFilesx(1, 0, 0, fileUpload.value, exceljson, 3);

//                                        }
//                                        else {
//                                            alert("Please enter the data in excel file");
//                                        }
//                                    }
//                                });
//                            }
//                            if (xlsxflag) {/*If excel file is .xlsx extension than creates a Array Buffer from excel*/
//                                reader.readAsArrayBuffer($("#ngexcelfile_Deartments_Squirrel")[0].files[0]);
//                            }
//                            else {
//                                reader.readAsBinaryString($("#ngexcelfile_Deartments_Squirrel")[0].files[0]);
//                            }
//                        }
//                        else {
//                            alert("Sorry! Your browser does not support HTML5!");
//                        }
//                    }
//                    else {
//                        alert("Please upload a valid Excel file1!");
//                    }
//                }
//                else if (fileUpload.value.toLowerCase().indexOf('.csv')) {
//                    $scope.uploadFile_CSV();
//                }
//                else {
//                    alert("Please upload a valid Excel file.");
//                }
//            }
//            else {
//                $scope.Uploading = false;
//                alert('Please select a Session.');

//            }
//        }
//        else {
//            $scope.DepartmentFileValid = false;// alert("Please select a file to upload.");
//        }
//    };
//    $scope.Upload_Squirrel_Reports = function () {
//        $scope.ReadExcelData_ItemSales_Squirrel();
//        $scope.ReadExcelData_Payments_Squirrel();
//        $scope.ReadExcelData_Departments_Squirrel();
//    };
//    $scope.uploadFilesx = function (Attachment_UPLOAD_TYPE_ID, var1, var2, filename, exceljson, FLAG) {
//        if (($scope.Files != undefined && $scope.Files.length > 0)) {
//            $scope.DocImageResult = [];
//            var data = new FormData();
//            data.append("CASHUP_HEADER_ID", $scope.CASHUP.ID);
//            data.append("UPLOAD_TYPE_ID", Attachment_UPLOAD_TYPE_ID);
//            data.append("VIRTUALPATH", parseInt($cookies.get("ENTITY_ID")) + '/' + Attachment_UPLOAD_TYPE_ID + '/' + $scope.CASHUP.INTEGRATION_SYSTEM_ID + '/');
//            data.append("UPLOAD_ID", 0);
//            data.append("USER_ID", parseInt($cookies.get("USERID")));
//            data.append("TABLE", JSON.stringify(exceljson));
//            data.append("ORIGINAL_FILE_NAME", filename);
//            //data.append("USER_ID", ($cookies.get("USERID")));
//            for (var i in $scope.Files) {
//                data.append("uploadedFile", $scope.Files[i]);
//            }

//            var request = {
//                method: 'POST',
//                url: CommService.Get_CASHUP_API() + "api/CashupAPI/UPLOADFILES",
//                data: data,
//                headers: {
//                    'Content-Type': undefined
//                }
//            };
//            $http(request).then(function (d) {
//                $scope.UploadedFiles = d.data;
//                if ($scope.CASHUP.INTEGRATION_SYSTEM_ID == 0) {
//                    FLAG == 1 ? $scope.DECLARATION_DETAILS_UPLOAD_FLAG = true : '';
//                    FLAG == 2 ? $scope.PAYMENT_DETAILS_UPLOAD_FLAG = true : '';
//                    FLAG == 3 ? $scope.DEPARTMENT_DETAILS_UPLOAD_FLAG = true : '';
//                    if ($scope.DEPARTMENT_DETAILS_UPLOAD_FLAG && $scope.PAYMENT_DETAILS_UPLOAD_FLAG && $scope.DECLARATION_DETAILS_UPLOAD_FLAG) {
//                        var CashupModelObj = new Object();
//                        CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
//                        CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
//                        CashupModelObj.CASHUP_HEADER_ID = $scope.CASHUP.ID;//23//24
//                        CashupModelObj.SESSION_ID = $scope.CASHUP.SESSION_ID; // $scope.SESSION_ID;              
//                        CashupModelObj.DECLARATION_DETAILS = $scope.DECLARATION_DETAILS;
//                        CashupModelObj.PAYMENT_DETAILS = $scope.PAYMENT_DETAILS;
//                        CashupModelObj.SQUIRREL_INTEGRATION_DATA = $scope.DEPARTMENT_DETAILS;
//                        PrcCommMethods.CASHUP_API(CashupModelObj, "EPOS_FILE_UPLOAD_ITEMSALES_SQUIRREL").then(function (data) {
//                            $scope.Uploading = false;
//                            //alert('File Uploaded Succesfully');
//                            $scope.$parent.ShowAlert('Success', 'File Uploaded Succesfully', 2000);

//                            $scope.ItemSalesFileValid = true;
//                            $scope.PaymentsFileValid = true;
//                            $scope.DepartmentFileValid = true;

//                            $scope.DECLARATION_DETAILS_UPLOAD_FLAG = false;
//                            $scope.PAYMENT_DETAILS_UPLOAD_FLAG = false;
//                            $scope.DEPARTMENT_DETAILS_UPLOAD_FLAG = false;

//                            angular.element("input[id='ngexcelfile_Deartments_Squirrel']").val(null);
//                            angular.element("input[id='ngexcelfile_Payments_Squirrel']").val(null);
//                            angular.element("input[id='ngexcelfile_ItemSales_Squirrel']").val(null);

//                        });
//                    }
//                }
//                if ($scope.CASHUP.INTEGRATION_SYSTEM_ID == 12) {
//                    var CashupModelObj = new Object();
//                    CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
//                    CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
//                    CashupModelObj.CASHUP_HEADER_ID = $scope.CASHUP.ID;
//                    CashupModelObj.INTEGRATION_SYSTEM_ID = $scope.CASHUP.INTEGRATION_SYSTEM_ID;
//                    CashupModelObj.SESSION_ID = $scope.CASHUP.SESSION_ID;;
//                    CashupModelObj.UPLOADED_JSON_ARRAY = JSON.stringify(exceljson);
//                    PrcCommMethods.CASHUP_API(CashupModelObj, "EPOS_FILE_UPLOAD_ALINES").then(function (data) {
//                        if (data.data == null) {
//                            $scope.$parent.ShowAlert('Warning', "We found some changes in file, please validate uploaded file with support team", 30000);
//                        }
//                        else {
//                            $scope.Uploading = false;
//                            $scope.$parent.ShowAlert('Success', 'File Uploaded Succesfully', 2000);
//                            $scope.SELECT_SESSION($scope.CASHUP.SESSION, $scope.CASHUP.INDEX);
//                        }
//                    });
//                }
//            });
//        }

//    };
//    $scope.DELETE_UPLOAD = function () {
//        if (confirm('Are you sure you want to delete the EPOS file?')) {
//            var CashupModelObj = new Object();
//            CashupModelObj.ID = $scope.CASHUP.UPL_ID;
//            PrcCommMethods.CASHUP_API(CashupModelObj, 'DELETE_UPLOAD').then(function (data) {
//                $scope.CASHUP.UPL_ID = 0;
//            });
//        }

//    };
//    $scope.RESET_CASHUP_HEADER = function (SESSION, index) {
//        if (confirm('Are you sure you want to reset the Session Data?')) {
//            var CashupModelObj = new Object();
//            CashupModelObj.ID = SESSION.CASHUP_HEADER_ID;
//            PrcCommMethods.CASHUP_API(CashupModelObj, 'RESET_CASHUP_HEADER').then(function (data) {
//                SESSION = data.data[0];
//                $scope.SessionList[index] = data.data[0];
//                $scope.CASHUP.COMPLETED_GROUP_ID = null;
//                angular.forEach($scope.SessionList, function (sessn) {
//                    if (sessn.STATUS_ID == 2) {
//                        $scope.CASHUP.COMPLETED_GROUP_ID = sessn.GROUP_ID;
//                    }
//                });
//            });
//        }

//    };
//    $scope.UPD_CASHUP_HEADER_SUBMIT = function () {
//        if (confirm('Are you sure you want to Submit?')) {
//            $scope.SelectedGroup = $filter('filter')($scope.SessionList, { GROUP_ID: $scope.CASHUP.SESSION.GROUP_ID }, true);
//            var selected_count = $scope.SelectedGroup.length;
//            var count = 0;
//            angular.forEach($scope.SelectedGroup, function (sessn) {
//                if (sessn.CASHUP_HEADER_ID != $scope.CASHUP.ID && sessn.STATUS_ID == 2) {
//                    count++;
//                }
//            });
//            var CashupModelObj = new Object();
//            CashupModelObj.CASHUP_HEADER_ID = $scope.CASHUP.ID;
//            CashupModelObj.CASHUP_MAIN_ID = $scope.CASHUP.CASHUP_MAIN_ID;
//            CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
//            CashupModelObj.REMOVE_FLAG = (count == selected_count - 1) ? 1 : 0;
//            PrcCommMethods.CASHUP_API(CashupModelObj, 'UPD_CASHUP_HEADER_SUBMIT').then(function (data) {
//                if (count == selected_count - 1) {
//                    $location.path('CL');
//                }
//                else {
//                    $scope.CASHUP.SESSION.STATUS_ID = 2;
//                    $scope.CASHUP.COMPLETED_GROUP_ID = $scope.CASHUP.SESSION.GROUP_ID;
//                    $scope.CASHUP.STEP_NO = 0;
//                    $scope.CASHUP.SESSION.STEP_NO = 10;
//                }
//            });
//        }

//    };
//    $scope.APP_CASHUP = function (STATUS_ID) {
//        if (confirm('Are you sure you want to Approve?')) {
//            var CashupModelObj = new Object();
//            CashupModelObj.CASHUP_MAIN_ID = $scope.CASHUP.CASHUP_MAIN_ID;
//            CashupModelObj.STATUS_ID = 4;
//            CashupModelObj.NOTE = "";
//            CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
//            PrcCommMethods.CASHUP_API(CashupModelObj, 'APP_REJ_CASHUP').then(function (data) {
//                $location.path('CAL');
//            });
//        }

//    };
//    $scope.REJ_CASHUP = function () {
//        if (confirm('Are you sure you want to Return?')) {
//            var CashupModelObj = new Object();
//            CashupModelObj.CASHUP_MAIN_ID = $scope.CASHUP.CASHUP_MAIN_ID;
//            CashupModelObj.STATUS_ID = 5;
//            CashupModelObj.NOTE = "";
//            PrcCommMethods.CASHUP_API(CashupModelObj, 'APP_REJ_CASHUP').then(function (data) {
//                $location.path('CAL');
//            });
//        }

//    };
//    $scope.EPOS_REFRESH_HOMESTEAD = function () {

//        if (confirm('Are you sure you want to Refresh EPOS Data?')) {
//            $scope.$parent.$parent.overlay_loading_coffee = 'block';
//            var CashupModelObj = new Object();
//            CashupModelObj.CASHUP_MAIN_ID = $scope.CASHUP.CASHUP_MAIN_ID;
//            CashupModelObj.BRANCH_ID = $scope.$parent.CashUp_Main_BRANCH_ID;
//            CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
//            CashupModelObj.CASHUP_DATE = $scope.CASHUP.CASHUP_DATE;
//            CashupModelObj.INTEGRATION_URL = $scope.CASHUP.INTEGRATION_URL;
//            CashupModelObj.ACCESS_TOKEN = $scope.CASHUP.ACCESS_TOKEN;
//            PrcCommMethods.CASHUP_API(CashupModelObj, 'EPOS_REFRESH_HOMESTEAD').then(function (data) {
//                $scope.GET_EPOS_HEADER();
//                $scope.GET_EPOS_DATA();
//                $scope.GET_REVENUE_CENTERS();
//                $scope.$parent.$parent.overlay_loading_coffee = 'none';
//            });
//        }

//    };
//    $scope.RTab = 1;
//    $scope.ReviewTab = function (FLAG) {
//        $scope.RTab = FLAG;
//    };

//    $scope.getTheFilesToUploadPcash = function ($files, ControlName, FileSize, List, Attachment_UPLOAD_TYPE_ID, index) {
//        if (FileSize == undefined || FileSize == null || FileSize == 0 || FileSize == '') {
//            FileSize = AppVal.FileSize;
//        }
//        $scope.imagesrc = [];
//        var valid = 0;
//        for (var i = 0; i < $files.length; i++) {

//            if ($scope.Attachment_UPLOAD_TYPE_ID == 12) {
//                var validFormats = ['MPEG4', 'MP4', 'video/mp4'];
//            }
//            else {
//                var validFormats = ['doc', 'docx', 'xml', 'pdf', 'csv', 'txt', 'text', 'jpg', 'jpeg', 'png', 'MPEG4', 'MP4', 'video/mp4', 'excel'];
//            }
//            var validity = validFormats.map(function (element) {
//                if ($files[i].type.indexOf(element) != -1) {
//                    return 1;
//                }
//                else {
//                    return 0;
//                }
//            });
//            valid = validity.indexOf(1);

//            if (valid != -1) {
//                if (($files[i].size / 1000000).toFixed(2) <= FileSize) {//File Size should not be more than 5 MB
//                    var reader = new FileReader();
//                    reader.fileName = $files[i].name;
//                    reader.onload = function (event) {
//                        var image = {};
//                        image.Name = event.target.fileName;
//                        image.Size = (event.total / 1024).toFixed(2);
//                        image.Src = event.target.result;
//                        $scope.imagesrc.push(image);
//                        $scope.$apply();
//                    }
//                    //     reader.readAsDataURL($files[i]);
//                    reader.readAsText($files[i]);
//                }
//                else {
//                    $scope.ShowAlert('Error', 'Maximum File Size ' + FileSize + ' MB.', 5000);
//                    angular.element("input[id='" + ControlName + "']").val(null);
//                    return;
//                }
//            }
//            else {
//                $scope.ShowAlert('Error', 'Not a valid file.', 5000);
//                angular.element("input[id='" + ControlName + "']").val(null);
//                return;
//            }

//        }
//        $scope.Files = $files;

//        var fileUpload = document.getElementById("PcashFile" + index);
//        extension = fileUpload.files[0].name;;
//        $scope.uploadFiles(Attachment_UPLOAD_TYPE_ID, '', extension, List, index, 'PettyCash');
//    };

//    $scope.getTheFilesToUploadCards = function ($files, ControlName, FileSize, List, Attachment_UPLOAD_TYPE_ID, index) {
//        if (FileSize == undefined || FileSize == null || FileSize == 0 || FileSize == '') {
//            FileSize = AppVal.FileSize;
//        }
//        $scope.imagesrc = [];
//        var valid = 0;
//        for (var i = 0; i < $files.length; i++) {

//            if ($scope.Attachment_UPLOAD_TYPE_ID == 12) {
//                var validFormats = ['MPEG4', 'MP4', 'video/mp4'];
//            }
//            else {
//                var validFormats = ['doc', 'docx', 'xml', 'pdf', 'csv', 'txt', 'text', 'jpg', 'jpeg', 'png', 'MPEG4', 'MP4', 'video/mp4', 'excel'];
//            }
//            var validity = validFormats.map(function (element) {
//                if ($files[i].type.indexOf(element) != -1) {
//                    return 1;
//                }
//                else {
//                    return 0;
//                }
//            });
//            valid = validity.indexOf(1);

//            if (valid != -1) {
//                if (($files[i].size / 1000000).toFixed(2) <= FileSize) {//File Size should not be more than 5 MB
//                    var reader = new FileReader();
//                    reader.fileName = $files[i].name;
//                    reader.onload = function (event) {
//                        var image = {};
//                        image.Name = event.target.fileName;
//                        image.Size = (event.total / 1024).toFixed(2);
//                        image.Src = event.target.result;
//                        $scope.imagesrc.push(image);
//                        $scope.$apply();
//                    }
//                    //     reader.readAsDataURL($files[i]);
//                    reader.readAsText($files[i]);
//                }
//                else {
//                    $scope.ShowAlert('Error', 'Maximum File Size ' + FileSize + ' MB.', 5000);
//                    angular.element("input[id='" + ControlName + "']").val(null);
//                    return;
//                }
//            }
//            else {
//                $scope.ShowAlert('Error', 'Not a valid file.', 5000);
//                angular.element("input[id='" + ControlName + "']").val(null);
//                return;
//            }
//        }
//        $scope.Files = $files;
//        var fileUpload = document.getElementById("CardFile" + index);
//        extension = fileUpload.files[0].name;;
//        $scope.uploadFiles(Attachment_UPLOAD_TYPE_ID, '', extension, List, index, 'Cards');
//    };
//    $scope.uploadFiles = function (Attachment_UPLOAD_TYPE_ID, ATTACHEMENT_TYPE_ID, filename, List, index, FolderName) {
//        if (($scope.Files != undefined && $scope.Files.length > 0)) {
//            $scope.DocImageResult = [];
//            var data = new FormData();
//            data.append("RelativeID", List.ID == 0 ? $scope.$parent.generaterandom(12) + "" + index : List.ID);
//            data.append("UPLOAD_TYPE_ID", Attachment_UPLOAD_TYPE_ID);
//            data.append("VIRTUALPATH", '/CashUp/' + FolderName + '/' + parseInt($scope.$parent.CashUp_Main_ID)) + '/';
//            data.append("UPLOAD_ID", 0);
//            data.append("ORIGINAL_FILE_NAME", filename);
//            data.append("USER_ID", parseInt($cookies.get("USERID")));
//            if (isNaN(parseInt($cookies.get("ENTITY_ID")))) {
//                data.append("ENTITY_ID", 0);
//            }
//            else {
//                data.append("ENTITY_ID", parseInt($cookies.get("ENTITY_ID")));
//            }
//            for (var i in $scope.Files) {
//                data.append("uploadedFile", $scope.Files[i]);
//            }
//            var request = {
//                method: 'POST',
//                url: CommService.Get_CASHUP_API() + "api/PayrollAPI/UPLOADFILES",
//                data: data,
//                headers: {
//                    'Content-Type': undefined
//                }
//            };
//            $http(request).then(function (d) {
//                List.UploadedFiles = d.data;
//            });
//        }
//    };
//});
app.controller('CashupReportController', function ($scope, $http, $interval, CommService, $cookies, $filter, PrcCommMethods, $location, readFileData, $localStorage) {
    var CashupModel;
    var startDate;
    var endDate;
    var prv_6;
    Date.prototype.addDays = function (days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    };
    $scope.REPORT_BETWEEN_DATE = null;
    $scope.SHOW_WEEKLY_CASHUP_HTML_TABLE_FLAG = false;
    $scope.SHOW_CASHUP_CONSOLIDATED_SALES_REPORT_TABLE_FLAG = false;
    $scope.DISPLAY_HTML_FLAG = null;
    $scope.CashupReportSearch = {
        REPORT_START_DATE: null,
        REPORT_END_DATE: null,
        BRANCH_ID: null, PDF_BRANCH: null, PDF_ENTITY_NAME: null
    };
    $scope.EXCEL_REPORT_DATA_LIST = [];
    $scope.CASHUP_CONSOLIDATED_SALES_REPORT_LIST = [];
    $scope.CASHUP_PAYMENT_DETAILS_REPORT_DATA_LIST = [];
    $scope.CASHUP_VOUCHER_REPORT = [];
    $scope.GenerateButtonText = 'Download';
    $scope.LOADER_ICON = false;
    $scope.overlay_loadingNew = 'block';
    //var opts = {
    //   column: { },
    //    rows: {  },
    //    cells: {1: {1: {style: { Font: { Color: "#00FFFF" } }}}}
    //};
    var USER_ID = parseInt($cookies.get("USERID"));
    PrcCommMethods.GET_BRANCH_LIST(parseInt($cookies.get("ENTITY_ID")), USER_ID, 1).then(function (data) {

        $scope.BRANCH_LIST = data;
    });
    //$scope.ADMIN_GET_BRANCH = function () {
    //    $scope.SHOW_WEEKLY_CASHUP_HTML_TABLE_FLAG = false;
    //    ModelObj = new Object();
    //    ModelObj.CUSTOMER_ID = parseInt($cookies.get('CUSTOMER_ID'));
    //    ModelObj.ENTITY_ID = parseInt($cookies.get('ENTITY_ID'));
    //    ModelObj.BRANCH_CODE = null;//$scope.GroupSearch.BRANCH_CODE;
    //    ModelObj.BRANCH_NAME = null;// $scope.GroupSearch.BRANCH_NAME;
    //    ModelObj.CONTACT_NAME = null;// $scope.GroupSearch.CONTACT_NAME;
    //    ModelObj.LOCATION_IDS = null;
    //    ModelObj.ACTIVE = 1;//$scope.BrachSearch.ACTIVE ? 1 : 0;
    //    ModelObj.PAGE_NO = 0;
    //    ModelObj.PAGE_SIZE = 999;
    //    ModelObj.USER_ID = parseInt($cookies.get("USERID"));
    //    PrcCommMethods.ADMIN_API(ModelObj, 'ADMIN_GET_BRANCH').then(function (data) {
    //        $scope.BRANCH_LIST = data.data.Table;
    //    });

    //};
    //$scope.ADMIN_GET_BRANCH();
    $scope.START_DAY_OF_WEEK = 0;
    if (JSON.parse($localStorage.ENTITY_SETTINGS).length > 0) {
        $scope.START_DAY_OF_WEEK = JSON.parse($localStorage.ENTITY_SETTINGS).filter(x => x.SETTING_ID == 4)[0]["SETTING_VALUE"];
        if ($scope.START_DAY_OF_WEEK == null || $scope.START_DAY_OF_WEEK == undefined || $scope.START_DAY_OF_WEEK == '') {
            $scope.START_DAY_OF_WEEK = 0;
        }
    }
    function set_week_picker(date, FLAG) {
        var count = 0;
        //if ($scope.START_DAY_OF_WEEK != null && FLAG==undefined) {
        //    if (new Date(date).getDay() == $scope.START_DAY_OF_WEEK) {
        //        start_date = new Date(new Date(date));
        //        end_date = new Date(new Date(date).setDate(new Date(date).getDate() + (6)));
        //    }
        //    else {
        //        var lastWeek = new Date(new Date(date).getFullYear(), new Date(date).getMonth(), new Date(date).getDate() - 7);
        //        var lastWeek_Date;
        //        var incriment_Day = new Date(lastWeek);
        //        for (var i = 0; i <= 7; i++) {
        //            if (new Date(incriment_Day).getDay() == $scope.START_DAY_OF_WEEK ) {
        //                lastWeek_Date = new Date(incriment_Day);
        //                break;
        //            }
        //            else {
        //                incriment_Day = new Date(lastWeek).setDate(new Date(lastWeek).getDate() + i);
        //                incriment_Day = new Date(incriment_Day);
        //            }
        //        }
        //        start_date = new Date(lastWeek_Date);
        //        //$scope.BIReportSearch.END_DATE = new Date(SELECTED_DATE);
        //        end_date = new Date(new Date(lastWeek_Date).setDate(new Date(lastWeek_Date).getDate() + (6)));
        //    }
        //}
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
        $scope.CashupReportSearch.REPORT_START_DATE = start_date;
        $scope.CashupReportSearch.REPORT_END_DATE = end_date;

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

    function reportrange(start, end) {
        $scope.CashupReportSearch.START_DATE = start.format($scope.$parent.Datelocaleformat.format);
        $scope.CashupReportSearch.END_DATE = end.format($scope.$parent.Datelocaleformat.format);
        $('#reportrange span').html(start.format($scope.$parent.Datelocaleformat.format) + ' - ' + end.format($scope.$parent.Datelocaleformat.format));
    };
    $(function () {
        startDate = moment().startOf('month');
        endDate = moment().endOf('month');
        $scope.$parent.SetUpDateRangeMultiDatePicker('reportrange', startDate, endDate, reportrange);
        $('#reportrange span').html(startDate.format($scope.$parent.Datelocaleformat.format) + ' - ' + endDate.format($scope.$parent.Datelocaleformat.format));
    });
    $(document).on("click", ".ranges ul li", function (event) {
        var CUSTOM_DATE_TYPE_SELECTED = $(this).attr("data-range-key");
        if (CUSTOM_DATE_TYPE_SELECTED == "Custom Date" && $scope.IS_CUSTOME_DATE_SELECTED == 1) {
            $scope.IS_CUSTOME_DATE_SELECTED = 2;
            var start = moment().startOf('month');
            var end = moment().add(1, 'M').endOf('month');
            $scope.$parent.SetUpDateRangeMultiDatePicker('reportrange', start, end, reportrange, 1, "right", 'Open');
            $('#reportrange').data('daterangepicker').show();
        }
        else {
            $scope.IS_CUSTOME_DATE_SELECTED = 1;
        }
    });

    $scope.IS_CUSTOME_DATE_SELECTED = 1;
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
    $scope.RESET_FILTER = function () { $scope.CashupReportSearch.BRANCH_ID = null; }
    $scope.$parent.dateinputOpenDate();
    $scope.HR_GET_USER_REPORT_LIST = function () {
        $scope.SHOW_NO_REPORT_ASSIGN = false;
        document.getElementById("overlay_loading_coffee").style.display = "block";
        $scope.REPORT_LIST = [];
        RPTModelObj = new Object();
        RPTModelObj.ENTITY_ID = parseInt($cookies.get('ENTITY_ID'));
        RPTModelObj.USER_ID = parseInt($cookies.get('USERID'));
        RPTModelObj.MODULE_ID = parseInt($cookies.get('MODULE_ID'));
        PrcCommMethods.HR_API(RPTModelObj, 'GET_USER_REPORT_LIST').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.REPORT_LIST = data.data.Table;
                document.getElementById("overlay_loading_coffee").style.display = "none";
            }
            else {
                $scope.REPORT_LIST = [];
                $scope.SHOW_NO_REPORT_ASSIGN = true;
            }

            document.getElementById("overlay_loading_coffee").style.display = "none";
        });

    };
    $scope.HR_GET_USER_REPORT_LIST();
    $scope.REPORT_HEADER_JSON = {
        "HEADER": "HEADER", "MonDay": "MONDAY", "Tuesday": "TUESDAY", "Wednesday": "WEDNESDAY", "Thursday": "THURSDAY", "Friday": "FRIDAY"
        , "Saturday": "SATURDAY", "Sunday": "SUNDAY", "TotalWeek": "", "Var_Last_Week": '', 'Var_Last_Year': ''
    };
    $scope.GET_WEEKLY_CASHUP_REPORT = function (RPTID, DISPLAY_HTML_FLAG) {
       
            //$scope.CashupReportSearch.BRANCH_ID == null ? $scope.CashupReportSearch.PDF_BRANCH = "All" : $scope.CashupReportSearch.PDF_BRANCH = $scope.BRANCH_LIST.filter(p => p.BRANCH_ID == $scope.CashupReportSearch.BRANCH_ID)[0]['BRANCH_NAME'];

            $scope.CASHUP_REPORT_DATA_LIST = [];
            $scope.EXCEL_REPORT_DATA_LIST = [];
            $scope.enable = "false";
            $scope.LOADER_ICON = true;
            CashupModel = new Object();
            CashupModel.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            CashupModel.BRANCH_ID = $scope.CashupReportSearch.BRANCH_ID;
            CashupModel.START_DATE = (new Date($scope.CashupReportSearch.REPORT_START_DATE)).toDateString();
            CashupModel.END_DATE = (new Date($scope.CashupReportSearch.REPORT_END_DATE)).toDateString();
            $scope.ENTITY_LOGO = $cookies.get("LOGO_PATH");
            PrcCommMethods.REPORT_API(CashupModel, 'GET_WEEKLY_CASHUP_REPORT').then(function (data) {

                if (data.data != null && data.data.Table1 != undefined) {
                    $scope.CASHUP_REPORT_DATA_LIST = data.data.Table1;
                    $scope.JSON_COLUMN_NAME = Object.keys(data.data.Table1[0]);
                    $scope.CASHUP_REPORT_DATA_FOR_HTML = [];
                    angular.forEach($scope.CASHUP_REPORT_DATA_LIST, function (item) {
                        var getEntityDate = new Date($scope.CashupReportSearch.REPORT_START_DATE);
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
                        alasql('SELECT * INTO XLSX("WEEKLY_CASHUP_REPORT ' + $scope.REPORT_BETWEEN_DATE + '",{headers:true}) FROM ?', [$scope.EXCEL_REPORT_DATA_LIST]);
                    }
                    if (DISPLAY_HTML_FLAG == 2) {
                        $scope.DISPLAY_HTML_FLAG = DISPLAY_HTML_FLAG;
                        if ($scope.CASHUP_REPORT_DATA_LIST.length > 0) {
                            $scope.SHOW_WEEKLY_CASHUP_HTML_TABLE_FLAG = true;
                            $('#CASHUP_REPORT').modal('hide');
                            $scope.DISPLAY_HTML_FLAG = null;
                        }
                    }
                }
                else {
                    $scope.$parent.ShowAlert("Attention", "No Records Found.", 3000);
                    $scope.enable = "true";
                    $scope.LOADER_ICON = false;
                }
            });
        
    };
    $scope.DISPLAY_WEEKLY_CASHUP_REPORT_INPAGE = function () {
        if ($scope.CASHUP_REPORT_DATA_LIST.length > 0) {
            $scope.SHOW_WEEKLY_CASHUP_HTML_TABLE_FLAG = true;
            $('#CASHUP_REPORT').modal('hide');
            $scope.DISPLAY_HTML_FLAG = null;
        }
        else {
            if ($scope.RPTID == 8)
                $scope.GET_WEEKLY_CASHUP_REPORT($scope.RPTID, 2);
            if ($scope.RPTID == 27 || $scope.RPTID == 28)
                $scope.GET_WEEKLY_CASHUP_REPORT_BY_SESSION_CATEGORY($scope.RPTID, 2);
           
        }

    };
    $scope.SET_DAYS_CHECK = function () {
        var startdate = new Date($scope.CashupReportSearch.START_DATE);
        var enddate = new Date($scope.CashupReportSearch.END_DATE);
        var Difference_In_Time = enddate.getTime() - startdate.getTime();

        // Calculating the no. of days between
        // two dates
        var Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));
        aler(Difference_In_Days);
    }
    $scope.GET_REVENUE_SUMMARY = function (RPTID, DISPLAY_HTML_FLAG) {
       
            $scope.DAYS_FLAG = false;
            var startdate = new Date($scope.CashupReportSearch.START_DATE);
            var enddate = new Date($scope.CashupReportSearch.END_DATE);
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
            RPTModelObj.BRANCH_IDS = $scope.CashupReportSearch.BRANCH_ID == null ? '' : $scope.CashupReportSearch.BRANCH_ID;
            RPTModelObj.START_DATE = $scope.CashupReportSearch.START_DATE;//(new Date($scope.CashupReportSearch.REPORT_START_DATE)).toDateString(); //"Mon Jun 10 2024"; 
            RPTModelObj.END_DATE = $scope.CashupReportSearch.END_DATE;//(new Date($scope.CashupReportSearch.REPORT_END_DATE)).toDateString();//"Mon Jun 10 2024";
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
                            $scope.ARY_LIST.push({ 'MEDIA': x.MEDIA, 'EPOS': x.SALES_AMT.toFixed(2), 'Actual': x.ACTUAL_AMT.toFixed(2), 'Variance': x.VARIANCE_AMT.toFixed(2), 'NET_TOTAL': ''}); 
                        }
                    })
                    $scope.ARY_LIST.push({ 'MEDIA': 'Total (' + $scope.CURRENCYLIST[0].CODE + ')', 'EPOS': $scope.EPOS_TOTAL.toFixed(2), 'Actual': $scope.ACTUAL_TOTAL.toFixed(2), 'Variance': $scope.VARIANCE_TOTAL.toFixed(2), 'NET_TOTAL': '' }); 
                   
                    angular.forEach($scope.EPOS_ACTUAL_LIST, function (x) {
                        if (x.ADD_IN_DAILY_TAKINGS == false && x.FLAG == 1) {
                            $scope.ARY_LIST.push({ 'MEDIA': x.MEDIA, 'EPOS': x.SALES_AMT.toFixed(2), 'Actual': x.ACTUAL_AMT.toFixed(2), 'Variance': x.VARIANCE_AMT.toFixed(2), 'NET_TOTAL': ''});
                        }
                    })
                    $scope.ARY_LIST.push({ 'MEDIA': '', 'EPOS': '', 'Actual': '', 'Variance': '', 'NET_TOTAL': '' });
                     //$scope.ARY_CATDATA = [];
                    $scope.ARY_LIST.push({ 'MEDIA': 'Revenue Type', 'EPOS': 'Gross Exc. Disc.', 'Actual': 'Disc.', 'Variance': 'Vat', 'NET_TOTAL': 'Net_Exc_Disc' }); 
                    var EPOS_TOTAL_GROSS = 0; var EPOS_TOTAL_DISC_CPN = 0; var EPOS_TOTAL_VAT_TAX = 0; var EPOS_NET_TOTAL = 0;
                    angular.forEach($scope.EPOS_CAT_DATA, function (x) {
                        $scope.ARY_LIST.push({ 'MEDIA': x.CATEGORY_NAME, 'EPOS': (x.TOTAL_GROSS).toFixed(2), 'Actual': (x.TOTAL_DISC_CPN).toFixed(2), 'Variance': (x.TOTAL_VAT_TAX).toFixed(2), 'NET_TOTAL': (x.NET_TOTAL).toFixed(2)}); 

                      //  $scope.ARY_LIST.push({ 'CATEGORY_NAME': x.CATEGORY_NAME, 'TOTAL_GROSS': x.TOTAL_GROSS, 'TOTAL_DISC_CPN': x.TOTAL_DISC_CPN, 'TOTAL_VAT_TAX': x.TOTAL_VAT_TAX, 'NET_TOTAL': x.NET_TOTAL });
                        EPOS_TOTAL_GROSS += x.TOTAL_GROSS;
                        EPOS_TOTAL_DISC_CPN += x.TOTAL_DISC_CPN;
                        EPOS_TOTAL_VAT_TAX += x.TOTAL_VAT_TAX;
                        EPOS_NET_TOTAL += x.NET_TOTAL;
                    })
                    $scope.ARY_LIST.push({ 'MEDIA': 'Total (' + $scope.CURRENCYLIST[0].CODE + ')', 'EPOS': (EPOS_TOTAL_GROSS).toFixed(2), 'Actual': (EPOS_TOTAL_DISC_CPN).toFixed(2), 'Variance': (EPOS_TOTAL_VAT_TAX).toFixed(2), 'NET_TOTAL': (EPOS_NET_TOTAL).toFixed(2)});
                    
                    $scope.ARY_LIST.push({ 'MEDIA': 'Service Charge', 'EPOS': '', 'Actual': '', 'Variance': '', 'NET_TOTAL': ($scope.EPOS_HEADER_DATA[0].SERVICE_CHARGE==null?'0.00':($scope.EPOS_HEADER_DATA[0].SERVICE_CHARGE).toFixed(2) )});
                    $scope.ARY_LIST.push({ 'MEDIA': 'House Tips', 'EPOS': '', 'Actual': '', 'Variance': '', 'NET_TOTAL': ($scope.EPOS_HEADER_DATA[0].TIPS==null?'0.00':($scope.EPOS_HEADER_DATA[0].TIPS).toFixed(2)) });
                    $scope.ARY_LIST.push({ 'MEDIA': '', 'EPOS': '', 'Actual': '', 'Variance': '', 'NET_TOTAL': '' });

                    //$scope.ARY_LIST.push({ 'MEDIA': 'Cashup_Entries', 'EPOS': 'EPOS', 'Actual': 'Actual', 'Variance': 'Variance', 'NET_TOTAL': '' });
                    if ($scope.EPOS_HEADER_DATA[0].VOID == null) {
                        $scope.EPOS_HEADER_DATA[0].VOID = 0;
                    }
                    if ($scope.EPOS_HEADER_DATA[0].COMPLIMENTARY == null) {
                        $scope.EPOS_HEADER_DATA[0].COMPLIMENTARY = 0;
                    }
                    $scope.ARY_LIST.push({ 'MEDIA': 'Void', 'EPOS': ($scope.EPOS_HEADER_DATA[0].VOID).toFixed(2), 'Actual': ($scope.ACTUAL_DATA[0].ACTUAL_VOID).toFixed(2), 'Variance': ($scope.ACTUAL_DATA[0].ACTUAL_VOID - ($scope.EPOS_HEADER_DATA[0].VOID.toFixed(2))).toFixed(2), 'NET_TOTAL': '' });
                    $scope.ARY_LIST.push({ 'MEDIA': 'Complimentary', 'EPOS': ($scope.EPOS_HEADER_DATA[0].COMPLIMENTARY).toFixed(2), 'Actual': ($scope.ACTUAL_DATA[0].ACTUAL_COMP).toFixed(2), 'Variance': ($scope.ACTUAL_DATA[0].ACTUAL_COMP - ($scope.EPOS_HEADER_DATA[0].COMPLIMENTARY.toFixed(2))).toFixed(2), 'NET_TOTAL': '' });

                    
                    angular.forEach($scope.ARY_LIST, function (x) {
                        $scope.SELECTED_DATA = [];                       
                            $scope.SELECTED_DATA =
                                {
                                'Cashup_Entries': x.MEDIA,
                                'EPOS': x.EPOS,
                                'Actual': x.Actual,
                                'Variance': x.Variance,
                                '': ((x.NET_TOTAL != '' && x.NET_TOTAL != 0) || x.NET_TOTAL == '0.00')? x.NET_TOTAL:''
                                };
                        $scope.EXCEL_REPORT_DATA_LIST.push($scope.SELECTED_DATA);    
                       
                     
                    });
                    //angular.forEach($scope.ARY_CATDATA, function (x) {
                    //    $scope.SELECTED_DATA = [];
                    //    $scope.SELECTED_DATA =
                    //        {
                    //        'Revenue_Type': x.CATEGORY_NAME,
                    //        'Gross_Exc_Disc.': x.TOTAL_GROSS,
                    //        'Disc': x.TOTAL_DISC_CPN,
                    //        'Vat': x.TOTAL_VAT_TAX,
                    //        'Net_Exc_Disc': x.NET_TOTAL
                    //        };
                    //    $scope.EXCEL_REPORT_DATA_LIST.push($scope.SELECTED_DATA);

                    //});

                    if (DISPLAY_HTML_FLAG == undefined) {
                        $scope.enable = "true";
                        $scope.LOADER_ICON = false;
                        //$('#CASHUP_REPORT').modal('hide');
                        alasql('SELECT * INTO XLSX("REVENUE_SUMMARY_REPORT ' + $scope.CashupReportSearch.START_DATE + '-' + $scope.CashupReportSearch.END_DATE + '",{headers:true}) FROM ?', [$scope.EXCEL_REPORT_DATA_LIST]);
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
                RPTModelObj.BRANCH_IDS = $scope.CashupReportSearch.BRANCH_ID == null ? '' : $scope.CashupReportSearch.BRANCH_ID;
                RPTModelObj.START_DATE = $scope.CashupReportSearch.START_DATE;//(new Date($scope.CashupReportSearch.REPORT_START_DATE)).toDateString(); //"Mon Jun 10 2024"; 
                RPTModelObj.END_DATE = $scope.CashupReportSearch.END_DATE;//(new Date($scope.CashupReportSearch.REPORT_END_DATE)).toDateString();//"Mon Jun 10 2024";
              
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

    $scope.DISPLAY_REVENUE_SUMMARY_CASHUP_REPORT_INPAGE = function () {
        if ($scope.CASHUP_REPORT_DATA_LIST.length > 0) {
            $scope.SHOW_REVENUE_CASHUP_HTML_TABLE_FLAG = true;
            $('#CASHUP_REPORT').modal('hide');
            $scope.DISPLAY_HTML_FLAG = null;
        }
        else {
            if ($scope.RPTID == 36)
                $scope.GET_REVENUE_SUMMARY($scope.RPTID, 2);         

        }

    };

  

    $scope.CASHUP_CONSOLIDATED_SALES_REPORT = function (RPTID, DISPLAY_HTML_FLAG) {
        $scope.CASHUP_CONSOLIDATED_SALES_REPORT_LIST = [];
        $scope.CASHUP_REPORT_DATA_LIST = [];
        $scope.EXCEL_REPORT_DATA_LIST = [];
        $scope.SHOW_WEEKLY_CASHUP_HTML_TABLE_FLAG = false;
        $scope.CashupReportForm.submitted = true;
       
            $scope.enable = "false";
            $scope.LOADER_ICON = true;
            CashupModel = new Object();
            CashupModel.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            CashupModel.BRANCH_IDS = $scope.CashupReportSearch.BRANCH_ID == null ? '' : $scope.CashupReportSearch.BRANCH_ID;
            CashupModel.START_DATE = $scope.CashupReportSearch.START_DATE;
            CashupModel.END_DATE = $scope.CashupReportSearch.END_DATE;
            PrcCommMethods.REPORT_API(CashupModel, 'CASHUP_CONSOLIDATED_SALES_REPORT').then(function (data) {
                if (data.data.Table != undefined && data.data.Table.length > 0) {
                    $scope.CASHUP_CONSOLIDATED_SALES_REPORT_LIST = data.data.Table;
                    $scope.CASHUP_CONSOLIDATED_SALES_REPORT_LIST.forEach(elm => delete elm.SORT_ORDER);
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
        
    };
    $scope.CASHUP_CONSOLIDATED_SALES_REPORT_INPAGE = function () {
        if ($scope.CASHUP_CONSOLIDATED_SALES_REPORT_LIST.length > 0) {
            $scope.SHOW_WEEKLY_CASHUP_HTML_TABLE_FLAG = true;
            $('#CASHUP_REPORT').modal('hide');
            $scope.DISPLAY_HTML_FLAG = null;
        }
        else {
            $scope.CASHUP_CONSOLIDATED_SALES_REPORT($scope.RPTID, 2);
        }
    };
    $scope.CASHUP_PAYMENT_DETAILS_REPORT = function (RPTID) {
        $scope.SHOW_WEEKLY_CASHUP_HTML_TABLE_FLAG = false;
        $scope.CashupReportForm.submitted = true;
        $scope.CASHUP_PAYMENT_DETAILS_REPORT_EXCEL_FILE_NAME = null;
       
            $scope.CASHUP_REPORT_DATA_LIST = [];
            $scope.EXCEL_REPORT_DATA_LIST = [];
            $scope.CASHUP_PAYMENT_DETAILS_REPORT_DATA_LIST = [];
            $scope.enable = "false";
            $scope.LOADER_ICON = true;
            CashupModel = new Object();
            CashupModel.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            CashupModel.BRANCH_IDS = $scope.CashupReportSearch.BRANCH_ID;
            CashupModel.START_DATE = $scope.CashupReportSearch.START_DATE;
            CashupModel.END_DATE = $scope.CashupReportSearch.END_DATE;
            PrcCommMethods.REPORT_API(CashupModel, 'CASHUP_PAYMENT_DETAILS_REPORT').then(function (data) {
                if (data.data.Table != undefined && data.data.Table.length > 0) {
                    var Table_count = 0;
                    var dataTableArray = [];
                    angular.forEach(data.data, function (data) {
                        dataTableArray[Table_count] = data;
                        Table_count += 1;
                    });
                    for (var i = 0; i < Table_count; i++) {
                        $scope.CASHUP_PAYMENT_DETAILS_REPORT_EXCEL_FILE_NAME = null;
                        $scope.CASHUP_PAYMENT_DETAILS_REPORT_DATA_LIST = [];
                        if (dataTableArray[i].length > 0) {
                            $scope.CASHUP_PAYMENT_DETAILS_REPORT_EXCEL_FILE_NAME = dataTableArray[i][0]["Payee"];
                            $scope.CASHUP_PAYMENT_DETAILS_REPORT_DATA_LIST = dataTableArray[i];
                            $scope.CASHUP_PAYMENT_DETAILS_REPORT_DATA_LIST.forEach(elm => delete elm.SORT_ORDER);
                            alasql('SELECT * INTO XLSX("' + $scope.CASHUP_PAYMENT_DETAILS_REPORT_EXCEL_FILE_NAME + '",{headers:true}) FROM ?', [$scope.CASHUP_PAYMENT_DETAILS_REPORT_DATA_LIST]);
                        }
                    }

                    //if (i == 0 && data.data.Table.length > 0) {
                    //    $scope.CASHUP_PAYMENT_DETAILS_REPORT_EXCEL_FILE_NAME = data.data.Table[0]["Payee"];
                    //    $scope.CASHUP_PAYMENT_DETAILS_REPORT_DATA_LIST = data.data.Table;
                    //    alasql('SELECT * INTO XLSX("' + $scope.CASHUP_PAYMENT_DETAILS_REPORT_EXCEL_FILE_NAME + '",{headers:true}) FROM ?', [$scope.CASHUP_PAYMENT_DETAILS_REPORT_DATA_LIST]);
                    //}
                    //if (i == 1 && data.data.Table1.length > 0) {
                    //    $scope.CASHUP_PAYMENT_DETAILS_REPORT_EXCEL_FILE_NAME = data.data.Table1[0]["Payee"];
                    //    $scope.CASHUP_PAYMENT_DETAILS_REPORT_DATA_LIST = data.data.Table1;
                    //    alasql('SELECT * INTO XLSX("' + $scope.CASHUP_PAYMENT_DETAILS_REPORT_EXCEL_FILE_NAME + '",{headers:true}) FROM ?', [$scope.CASHUP_PAYMENT_DETAILS_REPORT_DATA_LIST]);
                    //}
                    //if (i == 2 && data.data.Table2.length > 0) {
                    //    $scope.CASHUP_PAYMENT_DETAILS_REPORT_EXCEL_FILE_NAME = data.data.Table2[0]["Payee"];
                    //    $scope.CASHUP_PAYMENT_DETAILS_REPORT_DATA_LIST = data.data.Table2;
                    //    alasql('SELECT * INTO XLSX("' + $scope.CASHUP_PAYMENT_DETAILS_REPORT_EXCEL_FILE_NAME + '",{headers:true}) FROM ?', [$scope.CASHUP_PAYMENT_DETAILS_REPORT_DATA_LIST]);
                    //}
                    //if (i == 3 && data.data.Table3.length > 0) {
                    //    $scope.CASHUP_PAYMENT_DETAILS_REPORT_EXCEL_FILE_NAME = data.data.Table3[0]["Payee"];
                    //    $scope.CASHUP_PAYMENT_DETAILS_REPORT_DATA_LIST = data.data.Table3;
                    //    alasql('SELECT * INTO XLSX("' + $scope.CASHUP_PAYMENT_DETAILS_REPORT_EXCEL_FILE_NAME + '",{headers:true}) FROM ?', [$scope.CASHUP_PAYMENT_DETAILS_REPORT_DATA_LIST]);
                    //}
                    //if (i == 4 && data.data.Table4.length > 0) {
                    //    $scope.CASHUP_PAYMENT_DETAILS_REPORT_EXCEL_FILE_NAME = data.data.Table4[0]["Payee"];
                    //    $scope.CASHUP_PAYMENT_DETAILS_REPORT_DATA_LIST = data.data.Table4;
                    //    alasql('SELECT * INTO XLSX("' + $scope.CASHUP_PAYMENT_DETAILS_REPORT_EXCEL_FILE_NAME + '",{headers:true}) FROM ?', [$scope.CASHUP_PAYMENT_DETAILS_REPORT_DATA_LIST]);
                    //}
                    //if (i == 5 && data.data.Table5.length > 0) {
                    //    $scope.CASHUP_PAYMENT_DETAILS_REPORT_EXCEL_FILE_NAME = data.data.Table5[0]["Payee"];
                    //    $scope.CASHUP_PAYMENT_DETAILS_REPORT_DATA_LIST = data.data.Table5;
                    //    alasql('SELECT * INTO XLSX("' + $scope.CASHUP_PAYMENT_DETAILS_REPORT_EXCEL_FILE_NAME + '",{headers:true}) FROM ?', [$scope.CASHUP_PAYMENT_DETAILS_REPORT_DATA_LIST]);
                    //}
                    //}

                    //$scope.CASHUP_PAYMENT_DETAILS_REPORT_DATA_LIST = data.data.Table;


                    $scope.enable = "true";
                    $scope.LOADER_ICON = false;
                }
                else {
                    $scope.$parent.ShowAlert("Attention", "No Records Found.", 2000);
                    $scope.enable = "true";
                    $scope.LOADER_ICON = false;
                }
            });
        
    };
    $scope.CASHUP_FLOAT_CASH_REPORT = function (RPTID) {
        var SELECT_FLAG = 0;
        if (RPTID == 12) {
            SELECT_FLAG = 1;  //For Flaot
        } else if (RPTID == 13) {
            SELECT_FLAG = 2; //For Cash
        } else if(RPTID==52) {
            SELECT_FLAG = 3; //For Cash Tips
        }
        $scope.CASHUP_FLOAT_CASH_LIST = [];
        $scope.EXCEL_REPORT_DATA_LIST = [];
        $scope.enable = "false";
        $scope.LOADER_ICON = true;
        CashupModel = new Object();
        CashupModel.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CashupModel.START_DATE = $filter('date')($scope.CashupReportSearch.START_DATE, "MM/dd/yyyy");
        CashupModel.END_DATE = $filter('date')($scope.CashupReportSearch.END_DATE, "MM/dd/yyyy");
        CashupModel.BRANCH_IDS = $scope.CashupReportSearch.BRANCH_ID;
        CashupModel.FLAG = SELECT_FLAG; //RPTID == 12 ? 1 : 2;
        PrcCommMethods.REPORT_API(CashupModel, 'CASHUP_FLOAT_CASH_REPORT').then(function (data) {
            if (data.data != null && data.data.Table != undefined) {
                if ($scope.CashupReportSearch.BRANCH_ID == null)
                    $scope.CASHUP_FLOAT_CASH_LIST = data.data.Table;
                else {
                    $scope.CASHUP_FLOAT_CASH_LIST = data.data.Table;
                    let branch_name = $scope.BRANCH_LIST.filter(p => p.BRANCH_ID == $scope.CashupReportSearch.BRANCH_ID)[0]['BRANCH_NAME'].toUpperCase();
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
                else if (RPTID == 13){
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
        CashupModel.START_DATE = (new Date($scope.CashupReportSearch.START_DATE)).toDateString();
        CashupModel.END_DATE = (new Date($scope.CashupReportSearch.END_DATE)).toDateString();
        CashupModel.BRANCH_IDS = $scope.CashupReportSearch.BRANCH_ID;
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
                    $scope.SELECTED_DATA = [];
                    $scope.SELECTED_DATA = {
                        'BRANCH_NAME': x.BRANCH_NAME == null ? '' : x.BRANCH_NAME,
                        'CASHUP DATE': x.CASHUP_DATE == null ? '' : PrcCommMethods.formatDate(new Date(x.CASHUP_DATE), 'dd/MM/yyyy'),
                        'AUTHORISED_BY': x.AUTHORISED_BY == null ? '' : x.AUTHORISED_BY,
                        'CHECK NO': x.CHECK_NO == null ? '' : x.CHECK_NO,
                        'TABLE NO': x.TABLE_NO == null ? '' : x.TABLE_NO,
                        'REASON FOR COMP': x.REASON_FOR_COMP == null ? '' : x.REASON_FOR_COMP,
                        'COVERS': x.COVERS == null ? '' : x.COVERS,
                        'TIME': x.TIME == null ? '' : x.TIME,
                        'AMOUNT': x.AMOUNT == null ? '' : x.AMOUNT,
                        'NOTE': x.NOTE == null ? '' : x.NOTE,
                    };
                    $scope.EXCEL_REPORT_DATA_LIST.push($scope.SELECTED_DATA);
                });

                //$scope.EXCEL_REPORT_DATA_LIST = $scope.CASHUP_COMP_LIST;
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
        CashupModel.START_DATE = (new Date($scope.CashupReportSearch.START_DATE)).toDateString();
        CashupModel.END_DATE = (new Date($scope.CashupReportSearch.END_DATE)).toDateString();
        CashupModel.BRANCH_IDS = $scope.CashupReportSearch.BRANCH_ID;
        PrcCommMethods.REPORT_API(CashupModel, 'CASHUP_VOUCHER_REPORT').then(function (data) {
            if (data.data != null && data.data.Table.length > 0) {
                $scope.CASHUP_VOUCHER_REPORT = data.data.Table;
                angular.forEach($scope.CASHUP_VOUCHER_REPORT, function (item) {
                    $scope.SELECTED_DATA = [];
                    $scope.SELECTED_DATA =
                        {
                            'ENTITY NAME': item.ENTITY_NAME == null ? '' : item.ENTITY_NAME,
                            'BRANCH NAME': item.BRANCH_NAME == null ? '' : item.BRANCH_NAME,
                            'DATE': item.CASHUP_DATE == null ? '' : PrcCommMethods.formatDate(new Date(item.CASHUP_DATE), 'dd/MM/yyyy'),
                            'REDEEMED/SOLD': item.REEDEEMED_SOLD == null ? '' : item.REEDEEMED_SOLD,
                            'VOUCHER TYPE': item.VOUCHER_TYPE == null ? '00' : item.VOUCHER_TYPE,
                            'VOUCHER NO.': item.VOUCHER_NO == null ? 0 : item.VOUCHER_NO,
                            'AMOUNT': parseFloat(item.AMOUNT),
                            'VALIDITY DATE': item.VALIDITY_DATE == null ? '' : PrcCommMethods.formatDate(new Date(item.VALIDITY_DATE), 'dd/MM/yyyy'),
                            'SOLD TO/REDEEMED BY': item.SOLD_TO_REDEMED_BY == null ? '' : item.SOLD_TO_REDEMED_BY,
                            'PAYMENT METHOD': item.PAYMENT_METHOD == null ? '' : item.PAYMENT_METHOD,
                            'INVOICE NO.': item.INVOICE_NO == null ? '' : item.INVOICE_NO,
                            'REDEEMED ON': item.REDEEMED_ON == null ? '' : PrcCommMethods.formatDate(new Date(item.REDEEMED_ON), 'dd/MM/yyyy')
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
    $scope.GET_DAILY_SALES = function (RPTID) {
        $scope.CASHUP_COMP_LIST = [];
        $scope.EXCEL_REPORT_DATA_LIST = [];
        $scope.enable = "false";
        $scope.LOADER_ICON = true;
        CashupModel = new Object();
        CashupModel.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CashupModel.START_DATE = (new Date($scope.CashupReportSearch.START_DATE)).toDateString();
        CashupModel.END_DATE = (new Date($scope.CashupReportSearch.START_DATE)).toDateString();
        CashupModel.BRANCH_ID = $scope.CashupReportSearch.BRANCH_ID;
        PrcCommMethods.REPORT_API(CashupModel, 'GET_DAILY_SALES').then(function (data) {
            if (data.data != null && data.data.Table != undefined) {
                const SALES_TOTAL_EXCL_TAX = data.data.Table.reduce((previousValue, currentValue) => previousValue + currentValue.SALES_TOTAL_EXCL_TAX, 0);
                const SALES_TOTAL_INC_TAX = data.data.Table.reduce((previousValue, currentValue) => previousValue + currentValue.SALES_TOTAL_INC_TAX, 0);
                $scope.ARRAY = [{
                    A: "Begin date",
                    B: (new Date($scope.CashupReportSearch.START_DATE)).toDateString(),
                },
                {
                    A: "End date",
                    B: (new Date($scope.CashupReportSearch.START_DATE)).toDateString(),
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
    $scope.CASHUP_PETTY_CASH_REPORT = function (RPTID) {
        $scope.CASHUP_COMP_LIST = [];
        $scope.EXCEL_REPORT_DATA_LIST = [];
        $scope.enable = "false";
        $scope.LOADER_ICON = true;
        CashupModel = new Object();
        CashupModel.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CashupModel.START_DATE = (new Date($scope.CashupReportSearch.START_DATE)).toDateString();
        CashupModel.END_DATE = (new Date($scope.CashupReportSearch.END_DATE)).toDateString();
        CashupModel.BRANCH_IDS = $scope.CashupReportSearch.BRANCH_ID;
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
        CashupModel.START_DATE = (new Date($scope.CashupReportSearch.START_DATE)).toDateString();
        CashupModel.END_DATE = (new Date($scope.CashupReportSearch.END_DATE)).toDateString();
        CashupModel.BRANCH_IDS = $scope.CashupReportSearch.BRANCH_ID;
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
        CashupModel.START_DATE = (new Date($scope.CashupReportSearch.START_DATE)).toDateString();
        CashupModel.END_DATE = (new Date($scope.CashupReportSearch.END_DATE)).toDateString();
        CashupModel.BRANCH_IDS = $scope.CashupReportSearch.BRANCH_ID;
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
    $scope.GET_WEEKLY_CASHUP_REPORT_BY_SESSION_CATEGORY = function (RPTID, DISPLAY_HTML_FLAG) {
        $scope.CASHUP_REPORT_DATA_LIST = [];
        $scope.EXCEL_REPORT_DATA_LIST = [];
        $scope.enable = "false";
        $scope.LOADER_ICON = true;
        CashupModel = new Object();
        CashupModel.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CashupModel.START_DATE = (new Date($scope.CashupReportSearch.REPORT_START_DATE)).toDateString();
        CashupModel.END_DATE = (new Date($scope.CashupReportSearch.REPORT_END_DATE)).toDateString();
        CashupModel.BRANCH_ID = $scope.CashupReportSearch.BRANCH_ID;
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
                    var getEntityDate = new Date($scope.CashupReportSearch.REPORT_START_DATE);
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
    $scope.DOWNLOAD_SHOW_POP = function (RPTID) {
        $scope.REPORT_DATA_LIST = [];
        $scope.CASHUP_REPORT_DATA_LIST = [];
        $scope.CASHUP_PAYMENT_DETAILS_REPORT_DATA_LIST = [];
        $scope.RESET_DATE_PICKER();
        $scope.RESET_FILTER();
        //$scope.CashupReportSearch.REPORT_START_DATE = null;
        //$scope.CashupReportSearch.ROTA_END_DATE = null;
        $scope.JSON_COLUMN_NAME = null;
        $scope.SHOW_WEEKLY_CASHUP_HTML_TABLE_FLAG = false;
        $scope.SHOW_REVENUE_CASHUP_HTML_TABLE_FLAG = false;
        if (RPTID == 10) {
            $scope.IS_CUSTOME_DATE_SELECTED = 1;
            $scope.REPORT_NAME = 'Leavers Report'; $('#CASHUP_REPORT').modal('show');
        }
        if (RPTID == 8) {
            $scope.REPORT_NAME = 'Leavers Report'; $('#CASHUP_REPORT').modal('show');
        }
        if (RPTID == 12) {
            $scope.IS_CUSTOME_DATE_SELECTED = 1;
            $scope.REPORT_NAME = 'Total Float Report'; $('#CASHUP_REPORT').modal('show');
        }
        if (RPTID == 11) {
            $scope.IS_CUSTOME_DATE_SELECTED = 1;
            $scope.REPORT_NAME = 'Leavers Report'; $('#CASHUP_REPORT').modal('show');
        }
        if (RPTID == 13) {
            $scope.IS_CUSTOME_DATE_SELECTED = 1;
            $scope.REPORT_NAME = 'Total Cash Report'; $('#CASHUP_REPORT').modal('show');
        }
        if (RPTID == 14 || RPTID == 15) {
            $scope.IS_CUSTOME_DATE_SELECTED = 1;
            RPTID == 14 ? $scope.REPORT_NAME = 'Complimentary Report' : $scope.REPORT_NAME = 'Cashup Vouchers Report';
            $('#CASHUP_REPORT').modal('show');
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
        } if (RPTID == 23) {
            $scope.IS_CUSTOME_DATE_SELECTED = 1;
            $scope.REPORT_NAME = 'Account Customer Report';
            $('#CASHUP_REPORT').modal('show');
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
            $scope.IS_CUSTOME_DATE_SELECTED = 1;
            $scope.REPORT_NAME = 'Sales Performance Reports';
            $('#CASHUP_REPORT').modal('show');            
        }
        if (RPTID == 52) {
            $scope.IS_CUSTOME_DATE_SELECTED = 1;
            $scope.REPORT_NAME = 'Total Cash Tips Report'; $('#CASHUP_REPORT').modal('show');
        }
        $scope.RPTID = RPTID;
    };
    $scope.COMMON_REPORT_GENERATE_FILE = function (RPTID) {


        switch (RPTID) {
           
            case 8:
                $scope.GET_WEEKLY_CASHUP_REPORT($scope.RPTID);
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
            case 27:
                $scope.GET_WEEKLY_CASHUP_REPORT_BY_SESSION_CATEGORY($scope.RPTID);
                break;
            case 28:
                $scope.GET_WEEKLY_CASHUP_REPORT_BY_SESSION_CATEGORY($scope.RPTID);
                break;           
            case 29:
                $scope.GET_EPOS_SALES_REPORT($scope.RPTID);
                break;
            case 36:
                $scope.GET_REVENUE_SUMMARY($scope.RPTID);
                break;
            case 37:
                $scope.GET_EPOS_CARD_PAYMENTS_REPORT($scope.RPTID);
                break;
            case 29:
                $scope.GET_EPOS_SALES_REPORT($scope.RPTID);

            case 38:
                $scope.GET_SALES_PERFORMANCE($scope.RPTID);
                break;
            case 52:
                $scope.CASHUP_FLOAT_CASH_REPORT($scope.RPTID);
                break;
            default:
                break;
        }
    };
    $scope.GET_CASH_BANKING_REPORT = function (RPTID) {
        $scope.CASH_BANKING_REPORT_LIST = [];
        $scope.EXCEL_REPORT_DATA_LIST = [];
        $scope.enable = "false";
        $scope.LOADER_ICON = true;
        CashupModel = new Object();
        CashupModel.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CashupModel.START_DATE = (new Date($scope.CashupReportSearch.START_DATE)).toDateString();
        CashupModel.END_DATE = (new Date($scope.CashupReportSearch.END_DATE)).toDateString();
        CashupModel.BRANCH_ID = $scope.CashupReportSearch.BRANCH_ID;
        CashupModel.FLAG = RPTID == 12 ? 1 : 2;
        $scope.CASH_BANKING_TOTAL = 0;
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
                            'CASH-UP DATE RANGE - FROM': $scope.CashupReportSearch.START_DATE,
                            'CASH-UP DATE RANGE - TO': $scope.CashupReportSearch.END_DATE,
                            'BRANCH NAME': $scope.BRANCH_LIST.filter(p => p.BRANCH_ID == $scope.CashupReportSearch.BRANCH_ID).length == 0 ? "" : $scope.BRANCH_LIST.filter(p => p.BRANCH_ID == $scope.CashupReportSearch.BRANCH_ID)[0]['BRANCH_NAME']
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
                    };
                $scope.EXCEL_REPORT_DATA_LIST.push($scope.SELECTED_DATA);


                alasql('SELECT * INTO XLSX("CASH_BANKING_REPORT",{headers:true}) FROM ?', [$scope.EXCEL_REPORT_DATA_LIST]);
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
    $scope.GET_EPOS_SALES_REPORT = function (RPTID) {

        $scope.CashupReportForm.submitted = true;
       // if ($scope.CashupReportForm.$valid) {
            $scope.enable = "false";
            $scope.LOADER_ICON = true;
            CashupModel = new Object();
            CashupModel.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            CashupModel.START_DATE = (new Date($scope.CashupReportSearch.START_DATE)).toDateString();
            CashupModel.END_DATE = (new Date($scope.CashupReportSearch.END_DATE)).toDateString();
            CashupModel.BRANCH_ID = $scope.CashupReportSearch.BRANCH_ID;
            PrcCommMethods.REPORT_API(CashupModel, 'GET_EPOS_SALES_REPORT').then(function (data) {
                if (data.data != null && data.data.Table.length > 0) {
                    var Table_count = 0;
                    var dataTableArray = [];
                    angular.forEach(data.data, function (data) {
                        dataTableArray[Table_count] = data;
                        Table_count += 1;
                    });
                    for (var i = 0; i < Table_count; i++) {
                        $scope.CASHUP_PAYMENT_DETAILS_REPORT_EXCEL_FILE_NAME = null;
                        $scope.JSON_COLUMN_NAME = [];
                        $scope.EXCEL_REPORT_DATA_LIST = [];
                        $scope.CASHUP_REPORT_DATA_LIST = [];
                        if (i == 0 && data.data.Table.length > 0) {

                            $scope.CASHUP_PAYMENT_DETAILS_REPORT_EXCEL_FILE_NAME = dataTableArray[i][0]["NAME"];
                            $scope.JSON_COLUMN_NAME = [];
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
                            if (dataTableArray[i].length > 0) {
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
                    }
                    $scope.LOADER_ICON = false;
                }
                else {
                    $scope.$parent.ShowAlert("Attention", "No Records Found.", 3000);
                    $scope.enable = "true";
                    $scope.LOADER_ICON = false;
                }
            });
        //}
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
                            alasql('SELECT * INTO XLSX("' + $cookies.get('ENTITY_NAME')+'-'+ $scope.EXCEL_SHEET_NAME + '",{headers:true}) FROM ?', [$scope.EXCEL_REPORT_DATA_LIST]);
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
});
app.controller('CoversController', function ($scope, $http, $interval, CommService, $cookies, $filter, PrcCommMethods, $location, readFileData, $localStorage) {
    $scope.REDIRECTION_PAGE = function (Path) {
        $location.path(Path)
    };
    $scope.DOWNLOAD_FILE_PATH = "/Uploads/Covers_template.xlsx";
    $scope.$parent.COMMON_CODE_CHANGE();
    $scope.UPLOAD_FILE_NAME = null;
    $scope.INVALID_EXCLE_CELL_COUNT = null;
    $scope.INVALID_EXCLE_CELL_FLAG = false;
    $scope.BRANCH_BUDGET_LOGS = [];
    $scope.COVERS_VALIDATE_LIST = [];
    $scope.BRANCH_BUDGET_LOG_DETAILS = [];
    $scope.Files = null;
    $scope.CUSTOMER_IDP = parseInt($cookies.get("CUSTOMER_ID"));
    $scope.CoversSearch = {
        ENTITY_ID: null,
        BRANCH_ID: null,
        LOGO_PATH: '',
        CUSTOMER_ID: '',
        UploadedFiles: [],
        USER_ID: '',
        FILE_NAME: '',
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        CLICK_SEARCH: 0,
        UPL_FILE_FLAG: 1,
        ORIGINAL_FILE_NAME: '',
        SERVER_FILE_NAME: '',
        BRANCH_BUDGET_LOG: null,
        START_DATE: null,
        END_DATE: null,
        SAMPLE_EXCEL_FILE: null,
        VIEW_BRANCH_BUDGETS: [],
        PAGE_NO_DTL: 1,
        PAGE_SIZE_NO_DTL: 500,

    };
    $scope.INVALID_EXCLE_CELL_COUNT = 1;
    $scope.Refreshdata = function () {
        $scope.INVALID_EXCLE_CELL_COUNT = 1;
        $scope.COPY_CODE_ARRY = [];
        $scope.CODE_ARRY = [];
        $scope.submitted = false;
    }
    $scope.FILEUPLOADCLICK = function () {
        $scope.Refreshdata();
    }
    $scope.EXCEL_COVERS_VALIDATE = function () {
        $scope.COPY_CODE_ARRY = [];
        $scope.CODE_ARRY = [];
        $scope.INVALID_EXCLE_CELL_COUNT = 1;
        if (document.getElementById('uploadExcel1').value != null && document.getElementById('uploadExcel1').value != '') {
            ModelObj = new Object();
            ModelObj.UPLOAD_TYPE_ID = 1;
            ModelObj.SERVER_FILE_NAME = $scope.CoversSearch.UploadedFiles[0].SERVER_FILE_NAME;
            ModelObj.ORIGINAL_FILE_NAME = $scope.CoversSearch.UploadedFiles[0].ORIGINAL_FILE_NAME;
            ModelObj.FILE_PATH = $scope.CoversSearch.UploadedFiles[0].FILE_PATH + $scope.CoversSearch.UploadedFiles[0].SERVER_FILE_NAME;
            ModelObj.DATETIME_FORMAT_CULTURE = ["MM/dd/yyyy hh:mm:ss tt", "M/d/yyyy hh:mm:ss tt", "MM/dd/yyyy", "M/d/yyyy"];
            ModelObj.LANGUAGE_SYMBOL = $scope.$parent.LANGUAGE_SYMBOL;
           
            ModelObj.EXCEL_DATATABLE = $scope.COVER_TABLE;
            PrcCommMethods.CASHUP_API(ModelObj, 'EXCEL_COVERS_VALIDATE').then(function (data) {
                $scope.COVERS_VALIDATE_LIST = [];
                $scope.submitted = true;
                $scope.COVERS_VALIDATE_LIST = data.data.HEADER_CLOUMN_NAMES;

                if (data.data.IS_VALID_COUNT > 0) {
                    $scope.INVALID_EXCLE_CELL_COUNT = parseInt(data.data.IS_VALID_COUNT);
                    $scope.INVALID_EXCLE_CELL_FLAG = true;
                    $('#View_Report').modal('show');
                }

                else if (data.data.error == "CODE0001") {
                    $scope.$parent.ShowAlert('Warning', 'No changes found in uploaded Excel', 3000);
                    $scope.submitted = false;
                    $scope.IS_VALID_UPLOAD_FILE = false;
                }
                else if (data.data.error == "CODE0003") {
                    $scope.$parent.ShowAlert('Warning', 'Some thing worng in excel or Enable editing mode in excel', 3000);
                    $scope.submitted = false;
                    $scope.IS_VALID_UPLOAD_FILE = false;
                    if (data.data.Msg == 'A malformed URI was found in the document. Please provide a OpenSettings.RelationshipErrorRewriter to handle these errors while opening a package.') {
                        $scope.Message = "";
                        var List = { DISPLAY_TEXT: "", IS_VALID: false, IS_DATA_VALID: true, CODE: "CODE0003" };
                        $scope.CODE_ARRY.push(List);
                        $scope.COPY_CODE_ARRY.push(List);
                    };
                }
                else if (data.data.error == "CODE0002") {
                    $scope.$parent.ShowAlert('Warning', 'Invalid Excel,either the column header is deleted or mismatch', 3000);
                    $scope.submitted = false;
                    $scope.IS_VALID_UPLOAD_FILE = false;
                }
                else if (data.data.HEADER_CLOUMN_NAMES.length == 0) {
                    $scope.$parent.ShowAlert('Warning', 'No record found', 3000);
                    $scope.submitted = false;
                    $scope.IS_VALID_UPLOAD_FILE = false;
                }
                else {
                    $scope.INVALID_EXCLE_CELL_FLAG = false;
                    $scope.INVALID_EXCLE_CELL_COUNT = parseInt(data.data.IS_VALID_COUNT);
                    $scope.$parent.ShowAlert('Success', 'File validated successfully,please click on submit', 5000);
                }
                //if (($scope.BRANCH_BUDGETS.filter(x => x.ERROR != "").length) > 0) {
                //    $scope.INVALID_EXCLE_CELL_FLAG = true;
                //    $scope.INVALID_EXCLE_CELL_COUNT = $scope.BRANCH_BUDGETS.filter(x => x.ERROR != "").length;
                //}
                //else {
                //    $scope.INVALID_EXCLE_CELL_FLAG = false;
                //    $scope.INVALID_EXCLE_CELL_COUNT = $scope.BRANCH_BUDGETS.filter(x => x.ERROR != "").length;
                //}
            });
        }
        else {
            $scope.$parent.ShowAlert('Attention', 'Please Upload File', 3000);
        }
    };

    $scope.LAZY_CU_COVER_LOG_DETAILS = function (COVER) {
        $scope.GET_CU_COVER_LOG_DTL(COVER, 1)
    }

    $scope.GET_CU_COVER_LOG_DTL = function (COVER, FLAG) {
        if (FLAG == undefined) {
            $scope.CU_COVER_LOG_DETAILS = [];
            $scope.CoversSearch.PAGE_NO_DTL = 1;
        }
        $scope.COVERS_LINE = COVER;
        $scope.UPLOADED_FILE_NAME = COVER.ORIGINAL_FILE_NAME;
        if (COVER.CU_COVER_LOG_DETAILS == undefined || COVER.CU_COVER_LOG_DETAILS.length == 0 || FLAG == 1) {
            ModelObj = new Object();
            ModelObj.CU_COVER_LOG_HDR_ID = COVER.CU_COVER_LOG_HDR_ID;
            ModelObj.PAGE_NO = $scope.CoversSearch.PAGE_NO_DTL;
            ModelObj.PAGE_SIZE = $scope.CoversSearch.PAGE_SIZE_NO_DTL;
            PrcCommMethods.CASHUP_API(ModelObj, 'GET_CU_COVER_LOG_DTL').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.CU_COVER_LOG_DETAILS = $scope.CU_COVER_LOG_DETAILS.concat(data.data.Table);
                    if (data.data.Table.length < $scope.CoversSearch.PAGE_SIZE_NO_DTL) {
                        $scope.GetDataDTL = false;
                    }
                    else {
                        $scope.CoversSearch.PAGE_NO_DTL = parseInt($scope.CoversSearch.PAGE_NO_DTL) + 1;
                        $scope.GetDataDTL = true;
                    }
                }
                else {
                    $scope.GetDataDTL = false;
                }
                COVER.CU_COVER_LOG_DETAILS = $scope.CU_COVER_LOG_DETAILS;
            });
        }
        else {
            $scope.CU_COVER_LOG_DETAILS = [];
            $scope.CU_COVER_LOG_DETAILS = COVER.CU_COVER_LOG_DETAILS;
        }

        //BOOKING_SOURCE: "Booking NAC"
        //COVER_COUNT: 2
        //CREATED_DATE: "2022-06-07T19:33:19"
        //CU_COVER_LOG_HDR_ID: 1
        //ID: 11
        //PAGING: 11
        //RESERVATION_DATE: "2022-06-07T00:00:00"
        //RESERVATION_TIME: "21:45:00"
        //REVENUE_CENTRE: ""
        //SHIFT_NAME: "DINNER"
        //STATUS: "Complete"

    };
    $scope.COPY_CODE_ARRY = [];
    $scope.ngintvalidationvalue = function (key, value) {

        var List
        if (value == "<i class='fa fa-exclamation-triangle text-danger'></i>") {
            List = { DISPLAY_TEXT: "", IS_VALID: true };
        }
        else {
            if (key == "COMMENTS") {

            }
            var val = value.split(':;:');
            if (val.length > 1) {
                if (val[1] == "DDL0004") {
                    List = { DISPLAY_TEXT: val[0], IS_VALID: false, IS_DATA_VALID: true, CODE: val[1], Suggestion: val, D_COLUMN_NAME: val[2] };
                    $scope.COPY_CODE_ARRY.push(List);
                }
                else {
                    List = { DISPLAY_TEXT: val[0], IS_VALID: false, IS_DATA_VALID: true, CODE: val[1], Suggestion: val };
                    $scope.COPY_CODE_ARRY.push(List);
                }
            }
            else {
                if (key == "NI Number" && value != '' || key == "NI Number*" && value != '') {
                    const repeatRegex = /^[A-CEGHJ-PR-TW-Z]{1}[A-CEGHJ-NPR-TW-Z]{1}[0-9]{6}[A-D]{1}$/i;
                    var found = value.match(repeatRegex);
                    if (found == null) {
                        List = { DISPLAY_TEXT: value, IS_VALID: false, IS_DATA_VALID: true, CODE: "INVALID0011" };
                        $scope.COPY_CODE_ARRY.push(List);
                    }
                    else {
                        List = { DISPLAY_TEXT: value, IS_VALID: false };
                    }
                }
                else {
                    if (key == "RESERVATION_DATE" || key == "CREATED_DATE") {
                        value = value.split(' ')[0];
                    }
                    List = { DISPLAY_TEXT: value, IS_VALID: false };
                }
            }
        }
        return List;
    }
    $scope.CODE_ARRY = [];
    $scope.$on('ngRepeatFinishedRender', function (ngRepeatFinishedEvent) {
        $scope.CODE_ARRY = $scope.COPY_CODE_ARRY;
    });
    $scope.RESET_UPLOAD = function () {
        $scope.CoversSearch.BRANCH_ID = null;
        $scope.CoversSearch.START_DATE = null;
        $scope.CoversSearch.END_DATE = null;
        $scope.CoversSearch.END_DATE = null;
        document.getElementById('uploadExcel1').value = '';
        $scope.INVALID_EXCLE_CELL_FLAG = false;
        $scope.INVALID_EXCLE_CELL_COUNT = 1;
        $scope.submitted = false;
        $scope.COPY_CODE_ARRY = [];
        $scope.CODE_ARRY = [];
        // $scope.NG_PAGE_LOAD();
        $scope.CoversForm.submitted = false;

    }
    $scope.GET_CU_COVER_LOG_HDR = function (FLAG) {
        if (FLAG == undefined) {
            $scope.CU_COVER_LOG_HDR_DETAILS = [];
            $scope.CoversSearch.PAGE_NO = 1;
        }
        ModelObj = new Object();
        ModelObj.USER_NAME = $scope.CoversSearch.USER_NAME;
        ModelObj.ORIGINAL_FILE_NAME = $scope.CoversSearch.ORIGINAL_FILE_NAME;
        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        ModelObj.BRANCH_ID = $scope.CoversSearch.BRANCH_ID_FILTER;
        ModelObj.START_DATE = $scope.CoversSearch.START_DATE_FILTER;
        ModelObj.END_DATE = $scope.CoversSearch.END_DATE_FILTER;
        ModelObj.PAGE_NO = $scope.CoversSearch.PAGE_NO;
        ModelObj.PAGE_SIZE = $scope.CoversSearch.PAGE_SIZE;
        PrcCommMethods.CASHUP_API(ModelObj, 'GET_CU_COVER_LOG_HDR').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.CU_COVER_LOG_HDR_DETAILS = $scope.CU_COVER_LOG_HDR_DETAILS.concat(data.data.Table);
                if (data.data.Table.length < $scope.CoversSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.CoversSearch.PAGE_NO = parseInt($scope.CoversSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else {
                $scope.GetData = false;
            }

        });
    };

    function reportrange(startDate, endDate) {
        $scope.CoversSearch.START_DATE_FILTER = startDate.format($scope.$parent.Datelocaleformat.format);
        $scope.CoversSearch.END_DATE_FILTER = endDate.format($scope.$parent.Datelocaleformat.format);
        $('#reportrange span').html(startDate.format($scope.$parent.Datelocaleformat.format) + ' - ' + endDate.format($scope.$parent.Datelocaleformat.format));

    };
    function reportrangeCoverView(startDate, endDate) {
        $scope.CoversSearch.START_DATE_VIEW_FILTER = startDate.format($scope.$parent.Datelocaleformat.format);
        $scope.CoversSearch.END_DATE_VIEW_FILTER = endDate.format($scope.$parent.Datelocaleformat.format);
        $('#reportrangeCoverView span').html(startDate.format($scope.$parent.Datelocaleformat.format) + ' - ' + endDate.format($scope.$parent.Datelocaleformat.format));
    };

    $scope.NG_PAGE_LOAD = function () {
        $(function () {
            startDate = moment().startOf('month');//moment().startOf('isoWeek');//moment().subtract(6, 'days');
            endDate = moment().endOf('month'); //moment().subtract(0, 'days');
            $scope.$parent.SetUpDateRangeMultiDatePicker('reportrange', startDate, endDate, reportrange);
            $scope.$parent.SetUpDateRangeMultiDatePicker('reportrangeCoverView', startDate, endDate, reportrangeCoverView);
            $('#reportrange span').html(startDate.format($scope.$parent.Datelocaleformat.format) + ' - ' + endDate.format($scope.$parent.Datelocaleformat.format));
            $('#reportrangeCoverView span').html(startDate.format($scope.$parent.Datelocaleformat.format) + ' - ' + endDate.format($scope.$parent.Datelocaleformat.format));
        });
    }
    $scope.NG_PAGE_LOAD();
    $scope.GET_CU_COVER_LOG_HDR();

    $scope.COVER_TABLE = [{ ID: 1, COLUMN_NAME: 'SHIFT_NAME', IS_MANDATORY: true, HEADER_NAME: 'Shift Name', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true },
    { ID: 2, COLUMN_NAME: 'RESERVATION_DATE', IS_MANDATORY: true, HEADER_NAME: 'RESERVATION_DATE', FIELD_TYPE_ID: 9, VALUES_ENTITY: '', ACTIVE: true },
    { ID: 3, COLUMN_NAME: 'RESERVATION_TIME', IS_MANDATORY: true, HEADER_NAME: 'RESERVATION_TIME', FIELD_TYPE_ID: 14, VALUES_ENTITY: '', ACTIVE: true },//TIME DATATYPE
    { ID: 4, COLUMN_NAME: 'STATUS', IS_MANDATORY: true, HEADER_NAME: 'STATUS', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true },
    { ID: 5, COLUMN_NAME: 'BOOKING_SOURCE', IS_MANDATORY: true, HEADER_NAME: 'BOOKING_SOURCE', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true },
    { ID: 6, COLUMN_NAME: 'COVER_COUNT', IS_MANDATORY: true, HEADER_NAME: 'COVER_COUNT', FIELD_TYPE_ID: 5, VALUES_ENTITY: '', ACTIVE: true },
    { ID: 7, COLUMN_NAME: 'CREATED_DATE', IS_MANDATORY: true, HEADER_NAME: 'CREATED_DATE', FIELD_TYPE_ID: 9, VALUES_ENTITY: '', ACTIVE: true },
    { ID: 14, COLUMN_NAME: 'REVENUE_CENTRE', IS_MANDATORY: false, HEADER_NAME: 'REVENUE_CENTRE', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true },
    { ID: 8, COLUMN_NAME: 'REVENUE', IS_MANDATORY: true, HEADER_NAME: 'REVENUE', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, FIELD_MASTER_ID: -1 }];
    $scope.INS_UPD_CU_COVERS = function () {
        var IS_VALID = true;
        $scope.CoversForm.submitted = true;
        if ($scope.CoversForm.$valid) {
            if (new Date($scope.CoversSearch.START_DATE) > new Date($scope.CoversSearch.END_DATE)) {
                $scope.$parent.ShowAlert("Error", "end date should be less then start date", 2000);
                IS_VALID = false;
            }
        }
        if ($scope.CoversForm.$valid && IS_VALID) {
            ModelObj = new Object();
            ModelObj.BRANCH_ID = $scope.CoversSearch.BRANCH_ID;
            ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            ModelObj.USER_ID = parseInt($cookies.get("USERID"));
            ModelObj.SERVER_FILE_NAME = '../Uploads/' + $scope.CoversSearch.UploadedFiles[0].FILE_PATH + $scope.CoversSearch.UploadedFiles[0].SERVER_FILE_NAME;
            ModelObj.ORIGINAL_FILE_NAME = $scope.CoversSearch.UploadedFiles[0].ORIGINAL_FILE_NAME;
            ModelObj.START_DATE = $scope.CoversSearch.START_DATE;
            ModelObj.END_DATE = $scope.CoversSearch.END_DATE;
            ModelObj.CU_COVERS_TYPE_DETAIL = $scope.COVERS_VALIDATE_LIST;
            PrcCommMethods.CASHUP_API(ModelObj, 'INS_UPD_CU_COVERS').then(function (data) {
                if (parseInt(data.data) > 0) {
                    $scope.$parent.ShowAlert('Success', 'Successfully Uploaded', 3000);
                    $scope.INVALID_EXCLE_CELL_COUNT = null;
                    $scope.INVALID_EXCLE_CELL_FLAG = false;
                    document.getElementById('uploadExcel1').value = '';
                    //$scope.BRANCH_LIST_VIEW = null;
                    $scope.GET_CU_COVER_LOG_HDR();
                    $scope.RESET_UPLOAD();
                    $scope.submitted = false;
                }
            });
        }
    };
    var USER_ID = parseInt($cookies.get("USERID"));
    PrcCommMethods.GET_BRANCH_LIST(parseInt($cookies.get("ENTITY_ID")), USER_ID, 1).then(function (data) {

        $scope.BRANCH_LIST = angular.copy(data);
        $scope.BRANCH_LIST_VIEW = angular.copy(data);
        if ($scope.BRANCH_LIST.length == 1) {
            $scope.CoversSearch.BRANCH_ID = $scope.BRANCH_LIST[0].BRANCH_ID;
            $scope.CoversSearch.BRANCH_ID_FILTER = $scope.BRANCH_LIST[0].BRANCH_ID;
        }
    });
    //$scope.ADMIN_GET_BRANCH = function (Flag) {
    //    ModelObj = new Object();
    //    ModelObj.CUSTOMER_ID = parseInt($cookies.get('CUSTOMER_ID'));
    //    ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
    //    ModelObj.BRANCH_CODE = null;//$scope.GroupSearch.BRANCH_CODE;
    //    ModelObj.BRANCH_NAME = null;// $scope.GroupSearch.BRANCH_NAME;
    //    ModelObj.CONTACT_NAME = null;// $scope.GroupSearch.CONTACT_NAME;
    //    ModelObj.LOCATION_IDS = null;
    //    ModelObj.ACTIVE = 1;//$scope.BrachSearch.ACTIVE ? 1 : 0;
    //    ModelObj.PAGE_NO = 0;
    //    ModelObj.PAGE_SIZE = 0;
    //    ModelObj.USER_ID = parseInt($cookies.get("USERID"));
    //    PrcCommMethods.ADMIN_API(ModelObj, 'ADMIN_GET_BRANCH').then(function (data) {
    //        
    //        $scope.BRANCH_LIST = angular.copy(data.data.Table);
    //        $scope.BRANCH_LIST_VIEW = angular.copy(data.data.Table);
    //        if ($scope.BRANCH_LIST.length == 1) {
    //            $scope.CoversSearch.BRANCH_ID = $scope.BRANCH_LIST[0].BRANCH_ID;
    //            $scope.CoversSearch.BRANCH_ID_FILTER = $scope.BRANCH_LIST[0].BRANCH_ID;
    //        }
    //    });
    //};
    //$scope.ADMIN_GET_BRANCH();
    $scope.LAZY_CU_COVER_LOG_HDR_DETAILS = function () { $scope.GET_CU_COVER_LOG_HDR(1); };
    $scope.LAZY_GET_CU_COVERS = function () { $scope.GET_CU_COVERS(1) }

    $scope.GET_CU_COVERS = function (FLAG) {
        ModelObj = new Object();
        if (FLAG == undefined) {
            $scope.CU_COVERS_LIST = [];
            $scope.CoversSearch.PAGE_NO = 1;
        }

        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        ModelObj.START_DATE = $scope.CoversSearch.START_DATE_VIEW_FILTER;
        ModelObj.END_DATE = $scope.CoversSearch.END_DATE_VIEW_FILTER;
        ModelObj.BRANCH_ID = $scope.CoversSearch.BRANCH_ID;
        ModelObj.PAGE_NO = $scope.CoversSearch.PAGE_NO;
        ModelObj.PAGE_SIZE = $scope.CoversSearch.PAGE_SIZE;
        PrcCommMethods.CASHUP_API(ModelObj, 'GET_CU_COVERS').then(function (data) {

            if (data.data.Table.length > 0) {
                $scope.CU_COVERS_LIST = $scope.CU_COVERS_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.CoversSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.CoversSearch.PAGE_NO = parseInt($scope.CoversSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else {
                if ($scope.CU_COVERS_LIST.length == 0) {
                }
                $scope.GetData = false;
            }

        });
    };
    $scope.RESET = function () {
        $scope.CoversSearch = {
            ENTITY_ID: null,
            BRANCH_ID: null,
            LOGO_PATH: '',
            CUSTOMER_ID: '',
            UploadedFiles: [],
            USER_ID: '',
            FILE_NAME: '',
            PAGE_NO: 1,
            PAGE_SIZE: 10,
            CLICK_SEARCH: 0,
            UPL_FILE_FLAG: 1,
            ORIGINAL_FILE_NAME: '',
            SERVER_FILE_NAME: '',
            BRANCH_BUDGET_LOG: null,
            START_DATE: null,
            END_DATE: null,
            SAMPLE_EXCEL_FILE: null,
            VIEW_BRANCH_BUDGETS: []
        };
        $scope.BRANCH_LIST_VIEW = [];
    };

    $scope.RESET_FILTER = function () {
        $scope.CoversSearch.USER_NAME = null,
            $scope.CoversSearch.BRANCH_ID_FILTER = null,
            $scope.CoversSearch.START_DATE_FILTER = null,
            $scope.CoversSearch.END_DATE_FILTER = null,
            $scope.CoversSearch.ORIGINAL_FILE_NAME = null,
            $scope.NG_PAGE_LOAD();
    }
    $scope.RESET_VIEW_COVERS = function () {
        $scope.RESET_FILTER();
    }

});

