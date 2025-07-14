app.controller('CashController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    if ($scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID == null || $scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID == undefined || $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_ID == null || $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_ID == undefined) {
        $location.path('CashUpApp_Entry');
        return;
    }
    $scope.$parent.REDIRECT_REGISTER_ENTRY = false;
    $scope.$parent.TAB_ID = 2;
    $scope.TAB_ID = 2;
    $scope.CASHUP_HEADER_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_ID; 
    $scope.CASHUP_MAIN_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_MAIN_ID;
    $scope.CASHUP_INFO = [];
    $scope.CASHUP_INFO.ACTUAL = $scope.$parent.CASHUP_HEADER_VALUES.CASH.ACTUAL;
    $scope.CASHUP_INFO.EPOS = $scope.$parent.CASHUP_HEADER_VALUES.CASH.EPOS;
    
    $scope.SHOW_CASH_TIPS_FLAG = true;
    $scope.CASHUP_ENTRY_NOTE = "";
    $scope.SELECT_CURRENCY_MAIN = [];
    $scope.CASH_TAB_NOTE_LIST = [];
    $scope.GET_CASHUP_HEADER_NOTES = function () {
        var CashupModelObj = new Object();
        CashupModelObj.NOTE_TYPE_ID = 2;
        CashupModelObj.CASHUP_HEADER_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_ID;
        PrcCommMethods.CASHUP_APP_API(CashupModelObj, 'GET_CASHUP_HEADER_NOTES').then(function (data) {
            if (data.data.Table != null && data.data.Table.length > 0) {
                $scope.CASH_TAB_NOTE_LIST = data.data.Table.map(function (item) {
                    item.isEditable = false;
                    return item;
                });;
            }
        });
    };
    $scope.CASH_TIPS_LIST = [];
    $scope.GET_CASHUP_CASH_TIPS = function () {
        var CashupModelObj = new Object();
        CashupModelObj.CASHUP_HEADER_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_ID;
        PrcCommMethods.CASHUP_APP_API(CashupModelObj, 'GET_CASHUP_CASH_TIPS').then(function (data) {
            if (data.data.Table != null && data.data.Table.length > 0) {
                $scope.CASH_TIPS_LIST = data.data.Table;
                
            }
            $scope.GET_CASH_DECLARATION();
        });
    };
    
    $scope.GET_CURRENCY_FOR_FLOAT_CASH_TAB = function () {
        var CashupModelObj = new Object();
        PrcCommMethods.CASHUP_APP_API(CashupModelObj, 'GET_CURRENCY_FOR_FLOAT_CASH_TAB').then(function (data) {

            if (data.data.Table != null && data.data.Table.length > 0) {
                $scope.CURRENCY_LIST = data.data.Table;
                angular.forEach($scope.CURRENCY_LIST, function (Cval) {
                    Cval.IS_CHECKED = false;
                    Cval.FLAG = false;
                })
                $scope.GET_CASHUP_CASH_TIPS();
                
            }
        });
    };
    $scope.BASE_CURRENCY_CODE = $cookies.get("CURRENCY_CODE");
    $scope.BASE_CURRENCY_ID = $cookies.get("CURRENCY_ID");

    $scope.GET_CURRENCY_FOR_FLOAT_CASH_TAB();
    $scope.GET_CASHUP_HEADER_NOTES(2);

    $scope.GET_CASH_DECLARATION = function () {
        var CashupModelObj = new Object();
        CashupModelObj.CASHUP_HEADER_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_ID;
        //CashupModelObj.CASHUP_HEADER_ID = $scope.CASHUP_HEADER_ID;
        CashupModelObj.DECLARATION_TYPE_ID = 2;
        PrcCommMethods.CASHUP_APP_API(CashupModelObj, 'GET_CASHUP_CASH').then(function (data) {
            if (data.data.Table != null && data.data.Table.length > 0) {
                angular.forEach($scope.CURRENCY_LIST, function (CUR) {
                    if (data.data.Table1[0].CURRENCY_ID == CUR.CURRENCY_ID) {
                        CUR.IS_CHECKED = true;
                        CUR.FLAG = true;
                        $scope.GET_FLOT_CASH_CONVERSION_RATE(CUR, data.data.Table, data.data.Table1[0].CURRENCY_ID, 1);
                        $scope.BASE_CURRENCY = CUR.SYMBOL + ":" + CUR.CURRENCY_CODE + ":" + CUR.CURRENCY_NAME + ":" + CUR.PRECISION_SYMBOL + ":" + CUR.CURRENCY_ID;
                    }
                });
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
    };

    $scope.GET_CURRENCY_DENOMINATION_FOR_FLOAT_CASH = function (CID, DECLERATION_DATA, SITE_CURRENCY_ID, FLAG) {
        var CashupModelObj = new Object();
        CashupModelObj.BRANCH_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID;
        CashupModelObj.CURRENCY_ID = CID == 0 || CID == undefined ? 0 : CID.CURRENCY_ID;  //$scope.CURRENCY_ID != 0 ? $scope.CURRENCY_ID:0;       
        CashupModelObj.DECLARATION_TYPE_ID = 2;
        PrcCommMethods.CASHUP_APP_API(CashupModelObj, 'GET_CURRENCY_DENOMINATION_FOR_FLOAT_CASH').then(function (data) {

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
                        CASHUP_HEADER_ID: $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_ID, //$scope.CASHUP_HEADER_ID,
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
                            break;
                        }
                    }
                }
                if (CID != 0) {
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
                if ($scope.CASH_TIPS_LIST.length > 0) {
                    angular.forEach($scope.CASH_TIPS_LIST, function (CASH_TIP) {
                        if (READONLY.CURRENCY_ID == CASH_TIP.CURRENCY_ID) {
                            READONLY.CASHUP_CASH_TIP_ID = CASH_TIP.CASHUP_CASH_TIP_ID;
                            READONLY.CASHUP_CASH_TIPS = CASH_TIP.CASH_TIPS;
                        }
                    })
                }
                if ($scope.SELECT_CURRENCY_MAIN.filter(function (x) { return x.CURRENCY_ID == READONLY.CURRENCY_ID }).length == 0) {
                    $scope.SELECT_CURRENCY_MAIN.push(READONLY);
                    if (FLAG == 1) {
                        $scope.BindSecondaryCurrency(DECLERATION_DATA, SITE_CURRENCY_ID);
                    }
                    
                }
                
            }

        });
    };

    $scope.GET_FLOT_CASH_CONVERSION_RATE = function (CUR, DECLERATION_DATA, SITE_CURRENCY_ID, FLAG) {
        var CashupModelObj = new Object();
        CashupModelObj.BRANCH_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID;
        CashupModelObj.CURRENCY_ID = CUR.CURRENCY_ID;
        PrcCommMethods.CASHUP_APP_API(CashupModelObj, 'GET_FLOT_CASH_CONVERSION_RATE').then(function (data) {

            $scope.CONVERSION_RATE = 0;
            //if (FLAG == 1) {
            //    for (var i = 0; i < DECLERATION_DATA.length; i++) {
            //        if (CUR.CURRENCY_ID == DECLERATION_DATA[i].CURRENCY_ID && DECLERATION_DATA[i].CUSTOM_CURRENCY_AMOUNT != null) {
            //            CUR.CONVERSION_RATE = DECLERATION_DATA[i].CUSTOM_TO_BRANCH_CONVERSION_RATE;
            //            CUR.TABLE_ID = 0;
            //            break;
            //        }
            //    }
            //} else {
            //    if (data.data.Table != null && data.data.Table.length > 0) {
            //        CUR.CONVERSION_RATE = data.data.Table[0].CONVERSION_RATE;
            //        CUR.TABLE_ID = data.data.Table[0].TABLE_ID;
            //    }
            //}
            if (data.data.Table != null && data.data.Table.length > 0) {
                CUR.CONVERSION_RATE = data.data.Table[0].CONVERSION_RATE;
                CUR.TABLE_ID = data.data.Table[0].TABLE_ID;
            }

            if (CUR.IS_CHECKED) {
                $scope.GET_CURRENCY_DENOMINATION_FOR_FLOAT_CASH(CUR, DECLERATION_DATA, SITE_CURRENCY_ID, FLAG);
            } else {
                for (var i = 0; i < $scope.SELECT_CURRENCY_MAIN.length; i++) {
                    if ($scope.SELECT_CURRENCY_MAIN[i].CURRENCY_ID == CUR.CURRENCY_ID && CUR.IS_CHECKED == false) {
                        $scope.SELECT_CURRENCY_MAIN.splice(i, 1);
                    }
                }
            }
        });
    };
    $scope.CUSTOM_CURRENCY_SET = [];
    $scope.SET_CURRENCY = function (CUR) {
        var FLAG = false;
        for (var i = 0; i < $scope.SELECT_CURRENCY_MAIN.length; i++) {
            if ($scope.SELECT_CURRENCY_MAIN[i].CURRENCY_ID == CUR.CURRENCY_ID && CUR.IS_CHECKED == true) {
                $scope.SELECT_CURRENCY_MAIN[i].IS_CHECKED = false;
                //$scope.INS_UPD_CASHUP_CASH();
                $scope.SELECT_CURRENCY_MAIN.splice(i, 1);
                CUR.IS_CHECKED = false;
                FLAG = true;
                break;
            }
        }
        if (FLAG == false) {
            CUR.IS_CHECKED = true;
            $scope.GET_FLOT_CASH_CONVERSION_RATE(CUR, null, null, 0);
        }
        
    };
    

    $scope.init_decleration_details = function (declaration, val) {
        declaration.QUANTITY == 0 ? declaration.QUANTITY = null : '';
        val.CONVERSION_RATE == undefined || val.CONVERSION_RATE == null || val.CONVERSION_RATE == "" ? val.CONVERSION_RATE = (val.FLAG == true ? 1 : 0) : '';
    };
    /*
    $scope.INIT_CHECKED_STATE = function () {
        angular.forEach($scope.CURRENCY_LIST, function (CUR) {
            var selectedCurrency = $scope.SELECT_CURRENCY_MAIN.find(function (currency) {
                return currency.CURRENCY_CODE === CUR.CURRENCY_CODE;
            });

            if (selectedCurrency) {
                CUR.IS_CHECKED = selectedCurrency.IS_CHECKED;
            }
        });
    };
    */
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
    $scope.EDIT_COMMENT = function (COMMENT) {
        COMMENT.isEditable = true;
    }
    $scope.DELETE_COMMENT = function (COMMENT) {
        COMMENT.isEditable = true;
        COMMENT.DELETE_NOTE = 1;
        $scope.INS_UPD_CASHUP_HEADER_NOTES(COMMENT);
    }
    $scope.SAVE_DATA = function (isDraft) {
        angular.forEach($scope.SELECT_CURRENCY_MAIN, function (VAL) {
            $scope.INS_UPD_CASHUP_CASH_TIPS(VAL);
            $scope.INS_FLOT_CASH_CURRENCY_CONVERTER(VAL);
        });
        $scope.INS_UPD_CASHUP_CASH(isDraft);
    };
    $scope.CONTINUE = function () {
        if ($scope.CASHUP_ENTRY_SEARCH.IS_DATA_ENTRY_ENABLED == true) {
            if (!isNaN(parseFloat($scope.CASHUP_INFO.ACTUAL) - parseFloat($scope.CASHUP_INFO.EPOS))) {
                if (parseFloat($scope.CASHUP_INFO.ACTUAL) - parseFloat($scope.CASHUP_INFO.EPOS) != 0) {
                    var myModal = new bootstrap.Modal(document.getElementById('proceed'), {
                        keyboard: false  // Optional: Close modal when pressing ESC
                    });
                    // Show the modal
                    myModal.show();
                }
                else {
                    $scope.SAVE_DATA(1);
                }
            }
            else {
                $scope.SAVE_DATA(1);
            }
        }
        else {
            $scope.Fn_Cashup_entry_TAB_CLICK($scope.TAB_ID, 1);
        }
        
    }
    $scope.PREVIOUS = function () {
        if ($scope.CASHUP_ENTRY_SEARCH.IS_DATA_ENTRY_ENABLED == true) {
            angular.forEach($scope.SELECT_CURRENCY_MAIN, function (VAL) {
                $scope.INS_UPD_CASHUP_CASH_TIPS(VAL);
                $scope.INS_FLOT_CASH_CURRENCY_CONVERTER(VAL);
            });
            $scope.INS_UPD_CASHUP_CASH(0, 1);
        }
        else {
            $scope.Fn_Cashup_entry_TAB_CLICK($scope.TAB_ID, 0);
        }
    }
    function getUtcDate() {
        const now = new Date(); // Get the current date
        const year = now.getUTCFullYear(); // Get the UTC year
        const day = String(now.getUTCDate()).padStart(2, '0'); // Get the UTC day, padding with leading zero if needed
        const month = String(now.getUTCMonth() + 1).padStart(2, '0'); // Get the UTC month (month is zero-based, so add 1)

        return `${year}-${month}-${day}`; // Format as yyyy-dd-mm
    }

    $scope.currencyToCountry = {
        ILS: "PS", // Palestine
        SA: "SA", // Saudi Arabia
        INR: "IN", // India (Us)
        AED: "AE", // UAE (Where Dubai is located)
        USD: "US", // USA
        GBP: "GB", // UK
        EUR: "EU",
        KWD: "KW",
        SAR: "SA"
    };
    $scope.nginit_cash = function (SELECT_CURRENCY_MAIN) {
        $scope.SELECT_CURRENCY_READ = angular.copy(SELECT_CURRENCY_MAIN);
    }

    $scope.getFlagUrl = function (currencyCode) {

        const countryCode = $scope.currencyToCountry[currencyCode];
        if (countryCode) {
            return `https://flagcdn.com/w320/${countryCode.toLowerCase()}.png`;
        }
    };
    $scope.NOTE_INIT = function (LINE) {
        LINE.DELETE_NOTE = 0;
    }
    $scope.SHOW_CASH_TIPS = function () {
        if ($scope.SHOW_CASH_TIPS_FLAG == false) {
            $scope.SHOW_CASH_TIPS_FLAG = true;
        }
    }
    $scope.HIDE_CASH_TIPS = function () {
        if ($scope.SHOW_CASH_TIPS_FLAG == true) {
            $scope.SHOW_CASH_TIPS_FLAG = false;
        }
    }
    
    $scope.INS_FLOT_CASH_CURRENCY_CONVERTER = function (VAL,flag) {
        var CashupModelObj = new Object();
        CashupModelObj.TABLE_ID = VAL.TABLE_ID == undefined ? 0 : VAL.TABLE_ID;
        CashupModelObj.CURRENCY_ID = VAL.CURRENCY_ID;
        CashupModelObj.CONVERSION_RATE = VAL.CONVERSION_RATE;
        CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CashupModelObj.BRANCH_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID;
        CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));

        PrcCommMethods.CASHUP_APP_API(CashupModelObj, 'INS_FLOT_CASH_CURRENCY_CONVERTER').then(function (data) {
            if (flag == 1) {
                if (data.data > 0) {
                    var myModal = new bootstrap.Modal(document.getElementById('save_conversion_rate_success'), {
                        keyboard: false  // Optional: Close modal when pressing ESC
                    });
                    // Show the modal
                    myModal.show();
                }
                else {
                    var myModal = new bootstrap.Modal(document.getElementById('save_conversion_rate_failure'), {
                        keyboard: false  // Optional: Close modal when pressing ESC
                    });
                    // Show the modal
                    myModal.show();
                }
                $scope.INS_UPD_CASHUP_CASH(0);
            }
            
            
        });
    };
    $scope.INS_UPD_CASHUP_CASH_TIPS = function (VAL,flag) {
        var CashupAppModelObj = new Object();
        CashupAppModelObj.CASH_TIP_ID = ((VAL.CASHUP_CASH_TIP_ID == undefined) || (VAL.CASHUP_CASH_TIP_ID == null)) ? 0 : VAL.CASHUP_CASH_TIP_ID;
        CashupAppModelObj.CASHUP_HEADER_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_ID;
        //CashupAppModelObj.CASHUP_HEADER_ID = $scope.CASHUP_HEADER_ID;
        CashupAppModelObj.CURRENCY_ID = VAL.CURRENCY_ID;
        CashupAppModelObj.CASH_TIPS = ((VAL.CASHUP_CASH_TIPS == undefined) || (VAL.CASHUP_CASH_TIPS == null)) ? 0 : VAL.CASHUP_CASH_TIPS;
        CashupAppModelObj.ACTIVE = 1;
        CashupAppModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'INS_UPD_CASHUP_CASH_TIPS').then(function (data) {
            if (flag == 1) {
                if (data.data != 0) {
                    var myModal = new bootstrap.Modal(document.getElementById('save_cash_tips_success'), {
                        keyboard: false  // Optional: Close modal when pressing ESC
                    });
                    // Show the modal
                    myModal.show();
                }
                else {
                    var myModal = new bootstrap.Modal(document.getElementById('save_cash_tips_failure'), {
                        keyboard: false  // Optional: Close modal when pressing ESC
                    });
                    // Show the modal
                    myModal.show();
                }
            }
        });
    };
    $scope.INS_UPD_CASHUP_CASH = function (isDraft,isPrevious) {
        var CashupModelObj = new Object();
        CashupModelObj.CASHUP_HEADER_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_ID;
        //CashupModelObj.CASHUP_HEADER_ID = $scope.CASHUP_HEADER_ID;
        let totalCashSum = 0;
        let totalCashTipsSum = 0
        angular.forEach($scope.SELECT_CURRENCY_MAIN, function (item) {
            if (item.TOTAL_CASH != null) {
                totalCashSum += item.TOTAL_CASH;
            }
            if (item.CASHUP_CASH_TIPS != null) {
                totalCashTipsSum += item.CASHUP_CASH_TIPS * item.CONVERSION_RATE;
            }
        });

        CashupModelObj.TOTAL_CASH = totalCashSum;
        CashupModelObj.STEP_NO = 3;
        CashupModelObj.CASH_TIPS = totalCashTipsSum;
        CashupModelObj.IS_DRAFT = isDraft;
        var CASHUP_CASH_DECLARATION_DATA_LIST = [];

        var cnt = 0;
        angular.forEach($scope.SELECT_CURRENCY_MAIN, function (currency_table) {
            angular.forEach(currency_table.DECLERATION_MASTER, function (declaration) {
                var CASHUP_CASH_DECLARATION_DATA_Obj = new Object();
                CASHUP_CASH_DECLARATION_DATA_Obj.DECLARATION_MASTER_ID = declaration.DECLARATION_MASTER_ID;
                CASHUP_CASH_DECLARATION_DATA_Obj.QUANTITY = (declaration.QUANTITY == null || declaration.QUANTITY == "") ? 0 : parseFloat(declaration.QUANTITY) + '';
                CASHUP_CASH_DECLARATION_DATA_Obj.CUSTOM_CURRENCY_AMOUNT = (declaration.CUSTOM_CURRENCY_AMOUNT == null || declaration.CUSTOM_CURRENCY_AMOUNT == "") ? 0+'' : parseFloat(declaration.CUSTOM_CURRENCY_AMOUNT).toFixed(5)+'';
                CASHUP_CASH_DECLARATION_DATA_Obj.CASHUP_HEADER_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_ID;
                //CASHUP_CASH_DECLARATION_DATA_Obj.CASHUP_HEADER_ID = $scope.CASHUP_HEADER_ID;
                CASHUP_CASH_DECLARATION_DATA_Obj.ACTIVE = currency_table.IS_CHECKED==false?0:1;
                CASHUP_CASH_DECLARATION_DATA_Obj.CREATED_BY = parseInt($cookies.get("USERID"));
                CASHUP_CASH_DECLARATION_DATA_Obj.CREATED_DATE = getUtcDate();
                CASHUP_CASH_DECLARATION_DATA_Obj.MODIFIED_BY = parseInt($cookies.get("USERID"));
                CASHUP_CASH_DECLARATION_DATA_Obj.MODIFIED_DATE = getUtcDate();
                CASHUP_CASH_DECLARATION_DATA_Obj.BRANCH_CURRENCY_AMOUNT = declaration.BRANCH_CURRENCY_AMOUNT == null ? 0 : parseFloat(declaration.BRANCH_CURRENCY_AMOUNT) + '';
                CASHUP_CASH_DECLARATION_DATA_Obj.CUSTOM_TO_BRANCH_CONVERSION_RATE = currency_table.CONVERSION_RATE == null ? 0 : currency_table.CONVERSION_RATE;
                CASHUP_CASH_DECLARATION_DATA_LIST[cnt] = CASHUP_CASH_DECLARATION_DATA_Obj;
                cnt++;
            })
        });

        angular.forEach($scope.SELECT_CURRENCY_READ, function (read_currency) {
            tempCur = $scope.SELECT_CURRENCY_MAIN.find(cur => cur.CURRENCY_ID == read_currency.CURRENCY_ID);
            if (tempCur == null) {
                read_currency.CASHUP_CASH_TIPS = 0;
                $scope.INS_UPD_CASHUP_CASH_TIPS(read_currency);
                angular.forEach(read_currency.DECLERATION_MASTER, function (declaration) {
                    var CASHUP_CASH_DECLARATION_DATA_Obj = new Object();
                    CASHUP_CASH_DECLARATION_DATA_Obj.DECLARATION_MASTER_ID = declaration.DECLARATION_MASTER_ID;
                    CASHUP_CASH_DECLARATION_DATA_Obj.QUANTITY = (declaration.QUANTITY == null || declaration.QUANTITY == "") ? 0 : parseFloat(declaration.QUANTITY);
                    CASHUP_CASH_DECLARATION_DATA_Obj.CUSTOM_CURRENCY_AMOUNT = (declaration.CUSTOM_CURRENCY_AMOUNT == null || declaration.CUSTOM_CURRENCY_AMOUNT == "") ? 0+'' : parseFloat(declaration.CUSTOM_CURRENCY_AMOUNT).toFixed(5)+'';
                    CASHUP_CASH_DECLARATION_DATA_Obj.CASHUP_HEADER_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_ID;
                    //CASHUP_CASH_DECLARATION_DATA_Obj.CASHUP_HEADER_ID = $scope.CASHUP_HEADER_ID;
                    CASHUP_CASH_DECLARATION_DATA_Obj.ACTIVE = 0;
                    CASHUP_CASH_DECLARATION_DATA_Obj.CREATED_BY = parseInt($cookies.get("USERID"));
                    CASHUP_CASH_DECLARATION_DATA_Obj.CREATED_DATE = getUtcDate();
                    CASHUP_CASH_DECLARATION_DATA_Obj.MODIFIED_BY = parseInt($cookies.get("USERID"));
                    CASHUP_CASH_DECLARATION_DATA_Obj.MODIFIED_DATE = getUtcDate();
                    CASHUP_CASH_DECLARATION_DATA_Obj.BRANCH_CURRENCY_AMOUNT = declaration.BRANCH_CURRENCY_AMOUNT == null ? 0 : parseFloat(declaration.BRANCH_CURRENCY_AMOUNT)+'';
                    CASHUP_CASH_DECLARATION_DATA_Obj.CUSTOM_TO_BRANCH_CONVERSION_RATE = read_currency.CONVERSION_RATE == null ? 0 : read_currency.CONVERSION_RATE;
                    CASHUP_CASH_DECLARATION_DATA_LIST.push(CASHUP_CASH_DECLARATION_DATA_Obj);
                    
                })
            }
        });
        CashupModelObj.CASHUP_CASH = CASHUP_CASH_DECLARATION_DATA_LIST;
        PrcCommMethods.CASHUP_APP_API(CashupModelObj, 'INS_UPD_CASHUP_CASH').then(function (data) {
            $scope.GET_CASHUP_ENTRY_HEADER($scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_ID);
            if (isDraft == 1) {
                $scope.Fn_Cashup_entry_TAB_CLICK($scope.TAB_ID, 1)
            }
            if (isPrevious == 1) {
                $scope.Fn_Cashup_entry_TAB_CLICK($scope.TAB_ID, 0);
            }
        });
    }
    $scope.INS_UPD_CASHUP_HEADER_NOTES = function (COMMENT) {
        if (COMMENT == null || COMMENT == undefined || COMMENT.isEditable == true || COMMENT.isEditable == 1) {
            if (($scope.CASHUP_ENTRY_NOTE != null && $scope.CASHUP_ENTRY_NOTE != undefined && $scope.CASHUP_ENTRY_NOTE != "") || (COMMENT != null && COMMENT != undefined && COMMENT != "")) {
                var CashupModelObj = new Object();
                CashupModelObj.NOTE_TYPE_ID = 2;
                CashupModelObj.CASHUP_HEADER_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_ID;
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
                    $scope.CASH_TAB_NOTE_LIST = [];
                    $scope.GET_CASHUP_HEADER_NOTES(2);

                });
            }
            else {
                alert('Comments cannot be empty while saving');
            }
        }
        
    };

    $scope.$on('$destroy', function () {
        $('.modal.show').modal('hide');
        $('.dropdown-menu').hide();
    });
});