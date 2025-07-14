app.controller('InvAccrualSetupController', function ($scope, $http, $interval, CommService, $cookies, $filter, PrcCommMethods, $location, readFileData, $localStorage) {
    $(".tooltip").remove();
    $scope.STATUS_LIST = [{ ID: 1, NAME: 'Matched', class: 'badge-success', check: false }, { ID: 0, NAME: 'Missing in Xero', class: 'badge-light-purple', check: false }, { ID: 7, NAME: 'Probable', class: 'badge-light-orange', check: false }, { ID: 8, NAME: 'Manual', class: 'badge-light-green', check: false }];
    $scope.Inv_recon_Search = {
        PAGE_TITLE: "ACCRUAL SETUP",
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
        CUSTOM_STEP_NO: 4,
        STEP_NO: 4,
        ID: getUrlParameter('HEADER_ID', $location.absUrl()),
        UPLOADED_CAT_COUNT: 0,
        XERO_CAT_COUNT: 0,
        XERO_CONTACT_COUNT: 0,
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
            STEP_NO: 1,
            ID: getUrlParameter('HEADER_ID', $location.absUrl()),
            JV_HEADER_DETAILS: []
        }
        UploadstartDate = moment().subtract(1, 'days');//moment().startOf('isoWeek');//moment().subtract(6, 'days');
        UploadendDate = moment().subtract(1, 'days'); //moment().subtract(0, 'days');
        $scope.$parent.SetUpDateRangeMultiDatePicker('reportrange', UploadstartDate, UploadendDate, reportrange);
        $('#reportrange span').html(UploadstartDate.format($scope.$parent.Datelocaleformat.format) + ' - ' + UploadendDate.format($scope.$parent.Datelocaleformat.format));
        angular.element("input[id=Inv_recorduploadExcel1]").val(null);
    }
    $scope.INV_RECO_INVOICE_FOR_ACCRUAL = [];
    $scope.BRANCH_LIST = JSON.parse($localStorage.BRANCH_LOGIN_LIST);
    $scope.BRANCH_LIST_VIEW = angular.copy($scope.BRANCH_LIST);
    if ($scope.BRANCH_LIST.length > 0) { $scope.Inv_recon_Search.BRANCH_ID = $scope.BRANCH_LIST[0].BRANCH_ID; }

    $scope.HEADER_ID = getUrlParameter('HEADER_ID', $location.absUrl());
    $scope.STATUS_LIST = [{ ID: 1, NAME: 'Matched', class: 'badge-success', check: false }, { ID: 0, NAME: 'Missing in Xero', class: 'badge-light-purple', check: false }, { ID: 7, NAME: 'Probable', class: 'badge-light-orange', check: false }, { ID: 8, NAME: 'Manual', class: 'badge-light-green', check: false }];
    $scope.HIDE_SHOW_HEADER_FILTER = true;

    //$scope.FilterInvRecListByStatus = function (InvRow) {
    //    //Status Check
    //    statuscount = 0;
    //    anystatuscheck = false;
    //    for (var i = 0; i < $scope.STATUS_LIST.length; i++) {
    //        $scope.STATUS_LIST[i].check == true ? anystatuscheck = true : null;
    //        if ($scope.STATUS_LIST[i].check == true && $scope.STATUS_LIST[i].ID == InvRow.FILTER_STATUS_ID) {
    //            statuscount++;
    //            break;
    //        }
    //    }
    //    statuscount == 0 && !anystatuscheck ? statuscount++ : null;
    //    //Upload Cat
    //    //Xero Category
    //    //Contact
    //    if (statuscount != 0) {
    //        return InvRow;
    //    }
    //}
    $scope.FilterInvRecListByUCategory = function (InvRow, FLAG, BolALL) {
        //Upload Cat
        upld_cat_count = 0;
        anyupldcatcheck = false;
        for (var i = 0; i < $scope.CATEGORY_MASTER_LIST.length; i++) {
            $scope.CATEGORY_MASTER_LIST[i].UPLOATED_CATE == true ? anyupldcatcheck = true : null;
            if ($scope.CATEGORY_MASTER_LIST[i].UPLOATED_CATE && $scope.CATEGORY_MASTER_LIST[i].ID == InvRow.CATEGORY_MASTER_ID) {
                upld_cat_count++;
                if (FLAG == InvRow.MATCH_TYPE) {
                    InvRow.IS_SELECTED = $scope.Inv_recon_Search.IS_MISSING_VARIANCE_XERO;
                }
                break;
            };
        }
        upld_cat_count == 0 && !anyupldcatcheck ? upld_cat_count++ : null;
        if (upld_cat_count != 0) {
            return InvRow;
        }
    }
    $scope.FilterInvRecListByXCategory = function (InvRow, FLAG, BolALL) {
        //Xero Category
        Xero_cat_count = 0;
        anyXerocatcheck = false;
        for (var i = 0; i < $scope.CATEGORY_MASTER_LIST.length; i++) {
            $scope.CATEGORY_MASTER_LIST[i].XERO_CATE == true ? anyXerocatcheck = true : null;
            if ($scope.CATEGORY_MASTER_LIST[i].XERO_CATE && $scope.CATEGORY_MASTER_LIST[i].ID == InvRow.XERO_CATEGORY_MASTER_ID) {
                Xero_cat_count++;
                if (FLAG == InvRow.MATCH_TYPE) {
                    InvRow.IS_SELECTED = $scope.Inv_recon_Search.IS_MISSING_VARIANCE_XERO;
                }
                break;
            };
        }
        Xero_cat_count == 0 && !anyXerocatcheck ? Xero_cat_count++ : null;
        if (Xero_cat_count != 0) {
            return InvRow;
        }
    }
    $scope.FilterInvRecListByXContact = function (InvRow, FLAG, BolALL) {
        //Xero  Contact
        XeroC_cat_count = 0;
        anyXeroCcatcheck = false;
        for (var i = 0; i < $scope.INV_RECO_INVOICE_FOR_ACCRUAL.length; i++) {
            $scope.INV_RECO_INVOICE_FOR_ACCRUAL[i].IS_CONTACT_FIL == true ? anyXeroCcatcheck = true : null;
            if ($scope.INV_RECO_INVOICE_FOR_ACCRUAL[i].IS_CONTACT_FIL && $scope.INV_RECO_INVOICE_FOR_ACCRUAL[i].XERO_CONTACT_NAME == InvRow.XERO_CONTACT_NAME) {
                XeroC_cat_count++;
                if (FLAG == InvRow.MATCH_TYPE) {
                    InvRow.IS_SELECTED = $scope.Inv_recon_Search.IS_MISSING_VARIANCE_XERO;
                }
                break;
            };
        }
        XeroC_cat_count == 0 && !anyXeroCcatcheck ? XeroC_cat_count++ : null;
        if (XeroC_cat_count != 0) {
            return InvRow;
        }
    }

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
                    $scope.Inv_recon_Search.ID = HEADER_ID;
                    $scope.Inv_recon_Search.STATUS_ID = data.data.Table[0].STATUS_ID;
                    $scope.Inv_recon_Search.STATUS_NAME = data.data.Table[0].STATUS_NAME;
                    $scope.Inv_recon_Search.Table1 = data.data.Table1[0];//Current JV Header details 
                    $scope.$parent.STEP_PROCESS($scope.Inv_recon_Search.STEP_NO);
                    $('#reportrange span').html($filter('date')(new Date($scope.Inv_recon_Search.FROM_DATE)) + ' - ' + $filter('date')(new Date($scope.Inv_recon_Search.TO_DATE)));
                    $scope.Inv_recon_Search.JV_HEADER_DETAILS = data.data.Table1.filter(function (x) { return x.TYPE_ID == 1 });
                }
                $scope.GET_INV_RECO_INVOICE_FOR_ACCRUAL();
            }
        });
    };
    $scope.GET_INV_RECO_INVOICE_FOR_ACCRUAL = function () {
        var CustmObj = new Object();
        CustmObj.HEADER_ID = $scope.HEADER_ID;
        CustmObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.CASHUP_API(CustmObj, 'GET_INV_RECO_INVOICE_FOR_ACCRUAL').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.INV_RECO_INVOICE_FOR_ACCRUAL = data.data.Table;
                //TABLE 2 Current jv accural stp Header details 
                // JV HEADER ID >0 AND IS_JV_FLAG==0 Say Old Posted JV
                // JV HEADER ID >0 AND IS_JV_FLAG==1 Say  New Posted JV
            }
        });
    }
    $scope.GET_INV_RECO_UPLOAD_HEADER_BY_ID($scope.HEADER_ID);

    $scope.CATEGORY_MASTER_LIST = [];
    $scope.GET_CATEGORY_MASTER = function () {
        var CustmObj = new Object();
        CustmObj.ENTITY_ID = $scope.Inv_recon_Search.ENTITY_ID;
        CustmObj.BRANCH_ID = $scope.Inv_recon_Search.BRANCH_ID;
        PrcCommMethods.ADMIN_API(CustmObj, 'GET_CATEGORY_MASTER').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.CATEGORY_MASTER_LIST = data.data.Table;
            }
        });
    };
    $scope.GET_CATEGORY_MASTER();



    $scope.CREATE_INV_RECO_STP = function () {
        if ($scope.Inv_recon_Search.STATUS_ID != 63) {
            var count = 0;
            var CustmObj = new Object();
            CustmObj.JV_HEADER_ID = $scope.Inv_recon_Search.JV_HEADER_DETAILS == undefined || $scope.Inv_recon_Search.JV_HEADER_DETAILS == "" || $scope.Inv_recon_Search.JV_HEADER_DETAILS == null || $scope.Inv_recon_Search.JV_HEADER_DETAILS.length == 0 ? null : $scope.Inv_recon_Search.JV_HEADER_DETAILS[0].JV_HEADER_ID;
            CustmObj.HEADER_ID = $scope.HEADER_ID;
            CustmObj.USER_ID = parseInt($cookies.get("USERID"));
            CustmObj.JV_TYPE_ID = 1;//-- 1 FOR ACCRUAL ,2 FOR PREPAYMENT
            CustmObj.INV_RECO_JV_LINE_TYPE = [];
            CustmObj.SKIP = 0;
            angular.forEach($scope.INV_RECO_INVOICE_FOR_ACCRUAL, function (x) {
                if (x.IS_SELECTED) {
                    var readonly = new Object();
                    readonly.LINE_TABLE_ID = x.LINE_TABLE_ID;
                    readonly.XERO_INVOICE_ID = x.XERO_INVOICE_ID;
                    readonly.XERO_CATEGORY_MASTER_ID = x.XERO_CATEGORY_MASTER_ID;
                    readonly.CATEGORY_MASTER_ID = x.CATEGORY_MASTER_ID;
                    readonly.XERO_ACCOUNT_CODE = x.XERO_ACCOUNT_CODE;
                    readonly.VARIANCE = parseFloat(x.VARIANCE).toFixed(5);
                    CustmObj.INV_RECO_JV_LINE_TYPE.push(readonly);
                    count = 1;
                }
            });
            if (count == 0) {
                var readonly = new Object();
                readonly.LINE_TABLE_ID = -1;
                readonly.XERO_INVOICE_ID = -1;
                readonly.XERO_CATEGORY_MASTER_ID = -1;
                readonly.CATEGORY_MASTER_ID = -1;
                readonly.XERO_ACCOUNT_CODE = -1;
                readonly.VARIANCE = -1;
                CustmObj.INV_RECO_JV_LINE_TYPE.push(readonly);
                CustmObj.SKIP = 1;//--0,1 jv zero creation 1 for skip and -1 view only
            };
            PrcCommMethods.CASHUP_API(CustmObj, 'CREATE_INV_RECO_JV').then(function (data) {
                if (data.data == 1) {
                    var obj = new Object();
                    obj.STEP_NO = 5;
                    obj.ID = $scope.HEADER_ID;
                    $scope.$parent.STEP_PROCESS(obj.STEP_NO);
                    $scope.$parent.INV_REC_PAGE_LOAD(obj);
                };
            });
        }
        else {
            var obj = new Object();
            obj.STEP_NO = 5;
            obj.ID = $scope.HEADER_ID;
            $scope.$parent.STEP_PROCESS(obj.STEP_NO);
            $scope.$parent.INV_REC_PAGE_LOAD(obj);
        }
    }
    $scope.$on('ngRepeatFinishedRender', function (ngRepeatFinishedEvent) {
        $scope.COMMON_CODE_CHANGE();
    });

    function reportrangeMatchInvoice(startDate, endDate) {
        $scope.Inv_recon_Search.MATCH_FROM_DATE = startDate.format($scope.$parent.Datelocaleformat.format);
        $scope.Inv_recon_Search.MATCH_TO_DATE = endDate.format($scope.$parent.Datelocaleformat.format);
        $('#reportrangeMathInvoice span').html(startDate.format($scope.$parent.Datelocaleformat.format) + ' - ' + endDate.format($scope.$parent.Datelocaleformat.format));
    };

    $scope.NG_PAGE_LOAD = function () {

        startDate = moment().startOf('month');//moment().startOf('isoWeek');//moment().subtract(6, 'days');
        endDate = moment().endOf('month'); //moment().subtract(0, 'days');
        UploadstartDate = moment().subtract(1, 'days');//moment().startOf('isoWeek');//moment().subtract(6, 'days');
        UploadendDate = moment().subtract(1, 'days'); //moment().subtract(0, 'days');
        $scope.$parent.SetUpDateRangeMultiDatePicker('reportrangeInvRecView', startDate, endDate, reportrangeMatchInvoice);
        $('#reportrangeInvRecView span').html(startDate.format($scope.$parent.Datelocaleformat.format) + ' - ' + endDate.format($scope.$parent.Datelocaleformat.format));

    }
    $scope.NG_PAGE_LOAD();
    $scope.HIDE_SHOW_FILTER_FY = function () {
        $scope.HIDE_SHOW_HEADER_FILTER = !$scope.HIDE_SHOW_HEADER_FILTER;
    }
    $scope.INV_UPLOAD_FILE_DETAILS_FY = function (INV) {
        $location.path('Inv_Upload_File').search({ HEADER_ID: INV.ID })
    }


    $scope.UNDOW_MISSING_IN_XERO = function (MATCH_TYPE) {
        $scope.INV_RECO_INVOICE_FOR_ACCRUAL.filter(function (val) {
            val.IS_SELECTED = false;
            if (val.MATCH_TYPE == MATCH_TYPE && val.JV_HEADER_ID > 0 && val.IS_JV_FLAG == 1) {
                val.IS_SELECTED = true;
            }
        })
        $scope.SET_CHECKBOX_MISSING_IS_XERO_LINE(MATCH_TYPE)
    }
    $scope.SET_CHECKBOX_MISSING_IS_XERO_HEADER = function (MATCH_TYPE) {
        $scope.Inv_recon_Search.IS_MISSING_VARIANCE_XERO = false;
        var Boolcount = ($scope.Inv_recon_Search.UPLOADED_CAT_COUNT == 0 && $scope.Inv_recon_Search.XERO_CAT_COUNT == 0 && $scope.Inv_recon_Search.XERO_CONTACT_COUNT == 0) == true ? true : false;
        if (MATCH_TYPE == 0) {
            $scope.Inv_recon_Search.IS_MISSING_VARIANCE_XERO = $scope.Inv_recon_Search.IS_MISSING_IS_XERO;
        } else {
            $scope.Inv_recon_Search.IS_MISSING_VARIANCE_XERO = $scope.Inv_recon_Search.IS_VALUE_VARIANCE;
        }

        angular.forEach($scope.INV_RECO_INVOICE_FOR_ACCRUAL.filter(function (x) { return MATCH_TYPE == 0 ? x.MATCH_TYPE == MATCH_TYPE : x.MATCH_TYPE != 0 }), function (val) {
            if (Boolcount) {
                val.IS_SELECTED = $scope.Inv_recon_Search.IS_MISSING_VARIANCE_XERO;
            }
            else {
                $scope.FilterInvRecListByUCategory(val, val.MATCH_TYPE);
                $scope.FilterInvRecListByXCategory(val, val.MATCH_TYPE);
                $scope.FilterInvRecListByXContact(val, val.MATCH_TYPE);
            }
        });
    }

    $scope.SET_CHECKBOX_MISSING_IS_XERO_LINE = function (MATCH_TYPE) {
        $scope.Inv_recon_Search.IS_MISSING_IS_XERO = true;
        for (var i = 0; i < $scope.INV_RECO_INVOICE_FOR_ACCRUAL.filter(function (x) { return x.MATCH_TYPE == MATCH_TYPE }).length; i++) {
            if ($scope.INV_RECO_INVOICE_FOR_ACCRUAL.filter(function (x) { return x.MATCH_TYPE == MATCH_TYPE })[i].IS_SELECTED == false) {
                $scope.Inv_recon_Search.IS_MISSING_IS_XERO = false;
                break;
            }
        }
    }
    $scope.SET_CHECKBOX_LINE = function () {
        $scope.Inv_recon_Search.IS_MISSING_IS_XERO = false;
        $scope.Inv_recon_Search.IS_VALUE_VARIANCE = false;
    }

    $scope.BACK_RECO = function () {
        window.location.href = '../Payment/SalesIndex#!/InvRec_List';
    }
    $scope.GET_INV_RECO_JOURNALS_BY_ID = function (LINE) {
        $scope.RECO_JOURNALS_BY_ID_LIST = [];
        var CustmObj = new Object();
        CustmObj.JV_HEADER_ID = LINE.JV_HEADER_ID;
        PrcCommMethods.CASHUP_API(CustmObj, 'GET_INV_RECO_JOURNALS_BY_ID').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.SELECTED_LINE = LINE;
                $scope.INV_RECO_BY_ID_HEADER_DTLS = data.data.Table[0];
                $scope.RECO_JOURNALS_BY_ID_LIST = data.data.Table1;
                $('#RECO_JOURNALS').modal('show');
            }
        });
    }

    $scope.$parent.child_scope = $scope;
    $scope.COMMON_CODE_CHANGE();

});