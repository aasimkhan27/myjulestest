/// 135	Receiver ///134	Administrator ///133	Approver ///132	Buyer ///131	Requestor
//upload type 32	P2P PO //33	P2P Invoice //34	P2P GRN // 35 Quotation
app.controller('POController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, pdfDelegate) {

    $(".modal-backdrop").remove();
    $scope.PO_Search = {
        CONTACT_ID: null,
        REQ_NO: '',
        REFERENCE: '',
        STATUS_ID: null,
        BRANCH_ID: null,
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        UploadedFiles: [],
        IS_MULTI_FILE_UPLOAD_ALLOW: true,
        NOTE_FOR_APPROVERS_LIMIT_TO: 500,
    }
    //, { ID: 3, NAME: 'No Tax' }
    $scope.TAX_TYPE = [{ ID: 1, NAME: 'Tax Exclusive' }, { ID: 2, NAME: 'Tax Inclusive' }];
    $scope.STATUS_NAME = [{ ID: 75, NAME: 'Not Received' }, { ID: 76, NAME: 'Partially Received' }, { ID: 77, NAME: 'Fully Received' }];
    // $scope.RECEIVING_TYPE = [{ ID: 1, NAME: 'Quantity' }, { ID: 2, NAME: 'Amount' }]; //RECEIVING_TYPE_ID   1 FOR QTY WISE AND 2 FOR AMOUNT WISE
    $scope.PURCHASE_ORDERS_LIST = []; $scope.GRN_LIST = []; $scope.PO_ITEM_LIST = []; $scope.RECEIVING_LIST = [];
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
        return F + '' + M + '' + L;
    }
    $scope.GET_GRN = function (LINE, FLAG) {
        if ($scope.GRN_LIST.length == 0 || FLAG == 1) {
            ModelObj = new Object();
            ModelObj.PO_HDR_ID = LINE.PO_HDR_ID;
            PrcCommMethods.P2P_API(ModelObj, 'GET_GRN', 'PO').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.GRN_LIST = data.data.Table;
                }
            });
        }
    }

    $scope.GET_PURCHASE_ORDERS_LAZY_LOAG = function () {
        $scope.GET_PURCHASE_ORDERS();
    }
    $scope.GET_PURCHASE_ORDERS = function (FLAG) {
        if (FLAG == 1) {
            $scope.PO_Search.PAGE_NO = 1;
            $scope.PURCHASE_ORDERS_LIST = [];
        }
        ModelObj = new Object();
        ModelObj.SEARCH_PARAMETER = $scope.PO_Search.SEARCH_PARAMETER;
        ModelObj.STATUS_ID = $scope.PO_Search.STATUS_IDS;
        ModelObj.SUPPLIER_ID = $scope.PO_Search.SUPPLIER_ID;
        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        ModelObj.BRANCH_ID = $scope.PO_Search.BRANCH_ID;
        ModelObj.USER_ID = parseInt($cookies.get("USERID"));
        ModelObj.PAGE_NO = $scope.PO_Search.PAGE_NO;
        ModelObj.PAGE_SIZE = $scope.PO_Search.PAGE_SIZE;
        ModelObj.SHOW_CANCELLED_PO = $scope.PO_Search.SHOW_CANCELLED_PO ? 1 : 0;
        PrcCommMethods.P2P_API(ModelObj, 'GET_PURCHASE_ORDERS', 'PO').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.PURCHASE_ORDERS_LIST = $scope.PURCHASE_ORDERS_LIST.concat(data.data.Table);
                if (FLAG == 1) {
                    $scope.PO_CLICK(data.data.Table[0]);
                };
                if (data.data.Table.length < $scope.PO_Search.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.PO_Search.PAGE_NO = parseInt($scope.PO_Search.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else {
                if ($scope.PO_Search.length == 0) { }
                $scope.GetData = false;
            }
        });
    }
    $scope.GET_P2P_BUDGET_BY_ACCOUNTS = function (FLAG, LINE, HEADER, CHANGE_FLAG) {
        if (LINE != undefined) {
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
            //ptopobj.PROJECT_MASTER_ID = CHANGE_FLAG == 1 ? HEADER.PROJECT_MASTER_ID : HEADER.PROJECT_MASTER_ID;// LINE.PROJECT_MASTER_ID;

            ptopobj.REFERENCE_ID = 0;
            ptopobj.REFERENCE_TYPE = 0;

            /// Old code remove current amount 
            //ptopobj.REFERENCE_ID = LINE.PO_HDR_ID;
            //ptopobj.REFERENCE_TYPE = 1;

            ptopobj.SETTING_45 = $scope.$parent.SETTING_USE_GROSS;
            ptopobj.XERO_ACCOUNTS_FOR_BUDGET = [];
            angular.forEach($scope.PO_ITEM_LIST, function (LINE) {
                var readonlyobj = new Object()
                readonlyobj.ACCOUNT_ID = parseInt(LINE.ACCOUNT_ID);
                readonlyobj.ACCOUNT_DETAILS = LINE.ACCOUNT_DETAILS;
                var alreadyAccount = ptopobj.XERO_ACCOUNTS_FOR_BUDGET.filter(function (x) { return x.ACCOUNT_ID == readonlyobj.ACCOUNT_ID });
                if (alreadyAccount.length == 0) {
                    ptopobj.XERO_ACCOUNTS_FOR_BUDGET.push(readonlyobj);
                }
            });

            if (ptopobj.XERO_ACCOUNTS_FOR_BUDGET.length > 0) {
                PrcCommMethods.P2P_API(ptopobj, 'GET_P2P_BUDGET_BY_ACCOUNTS', 'PO').then(function (data) {
                    if (data.data != null) {
                        $scope.PO_Search.BUDGET_NAME = data.data.BUDGET_NAME;
                        $scope.P2P_PO_MASTER_LIST = data.data.Budget_Account_Data_List;
                        $scope.PO_Search.PO_DETAILS.HIDE_SHOW = true;
                    }
                    else {
                        $scope.P2P_PO_MASTER_LIST = [];
                    }
                });
            }
            else {
                $scope.BUDGET_TEXT_VALIDATION = "Please select a valid GL-Account";
            };
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
    $scope.GET_INVOICE_PO_MAPPING = function (PO_HEADER, FLAG) {
        var PaymentModelObj = new Object();
        PaymentModelObj.TYPE = 2;// --1 FOR INVOICE AND 2 FOR PO
        PaymentModelObj.REFERENCE_ID = PO_HEADER.PO_HDR_ID;
        PrcCommMethods.P2P_API(PaymentModelObj, 'GET_INVOICE_PO_MAPPING', 'PO').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.INVOICE_PO_MAPPING = [];
                $scope.INVOICE_PO_MAPPING = data.data.Table;
            }
            else {
                $scope.INVOICE_PO_MAPPING = [];
            }
        });
    };
    $scope.GET_PURCHASE_ORDERS(1);

    $scope.CHANGE_FLAG_FY = function (LINE) {
        LINE.IS_SELECTED = true;
        if (LINE.RECEIVING_TYPE_ID == 1) {
            if (LINE.CUSTOM_UR_OPEN_QTY > LINE.UR_OPEN_QTY) {
                LINE.CUSTOM_UR_OPEN_QTY = 0;
                $scope.$parent.ShowAlert('Error', 'you cannot exceed limit open qty.', 2000)
            }

            if (LINE.CUSTOM_UR_OPEN_QTY == undefined || LINE.CUSTOM_UR_OPEN_QTY == null || LINE.CUSTOM_UR_OPEN_QTY == "" || LINE.CUSTOM_UR_OPEN_QTY == 0) {
                LINE.IS_SELECTED = false;
            }
        }
        else if (LINE.RECEIVING_TYPE_ID == 2) {
            if (LINE.CUSTOM_UR_OPEN_AMOUNT > LINE.UR_OPEN_AMOUNT) {
                LINE.CUSTOM_UR_OPEN_AMOUNT = 0;
                $scope.$parent.ShowAlert('Error', 'you cannot exceed limit open amount.', 2000)
            }
            if (LINE.CUSTOM_UR_OPEN_AMOUNT == undefined || LINE.CUSTOM_UR_OPEN_AMOUNT == null || LINE.CUSTOM_UR_OPEN_AMOUNT == "" || LINE.CUSTOM_UR_OPEN_AMOUNT == 0) {
                LINE.IS_SELECTED = false;
            }
        }
    }
    $scope.PO_CLICK = function (PO_HEADER_DTLS) {
        $scope.MONTH_LIST = [];
        $scope.PO_SPLIT_LIST = [];
        $scope.SELECTED_PO = PO_HEADER_DTLS;
        $scope.GET_PO_BY_ID(PO_HEADER_DTLS);
        $scope.GET_INVOICE_PO_MAPPING(PO_HEADER_DTLS);
        $scope.$parent.GET_SCROLL_TOP();
    }
    $scope.CLOSE_PDF = function () {
        document.getElementById("PO_PDF").style.width = "0%";
        document.getElementById("PO_PDF").style.zIndex = "1500";
    }
    $scope.pdfUrl = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/149125/relativity.pdf';

    $scope.PDF_DOWNLOAD_FY = function (FLAG) {
        ModelObj = new Object();
        // ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        ModelObj.PO_HDR_ID = $scope.PO_Search.PO_DETAILS.PO_HDR_ID;
        ModelObj.FILE_PATH = "/P2PFiles/PO/ENTITY_" + parseInt($cookies.get("ENTITY_ID")) + "/PO_" + $scope.PO_Search.PO_DETAILS.PO_HDR_ID + "/" + $scope.PO_Search.PO_DETAILS.PO_NUMBER + '.pdf';
        if (true || $scope.PO_Search.PO_DETAILS.PDF_GENERATED == undefined || $scope.PO_Search.PO_DETAILS.PDF_GENERATED == null || $scope.PO_Search.PO_DETAILS.PDF_GENERATED == "") {
            PrcCommMethods.P2P_API(ModelObj, 'UPD_PO_PDF_GENERATION_STATUS', 'PO').then(function (data) {
                //P2PFiles /\PO\35\114\PO - 00022.pdf
                $scope.loadNewFile(ModelObj.FILE_PATH, FLAG);
                if (FLAG == 2) {
                    window.open(ModelObj.FILE_PATH, '_blank');
                }
            });
        }
        else {
            if (FLAG == 2) {
                window.open(ModelObj.FILE_PATH, '_blank');
            }
        };
    }

    $scope.AUDIT_PDF_DOWNLOAD_FY = function (FLAG) {
        ModelObj = new Object();
        // ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        ModelObj.PO_HDR_ID = $scope.PO_Search.PO_DETAILS.PO_HDR_ID;
        ModelObj.FILE_PATH = "/P2PFiles/AUDIT_REPORT/ENTITY_" + parseInt($cookies.get("ENTITY_ID")) + "/PO_" + $scope.PO_Search.PO_DETAILS.PO_HDR_ID + "/" + $scope.PO_Search.PO_DETAILS.PO_NUMBER + '.pdf';
        if (true || $scope.PO_Search.PO_DETAILS.PDF_GENERATED == undefined || $scope.PO_Search.PO_DETAILS.PDF_GENERATED == null || $scope.PO_Search.PO_DETAILS.PDF_GENERATED == "") {
            PrcCommMethods.P2P_API(ModelObj, 'GENERATION_AUDIT_PO_PDF', 'PO').then(function (data) {
                //P2PFiles /\PO\35\114\PO - 00022.pdf
                $scope.loadNewFile(ModelObj.FILE_PATH, FLAG);
                if (FLAG == 2) {
                    window.open(ModelObj.FILE_PATH, '_blank');
                }
            });
        }
        else {
            if (FLAG == 2) {
                window.open(ModelObj.FILE_PATH, '_blank');
            }
        };
    }

    $scope.loadNewFile = function (url, FLAG) {
        pdfDelegate.$getByHandle('my-pdf-container').load(url);
        if (FLAG == 1) {
            document.getElementById("PO_PDF").style.zIndex = "1500";
            document.getElementById("PO_PDF").style.width = "35%";
        }
    };
    $scope.DESCRIPTION_LIMIT_TO = 500;
    $scope.InitiateFilteList = function (LINE) {
        LINE.UploadedFiles = [];
        $scope.$parent.GET_UPLOADS(LINE, 34, LINE.TABLE_ID);
    }
    $scope.InitiateReceivingList = function (LINE) {
        LINE.UploadedFiles = [];
        if (LINE.RECEIVING_TYPE_ID == 1) {
            LINE.CUSTOM_OPEN_QTY = angular.copy(LINE.OPEN_QTY);
        }
        else if (LINE.RECEIVING_TYPE_ID == 2) {
            LINE.CUSTOM_OPEN_AMOUNT = angular.copy(LINE.OPEN_AMOUNT);
        }
        if (LINE.RECEIVING_DATE == null) {
            LINE.RECEIVING_DATE = $filter('date')(new Date());
        }
        $scope.$parent.GET_UPLOADS(LINE, 34, LINE.PO_LINE_ID);
    }
    $scope.InitiateUNReceivingList = function (LINE) {
        //UNRECEIVED_AMOUNT: null
        //UNRECEIVED_QTY:null
        LINE.UploadedFiles = [];
        //UR_OPEN_AMOUNT:0
        //UR_OPEN_QTY:10

        if (LINE.RECEIVING_TYPE_ID == 1) {
            //  LINE.CUSTOM_UR_OPEN_QTY = angular.copy(LINE.UR_OPEN_QTY);
        }
        else if (LINE.RECEIVING_TYPE_ID == 2) {
            //   LINE.CUSTOM_UR_OPEN_AMOUNT = angular.copy(LINE.UR_OPEN_AMOUNT);
        }
        if (LINE.RECEIVING_DATE == null) {
            //   LINE.RECEIVING_DATE = $filter('date')(new Date());
        }
        // LINE.RECEIPT_NO = 'UNRES=' + LINE.PO_LINE_ID ;
        // LINE.COMMENTS = 'UN_COMMENTS:' + LINE.PO_LINE_ID;
        $scope.$parent.GET_UPLOADS(LINE, 34, LINE.RECEIPT_ID);
    }

    $scope.InitiateHistoryReceivingList = function (LINE) {
        LINE.UploadedFiles = [];
        $scope.$parent.GET_UPLOADS(LINE, 34, LINE.RECEIPT_ID);
    }
    $scope.InitiatePOItemList = function (LINE) {
        LINE.DESCRIPTION_LIMIT_TO = $scope.DESCRIPTION_LIMIT_TO;
        LINE.DESCRIPTION_LIMIT_TO = angular.copy($scope.DESCRIPTION_LIMIT_TO);
        LINE.SELECTED_OPTION_LIST_MASTER = angular.copy($scope.SELECTED_OPTION_LIST_MASTER);
        LINE.ACCOUNT_NAME = LINE.ACCOUNT_DETAILS;
    }
    $scope.InitiateXeroTrackingPOCategories = function (item, Trackingcat_index, PRL, FLAG) {
        if (item.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID > 0 && $scope.SELECTED_OPTION_LIST.length > 0) {
            var select_cat = $scope.SELECTED_OPTION_LIST.filter(p => p.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID == item.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID && p.APPROVAL_CHAIN_CUSTOM_FIELD_OPTIONS_MASTER_ID && PRL.APPROVAL_CHAIN_CUSTOM_FIELD_OPTIONS_MASTER_ID && PRL.PO_LINE_ID == p.PO_LINE_ID)[0];
            if (select_cat != undefined && select_cat != null) {
                var text = $scope.SELECTED_OPTION_LIST_MASTER.filter(function (x) { return x.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID == select_cat.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID && x.APPROVAL_CHAIN_CUSTOM_FIELD_OPTIONS_MASTER_ID == select_cat.APPROVAL_CHAIN_CUSTOM_FIELD_OPTIONS_MASTER_ID });
                item.SELECTED_CATEGORY_OPTION = text[0];
            }
        }
    }
    $scope.Inittotalreq = function (parm_line, parm_m, index) {
        parm_line.TOTAL_BUDGET = 0;
        $scope.ACCOUNT_ITEMDETAIL = [];
        var itemdetail = [];
        var linedetail = [];
        angular.forEach($scope.MONTH_LIST, function (_m, index) {
            linedetail = linedetail.concat(_m.ITEM_LIST.filter(function (x) { return x.LINE_NO == parm_line.LINE_NO }));
            itemdetail = itemdetail.concat(_m.ITEM_LIST);
        });
        $scope.MONTH_LIST[$scope.MONTH_LIST.length - 1].ITEM_LIST[parm_line.ITEM_INDEX].TOTAL_BUDGET = angular.copy($filter('sumOfValue')(linedetail, 'BUDGET'));
        $scope.REM_AMOUNT_LEFT = parseFloat($scope.MONTH_LIST[$scope.MONTH_LIST.length - 1].ITEM_LIST[parm_line.ITEM_INDEX].TOTAL_BUDGET).toFixed(2);
        $scope.ACCOUNT_ITEMDETAIL = itemdetail.filter(function (_m) { return new Date($scope.PO_Search.PO_DETAILS.PO_DATE).getMonth() == new Date(_m.START_DATE).getMonth() && new Date($scope.PO_Search.PO_DETAILS.PO_DATE).getFullYear() == new Date(_m.START_DATE).getFullYear() })
    }
    $scope.SHOW_HIDE_BUDGET = function (REQ_Search) {
        REQ_Search.HIDE_SHOW = !REQ_Search.HIDE_SHOW;
    }
    $scope.PO_TERMS_AND_CONDITIONS_MASTER_LIST = [];
    $scope.GET_PO_BY_ID = function (LINE) {
        ModelObj = new Object();
        ModelObj.PO_HDR_ID = LINE.PO_HDR_ID;
        PrcCommMethods.P2P_API(ModelObj, 'GET_PO_BY_ID', 'PO').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.PO_Search.PO_DETAILS = data.data.Table[0];
                $scope.PO_Search.PO_DETAILS.PO_HDR_ID = LINE.PO_HDR_ID;
                $scope.PO_Search.PO_DETAILS.PAGING = LINE.PAGING;
                $scope.PO_Search.PO_DETAILS.SHORT_NAME = $scope.TextReturn(data.data.Table[0].REQUESTOR_NAME);
                $scope.PO_ITEM_LIST = data.data.Table1;
                $scope.SELECTED_OPTION_LIST_MASTER = angular.copy($filter('unique')(data.data.Table2, 'APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID'));
                $scope.SELECTED_OPTION_LIST = data.data.Table2;

                $scope.PO_Search.SPLIT_TYPE = data.data.Table[0].SPLIT_TYPE == 0 ? null : data.data.Table[0].SPLIT_TYPE;
                $scope.PO_Search.COPY_SPLIT_TYPE = angular.copy($scope.PO_Search.SPLIT_TYPE);

                if (data.data.Table5.length > 0) {
                    $scope.PO_SPLIT_LIST = data.data.Table5;
                }

                $scope.PO_TERMS_AND_CONDITIONS_MASTER_LIST = data.data.Table3;
                $scope.$parent.GET_UPLOADS($scope.PO_Search.PO_DETAILS, 32, $scope.PO_Search.PO_DETAILS.PO_HDR_ID);
                var TAX_TYPEList = $scope.TAX_TYPE.filter(function (x) { return x.ID == data.data.Table[0].TAX_TYPE });
                if (TAX_TYPEList.length > 0) { data.data.Table[0].TAX_NAME = TAX_TYPEList[0].NAME; }
                $scope.SELECTED_PO.GRN_STATUS_ID = $scope.PO_Search.PO_DETAILS.GRN_STATUS_ID;
            };
        });
    }

    $scope.PO_LINES_FOR_RECEIVING = [];
    $scope.PO_LINES_FOR_UNRECEIVING = [];

    $scope.GET_PO_LINES_FOR_RECEIVING = function (LINE) {
        ModelObj = new Object();
        ModelObj.PO_HDR_ID = $scope.PO_Search.PO_DETAILS.PO_HDR_ID
        ModelObj.PO_LINE_ID = LINE == undefined || LINE.PO_LINE_ID == undefined ? 0 : LINE.PO_LINE_ID;
        PrcCommMethods.P2P_API(ModelObj, 'GET_PO_LINES_FOR_RECEIVING', 'PO').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.PO_LINES_FOR_RECEIVING = data.data.Table;
            } else {
                $scope.PO_LINES_FOR_RECEIVING = [];
            };
        });
    };
    $scope.GET_PO_LINES_FOR_UNRECEIVING = function (LINE) {
        ModelObj = new Object();
        ModelObj.PO_HDR_ID = $scope.PO_Search.PO_DETAILS.PO_HDR_ID
        ModelObj.PO_LINE_ID = LINE == undefined || LINE.PO_LINE_ID == undefined ? 0 : LINE.PO_LINE_ID;
        PrcCommMethods.P2P_API(ModelObj, 'GET_PO_LINES_FOR_UNRECEIVING', 'PO').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.PO_LINES_FOR_UNRECEIVING = data.data.Table;
            } else {
                $scope.PO_LINES_FOR_UNRECEIVING = [];
            };
        });
    };

    $scope.GET_RECEIVING = function (LINE) {
        ModelObj = new Object();
        ModelObj.PO_HDR_ID = $scope.PO_Search.PO_DETAILS.PO_HDR_ID
        ModelObj.PO_LINE_ID = LINE == undefined || LINE.PO_LINE_ID == undefined ? 0 : LINE.PO_LINE_ID;
        PrcCommMethods.P2P_API(ModelObj, 'GET_RECEIVING', 'PO').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.RECEIVING_LIST = data.data.Table;
            } else {
                $scope.RECEIVING_LIST = [];
            };
        });
    }

    $scope.Fn_RETURN_CURRENT_AMT = function (BD, _pram_po_dtls) {
        BD.CURRENT_AMOUNT = 0;
        var itemdetail = [];
        angular.forEach($scope.MONTH_LIST, function (_m) {
            angular.forEach(_m.ITEM_LIST, function (_val_item) {
                if (_val_item.ACCOUNT_ID == BD.ACCOUNT_ID && new Date(_pram_po_dtls.PO_DATE).getMonth() == new Date(_m.START_DATE).getMonth() && new Date(_pram_po_dtls.PO_DATE).getFullYear() == new Date(_m.START_DATE).getFullYear()) {
                    if (_val_item.BUDGET != undefined && _val_item.BUDGET != "" && _val_item.BUDGET != null) {
                        BD.CURRENT_AMOUNT = parseFloat(BD.CURRENT_AMOUNT) + parseFloat(_val_item.BUDGET);
                    }
                }
                if (_m.FLAG == 1) {
                    itemdetail.push(_val_item);
                }
            });
        });
        //  $scope.REM_AMOUNT_LEFT = angular.copy($filter('sumOfModValue')(itemdetail, 'REMAINING_AMOUNT'));
    }
    $scope.Fn_SPLIT_REQ = function (LINE, FLAG) {
        $scope.CONDITIONAL_ITEM_LIST = [];
        $scope.CONDITIONAL_ITEM_LIST = $scope.TAB_FLAG == 1 ? angular.copy($scope.PO_ITEM_LIST) : $scope.TAB_FLAG == 2 ? angular.copy($scope.PO_ITEM_LIST) : angular.copy($scope.PO_ITEM_LIST);
        if (LINE.SPLIT_TYPE > 0) {
            var Newdate = new Date('01/01/2010');
            var SELECT_YEAR = angular.copy(new Date(LINE.PO_DATE)).getFullYear();
            var DATE = new Date(new Date(Newdate).setFullYear(SELECT_YEAR));
            var MouthStart = new Date(LINE.PO_DATE).getMonth();
            var MonthEnd = MouthStart + LINE.SPLIT_TYPE;
            LINE.START_DATE = new Date(DATE);
            LINE.END_DATE = new Date(new Date(new Date(DATE).setMonth(11)).setDate(31));
            $scope.MONTH_LIST = [];
            for (var i = MouthStart; i <= MonthEnd; i++) {
                var ReadOnly = new Object();
                ReadOnly.MONTH = i;
                ReadOnly.START_DATE = MouthStart == i ? new Date(LINE.PO_DATE) : new Date(DATE).setMonth(i);
                ReadOnly.ITEM_LIST = angular.copy($scope.CONDITIONAL_ITEM_LIST);
                angular.forEach(ReadOnly.ITEM_LIST, function (_val_item, index) {
                    _val_item.ITEM_INDEX = index;
                    var _split_result = $scope.PO_SPLIT_LIST.filter(function (_val_split) { return _val_split.PO_LINE_ID == _val_item.PO_LINE_ID && new Date(ReadOnly.START_DATE).getMonth() == new Date(_val_split.PO_DATE).getMonth() && new Date(ReadOnly.START_DATE).getFullYear() == new Date(_val_split.PO_DATE).getFullYear() });
                    if (_split_result.length > 0) {
                        _val_item.BUDGET = $scope.SETTING_USE_GROSS == 1 ? parseFloat(_split_result[0].GROSS_AMOUNT).toFixed(2) : parseFloat(_split_result[0].NET_AMOUNT).toFixed(2);
                        _val_item.REQ_SPLIT_LIST = _split_result[0];
                        _val_item.SPLIT_TABLE_ID = _split_result[0].TABLE_ID;
                        _val_item.PO_SPLIT_ACCOUNT_ID = _split_result[0].ACCOUNT_ID;
                    }
                    else {
                        taxAmount = LINE.TAX_TYPE == 3 ? 0.00 : (LINE.TAX_TYPE == 2 ? ((((_val_item.UNIT_PRICE * _val_item.QUANTITY) / (1 + (_val_item.TAX_ID == undefined ? 0 : _val_item.TAX_ID.RATE / 100))) - (((_val_item.UNIT_PRICE * _val_item.QUANTITY) / (1 + (_val_item.TAX_ID == undefined ? 0 : _val_item.TAX_ID.RATE / 100))) * (_val_item.DISCOUNT_PERCENT / 100))) * (_val_item.TAX_ID == undefined ? 0 : _val_item.TAX_ID.RATE / 100)) : (((_val_item.UNIT_PRICE * _val_item.QUANTITY) - ((_val_item.UNIT_PRICE * _val_item.QUANTITY) * (_val_item.DISCOUNT_PERCENT / 100))) * (_val_item.TAX_ID == undefined ? 0 : _val_item.TAX_ID.RATE / 100)));
                        amount = ((_val_item.QUANTITY * 1 * _val_item.UNIT_PRICE * 1) - (_val_item.QUANTITY * 1 * _val_item.UNIT_PRICE * 1 * (_val_item.DISCOUNT_PERCENT) / 100))
                        if ($scope.PO_SPLIT_LIST.length > 0) {
                            // var _count_po_line_id = ($scope.ITEM_LIST.filter(function (x) { return x.PO_LINE_ID > 0 })).length;
                            _val_item.BUDGET = _val_item.PO_LINE_ID > 0 ? 0 : parseFloat(LINE.TAX_TYPE == 2 ? parseFloat((amount - taxAmount) / (LINE.SPLIT_TYPE + 1)).toFixed(2) : parseFloat(amount / (LINE.SPLIT_TYPE + 1))).toFixed(2);
                            _val_item.PO_SPLIT_ACCOUNT_ID = _val_item.ACCOUNT_ID;
                        }
                        else {
                            _val_item.BUDGET = parseFloat(LINE.TAX_TYPE == 2 ? parseFloat((amount - taxAmount) / (LINE.SPLIT_TYPE + 1)).toFixed(2) : parseFloat(amount / (LINE.SPLIT_TYPE + 1))).toFixed(2);
                            _val_item.PO_SPLIT_ACCOUNT_ID = _val_item.ACCOUNT_ID;
                        }
                    }
                });
                $scope.MONTH_LIST.push(ReadOnly);
            }
        }
    }


    $scope.TAB_REC_FLAG = 1;
    $scope.TAB_CLICK_RECEIVING_FY = function (FLAG) {
        $scope.TAB_REC_FLAG = FLAG;
        if (FLAG == 2) {
            $scope.GET_PO_LINES_FOR_UNRECEIVING();
            $scope.GRN_FORM.submitted = false;
        }
        if (FLAG == 3) {
            $scope.GET_RECEIVING();
        }
    };
    $scope.GRN_POP = function () {
        //   $('#GRN').modal('show');
        $scope.TAB_REC_FLAG = 1;
        $scope.PO_LINES_FOR_UNRECEIVING = [];
        $('#RECEIVING').modal('show');
        $scope.GET_PO_LINES_FOR_RECEIVING();
        $scope.$parent.DateInputLoad("GRN");
        $scope.GRN_FORM.submitted = false;
        $scope.UNRECEIVING_FORM.submitted = false;
    }



    $scope.HIDE_SHOW = false;
    $scope.SHOW_HIDE_GRN = function () {
        $scope.HIDE_SHOW = !$scope.HIDE_SHOW;
        $scope.GET_GRN($scope.PO_Search.PO_DETAILS);
    }

    $scope.RESET_GRN = function (index) {
        $scope.PO_Search.STATUS_ID = null;
        $scope.PO_Search.COMMENTS = null;
        $scope.PO_Search.COMMENTS = null;
        $scope.PO_Search.UploadedFiles = [];
        $scope.GRN_FORM.submitted = false;

        angular.forEach($scope.PO_LINES_FOR_RECEIVING, function (x) {
            x.RECEIPT_NO = "";
            x.COMMENTS = "";
            x.RECEIVING_DATE = $filter('date')(new Date());
            if (x.RECEIVING_TYPE_ID == 1) {
                x.CUSTOM_OPEN_QTY = angular.copy(x.OPEN_QTY);
            }
            else if (x.RECEIVING_TYPE_ID == 2) {
                x.CUSTOM_OPEN_AMOUNT = angular.copy(x.OPEN_AMOUNT);
            }
        });
        $scope.UNRECEIVING_FORM.submitted = false;
    }
    $scope.REMOVE_FILTE_GRN = function (LINE, index) {
        LINE.UploadedFiles.splice(index, 1)
    }
    $scope.REMOVE_FILTE_REC = function (HEADER, LINE, index) {
        $scope.$parent.DELETE_UPLOAD_ALL(HEADER, LINE, index, 2);
    }
    $scope.POP_DISCARD_PO_FY = function () {
        $('#POP_DISCARD_PO').modal('show');
        $scope.PO_Search.PO_DETAILS.DISCARD_PO_COMMENTS = "";
        $scope.DISCARD_PO_FORM.submitted = false;
    }
    $scope.DISCARD_PO = function () {
        $scope.DISCARD_PO_FORM.submitted = true;
        if ($scope.DISCARD_PO_FORM.$valid) {
            if (confirm('Are you sure you want to delete?')) {
                var ptopobj = new Object();
                ptopobj.PO_HDR_ID = $scope.PO_Search.PO_DETAILS.PO_HDR_ID;
                ptopobj.USER_ID = parseInt($cookies.get("USERID"));
                ptopobj.COMMENTS = $scope.PO_Search.PO_DETAILS.DISCARD_PO_COMMENTS;
                PrcCommMethods.P2P_API(ptopobj, 'DISCARD_PO', 'PO').then(function (data) {
                    if (data.data == 1) {
                        $scope.$parent.ShowAlert("Success", "Deleted Successfully ", 3000);
                        $scope.GET_PURCHASE_ORDERS(1);
                        $scope.PO_Search.PO_DETAILS.DISCARD_PO_COMMENTS = "";
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

    $scope.READ_MORE_FY = function (PRL, FLAG, LABEL) {
        var LIMIT_TO = 500;
        if (LABEL == undefined) {
            if (FLAG == 1) {
                PRL.DESCRIPTION_LIMIT_TO = PRL.DESCRIPTION.length;
            }
            else if (FLAG == 2) {
                PRL.DESCRIPTION_LIMIT_TO = LIMIT_TO;
            }
        }
        if (LABEL == "NOT_FOR_APPROVER") {
            if (FLAG == 1) {
                $scope.REQ_PROC_Search.NOTE_FOR_APPROVERS_LIMIT_TO = PRL.NOTE_FOR_APPROVERS.length;
            }
            else if (FLAG == 2) {
                $scope.REQ_PROC_Search.NOTE_FOR_APPROVERS_LIMIT_TO = LIMIT_TO;
            }
        }
    }
    $scope.READ_MORE_ACTION_FY = function (PRL, FLAG, LABEL, ACTION) {
        var LIMIT_TO = 500;
        if (LABEL == "NOT_FOR_APPROVER" && ACTION == "ACTION") {
            if (FLAG == 1) {
                $scope.PO_Search.NOTE_FOR_APPROVERS_LIMIT_TO = PRL.NOTE_FOR_APPROVERS.length;
            }
            else if (FLAG == 2) {
                $scope.PO_Search.NOTE_FOR_APPROVERS_LIMIT_TO = LIMIT_TO;
            }
        }
    }

    $scope.SIDE_FILTER = function () {
        document.getElementById("PO_PDF").style.zIndex = "1500";
        document.getElementById("PO_PDF").style.width = "20%";
    };

    $scope.INS_RECEIVING = function () {
        $scope.RECEIVING_FORM.submitted = true;
        if ($scope.RECEIVING_FORM.$valid) {
            if (confirm('Are you sure you want to update status?')) {
                ModelObj = new Object();
                ModelObj.PO_HDR_ID = $scope.PO_Search.PO_DETAILS.PO_HDR_ID;
                ModelObj.USER_ID = parseInt($cookies.get("USERID"));
                ModelObj.PO_RECEIPTS = [];
                angular.forEach($scope.PO_LINES_FOR_RECEIVING, function (PO_VAL) {
                    var readonly = new Object();
                    readonly.PO_LINE_ID = PO_VAL.PO_LINE_ID;
                    readonly.RECEIVED_QTY = null;
                    readonly.RECEIVED_AMOUNT = null;
                    if (PO_VAL.RECEIVING_TYPE_ID == 1) {
                        readonly.RECEIVED_QTY = parseFloat(PO_VAL.CUSTOM_OPEN_QTY).toFixed(5);
                    }
                    else if (PO_VAL.RECEIVING_TYPE_ID == 2) {
                        readonly.RECEIVED_AMOUNT = parseFloat(PO_VAL.CUSTOM_OPEN_AMOUNT).toFixed(5);
                    }
                    readonly.RECEIVING_DATE = PO_VAL.RECEIVING_DATE;
                    readonly.RECEIPT_NO = PO_VAL.RECEIPT_NO == undefined ? null : PO_VAL.RECEIPT_NO;
                    readonly.PARENT_ID = PO_VAL.RECEIPT_ID == undefined ? null : PO_VAL.RECEIPT_ID;
                    readonly.UPLOAD_IDS = "";
                    if (PO_VAL.UploadedFiles != undefined) {
                        angular.forEach(PO_VAL.UploadedFiles, function (x) {
                            if (readonly.UPLOAD_IDS == "") {
                                readonly.UPLOAD_IDS = x.ID;
                            }
                            else {
                                readonly.UPLOAD_IDS = readonly.UPLOAD_IDS + "," + x.ID;
                            }
                        });
                    };
                    //readonly.UPLOAD_IDS = PO_VAL.UPLOAD_IDS;
                    readonly.COMMENTS = PO_VAL.COMMENTS == undefined ? "" : PO_VAL.COMMENTS;
                    ModelObj.PO_RECEIPTS.push(readonly);
                });
                PrcCommMethods.P2P_API(ModelObj, 'INS_RECEIVING', 'PO').then(function (data) {
                    if (data.data == 1) {
                        $scope.$parent.ShowAlert('Succces', 'Status updated successfully', 3000);
                        $('#RECEIVING').modal('hide');
                        $scope.GET_PO_BY_ID($scope.PO_Search.PO_DETAILS);
                        //$scope.GET_PURCHASE_ORDERS();
                        //$scope.GET_GRN($scope.PO_Search.PO_DETAILS, 1);
                        $scope.RECEIVING_FORM.submitted = false;
                    }
                    if (data.data == 0) {
                        $scope.$parent.ShowAlert('Error', $scope.SOMETHINGWENTWRONG, 3000);
                    }
                });
            }
        }
    }
    $scope.UNINS_RECEIVING = function () {
        // $scope.UNRECEIVING_FORM.submitted = true;
        //$scope.UNRECEIVING_FORM.$valid
        var LENGTH_VALID = $scope.PO_LINES_FOR_UNRECEIVING.filter(function (x) { return x.IS_SELECTED });
        if (LENGTH_VALID.length > 0) {
            if (confirm('Are you sure you want to update status?')) {
                ModelObj = new Object();
                ModelObj.PO_HDR_ID = $scope.PO_Search.PO_DETAILS.PO_HDR_ID;
                ModelObj.USER_ID = parseInt($cookies.get("USERID"));
                ModelObj.PO_RECEIPTS = [];
                angular.forEach($scope.PO_LINES_FOR_UNRECEIVING, function (PO_VAL) {
                    if (PO_VAL.IS_SELECTED) {
                        var readonly = new Object();
                        readonly.PO_LINE_ID = PO_VAL.PO_LINE_ID;
                        readonly.RECEIVED_QTY = null;
                        readonly.RECEIVED_AMOUNT = null;
                        if (PO_VAL.RECEIVING_TYPE_ID == 1) {
                            readonly.RECEIVED_QTY = parseFloat(PO_VAL.CUSTOM_UR_OPEN_QTY * -1).toFixed(5);
                        }
                        else if (PO_VAL.RECEIVING_TYPE_ID == 2) {
                            readonly.RECEIVED_AMOUNT = parseFloat(PO_VAL.CUSTOM_UR_OPEN_AMOUNT * -1).toFixed(5);
                        }
                        readonly.RECEIVING_DATE = PO_VAL.RECEIVING_DATE;
                        readonly.RECEIPT_NO = PO_VAL.RECEIPT_NO;
                        readonly.PARENT_ID = PO_VAL.RECEIPT_ID == undefined ? null : PO_VAL.RECEIPT_ID;
                        readonly.UPLOAD_IDS = "";
                        if (PO_VAL.UploadedFiles != undefined) {
                            angular.forEach(PO_VAL.UploadedFiles, function (x) {
                                if (readonly.UPLOAD_IDS == "") {
                                    readonly.UPLOAD_IDS = x.ID;
                                }
                                else {
                                    readonly.UPLOAD_IDS = readonly.UPLOAD_IDS + "," + x.ID;
                                }
                            });
                        }
                        readonly.COMMENTS = PO_VAL.COMMENTS;
                        ModelObj.PO_RECEIPTS.push(readonly);
                    }
                });
                PrcCommMethods.P2P_API(ModelObj, 'INS_RECEIVING', 'PO').then(function (data) {
                    if (data.data == 1) {
                        $scope.$parent.ShowAlert('Succces', 'Status updated successfully', 3000);
                        $('#RECEIVING').modal('hide');
                        //$scope.GET_PURCHASE_ORDERS();
                        //$scope.GET_GRN($scope.PO_Search.PO_DETAILS, 1);
                        $scope.GET_PO_BY_ID($scope.PO_Search.PO_DETAILS);
                        $scope.RECEIVING_FORM.submitted = false;
                    }
                    if (data.data == 0) {
                        $scope.$parent.ShowAlert('Error', $scope.SOMETHINGWENTWRONG, 3000);
                    }
                });
            }
        }
        else {
            $scope.$parent.ShowAlert('Error', "Please change information before update", 3000);
        }
    }
    $scope.INS_GRN = function (FLAG) {
        if ($scope.TAB_REC_FLAG == 1) {
            $scope.INS_RECEIVING();
        }
        else if ($scope.TAB_REC_FLAG == 2) {
            $scope.UNINS_RECEIVING();
        }

    }
    $scope.$on('ngRepeatFinishedRender', function (ngRepeatFinishedEvent) {
        $scope.GET_P2P_BUDGET_BY_ACCOUNTS(1, $scope.PO_Search.PO_DETAILS, $scope.PO_Search.PO_DETAILS)
        $scope.COMMON_CODE_CHANGE();
        if ($scope.PO_Search.PO_DETAILS.SPLIT_TYPE != null && $scope.PO_Search.PO_DETAILS.SPLIT_TYPE != "" && $scope.PO_Search.PO_DETAILS.SPLIT_TYPE != undefined) {
            $scope.Fn_SPLIT_REQ($scope.PO_Search.PO_DETAILS, 1);
        };
    });
    $scope.$parent.child_scope = $scope;
});
app.controller('ContactListController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.ContactFilter = {

    }
    $scope.GET_PYMNT_SUPPLIER = function (FLAG) {
        var PaymentModelObj = new Object();
        if (FLAG == 1) {
            $scope.VENDOR_LIST = [];
            $scope.ContactFilter.PAGE_NO = 1;
        }
        PaymentModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PaymentModelObj.BRANCH_LOGIN_ID = 0;
        PaymentModelObj.PAGE_NO = 0;
        PaymentModelObj.PAGE_SIZE = 0;
        PaymentModelObj.SUPPLIER_NAME = null;
        PaymentModelObj.FLAG = 0;
        PrcCommMethods.PAYMENT_API(PaymentModelObj, 'GET_PYMNT_SUPPLIER').then(function (data) {
            if (data.data != undefined && data.data.Table.length > 0) {
                $scope.SUPPLIER_LIST = data.data.Table
            }
            else {
            }
            $scope.$parent.overlay_loadingNew = 'none';
        })
    }
    $scope.GET_PYMNT_SUPPLIER(1);
    $scope.RESETPAGESEARCH = function () {

        $scope.ContactFilter.SUPPLIER_NAME = "";
        $scope.ContactFilter.EMAIL = "";
        $scope.ContactFilter.TAX_NO = "";

    }
    $scope.IntegrationDetails = new Object();
    $scope.IntegrationDetails.PageLoad = true;
    var promise;
    $scope.countx = 0;
    $scope.StartResyncInterval = function () {
        promise = $interval(IntervalExecution, 60000);
    };
    // stops the interval
    $scope.StopResyncInterval = function () { $interval.cancel(promise); };
    function IntervalExecution() { $scope.GetIntegrationDetails(2); }

    $scope.GetIntegrationDetails = function (isstart) {
        var PaymentModelObj = new Object();
        PaymentModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        PaymentModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PaymentModelObj.BRANCH_ID = 0;
        PaymentModelObj.INTEGRATION_SYSTEM_ID = 16;
        PrcCommMethods.PAYMENT_API(PaymentModelObj, 'GET_INTEGRATION_DETAILS_BY_CUST_ENT_BRNH').then(function (data) {
            $scope.IntegrationDetails = data.data.filter(function (x) { return x.IS_OUTBOUND == false })[0];
            if ($scope.IntegrationDetails.INTEGRATION_STATUS == 2) {
                $scope.IntegrationDetails.ShowSyncBtn = true;
                $scope.IntegrationDetails.PageLoad = false;
                $scope.StopResyncInterval();
                if (isstart == 2) {
                    $scope.GET_PYMNT_SUPPLIER(1);
                }
            }
            else {
                $scope.IntegrationDetails.PageLoad = false;
                $scope.IntegrationDetails.ShowSyncBtn = false;
            }
        });
    }
    $scope.GetIntegrationDetails(1);
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
})