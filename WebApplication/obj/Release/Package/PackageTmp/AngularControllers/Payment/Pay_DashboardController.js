app.controller('Pay_DashboardController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    //====================== XERO_INVOICES_LIST List =====================================
    $scope.COMMON_CODE_CHANGE();
    $scope.DashboardSearch = {
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
        HEADER_OVER_DUE_ID: 5,
        TOP_OVER_DUE_ID: 10,
        INVOICE_DATE_TEXT: "Invoice Date",
        DUE_DATE_TEXT: "Due Date",
        SCHEDULE_DATE_TEXT: "Schedule Date",
        BRANCH_LOGIN_ID: parseInt($cookies.get("BRANCH_ID")),
    };
    function reporInvrange(startDate, endDate) {
        $scope.DashboardSearch.INVOICE_START_DATE = startDate.format($scope.$parent.Datelocaleformat.format);
        $scope.DashboardSearch.INVOICE_END_DATE = endDate.format($scope.$parent.Datelocaleformat.format);
        $('#reporInvrange span').html(startDate.format($scope.$parent.Datelocaleformat.format) + ' - ' + endDate.format($scope.$parent.Datelocaleformat.format));
    };
    function reportDueDaterange(startDate, endDate) {
        $scope.DashboardSearch.DUE_START_DATE = startDate.format($scope.$parent.Datelocaleformat.format);
        $scope.DashboardSearch.DUE_END_DATE = endDate.format($scope.$parent.Datelocaleformat.format);
        $('#reportduedaterange span').html(startDate.format($scope.$parent.Datelocaleformat.format) + ' - ' + endDate.format($scope.$parent.Datelocaleformat.format));
    };

    $scope.AGING_STATUS = [{ NAME: ">30", ID: 1 }, { NAME: "21-30", ID: 2 }, { NAME: "11-20", ID: 3 }, { NAME: "6-10", ID: 4 }, { NAME: "0-05", ID: 5 }];

    //--5= 0 - 7, 4 = 8 - 14, 3 = 15 - 21, 2 = 22 - 28, 1 = > 28
    $scope.HEADER_OVER_DUE_LIST = [];

    $scope.HEADER_OVER_DUE_LIST = [{ NAME: "0-7", ID: 5, CLASS_NAME: '' },
    { NAME: "8-14", ID: 4, CLASS_NAME: '' },
    { NAME: "15-21", ID: 3, CLASS_NAME: '' },
    { NAME: "22-28", ID: 2, CLASS_NAME: '' },
    { NAME: ">28", ID: 1, CLASS_NAME: 'text-right' },
    ];

    $scope.PAGE_SIZE_LIST = [{ NAME: "10", ID: 10, CLASS_NAME: '' },
    { NAME: "20", ID: 20, CLASS_NAME: '' },
    { NAME: "30", ID: 30, CLASS_NAME: '' }]



    $(function () {
        startDate = moment().startOf('month');//moment().startOf('isoWeek');//moment().subtract(6, 'days');
        endDate = moment().endOf('month'); //moment().subtract(0, 'days');
        $scope.$parent.SetUpDateRangeMultiDatePicker('reporInvrange', startDate, endDate, reporInvrange, 1);
        $scope.$parent.SetUpDateRangeMultiDatePicker('reportduedaterange', startDate, endDate, reportDueDaterange, 1);
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
    $scope.PYMNT_TOP_N_SUPPLIERS_BY_PENDING_PAYMENTS = [];
    $scope.PYMNT_TOP_N_INVOICES_BY_PENDING_PAYMENTS = [];
    $scope.PYMNT_OVERDUE_PAYMENTS = [];
    $scope.PYMNT_UPCOMING_PAYMENTS = [];

    $scope.GET_PYMNT_TOTAL_SCHEDULED_AMOUNT = function (FLAG) {
        var PaymentModelObj = new Object();
        $scope.$parent.overlay_loadingNew = 'block';
        PaymentModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PaymentModelObj.BRANCH_LOGIN_ID = $scope.DashboardSearch.BRANCH_LOGIN_ID;
        PrcCommMethods.PAYMENT_API(PaymentModelObj, 'GET_PYMNT_TOTAL_SCHEDULED_AMOUNT').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.$parent.overlay_loadingNew = 'none';
                $scope.PYMNT_TOTAL_SCHEDULED_AMOUNT = data.data.Table[0];
            }
        })
    }
    $scope.GET_PYMNT_PENDING_SCHEDULING_AMOUNT = function (FLAG) {
        var PaymentModelObj = new Object();
        $scope.$parent.overlay_loadingNew = 'block';
        PaymentModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PaymentModelObj.BRANCH_LOGIN_ID = $scope.DashboardSearch.BRANCH_LOGIN_ID;
        PrcCommMethods.PAYMENT_API(PaymentModelObj, 'GET_PYMNT_PENDING_SCHEDULING_AMOUNT').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.$parent.overlay_loadingNew = 'none';
                $scope.PYMNT_PENDING_SCHEDULING_AMOUNT = data.data.Table[0];
            }
        })
    }
    $scope.nginitoverdue = function (Od) {
        //var a = $scope.AGING_STATUS.filter(function (x) { return x.ID == Od.DAY_NO })
        //Od.AGING = 0;
        //if (a.length > 0) {
        //    Od.AGING = a[0].NAME;
        //}
    }
    $scope.GET_PYMNT_TODAYS_PAYMENT_AMOUNT = function () {
        var ModelObj = new Object();
        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        ModelObj.BRANCH_LOGIN_ID = $scope.DashboardSearch.BRANCH_LOGIN_ID;
        PrcCommMethods.PAYMENT_API(ModelObj, 'GET_PYMNT_TODAYS_PAYMENT_AMOUNT').then(function (data) {
            if (data.data != undefined && data.data.Table.length > 0) {
                $scope.PYMNT_TODAYS_PAYMENT_AMOUNT = data.data.Table[0];
            }
        })
    }
    $scope.GET_PYMNT_SCHEDULED_PAYMENTS_BY_DATE = function () {
        var ModelObj = new Object();
        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        ModelObj.BRANCH_LOGIN_ID = $scope.DashboardSearch.BRANCH_LOGIN_ID;
        PrcCommMethods.PAYMENT_API(ModelObj, 'GET_PYMNT_SCHEDULED_PAYMENTS_BY_DATE').then(function (data) {
            if (data.data != undefined && data.data.Table.length > 0) {
                $scope.PYMNT_SCHEDULED_PAYMENTS_BY_DATE = data.data.Table;
            }
        })
    }
    $scope.GET_PYMNT_TOP_N_INVOICES_BY_PENDING_PAYMENTS = function () {
        var ModelObj = new Object();
        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        ModelObj.TOP_N = 10;
        ModelObj.BRANCH_LOGIN_ID = $scope.DashboardSearch.BRANCH_LOGIN_ID;
        PrcCommMethods.PAYMENT_API(ModelObj, 'GET_PYMNT_TOP_N_INVOICES_BY_PENDING_PAYMENTS').then(function (data) {
            if (data.data != undefined && data.data.Table.length > 0) {
                $scope.PYMNT_TOP_N_INVOICES_BY_PENDING_PAYMENTS = data.data.Table;
            }
        })
    }
    $scope.GET_PYMNT_TOP_N_SUPPLIERS_BY_PENDING_PAYMENTS = function () {
        var ModelObj = new Object();
        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        ModelObj.TOP_N = 10;
        ModelObj.BRANCH_LOGIN_ID = $scope.DashboardSearch.BRANCH_LOGIN_ID;
        PrcCommMethods.PAYMENT_API(ModelObj, 'GET_PYMNT_TOP_N_SUPPLIERS_BY_PENDING_PAYMENTS').then(function (data) {
            if (data.data != undefined && data.data.Table.length > 0) {
                $scope.PYMNT_TOP_N_SUPPLIERS_BY_PENDING_PAYMENTS = data.data.Table;
            }
        })
    }
    $scope.GET_PYMNT_TOP_N_SUPPLIER_PAID_PAYMENTS_BY_MONTH = function () {
        var ModelObj = new Object();
        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        ModelObj.TOP_N = 20;
        ModelObj.BRANCH_LOGIN_ID = $scope.DashboardSearch.BRANCH_LOGIN_ID;
        PrcCommMethods.PAYMENT_API(ModelObj, 'GET_PYMNT_TOP_N_SUPPLIER_PAID_PAYMENTS_BY_MONTH').then(function (data) {
            if (data.data != undefined && data.data.Table1.length > 0) {
                $scope.PYMNT_TOP_N_SUPPLIER_PAID_PAYMENTS_BY_MONTH = data.data.Table1;
                $scope.PYMNT_HEADER = data.data.HEADER;
            }
        })
    }
    $scope.GET_PYMNT_CRUCIAL_SUPPLIERS_PAID_VS_OUTSTANDING = function () {
        var ModelObj = new Object();
        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        ModelObj.BRANCH_LOGIN_ID = $scope.DashboardSearch.BRANCH_LOGIN_ID;
        PrcCommMethods.PAYMENT_API(ModelObj, 'GET_PYMNT_CRUCIAL_SUPPLIERS_PAID_VS_OUTSTANDING').then(function (data) {
            if (data.data != undefined && data.data.Table.length > 0) {
                $scope.PYMNT_CRUCIAL_SUPPLIERS_PAID_VS_OUTSTANDING_LIST = data.data.Table;
            }
            else {
                $scope.PYMNT_CRUCIAL_SUPPLIERS_PAID_VS_OUTSTANDING_LIST = [];
            }
        })
    }
    $scope.GET_PYMNT_CRUCIAL_SUPPLIERS_PAID_VS_OUTSTANDING();
    $scope.GET_PYMNT_OVERDUE_PAYMENTS = function () {
        var ModelObj = new Object();
        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        ModelObj.TOP_N = $scope.DashboardSearch.TOP_OVER_DUE_ID;
        ModelObj.SORT_BY = $scope.DashboardSearch.HEADER_OVER_DUE_ID;
        ModelObj.BRANCH_LOGIN_ID = $scope.DashboardSearch.BRANCH_LOGIN_ID;
        PrcCommMethods.PAYMENT_API(ModelObj, 'GET_PYMNT_OVERDUE_PAYMENTS').then(function (data) {
            if (data.data != undefined && data.data.Table.length > 0) {
                $scope.PYMNT_OVERDUE_PAYMENTS = data.data.Table;
            }
            else {
                $scope.PYMNT_OVERDUE_PAYMENTS = [];
            }
        })
    }
    $scope.GET_PYMNT_CRUCIAL_SUPPLIER_OUTSTANDING_DETAILS = function (LINE) {
        if (LINE.OUTSTANDING_DETAILS == undefined && parseFloat(LINE.OUTSTANDING_AMOUNT) > 0) {
            $('#Outstanding').modal('show');
            var ModelObj = new Object();
            ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            ModelObj.XERO_CONTACT_ID = LINE.XERO_CONTACT_ID;
            ModelObj.BRANCH_LOGIN_ID = $scope.DashboardSearch.BRANCH_LOGIN_ID;
            PrcCommMethods.PAYMENT_API(ModelObj, 'GET_PYMNT_CRUCIAL_SUPPLIER_OUTSTANDING_DETAILS').then(function (data) {
                if (data.data != undefined && data.data.Table.length > 0) {
                    LINE.OUTSTANDING_DETAILS = data.data.Table;
                    $scope.OUTSTANDING_DETAILS = data.data.Table;
                }
            })
        } else {
            if (LINE.OUTSTANDING_DETAILS.length > 0) {
                $('#Outstanding').modal('show');
                $scope.OUTSTANDING_DETAILS = LINE.OUTSTANDING_DETAILS;
            }
        }
    }
    $scope.GET_PYMNT_UPCOMING_PAYMENTS = function () {
        var ModelObj = new Object();
        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        ModelObj.BRANCH_LOGIN_ID = $scope.DashboardSearch.BRANCH_LOGIN_ID;
        PrcCommMethods.PAYMENT_API(ModelObj, 'GET_PYMNT_UPCOMING_PAYMENTS').then(function (data) {
            if (data.data != undefined && data.data.Table.length > 0) {
                $scope.PYMNT_UPCOMING_PAYMENTS = data.data.Table;

            }
        })
    }


    $scope.BRANCH_CHANGE = function () {

        $scope.GET_PYMNT_TOTAL_SCHEDULED_AMOUNT(1);
        $scope.GET_PYMNT_PENDING_SCHEDULING_AMOUNT(1);
        $scope.GET_PYMNT_TODAYS_PAYMENT_AMOUNT();

        $scope.GET_PYMNT_SCHEDULED_PAYMENTS_BY_DATE();

        $scope.GET_PYMNT_TOP_N_INVOICES_BY_PENDING_PAYMENTS();
        $scope.GET_PYMNT_TOP_N_SUPPLIERS_BY_PENDING_PAYMENTS();
        $scope.GET_PYMNT_TOP_N_SUPPLIER_PAID_PAYMENTS_BY_MONTH();

        $scope.GET_PYMNT_OVERDUE_PAYMENTS();
        $scope.GET_PYMNT_UPCOMING_PAYMENTS();
    }

    $scope.GET_PYMNT_TOTAL_SCHEDULED_AMOUNT(1);
    $scope.GET_PYMNT_PENDING_SCHEDULING_AMOUNT(1);
    $scope.GET_PYMNT_TODAYS_PAYMENT_AMOUNT();

    $scope.GET_PYMNT_SCHEDULED_PAYMENTS_BY_DATE();

    $scope.GET_PYMNT_TOP_N_INVOICES_BY_PENDING_PAYMENTS();
    $scope.GET_PYMNT_TOP_N_SUPPLIERS_BY_PENDING_PAYMENTS();
    $scope.GET_PYMNT_TOP_N_SUPPLIER_PAID_PAYMENTS_BY_MONTH();

    $scope.GET_PYMNT_OVERDUE_PAYMENTS();
    $scope.GET_PYMNT_UPCOMING_PAYMENTS();

    $scope.SUPPLIER_LIST = [];
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
    $scope.RESET_SUPPLIER = function () {
        $scope.DashboardSearch.SUPPLIER_NAME = '';
        $scope.SupperForm.submitted = false;
    }
    $scope.INS_UPD_XERO_CRUCIAL_SUPPLIERS = function () {
        $scope.SupperForm.submitted = true;
        if ($scope.SupperForm.$valid) {
            var count = 0;
            var LIST = $scope.SUPPLIER_LIST.filter(function (x) { return x.SUPPLIER_NAME == $scope.DashboardSearch.SUPPLIER_NAME });
            if (LIST.length == 0) {
                count = 1;
            }
            var PaymentModelObj = new Object();
            PaymentModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            PaymentModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PaymentModelObj.BRANCH_ID = $scope.DashboardSearch.BRANCH_LOGIN_ID;
            if (LIST.length > 0) {
                PaymentModelObj.XERO_CONTACT_ID = LIST[0].ID;
            }
            PaymentModelObj.DELETE_FLAG = 0;
            if (count == 0) {
                PrcCommMethods.PAYMENT_API(PaymentModelObj, 'INS_UPD_XERO_CRUCIAL_SUPPLIERS').then(function (data) {
                    if (data.data == 1) {
                        $scope.$parent.ShowAlert('Success', 'Supplier ' + LIST[0].SUPPLIER_NAME + ' Add Successfully ', 5000);
                        $scope.RESET_SUPPLIER();
                        $scope.GET_PYMNT_CRUCIAL_SUPPLIERS_PAID_VS_OUTSTANDING();
                    }
                    if (data.data == 0) {
                        $scope.$parent.ShowAlert('Error', $scope.$parent.SOMETHINGWENTWRONG, 5000);
                    }
                })
            }
            else {
                $scope.$parent.ShowAlert('Error', "Invalid supplier,please select correct supplier", 5000);
            }
        }
    }
    $scope.DELTETE_SUPPLIERS = function (LINE) {
        if (confirm('Are you sure?')) {
            PaymentModelObj = new Object();
            PaymentModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            PaymentModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PaymentModelObj.XERO_CONTACT_ID = LINE.XERO_CONTACT_ID;
            PaymentModelObj.BRANCH_ID = $scope.DashboardSearch.BRANCH_LOGIN_ID;
            PaymentModelObj.DELETE_FLAG = 1;
            PrcCommMethods.PAYMENT_API(PaymentModelObj, 'INS_UPD_XERO_CRUCIAL_SUPPLIERS').then(function (data) {
                if (data.data == 1) {
                    $scope.GET_PYMNT_CRUCIAL_SUPPLIERS_PAID_VS_OUTSTANDING();
                }
                if (data.data == 0) {
                    $scope.$parent.ShowAlert('Error', $scope.$parent.SOMETHINGWENTWRONG, 5000);
                }
            })
        }
    }

});
