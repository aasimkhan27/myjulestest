app.controller('WorkFlowMasterController', function ($scope, $http, $cookies, $window, $location, $filter, $interval, $timeout, CommService, AppVal, $localStorage, filterFilter, CheckRole, ConfigurationService, PrcCommMethods, CommInventoryMethods, $parse) {

});
app.controller('WorkFlowListController', function ($scope, $http, $cookies, $window, $location, $filter, $interval, $timeout, CommService, AppVal, $localStorage, filterFilter, CheckRole, ConfigurationService, PrcCommMethods, CommInventoryMethods, $parse) {
    $scope.SHOWING_PAGE_SIZE = 10;
    $scope.GET_APP_CHAIN_HEADER = function () {
        var GetAll = new Object();
        GetAll.PAGE_NO = 1;
        GetAll.PAGE_SIZE = $scope.SHOWING_PAGE_SIZE;
        GetAll.WORKFLOW_TYPE_IDs = "";
        GetAll.LOCATION_IDS = "";
        GetAll.USER_ID = $scope.$parent.userdata.USER_ID;
        PrcCommMethods.ADMIN_API(GetAll, 'GET_APP_CHAIN_HEADER').then(function (data) {
            $scope.WORKFLOW_LIST = data.data;
        });
    };
    $scope.GET_APP_CHAIN_HEADER();
});
app.controller('WorkFlowSetupController', function ($scope, $http, $cookies, $window, $location, $filter, $interval, $timeout, CommService, AppVal, $localStorage, filterFilter, CheckRole, ConfigurationService, PrcCommMethods, CommInventoryMethods, $parse) {
    $scope.WORKFLOW = {
        TABLE_ID: 0,
        WORKFLOW_NAME: '',
        WORKFLOW_TYPE_ID: null,
        LOCATION_ID: null,
        ACTIVE: 2
    };
    $scope.WorkflowTypes = [
        {
            WORKFLOW_TYPE_ID: 1,
            WORKFLOW_TYPE: "PO Approval"
        },
       {
           WORKFLOW_TYPE_ID: 2,
           WORKFLOW_TYPE: "PR Approval"
       }, {
           WORKFLOW_TYPE_ID: 3,
           WORKFLOW_TYPE: "Invoice Approval"
       },
        {
            WORKFLOW_TYPE_ID: 4,
            WORKFLOW_TYPE: "Credit Memo Approval"
        },
        {
            WORKFLOW_TYPE_ID: 5,
            WORKFLOW_TYPE: "Debit Memo Approval"
        },
        {
            WORKFLOW_TYPE_ID: 7,
            WORKFLOW_TYPE: "Inventory Approval"
        },
        {
            WORKFLOW_TYPE_ID: 8,
            WORKFLOW_TYPE: "Supplier Onboarding Approval"
        },
        {
            WORKFLOW_TYPE_ID: 9,
            WORKFLOW_TYPE: "Event Publish Approval"
        },
        {
            WORKFLOW_TYPE_ID: 10,
            WORKFLOW_TYPE: "Event Award Approval"
        }
    ];
    $scope.ResetWorkFlowFilter = function () {

        $scope.WORKFLOW = {
            TABLE_ID: 0,
            WORKFLOW_NAME: '',
            WORKFLOW_TYPE_ID: null,
            LOCATION_ID: null,
            ACTIVE: 2
        };
    };

    $scope.GET_APP_CHAIN_HEADER = function () {
        $scope.ResetWorkFlowFilter();
        $scope.WORKFLOW.TABLE_ID = parseInt(getUrlParameter('wid', $location.absUrl()));
        if ($scope.WORKFLOW.TABLE_ID != undefined && !isNaN($scope.WORKFLOW.TABLE_ID) && $scope.WORKFLOW.TABLE_ID != 0) {
            var GetAll = new Object();
            GetAll.TABLE_ID = $scope.WORKFLOW.TABLE_ID;
            GetAll.PAGE_NO = 1;
            GetAll.PAGE_SIZE = 1000;
            GetAll.WORKFLOW_TYPE_IDs = "";
            GetAll.LOCATION_IDS = "";
            GetAll.USER_ID = $scope.$parent.userdata.USER_ID;
            PrcCommMethods.ADMIN_API(GetAll, 'GET_APP_CHAIN_HEADER').then(function (data) {
                //  $scope.WORKFLOW = data.data[0];
                $scope.WORKFLOW = {
                    TABLE_ID: data.data[0].APP_CHAIN_HDR_ID,
                    WORKFLOW_NAME: data.data[0].NAME,
                    WORKFLOW_TYPE_ID: data.data[0].APP_CHAIN_TYPE_ID,
                    LOCATION_ID: data.data[0].LOCATION_ID,
                    WORKFLOW_SEQUENCE: data.data[0].SEQ_NO,
                    WORKFLOW_DAPPROVER: data.data[0].DEFAULT_APP_ID,
                    ACTIVE: data.data[0].ACTIVE
                };
                $scope.WORKFLOW.ACTIVE_FLAG = $scope.WORKFLOW.ACTIVE == 1 ? true : false;
                $scope.GET_ALL_USER_FOR_APP_CHAIN(data.data[0].LOCATION_ID);
            });
        }
    };
    $scope.GET_APP_CHAIN_HEADER();
    $scope.GET_ALL_USER_FOR_APP_CHAIN = function (LOCATION_ID) {
        var GetAll = new Object();
        GetAll.LOCATION_ID = LOCATION_ID;
        GetAll.REQUESTOR_FLAG = 0;
        PrcCommMethods.ADMIN_API(GetAll, 'GET_ALL_USER_FOR_APP_CHAIN').then(function (data) {
            $scope.UserList = data.data;
            $timeout(function () {
                $('.WORKFLOW_DAPPROVER').select2();
            }, 200);
        });
    };
    $scope.ChangeLocation = function (LOCATION_ID) {
        $scope.GET_ALL_USER_FOR_APP_CHAIN(LOCATION_ID);
    }
    $scope.INS_UPD_APP_CHAIN_HEADER = function (DRAFT) {
        if ($scope.Workflow.submitted && $scope.Workflow.$valid) {
            var GetAll = new Object();
            GetAll.TABLE_ID = $scope.WORKFLOW.TABLE_ID;
            GetAll.WORKFLOW_NAME = $scope.WORKFLOW.WORKFLOW_NAME;
            GetAll.WORKFLOW_TYPE_ID = $scope.WORKFLOW.WORKFLOW_TYPE_ID;
            GetAll.LOCATION_ID = $scope.WORKFLOW.LOCATION_ID;
            GetAll.USER_ID = $scope.$parent.userdata.USER_ID;
            GetAll.ACTIVE = $scope.WORKFLOW.ACTIVE;
            GetAll.SEQUENCE_NO = $scope.WORKFLOW.WORKFLOW_SEQUENCE;
            GetAll.DEFAULT_APPROVER_ID = $scope.WORKFLOW.WORKFLOW_DAPPROVER;
            PrcCommMethods.ADMIN_API(GetAll, 'INS_UPD_APP_CHAIN_HEADER').then(function (data) {
                $scope.WORKFLOW.TABLE_ID = data.data.TABLE_ID;
                $scope.WORKFLOW.OUTPUT = data.data.OUTPUT;//1Success, 2 SEQ Exist, 3, NameExist, 4 BothExist
                if (DRAFT != 1) {
                    $location.path('WFA').search('wid', $scope.WORKFLOW.TABLE_ID).search('lid', $scope.WORKFLOW.LOCATION_ID).search('wtid', $scope.WORKFLOW.WORKFLOW_TYPE_ID);
                }
            });
        }
    };

});
app.controller('WorkFlowApproverController', function ($scope, $http, $cookies, $window, $location, $filter, $interval, $timeout, CommService, AppVal, $localStorage, filterFilter, CheckRole, ConfigurationService, PrcCommMethods, CommInventoryMethods, $parse) {
    $scope.WORKFLOW_ID = parseInt(getUrlParameter('wid', $location.absUrl()));
    $scope.LOCATION_ID = parseInt(getUrlParameter('lid', $location.absUrl()));
    $scope.WORKFLOW_TYPE_ID = parseInt(getUrlParameter('wtid', $location.absUrl()));
    $scope.APPROVAL_WORKFLOW = {
        GROUPS: [
            {
                APP_CHAIN_GROUP_ID: 0,
                GROUP_SEQ_NO: 1,
                AMOUNT: null,
                REMOVE_FLAG: 0,
                GROUP_USERS: [],
                USER_EXISTS: false,
                HIGHER_LOWER_FLAG: null
            }
        ]
    }
    $scope.GET_ALL_USER_FOR_APP_CHAIN = function (FLAG) {
        var GetAll = new Object();
        GetAll.LOCATION_ID = $scope.LOCATION_ID;
        GetAll.REQUESTOR_FLAG = FLAG;
        PrcCommMethods.ADMIN_API(GetAll, 'GET_ALL_USER_FOR_APP_CHAIN').then(function (data) {
            if (FLAG == 1) {
                $scope.RequestorList = data.data;
            }
            else {
                $scope.UserList = data.data;
            }
        });
    };
    $scope.AddAlternativeRule = function (GROUPUSER, GROUP_USERS, index) {
        var GROUPUSER_obj = angular.copy(GROUPUSER);
        GROUPUSER_obj.USER.ALTERNATIVE_RULE = 1;
        GROUPUSER_obj.USER.USER_NAME = 'or if'
        GROUPUSER_obj.USER.EMAIL = ''
        GROUPUSER_obj.USER_SETTING = {
            COSTCENTER_FLAG: '1',
            REQUESTOR_FLAG: '1',
            CATEGORY_FLAG: '1',
            GL_FLAG: '1'
        };
        GROUP_USERS.splice(index + 1, 0, GROUPUSER_obj);
        $timeout(function () {
            $('.REQs').select2();
        }, 2000);

    }
    $scope.AddApprover = function (GROUP) {
        GROUP.USER_EXISTS = false;
        angular.forEach(GROUP.GROUP_USERS, function (GROUPUSER) {
            if (GROUPUSER.USER.USER_ID == GROUP.SELECTED_USER.USER_ID) {
                GROUP.USER_EXISTS = true;
                $scope.$parent.ShowAlert('Error', 'User already added', 5000);
            }
        });
        if (GROUP.USER_EXISTS == false) {
            var GROUPUSER = new Object();
            GROUPUSER.USER = GROUP.SELECTED_USER;
            GROUPUSER.USER.ALTERNATIVE_RULE = 0;
            GROUPUSER.USER.TABLE_ID = 0;
            GROUPUSER.ACTIVE = 1;
            GROUPUSER.USER_SETTING = {
                COSTCENTER_FLAG: '1',
                REQUESTOR_FLAG: '1',
                CATEGORY_FLAG: '1',
                GL_FLAG: '1'
            };
            GROUP.GROUP_USERS.push(GROUPUSER);
        }
        GROUP.SELECTED_USER = {};
    }
    $scope.RemoveApprover = function (Index, GROUP, GROUP_USER) {
        if (GROUP_USER.USER.TABLE_ID == 0) {
            GROUP.GROUP_USERS.splice(Index, 1);
        }
        else {
            GROUP_USER.ACTIVE = 0;
        }
    }
    $scope.AddGroup = function () {
        var GROUPS = {
            GROUP_SEQ_NO: 1,
            AMOUNT: null,
            REMOVE_FLAG: 0,
            GROUP_USERS: [],
            USER_EXISTS: false,
            HIGHER_LOWER_FLAG: null,
            APP_CHAIN_GROUP_ID: 0
        };
        $scope.APPROVAL_WORKFLOW.GROUPS.push(GROUPS);
        $('[data-toggle="tooltip"]').tooltip("hide");
    }
    $scope.SETGROUP = function (GROUP) {
        $scope.SELECTEDGROUP = GROUP;
        $scope.SELECTEDGROUP.APPROVAL_CONDITION_COUNT = 1;
    }
    $scope.CheckApprovalCondition = function () {
        if ($scope.SELECTEDGROUP.APPROVAL_CONDITION_COUNT < 1 || $scope.SELECTEDGROUP.APPROVAL_CONDITION_COUNT > $scope.SELECTEDGROUP.GROUP_USERS.length) {
            $scope.$parent.ShowAlert('Error', 'Any Count cannot be less than 1 or greater than Approvers selected ', 5000);
        }
    }
    $scope.InitializeGroupApprovers = function () {
        $('.REQs').select2();
    }
    $scope.Cost_Center_PAR = function () {
        var GetAll = new Object();
        if ($scope.Cost_Center_PAR_List == undefined || $scope.Cost_Center_PAR_List == '' || $scope.Cost_Center_PAR_List.length == 0) {
            GetAll.LOCATION_ID = $scope.LOCATION_ID;
            var httprequest = $http({
                method: 'POST',
                url: CommService.Get_AMS_API() + 'api/AMSLanding/GET_CC_LIST',
                data: GetAll
            }).then(function (data) {
                $scope.Cost_Center_PAR_List = data.data.Table;
            });
        }
    }
    $scope.GL = function () {
        var GetAll = new Object();
        if ($scope.GL_List == undefined || $scope.GL_List == '' || $scope.GL_List.length == 0) {
            GetAll.LOCATION_ID = $scope.LOCATION_ID;
            var httprequest = $http({
                method: 'POST',
                url: CommService.Get_AMS_API() + 'api/AMSLanding/GET_GL_LIST',
                data: GetAll
            }).then(function (data) {
                $scope.GL_List = data.data.Table;
            });
        }
    }
    $scope.GET_SUB_CATEGORIES = function () {
        var GetAll = new Object();
        GetAll.CUSTOMER_ID = $scope.$parent.userdata.CUSTOMER_ID;
        GetAll.LANGUAGE_ID = $scope.$parent.userdata.LANGUAGE_ID;
        PrcCommMethods.EVENT_API(GetAll, 'GET_SUB_CATEGORIES').then(function (data) {
            $scope.SUB_CATEGORIES = data.data.Table;
        });
    };
    $scope.GET_APP_CHAIN_GROUPS = function () {
        if ($scope.WORKFLOW_ID != undefined && $scope.WORKFLOW_ID != 0 && $scope.WORKFLOW_ID != "") {
            var GetAll = new Object();
            GetAll.TABLE_ID = $scope.WORKFLOW_ID;
            PrcCommMethods.ADMIN_API(GetAll, 'GET_APP_CHAIN_GROUPS').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.APPROVAL_WORKFLOW.GROUPS = data.data.Table;
                    angular.forEach($scope.APPROVAL_WORKFLOW.GROUPS, function (GRP, index) {
                        GRP.REMOVE_FLAG = 0;
                        if (GRP.HIGHER_LOWER_FLAG == 2) { GRP.HIGHER_LOWER_FLAG = 'Upto'; }
                        else if (GRP.HIGHER_LOWER_FLAG == 1) { GRP.HIGHER_LOWER_FLAG = 'More than'; }
                        else { GRP.HIGHER_LOWER_FLAG = null; }
                        GRP.GROUP_USERS = [];
                        angular.forEach($filter('filter')(data.data.Table1, { APP_CHAIN_GROUP_ID: GRP.APP_CHAIN_GROUP_ID }, true), function (APP, index1) {
                            var GROUPUSER = new Object();
                            GROUPUSER.ACTIVE = 1;
                            GROUPUSER.USER = {
                                TABLE_ID: APP.TABLE_ID,
                                USER_NAME: APP.USER_NAME,
                                EMAIL: APP.EMAIL,
                                USER_ID: APP.USER_ID,
                                ALTERNATIVE_RULE: 0,                               
                            };
                            GROUPUSER.USER_SETTING = {
                                COSTCENTER_FLAG: APP.COSTCENTER_FLAG + '',
                                REQUESTOR_FLAG: APP.REQUESTOR_FLAG + '',
                                CATEGORY_FLAG: APP.CATEGORY_FLAG + '',
                                GL_FLAG: APP.GL_FLAG + '',
                                COSTCENTER_IDS: APP.COSTCENTER_IDS,
                                REQUESTOR_IDS: APP.REQUESTOR_IDS,
                                CATEGORY_IDS: APP.CATEGORY_IDS,
                                GL_IDS: APP.GL_IDS,
                                APPROVAL_LIMIT: APP.APPROVAL_LIMIT,
                            };
                            GRP.GROUP_USERS.push(GROUPUSER);

                        });

                    });
                }
            });
        }
    };
    $scope.GET_APP_CHAIN_GROUPS();
    $scope.ApproverSettings = function (GROUP) {
        if (GROUP.GROUP_USERS.length > 0) {
            $('#Approval_Popup').modal('show');
            GROUP.SELECTED == 1;
            $scope.GroupUsers = GROUP.GROUP_USERS;
            $timeout(function () {
                $('.REQs').select2();
            }, 2000);
        }
        else {
            $scope.$parent.ShowAlert('Error', 'Please add the Approvers', 5000);
        }
    }
    $scope.RemoveGroup = function (Index, GROUP) {
        if (GROUP.APP_CHAIN_GROUP_ID == 0) {
            $scope.APPROVAL_WORKFLOW.GROUPS.splice(Index, 1);
        }
        else {
            GROUP.REMOVE_FLAG = 1;
        }


    }
    $scope.INS_UPD_APP_CHAIN = function (FLAG) {
        var GetAll = new Object();
        GetAll.TABLE_ID = $scope.WORKFLOW_ID;
        GetAll.WORKFLOW_TYPE_ID = $scope.WORKFLOW_TYPE_ID;
        GetAll.LOCATION_ID = $scope.LOCATION_ID;
        GetAll.USER_ID = $scope.$parent.userdata.USER_ID;
        GetAll.APP_CHN_GRP_OBJ_LIST = [];
        GetAll.APP_CHN_OBJ_LIST = [];
        angular.forEach($scope.APPROVAL_WORKFLOW.GROUPS, function (GRP, index) {
            var Obj = new Object();
            Obj.APP_CHAIN_GROUP_ID = GRP.APP_CHAIN_GROUP_ID;
            Obj.AMOUNT = GRP.AMOUNT;
            Obj.GROUP_SORT_SEQ = index + 1;
            Obj.REMOVE_FLAG = GRP.REMOVE_FLAG;
            Obj.HIGHER_LOWER_FLAG = GRP.HIGHER_LOWER_FLAG == "Upto" ? 2 : 1;
            Obj.ANY_ALL_FLAG = GRP.APPROVAL_CONDITION == "0" ? 0 : GRP.APPROVAL_CONDITION_COUNT;
            GetAll.APP_CHN_GRP_OBJ_LIST.push(Obj);
            angular.forEach(GRP.GROUP_USERS, function (USR, index1) {
                var CHN_Obj = new Object();
                CHN_Obj.APP_CHAIN_ID = USR.USER.TABLE_ID;
                CHN_Obj.APPROVER_ID = USR.USER.USER_ID;
                CHN_Obj.APPROVAL_LIMIT = GRP.AMOUNT;
                CHN_Obj.COSTCENTER_FLAG = USR.USER_SETTING.COSTCENTER_FLAG;

                if (USR.USER_SETTING.COSTCENTER_FLAG != '1' && USR.USER_SETTING.COSTCENTER != undefined && USR.USER_SETTING.COSTCENTER.length > 0)
                    CHN_Obj.COSTCENTER_IDS = Array.prototype.map.call(USR.USER_SETTING.COSTCENTER, function (item) { return item.COSTCENTER_ID }).join(",");

                CHN_Obj.REQUESTOR_FLAG = USR.USER_SETTING.REQUESTOR_FLAG;

                if (USR.USER_SETTING.REQUESTOR_FLAG != '1' && USR.USER_SETTING.REQUESTORS != undefined && USR.USER_SETTING.REQUESTORS.length > 0)
                    CHN_Obj.REQUESTOR_IDS = Array.prototype.map.call(USR.USER_SETTING.REQUESTORS, function (item) { return item.USER_ID }).join(",");

                CHN_Obj.CATEGORY_FLAG = USR.USER_SETTING.CATEGORY_FLAG;

                if (USR.USER_SETTING.CATEGORY_FLAG != '1' && USR.USER_SETTING.CATEGORY != undefined && USR.USER_SETTING.CATEGORY.length > 0)
                    CHN_Obj.CATEGORY_IDS = Array.prototype.map.call(USR.USER_SETTING.CATEGORY, function (item) { return item.CATEGORIES_ID }).join(",");

                CHN_Obj.GL_FLAG = USR.USER_SETTING.GL_FLAG;

                if (USR.USER_SETTING.GL_FLAG != '1' && USR.USER_SETTING.GLACCOUNT != undefined && USR.USER_SETTING.GLACCOUNT.length > 0)
                    CHN_Obj.GL_IDS = Array.prototype.map.call(USR.USER_SETTING.GLACCOUNT, function (item) { return item.GL_ID }).join(",");

                CHN_Obj.SEQUENCE_NO = index1 + 1;
                CHN_Obj.GROUP_SORT_SEQ = index + 1;
                CHN_Obj.ACTIVE = USR.ACTIVE;
                GetAll.APP_CHN_OBJ_LIST.push(CHN_Obj);
            });

        })


        PrcCommMethods.ADMIN_API(GetAll, 'INS_UPD_APP_CHAIN').then(function (data) {

        });
    };
    $scope.GET_ALL_USER_FOR_APP_CHAIN(0);
    $scope.GET_ALL_USER_FOR_APP_CHAIN(1);
    $scope.Cost_Center_PAR();
    $scope.GL();
    $scope.GET_SUB_CATEGORIES();
});