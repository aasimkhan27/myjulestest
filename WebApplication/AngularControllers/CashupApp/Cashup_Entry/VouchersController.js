app.controller('VouchersController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    if ($scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID == null || $scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID == undefined || $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_ID == null || $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_ID == undefined) {
        $location.path('CashUpApp_Entry');
        return;
    }
    $scope.$parent.TAB_ID = 7;
    $scope.TAB_ID = 7;
    $scope.$parent.REDIRECT_REGISTER_ENTRY = false;
    $scope.CASHUP_HEADER_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_ID;
    $scope.OPEN_VOUCHER_DETAILS_CHECKED_ALL = false;
    $scope.OPEN_VOUCHER_DETAILS_SEARCH = {};
    $scope.OPEN_VOUCHER_DETAILS_SEARCH.CUSTOMER_NAME = '';
    $scope.OPEN_VOUCHER_DETAILS_SEARCH.INVOICE_NUMBER = '';
    $scope.OPEN_VOUCHER_DETAILS_SEARCH.VOUCHER_REFERENCE = '';
    $scope.OPEN_VOUCHER_DETAILS_SEARCH.VOUCHER_TYPE = null;
    $scope.OPEN_VOUCHER_DETAILS_SEARCH.PAYMENT_MODE_ID = 0;
    $scope.OPEN_VOUCHER_DETAILS_SEARCH.PAYMENT_MODE_NAME = null;
    $scope.OPEN_VOUCHER_DETAILS_SEARCH.PAGE_NO = 1;
    $scope.OPEN_VOUCHER_DETAILS_SEARCH.PAGE_SIZE = 10;
    $scope.VOUCHERS_ENTRY_LIST = [];
    $scope.GetData = true;
    $scope.MODE_OF_PAYMENT_LIST = [];
    $scope.VOUCHER_ISSUED_TOTAL = 0;
    $scope.VOUCHER_REDEEMED_TOTAL = 0;
    $scope.CASHUP_INFO = {};
    $scope.CASHUP_INFO.EPOS = 0;
    $scope.CASHUP_INFO.ACTUAL = 0;
    $scope.VOUCHER_REDEEMED_CASHUP_INFO = {};
    $scope.VOUCHER_REDEEMED_CASHUP_INFO.EPOS = 0;
    $scope.VOUCHER_REDEEMED_CASHUP_INFO.ACTUAL = 0;
    $scope.CASHUP_ENTRY_NOTE = "";
    $scope.VOUCHERS_TAB_NOTE_LIST = [];
    $scope.GET_CASHUP_HEADER_NOTES = function () {
        var CashupModelObj = new Object();
        CashupModelObj.NOTE_TYPE_ID = 10;
        CashupModelObj.CASHUP_HEADER_ID = $scope.CASHUP_HEADER_ID;
        PrcCommMethods.CASHUP_APP_API(CashupModelObj, 'GET_CASHUP_HEADER_NOTES').then(function (data) {
            if (data.data.Table != null && data.data.Table.length > 0) {
                $scope.VOUCHERS_TAB_NOTE_LIST = data.data.Table.map(function (item) {
                    item.isEditable = false;
                    return item;
                });
            }
        });
    };
    $scope.GET_CASHUP_HEADER_NOTES();
    $scope.GET_MODE_OF_PAYMENTS = function () {
        var ModelObj = new Object();
        ModelObj.BRANCH_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID;
        PrcCommMethods.CASHUP_APP_API(ModelObj, 'GET_MODE_OF_PAYMENTS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.MODE_OF_PAYMENT_LIST = data.data.Table;
            }
            else {
                $scope.MODE_OF_PAYMENT_LIST = 0;
            }
            $scope.GET_ENTRY_TYPE_DECLARATION();
        });
    };
    $scope.GET_MODE_OF_PAYMENTS();

    $scope.GET_ENTRY_TYPE_DECLARATION = function () {
        var CashupAppModelObj = new Object();
        CashupAppModelObj.CASHUP_HEADER_ID = $scope.CASHUP_HEADER_ID;
        PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'GET_ENTRY_TYPE_DECLARATION').then(function (data) {
            if (data.data.Table.filter(row => row.ENTRY_TYPE_ID == 1).length > 0) {
                $scope.VOUCHERS_ENTRY_LIST = data.data.Table.filter(row=>row.ENTRY_TYPE_ID == 1);//.filter(row => row.ENTRY_TYPE_DETAIL_ID == null || row.ENTRY_TYPE_DETAIL_ID == undefined);
                //$scope.VOUCHERS_REDEEMED_LIST = data.data.Table.filter(row => row.ENTRY_TYPE_DETAIL_ID != null && row.ENTRY_TYPE_DETAIL_ID != undefined);
            }
            else {
                $scope.VOUCHERS_ENTRY_LIST = [];
                //$scope.ADD_ROW(1);
            }
            if ($scope.ADD_NEW_ROW_FLAG == true) {
                $scope.ADD_NEW_ROW_FLAG = false;
                $scope.ADD_ROW(1);
            }
            if ($scope.ADD_NEW_ROW_FLAG_DIRECT_ENTRY == true) {
                $scope.ADD_NEW_ROW_FLAG_DIRECT_ENTRY = false;
                $scope.ADD_ROW(3);
            }
        });

    };
    //$scope.GET_ENTRY_TYPE_DECLARATION();
    $scope.GET_OPEN_VOUCHER_DETAILS = function (flag) {
        if (flag == null || flag == undefined) {
            $scope.OPEN_VOUCHER_DETAILS_SEARCH.PAGE_NO = 1;
            $scope.GetData = true;
        }
        var CashupAppModelObj = new Object();

        CashupAppModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CashupAppModelObj.BRANCH_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID;
        CashupAppModelObj.CUSTOMER_NAME = $scope.OPEN_VOUCHER_DETAILS_SEARCH.CUSTOMER_NAME;
        CashupAppModelObj.INVOICE_NUMBER = $scope.OPEN_VOUCHER_DETAILS_SEARCH.INVOICE_NUMBER;
        CashupAppModelObj.VOUCHER_REFERENCE = $scope.OPEN_VOUCHER_DETAILS_SEARCH.VOUCHER_REFERENCE;
        CashupAppModelObj.VOUCHER_TYPE = $scope.OPEN_VOUCHER_DETAILS_SEARCH.VOUCHER_TYPE;
        CashupAppModelObj.PAYMENT_MODE_ID = $scope.OPEN_VOUCHER_DETAILS_SEARCH.PAYMENT_MODE_ID;
        CashupAppModelObj.PAGE_NO = $scope.OPEN_VOUCHER_DETAILS_SEARCH.PAGE_NO;
        CashupAppModelObj.PAGE_SIZE = $scope.OPEN_VOUCHER_DETAILS_SEARCH.PAGE_SIZE;
        CashupAppModelObj.SHOW_REDEEMED = 0;
        
        PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'GET_OPEN_VOUCHER_DETAILS').then(function (data) {
            if (data.data.Table.length > 0) {

                if (flag == null || flag == undefined) {
                    $scope.OPEN_VOUCHER_DETAILS = data.data.Table;
                }
                else if (flag == 1) {
                    $scope.OPEN_VOUCHER_DETAILS = $scope.OPEN_VOUCHER_DETAILS.concat(data.data.Table);
                }
                if (data.data.Table.length < $scope.OPEN_VOUCHER_DETAILS_SEARCH.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.OPEN_VOUCHER_DETAILS_SEARCH.PAGE_NO = parseInt($scope.OPEN_VOUCHER_DETAILS_SEARCH.PAGE_NO) + 1;
                    $scope.GetData = true;
                }

                var filtered_voucher_entry_list = $scope.VOUCHERS_ENTRY_LIST.filter(x => x.ID == 0 && (x.ENTRY_TYPE_DETAIL_ID != null) && (x.ENTRY_TYPE_DETAIL_ID != undefined));
                angular.forEach(filtered_voucher_entry_list, function (_filtered_row) {
                    let open_voucher_object = $scope.OPEN_VOUCHER_DETAILS.filter(x => x.ID == _filtered_row.ENTRY_TYPE_DETAIL_ID);
                    if (open_voucher_object.length > 0) {
                        let index = $scope.OPEN_VOUCHER_DETAILS.indexOf(open_voucher_object[0]);
                        if (index !== -1) {
                            $scope.OPEN_VOUCHER_DETAILS.splice(index, 1);
                        }
                    }
                });
                
            }
            else if ($scope.OPEN_VOUCHER_DETAILS_SEARCH.PAGE_NO > 1 && data.data.Table.length == 0) {
                $scope.GetData = false;
            }
            else if ($scope.OPEN_VOUCHER_DETAILS_SEARCH.PAGE_NO == 1 && data.data.Table.length == 0) {
                $scope.OPEN_VOUCHER_DETAILS = [];
                $scope.GetData = false;
            }
            //else {
            //    $scope.OPEN_VOUCHER_DETAILS = [];
            //}
        });
    };

    $scope.UPLOAD_VOUCHER_CHECK = function (_row) {
        if (_row.VOUCHER_TYPE =='Open Voucher' || (_row.ID==0 && _row.ENTRY_TYPE_DETAIL_ID==0)) {
            var CashupAppModelObj = new Object();
            $scope.VOUCHER_CHECKING_FLAG = true;
            CashupAppModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            CashupAppModelObj.BRANCH_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID;
            CashupAppModelObj.VOUCHER_REFERENCE = _row.VOUCHER_NUMBER;
            PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'UPLOAD_VOUCHER_CHECK').then(function (data) {
                $scope.VOUCHER_CHECKING_FLAG = false;
                if (data.data.Table[0].SUCCESS_STATUS == true) {
                    $scope.$parent.ShowAlertBox('Error', 'The Voucher Number Already Exists For This Branch!', 3000)
                    _row.VOUCHER_NUMBER = null;
                }
            });
        }
    }

    $scope.ADD_ROW = function (flag, CHECKED_OPEN_VOUCHER_DETAILS) {
        if (flag == 1) {
            var ROW = new Object();

            ROW.ID = 0;
            ROW.ENTRY_TYPE_ID = 1;
            ROW.ENTRY_TYPE_DETAIL_ID = null;
            ROW.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            ROW.BRANCH_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID;
            ROW.CASHUP_HEADER_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_ID;
            ROW.VOUCHER_TYPE = null;
            ROW.TABLE_NUMBER = null;
            ROW.NO_OF_COVERS = null;
            ROW.VOUCHER_NUMBER = null;
            ROW.DEPOSIT_REFERENCE = null;
            ROW.VOID_TYPE = null;
            ROW.AMOUNT = null;
            ROW.VALIDITY_DATE = null;
            ROW.REASON_OF_COMP = null;
            ROW.SOLD_TO = null;
            ROW.NAME_OF_PAYEE = null;
            ROW.TIME = null;
            ROW.DEPOSITE_PAYMENT_METHOD = null;
            ROW.VOUCHER_PAYMENT_METHOD = null;
            ROW.VOUCHER_INVOICE_NUMBER = null;
            ROW.DEPOSITE_INVOICE_NUMBER = null;
            ROW.COMP_CHECK_NO = null;
            ROW.VOID_CHECK_NO = null;
            ROW.NOTE = null;
            ROW.IS_REDEEMED = 0;
            ROW.AUTHORIZED_BY = null;
            ROW.ACTIVE = 1;
            ROW.CREATED_BY = null;
            ROW.CREATED_DATE = null;
            ROW.MODIFIED_BY = null;
            ROW.MODIFIED_DATE = null;
            ROW.DISCOUNT = null;
            ROW.FOOD = null;
            ROW.DRINKS = null;
            ROW.LIGHT_SPEED_ACCOUNTFISCID = null;
            ROW.IS_DELETED = 0;
            ROW.PAYMENT_METHOD_ID = null;
            ROW.RESTRICT_DELETE = 0;
            ROW.IS_CANCELLED = 0;
            ROW.DEPOSIT_CANCELLATION_FEE = null;
            ROW.TOTAL_AMT = null;
            ROW.UPLOAD_IDS = null;
            ROW.FILE_NAME = null;
            ROW.IS_DELETED = 0;
            ROW.REMAINING_VALUE = null;
            ROW.REDEEMED_BY = null;
            ROW.IS_EXTERNAL_RECORD = 0;
            $scope.VOUCHERS_ENTRY_LIST.push(ROW);
        }
        if (flag == 2) {
            if (CHECKED_OPEN_VOUCHER_DETAILS != null && CHECKED_OPEN_VOUCHER_DETAILS != undefined) {
                angular.forEach(CHECKED_OPEN_VOUCHER_DETAILS, function (_row) {
                    var ROW = new Object();
                    ROW.ID = 0;
                    ROW.ENTRY_TYPE_ID = _row.ENTRY_TYPE_ID;
                    ROW.ENTRY_TYPE_DETAIL_ID = _row.ID;
                    ROW.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
                    ROW.BRANCH_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID;
                    ROW.CASHUP_HEADER_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_ID;
                    ROW.VOUCHER_TYPE = _row.VOUCHER_TYPE;
                    ROW.TABLE_NUMBER = null;
                    ROW.NO_OF_COVERS = null;
                    ROW.VOUCHER_NUMBER = _row.VOUCHER;
                    ROW.DEPOSIT_REFERENCE = null;
                    ROW.VOID_TYPE = null;
                    ROW.AMOUNT = _row.REMAINING_VALUE;
                    ROW.VALIDITY_DATE = _row.VALIDITY_DATE;
                    ROW.REASON_OF_COMP = null;
                    ROW.SOLD_TO = _row.SOLD_TO;
                    ROW.NAME_OF_PAYEE = null;
                    ROW.TIME = null;
                    ROW.DEPOSITE_PAYMENT_METHOD = null;
                    ROW.VOUCHER_PAYMENT_METHOD = _row.PAYMENT_METHOD;
                    ROW.VOUCHER_INVOICE_NUMBER = _row.INVOICE;
                    ROW.DEPOSITE_INVOICE_NUMBER = null;
                    ROW.COMP_CHECK_NO = null;
                    ROW.VOID_CHECK_NO = null;
                    ROW.NOTE = _row.NOTE;
                    ROW.IS_REDEEMED = _row.IS_REDEEMED;
                    ROW.AUTHORIZED_BY = null;
                    ROW.ACTIVE = _row.ACTIVE;
                    ROW.CREATED_BY = _row.CREATED_BY;
                    ROW.CREATED_DATE = _row.CREATED_DATE;
                    ROW.MODIFIED_BY = _row.MODIFIED_BY;
                    ROW.MODIFIED_DATE = _row.MODIFIED_DATE;
                    ROW.DISCOUNT = null;
                    ROW.FOOD = null;
                    ROW.DRINKS = null;
                    ROW.LIGHT_SPEED_ACCOUNTFISCID = null;
                    ROW.IS_DELETED = 0;
                    ROW.PAYMENT_METHOD_ID = _row.PAYMENT_METHOD_ID;
                    ROW.RESTRICT_DELETE = _row.RESTRICT_DELETE;
                    ROW.IS_CANCELLED = 0;
                    ROW.DEPOSIT_CANCELLATION_FEE = null;
                    ROW.TOTAL_AMT = _row.AMOUNT;
                    ROW.UPLOAD_IDS = null;
                    ROW.FILE_NAME = null;
                    ROW.REMAINING_VALUE = _row.REMAINING_VALUE;
                    ROW.REDEEMED_BY = null;
                    ROW.IS_EXTERNAL_RECORD = _row.IS_EXTERNAL_RECORD;
                    $scope.VOUCHERS_ENTRY_LIST.push(ROW);
                });
            }
        }
        if (flag == 3) {
            var ROW = new Object();
            ROW.ID = 0;
            ROW.ENTRY_TYPE_ID = 1;
            ROW.ENTRY_TYPE_DETAIL_ID = 0;
            ROW.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            ROW.BRANCH_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID;
            ROW.CASHUP_HEADER_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_ID;
            ROW.VOUCHER_TYPE = 'Pre-Defined';
            ROW.TABLE_NUMBER = null;
            ROW.NO_OF_COVERS = null;
            ROW.VOUCHER_NUMBER = null;
            ROW.DEPOSIT_REFERENCE = null;
            ROW.VOID_TYPE = null;   
            ROW.AMOUNT = null;
            ROW.VALIDITY_DATE = null;
            ROW.REASON_OF_COMP = null;
            ROW.SOLD_TO = null;
            ROW.NAME_OF_PAYEE = null;
            ROW.TIME = null;
            ROW.DEPOSITE_PAYMENT_METHOD = null;
            ROW.VOUCHER_PAYMENT_METHOD = null;
            ROW.VOUCHER_INVOICE_NUMBER = null;
            ROW.DEPOSITE_INVOICE_NUMBER = null;
            ROW.COMP_CHECK_NO = null;
            ROW.VOID_CHECK_NO = null;
            ROW.NOTE = null;
            ROW.IS_REDEEMED = 1;
            ROW.AUTHORIZED_BY = null;
            ROW.ACTIVE = 1;
            ROW.CREATED_BY = null;
            ROW.CREATED_DATE = null;
            ROW.MODIFIED_BY = null;
            ROW.MODIFIED_DATE = null;
            ROW.DISCOUNT = null;
            ROW.FOOD = null;
            ROW.DRINKS = null;
            ROW.LIGHT_SPEED_ACCOUNTFISCID = null;
            ROW.IS_DELETED = 0;
            ROW.PAYMENT_METHOD_ID = null;
            ROW.RESTRICT_DELETE = 0;
            ROW.IS_CANCELLED = 0;
            ROW.DEPOSIT_CANCELLATION_FEE = null;
            ROW.TOTAL_AMT = 0;
            ROW.UPLOAD_IDS = null;
            ROW.FILE_NAME = null;
            ROW.IS_DELETED = 0;
            ROW.REMAINING_VALUE = null;
            ROW.REDEEMED_BY = null;
            ROW.IS_EXTERNAL_RECORD = 0;
            $scope.VOUCHERS_ENTRY_LIST.push(ROW);
        }

    };
    $scope.ADD_NEW_ROW_ENTRY = function () {
        if ($scope.VOUCHERS_ENTRY_LIST.length == 0) {
            $scope.ADD_ROW(1);
        }
        else {
            $scope.ADD_NEW_ROW_FLAG = true;
            $scope.INS_ENTRY_VOUCHER_DECLARATION(0);
        }
    };

    $scope.ADD_NEW_ROW_ENTRY_DIRECT_REDEEM = function () {
        if ($scope.VOUCHERS_ENTRY_LIST.length == 0) {
            $scope.ADD_ROW(3);
        }
        else {
            $scope.ADD_NEW_ROW_FLAG_DIRECT_ENTRY = true;
            $scope.INS_ENTRY_VOUCHER_DECLARATION(0);
        }
    };
    
    $scope.nginit_voucher_issued = function (_row) {
        _row.SELECTED_VOUCHER_TYPE = _row.VOUCHER_TYPE;
        if (_row.VOUCHER_TYPE == 'Pre-defined') {
            _row.ShowInput = false;
        }
        else if (_row.VOUCHER_TYPE == 'Open Voucher') {
            _row.ShowInput = true;
        }
        else {
            _row.ShowInput = false;
        }
        //_row.VALIDITY_DATE = $filter('date')(_row.VALIDITY_DATE, 'yyyy-MM-dd');
        if (_row.VALIDITY_DATE != null) {
            _row.VALIDITY_DATE = moment(_row.VALIDITY_DATE, $scope.$parent.DB_DATE_FORMAT).format($scope.$parent.CONVERSION_DATE_FORMAT);
        }
        
        _row.SELECTED_MODE_OF_PAYMENT_NAME = _row.VOUCHER_PAYMENT_METHOD;
        if (_row.IS_DELETED == 0 || _row.IS_DELETED == false) {
            if (_row.ENTRY_TYPE_DETAIL_ID == null || _row.ENTRY_TYPE_DETAIL_ID == undefined) {
                if (!isNaN(parseFloat(_row.AMOUNT))) {
                    $scope.VOUCHER_ISSUED_TOTAL += parseFloat(_row.AMOUNT);
                }
            }
            if (_row.ENTRY_TYPE_DETAIL_ID != null && _row.ENTRY_TYPE_DETAIL_ID != undefined) {
                if (!isNaN(parseFloat(_row.AMOUNT))) {
                    $scope.VOUCHER_REDEEMED_TOTAL += parseFloat(_row.AMOUNT);
                }
                
            }
        }
    };
    $scope.nginit_voucher_redeemed = function (_row) {
        //_row.VALIDITY_DATE = $filter('date')(_row.VALIDITY_DATE, 'yyyy-MM-dd');
        if (_row.VALIDITY_DATE != null) {
            _row.VALIDITY_DATE = moment(_row.VALIDITY_DATE, $scope.$parent.DB_DATE_FORMAT).format($scope.$parent.CONVERSION_DATE_FORMAT);
        }
        _row.SELECTED_MODE_OF_PAYMENT_NAME = _row.VOUCHER_PAYMENT_METHOD;
        if (_row.IS_DELETED == 0 || _row.IS_DELETED == false) {
            if (!isNaN(parseFloat(_row.AMOUNT))) {
                $scope.VOUCHER_REDEEMED_TOTAL += parseFloat(_row.AMOUNT);
            }
        }
    };
    
    $scope.nginit_open_voucher = function (_row) {
        _row.CHECKED = false;
    }
    $scope.SELECT_VOUCHER_TYPE = function (_row, _type) {
        _row.SELECTED_VOUCHER_TYPE = _type;
        _row.VOUCHER_TYPE = _type;
        if (_type == 'Pre-defined') {
            _row.ShowInput = false;
        }
        else if (_type == 'Open Voucher') {
            _row.ShowInput = true;
        }
    };
    $scope.SELECT_OPEN_VOUCHER_TYPE_SEARCH = function (_type) {
        if (_type == 'Pre-defined') {
            $scope.OPEN_VOUCHER_DETAILS_SEARCH.VOUCHER_TYPE = 'Pre-defined';
        }
        else if (_type == 'Open Voucher') {
            $scope.OPEN_VOUCHER_DETAILS_SEARCH.VOUCHER_TYPE = 'Open Voucher';
        }
        $scope.GET_OPEN_VOUCHER_DETAILS();
    };
    $scope.RESET_OPEN_VOUCHER = function () {
        $scope.OPEN_VOUCHER_DETAILS = [];
    };
    $scope.SELECT_MODE_OF_PAYMENT = function (_row, _mode_of_payment) {
        _row.PAYMENT_METHOD_ID = _mode_of_payment.MODE_OF_PAYMENT_ID;
        _row.SELECTED_MODE_OF_PAYMENT_NAME = _mode_of_payment.METHOD_NAME;
        _row.VOUCHER_PAYMENT_METHOD = _mode_of_payment.METHOD_NAME;
    };
    $scope.SELECT_MODE_OF_PAYMENT_OPEN_VOUCHER_SEARCH = function (_mode_of_payment) {
        $scope.OPEN_VOUCHER_DETAILS_SEARCH.PAYMENT_MODE_ID = _mode_of_payment.MODE_OF_PAYMENT_ID;
        $scope.OPEN_VOUCHER_DETAILS_SEARCH.PAYMENT_MODE_NAME = _mode_of_payment.METHOD_NAME;
        $scope.GET_OPEN_VOUCHER_DETAILS();
    };
    $scope.RESET_MODE_OF_PAYMENT_OPEN_VOUCHER_SEARCH = function () {
        $scope.OPEN_VOUCHER_DETAILS_SEARCH.PAYMENT_MODE_ID = 0;
        $scope.OPEN_VOUCHER_DETAILS_SEARCH.PAYMENT_MODE_NAME = '';
        $scope.GET_OPEN_VOUCHER_DETAILS();
    }
    $scope.CHECK_ALL_OPEN_VOUCHER_DETAILS = function () {
        if ($scope.OPEN_VOUCHER_DETAILS_CHECKED_ALL == false) {
            angular.forEach($scope.OPEN_VOUCHER_DETAILS, function (ov) {
                ov.CHECKED = true;
            });
        }
        else {
            angular.forEach($scope.OPEN_VOUCHER_DETAILS_CHECKED_ALL, function (ov) {
                ov.CHECKED = false;
            });
        }
    }
    $scope.RESET_SEARCH = function () {

        $scope.OPEN_VOUCHER_DETAILS_SEARCH.VOUCHER_TYPE = null;
        $scope.OPEN_VOUCHER_DETAILS_SEARCH.PAYMENT_MODE_ID = 0;
        $scope.OPEN_VOUCHER_DETAILS_SEARCH.PAYMENT_MODE_NAME = null;
        $scope.OPEN_VOUCHER_DETAILS_SEARCH.CUSTOMER_NAME = '';
        $scope.OPEN_VOUCHER_DETAILS_SEARCH.INVOICE_NUMBER = '';
        $scope.OPEN_VOUCHER_DETAILS_SEARCH.VOUCHER_REFERENCE = '';
        $scope.OPEN_VOUCHER_DETAILS_CHECKED_ALL = false;
    }
    $scope.SELECT_OPEN_VOUCHERS_TO_REDEEM = function () {
        $scope.ADD_ROW(2, $scope.OPEN_VOUCHER_DETAILS.filter(ov => ov.CHECKED == true));
        $scope.RESET_SEARCH();
    }
    $scope.CALCULATE_TOTAL = function (_row) {
        if (_row != null && _row != undefined) {
            if (parseFloat(_row.AMOUNT) > parseFloat(_row.REMAINING_VALUE)) {
                $scope.$parent.ShowAlertBox('Error', "Redeemed Amount can't be larger than Remaining Amount");
                _row.AMOUNT = _row.REMAINING_VALUE;
            }
        }

        var issuedTotal = 0;
        var redeemedTotal = 0;
        angular.forEach($scope.VOUCHERS_ENTRY_LIST, function (_row) {
            if (_row.IS_DELETED == 0 || _row.IS_DELETED == false) {
                if (_row.ENTRY_TYPE_DETAIL_ID == null || _row.ENTRY_TYPE_DETAIL_ID == undefined) {
                    if (!isNaN(parseFloat(_row.AMOUNT))) {
                        issuedTotal += parseFloat(_row.AMOUNT);
                    }
                }
                if (_row.ENTRY_TYPE_DETAIL_ID != null && _row.ENTRY_TYPE_DETAIL_ID != undefined) {
                    if (!isNaN(parseFloat(_row.AMOUNT))) {
                        redeemedTotal += parseFloat(_row.AMOUNT);
                    }
                }
            }
        });
        $scope.VOUCHER_ISSUED_TOTAL = issuedTotal;
        $scope.VOUCHER_REDEEMED_TOTAL = redeemedTotal;
    }
    $scope.DELETE_ROW = function (_row) {
        if (confirm('Are you sure you want to proceed?')) {
            if (_row.ID == 0) {
                let index = $scope.VOUCHERS_ENTRY_LIST.indexOf(_row);
                if (index !== -1) {
                    $scope.VOUCHERS_ENTRY_LIST.splice(index, 1);
                    $scope.CALCULATE_TOTAL();
                }
            }
            else {
                _row.IS_DELETED = 1;
                $scope.INS_ENTRY_VOUCHER_DECLARATION(0);
            }

        }
    }
    
    $scope.dateinputddmmyy = function (index) {
        $(document).ready(function () {
            var date_inputs = document.getElementsByClassName("dateinputddmmyy") //our date input has the name "date"
            if (date_inputs.length > 0) {
                for (var i = 0; i < date_inputs.length; i++) {
                    var date_input = $('input[name="' + date_inputs[i].name + '"]'); //our date input has the name "date"
                    var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
                    // var date = new Date();
                    var options = {
                        todayBtn: "linked",
                        daysOfWeekHighlighted: "0,6",
                        autoclose: true,
                        todayHighlight: false,
                        format: $scope.$parent.CALENDAR_DATE_FORMAT,
                        //format: 'yyyy-mm-dd',
                        clearBtn: true,
                        closeBtn: true,// close button visible
                        //  startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate())
                    };
                    date_input.datepicker(options).on("hide", function (e) {

                    })
                }
            }
        });
    }
    $scope.dateinputddmmyy(1);
    $scope.RESET_ON_MODAL_CLOSE = function () {
        $scope.VOUCHER_ISSUED_TOTAL = 0;
        $scope.VOUCHER_REDEEMED_TOTAL = 0;
        $scope.GET_ENTRY_TYPE_DECLARATION();
    }
    $scope.PREVIOUS = function () {
        if ($scope.$parent.CASHUP_ENTRY_SEARCH.IS_DATA_ENTRY_ENABLED == true) {
            $scope.INS_ENTRY_VOUCHER_DECLARATION(0, 1)
        }
        else {
            $scope.Fn_Cashup_entry_TAB_CLICK($scope.TAB_ID, 0);
        }
    }

    $scope.CONTINUE = function () {
        if ($scope.$parent.CASHUP_ENTRY_SEARCH.IS_DATA_ENTRY_ENABLED == true) {
            $scope.VouchersEntryForm.submitted = true;
            if ($scope.VouchersEntryForm.$valid) {
                if (!isNaN((parseFloat($scope.CASHUP_INFO.ACTUAL) - parseFloat($scope.CASHUP_INFO.EPOS)) + (parseFloat($scope.VOUCHER_REDEEMED_TOTAL) - parseFloat($scope.VOUCHER_REDEEMED_CASHUP_INFO.EPOS)))) {
                    if ((parseFloat($scope.CASHUP_INFO.ACTUAL) - parseFloat($scope.CASHUP_INFO.EPOS)) + (parseFloat($scope.VOUCHER_REDEEMED_TOTAL) - parseFloat($scope.VOUCHER_REDEEMED_CASHUP_INFO.EPOS)) != 0) {
                        var myModal = new bootstrap.Modal(document.getElementById('proceed'), {
                            keyboard: false  // Optional: Close modal when pressing ESC
                        });
                        // Show the modal
                        myModal.show();
                    }
                    else {
                        $scope.INS_ENTRY_VOUCHER_DECLARATION(1);
                    }
                }
                else {
                    $scope.INS_ENTRY_VOUCHER_DECLARATION(1);
                }
            }
        }
        else {
            $scope.Fn_Cashup_entry_TAB_CLICK($scope.TAB_ID, 1);
        }
    }


    $scope.NOTE_INIT = function (LINE) {
        LINE.DELETE_NOTE = 0;
    }
    $scope.DELETE_COMMENT = function (COMMENT) {
        COMMENT.isEditable = true;
        COMMENT.DELETE_NOTE = 1;
        $scope.INS_UPD_CASHUP_HEADER_NOTES(COMMENT);
    }
    $scope.EDIT_COMMENT = function (COMMENT) {
        COMMENT.isEditable = true;
    }
    $scope.INS_UPD_CASHUP_HEADER_NOTES = function (COMMENT) {
        if (COMMENT == null || COMMENT == undefined || COMMENT.isEditable == true || COMMENT.isEditable == 1) {
            if (($scope.CASHUP_ENTRY_NOTE != null && $scope.CASHUP_ENTRY_NOTE != undefined && $scope.CASHUP_ENTRY_NOTE != "") || (COMMENT != null && COMMENT != undefined && COMMENT != "")) {
                var CashupModelObj = new Object();
                CashupModelObj.NOTE_TYPE_ID = 10;
                CashupModelObj.CASHUP_HEADER_ID = $scope.CASHUP_HEADER_ID;
                CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));

                //new insert
                if (COMMENT == undefined || COMMENT == null) {
                    CashupModelObj.CASHUP_HEADER_NOTES_ID = 0; // for new insert
                    CashupModelObj.NOTE = $scope.CASHUP_ENTRY_NOTE;
                    CashupModelObj.DELETE_NOTE = 0;
                }
                //Edit condition
                if (COMMENT != undefined && COMMENT != null) {
                    CashupModelObj.CASHUP_HEADER_NOTES_ID = COMMENT.TABLE_ID;
                    CashupModelObj.NOTE = COMMENT.NOTE;
                    CashupModelObj.DELETE_NOTE = COMMENT.DELETE_NOTE;
                }
                PrcCommMethods.CASHUP_APP_API(CashupModelObj, 'INS_UPD_CASHUP_HEADER_NOTES').then(function (data) {
                    $scope.CASHUP_ENTRY_NOTE = "";
                    if (COMMENT != undefined && COMMENT != null) {
                        COMMENT.isEditable = false;
                    }
                    $scope.VOUCHERS_TAB_NOTE_LIST = [];
                    $scope.GET_CASHUP_HEADER_NOTES();

                });
            }
            else {
                alert('Comments cannot be empty while saving');
            }
        }
    };

    $scope.VALIDATE = function () {
        var isValid = true;
        angular.forEach($scope.VOUCHERS_ENTRY_LIST, function (_row) {
            if (_row.ENTRY_TYPE_DETAIL_ID != null && _row.ENTRY_TYPE_DETAIL_ID != undefined) {
                if (parseFloat(_row.AMOUNT) > parseFloat(_row.REMAINING_VALUE)) {
                    $scope.$parent.ShowAlertBox('Error', "Redeemed Amount can't be larger than Remaining Amount");
                    isValid = false;
                    return;
                }
            }
        });

        return isValid ? 1 : 0;
    }
    $scope.INS_ENTRY_VOUCHER_DECLARATION = function (isDraft, isPrevious) {
        $('#upload-voucher-check').blur();
        if ($scope.VALIDATE() != 0) {
            $scope.VouchersEntryForm.submitted = true;
            if ($scope.VouchersEntryForm.$valid) {

                $scope.CALCULATE_TOTAL();
                var CashupAppModelObj = new Object();
                CashupAppModelObj.CASHUP_HEADER_ID = $scope.CASHUP_HEADER_ID;
                CashupAppModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
                CashupAppModelObj.BRANCH_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID;
                CashupAppModelObj.USER_ID = parseInt($cookies.get("USERID"));
                CashupAppModelObj.ISSUE_TOTAL = $scope.VOUCHER_ISSUED_TOTAL;
                CashupAppModelObj.REDEEMED_TOTAL = $scope.VOUCHER_REDEEMED_TOTAL;
                CashupAppModelObj.IS_DRAFT = isDraft;
                CashupAppModelObj.STEP_NO = 8;
                var declaration_list = [];
                angular.forEach($scope.VOUCHERS_ENTRY_LIST, function (_row) {
                    var declaration = new Object();
                    declaration.TABLE_ID = _row.ID;
                    declaration.ENTRY_TYPE_ID = _row.ENTRY_TYPE_ID;
                    declaration.ENTRY_TYPE_DETAIL_ID = _row.ENTRY_TYPE_DETAIL_ID;
                    declaration.VOUCHER_TYPE = _row.VOUCHER_TYPE;
                    declaration.CODE = _row.VOUCHER_NUMBER;
                    declaration.VALUE = parseFloat(_row.AMOUNT).toFixed(5);
                    //declaration.VALIDITY_DATE = _row.VALIDITY_DATE;
                    declaration.VALIDITY_DATE = moment(_row.VALIDITY_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).format($scope.$parent.DB_DATE_FORMAT);
                    declaration.CUSTOMER_NAME = _row.SOLD_TO;
                    declaration.MODE = _row.VOUCHER_PAYMENT_METHOD;
                    declaration.CHECK_NO = _row.VOUCHER_INVOICE_NUMBER;
                    declaration.NOTE = _row.NOTE;
                    if ((_row.ID == 0) && (_row.ENTRY_TYPE_DETAIL_ID != null && _row.ENTRY_TYPE_DETAIL_ID != undefined)) {
                        if (parseInt(_row.ENTRY_TYPE_DETAIL_ID) > 0) {
                            declaration.IS_REDEEMED = 1;
                        }
                        else {
                            declaration.IS_REDEEMED = _row.IS_REDEEMED;
                        }
                    }
                    else {
                        declaration.IS_REDEEMED = _row.IS_REDEEMED;
                    }

                    declaration.AUTHORIZED_BY_ID = null;
                    declaration.DISCOUNT = null;
                    declaration.FOOD = null;
                    declaration.DRINKS = null;
                    declaration.LIGHT_SPEED_ACCOUNTFISCID = null;
                    declaration.IS_DELETED = _row.IS_DELETED;
                    declaration.PAYMENT_METHOD_ID = _row.PAYMENT_METHOD_ID;
                    declaration.DEPOSIT_CANCELLATION_FEE = null;
                    declaration.IS_CANCELLED = 0;
                    if (_row.ENTRY_TYPE_DETAIL_ID == null || _row.ENTRY_TYPE_DETAIL_ID == undefined) {
                        declaration.TOTAL_AMT = parseFloat(_row.AMOUNT).toFixed(5);
                        //declaration.TOTAL_AMT = parseFloat(parseFloat(_row.AMOUNT).toFixed(5));
                    }
                    else {
                        declaration.TOTAL_AMT = parseFloat(_row.TOTAL_AMT).toFixed(5);
                    }
                    declaration.UPLOAD_IDS = _row.UPLOAD_IDS;
                    declaration.REDEEMED_BY = _row.REDEEMED_BY;
                    declaration.IS_EXTERNAL_RECORD = _row.IS_EXTERNAL_RECORD;
                    declaration_list.push(declaration);
                });
                CashupAppModelObj.ENTRY_DECLERATION_TYPE = declaration_list;
                PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'INS_ENTRY_VOUCHER_DECLARATION').then(function (data) {
                    $scope.OPEN_VOUCHER_DETAILS = [];
                    $scope.GET_CASHUP_ENTRY_HEADER($scope.CASHUP_HEADER_ID);
                    $scope.VouchersEntryForm.submitted = false;
                    if (isDraft == 1) {
                        $scope.Fn_Cashup_entry_TAB_CLICK($scope.TAB_ID, 1);
                    }
                    if (isPrevious == 1) {
                        $scope.Fn_Cashup_entry_TAB_CLICK($scope.TAB_ID, 0);
                    }
                    else {
                        $scope.VOUCHER_ISSUED_TOTAL = 0;
                        $scope.VOUCHER_REDEEMED_TOTAL = 0;
                        $scope.GET_ENTRY_TYPE_DECLARATION();
                    }
                });
            }
        }
    }
    $scope.$on('$destroy', function () {
        $('.modal.show').modal('hide');
        $('.dropdown-menu').hide();
    });


});