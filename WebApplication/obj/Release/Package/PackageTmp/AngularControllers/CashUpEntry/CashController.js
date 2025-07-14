app.controller('CashController', function ($scope, $http, $interval, CommService, $cookies, $filter, PrcCommMethods, $location, readFileData, readFileDataNew, $sce) {

    $scope.$parent.CASHUP.KeyColor = "Cash";
    $scope.$parent.CASHUP.ID = getUrlParameter('CHID', $location.absUrl());
    if ($scope.$parent.CASHUP.ACTUAL_STEP_NO <= 3) {
        $scope.$parent.CASHUP.ACTUAL_STEP_NO = 3;
    }
    $scope.TabValid = true;
    $scope.$parent.overlay_loadingNew = 'block';
    $scope.DECLARATION_TYPE_ID = 1;
    $scope.NOTE_TYPE_ID = 2;
    $scope.SETTING_MINTS = $scope.$parent.GET_ENTITY_SETTINGS(27)[0].SETTING_VALUE;
    $scope.$parent.CASHUP.CASH_NOTES = "";
    $scope.CASH_NOTE_LIST = [];
    $scope.CURRENCY_ID = 0;
    $scope.SELECT_CURRENCY_MAIN = [];
    $scope.BASE_CURRENCY = null;
    $scope.BY_DEFAULT_CURRENCT_TOTAL = 0;

    

    // program to display a text using setTimeout method
    function LOAD() {
        $scope.$parent.overlay_loadingNew = 'none';
    }


    $scope.GET_CURRENCY_FOR_FLOAT_CASH_TAB = function () {
        var CashupModelObj = new Object();
        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_CURRENCY_FOR_FLOAT_CASH_TAB').then(function (data) {

            if (data.data.Table != null && data.data.Table.length > 0) {
                $scope.CURRENCY_LIST = data.data.Table;
                angular.forEach($scope.CURRENCY_LIST, function (Cval) {
                    Cval.IS_CHECKED = false;
                    Cval.FLAG = false;
                })
                $scope.GET_CASH_DECLARATION();
            }
        });
    };
    $scope.GET_CURRENCY_FOR_FLOAT_CASH_TAB();
    // $scope.SELECT_CURRENCY_MAIN.DECLERATION_MASTER = [];
    $scope.GET_CASH_DECLARATION = function () {
        var temp = 0;
        temp = $scope.$parent.CASHUP.TOTAL_CASH_MAIN;
        var CashupModelObj = new Object();
        CashupModelObj.ID = $scope.$parent.CASHUP.ID;
        CashupModelObj.DECLARATION_TYPE_ID = 2;
        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_FLOAT_CASH_DECLARATION').then(function (data) {

            $scope.$parent.CASHUP.TOTAL_CASH_MAIN = temp;
            if (data.data.Table != null && data.data.Table.length > 0) {
                //  angular.forEach(data.data.Table, function (VAL) {
                //for (var i = 0; i < $scope.SELECT_CURRENCY_MAIN.length; i++) {
                //    for (var j = 0; j < $scope.SELECT_CURRENCY_MAIN[i].DECLERATION_MASTER.length; j++) {
                //        for (var k = 0; k < data.data.Table.length; k++) {
                //            if (data.data.Table[k].DECLARATION_MASTER_ID == $scope.SELECT_CURRENCY_MAIN[i].DECLERATION_MASTER[j].DECLARATION_MASTER_ID && data.data.Table[k].CUSTOM_CURRENCY_AMOUNT != 0) {
                //                //$scope.SELECT_CURRENCY_MAIN[i].DECLERATION_MASTER[j].CUSTOM_CURRENCY_AMOUNT = data.data.Table[k].CUSTOM_CURRENCY_AMOUNT;
                //                //$scope.SELECT_CURRENCY_MAIN[i].DECLERATION_MASTER[j].BRANCH_CURRENCY_AMOUNT = data.data.Table[k].BRANCH_CURRENCY_AMOUNT;
                //                //$scope.SELECT_CURRENCY_MAIN[i].DECLERATION_MASTER[j].CUSTOM_TO_BRANCH_CONVERSION_RATE = data.data.Table[k].CUSTOM_TO_BRANCH_CONVERSION_RATE;
                //                //$scope.SELECT_CURRENCY_MAIN[i].DECLERATION_MASTER[j].QUANTITY = data.data.Table[k].QUANTITY;
                //                $scope.SELECT_CURRENCY_MAIN[i].DECLERATION_MASTER[j] = data.data.Table[k];
                //                break;
                //            }

                //        }

                //    }
                //}
                // })
                angular.forEach($scope.CURRENCY_LIST, function (CUR) {
                    if (data.data.Table1[0].CURRENCY_ID == CUR.CURRENCY_ID) {
                        CUR.IS_CHECKED = true;
                        CUR.FLAG = true;
                        $scope.GET_FLOT_CASH_CONVERSION_RATE(CUR, data.data.Table, data.data.Table1[0].CURRENCY_ID, 1);
                        $scope.BASE_CURRENCY = CUR.SYMBOL + ":" + CUR.CURRENCY_CODE + ":" + CUR.CURRENCY_NAME + ":" + CUR.PRECISION_SYMBOL + ":" + CUR.CURRENCY_ID;
                    }
                });

                //var currencyids = $filter('unique')(data.data.Table.filter(function (x) { return x.CURRENCY_ID != data.data.Table1[0].CURRENCY_ID }), 'CURRENCY_ID');
                //currencyids.filter(function (x) {
                //    angular.forEach($scope.CURRENCY_LIST, function (CUR) {
                //        if (x.CURRENCY_ID == CUR.CURRENCY_ID) {
                //            CUR.IS_CHECKED = true;
                //            CUR.FLAG = false;
                //            $scope.GET_FLOT_CASH_CONVERSION_RATE(CUR, data.data.Table);
                //        }
                //    });
                //});

                //angular.forEach($scope.CURRENCY_LIST, function (CUR) {
                //    if ((CUR.CURRENCY_ID == 3 || CUR.CURRENCY_ID == 5 || CUR.CURRENCY_ID == 6) && CUR.IS_CHECKED == true) {
                //        $scope.CUSTOM_CURRENCY_SET.push(CUR);
                //    }
                //});



            }
            else {
                $scope.GET_CURRENCY_DENOMINATION_FOR_FLOAT_CASH(0);
            }

         

        });
    };
    $scope.BindSecondaryCurrency = function (DECLERATION_DATA, SITE_CURRENCY_ID) {
        var currencyids = $filter('unique')(DECLERATION_DATA.filter(function (x) { return x.CURRENCY_ID != SITE_CURRENCY_ID }), 'CURRENCY_ID');
        currencyids.filter(function (x) {
            angular.forEach($scope.CURRENCY_LIST, function (CUR) {
                if (x.CURRENCY_ID == CUR.CURRENCY_ID) {
                    CUR.IS_CHECKED = true;
                    CUR.FLAG = false;
                    $scope.GET_FLOT_CASH_CONVERSION_RATE(CUR, DECLERATION_DATA, SITE_CURRENCY_ID, 1);
                }
            });
        });
    }
    $scope.GET_CURRENCY_DENOMINATION_FOR_FLOAT_CASH = function (CID, DECLERATION_DATA, SITE_CURRENCY_ID, FLAG) {

        var CashupModelObj = new Object();
        CashupModelObj.BRANCH_ID = $scope.$parent.CASHUP.BRANCH_ID;
        CashupModelObj.CURRENCY_ID = CID == 0 || CID == undefined ? 0 : CID.CURRENCY_ID;  //$scope.CURRENCY_ID != 0 ? $scope.CURRENCY_ID:0;       
        CashupModelObj.DECLARATION_TYPE_ID = 2;
        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_CURRENCY_DENOMINATION_FOR_FLOAT_CASH').then(function (data) {

            if (data.data.Table != null && data.data.Table.length > 0) {
                $scope.CUR_DOMINATION_LIST = [];
                angular.forEach(data.data.Table, function (DVAL) {
                    var temp = null;
                    temp = {
                        DECLARATION_MASTER_ID: DVAL.DECLARATION_MASTER_ID,
                        DECLARATION_TYPE_ID: DVAL.DECLARATION_TYPE_ID,
                        IS_PRECISION: DVAL.IS_PRECISION,
                        MULTIPLICATION_FACTOR: DVAL.MULTIPLICATION_FACTOR,
                        PRECISION_SYMBOL: DVAL.PRECISION_SYMBOL,
                        SYMBOL: DVAL.SYMBOL,
                        VALUE: DVAL.VALUE,
                        QUANTITY: 0,
                        CUSTOM_CURRENCY_AMOUNT: 0,
                        CASHUP_HEADER_ID: $scope.$parent.CASHUP.ID,
                        ACTIVE: true,
                        CREATED_BY: null,
                        CREATED_DATE: new Date(),
                        MODIFIED_BY: null,
                        MODIFIED_DATE: new Date(),
                        BRANCH_CURRENCY_AMOUNT: 0,
                        CUSTOM_TO_BRANCH_CONVERSION_RATE: 0
                    };
                    $scope.CUR_DOMINATION_LIST.push(temp);
                });
                var READONLY = new Object();
                //READONLY.DECLERATION_MASTER = [];
                READONLY.DECLERATION_MASTER = $scope.CUR_DOMINATION_LIST;

                if (CID == 0) {
                    angular.forEach($scope.CURRENCY_LIST, function (DLIST) {
                        if (DLIST.SYMBOL == $scope.CUR_DOMINATION_LIST[0].SYMBOL) {
                            DLIST.FLAG = true;
                            DLIST.IS_CHECKED = true;
                            $scope.CUSTOM_CURRENCY_SET.push(DLIST);
                            $scope.BASE_CURRENCY = DLIST.SYMBOL + ":" + DLIST.CURRENCY_CODE + ":" + DLIST.CURRENCY_NAME + ":" + DLIST.PRECISION_SYMBOL + ":" + DLIST.CURRENCY_ID;

                        }
                    });
                    for (var i = 0; i < $scope.CUSTOM_CURRENCY_SET.length; i++) {
                        if ($scope.CUSTOM_CURRENCY_SET[i].FLAG == true && $scope.CUSTOM_CURRENCY_SET[i].IS_CHECKED == true) {
                            READONLY.CURRENCY_ID = $scope.CUSTOM_CURRENCY_SET[i].CURRENCY_ID;
                            READONLY.CURRENCY_CODE = $scope.CUSTOM_CURRENCY_SET[i].CURRENCY_CODE;
                            READONLY.CURRENCY_NAME = $scope.CUSTOM_CURRENCY_SET[i].CURRENCY_NAME;
                            READONLY.PRECISION_SYMBOL = $scope.CUSTOM_CURRENCY_SET[i].PRECISION_SYMBOL;
                            READONLY.SYMBOL = $scope.CUSTOM_CURRENCY_SET[i].SYMBOL;
                            READONLY.CONVERSION_RATE = 0;
                            READONLY.TABLE_ID = 0;
                            READONLY.IS_CHECKED = true;
                            READONLY.FLAG = $scope.CUSTOM_CURRENCY_SET[i].FLAG;
                            READONLY.TOTAL_CASH = 0;
                            //READONLY.CURRENCY_ID = $scope.CUSTOM_CURRENCY_SET[i].CURRENCY_ID +";";
                            //READONLY.CURRENCY_CODE = $scope.CUSTOM_CURRENCY_SET[i].CURRENCY_CODE + ";";
                            //READONLY.CURRENCY_NAME = $scope.CUSTOM_CURRENCY_SET[i].CURRENCY_NAME + ";";
                            //READONLY.PRECISION_SYMBOL = $scope.CUSTOM_CURRENCY_SET[i].PRECISION_SYMBOL + ";";
                            //READONLY.SYMBOL = $scope.CUSTOM_CURRENCY_SET[i].SYMBOL + ";";
                            //READONLY.CONVERSION_RATE = 0 + ";";
                            //READONLY.IS_CHECKED = true + ";";
                            //READONLY.NAME = "XYZ";
                            break;
                        }

                    }
                    //READONLY.DECLERATION_MASTER = [];
                    //READONLY.DECLERATION_MASTER = $scope.CUR_DOMINATION_LIST;
                    //$scope.SELECT_CURRENCY_MAIN.push(READONLY);
                }
                if (CID != 0) {
                    // for (var i = 0; i < $scope.CUSTOM_CURRENCY_SET.length; i++) {
                    //        if ($scope.CUSTOM_CURRENCY_SET[i].CURRENCY_ID == CID.CURRENCY_ID) {


                    READONLY.CURRENCY_ID = CID.CURRENCY_ID;
                    READONLY.CURRENCY_CODE = CID.CURRENCY_CODE;
                    READONLY.CURRENCY_NAME = CID.CURRENCY_NAME;
                    READONLY.PRECISION_SYMBOL = CID.PRECISION_SYMBOL;
                    READONLY.SYMBOL = CID.SYMBOL;
                    READONLY.CONVERSION_RATE = CID.CONVERSION_RATE;
                    READONLY.TABLE_ID = CID.TABLE_ID;
                    READONLY.IS_CHECKED = CID.IS_CHECKED;
                    READONLY.FLAG = CID.FLAG;
                    READONLY.TOTAL_CASH = 0;
                    if (DECLERATION_DATA != undefined) {

                        for (var j = 0; j < READONLY.DECLERATION_MASTER.length; j++) {
                            for (var k = 0; k < DECLERATION_DATA.length; k++) {
                                if (DECLERATION_DATA[k].DECLARATION_MASTER_ID == READONLY.DECLERATION_MASTER[j].DECLARATION_MASTER_ID && DECLERATION_DATA[k].CUSTOM_CURRENCY_AMOUNT != 0) {
                                    READONLY.DECLERATION_MASTER[j] = DECLERATION_DATA[k];
                                    break;
                                }

                            }


                        }
                    }
                }


                if ($scope.SELECT_CURRENCY_MAIN.filter(function (x) { return x.CURRENCY_ID == READONLY.CURRENCY_ID }).length == 0) {
                    $scope.SELECT_CURRENCY_MAIN.push(READONLY);
                    if (FLAG == 1) {
                        $scope.BindSecondaryCurrency(DECLERATION_DATA, SITE_CURRENCY_ID);
                    }                
                    //$scope.$parent.overlay_loadingNew = 'none';
                    setTimeout(LOAD, 2000);
                }
               
            }
            //   $scope.GET_CASH_DECLARATION();
           
        });
    };


    $scope.GET_FLOT_CASH_CONVERSION_RATE = function (CUR, DECLERATION_DATA, SITE_CURRENCY_ID, FLAG) {
        var CashupModelObj = new Object();
        CashupModelObj.BRANCH_ID = $scope.$parent.CASHUP.BRANCH_ID;
        CashupModelObj.CURRENCY_ID = CUR.CURRENCY_ID;
        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_FLOT_CASH_CONVERSION_RATE').then(function (data) {

            $scope.CONVERSION_RATE = 0;
            if (FLAG == 1) {
                for (var i = 0; i < DECLERATION_DATA.length; i++) {
                    if (CUR.CURRENCY_ID == DECLERATION_DATA[i].CURRENCY_ID && DECLERATION_DATA[i].CUSTOM_CURRENCY_AMOUNT!=null) {
                        CUR.CONVERSION_RATE = DECLERATION_DATA[i].CUSTOM_TO_BRANCH_CONVERSION_RATE;
                        CUR.TABLE_ID =0;
                        break;
                    }
                }              
            } else {
                if (data.data.Table != null && data.data.Table.length > 0) {
                    CUR.CONVERSION_RATE = data.data.Table[0].CONVERSION_RATE;
                    CUR.TABLE_ID = data.data.Table[0].TABLE_ID;
                }
            }
            //if (data.data.Table != null && data.data.Table.length > 0) {
            //        CUR.CONVERSION_RATE = data.data.Table[0].CONVERSION_RATE;
            //        CUR.TABLE_ID = data.data.Table[0].TABLE_ID;
            //    }
            if (CUR.IS_CHECKED) {
                $scope.GET_CURRENCY_DENOMINATION_FOR_FLOAT_CASH(CUR, DECLERATION_DATA, SITE_CURRENCY_ID, FLAG);
            } else {
                for (var i = 0; i < $scope.SELECT_CURRENCY_MAIN.length; i++) {
                    if ($scope.SELECT_CURRENCY_MAIN[i].CURRENCY_ID == CUR.CURRENCY_ID && CUR.IS_CHECKED == false) {
                        $scope.SELECT_CURRENCY_MAIN.splice(i, 1);
                    }
                }
                //$scope.$parent.overlay_loadingNew = 'none';
                setTimeout(LOAD, 2000);
            }
        });
    };

    $scope.CUSTOM_CURRENCY_SET = [];
    $scope.SET_CURRENCY = function (CUR) {

        //  if ($scope.CUSTOM_CURRENCY_SET.length > 0) {
        //   angular.forEach($scope.SELECT_CURRENCY, function (Cval) {
        var FLAG = false;
        for (var i = 0; i < $scope.SELECT_CURRENCY_MAIN.length; i++) {
            if ($scope.SELECT_CURRENCY_MAIN[i].CURRENCY_ID == CUR.CURRENCY_ID && CUR.IS_CHECKED == true) {
                $scope.SELECT_CURRENCY_MAIN[i].IS_CHECKED = false;
                $scope.SELECT_CURRENCY_MAIN.splice(i, 1);
                CUR.IS_CHECKED = false;
                FLAG = true;
                break;
            }
        }
        if (FLAG == false) {
            CUR.IS_CHECKED = true;
            $scope.GET_FLOT_CASH_CONVERSION_RATE(CUR, null, null, 0);
            //  $scope.SELECT_CURRENCY_MAIN.push(CUR);
            //$scope.SELECT_CURRENCY.push(CUR);
        }
        //  })
        //} else {
        //    CUR.IS_CHECKED = true;
        //    $scope.GET_FLOT_CASH_CONVERSION_RATE(CUR);
        //  //  $scope.SELECT_CURRENCY_MAIN.push(CUR);
        //    //$scope.SELECT_CURRENCY.push(CUR);
        //}
        //for (var i = 0; i < $scope.CUSTOM_CURRENCY_SET.length; i++) {
        // if ($scope.CUSTOM_CURRENCY_SET[i].CURRENCY_ID == CUR && $scope.CUSTOM_CURRENCY_SET[i].IS_CHECKED == true) {
        //READONLY.CURRENCY_ID = CUR.CURRENCY_ID;
        //READONLY.CURRENCY_CODE = CUR.CURRENCY_CODE;
        //READONLY.CURRENCY_NAME = CUR.CURRENCY_NAME;
        //READONLY.PRECISION_SYMBOL = CUR.PRECISION_SYMBOL;
        //READONLY.SYMBOL = CUR.SYMBOL;
        //}
        // }



    }
    $scope.INS_FLOT_CASH_CURRENCY_CONVERTER = function (VAL) {

        var CashupModelObj = new Object();
        CashupModelObj.TABLE_ID = VAL.TABLE_ID == undefined ? 0 : VAL.TABLE_ID;
        CashupModelObj.CURRENCY_ID = VAL.CURRENCY_ID;
        CashupModelObj.CONVERSION_RATE = VAL.CONVERSION_RATE;
        CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CashupModelObj.BRANCH_ID = $scope.$parent.CASHUP.BRANCH_ID;
        CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));

        PrcCommMethods.CASHUP_API(CashupModelObj, 'INS_FLOT_CASH_CURRENCY_CONVERTER').then(function (data) {

            if (data.data == 1 && data.data == 1) {               
                alert("Save successfully.");
            }

        });

    }
    //NEW INSERT
    $scope.InsertDeclerationDetails = function (DECLARATION_TYPE_ID) {

        //$scope.SELECT_CURRENCY_MAIN.filter(function (x) {
        //    x.DECLERATION_MASTER.filter(function (y) {
        //        if (y.CUSTOM_CURRENCY_AMOUNT > 0 ) {
        //            $scope.$parent.CASHUP.TOTAL_CASH =  y.CUSTOM_CURRENCY_AMOUNT;
        //        }
        //    });
        //});      
        var DECLARATION_LIST = [];
        var cnt = 0;
        //for (var i = 0; i < $scope.SELECT_CURRENCY_MAIN.length; i++) {
        //for (var j = 0; j < $scope.SELECT_CURRENCY_MAIN[i].DECLERATION_MASTER.length; j++) {
        angular.forEach($scope.SELECT_CURRENCY_MAIN, function (MVAL) {
            angular.forEach(MVAL.DECLERATION_MASTER, function (DVAL) {
                var cash_declared = new Object();
                cash_declared.DECLARATION_MASTER_ID = DVAL.DECLARATION_MASTER_ID;
                cash_declared.DECLARATION_TYPE_ID = DVAL.DECLARATION_TYPE_ID;
                cash_declared.QUANTITY = DVAL.QUANTITY;
                cash_declared.CUSTOM_CURRENCY_AMOUNT = DVAL.CUSTOM_CURRENCY_AMOUNT;
                cash_declared.ID = $scope.$parent.CASHUP.ID;
                cash_declared.USER_ID = parseInt($cookies.get("USERID"));
                cash_declared.BRANCH_CURRENCY_AMOUNT = DVAL.BRANCH_CURRENCY_AMOUNT;
                cash_declared.CUSTOM_TO_BRANCH_CONVERSION_RATE = MVAL.CONVERSION_RATE;
                DECLARATION_LIST[cnt] = cash_declared;
                cnt++;
            })
        })
        DECLARATION_LIST.filter(function (x) {
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
        //   }
        // }
        //   { DECLARATION_MASTER_ID: DVAL.DECLARATION_MASTER_ID, DECLARATION_TYPE_ID: DVAL.DECLARATION_TYPE_ID, IS_PRECISION: DVAL.IS_PRECISION, MULTIPLICATION_FACTOR: DVAL.MULTIPLICATION_FACTOR, PRECISION_SYMBOL: DVAL.PRECISION_SYMBOL, SYMBOL: DVAL.SYMBOL, VALUE: DVAL.VALUE, QUANTITY: 0, CUSTOM_CURRENCY_AMOUNT: 0, CASHUP_HEADER_ID: $scope.$parent.CASHUP.ID, ACTIVE: true, CREATED_BY: null, CREATED_DATE: new Date(), MODIFIED_BY: null, MODIFIED_DATE: new Date(), BRANCH_CURRENCY_AMOUNT: 0, CUSTOM_TO_BRANCH_CONVERSION_RATE: 0 };
        //CashupModelObj.NOTE_TABLE_ID = DECLARATION_TYPE_ID == 1 ? $scope.$parent.CASHUP.CASH_NOTES_ID : $scope.$parent.CASHUP.CASH_NOTES_ID;
        //CashupModelObj.NOTE_TYPE_ID = DECLARATION_TYPE_ID;
        //CashupModelObj.NOTE = DECLARATION_TYPE_ID == 1 ? $scope.$parent.CASHUP.CASH_NOTES : $scope.$parent.CASHUP.CASH_NOTES;

        var CashupModelObj = new Object();
        CashupModelObj.ID = $scope.$parent.CASHUP.ID;
        CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
        CashupModelObj.TOTAL_FLOAT = $scope.$parent.CASHUP.TOTAL_FLOAT;
        CashupModelObj.TOTAL_CASH = $scope.$parent.CASHUP.TOTAL_CASH + $scope.BY_DEFAULT_CURRENCT_TOTAL;
        CashupModelObj.DECLARATION_TYPE_ID = DECLARATION_TYPE_ID;
        CashupModelObj.DECLARATION_DETAILS = DECLARATION_LIST;
        CashupModelObj.STEP_NO = 3;
        CashupModelObj.CASH_TIPS = $scope.$parent.CASHUP.CASH_TIPS;


        PrcCommMethods.CASHUP_API(CashupModelObj, 'INS_DECLERATION_DETAILS').then(function (data) {

            if (data != undefined && data.data != undefined) {
                if ($scope.CASHUP.CASH_NOTES_ID == 0) {
                    $scope.CASHUP.CASH_NOTES_ID = data.data;
                }
            } else {
                $scope.CASHUP.CASH_NOTES_ID = 0;
            }
            if ($scope.CASHUP.KeyColor == "Cash") {
                $scope.GET_CASH_DECLARATION();
            }
        });
    };
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
                $scope.CASH_NOTE_LIST = data.data.Table;
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
        if ($scope.$parent.CASHUP.CASH_NOTES != undefined && $scope.$parent.CASHUP.CASH_NOTES != null && $scope.$parent.CASHUP.CASH_NOTES != "" || LINE != undefined && LINE != null && LINE != "") {
            var CashupModelObj = new Object();
            CashupModelObj.NOTE_TYPE_ID = $scope.NOTE_TYPE_ID;
            CashupModelObj.ID = $scope.$parent.CASHUP.ID;//CASHUP_HEADER_ID
            CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
            if (LINE != undefined) {
                CashupModelObj.NOTE_TABLE_ID = LINE.TABLE_ID;
                CashupModelObj.NOTE = LINE.NOTE;
                LINE.IS_EDIT = false;
            }
            else {
                CashupModelObj.NOTE_TABLE_ID = 0;
                CashupModelObj.NOTE = $scope.$parent.CASHUP.CASH_NOTES;
            }


            PrcCommMethods.CASHUP_API(CashupModelObj, 'INS_UPD_CASHUP_HEADER_NOTES').then(function (data) {
                $scope.$parent.CASHUP.CASH_NOTES = "";
                $scope.GET_CASHUP_HEADER_NOTES();
            });
        }
    }
    //////////////////////// END Comment Code////////////////////////////////////////////////

    $scope.init_decleration_details = function (declaration, val) {
        declaration.QUANTITY == 0 ? declaration.QUANTITY = null : '';
        val.CONVERSION_RATE == undefined || val.CONVERSION_RATE == null || val.CONVERSION_RATE == "" ? val.CONVERSION_RATE = (val.FLAG == true ? 1 : 0) : '';
    };



    $scope.NextLink = function (val) {
        $scope.TabValid = false;
        $scope.KeyColor = val;
        $scope.InsertDeclerationDetails(2);
        if ($scope.$parent.CASHUP.TABLIST[3].FLAG == 1) {
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
        $scope.InsertDeclerationDetails(2);
        if ($scope.$parent.CASHUP.TABLIST[1].FLAG == 1) {
            $location.path("Float").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
        } else {
            $location.path("CEN").search({ CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
        }
    }
    $scope.$on('$destroy', function () {
        if ($scope.TabValid) {
            if ($scope.$parent.CASHUP.FG == null) {
                if ($scope.$parent.CASHUP.PettyCashValid == false && $scope.$parent.CASHUP.CompValid == false && $scope.$parent.CASHUP.AUTOVALIDDEPOSITE == false && $scope.$parent.CASHUP.AUTOVALIDVOUCHER == false) {
                    $scope.InsertDeclerationDetails(2);
                }
            }
        }
    });
    $scope.NextLink_View = function (val) {
        $scope.TabValid = false;
        $scope.KeyColor = val;
        // $scope.InsertDeclerationDetails(2);
        if ($scope.$parent.CASHUP.TABLIST[3].FLAG == 1) {
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
        // $scope.InsertDeclerationDetails(2);
        if ($scope.$parent.CASHUP.TABLIST[1].FLAG == 1) {
            $location.path("Float_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
        } else {
            $location.path("CEN_VIEW").search({ CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
        }
    }
});