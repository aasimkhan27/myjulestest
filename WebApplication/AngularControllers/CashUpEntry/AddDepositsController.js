app.controller('DepositsAddListController', function ($scope, $http, $interval, CommService, $cookies, $filter, PrcCommMethods, $location, readFileData, readFileDataNew, $sce) {
    $scope.DepositeSearch = {
        VOUCHER_ID: null,
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        CODE : "",
        VALUE : "",
        VALIDITY_DATE : "",
         CUSTOMER_NAME : "",
        PAYMENT_METHOD_ID : null,
        CHECK_NO : "",
        NOTE : ""
    }

    $scope.MENU_CLICK(6, 'CD');
    $scope.GET_PAYMENT_METHODS = function () {
        var CashupModelObj = new Object();
        CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CashupModelObj.TYPE_ID = 3;
        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_PAYMENT_METHODS').then(function (data) {
            if (data != undefined && data.data != undefined) {
                $scope.PAYMENT_METHODS = data.data.Table.filter(function (x) { return x.FLAG == 1 });
                $scope.PAYMENT_METHODS_RECEIVED = data.data.Table.filter(function (x) { return x.FLAG == 2 || x.FLAG == 1 });
            } else {
                $scope.PaymentList = null;
            }
        });
    }
    //------------------------Select Redeeemed Data----------------------
    $scope.GET_PAYMENT_METHODS();


    $scope.RESETPAGESEARCH = function () {
        $scope.DepositeSearch.INVOICENUMBER = null;
        $scope.DepositeSearch.DEPOSIT_REFERENCE = null;
        $scope.DepositeSearch.PAYMENT_MODE_ID = null;
        $scope.DepositeSearch.PAYEE_NAME = null;
    }


    $scope.CheckDecimal = function (VISS) {
        if ($scope.DepositeSearch.VALUE == '.') {
            $scope.DepositeSearch.VALUE = '';
        }
    };
    $scope.LAZY_GET_DEPOSITS = function () {
        $scope.GET_DEPOSITS();
    }

    $scope.GET_DEPOSITS = function (FLAG) {
        var CashupModelObj = new Object();
        if (FLAG == 1) {
            $scope.DEPOSITS_LIST = [];
            $scope.DepositeSearch.PAGE_NO = 1;
        }
        CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CashupModelObj.BRANCH_ID = $scope.DepositeSearch.FILTER_BRANCH_ID;
        CashupModelObj.INVOICENUMBER = $scope.DepositeSearch.FILTER_INVOICENUMBER;
        CashupModelObj.DEPOSIT_REFERENCE = $scope.DepositeSearch.FILTER_DEPOSIT_REFERENCE;
        CashupModelObj.PAYMENT_MODE_ID = $scope.DepositeSearch.FILTER_PAYMENT_METHOD_ID;
        CashupModelObj.PAYEE_NAME = $scope.DepositeSearch.FILTER_PAYEE_NAME;
        CashupModelObj.PAGE_NO = $scope.DepositeSearch.PAGE_NO;
        CashupModelObj.PAGE_SIZE = $scope.DepositeSearch.PAGE_SIZE;
        CashupModelObj.IS_SHOW_REDEEMED = 1;
        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_DEPOSITS').then(function (data) {
            if (data != undefined && data.data != undefined && data.data.length > 0) {
                if (FLAG == 1) {
                    $scope.DEPOSITS_LIST = [];
                    $scope.DEPOSITS_LIST = data.data;
                } else {
                    $scope.DEPOSITS_LIST = $scope.DEPOSITS_LIST.concat(data.data);
                }
                //angular.forEach($scope.DepositsList, function (Dep) {Dep.IS_CHECKED = false;})
                if (data.data.length < $scope.DepositeSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.DepositeSearch.PAGE_NO = parseInt($scope.DepositeSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            } else {

                $scope.GetData = false;
            }
        });
    };
    $scope.UPLOAD_DEPOSITE_CHECK = function () {
        if ($scope.DepositeSearch.CODE != null && $scope.DepositeSearch.CODE != "") {
            var CashupModelObj = new Object();
            CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            CashupModelObj.BRANCH_ID = $scope.DepositeSearch.BRANCH_ID;
            CashupModelObj.DEPOSIT_REFERENCE = $scope.DepositeSearch.CODE;
            PrcCommMethods.CASHUP_API(CashupModelObj, 'UPLOAD_DEPOSITE_CHECK').then(function (data) {
                if (data != undefined && data.data != undefined && data.data.length > 0) {
                    $scope.V_CHK = false;
                    if (data.data[0].SUCCESS_STATUS == true) {
                        $scope.V_CHK = true;
                        $scope.DepositeSearch.CODE = "";
                        $scope.DepositeSearch.VALUE = "";
                        $scope.DepositeSearch.VALIDITY_DATE = "";
                        $scope.DepositeSearch.CUSTOMER_NAME = "";
                        $scope.DepositeSearch.PAYMENT_METHOD_ID = null;
                        $scope.DepositeSearch.NOTE = "";
                        //$scope.AddDepositForm.submitted = false;
                        $scope.$parent.ShowAlert("Attention", "Deposit Reference entry is already exist.", 3000);
                    }
                }
            });
        } else {
            $scope.V_CHK = false;
            $scope.AddDepositForm.submitted = false;
        }
    }
    $scope.RESET_ADDCANCEL = function () {
        $scope.DepositeSearch.CODE = "";
        $scope.DepositeSearch.VALUE = "";
        $scope.DepositeSearch.VALIDITY_DATE = "";
        $scope.DepositeSearch.CUSTOMER_NAME = "";
        $scope.DepositeSearch.PAYMENT_METHOD_ID = null;
        $scope.DepositeSearch.CHECK_NO = "";
        $scope.DepositeSearch.NOTE = "";
        $scope.AddDepositForm.submitted = false;

    }
    $scope.RESET_GET_DEPOSITS = function () {
        $scope.DepositeSearch.FILTER_INVOICENUMBER = "";
        //$scope.DepositeSearch.FILTER_DATE = "";
        $scope.DepositeSearch.FILTER_DEPOSIT_REFERENCE = "";
        $scope.DepositeSearch.FILTER_PAYEE_NAME = "";
        $scope.DepositeSearch.FILTER_PAYMENT_METHOD_ID = null;        
        $scope.DEPOSITS_LIST = [];
        $scope.GET_DEPOSITS(1);
    }
    $scope.ADD_AMT_CANCEL = function (LINE) {
        $('#CancelDepositForm').modal('show');
        $scope.SELECTED_LINE = "";
        $scope.SELECTED_LINE = angular.copy(LINE);
    }


    var objBrach = new Object();
    objBrach.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
    objBrach.USER_ID = parseInt($cookies.get("USERID"));
    objBrach.MODULE_ID = 1;
    objBrach.PRIVILEGE_ID = $scope.$parent.CheckSubModuleAccess(123) ? 123 : 0;
    objBrach.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));

    PrcCommMethods.CASHUP_API(objBrach, "GET_BRANCH_LIST_BY_PRIVILEGE").then(function (data) {
        $scope.BRANCH_LIST = data.data.Table;
        if ($scope.BRANCH_LIST.length > 0) {
            $scope.DepositeSearch.BRANCH_ID = $scope.BRANCH_LIST[0].BRANCH_ID;
            $scope.DepositeSearch.FILTER_BRANCH_ID = $scope.BRANCH_LIST[0].BRANCH_ID;
            $scope.GET_DEPOSITS(1);
        }
    });
   
    $scope.ValidateDepositeIssue = function () {
        $scope.$parent.CASHUP.DEPOSITSVALID = true;
        angular.forEach($scope.VoucherIssuedList, function (x) {
            x.CODE_VALID = true;
            x.VALUE_VALID = true;
            x.PAYMENT_METHOD_ID_VALID = true;
            x.CHECK_NO_VALID = true;
            x.RED_CODE_VALID = true;
            x.RED_VALUE_VALID = true;
            x.RED_PAYMENT_METHOD_ID_VALID = true;
            x.RED_CHECK_NO_VALID = true;

            if (x.IS_REDEEMED == false && x.ENTRY_TYPE_ID == 3) {
                //if (x.ENTRY_TYPE_ID == 3) {
                if (((x.CODE != null && x.CODE != "") || (x.VALUE != null && x.VALUE != "") || (x.PAYMENT_METHOD_ID != null && x.PAYMENT_METHOD_ID != "") || (x.CHECK_NO != null && x.CHECK_NO != "") || (x.AUTHORIZED_BY != null && x.AUTHORIZED_BY != "")) && (x.IS_DELETED == 0)) {
                    if (x.CODE == null || x.CODE == undefined || x.CODE == "") {
                        x.CODE_VALID = false;
                    }
                    if (x.VALUE == null || x.VALUE == 0 || x.VALUE == "") {
                        x.VALUE_VALID = false;
                    }
                    if (x.PAYMENT_METHOD_ID == null || x.PAYMENT_METHOD_ID == 0 || x.PAYMENT_METHOD_ID == "") {
                        x.PAYMENT_METHOD_ID_VALID = false;
                    }
                    if (x.CHECK_NO == null || x.CHECK_NO == 0 || x.CHECK_NO == "") {
                        x.CHECK_NO_VALID = false;
                    }
                }
            } else if (x.IS_REDEEMED == true && x.ENTRY_TYPE_ID == 3) {
                if (((x.CODE != null && x.CODE != "") || (x.VALUE != null && x.VALUE != "") || (x.PAYMENT_METHOD_ID != null && x.PAYMENT_METHOD_ID != "") || (x.CHECK_NO != null && x.CHECK_NO != "") || (x.AUTHORIZED_BY != null && x.AUTHORIZED_BY != "")) && (x.IS_DELETED == 0)) {
                    if (x.CODE == null || x.CODE == undefined || x.CODE == "") {
                        x.RED_CODE_VALID = false;
                    }
                    if (x.VALUE == null || x.VALUE == 0 || x.VALUE == "") {
                        x.RED_VALUE_VALID = false;
                    }
                    if (x.PAYMENT_METHOD_ID == null || x.PAYMENT_METHOD_ID == 0 || x.PAYMENT_METHOD_ID == "") {
                        x.RED_PAYMENT_METHOD_ID_VALID = false;
                    }
                    if (x.CHECK_NO == null || x.CHECK_NO == 0 || x.CHECK_NO == "") {
                        x.RED_CHECK_NO_VALID = false;
                    }
                }
            }
            if (!x.CODE_VALID || !x.VALUE_VALID || !x.PAYMENT_METHOD_ID_VALID || !x.CHECK_NO_VALID || !x.RED_CODE_VALID || !x.RED_VALUE_VALID || !x.RED_PAYMENT_METHOD_ID_VALID || !x.RED_CHECK_NO_VALID) {
                $scope.$parent.CASHUP.DEPOSITSVALID = false;
            }
        });
        if ($scope.$parent.CASHUP.DEPOSITSVALID == false) {
            if ($scope.VoucherIssuedList.length > 0) {
                $scope.$parent.CASHUP.AUTOVALID_DEPOSITE = $scope.VoucherIssuedList;
            }
        }
    }

    $scope.INSERT_ENTRY_DEPOSIT_DECLARATION = function (FLAG_CONT) {
        if (($scope.DepositeSearch.CODE != "" && $scope.DepositeSearch.CODE != undefined) || ($scope.DepositeSearch.VALUE != "" && $scope.DepositeSearch.VALUE != undefined) || ($scope.DepositeSearch.VALIDITY_DATE != "" && $scope.DepositeSearch.VALIDITY_DATE != undefined) || ($scope.DepositeSearch.CUSTOMER_NAME != "" && $scope.DepositeSearch.CUSTOMER_NAME != undefined) || ($scope.DepositeSearch.PAYMENT_METHOD_ID != null && $scope.DepositeSearch.PAYMENT_METHOD_ID != undefined) || ($scope.DepositeSearch.CHECK_NO != "" && $scope.DepositeSearch.CHECK_NO != undefined) || ($scope.DepositeSearch.NOTE != "" && $scope.DepositeSearch.NOTE != undefined)) {
            $scope.AddDepositForm.submitted = true;
        } else {
            $scope.AddDepositForm.submitted = false;
        }
      
        if ($scope.AddDepositForm.$valid && $scope.V_CHK == false) {

            var VoucherList = [];
            var DEPOSIT_TOTAL = 0;
            var DEPOSIT_REDEEMED_TOTAL = 0;

            var voucher = new Object();
            voucher.ID = $scope.DepositeSearch.VOUCHER_ID;
            voucher.ENTRY_TYPE_ID = 3// voucherissue.ENTRY_TYPE_ID;
            voucher.ENTRY_TYPE_DETAIL_ID = 0// voucherissue.ENTRY_TYPE_DETAIL_ID;
            voucher.VOUCHER_TYPE = null// voucherissue.VOUCHER_TYPE;
            voucher.CODE = $scope.DepositeSearch.CODE != null ? $scope.DepositeSearch.CODE : "";
            voucher.VALUE = parseFloat($scope.DepositeSearch.VALUE).toFixed(5);
            voucher.VALIDITY_DATE = $scope.DepositeSearch.VALIDITY_DATE;
            voucher.CUSTOMER_NAME = $scope.DepositeSearch.CUSTOMER_NAME + '';
            var MODE = $scope.PAYMENT_METHODS.filter(function (x) { return x.PAYMENT_METHOD_ID == $scope.DepositeSearch.PAYMENT_METHOD_ID });
            if (MODE.length > 0) {
                voucher.MODE = MODE[0].METHOD_NAME;
            }
            voucher.PAYMENT_METHOD_ID = $scope.DepositeSearch.PAYMENT_METHOD_ID;
            voucher.CHECK_NO = $scope.DepositeSearch.CHECK_NO;
            voucher.NOTE = $scope.DepositeSearch.NOTE + '';
            voucher.IS_REDEEMED = false;
            voucher.IS_COMPLIMENTARY = false;
            voucher.IS_DELETED = 0;
            voucher.DEPOSIT_CANCELLATION_FEE = null;
            voucher.IS_CANCELLED = 0;
            voucher.TOTAL_AMT = voucher.VALUE;
            VoucherList.push(voucher);

            var CashupModelObj = new Object();
            CashupModelObj.VIEW_CASHUP_HEADER_ID = null;
            CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            CashupModelObj.BRANCH_ID = $scope.DepositeSearch.BRANCH_ID;
            CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
            CashupModelObj.DEPOSIT_TOTAL = DEPOSIT_TOTAL;
            CashupModelObj.REDEEMED_TOTAL = DEPOSIT_REDEEMED_TOTAL;
            CashupModelObj.DECLARATION_DETAILS = VoucherList;
            CashupModelObj.STEP_NO = 9;
            PrcCommMethods.CASHUP_API(CashupModelObj, 'VIEW_INS_ENTRY_DEPOSIT_DECLARATION').then(function (data) {
                if (data.data == 1) {
                    $scope.DepositeSearch.CODE = "";
                    $scope.DepositeSearch.VALUE = "";
                    $scope.DepositeSearch.VALIDITY_DATE = "";
                    $scope.DepositeSearch.CUSTOMER_NAME = "";
                    $scope.DepositeSearch.PAYMENT_METHOD_ID = null;
                    $scope.DepositeSearch.CHECK_NO = "";
                    $scope.DepositeSearch.NOTE = "";
                    $scope.V_CHK = true;
                    if (FLAG_CONT == undefined) {
                        $('#Add_Deposits').modal('hide');
                    }
                    $scope.GET_DEPOSITS(1);
                    $scope.AddDepositForm.submitted = false;
                }
            });
        } 
    };

    $scope.CANCEL_ENTRY_DEPOSIT_DECLARATION = function () {
        if (($scope.SELECTED_LINE.CANCEL_AMT != null && $scope.SELECTED_LINE.CANCEL_AMT != undefined) || ($scope.SELECTED_LINE.CANCEL_NOTES != null && $scope.SELECTED_LINE.CANCEL_NOTES != undefined)) {
            $scope.CancelDepositForm.submitted = true;
        } else {
            $scope.CancelDepositForm.submitted = false;
        }
       
        if ($scope.CancelDepositForm.$valid) {
            var VoucherList = [];
            var DEPOSIT_TOTAL = 0;
            var DEPOSIT_REDEEMED_TOTAL = 0;
            var voucher = new Object();
            voucher.ID = $scope.SELECTED_LINE.ID;
            voucher.ENTRY_TYPE_ID = 3// voucherissue.ENTRY_TYPE_ID;
            voucher.ENTRY_TYPE_DETAIL_ID = 0// voucherissue.ENTRY_TYPE_DETAIL_ID;
            voucher.VOUCHER_TYPE = null// voucherissue.VOUCHER_TYPE;
            voucher.CODE = $scope.SELECTED_LINE.CODE != null ? $scope.SELECTED_LINE.CODE : "";
            voucher.VALUE = parseFloat($scope.SELECTED_LINE.VALUE).toFixed(5);
            voucher.VALIDITY_DATE = $scope.SELECTED_LINE.VALIDITY_DATE;
            voucher.CUSTOMER_NAME = $scope.SELECTED_LINE.CUSTOMER_NAME;
            voucher.MODE = $scope.SELECTED_LINE.MODE;
            voucher.PAYMENT_METHOD_ID = $scope.SELECTED_LINE.PAYMENT_METHOD_ID;
            voucher.CHECK_NO = $scope.SELECTED_LINE.CHECK_NO;
            voucher.NOTE = $scope.SELECTED_LINE.CANCEL_NOTES;
            voucher.IS_REDEEMED = false;
            voucher.IS_COMPLIMENTARY = false;
            voucher.IS_DELETED = 0;
            voucher.DEPOSIT_CANCELLATION_FEE = $scope.SELECTED_LINE.CANCEL_AMT;
            voucher.IS_CANCELLED = true;
            voucher.TOTAL_AMT = voucher.VALUE;
            VoucherList.push(voucher);
            var CashupModelObj = new Object();
            CashupModelObj.VIEW_CASHUP_HEADER_ID = null;
            CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            CashupModelObj.BRANCH_ID = $scope.DepositeSearch.BRANCH_ID;
            CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
            CashupModelObj.DEPOSIT_TOTAL = DEPOSIT_TOTAL;
            CashupModelObj.REDEEMED_TOTAL = DEPOSIT_REDEEMED_TOTAL;
            CashupModelObj.DECLARATION_DETAILS = VoucherList;
            CashupModelObj.STEP_NO = 9;
            PrcCommMethods.CASHUP_API(CashupModelObj, 'VIEW_INS_ENTRY_DEPOSIT_DECLARATION').then(function (data) {
                if (data.data != null && data.data != undefined && data.data!=0) {
                    $scope.SELECTED_LINE = "";
                    $('#CancelDepositForm').modal('hide');
                    $scope.GET_DEPOSITS(1);
                    $scope.CancelDepositForm.submitted = false;
                }
            });
        }
    };
    $scope.CHECK_CANCEL_AMOUNT = function (CANCEL_AMT) {
        if (parseFloat(CANCEL_AMT) > parseFloat($scope.SELECTED_LINE.VALUE)) {
            $scope.$parent.ShowAlert("Attention", "Cancellation amount should not be greater than the Deposit amount.", 3000);
            $scope.SELECTED_LINE.CANCEL_AMT = "";
        }

    }
    $scope.CANCEL_RESET = function () {
        $scope.CancelDepositForm.submitted = false;
        $scope.SELECTED_LINE.CANCEL_AMT = null;
        $scope.SELECTED_LINE.CANCEL_NOTES = null;
    }
    $scope.$parent.dateinputOpenDate();
    $scope.REDIRECTION_PAGE = function (Path) {
        $location.path(Path)
    };
});
app.controller('DepositsUploadController', function ($scope, $http, $interval, CommService, $cookies, $filter, PrcCommMethods, $location, readFileData, readFileDataNew, $sce) {
    $scope.$parent.dateinputOpenDate();
    $scope.DOWNLOAD_FILE_PATH = "/Uploads/Deposite_Template.xlsx";
    $scope.DepositeSearch = {
        VOUCHER_ID: null,
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        UploadedFiles: null,
        PAGE_NO_DTL: 1,
        PAGE_SIZE_NO_DTL: 500,
        UPL_FILE_FLAG: 1,
        ORIGINAL_FILE_NAME: '',
        SERVER_FILE_NAME: '',
        ENTITY_ID: null,
        BRANCH_ID: null
    };
    $scope.MENU_CLICK(6, 'CD');
    $scope.DEPOSIT_VALIDATE_LIST = [];
    $scope.DEPOSIT_TABLE = [{ ID: 1, COLUMN_NAME: 'INVOICE', IS_MANDATORY: true, HEADER_NAME: 'INVOICE', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, FIELD_MASTER_ID: -1 },
    { ID: 2, COLUMN_NAME: 'DEPOSIT_REFERENCE', IS_MANDATORY: true, HEADER_NAME: 'DEPOSIT_REFERENCE', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, FIELD_MASTER_ID: -1 },
    { ID: 3, COLUMN_NAME: 'AMOUNT', IS_MANDATORY: true, HEADER_NAME: 'AMOUNT', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, FIELD_MASTER_ID: -1 },//TIME DATATYPE
    { ID: 4, COLUMN_NAME: 'DATE', IS_MANDATORY: true, HEADER_NAME: 'DATE', FIELD_TYPE_ID: 9, VALUES_ENTITY: '', ACTIVE: true, FIELD_MASTER_ID: -1 },
    { ID: 5, COLUMN_NAME: 'PAYMENT_METHOD', IS_MANDATORY: true, HEADER_NAME: 'PAYMENT_METHOD', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, FIELD_MASTER_ID: -1 },
    { ID: 6, COLUMN_NAME: 'NAME_OF_PAYEE', IS_MANDATORY: false, HEADER_NAME: 'NAME_OF_PAYEE', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, FIELD_MASTER_ID: -1 },
    { ID: 7, COLUMN_NAME: 'NOTE', IS_MANDATORY: false, HEADER_NAME: 'NOTE', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, FIELD_MASTER_ID: -1 }];
    function reportrange(startDate, endDate) {
        $scope.DepositeSearch.START_DATE_FILTER = startDate.format($scope.$parent.Datelocaleformat.format);
        $scope.DepositeSearch.END_DATE_FILTER = endDate.format($scope.$parent.Datelocaleformat.format);
        $('#reportrange span').html(startDate.format($scope.$parent.Datelocaleformat.format) + ' - ' + endDate.format($scope.$parent.Datelocaleformat.format));

    };
    $scope.NG_PAGE_LOAD = function () {
        $(function () {
            startDate = moment().startOf('month');//moment().startOf('isoWeek');//moment().subtract(6, 'days');
            endDate = moment().endOf('month'); //moment().subtract(0, 'days');
            $scope.$parent.SetUpDateRangeMultiDatePicker('reportrange', startDate, endDate, reportrange);
            $scope.$parent.SetUpDateRangeMultiDatePicker('reportrangeCoverView', startDate, endDate, reportrangeCoverView);
            $('#reportrange span').html(startDate.format($scope.$parent.Datelocaleformat.format) + ' - ' + endDate.format($scope.$parent.Datelocaleformat.format));
        });
    }
    $scope.NG_PAGE_LOAD();
    $scope.RESETPAGESEARCH = function () {
        $scope.DepositeSearch.INVOICENUMBER = null;
        $scope.DepositeSearch.DEPOSIT_REFERENCE = null;
        $scope.DepositeSearch.PAYMENT_MODE_ID = null;
        $scope.DepositeSearch.PAYEE_NAME = null;
    };

    $scope.CheckDecimal = function (VISS) {
        if ($scope.DepositeSearch.VALUE == '.') {
            $scope.DepositeSearch.VALUE = '';
        }
    };

    
    var objBrach = new Object();
    objBrach.USER_ID = parseInt($cookies.get("USERID"));
    objBrach.MODULE_ID = 1;
    objBrach.PRIVILEGE_ID = $scope.$parent.CheckSubModuleAccess(123) ? 123 : 0;
    objBrach.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));

    PrcCommMethods.CASHUP_API(objBrach, "GET_BRANCH_LIST_BY_PRIVILEGE").then(function (data) {
        $scope.BRANCH_LIST = data.data.Table;
        if ($scope.BRANCH_LIST.length > 0) {
            $scope.DepositeSearch.BRANCH_ID = $scope.BRANCH_LIST[0].BRANCH_ID;
          //  $scope.DepositeSearch.BRANCH_ID_FILTER = $scope.BRANCH_LIST[0].BRANCH_ID;
            $scope.GET_DEPOSITS(1);
        }
    });
    $scope.ValidateDepositeIssue = function () {
        $scope.$parent.CASHUP.DEPOSITSVALID = true;
        angular.forEach($scope.VoucherIssuedList, function (x) {
            x.CODE_VALID = true;
            x.VALUE_VALID = true;
            x.PAYMENT_METHOD_ID_VALID = true;
            x.CHECK_NO_VALID = true;
            x.RED_CODE_VALID = true;
            x.RED_VALUE_VALID = true;
            x.RED_PAYMENT_METHOD_ID_VALID = true;
            x.RED_CHECK_NO_VALID = true;

            if (x.IS_REDEEMED == false && x.ENTRY_TYPE_ID == 3) {
                //if (x.ENTRY_TYPE_ID == 3) {
                if (((x.CODE != null && x.CODE != "") || (x.VALUE != null && x.VALUE != "") || (x.PAYMENT_METHOD_ID != null && x.PAYMENT_METHOD_ID != "") || (x.CHECK_NO != null && x.CHECK_NO != "") || (x.AUTHORIZED_BY != null && x.AUTHORIZED_BY != "")) && (x.IS_DELETED == 0)) {
                    if (x.CODE == null || x.CODE == undefined || x.CODE == "") {
                        x.CODE_VALID = false;
                    }
                    if (x.VALUE == null || x.VALUE == 0 || x.VALUE == "") {
                        x.VALUE_VALID = false;
                    }
                    if (x.PAYMENT_METHOD_ID == null || x.PAYMENT_METHOD_ID == 0 || x.PAYMENT_METHOD_ID == "") {
                        x.PAYMENT_METHOD_ID_VALID = false;
                    }
                    if (x.CHECK_NO == null || x.CHECK_NO == 0 || x.CHECK_NO == "") {
                        x.CHECK_NO_VALID = false;
                    }
                }
            } else if (x.IS_REDEEMED == true && x.ENTRY_TYPE_ID == 3) {
                if (((x.CODE != null && x.CODE != "") || (x.VALUE != null && x.VALUE != "") || (x.PAYMENT_METHOD_ID != null && x.PAYMENT_METHOD_ID != "") || (x.CHECK_NO != null && x.CHECK_NO != "") || (x.AUTHORIZED_BY != null && x.AUTHORIZED_BY != "")) && (x.IS_DELETED == 0)) {
                    if (x.CODE == null || x.CODE == undefined || x.CODE == "") {
                        x.RED_CODE_VALID = false;
                    }
                    if (x.VALUE == null || x.VALUE == 0 || x.VALUE == "") {
                        x.RED_VALUE_VALID = false;
                    }
                    if (x.PAYMENT_METHOD_ID == null || x.PAYMENT_METHOD_ID == 0 || x.PAYMENT_METHOD_ID == "") {
                        x.RED_PAYMENT_METHOD_ID_VALID = false;
                    }
                    if (x.CHECK_NO == null || x.CHECK_NO == 0 || x.CHECK_NO == "") {
                        x.RED_CHECK_NO_VALID = false;
                    }
                }
            }
            if (!x.CODE_VALID || !x.VALUE_VALID || !x.PAYMENT_METHOD_ID_VALID || !x.CHECK_NO_VALID || !x.RED_CODE_VALID || !x.RED_VALUE_VALID || !x.RED_PAYMENT_METHOD_ID_VALID || !x.RED_CHECK_NO_VALID) {
                $scope.$parent.CASHUP.DEPOSITSVALID = false;
            }
        });
        if ($scope.$parent.CASHUP.DEPOSITSVALID == false) {
            if ($scope.VoucherIssuedList.length > 0) {
                $scope.$parent.CASHUP.AUTOVALID_DEPOSITE = $scope.VoucherIssuedList;
            }
        }
    };

    $scope.UPLOAD_DEPOSITS = function () {
        
        var VoucherList = [];
        var voucher = new Object();
        $scope.ISVALID = false;
        if ($scope.DEPOSIT_VALIDATE_LIST.length > 0) {
            angular.forEach($scope.DEPOSIT_VALIDATE_LIST, function (item) {
                var voucher = new Object();
                //voucher.ID = $scope.DepositeSearch.VOUCHER_ID;                
                voucher.INVOICE = item.INVOICE;
                voucher.DEPOSIT_REFERENCE = item.DEPOSIT_REFERENCE;
                voucher.AMOUNT = parseFloat(item.AMOUNT).toFixed(5);
                voucher.DEPOSITE_DATE = item.DATE;
                voucher.PAYMENT_METHOD = item.PAYMENT_METHOD;
                voucher.NAME_OF_PAYEE     = item.NAME_OF_PAYEE;
                voucher.NOTE = item.NOTE;
                voucher.COVERS = 2;              
                VoucherList.push(voucher);
            });

            var CashupModelObj = new Object();
            //CashupModelObj.VIEW_CASHUP_HEADER_ID = null;
            CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            CashupModelObj.BRANCH_ID = $scope.DepositeSearch.BRANCH_ID;
            CashupModelObj.USER_ID = parseInt($cookies.get("USERID")); // '../Uploads/' + $scope.CoversSearch.UploadedFiles[0].FILE_PATH + $scope.CoversSearch.UploadedFiles[0].SERVER_FILE_NAME;
            CashupModelObj.SERVER_FILE_NAME = '../Uploads/' + $scope.DepositeSearch.UploadedFiles[0].FILE_PATH + $scope.DepositeSearch.UploadedFiles[0].SERVER_FILE_NAME;
            CashupModelObj.ORIGINAL_FILE_NAME = $scope.DepositeSearch.UploadedFiles[0].ORIGINAL_FILE_NAME;
            CashupModelObj.DEPOSITE_LINE_TYPE = VoucherList;// VoucherList.filter(p => p.CHECK_NO != null);
          
            PrcCommMethods.CASHUP_API(CashupModelObj, 'UPLOAD_DEPOSITS').then(function (data) {
                
                if (data.data != null && data.data != undefined ) {
                    $scope.$parent.ShowAlert('Success', 'Data uploaded successfully.', 3000);
                   

                    $scope.DEPOSIT_VALIDATE_LIST = [];
                    document.getElementById('uploadExcel1').value = null;
                    $scope.DEPOSIT_VALIDATE_LIST = [];
                    $scope.CODE_ARRY = [];
                    $scope.DepositeSearch.UploadedFiles = null;
                    $scope.INVALID_EXCLE_CELL_COUNT = 1;
                    $scope.COPY_CODE_ARRY = [];
                    $scope.CODE_ARRY = [];
                    $scope.submitted = false;
                    $scope.GET_DEPOSIT_LOG_HDR();
                }
                else {
                    $scope.$parent.ShowAlert('Attention', 'Sorry, unable to upload the data.', 3000);
                    $scope.submitted = false;
                }

            });
            $scope.UploadepositForm.submitted = false;
            $scope.submitted = false;
        }
        else {
            $scope.$parent.ShowAlert('Attention', 'Please upload deposit file.', 3000);
        }
    };

    $scope.CANCEL_ENTRY_DEPOSIT_DECLARATION = function (LINE) {
        $scope.CancelDepositForm.submitted = true;
        if ($scope.CancelDepositForm.$valid) {
            var VoucherList = [];
            var DEPOSIT_TOTAL = 0;
            var DEPOSIT_REDEEMED_TOTAL = 0;
            var voucher = new Object();
            voucher.ID = $scope.SELECTED_LINE.ID;
            voucher.ENTRY_TYPE_ID = 3// voucherissue.ENTRY_TYPE_ID;
            voucher.ENTRY_TYPE_DETAIL_ID = 0// voucherissue.ENTRY_TYPE_DETAIL_ID;
            voucher.VOUCHER_TYPE = null// voucherissue.VOUCHER_TYPE;
            voucher.CODE = $scope.SELECTED_LINE.CODE != null ? $scope.SELECTED_LINE.CODE : "";
            voucher.VALUE = parseFloat($scope.SELECTED_LINE.VALUE).toFixed(5);
            voucher.VALIDITY_DATE = $scope.SELECTED_LINE.VALIDITY_DATE;
            voucher.CUSTOMER_NAME = $scope.SELECTED_LINE.CUSTOMER_NAME;
            voucher.MODE = $scope.SELECTED_LINE.MODE;
            voucher.PAYMENT_METHOD_ID = $scope.SELECTED_LINE.PAYMENT_METHOD_ID;
            voucher.CHECK_NO = $scope.SELECTED_LINE.CHECK_NO;
            voucher.NOTE = $scope.SELECTED_LINE.CANCEL_NOTES;
            voucher.IS_REDEEMED = false;
            voucher.IS_COMPLIMENTARY = false;
            voucher.IS_DELETED = 0;
            voucher.DEPOSIT_CANCELLATION_FEE = $scope.SELECTED_LINE.CANCEL_AMT;
            voucher.IS_CANCELLED = true;
            VoucherList.push(voucher);
            var CashupModelObj = new Object();
            CashupModelObj.VIEW_CASHUP_HEADER_ID = null;
            CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            CashupModelObj.BRANCH_ID = $scope.DepositeSearch.BRANCH_ID;
            CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
            CashupModelObj.DEPOSIT_TOTAL = DEPOSIT_TOTAL;
            CashupModelObj.REDEEMED_TOTAL = DEPOSIT_REDEEMED_TOTAL;
            CashupModelObj.DECLARATION_DETAILS = VoucherList;
            CashupModelObj.STEP_NO = 9;
            PrcCommMethods.CASHUP_API(CashupModelObj, 'VIEW_INS_ENTRY_DEPOSIT_DECLARATION').then(function (data) {
                if (data.data == 1) {
                    $scope.SELECTED_LINE = "";
                    $('#CancelDepositForm').modal('hide');
                    $scope.GET_DEPOSITS(1);
                    $scope.CancelDepositForm.submitted = false;
                }
            });
        }
    };

    $scope.$on('ngRepeatFinishedRender', function (ngRepeatFinishedEvent) {
        $scope.CODE_ARRY = $scope.COPY_CODE_ARRY;
    });

    $scope.Refreshdata = function () {
        $scope.INVALID_EXCLE_CELL_COUNT = 1;
        $scope.COPY_CODE_ARRY = [];
        $scope.CODE_ARRY = [];
        $scope.submitted = false;
    };

    $scope.FILEUPLOADCLICK = function () {
        $scope.Refreshdata();
    };

    $scope.EXCEL_DEPOSIT_VALIDATE = function () {
        
        $scope.COPY_CODE_ARRY = [];
        $scope.CODE_ARRY = [];
        $scope.INVALID_EXCLE_CELL_COUNT = 1;
        if (document.getElementById('uploadExcel1').value != null && document.getElementById('uploadExcel1').value != '') {
            ModelObj = new Object();
            ModelObj.UPLOAD_TYPE_ID = 1;
            ModelObj.SERVER_FILE_NAME = $scope.DepositeSearch.UploadedFiles[0].SERVER_FILE_NAME;
            ModelObj.ORIGINAL_FILE_NAME = $scope.DepositeSearch.UploadedFiles[0].ORIGINAL_FILE_NAME;
            ModelObj.FILE_PATH = $scope.DepositeSearch.UploadedFiles[0].FILE_PATH + $scope.DepositeSearch.UploadedFiles[0].SERVER_FILE_NAME;
            ModelObj.DATETIME_FORMAT_CULTURE = ["MM/dd/yyyy hh:mm:ss tt", "M/d/yyyy hh:mm:ss tt", "MM/dd/yyyy", "M/d/yyyy"];
            ModelObj.LANGUAGE_SYMBOL = $scope.$parent.LANGUAGE_SYMBOL;
            ModelObj.EXCEL_DATATABLE = $scope.DEPOSIT_TABLE;
            PrcCommMethods.CASHUP_API(ModelObj, 'EXCEL_COVERS_VALIDATE').then(function (data) {
                $scope.DEPOSIT_VALIDATE_LIST = [];
                $scope.submitted = true;
                $scope.DEPOSIT_VALIDATE_LIST = data.data.HEADER_CLOUMN_NAMES;

                if (data.data.IS_VALID_COUNT > 0) {
                    $scope.INVALID_EXCLE_CELL_COUNT = parseInt(data.data.IS_VALID_COUNT);
                    $scope.INVALID_EXCLE_CELL_FLAG = true;
                    //$('#View_Report').modal('show');
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
            });
            $scope.submitted = false;
        }
        else {
            $scope.$parent.ShowAlert('Attention', 'Please Upload File', 3000);
            $scope.submitted = false;
        }
    };

    $scope.ngintvalidationvalue = function (key, value) {
        var List;
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
                    if (key == "DATE" || key == "CREATED_DATE") {
                        value = value.split(' ')[0];
                    }
                    List = { DISPLAY_TEXT: value, IS_VALID: false };
                }
            }
        }
        return List;
    };

    $scope.RESET_UPLOAD = function () {
        $scope.Refreshdata();
        document.getElementById('uploadExcel1').value = null;
        $scope.DEPOSIT_VALIDATE_LIST = [];
        $scope.CODE_ARRY = [];
        $scope.DepositeSearch.UploadedFiles == null;
        $scope.submitted = false;
    };
    //====================== View record=======================
    $scope.GET_DEPOSIT_LOG_HDR = function (FLAG) {
        if (FLAG == undefined) {
            $scope.DEPOSIT_LOG_HDR_DETAILS = [];
            $scope.DepositeSearch.PAGE_NO = 1;
        }
        ModelObj = new Object();
        ModelObj.USER_NAME = $scope.DepositeSearch.USER_NAME;
        ModelObj.ORIGINAL_FILE_NAME = $scope.DepositeSearch.ORIGINAL_FILE_NAME;
        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        ModelObj.BRANCH_ID = $scope.DepositeSearch.BRANCH_ID_FILTER;
        //ModelObj.START_DATE = $scope.DepositeSearch.START_DATE_FILTER;
        //ModelObj.END_DATE = $scope.DepositeSearch.END_DATE_FILTER;
        ModelObj.PAGE_NO = $scope.DepositeSearch.PAGE_NO;
        ModelObj.PAGE_SIZE = $scope.DepositeSearch.PAGE_SIZE;
        PrcCommMethods.CASHUP_API(ModelObj, 'GET_UPLOAD_DEPOSITES').then(function (data) {
            if (data.data.Table.length > 0) {
                if (FLAG == undefined) {
                    $scope.DEPOSIT_LOG_HDR_DETAILS = [];
                    $scope.DEPOSIT_LOG_HDR_DETAILS = data.data.Table;
                } else {
                    $scope.DEPOSIT_LOG_HDR_DETAILS = $scope.DEPOSIT_LOG_HDR_DETAILS.concat(data.data.Table);
                }
                if (data.data.Table.length < $scope.DepositeSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.DepositeSearch.PAGE_NO = parseInt($scope.DepositeSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else {
                $scope.GetData = false;
            }

        });
    };

    function reportrange(startDate, endDate) {
        $scope.DepositeSearch.START_DATE_FILTER = startDate.format($scope.$parent.Datelocaleformat.format);
        $scope.DepositeSearch.END_DATE_FILTER = endDate.format($scope.$parent.Datelocaleformat.format);
        $('#reportrange span').html(startDate.format($scope.$parent.Datelocaleformat.format) + ' - ' + endDate.format($scope.$parent.Datelocaleformat.format));

    };
    function reportrangeCoverView(startDate, endDate) {
        $scope.DepositeSearch.START_DATE_VIEW_FILTER = startDate.format($scope.$parent.Datelocaleformat.format);
        $scope.DepositeSearch.END_DATE_VIEW_FILTER = endDate.format($scope.$parent.Datelocaleformat.format);
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
    $scope.GET_DEPOSIT_LOG_HDR();

    $scope.LAZY_DEPOSIT_LOG_HDR_DETAILS = function () { $scope.GET_DEPOSIT_LOG_HDR(1); };
    $scope.RESET_FILTER = function () {
        $scope.DepositeSearch.USER_NAME = null;
        $scope.DepositeSearch.BRANCH_ID_FILTER = null;           
        $scope.DepositeSearch.ORIGINAL_FILE_NAME = null;
        $scope.DEPOSIT_LOG_HDR_DETAILS = [];
        //var objBrach = new Object();
        //objBrach.USER_ID = parseInt($cookies.get("USERID"));
        //objBrach.MODULE_ID = 1;
        //objBrach.PRIVILEGE_ID = $scope.$parent.CheckSubModuleAccess(123) ? 123 : 0;
        //objBrach.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));

        //PrcCommMethods.CASHUP_API(objBrach, "GET_BRANCH_LIST_BY_PRIVILEGE").then(function (data) {
        //    $scope.BRANCH_LIST = data.data.Table;
        //    if ($scope.BRANCH_LIST.length > 0) {
        //       // $scope.DepositeSearch.BRANCH_ID = $scope.BRANCH_LIST[0].BRANCH_ID;
        //        $scope.DepositeSearch.BRANCH_ID_FILTER = $scope.BRANCH_LIST[0].BRANCH_ID;
        //        $scope.GET_DEPOSITS(1);
        //    }
        //});
            $scope.GET_DEPOSIT_LOG_HDR();
          
    }
    $scope.LAZY_DEPOSIT_LOG_DETAILS = function (COVER) {
        
        $scope.GET_DEPOSIT_LOG_DTL(COVER, 1)
    }

    $scope.GET_DEPOSIT_LOG_DTL = function (COVER, FLAG) {
        
        if (FLAG == undefined) {
            $scope.DEPOSIT_LOG_DETAILS = [];
            $scope.DepositeSearch.PAGE_NO_DTL = 1;
        }
        $scope.COVERS_LINE = COVER;
        $scope.UPLOADED_FILE_NAME = COVER.ORIGINAL_FILE_NAME;
        if (COVER.DEPOSIT_LOG_DETAILS == undefined || COVER.DEPOSIT_LOG_DETAILS.length == 0 || FLAG == 1) {
            ModelObj = new Object();
            ModelObj.DEPOSIT_LOG_HDR_ID = COVER.UPLOAD_DEPOSITE_ID;
            ModelObj.PAGE_NO = $scope.DepositeSearch.PAGE_NO_DTL;
            ModelObj.PAGE_SIZE = $scope.DepositeSearch.PAGE_SIZE_NO_DTL;
            PrcCommMethods.CASHUP_API(ModelObj, 'GET_UPLOAD_DEPOSITE_LINE_LOG').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.DEPOSIT_LOG_DETAILS = $scope.DEPOSIT_LOG_DETAILS.concat(data.data.Table);
                    if (data.data.Table.length < $scope.DepositeSearch.PAGE_SIZE_NO_DTL) {
                        $scope.GetDataDTL = false;
                    }
                    else {
                        $scope.DepositeSearch.PAGE_NO_DTL = parseInt($scope.DepositeSearch.PAGE_NO_DTL) + 1;
                        $scope.GetDataDTL = true;
                    }
                }
                else {
                    $scope.GetDataDTL = false;
                }
                COVER.DEPOSIT_LOG_DETAILS = $scope.DEPOSIT_LOG_DETAILS;
            });
        }
        else {
            $scope.DEPOSIT_LOG_DETAILS = [];
            $scope.DEPOSIT_LOG_DETAILS = COVER.DEPOSIT_LOG_DETAILS;
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
    $scope.REDIRECTION_PAGE = function (Path) {
        $location.path(Path)
    };
});