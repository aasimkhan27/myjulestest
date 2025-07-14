app.controller('AccountController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    if ($scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID == null || $scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID == undefined || $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_ID == null || $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_ID == undefined) {
        $location.path('CashUpApp_Entry');
        return;
    }
    $scope.$parent.REDIRECT_REGISTER_ENTRY = false;
    $scope.$parent.TAB_ID = 6;
    $scope.TAB_ID = 6;
    $scope.CASHUP_HEADER_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_ID;
    $scope.CASHUP_MAIN_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_MAIN_ID;
    $scope.CASHUP_INFO = {};
    $scope.CASHUP_INFO.ACTUAL = $scope.$parent.CASHUP_HEADER_VALUES.ACCOUNT_CREDIT.ACTUAL;
    $scope.CASHUP_INFO.EPOS = $scope.$parent.CASHUP_HEADER_VALUES.ACCOUNT_CREDIT.EPOS;
    $scope.ACCOUNT_RECEIVED_CASHUP_VALUES = {};
    $scope.ACCOUNT_RECEIVED_CASHUP_VALUES.EPOS = $scope.CASHUP_HEADER_VALUES.ACCOUNT_RECEIVED.EPOS;
    $scope.ACCOUNT_RECEIVED_CASHUP_VALUES.ACTUAL = $scope.CASHUP_HEADER_VALUES.ACCOUNT_RECEIVED.ACTUAL;
    $scope.ADD_CUSTOMER_NAME = null;
    $scope.ADD_CUSTOMER_EMAIL = null;
    $scope.ADD_CUSTOMER_CONTACT = null;
    $scope.ACCOUNT_CREDIT_LIST = [];
    $scope.ACCOUNT_CUSTOMER_CUSTOMERS = [];
    $scope.ACCOUNT_CREDIT_TOTAL = 0;
    $scope.ACCOUNT_RECEIVED_AMOUNT_TOTAL = 0;
    $scope.ADD_NEW_ROW_FLAG = false;
    $scope.ACCOUNT_RECEIVED_LIST = [];
    $scope.ACCOUNT_RECEIVED_ENTRY = [];
    $scope.ACCOUNT_RECEIVED_SEARCH = {};
    $scope.ACCOUNT_RECEIVED_SEARCH.CUSTOMER_NAME = '';
    $scope.ACCOUNT_RECEIVED_SEARCH.COMPANY = '';
    $scope.ACCOUNT_RECEIVED_SEARCH.INVOICE_NUMBER = '';
    $scope.ACCOUNT_RECEIVED_SEARCH.PAGE_NO = 1;
    $scope.ACCOUNT_RECEIVED_SEARCH.PAGE_SIZE = 10;
    $scope.GetData = true;
    $scope.ACCOUNT_RECEIVED_CHECKED_ALL = false;
    $scope.MODE_OF_PAYMENT_LIST = [];
    $scope.CASHUP_ENTRY_NOTE = "";
    $scope.ACCOUNT_TAB_NOTE_LIST = [];
    $scope.GET_CASHUP_HEADER_NOTES = function () {
        var CashupModelObj = new Object();
        CashupModelObj.NOTE_TYPE_ID = 9;
        CashupModelObj.CASHUP_HEADER_ID = $scope.CASHUP_HEADER_ID;
        PrcCommMethods.CASHUP_APP_API(CashupModelObj, 'GET_CASHUP_HEADER_NOTES').then(function (data) {
            if (data.data.Table != null && data.data.Table.length > 0) {
                $scope.ACCOUNT_TAB_NOTE_LIST = data.data.Table.map(function (item) {
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
        });
    };
    $scope.GET_MODE_OF_PAYMENTS();
    $scope.GET_ACCOUNT_CUSTOMER_CUSTOMERS = function (flag) {
        var CashupModelObj = new Object();
        CashupModelObj.BRANCH_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID;
        CashupModelObj.ACTIVE = 1;
        PrcCommMethods.CASHUP_APP_API(CashupModelObj, 'GET_ACCOUNT_CUSTOMER_CUSTOMERS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.ACCOUNT_CUSTOMER_CUSTOMERS = data.data.Table;
            }
            else {
                $scope.ACCOUNT_CUSTOMER_CUSTOMERS = [];
            }
            if (flag == 1) {
                $scope.GET_CASHUP_ACCOUNT_CREDIT();
                $scope.GET_ACCOUNT_RECEIVED();
            }
            
        });
    };
    $scope.GET_ACCOUNT_CUSTOMER_CUSTOMERS(1);
    $scope.GET_CASHUP_ACCOUNT_CREDIT = function () {
        var CashupAppModelObj = new Object();
        CashupAppModelObj.CASHUP_HEADER_ID = $scope.CASHUP_HEADER_ID;
        PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'GET_CASHUP_ACCOUNT_CREDIT').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.ACCOUNT_CREDIT_LIST = data.data.Table;
                //$scope.ACCOUNT_RECEIVED_ENTRY = data.data.Table.filter(_row => _row.PARENT_ID != null);
            }
            else {
                $scope.ACCOUNT_CREDIT_LIST = [];
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
    
    $scope.GET_ACCOUNT_RECEIVED = function (flag) {
        if (flag == null || flag == undefined) {
            $scope.ACCOUNT_RECEIVED_SEARCH.PAGE_NO = 1;
            $scope.GetData = true;
        }
        var CashupAppModelObj = new Object();
        CashupAppModelObj.BRANCH_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID;
        CashupAppModelObj.CUSTOMER_NAME = $scope.ACCOUNT_RECEIVED_SEARCH.CUSTOMER_NAME;
        CashupAppModelObj.COMPANY = $scope.ACCOUNT_RECEIVED_SEARCH.COMPANY;
        CashupAppModelObj.INVOICE_NUMBER = $scope.ACCOUNT_RECEIVED_SEARCH.INVOICE_NUMBER;
        CashupAppModelObj.PAGE_NO = $scope.ACCOUNT_RECEIVED_SEARCH.PAGE_NO;
        CashupAppModelObj.PAGE_SIZE = $scope.ACCOUNT_RECEIVED_SEARCH.PAGE_SIZE;
        PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'GET_ACCOUNT_RECEIVED').then(function (data) {
            if (data.data.Table.length > 0) {

                if (flag == null || flag == undefined) {
                    $scope.ACCOUNT_RECEIVED_LIST = data.data.Table;
                }
                else if (flag == 1) {
                    $scope.ACCOUNT_RECEIVED_LIST = $scope.ACCOUNT_RECEIVED_LIST.concat(data.data.Table);
                }

                if (data.data.Table.length < $scope.ACCOUNT_RECEIVED_SEARCH.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.ACCOUNT_RECEIVED_SEARCH.PAGE_NO = parseInt($scope.ACCOUNT_RECEIVED_SEARCH.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else if ($scope.ACCOUNT_RECEIVED_SEARCH.PAGE_NO > 1 && data.data.Table.length == 0) {
                $scope.GetData = false;
            }
            else if ($scope.ACCOUNT_RECEIVED_SEARCH.PAGE_NO == 1 && data.data.Table.length == 0) {
                $scope.ACCOUNT_RECEIVED_LIST = [];
                $scope.GetData = false;
            }
            //else {
            //    $scope.ACCOUNT_RECEIVED_LIST = [];
            //}
        });
    };

    $scope.ADD_ROW = function (flag, CHECKED_ACCOUNT_RECEIVED_LIST) {
        if (flag == 1) {
            var ROW = new Object();
            ROW.ID = 0;
            ROW.CASHUP_HEADER_ID = $scope.CASHUP_HEADER_ID;
            ROW.INVOICE_NUMBER = null;
            ROW.CUSTOMER_NAME = null;
            ROW.COMPANY = null;
            ROW.AMOUNT = null;
            ROW.MODE_OF_PAYMENT = null;//'Account(Credit)';  Mode of Payment name can be hardcoded while creating a new credit
            ROW.MODE_OF_PAYMENT_ID = null;//$scope.MODE_OF_PAYMENT_LIST.filter(mp => mp.METHOD_NAME == 'Account(Credit)')[0].MODE_OF_PAYMENT_ID;
            ROW.NOTE = null;
            ROW.ACTIVE = 1;
            ROW.CREATED_BY = null;
            ROW.CREATED_DATE = null;
            ROW.MODIFIED_BY = null;
            ROW.MODIFIED_DATE = null;
            ROW.CUSTOMER_ID = null
            ROW.PARENT_ID = null;
            ROW.TOTAL_AMT = null;
            ROW.IS_REDEEMED = 0;
            ROW.RESTRICT_DELETE = null;
            ROW.UPLOAD_IDS = null;
            ROW.FILE_NAME = null;
            ROW.IS_DELETED = 0;
            ROW.IS_EXTERNAL_RECORD = 0;
            $scope.ACCOUNT_CREDIT_LIST.push(ROW);
        }
        if (flag == 2) {
            if (CHECKED_ACCOUNT_RECEIVED_LIST != null && CHECKED_ACCOUNT_RECEIVED_LIST != undefined) {
                angular.forEach(CHECKED_ACCOUNT_RECEIVED_LIST, function (_row) {
                    var ROW = new Object();
                    ROW.ID = 0;
                    ROW.CASHUP_HEADER_ID = $scope.CASHUP_HEADER_ID;
                    ROW.INVOICE_NUMBER = _row.INVOICE_NUMBER;
                    ROW.CUSTOMER_NAME = _row.CUSTOMER_NAME;
                    ROW.COMPANY = _row.COMPANY;
                    ROW.AMOUNT = _row.REMAINING_AMOUNT;
                    ROW.MODE_OF_PAYMENT = null;
                    ROW.MODE_OF_PAYMENT_ID = null;
                    //ROW.MODE_OF_PAYMENT = _row.MODE_OF_PAYMENT;
                    //ROW.MODE_OF_PAYMENT_ID = _row.MODE_OF_PAYMENT_ID;
                    ROW.NOTE = _row.NOTE;
                    ROW.ACTIVE = _row.ACTIVE;
                    ROW.CREATED_BY = _row.CREATED_BY;
                    ROW.CREATED_DATE = _row.CREATED_DATE;
                    ROW.MODIFIED_BY = _row.MODIFIED_BY;
                    ROW.MODIFIED_DATE = _row.MODIFIED_DATE;
                    ROW.CUSTOMER_ID = _row.CUSTOMER_ID;
                    ROW.PARENT_ID = _row.ID;
                    ROW.TOTAL_AMT = _row.AMOUNT;
                    ROW.IS_REDEEMED = 1;
                    ROW.RESTRICT_DELETE = null;
                    ROW.UPLOAD_IDS = null;
                    ROW.FILE_NAME = null;
                    ROW.IS_DELETED = _row.IS_DELETED;
                    ROW.REMAINING_AMOUNT = _row.REMAINING_AMOUNT;
                    ROW.IS_EXTERNAL_RECORD = _row.IS_EXTERNAL_RECORD;
                    $scope.ACCOUNT_RECEIVED_ENTRY.push(ROW);
                });
            }
        }
        if (flag == 3) {
            var ROW = new Object();
            ROW.ID = 0;
            ROW.CASHUP_HEADER_ID = $scope.CASHUP_HEADER_ID;
            ROW.INVOICE_NUMBER = null;
            ROW.CUSTOMER_NAME = null;
            ROW.COMPANY = null;
            ROW.AMOUNT = null;
            ROW.MODE_OF_PAYMENT = null;
            ROW.MODE_OF_PAYMENT_ID = null;
            //ROW.MODE_OF_PAYMENT = _row.MODE_OF_PAYMENT;
            //ROW.MODE_OF_PAYMENT_ID = _row.MODE_OF_PAYMENT_ID;
            ROW.NOTE = null;
            ROW.ACTIVE = 1;
            ROW.CREATED_BY = null;
            ROW.CREATED_DATE = null;
            ROW.MODIFIED_BY = null;
            ROW.MODIFIED_DATE = null;
            ROW.CUSTOMER_ID = null;
            ROW.PARENT_ID = 0;
            ROW.TOTAL_AMT = 0;
            ROW.IS_REDEEMED = 1;
            ROW.RESTRICT_DELETE = null;
            ROW.UPLOAD_IDS = null;
            ROW.FILE_NAME = null;
            ROW.IS_DELETED = 0;
            ROW.REMAINING_AMOUNT = null;
            ROW.IS_EXTERNAL_RECORD = 0;
            $scope.ACCOUNT_CREDIT_LIST.push(ROW);
        }
    };
    $scope.nginitaccounts = function (_row) {
        _row.CUSTOMER_NAME_TEXT = "";
        _row.FILTERED_CUSTOMER_LIST = $scope.ACCOUNT_CUSTOMER_CUSTOMERS;
        if (_row.ACTIVE == true || _row.ACTIVE == 1) {
            if (_row.PARENT_ID == null || _row.PARENT_ID == undefined) {
                if (!isNaN(parseFloat(_row.AMOUNT))) {
                    $scope.ACCOUNT_CREDIT_TOTAL += parseFloat(_row.AMOUNT);
                }
            }
            if (_row.PARENT_ID != null && _row.PARENT_ID != undefined) {
                if (!isNaN(parseFloat(_row.AMOUNT))) {
                    $scope.ACCOUNT_RECEIVED_AMOUNT_TOTAL += parseFloat(_row.AMOUNT);
                }
            }
        }
        _row.SELECTED_MODE_OF_PAYMENT_NAME = _row.MODE_OF_PAYMENT;
    };
    $scope.nginit_account_received = function (_row) {
        _row.CHECKED = false;
    };
    $scope.nginit_account_received_entry = function (_row) {
        _row.SELECTED_MODE_OF_PAYMENT_NAME = _row.MODE_OF_PAYMENT;
        
    }
    $scope.RESET_ACCOUNT_RECEIVED_ENTRY = function () {
        $scope.ACCOUNT_RECEIVED_ENTRY = [];
    }
    $scope.DELETE_ROW = function (ROW) {
        if (confirm('Are you sure you want to proceed?')) {
            if (ROW.ID == 0) {
                let index = $scope.ACCOUNT_CREDIT_LIST.indexOf(ROW);
                if (index !== -1) {
                    $scope.ACCOUNT_CREDIT_LIST.splice(index, 1);
                }
                else {
                    let index = $scope.ACCOUNT_RECEIVED_ENTRY.indexOf(ROW);
                    if (index !== -1) {
                        $scope.ACCOUNT_RECEIVED_ENTRY.splice(index, 1);
                    }
                }
                //$scope.AccountsEntryForm.submitted = false;
            }
            else {
                ROW.IS_DELETED = 1;
                $scope.INS_UPD_CASHUP_ACCOUNT(0);
            }
            
        }
    };
    $scope.VALIDATE_AMOUNT = function (_row) {
        if (parseFloat(_row.AMOUNT) > parseFloat(_row.REMAINING_AMOUNT)) {
            $scope.$parent.ShowAlertBox('Error', "Entered amount cannot be greater than remaining amount");
            _row.AMOUNT = _row.REMAINING_AMOUNT;
        }
    };
    $scope.CHECK_ALL_ACCOUNT_RECEIVED = function () {
        if ($scope.ACCOUNT_RECEIVED_CHECKED_ALL == false) {
            angular.forEach($scope.ACCOUNT_RECEIVED_LIST, function (arl) {
                arl.CHECKED = true;
            });
        }
        else {
            angular.forEach($scope.ACCOUNT_RECEIVED_LIST, function (arl) {
                arl.CHECKED = false;
            });
        }
    };
    $scope.SELECT_ACCOUNT_RECEIVED = function () {
        //$scope.ACCOUNT_RECEIVED_ENTRY = $scope.ACCOUNT_RECEIVED_LIST.filter(arl => arl.CHECKED == true);
        $scope.ACCOUNT_RECEIVED_ENTRY = [];
        $scope.ADD_ROW(2, $scope.ACCOUNT_RECEIVED_LIST.filter(arl => arl.CHECKED == true));
        $scope.RESET_SEARCH();
    };
    $scope.RESET_SEARCH = function () {
        $scope.ACCOUNT_RECEIVED_SEARCH.CUSTOMER_NAME = '';
        $scope.ACCOUNT_RECEIVED_SEARCH.COMPANY = '';
        $scope.ACCOUNT_RECEIVED_SEARCH.INVOICE_NUMBER = '';
        $scope.ACCOUNT_RECEIVED_CHECKED_ALL = false;
    }
    $scope.SELECT_MODE_OF_PAYMENT = function (_row, _mode_of_payment) {
        _row.MODE_OF_PAYMENT_ID = _mode_of_payment.MODE_OF_PAYMENT_ID;
        _row.SELECTED_MODE_OF_PAYMENT_NAME = _mode_of_payment.METHOD_NAME;
        _row.MODE_OF_PAYMENT = _mode_of_payment.METHOD_NAME;
    };
    $scope.ADD_NEW_ROW_CREDIT = function () {
        if ($scope.ACCOUNT_CREDIT_LIST.length == 0) {
            $scope.ADD_ROW(1);
        }
        else {
            $scope.ADD_NEW_ROW_FLAG = true;
            $scope.INS_UPD_CASHUP_ACCOUNT(0);
        }
    };

    $scope.ADD_NEW_ROW_ENTRY_DIRECT_REDEEM = function () {
        if ($scope.ACCOUNT_CREDIT_LIST.length == 0) {
            $scope.ADD_ROW(3);
        }
        else {
            $scope.ADD_NEW_ROW_FLAG_DIRECT_ENTRY = true;
            $scope.INS_UPD_CASHUP_ACCOUNT(0);
        }
    };

    $scope.SEARCH_CUSTOMER = function (_row) {
        _row.FILTERED_CUSTOMER_LIST = $scope.ACCOUNT_CUSTOMER_CUSTOMERS.filter(acc => acc.NAME.toLowerCase().includes(_row.CUSTOMER_NAME_TEXT.toLowerCase()));
    };

    $scope.SELECT_CUSTOMER = function (_row, acc) {
        _row.CUSTOMER_NAME = acc.NAME;
        _row.CUSTOMER_ID = acc.ID;
    };

    $scope.ADD_NEW_CUSTOMER_POPUP = function () {
        var myModal = new bootstrap.Modal(document.getElementById('add_customer'), {
            keyboard: false  // Optional: Close modal when pressing ESC
        });
        // Show the modal
        myModal.show();
    };
    $scope.RESET_ADD_CUSTOMER = function () {
        $scope.ADD_CUSTOMER_NAME = null;
        $scope.ADD_CUSTOMER_EMAIL = null;
        $scope.ADD_CUSTOMER_CONTACT = null;
    }
    $scope.SHOW_DDL_Fn = function (FLAG) {
        if (FLAG == 1) {
            $(".searchableCustomerButton").show();
        }
        
    };
    $scope.CALCULATE_TOTAL = function () {
        var accountCreditTotal = 0;
        var accountReceivedTotal = 0;
        angular.forEach($scope.ACCOUNT_CREDIT_LIST, function (_row) {
            if ((_row.ACTIVE == true || _row.ACTIVE == 1) && (_row.IS_DELETED == false || _row.IS_DELETED == 0)) {
                if (_row.PARENT_ID == null || _row.PARENT_ID == undefined) {
                    if (!isNaN(parseFloat(_row.AMOUNT))) {
                        accountCreditTotal += parseFloat(_row.AMOUNT);
                    }
                }
                if (_row.PARENT_ID != null && _row.PARENT_ID != undefined) {
                    if (!isNaN(parseFloat(_row.AMOUNT))) {
                        accountReceivedTotal += parseFloat(_row.AMOUNT);
                    }
                }
            }
        });
        angular.forEach($scope.ACCOUNT_RECEIVED_ENTRY, function (_row) {
            if ((_row.ACTIVE == true || _row.ACTIVE == 1) && (_row.IS_DELETED == false || _row.IS_DELETED == 0)) {
                if (_row.PARENT_ID != null && _row.PARENT_ID != undefined) {
                    if (!isNaN(parseFloat(_row.AMOUNT))) {
                        accountReceivedTotal += parseFloat(_row.AMOUNT);
                    }
                }
            }
        });
        $scope.ACCOUNT_CREDIT_TOTAL = accountCreditTotal;
        $scope.ACCOUNT_RECEIVED_AMOUNT_TOTAL = accountReceivedTotal;
        
    };
    $scope.PREVIOUS = function () {
        if ($scope.$parent.CASHUP_ENTRY_SEARCH.IS_DATA_ENTRY_ENABLED == true) {
            $scope.INS_UPD_CASHUP_ACCOUNT(0, 1);
        }
        else {
            $scope.Fn_Cashup_entry_TAB_CLICK($scope.TAB_ID, 0);
        }
    }
    $scope.CONTINUE = function () {
        if ($scope.$parent.CASHUP_ENTRY_SEARCH.IS_DATA_ENTRY_ENABLED == true) {
            $scope.AccountsEntryForm.submitted = true;
            if ($scope.AccountsEntryForm.$valid) {
                if (!isNaN((parseFloat($scope.CASHUP_INFO.ACTUAL) - parseFloat($scope.CASHUP_INFO.EPOS)) + ($scope.ACCOUNT_RECEIVED_CASHUP_VALUES.ACTUAL - $scope.ACCOUNT_RECEIVED_CASHUP_VALUES.EPOS))) {
                    if ((parseFloat($scope.CASHUP_INFO.ACTUAL) - parseFloat($scope.CASHUP_INFO.EPOS)) + ($scope.ACCOUNT_RECEIVED_CASHUP_VALUES.ACTUAL - $scope.ACCOUNT_RECEIVED_CASHUP_VALUES.EPOS) != 0) {
                        var myModal = new bootstrap.Modal(document.getElementById('proceed'), {
                            keyboard: false  // Optional: Close modal when pressing ESC
                        });
                        // Show the modal
                        myModal.show();
                    }
                    else {
                        $scope.INS_UPD_CASHUP_ACCOUNT(1)
                    }
                }
                else {
                    $scope.INS_UPD_CASHUP_ACCOUNT(1)
                }
            }
        }
        else {
            $scope.Fn_Cashup_entry_TAB_CLICK($scope.TAB_ID, 1);
        }
    }
    $scope.RESET_ON_MODAL_CLOSE = function () {
        $scope.ACCOUNT_CREDIT_TOTAL = 0;
        $scope.ACCOUNT_RECEIVED_AMOUNT_TOTAL = 0;
        $scope.ACCOUNT_RECEIVED_ENTRY = [];
        $scope.GET_CASHUP_ACCOUNT_CREDIT();
    }
    $scope.INS_UPD_ACCOUNT_CUSTOMER_CUSTOMERS = function () {
        $scope.ACC_FORM.submitted = true;
        //if ($scope.ADD_CUSTOMER_NAME.trim().length == 0) {
        //    document.getElementById("ACC_NAME").focus();
        //    return;
        //}
        //if ($scope.ADD_CUSTOMER_EMAIL.trim().length == 0) {
        //    document.getElementById("ACC_EMAIL").focus();
        //    return;
        //}
        //if ($scope.ADD_CUSTOMER_CONTACT.trim().length == 0) {
        //    document.getElementById("ACC_CONTACT").focus();
        //    return;
        //}
        if ($scope.ACC_FORM.$valid) {
            var CashupAppModelObj = new Object();
            CashupAppModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            CashupAppModelObj.BRANCH_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID;
            CashupAppModelObj.CUSTOMER_ID = 0;
            CashupAppModelObj.CUSTOMER_NAME = $scope.ADD_CUSTOMER_NAME;
            CashupAppModelObj.EMAIL = $scope.ADD_CUSTOMER_EMAIL;
            CashupAppModelObj.PHONE = $scope.ADD_CUSTOMER_CONTACT;
            CashupAppModelObj.ACTIVE = 1;
            PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'INS_UPD_ACCOUNT_CUSTOMER_CUSTOMERS').then(function (data) {
                $scope.ACC_FORM.submitted = false;
                if (data.data == 0) {
                    var myModal = new bootstrap.Modal(document.getElementById('add_acc_failure'), {
                        keyboard: false  // Optional: Close modal when pressing ESC
                    });
                    // Show the modal
                    myModal.show();
                }
                if (data.data > 0) {
                    var myModal = new bootstrap.Modal(document.getElementById('add_acc_success'), {
                        keyboard: false  // Optional: Close modal when pressing ESC
                    });
                    // Show the modal
                    myModal.show();
                    $scope.RESET_ADD_CUSTOMER();
                    $scope.GET_ACCOUNT_CUSTOMER_CUSTOMERS();
                }
            });
        }
    }
    $scope.VALIDATE = function()
    {
        var isValid = true;

        angular.forEach($scope.ACCOUNT_CREDIT_LIST, function (_row) {
            if (_row.PARENT_ID == null || _row.PARENT_ID == undefined) {
                if (_row.CUSTOMER_NAME == null || _row.CUSTOMER_NAME == undefined || _row.CUSTOMER_NAME == '') {
                    $scope.$parent.ShowAlertBox('Error', "Please enter Customer Name");
                    isValid = false;
                    return;
                }
            }
            if (_row.PARENT_ID != null && _row.PARENT_ID != undefined) {
                if (_row.CUSTOMER_NAME == null || _row.CUSTOMER_NAME == undefined || _row.CUSTOMER_NAME == '') {
                    $scope.$parent.ShowAlertBox('Error', "Please enter Customer Name");
                    isValid = false;
                    return;
                }
                if (_row.MODE_OF_PAYMENT_ID == null || _row.MODE_OF_PAYMENT_ID == undefined) {
                    $scope.$parent.ShowAlertBox('Error', "Please select a mode of payment");
                    isValid = false;
                    return;
                }
                else if (_row.MODE_OF_PAYMENT == null || _row.MODE_OF_PAYMENT == undefined || _row.MODE_OF_PAYMENT == ''){
                    $scope.$parent.ShowAlertBox('Error', "Please select a mode of payment");
                    isValid = false;
                    return;
                }
            }
        });

        return isValid ? 1 : 0;
    }
    //$scope.CONTINUE = function () {
    //    $scope.AccountsEntryForm.submitted = true;
    //    if ($scope.AccountsEntryForm.$valid) {
    //        if (!isNaN(parseFloat($scope.CASHUP_INFO.ACTUAL) - parseFloat($scope.CASHUP_INFO.EPOS))) {
    //            if (parseFloat($scope.CASHUP_INFO.ACTUAL) - parseFloat($scope.CASHUP_INFO.EPOS) != 0) {
    //                var myModal = new bootstrap.Modal(document.getElementById('proceed'), {
    //                    keyboard: false  // Optional: Close modal when pressing ESC
    //                });
    //                // Show the modal
    //                myModal.show();
    //            }
    //            else {
    //                $scope.INS_UPD_CASHUP_ACCOUNT(1);
    //            }
    //        }
    //        else {
    //            $scope.INS_UPD_CASHUP_ACCOUNT(1);
    //        }
    //    }
        
    //}
    $scope.INS_UPD_CASHUP_ACCOUNT = function (isDraft,isPrevious) {
        $scope.AccountsEntryForm.submitted = true;
        if ($scope.AccountsEntryForm.$valid) {
            $scope.CALCULATE_TOTAL();
            var CashupAppModelObj = new Object();
            CashupAppModelObj.CASHUP_HEADER_ID = $scope.CASHUP_HEADER_ID;
            CashupAppModelObj.ACCOUNT_TOTAL = $scope.ACCOUNT_CREDIT_TOTAL;
            CashupAppModelObj.ACCOUNT_RECEIVED_TOTAL = $scope.ACCOUNT_RECEIVED_AMOUNT_TOTAL;
            CashupAppModelObj.USER_ID = parseInt($cookies.get("USERID"));
            CashupAppModelObj.STEP_NO = 7;
            CashupAppModelObj.IS_DRAFT = isDraft;
            CashupAppModelObj.REDEEM_FLAG = 0;
            CashupAppModelObj.BRANCH_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID;
            var ACCOUNT_CUSTOMER_LIST = [];
            angular.forEach($scope.ACCOUNT_CREDIT_LIST, function (_row) { // .filter(acl => acl.PARENT_ID == null || acl.PARENT_ID == undefined)
                var account_customer_row = new Object();
                account_customer_row.ACCOUNT_CUSTOMER_ID = _row.ID;
                account_customer_row.INVOICE_NUMBER = _row.INVOICE_NUMBER;
                account_customer_row.CUSTOMER_NAME = _row.CUSTOMER_NAME;
                account_customer_row.CUSTOMER_ID = _row.CUSTOMER_ID;
                account_customer_row.COMPANY = _row.COMPANY;
                account_customer_row.AMOUNT = parseFloat(_row.AMOUNT).toFixed(5);
                account_customer_row.MODE_OF_PAYMENT_ID = _row.MODE_OF_PAYMENT_ID;
                account_customer_row.MODE_OF_PAYMENT = _row.MODE_OF_PAYMENT;
                account_customer_row.NOTE = _row.NOTE;
                account_customer_row.PARENT_ID = _row.PARENT_ID;
                account_customer_row.ACTIVE = _row.ACTIVE;
                account_customer_row.IS_DELETED = _row.IS_DELETED;
                account_customer_row.IS_REDEEMED = _row.IS_REDEEMED;
                account_customer_row.TOTAL_AMT = _row.PARENT_ID == null || _row.PARENT_ID == undefined ? parseFloat(_row.AMOUNT).toFixed(5) : parseFloat(_row.TOTAL_AMT).toFixed(5);
                //if (_row.PARENT_ID == null || _row.PARENT_ID == undefined) {
                //    account_customer_row.TOTAL_AMT = parseFloat(_row.AMOUNT).toFixed(5);
                //}
                //else if (_row.PARENT_ID == 0) {
                //    account_customer_row.TOTAL_AMT
                //}
                //else{
                //    account_customer_row.TOTAL_AMT = parseFloat(_row.TOTAL_AMT).toFixed(5);
                //}
                //account_customer_row.TOTAL_AMT = parseFloat(_row.TOTAL_AMT).toFixed(5);
                //account_customer_row.TOTAL_AMT = parseFloat(_row.AMOUNT).toFixed(5);
                account_customer_row.UPLOAD_IDS = _row.UPLOAD_IDS;
                account_customer_row.IS_EXTERNAL_RECORD = _row.IS_EXTERNAL_RECORD;
                ACCOUNT_CUSTOMER_LIST.push(account_customer_row);
            });

            angular.forEach($scope.ACCOUNT_RECEIVED_ENTRY, function (_row) {
                var account_customer_row = new Object();
                account_customer_row.ACCOUNT_CUSTOMER_ID = _row.ID;
                account_customer_row.INVOICE_NUMBER = _row.INVOICE_NUMBER;
                account_customer_row.CUSTOMER_NAME = _row.CUSTOMER_NAME;
                account_customer_row.CUSTOMER_ID = _row.CUSTOMER_ID;
                account_customer_row.COMPANY = _row.COMPANY;
                account_customer_row.AMOUNT = parseFloat(_row.AMOUNT).toFixed(5);
                account_customer_row.MODE_OF_PAYMENT_ID = _row.MODE_OF_PAYMENT_ID;
                account_customer_row.MODE_OF_PAYMENT = _row.MODE_OF_PAYMENT;
                account_customer_row.NOTE = _row.NOTE;
                account_customer_row.PARENT_ID = _row.PARENT_ID;
                account_customer_row.ACTIVE = _row.ACTIVE;
                account_customer_row.IS_DELETED = _row.IS_DELETED;
                account_customer_row.IS_REDEEMED = _row.IS_REDEEMED;
                account_customer_row.TOTAL_AMT = parseFloat(_row.TOTAL_AMT).toFixed(5);
                account_customer_row.UPLOAD_IDS = _row.UPLOAD_IDS;
                account_customer_row.IS_EXTERNAL_RECORD = _row.IS_EXTERNAL_RECORD;
                ACCOUNT_CUSTOMER_LIST.push(account_customer_row);
            });
            CashupAppModelObj.ACCOUNT_CUSTOMER = ACCOUNT_CUSTOMER_LIST;
            PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'INS_UPD_CASHUP_ACCOUNT').then(function (data) {
                
                $scope.AccountsEntryForm.submitted = false;
                $scope.GET_CASHUP_ENTRY_HEADER($scope.CASHUP_HEADER_ID);
                if (isDraft == 1) {
                    $scope.Fn_Cashup_entry_TAB_CLICK($scope.TAB_ID, 1);
                }
                if (isPrevious == 1) {
                    $scope.Fn_Cashup_entry_TAB_CLICK($scope.TAB_ID, 0);
                }
                else {
                    $scope.ACCOUNT_CREDIT_TOTAL = 0;
                    $scope.ACCOUNT_RECEIVED_AMOUNT_TOTAL = 0;
                    $scope.ACCOUNT_RECEIVED_ENTRY = [];
                    $scope.GET_CASHUP_ACCOUNT_CREDIT();
                }
            });
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
                CashupModelObj.NOTE_TYPE_ID = 9;
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
                    $scope.ACCOUNT_TAB_NOTE_LIST = [];
                    $scope.GET_CASHUP_HEADER_NOTES();

                });
            }
            else {
                alert('Comments cannot be empty while saving');
            }
        }
    };
    $scope.$on('$destroy', function () {
        $('.modal.show').modal('hide');
        $('.dropdown-menu').hide();
    });
});