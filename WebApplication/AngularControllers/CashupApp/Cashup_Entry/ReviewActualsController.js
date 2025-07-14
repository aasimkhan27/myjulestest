app.controller('ReviewActualsController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $localStorage) {
    if ($scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID == null || $scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID == undefined || $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_ID == null || $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_ID == undefined) {
        $location.path('CashUpApp_Entry');
        return;
    }
    $scope.$parent.TAB_ID = 10;
    $scope.TAB_ID = 10;
    
    $scope.CASHUP_CARDS_LIST = [];
    $scope.TOTAL_CARD_AMOUNT = 0;

    $scope.TOTAL_GROSS = 0;
    $scope.TOTAL_VAT = 0;
    $scope.TOTAL_NET = 0;
    $scope.TOTAL_DELHIVERY_AMT = 0;
    $scope.CARDS_DECLARATION_LIST = [];
    $scope.INIT_CARDS_LIST = [];
    $scope.PETTY_CASH_LIST = [];
    $scope.DELIVERY_LIST = [];
    $scope.ACCOUNT_CREDIT_LIST = [];
    $scope.ACCOUNT_RECEIVED_LIST = [];
    $scope.VOUCHER_ISSUED_LIST = [];
    $scope.VOUCHER_REDEEMED_LIST = [];
    $scope.DEPOSIT_RECEIVED_LIST = [];
    $scope.DEPOSIT_REDEEMED_LIST = [];
    $scope.COMPS_LIST = [];
    $scope.VOIDS_LIST = [];
    $scope.SESSION_LIST = [];
    $scope.AREA_LIST = [];

    $scope.SELECTED_DATA = {
        AREA_ID: $scope.$parent.CASHUP_ENTRY_SEARCH.AREA_ID,
        AREA_NAME: $scope.$parent.SELECTED_AREA,
        SESSION_NAME: $scope.$parent.SELECTED_SESSION,
        SESSION_MAPPING_ID: $scope.$parent.CASHUP_ENTRY_SEARCH.SESSION_ID
    }



    $scope.CASHUP_APPROVAL_PRIVILEGE_ID = '1163';
    $scope.CASHUP_APPROVAL_PRIVILEGE = false;
    if ($localStorage.USER_ROLES_BY_USER_ID != null && $localStorage.USER_ROLES_BY_USER_ID != undefined) {
        var filteredSites = JSON.parse($localStorage.USER_ROLES_BY_USER_ID).filter(x => x.BRANCH_ID == $scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID);
        if (filteredSites != null && filteredSites != undefined && filteredSites.length > 0) {
            $scope.CASHUP_APPROVAL_PRIVILEGE = filteredSites[0].USER_PRIVILEGE_IDS.includes($scope.CASHUP_APPROVAL_PRIVILEGE_ID);
        }
        else {
            $scope.CASHUP_APPROVAL_PRIVILEGE = false;
        }

    }
    else {
        $scope.CASHUP_APPROVAL_PRIVILEGE = false;
    }
    $scope.IS_APPROVER = ($scope.$parent.CASHUP_ENTRY_SEARCH.STANDARD_ROLE_ID == 16 || $scope.$parent.CASHUP_ENTRY_SEARCH.STANDARD_ROLE_ID == 17) && $scope.CASHUP_APPROVAL_PRIVILEGE ? true : false;


    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////Cash Section Starts///////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    $scope.SELECT_CURRENCY_MAIN = [];
    $scope.GET_CURRENCY_FOR_FLOAT_CASH_TAB = function () {
        var CashupModelObj = new Object();
        PrcCommMethods.CASHUP_APP_API(CashupModelObj, 'GET_CURRENCY_FOR_FLOAT_CASH_TAB').then(function (data) {
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
    $scope.BASE_CURRENCY_CODE = $cookies.get("CURRENCY_CODE");
    $scope.BASE_CURRENCY_ID = $cookies.get("CURRENCY_ID");

    //$scope.GET_CURRENCY_FOR_FLOAT_CASH_TAB();

    $scope.GET_CASH_DECLARATION = function () {
        var CashupModelObj = new Object();
        CashupModelObj.CASHUP_HEADER_ID = $scope.CASHUP_HEADER_ID;
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
        CashupModelObj.BRANCH_ID = $scope.BRANCH_ID;
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
                        CASHUP_HEADER_ID: $scope.CASHUP_HEADER_ID,
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
        CashupModelObj.BRANCH_ID = $scope.BRANCH_ID;
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

    $scope.nginit_cash = function (SELECT_CURRENCY_MAIN) {
        $scope.SELECT_CURRENCY_READ = angular.copy(SELECT_CURRENCY_MAIN);
    }

    $scope.init_decleration_details = function (declaration, val) {
        declaration.QUANTITY == 0 ? declaration.QUANTITY = null : '';
        val.CONVERSION_RATE == undefined || val.CONVERSION_RATE == null || val.CONVERSION_RATE == "" ? val.CONVERSION_RATE = (val.FLAG == true ? 1 : 0) : '';
    };
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
    $scope.getFlagUrl = function (currencyCode) {

        const countryCode = $scope.currencyToCountry[currencyCode];
        if (countryCode) {
            return `https://flagcdn.com/w320/${countryCode.toLowerCase()}.png`;
        }
    };


    $scope.ADMIN_GET_BRANCH_STAFF = function () {
        CashupTabsObj = new Object();
        CashupTabsObj.CUSTOMER_ID = $cookies.get('CUSTOMER_ID');
        CashupTabsObj.ENTITY_ID = $cookies.get('ENTITY_ID');
        CashupTabsObj.LOCATION_ID = 0;
        CashupTabsObj.BRANCH_ID = $scope.BRANCH_ID;
        CashupTabsObj.ACTIVE = 1;
        CashupTabsObj.STAFF_NAME = '';
        CashupTabsObj.PAGE_NO = 1;
        CashupTabsObj.PAGE_SIZE = 99999;
        PrcCommMethods.ADMIN_API(CashupTabsObj, 'ADMIN_GET_BRANCH_STAFF').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.AUTHORIZER_LIST = data.data.Table;
            }
            else {
                $scope.AUTHORIZER_LIST = [];
                $scope.$parent.ShowAlertBox("Error", 'There is no Authorizers found, please Add from Settings', 3000);
            }
            $scope.GET_CASHUP_REVIEW_ACTUALS();
        });
    };

    $scope.GET_MODE_OF_PAYMENTS = function () {
        var ModelObj = new Object();
        ModelObj.BRANCH_ID = $scope.BRANCH_ID;
        PrcCommMethods.CASHUP_APP_API(ModelObj, 'GET_MODE_OF_PAYMENTS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.MODE_OF_PAYMENT_LIST = data.data.Table;
            }
            $scope.ADMIN_GET_BRANCH_STAFF();
        });
    };

    $scope.GET_CASHUP_CARDS = function () {
        var Cardobj = new Object();
        Cardobj.BRANCH_ID = $scope.BRANCH_ID;
        Cardobj.CASHUP_HEADER_ID = $scope.CASHUP_HEADER_ID;
        PrcCommMethods.CASHUP_APP_API(Cardobj, 'GET_CASHUP_CARDS').then(function (data) {
            if (data.data && data.data.Table.length > 0) {
                $scope.CASHUP_CARDS_LIST = data.data.Table;
            } else {
                $scope.CASHUP_CARDS_LIST = [];
            }
            $scope.GET_MODE_OF_PAYMENTS();
        })
    };


    $scope.ADMIN_GET_PDQ_MASTER = function () {
        CommonObj = new Object();
        CommonObj.PDQ_MASTER_ID = 0;
        CommonObj.CUSTOMER_ID = $cookies.get("CUSTOMER_ID");
        CommonObj.LOCATION_ID = 0;
        CommonObj.PDQ_CODE = '';
        CommonObj.ENTITY_ID = $cookies.get("ENTITY_ID");
        CommonObj.BRANCH_ID = $scope.BRANCH_ID;
        CommonObj.ACTIVE = 1;
        CommonObj.USER_ID = parseInt($cookies.get("USERID"));
        CommonObj.PAGE_NO = 0;
        CommonObj.PAGE_SIZE = 0;
        PrcCommMethods.ADMIN_API(CommonObj, 'ADMIN_GET_PDQ_MASTER').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.PDQ_LIST = data.data.Table;
            }
            else {
                $scope.PDQ_LIST = [];
            }
            $scope.GET_CASHUP_CARDS();
            
        });
    };
    //$scope.ADMIN_GET_PDQ_MASTER();





    $scope.GET_CASHUP_REVIEW_ACTUALS = function () {
        var CashupModelObj = new Object();
        CashupModelObj.BRANCH_ID = $scope.BRANCH_ID;
        CashupModelObj.CASHUP_HEADER_ID = $scope.CASHUP_HEADER_ID;
        PrcCommMethods.CASHUP_APP_API(CashupModelObj, 'GET_CASHUP_REVIEW_ACTUALS').then(function (data) {
            if (data.data != null && data.data != undefined) {
                //Cards
                if (data.data.CARDS_LIST.length > 0) {
                    var INIT_CARD_DECLARATION_LIST = data.data.CARDS_LIST;

                    // Initialize the final result array
                    let result = [];

                    // Group data by CARD_DECLARATION_ID
                    let groupedData = {};

                    INIT_CARD_DECLARATION_LIST.forEach(row => {
                        if (!groupedData[row.CARD_DECLARATION_ID]) {
                            groupedData[row.CARD_DECLARATION_ID] = [];
                        }
                        groupedData[row.CARD_DECLARATION_ID].push(row);
                    });

                    // Iterate over each unique CARD_DECLARATION_ID group
                    for (let declarationId in groupedData) {
                        let rows = groupedData[declarationId];
                        let firstRow = rows[0]; // All rows in the same group will have the same CARD_DECLARATION_ID and INDEX_VALS

                        // Initialize the row object for this group
                        let row = {
                            INDEX: firstRow.INDEX_VALS,
                            CARD_DECLARATION_ID: firstRow.CARD_DECLARATION_ID,
                            AUTH_CODE: firstRow.AUTH_CODE,
                            NOTE: firstRow.NOTE,
                            UPLOAD_IDS: firstRow.UPLOAD_IDS,
                            IS_DELETED: firstRow.IS_DELETED,
                            ACTIVE: rows.some(row => row.ACTIVE == true) ? 1 : 0, // ACTIVE is 1 if any row in the group has ACTIVE = true
                            SELECTED_PDQ: $scope.PDQ_LIST.find(pdq => pdq.PDQ_MASTER_ID == firstRow.PDQ_ID) // Find the matching PDQ
                        };
                        let totalAmount = 0;
                        // For each card in CARDS_LIST, create the dynamic property
                        $scope.CASHUP_CARDS_LIST.forEach(card => {
                            // Filter rows for the current CASHUP_CARD_ID
                            let matchingRow = rows.find(row => row.CASHUP_CARD_ID == card.CASHUP_CARD_ID);

                            if (matchingRow) {
                                // If there's a matching row, populate the value for the card
                                row[card.CARD_NAME + '_VALUE'] = {
                                    INDEX_ID: firstRow.INDEX_VALS,
                                    CARD_DECLARATION_LINES_ID: matchingRow.CARD_DECLARATION_LINES_ID,
                                    CARD_DECLARATION_ID: matchingRow.CARD_DECLARATION_ID,
                                    CASHUP_CARD_ID: card.CASHUP_CARD_ID,
                                    AMOUNT: matchingRow.CARD_DECLARATION_LINES_AMOUNT == 0 ? null : matchingRow.CARD_DECLARATION_LINES_AMOUNT,
                                    IS_DELETED: matchingRow.IS_DELETED
                                };
                                if (matchingRow.CARD_DECLARATION_LINES_AMOUNT != null && matchingRow.CARD_DECLARATION_LINES_AMOUNT != "" && !isNaN(matchingRow.CARD_DECLARATION_LINES_AMOUNT)) {
                                    totalAmount += matchingRow.CARD_DECLARATION_LINES_AMOUNT;
                                }
                            } else {
                                // If no matching row, create the default value object
                                row[card.CARD_NAME + '_VALUE'] = {
                                    INDEX_ID: firstRow.INDEX_VALS,
                                    CARD_DECLARATION_LINES_ID: 0,
                                    CARD_DECLARATION_ID: 0,
                                    CASHUP_CARD_ID: card.CASHUP_CARD_ID,
                                    AMOUNT: null,
                                    IS_DELETED: 0
                                };
                            }
                        });
                        row.TOTAL_AMOUNT = totalAmount;
                        row.UploadedFiles = [];
                        // Push the final row object into the result array
                        result.push(row);
                    }

                    // Final result
                    $scope.CARDS_DECLARATION_LIST = result;


                    angular.forEach($scope.CASHUP_CARDS_LIST, function (_card) {
                        var totalAmt = 0;
                        angular.forEach($scope.CARDS_DECLARATION_LIST, function (_row) {
                            if (!isNaN(parseFloat(_row[_card.CARD_NAME + '_VALUE'].AMOUNT))) {
                                totalAmt += parseFloat(_row[_card.CARD_NAME + '_VALUE'].AMOUNT)
                            }
                        });
                        _card.TOTAL = totalAmt;
                    })
                    
                }
                else {
                    $scope.INIT_CARDS_LIST = [];
                    $scope.CARDS_DECLARATION_LIST = [];
                }
                //Petty Cash
                if (data.data.PETTY_CASH_LIST.length > 0) {
                    $scope.PETTY_CASH_LIST = data.data.PETTY_CASH_LIST;
                }
                else {
                    $scope.PETTY_CASH_LIST = [];
                }
                //Delivery
                if (data.data.DELIVERY_LIST.length > 0) {
                    $scope.DELIVERY_LIST = data.data.DELIVERY_LIST;
                }
                else {
                    $scope.DELIVERY_LIST = [];
                }
                //Account Credit
                if (data.data.ACCOUNT_LIST.filter(x=>x.PARENT_ID==null).length > 0) {
                    $scope.ACCOUNT_CREDIT_LIST = data.data.ACCOUNT_LIST.filter(x => x.PARENT_ID == null);
                }
                else {
                    $scope.ACCOUNT_CREDIT_LIST = [];
                }
                //Account received
                if (data.data.ACCOUNT_LIST.filter(x => x.PARENT_ID != null).length > 0) {
                    $scope.ACCOUNT_RECEIVED_LIST = data.data.ACCOUNT_LIST.filter(x => x.PARENT_ID != null);
                }
                else {
                    $scope.ACCOUNT_RECEIVED_LIST = [];
                }
                //Voucher Issued
                if (data.data.ENTRY_TYPE_LIST.filter(x => x.ENTRY_TYPE_ID == 1 && x.ENTRY_TYPE_DETAIL_ID == null).length > 0) {
                    $scope.VOUCHER_ISSUED_LIST = data.data.ENTRY_TYPE_LIST.filter(x => x.ENTRY_TYPE_ID == 1 && x.ENTRY_TYPE_DETAIL_ID == null);
                }
                else {
                    $scope.VOUCHER_ISSUED_LIST = [];
                }
                //Voucher Redeemed
                if (data.data.ENTRY_TYPE_LIST.filter(x => x.ENTRY_TYPE_ID == 1 && x.ENTRY_TYPE_DETAIL_ID != null).length > 0) {
                    $scope.VOUCHER_REDEEMED_LIST = data.data.ENTRY_TYPE_LIST.filter(x => x.ENTRY_TYPE_ID == 1 && x.ENTRY_TYPE_DETAIL_ID != null);
                }
                else {
                    $scope.VOUCHER_REDEEMED_LIST = [];
                }

                //Deposit Received
                if (data.data.ENTRY_TYPE_LIST.filter(x => x.ENTRY_TYPE_ID == 3 && x.ENTRY_TYPE_DETAIL_ID == null).length > 0) {
                    $scope.DEPOSIT_RECEIVED_LIST = data.data.ENTRY_TYPE_LIST.filter(x => x.ENTRY_TYPE_ID == 3 && x.ENTRY_TYPE_DETAIL_ID == null);
                }
                else {
                    $scope.DEPOSIT_RECEIVED_LIST = [];
                }
                //Deposit Redeemed
                if (data.data.ENTRY_TYPE_LIST.filter(x => x.ENTRY_TYPE_ID == 3 && x.ENTRY_TYPE_DETAIL_ID != null).length > 0) {
                    $scope.DEPOSIT_REDEEMED_LIST = data.data.ENTRY_TYPE_LIST.filter(x => x.ENTRY_TYPE_ID == 3 && x.ENTRY_TYPE_DETAIL_ID != null);
                }
                else {
                    $scope.DEPOSIT_REDEEMED_LIST = [];
                }


                //Comp
                if (data.data.ENTRY_TYPE_LIST.filter(x => x.ENTRY_TYPE_ID == 6).length > 0) {
                    $scope.COMPS_LIST = data.data.ENTRY_TYPE_LIST.filter(x => x.ENTRY_TYPE_ID == 6);
                }
                else {
                    $scope.COMPS_LIST = [];
                }
                //Void
                if (data.data.ENTRY_TYPE_LIST.filter(x => x.ENTRY_TYPE_ID == 7).length > 0) {
                    $scope.VOIDS_LIST = data.data.ENTRY_TYPE_LIST.filter(x => x.ENTRY_TYPE_ID == 7);
                }
                else {
                    $scope.VOIDS_LIST = [];
                }
            }
            else {
                $scope.CARDS_DECLARATION_LIST = [];
                $scope.INIT_CARDS_LIST = [];
                $scope.PETTY_CASH_LIST = [];
                $scope.DELIVERY_LIST = [];
                $scope.ACCOUNT_CREDIT_LIST = [];
                $scope.ACCOUNT_RECEIVED_LIST = [];
                $scope.VOUCHER_ISSUED_LIST = [];
                $scope.VOUCHER_REDEEMED_LIST = [];
                $scope.DEPOSIT_RECEIVED_LIST = [];
                $scope.DEPOSIT_REDEEMED_LIST = [];
                $scope.COMPS_LIST = [];
                $scope.VOIDS_LIST = [];

            }

        });
    }

    $scope.nginit_cards = function (_row) {
        if (_row.ACTIVE == 1) {
            $scope.$parent.$parent.GET_UPLOADS(_row, 11, _row.CARD_DECLARATION_ID);
            if (!isNaN(parseFloat(_row.TOTAL_AMOUNT))) {
                $scope.TOTAL_CARD_AMOUNT += parseFloat(_row.TOTAL_AMOUNT);
            }
        }
    };

    
    $scope.nginit_pettycash = function (_row) {
        $scope.$parent.$parent.GET_UPLOADS(_row, 13, _row.ID);
        if (_row.ACTIVE == true || _row.ACTIVE == 1) {
            if (!isNaN(parseFloat(_row.TOTAL_VALUE))) {
                $scope.TOTAL_GROSS += parseFloat(_row.TOTAL_VALUE);
            }
            if (!isNaN(parseFloat(_row.VAT_AMOUNT))) {
                $scope.TOTAL_VAT += parseFloat(_row.VAT_AMOUNT);
            }
            if (!isNaN(parseFloat(_row.NET_AMOUNT))) {
                $scope.TOTAL_NET += parseFloat(_row.NET_AMOUNT);
            }
        }
    }
    $scope.nginit_delivery = function (_row) {
        $scope.$parent.$parent.GET_UPLOADS(_row, 58, _row.CASHUP_DELIVERY_ID);
        //_row.DATE = $filter('date')(_row.DATE, 'yyyy-MM-dd');
        if (_row.DATE != null) {
            _row.DATE = moment(_row.DATE, $scope.$parent.DB_DATE_FORMAT).format($scope.$parent.CONVERSION_DATE_FORMAT);
        }
        if (_row.ACTIVE == true || _row.ACTIVE == 1) {
            if (!isNaN(parseFloat(_row.AMOUNT))) {
                $scope.TOTAL_DELHIVERY_AMT += parseFloat(_row.AMOUNT);
            }
        }
        _row.SELECTED_MODE_OF_PAYMENT_NAME = $scope.MODE_OF_PAYMENT_LIST.find(mp => mp.MODE_OF_PAYMENT_ID == _row.MODE_OF_PAYMENT_ID).METHOD_NAME;
    };


    $scope.nginit_comps = function (_row) {
        if ($scope.AUTHORIZER_LIST.filter(a => a.TABLE_ID == _row.AUTHORIZED_BY)[0] != null && $scope.AUTHORIZER_LIST.filter(a => a.TABLE_ID == _row.AUTHORIZED_BY)[0] != undefined) {
            _row.AUTHORIZED_BY_NAME = $scope.AUTHORIZER_LIST.filter(a => a.TABLE_ID == _row.AUTHORIZED_BY)[0].NAME;
        }
        
    }
    $scope.nginit_voids = function (_row) {
        if ($scope.AUTHORIZER_LIST.filter(a => a.TABLE_ID == _row.AUTHORIZED_BY)[0] != null && $scope.AUTHORIZER_LIST.filter(a => a.TABLE_ID == _row.AUTHORIZED_BY)[0] != undefined) {
            _row.AUTHORIZED_BY_NAME = $scope.AUTHORIZER_LIST.filter(a => a.TABLE_ID == _row.AUTHORIZED_BY)[0].NAME;
        }
        
    }


    $scope.INIT_REVIEW_ACTUALS = function () {
        $scope.GET_CURRENCY_FOR_FLOAT_CASH_TAB();
        $scope.ADMIN_GET_PDQ_MASTER();
    }
    $scope.INIT_REVIEW_ACTUALS();






    $scope.GET_AREA_SESSION = function () {
        const areaMap = {};
        const sessionMap = {};
        angular.forEach($scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_LIST, function (item) {
            const areaKey = item.AREA_ID;
            if (areaKey != null && !areaMap[areaKey]) { // If we haven't seen this area ID before...
                areaMap[areaKey] = {
                    AREA_ID: item.AREA_ID,
                    AREA_NAME: item.AREA_NAME
                };
            }
            const sessionKey = item.SESSION_MAPPING_ID;
            if (!sessionMap[sessionKey]) { // If we haven't seen this session ID before...
                sessionMap[sessionKey] = {
                    SESSION_MAPPING_ID: item.SESSION_MAPPING_ID,
                    SESSION_NAME: item.SESSION_NAME
                };
            }
        });
        $scope.SESSION_LIST = Object.values(sessionMap);
        $scope.AREA_LIST = Object.values(areaMap);
        $scope.ACTIVE_REVIEW_TAB_AREA_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.AREA_ID;
        $scope.CASHUP_HEADER_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_ID;
        $scope.BRANCH_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID;
        $scope.INIT_REVIEW_ACTUALS();
    }
    $scope.GET_AREA_SESSION();



    $scope.Fn_REVIEW_TAB_CLICK = function (_area) {
        if (_area == 'all') {
            $scope.ACTIVE_REVIEW_TAB_ALL_AREA = true;
        }
        else {
            $scope.ACTIVE_REVIEW_TAB_AREA_ID = _area.AREA_ID;
            $scope.SELECTED_DATA.AREA_ID = _area.AREA_ID;
            $scope.SELECTED_DATA.AREA_NAME = _area.AREA_NAME;
            $scope.Fn_REVIEW_SESSION_CLICK($scope.SESSION_LIST[0]);
        }
    }

    $scope.Fn_REVIEW_SESSION_CLICK = function (_session) {
        $scope.SELECTED_DATA.SESSION_MAPPING_ID = _session.SESSION_MAPPING_ID;
        $scope.SELECTED_DATA.SESSION_NAME = _session.SESSION_NAME;

        if ($scope.$parent.CASHUP_BY_AREA == true || $scope.$parent.CASHUP_BY_AREA == 1) {
            $scope.CURRENT_CASHUP_HEADER = $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_LIST.filter(_row => _row.SESSION_MAPPING_ID == $scope.SELECTED_DATA.SESSION_MAPPING_ID && _row.AREA_ID == $scope.SELECTED_DATA.AREA_ID)[0];
        }
        else if ($scope.$parent.CASHUP_BY_AREA == false || $scope.$parent.CASHUP_BY_AREA == 0) {
            $scope.CURRENT_CASHUP_HEADER = $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_LIST.filter(_row => _row.SESSION_MAPPING_ID == $scope.SELECTED_DATA.SESSION_MAPPING_ID)[0];
        }


        $scope.$parent.SELECTED_SITE = $scope.CURRENT_CASHUP_HEADER.BRANCH_NAME;
        $scope.$parent.SELECTED_AREA = $scope.CURRENT_CASHUP_HEADER.AREA_NAME;
        $scope.$parent.SELECTED_SESSION = $scope.CURRENT_CASHUP_HEADER.SESSION_NAME;
        $scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID = $scope.CURRENT_CASHUP_HEADER.BRANCH_ID;
        $scope.$parent.CASHUP_ENTRY_SEARCH.AREA_ID = $scope.CURRENT_CASHUP_HEADER.AREA_ID;
        $scope.$parent.CASHUP_ENTRY_SEARCH.SESSION_ID = $scope.CURRENT_CASHUP_HEADER.SESSION_MAPPING_ID;
        $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_ID = $scope.CURRENT_CASHUP_HEADER.CASHUP_HEADER_ID;
        $scope.CASHUP_HEADER_ID = $scope.CURRENT_CASHUP_HEADER.CASHUP_HEADER_ID;

        $scope.GET_CASHUP_ENTRY_HEADER($scope.CASHUP_HEADER_ID);
        $scope.SELECT_CURRENCY_MAIN = [];
        $scope.INIT_REVIEW_ACTUALS();
    }
});