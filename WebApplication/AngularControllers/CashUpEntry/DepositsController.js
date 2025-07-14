app.controller('DepositsController', function ($scope, $http, $interval, CommService, $cookies, $filter, PrcCommMethods, $location, readFileData, readFileDataNew, $sce) {

    $scope.$parent.CASHUP.ID = getUrlParameter('CHID', $location.absUrl());
    $scope.$parent.CASHUP.KeyColor = "Deposits";
    if ($scope.$parent.CASHUP.ACTUAL_STEP_NO <= 9) {
        $scope.$parent.CASHUP.ACTUAL_STEP_NO = 9;
    }
    $scope.TabValid = true;
    $scope.$parent.overlay_loadingNew = 'block';
    // $scope.DFlag = true;
    $scope.VoucherIssuedList = [];
    $scope.VoucherRedeemedList = [];
    $scope.BlankDepositRecieved = { ID: 0, ENTRY_TYPE_ID: 3, ENTRY_TYPE_DETAIL_ID: 0, VOUCHER_TYPE: null, CODE: null, VOUCHER: null, VALUE: '', VALIDITY_DATE: '', CUSTOMER_NAME: '', MODE: null, CHECK_NO: '', NOTE: '', IS_REDEEMED: false, IS_DELETED: 0, AUTHORIZED_BY: null, METHOD_NAME: null, PAYMENT_METHOD_ID: null, TOTAL_AMT: null, UPLOAD_IDS: '', FILE_NAME:'' };
    $scope.BlankDepositRedeem = { ID: 0, ENTRY_TYPE_ID: 3, ENTRY_TYPE_DETAIL_ID: 0, VOUCHER_TYPE: null, CODE: null, VOUCHER: null, VALUE: '', VALIDITY_DATE: '', CUSTOMER_NAME: '', MODE: null, CHECK_NO: '', NOTE: '', IS_REDEEMED: true, IS_DELETED: 0, IS_CHECKED: false, METHOD_NAME: null, PAYMENT_METHOD_ID: null, TOTAL_AMT: null, UPLOAD_IDS: '', FILE_NAME: '',UPL_FLAG:true };
    $scope.AddDepFlag = false;
    $scope.SetPayment = function (VISS, PaymentMethodId) {

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

    $scope.DepositRecievedLine = function () {
        $scope.AddDepFlag = true;
        $scope.TabValid = true;
        $scope.ValidateDepositeIssue();
        if ($scope.$parent.CASHUP.DEPOSITSVALID) {
            $scope.InsertEntry_DepositDeclaration();
            if ($scope.$parent.CASHUP.AUTOVALIDDEPOSITE) {
                $scope.VoucherIssuedList.push(angular.copy($scope.BlankDepositRecieved));
                $scope.$parent.CASHUP.AUTOVALIDDEPOSITE = false;

            }
        }
        $scope.DepositeSearch.INVOICENUMBER = null;
        $scope.DepositeSearch.DEPOSIT_REFERENCE = null;
        $scope.DepositeSearch.PAYMENT_MODE_ID = null;
        $scope.DepositeSearch.PAYEE_NAME = null;
        //var VoucherIssueFilter = angular.copy($filter('filter')($scope.VoucherIssuedList, { ENTRY_TYPE_ID: 3, IS_REDEEMED: false, IS_DELETED: 0,ID:0 }));
        //if (VoucherIssueFilter.length == 0) {
        //    $scope.VoucherIssuedList.push(angular.copy($scope.BlankDepositRecieved));
        //}

    };
    $scope.DepositRedeemLine = function () {
        $scope.AddDepFlag = true;
        $scope.TabValid = true;

        $scope.VoucherIssuedList.filter(function (x) {
            if (x.ENTRY_TYPE_ID == 3 && x.IS_REDEEMED == true && x.ID == 0 && x.VALUE != '') {
                x.MODE = x.MODE == null ? 'Deposit Redeemed' : x.MODE;
                x.PAYMENT_METHOD_ID = x.PAYMENT_METHOD_ID == null ? '21':x.PAYMENT_METHOD_ID;
            }
        });
        $scope.ValidateDepositeIssue();
        if ($scope.$parent.CASHUP.DEPOSITSVALID) {
            $scope.InsertEntry_DepositDeclaration();
            if ($scope.$parent.CASHUP.AUTOVALIDDEPOSITE) {
                $scope.VoucherIssuedList.push(angular.copy($scope.BlankDepositRedeem));
                $scope.$parent.CASHUP.AUTOVALIDDEPOSITE = false;

            }
        }
        // $scope.InsertEntry_DepositDeclaration();       
    };


    $scope.DeleteVoucherLine = function (Array, index, IS_REDEEMED, ENTRY_TYPE_ID, VISS) {

        if (VISS.ID == undefined || VISS.ID == 0) {

            if (Array.length == 1) {
                if (VISS.CHECK_NO != '' || VISS.CODE != null || VISS.TOTAL_AMT != null || VISS.VALUE != '' || VISS.VALIDITY_DATE != '' || VISS.PAYMENT_METHOD_ID != null || VISS.CUSTOMER_NAME != '' || VISS.NOTE != '') {
                    if (confirm("Are you sure, You want to delete the record ?")) {
                        VISS.IS_DELETED = 1;
                        // alert("Are you sure, You want to delete the record ?");
                        $scope.VoucherIssuedList.push(angular.copy($scope.BlankDepositRedeem));
                    }
                }
            } else {
                // Array.splice(index, 1);    
                if (VISS.CHECK_NO != '' || VISS.CODE != null || VISS.TOTAL_AMT != null || VISS.VALUE != '' || VISS.VALIDITY_DATE != '' || VISS.PAYMENT_METHOD_ID != null || VISS.CUSTOMER_NAME != '' || VISS.NOTE != '') {
                    if (confirm("Are you sure, You want to delete the record ?")) {
                        angular.forEach($scope.DepositsList, function (Depval) {
                            angular.forEach($scope.VoucherIssuedList, function (Vouchval) {
                                if (Depval.CHECK_NO == Vouchval.CHECK_NO && Vouchval.ENTRY_TYPE_DETAIL_ID == VISS.ENTRY_TYPE_DETAIL_ID && Vouchval.ID == 0 && Vouchval.IS_REDEEMED == true && Vouchval.ENTRY_TYPE_ID == 3) {
                                    Depval.IS_CHECKED = false;
                                }
                            })
                        })
                        var len = $scope.VoucherIssuedList.length - 1;
                        for (var i = len; i >= 0; i--) {
                            if ($scope.VoucherIssuedList[i].ID == 0 && $scope.VoucherIssuedList[i].IS_REDEEMED == true && $scope.VoucherIssuedList[i].ENTRY_TYPE_ID == 3 && $scope.VoucherIssuedList[i].ENTRY_TYPE_DETAIL_ID == VISS.ENTRY_TYPE_DETAIL_ID) {
                                $scope.VoucherIssuedList.splice(i, 1);
                                $scope.VoucherIssuedList.push(angular.copy($scope.BlankDepositRedeem));
                                break;
                            }
                        }

                        var len1 = 0;
                        angular.forEach($scope.VoucherIssuedList, function (item) {
                            if (item.IS_DELETED == 0 && item.IS_REDEEMED == true && item.ENTRY_TYPE_ID == 3) {
                                len1 = len1 + 1;
                            }
                        })
                        if (len1 == 0) {
                            $scope.VoucherIssuedList.push(angular.copy($scope.BlankDepositRedeem));
                        }
                    }
                }
            }

        } else {
            if (confirm("Are you sure, You want to delete the record ?")) {
                var len = $scope.VoucherIssuedList.length - 1;
                var count = 0;
                angular.forEach($scope.VoucherIssuedList, function (val) {
                    if (val.IS_REDEEMED == true && val.ENTRY_TYPE_ID == 3) {
                        count = count + 1;
                    }
                })
                var Cnt = 0;
                for (var i = len; i >= 0; i--) {
                    if ($scope.VoucherIssuedList[i].IS_REDEEMED == true && $scope.VoucherIssuedList[i].ENTRY_TYPE_ID == 3) {
                        VISS.IS_DELETED = 1;
                        //arr.push(item);
                        // $scope.VoucherIssuedList.splice(i, 1);
                        break;
                    }
                }
                angular.forEach($scope.VoucherIssuedList, function (val) {
                    if (val.IS_REDEEMED == true && val.ENTRY_TYPE_ID == 3 && val.IS_DELETED == 1) {
                        Cnt = Cnt + 1;
                    }
                })
                if (count == Cnt) {
                    // alert("Are you sure, You want to delete the record?");
                    $scope.VoucherIssuedList.push(angular.copy($scope.BlankDepositRedeem));
                }
                $scope.InsertEntry_DepositDeclaration();
                //GET_ENTRY_MASTER_DETAILS();
            }
        }
        $scope.COMMON_CODE_CHANGE();
        $scope.$parent.CASHUP.DEPOSITSVALID = true;
    };

    $scope.DeleteLine = function (Array, index, IS_REDEEMED, ENTRY_TYPE_ID, VISS) {

        if (VISS.ID == undefined || VISS.ID == 0) {

            if (Array.length == 1) {
                if (VISS.CHECK_NO != '' || VISS.CODE != null || VISS.VALUE != '' || VISS.VALIDITY_DATE != '' || VISS.PAYMENT_METHOD_ID != null || VISS.CUSTOMER_NAME != '' || VISS.NOTE != '') {
                    if (confirm("Are you sure, You want to delete the record ?")) {
                        VISS.IS_DELETED = 1;
                        //   alert("Are you sure, You want to delete the record ?");
                        $scope.VoucherIssuedList.push(angular.copy($scope.BlankDepositRecieved));
                    }
                }
            } else {
                // Array.splice(index, 1);             
                // $scope.VoucherIssuedList.splice(index+1, 1);
                if (VISS.CHECK_NO != '' || VISS.CODE != null || VISS.VALUE != '' || VISS.VALIDITY_DATE != '' || VISS.PAYMENT_METHOD_ID != null || VISS.CUSTOMER_NAME != '' || VISS.NOTE != '') {
                    if (confirm("Are you sure, You want to delete the record ?")) {
                        var len = $scope.VoucherIssuedList.length - 1;
                        for (var i = len; i >= 0; i--) {
                            if ($scope.VoucherIssuedList[i].ID == 0 && $scope.VoucherIssuedList[i].IS_REDEEMED == false && $scope.VoucherIssuedList[i].ENTRY_TYPE_ID == 3) {
                                $scope.VoucherIssuedList.splice(i, 1);
                                $scope.VoucherIssuedList.push(angular.copy($scope.BlankDepositRecieved));
                                break;
                            }
                        }
                        var len1 = 0;
                        angular.forEach($scope.VoucherIssuedList, function (item) {
                            if (item.IS_DELETED == 0 && item.IS_REDEEMED == false && item.ENTRY_TYPE_ID == 3) {
                                len1 = len1 + 1;
                            }
                        })
                        if (len1 == 0) {
                            $scope.VoucherIssuedList.push(angular.copy($scope.BlankDepositRecieved));
                        }
                    }
                }
            }

        } else {
            if (confirm("Are you sure, You want to delete the record ?")) {
                var len = $scope.VoucherIssuedList.length - 1;
                var count = 0;
                angular.forEach($scope.VoucherIssuedList, function (val) {
                    if (val.IS_REDEEMED == false && val.ENTRY_TYPE_ID == 3) {
                        count = count + 1;
                    }
                })
                var Cnt = 0;
                for (var i = len; i >= 0; i--) {
                    if ($scope.VoucherIssuedList[i].IS_REDEEMED == false && $scope.VoucherIssuedList[i].ENTRY_TYPE_ID == 3) {
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
                    //  alert("Are you sure, You want to delete the record?");
                    // $scope.VoucherIssuedList.push(angular.copy($scope.BlankDepositRecieved));
                }
                $scope.InsertEntry_DepositDeclaration();
                //GET_ENTRY_MASTER_DETAILS();
            }
        }
        $scope.COMMON_CODE_CHANGE();
        $scope.$parent.CASHUP.DEPOSITSVALID = true;
    };
    $scope.GET_ENTRY_TYPE_DECLARATION = function () {

        var CashupModelObj = new Object();
        CashupModelObj.ID = $scope.$parent.CASHUP.ID;
        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_ENTRY_TYPE_DECLARATION').then(function (data) {
             
            var DISS_COUNT = 0;
            var DIPR_COUNT = 0;
            $scope.VoucherIssuedList = [];
            if (data != undefined && data.data != undefined) {
                $scope.VoucherIssuedList = data.data.Table;
                $scope.VoucherIssuedList = $filter('orderBy')($scope.VoucherIssuedList, 'ID');
                $scope.GET_DEPOSITS(1);
            }
            angular.forEach($scope.VoucherIssuedList, function (VISS) {
                if (VISS.ENTRY_TYPE_ID == 3) {
                    VISS.ID == 0 && !VISS.IS_REDEEMED ? DISS_COUNT++ : '';
                    VISS.ID == 0 && VISS.IS_REDEEMED ? DIPR_COUNT++ : '';
                }
            });

            if ($scope.$parent.CASHUP.AUTOVALIDDEPOSITE) {
                $scope.VoucherIssuedList = $scope.$parent.CASHUP.AUTOVALID_DEPOSITE;
                $scope.GET_CASHUP_BY_ID();

            }
            $scope.GET_ENTITY_STAFF();
            $scope.GET_PAYMENT_METHODS();
            $scope.GET_DEPOSITSLIST();
           
            if (!$scope.$parent.CASHUP.AUTOVALIDDEPOSITE) {
                DIPR_COUNT == 0 ? $scope.VoucherIssuedList.push({ ID: 0, ENTRY_TYPE_ID: 3, ENTRY_TYPE_DETAIL_ID: 0, VOUCHER_TYPE: null, CODE: null, VOUCHER: null, VALUE: '', VALIDITY_DATE: '', CUSTOMER_NAME: '', MODE: null, CHECK_NO: '', NOTE: '', IS_REDEEMED: false, IS_DELETED: 0, AUTHORIZED_BY: null, METHOD_NAME: null, PAYMENT_METHOD_ID: null, TOTAL_AMT: null, UPLOAD_IDS: null, FILE_NAME: null }) : '';
                DISS_COUNT == 0 ? $scope.VoucherIssuedList.push(angular.copy($scope.BlankDepositRedeem)) : '';
            }
            $scope.$parent.overlay_loadingNew = 'none';
        });
    };

    //function GET_ENTRY_MASTER_DETAILS() {
    $scope.GET_ENTRY_MASTER_DETAILS = function () {
        var CashupModelObj = new Object();
        CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CashupModelObj.BRANCH_ID = $scope.$parent.CASHUP.BRANCH_ID;
        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_ENTRY_MASTER_DETAILS').then(function (data) {

            if (data != undefined && data.data != undefined) {
                $scope.MasterEntryList = data.data.Table;
                $scope.MasterEntryList_Redeemed = data.data.Table;
                $scope.MasterEntryList_Redeemed = $scope.MasterEntryList_Redeemed.concat(data.data.Table1);
                $scope.GET_ENTRY_TYPE_DECLARATION();
            }
            $scope.$parent.overlay_loadingNew = 'none';
        });

        if ($scope.$parent.CASHUP.EPOS_DATA.length > 0) {
            // $scope.$parent.CASHUP.EPOS_DATA.filter(function (x) {
            for (var i = 0; i < $scope.$parent.CASHUP.EPOS_DATA.length; i++) {
                if ($scope.$parent.CASHUP.EPOS_DATA[i].MEDIA == 'Deposit Redeemed' || $scope.$parent.CASHUP.EPOS_DATA[i].MEDIA == 'DEP Redeem') {
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
        $scope.VARIANCE_DEPOSIT_REDEEMED1 = 0;
        if ($scope.DFlag == false) {
            $scope.VARIANCE_DEPOSIT_REDEEMED1 = ($scope.$parent.CASHUP.DEPOSIT_REDEEMED_TOTAL);
        }
    }
    $scope.GET_ENTRY_MASTER_DETAILS();


    $scope.DepositeSearch = {
        //IS_CHECKED: false,
        PAGE_NO: 1,
        PAGE_SIZE: 10,

    }
    $scope.LAZY_GET_DEPOSITE_LIST = function () {
        $scope.GET_DEPOSITS();
    };
    $scope.GET_DEPOSITS = function (FLAG) {

        var CashupModelObj = new Object();
        if (FLAG == 1) {
            $scope.DepositsList = [];
            $scope.DepositeSearch.PAGE_NO = 1;
        }
        CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CashupModelObj.BRANCH_ID = $scope.$parent.CASHUP.BRANCH_ID;
        CashupModelObj.INVOICENUMBER = $scope.DepositeSearch.INVOICENUMBER;
        CashupModelObj.DEPOSIT_REFERENCE = $scope.DepositeSearch.DEPOSIT_REFERENCE;
        CashupModelObj.PAYMENT_MODE_ID = $scope.DepositeSearch.PAYMENT_MODE_ID;
        CashupModelObj.PAYEE_NAME = $scope.DepositeSearch.PAYEE_NAME;
        CashupModelObj.PAGE_NO = $scope.DepositeSearch.PAGE_NO;
        CashupModelObj.PAGE_SIZE = $scope.DepositeSearch.PAGE_SIZE;
        CashupModelObj.IS_SHOW_REDEEMED = 0;
        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_DEPOSITS').then(function (data) {
             
            if (data != undefined && data.data != undefined && data.data.length > 0) {
                if (FLAG == 1) {
                    $scope.DepositsList = [];
                    $scope.DepositsList = data.data;
                } else {
                    angular.forEach(data.data, function (val) {
                        var temp = null;
                        temp = val;
                        $scope.DepositsList.push(temp);
                    })
                   // $scope.DepositsList.push(data.data) ;
                    //$scope.DepositsList = $scope.DepositsList.concat(data.data);
                }
          
                //$scope.DEPOSITS_LIST = $scope.DEPOSITS_LIST.concat(data.data);

                // $scope.DepositsList = ($filter('filter')($scope.DepositsList, { ENTRY_TYPE_ID: 3, IS_REDEEMED: false }))//$scope.DepositsList.concat(data.data);
                angular.forEach($scope.DepositsList, function (Dep) {
                    Dep.IS_CHECKED = false;
                })
                if (data.data.length < $scope.DepositeSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.DepositeSearch.PAGE_NO = parseInt($scope.DepositeSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            } else {
                $scope.GetData = false;
                //$scope.DepositsList = [];
            }

        });
    };
    $scope.GET_ENTITY_STAFF = function () {
        var CashupModelObj = new Object();
        CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CashupModelObj.BRANCH_ID = $scope.$parent.CASHUP.BRANCH_ID;
        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_ENTITY_STAFF').then(function (data) {

            if (data != undefined && data.data != undefined && data.data.length > 0) {
                $scope.StaffList = data.data;
            }

        });
    };
    $scope.GET_PAYMENT_METHODS = function () {
        var CashupModelObj = new Object();
        CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CashupModelObj.TYPE_ID = 3;
        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_PAYMENT_METHODS').then(function (data) {

            if (data != undefined && data.data != undefined) {
                //  $scope.PaymentList = data.data.Table;
                $scope.PAYMENT_METHODS = data.data.Table.filter(function (x) { return x.FLAG == 1 });
                $scope.PAYMENT_METHODS_RECEIVED = data.data.Table.filter(function (x) { return x.FLAG == 2 || x.FLAG == 1 });
            } else {
                $scope.PaymentList = null;
            }

        });
    }
    $scope.GET_DEPOSITSLIST = function () {

        var CashupModelObj = new Object();

        CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CashupModelObj.BRANCH_ID = $scope.$parent.CASHUP.BRANCH_ID;
        CashupModelObj.INVOICENUMBER = $scope.DepositeSearch.INVOICENUMBER;
        CashupModelObj.DEPOSIT_REFERENCE = $scope.DepositeSearch.DEPOSIT_REFERENCE;
        CashupModelObj.PAYMENT_MODE_ID = $scope.DepositeSearch.PAYMENT_MODE_ID;
        CashupModelObj.PAYEE_NAME = $scope.DepositeSearch.PAYEE_NAME;
        CashupModelObj.PAGE_NO = 1;//$scope.DepositeSearch.PAGE_NO;
        CashupModelObj.PAGE_SIZE = 500;//$scope.DepositeSearch.PAGE_SIZE;
        CashupModelObj.IS_SHOW_REDEEMED = 0;
        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_DEPOSITS').then(function (data) {

            $scope.DepositsListSearch = [];
            if (data != undefined && data.data != undefined && data.data.length > 0) {
                $scope.DepositsListSearch = data.data;
                //$scope.DepositsListSearch = $scope.DepositsListSearch.concat(data.data);
                $('#AddCustomScroll').find('.dropdown-menu').addClass('custom-scrollbar');

            } else {
                $scope.DepositsListSearch = [];
            }

        });
    };

    //------------------------Select Redeeemed Data----------------------
    $scope.SelectedRedeemedPopup = function () {
        //$scope.RedeemedFlag = true;
         
        //$scope.VoucherIssuedList.filter(function (x) {
        //    if (x.ENTRY_TYPE_ID == 3 && x.IS_REDEEMED == true && x.ID == 0 && x.VALUE != '') {
        //        x.MODE = x.MODE == null ? 'Deposit Redeemed' : x.MODE;
        //        x.PAYMENT_METHOD_ID = x.PAYMENT_METHOD_ID == null ? '21' : x.PAYMENT_METHOD_ID;
        //    }
        //});
        $scope.InsertEntry_DepositDeclaration(0);   
       // $scope.GET_ENTRY_MASTER_DETAILS();
        $("#Deposit_Receipts").modal('show');
    }
    $scope.ADD_SAME_FILE_UPLOADER_RED = function (LINE) {
        var Modelobj = new Object()
        Modelobj.MULTI_UPLOAD_LIST = [];
        if (LINE.UploadedFiles != undefined && LINE.UploadedFiles.length>0) {
            angular.forEach(LINE.UploadedFiles, function (Uploads, index) {
                var readonly = new Object()
                readonly.RELATIVE_ID = LINE.ID == 0 ? $scope.$parent.generaterandom(12) + "" + index : List.ID;/*index + '' + Uploads.CREATED_BY + '' + Uploads.ID + '' + 47;*/
                readonly.UPLOAD_TYPE_ID = 47;
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
    //data.append("RelativeID", List.ID == 0 ? $scope.$parent.generaterandom(12) + "" + index : List.ID);
    //data.append("UPLOAD_TYPE_ID", Attachment_UPLOAD_TYPE_ID);
    //data.append("VIRTUALPATH", '/CashUp/' + FolderName + '/' + parseInt($scope.$parent.CASHUP.CASHUP_MAIN_ID)) + '/';
    //data.append("UPLOAD_ID", 0);
    //data.append("ORIGINAL_FILE_NAME", filename);
    //data.append("USER_ID", parseInt($cookies.get("USERID")));
    $scope.SelectRedeemed = function () {

        $scope.GET_ENTRY_TYPE_DECLARATION_BYSELECTDEP();
    }

    $scope.GET_ENTRY_TYPE_DECLARATION_BYSELECTDEP = function () {
        var CashupModelObj = new Object();
        CashupModelObj.ID = $scope.$parent.CASHUP.ID;
        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_ENTRY_TYPE_DECLARATION').then(function (data) {

            //var VISS_COUNT = 0;
            //var VISR_COUNT = 0;
            var DISS_COUNT = 0;
            var DIPR_COUNT = 0;
            $scope.VoucherIssuedList = [];
            if (data != undefined && data.data != undefined) {
                $scope.VoucherIssuedList = data.data.Table;
                $scope.VoucherIssuedList = $filter('orderBy')($scope.VoucherIssuedList, 'ID');
            }
            angular.forEach($scope.VoucherIssuedList, function (VISS) {
                //if (VISS.ENTRY_TYPE_ID == 1) {
                //    VISS.VOUCHER = { ID: VISS.ENTRY_TYPE_DETAIL_ID, CODE: VISS.CODE, VALIDITY_DATE: VISS.VALIDITY_DATE, AMOUNT: VISS.VALUE, ENTRY_TYPE_ID: VISS.ENTRY_TYPE_ID };
                //    VISS.vouchernumbervisible = (VISS.VOUCHER_TYPE == 'Pre-Defined' ? true : false);
                //    VISS.ID == 0 && !VISS.IS_REDEEMED ? VISS_COUNT++ : '';
                //    VISS.ID == 0 && VISS.IS_REDEEMED ? VISR_COUNT++ : '';
                //}
                if (VISS.ENTRY_TYPE_ID == 3) {
                    VISS.ID == 0 && !VISS.IS_REDEEMED ? DISS_COUNT++ : '';
                    VISS.ID == 0 && VISS.IS_REDEEMED ? DIPR_COUNT++ : '';
                }
            });
            angular.forEach($scope.DepositsList, function (DepVal) {
                if (DepVal.IS_CHECKED) {
                    if (DepVal.ENTRY_TYPE_ID == 3 && DepVal.IS_REDEEMED == false) {
                       // $scope.ADD_REQUESTOR_ATTACHMENT_FY(DepVal);
                        //    if (DepVal.ID == 0) {
                        //        DepVal.UploadedFiles = [];
                        //    }

                        //    if (DepVal.ID != 0) {
                        //        if (DepVal.UploadedFiles == undefined) {
                        //            DepVal.UploadedFiles = [];
                        //        }
                        //        var FileArray = (DepVal.FILE_NAME != "" && DepVal.FILE_NAME != null) ? DepVal.FILE_NAME.split(':;:') : [];
                        //    if (FileArray.length > 0) {
                        //        var obj = new Object()
                        //        obj.ID = DepVal.UPLOAD_IDS;
                        //        obj.FILE_PATH = FileArray[0];
                        //        obj.SERVER_FILE_NAME = FileArray[1];
                        //        obj.ORIGINAL_FILE_NAME = FileArray[2];
                        //        DepVal.UploadedFiles.push(obj);
                        //    }
                        //}
                        
                        var obj = { ID: 0, ENTRY_TYPE_ID: 3, ENTRY_TYPE_DETAIL_ID: DepVal.ID, VOUCHER_TYPE: null, CODE: DepVal.CODE, VOUCHER: null, VALUE: DepVal.REMAINING_VALUE, VALIDITY_DATE: DepVal.VALIDITY_DATE, CUSTOMER_NAME: DepVal.CUSTOMER_NAME, MODE: DepVal.MODE, CHECK_NO: DepVal.CHECK_NO, NOTE: DepVal.NOTE, IS_REDEEMED: true, IS_DELETED: 0, PAYMENT_METHOD_ID: DepVal.PAYMENT_METHOD_ID, IS_CHECKED: true, TOTAL_AMT: DepVal.VALUE, IS_CANCELLED: DepVal.IS_CANCELLED, UPLOAD_IDS: DepVal.UPLOAD_IDS, FILE_NAME: DepVal.FILE_NAME, UPL_FLAG: false}; //IS_REDEEMED    
                        $scope.VoucherIssuedList.push(angular.copy(obj))
                        //$scope.BlankDepositRedeem = { ID: 0, ENTRY_TYPE_ID: 3, ENTRY_TYPE_DETAIL_ID: 0, VOUCHER_TYPE: null, CODE: null, VOUCHER: null, VALUE: '', VALIDITY_DATE: '', CUSTOMER_NAME: '', MODE: null, CHECK_NO: '', NOTE: '', IS_REDEEMED: true, IS_DELETED: 0 };

                    }
                }
            })
            $scope.CHK_LAST_VALUE = 0;
            angular.forEach($scope.VoucherIssuedList, function (Red_Chek) {
                if (Red_Chek.IS_REDEEMED == true && Red_Chek.ENTRY_TYPE_ID == 3 && Red_Chek.ID == 0 && Red_Chek.VALUE != '') {
                    $scope.CHK_LAST_VALUE = Red_Chek.VALUE;
                }
            })
            $("#Deposit_Receipts").modal('hide');
            if ($scope.$parent.CASHUP.AUTOVALIDDEPOSITE) {
                $scope.VoucherIssuedList = $scope.$parent.CASHUP.AUTOVALID_DEPOSITE;

            }

            if (!$scope.$parent.CASHUP.AUTOVALIDDEPOSITE) {
                DIPR_COUNT == 0 ? $scope.VoucherIssuedList.push(angular.copy($scope.BlankDepositRecieved)) : '';
                //  DISS_COUNT == 0 ? $scope.VoucherIssuedList.push(angular.copy($scope.BlankDepositRedeem)) : '';
            }
            $scope.DepositeSearch.INVOICENUMBER = null;
            $scope.DepositeSearch.DEPOSIT_REFERENCE = null;
            $scope.DepositeSearch.PAYMENT_MODE_ID = null;
            $scope.DepositeSearch.PAYEE_NAME = null;
            //  $scope.InsertEntry_DepositDeclaration();
            //  $scope.GET_ENTRY_MASTER_DETAILS();
        });
    };
    $scope.SET_VALUECHECK = function (val) {
        
        if ($scope.CHK_LAST_VALUE != 0) {
            if (val.VALUE > $scope.CHK_LAST_VALUE) {
                $scope.$parent.ShowAlert("Attention", "Redeemed Amount is not greater than remaining amount.", 3000);
                //alert("Amount is not greater than remaining value. ");
                val.VALUE = $scope.CHK_LAST_VALUE;
            }
        }
    }
    $scope.RESETPAGESEARCH = function () {
        $scope.DepositeSearch.INVOICENUMBER = null;
        $scope.DepositeSearch.DEPOSIT_REFERENCE = null;
        $scope.DepositeSearch.PAYMENT_MODE_ID = null;
        $scope.DepositeSearch.PAYEE_NAME = null;
        $scope.GET_DEPOSITS(1);

    }

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
    $scope.SetValues_Deposit = function (VISS, IndexVal) {
        
        $scope.CHK_LAST_VALUE = 0;
        //angular.forEach($scope.DepositsList, function (value) {
        angular.forEach($scope.DepositsListSearch, function (value) {
            if (value.CODE == VISS.CODE && value.ENTRY_TYPE_ID == 3 && value.IS_REDEEMED == false) {
                VISS.TOTAL_AMT = value.VALUE;
                VISS.VALUE = value.REMAINING_VALUE;
                VISS.CODE = value.CODE;
                VISS.VALIDITY_DATE = value.VALIDITY_DATE;
                VISS.MODE = value.MODE;//'Deposit Redeemed';
                VISS.PAYMENT_METHOD_ID = value.PAYMENT_METHOD_ID;
                VISS.CHECK_NO = value.CHECK_NO;
                VISS.ENTRY_TYPE_DETAIL_ID = value.ID;
                VISS.CUSTOMER_NAME = value.CUSTOMER_NAME;
                VISS.NOTE = value.NOTE;
                VISS.UPLOAD_IDS = value.UPLOAD_IDS;
                VISS.FILE_NAME = value.FILE_NAME;
                VISS.UPL_FLAG = false;
                $scope.CHK_LAST_VALUE = value.REMAINING_VALUE;
               
                //$scope.initdepositListred(value);
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
        //        if ($scope.$parent.CASHUP.EPOS_DATA[i].MEDIA == 'Deposit Redeemed' || $scope.$parent.CASHUP.EPOS_DATA[i].MEDIA == 'DEP Redeem') {
        //            $scope.DFlag = true;
        //            break;
        //        } else {
        //            $scope.DFlag = false;
        //        }
        //    }
        //   // });
        //} else {
        //    $scope.DFlag = false;
        //}
        //$scope.VARIANCE_DEPOSIT_REDEEMED1 = 0;
        //if ($scope.DFlag == false) {
        //    $scope.VARIANCE_DEPOSIT_REDEEMED1 = ( $scope.$parent.CASHUP.DEPOSIT_REDEEMED_TOTAL );
        //}
    };
    //$scope.SetVarience();
    //$scope.SetVarience = function () {
    //    if ($scope.$parent.CASHUP.EPOS_DATA.length > 0) {
    //        $scope.$parent.CASHUP.EPOS_DATA.filter(function (x) {
    //            if (x.MEDIA == 'Deposit Redeemed' || x.MEDIA == 'EPOS_DATA') {
    //                $scope.DFlag = true;
    //            } else {
    //                $scope.DFlag == false;
    //            }
    //        });
    //    } else {
    //        $scope.DFlag == false;
    //    }
    //    if ($scope.DFlag == false) {
    //        $scope.VARIANCE_DEPOSIT_REDEEMED1 = ($scope.$parent.CASHUP.DEPOSIT_REDEEMED_TOTAL);
    //    }
    //}
    $scope.ValidControls = function (x) {
        if ($scope.$parent.CASHUP.DEPOSITSVALID) {
            x.CODE_VALID = true;
            x.VALUE_VALID = true;
            x.PAYMENT_METHOD_ID_VALID = true;
            x.CHECK_NO_VALID = true;
            x.RED_CODE_VALID = true;
            x.RED_VALUE_VALID = true;
            x.RED_PAYMENT_METHOD_ID_VALID = true;
            x.RED_CHECK_NO_VALID = true;
        }
    }
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
                if (((x.CODE != null && x.CODE != "") || (x.VALUE != null && x.VALUE != "") || (x.PAYMENT_METHOD_ID != null && x.PAYMENT_METHOD_ID != "") || (x.CHECK_NO != null && x.CHECK_NO != "") || (x.AUTHORIZED_BY != null && x.AUTHORIZED_BY != "") || (x.VALIDITY_DATE != null && x.VALIDITY_DATE != "") || (x.CUSTOMER_NAME != null && x.CUSTOMER_NAME != "")) && (x.IS_DELETED == 0)) {
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
                if (((x.CODE != null && x.CODE != "") || (x.VALUE != null && x.VALUE != "") || (x.PAYMENT_METHOD_ID != null && x.PAYMENT_METHOD_ID != "") || (x.CHECK_NO != null && x.CHECK_NO != "") || (x.AUTHORIZED_BY != null && x.AUTHORIZED_BY != "") || (x.VALIDITY_DATE != null && x.VALIDITY_DATE != "") || (x.CUSTOMER_NAME != null && x.CUSTOMER_NAME != "")) && (x.IS_DELETED == 0)) {
                    if (x.CODE == null || x.CODE == undefined || x.CODE == "") {
                        x.RED_CODE_VALID = false;
                    }
                    if (x.VALUE == null || x.VALUE == 0 || x.VALUE == "") {
                        x.RED_VALUE_VALID = false;
                    }
                    //if (x.PAYMENT_METHOD_ID == null || x.PAYMENT_METHOD_ID == 0 || x.PAYMENT_METHOD_ID == "") {
                    //    x.RED_PAYMENT_METHOD_ID_VALID = false;
                    //}
                    if (x.CHECK_NO == null || x.CHECK_NO == "") {
                        x.RED_CHECK_NO_VALID = false;
                    }
                }
            }
            if (!x.CODE_VALID || !x.VALUE_VALID || !x.PAYMENT_METHOD_ID_VALID || !x.CHECK_NO_VALID || !x.RED_CODE_VALID || !x.RED_VALUE_VALID || !x.RED_CHECK_NO_VALID) {///|| !x.RED_PAYMENT_METHOD_ID_VALID
                $scope.$parent.CASHUP.DEPOSITSVALID = false;
            }
        });

        if ($scope.$parent.CASHUP.DEPOSITSVALID == false) {
            if ($scope.VoucherIssuedList.length > 0) {
                $scope.$parent.CASHUP.AUTOVALID_DEPOSITE = $scope.VoucherIssuedList;
            }
        }
    }

    $scope.InsertEntry_DepositDeclaration = function (IS_VALIDATE) {

        if (IS_VALIDATE == undefined) {
            $scope.ValidateDepositeIssue();
        } else {
            $scope.$parent.CASHUP.DEPOSITSVALID = true;
        }

        if ($scope.$parent.CASHUP.DEPOSITSVALID) {
            var VoucherList = [];
            var cnt = 0;
            angular.forEach($scope.VoucherIssuedList, function (x) {
                if (x.UploadedFiles != undefined && x.UploadedFiles.length > 0) {
                    angular.forEach(x.UploadedFiles, function (y, index) {
                        if (index == 0) {
                            x.UPLOAD_IDS = y.ID.toString();
                        } else {
                            x.UPLOAD_IDS += ','+y.ID.toString();
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
            angular.forEach($scope.VoucherIssuedList, function (voucherissue) {

                if (voucherissue.VALUE != undefined && voucherissue.VALUE != '' && voucherissue.VALUE != '0' && voucherissue.ENTRY_TYPE_ID == 3 && voucherissue.CODE != null && voucherissue.CODE != "" && voucherissue.CODE != undefined && voucherissue.CHECK_NO != null && voucherissue.CHECK_NO != "" && voucherissue.CHECK_NO != 0 && (voucherissue.IS_REDEEMED == true || (voucherissue.PAYMENT_METHOD_ID != null && voucherissue.PAYMENT_METHOD_ID != ""))) {
                    var voucher = new Object();
                    voucher.ID = voucherissue.ID;
                    voucher.ENTRY_TYPE_ID = voucherissue.ENTRY_TYPE_ID;
                    voucher.ENTRY_TYPE_DETAIL_ID = voucherissue.ENTRY_TYPE_DETAIL_ID;
                    voucher.VOUCHER_TYPE = voucherissue.VOUCHER_TYPE;
                    voucher.CODE = voucherissue.CODE != null ? voucherissue.CODE : "";
                    voucher.VALUE = voucherissue.VALUE;
                    voucher.VALIDITY_DATE = voucherissue.VALIDITY_DATE;
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
                    voucher.IS_CANCELLED = voucherissue.IS_CANCELLED != null && voucherissue.IS_CANCELLED != "" ? voucherissue.IS_CANCELLED:false ;
                    voucher.TOTAL_AMT = voucherissue.ENTRY_TYPE_DETAIL_ID == 0 ? voucherissue.VALUE : voucherissue.TOTAL_AMT;

                    voucher.UPLOAD_IDS = (voucherissue.UPLOAD_IDS == undefined && voucherissue.UPLOAD_IDS == '') ? null : voucherissue.UPLOAD_IDS;
                    //voucher.FILE_NAME = voucherissue.FILE_NAME;

                    VoucherList[cnt] = voucher;
                    cnt++;
                }
                //else {
                //    if (voucherissue.IS_REDEEMED == false && voucherissue.ENTRY_TYPE_ID == 3) {
                //        $scope.RedeemedFlag = false;
                //        $scope.$parent.CASHUP.AUTOVALID_DEPOSITE = voucherissue;
                //    }
                //}
            })
            VoucherList.filter(function (x) {
                if (x.VALUE > 0 || x.VALUE == 0 || x.VALUE < 0) {
                    x.VALUE = '' + x.VALUE;
                }
            });
            var DEPOSIT_TOTAL = 0;
            var DEPOSIT_REDEEMED_TOTAL = 0;
            VoucherList.filter(function (x) {
                if (x.IS_REDEEMED == false && x.ENTRY_TYPE_ID == 3 && x.IS_DELETED == 0) {
                    DEPOSIT_TOTAL += parseFloat(x.VALUE);
                }
            });
            VoucherList.filter(function (x) {
                if (x.IS_REDEEMED == true && x.ENTRY_TYPE_ID == 3 && x.IS_DELETED == 0) {
                    DEPOSIT_REDEEMED_TOTAL += parseFloat(x.VALUE);
                }
            });

            var CashupModelObj = new Object();
            CashupModelObj.ID = $scope.$parent.CASHUP.ID;
            CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            CashupModelObj.BRANCH_ID = $scope.$parent.CASHUP.BRANCH_ID;
            CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
            CashupModelObj.DEPOSIT_TOTAL = DEPOSIT_TOTAL;// $scope.$parent.CASHUP.DEPOSIT_TOTAL;
            CashupModelObj.REDEEMED_TOTAL = DEPOSIT_REDEEMED_TOTAL;//$scope.$parent.CASHUP.DEPOSIT_REDEEMED_TOTAL;
            CashupModelObj.DECLARATION_DETAILS = VoucherList;
            CashupModelObj.STEP_NO = 9;

            PrcCommMethods.CASHUP_API(CashupModelObj, 'INS_ENTRY_DEPOSIT_DECLARATION').then(function (data) {                 
                $scope.TabValid = true;
                if ($scope.CASHUP.KeyColor == "Deposits") {
                    $scope.GET_ENTRY_MASTER_DETAILS();
                }
                //if ($scope.AddDepFlag) {
                //    GET_ENTRY_MASTER_DETAILS();
                //}
            });
        }
    };


    $scope.NextLink = function (val) {
        $scope.TabValid = false;
        $scope.AddDepFlag = false;
        $scope.KeyColor = val;
        $scope.$parent.CASHUP.AUTOVALIDDEPOSITE = false;
        $scope.VoucherIssuedList.filter(function (x) {
            if (x.ENTRY_TYPE_ID == 3 && x.IS_REDEEMED == true && x.ID == 0 && x.VALUE != '') {
                x.MODE = x.MODE == null ? 'Deposit Redeemed' : x.MODE;
                x.PAYMENT_METHOD_ID = x.PAYMENT_METHOD_ID == null ? '21' : x.PAYMENT_METHOD_ID;
            }
        });
        $scope.InsertEntry_DepositDeclaration();
        if ($scope.$parent.CASHUP.DEPOSITSVALID) {
            if ($scope.$parent.CASHUP.TABLIST[9].FLAG == 1) {
                $location.path("Complimentary").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
            }
        } else {
            $scope.TabValid = true;
        }

    }
    $scope.PreviousLink = function () {
        $scope.TabValid = false;
        $scope.AddDepFlag = false;
        $scope.$parent.CASHUP.AUTOVALIDDEPOSITE = false;
        $scope.VoucherIssuedList.filter(function (x) {
            if (x.ENTRY_TYPE_ID == 3 && x.IS_REDEEMED == true && x.ID == 0 && x.VALUE != '' ) {
                x.MODE = x.MODE == null ? 'Deposit Redeemed' : x.MODE;
                x.PAYMENT_METHOD_ID = x.PAYMENT_METHOD_ID == null ? '21' : x.PAYMENT_METHOD_ID;
            }
        });
        $scope.InsertEntry_DepositDeclaration();
        if ($scope.$parent.CASHUP.DEPOSITSVALID) {
            if ($scope.$parent.CASHUP.TABLIST[7].FLAG == 1) {
                $location.path("Vouchers").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
            } else if ($scope.$parent.CASHUP.TABLIST[6].FLAG == 1) {
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
            $scope.AddDepFlag = false;
            $scope.VoucherIssuedList.filter(function (x) {
                if (x.ENTRY_TYPE_ID == 3 && x.IS_REDEEMED == true && x.ID == 0 && x.VALUE != '' ) {
                    x.MODE = x.MODE == null ? 'Deposit Redeemed' : x.MODE;
                    x.PAYMENT_METHOD_ID = x.PAYMENT_METHOD_ID == null ? '21' : x.PAYMENT_METHOD_ID;
                }
            });
            if ($scope.$parent.CASHUP.FG == null) {
                $scope.ValidateDepositeIssue();
                if ($scope.$parent.CASHUP.DEPOSITSVALID) {
                    $scope.$parent.CASHUP.AUTOVALIDDEPOSITE = false;
                    if ($scope.VoucherIssuedList.length > 0) {
                        $scope.InsertEntry_DepositDeclaration();
                        //$scope.$parent.CASHUP.AUTOVALIDDEPOSITE = false;
                        $scope.VoucherIssuedList.push(angular.copy($scope.BlankDepositRecieved));
                    }
                } else {
                    if ($scope.$parent.CASHUP.AUTOVALID_DEPOSITE.length > 0) {
                        $scope.$parent.CASHUP.AUTOVALIDDEPOSITE = true;

                        $location.path("Deposits").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });

                    } else {
                        $location.path("Deposits").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
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
        $scope.AddDepFlag = false;
        $scope.KeyColor = val;
        $scope.$parent.CASHUP.AUTOVALIDDEPOSITE = false;

        if ($scope.$parent.CASHUP.TABLIST[9].FLAG == 1) {
            $location.path("Complimentary_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
        }


    }
    $scope.PreviousLink_View = function () {
        $scope.TabValid = false;
        $scope.AddDepFlag = false;
        $scope.$parent.CASHUP.AUTOVALIDDEPOSITE = false;

        if ($scope.$parent.CASHUP.TABLIST[7].FLAG == 1) {
            $location.path("Vouchers_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
        } else if ($scope.$parent.CASHUP.TABLIST[6].FLAG == 1) {
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

    //////////////////////// END Comment Code////////////////////////////////////////////////

    $scope.initdepositList = function (DEPOSIT_LINE) {
        if (DEPOSIT_LINE.ID == 0) {
            DEPOSIT_LINE.UploadedFiles = [];
        }
       
        if (DEPOSIT_LINE.ID != 0) {
            if (DEPOSIT_LINE.UploadedFiles == undefined) {
                DEPOSIT_LINE.UploadedFiles = [];
            }
            var FileArray = DEPOSIT_LINE.FILE_NAME != "" ? DEPOSIT_LINE.FILE_NAME.split(':;:') : [];
            if (FileArray.length > 0) {
                var obj = new Object()
                obj.ID = DEPOSIT_LINE.UPLOAD_IDS;
                obj.FILE_PATH = FileArray[0];
                obj.SERVER_FILE_NAME = FileArray[1];
                obj.ORIGINAL_FILE_NAME = FileArray[2];
                DEPOSIT_LINE.UploadedFiles.push(obj);
            }
        }
    }
    $scope.initdepositListred = function (DEPOSIT_LINE) {
        if (DEPOSIT_LINE.ID == 0) {
            DEPOSIT_LINE.UploadedFiles = [];
        }

        if (DEPOSIT_LINE.ID != 0) {
            if (DEPOSIT_LINE.UploadedFiles == undefined) {
                DEPOSIT_LINE.UploadedFiles = [];
            }
        }
        var FileArray = DEPOSIT_LINE.FILE_NAME != "" && DEPOSIT_LINE.FILE_NAME != null ? DEPOSIT_LINE.FILE_NAME.split(':;:') : [];
            if (FileArray.length > 0) {
                var obj = new Object()
                obj.ID = DEPOSIT_LINE.UPLOAD_IDS;
                obj.FILE_PATH = FileArray[0];
                obj.SERVER_FILE_NAME = FileArray[1];
                obj.ORIGINAL_FILE_NAME = FileArray[2];
                DEPOSIT_LINE.UploadedFiles.push(obj);
            }
       // }
        if (DEPOSIT_LINE.UPL_FLAG == false) {
            $scope.ADD_SAME_FILE_UPLOADER_RED(DEPOSIT_LINE);
        }
    }
    $scope.getTheFilesToUploadDeposits = function ($files, ControlName, FileSize, List, Attachment_UPLOAD_TYPE_ID, index) {

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
        var fileUpload = document.getElementById("DEPFILE" + index);
        extension = fileUpload.files[0].name;
        $scope.uploadFiles(Attachment_UPLOAD_TYPE_ID, '', extension, List, index, 'Deposits');
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
                   // var temp = d.data[0];
                  //  List.UploadedFiles.push( temp );
                }
            });
        }
    };
    $scope.DELETE_UPLOAD_DEPOSIT_ALL = function (Array, item, index, FLAG) {
        if (confirm('Are you sure you want to delete?')) {
            Array.UploadedFiles.splice(index, 1);
            var CashupModelObj = new Object();
            CashupModelObj.ID = parseInt(item.ID);
            PrcCommMethods.CASHUP_API(CashupModelObj, 'DELETE_UPLOAD').then(function (data) {
                $scope.ShowAlert('Success', 'Delete success.', 5000);
            });
        }
    };

    $scope.getTheFilesToUploadDeposits1 = function ($files, ControlName, FileSize, List, Attachment_UPLOAD_TYPE_ID, index) {

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
        var fileUpload = document.getElementById("DEPFILE1" + index);
        extension = fileUpload.files[0].name;
        $scope.uploadFiles1(Attachment_UPLOAD_TYPE_ID, '', extension, List, index, 'Deposits');
    };
    $scope.uploadFiles1 = function (Attachment_UPLOAD_TYPE_ID, ATTACHEMENT_TYPE_ID, filename, List, index, FolderName) {

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
                     //var temp = d.data[0];
                     // List.UploadedFiles.push( temp );
                }
            });
        }
    };
    $scope.DELETE_UPLOAD_DEPOSIT_ALL1 = function (Array, item, index, FLAG) {
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