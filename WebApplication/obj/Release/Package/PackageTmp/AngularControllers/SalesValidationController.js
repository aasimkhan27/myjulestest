app.controller('SalesValidationController', function ($scope, $http, $interval, CommService, $cookies, $filter, PrcCommMethods, $location, readFileData, $localStorage) {
    $(".tooltip").remove();
    $scope.SalesValidationSearch = {
        BRANCH_ID: null, START_DATE: null, END_DATE: null, STATUS_ID: null,
        PAGE_NO: 1, PAGE_SIZE: 10, SELECT_ALL: false
    };
    $scope.BRANCH_LIST = [];
    $scope.CASHUP_LIST_XERO_OUTBOUND_INVOICE = [];
    $scope.CASHUP_LIST_XERO_OUTBOUND_INVOICE_DATA = [];

    $scope.VALIDATION_STATUS = [{
        STATUS_ID: "51",
        STATUS_NAME: "Pending", SELECTED: false
    }, {
        STATUS_ID: "52",
        STATUS_NAME: "Validated", SELECTED: false
    }, {
        STATUS_ID: "53",
        STATUS_NAME: "Pending Processing", SELECTED: false
    }, {
        STATUS_ID: "54",
        STATUS_NAME: "Processing", SELECTED: false
    }, {
        STATUS_ID: "55",
        STATUS_NAME: "Sent To Xero", SELECTED: false
    }, {
        STATUS_ID: "56",
        STATUS_NAME: "Error In Invoice Creation", SELECTED: false
    }, {
        STATUS_ID: "57",
        STATUS_NAME: "Error In Posting Payment", SELECTED: false
    }];

    function reportrange(start, end) {
        $scope.SalesValidationSearch.START_DATE = start.format($scope.$parent.Datelocaleformat.format);
        $scope.SalesValidationSearch.END_DATE = end.format($scope.$parent.Datelocaleformat.format);
        $('#reportrange span').html(start.format($scope.$parent.Datelocaleformat.format) + ' - ' + end.format($scope.$parent.Datelocaleformat.format));
    };
    $(function () {
        startDate = moment().startOf('month');
        endDate = moment().endOf('month');
        $scope.$parent.SetUpDateRangeMultiDatePicker('reportrange', startDate, endDate, reportrange);
        $('#reportrange span').html(startDate.format($scope.$parent.Datelocaleformat.format) + ' - ' + endDate.format($scope.$parent.Datelocaleformat.format));
    });
    $(document).on("click", ".ranges ul li", function (event) {
        var CUSTOM_DATE_TYPE_SELECTED = $(this).attr("data-range-key");
        if (CUSTOM_DATE_TYPE_SELECTED == "Custom Date" && $scope.IS_CUSTOME_DATE_SELECTED == 1) {
            $scope.IS_CUSTOME_DATE_SELECTED = 2;
            var start = moment().startOf('month');
            var end = moment().add(1, 'M').endOf('month');
            $scope.$parent.SetUpDateRangeMultiDatePicker('reportrange', start, end, reportrange, 1, "right", 'Open');
            $('#reportrange').data('daterangepicker').show();
        }
        else {
            $scope.IS_CUSTOME_DATE_SELECTED = 1;
        }
    });

    $scope.GET_BRANCH_LIST = function () {
        $scope.SalesValidationSearch.SELECT_ALL = false;
        var CustmObj = new Object();
        CustmObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CustmObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.DASHBOARD_API(CustmObj, 'GET_BRANCH_LIST').then(function (data) {
            $scope.BRANCH_LIST = data.data.Table;
        });
    };
    $scope.GET_BRANCH_LIST();

    $scope.GET_CASHUP_LIST_XERO_OUTBOUND_INVOICE = function (FLAG) {

        var CustmObj = new Object();
        if (FLAG == 1) {
            $scope.CASHUP_LIST_XERO_OUTBOUND_INVOICE = [];
            $scope.SalesValidationSearch.PAGE_NO = 1;
        }
        else if (FLAG == 2) {
            $scope.BRANCH_CATEGORIES = [];
            CustmObj.ACTIVE = -1;
            $scope.SalesValidationSearch.PAGE_NO = 1;
        }
        else if (FLAG == undefined) {
            if ($scope.SalesValidationSearch.CLICK_SEARCH == 1)
                CustmObj.ACTIVE = $scope.SalesValidationSearch.ACTIVE == -1 ? -1 : $scope.SalesValidationSearch.ACTIVE ? 1 : 0;
            else {
                CustmObj.ACTIVE = -1;
            }
        }

        $scope.TEMP = [];
        angular.forEach($scope.VALIDATION_STATUS, function (item) {
            if (item.SELECTED == true)
                $scope.TEMP.push(item.STATUS_ID);
        });

        CustmObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CustmObj.USER_ID = parseInt($cookies.get("USERID"));
        CustmObj.CASHUP_DATE_START = $scope.SalesValidationSearch.START_DATE == undefined ? moment().startOf('month').format($scope.$parent.Datelocaleformat.format) : $scope.SalesValidationSearch.START_DATE;
        CustmObj.CASHUP_DATE_END = $scope.SalesValidationSearch.END_DATE == undefined ? moment().endOf('month').format($scope.$parent.Datelocaleformat.format) : $scope.SalesValidationSearch.END_DATE;
        CustmObj.STATUS_IDS = $scope.TEMP.toString();
        CustmObj.BRANCH_IDS = $scope.SalesValidationSearch.BRANCH_ID == null ? '' : $scope.SalesValidationSearch.BRANCH_ID;
        CustmObj.PAGE_NO = $scope.SalesValidationSearch.PAGE_NO;
        CustmObj.PAGE_SIZE = $scope.SalesValidationSearch.PAGE_SIZE;
        $scope.$parent.overlay_loadingNew = 'block';
        PrcCommMethods.INVOICE_API(CustmObj, 'GET_CASHUP_LIST_XERO_OUTBOUND_INVOICE').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.CASHUP_LIST_XERO_OUTBOUND_INVOICE = $scope.CASHUP_LIST_XERO_OUTBOUND_INVOICE.concat(data.data.Table);
                if (data.data.Table.length < $scope.SalesValidationSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.SalesValidationSearch.PAGE_NO = parseInt($scope.SalesValidationSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else {
                $scope.GetData = false;
            }
            $scope.$parent.overlay_loadingNew = 'none';
        });
    };
    $scope.GET_CASHUP_LIST_XERO_OUTBOUND_INVOICE();
    $scope.LAZY_GET_CASHUP_LIST_XERO_OUTBOUND_INVOICE = function () { $scope.GET_CASHUP_LIST_XERO_OUTBOUND_INVOICE(); };

    $scope.OUTBOUND_INVOICE = function (OUTBOUND_INVOICE_DATA) {
        $scope.$parent.OUTBOUND_INVOICE_DATA_Main_ID = OUTBOUND_INVOICE_DATA.ID;
        $scope.$parent.OUTBOUND_INVOICE_DATA_Main_STATUS_ID = OUTBOUND_INVOICE_DATA.STATUS_ID;
        $scope.$parent.OUTBOUND_INVOICE_DATA_Main_CASHUP_DATE = OUTBOUND_INVOICE_DATA.CASHUP_DATE;
        $scope.$parent.OUTBOUND_INVOICE_DATA_Main_BRANCH_ID = OUTBOUND_INVOICE_DATA.BRANCH_ID;
        $scope.$parent.OUTBOUND_INVOICE_DATA_Main_BRANCH_NAME = OUTBOUND_INVOICE_DATA.BRANCH_NAME;
        $scope.$parent.OUTBOUND_INVOICE_DATA_Main_BRANCH_CODE = OUTBOUND_INVOICE_DATA.BRANCH_CODE;

        $scope.$parent.OUTBOUND_INVOICE_DATA_Main_START_DATE = $scope.SalesValidationSearch.START_DATE == undefined ? moment().startOf('month').format($scope.$parent.Datelocaleformat.format) : $scope.SalesValidationSearch.START_DATE;
        $scope.$parent.OUTBOUND_INVOICE_DATA_Main_END_DATE = $scope.SalesValidationSearch.END_DATE == undefined ? moment().endOf('month').format($scope.$parent.Datelocaleformat.format) : $scope.SalesValidationSearch.END_DATE;
        $scope.$parent.OUTBOUND_INVOICE_DATA_Main_STATUS_IDS = $scope.SalesValidationSearch.STATUS_ID;
        $scope.$parent.OUTBOUND_INVOICE_DATA_Main_BRANCH_IDS = $scope.SalesValidationSearch.BRANCH_ID;
        $location.path('SalesData').search({ INVOICE_ID: OUTBOUND_INVOICE_DATA.ID, STUID: OUTBOUND_INVOICE_DATA.STATUS_ID, BRANCH: OUTBOUND_INVOICE_DATA.BRANCH_ID })
    };
    $scope.CHECK_UNCHECK_ALL_STATUS = function (FLAG) {
        FLAG == true ? $scope.VALIDATION_STATUS.filter(p => p.SELECTED = true) : $scope.VALIDATION_STATUS.filter(p => p.SELECTED = false);
    };

    $scope.RESET = function () {
        reportrange(startDate = moment().startOf('month'), endDate = moment().endOf('month'));
        $scope.SalesValidationSearch.BRANCH_ID = null;
        $scope.CHECK_UNCHECK_ALL_STATUS(false);
        $scope.SalesValidationSearch.SELECT_ALL = false;
    };

});
app.controller('SalesValidationDataController', function ($scope, $http, $interval, CommService, $cookies, $filter, PrcCommMethods, $location, readFileData, $localStorage) {

    $(".tooltip").remove();
    $scope.PaymentAccountCodeFilter = function (item) {
        return item.ENABLEPAYMENTSTOACCOUNT === true || item.TYPE === 'BANK';
    };
    $scope.XERO_PAYMENT_BYFURCATION_LIST = [];
    $scope.INVC_DATA_TRCKNG_CTGRY = [];
    $scope.XERO_TRACKING_CATEGORIES = [];
    $scope.XERO_TRACKING_CATEGORIES_MAPINGS = [{
        'TABLE_ID': null,
        'XERO_OUTBOUND_INVOICE_DATA_ID': null,
        'XERO_TRACKING_CATEGORY_ID': null,
        'XERO_TRACKING_OPTION_ID': null,
        'ROWNUM': null
    }];
    $scope.XERO_TRACKING_CATEGORIES_OPTIONS = [];
    $scope.SalesValidationSearch = {
        BRANCH_ID: null, START_DATE: null, END_DATE: null, STATUS_ID: null,
        PAGE_NO: 1, PAGE_SIZE: 10, FLAG: 1, NG_REQUIRED_FOR_COMMENT: false,
        COMMENTS: "", TAX_TYPE: null, PLUS_ICON_SHOW_HIDE: true, MINUS_ICON_SHOW_HIDE: false,
        XERO_LOADER_SPIN: 'none', LESS_PAYMENT_XERO_ACCOUNT_CODE: null, VARIANCE: 0, REFERENCE_NUMBER: null, INVOICE_DATE: null
    };
    $scope.SalesValidationSearch.COMMENTS = "";
    $scope.BRANCH_LIST = [];
    $scope.CASHUP_LIST_XERO_OUTBOUND_INVOICE = [];
    $scope.CASHUP_LIST_XERO_OUTBOUND_INVOICE_DATA = [];
    $scope.CASHUP_LIST_XERO_OUTBOUND_INVOICE_LINE_DATA = [];
    $scope.CASHUP_LIST_XERO_OUTBOUND_INVOICE_LINE_PAYMENT = [];
    $scope.XERO_TAXES = [];
    $scope.CASHUP_LIST_XERO_OUTBOUND_INVOICE_COPY = [];
    $scope.XERO_INVOICE_OUTBOUND_HISTORY_HEADER = [];
    $scope.XERO_INVOICE_OUTBOUND_HISTORY_DETAILS = [];
    $scope.INVOICE_HEARDER_ROW_DATA = [];
    $scope.VALIDATE_DATE_FOR_XERO_INVOICE = null;
    $scope.CASHUP_LIST_XERO_OUTBOUND_INVOICE_LINE_PAYMENT_COPY = [];
    $scope.CASHUP_LIST_XERO_OUTBOUND_INVOICE_LINE_PAYMENT_TEMP = [];
    $scope.CASHUP_DATA_XERO_INVOICE_OUTBOUND_DATA_CARD = [];
    $scope.XERO_ACCOUNT_CODES_COPY = [];
    $scope.XERO_EPOS_DATA = [];
    $scope.CASHUP_DATA_XERO_INVOICE_OUTBOUND_DATA_VOUCHER = [];

    $scope.GROSS_AMOUNT = 0;


    $scope.GET_XERO_ACCOUNT_CODES = function () {
        //$scope.$parent.overlay_loadingNew = 'block';
        var CusModelObj = new Object();
        CusModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CusModelObj.BRANCH_ID = getUrlParameter('BRANCH', $location.absUrl());
        PrcCommMethods.ADMIN_API(CusModelObj, 'GET_XERO_ACCOUNT_CODES').then(function (data) {
            if (data.data.Table != undefined) {
                $scope.XERO_ACCOUNT_CODES = data.data.Table;
                $scope.XERO_ACCOUNT_CODES = angular.copy($scope.XERO_ACCOUNT_CODES.filter(p => p.CODE != null && p.CODE != ''));
                $scope.XERO_ACCOUNT_CODES_COPY = angular.copy($scope.XERO_ACCOUNT_CODES);
                $scope.GET_DATA_FOR_XERO_INVOICE_CREATION();
                //$scope.$parent.overlay_loadingNew = 'none';
            }
            else {
                $scope.XERO_ACCOUNT_CODES = [];
                //$scope.$parent.overlay_loadingNew = 'none';
            }
        });
    };
    $scope.GET_XERO_TRACKING_CATEGORIES = function () {
        $scope.$parent.overlay_loadingNew = 'block';
        var CusModelObj = new Object();
        CusModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CusModelObj.BRANCH_ID = getUrlParameter('BRANCH', $location.absUrl());
        PrcCommMethods.ADMIN_API(CusModelObj, 'GET_XERO_TRACKING_CATEGORIES').then(function (data) {
            if (data.data != null && data.data.Table != undefined && data.data.Table1 != undefined) {
                $scope.XERO_TRACKING_CATEGORIES = data.data.Table;
                $scope.XERO_TRACKING_CATEGORIES_OPTIONS = data.data.Table1;
                $scope.$parent.overlay_loadingNew = 'none';
            }
            else {
                $scope.XERO_TRACKING_CATEGORIES = [];
                $scope.XERO_TRACKING_CATEGORIES_OPTIONS = [];
                $scope.$parent.overlay_loadingNew = 'none';
            }
        });
    };
    $scope.GET_XERO_TRACKING_CATEGORIES();

    $scope.ConvertTo2Decimal = function (val) { return parseFloat(val).toFixed(2); }
    $scope.InitiateXeroTrackingCategories = function (item, Trackingcat) {
        var select_cat = $scope.CASHUP_LIST_XERO_OUTBOUND_INVOICE_DATA_TRACKINGCAT.filter(p => p.XERO_OUTBOUND_INVOICE_DATA_ID == item.TABLE_ID)[0];
        if (select_cat != undefined && select_cat != null) {
            item.SELECTED_CATEGORY_OPTION = $scope.XERO_TRACKING_CATEGORIES_OPTIONS.filter(p => p.XERO_TRACKING_CATEGORIES_ID == select_cat.XERO_TRACKING_CATEGORIES_ID && p.ID == select_cat.ID)[0];
        }
        else {
            item.SELECTED_CATEGORY_OPTION = $scope.XERO_TRACKING_CATEGORIES_OPTIONS.filter(p => p.NAME.toLowerCase() == item.REVENUE_CENTER.toLowerCase())[0];
        }
    }
    $scope.InitiateInvoiceData = function (item_body, index) {
        item_body.ROWNNUM = index;
        item_body.XERO_ACCOUNT_DEFAULT = null;
        item_body.XERO_TAXES = angular.copy($scope.XERO_TAXES);
        if (item_body.XERO_ACCOUNT_CODE != undefined && item_body.XERO_ACCOUNT_CODE != null) {

            item_body.XERO_ACCOUNT = $scope.XERO_ACCOUNT_CODES.filter(i => i.CODE == item_body.XERO_ACCOUNT_CODE)[0];
            item_body.XERO_ACCOUNT_DEFAULT = angular.copy(item_body.XERO_ACCOUNT);
        }

        if (item_body.DEFAULT_XERO_ACCOUNT_CODE != undefined && item_body.DEFAULT_XERO_ACCOUNT_CODE != null) {
            item_body.XERO_ACCOUNT_DEFAULT = $scope.XERO_ACCOUNT_CODES.filter(i => i.CODE == item_body.DEFAULT_XERO_ACCOUNT_CODE)[0];
        }
        if (item_body.TAX_TYPE == undefined || item_body.TAX_TYPE == null) {
            $scope.AccountCodeChange(item_body);
        }
        else {
            item_body.TAX_TYPE = parseInt(item_body.TAX_TYPE);
        }
    }
    $scope.filterselectedTaxData = function (elem) {

        return $scope.CASHUP_LIST_XERO_OUTBOUND_INVOICE_DATA.filter(p => parseInt(p.TAX_TYPE) == elem.ID).length > 0;
    }
    $scope.AccountCodeChange = function (item) {
        item.XERO_TAXES = angular.copy($scope.XERO_TAXES);
        if (item.XERO_ACCOUNT != undefined && item.XERO_ACCOUNT != null) {
            if (item.XERO_ACCOUNT.CLASS == 'LIABILITY') {
                item.XERO_TAXES = item.XERO_TAXES.filter(i => i.CANAPPLYTOLIABILITIES == true);
            } else if (item.XERO_ACCOUNT.CLASS == 'ASSET') {
                item.XERO_TAXES = item.XERO_TAXES.filter(i => i.CANAPPLYTOASSETS == true);
            } else if (item.XERO_ACCOUNT.CLASS == 'EQUITY') {
                item.XERO_TAXES = item.XERO_TAXES.filter(i => i.CANAPPLYTOEQUITY == true);
            } else if (item.XERO_ACCOUNT.CLASS == 'EXPENSE') {
                item.XERO_TAXES = item.XERO_TAXES.filter(i => i.CANAPPLYTOEXPENSES == true);
            } else if (item.XERO_ACCOUNT.CLASS == 'REVENUE') {
                item.XERO_TAXES = item.XERO_TAXES.filter(i => i.CANAPPLYTOREVENUE == true);
            }
        }
        item.TAX_TYPE = item.XERO_TAXES.filter(i => i.RATE == item.TAX_PERCENTAGE)[0].ID;

    };

    $scope.GET_XERO_ACCOUNT_CODES();
    $scope.GET_DATA_FOR_XERO_INVOICE_CREATION = function () {
        $scope.$parent.overlay_loadingNew = 'block';

        $scope.QUERYSTRING_XERO_INVOICE_CREATION_STATUS = getUrlParameter('STUID', $location.absUrl())
        var CustmObj = new Object();
        CustmObj.CASHUP_MAIN_ID = getUrlParameter('INVOICE_ID', $location.absUrl());
        PrcCommMethods.INVOICE_API(CustmObj, 'GET_DATA_FOR_XERO_INVOICE_CREATION').then(function (data) {
            $scope.$parent.OUTBOUND_INVOICE_DATA_Main_STATUS_ID;
            if (data.data.Table != undefined) {
                if (data.data.Table.length > 0 && data.data.Table3.length == 0 && data.data.Table4.length == 0) {
                    $scope.XERO_EPOS_DATA = data.data.Table2;
                    $scope.CASHUP_LIST_XERO_OUTBOUND_INVOICE_DATA = data.data.Table;
                    $scope.CASHUP_LIST_XERO_OUTBOUND_INVOICE_COPY = angular.copy(data.data.Table);
                    $scope.CASHUP_LIST_XERO_OUTBOUND_INVOICE_LINE_PAYMENT = data.data.Table1;
                    $scope.CASHUP_LIST_XERO_OUTBOUND_INVOICE_LINE_PAYMENT_COPY = angular.copy(data.data.Table1);
                    $scope.SalesValidationSearch.COMMENTS = data.data.Table[0]["XERO_INVOICE_CREATION_COMMENTS"];
                    $scope.SalesValidationSearch.INVOICE_DATE = data.data.Table[0]["INVOICE_DATE"]
                    $scope.CASHUP_LIST_XERO_OUTBOUND_INVOICE_LINE_PAYMENT_COPY = $scope.CASHUP_LIST_XERO_OUTBOUND_INVOICE_LINE_PAYMENT_COPY.filter(function (x) {
                        if (x.REMARK != null && x.REMARK != undefined) {
                            if (x.REMARK.split(':').length > 1) {
                                x.REMARK = x.REMARK.split(':')[1];
                            }
                            else {
                                x.REMARK = x.REMARK
                            }
                        }
                        x.REMARK_COPY = x.REMARK;
                        x.XERO_ACCOUNT_CODE_COPY = x.XERO_ACCOUNT_CODE;
                        x.REFERENCE_COPY = x.REFERENCE;
                        return x
                    });

                    $scope.INVOICE_HEARDER_ROW_DATA = $scope.CASHUP_LIST_XERO_OUTBOUND_INVOICE_DATA[0];
                    $scope.SELECTED_INVOICE_ID = $scope.CASHUP_LIST_XERO_OUTBOUND_INVOICE_DATA[0]["INVOICE_NUMBER"];
                    $scope.SELECTED_INVOICE_ID_STATUS = $scope.CASHUP_LIST_XERO_OUTBOUND_INVOICE_DATA[0]["STATUS"];
                    $scope.$parent.overlay_loadingNew = 'none';

                    $scope.CASHUP_LIST_XERO_OUTBOUND_INVOICE_DATA_TRACKINGCAT = data.data.Table5;


                }
                else {
                    if (data.data.Table3.length > 0 && data.data.Table4.length > 0) {
                        $scope.XERO_EPOS_DATA = data.data.Table2;
                        $scope.CASHUP_LIST_XERO_OUTBOUND_INVOICE_DATA = data.data.Table3;
                        $scope.CASHUP_LIST_XERO_OUTBOUND_INVOICE_COPY = angular.copy(data.data.Table3);
                        $scope.CASHUP_LIST_XERO_OUTBOUND_INVOICE_LINE_PAYMENT = data.data.Table4;
                        $scope.CASHUP_LIST_XERO_OUTBOUND_INVOICE_LINE_PAYMENT_COPY = angular.copy(data.data.Table4);

                        $scope.CASHUP_LIST_XERO_OUTBOUND_INVOICE_DATA_TRACKINGCAT = data.data.Table5;
                        $scope.SalesValidationSearch.COMMENTS = data.data.Table3[0]["XERO_INVOICE_CREATION_COMMENTS"];
                        $scope.SalesValidationSearch.INVOICE_DATE = data.data.Table3[0]["INVOICE_DATE"]

                        $scope.CASHUP_LIST_XERO_OUTBOUND_INVOICE_LINE_PAYMENT_COPY = $scope.CASHUP_LIST_XERO_OUTBOUND_INVOICE_LINE_PAYMENT_COPY.filter(function (x) {
                            if (x.REMARK != null && x.REMARK != undefined) {
                                if (x.REMARK.split(':').length > 1) {
                                    x.REMARK = x.REMARK.split(':')[1];
                                }
                                else {
                                    x.REMARK = x.REMARK
                                }
                            }
                            x.REMARK_COPY = x.REMARK;
                            x.XERO_ACCOUNT_CODE_COPY = x.XERO_ACCOUNT_CODE;
                            x.REFERENCE_COPY = x.REFERENCE;
                            return x
                        });


                        $scope.INVOICE_HEARDER_ROW_DATA = $scope.CASHUP_LIST_XERO_OUTBOUND_INVOICE_DATA[0];
                        $scope.SELECTED_INVOICE_ID = $scope.CASHUP_LIST_XERO_OUTBOUND_INVOICE_DATA[0]["INVOICE_NUMBER"];
                        $scope.SELECTED_INVOICE_ID_STATUS = $scope.CASHUP_LIST_XERO_OUTBOUND_INVOICE_DATA[0]["STATUS"];
                        $scope.$parent.overlay_loadingNew = 'none';


                    }
                    else {
                        $scope.$parent.ShowAlert('Attention', 'No records found.', 5000);
                        $scope.$parent.overlay_loadingNew = 'none';
                    }
                }
                if ($scope.CASHUP_LIST_XERO_OUTBOUND_INVOICE_DATA.length > 0 && $scope.CASHUP_LIST_XERO_OUTBOUND_INVOICE_DATA[0]['XERO_INVOICE_CREATION_STATUS'] != undefined) {
                    $scope.QUERYSTRING_XERO_INVOICE_CREATION_STATUS = $scope.CASHUP_LIST_XERO_OUTBOUND_INVOICE_DATA[0]['XERO_INVOICE_CREATION_STATUS'];
                    $scope.$parent.overlay_loadingNew = 'none';
                }
            }
            else {
                $scope.CASHUP_LIST_XERO_OUTBOUND_INVOICE_DATA = [];
                $scope.CASHUP_LIST_XERO_OUTBOUND_INVOICE_LINE_DATA = [];
                $scope.$parent.overlay_loadingNew = 'none';
            }
        });
    };


    $scope.GET_XERO_INVOICE_OUTBOUND_HISTORY_HEADER = function () {
        $scope.$parent.overlay_loadingNew = 'block';
        var CustmObj = new Object();
        CustmObj.CASHUP_MAIN_ID = getUrlParameter('INVOICE_ID', $location.absUrl());
        PrcCommMethods.INVOICE_API(CustmObj, 'GET_XERO_INVOICE_OUTBOUND_HISTORY_HEADER').then(function (data) {
            if (data.data.Table != undefined) {
                if (data.data.Table.length > 0) {
                    $scope.XERO_INVOICE_OUTBOUND_HISTORY_HEADER = data.data.Table;
                    $scope.$parent.overlay_loadingNew = 'none';
                }
                else {
                    $scope.XERO_INVOICE_OUTBOUND_HISTORY_HEADER = [];
                    $scope.$parent.overlay_loadingNew = 'none';
                }
            }
            else {
                $scope.XERO_INVOICE_OUTBOUND_HISTORY_HEADER = [];
                $scope.$parent.overlay_loadingNew = 'none';
            }
        });
    };
    $scope.GET_XERO_INVOICE_OUTBOUND_HISTORY_HEADER();

    $scope.GET_XERO_TAXES = function () {
        $scope.$parent.overlay_loadingNew = 'block';
        var CustmObj = new Object();
        CustmObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CustmObj.BRANCH_IDS = getUrlParameter('BRANCH', $location.absUrl());
        PrcCommMethods.INVOICE_API(CustmObj, 'GET_XERO_TAXES').then(function (data) {
            if (data.data.Table != undefined) {
                $scope.XERO_TAXES = data.data.Table;
                $scope.$parent.overlay_loadingNew = 'none';
            }
            else {
                $scope.XERO_TAXES = [];
                $scope.$parent.overlay_loadingNew = 'none';
            }

        });
    };
    $scope.GET_XERO_TAXES();
    $scope.CASHUP_MASTER_DATA = [];
    $scope.GET_CASHUP_REVIEW = function () {
        $scope.$parent.overlay_loadingNew = 'block';
        var CustmObj = new Object();
        CustmObj.CASHUP_MAIN_ID = getUrlParameter('INVOICE_ID', $location.absUrl());
        PrcCommMethods.CASHUP_API(CustmObj, 'GET_CASHUP_REVIEW').then(function (data) {
            if (data.data.Table != undefined) {
                $scope.CASHUP_MASTER_DATA = data.data.Table;
                $scope.CASHUP_PAYMENT_DATA = data.data.Table1;
                $scope.CASHUP_ACTUAL_FLOAT_CASH_DATA = data.data.Table2;
                $scope.CASHUP_ACTUAL_CARD_PAYMENT_DATA = data.data.Table3;
                $scope.CASHUP_ACTUAL_PETTY_CASH = data.data.Table4;
                $scope.CASHUP_ACTUAL_ACCOUNT_CREDIT = data.data.Table5;
                $scope.$parent.overlay_loadingNew = 'none';
            }
            else {
                $scope.CASHUP_MASTER_DATA = [];
                $scope.CASHUP_PAYMENT_DATA = [];
                $scope.$parent.overlay_loadingNew = 'none';
            }

        });
    };
    $scope.GET_CASHUP_REVIEW();

    $scope.TAXPERCENTAGE_CHANGE = function (TAX_TYPE, LIST_XERO_OUTBOUND_INVOICE_DATA) {
        if (TAX_TYPE != null) {
            $scope.SELECTED_TAX_TYPE = $scope.CASHUP_LIST_XERO_OUTBOUND_INVOICE_DATA.filter(p => p.$$hashKey == LIST_XERO_OUTBOUND_INVOICE_DATA.$$hashKey);
            $scope.NET_AMOUNT = $scope.SELECTED_TAX_TYPE[0]["UNIT_AMOUNT"];
            $scope.GROSS_AMOUNT = $scope.SELECTED_TAX_TYPE[0]["SUB_TOTAL"];
            $scope.CHANGE_TAX_RATE = $scope.XERO_TAXES.filter(p => p.ID == parseInt(TAX_TYPE))[0]['RATE'];

            $scope.CALCULAED_NET_AFTER_TAX_PERCENTAGE_CHANGE = parseFloat($scope.GROSS_AMOUNT) / (1 + (parseFloat($scope.CHANGE_TAX_RATE) / 100));
            $scope.CASHUP_LIST_XERO_OUTBOUND_INVOICE_DATA.filter(p => p.$$hashKey == LIST_XERO_OUTBOUND_INVOICE_DATA.$$hashKey)[0]['UNIT_AMOUNT'] = parseFloat($scope.CALCULAED_NET_AFTER_TAX_PERCENTAGE_CHANGE.toFixed(2));
            $scope.CASHUP_LIST_XERO_OUTBOUND_INVOICE_DATA.filter(p => p.$$hashKey == LIST_XERO_OUTBOUND_INVOICE_DATA.$$hashKey)[0]['TAX_AMOUNT'] = parseFloat((($scope.CALCULAED_NET_AFTER_TAX_PERCENTAGE_CHANGE * $scope.CHANGE_TAX_RATE) / 100).toFixed(2));
            $scope.CASHUP_LIST_XERO_OUTBOUND_INVOICE_DATA.filter(p => p.$$hashKey == LIST_XERO_OUTBOUND_INVOICE_DATA.$$hashKey)[0]['TAX_PERCENTAGE'] = $scope.XERO_TAXES.filter(p => p.TAX_TYPE == TAX_TYPE)[0]['RATE'];

        }
        if ($scope.CASHUP_LIST_XERO_OUTBOUND_INVOICE_COPY.filter(p => p.DESCRIPTION == LIST_XERO_OUTBOUND_INVOICE_DATA.DESCRIPTION && p.TAX_TYPE == LIST_XERO_OUTBOUND_INVOICE_DATA.TAX_TYPE).length == 0) {
            $scope.SalesValidationSearch.NG_REQUIRED_FOR_COMMENT = true;
        }
        else {
            $scope.SalesValidationSearch.NG_REQUIRED_FOR_COMMENT = false;
        }
    };

    $scope.INS_UPD_XERO_INVOICE_OUTBOUND_DATA = function (SAVE_OR_SEND_TO_XERO_FLAG) {

        //if (parseFloat($scope.SalesValidationSearch.VARIANCE) == 0) {
        $scope.$parent.overlay_loadingNew = 'block';
        $scope.SalesValidationForm.submitted = true;
        //   alert(parseFloat($scope.SalesValidationSearch.VARIANCE));
        if (parseFloat($scope.SalesValidationSearch.VARIANCE) >= 0) {
            if ($scope.SalesValidationForm.$valid) {
                $scope.SELECTED_DATA = [];
                $scope.PUSH_INVOICE_DATA = [];
                $scope.PUSH_INVOICE_PAYMENT_DATA = [];
                var CustmObj = new Object();
                CustmObj.CASHUP_MAIN_ID = parseInt(getUrlParameter('INVOICE_ID', $location.absUrl()));
                CustmObj.USER_ID = parseInt($cookies.get('USERID'));
                CustmObj.COMMENTS = $scope.SalesValidationSearch.COMMENTS;
                CustmObj.SEND_TO_ZERO_FLAG = SAVE_OR_SEND_TO_XERO_FLAG;

                angular.forEach($scope.CASHUP_LIST_XERO_OUTBOUND_INVOICE_DATA, function (item) {
                    if (item.TABLE_ID == undefined)
                        item.TABLE_ID = 0;

                    $scope.SalesValidationSearch.REFERENCE_NUMBER = item.REFERENCE_NUMBER;
                    $scope.SELECTED_DATA = [];
                    $scope.SELECTED_DATA = {
                        'TABLE_ID': item.TABLE_ID,
                        'TYPE': item.TYPE,
                        'CONTACT_ID': item.CONTACT_ID,
                        'INVOICE_DATE': item.INVOICE_DATE,
                        'DUE_DATE': item.DUE_DATE,
                        'INVOICE_NUMBER': item.INVOICE_NUMBER,
                        'REFERENCE_NUMBER': item.REFERENCE_NUMBER,
                        'STATUS': item.STATUS,
                        'DESCRIPTION': item.DESCRIPTION,
                        'QUANTITY': item.QUANTITY,
                        'UNIT_AMOUNT': item.UNIT_AMOUNT.toFixed(5),
                        'TAX_AMOUNT': item.TAX_AMOUNT.toFixed(5),
                        'TAX_PERCENTAGE': item.TAX_PERCENTAGE.toFixed(5),
                        'XERO_ACCOUNT_CODE': item.XERO_ACCOUNT.CODE,
                        'TAX_TYPE': item.TAX_TYPE,
                        'SITE': item.SITE,
                        'DELETE_FLAG': false,
                        'REVENUE_CENTER': item.REVENUE_CENTER,
                        'ROWNUM': item.ROWNNUM
                    };
                    $scope.PUSH_INVOICE_DATA.push($scope.SELECTED_DATA);

                    if (item.SELECTED_CATEGORY_OPTION != undefined && item.SELECTED_CATEGORY_OPTION != null) {
                        $scope.INVC_DATA_TRCKNG_CTGRY = [];
                        var select_cat = $scope.CASHUP_LIST_XERO_OUTBOUND_INVOICE_DATA_TRACKINGCAT.filter(p => p.XERO_OUTBOUND_INVOICE_DATA_ID == item.TABLE_ID)[0];
                        $scope.INVC_DATA_TRCKNG_CTGRY = {
                            'TABLE_ID': select_cat == undefined || select_cat == null || select_cat.TABLE_ID == undefined || select_cat.TABLE_ID == null ? 0 : select_cat.TABLE_ID,
                            'XERO_OUTBOUND_INVOICE_DATA_ID': item.TABLE_ID == undefined || item.TABLE_ID == null ? 0 : item.TABLE_ID,
                            'XERO_TRACKING_CATEGORY_ID': item.SELECTED_CATEGORY_OPTION.XERO_TRACKING_CATEGORIES_ID,
                            'XERO_TRACKING_OPTION_ID': item.SELECTED_CATEGORY_OPTION.ID,
                            'ROWNUM': item.ROWNNUM
                        };
                        $scope.XERO_TRACKING_CATEGORIES_MAPINGS.push($scope.INVC_DATA_TRCKNG_CTGRY);
                    }
                });
                angular.forEach($scope.CASHUP_LIST_XERO_OUTBOUND_INVOICE_LINE_PAYMENT_COPY, function (item) {
                    $scope.SELECTED_DATA = [];
                    $scope.SELECTED_DATA = {
                        'TABLE_ID': item.TABLE_ID == null || item.TABLE_ID == undefined || item.TABLE_ID == "" ? 0 : item.TABLE_ID,
                        'DATE': item.DATE == null || item.DATE == undefined || item.DATE == "" ? $filter('date')(new Date($scope.SalesValidationSearch.INVOICE_DATE)) : item.DATE,
                        'XERO_ACCOUNT_CODE': item.XERO_ACCOUNT_CODE == undefined || item.XERO_ACCOUNT_CODE == "" ? "" : item.XERO_ACCOUNT_CODE,
                        'AMOUNT': parseFloat(item.AMOUNT).toFixed(5),
                        'REFERENCE': item.REFERENCE,
                        'DELETE_FLAG': false,
                        'REMARK': $scope.SalesValidationSearch.REFERENCE_NUMBER + ':' + item.REMARK == null || item.REMARK == undefined ? item.REMARK = "" : item.REMARK = item.REMARK,
                        'CASHUP_PAYMENT_METHOD_DISPLAY_NAME_ID': item.CASHUP_PAYMENT_METHOD_DISPLAY_NAME_ID,
                        'DISPLAY_NAME': item.DISPLAY_NAME
                    };
                    $scope.PUSH_INVOICE_PAYMENT_DATA.push($scope.SELECTED_DATA);
                });
                angular.forEach($scope.CASHUP_LIST_XERO_OUTBOUND_INVOICE_LINE_PAYMENT_TEMP, function (item) {
                    $scope.SELECTED_DATA = [];
                    $scope.SELECTED_DATA = {
                        'TABLE_ID': item.TABLE_ID,
                        'DATE': $filter('date')(new Date($scope.SalesValidationSearch.INVOICE_DATE)),
                        'XERO_ACCOUNT_CODE': item.XERO_ACCOUNT_CODE == undefined || item.XERO_ACCOUNT_CODE == "" ? "" : item.XERO_ACCOUNT_CODE,
                        'AMOUNT': parseFloat(item.AMOUNT).toFixed(5),
                        'REFERENCE': item.REFERENCE,
                        'DELETE_FLAG': item.DELETE_FLAG,
                        'REMARK': $scope.SalesValidationSearch.REFERENCE_NUMBER + ':' + item.REMARK == null || item.REMARK == undefined ? item.REMARK = "" : item.REMARK = item.REMARK,
                        'CASHUP_PAYMENT_METHOD_DISPLAY_NAME_ID': item.CASHUP_PAYMENT_METHOD_DISPLAY_NAME_ID,
                        'DISPLAY_NAME': item.DISPLAY_NAME
                    };
                    $scope.PUSH_INVOICE_PAYMENT_DATA.push($scope.SELECTED_DATA);

                });
                CustmObj.XERO_OUTBOUND_INVOICE_DATA = $scope.PUSH_INVOICE_DATA;
                CustmObj.XERO_OUTBOUND_INVOICE_PAYMENT_DATA = $scope.PUSH_INVOICE_PAYMENT_DATA;
                CustmObj.INVC_DATA_TRCKNG_CTGRY = $scope.XERO_TRACKING_CATEGORIES_MAPINGS;
                PrcCommMethods.INVOICE_API(CustmObj, 'INS_UPD_XERO_INVOICE_OUTBOUND_DATA').then(function (data) {
                    if (data.data == 1) {
                        $scope.XERO_INVOICE_OUTBOUND_HISTORY_HEADER = data.data.Table;
                        $scope.$parent.ShowAlert('Success', 'Records are updated successfully.', 5000);
                        $scope.CASHUP_LIST_XERO_OUTBOUND_INVOICE_LINE_PAYMENT_COPY = [];
                        $scope.GET_XERO_TAXES();
                        $scope.GET_XERO_INVOICE_OUTBOUND_HISTORY_HEADER();
                        $scope.GET_DATA_FOR_XERO_INVOICE_CREATION();
                        $scope.$parent.overlay_loadingNew = 'none';
                        $scope.SalesValidationSearch.COMMENTS = "";
                    }
                    else {
                        $scope.$parent.ShowAlert('Error', 'Failed to update records.', 5000);
                        $scope.XERO_INVOICE_OUTBOUND_HISTORY_HEADER = [];
                        $scope.GET_XERO_TAXES();
                        $scope.GET_XERO_INVOICE_OUTBOUND_HISTORY_HEADER();
                        $scope.GET_DATA_FOR_XERO_INVOICE_CREATION();
                        $scope.$parent.overlay_loadingNew = 'none';
                        $scope.SalesValidationSearch.COMMENTS = "";
                    }
                    $scope.SalesValidationForm.submitted = false;
                    $scope.$parent.overlay_loadingNew = 'none';
                    $scope.XERO_TRACKING_CATEGORIES_MAPINGS = [{
                        'TABLE_ID': null,
                        'XERO_OUTBOUND_INVOICE_DATA_ID': null,
                        'XERO_TRACKING_CATEGORY_ID': null,
                        'XERO_TRACKING_OPTION_ID': null,
                        'ROWNUM': null
                    }];
                });
            }
            else {
                angular.element('input.ng-invalid').first().focus(); angular.element('select.ng-invalid').first().focus();
                $scope.$parent.ShowAlert('Attention', 'Please check and validate, if mandatory fields are not filled.', 5000);//or if the amount due is greater than zero(0.00)
                $scope.$parent.overlay_loadingNew = 'none';
            }
        }
        else {
            $scope.$parent.ShowAlert('Attention', 'The payments cannot be greater than Invoice amount.', 5000);//or if the amount due is greater than zero(0.00)
            $scope.$parent.overlay_loadingNew = 'none';
        }

        //}
        //else {

        //}
    };
    $scope.VALIDATE_DATE_FOR_XERO_INVOICE_OUTBOUND_DATA = function (SAVE_OR_SEND_TO_XERO_FLAG) {
        if (SAVE_OR_SEND_TO_XERO_FLAG == false) {
            $scope.INS_UPD_XERO_INVOICE_OUTBOUND_DATA(SAVE_OR_SEND_TO_XERO_FLAG);
        }
        else {
            var CustmObj = new Object();
            CustmObj.CASHUP_MAIN_ID = getUrlParameter('INVOICE_ID', $location.absUrl());
            PrcCommMethods.INVOICE_API(CustmObj, 'VALIDATE_DATE_FOR_XERO_INVOICE_OUTBOUND_DATA').then(function (data) {
                if (data.data.Table != undefined && data.data.Table.length > 0) {
                    $scope.VALIDATE_DATE_FOR_XERO_INVOICE = data.data.Table[0]['LAST_PENDING_DATE'];
                    if ($scope.VALIDATE_DATE_FOR_XERO_INVOICE != null) {
                        $scope.$parent.ShowAlert('Attention', 'Please submit sales invoices for ' + $filter('date')(new Date($scope.VALIDATE_DATE_FOR_XERO_INVOICE)) + ' before submitting this invoice.', 5000);
                    }
                    else if ($scope.VALIDATE_DATE_FOR_XERO_INVOICE == null) {
                        $scope.INS_UPD_XERO_INVOICE_OUTBOUND_DATA(SAVE_OR_SEND_TO_XERO_FLAG);
                    }
                }
                else {
                    $scope.$parent.ShowAlert('Error', 'Error, please connect to support.', 5000);
                }
            });
        }
    };

    $scope.GET_XERO_INVOICE_OUTBOUND_HISTORY_DETAILS = function (XERO_INVOICE_OUTBOUND_HISTORY_HEADER, FLAG, ELEMENT_ID) {
        if (FLAG) {
            document.getElementById("loader_" + ELEMENT_ID).style.visibility = 'visible'
            var CustmObj = new Object();
            CustmObj.CASHUP_MAIN_ID = XERO_INVOICE_OUTBOUND_HISTORY_HEADER.XERO_OUTBOUND_INVOICE_HISTORY_HEADER_ID;
            PrcCommMethods.INVOICE_API(CustmObj, 'GET_XERO_INVOICE_OUTBOUND_HISTORY_DETAILS').then(function (data) {
                if (data.data.Table != undefined) {
                    if (data.data.Table.length > 0) {
                        XERO_INVOICE_OUTBOUND_HISTORY_HEADER.XERO_INVOICE_OUTBOUND_HISTORY_DETAILS = data.data.Table;
                        XERO_INVOICE_OUTBOUND_HISTORY_HEADER.SHOWDETAILS = !XERO_INVOICE_OUTBOUND_HISTORY_HEADER.SHOWDETAILS;
                        document.getElementById("loader_" + ELEMENT_ID).style.visibility = 'hidden';
                    }
                    else {
                        XERO_INVOICE_OUTBOUND_HISTORY_HEADER.XERO_INVOICE_OUTBOUND_HISTORY_DETAILS = [];
                        XERO_INVOICE_OUTBOUND_HISTORY_HEADER.SHOWDETAILS = !XERO_INVOICE_OUTBOUND_HISTORY_HEADER.SHOWDETAILS;
                        document.getElementById("loader_" + ELEMENT_ID).style.visibility = 'hidden';
                    }
                }
                else {

                    XERO_INVOICE_OUTBOUND_HISTORY_HEADER.XERO_INVOICE_OUTBOUND_HISTORY_DETAILS = [];
                    XERO_INVOICE_OUTBOUND_HISTORY_HEADER.SHOWDETAILS = !XERO_INVOICE_OUTBOUND_HISTORY_HEADER.SHOWDETAILS;
                    document.getElementById("loader_" + ELEMENT_ID).style.visibility = 'hidden';
                }
            });
        }
        else {
            XERO_INVOICE_OUTBOUND_HISTORY_HEADER.SHOWDETAILS = !XERO_INVOICE_OUTBOUND_HISTORY_HEADER.SHOWDETAILS;
            XERO_INVOICE_OUTBOUND_HISTORY_HEADER.XERO_INVOICE_OUTBOUND_HISTORY_DETAILS = [];
            document.getElementById("loader_" + ELEMENT_ID).style.visibility = 'hidden';
        }
    };
    $scope.BACK_TO_SALES_DATA = function () {
        $scope.$parent.OUTBOUND_INVOICE_DATA_BACK_TO_INVOICE = true;
        $location.path('SalesValidation').search();
    };

    $scope.EDIT_XERO_PAYMENT_BYFURCATION = function (Payment_Type, Payment_Amount, Payment_Object, index) {
        debugger;
        $(".tooltip").remove();
        $scope.ADD_NEW_ROW = {
            AMOUNT: 0, DATE: $scope.SalesValidationSearch.INVOICE_DATE, REFERENCE: null, TABLE_ID: null, XERO_ACCOUNT_CODE: null, MINUS_ICON: true, DELETE_FLAG: false, REMARK: null,
            CASHUP_PAYMENT_METHOD_DISPLAY_NAME_ID: Payment_Object.CASHUP_PAYMENT_METHOD_DISPLAY_NAME_ID, DISPLAY_NAME: Payment_Object.DISPLAY_NAME, INDEX: index
        };
        $scope.CASHUP_LIST_XERO_OUTBOUND_INVOICE_LINE_PAYMENT_COPY.splice(index + 1, 0, $scope.ADD_NEW_ROW);
    };
    $scope.DELETE_XERO_PAYMENT_BYFURCATION_ROW = function (Index, item) {
        if (confirm('Do you want to remove this row?')) {
            $(".tooltip").remove();
            if ($scope.CASHUP_LIST_XERO_OUTBOUND_INVOICE_LINE_PAYMENT_COPY.length > 0) {
                item.DELETE_FLAG = true;
                $scope.CASHUP_LIST_XERO_OUTBOUND_INVOICE_LINE_PAYMENT_TEMP.push(item);
            }
            $scope.CASHUP_LIST_XERO_OUTBOUND_INVOICE_LINE_PAYMENT_COPY.splice(Index, 1);

        }
        if ($scope.CASHUP_LIST_XERO_OUTBOUND_INVOICE_LINE_PAYMENT_COPY.length == 0) {
            $scope.ADD_NEW_ROW = {
                AMOUNT: 0, DATE: $scope.SalesValidationSearch.INVOICE_DATE, REFERENCE: null, TABLE_ID: null, XERO_ACCOUNT_CODE: null, MINUS_ICON: false, DELETE_FLAG: false, REMARK: null,
                CASHUP_PAYMENT_METHOD_DISPLAY_NAME_ID: "2", DISPLAY_NAME: "", INDEX: 0
            };
            $scope.CASHUP_LIST_XERO_OUTBOUND_INVOICE_LINE_PAYMENT_COPY.push($scope.ADD_NEW_ROW);
        }
    };

    $scope.GET_CASHUP_DATA_XERO_INVOICE_OUTBOUND_DATA = function () {
        var CustmObj = new Object();
        CustmObj.CASHUP_MAIN_ID = getUrlParameter('INVOICE_ID', $location.absUrl());
        PrcCommMethods.INVOICE_API(CustmObj, 'GET_CASHUP_DATA_XERO_INVOICE_OUTBOUND_DATA').then(function (data) {
            if (data.data.Table != undefined) {
                $scope.CASHUP_DATA_XERO_INVOICE_OUTBOUND_DATA_CARD = data.data.Table;
                $scope.CASHUP_DATA_XERO_INVOICE_OUTBOUND_DATA_VOUCHER = data.data.Table1;
                $scope.CASHUP_DATA_XERO_INVOICE_OUTBOUND_DATA_ACCOUNT = data.data.Table3;

                angular.forEach($scope.CASHUP_DATA_XERO_INVOICE_OUTBOUND_DATA_CARD, function (item) {
                    if (item.FILE_NAME.length > 0 && item.FILE_NAME != "") {
                        item.UPLOADED_FILES = [];
                        var FileArray = item.FILE_NAME.split(':;:');
                        if (FileArray.length > 0) {
                            var obj = new Object();
                            obj.FILE_PATH = FileArray[0];
                            obj.SERVER_FILE_NAME = FileArray[1];
                            obj.ORIGINAL_FILE_NAME = FileArray[2];
                            item.UPLOADED_FILES.push(obj);
                        }
                    }
                });
            }
            else {
                $scope.CASHUP_DATA_XERO_INVOICE_OUTBOUND_DATA_CARD = [];
                $scope.CASHUP_DATA_XERO_INVOICE_OUTBOUND_DATA_VOUCHER = [];
            }
        });
    };
    $scope.UPD_DEFAULT_XERO_ACCOUNT_CATEGORY_PAYMENT_MAPPING = function (XERO_ACCOUNT_ID, IS_PAYMENT, FILTER_IN_XERO_ACCOUNT_CODE, REFERENCE, item) {
        $scope.$parent.overlay_loadingNew = 'block';
        var CustmObj = new Object();
        CustmObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CustmObj.USER_ID = parseInt($cookies.get("USERID"));
        CustmObj.BRANCH_IDS = getUrlParameter('BRANCH', $location.absUrl());
        CustmObj.IS_PAYMENT = IS_PAYMENT;

        CustmObj.XERO_ACCOUNT_ID = $scope.XERO_ACCOUNT_CODES.filter(p => p.CODE == XERO_ACCOUNT_ID)[0]['TABLE_ID'];

        CustmObj.EPOS_CATEGORY_OR_PAYMENT_NAME = REFERENCE;

        PrcCommMethods.INVOICE_API(CustmObj, 'UPD_DEFAULT_XERO_ACCOUNT_CATEGORY_PAYMENT_MAPPING').then(function (data) {
            if (data.data == 1) {
                $scope.$parent.overlay_loadingNew = 'none';
                $scope.$parent.ShowAlert('Success', 'Records are updated successfully.', 5000);
                item['XERO_ACCOUNT_CODE_COPY'] = XERO_ACCOUNT_ID;
            }
            else {
                $scope.$parent.overlay_loadingNew = 'none';
                $scope.$parent.ShowAlert('Attention', 'Fail to update.', 5000);
                $scope.GET_DATA_FOR_XERO_INVOICE_CREATION();
            }
        });
    };
    $scope.LESS_PAYMENT_SET_TO_ZERO_IF_EMPTY = function (item) {
        if (item.AMOUNT == null || item.AMOUNT == '') {
            item.AMOUNT = '';
        }
    };
});
app.controller('ReconSettingsController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $localStorage) {
    $(".tooltip").remove();
    $scope.ReconSettings_Search = {
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        PAGE_NO_ID: 1,
        PAGE_SIZE_ID: 10,
        UploadedFiles: [],
        INTEGRATION_SYSTEM_ID: 25,
        UPLOADE_TYPE_ID: 29,
        ENTITY_ID: parseInt($cookies.get("ENTITY_ID")),
    }
    $scope.TAB_FLAG = 1;

    $scope.CATEGORY_MASTER_LIST = [];
    $scope.XERO_ACCOUNT_CODES_LIST = [];

    $scope.BRANCH_REC_LOGIN_LIST = [];
    $scope.BRANCH_REC_LOGIN_LIST = JSON.parse($localStorage.BRANCH_LOGIN_LIST);


    $scope.GET_XERO_ACCOUNT_CODES = function () {
        var CustmObj = new Object();
        CustmObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CustmObj.BRANCH_ID = $scope.ReconSettings_Search.BRANCH_ID;
        CustmObj.CLASS = "";
        CustmObj.TYPE = "DIRECTCOSTS";
        PrcCommMethods.ADMIN_API(CustmObj, 'GET_XERO_ACCOUNT_CODES').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.XERO_ACCOUNT_CODES_LIST = data.data.Table;
            }
        });
    }
    $scope.GET_CATEGORY_MASTER = function () {
        var CustmObj = new Object();
        CustmObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CustmObj.BRANCH_ID = $scope.ReconSettings_Search.BRANCH_ID;
        PrcCommMethods.ADMIN_API(CustmObj, 'GET_CATEGORY_MASTER').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.CATEGORY_MASTER_LIST = data.data.Table;
                $scope.ACCOUNT_BLANK = {
                    ACCOUNT_ID: null,
                    XERO_ACCOUNT_CODES_LIST: angular.copy($scope.XERO_ACCOUNT_CODES_LIST),
                    CATEGORY_LIST: angular.copy($scope.CATEGORY_MASTER_LIST),
                };
                $scope.GET_INV_RECO_ACCOUNT_CATEGORY_MAPPING();

            }
        });
    }

    $scope.INV_RECO_ACCOUNT_CATEGORY_MAPPING = [];
    $scope.GET_INV_RECO_ACCOUNT_CATEGORY_MAPPING = function () {
        var CustmObj = new Object();
        CustmObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CustmObj.BRANCH_ID = $scope.ReconSettings_Search.BRANCH_ID;
        CustmObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.CASHUP_API(CustmObj, 'GET_INV_RECO_ACCOUNT_CATEGORY_MAPPING').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.INV_RECO_ACCOUNT_CATEGORY_MAPPING = data.data.Table;
                //$scope.INV_RECO_ACCOUNT_CATEGORY_MAPPING_TAB_CNT_ACT_MAPP = angular.copy(data.data.Table);
                angular.forEach($scope.INV_RECO_ACCOUNT_CATEGORY_MAPPING, function (val) {
                    val.CATEGORY_LIST = angular.copy($scope.CATEGORY_MASTER_LIST);
                    var List = val.CATEGORY_MASTER_IDS.split(',');
                    angular.forEach(val.CATEGORY_LIST, function (cat) {
                        const found = List.find((element) => element == cat.ID);
                        if (found > 0) {
                            // cat.IS_CAT_SELECTED = true; do not remove this code future is in use
                            val.IS_CAT_SELECTED = cat.ID;
                        };
                    });
                });
            }
            else {
                $scope.ADD_MORE_ACCOUNT_FY();
            }
        });
    }
    if ($scope.BRANCH_REC_LOGIN_LIST.length > 0) {
        $scope.ReconSettings_Search.BRANCH_ID = $scope.BRANCH_REC_LOGIN_LIST[0].BRANCH_ID;
        $scope.GET_XERO_ACCOUNT_CODES();
        $scope.GET_CATEGORY_MASTER();
        // $scope.GET_INV_RECO_ACCOUNT_CATEGORY_MAPPING();
    }
    else {
        $scope.GET_XERO_ACCOUNT_CODES();
        $scope.GET_CATEGORY_MASTER();
        //  $scope.GET_INV_RECO_ACCOUNT_CATEGORY_MAPPING();
    }
    $scope.ADD_MORE_ACCOUNT_FY = function (LIST, INTEGRATION_SYSTEM_ID) {
        $scope.ACCOUNT_BLANK.INTEGRATION_SYSTEM_ID = INTEGRATION_SYSTEM_ID;
        $scope.INV_RECO_ACCOUNT_CATEGORY_MAPPING.push(angular.copy($scope.ACCOUNT_BLANK));
        console.log($scope.INV_RECO_ACCOUNT_CATEGORY_MAPPING);
    }
    $scope.DELETE_ADD_MORE_ACCOUNT_FY = function (LIST, index) {

        var index1 = $scope.INV_RECO_ACCOUNT_CATEGORY_MAPPING.findIndex(x => x.TABLE_ID === LIST.TABLE_ID);
        $scope.INV_RECO_ACCOUNT_CATEGORY_MAPPING.splice(index1, 1);

    }
    $scope.INS_UPD_INV_RECO_ACCOUNT_CATEGORY_MAPPING = function () {
        $scope.AcctCatForm.submitted = true;
        if ($scope.AcctCatForm.$valid) {
            if (confirm('Are you Sure?')) {
                var CustmObj = new Object();
                CustmObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
                CustmObj.BRANCH_ID = $scope.ReconSettings_Search.BRANCH_ID;
                CustmObj.USER_ID = parseInt($cookies.get("USERID"));
                CustmObj.INV_RECO_ACCOUNBT_CATEGORY_MAPPING = [];
                angular.forEach($scope.INV_RECO_ACCOUNT_CATEGORY_MAPPING, function (val) {
                    if (val.INTEGRATION_SYSTEM_ID > 0) {
                        val.CATEGORY_MASTER_IDS = ""
                        // do not remove this code future is in use
                        // angular.forEach(val.CATEGORY_LIST, function (cat) {

                        //     //if (cat.IS_CAT_SELECTED) { //
                        //     //    if (val.CATEGORY_MASTER_IDS == "") {
                        //     //        val.CATEGORY_MASTER_IDS = cat.ID;
                        //     //    }
                        //     //    else {
                        //     //        val.CATEGORY_MASTER_IDS = val.CATEGORY_MASTER_IDS + ',' + cat.ID;
                        //     //    }
                        //     //}
                        // });
                        var readonly = new Object();
                        if (val.INTEGRATION_SYSTEM_ID == 16) {
                            readonly.ACCOUNT_ID = val.ACCOUNT_ID;
                            readonly.ACCOUNT_NAME = null;
                        }
                        if (val.INTEGRATION_SYSTEM_ID == 25) {
                            readonly.ACCOUNT_ID = null;
                            readonly.ACCOUNT_NAME = val.ACCOUNT_NAME;
                        }
                        readonly.INTEGRATION_SYSTEM_ID = val.INTEGRATION_SYSTEM_ID;
                        readonly.CATEGORY_MASTER_IDS = val.IS_CAT_SELECTED;//val.CATEGORY_MASTER_IDS;
                        CustmObj.INV_RECO_ACCOUNBT_CATEGORY_MAPPING.push(readonly);
                    }
                });
                PrcCommMethods.CASHUP_API(CustmObj, 'INS_UPD_INV_RECO_ACCOUNT_CATEGORY_MAPPING').then(function (data) {
                    if (data.data == 1) {
                        $scope.$parent.ShowAlert('Success', 'Mapped successfully.', 5000);
                    }
                    if (data.data == 0) {
                        $scope.$parent.ShowAlert('Error', $scope.$parent.SOMETHINGWENTWRONG, 5000);
                    }
                });
            }
        }
    }

    $scope.INV_RECO_CONTACT_ACCOUNT_CATEGORY_MAPPING_LIST = [];
    $scope.GET_INV_RECO_CONTACT_ACCOUNT_CATEGORY_MAPPING = function () {
        var CustmObj = new Object();
        CustmObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CustmObj.BRANCH_ID = $scope.ReconSettings_Search.BRANCH_ID;
        CustmObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.CASHUP_API(CustmObj, 'GET_INV_RECO_CONTACT_ACCOUNT_CATEGORY_MAPPING').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.INV_RECO_CONTACT_ACCOUNT_CATEGORY_MAPPING_LIST = data.data.Table;
                angular.forEach($scope.INV_RECO_CONTACT_ACCOUNT_CATEGORY_MAPPING_LIST, function (val) {
                    val.CATEGORY_LIST = angular.copy($scope.CATEGORY_MASTER_LIST);
                    var List = val.CATEGORY_MASTER_IDS.split(',');
                    angular.forEach(val.CATEGORY_LIST, function (cat) {
                        const found = List.find((element) => element == cat.ID);
                        if (found > 0) {
                            cat.CTN_ACT_CAT_SELECTED_ID = true;
                        };
                    });
                });
            }
            else {
                $scope.CONTACT_ACCOUNT_CATEGORY_MAPPING_FY();
            }
        });
    }
    $scope.INV_RECO_CONTACT_XERO_CONTACT_MAPPING_LIST = [];
    //Step 3
    $scope.GET_INV_RECO_CONTACT_XERO_CONTACT_MAPPING = function () {
        var CustmObj = new Object();
        CustmObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CustmObj.BRANCH_ID = $scope.ReconSettings_Search.BRANCH_ID;
        CustmObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.CASHUP_API(CustmObj, 'GET_INV_RECO_CONTACT_XERO_CONTACT_MAPPING').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.INV_RECO_CONTACT_XERO_CONTACT_MAPPING_LIST = data.data.Table;
            }
        });
    }

    $scope.XERO_CONTACTS_LIST = [];
    $scope.GET_XERO_CONTACTS = function () {
        var CustmObj = new Object();
        CustmObj.ENTITY_ID = $scope.ReconSettings_Search.ENTITY_ID;
        CustmObj.BRANCH_ID = $scope.ReconSettings_Search.BRANCH_ID;
        CustmObj.SUPPLIER_NAME = "";
        CustmObj.PAGE_NO = 0;
        CustmObj.PAGE_SIZE = 0;
        PrcCommMethods.CASHUP_API(CustmObj, 'GET_XERO_CONTACTS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.XERO_CONTACTS_LIST = data.data.Table;
                $scope.GET_INV_RECO_CONTACT_ACCOUNT_CATEGORY_MAPPING();
            }
        });
    }
    //Step 3
    $scope.DEL_INV_RECO_CONTACT_XERO_CONTACT_MAPPING = function (LINE) {
        if (confirm("Are you sure?")) {
            var CustmObj = new Object();
            CustmObj.TABLE_ID = LINE.TABLE_ID;
            CustmObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.CASHUP_API(CustmObj, 'DEL_INV_RECO_CONTACT_XERO_CONTACT_MAPPING').then(function (data) {
                if (data.data == 1) {
                    $scope.GET_INV_RECO_CONTACT_XERO_CONTACT_MAPPING();
                }
            });
        }
    }

    $scope.CONTACT_ACCOUNT_CATEGORY_MAPPING_FY = function () {
        $scope.CONTACT_ACCOUNT_CATEGORY_BLANK = {
            ACCOUNT_ID: null,
            INTEGRATION_SYSTEM_ID: 25,
            CATEGORY_LIST: angular.copy($scope.CATEGORY_MASTER_LIST),
        };
        $scope.INV_RECO_CONTACT_ACCOUNT_CATEGORY_MAPPING_LIST.push(angular.copy($scope.CONTACT_ACCOUNT_CATEGORY_BLANK));
    }
    $scope.INS_UPD_INV_RECO_CONTACT_ACCOUNT_CATEGORY_MAPPING = function () {
        if (confirm('Are you Sure?')) {
            var CustmObj = new Object();
            CustmObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            CustmObj.BRANCH_ID = $scope.ReconSettings_Search.BRANCH_ID;
            CustmObj.USER_ID = parseInt($cookies.get("USERID"));
            CustmObj.INV_RECO_CONTACT_ACCOUNT_CATEGORY_MAPPING_TYPE = [];
            angular.forEach($scope.INV_RECO_CONTACT_ACCOUNT_CATEGORY_MAPPING_LIST, function (val) {
                if (val.INTEGRATION_SYSTEM_ID > 0) {
                    val.CATEGORY_MASTER_IDS = ""
                    var readonly = new Object();
                    var Recordctn = $scope.XERO_CONTACTS_LIST.filter(function (x) { return x.CONTACT_NAME === val.XERO_CONTACT_NAME });
                    angular.forEach(val.CATEGORY_LIST, function (cat) {
                        if (cat.CTN_ACT_CAT_SELECTED_ID) {
                            if (val.CATEGORY_MASTER_IDS == "") {
                                val.CATEGORY_MASTER_IDS = cat.ID;
                            }
                            else {
                                val.CATEGORY_MASTER_IDS = val.CATEGORY_MASTER_IDS + ',' + cat.ID;
                            }
                        }
                    });
                    readonly.XERO_CONTACT_ID = Recordctn[0].XERO_CONTACT_ID;
                    readonly.ACCOUNT_NAME = val.ACCOUNT_NAME;
                    readonly.INTEGRATION_SYSTEM_ID = val.INTEGRATION_SYSTEM_ID;
                    readonly.CATEGORY_MASTER_IDS = val.CATEGORY_MASTER_IDS;
                    CustmObj.INV_RECO_CONTACT_ACCOUNT_CATEGORY_MAPPING_TYPE.push(readonly);
                }
            });
            PrcCommMethods.CASHUP_API(CustmObj, 'INS_UPD_INV_RECO_CONTACT_ACCOUNT_CATEGORY_MAPPING').then(function (data) {
                if (data.data == 1) {
                    $scope.$parent.ShowAlert('Success', 'Mapped successfully.', 5000);
                    $scope.GET_INV_RECO_CONTACT_ACCOUNT_CATEGORY_MAPPING();
                }
                if (data.data == 0) {
                    $scope.$parent.ShowAlert('Error', $scope.$parent.SOMETHINGWENTWRONG, 5000);
                }
            });
        }
    }

    $scope.DELETE_CONTACT_ACCOUNT_CATEGORY_MAPPING = function (CL, index) {
        $scope.INV_RECO_CONTACT_ACCOUNT_CATEGORY_MAPPING_LIST.splice(index, 1);
    }

    $scope.GET_INV_RECO_ACCOUNT_MAPPING_FOR_ACCRUAL = function () {
        var CustmObj = new Object();
        CustmObj.ENTITY_ID = $scope.ReconSettings_Search.ENTITY_ID;
        CustmObj.BRANCH_ID = $scope.ReconSettings_Search.BRANCH_ID;
        PrcCommMethods.CASHUP_API(CustmObj, 'GET_INV_RECO_ACCOUNT_MAPPING_FOR_ACCRUAL').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.INV_RECO_ACCOUNT_MAPPING_FOR_ACCRUAL = data.data.Table;
                $('#AddCustomScroll_ACC').find('.dropdown-menu').addClass('custom-scrollbar');
            }
        });
    }

    $scope.GET_INV_RECO_ACCOUNT_MAPPING_FOR_PRE_PAYMENT = function () {
        var CustmObj = new Object();
        CustmObj.ENTITY_ID = $scope.ReconSettings_Search.ENTITY_ID;
        CustmObj.BRANCH_ID = $scope.ReconSettings_Search.BRANCH_ID;
        PrcCommMethods.CASHUP_API(CustmObj, 'GET_INV_RECO_ACCOUNT_MAPPING_FOR_PRE_PAYMENT').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.INV_RECO_ACCOUNT_MAPPING_FOR_PRE_PAYMENT = data.data.Table;
                $('#AddCustomScroll_PRE_ACC').find('.dropdown-menu').addClass('custom-scrollbar');
            }
        });
    }
    $scope.ADD_MAPPING_FOR_ACCURAL = function () {
        $scope.MapAccForm.submitted = true;
        if ($scope.MapAccForm.$valid) {
            var countList = 1;
            var ListACC = $scope.XERO_ACCOUNT_CODES_LIST.filter(function (ACT) {
                return ((ACT.NAME + '-' + ACT.CODE) == $scope.ReconSettings_Search.ACC_ACCOUNT_NAME);
            });
            if (ListACC.length > 0) {
                var countList = $scope.INV_RECO_ACCOUNT_MAPPING_FOR_ACCRUAL.filter(function (x) { return x.CATEGORY_MASTER_ID == $scope.ReconSettings_Search.ACC_CATEGORY_ID });
            }
            var CatList = $scope.CATEGORY_MASTER_LIST.filter(function (x) { return x.ID == $scope.ReconSettings_Search.ACC_CATEGORY_ID })
            if (ListACC.length > 0) {
                if (countList.length == 0) {
                    var obj = new Object();
                    obj.ACCOUNT_CODE = ListACC[0].CODE;
                    obj.ACCOUNT_NAME = ListACC[0].NAME;
                    obj.ACCOUNT_ID = ListACC[0].TABLE_ID;
                    obj.CATEGORY_MASTER_ID = $scope.ReconSettings_Search.ACC_CATEGORY_ID;
                    obj.CATEGORY_NAME = CatList[0].CATEGORY_NAME;
                    obj.SORT_ORDER = 1;
                    $scope.INV_RECO_ACCOUNT_MAPPING_FOR_ACCRUAL.push(obj);
                    $scope.RESET_MAPPING_FOR_ACCURAL();
                }
                else {
                    $scope.$parent.ShowAlert("Error", "Already in list", 2000);
                }
            } else {
                $scope.$parent.ShowAlert("Error", "Please select valid Account Name", 2000);
            }
        }
    }
    $scope.RESET_MAPPING_FOR_ACCURAL = function () {
        $scope.ReconSettings_Search.ACC_ACCOUNT_NAME = "";
        $scope.ReconSettings_Search.ACC_CATEGORY_ID = null;
        $scope.MapAccForm.submitted = false;
    }

    $scope.INS_UPD_INV_RECO_ACCOUNT_MAPPING_FOR_ACCRUAL = function () {
        if (confirm('Are You sure?')) {
            var CustmObj = new Object();
            CustmObj.ENTITY_ID = $scope.ReconSettings_Search.ENTITY_ID;
            CustmObj.BRANCH_ID = $scope.ReconSettings_Search.BRANCH_ID;
            CustmObj.USER_ID = parseInt($cookies.get("USERID"));
            CustmObj.INV_RECO_ACCOUNT_CATEGORY_MAPPING_FOR_ACCRUAL_TYPE = [];
            angular.forEach($scope.INV_RECO_ACCOUNT_MAPPING_FOR_ACCRUAL, function (x) {
                var obj = new Object();
                obj.CATEGORY_MASTER_ID = x.CATEGORY_MASTER_ID;
                obj.ACCOUNT_ID = x.ACCOUNT_ID;
                CustmObj.INV_RECO_ACCOUNT_CATEGORY_MAPPING_FOR_ACCRUAL_TYPE.push(obj);
            });
            PrcCommMethods.CASHUP_API(CustmObj, 'INS_UPD_INV_RECO_ACCOUNT_MAPPING_FOR_ACCRUAL').then(function (data) {
                if (data.data == 1) {
                    $scope.GET_INV_RECO_ACCOUNT_MAPPING_FOR_ACCRUAL();
                    $scope.$parent.ShowAlert("Success", "Save Successfully", 2000);
                }
            });
        }
    }
    $scope.INS_UPD_INV_RECO_ACCOUNT_MAPPING_FOR_PRE_PAYMENT = function () {
        if (confirm('Are You sure?')) {
            var ListACC = [];
            var CustmObj = new Object();
            CustmObj.ENTITY_ID = $scope.ReconSettings_Search.ENTITY_ID;
            CustmObj.BRANCH_ID = $scope.ReconSettings_Search.BRANCH_ID;
            CustmObj.USER_ID = parseInt($cookies.get("USERID"));
            CustmObj.INV_RECO_ACCOUNT_CATEGORY_MAPPING_FOR_ACCRUAL_TYPE = [];
            angular.forEach($scope.INV_RECO_ACCOUNT_MAPPING_FOR_PRE_PAYMENT, function (x) {
                ListACC = $scope.XERO_ACCOUNT_CODES_LIST.filter(function (ACT) { return ((ACT.NAME + '-' + ACT.CODE) == x.ACCOUNT_NAME); });
                if (ListACC.length > 0) {
                    var obj = new Object();
                    obj.CATEGORY_MASTER_ID = null;
                    obj.ACCOUNT_ID = ListACC[0].TABLE_ID;
                    CustmObj.INV_RECO_ACCOUNT_CATEGORY_MAPPING_FOR_ACCRUAL_TYPE.push(obj);
                }
            });
            if (CustmObj.INV_RECO_ACCOUNT_CATEGORY_MAPPING_FOR_ACCRUAL_TYPE.length > 0) {
                PrcCommMethods.CASHUP_API(CustmObj, 'INS_UPD_INV_RECO_ACCOUNT_MAPPING_FOR_PRE_PAYMENT').then(function (data) {
                    if (data.data == 1) {
                        $scope.GET_INV_RECO_ACCOUNT_MAPPING_FOR_PRE_PAYMENT();
                        $scope.$parent.ShowAlert("Success", "Save Successfully", 2000);
                    }
                });
            }
        }
    }

    $scope.ADD_MAPPING_FOR_PRE_PAYMENT = function () {
        var countList = 1;
        var ListRepACC = $scope.XERO_ACCOUNT_CODES_LIST.filter(function (ACT) {
            return ((ACT.NAME + '-' + ACT.CODE) == $scope.ReconSettings_Search.PRE_PAYMENT_ACCOUNT_NAME);
        });
        if (ListRepACC.length > 0) {
            countList = $scope.INV_RECO_ACCOUNT_MAPPING_FOR_PRE_PAYMENT.filter(function (x) { return x.ACCOUNT_ID == ListRepACC[0].TABLE_ID });
        }

        if (countList.length == 0) {
            var obj = new Object();
            obj.ACCOUNT_CODE = ListRepACC[0].CODE;
            obj.ACCOUNT_NAME = ListRepACC[0].NAME;
            obj.ACCOUNT_ID = ListRepACC[0].TABLE_ID;
            obj.CATEGORY_MASTER_ID = null;
            obj.CATEGORY_NAME = "";
            obj.SORT_ORDER = 1;
            $scope.INV_RECO_ACCOUNT_MAPPING_FOR_PRE_PAYMENT.push(obj);
            $scope.RESET_MAPPING_FOR_PRE_PAYMENT();
        }
        else {
            $scope.$parent.ShowAlert("Error", "Already in list", 2000);
        }
    }

    $scope.DELETE_CMAPPING_FOR_ACCURAL = function (LINE, INDEX) {
        $scope.INV_RECO_ACCOUNT_MAPPING_FOR_ACCRUAL.splice(INDEX, 1);
    }
    $scope.DELETE_CMAPPING_FOR_PRE_PAYMENT = function (LINE, INDEX) {
        $scope.INV_RECO_ACCOUNT_MAPPING_FOR_PRE_PAYMENT.splice(INDEX, 1);
    }
    $scope.RESET_MAPPING_FOR_PRE_PAYMENT = function () {
        $scope.ReconSettings_Search.PRE_PAYMENT_ACCOUNT_NAME = "";
    }


    $scope.TAB_CLICK_SHDL_FY = function (FLAG) {
        $scope.TAB_FLAG = FLAG;
        if (FLAG == 2) {
            $scope.GET_XERO_CONTACTS();
        }
        if (FLAG == 3) {
            $scope.GET_INV_RECO_CONTACT_XERO_CONTACT_MAPPING();
        }
        if (FLAG == 4) {
            $scope.GET_INV_RECO_ACCOUNT_MAPPING_FOR_ACCRUAL();
        }
        if (FLAG == 5) {
            $scope.GET_INV_RECO_ACCOUNT_MAPPING_FOR_PRE_PAYMENT();
        }

    }
})