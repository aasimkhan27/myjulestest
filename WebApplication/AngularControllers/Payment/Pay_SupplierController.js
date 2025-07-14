app.controller('Pay_ContactController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.COMMON_CODE_CHANGE();
    $scope.SchedularViewSearch = {
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        BANK_PAGE_NO: 10,
        ACTIVE: 1,
        BRANCH_LOGIN_ID: parseInt($cookies.get("BRANCH_ID")),
        BANK_BRANCH_ID: 0,
    };
    $scope.LAZY_GET_PYMNT_SUPPLIERS = function () {
        $scope.GET_PYMNT_SUPPLIERS();
    };
    $scope.TAB_CLICK_Fn = function (TAB_FLAG) {
        $scope.TAB_FLAG = TAB_FLAG;
    }
    $scope.TAB_CLICK_Fn(1);

    $scope.LAZY_GET_PYMNT_SUPPLIERS = function () {
        $scope.GET_PYMNT_SUPPLIERS();
    }
    $scope.GET_PYMNT_SUPPLIERS = function (FLAG) {
        var PaymentModelObj = new Object();
        if (FLAG == 1) {
            $scope.PYMNT_SUPPLIERS_LIST = [];
            $scope.SchedularViewSearch.PAGE_NO = 1;
        }
        PaymentModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PaymentModelObj.BRANCH_ID = $scope.SchedularViewSearch.BRANCH_ID;
        PaymentModelObj.PAGE_NO = $scope.SchedularViewSearch.PAGE_NO;
        PaymentModelObj.PAGE_SIZE = $scope.SchedularViewSearch.PAGE_SIZE;
        PaymentModelObj.SUPPLIER_NAME = $scope.SchedularViewSearch.SUPPLIER_NAME == undefined ? null : $scope.SchedularViewSearch.SUPPLIER_NAME;
        PaymentModelObj.TAG_NAME = $scope.SchedularViewSearch.TAG_NAME;
        PaymentModelObj.FLAG = 1;//=1 -- 1 SUPPLIER 2 CUSTOMER 0 ALL
        PrcCommMethods.ADMIN_API(PaymentModelObj, 'GET_PYMNT_SUPPLIERS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.PYMNT_SUPPLIERS_LIST = $scope.PYMNT_SUPPLIERS_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.SchedularViewSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.SchedularViewSearch.PAGE_NO = parseInt($scope.SchedularViewSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            } else {
                $scope.GetData = false;
            }
            $scope.$parent.overlay_loadingNew = 'none';
        })
    }
    $scope.PYMNT_DEFAULT_BANK_LIST = [];
    $scope.GET_PYMNT_SUPPLIERS(1);
    $scope.GET_PYMNT_BANK_LIST = function () {
        var PaymentModelObj = new Object();
        PaymentModelObj.DEFAULT = -1//--- 0 for default 0 records,1 for all default records, -1 for all records 
        PrcCommMethods.PAYMENT_API(PaymentModelObj, 'GET_PYMNT_BANK_LIST').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.PYMNT_BANK_LIST = data.data.Table;
                $scope.PYMNT_DEFAULT_BANK_LIST = data.data.Table.filter(function (x) { return x.DEFAULT==true});
            }
            if (data.data == null) {
                $scope.$parent.ShowAlert("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
        });
    }

    $scope.GET_PYMNT_BANK_LIST();

    $scope.POP_EDIT_BANK_MAPPING_Fn = function (_bank) {
        $('#Add_iBAN').modal('show');
        $scope.SchedularViewSearch.ENTITY_BANK_MAPPING_ID = _bank.ENTITY_BANK_MAPPING_ID;
        $scope.SchedularViewSearch.BRANCH_LOGIN_ID = _bank.BRANCH_ID;
        $scope.SchedularViewSearch.ENTITY_BANK_ID = _bank.BANK_ID;
        $scope.SchedularViewSearch.ACCOUNT_NO = _bank.ACCOUNT_NO;
        $scope.SchedularViewSearch.BANK_CUSTOMER_ID = _bank.BANK_CUSTOMER_ID;
        $scope.SchedularViewSearch.ENTITY_BANK_MAPPING_ID = _bank.ENTITY_BANK_MAPPING_ID;

    }
    $scope.LAZY_GET_PYMNT_ENTITY_BANK_MAPPING = function () {
        $scope.GET_PYMNT_ENTITY_BANK_MAPPING();
    };

    $scope.GET_PYMNT_ENTITY_BANK_MAPPING = function (FLAG) {
        var PaymentModelObj = new Object();
        if (FLAG == 1) {
            $scope.PYMNT_ENTITY_BANK_MAPPING_LIST = [];
            $scope.SchedularViewSearch.PAGE_NO = 1;
        }
        PaymentModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PaymentModelObj.BRANCH_ID = $scope.SchedularViewSearch.BANK_BRANCH_ID;
        PaymentModelObj.PAGE_NO = $scope.SchedularViewSearch.BANK_PAGE_NO;
        PaymentModelObj.PAGE_SIZE = $scope.SchedularViewSearch.PAGE_SIZE;
        PrcCommMethods.PAYMENT_API(PaymentModelObj, 'GET_PYMNT_ENTITY_BANK_MAPPING').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.PYMNT_ENTITY_BANK_MAPPING_LIST = $scope.PYMNT_ENTITY_BANK_MAPPING_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.SchedularViewSearch.PAGE_SIZE) {
                    $scope.BankGetData = false;
                }
                else {
                    $scope.SchedularViewSearch.BANK_PAGE_NO = parseInt($scope.SchedularViewSearch.BANK_PAGE_NO) + 1;
                    $scope.BankGetData = true;
                }
            } else {
                $scope.BankGetData = false;
            }
            $scope.$parent.overlay_loadingNew = 'none';
        });
    }
    $scope.GET_PYMNT_ENTITY_BANK_MAPPING(1);
    $scope.SUPPLIER_BANK_MAP_Fn = function (_supplier, _cancel_flag) {
        if (_supplier.IS_EDIT_MODE) {
            _supplier.submitted = true;
            if (_supplier.BANK_ID == '' || _supplier.BANK_ID == null || _supplier.CONTACT_BANK_SWIFT_CODE == '' || _supplier.CONTACT_BANK_SWIFT_CODE == null
                || _supplier.CONTACT_BANK_NAME == '' || _supplier.CONTACT_BANK_NAME == null || _supplier.CONTACT_BANK_NAME == undefined
            ) {

            }
            else {
                var PaymentModelObj = new Object();
                PaymentModelObj.XERO_CONTACTS_ID = _supplier.ID;
                PaymentModelObj.BANK_ID = _supplier.BANK_ID;
                PaymentModelObj.CONTACT_BANK_NAME = _supplier.CONTACT_BANK_NAME;
                PaymentModelObj.CONTACT_BANK_SWIFT_CODE = _supplier.CONTACT_BANK_SWIFT_CODE;
                PaymentModelObj.SUPPLIER_NAME = _supplier.SUPPLIER_NAME;
                PrcCommMethods.PAYMENT_API(PaymentModelObj, 'UPD_PYMNT_SUPPLIERS').then(function (data) {
                    if (data.data == 1) {
                        $scope.$parent.ShowAlert("Success", 'Updated Successfully', 3000);
                        _supplier.IS_EDIT_MODE = !_supplier.IS_EDIT_MODE;
                        _supplier.submitted = false;
                        $scope.GET_PYMNT_SUPPLIERS(1);

                    }
                    if (data.data == 0) {
                        $scope.$parent.ShowAlert("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                    }
                });
            }
        }
        else {
            _supplier.IS_EDIT_MODE = !_supplier.IS_EDIT_MODE;
            _supplier.submitted = false;
        }
    }

    $scope.RESET_ENTITY_BANK_MAP_Fn = function () {
        $scope.SchedularViewSearch.ENTITY_BANK_MAPPING_ID = "";
        $scope.SchedularViewSearch.ENTITY_BANK_ID = null;
        $scope.SchedularViewSearch.ACCOUNT_NO = "";
        $scope.SchedularViewSearch.BANK_CUSTOMER_ID = "";
        $scope.FormEntityBankMap.submitted = false;
    }
    $scope.INS_UPD_PYMNT_BANK_LIST = function () {
        $scope.BANKFORM.submitted = true;
        if ($scope.BANKFORM.$valid) {
            var PaymentModelObj = new Object();
            PaymentModelObj.BANK_ID = $scope.SchedularViewSearch.BANK_ID;
            PaymentModelObj.BANK_NAME = $scope.SchedularViewSearch.BANK_NAME;
            PaymentModelObj.ACTIVE = 1;
            PaymentModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.PAYMENT_API(PaymentModelObj, 'INS_UPD_PYMNT_BANK_LIST').then(function (data) {
                if (data.data == 1) {
                    $scope.$parent.ShowAlert("Success", 'Bank added Successfully', 3000);
                    $('#Add_Bank').modal('hide');
                    $scope.SchedularViewSearch.BANK_ID = "";
                    $scope.SchedularViewSearch.BANK_NAME = "";
                    $scope.GET_PYMNT_BANK_LIST();

                }
                if (data.data == 0) {
                    $scope.$parent.ShowAlert("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                }
            });
        }
    }
    $scope.INS_UPD_PYMNT_ENTITY_BANK_MAPPING = function () {
        $scope.FormEntityBankMap.submitted = true;
        if ($scope.FormEntityBankMap.$valid) {
            var PaymentModelObj = new Object();
            PaymentModelObj.ENTITY_BANK_MAPPING_ID = $scope.SchedularViewSearch.ENTITY_BANK_MAPPING_ID;
            PaymentModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            PaymentModelObj.BRANCH_ID = $scope.SchedularViewSearch.BRANCH_LOGIN_ID;
            PaymentModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
            PaymentModelObj.BANK_ID = $scope.SchedularViewSearch.ENTITY_BANK_ID;
            PaymentModelObj.ACCOUNT_NO = $scope.SchedularViewSearch.ACCOUNT_NO;
            PaymentModelObj.BANK_CUSTOMER_ID = $scope.SchedularViewSearch.BANK_CUSTOMER_ID;
            PaymentModelObj.ACTIVE = 1;
            PaymentModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.PAYMENT_API(PaymentModelObj, 'INS_UPD_PYMNT_ENTITY_BANK_MAPPING').then(function (data) {
                if (data.data == 1) {
                    if ($scope.SchedularViewSearch.ENTITY_BANK_MAPPING_ID > 0) {
                        $scope.$parent.ShowAlert("Success", 'Updated Successfully', 3000);
                    }
                    else {
                        $scope.$parent.ShowAlert("Success", 'Saved Successfully', 3000);
                    }
                    $scope.GET_PYMNT_ENTITY_BANK_MAPPING(1);
                    $scope.RESET_ENTITY_BANK_MAP_Fn();
                    $('#Add_iBAN').modal('hide');

                }
                if (data.data == 0) {
                    $scope.$parent.ShowAlert("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                }
            });
        }
    }
});