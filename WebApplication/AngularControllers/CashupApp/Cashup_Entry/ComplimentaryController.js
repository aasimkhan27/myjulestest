app.controller('ComplimentaryController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    if ($scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID == null || $scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID == undefined || $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_ID == null || $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_ID == undefined) {
        $location.path('CashUpApp_Entry');
        return;
    }
    $scope.$parent.REDIRECT_REGISTER_ENTRY = false;
    $scope.$parent.TAB_ID = 9;
    $scope.TAB_ID = 9;

    $scope.CASHUP_HEADER_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_ID;
    $scope.CASHUP_MAIN_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_MAIN_ID;
    $scope.ADD_NEW_COMP_ROW_FLAG = false;
    $scope.ADD_NEW_VOID_ROW_FLAG = false;
    $scope.AUTHORIZER_LIST = [];
    $scope.COMPS_LIST = [];
    $scope.VOIDS_LIST = [];
    $scope.COMP_ENTRY_LIST = [];
    $scope.VOID_ENTRY_LIST = [];
    $scope.COMP_TOTAL = 0;
    $scope.VOID_TOTAL = 0;
    $scope.CASHUP_ENTRY_NOTE = "";
    $scope.COMP_TAB_NOTE_LIST = [];
    $scope.CASHUP_INFO = {};
    $scope.CASHUP_INFO.ACTUAL = $scope.$parent.CASHUP_HEADER_VALUES.COMPLIMENTARY.ACTUAL;
    $scope.CASHUP_INFO.EPOS = $scope.$parent.CASHUP_HEADER_VALUES.COMPLIMENTARY.EPOS;
    $scope.CASHUP_INFO_VOID = {};
    $scope.CASHUP_INFO_VOID.ACTUAL = $scope.$parent.CASHUP_HEADER_VALUES.VOID.ACTUAL;
    $scope.CASHUP_INFO_VOID.EPOS = $scope.$parent.CASHUP_HEADER_VALUES.VOID.EPOS;
    $scope.GET_CASHUP_HEADER_NOTES = function () {
        var CashupModelObj = new Object();
        CashupModelObj.NOTE_TYPE_ID = 5;
        CashupModelObj.CASHUP_HEADER_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_ID;
        //CashupModelObj.CASHUP_HEADER_ID = $scope.CASHUP_HEADER_ID;
        PrcCommMethods.CASHUP_APP_API(CashupModelObj, 'GET_CASHUP_HEADER_NOTES').then(function (data) {
            if (data.data.Table != null && data.data.Table.length > 0) {
                $scope.COMP_TAB_NOTE_LIST = data.data.Table.map(function (item) {
                    item.isEditable = false;
                    return item;
                });;
            }
            else {
                $scope.COMP_TAB_NOTE_LIST = [];
            }
        });
    };
    $scope.GET_CASHUP_HEADER_NOTES();
    $scope.ADMIN_GET_BRANCH_STAFF = function () {
        CashupTabsObj = new Object();
        CashupTabsObj.CUSTOMER_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.CUSTOMER_ID;
        CashupTabsObj.ENTITY_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.ENTITY_ID;
        CashupTabsObj.LOCATION_ID = 0;
        CashupTabsObj.BRANCH_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID;
        CashupTabsObj.ACTIVE = 1;
        CashupTabsObj.STAFF_NAME = '';
        CashupTabsObj.PAGE_NO = 1;
        CashupTabsObj.PAGE_SIZE = 999;
        PrcCommMethods.ADMIN_API(CashupTabsObj, 'ADMIN_GET_BRANCH_STAFF').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.AUTHORIZER_LIST = data.data.Table;
            }
            else {
                $scope.AUTHORIZER_LIST = [];
                $scope.$parent.ShowAlertBox("Error", 'There is no Authorizers found, please Add from Settings', 3000);
            }
            $scope.GET_ENTRY_TYPE_DECLARATION();
        });
    };
    $scope.GET_COMPS = function () {
        var params = new Object();
        params.BRANCH_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID;
        PrcCommMethods.CASHUP_APP_API(params, 'GET_CASHUP_REASON_FOR_COMP').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.COMPS_LIST = data.data.Table;
            }
            else {
                $scope.COMPS_LIST = [];
                $scope.$parent.ShowAlertBox("Error", 'There is no Comp Reasons found, please Add from Settings', 3000);
            }
        });
    };
    $scope.GET_VOIDS = function () {
        var CommonObj = new Object();
        CommonObj.CUSTOMER_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.CUSTOMER_ID;
        CommonObj.ENTITY_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.ENTITY_ID;
        CommonObj.LOCATION_ID = 0;
        CommonObj.BRANCH_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID;
        CommonObj.REASON = null;
        CommonObj.ACTIVE = 1;
        CommonObj.PAGE_NO = 0;

        CommonObj.PAGE_SIZE = 999;
        PrcCommMethods.CASHUP_APP_API(CommonObj, 'ADMIN_GET_REASON_FOR_VOID').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.VOIDS_LIST = data.data.Table;
            }
            else {
                $scope.$parent.ShowAlertBox("Errpr", 'There is no Void Reasons found, please Add from Settings', 3000);
                $scope.VOIDS_LIST = [];
            }
        });
    };  
    $scope.GET_ENTRY_TYPE_DECLARATION = function (flag) {
        var CashupAppModelObj = new Object();
        CashupAppModelObj.CASHUP_HEADER_ID = $scope.CASHUP_HEADER_ID;
        PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'GET_ENTRY_TYPE_DECLARATION').then(function (data) {
            if (flag == undefined || flag == null || flag == 1) {
                if (data.data.Table.filter(row => row.ENTRY_TYPE_ID == 6).length > 0) {
                    $scope.COMP_ENTRY_LIST = data.data.Table.filter(row => row.ENTRY_TYPE_ID == 6);
                }
                else {
                    $scope.COMP_ENTRY_LIST = [];
                    //$scope.ADD_ROW(1);
                }
            }

            if (flag == undefined || flag == null || flag==2) {
                if (data.data.Table.filter(row => row.ENTRY_TYPE_ID == 7).length > 0) {
                    $scope.VOID_ENTRY_LIST = data.data.Table.filter(row => row.ENTRY_TYPE_ID == 7);
                }
                else {
                    $scope.VOID_ENTRY_LIST = [];
                    //$scope.ADD_ROW(2);
                }
            }
            if ($scope.ADD_NEW_COMP_ROW_FLAG == true) {
                $scope.ADD_NEW_COMP_ROW_FLAG = false;
                $scope.ADD_ROW(1);
            }
            if ($scope.ADD_NEW_VOID_ROW_FLAG == true) {
                $scope.ADD_NEW_VOID_ROW_FLAG = false;
                $scope.ADD_ROW(2);
            }
        });
    };
    $scope.ADMIN_GET_BRANCH_STAFF();
    $scope.GET_COMPS();
    $scope.GET_VOIDS();
    $scope.SELECT_VOID_TYPE = function (_row, _type) {
        _row.VOID_TYPE = _type.VOID_REASON;
    }
    $scope.SELECT_COMP_REASON = function (_row, _comp_reason) {
        _row.REASON_OF_COMP = _comp_reason.REASONS;
    }
    $scope.SELECT_AUTHORIZER = function (_row, _auth) {
        _row.AUTHORIZED_BY_NAME = _auth.NAME;
        _row.AUTHORIZED_BY = _auth.TABLE_ID;
    }
    $scope.nginit_comps = function (_row) {
        if ($scope.AUTHORIZER_LIST.filter(a => a.TABLE_ID == _row.AUTHORIZED_BY)[0] != null && $scope.AUTHORIZER_LIST.filter(a => a.TABLE_ID == _row.AUTHORIZED_BY)[0] != undefined) {
            _row.AUTHORIZED_BY_NAME = $scope.AUTHORIZER_LIST.filter(a => a.TABLE_ID == _row.AUTHORIZED_BY)[0].NAME; 
        }
        _row.TIME = moment(_row.TIME, "HH:mm");
        if (_row.IS_DELETED == 0 || _row.IS_DELETED == false) {
            if (!isNaN(parseFloat(_row.AMOUNT))) {
                $scope.COMP_TOTAL += parseFloat(_row.AMOUNT);
            }
        }
    }
    $scope.nginit_voids = function (_row) {
        if ($scope.AUTHORIZER_LIST.filter(a => a.TABLE_ID == _row.AUTHORIZED_BY)[0] != null && $scope.AUTHORIZER_LIST.filter(a => a.TABLE_ID == _row.AUTHORIZED_BY)[0] != undefined) {
            _row.AUTHORIZED_BY_NAME = $scope.AUTHORIZER_LIST.filter(a => a.TABLE_ID == _row.AUTHORIZED_BY)[0].NAME;
        }
        //_row.AUTHORIZED_BY_NAME = $scope.AUTHORIZER_LIST.filter(a => a.TABLE_ID == _row.AUTHORIZED_BY)[0].NAME;
        if (_row.IS_DELETED == 0 || _row.IS_DELETED == false) {
            if (!isNaN(parseFloat(_row.AMOUNT))) {
                $scope.VOID_TOTAL += parseFloat(_row.AMOUNT);
            }
        }
    }
    $scope.CALCULATE_TOTAL = function (flag) {
        var compTotal = 0;
        var voidTotal = 0;
        if (flag == 1) {
            angular.forEach($scope.COMP_ENTRY_LIST, function (_row) {
                if (_row.IS_DELETED == 0 || _row.IS_DELETED == false) {
                    if (!isNaN(parseFloat(_row.AMOUNT))) {
                        compTotal += parseFloat(_row.AMOUNT);
                    }
                }
            });
            $scope.COMP_TOTAL = compTotal;
        }
        else if (flag == 2) {
            angular.forEach($scope.VOID_ENTRY_LIST, function (_row) {
                if (_row.IS_DELETED == 0 || _row.IS_DELETED == false) {
                    if (!isNaN(parseFloat(_row.AMOUNT))) {
                        voidTotal += parseFloat(_row.AMOUNT);
                    }
                }
            });
            $scope.VOID_TOTAL = voidTotal;
        }
    }
    $scope.ADD_ROW = function (flag) {
        var ROW = new Object();
        ROW.ID = 0;
        ROW.ENTRY_TYPE_ID = flag==1?6:(flag==2?7:0);
        ROW.ENTRY_TYPE_DETAIL_ID = null;
        ROW.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        ROW.BRANCH_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID;
        ROW.CASHUP_HEADER_ID = $scope.CASHUP_HEADER_ID;
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
        ROW.IS_CANCELLED = null;
        ROW.DEPOSIT_CANCELLATION_FEE = null;
        ROW.TOTAL_AMT = null;
        ROW.UPLOAD_IDS = null;
        ROW.FILE_NAME = null;
        ROW.REMAINING_VALUE = null;
        ROW.REDEEMED_BY = null;
        if (flag == 1) {
            $scope.COMP_ENTRY_LIST.push(ROW);
        }
        else if (flag == 2) {
            $scope.VOID_ENTRY_LIST.push(ROW);
        }
    }
    $scope.ADD_NEW_ROW_COMP = function () {
        if ($scope.COMP_ENTRY_LIST.length == 0) {
            $scope.ADD_ROW(1);
        }
        else {
            $scope.ADD_NEW_COMP_ROW_FLAG = true;
            $scope.INS_ENTRY_COMP_DECLARATION(0);
        }
    }
    $scope.ADD_NEW_ROW_VOID = function () {
        if ($scope.VOID_ENTRY_LIST.length == 0) {
            $scope.ADD_ROW(2);
        }
        else {
            $scope.ADD_NEW_VOID_ROW_FLAG = true;
            $scope.INS_ENTRY_VOID_DECLARATION(0);
        }
    }
    $scope.SAVE_DATA = function (isDraft,isPrevious) {
        $scope.INS_ENTRY_COMP_DECLARATION(isDraft);
        $scope.INS_ENTRY_VOID_DECLARATION(isDraft);
        if (isDraft == 1) {
            $scope.Fn_Cashup_entry_TAB_CLICK($scope.TAB_ID, 1);
        }
        if (isPrevious == 1) {
            $scope.Fn_Cashup_entry_TAB_CLICK($scope.TAB_ID, 0);
        }
    }
    $scope.DELETE_ROW = function(_row, _flag){
        if (confirm('Are you sure you want to proceed?')) {
            if (_flag == 1) {
                if (_row.ID == 0) {
                    let index = $scope.COMP_ENTRY_LIST.indexOf(_row);
                    if (index !== -1) {
                        $scope.COMP_ENTRY_LIST.splice(index, 1);
                    }
                }
                else {
                    _row.IS_DELETED = 1;
                    $scope.INS_ENTRY_COMP_DECLARATION(0);
                }
            }
            else if (_flag == 2) {
                if (_row.ID == 0) {
                    let index = $scope.VOID_ENTRY_LIST.indexOf(_row);
                    if (index !== -1) {
                        $scope.VOID_ENTRY_LIST.splice(index, 1);
                    }
                }
                else {
                    _row.IS_DELETED = 1;
                    $scope.INS_ENTRY_VOID_DECLARATION(0);
                }
            }

        }
    }
    $scope.RESET_ON_MODAL_CLOSE = function () {
        
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
    $scope.PREVIOUS = function () {
        if ($scope.$parent.CASHUP_ENTRY_SEARCH.IS_DATA_ENTRY_ENABLED == true) {
            $scope.SAVE_DATA(0, 1);
        }
        else {
            $scope.Fn_Cashup_entry_TAB_CLICK($scope.TAB_ID, 0);
        }
    }

    $scope.CONTINUE = function () {
        if ($scope.$parent.CASHUP_ENTRY_SEARCH.IS_DATA_ENTRY_ENABLED == true) {
            $scope.CompEntryForm.submitted = true;
            $scope.VoidEntryForm.submitted = true;
            if ($scope.CompEntryForm.$valid && $scope.VoidEntryForm.$valid) {
                if (!isNaN((parseFloat($scope.CASHUP_INFO.ACTUAL) - parseFloat($scope.CASHUP_INFO.EPOS)) + (parseFloat($scope.VOID_TOTAL) - parseFloat($scope.CASHUP_INFO_VOID.EPOS)))) {
                    if (parseFloat($scope.CASHUP_INFO.ACTUAL) - parseFloat($scope.CASHUP_INFO.EPOS) != 0) {
                        var myModal = new bootstrap.Modal(document.getElementById('proceed'), {
                            keyboard: false  // Optional: Close modal when pressing ESC
                        });
                        // Show the modal
                        myModal.show();
                    }
                    else {
                        $scope.INS_ENTRY_COMP_DECLARATION(1);
                        $scope.INS_ENTRY_VOID_DECLARATION(1);
                        $scope.Fn_Cashup_entry_TAB_CLICK($scope.TAB_ID, 1);
                    }
                }
                else {
                    $scope.INS_ENTRY_COMP_DECLARATION(1);
                    $scope.INS_ENTRY_VOID_DECLARATION(1);
                    $scope.Fn_Cashup_entry_TAB_CLICK($scope.TAB_ID, 1);
                }
            }
        }
        else {
            $scope.Fn_Cashup_entry_TAB_CLICK($scope.TAB_ID, 1);
        }
    }
    $scope.INS_ENTRY_COMP_DECLARATION = function (isDraft) {
        $scope.CompEntryForm.submitted = true;
        if ($scope.CompEntryForm.$valid) {
            $scope.CALCULATE_TOTAL(1)
            var CashupAppModelObj = new Object();
            CashupAppModelObj.CASHUP_HEADER_ID = $scope.CASHUP_HEADER_ID;
            CashupAppModelObj.ENTITY_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.ENTITY_ID;
            CashupAppModelObj.BRANCH_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID;
            CashupAppModelObj.COMP_TOTAL = $scope.COMP_TOTAL;
            CashupAppModelObj.USER_ID = parseInt($cookies.get("USERID"));
            CashupAppModelObj.IS_DRAFT = isDraft;
            CashupAppModelObj.STEP_NO = 10;
            var declaration_list = [];
            angular.forEach($scope.COMP_ENTRY_LIST, function (_row) {
                var declaration = new Object();
                declaration.TABLE_ID = _row.ID;
                declaration.ENTRY_TYPE_ID = _row.ENTRY_TYPE_ID;
                declaration.ENTRY_TYPE_DETAIL_ID = null;
                declaration.VOUCHER_TYPE = _row.TABLE_NUMBER;
                declaration.CODE = _row.NO_OF_COVERS;
                declaration.VALUE = parseFloat(_row.AMOUNT).toFixed(5);
                declaration.VALIDITY_DATE = null;
                declaration.CUSTOMER_NAME = _row.REASON_OF_COMP;
                declaration.MODE = _row.TIME.isValid()?moment(_row.TIME).format('HH:mm'):null;
                declaration.CHECK_NO = _row.COMP_CHECK_NO;
                declaration.NOTE = _row.NOTE;
                declaration.IS_REDEEMED = null;
                declaration.AUTHORIZED_BY_ID = _row.AUTHORIZED_BY;
                declaration.DISCOUNT = parseFloat(_row.AMOUNT).toFixed(5);
                declaration.FOOD = null;
                declaration.DRINKS = null;
                declaration.LIGHT_SPEED_ACCOUNTFISCID = null;
                declaration.IS_DELETED = _row.IS_DELETED;
                declaration.PAYMENT_METHOD_ID = null;
                declaration.DEPOSIT_CANCELLATION_FEE = null;
                declaration.IS_CANCELLED = null;
                declaration.TOTAL_AMT = 0;//parseFloat(_row.AMOUNT).toFixed(5);
                declaration.UPLOAD_IDS = _row.UPLOAD_IDS;
                declaration.REDEEMED_BY = null;
                declaration.IS_EXTERNAL_RECORD = 0;
                declaration_list.push(declaration);
            });
            CashupAppModelObj.ENTRY_DECLERATION_TYPE = declaration_list;
            PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'INS_ENTRY_COMP_DECLARATION').then(function (data) {
                if (isDraft != 1) {
                    $scope.CompEntryForm.submitted = false;
                    $scope.COMP_TOTAL = 0;
                    $scope.GET_ENTRY_TYPE_DECLARATION(1);
                }
                $scope.GET_CASHUP_ENTRY_HEADER($scope.CASHUP_HEADER_ID);
            });
        }
    }
    
    $scope.INS_ENTRY_VOID_DECLARATION = function (isDraft) {
        $scope.VoidEntryForm.submitted = true;
        if ($scope.VoidEntryForm.$valid) {
            $scope.CALCULATE_TOTAL(2)
            var CashupAppModelObj = new Object();
            CashupAppModelObj.CASHUP_HEADER_ID = $scope.CASHUP_HEADER_ID;
            CashupAppModelObj.ENTITY_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.ENTITY_ID;
            CashupAppModelObj.BRANCH_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID;
            CashupAppModelObj.USER_ID = parseInt($cookies.get("USERID"));
            CashupAppModelObj.VOID_TOTAL = $scope.VOID_TOTAL;
            CashupAppModelObj.IS_DRAFT = isDraft;
            CashupAppModelObj.STEP_NO = 10;
            var declaration_list = [];
            angular.forEach($scope.VOID_ENTRY_LIST, function (_row) {
                var declaration = new Object();
                declaration.TABLE_ID = _row.ID;
                declaration.ENTRY_TYPE_ID = _row.ENTRY_TYPE_ID;
                declaration.ENTRY_TYPE_DETAIL_ID = null;
                declaration.VOUCHER_TYPE = null;
                declaration.CODE = _row.VOID_TYPE;
                declaration.VALUE = parseFloat(_row.AMOUNT).toFixed(5);
                declaration.VALIDITY_DATE = null;
                declaration.CUSTOMER_NAME = null;
                declaration.MODE = null;
                declaration.CHECK_NO = _row.VOID_CHECK_NO;
                declaration.NOTE = null;
                declaration.IS_REDEEMED = null;
                declaration.AUTHORIZED_BY_ID = _row.AUTHORIZED_BY;
                declaration.DISCOUNT = null;
                declaration.FOOD = null;
                declaration.DRINKS = null;
                declaration.LIGHT_SPEED_ACCOUNTFISCID = null;
                declaration.IS_DELETED = _row.IS_DELETED;
                declaration.PAYMENT_METHOD_ID = null;
                declaration.DEPOSIT_CANCELLATION_FEE = null;
                declaration.IS_CANCELLED = null;
                declaration.TOTAL_AMT = parseFloat(_row.AMOUNT).toFixed(5);
                declaration.UPLOAD_IDS = _row.UPLOAD_IDS;
                declaration.REDEEMED_BY = null;
                declaration.IS_EXTERNAL_RECORD = 0;
                declaration_list.push(declaration);
            });
            CashupAppModelObj.ENTRY_DECLERATION_TYPE = declaration_list;
            PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'INS_ENTRY_VOID_DECLARATION').then(function (data) {
                if (isDraft != 1) {
                    $scope.VoidEntryForm.submitted = false;
                    $scope.VOID_TOTAL = 0;
                    $scope.GET_ENTRY_TYPE_DECLARATION(2);
                }
                $scope.GET_CASHUP_ENTRY_HEADER($scope.CASHUP_HEADER_ID);
            });
        }
    }

    $scope.INS_UPD_CASHUP_HEADER_NOTES = function (COMMENT) {
        if (($scope.CASHUP_ENTRY_NOTE != null && $scope.CASHUP_ENTRY_NOTE != undefined && $scope.CASHUP_ENTRY_NOTE != "") || (COMMENT != null && COMMENT != undefined && COMMENT != "")) {
            var CashupModelObj = new Object();
            CashupModelObj.NOTE_TYPE_ID = 5;
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
    };
    $scope.$on('$destroy', function () {
        $('.modal.show').modal('hide');
        $('.dropdown-menu').hide();
    });
});