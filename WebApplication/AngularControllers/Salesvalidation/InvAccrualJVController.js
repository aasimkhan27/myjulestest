app.controller('InvAccrualJVController', function ($scope, $http, $interval, CommService, $cookies, $filter, PrcCommMethods, $location, readFileData, $localStorage) {
    $(".tooltip").remove();
    $scope.STATUS_LIST = [{ ID: 1, NAME: 'Matched', class: 'badge-success', check: false }, { ID: 0, NAME: 'Missing in Xero', class: 'badge-light-purple', check: false }, { ID: 7, NAME: 'Probable', class: 'badge-light-orange', check: false }, { ID: 8, NAME: 'Manual', class: 'badge-light-green', check: false }];
    $scope.HIDE_SHOW_HEADER_FILTER = true;
    $scope.Inv_recon_Search = {
        PAGE_TITLE: "ACCRUAL JV",
        STATUS_NAME: "",
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        PAGE_NO_ID: 1,
        PAGE_SIZE_ID: 10,
        UploadedFiles: [],
        INTEGRATION_SYSTEM_ID: 25,
        UPLOADE_TYPE_ID: 29,
        ENTITY_ID: parseInt($cookies.get("ENTITY_ID")),
        FILTER_STATUS_ID: null,
        FILTER_CONTACT_ALL: 'All',
        CUSTOM_STEP_NO: 5,
        ID: getUrlParameter('HEADER_ID', $location.absUrl())
    }
    $scope.RESET_RECO_UPLOAD = function () {
        $scope.COPY_CODE_ARRY = [];
        $scope.CODE_ARRY = [];
        $scope.INVALID_EXCLE_CELL_COUNT = null;
        $scope.INV_RECO_UPLOAD_DETAILS_LIST = [];
        $scope.DUPLICATE_INVOICE_CONTACT_LIST = [];
        $scope.ERROR_LIST = [];
        $scope.INVALID_EXCLE_CELL_FLAG = false;
        $scope.Inv_recon_Search = {
            PAGE_NO: 1,
            PAGE_SIZE: 10,
            PAGE_NO_ID: 1,
            PAGE_SIZE_ID: 10,
            UploadedFiles: [],
            INTEGRATION_SYSTEM_ID: 25,
            UPLOADE_TYPE_ID: 29,
            ID: getUrlParameter('HEADER_ID', $location.absUrl())
        }
        UploadstartDate = moment().subtract(1, 'days');//moment().startOf('isoWeek');//moment().subtract(6, 'days');
        UploadendDate = moment().subtract(1, 'days'); //moment().subtract(0, 'days');
        $scope.$parent.SetUpDateRangeMultiDatePicker('reportrange', UploadstartDate, UploadendDate, reportrange);
        $('#reportrange span').html(UploadstartDate.format($scope.$parent.Datelocaleformat.format) + ' - ' + UploadendDate.format($scope.$parent.Datelocaleformat.format));
        angular.element("input[id=Inv_recorduploadExcel1]").val(null);
    }
    $scope.HEADER_ID = getUrlParameter('HEADER_ID', $location.absUrl());
    $scope.BRANCH_LIST = JSON.parse($localStorage.BRANCH_LOGIN_LIST);
    $scope.BRANCH_LIST_VIEW = angular.copy($scope.BRANCH_LIST);
    if ($scope.BRANCH_LIST.length > 0) {
        $scope.Inv_recon_Search.BRANCH_ID = $scope.BRANCH_LIST[0].BRANCH_ID;
    }


    $scope.FilterInvRecListByStatus = function (InvRow) {
        //Status Check
        statuscount = 0;
        anystatuscheck = false;
        for (var i = 0; i < $scope.STATUS_LIST.length; i++) {
            $scope.STATUS_LIST[i].check == true ? anystatuscheck = true : null;
            if ($scope.STATUS_LIST[i].check == true && $scope.STATUS_LIST[i].ID == InvRow.FILTER_STATUS_ID) {
                statuscount++;
                break;
            }
        }
        statuscount == 0 && !anystatuscheck ? statuscount++ : null;
        //Upload Cat
        //Xero Category
        //Contact
        if (statuscount != 0) {
            return InvRow;
        }
    }
    $scope.FilterInvRecListByUCategory = function (InvRow) {
        //Upload Cat
        upld_cat_count = 0;
        anyupldcatcheck = false;
        for (var i = 0; i < $scope.CATEGORY_MASTER_LIST.length; i++) {
            $scope.CATEGORY_MASTER_LIST[i].UPLOATED_CATE == true ? anyupldcatcheck = true : null;
            if ($scope.CATEGORY_MASTER_LIST[i].UPLOATED_CATE && $scope.CATEGORY_MASTER_LIST[i].ID == InvRow.CATEGORY_MASTER_ID) {
                upld_cat_count++;
                break;
            };
        }
        upld_cat_count == 0 && !anyupldcatcheck ? upld_cat_count++ : null;

        if (upld_cat_count != 0) {
            return InvRow;
        }
    }
    $scope.FilterInvRecListByXCategory = function (InvRow) {
        //Xero Category
        Xero_cat_count = 0;
        anyXerocatcheck = false;
        for (var i = 0; i < $scope.CATEGORY_MASTER_LIST.length; i++) {
            $scope.CATEGORY_MASTER_LIST[i].XERO_CATE == true ? anyXerocatcheck = true : null;
            if ($scope.CATEGORY_MASTER_LIST[i].XERO_CATE && $scope.CATEGORY_MASTER_LIST[i].ID == InvRow.XERO_CATEGORY_MASTER_ID) {
                Xero_cat_count++;
                break;
            };
        }
        Xero_cat_count == 0 && !anyXerocatcheck ? Xero_cat_count++ : null;
        if (Xero_cat_count != 0) {
            return InvRow;
        }
    }
    $scope.FilterInvRecListByXContact = function (InvRow) {
        //Xero  Contact
        XeroC_cat_count = 0;
        anyXeroCcatcheck = false;
        for (var i = 0; i < $scope.INV_RECO_RECONCILE_LIST.length; i++) {
            $scope.INV_RECO_RECONCILE_LIST[i].IS_CONTACT_FIL == true ? anyXeroCcatcheck = true : null;
            if ($scope.INV_RECO_RECONCILE_LIST[i].IS_CONTACT_FIL && $scope.INV_RECO_RECONCILE_LIST[i].XERO_CONTACT_NAME == InvRow.XERO_CONTACT_NAME) {
                XeroC_cat_count++;
                break;
            };
        }
        XeroC_cat_count == 0 && !anyXeroCcatcheck ? XeroC_cat_count++ : null;
        if (XeroC_cat_count != 0) {
            return InvRow;
        }
    }
    $scope.FilterInvoiceListByStatus = function (InvRow) {

        return InvRow.STATUS_ID == 1 || InvRow.STATUS_ID == 7 || InvRow.STATUS_ID == 8;
    }
    $scope.FilterInvRecValueVariance = function (InvRow) {
        //food
        Variance_count = 0;
        anyVariancecheck = false;
        for (var i = 0; i < $scope.UNIQUE_INV_RECO_RECONCILE_LIST.length; i++) {
            $scope.Inv_recon_Search.IS_VAL_VARIANCE_FOOD == true || $scope.Inv_recon_Search.IS_VAL_VARIANCE_DRINK == true || $scope.Inv_recon_Search.IS_VAL_VARIANCE_WINE == true || $scope.Inv_recon_Search.IS_VAL_VARIANCE_TOBACCO == true || $scope.Inv_recon_Search.IS_VAL_VARIANCE_OTHERS == true ? anyVariancecheck = true : null;
            if ($scope.Inv_recon_Search.IS_VAL_VARIANCE_FOOD && InvRow.CATEGORY_MASTER_ID == 1 && InvRow.MATCH_TYPE != 0) {
                Variance_count++;
                break;
            };
            if ($scope.Inv_recon_Search.IS_VAL_VARIANCE_DRINK && InvRow.CATEGORY_MASTER_ID == 2 && InvRow.MATCH_TYPE != 0) {
                Variance_count++;
                break;
            };
            if ($scope.Inv_recon_Search.IS_VAL_VARIANCE_WINE && InvRow.CATEGORY_MASTER_ID == 3 && InvRow.MATCH_TYPE != 0) {
                Variance_count++;
                break;
            };
            if ($scope.Inv_recon_Search.IS_VAL_VARIANCE_TOBACCO && InvRow.CATEGORY_MASTER_ID == 4 && InvRow.MATCH_TYPE != 0) {
                Variance_count++;
                break;
            };
            if ($scope.Inv_recon_Search.IS_VAL_VARIANCE_OTHERS && InvRow.CATEGORY_MASTER_ID == 5 && InvRow.MATCH_TYPE != 0) {
                Variance_count++;
                break;
            };
        }

        Variance_count == 0 && !anyVariancecheck ? Variance_count++ : null;
        if (Variance_count != 0) {
            return InvRow;
        }
    }


    $scope.INV_RECO_CONTACT_MAPPING_LIST = [];
    $scope.GET_INV_RECO_CONTACT_MAPPING = function (HEADER_DTLS) {
        var CustmObj = new Object();
        CustmObj.HEADER_ID = HEADER_DTLS.ID;
        PrcCommMethods.CASHUP_API(CustmObj, 'GET_INV_RECO_CONTACT_MAPPING').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.INV_RECO_CONTACT_MAPPING_LIST = data.data.Table;
            }
        });
    }
    $scope.XERO_INVOICES_FOR_INV_RECO_LIST = [];

    $scope.GET_XERO_INVOICES_FOR_INV_RECO_PAGE_LOAD = function () {
        $scope.XERO_INVOICES_FOR_INV_RECO_PAGE_LOAD_LIST = [];
        var CustmObj = new Object();
        CustmObj.FROM_DATE = $scope.Inv_recon_Search.FROM_DATE
        CustmObj.TO_DATE = $scope.Inv_recon_Search.TO_DATE
        CustmObj.ENTITY_ID = $scope.INV_RECO_RECONCILE_HEADER_DTLS.ENTITY_ID;
        CustmObj.BRANCH_ID = $scope.INV_RECO_RECONCILE_HEADER_DTLS.BRANCH_ID;
        PrcCommMethods.CASHUP_API(CustmObj, 'GET_XERO_INVOICES_FOR_INV_RECO').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.XERO_INVOICES_FOR_INV_RECO_PAGE_LOAD_LIST = data.data.Table;
            }
        });
    }

    $scope.GET_XERO_INVOICES_FOR_INV_RECO = function (RECON_DTLS) {
        $scope.XERO_INVOICES_FOR_INV_RECO_LIST = [];
        var CustmObj = new Object();
        if (RECON_DTLS == undefined) {
            $scope.Inv_recon_Search.MATCH_CONTACT_ID = null;
            var supplierdtls = $scope.XERO_CONTACTS_LIST.filter(function (x) { return x.CONTACT_NAME == $scope.Inv_recon_Search.MATCH_CONTACT_NAME });
            if (supplierdtls.length > 0) {
                $scope.Inv_recon_Search.MATCH_CONTACT_ID = supplierdtls[0].XERO_CONTACT_ID;
            }
        }
        CustmObj.FROM_DATE = $scope.Inv_recon_Search.MATCH_FROM_DATE
        CustmObj.TO_DATE = $scope.Inv_recon_Search.MATCH_TO_DATE
        CustmObj.ENTITY_ID = $scope.INV_RECO_RECONCILE_HEADER_DTLS.ENTITY_ID;
        CustmObj.BRANCH_ID = $scope.INV_RECO_RECONCILE_HEADER_DTLS.BRANCH_ID;
        CustmObj.XERO_CONTACT_ID = $scope.Inv_recon_Search.MATCH_CONTACT_ID;
        PrcCommMethods.CASHUP_API(CustmObj, 'GET_XERO_INVOICES_FOR_INV_RECO').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.XERO_INVOICES_FOR_INV_RECO_LIST = data.data.Table;
                $('#InvList').modal("show");
            }
            else {
                $('#InvList').modal("show");
            }
        });

    }


    $scope.SELECTED_INVOICE_ID = 0;
    $scope.INV_RECO_JOURNALS = [];
    $scope.INV_RECO_JOURNALS_LIST = [];
    $scope.GET_INV_RECO_JOURNALS = function (HEADER_DTLS) {
        $scope.$parent.overlay_loadingNew = 'block';
        var CustmObj = new Object();
        CustmObj.HEADER_ID = HEADER_DTLS.ID;
        CustmObj.TYPE_ID = 1;
        PrcCommMethods.CASHUP_API(CustmObj, 'GET_INV_RECO_JOURNALS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.INV_RECO_JOURNALS_HEADER_DTLS = data.data.Table[0];

                $scope.INV_RECO_JOURNALS_LIST = data.data.Table1;
                $scope.$parent.STEP_PROCESS(data.data.Table[0].STEP_NO);

                //$scope.Inv_recon_Search.CREATED_DATE = data.data.Table[0].CREATED_DATE;
                //$scope.Inv_recon_Search.EMAIL = data.data.Table[0].EMAIL;
                //$scope.Inv_recon_Search.ENTITY_NAME = data.data.Table[0].ENTITY_NAME;
                //$scope.Inv_recon_Search.NAME = data.data.Table[0].NAME;
                //$scope.Inv_recon_Search.BRANCH_NAME = data.data.Table[0].BRANCH_NAME;
                //$scope.Inv_recon_Search.FROM_DATE = data.data.Table[0].FROM_DATE;
                //$scope.Inv_recon_Search.TO_DATE = data.data.Table[0].TO_DATE;
                //$scope.Inv_recon_Search.RECORD_COUNT = data.data.Table[0].RECORD_COUNT;
                $scope.$parent.overlay_loadingNew = 'none';
            }
            else {
                $scope.$parent.overlay_loadingNew = 'none';
            }
        });
    }

    $scope.CATEGORY_MASTER_LIST = [];

    $scope.GET_CATEGORY_MASTER = function () {
        var CustmObj = new Object();
        CustmObj.ENTITY_ID = $scope.INV_RECO_RECONCILE_HEADER_DTLS.ENTITY_ID;
        CustmObj.BRANCH_ID = $scope.INV_RECO_RECONCILE_HEADER_DTLS.BRANCH_ID;
        PrcCommMethods.ADMIN_API(CustmObj, 'GET_CATEGORY_MASTER').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.CATEGORY_MASTER_LIST = data.data.Table;
            }
        });
    };
    $scope.GET_CATEGORY_MASTER();
    $scope.INV_RECO_UPLOAD_HEADER_BY_ID_LIST = [];
    $scope.GET_INV_RECO_UPLOAD_HEADER_BY_ID = function (HEADER_ID) {
        var CustmObj = new Object();
        CustmObj.HEADER_ID = HEADER_ID;
        PrcCommMethods.CASHUP_API(CustmObj, 'GET_INV_RECO_UPLOAD_HEADER_BY_ID').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.INV_RECO_UPLOAD_HEADER_BY_ID_LIST = (data.data.Table);
                if (data.data.Table.length > 0) {
                    $scope.Inv_recon_Search.STEP_NO = data.data.Table[0].STEP_NO;
                    $scope.Inv_recon_Search.CREATED_DATE = data.data.Table[0].CREATED_DATE;
                    $scope.Inv_recon_Search.EMAIL = data.data.Table[0].EMAIL;
                    $scope.Inv_recon_Search.ENTITY_NAME = data.data.Table[0].ENTITY_NAME;
                    $scope.Inv_recon_Search.NAME = data.data.Table[0].NAME;
                    $scope.Inv_recon_Search.BRANCH_NAME = data.data.Table[0].BRANCH_NAME;
                    $scope.Inv_recon_Search.FROM_DATE = data.data.Table[0].FROM_DATE;
                    $scope.Inv_recon_Search.TO_DATE = data.data.Table[0].TO_DATE;
                    $scope.Inv_recon_Search.RECORD_COUNT = data.data.Table[0].RECORD_COUNT;
                    $scope.Inv_recon_Search.STATUS_ID = data.data.Table[0].STATUS_ID;
                    $scope.Inv_recon_Search.STATUS_NAME = data.data.Table[0].STATUS_NAME;
                    $scope.$parent.STEP_PROCESS($scope.Inv_recon_Search.STEP_NO);
                    $('#reportrange span').html($filter('date')(new Date($scope.Inv_recon_Search.FROM_DATE)) + ' - ' + $filter('date')(new Date($scope.Inv_recon_Search.TO_DATE)));
                }
                $scope.Inv_recon_Search.BRANCH_ID = (data.data.Table[0].BRANCH_ID);
                data.data.Table[0].ID = $scope.HEADER_ID;
                $scope.GET_INV_RECO_JOURNALS(data.data.Table[0]);
            }
        });
    };

    $scope.GET_INV_RECO_UPLOAD_HEADER_BY_ID($scope.HEADER_ID);

    $scope.CREATE_INV_RECO_JV = function () {
        if ($scope.Inv_recon_Search.STATUS_ID != 63) {
            var count = 0;
            var CustmObj = new Object();
            CustmObj.JV_HEADER_ID = $scope.JV_HEADER_ID;
            CustmObj.HEADER_ID = $scope.HEADER_ID;
            CustmObj.USER_ID = parseInt($cookies.get("USERID"));
            CustmObj.JV_TYPE_ID = 1;//-- 1 FOR ACCRUAL ,2 FOR PREPAYMENT
            CustmObj.INV_RECO_JV_LINE_TYPE = [];
            angular.forEach($scope.INV_RECO_INVOICE_FOR_PRE_PAYMENT_LIST, function (x) {
                if (x.IS_SELECTED) {
                    var readonly = new Object();
                    readonly.LINE_TABLE_ID = x.LINE_TABLE_ID;
                    readonly.XERO_INVOICE_ID = x.XERO_INVOICE_ID;
                    readonly.XERO_CATEGORY_MASTER_ID = x.XERO_CATEGORY_MASTER_ID;
                    readonly.CATEGORY_MASTER_ID = x.CATEGORY_MASTER_ID;
                    readonly.XERO_ACCOUNT_CODE = x.XERO_ACCOUNT_CODE;
                    readonly.VARIANCE = x.VARIANCE;
                    CustmObj.INV_RECO_JV_LINE_TYPE.push(readonly);
                    count = 1;
                }
            });
            if (count > 0) {
                PrcCommMethods.CASHUP_API(CustmObj, 'CREATE_INV_RECO_JV').then(function (data) {
                    if (data.data == 1) {
                        $scope.$parent.STEP_PROCESS(data.data.Table[0].STEP_NO);
                        data.data.Table[0].ID = $scope.HEADER_ID;
                        $scope.$parent.INV_REC_PAGE_LOAD(data.data.Table[0]);
                    }
                });
            }
        }
        else {
            var obj = new Object();
            obj.STEP_NO = 7;
            obj.ID = $scope.HEADER_ID;
            $scope.$parent.STEP_PROCESS(obj.STEP_NO);
            $scope.$parent.INV_REC_PAGE_LOAD(obj);
        }
    }


    $scope.NEXT_STEP = function () {
        $location.path('InvRec_PrepaymentStp').search('HEADER_ID', $scope.HEADER_ID);
    }
    //1 ext 0 miss


    $scope.$on('ngRepeatFinishedRender', function (ngRepeatFinishedEvent) {
        $scope.COMMON_CODE_CHANGE();
    });

    function reportrange(startDate, endDate) {
        $scope.Inv_recon_Search.FROM_DATE = startDate.format($scope.$parent.Datelocaleformat.format);
        $scope.Inv_recon_Search.TO_DATE = endDate.format($scope.$parent.Datelocaleformat.format);
        $('#reportrange span').html(startDate.format($scope.$parent.Datelocaleformat.format) + ' - ' + endDate.format($scope.$parent.Datelocaleformat.format));

    };
    function reportrangeMatchInvoice(startDate, endDate) {
        $scope.Inv_recon_Search.MATCH_FROM_DATE = startDate.format($scope.$parent.Datelocaleformat.format);
        $scope.Inv_recon_Search.MATCH_TO_DATE = endDate.format($scope.$parent.Datelocaleformat.format);
        $('#reportrangeMathInvoice span').html(startDate.format($scope.$parent.Datelocaleformat.format) + ' - ' + endDate.format($scope.$parent.Datelocaleformat.format));
    };
    function reportrangeCoverView(startDate, endDate) {
        $scope.Inv_recon_Search.UPLOAD_DATE_START = startDate.format($scope.$parent.Datelocaleformat.format);
        $scope.Inv_recon_Search.UPLOAD_DATE_END = endDate.format($scope.$parent.Datelocaleformat.format);
        $('#reportrangeInvRecView span').html(startDate.format($scope.$parent.Datelocaleformat.format) + ' - ' + endDate.format($scope.$parent.Datelocaleformat.format));
    };

    $scope.NG_PAGE_LOAD = function () {

        startDate = moment().startOf('month');//moment().startOf('isoWeek');//moment().subtract(6, 'days');
        endDate = moment().endOf('month'); //moment().subtract(0, 'days');
        UploadstartDate = moment().subtract(1, 'days');//moment().startOf('isoWeek');//moment().subtract(6, 'days');
        UploadendDate = moment().subtract(1, 'days'); //moment().subtract(0, 'days');

        $scope.$parent.SetUpDateRangeMultiDatePicker('reportrange', UploadstartDate, UploadendDate, reportrange);
        $scope.$parent.SetUpDateRangeMultiDatePicker('reportrangeInvRecView', startDate, endDate, reportrangeCoverView);
        $scope.$parent.SetUpDateRangeMultiDatePicker('reportrangeMathInvoice', startDate, endDate, reportrangeMatchInvoice);

        $('#reportrange span').html(UploadstartDate.format($scope.$parent.Datelocaleformat.format) + ' - ' + UploadendDate.format($scope.$parent.Datelocaleformat.format));
        $('#reportrangeInvRecView span').html(startDate.format($scope.$parent.Datelocaleformat.format) + ' - ' + endDate.format($scope.$parent.Datelocaleformat.format));
        //$('#reportrangeMathInvoice span').html(startDate.format($scope.$parent.Datelocaleformat.format) + ' - ' + endDate.format($scope.$parent.Datelocaleformat.format));
    }
    $scope.NG_PAGE_LOAD();
    $scope.HIDE_SHOW_FILTER_FY = function () {
        $scope.HIDE_SHOW_HEADER_FILTER = !$scope.HIDE_SHOW_HEADER_FILTER;
    }

    $scope.BACK_RECO = function () {
        window.location.href = '../Payment/SalesIndex#!/InvRec_List';
    }
    $scope.$parent.child_scope = $scope;
    $scope.COMMON_CODE_CHANGE();

});