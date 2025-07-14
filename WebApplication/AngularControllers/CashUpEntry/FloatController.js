app.controller('FloatController', function ($scope, $http, $interval, CommService, $cookies, $filter, PrcCommMethods, $location, readFileData, readFileDataNew, $sce) {
    $scope.$parent.CASHUP.KeyColor = "Float";
    $scope.$parent.CASHUP.ID = getUrlParameter('CHID', $location.absUrl());
    $scope.$parent.CASHUP.FLOAT_NOTES = "";
    if ($scope.$parent.CASHUP.ACTUAL_STEP_NO <= 2) {
        $scope.$parent.CASHUP.ACTUAL_STEP_NO = 2;
    }
    $scope.TabValid = true;
    $scope.NOTE_TYPE_ID = 1;
    $scope.SETTING_MINTS = $scope.$parent.GET_ENTITY_SETTINGS(27)[0].SETTING_VALUE;
    $scope.$parent.overlay_loadingNew = 'block';
    $scope.DECLARATION_TYPE_ID = 1;
    $scope.DECLERATION_MASTER = [];

    $scope.GET_FLOAT_DECLARATION = function () {
        var CashupModelObj = new Object();
        //CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        //CashupModelObj.CURRENCY_ID = 1;
        //CashupModelObj.ID = $scope.$parent.CASHUP.ID;
        //CashupModelObj.DECLARATION_TYPE_ID = 1;
        CashupModelObj.ID = $scope.$parent.CASHUP.ID;
        CashupModelObj.DECLARATION_TYPE_ID = 1;
        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_FLOAT_CASH_DECLARATION').then(function (data) {

            if (data.data.Table != null && data.data.Table.length > 0) {

                angular.forEach($scope.CUR_DOMINATION_LIST, function (val) {
                    for (var i = 0; i < data.data.Table.length; i++) {
                        if (data.data.Table[i].DECLARATION_MASTER_ID == val.DECLARATION_MASTER_ID) {
                            data.data.Table[i].BRANCH_CURRENCY_AMOUNT = val.BRANCH_CURRENCY_AMOUNT != null && val.BRANCH_CURRENCY_AMOUNT != undefined && val.BRANCH_CURRENCY_AMOUNT != 0 ? val.BRANCH_CURRENCY_AMOUNT : 0;
                            data.data.Table[i].CUSTOM_TO_BRANCH_CONVERSION_RATE = val.CUSTOM_TO_BRANCH_CONVERSION_RATE != null && val.CUSTOM_TO_BRANCH_CONVERSION_RATE != undefined && val.CUSTOM_TO_BRANCH_CONVERSION_RATE != 0 ? val.CUSTOM_TO_BRANCH_CONVERSION_RATE : 0;

                            $scope.DECLERATION_MASTER.push(data.data.Table[i]);
                            break;
                        }
                    }
                })

                //$scope.$parent.CASHUP.DECLERATION_MASTER = data.data.Table;
            }
            else {
                $scope.DECLERATION_MASTER = $scope.CUR_DOMINATION_LIST;
            }

            $scope.$parent.overlay_loadingNew = 'none';
        });
    };

    $scope.CUR_DOMINATION_LIST = [];
    $scope.GET_CURRENCY_DENOMINATION_FOR_FLOAT_CASH = function () {

        var CashupModelObj = new Object();
        CashupModelObj.BRANCH_ID = $scope.$parent.CASHUP.BRANCH_ID;
        CashupModelObj.CURRENCY_ID = 0;  //$scope.CURRENCY_ID != 0 ? $scope.CURRENCY_ID:0;       
        CashupModelObj.DECLARATION_TYPE_ID = 1;
        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_CURRENCY_DENOMINATION_FOR_FLOAT_CASH').then(function (data) {
            debugger;
            if (data.data.Table != null && data.data.Table.length > 0) {

                angular.forEach(data.data.Table, function (DVAL) {
                    var temp = null;
                    temp = { DECLARATION_MASTER_ID: DVAL.DECLARATION_MASTER_ID, DECLARATION_TYPE_ID: DVAL.DECLARATION_TYPE_ID, IS_PRECISION: DVAL.IS_PRECISION, MULTIPLICATION_FACTOR: DVAL.MULTIPLICATION_FACTOR, PRECISION_SYMBOL: DVAL.PRECISION_SYMBOL, SYMBOL: DVAL.SYMBOL, VALUE: DVAL.VALUE, QUANTITY: 0, CUSTOM_CURRENCY_AMOUNT: 0, CASHUP_HEADER_ID: $scope.$parent.CASHUP.ID, ACTIVE: true, CREATED_BY: null, CREATED_DATE: new Date(), MODIFIED_BY: null, MODIFIED_DATE: new Date(), BRANCH_CURRENCY_AMOUNT: 0, CUSTOM_TO_BRANCH_CONVERSION_RATE: 0 };
                    $scope.CUR_DOMINATION_LIST.push(temp);
                })

            }
            $scope.GET_FLOAT_DECLARATION();
            // $scope.$parent.overlay_loadingNew = 'none';
        });
    };
    $scope.GET_CURRENCY_DENOMINATION_FOR_FLOAT_CASH();
    ////////////////////////Comment Code////////////////////////////////////////////////
    $scope.FLOAT_NOTE_LIST = [];
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
                $scope.FLOAT_NOTE_LIST = data.data.Table;
            };
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
        if ($scope.$parent.CASHUP.FLOAT_NOTES != undefined && $scope.$parent.CASHUP.FLOAT_NOTES != null && $scope.$parent.CASHUP.FLOAT_NOTES != "" || LINE != undefined && LINE != null && LINE != "") {
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
                CashupModelObj.NOTE = $scope.$parent.CASHUP.FLOAT_NOTES;
            }
            CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.CASHUP_API(CashupModelObj, 'INS_UPD_CASHUP_HEADER_NOTES').then(function (data) {
                $scope.$parent.CASHUP.FLOAT_NOTES = "";
                $scope.GET_CASHUP_HEADER_NOTES();
            });
        }
    }
    //////////////////////// END Comment Code////////////////////////////////////////////////

    $scope.init_decleration_details = function (declaration) {
        declaration.QUANTITY == 0 ? declaration.QUANTITY = null : '';
    };
    $scope.InsertDeclerationDetails = function (DECLARATION_TYPE_ID) {
        //$scope.DECLERATION_MASTER.filter(function (x) {
        //    if (x.CUSTOM_CURRENCY_AMOUNT > 0 || x.CUSTOM_CURRENCY_AMOUNT == 0) {
        //        x.CUSTOM_CURRENCY_AMOUNT = '' + x.CUSTOM_CURRENCY_AMOUNT;
        //        $scope.$parent.CASHUP.TOTAL_FLOAT += x.CUSTOM_CURRENCY_AMOUNT;
        //    }
        //});
        $scope.DECLERATION_MASTER.filter(function (x) {
            if (x.CUSTOM_TO_BRANCH_CONVERSION_RATE > 0 || x.CUSTOM_TO_BRANCH_CONVERSION_RATE == 0) {
                x.CUSTOM_TO_BRANCH_CONVERSION_RATE = '' + x.CUSTOM_TO_BRANCH_CONVERSION_RATE;
            }
            if (x.CUSTOM_CURRENCY_AMOUNT > 0 || x.CUSTOM_CURRENCY_AMOUNT == 0) {
                x.CUSTOM_CURRENCY_AMOUNT = '' + x.CUSTOM_CURRENCY_AMOUNT;
            }
            if (x.BRANCH_CURRENCY_AMOUNT > 0 || x.BRANCH_CURRENCY_AMOUNT == 0) {
                x.BRANCH_CURRENCY_AMOUNT = '' + x.BRANCH_CURRENCY_AMOUNT;
            }
        });
        var CashupModelObj = new Object();
        CashupModelObj.ID = $scope.$parent.CASHUP.ID;
        CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
        CashupModelObj.TOTAL_FLOAT = $scope.$parent.CASHUP.TOTAL_FLOAT;
        CashupModelObj.TOTAL_CASH = $scope.$parent.CASHUP.TOTAL_CASH;
        //CashupModelObj.DECLARATION_DETAILS = $scope.$parent.CASHUP.DECLERATION_MASTER;
        CashupModelObj.DECLARATION_DETAILS = $scope.DECLERATION_MASTER;
        CashupModelObj.DECLARATION_TYPE_ID = DECLARATION_TYPE_ID;
        //CashupModelObj.STEP_NO = $scope.GetNextStep(); 
        CashupModelObj.STEP_NO = 2;
        CashupModelObj.NOTE_TABLE_ID = DECLARATION_TYPE_ID == 1 ? $scope.$parent.CASHUP.FLOAT_NOTES_ID : $scope.$parent.CASHUP.CASH_NOTES_ID;
        CashupModelObj.NOTE_TYPE_ID = DECLARATION_TYPE_ID;
        CashupModelObj.NOTE = DECLARATION_TYPE_ID == 1 ? $scope.$parent.CASHUP.FLOAT_NOTES : $scope.$parent.CASHUP.CASH_NOTES;
        PrcCommMethods.CASHUP_API(CashupModelObj, 'INS_DECLERATION_DETAILS').then(function (data) {
            //if (data != undefined && data.data != undefined) {
            //    if ($scope.CASHUP.FLOAT_NOTES_ID == 0) {
            //        $scope.CASHUP.FLOAT_NOTES_ID = data.data;
            //    }
            //} else {
            //    $scope.CASHUP.FLOAT_NOTES_ID = 0;
            //}
            // if ($scope.$parent.CASHUP != undefined) {
            //   $scope.$parent.CASHUP.FLOAT_NOTES = "";
            //  }
            if ($scope.CASHUP.KeyColor == "Float") {
                $scope.GET_FLOAT_DECLARATION();
            }
        });
    };


    $scope.NextLink = function (val) {
        $scope.TabValid = false;
        $scope.$parent.$parent.KeyColor = "Float";
        $scope.InsertDeclerationDetails(1);
        if ($scope.$parent.CASHUP.TABLIST[2].FLAG == 1) {
            $location.path("Cash").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
        } else if ($scope.$parent.CASHUP.TABLIST[3].FLAG == 1) {
            $location.path("Cards").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
        } else if ($scope.$parent.CASHUP.TABLIST[4].FLAG == 1) {
            $location.path("PtyCash").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
        } else if ($scope.$parent.CASHUP.TABLIST[5].FLAG == 1) {
            $location.path("Delivery").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
        } else if ($scope.$parent.CASHUP.TABLIST[6].FLAG == 1) {
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
        $scope.InsertDeclerationDetails(1);
        $location.path("CEN").search({ CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
    }
    $scope.$on('$destroy', function () {
        debugger;
        if ($scope.TabValid) {
            if ($scope.$parent.CASHUP.FG == null) {
                if ($scope.$parent.CASHUP.PettyCashValid == false && $scope.$parent.CASHUP.CompValid == false && $scope.$parent.CASHUP.AUTOVALIDDEPOSITE == false && $scope.$parent.CASHUP.AUTOVALIDVOUCHER == false) {
                    //  if ($scope.$parent.CASHUP.PettyCashValid == false && $scope.$parent.CASHUP.CompValid == false && $scope.$parent.CASHUP.AUTOVALIDDEPOSITE == false && $scope.$parent.CASHUP.AUTOVALIDVOUCHER == false && $scope.$parent.CASHUP.TAB_CLICK == false) {
                    $scope.InsertDeclerationDetails(1);
                }
            }

        }
    });
    $scope.NextLink_View = function (val) {
        $scope.TabValid = false;
        $scope.$parent.$parent.KeyColor = "Float";
        //  $scope.InsertDeclerationDetails(1);
        if ($scope.$parent.CASHUP.TABLIST[2].FLAG == 1) {
            $location.path("Cash_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
        } else if ($scope.$parent.CASHUP.TABLIST[3].FLAG == 1) {
            $location.path("Cards_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
        } else if ($scope.$parent.CASHUP.TABLIST[4].FLAG == 1) {
            $location.path("PtyCash_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
        } else if ($scope.$parent.CASHUP.TABLIST[5].FLAG == 1) {
            $location.path("Delivery_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
        } else if ($scope.$parent.CASHUP.TABLIST[6].FLAG == 1) {
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
        // $scope.InsertDeclerationDetails(1);
        $location.path("CEN_VIEW").search({ CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
    }

});