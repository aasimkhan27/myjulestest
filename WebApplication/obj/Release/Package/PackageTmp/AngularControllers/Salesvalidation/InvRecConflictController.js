app.controller('InvConflictController', function ($scope, $http, $interval, CommService, $cookies, $filter, PrcCommMethods, $location, readFileData, $localStorage) {
    $(".tooltip").remove();
    $scope.INV_RECO_UPLOAD_DETAILS_TYPE = [{ ID: 1, COLUMN_NAME: 'ACCOUNT', MATCH_COLUMN_NAME: 'ACCOUNT', IS_MANDATORY: true, HEADER_NAME: 'ACCOUNT', FIELD_TYPE_ID: 2, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true, FIELD_MASTER_ID: 1 },
    { ID: 2, COLUMN_NAME: 'CONTACT', MATCH_COLUMN_NAME: 'CONTACT', IS_MANDATORY: true, HEADER_NAME: 'CONTACT', FIELD_TYPE_ID: 2, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true, FIELD_MASTER_ID: 1 },
    { ID: 3, COLUMN_NAME: 'DATE', MATCH_COLUMN_NAME: 'DATE', IS_MANDATORY: true, HEADER_NAME: 'DATE', FIELD_TYPE_ID: 9, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true, FIELD_MASTER_ID: 1 },
    { ID: 5, COLUMN_NAME: 'INVOICE_NUMBER', MATCH_COLUMN_NAME: 'INVOICE_NUMBER', IS_MANDATORY: true, HEADER_NAME: 'INVOICE_NUMBER', FIELD_TYPE_ID: 2, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true, FIELD_MASTER_ID: 1 },
    { ID: 6, COLUMN_NAME: 'NET_AMOUNT', MATCH_COLUMN_NAME: 'NET_AMOUNT', IS_MANDATORY: true, HEADER_NAME: 'NET_AMOUNT', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true, FIELD_MASTER_ID: 1 },

    ];
    $scope.INTEGRATION_SYSTEM_LIST = [{ INTEGRATION_SYSTEM_ID: 25, NAME: 'Demo Test' }];

    $scope.STATUS_LIST = [{ ID: 1, NAME: 'Matched', class: 'badge-success', check: false }, { ID: 0, NAME: 'Missing in Xero', class: 'badge-light-purple', check: false }, { ID: 7, NAME: 'Probable', class: 'badge-light-orange', check: false }, { ID: 8, NAME: 'Manual', class: 'badge-light-green', check: false }];
    $scope.HIDE_SHOW_HEADER_FILTER = true;
    $scope.Inv_recon_Search = {
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
        STEP_NO: 3,
        CUSTOM_STEP_NO: 3,
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

    $scope.BRANCH_LIST = JSON.parse($localStorage.BRANCH_LOGIN_LIST);
    $scope.BRANCH_LIST_VIEW = angular.copy($scope.BRANCH_LIST);
    if ($scope.BRANCH_LIST.length > 0) {
        $scope.Inv_recon_Search.BRANCH_ID = $scope.BRANCH_LIST[0].BRANCH_ID;
    }

 
    $scope.INS_INV_RECO_UPLOAD = function (FLAG) {
        var value = true;
        var count = 0;
        //if (!(moment($scope.Inv_recon_Search.MAX_DATE).isBetween(moment($scope.Inv_recon_Search.FROM_DATE), moment($scope.Inv_recon_Search.TO_DATE), undefined, '[]'))) {
        //    count = 1;
        //    value = false;
        //}
        //if (!(moment($scope.Inv_recon_Search.MIN_DATE).isBetween(moment($scope.Inv_recon_Search.FROM_DATE), moment($scope.Inv_recon_Search.TO_DATE), undefined, '[]'))) {
        //    count = 2;
        //    value = false;
        //}
        //if (count == 1 || count == 2) {
        //    $scope.$parent.ShowAlert('Error', 'Please select correct from date or To date', 5000);
        //}


        if (FLAG == 1 && count == 0) {
            value = confirm("Are you sure");
        }
        if (value) {
            $scope.$parent.overlay_loadingNew = 'block';
            var CustmObj = new Object();
            CustmObj.FROM_DATE = $scope.Inv_recon_Search.FROM_DATE;
            CustmObj.TO_DATE = $scope.Inv_recon_Search.TO_DATE;
            CustmObj.ENTITY_ID = $scope.Inv_recon_Search.ENTITY_ID;
            CustmObj.BRANCH_ID = $scope.Inv_recon_Search.BRANCH_ID;
            CustmObj.FILE_NAME = $scope.Inv_recon_Search.UploadedFiles[0].ORIGINAL_FILE_NAME;
            CustmObj.FILE_PATH = $scope.Inv_recon_Search.UploadedFiles[0].FILE_PATH + $scope.Inv_recon_Search.UploadedFiles[0].SERVER_FILE_NAME;
            CustmObj.INTEGRATION_SYSTEM_ID = $scope.Inv_recon_Search.INTEGRATION_SYSTEM_ID;
            CustmObj.USER_ID = parseInt($cookies.get("USERID"));
            CustmObj.EXCEL_DATATABLE = [];
            angular.forEach($scope.INV_RECO_UPLOAD_DETAILS_LIST, function (val) {
                var obj = new Object();
                obj.ACCOUNT = val.ACCOUNT;
                obj.CONTACT = val.CONTACT;
                obj.DATE = val.DATE;
                obj.INVOICE_NUMBER = val.INVOICE_NUMBER;
                obj.NET_AMOUNT = val.NET_AMOUNT;
                obj.ROWNUM = val.ROWNUM;
                obj.MERGED_ROWNUM = val.MERGED_ROWNUM;
                obj.DELETED = val.DELETED;
                CustmObj.EXCEL_DATATABLE.push(obj);
            })

            PrcCommMethods.CASHUP_API(CustmObj, 'INS_INV_RECO_UPLOAD').then(function (data) {
                if (data.data > 1) {
                    $scope.$parent.ShowAlert('Success', 'Records Save successfully.', 5000);
                    $scope.HEADER_ID = data.data;
                    $location.path('Inv_Upload_File').search({ HEADER_ID: data.data });
                    $scope.GET_INV_RECO_UPLOAD_HEADER_BY_ID(data.data);
                };
                if (data.data == 0) {
                    $scope.$parent.ShowAlert('Error', $scope.SOMETHINGWENTWRONG, 5000);
                };
                $scope.$parent.overlay_loadingNew = 'none';
            });
        }
    };

    $scope.INV_RECO_UPLOAD_LIST = [];
    $scope.GET_INV_RECO_UPLOAD = function (FLAG) {
        if (FLAG == undefined) {
            $scope.Inv_recon_Search.PAGE_NO = 1;
            $scope.INV_RECO_UPLOAD_LIST = [];
        }
        $scope.$parent.overlay_loadingNew = 'block';
        var CustmObj = new Object();
        CustmObj.INTEGRATION_SYSTEM_ID = $scope.Inv_recon_Search.INTEGRATION_SYSTEM_ID;

        CustmObj.ENTITY_ID = $scope.Inv_recon_Search.ENTITY_ID;
        CustmObj.BRANCH_ID = $scope.Inv_recon_Search.BRANCH_ID_FILTER;
        CustmObj.UPLOAD_DATE_START = $scope.Inv_recon_Search.UPLOAD_DATE_START;
        CustmObj.UPLOAD_DATE_END = $scope.Inv_recon_Search.UPLOAD_DATE_END;
        CustmObj.FILE_NAME = $scope.Inv_recon_Search.FILE_NAME_FILTER;
        CustmObj.UPLOADED_BY = $scope.Inv_recon_Search.UPLOADED_BY;
        CustmObj.PAGE_NO = $scope.Inv_recon_Search.PAGE_NO;
        CustmObj.PAGE_SIZE = $scope.Inv_recon_Search.PAGE_SIZE;
        PrcCommMethods.CASHUP_API(CustmObj, 'GET_INV_RECO_UPLOAD').then(function (data) {
            if (data.data.Table != undefined) {
                if (data.data.Table.length > 0) {
                    $scope.INV_RECO_UPLOAD_LIST = $scope.INV_RECO_UPLOAD_LIST.concat(data.data.Table);
                    $scope.$parent.overlay_loadingNew = 'none';
                    if (data.data.Table.length < $scope.Inv_recon_Search.PAGE_SIZE) {
                        $scope.ViewGetData = false;
                    }
                    else {
                        $scope.Inv_recon_Search.PAGE_NO = parseInt($scope.Inv_recon_Search.PAGE_NO) + 1;
                        $scope.ViewGetData = true;
                    }
                }
                else {
                    $scope.$parent.overlay_loadingNew = 'none';
                    $scope.ViewGetData = false;
                }
            }
            else {
                $scope.INV_RECO_UPLOAD_LIST = [];
                $scope.ViewGetData = false;
                $scope.$parent.overlay_loadingNew = 'none';
            }
        });
    };

    $scope.GET_INV_RECO_UPLOAD();
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

    $scope.LAZY_GET_INV_RECO_UPLOAD = function () {
        $scope.GET_INV_RECO_UPLOAD(1);
    }
    $scope.LAZY_GET_INV_RECO_UPLOAD_BY_ID = function () {
        $scope.GET_INV_RECO_UPLOAD_BY_ID(1);
    }
    $scope.HEADER_ID = getUrlParameter('HEADER_ID', $location.absUrl());
    $scope.GET_INV_RECO_UPLOAD_BY_ID = function (FLAG) {
        if (FLAG == undefined) {
            $scope.Inv_recon_Search.PAGE_NO_ID = 1;
            $scope.INV_RECO_UPLOAD_BY_ID_LIST = [];
        }
        $scope.$parent.overlay_loadingNew = 'block';
        var CustmObj = new Object();
        CustmObj.HEADER_ID = getUrlParameter('HEADER_ID', $location.absUrl());;
        CustmObj.PAGE_NO = $scope.Inv_recon_Search.PAGE_NO_ID;
        CustmObj.PAGE_SIZE = $scope.Inv_recon_Search.PAGE_SIZE_ID;
        PrcCommMethods.CASHUP_API(CustmObj, 'GET_INV_RECO_UPLOAD_BY_ID').then(function (data) {
            if (data.data.Table != undefined) {
                if (data.data.Table.length > 0) {
                    $scope.INV_RECO_UPLOAD_BY_ID_LIST = $scope.INV_RECO_UPLOAD_BY_ID_LIST.concat(data.data.Table);
                    $scope.$parent.overlay_loadingNew = 'none';
                    if (data.data.Table.length < $scope.Inv_recon_Search.PAGE_SIZE_ID) {
                        $scope.GetData = false;
                    }
                    else {
                        $scope.Inv_recon_Search.PAGE_NO_ID = parseInt($scope.Inv_recon_Search.PAGE_NO_ID) + 1;
                        $scope.GetData = true;
                    }
                }
                else {
                    $scope.GetData = false;
                    $scope.$parent.overlay_loadingNew = 'none';
                }
            }
            else {
                $scope.INV_RECO_UPLOAD_BY_ID_LIST = [];
                $scope.$parent.overlay_loadingNew = 'none';
            }
        });
    };
    $scope.GET_INV_RECO_UPLOAD_BY_ID();

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

        var Ctcdtls = $scope.XERO_CONTACTS_LIST.filter(function (x) { return x.XERO_CONTACT_ID == RECON_DTLS.CONTACT_ID });
        if (Ctcdtls.length > 0) {
            $scope.Inv_recon_Search.MATCH_CONTACT_NAME = Ctcdtls[0].CONTACT_NAME;
        }
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
    $scope.INV_RECO_INVOICE_PROBABLE_MATCH_REVIEWED = function (LINE) {
        var CustmObj = new Object();
        CustmObj.LINE_TABLE_ID = LINE.LINE_TABLE_ID;
        CustmObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.CASHUP_API(CustmObj, 'INV_RECO_INVOICE_PROBABLE_MATCH_REVIEWED').then(function (data) {
            if (data.data == 1) {
                $scope.$parent.ShowAlert("Success", "Data Saved Successfully", 3000);
                LINE.MATCH_TYPE = 8;
            }
            if (data.data == 0) {
                $scope.$parent.ShowAlert("Error", $scope.SOMETHINGWENTWRONG, 3000);
            }
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
                    $scope.$parent.ShowAlert("Success", "Match Removed Successfully", 2000);
                }
            });
        }
    }
    $scope.SELECTED_INVOICE_ID = 0;
    $scope.INV_RECO_INVOICE_MANUAL_MAPPING = function (FLAG) {
        if ($scope.SELECTED_INVOICE_ID != undefined && $scope.SELECTED_INVOICE_ID != null && $scope.SELECTED_INVOICE_ID != 0 && $scope.SELECTED_INVOICE_ID != "") {
            if (confirm('Are you sure you want to match this Invoice?')) {
                var CustmObj = new Object();
                CustmObj.LINE_TABLE_ID = $scope.SELECTED_LINE.LINE_TABLE_ID;
                CustmObj.XERO_INVOICE_ID = $scope.SELECTED_INVOICE_ID;
                CustmObj.HEADER_ID = $scope.HEADER_ID;
                CustmObj.USER_ID = parseInt($cookies.get("USERID"));
                PrcCommMethods.CASHUP_API(CustmObj, 'INV_RECO_INVOICE_MANUAL_MAPPING').then(function (data) {
                    if (data.data == 1) {
                        $scope.SELECTED_INVOICE_ID = null;
                    }
                });
            }
        }
        else {
            $scope.$parent.ShowAlert("Error", "Please atleast one valuable selection is require", 2000);
        }

    }

    $scope.INV_RECO_RECONCILE_HEADER_DTLS = {}
    $scope.GET_INV_RECO_RECONCILE_LIST = [];
    $scope.INV_RECO_RECONCILE_LIST = [];
    $scope.INV_RECO_RECONCILE_JV_LIST = [];

    $scope.GET_INV_RECO_RECONCILE = function (HEADER_DTLS) {
        $scope.$parent.overlay_loadingNew = 'block';
        var CustmObj = new Object();
        CustmObj.HEADER_ID = HEADER_DTLS.ID;
        CustmObj.USER_ID = parseInt($cookies.get("USERID"));
        CustmObj.STATUS_ID = HEADER_DTLS.STATUS_ID;
        CustmObj.ENTITY_ID = $scope.Inv_recon_Search.ENTITY_ID;
        CustmObj.BRANCH_ID = $scope.Inv_recon_Search.BRANCH_ID;
        CustmObj.ONLY_SHOW_VARIANCE_INVOICES = HEADER_DTLS.ONLY_SHOW_VARIANCE_INVOICES == undefined ? 0 : HEADER_DTLS.ONLY_SHOW_VARIANCE_INVOICES;
        PrcCommMethods.CASHUP_API(CustmObj, 'GET_INV_RECO_RECONCILE').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.INV_RECO_RECONCILE_HEADER_DTLS = data.data.Table[0];
                if (data.data.Table[0].STEP_NO == 4) {
                    $scope.Inv_recon_Search.STEP_NO = data.data.Table[0].STEP_NO;
                    $scope.INV_RECO_RECONCILE_JV_LIST = data.data.Table1;
                    $scope.STEP_PROCESS(4);
                }
                else {

                    //$scope.Inv_recon_Search.STEP_NO = data.data.Table[0].STEP_NO;
                    //$scope.STEP_PROCESS(4);
                    //$scope.INV_RECO_RECONCILE_JV_LIST = data.data.Table1;

                    $scope.INV_RECO_RECONCILE_LIST = data.data.Table1;
                    $scope.GET_XERO_INVOICES_FOR_INV_RECO_PAGE_LOAD();
                    $scope.UNIQUE_INV_RECO_RECONCILE_LIST = $filter('unique')(data.data.Table1, 'CATEGORY_MASTER_ID');

                }
                $scope.Inv_recon_Search.CREATED_DATE = data.data.Table[0].CREATED_DATE;
                $scope.Inv_recon_Search.EMAIL = data.data.Table[0].EMAIL;
                $scope.Inv_recon_Search.ENTITY_NAME = data.data.Table[0].ENTITY_NAME;
                $scope.Inv_recon_Search.NAME = data.data.Table[0].NAME;
                $scope.Inv_recon_Search.BRANCH_NAME = data.data.Table[0].BRANCH_NAME;
                $scope.Inv_recon_Search.FROM_DATE = data.data.Table[0].FROM_DATE;
                $scope.Inv_recon_Search.TO_DATE = data.data.Table[0].TO_DATE;
                $scope.Inv_recon_Search.RECORD_COUNT = data.data.Table[0].RECORD_COUNT;
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
                    $scope.STEP_PROCESS($scope.Inv_recon_Search.STEP_NO);
                    $scope.Inv_recon_Search.STATUS_ID = data.data.Table[0].STATUS_ID;
                    $('#reportrange span').html($filter('date')(new Date($scope.Inv_recon_Search.FROM_DATE)) + ' - ' + $filter('date')(new Date($scope.Inv_recon_Search.TO_DATE)));
                }
                $scope.Inv_recon_Search.BRANCH_ID = (data.data.Table[0].BRANCH_ID);
                if ($scope.Inv_recon_Search.STEP_NO == 2) {
                    data.data.Table[0].ID = HEADER_ID;
                    $scope.GET_INV_RECO_CONTACT_MAPPING(data.data.Table[0]);
                }
                else if ($scope.Inv_recon_Search.STEP_NO == 3) {
                    $scope.GET_INV_RECO_RECONCILE(data.data.Table[0]);
                }
                else if ($scope.Inv_recon_Search.STEP_NO == 4) {
                    data.data.Table[0].ONLY_SHOW_VARIANCE_INVOICES = 1;
                    $scope.GET_INV_RECO_RECONCILE(data.data.Table[0]);
                }
            }
        });
    };

    if ($scope.HEADER_ID != undefined) {
        $scope.GET_INV_RECO_UPLOAD_HEADER_BY_ID($scope.HEADER_ID);
    }
    else {
        $scope.Inv_recon_Search.STEP_NO = 1;
        $scope.STEP_PROCESS(1);
    }
    $scope.PROCESS_INV_RECO_CONTACT_MAPPING = function (HEADER_DTLS) {
        var CustmObj = new Object();
        CustmObj.HEADER_ID = HEADER_DTLS.ID;
        CustmObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.CASHUP_API(CustmObj, 'PROCESS_INV_RECO_CONTACT_MAPPING').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.Inv_recon_Search.STEP_NO = (data.data.Table[0].STEP_NO);
                $scope.Inv_recon_Search.BRANCH_ID = (HEADER_DTLS.BRANCH_ID);
                $scope.STEP_PROCESS($scope.Inv_recon_Search.STEP_NO, HEADER_DTLS);
                $scope.HEADER_ID = HEADER_DTLS.ID;
                // $location.path('Inv_Upload_File').search({ HEADER_ID: data.data });
                if ($scope.Inv_recon_Search.STEP_NO == 2) {
                    data.data.Table[0].ID = HEADER_DTLS.ID;
                    $scope.GET_INV_RECO_CONTACT_MAPPING(data.data.Table[0]);//grid
                }
                else if ($scope.Inv_recon_Search.STEP_NO == 3) {
                    HEADER_DTLS.STEP_NO = data.data.Table[0].STEP_NO;
                    HEADER_DTLS.STATUS_ID = data.data.Table[0].STATUS_ID;
                    $scope.GET_INV_RECO_RECONCILE(HEADER_DTLS);
                }
                else if ($scope.Inv_recon_Search.STEP_NO == 4) {
                    HEADER_DTLS.STEP_NO = data.data.Table[0].STEP_NO;
                    HEADER_DTLS.STATUS_ID = data.data.Table[0].STATUS_ID;
                    data.data.Table[0].ONLY_SHOW_VARIANCE_INVOICES = 1;
                    $scope.GET_INV_RECO_RECONCILE(HEADER_DTLS);
                }
            }
        });
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
    $scope.INS_UPD_INV_RECO_CONTACT_MAPPING = function () {
        var CustmObj = new Object();
        CustmObj.TABLE_ID = $scope.Inv_recon_Search.TABLE_ID;
        CustmObj.HEADER_ID = $scope.HEADER_ID;
        CustmObj.ENTITY_ID = $scope.Inv_recon_Search.ENTITY_ID;
        CustmObj.BRANCH_ID = $scope.Inv_recon_Search.BRANCH_ID;
        CustmObj.CONTACT_NAME = $scope.SELECTED_CONTACT.CONTACT;/// take form grid contact name 
        var supplierdtls = $scope.XERO_CONTACTS_LIST.filter(function (x) { return x.CONTACT_NAME == $scope.Inv_recon_Search.CONTACT_NAME });
        if (supplierdtls.length > 0) {
            CustmObj.XERO_CONTACT_ID = supplierdtls[0].XERO_CONTACT_ID;
        }
        CustmObj.INTEGRATION_SYSTEM_ID = $scope.Inv_recon_Search.INTEGRATION_SYSTEM_ID;
        CustmObj.USER_ID = parseInt($cookies.get("USERID"));
        CustmObj.DELETE_FLAG = 0;//--1 FOR DELETE ELSE 0
        CustmObj.MAP_CONTACT = $scope.Inv_recon_Search.IS_MAP_RECORD ? 1 : 0;
        CustmObj.LINE_TABLE_ID = $scope.SELECTED_CONTACT.LINE_TABLE_ID;
        if (supplierdtls.length > 0) {
            PrcCommMethods.CASHUP_API(CustmObj, 'INS_UPD_INV_RECO_CONTACT_MAPPING').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.Inv_recon_Search.STEP_NO = data.data.Table[0].STEP_NO
                    if ($scope.Inv_recon_Search.STEP_NO == 2) {
                        data.data.Table[0].ID = $scope.HEADER_ID;
                        $scope.GET_INV_RECO_CONTACT_MAPPING(data.data.Table[0]);
                    }
                    else if ($scope.Inv_recon_Search.STEP_NO == 3) {
                        data.data.Table[0].ID = $scope.HEADER_ID;
                        $scope.Inv_recon_Search.STATUS_ID = data.data.Table[0].STATUS_ID;
                        $scope.GET_INV_RECO_RECONCILE(data.data.Table[0]);
                    }
                    else if ($scope.Inv_recon_Search.STEP_NO == 4) {
                        data.data.Table[0].ID = $scope.HEADER_ID;
                        $scope.Inv_recon_Search.STATUS_ID = data.data.Table[0].STATUS_ID;
                        $scope.GET_INV_RECO_RECONCILE(data.data.Table[0]);
                    }

                    $scope.STEP_PROCESS($scope.Inv_recon_Search.STEP_NO);
                    $('#mismatch').modal('hide')
                }
            });
        }
        else {
            $scope.$parent.ShowAlert('Error', "Invalid Supplier", 5000);
        }
    }

  

    $scope.DOWNLOAD_TEMPLATE_INV_REC = function () {
        ModelObj = new Object();
        ModelObj.FILE_NAME = "INV_RECO";
        ModelObj.FILE_PATH = "INV_RECO";
        ModelObj.EXCEL_DATATABLE = $scope.INV_RECO_UPLOAD_DETAILS_TYPE;
        ModelObj.UPLOADE_TYPE_ID = $scope.Inv_recon_Search.UPLOADE_TYPE_ID;
        PrcCommMethods.HR_API(ModelObj, 'DOWNLOAD_OPENXML_UPLOAD').then(function (data) {
            $scope.SERVER_FILE_PATH = '/' + data.data.FOLDER_NAME + data.data.RETURN_FILE_NAME;
            $scope.FILE_NAME = ModelObj.FILE_NAME;
            //window.location.assign($scope.SERVER_FILE_PATH);
            var url = $scope.SERVER_FILE_PATH;
            window.open(url, $scope.FILE_NAME);
        });
    }
    $scope.SubmiteUpload = true;
    $scope.INV_RECO_UPLOAD_DETAILS_LIST = [];
    $scope.EXCEL_INV_RECO_VALIDATE = function () {
        $scope.INVALID_EXCLE_CELL_FLAG = false;
        $scope.SubmiteUpload = true;
        $scope.COPY_CODE_ARRY = [];
        $scope.CODE_ARRY = [];
        $scope.INVALID_EXCLE_CELL_COUNT = null;
        $scope.INV_RECO_UPLOAD_DETAILS_LIST = [];
        $scope.DUPLICATE_INVOICE_CONTACT_LIST = [];
        $scope.ERROR_LIST = [];
        if (document.getElementById('Inv_recorduploadExcel1').value != null && document.getElementById('Inv_recorduploadExcel1').value != '') {
            ModelObj = new Object();
            ModelObj.UPLOAD_TYPE_ID = 1;
            ModelObj.SERVER_FILE_NAME = $scope.Inv_recon_Search.UploadedFiles[0].SERVER_FILE_NAME;
            ModelObj.ORIGINAL_FILE_NAME = $scope.Inv_recon_Search.UploadedFiles[0].ORIGINAL_FILE_NAME;
            ModelObj.FILE_PATH = $scope.Inv_recon_Search.UploadedFiles[0].FILE_PATH + $scope.Inv_recon_Search.UploadedFiles[0].SERVER_FILE_NAME;
            ModelObj.DATETIME_FORMAT_CULTURE = ["MM/dd/yyyy hh:mm:ss tt", "M/d/yyyy hh:mm:ss tt", "MM/dd/yyyy", "M/d/yyyy"];
            ModelObj.LANGUAGE_SYMBOL = $scope.$parent.LANGUAGE_SYMBOL;
            ModelObj.FROM_DATE = $scope.Inv_recon_Search.FROM_DATE;
            ModelObj.TO_DATE = $scope.Inv_recon_Search.TO_DATE;
            ModelObj.EXCEL_DATATABLE = $scope.INV_RECO_UPLOAD_DETAILS_TYPE;
            PrcCommMethods.CASHUP_API(ModelObj, 'EXCEL_INV_RECO_VALIDATE').then(function (data) {
                $scope.INV_RECO_UPLOAD_DETAILS_LIST = [];
                $scope.submitted = true;
                $scope.INVALID_EXCLE_CELL_COUNT = null;
                $scope.ERROR_LIST = data.data.errorlogobj;

                if (data.data.IS_VALID_COUNT > 0) {
                    $scope.INVALID_EXCLE_CELL_COUNT = parseInt(data.data.IS_VALID_COUNT);
                    $scope.INVALID_EXCLE_CELL_FLAG = true;
                }
                else if (data.data.error == "CODE_MAX001") {
                    $scope.$parent.ShowAlert('Error', 'Please select correct From Date ', 1000);
                }
                else if (data.data.error == "CODE_MIN001") {
                    $scope.$parent.ShowAlert('Error', 'Please select correct From Date ', 1000);
                }
                else if (data.data.error == "CODE_DUP001") {
                    $scope.$parent.ShowAlert('Warning', 'Duplicate invoice and supplier found', 3000);
                    $scope.submitted = false;
                    $scope.IS_VALID_UPLOAD_FILE = false;
                    $scope.INV_RECO_UPLOAD_DETAILS_LIST = data.data.HEADER_CLOUMN_NAMES;
                    $scope.DUPLICATE_INVOICE_CONTACT_LIST = data.data.DUPLICATE_DTLS;
                }
                else if (data.data.error == "CODE0001") {
                    $scope.$parent.ShowAlert('Warning', 'No changes found in uploaded Excel', 3000);
                    $scope.submitted = false;
                    $scope.IS_VALID_UPLOAD_FILE = false;
                }
                else if (data.data.error == "CODE0003") {
                    $scope.$parent.ShowAlert('Warning', 'Some thing worng in excel or Enable editing mode in excel', 3000);
                    $scope.submitted = false;
                    $scope.IS_VALID_UPLOAD_FILE = false;
                    if (data.data.Msg == 'A malformed URI was found in the document. Please provide a OpenSettings.RelationshipErrorRewriter to handle these errors while opening a package.') {
                        $scope.Message = "";
                        var List = { DISPLAY_TEXT: "", IS_VALID: false, IS_DATA_VALID: true, CODE: "CODE0003" };
                        $scope.CODE_ARRY.push(List);
                        $scope.COPY_CODE_ARRY.push(List);
                    };
                }
                else if (data.data.error == "CODE0002") {
                    $scope.$parent.ShowAlert('Warning', 'Invalid Excel,either the column header is deleted or mismatch', 3000);
                    $scope.submitted = false;
                    $scope.IS_VALID_UPLOAD_FILE = false;
                }
                else if (data.data.HEADER_CLOUMN_NAMES.length == 0) {
                    $scope.$parent.ShowAlert('Warning', 'No record found', 3000);
                    $scope.submitted = false;
                    $scope.IS_VALID_UPLOAD_FILE = false;
                }
                else {
                    $scope.INV_RECO_UPLOAD_DETAILS_LIST = data.data.HEADER_CLOUMN_NAMES;
                    $scope.INVALID_EXCLE_CELL_FLAG = false;
                    $scope.INVALID_EXCLE_CELL_COUNT = parseInt(data.data.IS_VALID_COUNT);
                    $scope.$parent.ShowAlert('Success', 'File validated successfully,please click on submit', 5000);
                    $scope.INS_INV_RECO_UPLOAD();
                    angular.element("input[id=Inv_recorduploadExcel1]").val(null);
                }
            });
        }
        else {
            $scope.$parent.ShowAlert('Attention', 'Please Upload File', 3000);
        }
    };

    $scope.REMOVE_INV_RECO_CONTACT_MAPPING = function (LINE) {
        if (confirm('Are you sure?')) {
            angular.forEach($scope.INV_RECO_UPLOAD_DETAILS_LIST, function (x, index) {
                if (x.IS_REMOVE_DUP_CHECK) {
                    x.DELETED = 1;
                    x.IS_MERG = true;
                }
                x.IS_REMOVE_DUP_CHECK = false;
            });
        }
    };
    $scope.MARG_INV_RECO_CONTACT_MAPPING = function () {
        $scope.SubmiteUpload = true;
        if (confirm('Are you sure?')) {
            var count = 1;
            var duplicateArray = [];
            var Amt = 0;
            angular.forEach($scope.INV_RECO_UPLOAD_DETAILS_LIST, function (x, index) {
                if (x.IS_REMOVE_DUP_CHECK) {
                    if (count == 1) {
                        count = parseInt(count) + $scope.INV_RECO_UPLOAD_DETAILS_LIST.length;
                    }
                    Amt = parseFloat(parseFloat(Amt) + parseFloat(x.NET_AMOUNT)).toFixed(5);
                    x.MERGED_ROWNUM = count;
                    var r = angular.copy(x);
                    duplicateArray.push(r);
                    x.DELETED = 1;
                    x.IS_REMOVE_DUP_CHECK = false;
                };
            });
            var row = duplicateArray[0];
            row.NET_AMOUNT = Amt;
            row.ROWNUM = count;
            row.MERGED_ROWNUM = 0;
            row.DELETED = 0;
            row.IS_REMOVE_DUP_CHECK = false;
            row.IS_MERGE = true;
            $scope.INV_RECO_UPLOAD_DETAILS_LIST.push(row);
            //var List = $scope.INV_RECO_UPLOAD_DETAILS_LIST.filter(function (x) { return parseInt(x.IS_DUPLICATE) > 0 && parseInt(x.IS_MERG) == 0 });
            //if (List.length == 0) {
            //    $scope.SubmiteUpload = false;
            //}
        }
    }
    $scope.$on('ngRepeatFinishedRender', function (ngRepeatFinishedEvent) {
        $scope.COMMON_CODE_CHANGE();
    });
    $scope.ngintvalidationvalue = function (key, value) {

        var List
        if (value == "<i class='fa fa-exclamation-triangle text-danger'></i>") {
            List = { DISPLAY_TEXT: "", IS_VALID: true };
        }
        else {
            if (key == "COMMENTS") {

            }
            var val = value.split(':;:');
            if (val.length > 1) {
                if (val[1] == "DDL0004") {
                    List = { DISPLAY_TEXT: val[0], IS_VALID: false, IS_DATA_VALID: true, CODE: val[1], Suggestion: val, D_COLUMN_NAME: val[2] };
                    $scope.COPY_CODE_ARRY.push(List);
                }
                else {
                    List = { DISPLAY_TEXT: val[0], IS_VALID: false, IS_DATA_VALID: true, CODE: val[1], Suggestion: val };
                    $scope.COPY_CODE_ARRY.push(List);
                }
            }
            else {
                if (key == "NI Number" && value != '' || key == "NI Number*" && value != '') {
                    const repeatRegex = /^[A-CEGHJ-PR-TW-Z]{1}[A-CEGHJ-NPR-TW-Z]{1}[0-9]{6}[A-D]{1}$/i;
                    var found = value.match(repeatRegex);
                    if (found == null) {
                        List = { DISPLAY_TEXT: value, IS_VALID: false, IS_DATA_VALID: true, CODE: "INVALID0011" };
                        $scope.COPY_CODE_ARRY.push(List);
                    }
                    else {
                        List = { DISPLAY_TEXT: value, IS_VALID: false };
                    }
                }
                else {
                    if (key == "RESERVATION_DATE" || key == "CREATED_DATE") {
                        value = value.split(' ')[0];
                    }
                    List = { DISPLAY_TEXT: value, IS_VALID: false };
                }
            }
        }
        return List;
    }

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
    $scope.INV_UPLOAD_FILE_DETAILS_FY = function (INV) {
        $location.path('Inv_Upload_File').search({ HEADER_ID: INV.ID })
    }
    $scope.BACK_RECO = function () {
        $location.path('InvUpload')
    }
    $scope.DISCARD_INV_RECO_UPLOAD = function (INV) {
        var CustmObj = new Object();
        CustmObj.HEADER_ID = INV.ID;
        CustmObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.CASHUP_API(CustmObj, 'DISCARD_INV_RECO_UPLOAD').then(function (data) {
            $scope.GET_INV_RECO_UPLOAD();
        });
    }
    $scope.$parent.child_scope = $scope;
    $scope.COMMON_CODE_CHANGE();

});
