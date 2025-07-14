app.controller('ComplimentaryController', function ($scope, $http, $interval, CommService, $cookies, $filter, PrcCommMethods, $location, readFileData, readFileDataNew, $sce) {
    $scope.$parent.CASHUP.KeyColor = "Complimentary";
    $scope.$parent.CASHUP.ID = getUrlParameter('CHID', $location.absUrl());
    if ($scope.$parent.CASHUP.ACTUAL_STEP_NO <= 10) {
        $scope.$parent.CASHUP.ACTUAL_STEP_NO = 10;
    };
    $scope.$parent.CASHUP.COMP_NOTES = "";
    $scope.$parent.CASHUP.COMP_NOTES_ID = 0;
    $scope.SETTING_MINTS = $scope.$parent.GET_ENTITY_SETTINGS(27)[0].SETTING_VALUE;
    $scope.TabValid = true;
    $scope.$parent.overlay_loadingNew = 'block';
    $scope.Msg = '';
    $scope.NOTE_TYPE_ID = 5;
   
    $scope.COMP_NOTE_LIST = [];
    // $scope.BackValid = false;

    $scope.ComplimentaryList = [];
    $scope.VoidList = [];
    $scope.BlankComplimentary = { ID: 0, ENTRY_TYPE_ID: 6, ENTRY_TYPE_DETAIL_ID: 0, VOUCHER_TYPE: null, CODE: '', VALUE: '', CUSTOMER_NAME: null, MODE: null, CHECK_NO: '', NOTE: '', AUTHORIZED_BY: null, DISCOUNT: '', FOOD: '', DRINKS: '', LIGHT_SPEED_ACCOUNTFISCID: null, IS_DELETED: 0 };
    $scope.BlankVoidList = { ID: 0, ENTRY_TYPE_ID: 7, ENTRY_TYPE_DETAIL_ID: 0, CODE: null, CHECK_NO: '', VALUE: '', IS_DELETED: 0 };
    $scope.ComplimentaryLine = function () {
        $scope.InsertEntry_VoidDeclaration()
        if ($scope.$parent.CASHUP.COMPLEMENTARYVALID) {
            //  GET_ENTRY_MASTER_DETAILS();
            $scope.ComplimentaryList.push(angular.copy($scope.BlankComplimentary));
        }
    };
    $scope.VoidLine = function () {

        $scope.InsertEntry_VoidDeclaration();
        if ($scope.$parent.CASHUP.COMPLEMENTARYVALID) {
            // GET_ENTRY_MASTER_DETAILS();
            //$scope.VoidList.push(angular.copy($scope.BlankVoidList));
        }
    };
    //  $scope.ComplimentaryLine();  
    $scope.DeleteLine = function (Array, index, Comp) {

        if (Comp.ID == undefined || Comp.ID == 0) {
           
            if (Array.length == 1) {
                if (Comp.AUTHORIZED_BY != null || Comp.CHECK_NO != '' || Comp.VOUCHER_TYPE != null || Comp.CUSTOMER_NAME != null || Comp.CODE != '' || Comp.VALUE != '' || Comp.DISCOUNT != '' || Comp.NOTE != '' || Comp.MODE!=null) {
                    if (confirm("Are you sure, You want to delete the record ?")) {
                        Comp.IS_DELETED = 1;
                        //  alert("Are you sure, You want to delete the record ?");
                        $scope.ComplimentaryList.push(angular.copy($scope.BlankComplimentary));
                    }
                }
            } else {
                //Array.splice(index, 1);
                if (Comp.AUTHORIZED_BY != null || Comp.CHECK_NO != '' || Comp.VOUCHER_TYPE != null || Comp.CUSTOMER_NAME != null || Comp.CODE != '' || Comp.VALUE != '' || Comp.DISCOUNT != '' || Comp.NOTE != '' || Comp.MODE != null) { 
                if (confirm("Are you sure, You want to delete the record ?")) {
                    for (var i = 0; i < $scope.ComplimentaryList.length; i++) {
                        if ($scope.ComplimentaryList[i].ID == 0 && $scope.ComplimentaryList[i].IS_DELETED == 0 && $scope.ComplimentaryList[i].VALUE == Comp.VALUE) {
                            $scope.ComplimentaryList.splice(i, 1);
                            $scope.ComplimentaryList.push(angular.copy($scope.BlankComplimentary));
                        }
                    }
                    var len = 0;
                    angular.forEach($scope.ComplimentaryList, function (Cval) {
                        if (Cval.IS_DELETED == 0) {
                            len = len + 1;
                        }
                    })
                    if (len == 0) {
                        // alert("Are you sure, You want to delete the record?");
                        $scope.ComplimentaryList.push(angular.copy($scope.BlankComplimentary));
                    }
                }
            }
         }
           
        }
        else {
            if (confirm("Are you sure, You want to delete the record ?")) {
                Comp.IS_DELETED = 1;
                var Count = Array.length;
                var Cnt = 0;
                angular.forEach(Array, function (item) {
                    if (item.IS_DELETED == 1) {
                        Cnt = Cnt + 1;
                    }
                })
                if (Count == Cnt) {
                    //alert("Are you sure, You want to delete the record?");
                    $scope.ComplimentaryList.push(angular.copy($scope.BlankComplimentary));
                }
                $scope.InsertEntry_VoidDeclaration();
            }

        }
        $scope.$parent.CASHUP.COMPLEMENTARYVALID = true;
        $scope.COMMON_CODE_CHANGE();
    };
    $scope.DeleteVoidLine = function (Array, index, Void) {
         
        if (Void.ID == undefined || Void.ID == 0) {
           // if (confirm("Are you sure, You want to delete the record ?")) {
            if (Array.length == 1) {
                if (Void.VALUE != '' || Void.CODE != null || Void.CHECK_NO != '') {
                    if (confirm("Are you sure, You want to delete the record ?")) {
                        Void.IS_DELETED = 1;
                        //alert("Are you sure, You want to delete the record ?");
                        $scope.VoidList.push(angular.copy($scope.BlankVoidList));
                    }
                }
                } else {
                    //Array.splice(index, 1);
                    if (Void.VALUE != '' || Void.CODE != null || Void.CHECK_NO != '') {
                        if (confirm("Are you sure, You want to delete the record ?")) {
                            for (var i = 0; i < $scope.VoidList.length; i++) {
                                if ($scope.VoidList[i].ID == 0 && $scope.VoidList[i].IS_DELETED == 0 && $scope.VoidList[i].VALUE == Void.VALUE) {
                                    $scope.VoidList.splice(i, 1);
                                    $scope.VoidList.push(angular.copy($scope.BlankVoidList));
                                }
                            }
                            var len = 0;
                            angular.forEach($scope.VoidList, function (Vval) {
                                if (Vval.IS_DELETED == 0) {
                                    len = len + 1;
                                }
                            })
                            if (len == 0) {
                                //alert("Are you sure, You want to delete the record?");
                                $scope.VoidList.push(angular.copy($scope.BlankVoidList));
                            }
                        }
                    }
                   
                }
           // }
        }
        else {
            if (confirm("Are you sure, You want to delete the record ?")) {
                Void.IS_DELETED = 1;
                var Count = Array.length;
                var Cnt = 0;
                angular.forEach(Array, function (item) {
                    if (item.IS_DELETED == 1) {
                        Cnt = Cnt + 1;
                    }
                })
                if (Count == Cnt) {
                   // alert("Are you sure, You want to delete the record?");
                    $scope.VoidList.push(angular.copy($scope.BlankVoidList));
                }
                $scope.InsertEntry_VoidDeclaration();
            }

        }
        $scope.$parent.CASHUP.COMPLEMENTARYVALID = true;
        $scope.COMMON_CODE_CHANGE();
    };
    //$scope.DeleteLine = function (Array, index, IS_REDEEMED, ENTRY_TYPE_ID) {
    //    if (Array.length == 1) {
    //        alert("Are you sure, You want to delete the record ?");
    //        $scope.ComplimentaryList = [];
    //        $scope.ComplimentaryList.push(angular.copy($scope.BlankComplimentary));
    //    } else {
    //        if (ENTRY_TYPE_ID == undefined) {
    //            Array.splice(index, 1);
    //        }
    //        else {
    //            Array = Array.filter(function (x) { return x.IS_REDEEMED == IS_REDEEMED && x.ENTRY_TYPE_ID == ENTRY_TYPE_ID }).splice(index, 1);
    //        }
    //    }    
    //};
    //$scope.DeleteVoidLine = function (Array, index, IS_REDEEMED, ENTRY_TYPE_ID) {
    //    if (Array.length == 1) {
    //        alert("Are you sure, You want to delete the record ?");
    //        $scope.VoidList = [];
    //        $scope.VoidList.push(angular.copy($scope.BlankVoidList));

    //    } else {
    //        if (ENTRY_TYPE_ID == undefined) {
    //            Array.splice(index, 1);
    //        }
    //        else {
    //            Array = Array.filter(function (x) { return x.IS_REDEEMED == IS_REDEEMED && x.ENTRY_TYPE_ID == ENTRY_TYPE_ID }).splice(index, 1);
    //        }
    //    }  
    //};   
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
    $scope.GET_CASHUP_CATEGORY_BIFURCATION = function () {
        var CashupModelObj = new Object();
        CashupModelObj.ID = $scope.$parent.CASHUP.ID;
        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_CASHUP_CATEGORY_BIFURCATION').then(function (data) {
            if (data != undefined && data.data != undefined) {
                //$scope.TAB_OPENLIST = data.data.Table;
                $scope.$parent.CASHUP.EPOS_CAT_DATA = data.data.Table1;
                $scope.$parent.CASHUP.EPOS_DATA = data.data.Table2;
                $scope.$parent.CASHUP.MEDIA_DATA = data.data.Table5;
                $scope.$parent.CASHUP.EPOS_TOTAL = 0;
                angular.forEach($scope.$parent.CASHUP.EPOS_DATA, function (value) {
                    if (value.MEDIA != 'Transitory') {
                        $scope.$parent.CASHUP.EPOS_TOTAL = $scope.$parent.CASHUP.EPOS_TOTAL + value.SALES_AMT;
                    }
                });
                $scope.$parent.CASHUP.REV_CASHUP_TOTAL = $scope.$parent.CASHUP.DEPOSIT_TOTAL + $scope.$parent.CASHUP.TOTAL_CASH + $scope.$parent.CASHUP.TOTAL_TOTAL_VAL + $scope.$parent.CASHUP.TOTAL_CHEQUE + $scope.$parent.CASHUP.TOTAL_CARD + $scope.$parent.CASHUP.REDEEMED_TOTAL + $scope.$parent.CASHUP.ACCOUNT_TOTAL + $scope.$parent.CASHUP.DEPOSIT_REDEEMED_TOTAL + $scope.$parent.CASHUP.ISSUE_TOTAL;
                $scope.$parent.CASHUP.VARIANCE_TOTAL = $scope.$parent.CASHUP.VARIANCE_CASH + $scope.$parent.CASHUP.VARIANCE_CARD + $scope.$parent.CASHUP.VARIANCE_REDEEMED + $scope.$parent.CASHUP.VARIANCE_ACCOUNT + $scope.$parent.CASHUP.VARIANCE_PETTY_CASH + $scope.$parent.CASHUP.DEPOSIT_TOTAL + $scope.$parent.CASHUP.DEPOSIT_REDEEMED_TOTAL;
            }


        });
    };
    $scope.GET_ENTRY_TYPE_DECLARATION = function () {
        var CashupModelObj = new Object();
        CashupModelObj.ID = $scope.$parent.CASHUP.ID;
        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_ENTRY_TYPE_DECLARATION').then(function (data) {

            var VList = angular.copy($filter('filter')(data.data.Table, { ENTRY_TYPE_ID: 7 }));

            //VList = angular.copy($filter('orderBy')(VList, 'ID'));
            if (VList.length > 0) {
                $scope.VoidList = VList;
                //angular.forEach(VList, function (Vitem) {
                //    angular.forEach($scope.CodeList, function (Void) {
                //        if (Vitem.CODE == Void.CODE && Vitem.ENTRY_TYPE_ID == Void.ENTRY_TYPE_ID) {
                //          //if (Vitem.ENTRY_TYPE_DETAIL_ID == Void.ID && Vitem.ENTRY_TYPE_ID == Void.ENTRY_TYPE_ID) {
                //            //var VoidObj = { ID: Vitem.ENTRY_TYPE_DETAIL_ID, ENTRY_TYPE_ID: 7, ENTRY_TYPE_DETAIL_ID: Vitem.ENTRY_TYPE_DETAIL_ID, CODE: Vitem.CODE, CHECK_NO: Vitem.CHECK_NO, VALUE: Vitem.VALUE };
                //            var VoidObj = { ID: Vitem.ID, ENTRY_TYPE_ID: 7, ENTRY_TYPE_DETAIL_ID: Vitem.ENTRY_TYPE_DETAIL_ID, CODE: Vitem.CODE, CHECK_NO: Vitem.CHECK_NO, VALUE: Vitem.VALUE };
                //            $scope.VoidList.push(angular.copy(VoidObj));
                //        }
                //    })
                //})
                $scope.VoidList.push(angular.copy($scope.BlankVoidList));
            }
            else {
                //$scope.VoidLine();
                // var len = $scope.VoidList.length;
                if ($scope.VoidList.length == 0) {
                    $scope.VoidList.push(angular.copy($scope.BlankVoidList));
                }
            }

            $scope.ComplimentaryList = angular.copy($filter('filter')(data.data.Table, { ENTRY_TYPE_ID: 6 }));
            $scope.ComplimentaryList = angular.copy($filter('orderBy')($scope.ComplimentaryList, 'ID'));
            //$filter('orderBy')(data.data.Table1, 'ID');//.filter(function (x) { return x.ID != null });// angular.copy($filter('filter')(data.data, { ENTRY_TYPE_ID: 6 }));
            $scope.GET_ENTITY_STAFF();
            //$scope.ComplimentaryLine();
            //if ($scope.ComplimentaryList.length == 0) {
            //    $scope.ComplimentaryList.push(angular.copy($scope.BlankComplimentary));
            //}
            $scope.ComplimentaryList.push(angular.copy($scope.BlankComplimentary));

            if ($scope.$parent.CASHUP.CompValid) {
                $scope.GET_EPOS_VOID_COMP_Reset();

            }
            $scope.GET_CASHUP_CATEGORY_BIFURCATION();
        });
    };
    //GET_ENTRY_MASTER_DETAILS();
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
                //$scope.VoidList = angular.copy($filter('filter')(data.data.Table, { ENTRY_TYPE_ID: 7 }));
                $scope.CodeList = angular.copy($filter('filter')(data.data.Table, { ENTRY_TYPE_ID: 7 }));
                $scope.GET_ENTRY_TYPE_DECLARATION();

            }
            $scope.$parent.overlay_loadingNew = 'none';
        });
    }
    $scope.GET_ENTRY_MASTER_DETAILS();


    ////////////////////////Comment Code////////////////////////////////////////////////
    var timer = "";
    function clockUpdate() {
        var date = new moment($scope.CURRENT_UTC_TIME).add(1, 'seconds');
        $scope.CURRENT_UTC_TIME = date;
        $scope.$apply();
    }

    $scope.GET_CASHUP_HEADER_NOTES = function () {
        var CashupModelObj = new Object();
        CashupModelObj.NOTE_TYPE_ID = $scope.NOTE_TYPE_ID;
        CashupModelObj.CASHUP_HEADER_ID = $scope.$parent.CASHUP.ID;
        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_CASHUP_HEADER_NOTES').then(function (data) {
            $scope.CURRENT_UTC_TIME = angular.copy(data.data.UTC_TIME[0].UTC_TIME);
            if (timer) {
                clearInterval(timer);
            }
            timer = setInterval(clockUpdate, 1000);
            if (data.data.Table != null && data.data.Table.length > 0) {
                $scope.COMP_NOTE_LIST = data.data.Table;
            }
        });
    };
    $scope.GET_CASHUP_HEADER_NOTES();
    $scope.EDIT_COMMENTS = function (LINE) {
        LINE.COPY_NOTE = angular.copy(LINE.NOTE);
        LINE.IS_EDIT = true;
    }
    $scope.SAVE_COMMENTS = function (LINE) {
        $scope.INS_UPD_CASHUP_HEADER_NOTES(LINE);

    }
    $scope.CHECK_EVENTS = function ($event, LINE) {
        if ($event.keyCode == 27) {
            $scope.EDIT_CANCEL(LINE);
        }
    }
    $scope.EDIT_CANCEL = function (LINE) {
        LINE.NOTE = angular.copy(LINE.COPY_NOTE);
        LINE.IS_EDIT = false;
    }
    $scope.SET_TIME_AND_DATE = function (LINE) {
        LINE.START_COUNTDOWN = {
            minutes: 0,
            seconds: 0,
            getTimeRemaining: function (endtime) {
                var b = Date.parse(endtime) - Date.parse(new Date($scope.CURRENT_UTC_TIME));
                var t = endtime.getTime() - new Date($scope.CURRENT_UTC_TIME).getTime();
                var minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
                var seconds = Math.floor((b % (1000 * 60)) / 1000);
                return {
                    'minutes': minutes,
                    'seconds': seconds
                };
            },
            initializeClock: function (endtime) {
                function updateClock() {
                    var t = LINE.START_COUNTDOWN.getTimeRemaining(endtime);
                    LINE.START_COUNTDOWN.minutes = t.minutes;
                    LINE.START_COUNTDOWN.seconds = t.seconds;
                    if (t.seconds < 0) {
                        $interval.cancel(timeinterval);
                        LINE.IS_TIME_EDIT_FLAG = false;
                        LINE.IS_EDIT = false;
                    }
                }
                updateClock();
                var timeinterval = $interval(updateClock, 1000);
            }
        }
        var deadline = new Date(LINE.RESPONSE_END_DATE);
        LINE.START_COUNTDOWN.initializeClock(deadline);
    }
    $scope.NOTE_INIT = function (LINE) {
        var CREATED_DATE_TIME = angular.copy(LINE.CREATED_DATE);
        LINE.CREATED_DATE_TIME = moment(CREATED_DATE_TIME).add($scope.SETTING_MINTS, 'Minute');
        if (moment(LINE.CREATED_DATE_TIME) > moment($scope.CURRENT_UTC_TIME)) {
            LINE.IS_TIME_EDIT_FLAG = true;
            LINE.RESPONSE_END_DATE = new Date(LINE.CREATED_DATE_TIME);
            $scope.SET_TIME_AND_DATE(LINE);
        }
    }
    $scope.INS_UPD_CASHUP_HEADER_NOTES = function (LINE) {
        if ($scope.$parent.CASHUP.COMP_NOTES != undefined && $scope.$parent.CASHUP.COMP_NOTES != null && $scope.$parent.CASHUP.COMP_NOTES != "" ||  LINE != undefined && LINE != null && LINE != "") {
            var CashupModelObj = new Object();
            CashupModelObj.NOTE_TYPE_ID = $scope.NOTE_TYPE_ID;
            CashupModelObj.ID = $scope.$parent.CASHUP.ID;//CASHUP_HEADER_ID
            if (LINE != undefined) {
                CashupModelObj.NOTE_TABLE_ID = LINE.TABLE_ID;
                CashupModelObj.NOTE = LINE.NOTE;
                LINE.IS_EDIT = false;
            }
            else {
                CashupModelObj.NOTE_TABLE_ID = 0;
                CashupModelObj.NOTE = $scope.$parent.CASHUP.COMP_NOTES;
            }
            CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.CASHUP_API(CashupModelObj, 'INS_UPD_CASHUP_HEADER_NOTES').then(function (data) {
                $scope.$parent.CASHUP.COMP_NOTES = "";
                $scope.GET_CASHUP_HEADER_NOTES();
            });
        }
    }
    //INS_ENTRY_TYPE_DECLARATION

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
    $scope.CheckDecimal = function (VISS) {
        if (VISS.VALUE == '.') {
            VISS.VALUE = '';
        }
    };
    $scope.ValidateComplementary = function () {
         
        $scope.$parent.CASHUP.COMPLEMENTARYVALID = true;
        angular.forEach($scope.VoidList, function (Y) {
            Y.CODE_VALID = true;
            Y.VALUE_VALID = true;
            if (((Y.VALUE != null && Y.VALUE != "") || (Y.CODE != null && Y.CODE != "") || (Y.CHECK_NO != null && Y.CHECK_NO != "")) && Y.IS_DELETED == 0) {
                if (Y.CODE == null || Y.CODE == "") {
                    Y.CODE_VALID = false;
                }
                if (Y.VALUE == null || Y.VALUE == "") {
                    Y.VALUE_VALID = false;
                }
            }
            if (!Y.CODE_VALID || !Y.VALUE_VALID) {
                $scope.$parent.CASHUP.COMPLEMENTARYVALID = false;
            }

        });
        angular.forEach($scope.ComplimentaryList, function (x) {
            x.DISCOUNT_VALID = true;
            x.AUTHORIZED_BY_VALID = true;
            x.REASON_VALID = true;

            if (((x.AUTHORIZED_BY != null && x.AUTHORIZED_BY != "") || (x.CHECK_NO != null && x.CHECK_NO != "") || (x.VOUCHER_TYPE != null && x.VOUCHER_TYPE != "")
                || (x.CUSTOMER_NAME != null && x.CUSTOMER_NAME != "") || (x.CODE != null && x.CODE != "") || (x.MODE != null && x.MODE != "")
                || (x.DISCOUNT != null && x.DISCOUNT != "") || (x.NOTE != null && x.NOTE != "")) && (x.IS_DELETED == 0)) {

                if (x.DISCOUNT == null || x.DISCOUNT == 0 || x.DISCOUNT == "") {
                    x.DISCOUNT_VALID = false;
                }
                if (x.AUTHORIZED_BY == null || x.AUTHORIZED_BY == 0 || x.AUTHORIZED_BY == "") {
                    x.AUTHORIZED_BY_VALID = false;
                }
                if (x.CUSTOMER_NAME == null || x.CUSTOMER_NAME == 0 || x.CUSTOMER_NAME == "") {
                    x.REASON_VALID = false;
                }

            }
            if (!x.DISCOUNT_VALID || !x.AUTHORIZED_BY_VALID || !x.REASON_VALID) {
                $scope.$parent.CASHUP.COMPLEMENTARYVALID = false;
            }
        });
        if ($scope.$parent.CASHUP.COMPLEMENTARYVALID == false) {
            $scope.$parent.CASHUP.CompValid = true;
        }
        //else {
        //    $scope.$parent.CASHUP.CompValid = false;
        //}

        if ($scope.$parent.CASHUP.COMPLEMENTARYVALID) {
            $scope.TabValid = true;
        }

    }
    $scope.InsertEntry_VoidDeclaration = function () {

        $scope.ValidateComplementary();
        if ($scope.$parent.CASHUP.COMPLEMENTARYVALID) {
            $scope.$parent.CASHUP.CompValid = false;
            $scope.$parent.AutoValid_Void = [];
            $scope.$parent.AutoValid_Comp = [];
            $scope.$parent.CASHUP.BackValid = false;
            var CashupModelObj = new Object();
            var VoucherList = [];
            var cnt = 0;
            $scope.VoidList.filter(function (x) {
                if (x.VALUE > 0 || x.VALUE == 0) {
                    x.VALUE = '' + x.VALUE;
                }
            });

            angular.forEach($scope.VoidList, function (VList) {
                angular.forEach($scope.CodeList, function (CList) {
                    if (CList.CODE == VList.CODE) {
                        VList.ENTRY_TYPE_DETAIL_ID = CList.ID;
                    }
                })
            });

            angular.forEach($scope.VoidList, function (voucherissue) {
                if (voucherissue.VALUE != undefined && voucherissue.VALUE != '' && voucherissue.ENTRY_TYPE_ID == 7) {
                    //if (voucherissue.VALUE != undefined && voucherissue.VALUE != 0 && voucherissue.ENTRY_TYPE_ID == 7) {
                    var voucher = new Object();
                    voucher.ID = voucherissue.ID;
                    voucher.ENTRY_TYPE_ID = voucherissue.ENTRY_TYPE_ID;
                    voucher.ENTRY_TYPE_DETAIL_ID = voucherissue.ENTRY_TYPE_DETAIL_ID;
                    voucher.CODE = voucherissue.CODE;
                    voucher.VALUE = voucherissue.VALUE;
                    voucher.CHECK_NO = voucherissue.CHECK_NO != undefined ? voucherissue.CHECK_NO : "";
                    voucher.IS_DELETED = voucherissue.IS_DELETED;
                    VoucherList[cnt] = voucher;
                    cnt++;
                }
            });
            CashupModelObj.DECLARATION_DETAILS = VoucherList;

            var VOID_TOTAL = 0;
            CashupModelObj.DECLARATION_DETAILS.filter(function (x) {
                if (x.ENTRY_TYPE_ID == 7 && x.IS_DELETED == 0) {
                    VOID_TOTAL += parseFloat(x.VALUE);
                }
            });
            VoucherList = [];
            cnt = 0;

            angular.forEach($scope.ComplimentaryList, function (voucherissue) {
                if (voucherissue.VALUE != undefined && voucherissue.VALUE != '' && voucherissue.ENTRY_TYPE_ID == 6) {
                    var voucher = new Object();
                    voucher.ID = voucherissue.ID;
                    voucher.ENTRY_TYPE_ID = voucherissue.ENTRY_TYPE_ID;
                    voucher.ENTRY_TYPE_DETAIL_ID = 0;//voucherissue.ENTRY_TYPE_DETAIL_ID;
                    voucher.VOUCHER_TYPE = voucherissue.VOUCHER_TYPE;
                    voucher.CODE = voucherissue.CODE;
                    voucher.VALUE = parseFloat(voucherissue.VALUE).toFixed(2);
                    voucher.CHECK_NO = voucherissue.CHECK_NO;
                    voucher.CUSTOMER_NAME = voucherissue.CUSTOMER_NAME;
                    voucher.MODE = voucherissue.MODE;
                    voucher.NOTE = voucherissue.NOTE;
                    voucher.AUTHORIZED_BY = voucherissue.AUTHORIZED_BY;
                    voucher.DISCOUNT = parseFloat(voucherissue.DISCOUNT).toFixed(2);
                    voucher.FOOD = voucherissue.FOOD;
                    voucher.DRINKS = voucherissue.DRINKS;
                    voucher.LIGHT_SPEED_ACCOUNTFISCID = voucherissue.LIGHT_SPEED_ACCOUNTFISCID;
                    voucher.IS_DELETED = voucherissue.IS_DELETED;
                    VoucherList[cnt] = voucher;
                    cnt++;
                }
            });


            CashupModelObj.COMP_DECLARATION = VoucherList;
            var COMP_TOTAL = 0;
            CashupModelObj.COMP_DECLARATION.filter(function (x) {
                if (x.ENTRY_TYPE_ID == 6 && x.IS_DELETED == 0) {
                    COMP_TOTAL += parseFloat(x.VALUE);
                }
            });
            CashupModelObj.ID = $scope.$parent.CASHUP.ID;
            CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            CashupModelObj.BRANCH_ID = $scope.$parent.CASHUP.BRANCH_ID;
            CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
            CashupModelObj.VOID_TOTAL = VOID_TOTAL;//$scope.$parent.CASHUP.VOID_TOTAL;
            CashupModelObj.COMPLEMENTRY_TOTAL = COMP_TOTAL;//$scope.$parent.CASHUP.COMP_TOTAL;
            CashupModelObj.NOTE_TABLE_ID = $scope.$parent.CASHUP.COMP_NOTES_ID;
            CashupModelObj.NOTE_TYPE_ID = $scope.NOTE_TYPE_ID;
            CashupModelObj.NOTE = $scope.$parent.CASHUP.COMP_NOTES;
            CashupModelObj.STEP_NO = 9;


            PrcCommMethods.CASHUP_API(CashupModelObj, 'INS_ENTRY_VOID_DECLARATION').then(function (data) {
                if ($scope.CASHUP.KeyColor == "Complimentary") {
                    $scope.GET_ENTRY_MASTER_DETAILS();
                }
            });
        }
        //else {
        //    alert("Please fill the mandatory fields.");
        //}
    };
    $scope.ValidControls = function (x) {
        if ($scope.$parent.CASHUP.COMPLEMENTARYVALID) {
            x.DISCOUNT_VALID = true;
            x.AUTHORIZED_BY_VALID = true;
            x.REASON_VALID = true;
        }
    }
    $scope.ValidControls_CODE = function (Y) {
        if ($scope.$parent.CASHUP.COMPLEMENTARYVALID) {
            Y.CODE_VALID = true;
            Y.VALUE_VALID = true;
        }
    }
    $scope.NextLink = function (val) {
        $scope.KeyColor = val;

        $scope.InsertEntry_VoidDeclaration();
        if ($scope.$parent.CASHUP.COMPLEMENTARYVALID) {
            $scope.TabValid = false;
            $scope.$parent.CASHUP.CompValid = false;
            $scope.$parent.CASHUP.BackValid = false;
            $location.path("Reviews").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
        }

    }
    $scope.PreviousLink = function () {

        $scope.InsertEntry_VoidDeclaration();
        if ($scope.$parent.CASHUP.COMPLEMENTARYVALID) {
            $scope.TabValid = false;
            $scope.$parent.CASHUP.CompValid = false;
            $scope.$parent.CASHUP.BackValid = false;
            if ($scope.$parent.CASHUP.TABLIST[8].FLAG == 1) {
                $location.path("Deposits").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
            } else if ($scope.$parent.CASHUP.TABLIST[7].FLAG == 1) {
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
            //$location.path("Deposits").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID});
        }
    }
    $scope.$on('$destroy', function () {
         
        if ($scope.TabValid) {
            // $scope.$parent.CASHUP.CompValid = false;
            if ($scope.$parent.CASHUP.FG == null) {
                $scope.ValidateComplementary();

                if ($scope.$parent.CASHUP.COMPLEMENTARYVALID) {
                    $scope.$parent.CASHUP.CompValid = false;
                    if ($scope.VoidList.length > 0 || $scope.ComplimentaryList.length > 0) {
                        $scope.InsertEntry_VoidDeclaration();
                    }
                } else {
                    if ($scope.$parent.CASHUP.CompValid) {
                        $scope.$parent.AutoValid_Void = $scope.VoidList;
                        $scope.$parent.AutoValid_Comp = $scope.ComplimentaryList;
                        $location.path("Complimentary").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                        //alert("Please fill the mandatory fields.");
                    } else {
                        $location.path("Complimentary").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                        //alert("Please fill the mandatory fields.");
                    }
                }
            }
        }
    });

    //if ($scope.Msg == '') {
    //    $location.path("Complimentary").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
    //} else {
    //    $location.path("Complimentary").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
    //    $scope.GET_EPOS_VOID_COMP_Reset();
    //}
    $scope.VoidValid = false;
    $scope.GET_EPOS_VOID_COMP = function () {

        if ($scope.ComplimentaryList[0].VALUE != '' || $scope.VoidList[0].VALUE != '') {
            $scope.Msg = 'Are you sure you want to replace Actual data to EPOS Void/Complimentary ?';
        } else {
            $scope.Msg = 'Are you sure you want to display EPOS Void/Complimentary ?';
        }
        if (confirm($scope.Msg)) {

            //$scope.VoidList = [];
            //$scope.ComplimentaryList = [];         
            angular.forEach($scope.VoidList, function (Void) {
                Void.IS_DELETED = 1;
            });
            angular.forEach($scope.ComplimentaryList, function (Comp) {
                Comp.IS_DELETED = 1;
            });

            var CashupModelObj = new Object();
            CashupModelObj.ID = $scope.$parent.CASHUP.ID;

            PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_EPOS_VOID_COMP').then(function (data) {

                if (data != undefined && data.data != undefined) {
                    // var VList = angular.copy($filter('filter')(data.data.Table2, { ENTRY_TYPE_ID: 7 }));
                    if (data.data.Table2 != undefined && data.data.Table2.length > 0) {
                        var VList = angular.copy($filter('filter')(data.data.Table2));
                        VList = angular.copy($filter('orderBy')(VList, 'ID'));
                        if (VList.length > 0) {
                            angular.forEach(VList, function (Vitem) {
                                //var VoidObj = { ID: 0, ENTRY_TYPE_ID: 7, ENTRY_TYPE_DETAIL_ID: 0, CODE: Vitem.CODE, CHECK_NO: Vitem.CHECK_NO, VALUE: Vitem.AMOUNT };
                                //     $scope.VoidList.push(angular.copy(VoidObj));
                                //------------------------------------------------------------
                                var CODE_VALID = false;
                                // angular.forEach($scope.CodeList, function (Void) {
                                for (var i = 0; i < $scope.CodeList.length; i++) {
                                    if (Vitem.CODE != null) {
                                        if (Vitem.CODE.toUpperCase() == $scope.CodeList[i].CODE.toUpperCase()) {
                                            var VoidObj = { ID: 0, ENTRY_TYPE_ID: 7, ENTRY_TYPE_DETAIL_ID: 0, CODE: $scope.CodeList[i].CODE, CHECK_NO: Vitem.CHECK_NO, VALUE: Vitem.AMOUNT, IS_DELETED: 0 };
                                            $scope.VoidList.push(angular.copy(VoidObj));
                                            CODE_VALID = false;
                                            break;
                                        } else {
                                            CODE_VALID = true;
                                        }
                                    } else {
                                        $scope.VoidValid = true;
                                    }
                                }
                                // })
                                if (CODE_VALID) {
                                    var VoidObj = { ID: 0, ENTRY_TYPE_ID: 7, ENTRY_TYPE_DETAIL_ID: 0, CODE: null, CHECK_NO: Vitem.CHECK_NO, VALUE: Vitem.AMOUNT, IS_DELETED: 0 }; //Vitem.CODE == "" ? null : Vitem.CODE
                                    $scope.VoidList.push(angular.copy(VoidObj));
                                }
                            })
                        }

                        //if ($scope.VoidList.length == 0) {
                        //    //  $scope.VoidLine();
                        //    $scope.VoidList.push(angular.copy($scope.BlankVoidList));
                        //}


                        if ($scope.VoidValid) {
                            $scope.VoidList.push(angular.copy($scope.BlankVoidList));
                        } else if ($scope.VoidList.length == 0 || $scope.VoidList.length > 0) {
                            $scope.VoidList.push(angular.copy($scope.BlankVoidList));
                        }
                    } else {
                        $scope.VoidList.push(angular.copy($scope.BlankVoidList));
                    }

                    var compdata = [];
                    //$scope.ComplimentaryList = angular.copy($filter('orderBy')(data.data.Table1, 'ID'));
                    if (data.data.Table1 != undefined && data.data.Table1.length > 0) {
                        angular.forEach(data.data.Table1, function (Comp) {
                            Comp.ID = 0;
                            Comp.ENTRY_TYPE_ID = 6;
                            Comp.IS_DELETED = 0;
                            $scope.ComplimentaryList.push(Comp);
                        });
                    }
                    $scope.GET_ENTITY_STAFF();
                    // $scope.ComplimentaryLine();
                    $scope.ComplimentaryList.push(angular.copy($scope.BlankComplimentary));
                    $scope.GET_CASHUP_CATEGORY_BIFURCATION();
                    $scope.$parent.CASHUP.CompValid = true;
                    $scope.$parent.CASHUP.BackValid = true;
                }
            });
        }

    };
    $scope.GET_EPOS_VOID_COMP_Reset = function () {

        $scope.VoidList = [];
        $scope.ComplimentaryList = [];
        $scope.VoidList = $scope.$parent.AutoValid_Void;
        $scope.ComplimentaryList = $scope.$parent.AutoValid_Comp;
        $scope.ValidateComplementary();
        $scope.GET_CASHUP_BY_ID();
        //$scope.$parent.CASHUP.BackValid = true;
        //var CashupModelObj = new Object();
        //CashupModelObj.ID = $scope.$parent.CASHUP.ID;

        //PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_EPOS_VOID_COMP').then(function (data) {

        //    if (data != undefined && data.data != undefined) {
        //        // var VList = angular.copy($filter('filter')(data.data.Table2, { ENTRY_TYPE_ID: 7 }));
        //        var VList = angular.copy($filter('filter')(data.data.Table2));
        //        VList = $filter('orderBy')(VList, 'ID');
        //        if (VList.length > 0) {
        //            angular.forEach(VList, function (Vitem) {
        //                angular.forEach($scope.CodeList, function (Void) {
        //                    if (Vitem.CODE.toUpperCase() == Void.CODE.toUpperCase()) {
        //                        var VoidObj = { ID: 0, ENTRY_TYPE_ID: 7, ENTRY_TYPE_DETAIL_ID: 0, CODE: Void.CODE, CHECK_NO: Vitem.CHECK_NO, VALUE: Vitem.AMOUNT };
        //                        $scope.VoidList.push(angular.copy(VoidObj));
        //                    }
        //                    //if (Vitem.ENTRY_TYPE_DETAIL_ID == Void.ID && Vitem.ENTRY_TYPE_ID == Void.ENTRY_TYPE_ID) {
        //                    //    var VoidObj = { ID: Vitem.ENTRY_TYPE_DETAIL_ID, ENTRY_TYPE_ID: 7, ENTRY_TYPE_DETAIL_ID: Vitem.ENTRY_TYPE_DETAIL_ID, CODE: Vitem.CODE, CHECK_NO: Vitem.CHECK_NO, VALUE: Vitem.VALUE };
        //                    //    $scope.VoidList.push(angular.copy(VoidObj));
        //                    //}
        //                })
        //            })
        //        } else {
        //            $scope.VoidLine();
        //        }
        //        $scope.ComplimentaryList = $filter('orderBy')(data.data.Table1, 'ID');
        //        angular.forEach($scope.ComplimentaryList, function (Comp) {
        //            Comp.ENTRY_TYPE_ID = 6;
        //        });
        //        $scope.GET_ENTITY_STAFF();
        //        $scope.ComplimentaryLine();
        //        $scope.GET_CASHUP_CATEGORY_BIFURCATION();
        //        $scope.ValidateComplementary();
        //    }
        //});


    };

    $scope.RESET_ACTUALDATA = function () {

        if ($scope.$parent.CASHUP.BackValid) {
            $scope.GET_ENTRY_MASTER_DETAILS();
            $scope.$parent.CASHUP.CompValid = false;
            $scope.$parent.CASHUP.BackValid = false;
            $scope.VoidList = [];
            $scope.ComplimentaryList = [];
            $scope.$parent.AutoValid_Void = [];
            $scope.$parent.AutoValid_Comp = [];
            if ($scope.$parent.CASHUP.COMPLEMENTARYVALID == false) {
                $scope.$parent.CASHUP.COMPLEMENTARYVALID = true;
            }
        }
    }
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
        $scope.KeyColor = val;
        $scope.TabValid = false;
        $scope.$parent.CASHUP.CompValid = false;
        $scope.$parent.CASHUP.BackValid = false;
        $location.path("Reviews_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });

    }
    $scope.PreviousLink_View = function () {


        $scope.TabValid = false;
        $scope.$parent.CASHUP.CompValid = false;
        $scope.$parent.CASHUP.BackValid = false;
        if ($scope.$parent.CASHUP.TABLIST[8].FLAG == 1) {
            $location.path("Deposits_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
        } else if ($scope.$parent.CASHUP.TABLIST[7].FLAG == 1) {
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
        //$location.path("Deposits").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID});

    }
});