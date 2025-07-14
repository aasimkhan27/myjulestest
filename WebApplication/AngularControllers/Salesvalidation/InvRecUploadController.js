app.controller('InvUploadController', function ($scope, $http, $interval, CommService, $cookies, $filter, PrcCommMethods, $location, readFileData, $localStorage) {
    $(".tooltip").remove();
    $scope.INV_RECO_UPLOAD_DETAILS_TYPE = [{ ID: 1, COLUMN_NAME: 'ACCOUNT', MATCH_COLUMN_NAME: 'ACCOUNT', IS_MANDATORY: true, HEADER_NAME: 'ACCOUNT', FIELD_TYPE_ID: 2, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true, FIELD_MASTER_ID: 1 },
    { ID: 2, COLUMN_NAME: 'CONTACT', MATCH_COLUMN_NAME: 'CONTACT', IS_MANDATORY: true, HEADER_NAME: 'CONTACT', FIELD_TYPE_ID: 2, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true, FIELD_MASTER_ID: 1 },
    { ID: 3, COLUMN_NAME: 'DATE', MATCH_COLUMN_NAME: 'DATE', IS_MANDATORY: true, HEADER_NAME: 'DATE', FIELD_TYPE_ID: 9, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true, FIELD_MASTER_ID: 1 },
    { ID: 5, COLUMN_NAME: 'INVOICE_NUMBER', MATCH_COLUMN_NAME: 'INVOICE_NUMBER', IS_MANDATORY: true, HEADER_NAME: 'INVOICE_NUMBER', FIELD_TYPE_ID: 2, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true, FIELD_MASTER_ID: 1 },
    { ID: 6, COLUMN_NAME: 'NET_AMOUNT', MATCH_COLUMN_NAME: 'NET_AMOUNT', IS_MANDATORY: true, HEADER_NAME: 'NET_AMOUNT', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true, FIELD_MASTER_ID: 1 }];
    $scope.INTEGRATION_SYSTEM_LIST = [{ INTEGRATION_SYSTEM_ID: 25, NAME: 'Demo Test' }];
    $scope.STATUS_LIST = [{ ID: 1, NAME: 'Matched', class: 'badge-success', check: false }, { ID: 0, NAME: 'Missing in Xero', class: 'badge-light-purple', check: false }, { ID: 7, NAME: 'Probable', class: 'badge-light-orange', check: false }, { ID: 8, NAME: 'Manual', class: 'badge-light-green', check: false }];
    $scope.Inv_recon_Search = {
        PAGE_TITLE: "Upload",
        STATUS_NAME: "",
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        PAGE_NO_ID: 1,
        PAGE_SIZE_ID: 10,
        UploadedFiles: [],
        INTEGRATION_SYSTEM_ID: 25,
        UPLOADE_TYPE_ID: 29,
        ENTITY_ID: parseInt($cookies.get("ENTITY_ID")),
        ENTITY_NAME: parseInt($cookies.get("ENTITY_NAME")),
        FILTER_STATUS_ID: null,
        FILTER_CONTACT_ALL: 'All',
        CUSTOM_STEP_NO: 1,
        STEP_NO: 1,
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
            STEP_NO: 1,
        }
        UploadstartDate = moment().subtract(1, 'days');//moment().startOf('isoWeek');//moment().subtract(6, 'days');
        UploadendDate = moment().subtract(1, 'days'); //moment().subtract(0, 'days');
        $scope.$parent.SetUpDateRangeMultiDatePicker('reportrange', UploadstartDate, UploadendDate, reportrange);
        $('#reportrange span').html(UploadstartDate.format($scope.$parent.Datelocaleformat.format) + ' - ' + UploadendDate.format($scope.$parent.Datelocaleformat.format));
        angular.element("input[id=Inv_recorduploadExcel1]").val(null);
        if ($scope.BRANCH_LIST.length > 0) {
            $scope.Inv_recon_Search.BRANCH_ID = $scope.BRANCH_LIST[0].BRANCH_ID;
        };
    }
    $scope.BRANCH_LIST = JSON.parse($localStorage.BRANCH_LOGIN_LIST);
    $scope.BRANCH_LIST_VIEW = angular.copy($scope.BRANCH_LIST);
    if ($scope.BRANCH_LIST.length > 0) {
        $scope.Inv_recon_Search.BRANCH_ID = $scope.BRANCH_LIST[0].BRANCH_ID;
    }

    $scope.HEADER_ID = getUrlParameter('HEADER_ID', $location.absUrl());

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

    $scope.INV_RECO_RECONCILE_HEADER_DTLS = {};



    $scope.CATEGORY_MASTER_LIST = [];
    $scope.GET_CATEGORY_MASTER = function () {
        var CustmObj = new Object();
        CustmObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
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
                    $scope.Inv_recon_Search.STATUS_ID = data.data.Table[0].STATUS_ID;
                    $scope.Inv_recon_Search.STATUS_NAME = data.data.Table[0].STATUS_NAME;
                    $scope.$parent.STEP_PROCESS($scope.Inv_recon_Search.STEP_NO);
                    $('#reportrange span').html($filter('date')(new Date($scope.Inv_recon_Search.FROM_DATE)) + ' - ' + $filter('date')(new Date($scope.Inv_recon_Search.TO_DATE)));
                }
                $scope.Inv_recon_Search.BRANCH_ID = (data.data.Table[0].BRANCH_ID);
                //if ($scope.Inv_recon_Search.STEP_NO == 2) {
                //    data.data.Table[0].ID = HEADER_ID;
                //    $scope.$parent.INV_REC_PAGE_LOAD(data.data.Table[0]);
                //    $scope.GET_INV_RECO_CONTACT_MAPPING(data.data.Table[0]);
                //}
                //else if ($scope.Inv_recon_Search.STEP_NO == 3 || $scope.Inv_recon_Search.STEP_NO == 4) {
                //    $scope.Inv_recon_Search.STATUS_ID = data.data.Table[0].STATUS_ID;
                //    $scope.$parent.INV_REC_PAGE_LOAD(data.data.Table[0]);
                //}
            }
        });
    };

    if ($scope.HEADER_ID != undefined) {
        $scope.GET_INV_RECO_UPLOAD_HEADER_BY_ID($scope.HEADER_ID);
    }
    else {
        $scope.Inv_recon_Search.STEP_NO = 1;
        $scope.$parent.STEP_PROCESS(1);
    }
    $scope.PROCESS_INV_RECO_CONTACT_MAPPING = function (HEADER_DTLS) {
        var CustmObj = new Object();
        CustmObj.HEADER_ID = HEADER_DTLS.ID;
        CustmObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.CASHUP_API(CustmObj, 'PROCESS_INV_RECO_CONTACT_MAPPING').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.Inv_recon_Search.STEP_NO = (data.data.Table[0].STEP_NO);
                $scope.Inv_recon_Search.BRANCH_ID = (HEADER_DTLS.BRANCH_ID);
                $scope.HEADER_ID = HEADER_DTLS.ID;

                if ($scope.Inv_recon_Search.STEP_NO == 2) {
                    data.data.Table[0].ID = HEADER_DTLS.ID;
                    $scope.GET_INV_RECO_CONTACT_MAPPING(data.data.Table[0]);//grid
                }
                HEADER_DTLS.STEP_NO = data.data.Table[0].STEP_NO;
                HEADER_DTLS.STATUS_ID = data.data.Table[0].STATUS_ID;
                data.data.Table[0].ID = HEADER_DTLS.ID;
                $scope.$parent.STEP_PROCESS($scope.Inv_recon_Search.STEP_NO, HEADER_DTLS);
                $scope.$parent.INV_REC_PAGE_LOAD(data.data.Table[0]);
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

                    $scope.$parent.STEP_PROCESS($scope.Inv_recon_Search.STEP_NO);
                    $('#mismatch').modal('hide')
                }
            });
        }
        else {
            $scope.$parent.ShowAlert('Error', "Invalid Supplier", 5000);
        }
    }

    $scope.RESET_RECO_UPLOAD_VIEW = function () {
        $scope.Inv_recon_Search.PAGE_NO_ID = 1;
        $scope.Inv_recon_Search.PAGE_SIZE_ID = 10;
        $scope.Inv_recon_Search.BRANCH_ID_FILTER = null;
        $scope.Inv_recon_Search.FILE_NAME_FILTER = null;
        startDate = moment().startOf('month');//moment().startOf('isoWeek');//moment().subtract(6, 'days');
        endDate = moment().endOf('month'); //moment().subtract(0, 'days');

        $scope.$parent.SetUpDateRangeMultiDatePicker('reportrangeInvRecView', startDate, endDate, reportrangeCoverView);
        $scope.$parent.SetUpDateRangeMultiDatePicker('reportrangeInvRecView', startDate, endDate, reportrangeCoverView);

    }

    $scope.INS_INV_RECO_UPLOAD = function (FLAG) {
        var value = true;
        var count = 0;
        if (!(moment($scope.Inv_recon_Search.MAX_DATE).isBetween(moment($scope.Inv_recon_Search.FROM_DATE), moment($scope.Inv_recon_Search.TO_DATE), undefined, '[]'))) {
            count = 1;
            value = false;
        }
        if (!(moment($scope.Inv_recon_Search.MIN_DATE).isBetween(moment($scope.Inv_recon_Search.FROM_DATE), moment($scope.Inv_recon_Search.TO_DATE), undefined, '[]'))) {
            count = 2;
            value = false;
        }
        if (count == 1 || count == 2) {
            $scope.$parent.ShowAlert('Error', 'Please select correct from date or To date', 5000);
        }

        if (count == 0) {
            value = confirm("Are you sure?");
        }
        if (value) {
            $scope.ERROR_LIST = [];
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
                    if (FLAG == 1) {
                        var obj = new Object();
                        obj.ID = data.data;
                        $scope.PROCESS_INV_RECO_CONTACT_MAPPING(obj)
                    }
                    else {
                        $location.path('InvRec_Upload').search({ HEADER_ID: data.data });
                    }
                };
                if (data.data == 0) {
                    $scope.$parent.ShowAlert('Error', $scope.SOMETHINGWENTWRONG, 5000);
                };
                $scope.$parent.overlay_loadingNew = 'none';
            });
        }
    };

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

        $scope.$parent.overlay_loadingNew = 'block';
        $scope.INVALID_EXCLE_CELL_FLAG = false;
        $scope.SubmiteUpload = true;
        $scope.COPY_CODE_ARRY = [];
        $scope.CODE_ARRY = [];
        $scope.INVALID_EXCLE_CELL_COUNT = null;
        $scope.INV_RECO_UPLOAD_DETAILS_LIST = [];
        $scope.INVALID_INVOICE_CONTACT_LIST = [];
        $scope.ERROR_LIST = [];
        if ($scope.Inv_recon_Search.UploadedFiles != undefined && $scope.Inv_recon_Search.UploadedFiles.length > 0 || document.getElementById('Inv_recorduploadExcel1').value != null && document.getElementById('Inv_recorduploadExcel1').value != '') {
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
                $scope.Inv_recon_Search.MAX_DATE = new Date(data.data.MAX_DATE);
                $scope.Inv_recon_Search.MIN_DATE = new Date(data.data.MIN_DATE);
                if ($scope.ERROR_LIST.length == 0) {
                    if (data.data.IS_VALID_COUNT > 0) {
                        $scope.INVALID_EXCLE_CELL_COUNT = parseInt(data.data.IS_VALID_COUNT);
                        $scope.INVALID_EXCLE_CELL_FLAG = true;
                        $scope.INVALID_INVOICE_CONTACT_LIST = data.data.HEADER_CLOUMN_NAMES;
                        $('#View_Report').modal('show');
                        $scope.$parent.overlay_loadingNew = 'none';
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
                }
                else {
                    $scope.INV_RECO_UPLOAD_DETAILS_LIST = data.data.HEADER_CLOUMN_NAMES;
                    $scope.$parent.overlay_loadingNew = 'none';
                }
            });
        }
        else {
            $scope.$parent.ShowAlert('Attention', 'Please Upload File', 3000);
        }
    };

    $scope.$on('ngRepeatFinishedRender', function (ngRepeatFinishedEvent) {
        $scope.COMMON_CODE_CHANGE();
    });
    $scope.ngintvalidationvalue = function (key, value) {
        var List
        if (value == "<i class='fa fa-exclamation-triangle text-danger'></i>") {
            List = { DISPLAY_TEXT: "", IS_VALID: true, CODE: 'BLANK' };
            $scope.COPY_CODE_ARRY.push(List);
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
                else if (val[0] == "UPLOAD0001") {
                    List = { DISPLAY_TEXT: value, IS_VALID: false };
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
                    List = { DISPLAY_TEXT: value, IS_VALID: false };
                }
            }
        }
        return List;
    };

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

    $scope.INV_UPLOAD_FILE_DETAILS_FY = function (INV) {
        $location.path('InvRec_Upload').search({ HEADER_ID: INV.ID })
    }
    $scope.BACK_UPLOAD = function () {
        window.location.href = '../Payment/SalesIndex#!/InvRec_List';
    }
    $scope.DISCARD_INV_RECO_UPLOAD = function (INV) {
        var CustmObj = new Object();
        CustmObj.HEADER_ID = INV.ID;
        CustmObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.CASHUP_API(CustmObj, 'DISCARD_INV_RECO_UPLOAD').then(function (data) {
            $scope.BACK_UPLOAD();
        });
    }
    $scope.$parent.child_scope = $scope;
    $scope.COMMON_CODE_CHANGE();

});
