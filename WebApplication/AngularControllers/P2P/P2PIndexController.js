app.controller('P2PIndexController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $interval, $localStorage) {
    $scope.InitiateProcessInvoice = function (INVOICE_LINE, HEADER) {
        INVOICE_LINE.MATCHES = [];
        var PROC_INVOICE_TO_PO_LINE_LIST = HEADER.PROCE_INVOICE_PO_MAPPING.filter(function (x) { return x.INVOICE_LINE_ID == INVOICE_LINE.INVOICE_LINE_ID })
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
                INVOICE_LINE.MATCHES.push(LINE);
            });
        }
    }
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
    if (JSON.parse($localStorage.ENTITY_SETTINGS).length > 0) {
        $scope.SETTING_USE_GROSS = JSON.parse($localStorage.ENTITY_SETTINGS).filter(x => x.SETTING_ID == 45)[0]["SETTING_VALUE"];
    }
    else {
        $scope.SETTING_USE_GROSS = $scope.$parent.GET_ENTITY_SETTINGS(45)[0].SETTING_VALUE;
    }
   
    $scope.GET_P2P_BUDGET_SNAPSHOT = function (REFERENCE_ID, REFERENCE_TYPE) {
        ModelObj = new Object();
        ModelObj.REFERENCE_ID = REFERENCE_ID;
        ModelObj.REFERENCE_TYPE = REFERENCE_TYPE;
        PrcCommMethods.P2P_API(ModelObj, 'GET_P2P_OVERALL_BUDGET', 'PO').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.P2P_SNAP_SHOT_MASTER_LIST = data.data.Table;
            }
        });

    }
    $scope.GET_P2P_OVERALL_BUDGET = function (LINE, MONTH, SELECTED_PROJECT_ID) {
        ModelObj = new Object();
        ModelObjcopy = new Object();
        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        ModelObj.BRANCH_ID = $scope.SELECTED_BUDGET_LINE.BRANCH_ID;
        ModelObj.PROJECT_MASTER_ID = $scope.SELECTED_BUDGET_LINE.PROJECT_MASTER_ID == undefined ? 0 : $scope.SELECTED_BUDGET_LINE.PROJECT_MASTER_ID;
        ModelObj.ACCOUNT_ID = $scope.SELECTED_BUDGET_LINE.ACCOUNT_ID;
        ModelObj.YEAR = $scope.SELECTED_BUDGET_LINE.YEAR;
        ModelObj.MONTH = MONTH;
        ModelObj.SELECTED_PROJECT_ID = SELECTED_PROJECT_ID == undefined || SELECTED_PROJECT_ID == "" || SELECTED_PROJECT_ID == null ? 0 : SELECTED_PROJECT_ID;
        ModelObj.REFERENCE_ID = $scope.SELECTED_BUDGET_LINE.REFERENCE_ID;
        ModelObj.REFERENCE_TYPE = $scope.SELECTED_BUDGET_LINE.REFERENCE_TYPE;
        ModelObj.PO_DATE = new Date($scope.SELECTED_BUDGET_LINE.BUDGET_DATE).toDateString();
        ModelObj.SETTING_45 = $scope.SETTING_USE_GROSS;
        PrcCommMethods.P2P_API(ModelObj, 'GET_P2P_OVERALL_BUDGET_GET_P2P_BUDGET_BIFURCATION_BY_ACCOUNTS', 'PO').then(function (data) {
            $scope.BUDGET_BIFURCATION_BY_ACCOUNTS_LIST = [];
            $scope.BUDGET_BIFURCATION_BY_ACCOUNTS_MONTH_LIST = [];

            $scope.ALLOCATED_BUDGET = data.data.ALLOCATED_BUDGET;



            $scope.PR_PENDING = data.data.PR_PENDING;
            $scope.PR_APPROVED = data.data.PR_APPROVED;

            $scope.APPROVED = data.data.APPROVED;
            $scope.ON_APPROVAL = data.data.ON_APPROVAL;

            $scope.INVOICE_APPROVED = data.data.INVOICE_APPROVED;
            $scope.INVOICE_IN_APPROVAL = data.data.INVOICE_IN_APPROVAL;
            $scope.MEMO_DATA = data.data.MEMO_DATA;



            if ($scope.POP_LOAD == 1) {
                $scope.BUDGET_LIST = data.data.MONTH_LIST;
            }
            if (data.data.MONTH != undefined && data.data.MONTH.length > 0) {
                $scope.BUDGET_BIFURCATION_BY_ACCOUNTS_MONTH_LIST = data.data.MONTH; // MONTH
                //Full Period second cursor not in dataset first cursor is YTD
            };

            //Project in case second cursor not there
            if (data.data.YTD != undefined && data.data.YTD.length > 0) {
                $scope.BUDGET_BIFURCATION_BY_ACCOUNTS_LIST = data.data.YTD; // YTD
            };
            if ($scope.WHERE_CLICK == "REQ_ACTION") {
                var budget = 0;
                if ($scope.BUDGET_SPLIT_LIST.length > 0) {
                    var BUDGET_SPLIT_LIST = [];
                    if (LINE.MONTH_NO == 0) {
                        angular.forEach($scope.BUDGET_LIST, function (_m_budget) {
                            if (_m_budget.MONTH_NO != 0 && _m_budget.MONTH_NO < 13) {
                                var _budgetresult = $scope.BUDGET_SPLIT_LIST.filter(function (_b) { return _b.MONTH == (_m_budget.MONTH_NO - 1) });
                                if (_budgetresult.length > 0) {
                                    BUDGET_SPLIT_LIST.push(_budgetresult[0]);
                                };
                            }
                        });
                    }
                    $scope.SELECTED_BUDGET_HEADER.CUSTOM_PO_AMOUNT = 0;
                    $scope.SELECTED_BUDGET_LINE.MONTH = LINE.MONTH_NO;
                    var linedetail = [];
                    var MonthList = LINE.MONTH_NO == 0 ? BUDGET_SPLIT_LIST : $scope.BUDGET_SPLIT_LIST.filter(function (x) { return x.MONTH == (LINE.MONTH_NO - 1) });
                    angular.forEach(MonthList, function (_m, index) {
                        linedetail = linedetail.concat(_m.ITEM_LIST.filter(function (_item) { return _item.PO_SPLIT_ACCOUNT_ID == $scope.SELECTED_BUDGET.ACCOUNT_ID }));
                    });
                    budget = $filter('sumOfValue')(linedetail, 'BUDGET');
                    $scope.SELECTED_BUDGET_HEADER.CUSTOM_PO_AMOUNT = budget;
                };
            }

            $scope.POP_LOAD = 2;
            $scope.$parent.overlay_loadingNew = 'none';

            $scope.Fn_TAB_CLICK(1);
        });
    }
    $scope.GET_SCROLL_TOP = function () { window.scrollTo(0, 0); }
    $scope.VIEW_BUDGET_fn = function (LINE, DATE, PROJECT_ID, HEADER, ACCOUNT_INFO, WHERE_CLICK, BUDGET_SPLIT_LIST) {
        if (BUDGET_SPLIT_LIST == undefined) {
            BUDGET_SPLIT_LIST = [];
        }
        $scope.BUDGET_SPLIT_LIST = BUDGET_SPLIT_LIST;
        $scope.WHERE_CLICK = WHERE_CLICK;
        $('#Budget_Check').modal('show');
        ///   --1 FOR PO AND 2 FOR INVOICE 3 FOR PR
        $scope.BUDGET_LIST = [];
        $scope.INVOICE_APPROVED = 0; $scope.INVOICE_IN_APPROVAL = 0; $scope.APPROVED = 0; $scope.ON_APPROVAL = 0; $scope.PR_PENDING = 0; $scope.PR_APPROVED = 0;
        LINE.REFERENCE_ID = 0;
        LINE.REFERENCE_TYPE = 0;
        $scope.SELECTED_BUDGET_HEADER = HEADER;
        if (WHERE_CLICK == "PR_ACTION") {
            HEADER.CUSTOM_EXPECTED_PRICE = ACCOUNT_INFO.APPROVER_EXPECTED_PRICE;
            LINE.REFERENCE_ID = HEADER.REQUEST_DETAILS.REQUEST_ID;
            LINE.REFERENCE_TYPE = 3;
            $scope.SELECTED_BUDGET_HEADER.STATUS_ID = HEADER.REQUEST_DETAILS.STATUS_ID;
            LINE.BRANCH_ID = HEADER.REQUEST_DETAILS.BRANCH_ID;
        }
        else if (WHERE_CLICK == "PR_PROC") {
            HEADER.CUSTOM_PO_AMOUNT = 0; // ACCOUNT_INFO.APPROVER_EXPECTED_PRICE;
            LINE.REFERENCE_ID = 0; //HEADER.PROCESS_REQUEST_DETAILS.REQUEST_ID;
            LINE.REFERENCE_TYPE = 0; // 3;
            $scope.SELECTED_BUDGET_HEADER.STATUS_ID = HEADER.STATUS_ID;
        }
        else if (WHERE_CLICK == "PR_ALL") {
            HEADER.CUSTOM_EXPECTED_PRICE = ACCOUNT_INFO.APPROVER_EXPECTED_PRICE;
            LINE.REFERENCE_ID = HEADER.ALL_REQUEST_DETAILS.REQUEST_ID;
            LINE.REFERENCE_TYPE = 3;
            LINE.BRANCH_ID = HEADER.ALL_REQUEST_DETAILS.BRANCH_ID;
            $scope.SELECTED_BUDGET_HEADER.STATUS_ID = HEADER.ALL_REQUEST_DETAILS.STATUS_ID;
        }
        else if (WHERE_CLICK == "REQ_ACTION") {
            LINE.REFERENCE_ID = HEADER.REQUEST_LINE.STATUS_ID == 66 || HEADER.REQUEST_LINE.PO_HDR_ID == undefined ? HEADER.REQUEST_LINE.REQUEST_ID : HEADER.REQUEST_LINE.PO_HDR_ID;
            LINE.REFERENCE_TYPE = HEADER.REQUEST_LINE.STATUS_ID == 66 || HEADER.REQUEST_LINE.PO_HDR_ID == undefined ? 3 : 1;
            $scope.SELECTED_BUDGET_HEADER.STATUS_ID = HEADER.REQUEST_LINE.STATUS_ID;
            $scope.SELECTED_BUDGET_HEADER.CUSTOM_PO_AMOUNT = LINE.BUDGET_DETAILS_LIST[0].CURRENT_PO_CUSTOM;
            LINE.BRANCH_ID = HEADER.REQUEST_LINE.BRANCH_ID;
        }
        else if (WHERE_CLICK == "REQ_CREATE_ACTION") {
            LINE.REFERENCE_ID = HEADER.STATUS_ID == 66 || HEADER.PO_HDR_ID == undefined ? 0 : HEADER.PO_HDR_ID;
            LINE.REFERENCE_TYPE = HEADER.STATUS_ID == 66 || HEADER.PO_HDR_ID == undefined ? 3 : 1;
            $scope.SELECTED_BUDGET_HEADER.STATUS_ID = 66;
            $scope.SELECTED_BUDGET_HEADER.CUSTOM_PO_AMOUNT = LINE.BUDGET_DETAILS_LIST[0].CURRENT_PO_CUSTOM;
            LINE.BRANCH_ID = HEADER.BRANCH_ID;
        }
        else if (WHERE_CLICK == "REQ_PROC") {
            LINE.REFERENCE_ID = 0;//HEADER.PROCESSED_LINE.PO_HDR_ID;
            LINE.REFERENCE_TYPE = 0 //1;
            $scope.SELECTED_BUDGET_HEADER.STATUS_ID = HEADER.PROCESSED_LINE.STATUS_ID;
            $scope.SELECTED_BUDGET_HEADER.CUSTOM_PO_AMOUNT = 0;//LINE.BUDGET_DETAILS_LIST[0].CURRENT_PO_CUSTOM;
            LINE.BRANCH_ID = HEADER.PROCESSED_LINE.BRANCH_ID;
        }
        else if (WHERE_CLICK == "PO_APP_ACTION") {
            LINE.REFERENCE_ID = 0// HEADER.REQUEST_DETAILS.PO_HDR_ID;
            LINE.REFERENCE_TYPE = 0// 1;
            $scope.SELECTED_BUDGET_HEADER.STATUS_ID = HEADER.REQUEST_DETAILS.STATUS_ID;
            $scope.SELECTED_BUDGET_HEADER.CUSTOM_PO_AMOUNT = 0; //LINE.BUDGET_DETAILS_LIST[0].CURRENT_PO_CUSTOM;
            LINE.BRANCH_ID = HEADER.REQUEST_DETAILS.BRANCH_ID;
        }
        else if (WHERE_CLICK == "PO_APP_PROC") {
            LINE.REFERENCE_ID = 0//HEADER.PROCESS_REQUEST_DETAILS.PO_HDR_ID;
            LINE.REFERENCE_TYPE = 0//1;
            $scope.SELECTED_BUDGET_HEADER.STATUS_ID = HEADER.PROCESS_REQUEST_DETAILS.STATUS_ID;
            $scope.SELECTED_BUDGET_HEADER.CUSTOM_PO_AMOUNT = 0// LINE.BUDGET_DETAILS_LIST[0].CURRENT_PO_CUSTOM;
            LINE.BRANCH_ID = HEADER.PROCESS_REQUEST_DETAILS.BRANCH_ID;
        }
        else if (WHERE_CLICK == "PO_ALL_ACTION") {
            LINE.REFERENCE_ID = 0// HEADER.ALL_REQUEST_DETAILS.PO_HDR_ID;
            LINE.REFERENCE_TYPE = 0// 1;
            $scope.SELECTED_BUDGET_HEADER.STATUS_ID = HEADER.ALL_REQUEST_DETAILS.STATUS_ID;
            LINE.BRANCH_ID = HEADER.ALL_REQUEST_DETAILS.BRANCH_ID;
            $scope.SELECTED_BUDGET_HEADER.CUSTOM_PO_AMOUNT = 0// LINE.BUDGET_DETAILS_LIST[0].CURRENT_PO_CUSTOM;
        }
        else if (WHERE_CLICK == "BILL_EDIT_ACTION") {
            LINE.REFERENCE_ID = 0// HEADER.REQUEST_DETAILS.INVOICE_HEADER_ID;
            LINE.REFERENCE_TYPE = 0// 2;
            $scope.SELECTED_BUDGET_HEADER.STATUS_ID = HEADER.INVOICE_DETAILS.STATUS_ID;
            $scope.SELECTED_BUDGET_HEADER.CUSTOM_PO_AMOUNT = LINE.BUDGET_DETAILS_LIST[0].CURRENT_PO_CUSTOM;
            LINE.BRANCH_ID = HEADER.INVOICE_DETAILS.BRANCH_ID;
        }
        else if (WHERE_CLICK == "BILL_APP_ACTION") {
            LINE.REFERENCE_ID = 0// HEADER.REQUEST_DETAILS.INVOICE_HEADER_ID;
            LINE.REFERENCE_TYPE = 0// 2;
            $scope.SELECTED_BUDGET_HEADER.STATUS_ID = HEADER.REQUEST_DETAILS.STATUS_ID;
            $scope.SELECTED_BUDGET_HEADER.CUSTOM_PO_AMOUNT = 0// LINE.BUDGET_DETAILS_LIST[0].CURRENT_PO_CUSTOM;
            LINE.BRANCH_ID = HEADER.REQUEST_DETAILS.BRANCH_ID;
        }
        else if (WHERE_CLICK == "BILL_PROC_ACTION") {
            LINE.REFERENCE_ID = 0// HEADER.PROCESS_REQUEST_DETAILS.INVOICE_HEADER_ID;
            LINE.REFERENCE_TYPE = 0// 2;
            $scope.SELECTED_BUDGET_HEADER.STATUS_ID = HEADER.PROCESS_REQUEST_DETAILS.STATUS_ID;
            $scope.SELECTED_BUDGET_HEADER.CUSTOM_PO_AMOUNT = 0// LINE.BUDGET_DETAILS_LIST[0].CURRENT_PO_CUSTOM;
            LINE.BRANCH_ID = HEADER.PROCESS_REQUEST_DETAILS.BRANCH_ID;
        }
        else if (WHERE_CLICK == "BILL_ALL_ACTION") {
            LINE.REFERENCE_ID = 0//HEADER.ALL_REQUEST_DETAILS.INVOICE_HEADER_ID;
            LINE.REFERENCE_TYPE = 0 //2;
            $scope.SELECTED_BUDGET_HEADER.STATUS_ID = HEADER.ALL_REQUEST_DETAILS.STATUS_ID;
            $scope.SELECTED_BUDGET_HEADER.CUSTOM_PO_AMOUNT = 0// LINE.BUDGET_DETAILS_LIST[0].CURRENT_PO_CUSTOM;
            LINE.BRANCH_ID = HEADER.ALL_REQUEST_DETAILS.BRANCH_ID;
        }
        /// PI_REFERENCE_TYPE  --1 FOR PO AND 2 FOR INVOICE 3 FOR PR
        $scope.SELECTED_BUDGET_LINE = LINE;
        $scope.SELECTED_BUDGET = angular.copy(LINE);
        $scope.POP_LOAD = 1;
        $scope.SELECTED_BUDGET_LINE.BUDGET_DATE = new Date(DATE);
        $scope.SELECTED_BUDGET_LINE.MONTH_NO = 0;
        $scope.PROJECT_ID = PROJECT_ID;
        var ReadOnly = new Object();
        ReadOnly.MONTH_NO = $scope.SELECTED_BUDGET_LINE.MONTH_NO;
        ReadOnly.START_DATE = null;
        ReadOnly.BUDGET_DETAILS_LIST = LINE;
        //ReadOnly.MONTH_NO = angular.copy(LINE.BUDGET_DATE).getMonth()+1;
        $scope.CLICK_BUDGET_MONTH(ReadOnly, PROJECT_ID)
    }
    $scope.VIEW_SNAPSHOT_Fy = function (HEADER_DTLS, WHERE_CLICK) {
        $('#BUDGET_SNAPSHOT').modal('show');
        var REFERENCE_ID = 0, REFERENCE_TYPE = 0
        if (WHERE_CLICK == "REQ_PROC") {
            REFERENCE_ID = HEADER_DTLS.PROCESSED_LINE.REFERENCE_ID;
            REFERENCE_TYPE = 1
        }
        $scope.GET_P2P_BUDGET_SNAPSHOT(REFERENCE_ID, REFERENCE_TYPE);
    }
    $scope.Fn_TAB_CLICK = function (FLAG, TEXT_FLAG) {
        TEXT_FLAG = true;
        $scope.TAB_FLAG = FLAG;
        $scope.DISPLAY_MESSAGE = "";
        if ($scope.ACTIVE_MONTH_SELECTED == 0 && FLAG == 2 && TEXT_FLAG) {
            if ($scope.BUDGET_BIFURCATION_BY_ACCOUNTS_MONTH_LIST.length > 0 && $scope.BUDGET_BIFURCATION_BY_ACCOUNTS_MONTH_LIST[0].TRANSACTION_REFERENCE_NO != null) {
                $scope.DISPLAY_MESSAGE = "<b>" + $filter('date')($scope.BUDGET_BIFURCATION_BY_ACCOUNTS_MONTH_LIST[0].TRANSACTION_DATE, "yyyy") + " Full Period " + " Budget : </b>" + parseFloat($scope.BUDGET_BIFURCATION_BY_ACCOUNTS_MONTH_LIST[0].ALLOCATED_BUDGET).toFixed(2) + "";
            }
        }
        else if ($scope.ACTIVE_MONTH_SELECTED == 0 && FLAG == 1 && TEXT_FLAG) {
            if ($scope.BUDGET_BIFURCATION_BY_ACCOUNTS_LIST.length > 0 && $scope.BUDGET_BIFURCATION_BY_ACCOUNTS_LIST[0].TRANSACTION_REFERENCE_NO != null) {
                $scope.DISPLAY_MESSAGE = "<b>" + $filter('date')($scope.BUDGET_BIFURCATION_BY_ACCOUNTS_LIST[0].TRANSACTION_DATE, "yyyy") + "-YTD Budget : </b> " + parseFloat($scope.BUDGET_BIFURCATION_BY_ACCOUNTS_LIST[0].ALLOCATED_BUDGET).toFixed(2) + "";
            }
        }
        else if ($scope.ACTIVE_MONTH_SELECTED > 0 && FLAG == 2 && TEXT_FLAG) {
            if ($scope.BUDGET_BIFURCATION_BY_ACCOUNTS_MONTH_LIST.length > 0 && $scope.BUDGET_BIFURCATION_BY_ACCOUNTS_MONTH_LIST[0].TRANSACTION_REFERENCE_NO != null) {
                $scope.DISPLAY_MESSAGE = "<b>" + $filter('date')($scope.SELECTED_MONTH_WISE_LINE.START_DATE, "MMM yy") + " Budget : </b>" + parseFloat($scope.BUDGET_BIFURCATION_BY_ACCOUNTS_MONTH_LIST[0].ALLOCATED_BUDGET).toFixed(2);
            }
        }
        else if ($scope.ACTIVE_MONTH_SELECTED > 0 && FLAG == 1 && TEXT_FLAG) {
            if ($scope.BUDGET_BIFURCATION_BY_ACCOUNTS_LIST.length > 0 && $scope.BUDGET_BIFURCATION_BY_ACCOUNTS_LIST[0].TRANSACTION_REFERENCE_NO != null) {
                $scope.DISPLAY_MESSAGE = "<b>" + $filter('date')($scope.BUDGET_BIFURCATION_BY_ACCOUNTS_LIST[0].TRANSACTION_DATE, "yyyy") + "-YTD Budget : </b> " + parseFloat($scope.BUDGET_BIFURCATION_BY_ACCOUNTS_LIST[0].ALLOCATED_BUDGET).toFixed(2) + "";
            }
        }
        //if (data.data.Table.length > 0) {
        //    $scope.BUDGET_BIFURCATION_BY_ACCOUNTS_MONTH_LIST = data.data.Table; // MONTH
        //    //Full Period Secount not there first cursor is YTD
        //};
        ////Full Period Secount not there
        ////Project in case secound cursor not there 
        //if (data.data.Table1 != undefined && data.data.Table1.length > 0) {
        //    $scope.BUDGET_BIFURCATION_BY_ACCOUNTS_LIST = data.data.Table1; // YTD
        //};


    }
    $scope.DOWN_LOAD_EXCEL_Fn = function (FLAG,MONTH) {
            if (FLAG == 1) {
                if ($scope.BUDGET_BIFURCATION_BY_ACCOUNTS_LIST.length > 0 && $scope.BUDGET_BIFURCATION_BY_ACCOUNTS_LIST[0].TRANSACTION_REFERENCE_NO != null) {
                    angular.forEach($scope.BUDGET_BIFURCATION_BY_ACCOUNTS_LIST, function (_val) {
                        _val.XLS_YEAR = new Date(_val.TRANSACTION_DATE).getFullYear();
                        _val.XLS_TRANSACTION_DATE = moment(_val.TRANSACTION_DATE).format('MMM D, YYYY');//new Date(_val.TRANSACTION_DATE,'dd-MM-yyyy');
                    })

                    alasql('SELECT XLS_YEAR AS YEAR,XLS_TRANSACTION_DATE AS TRANSACTION_DATE,TRANSACTION_TYPE AS TYPE,TRANSACTION_REFERENCE_NO AS Reference_No,STATUS,TRANSACTION_AMOUNT AS AMOUNT,REMAINING_BUDGET INTO XLSX("Buget_Statement_YTD",{headers:true}) FROM ?', [$scope.BUDGET_BIFURCATION_BY_ACCOUNTS_LIST]);
                } else {
                    $scope.$parent.ShowAlert("Attention", 'No records available for extraction!', 3000);
                }
            }
            else if (FLAG == 2) {
                if ($scope.BUDGET_BIFURCATION_BY_ACCOUNTS_MONTH_LIST.length > 0 && $scope.BUDGET_BIFURCATION_BY_ACCOUNTS_MONTH_LIST[0].TRANSACTION_REFERENCE_NO != null) {
                    var Month = "Budget_Statement_" + moment(MONTH).format('MMM, YYYY');
                    angular.forEach($scope.BUDGET_BIFURCATION_BY_ACCOUNTS_MONTH_LIST, function (_val) {
                        _val.XLS_YEAR = new Date(_val.TRANSACTION_DATE).getFullYear();
                        _val.XLS_TRANSACTION_DATE = moment(_val.TRANSACTION_DATE).format('MMM D, YYYY');//new Date(_val.TRANSACTION_DATE,'dd-MM-yyyy');
                    })
                    alasql('SELECT XLS_YEAR AS YEAR,XLS_TRANSACTION_DATE AS TRANSACTION_DATE,TRANSACTION_TYPE AS TYPE,TRANSACTION_REFERENCE_NO AS Reference_No,STATUS,TRANSACTION_AMOUNT AS AMOUNT,REMAINING_BUDGET INTO XLSX("' + Month + '",{headers:true}) FROM ?', [$scope.BUDGET_BIFURCATION_BY_ACCOUNTS_MONTH_LIST]);
                } else {
                    $scope.$parent.ShowAlert("Attention", 'No records available for extraction!', 3000);
                }
            }
        };
    $scope.CLICK_BUDGET_MONTH = function (LINE, PROJECT_ID) {
        $scope.$parent.overlay_loadingNew = 'block';
        $scope.SELECTED_MONTH_WISE_LINE = LINE;
        $scope.SELECTED_MONTH_WISE_LINE.BRANCH_ID = $scope.SELECTED_BUDGET.BRANCH_ID;
        $scope.ACTIVE_MONTH_SELECTED = LINE.MONTH_NO;

        $scope.GET_P2P_OVERALL_BUDGET(LINE, LINE.MONTH_NO, $scope.PROJECT_ID);
    }
    $scope.Fn_CLICK_REFERENCE_NO = function (line) {
        //REFERENCE_TYPE :-//1 FOR PO AND 2 FOR INVOICE 3 FOR PR 
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
        var ModelObj = new Object();
        var _api_name = "";
        if (line.REFERENCE_TYPE == 1) {//PO
            _api_name = "GET_PO_BY_ID";
            ModelObj.PO_HDR_ID = line.REFERENCE_ID
        } else if (line.REFERENCE_TYPE == 2) {// Invoice
            _api_name = "GET_INVOICE_BY_ID";
            ModelObj.INVOICE_HEADER_ID = line.REFERENCE_ID;

        } else if (line.REFERENCE_TYPE == 3) { // 3 PR
            _api_name = "GET_PURCHASE_REQUEST_BY_ID";
            ModelObj.PURCHASE_REQUEST_ID = line.REFERENCE_ID
        }

        PrcCommMethods.P2P_API(ModelObj, _api_name, 'PO').then(function (data) {
            if (line.REFERENCE_TYPE == 1) {//PO
                line.HIDE_SHOW = !line.HIDE_SHOW;
                if (data.data.Table.length > 0) {
                    line.TAX_TYPE = [{ ID: 1, NAME: 'Tax Exclusive' }, { ID: 2, NAME: 'Tax Inclusive' }];
                    line.PO_DETAILS = data.data.Table[0];
                    line.PO_DETAILS.SHORT_NAME = $scope.TextReturn(data.data.Table[0].REQUESTOR_NAME);
                    line.PO_ITEM_LIST = data.data.Table1;
                    line.SELECTED_OPTION_LIST_MASTER = angular.copy($filter('unique')(data.data.Table2, 'APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID'));
                    line.SELECTED_OPTION_LIST = data.data.Table2;
                    line.PO_TERMS_AND_CONDITIONS_MASTER_LIST = data.data.Table3;
                    $scope.GET_UPLOADS(line.PO_DETAILS, 32, line.PO_DETAILS.PO_HDR_ID);
                    var TAX_TYPEList = line.TAX_TYPE.filter(function (x) { return x.ID == data.data.Table[0].TAX_TYPE });
                    if (TAX_TYPEList.length > 0) { data.data.Table[0].TAX_NAME = TAX_TYPEList[0].NAME; }
                }
                else { line.PO_DETAILS = {}; line.PO_ITEM_LIST = []; line.SELECTED_OPTION_LIST = []; line.PO_TERMS_AND_CONDITIONS_MASTER_LIST = []; }
            } else if (line.REFERENCE_TYPE == 2) {// Invoice
                if (data.data.Table.length > 0) {
                    line.HIDE_SHOW = !line.HIDE_SHOW;
                    line.PROCESS_REQUEST_DETAILS = data.data.Table[0];
                    line.PROCESS_REQUEST_DETAILS.SHORT_NAME = $scope.TextReturn(line.PROCESS_REQUEST_DETAILS.REQUESTOR_NAME);
                    line.PROCESS_REQUEST_DETAILS.PO_ATTACHMENT_IN_INVOICE = { IS_MULTI_FILE_UPLOAD_ALLOW: true, };
                    line.PROCESS_REQUEST_DETAILS.GRN_ATTACHMENT = { IS_MULTI_FILE_UPLOAD_ALLOW: true, };
                    line.PROCESS_REQUEST_DETAILS.OTHER_ATTACHMENT = { IS_MULTI_FILE_UPLOAD_ALLOW: true, };
                    //$scope.GET_UPLOADS(line.PROCESS_REQUEST_DETAILS, 33, line.REFERENCE_ID);
                    $scope.GET_UPLOADS(line.PROCESS_REQUEST_DETAILS.PO_ATTACHMENT_IN_INVOICE, 37, line.REFERENCE_ID);
                    $scope.GET_UPLOADS(line.PROCESS_REQUEST_DETAILS.GRN_ATTACHMENT, 38, line.REFERENCE_ID);
                    $scope.GET_UPLOADS(line.PROCESS_REQUEST_DETAILS.OTHER_ATTACHMENT, 39, line.REFERENCE_ID);
                    $scope.VIEW_INVOICE_DETAIL(line.PROCESS_REQUEST_DETAILS, 2, 1);
                    ModelObj.TYPE = 1;
                    ModelObj.REFERENCE_ID = line.REFERENCE_ID;
                    PrcCommMethods.P2P_API(ModelObj, 'GET_INVOICE_PO_MAPPING', 'PO').then(function (getdata) {
                        if (getdata.data.Table.length > 0) {
                            line.PROCE_INVOICE_PO_MAPPING = getdata.data.Table;
                            line.PROCESS_REQUEST_ITEMS_LIST = data.data.Table1;
                        }
                        else {
                            line.PROCE_INVOICE_PO_MAPPING = [];
                            line.PROCESS_REQUEST_ITEMS_LIST = data.data.Table1;
                        }
                    })
                }
            } else if (line.REFERENCE_TYPE == 3) { // 3 PR
                if (data.data.Table.length > 0) {
                    line.HIDE_SHOW = !line.HIDE_SHOW;
                    line.GET_BY_ID_LIST = data.data.Table;
                }
                else { line.GET_BY_ID_LIST = []; }
            }
        });
    }
    $scope.loadReportFile = function (url, FLAG) {
        pdfDelegate.$getByHandle('my-pdf-container').load(url);
        if (FLAG == 1) {
            document.getElementById("PO_PDF").style.zIndex = "1500";
            document.getElementById("PO_PDF").style.width = "35%";
        }
    };
    $scope.Fn_AUDIT_PDF_DOWNLOAD_BILL = function (FLAG, DATA) {
        ModelObj = new Object();
        ModelObj.INVOICE_HEADER_ID = DATA.INVOICE_HEADER_ID;
        ModelObj.FILE_PATH = "/P2PFiles/AUDIT_BILL_REPORT/ENTITY_" + parseInt($cookies.get("ENTITY_ID")) + "/BILL_" + DATA.INVOICE_HEADER_ID + "/" + DATA.INVOICE_NUMBER + '.pdf';
        if (true || DATA.PDF_GENERATED == undefined || DATA.PDF_GENERATED == null || DATA.PDF_GENERATED == "") {
            PrcCommMethods.P2P_API(ModelObj, 'CREATE_AUDIT_BILL_PDF', 'PO').then(function (data) {
                //P2PFiles /\PO\35\114\PO - 00022.pdf
                // $scope.loadReportFile(ModelObj.FILE_PATH, FLAG);
                if (FLAG == 2) {
                    window.open(ModelObj.FILE_PATH, '_blank');
                };
            });
        }
        else {
            if (FLAG == 2) {
                window.open(ModelObj.FILE_PATH, '_blank');
            };
        };
    }
    $scope.$on('ngRepeatFinishedRender', function (ngRepeatFinishedEvent) {
        $('[data-toggle="tooltip"]').tooltip();
        $('[data-toggle="popover"]').popover();
    });

})