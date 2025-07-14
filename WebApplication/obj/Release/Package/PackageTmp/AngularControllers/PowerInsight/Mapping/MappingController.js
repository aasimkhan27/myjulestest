app.controller('MappingController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $localStorage) {
    $scope.REDIRECTION_PAGE = function (Path, ACCESS) {
        $location.path(Path);
        //if (ACCESS) {

        //}
        //else {
        //    $scope.$parent.ShowAlert("Warning", $scope.$parent.ACCESS_TEXT, 2000);
        //}
    };
    $scope.$parent.PAGE_HEADER = 'Epos Sales Category Mapping';
    $scope.$parent.urlpath = 'Epos Sales Category Mapping';// changed by ashish
});
app.controller('CategotyMappingController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $localStorage) {
    $scope.ENTITY_LIST = [];
    $scope.INTEGRATIONSYSTEM_LIST = [];
    $scope.SUB_MODULES_BY_MODULE_ID_LIST = [];
    $scope.BRANCH_LIST = [];
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(1);
    //------------------Category Mapping-------------------------
    $scope.EPOS_SALES_CATEGORY_CATEGORY_MASTER_MAPPING_LIST = [];
    $scope.EposSalesCategotyMappingSearch = {
        ENTITY_ID: null,
        USER_ID: '',
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        ACTIVE: -1,
        INTEGRATION_SYSTEM_ID: null
    };
    $scope.GET_ENTITY_LIST = function () {
        $scope.$parent.overlay_loadingNew = "block"
        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_ID = null;
        CusModelObj.ACTIVE = 1;
        CusModelObj.PAGE_NO = 0;
        CusModelObj.USER_ID = parseInt($cookies.get("USERID"));
        CusModelObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(CusModelObj, 'ADMIN_GET_ENTITIES').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.ENTITY_LIST = data.data.Table;
                $scope.$parent.overlay_loadingNew = "none"
            }
            else {
                $scope.ENTITY_LIST = [];
                $scope.$parent.overlay_loadingNew = "none";
            };
        });
        //$scope.EposSalesCategotyMappingForm.submitted = false;      
    };
    $scope.GET_ENTITY_LIST();
    $scope.ADMIN_GET_BRANCH = function () {
        $scope.BRANCH_LIST = [];
        $scope.INTEGRATIONSYSTEM_LIST = [];
        $scope.EPOS_SALES_CATEGORY_CATEGORY_MASTER_MAPPING_LIST = [];
        if ($scope.EposSalesCategotyMappingSearch.ENTITY_ID != null) {
            $scope.$parent.overlay_loadingNew = "block";
            ModelObj = new Object();
            ModelObj.CUSTOMER_ID = parseInt($cookies.get('CUSTOMER_ID'));
            ModelObj.ENTITY_ID = $scope.EposSalesCategotyMappingSearch.ENTITY_ID;
            ModelObj.BRANCH_CODE = null;
            ModelObj.BRANCH_NAME = null;
            ModelObj.CONTACT_NAME = null;
            ModelObj.LOCATION_IDS = null;
            ModelObj.ACTIVE = 1;
            ModelObj.PAGE_NO = 0;
            ModelObj.PAGE_SIZE = 1000;
            ModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.ADMIN_API(ModelObj, 'ADMIN_GET_BRANCH').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.BRANCH_LIST = data.data.Table;
                    $scope.$parent.overlay_loadingNew = "none";
                }
                else {
                    $scope.BRANCH_LIST = [];
                    $scope.$parent.overlay_loadingNew = "none";
                }
            });
        }
        else
            $scope.$parent.overlay_loadingNew = "none";

        $scope.EposSalesCategotyMappingForm.submitted = false;
    };
    $scope.GET_INTEGRATION_SYSTEMS = function () {
        CommonObj = new Object();
        CommonObj.INTEGRATION_TYPE_ID = 1;
        CommonObj.MODULE_ID = 1;
        PrcCommMethods.ADMIN_API(CommonObj, 'GET_INTEGRATION_SYSTEMS_EPOS').then(function (data) {
            $scope.INTEGRATIONSYSTEM_LIST = data.data.Table;
        });

    };
    $scope.GET_CATEGORY_MASTER = function () {
        var CustmObj = new Object();
        PrcCommMethods.ADMIN_API(CustmObj, 'GET_CATEGORY_MASTER').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.CATEGORY_MASTER_LIST = data.data.Table;
            }
        });
    };
    $scope.GET_CATEGORY_MASTER();
    $scope.GET_EPOS_SALES_CATEGORY_CATEGORY_MASTER_MAPPING = function () {
        $scope.EposSalesCategotyMappingForm.submitted = true;
        $scope.EposSalesCategotyMappingListForm.submitted = false;
        if ($scope.EposSalesCategotyMappingForm.$valid) {
            $scope.$parent.overlay_loadingNew = "block";
            var CommModelObj = new Object();
            CommModelObj.ENTITY_ID = $scope.EposSalesCategotyMappingSearch.ENTITY_ID;
            CommModelObj.BRANCH_ID = $scope.EposSalesCategotyMappingSearch.BRANCH_ID;
            CommModelObj.INTEGRATION_SYSTEM_ID = $scope.EposSalesCategotyMappingSearch.INTEGRATION_SYSTEM_ID;
            $scope.EPOS_SALES_CATEGORY_CATEGORY_MASTER_MAPPING_LIST = [];
            PrcCommMethods.ADMIN_API(CommModelObj, 'GET_EPOS_SALES_CATEGORY_CATEGORY_MASTER_MAPPING').then(function (data) {
                if (data.data != null && data.data.Table.length > 0) {
                    $scope.EPOS_SALES_CATEGORY_CATEGORY_MASTER_MAPPING_LIST = data.data.Table;
                    $scope.EPOS_SALES_CATEGORY_CATEGORY_MASTER_MAPPING_LIST = $scope.EPOS_SALES_CATEGORY_CATEGORY_MASTER_MAPPING_LIST.filter(p => p.CATEGORY_ID != "");
                    if ($scope.EPOS_SALES_CATEGORY_CATEGORY_MASTER_MAPPING_LIST.length == 0) {
                        $scope.$parent.ShowAlert('Attention', 'No record found for category mapping.', 3000);
                    }
                    $scope.$parent.overlay_loadingNew = "none";
                }
                else {
                    $scope.EPOS_SALES_CATEGORY_CATEGORY_MASTER_MAPPING_LIST = [];
                    $scope.$parent.ShowAlert('Attention', 'No record found.', 3000);
                    $scope.$parent.overlay_loadingNew = "none";
                };
            });
            $scope.EposSalesCategotyMappingForm.submitted = false;
        }
    };
    $scope.INS_UPD_EPOS_SALES_CATEGORY_CATEGORY_MASTER_MAPPING = function () {
        $scope.EposSalesCategotyMappingListForm.submitted = true;
        $scope.RESULT_SET = [];
        angular.forEach($scope.EPOS_SALES_CATEGORY_CATEGORY_MASTER_MAPPING_LIST.filter(p => p.CATEGORY_MASTER_ID != null && p.CATEGORY_MASTER_ID != ""), function (item) {
            $scope.ITEM = [];
            $scope.ITEM = {
                "TABLE_ID": item.TABLE_ID,
                "CATEGORY_ID": item.CATEGORY_ID.toString(),
                "CATEGORY_CODE": item.CATEGORY_CODE.toString(),
                "CATEGORY_NAME": item.CATEGORY_NAME.toString(),
                "CATEGORY_MASTER_ID": item.CATEGORY_MASTER_ID
            };
            $scope.RESULT_SET.push($scope.ITEM);
        });
        if ($scope.EposSalesCategotyMappingListForm.$valid) {
            if ($scope.RESULT_SET.length > 0) {
                $scope.$parent.overlay_loadingNew = "block";
                var CommModelObj = new Object();
                CommModelObj.ENTITY_ID = $scope.EposSalesCategotyMappingSearch.ENTITY_ID;
                CommModelObj.BRANCH_ID = $scope.EposSalesCategotyMappingSearch.BRANCH_ID;
                CommModelObj.INTEGRATION_SYSTEM_ID = $scope.EposSalesCategotyMappingSearch.INTEGRATION_SYSTEM_ID;
                CommModelObj.USER_ID = parseInt($cookies.get("USERID"));
                CommModelObj.COMMON_DT = $scope.RESULT_SET;
                PrcCommMethods.ADMIN_API(CommModelObj, 'INS_UPD_EPOS_SALES_CATEGORY_CATEGORY_MASTER_MAPPING').then(function (data) {
                    if (data.data == 1) {
                        $scope.$parent.ShowAlert("Success", "Saved Successfully", 3000);
                        $scope.RESET();
                        $scope.$parent.overlay_loadingNew = "none";
                    }
                    else {
                        $scope.$parent.ShowAlert('Attention', 'Please Select Active/In-Active Option.', 3000); $scope.EposSalesCategotyMappingForm.submitted = false;
                        $scope.$parent.overlay_loadingNew = "none";
                    }
                });
            }
            else {
                $scope.$parent.ShowAlert('Attention', 'Please select category mapping.', 3000); $scope.EposSalesCategotyMappingForm.submitted = false;
                $scope.$parent.overlay_loadingNew = "none";
            }
        }
    };
    $scope.RESET = function () {
        $scope.EposSalesCategotyMappingForm.submitted = false;
        $scope.BRANCH_LIST = [];
        $scope.EPOS_SALES_CATEGORY_CATEGORY_MASTER_MAPPING_LIST = [];
        $scope.EposSalesCategotyMappingSearch = {
            ENTITY_ID: null,
            USER_ID: '',
            PAGE_NO: 1,
            PAGE_SIZE: 10,
            ACTIVE: -1,
            INTEGRATION_SYSTEM_ID: null
        };
    };
    $scope.GET_INTEGRATION_DETAILS_BY_CUST_ENT_BRNH = function () {
        $scope.$parent.overlay_loadingNew = "block";
        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_ID = 0;
        CusModelObj.ENTITY_ID = $scope.EposSalesCategotyMappingSearch.ENTITY_ID;
        CusModelObj.BRANCH_ID = $scope.EposSalesCategotyMappingSearch.BRANCH_ID;
        if ($scope.EposSalesCategotyMappingSearch.ENTITY_ID != null && $scope.EposSalesCategotyMappingSearch.BRANCH_ID != null) {
            PrcCommMethods.ADMIN_API(CusModelObj, 'GET_INTEGRATION_DETAILS_BY_CUST_ENT_BRNH').then(function (data) {
                $scope.INTEGRATIONSYSTEM_LIST = [];
                if (data.data != null && data.data.Table.length > 0) {
                    $scope.INTEGRATIONSYSTEM_LIST = data.data.Table.filter(p => p.INTEGRATION_TYPE_ID == 1);
                    if ($scope.INTEGRATIONSYSTEM_LIST.length == 0) {
                        $scope.$parent.ShowAlert('Attention', $scope.ENTITY_LIST.filter(p => p.ENTITY_ID == $scope.EposSalesCategotyMappingSearch.ENTITY_ID)[0]["ENTITY_NAME"] + ', is not mapped with the integration system.', 3000);
                    }
                    else
                        $scope.EposSalesCategotyMappingSearch.INTEGRATION_SYSTEM_ID = data.data.Table.filter(p => p.INTEGRATION_TYPE_ID == 1)[0]['INTEGRATION_SYSTEM_ID'];
                    $scope.$parent.overlay_loadingNew = "none";
                }
                else {
                    $scope.INTEGRATIONSYSTEM_LIST = [];
                    $scope.$parent.ShowAlert('Attention', $scope.ENTITY_LIST.filter(p => p.ENTITY_ID == $scope.EposSalesCategotyMappingSearch.ENTITY_ID)[0]["ENTITY_NAME"] + ', is not mapped with the integration system.', 3000);
                    $scope.$parent.overlay_loadingNew = "none";
                };
            });
        }
        else {
            $scope.$parent.overlay_loadingNew = "none";
        }
    };
    //----------------------------------------------------------


});
app.controller('SubscriptionMappingController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $localStorage) {
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(1);
    $scope.MODULES_BRANCH_LIST = [];
    $scope.SUBSCRIPTION_LIST = [];
    $scope.DATA_LIST = [];
    $scope.TABLE2_DATA = [];
    $scope.BRANCH_LIST = [];
    $scope.ACCESS_VIEW_OR_EDIT = false;

    $scope.ON_PAGELOAD = function () {
        $scope.ACCESS_VIEW_OR_EDIT = $scope.$parent.CHECK_MODULE_ACCESS(138, 1);
    };
    //---- Subscription Mapping Functions-----------------------
    $scope.GET_BRANCH_LIST_FOR_POWER_INSIGHTS = function () {
        $scope.$parent.overlay_loadingNew = "block"
        CommonObj = new Object();
        CommonObj.USER_ID = 3307;
        PrcCommMethods.ADMIN_API(CommonObj, 'GET_BRANCH_SUB_MODULES_FOR_POWER_INSIGHTS').then(function (data) {
            $scope.SUB_MODULES_BY_MODULE_ID_LIST = data.data.Table;
            $scope.TABLE2_DATA = data.data.Table2;

            //---Top submodule list----
            angular.forEach(data.data.Table, function (Module) {
                if (data.data.Table2.filter(p => p.SUB_MODULE_ID == Module.SUB_MODULE_ID && p.FLAG == 1).length > 0) {
                    var item = {
                        "MODULE_ID": Module.MODULE_ID,
                        "SORT_ORDER": Module.SORT_ORDER,
                        "SUB_MODULES_NAME": Module.SUB_MODULES_NAME,
                        "SUB_MODULE_ID": data.data.Table2.filter(p => p.SUB_MODULE_ID == Module.SUB_MODULE_ID && p.FLAG == 1)[0]["SUB_MODULE_ID"],
                        "FLAG": true
                    };
                    $scope.SUBSCRIPTION_LIST.push(item);
                }
                else {
                    var item = {
                        "MODULE_ID": Module.MODULE_ID,
                        "SORT_ORDER": Module.SORT_ORDER,
                        "SUB_MODULES_NAME": Module.SUB_MODULES_NAME,
                        "SUB_MODULE_ID": data.data.Table2.filter(p => p.SUB_MODULE_ID == Module.SUB_MODULE_ID && p.FLAG == 0)[0]["SUB_MODULE_ID"],
                        "FLAG": false
                    };
                    $scope.SUBSCRIPTION_LIST.push(item);
                }
            });
            //---- Map Table1 and Table2 ----

            angular.forEach(data.data.Table2, function (TABLE2) {
                var item = {
                    "ENTITY_ID": TABLE2.ENTITY_ID,
                    "BRANCH_ID": TABLE2.BRANCH_ID,
                    "SUB_MODULE_ID": TABLE2.SUB_MODULE_ID,
                    "FLAG": TABLE2.FLAG,
                    "TABLE_ID": TABLE2.TABLE_ID,
                    "BRANCH_NAME": data.data.Table1.filter(p => p.BRANCH_ID == TABLE2.BRANCH_ID)[0]["BRANCH_NAME"],
                };
                $scope.MODULES_BRANCH_LIST.push(item);
            });
            //---- Filter to select only distinct branch not all----
            angular.forEach(angular.copy($filter('unique')($scope.MODULES_BRANCH_LIST, 'BRANCH_ID')), function (Table1) {
                if (data.data.Table2.filter(p => p.BRANCH_ID == Table1.BRANCH_ID && p.FLAG == 1).length > 0) {
                    var item = {
                        "ENTITY_ID": Table1.ENTITY_ID,
                        "BRANCH_NAME": Table1.BRANCH_NAME,
                        "BRANCH_ID": Table1.BRANCH_ID,
                        "SUB_MODULE_ID": data.data.Table2.filter(p => p.BRANCH_ID == Table1.BRANCH_ID && p.FLAG == 1)[0]["SUB_MODULE_ID"],
                        "FLAG": true,
                        "TABLE_ID": data.data.Table2.filter(p => p.BRANCH_ID == Table1.BRANCH_ID && p.FLAG == 1)[0]["TABLE_ID"],
                    };
                    $scope.BRANCH_LIST.push(item);

                }
                else {
                    var item = {
                        "ENTITY_ID": Table1.ENTITY_ID,
                        "BRANCH_NAME": Table1.BRANCH_NAME,
                        "BRANCH_ID": Table1.BRANCH_ID,
                        "SUB_MODULE_ID": Table1.SUB_MODULE_ID,
                        "FLAG": false,
                        "TABLE_ID": Table1.TABLE_ID,
                    };
                    $scope.BRANCH_LIST.push(item);

                }
            });
            $scope.$parent.overlay_loadingNew = "none"
        });
    };
    $scope.GET_BRANCH_LIST_FOR_POWER_INSIGHTS();
    $scope.MODULE_CHECK = function (SUBSCRIPTION) {
        if ($scope.SUBSCRIPTION_LIST.filter(p => p.FLAG == true).length == 0) {
            angular.forEach($scope.BRANCH_LIST, function (item) {
                item.FLAG = false;
            });
        }
    };
    $scope.INS_UPD_BRANCH_SUB_MODULES = function () {
        if ($scope.SUBSCRIPTION_LIST.filter(p => p.FLAG == true).length > 0 && $scope.BRANCH_LIST.filter(p => p.FLAG == true).length > 0) {
            $scope.DATA_LIST = [];
            CommonObj = new Object();
            angular.forEach($scope.SUBSCRIPTION_LIST, function (sbusItem) {
                angular.forEach($scope.BRANCH_LIST, function (moduBranch) {
                    angular.forEach($scope.MODULES_BRANCH_LIST.filter(p => p.SUB_MODULE_ID == sbusItem.SUB_MODULE_ID && p.BRANCH_ID == moduBranch.BRANCH_ID), function (table2Item) {
                        if (sbusItem.FLAG == false) {
                            var item = {
                                "TABLE_ID": table2Item.TABLE_ID,
                                "BRANCH_ID": table2Item.BRANCH_ID,
                                "SUB_MODULE_ID": table2Item.SUB_MODULE_ID,
                                "FLAG": 0
                            };
                            $scope.DATA_LIST.push(item);
                        }
                        else {
                            var item = {
                                "TABLE_ID": table2Item.TABLE_ID,
                                "BRANCH_ID": table2Item.BRANCH_ID,
                                "SUB_MODULE_ID": table2Item.SUB_MODULE_ID,
                                "FLAG": moduBranch.FLAG == true ? 1 : 0
                            };
                            $scope.DATA_LIST.push(item);
                        }
                    });

                });
            });
            CommonObj.COMMON_DT = $scope.DATA_LIST;
            CommonObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.ADMIN_API(CommonObj, 'INS_UPD_BRANCH_SUB_MODULES').then(function (data) {
                if (data.data == 1) {
                    $scope.$parent.ShowAlert('Success', 'Record updated successfully.', 3000);
                    $scope.$parent.overlay_loadingNew = "none"
                    setTimeout(function () {
                        window.location.reload();
                    }, 1000);
                }
                else {
                    $scope.$parent.ShowAlert('Error', 'Failed to update records.', 3000);
                    $scope.$parent.overlay_loadingNew = "none"
                }
            });
        }
        else {
            $scope.$parent.ShowAlert('Attention', 'Please select at lease one module and branch from the list.', 3000);
            $scope.$parent.overlay_loadingNew = "none"
        }
    };

    //--------------------------------------------------------------
});
app.controller('BranchCoversSettingForPowerInsightMappingController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $localStorage) {
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(1);
    $scope.DATA_LIST = [];
    $scope.BRANCH_LIST = [];
    $scope.ACCESS_VIEW_OR_EDIT = false;
    $scope.ON_PAGELOAD = function () {
        $scope.ACCESS_VIEW_OR_EDIT = $scope.$parent.CHECK_MODULE_ACCESS(138, 1);
    };
    $scope.GET_BRANCH_COVER_SETTINGS_FOR_POWER_INSIGHTS = function () {
        $scope.$parent.overlay_loadingNew = "block"
        CommonObj = new Object();
        CommonObj.USER_ID = 3307;// parseInt($cookies.get("USERID"));
        PrcCommMethods.ADMIN_API(CommonObj, 'GET_BRANCH_COVER_SETTINGS_FOR_POWER_INSIGHTS').then(function (data) {
            if (data.data != null && data.data.Table.length > 0) {
                $scope.BRANCH_LIST = data.data.Table;
                angular.forEach($scope.BRANCH_LIST, function (item) {
                    if (item.USE_EPOS_COVERS_IN_DASHBOARDS == true)
                        item.USE_EPOS_COVERS_IN_DASHBOARDS = 1
                    else if (item.USE_EPOS_COVERS_IN_DASHBOARDS == null || item.USE_EPOS_COVERS_IN_DASHBOARDS == false)
                        item.USE_EPOS_COVERS_IN_DASHBOARDS = 0;
                });
                $scope.$parent.overlay_loadingNew = "none";
            }
            else {
                $scope.$parent.ShowAlert('Attention', 'No record found.', 3000);
                $scope.$parent.overlay_loadingNew = "none";
            }
        });
    };
    $scope.GET_BRANCH_COVER_SETTINGS_FOR_POWER_INSIGHTS();
    $scope.INS_UPD_BRANCH_COVER_SETTINGS_FOR_POWER_INSIGHTS = function () {
        $scope.$parent.overlay_loadingNew = "block"
        angular.forEach($scope.BRANCH_LIST, function (item) {
            var item = {
                "BRANCH_ID": item.BRANCH_ID,
                "USE_EPOS_COVERS_IN_DASHBOARDS": item.USE_EPOS_COVERS_IN_DASHBOARDS
            };
            $scope.DATA_LIST.push(item);
        });
        CommonObj.COMMON_DT = $scope.DATA_LIST;
        CommonObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.ADMIN_API(CommonObj, 'INS_UPD_BRANCH_COVER_SETTINGS_FOR_POWER_INSIGHTS').then(function (data) {
            if (data.data == 1) {
                $scope.$parent.ShowAlert('Success', 'Record updated successfully.', 3000);
                $scope.$parent.overlay_loadingNew = "none"
                setTimeout(function () {
                    window.location.reload();
                }, 1000);
            }
            else {
                $scope.$parent.ShowAlert('Error', 'Failed to update records.', 3000);
                $scope.$parent.overlay_loadingNew = "none"
            }
        });
    };
});
app.controller('ReservationMappingController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $localStorage) {
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(1);
    $scope.ENTITY_LIST = [];
    $scope.BRANCH_LIST = [];
    $scope.RESERVATION_LIST = [];
    $scope.RESERVATION_STATUS_MASTER = [];
    $scope.RESERVATION_STATUS_MAPPING_TYPE = [];

    $scope.ReservationMappingSearch = {
        ENTITY_ID: null,
        BRANCH_ID: null,
        USER_ID: '',
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        ACTIVE: -1,
        INTEGRATION_SYSTEM_ID: null
    };
    $scope.GET_ENTITY_LIST = function () {
        $scope.$parent.overlay_loadingNew = "block"
        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_ID = null;
        CusModelObj.ACTIVE = 1;
        CusModelObj.PAGE_NO = 0;
        CusModelObj.USER_ID = parseInt($cookies.get("USERID"));
        CusModelObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(CusModelObj, 'ADMIN_GET_ENTITIES').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.ENTITY_LIST = data.data.Table;
                $scope.$parent.overlay_loadingNew = "none"
            }
            else {
                $scope.ENTITY_LIST = [];
                $scope.$parent.overlay_loadingNew = "none";
            };
        });
        //$scope.EposSalesCategotyMappingForm.submitted = false;      
    };
    $scope.GET_ENTITY_LIST();
    $scope.ADMIN_GET_BRANCH = function () {
        $scope.BRANCH_LIST = [];
        $scope.RESERVATION_LIST = [];
        if ($scope.ReservationMappingSearch.ENTITY_ID != null) {
            $scope.$parent.overlay_loadingNew = "block";
            ModelObj = new Object();
            ModelObj.CUSTOMER_ID = parseInt($cookies.get('CUSTOMER_ID'));
            ModelObj.ENTITY_ID = $scope.ReservationMappingSearch.ENTITY_ID;
            ModelObj.BRANCH_CODE = null;
            ModelObj.BRANCH_NAME = null;
            ModelObj.CONTACT_NAME = null;
            ModelObj.LOCATION_IDS = null;
            ModelObj.ACTIVE = 1;
            ModelObj.PAGE_NO = 0;
            ModelObj.PAGE_SIZE = 1000;
            ModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.ADMIN_API(ModelObj, 'ADMIN_GET_BRANCH').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.BRANCH_LIST = data.data.Table;
                    $scope.$parent.overlay_loadingNew = "none";
                }
                else {
                    $scope.BRANCH_LIST = [];
                    $scope.$parent.overlay_loadingNew = "none";
                }
            });
        }
        else
            $scope.$parent.overlay_loadingNew = "none";

        $scope.ReservationMappingForm.submitted = false;
    };
    $scope.GET_RESERVATION_STATUS_MASTER = function () {
        ModelObj = new Object();
        PrcCommMethods.ADMIN_API(ModelObj, 'GET_RESERVATION_STATUS_MASTER').then(function (data) {
            if (data.data != null && data.data.Table.length > 0) {
                $scope.TEMP = data.data.Table;
                var list = [];
                list = {
                    "RESERVATION_STATUS_MASTER_ID": 999,
                    "STATUS_NAME": "Delete"
                }
                $scope.TEMP.push(list);
                angular.forEach($scope.TEMP, function (item) {
                    item["IS_VISIBLE"] = true
                    $scope.RESERVATION_STATUS_MASTER.push(item);
                });
                $scope.$parent.overlay_loadingNew = "none";
            }
            else {
                $scope.RESERVATION_STATUS_MASTER = [];
                $scope.$parent.overlay_loadingNew = "none";
                $scope.$parent.ShowAlert('Attention', 'No record found on reservation status.', 3000);
            }
        });
    };
    $scope.GET_RESERVATION_STATUS_MASTER();
    $scope.GET_RESERVATION_STATUS_FOR_MAPPING = function () {
        $scope.ReservationMappingForm.submitted = true;
        if ($scope.ReservationMappingForm.$valid) {
            ModelObj = new Object();
            ModelObj.ENTITY_ID = $scope.ReservationMappingSearch.ENTITY_ID;
            ModelObj.BRANCH_ID = $scope.ReservationMappingSearch.BRANCH_ID;
            $scope.$parent.overlay_loadingNew = "block";
            PrcCommMethods.ADMIN_API(ModelObj, 'GET_RESERVATION_STATUS_FOR_MAPPING').then(function (data) {
                if (data.data != null && data.data.Table.length > 0) {
                    $scope.RESERVATION_LIST = data.data.Table;
                    $scope.$parent.overlay_loadingNew = "none";
                }
                else {
                    $scope.RESERVATION_LIST = [];
                    $scope.$parent.overlay_loadingNew = "none";
                    $scope.$parent.ShowAlert('Attention', 'No record found on reservation status.', 3000);
                }
            });
        }
    };
    $scope.INS_UPD_RESERVATION_STATUS_MAPPING = function () {
        ModelObj = new Object();
        ModelObj.ENTITY_ID = $scope.ReservationMappingSearch.ENTITY_ID;
        ModelObj.BRANCH_ID = $scope.ReservationMappingSearch.BRANCH_ID;
        ModelObj.USER_ID = parseInt($cookies.get("USERID"));
        angular.forEach($scope.RESERVATION_LIST, function (item) {
            $scope.ITEM = [];
            $scope.ITEM = {
                "MAPPING_TABLE_ID": item.MAPPING_TABLE_ID,
                "RESERVATION_STATUS": item.STATUS,
                "RESERVATION_STATUS_MASTER_ID": item.RESERVATION_STATUS_MASTER_ID,
                "DELETE_FLAG": item.DELETE_FLAG == undefined ? 0 : item.DELETE_FLAG
            };
            $scope.RESERVATION_STATUS_MAPPING_TYPE.push($scope.ITEM);
        });
        ModelObj.COMMON_DT = $scope.RESERVATION_STATUS_MAPPING_TYPE;
        $scope.ReservationMappingListForm.submitted = true;
        if ($scope.ReservationMappingListForm.$valid) {
            //PrcCommMethods.ADMIN_API(ModelObj, 'INS_UPD_RESERVATION_STATUS_MAPPING').then(function (data) {
            //    if (data.data == 1) {
            //        $scope.$parent.ShowAlert("Success", "Saved Successfully", 3000);
            //        $scope.RESET();
            //        $scope.$parent.overlay_loadingNew = "none";
            //    }
            //    else {
            //        $scope.$parent.ShowAlert('Error', 'Failed to save records.Please connect with the support team', 3000);
            //        $scope.$parent.overlay_loadingNew = "none";
            //    }
            //});
        }
    };
    $scope.RESET = function () {
        $scope.RESERVATION_LIST = [];
        $scope.BRANCH_LIST = [];
        $scope.ReservationMappingSearch = {
            ENTITY_ID: null,
            BRANCH_ID: null,
            USER_ID: '',
            PAGE_NO: 1,
            PAGE_SIZE: 1000,
            ACTIVE: -1,
            INTEGRATION_SYSTEM_ID: null
        };
    };
    $scope.DELETE_ROW = function (RESERVATION_ROW) {
        if (confirm('Want to remove/delete this row?')) {
            RESERVATION_ROW.IS_VISIBLE = false;
            RESERVATION_ROW.DELETE_FLAG = 1;
        }
    };
});
app.controller('EposIntegrationNotificationController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $localStorage) {
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(1);
    $scope.GET_INTEGRATION_SYSTEMS = function () {
        $scope.APP_PATH = location.origin;
        ModelObj = new Object();
        ModelObj.INTEGRATION_TYPE_ID = 1;
        ModelObj.MODULE_ID = 1;
        $scope.$parent.overlay_loadingNew = "block";
        $location.path();
        PrcCommMethods.ADMIN_API(ModelObj, 'GET_INTEGRATION_SYSTEMS_EPOS').then(function (data) {
            if (data.data != null && data.data.Table.length > 0) {
                $scope.INTEGRATIONSYSTEM_LIST = data.data.Table;
                $scope.$parent.overlay_loadingNew = "none";

            }
            else {
                $scope.INTEGRATIONSYSTEM_LIST = [];
                $scope.$parent.overlay_loadingNew = "none";
                $scope.$parent.ShowAlert('Attention', 'No record found.', 3000);
            }
        });
    };
    $scope.GET_INTEGRATION_SYSTEMS();
    $scope.INS_SYSTEM_NOTIFICATION = function (EPOS) {
        ModelObj = new Object();
        ModelObj.NOTIFICATION_MASTER_ID = 56;
        ModelObj.PARAMETER_FOR_DB = null;
        ModelObj.USER_ID = parseInt($cookies.get("USERID"));
        ModelObj.PARAMETER_FOR_SRVC = "New Integration request:;:Customer has requested EPOS integration for " + EPOS.SYSTEM_NAME + ".:;:support@wenodo.com:;:PARAMETER1:;:PARAMETER2:;:PARAMETER3:;:PARAMETER4:;:PARAMETER5";
        ModelObj.CUSTOMER_ID = 22;
        ModelObj.ENTITY_ID = 35;
        ModelObj.BRANCH_ID = 113;

        $location.path("Epos_Integration_Documentation").search({ "eposInt_ID": EPOS.INTEGRATION_SYSTEM_ID});
        //PrcCommMethods.ADMIN_API(ModelObj, 'INS_SYSTEM_NOTIFICATION').then(function (data) {
        //    if (data.data == 1) {
        //        $scope.$parent.ShowAlert("Success", "Saved Successfully", 3000);
        //        $scope.$parent.overlay_loadingNew = "none";
        //        window.location.href = "../AngularViews/Mapping/Epos_Integration_Documentation.html";
        //    }
        //    else {
        //        $scope.$parent.ShowAlert('Error', 'Encounter internal error.Please connect with the support team', 3000);
        //        $scope.$parent.overlay_loadingNew = "none";
        //    }
        //});
    };
});
app.controller('EposIntegrationDocumentationController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $localStorage) {
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(1);
    $scope.ON_PAGELOAD = function () {
       $scope.EPOS_INTEGRATION_SYSTEM_ID= getUrlParameter('eposInt_ID', $location.absUrl());
    };
});






