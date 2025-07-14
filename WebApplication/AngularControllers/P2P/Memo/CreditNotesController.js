app.controller('CreditNotesController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $localStorage, pdfDelegate, $interval) {
    $(".modal-backdrop").remove();
    $scope.CreditNotesViewSearch = {
        NAME: '',
        PAGE_NO: 1,
        PAGE_NO_PROCESS: 1,
        PAGE_NO_ALL: 1,
        PAGE_SIZE: 20,
        UPLOADE_TYPE_ID: 31,
        UploadedFiles: [],
        FILTER_URGENT_REQUESTS: null,
        APPROVAL_TYPE_ID: 4,
    }
    $scope.temp_approver_grp_id = 0;
    $scope.APPROVAL_HEADER_ID = 0;
    $scope.HIDE_SHOW = false;
    $scope.TAX_TYPE = [{ ID: 1, NAME: 'Tax Exclusive' }, { ID: 2, NAME: 'Tax Inclusive' }];
    $scope.SPLIT_TYPE = [{ ID: 1, NAME: '2' }, { ID: 2, NAME: '3' }, { ID: 3, NAME: '4' }, { ID: 4, NAME: '5' }, { ID: 5, NAME: '6' }, { ID: 6, NAME: '7' }, { ID: 7, NAME: '8' }, { ID: 8, NAME: '9' }, { ID: 9, NAME: '10' }, { ID: 10, NAME: '11' }, { ID: 11, NAME: '12' }, { ID: 12, NAME: '13' }, { ID: 13, NAME: '14' }, { ID: 14, NAME: '15' }];

    if (window.location.href.toLowerCase().indexOf("p2p/p2pindex#!/p2pap") != -1) {
        $scope.CreditNotesViewSearch.APPROVAL_TYPE_ID = 4;
    }
    $scope.COMMENTS_LENGTH = 100;
    $scope.OTP_VALID_CHECK = 0; // JSON.parse($localStorage.ENTITY_SETTINGS).filter(x => x.SETTING_ID == 17)[0]["SETTING_VALUE"];
    $scope.TAB_FLAG = 1;
    $scope.PO_FOR_INVOICE_PO_MAPPING_LIST = [];
    $scope.SETTING_TOLERANCE_PER_44 = JSON.parse($localStorage.ENTITY_SETTINGS).filter(x => x.SETTING_ID == 44)[0]["SETTING_VALUE"];
    $scope.INVOICE_PO_MAPPING = [];
    $scope.P2P_BUDGET_LIST = [];
    $scope.PROC_P2P_BUDGET_LIST = [];
    $scope.GRN_ATTACHMENT = { IS_MULTI_FILE_UPLOAD_ALLOW: true, };
    $scope.PO_ATTACHMENT_IN_INVOICE = { IS_MULTI_FILE_UPLOAD_ALLOW: true, };
    $scope.OTHER_ATTACHMENT = { IS_MULTI_FILE_UPLOAD_ALLOW: true, };
    $scope.MATCHED_PO_MAPPING_LIST = [];
    $scope.MAPPED_LIST = [];
    $scope.BUDGET_LIST = [];
    $scope.PROCE_INVOICE_PO_MAPPING = [];
    $scope.PO_SPLIT_DATES_BY_INVOICE_LIST = [];
    $scope.LIMIT_TO = 500;
    $scope.COMMENTS_LIMIT_TO = 500;
    $scope.DESCRIPTION_LIMIT_TO = 500;
    $scope.CreditNotesViewSearch.NOTE_FOR_APPROVERS_LIMIT_TO = 500;
    $scope.EDIT_MATCH_BTN_SHOW = true;
    $scope.PO_MAPPED_LOAD = 1;

    $scope.ApprovalData = {
        GROUP_SORT_SEQUENCE: 0,
        ANY_ALL_FLAG: 0,
        Next_Approver_IDs: '',
        Auto_Approver_IDs: '',
        No_Action_Approver_IDs: '',
        CUR_APPROVAL_HEADER_STATUS_ID: 0,
        CUR_APP_SORT_ORDER: 0,
        RELEASE_FLAG: 0,
        ACTION_REQUIRED: 0,
        IS_REVIEWER: false,
    };
    $scope.APPROVED = 0;
    $scope.ON_APPROVAL = 0;
    $scope.ALLOCATED_BUDGET = 0;
    $scope.INVOICE_APPROVAL = 0;
    $scope.INVOICE_IN_APPROVAL = 0;
    $scope.SELECTED_BUDGET_LINE = {};

    //$scope.ALL_XERO_TRACKING_CATEGORIES = [];
    //$scope.ALL_XERO_TRACKING_CATEGORIES_OPTIONS = [];
    //$scope.ALL_SELECTED_XERO_TRACKING_CATEGORIES_OPTIONS = [];

    $scope.GET_APPROVAL_CUSTOM_FIELD_OPTIONS_MASTER = function (REQUEST_LINE, FLAG) {
        var CusModelObj = new Object();
        CusModelObj.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID = 0;
        CusModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CusModelObj.BRANCH_ID = REQUEST_LINE.BRANCH_ID;
        PrcCommMethods.P2P_API(CusModelObj, 'GET_APPROVAL_CUSTOM_FIELD_OPTIONS_MASTER', 'PO').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.XERO_TRACKING_CATEGORIES = data.data.MASTER;
                $scope.XERO_TRACKING_CATEGORIES_OPTIONS = data.data.Table;
                // $scope.$parent.overlay_loadingNew = 'none';
                $scope.GET_INVOICE_BY_ID(REQUEST_LINE, FLAG);
            }
            else {
                $scope.XERO_TRACKING_CATEGORIES = [];
                $scope.XERO_TRACKING_CATEGORIES_OPTIONS = [];
                // $scope.$parent.overlay_loadingNew = 'none';
                $scope.GET_INVOICE_BY_ID(REQUEST_LINE, FLAG);
            }
        });
    };

    $scope.GET_INVOICES_LAZY_LOAD = function () {
        $scope.GET_INVOICES_ACTION(2, 1, 1)
    }
    $scope.GET_INVOICES_PROCESS_LAZY_LOAD = function () {
        $scope.GET_INVOICES_PROCESS(2, 1, 1)
    }
    $scope.GET_INVOICES_ADMIN_LAZY_LOAD = function () {
        $scope.GET_INVOICES_ADMIN(2, 1, 1)
    }
    $scope.GET_PENDING_OUTBOUND_PROCESSING_INVOICES_LAZY_LOAD = function () {
        $scope.GET_PENDING_OUTBOUND_PROCESSING_INVOICES(2, 1, 1)
    }
    $scope.GET_INVOICES_ACTION = function (FLAG, SORT_COLUMN_NO, SORT_ORDER_NO_ASCDESC, SYNC_FLAG) {
        var ModelObj = new Object();
        if (FLAG == 1) {
            $scope.HEADERS_FOR_APPROVER_LIST = [];
            $scope.CreditNotesViewSearch.PAGE_NO = 1;
        }
        //--1 ALL, 2 FOR PENDING, 3 SUBMITTED FOR APPROVAL
        ModelObj.FLAG = 2;
        ModelObj.USER_ID = parseInt($cookies.get("USERID"));
        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        ModelObj.BRANCH_IDS = $scope.CreditNotesViewSearch.BRANCH_IDS
        ModelObj.STATUS_IDS = "";//$scope.CreditNotesViewSearch.STATUS_IDS == null ? '37, 38, 39' : $scope.CreditNotesViewSearch.STATUS_IDS;
        ModelObj.SEARCH_PARAMETER = $scope.CreditNotesViewSearch.SEARCH_NAME;
        ModelObj.PAGE_NO = $scope.CreditNotesViewSearch.PAGE_NO;
        ModelObj.PAGE_SIZE = $scope.CreditNotesViewSearch.PAGE_SIZE;
        ModelObj.INVOICE_TYPE_ID = 2;// --1 AP INVOICE, 2 AP CREDIT NOTE

        PrcCommMethods.P2P_API(ModelObj, 'GET_INVOICES', 'PO').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.$parent.overlay_loadingNew = 'none';
                $scope.HEADERS_FOR_APPROVER_LIST = $scope.HEADERS_FOR_APPROVER_LIST.concat(data.data.Table);
                if (FLAG == 1) {
                    $scope.AP_ACTION_CLICK($scope.HEADERS_FOR_APPROVER_LIST[0], SYNC_FLAG);
                }
                if (data.data.Table.length < $scope.CreditNotesViewSearch.PAGE_SIZE) {
                    $scope.GetActionData = false;
                }
                else {
                    $scope.CreditNotesViewSearch.PAGE_NO = parseInt($scope.CreditNotesViewSearch.PAGE_NO) + 1;
                    $scope.GetActionData = true;
                }
            } else {
                if ($scope.HEADERS_FOR_APPROVER_LIST.length == 0) { }
                $scope.GetActionData = false;
                $scope.$parent.overlay_loadingNew = 'none';
            }
        })
    }
    $scope.GET_INVOICES_PROCESS = function (FLAG, SORT_COLUMN_NO, SORT_ORDER_NO_ASCDESC) {
        if (FLAG == 1) {
            $scope.CreditNotesViewSearch.PAGE_NO_PROCESS = 1;
            $scope.PURCHASE_REQUESTS_PROCESS_LIST = [];
        }
        ModelObj = new Object();
        ModelObj.FLAG = 3;    //--1 ALL, 2 FOR PENDING, 3 SUBMITTED FOR APPROVAL
        ModelObj.USER_ID = parseInt($cookies.get("USERID"));
        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        ModelObj.BRANCH_IDS = $scope.CreditNotesViewSearch.BRANCH_IDS
        ModelObj.STATUS_IDS = "";// $scope.CreditNotesViewSearch.STATUS_IDS == null ? '37, 38, 39' : $scope.CreditNotesViewSearch.STATUS_IDS;
        ModelObj.PAGE_NO = $scope.CreditNotesViewSearch.PAGE_NO_PROCESS;
        ModelObj.PAGE_SIZE = $scope.CreditNotesViewSearch.PAGE_SIZE;
        ModelObj.SEARCH_PARAMETER = $scope.CreditNotesViewSearch.PROCESS_SEARCH_NAME;
        ModelObj.INVOICE_TYPE_ID = 2;// --1 AP INVOICE, 2 AP CREDIT NOTE
        PrcCommMethods.P2P_API(ModelObj, 'GET_INVOICES', 'PO').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.PURCHASE_REQUESTS_PROCESS_LIST = $scope.PURCHASE_REQUESTS_PROCESS_LIST.concat(data.data.Table);
                if (FLAG == 1) {
                    $scope.AP_PROCESSED_CLICK(data.data.Table[0]);
                }
                if (data.data.Table.length < $scope.CreditNotesViewSearch.PAGE_SIZE) {
                    $scope.GetProcessData = false;
                }
                else {
                    $scope.CreditNotesViewSearch.PAGE_NO_PROCESS = parseInt($scope.CreditNotesViewSearch.PAGE_NO_PROCESS) + 1;
                    $scope.GetProcessData = true;
                }
            }
            else {
                if ($scope.PURCHASE_REQUESTS_PROCESS_LIST.length == 0) { };
                $scope.GetProcessData = false;
            }
        });
    }
    $scope.GET_INVOICES_ADMIN = function (FLAG, SYNC_FLAG) {
        if (FLAG == 1) {
            $scope.CreditNotesViewSearch.PAGE_NO_ALL = 1;
            $scope.HEADERS_FOR_APPROVER_ADMIN_LIST = [];
        }
        ModelObj = new Object();
        //--1 ALL, 2 FOR PENDING, 3 SUBMITTED FOR APPROVAL
        ModelObj.FLAG = 1;
        ModelObj.USER_ID = parseInt($cookies.get("USERID"));
        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        ModelObj.BRANCH_IDS = $scope.CreditNotesViewSearch.BRANCH_IDS
        ModelObj.STATUS_IDS = "";
        ModelObj.PAGE_NO = $scope.CreditNotesViewSearch.PAGE_NO_ALL;
        ModelObj.PAGE_SIZE = $scope.CreditNotesViewSearch.PAGE_SIZE;
        ModelObj.SEARCH_PARAMETER = $scope.CreditNotesViewSearch.SEARCH_NAME_ALL;
        ModelObj.INVOICE_TYPE_ID = 2;// --1 AP INVOICE, 2 AP CREDIT NOTE
        PrcCommMethods.P2P_API(ModelObj, 'GET_INVOICES', 'PO').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.HEADERS_FOR_APPROVER_ADMIN_LIST = $scope.HEADERS_FOR_APPROVER_ADMIN_LIST.concat(data.data.Table);
                if (FLAG == 1) {
                    $scope.AP_ALL_ADMIN_CLICK(data.data.Table[0], SYNC_FLAG)
                }
                if (data.data.Table.length < $scope.CreditNotesViewSearch.PAGE_SIZE) {
                    $scope.GetAllData = false;
                }
                else {
                    $scope.CreditNotesViewSearch.PAGE_NO_ALL = parseInt($scope.CreditNotesViewSearch.PAGE_NO_ALL) + 1;
                    $scope.GetAllData = true;
                }
            }
            else {
                if ($scope.HEADERS_FOR_APPROVER_ADMIN_LIST.length == 0) { };
                $scope.GetAllData = false;
            }
        });
    }
    $scope.GET_PENDING_OUTBOUND_PROCESSING_INVOICES = function (FLAG) {
        if (FLAG == 1) {
            $scope.CreditNotesViewSearch.OUT_PAGE_NO = 1;
            $scope.PENDING_OUTBOUND_PROCESSING_INVOICES_LIST = [];
        }
        ModelObj = new Object();
        ModelObj.SEARCH_PARAMETER = $scope.CreditNotesViewSearch.SEARCH_NAME_OUT;
        ModelObj.STATUS_IDS = $scope.CreditNotesViewSearch.STATUS_IDS;
        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        ModelObj.BRANCH_IDS = $scope.CreditNotesViewSearch.BRANCH_IDS;
        ModelObj.USER_ID = parseInt($cookies.get("USERID"));
        ModelObj.PAGE_NO = $scope.CreditNotesViewSearch.OUT_PAGE_NO;
        ModelObj.PAGE_SIZE = $scope.CreditNotesViewSearch.PAGE_SIZE;
        ModelObj.INVOICE_TYPE_ID = 2;// --1 AP INVOICE, 2 AP CREDIT NOTE
        PrcCommMethods.P2P_API(ModelObj, 'GET_PENDING_OUTBOUND_PROCESSING_INVOICES', 'PO').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.PENDING_OUTBOUND_PROCESSING_INVOICES_LIST = $scope.PENDING_OUTBOUND_PROCESSING_INVOICES_LIST.concat(data.data.Table);
                if (FLAG == 1) {
                    $scope.AP_OUTBOUND_CLICK(data.data.Table[0])
                }
                if (data.data.Table.length < $scope.CreditNotesViewSearch.PAGE_SIZE) {
                    $scope.GetOutData = false;
                }
                else {
                    $scope.CreditNotesViewSearch.OUT_PAGE_NO = parseInt($scope.CreditNotesViewSearch.OUT_PAGE_NO) + 1;
                    $scope.GetOutData = true;
                }
            }
            else {
                if ($scope.PENDING_OUTBOUND_PROCESSING_INVOICES_LIST.length == 0) { };
                $scope.GetOutData = false;
            }
        });
    }
    $scope.GET_INVOICE_BY_ID = function (REQUEST_LINE, FLAG) {
        $scope.$parent.overlay_loadingNew = 'block';
        ModelObj = new Object();
        ModelObj.INVOICE_HEADER_ID = REQUEST_LINE.INVOICE_HEADER_ID;
        PrcCommMethods.P2P_API(ModelObj, 'GET_INVOICE_BY_ID', 'PO').then(function (data) {
            if (data.data.Table.length > 0) {
                data.data.Table[0].PAGING = REQUEST_LINE.PAGING;
                $scope.SELECTED_XERO_TRACKING_CATEGORIES_OPTIONS = [];
                $scope.SELECTED_OPTION_LIST_MASTER = [];
                var TAX_TYPEList = $scope.TAX_TYPE.filter(function (x) { return x.ID == data.data.Table[0].TAX_TYPE });
                if (TAX_TYPEList.length > 0) { data.data.Table[0].TAX_NAME = TAX_TYPEList[0].NAME; }
                $scope.SELECTED_OPTION_LIST_MASTER = $filter('unique')(data.data.Table2, 'APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID');
                if (data.data.Table2 != undefined && data.data.Table2.length > 0) {
                    $scope.SELECTED_XERO_TRACKING_CATEGORIES_OPTIONS = data.data.Table2;
                };
                if (FLAG == 1) {
                    $scope.CreditNotesViewSearch.REQUEST_DETAILS = data.data.Table[0];
                    $scope.CreditNotesViewSearch.REQUEST_DETAILS.BUDGET_DATE = ($scope.CreditNotesViewSearch.REQUEST_DETAILS.BUDGET_DATE == "" || $scope.CreditNotesViewSearch.REQUEST_DETAILS.BUDGET_DATE == null || $scope.CreditNotesViewSearch.REQUEST_DETAILS.BUDGET_DATE == undefined) ? $scope.CreditNotesViewSearch.REQUEST_DETAILS.INVOICE_DATE : data.data.Table3.length > 0 ? data.data.Table3[0].INVOICE_DATE : $scope.CreditNotesViewSearch.REQUEST_DETAILS.BUDGET_DATE;
                    $scope.CreditNotesViewSearch.REQUEST_DETAILS.IS_MULTI_FILE_UPLOAD_ALLOW = true;
                    $scope.CreditNotesViewSearch.REQUEST_DETAILS.INVOICE_HEADER_ID = REQUEST_LINE.INVOICE_HEADER_ID;
                    $scope.CreditNotesViewSearch.REQUEST_DETAILS.APPROVAL_HEADER_ID = REQUEST_LINE.APPROVAL_HEADER_ID;
                    REQUEST_LINE.ACTION_ITEM_LIST = data.data.Table1;
                    $scope.ACTION_ITEM_LIST = REQUEST_LINE.ACTION_ITEM_LIST;
                    $scope.$parent.GET_UPLOADS($scope.CreditNotesViewSearch.REQUEST_DETAILS, 33, REQUEST_LINE.INVOICE_HEADER_ID);
                    $scope.VIEW_INVOICE_DETAIL($scope.CreditNotesViewSearch.REQUEST_DETAILS, 2, 1);
                    //$scope.INVOICE_SPLIT_LIST = data.data.Table2
                    $scope.$parent.overlay_loadingNew = 'none';
                }
                else if (FLAG == 2) {

                    $scope.CreditNotesViewSearch.PROCESS_REQUEST_DETAILS = data.data.Table[0];
                    $scope.CreditNotesViewSearch.PROCESS_REQUEST_DETAILS.BUDGET_DATE = ($scope.CreditNotesViewSearch.PROCESS_REQUEST_DETAILS.BUDGET_DATE == "" || $scope.CreditNotesViewSearch.PROCESS_REQUEST_DETAILS.BUDGET_DATE == null || $scope.CreditNotesViewSearch.PROCESS_REQUEST_DETAILS.BUDGET_DATE == undefined) ? $scope.CreditNotesViewSearch.PROCESS_REQUEST_DETAILS.INVOICE_DATE : data.data.Table3.length > 0 ? data.data.Table3[0].INVOICE_DATE : $scope.CreditNotesViewSearch.PROCESS_REQUEST_DETAILS.BUDGET_DATE;

                    $scope.CreditNotesViewSearch.PROCESS_REQUEST_DETAILS.INVOICE_HEADER_STATUS_ID = REQUEST_LINE.INVOICE_HEADER_STATUS_ID;
                    $scope.CreditNotesViewSearch.PROCESS_REQUEST_DETAILS.SHORT_NAME = $scope.$parent.TextReturn($scope.CreditNotesViewSearch.PROCESS_REQUEST_DETAILS.REQUESTOR_NAME);
                    $scope.CreditNotesViewSearch.PROCESS_REQUEST_DETAILS.PO_ATTACHMENT_IN_INVOICE = { IS_MULTI_FILE_UPLOAD_ALLOW: true, };
                    $scope.CreditNotesViewSearch.PROCESS_REQUEST_DETAILS.GRN_ATTACHMENT = { IS_MULTI_FILE_UPLOAD_ALLOW: true, };
                    $scope.CreditNotesViewSearch.PROCESS_REQUEST_DETAILS.OTHER_ATTACHMENT = { IS_MULTI_FILE_UPLOAD_ALLOW: true, };
                    $scope.$parent.GET_UPLOADS($scope.CreditNotesViewSearch.PROCESS_REQUEST_DETAILS, 33, REQUEST_LINE.INVOICE_HEADER_ID);
                    $scope.$parent.GET_UPLOADS($scope.CreditNotesViewSearch.PROCESS_REQUEST_DETAILS.PO_ATTACHMENT_IN_INVOICE, 37, REQUEST_LINE.INVOICE_HEADER_ID);
                    $scope.$parent.GET_UPLOADS($scope.CreditNotesViewSearch.PROCESS_REQUEST_DETAILS.GRN_ATTACHMENT, 38, REQUEST_LINE.INVOICE_HEADER_ID);
                    $scope.$parent.GET_UPLOADS($scope.CreditNotesViewSearch.PROCESS_REQUEST_DETAILS.OTHER_ATTACHMENT, 39, REQUEST_LINE.INVOICE_HEADER_ID);
                    $scope.VIEW_INVOICE_DETAIL($scope.CreditNotesViewSearch.PROCESS_REQUEST_DETAILS, 2, 1);
                    $scope.$parent.overlay_loadingNew = 'none';
                    $scope.PROCESS_REQUEST_ITEMS_LIST = data.data.Table1;
                    $scope.INVOICE_PROCESS_SPLIT_LIST = data.data.Table3;
                    // $scope.GET_APPROVAL_CUSTOM_FIELD_OPTIONS_MASTER(REQUEST_LINE, 2);
                }
                else if (FLAG == 3) {
                    $scope.CreditNotesViewSearch.ALL_REQUEST_DETAILS = data.data.Table[0];
                    $scope.CreditNotesViewSearch.ALL_REQUEST_DETAILS.BUDGET_DATE = ($scope.CreditNotesViewSearch.ALL_REQUEST_DETAILS.BUDGET_DATE == "" || $scope.CreditNotesViewSearch.ALL_REQUEST_DETAILS.BUDGET_DATE == null || $scope.CreditNotesViewSearch.ALL_REQUEST_DETAILS.BUDGET_DATE == undefined) ? $scope.CreditNotesViewSearch.ALL_REQUEST_DETAILS.INVOICE_DATE : data.data.Table3.length > 0 ? data.data.Table3[0].INVOICE_DATE : $scope.CreditNotesViewSearch.ALL_REQUEST_DETAILS.BUDGET_DATE;

                    $scope.CreditNotesViewSearch.ALL_REQUEST_DETAILS.IS_MULTI_FILE_UPLOAD_ALLOW = true;
                    $scope.CreditNotesViewSearch.ALL_REQUEST_DETAILS.INVOICE_HEADER_STATUS_ID = REQUEST_LINE.INVOICE_HEADER_STATUS_ID;
                    $scope.CreditNotesViewSearch.ALL_REQUEST_DETAILS.SHORT_NAME = $scope.$parent.TextReturn($scope.CreditNotesViewSearch.ALL_REQUEST_DETAILS.REQUESTOR_NAME);
                    $scope.CreditNotesViewSearch.ALL_REQUEST_DETAILS.PO_ATTACHMENT_IN_INVOICE = { IS_MULTI_FILE_UPLOAD_ALLOW: true, };
                    $scope.CreditNotesViewSearch.ALL_REQUEST_DETAILS.GRN_ATTACHMENT = { IS_MULTI_FILE_UPLOAD_ALLOW: true, };
                    $scope.CreditNotesViewSearch.ALL_REQUEST_DETAILS.OTHER_ATTACHMENT = { IS_MULTI_FILE_UPLOAD_ALLOW: true, };
                    REQUEST_LINE.ALL_ITEM_LIST = data.data.Table1;
                    $scope.ALL_ITEM_LIST = REQUEST_LINE.ALL_ITEM_LIST;
                    // $scope.GET_APPROVAL_CUSTOM_FIELD_OPTIONS_MASTER(REQUEST_LINE, 2);
                    $scope.VIEW_INVOICE_DETAIL($scope.CreditNotesViewSearch.ALL_REQUEST_DETAILS, 2, 1);
                    $scope.$parent.GET_UPLOADS($scope.CreditNotesViewSearch.ALL_REQUEST_DETAILS, 33, REQUEST_LINE.INVOICE_HEADER_ID);
                    $scope.$parent.GET_UPLOADS($scope.CreditNotesViewSearch.ALL_REQUEST_DETAILS.PO_ATTACHMENT_IN_INVOICE, 37, REQUEST_LINE.INVOICE_HEADER_ID);
                    $scope.$parent.GET_UPLOADS($scope.CreditNotesViewSearch.ALL_REQUEST_DETAILS.GRN_ATTACHMENT, 38, REQUEST_LINE.INVOICE_HEADER_ID);
                    $scope.$parent.GET_UPLOADS($scope.CreditNotesViewSearch.ALL_REQUEST_DETAILS.OTHER_ATTACHMENT, 39, REQUEST_LINE.INVOICE_HEADER_ID);
                    $scope.$parent.overlay_loadingNew = 'none';
                    $scope.INVOICE_PROCESS_SPLIT_LIST = [];
                    $scope.INVOICE_PROCESS_SPLIT_LIST = data.data.Table3;

                }
                else if (FLAG == 4) {
                    $scope.CreditNotesViewSearch.OUT_REQUEST_DETAILS = data.data.Table[0];
                    $scope.CreditNotesViewSearch.OUT_REQUEST_DETAILS.IS_MULTI_FILE_UPLOAD_ALLOW = true;
                    $scope.CreditNotesViewSearch.OUT_REQUEST_DETAILS.OVERALL_STATUS_ID = REQUEST_LINE.OVERALL_STATUS_ID;
                    $scope.CreditNotesViewSearch.OUT_REQUEST_DETAILS.SHORT_NAME = $scope.$parent.TextReturn($scope.CreditNotesViewSearch.OUT_REQUEST_DETAILS.REQUESTOR_NAME);
                    $scope.CreditNotesViewSearch.OUT_REQUEST_DETAILS.PO_ATTACHMENT_IN_INVOICE = { IS_MULTI_FILE_UPLOAD_ALLOW: true, };
                    $scope.CreditNotesViewSearch.OUT_REQUEST_DETAILS.GRN_ATTACHMENT = { IS_MULTI_FILE_UPLOAD_ALLOW: true, };
                    $scope.CreditNotesViewSearch.OUT_REQUEST_DETAILS.OTHER_ATTACHMENT = { IS_MULTI_FILE_UPLOAD_ALLOW: true, };
                    REQUEST_LINE.OUT_ITEM_LIST = data.data.Table1;
                    $scope.OUT_ITEM_LIST = REQUEST_LINE.OUT_ITEM_LIST;
                    $scope.VIEW_INVOICE_DETAIL($scope.CreditNotesViewSearch.OUT_REQUEST_DETAILS, 2, 1);
                    $scope.$parent.GET_UPLOADS($scope.CreditNotesViewSearch.OUT_REQUEST_DETAILS, 33, REQUEST_LINE.INVOICE_HEADER_ID);
                    $scope.$parent.GET_UPLOADS($scope.CreditNotesViewSearch.OUT_REQUEST_DETAILS.PO_ATTACHMENT_IN_INVOICE, 37, REQUEST_LINE.INVOICE_HEADER_ID);
                    $scope.$parent.GET_UPLOADS($scope.CreditNotesViewSearch.OUT_REQUEST_DETAILS.GRN_ATTACHMENT, 38, REQUEST_LINE.INVOICE_HEADER_ID);
                    $scope.$parent.GET_UPLOADS($scope.CreditNotesViewSearch.OUT_REQUEST_DETAILS.OTHER_ATTACHMENT, 39, REQUEST_LINE.INVOICE_HEADER_ID);
                    $scope.$parent.overlay_loadingNew = 'none';
                    $scope.INVOICE_PROCESS_SPLIT_LIST = data.data.Table3;

                }
            }
        });
    }

    $scope.GET_PO_SPLIT_DATES_BY_INVOICE_ID = function (REQUEST_LINE) {
        ModelObj = new Object();
        ModelObj.INVOICE_HEADER_ID = REQUEST_LINE.INVOICE_HEADER_ID;
        PrcCommMethods.P2P_API(ModelObj, 'GET_PO_SPLIT_DATES_BY_INVOICE_ID', 'PO').then(function (data) {
            if (data.data.Table.length > 0) {
                var LINE = $scope.CreditNotesViewSearch.REQUEST_DETAILS;
                $scope.PO_SPLIT_DATES_BY_INVOICE_LIST = data.data.Table;
                $scope.MONTH_LIST = data.data.Table;
                if (data.data.Table.length > 0) {
                    angular.forEach($scope.MONTH_LIST, function (_m) {
                        _m.ITEM_LIST = [];
                        _m.ITEM_LIST = $scope.TAB_FLAG == 1 ? angular.copy($scope.ACTION_ITEM_LIST) : angular.copy($scope.ALL_ITEM_LIST);
                        angular.forEach(_m.ITEM_LIST, function (_val_item, index) {
                            _val_item.ITEM_INDEX = index;
                            taxAmount = LINE.TAX_TYPE == 3 ? 0.00 : (LINE.TAX_TYPE == 2 ? ((((_val_item.UNIT_PRICE * _val_item.QUANTITY) / (1 + (_val_item.TAX_RATE == undefined ? 0 : _val_item.TAX_RATE / 100))) - (((_val_item.UNIT_PRICE * _val_item.QUANTITY) / (1 + (_val_item.TAX_RATE == undefined ? 0 : _val_item.TAX_RATE / 100))) * (_val_item.DISCOUNT_PERCENT / 100))) * (_val_item.TAX_RATE == undefined ? 0 : _val_item.TAX_RATE / 100)) : (((_val_item.UNIT_PRICE * _val_item.QUANTITY) - ((_val_item.UNIT_PRICE * _val_item.QUANTITY) * (_val_item.DISCOUNT_PERCENT / 100))) * (_val_item.TAX_RATE == undefined ? 0 : _val_item.TAX_RATE / 100)));
                            amount = ((_val_item.QUANTITY * 1 * _val_item.UNIT_PRICE * 1) - (_val_item.QUANTITY * 1 * _val_item.UNIT_PRICE * 1 * (_val_item.DISCOUNT_PERCENT) / 100))
                            _val_item.BUDGET = parseFloat($scope.SETTING_USE_GROSS == 1 ? (amount + (LINE.TAX_TYPE == 2 ? 0 : taxAmount)) / ($scope.MONTH_LIST.length) : LINE.TAX_TYPE == 2 ? parseFloat((amount - taxAmount) / ($scope.MONTH_LIST.length)).toFixed(2) : parseFloat(amount / ($scope.MONTH_LIST.length))).toFixed(2);
                            _val_item.PO_SPLIT_ACCOUNT_ID = _val_item.ACCOUNT_ID;
                        });
                    });
                }
                $('#Approved_Reject_POP').modal('show');

            } else {
                $('#Approved_Reject_POP').modal('show');
            };
        });
    }
    $scope.GET_INVOICE_PO_MAPPING = function (REQUEST, FLAG) {
        var PaymentModelObj = new Object();
        PaymentModelObj.TYPE = 1;// --1 FOR INVOICE AND 2 FOR PO
        PaymentModelObj.REFERENCE_ID = REQUEST.INVOICE_HEADER_ID;
        PaymentModelObj.PROJECT_MASTER_ID = REQUEST.PROJECT_MASTER_ID;
        PrcCommMethods.P2P_API(PaymentModelObj, 'GET_INVOICE_PO_MAPPING', 'PO').then(function (data) {
            if (data.data.Table.length > 0) {
                if (FLAG == 1) {
                    $scope.INVOICE_PO_MAPPING = [];
                    $scope.INVOICE_PO_MAPPING = data.data.Table;
                }
                else if (FLAG == 2) {
                    $scope.PROCE_INVOICE_PO_MAPPING = [];
                    $scope.PROCE_INVOICE_PO_MAPPING = data.data.Table;
                }
                else if (FLAG == 3) {
                    $scope.INVOICE_PO_MAPPING = [];
                    $scope.INVOICE_PO_MAPPING = data.data.Table;
                }
                else if (FLAG == 4) {
                    $scope.INVOICE_PO_MAPPING = [];
                    $scope.INVOICE_PO_MAPPING = data.data.Table;
                }
                $scope.GET_APPROVAL_CUSTOM_FIELD_OPTIONS_MASTER(REQUEST, FLAG)
            }
            else {
                if (FLAG == 1) {
                    $scope.INVOICE_PO_MAPPING = [];
                    $scope.PO_MAPPED_LOAD = 2;
                }
                else if (FLAG == 2) {
                    $scope.PROCE_INVOICE_PO_MAPPING = [];
                }
                else if (FLAG == 3) {
                    $scope.INVOICE_PO_MAPPING = [];
                }
                else if (FLAG == 4) {
                    $scope.INVOICE_PO_MAPPING = [];
                }
                $scope.GET_APPROVAL_CUSTOM_FIELD_OPTIONS_MASTER(REQUEST, FLAG)
            }

        })
    }
    $scope.GET_PO_FOR_INVOICE_PO_MAPPING = function (FLAG, LOAD_FLAG) {
        var PaymentModelObj = new Object();
        PaymentModelObj.CONTACT_ID = $scope.TAB_FLAG == 1 ? $scope.CreditNotesViewSearch.REQUEST_DETAILS.CONTACT_ID : $scope.CreditNotesViewSearch.ALL_REQUEST_DETAILS.CONTACT_ID;    //@  INT,
        PaymentModelObj.CURRENCY_ID = $scope.TAB_FLAG == 1 ? $scope.CreditNotesViewSearch.REQUEST_DETAILS.CURRENCY_ID : $scope.CreditNotesViewSearch.ALL_REQUEST_DETAILS.CURRENCY_ID;  //@ INT,
        PaymentModelObj.AMOUNT_FROM = $scope.CreditNotesViewSearch.AMOUNT_FROM;//@ NUMERIC(18, 5), 
        PaymentModelObj.AMOUNT_TO = $scope.CreditNotesViewSearch.AMOUNT_TO; //@ NUMERIC(18, 5), 
        PaymentModelObj.DATE_FROM = $scope.CreditNotesViewSearch.DATE_FROM;  //@ DATE,
        PaymentModelObj.DATE_TO = $scope.CreditNotesViewSearch.DATE_TO;  //@ DATE,
        PaymentModelObj.PO_NUMBER = $scope.CreditNotesViewSearch.PO_NUMBER;
        PaymentModelObj.PROJECT_MASTER_ID = $scope.TAB_FLAG == 1 ? $scope.CreditNotesViewSearch.REQUEST_DETAILS.PROJECT_MASTER_ID : $scope.CreditNotesViewSearch.ALL_REQUEST_DETAILS.PROJECT_MASTER_ID;
        PrcCommMethods.P2P_API(PaymentModelObj, 'GET_PO_FOR_INVOICE_PO_MAPPING', 'PO').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.PO_FOR_INVOICE_PO_MAPPING_LIST = data.data.Table;
                if (FLAG == 1) {
                    angular.forEach($scope.PO_FOR_INVOICE_PO_MAPPING_LIST, function (invoicemapping, index) {
                        var _INVOICE_PO_MAPPING = $scope.INVOICE_PO_MAPPING.filter(function (x) { return x.PO_HEADER_ID == invoicemapping.PO_HEADER_ID });
                        if (_INVOICE_PO_MAPPING.length > 0) {
                            invoicemapping.IS_SELECTED = true;
                            $scope.PO_CLICK_FY(invoicemapping, 1, LOAD_FLAG, index);
                        }
                    });
                }
                $scope.$parent.overlay_loadingNew = 'none';
                if (FLAG == undefined) {
                    $('#Edit_Matching').modal('show');
                }
            }
            else {
                $scope.PO_FOR_INVOICE_PO_MAPPING_LIST = [];
                $scope.HIDE_SHOW_MATCH = true;
                $scope.$parent.overlay_loadingNew = 'none';
                if (FLAG == undefined) {
                    $('#Edit_Matching').modal('show');
                }
            }
        });
    }
    $scope.GET_PO_FOR_INVOICE_PO_MAPPING_POP = function () {
        $scope.$parent.overlay_loadingNew = 'block';
        //if (!$scope.MATCH_DIV_SHOW) {
        // $scope.PO_FOR_INVOICE_PO_MAPPING_LIST = [];
        $scope.GET_PO_FOR_INVOICE_PO_MAPPING();
        //}
        $scope.$parent.DateInputLoad();
    }
    $scope.GET_PO_SPLIT_AMOUNTS_BY_INVOICE_LINE_ID = function (_invoice_line) {
        ModelObj = new Object();
        ModelObj.INVOICE_LINE_ID = _invoice_line.INVOICE_LINE_ID;
        PrcCommMethods.P2P_API(ModelObj, 'GET_PO_SPLIT_AMOUNTS_BY_INVOICE_LINE_ID', 'PO').then(function (data) {
            if (data.data.Table.length > 0) {
                _invoice_line.PO_DETAILS = data.data.Table;
            }
            else {
                _invoice_line.PO_DETAILS = [];
            }
        });
    }
    $scope.GET_PO_LINES_FOR_INVOICE_PO_MAPPING = function (LINE, OLD_FLAG, LOAD_FLAG, index) {
        ModelObj = new Object();
        ModelObj.PO_HEADER_ID = LINE.PO_HEADER_ID;
        if ($scope.TAB_FLAG == 1) {
            ModelObj.INVOICE_HEADER_ID = $scope.SELECTED_REQ.INVOICE_HEADER_ID;
        }
        else if ($scope.TAB_FLAG == 3) {
            ModelObj.INVOICE_HEADER_ID = $scope.SELECTED_REQ_ALL.INVOICE_HEADER_ID;
        }
        PrcCommMethods.P2P_API(ModelObj, 'GET_PO_LINES_FOR_INVOICE_PO_MAPPING', 'PO').then(function (data) {
            if (data.data.Table.length > 0) {
                LINE.PO_LINES_FOR_INVOICE_PO_MAPPING = data.data.Table; // PO lines
                $scope.MOVE_TO(LINE, 1, OLD_FLAG, LOAD_FLAG)
                //if ($scope.PO_FOR_INVOICE_PO_MAPPING_LIST.length - 1 == index) {
                //    $scope.$parent.overlay_loadingNew = 'none';
                //}
            }
        });
    }
    $scope.GET_XERO_ACCOUNT_CODES = function (REQUEST_LINE, FLAG) {
        $scope.XERO_ACCOUNT_CODES = [];
        var CusModelObj = new Object();
        CusModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CusModelObj.BRANCH_ID = REQUEST_LINE.BRANCH_ID;
        ///CusModelObj.APPROVAL_TYPE_ID = 3;// PO and 4 invoice create onlu
        CusModelObj.USER_ID = parseInt($cookies.get("USERID"));
        CusModelObj.PROJECT_MASTER_ID = REQUEST_LINE.PROJECT_MASTER_ID == undefined || REQUEST_LINE.PROJECT_MASTER_ID == null ? 0 : REQUEST_LINE.PROJECT_MASTER_ID;
        CusModelObj.ADMIN_FLAG = 1;// In case of approver admin flag set to 1 

        PrcCommMethods.P2P_API(CusModelObj, 'GET_P2P_ACCOUNT_CODES', 'PO').then(function (data) {
            if (data.data.Table != undefined) {
                $scope.XERO_ACCOUNT_CODES = data.data.Table;
                $scope.XERO_ACCOUNT_CODES = angular.copy($scope.XERO_ACCOUNT_CODES.filter(p => p.CODE != null && p.CODE != ''));
                $scope.CHANGE_BUDGET_fn(REQUEST_LINE, FLAG);
            }
            else {
                $scope.XERO_ACCOUNT_CODES = [];
            }
        });
    };
    $scope.GET_PROJECT_MASTER = function (REQUEST_LINE) {
        var UserModelObj = new Object();
        UserModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        UserModelObj.BRANCH_ID = REQUEST_LINE.BRANCH_ID;
        UserModelObj.PROJECT_NAME = "";
        PrcCommMethods.ADMIN_API(UserModelObj, 'GET_PROJECT_MASTER').then(function (data) {
            if (data.data.Table1.length > 0) {
                $scope.PROJECT_MASTER_LIST = data.data.Table1;
            } else {
                $scope.PROJECT_MASTER_LIST = [];
            };
        });
    }
    $scope.GET_P2P_BUDGET_BY_ACCOUNTS = function (FLAG, LINE, HEADER, CHANGE_FLAG) {
        var ptopobj = new Object();
        ptopobj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        ptopobj.BRANCH_ID = LINE.BRANCH_ID;///RECEIVING_TYPE_ID   1 FOR QTY WISE AND 2 FOR AMOUNT WISE
        ptopobj.USER_ID = parseInt($cookies.get("USERID"));
        ptopobj.YEAR = new Date(HEADER.BUDGET_DATE != '' && HEADER.BUDGET_DATE != null && HEADER.BUDGET_DATE != undefined ? HEADER.BUDGET_DATE : HEADER.INVOICE_DATE).getFullYear();
        ptopobj.MONTH = new Date(HEADER.BUDGET_DATE != '' && HEADER.BUDGET_DATE != null && HEADER.BUDGET_DATE != undefined ? HEADER.BUDGET_DATE : HEADER.INVOICE_DATE).getMonth() + 1;
        if (FLAG == 2 && $scope.SELECTED_REQ_PROC.INVOICE_HEADER_STATUS_ID == 80 || FLAG == 4 || FLAG == 3 && $scope.SELECTED_REQ_ALL.INVOICE_HEADER_STATUS_ID != 81 && $scope.SELECTED_REQ_ALL.INVOICE_HEADER_STATUS_ID != 79) {
            //81	Pending Submission
            //79	In Approval
            // 80 approved
            ptopobj.REFERENCE_ID = 0;
            ptopobj.REFERENCE_TYPE = 0; // BILL
        }
        else {
            ptopobj.REFERENCE_ID = LINE.INVOICE_HEADER_ID;
            ptopobj.REFERENCE_TYPE = 2; // BILL
        }
        if (HEADER.PROJECT_MASTER_ID == null || HEADER.PROJECT_MASTER_ID == undefined || HEADER.PROJECT_MASTER_ID == "") {
            ptopobj.PROJECT_MASTER_ID = 0;
        } else {
            ptopobj.PROJECT_MASTER_ID = CHANGE_FLAG == 1 ? HEADER.PROJECT_MASTER_ID : HEADER.PROJECT_MASTER_ID;// LINE.PROJECT_MASTER_ID;
        }
        //ptopobj.PROJECT_MASTER_ID = CHANGE_FLAG == 1 ? HEADER.PROJECT_MASTER_ID : HEADER.PROJECT_MASTER_ID;// LINE.PROJECT_MASTER_ID;
        ptopobj.XERO_ACCOUNTS_FOR_BUDGET = [];

        if (FLAG == 1) {
            angular.forEach($scope.ACTION_ITEM_LIST, function (LINE) {
                if (parseInt(LINE.ACCOUNT_ID) > 0) {
                    var readonlyobj = new Object()
                    readonlyobj.ACCOUNT_ID = parseInt(LINE.ACCOUNT_ID);
                    readonlyobj.ACCOUNT_DETAILS = LINE.ACCOUNT_DETAILS;
                    var alreadyAccount = ptopobj.XERO_ACCOUNTS_FOR_BUDGET.filter(function (x) { return x.ACCOUNT_ID == readonlyobj.ACCOUNT_ID });
                    if (alreadyAccount.length == 0) {
                        ptopobj.XERO_ACCOUNTS_FOR_BUDGET.push(readonlyobj);
                    }
                }
            });
        }
        else if (FLAG == 2) {
            angular.forEach($scope.PROCESS_REQUEST_ITEMS_LIST, function (LINE) {
                var readonlyobj = new Object()
                readonlyobj.ACCOUNT_ID = parseInt(LINE.ACCOUNT_ID);
                readonlyobj.ACCOUNT_DETAILS = LINE.ACCOUNT_DETAILS;
                var alreadyAccount = ptopobj.XERO_ACCOUNTS_FOR_BUDGET.filter(function (x) { return x.ACCOUNT_ID == readonlyobj.ACCOUNT_ID });
                if (alreadyAccount.length == 0) {
                    ptopobj.XERO_ACCOUNTS_FOR_BUDGET.push(readonlyobj);
                }
            });
        }
        else if (FLAG == 3) {
            angular.forEach($scope.ALL_ITEM_LIST, function (LINE) {
                if (parseInt(LINE.ACCOUNT_ID) > 0) {
                    var readonlyobj = new Object()
                    readonlyobj.ACCOUNT_ID = parseInt(LINE.ACCOUNT_ID);
                    readonlyobj.ACCOUNT_DETAILS = LINE.ACCOUNT_DETAILS;
                    var alreadyAccount = ptopobj.XERO_ACCOUNTS_FOR_BUDGET.filter(function (x) { return x.ACCOUNT_ID == readonlyobj.ACCOUNT_ID });
                    if (alreadyAccount.length == 0) {
                        ptopobj.XERO_ACCOUNTS_FOR_BUDGET.push(readonlyobj);
                    }
                }
            });
        }
        else if (FLAG == 4) {
            angular.forEach($scope.OUT_ITEM_LIST, function (LINE) {
                if (parseInt(LINE.ACCOUNT_ID)) {
                    var readonlyobj = new Object()
                    readonlyobj.ACCOUNT_ID = parseInt(LINE.ACCOUNT_ID);
                    readonlyobj.ACCOUNT_DETAILS = LINE.ACCOUNT_DETAILS;
                    var alreadyAccount = ptopobj.XERO_ACCOUNTS_FOR_BUDGET.filter(function (x) { return x.ACCOUNT_ID == readonlyobj.ACCOUNT_ID });
                    if (alreadyAccount.length == 0) {
                        ptopobj.XERO_ACCOUNTS_FOR_BUDGET.push(readonlyobj);
                    }
                };
            });
        }
        ptopobj.SETTING_45 = $scope.$parent.SETTING_USE_GROSS;
        if (ptopobj.XERO_ACCOUNTS_FOR_BUDGET.length > 0) {
            PrcCommMethods.P2P_API(ptopobj, 'GET_P2P_BUDGET_BY_ACCOUNTS', 'PO').then(function (data) {
                if (data.data != null && FLAG == 1) { // PR Approval in also use
                    $scope.CreditNotesViewSearch.BUDGET_NAME = data.data.BUDGET_NAME;
                    $scope.P2P_BUDGET_MASTER_LIST = data.data.Budget_Account_Data_List;
                }
                else {
                    $scope.BUDGET_TEXT_VALIDATION = "There is no budget allocated in the GL-Account";
                }
                if (data.data != null && FLAG == 2) {
                    $scope.CreditNotesViewSearch.BUDGET_NAME = data.data.BUDGET_NAME;
                    $scope.P2P_PROCESS_BUDGET_MASTER_LIST = data.data.Budget_Account_Data_List;
                }
                else {
                    $scope.BUDGET_TEXT_VALIDATION = "There is no budget allocated in the GL-Account";
                }

                if (data.data != null && FLAG == 3) {
                    $scope.CreditNotesViewSearch.BUDGET_NAME = data.data.BUDGET_NAME;
                    $scope.P2P_ALL_BUDGET_MASTER_LIST = data.data.Budget_Account_Data_List;
                }
                else {
                    $scope.BUDGET_TEXT_VALIDATION = "There is no budget allocated in the GL-Account";
                }
                if (data.data != null && FLAG == 4) {
                    $scope.CreditNotesViewSearch.BUDGET_NAME = data.data.BUDGET_NAME;
                    $scope.P2P_OUT_BUDGET_MASTER_LIST = data.data.Budget_Account_Data_List;
                }
                else {
                    $scope.BUDGET_TEXT_VALIDATION = "There is no budget allocated in the GL-Account";
                }
            });
        }
        else {
            $scope.BUDGET_TEXT_VALIDATION = "Please select a valid GL-Account";
        }
    }
    $scope.GET_P2P_BUDGET_SNAPSHOT = function (LINE, HEADER) {
        ModelObj = new Object();
        ModelObj.REFERENCE_ID = LINE.STATUS_ID == 66 || LINE.PO_HDR_ID == undefined ? LINE.REQUEST_ID : LINE.PO_HDR_ID;
        ModelObj.REFERENCE_TYPE = LINE.STATUS_ID == 66 || LINE.PO_HDR_ID == undefined ? 3 : 1;;
        PrcCommMethods.P2P_API(ModelObj, 'GET_P2P_BUDGET_SNAPSHOT', 'PO').then(function (data) {
            if (data.data.Table.length > 0) {
                LINE.P2P_SNAP_SHOT_MASTER_LIST = data.data.Table;
            }
            else {
                LINE.P2P_SNAP_SHOT_MASTER_LIST = [];
            }
        });

    }
    $scope.GET_APPROVAL_HEADERS_CHAIN = function (REQUEST, FLAG) {
        $scope.$parent.overlay_loadingNew = 'block';
        var PaymentModelObj = new Object();
        PaymentModelObj.APPROVAL_HEADER_ID = REQUEST.APPROVAL_HEADER_ID;
        PaymentModelObj.APPROVAL_TYPE_ID = 4; //Bill Approval
        PrcCommMethods.PAYMENT_API(PaymentModelObj, 'GET_APPROVAL_HEADERS_CHAIN').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.APPROVAL_HEADERS_CHAIN_LIST = data.data.Table;
            }
        })
    }


    $scope.GetIntegrationDetails = function (isstart) {
        var PaymentModelObj = new Object();
        PaymentModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        PaymentModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PaymentModelObj.BRANCH_ID = 0;
        PaymentModelObj.INTEGRATION_SYSTEM_ID = 16;
        //if ($scope.TAB_FLAG == 1) {
        //    PaymentModelObj.BRANCH_ID = $scope.SELECTED_REQ.BRANCH_ID;
        //}
        //else if ($scope.TAB_FLAG == 3) {
        //    PaymentModelObj.BRANCH_ID = $scope.SELECTED_REQ_ALL.BRANCH_ID;
        //}
        PrcCommMethods.PAYMENT_API(PaymentModelObj, 'GET_INTEGRATION_DETAILS_BY_CUST_ENT_BRNH').then(function (data) {
            if (data.data.length > 0) {
                $scope.IntegrationDetails = data.data.filter(function (x) { return x.IS_OUTBOUND == false })[0];
                if ($scope.IntegrationDetails.INTEGRATION_STATUS == 2) {
                    $scope.IntegrationDetails.ShowSyncBtn = true;
                    $scope.IntegrationDetails.PageLoad = false;
                    $scope.StopResyncInterval();
                    if ($scope.TAB_FLAG == 1 && isstart == 2) {
                        $scope.GET_INVOICES_ACTION(1, 1, false, 1);
                    }
                    else if ($scope.TAB_FLAG == 3 && isstart == 2) {
                        $scope.GET_INVOICES_ADMIN(1, 1, false, 1);
                    };
                }
                else {
                    isstart == 1 ? $scope.StartResyncInterval() : "";
                    $scope.IntegrationDetails.PageLoad = false;
                    $scope.IntegrationDetails.ShowSyncBtn = false;
                }
            };
        });
    }
    $scope.IntegrationDetails = new Object();
    $scope.IntegrationDetails.PageLoad = true;
    //  $scope.IntegrationDetails.ShowSyncBtn = true;

    $scope.CLICK_SUPPLIER_XERO_SYNC_Fn = function () {
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
    function IntervalExecution() { $scope.GetIntegrationDetails(2); }

    $scope.$on('ngRepeatFinishedActionRender', function (ngRepeatFinishedEvent) {
        // if ($scope.CreditNotesViewSearch.PO_DATE != undefined && $scope.CreditNotesViewSearch.PO_DATE != "" && $scope.CreditNotesViewSearch.PO_DATE != null && $scope.CreditNotesViewSearch.PROJECT_MASTER_ID != undefined && $scope.CreditNotesViewSearch.PROJECT_MASTER_ID != null && $scope.CreditNotesViewSearch.PROJECT_MASTER_ID != "") {
        $scope.GET_P2P_BUDGET_BY_ACCOUNTS(1, $scope.CreditNotesViewSearch.REQUEST_DETAILS, $scope.CreditNotesViewSearch.REQUEST_DETAILS)

        //}
    });
    $scope.$on('ngRepeatFinishedProcessRender', function (ngRepeatFinishedEvent) {
        //if ($scope.CreditNotesViewSearch.PO_DATE != undefined && $scope.CreditNotesViewSearch.PO_DATE != "" && $scope.CreditNotesViewSearch.PO_DATE != null && $scope.CreditNotesViewSearch.PROJECT_MASTER_ID != undefined && $scope.CreditNotesViewSearch.PROJECT_MASTER_ID != null && $scope.CreditNotesViewSearch.PROJECT_MASTER_ID != "") {
        $scope.GET_P2P_BUDGET_BY_ACCOUNTS(2, $scope.CreditNotesViewSearch.PROCESS_REQUEST_DETAILS, $scope.CreditNotesViewSearch.PROCESS_REQUEST_DETAILS)
        if ($scope.INVOICE_PROCESS_SPLIT_LIST.length > 0) {
            $scope.Fn_SPLIT_PROCESS_ALL_OUT_INVOICE($scope.CreditNotesViewSearch.PROCESS_REQUEST_DETAILS);
        }
        //}
    });
    $scope.$on('ngRepeatFinishedPoAllRender', function (ngRepeatFinishedEvent) {
        $scope.GET_P2P_BUDGET_BY_ACCOUNTS(3, $scope.CreditNotesViewSearch.ALL_REQUEST_DETAILS, $scope.CreditNotesViewSearch.ALL_REQUEST_DETAILS)
        if ($scope.INVOICE_PROCESS_SPLIT_LIST.length > 0) {
            $scope.Fn_SPLIT_PROCESS_ALL_OUT_INVOICE($scope.CreditNotesViewSearch.ALL_REQUEST_DETAILS);
        }
    });
    $scope.$on('ngRepeatFinishedOutRender', function (ngRepeatFinishedEvent) {
        $scope.GET_P2P_BUDGET_BY_ACCOUNTS(4, $scope.CreditNotesViewSearch.ALL_REQUEST_DETAILS, $scope.CreditNotesViewSearch.ALL_REQUEST_DETAILS)
        if ($scope.INVOICE_PROCESS_SPLIT_LIST.length > 0) {
            $scope.Fn_SPLIT_PROCESS_ALL_OUT_INVOICE($scope.CreditNotesViewSearch.OUT_REQUEST_DETAILS);
        }
    });
    $scope.$on('ngRepeatFinishedMappedRender', function (ngRepeatFinishedEvent) {
        if ($scope.MAPPED_LIST.length > 0 && $scope.PO_MAPPED_LOAD == 1) {
            $scope.PO_MAPPED_LOAD = 2;
            $scope.GET_PO_FOR_INVOICE_PO_MAPPING(1, 1);
        } else {
            $scope.$parent.overlay_loadingNew = 'none';
        }
    });

    $scope.THREE_WAY_MATCH = function (INVOICE_LINE) {
        INVOICE_LINE.GRN_MATCH = false;
        if (INVOICE_LINE.MATCHES.length > 0) {
            var MAPPED_SUM_QTY = 0;
            var MAPPED_SUM_AMT = 0;
            var MAPPED_SUM_QTY_AMT = 0;
            var GRN_QTY = 0;
            var GRN_AMT = 0;
            var GRN_QTY_AMT = 0;

            for (let i = 0; i < INVOICE_LINE.MATCHES.length; i++) {
                if (INVOICE_LINE.MATCHES[i].RECEIVING_TYPE_ID == 1) {
                    INVOICE_LINE.RECEIVING_TYPE_ID = INVOICE_LINE.MATCHES[i].RECEIVING_TYPE_ID;
                    MAPPED_SUM_QTY = parseFloat(MAPPED_SUM_QTY) + parseFloat(INVOICE_LINE.MATCHES[i].USED_QTY);
                    GRN_QTY = parseFloat(parseFloat(GRN_QTY).toFixed(2)) + parseFloat(parseFloat(INVOICE_LINE.MATCHES[i].RECEIVED_QTY).toFixed(2));
                    MAPPED_SUM_QTY_AMT = parseFloat(MAPPED_SUM_QTY_AMT) + parseFloat(INVOICE_LINE.MATCHES[i].USED_AMOUNT);
                }
                else if (INVOICE_LINE.MATCHES[i].RECEIVING_TYPE_ID == 2) {
                    INVOICE_LINE.RECEIVING_TYPE_ID = INVOICE_LINE.MATCHES[i].RECEIVING_TYPE_ID;
                    MAPPED_SUM_AMT = parseFloat(parseFloat(MAPPED_SUM_AMT).toFixed(2)) + parseFloat(parseFloat(INVOICE_LINE.MATCHES[i].USED_AMOUNT).toFixed(2));
                    GRN_AMT = parseFloat(parseFloat(GRN_AMT).toFixed(2)) + parseFloat(parseFloat(INVOICE_LINE.MATCHES[i].RECEIVED_AMOUNT).toFixed(2));
                }
            }
            for (let i = 0; i < INVOICE_LINE.MATCHES.length; i++) {
                if (INVOICE_LINE.MATCHES[i].RECEIVING_TYPE_ID == 1) {
                    if (parseFloat(parseFloat(INVOICE_LINE.QUANTITY).toFixed(2)) === parseFloat(parseFloat(MAPPED_SUM_QTY).toFixed(2)) && (parseFloat(parseFloat(INVOICE_LINE.QUANTITY).toFixed(2)) <= parseFloat(parseFloat(GRN_QTY).toFixed(2))) && (parseFloat(parseFloat(INVOICE_LINE.LINE_AMOUNT).toFixed(2)) + parseFloat(parseFloat(INVOICE_LINE.TAX_AMOUNT).toFixed(2))) == parseFloat(parseFloat(MAPPED_SUM_QTY_AMT).toFixed(2))) {
                        INVOICE_LINE.GRN_MATCH = true;
                    }
                }
                else if (INVOICE_LINE.MATCHES[i].RECEIVING_TYPE_ID == 2) {
                    if (parseFloat(parseFloat(INVOICE_LINE.LINE_AMOUNT).toFixed(2)) + parseFloat(parseFloat(INVOICE_LINE.TAX_AMOUNT).toFixed(2)) === parseFloat(parseFloat(MAPPED_SUM_AMT).toFixed(2)) && (parseFloat(parseFloat(INVOICE_LINE.LINE_AMOUNT).toFixed(2)) + parseFloat(parseFloat(INVOICE_LINE.TAX_AMOUNT).toFixed(2))) <= parseFloat(parseFloat(GRN_AMT).toFixed(2))) {
                        INVOICE_LINE.GRN_MATCH = true;
                    }
                }
            }
        }
    }

    $scope.InitiateXeroTrackingCategories = function (item, Trackingcat_index, PRL, FLAG) {
        if (item.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID > 0 && $scope.SELECTED_XERO_TRACKING_CATEGORIES_OPTIONS.length > 0) {
            var select_cat = $scope.SELECTED_XERO_TRACKING_CATEGORIES_OPTIONS.filter(p => p.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID == item.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID && PRL.PO_LINE_ID == p.PO_LINE_ID)[0];
            if (select_cat != undefined && select_cat != null) {
                var text = $scope.XERO_TRACKING_CATEGORIES_OPTIONS.filter(function (x) { return x.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID == select_cat.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID && x.APPROVAL_CHAIN_CUSTOM_FIELD_OPTIONS_MASTER_ID == select_cat.APPROVAL_CHAIN_CUSTOM_FIELD_OPTIONS_MASTER_ID });
                item.SELECTED_CATEGORY_OPTION = text[0];
            };
        };

        //if (FLAG == 1) {
        //    if (item.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID > 0 && $scope.SELECTED_XERO_TRACKING_CATEGORIES_OPTIONS.length > 0) {
        //        var select_cat = $scope.SELECTED_XERO_TRACKING_CATEGORIES_OPTIONS.filter(p => p.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID == item.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID && PRL.PO_LINE_ID == p.PO_LINE_ID)[0];
        //        if (select_cat != undefined && select_cat != null) {
        //            var text = $scope.XERO_TRACKING_CATEGORIES_OPTIONS.filter(function (x) { return x.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID == select_cat.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID && x.APPROVAL_CHAIN_CUSTOM_FIELD_OPTIONS_MASTER_ID == select_cat.APPROVAL_CHAIN_CUSTOM_FIELD_OPTIONS_MASTER_ID });
        //            item.SELECTED_CATEGORY_OPTION = text[0];
        //        }
        //    }
        //}
        //else if (FLAG == 2) {
        //    if (item.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID > 0 && $scope.SELECTED_PROCESSED_XERO_TRACKING_CATEGORIES_OPTIONS.length > 0) {
        //        var Processitemoption = $scope.SELECTED_PROCESSED_XERO_TRACKING_CATEGORIES_OPTIONS.filter(p => p.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID == item.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID && PRL.PO_LINE_ID == p.PO_LINE_ID)[0];
        //        if (Processitemoption != undefined && Processitemoption != null) {
        //            var Protext = $scope.XERO_TRACKING_CATEGORIES_OPTIONS.filter(function (x) { return x.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID == Processitemoption.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID && x.APPROVAL_CHAIN_CUSTOM_FIELD_OPTIONS_MASTER_ID == Processitemoption.APPROVAL_CHAIN_CUSTOM_FIELD_OPTIONS_MASTER_ID });
        //            item.SELECTED_CATEGORY_OPTION = Protext[0];
        //        }
        //    }
        //}
        //else if (FLAG == 3) {
        //    if (item.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID > 0 && $scope.ALL_SELECTED_PROCESSED_XERO_TRACKING_CATEGORIES_OPTIONS.length > 0) {
        //        var Processitemoption = $scope.ALL_SELECTED_PROCESSED_XERO_TRACKING_CATEGORIES_OPTIONS.filter(p => p.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID == item.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID && PRL.PO_LINE_ID == p.PO_LINE_ID)[0];
        //        if (Processitemoption != undefined && Processitemoption != null) {
        //            var Protext = $scope.ALL_XERO_TRACKING_CATEGORIES_OPTIONS.filter(function (x) { return x.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID == Processitemoption.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID && x.APPROVAL_CHAIN_CUSTOM_FIELD_OPTIONS_MASTER_ID == Processitemoption.APPROVAL_CHAIN_CUSTOM_FIELD_OPTIONS_MASTER_ID });
        //            item.SELECTED_CATEGORY_OPTION = Protext[0];
        //        }
        //    }
        //}
    }
    $scope.InitiateBillItemList = function (PRL, TAB_FLAG) {
        PRL.DESCRIPTION_LIMIT_TO = angular.copy($scope.DESCRIPTION_LIMIT_TO);
        PRL.XERO_TRACKING_CATEGORIES = angular.copy($scope.XERO_TRACKING_CATEGORIES);
        PRL.ACCOUNT_NAME = PRL.ACCOUNT_DETAILS;

        if (TAB_FLAG == 3) {
            //PRL.XERO_TRACKING_CATEGORIES = angular.copy($scope.ALL_XERO_TRACKING_CATEGORIES);
            //PRL.ALL_SELECTED_OPTION_LIST_MASTER = angular.copy($scope.ALL_SELECTED_OPTION_LIST_MASTER);
            //PRL.ACCOUNT_NAME = PRL.ACCOUNT_DETAILS;
        }
        else {
            //PRL.XERO_TRACKING_CATEGORIES = angular.copy($scope.XERO_TRACKING_CATEGORIES);
            //PRL.ACCOUNT_NAME = PRL.ACCOUNT_DETAILS;
        }
    }

    $scope.InitiateInvoice = function (INVOICE_LINE) {
        INVOICE_LINE.IS_DROP_DOWN_SHOW = true;
        INVOICE_LINE.MATCHES = [];
        INVOICE_LINE.REMAINING_TO_MAP_QTY = angular.copy(INVOICE_LINE.QUANTITY);
        INVOICE_LINE.REMAINING_TO_MAP_AMOUNT = angular.copy(INVOICE_LINE.LINE_AMOUNT + INVOICE_LINE.TAX_AMOUNT);
        INVOICE_LINE.REMAINING_TO_MAP_AMOUNT_TYPE_2 = angular.copy(INVOICE_LINE.LINE_AMOUNT + INVOICE_LINE.TAX_AMOUNT);
        INVOICE_LINE.ACCOUNT_MATCH = true;
        if ($scope.TAB_FLAG == 1) {
            var INVOICE_TO_PO_LINE_LIST = $scope.INVOICE_PO_MAPPING.filter(function (x) { return x.INVOICE_LINE_ID == INVOICE_LINE.INVOICE_LINE_ID })
        }
        else if ($scope.TAB_FLAG == 2) {
            var INVOICE_TO_PO_LINE_LIST = $scope.PROCE_INVOICE_PO_MAPPING.filter(function (x) { return x.INVOICE_LINE_ID == INVOICE_LINE.INVOICE_LINE_ID })
        }
        else if ($scope.TAB_FLAG == 3) {
            var INVOICE_TO_PO_LINE_LIST = $scope.INVOICE_PO_MAPPING.filter(function (x) { return x.INVOICE_LINE_ID == INVOICE_LINE.INVOICE_LINE_ID })
        }
        else if ($scope.TAB_FLAG == 4) {
            var INVOICE_TO_PO_LINE_LIST = $scope.INVOICE_PO_MAPPING.filter(function (x) { return x.INVOICE_LINE_ID == INVOICE_LINE.INVOICE_LINE_ID })
        }
        INVOICE_LINE.VALIDATION_SUCCESS = 1;
        if (INVOICE_TO_PO_LINE_LIST.length > 0) {
            INVOICE_LINE.IS_DROP_DOWN_SHOW = false;
            $scope.MATCH_DIV_SHOW = true;
            angular.forEach(INVOICE_TO_PO_LINE_LIST, function (LINE) {
                if (LINE.VALIDATION_SUCCESS == 0) {
                    INVOICE_LINE.VALIDATION_SUCCESS = 0;
                }
                INVOICE_LINE.IS_DROP_DOWN_SHOW = false;
                LINE.ACCOUNT_ID = LINE.PO_ACCOUNT_ID;
                LINE.ACCOUNT_DETAILS = LINE.PO_ACCOUNT_DETAILS;
                LINE.ITEM_NAME = LINE.PO_ITEM_NAME;
                LINE.DESCRIPTION = LINE.PO_DESCRIPTION;
                LINE.QUANTITY = LINE.PO_QUANTITY;
                LINE.LINE_AMOUNT = LINE.PO_AMOUNT;
                LINE.USED_QTY = LINE.MAPPED_QTY;

                LINE.USED_AMOUNT = LINE.MAPPED_AMOUNT;
                LINE.ACCOUNT_DETAILS = LINE.PO_ACCOUNT_DETAILS;
                LINE.ALREADY_MAPPED_AMOUNT = LINE.ALREADY_MAPPED_AMOUNT;
                LINE.ALREADY_MAPPED_QTY = LINE.ALREADY_MAPPED_QTY;

                LINE.LINE_NO = LINE.PO_LINE_NO;
                if (LINE.RECEIVING_TYPE_ID == 1) {
                    INVOICE_LINE.REMAINING_TO_MAP_QTY = parseFloat(parseFloat(INVOICE_LINE.REMAINING_TO_MAP_QTY).toFixed(2)) - parseFloat(parseFloat(LINE.MAPPED_QTY).toFixed(2));// LINE.USED_QTY;
                    INVOICE_LINE.REMAINING_TO_MAP_AMOUNT = parseFloat(parseFloat(INVOICE_LINE.REMAINING_TO_MAP_AMOUNT).toFixed(2)) - parseFloat(parseFloat(LINE.MAPPED_AMOUNT).toFixed(2));//LINE.USED_AMOUNT;
                    //INVOICE_LINE.REMAINING_TO_MAP_QTY = 0// LINE.USED_QTY;
                    //INVOICE_LINE.REMAINING_TO_MAP_AMOUNT = 0 //LINE.USED_AMOUNT;
                    if (INVOICE_LINE.REMAINING_TO_MAP_QTY != 0 && parseFloat(parseFloat(INVOICE_LINE.REMAINING_TO_MAP_QTY).toFixed(2)) < parseFloat(parseFloat(INVOICE_LINE.QUANTITY).toFixed(2))) {
                        INVOICE_LINE.IS_DROP_DOWN_SHOW = true;
                    }

                }
                if (LINE.RECEIVING_TYPE_ID == 2) {
                    INVOICE_LINE.REMAINING_TO_MAP_AMOUNT = parseFloat(parseFloat(INVOICE_LINE.REMAINING_TO_MAP_AMOUNT).toFixed(2)) - parseFloat(parseFloat(LINE.MAPPED_AMOUNT).toFixed(2));// LINE.USED_AMOUNT;
                    INVOICE_LINE.REMAINING_TO_MAP_AMOUNT_TYPE_2 = parseFloat(parseFloat(INVOICE_LINE.REMAINING_TO_MAP_AMOUNT_TYPE_2).toFixed(2)) - parseFloat(parseFloat(LINE.MAPPED_AMOUNT).toFixed(2))// LINE.USED_AMOUNT; REFRENCE_TYPE
                    if (INVOICE_LINE.REMAINING_TO_MAP_AMOUNT_TYPE_2 != 0 && parseFloat(INVOICE_LINE.REMAINING_TO_MAP_AMOUNT_TYPE_2).toFixed(2) < parseFloat(parseFloat(INVOICE_LINE.LINE_AMOUNT).toFixed(2))) {
                        INVOICE_LINE.IS_DROP_DOWN_SHOW = true;
                    }
                    //   INVOICE_LINE.REMAINING_TO_MAP_AMOUNT = 0;
                    //   INVOICE_LINE.REMAINING_TO_MAP_AMOUNT_TYPE_2 = 0;
                }
                if (LINE.PO_ACCOUNT_ID != INVOICE_LINE.ACCOUNT_ID && INVOICE_LINE.ACCOUNT_MATCH) {
                    INVOICE_LINE.ACCOUNT_MATCH = false;
                }
                LINE.CUSTOM_INDEX = $scope.MAPPED_LIST.length + 1;
                INVOICE_LINE.MATCHES.push(LINE);
                $scope.MAPPED_LIST.push(LINE);
            });
        }
        else {
            INVOICE_LINE.ACCOUNT_MATCH = false;
        }

        $scope.THREE_WAY_MATCH(INVOICE_LINE);
    }
    $scope.InitiateProcessInvoice = function (INVOICE_LINE) {
        INVOICE_LINE.MATCHES = [];
        INVOICE_LINE.ACCOUNT_MATCH = $scope.PROCE_INVOICE_PO_MAPPING.length == 0 ? false : true;
        INVOICE_LINE.IS_DROP_DOWN_SHOW = true;
        var PROC_INVOICE_TO_PO_LINE_LIST = $scope.PROCE_INVOICE_PO_MAPPING.filter(function (x) { return x.INVOICE_LINE_ID == INVOICE_LINE.INVOICE_LINE_ID })
        if (PROC_INVOICE_TO_PO_LINE_LIST.length > 0) {
            angular.forEach(PROC_INVOICE_TO_PO_LINE_LIST, function (LINE) {
                LINE.ACCOUNT_ID = LINE.PO_ACCOUNT_ID;
                LINE.ACCOUNT_DETAILS = LINE.PO_ACCOUNT_DETAILS;
                LINE.ITEM_NAME = LINE.PO_ITEM_NAME;
                LINE.DESCRIPTION = LINE.PO_DESCRIPTION;
                LINE.QUANTITY = LINE.PO_QUANTITY;
                LINE.LINE_AMOUNT = LINE.PO_AMOUNT;
                LINE.USED_QTY = LINE.MAPPED_QTY;
                LINE.USED_AMOUNT = LINE.MAPPED_AMOUNT;
                LINE.ACCOUNT_DETAILS = LINE.PO_ACCOUNT_DETAILS;
                LINE.ALREADY_MAPPED_AMOUNT = LINE.ALREADY_MAPPED_AMOUNT;
                LINE.ALREADY_MAPPED_QTY = LINE.ALREADY_MAPPED_QTY;
                LINE.LINE_NO = LINE.PO_LINE_NO;
                if (LINE.PO_ACCOUNT_ID != INVOICE_LINE.ACCOUNT_ID && INVOICE_LINE.ACCOUNT_MATCH) {
                    INVOICE_LINE.ACCOUNT_MATCH = false;
                }
                INVOICE_LINE.MATCHES.push(LINE);
                // $scope.MAPPED_LIST.push(LINE);
            });
        }
        $scope.THREE_WAY_MATCH(INVOICE_LINE);
    }
    $scope.InitiateNameApprover = function (Approver, HEADER) {
        Approver.SHORT_NAME = $scope.TextReturn(Approver.APPROVER_NAME);
        if (Approver.IS_REVIEWER && (Approver.APPROVER_ID == parseInt($cookies.get("USERID")))) {
            $scope.EDIT_MATCH_BTN_SHOW = true;
        }
        if (HEADER.APPROVER_STATUS_ACTION_COUNT == undefined) { HEADER.APPROVER_STATUS_ACTION_COUNT = 0; }
        if (HEADER.USER_COUNT == undefined) { HEADER.USER_COUNT = 0; }
        HEADER.USER_COUNT = HEADER.USER_COUNT + 1;
        if (Approver.STATUS_ID == 37 || Approver.STATUS_ID == 38) { HEADER.APPROVER_STATUS_ACTION_COUNT = HEADER.APPROVER_STATUS_ACTION_COUNT + 1; }

        //if (HEADER.APPROVER_COUNT == Approver.GROUP_SORT_SEQUENCE) {
        //    HEADER.SEQUENCE_APPROVED = true;
        //}
        HEADER.SEQUENCE_APPROVED = false;
        if (HEADER.ANY_ALL_FLAG == 0 && HEADER.USER_COUNT == HEADER.APPROVER_STATUS_ACTION_COUNT) {
            HEADER.SEQUENCE_APPROVED = true;
        }
        else if (HEADER.ANY_ALL_FLAG != 0 && HEADER.APPROVER_STATUS_ACTION_COUNT && HEADER.ANY_ALL_FLAG) {
            HEADER.SEQUENCE_APPROVED = true;
        }
        if (!HEADER.STEP_ACTIVE) {
            HEADER.STEP_ACTIVE = false;
        }
        if (Approver.ACTION_REQUIRED == 1) {
            HEADER.STEP_ACTIVE = true;
        }
    }
    $scope.Initmonth_Fn = function (_param_m) {
        //if (_param_m.ITEM_LIST == undefined) {
        //    _param_m.ITEM_LIST = [];
        //}
        //_param_m.ITEM_LIST = angular.copy($scope.ACTION_ITEM_LIST);
    }
    $scope.Inittotalreq = function (parm_line, parm_m, index) {
        parm_line.TOTAL_BUDGET = 0;
        $scope.ACCOUNT_ITEMDETAIL = [];
        var linedetail = [];
        var itemdetail = [];
        $scope.remaningitemdetail = [];
        angular.forEach($scope.MONTH_LIST, function (_m, index) {
            linedetail = linedetail.concat(_m.ITEM_LIST.filter(function (x) { return x.LINE_NO == parm_line.LINE_NO }));
            itemdetail = itemdetail.concat(_m.ITEM_LIST);
            if (_m.FLAG == 1) {
                $scope.remaningitemdetail = $scope.remaningitemdetail.concat(_m.ITEM_LIST);
            }
        });
        $scope.MONTH_LIST[$scope.MONTH_LIST.length - 1].ITEM_LIST[parm_line.ITEM_INDEX].TOTAL_BUDGET = angular.copy($filter('sumOfValue')(linedetail, 'BUDGET'));
        if ($scope.TAB_FLAG == 1) {
            $scope.ACCOUNT_ITEMDETAIL = itemdetail.filter(function (_m) { return new Date($scope.CreditNotesViewSearch.REQUEST_DETAILS.BUDGET_DATE).getMonth() == new Date(_m.INVOICE_DATE).getMonth() && new Date($scope.CreditNotesViewSearch.REQUEST_DETAILS.BUDGET_DATE).getFullYear() == new Date(_m.INVOICE_DATE).getFullYear() })
        }
        else if ($scope.TAB_FLAG == 3) {
            $scope.ACCOUNT_ITEMDETAIL = itemdetail.filter(function (_m) { return new Date($scope.CreditNotesViewSearch.ALL_REQUEST_DETAILS.BUDGET_DATE).getMonth() == new Date(_m.INVOICE_DATE).getMonth() && new Date($scope.CreditNotesViewSearch.ALL_REQUEST_DETAILS.BUDGET_DATE).getFullYear() == new Date(_m.INVOICE_DATE).getFullYear() })
        }
    }
    $scope.Inittotalproccereq = function (parm_line, parm_m, index) {
        parm_line.TOTAL_BUDGET = 0;
        $scope.ACCOUNT_PROCESS_ALL_ITEMDETAIL = [];
        var linedetail = [];
        var itemdetail = [];
        $scope.remaningprocessitemdetail = [];
        angular.forEach($scope.MONTH_PROCESS_ALL_LIST, function (_m, index) {
            linedetail = linedetail.concat(_m.ITEM_LIST.filter(function (x) { return x.LINE_NO == parm_line.LINE_NO }));
            itemdetail = itemdetail.concat(_m.ITEM_LIST);
            if (_m.FLAG == 1) {
                $scope.remaningprocessitemdetail = $scope.remaningprocessitemdetail.concat(_m.ITEM_LIST);
            }
        });
        $scope.MONTH_PROCESS_ALL_LIST[$scope.MONTH_PROCESS_ALL_LIST.length - 1].ITEM_LIST[parm_line.ITEM_INDEX].TOTAL_BUDGET = angular.copy($filter('sumOfValue')(linedetail, 'BUDGET'));
        if ($scope.TAB_FLAG == 2) {
            $scope.ACCOUNT_PROCESS_ALL_ITEMDETAIL = itemdetail.filter(function (_m) { return new Date($scope.CreditNotesViewSearch.PROCESS_REQUEST_DETAILS.BUDGET_DATE).getMonth() == new Date(_m.INVOICE_DATE).getMonth() && new Date($scope.CreditNotesViewSearch.REQUEST_DETAILS.BUDGET_DATE).getFullYear() == new Date(_m.INVOICE_DATE).getFullYear() })
        }
        else if ($scope.TAB_FLAG == 3) {
            $scope.ACCOUNT_PROCESS_ALL_ITEMDETAIL = itemdetail.filter(function (_m) { return new Date($scope.CreditNotesViewSearch.ALL_REQUEST_DETAILS.BUDGET_DATE).getMonth() == new Date(_m.INVOICE_DATE).getMonth() && new Date($scope.CreditNotesViewSearch.ALL_REQUEST_DETAILS.BUDGET_DATE).getFullYear() == new Date(_m.INVOICE_DATE).getFullYear() })
        }
    }


    $scope.VALIDATION_CLICK_FY = function (APPROVE_REJECT_FLAG) {
        $scope.CONDITION_ACTION_ITEM_LIST = [];
        var IS_VALID = true
        var USE_INVOICE_GL = false;
        if ($scope.TAB_FLAG == 1) {
            ALL_AND_ACTION = $scope.CreditNotesViewSearch.REQUEST_DETAILS;
            ITEM_LIST = $scope.ACTION_ITEM_LIST;
            USE_INVOICE_GL = $scope.CreditNotesViewSearch.REQUEST_DETAILS.USE_INVOICE_GL;
        }
        else if ($scope.TAB_FLAG == 3) {
            ALL_AND_ACTION = $scope.CreditNotesViewSearch.ALL_REQUEST_DETAILS;
            ITEM_LIST = $scope.ALL_ITEM_LIST;
            USE_INVOICE_GL = $scope.CreditNotesViewSearch.ALL_REQUEST_DETAILS.USE_INVOICE_GL;
        };
        if ($scope.MAPPED_LIST.filter(function (x) { return x.TABLE_ID > 0 }).length != $scope.MAPPED_LIST.length) {
            IS_VALID = false;
            $scope.$parent.ShowAlert('Error', 'Before approving save the line matching details', 3000);
        }
        else if ($scope.MAPPED_LIST.length > 0 && ITEM_LIST.filter(function (x) { return x.ACCOUNT_MATCH }).length != ITEM_LIST.length && USE_INVOICE_GL != true) {
            IS_VALID = false;
            $scope.$parent.ShowAlert('Error', 'The Invoice line GL Account is not matching the purchase order line GL Account', 3000);
        }
        else if ($scope.MAPPED_LIST.length > 0 && ITEM_LIST.filter(function (x) { return x.VALIDATION_SUCCESS == 0 }).length > 0) {
            IS_VALID = false;
            $scope.$parent.ShowAlert('Error', 'PO to invoice matching is incorrect. Please check project name while matching po and invoice.', 3000);
        }
        $scope.SELECTED_INVOICE_DETAIL = {};
        $scope.CONDITION_P2P_BUDGET_MASTER_LIST = [];
        if (IS_VALID) {
            $scope.CreditNotesViewSearch.APPROVE_REJECT_FLAG = APPROVE_REJECT_FLAG;
            if ($scope.TAB_FLAG == 1) {
                $scope.SELECTED_INVOICE_DETAIL = $scope.CreditNotesViewSearch.REQUEST_DETAILS;
                $scope.CONDITION_P2P_BUDGET_MASTER_LIST = $scope.P2P_BUDGET_MASTER_LIST;
                $scope.GET_PO_SPLIT_DATES_BY_INVOICE_ID($scope.CreditNotesViewSearch.REQUEST_DETAILS);

                $scope.CONDITION_ACTION_ITEM_LIST = $scope.ACTION_ITEM_LIST;
            }
            else if ($scope.TAB_FLAG == 3) {
                $scope.SELECTED_INVOICE_DETAIL = $scope.CreditNotesViewSearch.REQUEST_DETAILS;
                $scope.CONDITION_P2P_BUDGET_MASTER_LIST = $scope.P2P_ALL_BUDGET_MASTER_LIST;
                $scope.GET_PO_SPLIT_DATES_BY_INVOICE_ID($scope.CreditNotesViewSearch.ALL_REQUEST_DETAILS);
                $scope.CONDITION_ACTION_ITEM_LIST = $scope.ALL_ITEM_LIST;
            };

            $scope.ALLOW_SUBMIT = false;
            if ($scope.OTP_VALID_CHECK == '1' && $scope.NXT_APPROVAL_HEADER_STATUS_ID == '') {
                $scope.CreditNotesViewSearch.digit1 = "";
                $scope.CreditNotesViewSearch.digit2 = "";
                $scope.CreditNotesViewSearch.digit3 = "";
                $scope.CreditNotesViewSearch.digit4 = "";
                $scope.CreditNotesViewSearch.digit5 = "";
                $scope.CreditNotesViewSearch.digit6 = "";
                $scope.ALLOW_SUBMIT = true;
                $scope.GENERATE_APPROVAL_OTP();
            }
        }
    }
    $scope.VALIDATION_FORCE_CLICK_FY = function (APPROVE_REJECT_FLAG, ACTIVE_TAB_APPROVAL_PROCESS) {
        $scope.CreditNotesViewSearch.APPROVE_REJECT_FROCE_FLAG = APPROVE_REJECT_FLAG;
        $scope.ACTIVE_TAB_APPROVAL_PROCESS = ACTIVE_TAB_APPROVAL_PROCESS;
        var IS_VALID = true
        var Linecount = 0, AccountMatchCount = 0, EDIT_MATCHING = 0;
        if ($scope.CreditNotesViewSearch.APPROVAL_TYPE_ID == 4 && APPROVE_REJECT_FLAG == 37) {
            if ($scope.MAPPED_LIST.length == 0) {
                EDIT_MATCHING = 1;
                IS_VALID = false;
                $scope.$parent.ShowAlert('Error', 'Edit Matching Invoice line to PO line is not completed,Please click edit matching', 3000);
            }
            else if ($scope.MAPPED_LIST.filter(function (x) { return x.TABLE_ID > 0 }).length != $scope.MAPPED_LIST.length) {
                IS_VALID = false;
                Linecount = 1;
                $scope.$parent.ShowAlert('Error', 'Before approving save the line matching details', 3000);
            }
            else if ($scope.TAB_FLAG == 1 && $scope.ACTION_ITEM_LIST.filter(function (x) { return x.ACCOUNT_MATCH }).length != $scope.ACTION_ITEM_LIST.length && $scope.CreditNotesViewSearch.REQUEST_DETAILS.USE_INVOICE_GL != true) {
                IS_VALID = false;
                AccountMatchCount = 1;
                $scope.$parent.ShowAlert('Error', 'The Invoice line GL Account is not matching the purchase order line GL Account', 3000);
            }
            else if ($scope.TAB_FLAG == 3 && $scope.ALL_ITEM_LIST.filter(function (x) { return x.ACCOUNT_MATCH }).length != $scope.ALL_ITEM_LIST.length && $scope.CreditNotesViewSearch.ALL_REQUEST_DETAILS.USE_INVOICE_GL != true) {
                IS_VALID = false;
                AccountMatchCount = 1;
                $scope.$parent.ShowAlert('Error', 'The Invoice line GL Account is not matching the purchase order line GL Account', 3000);
            };
        }
        if (IS_VALID) {
            var UnselectedInvCnt = 0, SelectedInvCnt = 0, rowcount = 0;
            $('#Approved_Reject_FROCE_POP').modal('show');
            $scope.ALLOW_FORCE_SUBMIT = false;
            if ($scope.OTP_VALID_CHECK == '1' && $scope.NXT_APPROVAL_HEADER_STATUS_ID == '') {
                $scope.CreditNotesViewSearch.digit1 = "";
                $scope.CreditNotesViewSearch.digit2 = "";
                $scope.CreditNotesViewSearch.digit3 = "";
                $scope.CreditNotesViewSearch.digit4 = "";
                $scope.CreditNotesViewSearch.digit5 = "";
                $scope.CreditNotesViewSearch.digit6 = "";
                $scope.ALLOW_FORCE_SUBMIT = true;
                $scope.GENERATE_APPROVAL_OTP();
            }
            $scope.ApprovalForceForm.submitted = false;
        }
        //}
    }
    $scope.VALIDATE_APPROVAL_OTP = function () {
        $scope.MESSAGE_OTP_SEND = "";
        $scope.MESSAGE_OTP_ERROR = "";
        var ModelObj = new Object();
        ModelObj.APPROVAL_HEADER_ID = $scope.CreditNotesViewSearch.APPROVAL_HEADER_ID;
        ModelObj.USER_ID = parseInt($cookies.get("USERID"));
        var digist = $scope.CreditNotesViewSearch.digit1 + $scope.CreditNotesViewSearch.digit2 + $scope.CreditNotesViewSearch.digit3 + $scope.CreditNotesViewSearch.digit4 + $scope.CreditNotesViewSearch.digit5 + $scope.CreditNotesViewSearch.digit6
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

    $scope.POP_SYNC_GL_ACCOUNT_Fn = function (LINE) {
        $scope.INVOICE_LINE = LINE;
        $('#POP_SYNC_GL_ACCOUNT').modal('show');
    }
    $scope.SYNC_GL_ACCOUNT_Fn = function () {
        $scope.INS_UPD_INVOICES($scope.INVOICE_LINE);
    }

    $scope.MESSAGE_OTP = "";
    $scope.MESSAGE_OTP_SEND = "";
    $scope.GENERATE_APPROVAL_OTP = function () {
        $scope.MESSAGE_OTP = "";
        $scope.MESSAGE_OTP_SEND = "";
        var ModelObj = new Object();
        ModelObj.APPROVAL_HEADER_ID = $scope.CreditNotesViewSearch.APPROVAL_HEADER_ID;
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
    $scope.PROJECT_POP_FY = function () {
        $('#PROJECT_POP').modal('show');
        if ($scope.TAB_FLAG == 1) {
            $scope.GET_PROJECT_MASTER($scope.CreditNotesViewSearch.REQUEST_DETAILS);
        }
        else if ($scope.TAB_FLAG == 3) {
            $scope.GET_PROJECT_MASTER($scope.CreditNotesViewSearch.ALL_REQUEST_DETAILS);
        };
        $scope.project_form.submitted = false;
    }

    $scope.Fn_CANCEL_SPLIT = function () {
        $scope.MONTH_LIST = [];
        $scope.INVOICE_LINE_SPLIT = [];
        $scope.remaningitemdetail = [];

        $scope.CreditNotesViewSearch.SPLIT_TYPE = null;
        $scope.REM_AMOUNT_LEFT = 0;
    }
    $scope.Fn_SPLIT_INVOICE = function (LINE, FLAG) {
        $scope.INVOICE_SPLIT_LIST = []; // Remove when edit invoice budget split come 
        LINE = {};
        if ($scope.TAB_FLAG == 1) {
            LINE = $scope.CreditNotesViewSearch.REQUEST_DETAILS;
        }
        else if ($scope.TAB_FLAG == 3) {
            LINE = $scope.CreditNotesViewSearch.ALL_REQUEST_DETAILS;
        }
        if (FLAG == 1) {
            $scope.CreditNotesViewSearch.SPLIT_TYPE = 1;
        }
        LINE.SPLIT_TYPE = $scope.CreditNotesViewSearch.SPLIT_TYPE;
        var Newdate = new Date('01/01/2010');
        var SELECT_YEAR = angular.copy(new Date(LINE.BUDGET_DATE)).getFullYear();
        var DATE = new Date(new Date(Newdate).setFullYear(SELECT_YEAR));
        var MouthStart = new Date(LINE.BUDGET_DATE).getMonth();
        var MonthEnd = MouthStart + LINE.SPLIT_TYPE;
        LINE.START_DATE = new Date(DATE);
        LINE.END_DATE = new Date(new Date(new Date(DATE).setMonth(11)).setDate(31));
        $scope.MONTH_LIST = [];
        //var count = MouthStart;
        for (var i = MouthStart; i <= MonthEnd; i++) {
            var ReadOnly = new Object();
            ReadOnly.MONTH = i;
            ReadOnly.INVOICE_DATE = MouthStart == i ? new Date(LINE.BUDGET_DATE) : new Date(DATE).setMonth(i);
            ReadOnly.ITEM_LIST = $scope.TAB_FLAG == 1 ? angular.copy($scope.ACTION_ITEM_LIST) : angular.copy($scope.ALL_ITEM_LIST);
            angular.forEach(ReadOnly.ITEM_LIST, function (_val_item, index) {
                _val_item.ITEM_INDEX = index;
                var _split_result = $scope.INVOICE_SPLIT_LIST.filter(function (_val_split) { return _val_split.PO_LINE_ID == _val_item.PO_LINE_ID && new Date(ReadOnly.INVOICE_DATE).getMonth() == new Date(_val_split.BUDGET_DATE).getMonth() && new Date(ReadOnly.INVOICE_DATE).getFullYear() == new Date(_val_split.BUDGET_DATE).getFullYear() });
                if (_split_result.length > 0) {
                    _val_item.BUDGET = $scope.SETTING_USE_GROSS == 1 ? parseFloat(_split_result[0].GROSS_AMOUNT).toFixed(2) : parseFloat(_split_result[0].NET_AMOUNT).toFixed(2);
                    _val_item.REQ_SPLIT_LIST = _split_result[0];
                    _val_item.SPLIT_TABLE_ID = _split_result[0].TABLE_ID;
                    _val_item.PO_SPLIT_ACCOUNT_ID = _split_result[0].ACCOUNT_ID;
                }
                else {
                    var taxAmount = LINE.TAX_TYPE == 3 ? 0.00 : (LINE.TAX_TYPE == 2 ? ((((_val_item.UNIT_PRICE * _val_item.QUANTITY) / (1 + (_val_item.TAX_RATE == undefined || _val_item.TAX_RATE == 0 ? 0 : _val_item.TAX_RATE / 100))) - (((_val_item.UNIT_PRICE * _val_item.QUANTITY) / (1 + (_val_item.TAX_RATE == undefined || _val_item.TAX_RATE == 0 ? 0 : _val_item.TAX_RATE / 100))) * (_val_item.DISCOUNT_PERCENT / 100))) * (_val_item.TAX_RATE == undefined || _val_item.TAX_RATE == 0 ? 0 : _val_item.TAX_RATE / 100)) : (((_val_item.UNIT_PRICE * _val_item.QUANTITY) - ((_val_item.UNIT_PRICE * _val_item.QUANTITY) * (_val_item.DISCOUNT_PERCENT / 100))) * (_val_item.TAX_RATE == undefined || _val_item.TAX_RATE == 0 ? 0 : _val_item.TAX_RATE / 100)));
                    var amount = ((_val_item.QUANTITY * 1 * _val_item.UNIT_PRICE * 1) - (_val_item.QUANTITY * 1 * _val_item.UNIT_PRICE * 1 * (_val_item.DISCOUNT_PERCENT) / 100))
                    if ($scope.INVOICE_SPLIT_LIST.length > 0) {
                        _val_item.BUDGET = _val_item.PO_LINE_ID > 0 ? 0 : parseFloat($scope.SETTING_USE_GROSS == 1 ? (amount + (LINE.TAX_TYPE == 2 ? 0 : taxAmount)) / (LINE.SPLIT_TYPE + 1) : LINE.TAX_TYPE == 2 ? parseFloat((amount - taxAmount) / (LINE.SPLIT_TYPE + 1)).toFixed(2) : parseFloat(amount / (LINE.SPLIT_TYPE + 1))).toFixed(2);
                        _val_item.PO_SPLIT_ACCOUNT_ID = _val_item.ACCOUNT_ID;
                    }
                    else {
                        _val_item.BUDGET = parseFloat($scope.SETTING_USE_GROSS == 1 ? (amount + (LINE.TAX_TYPE == 2 ? 0 : taxAmount)) / (LINE.SPLIT_TYPE + 1) : LINE.TAX_TYPE == 2 ? parseFloat((amount - taxAmount) / (LINE.SPLIT_TYPE + 1)).toFixed(2) : parseFloat(amount / (LINE.SPLIT_TYPE + 1))).toFixed(2);
                        _val_item.PO_SPLIT_ACCOUNT_ID = _val_item.ACCOUNT_ID;
                    }
                }
            });
            $scope.MONTH_LIST.push(ReadOnly);
        }
    }
    function monthDiff(dateFrom, dateTo) {
        return dateTo.getMonth() - dateFrom.getMonth() + (12 * (dateTo.getFullYear() - dateFrom.getFullYear()))
    }
    $scope.Fn_SPLIT_PROCESS_ALL_OUT_INVOICE = function (LINE, FLAG) {
        // Remove when edit invoice budget split come 
        LINE = {};
        var Newdate = new Date('01/01/2010');
        let maximumnibDate = angular.copy($filter('maxmindate')($scope.INVOICE_PROCESS_SPLIT_LIST, 'INVOICE_DATE'));
        var maxmindates = maximumnibDate.split(':;:');
        var _splittype = monthDiff(new Date(maxmindates[1]), new Date(maxmindates[0]));
        var SELECT_YEAR = angular.copy(new Date(maxmindates[1])).getFullYear();
        var DATE = new Date(new Date(Newdate).setFullYear(SELECT_YEAR));
        var MouthStart = new Date(maxmindates[1]).getMonth();
        var MonthEnd = MouthStart + _splittype;

        if ($scope.TAB_FLAG == 2) {
            LINE = $scope.CreditNotesViewSearch.PROCESS_REQUEST_DETAILS;
            $scope.CreditNotesViewSearch.PROCESS_REQUEST_DETAILS.SPLIT_TYPE = _splittype;
        }
        else if ($scope.TAB_FLAG == 3) {
            LINE = $scope.CreditNotesViewSearch.ALL_REQUEST_DETAILS;
            $scope.CreditNotesViewSearch.ALL_REQUEST_DETAILS.SPLIT_TYPE = _splittype;
        }
        LINE.START_DATE = new Date(DATE);
        LINE.END_DATE = new Date(new Date(new Date(DATE).setMonth(11)).setDate(31));
        $scope.MONTH_PROCESS_ALL_LIST = [];
        for (var i = MouthStart; i <= MonthEnd; i++) {
            var ReadOnly = new Object();
            ReadOnly.MONTH = i;
            ReadOnly.INVOICE_DATE = MouthStart == i ? new Date(maxmindates[1]) : new Date(DATE).setMonth(i);
            ReadOnly.ITEM_LIST = $scope.TAB_FLAG == 2 ? angular.copy($scope.PROCESS_REQUEST_ITEMS_LIST) : angular.copy($scope.ALL_ITEM_LIST);
            angular.forEach(ReadOnly.ITEM_LIST, function (_val_item, index) {
                _val_item.ITEM_INDEX = index;
                var _split_result = $scope.INVOICE_PROCESS_SPLIT_LIST.filter(function (_val_split) { return _val_split.INVOICE_LINE_ID == _val_item.INVOICE_LINE_ID && new Date(ReadOnly.INVOICE_DATE).getMonth() == new Date(_val_split.INVOICE_DATE).getMonth() && new Date(ReadOnly.INVOICE_DATE).getFullYear() == new Date(_val_split.INVOICE_DATE).getFullYear() });
                if (_split_result.length > 0) {
                    _val_item.BUDGET = $scope.SETTING_USE_GROSS == 1 ? parseFloat(_split_result[0].GROSS_AMOUNT).toFixed(2) : parseFloat(_split_result[0].NET_AMOUNT).toFixed(2);
                    _val_item.REQ_SPLIT_LIST = _split_result[0];
                    _val_item.SPLIT_TABLE_ID = _split_result[0].TABLE_ID;
                    _val_item.PO_SPLIT_ACCOUNT_ID = _split_result[0].ACCOUNT_ID;
                }
                else {
                    var taxAmount = LINE.TAX_TYPE == 3 ? 0.00 : (LINE.TAX_TYPE == 2 ? ((((_val_item.UNIT_PRICE * _val_item.QUANTITY) / (1 + (_val_item.TAX_RATE == undefined || _val_item.TAX_RATE == 0 ? 0 : _val_item.TAX_RATE / 100))) - (((_val_item.UNIT_PRICE * _val_item.QUANTITY) / (1 + (_val_item.TAX_RATE == undefined || _val_item.TAX_RATE == 0 ? 0 : _val_item.TAX_RATE / 100))) * (_val_item.DISCOUNT_PERCENT / 100))) * (_val_item.TAX_RATE == undefined || _val_item.TAX_RATE == 0 ? 0 : _val_item.TAX_RATE / 100)) : (((_val_item.UNIT_PRICE * _val_item.QUANTITY) - ((_val_item.UNIT_PRICE * _val_item.QUANTITY) * (_val_item.DISCOUNT_PERCENT / 100))) * (_val_item.TAX_RATE == undefined || _val_item.TAX_RATE == 0 ? 0 : _val_item.TAX_RATE / 100)));
                    var amount = ((_val_item.QUANTITY * 1 * _val_item.UNIT_PRICE * 1) - (_val_item.QUANTITY * 1 * _val_item.UNIT_PRICE * 1 * (_val_item.DISCOUNT_PERCENT) / 100))
                    if ($scope.INVOICE_PROCESS_SPLIT_LIST.length > 0) {
                        _val_item.BUDGET = _val_item.INVOICE_LINE_ID > 0 ? 0 : parseFloat($scope.SETTING_USE_GROSS == 1 ? (amount + (LINE.TAX_TYPE == 2 ? 0 : taxAmount)) / (LINE.SPLIT_TYPE + 1) : LINE.TAX_TYPE == 2 ? parseFloat((amount - taxAmount) / (LINE.SPLIT_TYPE + 1)).toFixed(2) : parseFloat(amount / (LINE.SPLIT_TYPE + 1))).toFixed(2);
                        _val_item.PO_SPLIT_ACCOUNT_ID = _val_item.ACCOUNT_ID;
                    }
                }
            });
            $scope.MONTH_PROCESS_ALL_LIST.push(ReadOnly);
        }
    }
    $scope.Fn_RETURN_CURRENT_AMT = function (BD, BL) {
        if (BD.CURRENT_AMOUNT == undefined) {
            BD.CURRENT_AMOUNT = 0;
        };
        var CurrentAmount = 0;
        var itemdetail = [];
        angular.forEach($scope.MONTH_LIST, function (_m) {
            angular.forEach(_m.ITEM_LIST, function (_val_item) {
                if (_val_item.ACCOUNT_ID == BD.ACCOUNT_ID && new Date($scope.REQ_Search.PO_DATE).getMonth() == new Date(_m.START_DATE).getMonth() && new Date($scope.REQ_Search.PO_DATE).getFullYear() == new Date(_m.START_DATE).getFullYear()) {
                    if (_val_item.BUDGET != undefined && _val_item.BUDGET != "" && _val_item.BUDGET != null) {
                        BD.CURRENT_AMOUNT = parseFloat(BD.CURRENT_AMOUNT) + parseFloat(_val_item.BUDGET);
                        CurrentAmount = BD.CURRENT_AMOUNT / $scope.REQ_Search.BASE_TO_PO_CONVERSION_RATE;
                    }
                }
                if (_m.FLAG == 1) {
                    itemdetail.push(_val_item);
                }
            });
        });
        $scope.REM_AMOUNT_LEFT = angular.copy($filter('sumOfModValue')(itemdetail, 'REMAINING_AMOUNT'));
        return CurrentAmount;
    }
    $scope.EDIT_REQ_PO_APPROVER_BTN = function (FLAG) {
        $scope.$parent.overlay_loadingNew = 'block';
        $('#EDIT_REQ').modal('show');
        if (FLAG == 1) {
            $scope.Edit_REQ_childScope.PAGE_LOAD_EDIT_REQ($scope.CreditNotesViewSearch.REQUEST_DETAILS, 1, 'IS_APPROVER', $scope.SELECTED_REQ);
        }
        else if (FLAG == 3) {
            $scope.Edit_REQ_childScope.PAGE_LOAD_EDIT_REQ($scope.CreditNotesViewSearch.ALL_REQUEST_DETAILS, 1, 'IS_APPROVER', $scope.SELECTED_REQ_ALL);
        }
        $scope.$parent.COMMON_CODE_CHANGE();
    }

    $scope.RESEND_GENERATE_APPROVAL_OTP = function () {
        $scope.MESSAGE_OTP = "";
        $scope.MESSAGE_OTP_SEND = "";
        var ModelObj = new Object();
        ModelObj.APPROVAL_HEADER_ID = $scope.CreditNotesViewSearch.APPROVAL_HEADER_ID;
        ModelObj.USER_ID = parseInt($cookies.get("USERID"));
        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PrcCommMethods.PAYMENT_API(ModelObj, 'GENERATE_APPROVAL_OTP').then(function (data) {
            if (data.data == undefined) {
                $scope.$parent.ShowAlert('Error', $scope.$parent.SOMETHINGWENTWRONG, 5000);
            }
            $scope.MESSAGE_OTP_SEND = "OTP has been resend to your registered email";
        });
    }
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
    $scope.REMOVE_FILTE = function (index) {
        $scope.PurchaseRequestSearch.UploadedFiles.splice(index, 1)
    }

    $scope.APPROVE_CLICK_FY = function () {
        if ($scope.REM_AMOUNT_LEFT == 0) {
            $scope.ApprovalForm.submitted = true;
            if ($scope.ApprovalForm.$valid) {
                var errorCnt = 0;
                var IS_ALLOW;
                if (errorCnt == 1) {
                    IS_ALLOW = confirm("You have not selected any invoice to approve, Are you sure you want to reject all invoices?");
                }
                else {
                    IS_ALLOW = confirm('Are you sure you want to submit for approval?')
                }
                if (IS_ALLOW) {
                    $scope.SET_INVOICE_APPROVAL();
                }
            }
        }
        else {
            $scope.$parent.ShowAlert("Error", "Remaining amount should be zero", 3000);
        }
    }
    $scope.CLICK_APPROVE_FORCE_Fn = function () {
        $scope.ApprovalForceForm.submitted = true;
        if ($scope.ApprovalForceForm.$valid) {
            var errorCnt = 0;
            var IS_ALLOW;
            if (errorCnt == 1) {
                IS_ALLOW = confirm("You have not selected any invoice to approve, Are you sure you want to reject all invoices?");
            }
            else {
                IS_ALLOW = confirm('Are you sure you want to proceed?');
            }
            if (IS_ALLOW) {
                $scope.FORCE_APPROVE_REJECT_APPROVAL_HEADERS();
            }
        }
    }

    $scope.MATCHED_PO_LINE_FY = function (PO_LINE, index, INVOICE_LINE) {
        IS_ACCOUNT_MATCH = true;
        if (INVOICE_LINE.MATCHES.length > 0) {
            for (var i = 0; i < INVOICE_LINE.MATCHES.length; i++) {
                if (PO_LINE.ACCOUNT_ID != INVOICE_LINE.MATCHES[i].ACCOUNT_ID) {
                    IS_ACCOUNT_MATCH = false;
                    $scope.$parent.ShowAlert("Attention", "Please match same mapped GL account", 3000);
                    break;
                }
            }
        }
        if (IS_ACCOUNT_MATCH) {
            INVOICE_LINE.ACCOUNT_MATCH = false;
            if (PO_LINE.RECEIVING_TYPE_ID == 1) {
                PO_LINE.REMAINING_OPEN_TO_INVOICE = PO_LINE.REMAINING_QTY - PO_LINE.CURRENT_QTY;
                if (PO_LINE.REMAINING_OPEN_TO_INVOICE <= INVOICE_LINE.REMAINING_TO_MAP_QTY) {
                    PO_LINE.CURRENT_QTY = angular.copy(PO_LINE.CURRENT_QTY + PO_LINE.REMAINING_OPEN_TO_INVOICE);
                    PO_LINE.USED_QTY = angular.copy(PO_LINE.REMAINING_OPEN_TO_INVOICE);

                }
                else if (PO_LINE.REMAINING_OPEN_TO_INVOICE > INVOICE_LINE.REMAINING_TO_MAP_QTY) {
                    PO_LINE.CURRENT_QTY = angular.copy(PO_LINE.CURRENT_QTY + INVOICE_LINE.REMAINING_TO_MAP_QTY);
                    PO_LINE.USED_QTY = angular.copy(INVOICE_LINE.REMAINING_TO_MAP_QTY);
                }
                INVOICE_LINE.REMAINING_TO_MAP_QTY = INVOICE_LINE.REMAINING_TO_MAP_QTY - PO_LINE.REMAINING_OPEN_TO_INVOICE;
                INVOICE_LINE.REMAINING_TO_MAP_QTY = INVOICE_LINE.REMAINING_TO_MAP_QTY < 0 ? 0 : INVOICE_LINE.REMAINING_TO_MAP_QTY;

                if (PO_LINE.ACCOUNT_ID == INVOICE_LINE.ACCOUNT_ID) {
                    INVOICE_LINE.ACCOUNT_MATCH = true;
                }

                PO_LINE.REMAINING_OPEN_TO_INVOICE = PO_LINE.REMAINING_AMOUNT - PO_LINE.CURRENT_AMOUNT;
                if (PO_LINE.REMAINING_OPEN_TO_INVOICE <= INVOICE_LINE.REMAINING_TO_MAP_AMOUNT) {
                    PO_LINE.CURRENT_AMOUNT = angular.copy(PO_LINE.CURRENT_AMOUNT + PO_LINE.REMAINING_OPEN_TO_INVOICE);
                    PO_LINE.USED_AMOUNT = angular.copy(PO_LINE.REMAINING_OPEN_TO_INVOICE);
                }
                else if (PO_LINE.REMAINING_OPEN_TO_INVOICE > INVOICE_LINE.REMAINING_TO_MAP_AMOUNT) {
                    PO_LINE.CURRENT_AMOUNT = angular.copy(PO_LINE.CURRENT_AMOUNT + INVOICE_LINE.REMAINING_TO_MAP_AMOUNT);
                    PO_LINE.USED_AMOUNT = angular.copy(INVOICE_LINE.REMAINING_TO_MAP_AMOUNT);
                }
                INVOICE_LINE.REMAINING_TO_MAP_AMOUNT = INVOICE_LINE.REMAINING_TO_MAP_AMOUNT - PO_LINE.REMAINING_OPEN_TO_INVOICE;
                INVOICE_LINE.REMAINING_TO_MAP_AMOUNT = INVOICE_LINE.REMAINING_TO_MAP_AMOUNT < 0 ? 0 : INVOICE_LINE.REMAINING_TO_MAP_AMOUNT;

                //INVOICE_LINE.IS_DROP_DOWN_SHOW = INVOICE_LINE.REMAINING_TO_MAP_AMOUNT > 0 ? true : false;

                INVOICE_LINE.MATCHES.push(angular.copy(PO_LINE));

                $scope.MAPPED_LIST.push(angular.copy(PO_LINE));
                INVOICE_LINE.IS_DROP_DOWN_SHOW = INVOICE_LINE.REMAINING_TO_MAP_QTY > 0 ? true : false;
            }
            else if (PO_LINE.RECEIVING_TYPE_ID == 2) {
                PO_LINE.REMAINING_OPEN_TO_INVOICE = PO_LINE.REMAINING_AMOUNT - PO_LINE.CURRENT_AMOUNT;
                if (PO_LINE.REMAINING_OPEN_TO_INVOICE <= INVOICE_LINE.REMAINING_TO_MAP_AMOUNT_TYPE_2) {
                    PO_LINE.CURRENT_AMOUNT = angular.copy(parseFloat(parseFloat(PO_LINE.CURRENT_AMOUNT).toFixed(2)) + parseFloat(parseFloat(PO_LINE.REMAINING_OPEN_TO_INVOICE).toFixed(2)));
                    PO_LINE.USED_AMOUNT = angular.copy(PO_LINE.REMAINING_OPEN_TO_INVOICE);
                }
                else if (PO_LINE.REMAINING_OPEN_TO_INVOICE > INVOICE_LINE.REMAINING_TO_MAP_AMOUNT_TYPE_2) {
                    PO_LINE.CURRENT_AMOUNT = angular.copy(parseFloat(parseFloat(PO_LINE.CURRENT_AMOUNT).toFixed(2)) + parseFloat(parseFloat(INVOICE_LINE.REMAINING_TO_MAP_AMOUNT_TYPE_2).toFixed(2)));
                    PO_LINE.USED_AMOUNT = angular.copy(INVOICE_LINE.REMAINING_TO_MAP_AMOUNT_TYPE_2);
                }
                INVOICE_LINE.REMAINING_TO_MAP_AMOUNT_TYPE_2 = parseFloat(parseFloat(INVOICE_LINE.REMAINING_TO_MAP_AMOUNT_TYPE_2).toFixed(2)) - parseFloat(parseFloat(PO_LINE.REMAINING_OPEN_TO_INVOICE).toFixed(2));
                INVOICE_LINE.REMAINING_TO_MAP_AMOUNT_TYPE_2 = INVOICE_LINE.REMAINING_TO_MAP_AMOUNT_TYPE_2 < 0 ? 0 : INVOICE_LINE.REMAINING_TO_MAP_AMOUNT_TYPE_2;

                INVOICE_LINE.IS_DROP_DOWN_SHOW = INVOICE_LINE.REMAINING_TO_MAP_AMOUNT_TYPE_2 > 0 ? true : false;
                if (PO_LINE.ACCOUNT_ID == INVOICE_LINE.ACCOUNT_ID) {
                    INVOICE_LINE.ACCOUNT_MATCH = true;
                }
                PO_LINE.CUSTOM_INDEX = $scope.MAPPED_LIST.length + 1;
                INVOICE_LINE.MATCHES.push(angular.copy(PO_LINE));
                $scope.MAPPED_LIST.push(angular.copy(PO_LINE));
            }
        }

        $scope.THREE_WAY_MATCH(INVOICE_LINE);
    }

    $scope.PO_LINES_FOR_INVOICE_PO_MAPPING = [];
    $scope.PO_CLICK_FY = function (LINE, OLD_FLAG, LOAD_FLAG, index) {
        if (LINE.IS_SELECTED) {
            $scope.GET_PO_LINES_FOR_INVOICE_PO_MAPPING(LINE, OLD_FLAG, LOAD_FLAG, index);
        }
        else {
            $scope.MOVE_TO(LINE, 2, OLD_FLAG, LOAD_FLAG)
        }
    }
    $scope.UNDO_MATCH_FY = function (INVOICE_LINE, PO_LINE, CLICK_FLAG, index) {
        //Add Update in MATCHED_PO_MAPPING_LIST 
        var IS_VALID = true;
        if (PO_LINE.TABLE_ID > 0) {
            IS_VALID = confirm('Are you sure, you want to undo?')
            if (IS_VALID) {
                $scope.DELETE_INS_UPD_INVOICE_PO_MAPPING(INVOICE_LINE, 1, PO_LINE, CLICK_FLAG);
            }
        }
        if (IS_VALID) {
            if (PO_LINE.RECEIVING_TYPE_ID == 1) {
                INVOICE_LINE.REMAINING_TO_MAP_QTY = INVOICE_LINE.REMAINING_TO_MAP_QTY + PO_LINE.USED_QTY;
                INVOICE_LINE.REMAINING_TO_MAP_AMOUNT = INVOICE_LINE.REMAINING_TO_MAP_AMOUNT + PO_LINE.USED_AMOUNT;
                INVOICE_LINE.IS_DROP_DOWN_SHOW = INVOICE_LINE.REMAINING_TO_MAP_QTY > 0 ? true : false;
            }
            if (PO_LINE.RECEIVING_TYPE_ID == 2) {
                INVOICE_LINE.REMAINING_TO_MAP_AMOUNT_TYPE_2 = INVOICE_LINE.REMAINING_TO_MAP_AMOUNT_TYPE_2 + PO_LINE.USED_AMOUNT;
                INVOICE_LINE.IS_DROP_DOWN_SHOW = INVOICE_LINE.REMAINING_TO_MAP_AMOUNT_TYPE_2 > 0 ? true : false;
            }
            angular.forEach($scope.PO_LINES_FOR_INVOICE_PO_MAPPING, function (x) {
                if (x.PO_LINE_ID == PO_LINE.PO_LINE_ID) {
                    if (PO_LINE.RECEIVING_TYPE_ID == 1) {
                        x.CURRENT_QTY = angular.copy(x.CURRENT_QTY - PO_LINE.USED_QTY);

                        //x.CURRENT_QTY = x.CURRENT_QTY < 0 ? x.CURRENT_QTY * -1 : x.CURRENT_QTY;
                        x.CURRENT_AMOUNT = angular.copy(x.CURRENT_AMOUNT - PO_LINE.USED_AMOUNT);

                        //                    x.CURRENT_AMOUNT = x.CURRENT_AMOUNT < 0 ? x.CURRENT_AMOUNT * -1 : x.CURRENT_AMOUNT;
                    }
                    else if (PO_LINE.RECEIVING_TYPE_ID == 2) {
                        x.CURRENT_AMOUNT = angular.copy(x.CURRENT_AMOUNT - PO_LINE.USED_AMOUNT);
                        //                  x.CURRENT_AMOUNT = x.CURRENT_AMOUNT < 0 ? x.CURRENT_AMOUNT * -1 : x.CURRENT_AMOUNT;
                    }
                }
            });
            //Remove From INvoice Line
            INVOICE_LINE.MATCHES.splice(index, 1);
            var indexpoline = $scope.MAPPED_LIST.findIndex(x => x.CUSTOM_INDEX === parseInt(PO_LINE.CUSTOM_INDEX));
            $scope.MAPPED_LIST.splice(indexpoline, 1);
        }
        $scope.THREE_WAY_MATCH(INVOICE_LINE);
    }
    $scope.MOVE_TO = function (LINE, ADD_REMOVE_FLAG, OLD_FLAG, LOAD_FLAG) {
        if (ADD_REMOVE_FLAG == 1) { //ADD
            angular.forEach(LINE.PO_LINES_FOR_INVOICE_PO_MAPPING, function (ADD_LINE) {
                var lgth = $scope.PO_LINES_FOR_INVOICE_PO_MAPPING.filter(function (x) { return x.PO_LINE_ID == ADD_LINE.PO_LINE_ID; });
                if (lgth.length == 0) {
                    var REM_SUM_QTY = 0;
                    var REM_SUM_AMT = 0;
                    var INV_PO_LINE_lgth = $scope.INVOICE_PO_MAPPING.filter(function (x) { return x.PO_LINE_ID == ADD_LINE.PO_LINE_ID; });

                    for (let i = 0; i < INV_PO_LINE_lgth.length; i++) { REM_SUM_QTY += INV_PO_LINE_lgth[i].MAPPED_QTY; REM_SUM_AMT += INV_PO_LINE_lgth[i].MAPPED_AMOUNT; }

                    if (OLD_FLAG == 1 && ADD_LINE.PO_LINE_ID == ADD_LINE.PO_LINE_ID) {
                        ADD_LINE.CURRENT_QTY = angular.copy(REM_SUM_QTY);
                        ADD_LINE.CURRENT_AMOUNT = angular.copy(REM_SUM_AMT);
                    }
                    else {
                        ADD_LINE.CURRENT_QTY = 0;
                        ADD_LINE.CURRENT_AMOUNT = 0;
                    }
                    ADD_LINE.REMAINING_QTY = ADD_LINE.REMAINING_QTY == 0 ? angular.copy(REM_SUM_QTY) : ADD_LINE.REMAINING_QTY + REM_SUM_QTY;
                    ADD_LINE.REMAINING_AMOUNT = ADD_LINE.REMAINING_AMOUNT == 0 ? angular.copy(REM_SUM_AMT) : ADD_LINE.REMAINING_AMOUNT + REM_SUM_AMT;
                    $scope.PO_LINES_FOR_INVOICE_PO_MAPPING.push(ADD_LINE);
                }
            });

            if (LOAD_FLAG == 1) {
                $scope.$parent.overlay_loadingNew = 'none';
            }
        }
        else if (ADD_REMOVE_FLAG == 2) { //Remove
            angular.forEach(LINE.PO_LINES_FOR_INVOICE_PO_MAPPING, function (REMOVE, index) {
                var PO_LINE_ID_INDEX = $scope.PO_LINES_FOR_INVOICE_PO_MAPPING.findIndex(x => x.PO_LINE_ID === REMOVE.PO_LINE_ID);
                $scope.PO_LINES_FOR_INVOICE_PO_MAPPING.splice(PO_LINE_ID_INDEX, 1);
            });
        }
    }

    $scope.REMOVE_PO_IN_FILTE = function (index, LINE) {
        //Array, item, index, FLAG
        $scope.$parent.DELETE_UPLOAD_ALL($scope.PO_ATTACHMENT_IN_INVOICE, LINE, index, 2);
    }
    $scope.REMOVE_GRN_FILTE = function (index, LINE) {
        $scope.$parent.DELETE_UPLOAD_ALL($scope.GRN_ATTACHMENT, LINE, index, 2);
    }
    $scope.REMOVE_INVOICE_IN_FILTE = function (index, LINE) {
        $scope.$parent.DELETE_UPLOAD_ALL($scope.CreditNotesViewSearch.REQUEST_DETAILS, LINE, index, 2);
    }
    $scope.REMOVE_INVOICE_IN_FILTE_ALL = function (index, LINE) {
        $scope.$parent.DELETE_UPLOAD_ALL($scope.CreditNotesViewSearch.ALL_REQUEST_DETAILS, LINE, index, 2);
    }
    $scope.CLOSE_PDF = function () {
        document.getElementById("MATCH_LINE").style.zIndex = "-1";
        document.getElementById("MATCH_LINE").style.width = "0%";
    }
    $scope.SELECTED_MATCH_PO = function (FLAG) {
        $scope.MATCH_DIV_SHOW = true;
        $('#Edit_Matching').modal('hide');
    };
    $scope.SET_INVOICE_APPROVAL = function () {
        var ModelObj = new Object();
        var ALL_AND_ACTION = "";
        var ITEM_LIST = [];
        var _remainingleft = false;
        if ($scope.TAB_FLAG == 1) {
            ALL_AND_ACTION = $scope.CreditNotesViewSearch.REQUEST_DETAILS;
            ITEM_LIST = $scope.ACTION_ITEM_LIST;
            _remainingleft = parseFloat(parseFloat($scope.CreditNotesViewSearch.REQUEST_DETAILS.CUSTOM_TOTAL_AMOUNT).toFixed(2)) != parseFloat(parseFloat(($scope.CreditNotesViewSearch.REQUEST_DETAILS.MATCHED_PO_AMOUNT)).toFixed(2));
        }
        else if ($scope.TAB_FLAG == 3) {
            ALL_AND_ACTION = $scope.CreditNotesViewSearch.ALL_REQUEST_DETAILS;
            ITEM_LIST = $scope.ALL_ITEM_LIST;
            ModelObj.COMMENTS = $scope.CreditNotesViewSearch.COMMENTS;
            _remainingleft = parseFloat(parseFloat($scope.CreditNotesViewSearch.ALL_REQUEST_DETAILS.CUSTOM_TOTAL_AMOUNT).toFixed(2)) != parseFloat(parseFloat(($scope.CreditNotesViewSearch.ALL_REQUEST_DETAILS.MATCHED_PO_AMOUNT)).toFixed(2));
        };

        //$('#Approved_Reject_POP').modal('hide');
        ModelObj.INVOICE_HEADER_ID = ALL_AND_ACTION.INVOICE_HEADER_ID;
        ModelObj.MATCH_TYPE = 0;//Nothing 
        //if ($scope.MAPPED_LIST.length == 0) { //--1 no po, 2 way match 3   3 way match
        //    ModelObj.MATCH_TYPE = 1;
        //}
        //else if ($scope.MAPPED_LIST.length > 0 && ITEM_LIST.filter(function (x) { return x.GRN_MATCH }).length == ITEM_LIST.length) {
        //    ModelObj.MATCH_TYPE = 3;
        //}
        //else if (ITEM_LIST.filter(function (x) { return x.IS_DROP_DOWN_SHOW }).length > 0 || _remainingleft == true) {
        //    //Invoice amount is greater then po amount then it torelance apply and it will consider in 2 way match
        //    var toleranceamount = parseFloat($scope.SETTING_TOLERANCE_PER_44) == 0 ? 0 : (1 + parseFloat($scope.SETTING_TOLERANCE_PER_44) / 100);
        //    if ($scope.TAB_FLAG == 1) {
        //        ModelObj.MATCH_TYPE = 1;
        //        if (parseFloat(parseFloat($scope.CreditNotesViewSearch.REQUEST_DETAILS.CUSTOM_TOTAL_AMOUNT).toFixed(2)) <= parseFloat(parseFloat(toleranceamount * ($scope.CreditNotesViewSearch.REQUEST_DETAILS.MATCHED_PO_AMOUNT)).toFixed(2))) {
        //            ModelObj.MATCH_TYPE = 2;
        //        };
        //    }
        //    else if ($scope.TAB_FLAG == 3) {
        //        ModelObj.MATCH_TYPE = 1;
        //        if (parseFloat(parseFloat($scope.CreditNotesViewSearch.ALL_REQUEST_DETAILS.CUSTOM_TOTAL_AMOUNT).toFixed(2)) <= parseFloat(parseFloat(toleranceamount * ($scope.CreditNotesViewSearch.ALL_REQUEST_DETAILS.MATCHED_PO_AMOUNT)).toFixed(2))) {
        //            ModelObj.MATCH_TYPE = 2;
        //        };
        //    }
        //}
        //else {
        //    if ($scope.TAB_FLAG == 1) {
        //        ModelObj.MATCH_TYPE = 1;
        //        if (parseFloat(parseFloat($scope.CreditNotesViewSearch.REQUEST_DETAILS.CUSTOM_TOTAL_AMOUNT).toFixed(2)) == parseFloat(parseFloat(($scope.CreditNotesViewSearch.REQUEST_DETAILS.MATCHED_PO_AMOUNT)).toFixed(2))) {
        //            ModelObj.MATCH_TYPE = 2;
        //        };
        //    }
        //    else if ($scope.TAB_FLAG == 3) {
        //        ModelObj.MATCH_TYPE = 1;
        //        if (parseFloat(parseFloat($scope.CreditNotesViewSearch.ALL_REQUEST_DETAILS.CUSTOM_TOTAL_AMOUNT).toFixed(2)) == parseFloat(parseFloat(($scope.CreditNotesViewSearch.ALL_REQUEST_DETAILS.MATCHED_PO_AMOUNT)).toFixed(2))) {
        //            ModelObj.MATCH_TYPE = 2;
        //        };
        //    }
        //}
        ModelObj.USER_ID = parseInt($cookies.get("USERID"));
        ModelObj.COMMENTS = $scope.CreditNotesViewSearch.COMMENTS;
        ModelObj.SPLIT_TYPE = $scope.CreditNotesViewSearch.SPLIT_TYPE;
        ModelObj.P2P_BUDGET_SNAPSHOT_TYPE = [];
        ModelObj.INVOICE_LINE_SPLIT = [];
        ModelObj.OVER_BUDGET = 0;
        ModelObj.OVER_BUDGET_AMOUNT = 0;
        ModelObj.OVER_BUDGET_PERCENTAGE = 0;


        angular.forEach($scope.CONDITION_P2P_BUDGET_MASTER_LIST, function (val) {
            var over_budget_amt_to_add = 0;
            var rowcount = 1;
            angular.forEach(val.BUDGET_DETAILS_LIST, function (item) {
                if (val.DB_ACCOUNT_ID == 0) { item.REMAINING_AMOUNT = item.REMAINING; }
                var ReadOnlyApproval = new Object();
                ReadOnlyApproval.APPROVAL_HEADER_ID = null;// admin header go 
                ReadOnlyApproval.APPROVAL_HEADER_STATUS_ID = null;// admin no status will go
                ReadOnlyApproval.ACCOUNT_ID = val.ACCOUNT_ID;
                ReadOnlyApproval.YTD = item.LINE_ID == 2 ? 1 : 0;
                ReadOnlyApproval.TOTAL = parseFloat(item.TOTAL).toFixed(5);
                ReadOnlyApproval.REMAINING = parseFloat(item.REMAINING_AMOUNT).toFixed(5);
                ReadOnlyApproval.CONSUMED = parseFloat(item.CONSUMED).toFixed(5);
                ReadOnlyApproval.BOOKED = parseFloat(item.BOOKED).toFixed();
                ReadOnlyApproval.CURRENT = val.DB_ACCOUNT_ID == 0 ? 0 : isNaN(parseFloat(item.CURRENT_PO_CUSTOM).toFixed(5)) ? 0 : parseFloat(item.CURRENT_PO_CUSTOM).toFixed(5);
                if (val.BUDGET_DETAILS_LIST.length == 2) {
                    ReadOnlyApproval.OVER_BUDGET = item.LINE_ID == 2 && parseFloat(parseFloat(item.REMAINING_AMOUNT).toFixed(5)) < 0 ? 1 : 0;
                }
                else {
                    ReadOnlyApproval.OVER_BUDGET = parseFloat(parseFloat(item.REMAINING_AMOUNT).toFixed(5)) < 0 ? 1 : 0;
                }
                ReadOnlyApproval.PERIOD = item.PERIOD;
                ReadOnlyApproval.ACCOUNT_DETAILS = val.GLACCOUNT_NAME;
                if (parseFloat(parseFloat(item.REMAINING_AMOUNT).toFixed(5)) < 0 && val.BUDGET_DETAILS_LIST.length == 2 && item.LINE_ID == 2 || parseFloat(parseFloat(item.REMAINING_AMOUNT).toFixed(5)) < 0 && val.BUDGET_DETAILS_LIST.length == 1) {
                    ModelObj.OVER_BUDGET = ReadOnlyApproval.OVER_BUDGET;
                    let OverBudgetPercentage = (item.REMAINING_AMOUNT * -1 / item.TOTAL) * 100
                    if (parseFloat(OverBudgetPercentage.toFixed(2)) > parseFloat(parseFloat(ModelObj.OVER_BUDGET_PERCENTAGE).toFixed(2))) {
                        ModelObj.OVER_BUDGET_PERCENTAGE = parseFloat(parseFloat(OverBudgetPercentage).toFixed(2));
                        over_budget_amt_to_add = over_budget_amt_to_add == 0 ? parseFloat(item.REMAINING_AMOUNT * -1) : (parseFloat(over_budget_amt_to_add) < parseFloat(item.REMAINING_AMOUNT * -1) ? parseFloat(item.REMAINING_AMOUNT * -1) : over_budget_amt_to_add);
                    }
                }
                if (rowcount == val.BUDGET_DETAILS_LIST.length) {
                    ModelObj.OVER_BUDGET_AMOUNT = parseFloat(ModelObj.OVER_BUDGET_AMOUNT) + parseFloat(over_budget_amt_to_add.toFixed(5));
                }
                ReadOnlyApproval.CREDIT_MEMO = parseFloat(item.MEMO).toFixed(5);
                ModelObj.P2P_BUDGET_SNAPSHOT_TYPE.push(ReadOnlyApproval);
                rowcount++;
            });
        });

        //angular.forEach($scope.MONTH_LIST, function (_m, _m_index) {
        //    angular.forEach(_m.ITEM_LIST, function (_item) {
        //        var readonly = new Object()
        //        readonly.TABLE_ID = _item.SPLIT_TABLE_ID == undefined || _item.SPLIT_TABLE_ID == "" ? null : _item.SPLIT_TABLE_ID;
        //        readonly.INVOICE_LINE_NO = _item.LINE_NO;
        //        readonly.INVOICE_DATE = ($filter('date')(new Date(_m.INVOICE_DATE)));
        //        if ($scope.SETTING_USE_GROSS == 1) {
        //            var NET = _item.BUDGET == undefined || _item.BUDGET == '' || _item.BUDGET == null ? "0" : (_item.BUDGET) / (1 + (_item.TAX_RATE / 100));
        //            readonly.NET_AMOUNT = parseFloat(NET).toFixed(5);
        //            readonly.GROSS_AMOUNT = _item.BUDGET == undefined || _item.BUDGET == '' || _item.BUDGET == null ? "0" : parseFloat(_item.BUDGET).toFixed(5);
        //        }
        //        else {
        //            var GROSS_NET = _item.BUDGET == undefined || _item.BUDGET == '' || _item.BUDGET == null ? "0" : (_item.BUDGET) * (1 + (_item.TAX_RATE / 100))
        //            readonly.NET_AMOUNT = _item.BUDGET == undefined || _item.BUDGET == '' || _item.BUDGET == null ? "0" : parseFloat(_item.BUDGET).toFixed(5);
        //            readonly.GROSS_AMOUNT = parseFloat(GROSS_NET).toFixed(5);
        //        }
        //        readonly.DELETE_FLAG = 0;
        //        ModelObj.INVOICE_LINE_SPLIT.push(readonly);
        //    });
        //});
        if (ModelObj.INVOICE_LINE_SPLIT.length == 0) {
            var readonly = new Object()
            readonly.TABLE_ID = null;
            readonly.INVOICE_LINE_NO = null;
            readonly.INVOICE_DATE = null;
            readonly.NET_AMOUNT = null;
            readonly.GROSS_AMOUNT = null;
            readonly.DELETE_FLAG = null;
            ModelObj.INVOICE_LINE_SPLIT.push(readonly);
        }
        ///SET_INVOICE_APPROVAL also use
        PrcCommMethods.P2P_API(ModelObj, 'INS_UPD_INVOICE_SPLIT', 'PO').then(function (data) {
            $('#Approved_Reject_POP').modal('hide');
            if (data.data != undefined && data.data == null) {
                $scope.$parent.ShowAlert('Error', $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
            if (data.data != undefined && data.data == 1) {
                $scope.$parent.ShowAlert("Success", "Submit for approval", 3000);
                $scope.CreditNotesViewSearch.COMMENTS = "";
                if ($scope.TAB_FLAG == 1) {
                    $scope.GET_INVOICES_ACTION(1);
                }
                else if ($scope.TAB_FLAG == 3) {
                    $scope.GET_INVOICES_ADMIN(1);
                }
            }
        });

    };

    $scope.CLEAR_MATCHING_Fn = function (CLICK_FLAG) {
        var ALL_AND_ACTION = "";
        var ITEM_LIST = [];
        if (CLICK_FLAG == 1) {
            ALL_AND_ACTION = $scope.CreditNotesViewSearch.REQUEST_DETAILS;
            ITEM_LIST = $scope.ACTION_ITEM_LIST;
        }
        else if (CLICK_FLAG == 2) {
            ALL_AND_ACTION = $scope.CreditNotesViewSearch.ALL_REQUEST_DETAILS;
            ITEM_LIST = $scope.ALL_ITEM_LIST;
        }

        if (confirm('Are you sure you want to Delete?')) {
            var ModelObj = new Object();
            $('#Edit_Matching').modal('hide');
            ModelObj.INVOICE_HEADER_ID = ALL_AND_ACTION.INVOICE_HEADER_ID;
            ModelObj.USER_ID = parseInt($cookies.get("USERID"));
            ModelObj.INVOICE_TO_PO_MAPPING = [];
            angular.forEach($scope.INVOICE_PO_MAPPING, function (POLine) {
                var ReadOnlyApproval = new Object();
                ReadOnlyApproval.TABLE_ID = POLine.TABLE_ID == undefined || POLine.TABLE_ID == null ? 0 : POLine.TABLE_ID;
                ReadOnlyApproval.INVOICE_LINE_ID = POLine.INVOICE_LINE_ID;
                ReadOnlyApproval.PO_HEADER_ID = POLine.PO_HEADER_ID;
                ReadOnlyApproval.PO_LINE_ID = POLine.PO_LINE_ID;
                ReadOnlyApproval.MAPPED_QTY = POLine.MAPPED_QTY == undefined || POLine.MAPPED_QTY == null ? 0 : parseFloat(POLine.MAPPED_QTY).toFixed(5);// for say after some discussion 
                ReadOnlyApproval.MAPPED_AMOUNT = POLine.MAPPED_AMOUNT == undefined || POLine.MAPPED_AMOUNT == null ? 0 : parseFloat(POLine.MAPPED_AMOUNT).toFixed(5);
                ReadOnlyApproval.DELETE_FLAG = 1;
                ModelObj.INVOICE_TO_PO_MAPPING.push(ReadOnlyApproval);
            })
            ///GET_INVOICE_PO_MAPPING last two param
            ModelObj.TYPE = 1;// --1 FOR INVOICE AND 2 FOR PO
            ModelObj.REFERENCE_ID = ALL_AND_ACTION.INVOICE_HEADER_ID;
            ModelObj.PROJECT_MASTER_ID = ALL_AND_ACTION.PROJECT_MASTER_ID;
            PrcCommMethods.P2P_API(ModelObj, 'INS_UPD_INVOICE_PO_MAPPING', 'PO').then(function (data) {
                if (data.data != undefined && data.data == null) {
                    $scope.$parent.ShowAlert('Error', $scope.$parent.SOMETHINGWENTWRONG, 5000);
                }
                if (data.data != undefined && data.data.Table.length == 0) {
                    $scope.$parent.ShowAlert('Success', 'Deleted successfully', 5000);
                    $scope.MAPPED_LIST = [];
                    $scope.MATCH_DIV_SHOW = false;
                }
            });
        }
    }

    $scope.INS_UPD_INVOICES = function (INVOICE_SYNC_LINE) {
        if (confirm('Are you sure you want to sync GL Account?')) {
            var ptopobj = new Object();
            ptopobj.INVOICE_HEADER_ID = $scope.CreditNotesViewSearch.REQUEST_DETAILS.INVOICE_HEADER_ID;
            ptopobj.INVOICE_NUMBER = $scope.CreditNotesViewSearch.REQUEST_DETAILS.INVOICE_NUMBER;
            ptopobj.REFERENCE = $scope.CreditNotesViewSearch.REQUEST_DETAILS.REFERENCE;
            ptopobj.INVOICE_TYPE_ID = $scope.CreditNotesViewSearch.REQUEST_DETAILS.INVOICE_TYPE_ID;
            ptopobj.CONTACT_ID = $scope.CreditNotesViewSearch.REQUEST_DETAILS.CONTACT_ID;
            ptopobj.INVOICE_DATE = $scope.CreditNotesViewSearch.REQUEST_DETAILS.INVOICE_DATE;
            ptopobj.DUE_DATE = $scope.CreditNotesViewSearch.REQUEST_DETAILS.DUE_DATE;
            ptopobj.TAX_TYPE = $scope.CreditNotesViewSearch.REQUEST_DETAILS.TAX_TYPE;
            ptopobj.NET_AMOUNT = parseFloat($scope.CreditNotesViewSearch.REQUEST_DETAILS.NET_AMOUNT).toFixed(5); //NET;
            ptopobj.TAX_AMOUNT = parseFloat($scope.CreditNotesViewSearch.REQUEST_DETAILS.TAX_AMOUNT).toFixed(5);//TAX;
            ptopobj.TOTAL_AMOUNT = parseFloat($scope.CreditNotesViewSearch.REQUEST_DETAILS.TOTAL_AMOUNT).toFixed(5);//NET+TAX;
            ptopobj.TOTAL_DISCOUNT = parseFloat($scope.CreditNotesViewSearch.REQUEST_DETAILS.TOTAL_DISCOUNT).toFixed(5);//NET+TAX;
            ptopobj.INVOICE_CURRENCY_ID = $scope.CreditNotesViewSearch.REQUEST_DETAILS.CURRENCY_ID;
            ptopobj.BASE_CURRENCY_ID = $scope.CreditNotesViewSearch.REQUEST_DETAILS.BASE_CURRENCY_ID;
            if ($scope.CreditNotesViewSearch.REQUEST_DETAILS.CURRENCY_ID != $scope.CreditNotesViewSearch.REQUEST_DETAILS.BASE_CURRENCY_ID) { ptopobj.BASE_TO_INVOICE_CONVERSION_RATE = $scope.CreditNotesViewSearch.REQUEST_DETAILS.BASE_TO_INVOICE_CONVERSION_RATE; }
            else { ptopobj.BASE_TO_INVOICE_CONVERSION_RATE = 1; }
            ptopobj.XERO_BRANDING_THEME_ID = $scope.CreditNotesViewSearch.REQUEST_DETAILS.XERO_BRANDING_THEME_ID == undefined ? null : $scope.CreditNotesViewSearch.REQUEST_DETAILS.XERO_BRANDING_THEME_ID;
            ptopobj.XERO_INVOICE_ID = $scope.CreditNotesViewSearch.REQUEST_DETAILS.XERO_INVOICE_ID;
            ptopobj.IS_DRAFT = 0;
            ptopobj.UPLOAD_IDS = "";
            angular.forEach($scope.CreditNotesViewSearch.REQUEST_DETAILS.UploadedFiles, function (x) {
                if (ptopobj.UPLOAD_IDS == "") { ptopobj.UPLOAD_IDS = x.ID; }
                else { ptopobj.UPLOAD_IDS = ptopobj.UPLOAD_IDS + "," + x.ID; }
            });
            ptopobj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            ptopobj.BRANCH_ID = $scope.CreditNotesViewSearch.REQUEST_DETAILS.BRANCH_ID;
            ptopobj.USER_ID = parseInt($cookies.get("USERID"));
            ptopobj.INTEGRATION_SYSTEM_ID = null;
            ptopobj.PROJECT_MASTER_ID = $scope.CreditNotesViewSearch.REQUEST_DETAILS.PROJECT_MASTER_ID;
            ptopobj.INVOICE_LINES_TYPE = [];
            ptopobj.INVOICE_LINES_CUSTOM_FIELDS_TYPE = [];
            ptopobj.RESET_APPROVAL_CHAIN = 1;  // 1 for reset and 0 for not reset
            var InINVOICEcount = 0;
            angular.forEach($scope.ACTION_ITEM_LIST, function (LINE) {
                var readonlyobj = new Object()
                readonlyobj.INVOICE_LINE_ID = LINE.INVOICE_LINE_ID == undefined || LINE.INVOICE_LINE_ID == "" || LINE.INVOICE_LINE_ID == null ? 0 : parseInt(LINE.INVOICE_LINE_ID);
                readonlyobj.ITEM_NAME = LINE.ITEM_NAME;
                readonlyobj.DESCRIPTION = LINE.DESCRIPTION;
                readonlyobj.LINE_NO = LINE.LINE_NO;
                readonlyobj.QUANTITY = (LINE.QUANTITY == undefined || LINE.QUANTITY == null || LINE.QUANTITY == '') ? null : parseFloat(LINE.QUANTITY).toFixed(5);
                readonlyobj.UOM_NAME = LINE.UOM_NAME == undefined || LINE.UOM_NAME == null || LINE.UOM_NAME == '' ? null : LINE.UOM_NAME;
                readonlyobj.UNIT_PRICE = (LINE.UNIT_PRICE == undefined || LINE.UNIT_PRICE == null || LINE.UNIT_PRICE == '') ? null : parseFloat(LINE.UNIT_PRICE).toFixed(5);
                readonlyobj.ACCOUNT_ID = LINE.ACCOUNT_ID;
                readonlyobj.ACCOUNT_DETAILS = LINE.ACCOUNT_DETAILS;
                if (INVOICE_SYNC_LINE.INVOICE_LINE_ID == LINE.INVOICE_LINE_ID) {
                    readonlyobj.ACCOUNT_ID = INVOICE_SYNC_LINE.MATCHES[0].ACCOUNT_ID;
                    readonlyobj.ACCOUNT_DETAILS = INVOICE_SYNC_LINE.MATCHES[0].ACCOUNT_DETAILS;

                    LINE.ACCOUNT_ID = readonlyobj.ACCOUNT_ID;
                    LINE.ACCOUNT_DETAILS = readonlyobj.ACCOUNT_DETAILS;
                    LINE.ACCOUNT_MATCH = true;
                }
                readonlyobj.TAX_RATE_ID = LINE.TAX_RATE_ID == undefined ? null : LINE.TAX_RATE_ID;
                readonlyobj.TAX_RATE = LINE.TAX_RATE == undefined ? null : LINE.TAX_RATE;
                readonlyobj.TAX_RATE_DETAILS = LINE.TAX_RATE_DETAILS == undefined ? null : LINE.TAX_RATE_DETAILS;
                readonlyobj.TAX_AMOUNT = parseFloat(LINE.TAX_AMOUNT).toFixed(5);
                readonlyobj.LINE_AMOUNT = parseFloat(LINE.LINE_AMOUNT).toFixed(5);
                readonlyobj.DISCOUNT_PERCENT = (LINE.DISCOUNT_PERCENT == undefined || LINE.DISCOUNT_PERCENT == null || LINE.DISCOUNT_PERCENT == '') ? null : parseFloat(LINE.DISCOUNT_PERCENT);
                readonlyobj.DISCOUNT_AOUNT = 0/// parseFloat(LINE.DISCOUNT_AMOUNT).toFixed(5);
                readonlyobj.DELETE_FLAG = 0;
                readonlyobj.XERO_INVOICE_LINE_ITEM_ID = LINE.XERO_INVOICE_LINE_ITEM_ID == undefined || LINE.XERO_INVOICE_LINE_ITEM_ID == "" ? null : LINE.XERO_INVOICE_LINE_ITEM_ID;
                if (LINE.SELECTED_OPTION_LIST_MASTER != undefined && LINE.SELECTED_OPTION_LIST_MASTER.length > 0 && InINVOICEcount == 0) {
                    angular.forEach(LINE.SELECTED_OPTION_LIST_MASTER, function (TR) {
                        var PO_LINE_CUST_FLD = new Object();
                        PO_LINE_CUST_FLD.PO_LINE_NO = LINE.LINE_NO;
                        PO_LINE_CUST_FLD.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID = TR.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID == undefined ? null : TR.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID;
                        PO_LINE_CUST_FLD.APPROVAL_CHAIN_CUSTOM_FIELD_OPTIONS_MASTER_ID = TR.SELECTED_CATEGORY_OPTION == undefined ? null : TR.SELECTED_CATEGORY_OPTION == undefined ? null : TR.SELECTED_CATEGORY_OPTION.APPROVAL_CHAIN_CUSTOM_FIELD_OPTIONS_MASTER_ID;
                        ptopobj.INVOICE_LINES_CUSTOM_FIELDS_TYPE.push(PO_LINE_CUST_FLD);
                    });
                } else {
                    if (InINVOICEcount == 0) {
                        var PO_LINE_CUST_FLD = new Object();
                        PO_LINE_CUST_FLD.PO_LINE_NO = null;
                        PO_LINE_CUST_FLD.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID = null;
                        PO_LINE_CUST_FLD.APPROVAL_CHAIN_CUSTOM_FIELD_OPTIONS_MASTER_ID = null;
                        ptopobj.INVOICE_LINES_CUSTOM_FIELDS_TYPE.push(PO_LINE_CUST_FLD);
                    }
                    InINVOICEcount = 1;
                }
                ptopobj.INVOICE_LINES_TYPE.push(readonlyobj);
            });
            ptopobj.LINE_COUNT = angular.copy(ptopobj.INVOICE_LINES_TYPE.length);
            PrcCommMethods.P2P_API(ptopobj, 'INS_UPD_INVOICES', 'PO').then(function (data) {
                if (data.data == 1) {
                    $scope.$parent.ShowAlert("Success", "GL Account Updated Successfully ", 3000);
                    $('#POP_SYNC_GL_ACCOUNT').modal('hide');
                }
                else if (data.data == 0) {
                    $scope.$parent.$parent.ShowAlert("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                }
            });
        }
    };
    $scope.INS_UPD_INVOICE_PO_MAPPING = function (FLAG) {
        var ALL_AND_ACTION = "";
        var ITEM_LIST = [];
        if (FLAG == 1) {
            ALL_AND_ACTION = $scope.CreditNotesViewSearch.REQUEST_DETAILS;
            ITEM_LIST = $scope.ACTION_ITEM_LIST;
        }
        else if (FLAG == 2) {
            ALL_AND_ACTION = $scope.CreditNotesViewSearch.ALL_REQUEST_DETAILS;
            ITEM_LIST = $scope.ALL_ITEM_LIST;
        }
        var ModelObj = new Object();
        ModelObj.INVOICE_TO_PO_MAPPING = [];
        angular.forEach(ITEM_LIST, function (INVOICE) {
            angular.forEach(INVOICE.MATCHES, function (PO_LINE) {
                var ReadOnlyApproval = new Object();
                ReadOnlyApproval.TABLE_ID = PO_LINE.TABLE_ID == undefined || PO_LINE.TABLE_ID == null ? 0 : PO_LINE.TABLE_ID;
                ReadOnlyApproval.INVOICE_LINE_ID = INVOICE.INVOICE_LINE_ID;
                ReadOnlyApproval.PO_HEADER_ID = PO_LINE.PO_HEADER_ID;
                ReadOnlyApproval.PO_LINE_ID = PO_LINE.PO_LINE_ID;
                ReadOnlyApproval.MAPPED_QTY = PO_LINE.USED_QTY == undefined || PO_LINE.USED_QTY == null ? 0 : parseFloat(PO_LINE.USED_QTY).toFixed(5); // for say after some discussion 
                ReadOnlyApproval.MAPPED_AMOUNT = PO_LINE.USED_AMOUNT == undefined || PO_LINE.USED_AMOUNT == null ? 0 : parseFloat(PO_LINE.USED_AMOUNT).toFixed(5);
                ReadOnlyApproval.DELETE_FLAG = 0;
                ModelObj.INVOICE_TO_PO_MAPPING.push(ReadOnlyApproval);
            });
        });
        if (ModelObj.INVOICE_TO_PO_MAPPING.length > 0) {
            if (confirm('Are you sure you want to proceed ?')) {
                var ModelObj = new Object();
                $('#Edit_Matching').modal('hide');
                ModelObj.INVOICE_HEADER_ID = ALL_AND_ACTION.INVOICE_HEADER_ID;
                ModelObj.USER_ID = parseInt($cookies.get("USERID"));
                ModelObj.INVOICE_TO_PO_MAPPING = [];
                ///GET_INVOICE_PO_MAPPING last two param
                ModelObj.TYPE = 1;// --1 FOR INVOICE AND 2 FOR PO
                ModelObj.REFERENCE_ID = ALL_AND_ACTION.INVOICE_HEADER_ID;
                ModelObj.PROJECT_MASTER_ID = ALL_AND_ACTION.PROJECT_MASTER_ID;
                angular.forEach(ITEM_LIST, function (INVOICE) {
                    angular.forEach(INVOICE.MATCHES, function (PO_LINE) {
                        var ReadOnlyApproval = new Object();
                        ReadOnlyApproval.TABLE_ID = PO_LINE.TABLE_ID == undefined || PO_LINE.TABLE_ID == null ? 0 : PO_LINE.TABLE_ID;
                        ReadOnlyApproval.INVOICE_LINE_ID = INVOICE.INVOICE_LINE_ID;
                        ReadOnlyApproval.PO_HEADER_ID = PO_LINE.PO_HEADER_ID;
                        ReadOnlyApproval.PO_LINE_ID = PO_LINE.PO_LINE_ID;
                        ReadOnlyApproval.MAPPED_QTY = PO_LINE.USED_QTY == undefined || PO_LINE.USED_QTY == null ? 0 : parseFloat(PO_LINE.USED_QTY).toFixed(5); // for say after some discussion 
                        ReadOnlyApproval.MAPPED_AMOUNT = PO_LINE.USED_AMOUNT == undefined || PO_LINE.USED_AMOUNT == null ? 0 : parseFloat(PO_LINE.USED_AMOUNT).toFixed(5);
                        ReadOnlyApproval.DELETE_FLAG = 0;
                        ModelObj.INVOICE_TO_PO_MAPPING.push(ReadOnlyApproval);
                    });
                });
                PrcCommMethods.P2P_API(ModelObj, 'INS_UPD_INVOICE_PO_MAPPING', 'PO').then(function (data) {
                    $('#Edit_Matching').modal('hide');
                    if (data.data != undefined && data.data == null) {
                        $scope.$parent.ShowAlert('Error', $scope.$parent.SOMETHINGWENTWRONG, 5000);
                    }
                    if (data.data != undefined && data.data.Table.length > 0) {
                        $scope.$parent.ShowAlert('Success', 'Your match saved successfully', 5000);
                        $scope.INVOICE_PO_MAPPING = data.data.Table;
                        $scope.MAPPED_LIST = [];
                        angular.forEach(ITEM_LIST, function (INVOICE_LINE) {
                            $scope.InitiateInvoice(INVOICE_LINE);
                        });
                        //$scope.GET_INVOICE_PO_MAPPING($scope.SELECTED_REQ, 1);
                    }

                });
            }
        }
        else {
            $scope.$parent.ShowAlert('Error', "Please match at least one line.", 5000);
        }
    }
    $scope.DELETE_INS_UPD_INVOICE_PO_MAPPING = function (INVOICE_LINE, FLAG_BY_PASS, POLine, CLICK_FLAG, index) {
        var ALL_AND_ACTION = "";
        var ITEM_LIST = [];
        if (CLICK_FLAG == 1) {
            ALL_AND_ACTION = $scope.CreditNotesViewSearch.REQUEST_DETAILS;
            ITEM_LIST = $scope.ACTION_ITEM_LIST;
        }
        else if (CLICK_FLAG == 2) {
            ALL_AND_ACTION = $scope.CreditNotesViewSearch.ALL_REQUEST_DETAILS;
            ITEM_LIST = $scope.ALL_ITEM_LIST;
        }

        if (FLAG_BY_PASS == 1 || FLAG_BY_PASS != 1 && confirm('Are you sure you want to Delete ?')) {
            var ModelObj = new Object();
            $('#Edit_Matching').modal('hide');
            ModelObj.INVOICE_HEADER_ID = ALL_AND_ACTION.INVOICE_HEADER_ID;
            ModelObj.USER_ID = parseInt($cookies.get("USERID"));
            ModelObj.INVOICE_TO_PO_MAPPING = [];
            var ReadOnlyApproval = new Object();
            ReadOnlyApproval.TABLE_ID = POLine.TABLE_ID == undefined || POLine.TABLE_ID == null ? 0 : POLine.TABLE_ID;
            ReadOnlyApproval.INVOICE_LINE_ID = POLine.INVOICE_LINE_ID;
            ReadOnlyApproval.PO_HEADER_ID = POLine.PO_HEADER_ID;
            ReadOnlyApproval.PO_LINE_ID = POLine.PO_LINE_ID;
            ReadOnlyApproval.MAPPED_QTY = POLine.MAPPED_QTY == undefined || POLine.MAPPED_QTY == null ? 0 : parseFloat(POLine.MAPPED_QTY).toFixed(5);// for say after some discussion 
            ReadOnlyApproval.MAPPED_AMOUNT = POLine.MAPPED_AMOUNT == undefined || POLine.MAPPED_AMOUNT == null ? 0 : parseFloat(POLine.MAPPED_AMOUNT).toFixed(5);
            ReadOnlyApproval.DELETE_FLAG = 1;
            ModelObj.INVOICE_TO_PO_MAPPING.push(ReadOnlyApproval);
            ///GET_INVOICE_PO_MAPPING last two param
            ModelObj.TYPE = 1;// --1 FOR INVOICE AND 2 FOR PO
            ModelObj.REFERENCE_ID = ALL_AND_ACTION.INVOICE_HEADER_ID;
            PrcCommMethods.P2P_API(ModelObj, 'INS_UPD_INVOICE_PO_MAPPING', 'PO').then(function (data) {
                if (data.data != undefined && data.data == null) {
                    $scope.$parent.ShowAlert('Error', $scope.$parent.SOMETHINGWENTWRONG, 5000);
                }
                if (data.data != undefined && data.data.Table.length > 0) {
                    if (FLAG_BY_PASS != 1) {
                        $scope.$parent.ShowAlert('Success', 'Deleted successfully', 5000);
                        POLine.TABLE_ID = 0;
                        $scope.UNDO_MATCH_FY(INVOICE_LINE, POLine, CLICK_FLAG, index);
                    }
                    $scope.GET_PO_LINES_FOR_INVOICE_PO_MAPPING(POLine, 1, 2, 0)

                } else {
                    POLine.TABLE_ID = 0;
                    $scope.UNDO_MATCH_FY(INVOICE_LINE, POLine, CLICK_FLAG, index);

                    if ($scope.PO_LINES_FOR_INVOICE_PO_MAPPING.length == 0) {

                        $scope.INVOICE_PO_MAPPING = [];
                        $scope.GET_PO_LINES_FOR_INVOICE_PO_MAPPING(POLine, 1, 2, 0)
                    }
                }
            });
        }
    }
    $scope.INS_UPD_PROJECT_IN_INVOICE = function () {
        $scope.project_form.submitted = true;
        if ($scope.project_form.$valid) {
            if (confirm('Are you sure you want to update ?')) {
                var ModelObj = new Object();
                if ($scope.TAB_FLAG == 1) {
                    ModelObj.INVOICE_HEADER_ID = $scope.CreditNotesViewSearch.REQUEST_DETAILS.INVOICE_HEADER_ID;
                }
                else if ($scope.TAB_FLAG == 3) {
                    ModelObj.INVOICE_HEADER_ID = $scope.CreditNotesViewSearch.ALL_REQUEST_DETAILS.INVOICE_HEADER_ID;
                }
                ModelObj.PROJECT_MASTER_ID = $scope.CreditNotesViewSearch.PROJECT_MASTER_ID;
                PrcCommMethods.P2P_API(ModelObj, 'INS_UPD_PROJECT_IN_INVOICE', 'PO').then(function (data) {
                    if (data.data != undefined && data.data == 0) { $scope.$parent.ShowAlert('Error', $scope.$parent.SOMETHINGWENTWRONG, 5000); }
                    if (data.data != undefined && data.data == 1) {
                        $('#PROJECT_POP').modal('hide');
                        $scope.$parent.ShowAlert('Success', 'Your update saved successfully', 5000);
                        if ($scope.TAB_FLAG == 1) {
                            $scope.GET_INVOICE_BY_ID($scope.CreditNotesViewSearch.REQUEST_DETAILS, 1);
                            $scope.GET_INVOICE_PO_MAPPING($scope.CreditNotesViewSearch.REQUEST_DETAILS, 1);
                        }
                        if ($scope.TAB_FLAG == 3) {
                            $scope.GET_INVOICE_BY_ID($scope.CreditNotesViewSearch.ALL_REQUEST_DETAILS, 3);

                            $scope.GET_INVOICE_PO_MAPPING($scope.CreditNotesViewSearch.ALL_REQUEST_DETAILS, 3);
                        }

                    }
                });
            }
        }
    }
    $scope.UPD_USE_INVOICE_GL_FLAG = function () {
        var INVOICE_HEADER_ID = 0;
        var USE_INVOICE_GL = 0;
        if ($scope.TAB_FLAG == 1) {
            INVOICE_HEADER_ID = $scope.CreditNotesViewSearch.REQUEST_DETAILS.INVOICE_HEADER_ID;
            USE_INVOICE_GL = $scope.CreditNotesViewSearch.REQUEST_DETAILS.USE_INVOICE_GL ? 1 : 0;
        }
        else {
            INVOICE_HEADER_ID = $scope.CreditNotesViewSearch.ALL_REQUEST_DETAILS.INVOICE_HEADER_ID;
            USE_INVOICE_GL = $scope.CreditNotesViewSearch.ALL_REQUEST_DETAILS.USE_INVOICE_GL ? 1 : 0;
        }
        ModelObj = new Object();
        ModelObj.INVOICE_HEADER_ID = INVOICE_HEADER_ID;
        ModelObj.USE_INVOICE_GL = USE_INVOICE_GL;
        PrcCommMethods.P2P_API(ModelObj, 'UPD_USE_INVOICE_GL_FLAG', 'PO').then(function (data) {
            if (data.data == 1) {
            }
            else if (data.data == 0) {

                $scope.$parent.ShowAlert('Error', $scope.$parent.SOMETHINGWENTWRONG, 5000);
            }
        });
    }

    $scope.CLICK_COMMENT = function (COMMENT_DTLS) {
        COMMENT_DTLS.NAME = COMMENT_DTLS.APPROVER_NAME;
        $scope.COMMENT_DTLS = COMMENT_DTLS;
    };
    $scope.SHOW_HIDE_BUDGET = function (REQ_Search) {
        REQ_Search.HIDE_SHOW = !REQ_Search.HIDE_SHOW;
    }
    $scope.CLICK_INSERT_AMT = function (LINE) {
        LINE.ALLOCATED_AMOUNT = angular.copy(LINE.PO_AMOUNT);
    }
    $scope.Fn_ADJUSTMENT_BUDGET = function (_m, _pram_item, index, itemlast) {
        if (_m.FLAG == 1 && itemlast == true) {
            var x = 0;
            if (x == 0) {
                var intervalID = $interval(function () {
                    $scope.REM_AMOUNT_LEFT = 0;
                    angular.forEach($scope.MONTH_LIST[$scope.MONTH_LIST.length - 1].ITEM_LIST, function (_item) {
                        if ((parseFloat(_item.REMAINING_AMOUNT).toFixed(2)) != 0 && 0.05 > parseFloat(parseFloat(_item.REMAINING_AMOUNT).toFixed(2)) && -0.05 < parseFloat(parseFloat(_item.REMAINING_AMOUNT).toFixed(2))) {
                            _item.BUDGET = parseFloat(parseFloat(parseFloat(_item.BUDGET).toFixed(2)) + parseFloat(parseFloat(_item.REMAINING_AMOUNT).toFixed(2))).toFixed(2);
                            _item.TOTAL_BUDGET = parseFloat(parseFloat(parseFloat(_item.TOTAL_BUDGET).toFixed(2)) + parseFloat(parseFloat(_item.REMAINING_AMOUNT).toFixed(2))).toFixed(2);
                        }
                    });
                    if (++x > 1) {
                        $interval.cancel(intervalID);
                        x = 0;
                    }
                }, 1000);
            }
        }
    };
    $scope.UPD_P2P_APPROVED_INVOICES_FOR_XERO_OUTBUND_INTEGRATION = function () {
        ModelObj = new Object();
        ModelObj.INVOICE_HEADER_ID = $scope.CreditNotesViewSearch.OUT_REQUEST_DETAILS.INVOICE_HEADER_ID;
        ModelObj.POSTING_STATUS = 0;
        ModelObj.POSTING_ERROR = 'WEB'
        PrcCommMethods.P2P_API(ModelObj, 'UPD_P2P_APPROVED_INVOICES_FOR_XERO_OUTBUND_INTEGRATION', 'PO').then(function (data) {
            if (data.data == 1) {
                $scope.$parent.ShowAlert('Success', 'Send to Xero Successfully', 5000);
            }
            else if (data.data == 0) {
                $scope.$parent.ShowAlert('Error', $scope.$parent.SOMETHINGWENTWRONG, 5000);
            };
        });
    }

    $scope.AP_ACTION_CLICK = function (SELECTED_REQ, SYNC_FLAG) {
        $scope.BUDGET_TEXT_VALIDATION = "Fetching Budget...";
        $scope.SELECTED_REQ = {};
        $scope.MAPPED_LIST = [];

        $scope.PO_SPLIT_DATES_BY_INVOICE_LIST = [];
        $scope.MONTH_LIST = [];
        $scope.remaningitemdetail = [];
        $scope.REM_AMOUNT_LEFT = 0;

        $scope.GRN_ATTACHMENT = { IS_MULTI_FILE_UPLOAD_ALLOW: true, };
        $scope.PO_ATTACHMENT_IN_INVOICE = { IS_MULTI_FILE_UPLOAD_ALLOW: true, };
        $scope.OTHER_ATTACHMENT = { IS_MULTI_FILE_UPLOAD_ALLOW: true, };

        $scope.CreditNotesViewSearch.SPLIT_TYPE = null;
        $scope.MATCHED_PO_MAPPING_LIST = [];
        $scope.MAPPED_LIST = [];
        $scope.INVOICE_PO_MAPPING = [];

        $scope.PO_LINES_FOR_INVOICE_PO_MAPPING = [];


        $scope.P2P_BUDGET_LIST = [];
        $scope.P2P_BUDGET_MASTER_LIST = [];
        $scope.ACCOUNT_ITEMDETAIL = [];
        $scope.SELECTED_REQ = SELECTED_REQ;

        $scope.MATCH_DIV_SHOW = false;
        $scope.PO_MAPPED_LOAD = 1;

        $scope.GET_INVOICE_PO_MAPPING(SELECTED_REQ, 1)
        $scope.$parent.GET_UPLOADS($scope.PO_ATTACHMENT_IN_INVOICE, 37, SELECTED_REQ.INVOICE_HEADER_ID);
        $scope.$parent.GET_UPLOADS($scope.GRN_ATTACHMENT, 38, SELECTED_REQ.INVOICE_HEADER_ID);
        $scope.$parent.GET_UPLOADS($scope.OTHER_ATTACHMENT, 39, SELECTED_REQ.INVOICE_HEADER_ID);
        $scope.$parent.GET_SCROLL_TOP();


    }
    $scope.AP_PROCESSED_CLICK = function (PROCESS_REQUEST) {
        $scope.CreditNotesViewSearch.UploadedFiles = [];
        $scope.BUDGET_TEXT_VALIDATION = "Fetching Budget...";
        $scope.APPROVAL_HEADERS_CHAIN_LIST = [];
        $scope.P2P_BUDGET_LIST = [];
        $scope.MATCHED_PO_MAPPING_LIST = [];
        $scope.INVOICE_PO_MAPPING = [];
        $scope.MAPPED_LIST = [];
        $scope.PO_MAPPED_LOAD = 1;
        $scope.APPROVAL_HEADERS_CHAIN_LIST = [];
        $scope.P2P_PROCESS_BUDGET_MASTER_LIST = [];
        $scope.INVOICE_PROCESS_SPLIT_LIST = [];
        $scope.INVOICE_SPLIT_LIST = [];
        $scope.MONTH_PROCESS_ALL_LIST = [];
        //$scope.remaningitemdetail = [];
        $scope.SELECTED_REQ_PROC = PROCESS_REQUEST;
        $scope.remaningprocessitemdetail = [];
        $scope.GET_INVOICE_PO_MAPPING(PROCESS_REQUEST, 2);
        $scope.GET_APPROVAL_HEADERS_CHAIN(PROCESS_REQUEST, 2);
        $scope.$parent.GET_SCROLL_TOP();
    }
    $scope.AP_ALL_ADMIN_CLICK = function (SELECTED_REQ_ALL, SYNC_FLAG) {
        $scope.BUDGET_TEXT_VALIDATION = "Fetching Budget...";
        $scope.MATCH_DIV_SHOW = false;
        $scope.PO_LINES_FOR_INVOICE_PO_MAPPING = [];
        $scope.P2P_BUDGET_LIST = [];
        $scope.P2P_ALL_BUDGET_MASTER_LIST = [];
        $scope.APPROVAL_HEADERS_CHAIN_LIST = [];
        $scope.MONTH_PROCESS_ALL_LIST = [];
        $scope.INVOICE_PROCESS_SPLIT_LIST = [];
        $scope.INVOICE_SPLIT_LIST = [];
        //$scope.remaningitemdetail = [];
        $scope.remaningprocessitemdetail = [];

        $scope.SELECTED_REQ_ALL = {};
        $scope.SELECTED_REQ_ALL = SELECTED_REQ_ALL;
        $scope.MAPPED_LIST = [];
        $scope.remaningitemdetail = [];
        $scope.PO_SPLIT_DATES_BY_INVOICE_LIST = [];
        $scope.MONTH_LIST = [];
        $scope.REM_AMOUNT_LEFT = 0;
        $scope.CreditNotesViewSearch.SPLIT_TYPE = null;

        $scope.GET_APPROVAL_HEADERS_CHAIN(SELECTED_REQ_ALL, 3);
        //  $scope.GET_APPROVAL_HEADERS_CHAIN(SELECTED_REQ_ALL, 1); //FLAG 1 Mean to check Aprove and Reject Btn

        $scope.GET_INVOICE_PO_MAPPING(SELECTED_REQ_ALL, 3);
        $scope.$parent.GET_SCROLL_TOP();
    }
    $scope.AP_OUTBOUND_CLICK = function (OUT_BOUND_LINE) {
        $scope.BUDGET_TEXT_VALIDATION = "Fetching Budget...";
        //$scope.MATCH_DIV_SHOW = false;
        //$scope.PO_LINES_FOR_INVOICE_PO_MAPPING = [];
        //$scope.P2P_BUDGET_LIST = [];
        //$scope.P2P_ALL_BUDGET_MASTER_LIST = [];
        //$scope.APPROVAL_HEADERS_CHAIN_LIST = [];
        $scope.SELECTED_OUT_BOUND_LINE = {};
        $scope.SELECTED_OUT_BOUND_LINE = OUT_BOUND_LINE;
        $scope.GET_INVOICE_PO_MAPPING(OUT_BOUND_LINE, 4);
        $scope.$parent.GET_SCROLL_TOP()
    }
    $scope.TAB_CLICK_AP_FY = function (FLAG, INVOICE_DETAILS, LOAD_FLAG) {
        $scope.TAB_FLAG = FLAG;
        if (FLAG == 1) {
            INVOICE_DETAILS == undefined ? $scope.GET_INVOICES_ACTION(1, 4, false) : '';
            if (LOAD_FLAG == 1) {
                $scope.AP_ACTION_CLICK(INVOICE_DETAILS);
            }
        }
        else if (FLAG == 2) {
            $scope.GET_INVOICES_PROCESS(1);
        }
        else if (FLAG == 3) {
            INVOICE_DETAILS == undefined ? $scope.GET_INVOICES_ADMIN(1) : '';
            if (LOAD_FLAG == 1) {
                $scope.AP_ALL_ADMIN_CLICK(INVOICE_DETAILS);
            }
        }
        else if (FLAG == 4) {
            $scope.GET_PENDING_OUTBOUND_PROCESSING_INVOICES(1);
        }
        else if (FLAG == 9) {
            $scope.Invoice_childScope.PAGE_LOAD_INVOICE(undefined, 1);
        }
    }
    $scope.Fn_EDIT_INVOICE = function (FLAG) {
        if (FLAG == 1) {
            $scope.CreditNotesViewSearch.REQUEST_DETAILS.TAB_FLAG = 1;
            $scope.CreditNotesViewSearch.REQUEST_DETAILS.SELECTED_REQ = $scope.SELECTED_REQ;
            $scope.Invoice_childScope.PAGE_LOAD_INVOICE($scope.CreditNotesViewSearch.REQUEST_DETAILS, FLAG);
        }
        else if (FLAG == 3) {
            $scope.CreditNotesViewSearch.ALL_REQUEST_DETAILS.TAB_FLAG = 3;
            $scope.CreditNotesViewSearch.ALL_REQUEST_DETAILS.SELECTED_REQ_ALL = $scope.SELECTED_REQ_ALL;
            $scope.Invoice_childScope.PAGE_LOAD_INVOICE($scope.CreditNotesViewSearch.ALL_REQUEST_DETAILS, FLAG);
        }
        $scope.TAB_FLAG = 9;
    }
    $scope.TAB_CLICK_AP_FY(1);
    $scope.CLOSE_MAIN_PDF = function () {
        document.getElementById("PO_MAIN_PDF").style.zIndex = "1500";
        document.getElementById("PO_MAIN_PDF").style.width = "0%";
    }
    $scope.pdfMainUrl = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/149125/relativity.pdf';
    $scope.loadNewFile = function (url) {
        pdfDelegate
            .$getByHandle('my-pdf-container')
            .load(url);
    };
    $scope.PDF_MAIN_DOWNLOAD_FY = function (PO_HDR_ID, PO_NUMBER, DOWNLOAD_FLAG, DOWNLOADED_FLAG) {
        ModelObj = new Object();
        ModelObj.PO_HDR_ID = PO_HDR_ID;
        ModelObj.FILE_PATH = "/P2PFiles/PO/ENTITY_" + parseInt($cookies.get("ENTITY_ID")) + "/PO_" + PO_HDR_ID + "/" + PO_NUMBER + '.pdf';
        if (true || $scope.PO_Search.PO_DETAILS.PDF_GENERATED == undefined || $scope.PO_Search.PO_DETAILS.PDF_GENERATED == null || $scope.PO_Search.PO_DETAILS.PDF_GENERATED == "") {
            PrcCommMethods.P2P_API(ModelObj, 'UPD_PO_PDF_GENERATION_STATUS', 'PO').then(function (data) {
                if (DOWNLOAD_FLAG == 1) {
                    window.open(ModelObj.FILE_PATH);
                }
                else {
                    $scope.loadNewFile(ModelObj.FILE_PATH);
                    document.getElementById("PO_MAIN_PDF").style.zIndex = "1500";
                    document.getElementById("PO_MAIN_PDF").style.width = "35%";
                }
            });
        }
        else {
            if (DOWNLOAD_FLAG == 1) {
                window.open(ModelObj.FILE_PATH);
            }
            else {
                $scope.loadNewFile(ModelObj.FILE_PATH);
                document.getElementById("PO_MAIN_PDF").style.zIndex = "1500";
                document.getElementById("PO_MAIN_PDF").style.width = "35%";
            }
        };
    }
    $scope.GetIntegrationDetails(1);
    $scope.$parent.DateInputLoad();
    $scope.$parent.child_scope = $scope;
});
