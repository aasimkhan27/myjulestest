app.filter('utcToLocal', utcToLocal);
function utcToLocal($filter) {
    return function (utcDateString, format) {
        if (!utcDateString) {
            return;
        }

        // append 'Z' to the date string to indicate UTC time if the timezone isn't already specified
        if (utcDateString.indexOf('Z') === -1 && utcDateString.indexOf('+') === -1) {
            utcDateString += 'Z';
        }

        return $filter('date')(utcDateString, format);
    };
};
app.controller('Pay_InvoiceController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $interval, $localStorage) {
    //====================== XERO_INVOICES_LIST List =====================================
    $scope.SCHEDULE_CLICK = true;
    $scope.COMMON_CODE_CHANGE();
    $scope.XERO_INVOICES_LIST = [];
    $scope.SUPPLIER_VIEW_LIST = [];
    $scope.XERO_INVOICES_AGING_SELECTED_LIS = [];
    // $scope.BRANCH_LOGIN_LIST = [];
    $scope.InvoiceSearch = {
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        SHDL_PAGE_SIZE: 10,
        SHDL_PAGE_NO: 1,
        ACTIVE: 1,
        COMMENT: '',
        PAYMENT_DATE: '',
        TOTAL_INVOICES: 0,
        SUPPLIERS_COUNT: 0,
        TOTAL_AMOUNT: 0,
        PAYMENT_AMOUNT: 0,
        DUE_AMOUNT_SO: true,
        AMOUNT_SO: true,
        DUE_DATE_SO: false,
        SCHEDULE_STATUS_SO: true,
        INVOICEDATE_SO: true,
        INVOICENUMBER_SO: true,
        XCNAME_SO: true,
        PAID_AMOUNT_SO: true,
        SCHEDULED_AMOUNT_SO: true,
        INVOICE_STATUS_SO: true,
        SCHEDULE_DATE_SO: true,
        CREATED_DATE_SO: true,
        SWITCH_DUE_INVOICE_DATE: true,
        INVOICE_STATUS: '',
        BRANCH_LOGIN_ID: parseInt($cookies.get("BRANCH_ID")),
        SHDL_BRANCH_LOGIN_ID: parseInt($cookies.get("BRANCH_ID")),
        INVOICENUMBER: 1,
        XCNAME: 2,
        INVOICEDATE: 3,
        DUE_DATE: 4,
        AMOUNT_F: 5,
        DUE_AMOUNT: 6,
        PAID_AMOUNT: 7,
        SCHEDULED_AMOUNT: 8,
        SCHEDULE_DATE: 9,
        SCHEDULE_STATUS: 10,
        CREATED_DATE: 11,
        INVOICE_DATE_TEXT: "Invoice Date",
        DUE_DATE_TEXT: "Due Date",
        SCHEDULE_DATE_TEXT: "Schedule Date"
    };
    //if ($localStorage.BRANCH_LOGIN_LIST !== undefined) {
    //    $scope.BRANCH_LOGIN_LIST = JSON.parse($localStorage.BRANCH_LOGIN_LIST);
    //}

    $scope.HEADER_SH_INV_LIST = [];

    $scope.HEADER_LIST = [{ NAME: "Invoice #", ID: 1, CLASS_NAME: 'w-9', IS_SORT_ALLOW: true },
    { NAME: "Supplier Name", ID: 2, CLASS_NAME: '', IS_SORT_ALLOW: true },
    { NAME: "Invoice Date ", ID: 3, CLASS_NAME: '', IS_SORT_ALLOW: true },
    { NAME: "Due Date ", ID: 4, CLASS_NAME: '', IS_SORT_ALLOW: true },
    { NAME: "Currency ", ID: 4, CLASS_NAME: '', IS_SORT_ALLOW: false },
    { NAME: "Amount", ID: 5, CLASS_NAME: 'text-right', IS_SORT_ALLOW: true },
    { NAME: "Due Amount", ID: 6, CLASS_NAME: 'text-right', IS_SORT_ALLOW: true },
    //{ NAME: "Invoice Status", ID: 0, CLASS_NAME: 'text-center', IS_SORT_ALLOW: true },
    { NAME: "Reconciliation", ID: 13, CLASS_NAME: '', IS_SORT_ALLOW: true }];

    //eeorin map 5
    $scope.HEADER_SH_INV_LIST = [{ NAME: "Invoice #", ID: 1, CLASS_NAME: '', IS_SORT_ALLOW: true },
    { NAME: "Supplier Name", ID: 2, CLASS_NAME: '', IS_SORT_ALLOW: true },
    { NAME: "Invoice Date ", ID: 3, CLASS_NAME: '', IS_SORT_ALLOW: true },
    { NAME: "Due Date ", ID: 4, CLASS_NAME: '', IS_SORT_ALLOW: true },
    { NAME: "Currency", ID: 5, CLASS_NAME: '', IS_SORT_ALLOW: false },
    { NAME: "Amount", ID: 5, CLASS_NAME: 'text-right', IS_SORT_ALLOW: true },
    { NAME: "Paid ", ID: 7, CLASS_NAME: 'text-right', IS_SORT_ALLOW: true },
    { NAME: "Due Amount ", ID: 6, CLASS_NAME: 'text-right', IS_SORT_ALLOW: true },
    { NAME: "Scheduled ", ID: 8, CLASS_NAME: 'text-right', IS_SORT_ALLOW: true },
    { NAME: "Schedule Name", ID: 12, CLASS_NAME: '', IS_SORT_ALLOW: true },
    { NAME: "Schedule Date ", ID: 9, CLASS_NAME: 'text-left', IS_SORT_ALLOW: true },
    { NAME: "Schedule  Status", ID: 10, CLASS_NAME: 'text-center', IS_SORT_ALLOW: true },
    { NAME: "Reconciliation", ID: 13, CLASS_NAME: '', IS_SORT_ALLOW: true }];

    $scope.INVOICE_STATUS = [{ NAME: "PAID", ID: "PAID" }, { NAME: "AUTHORISED", ID: "AUTHORISED" }, { NAME: "DRAFT", ID: "DRAFT" }, { NAME: "VOIDED", ID: "VOIDED" }, { NAME: "DELETED", ID: "DELETED" },];
    $scope.SCHEDULES_STATUS = [{ NAME: "APPROVED", ID: 37 }, { NAME: "REJECTED", ID: 38 }, { NAME: "PENDING", ID: 39 }, { NAME: 'SCHEDULED IN XERO', ID: 0 }];
    $scope.BLANK_APPROVER_LIST = { APPROVER_NAME: null, ORDER: null };

    $scope.TAB_FLAG = 3;

    function reportShdlScheduledaterange(startDate, endDate) {
        $scope.InvoiceSearch.SHDL_SCHEDULE_DATE_START = startDate.format($scope.$parent.Datelocaleformat.format);
        $scope.InvoiceSearch.SHDL_SCHEDULE_DATE_END = endDate.format($scope.$parent.Datelocaleformat.format);
        $('#reportShdlScheduledaterange span').html(startDate.format($scope.$parent.Datelocaleformat.format) + ' - ' + endDate.format($scope.$parent.Datelocaleformat.format));
    };
    function reportShdlduedaterange(startDate, endDate) {
        $scope.InvoiceSearch.SHDL_INVOICE_START_DATE = startDate.format($scope.$parent.Datelocaleformat.format);
        $scope.InvoiceSearch.SHDL_INVOICE_END_DATE = endDate.format($scope.$parent.Datelocaleformat.format);

        $('#reportShdlduedaterange span').html(startDate.format($scope.$parent.Datelocaleformat.format) + ' - ' + endDate.format($scope.$parent.Datelocaleformat.format));
    };
    function reporShdltrange(startDate, endDate) {
        $scope.InvoiceSearch.SHDL_INVOICE_START_DATE = startDate.format($scope.$parent.Datelocaleformat.format);
        $scope.InvoiceSearch.SHDL_INVOICE_END_DATE = endDate.format($scope.$parent.Datelocaleformat.format);
        $('#reporShdltrange span').html(startDate.format($scope.$parent.Datelocaleformat.format) + ' - ' + endDate.format($scope.$parent.Datelocaleformat.format));

    };
    function reporInvrange(startDate, endDate) {
        $scope.InvoiceSearch.INVOICE_START_DATE = startDate.format($scope.$parent.Datelocaleformat.format);
        $scope.InvoiceSearch.INVOICE_END_DATE = endDate.format($scope.$parent.Datelocaleformat.format);
        $('#reporInvrange span').html(startDate.format($scope.$parent.Datelocaleformat.format) + ' - ' + endDate.format($scope.$parent.Datelocaleformat.format));
    };
    function reportDueDaterange(startDate, endDate) {
        $scope.InvoiceSearch.DUE_START_DATE = startDate.format($scope.$parent.Datelocaleformat.format);
        $scope.InvoiceSearch.DUE_END_DATE = endDate.format($scope.$parent.Datelocaleformat.format);
        $('#reportduedaterange span').html(startDate.format($scope.$parent.Datelocaleformat.format) + ' - ' + endDate.format($scope.$parent.Datelocaleformat.format));
    };

    function reporInvrangetab1(startDate, endDate) {
        $scope.InvoiceSearch.INVOICE_START_DATE = startDate.format($scope.$parent.Datelocaleformat.format);
        $scope.InvoiceSearch.INVOICE_END_DATE = endDate.format($scope.$parent.Datelocaleformat.format);
        $('#reporInvrange span').html(startDate.format($scope.$parent.Datelocaleformat.format) + ' - ' + endDate.format($scope.$parent.Datelocaleformat.format));
        $('#reporInvrangetab1 span').html(startDate.format($scope.$parent.Datelocaleformat.format) + ' - ' + endDate.format($scope.$parent.Datelocaleformat.format));
    };
    function reportDueDaterangetab1(startDate, endDate) {
        $scope.InvoiceSearch.DUE_START_DATE = startDate.format($scope.$parent.Datelocaleformat.format);
        $scope.InvoiceSearch.DUE_END_DATE = endDate.format($scope.$parent.Datelocaleformat.format);
        $('#reportduedaterange span').html(startDate.format($scope.$parent.Datelocaleformat.format) + ' - ' + endDate.format($scope.$parent.Datelocaleformat.format));
        $('#reportduedaterangetab1 span').html(startDate.format($scope.$parent.Datelocaleformat.format) + ' - ' + endDate.format($scope.$parent.Datelocaleformat.format));
    };
    $(function () {
        startDate = moment().startOf('month');//moment().startOf('isoWeek');//moment().subtract(6, 'days');
        endDate = moment().endOf('month'); //moment().subtract(0, 'days');

        $scope.$parent.SetUpDateRangeMultiDatePicker('reporInvrange', startDate, endDate, reporInvrange, 1);
        $scope.$parent.SetUpDateRangeMultiDatePicker('reportduedaterange', startDate, endDate, reportDueDaterange, 1);

        $scope.$parent.SetUpDateRangeMultiDatePicker('reporInvrangetab1', startDate, endDate, reporInvrangetab1, 1);
        $scope.$parent.SetUpDateRangeMultiDatePicker('reportduedaterangetab1', startDate, endDate, reportDueDaterangetab1, 1);

        $scope.$parent.SetUpDateRangeMultiDatePicker('reportShdlScheduledaterange', startDate, endDate, reportShdlScheduledaterange, 1);
        $scope.$parent.SetUpDateRangeMultiDatePicker('reportShdlduedaterange', startDate, endDate, reportShdlduedaterange, 1);
        $scope.$parent.SetUpDateRangeMultiDatePicker('reporShdltrange', startDate, endDate, reporShdltrange, 1);

        //$('#reporInvrange span').html(startDate.format($scope.$parent.Datelocaleformat.format) + ' - ' + endDate.format($scope.$parent.Datelocaleformat.format));
        //$('#reportduedaterange span').html(startDate.format($scope.$parent.Datelocaleformat.format) + ' - ' + endDate.format($scope.$parent.Datelocaleformat.format));
    });

    $(document).on("click", ".ranges ul li", function (event) {
        var a = $(this).attr("data-range-key");
        if (a == "Custom Date" && ($scope.loader == 1)) {
            $scope.loader = 2;
            var start = moment().startOf('month');
            var end = moment().add(1, 'M').endOf('month');
            //$('#' + ControlName).trigger('show.daterangepicker')
            $scope.$parent.SetUpDateRangeMultiDatePicker('reportrange', start, end, reportrange, 1, "right", 'Open');
            $('#reportrange').data('daterangepicker').show();
        }
        else {
            $scope.loader = 1;
        }
    });
    $scope.loader = 1;

    $scope.GET_XERO_INVOICES_LAZY_LOAD = function () {
        $scope.GET_XERO_INVOICES(2, $scope.SORT_COLUMN_NO, $scope.SORT_ORDER_NO_ASCDESC, 1);
    };
    $scope.GET_XERO_INVOICES_AGING_LAZY_LOAD = function () {
        $scope.GET_XERO_INVOICES(2, $scope.SORT_COLUMN_NO, $scope.SORT_ORDER_NO_ASCDESC, 2);
    };
    $scope.RESET_XERO_INVOICES_FILTER = function (FLAG) {
        $scope.InvoiceSearch.INVOICE_NO = "";
        $scope.InvoiceSearch.SUPPLIER_NAME = "";
        $scope.InvoiceSearch.STATUS_IDS = null;
        $scope.InvoiceSearch.DUE_START_DATE = "";
        $scope.InvoiceSearch.DUE_END_DATE = "";
        $scope.InvoiceSearch.INVOICE_START_DATE = "";
        $scope.InvoiceSearch.INVOICE_END_DATE = "";
        //startDate = moment().startOf('month');//moment().startOf('isoWeek');//moment().subtract(6, 'days');
        //endDate = moment().endOf('month'); //moment().subtract(0, 'days');
        //reporInvrange(startDate, endDate);
        //reportDueDaterange(startDate, endDate);
        $('#reporInvrange span').html($scope.InvoiceSearch.INVOICE_DATE_TEXT);
        $('#reportduedaterange span').html($scope.InvoiceSearch.DUE_DATE_TEXT);

        $('#reporInvrangetab1 span').html($scope.InvoiceSearch.INVOICE_DATE_TEXT);
        $('#reportduedaterangetab1 span').html($scope.InvoiceSearch.DUE_DATE_TEXT);

        $scope.InvoiceSearch.BRANCH_LOGIN_ID = parseInt($cookies.get("BRANCH_ID")),
            $scope.GET_XERO_INVOICES(1, 4, false, FLAG);
    }

    $scope.IntegrationDetails = new Object();
    $scope.IntegrationDetails.PageLoad = true;

    $scope.RESYNC_XERO_DATA = function () {
        $scope.IntegrationDetails.PageLoad = true;
        var ModelObj = new Object();
        ModelObj.TABLE_ID = $scope.IntegrationDetails.ID;
        PrcCommMethods.PAYMENT_API(ModelObj, "RESYNC_XERO_DATA").then(function (data) {
            if (data.data == 1) {
                $scope.IntegrationDetails.PageLoad = false;
                $scope.IntegrationDetails.ShowSyncBtn = false;
                $scope.StartResyncInterval();
            }
        });
    }

    var promise;
    $scope.countx = 0;
    $scope.StartResyncInterval = function () {
        promise = $interval(IntervalExecution, 60000);
    };

    // stops the interval
    $scope.StopResyncInterval = function () {
        $interval.cancel(promise);
    };

    function IntervalExecution() {
        $scope.GetIntegrationDetails();
    }
    $scope.LAST_MONTH1_AMT = 0;
    $scope.LAST_MONTH2_AMT = 0;
    $scope.LAST_MONTH3_AMT = 0;
    $scope.LAST_OLDER_AMT = 0;
    $scope.LAST_SUP_TOTAL_AMT = 0;
    $scope.GetIntegrationDetails = function () {

        var PaymentModelObj = new Object();
        PaymentModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        PaymentModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PaymentModelObj.BRANCH_ID = $scope.InvoiceSearch.BRANCH_LOGIN_ID;
        PrcCommMethods.PAYMENT_API(PaymentModelObj, 'GetIntegrationDetails').then(function (data) {
            $scope.IntegrationDetails = data.data.filter(function (x) { return x.IS_OUTBOUND == false })[0];
            if ($scope.IntegrationDetails.INTEGRATION_STATUS == 2) {
                $scope.IntegrationDetails.ShowSyncBtn = true;
                $scope.IntegrationDetails.PageLoad = false;
                $scope.StopResyncInterval();
            }
            else {
                //$scope.StartResyncInterval();
                $scope.IntegrationDetails.PageLoad = false;
                $scope.IntegrationDetails.ShowSyncBtn = false;
            }
            // if ($scope.IntegrationDetails.)
        });
    }
    $scope.IS_PARTIAL_PAYMENT_ALLOW = JSON.parse($localStorage.ENTITY_SETTINGS).filter(x => x.SETTING_ID == 22)[0]["SETTING_VALUE"] == 1 ? true : false;
    $scope.XERO_INVOICES__AGING_LIST = [];
    $scope.XERO_INVOICES__AGING_SELECTED_LIST = [];
    $scope.GET_XERO_INVOICES = function (FLAG, SORT_COLUMN_NO, SORT_ORDER_NO_ASCDESC, PENDING_FLAG) {
        if (SORT_COLUMN_NO != 0) {
            $scope.SORT_COLUMN_NO = SORT_COLUMN_NO;
            $scope.SORT_ORDER_NO_ASCDESC = SORT_ORDER_NO_ASCDESC;
            $scope.$parent.overlay_loadingNew = 'block';
            var PaymentModelObj = new Object();
            if (FLAG == 1) {
                $scope.XERO_INVOICES_LIST = [];
                //angular.forEach($scope.XERO_INVOICES__AGING_LIST.filter(function (select) { return select.TYPE == 2 && select.INVOICE_CHECK }), function (x) {
                //    $scope.XERO_INVOICES__AGING_SELECTED_LIST.push(x);
                //})
                $scope.XERO_INVOICES__AGING_LIST = [];
                $scope.LAST_MONTH1_AMT = 0;
                $scope.LAST_MONTH2_AMT = 0;
                $scope.LAST_MONTH3_AMT = 0;
                $scope.LAST_OLDER_AMT = 0;
                $scope.LAST_SUP_TOTAL_AMT = 0;
                $scope.InvoiceSearch.PAGE_NO = 1;
            }
            PaymentModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            PaymentModelObj.BRANCH_LOGIN_ID = $scope.InvoiceSearch.BRANCH_LOGIN_ID;
            PaymentModelObj.INVOICE_NO = $scope.InvoiceSearch.INVOICE_NO;
            PaymentModelObj.SUPPLIER_NAME = $scope.InvoiceSearch.SUPPLIER_NAME;
            PaymentModelObj.STATUS_IDS = $scope.InvoiceSearch.STATUS_IDS;
            PaymentModelObj.INVOICE_START_DATE = $scope.InvoiceSearch.INVOICE_START_DATE
            PaymentModelObj.INVOICE_END_DATE = $scope.InvoiceSearch.INVOICE_END_DATE
            PaymentModelObj.DUE_START_DATE = $scope.InvoiceSearch.DUE_START_DATE
            PaymentModelObj.DUE_END_DATE = $scope.InvoiceSearch.DUE_END_DATE
            PaymentModelObj.PAGE_NO = $scope.InvoiceSearch.PAGE_NO;
            PaymentModelObj.PAGE_SIZE = $scope.InvoiceSearch.PAGE_SIZE;
            PaymentModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PaymentModelObj.PENDING_FLAG = PENDING_FLAG;
            PaymentModelObj.SORT_ORDER_NO = SORT_ORDER_NO_ASCDESC ? 1 : -1;//1 FOR ASC -1 FOR DESC
            PaymentModelObj.SORT_COLUMN_NO = SORT_COLUMN_NO;
            PaymentModelObj.LAST_MONTH1_AMT = $scope.LAST_MONTH1_AMT;
            PaymentModelObj.LAST_MONTH2_AMT = $scope.LAST_MONTH2_AMT;
            PaymentModelObj.LAST_MONTH3_AMT = $scope.LAST_MONTH3_AMT;
            PaymentModelObj.LAST_OLDER_AMT = $scope.LAST_OLDER_AMT;
            PaymentModelObj.LAST_SUP_TOTAL_AMT = $scope.LAST_SUP_TOTAL_AMT;
            PaymentModelObj.FLAG = $scope.InvoiceSearch.SWITCH_DUE_INVOICE_DATE ? "1" : "0";
            if (PENDING_FLAG == 1) {
                PrcCommMethods.PAYMENT_API(PaymentModelObj, 'GET_XERO_INVOICES').then(function (data) {
                    if (data.data.Table.length > 0) {
                        $scope.$parent.overlay_loadingNew = 'none';
                        $scope.XERO_INVOICES_LIST = $scope.XERO_INVOICES_LIST.concat(data.data.Table);
                        $scope.XERO_TOTAL_AMOUNT = data.data.Table[0].TOTAL_AMOUNT;
                        $scope.TOTAL_DUE_AMOUNT = data.data.Table[0].TOTAL_AMOUNTDUE;
                        $scope.InvoiceSearch.IS_ALL_SELECTED = false;
                        var ctn = 0;
                        angular.forEach($scope.XERO_INVOICES_LIST, function (XinL) {
                            var iList = $scope.XERO_INVOICES_SELECTED_LIST.filter(function (x) { return XinL.ID == x.ID; });
                            if (iList.length > 0) {
                                XinL.IS_SELECTED = true;
                                ctn++;
                            }
                        });
                        if (ctn == $scope.XERO_INVOICES_LIST.length) {
                            $scope.InvoiceSearch.IS_ALL_SELECTED = true;
                        }
                        if (data.data.Table.length < $scope.InvoiceSearch.PAGE_SIZE) {
                            $scope.GetData = false;
                        }
                        else {
                            $scope.InvoiceSearch.PAGE_NO = parseInt($scope.InvoiceSearch.PAGE_NO) + 1;
                            $scope.GetData = true;
                        }
                    } else {
                        if ($scope.XERO_INVOICES_LIST.length == 0) { }
                        $scope.GetData = false;
                        $scope.$parent.overlay_loadingNew = 'none';
                    }
                });
            }
            if (PENDING_FLAG == 2) {
                PrcCommMethods.PAYMENT_API(PaymentModelObj, 'GET_XERO_INVOICES_AGING').then(function (data) {
                    $scope.$parent.overlay_loadingNew = 'none';
                    if (data.data.length > 0) {
                        $scope.XERO_INVOICES__AGING_LIST = $scope.XERO_INVOICES__AGING_LIST.concat(data.data);
                        $scope.LAST_MONTH1_AMT = $scope.XERO_INVOICES__AGING_LIST[$scope.XERO_INVOICES__AGING_LIST.length - 1].MONTH1_AMT;
                        $scope.LAST_MONTH2_AMT = $scope.XERO_INVOICES__AGING_LIST[$scope.XERO_INVOICES__AGING_LIST.length - 1].MONTH2_AMT;
                        $scope.LAST_MONTH3_AMT = $scope.XERO_INVOICES__AGING_LIST[$scope.XERO_INVOICES__AGING_LIST.length - 1].MONTH3_AMT;
                        $scope.LAST_OLDER_AMT = $scope.XERO_INVOICES__AGING_LIST[$scope.XERO_INVOICES__AGING_LIST.length - 1].OLDER_AMT;
                        $scope.LAST_SUP_TOTAL_AMT = $scope.XERO_INVOICES__AGING_LIST[$scope.XERO_INVOICES__AGING_LIST.length - 1].SUPPLIER_TOTAL;
                        angular.forEach($scope.XERO_INVOICES__AGING_SELECTED_LIST, function (Selected_LINE) {
                            var lenth = $scope.XERO_INVOICES__AGING_LIST.filter(function (x) { return x.TYPE == 2 && x.INVOICE_NUMBER == Selected_LINE.INVOICE_NUMBER });
                            if (lenth.length > 0) {
                                lenth[0].INVOICE_CHECK = true;
                            }
                        });

                    }
                    if (data.data.length < $scope.InvoiceSearch.PAGE_SIZE) {
                        $scope.GetAgingData = false;
                    }
                    else {
                        $scope.InvoiceSearch.PAGE_NO = parseInt($scope.InvoiceSearch.PAGE_NO) + 1;
                        $scope.GetAgingData = true;
                        $scope.GET_XERO_INVOICES_AGING_LAZY_LOAD();
                    }
                });
            }


        }
    }


    // $scope.GET_XERO_INVOICES(1, 2, false, 2);


    $scope.RESET_SHDL_XERO_INVOICES_FILTER = function () {
        $scope.InvoiceSearch.SHDL_INVOICE_NO = "";
        $scope.InvoiceSearch.SHDL_SUPPLIER_NAME = "";
        $scope.InvoiceSearch.SHDL_STATUS_IDS = null;
        $scope.InvoiceSearch.SHDL_DUE_START_DATE = "";
        $scope.InvoiceSearch.SHDL_DUE_END_DATE = "";
        $scope.InvoiceSearch.SHDL_INVOICE_START_DATE = "";
        $scope.InvoiceSearch.SHDL_INVOICE_END_DATE = "";
        $scope.InvoiceSearch.SHDL_SCHEDULE_DATE_START = "";
        $scope.InvoiceSearch.SHDL_SCHEDULE_DATE_END = "";
        $scope.InvoiceSearch.SHDL_BRANCH_LOGIN_ID = parseInt($cookies.get("BRANCH_ID")),
            $('#reporShdltrange span').html($scope.InvoiceSearch.INVOICE_DATE_TEXT);
        $('#reportShdlScheduledaterange span').html($scope.InvoiceSearch.SCHEDULE_DATE_TEXT);
        $('#reportShdlduedaterange span').html($scope.InvoiceSearch.DUE_DATE_TEXT);

        //startDate = moment().startOf('month');//moment().startOf('isoWeek');//moment().subtract(6, 'days');
        //endDate = moment().endOf('month'); //moment().subtract(0, 'days');
        //reportShdlScheduledaterange(startDate, endDate);
        //reportShdlduedaterange(startDate, endDate);
        //reporShdltrange(startDate, endDate);
        $scope.GET_SHDL_XERO_INVOICES(1, 4, false);
    }

    $scope.GET_XERO_SHDL_INVOICES_LAZY_LOAD = function () {
        $scope.GET_SHDL_XERO_INVOICES(2, $scope.SORT_SHD_COLUMN_NO, $scope.SORT_ORDER_NO_ASCDESC_SHD);
    };
    $scope.reverseSort = true;
    $scope.reverseXeroSort = true;

    $scope.GET_SHDL_XERO_INVOICES = function (FLAG, SORT_COLUMN_NO, SORT_ORDER_NO_ASCDESC) {
        if (SORT_COLUMN_NO != 0) {
            $scope.SORT_SHD_COLUMN_NO = SORT_COLUMN_NO;
            $scope.SORT_ORDER_NO_ASCDESC_SHD = SORT_ORDER_NO_ASCDESC;

            $scope.$parent.overlay_loadingNew = 'block';
            var PaymentModelObj = new Object();
            if (FLAG == 1) {
                $scope.XERO_SHDL_INVOICES_LIST = [];
                $scope.InvoiceSearch.SHDL_PAGE_NO = 1;
            }
            PaymentModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            PaymentModelObj.BRANCH_LOGIN_ID = $scope.InvoiceSearch.SHDL_BRANCH_LOGIN_ID;
            PaymentModelObj.INVOICE_NO = $scope.InvoiceSearch.SHDL_INVOICE_NO;
            PaymentModelObj.SUPPLIER_NAME = $scope.InvoiceSearch.SHDL_SUPPLIER_NAME;
            PaymentModelObj.STATUS_IDS = $scope.InvoiceSearch.SHDL_STATUS_IDS;
            PaymentModelObj.INVOICE_START_DATE = $scope.InvoiceSearch.SHDL_INVOICE_START_DATE;
            PaymentModelObj.INVOICE_END_DATE = $scope.InvoiceSearch.SHDL_INVOICE_END_DATE;
            PaymentModelObj.DUE_START_DATE = $scope.InvoiceSearch.SHDL_DUE_START_DATE;
            PaymentModelObj.DUE_END_DATE = $scope.InvoiceSearch.SHDL_DUE_END_DATE;
            PaymentModelObj.SCHEDULE_DATE_START = $scope.InvoiceSearch.SHDL_SCHEDULE_DATE_START;
            PaymentModelObj.SCHEDULE_DATE_END = $scope.InvoiceSearch.SHDL_SCHEDULE_DATE_END;
            PaymentModelObj.PAGE_NO = $scope.InvoiceSearch.SHDL_PAGE_NO;
            PaymentModelObj.PAGE_SIZE = $scope.InvoiceSearch.SHDL_PAGE_SIZE;
            PaymentModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PaymentModelObj.PENDING_FLAG = 0;
            PaymentModelObj.SORT_ORDER_NO = SORT_ORDER_NO_ASCDESC ? 1 : -1;//1 FOR ASC -1 FOR DESC
            PaymentModelObj.SORT_COLUMN_NO = SORT_COLUMN_NO;
            //"XC.NAME DESC" : "XC.NAME ASC"
            PrcCommMethods.PAYMENT_API(PaymentModelObj, 'GET_XERO_INVOICES').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.$parent.overlay_loadingNew = 'none';
                    $scope.XERO_SHDL_INVOICES_LIST = $scope.XERO_SHDL_INVOICES_LIST.concat(data.data.Table);
                    $scope.XERO_INVOICE_TOTAL = data.data.Table[0];
                    if (data.data.Table.length < $scope.InvoiceSearch.SHDL_PAGE_SIZE) {
                        $scope.GetShdData = false;
                    }
                    else {
                        $scope.InvoiceSearch.SHDL_PAGE_NO = parseInt($scope.InvoiceSearch.SHDL_PAGE_NO) + 1;
                        $scope.GetShdData = true;
                    }
                } else {
                    if ($scope.XERO_SHDL_INVOICES_LIST.length == 0) { }
                    $scope.GetShdData = false;
                    $scope.$parent.overlay_loadingNew = 'none';
                }
            })
        }
    }


    //====================== Manual Request ==================================
    $scope.XERO_INVOICES_SELECTED_LIST = [];
    $scope.XERO_INVOICES__AGING_SELECTED_LIST = [];

    $scope.SET_CHECKBOX_ALL = function () {
        angular.forEach($scope.XERO_INVOICES_LIST, function (value) {
            value.IS_SELECTED = $scope.InvoiceSearch.IS_ALL_SELECTED;
            if (value.IS_SELECTED) {
                var iList = $scope.XERO_INVOICES_SELECTED_LIST.filter(function (x) { return value.ID == x.ID; });
                if (iList.length == 0) {
                    $scope.XERO_INVOICES_SELECTED_LIST.push(value);
                }
            }
        });
    };
    $scope.SET_CHECKBOX_LINE = function () {
        $scope.InvoiceSearch.IS_ALL_SELECTED = true;
        var count = 0
        for (var i = 0; i < $scope.XERO_INVOICES_LIST.length; i++) {
            var iList = $scope.XERO_INVOICES_SELECTED_LIST.filter(function (x) { return $scope.XERO_INVOICES_LIST[i].ID == x.ID; });
            if ($scope.XERO_INVOICES_LIST[i].IS_SELECTED) {
                if (iList.length == 0) {
                    $scope.XERO_INVOICES_SELECTED_LIST.push($scope.XERO_INVOICES_LIST[i]);
                }
            }
            else {
                if (iList.length > 0) {
                    var indexofinv = $scope.XERO_INVOICES_SELECTED_LIST.findIndex(x => x.ID === iList[0].ID);
                    $scope.XERO_INVOICES_SELECTED_LIST.splice(indexofinv, 1)
                }
                count++;
            }
        }
        if (count > 0) {
            $scope.InvoiceSearch.IS_ALL_SELECTED = false;
        }
    };

    $scope.GET_PYMNT_SUPPLIER = function () {
        var PaymentModelObj = new Object();
        PaymentModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PaymentModelObj.BRANCH_LOGIN_ID = parseInt($cookies.get("BRANCH_ID"));
        PaymentModelObj.PAGE_NO = 0;
        PaymentModelObj.PAGE_SIZE = 0;
        PaymentModelObj.SUPPLIER_NAME = null;
        PaymentModelObj.FLAG = 1;
        PrcCommMethods.PAYMENT_API(PaymentModelObj, 'GET_PYMNT_SUPPLIER').then(function (data) {
            if (data.data != undefined && data.data.Table.length > 0) {
                $scope.SUPPLIER_LIST = data.data.Table;
                $('#AddCustomScroll_REQ').find('.dropdown-menu').addClass('custom-scrollbar');
                $('#AddCustomScroll_SHD').find('.dropdown-menu').addClass('custom-scrollbar');
                $('#AddCustomScroll_SUP').find('.dropdown-menu').addClass('custom-scrollbar');
                $scope.generate();
            } else {
                $scope.SUPPLIER_LIST = [];
            }
        })
    }
    $scope.GET_PYMNT_APPROVERS = function () {
        var ModelObj = new Object();
        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        ModelObj.BRANCH_LOGIN_ID = $scope.InvoiceSearch.BRANCH_LOGIN_ID;
        PrcCommMethods.PAYMENT_API(ModelObj, 'GET_PYMNT_APPROVERS').then(function (data) {
            if (data.data != undefined && data.data.Table.length > 0) {
                $scope.PYMNT_APPROVERS_LIST = data.data.Table;
            } else {
                $scope.PYMNT_APPROVERS_LIST = [];
            }
        })
    };
    $scope.GET_PYMNT_SUPPLIER();

    $scope.BRANCH_CHANGE = function () {
        $scope.XERO_INVOICES_SELECTED_LIST = [];
        $scope.XERO_SCHEDULE_PAYMENTS_SELECTED_LIST = [];
    }
    $scope.INS_PYMNT_PAYMENT_SCHEDULES = function () {
        $scope.ERROR_LINE_INVOICE = [];
        angular.forEach($scope.XERO_SCHEDULE_PAYMENTS_SELECTED_LIST, function (ValInv) {
            if (ValInv.IS_PAY_OVER) {
                $scope.ERROR_LINE_INVOICE.push(ValInv);
            }
        });
        $scope.SchInvoiceForm.submitted = true;
        if ($scope.SchInvoiceForm.$valid && $scope.ERROR_LINE_INVOICE.length == 0) {
            var ModelObj = new Object();
            ModelObj.PAYMENT_DATE = $scope.InvoiceSearch.PAYMENT_DATE;
            ModelObj.TOTAL_INVOICES = $scope.InvoiceSearch.TOTAL_INVOICES;
            ModelObj.SUPPLIERS_COUNT = $scope.InvoiceSearch.SUPPLIERS_COUNT;
            ModelObj.TOTAL_AMOUNT = parseFloat($scope.InvoiceSearch.TOTAL_AMOUNT).toFixed($scope.$parent.TO_NUMBER_DECIMAL_FIVE);
            ModelObj.PAYMENT_AMOUNT = parseFloat($scope.InvoiceSearch.PAYMENT_AMOUNT).toFixed($scope.$parent.TO_NUMBER_DECIMAL_FIVE);
            ModelObj.COMMENT = $scope.InvoiceSearch.COMMENT;
            ModelObj.SCHEDULE_NAME = $scope.InvoiceSearch.SCHEDULE_NAME;
            ModelObj.BRANCH_LOGIN_ID = $scope.InvoiceSearch.BRANCH_LOGIN_ID;
            ModelObj.USER_ID = parseInt($cookies.get("USERID"));
            ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            ModelObj.PYMNT_PYMNT_SCHDL_LNS_TYPE = []
            ModelObj.PYMNT_APPROVERS_TYPE = [];
            angular.forEach($scope.XERO_SCHEDULE_PAYMENTS_SELECTED_LIST, function (ValInv) {
                var ReadOnlyInv = new Object();
                ReadOnlyInv.INVOICE_ID = ValInv.ID;
                ReadOnlyInv.PAYMENT_AMOUNT = parseFloat(ValInv.PAYMENT_AMOUNT).toFixed($scope.$parent.TO_NUMBER_DECIMAL_FIVE);
                ReadOnlyInv.SUPPLIER_ID = ValInv.SUPPLIER_ID;
                ReadOnlyInv.TOTAL_AMOUNT = parseFloat(ValInv.AMOUNTDUE).toFixed($scope.$parent.TO_NUMBER_DECIMAL_FIVE);
                ModelObj.PYMNT_PYMNT_SCHDL_LNS_TYPE.push(ReadOnlyInv);
            });
            var apprrovalerror = 0;
            angular.forEach($scope.APPROVER_LIST, function (valApp) {
                valApp.apprrovalerror = 0;
                var ReadOnlyApprover = new Object();
                var Applist = $scope.PYMNT_APPROVERS_LIST.filter(function (x) { return x.NAME == valApp.APPROVER_NAME })
                if (Applist.length > 0) {
                    ReadOnlyApprover.APPROVER_ID = Applist[0].USER_ID;
                }
                else {
                    valApp.APPRROVAL_ERROR = 1;
                    apprrovalerror++;
                }
                ReadOnlyApprover.APP_SORT_SEQUENCE = valApp.APP_SORT_SEQUENCE;
                ModelObj.PYMNT_APPROVERS_TYPE.push(ReadOnlyApprover);
            });
            if (apprrovalerror == 0) {
                PrcCommMethods.PAYMENT_API(ModelObj, 'INS_PYMNT_PAYMENT_SCHEDULES').then(function (data) {
                    if (data.data != undefined && data.data == 0) {
                        $scope.$parent.ShowAlert('Error', $scope.$parent.SOMETHINGWENTWRONG, 5000);
                    }
                    if (data.data != undefined && data.data == 1) {
                        $scope.$parent.ShowAlert('Success', 'Your submission has been save.', 5000);
                        $scope.SCHEDULE_CLICK_CANCEL();
                        $scope.XERO_INVOICES__AGING_LIST = []
                        $scope.XERO_SCHEDULE_PAYMENTS_SELECTED_LIST = [];
                        $scope.GET_XERO_INVOICES(1, 2, false, 2);
                        $scope.GET_XERO_INVOICES(1, $scope.SORT_COLUMN_NO, $scope.SORT_ORDER_NO_ASCDESC, 1);
                        if ($scope.SHEDULE_CLICK == 3) {
                        }
                        if ($scope.SHEDULE_CLICK == 1) {
                        }
                        $scope.TAB_FLAG = $scope.SHEDULE_CLICK;


                    }
                });
            }
            else {
                $scope.$parent.ShowAlert('Error', "Invalid Approver", 5000);
            }
        }
    }

    $scope.APPROVER_LIST = [];
    $scope.ADD_APPROVER_FY = function (AL) {
        $scope.APPROVER_LIST.push(angular.copy($scope.BLANK_APPROVER_LIST));
    }
    $scope.ADD_APPROVER_FY();

    $scope.DELETE_INVOICE = function (IN_LIST, index, FLAG, HEADER) {
        if (confirm('Are you sure you want to remove the Invoice from the selected list?')) {
            if ($scope.XERO_INVOICES_SELECTED_LIST.length == 0) {
                $scope.InvoiceSearch.IS_ALL_SELECTED = false;
                $scope.XERO_INVOICES_LIST.filter(function (x) { x.IS_SELECTED = false; });
                $scope.SCHEDULE_CLICK = true;
                $scope.SUPPLIER_VIEW_LIST = [];
            } else {
                $scope.XERO_INVOICES_LIST.filter(function (x) { if (IN_LIST.ID == x.ID) { x.IS_SELECTED = false } });
            };
            if (FLAG == 2) {
                var indexFind = $scope.XERO_INVOICES_SELECTED_LIST.findIndex(x => x.ID === IN_LIST.ID);
                $scope.XERO_INVOICES_SELECTED_LIST.splice(indexFind, 1);
            }
            else {
                $scope.XERO_INVOICES_SELECTED_LIST.splice(index, 1);
            }
        }
    }
    $scope.REMOVE_APPROVER_FY = function (AL, index) {
        if (confirm('Are you sure you want to remove the approver?')) {
            $scope.APPROVER_LIST.splice(index, 1);
        }
    }
    $scope.SUPPLIER_VIEW_FY = function (HEADER) {
        if ($scope.SUPPLIER_VIEW_LIST.length > 0) {
            angular.forEach($scope.SUPPLIER_VIEW_LIST, function (ValApp) {
                if (HEADER != undefined && HEADER.ID == ValApp.ID) {
                    ValApp.HIDESHOW = true;
                }
                ValApp.INV_LIST = $scope.XERO_SCHEDULE_PAYMENTS_SELECTED_LIST.filter(function (x) { return ValApp.SUPPLIER_ID == x.SUPPLIER_ID });
                angular.forEach(ValApp.INV_LIST, function (INV_LINE) {
                    if (ValApp.SELECTED_INV_COUNT == undefined) {
                        ValApp.SELECTED_INV_COUNT = 0;
                    }
                    if (ValApp.SELECTED_DUE_AMOUNT == undefined) {
                        ValApp.SELECTED_DUE_AMOUNT = 0;
                    }
                    if (ValApp.SELECTED_TOTAL_AMOUNT == undefined) {
                        ValApp.SELECTED_TOTAL_AMOUNT = 0;
                    }
                    if (ValApp.TOTAL_TOTAL_AMOUNT == undefined) {
                        ValApp.TOTAL_TOTAL_AMOUNT = 0;
                    }
                    ValApp.SELECTED_DUE_AMOUNT = angular.copy(ValApp.SELECTED_DUE_AMOUNT + INV_LINE.AMOUNTDUE);
                    ValApp.SELECTED_TOTAL_AMOUNT = angular.copy(ValApp.SELECTED_TOTAL_AMOUNT + INV_LINE.AMOUNT);
                    ValApp.TOTAL_TOTAL_AMOUNT = angular.copy(ValApp.SELECTED_TOTAL_AMOUNT);
                    ValApp.SELECTED_INV_COUNT = ValApp.SELECTED_INV_COUNT + 1;
                });
            });
        }
    }
    $scope.TAB_CLICK_SHDL_FY = function (FLAG) {
        $scope.TAB_FLAG = FLAG;
        if (FLAG == 1) {
            $scope.GET_XERO_INVOICES(1, 4, false, 1);
        }
        if (FLAG == 2) {
            $scope.GET_SHDL_XERO_INVOICES(1, 4, false);
        }
        if (FLAG == 3) {
            $scope.GET_XERO_INVOICES(1, 2, false, 2);
        }
    }

    $scope.XERO_SCHEDULE_PAYMENTS_SELECTED_LIST = [];

    $scope.SCHEDULE_CLICK_FY = function () {
        $scope.XERO_SCHEDULE_PAYMENTS_SELECTED_LIST = [];
        $scope.XERO_SCHEDULE_PAYMENTS_SELECTED_LIST = $scope.XERO_INVOICES_SELECTED_LIST;
        if ($scope.XERO_SCHEDULE_PAYMENTS_SELECTED_LIST.length > 0) {
            $scope.TAB_FLAG = -1;
            $scope.SHEDULE_CLICK = 1;
            $scope.SCHEDULE_CLICK = false;
            $scope.GET_PYMNT_APPROVERS();
            $scope.SUPPLIER_VIEW_LIST = [];
            $scope.SUP_LIST = $filter('unique')($scope.XERO_SCHEDULE_PAYMENTS_SELECTED_LIST, 'SUPPLIER_ID');
            $scope.SUPPLIER_VIEW_LIST = $scope.SUP_LIST;
            $scope.SUPPLIER_VIEW_FY();
        }
        else {
            $scope.$parent.ShowAlert("Error", "Please select at least one invoice to schedule", 3000);
        }
    }

    $scope.SCHEDULE_SUPPLIER_WISE_CLICK_FY = function () {
        $scope.XERO_SCHEDULE_PAYMENTS_SELECTED_LIST = [];
        angular.forEach($scope.XERO_INVOICES__AGING_SELECTED_LIST, function (x) {
            if (x.TYPE == 2 && x.INVOICE_CHECK == true) {
                $scope.XERO_SCHEDULE_PAYMENTS_SELECTED_LIST.push(x.ROW);
            };
        });
        if ($scope.XERO_INVOICES__AGING_SELECTED_LIST.length > 0) {
            $scope.TAB_FLAG = -1;
            $scope.SHEDULE_CLICK = 3;
            $scope.SCHEDULE_CLICK = false;
            $scope.GET_PYMNT_APPROVERS();
            $scope.SUPPLIER_VIEW_LIST = [];
            $scope.SUP_LIST = $filter('unique')($scope.XERO_INVOICES__AGING_SELECTED_LIST, 'SUPPLIER_ID');
            $scope.SUPPLIER_VIEW_LIST = $scope.SUP_LIST;
            $scope.SUPPLIER_VIEW_FY();
        }
        else {
            $scope.$parent.ShowAlert("Error", "Please select at least one invoice to schedule", 3000);
        }
    }

    $scope.SCHEDULE_CLICK_CANCEL = function () {
        $scope.SCHEDULE_CLICK = true;
        $scope.XERO_INVOICES_SELECTED_LIST = [];
        $scope.XERO_INVOICES_LIST.filter(function (x) { x.IS_SELECTED = false; });
        $scope.InvoiceSearch.IS_ALL_SELECTED = false;
        $scope.InvoiceSearch.SCHEDULE_NAME = '';
        $scope.InvoiceSearch.COMMENT = '';
        $scope.InvoiceSearch.PAYMENT_DATE = '';
        $scope.InvoiceSearch.TOTAL_INVOICES = 0;
        $scope.InvoiceSearch.SUPPLIERS_COUNT = 0;
        $scope.InvoiceSearch.TOTAL_AMOUNT = 0;
        $scope.InvoiceSearch.PAYMENT_AMOUNT = 0;
        $scope.APPROVER_LIST = [];
        $scope.ADD_APPROVER_FY();
        $scope.SchInvoiceForm.submitted = false;
        $scope.TAB_FLAG = $scope.SHEDULE_CLICK;
        $scope.TAB_CLICK_SHDL_FY($scope.TAB_FLAG);

    }
    $scope.SCHEDULE_CLICK_ADD_MORE = function () {
        $scope.SCHEDULE_CLICK = true;
        $scope.TAB_FLAG = $scope.SHEDULE_CLICK;
    }

    $scope.RESET_SCHEDULE_CLICK = function () {
        $scope.InvoiceSearch.IS_ALL_SELECTED = false;
        $scope.XERO_INVOICES_LIST.filter(function (x) { x.IS_SELECTED = false; });
        $scope.XERO_INVOICES_SELECTED_LIST = [];
    }

    $scope.RESET_SCHEDULE_SUPPLIER_WISE_CLICK_FY = function () {
        $scope.XERO_INVOICES_AGING_SELECTED_LIST = [];
        $scope.XERO_INVOICES__AGING_LIST.filter(function (x) {
            if (x.TYPE == 1) {
                x.SUPPLIER_CHECK = false;
            }
            if (x.TYPE == 2) {
                x.INVOICE_CHECK = false;
            }
        });
        $scope.XERO_INVOICES__AGING_SELECTED_LIST = [];
    }

    $scope.GET_UTC_TIME = function () {
        var ModelObj = new Object();
        ModelObj.TIMEZONE_OFFSET = "00:00";
        PrcCommMethods.HR_API(ModelObj, 'GET_UTC_TIME').then(function (data) {
            $scope.TODAY_DATE = new Date(data.data).toISOString();
            var Arr = { TODAY_DATE: $scope.TODAY_DATE }
            $scope.$parent.DateInputLoadStartForm(Arr);
        });
    };
    $scope.GET_UTC_TIME();
    $scope.HIDE_SHOW_FY = function (SUP_LINE, FLAG) {
        SUP_LINE.HIDESHOW = SUP_LINE.HIDESHOW ? false : true;
    }

    $scope.AllShowHideInvoices = function (Line) {
        Array.prototype.map.call($scope.XERO_INVOICES__AGING_LIST, function (item) {
            item.SHOW_INVOICE = !Line.SHOW_INVOICE;
        });
    }
    $scope.ShowHideInvoices = function (Line) {
        Line.SHOW_INVOICE = !Line.SHOW_INVOICE;
        Array.prototype.map.call(($filter('filter')($scope.XERO_INVOICES__AGING_LIST, { SUPPLIER_ID: Line.SUPPLIER_ID, TYPE: 2 }, true)), function (item) {
            item.SHOW_INVOICE = !item.SHOW_INVOICE;
        });
    }

    $scope.SupplierLineCheck = function () {
        // $scope.XERO_INVOICES__AGING_SELECTED_LIST = [];
        Array.prototype.map.call(($filter('filter')($scope.XERO_INVOICES__AGING_LIST, { INVOICE_CHECK: true, TYPE: 2 }, true)), function (item) {
            var xlenth = $scope.XERO_INVOICES__AGING_SELECTED_LIST.filter(function (x) { return x.INVOICE_ID == item.INVOICE_ID });
            if (xlenth.length == 0) {
                $scope.XERO_INVOICES__AGING_SELECTED_LIST.push(item);
            }
        });
        Array.prototype.map.call(($filter('filter')($scope.XERO_INVOICES__AGING_LIST, { INVOICE_CHECK: false, TYPE: 2 }, true)), function (item) {
            var xlenth = $scope.XERO_INVOICES__AGING_SELECTED_LIST.filter(function (x) { return x.INVOICE_ID == item.INVOICE_ID });
            if (xlenth.length > 0) {
                var indexofinv = $scope.XERO_INVOICES__AGING_SELECTED_LIST.findIndex(x => x.INVOICE_ID === item.INVOICE_ID);
                $scope.XERO_INVOICES__AGING_SELECTED_LIST.splice(indexofinv, 1);
            }
        });
    }
    $scope.SupplierCheck = function (Line, Is_MonthCheck, MONTHNO) {
        if (Is_MonthCheck == 0) {
            Is_MonthCheck != 1 ? Line.MONTH1_CHECK = !Line.MONTH1_CHECK : '';
            Is_MonthCheck != 2 ? Line.MONTH2_CHECK = !Line.MONTH2_CHECK : '';
            Is_MonthCheck != 3 ? Line.MONTH3_CHECK = !Line.MONTH3_CHECK : '';
            Is_MonthCheck != -1 ? Line.OLDER_CHECK = !Line.OLDER_CHECK : '';
            Array.prototype.map.call(($filter('filter')($scope.XERO_INVOICES__AGING_LIST, { SUPPLIER_ID: Line.SUPPLIER_ID, TYPE: 2 }, true)), function (item) {
                item.INVOICE_CHECK = Line.SUPPLIER_CHECK;
            });
        }
        if (Is_MonthCheck != 0) {
            Line.SUPPLIER_CHECK = !((Line.MONTH1_AMT > 0 && !Line.MONTH1_CHECK) || (Line.MONTH2_AMT > 0 && !Line.MONTH2_CHECK) || (Line.MONTH3_AMT > 0 && !Line.MONTH3_CHECK) || (Line.OLDER_AMT > 0 && !Line.OLDER_CHECK));
            Array.prototype.map.call(($filter('filter')($scope.XERO_INVOICES__AGING_LIST, { SUPPLIER_ID: Line.SUPPLIER_ID, TYPE: 2, INVOICE_MONTH_NO: MONTHNO }, true)), function (item) {
                item.INVOICE_CHECK = ((Is_MonthCheck == 1 && Line.MONTH1_CHECK) || (Is_MonthCheck == 2 && Line.MONTH2_CHECK) || (Is_MonthCheck == 3 && Line.MONTH3_CHECK) || (Is_MonthCheck == -1 && Line.OLDER_CHECK));
            });
        }

        $scope.SupplierLineCheck();
    }
    $scope.InvoiceCheck = function (Line) {
        var AllInvoiceCheck = true;
        Array.prototype.map.call(($filter('filter')($scope.XERO_INVOICES__AGING_LIST, { SUPPLIER_ID: Line.SUPPLIER_ID, TYPE: 2 }, true)), function (item) {
            item.INVOICE_CHECK == false ? AllInvoiceCheck = false : '';

        });
        var SupplierRecord = ($filter('filter')($scope.XERO_INVOICES__AGING_LIST, { SUPPLIER_ID: Line.SUPPLIER_ID, TYPE: 1 }, true))[0];
        if (!AllInvoiceCheck) {
            var AllInvoiceMonthCheck = true;
            Array.prototype.map.call(($filter('filter')($scope.XERO_INVOICES__AGING_LIST, { SUPPLIER_ID: Line.SUPPLIER_ID, TYPE: 2, INVOICE_MONTH_NO: Line.INVOICE_MONTH_NO }, true)), function (item) {
                item.INVOICE_CHECK == false ? AllInvoiceMonthCheck = false : '';

            });
            SupplierRecord.SUPPLIER_CHECK = AllInvoiceCheck;
            SupplierRecord.MONTH1_NO == Line.INVOICE_MONTH_NO ? SupplierRecord.MONTH1_CHECK = AllInvoiceMonthCheck : '';
            SupplierRecord.MONTH2_NO == Line.INVOICE_MONTH_NO ? SupplierRecord.MONTH2_CHECK = AllInvoiceMonthCheck : '';
            SupplierRecord.MONTH3_NO == Line.INVOICE_MONTH_NO ? SupplierRecord.MONTH3_CHECK = AllInvoiceMonthCheck : '';
            Line.INVOICE_MONTH_NO == -1 ? SupplierRecord.OLDER_CHECK = AllInvoiceMonthCheck : '';
        }
        else {
            SupplierRecord.SUPPLIER_CHECK = AllInvoiceCheck;
            SupplierRecord.MONTH1_CHECK = AllInvoiceCheck;
            SupplierRecord.MONTH2_CHECK = AllInvoiceCheck;
            SupplierRecord.MONTH3_CHECK = AllInvoiceCheck;
            SupplierRecord.OLDER_CHECK = AllInvoiceCheck;
        }
        $scope.SupplierLineCheck();
    }

    $scope.HEADER_SELECTED = function (Line, Is_MonthCheck, MONTHNO) {
        if (Is_MonthCheck == 0) {
            Array.prototype.map.call(($filter('filter')($scope.XERO_INVOICES__AGING_LIST)), function (item) {
                item.INVOICE_CHECK = Line.ALL_SUPPLIER_CHECK;
                item.SUPPLIER_CHECK = Line.ALL_SUPPLIER_CHECK;
                item.MONTH1_CHECK = Line.ALL_SUPPLIER_CHECK;
                item.MONTH2_CHECK = Line.ALL_SUPPLIER_CHECK;
                item.MONTH3_CHECK = Line.ALL_SUPPLIER_CHECK;
                item.OLDER_CHECK = Line.ALL_SUPPLIER_CHECK;

            });
        }
        if (Is_MonthCheck != 0) {
            Array.prototype.map.call(($filter('filter')($scope.XERO_INVOICES__AGING_LIST, { MONTHNO: Line.MONTHNO }, true)), function (item) {
                item.INVOICE_CHECK = Line.ALL_SUPPLIER_CHECK;
                item.SUPPLIER_CHECK = Line.ALL_SUPPLIER_CHECK;
                Is_MonthCheck == 1 ? item.MONTH1_CHECK = Line.MONTH1_CHECK : '';
                Is_MonthCheck == 2 ? item.MONTH2_CHECK = Line.MONTH2_CHECK : '';
                Is_MonthCheck == 3 ? item.MONTH3_CHECK = Line.MONTH3_CHECK : '';
                Is_MonthCheck == -1 ? item.OLDER_CHECK = Line.OLDER_CHECK : '';

            });
        }
        $scope.SupplierLineCheck();
    }
    $scope.AFTER_SELECTION = function (FLAG) {
        if (FLAG == 1) {

        }
    }

    $scope.SWITCH_INVOICE_DUE_DATE = function () {
        $scope.GET_XERO_INVOICES(1, 2, false, 2);
    }
    $scope.comboBoxesCount = 1;
    $scope.options = [];
    $scope.comboBoxes = [];
    $scope.generate = function () {
        var tmpOptions = [];
        for (var i = 1; i <= $scope.SUPPLIER_LIST.length - 1; i++) {
            tmpOptions.push({
                text: $scope.SUPPLIER_LIST[i].SUPPLIER_NAME,
                id: i
            });
        }

        $scope.select2options();
        var tmpComboBoxes = [];
        for (var j = 1; j <= $scope.comboBoxesCount; j++) {
            tmpComboBoxes.push({
                selection: null
            });
        }
        $scope.options = tmpOptions;
        $scope.comboBoxes = tmpComboBoxes;
    };
    var getData = function (optionsOrig, query, pageSize) {
        console.log(query);
        var results = [];
        var options = [];
        if (query.term) {
            var search = query.term.toLowerCase();
            options = optionsOrig.filter(function (elem) {
                return elem.text.toLowerCase().indexOf(search) != -1;
            });
        } else {
            options = optionsOrig;
        }
        var startPos = (query.page - 1) * pageSize;
        if (startPos > options.length) {
            startPos = options.length;
        }
        var endPos = startPos + pageSize;
        if (endPos > options.length) {
            endPos = options.length;
        }
        for (var i = startPos; i < endPos; i++) {
            results.push(options[i]);
        }
        var data = {
            more: endPos < options.length,
            results: results
        };
        return data;
    };
    $scope.select2options = function (options) {
        var s2options = {
            minimumResultsForSearch: 1, // no search box
            multiple: false,
            formatNoMatches: function (term) {
                return "";
            },
            query: function (query) {
                var data = getData(options, query, 10);
                query.callback(data);
            }
        };
        return s2options;
    };
    $scope.IS_PAGE_LOAD = 1;

    $scope.GetIntegrationDetails();
    $scope.TAB_CLICK_SHDL_FY(3);
    //$scope.$parent.dateinputdateofbirth()
});
