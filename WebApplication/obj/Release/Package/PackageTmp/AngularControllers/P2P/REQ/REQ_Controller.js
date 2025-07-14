app.controller('REQController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $interval) {
    $(".modal-backdrop").remove();
    $scope.REQ_Search = {
        NAME: '',
        PAGE_NO: 1,
        PAGE_SIZE: 20,
        UPLOADE_TYPE_ID: 31,
        START_DATE: null,
        END_DATE: null,
        UploadedFiles: [],
        REQUEST_LINE: {},
        REQUISITION_TYPE: 2,
        TAX_TYPE: 1,
        CURRENCY_ID: parseInt($cookies.get("CURRENCY_ID")),
        CURRENT_DATE: new Date(),
        PO_DATE: $filter('date')(new Date()),
        IS_MULTI_FILE_UPLOAD_ALLOW: true,
        PROJECT_MASTER_ID: null,
        HIDE_SHOW: true,
        AUTO_EMAIL_TO_SUPPLIER: true,
        XERO_BRANDING_THEME_ID: null,
        BASE_TO_PO_CONVERSION_RATE: 1,
        COPY_BASE_TO_PO_CONVERSION_RATE: 1,
    };
    $scope.REQ_PROC_Search = {
        NAME: '',
        PAGE_NO: 1,
        PAGE_SIZE: 20,
        UPLOADE_TYPE_ID: 31,
        UploadedFiles: [],
        START_DATE: null,
        END_DATE: null,
        UploadedFiles: [],
        REQUEST_LINE: {},
        REQUISITION_TYPE: 2,
        TAX_TYPE: 1,
        HIDE_SHOW: true,
        XERO_BRANDING_THEME_ID: null,
    };
    $scope.Create_REQ_Search = {
        CURRENCY_ID: parseInt($cookies.get("CURRENCY_ID")),
        TAX_TYPE: 1,
        IS_MULTI_FILE_UPLOAD_ALLOW: true,
        IS_MULTI_FILE_UPLOAD_ALLOW: true,
        HIDE_SHOW: true,
        BASE_TO_PO_CONVERSION_RATE: 1,
        COPY_BASE_TO_PO_CONVERSION_RATE: 1,
        AUTO_EMAIL_TO_SUPPLIER: true,
        XERO_BRANDING_THEME_ID: null,
    }
    $scope.BLANK_ITEM = {
        ITEM_NAME: '',
        LINE_NO: '',
        DESCRIPTION: '',
        QUANTITY: '',
        UNIT_PRICE: '',
        DISCOUNT_PERCENT: '',
        DELIVERY_INSTRUCTIONS: '',
        ACCOUNT_DETAILS: null,
        ACCOUNT_NAME: null,
        TAX_RATE: '',
        TAX_ID: null,
        TAX_TYPE: '',
        TRACKING_CATEGORY_IDS: '',
        AMOUNT: '',
        REQUISITION_HEADER_ID: '',
        REFERENCE_ID: '',
        STATUS_ID: '',
        XERO_TRACKING_CATEGORIES: [],
    }
    $scope.DELIVERY_ADDRESS_SEARCH = {
        SUPPLIER_NAME: '',
    };

    //, { ID: 3, NAME: 'No Tax' }
    $scope.TAX_TYPE = [{ ID: 1, NAME: 'Tax Exclusive' }, { ID: 2, NAME: 'Tax Inclusive' }];
    $scope.CURRENCY_TYPE = [{ ID: 1, NAME: 'Tax Exclusive' }, { ID: 2, NAME: 'Tax Inclusive' }, { ID: 3, NAME: 'No Tax' }];
    $scope.RECEIVING_TYPE = [{ ID: 1, NAME: 'Quantity' }, { ID: 2, NAME: 'Amount' }]; //RECEIVING_TYPE_ID   1 FOR QTY WISE AND 2 FOR AMOUNT WISE
    $scope.SPLIT_TYPE = [{ ID: 1, NAME: '2' }, { ID: 2, NAME: '3' }, { ID: 3, NAME: '4' }, { ID: 4, NAME: '5' }, { ID: 5, NAME: '6' }, { ID: 6, NAME: '7' }, { ID: 7, NAME: '8' }, { ID: 8, NAME: '9' }, { ID: 9, NAME: '10' }, { ID: 10, NAME: '11' }, { ID: 11, NAME: '12' }, { ID: 12, NAME: '13' }, { ID: 13, NAME: '14' }, { ID: 14, NAME: '15' }];
    $scope.BLANK_TERM_CONT = { TABLE_ID: null, TANDC_MASTER_ID: null, TEXT: "", SORT_ORDER: null, DELETE_FLAG: 0 };
    $scope.BLANL_QUOTATION_LIST = { SUPPLIER_NAME: '', TABLE_ID: null, XERO_CONTACT_ID: null, TOTAL_AMOUNT: "", COMMENTS: null, UPLOADS_ID: null, DELETE_FLAG: null, UploadedFiles: [], SUPPLIER_ID: 0, IS_SELECTED_CONTACT: false };

    $scope.TAB_FLAG = 1;
    $scope.HIDE_SHOW = true;
    $scope.ITEM_LIST = []; $scope.DELETE_ITEM_LIST = [];
    $scope.TERMS_AND_CONDITIONS_MASTER_LIST = []; $scope.DELETE_TERMS_AND_CONDITIONS_MASTER_LIST = [];
    $scope.QUOTATION_LIST = []; $scope.DELETE_QUOTATION_LIST = [];
    $scope.CREATE_ITEM_LIST = []; $scope.DELETE_CREATE_ITEM_LIST = [];
    $scope.CREATE_TERMS_AND_CONDITIONS_MASTER_LIST = []; $scope.DELETE_CREATE_TERMS_AND_CONDITIONS_MASTER_LIST = [];
    $scope.CREATE_QUOTATION_LIST = []; $scope.DELETE_CREATE_QUOTATION_LIST = [];
    $scope.P2P_TERMS_CONDITIONS_LIST = []; $scope.PROJECT_MASTER_LIST = [];
    $scope.XERO_TRACKING_CATEGORIES = []; $scope.XERO_TRACKING_CATEGORIES_OPTIONS = [];
    $scope.SUPPLIER_LIST = []; $scope.XERO_ACCOUNT_CODES = [];
    $scope.PURCHASE_PROCESSED_LIST = []; $scope.CURRENCY_LIST = [];
    $scope.XERO_BRANDING_THEMES_LIST = []; $scope.P2P_BUDGET_MASTER_LIST = [];
    $scope.SELECTED_XERO_TRACKING_CATEGORIES_OPTIONS = []; $scope.SELECTED_PROCESSED_XERO_TRACKING_CATEGORIES_OPTIONS = [];
    $scope.SELECTED_CREATE_XERO_TRACKING_CATEGORIES_OPTIONS = [];
    $scope.P2P_ITEMS_LIST = []; $scope.PROC_P2P_ITEMS_LIST = [];
    $scope.CREATE_P2P_ITEMS_LIST = [];
    $scope.P2P_PROCESS_BUDGET_MASTER_LIST = [];
    $scope.ADD_MORE_QUOTATION_NAME = "Add More Quotation";
    $scope.ADD_MORE_TERMS_CONDITIONS_NAME = "Add More Terms & Conditions";
    $scope.ADD_MORE_ITEM_NAME = "Add a line";
    $scope.LIMIT_TO = 500;
    $scope.SHOW_REQUEST_DTLS = false;
    $scope.COMMENTS_LIMIT_TO = 500;
    $scope.CHANGE_FLAG = 0;
    $scope.REQ_PROC_Search.NOTE_FOR_APPROVERS_LIMIT_TO = 500;
    $scope.IntegrationDetails = new Object();
    $scope.IntegrationDetails.PageLoad = true;
    //$scope.IntegrationDetails.ShowSyncBtn = true;

    $scope.GET_PYMNT_SUPPLIER = function (REQUEST_LINE) { //Done
        var PaymentModelObj = new Object();
        PaymentModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PaymentModelObj.BRANCH_ID = REQUEST_LINE.BRANCH_ID;
        PaymentModelObj.PAGE_NO = 0;
        PaymentModelObj.PAGE_SIZE = 0;
        PaymentModelObj.SUPPLIER_NAME = null;
        PaymentModelObj.FLAG = 0;//=1, -- 1 SUPPLIER 2 CUSTOMER 0 ALL
        PaymentModelObj.APPROVAL_TYPE_ID = 3;// PO and 4 invoice create onlu
        PaymentModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.P2P_API(PaymentModelObj, 'GET_P2P_SUPPLIERS', 'PO').then(function (data) {
            if (data.data != undefined && data.data.Table.length > 0) {
                $scope.SUPPLIER_LIST = data.data.Table;
                $('#AddCustomScroll_SHD').find('.dropdown-menu').addClass('custom-scrollbar');
                $('#AddCustomScroll_CREATE').find('.dropdown-menu').addClass('custom-scrollbar');
            } else {
                $scope.SUPPLIER_LIST = [];
            }
        })
    }
    $scope.GET_XERO_TAXES = function (REQUEST_LINE, FLAG) {
        $scope.$parent.overlay_loadingNew = 'block';
        var CustmObj = new Object();
        CustmObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CustmObj.BRANCH_ID = REQUEST_LINE.BRANCH_ID;
        CustmObj.APPROVAL_TYPE_ID = 3;// PO and 4 invoice create onlu
        CustmObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.P2P_API(CustmObj, 'GET_P2P_TAXES', 'PO').then(function (data) {
            if (data.data.Table != undefined) {
                $scope.XERO_TAXES = data.data.Table;
                $scope.$parent.overlay_loadingNew = 'none';
            }
            else {
                $scope.XERO_TAXES = [];
                $scope.$parent.overlay_loadingNew = 'none';
            }
            $scope.GET_APPROVAL_CUSTOM_FIELD_OPTIONS_MASTER(REQUEST_LINE, FLAG);
        });
    };

    $scope.GET_XERO_ACCOUNT_CODES = function (REQUEST_LINE, FLAG, CHANGE_FLAG) {
        //$scope.$parent.overlay_loadingNew = 'block';
        var CusModelObj = new Object();
        CusModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CusModelObj.BRANCH_ID = REQUEST_LINE.BRANCH_ID;
        CusModelObj.APPROVAL_TYPE_ID = 3;// PO and 4 invoice create onlu
        CusModelObj.USER_ID = parseInt($cookies.get("USERID"));
        CusModelObj.PROJECT_MASTER_ID = REQUEST_LINE.PROJECT_MASTER_ID;
        CusModelObj.ADMIN_FLAG = 0;
        PrcCommMethods.P2P_API(CusModelObj, 'GET_P2P_ACCOUNT_CODES', 'PO').then(function (data) {
            if (data.data.Table != undefined) {
                $scope.XERO_ACCOUNT_CODES = data.data.Table;
                $scope.XERO_ACCOUNT_CODES = angular.copy($scope.XERO_ACCOUNT_CODES.filter(p => p.CODE != null && p.CODE != ''));
                if (REQUEST_LINE.PO_HDR_ID != null) {
                    $scope.ITEM_LIST_VALID(FLAG);
                }
            }
            else {
                $scope.XERO_ACCOUNT_CODES = [];
            }
            if (CHANGE_FLAG == undefined) {
                $scope.GET_XERO_TAXES(REQUEST_LINE, FLAG);
            }
            if (FLAG == 1) {
                $scope.P2P_BUDGET_MASTER_LIST = [];
                $scope.BUDGET_TEXT_VALIDATION = "Fetching Budget...";
                $scope.GET_P2P_BUDGET_BY_ACCOUNTS(FLAG, REQUEST_LINE, $scope.REQ_Search);
                //if (CHANGE_FLAG == "PROJECT") {
                //    $scope.P2P_BUDGET_MASTER_LIST = [];
                //    $scope.BUDGET_TEXT_VALIDATION = "Fetching Budget...";
                //    $scope.GET_P2P_BUDGET_BY_ACCOUNTS(FLAG, REQUEST_LINE, $scope.REQ_Search);
                //}
            }
            else if (FLAG == 3) {
                if (CHANGE_FLAG == "PROJECT") {
                    $scope.P2P_CREATE_BUDGET_MASTER_LIST = [];
                    $scope.BUDGET_TEXT_VALIDATION = "Fetching Budget...";
                    $scope.GET_P2P_BUDGET_BY_ACCOUNTS(FLAG, REQUEST_LINE, $scope.Create_REQ_Search);
                }
            }
        });
    };
    $scope.GET_XERO_BRANDING_THEMES = function (REQUEST_LINE, FLAG) {
        var ModelObj = new Object();
        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        ModelObj.BRANCH_ID = REQUEST_LINE.BRANCH_ID;
        ModelObj.APPROVAL_TYPE_ID = 3;// PO and 4 invoice create onlu
        ModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.P2P_API(ModelObj, 'GET_P2P_BRANDING_THEMES', 'PO').then(function (data) {
            if (data.data.Table != undefined) {
                $scope.XERO_BRANDING_THEMES_LIST = data.data.Table;
                if (data.data.Table.length > 0) {
                    if (FLAG == 1) {
                        $scope.REQ_Search.XERO_BRANDING_THEME_ID = data.data.Table[0].XERO_BRANDING_THEME_ID;
                    }
                    if (FLAG == 3) {
                        $scope.Create_REQ_Search.XERO_BRANDING_THEME_ID = data.data.Table[0].XERO_BRANDING_THEME_ID;
                    }
                }
            }
            else {
                $scope.XERO_BRANDING_THEMES_LIST = [];
            }
        });
    }
    $scope.GET_CURRENCY = function () {
        var CustmObj = new Object();
        PrcCommMethods.HR_API(CustmObj, 'GET_CURRENCY').then(function (data) {
            if (data.data.Table != undefined) {
                $scope.CURRENCY_LIST = angular.copy(data.data.Table);
                $scope.CREATE_CURRENCY_LIST = angular.copy(data.data.Table);
                var item = data.data.Table.filter(function (x) { return x.CURRENCY_ID == parseInt($cookies.get("CURRENCY_ID")) })
                if (item.length > 0) {
                    //$scope.REQ_Search.SELECT_CURRENCY = angular.copy(item[0]);
                    //$scope.REQ_Search.DEFAULT_CURRENCY = angular.copy(item[0]);
                    //$scope.Create_REQ_Search.CREATE_SELECT_CURRENCY = angular.copy(item[0]);
                    //$scope.Create_REQ_Search.CREATE_DEFAULT_CURRENCY = angular.copy(item[0]);

                    $scope.REQ_Search.PO_CURRENCY_ID = angular.copy(item[0].CURRENCY_ID);
                    $scope.REQ_Search.PO_CURRENCY_NAME = angular.copy(item[0].DISPLAY_TEXT);
                    $scope.REQ_Search.BASE_CURRENCY_ID = angular.copy(item[0].CURRENCY_ID);
                    $scope.REQ_Search.BASE_CURRENCY_NAME = angular.copy(item[0].DISPLAY_TEXT);

                    $scope.Create_REQ_Search.PO_CURRENCY_ID = angular.copy(item[0].CURRENCY_ID);
                    $scope.Create_REQ_Search.PO_CURRENCY_NAME = angular.copy(item[0].DISPLAY_TEXT);
                    $scope.Create_REQ_Search.BASE_CURRENCY_ID = angular.copy(item[0].CURRENCY_ID);
                    $scope.Create_REQ_Search.BASE_CURRENCY_NAME = angular.copy(item[0].DISPLAY_TEXT);
                }
            }
            else {
                $scope.CURRENCY_LIST = [];
            }
        });

    }
    $scope.GET_APPROVAL_CUSTOM_FIELD_OPTIONS_MASTER = function (REQUEST_LINE, FLAG) {
        $scope.$parent.overlay_loadingNew = 'block';
        var CusModelObj = new Object();
        CusModelObj.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID = 0;
        CusModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CusModelObj.BRANCH_ID = REQUEST_LINE.BRANCH_ID;
        PrcCommMethods.P2P_API(CusModelObj, 'GET_APPROVAL_CUSTOM_FIELD_OPTIONS_MASTER', 'PO').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.$parent.overlay_loadingNew = 'none';
                if (FLAG == 1) {
                    $scope.XERO_TRACKING_CATEGORIES = data.data.MASTER;
                    $scope.XERO_TRACKING_CATEGORIES_OPTIONS = data.data.Table;
                    //$scope.ADD_MORE_ITEM();
                    $scope.GET_PO_BY_ID(REQUEST_LINE, FLAG);
                }
                else if (FLAG == 2) {
                    $scope.GET_PROCESSED_PO_BY_ID(REQUEST_LINE, FLAG);
                }
                else if (FLAG == 3) {
                    $scope.XERO_TRACKING_CATEGORIES_CREATE = data.data.MASTER;
                    $scope.XERO_TRACKING_CATEGORIES_OPTIONS_CREATE = data.data.Table;
                    $scope.ADD_MORE_ITEM_CREATE();
                    $scope.ADD_MORE_CREATE_QUOTATION();
                    $scope.ADD_MORE_CREATE_TERM_CON();
                }
            }
            else {
                if (FLAG == 1) {
                    $scope.XERO_TRACKING_CATEGORIES = data.data.MASTER;
                    $scope.XERO_TRACKING_CATEGORIES_OPTIONS = data.data.Table;
                    // $scope.ADD_MORE_ITEM();
                    $scope.GET_PO_BY_ID(REQUEST_LINE, FLAG);
                }
                else if (FLAG == 2) {
                    $scope.GET_PROCESSED_PO_BY_ID(REQUEST_LINE, FLAG);
                }
                else if (FLAG == 3) {
                    $scope.XERO_TRACKING_CATEGORIES_CREATE = data.data.MASTER;
                    $scope.XERO_TRACKING_CATEGORIES_OPTIONS_CREATE = data.data.Table;
                    $scope.ADD_MORE_ITEM_CREATE();
                    $scope.ADD_MORE_CREATE_QUOTATION();
                    $scope.ADD_MORE_CREATE_TERM_CON();
                }
                $scope.XERO_TRACKING_CATEGORIES = [];
                $scope.XERO_TRACKING_CATEGORIES_OPTIONS = [];
                $scope.$parent.overlay_loadingNew = 'none';
            }
        });
    };
    $scope.GET_P2P_ITEMS = function (REQUEST_LINE, FLAG) {
        var CusModelObj = new Object();
        CusModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CusModelObj.BRANCH_ID = REQUEST_LINE.BRANCH_ID;
        CusModelObj.SEARCH_TEXT = "";
        CusModelObj.PAGE_NO = 0;
        PrcCommMethods.P2P_API(CusModelObj, 'GET_P2P_ITEMS', 'PO').then(function (data) {
            if (data.data.Table != undefined) {
                if (FLAG == 1) {
                    $scope.P2P_ITEMS_LIST = data.data.Table;
                }
                if (FLAG == 3) {
                    $scope.CREATE_P2P_ITEMS_LIST = data.data.Table;
                }
            }
        });
    }
    $scope.GET_BRANCH_LIST = function (REQUEST_LIST) {
        var UserModelObj = new Object();
        UserModelObj.INTEGRATION_SYSTEM_ID = 16
        UserModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        UserModelObj.USER_ID = parseInt($cookies.get("USERID"));
        UserModelObj.MODULE_ID = parseInt($cookies.get("MODULE_ID"));
        PrcCommMethods.CASHUP_API(UserModelObj, 'GET_BRANCH_LIST').then(function (data) {
            if (REQUEST_LIST == undefined) {
                if (data.data.length > 0) {
                    $scope.BRANCH_LOGIN_LIST = data.data;
                    if ($scope.BRANCH_LOGIN_LIST.length > 1) {
                        $('#select_branch').modal('show');
                    }
                    else if ($scope.BRANCH_LOGIN_LIST.length == 1) {
                        $scope.CLICK_BRANCH_FY($scope.BRANCH_LOGIN_LIST[0]);
                    }
                };
            }
            else if (REQUEST_LIST != undefined && REQUEST_LIST.PO_HDR_ID == null) {
                var _branch = data.data.filter(function (x) { return x.BRANCH_ID == REQUEST_LIST.BRANCH_ID })
                if (_branch.length > 0) {
                    //ADDRESS "38 A Lichfield Grove" //BRANCH_NAME:"Head Office" //CITY :"City" //COUNTRY_NAME:"United Kingdom"//STATE_NAME                    :"LONDON" //ZIPCODE:"N3 2JP
                    var _address = _branch[0].ADDRESS + "\n" + _branch[0].CITY + "\n" + _branch[0].ZIPCODE + "\n" + _branch[0].STATE_NAME + "," + _branch[0].COUNTRY_NAME;
                    $scope.REQ_Search.DELIVERY_ADDRESS = _address;
                    $scope.REQ_Search.ATTENTION = REQUEST_LIST.REQUESTOR_NAME;
                    $scope.REQ_Search.PHONE = REQUEST_LIST.REQUESTOR_MOBILE_NO == null ? '' : (REQUEST_LIST.REQUESTOR_MOBILE_CODE + '-' + REQUEST_LIST.REQUESTOR_MOBILE_NO);
                }
            }
        });
    }
    $scope.GET_PROJECT_MASTER = function (REQUEST_LINE, FLAG) {
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
    $scope.GET_APPROVAL_HEADERS_CHAIN = function (REQUEST, FLAG) {
        $scope.$parent.overlay_loadingNew = 'block';
        var PaymentModelObj = new Object();
        PaymentModelObj.APPROVAL_HEADER_ID = REQUEST.APP_HDR_ID;
        PaymentModelObj.APPROVAL_TYPE_ID = 2; //PR Approval
        PrcCommMethods.PAYMENT_API(PaymentModelObj, 'GET_APPROVAL_HEADERS_CHAIN').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.APPROVAL_HEADERS_CHAIN_LIST = data.data.Table;
                $scope.$parent.overlay_loadingNew = 'none';
            }
        })
    }
    $scope.GET_P2P_BUDGET_BY_ACCOUNTS = function (FLAG, LINE, HEADER, CHANGE_FLAG) {
        var ptopobj = new Object();
        ptopobj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        ptopobj.BRANCH_ID = LINE.BRANCH_ID;///RECEIVING_TYPE_ID   1 FOR QTY WISE AND 2 FOR AMOUNT WISE
        ptopobj.USER_ID = parseInt($cookies.get("USERID"));
        ptopobj.YEAR = new Date(HEADER.PO_DATE).getFullYear();
        ptopobj.MONTH = new Date(HEADER.PO_DATE).getMonth() + 1;
        if (HEADER.PROJECT_MASTER_ID == null
            || HEADER.PROJECT_MASTER_ID == undefined
            || HEADER.PROJECT_MASTER_ID == "") {
            ptopobj.PROJECT_MASTER_ID = 0;
        } else {
            ptopobj.PROJECT_MASTER_ID = CHANGE_FLAG == 1 ? HEADER.PROJECT_MASTER_ID : HEADER.PROJECT_MASTER_ID;// LINE.PROJECT_MASTER_ID;
        }
        if (FLAG == 2) {
            ptopobj.REFERENCE_ID = 0;
            ptopobj.REFERENCE_TYPE = 0;
        }
        else {
            ptopobj.REFERENCE_ID = LINE.STATUS_ID == 66 || LINE.PO_HDR_ID == undefined ? LINE.REQUEST_ID : LINE.PO_HDR_ID;
            ptopobj.REFERENCE_TYPE = LINE.STATUS_ID == 66 || LINE.PO_HDR_ID == undefined ? 3 : 1;
        }
        ptopobj.SETTING_45 = $scope.$parent.SETTING_USE_GROSS;
        //1;//--1 FOR PO AND 2 FOR INVOICE
        ptopobj.XERO_ACCOUNTS_FOR_BUDGET = [];
        if (FLAG == 1) {
            angular.forEach($scope.ITEM_LIST, function (LINE) {
                if (LINE.ACCOUNT_DETAILS != undefined && LINE.ACCOUNT_DETAILS != null && LINE.ACCOUNT_DETAILS != ""
                    || LINE.ACCOUNT_NAME != undefined && LINE.ACCOUNT_NAME != null && LINE.ACCOUNT_NAME != "") {
                    if (LINE.ACCOUNT_NAME != undefined && LINE.ACCOUNT_NAME != null && LINE.ACCOUNT_NAME != "" && LINE.ACCOUNT_ID != undefined && LINE.ACCOUNT_ID != null && LINE.ACCOUNT_ID != "") {
                        //var readonlyobj = new Object()
                        //readonlyobj.ACCOUNT_ID = LINE.ACCOUNT_ID;
                        //readonlyobj.ACCOUNT_DETAILS = LINE.ACCOUNT_NAME;
                        //var alreadyAccount = ptopobj.XERO_ACCOUNTS_FOR_BUDGET.filter(function (x) { return x.ACCOUNT_ID == readonlyobj.ACCOUNT_ID });
                        //if (alreadyAccount.length == 0) {
                        //    ptopobj.XERO_ACCOUNTS_FOR_BUDGET.push(readonlyobj);
                        //}
                    }
                    // else {
                    if ($scope.XERO_ACCOUNT_CODES.length > 0) {
                        var readonlyobj = new Object()
                        var Accountlist = $scope.XERO_ACCOUNT_CODES.filter(function (x) { return x.CODE + ' - ' + x.NAME == LINE.ACCOUNT_NAME });
                        if (Accountlist.length > 0) {
                            LINE.IS_ACCOUNT_VALID = false;
                            LINE.ACCOUNT_DETAILS = Accountlist[0];
                            LINE.ACCOUNT_ID = parseInt(Accountlist[0].TABLE_ID);
                        }
                        else {
                            LINE.IS_ACCOUNT_VALID = true;
                        }
                        readonlyobj.ACCOUNT_ID = LINE.ACCOUNT_DETAILS != undefined ? parseInt(LINE.ACCOUNT_DETAILS.TABLE_ID) : '';
                        readonlyobj.ACCOUNT_DETAILS = LINE.ACCOUNT_DETAILS != undefined ? LINE.ACCOUNT_DETAILS.CODE + "-" + LINE.ACCOUNT_DETAILS.NAME : '';
                        var alreadyAccount = ptopobj.XERO_ACCOUNTS_FOR_BUDGET.filter(function (x) { return x.ACCOUNT_ID == readonlyobj.ACCOUNT_ID });
                        if (alreadyAccount.length == 0) {
                            ptopobj.XERO_ACCOUNTS_FOR_BUDGET.push(readonlyobj);
                        }
                    }
                    //}
                }
            });
        }
        else if (FLAG == 2) {
            angular.forEach($scope.PRO_ITEM_LIST, function (LINE) {
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
            angular.forEach($scope.CREATE_ITEM_LIST, function (LINE) {
                if (LINE.ACCOUNT_DETAILS != undefined && LINE.ACCOUNT_DETAILS != null && LINE.ACCOUNT_DETAILS != "" || LINE.ACCOUNT_NAME != undefined && LINE.ACCOUNT_NAME != null && LINE.ACCOUNT_NAME != "") {
                    if ($scope.XERO_ACCOUNT_CODES.length > 0) {
                        var readonlyobj = new Object()
                        var Accountlist = $scope.XERO_ACCOUNT_CODES.filter(function (x) { return x.CODE + ' - ' + x.NAME == LINE.ACCOUNT_NAME });
                        if (Accountlist.length > 0) {
                            LINE.IS_ACCOUNT_VALID = false;
                            LINE.ACCOUNT_DETAILS = Accountlist[0];
                        }
                        else {
                            LINE.IS_ACCOUNT_VALID = true;
                        }
                        LINE.ACCOUNT_ID = parseInt(LINE.ACCOUNT_DETAILS.TABLE_ID);
                        readonlyobj.ACCOUNT_ID = parseInt(LINE.ACCOUNT_DETAILS.TABLE_ID);
                        readonlyobj.ACCOUNT_DETAILS = LINE.ACCOUNT_DETAILS.CODE + "-" + LINE.ACCOUNT_DETAILS.NAME;
                        var alreadyAccount = ptopobj.XERO_ACCOUNTS_FOR_BUDGET.filter(function (x) { return x.ACCOUNT_ID == readonlyobj.ACCOUNT_ID });
                        if (alreadyAccount.length == 0) {
                            ptopobj.XERO_ACCOUNTS_FOR_BUDGET.push(readonlyobj);
                        }
                    }
                }
            });
        }
        if (ptopobj.XERO_ACCOUNTS_FOR_BUDGET.length > 0) {
            PrcCommMethods.P2P_API(ptopobj, 'GET_P2P_BUDGET_BY_ACCOUNTS', 'PO').then(function (data) {
                if (data.data != null && FLAG == 1) {
                    $scope.REQ_Search.BUDGET_NAME = data.data.BUDGET_NAME;
                    $scope.P2P_BUDGET_MASTER_LIST = data.data.Budget_Account_Data_List;
                    $scope.REQ_Search.HIDE_SHOW = true;
                    $scope.REQ_Search.BUDGET_DATE = angular.copy(new Date($scope.REQ_Search.PO_DATE));
                }
                else {
                    $scope.REQ_Search.BUDGET_NAME = "";
                    $scope.P2P_BUDGET_MASTER_LIST = [];
                    $scope.BUDGET_TEXT_VALIDATION = "There is no budget allocated in the GL-Account";
                }
                if (data.data != null && FLAG == 2) {
                    $scope.REQ_PROC_Search.BUDGET_NAME = data.data.BUDGET_NAME;
                    $scope.P2P_PROCESS_BUDGET_MASTER_LIST = data.data.Budget_Account_Data_List;

                    $scope.REQ_PROC_Search.HIDE_SHOW = true;
                }
                else {
                    $scope.REQ_PROC_Search.BUDGET_NAME = "";
                    $scope.P2P_PROCESS_BUDGET_MASTER_LIST = [];
                    $scope.BUDGET_TEXT_VALIDATION = "There is no budget allocated in the GL-Account";
                }
                if (data.data != null && FLAG == 3) {
                    $scope.Create_REQ_Search.BUDGET_NAME = data.data.BUDGET_NAME;
                    $scope.P2P_CREATE_BUDGET_MASTER_LIST = data.data.Budget_Account_Data_List;
                    $scope.Create_REQ_Search.BUDGET_DATE = angular.copy($filter('date')(new Date($scope.Create_REQ_Search.PO_DATE)));
                    $scope.Create_REQ_Search.HIDE_SHOW = true;
                }
                else {
                    $scope.Create_REQ_Search.BUDGET_NAME = "";
                    $scope.P2P_CREATE_BUDGET_MASTER_LIST = [];
                    $scope.BUDGET_TEXT_VALIDATION = "There is no budget allocated in the GL-Account";
                }
            });
        }
        else {
            $scope.BUDGET_TEXT_VALIDATION = "Please select valid GL-Account";
        }
    }
    $scope.GET_P2P_BUDGET_SNAPSHOT = function (LINE, HEADER) {
        ModelObj = new Object();
        ModelObj.REFERENCE_ID = LINE.STATUS_ID == 66 || LINE.PO_HDR_ID == undefined ? LINE.REQUEST_ID : LINE.PO_HDR_ID;
        ModelObj.REFERENCE_TYPE = LINE.STATUS_ID == 66 || LINE.PO_HDR_ID == undefined ? 3 : 1;;
        PrcCommMethods.P2P_API(ModelObj, 'GET_P2P_BUDGET_SNAPSHOT', 'PO').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.P2P_SNAP_SHOT_MASTER_LIST = data.data.Table;
            }
        });
    }
    $scope.GET_P2P_DELIVERY_ADDRESS = function (REQ_DETAILS) {
        ModelObj = new Object();
        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        ModelObj.BRANCH_ID = REQ_DETAILS.BRANCH_ID;
        PrcCommMethods.P2P_API(ModelObj, 'GET_P2P_DELIVERY_ADDRESS', 'PO').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.P2P_DELIVERY_ADDRESS_LIST = data.data.Table
            }
            else {
                $scope.P2P_DELIVERY_ADDRESS_LIST = [];
            }
        });
    }
    $scope.GET_TERMS_AND_CONDITIONS_MASTER = function (REQ_DETAILS) {
        ModelObj = new Object();
        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        ModelObj.BRANCH_ID = REQ_DETAILS.BRANCH_ID;
        ModelObj.TYPE = 1;
        ModelObj.ACTIVE = 1;
        PrcCommMethods.ADMIN_API(ModelObj, 'GET_TERMS_AND_CONDITIONS_MASTER', 'PO').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.P2P_TERMS_AND_CONDITIONS_LIST = data.data.Table
            }
            else {
                $scope.P2P_TERMS_AND_CONDITIONS_LIST = [];
            }
        });
    }
    $scope.GET_CONVERSION_RATE = function (FLAG) {
        ModelObj = new Object();
        if (FLAG == 1) {
            ModelObj.FROM_CURRENCY_ID = $scope.REQ_Search.BASE_CURRENCY_ID;
            ModelObj.TO_CURRENCY_ID = $scope.REQ_Search.PO_CURRENCY_ID;
            ModelObj.DATE = $scope.REQ_Search.PO_DATE == undefined || $scope.REQ_Search.PO_DATE == "" || $scope.REQ_Search.PO_DATE == null ? (new Date()).toDateString() : new Date($scope.REQ_Search.PO_DATE).toDateString();
        }
        else if (FLAG == 2) {
            ModelObj.FROM_CURRENCY_ID = $scope.Create_REQ_Search.PO_CURRENCY_ID;
            ModelObj.TO_CURRENCY_ID = $scope.Create_REQ_Search.BASE_CURRENCY_ID;
            ModelObj.DATE = $scope.Create_REQ_Search.PO_DATE == undefined || $scope.Create_REQ_Search.PO_DATE == "" || $scope.Create_REQ_Search.PO_DATE == null ? (new Date()).toDateString() : new Date($scope.Create_REQ_Search.PO_DATE).toDateString();
        }
        //if ($scope.REQ_Search.BASE_CURRENCY_ID == $scope.REQ_Search.PO_CURRENCY_ID) {
        PrcCommMethods.P2P_API(ModelObj, 'GET_CONVERSION_RATE', 'PO').then(function (data) {
            if (data.data.Table.length > 0) {
                if (FLAG == 1) {
                    $scope.REQ_Search.BASE_TO_PO_CONVERSION_RATE = parseFloat(data.data.Table[0].Column1).toFixed(5);
                    $scope.REQ_Search.COPY_BASE_TO_PO_CONVERSION_RATE = angular.copy(parseFloat(data.data.Table[0].Column1).toFixed(5));
                }
                else if (FLAG == 2) {
                    $scope.Create_REQ_Search.BASE_TO_PO_CONVERSION_RATE = parseFloat(data.data.Table[0].Column1).toFixed(5);
                    $scope.Create_REQ_Search.COPY_BASE_TO_PO_CONVERSION_RATE = angular.copy(parseFloat(data.data.Table[0].Column1).toFixed(5));
                }
            }
        });
    }

    $scope.VALIDATE_GET_CONVERSION_RATE = function (FLAG) {
        var ModelObj = new Object();
        if (FLAG == 1) {
            ModelObj.FROM_CURRENCY_ID = $scope.REQ_Search.BASE_CURRENCY_ID;
            ModelObj.TO_CURRENCY_ID = $scope.REQ_Search.PO_CURRENCY_ID;
            ModelObj.DATE = $scope.REQ_Search.PO_DATE == undefined || $scope.REQ_Search.PO_DATE == "" || $scope.REQ_Search.PO_DATE == null ? (new Date()).toDateString() : new Date($scope.REQ_Search.PO_DATE).toDateString();
        }
        else if (FLAG == 2) {
            ModelObj.FROM_CURRENCY_ID = $scope.Create_REQ_Search.PO_CURRENCY_ID;
            ModelObj.TO_CURRENCY_ID = $scope.Create_REQ_Search.BASE_CURRENCY_ID;
            ModelObj.DATE = $scope.Create_REQ_Search.PO_DATE == undefined || $scope.Create_REQ_Search.PO_DATE == "" || $scope.Create_REQ_Search.PO_DATE == null ? (new Date()).toDateString() : new Date($scope.Create_REQ_Search.PO_DATE).toDateString();
        }
        PrcCommMethods.P2P_API(ModelObj, 'GET_CONVERSION_RATE', 'PO').then(function (data) {
            if (data.data.Table.length > 0) {
                if (FLAG == 1) {
                    $scope.REQ_Search.COPY_BASE_TO_PO_CONVERSION_RATE = parseFloat(data.data.Table[0].Column1).toFixed(5);
                }
                else if (FLAG == 2) {
                    $scope.Create_REQ_Search.COPY_BASE_TO_PO_CONVERSION_RATE = parseFloat(data.data.Table[0].Column1).toFixed(5);
                }
            }
        });
    }
    $scope.GET_CURRENCY();
    $scope.CLICK_BRANCH_FY = function (BL) {
        $scope.Create_REQ_Search.BRANCH_ID = BL.BRANCH_ID;
        $scope.Create_REQ_Search.UploadedFiles = [];
        $scope.GET_PYMNT_SUPPLIER($scope.Create_REQ_Search, 3);
        $scope.GET_XERO_ACCOUNT_CODES($scope.Create_REQ_Search, 3)
        $scope.GET_XERO_BRANDING_THEMES($scope.Create_REQ_Search, 3);
        $scope.GET_P2P_ITEMS($scope.Create_REQ_Search, 3);
        $scope.GET_PROJECT_MASTER($scope.Create_REQ_Search, 3);
        var _address = BL.ADDRESS + "\n" + BL.CITY + "\n" + BL.ZIPCODE + "\n" + BL.STATE_NAME + "," + BL.COUNTRY_NAME;
        $scope.Create_REQ_Search.DELIVERY_ADDRESS = _address;
        $scope.Create_REQ_Search.ATTENTION = ($cookies.get("NAME"));
        $scope.Create_REQ_Search.PHONE = $cookies.get("MOBILE_CODE") == "undefined" || $cookies.get("MOBILE_CODE") == undefined ? "" : $cookies.get("MOBILE_CODE") + '-' + $cookies.get("MOBILE_NO");
    }

    $scope.GET_PURCHASE_REQUEST_BY_ID = function (REQUEST_LINE, FLAG) { // PR Approval
        ModelObj = new Object();
        ModelObj.PURCHASE_REQUEST_ID = REQUEST_LINE.REQUEST_ID;
        PrcCommMethods.P2P_API(ModelObj, 'GET_PURCHASE_REQUEST_BY_ID', 'PO').then(function (data) {
            if (data.data.Table.length > 0 && FLAG == 1) {
                $scope.ADD_MORE_ITEM();
                $scope.RESET_REQ();
                var REQ_LINE = data.data.Table[0];
                $scope.ITEM_LIST[0].ITEM_NAME = REQ_LINE.ITEM_NAME;
                $scope.ITEM_LIST[0].DESCRIPTION = REQ_LINE.DESCRIPTION;
                $scope.ITEM_LIST[0].UOM_NAME = REQ_LINE.UOM_NAME;
                $scope.ITEM_LIST[0].QUANTITY = REQ_LINE.QUANTITY;
                //$scope.ITEM_LIST[0].UNIT_PRICE = REQ_LINE.APPROVER_EXPECTED_PRICE;
                $scope.ITEM_LIST[0].ACCOUNT_NAME = REQ_LINE.ACCOUNT_DETAILS;
                $scope.ITEM_LIST[0].ACCOUNT_ID = REQ_LINE.ACCOUNT_ID;

                $scope.REQ_Search.AUTO_EMAIL_TO_SUPPLIER = true;
                $scope.REQ_Search.PROJECT_MASTER_ID = REQ_LINE.PROJECT_MASTER_ID;
                REQUEST_LINE.PROJECT_MASTER_ID = REQ_LINE.PROJECT_MASTER_ID;
                //$scope.GET_XERO_ACCOUNT_CODES(REQUEST_LINE, FLAG)

                REQUEST_LINE.ACCOUNT_DETAILS = REQ_LINE.ACCOUNT_DETAILS;
                REQUEST_LINE.ACCOUNT_ID = REQ_LINE.ACCOUNT_ID;
                REQUEST_LINE.PROJECT_NAME = REQ_LINE.PROJECT_NAME;
                REQUEST_LINE.PROJECT_MASTER_ID = REQ_LINE.PROJECT_MASTER_ID;



                $('.AddCustomScroll_Account').find('.dropdown-menu').addClass('custom-scrollbar');
                if ($scope.CURRENCY_LIST.length > 0) {
                    //var item = $scope.CURRENCY_LIST.filter(function (x) { return x.CURRENCY_ID == parseInt(REQ_LINE.PR_CURRENCY_ID) });
                    //if (item.length > 0) {
                    //    $scope.REQ_Search.PO_CURRENCY_ID = angular.copy(item[0].CURRENCY_ID);
                    //    $scope.REQ_Search.PO_CURRENCY_NAME = angular.copy(item[0].DISPLAY_TEXT);
                    //    $scope.REQ_Search.BASE_CURRENCY_ID = angular.co   py(item[0].CURRENCY_ID);
                    //    $scope.REQ_Search.BASE_CURRENCY_NAME = angular.copy(item[0].DISPLAY_TEXT);
                    //    $scope.REQ_Search.CURRENCY_CODE = angular.copy(item[0].CURRENCY_CODE);
                    //    $scope.REQ_Search.BASE_TO_PO_CONVERSION_RATE = 1;
                    //}
                    if (data.data.Table[0].BASE_CURRENCY_ID != undefined && data.data.Table[0].BASE_CURRENCY_ID == data.data.Table[0].PR_CURRENCY_ID) {
                        var item = $scope.CURRENCY_LIST.filter(function (x) { return x.CURRENCY_ID == data.data.Table[0].PR_CURRENCY_ID });
                        $scope.REQ_Search.PO_CURRENCY_ID = angular.copy(item[0].CURRENCY_ID);
                        $scope.REQ_Search.PO_CURRENCY_NAME = angular.copy(item[0].DISPLAY_TEXT);
                        $scope.REQ_Search.BASE_CURRENCY_ID = angular.copy(item[0].CURRENCY_ID);
                        $scope.REQ_Search.BASE_CURRENCY_NAME = angular.copy(item[0].DISPLAY_TEXT);
                    }
                    else {
                        var CurrBaseList = $scope.CURRENCY_LIST.filter(function (x) { return x.CURRENCY_ID == data.data.Table[0].BASE_CURRENCY_ID });
                        var CurrPRList = $scope.CURRENCY_LIST.filter(function (x) { return x.CURRENCY_ID == data.data.Table[0].PR_CURRENCY_ID });
                        if (CurrBaseList.length > 0) {
                            $scope.REQ_Search.PO_CURRENCY_ID = angular.copy(CurrPRList[0].CURRENCY_ID);
                            $scope.REQ_Search.PO_CURRENCY_NAME = angular.copy(CurrPRList[0].DISPLAY_TEXT);
                            $scope.REQ_Search.BASE_CURRENCY_ID = angular.copy(CurrBaseList[0].CURRENCY_ID);
                            $scope.REQ_Search.BASE_CURRENCY_NAME = angular.copy(CurrBaseList[0].DISPLAY_TEXT);
                            $scope.REQ_Search.BASE_TO_PO_CONVERSION_RATE = angular.copy(data.data.Table[0].BASE_TO_PR_CONVERSION_RATE);
                            $scope.VALIDATE_GET_CONVERSION_RATE(1);
                        }
                    }
                }
                else {
                    $scope.GET_CURRENCY();
                }
                $scope.GET_BRANCH_LIST(REQUEST_LINE);
                $scope.GET_TERMS_AND_CONDITIONS_MASTER(REQ_LINE, FLAG);
                $scope.ADD_MORE_QUOTATION();
            }
            if (data.data.Table.length > 0 && FLAG == undefined) {

                var REQ_LINE = data.data.Table[0];
                REQUEST_LINE.ACCOUNT_DETAILS = REQ_LINE.ACCOUNT_DETAILS;
                REQUEST_LINE.ACCOUNT_ID = REQ_LINE.ACCOUNT_ID;
                REQUEST_LINE.PROJECT_NAME = REQ_LINE.PROJECT_NAME;
                REQUEST_LINE.PROJECT_MASTER_ID = REQ_LINE.PROJECT_MASTER_ID;

            };
        });
    }
    $scope.GET_PO_BY_ID = function (REQUEST_LINE, FLAG) {
        if (REQUEST_LINE.PO_HDR_ID != null || REQUEST_LINE.PO_HDR_ID != null) {
            $scope.$parent.overlay_loadingNew = 'block';
            ModelObj = new Object();
            ModelObj.PO_HDR_ID = REQUEST_LINE.PO_HDR_ID;
            PrcCommMethods.P2P_API(ModelObj, 'GET_PO_BY_ID', 'PO').then(function (data) {
                if (data.data.Table.length > 0) {
                    var SUPList = $scope.SUPPLIER_LIST.filter(function (x) { return x.ID == data.data.Table[0].CONTACT_ID });
                    if (SUPList.length > 0) { $scope.REQ_Search.SUPPLIER_NAME = SUPList[0].SUPPLIER_NAME; } else { $scope.REQ_Search.SUPPLIER_NAME = data.data.Table[0].CONTACT_NAME; };
                    var TAX_TYPEList = $scope.TAX_TYPE.filter(function (x) { return x.ID == data.data.Table[0].TAX_TYPE });
                    if (TAX_TYPEList.length > 0) {
                        data.data.Table[0].TAX_NAME = TAX_TYPEList[0].NAME;
                        data.data.Table[0].TAX_ID = TAX_TYPEList[0].ID;
                    }
                    if (data.data.Table[0].BASE_CURRENCY_ID == data.data.Table[0].PO_CURRENCY_ID) {
                        var item = $scope.CURRENCY_LIST.filter(function (x) { return x.CURRENCY_ID == data.data.Table[0].PO_CURRENCY_ID });
                        $scope.REQ_Search.PO_CURRENCY_ID = angular.copy(item[0].CURRENCY_ID);
                        $scope.REQ_Search.PO_CURRENCY_NAME = angular.copy(item[0].DISPLAY_TEXT);
                        $scope.REQ_Search.BASE_CURRENCY_ID = angular.copy(item[0].CURRENCY_ID);
                        $scope.REQ_Search.BASE_CURRENCY_NAME = angular.copy(item[0].DISPLAY_TEXT);
                    }
                    else {
                        var CurrBaseList = $scope.CURRENCY_LIST.filter(function (x) { return x.CURRENCY_ID == data.data.Table[0].BASE_CURRENCY_ID });
                        var CurrPOList = $scope.CURRENCY_LIST.filter(function (x) { return x.CURRENCY_ID == data.data.Table[0].PO_CURRENCY_ID });
                        $scope.REQ_Search.PO_CURRENCY_ID = angular.copy(CurrPOList[0].CURRENCY_ID);
                        $scope.REQ_Search.PO_CURRENCY_NAME = angular.copy(CurrPOList[0].DISPLAY_TEXT);
                        $scope.REQ_Search.BASE_CURRENCY_ID = angular.copy(CurrBaseList[0].CURRENCY_ID);
                        $scope.REQ_Search.BASE_CURRENCY_NAME = angular.copy(CurrBaseList[0].DISPLAY_TEXT);
                        $scope.VALIDATE_GET_CONVERSION_RATE(1);
                    }

                    $scope.REQ_Search.PO_DATE = data.data.Table[0].PO_DATE == "" || data.data.Table[0].PO_DATE == null ? $filter('date')(new Date()) : $filter('date')(new Date(data.data.Table[0].PO_DATE));
                    $scope.REQ_Search.DELIVERY_DATE = data.data.Table[0].DELIVERY_DATE == "" || data.data.Table[0].DELIVERY_DATE == null ? '' : $filter('date')(new Date(data.data.Table[0].DELIVERY_DATE));
                    $scope.REQ_Search.REFERENCE = data.data.Table[0].REFERENCE;
                    $scope.REQ_Search.NOTE_FOR_APPROVERS = data.data.Table[0].NOTE_FOR_APPROVERS;
                    $scope.REQ_Search.TAX_TYPE = data.data.Table[0].TAX_TYPE;
                    $scope.REQ_Search.DELIVERY_ADDRESS = data.data.Table[0].DELIVERY_ADDRESS;
                    $scope.REQ_Search.ATTENTION = data.data.Table[0].ATTENTION;
                    $scope.REQ_Search.PHONE = data.data.Table[0].PHONE;
                    $scope.REQ_Search.DELIVERY_INSTRUCTIONS = data.data.Table[0].DELIVERY_INSTRUCTIONS;
                    $scope.REQ_Search.AUTO_EMAIL_TO_SUPPLIER = data.data.Table[0].AUTO_EMAIL_TO_SUPPLIER;
                    $scope.REQ_Search.SUPPLIER_EMAIL = data.data.Table[0].SUPPLIER_EMAIL;
                    $scope.REQ_Search.SELECTED_SUPPLIER_ID = data.data.Table[0].CONTACT_ID;
                    $scope.REQ_Search.BASE_TO_PO_CONVERSION_RATE = data.data.Table[0].BASE_TO_PO_CONVERSION_RATE;
                    $scope.REQ_Search.COPY_BASE_TO_PO_CONVERSION_RATE = data.data.Table[0].BASE_TO_PO_CONVERSION_RATE;
                    $scope.REQ_Search.PROJECT_MASTER_ID = data.data.Table[0].PROJECT_MASTER_ID;
                    $scope.REQ_Search.XERO_BRANDING_THEME_ID = data.data.Table[0].XERO_BRANDING_THEME_ID;
                    $scope.REQ_Search.ADVANCE = data.data.Table[0].ADVANCE;

                    $scope.REQ_Search.SPLIT_TYPE_ID = data.data.Table[0].SPLIT_TYPE == 0 ? null : data.data.Table[0].SPLIT_TYPE;
                    $scope.REQ_Search.COPY_SPLIT_TYPE_ID = angular.copy($scope.REQ_Search.SPLIT_TYPE_ID);

                    $scope.SELECTED_XERO_TRACKING_CATEGORIES_OPTIONS = data.data.Table2;

                    $scope.ITEM_LIST = data.data.Table1;
                    if (data.data.Table3.length > 0) {
                        $scope.TERMS_AND_CONDITIONS_MASTER_LIST = data.data.Table3;
                    }
                    else {
                        $scope.GET_TERMS_AND_CONDITIONS_MASTER(REQUEST_LINE, FLAG);
                    }
                    if (data.data.Table4.length > 0) {
                        $scope.QUOTATION_LIST = data.data.Table4;
                    }
                    else {
                        $scope.ADD_MORE_QUOTATION();
                    }

                    if (data.data.Table5.length > 0) {
                        $scope.PO_SPLIT_LIST = data.data.Table5;
                        $scope.Fn_SPLIT_REQ($scope.REQ_Search);
                    }
                    $('.AddCustomScroll_Account').find('.dropdown-menu').addClass('custom-scrollbar');
                    $scope.$parent.overlay_loadingNew = 'none';
                }
            });
        }
        else {
            $scope.GET_PURCHASE_REQUEST_BY_ID(REQUEST_LINE, FLAG);
            //if (FLAG == undefined) {
            //    $scope.ADD_MORE_ITEM();
            //    $scope.RESET_REQ();
            //}
        }
    }
    $scope.GET_PROCESSED_PO_BY_ID = function (REQUEST_LINE, FLAG) {
        $scope.PROC_TERMS_AND_CONDITIONS_MASTER_LIST = [];
        ModelObj = new Object();
        ModelObj.PO_HDR_ID = REQUEST_LINE.PO_HDR_ID;
        PrcCommMethods.P2P_API(ModelObj, 'GET_PO_BY_ID', 'PO').then(function (data) {
            if (data.data.Table.length > 0) {
                //var SUPList = $scope.SUPPLIER_LIST.filter(function (x) { return x.ID == data.data.Table[0].CONTACT_ID });
                //if (SUPList.length > 0) {
                //    $scope.REQ_PROC_Search.SUPPLIER_NAME = SUPList[0].SUPPLIER_NAME;
                //    data.data.Table[0].SUPPLIER_NAME = SUPList[0].SUPPLIER_NAME;
                //}
                var TAX_TYPEList = $scope.TAX_TYPE.filter(function (x) { return x.ID == data.data.Table[0].TAX_TYPE });
                if (TAX_TYPEList.length > 0) {
                    data.data.Table[0].TAX_NAME = TAX_TYPEList[0].NAME;
                    $scope.REQ_PROC_Search.TAX_TYPE = TAX_TYPEList[0].ID;
                }
                $scope.REQ_PROC_Search.REQUEST_DETAILS = REQUEST_LINE;
                $scope.REQ_PROC_Search.REQ_DETAILS = data.data.Table[0];
                $scope.REQ_PROC_Search.PROJECT_MASTER_ID = data.data.Table[0].PROJECT_MASTER_ID;
                $scope.REQ_PROC_Search.PO_DATE = data.data.Table[0].PO_DATE;
                $scope.REQ_PROC_Search.BASE_TO_PO_CONVERSION_RATE = data.data.Table[0].BASE_TO_PO_CONVERSION_RATE;
                $scope.REQ_PROC_Search.REQ_DETAILS.SHORT_NAME = $scope.TextReturn(data.data.Table[0].REQUESTOR_NAME)
                $scope.REQ_PROC_Search.SPLIT_TYPE_ID = data.data.Table[0].SPLIT_TYPE == 0 ? null : data.data.Table[0].SPLIT_TYPE;
                $scope.REQ_PROC_Search.COPY_SPLIT_TYPE_ID = angular.copy($scope.REQ_PROC_Search.SPLIT_TYPE_ID);

                $scope.SELECTED_PROCESSED_XERO_TRACKING_CATEGORIES_OPTIONS = data.data.Table2;
                $scope.PRO_ITEM_LIST = data.data.Table1;
                if (data.data.Table3.length > 0) {
                    $scope.PROC_TERMS_AND_CONDITIONS_MASTER_LIST = data.data.Table3;
                }
                if (data.data.Table4.length > 0) {
                    $scope.PROC_QUOTATION_LIST = data.data.Table4;
                }
                if (data.data.Table5.length > 0) {
                    $scope.PO_SPLIT_LIST = data.data.Table5;
                    $scope.Fn_SPLIT_REQ($scope.REQ_PROC_Search);
                }
                $scope.GET_P2P_BUDGET_BY_ACCOUNTS(2, $scope.REQ_PROC_Search.PROCESSED_LINE, $scope.REQ_PROC_Search, 1);


            }
        });
    }
    $scope.GET_CREATE_PO_BY_ID = function (PO_HDR_ID, FLAG) {
        ModelObj = new Object();
        ModelObj.PO_HDR_ID = PO_HDR_ID
        PrcCommMethods.P2P_API(ModelObj, 'GET_PO_BY_ID', 'PO').then(function (data) {
            if (data.data.Table.length > 0) {
                var SUPList = $scope.SUPPLIER_LIST.filter(function (x) { return x.ID == data.data.Table[0].CONTACT_ID });
                if (SUPList.length > 0) { $scope.Create_REQ_Search.SUPPLIER_NAME = SUPList[0].SUPPLIER_NAME; }
                var TAX_TYPEList = $scope.TAX_TYPE.filter(function (x) { return x.ID == data.data.Table[0].TAX_TYPE });
                if (TAX_TYPEList.length > 0) {
                    data.data.Table[0].TAX_NAME = TAX_TYPEList[0].NAME;
                    data.data.Table[0].TAX_ID = TAX_TYPEList[0].ID;
                }
                if (data.data.Table[0].BASE_CURRENCY_ID == data.data.Table[0].PO_CURRENCY_ID) {
                    var item = $scope.CURRENCY_LIST.filter(function (x) { return x.CURRENCY_ID == data.data.Table[0].PO_CURRENCY_ID });
                    $scope.Create_REQ_Search.PO_CURRENCY_ID = angular.copy(item[0].CURRENCY_ID);
                    $scope.Create_REQ_Search.PO_CURRENCY_NAME = angular.copy(item[0].DISPLAY_TEXT);
                    $scope.Create_REQ_Search.BASE_CURRENCY_ID = angular.copy(item[0].CURRENCY_ID);
                    $scope.Create_REQ_Search.BASE_CURRENCY_NAME = angular.copy(item[0].DISPLAY_TEXT);
                }
                else {
                    var CurrBaseList = $scope.CURRENCY_LIST.filter(function (x) { return x.CURRENCY_ID == data.data.Table[0].BASE_CURRENCY_ID });
                    var CurrPOList = $scope.CURRENCY_LIST.filter(function (x) { return x.CURRENCY_ID == data.data.Table[0].PO_CURRENCY_ID });

                    $scope.Create_REQ_Search.PO_CURRENCY_ID = angular.copy(CurrPOList[0].CURRENCY_ID);
                    $scope.Create_REQ_Search.PO_CURRENCY_NAME = angular.copy(CurrPOList[0].DISPLAY_TEXT);
                    $scope.Create_REQ_Search.BASE_CURRENCY_ID = angular.copy(CurrBaseList[0].CURRENCY_ID);
                    $scope.Create_REQ_Search.BASE_CURRENCY_NAME = angular.copy(CurrBaseList[0].DISPLAY_TEXT);
                }

                $scope.Create_REQ_Search.PO_DATE = data.data.Table[0].PO_DATE == "" || data.data.Table[0].PO_DATE == null ? $filter('date')(new Date()) : $filter('date')(new Date(data.data.Table[0].PO_DATE));
                $scope.Create_REQ_Search.DELIVERY_DATE = data.data.Table[0].DELIVERY_DATE == "" || data.data.Table[0].DELIVERY_DATE == null ? "" : $filter('date')(new Date(data.data.Table[0].DELIVERY_DATE));
                $scope.Create_REQ_Search.REFERENCE = data.data.Table[0].REFERENCE;
                $scope.Create_REQ_Search.NOTE_FOR_APPROVERS = data.data.Table[0].NOTE_FOR_APPROVERS;
                $scope.Create_REQ_Search.TAX_TYPE = data.data.Table[0].TAX_TYPE;
                $scope.Create_REQ_Search.DELIVERY_ADDRESS = data.data.Table[0].DELIVERY_ADDRESS;
                $scope.Create_REQ_Search.ATTENTION = data.data.Table[0].ATTENTION;
                $scope.Create_REQ_Search.PHONE = data.data.Table[0].PHONE;
                $scope.Create_REQ_Search.DELIVERY_INSTRUCTIONS = data.data.Table[0].DELIVERY_INSTRUCTIONS;
                $scope.Create_REQ_Search.AUTO_EMAIL_TO_SUPPLIER = data.data.Table[0].AUTO_EMAIL_TO_SUPPLIER;
                $scope.Create_REQ_Search.BASE_TO_PO_CONVERSION_RATE = data.data.Table[0].BASE_TO_PO_CONVERSION_RATE;
                $scope.Create_REQ_Search.PROJECT_MASTER_ID = data.data.Table[0].PROJECT_MASTER_ID;
                $scope.Create_REQ_Search.XERO_BRANDING_THEME_ID = data.data.Table[0].XERO_BRANDING_THEME_ID;
                $scope.Create_REQ_Search.SUPPLIER_EMAIL = data.data.Table[0].SUPPLIER_EMAIL;
                $scope.Create_REQ_Search.ADVANCE = data.data.Table[0].ADVANCE;
                $scope.SELECTED_CREATE_XERO_TRACKING_CATEGORIES_OPTIONS = data.data.Table2;
                $scope.CREATE_ITEM_LIST = data.data.Table1;

                if (data.data.Table3.length > 0) {
                    $scope.CREATE_TERMS_AND_CONDITIONS_MASTER_LIST = data.data.Table3;
                }
                if (data.data.Table4.length > 0) {
                    $scope.CREATE_QUOTATION_LIST = data.data.Table4;
                }
            }
        });
    }
    $scope.GET_PURCHASE_REQUESTS_BY_BUYER_LAZY_LOAD = function () {
        if ($scope.REQ_Search.PAGE_NO == $scope.REQ_Search.PAGE_NO_COPY && Actioncount == 0 && $scope.GetActionData == true) {
            Actioncount = 1;
            $scope.GET_PURCHASE_REQUESTS_BY_BUYER(2);
        }
    }
    $scope.GET_PURCHASE_REQUESTS_BY_BUYER_PROCESSED_LAZY_LOAD = function () {
        if ($scope.GetProcessData == true) {
            $scope.GET_PURCHASE_REQUESTS_BY_BUYER_PROCESSED(2);
        }
    }
    $scope.GET_PURCHASE_REQUESTS_BY_BUYER = function (FLAG, DRAFT_FLAG) {
        if (FLAG == 1) {
            $scope.REQ_Search.PAGE_NO = 1;
            DRAFT_FLAG == undefined ? $scope.PURCHASE_REQUESTS_BY_BUYER_LIST = [] : '';
        }
        ModelObj = new Object();
        ModelObj.NAME = $scope.REQ_Search.NAME;
        ModelObj.START_DATE = $scope.REQ_Search.START_DATE;
        ModelObj.END_DATE = $scope.REQ_Search.END_DATE;
        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        ModelObj.BRANCH_ID = $scope.REQ_Search.FILTER_BRANCH_ID;
        ModelObj.PAGE_NO = $scope.REQ_Search.PAGE_NO;
        ModelObj.PAGE_SIZE = $scope.REQ_Search.PAGE_SIZE;
        ModelObj.URGENT_REQUEST = $scope.REQ_Search.FILTER_URGENT_REQUESTS == null ? -1 : $scope.PurchaseRequestSearch.FILTER_URGENT_REQUESTS;        //-1 // all 0 false 1 true
        ModelObj.PRIVILAGE_134 = $scope.CheckSubModuleAccess(134) ? 1 : 0;//-- 0/1 ON THE BASIS OF PRIV 134
        ModelObj.USER_ID = parseInt($cookies.get("USERID"));
        ModelObj.STATUS_IDS = "";
        ModelObj.PR_NUMBER = "";
        ModelObj.ACTION_REQUIRED = 1;// --0 for all 1 for action required and 2 for processed
        PrcCommMethods.P2P_API(ModelObj, 'GET_PURCHASE_REQUESTS_BY_BUYER', 'PO').then(function (data) {
            if (DRAFT_FLAG == undefined) {
                if (data.data.Table.length > 0) {
                    Actioncount = 0;
                    $scope.PURCHASE_REQUESTS_BY_BUYER_LIST = $scope.PURCHASE_REQUESTS_BY_BUYER_LIST.concat(data.data.Table);
                    if (FLAG == 1) {
                        $scope.PURCHASE_REQUEST_CLICK(data.data.Table[0], 1);
                    }
                    if (data.data.Table.length < $scope.REQ_Search.PAGE_SIZE) {
                        $scope.GetActionData = false;
                    }
                    else {
                        $scope.REQ_Search.PAGE_NO = parseInt($scope.REQ_Search.PAGE_NO) + 1;
                        $scope.REQ_Search.PAGE_NO_COPY = angular.copy($scope.REQ_Search.PAGE_NO)
                        $scope.GetActionData = true;
                    }
                    $scope.REQ_Search.PAGE_NO_COPY = angular.copy($scope.REQ_Search.PAGE_NO)
                }
                else {
                    if ($scope.REQ_Search.length == 0) { }
                    $scope.GetActionData = false;
                }
            }
            else {
                if (data.data.Table.length > 0) {
                    $scope.PURCHASE_REQUEST_CLICK(data.data.Table[0], 1);
                }
                else {
                    if ($scope.REQ_Search.length == 0) { }
                    $scope.GetActionData = false;
                }
            }
        });
    }
    $scope.GET_PURCHASE_REQUESTS_BY_BUYER_PROCESSED = function (FLAG) {
        if (FLAG == 1) {
            $scope.REQ_PROC_Search.PAGE_NO = 1;
            $scope.PURCHASE_PROCESSED_LIST = [];
            $scope.PRO_ITEM_LIST = [];
        }
        ModelObj = new Object();
        ModelObj.NAME = $scope.REQ_PROC_Search.NAME;
        ModelObj.START_DATE = $scope.REQ_PROC_Search.START_DATE;
        ModelObj.END_DATE = $scope.REQ_PROC_Search.END_DATE;
        ModelObj.BRANCH_ID = $scope.REQ_PROC_Search.FILTER_BRANCH_ID;
        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        ModelObj.PAGE_NO = $scope.REQ_PROC_Search.PAGE_NO;
        ModelObj.PAGE_SIZE = $scope.REQ_PROC_Search.PAGE_SIZE;
        ModelObj.ACTION_REQUIRED = 2;// -- 0 for all 1 for action required and 2 for processed
        ModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.P2P_API(ModelObj, 'GET_PURCHASE_REQUESTS_BY_BUYER', 'PO').then(function (data) {
            if (data.data.Table.length > 0) {
                Processcount = 0;
                $scope.PURCHASE_PROCESSED_LIST = $scope.PURCHASE_PROCESSED_LIST.concat(data.data.Table);
                if (FLAG == 1) {
                    $scope.PURCHASE_PROCESSED_CLICK(data.data.Table[0], 2);
                }

                if (data.data.Table.length < $scope.REQ_PROC_Search.PAGE_SIZE) {
                    $scope.GetProcessData = false;
                }
                else {
                    $scope.REQ_PROC_Search.PAGE_NO = parseInt($scope.REQ_PROC_Search.PAGE_NO) + 1;

                    $scope.GetProcessData = true;
                }
                $scope.REQ_PROC_Search.PAGE_NO_COPY = angular.copy($scope.REQ_PROC_Search.PAGE_NO)
            }
            else {
                if ($scope.REQ_PROC_Search.length == 0) { }
                $scope.GetProcessData = false;
            }
        });
    }

    $scope.GET_DENSE_RANK = function () {
        var QUOTATION_LIST = [];
        if ($scope.TAB_FLAG == 1) {
            QUOTATION_LIST = $scope.QUOTATION_LIST;
        }
        else if ($scope.TAB_FLAG == 4) {
            QUOTATION_LIST = $scope.CREATE_QUOTATION_LIST;
        }
        ModelObj = new Object();
        ModelObj.DENSE_RANK_OBJ = [];
        angular.forEach(QUOTATION_LIST, function (x, index) {
            if (x.TOTAL_AMOUNT > 0) {
                var readonly = new Object();
                readonly.NAME = x.CONTACT_NAME;
                readonly.RANK_AMOUNT = parseFloat(x.TOTAL_AMOUNT).toFixed(5);
                readonly.RANK = 0;// parseFloat(x.RANK).toFixed(5);
                readonly.Serial = index;
                ModelObj.DENSE_RANK_OBJ.push(readonly);
            }
        });
        PrcCommMethods.P2P_API(ModelObj, 'GET_DENSE_RANK', 'PO').then(function (data) {
            angular.forEach(data.data, function (x) {
                if ($scope.TAB_FLAG == 1) {
                    $scope.QUOTATION_LIST[x.Serial].RANK = x.Rank;
                }
                else if ($scope.TAB_FLAG == 4) {
                    $scope.CREATE_QUOTATION_LIST[x.Serial].RANK = x.Rank;
                }
            });
        })
    }
    $scope.GetIntegrationDetails = function (isstart) {
        var PaymentModelObj = new Object();
        PaymentModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        PaymentModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PaymentModelObj.BRANCH_ID = $scope.REQ_Search.REQUEST_LINE.BRANCH_ID;
        PaymentModelObj.INTEGRATION_SYSTEM_ID = 16;
        PrcCommMethods.PAYMENT_API(PaymentModelObj, 'GET_INTEGRATION_DETAILS_BY_CUST_ENT_BRNH').then(function (data) {
            $scope.IntegrationDetails = data.data.filter(function (x) { return x.IS_OUTBOUND == false })[0];
            if ($scope.IntegrationDetails != undefined && $scope.IntegrationDetails.INTEGRATION_STATUS == 2) {
                $scope.IntegrationDetails.ShowSyncBtn = true;
                $scope.IntegrationDetails.PageLoad = false;
                $scope.StopResyncInterval();
                if ($scope.TAB_FLAG == 1 && isstart == 2) {
                    $scope.GET_PYMNT_SUPPLIER($scope.EDIT_REQ_Search);
                }
                else if ($scope.TAB_FLAG == 3 && isstart == 2) {
                    // $scope.GET_APPROVAL_HEADERS_FOR_ADMIN(1, 1, false, 1);
                };
            }
            else {
                //$scope.StartResyncInterval();
                $scope.IntegrationDetails = {};
                $scope.IntegrationDetails.PageLoad = false;
                $scope.IntegrationDetails.ShowSyncBtn = false;
            }
            // if ($scope.IntegrationDetails.)
        });
    }
    $scope.GetIntegrationDetails(1);
    $scope.ITEM_LIST_VALID = function (FLAG) {
        if (FLAG == 1) {
            angular.forEach($scope.ITEM_LIST, function (LINE) {
                var Accountlist = $scope.XERO_ACCOUNT_CODES.filter(function (x) { return x.CODE + ' - ' + x.NAME == LINE.ACCOUNT_NAME });
                if (Accountlist.length > 0) {
                    LINE.IS_ACCOUNT_VALID = false;
                    LINE.ACCOUNT_DETAILS = Accountlist[0];
                }
                else {
                    LINE.IS_ACCOUNT_VALID = true;
                }
                LINE.ACCOUNT_ID = LINE.ACCOUNT_DETAILS == null || LINE.ACCOUNT_DETAILS == undefined ? null : parseInt(LINE.ACCOUNT_DETAILS.TABLE_ID);
            });
        }
        if (FLAG == 2) {
            angular.forEach($scope.PRO_ITEM_LIST, function (LINE) {
                var readonlyobj = new Object()
                readonlyobj.ACCOUNT_ID = parseInt(LINE.ACCOUNT_ID);
                readonlyobj.ACCOUNT_DETAILS = LINE.ACCOUNT_DETAILS;
                var alreadyAccount = ptopobj.XERO_ACCOUNTS_FOR_BUDGET.filter(function (x) { return x.ACCOUNT_ID == readonlyobj.ACCOUNT_ID });
                if (alreadyAccount.length == 0) {
                    ptopobj.XERO_ACCOUNTS_FOR_BUDGET.push(readonlyobj);
                }
            });
        }
        if (FLAG == 3) {
            angular.forEach($scope.CREATE_ITEM_LIST, function (LINE) {
                var Accountlist = $scope.XERO_ACCOUNT_CODES.filter(function (x) { return x.CODE + ' - ' + x.NAME == LINE.ACCOUNT_NAME });
                if (Accountlist.length > 0) {
                    LINE.IS_ACCOUNT_VALID = false;
                    LINE.ACCOUNT_DETAILS = Accountlist[0];
                }
                else {
                    LINE.IS_ACCOUNT_VALID = true;
                }
                LINE.ACCOUNT_ID = LINE.ACCOUNT_DETAILS != undefined ? parseInt(LINE.ACCOUNT_DETAILS.TABLE_ID) : '';
            });
        }
    }

    $scope.InitiateItemList = function (PRL, FLAG) {
        PRL.DESCRIPTION_LIMIT_TO = 200;
        if (FLAG == 3) {
            PRL.XERO_TRACKING_CATEGORIES = angular.copy($scope.XERO_TRACKING_CATEGORIES_CREATE);
        }
        else {
            PRL.XERO_TRACKING_CATEGORIES = angular.copy($scope.XERO_TRACKING_CATEGORIES);
        }
        if (PRL.ACCOUNT_ID != undefined && FLAG == 1) {
            var XAC = $scope.XERO_ACCOUNT_CODES.filter(function (x) { return x.TABLE_ID == PRL.ACCOUNT_ID });
            if (XAC.length > 0) {
                PRL.ACCOUNT_DETAILS = XAC[0];
                PRL.ACCOUNT_NAME = XAC[0].CODE + ' - ' + XAC[0].NAME;
            }
        }
        if (PRL.TAX_RATE_ID != undefined && FLAG == 1) {
            var TAX = $scope.XERO_TAXES.filter(function (x) { return x.ID == PRL.TAX_RATE_ID });
            if (TAX.length > 0) {
                PRL.TAX_ID = TAX[0];
            }
        }

        if (PRL.ACCOUNT_ID != undefined && FLAG == 3) {
            var XAC = $scope.XERO_ACCOUNT_CODES.filter(function (x) { return x.TABLE_ID == PRL.ACCOUNT_ID });
            if (XAC.length > 0) {
                PRL.ACCOUNT_DETAILS = XAC[0];
                PRL.ACCOUNT_NAME = XAC[0].CODE + ' - ' + XAC[0].NAME;
            }
        }
        if (PRL.TAX_RATE_ID != undefined && FLAG == 3) {
            var TAX = $scope.XERO_TAXES.filter(function (x) { return x.ID == PRL.TAX_RATE_ID });
            if (TAX.length > 0) {
                PRL.TAX_ID = TAX[0];
            }
        }
        if (PRL.RECEIVING_TYPE_ID != undefined) {
            var RECEIVING_TYPE = $scope.RECEIVING_TYPE.filter(function (x) { return x.ID == PRL.RECEIVING_TYPE_ID });
            if (RECEIVING_TYPE.length > 0) {
                PRL.RECEIVING_TYPE_NAME = RECEIVING_TYPE[0].NAME;
            }
        }

    }
    $scope.InitiateXeroTrackingCategories = function (item, Trackingcat_index, PRL, FLAG) {
        if (FLAG == 1) {
            if (item.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID > 0 && $scope.SELECTED_XERO_TRACKING_CATEGORIES_OPTIONS.length > 0) {
                var select_cat = $scope.SELECTED_XERO_TRACKING_CATEGORIES_OPTIONS.filter(p => p.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID == item.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID && PRL.PO_LINE_ID == p.PO_LINE_ID)[0];
                if (select_cat != undefined && select_cat != null) {
                    var text = $scope.XERO_TRACKING_CATEGORIES_OPTIONS.filter(function (x) { return x.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID == select_cat.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID && x.APPROVAL_CHAIN_CUSTOM_FIELD_OPTIONS_MASTER_ID == select_cat.APPROVAL_CHAIN_CUSTOM_FIELD_OPTIONS_MASTER_ID });
                    item.SELECTED_CATEGORY_OPTION = text[0];
                }
            }
        }
        else if (FLAG == 2) {
            if (item.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID > 0 && $scope.SELECTED_PROCESSED_XERO_TRACKING_CATEGORIES_OPTIONS.length > 0) {
                var Processitemoption = $scope.SELECTED_PROCESSED_XERO_TRACKING_CATEGORIES_OPTIONS.filter(p => p.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID == item.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID && PRL.PO_LINE_ID == p.PO_LINE_ID)[0];
                if (Processitemoption != undefined && Processitemoption != null) {
                    var Protext = $scope.XERO_TRACKING_CATEGORIES_OPTIONS.filter(function (x) { return x.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID == Processitemoption.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID && x.APPROVAL_CHAIN_CUSTOM_FIELD_OPTIONS_MASTER_ID == Processitemoption.APPROVAL_CHAIN_CUSTOM_FIELD_OPTIONS_MASTER_ID });
                    item.SELECTED_CATEGORY_OPTION = Protext[0];
                }
            }
        }
        else if (FLAG == 3) {
            if (item.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID > 0 && $scope.SELECTED_CREATE_XERO_TRACKING_CATEGORIES_OPTIONS.length > 0) {
                var Processitemoption = $scope.SELECTED_CREATE_XERO_TRACKING_CATEGORIES_OPTIONS.filter(p => p.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID == item.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID && PRL.PO_LINE_ID == p.PO_LINE_ID)[0];
                if (Processitemoption != undefined && Processitemoption != null) {
                    var Protext = $scope.XERO_TRACKING_CATEGORIES_OPTIONS_CREATE.filter(function (x) { return x.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID == Processitemoption.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID && x.APPROVAL_CHAIN_CUSTOM_FIELD_OPTIONS_MASTER_ID == Processitemoption.APPROVAL_CHAIN_CUSTOM_FIELD_OPTIONS_MASTER_ID });
                    item.SELECTED_CATEGORY_OPTION = Protext[0];
                }
            }
        }
    }
    $scope.$parent.selectedsupplier = 0;
    $scope.InginitQuotation = function (item, LAST, FLAG, index) {
        item.INDEX_VALUE = index;
        item.IS_MULTI_FILE_UPLOAD_ALLOW = true;
        if (item != undefined && item.TABLE_ID > 0) {
            if (item.UploadedFiles == undefined) {
                item.UploadedFiles = [];
            }
            $scope.$parent.GET_UPLOADS(item, 35, item.TABLE_ID);
        }
        if (LAST == true) {
            $scope.ChangeQAmt(item, FLAG);
        }
        if ($scope.REQ_Search.SELECTED_SUPPLIER_ID == null && item.INDEX_VALUE !== undefined || $scope.REQ_Search.SELECTED_SUPPLIER_ID == undefined && item.INDEX_VALUE !== undefined) {
            $scope.$parent.selectedsupplier = item.INDEX_VALUE;
            $scope.selectedsupplier = item.INDEX_VALUE;
        }
        else if ($scope.REQ_Search.SELECTED_SUPPLIER_ID == item.XERO_CONTACT_ID && item.INDEX_VALUE !== undefined) {
            $scope.$parent.selectedsupplier = item.INDEX_VALUE;
            $scope.selectedsupplier = item.INDEX_VALUE;
        }

    };
    $scope.ACCOUNT_ITEMDETAIL = [];
    $scope.InitiateApprover = function (Approver) {
        // Approver.SEQUENCE_APPROVED = parseInt($scope.ApprovalData.GROUP_SORT_SEQUENCE) > parseInt(Approver.GROUP_SORT_SEQUENCE);
        Approver.showborder = false;
        if ($scope.temp_approver_grp_id == 0) {
            Approver.showborder = true;
            $scope.temp_approver_grp_id = Approver.GROUP_SORT_SEQUENCE;
        }
        if ($scope.temp_approver_grp_id != 0 && $scope.temp_approver_grp_id != Approver.GROUP_SORT_SEQUENCE) {
            Approver.showborder = true;
            $scope.temp_approver_grp_id = Approver.GROUP_SORT_SEQUENCE;
        }
        Approver.SHORT_NAME = $scope.TextReturn(Approver.APPROVER_NAME);
        // alert($scope.ApprovalData.GROUP_SORT_SEQUENCE + '-' + Approver.GROUP_SORT_SEQUENCE);
    }
    $scope.InitiateNameApprover = function (Approver, HEADER) {
        Approver.SHORT_NAME = $scope.TextReturn(Approver.APPROVER_NAME);
        if (Approver.IS_REVIEWER && Approver.APPROVER_ID && parseInt($cookies.get("USERID"))) {
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
        HEADER.STEP_ACTIVE = false;
        if (HEADER.ACTION_REQUIRED == 1) {
            HEADER.STEP_ACTIVE = true;
        }
    }
    $scope.remaningitemdetail = [];
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
        // $scope.REM_AMOUNT_LEFT = parseFloat($scope.MONTH_LIST[$scope.MONTH_LIST.length - 1].ITEM_LIST[parm_line.ITEM_INDEX].TOTAL_BUDGET).toFixed(2);
        $scope.ACCOUNT_ITEMDETAIL = itemdetail.filter(function (_m) { return new Date($scope.REQ_Search.PO_DATE).getMonth() == new Date(_m.START_DATE).getMonth() && new Date($scope.REQ_Search.PO_DATE).getFullYear() == new Date(_m.START_DATE).getFullYear() })
        // $scope.REM_AMOUNT_LEFT = angular.copy($filter('sumOfModValue')(remaningitemdetail, 'REMAINING_AMOUNT'));
    }
    $scope.InginitBudget = function (LINE, FLAG) {
        if (FLAG == 1) {
            LINE.CONSUMED_AMOUNT = 0;
            LINE.INAPPROVAL_AMOUNT = 0;
            var PO = $scope.P2P_BUDGET_PO_LIST.filter(function (x) { return x.ACCOUNT_ID == LINE.XERO_ACCOUNT_ID });
            var BILL = $scope.P2P_BUDGET_BILL_LIST.filter(function (x) { return x.ACCOUNT_ID == LINE.XERO_ACCOUNT_ID });
            if (PO.length > 0 && BILL.length > 0) {
                LINE.CONSUMED_AMOUNT = PO[0].PO_APPROVED + BILL[0].INVOICE_APPROVED;
                LINE.INAPPROVAL_AMOUNT = PO[0].PO_PENDING + BILL[0].INVOICE_PENDING;
            }
            else if (PO.length > 0) {
                LINE.CONSUMED_AMOUNT = PO[0].PO_APPROVED;
                LINE.INAPPROVAL_AMOUNT = PO[0].PO_PENDING;
            }
            else if (BILL.length > 0) {
                LINE.CONSUMED_AMOUNT = BILL[0].INVOICE_APPROVED;
                LINE.INAPPROVAL_AMOUNT = BILL[0].INVOICE_PENDING;
            }
        }
        else if (FLAG == 2) {
            LINE.CONSUMED_AMOUNT = 0;
            LINE.INAPPROVAL_AMOUNT = 0;
            var PO = $scope.P2P_PROCESS_BUDGET_PO_LIST.filter(function (x) { return x.ACCOUNT_ID == LINE.XERO_ACCOUNT_ID });
            var BILL = $scope.P2P_PROCESS_BUDGET_BILL_LIST.filter(function (x) { return x.ACCOUNT_ID == LINE.XERO_ACCOUNT_ID });
            if (PO.length > 0 && BILL.length > 0) {
                LINE.CONSUMED_AMOUNT = PO[0].PO_APPROVED + BILL[0].INVOICE_APPROVED;
                LINE.INAPPROVAL_AMOUNT = PO[0].PO_PENDING + BILL[0].INVOICE_PENDING;
            }
            else if (PO.length > 0) {
                LINE.CONSUMED_AMOUNT = PO[0].PO_APPROVED;
                LINE.INAPPROVAL_AMOUNT = PO[0].PO_PENDING;
            }
            else if (BILL.length > 0) {
                LINE.CONSUMED_AMOUNT = BILL[0].INVOICE_APPROVED;
                LINE.INAPPROVAL_AMOUNT = BILL[0].INVOICE_PENDING;
            }
        }
        else if (FLAG == 3) {
            LINE.CONSUMED_AMOUNT = 0;
            LINE.INAPPROVAL_AMOUNT = 0;
            var PO = $scope.P2P_CREATE_BUDGET_PO_LIST.filter(function (x) { return x.ACCOUNT_ID == LINE.XERO_ACCOUNT_ID });
            var BILL = $scope.P2P_CREATE_BUDGET_BILL_LIST.filter(function (x) { return x.ACCOUNT_ID == LINE.XERO_ACCOUNT_ID });
            if (PO.length > 0 && BILL.length > 0) {
                LINE.CONSUMED_AMOUNT = PO[0].PO_APPROVED + BILL[0].INVOICE_APPROVED;
                LINE.INAPPROVAL_AMOUNT = PO[0].PO_PENDING + BILL[0].INVOICE_PENDING;
            }
            else if (PO.length > 0) {
                LINE.CONSUMED_AMOUNT = PO[0].PO_APPROVED;
                LINE.INAPPROVAL_AMOUNT = PO[0].PO_PENDING;
            }
            else if (BILL.length > 0) {
                LINE.CONSUMED_AMOUNT = BILL[0].INVOICE_APPROVED;
                LINE.INAPPROVAL_AMOUNT = BILL[0].INVOICE_PENDING;
            }
        }
    }
    $scope.TextReturn = function (NAME) {
        let F = ""; let M = ""; let L = "";
        if (NAME != undefined) {
            let NM = NAME.split(' ');
            if (NM.length == 1) {
                F = NM[0].charAt(0);
            }

            if (NM.length > 1) {
                F = NM[0].charAt(0);
                M = NM[1].charAt(0);
            }
            if (NM.length > 2) {
                L = NM[2].charAt(0);
            }
        }
        return F + '' + (L != "" ? L : M);
    }

    $scope.emptyFilter = function (quotation) {
        return quotation.CONTACT_NAME == undefined || quotation.CONTACT_NAME == null || quotation.CONTACT_NAME == "" ? false : true;
    };

    $scope.RESET_PR_RE = function () { }
    $scope.READ_MORE = function (PRL, FLAG) {
        if (FLAG == 1) {
            $scope.LIMIT_TO = PRL.DESCRIPTION.length;
        }
        if (FLAG == 2) {
            $scope.LIMIT_TO = 500;
        }
    }
    $scope.READ_MORE_COMMENTS = function (PRL, FLAG) {
        if (FLAG == 1) {
            $scope.COMMENTS_LIMIT_TO = PRL.COMMENTS.length;
        }
        else if (FLAG == 2) {
            $scope.COMMENTS_LIMIT_TO = 500;
        }
    }
    $scope.READ_MORE_FY = function (PRL, FLAG, LABEL_NAME) {
        var LIMIT_TO = 500;
        if (LABEL_NAME == undefined) {
            if (FLAG == 1) {
                PRL.DESCRIPTION_LIMIT_TO = PRL.DESCRIPTION.length;
            }
            else if (FLAG == 2) {
                PRL.DESCRIPTION_LIMIT_TO = $scope.LIMIT_TO;
            }
        }
        if (LABEL_NAME == "NOT_FOR_APPROVER") {
            if (FLAG == 1) {
                $scope.REQ_PROC_Search.NOTE_FOR_APPROVERS_LIMIT_TO = PRL.NOTE_FOR_APPROVERS.length;
            }
            else if (FLAG == 2) {
                $scope.REQ_PROC_Search.NOTE_FOR_APPROVERS_LIMIT_TO = LIMIT_TO;
            }
        }
        if (LABEL_NAME == "DELIVERY_INSTRUCTIONS") {
            if (FLAG == 1) {
                $scope.REQ_PROC_Search.DELIVERY_INSTRUCTIONS_LIMIT_TO = PRL.DELIVERY_INSTRUCTIONS.length;
            }
            else if (FLAG == 2) {
                $scope.REQ_PROC_Search.DELIVERY_INSTRUCTIONS_LIMIT_TO = LIMIT_TO;
            }
        }
    }
    $scope.RESET_REQ = function () {
        $scope.REQ_Search.PO_DATE = $filter('date')(new Date());
        $scope.REQ_Search.DELIVERY_DATE = "";
        $scope.REQ_Search.ADVANCE = "";
        $scope.REQ_Search.SPLIT_TYPE_ID = null;
        $scope.$parent.selectedsupplier = 0;
        $scope.REQ_Search.REFERENCE = "";
        $scope.REQ_Search.NOTE_FOR_APPROVERS = "";
        $scope.REQ_Search.TAX_TYPE = "";
        $scope.REQ_Search.DELIVERY_ADDRESS = "";
        $scope.REQ_Search.ATTENTION = "";
        $scope.REQ_Search.PHONE = "";
        $scope.REQ_Search.DELIVERY_INSTRUCTIONS = "";
        $scope.REQ_Search.AUTO_EMAIL_TO_SUPPLIER = "";
        $scope.REQ_Search.UploadedFiles = [];
        $scope.REQ_Search.SUPPLIER_NAME = "";
        $scope.REQ_Search.SELECT_CURRENCY = {};
        $scope.REQ_Search.DEFAULT_CURRENCY = {};
        $scope.REQ_Search.TAX_TYPE = 1;
        $scope.REM_AMOUNT_LEFT = 0;
        $scope.REQ_Search.PROJECT_MASTER_ID = null;
        $scope.REQ_Search.SELECTED_SUPPLIER_ID = null;
        $scope.QUOTATION_LIST = [];
        $scope.TERMS_AND_CONDITIONS_MASTER_LIST = [];
    };
    $scope.RESET_CREATE_REQ = function () {
        $scope.Create_REQ_Search.PO_DATE = $filter('date')(new Date());
        $scope.Create_REQ_Search.DELIVERY_DATE = "";
        $scope.Create_REQ_Search.REFERENCE = "";
        $scope.Create_REQ_Search.NOTE_FOR_APPROVERS = "";
        $scope.Create_REQ_Search.TAX_TYPE = "";
        $scope.Create_REQ_Search.DELIVERY_ADDRESS = "";
        $scope.Create_REQ_Search.ATTENTION = "";
        $scope.Create_REQ_Search.PHONE = "";
        $scope.Create_REQ_Search.DELIVERY_INSTRUCTIONS = "";
        $scope.Create_REQ_Search.AUTO_EMAIL_TO_SUPPLIER = "";
        $scope.Create_REQ_Search.UploadedFiles = [];
        $scope.Create_REQ_Search.SUPPLIER_NAME = "";
        $scope.Create_REQ_Search.SELECT_CURRENCY = {};
        $scope.Create_REQ_Search.DEFAULT_CURRENCY = {};
        $scope.Create_REQ_Search.TAX_TYPE = 1;
        $scope.Create_REQ_Search.PROJECT_MASTER_ID = null;
        $scope.Create_REQ_Search.AUTO_EMAIL_TO_SUPPLIER = true;

        $scope.CREATE_ITEM_LIST = [];
        $scope.P2P_CREATE_BUDGET_MASTER_LIST = [];
        $scope.CREATE_REQ_FORM.submitted = false;
        $scope.$parent.COMMON_CODE_CHANGE();
    };
    $scope.numbersonly = function (e, value) {
        value = '';
        if (e != undefined) {
            if (isNaN(e.key) && e.key !== '.' && e.key !== ',' && e.key !== '(' && e.key !== ')' && e.key !== '+' && e.key !== '-') e.preventDefault();
        }
    }

    $scope.TAB_CLICK_REQ_FY = function (FLAG) {
        if ($scope.TAB_FLAG == 4) {
            /// dont remove
            //var message = true;
            //if ($scope.Create_REQ_Search.PO_HDR_ID > 0) {
            //    message = confirm('Do you want to discard changes?');
            //}
            //if (message) {
            //    $scope.TAB_FLAG = FLAG;
            //    $scope.Create_REQ_Search.PO_HDR_ID = null;
            //    $scope.RESET_CREATE_REQ();
            //    $scope.GET_BRANCH_LIST();
            //}
            $scope.TAB_FLAG = FLAG;
            if (FLAG == 1) {
                $scope.GET_PURCHASE_REQUESTS_BY_BUYER(1);
            }
            else if (FLAG == 2) {
                $scope.GET_PURCHASE_REQUESTS_BY_BUYER_PROCESSED(1);
            }
            else if (FLAG == 4) {
                $scope.Create_REQ_Search.PO_HDR_ID = null;
                $scope.RESET_CREATE_REQ();
                $scope.GET_BRANCH_LIST();
            }
        }
        else {
            $scope.TAB_FLAG = FLAG;
            if (FLAG == 1) {
                $scope.GET_PURCHASE_REQUESTS_BY_BUYER(1);
            }
            else if (FLAG == 2) {
                $scope.GET_PURCHASE_REQUESTS_BY_BUYER_PROCESSED(1);
            }
            else if (FLAG == 4) {
                $scope.Create_REQ_Search.PO_HDR_ID = null;
                $scope.RESET_CREATE_REQ();
                $scope.GET_BRANCH_LIST();
            }
        }
    }
    $scope.TAB_CLICK_REQ_FY(1);

    $scope.PURCHASE_REQUEST_CLICK = function (REQUEST_LINE, FLAG) {
        $scope.$parent.overlay_loadingNew = 'block';
        var IS_CHANGE = false;
        if ($scope.CHANGE_FLAG == 1) {
            IS_CHANGE = confirm('Do you want to discard changes?');
        }
        if (IS_CHANGE || $scope.CHANGE_FLAG == 0) {
            $scope.ITEM_LIST = [];
            $scope.MONTH_LIST = [];
            $scope.PO_SPLIT_LIST = [];
            $scope.DELETE_MONTH_LIST = []
            $scope.RESET_REQ();
            $scope.REQ_Search.REQUEST_LINE = {};
            $scope.REQ_Search.UploadedFiles = [];
            $scope.P2P_BUDGET_MASTER_LIST = [];
            $scope.GET_PYMNT_SUPPLIER(REQUEST_LINE, FLAG);
            $scope.REQ_Search.REQUEST_LINE = REQUEST_LINE;
            $scope.GET_P2P_ITEMS(REQUEST_LINE, FLAG);
            $scope.remaningitemdetail = [];
            REQUEST_LINE.BUYER_ID == null ? $scope.REQ_Search.REQUEST_LINE.SHOW_REQUEST_DTLS = true : "";
            if (REQUEST_LINE.PO_HDR_ID != null) {
                $scope.$parent.GET_UPLOADS($scope.REQ_Search, 32, REQUEST_LINE.PO_HDR_ID);
                $scope.$parent.GET_UPLOADS($scope.REQ_Search.REQUEST_LINE, 31, REQUEST_LINE.REQUEST_ID); //requestor files  
                $scope.GET_XERO_ACCOUNT_CODES(REQUEST_LINE, FLAG)
                $scope.GET_PURCHASE_REQUEST_BY_ID(REQUEST_LINE);
            }
            else {
                //$scope.GET_PURCHASE_REQUEST_BY_ID(REQUEST_LINE, FLAG);
                $scope.GET_XERO_ACCOUNT_CODES(REQUEST_LINE, FLAG)
                $scope.$parent.GET_UPLOADS($scope.REQ_Search.REQUEST_LINE, 31, REQUEST_LINE.REQUEST_ID); //1 remove table id to move other 
            }
            //$scope.GET_XERO_ACCOUNT_CODES(REQUEST_LINE, FLAG)
            $scope.GET_XERO_BRANDING_THEMES(REQUEST_LINE, FLAG);
            $scope.GET_PROJECT_MASTER(REQUEST_LINE, FLAG);
            $scope.GET_P2P_DELIVERY_ADDRESS(REQUEST_LINE);
            $scope.GET_TERMS_AND_CONDITIONS_MASTER(REQUEST_LINE);

            $scope.POForm.submitted = false;
            $scope.$parent.GET_SCROLL_TOP();
        }
    }
    $scope.PURCHASE_PROCESSED_CLICK = function (PROCESSED_LINE, FLAG) {
        $scope.SHOW_REQ_BUDGET = false;
        $scope.BUDGET_TEXT_VALIDATION = "Fetching Budget...";
        $scope.REQ_PROC_Search.PROCESSED_LINE = PROCESSED_LINE;
        $scope.REQ_PROC_Search.UploadedFiles = [];
        $scope.PROC_QUOTATION_LIST = [];
        $scope.remaningitemdetail = [];
        $scope.MONTH_LIST = [];
        $scope.ITEM_LIST = [];
        $scope.PO_SPLIT_LIST = [];
        //$scope.P2P_PROCESS_BUDGET_MASTER_LIST = [];
        $scope.$parent.GET_UPLOADS($scope.REQ_PROC_Search, 32, PROCESSED_LINE.PO_HDR_ID);
        $scope.GET_APPROVAL_CUSTOM_FIELD_OPTIONS_MASTER(PROCESSED_LINE, FLAG);
        $scope.GET_APPROVAL_HEADERS_CHAIN(PROCESSED_LINE, FLAG)
        $scope.GET_P2P_BUDGET_SNAPSHOT(PROCESSED_LINE, $scope.REQ_PROC_Search);
        $scope.$parent.GET_SCROLL_TOP();
    }


    $scope.SetQValues = function (Supplier, index) {
        $('.AddCustomScroll_Contact').find('.dropdown-menu').addClass('custom-scrollbar');
    }
    $scope.SetQuotationValues = function (Supplier, index) {
        var List = $scope.SUPPLIER_LIST.filter(function (x) { return x.SUPPLIER_NAME == Supplier.CONTACT_NAME });
        Supplier.INVALID = false;
        if (List.length == 0) {
            Supplier.INVALID = true;
        }
        else {
            if ($scope.$parent.selectedsupplier == index) {
                $scope.CHANGE_CONTACT_NAME_Fn(Supplier, List, 1);
            } else {
                Supplier.XERO_CONTACT_ID = List[0].ID;
            };
        };
    }
    $scope.SetContactValues = function (Supplier, _bind_flag) {
        var List = $scope.SUPPLIER_LIST.filter(function (x) { return x.SUPPLIER_NAME == $scope.REQ_Search.SUPPLIER_NAME });
        $scope.SELECT_SUPPLIER_LIST = [];
        if (List.length > 0) {
            $scope.SELECT_SUPPLIER_LIST = List
            Supplier.XERO_CONTACT_ID = List[0].ID;
            if (_bind_flag == 1) {
                $scope.REQ_Search.SELECTED_SUPPLIER_ID = List[0].ID;
                $scope.REQ_Search.SUPPLIER_EMAIL = List[0].EMAILADDRESS;
            }

            // var QList = $scope.QUOTATION_LIST.filter(function (x) { return x.CONTACT_NAME == $scope.REQ_Search.SUPPLIER_NAME });
            //if (QList.length == 0) {
            //    if ($scope.QUOTATION_LIST.length == 1) {
            //        $scope.QUOTATION_LIST.splice(0, 1);
            //    }
            //    var BLANL_QUOTATION_LIST = { CONTACT_NAME: List[0].SUPPLIER_NAME, TABLE_ID: null, XERO_CONTACT_ID: List[0].ID, TOTAL_AMOUNT: "", COMMENTS: null, UPLOADS_ID: null, DELETE_FLAG: null, UploadedFiles: [], SUPPLIER_ID: List[0].ID };
            //    $scope.QUOTATION_LIST.push(angular.copy(BLANL_QUOTATION_LIST));
            //    $scope.REQ_Search.SELECTED_SUPPLIER_ID = List[0].ID;
            //    $scope.REQ_Search.SUPPLIER_EMAIL = List[0].EMAILADDRESS;
            //}
            //else {
            //    Supplier.XERO_CONTACT_ID = List
            //}
        }
    }
    $scope.SetCreateContactValues = function (Supplier) {
        var List = $scope.SUPPLIER_LIST.filter(function (x) { return x.SUPPLIER_NAME == $scope.Create_REQ_Search.SUPPLIER_NAME });
        $scope.SELECT_EDIT_SUPPLIER_LIST = [];
        if (List.length > 0) {
            $scope.SELECT_EDIT_SUPPLIER_LIST = List;
            var QList = $scope.CREATE_QUOTATION_LIST.filter(function (x) { return x.CONTACT_NAME == $scope.Create_REQ_Search.SUPPLIER_NAME });
            if (QList.length == 0) {
                if ($scope.CREATE_QUOTATION_LIST.length == 1) {
                    $scope.CREATE_QUOTATION_LIST.splice(0, 1);
                }
                var BLANL_QUOTATION_LIST = { CONTACT_NAME: List[0].SUPPLIER_NAME, TABLE_ID: null, XERO_CONTACT_ID: List[0].ID, TOTAL_AMOUNT: "", COMMENTS: null, UPLOADS_ID: null, DELETE_FLAG: null, UploadedFiles: [], SUPPLIER_ID: List[0].ID };
                $scope.CREATE_QUOTATION_LIST.push(angular.copy(BLANL_QUOTATION_LIST));
                $scope.Create_REQ_Search.SELECTED_SUPPLIER_ID = List[0].ID;
                $scope.Create_REQ_Search.SUPPLIER_EMAIL = List[0].EMAILADDRESS;
            }
        }
    }
    $scope.SetAccountValues = function () {
        $('.AddCustomScroll_Account').find('.dropdown-menu').addClass('w-30 custom-scrollbar');
    }
    $scope.SetitemValues = function (FLAG) {
        if (FLAG == 'REQ') {
            $('.AddCustomScroll_itemREQ').find('.dropdown-menu').addClass('w-30 custom-scrollbar');
        }
        if (FLAG == 'CREATE_REQ') {
            $('.AddCustomScroll_itemCREATE_REQ').find('.dropdown-menu').addClass('w-30 custom-scrollbar');
        }
    }

    $scope.CHANGE_PROJECT_Fn = function (FLAG) {
        if (FLAG == 1) {
            $scope.REQ_Search.REQUEST_LINE.PROJECT_MASTER_ID = $scope.REQ_Search.PROJECT_MASTER_ID;
            $scope.GET_XERO_ACCOUNT_CODES($scope.REQ_Search.REQUEST_LINE, FLAG, 'PROJECT');
        }
        if (FLAG == 3) {
            ///$scope.REQ_Search.REQUEST_LINE.PROJECT_MASTER_ID = $scope.REQ_Search.PROJECT_MASTER_ID;
            $scope.GET_XERO_ACCOUNT_CODES($scope.Create_REQ_Search, FLAG, 'PROJECT');
        }
    }
    $scope.ChangeBudget = function (text, FLAG) {
        //FLAG, LINE, HEADER, CHANGE_FLAG
        if (FLAG == 1) {
            $scope.BUDGET_TEXT_VALIDATION = "Fetching Budget...";
            $scope.GET_P2P_BUDGET_BY_ACCOUNTS(FLAG, $scope.REQ_Search.REQUEST_LINE, $scope.REQ_Search);
            $scope.ITEM_LIST_VALID(1);
            $scope.Fn_SPLIT_REQ($scope.REQ_Search);
        }
        //else if (FLAG == 2) {
        //    $scope.GET_P2P_BUDGET_BY_ACCOUNTS(FLAG, $scope.REQ_Search.REQUEST_LINE, $scope.REQ_Search);
        //    $scope.ITEM_LIST_VALID(2);
        //}
        //else if (FLAG == 3) {
        //    $scope.GET_P2P_BUDGET_BY_ACCOUNTS(FLAG, $scope.REQ_Search.REQUEST_LINE, $scope.REQ_Search);
        //    $scope.ITEM_LIST_VALID(3);
        //}
    }
    $scope.ChangeCreateBudget = function (text, FLAG) {
        $scope.GET_P2P_BUDGET_BY_ACCOUNTS(FLAG, $scope.REQ_Search.REQUEST_LINE, $scope.REQ_Search);
        $scope.ITEM_LIST_VALID(3);
        //if (FLAG == 'PROJECT') {
        //    $scope.P2P_CREATE_BUDGET_MASTER_LIST = [];
        //    $scope.GET_XERO_ACCOUNT_CODES($scope.Create_REQ_Search, 3, "PROJECT");
        //}
        //else {
        //    $scope.ITEM_LIST_VALID(3)
        //    //if ($scope.Create_REQ_Search.PO_DATE != undefined && $scope.Create_REQ_Search.PO_DATE != "" && $scope.Create_REQ_Search.PO_DATE != null && $scope.Create_REQ_Search.PROJECT_MASTER_ID != undefined && $scope.Create_REQ_Search.PROJECT_MASTER_ID != null && $scope.Create_REQ_Search.PROJECT_MASTER_ID != "") {
        //    //    $scope.GET_P2P_BUDGET_BY_ACCOUNTS(3, $scope.Create_REQ_Search, $scope.Create_REQ_Search);
        //    //}
        //}
    }
    $scope.CHANGE_CURRENCY = function () {
        if ($scope.REQ_Search.BASE_CURRENCY_ID == $scope.REQ_Search.PO_CURRENCY_ID) {
            $scope.REQ_Search.BASE_TO_PO_CONVERSION_RATE = 1;
            $scope.REQ_Search.COPY_BASE_TO_PO_CONVERSION_RATE = angular.copy(1);
        }
        else {
            $scope.GET_CONVERSION_RATE(1);
        }

    }
    $scope.CHANGE_CREATE_CURRENCY = function () {
        if ($scope.Create_REQ_Search.BASE_CURRENCY_ID == $scope.Create_REQ_Search.PO_CURRENCY_ID) {
            $scope.Create_REQ_Search.BASE_TO_PO_CONVERSION_RATE = 1;
            $scope.Create_REQ_Search.COPY_BASE_TO_PO_CONVERSION_RATE = angular.copy(1);
        }
        else {
            $scope.GET_CONVERSION_RATE(2);
        }
    }

    $scope.CHANGE_CONTACT_NAME_Fn = function (_pram_Q_LINE, List, FLAG, index) {
        if (_pram_Q_LINE.CONTACT_NAME == undefined || _pram_Q_LINE.CONTACT_NAME == "" || _pram_Q_LINE.CONTACT_NAME.length == 0) {
            $scope.REQ_Search.SUPPLIER_NAME = "";
        }
        else if (_pram_Q_LINE.CONTACT_NAME.length == 0) {
            $scope.REQ_Search.SUPPLIER_NAME = _pram_Q_LINE.SUPPLIER_NAME;
            $scope.REQ_Search.SELECTED_SUPPLIER_ID = List[0].ID;
        } else if (_pram_Q_LINE.CONTACT_NAME.length > 0) {
            $scope.REQ_Search.SUPPLIER_NAME = _pram_Q_LINE.CONTACT_NAME;
            $scope.REQ_Search.SELECTED_SUPPLIER_ID = _pram_Q_LINE.XERO_CONTACT_ID;
            if (_pram_Q_LINE.XERO_CONTACT_ID == null || _pram_Q_LINE.XERO_CONTACT_ID == "" || _pram_Q_LINE.XERO_CONTACT_ID == undefined) {
                $scope.SetContactValues(_pram_Q_LINE, 0);
            }
        };
        $scope.SELECT_SUPPLIER_LIST = [];
        if (FLAG == 1) {
            $scope.$parent.selectedsupplier = _pram_Q_LINE.INDEX_VALUE;
            $scope.SetContactValues(_pram_Q_LINE, 1);
        }
    }
    $scope.ChangeBudgetREQfy = function () {
        if ($scope.REQ_Search.PO_DATE != undefined && $scope.REQ_Search.PO_DATE != "" &&
            $scope.REQ_Search.PO_DATE != null) {
            $scope.BUDGET_TEXT_VALIDATION = "Fetching Budget...";
            $scope.P2P_BUDGET_MASTER_LIST = [];
            $scope.REQ_Search.BRANCH_ID = $scope.REQ_Search.REQUEST_LINE.BRANCH_ID;
            $scope.GET_P2P_BUDGET_BY_ACCOUNTS(1, $scope.REQ_Search.REQUEST_LINE, $scope.REQ_Search);
        }
        else {
            //$scope.$parent.ShowAlert("Error", "PO date and account  is require to refresh budget", 2000)
            $scope.BUDGET_TEXT_VALIDATION = "Please Select Account to Show Budget";
        }
    }
    $scope.ChangeBudgetCreatfy = function () {
        //if ($scope.Create_REQ_Search.PO_DATE != undefined && $scope.Create_REQ_Search.PO_DATE != "" && $scope.Create_REQ_Search.PO_DATE != null) {
        //    $scope.GET_P2P_BUDGET_BY_ACCOUNTS(3, $scope.Create_REQ_Search, $scope.Create_REQ_Search);
        //}
        //else {
        //    $scope.$parent.ShowAlert("Error", "Please provide valid PO Date", 2000);
        //}
        if ($scope.Create_REQ_Search.PO_DATE != undefined && $scope.Create_REQ_Search.PO_DATE != "" &&
            $scope.Create_REQ_Search.PO_DATE != null) {
            $scope.BUDGET_TEXT_VALIDATION = "Fetching Budget...";
            $scope.P2P2P_CREATE_BUDGET_MASTER_LIST = [];
            $scope.GET_P2P_BUDGET_BY_ACCOUNTS(1, $scope.Create_REQ_Search, $scope.Create_REQ_Search);
        }
        else {
            $scope.BUDGET_TEXT_VALIDATION = "Please Select Account to Show Budget";
        }


    }
    $scope.ChangeQAmt = function (LINE, FLAG) {
        $scope.GET_DENSE_RANK();
    }
    $scope.SHOW_HIDE_BUDGET = function (REQ_Search) {
        REQ_Search.HIDE_SHOW = !REQ_Search.HIDE_SHOW;
    }

    $scope.CLICK_DELIVERY_ADDRESS = function (LINE) {
        if ($scope.TAB_FLAG == 1) {
            $scope.REQ_Search.DELIVERY_ADDRESS = LINE.DELIVERY_ADDRESS;
            if (LINE.PHONE != null && LINE.PHONE != "") {
                $scope.REQ_Search.PHONE = LINE.PHONE;
            }
            if (LINE.ATTENTION != null && LINE.ATTENTION != "") {
                $scope.REQ_Search.ATTENTION = LINE.ATTENTION;
            }
        }
        if ($scope.TAB_FLAG == 4) {
            $scope.Create_REQ_Search.DELIVERY_ADDRESS = LINE.DELIVERY_ADDRESS;
            if (LINE.PHONE != null && LINE.PHONE != "") {
                $scope.Create_REQ_Search.PHONE = LINE.PHONE;
            }
            if (LINE.ATTENTION != null && LINE.ATTENTION != "") {
                $scope.Create_REQ_Search.ATTENTION = LINE.ATTENTION;
            }
        }
    }
    $scope.CLICK_TERMS_CONDITIONS = function (LINE) {
        LINE.IS_CHECK_TMC = LINE.IS_CHECK_TMC ? LINE.IS_CHECK_TMC = false : LINE.IS_CHECK_TMC = true;
    }
    $scope.CLICK_TERMS_CONDITIONS_RESET = function () {
        //$scope.Section_Week_Search.FILTER_BRANCH_ID = '';
        //$scope.Section_Week_Search.BRANCHALL = false;
        //$scope.Section_Week_Search.DDL_BRANCH_TEXT = "-Branch-";
        angular.forEach($scope.P2P_TERMS_AND_CONDITIONS_LIST, function (item) {
            item.IS_CHECK_TMC = false;
        });

    }
    $scope.CLICK_TERMS_CONDITIONS_APPLY = function (FLAG) {
        angular.forEach($scope.P2P_TERMS_AND_CONDITIONS_LIST, function (item) {
            if (item.IS_CHECK_TMC) {
                if ($scope.TERMS_AND_CONDITIONS_MASTER_LIST.length > 0) {
                    var SORT_ORDER = $scope.TERMS_AND_CONDITIONS_MASTER_LIST[$scope.TERMS_AND_CONDITIONS_MASTER_LIST.length - 1].SORT_ORDER;
                    $scope.BLANK_TERM_CONT.SORT_ORDER = SORT_ORDER + 1;
                    $scope.BLANK_TERM_CONT.TEXT = item.TEXT;
                } else {
                    $scope.BLANK_TERM_CONT.SORT_ORDER = 1;
                    $scope.BLANK_TERM_CONT.TEXT = item.TEXT;
                };
                item.IS_CHECK_TMC = false;
                if ($scope.TAB_FLAG == 1) {
                    $scope.TERMS_AND_CONDITIONS_MASTER_LIST.push(angular.copy($scope.BLANK_TERM_CONT));
                }
                if ($scope.TAB_FLAG == 4) {
                    $scope.CREATE_TERMS_AND_CONDITIONS_MASTER_LIST.push(angular.copy($scope.BLANK_TERM_CONT));
                }
            }
        });
        $('#AddTANDC').modal('hide');
    };

    $scope.Fn_CHANGE_SPLIT = function () {
        $scope.Fn_SPLIT_REQ($scope.REQ_Search, 2);
    }
    $scope.Fn_CHANGE_TAX_TYPE = function () {
        $scope.Fn_SPLIT_REQ($scope.REQ_Search, 2);
    }
    $scope.Fn_CANCEL_SPLIT = function () {
        $scope.REM_AMOUNT_LEFT = 0;
        if ($scope.MONTH_LIST.length > 0) {
            angular.forEach($scope.MONTH_LIST, function (_m) {
                $scope.DELETE_MONTH_LIST = $scope.DELETE_MONTH_LIST.concat(angular.copy(_m.ITEM_LIST));
            });
        }
        $scope.MONTH_LIST = [];
        $scope.PO_SPLIT_LIST = [];
        $scope.REQ_Search.SPLIT_TYPE_ID = null;
    }
    $scope.Fn_SPLIT_REQ = function (LINE, FLAG) {
        if (FLAG == 1) {
            LINE.SPLIT_TYPE_ID = 1;
        }
        if (LINE.SPLIT_TYPE_ID > 0) {
            var Newdate = new Date('01/01/2010');
            var SELECT_YEAR = angular.copy(new Date(LINE.PO_DATE)).getFullYear();
            var DATE = new Date(new Date(Newdate).setFullYear(SELECT_YEAR));
            var MouthStart = new Date(LINE.PO_DATE).getMonth();
            var MonthEnd = MouthStart + LINE.SPLIT_TYPE_ID;
            LINE.START_DATE = new Date(DATE);
            LINE.END_DATE = new Date(new Date(new Date(DATE).setMonth(11)).setDate(31));
            $scope.MONTH_LIST = [];
            if ($scope.MONTH_LIST != undefined && $scope.MONTH_LIST.length > 0) {
                angular.forEach($scope.MONTH_LIST, function (_m) {
                    var _itemlist = $scope.TAB_FLAG == 1 ? angular.copy($scope.ITEM_LIST) : angular.copy($scope.PRO_ITEM_LIST);
                    if (_m.ITEM_LIST.length != _itemlist) {
                        angular.forEach(_itemlist, function (_val_loop_item, index) {
                            _val_loop_item.ITEM_INDEX = index;
                            var _item_result = _m.ITEM_LIST.filter(function (_val_item) { return _val_item.LINE_NO == _val_loop_item.LINE_NO });
                            if (_item_result.length == 0) {
                                _m.ITEM_LIST.push(_val_loop_item);
                            }
                        });
                    }
                });
            }
            else {
                $scope.MONTH_LIST = [];
                var count = MouthStart;
                for (var i = MouthStart; i <= MonthEnd; i++) {
                    var ReadOnly = new Object();
                    ReadOnly.MONTH = i;
                    ReadOnly.START_DATE = MouthStart == i ? new Date(LINE.PO_DATE) : new Date(DATE).setMonth(i);
                    ReadOnly.ITEM_LIST = $scope.TAB_FLAG == 1 ? angular.copy($scope.ITEM_LIST) : angular.copy($scope.PRO_ITEM_LIST);
                    angular.forEach(ReadOnly.ITEM_LIST, function (_val_item, index) {
                        _val_item.ITEM_INDEX = index;
                        var _split_result = $scope.PO_SPLIT_LIST.filter(function (_val_split) { return _val_split.PO_LINE_ID == _val_item.PO_LINE_ID && new Date(ReadOnly.START_DATE).getMonth() == new Date(_val_split.PO_DATE).getMonth() && new Date(ReadOnly.START_DATE).getFullYear() == new Date(_val_split.PO_DATE).getFullYear() });
                        if (_split_result.length > 0) {
                            _val_item.BUDGET = $scope.SETTING_USE_GROSS == 1 ? parseFloat(_split_result[0].GROSS_AMOUNT).toFixed(2) : parseFloat(_split_result[0].NET_AMOUNT).toFixed(2);
                            _val_item.REQ_SPLIT_LIST = _split_result[0];
                            _val_item.SPLIT_TABLE_ID = _split_result[0].TABLE_ID;
                            _val_item.PO_SPLIT_ACCOUNT_ID = _val_item.ACCOUNT_ID;//_split_result[0].ACCOUNT_ID;
                            // After draft come again that why=>_val_item.ACCOUNT_ID;
                        }
                        else {
                            taxAmount = LINE.TAX_TYPE == 3 ? 0.00 : (LINE.TAX_TYPE == 2 ? ((((_val_item.UNIT_PRICE * _val_item.QUANTITY) / (1 + (_val_item.TAX_ID == undefined ? 0 : _val_item.TAX_ID.RATE / 100))) - (((_val_item.UNIT_PRICE * _val_item.QUANTITY) / (1 + (_val_item.TAX_ID == undefined ? 0 : _val_item.TAX_ID.RATE / 100))) * (_val_item.DISCOUNT_PERCENT / 100))) * (_val_item.TAX_ID == undefined ? 0 : _val_item.TAX_ID.RATE / 100)) : (((_val_item.UNIT_PRICE * _val_item.QUANTITY) - ((_val_item.UNIT_PRICE * _val_item.QUANTITY) * (_val_item.DISCOUNT_PERCENT / 100))) * (_val_item.TAX_ID == undefined ? 0 : _val_item.TAX_ID.RATE / 100)));
                            amount = ((_val_item.QUANTITY * 1 * _val_item.UNIT_PRICE * 1) - (_val_item.QUANTITY * 1 * _val_item.UNIT_PRICE * 1 * (_val_item.DISCOUNT_PERCENT) / 100))
                            if ($scope.PO_SPLIT_LIST.length > 0) {
                                _val_item.BUDGET = _val_item.PO_LINE_ID > 0 ? 0 : parseFloat($scope.SETTING_USE_GROSS == 1 ? (amount + (LINE.TAX_TYPE == 2 ? 0 : taxAmount)) / (LINE.SPLIT_TYPE_ID + 1) : LINE.TAX_TYPE == 2 ? parseFloat((amount - taxAmount) / (LINE.SPLIT_TYPE_ID + 1)).toFixed(2) : parseFloat(amount / (LINE.SPLIT_TYPE_ID + 1))).toFixed(2);
                                _val_item.PO_SPLIT_ACCOUNT_ID = _val_item.ACCOUNT_ID;
                            }
                            else {
                                _val_item.BUDGET = parseFloat($scope.SETTING_USE_GROSS == 1 ? (amount + (LINE.TAX_TYPE == 2 ? 0 : taxAmount)) / (LINE.SPLIT_TYPE_ID + 1) : LINE.TAX_TYPE == 2 ? parseFloat((amount - taxAmount) / (LINE.SPLIT_TYPE_ID + 1)).toFixed(2) : parseFloat(amount / (LINE.SPLIT_TYPE_ID + 1))).toFixed(2);
                                _val_item.PO_SPLIT_ACCOUNT_ID = _val_item.ACCOUNT_ID;
                            }
                        }
                    });
                    $scope.MONTH_LIST.push(ReadOnly);
                }
            }
        }
        else {
            $scope.MONTH_LIST = [];
        }

    }
    $scope.Fn_CHANGET_UNIT_PRIZE = function () {
        $scope.Fn_SPLIT_REQ($scope.REQ_Search, 2);
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
    $scope.Fn_RETURN_CURRENT_PROCESS_AMT = function (BD, LINE) {
        BD.CURRENT_AMOUNT = 0;
        var itemdetail = [];
        angular.forEach($scope.MONTH_LIST, function (_m) {
            angular.forEach(_m.ITEM_LIST, function (_val_item) {
                if (_val_item.ACCOUNT_ID == BD.ACCOUNT_ID && new Date(LINE.PO_DATE).getMonth() == new Date(_m.START_DATE).getMonth() && new Date(LINE.PO_DATE).getFullYear() == new Date(_m.START_DATE).getFullYear()) {
                    if (_val_item.BUDGET != undefined && _val_item.BUDGET != "" && _val_item.BUDGET != null) {
                        BD.CURRENT_AMOUNT = parseFloat(BD.CURRENT_AMOUNT) + parseFloat(_val_item.BUDGET);
                        //CurrentAmount = CurrentAmount / $scope.REQ_PROC_Search.BASE_TO_PO_CONVERSION_RATE;
                    }
                }
                if (_m.FLAG == 1) {
                    itemdetail.push(_val_item);
                }
            });
        });
    }
    $scope.Fn_ADJUSTMENT_BUDGET = function (_m, _pram_item, index, itemlast) {
        if (_m.FLAG == 1 && itemlast == true && $scope.PO_SPLIT_LIST.length == 0) {
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
    $scope.ADD_REQUESTER_ATTACHMENT = function () { }
    $scope.ADD_MORE_ITEM = function () {
        //$scope.BLANK_ITEM.XERO_TRACKING_CATEGORIES = angular.copy($scope.XERO_TRACKING_CATEGORIES);
        $scope.ITEM_LIST.push(angular.copy($scope.BLANK_ITEM));
        $('.AddCustomScroll_Account').find('.dropdown-menu').addClass('custom-scrollbar');
        if ($scope.REQ_Search.SPLIT_TYPE_ID > 0) {
            $scope.Fn_SPLIT_REQ($scope.REQ_Search, 2)
        }
    }
    $scope.ADD_MORE_ITEM_CREATE = function () {
        $scope.CREATE_ITEM_LIST.push(angular.copy($scope.BLANK_ITEM));
    }

    $scope.ADD_MORE_TERM_CON = function () {
        if ($scope.TERMS_AND_CONDITIONS_MASTER_LIST.length > 0) {
            var SORT_ORDER = $scope.TERMS_AND_CONDITIONS_MASTER_LIST[$scope.TERMS_AND_CONDITIONS_MASTER_LIST.length - 1].SORT_ORDER;
            $scope.BLANK_TERM_CONT.SORT_ORDER = SORT_ORDER + 1;
        } else {
            $scope.BLANK_TERM_CONT.SORT_ORDER = 1;
        };
        $scope.TERMS_AND_CONDITIONS_MASTER_LIST.push(angular.copy($scope.BLANK_TERM_CONT));
        $('.AddCustomScroll_Account').find('.dropdown-menu').addClass('custom-scrollbar');
    }
    $scope.ADD_MORE_CREATE_TERM_CON = function () {
        if ($scope.CREATE_TERMS_AND_CONDITIONS_MASTER_LIST.length > 0) {
            var SORT_ORDER = $scope.CREATE_TERMS_AND_CONDITIONS_MASTER_LIST[$scope.CREATE_TERMS_AND_CONDITIONS_MASTER_LIST.length - 1].SORT_ORDER;
            $scope.BLANK_TERM_CONT.SORT_ORDER = SORT_ORDER + 1;
        } else {
            $scope.BLANK_TERM_CONT.SORT_ORDER = 1;
        };
        $scope.CREATE_TERMS_AND_CONDITIONS_MASTER_LIST.push(angular.copy($scope.BLANK_TERM_CONT));
        $('.AddCustomScroll_Contact').find('.dropdown-menu').addClass('custom-scrollbar');
    }
    $scope.ADD_MORE_QUOTATION = function () {
        $scope.QUOTATION_LIST.push(angular.copy($scope.BLANL_QUOTATION_LIST));
        $('.AddCustomScroll_Contact').find('.dropdown-menu').addClass('custom-scrollbar');
    }
    $scope.ADD_MORE_CREATE_QUOTATION = function () {
        $scope.CREATE_QUOTATION_LIST.push(angular.copy($scope.BLANL_QUOTATION_LIST));
        $('.AddCustomScroll_CREATE_Contact').find('.dropdown-menu').addClass('custom-scrollbar');
    }
    $scope.ADD_ABOVE = function (LINE, index) {
        var SORT_ORDER = angular.copy(LINE.SORT_ORDER);
        angular.forEach($scope.TERMS_AND_CONDITIONS_MASTER_LIST, function (val, valindex) {
            if (SORT_ORDER == val.SORT_ORDER) {
                val.SORT_ORDER = val.SORT_ORDER - 1;
            }
            else if ((SORT_ORDER - 1) == val.SORT_ORDER) {
                val.SORT_ORDER = val.SORT_ORDER + 1;
            }
        })
    }
    $scope.ADD_BELOW = function (LINE, index) {
        var SORT_ORDER = angular.copy(LINE.SORT_ORDER);
        angular.forEach($scope.TERMS_AND_CONDITIONS_MASTER_LIST, function (val, valindex) {
            if (SORT_ORDER == val.SORT_ORDER) {
                val.SORT_ORDER = val.SORT_ORDER + 1;
            }
            else if ((SORT_ORDER + 1) == val.SORT_ORDER) {
                val.SORT_ORDER = val.SORT_ORDER - 1;
            }
        })
    }
    $scope.ADD_ABOVE_CREATE = function (LINE, index) {
        var SORT_ORDER = angular.copy(LINE.SORT_ORDER);
        angular.forEach($scope.CREATE_TERMS_AND_CONDITIONS_MASTER_LIST, function (val, valindex) {
            if (SORT_ORDER == val.SORT_ORDER) {
                val.SORT_ORDER = val.SORT_ORDER - 1;
            }
            else if ((SORT_ORDER - 1) == val.SORT_ORDER) {
                val.SORT_ORDER = val.SORT_ORDER + 1;
            }
        })
    }
    $scope.ADD_BELOW_CREATE = function (LINE, index) {
        var SORT_ORDER = angular.copy(LINE.SORT_ORDER);
        angular.forEach($scope.CREATE_TERMS_AND_CONDITIONS_MASTER_LIST, function (val, valindex) {
            if (SORT_ORDER == val.SORT_ORDER) {
                val.SORT_ORDER = val.SORT_ORDER + 1;
            }
            else if ((SORT_ORDER + 1) == val.SORT_ORDER) {
                val.SORT_ORDER = val.SORT_ORDER - 1;
            }
        })
    }
    $scope.ADD_REQUESTOR_ATTACHMENT_FY = function (LINE) {
        var Modelobj = new Object()
        Modelobj.MULTI_UPLOAD_LIST = [];
        if ($scope.REQ_Search.REQUEST_LINE.UploadedFiles != undefined) {
            angular.forEach($scope.REQ_Search.REQUEST_LINE.UploadedFiles, function (Uploads, index) {
                var readonly = new Object()
                readonly.RELATIVE_ID = index + '' + Uploads.CREATED_BY + '' + Uploads.ID + '' + Uploads.UPLOAD_TYPE_ID;
                readonly.UPLOAD_TYPE_ID = 32;
                readonly.FILE_PATH = Uploads.FILE_PATH;
                readonly.ORIGINAL_FILE_NAME = Uploads.ORIGINAL_FILE_NAME;
                readonly.NEW_FILE_NAME = Uploads.SERVER_FILE_NAME;
                readonly.TABLE_ID = 0;
                readonly.USER_ID = parseInt($cookies.get("USERID"));
                readonly.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
                Modelobj.MULTI_UPLOAD_LIST.push(readonly);
            });

            PrcCommMethods.P2P_API(Modelobj, 'MULTI_UPLOAD', 'PO').then(function (data) {
                if (data.data.Table1.length > 0) {
                    if (LINE.UploadedFiles == undefined) {
                        LINE.UploadedFiles = [];
                    }
                    LINE.UploadedFiles = data.data.Table1;
                }
                if (data.data == 0) {
                    $scope.$parent.ShowAlert("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                }
            });
        };
    }

    $scope.REMOVE_FILTE = function (index, LINE) {
        if (LINE.ID > 0) {
            $scope.$parent.DELETE_UPLOAD_ALL($scope.REQ_Search.UploadedFiles, LINE, index, 1);
        }
        else {
            $scope.REQ_Search.UploadedFiles.splice(index, 1);
        }
    };

    $scope.REMOVE_FILE_QUOTATION = function (index, LINE, Array, INPUT_ID) {
        if (LINE.ID > 0) {
            $scope.$parent.DELETE_UPLOAD_ALL(Array, LINE, index, 2);
            angular.element("input[id='" + INPUT_ID + index + "']").val(null);
        }
        else {
            Array.splice(index, 1);
            angular.element("input[id='" + INPUT_ID + index + "']").val(null);
        }
        $scope.$parent.Files = [];
    };
    $scope.REMOVE_LINE_ITEM = function (index, LINE) {
        if (LINE.PO_LINE_ID == undefined || LINE.PO_LINE_ID == "" || LINE.PO_LINE_ID == null) {
            $scope.ITEM_LIST.splice(index, 1)
        }
        else {
            $scope.DELETE_ITEM_LIST.push(LINE);
            $scope.ITEM_LIST.splice(index, 1)
        }
        if ($scope.MONTH_LIST.length > 0) {
            angular.forEach($scope.MONTH_LIST, function (_m) {
                $scope.DELETE_MONTH_LIST = $scope.DELETE_MONTH_LIST.concat(angular.copy(_m.ITEM_LIST[LINE.ITEM_INDEX]));
                _m.ITEM_LIST.splice(LINE.ITEM_INDEX, 1);
            });
        }
        $scope.ChangeBudget('', 1)
    }
    $scope.REMOVE_LINE_ITEM_CREATE = function (index, LINE) {
        if (LINE.PO_LINE_ID == undefined || LINE.PO_LINE_ID == "" || LINE.PO_LINE_ID == null) {
            $scope.CREATE_ITEM_LIST.splice(index, 1);
        }
        else {
            $scope.DELETE_CREATE_ITEM_LIST.push(LINE);
            $scope.CREATE_ITEM_LIST.splice(index, 1);
        }
    }
    $scope.REMOVE_SUPPLIER_FILTE = function (index, INPUT_ID) {
        $scope.SUPPLIER_SEARCH.UploadedFiles.splice(index, 1);
        angular.element("input[id='" + INPUT_ID + "']").val(null);
    }

    $scope.REMOVE_FILTE_TERM_CON = function (index, LINE) {
        if (LINE != undefined && LINE.TABLE_ID > 0) {
            $scope.DELETE_TERMS_AND_CONDITIONS_MASTER_LIST.push(LINE);
            $scope.TERMS_AND_CONDITIONS_MASTER_LIST.splice(index, 1);
        } else {
            $scope.TERMS_AND_CONDITIONS_MASTER_LIST.splice(index, 1);
        }
    };
    $scope.REMOVE_FILTE_CREATE_TERM_CON = function (index, LINE) {
        if (LINE != undefined && LINE.TABLE_ID > 0) {
            $scope.DELETE_CREATE_TERMS_AND_CONDITIONS_MASTER_LIST.push(LINE);
            $scope.CREATE_TERMS_AND_CONDITIONS_MASTER_LIST.splice(index, 1);
        } else {
            $scope.CREATE_TERMS_AND_CONDITIONS_MASTER_LIST.splice(index, 1);
        }


    };
    $scope.REMOVE_FILTE_QUOTATION = function (index, LINE, FIRST, INPUT_ID) {
        if (LINE != undefined && LINE.TABLE_ID > 0) {
            $scope.DELETE_QUOTATION_LIST.push(LINE);
            $scope.QUOTATION_LIST.splice(index, 1)
            angular.element("input[id='" + INPUT_ID + index + "']").val(null);
        }
        else {
            $scope.QUOTATION_LIST.splice(index, 1)
            angular.element("input[id='" + INPUT_ID + index + "']").val(null);
        };

        $scope.GET_DENSE_RANK();
    };
    $scope.REMOVE_FILTE_CREATE_QUOTATION = function (index, LINE) {
        if (LINE != undefined && LINE.TABLE_ID > 0) {
            $scope.DELETE_CREATE_QUOTATION_LIST.push(LINE);
            $scope.CREATE_QUOTATION_LIST.splice(index, 1)
        }
        else {
            $scope.CREATE_QUOTATION_LIST.splice(index, 1)
        }
    };

    $scope.REMOVE_FILTE_CREATE = function (index) { $scope.Create_REQ_Search.UploadedFiles.splice(index, 1) };

    $scope.POP_DISCARD_PO_FY = function () {
        $('#POP_DISCARD_PO').modal('show');
        $scope.REQ_Search.REQUEST_LINE.DISCARD_PO_COMMENTS = "";
        $scope.DISCARD_PO_FORM.submitted = false;
        $scope.$parent.COMMON_CODE_CHANGE();
    }
    $scope.POP_SUPPLIER_FY = function () {
        $scope.SUPPLIER_SEARCH = {
            IS_MULTI_FILE_UPLOAD_ALLOW: true,
        };
        $('#POP_SUPPLIER').modal('show');
        $scope.SUPPLIER_FORM.submitted = false;
    }
    $scope.POP_DELIVERY_DETAILS_FY = function () {
        $('#DELIVERY_DETAILS').modal('show');
        $scope.DELIVERY_ADDRESS_SEARCH.DELIVERY_ADDRESS = "";
        $scope.DELIVERY_ADDRESS_SEARCH.ATTENTION = "";
        $scope.DELIVERY_ADDRESS_SEARCH.PHONE = "";
        $scope.DELIVERY_DETAILS_FORM.submitted = false;
    }
    $scope.POP_TERMS_CONDITIONS_FY = function (SELECTED) {
        $('#TERMS_CONDITIONS').modal('show');
        $scope.SELECTED_TERM_CONDITION = SELECTED;
    }
    $scope.POP_ADD_TERMS_CONDITIONS_Fn = function () {
        $('#AddTANDC').modal('show');
    }

    var promise;
    $scope.countx = 0;
    $scope.StartResyncInterval = function () {
        promise = $interval(IntervalExecution, 60000);
    };
    // stops the interval
    $scope.StopResyncInterval = function () { $interval.cancel(promise); };
    function IntervalExecution() { $scope.GetIntegrationDetails(2); }

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
    $scope.EDIT_REQ_BTN = function () {
        $('#EDIT_REQ').modal('show');
        $scope.$parent.overlay_loadingNew = 'block';
        $scope.REQ_PROC_Search.REQ_DETAILS.PAGING = $scope.REQ_PROC_Search.PROCESSED_LINE.PAGING;
        $scope.Edit_REQ_childScope.PAGE_LOAD_EDIT_REQ($scope.REQ_PROC_Search.REQ_DETAILS, 1, 'IS_BUYER', 1);
        $scope.$parent.COMMON_CODE_CHANGE();
    }

    $scope.TAXPERCENTAGE_CHANGE = function (TAX_TYPE, LINE) {
        if (TAX_TYPE != null) {
            if (LINE.TAX_RATE == undefined) {
                LINE.TAX_RATE = 0;
            }
            LINE.TAX_RATE = LINE.TAX_ID.RATE;

            $scope.Fn_SPLIT_REQ($scope.REQ_Search, 2);
            //$scope.SELECTED_TAX_TYPE = $scope.CASHUP_LIST_XERO_OUTBOUND_INVOICE_DATA.filter(p => p.$$hashKey == LINE.$$hashKey);
            //$scope.NET_AMOUNT = $scope.SELECTED_TAX_TYPE[0]["UNIT_AMOUNT"];
            //$scope.GROSS_AMOUNT = $scope.SELECTED_TAX_TYPE[0]["SUB_TOTAL"];
            //$scope.CHANGE_TAX_RATE = $scope.XERO_TAXES.filter(p => p.ID == parseInt(TAX_TYPE))[0]['RATE'];
            //$scope.CALCULAED_NET_AFTER_TAX_PERCENTAGE_CHANGE = parseFloat($scope.GROSS_AMOUNT) / (1 + (parseFloat($scope.CHANGE_TAX_RATE) / 100));

            //$scope.CASHUP_LIST_XERO_OUTBOUND_INVOICE_DATA.filter(p => p.$$hashKey == LINE.$$hashKey)[0]['UNIT_AMOUNT'] = parseFloat($scope.CALCULAED_NET_AFTER_TAX_PERCENTAGE_CHANGE.toFixed(2));
            //$scope.CASHUP_LIST_XERO_OUTBOUND_INVOICE_DATA.filter(p => p.$$hashKey == LINE.$$hashKey)[0]['TAX_AMOUNT'] = parseFloat((($scope.CALCULAED_NET_AFTER_TAX_PERCENTAGE_CHANGE * $scope.CHANGE_TAX_RATE) / 100).toFixed(2));
            //$scope.CASHUP_LIST_XERO_OUTBOUND_INVOICE_DATA.filter(p => p.$$hashKey == LINE.$$hashKey)[0]['TAX_PERCENTAGE'] = $scope.XERO_TAXES.filter(p => p.TAX_TYPE == TAX_TYPE)[0]['RATE'];

        }
        //if ($scope.CASHUP_LIST_XERO_OUTBOUND_INVOICE_COPY.filter(p => p.DESCRIPTION == LIST_XERO_OUTBOUND_INVOICE_DATA.DESCRIPTION && p.TAX_TYPE == LIST_XERO_OUTBOUND_INVOICE_DATA.TAX_TYPE).length == 0) {
        //    $scope.SalesValidationSearch.NG_REQUIRED_FOR_COMMENT = true;
        //}
        //else {
        //    $scope.SalesValidationSearch.NG_REQUIRED_FOR_COMMENT = false;
        //}
    };
    $scope.PR_OWNERSHIP = function (REVERT_FLAG) {
        var msg = "Are you sure, you want to take the ownership of request "
        if (REVERT_FLAG == 1) {
            msg = "Are you sure, you want to revert the ownership of request ";
        }

        if (confirm(msg + ' ' + $scope.REQ_Search.REQUEST_LINE.PR_NUMBER + "?")) {
            $scope.PROC_TERMS_AND_CONDITIONS_MASTER_LIST = [];
            ModelObj = new Object();
            ModelObj.PURCHASE_REQUEST_ID = $scope.REQ_Search.REQUEST_LINE.REQUEST_ID;
            ModelObj.USER_ID = parseInt($cookies.get("USERID"));
            ModelObj.REVERT_FLAG = REVERT_FLAG == undefined ? 0 : REVERT_FLAG;//--1 FOR REVERT ELSE 0
            PrcCommMethods.P2P_API(ModelObj, 'PR_OWNERSHIP', 'PO').then(function (data) {
                if (REVERT_FLAG == 1) {
                    if (data.data.Table != undefined && data.data.Table.length > 0 && data.data.Table[0].BUYER_NAME == '') {
                        $scope.REQ_Search.REQUEST_LINE.BUYER_ID = null;
                        $scope.$parent.ShowAlert("Success", "You successfully revert the ownership of request " + $scope.REQ_Search.REQUEST_LINE.PR_NUMBER, 2000);
                        $scope.REQ_Search.REQUEST_LINE.SHOW_REQUEST_DTLS = true;
                    }
                }
                else if (data.data.Table.length > 0) {
                    if ($scope.REQ_Search.PO_DATE != undefined && $scope.REQ_Search.PO_DATE != "" && $scope.REQ_Search.PO_DATE != null) {
                        $scope.GET_P2P_BUDGET_BY_ACCOUNTS(1, $scope.REQ_Search.REQUEST_LINE, $scope.REQ_Search);
                    }
                    if (data.data.Table[0].BUYER_NAME == '') {
                        $scope.REQ_Search.REQUEST_LINE.BUYER_ID = parseInt($cookies.get("USERID"));
                        $scope.$parent.ShowAlert("Success", "You successfully taken the ownership of request " + $scope.REQ_Search.REQUEST_LINE.PR_NUMBER, 2000);
                        $scope.REQ_Search.REQUEST_LINE.SHOW_REQUEST_DTLS = false;

                    }
                    else if (data.data.Table[0].BUYER_NAME != '') {
                        $scope.REQ_Search.REQUEST_LINE.BUYER_ID = parseInt($cookies.get("USERID"));
                        $scope.$parent.ShowAlert("Attention", "ownership has been taken by " + data.data.Table[0].BUYER_NAME, 2000);
                    }
                }
            });
        }
    }

    $scope.SELECT_SUPPLIER_LIST = [];
    $scope.INS_UPD_REQUISITION = function (DRAFT_FLAG, POP_FLAG) {
        $scope.ITEM_LIST_VALID(1);
        if ($scope.REQ_Search.REQUEST_LINE.BUYER_ID == null) {
            $scope.PR_OWNERSHIP();
        }

        else if ($scope.REQ_Search.REQUEST_LINE.BUYER_ID > 0) {
            $scope.POForm.Draftsubmitted = true;
            var ptopobj = new Object();
            ptopobj.PO_QUOTATIONS = [];
            ptopobj.PO_TERMS_AND_CONDITIONS = [];
            var message = "";
            var count = 0;
            if (DRAFT_FLAG == 2) {
                $scope.POForm.submitted = true;
                message = "Are you sure you want to submit for approval?";
            }
            var ValidContact = $scope.ITEM_LIST.filter(function (x) { return x.IS_ACCOUNT_VALID == true });
            $scope.SELECT_SUPPLIER_LIST = [];
            var List = $scope.SUPPLIER_LIST.filter(function (x) { return x.SUPPLIER_NAME == $scope.REQ_Search.SUPPLIER_NAME });
            if (List.length > 0) { $scope.SELECT_SUPPLIER_LIST = List; }
            angular.forEach($scope.QUOTATION_LIST, function (QUO) {
                QUO.IS_QUOTATION_REQUIRED = false;
                if (QUO.CONTACT_NAME != undefined && QUO.CONTACT_NAME != "" && QUO.CONTACT_NAME != null) {
                    var readOnly = new Object();
                    readOnly.TABLE_ID = QUO.TABLE_ID == undefined ? null : QUO.TABLE_ID;
                    var SupQList = $scope.SUPPLIER_LIST.filter(function (x) { return x.SUPPLIER_NAME == QUO.CONTACT_NAME });
                    if (SupQList.length == 0) { readOnly.XERO_CONTACT_ID = null; } else { readOnly.XERO_CONTACT_ID = SupQList[0].ID; };
                    readOnly.TOTAL_AMOUNT = DRAFT_FLAG == 1 && (QUO.TOTAL_AMOUNT == undefined || QUO.TOTAL_AMOUNT == '') ? null : QUO.TOTAL_AMOUNT;
                    readOnly.COMMENTS = DRAFT_FLAG == 1 && QUO.COMMENTS == undefined ? null : QUO.COMMENTS;
                    readOnly.UPLOADS_ID = "";
                    QUO.IS_QUOTATION_REQUIRED = false;
                    if (QUO.UploadedFiles != undefined && QUO.UploadedFiles.length > 0) {
                        angular.forEach(QUO.UploadedFiles, function (Uploads) {
                            if (readOnly.UPLOADS_ID == "") {
                                readOnly.UPLOADS_ID = Uploads.ID;
                            } else {
                                readOnly.UPLOADS_ID = readOnly.UPLOADS_ID + "," + Uploads.ID;
                            };
                        });
                    };
                    if (DRAFT_FLAG == 2 && (QUO.UploadedFiles == undefined || QUO.UploadedFiles == null || QUO.UploadedFiles == "" || QUO.UploadedFiles.length == 0)) {
                        QUO.IS_QUOTATION_REQUIRED = true;
                    }
                    readOnly.DELETE_FLAG = 0;
                    if (readOnly.XERO_CONTACT_ID == null && readOnly.TABLE_ID == null
                        && (readOnly.TOTAL_AMOUNT == undefined || readOnly.TOTAL_AMOUNT == null || readOnly.TOTAL_AMOUNT == "")
                        && (readOnly.COMMENTS == undefined || readOnly.COMMENTS == null || readOnly.COMMENTS == "")) {
                        readOnly.DELETE_FLAG = null;
                    }
                    else {
                        ptopobj.PO_QUOTATIONS.push(readOnly);
                    }
                }
            });
            var QutotaionSelectContact = $scope.QUOTATION_LIST.filter(function (x) { return x.IS_QUOTATION_REQUIRED });
            var Advance_Amount_valid = parseFloat($scope.REQ_Search.ADVANCE) > parseFloat($scope.REQ_Search.TOTAL_AMOUNT);
            var BASE_TO_PO_CONVERSION_RATE = $scope.REQ_Search.BASE_TO_PO_CONVERSION_RATE == undefined || $scope.REQ_Search.BASE_TO_PO_CONVERSION_RATE == "" || $scope.REQ_Search.BASE_TO_PO_CONVERSION_RATE == null || $scope.REQ_Search.BASE_TO_PO_CONVERSION_RATE == 0 ? false : true;
            var REQ_VALID = parseFloat($scope.REQ_Search.TOTAL_AMOUNT).toFixed(5) == 0 ? false : true;
            var SPLIT_REQ_VALID = $scope.REM_AMOUNT_LEFT > 0 || $scope.REM_AMOUNT_LEFT < 0 ? false : true;

            ptopobj.PO_LINE_SPLIT = [];
            if (SPLIT_REQ_VALID || DRAFT_FLAG == 1) {
                angular.forEach($scope.MONTH_LIST, function (_m, _m_index) {
                    angular.forEach(_m.ITEM_LIST, function (_item) {
                        var readonly = new Object()
                        readonly.TABLE_ID = _item.SPLIT_TABLE_ID == undefined || _item.SPLIT_TABLE_ID == "" ? null : _item.SPLIT_TABLE_ID;
                        readonly.PO_LINE_NO = _item.LINE_NO; // _item.REQ_SPLIT_LIST.PO_LINE_ID;
                        //readonly.PO_DATE = new Date(_m.START_DATE).toDateString();    
                        readonly.PO_DATE = ($filter('date')(new Date(_m.START_DATE)));
                        if ($scope.SETTING_USE_GROSS == 1) {
                            var NET = _item.BUDGET == undefined || _item.BUDGET == '' || _item.BUDGET == null ? "0" : (_item.BUDGET) / (1 + (_item.TAX_RATE / 100));
                            readonly.NET_AMOUNT = parseFloat(NET).toFixed(5);
                            readonly.GROSS_AMOUNT = _item.BUDGET == undefined || _item.BUDGET == '' || _item.BUDGET == null ? "0" : parseFloat(_item.BUDGET).toFixed(5);
                        }
                        else {
                            var GROSS_NET = _item.BUDGET == undefined || _item.BUDGET == '' || _item.BUDGET == null ? "0" : (_item.BUDGET) * (1 + (_item.TAX_RATE / 100))
                            readonly.NET_AMOUNT = _item.BUDGET == undefined || _item.BUDGET == '' || _item.BUDGET == null ? "0" : parseFloat(_item.BUDGET).toFixed(5);
                            readonly.GROSS_AMOUNT = parseFloat(GROSS_NET).toFixed(5);
                        }
                        readonly.DELETE_FLAG = 0;
                        ptopobj.PO_LINE_SPLIT.push(readonly);
                        if (_m.FLAG == 1 && parseFloat(_item.REMAINING_AMOUNT).toFixed(2) < 0) {
                            SPLIT_REQ_VALID = false;
                        } else if (_m.FLAG == 1 && parseFloat(_item.REMAINING_AMOUNT).toFixed(2) > 0) {
                            SPLIT_REQ_VALID = false;
                        } else if (_m.FLAG == 1 && parseFloat(_item.REMAINING_AMOUNT).toFixed(2) == 0) {
                            SPLIT_REQ_VALID = true;
                        };
                    });
                });
                if ($scope.DELETE_MONTH_LIST.length > 0) {
                    angular.forEach($scope.DELETE_MONTH_LIST, function (_val_delete_item) {
                        if (_val_delete_item != undefined && _val_delete_item.SPLIT_TABLE_ID > 0) {
                            var readonly = new Object();
                            readonly.TABLE_ID = _val_delete_item.SPLIT_TABLE_ID;
                            readonly.PO_LINE_NO = null;
                            readonly.PO_DATE = null;
                            readonly.NET_AMOUNT = null;
                            readonly.GROSS_AMOUNT = null;
                            readonly.DELETE_FLAG = 1;
                            ptopobj.PO_LINE_SPLIT.push(readonly);
                        }
                    });
                }
                if ($scope.MONTH_LIST.length == 0 && ptopobj.PO_LINE_SPLIT.length == 0) {
                    var readonly = new Object()
                    readonly.TABLE_ID = null;
                    readonly.PO_LINE_NO = null;
                    readonly.PO_DATE = null;
                    readonly.NET_AMOUNT = null;
                    readonly.GROSS_AMOUNT = null;
                    readonly.DELETE_FLAG = null;
                    ptopobj.PO_LINE_SPLIT.push(readonly);
                }
                if (ptopobj.PO_LINE_SPLIT.length > 0 && $scope.PO_SPLIT_LIST.length > 0) {
                    ptopobj.PO_LINE_SPLIT_DELETE = [];
                    angular.forEach($scope.PO_SPLIT_LIST, function (_line) {
                        var _auto_remove_result = ptopobj.PO_LINE_SPLIT.filter(function (x) { return x.TABLE_ID == _line.TABLE_ID })
                        if (_auto_remove_result.length == 0) {
                            var readonly = new Object()
                            readonly.TABLE_ID = _line.TABLE_ID;
                            readonly.PO_LINE_NO = null;
                            readonly.PO_DATE = null;
                            readonly.NET_AMOUNT = null;
                            readonly.GROSS_AMOUNT = null;
                            readonly.DELETE_FLAG = 1;
                            ptopobj.PO_LINE_SPLIT_DELETE.push(readonly);
                        }
                    });
                    if (ptopobj.PO_LINE_SPLIT_DELETE.length > 0) {
                        ptopobj.PO_LINE_SPLIT = ptopobj.PO_LINE_SPLIT.concat(ptopobj.PO_LINE_SPLIT_DELETE);
                    }
                }
            }
            if (DRAFT_FLAG == 2 && $scope.POForm.$valid && ValidContact.length == 0 && QutotaionSelectContact.length == 0 && $scope.REQ_Search.REQUEST_LINE.BUYER_ID > 0 && POP_FLAG == undefined && $scope.REQ_Search.PO_CURRENCY_ID != $scope.REQ_Search.BASE_CURRENCY_ID && $scope.REQ_Search.BASE_TO_PO_CONVERSION_RATE != $scope.REQ_Search.COPY_BASE_TO_PO_CONVERSION_RATE || DRAFT_FLAG == 2 && $scope.POForm.$valid && ValidContact.length == 0 && QutotaionSelectContact.length == 0 && $scope.REQ_Search.BASE_TO_PO_CONVERSION_RATE != $scope.REQ_Search.COPY_BASE_TO_PO_CONVERSION_RATE && ($scope.REQ_Search.CONVERSION_COMMENTS == undefined || $scope.REQ_Search.CONVERSION_COMMENTS == null || $scope.REQ_Search.CONVERSION_COMMENTS == '')) {
                $('#CONVERSION_COMMENTS_POP').modal('show');
            }
            else if ($scope.POForm.$valid && ValidContact.length == 0 && QutotaionSelectContact.length == 0 || DRAFT_FLAG == 1) {
                if (REQ_VALID == false && DRAFT_FLAG == 2 || BASE_TO_PO_CONVERSION_RATE == false && DRAFT_FLAG == 2 || List.length == 0 || $scope.QUOTATION_LIST.length == 0 || Advance_Amount_valid && DRAFT_FLAG == 2 || DRAFT_FLAG == 2 && SPLIT_REQ_VALID == false) {
                    if (List.length == 0 && $scope.QUOTATION_LIST.length == 0) {
                        $scope.$parent.ShowAlert("Error", 'Please select valid contact  name \n please add at least one quotation with attachment', 3000);
                    }
                    else if (List.length == 0) {
                        $scope.$parent.ShowAlert("Error", 'Please select valid contact name', 2000);
                        $scope.SELECT_SUPPLIER_LIST = [];
                    }
                    else if ($scope.QUOTATION_LIST.length == 0) {
                        $scope.$parent.ShowAlert("Error", 'Please add at least one quotation of selected contact', 2000);
                    }
                    else if (Advance_Amount_valid) {
                        $scope.$parent.ShowAlert("Error", 'Advanced amount cannot be greater than total amount.', 2000);
                    }
                    else if (BASE_TO_PO_CONVERSION_RATE == false) {
                        $scope.$parent.ShowAlert("Error", 'Please provide valid conversion rate.', 2000);
                    }
                    else if (REQ_VALID == false) {
                        $scope.$parent.ShowAlert("Error", 'REQ with no amount cannot be processed.', 2000);
                    }
                    else if (SPLIT_REQ_VALID == false) {
                        $scope.$parent.ShowAlert("Error", 'Remaining amount should be zero.', 2000);
                    }
                }
                else {
                    $scope.SELECT_SUPPLIER_LIST = List;
                    //DRAFT_FLAG == 2  mean submit for approval
                    if (DRAFT_FLAG == 1 || DRAFT_FLAG == 2 && POP_FLAG == 1 || confirm(message)) {
                        ptopobj.PO_HDR_ID = $scope.REQ_Search.REQUEST_LINE.PO_HDR_ID;
                        ptopobj.CONTACT_ID = DRAFT_FLAG == 1 && List.length == 0 ? null : List[0].ID;
                        ptopobj.PO_DATE = $scope.REQ_Search.PO_DATE;
                        ptopobj.DELIVERY_DATE = $scope.REQ_Search.DELIVERY_DATE;
                        ptopobj.REFERENCE = $scope.REQ_Search.REFERENCE;
                        ptopobj.XERO_BRANDING_THEME_ID = $scope.REQ_Search.XERO_BRANDING_THEME_ID == undefined ? null : $scope.REQ_Search.XERO_BRANDING_THEME_ID;
                        ptopobj.NOTE_FOR_APPROVERS = $scope.REQ_Search.NOTE_FOR_APPROVERS;
                        ptopobj.PO_CURRENCY_ID = $scope.REQ_Search.PO_CURRENCY_ID;
                        ptopobj.BASE_CURRENCY_ID = $scope.REQ_Search.BASE_CURRENCY_ID;
                        ptopobj.BASE_TO_PO_CONVERSION_RATE = 1;
                        if ($scope.REQ_Search.PO_CURRENCY_ID != $scope.REQ_Search.BASE_CURRENCY_ID) {
                            ptopobj.BASE_TO_PO_CONVERSION_RATE = parseFloat($scope.REQ_Search.BASE_TO_PO_CONVERSION_RATE).toFixed(8);
                        }
                        else {
                            ptopobj.BASE_TO_PO_CONVERSION_RATE = 1;
                        }
                        ptopobj.TAX_TYPE = $scope.REQ_Search.TAX_TYPE;
                        ptopobj.NET_AMOUNT = parseFloat($scope.REQ_Search.NET_AMOUNT).toFixed(5); //NET;
                        ptopobj.TAX_AMOUNT = parseFloat($scope.REQ_Search.TAX_AMOUNT).toFixed(5);//TAX;
                        ptopobj.TOTAL_AMOUNT = parseFloat($scope.REQ_Search.TOTAL_AMOUNT).toFixed(5);//NET+TAX;
                        ptopobj.ADVANCE = $scope.REQ_Search.ADVANCE == undefined || $scope.REQ_Search.ADVANCE == "" || $scope.REQ_Search.ADVANCE == 0 ? null : parseFloat($scope.REQ_Search.ADVANCE).toFixed(5);
                        ptopobj.DELIVERY_ADDRESS = $scope.REQ_Search.DELIVERY_ADDRESS;
                        ptopobj.ATTENTION = $scope.REQ_Search.ATTENTION;
                        ptopobj.PHONE = $scope.REQ_Search.PHONE;
                        ptopobj.DELIVERY_INSTRUCTIONS = $scope.REQ_Search.DELIVERY_INSTRUCTIONS;
                        ptopobj.AUTO_EMAIL_TO_SUPPLIER = $scope.REQ_Search.AUTO_EMAIL_TO_SUPPLIER ? 1 : 0;
                        ptopobj.SUPPLIER_EMAIL = $scope.REQ_Search.SUPPLIER_EMAIL;
                        ptopobj.IS_DRAFT = DRAFT_FLAG == 1 ? 1 : 0;
                        ptopobj.REFERENCE_ID = $scope.REQ_Search.REQUEST_LINE.REQUEST_ID;//REQuest Id
                        ptopobj.UPLOAD_IDS = "";
                        if ($scope.REQ_Search.UploadedFiles != undefined) {
                            angular.forEach($scope.REQ_Search.UploadedFiles, function (x) {
                                if (ptopobj.UPLOAD_IDS == "") {
                                    ptopobj.UPLOAD_IDS = x.ID;
                                }
                                else {
                                    ptopobj.UPLOAD_IDS = ptopobj.UPLOAD_IDS + "," + x.ID;
                                }
                            });
                        }
                        ptopobj.PO_LINES = [];
                        ptopobj.PO_LINE_CUSTOM_FIELDS = [];
                        ptopobj.P2P_BUDGET_SNAPSHOT_TYPE = [];
                        var Incount = 0;
                        angular.forEach($scope.ITEM_LIST, function (LINE) {
                            var readonlyobj = new Object()
                            readonlyobj.PO_LINE_ID = LINE.PO_LINE_ID == undefined || LINE.PO_LINE_ID == "" || LINE.PO_LINE_ID == null ? 0 : parseInt(LINE.PO_LINE_ID);
                            readonlyobj.ITEM_NAME = LINE.ITEM_NAME;
                            readonlyobj.DESCRIPTION = LINE.DESCRIPTION;
                            readonlyobj.LINE_NO = LINE.LINE_NO;
                            readonlyobj.QUANTITY = DRAFT_FLAG == 1 && (LINE.QUANTITY == undefined || LINE.QUANTITY == null || LINE.QUANTITY == '') ? null : parseFloat(LINE.QUANTITY).toFixed(5);
                            readonlyobj.UNIT_PRICE = DRAFT_FLAG == 1 && (LINE.UNIT_PRICE == undefined || LINE.UNIT_PRICE == null || LINE.UNIT_PRICE == '') ? null : parseFloat(LINE.UNIT_PRICE).toFixed(5);
                            readonlyobj.DISCOUNT_PERCENT = DRAFT_FLAG == 1 && (LINE.DISCOUNT_PERCENT == undefined || LINE.DISCOUNT_PERCENT == null || LINE.DISCOUNT_PERCENT == '') ? null : parseFloat(LINE.DISCOUNT_PERCENT);
                            var Accountlist = $scope.XERO_ACCOUNT_CODES.filter(function (x) { return x.CODE + ' - ' + x.NAME == LINE.ACCOUNT_NAME });
                            if (Accountlist.length > 0) {
                                LINE.ACCOUNT_DETAILS = Accountlist[0];
                            }
                            else {
                                if (DRAFT_FLAG == 1) {
                                }
                                else {
                                    LINE.IS_ACCOUNT_VALID = true;
                                    count = 1;
                                }
                            }
                            readonlyobj.ACCOUNT_ID = DRAFT_FLAG == 1 && LINE.ACCOUNT_DETAILS == undefined ? null : parseInt(LINE.ACCOUNT_DETAILS.TABLE_ID);
                            readonlyobj.ACCOUNT_DETAILS = DRAFT_FLAG == 1 && LINE.ACCOUNT_DETAILS == undefined ? null : LINE.ACCOUNT_DETAILS.CODE + "-" + LINE.ACCOUNT_DETAILS.NAME;
                            readonlyobj.TAX_RATE_ID = LINE.TAX_ID == undefined ? null : LINE.TAX_ID.ID;
                            readonlyobj.TAX_RATE = LINE.TAX_ID == undefined ? null : LINE.TAX_ID.RATE;
                            readonlyobj.TAX_RATE_DETAILS = DRAFT_FLAG == 1 && LINE.TAX_ID == undefined ? null : LINE.TAX_ID.NAME + ' (' + LINE.TAX_ID.RATE + '%)';
                            readonlyobj.AMOUNT = LINE.AMOUNT == "" || LINE.AMOUNT == null || isNaN(LINE.AMOUNT) ? null : parseFloat(LINE.AMOUNT).toFixed(5);
                            readonlyobj.PR_PURCHASE_REQUEST_ID = LINE.LINE_NO == 1 ? $scope.REQ_Search.REQUEST_LINE.REQUEST_ID == undefined || $scope.REQ_Search.REQUEST_LINE.REQUEST_ID == '' ? null : $scope.REQ_Search.REQUEST_LINE.REQUEST_ID : null;//REQuest Id
                            if (LINE.XERO_TRACKING_CATEGORIES != undefined && LINE.XERO_TRACKING_CATEGORIES.length > 0 && Incount == 0) {
                                angular.forEach(LINE.XERO_TRACKING_CATEGORIES, function (TR) {
                                    var PO_LINE_CUST_FLD = new Object();
                                    PO_LINE_CUST_FLD.PO_LINE_NO = LINE.LINE_NO;
                                    PO_LINE_CUST_FLD.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID = DRAFT_FLAG == 1 && TR.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID == undefined ? null : TR.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID;
                                    PO_LINE_CUST_FLD.APPROVAL_CHAIN_CUSTOM_FIELD_OPTIONS_MASTER_ID = DRAFT_FLAG == 1 && TR.SELECTED_CATEGORY_OPTION == undefined ? null : TR.SELECTED_CATEGORY_OPTION == undefined ? null : TR.SELECTED_CATEGORY_OPTION.APPROVAL_CHAIN_CUSTOM_FIELD_OPTIONS_MASTER_ID;
                                    ptopobj.PO_LINE_CUSTOM_FIELDS.push(PO_LINE_CUST_FLD);
                                });
                            }
                            else {
                                if (Incount == 0) {
                                    var PO_LINE_CUST_FLD = new Object();
                                    PO_LINE_CUST_FLD.PO_LINE_NO = null;
                                    PO_LINE_CUST_FLD.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID = null;
                                    PO_LINE_CUST_FLD.APPROVAL_CHAIN_CUSTOM_FIELD_OPTIONS_MASTER_ID = null;
                                    ptopobj.PO_LINE_CUSTOM_FIELDS.push(PO_LINE_CUST_FLD);
                                }
                                Incount = 1;
                            }
                            readonlyobj.DELETE_FLAG = 0;
                            readonlyobj.UOM_NAME = DRAFT_FLAG == 1 && LINE.UOM_NAME == undefined || LINE.UOM_NAME == null || LINE.UOM_NAME == '' ? null : LINE.UOM_NAME;
                            readonlyobj.RECEIVING_TYPE_ID = DRAFT_FLAG == 1 && LINE.RECEIVING_TYPE_ID == undefined || LINE.RECEIVING_TYPE_ID == null || LINE.RECEIVING_TYPE_ID == '' ? null : LINE.RECEIVING_TYPE_ID;
                            ptopobj.PO_LINES.push(readonlyobj);
                        });
                        angular.forEach($scope.DELETE_ITEM_LIST, function (LINE) {
                            var readonlyobj = new Object()
                            readonlyobj.PO_LINE_ID = parseInt(LINE.PO_LINE_ID);
                            readonlyobj.ITEM_NAME = null;
                            readonlyobj.DESCRIPTION = null;
                            readonlyobj.LINE_NO = null;
                            readonlyobj.QUANTITY = null;
                            readonlyobj.UNIT_PRICE = null;
                            readonlyobj.DISCOUNT_PERCENT = null;
                            readonlyobj.ACCOUNT_ID = null;
                            readonlyobj.ACCOUNT_DETAILS = null;
                            readonlyobj.TAX_RATE_ID = null;
                            readonlyobj.TAX_RATE = null;
                            readonlyobj.TAX_RATE_DETAILS = null;
                            readonlyobj.AMOUNT = null;
                            readonlyobj.PR_PURCHASE_REQUEST_ID = null;//REQuest Id
                            readonlyobj.DELETE_FLAG = 1;
                            readonlyobj.UOM_NAME = null;
                            readonlyobj.RECEIVING_TYPE_ID = null;
                            ptopobj.PO_LINES.push(readonlyobj);
                        });

                        if (ptopobj.PO_LINE_CUSTOM_FIELDS.length == 0) {
                            var PO_LINE_CUST_FLD = new Object();
                            PO_LINE_CUST_FLD.PO_LINE_NO = null;
                            PO_LINE_CUST_FLD.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID = null;
                            PO_LINE_CUST_FLD.APPROVAL_CHAIN_CUSTOM_FIELD_OPTIONS_MASTER_ID = null;
                            ptopobj.PO_LINE_CUSTOM_FIELDS.push(PO_LINE_CUST_FLD);
                        }
                        if ($scope.TERMS_AND_CONDITIONS_MASTER_LIST.length > 0) {
                            angular.forEach($scope.TERMS_AND_CONDITIONS_MASTER_LIST, function (x) {
                                if (x.TEXT != undefined && x.TEXT != "" && x.TEXT != null) {
                                    var readOnly = new Object();
                                    readOnly.TABLE_ID = DRAFT_FLAG == 1 && x.TABLE_ID == undefined ? null : x.TABLE_ID;
                                    readOnly.TANDC_MASTER_ID = DRAFT_FLAG == 1 && x.TANDC_MASTER_ID == undefined ? null : x.TANDC_MASTER_ID;
                                    readOnly.TEXT = DRAFT_FLAG == 1 && x.TEXT == undefined ? null : x.TEXT;
                                    readOnly.SORT_ORDER = DRAFT_FLAG == 1 && x.SORT_ORDER == undefined ? null : x.SORT_ORDER;
                                    readOnly.DELETE_FLAG = 0;
                                    ptopobj.PO_TERMS_AND_CONDITIONS.push(readOnly);
                                }
                            });
                        }
                        if ($scope.DELETE_TERMS_AND_CONDITIONS_MASTER_LIST.length > 0) {
                            angular.forEach($scope.DELETE_TERMS_AND_CONDITIONS_MASTER_LIST, function (x) {
                                var readOnly = new Object();
                                readOnly.TABLE_ID = x.TABLE_ID == undefined ? 0 : x.TABLE_ID;
                                readOnly.TANDC_MASTER_ID = null;
                                readOnly.TEXT = null;
                                readOnly.SORT_ORDER = null;
                                readOnly.DELETE_FLAG = 1;
                                ptopobj.PO_TERMS_AND_CONDITIONS.push(readOnly);
                            });
                        }
                        if ($scope.DELETE_QUOTATION_LIST.length > 0) {
                            angular.forEach($scope.DELETE_QUOTATION_LIST, function (QUO) {
                                var readOnly = new Object();
                                readOnly.TABLE_ID = QUO.TABLE_ID;
                                readOnly.XERO_CONTACT_ID = null;
                                readOnly.TOTAL_AMOUNT = null;
                                readOnly.COMMENTS = null;
                                readOnly.UPLOADS_ID = "";
                                readOnly.DELETE_FLAG = 1;
                                ptopobj.PO_QUOTATIONS.push(readOnly);
                            });
                        };
                        if (ptopobj.PO_QUOTATIONS.length == 0) {
                            var readOnly = new Object();
                            readOnly.TABLE_ID = null
                            readOnly.XERO_CONTACT_ID = null;
                            readOnly.TOTAL_AMOUNT = null;
                            readOnly.COMMENTS = null;
                            readOnly.UPLOADS_ID = null;
                            readOnly.DELETE_FLAG = null;
                            ptopobj.PO_QUOTATIONS.push(readOnly);
                        }
                        if (ptopobj.PO_TERMS_AND_CONDITIONS.length == 0) {
                            var readOnly = new Object();
                            readOnly.TABLE_ID = null;
                            readOnly.TANDC_MASTER_ID = null;
                            readOnly.TEXT = null;
                            readOnly.SORT_ORDER = null;
                            readOnly.DELETE_FLAG = null;
                            ptopobj.PO_TERMS_AND_CONDITIONS.push(readOnly);
                        }
                        ptopobj.OVER_BUDGET = 0;
                        ptopobj.OVER_BUDGET_AMOUNT = 0;
                        ptopobj.OVER_BUDGET_PERCENTAGE = 0;
                        if (DRAFT_FLAG == 2) {
                            angular.forEach($scope.P2P_BUDGET_MASTER_LIST, function (val) {
                                var over_budget_amt_to_add = 0;
                                var rowcount = 1;
                                var Line2 = val.BUDGET_DETAILS_LIST.length;
                                angular.forEach(val.BUDGET_DETAILS_LIST, function (item) {
                                    if (val.DB_ACCOUNT_ID == 0) {
                                        item.REMAINING_AMOUNT = item.REMAINING;
                                    }
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
                                        ptopobj.OVER_BUDGET = ReadOnlyApproval.OVER_BUDGET;
                                        let OverBudgetPercentage = (item.REMAINING_AMOUNT * -1 / item.TOTAL) * 100
                                        if (parseFloat(OverBudgetPercentage.toFixed(2)) > parseFloat(parseFloat(ptopobj.OVER_BUDGET_PERCENTAGE).toFixed(2))) {
                                            ptopobj.OVER_BUDGET_PERCENTAGE = parseFloat(parseFloat(OverBudgetPercentage).toFixed(2));
                                            over_budget_amt_to_add = over_budget_amt_to_add == 0 ? parseFloat(item.REMAINING_AMOUNT * -1) : (parseFloat(over_budget_amt_to_add) < parseFloat(item.REMAINING_AMOUNT * -1) ? parseFloat(item.REMAINING_AMOUNT * -1) : over_budget_amt_to_add);
                                        }
                                    }
                                    if (rowcount == val.BUDGET_DETAILS_LIST.length) {
                                        ptopobj.OVER_BUDGET_AMOUNT = parseFloat(ptopobj.OVER_BUDGET_AMOUNT) + parseFloat(over_budget_amt_to_add.toFixed(5));
                                    }
                                    ReadOnlyApproval.CREDIT_MEMO = parseFloat(item.MEMO).toFixed(5);
                                    ptopobj.P2P_BUDGET_SNAPSHOT_TYPE.push(ReadOnlyApproval);
                                    rowcount++;
                                });
                            });
                        }
                        if (ptopobj.P2P_BUDGET_SNAPSHOT_TYPE.length == 0) {
                            var ReadOnlyApproval = new Object();
                            ReadOnlyApproval.APPROVAL_HEADER_ID = null;// admin header go 
                            ReadOnlyApproval.APPROVAL_HEADER_STATUS_ID = null;// admin no status will go
                            ReadOnlyApproval.ACCOUNT_ID = null;
                            ReadOnlyApproval.YTD = null;
                            ReadOnlyApproval.TOTAL = null;
                            ReadOnlyApproval.REMAINING = null;
                            ReadOnlyApproval.CONSUMED = null;
                            ReadOnlyApproval.BOOKED = null;
                            ReadOnlyApproval.CURRENT = null;
                            ReadOnlyApproval.OVER_BUDGET = null;
                            ReadOnlyApproval.PERIOD = null;
                            ReadOnlyApproval.ACCOUNT_DETAILS = null;
                            ReadOnlyApproval.CREDIT_MEMO = null;
                            ptopobj.P2P_BUDGET_SNAPSHOT_TYPE.push(ReadOnlyApproval);
                        }
                        ptopobj.LINE_COUNT = ptopobj.PO_LINES.length;
                        ptopobj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
                        ptopobj.BRANCH_ID = $scope.REQ_Search.REQUEST_LINE.BRANCH_ID;     ///RECEIVING_TYPE_ID   1 FOR QTY WISE AND 2 FOR AMOUNT WISE
                        ptopobj.USER_ID = parseInt($cookies.get("USERID"));
                        ptopobj.PROJECT_MASTER_ID = $scope.REQ_Search.PROJECT_MASTER_ID == 0 ? null : $scope.REQ_Search.PROJECT_MASTER_ID;
                        ptopobj.RESET_APPROVAL_CHAIN = 1;
                        ptopobj.NO_OF_QUOTATIONS = ptopobj.PO_QUOTATIONS.length > 0 ? ptopobj.PO_QUOTATIONS.filter(function (x) { return x.DELETE_FLAG == 0 }).length : 0;
                        ptopobj.SETTING_45 = $scope.$parent.SETTING_USE_GROSS;
                        ptopobj.SPLIT_TYPE = $scope.REQ_Search.SPLIT_TYPE_ID;
                        ptopobj.CONVERSION_COMMENTS = $scope.REQ_Search.CONVERSION_COMMENTS;
                        if (count == 0) {
                            PrcCommMethods.P2P_API(ptopobj, 'INS_UPD_REQUISITION', 'PO').then(function (data) {
                                if (data.data > 1) {
                                    $('#CONVERSION_COMMENTS_POP').modal('hide');
                                    if (DRAFT_FLAG == 1) {
                                        $scope.$parent.ShowAlert("Success", "Save as draft successfully ", 3000);
                                        $scope.ITEM_LIST = [];
                                        $scope.TERMS_AND_CONDITIONS_MASTER_LIST = [];
                                        $scope.QUOTATION_LIST = [];
                                        $scope.DELETE_ITEM_LIST = [];
                                        $scope.DELETE_TERMS_AND_CONDITIONS_MASTER_LIST = [];
                                        $scope.DELETE_QUOTATION_LIST = [];
                                        $scope.REQ_Search.REQUEST_LINE.PO_HDR_ID = data.data;
                                        $scope.REQ_Search.REQUEST_LINE.CONTACT_NAME = $scope.REQ_Search.SUPPLIER_NAME;
                                        $scope.REQ_Search.REQUEST_LINE.STATUS_ID = 66;

                                        $scope.GET_PO_BY_ID($scope.REQ_Search.REQUEST_LINE, 1);

                                        if ($scope.REQ_Search.PO_DATE != undefined && $scope.REQ_Search.PO_DATE != "" && $scope.REQ_Search.PO_DATE != null && $scope.REQ_Search.PROJECT_MASTER_ID != undefined && $scope.REQ_Search.PROJECT_MASTER_ID != null && $scope.REQ_Search.PROJECT_MASTER_ID != "") {
                                            $scope.GET_P2P_BUDGET_BY_ACCOUNTS(1, $scope.REQ_Search.REQUEST_LINE, $scope.REQ_Search);
                                        }
                                        //  $scope.GET_PURCHASE_REQUESTS_BY_BUYER(1, 1);// Second parameter to check is draft flag 
                                    }
                                    else {
                                        //Send for Approval Successfully
                                        $scope.$parent.ShowAlert("Success", "Submit for approval", 3000);

                                        $scope.ITEM_LIST = [];
                                        $scope.TERMS_AND_CONDITIONS_MASTER_LIST = [];
                                        $scope.QUOTATION_LIST = [];

                                        $scope.DELETE_ITEM_LIST = [];
                                        $scope.DELETE_TERMS_AND_CONDITIONS_MASTER_LIST = [];
                                        $scope.DELETE_QUOTATION_LIST = [];

                                        $scope.GET_PURCHASE_REQUESTS_BY_BUYER(1);
                                        $scope.GET_PURCHASE_REQUESTS_BY_BUYER_PROCESSED(1);
                                    }
                                    $scope.POForm.submitted = false;
                                    $scope.POForm.Draftsubmitted = false;
                                }
                                if (data.data == 0) {
                                    $scope.$parent.ShowAlert("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                                }
                            });
                        }
                        else {
                            if (count == 1) {
                                $scope.$parent.ShowAlert("Error", 'Please select valid account name', 3000);
                            }
                        }
                    }
                }
                $scope.$parent.COMMON_CODE_CHANGE();
            }
            else {
                $scope.$parent.ShowAlert("Error", 'Please provide the mandatory details marked as red', 3000);
            }
        }
    };
    $scope.CREATE_INS_UPD_REQUISITION = function (DRAFT_FLAG) {
        var ptopobj = new Object();
        ptopobj.PO_LINES = [];
        ptopobj.PO_LINE_CUSTOM_FIELDS = [];
        ptopobj.PO_TERMS_AND_CONDITIONS = [];
        ptopobj.PO_QUOTATIONS = [];
        ptopobj.P2P_BUDGET_SNAPSHOT_TYPE = [];
        if ($scope.CREATE_QUOTATION_LIST.length > 0) {
            angular.forEach($scope.CREATE_QUOTATION_LIST, function (QUO) {
                if (QUO.CONTACT_NAME != undefined && QUO.CONTACT_NAME != "" && QUO.CONTACT_NAME != null) {
                    var readOnly = new Object();
                    readOnly.TABLE_ID = QUO.TABLE_ID == undefined ? null : QUO.TABLE_ID;
                    var SupQList = $scope.SUPPLIER_LIST.filter(function (x) { return x.SUPPLIER_NAME == QUO.CONTACT_NAME });
                    if (SupQList.length == 0) {
                        readOnly.XERO_CONTACT_ID = DRAFT_FLAG == 1 ? null : null;
                    }
                    else {
                        readOnly.XERO_CONTACT_ID = SupQList[0].ID;
                    }

                    readOnly.TOTAL_AMOUNT = DRAFT_FLAG == 1 && QUO.TOTAL_AMOUNT == undefined ? null : QUO.TOTAL_AMOUNT;
                    readOnly.COMMENTS = DRAFT_FLAG == 1 && QUO.COMMENTS == undefined ? null : QUO.COMMENTS;
                    readOnly.UPLOADS_ID = "";
                    QUO.IS_QUOTATION_REQUIRED = false;
                    if (QUO.UploadedFiles != undefined && QUO.UploadedFiles.length > 0) {
                        angular.forEach(QUO.UploadedFiles, function (Uploads) {
                            if (readOnly.UPLOADS_ID == "") {
                                readOnly.UPLOADS_ID = Uploads.ID;
                            } else {
                                readOnly.UPLOADS_ID = readOnly.UPLOADS_ID + "," + Uploads.ID;
                            };
                        });
                    };
                    if (DRAFT_FLAG == undefined && (QUO.UploadedFiles == undefined || QUO.UploadedFiles == null || QUO.UploadedFiles == "" || QUO.UploadedFiles.length == 0)) {
                        QUO.IS_QUOTATION_REQUIRED = true;
                    }
                    if (QUO.UploadedFiles != undefined && QUO.UploadedFiles.length > 0) {
                        angular.forEach(QUO.UploadedFiles, function (Uploads) {
                            if (readOnly.UPLOADS_ID == "") {
                                readOnly.UPLOADS_ID = Uploads.ID;
                            } else {
                                readOnly.UPLOADS_ID = readOnly.UPLOADS_ID + "," + Uploads.ID;
                            };
                        });
                    };
                    readOnly.DELETE_FLAG = 0;
                    if (readOnly.TABLE_ID == null
                        && (readOnly.TOTAL_AMOUNT == undefined || readOnly.TOTAL_AMOUNT == null || readOnly.TOTAL_AMOUNT == "")
                        && (readOnly.COMMENTS == undefined || readOnly.COMMENTS == null || readOnly.COMMENTS == "")) {
                        readOnly.DELETE_FLAG = null;
                    }
                    else {
                        ptopobj.PO_QUOTATIONS.push(readOnly);
                    }
                }
            });
        }
        var QutotaionSelectContact = $scope.CREATE_QUOTATION_LIST.filter(function (x) { return x.IS_QUOTATION_REQUIRED });
        if (DRAFT_FLAG == undefined) {
            $scope.CREATE_REQ_FORM.submitted = true;
        }
        var Advance_Amount_valid = parseFloat($scope.Create_REQ_Search.ADVANCE) > parseFloat($scope.Create_REQ_Search.TOTAL_AMOUNT);
        if ($scope.CREATE_REQ_FORM.$valid && QutotaionSelectContact.length == 0 || DRAFT_FLAG == 1) {
            var List = $scope.SUPPLIER_LIST.filter(function (x) { return x.SUPPLIER_NAME == $scope.Create_REQ_Search.SUPPLIER_NAME });
            if (List.length == 0) {
                $scope.$parent.ShowAlert("Error", 'Please select valid contact name', 3000);
            }
            else if (Advance_Amount_valid && DRAFT_FLAG == undefined) {
                $scope.$parent.ShowAlert("Error", 'Advanced amount cannot be greater than total amount.', 3000);
            }
            else {
                if (DRAFT_FLAG == 1 || confirm('Are you sure you want to submit?')) {
                    ptopobj.PO_HDR_ID = $scope.Create_REQ_Search.PO_HDR_ID;
                    ptopobj.CONTACT_ID = DRAFT_FLAG == 1 && List.length == 0 ? null : List[0].ID;
                    ptopobj.PO_DATE = $scope.Create_REQ_Search.PO_DATE;
                    ptopobj.DELIVERY_DATE = $scope.Create_REQ_Search.DELIVERY_DATE;
                    ptopobj.REFERENCE = $scope.Create_REQ_Search.REFERENCE;
                    ptopobj.XERO_BRANDING_THEME_ID = $scope.Create_REQ_Search.XERO_BRANDING_THEME_ID == undefined || $scope.Create_REQ_Search.XERO_BRANDING_THEME_ID == "" ? null : $scope.Create_REQ_Search.XERO_BRANDING_THEME_ID;
                    ptopobj.NOTE_FOR_APPROVERS = $scope.Create_REQ_Search.NOTE_FOR_APPROVERS;
                    ptopobj.PO_CURRENCY_ID = $scope.Create_REQ_Search.PO_CURRENCY_ID;
                    ptopobj.BASE_CURRENCY_ID = $scope.Create_REQ_Search.BASE_CURRENCY_ID;
                    if ($scope.Create_REQ_Search.BASE_CURRENCY_ID != $scope.Create_REQ_Search.PO_CURRENCY_ID) {
                        ptopobj.BASE_TO_PO_CONVERSION_RATE = $scope.Create_REQ_Search.BASE_TO_PO_CONVERSION_RATE;
                    }
                    else {
                        ptopobj.BASE_TO_PO_CONVERSION_RATE = 1;
                    }
                    ptopobj.TAX_TYPE = $scope.Create_REQ_Search.TAX_TYPE;

                    ptopobj.NET_AMOUNT = parseFloat($scope.Create_REQ_Search.NET_AMOUNT).toFixed(5); //NET;
                    ptopobj.TAX_AMOUNT = parseFloat($scope.Create_REQ_Search.TAX_AMOUNT).toFixed(5);//TAX;
                    ptopobj.TOTAL_AMOUNT = parseFloat($scope.Create_REQ_Search.TOTAL_AMOUNT).toFixed(5);//NET+TAX;
                    ptopobj.ADVANCE = parseFloat($scope.Create_REQ_Search.ADVANCE).toFixed(5);
                    ptopobj.DELIVERY_ADDRESS = $scope.Create_REQ_Search.DELIVERY_ADDRESS;
                    ptopobj.ATTENTION = $scope.Create_REQ_Search.ATTENTION;
                    ptopobj.PHONE = $scope.Create_REQ_Search.PHONE;
                    ptopobj.DELIVERY_INSTRUCTIONS = $scope.Create_REQ_Search.DELIVERY_INSTRUCTIONS;
                    ptopobj.AUTO_EMAIL_TO_SUPPLIER = $scope.Create_REQ_Search.AUTO_EMAIL_TO_SUPPLIER ? 1 : 0;
                    ptopobj.SUPPLIER_EMAIL = $scope.Create_REQ_Search.SUPPLIER_EMAIL;
                    ptopobj.IS_DRAFT = DRAFT_FLAG == 1 ? 1 : 0;
                    ptopobj.UPLOAD_IDS = "";
                    angular.forEach($scope.Create_REQ_Search.UploadedFiles, function (x) {
                        if (ptopobj.UPLOAD_IDS == "") {
                            ptopobj.UPLOAD_IDS = x.ID;
                        }
                        else {
                            ptopobj.UPLOAD_IDS = ptopobj.UPLOAD_IDS + "," + x.ID;
                        }
                    });

                    var Increatecount = 0;
                    angular.forEach($scope.CREATE_ITEM_LIST, function (LINE) {
                        var readonlyobj = new Object()
                        readonlyobj.PO_LINE_ID = LINE.PO_LINE_ID == undefined || LINE.PO_LINE_ID == "" || LINE.PO_LINE_ID == null ? 0 : parseInt(LINE.PO_LINE_ID);
                        readonlyobj.ITEM_NAME = LINE.ITEM_NAME;
                        readonlyobj.DESCRIPTION = LINE.DESCRIPTION;
                        readonlyobj.LINE_NO = LINE.LINE_NO;
                        readonlyobj.QUANTITY = DRAFT_FLAG == 1 && (LINE.QUANTITY == undefined || LINE.QUANTITY == null || LINE.QUANTITY == '') ? null : parseFloat(LINE.QUANTITY).toFixed(5);
                        readonlyobj.UNIT_PRICE = DRAFT_FLAG == 1 && (LINE.UNIT_PRICE == undefined || LINE.UNIT_PRICE == null || LINE.UNIT_PRICE == '') ? null : parseFloat(LINE.UNIT_PRICE).toFixed(5);
                        readonlyobj.DISCOUNT_PERCENT = DRAFT_FLAG == 1 && (LINE.DISCOUNT_PERCENT == undefined || LINE.DISCOUNT_PERCENT == null || LINE.DISCOUNT_PERCENT == '') ? null : parseFloat(LINE.DISCOUNT_PERCENT);
                        readonlyobj.ACCOUNT_ID = DRAFT_FLAG == 1 && LINE.ACCOUNT_DETAILS == undefined ? null : parseInt(LINE.ACCOUNT_DETAILS.TABLE_ID);
                        readonlyobj.ACCOUNT_DETAILS = DRAFT_FLAG == 1 && LINE.ACCOUNT_DETAILS == undefined ? null : LINE.ACCOUNT_DETAILS.CODE + "-" + LINE.ACCOUNT_DETAILS.NAME;

                        readonlyobj.TAX_RATE_ID = LINE.TAX_ID == undefined ? null : LINE.TAX_ID.ID;
                        readonlyobj.TAX_RATE = LINE.TAX_ID == undefined ? null : LINE.TAX_ID.RATE;
                        readonlyobj.TAX_RATE_DETAILS = DRAFT_FLAG == 1 && LINE.TAX_ID == undefined ? null : LINE.TAX_ID.NAME + ' (' + LINE.TAX_ID.RATE + '%)';
                        readonlyobj.AMOUNT = parseFloat(LINE.AMOUNT).toFixed(5);
                        readonlyobj.PR_PURCHASE_REQUEST_ID = null;

                        if (LINE.XERO_TRACKING_CATEGORIES != undefined && LINE.XERO_TRACKING_CATEGORIES.length > 0 && Increatecount == 0) {
                            angular.forEach(LINE.XERO_TRACKING_CATEGORIES, function (TR) {
                                var PO_LINE_CUST_FLD = new Object();
                                PO_LINE_CUST_FLD.PO_LINE_NO = LINE.LINE_NO;
                                PO_LINE_CUST_FLD.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID = DRAFT_FLAG == 1 && TR.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID == undefined ? null : TR.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID;
                                PO_LINE_CUST_FLD.APPROVAL_CHAIN_CUSTOM_FIELD_OPTIONS_MASTER_ID = DRAFT_FLAG == 1 && TR.SELECTED_CATEGORY_OPTION == undefined ? null : TR.SELECTED_CATEGORY_OPTION == undefined ? null : TR.SELECTED_CATEGORY_OPTION.APPROVAL_CHAIN_CUSTOM_FIELD_OPTIONS_MASTER_ID;
                                ptopobj.PO_LINE_CUSTOM_FIELDS.push(PO_LINE_CUST_FLD);
                            });
                        } else {
                            if (Increatecount == 0) {
                                var PO_LINE_CUST_FLD = new Object();
                                PO_LINE_CUST_FLD.PO_LINE_NO = null;
                                PO_LINE_CUST_FLD.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID = null;
                                PO_LINE_CUST_FLD.APPROVAL_CHAIN_CUSTOM_FIELD_OPTIONS_MASTER_ID = null;
                                ptopobj.PO_LINE_CUSTOM_FIELDS.push(PO_LINE_CUST_FLD);
                            }
                            Increatecount = 1;
                        }
                        readonlyobj.DELETE_FLAG = 0;
                        readonlyobj.UOM_NAME = DRAFT_FLAG == 1 && LINE.UOM_NAME == undefined || LINE.UOM_NAME == null || LINE.UOM_NAME == '' ? null : LINE.UOM_NAME;
                        readonlyobj.RECEIVING_TYPE_ID = DRAFT_FLAG == 1 && LINE.RECEIVING_TYPE_ID == undefined || LINE.RECEIVING_TYPE_ID == null || LINE.RECEIVING_TYPE_ID == '' ? null : LINE.RECEIVING_TYPE_ID;
                        ptopobj.PO_LINES.push(readonlyobj);
                    });
                    angular.forEach($scope.DELETE_CREATE_ITEM_LIST, function (LINE) {
                        var readonlyobj = new Object()
                        readonlyobj.PO_LINE_ID = parseInt(LINE.PO_LINE_ID);
                        readonlyobj.ITEM_NAME = null;
                        readonlyobj.DESCRIPTION = null;
                        readonlyobj.LINE_NO = null;
                        readonlyobj.QUANTITY = null;
                        readonlyobj.UNIT_PRICE = null;
                        readonlyobj.DISCOUNT_PERCENT = null;
                        readonlyobj.ACCOUNT_ID = null;
                        readonlyobj.ACCOUNT_DETAILS = null;
                        readonlyobj.TAX_RATE_ID = null;
                        readonlyobj.TAX_RATE = null;
                        readonlyobj.TAX_RATE_DETAILS = null;
                        readonlyobj.AMOUNT = null;
                        readonlyobj.PR_PURCHASE_REQUEST_ID = null;//REQuest Id
                        readonlyobj.DELETE_FLAG = 1;
                        readonlyobj.UOM_NAME = null;
                        readonlyobj.RECEIVING_TYPE_ID = null;
                        ptopobj.PO_LINES.push(readonlyobj);
                    });

                    if ($scope.CREATE_TERMS_AND_CONDITIONS_MASTER_LIST.length > 0) {
                        angular.forEach($scope.CREATE_TERMS_AND_CONDITIONS_MASTER_LIST, function (x) {
                            var readOnly = new Object();
                            readOnly.TABLE_ID = x.TABLE_ID == undefined ? null : x.TABLE_ID;
                            readOnly.TANDC_MASTER_ID = x.TANDC_MASTER_ID == undefined ? null : x.TANDC_MASTER_ID;
                            readOnly.TEXT = x.TEXT == undefined ? null : x.TEXT;
                            readOnly.SORT_ORDER = x.SORT_ORDER == undefined ? null : x.SORT_ORDER;
                            readOnly.DELETE_FLAG = 0;
                            ptopobj.PO_TERMS_AND_CONDITIONS.push(readOnly);
                        });
                    }
                    if ($scope.DELETE_CREATE_TERMS_AND_CONDITIONS_MASTER_LIST.length > 0) {
                        angular.forEach($scope.DELETE_CREATE_TERMS_AND_CONDITIONS_MASTER_LIST, function (x) {
                            var readOnly = new Object();
                            readOnly.TABLE_ID = x.TABLE_ID;
                            readOnly.TANDC_MASTER_ID = x.TANDC_MASTER_ID == undefined ? null : x.TANDC_MASTER_ID;
                            readOnly.TEXT = null;
                            readOnly.SORT_ORDER = null;
                            readOnly.DELETE_FLAG = 1;
                            ptopobj.PO_TERMS_AND_CONDITIONS.push(readOnly);
                        });
                    }
                    if ($scope.DELETE_CREATE_QUOTATION_LIST.length > 0) {
                        angular.forEach($scope.DELETE_CREATE_QUOTATION_LIST, function (QUO) {
                            var readOnly = new Object();
                            readOnly.TABLE_ID = QUO.TABLE_ID;
                            readOnly.XERO_CONTACT_ID = null;
                            readOnly.TOTAL_AMOUNT = null;
                            readOnly.COMMENTS = null;
                            readOnly.UPLOADS_ID = "";
                            readOnly.DELETE_FLAG = 1;
                            ptopobj.PO_QUOTATIONS.push(readOnly);
                        });
                    }

                    ptopobj.LINE_COUNT = ptopobj.PO_LINES.length;
                    ptopobj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
                    ptopobj.BRANCH_ID = $scope.Create_REQ_Search.BRANCH_ID;
                    ptopobj.USER_ID = parseInt($cookies.get("USERID"));
                    ptopobj.PROJECT_MASTER_ID = $scope.Create_REQ_Search.PROJECT_MASTER_ID == 0 ? null : $scope.Create_REQ_Search.PROJECT_MASTER_ID;
                    ptopobj.RESET_APPROVAL_CHAIN = 1;
                    ptopobj.OVER_BUDGET = 0;
                    ptopobj.OVER_BUDGET_PERCENTAGE = 0;
                    ptopobj.OVER_BUDGET_AMOUNT = 0;
                    if (ptopobj.PO_QUOTATIONS.length == 0 || DRAFT_FLAG == 1 && ptopobj.PO_QUOTATIONS.length == 0) {
                        var readOnly = new Object();
                        readOnly.TABLE_ID = null
                        readOnly.XERO_CONTACT_ID = null;
                        readOnly.TOTAL_AMOUNT = null;
                        readOnly.COMMENTS = null;
                        readOnly.UPLOADS_ID = null;
                        readOnly.DELETE_FLAG = null;
                        ptopobj.PO_QUOTATIONS.push(readOnly);
                    }
                    if (ptopobj.PO_TERMS_AND_CONDITIONS.length == 0 || DRAFT_FLAG == 1 && ptopobj.PO_TERMS_AND_CONDITIONS.length == 0) {
                        var readOnly = new Object();
                        readOnly.TABLE_ID = null;
                        readOnly.TANDC_MASTER_ID = null;
                        readOnly.TEXT = null;
                        readOnly.SORT_ORDER = null;
                        readOnly.DELETE_FLAG = null;
                        ptopobj.PO_TERMS_AND_CONDITIONS.push(readOnly);
                    }

                    angular.forEach($scope.P2P_CREATE_BUDGET_MASTER_LIST, function (val) {
                        var over_budget_amt_to_add = 0;
                        var rowcount = 1;
                        angular.forEach(val.BUDGET_DETAILS_LIST, function (item) {
                            if (val.DB_ACCOUNT_ID == 0) {
                                item.REMAINING_AMOUNT = item.REMAINING;
                            }
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
                                ReadOnlyApproval.OVER_BUDGET = item.LINE_ID == 2 && parseFloat(item.REMAINING_AMOUNT).toFixed(5) < 0 ? 1 : 0;
                            }
                            else {
                                ReadOnlyApproval.OVER_BUDGET = parseFloat(item.REMAINING_AMOUNT).toFixed(5) < 0 ? 1 : 0;
                            }
                            ReadOnlyApproval.PERIOD = item.PERIOD;
                            ReadOnlyApproval.ACCOUNT_DETAILS = val.GLACCOUNT_NAME;

                            if (parseFloat(item.REMAINING_AMOUNT).toFixed(5) < 0 && val.BUDGET_DETAILS_LIST.length == 2 && item.LINE_ID == 2 || parseFloat(item.REMAINING_AMOUNT).toFixed(5) < 0 && val.BUDGET_DETAILS_LIST.length == 1) {
                                ptopobj.OVER_BUDGET = ReadOnlyApproval.OVER_BUDGET;
                                let OverBudgetPercentage = (item.REMAINING_AMOUNT * -1 / item.TOTAL) * 100
                                if (OverBudgetPercentage.toFixed(2) > parseFloat(ptopobj.OVER_BUDGET_PERCENTAGE).toFixed(2)) {
                                    ptopobj.OVER_BUDGET_PERCENTAGE = parseFloat(OverBudgetPercentage).toFixed(2);
                                    over_budget_amt_to_add = over_budget_amt_to_add == 0 ? parseFloat(item.REMAINING_AMOUNT * -1) : (over_budget_amt_to_add < parseFloat(item.REMAINING_AMOUNT * -1) ? parseFloat(item.REMAINING_AMOUNT * -1) : over_budget_amt_to_add);
                                }
                            }

                            if (rowcount == val.BUDGET_DETAILS_LIST.length) {
                                ptopobj.OVER_BUDGET_AMOUNT = ptopobj.OVER_BUDGET_AMOUNT + over_budget_amt_to_add.toFixed(5);
                            }
                            ReadOnlyApproval.CREDIT_MEMO = parseFloat(item.MEMO).toFixed(5);
                            ptopobj.P2P_BUDGET_SNAPSHOT_TYPE.push(ReadOnlyApproval);
                            rowcount++;
                        });
                    });
                    if (ptopobj.P2P_BUDGET_SNAPSHOT_TYPE.length == 0) {
                        var ReadOnlyApproval = new Object();
                        ReadOnlyApproval.APPROVAL_HEADER_ID = null;// admin header go 
                        ReadOnlyApproval.APPROVAL_HEADER_STATUS_ID = null;// admin no status will go
                        ReadOnlyApproval.ACCOUNT_ID = null;
                        ReadOnlyApproval.YTD = null;
                        ReadOnlyApproval.TOTAL = null;
                        ReadOnlyApproval.REMAINING = null;
                        ReadOnlyApproval.CONSUMED = null;
                        ReadOnlyApproval.BOOKED = null;
                        ReadOnlyApproval.CURRENT = null;
                        ReadOnlyApproval.OVER_BUDGET = null;
                        ReadOnlyApproval.PERIOD = null;
                        ReadOnlyApproval.ACCOUNT_DETAILS = null;
                        ReadOnlyApproval.CREDIT_MEMO = null;
                        ptopobj.P2P_BUDGET_SNAPSHOT_TYPE.push(ReadOnlyApproval);
                    }
                    ptopobj.NO_OF_QUOTATIONS = ptopobj.PO_QUOTATIONS.length > 0 ? ptopobj.PO_QUOTATIONS.filter(function (x) { return x.DELETE_FLAG == 0 }).length : 0;
                    ptopobj.SETTING_45 = $scope.$parent.SETTING_USE_GROSS;
                    PrcCommMethods.P2P_API(ptopobj, 'INS_UPD_REQUISITION', 'PO').then(function (data) {
                        if (data.data > 1) {
                            $scope.CHANGE_FLAG = 0;
                            if (DRAFT_FLAG == 1) {
                                $scope.$parent.ShowAlert("Success", "Save as draft successfully ", 3000);
                                $scope.Create_REQ_Search.PO_HDR_ID = data.data;
                                $scope.CREATE_ITEM_LIST = [];
                                $scope.DELETE_CREATE_ITEM_LIST = [];
                                $scope.CREATE_TERMS_AND_CONDITIONS_MASTER_LIST = [];
                                $scope.DELETE_CREATE_TERMS_AND_CONDITIONS_MASTER_LIST = [];
                                $scope.CREATE_QUOTATION_LIST = [];
                                $scope.DELETE_CREATE_QUOTATION_LIST = [];
                                $scope.GET_CREATE_PO_BY_ID(data.data);
                            }
                            else {
                                $scope.$parent.ShowAlert("Success", "Submit for approval", 3000);
                                $scope.TAB_CLICK_REQ_FY(2);
                                //   $scope.GET_PURCHASE_REQUESTS_BY_BUYER(1);
                            }
                            //$scope.GET_PURCHASE_REQUESTS_BY_BUYER_PROCESSED(1);
                            //$scope.RESET_CREATE_REQ();
                            $scope.CREATE_REQ_FORM.submitted = false;
                        }
                        if (data.data == 0) {
                            $scope.$parent.ShowAlert("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                        }
                    });
                }
            }
            $scope.$parent.COMMON_CODE_CHANGE();
        }
        else {
            $scope.$parent.ShowAlert("Error", 'Please provide the mandatory details marked as red', 3000);
        }
    };
    $scope.DISCARD_PO = function () {
        $scope.DISCARD_PO_FORM.submitted = true;
        if ($scope.DISCARD_PO_FORM.$valid) {
            if (confirm('Are you sure you want to delete?')) {
                var ptopobj = new Object();
                ptopobj.PO_HDR_ID = $scope.REQ_PROC_Search.REQ_DETAILS.PO_HDR_ID;
                ptopobj.USER_ID = parseInt($cookies.get("USERID"));
                ptopobj.COMMENTS = $scope.DISCARD_PO_COMMENTS;
                PrcCommMethods.P2P_API(ptopobj, 'DISCARD_PO', 'PO').then(function (data) {
                    if (data.data == 1) {
                        $scope.$parent.ShowAlert("Success", "Deleted Successfully ", 3000);
                        $scope.GET_PURCHASE_REQUESTS_BY_BUYER(1);
                        $scope.GET_PURCHASE_REQUESTS_BY_BUYER_PROCESSED(1);
                        $scope.DISCARD_PO_COMMENTS = "";
                        $('#POP_DISCARD_PO').modal('hide');
                        $scope.DISCARD_PO_FORM.submitted = false;
                    }
                    if (data.data == 0) {
                        $scope.$parent.ShowAlert("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                    }
                });
            }
        }
    }
    $scope.INS_UPD_P2P_DELIVERY_ADDRESS = function () {
        $scope.DELIVERY_DETAILS_FORM.submitted = true;
        if ($scope.DELIVERY_DETAILS_FORM.$valid) {
            ModelObj = new Object();
            ModelObj.TABLE_ID = 0// $scope.DELIVERY_ADDRESS_SEARCH.TABLE_ID;
            ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            if ($scope.TAB_FLAG == 1) {
                ModelObj.BRANCH_ID = $scope.REQ_Search.REQUEST_LINE.BRANCH_ID;
            }
            else if ($scope.TAB_FLAG == 4) {
                ModelObj.BRANCH_ID = $scope.REQ_PROC_Search.BRANCH_ID;
            }
            ModelObj.DELIVERY_ADDRESS = $scope.DELIVERY_ADDRESS_SEARCH.DELIVERY_ADDRESS;
            ModelObj.ATTENTION = $scope.DELIVERY_ADDRESS_SEARCH.ATTENTION;
            ModelObj.PHONE = $scope.DELIVERY_ADDRESS_SEARCH.PHONE;
            ModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.P2P_API(ModelObj, 'INS_UPD_P2P_DELIVERY_ADDRESS', 'PO').then(function (data) {
                if (data.data == 1) {
                    if ($scope.TAB_FLAG == 1) {
                        $scope.GET_P2P_DELIVERY_ADDRESS($scope.REQ_Search.REQUEST_LINE);
                    }
                    else if ($scope.TAB_FLAG == 4) {
                        $scope.GET_P2P_DELIVERY_ADDRESS($scope.REQ_PROC_Search);
                    }
                    $scope.$parent.ShowAlert("Success", "Saved successfully ", 3000);
                    $('#DELIVERY_DETAILS').modal('hide');
                }
            });
        }
    }
    $scope.P2P_NEW_SUPPLIER_REQUEST = function () {
        $scope.SUPPLIER_FORM.submitted = true;
        if ($scope.SUPPLIER_FORM.$valid) {
            ModelObj = new Object();
            ModelObj.SUPPLIER_NAME = $scope.SUPPLIER_SEARCH.SUPPLIER_NAME;
            ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            ModelObj.BRANCH_ID = $scope.REQ_Search.REQUEST_LINE.BRANCH_ID;
            ModelObj.USER_ID = parseInt($cookies.get("USERID"));
            ModelObj.UPLOAD_IDS = "";

            if ($scope.SUPPLIER_SEARCH.UploadedFiles != undefined) {
                angular.forEach($scope.SUPPLIER_SEARCH.UploadedFiles, function (x) {
                    if (ModelObj.UPLOAD_IDS == "") {
                        ModelObj.UPLOAD_IDS = x.ID;
                    }
                    else {
                        ModelObj.UPLOAD_IDS = ModelObj.UPLOAD_IDS + "," + x.ID;
                    }
                });
            };
            PrcCommMethods.P2P_API(ModelObj, 'P2P_NEW_SUPPLIER_REQUEST', 'PO').then(function (data) {
                if (data.data == 1) {
                    $scope.$parent.ShowAlert("Success", "Contact details send successfully", 2000);
                    $scope.GET_PYMNT_SUPPLIER($scope.REQ_Search);
                    $scope.SUPPLIER_SEARCH = { IS_MULTI_FILE_UPLOAD_ALLOW: true, };
                    $('#POP_SUPPLIER').modal('hide');
                }
                else if (data.data == 0) {
                    $scope.$parent.ShowAlert("Error", $scope.$parent.SOMETHINGWENTWRONG, 2000);
                }
            });
        }
    }
    $scope.DISCARD_REQUISITION_POP = function () {
        $('#REQ_DIC_COMM').modal('show');
    }
    $scope.DISCARD_REQUISITION = function () {
        $scope.DISCARD_REQ_FORM.submitted = true;
        if ($scope.DISCARD_REQ_FORM.$valid) {
            if (confirm('Are you sure you want to cancel?')) {
                var ptopobj = new Object();
                if ($scope.TAB_FLAG == 1) {
                    ptopobj.PO_HDR_ID = $scope.REQ_Search.REQUEST_LINE.PO_HDR_ID;
                }
                else if ($scope.TAB_FLAG == 2) {
                    ptopobj.PO_HDR_ID = $scope.REQ_PROC_Search.REQ_DETAILS.PO_HDR_ID;
                }
                ptopobj.USER_ID = parseInt($cookies.get("USERID"));
                ptopobj.COMMENTS = $scope.REQ_DISCARD_COMMENTS;
                PrcCommMethods.P2P_API(ptopobj, 'DISCARD_REQUISITION', 'PO').then(function (data) {
                    if (data.data == 1) {
                        $scope.$parent.ShowAlert("Success", "Cancelled Successfully ", 3000);
                        if ($scope.TAB_FLAG == 1) {
                            $scope.GET_PURCHASE_REQUESTS_BY_BUYER(1);
                        }
                        else if ($scope.TAB_FLAG == 2) {
                            $scope.GET_PURCHASE_REQUESTS_BY_BUYER_PROCESSED(1);
                        }
                        $scope.POForm.submitted = false;
                        $scope.REQ_DISCARD_COMMENTS = "";
                        $('#REQ_DIC_COMM').modal('hide');
                    }
                    if (data.data == 0) {
                        $scope.$parent.ShowAlert("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                    }
                });
            }
        }
    }
    $scope.INS_UPD_TERMS_AND_CONDITIONS_MASTER = function (FLAG, SELECT_REQ) {
        $scope.TERMS_AND_CONDITIONS_FORM.submitted = true;
        if ($scope.TERMS_AND_CONDITIONS_FORM.$valid) {
            var ptopobj = new Object();
            ptopobj.TANDC_ID = 0;
            ptopobj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            ptopobj.USER_ID = parseInt($cookies.get("USERID"));
            ptopobj.BRANCH_ID = $scope.SELECTED_TERM_CONDITION.REQUEST_LINE.BRANCH_ID;
            ptopobj.TYPE = 1; // 1 PO  2 INVOICE DISCUSS
            ptopobj.ACTIVE = 1;
            ptopobj.TEXT = $scope.TERAM_CONDITION.TEXT;
            PrcCommMethods.ADMIN_API(ptopobj, 'INS_UPD_TERMS_AND_CONDITIONS_MASTER', 'PO').then(function (data) {
                if (data.data == 1) {
                    $scope.$parent.ShowAlert("Success", "Added Successfully ", 3000);
                    $scope.TERAM_CONDITION.TEXT = "";
                    $scope.GET_TERMS_AND_CONDITIONS_MASTER($scope.SELECTED_TERM_CONDITION.REQUEST_LINE);
                    $scope.TERMS_AND_CONDITIONS_FORM.submitted = false;
                    if (FLAG != 1) {
                        $('#TERMS_CONDITIONS').modal('hide');
                    }
                }
                if (data.data == 0) {
                    $scope.$parent.ShowAlert("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                }
            });
        }
    }

    $scope.$on('ngRepeatFinishedActionRender', function (ngRepeatFinishedEvent) {
        if ($scope.REQ_Search.PO_DATE != undefined && $scope.REQ_Search.PO_DATE != "" && $scope.REQ_Search.PO_DATE != null) {
            $scope.GET_P2P_BUDGET_BY_ACCOUNTS(1, $scope.REQ_Search.REQUEST_LINE, $scope.REQ_Search);
        }

    });
    $scope.$on('ngRepeatFinishedProcessRender', function (ngRepeatFinishedEvent) { });
    $scope.$on('ngRepeatFinishedPoAllRender', function (ngRepeatFinishedEvent) { });

    $scope.$parent.DateInputLoad("PO_REQ", 1);
    $scope.$parent.child_scope = $scope;

});
app.controller('EDIT_REQController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $interval) {
    $(".modal-backdrop").remove();
    $scope.ADD_MORE_QUOTATION_NAME = "Add More Quotation";
    $scope.ADD_MORE_TERMS_CONDITIONS_NAME = "Add More Terms & Conditions";
    $scope.ADD_MORE_ITEM_NAME = "Add a line";
    $scope.EDIT_REQ_Search = {
        CURRENCY_ID: parseInt($cookies.get("CURRENCY_ID")),
        TAX_TYPE: 2,
        IS_MULTI_FILE_UPLOAD_ALLOW: true,
        IS_MULTI_FILE_UPLOAD_ALLOW: true,
    }
    $scope.EDIT_BLANK_ITEM = {
        ITEM_NAME: '',
        LINE_NO: '',
        DESCRIPTION: '',
        QUANTITY: '',
        UNIT_PRICE: '',
        DISCOUNT_PERCENT: '',
        DELIVERY_INSTRUCTIONS: '',
        ACCOUNT_DETAILS: null,
        TAX_RATE: '',
        TAX_ID: null,
        TAX_TYPE: '',
        TRACKING_CATEGORY_IDS: '',
        AMOUNT: '',
        REQUISITION_HEADER_ID: '',
        REFERENCE_ID: '',
        STATUS_ID: '',
        XERO_TRACKING_CATEGORIES: [],
    }
    $scope.EDIT_BLANK_TERM_CONT = { TABLE_ID: null, TANDC_MASTER_ID: null, TEXT: "", SORT_ORDER: null, DELETE_FLAG: 0 };
    $scope.EDIT_BLANL_QUOTATION_LIST = { SUPPLIER_NAME: '', TABLE_ID: null, XERO_CONTACT_ID: null, TOTAL_AMOUNT: "", COMMENTS: null, UPLOADS_ID: null, DELETE_FLAG: null, UploadedFiles: [], IS_SELECTED_CONTACT: false };
    //{ ID: 3, NAME: 'No Tax' }
    $scope.EDIT_TAX_TYPE = [{ ID: 1, NAME: 'Tax Exclusive' },
    { ID: 2, NAME: 'Tax Inclusive' },

    ];
    $scope.EDIT_CURRENCY_TYPE = [{ ID: 1, NAME: 'Tax Exclusive' }, { ID: 2, NAME: 'Tax Inclusive' }, { ID: 3, NAME: 'No Tax' }];
    $scope.EDIT_RECEIVING_TYPE = [{ ID: 1, NAME: 'Quantity' }, { ID: 2, NAME: 'Amount' }]; //RECEIVING_TYPE_ID   1 FOR QTY WISE AND 2 FOR AMOUNT WISE
    $scope.EDIT_SPLIT_TYPE = [{ ID: 1, NAME: '2' }, { ID: 2, NAME: '3' }, { ID: 3, NAME: '4' }, { ID: 4, NAME: '5' }, { ID: 5, NAME: '6' }, { ID: 6, NAME: '7' }, { ID: 7, NAME: '8' }, { ID: 8, NAME: '9' }, { ID: 9, NAME: '10' }, { ID: 10, NAME: '11' }, { ID: 11, NAME: '12' }]; //RECEIVING_TYPE_ID   1 FOR QTY WISE AND 2 FOR AMOUNT WISE
    $scope.TAB_FLAG = 1;
    $scope.EDIT_P2P_ITEMS_LIST = [];
    $scope.EDIT_ITEM_LIST = []; $scope.EDIT_DELETE_ITEM_LIST = [];
    $scope.EDIT_DELETED_QUOTATION_FILE_LIST = [];
    $scope.EDIT_TERMS_AND_CONDITIONS_MASTER_LIST = []; $scope.EDIT_DELETE_TERMS_AND_CONDITIONS_MASTER_LIST = [];
    $scope.EDIT_DELETE_QUOTATION_LIST = []; $scope.EDIT_QUOTATION_LIST = [];
    $scope.EDIT_DELETE_EDIT_QUOTATION_LIST = []; $scope.EDIT_PROJECT_MASTER_LIST = [];
    $scope.EDIT_XERO_TRACKING_CATEGORIES = []; $scope.EDIT_XERO_TRACKING_CATEGORIES_OPTIONS = [];
    $scope.EDIT_SUPPLIER_LIST = []; $scope.EDIT_XERO_ACCOUNT_CODES = [];
    $scope.EDIT_CURRENCY_LIST = []; $scope.EDIT_XERO_BRANDING_THEMES_LIST = [];
    $scope.EDIT_P2P_ITEMS_LIST = []; $scope.EDIT_SELECTED_XERO_TRACKING_CATEGORIES_OPTIONS = [];
    $scope.EDIT_SELECTED_PROCESSED_XERO_TRACKING_CATEGORIES_OPTIONS = []; $scope.EDIT_SELECTED_XERO_TRACKING_CATEGORIES_OPTIONS = [];
    $scope.EDIT_P2P_DELIVERY_ADDRESS_LIST = []; $scope.EDIT_P2P_TERMS_AND_CONDITIONS_LIST = [];

    $scope.GET_XERO_TAXES = function (REQUEST_LINE, FLAG, LOAD_FLAG) {
        $scope.$parent.overlay_loadingNew = 'block';
        var CustmObj = new Object();
        CustmObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CustmObj.BRANCH_IDS = REQUEST_LINE.BRANCH_ID;
        CustmObj.BRANCH_ID = REQUEST_LINE.BRANCH_ID;//For P2P
        CustmObj.APPROVAL_TYPE_ID = 3;// PO and 4 invoice create onlu
        CustmObj.USER_ID = parseInt($cookies.get("USERID"));
        if (LOAD_FLAG == "IS_APPROVER") {
            PrcCommMethods.INVOICE_API(CustmObj, 'GET_XERO_TAXES').then(function (data) {
                if (data.data.Table != undefined) {
                    $scope.EDIT_XERO_TAXES = data.data.Table;
                    $scope.$parent.overlay_loadingNew = 'none';
                }
                else {
                    $scope.EDIT_XERO_TAXES = [];
                    $scope.$parent.overlay_loadingNew = 'none';
                }
                $scope.GET_APPROVAL_CUSTOM_FIELD_OPTIONS_MASTER(REQUEST_LINE, FLAG);
            });
        }
        if (LOAD_FLAG == "IS_BUYER") {
            PrcCommMethods.P2P_API(CustmObj, 'GET_P2P_TAXES', 'PO').then(function (data) {
                if (data.data.Table != undefined) {
                    $scope.EDIT_XERO_TAXES = data.data.Table;
                    $scope.$parent.overlay_loadingNew = 'none';
                }
                else {
                    $scope.EDIT_XERO_TAXES = [];
                    $scope.$parent.overlay_loadingNew = 'none';
                }
                $scope.GET_APPROVAL_CUSTOM_FIELD_OPTIONS_MASTER(REQUEST_LINE, FLAG);
            });
        }
    };
    $scope.GET_PYMNT_SUPPLIER = function (REQUEST_LINE, FLAG, LOAD_FLAG) {
        var PaymentModelObj = new Object();
        PaymentModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PaymentModelObj.BRANCH_LOGIN_ID = REQUEST_LINE.BRANCH_ID;
        PaymentModelObj.BRANCH_ID = REQUEST_LINE.BRANCH_ID;// FOR P2P
        PaymentModelObj.PAGE_NO = 0;
        PaymentModelObj.PAGE_SIZE = 0;
        PaymentModelObj.SUPPLIER_NAME = null;
        PaymentModelObj.FLAG = 0;
        PaymentModelObj.APPROVAL_TYPE_ID = 3;// PO and 4 invoice create only
        PaymentModelObj.USER_ID = parseInt($cookies.get("USERID"));
        if (LOAD_FLAG == "IS_APPROVER") {
            PrcCommMethods.PAYMENT_API(PaymentModelObj, 'GET_PYMNT_SUPPLIER').then(function (data) {
                if (data.data != undefined && data.data.Table.length > 0) {
                    $scope.EDIT_SUPPLIER_LIST = data.data.Table;
                    $('#AddCustomScroll_SHD').find('.dropdown-menu').addClass('custom-scrollbar');
                    $('#AddCustomScroll_EDIT').find('.dropdown-menu').addClass('custom-scrollbar');
                    $scope.GET_XERO_ACCOUNT_CODES(REQUEST_LINE, FLAG, LOAD_FLAG)
                } else {
                    $scope.EDIT_SUPPLIER_LIST = [];
                    $scope.GET_XERO_ACCOUNT_CODES(REQUEST_LINE, FLAG, LOAD_FLAG)
                }
            });
        }
        if (LOAD_FLAG == "IS_BUYER") {
            PrcCommMethods.P2P_API(PaymentModelObj, 'GET_P2P_SUPPLIERS', 'PO').then(function (data) {
                if (data.data != undefined && data.data.Table.length > 0) {
                    $scope.EDIT_SUPPLIER_LIST = data.data.Table;
                    $('#AddCustomScroll_SHD').find('.dropdown-menu').addClass('custom-scrollbar');
                    $('#AddCustomScroll_EDIT').find('.dropdown-menu').addClass('custom-scrollbar');
                    $scope.GET_XERO_ACCOUNT_CODES(REQUEST_LINE, FLAG, LOAD_FLAG)
                } else {
                    $scope.EDIT_SUPPLIER_LIST = [];
                    $scope.GET_XERO_ACCOUNT_CODES(REQUEST_LINE, FLAG, LOAD_FLAG)
                }
            });
        }

    }
    $scope.GET_XERO_ACCOUNT_CODES = function (REQUEST_LINE, FLAG, LOAD_FLAG) {
        //$scope.$parent.overlay_loadingNew = 'block';
        var CusModelObj = new Object();
        CusModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CusModelObj.BRANCH_ID = REQUEST_LINE.BRANCH_ID;
        CusModelObj.APPROVAL_TYPE_ID = 3;// PO and 4 invoice create onlu
        CusModelObj.USER_ID = parseInt($cookies.get("USERID"));
        CusModelObj.PROJECT_MASTER_ID = REQUEST_LINE.PROJECT_MASTER_ID;
        CusModelObj.ADMIN_FLAG = 0;
        if (LOAD_FLAG == "IS_APPROVER") { CusModelObj.ADMIN_FLAG = 1; }
        if (LOAD_FLAG == "IS_BUYER" || LOAD_FLAG == "IS_APPROVER") {
            PrcCommMethods.P2P_API(CusModelObj, 'GET_P2P_ACCOUNT_CODES', 'PO').then(function (data) {
                if (data.data.Table != undefined) {
                    $scope.EDIT_XERO_ACCOUNT_CODES = data.data.Table;
                    $scope.EDIT_XERO_ACCOUNT_CODES = angular.copy(data.data.Table.filter(p => p.CODE != null && p.CODE != ''));
                    $scope.ITEM_LIST_EDIT_VALID();
                }
                else {
                    $scope.EDIT_XERO_ACCOUNT_CODES = [];
                }
                if (FLAG != "PROJECT") {
                    $scope.GET_XERO_TAXES(REQUEST_LINE, FLAG, LOAD_FLAG);
                }
                if (FLAG == "PROJECT") {
                    $scope.P2P_EDIT_BUDGET_MASTER_LIST = [];
                    $scope.BUDGET_TEXT_VALIDATION = "Fetching Budget...";
                    $scope.GET_P2P_BUDGET_BY_ACCOUNTS(FLAG, REQUEST_LINE, $scope.EDIT_REQ_Search);
                }
            });
        }
    };
    $scope.GET_XERO_BRANDING_THEMES = function (REQUEST_LINE, FLAG, LOAD_FLAG) {
        var ModelObj = new Object();
        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        ModelObj.BRANCH_ID = REQUEST_LINE.BRANCH_ID;
        ModelObj.APPROVAL_TYPE_ID = 3;// PO and 4 invoice create onlu
        ModelObj.USER_ID = parseInt($cookies.get("USERID"));
        if (LOAD_FLAG == "IS_APPROVER") {
            PrcCommMethods.ADMIN_API(ModelObj, 'GET_XERO_BRANDING_THEMES').then(function (data) {
                if (data.data.Table != undefined) {
                    $scope.EDIT_XERO_BRANDING_THEMES_LIST = data.data.Table;
                }
                else {
                    $scope.EDIT_XERO_BRANDING_THEMES_LIST = [];
                }
            });
        }
        if (LOAD_FLAG == "IS_BUYER") {
            PrcCommMethods.P2P_API(ModelObj, 'GET_P2P_BRANDING_THEMES', "PO").then(function (data) {
                if (data.data.Table != undefined) {
                    $scope.EDIT_XERO_BRANDING_THEMES_LIST = data.data.Table;
                }
                else {
                    $scope.EDIT_XERO_BRANDING_THEMES_LIST = [];
                }
            });
        }
    }
    $scope.GET_P2P_ITEMS = function (REQUEST_LINE, FLAG) {
        var CusModelObj = new Object();
        CusModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CusModelObj.BRANCH_ID = REQUEST_LINE.BRANCH_ID;
        CusModelObj.SEARCH_TEXT = "";
        CusModelObj.PAGE_NO = 0;
        PrcCommMethods.P2P_API(CusModelObj, 'GET_P2P_ITEMS', 'PO').then(function (data) {
            if (data.data.Table != undefined) {
                $scope.EDIT_P2P_ITEMS_LIST = data.data.Table;
            }
        });
    }
    $scope.GET_P2P_DELIVERY_ADDRESS = function (REQ_DETAILS) {
        ModelObj = new Object();
        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        ModelObj.BRANCH_ID = REQ_DETAILS.BRANCH_ID;
        PrcCommMethods.P2P_API(ModelObj, 'GET_P2P_DELIVERY_ADDRESS', 'PO').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.EDIT_P2P_DELIVERY_ADDRESS_LIST = data.data.Table
            }
            else {
                $scope.EDIT_P2P_DELIVERY_ADDRESS_LIST = [];
            }
        });
    }

    $scope.GET_TERMS_AND_CONDITIONS_MASTER = function (REQ_DETAILS) {
        ModelObj = new Object();
        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        ModelObj.BRANCH_ID = REQ_DETAILS.BRANCH_ID;
        ModelObj.TYPE = 1;
        ModelObj.ACTIVE = 1;
        PrcCommMethods.ADMIN_API(ModelObj, 'GET_TERMS_AND_CONDITIONS_MASTER', 'PO').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.EDIT_P2P_TERMS_AND_CONDITIONS_LIST = data.data.Table
            }
            else {
                $scope.EDIT_P2P_TERMS_AND_CONDITIONS_LIST = [];
            }
        });
    }
    $scope.GET_DENSE_RANK_EDIT = function () {
        ModelObj = new Object();
        ModelObj.DENSE_RANK_OBJ = [];
        angular.forEach($scope.EDIT_QUOTATION_LIST, function (x, index) {
            if (x.TOTAL_AMOUNT > 0) {
                var readonly = new Object();
                readonly.NAME = x.CONTACT_NAME;
                readonly.RANK_AMOUNT = parseFloat(x.TOTAL_AMOUNT).toFixed(5);
                readonly.RANK = 0// parseFloat(x.RANK).toFixed(5);
                readonly.Serial = index;
                ModelObj.DENSE_RANK_OBJ.push(readonly);
            }
        });
        PrcCommMethods.P2P_API(ModelObj, 'GET_DENSE_RANK', 'PO').then(function (data) {
            angular.forEach(data.data, function (x) {
                $scope.EDIT_QUOTATION_LIST[x.Serial].RANK = x.Rank;
            });
        });
    }
    $scope.GetIntegrationDetails = function (isstart) {
        var PaymentModelObj = new Object();
        PaymentModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        PaymentModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PaymentModelObj.BRANCH_ID = $scope.EDIT_REQ_Search.BRANCH_ID;
        PaymentModelObj.INTEGRATION_SYSTEM_ID = 16;
        PrcCommMethods.PAYMENT_API(PaymentModelObj, 'GET_INTEGRATION_DETAILS_BY_CUST_ENT_BRNH').then(function (data) {
            $scope.IntegrationDetails = data.data.filter(function (x) { return x.IS_OUTBOUND == false })[0];
            if ($scope.IntegrationDetails != undefined && $scope.IntegrationDetails.INTEGRATION_STATUS == 2) {
                $scope.IntegrationDetails.ShowSyncBtn = true;
                $scope.IntegrationDetails.PageLoad = false;
                $scope.StopResyncInterval();
                if ($scope.TAB_FLAG == 1 && isstart == 2) {
                    $scope.GET_PYMNT_SUPPLIER($scope.EDIT_REQ_Search);
                }
                else if ($scope.TAB_FLAG == 3 && isstart == 2) {
                    // $scope.GET_APPROVAL_HEADERS_FOR_ADMIN(1, 1, false, 1);
                };
            }
            else {
                //$scope.StartResyncInterval();
                $scope.IntegrationDetails = {};
                $scope.IntegrationDetails.PageLoad = false;
                $scope.IntegrationDetails.ShowSyncBtn = false;
            }
            // if ($scope.IntegrationDetails.)
        });
    }
    $scope.GetIntegrationDetails(1);
    $scope.GET_CURRENCY = function () {
        var CustmObj = new Object();
        PrcCommMethods.HR_API(CustmObj, 'GET_CURRENCY').then(function (data) {
            if (data.data.Table != undefined) {
                $scope.CURRENCY_LIST = angular.copy(data.data.Table);
                $scope.EDIT_CURRENCY_LIST = angular.copy(data.data.Table);
                var item = data.data.Table.filter(function (x) { return x.CURRENCY_ID == parseInt($cookies.get("CURRENCY_ID")) })
                if (item.length > 0) {

                    $scope.EDIT_REQ_Search.PO_CURRENCY_ID = angular.copy(item[0].CURRENCY_ID);
                    $scope.EDIT_REQ_Search.PO_CURRENCY_NAME = angular.copy(item[0].DISPLAY_TEXT);
                    $scope.EDIT_REQ_Search.BASE_CURRENCY_ID = angular.copy(item[0].CURRENCY_ID);
                    $scope.EDIT_REQ_Search.BASE_CURRENCY_NAME = angular.copy(item[0].DISPLAY_TEXT);

                    $scope.EDIT_REQ_Search.PO_CURRENCY_ID = angular.copy(item[0].CURRENCY_ID);
                    $scope.EDIT_REQ_Search.PO_CURRENCY_NAME = angular.copy(item[0].DISPLAY_TEXT);
                    $scope.EDIT_REQ_Search.BASE_CURRENCY_ID = angular.copy(item[0].CURRENCY_ID);
                    $scope.EDIT_REQ_Search.BASE_CURRENCY_NAME = angular.copy(item[0].DISPLAY_TEXT);
                }
            }
            else {
                $scope.EDIT_CURRENCY_LIST = [];
            }
        });

    }


    $scope.GET_CONVERSION_RATE = function (FLAG) {
        ModelObj = new Object();
        ModelObj.FROM_CURRENCY_ID = $scope.EDIT_REQ_Search.BASE_CURRENCY_ID;
        ModelObj.TO_CURRENCY_ID = $scope.EDIT_REQ_Search.PO_CURRENCY_ID;
        ModelObj.DATE = $scope.EDIT_REQ_Search.PO_DATE == undefined || $scope.EDIT_REQ_Search.PO_DATE == "" || $scope.EDIT_REQ_Search.PO_DATE == null ? (new Date()).toDateString() : new Date($scope.EDIT_REQ_Search.PO_DATE).toDateString();
        PrcCommMethods.P2P_API(ModelObj, 'GET_CONVERSION_RATE', 'PO').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.EDIT_REQ_Search.BASE_TO_PO_CONVERSION_RATE = parseFloat(data.data.Table[0].Column1).toFixed(5);
                $scope.EDIT_REQ_Search.COPY_BASE_TO_PO_CONVERSION_RATE = parseFloat(data.data.Table[0].Column1).toFixed(5);
            }
        });
    };



    $scope.GET_APPROVAL_CUSTOM_FIELD_OPTIONS_MASTER = function (REQUEST_LINE, FLAG) {
        var CusModelObj = new Object();
        CusModelObj.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID = 0;
        CusModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CusModelObj.BRANCH_ID = REQUEST_LINE.BRANCH_ID;
        PrcCommMethods.P2P_API(CusModelObj, 'GET_APPROVAL_CUSTOM_FIELD_OPTIONS_MASTER', 'PO').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.EDIT_XERO_TRACKING_CATEGORIES = data.data.MASTER;
                $scope.EDIT_XERO_TRACKING_CATEGORIES_OPTIONS = data.data.Table;
                $scope.GET_EDIT_PO_BY_ID(REQUEST_LINE, FLAG);
            }
            else {
                $scope.GET_EDIT_PO_BY_ID(REQUEST_LINE, FLAG);
                $scope.EDIT_XERO_TRACKING_CATEGORIES = [];
                $scope.EDIT_XERO_TRACKING_CATEGORIES_OPTIONS = [];
            }

        });
    };

    $scope.GET_BRANCH_LIST = function (BRN_LIST) {
        var UserModelObj = new Object();
        UserModelObj.INTEGRATION_SYSTEM_ID = 16
        UserModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        UserModelObj.USER_ID = parseInt($cookies.get("USERID"));
        UserModelObj.MODULE_ID = parseInt($cookies.get("MODULE_ID"));
        PrcCommMethods.CASHUP_API(UserModelObj, 'GET_BRANCH_LIST').then(function (data) {
            if (data.data.length > 0) {
                $scope.EDIT_BRANCH_LOGIN_LIST = data.data;
            };
        });
    }
    $scope.GET_PROJECT_MASTER = function (REQUEST_LINE, FLAG) {
        var UserModelObj = new Object();
        UserModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        UserModelObj.BRANCH_ID = REQUEST_LINE.BRANCH_ID;
        UserModelObj.PROJECT_NAME = "";
        PrcCommMethods.ADMIN_API(UserModelObj, 'GET_PROJECT_MASTER').then(function (data) {
            if (data.data.Table1.length > 0) {
                $scope.EDIT_PROJECT_MASTER_LIST = data.data.Table1;
            } else {
                $scope.EDIT_PROJECT_MASTER_LIST = [];
            };
        });
    }

    $scope.GET_P2P_BUDGET_BY_ACCOUNTS = function (FLAG, LINE, HEADER, CHANGE_FLAG) {
        var ptopobj = new Object();
        ptopobj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        ptopobj.BRANCH_ID = LINE.BRANCH_ID;///RECEIVING_TYPE_ID   1 FOR QTY WISE AND 2 FOR AMOUNT WISE
        ptopobj.USER_ID = parseInt($cookies.get("USERID"));
        ptopobj.YEAR = new Date(HEADER.PO_DATE).getFullYear();
        ptopobj.MONTH = new Date(HEADER.PO_DATE).getMonth() + 1;
        if (HEADER.PROJECT_MASTER_ID == null || HEADER.PROJECT_MASTER_ID == undefined || HEADER.PROJECT_MASTER_ID == "") {
            ptopobj.PROJECT_MASTER_ID = 0;
        } else {
            ptopobj.PROJECT_MASTER_ID = CHANGE_FLAG == 1 ? HEADER.PROJECT_MASTER_ID : HEADER.PROJECT_MASTER_ID;// LINE.PROJECT_MASTER_ID;
        }
        // ptopobj.PROJECT_MASTER_ID = CHANGE_FLAG == 1 ? HEADER.PROJECT_MASTER_ID : HEADER.PROJECT_MASTER_ID;// LINE.PROJECT_MASTER_ID;
        ptopobj.REFERENCE_ID = HEADER.PO_HDR_ID;
        ptopobj.REFERENCE_TYPE = 1//-1 FOR PO AND 2 FOR INVOICE
        ptopobj.SETTING_45 = $scope.$parent.SETTING_USE_GROSS;
        ptopobj.XERO_ACCOUNTS_FOR_BUDGET = []
        angular.forEach($scope.EDIT_ITEM_LIST, function (LINE) {
            var readonlyobj = new Object()
            var Accountlist = $scope.EDIT_XERO_ACCOUNT_CODES.filter(function (x) { return x.CODE + ' - ' + x.NAME == LINE.ACCOUNT_NAME });
            if (Accountlist.length > 0) {
                LINE.IS_ACCOUNT_VALID = false;
                LINE.ACCOUNT_DETAILS = Accountlist[0];
                readonlyobj.ACCOUNT_ID = parseInt(Accountlist[0].TABLE_ID);
                LINE.ACCOUNT_ID = parseInt(Accountlist[0].TABLE_ID);
                readonlyobj.ACCOUNT_DETAILS = LINE.ACCOUNT_NAME == undefined ? "" : LINE.ACCOUNT_NAME;
            }
            else {
                LINE.IS_ACCOUNT_VALID = true;
            }
            var alreadyAccount = ptopobj.XERO_ACCOUNTS_FOR_BUDGET.filter(function (x) { return x.ACCOUNT_ID == readonlyobj.ACCOUNT_ID });
            if (alreadyAccount.length == 0 && Accountlist.length > 0) {
                ptopobj.XERO_ACCOUNTS_FOR_BUDGET.push(readonlyobj);
            }

        });
        if (ptopobj.XERO_ACCOUNTS_FOR_BUDGET.length > 0) {
            PrcCommMethods.P2P_API(ptopobj, 'GET_P2P_BUDGET_BY_ACCOUNTS', 'PO').then(function (data) {
                if (data != null && data.data != null) {
                    $scope.EDIT_REQ_Search.BUDGET_NAME = data.data.BUDGET_NAME;
                    $scope.P2P_EDIT_BUDGET_MASTER_LIST = data.data.Budget_Account_Data_List;
                    $scope.COPY_P2P_EDIT_BUDGET_MASTER_LIST = angular.copy(data.data.Budget_Account_Data_List);
                    $scope.EDIT_REQ_Search.HIDE_SHOW = true;
                }
                else {
                    $scope.BUDGET_TEXT_VALIDATION = "There is no budget allocated in the GL-Account";
                    $scope.P2P_EDIT_BUDGET_MASTER_LIST = [];
                }
                $scope.Fn_CHANGE_SPLIT_EDIT()
            });
        } else {
            $scope.P2P_EDIT_BUDGET_MASTER_LIST = [];
            $scope.BUDGET_TEXT_VALIDATION = "Please select valid GL-Account";
            $scope.Fn_CHANGE_SPLIT_EDIT()
        }
    }
    $scope.IntegrationDetails = new Object();
    $scope.IntegrationDetails.PageLoad = true;
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
    $scope.StopResyncInterval = function () { $interval.cancel(promise); };
    function IntervalExecution() { $scope.GetIntegrationDetails(2); }
    $scope.CLICK_BRANCH_FY = function (BL) {
        $scope.EDIT_REQ_Search.BRANCH_ID = BL.BRANCH_ID;
        $scope.EDIT_REQ_Search.UploadedFiles = [];
        $scope.GET_PYMNT_SUPPLIER($scope.EDIT_REQ_Search, 3);
        $scope.GET_XERO_ACCOUNT_CODES($scope.EDIT_REQ_Search, 3)
        $scope.GET_XERO_BRANDING_THEMES($scope.EDIT_REQ_Search, 3);
        $scope.GET_P2P_ITEMS($scope.EDIT_REQ_Search);
        $scope.GET_P2P_DELIVERY_ADDRESS($scope.EDIT_REQ_Search);
        $scope.GET_TERMS_AND_CONDITIONS_MASTER($scope.EDIT_REQ_Search);
        $scope.GetIntegrationDetails();
    }
    $scope.RESET_EDIT_REQ = function () {
        $scope.EDIT_REQ_Search.PO_DATE = $filter('date')(new Date());
        $scope.EDIT_REQ_Search.DELIVERY_DATE = "";
        $scope.EDIT_REQ_Search.REFERENCE = "";
        $scope.EDIT_REQ_Search.NOTE_FOR_APPROVERS = "";
        $scope.EDIT_REQ_Search.TAX_TYPE = "";
        $scope.EDIT_REQ_Search.DELIVERY_ADDRESS = "";
        $scope.EDIT_REQ_Search.ATTENTION = "";
        $scope.EDIT_REQ_Search.PHONE = "";
        $scope.EDIT_REQ_Search.DELIVERY_INSTRUCTIONS = "";
        $scope.EDIT_REQ_Search.AUTO_EMAIL_TO_SUPPLIER = "";
        $scope.EDIT_REQ_Search.UploadedFiles = [];
        $scope.EDIT_REQ_Search.SUPPLIER_NAME = "";
        $scope.EDIT_REQ_Search.SELECT_CURRENCY = {};
        $scope.EDIT_REQ_Search.DEFAULT_CURRENCY = {};
        $scope.EDIT_REQ_Search.TAX_TYPE = 1;
        $scope.EDIT_REQ_Search.PROJECT_MASTER_ID = null;
        $scope.EDIT_ITEM_LIST = [];
        $scope.EDIT_REQ_FORM.submitted = false;
    };
    $scope.GET_EDIT_PO_BY_ID = function (REQ, FLAG) {
        ModelObj = new Object();
        ModelObj.PO_HDR_ID = REQ.PO_HDR_ID
        PrcCommMethods.P2P_API(ModelObj, 'GET_PO_BY_ID', 'PO').then(function (data) {
            if (data.data.Table.length > 0) {
                var SUPList = $scope.EDIT_SUPPLIER_LIST.filter(function (x) { return x.ID == data.data.Table[0].CONTACT_ID });
                if (SUPList.length > 0) { $scope.EDIT_REQ_Search.SUPPLIER_NAME = SUPList[0].SUPPLIER_NAME; }
                var TAX_TYPEList = $scope.TAX_TYPE.filter(function (x) { return x.ID == data.data.Table[0].TAX_TYPE });
                if (TAX_TYPEList.length > 0) {
                    data.data.Table[0].TAX_NAME = TAX_TYPEList[0].NAME;
                    data.data.Table[0].TAX_ID = TAX_TYPEList[0].ID;
                }
                if (data.data.Table[0].BASE_CURRENCY_ID == data.data.Table[0].PO_CURRENCY_ID) {
                    var item = $scope.EDIT_CURRENCY_LIST.filter(function (x) { return x.CURRENCY_ID == data.data.Table[0].PO_CURRENCY_ID });
                    $scope.EDIT_REQ_Search.PO_CURRENCY_ID = angular.copy(item[0].CURRENCY_ID);
                    $scope.EDIT_REQ_Search.PO_CURRENCY_NAME = angular.copy(item[0].DISPLAY_TEXT);
                    $scope.EDIT_REQ_Search.BASE_CURRENCY_ID = angular.copy(item[0].CURRENCY_ID);
                    $scope.EDIT_REQ_Search.BASE_CURRENCY_NAME = angular.copy(item[0].DISPLAY_TEXT);
                }
                else {
                    var CurrBaseList = $scope.EDIT_CURRENCY_LIST.filter(function (x) { return x.CURRENCY_ID == data.data.Table[0].BASE_CURRENCY_ID });
                    var CurrPOList = $scope.EDIT_CURRENCY_LIST.filter(function (x) { return x.CURRENCY_ID == data.data.Table[0].PO_CURRENCY_ID });

                    $scope.EDIT_REQ_Search.PO_CURRENCY_ID = angular.copy(CurrPOList[0].CURRENCY_ID);
                    $scope.EDIT_REQ_Search.PO_CURRENCY_NAME = angular.copy(CurrPOList[0].DISPLAY_TEXT);
                    $scope.EDIT_REQ_Search.BASE_CURRENCY_ID = angular.copy(CurrBaseList[0].CURRENCY_ID);
                    $scope.EDIT_REQ_Search.BASE_CURRENCY_NAME = angular.copy(CurrBaseList[0].DISPLAY_TEXT);
                }
                $scope.EDIT_REQ_Search.PO_HDR_ID = REQ.PO_HDR_ID;
                $scope.EDIT_REQ_Search.OLD_TOTAL_AMOUNT = angular.copy(REQ.TOTAL_AMOUNT);


                $scope.EDIT_REQ_Search.PO_DATE = data.data.Table[0].PO_DATE == "" || data.data.Table[0].PO_DATE == null ? $filter('date')(new Date()) : $filter('date')(new Date(data.data.Table[0].PO_DATE));
                $scope.EDIT_REQ_Search.DELIVERY_DATE = data.data.Table[0].DELIVERY_DATE == "" || data.data.Table[0].DELIVERY_DATE == null ? "" : $filter('date')(new Date(data.data.Table[0].DELIVERY_DATE));
                $scope.EDIT_REQ_Search.REFERENCE = data.data.Table[0].REFERENCE;
                $scope.EDIT_REQ_Search.NOTE_FOR_APPROVERS = data.data.Table[0].NOTE_FOR_APPROVERS;
                $scope.EDIT_REQ_Search.TAX_TYPE = data.data.Table[0].TAX_TYPE;
                $scope.EDIT_REQ_Search.DELIVERY_ADDRESS = data.data.Table[0].DELIVERY_ADDRESS;
                $scope.EDIT_REQ_Search.ATTENTION = data.data.Table[0].ATTENTION;
                $scope.EDIT_REQ_Search.PHONE = data.data.Table[0].PHONE;
                $scope.EDIT_REQ_Search.DELIVERY_INSTRUCTIONS = data.data.Table[0].DELIVERY_INSTRUCTIONS;
                $scope.EDIT_REQ_Search.AUTO_EMAIL_TO_SUPPLIER = data.data.Table[0].AUTO_EMAIL_TO_SUPPLIER;
                $scope.EDIT_REQ_Search.BASE_TO_PO_CONVERSION_RATE = data.data.Table[0].BASE_TO_PO_CONVERSION_RATE;
                $scope.EDIT_REQ_Search.COPY_BASE_TO_PO_CONVERSION_RATE = angular.copy(data.data.Table[0].BASE_TO_PO_CONVERSION_RATE);
                $scope.EDIT_REQ_Search.PROJECT_MASTER_ID = data.data.Table[0].PROJECT_MASTER_ID;
                $scope.EDIT_REQ_Search.PROJECT_MASTER_ID_OLD = angular.copy(data.data.Table[0].PROJECT_MASTER_ID);
                $scope.EDIT_REQ_Search.XERO_BRANDING_THEME_ID = data.data.Table[0].XERO_BRANDING_THEME_ID;
                $scope.EDIT_REQ_Search.BRANCH_ID = data.data.Table[0].BRANCH_ID;
                $scope.EDIT_REQ_Search.ADVANCE = data.data.Table[0].ADVANCE;
                $scope.EDIT_REQ_Search.SUPPLIER_EMAIL = data.data.Table[0].SUPPLIER_EMAIL;
                $scope.EDIT_REQ_Search.SELECTED_SUPPLIER_ID = data.data.Table[0].CONTACT_ID;
                $scope.EDIT_SELECTED_XERO_TRACKING_CATEGORIES_OPTIONS = data.data.Table2;

                $scope.EDIT_REQ_Search.SPLIT_TYPE_ID = data.data.Table[0].SPLIT_TYPE == 0 ? null : data.data.Table[0].SPLIT_TYPE;
                $scope.EDIT_REQ_Search.COPY_SPLIT_TYPE_ID = angular.copy($scope.EDIT_REQ_Search.SPLIT_TYPE_ID);


                $scope.EDIT_ITEM_LIST = data.data.Table1;
                $scope.EDIT_ITEM_LIST_OLD = angular.copy(data.data.Table1);


                if (data.data.Table3.length > 0) {
                    $scope.EDIT_TERMS_AND_CONDITIONS_MASTER_LIST = data.data.Table3;
                }
                if (data.data.Table4.length > 0) {
                    $scope.EDIT_QUOTATION_LIST = data.data.Table4;
                }
                if (data.data.Table5.length > 0) {
                    $scope.PO_SPLIT_EDIT_LIST = data.data.Table5;
                    $scope.DELETE_PO_SPLIT_EDIT_LIST = angular.copy(data.data.Table5);
                    $scope.Fn_SPLIT_REQ_EDIT($scope.EDIT_REQ_Search);
                }
                $scope.$parent.$parent.overlay_loadingNew = 'none';
            }
        });
    }

    $scope.GET_PURCHASE_REQUESTS_BY_BUYER = function (FLAG) {
        if (FLAG == 1) {
            $scope.REQ_Search.PAGE_NO = 1;
            $scope.PURCHASE_REQUESTS_BY_BUYER_LIST = [];
        }
        ModelObj = new Object();
        ModelObj.NAME = $scope.REQ_Search.NAME;
        ModelObj.START_DATE = $scope.REQ_Search.START_DATE;
        ModelObj.END_DATE = $scope.REQ_Search.END_DATE;
        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        ModelObj.BRANCH_ID = $scope.REQ_Search.FILTER_BRANCH_ID;
        ModelObj.PAGE_NO = $scope.REQ_Search.PAGE_NO;
        ModelObj.PAGE_SIZE = $scope.REQ_Search.PAGE_SIZE;
        ModelObj.URGENT_REQUEST = $scope.REQ_Search.FILTER_URGENT_REQUESTS == null ? -1 : $scope.PurchaseRequestSearch.FILTER_URGENT_REQUESTS;        //-1 // all 0 false 1 true
        ModelObj.PRIVILAGE_134 = $scope.CheckSubModuleAccess(134) ? 1 : 0;//-- 0/1 ON THE BASIS OF PRIV 134
        ModelObj.USER_ID = parseInt($cookies.get("USERID"));
        ModelObj.STATUS_IDS = "";
        ModelObj.PR_NUMBER = "";
        ModelObj.ACTION_REQUIRED = 1;// --0 for all 1 for action required and 2 for processed
        PrcCommMethods.P2P_API(ModelObj, 'GET_PURCHASE_REQUESTS_BY_BUYER', 'PO').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.PURCHASE_REQUESTS_BY_BUYER_LIST = $scope.PURCHASE_REQUESTS_BY_BUYER_LIST.concat(data.data.Table);
                if (FLAG == 1) {
                    $scope.PURCHASE_REQUEST_CLICK(data.data.Table[0], 1);
                }
                if (data.data.Table.length < $scope.REQ_Search.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.REQ_Search.PAGE_NO = parseInt($scope.REQ_Search.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else {
                if ($scope.REQ_Search.length == 0) { }
                $scope.GetData = false;
            }
        });
    }

    $scope.InitiateEditItemList = function (PRL, FLAG) {
        PRL.EDIT_XERO_TRACKING_CATEGORIES = angular.copy($scope.EDIT_XERO_TRACKING_CATEGORIES);
        if (PRL.ACCOUNT_ID != undefined && FLAG == 1) {
            var XAC = $scope.EDIT_XERO_ACCOUNT_CODES.filter(function (x) { return x.TABLE_ID == PRL.ACCOUNT_ID });
            if (XAC.length > 0) {
                PRL.ACCOUNT_DETAILS = XAC[0];
                PRL.ACCOUNT_NAME = XAC[0].CODE + ' - ' + XAC[0].NAME;
            }
        }
        if (PRL.TAX_RATE_ID != undefined && FLAG == 1) {
            var TAX = $scope.EDIT_XERO_TAXES.filter(function (x) { return x.ID == PRL.TAX_RATE_ID });
            if (TAX.length > 0) {
                PRL.TAX_ID = TAX[0];
            }
        }

        if (PRL.ACCOUNT_ID != undefined && FLAG == 3) {
            var XAC = $scope.EDIT_XERO_ACCOUNT_CODES.filter(function (x) { return x.TABLE_ID == PRL.ACCOUNT_ID });
            if (XAC.length > 0) {
                PRL.ACCOUNT_DETAILS = XAC[0];
                PRL.ACCOUNT_NAME = XAC[0].CODE + ' - ' + XAC[0].NAME;
            }
        }
        if (PRL.TAX_RATE_ID != undefined && FLAG == 3) {
            var TAX = $scope.EDIT_XERO_TAXES.filter(function (x) { return x.ID == PRL.TAX_RATE_ID });
            if (TAX.length > 0) {
                PRL.TAX_ID = TAX[0];
            }
        }
        if (PRL.RECEIVING_TYPE_ID != undefined) {
            var RECEIVING_TYPE = $scope.EDIT_RECEIVING_TYPE.filter(function (x) { return x.ID == PRL.RECEIVING_TYPE_ID });
            if (RECEIVING_TYPE.length > 0) {
                PRL.RECEIVING_TYPE_NAME = RECEIVING_TYPE[0].NAME;
            }
        }

    }
    $scope.InitiateEditXeroTrackingCategories = function (item, Trackingcat_index, PRL, FLAG) {
        if (item.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID > 0 && $scope.EDIT_SELECTED_XERO_TRACKING_CATEGORIES_OPTIONS.length > 0) {
            var select_cat = $scope.EDIT_SELECTED_XERO_TRACKING_CATEGORIES_OPTIONS.filter(p => p.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID == item.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID && PRL.PO_LINE_ID == p.PO_LINE_ID)[0];
            if (select_cat != undefined && select_cat != null) {
                var text = $scope.EDIT_XERO_TRACKING_CATEGORIES_OPTIONS.filter(function (x) { return x.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID == select_cat.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID && x.APPROVAL_CHAIN_CUSTOM_FIELD_OPTIONS_MASTER_ID == select_cat.APPROVAL_CHAIN_CUSTOM_FIELD_OPTIONS_MASTER_ID });
                item.SELECTED_CATEGORY_OPTION = text[0];
            }
        }
    }
    $scope.$parent.selectedEditsupplier = 0;

    $scope.InitiateEditQuotation = function (item, LAST, FLAG, index) {
        item.INDEX_VALUE = index;
        item.IS_MULTI_FILE_UPLOAD_ALLOW = true;
        if (item != undefined && item.TABLE_ID > 0) {
            if (item.UploadedFiles == undefined) {
                item.UploadedFiles = [];
            }
            $scope.$parent.GET_UPLOADS(item, 35, item.TABLE_ID);
        }
        if (LAST == true) {
            $scope.ChangeQAmt(item, FLAG);
        }
        if ($scope.EDIT_REQ_Search.SELECTED_SUPPLIER_ID == null && item.INDEX_VALUE !== undefined || $scope.EDIT_REQ_Search.SELECTED_SUPPLIER_ID == undefined && item.INDEX_VALUE !== undefined) {
            $scope.$parent.selectedEditsupplier = item.INDEX_VALUE;
            $scope.selectedEditsupplier = item.INDEX_VALUE;
        }
        else if ($scope.EDIT_REQ_Search.SELECTED_SUPPLIER_ID == item.XERO_CONTACT_ID && item.INDEX_VALUE !== undefined) {
            $scope.$parent.selectedEditsupplier = item.INDEX_VALUE;
            $scope.selectedEditsupplier = item.INDEX_VALUE;
        }

    };
    $scope.InginitEditBudget = function (LINE, FLAG) {
        if (FLAG == 1) {
            LINE.CONSUMED_AMOUNT = 0;
            LINE.INAPPROVAL_AMOUNT = 0;
            var PO = $scope.P2P_EDIT_BUDGET_PO_LIST.filter(function (x) { return x.ACCOUNT_ID == LINE.XERO_ACCOUNT_ID });
            var BILL = $scope.P2P_EDIT_BUDGET_BILL_LIST.filter(function (x) { return x.ACCOUNT_ID == LINE.XERO_ACCOUNT_ID });
            if (PO.length > 0 && BILL.length > 0) {
                LINE.CONSUMED_AMOUNT = PO[0].PO_APPROVED + BILL[0].INVOICE_APPROVED;
                LINE.INAPPROVAL_AMOUNT = PO[0].PO_PENDING + BILL[0].INVOICE_PENDING;
            }
            else if (PO.length > 0) {
                LINE.CONSUMED_AMOUNT = PO[0].PO_APPROVED;
                LINE.INAPPROVAL_AMOUNT = PO[0].PO_PENDING;
            }
            else if (BILL.length > 0) {
                LINE.CONSUMED_AMOUNT = BILL[0].INVOICE_APPROVED;
                LINE.INAPPROVAL_AMOUNT = BILL[0].INVOICE_PENDING;
            }
        }

    }
    $scope.Inittotaleditreq = function (parm_line, parm_m, index) {
        parm_line.TOTAL_BUDGET = 0;
        var linedetail = [];
        var itemdetail = [];
        $scope.remaningitemeditdetail = [];
        $scope.ACCOUNT_ITEMDETAIL_EDIT = [];

        angular.forEach($scope.MONTH_EDIT_LIST, function (_m, index) {
            linedetail = linedetail.concat(_m.ITEM_LIST.filter(function (x) { return x.LINE_NO == parm_line.LINE_NO }));
            itemdetail = itemdetail.concat(_m.ITEM_LIST);
            if (_m.FLAG == 1) {
                $scope.remaningitemeditdetail = $scope.remaningitemeditdetail.concat(_m.ITEM_LIST);
            }
        });
        $scope.MONTH_EDIT_LIST[$scope.MONTH_EDIT_LIST.length - 1].ITEM_LIST[parm_line.ITEM_INDEX].TOTAL_BUDGET = angular.copy($filter('sumOfValue')(linedetail, 'BUDGET'));
        // $scope.REM_AMOUNT_LEFT_EDIT = parseFloat($scope.MONTH_EDIT_LIST[$scope.MONTH_EDIT_LIST.length - 1].ITEM_LIST[parm_line.ITEM_INDEX].TOTAL_BUDGET).toFixed(2);
        $scope.ACCOUNT_ITEMDETAIL_EDIT = itemdetail.filter(function (_m) { return new Date($scope.EDIT_REQ_Search.PO_DATE).getMonth() == new Date(_m.START_DATE).getMonth() && new Date($scope.EDIT_REQ_Search.PO_DATE).getFullYear() == new Date(_m.START_DATE).getFullYear() })




        //parm_line.TOTAL_BUDGET = 0;
        //$scope.ACCOUNT_ITEMDETAIL = [];
        //var linedetail = [];
        //var itemdetail = [];
        //$scope.remaningitemdetail = [];
        //angular.forEach($scope.MONTH_LIST, function (_m, index) {
        //    linedetail = linedetail.concat(_m.ITEM_LIST.filter(function (x) { return x.LINE_NO == parm_line.LINE_NO }));
        //    itemdetail = itemdetail.concat(_m.ITEM_LIST);
        //    if (_m.FLAG == 1) {
        //        $scope.remaningitemdetail = $scope.remaningitemdetail.concat(_m.ITEM_LIST);
        //    }
        //});
        //$scope.MONTH_LIST[$scope.MONTH_LIST.length - 1].ITEM_LIST[parm_line.ITEM_INDEX].TOTAL_BUDGET = angular.copy($filter('sumOfValue')(linedetail, 'BUDGET'));
        //// $scope.REM_AMOUNT_LEFT = parseFloat($scope.MONTH_LIST[$scope.MONTH_LIST.length - 1].ITEM_LIST[parm_line.ITEM_INDEX].TOTAL_BUDGET).toFixed(2);
        //$scope.ACCOUNT_ITEMDETAIL = itemdetail.filter(function (_m) { return new Date($scope.REQ_Search.PO_DATE).getMonth() == new Date(_m.START_DATE).getMonth() && new Date($scope.REQ_Search.PO_DATE).getFullYear() == new Date(_m.START_DATE).getFullYear() })


    }
    $scope.TextReturn = function (NAME) {
        let F = ""; let M = ""; let L = "";
        if (NAME != undefined) {
            let NM = NAME.split(' ');
            if (NM.length == 1) {
                F = NM[0].charAt(0);
            }

            if (NM.length > 1) {
                F = NM[0].charAt(0);
                M = NM[1].charAt(0);
            }
            if (NM.length > 2) {
                L = NM[2].charAt(0);
            }
        }
        return F + '' + (L != "" ? L : M);
    }

    $scope.PAGE_LOAD_EDIT_REQ = function (REQUEST_LINE, FLAG, LOAD_FLAG, HEADER_DTLS, TAB_FLAG) {
        $scope.GET_CURRENCY();
        $scope.EDIT_DELETED_QUOTATION_FILE_LIST = [];
        $scope.EDIT_ITEM_LIST = [];
        $scope.MONTH_EDIT_LIST = [];
        $scope.PO_SPLIT_EDIT_LIST = [];
        $scope.EDIT_QUOTATION_LIST = [];
        $scope.DELETE_MONTH_EDIT_LIST = [];
        $scope.DELETE_PO_SPLIT_EDIT_LIST = [];
        $scope.$parent.selectedEditsupplier = 0;
        $scope.RESET_EDIT_REQ();
        $scope.LOAD_FLAG = LOAD_FLAG;
        $scope.TAB_FLAG = TAB_FLAG;
        $scope.EDIT_REQ_Search.REQUEST_LINE = {};
        $scope.EDIT_REQ_Search.UploadedFiles = [];
        $scope.GET_PYMNT_SUPPLIER(REQUEST_LINE, FLAG, LOAD_FLAG);
        $scope.EDIT_REQ_Search.HEADER_DTLS = HEADER_DTLS;
        $scope.EDIT_REQ_Search.REQUEST_LINE = angular.copy(REQUEST_LINE);
        $scope.EDIT_REQ_Search.REQUEST_LINE.UploadedFiles = [];

        //  $scope.GET_XERO_ACCOUNT_CODES(REQUEST_LINE, FLAG, LOAD_FLAG) move to GET_PYMNT_SUPPLIER
        $scope.GET_XERO_BRANDING_THEMES(REQUEST_LINE, FLAG, LOAD_FLAG);
        $scope.GET_PROJECT_MASTER(REQUEST_LINE, FLAG, LOAD_FLAG);
        $scope.GET_P2P_ITEMS(REQUEST_LINE);
        $scope.GET_P2P_DELIVERY_ADDRESS(REQUEST_LINE);
        $scope.GET_TERMS_AND_CONDITIONS_MASTER(REQUEST_LINE);
        $scope.$parent.GET_UPLOADS($scope.EDIT_REQ_Search, 32, REQUEST_LINE.PO_HDR_ID);
    }

    $scope.SetEdititemValues = function (Supplier, index) {
        $('.AddCustomScroll_itemEditREQ').find('.dropdown-menu').addClass('custom-scrollbar');
    }
    $scope.SetValues = function (Supplier, index) {
        $('.AddCustomScroll_SHD').find('.dropdown-menu').addClass('custom-scrollbar');
        $('.AddCustomScroll_CREATE').find('.dropdown-menu').addClass('custom-scrollbar');
    }

    $scope.SetQValues = function (Supplier, index) {
        $('.AddCustomScroll_Contact').find('.dropdown-menu').addClass('custom-scrollbar');
    }
    $scope.SetQuotationValues = function (Supplier, index) {
        var List = $scope.EDIT_SUPPLIER_LIST.filter(function (x) { return x.SUPPLIER_NAME == Supplier.CONTACT_NAME });
        Supplier.INVALID = false;
        if (List.length == 0) {
            Supplier.INVALID = true;
            $scope.CHANGE_CONTACT_NAME_EDIT_Fn(Supplier, List, FLAG, index);
        } else {
            if ($scope.$parent.selectedEditsupplier == index) {
                $scope.CHANGE_CONTACT_NAME_EDIT_Fn(Supplier, List, 1);
            } else {
                Supplier.XERO_CONTACT_ID = List[0].ID;
            };
        };
        $('.AddCustomScroll_Contact').find('.dropdown-menu').addClass('custom-scrollbar');
    }

    $scope.SetQuotationValues = function (Supplier, index) {
        var List = $scope.EDIT_SUPPLIER_LIST.filter(function (x) { return x.SUPPLIER_NAME == Supplier.CONTACT_NAME });
        Supplier.INVALID = false;
        if (List.length == 0) {
            Supplier.INVALID = true;
        }
        else {
            if ($scope.$parent.selectedEditsupplier == index) {
                $scope.CHANGE_CONTACT_NAME_Fn(Supplier, List, 1);
            } else {
                Supplier.XERO_CONTACT_ID = List[0].ID;
            };
        };
    }

    $scope.SetContactValues = function (Supplier, _bind_flag) {
        var List = $scope.EDIT_SUPPLIER_LIST.filter(function (x) { return x.SUPPLIER_NAME == $scope.EDIT_REQ_Search.SUPPLIER_NAME });
        $scope.SELECT_SUPPLIER_LIST = [];
        if (List.length > 0) {
            $scope.SELECT_EDIT_SUPPLIER_LIST = List
            Supplier.XERO_CONTACT_ID = List[0].ID;
            if (_bind_flag == 1) {
                $scope.EDIT_REQ_Search.SELECTED_SUPPLIER_ID = List[0].ID;
                $scope.EDIT_REQ_Search.SUPPLIER_EMAIL = List[0].EMAILADDRESS;
            }
        }
    }

    $scope.ADD_MORE_ITEM_EDIT = function () {
        $scope.EDIT_BLANK_ITEM.IS_NEW = true;
        $scope.EDIT_ITEM_LIST.push(angular.copy($scope.EDIT_BLANK_ITEM));
        if ($scope.EDIT_REQ_Search.SPLIT_TYPE_ID > 0) {
            $scope.Fn_SPLIT_REQ_EDIT($scope.EDIT_REQ_Search, 2)
        };
    }
    $scope.ADD_MORE_TERM_CON_EDIT = function () {
        if ($scope.EDIT_TERMS_AND_CONDITIONS_MASTER_LIST.length > 0) {
            var SORT_ORDER = $scope.EDIT_TERMS_AND_CONDITIONS_MASTER_LIST[$scope.EDIT_TERMS_AND_CONDITIONS_MASTER_LIST.length - 1].SORT_ORDER;
            $scope.EDIT_BLANK_TERM_CONT.SORT_ORDER = SORT_ORDER + 1;
        } else {
            $scope.EDIT_BLANK_TERM_CONT.SORT_ORDER = 1;
        };
        $scope.EDIT_TERMS_AND_CONDITIONS_MASTER_LIST.push(angular.copy($scope.EDIT_BLANK_TERM_CONT));
        $('.AddCustomScroll_Contact').find('.dropdown-menu').addClass('custom-scrollbar');
    }
    $scope.ADD_MORE_QUOTATION_EDIT = function () {
        $scope.EDIT_QUOTATION_LIST.push(angular.copy($scope.EDIT_BLANL_QUOTATION_LIST));
        $('.AddCustomScroll_Contact').find('.dropdown-menu').addClass('custom-scrollbar');
    }
    $scope.ADD_ABOVE_EDIT = function (LINE, index) {
        var SORT_ORDER = angular.copy(LINE.SORT_ORDER);
        angular.forEach($scope.EDIT_TERMS_AND_CONDITIONS_MASTER_LIST, function (val, valindex) {
            if (SORT_ORDER == val.SORT_ORDER) {
                val.SORT_ORDER = val.SORT_ORDER - 1;
            }
            else if ((SORT_ORDER - 1) == val.SORT_ORDER) {
                val.SORT_ORDER = val.SORT_ORDER + 1;
            }
        })
    }
    $scope.ADD_BELOW_EDIT = function (LINE, index) {
        var SORT_ORDER = angular.copy(LINE.SORT_ORDER);
        angular.forEach($scope.EDIT_TERMS_AND_CONDITIONS_MASTER_LIST, function (val, valindex) {
            if (SORT_ORDER == val.SORT_ORDER) {
                val.SORT_ORDER = val.SORT_ORDER + 1;
            }
            else if ((SORT_ORDER + 1) == val.SORT_ORDER) {
                val.SORT_ORDER = val.SORT_ORDER - 1;
            }
        })
    }

    $scope.ADD_REQUESTOR_ATTACHMENT_FY = function (LINE) {
        var Modelobj = new Object()
        Modelobj.MULTI_UPLOAD_LIST = [];
        if ($scope.REQ_Search.REQUEST_LINE.UploadedFiles != undefined) {
            angular.forEach($scope.REQ_Search.REQUEST_LINE.UploadedFiles, function (Uploads, index) {
                var readonly = new Object()
                readonly.RELATIVE_ID = index + '' + Uploads.CREATED_BY + '' + Uploads.ID + '' + 32;
                readonly.UPLOAD_TYPE_ID = 32;
                readonly.FILE_PATH = Uploads.FILE_PATH;
                readonly.ORIGINAL_FILE_NAME = Uploads.ORIGINAL_FILE_NAME;
                readonly.NEW_FILE_NAME = Uploads.SERVER_FILE_NAME;
                readonly.TABLE_ID = 0;
                readonly.USER_ID = parseInt($cookies.get("USERID"));
                readonly.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
                Modelobj.MULTI_UPLOAD_LIST.push(readonly);
            });

            PrcCommMethods.P2P_API(Modelobj, 'MULTI_UPLOAD', 'PO').then(function (data) {
                if (data.data.Table1.length > 0) {
                    if (LINE.UploadedFiles == undefined) {
                        LINE.UploadedFiles = [];
                    }
                    LINE.UploadedFiles = data.data.Table1;
                }
                if (data.data == 0) {
                    $scope.$parent.ShowAlert("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                }
            });
        };
    }

    $scope.REMOVE_LINE_ITEM_EDIT = function (index, LINE) {
        if (LINE.PO_LINE_ID == undefined || LINE.PO_LINE_ID == "" || LINE.PO_LINE_ID == null) {
            $scope.EDIT_ITEM_LIST.splice(index, 1);
        }
        else {
            $scope.EDIT_DELETE_ITEM_LIST.push(LINE);
            $scope.EDIT_ITEM_LIST.splice(index, 1);
        }
    }
    $scope.REMOVE_SUPPLIER_FILTE = function (index) {
        $scope.SUPPLIER_SEARCH.UploadedFiles.splice(index, 1);
    }

    $scope.REMOVE_FILE_QUOTATION_EDIT = function (index, LINE, Array, INPUT_ID) {
        if (LINE.ID > 0) {
            //$scope.$parent.DELETE_UPLOAD_ALL(Array, LINE, index, 2);

            var readOnly = new Object();
            readOnly.TABLE_ID = angular.copy(LINE.ID);
            $scope.EDIT_DELETED_QUOTATION_FILE_LIST.push(readOnly);
            angular.element("input[id='" + INPUT_ID + index + "']").val(null);
            Array.splice(index, 1);
        }
        else {
            Array.splice(index, 1);
            angular.element("input[id='" + INPUT_ID + index + "']").val(null);
        }
        $scope.$parent.Files = [];
    };

    $scope.REMOVE_FILTE_TERM_CON_EDIT = function (index, LINE) {
        if (LINE.TABLE_ID > 0) {
            $scope.EDIT_DELETE_TERMS_AND_CONDITIONS_MASTER_LIST.push(LINE);
            $scope.EDIT_TERMS_AND_CONDITIONS_MASTER_LIST.splice(index, 1);
        } else {
            $scope.EDIT_TERMS_AND_CONDITIONS_MASTER_LIST.splice(index, 1);
        }
    };
    $scope.REMOVE_FILTE_QUOTATION_EDIT = function (index, LINE, FIRST, INPUT_ID) {
        if (LINE.TABLE_ID > 0) {
            $scope.EDIT_DELETE_QUOTATION_LIST.push(LINE);
            $scope.EDIT_QUOTATION_LIST.splice(index, 1);
        }
        else {
            $scope.EDIT_QUOTATION_LIST.splice(index, 1);
        }
        $scope.GET_DENSE_RANK_EDIT();
    };
    $scope.REMOVE_FILTE_EDIT = function (index, LINE) {
        if (LINE.ID > 0) {
            $scope.$parent.DELETE_UPLOAD_ALL($scope.EDIT_REQ_Search.UploadedFiles, LINE, index, 1);
        }
        else {
            $scope.EDIT_REQ_Search.UploadedFiles.splice(index, 1);
        }
    }

    $scope.EDIT_FORM_CLOSE = function () {
        $('#EDIT_REQ').modal('hide');
    }

    $scope.TAXPERCENTAGE_CHANGE = function (TAX_TYPE, LINE) {
        if (TAX_TYPE != null) {
            if (LINE.TAX_RATE == undefined) {
                LINE.TAX_RATE = 0;
            }
            LINE.TAX_RATE = LINE.TAX_ID.RATE;
        }
        $scope.Fn_SPLIT_REQ_EDIT($scope.EDIT_REQ_Search, 2);
    };
    $scope.SetAccountValues = function () {
        $('.AddCustomScroll_Account').find('.dropdown-menu').addClass('w-30 custom-scrollbar');
    }
    $scope.ITEM_LIST_EDIT_VALID = function (FLAG) {
        angular.forEach($scope.EDIT_ITEM_LIST, function (LINE) {
            if (LINE.IS_NEW == false || LINE.IS_NEW == undefined) {
                var readonlyobj = new Object()
                var Accountlist = $scope.EDIT_XERO_ACCOUNT_CODES.filter(function (x) { return x.CODE + ' - ' + x.NAME == LINE.ACCOUNT_NAME });
                if (Accountlist.length > 0) {
                    LINE.IS_ACCOUNT_VALID = false;
                    LINE.ACCOUNT_DETAILS = Accountlist[0];
                }
                else {
                    LINE.IS_ACCOUNT_VALID = true;
                }
                LINE.ACCOUNT_ID = parseInt(LINE.ACCOUNT_ID);
                readonlyobj.ACCOUNT_ID = parseInt(LINE.ACCOUNT_ID);
                readonlyobj.ACCOUNT_DETAILS = LINE.ACCOUNT_NAME;
            }
            else {
                LINE.IS_NEW = false;
            }
            //var alreadyAccount = ptopobj.XERO_ACCOUNTS_FOR_BUDGET.filter(function (x) { return x.ACCOUNT_ID == readonlyobj.ACCOUNT_ID });
            //if (alreadyAccount.length == 0) {
            //    ptopobj.XERO_ACCOUNTS_FOR_BUDGET.push(readonlyobj);
            //}
        });
    }

    $scope.ChangeQAmt = function (LINE, FLAG) {
        //  angular.forEach($filter('sortBy')($scope.EDIT_QUOTATION_LIST, 'TOTAL_AMOUNT'), function (val, index) { val.RANK = index + 1; });
        $scope.GET_DENSE_RANK_EDIT();
    }
    $scope.Changeproject = function () {
        $scope.P2P_EDIT_BUDGET_MASTER_LIST = [];
        $scope.BUDGET_TEXT_VALIDATION = "Fetching Budget...";
        $scope.EDIT_REQ_Search.BRANCH_ID = $scope.EDIT_REQ_Search.REQUEST_LINE.BRANCH_ID;
        $scope.GET_XERO_ACCOUNT_CODES($scope.EDIT_REQ_Search, 'PROJECT', $scope.LOAD_FLAG);
    }
    $scope.ChangeEditBudget = function () {
        if ($scope.EDIT_REQ_Search.PO_DATE != undefined && $scope.EDIT_REQ_Search.PO_DATE != "" &&
            $scope.EDIT_REQ_Search.PO_DATE != null) {
            $scope.BUDGET_TEXT_VALIDATION = "Fetching Budget...";
            $scope.P2P_BUDGET_MASTER_LIST = [];
            $scope.EDIT_REQ_Search.BRANCH_ID = $scope.EDIT_REQ_Search.REQUEST_LINE.BRANCH_ID;
            $scope.EDIT_REQ_Search.PO_HDR_ID = $scope.EDIT_REQ_Search.REQUEST_LINE.PO_HDR_ID;
            $scope.GET_P2P_BUDGET_BY_ACCOUNTS(3, $scope.EDIT_REQ_Search.REQUEST_LINE, $scope.EDIT_REQ_Search);
        }
        else {
            $scope.BUDGET_TEXT_VALIDATION = "Please Select Account to Show Budget";
        }
    }
    $scope.ChangeEditBudget_OLD = function (FLAG) {
        if (FLAG == 'PROJECT') {
            $scope.EDIT_REQ_Search.BRANCH_ID = $scope.EDIT_REQ_Search.REQUEST_LINE.BRANCH_ID;
            $scope.GET_XERO_ACCOUNT_CODES($scope.EDIT_REQ_Search, FLAG, $scope.LOAD_FLAG);
        }
        else {
            $scope.ITEM_LIST_EDIT_VALID();
            $scope.EDIT_REQ_Search.BRANCH_ID = $scope.EDIT_REQ_Search.REQUEST_LINE.BRANCH_ID;
            $scope.EDIT_REQ_Search.PO_HDR_ID = $scope.EDIT_REQ_Search.REQUEST_LINE.PO_HDR_ID;
            $scope.GET_P2P_BUDGET_BY_ACCOUNTS(3, $scope.EDIT_REQ_Search, $scope.EDIT_REQ_Search);
        }
    }
    $scope.ChangeBudgetEditfy = function () {

        var validitem = $scope.EDIT_ITEM_LIST.filter(function (x) { return x.IS_ACCOUNT_VALID == true });
        if (validitem.length > 0) {
            $scope.$parent.ShowAlert("Error", 'Please provide valid account to continue', 3000);
        }
        else {

            if ($scope.EDIT_REQ_Search.PO_DATE != undefined && $scope.EDIT_REQ_Search.PO_DATE != ""
                && $scope.EDIT_REQ_Search.PO_DATE != null) {
                $scope.BUDGET_TEXT_VALIDATION = "Fetching Budget...";
                $scope.P2P_EDIT_BUDGET_MASTER_LIST = [];
                $scope.EDIT_REQ_Search.BRANCH_ID = $scope.EDIT_REQ_Search.REQUEST_LINE.BRANCH_ID;
                $scope.EDIT_REQ_Search.PO_HDR_ID = $scope.EDIT_REQ_Search.REQUEST_LINE.PO_HDR_ID;
                $scope.GET_P2P_BUDGET_BY_ACCOUNTS(3, $scope.EDIT_REQ_Search, $scope.EDIT_REQ_Search);
            }
        }
    }
    $scope.CHANGE_CURRENCY_EDIT = function () {
        if ($scope.EDIT_REQ_Search.BASE_CURRENCY_ID == $scope.EDIT_REQ_Search.PO_CURRENCY_ID) {
            $scope.EDIT_REQ_Search.BASE_TO_PO_CONVERSION_RATE = 1;
            $scope.EDIT_REQ_Search.COPY_BASE_TO_PO_CONVERSION_RATE = 1;
        }
        else {
            $scope.GET_CONVERSION_RATE(1);
        }
    }

    $scope.Fn_CHANGE_SPLIT_EDIT = function () {
        $scope.Fn_SPLIT_REQ_EDIT($scope.EDIT_REQ_Search, 2);
    }
    $scope.Fn_CHANGE_TAX_TYPE_EDIT = function () {
        $scope.Fn_SPLIT_REQ_EDIT($scope.EDIT_REQ_Search, 2);
    }
    $scope.Fn_CANCEL_SPLIT_EDIT = function () {
        if ($scope.MONTH_EDIT_LIST.length > 0) {
            angular.forEach($scope.MONTH_EDIT_LIST, function (_m) {
                item = angular.copy(_m.ITEM_LIST);
                $scope.DELETE_MONTH_EDIT_LIST = $scope.DELETE_MONTH_EDIT_LIST.concat(item);
            });
        }
        $scope.remaningitemeditdetail = [];
        $scope.MONTH_EDIT_LIST = [];
        $scope.PO_SPLIT_EDIT_LIST = [];
        $scope.EDIT_REQ_Search.SPLIT_TYPE_ID = null;
        $scope.REM_AMOUNT_LEFT_EDIT = 0;
    }
    $scope.Fn_SPLIT_REQ_EDIT = function (LINE, FLAG) {
        if (FLAG == 1) {
            $scope.EDIT_REQ_Search.SPLIT_TYPE_ID = 1;
        }
        if ($scope.EDIT_REQ_Search.SPLIT_TYPE_ID > 0) {
            var Newdate = new Date('01/01/2010');
            var SELECT_YEAR = angular.copy(new Date(LINE.PO_DATE)).getFullYear();
            var DATE = new Date(new Date(Newdate).setFullYear(SELECT_YEAR));
            var MouthStart = new Date(LINE.PO_DATE).getMonth();
            var MonthEnd = MouthStart + $scope.EDIT_REQ_Search.SPLIT_TYPE_ID;
            LINE.START_DATE = new Date(DATE);
            LINE.END_DATE = new Date(new Date(new Date(DATE).setMonth(11)).setDate(31));
            $scope.MONTH_EDIT_LIST = [];
            if ($scope.MONTH_EDIT_LIST != undefined && $scope.MONTH_EDIT_LIST.length > 0) {
                angular.forEach($scope.MONTH_EDIT_LIST, function (_m) {
                    var _itemlist = angular.copy($scope.EDIT_ITEM_LIST);
                    if (_m.ITEM_LIST.length != _itemlist) {
                        angular.forEach(_itemlist, function (_val_loop_item, index) {
                            _val_loop_item.ITEM_INDEX = index;
                            var _item_result = _m.ITEM_LIST.filter(function (_val_item) { return _val_item.LINE_NO == _val_loop_item.LINE_NO });
                            if (_item_result.length == 0) {
                                _m.ITEM_LIST.push(_val_loop_item);
                            }
                        });
                    }
                });
            }
            else {
                $scope.MONTH_EDIT_LIST = [];
                var count = MouthStart;
                for (var i = MouthStart; i <= MonthEnd; i++) {
                    var ReadOnly = new Object();
                    ReadOnly.MONTH = i;
                    ReadOnly.START_DATE = MouthStart == i ? new Date(LINE.PO_DATE) : new Date(DATE).setMonth(i);
                    ReadOnly.ITEM_LIST = angular.copy($scope.EDIT_ITEM_LIST);
                    angular.forEach(ReadOnly.ITEM_LIST, function (_val_item, index) {
                        _val_item.ITEM_INDEX = index;
                        var _split_result = $scope.PO_SPLIT_EDIT_LIST.filter(function (_val_split) { return _val_split.PO_LINE_ID == _val_item.PO_LINE_ID && new Date(ReadOnly.START_DATE).getMonth() == new Date(_val_split.PO_DATE).getMonth() && new Date(ReadOnly.START_DATE).getFullYear() == new Date(_val_split.PO_DATE).getFullYear() });
                        if (_split_result.length > 0) {
                            _val_item.BUDGET = $scope.SETTING_USE_GROSS == 1 ? parseFloat(_split_result[0].GROSS_AMOUNT).toFixed(2) : parseFloat(_split_result[0].NET_AMOUNT).toFixed(2);
                            _val_item.REQ_SPLIT_LIST = _split_result[0];
                            _val_item.SPLIT_TABLE_ID = _split_result[0].TABLE_ID;
                            _val_item.PO_SPLIT_ACCOUNT_ID = _split_result[0].ACCOUNT_ID;
                        }
                        else {
                            var taxAmount = LINE.TAX_TYPE == 3 ? 0.00 : (LINE.TAX_TYPE == 2 ? ((((_val_item.UNIT_PRICE * _val_item.QUANTITY) / (1 + (_val_item.TAX_ID == undefined ? 0 : _val_item.TAX_ID.RATE / 100))) - (((_val_item.UNIT_PRICE * _val_item.QUANTITY) / (1 + (_val_item.TAX_ID == undefined ? 0 : _val_item.TAX_ID.RATE / 100))) * (_val_item.DISCOUNT_PERCENT / 100))) * (_val_item.TAX_ID == undefined ? 0 : _val_item.TAX_ID.RATE / 100)) : (((_val_item.UNIT_PRICE * _val_item.QUANTITY) - ((_val_item.UNIT_PRICE * _val_item.QUANTITY) * (_val_item.DISCOUNT_PERCENT / 100))) * (_val_item.TAX_ID == undefined ? 0 : _val_item.TAX_ID.RATE / 100)));
                            var amount = ((_val_item.QUANTITY * 1 * _val_item.UNIT_PRICE * 1) - (_val_item.QUANTITY * 1 * _val_item.UNIT_PRICE * 1 * (_val_item.DISCOUNT_PERCENT) / 100))
                            if ($scope.PO_SPLIT_EDIT_LIST.length > 0) {
                                _val_item.BUDGET = _val_item.PO_LINE_ID > 0 ? 0 : parseFloat($scope.SETTING_USE_GROSS == 1 ? (amount + (LINE.TAX_TYPE == 2 ? 0 : taxAmount)) / (LINE.SPLIT_TYPE_ID + 1) : LINE.TAX_TYPE == 2 ? parseFloat((amount - taxAmount) / (LINE.SPLIT_TYPE_ID + 1)).toFixed(2) : parseFloat(amount / (LINE.SPLIT_TYPE_ID + 1))).toFixed(2);
                                _val_item.PO_SPLIT_ACCOUNT_ID = _val_item.ACCOUNT_ID;
                            }
                            else {
                                _val_item.BUDGET = parseFloat($scope.SETTING_USE_GROSS == 1 ? (amount + (LINE.TAX_TYPE == 2 ? 0 : taxAmount)) / (LINE.SPLIT_TYPE_ID + 1) : LINE.TAX_TYPE == 2 ? parseFloat((amount - taxAmount) / (LINE.SPLIT_TYPE_ID + 1)).toFixed(2) : parseFloat(amount / (LINE.SPLIT_TYPE_ID + 1))).toFixed(2);
                                _val_item.PO_SPLIT_ACCOUNT_ID = _val_item.ACCOUNT_ID;
                            }
                        }
                    });
                    $scope.MONTH_EDIT_LIST.push(ReadOnly);
                }
            }
        }
        else {
            $scope.MONTH_EDIT_LIST = [];
        }
    }
    $scope.Fn_CHANGET_UNIT_PRIZE_EDIT = function () {
        $scope.Fn_SPLIT_REQ_EDIT($scope.EDIT_REQ_Search, 2);
    }

    $scope.Fn_RETURN_CURRENT_AMT_EDIT = function (BD, HEADER) {
        if (BD.CURRENT_AMOUNT == undefined) {
            BD.CURRENT_AMOUNT = 0;
        }
        var itemdetail = [];
        angular.forEach($scope.MONTH_EDIT_LIST, function (_m) {
            angular.forEach(_m.ITEM_LIST, function (_val_item) {
                if (_val_item.ACCOUNT_ID == BD.ACCOUNT_ID && new Date($scope.EDIT_REQ_Search.PO_DATE).getMonth() == new Date(_m.START_DATE).getMonth() && new Date($scope.EDIT_REQ_Search.PO_DATE).getFullYear() == new Date(_m.START_DATE).getFullYear()) {
                    if (_val_item.BUDGET != undefined && _val_item.BUDGET != "" && _val_item.BUDGET != null) {
                        BD.CURRENT_AMOUNT = parseFloat(BD.CURRENT_AMOUNT) + parseFloat(_val_item.BUDGET);
                    }
                }
                if (_m.FLAG == 1) {
                    itemdetail.push(_val_item);
                }
            });
        })
        $scope.REM_AMOUNT_LEFT_EDIT = angular.copy($filter('sumOfModValue')(itemdetail, 'REMAINING_AMOUNT'));

    }

    $scope.CHANGE_CONTACT_NAME_EDIT_Fn = function (_pram_Q_LINE, List, FLAG, index) {
        if (_pram_Q_LINE.CONTACT_NAME == undefined || _pram_Q_LINE.CONTACT_NAME == "" || _pram_Q_LINE.CONTACT_NAME.length == 0) {
            $scope.EDIT_REQ_Search.SUPPLIER_NAME = "";
        }
        else if (_pram_Q_LINE.CONTACT_NAME.length == 0) {
            $scope.EDIT_REQ_Search.SUPPLIER_NAME = _pram_Q_LINE.SUPPLIER_NAME;
            $scope.EDIT_REQ_Search.SELECTED_SUPPLIER_ID = List[0].ID;
        } else if (_pram_Q_LINE.CONTACT_NAME.length > 0) {
            $scope.EDIT_REQ_Search.SUPPLIER_NAME = _pram_Q_LINE.CONTACT_NAME;
            $scope.EDIT_REQ_Search.SELECTED_SUPPLIER_ID = _pram_Q_LINE.XERO_CONTACT_ID;
            if (_pram_Q_LINE.XERO_CONTACT_ID == null || _pram_Q_LINE.XERO_CONTACT_ID == "" || _pram_Q_LINE.XERO_CONTACT_ID == undefined) {
                $scope.SetContactValues(_pram_Q_LINE, 0);
            }
        };
        $scope.SELECT_SUPPLIER_LIST = [];
        if (FLAG == 1) {
            $scope.$parent.selectedEditsupplier = _pram_Q_LINE.INDEX_VALUE;
            $scope.SetContactValues(_pram_Q_LINE, 1);
        }
    }


    $scope.Fn_ADJUSTMENT_BUDGET_EDIT = function (_m, _pram_item, index, itemlast) {
        if (_m.FLAG == 1 && itemlast == true && $scope.PO_SPLIT_EDIT_LIST.length == 0) {
            var x = 0;
            if (x == 0) {
                $scope.REM_AMOUNT_LEFT_EDIT = 0;
                var intervaleditID = $interval(function () {
                    angular.forEach($scope.MONTH_EDIT_LIST[$scope.MONTH_EDIT_LIST.length - 1].ITEM_LIST, function (_item) {
                        //if ((parseFloat(_item.REMAINING_AMOUNT).toFixed(2)) != 0 && 0.05 > parseFloat(parseFloat(_item.REMAINING_AMOUNT).toFixed(2)) && -0.05 < parseFloat(parseFloat(_item.REMAINING_AMOUNT).toFixed(2))) {
                        //    _item.BUDGET = parseFloat(parseFloat(parseFloat(_item.BUDGET).toFixed(2)) + parseFloat(parseFloat(_item.REMAINING_AMOUNT).toFixed(2))).toFixed(2);
                        //    _item.TOTAL_BUDGET = parseFloat(parseFloat(parseFloat(_item.TOTAL_BUDGET).toFixed(2)) + parseFloat(parseFloat(_item.REMAINING_AMOUNT).toFixed(2))).toFixed(2);
                        //}

                        if ((parseFloat(_item.REMAINING_AMOUNT).toFixed(2)) != 0 && 0.05 > parseFloat(parseFloat(_item.REMAINING_AMOUNT).toFixed(2)) && -0.05 < parseFloat(parseFloat(_item.REMAINING_AMOUNT).toFixed(2))) {
                            _item.BUDGET = parseFloat(parseFloat(parseFloat(_item.BUDGET).toFixed(2)) + parseFloat(parseFloat(_item.REMAINING_AMOUNT).toFixed(2))).toFixed(2);
                            _item.TOTAL_BUDGET = parseFloat(parseFloat(parseFloat(_item.TOTAL_BUDGET).toFixed(2)) + parseFloat(parseFloat(_item.REMAINING_AMOUNT).toFixed(2))).toFixed(2);
                        }

                    });
                    if (++x > 1) {
                        $interval.cancel(intervaleditID);
                        x = 0;
                    }
                }, 1000);
            }
        }
    };
    $scope.numbersonly = function (e, value) {
        if (isNaN(e.key) && e.key !== '.' && e.key !== ',' && e.key !== '(' && e.key !== ')' && e.key !== '+' && e.key !== '-') e.preventDefault();
    }

    $scope.POP_EDIT_SUPPLIER_Fn = function () {
        $scope.SUPPLIER_SEARCH = {
            SUPPLIER_NAME: '',
            IS_MULTI_FILE_UPLOAD_ALLOW: true,
        }
        $('#EDIT_POP_SUPPLIER').modal('show');
    }
    $scope.POP_EDIT_DELIVERY_DETAILS_Fn = function () {
        $('#EDIT_DELIVERY_DETAILS').modal('show');
        $scope.DELIVERY_ADDRESS_SEARCH.DELIVERY_ADDRESS = "";
        $scope.DELIVERY_ADDRESS_SEARCH.ATTENTION = "";
        $scope.DELIVERY_ADDRESS_SEARCH.PHONE = "";
        $scope.EDIT_DELIVERY_DETAILS_FORM.submitted = false;
    }
    $scope.POP_ADD_EDIT_TERMS_CONDITIONS_Fn = function (SELECTED) {
        $('#EDIT_TERMS_CONDITIONS').modal('show');
        $scope.SELECTED_TERM_CONDITION = SELECTED;
    }
    $scope.POP_EDIT_TERMS_CONDITIONS_Fn = function () {
        $('#EDIT_AddTANDC').modal('show');
    }

    $scope.CLICK_DELIVERY_ADDRESS_EDIT = function (LINE) {
        $scope.EDIT_REQ_Search.DELIVERY_ADDRESS = LINE.DELIVERY_ADDRESS;
        if (LINE.PHONE != null && LINE.PHONE != "") {
            $scope.EDIT_REQ_Search.PHONE = LINE.PHONE;
        }
        if (LINE.ATTENTION != null && LINE.ATTENTION != "") {
            $scope.EDIT_REQ_Search.ATTENTION = LINE.ATTENTION;
        }
    }
    $scope.CLICK_TERMS_CONDITIONS_EDIT = function (LINE) {
        LINE.IS_CHECK_TMC = LINE.IS_CHECK_TMC ? LINE.IS_CHECK_TMC = false : LINE.IS_CHECK_TMC = true;
    }
    $scope.CLICK_TERMS_CONDITIONS_RESET_EDIT = function () {
        angular.forEach($scope.EDIT_P2P_TERMS_AND_CONDITIONS_LIST, function (item) {
            item.IS_CHECK_TMC = false;
        });
    }
    $scope.CLICK_TERMS_CONDITIONS_APPLY_EDIT = function (FLAG) {
        angular.forEach($scope.EDIT_P2P_TERMS_AND_CONDITIONS_LIST, function (item) {
            if (item.IS_CHECK_TMC) {
                if ($scope.EDIT_P2P_TERMS_AND_CONDITIONS_LIST.length > 0) {
                    var SORT_ORDER = $scope.EDIT_P2P_TERMS_AND_CONDITIONS_LIST[$scope.EDIT_P2P_TERMS_AND_CONDITIONS_LIST.length - 1].SORT_ORDER;
                    $scope.EDIT_BLANK_TERM_CONT.SORT_ORDER = SORT_ORDER + 1;
                    $scope.EDIT_BLANK_TERM_CONT.TEXT = item.TEXT;
                } else {
                    $scope.EDIT_BLANK_TERM_CONT.SORT_ORDER = 1;
                    $scope.EDIT_BLANK_TERM_CONT.TEXT = item.TEXT;
                };
                item.IS_CHECK_TMC = false;
                $scope.EDIT_TERMS_AND_CONDITIONS_MASTER_LIST.push(angular.copy($scope.EDIT_BLANK_TERM_CONT));
            }
        });
        $('#EDIT_AddTANDC').modal('hide');
    }
    $scope.CLOSE_DELIVERY = function () {
        $('#EDIT_DELIVERY_DETAILS').modal('hide');
    }
    $scope.CLOSE_ADD_CONTACT = function () {
        $('#EDIT_POP_SUPPLIER').modal('hide');
    }
    $scope.CLOSE_TERMS_CON = function () {
        $('#EDIT_AddTANDC').modal('hide');
    }
    $scope.CLOSE_EDIT_TERMS_CONDITIONS = function () {
        $('#EDIT_TERMS_CONDITIONS').modal('hide');
    }
    $scope.CLOSE_RESET_CHAIN = function () {
        $('#RESET_CHAIN_COMENT_POP').modal('hide');
    }
    $scope.SELECT_EDIT_SUPPLIER_LIST = [];

    $scope.EDIT_INS_UPD_REQUISITION_RESET_CHAIN = function () {
        $scope.RESET_CHAIN_COMENT_FORM.submitted = true;
        if ($scope.RESET_CHAIN_COMENT_FORM.$valid) {
            $scope.EDIT_INS_UPD_REQUISITION(2);
        }
    }
    $scope.EDIT_INS_UPD_REQUISITION = function (DRAFT_FLAG) {
        $scope.EDIT_REQ_FORM.submitted = true;
        var accoutcode = $scope.EDIT_ITEM_LIST.filter(function (x) { return x.IS_ACCOUNT_VALID })
        var Advance_Amount_valid = parseFloat($scope.EDIT_REQ_Search.ADVANCE) > parseFloat($scope.EDIT_REQ_Search.TOTAL_AMOUNT);
        angular.forEach($scope.EDIT_QUOTATION_LIST, function (QUO) {
            QUO.IS_QUOTATION_REQUIRED = false;
            if (QUO.CONTACT_NAME != undefined && QUO.CONTACT_NAME != "" && QUO.CONTACT_NAME != null) {
                var readOnly = new Object();
                readOnly.TABLE_ID = QUO.TABLE_ID == undefined ? null : QUO.TABLE_ID;
                var SupQList = $scope.EDIT_SUPPLIER_LIST.filter(function (x) { return x.SUPPLIER_NAME == QUO.CONTACT_NAME });
                if (SupQList.length == 0) { readOnly.XERO_CONTACT_ID = null; } else { readOnly.XERO_CONTACT_ID = SupQList[0].ID; };
                readOnly.TOTAL_AMOUNT = QUO.TOTAL_AMOUNT == undefined ? null : QUO.TOTAL_AMOUNT;
                readOnly.COMMENTS = QUO.COMMENTS == undefined ? null : QUO.COMMENTS;
                readOnly.UPLOADS_ID = "";
                QUO.IS_QUOTATION_REQUIRED = false;
                if (QUO.UploadedFiles != undefined && QUO.UploadedFiles.length > 0) {
                    angular.forEach(QUO.UploadedFiles, function (Uploads) {
                        if (readOnly.UPLOADS_ID == "") {
                            readOnly.UPLOADS_ID = Uploads.ID;
                        } else {
                            readOnly.UPLOADS_ID = readOnly.UPLOADS_ID + "," + Uploads.ID;
                        };
                    });
                };
                if (DRAFT_FLAG == 2 && (QUO.UploadedFiles == undefined || QUO.UploadedFiles == null || QUO.UploadedFiles == "" || QUO.UploadedFiles.length == 0)) {
                    QUO.IS_QUOTATION_REQUIRED = true;
                }
                readOnly.DELETE_FLAG = 0;
                if (readOnly.TABLE_ID == null
                    && (readOnly.TOTAL_AMOUNT == undefined || readOnly.TOTAL_AMOUNT == null || readOnly.TOTAL_AMOUNT == "")
                    && (readOnly.COMMENTS == undefined || readOnly.COMMENTS == null || readOnly.COMMENTS == "")) {
                    readOnly.DELETE_FLAG = null;
                }
                else {
                    //  ptopobj.PO_QUOTATIONS.push(readOnly);
                }
            }
        });
        var QutotaionSelectContact = $scope.EDIT_QUOTATION_LIST.filter(function (x) { return x.IS_QUOTATION_REQUIRED });
        if ($scope.EDIT_REQ_FORM.$valid && accoutcode.length == 0 && QutotaionSelectContact.length == 0) {
            var ptopobj = new Object();
            ptopobj.RESET_APPROVAL_CHAIN = 0;
            if (parseFloat($scope.EDIT_REQ_Search.OLD_TOTAL_AMOUNT).toFixed(5) != parseFloat($scope.EDIT_REQ_Search.TOTAL_AMOUNT).toFixed(5)) {
                ptopobj.RESET_APPROVAL_CHAIN = 1;
            }
            else if ($scope.EDIT_ITEM_LIST.length != $scope.EDIT_ITEM_LIST_OLD.length) {
                ptopobj.RESET_APPROVAL_CHAIN = 1;
            }
            else if ($scope.EDIT_REQ_Search.PROJECT_MASTER_ID != $scope.EDIT_REQ_Search.PROJECT_MASTER_ID_OLD) {
                ptopobj.RESET_APPROVAL_CHAIN = 1;
            }
            else if ($scope.EDIT_ITEM_LIST.length == $scope.EDIT_ITEM_LIST_OLD.length) {
                for (var i = 0; i < $scope.EDIT_ITEM_LIST.length; i++) {
                    var lth = $scope.EDIT_ITEM_LIST_OLD.filter(function (x) { return x.ACCOUNT_ID === $scope.EDIT_ITEM_LIST[i].ACCOUNT_ID });
                    if (lth.length == 0) {
                        ptopobj.RESET_APPROVAL_CHAIN = 1;
                        break;
                    }
                }
            }
            $scope.SELECT_EDIT_SUPPLIER_LIST = [];
            var BASE_TO_PO_CONVERSION_RATE = $scope.EDIT_REQ_Search.BASE_TO_PO_CONVERSION_RATE == undefined || $scope.EDIT_REQ_Search.BASE_TO_PO_CONVERSION_RATE == "" || $scope.EDIT_REQ_Search.BASE_TO_PO_CONVERSION_RATE == null || $scope.EDIT_REQ_Search.BASE_TO_PO_CONVERSION_RATE == 0 ? false : true;
            var REQ_VALID = parseFloat($scope.EDIT_REQ_Search.TOTAL_AMOUNT).toFixed(5) == 0 ? false : true;
            // var SPLIT_REQ_VALID = $scope.MONTH_EDIT_LIST.length > 0 ? false : true;
            var SPLIT_REQ_VALID = $scope.REM_AMOUNT_LEFT_EDIT > 0 || $scope.REM_AMOUNT_LEFT_EDIT < 0 ? false : true;
            ptopobj.PO_LINE_SPLIT = [];
            if (SPLIT_REQ_VALID) {
                angular.forEach($scope.MONTH_EDIT_LIST, function (_m) {
                    angular.forEach(_m.ITEM_LIST, function (_item) {
                        var readonly = new Object()
                        readonly.TABLE_ID = _item.SPLIT_TABLE_ID == undefined || _item.SPLIT_TABLE_ID == "" ? null : _item.SPLIT_TABLE_ID;
                        readonly.PO_LINE_NO = _item.LINE_NO; // _item.REQ_SPLIT_LIST.PO_LINE_ID;
                        //readonly.PO_DATE = new Date(_m.START_DATE).toDateString();    
                        readonly.PO_DATE = ($filter('date')(new Date(_m.START_DATE)));
                        if ($scope.SETTING_USE_GROSS == 1) {
                            var NET = _item.BUDGET == undefined || _item.BUDGET == '' || _item.BUDGET == null ? "0" : (_item.BUDGET) / (1 + (_item.TAX_RATE / 100));
                            readonly.NET_AMOUNT = parseFloat(NET).toFixed(5);
                            readonly.GROSS_AMOUNT = _item.BUDGET == undefined || _item.BUDGET == '' || _item.BUDGET == null ? "0" : parseFloat(_item.BUDGET).toFixed(5);
                        }
                        else {
                            var GROSS_NET = _item.BUDGET == undefined || _item.BUDGET == '' || _item.BUDGET == null ? "0" : (_item.BUDGET) * (1 + (_item.TAX_RATE / 100))
                            readonly.NET_AMOUNT = _item.BUDGET == undefined || _item.BUDGET == '' || _item.BUDGET == null ? "0" : parseFloat(_item.BUDGET).toFixed(5);
                            readonly.GROSS_AMOUNT = parseFloat(GROSS_NET).toFixed(5);
                        }
                        readonly.DELETE_FLAG = 0;
                        ptopobj.PO_LINE_SPLIT.push(readonly);
                        //if (_m.FLAG == 1 && parseFloat(_item.REMAINING_AMOUNT).toFixed(2) < 0) {
                        //    SPLIT_REQ_VALID = false;
                        //} else if (_m.FLAG == 1 && parseFloat(_item.REMAINING_AMOUNT).toFixed(2) > 0) {
                        //    SPLIT_REQ_VALID = false;
                        //} else if (_m.FLAG == 1 && parseFloat(_item.REMAINING_AMOUNT).toFixed(2) == 0) {
                        //    SPLIT_REQ_VALID = true;
                        //};
                    });
                });
                if ($scope.DELETE_MONTH_EDIT_LIST.length > 0) {
                    angular.forEach($scope.DELETE_MONTH_EDIT_LIST, function (_val_delete_item) {
                        if (_val_delete_item != undefined && _val_delete_item.SPLIT_TABLE_ID > 0) {
                            var readonly = new Object();
                            readonly.TABLE_ID = _val_delete_item.SPLIT_TABLE_ID;
                            readonly.PO_LINE_NO = null;
                            readonly.PO_DATE = null;
                            readonly.NET_AMOUNT = null;
                            readonly.GROSS_AMOUNT = null;
                            readonly.DELETE_FLAG = 1;
                            ptopobj.PO_LINE_SPLIT.push(readonly);
                        }
                    });
                }
                if ($scope.MONTH_EDIT_LIST.length == 0 && ptopobj.PO_LINE_SPLIT.length == 0) {
                    var readonly = new Object()
                    readonly.TABLE_ID = null;
                    readonly.PO_LINE_NO = null;
                    readonly.PO_DATE = null;
                    readonly.NET_AMOUNT = null;
                    readonly.GROSS_AMOUNT = null;
                    readonly.DELETE_FLAG = null;
                    ptopobj.PO_LINE_SPLIT.push(readonly);
                }
                if (ptopobj.PO_LINE_SPLIT.length > 0 && $scope.DELETE_PO_SPLIT_EDIT_LIST.length > 0) {
                    ptopobj.PO_LINE_SPLIT_DELETE = [];
                    angular.forEach($scope.DELETE_PO_SPLIT_EDIT_LIST, function (_line) {
                        var _auto_remove_result = ptopobj.PO_LINE_SPLIT.filter(function (x) { return x.TABLE_ID == _line.TABLE_ID })
                        if (_auto_remove_result.length == 0) {
                            var readonly = new Object()
                            readonly.TABLE_ID = _line.TABLE_ID;
                            readonly.PO_LINE_NO = null;
                            readonly.PO_DATE = null;
                            readonly.NET_AMOUNT = null;
                            readonly.GROSS_AMOUNT = null;
                            readonly.DELETE_FLAG = 1;
                            ptopobj.PO_LINE_SPLIT_DELETE.push(readonly);
                        }
                    });
                    if (ptopobj.PO_LINE_SPLIT_DELETE.length > 0) {
                        ptopobj.PO_LINE_SPLIT = ptopobj.PO_LINE_SPLIT.concat(ptopobj.PO_LINE_SPLIT_DELETE);
                    }
                }
            }
            var List = $scope.EDIT_SUPPLIER_LIST.filter(function (x) { return x.SUPPLIER_NAME == $scope.EDIT_REQ_Search.SUPPLIER_NAME });
            if (List.length > 0) { $scope.SELECT_EDIT_SUPPLIER_LIST = List; }
            var text = "Are you sure you want to proceed?";
            var IS_ALLOW = true;
            if (ptopobj.RESET_APPROVAL_CHAIN == 1) {
                text = "You have changed the GL Account or the total requisition amount. this will reset the approval chain. Are you sure want to proceed?";
                if ($scope.RESET_APPROVAL_CHAIN_COMMENTS == undefined || $scope.RESET_APPROVAL_CHAIN_COMMENTS == null || $scope.RESET_APPROVAL_CHAIN_COMMENTS == "") {
                    IS_ALLOW = false;
                    $('#RESET_CHAIN_COMENT_POP').modal('show');
                }
            }
            if (List.length == 0) {
                $scope.$parent.ShowAlert("Error", 'Please select valid contact name', 3000);
                $scope.SELECT_EDIT_SUPPLIER_LIST = [];
            }
            else if (BASE_TO_PO_CONVERSION_RATE == false) {
                $scope.$parent.ShowAlert("Error", 'Please provide a valid conversion rate.', 3000);
            }
            else if (REQ_VALID == false) {
                $scope.$parent.ShowAlert("Error", 'REQ with no amount cannot be processed.', 3000);
            }
            else if (Advance_Amount_valid) {
                $scope.$parent.ShowAlert("Error", 'Advanced amount cannot be greater than total amount.', 3000);
            }
            else if (SPLIT_REQ_VALID == false) {
                $scope.$parent.ShowAlert("Error", 'Remaining amount should be zero.', 2000);
            }
            else {
                $scope.SELECT_EDIT_SUPPLIER_LIST = List;
                if (IS_ALLOW || IS_ALLOW && (confirm(text))) {
                    ptopobj.PO_HDR_ID = $scope.EDIT_REQ_Search.REQUEST_LINE.PO_HDR_ID;
                    ptopobj.CONTACT_ID = List[0].ID;
                    ptopobj.PO_DATE = $scope.EDIT_REQ_Search.PO_DATE;
                    ptopobj.DELIVERY_DATE = $scope.EDIT_REQ_Search.DELIVERY_DATE;
                    ptopobj.REFERENCE = $scope.EDIT_REQ_Search.REFERENCE;
                    ptopobj.XERO_BRANDING_THEME_ID = $scope.EDIT_REQ_Search.XERO_BRANDING_THEME_ID == undefined || $scope.EDIT_REQ_Search.XERO_BRANDING_THEME_ID == "" ? null : $scope.EDIT_REQ_Search.XERO_BRANDING_THEME_ID;
                    ptopobj.NOTE_FOR_APPROVERS = $scope.EDIT_REQ_Search.NOTE_FOR_APPROVERS;
                    ptopobj.PO_CURRENCY_ID = $scope.EDIT_REQ_Search.PO_CURRENCY_ID;
                    ptopobj.BASE_CURRENCY_ID = $scope.EDIT_REQ_Search.BASE_CURRENCY_ID;
                    if ($scope.EDIT_REQ_Search.BASE_CURRENCY_ID != $scope.EDIT_REQ_Search.PO_CURRENCY_ID) {
                        ptopobj.BASE_TO_PO_CONVERSION_RATE = $scope.EDIT_REQ_Search.BASE_TO_PO_CONVERSION_RATE;
                    }
                    else {
                        ptopobj.BASE_TO_PO_CONVERSION_RATE = 1;
                    }
                    ptopobj.TAX_TYPE = $scope.EDIT_REQ_Search.TAX_TYPE;
                    ptopobj.NET_AMOUNT = parseFloat($scope.EDIT_REQ_Search.NET_AMOUNT).toFixed(5);     //NET;
                    ptopobj.TAX_AMOUNT = parseFloat($scope.EDIT_REQ_Search.TAX_AMOUNT).toFixed(5);     //TAX;
                    ptopobj.TOTAL_AMOUNT = parseFloat($scope.EDIT_REQ_Search.TOTAL_AMOUNT).toFixed(5); //NET+TAX;
                    ptopobj.ADVANCE = parseFloat($scope.EDIT_REQ_Search.ADVANCE).toFixed(5);
                    ptopobj.DELIVERY_ADDRESS = $scope.EDIT_REQ_Search.DELIVERY_ADDRESS;
                    ptopobj.ATTENTION = $scope.EDIT_REQ_Search.ATTENTION;
                    ptopobj.PHONE = $scope.EDIT_REQ_Search.PHONE;
                    ptopobj.DELIVERY_INSTRUCTIONS = $scope.EDIT_REQ_Search.DELIVERY_INSTRUCTIONS;
                    ptopobj.AUTO_EMAIL_TO_SUPPLIER = $scope.EDIT_REQ_Search.AUTO_EMAIL_TO_SUPPLIER ? 1 : 0;
                    ptopobj.SUPPLIER_EMAIL = $scope.EDIT_REQ_Search.SUPPLIER_EMAIL;
                    ptopobj.IS_DRAFT = 0;
                    ptopobj.UPLOAD_IDS = "";
                    angular.forEach($scope.EDIT_REQ_Search.UploadedFiles, function (x) {
                        if (ptopobj.UPLOAD_IDS == "") {
                            ptopobj.UPLOAD_IDS = x.ID;
                        }
                        else {
                            ptopobj.UPLOAD_IDS = ptopobj.UPLOAD_IDS + "," + x.ID;
                        }
                    });
                    ptopobj.PO_LINES = [];
                    ptopobj.PO_LINE_CUSTOM_FIELDS = [];
                    ptopobj.PO_TERMS_AND_CONDITIONS = [];
                    ptopobj.PO_QUOTATIONS = [];
                    ptopobj.P2P_BUDGET_SNAPSHOT_TYPE = [];
                    var InEDITcount = 0;

                    angular.forEach($scope.EDIT_ITEM_LIST, function (LINE) {
                        var readonlyobj = new Object()
                        readonlyobj.PO_LINE_ID = LINE.PO_LINE_ID == undefined || LINE.PO_LINE_ID == "" || LINE.PO_LINE_ID == null ? 0 : parseInt(LINE.PO_LINE_ID);
                        readonlyobj.ITEM_NAME = LINE.ITEM_NAME;
                        readonlyobj.DESCRIPTION = LINE.DESCRIPTION;
                        readonlyobj.LINE_NO = LINE.LINE_NO;
                        readonlyobj.QUANTITY = (LINE.QUANTITY == undefined || LINE.QUANTITY == null || LINE.QUANTITY == '') ? null : parseFloat(LINE.QUANTITY).toFixed(5);
                        readonlyobj.UNIT_PRICE = (LINE.UNIT_PRICE == undefined || LINE.UNIT_PRICE == null || LINE.UNIT_PRICE == '') ? null : parseFloat(LINE.UNIT_PRICE).toFixed(5);
                        readonlyobj.DISCOUNT_PERCENT = (LINE.DISCOUNT_PERCENT == undefined || LINE.DISCOUNT_PERCENT == null || LINE.DISCOUNT_PERCENT == '') ? null : parseFloat(LINE.DISCOUNT_PERCENT);

                        var Accountlist = $scope.EDIT_XERO_ACCOUNT_CODES.filter(function (x) { return x.CODE + ' - ' + x.NAME == LINE.ACCOUNT_NAME });
                        if (Accountlist.length > 0) {
                            LINE.ACCOUNT_DETAILS = Accountlist[0];
                        }
                        else {
                            LINE.IS_ACCOUNT_VALID = true;
                            count = 1;
                        }

                        readonlyobj.ACCOUNT_ID = LINE.ACCOUNT_DETAILS == undefined ? null : parseInt(LINE.ACCOUNT_DETAILS.TABLE_ID);
                        readonlyobj.ACCOUNT_DETAILS = LINE.ACCOUNT_DETAILS == undefined ? null : LINE.ACCOUNT_DETAILS.CODE + "-" + LINE.ACCOUNT_DETAILS.NAME;

                        readonlyobj.TAX_RATE_ID = LINE.TAX_ID == undefined ? null : LINE.TAX_ID.ID;
                        readonlyobj.TAX_RATE = LINE.TAX_ID == undefined ? null : LINE.TAX_ID.RATE;
                        readonlyobj.TAX_RATE_DETAILS = LINE.TAX_ID == undefined ? null : LINE.TAX_ID.NAME + ' (' + LINE.TAX_ID.RATE + '%)';
                        readonlyobj.AMOUNT = parseFloat(LINE.AMOUNT).toFixed(5);
                        readonlyobj.PR_PURCHASE_REQUEST_ID = null;

                        if (LINE.EDIT_XERO_TRACKING_CATEGORIES != undefined && LINE.EDIT_XERO_TRACKING_CATEGORIES.length > 0 && InEDITcount == 0) {
                            angular.forEach(LINE.EDIT_XERO_TRACKING_CATEGORIES, function (TR) {
                                var PO_LINE_CUST_FLD = new Object();
                                PO_LINE_CUST_FLD.PO_LINE_NO = LINE.LINE_NO;
                                PO_LINE_CUST_FLD.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID = TR.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID == undefined ? null : TR.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID;
                                PO_LINE_CUST_FLD.APPROVAL_CHAIN_CUSTOM_FIELD_OPTIONS_MASTER_ID = TR.SELECTED_CATEGORY_OPTION == undefined ? null : TR.SELECTED_CATEGORY_OPTION == undefined ? null : TR.SELECTED_CATEGORY_OPTION.APPROVAL_CHAIN_CUSTOM_FIELD_OPTIONS_MASTER_ID;
                                ptopobj.PO_LINE_CUSTOM_FIELDS.push(PO_LINE_CUST_FLD);
                            });
                        } else {
                            if (InEDITcount == 0) {
                                var PO_LINE_CUST_FLD = new Object();
                                PO_LINE_CUST_FLD.PO_LINE_NO = null;
                                PO_LINE_CUST_FLD.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID = null;
                                PO_LINE_CUST_FLD.APPROVAL_CHAIN_CUSTOM_FIELD_OPTIONS_MASTER_ID = null;
                                ptopobj.PO_LINE_CUSTOM_FIELDS.push(PO_LINE_CUST_FLD);
                            }
                            InEDITcount = 1;
                        }
                        readonlyobj.DELETE_FLAG = 0;
                        readonlyobj.UOM_NAME = DRAFT_FLAG == 1 && LINE.UOM_NAME == undefined || LINE.UOM_NAME == null || LINE.UOM_NAME == '' ? null : LINE.UOM_NAME;
                        readonlyobj.RECEIVING_TYPE_ID = DRAFT_FLAG == 1 && LINE.RECEIVING_TYPE_ID == undefined || LINE.RECEIVING_TYPE_ID == null || LINE.RECEIVING_TYPE_ID == '' ? null : LINE.RECEIVING_TYPE_ID;
                        ptopobj.PO_LINES.push(readonlyobj);
                    });
                    angular.forEach($scope.EDIT_DELETE_ITEM_LIST, function (LINE) {
                        var readonlyobj = new Object()
                        readonlyobj.PO_LINE_ID = parseInt(LINE.PO_LINE_ID);
                        readonlyobj.ITEM_NAME = null;
                        readonlyobj.DESCRIPTION = null;
                        readonlyobj.LINE_NO = null;
                        readonlyobj.QUANTITY = null;
                        readonlyobj.UNIT_PRICE = null;
                        readonlyobj.DISCOUNT_PERCENT = null;
                        readonlyobj.ACCOUNT_ID = null;
                        readonlyobj.ACCOUNT_DETAILS = null;
                        readonlyobj.TAX_RATE_ID = null;
                        readonlyobj.TAX_RATE = null;
                        readonlyobj.TAX_RATE_DETAILS = null;
                        readonlyobj.AMOUNT = null;
                        readonlyobj.PR_PURCHASE_REQUEST_ID = null;//REQuest Id
                        readonlyobj.DELETE_FLAG = 1;
                        readonlyobj.UOM_NAME = null;
                        readonlyobj.RECEIVING_TYPE_ID = null;
                        ptopobj.PO_LINES.push(readonlyobj);
                    });
                    if ($scope.EDIT_TERMS_AND_CONDITIONS_MASTER_LIST.length > 0) {
                        angular.forEach($scope.EDIT_TERMS_AND_CONDITIONS_MASTER_LIST, function (x) {
                            var readOnly = new Object();
                            readOnly.TABLE_ID = x.TABLE_ID == undefined ? null : x.TABLE_ID;
                            readOnly.TANDC_MASTER_ID = x.TANDC_MASTER_ID == undefined ? null : x.TANDC_MASTER_ID;
                            readOnly.TEXT = x.TEXT == undefined ? null : x.TEXT;
                            readOnly.SORT_ORDER = x.SORT_ORDER == undefined ? null : x.SORT_ORDER;
                            readOnly.DELETE_FLAG = 0;
                            ptopobj.PO_TERMS_AND_CONDITIONS.push(readOnly);
                        });
                    }
                    if ($scope.EDIT_DELETE_TERMS_AND_CONDITIONS_MASTER_LIST.length > 0) {
                        angular.forEach($scope.EDIT_DELETE_TERMS_AND_CONDITIONS_MASTER_LIST, function (x) {
                            var readOnly = new Object();
                            readOnly.TABLE_ID = x.TABLE_ID;
                            readOnly.TANDC_MASTER_ID = x.TANDC_MASTER_ID == undefined ? null : x.TANDC_MASTER_ID;
                            readOnly.TEXT = null;
                            readOnly.SORT_ORDER = null;
                            readOnly.DELETE_FLAG = 1;
                            ptopobj.PO_TERMS_AND_CONDITIONS.push(readOnly);
                        });
                    }
                    if ($scope.EDIT_QUOTATION_LIST.length > 0) {
                        angular.forEach($scope.EDIT_QUOTATION_LIST, function (QUO) {
                            var readOnly = new Object();
                            readOnly.TABLE_ID = QUO.TABLE_ID == undefined ? null : QUO.TABLE_ID;
                            var SupQList = $scope.EDIT_SUPPLIER_LIST.filter(function (x) { return x.SUPPLIER_NAME == QUO.CONTACT_NAME });
                            if (SupQList.length == 0) {
                                readOnly.XERO_CONTACT_ID = null;
                            }
                            else {
                                readOnly.XERO_CONTACT_ID = SupQList[0].ID;
                            }
                            readOnly.TOTAL_AMOUNT = QUO.TOTAL_AMOUNT == undefined ? null : QUO.TOTAL_AMOUNT;
                            readOnly.COMMENTS = QUO.COMMENTS == undefined ? null : QUO.COMMENTS;
                            readOnly.UPLOADS_ID = "";
                            if (QUO.UploadedFiles != undefined && QUO.UploadedFiles.length > 0) {
                                angular.forEach(QUO.UploadedFiles, function (Uploads) {
                                    if (readOnly.UPLOADS_ID == "") {
                                        readOnly.UPLOADS_ID = Uploads.ID;
                                    } else {
                                        readOnly.UPLOADS_ID = readOnly.UPLOADS_ID + "," + Uploads.ID;
                                    };
                                });
                            };
                            readOnly.DELETE_FLAG = 0;
                            ptopobj.PO_QUOTATIONS.push(readOnly);
                        });
                    }
                    if ($scope.EDIT_DELETE_QUOTATION_LIST.length > 0) {
                        angular.forEach($scope.EDIT_DELETE_QUOTATION_LIST, function (QUO) {
                            var readOnly = new Object();
                            readOnly.TABLE_ID = QUO.TABLE_ID;
                            readOnly.XERO_CONTACT_ID = null;
                            readOnly.TOTAL_AMOUNT = null;
                            readOnly.COMMENTS = null;
                            readOnly.UPLOADS_ID = "";
                            readOnly.DELETE_FLAG = 1;
                            ptopobj.PO_QUOTATIONS.push(readOnly);
                        });
                    }

                    ptopobj.DELETED_IDS_LIST = [];
                    ptopobj.SOURCE_TYPE = 0;
                    if ($scope.EDIT_DELETED_QUOTATION_FILE_LIST.length > 0) {
                        ptopobj.DELETED_IDS_LIST = $scope.EDIT_DELETED_QUOTATION_FILE_LIST;
                        ptopobj.SOURCE_TYPE = 1;//edit only edit mode
                    }
                    ptopobj.LINE_COUNT = ptopobj.PO_LINES.length;
                    ptopobj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
                    ptopobj.BRANCH_ID = $scope.EDIT_REQ_Search.BRANCH_ID;
                    ptopobj.USER_ID = parseInt($cookies.get("USERID"));
                    ptopobj.PROJECT_MASTER_ID = $scope.EDIT_REQ_Search.PROJECT_MASTER_ID == 0 ? null : $scope.EDIT_REQ_Search.PROJECT_MASTER_ID;
                    ptopobj.OVER_BUDGET = 0;
                    ptopobj.OVER_BUDGET_PERCENTAGE = 0;
                    ptopobj.OVER_BUDGET_AMOUNT = 0;
                    ptopobj.RESET_APPROVAL_CHAIN_COMMENTS = $scope.RESET_APPROVAL_CHAIN_COMMENTS;

                    if (ptopobj.PO_QUOTATIONS.length == 0) {
                        var readOnly = new Object();
                        readOnly.TABLE_ID = null
                        readOnly.XERO_CONTACT_ID = null;
                        readOnly.TOTAL_AMOUNT = null;
                        readOnly.COMMENTS = null;
                        readOnly.UPLOADS_ID = null;
                        readOnly.DELETE_FLAG = null;
                        ptopobj.PO_QUOTATIONS.push(readOnly);
                    }
                    if (ptopobj.PO_TERMS_AND_CONDITIONS.length == 0) {
                        var readOnly = new Object();
                        readOnly.TABLE_ID = null;
                        readOnly.TANDC_MASTER_ID = null;
                        readOnly.TEXT = null;
                        readOnly.SORT_ORDER = null;
                        readOnly.DELETE_FLAG = null;
                        ptopobj.PO_TERMS_AND_CONDITIONS.push(readOnly);
                    }

                    angular.forEach($scope.P2P_EDIT_BUDGET_MASTER_LIST, function (val, Header_index) {
                        var over_budget_amt_to_add = 0;
                        var rowcount = 1;
                        angular.forEach(val.BUDGET_DETAILS_LIST, function (item, Line_index) {
                            if (val.DB_ACCOUNT_ID == 0) {
                                item.REMAINING_AMOUNT = item.REMAINING;
                            }
                            var ReadOnlyApproval = new Object();
                            ReadOnlyApproval.APPROVAL_HEADER_ID = null;// admin header go 
                            ReadOnlyApproval.APPROVAL_HEADER_STATUS_ID = null;// admin no status will go
                            ReadOnlyApproval.ACCOUNT_ID = val.ACCOUNT_ID;
                            ReadOnlyApproval.YTD = item.LINE_ID == 2 ? 1 : 0;
                            ReadOnlyApproval.TOTAL = parseFloat(item.TOTAL).toFixed(5);
                            ReadOnlyApproval.REMAINING = parseFloat(item.REMAINING_AMOUNT).toFixed(5);
                            ReadOnlyApproval.CONSUMED = parseFloat(item.CONSUMED).toFixed(5);
                            ReadOnlyApproval.BOOKED = parseFloat(item.BOOKED).toFixed();
                            if (val.DB_ACCOUNT_ID == 0 || isNaN(parseFloat(item.CURRENT_PO_CUSTOM).toFixed(5))) {
                                ReadOnlyApproval.CURRENT = 0;
                            }
                            else {
                                ReadOnlyApproval.CURRENT = parseFloat(item.CURRENT_PO_CUSTOM).toFixed(5);
                            }
                            //var CURRENT_AMT = $scope.COPY_P2P_EDIT_BUDGET_MASTER_LIST[Header_index] == undefined || $scope.COPY_P2P_EDIT_BUDGET_MASTER_LIST[Header_index].BUDGET_DETAILS_LIST[Line_index] == undefined || $scope.COPY_P2P_EDIT_BUDGET_MASTER_LIST[Header_index].BUDGET_DETAILS_LIST[Line_index].CURRENT != parseFloat(item.CURRENT_PO_CUSTOM).toFixed(5) ? true : false;
                            //if (CURRENT_AMT) {
                            //    SEND_SNAP_SHOT_TO_DATABASE_CHANGE = true;
                            //}

                            if (val.BUDGET_DETAILS_LIST.length == 2) {
                                ReadOnlyApproval.OVER_BUDGET = item.LINE_ID == 2 && parseFloat(item.REMAINING_AMOUNT).toFixed(5) < 0 ? 1 : 0;
                            }
                            else {
                                ReadOnlyApproval.OVER_BUDGET = parseFloat(item.REMAINING_AMOUNT).toFixed(5) < 0 ? 1 : 0;
                            }
                            ReadOnlyApproval.PERIOD = item.PERIOD;
                            ReadOnlyApproval.ACCOUNT_DETAILS = val.GLACCOUNT_NAME;
                            if (parseFloat(item.REMAINING_AMOUNT).toFixed(5) < 0 && val.BUDGET_DETAILS_LIST.length == 2 && item.LINE_ID == 2 || parseFloat(item.REMAINING_AMOUNT).toFixed(5) < 0 && val.BUDGET_DETAILS_LIST.length == 1) {
                                ptopobj.OVER_BUDGET = ReadOnlyApproval.OVER_BUDGET;
                                let OverBudgetPercentage = (item.REMAINING_AMOUNT * -1 / item.TOTAL) * 100
                                if (OverBudgetPercentage.toFixed(2) > parseFloat(ptopobj.OVER_BUDGET_PERCENTAGE).toFixed(2)) {
                                    ptopobj.OVER_BUDGET_PERCENTAGE = parseFloat(OverBudgetPercentage).toFixed(2);
                                    over_budget_amt_to_add = over_budget_amt_to_add == 0 ? parseFloat(item.REMAINING_AMOUNT * -1) : (over_budget_amt_to_add < parseFloat(item.REMAINING_AMOUNT * -1) ? parseFloat(item.REMAINING_AMOUNT * -1) : over_budget_amt_to_add);
                                }
                            }
                            if (rowcount == val.BUDGET_DETAILS_LIST.length) {
                                ptopobj.OVER_BUDGET_AMOUNT = ptopobj.OVER_BUDGET_AMOUNT + over_budget_amt_to_add.toFixed(5);
                            }
                            ReadOnlyApproval.CREDIT_MEMO = parseFloat(item.MEMO).toFixed(5);
                            ptopobj.P2P_BUDGET_SNAPSHOT_TYPE.push(ReadOnlyApproval);
                            rowcount++;
                        });
                    });
                    if (ptopobj.P2P_BUDGET_SNAPSHOT_TYPE.length == 0 || ptopobj.RESET_APPROVAL_CHAIN == 0) {
                        if (ptopobj.RESET_APPROVAL_CHAIN == 0) {
                            ptopobj.P2P_BUDGET_SNAPSHOT_TYPE = [];
                            ptopobj.OVER_BUDGET_PERCENTAGE = $scope.EDIT_REQ_Search.REQUEST_LINE.OVER_BUDGET_AMOUNT;
                            ptopobj.OVER_BUDGET_AMOUNT = $scope.EDIT_REQ_Search.REQUEST_LINE.OVER_BUDGET_PERCENTAGE;
                        }
                        var ReadOnlyApproval = new Object();
                        ReadOnlyApproval.APPROVAL_HEADER_ID = null;// admin header go 
                        ReadOnlyApproval.APPROVAL_HEADER_STATUS_ID = null;// admin no status will go
                        ReadOnlyApproval.ACCOUNT_ID = null;
                        ReadOnlyApproval.YTD = null;
                        ReadOnlyApproval.TOTAL = null;
                        ReadOnlyApproval.REMAINING = null;
                        ReadOnlyApproval.CONSUMED = null;
                        ReadOnlyApproval.BOOKED = null;
                        ReadOnlyApproval.CURRENT = null;
                        ReadOnlyApproval.OVER_BUDGET = null;
                        ReadOnlyApproval.PERIOD = null;
                        ReadOnlyApproval.ACCOUNT_DETAILS = null;
                        ReadOnlyApproval.CREDIT_MEMO = null;
                        ptopobj.P2P_BUDGET_SNAPSHOT_TYPE.push(ReadOnlyApproval);
                    }
                    ptopobj.NO_OF_QUOTATIONS = ptopobj.PO_QUOTATIONS.length > 0 ? ptopobj.PO_QUOTATIONS.filter(function (x) { return x.DELETE_FLAG == 0 }).length : 0;
                    ptopobj.SETTING_45 = $scope.$parent.SETTING_USE_GROSS;
                    ptopobj.SPLIT_TYPE = $scope.EDIT_REQ_Search.SPLIT_TYPE_ID;
                    PrcCommMethods.P2P_API(ptopobj, 'INS_UPD_REQUISITION', 'PO').then(function (data) {
                        if (data.data > 1 && DRAFT_FLAG == 2) {
                            $scope.$parent.ShowAlert("Success", "Purchase Request Edit Successfully ", 3000);
                            $scope.EDIT_ITEM_LIST = [];
                            $scope.EDIT_DELETE_ITEM_LIST = [];
                            $scope.EDIT_TERMS_AND_CONDITIONS_MASTER_LIST = [];
                            $scope.EDIT_QUOTATION_LIST = [];
                            $scope.EDIT_DELETE_QUOTATION_LIST = [];
                            $scope.EDIT_DELETED_QUOTATION_FILE_LIST = [];
                            $scope.EDIT_REQ_FORM.submitted = false;
                            $scope.EDIT_FORM_CLOSE();
                            $scope.EDIT_REQ_Search.PO_HDR_ID = data.data;
                            $scope.RESET_APPROVAL_CHAIN_COMMENTS = "";
                            $('#RESET_CHAIN_COMENT_POP').modal('hide');
                            if ($scope.LOAD_FLAG == "IS_BUYER") {
                                //$scope.$parent.GET_PROCESSED_PO_BY_ID($scope.EDIT_REQ_Search.REQUEST_LINE);
                                $scope.$parent.GET_PURCHASE_REQUESTS_BY_BUYER_PROCESSED(1);
                            }
                            else if ($scope.LOAD_FLAG == "IS_APPROVER") {
                                if ($scope.TAB_FLAG == 3) {
                                    $scope.$parent.GET_APPROVAL_HEADERS_FOR_ADMIN(1);
                                }
                                else {
                                    $scope.$parent.GET_APPROVAL_HEADERS_FOR_APPROVER(1);
                                }

                            }
                        }
                        if (data.data > 1 && DRAFT_FLAG == 1) {
                            $scope.EDIT_REQ_Search.PO_HDR_ID = data.data;
                            $scope.GET_EDIT_PO_BY_ID($scope.EDIT_REQ_Search);
                            $scope.EDIT_REQ_FORM.submitted = false;
                        }
                        if (data.data == 0) {
                            $scope.$parent.ShowAlert("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                        }
                    });
                }
            }
        } else {
            $scope.$parent.$parent.ShowAlert("Error", 'Please provide the mandatory details marked as red', 3000);
        }
    };
    $scope.EDIT_INS_UPD_P2P_DELIVERY_ADDRESS = function () {
        $scope.EDIT_DELIVERY_DETAILS_FORM.submitted = true;
        if ($scope.EDIT_DELIVERY_DETAILS_FORM.$valid) {
            ModelObj = new Object();
            ModelObj.TABLE_ID = 0// $scope.DELIVERY_ADDRESS_SEARCH.TABLE_ID;s
            ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            ModelObj.BRANCH_ID = $scope.EDIT_REQ_Search.BRANCH_ID;
            ModelObj.DELIVERY_ADDRESS = $scope.DELIVERY_ADDRESS_SEARCH.DELIVERY_ADDRESS;
            ModelObj.ATTENTION = $scope.DELIVERY_ADDRESS_SEARCH.ATTENTION;
            ModelObj.PHONE = $scope.DELIVERY_ADDRESS_SEARCH.PHONE;
            ModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.P2P_API(ModelObj, 'INS_UPD_P2P_DELIVERY_ADDRESS', 'PO').then(function (data) {
                if (data.data == 1) {
                    $scope.GET_P2P_DELIVERY_ADDRESS($scope.EDIT_REQ_Search);
                    $scope.$parent.ShowAlert("Success", "Saved successfully ", 3000);
                    $('#EDIT_DELIVERY_DETAILS').modal('hide');
                }
            });
        }
    }
    $scope.EDIT_P2P_NEW_SUPPLIER_REQUEST = function () {
        $scope.SUPPLIER_FORM.submitted = true;
        if ($scope.SUPPLIER_FORM.$valid) {
            ModelObj = new Object();
            ModelObj.SUPPLIER_NAME = $scope.SUPPLIER_SEARCH.SUPPLIER_NAME;
            ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            ModelObj.BRANCH_ID = $scope.EDIT_REQ_Search.BRANCH_ID;
            ModelObj.USER_ID = parseInt($cookies.get("USERID"));
            ModelObj.UPLOAD_IDS = "";
            if ($scope.SUPPLIER_SEARCH.UploadedFiles != undefined) {
                angular.forEach($scope.SUPPLIER_SEARCH.UploadedFiles, function (x) {
                    if (ModelObj.UPLOAD_IDS == "") {
                        ModelObj.UPLOAD_IDS = x.ID;
                    }
                    else {
                        ModelObj.UPLOAD_IDS = ModelObj.UPLOAD_IDS + "," + x.ID;
                    }
                });
            };
            PrcCommMethods.P2P_API(ModelObj, 'P2P_NEW_SUPPLIER_REQUEST', 'PO').then(function (data) {
                if (data.data == 1) {
                    $scope.$parent.ShowAlert("Success", "Contact details send successfully", 2000);
                    $scope.GET_PYMNT_SUPPLIER($scope.EDIT_REQ_Search);
                    $('#EDIT_POP_SUPPLIER').modal('hide');
                }
                if (data.data == 0) {
                    //$scope.$parent.ShowAlert("Attention", "ownership has been taken by " + data.data.Table[0].BUYER_NAME, 2000);
                }
            });
        }
    }
    $scope.EDIT_INS_UPD_TERMS_AND_CONDITIONS_MASTER = function (FLAG, SELECT_REQ) {
        $scope.TERMS_AND_CONDITIONS_FORM.submitted = true;
        if ($scope.TERMS_AND_CONDITIONS_FORM.$valid) {
            var ptopobj = new Object();
            ptopobj.TANDC_ID = 0;
            ptopobj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            ptopobj.USER_ID = parseInt($cookies.get("USERID"));
            ptopobj.BRANCH_ID = $scope.SELECTED_TERM_CONDITION.REQUEST_LINE.BRANCH_ID;
            ptopobj.TYPE = 1; // 1 PO  2 INVOICE DISCUSS
            ptopobj.ACTIVE = 1;
            ptopobj.TEXT = $scope.TERAM_CONDITION.TEXT;
            PrcCommMethods.ADMIN_API(ptopobj, 'INS_UPD_TERMS_AND_CONDITIONS_MASTER', 'PO').then(function (data) {
                if (data.data == 1) {
                    $scope.$parent.ShowAlert("Success", "Added Successfully ", 3000);
                    $scope.TERAM_CONDITION.TEXT = "";
                    $scope.GET_TERMS_AND_CONDITIONS_MASTER($scope.SELECTED_TERM_CONDITION.REQUEST_LINE);
                    $scope.TERMS_AND_CONDITIONS_FORM.submitted = false;
                    if (FLAG != 1) {
                        $('#EDIT_TERMS_CONDITIONS').modal('hide');
                    }
                }
                if (data.data == 0) {
                    $scope.$parent.ShowAlert("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                }
            });
        }
    }
    $scope.$on('ngRepeatFinishedRender', function (ngRepeatFinishedEvent) {
        if ($scope.EDIT_REQ_Search.PO_DATE != undefined && $scope.EDIT_REQ_Search.PO_DATE != "" && $scope.EDIT_REQ_Search.PO_DATE != null && !$scope.EDIT_BLANK_ITEM.IS_NEW) {
            $scope.GET_P2P_BUDGET_BY_ACCOUNTS(1, $scope.EDIT_REQ_Search, $scope.EDIT_REQ_Search, 1);
        }
        else {
            $scope.EDIT_BLANK_ITEM.IS_NEW = false;
        }
    });

    $scope.$parent.DateInputLoad('PO_REQ', 1);
    $scope.$parent.Edit_REQ_childScope = $scope;
    $scope.$parent.child_scope = $scope;
});
