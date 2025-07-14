app.controller('PurchaseRequestApprovalController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $localStorage, pdfDelegate, $interval) {
    $(".modal-backdrop").remove();


    $scope.ApprovalViewSearch = {
        NAME: '',
        PAGE_NO: 1,
        PAGE_NO_PROCESS: 1,
        PAGE_NO_ALL: 1,
        PAGE_SIZE: 20,
        UPLOADE_TYPE_ID: 31,
        UploadedFiles: [],
        FILTER_URGENT_REQUESTS: null,

    };
    $scope.APPROVAL_HEADER_ID = 0;
    $scope.HIDE_SHOW = false;
    //, { ID: 3, NAME: 'No Tax' }
    $scope.TAX_TYPE = [{ ID: 1, NAME: 'Tax Exclusive' }, { ID: 2, NAME: 'Tax Inclusive' }];
    if (window.location.href.toLowerCase().indexOf("p2p/p2pindex#!/request_approvals") != -1) {
        $scope.ApprovalViewSearch.APPROVAL_TYPE_ID = 2;
    }
    else if (window.location.href.toLowerCase().indexOf("p2p/p2pindex#!/po_approvals") != -1) {
        $scope.ApprovalViewSearch.APPROVAL_TYPE_ID = 3;
    }
    else if (window.location.href.toLowerCase().indexOf("p2p/p2pindex#!/bill_approvals") != -1) {
        $scope.ApprovalViewSearch.APPROVAL_TYPE_ID = 4;
    }
    $scope.COMMENTS_LENGTH = 100;
    $scope.OTP_VALID_CHECK = 0; // JSON.parse($localStorage.ENTITY_SETTINGS).filter(x => x.SETTING_ID == 17)[0]["SETTING_VALUE"];
    $scope.TAB_FLAG = 1; $scope.IS_PARTIAL_PAYMENT_ALLOW = false;
    $scope.CUR_APPROVAL_HEADER_STATUS_ID = 0; $scope.AUTO_APPROVAL_HEADER_STATUS_ID = ""; $scope.NXT_APPROVAL_HEADER_STATUS_ID = "";
    $scope.CUR_APP_SORT_ORDER = 0; $scope.NXT_APP_SORT_ORDER = 0; $scope.HIDE_SHOW_MATCH = false;

    $scope.PO_FOR_INVOICE_PO_MAPPING_LIST = [];
    $scope.PURCHASE_REQUEST_LIST = [];
    $scope.PURCHASE_REQUESTS_PROCESS_LIST = [];
    $scope.INVOICE_PO_MAPPING = [];
    $scope.P2P_BUDGET_LIST = [];
    $scope.PROC_P2P_BUDGET_LIST = [];
    $scope.CURRENCY_LIST = [];
    $scope.GRN_ATTACHMENT = { IS_MULTI_FILE_UPLOAD_ALLOW: true, };
    $scope.PO_ATTACHMENT_IN_INVOICE = { IS_MULTI_FILE_UPLOAD_ALLOW: true, };
    $scope.OTHER_ATTACHMENT = { IS_MULTI_FILE_UPLOAD_ALLOW: true, };

    $scope.MATCHED_PO_MAPPING_LIST = [];
    $scope.MAPPED_LIST = [];
    $scope.LIMIT_TO = 500;
    $scope.COMMENTS_LIMIT_TO = 500;
    $scope.DESCRIPTION_LIMIT_TO = 500;
    $scope.ApprovalViewSearch.NOTE_FOR_APPROVERS_LIMIT_TO = 500;
    $scope.EDIT_MATCH_BTN_SHOW = false;
    $scope.BUDGET_LIST = [];
    $scope.P2P_ALL_BUDGET_MASTER_LIST = [];
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

    $scope.temp_approver_grp_id = 0;
    $scope.APPROVED = 0;
    $scope.ON_APPROVAL = 0;
    $scope.ALLOCATED_BUDGET = 0;
    $scope.INVOICE_APPROVAL = 0;
    $scope.INVOICE_IN_APPROVAL = 0;
    $scope.SELECTED_BUDGET_LINE = {};

    $scope.GetNext_Auto_ApproverIDs = function (chaindata) {
        var GRN_MATCH = false;
        if ($scope.ApprovalViewSearch.APPROVAL_TYPE_ID == 4 && $scope.TAB_FLAG == 1) {
            GRN_MATCH = $scope.ACTION_ITEM_LIST.filter(function (x) { return x.GRN_MATCH }).length == $scope.ACTION_ITEM_LIST.length;
        }
        else if ($scope.ApprovalViewSearch.APPROVAL_TYPE_ID == 4 && $scope.TAB_FLAG == 3) {
            GRN_MATCH = $scope.ALL_ITEM_LIST.filter(function (x) { return x.GRN_MATCH }).length == $scope.ALL_ITEM_LIST.length;
        }
        var ApprovedList = chaindata.filter(function (x) {
            return x.STATUS_ID == 37 || x.APPROVER_ID == parseInt($cookies.get("USERID") && x.ACTION_REQUIRED == 1);
        });
        var Unique = angular.copy($filter('unique')(chaindata, 'GROUP_SORT_SEQUENCE'));
        var NextApproverGroupChain = [];
        var NextApproverGroupChainList = [];

        //for (var i = 0; i < Unique.length; i++) {
        //    NextApproverGroupChain = chaindata.filter(function (x) { return x.GROUP_SORT_SEQUENCE == ($scope.ApprovalData.GROUP_SORT_SEQUENCE + (i + 1)) });
        //    if (NextApproverGroupChain.length > 0) {
        //        _next_approval_group_seq = ($scope.ApprovalData.GROUP_SORT_SEQUENCE + (i + 1));
        //        ///NextApproverGroupChainList.push()
        //        break;
        //    }
        //};
        for (var i = 0; i < Unique.length; i++) {
            // var NextApprover = chaindata.filter(function (x) { return x.GROUP_SORT_SEQUENCE == ($scope.ApprovalData.GROUP_SORT_SEQUENCE + (i + 1)) });
            if (Unique[i].GROUP_SORT_SEQUENCE > $scope.ApprovalData.GROUP_SORT_SEQUENCE && $scope.ApprovalData.CUR_APPROVAL_HEADER_STATUS_ID != Unique[i].APPROVAL_HEADER_STATUS_ID) {

                var NextApprover = chaindata.filter(function (x) { return x.GROUP_SORT_SEQUENCE == Unique[i].GROUP_SORT_SEQUENCE });

                if (NextApprover.length > 0) {
                    for (var j = 0; j < NextApprover.length; j++) {
                        NextApprover[j].NEXT_APPROVER_GRP = 0;
                        if (NextApproverGroupChain.filter(function (x) { return x.NEXT_APPROVER_GRP == 1 }).length == 0) {
                            var AutoApproved = ApprovedList.filter(function (_auto_approved) { return NextApprover[j].APPROVER_ID == _auto_approved.APPROVER_ID && _auto_approved.STATUS_ID == 37 });
                            if (AutoApproved.length == 0) {
                                NextApprover[j].NEXT_APPROVER_GRP = 1;
                            }
                        }
                        NextApproverGroupChainList.push(NextApprover[j]);
                    };
                    if (NextApproverGroupChain.filter(function (x) { return x.NEXT_APPROVER_GRP == 1 }).length == 0) {
                        NextApproverGroupChain = NextApprover;
                    };
                }
            };
        }
        //old Code //varNextApproverGroupChain = chaindata.filter(function (x) { return x.GROUP_SORT_SEQUENCE == ($scope.ApprovalData.GROUP_SORT_SEQUENCE + 1) });old code
        var Releasecount = 0;
        if (NextApproverGroupChainList.length != 0) {
            $scope.ApprovalData.RELEASE_FLAG = 0;
            angular.forEach(NextApproverGroupChainList, function (approver) {

                var autoapproveList = ApprovedList.filter(function (x) { return x.APPROVAL_HEADER_STATUS_ID == approver.APPROVAL_HEADER_STATUS_ID || approver.APPROVER_ID == x.APPROVER_ID && x.STATUS_ID == 37 });

                if (autoapproveList.length == 0 && approver.NEXT_APPROVER_GRP == 1) {
                    if ($scope.ApprovalData.Next_Approver_IDs == "") {
                        $scope.ApprovalData.Next_Approver_IDs = approver.APPROVAL_HEADER_STATUS_ID;
                    }
                    else {
                        $scope.ApprovalData.Next_Approver_IDs = $scope.ApprovalData.Next_Approver_IDs + "," + approver.APPROVAL_HEADER_STATUS_ID;
                    }
                }
                else if (autoapproveList.length > 0) {
                    if ($scope.ApprovalData.Auto_Approver_IDs == "") {
                        $scope.ApprovalData.Auto_Approver_IDs = approver.APPROVAL_HEADER_STATUS_ID;
                    }
                    else {
                        $scope.ApprovalData.Auto_Approver_IDs = $scope.ApprovalData.Auto_Approver_IDs + "," + approver.APPROVAL_HEADER_STATUS_ID;
                    }
                    Releasecount = Releasecount + 1;
                }
            });
            if (NextApproverGroupChainList.length == Releasecount) {
                $scope.ApprovalData.RELEASE_FLAG = 1;
            }
        }
        else {
            $scope.ApprovalData.RELEASE_FLAG = 1;
        }
        /*
               * Are you sure you want to approve this Requisition?
               * angular.forEach($scope.APPROVAL_HEADERS_CHAIN_LIST, function (approver) {
                  approver.IS_CURRENT_USER = false;
                  if (parseInt(approver.APPROVER_ID) == parseInt($cookies.get("USERID"))) {
                      approver.IS_CURRENT_USER = true;
                      $scope.ACTION_REQUIRED = approver.ACTION_REQUIRED;
                      if (approver.ACTION_REQUIRED == 1) {
                          $scope.CUR_APPROVAL_HEADER_STATUS_ID = approver.APPROVAL_HEADER_STATUS_ID;
                          $scope.CUR_APP_SORT_ORDER = approver.APP_SORT_SEQUENCE;
                      }
                  }
                  //if ($scope.CUR_APP_SORT_ORDER == approver.APP_SORT_SEQUENCE && approver.ACTION_REQUIRED == 1 && parseInt(approver.APPROVER_ID) != parseInt($cookies.get("USERID"))) {
                  //    $scope.AUTO_APPROVAL_HEADER_STATUS_ID = $scope.AUTO_APPROVAL_HEADER_STATUS_ID == "" ? approver.APPROVAL_HEADER_STATUS_ID : approver.APPROVAL_HEADER_STATUS_ID + ",";
                  //}
                  if ($scope.CUR_APP_SORT_ORDER != 0 && approver.APP_SORT_SEQUENCE > $scope.CUR_APP_SORT_ORDER && ($scope.NXT_APP_SORT_ORDER == 0 || $scope.NXT_APP_SORT_ORDER == approver.APP_SORT_SEQUENCE)) {
                      $scope.NXT_APP_SORT_ORDER = approver.APP_SORT_SEQUENCE;
                      if ($scope.NXT_APPROVAL_HEADER_STATUS_ID == "") {
                          $scope.NXT_APPROVAL_HEADER_STATUS_ID = approver.APPROVAL_HEADER_STATUS_ID;
                      }
                      else {
                          $scope.NXT_APPROVAL_HEADER_STATUS_ID = $scope.NXT_APPROVAL_HEADER_STATUS_ID + "," + approver.APPROVAL_HEADER_STATUS_ID;
                      }
  
                      //$scope.NXT_APPROVAL_HEADER_STATUS_ID = $scope.NXT_APPROVAL_HEADER_STATUS_ID == "" ? approver.APPROVAL_HEADER_STATUS_ID : approver.APPROVAL_HEADER_STATUS_ID + ",";
                  }
              });*/
    }
    $scope.ApprovalSetup = function (ApprovalChain) {

        $scope.ApprovalData.ACTION_REQUIRED = 0;
        var ActionRequiredApprovers = ApprovalChain.filter(function (x) { return x.ACTION_REQUIRED == 1 });
        if (ActionRequiredApprovers.length > 0) {
            $scope.ApprovalData.GROUP_SORT_SEQUENCE = ActionRequiredApprovers[0].GROUP_SORT_SEQUENCE;
            $scope.ApprovalData.ANY_ALL_FLAG = ActionRequiredApprovers[0].ANY_ALL_FLAG;
            var currentuser = ActionRequiredApprovers.filter(function (x) { return x.APPROVER_ID == parseInt($cookies.get("USERID")) });
            if (currentuser.length > 0) {
                $scope.ApprovalData.ACTION_REQUIRED = 1;
                $scope.ApprovalData.CUR_APPROVAL_HEADER_STATUS_ID = currentuser[0].APPROVAL_HEADER_STATUS_ID;
                $scope.ApprovalData.CUR_APP_SORT_ORDER = currentuser[0].APP_SORT_SEQUENCE;
            }
        }

        $scope.ApprovalData.IS_REVIEWER = false;
        var IS_REVIEWER_DTLS = ApprovalChain.filter(function (x) { return x.IS_REVIEWER });
        if (IS_REVIEWER_DTLS.length > 0) {
            $scope.ApprovalData.IS_REVIEWER = true;
        }
    }

    $scope.GET_BRANCH_LIST = function (BRN_LIST) {
        var UserModelObj = new Object();
        UserModelObj.INTEGRATION_SYSTEM_ID = 16
        UserModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        UserModelObj.USER_ID = parseInt($cookies.get("USERID"));
        UserModelObj.MODULE_ID = parseInt($cookies.get("MODULE_ID"));
        PrcCommMethods.CASHUP_API(UserModelObj, 'GET_BRANCH_LIST').then(function (data) {
            if (data.data.length > 0) {
                $scope.BRANCH_LOGIN_LIST = data.data;
            };
        });
    }

    $scope.ALL_XERO_TRACKING_CATEGORIES = [];
    $scope.ALL_XERO_TRACKING_CATEGORIES_OPTIONS = [];
    $scope.ALL_SELECTED_XERO_TRACKING_CATEGORIES_OPTIONS = [];

    $scope.GET_APPROVAL_CUSTOM_FIELD_OPTIONS_MASTER = function (SELECTED_REQ, FLAG) {

        $scope.$parent.overlay_loadingNew = 'block';
        var CusModelObj = new Object();
        CusModelObj.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID = 0;
        CusModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CusModelObj.BRANCH_ID = SELECTED_REQ.BRANCH_ID;
        PrcCommMethods.P2P_API(CusModelObj, 'GET_APPROVAL_CUSTOM_FIELD_OPTIONS_MASTER', 'PO').then(function (data) {
            if (FLAG == 3) {//All
                if (data.data.Table.length > 0) {
                    $scope.ALL_XERO_TRACKING_CATEGORIES = data.data.MASTER;
                    $scope.ALL_XERO_TRACKING_CATEGORIES_OPTIONS = data.data.Table;
                    $scope.$parent.overlay_loadingNew = 'none';
                    $scope.GET_APPROVAL_LINES_FOR_ADMIN(SELECTED_REQ, FLAG);
                }
                else {
                    $scope.GET_APPROVAL_LINES_FOR_ADMIN(SELECTED_REQ, FLAG);
                    $scope.ALL_XERO_TRACKING_CATEGORIES = [];
                    $scope.ALL_XERO_TRACKING_CATEGORIES_OPTIONS = [];
                    $scope.$parent.overlay_loadingNew = 'none';
                }
            }
            else {
                if (data.data.Table.length > 0) {
                    $scope.XERO_TRACKING_CATEGORIES = data.data.MASTER;
                    $scope.XERO_TRACKING_CATEGORIES_OPTIONS = data.data.Table;
                    $scope.$parent.overlay_loadingNew = 'none';
                    $scope.GET_APPROVAL_LINES_FOR_APPROVER(SELECTED_REQ, FLAG);
                }
                else {
                    $scope.GET_APPROVAL_LINES_FOR_APPROVER(SELECTED_REQ, FLAG);
                    $scope.XERO_TRACKING_CATEGORIES = [];
                    $scope.XERO_TRACKING_CATEGORIES_OPTIONS = [];
                    $scope.$parent.overlay_loadingNew = 'none';
                }
            }
        });
    };

    $scope.GET_APPROVAL_HEADERS_FOR_APPROVER_LAZY_LOAD = function () {
        $scope.GET_APPROVAL_HEADERS_FOR_APPROVER(2, 1, 1)
    }
    $scope.GET_APPROVAL_HEADERS_FOR_APPROVER_PROCESS_LAZY_LOAD = function () {
        $scope.GET_APPROVAL_HEADERS_FOR_APPROVER_PROCESS(2, 1, 1)
    }
    $scope.GET_APPROVAL_HEADERS_FOR_ADMIN_LAZY_LOAD = function () {
        $scope.GET_APPROVAL_HEADERS_FOR_ADMIN(2, 1, 1)
    }
    $scope.GET_APPROVAL_HEADERS_FOR_APPROVER = function (FLAG, SORT_COLUMN_NO, SORT_ORDER_NO_ASCDESC, SYNC_FLAG) {
        $scope.SORT_COLUMN_NO = SORT_COLUMN_NO;
        $scope.SORT_ORDER_NO_ASCDESC = SORT_ORDER_NO_ASCDESC;
        $scope.$parent.overlay_loadingNew = 'block';
        var PaymentModelObj = new Object();
        if (FLAG == 1) {
            $scope.HEADERS_FOR_APPROVER_LIST = [];
            $scope.ApprovalViewSearch.PAGE_NO = 1;
        }
        PaymentModelObj.APPROVAL_TYPE_ID = $scope.ApprovalViewSearch.APPROVAL_TYPE_ID;
        PaymentModelObj.PYMNT_START_DATE = null;
        PaymentModelObj.PYMNT_END_DATE = null;
        PaymentModelObj.ACTION_REQUIRED = 1  //-- 1 FOR ACTION REQUIRED 2 FOR PROCESSED AND 0 FOR ALL
        PaymentModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PaymentModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PaymentModelObj.BRANCH_IDS = $scope.ApprovalViewSearch.BRANCH_IDS;
        PaymentModelObj.STATUS_IDS = "";//$scope.ApprovalViewSearch.STATUS_IDS == null ? '37, 38, 39' : $scope.ApprovalViewSearch.STATUS_IDS;
        PaymentModelObj.PAGE_NO = $scope.ApprovalViewSearch.PAGE_NO;
        PaymentModelObj.PAGE_SIZE = $scope.ApprovalViewSearch.PAGE_SIZE;
        PaymentModelObj.SORT_ORDER_NO = SORT_ORDER_NO_ASCDESC ? 1 : -1;//1 FOR ASC -1 FOR DESC  
        PaymentModelObj.SORT_COLUMN_NO = SORT_COLUMN_NO;
        PaymentModelObj.APPROVAL_HEADER_ID = null;//$scope.ApprovalViewSearch.APPROVAL_HEADER_ID;
        PaymentModelObj.SCHEDULE_NAME = $scope.ApprovalViewSearch.SEARCH_NAME;
        PrcCommMethods.PAYMENT_API(PaymentModelObj, 'GET_APPROVAL_HEADERS_FOR_APPROVER').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.$parent.overlay_loadingNew = 'none';
                $scope.HEADERS_FOR_APPROVER_LIST = $scope.HEADERS_FOR_APPROVER_LIST.concat(data.data.Table);
                if (FLAG == 1) {
                    $scope.PURCHASE_REQUEST_APPROVAL_CLICK($scope.HEADERS_FOR_APPROVER_LIST[0], SYNC_FLAG);
                }
                if (data.data.Table.length < $scope.ApprovalViewSearch.PAGE_SIZE) {
                    $scope.GetActionData = false;
                }
                else {
                    $scope.ApprovalViewSearch.PAGE_NO = parseInt($scope.ApprovalViewSearch.PAGE_NO) + 1;
                    $scope.GetActionData = true;
                }
            } else {
                if ($scope.HEADERS_FOR_APPROVER_LIST.length == 0) { }
                $scope.GetActionData = false;
                $scope.$parent.overlay_loadingNew = 'none';
            }
        })
    }
    // TAB Process
    $scope.GET_APPROVAL_HEADERS_FOR_APPROVER_PROCESS = function (FLAG, SORT_COLUMN_NO, SORT_ORDER_NO_ASCDESC) {
        if (FLAG == 1) {
            $scope.ApprovalViewSearch.PAGE_NO_PROCESS = 1;
            $scope.PURCHASE_REQUESTS_PROCESS_LIST = [];
        }
        ModelObj = new Object();
        ModelObj.APPROVAL_TYPE_ID = $scope.APPROVAL_HEADER_ID > 0 ? 4 : $scope.ApprovalViewSearch.APPROVAL_TYPE_ID;
        ModelObj.PYMNT_START_DATE = null;
        ModelObj.PYMNT_END_DATE = null;
        ModelObj.ACTION_REQUIRED = 2; //-- 1 FOR ACTION REQUIRED 2 FOR PROCESSED AND 0 FOR ALL
        ModelObj.USER_ID = parseInt($cookies.get("USERID"));
        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        ModelObj.BRANCH_IDS = $scope.ApprovalViewSearch.BRANCH_IDS
        ModelObj.STATUS_IDS = "";// $scope.ApprovalViewSearch.STATUS_IDS == null ? '37, 38, 39' : $scope.ApprovalViewSearch.STATUS_IDS;
        ModelObj.PAGE_NO = $scope.ApprovalViewSearch.PAGE_NO_PROCESS;
        ModelObj.PAGE_SIZE = $scope.ApprovalViewSearch.PAGE_SIZE;
        ModelObj.SORT_ORDER_NO = SORT_ORDER_NO_ASCDESC ? 1 : -1;//1 FOR ASC -1 FOR DESC
        ModelObj.SORT_COLUMN_NO = SORT_COLUMN_NO;
        ModelObj.APPROVAL_HEADER_ID = $scope.APPROVAL_HEADER_ID == undefined || $scope.APPROVAL_HEADER_ID == null ? 0 : $scope.APPROVAL_HEADER_ID;// $scope.ApprovalViewSearch.APPROVAL_HEADER_ID;
        ModelObj.SCHEDULE_NAME = $scope.ApprovalViewSearch.PROCESS_SEARCH_NAME;
        PrcCommMethods.PAYMENT_API(ModelObj, 'GET_APPROVAL_HEADERS_FOR_APPROVER', 'PO').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.PURCHASE_REQUESTS_PROCESS_LIST = $scope.PURCHASE_REQUESTS_PROCESS_LIST.concat(data.data.Table);
                if (FLAG == 1) {
                    $scope.PURCHASE_REQUEST_PROCESSED_APPROVAL_CLICK(data.data.Table[0]);
                }
                if (data.data.Table.length < $scope.ApprovalViewSearch.PAGE_SIZE) {
                    $scope.GetProcessData = false;
                }
                else {
                    $scope.ApprovalViewSearch.PAGE_NO_PROCESS = parseInt($scope.ApprovalViewSearch.PAGE_NO_PROCESS) + 1;
                    $scope.GetProcessData = true;
                }
            }
            else {
                if ($scope.PURCHASE_REQUESTS_PROCESS_LIST.length == 0) { };
                $scope.GetProcessData = false;
            }
        });
    }
    // TAB ALL
    $scope.GET_APPROVAL_HEADERS_FOR_ADMIN = function (FLAG, SYNC_FLAG) {
        if (FLAG == 1) {
            $scope.ApprovalViewSearch.PAGE_NO_ALL = 1;
            $scope.HEADERS_FOR_APPROVER_ADMIN_LIST = [];
        }
        ModelObj = new Object();
        ModelObj.APPROVAL_TYPE_ID = $scope.ApprovalViewSearch.APPROVAL_TYPE_ID;
        ModelObj.START_DATE = null;
        ModelObj.END_DATE = null;
        ModelObj.USER_ID = parseInt($cookies.get("USERID"));
        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        ModelObj.BRANCH_IDS = $scope.ApprovalViewSearch.BRANCH_IDS
        ModelObj.STATUS_IDS = "";
        ModelObj.PAGE_NO = $scope.ApprovalViewSearch.PAGE_NO_ALL;
        ModelObj.PAGE_SIZE = $scope.ApprovalViewSearch.PAGE_SIZE;
        ModelObj.ITEM = $scope.ApprovalViewSearch.SEARCH_NAME_ALL;
        PrcCommMethods.P2P_API(ModelObj, 'GET_APPROVAL_HEADERS_FOR_ADMIN', 'PO').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.HEADERS_FOR_APPROVER_ADMIN_LIST = $scope.HEADERS_FOR_APPROVER_ADMIN_LIST.concat(data.data.Table);
                if (FLAG == 1) {
                    $scope.PURCHASE_REQUEST_ALL_APPROVAL_ADMIN_CLICK(data.data.Table[0], SYNC_FLAG)
                }
                if (data.data.Table.length < $scope.ApprovalViewSearch.PAGE_SIZE) {
                    $scope.GetAllData = false;
                }
                else {
                    $scope.ApprovalViewSearch.PAGE_NO_ALL = parseInt($scope.ApprovalViewSearch.PAGE_NO_ALL) + 1;
                    $scope.GetAllData = true;
                }
            }
            else {
                if ($scope.HEADERS_FOR_APPROVER_ADMIN_LIST.length == 0) { };
                $scope.GetAllData = false;
            }
        });
    }
    $scope.GET_PURCHASE_REQUEST_BY_ID = function (REQUEST_LINE, FLAG) { // PR Approval
        ModelObj = new Object();
        ModelObj.PURCHASE_REQUEST_ID = REQUEST_LINE.REQUEST_ID;
        PrcCommMethods.P2P_API(ModelObj, 'GET_PURCHASE_REQUEST_BY_ID', 'PO').then(function (data) {
            if (data.data.Table.length > 0) {
                if (FLAG == 1) {
                    $scope.ApprovalViewSearch.REQUEST_DETAILS = {};
                    data.data.Table[0].PAGING = REQUEST_LINE.PAGING;
                    $scope.ApprovalViewSearch.PR_ACTION_HEADER_DTLS = REQUEST_LINE;  // PR Approval
                    $scope.ApprovalViewSearch.REQUEST_DETAILS = data.data.Table[0];  // PR Approval
                    $scope.ApprovalViewSearch.REQUEST_DETAILS.IS_MULTI_FILE_UPLOAD_ALLOW = true;
                    $scope.POP_UPD_PURCHASE_REQUEST_BY_APPROVER(FLAG);
                    $scope.$parent.GET_UPLOADS($scope.ApprovalViewSearch.REQUEST_DETAILS, 31, REQUEST_LINE.REQUEST_ID);
                    $scope.GET_CURRENCY($scope.ApprovalViewSearch.REQUEST_DETAILS);
                }
                else if (FLAG == 2) {// Proccess
                    //$scope.P2P_PROCESS_BUDGET_MASTER_LIST = [];
                    data.data.Table[0].PAGING = REQUEST_LINE.PAGING;
                    $scope.ApprovalViewSearch.PR_PROC_HEADER_DTLS = REQUEST_LINE;  // PR Approval
                    $scope.ApprovalViewSearch.PROCESS_REQUEST_DETAILS = data.data.Table[0];  // PR Approval
                    $scope.POP_UPD_PURCHASE_REQUEST_BY_APPROVER(FLAG);
                    $scope.GET_P2P_BUDGET_SNAPSHOT($scope.ApprovalViewSearch.PROCESS_REQUEST_DETAILS)
                    $scope.GET_CURRENCY($scope.ApprovalViewSearch.PROCESS_REQUEST_DETAILS);
                }
                else if (FLAG == 3) { //All
                    $scope.ApprovalViewSearch.ALL_REQUEST_DETAILS = {};
                    $scope.P2P_ALL_BUDGET_MASTER_LIST = [];
                    data.data.Table[0].PAGING = REQUEST_LINE.PAGING;
                    $scope.ApprovalViewSearch.PR_ALL_HEADER_DTLS = REQUEST_LINE;  // PR Approval
                    $scope.ApprovalViewSearch.ALL_REQUEST_DETAILS = data.data.Table[0];  // PR Approval
                    $scope.ApprovalViewSearch.ALL_REQUEST_DETAILS.IS_MULTI_FILE_UPLOAD_ALLOW = true;
                    $scope.POP_UPD_PURCHASE_REQUEST_BY_APPROVER("ALL");
                    $scope.$parent.GET_UPLOADS($scope.ApprovalViewSearch.ALL_REQUEST_DETAILS, 31, REQUEST_LINE.REQUEST_ID);
                    $scope.GET_P2P_BUDGET_SNAPSHOT($scope.ApprovalViewSearch.ALL_REQUEST_DETAILS);
                    $scope.GET_CURRENCY($scope.ApprovalViewSearch.ALL_REQUEST_DETAILS);
                }
            }
        });
    }
    $scope.GET_PO_BY_ID = function (REQUEST_LINE, FLAG) {
        $scope.$parent.overlay_loadingNew = 'block';
        ModelObj = new Object();
        ModelObj.PO_HDR_ID = REQUEST_LINE.PO_HDR_ID;
        PrcCommMethods.P2P_API(ModelObj, 'GET_PO_BY_ID', 'PO').then(function (data) {
            if (data.data.Table.length > 0) {
                data.data.Table[0].PAGING = REQUEST_LINE.PAGING;

                if (FLAG == 1) {
                    var TAX_TYPEList = $scope.TAX_TYPE.filter(function (x) { return x.ID == data.data.Table[0].TAX_TYPE });
                    if (TAX_TYPEList.length > 0) {
                        data.data.Table[0].TAX_NAME = TAX_TYPEList[0].NAME;
                    }
                    $scope.ApprovalViewSearch.REQUEST_DETAILS = data.data.Table[0];
                    $scope.ApprovalViewSearch.REQUEST_DETAILS.IS_MULTI_FILE_UPLOAD_ALLOW = true;
                    $scope.ApprovalViewSearch.SELECTED_HEADER_ACTION_DTLS = REQUEST_LINE;
                    $scope.ApprovalViewSearch.REQUEST_DETAILS.APPROVAL_HEADER_ID = REQUEST_LINE.APPROVAL_HEADER_ID;
                    $scope.ApprovalViewSearch.REQUEST_DETAILS.SHORT_NAME = $scope.TextReturn($scope.ApprovalViewSearch.REQUEST_DETAILS.REQUESTOR_NAME);
                    $scope.TERMS_AND_CONDITIONS_MASTER_LIST = data.data.Table3;
                    $scope.QUOTATION_LIST = data.data.Table4;
                    $scope.ApprovalViewSearch.SPLIT_TYPE = data.data.Table[0].SPLIT_TYPE == 0 ? null : data.data.Table[0].SPLIT_TYPE;
                    $scope.ApprovalViewSearch.COPY_SPLIT_TYPE = angular.copy($scope.ApprovalViewSearch.SPLIT_TYPE);

                    if (data.data.Table5.length > 0) {
                        $scope.PO_SPLIT_LIST = data.data.Table5;
                    }
                    $scope.$parent.GET_UPLOADS($scope.ApprovalViewSearch.REQUEST_DETAILS, 32, $scope.ApprovalViewSearch.REQUEST_DETAILS.PO_HDR_ID);
                }
                else if (FLAG == 2) {
                    var TAX_TYPEList = $scope.TAX_TYPE.filter(function (x) { return x.ID == data.data.Table[0].TAX_TYPE });
                    if (TAX_TYPEList.length > 0) {
                        data.data.Table[0].TAX_NAME = TAX_TYPEList[0].NAME;
                    }
                    $scope.ApprovalViewSearch.SELECTED_HEADER_PROCESS_DTLS = REQUEST_LINE;
                    $scope.ApprovalViewSearch.PROCESS_REQUEST_DETAILS = data.data.Table[0];
                    $scope.ApprovalViewSearch.PROCESS_REQUEST_DETAILS.SHORT_NAME = $scope.TextReturn($scope.ApprovalViewSearch.PROCESS_REQUEST_DETAILS.REQUESTOR_NAME);
                    $scope.$parent.GET_UPLOADS($scope.ApprovalViewSearch.PROCESS_REQUEST_DETAILS, 32, $scope.ApprovalViewSearch.PROCESS_REQUEST_DETAILS.PO_HDR_ID);

                    $scope.PROC_TERMS_AND_CONDITIONS_MASTER_LIST = data.data.Table3;
                    $scope.PROC_QUOTATION_LIST = data.data.Table4;
                    if (data.data.Table5.length > 0) {
                        $scope.PO_SPLIT_LIST = data.data.Table5;
                    }
                }
                else if (FLAG == 3) {

                    data.data.Table[0].PAGING = REQUEST_LINE.PAGING;
                    var TAX_TYPEList = $scope.TAX_TYPE.filter(function (x) { return x.ID == data.data.Table[0].TAX_TYPE });
                    if (TAX_TYPEList.length > 0) {
                        data.data.Table[0].TAX_NAME = TAX_TYPEList[0].NAME;
                    }
                    $scope.ApprovalViewSearch.SELECTED_HEADER_ALL_DTLS = REQUEST_LINE;
                    $scope.ApprovalViewSearch.ALL_REQUEST_DETAILS = data.data.Table[0];
                    $scope.ApprovalViewSearch.ALL_REQUEST_DETAILS.APPROVAL_HEADER_ID = REQUEST_LINE.APPROVAL_HEADER_ID;
                    $scope.ApprovalViewSearch.ALL_REQUEST_DETAILS.SHORT_NAME = $scope.TextReturn($scope.ApprovalViewSearch.ALL_REQUEST_DETAILS.REQUESTOR_NAME);
                    $scope.ApprovalViewSearch.ALL_REQUEST_DETAILS.IS_MULTI_FILE_UPLOAD_ALLOW = true;
                    $scope.ALL_TERMS_AND_CONDITIONS_MASTER_LIST = data.data.Table3;
                    $scope.ALL_QUOTATION_LIST = data.data.Table4;
                    if (data.data.Table5.length > 0) {
                        $scope.PO_SPLIT_LIST = data.data.Table5;
                    }
                    $scope.$parent.GET_UPLOADS($scope.ApprovalViewSearch.ALL_REQUEST_DETAILS, 32, $scope.ApprovalViewSearch.ALL_REQUEST_DETAILS.PO_HDR_ID);
                }

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
                var TAX_TYPEList = $scope.TAX_TYPE.filter(function (x) { return x.ID == data.data.Table[0].TAX_TYPE });
                if (TAX_TYPEList.length > 0) { data.data.Table[0].TAX_NAME = TAX_TYPEList[0].NAME; }
                if (FLAG == 1) {
                    $scope.SELECTED_OPTION_LIST_MASTER = $filter('unique')(data.data.Table2, 'APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID');
                    $scope.SELECTED_OPTION_LIST = data.data.Table2;
                    $scope.ApprovalViewSearch.REQUEST_DETAILS = data.data.Table[0];
                    $scope.ApprovalViewSearch.REQUEST_DETAILS.BUDGET_DATE = ($scope.ApprovalViewSearch.REQUEST_DETAILS.BUDGET_DATE == "" || $scope.ApprovalViewSearch.REQUEST_DETAILS.BUDGET_DATE == null || $scope.ApprovalViewSearch.REQUEST_DETAILS.BUDGET_DATE == undefined) ? $scope.ApprovalViewSearch.REQUEST_DETAILS.INVOICE_DATE : $scope.ApprovalViewSearch.REQUEST_DETAILS.BUDGET_DATE;

                    $scope.ApprovalViewSearch.REQUEST_DETAILS.IS_MULTI_FILE_UPLOAD_ALLOW = true;
                    $scope.ApprovalViewSearch.REQUEST_DETAILS.INVOICE_HEADER_ID = REQUEST_LINE.INVOICE_HEADER_ID;
                    $scope.ApprovalViewSearch.REQUEST_DETAILS.APPROVAL_HEADER_ID = REQUEST_LINE.APPROVAL_HEADER_ID;
                    $scope.GET_APPROVAL_LINES_FOR_APPROVER(REQUEST_LINE, FLAG)/// BILL Approval;
                    $scope.$parent.GET_UPLOADS($scope.ApprovalViewSearch.REQUEST_DETAILS, 33, REQUEST_LINE.INVOICE_HEADER_ID);
                    $scope.INVOICE_PROCESS_SPLIT_LIST = [];
                    $scope.INVOICE_PROCESS_SPLIT_LIST = data.data.Table3;
                    $scope.VIEW_INVOICE_DETAIL($scope.ApprovalViewSearch.REQUEST_DETAILS, 2, 1);

                }
                else if (FLAG == 2) {
                    $scope.ApprovalViewSearch.PROCESS_REQUEST_DETAILS = data.data.Table[0];
                    $scope.ApprovalViewSearch.PROCESS_REQUEST_DETAILS.SHORT_NAME = $scope.TextReturn($scope.ApprovalViewSearch.PROCESS_REQUEST_DETAILS.REQUESTOR_NAME);
                    $scope.ApprovalViewSearch.PROCESS_REQUEST_DETAILS.BUDGET_DATE = ($scope.ApprovalViewSearch.PROCESS_REQUEST_DETAILS.BUDGET_DATE == "" || $scope.ApprovalViewSearch.PROCESS_REQUEST_DETAILS.BUDGET_DATE == null || $scope.ApprovalViewSearch.PROCESS_REQUEST_DETAILS.BUDGET_DATE == undefined) ? $scope.ApprovalViewSearch.PROCESS_REQUEST_DETAILS.INVOICE_DATE : $scope.ApprovalViewSearch.PROCESS_REQUEST_DETAILS.BUDGET_DATE;

                    $scope.ApprovalViewSearch.PROCESS_REQUEST_DETAILS.PO_ATTACHMENT_IN_INVOICE = { IS_MULTI_FILE_UPLOAD_ALLOW: true, };
                    $scope.ApprovalViewSearch.PROCESS_REQUEST_DETAILS.GRN_ATTACHMENT = { IS_MULTI_FILE_UPLOAD_ALLOW: true, };
                    $scope.ApprovalViewSearch.PROCESS_REQUEST_DETAILS.OTHER_ATTACHMENT = { IS_MULTI_FILE_UPLOAD_ALLOW: true, };

                    $scope.$parent.GET_UPLOADS($scope.ApprovalViewSearch.PROCESS_REQUEST_DETAILS, 33, REQUEST_LINE.INVOICE_HEADER_ID);
                    $scope.$parent.GET_UPLOADS($scope.ApprovalViewSearch.PROCESS_REQUEST_DETAILS.PO_ATTACHMENT_IN_INVOICE, 37, REQUEST_LINE.INVOICE_HEADER_ID);
                    $scope.$parent.GET_UPLOADS($scope.ApprovalViewSearch.PROCESS_REQUEST_DETAILS.GRN_ATTACHMENT, 38, REQUEST_LINE.INVOICE_HEADER_ID);
                    $scope.$parent.GET_UPLOADS($scope.ApprovalViewSearch.PROCESS_REQUEST_DETAILS.OTHER_ATTACHMENT, 39, REQUEST_LINE.INVOICE_HEADER_ID);
                    $scope.INVOICE_PROCESS_SPLIT_LIST = [];
                    $scope.INVOICE_PROCESS_SPLIT_LIST = data.data.Table3;
                    $scope.VIEW_INVOICE_DETAIL($scope.ApprovalViewSearch.PROCESS_REQUEST_DETAILS, 2, 1);

                    if ($scope.INVOICE_HEADER_ID > 0) {
                        $scope.PROCESS_REQUEST_ITEMS_LIST = data.data.Table1;
                        $scope.$parent.overlay_loadingNew = 'none';
                    }
                }
                else if (FLAG == 3) {
                    $scope.ALL_SELECTED_OPTION_LIST_MASTER = $filter('unique')(data.data.Table2, 'APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID');
                    $scope.ALL_SELECTED_OPTION_LIST = data.data.Table2;
                    $scope.ApprovalViewSearch.ALL_REQUEST_DETAILS = data.data.Table[0];
                    $scope.ApprovalViewSearch.ALL_REQUEST_DETAILS.BUDGET_DATE = ($scope.ApprovalViewSearch.ALL_REQUEST_DETAILS.BUDGET_DATE == "" || $scope.ApprovalViewSearch.ALL_REQUEST_DETAILS.BUDGET_DATE == null || $scope.ApprovalViewSearch.ALL_REQUEST_DETAILS.BUDGET_DATE == undefined) ? $scope.ApprovalViewSearch.ALL_REQUEST_DETAILS.INVOICE_DATE : $scope.ApprovalViewSearch.ALL_REQUEST_DETAILS.BUDGET_DATE;

                    $scope.ApprovalViewSearch.ALL_REQUEST_DETAILS.IS_MULTI_FILE_UPLOAD_ALLOW = true;
                    $scope.ApprovalViewSearch.ALL_REQUEST_DETAILS.OVERALL_STATUS_ID = REQUEST_LINE.OVERALL_STATUS_ID;
                    $scope.ApprovalViewSearch.ALL_REQUEST_DETAILS.SHORT_NAME = $scope.TextReturn($scope.ApprovalViewSearch.ALL_REQUEST_DETAILS.REQUESTOR_NAME);
                    $scope.GET_APPROVAL_LINES_FOR_ADMIN($scope.ApprovalViewSearch, FLAG)/// BILL Approval Admin;

                    $scope.ApprovalViewSearch.ALL_REQUEST_DETAILS.PO_ATTACHMENT_IN_INVOICE = { IS_MULTI_FILE_UPLOAD_ALLOW: true, };
                    $scope.ApprovalViewSearch.ALL_REQUEST_DETAILS.GRN_ATTACHMENT = { IS_MULTI_FILE_UPLOAD_ALLOW: true, };
                    $scope.ApprovalViewSearch.ALL_REQUEST_DETAILS.OTHER_ATTACHMENT = { IS_MULTI_FILE_UPLOAD_ALLOW: true, };

                    $scope.INVOICE_PROCESS_SPLIT_LIST = [];
                    $scope.INVOICE_PROCESS_SPLIT_LIST = data.data.Table3;

                    $scope.VIEW_INVOICE_DETAIL($scope.ApprovalViewSearch.ALL_REQUEST_DETAILS, 2, 1);
                    $scope.$parent.GET_UPLOADS($scope.ApprovalViewSearch.ALL_REQUEST_DETAILS, 33, REQUEST_LINE.INVOICE_HEADER_ID);
                    $scope.$parent.GET_UPLOADS($scope.ApprovalViewSearch.ALL_REQUEST_DETAILS.PO_ATTACHMENT_IN_INVOICE, 37, REQUEST_LINE.INVOICE_HEADER_ID);
                    $scope.$parent.GET_UPLOADS($scope.ApprovalViewSearch.ALL_REQUEST_DETAILS.GRN_ATTACHMENT, 38, REQUEST_LINE.INVOICE_HEADER_ID);
                    $scope.$parent.GET_UPLOADS($scope.ApprovalViewSearch.ALL_REQUEST_DETAILS.OTHER_ATTACHMENT, 39, REQUEST_LINE.INVOICE_HEADER_ID);
                }
            }
        });
    }

    $scope.GET_APPROVAL_LINES_FOR_APPROVER = function (REQUEST, FLAG) {
        //      $scope.$parent.overlay_loadingNew = 'block';
        var PaymentModelObj = new Object();
        PaymentModelObj.APPROVAL_HEADER_ID = REQUEST.APPROVAL_HEADER_ID;
        PaymentModelObj.APPROVAL_TYPE_ID = REQUEST.APPROVAL_TYPE_ID;
        PaymentModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.PAYMENT_API(PaymentModelObj, 'GET_APPROVAL_LINES_FOR_APPROVER').then(function (data) {
            if (data.data.Table.length > 0) {
                //    $scope.$parent.overlay_loadingNew = 'none';
                if (FLAG == 1) { //Action PR Action
                    REQUEST.ACTION_ITEM_LIST = data.data.Table;
                    $scope.ACTION_ITEM_LIST = REQUEST.ACTION_ITEM_LIST;
                    if (data.data.Table1 != undefined && data.data.Table1.length > 0) {
                        $scope.SELECTED_XERO_TRACKING_CATEGORIES_OPTIONS = data.data.Table1;
                    };
                }
                else {
                    if ($scope.APPROVAL_HEADER_ID > 0) {
                    } else {
                        REQUEST.PROCESS_REQUEST_ITEMS_LIST = data.data.Table;
                        $scope.PROCESS_REQUEST_ITEMS_LIST = REQUEST.PROCESS_REQUEST_ITEMS_LIST;
                        if (data.data.Table1 != undefined && data.data.Table1.length > 0) {
                            $scope.SELECTED_PROCESSED_XERO_TRACKING_CATEGORIES_OPTIONS = data.data.Table1;
                        };
                    }
                }

            }
        });
    }
    $scope.GET_APPROVAL_LINES_FOR_ADMIN = function (REQUEST_LINE, FLAG) {

        ModelObj = new Object();
        ModelObj.APPROVAL_HEADER_ID = REQUEST_LINE.APPROVAL_HEADER_ID;
        ModelObj.APPROVAL_TYPE_ID = $scope.ApprovalViewSearch.APPROVAL_TYPE_ID;
        ModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.P2P_API(ModelObj, 'GET_APPROVAL_LINES_FOR_ADMIN', 'PO').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.$parent.overlay_loadingNew = 'none';
                if (FLAG == 1) { //Action
                    REQUEST_LINE.ALL_ITEM_LIST = data.data.Table;
                    $scope.ALL_ITEM_LIST = REQUEST_LINE.ALL_ITEM_LIST;
                    if (data.data.Table1 != undefined && data.data.Table1.length > 0) {
                        $scope.ALL_SELECTED_XERO_TRACKING_CATEGORIES_OPTIONS = data.data.Table1;
                    };
                }
                else if (FLAG == 3) { // ALL Tab 3
                    REQUEST_LINE.ALL_ITEM_LIST = data.data.Table;
                    $scope.ALL_ITEM_LIST = REQUEST_LINE.ALL_ITEM_LIST;
                    if (data.data.Table1 != undefined && data.data.Table1.length > 0) {
                        $scope.ALL_SELECTED_XERO_TRACKING_CATEGORIES_OPTIONS = data.data.Table1;
                    };
                }
            }
            else {
                $scope.$parent.overlay_loadingNew = 'none';
            }
        });
    }

    $scope.GET_APPROVAL_HEADERS_CHAIN = function (REQUEST, FLAG) {
        //FLAG: 1=>PageLoad, 2=>Submit For Approval 
        $scope.ApprovalViewSearch.APPROVAL_HEADER_ID = REQUEST.APPROVAL_HEADER_ID;;
        $scope.ApprovalViewSearch.APPROVAL_TYPE_ID = REQUEST.APPROVAL_TYPE_ID;
        $scope.$parent.overlay_loadingNew = 'block';
        var PaymentModelObj = new Object();
        PaymentModelObj.APPROVAL_HEADER_ID = REQUEST.APPROVAL_HEADER_ID;
        PaymentModelObj.APPROVAL_TYPE_ID = REQUEST.APPROVAL_TYPE_ID;
        PrcCommMethods.PAYMENT_API(PaymentModelObj, 'GET_APPROVAL_HEADERS_CHAIN').then(function (data) {
            if (data.data.Table.length > 0) {
                if (FLAG == 1) {
                    $scope.APPROVAL_HEADERS_CHAIN_LIST = data.data.Table;
                    $scope.ApprovalData = {
                        GROUP_SORT_SEQUENCE: 0,
                        ANY_ALL_FLAG: 0,
                        Next_Approver_IDs: '',
                        Auto_Approver_IDs: '',
                        No_Action_Approver_IDs: '',
                        CUR_APPROVAL_HEADER_STATUS_ID: 0,
                        CUR_APP_SORT_ORDER: 0,
                        RELEASE_FLAG: 0,
                        ACTION_REQUIRED: 0
                    };
                    $scope.ApprovalSetup(data.data.Table);
                }
                if (FLAG == 2) {
                    //On Submit
                    $scope.ApprovalData.Next_Approver_IDs = "";
                    var chaindata = angular.copy(data.data.Table);
                    if ($scope.ApprovalData.ANY_ALL_FLAG == 0) {
                        var RemainingToApprove = chaindata.filter(function (x) { return x.GROUP_SORT_SEQUENCE == $scope.ApprovalData.GROUP_SORT_SEQUENCE && x.APPROVER_ID != parseInt($cookies.get("USERID")) && x.ACTION_REQUIRED == 1 });
                        if (RemainingToApprove.length == 0) {
                            $scope.GetNext_Auto_ApproverIDs(chaindata);
                        }
                    }
                    else {
                        var grpapproverlist = chaindata.filter(function (x) { return x.GROUP_SORT_SEQUENCE == $scope.ApprovalData.GROUP_SORT_SEQUENCE });
                        var ApprovedBy = grpapproverlist.filter(function (x) { return x.APPROVER_ID != parseInt($cookies.get("USERID")) && (x.STATUS_ID == 37 || x.STATUS_ID == 41) });
                        var approvedByCount = ApprovedBy.length + 1;
                        if (grpapproverlist.length < $scope.ApprovalData.ANY_ALL_FLAG || approvedByCount >= $scope.ApprovalData.ANY_ALL_FLAG) {
                            var NoActionList = grpapproverlist.filter(function (x) { return x.APPROVER_ID != parseInt($cookies.get("USERID")) && x.STATUS_ID != 37 && x.STATUS_ID != 41 });
                            angular.forEach(NoActionList, function (approver) {
                                if ($scope.ApprovalData.No_Action_Approver_IDs == "") {
                                    $scope.ApprovalData.No_Action_Approver_IDs = approver.APPROVAL_HEADER_STATUS_ID;
                                }
                                else {
                                    $scope.ApprovalData.No_Action_Approver_IDs = $scope.ApprovalData.No_Action_Approver_IDs + "," + approver.APPROVAL_HEADER_STATUS_ID;
                                }
                            });
                            $scope.GetNext_Auto_ApproverIDs(chaindata);
                        }
                    }
                    $scope.PROCESS_APPROVALS_LVL_2();
                }
                /*
                 * Are you sure you want to approve this Requisition?
                 * angular.forEach($scope.APPROVAL_HEADERS_CHAIN_LIST, function (approver) {
                    approver.IS_CURRENT_USER = false;
                    if (parseInt(approver.APPROVER_ID) == parseInt($cookies.get("USERID"))) {
                        approver.IS_CURRENT_USER = true;
                        $scope.ACTION_REQUIRED = approver.ACTION_REQUIRED;
                        if (approver.ACTION_REQUIRED == 1) {
                            $scope.CUR_APPROVAL_HEADER_STATUS_ID = approver.APPROVAL_HEADER_STATUS_ID;
                            $scope.CUR_APP_SORT_ORDER = approver.APP_SORT_SEQUENCE;
                        }
                    }
                    //if ($scope.CUR_APP_SORT_ORDER == approver.APP_SORT_SEQUENCE && approver.ACTION_REQUIRED == 1 && parseInt(approver.APPROVER_ID) != parseInt($cookies.get("USERID"))) {
                    //    $scope.AUTO_APPROVAL_HEADER_STATUS_ID = $scope.AUTO_APPROVAL_HEADER_STATUS_ID == "" ? approver.APPROVAL_HEADER_STATUS_ID : approver.APPROVAL_HEADER_STATUS_ID + ",";
                    //}
                    if ($scope.CUR_APP_SORT_ORDER != 0 && approver.APP_SORT_SEQUENCE > $scope.CUR_APP_SORT_ORDER && ($scope.NXT_APP_SORT_ORDER == 0 || $scope.NXT_APP_SORT_ORDER == approver.APP_SORT_SEQUENCE)) {
                        $scope.NXT_APP_SORT_ORDER = approver.APP_SORT_SEQUENCE;
                        if ($scope.NXT_APPROVAL_HEADER_STATUS_ID == "") {
                            $scope.NXT_APPROVAL_HEADER_STATUS_ID = approver.APPROVAL_HEADER_STATUS_ID;
                        }
                        else {
                            $scope.NXT_APPROVAL_HEADER_STATUS_ID = $scope.NXT_APPROVAL_HEADER_STATUS_ID + "," + approver.APPROVAL_HEADER_STATUS_ID;
                        }
    
                        //$scope.NXT_APPROVAL_HEADER_STATUS_ID = $scope.NXT_APPROVAL_HEADER_STATUS_ID == "" ? approver.APPROVAL_HEADER_STATUS_ID : approver.APPROVAL_HEADER_STATUS_ID + ",";
                    }
                });*/

                if (REQUEST.APPROVAL_TYPE_ID != 4) {
                    $scope.$parent.overlay_loadingNew = 'none';
                }
            }
        })
    }
    $scope.GET_APPROVAL_HEADERS_CHAIN_PROCESS = function (PROCESSED, FLAG) {
        $scope.$parent.overlay_loadingNew = 'block';
        var PaymentModelObj = new Object();
        PaymentModelObj.APPROVAL_HEADER_ID = PROCESSED.APPROVAL_HEADER_ID;
        PaymentModelObj.APPROVAL_TYPE_ID = PROCESSED.APPROVAL_TYPE_ID;
        PrcCommMethods.PAYMENT_API(PaymentModelObj, 'GET_APPROVAL_HEADERS_CHAIN').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.PROCESSED_APPROVAL_HEADERS_CHAIN_LIST = data.data.Table;
                PROCESSED.PROCESS_APPROVAL_HEADERS_CHAIN_LIST = data.data.Table;
                $scope.$parent.overlay_loadingNew = 'none';
            }
        })
    }
    $scope.PROCE_INVOICE_PO_MAPPING = [];
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
                    //  $scope.ALL_INVOICE_PO_MAPPING = data.data.Table;
                    $scope.INVOICE_PO_MAPPING = [];
                    $scope.INVOICE_PO_MAPPING = data.data.Table;
                }
                $scope.GET_INVOICE_BY_ID(REQUEST, FLAG);
                $scope.$parent.overlay_loadingNew = 'none';
            }
            else {
                if (FLAG == 1) {
                    $scope.INVOICE_PO_MAPPING = [];
                    $scope.PO_MAPPED_LOAD = 2;
                }
                if (FLAG == 2) {
                    $scope.PROCE_INVOICE_PO_MAPPING = [];
                }
                if (FLAG == 3) {
                    $scope.INVOICE_PO_MAPPING = [];
                }
                $scope.GET_INVOICE_BY_ID(REQUEST, FLAG);
                $scope.$parent.overlay_loadingNew = 'none';
            }

        })
    }
    $scope.GET_PO_FOR_INVOICE_PO_MAPPING = function (FLAG, LOAD_FLAG) {
        var PaymentModelObj = new Object();
        PaymentModelObj.CONTACT_ID = $scope.TAB_FLAG == 1 ? $scope.ApprovalViewSearch.REQUEST_DETAILS.CONTACT_ID : $scope.ApprovalViewSearch.ALL_REQUEST_DETAILS.CONTACT_ID;    //@  INT,
        PaymentModelObj.CURRENCY_ID = $scope.TAB_FLAG == 1 ? $scope.ApprovalViewSearch.REQUEST_DETAILS.CURRENCY_ID : $scope.ApprovalViewSearch.ALL_REQUEST_DETAILS.CURRENCY_ID;  //@ INT,
        PaymentModelObj.AMOUNT_FROM = $scope.ApprovalViewSearch.AMOUNT_FROM;//@ NUMERIC(18, 5), 
        PaymentModelObj.AMOUNT_TO = $scope.ApprovalViewSearch.AMOUNT_TO; //@ NUMERIC(18, 5), 
        PaymentModelObj.DATE_FROM = $scope.ApprovalViewSearch.DATE_FROM;  //@ DATE,
        PaymentModelObj.DATE_TO = $scope.ApprovalViewSearch.DATE_TO;  //@ DATE,
        PaymentModelObj.PO_NUMBER = $scope.ApprovalViewSearch.PO_NUMBER;
        PaymentModelObj.PROJECT_MASTER_ID = $scope.TAB_FLAG == 1 ? $scope.ApprovalViewSearch.REQUEST_DETAILS.PROJECT_MASTER_ID : $scope.ApprovalViewSearch.ALL_REQUEST_DETAILS.PROJECT_MASTER_ID;
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
        $scope.$parent.DateInputLoad('PO_REQ', 1);
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
    $scope.GET_P2P_OVERALL_BUDGET = function (LINE, MONTH) {
        ModelObj = new Object();
        if (MONTH == -1) {
            ModelObj.PROJECT_MASTER_ID = $scope.SELECTED_BUDGET_LINE.PROJECT_MASTER_ID;
            ModelObj.ACCOUNT_ID = $scope.SELECTED_BUDGET_LINE.XERO_ACCOUNT_ID;
            ModelObj.YEAR = $scope.SELECTED_BUDGET_LINE.YEAR;
            ModelObj.MONTH = 0;
        }
        else {
            ModelObj.PROJECT_MASTER_ID = LINE.PROJECT_MASTER_ID;
            ModelObj.ACCOUNT_ID = LINE.XERO_ACCOUNT_ID;
            ModelObj.YEAR = LINE.YEAR
            ModelObj.MONTH = (MONTH + 1)
        }
        PrcCommMethods.P2P_API(ModelObj, 'GET_P2P_OVERALL_BUDGET', 'PO').then(function (data) {
            if (data.data.Table.length > 0 && MONTH == -1) {
                LINE.P2P_OVERALL_BUDGET_LIST = data.data.Table;
                $scope.P2P_OVERALL_BUDGET_LIST = data.data.Table;
                // if ($scope.POP_LOAD == 1) {
                var DATE = angular.copy(LINE.START_DATE);
                var MouthStart = new Date(LINE.START_DATE).getMonth();
                var MonthEnd = new Date(LINE.END_DATE).getMonth();
                $scope.BUDGET_LIST = [];
                var ReadOnly = new Object();
                ReadOnly.MONTH = -1;
                ReadOnly.START_DATE = "";
                ReadOnly.LINE = data.data.Table[0];
                $scope.BUDGET_LIST.push(ReadOnly);
                if ($scope.ApprovalViewSearch.PROJECT_MASTER_ID == undefined || $scope.ApprovalViewSearch.PROJECT_MASTER_ID == null || $scope.ApprovalViewSearch.PROJECT_MASTER_ID == "") {
                    for (var i = MouthStart; i <= MonthEnd; i++) {
                        var ReadOnly = new Object();
                        ReadOnly.MONTH = i;
                        ReadOnly.START_DATE = new Date(DATE).setMonth(i);
                        ReadOnly.LINE = LINE
                        $scope.BUDGET_LIST.push(ReadOnly);
                    }
                }

                $scope.POP_LOAD = 2;
                // }

                $scope.INVOICE_APPROVAL = 0;
                $scope.INVOICE_IN_APPROVAL = 0;

                var APPROVED = data.data.Table1.filter(function (x) { return x.STATUS_ID == 72 });
                var ON_APPROVAL = data.data.Table1.filter(function (x) { return x.STATUS_ID == 70 });

                var INVOICE_IN_APPROVAL = data.data.Table2.filter(function (x) { return x.STATUS_ID == 79 });
                var INVOICE_APPROVAL = data.data.Table2.filter(function (x) { return x.STATUS_ID == 80 });

                if (APPROVED.length > 0) { $scope.APPROVED = APPROVED[0].PO_AMOUNT; }
                if (ON_APPROVAL.length > 0) { $scope.ON_APPROVAL = ON_APPROVAL[0].PO_AMOUNT; }

                if (INVOICE_IN_APPROVAL.length > 0) { $scope.INVOICE_IN_APPROVAL = INVOICE_IN_APPROVAL[0].INVOICE_AMOUNT; }
                if (INVOICE_APPROVAL.length > 0) { $scope.INVOICE_APPROVAL = INVOICE_APPROVAL[0].INVOICE_AMOUNT; }


                $scope.P2P_MONTH_BUDGET_LIST = data.data.Table1;
                $scope.ALLOCATED_BUDGET = data.data.Table[0].ALLOCATED_BUDGET == null ? 0 : data.data.Table[0].ALLOCATED_BUDGET;
                $scope.$parent.overlay_loadingNew = 'none';
            }
            else if (data.data.Table.length > 0 && MONTH > -1) {
                $scope.APPROVED = 0;
                $scope.ON_APPROVAL = 0;
                $scope.ALLOCATED_BUDGET = 0;
                $scope.INVOICE_APPROVAL = 0;
                $scope.INVOICE_IN_APPROVAL = 0;

                LINE.P2P_MONTH_BUDGET_LIST = data.data.Table;
                var APPROVED = data.data.Table1.filter(function (x) { return x.STATUS_ID == 72 });
                var ON_APPROVAL = data.data.Table1.filter(function (x) { return x.STATUS_ID == 70 });

                var INVOICE_IN_APPROVAL = data.data.Table2.filter(function (x) { return x.STATUS_ID == 79 });
                var INVOICE_APPROVAL = data.data.Table2.filter(function (x) { return x.STATUS_ID == 80 });

                //STATUS_ID: 79  Inapporova
                //STATUS_ID: 80  Approved

                if (APPROVED.length > 0) { $scope.APPROVED = APPROVED[0].PO_AMOUNT; }
                if (ON_APPROVAL.length > 0) { $scope.ON_APPROVAL = ON_APPROVAL[0].PO_AMOUNT; }

                if (INVOICE_IN_APPROVAL.length > 0) { $scope.INVOICE_IN_APPROVAL = INVOICE_IN_APPROVAL[0].INVOICE_AMOUNT; }
                if (INVOICE_APPROVAL.length > 0) { $scope.INVOICE_APPROVAL = INVOICE_APPROVAL[0].INVOICE_AMOUNT; }

                $scope.P2P_MONTH_BUDGET_LIST = data.data.Table1;
                $scope.ALLOCATED_BUDGET = data.data.Table[0].ALLOCATED_BUDGET == null ? 0 : data.data.Table[0].ALLOCATED_BUDGET;
                $scope.$parent.overlay_loadingNew = 'none';
            }
            else {
                $scope.APPROVED = 0;
                $scope.ON_APPROVAL = 0;
                $scope.ALLOCATED_BUDGET = 0;
            }
        });
    }
    $scope.GET_P2P_BUDGET_BY_ACCOUNTS = function (FLAG, LINE, HEADER, CHANGE_FLAG) {
        var ptopobj = new Object();
        ptopobj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        ptopobj.BRANCH_ID = LINE.BRANCH_ID;///RECEIVING_TYPE_ID   1 FOR QTY WISE AND 2 FOR AMOUNT WISE
        ptopobj.USER_ID = parseInt($cookies.get("USERID"));
        if ($scope.ApprovalViewSearch.APPROVAL_TYPE_ID == 2) {
            ptopobj.YEAR = new Date(LINE.PR_CREATED_DATE).getFullYear();
            ptopobj.MONTH = new Date(LINE.PR_CREATED_DATE).getMonth() + 1;
            if (FLAG == 2 || FLAG == 3 && $scope.SELECTED_REQ_ALL.OVERALL_STATUS_ID != 39) {//39 is pending  approved condition
                ptopobj.REFERENCE_ID = 0;
                ptopobj.REFERENCE_TYPE = 0; //PR
            }
            else { //pending condition
                ptopobj.REFERENCE_ID = LINE.REQUEST_ID;
                ptopobj.REFERENCE_TYPE = 3; //PR
            }
        }
        else if ($scope.ApprovalViewSearch.APPROVAL_TYPE_ID == 4) {
            ptopobj.YEAR = new Date(HEADER.BUDGET_DATE == null || HEADER.BUDGET_DATE == '' || HEADER.BUDGET_DATE == undefined ? HEADER.INVOICE_DATE : HEADER.BUDGET_DATE).getFullYear();
            ptopobj.MONTH = new Date(HEADER.BUDGET_DATE == null || HEADER.BUDGET_DATE == '' || HEADER.BUDGET_DATE == undefined ? HEADER.INVOICE_DATE : HEADER.BUDGET_DATE).getMonth() + 1;
            if (FLAG == 2 || FLAG == 3 && $scope.SELECTED_REQ_ALL.OVERALL_STATUS_ID != 39) {//39 pending approved condition
                ptopobj.REFERENCE_ID = 0;
                ptopobj.REFERENCE_TYPE = 0; //BILL
            }
            else { //pending condition
                ptopobj.REFERENCE_ID = LINE.INVOICE_HEADER_ID;
                ptopobj.REFERENCE_TYPE = 2; // BILL
            }
        }
        else {
            ptopobj.YEAR = new Date(HEADER.PO_DATE).getFullYear();
            ptopobj.MONTH = new Date(HEADER.PO_DATE).getMonth() + 1;
            if (FLAG == 2 || FLAG == 3 && $scope.SELECTED_REQ_ALL.OVERALL_STATUS_ID != 39) {//39 pending approved condition
                ptopobj.REFERENCE_ID = 0;
                ptopobj.REFERENCE_TYPE = 0; //PO
            }
            else { //pending condition
                ptopobj.REFERENCE_ID = LINE.PO_HDR_ID == undefined ? 0 : LINE.PO_HDR_ID;
                ptopobj.REFERENCE_TYPE = 1; //PO
            }
        }
        if (HEADER.PROJECT_MASTER_ID == null || HEADER.PROJECT_MASTER_ID == undefined || HEADER.PROJECT_MASTER_ID == "") {
            ptopobj.PROJECT_MASTER_ID = 0;
        } else {
            ptopobj.PROJECT_MASTER_ID = CHANGE_FLAG == 1 ? HEADER.PROJECT_MASTER_ID : HEADER.PROJECT_MASTER_ID;// LINE.PROJECT_MASTER_ID;
        }
        ptopobj.SETTING_45 = $scope.$parent.SETTING_USE_GROSS;
        //ptopobj.PROJECT_MASTER_ID = CHANGE_FLAG == 1 ? HEADER.PROJECT_MASTER_ID : HEADER.PROJECT_MASTER_ID;// LINE.PROJECT_MASTER_ID;
        ptopobj.XERO_ACCOUNTS_FOR_BUDGET = [];
        if (FLAG == 1) {
            angular.forEach($scope.ACTION_ITEM_LIST, function (LINE) {
                var readonlyobj = new Object()
                readonlyobj.ACCOUNT_ID = parseInt(LINE.ACCOUNT_ID);
                readonlyobj.ACCOUNT_DETAILS = LINE.ACCOUNT_DETAILS;
                var alreadyAccount = ptopobj.XERO_ACCOUNTS_FOR_BUDGET.filter(function (x) { return x.ACCOUNT_ID == readonlyobj.ACCOUNT_ID });
                if (alreadyAccount.length == 0) {
                    ptopobj.XERO_ACCOUNTS_FOR_BUDGET.push(readonlyobj);
                }
            });
        }
        if (FLAG == 2) {
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
        if (FLAG == 3) {
            angular.forEach($scope.ALL_ITEM_LIST, function (LINE) {
                var readonlyobj = new Object()
                readonlyobj.ACCOUNT_ID = parseInt(LINE.ACCOUNT_ID);
                readonlyobj.ACCOUNT_DETAILS = LINE.ACCOUNT_DETAILS;
                var alreadyAccount = ptopobj.XERO_ACCOUNTS_FOR_BUDGET.filter(function (x) { return x.ACCOUNT_ID == readonlyobj.ACCOUNT_ID });
                if (alreadyAccount.length == 0) {
                    ptopobj.XERO_ACCOUNTS_FOR_BUDGET.push(readonlyobj);
                }
            });
        }
        if (ptopobj.XERO_ACCOUNTS_FOR_BUDGET.length > 0) {
            PrcCommMethods.P2P_API(ptopobj, 'GET_P2P_BUDGET_BY_ACCOUNTS', 'PO').then(function (data) {
                if (data.data != null && FLAG == 1) { // PR Approval in also use
                    $scope.ApprovalViewSearch.BUDGET_NAME = data.data.BUDGET_NAME;
                    $scope.P2P_BUDGET_MASTER_LIST = data.data.Budget_Account_Data_List;
                }
                else {
                    $scope.BUDGET_TEXT_VALIDATION = "There is no budget allocated in the GL-Account";
                }
                if (data.data != null && FLAG == 2) {
                    $scope.ApprovalViewSearch.BUDGET_NAME = data.data.BUDGET_NAME;
                    $scope.P2P_PROCESS_BUDGET_MASTER_LIST = data.data.Budget_Account_Data_List;
                }
                else {
                    $scope.BUDGET_TEXT_VALIDATION = "There is no budget allocated in the GL-Account";
                }

                if (data.data != null && FLAG == 3) {
                    $scope.ApprovalViewSearch.BUDGET_NAME = data.data.BUDGET_NAME;
                    $scope.P2P_ALL_BUDGET_MASTER_LIST = data.data.Budget_Account_Data_List;
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
    $scope.GET_CURRENCY = function (REQUEST) {
        if ($scope.CURRENCY_LIST.length == 0) {
            var CustmObj = new Object();
            PrcCommMethods.HR_API(CustmObj, 'GET_CURRENCY').then(function (data) {
                if (data.data.Table != undefined) {
                    $scope.CURRENCY_LIST = angular.copy(data.data.Table);
                    var item = data.data.Table.filter(function (x) { return x.CURRENCY_ID == parseInt(REQUEST.PR_CURRENCY_ID) });
                    if (item.length > 0) {
                        REQUEST.PR_CURRENCY_ID = angular.copy(item[0].CURRENCY_ID);
                        REQUEST.CURRENCY_CODE = angular.copy(item[0].CURRENCY_CODE);
                    }
                }
                else {
                    $scope.CURRENCY_LIST = [];
                }
            });
        }
        else {
            var item = $scope.CURRENCY_LIST.filter(function (x) { return x.CURRENCY_ID == parseInt(REQUEST.PR_CURRENCY_ID) });
            if (item.length > 0) {
                REQUEST.PR_CURRENCY_ID = angular.copy(item[0].CURRENCY_ID);
                REQUEST.CURRENCY_CODE = angular.copy(item[0].CURRENCY_CODE);
            }
        }
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

            $scope.IntegrationDetails = data.data.filter(function (x) { return x.IS_OUTBOUND == false })[0];
            if ($scope.IntegrationDetails.INTEGRATION_STATUS == 2) {
                $scope.IntegrationDetails.ShowSyncBtn = true;
                $scope.IntegrationDetails.PageLoad = false;
                $scope.StopResyncInterval();
                if ($scope.TAB_FLAG == 1 && isstart == 2) {
                    $scope.GET_APPROVAL_HEADERS_FOR_APPROVER(1, 1, false, 1);
                }
                else if ($scope.TAB_FLAG == 3 && isstart == 2) {
                    $scope.GET_APPROVAL_HEADERS_FOR_ADMIN(1, 1, false, 1);
                };
            }
            else {
                isstart == 1 ? $scope.StartResyncInterval() : "";
                $scope.IntegrationDetails.PageLoad = false;
                $scope.IntegrationDetails.ShowSyncBtn = false;
            }
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

    $scope.GET_BRANCH_LIST();

    $scope.$on('ngRepeatFinishedActionRender', function (ngRepeatFinishedEvent) {
        // if ($scope.EDIT_REQ_Search.PO_DATE != undefined && $scope.EDIT_REQ_Search.PO_DATE != "" && $scope.EDIT_REQ_Search.PO_DATE != null && $scope.EDIT_REQ_Search.PROJECT_MASTER_ID != undefined && $scope.EDIT_REQ_Search.PROJECT_MASTER_ID != null && $scope.EDIT_REQ_Search.PROJECT_MASTER_ID != "") {
        $scope.GET_P2P_BUDGET_BY_ACCOUNTS(1, $scope.ApprovalViewSearch.REQUEST_DETAILS, $scope.ApprovalViewSearch.REQUEST_DETAILS)

        $scope.Fn_SPLIT_REQ($scope.ApprovalViewSearch.REQUEST_DETAILS, 1);
        if ($scope.INVOICE_PROCESS_SPLIT_LIST.length > 0) {
            $scope.Fn_SPLIT_PROCESS_ALL_OUT_INVOICE($scope.ApprovalViewSearch.REQUEST_DETAILS);
        }

        //}
    });
    $scope.$on('ngRepeatFinishedProcessRender', function (ngRepeatFinishedEvent) {
        //if ($scope.EDIT_REQ_Search.PO_DATE != undefined && $scope.EDIT_REQ_Search.PO_DATE != "" && $scope.EDIT_REQ_Search.PO_DATE != null && $scope.EDIT_REQ_Search.PROJECT_MASTER_ID != undefined && $scope.EDIT_REQ_Search.PROJECT_MASTER_ID != null && $scope.EDIT_REQ_Search.PROJECT_MASTER_ID != "") {
        $scope.GET_P2P_BUDGET_BY_ACCOUNTS(2, $scope.ApprovalViewSearch.PROCESS_REQUEST_DETAILS, $scope.ApprovalViewSearch.PROCESS_REQUEST_DETAILS)
        $scope.Fn_SPLIT_REQ($scope.ApprovalViewSearch.PROCESS_REQUEST_DETAILS, 2);
        if ($scope.INVOICE_PROCESS_SPLIT_LIST.length > 0) {
            $scope.Fn_SPLIT_PROCESS_ALL_OUT_INVOICE($scope.ApprovalViewSearch.PROCESS_REQUEST_DETAILS);
        }
        //}
    });
    $scope.$on('ngRepeatFinishedPoAllRender', function (ngRepeatFinishedEvent) {
        $scope.GET_P2P_BUDGET_BY_ACCOUNTS(3, $scope.ApprovalViewSearch.ALL_REQUEST_DETAILS, $scope.ApprovalViewSearch.ALL_REQUEST_DETAILS)
        $scope.Fn_SPLIT_REQ($scope.ApprovalViewSearch.ALL_REQUEST_DETAILS, 3);
        if ($scope.INVOICE_PROCESS_SPLIT_LIST.length > 0) {
            $scope.Fn_SPLIT_PROCESS_ALL_OUT_INVOICE($scope.ApprovalViewSearch.ALL_REQUEST_DETAILS);
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

    function reportrangeCoverView(startDate, endDate) {
        $scope.PurchaseRequestSearch.START_DATE = startDate.format($scope.$parent.Datelocaleformat.format);
        $scope.PurchaseRequestSearch.END_DATE = endDate.format($scope.$parent.Datelocaleformat.format);
        $('#reportrangeInvRecView span').html(startDate.format($scope.$parent.Datelocaleformat.format) + ' - ' + endDate.format($scope.$parent.Datelocaleformat.format));
        $scope.GET_PURCHASE_REQUEST();
    };
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
    $scope.InitiateItemList = function (PRL, TAB_FLAG) {
        PRL.DESCRIPTION_LIMIT_TO = angular.copy($scope.DESCRIPTION_LIMIT_TO);
        if (TAB_FLAG == 3) {
            PRL.XERO_TRACKING_CATEGORIES = angular.copy($scope.ALL_XERO_TRACKING_CATEGORIES);
            PRL.ACCOUNT_NAME = PRL.ACCOUNT_DETAILS;
        }
        else {
            PRL.XERO_TRACKING_CATEGORIES = angular.copy($scope.XERO_TRACKING_CATEGORIES);
            PRL.ACCOUNT_NAME = PRL.ACCOUNT_DETAILS;
        }

        //if (PRL.ACCOUNT_ID != undefined) {
        //    var XAC = $scope.XERO_ACCOUNT_CODES.filter(function (x) { return x.TABLE_ID == PRL.ACCOUNT_ID });
        //    if (XAC.length > 0) {
        //        PRL.ACCOUNT_DETAILS = XAC[0];
        //    }
        //}
        //if (PRL.TAX_RATE_ID != undefined) {
        //    var TAX = $scope.XERO_TAXES.filter(function (x) { return x.ID == PRL.TAX_RATE_ID });
        //    if (TAX.length > 0) {
        //        PRL.TAX_ID = TAX[0];
        //    }
        //}
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
            if (item.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID > 0 && $scope.ALL_SELECTED_PROCESSED_XERO_TRACKING_CATEGORIES_OPTIONS.length > 0) {
                var Processitemoption = $scope.ALL_SELECTED_PROCESSED_XERO_TRACKING_CATEGORIES_OPTIONS.filter(p => p.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID == item.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID && PRL.PO_LINE_ID == p.PO_LINE_ID)[0];
                if (Processitemoption != undefined && Processitemoption != null) {
                    var Protext = $scope.ALL_XERO_TRACKING_CATEGORIES_OPTIONS.filter(function (x) { return x.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID == Processitemoption.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID && x.APPROVAL_CHAIN_CUSTOM_FIELD_OPTIONS_MASTER_ID == Processitemoption.APPROVAL_CHAIN_CUSTOM_FIELD_OPTIONS_MASTER_ID });
                    item.SELECTED_CATEGORY_OPTION = Protext[0];
                }
            }
        }
    }
    $scope.InitiateBillItemList = function (PRL) {
        PRL.DESCRIPTION_LIMIT_TO = angular.copy($scope.DESCRIPTION_LIMIT_TO);
        PRL.SELECTED_OPTION_LIST_MASTER = angular.copy($scope.SELECTED_OPTION_LIST_MASTER);
        PRL.ACCOUNT_NAME = PRL.ACCOUNT_DETAILS;
        //if (PRL.ACCOUNT_ID != undefined) {
        //    var XAC = $scope.XERO_ACCOUNT_CODES.filter(function (x) { return x.TABLE_ID == PRL.ACCOUNT_ID });
        //    if (XAC.length > 0) {
        //        PRL.ACCOUNT_DETAILS = XAC[0];
        //    }
        //}
        //if (PRL.TAX_RATE_ID != undefined) {
        //    var TAX = $scope.XERO_TAXES.filter(function (x) { return x.ID == PRL.TAX_RATE_ID });
        //    if (TAX.length > 0) {
        //        PRL.TAX_ID = TAX[0];
        //    }
        //}


    }
    $scope.InitiateXeroTrackingBillCategories = function (item, Trackingcat_index, PRL, FLAG) {
        if (item.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID > 0 && $scope.SELECTED_OPTION_LIST.length > 0) {
            var select_cat = $scope.SELECTED_OPTION_LIST.filter(p => p.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID == item.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID && PRL.PO_LINE_ID == p.PO_LINE_ID)[0];
            if (select_cat != undefined && select_cat != null) {
                var text = $scope.SELECTED_OPTION_LIST_MASTER.filter(function (x) { return x.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID == select_cat.APPROVAL_CHAIN_CUSTOM_FIELDS_MASTER_ID && x.APPROVAL_CHAIN_CUSTOM_FIELD_OPTIONS_MASTER_ID == select_cat.APPROVAL_CHAIN_CUSTOM_FIELD_OPTIONS_MASTER_ID });
                item.SELECTED_CATEGORY_OPTION = text[0];
            }
        }
    }
    $scope.InginitQuotation = function (item) {
        item.IS_MULTI_FILE_UPLOAD_ALLOW = true;
        if (item != undefined && item.TABLE_ID > 0) {
            if (item.UploadedFiles == undefined) {
                item.UploadedFiles = [];
            }
            $scope.$parent.GET_UPLOADS(item, 35, item.TABLE_ID);
        }
    };

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
        INVOICE_LINE.IS_DROP_DOWN_SHOW = true;
        INVOICE_LINE.ACCOUNT_MATCH = true;
        INVOICE_LINE.MATCHES = [];
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
            });
        }
    }
    $scope.Inittotalreq = function (parm_line, parm_m, index) {
        parm_line.TOTAL_BUDGET = 0;
        var linedetail = [];
        angular.forEach($scope.MONTH_LIST, function (_m, index) {
            linedetail = linedetail.concat(_m.ITEM_LIST.filter(function (x) { return x.LINE_NO == parm_line.LINE_NO }));
        });
        $scope.MONTH_LIST[$scope.MONTH_LIST.length - 1].ITEM_LIST[parm_line.ITEM_INDEX].TOTAL_BUDGET = angular.copy($filter('sumOfValue')(linedetail, 'BUDGET'));
        $scope.REM_AMOUNT_LEFT = parseFloat($scope.MONTH_LIST[$scope.MONTH_LIST.length - 1].ITEM_LIST[parm_line.ITEM_INDEX].TOTAL_BUDGET).toFixed(2);

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
        if ($scope.TAB_FLAG == 1) {
            $scope.ACCOUNT_PROCESS_ALL_ITEMDETAIL = itemdetail.filter(function (_m) { return new Date($scope.ApprovalViewSearch.REQUEST_DETAILS.BUDGET_DATE).getMonth() == new Date(_m.INVOICE_DATE).getMonth() && new Date($scope.ApprovalViewSearch.REQUEST_DETAILS.BUDGET_DATE).getFullYear() == new Date(_m.INVOICE_DATE).getFullYear() })
        }
        else if ($scope.TAB_FLAG == 2) {
            $scope.ACCOUNT_PROCESS_ALL_ITEMDETAIL = itemdetail.filter(function (_m) { return new Date($scope.ApprovalViewSearch.PROCESS_REQUEST_DETAILS.BUDGET_DATE).getMonth() == new Date(_m.INVOICE_DATE).getMonth() && new Date($scope.ApprovalViewSearch.REQUEST_DETAILS.BUDGET_DATE).getFullYear() == new Date(_m.INVOICE_DATE).getFullYear() })
        }
        else if ($scope.TAB_FLAG == 3) {
            $scope.ACCOUNT_PROCESS_ALL_ITEMDETAIL = itemdetail.filter(function (_m) { return new Date($scope.ApprovalViewSearch.ALL_REQUEST_DETAILS.BUDGET_DATE).getMonth() == new Date(_m.INVOICE_DATE).getMonth() && new Date($scope.ApprovalViewSearch.ALL_REQUEST_DETAILS.BUDGET_DATE).getFullYear() == new Date(_m.INVOICE_DATE).getFullYear() })
        }
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

        $scope.CONDITIONAL_ITEM_LIST = $scope.TAB_FLAG == 1 ? angular.copy($scope.ACTION_ITEM_LIST) : $scope.TAB_FLAG == 2 ? angular.copy($scope.PROCESS_REQUEST_ITEMS_LIST) : angular.copy($scope.ALL_ITEM_LIST);
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
    $scope.PR_VALIDATION_CLICK_FY = function (APPROVE_REJECT_FLAG) {
        if (APPROVE_REJECT_FLAG != 38) {
            $scope.RequestUpdForm.submitted = true;
        };
        if ($scope.RequestUpdForm.$valid || APPROVE_REJECT_FLAG == 38) {
            var Accountlist = $scope.XERO_ACCOUNT_CODES.filter(function (x) { return x.CODE + ' - ' + x.NAME == $scope.PurchaseRequestSearch.ACCOUNT_DETAILS });
            if (Accountlist.length == 0 && APPROVE_REJECT_FLAG != 38) {
                $scope.$parent.ShowAlert("Error", "Please select valid GL Account", 2000);
                $scope.RequestUpdForm.submitted = false;
            }
            else {
                $scope.ApprovalViewSearch.APPROVE_REJECT_FLAG = APPROVE_REJECT_FLAG;
                $('#Approved_Reject_POP').modal('show');
                $scope.ALLOW_SUBMIT = false;
                if ($scope.OTP_VALID_CHECK == '1' && $scope.NXT_APPROVAL_HEADER_STATUS_ID == '') {
                    $scope.ApprovalViewSearch.digit1 = "";
                    $scope.ApprovalViewSearch.digit2 = "";
                    $scope.ApprovalViewSearch.digit3 = "";
                    $scope.ApprovalViewSearch.digit4 = "";
                    $scope.ApprovalViewSearch.digit5 = "";
                    $scope.ApprovalViewSearch.digit6 = "";
                    $scope.ALLOW_SUBMIT = true;
                    $scope.GENERATE_APPROVAL_OTP();
                }
            }
        }
        else {
            $scope.$parent.ShowAlert("Error", "Please provide the mandatory details to submit(marked in red)", 2000);
        }
    }
    $scope.PR_VALIDATION_FORCE_CLICK_FY = function (APPROVE_REJECT_FLAG, ACTIVE_TAB_APPROVAL_PROCESS) {
        if (APPROVE_REJECT_FLAG != 38) {
            $scope.RequestUpdForm.submitted = true;
        }
        if ($scope.RequestUpdForm.$valid || APPROVE_REJECT_FLAG == 38) {
            var Accountlist = $scope.XERO_ACCOUNT_CODES.filter(function (x) { return x.CODE + ' - ' + x.NAME == $scope.PurchaseRequestSearch.ACCOUNT_DETAILS });
            if (Accountlist.length == 0 && APPROVE_REJECT_FLAG != 38) {
                $scope.$parent.ShowAlert("Error", "Please select valid GL Account", 2000);
                $scope.RequestUpdForm.submitted = false;
            }
            else {
                $scope.ApprovalViewSearch.APPROVE_REJECT_FROCE_FLAG = APPROVE_REJECT_FLAG;
                $scope.ACTIVE_TAB_APPROVAL_PROCESS = ACTIVE_TAB_APPROVAL_PROCESS;
                var UnselectedInvCnt = 0, SelectedInvCnt = 0, rowcount = 0;
                $('#Approved_Reject_FROCE_POP').modal('show');
                $scope.ALLOW_FORCE_SUBMIT = false;
                if ($scope.OTP_VALID_CHECK == '1' && $scope.NXT_APPROVAL_HEADER_STATUS_ID == '') {
                    $scope.ApprovalViewSearch.digit1 = "";
                    $scope.ApprovalViewSearch.digit2 = "";
                    $scope.ApprovalViewSearch.digit3 = "";
                    $scope.ApprovalViewSearch.digit4 = "";
                    $scope.ApprovalViewSearch.digit5 = "";
                    $scope.ApprovalViewSearch.digit6 = "";
                    $scope.ALLOW_FORCE_SUBMIT = true;
                    $scope.GENERATE_APPROVAL_OTP();
                }
                $scope.ApprovalForceForm.submitted = false;
            }
        }
    }
    $scope.VALIDATION_CLICK_FY = function (APPROVE_REJECT_FLAG) {
        var IS_VALID = true
        if ($scope.ApprovalViewSearch.APPROVAL_TYPE_ID == 4 && APPROVE_REJECT_FLAG == 37) {
            if ($scope.MAPPED_LIST.length == 0) {
                //IS_VALID = false;
                // $scope.$parent.ShowAlert('Warning', 'Edit Matching Invoice line to PO line is not completed,Please click edit matching', 3000);
            }
            if ($scope.MAPPED_LIST.filter(function (x) { return x.TABLE_ID > 0 }).length != $scope.MAPPED_LIST.length) {
                IS_VALID = false;
                $scope.$parent.ShowAlert('Error', 'Please Save your PO and Bill line matching before Approving', 3000);
            }
            //else if ($scope.ACTION_ITEM_LIST.filter(function (x) { return x.IS_DROP_DOWN_SHOW }).length > 0) {
            //    IS_VALID = false;
            //    $scope.$parent.ShowAlert('Error', 'Edit Matching Invoice line to PO line is incomplete,Please complete the edit matching process', 3000);
            //}
            else if ($scope.MAPPED_LIST.length > 0 && $scope.ACTION_ITEM_LIST.filter(function (x) { return x.ACCOUNT_MATCH }).length != $scope.ACTION_ITEM_LIST.length && $scope.ApprovalViewSearch.REQUEST_DETAILS.USE_INVOICE_GL != true) {
                IS_VALID = false;
                $scope.$parent.ShowAlert('Error', 'The Invoice line GL Account is not matching the purchase order line GL Account', 3000);
            };
        }
        if (IS_VALID) {
            $scope.ApprovalViewSearch.APPROVE_REJECT_FLAG = APPROVE_REJECT_FLAG;
            $('#Approved_Reject_POP').modal('show');
            $scope.ALLOW_SUBMIT = false;
            if ($scope.OTP_VALID_CHECK == '1' && $scope.NXT_APPROVAL_HEADER_STATUS_ID == '') {
                $scope.ApprovalViewSearch.digit1 = "";
                $scope.ApprovalViewSearch.digit2 = "";
                $scope.ApprovalViewSearch.digit3 = "";
                $scope.ApprovalViewSearch.digit4 = "";
                $scope.ApprovalViewSearch.digit5 = "";
                $scope.ApprovalViewSearch.digit6 = "";
                $scope.ALLOW_SUBMIT = true;
                $scope.GENERATE_APPROVAL_OTP();
            }
        }
    }
    $scope.VALIDATION_FORCE_CLICK_FY = function (APPROVE_REJECT_FLAG, ACTIVE_TAB_APPROVAL_PROCESS) {
        $scope.ApprovalViewSearch.APPROVE_REJECT_FROCE_FLAG = APPROVE_REJECT_FLAG;
        $scope.ACTIVE_TAB_APPROVAL_PROCESS = ACTIVE_TAB_APPROVAL_PROCESS;
        var IS_VALID = true
        var Linecount = 0, AccountMatchCount = 0, EDIT_MATCHING = 0;
        if ($scope.ApprovalViewSearch.APPROVAL_TYPE_ID == 4 && APPROVE_REJECT_FLAG == 37) {
            //if ($scope.MAPPED_LIST.length == 0) {
            //    EDIT_MATCHING = 1;
            //    IS_VALID = false;
            //    $scope.$parent.ShowAlert('Error', 'Edit Matching Invoice line to PO line is not completed,Please click edit matching', 3000);
            //}
            if ($scope.MAPPED_LIST.filter(function (x) { return x.TABLE_ID > 0 }).length != $scope.MAPPED_LIST.length) {
                IS_VALID = false;
                Linecount = 1;
                $scope.$parent.ShowAlert('Error', 'Before approving save the line matching details', 3000);
            }
            //else if ($scope.TAB_FLAG == 1 && $scope.ACTION_ITEM_LIST.filter(function (x) { return x.ACCOUNT_MATCH }).length != $scope.ACTION_ITEM_LIST.length && $scope.ApprovalViewSearch.REQUEST_DETAILS.USE_INVOICE_GL != true) {
            //    IS_VALID = false;
            //    AccountMatchCount = 1;
            //    $scope.$parent.ShowAlert('Error', 'The Invoice line GL Account is not matching the purchase order line GL Account', 3000);
            //}
            else if ($scope.MAPPED_LIST.length > 0 && $scope.TAB_FLAG == 3 && $scope.ALL_ITEM_LIST.filter(function (x) { return x.ACCOUNT_MATCH }).length != $scope.ALL_ITEM_LIST.length && $scope.ApprovalViewSearch.ALL_REQUEST_DETAILS.USE_INVOICE_GL != true) {
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
                $scope.ApprovalViewSearch.digit1 = "";
                $scope.ApprovalViewSearch.digit2 = "";
                $scope.ApprovalViewSearch.digit3 = "";
                $scope.ApprovalViewSearch.digit4 = "";
                $scope.ApprovalViewSearch.digit5 = "";
                $scope.ApprovalViewSearch.digit6 = "";
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
        ModelObj.APPROVAL_HEADER_ID = $scope.ApprovalViewSearch.APPROVAL_HEADER_ID;
        ModelObj.USER_ID = parseInt($cookies.get("USERID"));
        var digist = $scope.ApprovalViewSearch.digit1 + $scope.ApprovalViewSearch.digit2 + $scope.ApprovalViewSearch.digit3 + $scope.ApprovalViewSearch.digit4 + $scope.ApprovalViewSearch.digit5 + $scope.ApprovalViewSearch.digit6
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
        ModelObj.APPROVAL_HEADER_ID = $scope.ApprovalViewSearch.APPROVAL_HEADER_ID;
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
            $scope.GET_PROJECT_MASTER($scope.ApprovalViewSearch.REQUEST_DETAILS);
        }
        else if ($scope.TAB_FLAG == 3) {
            $scope.GET_PROJECT_MASTER($scope.ApprovalViewSearch.ALL_REQUEST_DETAILS);
        };

        $scope.project_form.submitted = false;
    }
    $scope.EDIT_REQ_PO_APPROVER_BTN = function (FLAG) {
        $scope.$parent.overlay_loadingNew = 'block';
        $('#EDIT_REQ').modal('show');
        if (FLAG == 1) {
            $scope.Edit_REQ_childScope.PAGE_LOAD_EDIT_REQ($scope.ApprovalViewSearch.REQUEST_DETAILS, 1, 'IS_APPROVER', $scope.SELECTED_REQ, FLAG);
        }
        else if (FLAG == 3) {
            $scope.Edit_REQ_childScope.PAGE_LOAD_EDIT_REQ($scope.ApprovalViewSearch.ALL_REQUEST_DETAILS, 1, 'IS_APPROVER', $scope.SELECTED_REQ_ALL, FLAG);
        }
        $scope.$parent.COMMON_CODE_CHANGE();
    }

    $scope.CHANGE_PROJECT_fn = function () {
        $scope.PurchaseRequestSearch.ACCOUNT_DETAILS = null;
        $scope.GET_XERO_ACCOUNT_CODES($scope.PurchaseRequestSearch);
    }
    $scope.CHANGE_BUDGET_fn = function (HEADER, FLAG, LOAD_FLAG) {
        $scope.P2P_BUDGET_MASTER_LIST = [];
        if ($scope.PurchaseRequestSearch.ACCOUNT_DETAILS !== "" && $scope.PurchaseRequestSearch.ACCOUNT_DETAILS !== null && $scope.PurchaseRequestSearch.ACCOUNT_DETAILS !== undefined) {
            $scope.ApprovalViewSearch.PO_DATE = new Date($scope.PurchaseRequestSearch.PR_CREATED_DATE);
            $scope.ApprovalViewSearch.PROJECT_MASTER_ID = $scope.PurchaseRequestSearch.PROJECT_MASTER_ID;
            var Accountlist = $scope.XERO_ACCOUNT_CODES.filter(function (x) { return x.CODE + ' - ' + x.NAME == $scope.PurchaseRequestSearch.ACCOUNT_DETAILS });
            if (Accountlist.length > 0) {
                $scope.BUDGET_TEXT_VALIDATION = "Fetching Budget...";
                if (FLAG == 1) {
                    $scope.ACTION_ITEM_LIST[0].ACCOUNT_ID = Accountlist[0].TABLE_ID;
                    $scope.ACTION_ITEM_LIST[0].ACCOUNT_DETAILS = $scope.PurchaseRequestSearch.ACCOUNT_DETAILS;
                    $scope.GET_P2P_BUDGET_BY_ACCOUNTS(1, $scope.ApprovalViewSearch.REQUEST_DETAILS, $scope.ApprovalViewSearch);
                }
                else if (FLAG == 2) {
                    $scope.GET_P2P_BUDGET_BY_ACCOUNTS(2, $scope.ApprovalViewSearch.PROCESS_REQUEST_DETAILS, $scope.ApprovalViewSearch);
                }
                else if (FLAG == 3 || FLAG == 'ALL') {
                    $scope.P2P_ALL_BUDGET_MASTER_LIST = [];
                    $scope.ALL_ITEM_LIST[0].ACCOUNT_ID = Accountlist[0].TABLE_ID;
                    $scope.ALL_ITEM_LIST[0].ACCOUNT_DETAILS = $scope.PurchaseRequestSearch.ACCOUNT_DETAILS;
                    $scope.GET_P2P_BUDGET_BY_ACCOUNTS(3, $scope.ApprovalViewSearch.ALL_REQUEST_DETAILS, $scope.ApprovalViewSearch);
                }
            }
        }
        else {
            if (FLAG == 1 || FLAG == 3 || FLAG == 'ALL') {

            }
            $scope.BUDGET_TEXT_VALIDATION = "Please Select Account to Show Budget";
            // $scope.$parent.ShowAlert("Attention", "Please Select Account to Show Budget", 2000);
        }
    }

    $scope.SetAccountPRValues = function () {
        $('.AddCustomScroll_Account').find('.dropdown-menu').addClass('w-100 custom-scrollbar');
    }

    $scope.RESEND_GENERATE_APPROVAL_OTP = function () {
        $scope.MESSAGE_OTP = "";
        $scope.MESSAGE_OTP_SEND = "";
        var ModelObj = new Object();
        ModelObj.APPROVAL_HEADER_ID = $scope.ApprovalViewSearch.APPROVAL_HEADER_ID;
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
        $scope.ApprovalForm.submitted = true;
        if ($scope.ApprovalForm.$valid) {
            var errorCnt = 0;
            var IS_ALLOW;
            if (errorCnt == 1) {
                IS_ALLOW = confirm("You have not selected any invoice to approve, Are you sure you want to reject all invoices?");
            }
            else {
                IS_ALLOW = confirm('Are you sure you want to proceed?');
            }
            if (IS_ALLOW) {
                $scope.GET_APPROVAL_HEADERS_CHAIN($scope.SELECTED_REQ, 2);
            }
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
        $scope.$parent.DELETE_UPLOAD_ALL($scope.ApprovalViewSearch.REQUEST_DETAILS, LINE, index, 2);
    }
    $scope.REMOVE_INVOICE_IN_FILTE_ALL = function (index, LINE) {
        $scope.$parent.DELETE_UPLOAD_ALL($scope.ApprovalViewSearch.ALL_REQUEST_DETAILS, LINE, index, 2);
    }
    $scope.CLOSE_PDF = function () {
        document.getElementById("MATCH_LINE").style.zIndex = "-1";
        document.getElementById("MATCH_LINE").style.width = "0%";
    }
    $scope.OPEN_ASIDE = function () { }
    $scope.POP_UPD_PURCHASE_REQUEST_BY_APPROVER = function (FLAG) {
        //   $('#Edit_Acount').modal('show');
        $scope.PurchaseRequestSearch = {};
        $scope.CLICK_FLAG = "";
        if (FLAG == 'ALL') {
            $scope.CLICK_FLAG = FLAG;
            $scope.PurchaseRequestSearch = angular.copy($scope.ApprovalViewSearch.ALL_REQUEST_DETAILS);
        } else if (FLAG == 2) {
            $scope.CLICK_FLAG = FLAG;
            $scope.PurchaseRequestSearch = angular.copy($scope.ApprovalViewSearch.PROCESS_REQUEST_DETAILS);
        } else {
            $scope.PurchaseRequestSearch = angular.copy($scope.ApprovalViewSearch.REQUEST_DETAILS);
        }
        $scope.GET_PROJECT_MASTER($scope.PurchaseRequestSearch);
        $scope.GET_XERO_ACCOUNT_CODES($scope.PurchaseRequestSearch, FLAG);
        $scope.RequestUpdForm.submitted = false;
    };

    $scope.INS_UPD_APPROVERS_IN_APPROVAL_CHAIN = function () {
        $scope.SchInvoiceForm.submitted = true;
        if ($scope.SchInvoiceForm.$valid) {
            var PaymentModelObj = new Object();
            PaymentModelObj.APPROVAL_HEADER_ID = $scope.ApprovalViewSearch.APPROVAL_HEADER_ID;
            PaymentModelObj.APPROVERS_TYPE = [];
            var apprrovalerror = 0;
            angular.forEach($scope.NEW_APPROVAL_HEADERS_CHAIN_LIST, function (approver) {
                approver.apprrovalerror = 0;
                var ready = new Object();
                var DuplicateApprover = [];
                var Applist = $scope.PYMNT_APPROVERS_LIST.filter(function (x) { return x.NAME == approver.APPROVER_NAME })
                if (Applist.length > 0) {
                    approver.APPROVER_ID = Applist[0].USER_ID;
                    if (PaymentModelObj.APPROVERS_TYPE.length > 0) {
                        DuplicateApprover = PaymentModelObj.APPROVERS_TYPE.filter(function (x) { return x.APPROVER_ID == Applist[0].USER_ID })
                    }
                    if (DuplicateApprover.length > 0) {
                        apprrovalerror = 2;
                        approver.apprrovalerror = 2;
                    }
                }
                else {
                    approver.APPRROVAL_ERROR = 1;
                    apprrovalerror = 1;
                    approver.apprrovalerror = 1;
                }
                ready.APPROVAL_HEADER_STATUS_ID = approver.APPROVAL_HEADER_STATUS_ID == undefined ? 0 : approver.APPROVAL_HEADER_STATUS_ID;
                ready.APPROVER_ID = approver.APPROVER_ID;
                ready.APP_SORT_SEQUENCE = approver.APP_SORT_SEQUENCE;
                ready.GROUP_SORT_SEQUENCE = approver.GROUP_SORT_SEQUENCE == undefined || approver.GROUP_SORT_SEQUENCE == "" ? null : approver.GROUP_SORT_SEQUENCE;
                ready.HEADER_SORT_SEQUENCE = approver.HEADER_SORT_SEQUENCE == undefined || approver.HEADER_SORT_SEQUENCE == "" ? null : approver.HEADER_SORT_SEQUENCE;
                ready.APPROVAL_CHAIN_HEADER_ID = approver.APPROVAL_CHAIN_HEADER_ID == undefined || approver.APPROVAL_CHAIN_HEADER_ID == "" ? null : approver.APPROVAL_CHAIN_HEADER_ID;
                ready.APPROVAL_CHAIN_GROUP_ID = approver.APPROVAL_CHAIN_GROUP_ID == undefined || approver.APPROVAL_CHAIN_GROUP_ID == "" ? null : approver.APPROVAL_CHAIN_GROUP_ID;
                PaymentModelObj.APPROVERS_TYPE.push(ready);
            });

            PaymentModelObj.USER_ID = parseInt($cookies.get("USERID"));
            if (apprrovalerror == 0) {
                if (confirm('Are you sure? you want to submit')) {
                    $scope.$parent.overlay_loadingNew = 'block';
                    PrcCommMethods.PAYMENT_API(PaymentModelObj, 'INS_UPD_APPROVERS_IN_APPROVAL_CHAIN').then(function (data) {
                        if (data.data == 1) {
                            $scope.NEW_APPROVAL_HEADERS_CHAIN_LIST = [];
                            //$scope.GET_APPROVAL_HEADERS_CHAIN();
                            $scope.$parent.ShowAlert('Succces', 'Approver(s) Added Successfully', 3000);
                            $('#Edit_Approvers').modal('hide');
                        }
                        if (data.data == 0) {
                            $scope.$parent.ShowAlert('Error', $scope.SOMETHINGWENTWRONG, 3000);
                        }
                    });
                }
                else {
                }
            }
            else {
                if (apprrovalerror == 1) {
                    $scope.$parent.ShowAlert('Error', "Invalid Approver", 5000);
                }
                if (apprrovalerror == 2) {
                    $scope.$parent.ShowAlert('Error', "please remove duplicate approver", 5000);
                }
                $scope.$parent.overlay_loadingNew = 'none';
            }
        }
    };
    $scope.UPD_PURCHASE_REQUEST_BY_APPROVER = function (APPROVE_REJECT_FLAG, P2P_BUDGET_SNAPSHOT_TYPE) {
        $scope.RequestUpdForm.submitted = true;
        if ($scope.RequestUpdForm.$valid) {
            var count = 0;
        }
        if ($scope.RequestUpdForm.$valid) {
            //   if (count == 0 && confirm('Are you sure you want to update ?')) {
            var Accountlist = $scope.XERO_ACCOUNT_CODES.filter(function (x) { return x.CODE + ' - ' + x.NAME == $scope.PurchaseRequestSearch.ACCOUNT_DETAILS });
            var ModelObj = new Object();
            $('#Edit_Acount').modal('hide');
            ModelObj.PR_PURCHASE_REQUEST_ID = $scope.PurchaseRequestSearch.REQUEST_ID;
            ModelObj.QUANTITY = $scope.PurchaseRequestSearch.QUANTITY;
            ModelObj.EXPECTED_PRICE = $scope.PurchaseRequestSearch.APPROVER_EXPECTED_PRICE;
            ModelObj.PROJECT_MASTER_ID = $scope.PurchaseRequestSearch.PROJECT_MASTER_ID;
            ModelObj.ACCOUNT_ID = Accountlist[0].TABLE_ID;
            ModelObj.ACCOUNT_DETAILS = $scope.PurchaseRequestSearch.ACCOUNT_DETAILS;
            ModelObj.USER_ID = parseInt($cookies.get("USERID"));
            ModelObj.P2P_BUDGET_SNAPSHOT_TYPE = [];
            angular.forEach($scope.P2P_ALL_BUDGET_MASTER_LIST, function (val) {
                angular.forEach(val.BUDGET_DETAILS_LIST, function (item) {
                    var ReadOnlyApproval = new Object();
                    ReadOnlyApproval.APPROVAL_HEADER_ID = $scope.ApprovalViewSearch.APPROVAL_HEADER_ID;
                    ReadOnlyApproval.APPROVAL_HEADER_STATUS_ID = $scope.ApprovalViewSearch.ALL_REQUEST_DETAILS.STATUS_ID;
                    ReadOnlyApproval.ACCOUNT_ID = val.ACCOUNT_ID;
                    ReadOnlyApproval.YTD = item.LINE_ID == 2 ? 1 : 0;
                    ReadOnlyApproval.TOTAL = parseFloat(item.TOTAL).toFixed(5);
                    ReadOnlyApproval.REMAINING = parseFloat(item.REMAINING_AMOUNT).toFixed(5);
                    ReadOnlyApproval.CONSUMED = parseFloat(item.CONSUMED).toFixed(5);
                    ReadOnlyApproval.BOOKED = parseFloat(item.BOOKED).toFixed();
                    ReadOnlyApproval.CURRENT = item.CURRENT_PO_CUSTOM == undefined || item.CURRENT_PO_CUSTOM == null || item.CURRENT_PO_CUSTOM == "" ? 0 : parseFloat(item.CURRENT_PO_CUSTOM).toFixed(5);
                    ReadOnlyApproval.OVER_BUDGET = parseFloat(item.REMAINING_AMOUNT).toFixed(5) < 0 ? 1 : 0;
                    ReadOnlyApproval.PERIOD = item.PERIOD;
                    ReadOnlyApproval.ACCOUNT_DETAILS = val.GLACCOUNT_NAME;
                    ReadOnlyApproval.CREDIT_MEMO = parseFloat(item.MEMO).toFixed(5);
                    ModelObj.P2P_BUDGET_SNAPSHOT_TYPE.push(ReadOnlyApproval);
                });
            });
            if (ModelObj.P2P_BUDGET_SNAPSHOT_TYPE.length == 0) {
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
                ModelObj.P2P_BUDGET_SNAPSHOT_TYPE.push(ReadOnlyApproval);
            }
            ModelObj.SETTING_45 = $scope.$parent.SETTING_USE_GROSS;
            PrcCommMethods.P2P_API(ModelObj, 'UPD_PURCHASE_REQUEST_BY_APPROVER', 'PO').then(function (data) {
                $('#Edit_Acount').modal('hide');
                if (data.data != undefined && data.data == 0) {
                    $scope.$parent.ShowAlert('Error', $scope.$parent.SOMETHINGWENTWRONG, 5000);
                }
                if (data.data != undefined && data.data == 1) {
                    //  $scope.$parent.ShowAlert('Success', 'updated successfully', 5000);

                    if ($scope.CLICK_FLAG == "ALL") {
                        $scope.GET_PURCHASE_REQUEST_BY_ID($scope.ApprovalViewSearch.ALL_REQUEST_DETAILS, 3)
                    }
                    else {
                        $scope.GET_PURCHASE_REQUEST_BY_ID($scope.ApprovalViewSearch.REQUEST_DETAILS, 1)
                    }
                }
            });
            //}
        }
    }
    $scope.INS_UPD_INVOICES = function (INVOICE_SYNC_LINE) {
        if (confirm('Are you sure you want to sync GL Account?')) {
            var ptopobj = new Object();
            ptopobj.INVOICE_HEADER_ID = $scope.ApprovalViewSearch.REQUEST_DETAILS.INVOICE_HEADER_ID;
            ptopobj.INVOICE_NUMBER = $scope.ApprovalViewSearch.REQUEST_DETAILS.INVOICE_NUMBER;
            ptopobj.REFERENCE = $scope.ApprovalViewSearch.REQUEST_DETAILS.REFERENCE;
            ptopobj.INVOICE_TYPE_ID = $scope.ApprovalViewSearch.REQUEST_DETAILS.INVOICE_TYPE_ID;
            ptopobj.CONTACT_ID = $scope.ApprovalViewSearch.REQUEST_DETAILS.CONTACT_ID;
            ptopobj.INVOICE_DATE = $scope.ApprovalViewSearch.REQUEST_DETAILS.INVOICE_DATE;
            ptopobj.DUE_DATE = $scope.ApprovalViewSearch.REQUEST_DETAILS.DUE_DATE;
            ptopobj.TAX_TYPE = $scope.ApprovalViewSearch.REQUEST_DETAILS.TAX_TYPE;
            ptopobj.NET_AMOUNT = parseFloat($scope.ApprovalViewSearch.REQUEST_DETAILS.NET_AMOUNT).toFixed(5); //NET;
            ptopobj.TAX_AMOUNT = parseFloat($scope.ApprovalViewSearch.REQUEST_DETAILS.TAX_AMOUNT).toFixed(5);//TAX;
            ptopobj.TOTAL_AMOUNT = parseFloat($scope.ApprovalViewSearch.REQUEST_DETAILS.TOTAL_AMOUNT).toFixed(5);//NET+TAX;
            ptopobj.TOTAL_DISCOUNT = parseFloat($scope.ApprovalViewSearch.REQUEST_DETAILS.TOTAL_DISCOUNT).toFixed(5);//NET+TAX;
            ptopobj.INVOICE_CURRENCY_ID = $scope.ApprovalViewSearch.REQUEST_DETAILS.CURRENCY_ID;
            ptopobj.BASE_CURRENCY_ID = $scope.ApprovalViewSearch.REQUEST_DETAILS.BASE_CURRENCY_ID;
            if ($scope.ApprovalViewSearch.REQUEST_DETAILS.CURRENCY_ID != $scope.ApprovalViewSearch.REQUEST_DETAILS.BASE_CURRENCY_ID) { ptopobj.BASE_TO_INVOICE_CONVERSION_RATE = $scope.ApprovalViewSearch.REQUEST_DETAILS.BASE_TO_INVOICE_CONVERSION_RATE; }
            else { ptopobj.BASE_TO_INVOICE_CONVERSION_RATE = 1; }
            ptopobj.XERO_BRANDING_THEME_ID = $scope.ApprovalViewSearch.REQUEST_DETAILS.XERO_BRANDING_THEME_ID == undefined ? null : $scope.ApprovalViewSearch.REQUEST_DETAILS.XERO_BRANDING_THEME_ID;
            ptopobj.XERO_INVOICE_ID = $scope.ApprovalViewSearch.REQUEST_DETAILS.XERO_INVOICE_ID;
            ptopobj.IS_DRAFT = 0;
            ptopobj.UPLOAD_IDS = "";
            angular.forEach($scope.ApprovalViewSearch.REQUEST_DETAILS.UploadedFiles, function (x) {
                if (ptopobj.UPLOAD_IDS == "") { ptopobj.UPLOAD_IDS = x.ID; }
                else { ptopobj.UPLOAD_IDS = ptopobj.UPLOAD_IDS + "," + x.ID; }
            });
            ptopobj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            ptopobj.BRANCH_ID = $scope.ApprovalViewSearch.REQUEST_DETAILS.BRANCH_ID;
            ptopobj.USER_ID = parseInt($cookies.get("USERID"));
            ptopobj.INTEGRATION_SYSTEM_ID = null;
            ptopobj.PROJECT_MASTER_ID = $scope.ApprovalViewSearch.REQUEST_DETAILS.PROJECT_MASTER_ID == 0 ? null : $scope.ApprovalViewSearch.REQUEST_DETAILS.PROJECT_MASTER_ID;
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

    $scope.SELECTED_MATCH_PO = function (FLAG) {
        $scope.MATCH_DIV_SHOW = true;
        $('#Edit_Matching').modal('hide');
    };
    $scope.INS_UPD_INVOICE_PO_MAPPING = function (FLAG) {
        var ALL_AND_ACTION = "";
        var ITEM_LIST = [];
        if (FLAG == 1) {
            ALL_AND_ACTION = $scope.ApprovalViewSearch.REQUEST_DETAILS;
            ITEM_LIST = $scope.ACTION_ITEM_LIST;
        }
        else if (FLAG == 2) {
            ALL_AND_ACTION = $scope.ApprovalViewSearch.ALL_REQUEST_DETAILS;
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
            if (confirm('Are you sure you want to Save the changes?')) {
                var ModelObj = new Object();
                $('#Edit_Matching').modal('hide');
                ModelObj.INVOICE_HEADER_ID = ALL_AND_ACTION.INVOICE_HEADER_ID;
                ModelObj.USER_ID = parseInt($cookies.get("USERID"));
                ModelObj.INVOICE_TO_PO_MAPPING = [];
                ///GET_INVOICE_PO_MAPPING last two param
                ModelObj.TYPE = 1;// --1 FOR INVOICE AND 2 FOR PO
                ModelObj.REFERENCE_ID = ALL_AND_ACTION.INVOICE_HEADER_ID;
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
            ALL_AND_ACTION = $scope.ApprovalViewSearch.REQUEST_DETAILS;
            ITEM_LIST = $scope.ACTION_ITEM_LIST;
        }
        else if (CLICK_FLAG == 2) {
            ALL_AND_ACTION = $scope.ApprovalViewSearch.ALL_REQUEST_DETAILS;
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
                    ModelObj.INVOICE_HEADER_ID = $scope.ApprovalViewSearch.REQUEST_DETAILS.INVOICE_HEADER_ID;
                }
                else if ($scope.TAB_FLAG == 3) {
                    ModelObj.INVOICE_HEADER_ID = $scope.ApprovalViewSearch.ALL_REQUEST_DETAILS.INVOICE_HEADER_ID;
                }
                ModelObj.PROJECT_MASTER_ID = $scope.ApprovalViewSearch.PROJECT_MASTER_ID;
                PrcCommMethods.P2P_API(ModelObj, 'INS_UPD_PROJECT_IN_INVOICE', 'PO').then(function (data) {
                    if (data.data != undefined && data.data == 0) { $scope.$parent.ShowAlert('Error', $scope.$parent.SOMETHINGWENTWRONG, 5000); }
                    if (data.data != undefined && data.data == 1) {
                        $('#PROJECT_POP').modal('hide');
                        $scope.$parent.ShowAlert('Success', 'Your update saved successfully', 5000);
                        if ($scope.TAB_FLAG == 1) {
                            $scope.GET_INVOICE_BY_ID($scope.ApprovalViewSearch.REQUEST_DETAILS, 1);
                            $scope.GET_INVOICE_PO_MAPPING($scope.ApprovalViewSearch.REQUEST_DETAILS, 1);
                        }
                        if ($scope.TAB_FLAG == 3) {
                            $scope.GET_INVOICE_BY_ID($scope.ApprovalViewSearch.ALL_REQUEST_DETAILS, 3);
                            $scope.GET_INVOICE_PO_MAPPING($scope.ApprovalViewSearch.ALL_REQUEST_DETAILS, 3);
                        }

                    }
                });
            }
        }
    }
    $scope.PROCESS_APPROVALS_LVL_2 = function () {
        var ModelObj = new Object();
        $('#Approved_Reject_POP').modal('hide');
        ModelObj.APPROVAL_HEADER_ID = $scope.SELECTED_REQ.APPROVAL_HEADER_ID;
        ModelObj.APPROVAL_TYPE_ID = $scope.ApprovalViewSearch.APPROVAL_TYPE_ID;
        ModelObj.APPROVAL_HEADER_STATUS_ID = $scope.SELECTED_REQ.APPROVAL_HEADER_STATUS_ID;
        ModelObj.CUR_APPROVAL_HEADER_STATUS_ID = $scope.ApprovalData.CUR_APPROVAL_HEADER_STATUS_ID;
        ModelObj.NXT_APPROVAL_HEADER_STATUS_ID = $scope.ApprovalData.Next_Approver_IDs;
        ModelObj.AUT_APPROVAL_HEADER_STATUS_ID = $scope.ApprovalData.Auto_Approver_IDs;
        ModelObj.NO_ACTION_APPROVAL_HEADER_STATUS_ID = $scope.ApprovalData.No_Action_Approver_IDs;
        ModelObj.RELEASE_FLAG = $scope.ApprovalViewSearch.APPROVE_REJECT_FLAG == 38 ? 0 : $scope.ApprovalData.RELEASE_FLAG;
        ModelObj.COMMENTS = $scope.ApprovalViewSearch.COMMENT;
        ModelObj.USER_ID = parseInt($cookies.get("USERID"));
        ModelObj.APPROVAL_STATUS_LIST = [];
        //ModelObj.CALLING_SYSTEM_FLAG =0;
        ModelObj.APPROVER_FLAG = $scope.ApprovalViewSearch.APPROVE_REJECT_FLAG;

        angular.forEach($scope.ACTION_ITEM_LIST, function (item) {
            var ReadOnlyApproval = new Object();
            ReadOnlyApproval.APPROVAL_LINE_ID = item.APPROVAL_LINE_ID;
            ReadOnlyApproval.STATUS_ID = $scope.ApprovalViewSearch.APPROVE_REJECT_FLAG;
            ReadOnlyApproval.COMMENTS = item.COMMENT == undefined || item.COMMENT == null ? "" : item.COMMENT;
            ModelObj.APPROVAL_STATUS_LIST.push(ReadOnlyApproval);
        });
        if ($scope.ApprovalViewSearch.APPROVAL_TYPE_ID == 2) {
            var Accountlist = $scope.XERO_ACCOUNT_CODES.filter(function (x) { return x.CODE + ' - ' + x.NAME == $scope.PurchaseRequestSearch.ACCOUNT_DETAILS });
            if (Accountlist.length == 0) {
                $scope.PurchaseRequestSearch.IS_ACCOUNT_VALID = true;
                count = 1;
            }
            if ($scope.PurchaseRequestSearch.APPROVER_EXPECTED_PRICE == 0) {
                count = 1;
            }
            $('#Edit_Acount').modal('hide');
            ModelObj.PR_PURCHASE_REQUEST_ID = $scope.PurchaseRequestSearch.REQUEST_ID;
            ModelObj.QUANTITY = $scope.PurchaseRequestSearch.QUANTITY;
            ModelObj.EXPECTED_PRICE = $scope.PurchaseRequestSearch.APPROVER_EXPECTED_PRICE;
            ModelObj.PROJECT_MASTER_ID = $scope.PurchaseRequestSearch.PROJECT_MASTER_ID;
            ModelObj.ACCOUNT_ID = null;
            ModelObj.ACCOUNT_DETAILS = "";
            ModelObj.SETTING_45 = $scope.$parent.SETTING_USE_GROSS;
            if ($scope.ApprovalViewSearch.APPROVE_REJECT_FLAG == 37 && ($scope.PurchaseRequestSearch.ACCOUNT_DETAILS != null && $scope.PurchaseRequestSearch.ACCOUNT_DETAILS != undefined && $scope.PurchaseRequestSearch.ACCOUNT_DETAILS != '')) {
                ModelObj.ACCOUNT_ID = Accountlist[0].TABLE_ID;
                ModelObj.ACCOUNT_DETAILS = $scope.PurchaseRequestSearch.ACCOUNT_DETAILS;
            };
            ModelObj.USER_ID = parseInt($cookies.get("USERID"));
            ModelObj.P2P_BUDGET_SNAPSHOT_TYPE = [];
            angular.forEach($scope.P2P_BUDGET_MASTER_LIST, function (val) {
                angular.forEach(val.BUDGET_DETAILS_LIST, function (item) {
                    if (val.DB_ACCOUNT_ID == 0) {
                        item.REMAINING_AMOUNT = item.REMAINING;
                    }
                    var ReadOnlyApproval = new Object();
                    ReadOnlyApproval.APPROVAL_HEADER_ID = $scope.ApprovalViewSearch.APPROVAL_HEADER_ID;
                    ReadOnlyApproval.APPROVAL_HEADER_STATUS_ID = $scope.ApprovalViewSearch.REQUEST_DETAILS.STATUS_ID;
                    ReadOnlyApproval.ACCOUNT_ID = val.ACCOUNT_ID;
                    ReadOnlyApproval.YTD = item.LINE_ID == 2 ? 1 : 0;
                    ReadOnlyApproval.TOTAL = parseFloat(item.TOTAL).toFixed(5);
                    ReadOnlyApproval.REMAINING = parseFloat(item.REMAINING_AMOUNT).toFixed(5);
                    ReadOnlyApproval.CONSUMED = parseFloat(item.CONSUMED).toFixed(5);
                    ReadOnlyApproval.BOOKED = parseFloat(item.BOOKED).toFixed();
                    ReadOnlyApproval.CURRENT = item.CURRENT_PO_CUSTOM == undefined || item.CURRENT_PO_CUSTOM == null || item.CURRENT_PO_CUSTOM == "" ? 0 : parseFloat(item.CURRENT_PO_CUSTOM).toFixed(5);
                    if (val.BUDGET_DETAILS_LIST.length == 2) {
                        ReadOnlyApproval.OVER_BUDGET = item.LINE_ID == 2 && parseFloat(item.REMAINING_AMOUNT).toFixed(5) < 0 ? 1 : 0;
                    }
                    else {
                        ReadOnlyApproval.OVER_BUDGET = parseFloat(item.REMAINING_AMOUNT).toFixed(5) < 0 ? 1 : 0;
                    }
                    ReadOnlyApproval.PERIOD = item.PERIOD;
                    ReadOnlyApproval.ACCOUNT_DETAILS = val.GLACCOUNT_NAME;
                    ReadOnlyApproval.CREDIT_MEMO = parseFloat(item.MEMO).toFixed(5);
                    ModelObj.P2P_BUDGET_SNAPSHOT_TYPE.push(ReadOnlyApproval);
                });
            });
            if (ModelObj.P2P_BUDGET_SNAPSHOT_TYPE.length == 0) {
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
                ModelObj.P2P_BUDGET_SNAPSHOT_TYPE.push(ReadOnlyApproval);
            }
        }
        PrcCommMethods.P2P_API(ModelObj, 'PROCESS_APPROVALS_LVL_2', 'PO').then(function (data) {
            $('#Approved_Reject_POP').modal('hide');
            if (data.data != undefined && data.data == 0) {
                $scope.$parent.ShowAlert('Error', $scope.$parent.SOMETHINGWENTWRONG, 5000);
            }
            if (data.data != undefined && data.data == 1) {
                var text = $scope.ApprovalViewSearch.APPROVE_REJECT_FLAG == 37 ? ' approved' : ' rejected';
                if ($scope.ApprovalViewSearch.APPROVAL_TYPE_ID == 2) {
                    if ($scope.TAB_FLAG == 1) {
                        msg = 'You have successfully' + text + ' Request#:' + $scope.ApprovalViewSearch.REQUEST_DETAILS.PR_NUMBER;
                    }
                    else {
                        msg = 'You have successfully' + text + ' Request#:' + $scope.ApprovalViewSearch.ALL_REQUEST_DETAILS.PR_NUMBER;
                    }
                    $scope.PurchaseRequestSearch.PROJECT_MASTER_ID = null;
                    $scope.PurchaseRequestSearch.ACCOUNT_DETAILS = "";
                    $scope.PurchaseRequestSearch.APPROVER_EXPECTED_PRICE = "";
                }
                else if ($scope.ApprovalViewSearch.APPROVAL_TYPE_ID == 3) {
                    if ($scope.TAB_FLAG == 1) {
                        msg = 'You have successfully' + text + ' REQ#:' + $scope.ApprovalViewSearch.REQUEST_DETAILS.REQ_NUMBER;
                    }
                    else {
                        msg = 'You have successfully' + text + ' REQ#:' + $scope.ApprovalViewSearch.ALL_REQUEST_DETAILS.REQ_NUMBER;
                    }
                }
                else if ($scope.ApprovalViewSearch.APPROVAL_TYPE_ID == 4) {
                    if ($scope.TAB_FLAG == 1) {
                        msg = 'You have successfully' + text + ' BILL#:' + $scope.ApprovalViewSearch.REQUEST_DETAILS.INVOICE_NUMBER;
                    }
                    else {
                        msg = 'You have successfully' + text + ' BILL#:' + $scope.ApprovalViewSearch.ALL_REQUEST_DETAILS.INVOICE_NUMBER;
                    }
                }
                $scope.$parent.ShowAlert('Success', msg, 5000);

                $scope.GET_APPROVAL_HEADERS_FOR_APPROVER(1, 4, false);
                $scope.GET_APPROVAL_HEADERS_FOR_APPROVER_PROCESS(1, 4, false);
                $scope.ApprovalViewSearch.COMMENT = "";
                $scope.ApprovalForm.submitted = false;
            }
        });
    }
    $scope.FORCE_APPROVE_REJECT_APPROVAL_HEADERS = function () {
        $scope.$parent.overlay_loadingNew = 'block';
        ModelObj = new Object();
        ModelObj.APPROVAL_HEADER_ID = $scope.ACTIVE_TAB_APPROVAL_PROCESS.APPROVAL_HEADER_ID;
        ModelObj.APPROVAL_HEADER_STATUS_ID = $scope.ACTIVE_TAB_APPROVAL_PROCESS.APPROVAL_HEADER_STATUS_ID;
        ModelObj.APPROVAL_TYPE_ID = $scope.ApprovalViewSearch.APPROVAL_TYPE_ID;
        ModelObj.STATUS_ID = $scope.ApprovalViewSearch.APPROVE_REJECT_FROCE_FLAG;
        ModelObj.USER_ID = parseInt($cookies.get("USERID"));
        ModelObj.COMMENTS = $scope.ApprovalViewSearch.FORCE_COMMENTS;
        if ($scope.ApprovalViewSearch.APPROVAL_TYPE_ID == 2) {
            $scope.UPD_PURCHASE_REQUEST_BY_APPROVER($scope.ApprovalViewSearch.APPROVE_REJECT_FROCE_FLAG);
        }
        PrcCommMethods.P2P_API(ModelObj, 'FORCE_APPROVE_REJECT_APPROVAL_HEADERS', 'PO').then(function (data) {
            if (data.data == 1) {
                var text = $scope.ApprovalViewSearch.APPROVE_REJECT_FROCE_FLAG == 37 ? 'approved' : 'rejected';
                var msg = "";
                if ($scope.ApprovalViewSearch.APPROVAL_TYPE_ID == 2) {
                    if ($scope.TAB_FLAG == 1) {
                        msg = 'You have successfully force ' + text + ' Request#:' + $scope.ApprovalViewSearch.REQUEST_DETAILS.PR_NUMBER;
                    }
                    else {
                        msg = 'You have successfully force ' + text + ' Request#: ' + $scope.ApprovalViewSearch.ALL_REQUEST_DETAILS.PR_NUMBER;
                    }

                }
                else if ($scope.ApprovalViewSearch.APPROVAL_TYPE_ID == 3) {
                    if ($scope.TAB_FLAG == 1) {
                        msg = 'You have successfully force ' + text + ' REQ#:' + $scope.ApprovalViewSearch.REQUEST_DETAILS.REQ_NUMBER;
                    }
                    else {
                        msg = 'You have successfully force ' + text + ' REQ#:' + $scope.ApprovalViewSearch.ALL_REQUEST_DETAILS.REQ_NUMBER;
                    }
                }
                else if ($scope.ApprovalViewSearch.APPROVAL_TYPE_ID == 4) {
                    if ($scope.TAB_FLAG == 1) {
                        msg = 'You have successfully force ' + text + ' BILL#:' + $scope.ApprovalViewSearch.REQUEST_DETAILS.INVOICE_NUMBER;
                    }
                    else {
                        msg = 'You have successfully force ' + text + ' BILL#:' + $scope.ApprovalViewSearch.ALL_REQUEST_DETAILS.INVOICE_NUMBER;
                    }
                }
                $scope.$parent.ShowAlert('Success', msg, 5000);
                if ($scope.TAB_FLAG == 1) {
                    $scope.GET_APPROVAL_HEADERS_FOR_APPROVER(1, 4, false);
                }
                else {
                    $scope.GET_APPROVAL_HEADERS_FOR_ADMIN(1);
                }
                $('#Approved_Reject_FROCE_POP').modal('hide');
            }
            else if (data.data == 0) {
                $scope.$parent.overlay_loadingNew = 'none';
                $scope.$parent.ShowAlert('Error', $scope.$parent.SOMETHINGWENTWRONG, 5000);
            }
        });

    }
    $scope.UPD_USE_INVOICE_GL_FLAG = function () {
        var INVOICE_HEADER_ID = 0;
        var USE_INVOICE_GL = 0;
        if ($scope.TAB_FLAG == 1) {
            INVOICE_HEADER_ID = $scope.ApprovalViewSearch.REQUEST_DETAILS.INVOICE_HEADER_ID;
            USE_INVOICE_GL = $scope.ApprovalViewSearch.REQUEST_DETAILS.USE_INVOICE_GL ? 1 : 0;
        }
        else {
            INVOICE_HEADER_ID = $scope.ApprovalViewSearch.ALL_REQUEST_DETAILS.INVOICE_HEADER_ID;
            USE_INVOICE_GL = $scope.ApprovalViewSearch.ALL_REQUEST_DETAILS.USE_INVOICE_GL ? 1 : 0;
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
        if ($scope.TAB_FLAG == 1) {
            LINE = $scope.ApprovalViewSearch.REQUEST_DETAILS;
            $scope.ApprovalViewSearch.REQUEST_DETAILS.SPLIT_TYPE = _splittype;
        }
        else if ($scope.TAB_FLAG == 2) {
            LINE = $scope.ApprovalViewSearch.PROCESS_REQUEST_DETAILS;
            $scope.ApprovalViewSearch.PROCESS_REQUEST_DETAILS.SPLIT_TYPE = _splittype;
        }
        else if ($scope.TAB_FLAG == 3) {
            LINE = $scope.ApprovalViewSearch.ALL_REQUEST_DETAILS;
            $scope.ApprovalViewSearch.ALL_REQUEST_DETAILS.SPLIT_TYPE = _splittype;
        }
        LINE.START_DATE = new Date(DATE);
        LINE.END_DATE = new Date(new Date(new Date(DATE).setMonth(11)).setDate(31));
        $scope.MONTH_PROCESS_ALL_LIST = [];
        for (var i = MouthStart; i <= MonthEnd; i++) {
            var ReadOnly = new Object();
            ReadOnly.MONTH = i;
            ReadOnly.INVOICE_DATE = MouthStart == i ? new Date(maxmindates[1]) : new Date(DATE).setMonth(i);
            ReadOnly.ITEM_LIST = $scope.TAB_FLAG == 1 ? angular.copy($scope.ACTION_ITEM_LIST) : $scope.TAB_FLAG == 2 ? angular.copy($scope.PROCESS_REQUEST_ITEMS_LIST) : angular.copy($scope.ALL_ITEM_LIST);
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

    $scope.RESET_RECO_UPLOAD_VIEW = function () {
        startDate = moment().startOf('month');//moment().startOf('isoWeek');//moment().subtract(6, 'days');
        endDate = moment().endOf('month'); //moment().subtract(0, 'days');
        $scope.$parent.SetUpDateRangeMultiDatePicker('reportrangeInvRecView', startDate, endDate, reportrangeCoverView);
    }
    $scope.READ_MORE = function (PRL, FLAG) {
        if (FLAG == 1) {
            $scope.LIMIT_TO = PRL.DESCRIPTION.length;
        }
        else if (FLAG == 2) {
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
                $scope.ApprovalViewSearch.NOTE_FOR_APPROVERS_LIMIT_TO = PRL.NOTE_FOR_APPROVERS.length;
            }
            else if (FLAG == 2) {
                $scope.ApprovalViewSearch.NOTE_FOR_APPROVERS_LIMIT_TO = LIMIT_TO;
            }
        }
    }
    $scope.RESET_EDIT_MACTHING = function () {
        $scope.ApprovalViewSearch.AMOUNT_FROM = "";
        $scope.ApprovalViewSearch.AMOUNT_TO = "";
        $scope.ApprovalViewSearch.DATE_FROM = "";
        $scope.ApprovalViewSearch.DATE_TO = "";
        $scope.ApprovalViewSearch.MATCHED_PO = false;
        $scope.ApprovalViewSearch.PO_NUMBER = "";
    }

    $scope.CLICK_INSERT_AMT = function (LINE) {
        LINE.ALLOCATED_AMOUNT = angular.copy(LINE.PO_AMOUNT);
    }

    $scope.PURCHASE_REQUEST_APPROVAL_CLICK = function (SELECTED_REQ, SYNC_FLAG) {
        $scope.BUDGET_TEXT_VALIDATION = "Fetching Budget...";
        $scope.MONTH_PROCESS_ALL_LIST = [];
        $scope.SELECTED_REQ = {};
        $scope.MAPPED_LIST = [];
        $scope.PO_SPLIT_LIST = [];
        $scope.CONDITIONAL_ITEM_LIST = [];
        $scope.MONTH_LIST = [];
        $scope.GRN_ATTACHMENT = { IS_MULTI_FILE_UPLOAD_ALLOW: true, };
        $scope.PO_ATTACHMENT_IN_INVOICE = { IS_MULTI_FILE_UPLOAD_ALLOW: true, };
        $scope.OTHER_ATTACHMENT = { IS_MULTI_FILE_UPLOAD_ALLOW: true, };
        $scope.MATCHED_PO_MAPPING_LIST = [];
        $scope.MAPPED_LIST = [];
        $scope.INVOICE_PO_MAPPING = [];
        $scope.PO_LINES_FOR_INVOICE_PO_MAPPING = [];
        $scope.P2P_BUDGET_LIST = [];
        $scope.SELECTED_REQ = SELECTED_REQ;
        $scope.P2P_BUDGET_MASTER_LIST = [];
        $scope.MATCH_DIV_SHOW = false;
        $scope.PO_MAPPED_LOAD = 1;
        $scope.ApprovalViewSearch.CURRENCY_CODE = '';
        $scope.GET_APPROVAL_HEADERS_CHAIN(SELECTED_REQ, 1);
        if ($scope.ApprovalViewSearch.APPROVAL_TYPE_ID == 2) { //PR Approval
            $scope.GET_APPROVAL_LINES_FOR_APPROVER(SELECTED_REQ, 1)///;
            $scope.GET_PURCHASE_REQUEST_BY_ID(SELECTED_REQ, 1) ///; // 1  TAB ALL
        }
        else if ($scope.ApprovalViewSearch.APPROVAL_TYPE_ID == 3) { // PO Approval
            $scope.GET_APPROVAL_CUSTOM_FIELD_OPTIONS_MASTER(SELECTED_REQ, 1);
            $scope.GET_PO_BY_ID(SELECTED_REQ, 1);
        }
        else if ($scope.ApprovalViewSearch.APPROVAL_TYPE_ID == 4) { //Bill Approval
            $scope.GET_INVOICE_PO_MAPPING(SELECTED_REQ, 1)
            $scope.$parent.GET_UPLOADS($scope.PO_ATTACHMENT_IN_INVOICE, 37, SELECTED_REQ.INVOICE_HEADER_ID);
            $scope.$parent.GET_UPLOADS($scope.GRN_ATTACHMENT, 38, SELECTED_REQ.INVOICE_HEADER_ID);
            $scope.$parent.GET_UPLOADS($scope.OTHER_ATTACHMENT, 39, SELECTED_REQ.INVOICE_HEADER_ID);
        }
        $scope.$parent.GET_SCROLL_TOP();
    }
    $scope.PURCHASE_REQUEST_PROCESSED_APPROVAL_CLICK = function (PROCESS_REQUEST) {
        $scope.ApprovalViewSearch.UploadedFiles = [];
        $scope.MONTH_PROCESS_ALL_LIST = [];
        $scope.BUDGET_TEXT_VALIDATION = "Fetching Budget...";
        $scope.P2P_PROCESS_BUDGET_MASTER_LIST = [];
        $scope.PO_SPLIT_LIST = [];
        $scope.MONTH_LIST = [];

        $scope.SELECTED_REQ_PROC = PROCESS_REQUEST;
        $scope.GET_APPROVAL_HEADERS_CHAIN_PROCESS(PROCESS_REQUEST, 2);
        $scope.GET_APPROVAL_CUSTOM_FIELD_OPTIONS_MASTER(PROCESS_REQUEST, 2);
        if ($scope.ApprovalViewSearch.APPROVAL_TYPE_ID == 2) { //PR Approval
            $scope.GET_APPROVAL_LINES_FOR_APPROVER(PROCESS_REQUEST, 2)///;
            $scope.GET_PURCHASE_REQUEST_BY_ID(PROCESS_REQUEST, 2) ///; // 2  TAB 
            $scope.$parent.GET_UPLOADS($scope.ApprovalViewSearch, 31, PROCESS_REQUEST.REQUEST_ID);
        }
        else if ($scope.ApprovalViewSearch.APPROVAL_TYPE_ID == 3) { //PO Approval
            $scope.GET_PO_BY_ID(PROCESS_REQUEST, 2);
            $scope.$parent.GET_UPLOADS($scope.ApprovalViewSearch, 32, PROCESS_REQUEST.REQUEST_ID);
        }
        else if ($scope.ApprovalViewSearch.APPROVAL_TYPE_ID == 4 || $scope.APPROVAL_HEADER_ID > 0) { //Bill Approval
            $scope.GET_INVOICE_PO_MAPPING(PROCESS_REQUEST, 2)
            //$scope.GET_INVOICE_BY_ID(PROCESS_REQUEST, 2);
        }
        else {
            $scope.GET_PO_BY_ID(PROCESS_REQUEST, 2);
            $scope.$parent.GET_UPLOADS($scope.ApprovalViewSearch, 32, PROCESS_REQUEST.REQUEST_ID);
        }
        $scope.$parent.GET_SCROLL_TOP();
    }
    $scope.PURCHASE_REQUEST_ALL_APPROVAL_ADMIN_CLICK = function (SELECTED_REQ_ALL, SYNC_FLAG) {
        $scope.BUDGET_TEXT_VALIDATION = "Fetching Budget...";
        $scope.MATCH_DIV_SHOW = false;
        $scope.PO_LINES_FOR_INVOICE_PO_MAPPING = [];
        $scope.MONTH_PROCESS_ALL_LIST = [];
        $scope.P2P_BUDGET_LIST = [];
        $scope.P2P_ALL_BUDGET_MASTER_LIST = [];
        $scope.APPROVAL_HEADERS_CHAIN_LIST = [];
        $scope.PO_SPLIT_LIST = [];
        $scope.MONTH_LIST = [];
        $scope.INVOICE_PO_MAPPING = [];
        $scope.SELECTED_REQ_ALL = {};
        $scope.SELECTED_REQ_ALL = SELECTED_REQ_ALL;
        $scope.MAPPED_LIST = [];
        $scope.GET_APPROVAL_HEADERS_CHAIN(SELECTED_REQ_ALL, 1); //FLAG 1 Mean to check Aprove and Reject Btn
        if ($scope.ApprovalViewSearch.APPROVAL_TYPE_ID == 2) { //PR Approval
            $scope.P2P2P_BUDGET_MASTER_LIST = [];
            $scope.GET_APPROVAL_LINES_FOR_ADMIN(SELECTED_REQ_ALL, 3)///; // 3  TAB ALL
            $scope.GET_PURCHASE_REQUEST_BY_ID(SELECTED_REQ_ALL, 3) ///; // 3  TAB ALL
        }
        else if ($scope.ApprovalViewSearch.APPROVAL_TYPE_ID == 3) { //PO Approval
            $scope.GET_APPROVAL_CUSTOM_FIELD_OPTIONS_MASTER(SELECTED_REQ_ALL, 3);// 3  TAB ALL
            $scope.GET_PO_BY_ID(SELECTED_REQ_ALL, 3);
        }
        else if ($scope.ApprovalViewSearch.APPROVAL_TYPE_ID == 4) { //BiLL Approval
            //$scope.GET_INVOICE_BY_ID(SELECTED_REQ_ALL, 3);
            $scope.GET_INVOICE_PO_MAPPING(SELECTED_REQ_ALL, 3)
        }
        $scope.$parent.GET_SCROLL_TOP();
    }

    $scope.TAB_CLICK_APPROVE_FY = function (FLAG) {
        $scope.TAB_FLAG = FLAG;
        if (FLAG == 1) {
            $scope.GET_APPROVAL_HEADERS_FOR_APPROVER(1, 4, false);
        }
        if (FLAG == 2) {
            // if ($scope.PURCHASE_REQUESTS_PROCESS_LIST.length == 0) {
            $scope.GET_APPROVAL_HEADERS_FOR_APPROVER_PROCESS(1);
            // };
        }
        if (FLAG == 3) {
            $scope.GET_APPROVAL_HEADERS_FOR_ADMIN(1);
        }
        if (FLAG == 9) {
            $scope.Invoice_childScope.PAGE_LOAD_INVOICE()
        }
    }
    if (getUrlParameter('INV', $location.absUrl()) > 0) {
        $scope.APPROVAL_HEADER_ID = getUrlParameter('A_INV', $location.absUrl())
        $scope.INVOICE_HEADER_ID = getUrlParameter('INV', $location.absUrl())
        $scope.ApprovalViewSearch.APPROVAL_HEADER_ID = $scope.APPROVAL_HEADER_ID;
        $scope.ApprovalViewSearch.INVOICE_HEADER_ID = $scope.INVOICE_HEADER_ID;
        $scope.ApprovalViewSearch.APPROVAL_TYPE_ID = 4;
        $scope.PURCHASE_REQUEST_PROCESSED_APPROVAL_CLICK($scope.ApprovalViewSearch);
        // $scope.GET_INVOICE_PO_MAPPING($scope.ApprovalViewSearch, 2);
        // $scope.TAB_CLICK_APPROVE_FY(2);
    }
    else {
        $scope.TAB_CLICK_APPROVE_FY(1);
    }
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
    $scope.$parent.DateInputLoad('PO_REQ', 1);
    $scope.$parent.child_scope = $scope;

    $scope.$parent.GET_SCROLL_TOP();
});
