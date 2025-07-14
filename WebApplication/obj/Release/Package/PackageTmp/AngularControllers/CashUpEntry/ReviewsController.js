app.controller('ReviewsController', function ($scope, $http, $interval, CommService, $cookies, $filter, PrcCommMethods, $location, readFileData, readFileDataNew, $sce) {
     
    $scope.PAGE_LOAD = 1;
    $scope.$parent.CASHUP.ID = getUrlParameter('CHID', $location.absUrl());
    $scope.$parent.CASHUP.KeyColor = "Review";
    //$scope.$parent.$parent.overlay_loadingNew = 'block';
    $scope.$parent.overlay_loadingNew = 'block';
    $scope.$parent.CASHUP.ACTUAL_STEP_NO = 10;
    $scope.NOTE_TYPE_ID = 6;
    $scope.SETTING_MINTS = $scope.$parent.GET_ENTITY_SETTINGS(27)[0].SETTING_VALUE;
    $scope.REV_NOTE_LIST = [];
    $scope.$parent.CASHUP.REV_NOTES = "";
    $scope.TOTAL_ALL_DAY_FLAG = false;
    $scope.FLAG_VALID = false;
    

    $scope.$parent.dateinputOpenDate();

    if ($scope.$parent.CASHUP.INDEX != 0) {
        $scope.RTab = 0;
    } else {
        $scope.RTab = $scope.$parent.CASHUP.INDEX;
    }
    $scope.ReviewTab = function (FLAG) {
        $scope.RTab = FLAG;
    };
    $scope.ValidPettyVariance = "Valid";
    $scope.GET_CASHUP_CATEGORY_BIFURCATION = function () {
        // $scope.GET_ACC_CUST_DECLARATION();
       // $scope.FLAG_VALID = false;
        var CashupModelObj = new Object();
        CashupModelObj.ID = $scope.$parent.CASHUP.ID;
        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_CASHUP_CATEGORY_BIFURCATION').then(function (data) {
         
            if (data != undefined && data.data != undefined) {
                $scope.TAB_OPENLIST = data.data.Table;
                $scope.$parent.CASHUP.EPOS_CAT_DATA = data.data.Table1;
                $scope.$parent.CASHUP.EPOS_DATA = data.data.Table2;
                $scope.$parent.CASHUP.MEDIA_DATA = data.data.Table5;
                $scope.$parent.CASHUP.EPOS_TOTAL = 0;
                //===================================================

                $scope.EPOS_ACTUAL_LIST = [];
                for (var i = 0; i < $scope.TAB_OPENLIST.length; i++) {
                    //if ($scope.TAB_OPENLIST[i].ADD_IN_DAILY_TAKINGS) {
                    var flag = true;
                    for (var j = 0; j < $scope.$parent.CASHUP.EPOS_DATA.length; j++) {
                        if ($scope.$parent.CASHUP.EPOS_DATA[j].MEDIA == $scope.TAB_OPENLIST[i].DISPLAY_NAME) {
                            $scope.EPOS_ACTUAL_LIST.push({ ADD_IN_DAILY_TAKINGS: $scope.$parent.CASHUP.EPOS_DATA[j].ADD_IN_DAILY_TAKINGS, CASHUP_TAB_ID: $scope.$parent.CASHUP.EPOS_DATA[j].CASHUP_TAB_ID, MEDIA: $scope.$parent.CASHUP.EPOS_DATA[j].MEDIA, SALES_AMT: $scope.$parent.CASHUP.EPOS_DATA[j].SALES_AMT, SORT_ORDER: $scope.$parent.CASHUP.EPOS_DATA[j].SORT_ORDER, ACTUAL_AMT: 0, VARIANCE_AMT: 0, FLAG: 0 });
                            flag = false;
                            break;
                        }
                    }
                    if (flag) {
                        $scope.EPOS_ACTUAL_LIST.push({ ADD_IN_DAILY_TAKINGS: $scope.TAB_OPENLIST[i].ADD_IN_DAILY_TAKINGS, CASHUP_TAB_ID: $scope.TAB_OPENLIST[i].CASHUP_TAB_ID, MEDIA: $scope.TAB_OPENLIST[i].DISPLAY_NAME, SALES_AMT: 0, SORT_ORDER: $scope.TAB_OPENLIST[i].ID, ACTUAL_AMT: 0, VARIANCE_AMT: 0, FLAG: 0 });

                    }
                    //}
                }
                $scope.$parent.CASHUP.EPOS_DATA.filter(function (x) {
                    
                    if (x.MEDIA == "Unclassified") {
                        if (x.SALES_AMT != 0) {
                            $scope.EPOS_ACTUAL_LIST.push({ ADD_IN_DAILY_TAKINGS: x.ADD_IN_DAILY_TAKINGS, CASHUP_TAB_ID: x.CASHUP_TAB_ID, MEDIA: x.MEDIA, SALES_AMT: x.SALES_AMT, SORT_ORDER: x.SORT_ORDER, ACTUAL_AMT: 0, VARIANCE_AMT: 0, FLAG: 0 });
                        }
                    }
                });
                if ($scope.EPOS_ACTUAL_LIST.length > 0) {
                    angular.forEach($scope.EPOS_ACTUAL_LIST, function (val) {
                        for (var i = 0; i < $scope.$parent.CASHUP.TABLIST.length; i++) {
                            if (val.CASHUP_TAB_ID == $scope.$parent.CASHUP.TABLIST[i].CASHUP_TABS_ID) {
                                val.FLAG = $scope.$parent.CASHUP.TABLIST[i].FLAG;
                                break;
                            }
                        }
                    })
                }
                if (data.data.Table3.length > 0) {
                    $scope.$parent.CASHUP.EPOS_HEADER_DATA = [];
                    $scope.$parent.CASHUP.EPOS_HEADER_DATA = data.data.Table3;
                }

                angular.forEach($scope.EPOS_ACTUAL_LIST, function (val) {
                    if (val.MEDIA == 'Cash') {
                        val.ACTUAL_AMT = $scope.$parent.CASHUP.TOTAL_CASH;
                        val.VARIANCE_AMT = $scope.$parent.CASHUP.TOTAL_CASH - val.SALES_AMT;
                    } else if (val.MEDIA == 'Cards') {
                        val.ACTUAL_AMT = $scope.$parent.CASHUP.TOTAL_CARD;
                        val.VARIANCE_AMT = $scope.$parent.CASHUP.TOTAL_CARD - val.SALES_AMT;
                    } else if (val.MEDIA == 'Petty Cash') {
                        val.ACTUAL_AMT = $scope.$parent.CASHUP.TOTAL_TOTAL_VAL;
                        val.VARIANCE_AMT = $scope.$parent.CASHUP.TOTAL_TOTAL_VAL - val.SALES_AMT;
                    } else if (val.MEDIA == 'Delivery') {
                        val.ACTUAL_AMT = $scope.$parent.CASHUP.TOTAL_CHEQUE;
                        val.VARIANCE_AMT = $scope.$parent.CASHUP.TOTAL_CHEQUE - val.SALES_AMT;
                    } else if (val.MEDIA == 'Account Credit') {
                        val.ACTUAL_AMT = $scope.$parent.CASHUP.ACCOUNT_TOTAL;
                        val.VARIANCE_AMT = $scope.$parent.CASHUP.ACCOUNT_TOTAL - val.SALES_AMT;
                    } else if (val.MEDIA == 'Voucher Redeemed') {
                        val.ACTUAL_AMT = $scope.$parent.CASHUP.REDEEMED_TOTAL;
                        val.VARIANCE_AMT = $scope.$parent.CASHUP.REDEEMED_TOTAL - val.SALES_AMT;
                    } else if (val.MEDIA == 'Deposit Redeemed') {
                        val.ACTUAL_AMT = $scope.$parent.CASHUP.DEPOSIT_REDEEMED_TOTAL;
                        val.VARIANCE_AMT = $scope.$parent.CASHUP.DEPOSIT_REDEEMED_TOTAL - val.SALES_AMT;
                    } else if (val.MEDIA == 'Account Received') {
                        val.ACTUAL_AMT = $scope.$parent.CASHUP.ACCOUNT_RECEIVED_TOTAL;
                        val.VARIANCE_AMT = $scope.$parent.CASHUP.ACCOUNT_RECEIVED_TOTAL - val.SALES_AMT;
                    } else if (val.MEDIA == 'Voucher Issued') {
                        val.ACTUAL_AMT = $scope.$parent.CASHUP.ISSUE_TOTAL;
                        val.VARIANCE_AMT = $scope.$parent.CASHUP.ISSUE_TOTAL - val.SALES_AMT;
                    } else if (val.MEDIA == 'Deposit Received') {
                        val.ACTUAL_AMT = $scope.$parent.CASHUP.DEPOSIT_TOTAL;
                        val.VARIANCE_AMT = $scope.$parent.CASHUP.DEPOSIT_TOTAL - val.SALES_AMT;
                    } else if (val.MEDIA == 'Transitory') {
                        val.ACTUAL_AMT = val.SALES_AMT;
                        val.VARIANCE_AMT = 0;
                        if ($scope.$parent.CASHUP.INTEGRATION_SYSTEM_ID == 1) {
                            val.FLAG = 1;
                        }
                    } else if (val.MEDIA == 'Unclassified') {
                        val.ACTUAL_AMT = 0;
                        val.VARIANCE_AMT = - val.SALES_AMT;
                        val.FLAG = 1;
                    }
                })
                //  $scope.$parent.CASHUP.REV_CASHUP_TOTAL = $scope.$parent.CASHUP.TOTAL_CASH + $scope.$parent.CASHUP.TOTAL_TOTAL_VAL + $scope.$parent.CASHUP.TOTAL_CHEQUE + $scope.$parent.CASHUP.TOTAL_CARD + $scope.$parent.CASHUP.REDEEMED_TOTAL + $scope.$parent.CASHUP.ACCOUNT_TOTAL + $scope.$parent.CASHUP.DEPOSIT_REDEEMED_TOTAL + $scope.$parent.CASHUP.ISSUE_TOTAL;
                $scope.$parent.CASHUP.VARIANCE_TOTAL = 0;
                $scope.$parent.CASHUP.REV_CASHUP_TOTAL = 0;
                angular.forEach($scope.EPOS_ACTUAL_LIST, function (Variance) {
                    if (Variance.ADD_IN_DAILY_TAKINGS) {
                        $scope.$parent.CASHUP.VARIANCE_TOTAL += Variance.VARIANCE_AMT;
                        $scope.$parent.CASHUP.REV_CASHUP_TOTAL += Variance.ACTUAL_AMT;
                    }
                })
                //===================================================

                // var Flag_VCASH = true;
                // var Flag_VCARD = true;
                // var Flag_VPETTYCASH = true;
                // var Flag_VACCOUNT = true;
                // var Flag_VDELIVERY = true;
                // var Flag_VVOUCHER_RED = true;
                // var Flag_VVOUCHER_ISSUE = true;
                // var Flag_VDEPREDEEMED = true;
                // var Flag_VTRANSITORY = true;               
                // var Flag_VDEPRECIVED = true;               
                // angular.forEach($scope.$parent.CASHUP.EPOS_DATA, function (EPOSVAL) {
                //     
                //    // if (EPOSVAL.ADD_IN_DAILY_TAKINGS) {
                //         if (EPOSVAL.MEDIA.toUpperCase() == 'CASH') {
                //             $scope.$parent.CASHUP.VARIANCE_CASH = EPOSVAL.SALES_AMT * -1 - $scope.$parent.CASHUP.TOTAL_CASH * -1;
                //             Flag_VCASH = false;
                //         } else if (EPOSVAL.MEDIA.toUpperCase() == 'CARDS') {
                //             $scope.$parent.CASHUP.VARIANCE_CARD = EPOSVAL.SALES_AMT * -1 - $scope.$parent.CASHUP.TOTAL_CARD * -1;
                //             Flag_VCARD = false;
                //         } else if (EPOSVAL.MEDIA.toUpperCase() == 'PETTY CASH') {
                //             $scope.$parent.CASHUP.VARIANCE_PETTY_CASH = EPOSVAL.SALES_AMT * -1 - $scope.$parent.CASHUP.TOTAL_TOTAL_VAL * -1;
                //             Flag_VPETTYCASH = false;
                //         } else if (EPOSVAL.MEDIA.toUpperCase() == 'ACCOUNT CREDIT') {
                //             $scope.$parent.CASHUP.VARIANCE_ACCOUNT = EPOSVAL.SALES_AMT * -1 - $scope.$parent.CASHUP.ACCOUNT_TOTAL * -1;
                //             Flag_VACCOUNT = false;
                //         } else if (EPOSVAL.MEDIA.toUpperCase() == "DELIVERY") {
                //             $scope.$parent.CASHUP.VARIANCE_CHEQUE = EPOSVAL.SALES_AMT * -1 - $scope.$parent.CASHUP.TOTAL_CHEQUE * -1;
                //             Flag_VDELIVERY = false;
                //         } else if (EPOSVAL.MEDIA.toUpperCase() == "VOUCHER REDEEMED") {
                //             $scope.$parent.CASHUP.VARIANCE_REDEEMED = EPOSVAL.SALES_AMT * -1 - $scope.$parent.CASHUP.REDEEMED_TOTAL * -1;
                //             Flag_VVOUCHER_RED = false;
                //         } else if (EPOSVAL.MEDIA.toUpperCase() == 'DEPOSIT REDEEMED') {
                //             $scope.$parent.CASHUP.VARIANCE_DEPOSIT_REDEEMED = EPOSVAL.SALES_AMT * -1 - $scope.$parent.CASHUP.DEPOSIT_REDEEMED_TOTAL * -1;
                //             Flag_VDEPREDEEMED = false;
                //         } else if (EPOSVAL.MEDIA.toUpperCase() == "VOUCHER ISSUE") {
                //             $scope.$parent.CASHUP.VARIANCE_ISSUE = EPOSVAL.SALES_AMT * -1 - $scope.$parent.CASHUP.ISSUE_TOTAL * -1;
                //             Flag_VVOUCHER_ISSUE = false;
                //         }
                //    // } else {                        
                //   //  }                   
                //     //else if (EPOSVAL.MEDIA.toUpperCase() == "DEPOSIT RECEIVED") {
                //     //    $scope.$parent.CASHUP.VARIANCE_DEPOSIT = EPOSVAL.SALES_AMT * -1 - $scope.$parent.CASHUP.DEPOSIT_TOTAL * -1;
                //     //    Flag_VDEPRECIVED = false;
                //     //} 
                //     //else if (EPOSVAL.MEDIA.toUpperCase() == "TRANSITORY") {
                //     //    $scope.$parent.CASHUP.VARIANCE_DEPOSIT_REDEEMED = EPOSVAL.SALES_AMT * -1 - $scope.$parent.CASHUP.DEPOSIT_REDEEMED_TOTAL * -1;
                //     //    Flag_VDEPREDEEMED = false;
                //     //}
                // })
                // if (Flag_VCASH) {
                //     $scope.$parent.CASHUP.VARIANCE_CASH = $scope.$parent.CASHUP.TOTAL_CASH;
                // }
                // if (Flag_VCARD) {
                //     $scope.$parent.CASHUP.VARIANCE_CARD = $scope.$parent.CASHUP.TOTAL_CARD;
                // }
                // if (Flag_VPETTYCASH) {
                //     $scope.$parent.CASHUP.VARIANCE_PETTY_CASH = $scope.$parent.CASHUP.TOTAL_TOTAL_VAL;
                // }
                // if (Flag_VACCOUNT) {
                //     $scope.$parent.CASHUP.VARIANCE_ACCOUNT = $scope.$parent.CASHUP.ACCOUNT_TOTAL;
                // }
                // if (Flag_VDELIVERY) {
                //     $scope.$parent.CASHUP.VARIANCE_CHEQUE = $scope.$parent.CASHUP.TOTAL_CHEQUE;
                // }
                // if (Flag_VVOUCHER_RED) {
                //     $scope.$parent.CASHUP.VARIANCE_REDEEMED = $scope.$parent.CASHUP.REDEEMED_TOTAL;
                // }
                // if (Flag_VVOUCHER_ISSUE) {
                //     $scope.$parent.CASHUP.VARIANCE_ISSUE = $scope.$parent.CASHUP.ISSUE_TOTAL;
                // }
                // if (Flag_VDEPREDEEMED) {
                //     $scope.$parent.CASHUP.VARIANCE_DEPOSIT_REDEEMED = $scope.$parent.CASHUP.DEPOSIT_REDEEMED_TOTAL;
                // }                
                // //if (Flag_VDEPRECIVED) {
                // //    $scope.$parent.CASHUP.VARIANCE_DEPOSIT = $scope.$parent.CASHUP.DEPOSIT_TOTAL;
                // //}              
                // //if ($scope.$parent.CASHUP.EPOS_HEADER_DATA.length > 0) {
                // //    if (parseInt($scope.$parent.CASHUP.EPOS_HEADER_DATA[0].GIFT_CERT_TOTAL) != 0) {
                // //        $scope.$parent.CASHUP.VARIANCE_ISSUE = parseInt($scope.$parent.CASHUP.EPOS_HEADER_DATA[0].GIFT_CERT_TOTAL) * -1 - $scope.$parent.CASHUP.ISSUE_TOTAL * -1;
                // //    } else {
                // //        $scope.$parent.CASHUP.VARIANCE_ISSUE = $scope.$parent.CASHUP.ISSUE_TOTAL;
                // //    }
                // //} else {
                // //    $scope.$parent.CASHUP.VARIANCE_ISSUE = $scope.$parent.CASHUP.ISSUE_TOTAL;
                // //}
                // $scope.$parent.CASHUP.REV_CASHUP_TOTAL = $scope.$parent.CASHUP.TOTAL_CASH + $scope.$parent.CASHUP.TOTAL_TOTAL_VAL + $scope.$parent.CASHUP.TOTAL_CHEQUE + $scope.$parent.CASHUP.TOTAL_CARD + $scope.$parent.CASHUP.REDEEMED_TOTAL + $scope.$parent.CASHUP.ACCOUNT_TOTAL + $scope.$parent.CASHUP.DEPOSIT_REDEEMED_TOTAL + $scope.$parent.CASHUP.ISSUE_TOTAL;

                //$scope.$parent.CASHUP.VARIANCE_TOTAL = (($scope.$parent.CASHUP.VARIANCE_CASH * -1) + ($scope.$parent.CASHUP.VARIANCE_CARD * -1) + ($scope.$parent.CASHUP.VARIANCE_REDEEMED * -1) + ($scope.$parent.CASHUP.VARIANCE_ACCOUNT * -1) + ($scope.$parent.CASHUP.VARIANCE_PETTY_CASH * -1) + ($scope.$parent.CASHUP.VARIANCE_DEPOSIT_REDEEMED * -1) + ($scope.$parent.CASHUP.VARIANCE_CHEQUE * -1) + ($scope.$parent.CASHUP.VARIANCE_ISSUE * -1)) * 1;



            }
            $scope.$parent.overlay_loadingNew = 'none';
        });
    };
    $scope.CODE_ARRY = [];
    $scope.$on('ngRepeatFinishedRender', function (ngRepeatFinishedEvent) {
        $scope.CODE_ARRY = $scope.COPY_CODE_ARRY;
    });
    //$scope.$parent.CASHUP.ACCOUNT_RECEIVED_TOTAL = 0;
    $scope.GET_ACC_CUST_DECLARATION = function (FLAG) {
        if (FLAG == 0) {
            var CashupModelObj = new Object();
            CashupModelObj.ID = $scope.$parent.CASHUP.ID;
            PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_ACC_CUST_DECLARATION').then(function (data) {
                
                $scope.$parent.CASHUP.ACCOUNT_RECEIVED_TOTAL = 0;
                if (data != undefined && data.data != undefined && data.data.length > 0) {
                    angular.forEach(data.data, function (val) {
                        if (val.IS_REDEEMED == true) {
                            $scope.$parent.CASHUP.ACCOUNT_RECEIVED_TOTAL += val.AMOUNT;
                        }
                    });
                }
                else {
                    $scope.$parent.CASHUP.ACCOUNT_RECEIVED_TOTAL = 0;
                }
                $scope.$parent.$parent.overlay_loadingNew = 'none';
                // $scope.GET_CASHUP_CATEGORY_BIFURCATION();
                $scope.GET_MASTERDATA_FOR_CASHUP();
            });
        } else if (FLAG == 1) {
            var CashupModelObj = new Object();
            CashupModelObj.ID = $scope.$parent.CASHUP.ID;
            PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_ACC_CUST_DECLARATION').then(function (data) {
                
                $scope.$parent.CASHUP.ACCOUNT_RECEIVED_TOTAL = 0;
                if (data != undefined && data.data != undefined && data.data.length > 0) {
                    angular.forEach(data.data, function (val) {
                        if (val.IS_REDEEMED == true) {
                            $scope.$parent.CASHUP.ACCOUNT_RECEIVED_TOTAL += val.AMOUNT;
                        }
                    });
                }
                else {
                    $scope.$parent.CASHUP.ACCOUNT_RECEIVED_TOTAL = 0;
                }
             
            });
        }
    }
    $scope.GET_ACC_CUST_DECLARATION(0);
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
                $scope.REV_NOTE_LIST = data.data.Table;
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
        if ($scope.$parent.CASHUP.REV_NOTES != undefined && $scope.$parent.CASHUP.REV_NOTES != null && $scope.$parent.CASHUP.REV_NOTES != "" ||  LINE != undefined && LINE != null && LINE != "") {
            var CashupModelObj = new Object();
            //CashupModelObj.NOTE_TABLE_ID = $scope.$parent.CASHUP.REV_NOTES_ID != 0 ? $scope.$parent.CASHUP.REV_NOTES_ID : 0;
            CashupModelObj.NOTE_TYPE_ID = $scope.NOTE_TYPE_ID;
            CashupModelObj.ID = $scope.$parent.CASHUP.ID;//CASHUP_HEADER_ID
            CashupModelObj.NOTE = $scope.$parent.CASHUP.REV_NOTES;
            CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));

            if (LINE != undefined) {
                CashupModelObj.NOTE_TABLE_ID = LINE.TABLE_ID;
                CashupModelObj.NOTE = LINE.NOTE;
                LINE.IS_EDIT = false;
            }
            else {
                CashupModelObj.NOTE_TABLE_ID = 0;
                CashupModelObj.NOTE = $scope.$parent.CASHUP.REV_NOTES;
            }

            PrcCommMethods.CASHUP_API(CashupModelObj, 'INS_UPD_CASHUP_HEADER_NOTES').then(function (data) {
                $scope.$parent.CASHUP.REV_NOTES = "";
                $scope.GET_CASHUP_HEADER_NOTES();
            });
        }
    }

    //////////////////////// END Comment Code////////////////////////////////////////////////
    //$scope.UPD_CASHUP_HEADER_NOTES = function () {
    //    var CashupModelObj = new Object();
    //    CashupModelObj.NOTE_TABLE_ID = $scope.$parent.CASHUP.REV_NOTES_ID != 0 ? $scope.$parent.CASHUP.REV_NOTES_ID : 0;
    //    CashupModelObj.NOTE_TYPE_ID = $scope.NOTE_TYPE_ID;
    //    CashupModelObj.ID = $scope.$parent.CASHUP.ID;
    //    CashupModelObj.NOTE = $scope.$parent.CASHUP.REV_NOTES;
    //    CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
    //    PrcCommMethods.CASHUP_API(CashupModelObj, 'INS_UPD_CASHUP_HEADER_NOTES').then(function (data) {

    //    });
    //};
    $scope.$on('$destroy', function () {
        if ($scope.CASHUP.REV_NOTES != "" && $scope.CASHUP.REV_NOTES != null && $scope.CASHUP.REV_NOTES != undefined) {
            // $scope.INS_UPD_CASHUP_HEADER_NOTES();
        }
    });
    $scope.PreviousLink = function () {
        if ($scope.$parent.CASHUP.TABLIST[9].FLAG == 1) {
            $location.path("Complimentary").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
        } else if ($scope.$parent.CASHUP.TABLIST[8].FLAG == 1) {
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

    }
   
    $scope.SELECT_SESSION = function (SESSION, $event, FLAG) {
        
        //$scope.SESSION_INDEX = index;
        $scope.TOTAL_ALL_DAY_FLAG = false;
        $scope.RTab = 0;
        $scope.FLAG_VALID = false;
        if (FLAG == 1) { 
           
        if (SESSION.RDO_FLAG == false) {
           // if (SESSION.RDO_FLAG == true) {
            $scope.$parent.CASHUP.SESSION = SESSION;
            $scope.$parent.CASHUP.SESSION_ID = $scope.$parent.CASHUP.SESSION.SESSION_MAPPING_ID;
            if ($scope.$parent.CASHUP.FG == null) {
                $scope.GET_MASTERDATA_FOR_CASHUP();
                //$scope.GET_ACC_CUST_DECLARATION();
            } else if ($scope.$parent.CASHUP.FG == "VIEW") {
                $scope.GET_MASTERDATA_FOR_CASHUP();
                //$scope.GET_ACC_CUST_DECLARATION();
            }
        } else {
            var text = "";
            if ($scope.$parent.CASHUP.SessionListData.length > 1) {
              //  angular.forEach($scope.$parent.CASHUP.SessionListData, function (val,index) {
                for (var i = 0; i < $scope.$parent.CASHUP.SessionListData.length; i++) {
                    if (text == "") {
                        text = $scope.$parent.CASHUP.SessionListData[i].SESSION_NAME + " or ";
                    }
                    else {
                        //text = text + " & " + val.SESSION_NAME;
                        if ($scope.$parent.CASHUP.SessionListData.length == i + 1) {
                            if (text.charAt(text.length - 1) === ',') {
                                text = text.slice(0, -1);
                            }
                            text += " and " + $scope.$parent.CASHUP.SessionListData[i].SESSION_NAME;

                        } else {
                            text += " "+$scope.$parent.CASHUP.SessionListData[i].SESSION_NAME + ",";

                        }
                    }
                }
               // })
            }
            $scope.$parent.ShowAlert("Attention", "Any one session can be submitted, Either " + text + "", 3000);
           // $event.preventDefault();
            $event.stopPropagation();
            //alert("Any one session can be submitted, 'ALL' or " + text + "");
        }
        } else if (FLAG == 2) {
           
            $scope.SELECTED_SESSION = SESSION;
            if ($scope.EDIT_START_DATE != null && SESSION != null) {
               
                //$scope.$parent.CASHUP.SESSION = SESSION;
                $scope.SELECTED_SESSION_ID = SESSION.SESSION_MAPPING_ID;
                $scope.SELECTED_SESSION = SESSION;
                //$scope.GET_CASHUP_BY_ID();
                $scope.EDITDATE_FLAG = false;
            }
            
    }

    }
    $scope.InsertCashUpHeader_12 = function () {
         
        var CashupModelObj = new Object();
        CashupModelObj.ID = $scope.$parent.CASHUP.ID;
        CashupModelObj.CASHUP_MAIN_ID = $scope.$parent.CASHUP.CASHUP_MAIN_ID;
        CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CashupModelObj.BRANCH_ID = $scope.$parent.CASHUP.BRANCH_ID;
        CashupModelObj.TILL_ID = $scope.$parent.CASHUP.TYPE == 1 ? $scope.$parent.CASHUP.TILL_ID : null;
        CashupModelObj.SESSION_ID = $scope.$parent.CASHUP.TYPE == 2 ? $scope.$parent.CASHUP.SESSION_ID : null;
        CashupModelObj.AREA_ID = $scope.$parent.CASHUP.AREA_ID;
        CashupModelObj.CASHUP_DATE = $scope.$parent.CASHUP.CASHUP_DATE;
        CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
        CashupModelObj.TYPE = $scope.$parent.CASHUP.TYPE;
        CashupModelObj.STEP_NO = 0;

        PrcCommMethods.CASHUP_API(CashupModelObj, 'INS_CASHUP_HEADER').then(function (data) {
            $scope.$parent.CASHUP.ID = data.data;

        });
    };

    //===============================================================

    //$scope.GET_REVENUE_CENTERS = function () {
    //    var CashupModelObj = new Object();
    //    CashupModelObj.ID = $scope.$parent.CASHUP.ID;
    //    PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_REVENUE_CENTERS').then(function (data) {
    //        // $scope.CASHUP.REVENUE_CENTERS= [];
    //        if (data != undefined && data.data != undefined) {
    //            //$scope.$parent.CASHUP.REVENUE_CENTERS = [];
    //            $scope.$parent.CASHUP.REVENUE_CENTERS = data.data.Table;
    //        }
    //    });
    //};
    $scope.GET_EPOS_HEADER = function () {

        var CashupModelObj = new Object();
        CashupModelObj.ID = $scope.$parent.CASHUP.ID;

        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_EPOS_HEADER').then(function (data) {

            if (data != undefined && data.data != undefined && data.data.length > 0) {
                $scope.$parent.CASHUP.EPOS_HEADER_DATA = [];
                $scope.$parent.CASHUP.EPOS_HEADER_DATA = data.data;

            }
            //else {
            //    $scope.$parent.CASHUP.EPOS_HEADER_DATA = [];
            //}
            //$scope.GET_ACC_CUST_DECLARATION();
            $scope.GET_CASHUP_CATEGORY_BIFURCATION();
            //if ($scope.FLAG_VALID) {
            //    $scope.GET_ALL_DAYS_SALES();
            //}
        });
    };
    $scope.GET_EPOS_DATA = function () {

        var CashupModelObj = new Object();
        CashupModelObj.ID = $scope.$parent.CASHUP.ID;
        CashupModelObj.INTEGRATION_SYSTEM_ID = $scope.$parent.CASHUP.INTEGRATION_SYSTEM_ID;

        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_EPOS_DATA').then(function (data) {

            if (data != undefined && data.data != undefined && data.data.length > 0) {
                $scope.EPOS_ACCOUNT_GROUPS_DATA = data.data;
                //$scope.stop();
            }
            else {
                $scope.EPOS_ACCOUNT_GROUPS_DATA = [];

            }
        });
    };
    $scope.GET_CASHUP_BY_ID = function () {
         
        var CashupModelObj = new Object();
        CashupModelObj.CASHUP_MAIN_ID = $scope.$parent.CASHUP.CASHUP_MAIN_ID;
        CashupModelObj.SESSION_ID = $scope.$parent.CASHUP.SESSION_ID;
        CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_CASHUP_BY_ID').then(function (data) {
             
            if (data != undefined && data.data != undefined && data.data.Table.length > 0) {
                $scope.$parent.CASHUP.ID = data.data.Table[0].ID;
                $scope.GET_REVENUE_CENTERS();
                $scope.REV_NOTE_LIST = [];
                $scope.GET_CASHUP_HEADER_NOTES();
                $scope.$parent.CASHUP.BRANCH_ID = data.data.Table[0].BRANCH_ID;
                //$scope.$parent.CASHUP.AREA_ID = data.data[0].AREA_ID;
                $scope.$parent.CASHUP.TILL_ID = data.data.Table[0].TILL_ID;
                //$scope.$parent.CASHUP.SESSION_ID = data.data.Table[0].SESSION_ID;
                //$scope.$parent.CASHUP.SESSION = data.data.Table[0];
                $scope.$parent.CASHUP.SESSION.CASHUP_HEADER_ID = data.data.Table[0].ID;
                $scope.$parent.CASHUP.TYPE = data.data.Table[0].CASHUP_TYPE;
                 
                $scope.$parent.CASHUP.CASHUP_DATE = data.data.Table[0].CASHUP_DATE; //$scope.$parent.CASHUP.CASHUP_DATE;// data.data.Table[0].CASHUP_DATE;
                $scope.$parent.CASHUP.STEP_NO = angular.copy(data.data.Table[0].STEP_NO);
                $scope.$parent.CASHUP.ACTUAL_STEP_NO = data.data.Table[0].STEP_NO;
                //$scope.$parent.CASHUP.TOTAL_FLOAT = data.data.Table[0].FLOAT_TOTAL;
                //$scope.$parent.CASHUP.TOTAL_CASH = data.data.Table[0].CASH_TOTAL;
                 
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
                $scope.$parent.CASHUP.CASH_TIPS = (data.data.Table[0].CASH_TIPS != null && data.data.Table[0].CASH_TIPS != 0) ? parseFloat(data.data.Table[0].CASH_TIPS).toFixed(2) : null;

                $scope.$parent.CASHUP.ORIGINAL_FILE_NAME = data.data.Table[0].ORIGINAL_FILE_NAME;
                $scope.$parent.CASHUP.UPL_ID = data.data.Table[0].UPL_ID;
                $scope.$parent.CASHUP.INTEGRATION_SYSTEM_ID = data.data.Table[0].INTEGRATION_SYSTEM_ID;
                // $scope.$parent.CASHUP.INTEGRATION_SYSTEM_ID = 12;
                //  $scope.$parent.CASHUP.INTEGRATION_SYSTEM_ID = 0;

                $scope.$parent.CASHUP.INTEGRATION_URL = data.data.Table[0].URL_PATH;
                $scope.$parent.CASHUP.ACCESS_TOKEN = data.data.Table[0].API_KEY;
                $scope.$parent.CASHUP.ACC_CUSTOMER_RED_LIST = [];

                //   $scope.GOTOSTEP($scope.$parent.CASHUP.STEP_NO+1);
                // window.location.href = '../Cashup/CashupIndex#!/Float?CMID=' + $scope.$parent.CashUp_Main_ID;

                $scope.GET_CASHUP_CATEGORY_BIFURCATION();
               // $scope.GET_EPOS_HEADER();
                $scope.GET_EPOS_DATA();


                $scope.$parent.CASHUP.REV_NOTES_ID = 0;
                $scope.$parent.CASHUP.REV_NOTES = "";

                //for (var i = 0; i < data.data.Table1.length; i++) {
                //    if (data.data.Table1[i].NOTE_TYPE_ID == 1) {
                //        $scope.$parent.CASHUP.REV_NOTES_ID = data.data.Table1[i].ID != 0 ? data.data.Table1[i].ID : 0;
                //        $scope.$parent.CASHUP.REV_NOTES = data.data.Table1[i].NOTE;
                //    }
                //    else if (data.data.Table1[i].NOTE_TYPE_ID == 2) {
                //        $scope.$parent.CASHUP.CASH_NOTES_ID = data.data.Table1[i].ID != 0 ? data.data.Table1[i].ID : 0;
                //        $scope.$parent.CASHUP.CASH_NOTES = data.data.Table1[i].NOTE;
                //    }
                //    else if (data.data.Table1[i].NOTE_TYPE_ID == 3) {
                //        $scope.$parent.CASHUP.CARD_NOTES_ID = data.data.Table1[i].ID != 0 ? data.data.Table1[i].ID : 0;
                //        $scope.$parent.CASHUP.CARD_NOTES = data.data.Table1[i].NOTE;
                //    }
                //    else if (data.data.Table1[i].NOTE_TYPE_ID == 4) {
                //        $scope.$parent.CASHUP.PCASH_NOTES_ID = data.data.Table1[i].ID != 0 ? data.data.Table1[i].ID : 0;
                //        $scope.$parent.CASHUP.PCASH_NOTES = data.data.Table1[i].NOTE;
                //    }
                //    else if (data.data.Table1[i].NOTE_TYPE_ID == 5) {
                //        $scope.$parent.CASHUP.COMP_NOTES_ID = data.data.Table1[i].ID != 0 ? data.data.Table1[i].ID : 0;
                //        $scope.$parent.CASHUP.COMP_NOTES = data.data.Table1[i].NOTE;
                //    }
                //    else if (data.data.Table1[i].NOTE_TYPE_ID == 6) {
                //        if ($scope.$parent.CASHUP.CashUp_Main_STATUS_ID == 4 || $scope.$parent.CASHUP.CashUp_Main_STATUS_ID == 5) {
                //            $scope.$parent.CASHUP.REV_NOTES_ID = data.data.Table1[i].ID != 0 ? data.data.Table1[i].ID : 0;
                //            $scope.$parent.CASHUP.REV_NOTES = $scope.$parent.CASHUP.AreaList[0].REJECTION_COMMENTS;

                //        } else {
                //            $scope.$parent.CASHUP.REV_NOTES_ID = data.data.Table1[i].ID != 0 ? data.data.Table1[i].ID : 0;
                //            $scope.$parent.CASHUP.REV_NOTES = data.data.Table1[i].NOTE;

                //        }
                //    }
                //}
                $scope.$parent.CASHUP.STEP_NO = 10;
                $scope.$parent.CASHUP.ACTUAL_STEP_NO = 10;
                //if ($scope.$parent.CASHUP.FG == "VIEW") {
                //    $scope.$parent.CASHUP.STEP_NO = 1;
                //    $scope.$parent.CASHUP.ACTUAL_STEP_NO = 1;
                //}
                $scope.GET_ACC_CUST_DECLARATION(1);
            }
            //else {
            //    $scope.CASHUP_RESET();
            //}
             
            $scope.$parent.overlay_loadingNew = 'none';
        });
    };
    $scope.GET_MASTERDATA_FOR_CASHUP = function () {
         
        var CashupModelObj = new Object();
        CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CashupModelObj.CURRENCY_ID = parseInt($cookies.get("CURRENCY_ID"));
        CashupModelObj.ID = $scope.$parent.CASHUP.ID;///PI_CASHUP_HEADER_ID;
        CashupModelObj.CASHUP_MAIN_ID = $scope.$parent.CASHUP.CASHUP_MAIN_ID;
        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_MASTERDATA_FOR_CASHUP').then(function (data) {
            $scope.BranchList = data.data.Table;
            $scope.$parent.CASHUP.AreaList = data.data.Table1;
            if ($scope.$parent.CASHUP.AreaList.length == 1) {
                $scope.$parent.CASHUP.AREA_ID = $scope.$parent.CASHUP.AreaList[0].ID;
                $scope.$parent.CASHUP.CashUp_Main_STATUS_ID = $scope.$parent.CASHUP.AreaList[0].STATUS != null ? $scope.$parent.CASHUP.AreaList[0].STATUS : 0;
            }
            if ($scope.$parent.CASHUP.CashUp_Main_STATUS_ID == 4 || $scope.$parent.CASHUP.CashUp_Main_STATUS_ID == 5) {
                $scope.$parent.CASHUP.REV_NOTES = $scope.$parent.CASHUP.AreaList[0].REJECTION_COMMENTS != null ? $scope.$parent.CASHUP.AreaList[0].REJECTION_COMMENTS : null;
            }
            $scope.TillList = data.data.Table2;

            var SessionChk_ID = 0; $scope.SessionList = [];
            angular.forEach(data.data.Table3, function (Sess_Chk) {
                if (Sess_Chk.SESSION_MAPPING_ID != SessionChk_ID) {
                    $scope.SessionList.push(Sess_Chk);
                }
                SessionChk_ID = Sess_Chk.SESSION_MAPPING_ID;
            })
           // $scope.SessionList = data.data.Table3;
            //$filter('orderBy')($scope.SessionList, 'SESSION_MAPPING_ID');


            for (var i = 0; i < $scope.$parent.CASHUP.AreaList.length; i++) {
                for (var j = 0; j < $scope.BranchList.length; j++) {
                    if ($scope.$parent.CASHUP.AreaList[i].BRANCH_ID == $scope.BranchList[j].ID) {
                        $scope.$parent.CASHUP.BRANCH_ID = $scope.BranchList[j].ID;
                        $scope.$parent.CASHUP.BRANCH_NAME = $scope.BranchList[j].NAME;
                        $scope.$parent.CASHUP.BRANCH_CODE = $scope.BranchList[j].CODE;
                        break;
                    }
                }
            }
             
            $scope.$parent.CASHUP.CASHUP_DATE = $scope.$parent.CASHUP.CASHUP_DATE;// $scope.SessionList[0].CASHUP_DATE;

            angular.forEach($scope.SessionList, function (sessn) {
                if (sessn.STATUS_ID == 2 && sessn.SESSION_MASTER_ID == '4') {
                    $scope.$parent.CASHUP.COMPLETED_GROUP_ID = sessn.GROUP_ID;

                }
                //else if (sessn.STATUS_ID == 0 && sessn.SESSION_MASTER_ID == '4' && parseInt($cookies.get("ENTITY_ID"))==62 && ($scope.$parent.CASHUP.CashUp_Main_STATUS_ID == 3 || $scope.$parent.CASHUP.CashUp_Main_STATUS_ID == 4)) {
                //    $scope.$parent.CASHUP.COMPLETED_GROUP_ID = sessn.GROUP_ID;
                //    sessn.STATUS_ID = 2;
                //    sessn.STEP_NO = 10;
                //}
            });
            $scope.SessionList.filter(function (x) {
                x.RDO_FLAG = false;
            });
            //$scope.$parent.CASHUP.SessionListData = $scope.SessionList;//data.data.Table3;
            $scope.$parent.CASHUP.DECLERATION_MASTER = data.data.Table4;
            $scope.$parent.CASHUP.TABLIST = data.data.Table6;
            $scope.$parent.CASHUP.IS_TILL_BASED = data.data.Table5[0].IS_TILL_BASED;
            $scope.$parent.CASHUP.IS_SESSION_BASED = data.data.Table5[0].IS_SESSION_BASED;
            $scope.$parent.CASHUP.IS_TILL_BASED ? $scope.$parent.CASHUP.TYPE = 1 : '';
            $scope.$parent.CASHUP.IS_SESSION_BASED ? $scope.$parent.CASHUP.TYPE = 2 : '';
            $scope.$parent.CASHUP.IS_TILL_BASED && $scope.$parent.CASHUP.IS_SESSION_BASED ? $scope.$parent.CASHUP.TYPE = null : '';
            // $scope.DateSetUp();
            //$scope.SessionListFilter = null;
            if ($scope.$parent.CASHUP.CashUp_Main_STATUS_ID == 3 || $scope.$parent.CASHUP.CashUp_Main_STATUS_ID == 4) {

                if ($scope.$parent.CASHUP.SESSION != null) {

                    angular.forEach($scope.SessionList, function (sess) {
                        if ($scope.$parent.CASHUP.SESSION.SESSION_MAPPING_ID == sess.SESSION_MAPPING_ID) {
                            sess.SELECTED = true;
                            // sess.GROUP_ID = 1;
                            $scope.$parent.CASHUP.SESSION = sess;
                            $scope.InsertCashUpHeader_12();
                            $scope.$parent.CASHUP.SESSION.SESSION_ID = sess.SESSION_MAPPING_ID;
                             
                            $scope.GET_CASHUP_BY_ID();
                            $scope.$parent.CASHUP.COMP_NOTES = null;
                            $scope.$parent.CASHUP.REV_NOTES = null;
                            $scope.$parent.CASHUP.REV_NOTES = null;
                            $scope.$parent.CASHUP.CASH_NOTES = null;
                            $scope.$parent.CASHUP.CARD_NOTES = null;
                            $scope.$parent.CASHUP.PCASH_NOTES = null;
                            //$scope.$parent.CASHUP.INDEX = index;
                            if (sess.SESSION_MASTER_ID == '4' && sess.STATUS_ID == '2') {
                                sess.GROUP_ID = 1;
                            }
                        } else {
                            sess.SELECTED = false;
                            // sess.GROUP_ID = 0;
                        }
                    });
                } else {
                    $scope.SessionListFilter = null;
                    if ($scope.$parent.CASHUP.COMPLETED_GROUP_ID != null) {
                        $scope.SessionListFilter = $filter('filter')($scope.SessionList, { GROUP_ID: $scope.$parent.CASHUP.COMPLETED_GROUP_ID }, true);
                    } else {
                        $scope.SessionListFilter = $filter('filter')($scope.SessionList, { GROUP_ID: 0 }, true);
                    }

                    if ($scope.SessionListFilter != null) {
                        angular.forEach($scope.SessionList, function (sess) {
                            if ($scope.SessionListFilter[0].GROUP_ID == sess.GROUP_ID) {
                                sess.SELECTED = true;
                                $scope.$parent.CASHUP.SESSION = sess;
                                // $scope.SELECT_SESSION_Init(sess, 0);
                                //$scope.InsertCashUpHeader_12();
                                $scope.$parent.CASHUP.SESSION_ID = sess.SESSION_MAPPING_ID;
                                $scope.GET_CASHUP_BY_ID();
                            } else {
                                sess.SELECTED = false;
                                sess.GROUP_ID = 0;
                            }
                        });
                    }
                }
                $scope.$parent.CASHUP.INDEX = 0;
                angular.forEach($scope.SessionList, function (sess) {
                    if (sess.STATUS_ID == '2') {
                        sess.RDO_FLAG = false;
                    } else if (sess.STATUS_ID == '1' || sess.STATUS_ID == '0') {
                        sess.RDO_FLAG = true;
                    }
                })

            } else {

                if ($scope.$parent.CASHUP.SESSION != null) {
                    angular.forEach($scope.SessionList, function (sess, index) {
                        if ($scope.$parent.CASHUP.SESSION.SESSION_MAPPING_ID == sess.SESSION_MAPPING_ID) {
                            sess.SELECTED = true;
                            // sess.GROUP_ID = 1;
                            $scope.$parent.CASHUP.SESSION = sess;
                            $scope.InsertCashUpHeader_12();
                            $scope.$parent.CASHUP.SESSION.SESSION_ID = sess.SESSION_MAPPING_ID;
                            $scope.GET_CASHUP_BY_ID();
                            $scope.$parent.CASHUP.COMP_NOTES = null;
                            $scope.$parent.CASHUP.REV_NOTES = null;
                            $scope.$parent.CASHUP.REV_NOTES = null;
                            $scope.$parent.CASHUP.CASH_NOTES = null;
                            $scope.$parent.CASHUP.CARD_NOTES = null;
                            $scope.$parent.CASHUP.PCASH_NOTES = null;
                            $scope.$parent.CASHUP.INDEX = index;
                            if (sess.SESSION_MASTER_ID == '4' && sess.STATUS_ID == '2') {
                                sess.GROUP_ID = 1;
                            }
                            //sess.RDO_FLAG = false;

                        }
                        else {
                            sess.SELECTED = false;
                            // sess.GROUP_ID = 0;
                            //sess.RDO_FLAG = true;
                        }
                    });
                    //angular.forEach($scope.SessionList, function (sess) {
                    //    if (sess.GROUP_ID == 0 && $scope.$parent.CASHUP.COMPLETED_GROUP_ID == null) {
                    //        sess.RDO_FLAG = true;
                    //    } else if (sess.GROUP_ID == 1 && $scope.$parent.CASHUP.COMPLETED_GROUP_ID == 1) {
                    //        sess.RDO_FLAG = true;
                    //    }
                    //})
                    var FlagValid = false;
                    $scope.SessionList.filter(function (x) {
                        if (x.STATUS_ID == '2') {
                            FlagValid = true;
                        }
                    });
                    if (FlagValid) {
                        $scope.SessionListFilter1 = null;
                        if ($scope.$parent.CASHUP.COMPLETED_GROUP_ID == null) {
                            $scope.SessionListFilter1 = $filter('filter')($scope.SessionList, { GROUP_ID: 0 }, true);

                            angular.forEach($scope.SessionList, function (SL) {
                                angular.forEach($scope.SessionListFilter1, function (SF) {
                                    if (SF.GROUP_ID != SL.GROUP_ID) {
                                        SL.RDO_FLAG = true;
                                    }
                                })
                            })
                        }
                    }

                }
                else {
                    var Flag1 = false;
                    $scope.SessionList.filter(function (x) {
                        if (x.STATUS_ID == '2') {
                            Flag1 = true;
                        }
                    });
                    if (Flag1) {
                        $scope.SessionListFilter2 = null;
                        if ($scope.$parent.CASHUP.COMPLETED_GROUP_ID == null) {
                            $scope.SessionListFilter2 = $filter('filter')($scope.SessionList, { GROUP_ID: 0 }, true);

                            angular.forEach($scope.SessionList, function (SL) {
                                angular.forEach($scope.SessionListFilter2, function (SF) {
                                    if (SF.GROUP_ID != SL.GROUP_ID) {
                                        SL.RDO_FLAG = true;
                                    }
                                })
                            })
                        }
                    }

                }
            }
            $scope.$parent.CASHUP.SessionListData = $scope.SessionList;//data.data.Table3;
            $scope.$parent.CASHUP.COMP_REASONS = data.data.Table7;
        });
    };

    //$scope.GET_CASHUP_CATEGORY_BIFURCATION = function () {

    //    var CashupModelObj = new Object();
    //    CashupModelObj.ID = $scope.$parent.CASHUP.ID;
    //    PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_CASHUP_CATEGORY_BIFURCATION').then(function (data) {
    //        $scope.$parent.CASHUP.EPOS_CAT_DATA = [];
    //        $scope.$parent.CASHUP.EPOS_DATA = [];

    //        if (data != undefined && data.data != undefined) {
    //            $scope.$parent.CASHUP.EPOS_CAT_DATA = data.data.Table1;
    //            $scope.$parent.CASHUP.EPOS_DATA = data.data.Table2;
    //            $scope.$parent.CASHUP.MEDIA_DATA = data.data.Table5;
    //            $scope.$parent.CASHUP.EPOS_TOTAL = 0;

    //            //if ($scope.KeyFlag) {
    //            //    if ($scope.$parent.CASHUP.FG == "VIEW") {
    //            //        $location.path("Reviews_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
    //            //    } else if ($scope.$parent.CASHUP.FG == null) {
    //            //        $location.path("Reviews").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
    //            //    }
    //            //}
    //        }

    //    });
    //};
    $scope.UPD_CASHUP_HEADER_SUBMIT = function () {
        if (confirm('Are you sure you want to Submit?')) {
            //$scope.SelectedGroup = [{ GROUP_ID: $scope.$parent.CASHUP.SESSION.GROUP_ID, CASHUP_HEADER_ID: $scope.$parent.CASHUP.ID, STATUS_ID: $scope.$parent.CASHUP.SESSION.STATUS_ID }];
            //var selected_count = $scope.SelectedGroup.length;
            //var count = 0;
            //angular.forEach($scope.SelectedGroup, function (sessn) {
            //    if (sessn.CASHUP_HEADER_ID != $scope.$parent.CASHUP.ID && sessn.STATUS_ID == 2) {
            //        count++;
            //    }
            //});
            var Flag = false;
            var Status = true;
            for (var i = 0; i < $scope.$parent.CASHUP.SessionListData.length; i++) {
                if ($scope.$parent.CASHUP.SessionListData[i].SESSION_MASTER_ID == '4' && $scope.$parent.CASHUP.SessionListData[i].SELECTED == true) {
                    Flag = true;
                    break;
                } else if ($scope.$parent.CASHUP.SessionListData[i].SESSION_MASTER_ID != '4') {
                    if (($scope.$parent.CASHUP.SessionListData[i].SESSION_MASTER_ID == '2' || $scope.$parent.CASHUP.SessionListData[i].SESSION_MASTER_ID == '1' || $scope.$parent.CASHUP.SessionListData[i].SESSION_MASTER_ID == '3') && $scope.$parent.CASHUP.SessionListData[i].SELECTED == false) {
                        if ($scope.$parent.CASHUP.SessionListData[i].STATUS_ID == '1' || $scope.$parent.CASHUP.SessionListData[i].STATUS_ID == '0') {
                            Status = false;
                        }
                    }
                }
            }
            if (Status) {
                Flag = true;
            }

            var CashupModelObj = new Object();
            CashupModelObj.CASHUP_HEADER_ID = $scope.$parent.CASHUP.ID;
            CashupModelObj.CASHUP_MAIN_ID = $scope.$parent.CASHUP.CASHUP_MAIN_ID;
            CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
            CashupModelObj.REMOVE_FLAG = Flag == true ? 1 : 0;
            //CashupModelObj.REMOVE_FLAG = (count == selected_count - 1) ? 1 : 0;
            PrcCommMethods.CASHUP_API(CashupModelObj, 'UPD_CASHUP_HEADER_SUBMIT').then(function (data) {

                //  $scope.UPD_CASHUP_HEADER_NOTES();
                $scope.$parent.CASHUP.TABLIST = null;
                $scope.$parent.CASHUP.ACTUAL_STEP_NO = 0;
                $scope.$parent.CASHUP.STEP_NO = 0;
                window.location.href = '../Cashup#!/CLN';
                //if (Flag) {
                //    $scope.$parent.CASHUP.TABLIST = null;
                //    $scope.$parent.CASHUP.ACTUAL_STEP_NO = 0;
                //    $scope.$parent.CASHUP.STEP_NO = 0;
                //    window.location.href = '../Cashup#!/CLN';
                //} else {
                //    alert("All session will be completely submit.");               
                //}

                //if (count == selected_count - 1) {
                //    $scope.$parent.CASHUP.TABLIST = null;
                //    $scope.$parent.CASHUP.ACTUAL_STEP_NO = 0;
                //    $scope.$parent.CASHUP.STEP_NO = 0;
                //    window.location.href = '../Cashup#!/CLN';
                //}
                //else {
                //    $scope.$parent.CASHUP.SESSION.STATUS_ID = 2;
                //    $scope.$parent.CASHUP.COMPLETED_GROUP_ID = $scope.$parent.CASHUP.SESSION.GROUP_ID;
                //    $scope.$parent.CASHUP.STEP_NO = 0;
                //    $scope.$parent.CASHUP.SESSION.STEP_NO = 10;
                //}

            });
        }

    };
    $scope.APP_CASHUP = function (STATUS_ID) {
        if (confirm('Are you sure you want to Approve?')) {
            var CashupModelObj = new Object();
            CashupModelObj.CASHUP_MAIN_ID = $scope.$parent.CASHUP.CASHUP_MAIN_ID;
            CashupModelObj.STATUS_ID = 4;
            CashupModelObj.NOTE = $scope.$parent.CASHUP.REV_NOTES;
            CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.CASHUP_API(CashupModelObj, 'APP_REJ_CASHUP').then(function (data) {
                window.location.href = '../Cashup#!/CALN';

            });
        }

    };
    $scope.REJ_CASHUP = function () {
        if (confirm('Are you sure you want to Return?')) {
            var CashupModelObj = new Object();
            CashupModelObj.CASHUP_MAIN_ID = $scope.$parent.CASHUP.CASHUP_MAIN_ID;
            CashupModelObj.STATUS_ID = 5;
            CashupModelObj.NOTE = $scope.$parent.CASHUP.REV_NOTES;
            PrcCommMethods.CASHUP_API(CashupModelObj, 'APP_REJ_CASHUP').then(function (data) {
                window.location.href = '../Cashup#!/CALN';
            });
        }

    };
    $scope.PreviousLink_View = function () {
        if ($scope.$parent.CASHUP.TABLIST[9].FLAG == 1) {
            $location.path("Complimentary_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
        } else if ($scope.$parent.CASHUP.TABLIST[8].FLAG == 1) {
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

    }
    //======================CASHUP Date picker============================
    $scope.OPEN_DATEPICKER = function () {
        $scope.EDIT_START_DATE = null;
        $scope.SELECTED_CMID = null;
        $scope.SELECTED_HID = null;
        $scope.SELECTED_SESSION = null;
        $scope.SELECTED_SESSION_ID = null;
        $scope.EDITDATE_FLAG = true;
        $('#CASHUP_EDIT').modal('show');
    }
    //$scope.ReportSearch = {
    //    REPORT_START_DATE: null,
    //    REPORT_END_DATE: null,
    //};
    $scope.EDIT_START_DATE = null;
    function reportrange(start, end) {
        $scope.EDIT_START_DATE = start.format($scope.$parent.Datelocaleformat.format);
        //$scope.ReportSearch.END_DATE = end.format($scope.$parent.Datelocaleformat.format);
        $('#reportrange span').html(start.format($scope.$parent.Datelocaleformat.format) + ' - ' + end.format($scope.$parent.Datelocaleformat.format));
    };
    $scope.RESET_DATE_PICKER = function () {
        $(function () {
            start = moment().startOf('month');//moment().startOf('isoWeek');//moment().subtract(6, 'days');
            end = moment().endOf('month');;//moment().subtract(0, 'days');
            //"startDate": moment().startOf('isoWeek'),
            //"endDate": moment(),
            $scope.$parent.SetUpDateRangeMultiDatePicker('reportrange', start, end, reportrange);
            $('#reportrange span').html(start.format($scope.$parent.Datelocaleformat.format) + ' - ' + end.format($scope.$parent.Datelocaleformat.format));
        });
    }
    $scope.RESET_DATE_PICKER();
    $scope.dateinputOpenDate = function () {
         
        $(document).ready(function () {
            var date_inputs = document.getElementsByClassName("dateinputOpenDate") //our date input has the name "date"
            if (date_inputs.length > 0) {
                for (var i = 0; i < date_inputs.length; i++) {
                    var date_input = $('input[name="' + date_inputs[i].name + '"]'); //our date input has the name "date"
                    var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
                    // var date = new Date();
                    var options = {
                        todayBtn: "linked",
                        daysOfWeekHighlighted: "0,6",
                        autoclose: true,
                        todayHighlight: true,
                        format: 'M dd, yyyy',
                        clearBtn: true,
                        closeBtn: true,// close button visible
                        //  startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate())
                    };
                    date_input.datepicker(options);
                }
            }
        });
    };

    $scope.REDIRECT_TO_SELECTED_DATE = function () {
         
        //if ($scope.EDIT_START_DATE != null && $scope.SELECTED_SESSION_ID != null) {
        if ($scope.EDIT_START_DATE != null && $scope.EDIT_START_DATE != "" ) {
           // $scope.GET_MASTERDATA_FOR_CASHUP();
            var CashupModelObj = new Object();
            CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
            CashupModelObj.CASHUP_DATE_START = new Date($scope.EDIT_START_DATE).toDateString();// $scope.CashupEdit.START_DATE == undefined ? moment().startOf('month').format($scope.$parent.Datelocaleformat.format) : new Date($scope.CashupEdit.START_DATE);
            CashupModelObj.CASHUP_DATE_END = new Date($scope.EDIT_START_DATE).toDateString();//$scope.CashupEdit.START_DATE == undefined ? moment().endOf('month').format($scope.$parent.Datelocaleformat.format) : new Date($scope.CashupEdit.START_DATE);
            CashupModelObj.STATUS_IDS = '';
            CashupModelObj.BRANCH_IDS = $scope.CASHUP.BRANCH_ID;
            CashupModelObj.PAGE_NO = 1;
            CashupModelObj.PAGE_SIZE = 10;
            PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_CASHUP_LIST').then(function (data) {
                 
                if (data.data.Table.length > 0) {
                    $scope.SELECTED_CMID = data.data.Table[0].ID;      
                    $scope.$parent.CASHUP.ID = 0;
                    $scope.$parent.CASHUP.CASHUP_MAIN_ID = $scope.SELECTED_CMID;
                    $scope.GET_MASTERDATA_FOR_CASHUP_EDITDATE();
                    //$('#CASHUP_EDIT').modal('hide');
                    //$scope.REFRESH_TO_EDIT_DATE();
                }
                else {
                    //Cashup for this date does not exists.
                    $scope.$parent.ShowAlert("Attention", "Cashup for this date doesn't exists.", 3000);  
                }

            });
        }
        //else {
        //    $scope.ShowAlert('Error', 'Date and Session properly selected.', 3000);
        //}
    };
    $scope.REFRESH_TO_EDIT_DATE = function () {
        if ($scope.EDIT_START_DATE != null && $scope.SELECTED_SESSION_ID != null) { 
            $('#CASHUP_EDIT').modal('hide');
        var CashupModelObj = new Object();
        CashupModelObj.CASHUP_MAIN_ID = $scope.SELECTED_CMID;
        CashupModelObj.SESSION_ID = $scope.SELECTED_SESSION_ID;
        CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_CASHUP_BY_ID').then(function (data) {
            if (data != undefined && data.data != undefined && data.data.Table.length > 0) {
                $scope.SELECTED_HID = data.data.Table[0].ID;
                $scope.$parent.CASHUP.CASHUP_DATE = data.data.Table[0].CASHUP_DATE;
                debugger;
                $scope.$parent.CASHUP.ID = $scope.SELECTED_HID;
                $scope.$parent.CASHUP.CASHUP_MAIN_ID = $scope.SELECTED_CMID;
                $scope.$parent.CASHUP.SESSION = $scope.SELECTED_SESSION;
                $scope.$parent.CASHUP.SESSION_ID = $scope.SELECTED_SESSION_ID;
                //$location.path('Reviews').search({ CHID: $scope.SELECTED_HID, CMID: $scope.SELECTED_CMID });//.search({ CMID: $scope.SELECTED_CMID })
                var url = window.location.href.split('/')[5];
                var temp = url.split('?')[0];
                if (temp == "Reviews") {
                    $location.path('Reviews').search({ CHID: $scope.SELECTED_HID, CMID: $scope.SELECTED_CMID });//.search({ CMID: $scope.SELECTED_CMID });
                } else if (temp =="Reviews_View"){
                    $location.path('Reviews_View').search({ CHID: $scope.SELECTED_HID, CMID: $scope.SELECTED_CMID });//.search({ CMID: $scope.SELECTED_CMID });
                    
                }
                $scope.CANCEL_MODAL();


                //window.location.href = '../Cashup/CashupIndex#!/Reviews?CHID=' + $scope.SELECTED_HID + '&CMID=' + $scope.SELECTED_CMID;  //CHID=18528&CMID=136366           


                //if ($scope.$parent.CASHUP.CashUp_Main_STATUS_ID != 3) {
                //    $scope.$parent.CASHUP.SESSION = $scope.SELECTED_SESSION;
                //    $scope.$parent.CASHUP.SESSION_ID = $scope.SELECTED_SESSION_ID;
                //}


            }
        });
        } else {
            if ($scope.EDIT_START_DATE == null && $scope.SELECTED_SESSION == null) {
                $scope.ShowAlert('Error', 'Please select a date and session.', 3000);
            }else if ($scope.EDIT_START_DATE == null) {
                $scope.ShowAlert('Error', 'Please, select date.', 3000);
            } else if ($scope.SELECTED_SESSION_ID == null) {
                $scope.ShowAlert('Error', 'Please, select session.', 3000);
            } 
          // $scope.ShowAlert('Error', 'Please, All data properly filled.', 3000);
        }
    }
    $scope.CANCEL_MODAL = function () {
        $scope.EDIT_START_DATE = null;
        $scope.SELECTED_CMID = null;
        $scope.SELECTED_HID = null;
        $scope.SELECTED_SESSION = null;
        $scope.SELECTED_SESSION_ID = null;

        $('#CASHUP_EDIT').modal('hide');
    }
    $scope.GET_MASTERDATA_FOR_CASHUP_EDITDATE = function () {

        var CashupModelObj = new Object();
        CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CashupModelObj.CURRENCY_ID = parseInt($cookies.get("CURRENCY_ID"));
        CashupModelObj.ID = $scope.$parent.CASHUP.ID;///PI_CASHUP_HEADER_ID;
        CashupModelObj.CASHUP_MAIN_ID = $scope.$parent.CASHUP.CASHUP_MAIN_ID;
        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_MASTERDATA_FOR_CASHUP').then(function (data) {
            $scope.BranchList = data.data.Table;
            $scope.$parent.CASHUP.AreaList = data.data.Table1;
            if ($scope.$parent.CASHUP.AreaList.length == 1) {
                $scope.$parent.CASHUP.AREA_ID = $scope.$parent.CASHUP.AreaList[0].ID;
                $scope.$parent.CASHUP.CashUp_Main_STATUS_ID = $scope.$parent.CASHUP.AreaList[0].STATUS != null ? $scope.$parent.CASHUP.AreaList[0].STATUS : 0;
            }
            if ($scope.$parent.CASHUP.CashUp_Main_STATUS_ID == 4 || $scope.$parent.CASHUP.CashUp_Main_STATUS_ID == 5) {
                $scope.$parent.CASHUP.REV_NOTES = $scope.$parent.CASHUP.AreaList[0].REJECTION_COMMENTS != null ? $scope.$parent.CASHUP.AreaList[0].REJECTION_COMMENTS : null;
            }
            $scope.TillList = data.data.Table2;

            var SessionChk_ID = 0; $scope.SessionList = [];
            angular.forEach(data.data.Table3, function (Sess_Chk) {
                if (Sess_Chk.SESSION_MAPPING_ID != SessionChk_ID) {
                    $scope.SessionList.push(Sess_Chk);
                }
                SessionChk_ID = Sess_Chk.SESSION_MAPPING_ID;
            })
            // $scope.SessionList = data.data.Table3;
            //$filter('orderBy')($scope.SessionList, 'SESSION_MAPPING_ID');


            for (var i = 0; i < $scope.$parent.CASHUP.AreaList.length; i++) {
                for (var j = 0; j < $scope.BranchList.length; j++) {
                    if ($scope.$parent.CASHUP.AreaList[i].BRANCH_ID == $scope.BranchList[j].ID) {
                        $scope.$parent.CASHUP.BRANCH_ID = $scope.BranchList[j].ID;
                        $scope.$parent.CASHUP.BRANCH_NAME = $scope.BranchList[j].NAME;
                        $scope.$parent.CASHUP.BRANCH_CODE = $scope.BranchList[j].CODE;
                        break;
                    }
                }
            }

          //  $scope.$parent.CASHUP.CASHUP_DATE = $scope.$parent.CASHUP.CASHUP_DATE;// $scope.SessionList[0].CASHUP_DATE;

            angular.forEach($scope.SessionList, function (sessn) {
                if (sessn.STATUS_ID == 2 && sessn.SESSION_MASTER_ID == '4') {
                    $scope.$parent.CASHUP.COMPLETED_GROUP_ID = sessn.GROUP_ID;

                }
                //else if (sessn.STATUS_ID == 0 && sessn.SESSION_MASTER_ID == '4' && parseInt($cookies.get("ENTITY_ID"))==62 && ($scope.$parent.CASHUP.CashUp_Main_STATUS_ID == 3 || $scope.$parent.CASHUP.CashUp_Main_STATUS_ID == 4)) {
                //    $scope.$parent.CASHUP.COMPLETED_GROUP_ID = sessn.GROUP_ID;
                //    sessn.STATUS_ID = 2;
                //    sessn.STEP_NO = 10;
                //}
            });
            $scope.SessionList.filter(function (x) {
                x.RDO_FLAG = false;
            });
            //$scope.$parent.CASHUP.SessionListData = $scope.SessionList;//data.data.Table3;
            $scope.$parent.CASHUP.DECLERATION_MASTER = data.data.Table4;
            $scope.$parent.CASHUP.TABLIST = data.data.Table6;
            $scope.$parent.CASHUP.IS_TILL_BASED = data.data.Table5[0].IS_TILL_BASED;
            $scope.$parent.CASHUP.IS_SESSION_BASED = data.data.Table5[0].IS_SESSION_BASED;
            $scope.$parent.CASHUP.IS_TILL_BASED ? $scope.$parent.CASHUP.TYPE = 1 : '';
            $scope.$parent.CASHUP.IS_SESSION_BASED ? $scope.$parent.CASHUP.TYPE = 2 : '';
            $scope.$parent.CASHUP.IS_TILL_BASED && $scope.$parent.CASHUP.IS_SESSION_BASED ? $scope.$parent.CASHUP.TYPE = null : '';
            // $scope.DateSetUp();
            //$scope.SessionListFilter = null;
            if ($scope.$parent.CASHUP.CashUp_Main_STATUS_ID == 3 || $scope.$parent.CASHUP.CashUp_Main_STATUS_ID == 4) {

                if ($scope.$parent.CASHUP.SESSION != null) {

                    angular.forEach($scope.SessionList, function (sess) {
                        if ($scope.$parent.CASHUP.SESSION.SESSION_MAPPING_ID == sess.SESSION_MAPPING_ID) {
                            sess.SELECTED = true;
                            // sess.GROUP_ID = 1;
                            $scope.$parent.CASHUP.SESSION = sess;
                           // $scope.InsertCashUpHeader_12();
                            $scope.$parent.CASHUP.SESSION.SESSION_ID = sess.SESSION_MAPPING_ID;

                            //$scope.GET_CASHUP_BY_ID();
                            $scope.$parent.CASHUP.COMP_NOTES = null;
                            $scope.$parent.CASHUP.REV_NOTES = null;
                            $scope.$parent.CASHUP.REV_NOTES = null;
                            $scope.$parent.CASHUP.CASH_NOTES = null;
                            $scope.$parent.CASHUP.CARD_NOTES = null;
                            $scope.$parent.CASHUP.PCASH_NOTES = null;
                            //$scope.$parent.CASHUP.INDEX = index;
                            if (sess.SESSION_MASTER_ID == '4' && sess.STATUS_ID == '2') {
                                sess.GROUP_ID = 1;
                            }
                        } else {
                            sess.SELECTED = false;
                            // sess.GROUP_ID = 0;
                        }
                    });
                } else {
                    $scope.SessionListFilter = null;
                    if ($scope.$parent.CASHUP.COMPLETED_GROUP_ID != null) {
                        $scope.SessionListFilter = $filter('filter')($scope.SessionList, { GROUP_ID: $scope.$parent.CASHUP.COMPLETED_GROUP_ID }, true);
                    } else {
                        $scope.SessionListFilter = $filter('filter')($scope.SessionList, { GROUP_ID: 0 }, true);
                    }

                    if ($scope.SessionListFilter != null) {
                        angular.forEach($scope.SessionList, function (sess) {
                            if ($scope.SessionListFilter[0].GROUP_ID == sess.GROUP_ID) {
                                sess.SELECTED = true;
                                $scope.$parent.CASHUP.SESSION = sess;
                                // $scope.SELECT_SESSION_Init(sess, 0);
                                //$scope.InsertCashUpHeader_12();
                                $scope.$parent.CASHUP.SESSION_ID = sess.SESSION_MAPPING_ID;
                               // $scope.GET_CASHUP_BY_ID();
                            } else {
                                sess.SELECTED = false;
                                sess.GROUP_ID = 0;
                            }
                        });
                    }
                }
                $scope.$parent.CASHUP.INDEX = 0;
                angular.forEach($scope.SessionList, function (sess) {
                    if (sess.STATUS_ID == '2') {
                        sess.RDO_FLAG = false;
                    } else if (sess.STATUS_ID == '1' || sess.STATUS_ID == '0') {
                        sess.RDO_FLAG = true;
                    }
                })

            } else {

                if ($scope.$parent.CASHUP.SESSION != null) {
                    angular.forEach($scope.SessionList, function (sess, index) {
                        if ($scope.$parent.CASHUP.SESSION.SESSION_MAPPING_ID == sess.SESSION_MAPPING_ID) {
                            sess.SELECTED = true;
                            // sess.GROUP_ID = 1;
                            $scope.$parent.CASHUP.SESSION = sess;
                           // $scope.InsertCashUpHeader_12();
                            $scope.$parent.CASHUP.SESSION.SESSION_ID = sess.SESSION_MAPPING_ID;
                           // $scope.GET_CASHUP_BY_ID();
                            $scope.$parent.CASHUP.COMP_NOTES = null;
                            $scope.$parent.CASHUP.REV_NOTES = null;
                            $scope.$parent.CASHUP.REV_NOTES = null;
                            $scope.$parent.CASHUP.CASH_NOTES = null;
                            $scope.$parent.CASHUP.CARD_NOTES = null;
                            $scope.$parent.CASHUP.PCASH_NOTES = null;
                            $scope.$parent.CASHUP.INDEX = index;
                            if (sess.SESSION_MASTER_ID == '4' && sess.STATUS_ID == '2') {
                                sess.GROUP_ID = 1;
                            }
                            //sess.RDO_FLAG = false;

                        }
                        else {
                            sess.SELECTED = false;
                            // sess.GROUP_ID = 0;
                            //sess.RDO_FLAG = true;
                        }
                    });
                    //angular.forEach($scope.SessionList, function (sess) {
                    //    if (sess.GROUP_ID == 0 && $scope.$parent.CASHUP.COMPLETED_GROUP_ID == null) {
                    //        sess.RDO_FLAG = true;
                    //    } else if (sess.GROUP_ID == 1 && $scope.$parent.CASHUP.COMPLETED_GROUP_ID == 1) {
                    //        sess.RDO_FLAG = true;
                    //    }
                    //})
                    var FlagValid = false;
                    $scope.SessionList.filter(function (x) {
                        if (x.STATUS_ID == '2') {
                            FlagValid = true;
                        }
                    });
                    if (FlagValid) {
                        $scope.SessionListFilter1 = null;
                        if ($scope.$parent.CASHUP.COMPLETED_GROUP_ID == null) {
                            $scope.SessionListFilter1 = $filter('filter')($scope.SessionList, { GROUP_ID: 0 }, true);

                            angular.forEach($scope.SessionList, function (SL) {
                                angular.forEach($scope.SessionListFilter1, function (SF) {
                                    if (SF.GROUP_ID != SL.GROUP_ID) {
                                        SL.RDO_FLAG = true;
                                    }
                                })
                            })
                        }
                    }

                }
                else {
                    var Flag1 = false;
                    $scope.SessionList.filter(function (x) {
                        if (x.STATUS_ID == '2') {
                            Flag1 = true;
                        }
                    });
                    if (Flag1) {
                        $scope.SessionListFilter2 = null;
                        if ($scope.$parent.CASHUP.COMPLETED_GROUP_ID == null) {
                            $scope.SessionListFilter2 = $filter('filter')($scope.SessionList, { GROUP_ID: 0 }, true);

                            angular.forEach($scope.SessionList, function (SL) {
                                angular.forEach($scope.SessionListFilter2, function (SF) {
                                    if (SF.GROUP_ID != SL.GROUP_ID) {
                                        SL.RDO_FLAG = true;
                                    }
                                })
                            })
                        }
                    }

                }
            }
            $scope.$parent.CASHUP.SessionListData = $scope.SessionList;//data.data.Table3;
           
        });
    };
    

    //======================Total All Day Sells===============================

 
    
   
    $scope.ALL_DAYS_SALES = function ($event) {
        
        $scope.TOTAL_ALL_DAY_FLAG = true;
        $scope.RTab = 1;
        $scope.ACT_SELL = {
            TOTAL_FLOAT: 0,
            TOTAL_CASH: 0,
            TOTAL_CARD: 0,
            TOTAL_TOTAL_VAL: 0,
            TOTAL_CHEQUE: 0,
            ACCOUNT_TOTAL: 0,
            ACCOUNT_RECEIVED_TOTAL: 0,
            DEPOSIT_TOTAL: 0,
            DEPOSIT_REDEEMED_TOTAL: 0,
            ISSUE_TOTAL: 0,
            REDEEMED_TOTAL: 0,
            VOID_TOTAL: 0,
            COMP_TOTAL: 0,
            CASH_TIPS_TOTAL:0
        }
        $scope.EPOS_DISCOUNT_SALE = {
            DISCOUNT: 0,
            DONATION: 0,
            SERVICE_CHARGE: 0,
            TIPS: 0,
            VOID: 0
        };
        $scope.EPOS_SELL = {
            TOTAL_FLOAT: 0,
            TOTAL_CASH: 0,
            TOTAL_CARD: 0,
            TOTAL_TOTAL_VAL: 0,
            TOTAL_CHEQUE: 0,
            ACCOUNT_TOTAL: 0,
            ACCOUNT_RECEIVED_TOTAL: 0,
            DEPOSIT_TOTAL: 0,
            DEPOSIT_REDEEMED_TOTAL: 0,
            ISSUE_TOTAL: 0,
            REDEEMED_TOTAL: 0,
            VOID_TOTAL: 0,
            COMP_TOTAL: 0,
            TRANSITORY_TOTAL: 0,
            UNCLASSIFIED_TOTAL:0
        }
        $scope.EPOS_CAT_DATA_SALE = [];
        $scope.EPOS_CAT_DATA_SALE.push({ CATEGORY_MASTER_ID: 1, CATEGORY_NAME: "Food", NET_TOTAL: 0, TOTAL_DISC_CPN: 0, TOTAL_GROSS: 0, TOTAL_UNITS: 0, TOTAL_VAT_TAX: 0,FLAG:0 },
            { CATEGORY_MASTER_ID: 2, CATEGORY_NAME: "Drinks", NET_TOTAL: 0, TOTAL_DISC_CPN: 0, TOTAL_GROSS: 0, TOTAL_UNITS: 0, TOTAL_VAT_TAX: 0, FLAG: 0 },
            { CATEGORY_MASTER_ID: 3, CATEGORY_NAME: "Wine", NET_TOTAL: 0, TOTAL_DISC_CPN: 0, TOTAL_GROSS: 0, TOTAL_UNITS: 0, TOTAL_VAT_TAX: 0, FLAG: 0 },
            { CATEGORY_MASTER_ID: 4, CATEGORY_NAME: "Others", NET_TOTAL: 0, TOTAL_DISC_CPN: 0, TOTAL_GROSS: 0, TOTAL_UNITS: 0, TOTAL_VAT_TAX: 0, FLAG: 0 },
            { CATEGORY_MASTER_ID: 5, CATEGORY_NAME: "Tobacco", NET_TOTAL: 0, TOTAL_DISC_CPN: 0, TOTAL_GROSS: 0, TOTAL_UNITS: 0, TOTAL_VAT_TAX: 0, FLAG: 0 },
            { CATEGORY_MASTER_ID: 6, CATEGORY_NAME: "Hot Bev", NET_TOTAL: 0, TOTAL_DISC_CPN: 0, TOTAL_GROSS: 0, TOTAL_UNITS: 0, TOTAL_VAT_TAX: 0, FLAG: 0 })
        
       
        //$scope.$parent.CASHUP.SessionListData.filter(function (x) {
        //    if (x.SESSION_MASTER_ID == 4 && x.RDO_FLAG==false) {
        //        $scope.TOTAL_ALL_DAY_FLAG = false;
        //            }
        //        });
        $scope.TAB_OPENLIST_SALE = [];
        $scope.REV_NOTE_LIST_SALE = [];
        $scope.FLAG_VALID = true;
        $scope.COUNT = 0; $scope.COUNTACT = 0;

        if ($scope.TOTAL_ALL_DAY_FLAG) {
             
            $scope.$parent.CASHUP.SessionListData.filter(function (x) {
                if (x.CASHUP_HEADER_ID != null && x.CASHUP_HEADER_ID != "" && x.CASHUP_HEADER_ID != 0 && x.SESSION_MASTER_ID != 4 && x.SELECTED==true) {
                    x.SELECTED = false;
                }
            });
            $scope.$parent.CASHUP.SessionListData.filter(function (x) {
                if (x.CASHUP_HEADER_ID != null && x.CASHUP_HEADER_ID != "" && x.CASHUP_HEADER_ID != 0 && x.SESSION_MASTER_ID != 4) {
                    $scope.COUNTACT++;
            }
        });

            angular.forEach($scope.$parent.CASHUP.SessionListData, function (SESS_VAL) {
                //if (SESS_VAL.RDO_FLAG == false) {
                if (SESS_VAL.CASHUP_HEADER_ID != null && SESS_VAL.CASHUP_HEADER_ID != "" && SESS_VAL.CASHUP_HEADER_ID != 0 && SESS_VAL.SESSION_MASTER_ID != 4) {
                    $scope.GET_CASHUP_BY_ID_SALES(SESS_VAL.SESSION_MAPPING_ID);
                    //NOTES for Session wise
                    $scope.GET_CASHUP_HEADER_NOTES_SALES(SESS_VAL.CASHUP_HEADER_ID);
                }
            })
            angular.forEach($scope.$parent.CASHUP.SessionListData, function (SESS_VAL) {
                if ($scope.CASHUP.CashUp_Main_STATUS_ID == 3 || $scope.CASHUP.CashUp_Main_STATUS_ID == 4) {
                    if (SESS_VAL.CASHUP_HEADER_ID != null && SESS_VAL.CASHUP_HEADER_ID != "" && SESS_VAL.CASHUP_HEADER_ID != 0 && SESS_VAL.SESSION_MASTER_ID != 4) {  //SESS_VAL.RDO_FLAG == false
                        $scope.GET_CASHUP_CATEGORY_BIFURCATION_SALES(SESS_VAL.CASHUP_HEADER_ID);
                       
                    }
                } else {
                    if (SESS_VAL.CASHUP_HEADER_ID != null && SESS_VAL.CASHUP_HEADER_ID != "" && SESS_VAL.CASHUP_HEADER_ID != 0 && SESS_VAL.SESSION_MASTER_ID != 4) {
                        $scope.GET_CASHUP_CATEGORY_BIFURCATION_SALES(SESS_VAL.CASHUP_HEADER_ID);

                    }
                }

            })
            
            //if ($scope.FLAG_VALID) {
            //    $scope.GET_ALL_DAYS_SALES();
            //}

            // $scope.GET_CASHUP_CATEGORY_BIFURCATION_ALL_DAYS_SALE();
         
        }
        //else {           
        //    $scope.$parent.ShowAlert("Attention", "Day Summary not show because all session will be submited.", 3000);  
        //    $event.stopPropagation();
        //}
    }
  
    $scope.GET_CASHUP_BY_ID_SALES = function (SESSION_MAPPING_ID) {
        
        var CashupModelObj = new Object();
        CashupModelObj.CASHUP_MAIN_ID = $scope.$parent.CASHUP.CASHUP_MAIN_ID;  //CASHUP_HEADER_ID;
        CashupModelObj.SESSION_ID = SESSION_MAPPING_ID;
        CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_CASHUP_BY_ID').then(function (data) {
            
            if (data != undefined && data.data != undefined && data.data.Table.length > 0) {
               // $scope.$parent.CASHUP.ID = data.data.Table[0].ID;       
                $scope.ACT_SELL.TOTAL_FLOAT += (data.data.Table[0].FLOAT_TOTAL != null ? parseFloat(data.data.Table[0].FLOAT_TOTAL) : 0);
                $scope.ACT_SELL.TOTAL_CASH += (data.data.Table[0].CASH_TOTAL != null ? parseFloat(data.data.Table[0].CASH_TOTAL) : 0);

                $scope.ACT_SELL.TOTAL_CARD += (data.data.Table[0].CARDS_TOTAL != null ? parseFloat(data.data.Table[0].CARDS_TOTAL) : 0);
                $scope.ACT_SELL.TOTAL_TOTAL_VAL += (data.data.Table[0].PETTY_CASH != null ? parseFloat(data.data.Table[0].PETTY_CASH) : 0);
                $scope.ACT_SELL.TOTAL_CHEQUE += (data.data.Table[0].CHEQUE != null ? parseFloat(data.data.Table[0].CHEQUE) : 0);
                $scope.ACT_SELL.ACCOUNT_TOTAL += (data.data.Table[0].ACCOUNT_TOTAL != null ? parseFloat(data.data.Table[0].ACCOUNT_TOTAL) : 0);
                $scope.ACT_SELL.ACCOUNT_RECEIVED_TOTAL += (data.data.Table[0].ACCOUNT_RECEIVED_TOTAL != null ? parseFloat(data.data.Table[0].ACCOUNT_RECEIVED_TOTAL) : 0);

                $scope.ACT_SELL.DEPOSIT_TOTAL += (data.data.Table[0].DEPOSIT_RECEIVED_TOTAL != null ? parseFloat(data.data.Table[0].DEPOSIT_RECEIVED_TOTAL) : 0);
                $scope.ACT_SELL.DEPOSIT_REDEEMED_TOTAL += (data.data.Table[0].DEPOSIT_REDEEMED_TOTAL != null ? parseFloat(data.data.Table[0].DEPOSIT_REDEEMED_TOTAL) : 0);
                $scope.ACT_SELL.ISSUE_TOTAL += (data.data.Table[0].VOUCHER_ISSUED_TOTAL != null ? parseFloat(data.data.Table[0].VOUCHER_ISSUED_TOTAL) : 0);
                $scope.ACT_SELL.REDEEMED_TOTAL += (data.data.Table[0].VOUCHER_REDEEMED_TOTAL != null ? parseFloat(data.data.Table[0].VOUCHER_REDEEMED_TOTAL) : 0);

                $scope.ACT_SELL.VOID_TOTAL += (data.data.Table[0].VOID_TOTAL != null ? parseFloat(data.data.Table[0].VOID_TOTAL) : 0);
                $scope.ACT_SELL.COMP_TOTAL += (data.data.Table[0].COMPLIMENTARY_TOTAL != null ? parseFloat(data.data.Table[0].COMPLIMENTARY_TOTAL) : 0);
                $scope.ACT_SELL.CASH_TIPS_TOTAL += (data.data.Table[0].CASH_TIPS != null ? parseFloat(data.data.Table[0].CASH_TIPS) : 0);


                //$scope.GET_EPOS_HEADER();
                //$scope.GET_EPOS_DATA();
              
            }
             
            $scope.COUNT++;
            
        });
    };
    $scope.GET_CASHUP_CATEGORY_BIFURCATION_SALES = function (CASHUP_HEADER_ID) {
        // $scope.GET_ACC_CUST_DECLARATION();
       
        var CashupModelObj = new Object();
        CashupModelObj.ID = CASHUP_HEADER_ID;
        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_CASHUP_CATEGORY_BIFURCATION').then(function (data) {
            
            if (data != undefined && data.data != undefined) {
                $scope.TAB_OPENLIST_SALE = data.data.Table;
                //  $scope.$parent.CASHUP.EPOS_DATA = data.data.Table2;  
                //===================================================

                if ($scope.TAB_OPENLIST_SALE.length > 0) {
                    angular.forEach($scope.TAB_OPENLIST_SALE, function (val) {
                        for (var i = 0; i < $scope.$parent.CASHUP.TABLIST.length; i++) {
                            if (val.CASHUP_TAB_ID == $scope.$parent.CASHUP.TABLIST[i].CASHUP_TABS_ID) {
                                val.FLAG = $scope.$parent.CASHUP.TABLIST[i].FLAG;
                                val.ACTUAL_AMT = 0;
                                val.SALES_AMT = 0;
                                val.VARIANCE_AMT = 0;
                                break;
                            }
                        }
                    })
                }
                if (data.data.Table1.length > 0) {
                    for (var i = 0; i < $scope.EPOS_CAT_DATA_SALE.length; i++) {
                        angular.forEach(data.data.Table1, function (CATVAL) {
                            if (CATVAL.CATEGORY_NAME == $scope.EPOS_CAT_DATA_SALE[i].CATEGORY_NAME) {
                                $scope.EPOS_CAT_DATA_SALE[i].NET_TOTAL += CATVAL.NET_TOTAL;
                                $scope.EPOS_CAT_DATA_SALE[i].TOTAL_DISC_CPN += CATVAL.TOTAL_DISC_CPN;
                                $scope.EPOS_CAT_DATA_SALE[i].TOTAL_GROSS += CATVAL.TOTAL_GROSS;
                                $scope.EPOS_CAT_DATA_SALE[i].TOTAL_UNITS += CATVAL.TOTAL_UNITS;
                                $scope.EPOS_CAT_DATA_SALE[i].TOTAL_VAT_TAX += CATVAL.TOTAL_VAT_TAX;
                                $scope.EPOS_CAT_DATA_SALE[i].FLAG = 1;
                            }
                            // }

                        })
                    }
                }
                if (data.data.Table3.length > 0) {
                    angular.forEach(data.data.Table3, function (DISVAL) {
                        $scope.EPOS_DISCOUNT_SALE.DISCOUNT += ((DISVAL.DISCOUNT != 0 && DISVAL.DISCOUNT != null) ? parseFloat(DISVAL.DISCOUNT) : 0);
                        $scope.EPOS_DISCOUNT_SALE.DONATION += ((DISVAL.DONATION != 0 && DISVAL.DONATION != null) ? parseFloat(DISVAL.DONATION) : 0);
                        $scope.EPOS_DISCOUNT_SALE.SERVICE_CHARGE += ((DISVAL.SERVICE_CHARGE != 0 && DISVAL.SERVICE_CHARGE != null)? parseFloat(DISVAL.SERVICE_CHARGE) : 0);
                        $scope.EPOS_DISCOUNT_SALE.TIPS += ((DISVAL.TIPS != 0 && DISVAL.TIPS != null)? parseFloat(DISVAL.TIPS) : 0);
                        $scope.EPOS_DISCOUNT_SALE.VOID += ((DISVAL.VOID != 0 && DISVAL.VOID != null) ? parseFloat(DISVAL.VOID) : 0);
                    })
                }

                // data.data.Table2.filter(function (x) {
                //    if (x.MEDIA == "Unclassified") {
                //        if (x.SALES_AMT != 0) {
                //            $scope.TAB_OPENLIST_SALE.push({ ADD_IN_DAILY_TAKINGS: x.ADD_IN_DAILY_TAKINGS, CASHUP_TAB_ID: x.CASHUP_TAB_ID, DISPLAY_NAME: x.MEDIA, SALES_AMT: x.SALES_AMT, SORT_ORDER: x.SORT_ORDER, ACTUAL_AMT: 0, VARIANCE_AMT: 0, FLAG: 0 });
                //        }
                //    }
                //});
                if (data.data.Table2.length > 0) { 
                angular.forEach(data.data.Table2, function (val) {
                    if (val.MEDIA == 'Cash') {
                        // val.ACTUAL_AMT = $scope.ACT_SELL.TOTAL_CASH;
                        $scope.EPOS_SELL.TOTAL_CASH += val.SALES_AMT;
                        //val.VARIANCE_AMT = $scope.ACT_SELL.TOTAL_CASH - val.SALES_AMT;
                    } else if (val.MEDIA == 'Cards') {
                        //val.ACTUAL_AMT = $scope.ACT_SELL.TOTAL_CARD;
                        $scope.EPOS_SELL.TOTAL_CARD += val.SALES_AMT;
                        //val.VARIANCE_AMT = $scope.ACT_SELL.TOTAL_CARD - val.SALES_AMT;
                    } else if (val.MEDIA == 'Petty Cash') {
                        //val.ACTUAL_AMT = $scope.$parent.CASHUP.TOTAL_TOTAL_VAL;
                        $scope.EPOS_SELL.TOTAL_TOTAL_VAL += val.SALES_AMT;
                        //val.VARIANCE_AMT = $scope.$parent.CASHUP.TOTAL_TOTAL_VAL - val.SALES_AMT;
                    } else if (val.MEDIA == 'Delivery') {
                        // val.ACTUAL_AMT = $scope.$parent.CASHUP.TOTAL_CHEQUE;
                        $scope.EPOS_SELL.TOTAL_CHEQUE += val.SALES_AMT;
                        //val.VARIANCE_AMT = $scope.$parent.CASHUP.TOTAL_CHEQUE - val.SALES_AMT;
                    } else if (val.MEDIA == 'Account Credit') {
                        //val.ACTUAL_AMT = $scope.$parent.CASHUP.ACCOUNT_TOTAL;
                        $scope.EPOS_SELL.ACCOUNT_TOTAL += val.SALES_AMT;
                        // val.VARIANCE_AMT = $scope.$parent.CASHUP.ACCOUNT_TOTAL - val.SALES_AMT;
                    } else if (val.MEDIA == 'Voucher Redeemed') {
                        //val.ACTUAL_AMT = $scope.$parent.CASHUP.REDEEMED_TOTAL;
                        $scope.EPOS_SELL.REDEEMED_TOTAL += val.SALES_AMT;
                        //val.VARIANCE_AMT = $scope.$parent.CASHUP.REDEEMED_TOTAL - val.SALES_AMT;
                    } else if (val.MEDIA == 'Deposit Redeemed') {
                        //val.ACTUAL_AMT = $scope.$parent.CASHUP.DEPOSIT_REDEEMED_TOTAL;
                        $scope.EPOS_SELL.DEPOSIT_REDEEMED_TOTAL += val.SALES_AMT;
                        //val.VARIANCE_AMT = $scope.$parent.CASHUP.DEPOSIT_REDEEMED_TOTAL - val.SALES_AMT;
                    } else if (val.MEDIA == 'Account Received') {
                        //val.ACTUAL_AMT = $scope.$parent.CASHUP.ACCOUNT_RECEIVED_TOTAL;
                        $scope.EPOS_SELL.ACCOUNT_RECEIVED_TOTAL += val.SALES_AMT;
                        // val.VARIANCE_AMT = $scope.$parent.CASHUP.ACCOUNT_RECEIVED_TOTAL - val.SALES_AMT;
                    } else if (val.MEDIA == 'Voucher Issued') {
                        // val.ACTUAL_AMT = $scope.$parent.CASHUP.ISSUE_TOTAL;
                        $scope.EPOS_SELL.ISSUE_TOTAL += val.SALES_AMT;
                        //val.VARIANCE_AMT = $scope.$parent.CASHUP.ISSUE_TOTAL - val.SALES_AMT;
                    } else if (val.MEDIA == 'Deposit Received') {
                        //val.ACTUAL_AMT = $scope.$parent.CASHUP.DEPOSIT_TOTAL;
                        $scope.EPOS_SELL.DEPOSIT_TOTAL += val.SALES_AMT;
                        //val.VARIANCE_AMT = $scope.$parent.CASHUP.DEPOSIT_TOTAL - val.SALES_AMT;
                    } else if (val.MEDIA == 'Transitory') {
                        $scope.EPOS_SELL.TRANSITORY_TOTAL += val.SALES_AMT;
                        //val.ACTUAL_AMT += val.SALES_AMT;
                        //val.VARIANCE_AMT = 0;
                        //if ($scope.$parent.CASHUP.INTEGRATION_SYSTEM_ID == 1) {
                        //    val.FLAG = 1;
                        //}
                    }
                    else if (val.MEDIA == 'Unclassified') {
                        // val.ACTUAL_AMT = 0;
                        $scope.EPOS_SELL.UNCLASSIFIED_TOTAL += val.SALES_AMT;
                        // val.FLAG = 1;
                    }
                })
                }
                if ($scope.COUNTACT == $scope.COUNT) {
                    $scope.GET_ALL_DAYS_SALES();
                }
            }
           
          
         
        });
        
    };
    $scope.GET_CASHUP_HEADER_NOTES_SALES = function (CASHUP_HEADER_ID) {
         
        var CashupModelObj = new Object();
        CashupModelObj.NOTE_TYPE_ID = $scope.NOTE_TYPE_ID;
        CashupModelObj.CASHUP_HEADER_ID = CASHUP_HEADER_ID;
        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_CASHUP_HEADER_NOTES').then(function (data) {
             
            $scope.CURRENT_UTC_TIME = angular.copy(data.data.UTC_TIME[0].UTC_TIME);
            if (timer) {
                clearInterval(timer);
            }
            timer = setInterval(clockUpdate, 1000);
            if (data.data.Table != null && data.data.Table.length > 0) {
                angular.forEach(data.data.Table, function (val) {
                    $scope.REV_NOTE_LIST_SALE.push(val);
                })
                
            }
        });
    };
    $scope.GET_ALL_DAYS_SALES = function () {
        
        $scope.VARIANCE_TOTAL_SALE = 0; $scope.REV_CASHUP_TOTAL_SALE = 0;
        if ($scope.TAB_OPENLIST_SALE.length > 0) {
            angular.forEach($scope.TAB_OPENLIST_SALE, function (val) {
                if (val.DISPLAY_NAME == 'Cash') {
                    val.ACTUAL_AMT = $scope.ACT_SELL.TOTAL_CASH;
                    val.SALES_AMT = $scope.EPOS_SELL.TOTAL_CASH;
                    val.VARIANCE_AMT = $scope.ACT_SELL.TOTAL_CASH - $scope.EPOS_SELL.TOTAL_CASH;
                } else if (val.DISPLAY_NAME == 'Cards') {
                    val.ACTUAL_AMT = $scope.ACT_SELL.TOTAL_CARD;
                    val.SALES_AMT = $scope.EPOS_SELL.TOTAL_CARD;
                    val.VARIANCE_AMT = $scope.ACT_SELL.TOTAL_CARD - $scope.EPOS_SELL.TOTAL_CARD;
                } else if (val.DISPLAY_NAME == 'Petty Cash') {
                    val.ACTUAL_AMT = $scope.ACT_SELL.TOTAL_TOTAL_VAL;
                    val.SALES_AMT = $scope.EPOS_SELL.TOTAL_TOTAL_VAL;
                    val.VARIANCE_AMT = $scope.ACT_SELL.TOTAL_TOTAL_VAL - $scope.EPOS_SELL.TOTAL_TOTAL_VAL;
                } else if (val.DISPLAY_NAME == 'Delivery') {
                    val.ACTUAL_AMT = $scope.ACT_SELL.TOTAL_CHEQUE;
                    val.SALES_AMT = $scope.EPOS_SELL.TOTAL_CHEQUE;
                    val.VARIANCE_AMT = $scope.ACT_SELL.TOTAL_CHEQUE - $scope.EPOS_SELL.TOTAL_CHEQUE;
                } else if (val.DISPLAY_NAME == 'Account Credit') {
                    val.ACTUAL_AMT = $scope.ACT_SELL.ACCOUNT_TOTAL;
                    val.SALES_AMT = $scope.EPOS_SELL.ACCOUNT_TOTAL;
                    val.VARIANCE_AMT = $scope.ACT_SELL.ACCOUNT_TOTAL - $scope.EPOS_SELL.ACCOUNT_TOTAL;
                } else if (val.DISPLAY_NAME == 'Voucher Redeemed') {
                    val.ACTUAL_AMT = $scope.ACT_SELL.REDEEMED_TOTAL;
                    val.SALES_AMT = $scope.EPOS_SELL.REDEEMED_TOTAL;
                    val.VARIANCE_AMT = $scope.ACT_SELL.REDEEMED_TOTAL - $scope.EPOS_SELL.REDEEMED_TOTAL;
                } else if (val.DISPLAY_NAME == 'Deposit Redeemed') {
                    val.ACTUAL_AMT = $scope.ACT_SELL.DEPOSIT_REDEEMED_TOTAL;
                    val.SALES_AMT = $scope.EPOS_SELL.DEPOSIT_REDEEMED_TOTAL;
                    val.VARIANCE_AMT = $scope.ACT_SELL.DEPOSIT_REDEEMED_TOTAL - $scope.EPOS_SELL.DEPOSIT_REDEEMED_TOTAL;
                } else if (val.DISPLAY_NAME == 'Account Received') {
                    val.ACTUAL_AMT = $scope.ACT_SELL.ACCOUNT_RECEIVED_TOTAL;
                    val.SALES_AMT = $scope.EPOS_SELL.ACCOUNT_RECEIVED_TOTAL;
                    val.VARIANCE_AMT = $scope.ACT_SELL.ACCOUNT_RECEIVED_TOTAL - $scope.EPOS_SELL.ACCOUNT_RECEIVED_TOTAL;
                } else if (val.DISPLAY_NAME == 'Voucher Issued') {
                    val.ACTUAL_AMT = $scope.ACT_SELL.ISSUE_TOTAL;
                    val.SALES_AMT = $scope.EPOS_SELL.ISSUE_TOTAL;
                    val.VARIANCE_AMT = $scope.ACT_SELL.ISSUE_TOTAL - $scope.EPOS_SELL.ISSUE_TOTAL;
                } else if (val.DISPLAY_NAME == 'Deposit Received') {
                    val.ACTUAL_AMT = $scope.ACT_SELL.DEPOSIT_TOTAL;
                    val.SALES_AMT = $scope.EPOS_SELL.DEPOSIT_TOTAL;
                    val.VARIANCE_AMT = $scope.ACT_SELL.DEPOSIT_TOTAL - $scope.EPOS_SELL.DEPOSIT_TOTAL;
                } else if (val.DISPLAY_NAME == 'Transitory') {
                    val.ACTUAL_AMT = $scope.EPOS_SELL.TRANSITORY_TOTAL;
                    val.SALES_AMT = $scope.EPOS_SELL.TRANSITORY_TOTAL;
                    val.VARIANCE_AMT = 0;
                    //val.ACTUAL_AMT += val.SALES_AMT;
                    //val.VARIANCE_AMT = 0;
                    if ($scope.$parent.CASHUP.INTEGRATION_SYSTEM_ID == 1) {
                        val.FLAG = 1;
                    }
                }
            })
            
            if ($scope.EPOS_SELL.UNCLASSIFIED_TOTAL != 0) {
                $scope.TAB_OPENLIST_SALE.push({ ADD_IN_DAILY_TAKINGS: true, CASHUP_TAB_ID: null, DISPLAY_NAME: 'Unclassified', SALES_AMT: $scope.EPOS_SELL.UNCLASSIFIED_TOTAL, SORT_ORDER: 99, ACTUAL_AMT: 0, VARIANCE_AMT: - $scope.EPOS_SELL.UNCLASSIFIED_TOTAL, FLAG: 1 });
            }
            angular.forEach($scope.TAB_OPENLIST_SALE, function (Variance) {
                if (Variance.ADD_IN_DAILY_TAKINGS) {
                    $scope.VARIANCE_TOTAL_SALE += Variance.VARIANCE_AMT;
                    $scope.REV_CASHUP_TOTAL_SALE += Variance.ACTUAL_AMT;
                }
            })

        }
       
        $scope.$parent.overlay_loadingNew = 'none';
    };
    $scope.PRINT_PDF_ALLDAYSALES = function () {
        window.scrollTo(0, 0);
        const node = document.getElementById("content");
        const clone = node.cloneNode(true);     

        clone.getElementsByClassName('border-left-0')[0].removeAttribute('hidden');
        clone.getElementsByClassName('border-left-0')[1].removeAttribute('hidden');
        //clone.getElementsByClassName('border-left-0')[2].removeAttribute('hidden');
        //clone.getElementsByClassName('border-left-0')[3].removeAttribute('hidden');
      
        html2canvas(document.body.appendChild(clone), { useCORS: true, scale: 2 }).then(function (canvas) {
            var imgBase64 = canvas.toDataURL('image/jpeg', 2.0);
            document.body.removeChild(clone);
            //$("#content .border-bottom").each(function () {
            //    
            //    $(this).removeAttr('hidden');
            //});

            var doc = new jsPDF("p", "mm", "a4");
            const pageWidth = doc.internal.pageSize.width;
            const pageHeight = doc.internal.pageSize.height;

            const widthRatio = pageWidth / canvas.width;
            const heightRatio = pageHeight / canvas.height;
            const ratio = widthRatio > heightRatio ? heightRatio : widthRatio;

            //const canvasWidth = canvas.width * ratio;
            const canvasHeight = canvas.height * ratio;

            //const marginX = (pageWidth - canvasWidth);
            //const marginY = (pageHeight - canvasHeight);


            doc.addImage(imgBase64, 'JPEG', 2, 5, pageWidth - 3, canvasHeight);

            //var imgBase64 = canvas.toDataURL('image/jpeg', 2.0);
            //document.body.removeChild(clone);
            //var doc = new jsPDF("p", "pt", "a4");
            //const pageWidth = doc.internal.pageSize.width;
            //const pageHeight = doc.internal.pageSize.height;
            //const widthRatio = pageWidth / canvas.width;
            //const heightRatio = pageHeight / canvas.height;
            //const ratio = widthRatio > heightRatio ? heightRatio : widthRatio;
            //const canvasHeight = canvas.height * ratio;
            //doc.addImage(imgBase64, 'JPEG', 2, 5, pageWidth - 3, canvasHeight);
            doc.save('Day Summary.pdf');
        });
    };

    //$scope.ALL_DAYS_SALES();
    //====================================
    //$scope.REDIRECT_TO_SELECTED_DATE = function () {
    //     
    //    if ($scope.CashupEdit.START_DATE != null) {
    //        $scope.$parent.CASHUP.CASHUP_DATE = new Date($scope.CashupEdit.START_DATE);
    //        $scope.CASHUP.CASHUP_DATE = new Date($scope.CashupEdit.START_DATE);//== undefined ? moment().startOf('month').format($scope.$parent.Datelocaleformat.format) : $scope.CashupSearch.START_DATE;
    //        // $scope.GET_MASTERDATA_FOR_CASHUP();
    //        var CashupModelObj = new Object();
    //        CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
    //        CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
    //        CashupModelObj.CASHUP_DATE_START = new Date($scope.CashupEdit.START_DATE);// $scope.CashuptSearch.START_DATE == undefined ? moment().startOf('month').format($scope.$parent.Datelocaleformat.format) : new Date($scope.CashupSearch.START_DATE);
    //        CashupModelObj.CASHUP_DATE_END = new Date($scope.CashupEdit.START_DATE);//$scope.CashupSearch.START_DATE == undefined ? moment().endOf('month').format($scope.$parent.Datelocaleformat.format) : new Date($scope.CashupSearch.START_DATE);
    //        CashupModelObj.STATUS_IDS = '';
    //        CashupModelObj.BRANCH_IDS = $scope.CASHUP.BRANCH_ID;
    //        CashupModelObj.PAGE_NO = 1;
    //        CashupModelObj.PAGE_SIZE = 10;
    //        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_CASHUP_LIST').then(function (data) {

    //            if (data.data.Table.length > 0) {
    //                $scope.SELECTED_CMID = data.data.Table[0].ID;

    //            }
    //            else {
    //                //Cashup for this date does not exists.
    //                $scope.$parent.ShowAlert("Attention", "Cashup for this date doesn't exists.", 3000);
    //            }

    //        });
    //    } else {
    //        $scope.ShowAlert('Error', 'Date and Session properly selected.', 3000);
    //    }
    //};
    //$scope.REFRESH_TO_EDIT_DATE = function (SESSION) {
    //     
    //    var CashupModelObj = new Object();
    //    CashupModelObj.CASHUP_MAIN_ID = $scope.SELECTED_CMID;
    //    CashupModelObj.SESSION_ID = SESSION.SESSION_MAPPING_ID;
    //    CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
    //    PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_CASHUP_BY_ID').then(function (data) {
    //        if (data != undefined && data.data != undefined && data.data.Table.length > 0) {
    //            $scope.SELECTED_HID = data.data.Table[0].ID;
    //            $scope.GET_REVENUE_CENTERS();
    //            $scope.REV_NOTE_LIST = [];
    //            $scope.GET_CASHUP_HEADER_NOTES();
    //            $scope.$parent.CASHUP.BRANCH_ID = data.data.Table[0].BRANCH_ID;
    //            //$scope.$parent.CASHUP.AREA_ID = data.data[0].AREA_ID;
    //            $scope.$parent.CASHUP.TILL_ID = data.data.Table[0].TILL_ID;
    //            //$scope.$parent.CASHUP.SESSION_ID = data.data.Table[0].SESSION_ID;
    //            //$scope.$parent.CASHUP.SESSION = data.data.Table[0];
    //            $scope.$parent.CASHUP.SESSION.CASHUP_HEADER_ID = data.data.Table[0].ID;
    //            $scope.$parent.CASHUP.TYPE = data.data.Table[0].CASHUP_TYPE;

    //            $scope.$parent.CASHUP.CASHUP_DATE = $scope.$parent.CASHUP.CASHUP_DATE;// data.data.Table[0].CASHUP_DATE;
    //            $scope.$parent.CASHUP.STEP_NO = angular.copy(data.data.Table[0].STEP_NO);
    //            $scope.$parent.CASHUP.ACTUAL_STEP_NO = data.data.Table[0].STEP_NO;
    //            //$scope.$parent.CASHUP.TOTAL_FLOAT = data.data.Table[0].FLOAT_TOTAL;
    //            //$scope.$parent.CASHUP.TOTAL_CASH = data.data.Table[0].CASH_TOTAL;

    //            $scope.$parent.CASHUP.TOTAL_FLOAT = data.data.Table[0].FLOAT_TOTAL != null ? parseFloat(data.data.Table[0].FLOAT_TOTAL) : 0;;
    //            $scope.$parent.CASHUP.TOTAL_CASH = data.data.Table[0].CASH_TOTAL != null ? parseFloat(data.data.Table[0].CASH_TOTAL) : 0;;

    //            $scope.$parent.CASHUP.TOTAL_CARD = data.data.Table[0].CARDS_TOTAL != null ? parseFloat(data.data.Table[0].CARDS_TOTAL) : 0;
    //            $scope.$parent.CASHUP.TOTAL_TOTAL_VAL = data.data.Table[0].PETTY_CASH != null ? parseFloat(data.data.Table[0].PETTY_CASH) : 0;
    //            $scope.$parent.CASHUP.TOTAL_CHEQUE = data.data.Table[0].CHEQUE != null ? parseFloat(data.data.Table[0].CHEQUE) : 0;
    //            $scope.$parent.CASHUP.ACCOUNT_TOTAL = data.data.Table[0].ACCOUNT_TOTAL != null ? parseFloat(data.data.Table[0].ACCOUNT_TOTAL) : 0;
    //            $scope.$parent.CASHUP.ACCOUNT_RECEIVED_TOTAL = data.data.Table[0].ACCOUNT_RECEIVED_TOTAL != null ? parseFloat(data.data.Table[0].ACCOUNT_RECEIVED_TOTAL) : 0;

    //            $scope.$parent.CASHUP.DEPOSIT_TOTAL = data.data.Table[0].DEPOSIT_RECEIVED_TOTAL != null ? parseFloat(data.data.Table[0].DEPOSIT_RECEIVED_TOTAL) : 0;
    //            $scope.$parent.CASHUP.DEPOSIT_REDEEMED_TOTAL = data.data.Table[0].DEPOSIT_REDEEMED_TOTAL != null ? parseFloat(data.data.Table[0].DEPOSIT_REDEEMED_TOTAL) : 0;
    //            $scope.$parent.CASHUP.ISSUE_TOTAL = data.data.Table[0].VOUCHER_ISSUED_TOTAL != null ? parseFloat(data.data.Table[0].VOUCHER_ISSUED_TOTAL) : 0;
    //            $scope.$parent.CASHUP.REDEEMED_TOTAL = data.data.Table[0].VOUCHER_REDEEMED_TOTAL != null ? parseFloat(data.data.Table[0].VOUCHER_REDEEMED_TOTAL) : 0;
    //             
    //            $scope.$parent.CASHUP.VOID_TOTAL = data.data.Table[0].VOID_TOTAL != null ? parseFloat(data.data.Table[0].VOID_TOTAL) : 0;
    //            $scope.$parent.CASHUP.COMP_TOTAL = data.data.Table[0].COMPLIMENTARY_TOTAL != null ? parseFloat(data.data.Table[0].COMPLIMENTARY_TOTAL) : 0;


    //            $scope.$parent.CASHUP.ORIGINAL_FILE_NAME = data.data.Table[0].ORIGINAL_FILE_NAME;
    //            $scope.$parent.CASHUP.UPL_ID = data.data.Table[0].UPL_ID;
    //            $scope.$parent.CASHUP.INTEGRATION_SYSTEM_ID = data.data.Table[0].INTEGRATION_SYSTEM_ID;
    //            // $scope.$parent.CASHUP.INTEGRATION_SYSTEM_ID = 12;
    //            //  $scope.$parent.CASHUP.INTEGRATION_SYSTEM_ID = 0;

    //            $scope.$parent.CASHUP.INTEGRATION_URL = data.data.Table[0].URL_PATH;
    //            $scope.$parent.CASHUP.ACCESS_TOKEN = data.data.Table[0].API_KEY;
    //            $scope.$parent.CASHUP.ACC_CUSTOMER_RED_LIST = [];

    //            //   $scope.GOTOSTEP($scope.$parent.CASHUP.STEP_NO+1);
    //            // window.location.href = '../Cashup/CashupIndex#!/Float?CMID=' + $scope.$parent.CashUp_Main_ID;
    //            $scope.GET_EPOS_HEADER();
    //            $scope.GET_EPOS_DATA();


    //            $scope.$parent.CASHUP.REV_NOTES_ID = 0;
    //            $scope.$parent.CASHUP.REV_NOTES = "";

    //            //for (var i = 0; i < data.data.Table1.length; i++) {
    //            //    if (data.data.Table1[i].NOTE_TYPE_ID == 1) {
    //            //        $scope.$parent.CASHUP.REV_NOTES_ID = data.data.Table1[i].ID != 0 ? data.data.Table1[i].ID : 0;
    //            //        $scope.$parent.CASHUP.REV_NOTES = data.data.Table1[i].NOTE;
    //            //    }
    //            //    else if (data.data.Table1[i].NOTE_TYPE_ID == 2) {
    //            //        $scope.$parent.CASHUP.CASH_NOTES_ID = data.data.Table1[i].ID != 0 ? data.data.Table1[i].ID : 0;
    //            //        $scope.$parent.CASHUP.CASH_NOTES = data.data.Table1[i].NOTE;
    //            //    }
    //            //    else if (data.data.Table1[i].NOTE_TYPE_ID == 3) {
    //            //        $scope.$parent.CASHUP.CARD_NOTES_ID = data.data.Table1[i].ID != 0 ? data.data.Table1[i].ID : 0;
    //            //        $scope.$parent.CASHUP.CARD_NOTES = data.data.Table1[i].NOTE;
    //            //    }
    //            //    else if (data.data.Table1[i].NOTE_TYPE_ID == 4) {
    //            //        $scope.$parent.CASHUP.PCASH_NOTES_ID = data.data.Table1[i].ID != 0 ? data.data.Table1[i].ID : 0;
    //            //        $scope.$parent.CASHUP.PCASH_NOTES = data.data.Table1[i].NOTE;
    //            //    }
    //            //    else if (data.data.Table1[i].NOTE_TYPE_ID == 5) {
    //            //        $scope.$parent.CASHUP.COMP_NOTES_ID = data.data.Table1[i].ID != 0 ? data.data.Table1[i].ID : 0;
    //            //        $scope.$parent.CASHUP.COMP_NOTES = data.data.Table1[i].NOTE;
    //            //    }
    //            //    else if (data.data.Table1[i].NOTE_TYPE_ID == 6) {
    //            //        if ($scope.$parent.CASHUP.CashUp_Main_STATUS_ID == 4 || $scope.$parent.CASHUP.CashUp_Main_STATUS_ID == 5) {
    //            //            $scope.$parent.CASHUP.REV_NOTES_ID = data.data.Table1[i].ID != 0 ? data.data.Table1[i].ID : 0;
    //            //            $scope.$parent.CASHUP.REV_NOTES = $scope.$parent.CASHUP.AreaList[0].REJECTION_COMMENTS;

    //            //        } else {
    //            //            $scope.$parent.CASHUP.REV_NOTES_ID = data.data.Table1[i].ID != 0 ? data.data.Table1[i].ID : 0;
    //            //            $scope.$parent.CASHUP.REV_NOTES = data.data.Table1[i].NOTE;

    //            //        }
    //            //    }
    //            //}
    //            $scope.$parent.CASHUP.STEP_NO = 10;
    //            $scope.$parent.CASHUP.ACTUAL_STEP_NO = 10;
    //        }
    //    });
    //}
    //$scope.REDIRECT_TO_SELECTED_DATE_OK = function () {
    //      window.location.href = '../Cashup/CashupIndex#!/Reviews?CHID=' + $scope.SELECTED_HID + '&CMID=' + $scope.SELECTED_CMID;  //CHID=18528&CMID=136366
    //            $scope.$parent.CASHUP.ID = $scope.SELECTED_HID;
    //            $scope.$parent.CASHUP.CASHUP_MAIN_ID = $scope.SELECTED_CMID;
    //}
    //============================================================
});