app.controller('AccountCustomerController', function ($scope, $http, $interval, CommService, $cookies, $filter, PrcCommMethods, $location, readFileData, readFileDataNew, $sce) {
    $scope.$parent.CASHUP.KeyColor = "AccountCustomer";

    $scope.$parent.CASHUP.ID = getUrlParameter('CHID', $location.absUrl());
    if ($scope.$parent.CASHUP.ACTUAL_STEP_NO <= 7) {
        $scope.$parent.CASHUP.ACTUAL_STEP_NO = 7;
    }
    $scope.TabValid = true;
    $scope.$parent.overlay_loadingNew = 'block';
    $scope.AccCustomerList = [];
    $scope.SELECTED_CREDIT_RECEIPTS = [];
    $scope.AddAccCustFlag = false;

    $scope.BlankAccCustomer = {
        CUSTOMER_ID: null, PAYMENT_METHOD_ID: 4, ID: 0, CASHUP_HEADER_ID: 0, CUSTOMER_NAME: '', COMPANY: '',
        CHECK_NO: '', NAME: '', ACCOUNT: '', AMOUNT: '', MODE: null, NOTE: '', ACTIVE: false,
        CREATED_BY: 0, CREATED_DATE: null, MODIFIED_BY: null, MODIFIED_DATE: null,
        IS_DELETED: 0, RESTRICT_DELETE: 0, CUSTOMER_NAME_VALID: true, AMOUNT_VALID: true, CHECK_NO_VALID: true, IS_REDEEMED: false, PARENT_ID: null, TOTAL_AMT: null, UPLOAD_IDS: '', FILE_NAME:''
    };
    $scope.BlankAccCustomerRedmeed = {
        CUSTOMER_ID: null, PAYMENT_METHOD_ID: null, ID: 0, CASHUP_HEADER_ID: 0, CUSTOMER_NAME: '', COMPANY: '',
        CHECK_NO: '', NAME: '', ACCOUNT: '', AMOUNT: '', MODE: null, NOTE: '', ACTIVE: false,
        CREATED_BY: 0, CREATED_DATE: null, MODIFIED_BY: null, MODIFIED_DATE: null,
        IS_DELETED: 0, RESTRICT_DELETE: 0, CUSTOMER_NAME_VALID: true, AMOUNT_VALID: true, AMOUNT_RECEIVED: '', CHECK_NO_VALID: true, IS_REDEEMED: true, PARENT_ID: null, AMOUNT_RECEIVED: '', TOTAL_AMT: null, UPLOAD_IDS: '', FILE_NAME: ''
    };
    $scope.AddCustomerLine = function () {
         
        $scope.$parent.CASHUP.ACCOUNT_CREDIT_VALID = true;
        if ($scope.VALIDATED()) {
            $scope.AddAccCustFlag = true;
            $scope.INS_ACC_CUST_DECLARATION();
            $scope.AccCustomerList.push(angular.copy($scope.BlankAccCustomer));
        }
    };
    $scope.AddCustomerRedmeed = function () {
         
        $scope.CLICK_SUBMITTED = true;
        $scope.$parent.CASHUP.ACCOUNT_CREDIT_VALID = true;
        if ($scope.VALIDATED()) {
            $scope.AddAccCustFlag = true;
            $scope.INS_ACC_CUST_DECLARATION();
             
            //$scope.SELECTED_CREDIT_RECEIPTS.push(($scope.BlankAccCustomerRedmeed));
        }
    };
    //$scope.updateSelection = function (position, OPEN_ACC_CUST_DECLARATION) {         
    //    angular.forEach(OPEN_ACC_CUST_DECLARATION, function (subscription, index) {
    //        if (position != index)
    //            subscription.IS_SELECTED = false;
    //    });
    //}
    //GET_ACC_CUST_DECLARATION();
    //function GET_ACC_CUST_DECLARATION() {
    $scope.GET_ACC_CUST_DECLARATION = function () {
        var CashupModelObj = new Object();
        CashupModelObj.ID = $scope.$parent.CASHUP.ID;
        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_ACC_CUST_DECLARATION').then(function (data) {
             
            $scope.AccCustomerList = [];
            $scope.SELECTED_CREDIT_RECEIPTS = [];
            if (data != undefined && data.data != undefined && data.data.length > 0 && ($scope.$parent.CASHUP.ACCOUNT_CREDIT_VALID == undefined || $scope.$parent.CASHUP.ACCOUNT_CREDIT_VALID == true)) {
                //if (data != undefined && data.data != undefined && data.data.length > 0 ) {
                angular.forEach(data.data, function (val) {
                    if (val.IS_REDEEMED == false) {
                        val.CUSTOMER_NAME_VALID = true;
                        val.AMOUNT_VALID = true;
                        val.CHECK_NO_VALID = true;                        
                        $scope.AccCustomerList.push(val);
                    }
                })

                //$scope.AccCustomerList = data.data.filter(function (x) { x.CUSTOMER_NAME_VALID = true; x.AMOUNT_VALID; x.CHECK_NO_VALID = true; x.IS_REDEEMED = false; return x.PARENT_ID == 0 || x.PARENT_ID == null });
                angular.forEach(data.data, function (val) {
                    if (val.IS_REDEEMED == true) {
                        val.CUSTOMER_NAME_VALID = true;
                        val.AMOUNT_VALID = true;
                        val.CHECK_NO_VALID = true;
                        val.PAYMENT_METHOD_ID_VALID = true;
                        val.PAYMENT_METHOD_ID == 4 ? val.PAYMENT_METHOD_ID = null : val.PAYMENT_METHOD_ID;
                        $scope.SELECTED_CREDIT_RECEIPTS.push(val);
                    }
                })
                //if (!$scope.$parent.CASHUP.ACCOUNT_CREDIT_VALID) {
                //    angular.forEach()
                //}
                //$scope.SELECTED_CREDIT_RECEIPTS = data.data.filter(function (x) {
                //   // x.CUSTOM_AMOUNT = x.AMOUNT;
                //    x.PAYMENT_METHOD_ID == 4 ? x.PAYMENT_METHOD_ID = null : x.PAYMENT_METHOD_ID;
                //   // return x.PARENT_ID > 0;
                //});
            }
            else {
                if ($scope.$parent.CASHUP.TAB_CLICK == true) {
                    if ($scope.$parent.CASHUP.ACC_CUSTOMER_LIST != undefined && $scope.$parent.CASHUP.ACC_CUSTOMER_LIST.length > 0) {
                        $scope.CLICK_SUBMITTED = true;
                        $scope.AccCustomerList = $scope.$parent.CASHUP.ACC_CUSTOMER_LIST;
                        $scope.VALIDATED();
                    }
                    if ($scope.$parent.CASHUP.ACC_CUSTOMER_RED_LIST != undefined && $scope.$parent.CASHUP.ACC_CUSTOMER_RED_LIST.length > 0) {
                        $scope.CLICK_SUBMITTED = true;
                        $scope.SELECTED_CREDIT_RECEIPTS = $scope.$parent.CASHUP.ACC_CUSTOMER_RED_LIST;
                        $scope.VALIDATED();
                    }
                    $scope.GET_CASHUP_BY_ID();
                }
                else {
                    $scope.$parent.CASHUP.ACC_CUSTOMER_LIST = [];
                    $scope.$parent.CASHUP.SELECTED_CREDIT_RECEIPTS = [];
                    $scope.AccCustomerList.push(angular.copy($scope.BlankAccCustomer));
                    $scope.SELECTED_CREDIT_RECEIPTS.push($scope.BlankAccCustomerRedmeed);
                    //$scope.SELECTED_CREDIT_RECEIPTS.push(angular.copy($scope.BlankAccCustomerRedmeed))
                }
            }
            $scope.$parent.overlay_loadingNew = 'none';
            $scope.GET_OPEN_ACC_CUST_DECLARATION(1);
            var PCASHCOUNT = 0; var ACCREDCOUNT = 0;
            angular.forEach($scope.AccCustomerList, function (PCash) {
                PCash.ID == 0 ? PCASHCOUNT++ : '';
            });
            angular.forEach($scope.SELECTED_CREDIT_RECEIPTS, function (RCash) {
                RCash.ID == 0 ? ACCREDCOUNT++ : '';
            });
            $scope.BlankAccCustomerRedmeed = {
                CUSTOMER_ID: null, PAYMENT_METHOD_ID: null, ID: 0, CASHUP_HEADER_ID: 0,
                CHECK_NO: '', NAME: '', ACCOUNT: '', AMOUNT: '', MODE: null, NOTE: '', ACTIVE: false,
                CREATED_BY: 0, CREATED_DATE: null, MODIFIED_BY: null, MODIFIED_DATE: null,
                IS_DELETED: 0, RESTRICT_DELETE: 0, CUSTOMER_NAME_VALID: true, AMOUNT_VALID: true, CHECK_NO_VALID: true, IS_REDEEMED: true, PARENT_ID: null, AMOUNT_RECEIVED: '', TOTAL_AMT: null, UPLOAD_IDS: '', FILE_NAME: ''
            };
            PCASHCOUNT == 0 ? $scope.AccCustomerList.push(angular.copy($scope.BlankAccCustomer)) : '';
            ACCREDCOUNT == 0 ? $scope.SELECTED_CREDIT_RECEIPTS.push($scope.BlankAccCustomerRedmeed) : '';
          
        });
    }
    $scope.GET_ACC_CUST_DECLARATION();
    $scope.DeleteLine = function (Array, index, Cust) {
         
        if (Cust.ID == undefined || Cust.ID == 0) {
            if (Cust.CUSTOMER_NAME != '' || Cust.COMPANY != '' || Cust.AMOUNT != '' || Cust.CHECK_NO != '' || Cust.NOTE != '') {
                if (confirm("Are you sure, You want to delete the record ?")) {
                    $scope.AccCustomerList.splice(index, 1);
                    $scope.AccCustomerList.push(angular.copy($scope.BlankAccCustomer));
                    if (index == 0) {
                        //$scope.AccCustomerList.push(angular.copy($scope.BlankAccCustomer));
                        $scope.CLICK_SUBMITTED = false;
                    }
                }
            }
        }
        else {
            if (confirm("Are you sure, You want to delete the record ?")) {
                if (index == 0) {
                    $scope.AddAccCustFlag = true;
                }
                $scope.$parent.CASHUP.TAB_CLICK = false;
                Cust.IS_DELETED = 1;

                $scope.DELETED_INS_ACC_CUST_DECLARATION(1, index, Cust);
                //var Count = Array.length;
                //var Cnt = 0;
                //angular.forEach(Array, function (item) {
                //    if (item.IS_DELETED == 1) {
                //        Cnt = Cnt + 1;
                //    }
                //})
            }
        }
        $scope.COMMON_CODE_CHANGE();

        $scope.$parent.CASHUP.ACCOUNT_CREDIT_VALID = true;
        //if (Cust.ID == undefined || Cust.ID == 0) {
        //    if (Array.length == 1) {
        //        Cust.IS_DELETED = 1;
        //        alert("Are you sure, You want to delete the record ?");
        //        $scope.AccCustomerList.push(angular.copy($scope.BlankAccCustomer));
        //    } else {
        //        //Array.splice(index, 1);
        //        for (var i = 0; i < $scope.AccCustomerList.length; i++) {
        //            if ($scope.AccCustomerList[i].ID == 0) {
        //                $scope.AccCustomerList.splice(i, 1);
        //            }
        //        }
        //        var len = 0;
        //        angular.forEach($scope.AccCustomerList, function (item) {
        //            if (item.IS_DELETED == 0) {
        //                len = len + 1;
        //            }
        //        })
        //        if (len == 0) {
        //            $scope.AccCustomerList.push(angular.copy($scope.BlankAccCustomer));
        //        }
        //    }
        //}
        //else {
        //    Cust.IS_DELETED = 1;
        //    var Count = Array.length;
        //    var Cnt = 0;
        //    angular.forEach(Array, function (item) {
        //        if (item.IS_DELETED == 1) {
        //            Cnt = Cnt + 1;
        //        }
        //    })
        //    if (Count == Cnt) {
        //        alert("Are you sure, You want to delete the record?");
        //        $scope.AccCustomerList.push(angular.copy($scope.BlankAccCustomer));
        //    }
        //}
    };

    $scope.DELETE_ACCOUNT_RECEIVED_LINE = function (Array, index, Cust) {
         
        if (Cust.ID == undefined || Cust.ID == 0) {
            if ((Cust.CUSTOMER_NAME != '')  || Cust.PAYMENT_METHOD_ID != null || Cust.AMOUNT != ''  || Cust.CHECK_NO != '' || Cust.NOTE != '') {

                if (confirm("Are you sure, You want to delete the record ?")) {
                    $scope.SELECTED_CREDIT_RECEIPTS.splice(index, 1);
                    $scope.BlankAccCustomerRedmeed = {
                        CUSTOMER_ID: null, PAYMENT_METHOD_ID: null, ID: 0, CASHUP_HEADER_ID: 0, CUSTOMER_NAME: '', COMPANY: '',
                        CHECK_NO: '', NAME: '', ACCOUNT: '', AMOUNT: '', MODE: null, NOTE: '', ACTIVE: false,
                        CREATED_BY: 0, CREATED_DATE: null, MODIFIED_BY: null, MODIFIED_DATE: null,
                        IS_DELETED: 0, RESTRICT_DELETE: 0, CUSTOMER_NAME_VALID: true, AMOUNT_VALID: true, CHECK_NO_VALID: true, IS_REDEEMED: true, PARENT_ID: null, AMOUNT_RECEIVED: '', TOTAL_AMT: null, UPLOAD_IDS: '', FILE_NAME: ''
                    };
                    $scope.SELECTED_CREDIT_RECEIPTS.push($scope.BlankAccCustomerRedmeed);
                    if (index == 0) {
                        //if ($scope.SELECTED_CREDIT_RECEIPTS.length == 0) {
                        //    //$scope.SELECTED_CREDIT_RECEIPTS = [];
                        //    $scope.BlankAccCustomerRedmeed = {
                        //        CUSTOMER_ID: null, PAYMENT_METHOD_ID: null, ID: 0, CASHUP_HEADER_ID: 0, CUSTOMER_NAME: '', COMPANY: '',
                        //        CHECK_NO: '', NAME: '', ACCOUNT: '', AMOUNT: '', MODE: null, NOTE: '', ACTIVE: false,
                        //        CREATED_BY: 0, CREATED_DATE: null, MODIFIED_BY: null, MODIFIED_DATE: null,
                        //        IS_DELETED: 0, RESTRICT_DELETE: 0, CUSTOMER_NAME_VALID: true, AMOUNT_VALID: true, CHECK_NO_VALID: true, IS_REDEEMED: true, PARENT_ID: null, AMOUNT_RECEIVED: '', TOTAL_AMT: null, UPLOAD_IDS: '', FILE_NAME: ''
                        //    };
                        //    $scope.SELECTED_CREDIT_RECEIPTS.push($scope.BlankAccCustomerRedmeed);
                        //}
                        //$scope.CLICK_SUBMITTED = false;
                        $scope.CLICK_SUBMITTED = false;
                    }
                    //$scope.CLICK_SUBMITTED = false;
                }
            }
        }
        else {
            if (confirm("Are you sure, You want to delete the record ?")) {
                if (index == 0) {
                    $scope.AddAccCustFlag = true;
                }
                $scope.$parent.CASHUP.TAB_CLICK = false;
                Cust.IS_DELETED = 1;

                $scope.DELETED_INS_ACC_CUST_DECLARATION(2, index, Cust);
                //var Count = Array.length;
                //var Cnt = 0;
                //angular.forEach(Array, function (item) {
                //    if (item.IS_DELETED == 1) {
                //        Cnt = Cnt + 1;
                //    }
                //})
            }
        }
        //if (Cust.ID == undefined || Cust.ID == 0) {
        //    $scope.SELECTED_CREDIT_RECEIPTS.splice(index, 1);
        //}
        //else {
        //    $scope.$parent.CASHUP.TAB_CLICK = false;
        //    $scope.AddAccCustFlag = true;
        //    Cust.IS_DELETED = 1;
        //    $scope.INS_ACC_CUST_DECLARATION();
        //}
        $scope.COMMON_CODE_CHANGE();
        $scope.$parent.CASHUP.ACCOUNT_CREDIT_VALID = true;
    };
    //$scope.SetValues = function (Cust) {

    //Cust.CUSTOMER_NAME = "";
    //Cust.CUSTOMER_ID = null;
    //var CustLth = $scope.ACCOUNT_CUSTOMER_CUSTOMERS.filter(function (x) { return x.NAME == Cust.CUSTOMER_NAME });
    //if (CustLth.length > 0) {
    //    Cust.CUSTOMER_NAME = CustLth.NAME;
    //    Cust.CUSTOMER_ID = CustLth.NAME;
    //}
    //}
    //$scope.DeleteLine = function (Array, index, IS_REDEEMED, ENTRY_TYPE_ID) {
    //    if (Array.length == 1) {
    //        alert("Are you sure, You want to delete the record ?");
    //        $scope.AccCustomerList = [];
    //        $scope.AccCustomerList.push(angular.copy($scope.BlankAccCustomer));         
    //    } else {
    //        if (ENTRY_TYPE_ID == undefined) {
    //            Array.splice(index, 1);
    //        }
    //        else {
    //          Array = Array.filter(function (x) { return x.IS_REDEEMED == IS_REDEEMED && x.ENTRY_TYPE_ID == ENTRY_TYPE_ID }).splice(index, 1);
    //        }
    //    }
    //    //if (ENTRY_TYPE_ID == undefined) {
    //    //    Array.splice(index, 1);
    //    //}
    //    //else {
    //    //    Array = Array.filter(function (x) { return x.IS_REDEEMED == IS_REDEEMED && x.ENTRY_TYPE_ID == ENTRY_TYPE_ID }).splice(index, 1);
    //    //}
    //};

    $scope.VALIDATED = function () {

        $scope.$parent.CASHUP.ACCOUNT_CREDIT_VALID = true;
        var Linecount = 0, count = 0;
        angular.forEach($scope.AccCustomerList, function (Ac, index) {
            if (Ac.IS_DELETED == 0) {
                Ac.CUSTOMER_NAME_VALID = true;
                Ac.AMOUNT_VALID = true;

                Ac.CHECK_NO_VALID = true;
                if ($scope.AccCustomerList.length - 1 == index) {
                    count = 0;
                    Ac.CUSTOMER_NAME_VALID = true;
                    Ac.AMOUNT_VALID = true;

                    Ac.CHECK_NO_VALID = true;
                    if (Ac.CUSTOMER_NAME != null && Ac.CUSTOMER_NAME != undefined && Ac.CUSTOMER_NAME != "") {
                        count++;
                        Ac.CUSTOMER_NAME_VALID = true;
                    }
                    else {
                        Ac.CUSTOMER_NAME_VALID = false;
                    }

                    if (Ac.AMOUNT != null && Ac.AMOUNT != undefined && Ac.AMOUNT != "") {
                        count++;
                        Ac.AMOUNT_VALID = true;
                    }
                    else {
                        Ac.AMOUNT_VALID = false;
                    }

                    if (Ac.CHECK_NO != null && Ac.CHECK_NO != undefined && Ac.CHECK_NO != "") {
                        count++;
                        Ac.CHECK_NO_VALID = true;
                    }
                    else {
                        Ac.CHECK_NO_VALID = false;
                    }
                    if (count == 0) {
                        Ac.CUSTOMER_NAME_VALID = true;
                        Ac.AMOUNT_VALID = true;

                        Ac.CHECK_NO_VALID = true;
                    }
                }
                else {
                    if (Ac.CUSTOMER_NAME == null || Ac.CUSTOMER_NAME == undefined || Ac.CUSTOMER_NAME == "") {
                        Ac.CUSTOMER_NAME_VALID = false;
                        Linecount++;
                    }
                    if (Ac.AMOUNT == null || Ac.AMOUNT == undefined || Ac.AMOUNT == "") {
                        Linecount++;
                        Ac.AMOUNT_VALID = false;
                    }

                    if (Ac.CHECK_NO == null || Ac.CHECK_NO == undefined || Ac.CHECK_NO == "") {
                        Linecount++;
                        Ac.CHECK_NO_VALID = false;
                    }
                }
            }
        });
        if (Linecount > 0 || (count != 3 && count != 0)) {

            $scope.$parent.CASHUP.ACCOUNT_CREDIT_VALID = false;
            $scope.$parent.CASHUP.ACC_CUSTOMER_LIST = $scope.AccCustomerList;

        }
        var Linecount1 = 0, count1 = 0;
        angular.forEach($scope.SELECTED_CREDIT_RECEIPTS, function (Sc, index) {
            if (Sc.IS_DELETED == 0) {
                Sc.CUSTOMER_NAME_VALID = true;
                Sc.AMOUNT_VALID = true;
                Sc.CHECK_NO_VALID = true;
                Sc.PAYMENT_METHOD_ID_VALID = true;

                if ($scope.SELECTED_CREDIT_RECEIPTS.length - 1 == index) {
                    count1 = 0;
                    Sc.CUSTOMER_NAME_VALID = true;
                    Sc.AMOUNT_VALID = true;
                    Sc.CHECK_NO_VALID = true;
                    Sc.PAYMENT_METHOD_ID_VALID = true;

                    if (Sc.CUSTOMER_NAME != null && Sc.CUSTOMER_NAME != undefined && Sc.CUSTOMER_NAME != "") {
                        count1++;
                        Sc.CUSTOMER_NAME_VALID = true;
                    }
                    else {
                        Sc.CUSTOMER_NAME_VALID = false;
                    }

                    if (Sc.AMOUNT != null && Sc.AMOUNT != undefined && Sc.AMOUNT != "") {
                        count1++;
                        Sc.AMOUNT_VALID = true;
                    }
                    else {
                        Sc.AMOUNT_VALID = false;
                    }

                    if (Sc.CHECK_NO != null && Sc.CHECK_NO != undefined && Sc.CHECK_NO != "") {
                        count1++;
                        Sc.CHECK_NO_VALID = true;
                    }
                    else {
                        Sc.CHECK_NO_VALID = false;
                    }
                    if (Sc.PAYMENT_METHOD_ID != null && Sc.PAYMENT_METHOD_ID != undefined && Sc.PAYMENT_METHOD_ID != "") {
                        count1++;
                        Sc.PAYMENT_METHOD_ID_VALID = true;
                    }
                    else {
                        Sc.PAYMENT_METHOD_ID_VALID = false;
                    }
                    if (count1 == 0) {
                        Sc.CUSTOMER_NAME_VALID = true;
                        Sc.AMOUNT_VALID = true;
                        Sc.CHECK_NO_VALID = true;
                        Sc.PAYMENT_METHOD_ID_VALID = true;
                    }
                }
                else {
                    if (Sc.CUSTOMER_NAME == null || Sc.CUSTOMER_NAME == undefined || Sc.CUSTOMER_NAME == "") {
                        Sc.CUSTOMER_NAME_VALID = false;
                        Linecount1++;
                    }
                    if (Sc.AMOUNT == null || Sc.AMOUNT == undefined || Sc.AMOUNT == "") {
                        Linecount1++;
                        Sc.AMOUNT_VALID = false;
                    }

                    if (Sc.CHECK_NO == null || Sc.CHECK_NO == undefined || Sc.CHECK_NO == "") {
                        Linecount1++;
                        Sc.CHECK_NO_VALID = false;
                    }
                    if (Sc.PAYMENT_METHOD_ID == null || Sc.PAYMENT_METHOD_ID == undefined || Sc.PAYMENT_METHOD_ID == "") {
                        Linecount1++;
                        Sc.PAYMENT_METHOD_ID_VALID = false;
                    }
                }
            }
        });

        if (Linecount1 > 0 || (count1 != 4 && count1 != 0)) {
            $scope.$parent.CASHUP.ACCOUNT_CREDIT_VALID = false;
            $scope.$parent.CASHUP.ACC_CUSTOMER_RED_LIST = $scope.SELECTED_CREDIT_RECEIPTS;
            // $scope.$parent.CASHUP.SELECTED_CREDIT_RECEIPTS = $scope.SELECTED_CREDIT_RECEIPTS;
        }
        return $scope.$parent.CASHUP.ACCOUNT_CREDIT_VALID;
    }

    $scope.DELETED_INS_ACC_CUST_DECLARATION = function (FLAG, index, LINE) {

        var CashupModelObj = new Object();
        CashupModelObj.ID = $scope.$parent.CASHUP.ID;
        CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CashupModelObj.BRANCH_ID = $scope.$parent.CASHUP.BRANCH_ID;
        CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
        CashupModelObj.STEP_NO = 7;
        CashupModelObj.DECLARATION_DETAILS = [];
        var VAR_ACCOUNT_TOTAL = 0;

        if (FLAG == 1) {
        angular.forEach($scope.AccCustomerList, function (ACC_CUSTOMER) {
            if (ACC_CUSTOMER.IS_DELETED == 0 && ACC_CUSTOMER.AMOUNT != "") {
                // ACC_CUSTOMER.AMOUNT = ACC_CUSTOMER.AMOUNT == "" ? 0 : ACC_CUSTOMER.AMOUNT;
                VAR_ACCOUNT_TOTAL = parseFloat(VAR_ACCOUNT_TOTAL) + parseFloat(ACC_CUSTOMER.AMOUNT);
            }
            if (ACC_CUSTOMER.AMOUNT != '' && ACC_CUSTOMER.AMOUNT != 0 && ACC_CUSTOMER.IS_DELETED == 1) {
                var RObj = new Object();
                RObj.TABLE_ID = ACC_CUSTOMER.ID == undefined ? 0 : ACC_CUSTOMER.ID;
                RObj.CHECK_NO = ACC_CUSTOMER.CHECK_NO;
                var CustomerSearch = $scope.ACCOUNT_CUSTOMER_CUSTOMERS.filter(function (x) { return x.NAME == ACC_CUSTOMER.CUSTOMER_NAME })
                if (CustomerSearch.length > 0) {
                    RObj.CUSTOMER_NAME = null;// CustomerSearch[0].NAME;
                    RObj.CUSTOMER_ID = CustomerSearch[0].ID;
                }
                else {
                    RObj.CUSTOMER_NAME = ACC_CUSTOMER.CUSTOMER_NAME;
                    RObj.CUSTOMER_ID = null;
                }
                RObj.COMPANY = ACC_CUSTOMER.COMPANY == undefined || ACC_CUSTOMER.COMPANY == null ? '' : ACC_CUSTOMER.COMPANY;
                RObj.BRANCH_CURRENCY_AMOUNT = parseFloat(ACC_CUSTOMER.AMOUNT).toFixed($scope.$parent.TO_NUMBER_DECIMAL_FIVE);
                RObj.PAYMENT_METHOD_ID = ACC_CUSTOMER.PAYMENT_METHOD_ID;
                RObj.PAYMENT_METHOD_NAME = ACC_CUSTOMER.PAYMENT_METHOD_NAME == undefined ? '' : ACC_CUSTOMER.PAYMENT_METHOD_NAME;
                RObj.NOTE = ACC_CUSTOMER.NOTE == undefined || ACC_CUSTOMER.NOTE == null ? '' : ACC_CUSTOMER.NOTE;
                RObj.PARENT_ID = null //ACC_CUSTOMER.PARENT_ID == undefined ? '' : ACC_CUSTOMER.PARENT_ID;;
                RObj.ACTIVE = 1;
                RObj.IS_DELETED = 1;
                RObj.IS_REDEEMED = 0;
                RObj.TOTAL_AMT = ACC_CUSTOMER.TOTAL_AMT;
                RObj.UPLOAD_IDS = (ACC_CUSTOMER.UPLOAD_IDS == undefined && ACC_CUSTOMER.UPLOAD_IDS == '') ? null : ACC_CUSTOMER.UPLOAD_IDS;
                CashupModelObj.DECLARATION_DETAILS.push(RObj);
            }
        });

         } else if (FLAG==2) {
        var VAR_ACCOUNT_RECEIVED_TOTAL = 0;
        angular.forEach($scope.SELECTED_CREDIT_RECEIPTS, function (ACC_CUSTOMER) {
            if (ACC_CUSTOMER.AMOUNT != '' && ACC_CUSTOMER.AMOUNT != 0 && ACC_CUSTOMER.PAYMENT_METHOD_ID != null) {
                if (ACC_CUSTOMER.IS_DELETED == 0) {
                    VAR_ACCOUNT_RECEIVED_TOTAL = parseFloat(VAR_ACCOUNT_RECEIVED_TOTAL) + parseFloat(ACC_CUSTOMER.AMOUNT);
                }
                if (ACC_CUSTOMER.IS_DELETED == 1) {
                    var RObj = new Object();
                    RObj.TABLE_ID = (ACC_CUSTOMER.ID == undefined || ACC_CUSTOMER.ID == 0) ? 0 : ACC_CUSTOMER.ID;
                    RObj.CHECK_NO = ACC_CUSTOMER.CHECK_NO;
                    var CustomerSearch = $scope.ACCOUNT_CUSTOMER_CUSTOMERS.filter(function (x) { return x.NAME == ACC_CUSTOMER.CUSTOMER_NAME })
                    if (CustomerSearch.length > 0) {
                        RObj.CUSTOMER_NAME = null;// CustomerSearch[0].NAME;
                        RObj.CUSTOMER_ID = CustomerSearch[0].ID;
                    }
                    else {
                        RObj.CUSTOMER_NAME = ACC_CUSTOMER.CUSTOMER_NAME;
                        RObj.CUSTOMER_ID = null;
                    }
                    //RObj.CUSTOMER_NAME = ACC_CUSTOMER.CUSTOMER_NAME == undefined ? '' : ACC_CUSTOMER.CUSTOMER_NAME;
                    // RObj.CUSTOMER_ID = ACC_CUSTOMER.CUSTOMER_ID;
                    RObj.COMPANY = ACC_CUSTOMER.COMPANY == undefined || ACC_CUSTOMER.COMPANY == null ? '' : ACC_CUSTOMER.COMPANY;
                    RObj.BRANCH_CURRENCY_AMOUNT = parseFloat(ACC_CUSTOMER.AMOUNT).toFixed($scope.$parent.TO_NUMBER_DECIMAL_FIVE);
                    var PaymentSearch = $scope.PAYMENT_METHODS_RECEIVED.filter(function (x) { return x.PAYMENT_METHOD_ID == ACC_CUSTOMER.PAYMENT_METHOD_ID })
                    if (PaymentSearch.length > 0) {
                        RObj.PAYMENT_METHOD_ID = ACC_CUSTOMER.PAYMENT_METHOD_ID;
                        RObj.PAYMENT_METHOD_NAME = PaymentSearch[0].METHOD_NAME;
                    } else {
                        RObj.PAYMENT_METHOD_ID = ACC_CUSTOMER.PAYMENT_METHOD_ID;
                        RObj.PAYMENT_METHOD_NAME = '';
                    }
                    //RObj.PAYMENT_METHOD_ID = ACC_CUSTOMER.PAYMENT_METHOD_ID;
                    //RObj.PAYMENT_METHOD_NAME = ACC_CUSTOMER.PAYMENT_METHOD_NAME == undefined ? '' : ACC_CUSTOMER.PAYMENT_METHOD_NAME;
                    RObj.NOTE = ACC_CUSTOMER.NOTE == undefined || ACC_CUSTOMER.NOTE == null ? '' : ACC_CUSTOMER.NOTE;
                    RObj.PARENT_ID = ACC_CUSTOMER.PARENT_ID == undefined ? null : ACC_CUSTOMER.PARENT_ID;
                    RObj.ACTIVE = 1;
                    RObj.IS_DELETED = 1;
                    RObj.IS_REDEEMED = 1;
                    RObj.TOTAL_AMT = ACC_CUSTOMER.TOTAL_AMT;
                    RObj.UPLOAD_IDS = (ACC_CUSTOMER.UPLOAD_IDS == undefined && ACC_CUSTOMER.UPLOAD_IDS == '') ? null : ACC_CUSTOMER.UPLOAD_IDS;
                    CashupModelObj.DECLARATION_DETAILS.push(RObj);
                }
            }
        });

        }
        CashupModelObj.ACCOUNT_RECEIVED_TOTAL = parseFloat(VAR_ACCOUNT_RECEIVED_TOTAL).toFixed($scope.$parent.TO_NUMBER_DECIMAL_FIVE);
        CashupModelObj.ACCOUNT_TOTAL = parseFloat(VAR_ACCOUNT_TOTAL).toFixed($scope.$parent.TO_NUMBER_DECIMAL_FIVE);
        $scope.$parent.CASHUP.ACCOUNT_TOTAL = parseFloat(CashupModelObj.ACCOUNT_TOTAL);
        $scope.$parent.CASHUP.ACCOUNT_RECEIVED_TOTAL = parseFloat(CashupModelObj.ACCOUNT_RECEIVED_TOTAL);
        PrcCommMethods.CASHUP_API(CashupModelObj, 'INS_ACC_CUST_DECLARATION').then(function (data) {
            if (FLAG == 1) {
                $scope.AccCustomerList.splice(index, 1);
                $scope.$parent.CASHUP.ACC_CUSTOMER_LIST = [];
                $scope.$parent.CASHUP.ACC_CUSTOMER_LIST = $scope.AccCustomerList
                if ($scope.AccCustomerList.length == 0) {
                    $scope.AccCustomerList.push(angular.copy($scope.BlankAccCustomer));
                }
            } else if (FLAG == 2) {
                $scope.SELECTED_CREDIT_RECEIPTS.splice(index, 1);
                $scope.$parent.CASHUP.ACC_CUSTOMER_RED_LIST = [];
                $scope.$parent.CASHUP.ACC_CUSTOMER_RED_LIST = $scope.SELECTED_CREDIT_RECEIPTS;
                if ($scope.SELECTED_CREDIT_RECEIPTS.length == 0) {
                    $scope.SELECTED_CREDIT_RECEIPTS.push(angular.copy($scope.BlankAccCustomerRedmeed));
                }
            }
            $scope.TabValid = true;
            $scope.GET_ACC_CUST_DECLARATION();
        });

    }
    //}

    $scope.INS_ACC_CUST_DECLARATION = function (FLAG) {
         
        if ($scope.VALIDATED()) {

           $scope.CLICK_SUBMITTED = false;

        var CashupModelObj = new Object();
        CashupModelObj.ID = $scope.$parent.CASHUP.ID;
        CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CashupModelObj.BRANCH_ID = $scope.$parent.CASHUP.BRANCH_ID;
        CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));

        CashupModelObj.STEP_NO = 7;
        CashupModelObj.DECLARATION_DETAILS = [];
            var VAR_ACCOUNT_TOTAL = 0;
            angular.forEach($scope.AccCustomerList, function (x) {
                if (x.UploadedFiles != undefined && x.UploadedFiles.length > 0) {
                    angular.forEach(x.UploadedFiles, function (y, index) {
                        if (index == 0) {
                            x.UPLOAD_IDS = y.ID.toString();
                        } else {
                            x.UPLOAD_IDS += ',' + y.ID.toString();
                        }

                        //x.UPLOAD_IDS += y.ID.toString() + ",";
                        // x.FILE_NAME += y.FILE_PATH + ":;:" + y.SERVER_FILE_NAME + ":;:" + y.ORIGINAL_FILE_NAME + ",";
                    })
                }
                else {
                    x.UPLOAD_IDS = "";
                    x.FILE_NAME = "";
                    x.UploadedFiles = [];
                }
            });
        angular.forEach($scope.AccCustomerList, function (ACC_CUSTOMER) {
            if (ACC_CUSTOMER.AMOUNT != '' && ACC_CUSTOMER.AMOUNT != 0) {
                var RObj = new Object();
                RObj.TABLE_ID = ACC_CUSTOMER.ID == undefined ? 0 : ACC_CUSTOMER.ID;
                RObj.CHECK_NO = ACC_CUSTOMER.CHECK_NO;
                var CustomerSearch = $scope.ACCOUNT_CUSTOMER_CUSTOMERS.filter(function (x) { return x.NAME == ACC_CUSTOMER.CUSTOMER_NAME })
                if (CustomerSearch.length > 0) {
                    RObj.CUSTOMER_NAME = null;// CustomerSearch[0].NAME;
                    RObj.CUSTOMER_ID = CustomerSearch[0].ID;
                }
                else {
                    RObj.CUSTOMER_NAME = ACC_CUSTOMER.CUSTOMER_NAME;
                    RObj.CUSTOMER_ID = null;
                }
                RObj.COMPANY = ACC_CUSTOMER.COMPANY == undefined || ACC_CUSTOMER.COMPANY == null ? '' : ACC_CUSTOMER.COMPANY;

                //RObj.AMOUNT = parseFloat(ACC_CUSTOMER.AMOUNT).toFixed($scope.$parent.TO_NUMBER_DECIMAL_FIVE) - parseFloat(ACC_CUSTOMER.RECEVIED_AMOUNT).toFixed($scope.$parent.TO_NUMBER_DECIMAL_FIVE);
                RObj.BRANCH_CURRENCY_AMOUNT = parseFloat(ACC_CUSTOMER.AMOUNT).toFixed($scope.$parent.TO_NUMBER_DECIMAL_FIVE);
                RObj.PAYMENT_METHOD_ID = ACC_CUSTOMER.PAYMENT_METHOD_ID;
                RObj.PAYMENT_METHOD_NAME = ACC_CUSTOMER.PAYMENT_METHOD_NAME == undefined ? '' : ACC_CUSTOMER.PAYMENT_METHOD_NAME;
                RObj.NOTE = ACC_CUSTOMER.NOTE == undefined || ACC_CUSTOMER.NOTE == null ? '' : ACC_CUSTOMER.NOTE;
                RObj.PARENT_ID = null //ACC_CUSTOMER.PARENT_ID == undefined ? '' : ACC_CUSTOMER.PARENT_ID;;
                RObj.ACTIVE = 1;
                RObj.IS_DELETED = ACC_CUSTOMER.IS_DELETED ? 1 : 0;
                RObj.IS_REDEEMED = 0;
                if (RObj.IS_DELETED == 0) {
                    VAR_ACCOUNT_TOTAL = parseFloat(VAR_ACCOUNT_TOTAL) + parseFloat(ACC_CUSTOMER.AMOUNT);
                }
                RObj.TOTAL_AMT = ACC_CUSTOMER.TOTAL_AMT;
                RObj.UPLOAD_IDS = (ACC_CUSTOMER.UPLOAD_IDS == undefined && ACC_CUSTOMER.UPLOAD_IDS == '') ? null : ACC_CUSTOMER.UPLOAD_IDS;
                CashupModelObj.DECLARATION_DETAILS.push(RObj);
            }
        });

            var VAR_ACCOUNT_RECEIVED_TOTAL = 0;
            angular.forEach($scope.SELECTED_CREDIT_RECEIPTS, function (x) {
                if (x.UploadedFiles != undefined && x.UploadedFiles.length > 0) {
                    angular.forEach(x.UploadedFiles, function (y, index) {
                        if (index == 0) {
                            x.UPLOAD_IDS = y.ID.toString();
                        } else {
                            x.UPLOAD_IDS += ',' + y.ID.toString();
                        }

                        //x.UPLOAD_IDS += y.ID.toString() + ",";
                        // x.FILE_NAME += y.FILE_PATH + ":;:" + y.SERVER_FILE_NAME + ":;:" + y.ORIGINAL_FILE_NAME + ",";
                    })
                }
                else {
                    x.UPLOAD_IDS = "";
                    x.FILE_NAME = "";
                    x.UploadedFiles = [];
                }
            });
        angular.forEach($scope.SELECTED_CREDIT_RECEIPTS, function (ACC_CUSTOMER) {
            if (ACC_CUSTOMER.AMOUNT != '' && ACC_CUSTOMER.AMOUNT != 0) {

                var RObj = new Object();
                //if (ACC_CUSTOMER.CASHUP_HEADER_ID!=0)
                RObj.TABLE_ID = (ACC_CUSTOMER.ID == undefined || ACC_CUSTOMER.ID == 0) ? 0 : ACC_CUSTOMER.ID;
                RObj.CHECK_NO = ACC_CUSTOMER.CHECK_NO;
                var CustomerSearch = $scope.ACCOUNT_CUSTOMER_CUSTOMERS.filter(function (x) { return x.NAME == ACC_CUSTOMER.CUSTOMER_NAME })
                if (CustomerSearch.length > 0) {
                    RObj.CUSTOMER_NAME = null;// CustomerSearch[0].NAME;
                    RObj.CUSTOMER_ID = CustomerSearch[0].ID;
                }
                else {
                    RObj.CUSTOMER_NAME = ACC_CUSTOMER.CUSTOMER_NAME;
                    RObj.CUSTOMER_ID = null;
                }
                //RObj.CUSTOMER_NAME = ACC_CUSTOMER.CUSTOMER_NAME == undefined ? '' : ACC_CUSTOMER.CUSTOMER_NAME;
                // RObj.CUSTOMER_ID = ACC_CUSTOMER.CUSTOMER_ID;
                RObj.COMPANY = ACC_CUSTOMER.COMPANY == undefined || ACC_CUSTOMER.COMPANY == null ? '' : ACC_CUSTOMER.COMPANY;
                RObj.BRANCH_CURRENCY_AMOUNT = parseFloat(ACC_CUSTOMER.AMOUNT).toFixed($scope.$parent.TO_NUMBER_DECIMAL_FIVE);
                //if (ACC_CUSTOMER.AMOUNT_RECEIVED != '' && ACC_CUSTOMER.AMOUNT_RECEIVED != 0) {
                //    RObj.AMOUNT = (parseFloat(ACC_CUSTOMER.AMOUNT) - parseFloat(ACC_CUSTOMER.AMOUNT_RECEIVED)).toFixed($scope.$parent.TO_NUMBER_DECIMAL_FIVE);
                //} else {
                //    RObj.AMOUNT = parseFloat(ACC_CUSTOMER.AMOUNT).toFixed($scope.$parent.TO_NUMBER_DECIMAL_FIVE);
                //}

                var PaymentSearch = $scope.PAYMENT_METHODS_RECEIVED.filter(function (x) { return x.PAYMENT_METHOD_ID == ACC_CUSTOMER.PAYMENT_METHOD_ID })
                if (PaymentSearch.length > 0) {
                    RObj.PAYMENT_METHOD_ID = ACC_CUSTOMER.PAYMENT_METHOD_ID;
                    RObj.PAYMENT_METHOD_NAME = PaymentSearch[0].METHOD_NAME;
                } else {
                    RObj.PAYMENT_METHOD_ID = ACC_CUSTOMER.PAYMENT_METHOD_ID;
                    RObj.PAYMENT_METHOD_NAME = '';
                }
                //RObj.PAYMENT_METHOD_ID = ACC_CUSTOMER.PAYMENT_METHOD_ID;
                //RObj.PAYMENT_METHOD_NAME = ACC_CUSTOMER.PAYMENT_METHOD_NAME == undefined ? '' : ACC_CUSTOMER.PAYMENT_METHOD_NAME;
                RObj.NOTE = ACC_CUSTOMER.NOTE == undefined || ACC_CUSTOMER.NOTE == null ? '' : ACC_CUSTOMER.NOTE;
                RObj.PARENT_ID = ACC_CUSTOMER.PARENT_ID == undefined ? null : ACC_CUSTOMER.PARENT_ID;
                RObj.ACTIVE = 1;

                RObj.IS_DELETED = ACC_CUSTOMER.IS_DELETED ? 1 : 0;
                RObj.IS_REDEEMED = 1;
                //if (ACC_CUSTOMER.CUSTOM_AMOUNT == 0) {
                //    RObj.IS_REDEEMED = 1;
                //} else {
                //    RObj.IS_REDEEMED = 0;
                //}
                if (RObj.IS_DELETED == 0) {
                    VAR_ACCOUNT_RECEIVED_TOTAL = parseFloat(VAR_ACCOUNT_RECEIVED_TOTAL) + parseFloat(ACC_CUSTOMER.AMOUNT);
                    //if (VAR_ACCOUNT_RECEIVED_TOTAL == 0) {
                    //    RObj.IS_REDEEMED = 1;
                    //} 
                    //VAR_ACCOUNT_RECEIVED_TOTAL = parseFloat(VAR_ACCOUNT_RECEIVED_TOTAL) + (parseFloat(ACC_CUSTOMER.AMOUNT) - parseFloat(ACC_CUSTOMER.AMOUNT_RECEIVED != '' && ACC_CUSTOMER.AMOUNT_RECEIVED != 0 ? ACC_CUSTOMER.AMOUNT_RECEIVED:0 ));
                }
                RObj.TOTAL_AMT = ACC_CUSTOMER.PARENT_ID == null || ACC_CUSTOMER.PARENT_ID == 0 ? RObj.BRANCH_CURRENCY_AMOUNT : ACC_CUSTOMER.TOTAL_AMT;
                RObj.UPLOAD_IDS = (ACC_CUSTOMER.UPLOAD_IDS == undefined && ACC_CUSTOMER.UPLOAD_IDS == '') ? null : ACC_CUSTOMER.UPLOAD_IDS;
                CashupModelObj.DECLARATION_DETAILS.push(RObj);
            }
        });

        CashupModelObj.ACCOUNT_RECEIVED_TOTAL = parseFloat(VAR_ACCOUNT_RECEIVED_TOTAL).toFixed($scope.$parent.TO_NUMBER_DECIMAL_FIVE);
        CashupModelObj.ACCOUNT_TOTAL = parseFloat(VAR_ACCOUNT_TOTAL).toFixed($scope.$parent.TO_NUMBER_DECIMAL_FIVE);

        $scope.$parent.CASHUP.ACCOUNT_TOTAL = parseFloat(CashupModelObj.ACCOUNT_TOTAL);
        $scope.$parent.CASHUP.ACCOUNT_RECEIVED_TOTAL = parseFloat(CashupModelObj.ACCOUNT_RECEIVED_TOTAL);
        //acc_arr.filter(function (x) {
        //    if (x.AMOUNT > 0 || x.AMOUNT == 0 || x.AMOUNT < 0) {
        //        x.AMOUNT = '' + x.AMOUNT;
        //    }
        //});
           

           PrcCommMethods.CASHUP_API(CashupModelObj, 'INS_ACC_CUST_DECLARATION').then(function (data) {
                
            if (FLAG == 2) {

                $scope.$parent.CASHUP.ACC_CUSTOMER_LIST = [];
                //$scope.$parent.CASHUP.SELECTED_CREDIT_RECEIPTS = [];
                $scope.$parent.CASHUP.ACC_CUSTOMER_RED_LIST = [];
            }
            if ($scope.AddAccCustFlag) {
                if ($scope.CASHUP.KeyColor == "AccountCustomer") {
                    $scope.GET_ACC_CUST_DECLARATION();
                }
            }
            if (FLAG == 1) {
                $scope.GET_ACC_CUST_DECLARATION();
                $('#Account_Received').modal('show');
                //$scope.GET_OPEN_ACC_CUST_DECLARATION(1);
            }
               $scope.TabValid = true;
           
        });
          }
    };
    $scope.SET_RECIVED_AMOUNT = function (CR) {

        if (CR.RECEVIED_AMOUNT > CR.AMOUNT) {
            alert("Amount is greater then Recived Amount");
            CR.RECEVIED_AMOUNT = null;
        }

    }

    $scope.SetValues_Account = function (ACT, IndexVal) {
         

        $scope.CHK_LAST_VALUE = 0;
        angular.forEach($scope.OPEN_ACC_CUST_DECLARATION, function (value) {

            if (value.CUSTOMER_NAME.toUpperCase() == ACT.CUSTOMER_NAME.toUpperCase()) {
                ACT.TOTAL_AMT = value.AMOUNT;
                ACT.AMOUNT = value.REMAINING_AMOUNT;
                ACT.COMPANY = value.COMPANY;
              //  ACT.MODE = null;
                ACT.PAYMENT_METHOD_ID = value.PAYMENT_METHOD_ID == 4 ? value.PAYMENT_METHOD_ID = null : value.PAYMENT_METHOD_ID;;
                ACT.CHECK_NO = value.CHECK_NO;
                ACT.ENTRY_TYPE_DETAIL_ID = value.ID;
                ACT.NOTE = value.NOTE;
                ACT.IS_REDEEMED = value.IS_REDEEMED;
                ACT.ID = 0;
                ACT.PARENT_ID = value.ID;    
                ACT.UPLOAD_IDS = value.UPLOAD_IDS;
                ACT.FILE_NAME = value.FILE_NAME;
                ACT.UPL_FLAG = false;
                //ACT.TOTAL_AMT = value.AMOUNT;
                //ACT.AMOUNT = value.REMAINING_AMOUNT;
                //ACT.PAYMENT_METHOD_ID == 4 ? ACT.PAYMENT_METHOD_ID = null : ACT.PAYMENT_METHOD_ID;
                //   Selectedrow.push(varCr);
                //$scope.SELECTED_CREDIT_RECEIPTS.push(value);
                $scope.CHK_LAST_VALUE = value.REMAINING_AMOUNT;
            }
        });
    };
    $scope.InsertAcc_CustDeclarationOld = function () {
        var CashupModelObj = new Object();
        CashupModelObj.ID = $scope.$parent.CASHUP.ID;
        CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CashupModelObj.BRANCH_ID = $scope.$parent.CASHUP.BRANCH_ID;
        CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
        CashupModelObj.ACCOUNT_TOTAL = $scope.$parent.CASHUP.ACCOUNT_TOTAL;
        CashupModelObj.STEP_NO = 7;
        var cnt = 0;
        var acc_arr = [];

        angular.forEach($scope.AccCustomerList, function (AccCustomer) {
            if (AccCustomer.AMOUNT != '' && AccCustomer.AMOUNT != 0) {
                acc_arr[cnt] = AccCustomer;
                cnt++;
            }
        });

        acc_arr.filter(function (x) {
            if (x.AMOUNT > 0 || x.AMOUNT == 0 || x.AMOUNT < 0) {
                x.AMOUNT = '' + x.AMOUNT;
            }
        });

        CashupModelObj.DECLARATION_DETAILS = acc_arr;//$scope.AccCustomerList;//angular.copy($filter('filter')($scope.AccCustomerList, { ID: '!0' }));

        PrcCommMethods.CASHUP_API(CashupModelObj, 'INS_ACC_CUST_DECLARATION').then(function (data) {
            if ($scope.AddAccCustFlag) {
                $scope.GET_ACC_CUST_DECLARATION();
            }

        });
    };
    $scope.CustomerSearch = {
        CUSTOMER_NAME: '',
        EMAIL: '',
        PHONE: '',
        PAGE_NO: 1,
        PAGE_SIZE: 10,
    }
    $scope.RESET_CUSTOMER = function () {
        $scope.CustomerSearch = {
            CUSTOMER_NAME: '',
            EMAIL: '',
            PHONE: '',
            PAGE_NO: 1,
            PAGE_SIZE: 10,
        }
        $scope.CustomerForm.submitted = false;
    }
    $scope.INS_UPD_ACCOUNT_CUSTOMER_CUSTOMERS = function () {

        $scope.CustomerForm.submitted = true;
        if ($scope.CustomerForm.$valid) {
            var CashupModelObj = new Object();
            CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            CashupModelObj.BRANCH_ID = $scope.$parent.CASHUP.BRANCH_ID;
            CashupModelObj.CUSTOMER_ID = 0
            CashupModelObj.CUSTOMER_NAME = $scope.CustomerSearch.CUSTOMER_NAME;
            CashupModelObj.EMAIL = $scope.CustomerSearch.EMAIL;
            CashupModelObj.PHONE = $scope.CustomerSearch.PHONE;
            PrcCommMethods.CASHUP_API(CashupModelObj, 'INS_UPD_ACCOUNT_CUSTOMER_CUSTOMERS').then(function (data) {
                if (data.data == 0) {
                    $scope.$parent.ShowAlert('Error', $scope.$parent.SOMETHINGWENTWRONG, 5000);
                }
                if (data.data == 1) {
                    $scope.$parent.ShowAlert('Success', 'Save Successfully', 5000);
                    $scope.GET_ACCOUNT_CUSTOMER_CUSTOMERS();
                    $scope.RESET_CUSTOMER();
                }
            });
        }
    }
    $scope.PAYMENT_METHODS = [];
    $scope.ACCOUNT_CUSTOMER_CUSTOMERS = [];
    $scope.GET_PAYMENT_METHODS = function () {
        var CashupModelObj = new Object();
        CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CashupModelObj.TYPE_ID = 1;  ///-- 1 FOR ACCOUNT CUSTOMER 2 FOR VOUCHER AND 3 FOR DEPOSIT
        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_PAYMENT_METHODS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.PAYMENT_METHODS = data.data.Table.filter(function (x) { return x.FLAG == 1 || x.FLAG == 3 });
                $scope.PAYMENT_METHODS_RECEIVED = data.data.Table.filter(function (x) { return x.FLAG == 2 || x.FLAG == 3 });
            }
            else {
                $scope.PAYMENT_METHODS = [];
            }
        });
    }
    $scope.POP_RECEIVED_CREDITS = function () {
         
        $scope.CLICK_SUBMITTED = true;
        if ($scope.VALIDATED()) {
            $scope.AddAccCustFlag = true;
            $scope.INS_ACC_CUST_DECLARATION(1);
        }
    }
    $scope.RESET_CUSTOMER_SEARCH_RECEIVED_CREDITS = function () {
        $scope.CustomerSearch.FILTER_CUSTOMER_NAME = "";
        $scope.CustomerSearch.FILTER_INVOICE_NUMBER = "";
        $scope.GET_OPEN_ACC_CUST_DECLARATION(1);
    }
    $scope.CUSTOMER_SEARCH_RECEIVED_CREDITS = function () {
        $scope.GET_OPEN_ACC_CUST_DECLARATION(1);
    }
    $scope.SELECTED_CREDIT_RECEIPTS = [];
    $scope.POP_CLICK_CREDIT_RECEIPTS = function () {
         
       
        $scope.AddAccCustFlag = false;
        $scope.$parent.CASHUP.TAB_CLICK = false;
        $scope.CLICK_SUBMITTED = false;
        var CashupModelObj = new Object();
        CashupModelObj.ID = $scope.$parent.CASHUP.ID;
        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_ACC_CUST_DECLARATION').then(function (data) {

            $scope.SELECTED_CREDIT_RECEIPTS = [];
            if (data != undefined && data.data != undefined && data.data.length > 0 && ($scope.$parent.CASHUP.ACCOUNT_CREDIT_VALID == undefined || $scope.$parent.CASHUP.ACCOUNT_CREDIT_VALID == true)) {
                angular.forEach(data.data, function (val) {
                    if (val.IS_REDEEMED == true) {
                        val.PAYMENT_METHOD_ID == 4 ? val.PAYMENT_METHOD_ID = null : val.PAYMENT_METHOD_ID;
                        $scope.SELECTED_CREDIT_RECEIPTS.push(val);
                    }
                })
            }

            angular.forEach($scope.OPEN_ACC_CUST_DECLARATION, function (CR) {

                if (CR.IS_SELECTED) {

                    CR.IS_DELETED = 1;
                    var varCr = angular.copy(CR);
                    varCr.IS_DELETED = 0;
                    varCr.PARENT_ID = angular.copy(CR.ID);
                    varCr.ID = 0;
                    //varCr.CUSTOM_AMOUNT = CR.REMAINING_AMOUNT;
                    varCr.AMOUNT = CR.REMAINING_AMOUNT;
                    varCr.TOTAL_AMT = CR.AMOUNT;
                    varCr.PAYMENT_METHOD_ID == 4 ? varCr.PAYMENT_METHOD_ID = null : varCr.PAYMENT_METHOD_ID;
                    varCr.UPLOAD_IDS = CR.UPLOAD_IDS;
                    varCr.FILE_NAME = CR.FILE_NAME;
                    varCr.UPL_FLAG = false;
                    //   Selectedrow.push(varCr);
                    $scope.SELECTED_CREDIT_RECEIPTS.push(varCr);
                }
            });
            var ACCREDCOUNT = 0;
            angular.forEach($scope.SELECTED_CREDIT_RECEIPTS, function (RCash) {
                RCash.ID == 0 ? ACCREDCOUNT++ : '';
            });

            ACCREDCOUNT == 0 ? $scope.SELECTED_CREDIT_RECEIPTS.push(angular.copy($scope.BlankAccCustomerRedmeed)) : '';
           // $scope.INS_ACC_CUST_DECLARATION();

            $scope.CHK_LAST_VALUE = 0;
            angular.forEach($scope.SELECTED_CREDIT_RECEIPTS, function (Red_Chek) {
                if (Red_Chek.ID == 0 && Red_Chek.AMOUNT != '') {
                    $scope.CHK_LAST_VALUE = Red_Chek.AMOUNT;
                }
            })
            $('#Account_Received').modal('hide');
        });

    }
    $scope.SET_VALUECHECK = function (val) {
         
        if ($scope.CHK_LAST_VALUE != 0) {
            if (val.AMOUNT > $scope.CHK_LAST_VALUE) {
                $scope.$parent.ShowAlert("Attention", "Received Amount is not greater than remaining amount.", 3000);
                //   alert("Amount is not greater than remaining value. ");
                val.AMOUNT = $scope.CHK_LAST_VALUE;
            }
        }
    }

    $scope.GET_ACCOUNT_CUSTOMER_CUSTOMERS = function () {
        var CashupModelObj = new Object();
        CashupModelObj.BRANCH_ID = $scope.$parent.CASHUP.BRANCH_ID;
        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_ACCOUNT_CUSTOMER_CUSTOMERS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.ACCOUNT_CUSTOMER_CUSTOMERS = data.data.Table;
            }
            else {
                $scope.ACCOUNT_CUSTOMER_CUSTOMERS = [];
            }
        });
    }
    $scope.LAZY_OPEN_ACC_CUST_DECLARATION = function () {
        $scope.GET_OPEN_ACC_CUST_DECLARATION(3);
    }


    $scope.OPEN_ACC_CUST_DECLARATION = [];
    $scope.GET_OPEN_ACC_CUST_DECLARATION = function (FLAG) {
         
        if (FLAG == 1) {
            $scope.OPEN_ACC_CUST_DECLARATION = [];
            $scope.CustomerSearch.PAGE_NO = 1;
        }
        var CashupModelObj = new Object();
        CashupModelObj.BRANCH_ID = $scope.$parent.CASHUP.BRANCH_ID;
        CashupModelObj.CUSTOMER_NAME = $scope.CustomerSearch.FILTER_CUSTOMER_NAME;
        CashupModelObj.INVOICE_NUMBER = $scope.CustomerSearch.FILTER_INVOICE_NUMBER;
        CashupModelObj.PAGE_NO = $scope.CustomerSearch.PAGE_NO;
        CashupModelObj.PAGE_SIZE = $scope.CustomerSearch.PAGE_SIZE;
        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_OPEN_ACC_CUST_DECLARATION').then(function (data) {

            if (data.data.Table.length > 0) {
                if (FLAG == 3) {
                    $scope.OPEN_ACC_CUST_DECLARATION = $scope.OPEN_ACC_CUST_DECLARATION.concat(data.data.Table);
                }
                else {
                    $scope.OPEN_ACC_CUST_DECLARATION = data.data.Table;
                }

                if (data.data.Table.length < $scope.CustomerSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.CustomerSearch.PAGE_NO = parseInt($scope.CustomerSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else {
                if ($scope.OPEN_ACC_CUST_DECLARATION.length == 0) {
                }
                $scope.GetData = false;

            }
        });
    }
    $scope.GET_PAYMENT_METHODS();
    $scope.GET_ACCOUNT_CUSTOMER_CUSTOMERS();

    $scope.NextLink = function (val) {
         
        $scope.$parent.CASHUP.TAB_CLICK = false;
        $scope.TabValid = false;
        $scope.AddAccCustFlag = false;
       // $scope.KeyColor = val;
        //$scope.TabValid = true;
        $scope.INS_ACC_CUST_DECLARATION(2);
        //if ($scope.VALIDATED()) {
        //    $scope.TabValid = false;
        //    $scope.INS_ACC_CUST_DECLARATION(2);
        //}

        if ($scope.$parent.CASHUP.ACCOUNT_CREDIT_VALID) {
            if ($scope.$parent.CASHUP.TABLIST[7].FLAG == 1) {
                $location.path("Vouchers").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
            } else if ($scope.$parent.CASHUP.TABLIST[8].FLAG == 1) {
                $location.path("Deposits").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
            } else if ($scope.$parent.CASHUP.TABLIST[9].FLAG == 1) {
                $location.path("Complimentary").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
            }

        }
        else {
            $scope.TabValid = true;
            $scope.CLICK_SUBMITTED = true;
        }
        $scope.$parent.overlay_loading_div_zindex = '-1';
    }
    $scope.PreviousLink = function () {
         
        $scope.$parent.CASHUP.TAB_CLICK = false;
        $scope.TabValid = false;
        $scope.AddAccCustFlag = false;
        $scope.INS_ACC_CUST_DECLARATION(2);
        if ($scope.$parent.CASHUP.ACCOUNT_CREDIT_VALID) {
            if ($scope.$parent.CASHUP.TABLIST[5].FLAG == 1) {
                $location.path("Delivery").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
            } else if ($scope.$parent.CASHUP.TABLIST[4].FLAG == 1) {
                $location.path("PtyCash").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
            } else if ($scope.$parent.CASHUP.TABLIST[3].FLAG == 1) {
                $location.path("Cards").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
            } else if ($scope.$parent.CASHUP.TABLIST[2].FLAG == 1) {
                $location.path("Cash").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
            } else if ($scope.$parent.CASHUP.TABLIST[1].FLAG == 1) {
                $location.path("Float").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
            } else {
                $location.path("CEN").search({ CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
            }
        }
        else {
            $scope.TabValid = true;
            $scope.CLICK_SUBMITTED = true;
        }
    }
    $scope.$on('$destroy', function () {
        $scope.$parent.CASHUP.TAB_CLICK = true;

        if ($scope.TabValid) {
            if ($scope.$parent.CASHUP.FG == null) {
                if ($scope.AccCustomerList.length > 0 || $scope.SELECTED_CREDIT_RECEIPTS.length>0) {
                    $scope.AddAccCustFlag = false;
                    $scope.CLICK_SUBMITTED = true;
                    if ($scope.VALIDATED()) {
                        $scope.INS_ACC_CUST_DECLARATION();
                    }
                    else {
                        $scope.$parent.CASHUP.ACCOUNT_CREDIT_VALID = false;
                        $scope.CLICK_SUBMITTED = true;
                        $scope.SELECTED_CREDIT_RECEIPTS.filter(function (x) {
                            if (x.UploadedFiles.length > 0) {
                                x.UploadedFiles = [];
                            }
                        });
                        $scope.$parent.CASHUP.ACC_CUSTOMER_LIST = $scope.AccCustomerList;
                        $scope.$parent.CASHUP.ACC_CUSTOMER_RED_LIST = $scope.SELECTED_CREDIT_RECEIPTS;
                        //$scope.$parent.CASHUP.SELECTED_CREDIT_RECEIPTS = $scope.SELECTED_CREDIT_RECEIPTS;
                        $location.path("AccountCustomer").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                    }
                }
            }
        }
    });
    $scope.GET_CASHUP_BY_ID = function () {

        var CashupModelObj = new Object();
        CashupModelObj.CASHUP_MAIN_ID = $scope.$parent.CASHUP.CASHUP_MAIN_ID;
        CashupModelObj.SESSION_ID = $scope.$parent.CASHUP.SESSION_ID;
        CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_CASHUP_BY_ID').then(function (data) {

            if (data != undefined && data.data != undefined && data.data.Table.length > 0) {

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

                //$scope.GET_EPOS_HEADER();
                //$scope.GET_EPOS_DATA();


            }

        });

    };

    $scope.NextLink_View = function (val) {

        $scope.$parent.CASHUP.TAB_CLICK = false;
        $scope.TabValid = false;
        $scope.AddAccCustFlag = false;
        $scope.KeyColor = val;
        if ($scope.$parent.CASHUP.TABLIST[7].FLAG == 1) {
            $location.path("Vouchers_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
        } else if ($scope.$parent.CASHUP.TABLIST[8].FLAG == 1) {
            $location.path("Deposits_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
        } else if ($scope.$parent.CASHUP.TABLIST[9].FLAG == 1) {
            $location.path("Complimentary_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
        }


        $scope.$parent.overlay_loading_div_zindex = '-1';
    }
    $scope.PreviousLink_View = function () {
        $scope.$parent.CASHUP.TAB_CLICK = false;
        $scope.TabValid = false;
        $scope.AddAccCustFlag = false;

        if ($scope.$parent.CASHUP.TABLIST[5].FLAG == 1) {
            $location.path("Delivery_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
        } else if ($scope.$parent.CASHUP.TABLIST[4].FLAG == 1) {
            $location.path("PtyCash_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
        } else if ($scope.$parent.CASHUP.TABLIST[3].FLAG == 1) {
            $location.path("Cards_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
        } else if ($scope.$parent.CASHUP.TABLIST[2].FLAG == 1) {
            $location.path("Cash_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
        } else if ($scope.$parent.CASHUP.TABLIST[1].FLAG == 1) {
            $location.path("Float_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
        } else {
            $location.path("CEN_VIEW").search({ CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
        }

    }
    $scope.SET_DROPSCROLL = function () {
        $('.SCROLL_DROP').find('.dropdown-menu').addClass('custom-scrollbar');
    }
    //////////////////////// END Comment Code////////////////////////////////////////////////
    $scope.ADD_SAME_FILE_UPLOADER_RED = function (LINE) {
        var Modelobj = new Object()
        Modelobj.MULTI_UPLOAD_LIST = [];
        if (LINE.UploadedFiles != undefined && LINE.UploadedFiles.length > 0) {
            angular.forEach(LINE.UploadedFiles, function (Uploads, index) {
                var readonly = new Object()
                readonly.RELATIVE_ID = LINE.ID == 0 ? $scope.$parent.generaterandom(12) + "" + index : List.ID;/*index + '' + Uploads.CREATED_BY + '' + Uploads.ID + '' + 37;*/
                readonly.UPLOAD_TYPE_ID = 46;
                readonly.FILE_PATH = Uploads.FILE_PATH;
                readonly.ORIGINAL_FILE_NAME = Uploads.ORIGINAL_FILE_NAME;
                readonly.NEW_FILE_NAME = Uploads.SERVER_FILE_NAME;
                readonly.TABLE_ID = 0;
                readonly.USER_ID = parseInt($cookies.get("USERID"));
                readonly.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
                Modelobj.MULTI_UPLOAD_LIST.push(readonly);
            });

            PrcCommMethods.CASHUP_API(Modelobj, 'MULTI_UPLOAD_CASHUP').then(function (data) {
                if (data.data.Table1.length > 0) {
                    if (LINE.UploadedFiles == undefined) {
                        LINE.UploadedFiles = [];
                    }
                    LINE.UploadedFiles = data.data.Table1;
                    LINE.UPLOAD_IDS = LINE.UploadedFiles[0].TABLE_ID;
                }
                if (data.data == 0) {
                    //$scope.$parent.ShowAlert("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                    LINE.UPLOAD_IDS = '';
                }
            });
        };
    }

    $scope.initaccountList = function (ACCOUNT_LINE) {
       // if ($scope.$parent.CASHUP.TAB_CLICK == false) {
            if (ACCOUNT_LINE.ID == 0) {
                ACCOUNT_LINE.UploadedFiles = [];
            }

            if (ACCOUNT_LINE.ID != 0) {
                if (ACCOUNT_LINE.UploadedFiles == undefined) {
                    ACCOUNT_LINE.UploadedFiles = [];
                }
                var FileArray = ACCOUNT_LINE.FILE_NAME != "" ? ACCOUNT_LINE.FILE_NAME.split(':;:') : [];
                if (FileArray.length > 0) {
                    var obj = new Object()
                    obj.ID = ACCOUNT_LINE.UPLOAD_IDS;
                    obj.FILE_PATH = FileArray[0];
                    obj.SERVER_FILE_NAME = FileArray[1];
                    obj.ORIGINAL_FILE_NAME = FileArray[2];
                    ACCOUNT_LINE.UploadedFiles.push(obj);
                }
            }
       // }
    }

    $scope.initaccountListrec = function (ACCOUNT_LINE) {
        //if ($scope.$parent.CASHUP.TAB_CLICK == false) {
            if (ACCOUNT_LINE.ID == 0) {
                ACCOUNT_LINE.UploadedFiles = [];
            }
            if (ACCOUNT_LINE.ID != 0) {
                if (ACCOUNT_LINE.UploadedFiles == undefined) {
                    ACCOUNT_LINE.UploadedFiles = [];
                }
            }
            var FileArray = (ACCOUNT_LINE.FILE_NAME != "" && ACCOUNT_LINE.FILE_NAME != null) ? ACCOUNT_LINE.FILE_NAME.split(':;:') : [];
            if (FileArray.length > 0) {
                var obj = new Object()
                obj.ID = ACCOUNT_LINE.UPLOAD_IDS;
                obj.FILE_PATH = FileArray[0];
                obj.SERVER_FILE_NAME = FileArray[1];
                obj.ORIGINAL_FILE_NAME = FileArray[2];
                ACCOUNT_LINE.UploadedFiles.push(obj);
        }
        if (ACCOUNT_LINE.UPL_FLAG == false) {
            $scope.ADD_SAME_FILE_UPLOADER_RED(ACCOUNT_LINE);
        }
      //  }
        
    }

    $scope.getTheFilesToUploadAccount = function ($files, ControlName, FileSize, List, Attachment_UPLOAD_TYPE_ID, index) {

        if (FileSize == undefined || FileSize == null || FileSize == 0 || FileSize == '') {
            FileSize = AppVal.FileSize;
        }
        $scope.imagesrc = [];
        var valid = 0;
        for (var i = 0; i < $files.length; i++) {

            if ($scope.Attachment_UPLOAD_TYPE_ID == 12) {
                var validFormats = ['MPEG4', 'MP4', 'video/mp4'];
            }
            else {
                var validFormats = ['doc', 'docx', 'xml', 'pdf', 'csv', 'txt', 'text', 'jpg', 'jpeg', 'png', 'MPEG4', 'MP4', 'video/mp4', 'excel'];
            }
            var validity = validFormats.map(function (element) {
                if ($files[i].type.indexOf(element) != -1) {
                    return 1;
                }
                else {
                    return 0;
                }
            });
            valid = validity.indexOf(1);

            if (valid != -1) {
                if (($files[i].size / 1000000).toFixed(2) <= FileSize) {//File Size should not be more than 5 MB
                    var reader = new FileReader();
                    reader.fileName = $files[i].name;
                    reader.onload = function (event) {
                        var image = {};
                        image.Name = event.target.fileName;
                        image.Size = (event.total / 1024).toFixed(2);
                        image.Src = event.target.result;
                        $scope.imagesrc.push(image);
                        $scope.$apply();
                    }
                    reader.readAsText($files[i]);
                }
                else {
                    $scope.ShowAlert('Error', 'Maximum File Size ' + FileSize + ' MB.', 5000);
                    angular.element("input[id='" + ControlName + "']").val(null);
                    return;
                }
            }
            else {
                $scope.ShowAlert('Error', 'Not a valid file.', 5000);
                angular.element("input[id='" + ControlName + "']").val(null);
                return;
            }
        }
        $scope.Files = $files;
        var fileUpload = document.getElementById("ACCOUNTFILE" + index);
        extension = fileUpload.files[0].name;
        $scope.uploadFiles(Attachment_UPLOAD_TYPE_ID, '', extension, List, index, 'Account');
    };
    $scope.uploadFiles = function (Attachment_UPLOAD_TYPE_ID, ATTACHEMENT_TYPE_ID, filename, List, index, FolderName) {

        if (($scope.Files != undefined && $scope.Files.length > 0)) {
            $scope.DocImageResult = [];
            var data = new FormData();
            data.append("RelativeID", List.ID == 0 ? $scope.$parent.generaterandom(12) + "" + index : List.ID);
            data.append("UPLOAD_TYPE_ID", Attachment_UPLOAD_TYPE_ID);
            data.append("VIRTUALPATH", '/CashUp/' + FolderName + '/' + parseInt($scope.$parent.CASHUP.CASHUP_MAIN_ID)) + '/';
            data.append("UPLOAD_ID", 0);
            data.append("ORIGINAL_FILE_NAME", filename);
            data.append("USER_ID", parseInt($cookies.get("USERID")));
            if (isNaN(parseInt($cookies.get("ENTITY_ID")))) {
                data.append("ENTITY_ID", 0);
            }
            else {
                data.append("ENTITY_ID", parseInt($cookies.get("ENTITY_ID")));
            }
            for (var i in $scope.Files) {
                data.append("uploadedFile", $scope.Files[i]);
            }
            var request = {
                method: 'POST',
                url: CommService.Get_CASHUP_API() + "api/PayrollAPI/UPLOADFILES",
                data: data,
                headers: {
                    'Content-Type': undefined
                }
            };
            $http(request).then(function (d) {
                if (d.data.length > 0 && d.data[0].UPLOADED_COMMENT != undefined) {
                    $scope.ShowAlert('Error', d.data[0].UPLOADED_COMMENT, 5000);
                }
                else {
                    List.UploadedFiles = d.data;
                }
            });
        }
    };

    $scope.DELETE_UPLOAD_ACCOUNT_ALL = function (Array, item, index, FLAG) {
        if (confirm('Are you sure you want to delete?')) {
            Array.UploadedFiles.splice(index, 1);
            var CashupModelObj = new Object();
            CashupModelObj.ID = parseInt(item.ID);
            PrcCommMethods.CASHUP_API(CashupModelObj, 'DELETE_UPLOAD').then(function (data) {
                $scope.ShowAlert('Success', 'Delete success.', 5000);
            });
        }
    };

    $scope.getTheFilesToUploadAccountRec = function ($files, ControlName, FileSize, List, Attachment_UPLOAD_TYPE_ID, index) {

        if (FileSize == undefined || FileSize == null || FileSize == 0 || FileSize == '') {
            FileSize = AppVal.FileSize;
        }
        $scope.imagesrc = [];
        var valid = 0;
        for (var i = 0; i < $files.length; i++) {

            if ($scope.Attachment_UPLOAD_TYPE_ID == 12) {
                var validFormats = ['MPEG4', 'MP4', 'video/mp4'];
            }
            else {
                var validFormats = ['doc', 'docx', 'xml', 'pdf', 'csv', 'txt', 'text', 'jpg', 'jpeg', 'png', 'MPEG4', 'MP4', 'video/mp4', 'excel'];
            }
            var validity = validFormats.map(function (element) {
                if ($files[i].type.indexOf(element) != -1) {
                    return 1;
                }
                else {
                    return 0;
                }
            });
            valid = validity.indexOf(1);

            if (valid != -1) {
                if (($files[i].size / 1000000).toFixed(2) <= FileSize) {//File Size should not be more than 5 MB
                    var reader = new FileReader();
                    reader.fileName = $files[i].name;
                    reader.onload = function (event) {
                        var image = {};
                        image.Name = event.target.fileName;
                        image.Size = (event.total / 1024).toFixed(2);
                        image.Src = event.target.result;
                        $scope.imagesrc.push(image);
                        $scope.$apply();
                    }
                    reader.readAsText($files[i]);
                }
                else {
                    $scope.ShowAlert('Error', 'Maximum File Size ' + FileSize + ' MB.', 5000);
                    angular.element("input[id='" + ControlName + "']").val(null);
                    return;
                }
            }
            else {
                $scope.ShowAlert('Error', 'Not a valid file.', 5000);
                angular.element("input[id='" + ControlName + "']").val(null);
                return;
            }
        }
        $scope.Files = $files;
        var fileUpload = document.getElementById("ACCOUNTFILE1" + index);
        extension = fileUpload.files[0].name;
        $scope.uploadFiles_rec(Attachment_UPLOAD_TYPE_ID, '', extension, List, index, 'Account');
    };
    $scope.uploadFiles_rec = function (Attachment_UPLOAD_TYPE_ID, ATTACHEMENT_TYPE_ID, filename, List, index, FolderName) {

        if (($scope.Files != undefined && $scope.Files.length > 0)) {
            $scope.DocImageResult = [];
            var data = new FormData();
            data.append("RelativeID", List.ID == 0 ? $scope.$parent.generaterandom(12) + "" + index : List.ID);
            data.append("UPLOAD_TYPE_ID", Attachment_UPLOAD_TYPE_ID);
            data.append("VIRTUALPATH", '/CashUp/' + FolderName + '/' + parseInt($scope.$parent.CASHUP.CASHUP_MAIN_ID)) + '/';
            data.append("UPLOAD_ID", 0);
            data.append("ORIGINAL_FILE_NAME", filename);
            data.append("USER_ID", parseInt($cookies.get("USERID")));
            if (isNaN(parseInt($cookies.get("ENTITY_ID")))) {
                data.append("ENTITY_ID", 0);
            }
            else {
                data.append("ENTITY_ID", parseInt($cookies.get("ENTITY_ID")));
            }
            for (var i in $scope.Files) {
                data.append("uploadedFile", $scope.Files[i]);
            }
            var request = {
                method: 'POST',
                url: CommService.Get_CASHUP_API() + "api/PayrollAPI/UPLOADFILES",
                data: data,
                headers: {
                    'Content-Type': undefined
                }
            };
            $http(request).then(function (d) {
                if (d.data.length > 0 && d.data[0].UPLOADED_COMMENT != undefined) {
                    $scope.ShowAlert('Error', d.data[0].UPLOADED_COMMENT, 5000);
                }
                else {
                    List.UploadedFiles = d.data;
                }
            });
        }
    };

    $scope.DELETE_UPLOAD_ACCOUNT_ALL_REC = function (Array, item, index, FLAG) {
        if (confirm('Are you sure you want to delete?')) {
            Array.UploadedFiles.splice(index, 1);
            var CashupModelObj = new Object();
            CashupModelObj.ID = parseInt(item.ID);
            PrcCommMethods.CASHUP_API(CashupModelObj, 'DELETE_UPLOAD').then(function (data) {
                $scope.ShowAlert('Success', 'Delete success.', 5000);
            });
        }
    };
});