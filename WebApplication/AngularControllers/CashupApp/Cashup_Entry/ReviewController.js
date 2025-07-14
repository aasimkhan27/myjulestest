app.controller('ReviewController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location,$localStorage) {
    if ($scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID == null || $scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID == undefined || $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_ID == null || $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_ID == undefined) {
        $location.path('CashUpApp_Entry');
        return;
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
    $scope.$parent.TAB_ID = 10;
    $scope.TAB_ID = 10;
    $scope.USER_ID = parseInt($cookies.get("USERID"));
    $scope.REVIEW_TAB_NOTE_ENTRY = {
        CASHUP_REVIEW_NOTE_ID: 0,
        TITLE: null,
        NOTE: null,
        ACTIVE: 1,
        CurrentNoteObj: {}
    }
    $scope.REVIEW_TAB_NOTE_LIST = [];
    $scope.$parent.REDIRECT_REGISTER_ENTRY = false;
    $scope.REVIEW_TAB_NOTE_LIST = [];
    $scope.REVIEW_ALL_TAB_NOTE_LIST = [];
    $scope.SESSION_LIST = [];
    $scope.AREA_LIST = [];
    $scope.PETTY_CASH_DECLARATION_LIST = [];
    $scope.PETTY_CASH_DECLARATION_ALL_AREA_LIST = [];
    $scope.ACTIVE_REVIEW_TAB_AREA_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.AREA_ID;
    $scope.ACTIVE_REVIEW_TAB_ALL_AREA = false;
    $scope.SELECTED_DATA = {
        AREA_ID: $scope.$parent.CASHUP_ENTRY_SEARCH.AREA_ID,
        AREA_NAME: $scope.$parent.SELECTED_AREA,
        SESSION_NAME: $scope.$parent.SELECTED_SESSION,
        SESSION_MAPPING_ID: $scope.$parent.CASHUP_ENTRY_SEARCH.SESSION_ID,
        CURRENT_CASHUP_HEADER: null
    }
    $scope.REJECTION_COMMENT = null;
    //$scope.ALL_AREA_TAB_SELECTIONS
    $scope.CASHUP_HEADER = [];
    $scope.ALL_AREA_DATA = [];
    $scope.ALL_AREA_TOTALS_EPOS = 0;
    $scope.ALL_AREA_TOTALS_EPOS_RCV = 0;
    $scope.ALL_AREA_TOTALS_ACTUAL = 0;
    $scope.ALL_AREA_TOTALS_ACTUAL_RCV = 0;
    //$scope.ALL_AREA_TOTALS_SERVICE_CHARGE = 0;
    //$scope.ALL_AREA_TOTALS_HOUSE_TIPS = 0;
    //$scope.ALL_AREA_TOTALS_CASH_TIPS = 0;

    $scope.ALL_AREA_TOTALS = {
        CASH: {
            EPOS: 0,
            ACTUAL:0
        },
        CARDS: {
            EPOS: 0,
            ACTUAL: 0
        },
        PETTY_CASH: {
            EPOS: 0,
            ACTUAL: 0
        },
        DELIVERY: {
            EPOS: 0,
            ACTUAL: 0
        },
        ACCOUNT_CREDIT: {
            EPOS: 0,
            ACTUAL: 0
        },
        ACCOUNT_RECEIVED: {
            EPOS: 0,
            ACTUAL: 0
        },
        DEPOSIT_RECEIVED: {
            EPOS: 0,
            ACTUAL: 0
        },
        DEPOSIT_REDEEMED: {
            EPOS: 0,
            ACTUAL: 0
        },
        VOUCHER_ISSUED: {
            EPOS: 0,
            ACTUAL: 0
        },
        VOUCHER_REDEEMED: {
            EPOS: 0,
            ACTUAL: 0
        },
        COMPLIMENTARY: {
            EPOS: 0,
            ACTUAL: 0
        },
        VOID: {
            EPOS: 0,
            ACTUAL: 0
        },
        TRANSITORY: {
            EPOS: 0,
            ACTUAL: 0
        },
        CASH_TIPS_TOTAL: 0,
        HOUSE_TIPS_TOTAL: 0,
        SERVICE_CHARGE_TOTAL: 0,
        REVENUE:[]
    }
    angular.forEach($scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_LIST, function (_row) {
        var cashup_header_obj = new Object();
        cashup_header_obj.CASHUP_HEADER_ID = _row.CASHUP_HEADER_ID;
        cashup_header_obj.CASHUP_MAIN_ID = _row.CASHUP_MAIN_ID;
        cashup_header_obj.AREA_ID = _row.AREA_ID;
        cashup_header_obj.AREA_NAME = _row.AREA_NAME;
        cashup_header_obj.SESSION_MAPPING_ID = _row.SESSION_MAPPING_ID;
        cashup_header_obj.SESSION_NAME = _row.SESSION_NAME;
        cashup_header_obj.BRANCH_ID = _row.BRANCH_ID;
        cashup_header_obj.BRANCH_NAME = _row.BRANCH_NAME;
        cashup_header_obj.CASHUP_HEADER_VALUES = new Object();
        cashup_header_obj.CASHUP_HEADER_VALUES.CASH = {
            "ACTUAL": 0,
            "EPOS": 0
        }
        cashup_header_obj.CASHUP_HEADER_VALUES.CARDS = {
            "ACTUAL": 0,
            "EPOS": 0
        }
        cashup_header_obj.CASHUP_HEADER_VALUES.PETTY_CASH = {
            "ACTUAL": 0,
            "EPOS": 0
        }
        cashup_header_obj.CASHUP_HEADER_VALUES.DELIVERY = {
            "ACTUAL": 0,
            "EPOS": 0
        }
        cashup_header_obj.CASHUP_HEADER_VALUES.ACCOUNT_RECEIVED = {
            "ACTUAL": 0,
            "EPOS": 0
        }
        cashup_header_obj.CASHUP_HEADER_VALUES.ACCOUNT_CREDIT = {
            "ACTUAL": 0,
            "EPOS": 0
        }
        cashup_header_obj.CASHUP_HEADER_VALUES.VOUCHER_ISSUED = {
            "ACTUAL": 0,
            "EPOS": 0,
            "VARIANCE": 0
        }
        cashup_header_obj.CASHUP_HEADER_VALUES.VOUCHER_REDEEMED = {
            "ACTUAL": 0,
            "EPOS": 0
        }
        cashup_header_obj.CASHUP_HEADER_VALUES.DEPOSIT_RECEIVED = {
            "ACTUAL": 0,
            "EPOS": 0
        }
        cashup_header_obj.CASHUP_HEADER_VALUES.DEPOSIT_REDEEMED = {
            "ACTUAL": 0,
            "EPOS": 0
        }
        cashup_header_obj.CASHUP_HEADER_VALUES.COMPLIMENTARY = {
            "ACTUAL": 0,
            "EPOS": 0
        }
        cashup_header_obj.CASHUP_HEADER_VALUES.VOID = {
            "ACTUAL": 0,
            "EPOS": 0
        }
        cashup_header_obj.CASHUP_HEADER_VALUES.TRANSITORY = {
            "ACTUAL": 0,
            "EPOS": 0
        }
        cashup_header_obj.REVENUE_OBJECT = [];
        cashup_header_obj.SERVICE_CHARGE = 0;
        cashup_header_obj.CASH_TIPS = 0;
        cashup_header_obj.HOUSE_TIPS = 0;
        cashup_header_obj.EPOS_TOTAL = 0;
        cashup_header_obj.EPOS_TOTAL_RCV = 0;
        cashup_header_obj.ACTUAL_TOTAL = 0;
        cashup_header_obj.ACTUAL_TOTAL_RCV = 0;
        cashup_header_obj.STATUS = null;
        $scope.CASHUP_HEADER.push(cashup_header_obj);
    })
    $scope.CASHUP_REVIEW = function () {
        var TABLE_ID_LIST = [];
        var CashupAppModelObj = new Object();
        angular.forEach($scope.CASHUP_HEADER, function (_row) {
            var _header = new Object();
            _header.TABLE_ID = _row.CASHUP_HEADER_ID;
            TABLE_ID_LIST.push(_header);
        })
        CashupAppModelObj.TABLE_ID_LIST = TABLE_ID_LIST;
        PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'CASHUP_REVIEW').then(function (data) {
            angular.forEach($scope.CASHUP_HEADER, function (_header) {
                if (data.data.Table.length > 0) {
                    var tempTable = data.data.Table.filter(_row => _row.CASHUP_HEADER_ID == _header.CASHUP_HEADER_ID);
                    if (tempTable.length > 0) {
                        if (tempTable.filter(row => row.CASHUP_PAYMENT_METHOD_MAPPING_ID == 1).length > 0) {
                            _header.CASHUP_HEADER_VALUES.CASH.EPOS = parseFloat(tempTable.filter(row => row.CASHUP_PAYMENT_METHOD_MAPPING_ID == 1)[0].EPOS_DATA);
                            _header.EPOS_TOTAL += _header.CASHUP_HEADER_VALUES.CASH.EPOS;
                        }
                        if (tempTable.filter(row => row.CASHUP_PAYMENT_METHOD_MAPPING_ID == 2).length > 0) {
                            _header.CASHUP_HEADER_VALUES.CARDS.EPOS = parseFloat(tempTable.filter(row => row.CASHUP_PAYMENT_METHOD_MAPPING_ID == 2)[0].EPOS_DATA);
                            _header.EPOS_TOTAL += _header.CASHUP_HEADER_VALUES.CARDS.EPOS;
                        }
                        if (tempTable.filter(row => row.CASHUP_PAYMENT_METHOD_MAPPING_ID == 3).length > 0) {
                            _header.CASHUP_HEADER_VALUES.PETTY_CASH.EPOS = parseFloat(tempTable.filter(row => row.CASHUP_PAYMENT_METHOD_MAPPING_ID == 3)[0].EPOS_DATA);
                            _header.EPOS_TOTAL += _header.CASHUP_HEADER_VALUES.PETTY_CASH.EPOS;
                        }
                        if (tempTable.filter(row => row.CASHUP_PAYMENT_METHOD_MAPPING_ID == 4).length > 0) {
                            _header.CASHUP_HEADER_VALUES.DELIVERY.EPOS = parseFloat(tempTable.filter(row => row.CASHUP_PAYMENT_METHOD_MAPPING_ID == 4)[0].EPOS_DATA);
                            _header.EPOS_TOTAL += _header.CASHUP_HEADER_VALUES.DELIVERY.EPOS;
                        }
                        if (tempTable.filter(row => row.CASHUP_PAYMENT_METHOD_MAPPING_ID == 5).length > 0) {
                            _header.CASHUP_HEADER_VALUES.ACCOUNT_CREDIT.EPOS = parseFloat(tempTable.filter(row => row.CASHUP_PAYMENT_METHOD_MAPPING_ID == 5)[0].EPOS_DATA);
                            _header.EPOS_TOTAL += _header.CASHUP_HEADER_VALUES.ACCOUNT_CREDIT.EPOS;
                        }
                        if (tempTable.filter(row => row.CASHUP_PAYMENT_METHOD_MAPPING_ID == 6).length > 0) {
                            _header.CASHUP_HEADER_VALUES.ACCOUNT_RECEIVED.EPOS = parseFloat(tempTable.filter(row => row.CASHUP_PAYMENT_METHOD_MAPPING_ID == 6)[0].EPOS_DATA);
                            _header.EPOS_TOTAL_RCV += _header.CASHUP_HEADER_VALUES.ACCOUNT_RECEIVED.EPOS;
                        }
                        if (tempTable.filter(row => row.CASHUP_PAYMENT_METHOD_MAPPING_ID == 7).length > 0) {
                            _header.CASHUP_HEADER_VALUES.VOUCHER_REDEEMED.EPOS = parseFloat(tempTable.filter(row => row.CASHUP_PAYMENT_METHOD_MAPPING_ID == 7)[0].EPOS_DATA);
                            _header.EPOS_TOTAL += _header.CASHUP_HEADER_VALUES.VOUCHER_REDEEMED.EPOS
                        }
                        if (tempTable.filter(row => row.CASHUP_PAYMENT_METHOD_MAPPING_ID == 8).length > 0) {
                            _header.CASHUP_HEADER_VALUES.VOUCHER_ISSUED.EPOS = parseFloat(tempTable.filter(row => row.CASHUP_PAYMENT_METHOD_MAPPING_ID == 8)[0].EPOS_DATA);
                            _header.EPOS_TOTAL_RCV += _header.CASHUP_HEADER_VALUES.VOUCHER_ISSUED.EPOS;
                        }
                        if (tempTable.filter(row => row.CASHUP_PAYMENT_METHOD_MAPPING_ID == 9).length > 0) {
                            _header.CASHUP_HEADER_VALUES.DEPOSIT_REDEEMED.EPOS = parseFloat(tempTable.filter(row => row.CASHUP_PAYMENT_METHOD_MAPPING_ID == 9)[0].EPOS_DATA);
                            _header.EPOS_TOTAL += _header.CASHUP_HEADER_VALUES.DEPOSIT_REDEEMED.EPOS;
                        }
                        if (tempTable.filter(row => row.CASHUP_PAYMENT_METHOD_MAPPING_ID == 10).length > 0) {
                            _header.CASHUP_HEADER_VALUES.DEPOSIT_RECEIVED.EPOS = parseFloat(tempTable.filter(row => row.CASHUP_PAYMENT_METHOD_MAPPING_ID == 10)[0].EPOS_DATA);
                            _header.EPOS_TOTAL_RCV += _header.CASHUP_HEADER_VALUES.DEPOSIT_RECEIVED.EPOS;
                        }
                        if (tempTable.filter(row => row.CASHUP_PAYMENT_METHOD_MAPPING_ID == 11).length > 0) {
                            _header.CASHUP_HEADER_VALUES.TRANSITORY.EPOS = parseFloat(tempTable.filter(row => row.CASHUP_PAYMENT_METHOD_MAPPING_ID == 11)[0].EPOS_DATA);
                            _header.EPOS_TOTAL += _header.CASHUP_HEADER_VALUES.TRANSITORY.EPOS;
                        }
                    }
                    tempTable = null;
                }
                if (data.data.Table1.length > 0) {
                    var tempTable1 = data.data.Table1.filter(_row => _row.CASHUP_HEADER_ID == _header.CASHUP_HEADER_ID);
                    if (tempTable1.length > 0) {
                        _header.CASHUP_HEADER_VALUES.CASH.ACTUAL = parseFloat(tempTable1[0].CASH_TOTAL);
                        _header.ACTUAL_TOTAL += _header.CASHUP_HEADER_VALUES.CASH.ACTUAL;

                        _header.CASHUP_HEADER_VALUES.CARDS.ACTUAL = parseFloat(tempTable1[0].CARDS_TOTAL);
                        _header.ACTUAL_TOTAL += _header.CASHUP_HEADER_VALUES.CARDS.ACTUAL;

                        _header.CASHUP_HEADER_VALUES.PETTY_CASH.ACTUAL = parseFloat(tempTable1[0].PETTY_CASH);
                        _header.ACTUAL_TOTAL += _header.CASHUP_HEADER_VALUES.PETTY_CASH.ACTUAL;

                        _header.CASHUP_HEADER_VALUES.DELIVERY.ACTUAL = parseFloat(tempTable1[0].DELIVERY_AMOUNT);
                        _header.ACTUAL_TOTAL += _header.CASHUP_HEADER_VALUES.DELIVERY.ACTUAL;

                        _header.CASHUP_HEADER_VALUES.ACCOUNT_CREDIT.ACTUAL = parseFloat(tempTable1[0].ACCOUNT_TOTAL);
                        _header.ACTUAL_TOTAL += _header.CASHUP_HEADER_VALUES.ACCOUNT_CREDIT.ACTUAL;

                        _header.CASHUP_HEADER_VALUES.ACCOUNT_RECEIVED.ACTUAL = parseFloat(tempTable1[0].ACCOUNT_RECEIVED_TOTAL);
                        _header.ACTUAL_TOTAL_RCV += _header.CASHUP_HEADER_VALUES.ACCOUNT_RECEIVED.ACTUAL;

                        _header.CASHUP_HEADER_VALUES.VOUCHER_ISSUED.ACTUAL = parseFloat(tempTable1[0].VOUCHER_ISSUED_TOTAL);
                        _header.ACTUAL_TOTAL_RCV += _header.CASHUP_HEADER_VALUES.VOUCHER_ISSUED.ACTUAL;


                        _header.CASHUP_HEADER_VALUES.VOUCHER_REDEEMED.ACTUAL = parseFloat(tempTable1[0].VOUCHER_REDEEMED_TOTAL);
                        _header.ACTUAL_TOTAL += _header.CASHUP_HEADER_VALUES.VOUCHER_REDEEMED.ACTUAL;

                        _header.CASHUP_HEADER_VALUES.DEPOSIT_REDEEMED.ACTUAL = parseFloat(tempTable1[0].DEPOSIT_REDEEMED_TOTAL);
                        _header.ACTUAL_TOTAL += _header.CASHUP_HEADER_VALUES.DEPOSIT_REDEEMED.ACTUAL;

                        _header.CASHUP_HEADER_VALUES.DEPOSIT_RECEIVED.ACTUAL = parseFloat(tempTable1[0].DEPOSIT_RECEIVED_TOTAL);
                        _header.ACTUAL_TOTAL_RCV += _header.CASHUP_HEADER_VALUES.DEPOSIT_RECEIVED.ACTUAL;

                        _header.CASHUP_HEADER_VALUES.COMPLIMENTARY.ACTUAL = parseFloat(tempTable1[0].COMPLIMENTARY_TOTAL);
                        _header.CASHUP_HEADER_VALUES.VOID.ACTUAL = parseFloat(tempTable1[0].VOID_TOTAL);
                        _header.CASH_TIPS = parseFloat(tempTable1[0].CASH_TIPS);
                        
                        _header.STATUS = tempTable1[0].STATUS;
                    }
                    tempTable1 = null;
                }
                if (data.data.Table2.length > 0) {
                    var tempTable2 = data.data.Table2.filter(_row => _row.CASHUP_HEADER_ID == _header.CASHUP_HEADER_ID);
                    if (tempTable2.length > 0) {
                        _header.CASHUP_HEADER_VALUES.VOID.EPOS = parseFloat(tempTable2[0].EPOS_DATA_VOID);
                    }
                }
                if (data.data.Table3.length > 0) {
                    var tempTable3 = data.data.Table3.filter(_row => _row.CASHUP_HEADER_ID == _header.CASHUP_HEADER_ID);
                    if (tempTable3.length > 0) {
                        _header.CASHUP_HEADER_VALUES.COMPLIMENTARY.EPOS = parseFloat(tempTable3[0].EPOS_DATA_COMP);
                    }
                }

                if (data.data.Table4.length > 0) {
                    var tempTable4 = data.data.Table4.filter(_row => _row.CASHUP_HEADER_ID == _header.CASHUP_HEADER_ID);
                    _header.REVENUE_OBJECT = tempTable4;
                    angular.forEach(_header.REVENUE_OBJECT, function (_row) {
                        
                        var existing = $scope.ALL_AREA_TOTALS.REVENUE.find(item => item.CATEGORY_NAME === _row.CATEGORY_NAME);
                        if (existing) {
                            existing.TOTAL_UNITS += _row.TOTAL_UNITS;
                            existing.TOTAL_GROSS += _row.TOTAL_GROSS;
                            existing.TOTAL_DISC_CPN += _row.TOTAL_DISC_CPN;
                            existing.TOTAL_VAT_TAX += _row.TOTAL_VAT_TAX;
                            existing.NET_TOTAL += _row.NET_TOTAL;
                            existing.TOTAL_TOTAL_PER += _row.TOTAL_TOTAL_PER;

                        }
                        else {
                            $scope.ALL_AREA_TOTALS.REVENUE.push(_row);
                        }

                    });

                    //if (tempTable4.length > 0) {
                    //    _header.REVENUE_OBJECT = tempTable4[0];
                    //    var existing = $scope.ALL_AREA_TOTALS.REVENUE.find(item => item.CATEGORY_NAME === currentItem.CATEGORY_NAME);
                    //    if (existing) {
                    //        existing.TOTAL_UNITS += _header.REVENUE_OBJECT.TOTAL_UNITS;
                    //        existing.TOTAL_GROSS += _header.REVENUE_OBJECT.TOTAL_GROSS;
                    //        existing.TOTAL_DISC_CPN += _header.REVENUE_OBJECT.TOTAL_DISC_CPN;
                    //        existing.TOTAL_VAT_TAX += _header.REVENUE_OBJECT.TOTAL_VAT_TAX;
                    //        existing.NET_TOTAL += _header.REVENUE_OBJECT.NET_TOTAL;
                    //        existing.TOTAL_TOTAL_PER += _header.REVENUE_OBJECT.TOTAL_TOTAL_PER;

                    //    }
                    //    else {
                    //        $scope.ALL_AREA_TOTALS.REVENUE.push(_header.REVENUE_OBJECT);
                    //    }
                    //}
                }

                if (data.data.Table5.length > 0) {
                    var tempTable5 = data.data.Table5.filter(_row => _row.CASHUP_HEADER_ID == _header.CASHUP_HEADER_ID);
                    if (tempTable5.length > 0) {
                        _header.SERVICE_CHARGE = tempTable5[0].SERVICE_CHARGE;
                        _header.HOUSE_TIPS = tempTable5[0].TIPS;
                    }
                }

                let total_session_data = $scope.ALL_AREA_DATA.filter(_row => _row.SESSION_MAPPING_ID == _header.SESSION_MAPPING_ID)[0];
                total_session_data.CASH.EPOS += _header.CASHUP_HEADER_VALUES.CASH.EPOS;
                //total_session_data.EPOS_TOTAL += total_session_data.CASH.EPOS;
                total_session_data.CARDS.EPOS += _header.CASHUP_HEADER_VALUES.CARDS.EPOS;
                //total_session_data.EPOS_TOTAL += total_session_data.CARDS.EPOS;
                total_session_data.PETTY_CASH.EPOS += _header.CASHUP_HEADER_VALUES.PETTY_CASH.EPOS;
                //total_session_data.EPOS_TOTAL += total_session_data.PETTY_CASH.EPOS;
                total_session_data.DELIVERY.EPOS += _header.CASHUP_HEADER_VALUES.DELIVERY.EPOS;
                //total_session_data.EPOS_TOTAL += total_session_data.DELIVERY.EPOS;
                total_session_data.ACCOUNT_RECEIVED.EPOS += _header.CASHUP_HEADER_VALUES.ACCOUNT_RECEIVED.EPOS;
                //total_session_data.EPOS_TOTAL_RCV += total_session_data.ACCOUNT_RECEIVED.EPOS;
                total_session_data.ACCOUNT_CREDIT.EPOS += _header.CASHUP_HEADER_VALUES.ACCOUNT_CREDIT.EPOS;
                //total_session_data.EPOS_TOTAL += total_session_data.ACCOUNT_CREDIT.EPOS;
                total_session_data.VOUCHER_ISSUED.EPOS += _header.CASHUP_HEADER_VALUES.VOUCHER_ISSUED.EPOS;
                //total_session_data.EPOS_TOTAL_RCV += total_session_data.VOUCHER_ISSUED.EPOS;
                total_session_data.VOUCHER_REDEEMED.EPOS += _header.CASHUP_HEADER_VALUES.VOUCHER_REDEEMED.EPOS;
                //total_session_data.EPOS_TOTAL += total_session_data.VOUCHER_REDEEMED.EPOS;
                total_session_data.DEPOSIT_RECEIVED.EPOS += _header.CASHUP_HEADER_VALUES.DEPOSIT_RECEIVED.EPOS;
                //total_session_data.EPOS_TOTAL_RCV += total_session_data.DEPOSIT_RECEIVED.EPOS;
                total_session_data.DEPOSIT_REDEEMED.EPOS += _header.CASHUP_HEADER_VALUES.DEPOSIT_REDEEMED.EPOS;
                //total_session_data.EPOS_TOTAL += total_session_data.DEPOSIT_REDEEMED.EPOS;

                total_session_data.TRANSITORY.EPOS += _header.CASHUP_HEADER_VALUES.TRANSITORY.EPOS;
                total_session_data.COMPLIMENTARY.EPOS += _header.CASHUP_HEADER_VALUES.COMPLIMENTARY.EPOS;
                total_session_data.VOID.EPOS += _header.CASHUP_HEADER_VALUES.VOID.EPOS;
                total_session_data.CASH_TIPS += _header.CASH_TIPS;
                total_session_data.HOUSE_TIPS += _header.HOUSE_TIPS;
                total_session_data.SERVICE_CHARGE += _header.SERVICE_CHARGE;
                
                total_session_data.CASH.ACTUAL += _header.CASHUP_HEADER_VALUES.CASH.ACTUAL;
                //total_session_data.ACTUAL_TOTAL += total_session_data.CASH.ACTUAL
                total_session_data.CARDS.ACTUAL += _header.CASHUP_HEADER_VALUES.CARDS.ACTUAL;
                //total_session_data.ACTUAL_TOTAL += total_session_data.CARDS.ACTUAL;
                total_session_data.PETTY_CASH.ACTUAL += _header.CASHUP_HEADER_VALUES.PETTY_CASH.ACTUAL;
                //total_session_data.ACTUAL_TOTAL += total_session_data.PETTY_CASH.ACTUAL;
                total_session_data.DELIVERY.ACTUAL += _header.CASHUP_HEADER_VALUES.DELIVERY.ACTUAL;
                //total_session_data.ACTUAL_TOTAL += total_session_data.DELIVERY.ACTUAL;
                total_session_data.ACCOUNT_RECEIVED.ACTUAL += _header.CASHUP_HEADER_VALUES.ACCOUNT_RECEIVED.ACTUAL;
                //total_session_data.ACTUAL_TOTAL_RCV += total_session_data.ACCOUNT_RECEIVED.ACTUAL;
                total_session_data.ACCOUNT_CREDIT.ACTUAL += _header.CASHUP_HEADER_VALUES.ACCOUNT_CREDIT.ACTUAL;
                //total_session_data.ACTUAL_TOTAL += total_session_data.ACCOUNT_CREDIT.ACTUAL;
                total_session_data.VOUCHER_ISSUED.ACTUAL += _header.CASHUP_HEADER_VALUES.VOUCHER_ISSUED.ACTUAL;
                //total_session_data.ACTUAL_TOTAL_RCV += total_session_data.VOUCHER_ISSUED.ACTUAL;
                total_session_data.VOUCHER_REDEEMED.ACTUAL += _header.CASHUP_HEADER_VALUES.VOUCHER_REDEEMED.ACTUAL;
                //total_session_data.ACTUAL_TOTAL += total_session_data.VOUCHER_REDEEMED.ACTUAL;
                total_session_data.DEPOSIT_RECEIVED.ACTUAL += _header.CASHUP_HEADER_VALUES.DEPOSIT_RECEIVED.ACTUAL;
                //total_session_data.ACTUAL_TOTAL_RCV += total_session_data.DEPOSIT_RECEIVED.ACTUAL;
                total_session_data.DEPOSIT_REDEEMED.ACTUAL += _header.CASHUP_HEADER_VALUES.DEPOSIT_REDEEMED.ACTUAL;
                //total_session_data.ACTUAL_TOTAL += total_session_data.DEPOSIT_REDEEMED.ACTUAL;
                total_session_data.COMPLIMENTARY.ACTUAL += _header.CASHUP_HEADER_VALUES.COMPLIMENTARY.ACTUAL;
                total_session_data.VOID.ACTUAL += _header.CASHUP_HEADER_VALUES.VOID.ACTUAL;
            });

            

            angular.forEach($scope.ALL_AREA_DATA, function (_session) {
                $scope.ALL_AREA_TOTALS.CASH.EPOS += _session.CASH.EPOS;
                //$scope.ALL_AREA_TOTALS_EPOS += $scope.ALL_AREA_TOTALS.CASH.EPOS;
                _session.EPOS_TOTAL += _session.CASH.EPOS;

                $scope.ALL_AREA_TOTALS.CARDS.EPOS += _session.CARDS.EPOS;
                //$scope.ALL_AREA_TOTALS_EPOS += $scope.ALL_AREA_TOTALS.CARDS.EPOS;
                _session.EPOS_TOTAL += _session.CARDS.EPOS;

                $scope.ALL_AREA_TOTALS.PETTY_CASH.EPOS += _session.PETTY_CASH.EPOS;
                //$scope.ALL_AREA_TOTALS_EPOS += $scope.ALL_AREA_TOTALS.PETTY_CASH.EPOS;
                _session.EPOS_TOTAL += _session.PETTY_CASH.EPOS;

                $scope.ALL_AREA_TOTALS.DELIVERY.EPOS += _session.DELIVERY.EPOS;
                //$scope.ALL_AREA_TOTALS_EPOS += $scope.ALL_AREA_TOTALS.DELIVERY.EPOS;
                _session.EPOS_TOTAL += _session.DELIVERY.EPOS;

                $scope.ALL_AREA_TOTALS.ACCOUNT_CREDIT.EPOS += _session.ACCOUNT_CREDIT.EPOS;
                //$scope.ALL_AREA_TOTALS_EPOS += $scope.ALL_AREA_TOTALS.ACCOUNT_CREDIT.EPOS;
                _session.EPOS_TOTAL += _session.ACCOUNT_CREDIT.EPOS;

                $scope.ALL_AREA_TOTALS.ACCOUNT_RECEIVED.EPOS += _session.ACCOUNT_RECEIVED.EPOS;
                //$scope.ALL_AREA_TOTALS_EPOS_RCV += $scope.ALL_AREA_TOTALS.ACCOUNT_RECEIVED.EPOS;
                _session.EPOS_TOTAL_RCV += _session.ACCOUNT_RECEIVED.EPOS;

                $scope.ALL_AREA_TOTALS.VOUCHER_REDEEMED.EPOS += _session.VOUCHER_REDEEMED.EPOS;
                //$scope.ALL_AREA_TOTALS_EPOS += $scope.ALL_AREA_TOTALS.VOUCHER_REDEEMED.EPOS;
                _session.EPOS_TOTAL += _session.VOUCHER_REDEEMED.EPOS;

                $scope.ALL_AREA_TOTALS.VOUCHER_ISSUED.EPOS += _session.VOUCHER_ISSUED.EPOS;
                //$scope.ALL_AREA_TOTALS_EPOS_RCV += $scope.ALL_AREA_TOTALS.VOUCHER_ISSUED.EPOS;
                _session.EPOS_TOTAL_RCV += _session.VOUCHER_ISSUED.EPOS;

                $scope.ALL_AREA_TOTALS.DEPOSIT_RECEIVED.EPOS += _session.DEPOSIT_RECEIVED.EPOS;
                //$scope.ALL_AREA_TOTALS_EPOS_RCV += $scope.ALL_AREA_TOTALS.DEPOSIT_RECEIVED.EPOS;
                _session.EPOS_TOTAL_RCV += _session.DEPOSIT_RECEIVED.EPOS;

                $scope.ALL_AREA_TOTALS.DEPOSIT_REDEEMED.EPOS += _session.DEPOSIT_REDEEMED.EPOS;
                //$scope.ALL_AREA_TOTALS_EPOS += $scope.ALL_AREA_TOTALS.DEPOSIT_REDEEMED.EPOS;
                _session.EPOS_TOTAL += _session.DEPOSIT_REDEEMED.EPOS;

                $scope.ALL_AREA_TOTALS.TRANSITORY.EPOS += _session.TRANSITORY.EPOS;
                //$scope.ALL_AREA_TOTALS_EPOS += $scope.ALL_AREA_TOTALS.DEPOSIT_REDEEMED.EPOS;
                _session.EPOS_TOTAL += _session.TRANSITORY.EPOS;

                $scope.ALL_AREA_TOTALS_EPOS += _session.EPOS_TOTAL
                $scope.ALL_AREA_TOTALS_EPOS_RCV += _session.EPOS_TOTAL_RCV;

                $scope.ALL_AREA_TOTALS.COMPLIMENTARY.EPOS += _session.COMPLIMENTARY.EPOS;
                $scope.ALL_AREA_TOTALS.VOID.EPOS += _session.VOID.EPOS;

                $scope.ALL_AREA_TOTALS.CASH_TIPS_TOTAL += _session.CASH_TIPS;
                $scope.ALL_AREA_TOTALS.HOUSE_TIPS_TOTAL += _session.HOUSE_TIPS;
                $scope.ALL_AREA_TOTALS.SERVICE_CHARGE_TOTAL += _session.SERVICE_CHARGE;





                $scope.ALL_AREA_TOTALS.CASH.ACTUAL += _session.CASH.ACTUAL;
                //$scope.ALL_AREA_TOTALS_ACTUAL += $scope.ALL_AREA_TOTALS.CASH.ACTUAL;
                _session.ACTUAL_TOTAL += _session.CASH.ACTUAL;

                $scope.ALL_AREA_TOTALS.CARDS.ACTUAL += _session.CARDS.ACTUAL;
                //$scope.ALL_AREA_TOTALS_ACTUAL += $scope.ALL_AREA_TOTALS.CARDS.ACTUAL;
                _session.ACTUAL_TOTAL += _session.CARDS.ACTUAL;

                $scope.ALL_AREA_TOTALS.PETTY_CASH.ACTUAL += _session.PETTY_CASH.ACTUAL;
                //$scope.ALL_AREA_TOTALS_ACTUAL += $scope.ALL_AREA_TOTALS.PETTY_CASH.ACTUAL;
                _session.ACTUAL_TOTAL += _session.PETTY_CASH.ACTUAL;

                $scope.ALL_AREA_TOTALS.DELIVERY.ACTUAL += _session.DELIVERY.ACTUAL;
                //$scope.ALL_AREA_TOTALS_ACTUAL += $scope.ALL_AREA_TOTALS.DELIVERY.ACTUAL;
                _session.ACTUAL_TOTAL += _session.DELIVERY.ACTUAL;

                $scope.ALL_AREA_TOTALS.ACCOUNT_CREDIT.ACTUAL += _session.ACCOUNT_CREDIT.ACTUAL;
                //$scope.ALL_AREA_TOTALS_ACTUAL += $scope.ALL_AREA_TOTALS.ACCOUNT_CREDIT.ACTUAL;
                _session.ACTUAL_TOTAL += _session.ACCOUNT_CREDIT.ACTUAL;

                $scope.ALL_AREA_TOTALS.ACCOUNT_RECEIVED.ACTUAL += _session.ACCOUNT_RECEIVED.ACTUAL;
                //$scope.ALL_AREA_TOTALS_ACTUAL_RCV += $scope.ALL_AREA_TOTALS.ACCOUNT_RECEIVED.ACTUAL;
                _session.ACTUAL_TOTAL_RCV += _session.ACCOUNT_RECEIVED.ACTUAL;

                $scope.ALL_AREA_TOTALS.VOUCHER_REDEEMED.ACTUAL += _session.VOUCHER_REDEEMED.ACTUAL;
                //$scope.ALL_AREA_TOTALS_ACTUAL += $scope.ALL_AREA_TOTALS.VOUCHER_REDEEMED.ACTUAL;
                _session.ACTUAL_TOTAL += _session.VOUCHER_REDEEMED.ACTUAL;

                $scope.ALL_AREA_TOTALS.VOUCHER_ISSUED.ACTUAL += _session.VOUCHER_ISSUED.ACTUAL;
                //$scope.ALL_AREA_TOTALS_ACTUAL_RCV += $scope.ALL_AREA_TOTALS.VOUCHER_ISSUED.ACTUAL;
                _session.ACTUAL_TOTAL_RCV += _session.VOUCHER_ISSUED.ACTUAL;

                $scope.ALL_AREA_TOTALS.DEPOSIT_RECEIVED.ACTUAL += _session.DEPOSIT_RECEIVED.ACTUAL;
                //$scope.ALL_AREA_TOTALS_ACTUAL_RCV += $scope.ALL_AREA_TOTALS.DEPOSIT_RECEIVED.ACTUAL;
                _session.ACTUAL_TOTAL_RCV += _session.DEPOSIT_RECEIVED.ACTUAL;

                $scope.ALL_AREA_TOTALS.DEPOSIT_REDEEMED.ACTUAL += _session.DEPOSIT_REDEEMED.ACTUAL;
                //$scope.ALL_AREA_TOTALS_ACTUAL += $scope.ALL_AREA_TOTALS.DEPOSIT_REDEEMED.ACTUAL;
                _session.ACTUAL_TOTAL += _session.DEPOSIT_REDEEMED.ACTUAL;

                $scope.ALL_AREA_TOTALS_ACTUAL += _session.ACTUAL_TOTAL;
                $scope.ALL_AREA_TOTALS_ACTUAL_RCV += _session.ACTUAL_TOTAL_RCV;

                $scope.ALL_AREA_TOTALS.COMPLIMENTARY.ACTUAL += _session.COMPLIMENTARY.ACTUAL;
                $scope.ALL_AREA_TOTALS.VOID.ACTUAL += _session.VOID.ACTUAL;
            });
        });
    }
    //$scope.CASHUP_REVIEW();
    $scope.GET_PETTY_CASH_DECLERATION = function (cashup_header_id) {
        var Obj = new Object();
        Obj.CASHUP_HEADER_ID = cashup_header_id;
        PrcCommMethods.CASHUP_APP_API(Obj, 'GET_PETTY_CASH_DECLERATION').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.PETTY_CASH_DECLARATION_LIST = data.data.Table;
            }
            else {
                $scope.PETTY_CASH_DECLARATION_LIST = [];
            }
        });
    };
    $scope.GET_PETTY_CASH_BY_CASHUP_MAIN_ID = function () {
        var CashupAppModelObj = new Object();
        CashupAppModelObj.CASHUP_MAIN_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_MAIN_ID;
        PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'GET_PETTY_CASH_BY_CASHUP_MAIN_ID').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.PETTY_CASH_DECLARATION_ALL_AREA_LIST = data.data.Table;
            }
            else {
                $scope.PETTY_CASH_DECLARATION_ALL_AREA_LIST = [];
            }
        });
    } 
    $scope.GET_CASHUP_REVIEW_NOTES = function (_cashup_header_id,_cashup_main_id) {
        var Obj = new Object();
        Obj.CASHUP_HEADER_ID = _cashup_header_id;
        if (_cashup_main_id == null || _cashup_main_id == undefined) {
            Obj.CASHUP_MAIN_ID = null;
        }
        else {
            Obj.CASHUP_MAIN_ID = _cashup_main_id;
        }
        PrcCommMethods.CASHUP_APP_API(Obj, 'GET_CASHUP_REVIEW_NOTES').then(function (data) {
            if (_cashup_main_id == null || _cashup_main_id == undefined) {
                if (data.data.Table.length > 0) {
                    $scope.REVIEW_TAB_NOTE_LIST = data.data.Table;
                }
                else {
                    $scope.REVIEW_TAB_NOTE_LIST = [];
                }
            }
            else {
                if (data.data.Table.length > 0) {
                    $scope.REVIEW_ALL_TAB_NOTE_LIST = data.data.Table;
                }
                else {
                    $scope.REVIEW_ALL_TAB_NOTE_LIST = [];
                }
            }

            
            //if (data.data.Table.length > 0) {
            //    if (_cashup_main_id == null || _cashup_main_id == undefined) {
            //        $scope.REVIEW_TAB_NOTE_LIST = data.data.Table;
            //    }
            //    else {
            //        $scope.REVIEW_ALL_TAB_NOTE_LIST = data.data.Table;
            //    }
            //}
            //else {
            //    $scope.REVIEW_TAB_NOTE_LIST = [];
            //    $scope.REVIEW_ALL_TAB_NOTE_LIST = [];
            //}
        });
    }
    $scope.GET_CASHUP_REVIEW_NOTES($scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_ID);
    $scope.GET_CASHUP_REVIEW_NOTES(null, $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_MAIN_ID);

    //$scope.ADMIN_GET_AREA = function () {
    //    var AreaModelObj = new Object();
    //    AreaModelObj.CUSTOMER_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.CUSTOMER_ID;
    //    AreaModelObj.AREA_CODE = null;
    //    AreaModelObj.AREA_NAME = null;
    //    AreaModelObj.ACTIVE = 1;
    //    AreaModelObj.PAGE_NO = 0;
    //    AreaModelObj.PAGE_SIZE = 0;
    //    AreaModelObj.BRANCH_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID;
    //    PrcCommMethods.ADMIN_API(AreaModelObj, 'ADMIN_GET_AREA').then(function (data) {
    //        if (data.data && data.data.Table.length > 0) {
    //            $scope.AREA_LIST = data.data.Table;
    //        } else {
    //            $scope.AREA_LIST = [];
    //        }
    //    });
    //};
    //$scope.ADMIN_GET_AREA();
    $scope.ADMIN_GET_CU_SESSION_MAPPING_Fn = function () {
        var SessionObj = new Object();
        SessionObj.BRANCH_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID;
        PrcCommMethods.CASHUP_APP_API(SessionObj, 'GET_SESSION_BY_BRANCH').then(function (data) {
            if (data.data && data.data.length > 0) {


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
                //$scope.SESSION_LIST = data.data.filter(_row => _row.ACTIVE == 1);
                angular.forEach($scope.SESSION_LIST, function (_session) {
                    var all_area_data_obj = new Object();
                    all_area_data_obj.SELECTED = false;
                    all_area_data_obj.SESSION_MAPPING_ID = _session.SESSION_MAPPING_ID;
                    all_area_data_obj.SESSION_NAME = _session.SESSION_NAME;
                    all_area_data_obj.CASH = {
                        EPOS: 0,
                        ACTUAL: 0
                    }
                    all_area_data_obj.CARDS = {
                        EPOS: 0,
                        ACTUAL: 0
                    }
                    all_area_data_obj.PETTY_CASH = {
                        EPOS: 0,
                        ACTUAL: 0
                    }
                    all_area_data_obj.DELIVERY = {
                        EPOS: 0,
                        ACTUAL: 0
                    }
                    all_area_data_obj.ACCOUNT_RECEIVED = {
                        EPOS: 0,
                        ACTUAL: 0
                    }
                    all_area_data_obj.ACCOUNT_CREDIT = {
                        EPOS: 0,
                        ACTUAL: 0
                    }
                    all_area_data_obj.VOUCHER_ISSUED = {
                        EPOS: 0,
                        ACTUAL: 0
                    }
                    all_area_data_obj.VOUCHER_REDEEMED = {
                        EPOS: 0,
                        ACTUAL: 0
                    }
                    all_area_data_obj.DEPOSIT_RECEIVED = {
                        EPOS: 0,
                        ACTUAL: 0
                    }
                    all_area_data_obj.DEPOSIT_REDEEMED = {
                        EPOS: 0,
                        ACTUAL: 0
                    }
                    all_area_data_obj.COMPLIMENTARY = {
                        EPOS: 0,
                        ACTUAL: 0
                    }
                    all_area_data_obj.VOID = {
                        EPOS: 0,
                        ACTUAL: 0
                    }
                    all_area_data_obj.TRANSITORY = {
                        EPOS: 0,
                        ACTUAL: 0
                    }
                    all_area_data_obj.CASH_TIPS = 0;
                    all_area_data_obj.HOUSE_TIPS = 0;
                    all_area_data_obj.SERVICE_CHARGE = 0;
                    all_area_data_obj.EPOS_TOTAL = 0;
                    all_area_data_obj.EPOS_TOTAL_RCV = 0;
                    all_area_data_obj.ACTUAL_TOTAL = 0;
                    all_area_data_obj.ACTUAL_TOTAL_RCV = 0;
                    $scope.ALL_AREA_DATA.push(all_area_data_obj);
                })
                $scope.Fn_REVIEW_SESSION_CLICK($scope.SESSION_LIST.filter(_row => _row.SESSION_MAPPING_ID == $scope.$parent.CASHUP_ENTRY_SEARCH.SESSION_ID)[0]);
            } else {
                console.warn("No sessions found for branch ID " + BRANCH_ID);
                $scope.SESSION_MAPPING_LIST = [];
            }
            $scope.CASHUP_REVIEW();
        })
    };
    $scope.ADMIN_GET_CU_SESSION_MAPPING_Fn();
    

    $scope.Fn_REVIEW_TAB_CLICK = function (_area) {
        if (_area == 'all') {
            $scope.ACTIVE_REVIEW_TAB_ALL_AREA = true;
        }
        else {
            $scope.ACTIVE_REVIEW_TAB_ALL_AREA = false;
            $scope.ACTIVE_REVIEW_TAB_AREA_ID = _area.AREA_ID;
            $scope.SELECTED_DATA.AREA_ID = _area.AREA_ID;
            $scope.SELECTED_DATA.AREA_NAME = _area.AREA_NAME;
            $scope.Fn_REVIEW_SESSION_CLICK($scope.SESSION_LIST[0]);
        }
        //$scope.ACTIVE_REVIEW_TAB_ALL_AREA = false;
        //$scope.ACTIVE_REVIEW_TAB_AREA_ID = _area.AREA_ID;
        //$scope.SELECTED_DATA.AREA_ID = _area.AREA_ID;
        //$scope.SELECTED_DATA.AREA_NAME = _area.AREA_NAME;
        //$scope.Fn_REVIEW_SESSION_CLICK($scope.SESSION_LIST[0]);
    }
    $scope.CURRENT_CASHUP_HEADER = $scope.CASHUP_HEADER.filter(_row => _row.CASHUP_HEADER_ID == $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_ID)[0];
    $scope.SELECTED_DATA.CURRENT_CASHUP_HEADER = $scope.CURRENT_CASHUP_HEADER;
    $scope.GET_PETTY_CASH_DECLERATION($scope.CURRENT_CASHUP_HEADER.CASHUP_HEADER_ID);
    $scope.GET_PETTY_CASH_BY_CASHUP_MAIN_ID();
    $scope.Fn_REVIEW_SESSION_CLICK = function (_session) {
        $scope.SELECTED_DATA.SESSION_MAPPING_ID = _session.SESSION_MAPPING_ID;
        $scope.SELECTED_DATA.SESSION_NAME = _session.SESSION_NAME;

        if ($scope.$parent.CASHUP_BY_AREA == true || $scope.$parent.CASHUP_BY_AREA == 1) {
            $scope.CURRENT_CASHUP_HEADER = $scope.CASHUP_HEADER.filter(_row => _row.SESSION_MAPPING_ID == $scope.SELECTED_DATA.SESSION_MAPPING_ID && _row.AREA_ID == $scope.SELECTED_DATA.AREA_ID)[0];
        }
        else if ($scope.$parent.CASHUP_BY_AREA == false || $scope.$parent.CASHUP_BY_AREA == 0) {
            $scope.CURRENT_CASHUP_HEADER = $scope.CASHUP_HEADER.filter(_row => _row.SESSION_MAPPING_ID == $scope.SELECTED_DATA.SESSION_MAPPING_ID)[0];
        }
        
        $scope.SELECTED_DATA.CURRENT_CASHUP_HEADER = $scope.CURRENT_CASHUP_HEADER;
        $scope.GET_PETTY_CASH_DECLERATION($scope.CURRENT_CASHUP_HEADER.CASHUP_HEADER_ID);
        $scope.GET_CASHUP_REVIEW_NOTES($scope.CURRENT_CASHUP_HEADER.CASHUP_HEADER_ID);
        $scope.$parent.SELECTED_SITE = $scope.CURRENT_CASHUP_HEADER.BRANCH_NAME;
        $scope.$parent.SELECTED_AREA = $scope.CURRENT_CASHUP_HEADER.AREA_NAME;
        $scope.$parent.SELECTED_SESSION = $scope.CURRENT_CASHUP_HEADER.SESSION_NAME;
        $scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID = $scope.CURRENT_CASHUP_HEADER.BRANCH_ID;
        $scope.$parent.CASHUP_ENTRY_SEARCH.AREA_ID = $scope.CURRENT_CASHUP_HEADER.AREA_ID;
        $scope.$parent.CASHUP_ENTRY_SEARCH.SESSION_ID = $scope.CURRENT_CASHUP_HEADER.SESSION_MAPPING_ID;
        $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_ID = $scope.CURRENT_CASHUP_HEADER.CASHUP_HEADER_ID;
        $scope.GET_CASHUP_ENTRY_HEADER($scope.CURRENT_CASHUP_HEADER.CASHUP_HEADER_ID);
    }
    
    $scope.TOGGLE_SESSION_VIEW = function (_session) {
        angular.forEach($scope.ALL_AREA_DATA, function (_row) {
            if (_row.SESSION_MAPPING_ID == _session.SESSION_MAPPING_ID) {
                _session.SELECTED = !_session.SELECTED;
            }
            else {
                _row.SELECTED = false;
            }
        })
    }
    $scope.note_init = function (_note) {
        _note.isEdit = false;
    }
    $scope.SAVE_NOTE = function (flag) {
        $scope.REVIEW_TAB_NOTE_ENTRY.CurrentNoteObj.CASHUP_REVIEW_NOTE_ID = $scope.REVIEW_TAB_NOTE_ENTRY.CASHUP_REVIEW_NOTE_ID;
        $scope.REVIEW_TAB_NOTE_ENTRY.CurrentNoteObj.TITLE = $scope.REVIEW_TAB_NOTE_ENTRY.TITLE;
        $scope.REVIEW_TAB_NOTE_ENTRY.CurrentNoteObj.NOTE = $scope.REVIEW_TAB_NOTE_ENTRY.NOTE;
        $scope.REVIEW_TAB_NOTE_ENTRY.CurrentNoteObj.ACTIVE = $scope.REVIEW_TAB_NOTE_ENTRY.ACTIVE;
        //if (flag == null || flag == undefined) {
        //    $scope.CashupReviewCommentsFormHEADER.submitted = true;
        //    if ($scope.CashupReviewCommentsFormHEADER.$valid) {
        //        $scope.INS_UPD_CASHUP_REVIEW_NOTES($scope.REVIEW_TAB_NOTE_ENTRY.CurrentNoteObj);
        //    }
            
        //}
        //else if (flag == 1) {
        //    $scope.CashupReviewCommentsFormMAIN.submitted = true;
        //    if ($scope.CashupReviewCommentsFormMAIN.$valid) {
        //        $scope.INS_UPD_CASHUP_REVIEW_NOTES($scope.REVIEW_TAB_NOTE_ENTRY.CurrentNoteObj, flag);
        //    }
        //}
        if ($scope.REVIEW_TAB_NOTE_ENTRY.TITLE == null || $scope.REVIEW_TAB_NOTE_ENTRY.TITLE.trim().length == 0) {
            $scope.$parent.ShowAlertBox('Error', 'Comment Title Cannot be empty');
            return;
        }
        else if ($scope.REVIEW_TAB_NOTE_ENTRY.NOTE == null || $scope.REVIEW_TAB_NOTE_ENTRY.NOTE.trim().length == 0) {
            $scope.$parent.ShowAlertBox('Error', 'Comment Body Cannot be empty');
            return;
        }


        if (flag == null || flag == undefined) {
            $scope.INS_UPD_CASHUP_REVIEW_NOTES($scope.REVIEW_TAB_NOTE_ENTRY.CurrentNoteObj);
        }
        else if (flag == 1) {
            $scope.INS_UPD_CASHUP_REVIEW_NOTES($scope.REVIEW_TAB_NOTE_ENTRY.CurrentNoteObj, flag);
        }
    }
    $scope.EDIT_NOTE = function (_note) {
        _note.isEdit = true;
        $scope.REVIEW_TAB_NOTE_ENTRY.CurrentNoteObj = _note;
        $scope.REVIEW_TAB_NOTE_ENTRY.CASHUP_REVIEW_NOTE_ID = _note.CASHUP_REVIEW_NOTE_ID;
        $scope.REVIEW_TAB_NOTE_ENTRY.TITLE = _note.TITLE;
        $scope.REVIEW_TAB_NOTE_ENTRY.NOTE = _note.NOTE;
        $scope.REVIEW_TAB_NOTE_ENTRY.ACTIVE = _note.ACTIVE;

    }
    $scope.DELETE_NOTE = function (_note) {
        _note.ACTIVE = 0;
        $scope.INS_UPD_CASHUP_REVIEW_NOTES(_note);
    }
    $scope.CHECK_ELIGIBILITY = function () {
        var isEligible = true;
        angular.forEach($scope.CASHUP_HEADER, function (_header) {
            if(_header.STATUS != 3){
                isEligible = false;
                return;
            }
        })
        return isEligible;
    }
    
    $scope.INS_UPD_CASHUP_REVIEW_NOTES = function (_note,flag) {
        var Obj = new Object();
        Obj.CASHUP_REVIEW_NOTE_ID = _note.CASHUP_REVIEW_NOTE_ID;
        Obj.TITLE = _note.TITLE;
        Obj.NOTE = _note.NOTE;
        if (flag == null || flag == undefined) {
            Obj.CASHUP_HEADER_ID = $scope.CURRENT_CASHUP_HEADER.CASHUP_HEADER_ID;
        }
        else if(flag==1) {
            Obj.CASHUP_HEADER_ID = null;
        }
        Obj.CASHUP_MAIN_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_MAIN_ID;
        Obj.CASHUP_DATE = moment($scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).format($scope.$parent.DB_DATE_FORMAT);
        Obj.ENTITY_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.ENTITY_ID;
        Obj.BRANCH_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID;
        if (_note.ACTIVE == true) {
            _note.ACTIVE = 1;
        }
        else if (_note.ACTIVE == false) {
            _note.ACTIVE = 0;
        }
        Obj.ACTIVE = _note.ACTIVE;
        Obj.USER_ID = $cookies.get("USERID");
        PrcCommMethods.CASHUP_APP_API(Obj, 'INS_UPD_CASHUP_REVIEW_NOTES').then(function (data) {
            $scope.GET_CASHUP_REVIEW_NOTES($scope.CURRENT_CASHUP_HEADER.CASHUP_HEADER_ID);
            $scope.GET_CASHUP_REVIEW_NOTES(null, $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_MAIN_ID);
            $scope.REVIEW_TAB_NOTE_ENTRY.CurrentNoteObj = {};
            $scope.REVIEW_TAB_NOTE_ENTRY.CASHUP_REVIEW_NOTE_ID = 0;
            $scope.REVIEW_TAB_NOTE_ENTRY.TITLE = null;
            $scope.REVIEW_TAB_NOTE_ENTRY.NOTE = null;
            $scope.REVIEW_TAB_NOTE_ENTRY.ACTIVE = 1;
        });
    }
    $scope.UPD_CASHUP_REVIEW_STATUS = function (flag) {

        if (flag == 5) {
            $scope.RejectionForm.submitted = true;
            if ($scope.RejectionForm.$valid) {
                var TABLE_ID_LIST = [];
                var CashupAppModelObj = new Object();
                CashupAppModelObj.STATUS_FLAG = flag;
                angular.forEach($scope.CASHUP_HEADER, function (_row) {
                    var _header = new Object();
                    _header.TABLE_ID = _row.CASHUP_HEADER_ID;
                    TABLE_ID_LIST.push(_header);
                })
                CashupAppModelObj.TABLE_ID_LIST = TABLE_ID_LIST;
                CashupAppModelObj.USER_ID = $scope.USER_ID;
                CashupAppModelObj.REJECTION_COMMENT = $scope.REJECTION_COMMENT;
                PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'UPD_CASHUP_REVIEW_STATUS').then(function (data) {
                    if (data.data != 0) {
                        var modalEl = document.getElementById('rejection');
                        var existingModal = bootstrap.Modal.getInstance(modalEl);
                        if (existingModal) {
                            existingModal.hide();
                        }
                        $location.path('Cashup_Register');
                    }
                    else {
                        $scope.$parent.ShowAlertBox('Error', "Something went wrong.");
                    }
                });
            }
        }
        else {
            if (flag == 3) {
                var TABLE_ID_LIST = [];
                var CashupAppModelObj = new Object();
                CashupAppModelObj.STATUS_FLAG = flag;
                var _header = new Object();
                _header.TABLE_ID = $scope.CURRENT_CASHUP_HEADER.CASHUP_HEADER_ID;
                TABLE_ID_LIST.push(_header);
                CashupAppModelObj.TABLE_ID_LIST = TABLE_ID_LIST;
                CashupAppModelObj.USER_ID = $scope.USER_ID;
                CashupAppModelObj.REJECTION_COMMENT = null;
            }
            else if (flag == 4) {
                var TABLE_ID_LIST = [];
                var CashupAppModelObj = new Object();
                CashupAppModelObj.STATUS_FLAG = flag;
                angular.forEach($scope.CASHUP_HEADER, function (_row) {
                    var _header = new Object();
                    _header.TABLE_ID = _row.CASHUP_HEADER_ID;
                    TABLE_ID_LIST.push(_header);
                })
                CashupAppModelObj.TABLE_ID_LIST = TABLE_ID_LIST;
                CashupAppModelObj.USER_ID = $scope.USER_ID;
                CashupAppModelObj.REJECTION_COMMENT = null;
            }

            PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'UPD_CASHUP_REVIEW_STATUS').then(function (data) {
                if (data.data != 0) {
                    $location.path('Cashup_Register');
                }
                else {
                    $scope.$parent.ShowAlertBox('Error', "Something went wrong.");
                }
            });
        }
    }
    $scope.$on('$destroy', function () {
        $('.modal.show').modal('hide');
        $('.dropdown-menu').hide();
    });
});