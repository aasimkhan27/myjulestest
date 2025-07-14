app.controller('Create_Invoice_Controller', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $(".modal-backdrop").remove();
    $scope.ADD_MORE_QUOTATION_NAME = "Add More Quotation";
    $scope.ADD_MORE_TERMS_CONDITIONS_NAME = "Add More Terms & Conditions";
    $scope.ADD_MORE_ITEM_NAME = "Add a line";
    $scope.DISABLE_FIELD = false;
    $scope.Invoice_Search = {
        CURRENCY_ID: parseInt($cookies.get("CURRENCY_ID")),
        TAX_TYPE: 1,
        IS_MULTI_FILE_UPLOAD_ALLOW: true,
        IS_MULTI_FILE_UPLOAD_ALLOW: true,
        INVOICE_TYPE_ID: -1,
        BASE_TO_INVOICE_CONVERSION_RATE: 1
    }
    $scope.INVOICE_BLANK_ITEM = {
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

    $scope.INVOICE_TAX_TYPE = [{ ID: 1, NAME: 'Tax Exclusive' }, { ID: 2, NAME: 'Tax Inclusive' }];
    $scope.INVOICE_CURRENCY_TYPE = [{ ID: 1, NAME: 'Tax Exclusive' }, { ID: 2, NAME: 'Tax Inclusive' }, { ID: 3, NAME: 'No Tax' }];
    $scope.SPLIT_TYPE = [{ ID: 1, NAME: '2' }, { ID: 2, NAME: '3' }, { ID: 3, NAME: '4' }, { ID: 4, NAME: '5' }, { ID: 5, NAME: '6' }, { ID: 6, NAME: '7' }, { ID: 7, NAME: '8' }, { ID: 8, NAME: '9' }, { ID: 9, NAME: '10' }, { ID: 10, NAME: '11' }, { ID: 11, NAME: '12' }];
    $scope.TAB_FLAG = 1;
    $scope.INVOICE_ITEM_LIST = [];
    $scope.INVOICE_DELETE_ITEM_LIST = [];

    $scope.INVOICE_XERO_TRACKING_CATEGORIES = [];
    $scope.INVOICE_XERO_TRACKING_CATEGORIES_OPTIONS = [];
    $scope.INVOICE_SUPPLIER_LIST = [];

    $scope.INVOICE_XERO_ACCOUNT_CODES = [];
    $scope.INVOICE_CURRENCY_LIST = [];
    $scope.INVOICE_XERO_BRANDING_THEMES_LIST = [];
    $scope.INVOICE_XERO_TAXES_ALL = [];
    $scope.INVOICE_SELECTED_XERO_TRACKING_CATEGORIES_OPTIONS = [];
    $scope.INVOICE_SELECTED_PROCESSED_XERO_TRACKING_CATEGORIES_OPTIONS = [];
    $scope.INVOICE_SELECTED_XERO_TRACKING_CATEGORIES_OPTIONS = [];

    $scope.GET_XERO_TAXES = function (REQUEST_LINE, FLAG) {
        $scope.$parent.overlay_loadingNew = 'block';
        var CustmObj = new Object();
        CustmObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CustmObj.BRANCH_IDS = REQUEST_LINE.BRANCH_ID;
        PrcCommMethods.INVOICE_API(CustmObj, 'GET_XERO_TAXES').then(function (data) {
            if (data.data.Table != undefined) {
                $scope.INVOICE_XERO_TAXES = data.data.Table;
                $scope.INVOICE_XERO_TAXES_ALL = data.data.Table1;
                $scope.$parent.overlay_loadingNew = 'none';
            }
            else {
                $scope.INVOICE_XERO_TAXES = [];
                $scope.$parent.overlay_loadingNew = 'none';
            }
            $scope.GET_APPROVAL_CUSTOM_FIELD_OPTIONS_MASTER(REQUEST_LINE, FLAG);
        });
    };
    $scope.GET_PYMNT_SUPPLIER = function (REQUEST_LINE) {
        var PaymentModelObj = new Object();
        PaymentModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PaymentModelObj.BRANCH_LOGIN_ID = REQUEST_LINE.BRANCH_ID;
        PaymentModelObj.PAGE_NO = 0;
        PaymentModelObj.PAGE_SIZE = 0;
        PaymentModelObj.SUPPLIER_NAME = null;
        PaymentModelObj.FLAG = 0;
        PrcCommMethods.PAYMENT_API(PaymentModelObj, 'GET_PYMNT_SUPPLIER').then(function (data) {
            if (data.data != undefined && data.data.Table.length > 0) {
                $scope.INVOICE_SUPPLIER_LIST = data.data.Table;
                $('#AddCustomScroll_SHD').find('.dropdown-menu').addClass('custom-scrollbar');
                $('#AddCustomScroll_INVOICE').find('.dropdown-menu').addClass('custom-scrollbar');
            } else {
                $scope.INVOICE_SUPPLIER_LIST = [];
            }
        })
    }
    $scope.GET_XERO_ACCOUNT_CODES = function (REQUEST_LINE, FLAG) {
        //$scope.$parent.overlay_loadingNew = 'block';
        var CusModelObj = new Object();
        CusModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CusModelObj.BRANCH_ID = REQUEST_LINE.BRANCH_ID;
        CusModelObj.APPROVAL_TYPE_ID = 4;// PO and 4 invoice create onlu
        CusModelObj.USER_ID = parseInt($cookies.get("USERID"));
        CusModelObj.PROJECT_MASTER_ID = REQUEST_LINE.PROJECT_MASTER_ID == undefined || REQUEST_LINE.PROJECT_MASTER_ID == null ? 0 : REQUEST_LINE.PROJECT_MASTER_ID;
        CusModelObj.ADMIN_FLAG = 1;// In case of admin flag set to 1  for invoice need to be change in case invoice  is create in over system
        PrcCommMethods.P2P_API(CusModelObj, 'GET_P2P_ACCOUNT_CODES', 'PO').then(function (data) {
            if (data.data.Table != undefined) {
                $scope.INVOICE_XERO_ACCOUNT_CODES = data.data.Table;
                $scope.INVOICE_XERO_ACCOUNT_CODES = angular.copy(data.data.Table.filter(p => p.CODE != null && p.CODE != ''));
            }
            else {
                $scope.INVOICE_XERO_ACCOUNT_CODES = [];
            }
            if (FLAG == 'PROJECT') {
                $scope.BUDGET_TEXT_VALIDATION = "Fetching Budget...";
                $scope.ITEM_LIST_VALID(1);
                $scope.GET_P2P_BUDGET_BY_ACCOUNTS(FLAG, $scope.Invoice_Search, $scope.Invoice_Search);
            }
            else if (FLAG != undefined) {
                $scope.GET_XERO_TAXES(REQUEST_LINE, FLAG);
            }
        });
    };
    $scope.GET_CONVERSION_RATE = function (FLAG) {
        ModelObj = new Object();
        ModelObj.FROM_CURRENCY_ID = $scope.Invoice_Search.BASE_CURRENCY_ID;
        ModelObj.TO_CURRENCY_ID = $scope.Invoice_Search.INVOICE_CURRENCY_ID;
        ModelObj.DATE = $scope.Invoice_Search.BUDGET_DATE == undefined || $scope.Invoice_Search.BUDGET_DATE == "" || $scope.Invoice_Search.BUDGET_DATE == null ? (new Date()).toDateString() : new Date($scope.Invoice_Search.BUDGET_DATE).toDateString();
        PrcCommMethods.P2P_API(ModelObj, 'GET_CONVERSION_RATE', 'PO').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.Invoice_Search.BASE_TO_INVOICE_CONVERSION_RATE = parseFloat(data.data.Table[0].Column1).toFixed(5);
            }
        });
    };
    $scope.GET_CURRENCY = function (FLAG) {
        var CustmObj = new Object();
        PrcCommMethods.HR_API(CustmObj, 'GET_CURRENCY').then(function (data) {
            if (data.data.Table != undefined) {
                $scope.CURRENCY_LIST = angular.copy(data.data.Table);
                $scope.INVOICE_CURRENCY_LIST = angular.copy(data.data.Table);
                var item = data.data.Table.filter(function (x) { return x.CURRENCY_ID == parseInt($cookies.get("CURRENCY_ID")) })
                if (item.length > 0 && FLAG == undefined) {
                    $scope.Invoice_Search.INVOICE_CURRENCY_ID = angular.copy(item[0].CURRENCY_ID);
                    $scope.Invoice_Search.INVOICE_CURRENCY_NAME = angular.copy(item[0].DISPLAY_TEXT);
                    $scope.Invoice_Search.BASE_CURRENCY_ID = angular.copy(item[0].CURRENCY_ID);
                    $scope.Invoice_Search.BASE_CURRENCY_NAME = angular.copy(item[0].DISPLAY_TEXT);
                }
            }
            else {
                $scope.INVOICE_CURRENCY_LIST = [];
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
                $scope.INVOICE_XERO_TRACKING_CATEGORIES = data.data.MASTER;
                $scope.INVOICE_XERO_TRACKING_CATEGORIES_OPTIONS = data.data.Table;
                $scope.GET_INVOICE_BY_ID(REQUEST_LINE, FLAG);
            }
            else {
                $scope.GET_INVOICE_BY_ID(REQUEST_LINE, FLAG);
                $scope.INVOICE_XERO_TRACKING_CATEGORIES = [];
                $scope.INVOICE_XERO_TRACKING_CATEGORIES_OPTIONS = [];
                $scope.$parent.overlay_loadingNew = 'none';
            }
        });
    };
    $scope.GET_XERO_BRANDING_THEMES = function (REQUEST_LINE, FLAG) {
        var ModelObj = new Object();
        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        ModelObj.BRANCH_ID = REQUEST_LINE.BRANCH_ID;
        PrcCommMethods.ADMIN_API(ModelObj, 'GET_XERO_BRANDING_THEMES').then(function (data) {
            if (data.data.Table != undefined) {
                $scope.INVOICE_XERO_BRANDING_THEMES_LIST = data.data.Table;
                $scope.Invoice_Search.XERO_BRANDING_THEME_ID = data.data.Table[0].XERO_BRANDING_THEME_ID;
            }
            else {
                $scope.INVOICE_XERO_BRANDING_THEMES_LIST = [];
            }
        });

    }

    $scope.GET_P2P_BUDGET_BY_ACCOUNTS = function (FLAG, LINE, HEADER, CHANGE_FLAG) {
        var ptopobj = new Object();
        ptopobj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        ptopobj.BRANCH_ID = LINE.BRANCH_ID;
        ptopobj.USER_ID = parseInt($cookies.get("USERID"));
        ptopobj.YEAR = new Date(HEADER.BUDGET_DATE != '' && HEADER.BUDGET_DATE != null && HEADER.BUDGET_DATE != undefined ? HEADER.BUDGET_DATE : HEADER.INVOICE_DATE).getFullYear();
        ptopobj.MONTH = new Date(HEADER.BUDGET_DATE != '' && HEADER.BUDGET_DATE != null && HEADER.BUDGET_DATE != undefined ? HEADER.BUDGET_DATE : HEADER.INVOICE_DATE).getMonth() + 1;
        ptopobj.REFERENCE_ID = LINE.INVOICE_HEADER_ID;
        ptopobj.REFERENCE_TYPE = 2; // BILL
        if (HEADER.PROJECT_MASTER_ID == null || HEADER.PROJECT_MASTER_ID == undefined || HEADER.PROJECT_MASTER_ID == "") {
            ptopobj.PROJECT_MASTER_ID = 0;
        } else {
            ptopobj.PROJECT_MASTER_ID = CHANGE_FLAG == 1 ? HEADER.PROJECT_MASTER_ID : HEADER.PROJECT_MASTER_ID;// LINE.PROJECT_MASTER_ID;
        }
        ptopobj.XERO_ACCOUNTS_FOR_BUDGET = [];
        angular.forEach($scope.INVOICE_ITEM_LIST, function (item) {
            var readonlyobj = new Object()
            readonlyobj.ACCOUNT_ID = parseInt(item.ACCOUNT_ID);
            readonlyobj.ACCOUNT_DETAILS = item.ACCOUNT_NAME;
            var alreadyAccount = ptopobj.XERO_ACCOUNTS_FOR_BUDGET.filter(function (x) { return x.ACCOUNT_ID == readonlyobj.ACCOUNT_ID });
            if (alreadyAccount.length == 0) {
                ptopobj.XERO_ACCOUNTS_FOR_BUDGET.push(readonlyobj);
            }
        });

        ptopobj.SETTING_45 = $scope.$parent.SETTING_USE_GROSS;
        if (ptopobj.XERO_ACCOUNTS_FOR_BUDGET.length > 0) {
            PrcCommMethods.P2P_API(ptopobj, 'GET_P2P_BUDGET_BY_ACCOUNTS', 'PO').then(function (data) {
                if (data.data != null) {
                    $scope.APViewSearch.BUDGET_NAME = data.data.BUDGET_NAME;
                    $scope.P2P_INVOICE_BUDGET_MASTER_LIST = data.data.Budget_Account_Data_List;
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




    $scope.GET_BRANCH_LIST = function () {
        var UserModelObj = new Object();
        UserModelObj.INTEGRATION_SYSTEM_ID = 16
        UserModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        UserModelObj.USER_ID = parseInt($cookies.get("USERID"));
        UserModelObj.MODULE_ID = parseInt($cookies.get("MODULE_ID"));
        PrcCommMethods.CASHUP_API(UserModelObj, 'GET_BRANCH_LIST').then(function (data) {
            if (data.data.length > 0) {
                $scope.BRANCH_LOGIN_LIST = data.data;
                if ($scope.BRANCH_LOGIN_LIST.length > 1) {
                    $('#select_branch').modal('show');
                }
                else if ($scope.BRANCH_LOGIN_LIST.length == 1) {
                    $scope.CLICK_BRANCH_FY($scope.BRANCH_LOGIN_LIST[0]);
                }
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
                $scope.INVOICE_PROJECT_MASTER_LIST = data.data.Table1;
            } else {
                $scope.INVOICE_PROJECT_MASTER_LIST = [];
            };
        });
    }
    $scope.GET_TERMS_AND_CONDITIONS_MASTER = function (REQUEST_LINE, FLAG) {
        var ModelObj = new Object();
        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        ModelObj.BRANCH_ID = REQUEST_LINE.BRANCH_ID;
        ModelObj.TYPE = 1;// --1 FOR PO T & C
        ModelObj.ACTIVE = 1;
        ModelObj.PAGE_NO = 0;
        ModelObj.PAGE_SIZE = 0;
        PrcCommMethods.ADMIN_API(ModelObj, 'GET_TERMS_AND_CONDITIONS_MASTER').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.INVOICE_TERMS_AND_CONDITIONS_MASTER_LIST = data.data.Table;
            }
            else {
                $scope.INVOICE_TERMS_AND_CONDITIONS_MASTER_LIST = [];
                $scope.ADD_MORE_INVOICE_TERM_CON();
            }
        });
    }

    $scope.CLICK_BRANCH_FY = function (BL) {
        $scope.Invoice_Search.BRANCH_ID = BL.BRANCH_ID;
        $scope.Invoice_Search.UploadedFiles = [];
        $scope.GET_PYMNT_SUPPLIER($scope.Invoice_Search, 3);
        $scope.GET_XERO_ACCOUNT_CODES($scope.Invoice_Search, 3)
        $scope.GET_XERO_BRANDING_THEMES($scope.Invoice_Search, 3);
        $scope.GET_PROJECT_MASTER($scope.Invoice_Search, 3);
        $scope.ADD_MORE_ITEM_INVOICE();
        $scope.INVOICE_FORM.submitted = false;
    }
    $scope.RESET_INVOICE = function () {
        $scope.Invoice_Search.INVOICE_DATE = $filter('date')(new Date());
        $scope.Invoice_Search.DELIVERY_DATE = "";
        $scope.Invoice_Search.REFERENCE = "";
        $scope.Invoice_Search.NOTE_FOR_APPROVERS = "";
        $scope.Invoice_Search.TAX_TYPE = "";
        $scope.Invoice_Search.DELIVERY_ADDRESS = "";
        $scope.Invoice_Search.ATTENTION = "";
        $scope.Invoice_Search.PHONE = "";
        $scope.Invoice_Search.DELIVERY_INSTRUCTIONS = "";
        $scope.Invoice_Search.AUTO_EMAIL_TO_SUPPLIER = "";
        $scope.Invoice_Search.UploadedFiles = [];
        $scope.Invoice_Search.SUPPLIER_NAME = "";
        $scope.Invoice_Search.SELECT_CURRENCY = {};
        $scope.Invoice_Search.DEFAULT_CURRENCY = {};
        $scope.Invoice_Search.TAX_TYPE = 1;
        $scope.Invoice_Search.BASE_TO_INVOICE_CONVERSION_RATE = 1;

        $scope.Invoice_Search.PROJECT_MASTER_ID = null;
        $scope.Invoice_Search.INVOICE_NUMBER = null;
        $scope.Invoice_Search.DUE_DATE = null;
        $scope.INVOICE_ITEM_LIST = [];
        $scope.INVOICE_FORM.submitted = false;


        $scope.ADD_MORE_ITEM_INVOICE();
    };



    $scope.GET_INVOICE_BY_ID = function (REQ, FLAG) {
        ModelObj = new Object();
        ModelObj.INVOICE_HEADER_ID = REQ.INVOICE_HEADER_ID
        PrcCommMethods.P2P_API(ModelObj, 'GET_INVOICE_BY_ID', 'PO').then(function (data) {
            if (data.data.Table.length > 0) {
                console.log(data);
                var SUPList = $scope.INVOICE_SUPPLIER_LIST.filter(function (x) { return x.ID == data.data.Table[0].CONTACT_ID });
                if (SUPList.length > 0) { $scope.Invoice_Search.SUPPLIER_NAME = SUPList[0].SUPPLIER_NAME; }
                var TAX_TYPEList = $scope.TAX_TYPE.filter(function (x) { return x.ID == data.data.Table[0].TAX_TYPE });
                if (TAX_TYPEList.length > 0) {
                    data.data.Table[0].TAX_NAME = TAX_TYPEList[0].NAME;
                    data.data.Table[0].TAX_ID = TAX_TYPEList[0].ID;
                }
                $scope.Invoice_Search.INVOICE_DETAILS = data.data.Table[0];
                //  $scope.Invoice_Search.INVOICE_DETAILS.SELECTED_REQ = $scope.SELECTED_REQ;
                $scope.Invoice_Search.INVOICE_DATE = data.data.Table[0].INVOICE_DATE == "" || data.data.Table[0].INVOICE_DATE == null ? $filter('date')(new Date()) : $filter('date')(new Date(data.data.Table[0].INVOICE_DATE));
                $scope.Invoice_Search.BUDGET_DATE = data.data.Table[0].BUDGET_DATE == "" || data.data.Table[0].BUDGET_DATE == null ? $filter('date')(new Date(data.data.Table[0].INVOICE_DATE)) : $filter('date')(new Date(data.data.Table[0].BUDGET_DATE));
                $scope.Invoice_Search.DUE_DATE = data.data.Table[0].DUE_DATE == "" || data.data.Table[0].DUE_DATE == null ? "" : $filter('date')(new Date(data.data.Table[0].DUE_DATE));
                $scope.Invoice_Search.INVOICE_NUMBER = data.data.Table[0].INVOICE_NUMBER;
                $scope.Invoice_Search.REFERENCE = data.data.Table[0].REFERENCE;
                $scope.Invoice_Search.PROJECT_MASTER_ID = data.data.Table[0].PROJECT_MASTER_ID;
                $scope.Invoice_Search.XERO_BRANDING_THEME_ID = data.data.Table[0].XERO_BRANDING_THEME_ID;

                $scope.Invoice_Search.INVOICE_HEADER_ID = data.data.Table[0].INVOICE_HEADER_ID;
                $scope.Invoice_Search.XERO_INVOICE_ID = data.data.Table[0].XERO_INVOICE_ID;

                $scope.Invoice_Search.BRANCH_ID = data.data.Table[0].BRANCH_ID;
                $scope.Invoice_Search.TAX_TYPE = data.data.Table[0].TAX_TYPE;
                $scope.Invoice_Search.INVOICE_TYPE_ID = data.data.Table[0].INVOICE_TYPE_ID;

                $scope.Invoice_Search.BASE_TO_INVOICE_CONVERSION_RATE = data.data.Table[0].BASE_TO_INVOICE_CONVERSION_RATE;
                $scope.INVOICE_SELECTED_XERO_TRACKING_CATEGORIES_OPTIONS = data.data.Table2;

                $scope.INVOICE_ITEM_LIST = data.data.Table1;
                if (data.data.Table[0].BASE_CURRENCY_ID == data.data.Table[0].CURRENCY_ID) {
                    var item = $scope.INVOICE_CURRENCY_LIST.filter(function (x) { return x.CURRENCY_ID == data.data.Table[0].CURRENCY_ID });

                    $scope.Invoice_Search.INVOICE_CURRENCY_ID = angular.copy(item[0].CURRENCY_ID);
                    $scope.Invoice_Search.BASE_CURRENCY_ID = angular.copy(item[0].CURRENCY_ID);
                    $scope.Invoice_Search.INVOICE_CURRENCY_NAME = angular.copy(item[0].DISPLAY_TEXT);
                    $scope.Invoice_Search.BASE_CURRENCY_NAME = angular.copy(item[0].DISPLAY_TEXT);
                }
                else {
                    var CurrBaseList = $scope.INVOICE_CURRENCY_LIST.filter(function (x) { return x.CURRENCY_ID == data.data.Table[0].BASE_CURRENCY_ID });
                    var CurrInvoiceList = $scope.INVOICE_CURRENCY_LIST.filter(function (x) { return x.CURRENCY_ID == data.data.Table[0].CURRENCY_ID });

                    $scope.Invoice_Search.INVOICE_CURRENCY_ID = angular.copy(CurrInvoiceList[0].CURRENCY_ID);
                    $scope.Invoice_Search.BASE_CURRENCY_ID = angular.copy(CurrBaseList[0].CURRENCY_ID);

                    $scope.Invoice_Search.INVOICE_CURRENCY_NAME = angular.copy(CurrInvoiceList[0].DISPLAY_TEXT);
                    $scope.Invoice_Search.BASE_CURRENCY_NAME = angular.copy(CurrBaseList[0].DISPLAY_TEXT);

                };
                $scope.$parent.$parent.overlay_loadingNew = 'none';
            }
        });
    }

    $scope.InitiateInvoiceXeroTrackingCategories = function (item, Trackingcat_index, PRL, FLAG) {
        if (item.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID > 0 && $scope.INVOICE_SELECTED_XERO_TRACKING_CATEGORIES_OPTIONS.length > 0) {
            var select_cat = $scope.INVOICE_SELECTED_XERO_TRACKING_CATEGORIES_OPTIONS.filter(p => p.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID == item.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID && PRL.PO_LINE_ID == p.PO_LINE_ID)[0];
            if (select_cat != undefined && select_cat != null) {
                var text = $scope.INVOICE_XERO_TRACKING_CATEGORIES_OPTIONS.filter(function (x) { return x.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID == select_cat.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID && x.APPROVAL_CHAIN_CUSTOM_FIELD_OPTIONS_MASTER_ID == select_cat.APPROVAL_CHAIN_CUSTOM_FIELD_OPTIONS_MASTER_ID });
                item.SELECTED_CATEGORY_OPTION = text[0];
            }
        }
    }
    $scope.InitiateINVOICEQuotation = function (item) {
        if (item != undefined && item.TABLE_ID > 0) {
            if (item.UploadedFiles == undefined) {
                item.UploadedFiles = [];
            }
            $scope.$parent.GET_UPLOADS(item, 35, item.TABLE_ID);
        }
    };
    $scope.InitiateEditItemList = function (PRL, FLAG) {
        PRL.INVOICE_XERO_TRACKING_CATEGORIES = angular.copy($scope.XERO_TRACKING_CATEGORIES);
        if (PRL.ACCOUNT_ID != undefined && FLAG == 1) {
            var XAC = $scope.INVOICE_XERO_ACCOUNT_CODES.filter(function (x) { return x.TABLE_ID == PRL.ACCOUNT_ID });
            if (XAC.length > 0) {
                PRL.ACCOUNT_DETAILS = XAC[0];
                PRL.ACCOUNT_NAME = XAC[0].CODE + ' - ' + XAC[0].NAME;
            }
        }
        if (PRL.TAX_RATE_ID != undefined && FLAG == 1) {
            var TAX = $scope.INVOICE_XERO_TAXES.filter(function (x) { return x.ID == PRL.TAX_RATE_ID });
            if (TAX.length > 0) {
                PRL.TAX_ID = TAX[0];
            }
            else {
                var TAX = $scope.INVOICE_XERO_TAXES_ALL.filter(function (x) { return x.ID == PRL.TAX_RATE_ID });
                if (TAX.length > 0) {
                    PRL.TAX_ID = TAX[0];
                }
            }
        }
    }

    $scope.PAGE_LOAD_INVOICE = function (INVOICE_DETAILS, TAB_FLAG) {
        $scope.INVOICE_ITEM_LIST = [];
        $scope.INVOICE_DELETE_ITEM_LIST = [];
        $scope.INVOICE_XERO_TRACKING_CATEGORIES = [];
        $scope.INVOICE_XERO_TRACKING_CATEGORIES_OPTIONS = [];
        $scope.INVOICE_SUPPLIER_LIST = [];
        $scope.P2P_INVOICE_BUDGET_MASTER_LIST = [];
        $scope.INVOICE_XERO_ACCOUNT_CODES = [];
        $scope.INVOICE_CURRENCY_LIST = [];
        $scope.INVOICE_XERO_BRANDING_THEMES_LIST = [];
        $scope.ACTIVE_TAB_FLAG = TAB_FLAG;
        $scope.INVOICE_SELECTED_XERO_TRACKING_CATEGORIES_OPTIONS = [];
        $scope.INVOICE_SELECTED_PROCESSED_XERO_TRACKING_CATEGORIES_OPTIONS = [];
        $scope.INVOICE_SELECTED_XERO_TRACKING_CATEGORIES_OPTIONS = [];
        $scope.Invoice_Search = {
            CURRENCY_ID: parseInt($cookies.get("CURRENCY_ID")),
            TAX_TYPE: 1,
            IS_MULTI_FILE_UPLOAD_ALLOW: true,
            IS_MULTI_FILE_UPLOAD_ALLOW: true,
            INVOICE_TYPE_ID: INVOICE_DETAILS.INVOICE_TYPE_ID,
        }
        $scope.DISABLE_FIELD = false;
        $scope.SELECTED_INVOICE_DETAILS = {
        };
        //  $scope.RESET_Invoice();
        if (INVOICE_DETAILS != undefined) {
            $scope.SELECTED_INVOICE_DETAILS = INVOICE_DETAILS;
            $scope.Invoice_Search.UploadedFiles = [];
            $scope.DISABLE_FIELD = true;
            // $scope.GET_BRANCH_LIST(1);
            $scope.GET_CURRENCY(1);
            $scope.GET_PYMNT_SUPPLIER(INVOICE_DETAILS, 0);
            $scope.GET_XERO_ACCOUNT_CODES(INVOICE_DETAILS, 0)
            $scope.GET_XERO_BRANDING_THEMES(INVOICE_DETAILS, 0);
            $scope.GET_PROJECT_MASTER(INVOICE_DETAILS, 0);
            //  $scope.GET_PO_SPLIT_DATES_BY_INVOICE_ID();
            //$scope.$parent.GET_UPLOADS($scope.Invoice_Search, 32, INVOICE_DETAILS.INVOICE);
        }
        else {
            $scope.GET_BRANCH_LIST();
            $scope.GET_CURRENCY();
        }

    }
    $scope.SetQValues = function (Supplier, index) {
        $('.AddCustomScroll_Contact').find('.dropdown-menu').addClass('custom-scrollbar');
    }
    $scope.SetQuotationValues = function (Supplier, index) {
        var List = $scope.INVOICE_SUPPLIER_LIST.filter(function (x) { return x.SUPPLIER_NAME == Supplier.CONTACT_NAME });
        Supplier.INVALID = false;
        if (List.length == 0) {
            Supplier.INVALID = true;
        }
    }
    $scope.ITEM_LIST_VALID = function (FLAG) {
        angular.forEach($scope.INVOICE_ITEM_LIST, function (LINE) {
            var Accountlist = $scope.INVOICE_XERO_ACCOUNT_CODES.filter(function (x) { return x.CODE + ' - ' + x.NAME == LINE.ACCOUNT_NAME });
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

    $scope.ChangeBudgetDate = function (text, FLAG) {
        $scope.ChangeBudget('', '')
    }
    $scope.ChangeBudget = function (text, FLAG) {
        //FLAG, LINE, HEADER, CHANGE_FLAG
        $scope.BUDGET_TEXT_VALIDATION = "Fetching Budget...";
        $scope.ITEM_LIST_VALID(1);
        $scope.GET_P2P_BUDGET_BY_ACCOUNTS(FLAG, $scope.Invoice_Search, $scope.Invoice_Search);

    }
    $scope.CHANGE_CURRENCY = function () {
        if ($scope.Invoice_Search.BASE_CURRENCY_ID == $scope.Invoice_Search.INVOICE_CURRENCY_ID) {
            $scope.Invoice_Search.BASE_TO_INVOICE_CONVERSION_RATE = 1;
        }
        else {
            $scope.GET_CONVERSION_RATE(1);
        }

    }

    $scope.Fn_CHANGE_PROJECT = function () {
        $scope.GET_XERO_ACCOUNT_CODES($scope.Invoice_Search, 'PROJECT');
    }
    $scope.Fn_SPLIT_REQ = function (LINE, FLAG) {
        if (FLAG == 1) {
            $scope.Invoice_Search.SPLIT_TYPE = 1;
        }
        if ($scope.Invoice_Search.SPLIT_TYPE > 0) {
            var Newdate = new Date('01/01/2010');
            var SELECT_YEAR = angular.copy(new Date(LINE.PO_DATE)).getFullYear();
            var DATE = new Date(new Date(Newdate).setFullYear(SELECT_YEAR));
            var MouthStart = new Date(LINE.PO_DATE).getMonth();
            var MonthEnd = MouthStart + $scope.Invoice_Search.SPLIT_TYPE;
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
                    $scope.MONTH_EDIT_LIST.push(ReadOnly);
                }
            }
        }
        else {
            $scope.MONTH_EDIT_LIST = [];
        }
    }

    $scope.ADD_MORE_ITEM_INVOICE = function () {
        $scope.INVOICE_ITEM_LIST.push(angular.copy($scope.INVOICE_BLANK_ITEM));
    }

    $scope.ADD_MORE_TERM_CON_INVOICE = function () {
        if ($scope.INVOICE_TERMS_AND_CONDITIONS_MASTER_LIST.length > 0) {
            var SORT_ORDER = $scope.INVOICE_TERMS_AND_CONDITIONS_MASTER_LIST[$scope.INVOICE_TERMS_AND_CONDITIONS_MASTER_LIST.length - 1].SORT_ORDER;
            $scope.INVOICE_BLANK_TERM_CONT.SORT_ORDER = SORT_ORDER + 1;
        } else {
            $scope.INVOICE_BLANK_TERM_CONT.SORT_ORDER = 1;
        };
        $scope.INVOICE_TERMS_AND_CONDITIONS_MASTER_LIST.push(angular.copy($scope.INVOICE_BLANK_TERM_CONT));
        $('.AddCustomScroll_Contact').find('.dropdown-menu').addClass('custom-scrollbar');
    }
    $scope.ADD_MORE_QUOTATION_INVOICE = function () {
        $scope.INVOICE_QUOTATION_LIST.push(angular.copy($scope.INVOICE_BLANL_QUOTATION_LIST));
        $('.AddCustomScroll_Contact').find('.dropdown-menu').addClass('custom-scrollbar');
    }
    $scope.ADD_ABOVE_INVOICE = function (LINE, index) {
        var SORT_ORDER = angular.copy(LINE.SORT_ORDER);
        angular.forEach($scope.INVOICE_TERMS_AND_CONDITIONS_MASTER_LIST, function (val, valindex) {
            if (SORT_ORDER == val.SORT_ORDER) {
                val.SORT_ORDER = val.SORT_ORDER - 1;
            }
            else if ((SORT_ORDER - 1) == val.SORT_ORDER) {
                val.SORT_ORDER = val.SORT_ORDER + 1;
            }
        })
    }
    $scope.ADD_BELOW_INVOICE = function (LINE, index) {
        var SORT_ORDER = angular.copy(LINE.SORT_ORDER);
        angular.forEach($scope.INVOICE_TERMS_AND_CONDITIONS_MASTER_LIST, function (val, valindex) {
            if (SORT_ORDER == val.SORT_ORDER) {
                val.SORT_ORDER = val.SORT_ORDER + 1;
            }
            else if ((SORT_ORDER + 1) == val.SORT_ORDER) {
                val.SORT_ORDER = val.SORT_ORDER - 1;
            }
        })
    }


    $scope.REMOVE_LINE_ITEM_INVOICE = function (index, LINE) {
        if (LINE.PO_LINE_ID == undefined || LINE.PO_LINE_ID == "" || LINE.PO_LINE_ID == null) {
            $scope.INVOICE_ITEM_LIST.splice(index, 1);
        }
        else {
            $scope.INVOICE_DELETE_ITEM_LIST.push(LINE);
            $scope.INVOICE_ITEM_LIST.splice(index, 1);
        }
    }
    $scope.REMOVE_FILTE_INVOICE = function (index) { $scope.Invoice_Search.UploadedFiles.splice(index, 1) }


    $scope.REMOVE_FILTE_INVOICE = function (index) { $scope.Invoice_Search.UploadedFiles.splice(index, 1) }
    $scope.INVOICE_FORM_CLOSE = function () {
        $('#Invoice').modal('hide');
    }

    $scope.TAXPERCENTAGE_CHANGE = function (TAX_TYPE, LINE) {
        if (TAX_TYPE != null) {
            if (LINE.TAX_RATE == undefined) {
                LINE.TAX_RATE = 0;
            }
            LINE.TAX_RATE = LINE.TAX_ID.RATE;
        }

    };
    $scope.SetAccountValues = function () {
        $('.AddCustomScroll_Account').find('.dropdown-menu').addClass('w-30 custom-scrollbar');
    }
    $scope.INS_UPD_INVOICES = function (DRAFT_FLAG) {
        $scope.$parent.$parent.overlay_loadingNew = 'block';
        var accountlgth = 0;
        angular.forEach($scope.INVOICE_ITEM_LIST, function (LINE) {
            LINE.IS_ACCOUNT_VALID = false;
            var Accountlist = $scope.INVOICE_XERO_ACCOUNT_CODES.filter(function (x) { return x.CODE + ' - ' + x.NAME == LINE.ACCOUNT_NAME });
            if (Accountlist.length > 0) {
                LINE.ACCOUNT_DETAILS = Accountlist[0];
            }
            else {
                LINE.IS_ACCOUNT_VALID = true;
                accountlgth = 1;
            }
        });
        $scope.INVOICE_FORM.submitted = true;
        if ($scope.INVOICE_FORM.$valid && accountlgth == 0) {
            var List = $scope.INVOICE_SUPPLIER_LIST.filter(function (x) { return x.SUPPLIER_NAME == $scope.Invoice_Search.SUPPLIER_NAME });
            if (List.length == 0) {
                $scope.$parent.ShowAlert("Error", 'Please select valid contact name', 3000);
            }
            else {
                if (confirm('Are you sure you want to submit?')) {
                    var ptopobj = new Object();
                    ptopobj.INVOICE_HEADER_ID = $scope.Invoice_Search.INVOICE_HEADER_ID == undefined ? null : $scope.Invoice_Search.INVOICE_HEADER_ID;
                    ptopobj.INVOICE_NUMBER = $scope.Invoice_Search.INVOICE_NUMBER;
                    ptopobj.REFERENCE = $scope.Invoice_Search.REFERENCE;
                    ptopobj.INVOICE_TYPE_ID = $scope.Invoice_Search.INVOICE_TYPE_ID;
                    ptopobj.CONTACT_ID = List[0].ID;
                    ptopobj.INVOICE_DATE = $scope.Invoice_Search.INVOICE_DATE;
                    ptopobj.DUE_DATE = $scope.Invoice_Search.DUE_DATE;
                    ptopobj.TAX_TYPE = $scope.Invoice_Search.TAX_TYPE;
                    ptopobj.NET_AMOUNT = parseFloat($scope.Invoice_Search.NET_AMOUNT).toFixed(5); //NET;
                    ptopobj.TAX_AMOUNT = parseFloat($scope.Invoice_Search.TAX_AMOUNT).toFixed(5);//TAX;
                    ptopobj.TOTAL_AMOUNT = parseFloat($scope.Invoice_Search.TOTAL_AMOUNT).toFixed(5);//NET+TAX;
                    ptopobj.TOTAL_DISCOUNT = parseFloat($scope.Invoice_Search.TOTAL_DISCOUNT).toFixed(5);//NET+TAX;
                    ptopobj.INVOICE_CURRENCY_ID = $scope.Invoice_Search.INVOICE_CURRENCY_ID;
                    ptopobj.BASE_CURRENCY_ID = $scope.Invoice_Search.BASE_CURRENCY_ID;
                    if ($scope.Invoice_Search.INVOICE_CURRENCY_ID != $scope.Invoice_Search.BASE_CURRENCY_ID) { ptopobj.BASE_TO_INVOICE_CONVERSION_RATE = $scope.Invoice_Search.BASE_TO_INVOICE_CONVERSION_RATE; }
                    else { ptopobj.BASE_TO_INVOICE_CONVERSION_RATE = 1; }
                    ptopobj.XERO_BRANDING_THEME_ID = $scope.Invoice_Search.XERO_BRANDING_THEME_ID == undefined ? null : $scope.Invoice_Search.XERO_BRANDING_THEME_ID;
                    ptopobj.XERO_INVOICE_ID = $scope.Invoice_Search.XERO_INVOICE_ID;
                    ptopobj.IS_DRAFT = 0;
                    ptopobj.UPLOAD_IDS = "";
                    angular.forEach($scope.Invoice_Search.UploadedFiles, function (x) {
                        if (ptopobj.UPLOAD_IDS == "") { ptopobj.UPLOAD_IDS = x.ID; }
                        else { ptopobj.UPLOAD_IDS = ptopobj.UPLOAD_IDS + "," + x.ID; }
                    });
                    ptopobj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
                    ptopobj.BRANCH_ID = $scope.Invoice_Search.BRANCH_ID;
                    ptopobj.USER_ID = parseInt($cookies.get("USERID"));
                    ptopobj.INTEGRATION_SYSTEM_ID = null;
                    ptopobj.PROJECT_MASTER_ID = $scope.Invoice_Search.PROJECT_MASTER_ID == 0 ? null : $scope.Invoice_Search.PROJECT_MASTER_ID;
                    ptopobj.BUDGET_DATE = $scope.Invoice_Search.BUDGET_DATE;
                    ptopobj.INVOICE_LINES_TYPE = [];
                    ptopobj.INVOICE_LINES_CUSTOM_FIELDS_TYPE = [];
                    ptopobj.RESET_APPROVAL_CHAIN = 1;  // 1 for reset and 0 for not reset
                    var InINVOICEcount = 0;
                    angular.forEach($scope.INVOICE_ITEM_LIST, function (LINE) {
                        var readonlyobj = new Object()
                        readonlyobj.INVOICE_LINE_ID = LINE.INVOICE_LINE_ID == undefined || LINE.INVOICE_LINE_ID == "" || LINE.INVOICE_LINE_ID == null ? 0 : parseInt(LINE.INVOICE_LINE_ID);
                        readonlyobj.ITEM_NAME = LINE.ITEM_NAME;
                        readonlyobj.DESCRIPTION = LINE.DESCRIPTION;
                        readonlyobj.LINE_NO = LINE.LINE_NO;
                        readonlyobj.QUANTITY = (LINE.QUANTITY == undefined || LINE.QUANTITY == null || LINE.QUANTITY == '') ? null : parseFloat(LINE.QUANTITY).toFixed(5);
                        readonlyobj.UOM_NAME = DRAFT_FLAG == 1 && LINE.UOM_NAME == undefined || LINE.UOM_NAME == null || LINE.UOM_NAME == '' ? null : LINE.UOM_NAME;
                        readonlyobj.UNIT_PRICE = (LINE.UNIT_PRICE == undefined || LINE.UNIT_PRICE == null || LINE.UNIT_PRICE == '') ? null : parseFloat(LINE.UNIT_PRICE).toFixed(5);
                        var Accountlist = $scope.INVOICE_XERO_ACCOUNT_CODES.filter(function (x) { return x.CODE + ' - ' + x.NAME == LINE.ACCOUNT_NAME });
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
                        readonlyobj.TAX_AMOUNT = parseFloat(LINE.TAX_AMOUNT).toFixed(5);
                        readonlyobj.LINE_AMOUNT = parseFloat(LINE.AMOUNT).toFixed(5);
                        readonlyobj.DISCOUNT_PERCENT = (LINE.DISCOUNT_PERCENT == undefined || LINE.DISCOUNT_PERCENT == null || LINE.DISCOUNT_PERCENT == '') ? null : parseFloat(LINE.DISCOUNT_PERCENT);
                        readonlyobj.DISCOUNT_AOUNT = 0/// parseFloat(LINE.DISCOUNT_AMOUNT).toFixed(5);
                        readonlyobj.DELETE_FLAG = 0;
                        readonlyobj.XERO_INVOICE_LINE_ITEM_ID = LINE.XERO_INVOICE_LINE_ITEM_ID == undefined || LINE.XERO_INVOICE_LINE_ITEM_ID == "" ? null : LINE.XERO_INVOICE_LINE_ITEM_ID;
                        if (LINE.INVOICE_XERO_TRACKING_CATEGORIES != undefined && LINE.INVOICE_XERO_TRACKING_CATEGORIES.length > 0 && InINVOICEcount == 0) {
                            angular.forEach(LINE.INVOICE_XERO_TRACKING_CATEGORIES, function (TR) {
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
                    angular.forEach($scope.INVOICE_DELETE_ITEM_LIST, function (LINE) {
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
                        ptopobj.INVOICE_LINES_TYPE.push(readonlyobj);
                    });

                    if (accountlgth == 0) {
                        PrcCommMethods.P2P_API(ptopobj, 'INS_UPD_INVOICES', 'PO').then(function (data) {
                            if (data.data == 1) {
                                $scope.$parent.$parent.ShowAlert("Success", "Invoice Saved Successfully ", 3000);
                                $scope.INVOICE_ITEM_LIST = [];
                                $scope.INVOICE_DELETE_ITEM_LIST = [];
                                $scope.INVOICE_FORM.submitted = false;
                                if ($scope.SELECTED_INVOICE_DETAILS.TAB_FLAG == 1) {
                                    $scope.SELECTED_INVOICE_DETAILS.SELECTED_REQ.PROJECT_MASTER_ID = $scope.Invoice_Search.PROJECT_MASTER_ID == 0 ? null : $scope.Invoice_Search.PROJECT_MASTER_ID;
                                    $scope.$parent.TAB_CLICK_AP_FY(1, $scope.SELECTED_INVOICE_DETAILS.SELECTED_REQ, 1);
                                }
                                else if ($scope.SELECTED_INVOICE_DETAILS.TAB_FLAG == 3) {
                                    $scope.SELECTED_INVOICE_DETAILS.SELECTED_REQ_ALL.PROJECT_MASTER_ID = $scope.Invoice_Search.PROJECT_MASTER_ID == 0 ? null : $scope.Invoice_Search.PROJECT_MASTER_ID;
                                    $scope.$parent.TAB_CLICK_AP_FY(3, $scope.SELECTED_INVOICE_DETAILS.SELECTED_REQ_ALL, 1);
                                }
                                else {
                                    $scope.$parent.TAB_CLICK_AP_FY(1);
                                }
                                $scope.$parent.$parent.overlay_loadingNew = 'none';
                            }
                            else if (data.data == 0) {
                                $scope.$parent.$parent.ShowAlert("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                                $scope.$parent.$parent.overlay_loadingNew = 'none';
                            }
                        });
                    }
                    else {
                        $scope.$parent.$parent.overlay_loadingNew = 'none';
                    }
                }
                else {
                    $scope.$parent.$parent.overlay_loadingNew = 'none';
                }
            }
        }
        else {
            if (accountlgth > 0) {
                $scope.$parent.ShowAlert("Error", 'Please provide valid account detail', 3000);
            }
            else {
                $scope.$parent.ShowAlert("Error", 'Please provide the mandatory details marked as red', 3000);
            }
            $scope.$parent.$parent.overlay_loadingNew = 'none';
        }
    };
    $scope.$on('ngRepeatFinishedInvoiceActionRender', function (ngRepeatFinishedEvent) {
        $scope.GET_P2P_BUDGET_BY_ACCOUNTS(1, $scope.Invoice_Search, $scope.Invoice_Search)
    });
    $scope.$parent.DateInputLoad("EDIT_INVOICE");
    $scope.$parent.Invoice_childScope = $scope;
    $scope.$parent.child_scope = $scope;
});
