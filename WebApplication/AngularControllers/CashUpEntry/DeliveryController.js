app.controller('DeliveryController', function ($scope, $http, $interval, CommService, $cookies, $filter, PrcCommMethods, $location, readFileData, readFileDataNew, $sce) {

    $scope.$parent.CASHUP.KeyColor = "Delivery";
    $scope.$parent.CASHUP.ID = getUrlParameter('CHID', $location.absUrl());

    if ($scope.$parent.CASHUP.ACTUAL_STEP_NO <= 6) {
        $scope.$parent.CASHUP.ACTUAL_STEP_NO = 6;
    }
    $scope.TabValid = true;
    $scope.$parent.overlay_loadingNew = 'block';
    $scope.ChequeList = [];

    $scope.AddChequeFlag = false;
    $scope.BlankCheque = { ID: 0, NAME: '', DATE: '', NUMBER: '', AMOUNT: null, PAID_BY_TYPE: null, TRANSFER_TYPE: null, NOTE: '', IS_DELETED: 0 };
    //$scope.BlankCheque = { ID: 0, NAME: '', DATE: '', NUMBER: '', AMOUNT: null, PAID_BY_TYPE: null, TRANSFER_TYPE: null, NOTE: '' };

    $scope.AddChequeLine = function () {
        $scope.AddChequeFlag = true;
        $scope.InsertChequeDeclaration();
        //$scope.ChequeList.push(angular.copy($scope.BlankCheque));
    };
    //GET_CHEQUE_DECLARATION();
    // function GET_CHEQUE_DECLARATION() {
    $scope.GET_CHEQUE_DECLARATION = function () {
        var CashupModelObj = new Object();
        CashupModelObj.ID = $scope.$parent.CASHUP.ID;
        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_CHEQUE_DECLARATION').then(function (data) {
            $scope.ChequeList = [];
            if (data != undefined && data.data != undefined && data.data.length > 0) {
                $scope.ChequeList = data.data;
            }
            var PCASHCOUNT = 0;
            angular.forEach($scope.ChequeList, function (PCash) {
                PCash.ID == 0 ? PCASHCOUNT++ : '';
            });
            PCASHCOUNT == 0 ? $scope.ChequeList.push(angular.copy($scope.BlankCheque)) : '';
            $scope.$parent.overlay_loadingNew = 'none';
        });
    }
    $scope.CODE_ARRY = [];
    $scope.$on('ngRepeatFinishedRender', function (ngRepeatFinishedEvent) {
        $scope.CODE_ARRY = $scope.COPY_CODE_ARRY;
    });
    $scope.GET_CHEQUE_DECLARATION();
    $scope.DeleteLine = function (Array, index, Cheque) {

        if (Cheque.ID == undefined || Cheque.ID == 0) {

            if (Array.length == 1) {
                if (Cheque.NAME != '' || Cheque.PAID_BY_TYPE != null || Cheque.TRANSFER_TYPE != null || Cheque.AMOUNT != null || Cheque.NOTE != '' || Cheque.NUMBER!='') { 
                if (confirm("Are you sure, You want to delete the record ?")) { 
                Cheque.IS_DELETED = 1;
                //  alert("Are you sure, You want to delete the record ?");
                $scope.ChequeList.push(angular.copy($scope.BlankCheque));
            }
        }
                } else {
                    //Array.splice(index, 1);
                if (Cheque.NAME != '' || Cheque.PAID_BY_TYPE != null || Cheque.DATE != '' || Cheque.TRANSFER_TYPE != null || Cheque.AMOUNT != null || Cheque.NOTE != '' || Cheque.NUMBER != '') {
                    
                    if (confirm("Are you sure,You want to delete the record ?")) {
                        for (var i = 0; i < $scope.ChequeList.length; i++) {
                            if ($scope.ChequeList[i].ID == 0) {
                                $scope.ChequeList.splice(i, 1);
                                $scope.ChequeList.push(angular.copy($scope.BlankCheque));
                            }
                        }
                        var len = 0;
                        angular.forEach($scope.ChequeList, function (item) {
                            if (item.IS_DELETED == 0) {
                                len = len + 1;
                            }
                        })
                        if (len == 0) {
                            $scope.ChequeList.push(angular.copy($scope.BlankCheque));
                        }
                    }
                }
                }
           
        }
        else {
            if (confirm("Are you sure, You want to delete the record ?")) {
                Cheque.IS_DELETED = 1;
                var Count = Array.length;
                var Cnt = 0;
                angular.forEach(Array, function (item) {
                    if (item.IS_DELETED == 1) {
                        Cnt = Cnt + 1;
                    }
                })
                if (Count == Cnt) {
                   // alert("Are you sure, You want to delete the record?");
                    $scope.ChequeList.push(angular.copy($scope.BlankCheque));
                }
                $scope.InsertChequeDeclaration();
            }
        }
        $scope.COMMON_CODE_CHANGE();
    };

    //$scope.DeleteLine = function (Array, index, IS_REDEEMED, ENTRY_TYPE_ID) {
    //    if (Array.length == 1) {
    //        alert("Are you sure, You want to delete the record ?");
    //        $scope.ChequeList = [];
    //        $scope.ChequeList.push(angular.copy($scope.BlankCheque));      
    //    } else {
    //         if (ENTRY_TYPE_ID == undefined) {
    //           Array.splice(index, 1);
    //          }
    //         else {
    //          Array = Array.filter(function (x) { return x.IS_REDEEMED == IS_REDEEMED && x.ENTRY_TYPE_ID == ENTRY_TYPE_ID }).splice(index, 1);
    //          }
    //    }      
    //};
    $scope.InsertChequeDeclaration = function () {

        $scope.ChequeList.filter(function (x) {
            if (x.AMOUNT > 0 || x.AMOUNT == 0) {
                x.AMOUNT = '' + x.AMOUNT;
            }
        });
         
        var CHEQUE_TOTAL = 0;
        $scope.ChequeList.filter(function (x) {
            if (x.IS_DELETED == 0) {
                if (x.AMOUNT != null)
                    CHEQUE_TOTAL += parseFloat(x.AMOUNT);
            }
        });
        var CashupModelObj = new Object();
        CashupModelObj.ID = $scope.$parent.CASHUP.ID;
        CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CashupModelObj.BRANCH_ID = $scope.$parent.CASHUP.BRANCH_ID;
        CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
        CashupModelObj.TOTAL_CHEQUE = CHEQUE_TOTAL;//$scope.$parent.CASHUP.TOTAL_CHEQUE;
        CashupModelObj.DECLARATION_DETAILS = $scope.ChequeList;
        CashupModelObj.STEP_NO = 6;
        PrcCommMethods.CASHUP_API(CashupModelObj, 'INS_CHEQUE_DECLARATION').then(function (data) {
            if ($scope.AddChequeFlag) {
                if ($scope.CASHUP.KeyColor == "Delivery") {
                    $scope.GET_CHEQUE_DECLARATION();
                }
            }
        });
    };
    $scope.NextLink = function (val) {
        $scope.TabValid = false;
        $scope.AddChequeFlag = false;
        $scope.KeyColor = val;
        $scope.InsertChequeDeclaration();
        if ($scope.$parent.CASHUP.TABLIST[6].FLAG == 1) {
            $location.path("AccountCustomer").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
        } else if ($scope.$parent.CASHUP.TABLIST[7].FLAG == 1) {
            $location.path("Vouchers").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
        } else if ($scope.$parent.CASHUP.TABLIST[8].FLAG == 1) {
            $location.path("Deposits").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
        } else if ($scope.$parent.CASHUP.TABLIST[9].FLAG == 1) {
            $location.path("Complimentary").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
        }

        $scope.$parent.overlay_loading_div_zindex = '-1';
    }
    $scope.PreviousLink = function () {
        $scope.TabValid = false;
        $scope.AddChequeFlag = false;
        $scope.InsertChequeDeclaration();
        if ($scope.$parent.CASHUP.TABLIST[4].FLAG == 1) {
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
    $scope.$on('$destroy', function () {

        if ($scope.TabValid) {
            $scope.AddChequeFlag = false;
            if ($scope.$parent.CASHUP.FG == null) {
                if ($scope.ChequeList.length > 0) {
                    $scope.InsertChequeDeclaration();
                }
            }
        }
    });
    $scope.NextLink_View = function (val) {
        $scope.TabValid = false;
        $scope.AddChequeFlag = false;
        $scope.KeyColor = val;
       // $scope.InsertChequeDeclaration();
        if ($scope.$parent.CASHUP.TABLIST[6].FLAG == 1) {
            $location.path("AccountCustomer_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
        } else if ($scope.$parent.CASHUP.TABLIST[7].FLAG == 1) {
            $location.path("Vouchers_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
        } else if ($scope.$parent.CASHUP.TABLIST[8].FLAG == 1) {
            $location.path("Deposits_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
        } else if ($scope.$parent.CASHUP.TABLIST[9].FLAG == 1) {
            $location.path("Complimentary_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
        }

        $scope.$parent.overlay_loading_div_zindex = '-1';
    }
    $scope.PreviousLink_View = function () {
         
        $scope.TabValid = false;
        $scope.AddChequeFlag = false;
       // $scope.InsertChequeDeclaration();
        if ($scope.$parent.CASHUP.TABLIST[4].FLAG == 1) {
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
});