app.controller('InvRecReconcileController', function ($scope, $http, $interval, CommService, $cookies, $filter, PrcCommMethods, $location, readFileData, $localStorage) {
    $(".tooltip").remove();
    $scope.STATUS_LIST = [{ ID: 1, NAME: 'Matched', class: 'badge-success', check: false, IDS: [1, 2] }, { ID: 0, NAME: 'Missing in Xero', class: 'badge-light-purple', check: false, IDS: [0] }, { ID: 7, NAME: 'Probable', class: 'badge-light-orange', check: false, IDS: [7] }, { ID: 8, NAME: 'Manual', class: 'badge-light-blue', check: false, IDS: [8] }];
    $scope.COLOR_LIST = [{ ID: 1, class: 'badge-success' }, { ID: 2, class: 'badge-light-purple' }, { ID: 3, class: 'badge-light-orange' }, { ID: 4, class: 'badge-light-green' }];
    $scope.HIDE_SHOW_HEADER_FILTER = true;
    $scope.Inv_recon_Search = {
        PAGE_TITLE: "RECONCILE",
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
        CUSTOM_STEP_NO: 3,
        STEP_NO: 3,
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
            UPLOADE_TYPE_ID: 29
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

    if ($scope.BRANCH_LIST.length > 0) { $scope.Inv_recon_Search.BRANCH_ID = $scope.BRANCH_LIST[0].BRANCH_ID; }


    $scope.FilterInvRecListByStatus = function (InvRow) {
        //Status Check
        statuscount = 0;
        anystatuscheck = false;
        for (var i = 0; i < $scope.STATUS_LIST.length; i++) {
            $scope.STATUS_LIST[i].check == true ? anystatuscheck = true : null;
            if ($scope.STATUS_LIST[i].check == true && ($scope.STATUS_LIST[i].ID == InvRow.FILTER_STATUS_ID || ($scope.STATUS_LIST[i].ID == 1 ? InvRow.FILTER_STATUS_ID == 2 : false))) {
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



    $scope.DEL_INV_RECO_UPLOAD_DETAILS_BY_ID = function (LINE, index) {
        if (confirm('Are you sure?')) {
            $scope.$parent.overlay_loadingNew = 'block';
            var CustmObj = new Object();
            CustmObj.LINE_TABLE_ID = LINE.LINE_TABLE_ID;
            CustmObj.HEADER_ID = $scope.HEADER_ID;
            CustmObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.CASHUP_API(CustmObj, 'DEL_INV_RECO_UPLOAD_DETAILS_BY_ID').then(function (data) {
                if (data.data == 1) {
                    $scope.INV_RECO_RECONCILE_LIST.splice(index, 1);
                    $scope.$parent.overlay_loadingNew = 'none';
                    LINE.HEADER_ID = $scope.HEADER_ID;
                    LINE.STATUS_ID = $scope.Inv_recon_Search.STATUS_ID;
                    $scope.GET_INV_RECO_RECONCILE(LINE);
                }
            });
        }
    };


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

    $scope.NOT_UPLOADED_RECD = function (RECON_DTLS) {
        $scope.GET_XERO_CONTACTS("", 1);
        $scope.SELECTED_LINE = RECON_DTLS;
        $scope.Inv_recon_Search.MATCH_FROM_DATE = $scope.INV_RECO_RECONCILE_HEADER_DTLS.FROM_DATE;
        $scope.Inv_recon_Search.MATCH_TO_DATE = $scope.INV_RECO_RECONCILE_HEADER_DTLS.TO_DATE;
        $scope.Inv_recon_Search.MATCH_CONTACT_ID = RECON_DTLS.CONTACT_ID;
        // var Ctcdtls = $scope.XERO_CONTACTS_LIST.filter(function (x) { return x.XERO_CONTACT_ID == RECON_DTLS.CONTACT_ID });
        //if (Ctcdtls.length > 0) {
        //    $scope.Inv_recon_Search.MATCH_CONTACT_NAME = RECON_DTLS.CONTACT_NAME;
        //}
        //else {
        $scope.Inv_recon_Search.MATCH_CONTACT_NAME = RECON_DTLS.XERO_CONTACT_NAME;
        //}
        $scope.GET_XERO_INVOICES_FOR_INV_RECO(RECON_DTLS, 1);
        $('#reportrangeMathInvoice span').html($filter('date')(new Date($scope.INV_RECO_RECONCILE_HEADER_DTLS.FROM_DATE)) + ' - ' + $filter('date')(new Date($scope.INV_RECO_RECONCILE_HEADER_DTLS.TO_DATE)));
    }

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

    $scope.XERO_INVOICES_FOR_INV_RECO_INFO_LIST = [];



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
    $scope.FILTER_LOAD = function (LINE) {
        $scope.FilterInvRecListByStatus(LINE);
        $scope.FilterInvRecListByUCategory(LINE);
        $scope.FilterInvRecListByXCategory(LINE);
        $scope.FilterInvRecListByXContact(LINE);
        $scope.FilterInvoiceListByStatus(LINE);
        $scope.FilterInvRecValueVariance(LINE);
        $scope.COMMON_CODE_CHANGE();
    }
    $scope.INV_RECO_INVOICE_PROBABLE_MATCH_REVIEWED = function (LINE) {
        var CustmObj = new Object();
        CustmObj.LINE_TABLE_ID = LINE.LINE_TABLE_ID;
        CustmObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.CASHUP_API(CustmObj, 'INV_RECO_INVOICE_PROBABLE_MATCH_REVIEWED').then(function (data) {
            if (data.data == 1) {
                $scope.$parent.ShowAlert("Success", "Data Saved Successfully", 3000);
                LINE.MATCH_TYPE = 8;
                LINE.FILTER_STATUS_ID = 8;
                $scope.FILTER_LOAD(LINE);


            }
            if (data.data == 0) {
                $scope.$parent.ShowAlert("Error", $scope.SOMETHINGWENTWRONG, 3000);
            }
        });
    }

    $scope.GET_INV_RECO_JOURNALS = function (LINE) {
        var CustmObj = new Object();
        CustmObj.JV_LINE_ID = LINE.JV_LINE_ID;
        CustmObj.TYPE_ID = LINE.TYPE_ID;
        PrcCommMethods.CASHUP_API(CustmObj, 'GET_INV_RECO_JOURNALS').then(function (data) {
            if (data.data.Table.length > 0) { $scope.XERO_INVOICES_FOR_INV_RECO_LIST = data.data.Table; } else { }
        });
    }
    $scope.REMOVE_INV_RECO_INVOICE_MANUAL_MAPPING_LINE_WISE = function (INVC) {
        if (confirm('Are you sure you want to remove this match?')) {
            var CustmObj = new Object();
            CustmObj.LINE_TABLE_ID = INVC.LINE_TABLE_ID;
            CustmObj.XERO_INVOICE_ID = null;
            CustmObj.HEADER_ID = $scope.HEADER_ID;
            CustmObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.CASHUP_API(CustmObj, 'INV_RECO_INVOICE_MANUAL_MAPPING').then(function (data) {
                if (data.data == 1) {
                    INVC.XERO_ACCOUNT_NAME = null;
                    INVC.XERO_CONTACT_NAME = null;
                    INVC.XERO_INVOICE_DATE = null;
                    INVC.XERO_INVOICE_NUMBER = null;
                    INVC.XERO_NET = null;
                    INVC.MATCH_TYPE = 0;
                    $scope.FILTER_LOAD(INVC);
                    $scope.$parent.ShowAlert("Success", "Match Removed Successfully", 2000);


                }
            });
        }
    }

    $scope.SELECTED_INVOICE_ID = 0;
    $scope.INV_RECO_INVOICE_MANUAL_MAPPING = function (FLAG) {
        if ($scope.SELECTED_INVOICE_ID != undefined && $scope.SELECTED_INVOICE_ID != null && $scope.SELECTED_INVOICE_ID != 0 && $scope.SELECTED_INVOICE_ID != "") {
            if (confirm('Are you sure you want to match this Invoice?')) {
                var item = $scope.XERO_INVOICES_FOR_INV_RECO_LIST.filter(function (x) { return x.XERO_INVOICE_ID == $scope.SELECTED_INVOICE_ID });
                var CustmObj = new Object();
                CustmObj.LINE_TABLE_ID = $scope.SELECTED_LINE.LINE_TABLE_ID;
                CustmObj.XERO_INVOICE_ID = $scope.SELECTED_INVOICE_ID;
                CustmObj.XERO_CATEGORY_MASTER_ID = item[0].XERO_CATEGORY_MASTER_ID;
                CustmObj.HEADER_ID = $scope.HEADER_ID;
                CustmObj.USER_ID = parseInt($cookies.get("USERID"));
                PrcCommMethods.CASHUP_API(CustmObj, 'INV_RECO_INVOICE_MANUAL_MAPPING').then(function (data) {
                    if (data.data == 1) {
                        $scope.INV_RECO_RECONCILE_LIST.filter(function (INVC) {
                            if (INVC.LINE_TABLE_ID == $scope.SELECTED_LINE.LINE_TABLE_ID) {
                                INVC.XERO_ACCOUNT_CODE = item[0].XERO_ACCOUNT_CODE;
                                INVC.XERO_ACCOUNT_NAME = item[0].XERO_ACCOUNT_NAME;
                                INVC.XERO_CONTACT_NAME = item[0].XERO_CONTACT_NAME;;
                                INVC.XERO_INVOICE_DATE = item[0].XERO_INVOICE_DATE;
                                INVC.XERO_INVOICE_NUMBER = item[0].XERO_INVOICE_NUMBER;
                                INVC.XERO_NET = item[0].XERO_NET;
                                INVC.TYPES = item[0].TYPES;
                                INVC.MATCH_TYPE = 8;
                                INVC.FILTER_STATUS_ID = 8;
                                //  $scope.FILTER_LOAD(INVC);
                            }
                        });
                        $scope.SELECTED_INVOICE_ID = null;
                        $('#InvList').modal('hide');
                    };
                });
            }
        }
        else {
            $scope.$parent.ShowAlert("Error", "Please selection is require", 2000);
        }
    }

    $scope.INV_RECO_RECONCILE_HEADER_DTLS = {}
    $scope.INV_RECO_RECONCILE_LIST = [];

    $scope.GET_INV_RECO_RECONCILE = function (HEADER_DTLS, FLAG) {
        $scope.$parent.overlay_loadingNew = 'block';
        var CustmObj = new Object();
        CustmObj.HEADER_ID = HEADER_DTLS.HEADER_ID;
        CustmObj.USER_ID = parseInt($cookies.get("USERID"));
        CustmObj.STATUS_ID = HEADER_DTLS.STATUS_ID;
        CustmObj.ENTITY_ID = $scope.Inv_recon_Search.ENTITY_ID;
        CustmObj.BRANCH_ID = $scope.Inv_recon_Search.BRANCH_ID;
        PrcCommMethods.CASHUP_API(CustmObj, 'GET_INV_RECO_RECONCILE').then(function (data) {
            if (data.data.Table.length > 0) {
                //$scope.INV_RECO_RECONCILE_HEADER_DTLS = data.data.Table[0];
                $scope.INV_RECO_RECONCILE_LIST = data.data.Table;
                $scope.GET_XERO_INVOICES_FOR_INV_RECO_PAGE_LOAD();
                if (FLAG == 1) {
                    $('#InvList').modal('hide');
                }
                else {
                    $scope.UNIQUE_INV_RECO_RECONCILE_LIST = $filter('unique')(data.data.Table1, 'CATEGORY_MASTER_ID');
                }
                $scope.$parent.overlay_loadingNew = 'none';
            }
        });
    }

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

    $scope.POP_ALREDYIN_FNB = function () {

    }
    $scope.GET_XERO_INVOICES_FOR_INV_RECO_INFO_CLICK = function () {
        var CustmObj = new Object();
        $scope.Inv_recon_Search.MATCH_FROM_DATE = $scope.INV_RECO_RECONCILE_HEADER_DTLS.FROM_DATE;
        $scope.Inv_recon_Search.MATCH_TO_DATE = $scope.INV_RECO_RECONCILE_HEADER_DTLS.TO_DATE;
        $scope.XERO_INVOICES_FOR_INV_RECO_INFO_LIST = [];
        CustmObj.FROM_DATE = $scope.Inv_recon_Search.MATCH_FROM_DATE
        CustmObj.TO_DATE = $scope.Inv_recon_Search.MATCH_TO_DATE
        CustmObj.ENTITY_ID = $scope.INV_RECO_RECONCILE_HEADER_DTLS.ENTITY_ID;
        CustmObj.BRANCH_ID = $scope.INV_RECO_RECONCILE_HEADER_DTLS.BRANCH_ID;
        CustmObj.XERO_CONTACT_ID = 0;//$scope.Inv_recon_Search.MATCH_CONTACT_ID;
        PrcCommMethods.CASHUP_API(CustmObj, 'GET_XERO_INVOICES_FOR_INV_RECO').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.XERO_INVOICES_FOR_INV_RECO_INFO_LIST = data.data.Table;
                $('#MISSING_IN_F_AND_B').modal('show');
            }
            else {
                $('#MISSING_IN_F_AND_B').modal('show');
            }
        });
    }
    $scope.INV_RECO_UPLOAD_HEADER_BY_ID_LIST = [];
    $scope.GET_INV_RECO_UPLOAD_HEADER_BY_ID = function (HEADER_ID) {
        var CustmObj = new Object();
        CustmObj.HEADER_ID = HEADER_ID;
        PrcCommMethods.CASHUP_API(CustmObj, 'GET_INV_RECO_UPLOAD_HEADER_BY_ID').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.INV_RECO_UPLOAD_HEADER_BY_ID_LIST = (data.data.Table);
                if (data.data.Table.length > 0) {
                    $scope.Inv_recon_Search.STATUS_ID = data.data.Table[0].STATUS_ID;
                    $scope.Inv_recon_Search.STEP_NO = data.data.Table[0].STEP_NO;
                    $scope.Inv_recon_Search.CREATED_DATE = data.data.Table[0].CREATED_DATE;
                    $scope.Inv_recon_Search.EMAIL = data.data.Table[0].EMAIL;
                    $scope.Inv_recon_Search.ENTITY_NAME = data.data.Table[0].ENTITY_NAME;
                    $scope.Inv_recon_Search.NAME = data.data.Table[0].NAME;
                    $scope.Inv_recon_Search.BRANCH_NAME = data.data.Table[0].BRANCH_NAME;
                    $scope.Inv_recon_Search.FROM_DATE = data.data.Table[0].FROM_DATE;
                    $scope.Inv_recon_Search.TO_DATE = data.data.Table[0].TO_DATE;
                    $scope.Inv_recon_Search.RECORD_COUNT = data.data.Table[0].RECORD_COUNT;
                    $scope.Inv_recon_Search.STATUS_NAME = data.data.Table[0].STATUS_NAME;
                    $scope.INV_RECO_RECONCILE_HEADER_DTLS = data.data.Table[0];
                    $scope.$parent.STEP_PROCESS($scope.Inv_recon_Search.STEP_NO);
                    $('#reportrange span').html($filter('date')(new Date($scope.Inv_recon_Search.FROM_DATE)) + ' - ' + $filter('date')(new Date($scope.Inv_recon_Search.TO_DATE)));
                }
                $scope.Inv_recon_Search.BRANCH_ID = (data.data.Table[0].BRANCH_ID);
                data.data.Table[0].HEADER_ID = HEADER_ID;
                $scope.Inv_recon_Search.STATUS_ID = data.data.Table[0].STATUS_ID;
                $scope.GET_INV_RECO_RECONCILE(data.data.Table[0]);
            }
        });
    };
    if ($scope.HEADER_ID != undefined) {
        $scope.GET_INV_RECO_UPLOAD_HEADER_BY_ID($scope.HEADER_ID);
    }
    $scope.contactfilter = function (item) {
        return $scope.Inv_recon_Search.IS_SHOW_UN_MAP ? item.CONTACT_ID == null : item;
    }

    $scope.XERO_CONTACTS_LIST = [];
    $scope.GET_XERO_CONTACTS = function (SELECTED_CONTACT, FLAG) {
        if (FLAG == undefined) {
            $scope.Inv_recon_Search.IS_MAP_RECORD = false;
            $scope.Inv_recon_Search.IS_MAP = false;
            $scope.Inv_recon_Search.CONTACT_NAME = "";
            $scope.SELECTED_CONTACT = "";
            $scope.SELECTED_CONTACT = SELECTED_CONTACT;
        }
        if ($scope.XERO_CONTACTS_LIST.length == 0) {
            var CustmObj = new Object();
            CustmObj.ENTITY_ID = $scope.Inv_recon_Search.ENTITY_ID;
            CustmObj.BRANCH_ID = $scope.Inv_recon_Search.BRANCH_ID;
            CustmObj.SUPPLIER_NAME = "";
            CustmObj.PAGE_NO = 0;
            CustmObj.PAGE_SIZE = 0;
            PrcCommMethods.CASHUP_API(CustmObj, 'GET_XERO_CONTACTS').then(function (data) {
                if (data.data.Table.length > 0) {
                    if (FLAG == undefined) {
                        $('#mismatch').modal('show')
                    }
                    $scope.XERO_CONTACTS_LIST = data.data.Table;

                    $('#AddCustomScroll_REQ').find('.dropdown-menu').addClass('custom-scrollbar');
                    $('#AddCustomScroll_SHD').find('.dropdown-menu').addClass('custom-scrollbar');
                }
            });
        }
        else {
            if (FLAG == undefined) {
                $('#mismatch').modal('show')
            }
        }
    }
    //1 ext 0 miss

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
        $scope.$parent.SetUpDateRangeMultiDatePicker('reportrangeMathInvoice', startDate, endDate, reportrangeMatchInvoice);
    }
    $scope.NG_PAGE_LOAD();


    $scope.INV_RECO_COMPLETE_RECONCILIATION = function () {
        if ($scope.Inv_recon_Search.STATUS_ID != 63) {
            var CustmObj = new Object();
            CustmObj.HEADER_ID = $scope.HEADER_ID;
            CustmObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.CASHUP_API(CustmObj, 'INV_RECO_COMPLETE_RECONCILIATION').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.$parent.STEP_PROCESS(data.data.Table[0].STEP_NO);
                    data.data.Table[0].ID = $scope.HEADER_ID;
                    data.data.Table[0].STEP_NO = 4;
                    $scope.$parent.INV_REC_PAGE_LOAD(data.data.Table[0]);
                }
            });
        } else {
            $scope.$parent.STEP_PROCESS(8);
            var obj = new Object()
            obj.ID = $scope.HEADER_ID;
            obj.STEP_NO = 4;
            $scope.$parent.INV_REC_PAGE_LOAD(obj);
        }
    }

    $scope.HIDE_SHOW_FILTER_FY = function () {
        $scope.HIDE_SHOW_HEADER_FILTER = !$scope.HIDE_SHOW_HEADER_FILTER;
    }

    $scope.BACK_RECO = function () {
        window.location.href = '../Payment/SalesIndex#!/InvRec_List'
    }

    $scope.$parent.child_scope = $scope;
    $scope.COMMON_CODE_CHANGE();
});
