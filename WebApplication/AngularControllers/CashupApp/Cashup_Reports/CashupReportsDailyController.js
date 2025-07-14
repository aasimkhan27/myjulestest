app.controller('CashupReportsDailyController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(2);
    $scope.$parent.CASHUP_COMMON_RESET_Fn();
    $scope.CASHUP_PRIVILEGE = '1172';
    $scope.$parent.GET_PRIVILEGE($scope.CASHUP_PRIVILEGE);
    $scope.$watch('REPORTS_SITES_LIST', function (newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.selectSite($scope.REPORTS_SITES_LIST[0]);
        }
    });
    $scope.REVIEW_DAILY_CASHUP_Obj = {
        SELECTED_SITE: null,
        CASHUP_DATE: null
    }
    $scope.CASHUP_HEADER = [];
    $scope.CASHUP_HEADER_LIST = [];
    $scope.SESSION_LIST = [];
    $scope.AREA_LIST = [];
    
    //$scope.SELECTED_DATA = {
    //    AREA_ID: null,
    //    AREA_NAME: null,
    //    SESSION_NAME: null,
    //    SESSION_MAPPING_ID: null,
    //    CURRENT_CASHUP_HEADER: null
    //}
    
    $scope.ALL_AREA_DATA = [];
    $scope.ALL_AREA_TOTALS_EPOS = 0;
    $scope.ALL_AREA_TOTALS_EPOS_RCV = 0;
    $scope.ALL_AREA_TOTALS_ACTUAL = 0;
    $scope.ALL_AREA_TOTALS_ACTUAL_RCV = 0;
    $scope.ALL_AREA_TOTALS = {
        CASH: {
            EPOS: 0,
            ACTUAL: 0
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
        REVENUE: []
    }

    $scope.CASHUP_REVIEW = function () {
        var TABLE_ID_LIST = [];
        var CashupAppModelObj = new Object();
        angular.forEach($scope.CASHUP_HEADER, function (_row) {
            var _header = new Object();
            _header.TABLE_ID = _row.CASHUP_HEADER_ID;
            TABLE_ID_LIST.push(_header);
        })
        CashupAppModelObj.TABLE_ID_LIST = TABLE_ID_LIST;

    }
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
                else {
                    $scope.ALL_AREA_TOTALS.REVENUE = [];
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

    $scope.CLEAR_DATA = function () {
        $scope.SESSION_LIST = [];
        $scope.AREA_LIST = [];
        $scope.CASHUP_HEADER = [];
        $scope.ALL_AREA_DATA = [];
        $scope.ALL_AREA_TOTALS_EPOS = 0;
        $scope.ALL_AREA_TOTALS_EPOS_RCV = 0;
        $scope.ALL_AREA_TOTALS_ACTUAL = 0;
        $scope.ALL_AREA_TOTALS_ACTUAL_RCV = 0;

        $scope.ALL_AREA_TOTALS.CASH.EPOS = 0;
        $scope.ALL_AREA_TOTALS.CASH.ACTUAL = 0;
        
        $scope.ALL_AREA_TOTALS.CARDS.EPOS = 0;
        $scope.ALL_AREA_TOTALS.CARDS.ACTUAL = 0;

        $scope.ALL_AREA_TOTALS.PETTY_CASH.EPOS = 0;
        $scope.ALL_AREA_TOTALS.PETTY_CASH.ACTUAL = 0;

        $scope.ALL_AREA_TOTALS.DELIVERY.EPOS = 0;
        $scope.ALL_AREA_TOTALS.DELIVERY.ACTUAL = 0;

        $scope.ALL_AREA_TOTALS.ACCOUNT_CREDIT.EPOS = 0;
        $scope.ALL_AREA_TOTALS.ACCOUNT_CREDIT.ACTUAL = 0;

        $scope.ALL_AREA_TOTALS.ACCOUNT_RECEIVED.EPOS = 0;
        $scope.ALL_AREA_TOTALS.ACCOUNT_RECEIVED.ACTUAL = 0;

        $scope.ALL_AREA_TOTALS.DEPOSIT_RECEIVED.EPOS = 0;
        $scope.ALL_AREA_TOTALS.DEPOSIT_RECEIVED.ACTUAL = 0;

        $scope.ALL_AREA_TOTALS.DEPOSIT_REDEEMED.EPOS = 0;
        $scope.ALL_AREA_TOTALS.DEPOSIT_REDEEMED.ACTUAL = 0;
            
        $scope.ALL_AREA_TOTALS.VOUCHER_ISSUED.EPOS = 0;
        $scope.ALL_AREA_TOTALS.VOUCHER_ISSUED.ACTUAL = 0;    
           
        $scope.ALL_AREA_TOTALS.VOUCHER_REDEEMED.EPOS = 0;
        $scope.ALL_AREA_TOTALS.VOUCHER_REDEEMED.ACTUAL = 0;

        $scope.ALL_AREA_TOTALS.COMPLIMENTARY.EPOS = 0;
        $scope.ALL_AREA_TOTALS.COMPLIMENTARY.ACTUAL = 0;
   
        $scope.ALL_AREA_TOTALS.VOID.EPOS = 0;
        $scope.ALL_AREA_TOTALS.VOID.ACTUAL = 0;    

        $scope.ALL_AREA_TOTALS.TRANSITORY.EPOS = 0;
        $scope.ALL_AREA_TOTALS.TRANSITORY.ACTUAL = 0;

        $scope.ALL_AREA_TOTALS.CASH_TIPS_TOTAL = 0;
        $scope.ALL_AREA_TOTALS.HOUSE_TIPS_TOTAL = 0;
        $scope.ALL_AREA_TOTALS.SERVICE_CHARGE_TOTAL = 0;
        $scope.ALL_AREA_TOTALS.REVENUE = [];
        
    }
    $scope.INS_CASHUP_HEADER = function () {
        var CashupAppModelObj = new Object();
        CashupAppModelObj.CASHUP_MAIN_ID = 0;
        CashupAppModelObj.CASHUP_DATE = moment($scope.REVIEW_DAILY_CASHUP_Obj.CASHUP_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).format($scope.$parent.DB_DATE_FORMAT);
        CashupAppModelObj.BRANCH_ID = $scope.REVIEW_DAILY_CASHUP_Obj.SELECTED_SITE.BRANCH_ID;
        CashupAppModelObj.USER_ID = parseInt($cookies.get("USERID"));
        CashupAppModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'INS_CASHUP_HEADER').then(function (data) {
            if (data.data.Table != null && data.data.Table != undefined && data.data.Table.length > 0) {
                $scope.CASHUP_HEADER_LIST = data.data.Table;
                $scope.CLEAR_DATA();
                const areaMap = {};
                const sessionMap = {};
                angular.forEach($scope.CASHUP_HEADER_LIST, function (item) {
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
                            SESSION_NAME: item.SESSION_NAME,
                            SORT_ORDER: item.SORT_ORDER
                        };
                    }
                });
                $scope.AREA_LIST = Object.values(areaMap);
                $scope.SESSION_LIST = Object.values(sessionMap);

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
                $scope.CASHUP_HEADER=[];
                angular.forEach($scope.CASHUP_HEADER_LIST, function (_row) {
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
                });
                $scope.CASHUP_REVIEW();
            }
            else {
                $scope.CASHUP_HEADER_LIST = [];
                $scope.AREA_LIST = [];
                $scope.SESSION_LIST = [];
                $scope.ALL_AREA_DATA = [];
                $scope.ALL_AREA_TOTALS_EPOS = 0;
                $scope.ALL_AREA_TOTALS_EPOS_RCV = 0;
                $scope.ALL_AREA_TOTALS_ACTUAL = 0;
                $scope.ALL_AREA_TOTALS_ACTUAL_RCV = 0;
                $scope.ALL_AREA_TOTALS.CASH.EPOS = 0;
                $scope.ALL_AREA_TOTALS.CASH.ACTUAL = 0;


                $scope.ALL_AREA_TOTALS.CARDS.EPOS = 0;
                $scope.ALL_AREA_TOTALS.CARDS.ACTUAL = 0;

                $scope.ALL_AREA_TOTALS.PETTY_CASH.EPOS = 0;
                $scope.ALL_AREA_TOTALS.PETTY_CASH.ACTUAL = 0;

                $scope.ALL_AREA_TOTALS.DELIVERY.EPOS = 0;
                $scope.ALL_AREA_TOTALS.DELIVERY.ACTUAL = 0;


                $scope.ALL_AREA_TOTALS.ACCOUNT_CREDIT.EPOS = 0;
                $scope.ALL_AREA_TOTALS.ACCOUNT_CREDIT.ACTUAL = 0;

                $scope.ALL_AREA_TOTALS.DEPOSIT_RECEIVED.EPOS = 0;
                $scope.ALL_AREA_TOTALS.DEPOSIT_RECEIVED.ACTUAL = 0;

                $scope.ALL_AREA_TOTALS.DEPOSIT_REDEEMED.EPOS = 0;
                $scope.ALL_AREA_TOTALS.DEPOSIT_REDEEMED.ACTUAL = 0;

                $scope.ALL_AREA_TOTALS.VOUCHER_ISSUED.EPOS = 0;
                $scope.ALL_AREA_TOTALS.VOUCHER_ISSUED.ACTUAL = 0;

                $scope.ALL_AREA_TOTALS.VOUCHER_REDEEMED.EPOS = 0;
                $scope.ALL_AREA_TOTALS.VOUCHER_REDEEMED.ACTUAL = 0;

                $scope.ALL_AREA_TOTALS.COMPLIMENTARY.EPOS = 0;
                $scope.ALL_AREA_TOTALS.COMPLIMENTARY.ACTUAL = 0;

                $scope.ALL_AREA_TOTALS.VOID.EPOS = 0;
                $scope.ALL_AREA_TOTALS.VOID.ACTUAL = 0;


                $scope.ALL_AREA_TOTALS.TRANSITORY.EPOS = 0;
                $scope.ALL_AREA_TOTALS.TRANSITORY.ACTUAL = 0;

                $scope.ALL_AREA_TOTALS.TRANSITORY.CASH_TIPS_TOTAL = 0;
                $scope.ALL_AREA_TOTALS.TRANSITORY.HOUSE_TIPS_TOTAL = 0;
                $scope.ALL_AREA_TOTALS.TRANSITORY.SERVICE_CHARGE_TOTAL = 0;
                $scope.ALL_AREA_TOTALS.REVENUE=[];
                
            }
        });
    }

    $scope.selectSite = function (_site) {
        $scope.REVIEW_DAILY_CASHUP_Obj.SELECTED_SITE = _site;
        $scope.INS_CASHUP_HEADER();
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

    $scope.dateinputddmmyy = function (index) {
        $(document).ready(function () {
            var date_inputs = document.getElementsByClassName("dateinputddmmyy") //our date input has the name "date"
            if (date_inputs.length > 0) {
                for (var i = 0; i < date_inputs.length; i++) {
                    var date_input = $('input[name="' + date_inputs[i].name + '"]'); //our date input has the name "date"
                    var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
                    var today = new Date();
                    var options = {
                        todayBtn: "linked",
                        daysOfWeekHighlighted: "0,6",
                        autoclose: true,
                        todayHighlight: false,
                        format: 'yyyy-mm-dd',//,$scope.$parent.CALENDAR_DATE_FORMAT
                        format: $scope.$parent.CALENDAR_DATE_FORMAT,
                        clearBtn: true,
                        closeBtn: true,
                        endDate: today
                    };
                    date_input.off("hide").datepicker(options).on("hide", function (e) {
                        $scope.INS_CASHUP_HEADER();
                    })
                }
            }
        });
    }
    $scope.dateinputddmmyy(1);
});