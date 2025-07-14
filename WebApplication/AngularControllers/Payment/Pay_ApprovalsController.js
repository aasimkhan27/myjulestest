app.controller('Pay_ApprovalsController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    //====================== HEADERS_FOR_APPROVER_LIST List =====================================
    $scope.SCHEDULE_CLICK = true;
    $scope.COMMON_CODE_CHANGE();
    $scope.HEADERS_FOR_APPROVER_LIST = [];
    $scope.InvoiceApprovalSearch = {
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        ACTIVE: 1,
        COMMENT: '',
        PAYMENT_DATE: '',
        TOTAL_INVOICES: 0,
        SUPPLIERS_COUNT: 0,
        TOTAL_AMOUNT: 0,
        PAYMENT_AMOUNT: 0,
        STATUS_IDS: null,
        SCHEDULE_DATE_TEXT: 'Schedule Date',
        BRANCH_IDS: parseInt($cookies.get("BRANCH_ID")),
    };

    $scope.HEADER_LIST = [{ NAME: "Ref No.", ID: 1 },
    { NAME: "Schedule Name", ID: 3, CLASS_NAME: '' },
    { NAME: "Schedule Date", ID: 4, CLASS_NAME: '' },
    { NAME: "Approval Status ", ID: 10, CLASS_NAME: '' },
    { NAME: "Overall Status", ID: 5, CLASS_NAME: '' },
    { NAME: "Supplier Count", ID: 2, CLASS_NAME: '' },
    { NAME: "Invoices Count", ID: 6, CLASS_NAME: '' },
    { NAME: "Currency", ID: 6, CLASS_NAME: '' },
    //{ NAME: "Total Amount", ID: 7, CLASS_NAME: 'text-right' },
    { NAME: "Amount to Pay", ID: 8, CLASS_NAME: 'text-right' },]

    $scope.APPROVALS_STATUS = [{ NAME: "APPROVED", ID: 37 }, { NAME: "REJECTED", ID: 38 }, { NAME: "PENDING", ID: 39 }];
    function reportSdhlDaterange(startDate, endDate) {
        $scope.InvoiceApprovalSearch.PYMNT_START_DATE = startDate.format($scope.$parent.Datelocaleformat.format);
        $scope.InvoiceApprovalSearch.PYMNT_END_DATE = endDate.format($scope.$parent.Datelocaleformat.format);
        $('#reportSdhlDaterange span').html(startDate.format($scope.$parent.Datelocaleformat.format) + ' - ' + endDate.format($scope.$parent.Datelocaleformat.format));
    };
    $(function () {
        startDate = moment().startOf('month');//moment().startOf('isoWeek');//moment().subtract(6, 'days');
        endDate = moment().endOf('month'); //moment().subtract(0, 'days');
        $scope.$parent.SetUpDateRangeMultiDatePicker('reportSdhlDaterange', startDate, endDate, reportSdhlDaterange, 1);

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
    $scope.GET_APPROVAL_HEADERS_FOR_APPROVER_LAZY_LOAD = function () {
        $scope.GET_APPROVAL_HEADERS_FOR_APPROVER(2, $scope.SORT_COLUMN_NO, $scope.SORT_ORDER_NO_ASCDESC);
    };
    $scope.RESET_XERO_INVOICES_FILTER = function () {
        $scope.InvoiceApprovalSearch = {
            PAGE_NO: 1,
            PAGE_SIZE: 10,
            ACTIVE: 1
        };
    }

    $scope.GET_APPROVAL_HEADERS_FOR_APPROVER = function (FLAG, SORT_COLUMN_NO, SORT_ORDER_NO_ASCDESC) {
        $scope.SORT_COLUMN_NO = SORT_COLUMN_NO;
        $scope.SORT_ORDER_NO_ASCDESC = SORT_ORDER_NO_ASCDESC;
        $scope.$parent.overlay_loadingNew = 'block';
        var PaymentModelObj = new Object();
        if (FLAG == 1) {
            $scope.HEADERS_FOR_APPROVER_LIST = [];
            $scope.InvoiceApprovalSearch.PAGE_NO = 1;
        }
        PaymentModelObj.APPROVAL_TYPE_ID = 1//$scope.InvoiceApprovalSearch.APPROVAL_TYPE_ID;
        PaymentModelObj.PYMNT_START_DATE = $scope.InvoiceApprovalSearch.PYMNT_START_DATE;
        PaymentModelObj.PYMNT_END_DATE = $scope.InvoiceApprovalSearch.PYMNT_END_DATE;
        PaymentModelObj.ACTION_REQUIRED = $scope.InvoiceApprovalSearch.ACTION_REQUIRED
        PaymentModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PaymentModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PaymentModelObj.LOCATION_IDS = $scope.InvoiceApprovalSearch.LOCATION_IDS
        PaymentModelObj.BRANCH_IDS = $scope.InvoiceApprovalSearch.BRANCH_IDS
        PaymentModelObj.STATUS_IDS = $scope.InvoiceApprovalSearch.STATUS_IDS == null ? '37, 38, 39' : $scope.InvoiceApprovalSearch.STATUS_IDS;
        PaymentModelObj.PAGE_NO = $scope.InvoiceApprovalSearch.PAGE_NO;
        PaymentModelObj.PAGE_SIZE = $scope.InvoiceApprovalSearch.PAGE_SIZE;

        PaymentModelObj.SORT_ORDER_NO = SORT_ORDER_NO_ASCDESC ? 1 : -1;//1 FOR ASC -1 FOR DESC
        PaymentModelObj.SORT_COLUMN_NO = SORT_COLUMN_NO;
        PaymentModelObj.APPROVAL_HEADER_ID = $scope.InvoiceApprovalSearch.APPROVAL_HEADER_ID;
        PaymentModelObj.SCHEDULE_NAME = $scope.InvoiceApprovalSearch.SCHEDULE_NAME;
        PrcCommMethods.PAYMENT_API(PaymentModelObj, 'GET_APPROVAL_HEADERS_FOR_APPROVER').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.$parent.overlay_loadingNew = 'none';
                $scope.HEADERS_FOR_APPROVER_LIST = $scope.HEADERS_FOR_APPROVER_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.InvoiceApprovalSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.InvoiceApprovalSearch.PAGE_NO = parseInt($scope.InvoiceApprovalSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            } else {
                if ($scope.HEADERS_FOR_APPROVER_LIST.length == 0) { }
                $scope.GetData = false;
                $scope.$parent.overlay_loadingNew = 'none';
            }
        })
    }
    $scope.GET_APPROVAL_HEADERS_FOR_APPROVER(1, 4, false);


    $scope.GO_TO_APPROVAL = function (LIST) {
        var URLPRAM = { HEADER_ID: LIST.APPROVAL_HEADER_ID, TYPE_ID: LIST.APPROVAL_TYPE_ID, FLAG: 1 }
        $location.path('Approvals_View').search(URLPRAM);
    }

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
            } else {
                $scope.SUPPLIER_LIST = [];
            }
        })
    }
    $scope.GET_PYMNT_SUPPLIER();

    $scope.RESET_APPROVER_FILTER = function () {
        $scope.InvoiceApprovalSearch.PYMNT_START_DATE = "";
        $scope.InvoiceApprovalSearch.PYMNT_END_DATE = "";
        $scope.InvoiceApprovalSearch.APPROVAL_HEADER_ID = null;
        $scope.InvoiceApprovalSearch.SCHEDULE_NAME = "";
        $scope.InvoiceApprovalSearch.BRANCH_IDS = parseInt($cookies.get("BRANCH_ID")),
            $('#reportSdhlDaterange span').html($scope.InvoiceApprovalSearch.SCHEDULE_DATE_TEXT);

        $scope.GET_APPROVAL_HEADERS_FOR_APPROVER(1, $scope.SORT_COLUMN_NO, $scope.SORT_ORDER_NO_ASCDESC);
    }
});
app.controller('Pay_ApprovalsViewController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $localStorage) {
    //====================== XERO_INVOICES_LIST List =====================================
    $scope.COMMON_CODE_CHANGE();
    $scope.ApprovalViewSearch = {
        USER_ID: parseInt($cookies.get("USERID")),
        APPROVAL_HEADER_ID: getUrlParameter('HEADER_ID', $location.absUrl()),
        APPROVAL_TYPE_ID: getUrlParameter('TYPE_ID', $location.absUrl()),
        WHO_LOADED: getUrlParameter('FLAG', $location.absUrl()),
        DISPLAY_AMOUNT_GRID: 0,
        REF_NO: '',
        SELECTED_INV_COUNT_GRID: 0,
        BRANCH_LOGIN_ID: parseInt($cookies.get("BRANCH_ID")),
        APPROVAL_HEADERS_LIST: {},
    };
    $scope.ACTION_REQUIRED = 0;
    $scope.TAB_FLAG = 1;
    $scope.IS_PARTIAL_PAYMENT_ALLOW = false;
    $scope.CUR_APPROVAL_HEADER_STATUS_ID = 0;
    $scope.AUTO_APPROVAL_HEADER_STATUS_ID = "";
    $scope.NXT_APPROVAL_HEADER_STATUS_ID = "";
    $scope.CUR_APP_SORT_ORDER = 0;
    $scope.NXT_APP_SORT_ORDER = 0;
    $scope.IS_ONE_SIXTY = $scope.$parent.CheckSubModuleAccess(160);
    $scope.GET_APPROVAL_HEADERS_CHAIN = function (FLAG) {
        $scope.$parent.overlay_loadingNew = 'block';
        var PaymentModelObj = new Object();
        PaymentModelObj.APPROVAL_HEADER_ID = $scope.ApprovalViewSearch.APPROVAL_HEADER_ID;
        PaymentModelObj.APPROVAL_TYPE_ID = $scope.ApprovalViewSearch.APPROVAL_TYPE_ID;
        PrcCommMethods.PAYMENT_API(PaymentModelObj, 'GET_APPROVAL_HEADERS_CHAIN').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.APPROVAL_HEADERS_CHAIN_LIST = data.data.Table;
                angular.forEach($scope.APPROVAL_HEADERS_CHAIN_LIST, function (approver) {
                    approver.IS_CURRENT_USER = false;
                    if (parseInt(approver.APPROVER_ID) == parseInt($cookies.get("USERID"))) {
                        approver.IS_CURRENT_USER = true;
                        $scope.ACTION_REQUIRED = approver.ACTION_REQUIRED;
                        if (approver.ACTION_REQUIRED == 1) {
                            $scope.CUR_APPROVAL_HEADER_STATUS_ID = approver.APPROVAL_HEADER_STATUS_ID;
                            $scope.CUR_APP_SORT_ORDER = approver.APP_SORT_SEQUENCE;
                        }
                    }
                    //if ($scope.CUR_APP_SORT_ORDER == approver.APP_SORT_SEQUENCE && approver.ACTION_REQUIRED == 1 && parseInt(approver.APPROVER_ID) != parseInt($cookies.get("USERID"))) {
                    //    $scope.AUTO_APPROVAL_HEADER_STATUS_ID = $scope.AUTO_APPROVAL_HEADER_STATUS_ID == "" ? approver.APPROVAL_HEADER_STATUS_ID : approver.APPROVAL_HEADER_STATUS_ID + ",";
                    //}
                    if ($scope.CUR_APP_SORT_ORDER != 0 && approver.APP_SORT_SEQUENCE > $scope.CUR_APP_SORT_ORDER && ($scope.NXT_APP_SORT_ORDER == 0 || $scope.NXT_APP_SORT_ORDER == approver.APP_SORT_SEQUENCE)) {
                        $scope.NXT_APP_SORT_ORDER = approver.APP_SORT_SEQUENCE;
                        if ($scope.NXT_APPROVAL_HEADER_STATUS_ID == "") {
                            $scope.NXT_APPROVAL_HEADER_STATUS_ID = approver.APPROVAL_HEADER_STATUS_ID;
                        }
                        else {
                            $scope.NXT_APPROVAL_HEADER_STATUS_ID = $scope.NXT_APPROVAL_HEADER_STATUS_ID + "," + approver.APPROVAL_HEADER_STATUS_ID;
                        }

                        //$scope.NXT_APPROVAL_HEADER_STATUS_ID = $scope.NXT_APPROVAL_HEADER_STATUS_ID == "" ? approver.APPROVAL_HEADER_STATUS_ID : approver.APPROVAL_HEADER_STATUS_ID + ",";
                    }


                });
                $scope.$parent.overlay_loadingNew = 'none';

            }
        })
    }
    $scope.GET_APPROVAL_HEADERS = function () {
        var PaymentModelObj = new Object();
        PaymentModelObj.APPROVAL_HEADER_ID = $scope.ApprovalViewSearch.APPROVAL_HEADER_ID;
        PaymentModelObj.APPROVAL_TYPE_ID = $scope.ApprovalViewSearch.APPROVAL_TYPE_ID;
        PaymentModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PaymentModelObj.APPROVER_FLAG = $scope.ApprovalViewSearch.WHO_LOADED == 1 ? 1 : 0;
        PrcCommMethods.PAYMENT_API(PaymentModelObj, 'GET_APPROVAL_HEADERS').then(function (data) {
            if (data.data != undefined && data.data.Table.length > 0) {
                $scope.ApprovalViewSearch.APPROVAL_HEADERS_LIST = data.data.Table[0];
            }
        })
    }

    $scope.PYMNT_BANK_LIST = [];
    $scope.GET_PYMNT_BANK_LIST = function () {
        var PaymentModelObj = new Object();
        PaymentModelObj.DEFAULT = 1;
        PrcCommMethods.PAYMENT_API(PaymentModelObj, 'GET_PYMNT_BANK_LIST').then(function (data) {
            if (data.data != undefined && data.data.Table.length > 0) {
                $scope.PYMNT_BANK_LIST = data.data.Table;
            };
        });
    }
    $scope.GET_PYMNT_ENTITY_BANK_MAPPING = function () {
        var PaymentModelObj = new Object();
        PaymentModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PaymentModelObj.BANK_ID = $scope.InvoiceApprovalSearch.BRANK_ID;
        PrcCommMethods.PAYMENT_API(PaymentModelObj, 'GET_PYMNT_ENTITY_BANK_MAPPING').then(function (data) {
            if (data.data != undefined && data.data.Table.length > 0) {
                $scope.PYMNT_ENTITY_BANK_MAPPING_LIST = data.data.Table;
            };
        });
    }
    $scope.GET_PYMNT_SCHDLS_BY_BANK = function () {
        var PaymentModelObj = new Object();
        PaymentModelObj.PYMNT_SCHDL_ID = $scope.ApprovalViewSearch.APPROVAL_HEADERS_LIST.PYMNT_PYMNT_SCHEDULE_ID;
        PaymentModelObj.BANK_ID = $scope.InvoiceApprovalSearch.BRANK_ID;
        PaymentModelObj.ENTITY_BANK_MAPPING_ID = $scope.InvoiceApprovalSearch.ENTITY_BANK_MAPPING_ID;
        PrcCommMethods.PAYMENT_API(PaymentModelObj, 'GET_PYMNT_SCHDLS_BY_BANK').then(function (data) {
            if (data.data != undefined && data.data.Table.length > 0) {
                if ($scope.InvoiceApprovalSearch.BRANK_ID == 1) {
                    $scope.PYMNT_SCHDLS_BY_BANK_ONE_LIST = data.data.Table;
                }
                if ($scope.InvoiceApprovalSearch.BRANK_ID == 2) {
                    $scope.PYMNT_SCHDLS_BY_BANK_TWO_LIST = data.data.Table;
                }
                //FLAG 0 success
                //FLAG 1 exception
            };
        });
    }
    $scope.GET_PYMNT_BY_PYMNT_SCHEDULE_ID = function () {
        var PaymentModelObj = new Object();
        PaymentModelObj.PYMNT_PYMNT_SCHEDULE_ID = $scope.ApprovalViewSearch.APPROVAL_HEADERS_LIST.PYMNT_PYMNT_SCHEDULE_ID;
        PaymentModelObj.APPROVAL_HEADER_ID = $scope.ApprovalViewSearch.APPROVAL_HEADERS_LIST.APPROVAL_HEADER_ID;
        PrcCommMethods.PAYMENT_API(PaymentModelObj, 'GET_PYMNT_BY_PYMNT_SCHEDULE_ID').then(function (data) {
            if (data.data != undefined) {
                window.open(data.data, '_blank');
            };
        });
    }

    $scope.GET_PYMNT_BANK_LIST();

    $scope.OTP_VALID_CHECK = JSON.parse($localStorage.ENTITY_SETTINGS).filter(x => x.SETTING_ID == 17)[0]["SETTING_VALUE"];
    $scope.PAYMENT_ARRPOVAL_REPORT_CHECK = JSON.parse($localStorage.ENTITY_SETTINGS).filter(x => x.SETTING_ID == 39)[0]["SETTING_VALUE"];
    $scope.GET_APPROVAL_HEADERS_CHAIN();
    $scope.GET_APPROVAL_HEADERS();

    $scope.ALLOW_SUBMIT = false;
    $scope.SET_CHECKBOX_ALL = function () {
        angular.forEach($scope.SUPPLIER_LIST, function (value) {
            value.IS_SELECTED = $scope.ApprovalViewSearch.IS_ALL_SELECTED;
            value.SELECTED_INV_COUNT = 0;
            value.SELECTED_TOTAL_AMOUNT = 0;
            angular.forEach(value.INV_LIST, function (INV_LINE) {
                if ($scope.ApprovalViewSearch.IS_ALL_SELECTED) {
                    value.SELECTED_INV_COUNT = value.SELECTED_INV_COUNT + 1;
                    value.SELECTED_TOTAL_AMOUNT = value.SELECTED_TOTAL_AMOUNT + INV_LINE.TOTAL_AMOUNT;
                }
                INV_LINE.IS_SELECTED_INV = $scope.ApprovalViewSearch.IS_ALL_SELECTED;
            });
        });
    };
    $scope.SET_CHECKBOX_LINE = function (SPL) {
        $scope.ApprovalViewSearch.IS_ALL_SELECTED = true;
        //$scope.HIDE_SHOW_FY(SPL, 1)
        for (var i = 0; i < $scope.SUPPLIER_LIST.length; i++) {
            if (!$scope.SUPPLIER_LIST[i].IS_SELECTED) {
                $scope.ApprovalViewSearch.IS_ALL_SELECTED = false;
                break;
            }
        }
        SPL.SELECTED_INV_COUNT = 0;
        SPL.SELECTED_TOTAL_AMOUNT = 0;
        angular.forEach(SPL.INV_LIST, function (INV_LINE) {
            INV_LINE.IS_SELECTED_INV = SPL.IS_SELECTED;
            if (SPL.IS_SELECTED_INV) {
                SPL.SELECTED_INV_COUNT = SPL.SELECTED_INV_COUNT + 1;
                SPL.SELECTED_TOTAL_AMOUNT = SPL.SELECTED_TOTAL_AMOUNT + INV_LINE.TOTAL_AMOUNT;
            }
        });

    };

    $scope.SET_INV_CHECKBOX_LINE = function (SPL, INL) {
        SPL.IS_SELECTED = true;
        SPL.SELECTED_INV_COUNT = 0;
        SPL.SELECTED_TOTAL_AMOUNT = 0;
        angular.forEach(SPL.INV_LIST, function (INV_LINE) {
            if (INV_LINE.IS_SELECTED_INV) {
                SPL.SELECTED_INV_COUNT = SPL.SELECTED_INV_COUNT + 1;
                SPL.SELECTED_TOTAL_AMOUNT = SPL.SELECTED_TOTAL_AMOUNT + INV_LINE.TOTAL_AMOUNT;
            }
            if (!INV_LINE.IS_SELECTED_INV) {
                SPL.IS_SELECTED = false;
            }
        });
    }

    $scope.ALL_CHECK_BOX_SENDTOXERO_Fn = function () {
        angular.forEach($scope.SUPPLIER_LIST, function (ValApp) {
            angular.forEach(ValApp.INV_LIST, function (INV_LINE) {
                if (INV_LINE.ACTION_REQUIRED != 1 && INV_LINE.INTEGRATION_STATUS == 3 && INV_LINE.OVERALL_STATUS_ID == 37) {
                    INV_LINE.IS_SELECTED_SEND_TO_XERO = $scope.IS_SELECTED_SEND_TO_XERO_ALL;
                }
            });
        });
    }
    $scope.UPD_XERO_APPROVED_INVOICE = function () {
        var PaymentModelObj = new Object();
        PaymentModelObj.TABLE_ID_LIST = [];
        angular.forEach($scope.SUPPLIER_LIST, function (ValApp) {
            angular.forEach(ValApp.INV_LIST, function (INV_LINE) {
                if (INV_LINE.IS_SELECTED_SEND_TO_XERO) {
                    var readonly = new Object();
                    readonly.TABLE_ID = INV_LINE.INVOICE_ID;
                    PaymentModelObj.TABLE_ID_LIST.push(readonly);
                }
            });
        });
        PaymentModelObj.INTEGRATION_STATUS = 0;
        PaymentModelObj.ERROR = null;
        if (PaymentModelObj.TABLE_ID_LIST.length > 0) {
            PrcCommMethods.PAYMENT_API(PaymentModelObj, 'UPD_XERO_APPROVED_INVOICE').then(function (data) {
                if (data.data == 0) {
                    $scope.$parent.ShowAlert('Error', $scope.$parent.SOMETHINGWENTWRONG, 5000);
                }
                if (data.data == 1) {
                    $scope.$parent.ShowAlert('Success', 'Send to Xero Successfully.', 5000);
                    $scope.GET_APPROVAL_HEADERS();
                    $scope.PAGE_LOAD();

                }
            });
        }
        else {
            $scope.$parent.ShowAlert('Error', "Please select at least one record.", 5000);
        }
    }
    $scope.DELETE_INVOICE = function (IN_LIST, index) {
        if (confirm('Are you sure you want to delete?')) {
            if ($scope.XERO_INVOICES_SELECTED_LIST.length == 0) {
                $scope.ApprovalViewSearch.IS_ALL_SELECTED = false;
                $scope.XERO_INVOICES_LIST.filter(function (x) { x.IS_SELECTED = false; });
                $scope.SCHEDULE_CLICK = true;
            } else {
                $scope.XERO_INVOICES_LIST.filter(function (x) { if (IN_LIST.ID == x.ID) { x.IS_SELECTED = false } });
            };

            $scope.XERO_INVOICES_SELECTED_LIST.splice(index, 1);

        }
    }

    $scope.CANCEL_APPROVALS = function (ASL, LINE) {
        if ($scope.ApprovalViewSearch.APPROVAL_HEADERS_LIST.EDIT_FLAG == 0 || $scope.ApprovalViewSearch.APPROVAL_HEADERS_LIST.EDIT_FLAG == false) {
            $scope.$parent.ShowAlert('Error', 'Invoice cancellation is not allowed, once approval process is started.', 5000);
        }
        else if ($scope.ApprovalViewSearch.APPROVAL_HEADERS_LIST.EDIT_FLAG == 1 || $scope.ApprovalViewSearch.APPROVAL_HEADERS_LIST.EDIT_FLAG == true) {
            //if flag is 0 then restricted and 1 for allow
            //if (LINE.COMMENTS != "" && LINE.COMMENTS != undefined && LINE.COMMENTS != null) {
            if (confirm("Are you sure you want to cancel this invoice?")) {
                var PaymentModelObj = new Object();
                PaymentModelObj.APPROVAL_HEADER_ID = SPL == undefined ? parseInt(LINE.APPROVAL_HEADER_ID) : parseInt(ASL.APPROVAL_HEADER_ID);
                PaymentModelObj.APPROVAL_LINE_IDS = parseInt(LINE.APPROVAL_LINE_ID);
                PaymentModelObj.USER_ID = parseInt($cookies.get("USERID"));
                PaymentModelObj.COMMENT = LINE.COMMENTS == "" || LINE.COMMENTS == undefined ? null : LINE.COMMENTS;
                PrcCommMethods.PAYMENT_API(PaymentModelObj, 'CANCEL_APPROVALS').then(function (data) {
                    if (data.data == 0) {
                        $scope.$parent.ShowAlert('Error', $scope.$parent.SOMETHINGWENTWRONG, 5000);
                    }
                    if (data.data == 1) {
                        $scope.$parent.ShowAlert('Success', 'Your submission has been save.', 5000);
                        $scope.PAGE_LOAD();
                    }
                });
            }
        }
        //else {
        //    $scope.$parent.ShowAlert('Error', "Please enter your valuable comments", 5000);
        //}
    }
    $scope.TAB_CLICK_SHDL_FY = function (FLAG) {
        $scope.TAB_FLAG = FLAG;
    }
    $scope.TAB_CLICK_SHDL_DOWNLOAD_FY = function (FLAG) {
        $scope.TAB_DOWNLOAD_FLAG = FLAG;
    }
    $scope.TAB_CLICK_SHDL_DOWNLOAD_FY(1);
    $scope.REMOVE_APPROVER_FY = function (AL, index) {
        if (confirm('Are you sure?')) {
            let AddFlag = false;
            $scope.NEW_APPROVAL_HEADERS_CHAIN_LIST.splice(index, 1);
            $scope.COMMON_CODE_CHANGE();
            for (let i = 0; i < $scope.NEW_APPROVAL_HEADERS_CHAIN_LIST.length; i++) {
                if (i === index) {
                    $scope.NEW_APPROVAL_HEADERS_CHAIN_LIST[i].APP_SORT_SEQUENCE = parseFloat($scope.NEW_APPROVAL_HEADERS_CHAIN_LIST[i].APP_SORT_SEQUENCE) - 1;
                    AddFlag = true;
                }
                if (AddFlag && i !== index) {
                    $scope.NEW_APPROVAL_HEADERS_CHAIN_LIST[i].APP_SORT_SEQUENCE = parseFloat($scope.NEW_APPROVAL_HEADERS_CHAIN_LIST[i].APP_SORT_SEQUENCE) - 1;
                };
            };
        }
        $scope.COMMON_CODE_CHANGE();
    }
    $scope.APPROVE_CLICK_FY = function () {
        $scope.ApprovalForm.submitted = true;
        if ($scope.ApprovalForm.$valid) {
            var errorCnt = 0;
            var IS_ALLOW;
            if ($scope.ApprovalViewSearch.UNSELECTED_INVOICE == $scope.ApprovalViewSearch.APPROVAL_HEADERS_LIST.TOTAL_INVOICES) {
                errorCnt = 1
            }
            if (errorCnt == 1) {
                IS_ALLOW = confirm("You have not selected any invoice to approve, Are you sure you want to reject all invoices?");
            }
            else {
                IS_ALLOW = confirm('Are you sure you want to proceed?');
            }

            if (IS_ALLOW) {
                $scope.PROCESS_APPROVALS_LVL_2();
            }
        }
    }


    $scope.POP_BANK_Fn = function () {
        $('#BANK').modal('show');
    }
    $scope.NG_CHANGE_BANK_Fn = function () {
        $scope.GET_PYMNT_ENTITY_BANK_MAPPING();
    }
    $scope.NG_CHANGE_ENTITY_BANK_Fn = function () {
        $scope.GET_PYMNT_SCHDLS_BY_BANK();
    }
    $scope.DOWNLOAD_PYMT_BANK_Fn = function () {
        var BANK_NAME_DATA = $scope.PYMNT_BANK_LIST.filter(function (x) { return x.ID == $scope.InvoiceApprovalSearch.BRANK_ID })
        var BANK_NAME = ""; var ENTITY_BANK_NAME = "";
        if (BANK_NAME_DATA.length > 0) {
            BANK_NAME = BANK_NAME_DATA[0].BANK_NAME;
        }
        var ENTITY_BANK_DATA = $scope.PYMNT_ENTITY_BANK_MAPPING_LIST.filter(function (x) { return x.ENTITY_BANK_MAPPING_ID == $scope.InvoiceApprovalSearch.ENTITY_BANK_MAPPING_ID })
        if (ENTITY_BANK_DATA.length > 0) {
            ENTITY_BANK_NAME = BANK_NAME_DATA[0].BANK_NAME + '-' + ENTITY_BANK_DATA[0].BANK_CUSTOMER_ID;
        }
        var FILE_NAME_S = "SUCCESS_" + BANK_NAME + "_" + ENTITY_BANK_NAME;
        var FILE_NAME_E = "EXCEPTION_" + BANK_NAME + "_" + ENTITY_BANK_NAME;
        if ($scope.InvoiceApprovalSearch.BRANK_ID == 1) {
            alasql('SELECT COMPANY_REFERENCE_NUMBER,PAYMENT_TYPE,DEBIT_IBAN,AMOUNT,PAYMENT_CURRENCY,PAYMENT_VALUE_DATE,BENEFICIARY_NAME,BENEFICIARY_ADDRESS_1,BENEFICIARY_ADDRESS_2,BENEFICIARY_ADDRESS_3,BENEFICIARY_ACCOUNT_NO,BENEFICIARY_BANK_NAME,BENEFICIARY_BANK_ADDRESS_1,BENEFICIARY_BANK_ADDRESS_2,BENEFICIARY_BANK_ADDRESS_3,BENEFICIARY_BANK_SWIFT_CODE,PAYMENT_DETAILS_1,PAYMENT_DETAILS_2,PAYMENT_DETAILS_3,PAYMENT_DETAILS_4,CHARGES_DETAILS,INTERMEDIARY_BANK_NAME,INTERMEDIARY_BANK_ADDRESS_1,INTERMEDIARY_BANK_ADDRESS_2,INTERMEDIARY_BANK_ADDRESS_3,INTERMEDIARY_BANK_SWIFT_CODE,DEAL_NUMBER,REMITTANCE_CODE,REMITTANCE_DETAILS,BENE_BANK_SORT INTO XLSX("' + FILE_NAME_S + '",{headers:true}) FROM ?', [$scope.PYMNT_SCHDLS_BY_BANK_ONE_LIST.filter(function (x) { return x.FLAG == 0 })]);
            alasql('SELECT COMPANY_REFERENCE_NUMBER,PAYMENT_TYPE,DEBIT_IBAN,AMOUNT,PAYMENT_CURRENCY,PAYMENT_VALUE_DATE,BENEFICIARY_NAME,BENEFICIARY_ADDRESS_1,BENEFICIARY_ADDRESS_2,BENEFICIARY_ADDRESS_3,BENEFICIARY_ACCOUNT_NO,BENEFICIARY_BANK_NAME,BENEFICIARY_BANK_ADDRESS_1,BENEFICIARY_BANK_ADDRESS_2,BENEFICIARY_BANK_ADDRESS_3,BENEFICIARY_BANK_SWIFT_CODE,PAYMENT_DETAILS_1,PAYMENT_DETAILS_2,PAYMENT_DETAILS_3,PAYMENT_DETAILS_4,CHARGES_DETAILS,INTERMEDIARY_BANK_NAME,INTERMEDIARY_BANK_ADDRESS_1,INTERMEDIARY_BANK_ADDRESS_2,INTERMEDIARY_BANK_ADDRESS_3,INTERMEDIARY_BANK_SWIFT_CODE,DEAL_NUMBER,REMITTANCE_CODE,REMITTANCE_DETAILS,BENE_BANK_SORT INTO XLSX("' + FILE_NAME_E + '",{headers:true}) FROM ?', [$scope.PYMNT_SCHDLS_BY_BANK_ONE_LIST.filter(function (x) { return x.FLAG == 1 })]);
        } else if ($scope.InvoiceApprovalSearch.BRANK_ID == 2) {
            alasql('SELECT DEBIT_ACCOUNT_NO,CUSTOMER_REFERENCE_NO,TRANSACTION_TYPE_CODE,BENEFICIARY_NAME,BENEFICIARY_ADDR_LINE_1,BENEFICIARY_COUNTRY,BENEFICIARY_ACCOUNT_NO,BENEFICIARY_ACCOUNT_TYPE,PURPOSE_CODE,BENEFICIARY_BANK_COUNTRY,BENEFICIARY_BANK_SWIFT_CODE,ROUTING_CODE,BENEFICIARY_PURPOSE_CODE    ,INTERMEDIATORY_BANK_SWIFT_CODE,TRANSACTION_CURRENCY    ,TRANSACTION_AMOUNT,PURPOSE_OF_PAYMENT,BENEFICIARY_EMAIL_ID,VALUE_DATE,CHARGE_TYPE INTO XLSX("' + FILE_NAME_S + '",{headers:true}) FROM ?', [$scope.PYMNT_SCHDLS_BY_BANK_TWO_LIST.filter(function (x) { return x.FLAG == 0 })]);
            alasql('SELECT DEBIT_ACCOUNT_NO,CUSTOMER_REFERENCE_NO,TRANSACTION_TYPE_CODE,BENEFICIARY_NAME,BENEFICIARY_ADDR_LINE_1,BENEFICIARY_COUNTRY,BENEFICIARY_ACCOUNT_NO,BENEFICIARY_ACCOUNT_TYPE,PURPOSE_CODE,BENEFICIARY_BANK_COUNTRY,BENEFICIARY_BANK_SWIFT_CODE,ROUTING_CODE,BENEFICIARY_PURPOSE_CODE    ,INTERMEDIATORY_BANK_SWIFT_CODE,TRANSACTION_CURRENCY    ,TRANSACTION_AMOUNT,PURPOSE_OF_PAYMENT,BENEFICIARY_EMAIL_ID,VALUE_DATE,CHARGE_TYPE INTO XLSX("' + FILE_NAME_E + '",{headers:true}) FROM ?', [$scope.PYMNT_SCHDLS_BY_BANK_TWO_LIST.filter(function (x) { return x.FLAG == 1 })]);
        }
    }
    $scope.NEW_APPROVAL_HEADERS_CHAIN_LIST = [];
    $scope.BLANK_APPROVER_LIST = { APPROVER_NAME: null, ORDER: null };

    $scope.APPROVER_LIST = [];
    $scope.ADD_APPROVER_FY = function (AL, ABOVE_BELOW_FLAG, index) {
        const newArr = [];
        let AddFlag = false;
        if (ABOVE_BELOW_FLAG > 0) {
            index = index + 1
        };

        for (let i = 0; i < $scope.NEW_APPROVAL_HEADERS_CHAIN_LIST.length; i++) {
            if (i === index) {
                $scope.BLANK_APPROVER_LIST.APP_SORT_SEQUENCE = parseFloat(index) + 1;
                newArr.push(angular.copy($scope.BLANK_APPROVER_LIST));
                AddFlag = true;
            }
            if (AddFlag) {
                $scope.NEW_APPROVAL_HEADERS_CHAIN_LIST[i].APP_SORT_SEQUENCE = parseFloat($scope.NEW_APPROVAL_HEADERS_CHAIN_LIST[i].APP_SORT_SEQUENCE) + 1;
            };
            newArr.push($scope.NEW_APPROVAL_HEADERS_CHAIN_LIST[i]);
        };

        if ($scope.NEW_APPROVAL_HEADERS_CHAIN_LIST.length == index) {
            $scope.BLANK_APPROVER_LIST.APP_SORT_SEQUENCE = index + 1;
            newArr.push(angular.copy($scope.BLANK_APPROVER_LIST));
        };
        $scope.NEW_APPROVAL_HEADERS_CHAIN_LIST = angular.copy(newArr);
        $scope.COMMON_CODE_CHANGE();
    }
    $scope.ADD_NEW_APPROVER = function () {
        $('#Edit_Approvers').modal('show');
        if ($scope.NEW_APPROVAL_HEADERS_CHAIN_LIST.length == 0) {
            $scope.NEW_APPROVAL_HEADERS_CHAIN_LIST = angular.copy($scope.APPROVAL_HEADERS_CHAIN_LIST);
        }
        $scope.GET_PYMNT_APPROVERS();
    }
    $scope.GET_PYMNT_APPROVERS = function () {
        var ModelObj = new Object();
        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        ModelObj.BRANCH_LOGIN_ID = $scope.ApprovalViewSearch.APPROVAL_HEADERS_LIST.BRANCH_LOGIN_ID;
        PrcCommMethods.PAYMENT_API(ModelObj, 'GET_PYMNT_APPROVERS').then(function (data) {
            if (data.data != undefined && data.data.Table.length > 0) {
                $scope.PYMNT_APPROVERS_LIST = data.data.Table;
            } else {
                $scope.PYMNT_APPROVERS_LIST = [];
            }
        })
    };
    $scope.INS_UPD_APPROVERS_IN_APPROVAL_CHAIN = function () {
        $scope.SchInvoiceForm.submitted = true;
        if ($scope.SchInvoiceForm.$valid) {
            var PaymentModelObj = new Object();
            PaymentModelObj.APPROVAL_HEADER_ID = $scope.ApprovalViewSearch.APPROVAL_HEADER_ID;
            PaymentModelObj.APPROVERS_TYPE = [];
            var apprrovalerror = 0;
            angular.forEach($scope.NEW_APPROVAL_HEADERS_CHAIN_LIST, function (approver) {
                approver.apprrovalerror = 0;
                var ready = new Object();
                var DuplicateApprover = [];
                var Applist = $scope.PYMNT_APPROVERS_LIST.filter(function (x) { return x.NAME == approver.APPROVER_NAME })
                if (Applist.length > 0) {
                    approver.APPROVER_ID = Applist[0].USER_ID;
                    if (PaymentModelObj.APPROVERS_TYPE.length > 0) {
                        DuplicateApprover = PaymentModelObj.APPROVERS_TYPE.filter(function (x) { return x.APPROVER_ID == Applist[0].USER_ID })
                    }
                    if (DuplicateApprover.length > 0) {
                        apprrovalerror = 2;
                        approver.apprrovalerror = 2;
                    }
                }
                else {
                    approver.APPRROVAL_ERROR = 1;
                    apprrovalerror = 1;
                    approver.apprrovalerror = 1;
                }
                ready.APPROVAL_HEADER_STATUS_ID = approver.APPROVAL_HEADER_STATUS_ID == undefined ? 0 : approver.APPROVAL_HEADER_STATUS_ID;
                ready.APPROVER_ID = approver.APPROVER_ID;
                ready.APP_SORT_SEQUENCE = approver.APP_SORT_SEQUENCE;
                ready.GROUP_SORT_SEQUENCE = approver.GROUP_SORT_SEQUENCE == undefined || approver.GROUP_SORT_SEQUENCE == "" ? null : approver.GROUP_SORT_SEQUENCE;
                ready.HEADER_SORT_SEQUENCE = approver.HEADER_SORT_SEQUENCE == undefined || approver.HEADER_SORT_SEQUENCE == "" ? null : approver.HEADER_SORT_SEQUENCE;
                ready.APPROVAL_CHAIN_HEADER_ID = approver.APPROVAL_CHAIN_HEADER_ID == undefined || approver.APPROVAL_CHAIN_HEADER_ID == "" ? null : approver.APPROVAL_CHAIN_HEADER_ID;
                ready.APPROVAL_CHAIN_GROUP_ID = approver.APPROVAL_CHAIN_GROUP_ID == undefined || approver.APPROVAL_CHAIN_GROUP_ID == "" ? null : approver.APPROVAL_CHAIN_GROUP_ID;
                PaymentModelObj.APPROVERS_TYPE.push(ready);
            });

            PaymentModelObj.USER_ID = parseInt($cookies.get("USERID"));
            if (apprrovalerror == 0) {
                if (confirm('Are you sure? you want to submit')) {
                    $scope.$parent.overlay_loadingNew = 'block';
                    PrcCommMethods.PAYMENT_API(PaymentModelObj, 'INS_UPD_APPROVERS_IN_APPROVAL_CHAIN').then(function (data) {
                        if (data.data == 1) {
                            $scope.NEW_APPROVAL_HEADERS_CHAIN_LIST = [];
                            $scope.GET_APPROVAL_HEADERS_CHAIN();
                            $scope.$parent.ShowAlert('Succces', 'Approver(s) Added Successfully', 3000);
                            $('#Edit_Approvers').modal('hide');
                        }
                        if (data.data == 0) {
                            $scope.$parent.ShowAlert('Error', $scope.SOMETHINGWENTWRONG, 3000);
                        }
                    });
                }
                else {
                }
            }
            else {
                if (apprrovalerror == 1) {
                    $scope.$parent.ShowAlert('Error', "Invalid Approver", 5000);
                }
                if (apprrovalerror == 2) {
                    $scope.$parent.ShowAlert('Error', "please remove duplicate approver", 5000);
                }
                $scope.$parent.overlay_loadingNew = 'none';
            }
        }
    };

    $scope.VALIDATION_CLICK_FY = function () {
        $scope.InvoiceForm.submitted = true;
        var UnselectedInvCnt = 0, SelectedInvCnt = 0, rowcount = 0;
        angular.forEach($scope.SUPPLIER_LIST, function (value) {
            angular.forEach(value.INV_LIST, function (INV_LINE) {
                if (INV_LINE.IS_SELECTED_INV == undefined || INV_LINE.IS_SELECTED_INV == false) {
                    UnselectedInvCnt++;
                    value.HIDESHOW = true;
                }
                if (INV_LINE.IS_SELECTED_INV == true) {
                    SelectedInvCnt++;
                }
            });
        });
        if ($scope.InvoiceForm.$valid) {
            $scope.ApprovalViewSearch.SELECTED_INVOICES = SelectedInvCnt;
            $scope.ApprovalViewSearch.UNSELECTED_INVOICE = UnselectedInvCnt;
            $('#Approved_Reject_POP').modal('show');
            $scope.ALLOW_SUBMIT = false;
            if ($scope.OTP_VALID_CHECK == '1' && $scope.NXT_APPROVAL_HEADER_STATUS_ID == '') {
                $scope.ApprovalViewSearch.digit1 = "";
                $scope.ApprovalViewSearch.digit2 = "";
                $scope.ApprovalViewSearch.digit3 = "";
                $scope.ApprovalViewSearch.digit4 = "";
                $scope.ApprovalViewSearch.digit5 = "";
                $scope.ApprovalViewSearch.digit6 = "";
                $scope.ALLOW_SUBMIT = true;
                $scope.GENERATE_APPROVAL_OTP();
            }
        }
    }
    $scope.VALIDATE_APPROVAL_OTP = function () {
        $scope.MESSAGE_OTP_SEND = "";
        $scope.MESSAGE_OTP_ERROR = "";
        var ModelObj = new Object();
        ModelObj.APPROVAL_HEADER_ID = $scope.ApprovalViewSearch.APPROVAL_HEADER_ID;
        ModelObj.USER_ID = parseInt($cookies.get("USERID"));
        var digist = $scope.ApprovalViewSearch.digit1 + $scope.ApprovalViewSearch.digit2 + $scope.ApprovalViewSearch.digit3 + $scope.ApprovalViewSearch.digit4 + $scope.ApprovalViewSearch.digit5 + $scope.ApprovalViewSearch.digit6
        ModelObj.OTP = digist;
        PrcCommMethods.PAYMENT_API(ModelObj, 'VALIDATE_APPROVAL_OTP').then(function (data) {
            if (data.data == undefined || data.data.Table.length == undefined) {
                $scope.$parent.ShowAlert('Error', $scope.$parent.SOMETHINGWENTWRONG, 5000);
            }
            if (data.data.Table[0].IS_VALID == 1) {
                $scope.ALLOW_SUBMIT = false;
                $scope.$parent.ShowAlert('Success', 'Your OTP has been verified. Please proceed to submit', 5000);
                $scope.MESSAGE_OTP_SEND = "Your OTP has been verified. Please proceed to submit"
            }
            if (data.data.Table[0].IS_VALID == 0) {
                $scope.$parent.ShowAlert('Error', ' Invalid OTP', 5000);
                $scope.MESSAGE_OTP_ERROR = " Invalid OTP"
            }
        });
    }
    $scope.MESSAGE_OTP = "";
    $scope.MESSAGE_OTP_SEND = "";
    $scope.GENERATE_APPROVAL_OTP = function () {
        $scope.MESSAGE_OTP = "";
        $scope.MESSAGE_OTP_SEND = "";
        var ModelObj = new Object();
        ModelObj.APPROVAL_HEADER_ID = $scope.ApprovalViewSearch.APPROVAL_HEADER_ID;
        ModelObj.USER_ID = parseInt($cookies.get("USERID"));
        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PrcCommMethods.PAYMENT_API(ModelObj, 'GENERATE_APPROVAL_OTP').then(function (data) {
            if (data.data == undefined) {
                $scope.$parent.ShowAlert('Error', $scope.$parent.SOMETHINGWENTWRONG, 5000);
            }
            $scope.MESSAGE_OTP_SEND = "OTP has been sent to your registered email";
            //$scope.$parent.ShowAlert('Success', 'OTP has been send on email', 5000);
        });
    }

    $scope.RESEND_GENERATE_APPROVAL_OTP = function () {
        $scope.MESSAGE_OTP = "";
        $scope.MESSAGE_OTP_SEND = "";
        var ModelObj = new Object();
        ModelObj.APPROVAL_HEADER_ID = $scope.ApprovalViewSearch.APPROVAL_HEADER_ID;
        ModelObj.USER_ID = parseInt($cookies.get("USERID"));
        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PrcCommMethods.PAYMENT_API(ModelObj, 'GENERATE_APPROVAL_OTP').then(function (data) {
            if (data.data == undefined) {
                $scope.$parent.ShowAlert('Error', $scope.$parent.SOMETHINGWENTWRONG, 5000);
            }
            $scope.MESSAGE_OTP_SEND = "OTP has been resend to your registered email";
        });
    }

    $scope.PROCESS_APPROVALS_LVL_2 = function () {
        var ModelObj = new Object();
        $('#Approved_Reject_POP').modal('hide');
        ModelObj.APPROVAL_HEADER_ID = $scope.ApprovalViewSearch.APPROVAL_HEADER_ID;
        ModelObj.APPROVAL_TYPE_ID = $scope.ApprovalViewSearch.APPROVAL_TYPE_ID;
        ModelObj.CUR_APPROVAL_HEADER_STATUS_ID = $scope.CUR_APPROVAL_HEADER_STATUS_ID;
        ModelObj.NXT_APPROVAL_HEADER_STATUS_ID = $scope.NXT_APPROVAL_HEADER_STATUS_ID;
        ModelObj.AUT_APPROVAL_HEADER_STATUS_ID = "";
        angular.forEach($scope.APPROVAL_HEADERS_CHAIN_LIST, function (item) {
            if (item.ACTION_REQUIRED == 1) {
                if (parseInt(item.APPROVER_ID) != parseInt($cookies.get("USERID"))) {
                    if (ModelObj.AUT_APPROVAL_HEADER_STATUS_ID == "") {
                        ModelObj.AUT_APPROVAL_HEADER_STATUS_ID = item.APPROVAL_HEADER_STATUS_ID;
                    }
                    else {
                        ModelObj.AUT_APPROVAL_HEADER_STATUS_ID = ModelObj.AUT_APPROVAL_HEADER_STATUS_ID + ',' + item.APPROVAL_HEADER_STATUS_ID;
                    }
                }
            }
        });
        //ModelObj.AUT_APPROVAL_HEADER_STATUS_ID = Array.prototype.map.call($filter('filter')($scope.APPROVAL_HEADERS_CHAIN_LIST, { ACTION_REQUIRED: 1 }, true), function (item) { return parseInt(item.APPROVER_ID) != parseInt($cookies.get("USERID")) ? item.APPROVAL_HEADER_STATUS_ID : ''; }).join(",").replace(',', '');

        ModelObj.COMMENTS = $scope.ApprovalViewSearch.COMMENT;
        ModelObj.USER_ID = parseInt($cookies.get("USERID"));
        ModelObj.APPROVAL_STATUS_LIST = [];
        angular.forEach($scope.SUPPLIER_LIST, function (ValApp) {
            angular.forEach(ValApp.INV_LIST, function (INV_LINE) {
                var ReadOnlyApproval = new Object();
                ReadOnlyApproval.APPROVAL_LINE_ID = INV_LINE.APPROVAL_LINE_ID;
                if (INV_LINE.IS_SELECTED_INV) {
                    ReadOnlyApproval.STATUS_ID = 37;
                    ReadOnlyApproval.COMMENTS = INV_LINE.COMMENTS == undefined || INV_LINE.COMMENTS == null ? '' : INV_LINE.COMMENTS;
                }
                if (!INV_LINE.IS_SELECTED_INV) {
                    ReadOnlyApproval.STATUS_ID = 38;
                    ReadOnlyApproval.COMMENTS = INV_LINE.COMMENTS == undefined || INV_LINE.COMMENTS == null ? $scope.ApprovalViewSearch.COMMENT : INV_LINE.COMMENTS;
                }
                ModelObj.APPROVAL_STATUS_LIST.push(ReadOnlyApproval);
            });
        });
        PrcCommMethods.PAYMENT_API(ModelObj, 'PROCESS_APPROVALS_LVL_2').then(function (data) {
            $('#Approved_Reject_POP').modal('hide');
            if (data.data != undefined && data.data == 0) {
                $scope.$parent.ShowAlert('Error', $scope.$parent.SOMETHINGWENTWRONG, 5000);
            }
            if (data.data != undefined && data.data == 1) {
                $scope.$parent.ShowAlert('Success', 'Your submission has been save.', 5000);
                $location.path('Approvals');
            }
        });
    }
    $scope.APPROVAL_LINES_CHAIN = [];

    $scope.GET_APPROVAL_LINES_CHAIN = function (LINE_INVE) {
        $('#CommentsList').modal('show');
        $scope.$parent.overlay_loadingNew = 'block';
        var PaymentModelObj = new Object();
        PaymentModelObj.APPROVAL_LINE_ID = LINE_INVE.APPROVAL_LINE_ID;
        PaymentModelObj.APPROVAL_TYPE_ID = $scope.ApprovalViewSearch.APPROVAL_TYPE_ID;
        PrcCommMethods.PAYMENT_API(PaymentModelObj, 'GET_APPROVAL_LINES_CHAIN').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.APPROVAL_LINES_CHAIN = data.data.Table;
            }
            else {
                $scope.$parent.ShowAlert('Error', 'No record found.', 5000);
            }
            $scope.$parent.overlay_loadingNew = 'none';
        });
    }

    $scope.GET_APPROVAL_LINES_FOR_APPROVER = function () {
        $scope.$parent.overlay_loadingNew = 'block';
        var PaymentModelObj = new Object();
        PaymentModelObj.APPROVAL_HEADER_ID = $scope.ApprovalViewSearch.APPROVAL_HEADER_ID;
        PaymentModelObj.APPROVAL_TYPE_ID = $scope.ApprovalViewSearch.APPROVAL_TYPE_ID;
        PaymentModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.PAYMENT_API(PaymentModelObj, 'GET_APPROVAL_LINES_FOR_APPROVER').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.$parent.overlay_loadingNew = 'none';
                $scope.COMMAM_METHOD_FOR_SUPPLIER_INVOICE(data);
            }
        });
    }
    $scope.GET_APPROVAL_LINES_FOR_SUBMITTER = function () {
        $scope.$parent.overlay_loadingNew = 'block';
        var PaymentModelObj = new Object();
        PaymentModelObj.APPROVAL_HEADER_ID = $scope.ApprovalViewSearch.APPROVAL_HEADER_ID;
        PaymentModelObj.APPROVAL_TYPE_ID = $scope.ApprovalViewSearch.APPROVAL_TYPE_ID;
        PaymentModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.PAYMENT_API(PaymentModelObj, 'GET_APPROVAL_LINES_FOR_SUBMITTER').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.$parent.overlay_loadingNew = 'none';
                $scope.COMMAM_METHOD_FOR_SUPPLIER_INVOICE(data);
            }
        })
    }
    $scope.HIDE_SHOW_FY = function (SUP_LINE, FLAG) {
        if (FLAG == undefined) {
            SUP_LINE.HIDESHOW = SUP_LINE.HIDESHOW ? false : true;
        }
        if (SUP_LINE.INV_LIST == undefined) {
            SUP_LINE.INV_LIST = $scope.APPROVAL_LINES_FOR_APPROVER.filter(function (x) {
                return SUP_LINE.SUPPLIER_ID == x.SUPPLIER_ID;
            });
        }
    }

    $scope.SUPPLIER_CANCEL_LIST = [];

    $scope.COMMAM_METHOD_FOR_SUPPLIER_INVOICE = function (data) {
        var IS_APPROVAL_LIST = data.data.Table.filter(function (x) { return x.OVERALL_STATUS_ID != 42 });
        var IS_CANCEL_LIST = data.data.Table.filter(function (x) { return x.OVERALL_STATUS_ID == 42 });
        var SUP_LIST = $filter('unique')(IS_APPROVAL_LIST, 'SUPPLIER_ID');
        var SUP_CAN_LIST = $filter('unique')(IS_CANCEL_LIST, 'SUPPLIER_ID');
        $scope.SUPPLIER_LIST = angular.copy(SUP_LIST);
        $scope.SUPPLIER_CANCEL_LIST = angular.copy(SUP_CAN_LIST);
        $scope.APPROVAL_LINES_FOR_APPROVER = angular.copy(IS_APPROVAL_LIST);
        $scope.CANCEL_LINES_FOR_APPROVER = angular.copy(IS_CANCEL_LIST);
    }
    $scope.$on('ngRepeatFinishedRender', function (ngRepeatFinishedEvent) {
        $scope.ApprovalViewSearch.SELECTED_AMOUNT = 0;
        if ($scope.SUPPLIER_LIST.length > 0) {
            $scope.ApprovalViewSearch.IS_ALL_SELECTED = true;
            angular.forEach($scope.SUPPLIER_LIST, function (ValApp) {
                ValApp.IS_SELECTED = true;
                ValApp.INV_LIST = $scope.APPROVAL_LINES_FOR_APPROVER.filter(function (x) { return ValApp.SUPPLIER_ID == x.SUPPLIER_ID && (x.OVERALL_STATUS_ID != 42) });
                angular.forEach(ValApp.INV_LIST, function (INV_LINE) {
                    if (ValApp.SELECTED_INV_COUNT == undefined) {
                        ValApp.SELECTED_INV_COUNT = 0;
                    }
                    if (ValApp.SELECTED_TOTAL_AMOUNT == undefined) {
                        ValApp.SELECTED_TOTAL_AMOUNT = 0;
                    }
                    if (ValApp.TOTAL_TOTAL_AMOUNT == undefined) {
                        ValApp.TOTAL_TOTAL_AMOUNT = 0;
                    }

                    if ($scope.ApprovalViewSearch.WHO_LOADED == 1) {
                        if (INV_LINE.APPROVER_STATUS_ID != 38) {
                            ValApp.SELECTED_TOTAL_AMOUNT = angular.copy(ValApp.SELECTED_TOTAL_AMOUNT + INV_LINE.TOTAL_AMOUNT);
                            ValApp.TOTAL_TOTAL_AMOUNT = angular.copy(ValApp.SELECTED_TOTAL_AMOUNT);
                            ValApp.SELECTED_INV_COUNT = ValApp.SELECTED_INV_COUNT + 1;
                        }
                    }
                    else if ($scope.ApprovalViewSearch.WHO_LOADED == 2) {
                        if (INV_LINE.OVERALL_STATUS_ID != 38) {
                            ValApp.SELECTED_TOTAL_AMOUNT = angular.copy(ValApp.SELECTED_TOTAL_AMOUNT + INV_LINE.TOTAL_AMOUNT);
                            ValApp.TOTAL_TOTAL_AMOUNT = angular.copy(ValApp.SELECTED_TOTAL_AMOUNT);
                            ValApp.SELECTED_INV_COUNT = ValApp.SELECTED_INV_COUNT + 1;
                        }
                    }
                    $scope.ApprovalViewSearch.SELECTED_AMOUNT = $scope.ApprovalViewSearch.SELECTED_AMOUNT + INV_LINE.TOTAL_AMOUNT;
                    INV_LINE.IS_SELECTED_INV = true;
                });
                $scope.ApprovalViewSearch.SELECTED_INV_COUNT_GRID = $scope.ApprovalViewSearch.SELECTED_INV_COUNT_GRID + angular.copy(ValApp.SELECTED_INV_COUNT);
            });
            $scope.ApprovalViewSearch.DISPLAY_AMOUNT_GRID = angular.copy($scope.ApprovalViewSearch.SELECTED_AMOUNT);
            $scope.ApprovalViewSearch.DISPLAY_SUPPLIER_COUNT_GRID = angular.copy($scope.SUPPLIER_LIST.length);
            $scope.ApprovalViewSearch.DISPLAY_PAYMANT_AMOUNT_GRID = angular.copy($scope.SUPPLIER_LIST.length);
        }
        if ($scope.SUPPLIER_CANCEL_LIST.length > 0) {
            //$scope.ApprovalViewSearch.IS_ALL_SELECTED = true;
            angular.forEach($scope.SUPPLIER_CANCEL_LIST, function (ValApp) {
                // ValApp.IS_SELECTED = true;
                ValApp.INV_LIST = $scope.CANCEL_LINES_FOR_APPROVER.filter(function (x) { return ValApp.SUPPLIER_ID == x.SUPPLIER_ID && x.OVERALL_STATUS_ID == 42; });
                angular.forEach(ValApp.INV_LIST, function (INV_LINE) {
                    if (ValApp.SELECTED_INV_COUNT == undefined) {
                        ValApp.SELECTED_INV_COUNT = 0;
                    }
                    if (ValApp.SELECTED_TOTAL_AMOUNT == undefined) {
                        ValApp.SELECTED_TOTAL_AMOUNT = 0;
                    }
                    if (ValApp.TOTAL_TOTAL_AMOUNT == undefined) {
                        ValApp.TOTAL_TOTAL_AMOUNT = 0;
                    }
                    ValApp.SELECTED_TOTAL_AMOUNT = angular.copy(ValApp.SELECTED_TOTAL_AMOUNT + INV_LINE.TOTAL_AMOUNT);
                    ValApp.TOTAL_TOTAL_AMOUNT = angular.copy(ValApp.SELECTED_TOTAL_AMOUNT);
                    // $scope.ApprovalViewSearch.SELECTED_AMOUNT = $scope.ApprovalViewSearch.SELECTED_AMOUNT + INV_LINE.TOTAL_AMOUNT;
                    ValApp.SELECTED_INV_COUNT = ValApp.SELECTED_INV_COUNT + 1;
                    INV_LINE.IS_SELECTED_INV = true;
                });
                //$scope.ApprovalViewSearch.SELECTED_INV_COUNT_GRID = $scope.ApprovalViewSearch.SELECTED_INV_COUNT_GRID + angular.copy(ValApp.SELECTED_INV_COUNT);
            });
            //$scope.ApprovalViewSearch.DISPLAY_AMOUNT_GRID = angular.copy($scope.ApprovalViewSearch.SELECTED_AMOUNT);
            //$scope.ApprovalViewSearch.DISPLAY_SUPPLIER_COUNT_GRID = angular.copy($scope.SUPPLIER_LIST.length);
            //$scope.ApprovalViewSearch.DISPLAY_PAYMANT_AMOUNT_GRID = angular.copy($scope.SUPPLIER_LIST.length);
        }

    });

    $scope.PAGE_LOAD = function () {
        if ($scope.ApprovalViewSearch.WHO_LOADED == 1) {
            $scope.GET_APPROVAL_LINES_FOR_APPROVER();
        }
        else if ($scope.ApprovalViewSearch.WHO_LOADED == 2) {
            $scope.GET_APPROVAL_LINES_FOR_SUBMITTER();
        }
    }
    $scope.PAGE_LOAD();
    $('.digit-group').find('input').each(function () {
        //var totaltext = this.value;
        //console.log(totaltext);

        $(this).attr('maxlength', 1);
        $(this).on('keyup', function (e) {
            var parent = $($(this).parent());
            if (e.keyCode === 8 || e.keyCode === 37) {
                var prev = parent.find('input#' + $(this).data('previous'));
                if (prev.length) {
                    $(prev).select();
                }
            } else if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 65 && e.keyCode <= 90) || (e.keyCode >= 96 && e.keyCode <= 105) || e.keyCode === 39) {
                var next = parent.find('input#' + $(this).data('next'));
                if (next.length) {
                    $(next).select();
                } else {
                    $scope.VALIDATE_APPROVAL_OTP();
                }
            }
        });
    });

    $scope.DOWNLOAD_PAYMMENT_APPROVED_INVOICE = function () {
        $scope.INVOICE_AMOUNT = 0;
        $scope.DUE_AMOUNT = 0;
        $scope.PAYMENT_AMOUNT = 0;

        $scope.EXCEL_REPORT_DATA_LIST = [];
        angular.forEach($scope.APPROVAL_LINES_FOR_APPROVER.filter(function (x) { return x.OVERALL_STATUS_ID == 37 }), function (x) {
            $scope.INVOICE_AMOUNT = parseFloat($scope.INVOICE_AMOUNT) + parseFloat(x.TOTAL_AMOUNT == undefined || x.TOTAL_AMOUNT == null ? 0 : x.TOTAL_AMOUNT);
            $scope.DUE_AMOUNT = parseFloat($scope.DUE_AMOUNT) + parseFloat(x.DUE_AMOUNT == undefined || x.DUE_AMOUNT == null ? 0 : x.DUE_AMOUNT);
            $scope.PAYMENT_AMOUNT = parseFloat($scope.PAYMENT_AMOUNT) + parseFloat(x.PAYMENT_AMOUNT == undefined || x.PAYMENT_AMOUNT == null ? 0 : x.PAYMENT_AMOUNT);

            $scope.SELECTED_DATA = [];
            $scope.SELECTED_DATA =
                {
                    'Invoice #': x.INVOICENUMBER,
                    'Supplier Name': x.SUPPLIER_NAME,
                    'Account': x.ACCOUNT_NAME == undefined ? "" : x.ACCOUNT_NAME,
                    'Bank Name': x.BANK_NAME == undefined ? "" : x.BANK_NAME,
                    'IBAN': x.IBAN == undefined ? "" : x.IBAN,
                    'Bank account number': x.BANK_ACCOUNT_NUMBER == undefined ? "" : x.BANK_ACCOUNT_NUMBER,
                    'Invoice Date': new Date(x.INVOICE_DATE),
                    'Due Date': new Date(x.DUEDATE),
                    'Currency': $scope.$parent.CURRENCY_SYMBOL,
                    'Invoice Amount': x.TOTAL_AMOUNT,
                    'Due Amount': x.DUE_AMOUNT,
                    'Payment Amount': x.PAYMENT_AMOUNT,
                    'Approval Status': x.OVERALL_STATUS_NAME,
                    'Comments': x.COMMENTS == undefined || x.COMMENTS == null ? "" : x.COMMENTS,
                };
            $scope.EXCEL_REPORT_DATA_LIST.push($scope.SELECTED_DATA);
        });
        $scope.SELECTED_DATA =
            {
                'Invoice #': '',
                'Supplier Name': '',
                'Account': '',
                'Bank Name': '',
                'IBAN': '',
                'Bank account number': '',
                'Invoice Date': '',
                'Due Date': '',
                'Currency': 'Total',
                'Invoice Amount': $scope.INVOICE_AMOUNT,
                'Due Amount': $scope.DUE_AMOUNT,
                'Payment Amount': $scope.PAYMENT_AMOUNT,
                'Approval Status': '',
                'Comments': '',
            };
        $scope.EXCEL_REPORT_DATA_LIST.push($scope.SELECTED_DATA);

        alasql('SELECT * INTO XLSX("Approved",{headers:true}) FROM ?', [$scope.EXCEL_REPORT_DATA_LIST]);
    }

});
