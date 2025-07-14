app.controller('VouchersController', function ($scope, $http, $interval, CommService, $cookies, $filter, PrcCommMethods, $location, readFileData, readFileDataNew, $sce) {

    $scope.$parent.CASHUP.ID = getUrlParameter('CHID', $location.absUrl());
    $scope.$parent.CASHUP.KeyColor = "Vouchers";
    if ($scope.$parent.CASHUP.ACTUAL_STEP_NO <= 8) {
        $scope.$parent.CASHUP.ACTUAL_STEP_NO = 8;
    }
    $scope.TabValid = true;
    $scope.$parent.overlay_loadingNew = 'block';
    $scope.VoucherIssuedList = [];
    $scope.VoucherRedeemedList = [];
    //$scope.VoucherRedeemed = [];
    $scope.Cnt = 0;
    $scope.DFlag = true;

    $scope.BlankVoucherIssued = { ID: 0, ENTRY_TYPE_ID: 1, ENTRY_TYPE_DETAIL_ID: 0, CODE: null, VOUCHER_TYPE: 'Pre-Defined', VOUCHER: null, VALUE: '', VALIDITY_DATE: '', CUSTOMER_NAME: '', MODE: null, CHECK_NO: '', NOTE: '', IS_REDEEMED: false, vouchernumbervisible: true, IS_DELETED: 0, METHOD_NAME: null, PAYMENT_METHOD_ID: null, TOTAL_AMT:null};
    $scope.BlankVoucherRedeem = { ID: 0, ENTRY_TYPE_ID: 1, ENTRY_TYPE_DETAIL_ID: 0, VOUCHER_TYPE: 'Pre-Defined', VOUCHER: null, VALUE: '', VALIDITY_DATE: '', CUSTOMER_NAME: '', MODE: null, CHECK_NO: '', NOTE: '', IS_REDEEMED: true, IS_DELETED: 0, IS_CHECKED: false, METHOD_NAME: null, PAYMENT_METHOD_ID: null, TOTAL_AMT:null};
    $scope.AddVoucherFlag = false;
    //$scope.AddVRedeemLineFlag = false;

    $scope.SetPayment = function (VISS,PaymentMethodId) {
         
        for (var i = 0; i < $scope.PAYMENT_METHODS.length; i++) {
            if ($scope.PAYMENT_METHODS[i].PAYMENT_METHOD_ID == PaymentMethodId) {
                VISS.METHOD_NAME = $scope.PAYMENT_METHODS[i].METHOD_NAME;
                VISS.MODE = $scope.PAYMENT_METHODS[i].METHOD_NAME;
                break;
            }
        }
      
    }
    $scope.SetPayment_Red = function (VISS, PaymentMethodId) {

        for (var i = 0; i < $scope.PAYMENT_METHODS_RECEIVED.length; i++) {
            if ($scope.PAYMENT_METHODS_RECEIVED[i].PAYMENT_METHOD_ID == PaymentMethodId) {
                VISS.METHOD_NAME = $scope.PAYMENT_METHODS_RECEIVED[i].METHOD_NAME;
                VISS.MODE = $scope.PAYMENT_METHODS_RECEIVED[i].METHOD_NAME;
                break;
            }
        }

    }
    $scope.VoucherIssueLine = function () {
        $scope.AddVoucherFlag = true;
        $scope.ValidateVoucherIssue();
        if ($scope.$parent.CASHUP.VOUCHERVALID) {
             
            $scope.InsertEntry_TypeDeclaration();
            if ($scope.$parent.CASHUP.AUTOVALIDVOUCHER) {
                $scope.VoucherIssuedList.push(angular.copy($scope.BlankVoucherIssued));
                $scope.$parent.CASHUP.AUTOVALIDVOUCHER = false;
               
            }
        }
        $scope.CommonSearch.INVOICE_NUMBER = null;
        $scope.CommonSearch.VOUCHER_REFERENCE = null;
        $scope.CommonSearch.PAYMENT_MODE_ID = null;
        $scope.CommonSearch.CUSTOMER_NAME = null;
        $scope.CommonSearch.VOUCHER_TYPE = null;
        //if ($scope.$parent.CASHUP.VOUCHERVALID && $scope.$parent.CASHUP.AUTOVALIDVOUCHER) {
        //    $scope.VoucherIssuedList.push(angular.copy($scope.BlankVoucherIssued));
        //}
        //if ($scope.$parent.CASHUP.VOUCHERVALID) {
        //    // $scope.VoucherIssuedList.push(angular.copy($scope.BlankVoucherIssued));
        //     
        //    //var VoucherIssueFilter = angular.copy($filter('filter')($scope.VoucherIssuedList, { ENTRY_TYPE_ID: 1, IS_REDEEMED: false,ID: 0 }));
        //    //if (VoucherIssueFilter.length >= 0) {
        //    //    $scope.VoucherIssuedList.push(angular.copy($scope.BlankVoucherIssued));
        //    //}
        //}
    };
    $scope.VoucherRedeemLine = function () {
         
        $scope.AddVoucherFlag = true;
        $scope.ValidateVoucherIssue();
        if ($scope.$parent.CASHUP.VOUCHERVALID) {

            $scope.InsertEntry_TypeDeclaration();
            if ($scope.$parent.CASHUP.AUTOVALIDVOUCHER) {
                $scope.VoucherIssuedList.push(angular.copy($scope.BlankVoucherRedeem));
                $scope.$parent.CASHUP.AUTOVALIDVOUCHER = false;
            }
        }
        
        // var VoucherRedeemFilter = angular.copy($filter('filter')($scope.VoucherIssuedList, { ENTRY_TYPE_ID: 1, IS_REDEEMED: true }));
        //if (VoucherRedeemFilter.length == 0) {
        //    $scope.VoucherIssuedList.push(angular.copy($scope.BlankVoucherRedeem));
        //}

    };

    $scope.InitVouchureIssuedList = function (VISS) {
        VISS.VOUCHER = { ID: VISS.ENTRY_TYPE_DETAIL_ID, CODE: VISS.CODE, VALIDITY_DATE: VISS.VALIDITY_DATE, AMOUNT: VISS.VALUE, ENTRY_TYPE_ID: VISS.ENTRY_TYPE_ID };
    };

    //$scope.VoucherIssueLine();
    // $scope.VoucherRedeemLine();

    $scope.DeleteVoucherLine = function (Array, index, IS_REDEEMED, ENTRY_TYPE_ID, VISS) {
         
        if (VISS.ID == undefined || VISS.ID == 0) {
            
            if (Array.length == 1) {
                if (VISS.CHECK_NO != '' || VISS.CODE != null || VISS.TOTAL_AMT != null || VISS.VALUE != '' || VISS.VALIDITY_DATE != '' || VISS.PAYMENT_METHOD_ID != null || VISS.CUSTOMER_NAME != '' || VISS.NOTE != '') { 
                    if (confirm("Are you sure, You want to delete the record ?")) {
                        VISS.IS_DELETED = 1;
                        //  alert("Are you sure, You want to delete the record ?");
                        $scope.VoucherIssuedList.push(angular.copy($scope.BlankVoucherRedeem));
                    }
                }
                } else {
                    // Array.splice(index, 1);    
                if (VISS.CHECK_NO != '' || VISS.CODE != null || VISS.TOTAL_AMT != null || VISS.VALUE != '' || VISS.VALIDITY_DATE != '' || VISS.PAYMENT_METHOD_ID != null || VISS.CUSTOMER_NAME != '' || VISS.NOTE != '') {
                    if (confirm("Are you sure, You want to delete the record ?")) {
                        angular.forEach($scope.MasterEntryList_Redeemed, function (Masterval) {
                            angular.forEach($scope.VoucherIssuedList, function (Vouchval) {
                                if (Masterval.CHECK_NO == Vouchval.CHECK_NO && Vouchval.ENTRY_TYPE_DETAIL_ID == VISS.ENTRY_TYPE_DETAIL_ID && Vouchval.ID == 0 && Vouchval.IS_REDEEMED == true && Vouchval.ENTRY_TYPE_ID == 1) {
                                    Masterval.IS_CHECKED = false;
                                }
                            })
                        })
                        var len = $scope.VoucherIssuedList.length - 1;
                        for (var i = len; i >= 0; i--) {
                            if ($scope.VoucherIssuedList[i].ID == 0 && $scope.VoucherIssuedList[i].IS_REDEEMED == true && $scope.VoucherIssuedList[i].ENTRY_TYPE_ID == 1 && $scope.VoucherIssuedList[i].ENTRY_TYPE_DETAIL_ID == VISS.ENTRY_TYPE_DETAIL_ID) {
                                $scope.VoucherIssuedList.splice(i, 1);
                                $scope.VoucherIssuedList.push(angular.copy($scope.BlankVoucherRedeem));
                                break;
                            }
                        }
                        var len1 = 0;
                        angular.forEach($scope.VoucherIssuedList, function (item) {
                            if (item.IS_DELETED == 0 && item.IS_REDEEMED == true && item.ENTRY_TYPE_ID == 1) {
                                len1 = len1 + 1;
                            }
                        })
                        if (len1 == 0) {
                            $scope.VoucherIssuedList.push(angular.copy($scope.BlankVoucherRedeem));
                        }
                    }
                }
                }
            
        } else {
            if (confirm("Are you sure, You want to delete the record ?")) {
                var len = $scope.VoucherIssuedList.length - 1;
                var count = 0;
                angular.forEach($scope.VoucherIssuedList, function (val) {
                    if (val.IS_REDEEMED == true && val.ENTRY_TYPE_ID == 1) {
                        count = count + 1;
                    }
                })
                var Cnt = 0;
                for (var i = len; i >= 0; i--) {
                    if ($scope.VoucherIssuedList[i].IS_REDEEMED == true && $scope.VoucherIssuedList[i].ENTRY_TYPE_ID == 1) {
                        VISS.IS_DELETED = 1;
                        //arr.push(item);
                        // $scope.VoucherIssuedList.splice(i, 1);
                        break;
                    }
                }
                angular.forEach($scope.VoucherIssuedList, function (val) {
                    if (val.IS_REDEEMED == true && val.ENTRY_TYPE_ID == 1 && val.IS_DELETED == 1) {
                        Cnt = Cnt + 1;
                    }
                })
                if (count == Cnt) {
                  //  alert("Are you sure, You want to delete the record?");
                    $scope.VoucherIssuedList.push(angular.copy($scope.BlankVoucherRedeem));
                }
                $scope.InsertEntry_TypeDeclaration();
                // GET_ENTRY_MASTER_DETAILS();
            }
        }

        //var len = $scope.VoucherIssuedList.length - 1;
        //for (var i = len; i >= 0; i--) {
        //    if ($scope.VoucherIssuedList[i].IS_REDEEMED == true && $scope.VoucherIssuedList[i].ENTRY_TYPE_ID == 1) {
        //        VISS.IS_DELETED = 1;
        //        //arr.push(item);
        //       // $scope.VoucherIssuedList.splice(i, 1);
        //        break;
        //    }
        //}
        $scope.COMMON_CODE_CHANGE();
        $scope.$parent.CASHUP.VOUCHERVALID = true;
    };

    $scope.DeleteLine = function (Array, index, IS_REDEEMED, ENTRY_TYPE_ID, VISS) {
         
        if (VISS.ID == undefined || VISS.ID == 0) {
            
            if (Array.length == 1) {
                if (VISS.ENTRY_TYPE_DETAIL_ID!=0 || VISS.CHECK_NO != '' || VISS.CODE != null || VISS.VALUE != '' || VISS.VALIDITY_DATE != '' || VISS.PAYMENT_METHOD_ID != null || VISS.CUSTOMER_NAME != '' || VISS.NOTE != '') {
                    if (confirm("Are you sure, You want to delete the record ?")) {
                        VISS.IS_DELETED = 1;
                        //  alert("Are you sure, You want to delete the record ?");
                        $scope.VoucherIssuedList.push(angular.copy($scope.BlankVoucherIssued));
                    }
                }
                } else {
                    // Array.splice(index, 1);             
                    // $scope.VoucherIssuedList.splice(index+1, 1);
                if ( VISS.ENTRY_TYPE_DETAIL_ID != 0|| VISS.CHECK_NO != '' || VISS.CODE != null || VISS.VALUE != '' || VISS.VALIDITY_DATE != '' || VISS.PAYMENT_METHOD_ID != null || VISS.CUSTOMER_NAME != '' || VISS.NOTE != '') {
                    if (confirm("Are you sure, You want to delete the record ?")) {
                        var len = $scope.VoucherIssuedList.length - 1;
                        for (var i = len; i >= 0; i--) {
                            if ($scope.VoucherIssuedList[i].ID == 0 && $scope.VoucherIssuedList[i].IS_REDEEMED == false && $scope.VoucherIssuedList[i].ENTRY_TYPE_ID == 1) {
                                $scope.VoucherIssuedList.splice(i, 1);
                                $scope.VoucherIssuedList.push(angular.copy($scope.BlankVoucherIssued));
                                break;
                            }
                        }
                        var len1 = 0;
                        angular.forEach($scope.VoucherIssuedList, function (item) {
                            if (item.IS_DELETED == 0 && item.IS_REDEEMED == false && item.ENTRY_TYPE_ID == 1) {
                                len1 = len1 + 1;
                            }
                        })
                        if (len1 == 0) {
                            $scope.VoucherIssuedList.push(angular.copy($scope.BlankVoucherIssued));
                        }
                    }
                }
                }
            
        } else {
            if (confirm("Are you sure, You want to delete the record ?")) {
                var len = $scope.VoucherIssuedList.length - 1;
                var count = 0;
                angular.forEach($scope.VoucherIssuedList, function (val) {
                    if (val.IS_REDEEMED == false && val.ENTRY_TYPE_ID == 1) {
                        count = count + 1;
                    }
                })
                var Cnt = 0;
                for (var i = len; i >= 0; i--) {
                    if ($scope.VoucherIssuedList[i].IS_REDEEMED == false && $scope.VoucherIssuedList[i].vouchernumbervisible == true && $scope.VoucherIssuedList[i].ENTRY_TYPE_ID == 1) {

                        VISS.IS_DELETED = 1;
                        break;
                    } else if ($scope.VoucherIssuedList[i].IS_REDEEMED == false && $scope.VoucherIssuedList[i].vouchernumbervisible == false && $scope.VoucherIssuedList[i].ENTRY_TYPE_ID == 1) {

                        VISS.IS_DELETED = 1;
                        break;
                    }
                }
                angular.forEach($scope.VoucherIssuedList, function (val) {
                    if (val.IS_DELETED == 1) {
                        Cnt = Cnt + 1;
                    }
                })
                if (count == Cnt) {
                    //alert("Are you sure, You want to delete the record?");
                    //$scope.VoucherIssuedList.push(angular.copy($scope.BlankVoucherIssued));
                }
                $scope.InsertEntry_TypeDeclaration();
                // GET_ENTRY_MASTER_DETAILS();
            }
        }
        $scope.COMMON_CODE_CHANGE();
        $scope.$parent.CASHUP.VOUCHERVALID = true;
        //if (ENTRY_TYPE_ID == undefined) {
        //    Array.splice(index, 1);
        //}
        //else {                       
        //    var len = $scope.VoucherIssuedList.length - 1;
        //    for (var i = len; i >= 0; i--) {
        //        if ($scope.VoucherIssuedList[i].IS_REDEEMED == false && $scope.VoucherIssuedList[i].vouchernumbervisible == true && $scope.VoucherIssuedList[i].ENTRY_TYPE_ID == 1) {
        //            VISS.IS_DELETED = 1;
        //            //arr.push(item);
        //          //  $scope.VoucherIssuedList.splice(i, 1);
        //            break;
        //        } else if ($scope.VoucherIssuedList[i].IS_REDEEMED == false && $scope.VoucherIssuedList[i].vouchernumbervisible == false && $scope.VoucherIssuedList[i].ENTRY_TYPE_ID == 1) {
        //            VISS.IS_DELETED = 1;
        //            //  $scope.VoucherIssuedList.splice(i, 1);
        //            break;
        //        }
        //    }
        //}
    };
    $scope.CommonSearch = {
        //IS_CHECKED: false,
        PAGE_NO: 1,
        PAGE_SIZE: 10,

    }
    $scope.LAZY_GET_VOUCHER_LIST = function () {
        $scope.GET_OPEN_VOUCHER_DETAILS();
    };
    //GET_ENTRY_MASTER_DETAILS(1);
    //function GET_ENTRY_MASTER_DETAILS(FLAG) {
    $scope.GET_OPEN_VOUCHER_DETAILS = function (FLAG) {

        var CashupModelObj = new Object();
        if (FLAG == 1) {
            $scope.MasterEntryList_Redeemed = [];
            $scope.CommonSearch.PAGE_NO = 1;
        }
        CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CashupModelObj.BRANCH_ID = $scope.$parent.CASHUP.BRANCH_ID;
        CashupModelObj.CUSTOMER_NAME = $scope.CommonSearch.CUSTOMER_NAME;
        CashupModelObj.INVOICE_NUMBER = $scope.CommonSearch.INVOICE_NUMBER;
        CashupModelObj.VOUCHER_REFERENCE = $scope.CommonSearch.VOUCHER_REFERENCE;
        CashupModelObj.PAYMENT_MODE_ID = $scope.CommonSearch.PAYMENT_MODE_ID;
        CashupModelObj.VOUCHER_TYPE = $scope.CommonSearch.VOUCHER_TYPE;
        CashupModelObj.PAGE_NO = $scope.CommonSearch.PAGE_NO;
        CashupModelObj.PAGE_SIZE = $scope.CommonSearch.PAGE_SIZE;
        CashupModelObj.IS_SHOW_REDEEMED = 0;
        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_OPEN_VOUCHER_DETAILS').then(function (data) {
             
            if (data != undefined && data.data != undefined) {
                if (FLAG == 1) {
                    $scope.MasterEntryList_Redeemed = [];
                    $scope.MasterEntryList_Redeemed = data.data.Table;  
                } else {
                    $scope.MasterEntryList_Redeemed = $scope.MasterEntryList_Redeemed.concat(data.data.Table);               
                }
                $scope.MasterEntryList_Redeemed = ($filter('filter')($scope.MasterEntryList_Redeemed, { ENTRY_TYPE_ID: 1, IS_REDEEMED: false }));
                // $scope.MasterEntryList_Redeemed = angular.copy($filter('filter')($scope.MasterEntryList_Redeemed, { ENTRY_TYPE_ID: 1 }))
                angular.forEach($scope.MasterEntryList_Redeemed, function (RedVal) {
                    RedVal.IS_CHECKED = false;
                })

                if (data.data.Table.length < $scope.CommonSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.CommonSearch.PAGE_NO = parseInt($scope.CommonSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
                // $scope.GET_ENTRY_TYPE_DECLARATION();
            }
            else {
                $scope.GetData = false;
               // $scope.MasterEntryList_Redeemed = [];
            }


        });
    }

    $scope.GET_OPEN_VOUCHER_DETAILS_SEARCH = function () {

        var CashupModelObj = new Object();
        
        CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CashupModelObj.BRANCH_ID = $scope.$parent.CASHUP.BRANCH_ID;
        CashupModelObj.CUSTOMER_NAME = $scope.CommonSearch.CUSTOMER_NAME;
        CashupModelObj.INVOICE_NUMBER = $scope.CommonSearch.INVOICE_NUMBER;
        CashupModelObj.VOUCHER_REFERENCE = $scope.CommonSearch.VOUCHER_REFERENCE;
        CashupModelObj.PAYMENT_MODE_ID = $scope.CommonSearch.PAYMENT_MODE_ID;
        CashupModelObj.VOUCHER_TYPE = $scope.CommonSearch.VOUCHER_TYPE;
        CashupModelObj.PAGE_NO = 1;// $scope.CommonSearch.PAGE_NO;
        CashupModelObj.PAGE_SIZE = 500;// $scope.CommonSearch.PAGE_SIZE;
        CashupModelObj.IS_SHOW_REDEEMED = 0;
        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_OPEN_VOUCHER_DETAILS').then(function (data) {

            if (data != undefined && data.data != undefined) {
                $scope.MasterEntryList_Redeemed_Search = [];
                $scope.MasterEntryList_Redeemed_Search = data.data.Table;
                $('#AddCustomScroll').find('.dropdown-menu').addClass('custom-scrollbar');
                $scope.MasterEntryList_Redeemed_Search = ($filter('filter')($scope.MasterEntryList_Redeemed_Search, { ENTRY_TYPE_ID: 1, IS_REDEEMED: false }));
            }
            else {
                $scope.MasterEntryList_Redeemed_Search = [];
            }


        });
    }
    $scope.GET_ENTRY_TYPE_DECLARATION = function () {
        var CashupModelObj = new Object();
        CashupModelObj.ID = $scope.$parent.CASHUP.ID;

        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_ENTRY_TYPE_DECLARATION').then(function (data) {

            var VISS_COUNT = 0;
            var VISR_COUNT = 0;

            $scope.VoucherIssuedList = [];
            if (data != undefined && data.data != undefined) {
                $scope.VoucherIssuedList = angular.copy($filter('filter')(data.data.Table, { ENTRY_TYPE_ID: 1 }));//$filter('orderBy')(data.data.Table, 'ID');
                $scope.VoucherIssuedList = $filter('orderBy')($scope.VoucherIssuedList, 'ID');

            }
            angular.forEach($scope.VoucherIssuedList, function (VISS) {
                if (VISS.ENTRY_TYPE_ID == 1) {
                    VISS.VOUCHER = { ID: VISS.ENTRY_TYPE_DETAIL_ID, CODE: VISS.CODE, VALIDITY_DATE: VISS.VALIDITY_DATE, AMOUNT: VISS.VALUE, ENTRY_TYPE_ID: VISS.ENTRY_TYPE_ID, TOTAL_AMT: VISS.TOTAL_AMT };
                    VISS.vouchernumbervisible = (VISS.VOUCHER_TYPE == 'Pre-Defined' ? true : false);
                    VISS.ID == 0 && !VISS.IS_REDEEMED ? VISS_COUNT++ : '';
                    VISS.ID == 0 && VISS.IS_REDEEMED ? VISR_COUNT++ : '';
                }
                if (VISS.ENTRY_TYPE_ID == 3) {
                    VISS.ID == 0 && !VISS.IS_REDEEMED ? DISS_COUNT++ : '';
                    VISS.ID == 0 && VISS.IS_REDEEMED ? DIPR_COUNT++ : '';
                }
            });
            if ($scope.$parent.CASHUP.AUTOVALIDVOUCHER) {
                $scope.VoucherIssuedList = $scope.$parent.CASHUP.AUTOVALID_VOUCHER;
                $scope.GET_CASHUP_BY_ID();
            }


            $scope.GET_ENTITY_STAFF();
            $scope.GET_PAYMENT_METHODS();
            $scope.GET_OPEN_VOUCHER_DETAILS(1);
            $scope.GET_OPEN_VOUCHER_DETAILS_SEARCH();
            if (!$scope.$parent.CASHUP.AUTOVALIDVOUCHER) {
                VISS_COUNT == 0 ? $scope.VoucherIssuedList.push(angular.copy($scope.BlankVoucherIssued)) : '';
                VISR_COUNT == 0 ? $scope.VoucherIssuedList.push(angular.copy($scope.BlankVoucherRedeem)) : '';
            }
            $scope.$parent.CASHUP.AUTOVALIDVOUCHER = false;
        });
    };
   // GET_ENTRY_MASTER_DETAILS();
    //function GET_ENTRY_MASTER_DETAILS() {
    $scope.GET_ENTRY_MASTER_DETAILS = function () {
         
        var CashupModelObj = new Object();
        CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CashupModelObj.BRANCH_ID = $scope.$parent.CASHUP.BRANCH_ID;
        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_ENTRY_MASTER_DETAILS').then(function (data) {
            if (data != undefined && data.data != undefined) {
                $scope.MasterEntryList = data.data.Table;               
                $scope.GET_ENTRY_TYPE_DECLARATION();
            }
           
            $scope.$parent.overlay_loadingNew = 'none';
        });
         
        if ($scope.$parent.CASHUP.EPOS_DATA.length > 0) {
            // $scope.$parent.CASHUP.EPOS_DATA.filter(function (x) {
            for (var i = 0; i < $scope.$parent.CASHUP.EPOS_DATA.length; i++) {
                if ($scope.$parent.CASHUP.EPOS_DATA[i].MEDIA == 'Gift' || $scope.$parent.CASHUP.EPOS_DATA[i].MEDIA == 'GIFT (external)' || $scope.$parent.CASHUP.EPOS_DATA[i].MEDIA == 'Voucher - Gift Pro') {
                    $scope.DFlag = true;
                    break;
                } else {
                    $scope.DFlag = false;
                }
            }
            // });
        } else {
            $scope.DFlag = false;
        }
        $scope.VARIANCE_REDEEMED1 = 0;
        if ($scope.DFlag == false) {
            $scope.VARIANCE_REDEEMED1 = ($scope.$parent.CASHUP.REDEEMED_TOTAL);
        }
    }
    $scope.GET_ENTRY_MASTER_DETAILS();
  

    $scope.GET_ENTITY_STAFF = function () {
        var CashupModelObj = new Object();
        CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CashupModelObj.BRANCH_ID = $scope.$parent.CASHUP.BRANCH_ID;

        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_ENTITY_STAFF').then(function (data) {

            if (data != undefined && data.data != undefined && data.data.length > 0) {
                //  $scope.BlankPettyCash.StaffList = data.data;
                $scope.StaffList = data.data;
                //var PCASHCOUNT = 0;
                //angular.forEach($scope.PettyCashList, function (PCash) {
                //    PCash.CategoryList = $scope.CategoryList;
                //    PCash.StaffList = data.data;
                //    PCash.ID == 0 ? PCASHCOUNT++ : '';
                //    PCash.PETTY_CASH_CATEGORY_VALID = true;
                //    PCash.TOTAL_VALUE_VALID = true;
                //    PCash.AUTHORIZED_BY_ID_VALID = true;
                //});
                //PCASHCOUNT == 0 ? $scope.PettyCashList.push(angular.copy($scope.BlankPettyCash)) : '';
            }

        });
    };

    $scope.GET_PAYMENT_METHODS = function () {
        var CashupModelObj = new Object();
        CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CashupModelObj.TYPE_ID = 2;
        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_PAYMENT_METHODS').then(function (data) {
             
            if (data != undefined && data.data != undefined) {
               // $scope.PaymentList = data.data.Table;
                $scope.PAYMENT_METHODS = data.data.Table.filter(function (x) { return x.FLAG == 3 });
                $scope.PAYMENT_METHODS_RECEIVED = data.data.Table.filter(function (x) { return x.FLAG == 2 || x.FLAG == 3 });
            } else {
                $scope.PaymentList = null;
            }

        });
    }
  
    $scope.RESETPAGESEARCH = function () {
        $scope.CommonSearch.INVOICE_NUMBER = null;
        $scope.CommonSearch.VOUCHER_REFERENCE = null;
        $scope.CommonSearch.PAYMENT_MODE_ID = null;
        $scope.CommonSearch.CUSTOMER_NAME = null;
        $scope.CommonSearch.VOUCHER_TYPE = null;
        $scope.GET_OPEN_VOUCHER_DETAILS(1);

    }
    //-------------------------------------------
    $scope.CODE_ARRY = [];
    $scope.$on('ngRepeatFinishedRender', function (ngRepeatFinishedEvent) {
        $scope.CODE_ARRY = $scope.COPY_CODE_ARRY;
    });
    $scope.SetVoucherValues_basisType = function (VISS) {

        VISS.VOUCHER = null;
        VISS.VALUE = null;
        VISS.CODE = null;
        VISS.VALIDITY_DATE = null;
        VISS.ENTRY_TYPE_DETAIL_ID = null;
        if (VISS.VOUCHER_TYPE == 'Open Voucher') {
            VISS.vouchernumbervisible = false;
        }
        else {
            VISS.vouchernumbervisible = true;
        }
    };
    $scope.SetVoucherValues = function (VISS) {

        if (VISS.ENTRY_TYPE_DETAIL_ID == null) {
            VISS.VALUE = null;
            VISS.CODE = null;
            VISS.VALIDITY_DATE = null;
        }
        else {

            angular.forEach($scope.MasterEntryList, function (value) {
                if (value.ID == VISS.ENTRY_TYPE_DETAIL_ID && value.ENTRY_TYPE_ID == 1) {
                    VISS.VALUE = value.AMOUNT;
                    VISS.CODE = value.CODE;
                    VISS.VALIDITY_DATE = value.VALIDITY_DATE;
                    VISS.ENTRY_TYPE_DETAIL_ID = value.VOUCHER.ID;
                }
            });

        }
    };
    $scope.SetValues = function (VISS, IndexVal) {
        
        $scope.CHK_LAST_VALUE = 0;
        angular.forEach($scope.MasterEntryList_Redeemed_Search, function (value) {
            //if (value.CODE == VISS.CODE && value.ENTRY_TYPE_ID == 1 && value.IS_REDEEMED == false && value.ENTRY_TYPE_DETAIL_ID!=null) {
            if (value.CODE == VISS.CODE && value.ENTRY_TYPE_ID == 1 && value.IS_REDEEMED == false) {
                VISS.TOTAL_AMT = value.VALUE;
                VISS.VALUE = value.REMAINING_VALUE;
                VISS.CODE = value.CODE;
                VISS.VALIDITY_DATE = value.VALIDITY_DATE;
                VISS.MODE = value.MODE;
                VISS.PAYMENT_METHOD_ID = value.PAYMENT_METHOD_ID;
                VISS.CHECK_NO = value.CHECK_NO;
                VISS.ENTRY_TYPE_DETAIL_ID = value.ID;
                VISS.CUSTOMER_NAME = value.CUSTOMER_NAME;
                VISS.NOTE = value.NOTE;
                $scope.CHK_LAST_VALUE = value.REMAINING_VALUE;
            }
        });
    };
    $scope.CheckDecimal = function (VISS) {

        if (VISS.VALUE == '.') {
            VISS.VALUE = '';
        }
        //if ($scope.$parent.CASHUP.EPOS_DATA.length > 0) {
        //    // $scope.$parent.CASHUP.EPOS_DATA.filter(function (x) {
        //    for (var i = 0; i < $scope.$parent.CASHUP.EPOS_DATA.length; i++) {
        //        if ($scope.$parent.CASHUP.EPOS_DATA[i].MEDIA == 'Gift' || $scope.$parent.CASHUP.EPOS_DATA[i].MEDIA == 'GIFT (external)' || $scope.$parent.CASHUP.EPOS_DATA[i].MEDIA == 'Voucher - Gift Pro') {
        //            $scope.DFlag = true;
        //            break;
        //        } else {
        //            $scope.DFlag = false;
        //        }
        //    }
        //    // });
        //} else {
        //    $scope.DFlag = false;
        //}
        //$scope.VARIANCE_REDEEMED1 = 0;
        //if ($scope.DFlag == false) {
        //    $scope.VARIANCE_REDEEMED1 = ($scope.$parent.CASHUP.REDEEMED_TOTAL);
        //}

    };
    //------------------------Select Redeeemed Data----------------------
    $scope.SelectedRedeemedPopup = function () {
      //  $scope.RedeemedFlag = true;       
        //$scope.AddVoucherFlag = true;
        $scope.InsertEntry_TypeDeclaration(0);       
       // GET_ENTRY_MASTER_DETAILS();        
        $("#Vouchers_Receipts").modal('show');
        
    }
    $scope.SelectRedeemed = function () {

        $scope.GET_ENTRY_TYPE_DECLARATION_BYSELECTVOUCHER();
    }


    $scope.GET_ENTRY_TYPE_DECLARATION_BYSELECTVOUCHER = function () {

        var CashupModelObj = new Object();
        CashupModelObj.ID = $scope.$parent.CASHUP.ID;

        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_ENTRY_TYPE_DECLARATION').then(function (data) {

            var VISS_COUNT = 0;
            var VISR_COUNT = 0;

            $scope.VoucherIssuedList = [];
            if (data != undefined && data.data != undefined) {
                $scope.VoucherIssuedList = angular.copy($filter('filter')(data.data.Table, { ENTRY_TYPE_ID: 1 }));//$filter('orderBy')(data.data.Table, 'ID');
                $scope.VoucherIssuedList = $filter('orderBy')($scope.VoucherIssuedList, 'ID');

            }
            angular.forEach($scope.VoucherIssuedList, function (VISS) {
                if (VISS.ENTRY_TYPE_ID == 1) {
                    VISS.VOUCHER = { ID: VISS.ENTRY_TYPE_DETAIL_ID, CODE: VISS.CODE, VALIDITY_DATE: VISS.VALIDITY_DATE, AMOUNT: VISS.VALUE, ENTRY_TYPE_ID: VISS.ENTRY_TYPE_ID };
                    VISS.vouchernumbervisible = (VISS.VOUCHER_TYPE == 'Pre-Defined' ? true : false);
                    VISS.ID == 0 && !VISS.IS_REDEEMED ? VISS_COUNT++ : '';
                    VISS.ID == 0 && VISS.IS_REDEEMED ? VISR_COUNT++ : '';
                }
                if (VISS.ENTRY_TYPE_ID == 3) {
                    VISS.ID == 0 && !VISS.IS_REDEEMED ? DISS_COUNT++ : '';
                    VISS.ID == 0 && VISS.IS_REDEEMED ? DIPR_COUNT++ : '';
                }
            });

            var len = 0;
            angular.forEach($scope.MasterEntryList_Redeemed, function (RedeemVal) {
                if (RedeemVal.IS_CHECKED) {
                    if (RedeemVal.ENTRY_TYPE_ID == 1 && RedeemVal.IS_REDEEMED == false) {
                        var obj = { ID: 0, ENTRY_TYPE_ID: 1, ENTRY_TYPE_DETAIL_ID: RedeemVal.ID, VOUCHER_TYPE: RedeemVal.VOUCHER_TYPE, CODE: RedeemVal.CODE, VOUCHER: null, VALUE: RedeemVal.REMAINING_VALUE, VALIDITY_DATE: RedeemVal.VALIDITY_DATE, CUSTOMER_NAME: RedeemVal.CUSTOMER_NAME, MODE: RedeemVal.PAYMENT_METHOD_NAME, CHECK_NO: RedeemVal.CHECK_NO, NOTE: RedeemVal.NOTE, IS_REDEEMED: true, IS_DELETED: 0, PAYMENT_METHOD_ID: RedeemVal.PAYMENT_METHOD_ID, IS_CHECKED: true, TOTAL_AMT: RedeemVal.VALUE, IS_CANCELLED: RedeemVal.IS_CANCELLED };
                        $scope.VoucherIssuedList.push(angular.copy(obj))
                        //$scope.BlankDepositRedeem = { ID: 0, ENTRY_TYPE_ID: 3, ENTRY_TYPE_DETAIL_ID: 0, VOUCHER_TYPE: null, CODE: null, VOUCHER: null, VALUE: '', VALIDITY_DATE: '', CUSTOMER_NAME: '', MODE: null, CHECK_NO: '', NOTE: '', IS_REDEEMED: true, IS_DELETED: 0 };
                        len++;
                    }
                }
            })
            if (len == 0) {
                $scope.VoucherIssuedList.push(angular.copy($scope.BlankVoucherRedeem));
            }
            $scope.CHK_LAST_VALUE = 0;
            angular.forEach($scope.VoucherIssuedList, function (Red_Chek) {
                if (Red_Chek.IS_REDEEMED == true && Red_Chek.ENTRY_TYPE_ID == 1 && Red_Chek.ID == 0 && Red_Chek.VALUE != '') {
                    $scope.CHK_LAST_VALUE = Red_Chek.VALUE;
                }
            })
            $("#Vouchers_Receipts").modal('hide');

            if ($scope.$parent.CASHUP.AUTOVALIDVOUCHER) {
                $scope.VoucherIssuedList = $scope.$parent.CASHUP.AUTOVALID_VOUCHER;
                
            }
             
            if (!$scope.$parent.CASHUP.AUTOVALIDVOUCHER) {
                VISS_COUNT == 0 ? $scope.VoucherIssuedList.push(angular.copy($scope.BlankVoucherIssued)) : '';                
               //VISR_COUNT == 0 ? $scope.VoucherIssuedList.push(angular.copy($scope.BlankVoucherRedeem)) : '';
            }
           
            $scope.CommonSearch.INVOICE_NUMBER = null;
            $scope.CommonSearch.VOUCHER_REFERENCE = null;
            $scope.CommonSearch.PAYMENT_MODE_ID = null;
            $scope.CommonSearch.CUSTOMER_NAME = null;
            $scope.CommonSearch.VOUCHER_TYPE = null;
            //$scope.InsertEntry_TypeDeclaration();
          //$scope.GET_ENTRY_MASTER_DETAILS();
        });
    };


    $scope.SET_VALUECHECK = function (val) {
        
        if ($scope.CHK_LAST_VALUE != 0) {
            if (val.VALUE > $scope.CHK_LAST_VALUE) {
                $scope.$parent.ShowAlert("Attention", "Redeemed Amount is not greater than remaining amount.", 3000);
                //   alert("Amount is not greater than remaining value. ");
                val.VALUE = $scope.CHK_LAST_VALUE;
            }
        }
    }
    $scope.CHK_INVOICE_NO = function (val) {
        
        if (val.CHECK_NO != null && val.CHECK_NO != "") {
            angular.forEach($scope.MasterEntryList_Redeemed_Search, function (value) {
                if (value.CHECK_NO == val.CHECK_NO && value.ENTRY_TYPE_ID == 1 && value.IS_REDEEMED == false) {
                    $scope.$parent.ShowAlert("Attention", "This Invoice No already present in voucher redeem list", 3000);
                    val.CHECK_NO = '';
                }
            });
        }
    }

    //----------------------------------------

    $scope.ValidControls = function (x) {
       // x.ENTRY_TYPE_DETAIL_ID == "" || x.ENTRY_TYPE_DETAIL_ID == undefined ? x.ENTRY_TYPE_DETAIL_ID = null : '';
        if ($scope.$parent.CASHUP.VOUCHERVALID) {
            x.CODE_VALID = true;
            x.VALUE_VALID = true;
            x.PAYMENT_METHOD_ID_VALID = true;
            x.CHECK_NO_VALID = true;
        }
    }
    $scope.ValidateVoucherIssue = function () {
         
        $scope.$parent.CASHUP.VOUCHERVALID = true;
        angular.forEach($scope.VoucherIssuedList, function (x) {
            x.CODE_VALID = true;
            x.VALUE_VALID = true;
            x.PAYMENT_METHOD_ID_VALID = true;
            x.CHECK_NO_VALID = true;

            if ( x.ENTRY_TYPE_ID == 1 && (x.IS_DELETED == 0)) {
                if (x.VOUCHER_TYPE == 'Pre-Defined') {
                    if ((x.CODE != null && x.CODE != "") || (x.VALUE != null && x.VALUE != "") || (x.PAYMENT_METHOD_ID != null && x.PAYMENT_METHOD_ID != "") || (x.CHECK_NO != null && x.CHECK_NO != "") || (x.VALIDITY_DATE != null && x.VALIDITY_DATE != "") || (x.CUSTOMER_NAME != null && x.CUSTOMER_NAME != "")) {
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
                } else {
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
            }
             
            if (!x.CODE_VALID || !x.VALUE_VALID || !x.PAYMENT_METHOD_ID_VALID || !x.CHECK_NO_VALID) {
                $scope.$parent.CASHUP.VOUCHERVALID = false;
            }
        });
        if ($scope.$parent.CASHUP.VOUCHERVALID == false) {
            if ($scope.VoucherIssuedList.length > 0) {
                $scope.$parent.CASHUP.AUTOVALID_VOUCHER = $scope.VoucherIssuedList;
            }
        }
    }
    $scope.InsertEntry_TypeDeclaration = function (IS_VALIDATE) {
        
        if (IS_VALIDATE == undefined) {
            $scope.ValidateVoucherIssue();
        } else {
            $scope.$parent.CASHUP.VOUCHERVALID = true;
        }
        if ($scope.$parent.CASHUP.VOUCHERVALID) {
            var VoucherList = [];
            var cnt = 0;
            angular.forEach($scope.VoucherIssuedList, function (voucherissue) {
                if (voucherissue.VALUE != undefined && voucherissue.VALUE != '' && voucherissue.VALUE != '0' && voucherissue.ENTRY_TYPE_ID == 1 && voucherissue.CODE != null && voucherissue.CODE != "" && voucherissue.CODE != undefined && voucherissue.CHECK_NO != null && voucherissue.CHECK_NO != "" && voucherissue.CHECK_NO != 0 && voucherissue.PAYMENT_METHOD_ID != null && voucherissue.PAYMENT_METHOD_ID != "") {
                    
                    var voucher = new Object();
                    voucher.ID = voucherissue.ID;
                    voucher.ENTRY_TYPE_ID = voucherissue.ENTRY_TYPE_ID;
                    voucher.ENTRY_TYPE_DETAIL_ID = voucherissue.ENTRY_TYPE_DETAIL_ID;
                    voucher.VOUCHER_TYPE = voucherissue.VOUCHER_TYPE;
                    voucher.CODE = voucherissue.CODE != null ? voucherissue.CODE : "";
                    voucher.VALUE = parseFloat(voucherissue.VALUE).toFixed(2);
                    voucher.VALIDITY_DATE = (voucherissue.VALIDITY_DATE == null || voucherissue.VALIDITY_DATE == "") ? "" : voucherissue.VALIDITY_DATE;
                    voucher.CUSTOMER_NAME = voucherissue.CUSTOMER_NAME;
                    voucher.MODE = voucherissue.MODE;
                    voucher.PAYMENT_METHOD_ID = voucherissue.PAYMENT_METHOD_ID;
                    //voucher.MODE = voucherissue.PAYMENT_METHOD.METHOD_NAME;
                    //voucher.PAYMENT_METHOD_ID = voucherissue.PAYMENT_METHOD.PAYMENT_METHOD_ID;
                    voucher.CHECK_NO = voucherissue.CHECK_NO;
                    voucher.NOTE = voucherissue.NOTE;
                    voucher.IS_REDEEMED = voucherissue.IS_REDEEMED;
                    voucher.IS_COMPLIMENTARY = false;
                    voucher.IS_DELETED = voucherissue.IS_DELETED;
                    voucher.IS_CANCELLED = voucherissue.IS_CANCELLED != null && voucherissue.IS_CANCELLED != "" ? voucherissue.IS_CANCELLED : false;
                    voucher.TOTAL_AMT = voucherissue.TOTAL_AMT != null ? voucherissue.TOTAL_AMT : voucherissue.VALUE;
                    VoucherList[cnt] = voucher;
                    cnt++;
                }
                //else {
                //    if (voucherissue.IS_REDEEMED == false && voucherissue.ENTRY_TYPE_ID == 1) {
                //        
                //        $scope.RedeemedFlag = false;
                //        $scope.VoucherRedeemed.push(voucherissue);                        
                //    }
                //}
            })
             
            var ISSUE_TOTAL = 0;
            var REDEEMED_TOTAL = 0;
            VoucherList.filter(function (x) {
                if (x.IS_REDEEMED == false && x.ENTRY_TYPE_ID == 1 && x.IS_DELETED == 0) {
                    ISSUE_TOTAL += parseFloat(x.VALUE);
                }
            });
            VoucherList.filter(function (x) {
                if (x.IS_REDEEMED == true && x.ENTRY_TYPE_ID == 1 && x.IS_DELETED == 0) {
                    REDEEMED_TOTAL += parseFloat(x.VALUE);
                }
            });
            var CashupModelObj = new Object();
            CashupModelObj.ID = $scope.$parent.CASHUP.ID;
            CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            CashupModelObj.BRANCH_ID = $scope.$parent.CASHUP.BRANCH_ID;
            CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
            CashupModelObj.ISSUE_TOTAL = ISSUE_TOTAL; //$scope.$parent.CASHUP.ISSUE_TOTAL;
            CashupModelObj.REDEEMED_TOTAL = REDEEMED_TOTAL;//$scope.$parent.CASHUP.REDEEMED_TOTAL;
            CashupModelObj.DECLARATION_DETAILS = VoucherList;
            CashupModelObj.STEP_NO = 8;
             
            PrcCommMethods.CASHUP_API(CashupModelObj, 'INS_ENTRY_TYPE_DECLARATION').then(function (data) {
                $scope.TabValid = true;
                if ($scope.CASHUP.KeyColor == "Vouchers") {
                    $scope.GET_ENTRY_MASTER_DETAILS();
                }
                //if ($scope.AddVoucherFlag) {                   
                //    GET_ENTRY_MASTER_DETAILS();                  
                //}
            });
        }
    };
  
    $scope.NextLink = function (val) {
         
        $scope.TabValid = false;
        $scope.AddVoucherFlag = false;
        $scope.KeyColor = val;
        $scope.$parent.CASHUP.AUTOVALIDVOUCHER = false;
        $scope.InsertEntry_TypeDeclaration();
        if ($scope.$parent.CASHUP.VOUCHERVALID) {
            if ($scope.$parent.CASHUP.TABLIST[8].FLAG == 1) {
                $location.path("Deposits").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
            } else if ($scope.$parent.CASHUP.TABLIST[9].FLAG == 1) {
                $location.path("Complimentary").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
            }
        } else {
            $scope.TabValid = true;
        }

    }
    $scope.PreviousLink = function () {
         
        $scope.TabValid = false;
        $scope.AddVoucherFlag = false;
        $scope.$parent.CASHUP.AUTOVALIDVOUCHER = false;
        $scope.InsertEntry_TypeDeclaration();
        if ($scope.$parent.CASHUP.VOUCHERVALID) {
            if ($scope.$parent.CASHUP.TABLIST[6].FLAG == 1) {
                $location.path("AccountCustomer").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
            } else if ($scope.$parent.CASHUP.TABLIST[5].FLAG == 1) {
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
        } else {
            $scope.TabValid = true;
        }

    }
    $scope.$on('$destroy', function () {
         
        if ($scope.TabValid) {
            $scope.AddVoucherFlag = false;
            if ($scope.$parent.CASHUP.FG == null) {
            $scope.ValidateVoucherIssue();
            if ($scope.$parent.CASHUP.VOUCHERVALID) {
                if ($scope.VoucherIssuedList.length > 0) {
                    $scope.InsertEntry_TypeDeclaration();
                    $scope.$parent.CASHUP.AUTOVALIDVOUCHER = false;
                }
            } else {
                if ($scope.$parent.CASHUP.AUTOVALID_VOUCHER.length > 0) {
                    $scope.$parent.CASHUP.AUTOVALIDVOUCHER = true;

                    $location.path("Vouchers").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });

                } else {
                    $location.path("Vouchers").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
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

        $scope.TabValid = false;
        $scope.AddVoucherFlag = false;
        $scope.KeyColor = val;
        $scope.$parent.CASHUP.AUTOVALIDVOUCHER = false;
      
            if ($scope.$parent.CASHUP.TABLIST[8].FLAG == 1) {
                $location.path("Deposits_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
            } else if ($scope.$parent.CASHUP.TABLIST[9].FLAG == 1) {
                $location.path("Complimentary_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
            }
       

    }
    $scope.PreviousLink_View = function () {

        $scope.TabValid = false;
        $scope.AddVoucherFlag = false;
        $scope.$parent.CASHUP.AUTOVALIDVOUCHER = false;
        
            if ($scope.$parent.CASHUP.TABLIST[6].FLAG == 1) {
                $location.path("AccountCustomer_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
            } else if ($scope.$parent.CASHUP.TABLIST[5].FLAG == 1) {
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
});