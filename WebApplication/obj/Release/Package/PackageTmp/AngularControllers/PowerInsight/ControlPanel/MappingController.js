app.controller('MappingController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $localStorage) {
    $scope.REDIRECTION_PAGE = function (Path, ACCESS) {
        $location.path(Path);
    };
    $scope.$parent.PAGE_HEADER = 'Epos Sales Category Mapping';
    $scope.$parent.urlpath = 'Epos Sales Category Mapping';
});
app.controller('CategotyMappingController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $localStorage) {
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(1);
    $scope.ENTITY_LIST = [];
    $scope.INTEGRATIONSYSTEM_LIST = [];
    $scope.SUB_MODULES_BY_MODULE_ID_LIST = [];
    $scope.BRANCH_LIST = [];
    $scope.PAGE_HEADER = 'Epos Sales Category Mapping';
    //------------------Category Mapping-------------------------
    $scope.EPOS_SALES_CATEGORY_CATEGORY_MASTER_MAPPING_LIST = [];
    $scope.EposSalesCategotyMappingSearch = {
        ENTITY_ID: null,
        USER_ID: '',
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        ACTIVE: -1,
        INTEGRATION_SYSTEM_ID: null,
        DISPLAY_TEXT_ENTITY: "Select",
        DISPLAY_TEXT_BRANCH: "Select",
        DISPLAY_TEXT_INTEGRATION_SYSTEM_NAME: "Select",
    };
    $scope.GET_BRANCH_LIST_FOR_POWER_INSIGHTS = function () {
        $scope.BRANCH_LIST = [];
        $scope.$parent.overlay_loadingNew = "block"
        CommonObj = new Object();
        CommonObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.ADMIN_API(CommonObj, 'GET_BRANCH_SUB_MODULES_FOR_POWER_INSIGHTS').then(function (data) {
            if (data.data != null && data.data.Table1) {
                $scope.BRANCH_LIST = data.data.Table1;
                $scope.$parent.overlay_loadingNew = "none"
            }
            else {
                $scope.BRANCH_LIST = [{ "BRANCH_ID": null, "BRANCH_NAME": "Select" }];
            }
        });
    };
    $scope.GET_BRANCH_LIST_FOR_POWER_INSIGHTS();
    $scope.GET_INTEGRATION_SYSTEMS = function () {
        CommonObj = new Object();
        CommonObj.INTEGRATION_TYPE_ID = 1;
        CommonObj.MODULE_ID = 1;
        PrcCommMethods.ADMIN_API(CommonObj, 'GET_INTEGRATION_SYSTEMS_EPOS').then(function (data) {
            if (data.data != null && data.data.Table.length > 0)
                $scope.INTEGRATIONSYSTEM_LIST = $scope.INTEGRATIONSYSTEM_LIST.concat(data.data.Table);
            else {
                $scope.INTEGRATIONSYSTEM_LIST = [];
                $scope.INTEGRATIONSYSTEM_LIST = [{ "INTEGRATION_SYSTEM_ID": null, "SYSTEM_NAME": "Select" }];
            }
        });

    };
    $scope.GET_CATEGORY_MASTER = function () {
        $scope.CATEGORY_MASTER_LIST = [];
        var CustmObj = new Object();
        CustmObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CustmObj.BRANCH_ID = $scope.EposSalesCategotyMappingSearch.BRANCH_ID;
        PrcCommMethods.ADMIN_API(CustmObj, 'GET_CATEGORY_MASTER').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.CATEGORY_MASTER_LIST = data.data.Table;
                var ITEM = { CATEGORY_NAME: "-Select-", COLOR: null, ID: null };
                $scope.CATEGORY_MASTER_LIST.push(ITEM);
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
            CommModelObj.ENTITY_ID = $scope.BRANCH_LIST.filter(p => p.BRANCH_ID == $scope.EposSalesCategotyMappingSearch.BRANCH_ID)[0]["ENTITY_ID"];
            CommModelObj.BRANCH_ID = $scope.EposSalesCategotyMappingSearch.BRANCH_ID;
            CommModelObj.INTEGRATION_SYSTEM_ID = $scope.EposSalesCategotyMappingSearch.INTEGRATION_SYSTEM_ID;
            $scope.EPOS_SALES_CATEGORY_CATEGORY_MASTER_MAPPING_LIST = [];
            PrcCommMethods.ADMIN_API(CommModelObj, 'GET_EPOS_SALES_CATEGORY_CATEGORY_MASTER_MAPPING').then(function (data) {
                if (data.data != null && data.data.Table.length > 0) {
                    $scope.EPOS_SALES_CATEGORY_CATEGORY_MASTER_MAPPING_LIST = data.data.Table;
                    //$scope.EPOS_SALES_CATEGORY_CATEGORY_MASTER_MAPPING_LIST = $scope.EPOS_SALES_CATEGORY_CATEGORY_MASTER_MAPPING_LIST.filter(p => p.CATEGORY_ID != "");
                    if ($scope.EPOS_SALES_CATEGORY_CATEGORY_MASTER_MAPPING_LIST.length == 0) {
                        $scope.$parent.ShowAlertBox('Attention', 'No record found for category mapping.', 3000);
                    }
                    $scope.$parent.overlay_loadingNew = "none";
                }
                else {
                    $scope.EPOS_SALES_CATEGORY_CATEGORY_MASTER_MAPPING_LIST = [];
                    $scope.$parent.ShowAlertBox('Attention', 'No record found.', 3000);
                    $scope.$parent.overlay_loadingNew = "none";
                };
            });
            $scope.EposSalesCategotyMappingForm.submitted = false;
        }
    };
    $scope.INS_UPD_EPOS_SALES_CATEGORY_CATEGORY_MASTER_MAPPING = function () {
        $scope.EposSalesCategotyMappingListForm.submitted = true;
        $scope.RESULT_SET = [];
        angular.forEach($scope.EPOS_SALES_CATEGORY_CATEGORY_MASTER_MAPPING_LIST, function (item) {
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
                var CommModelObj = new Object();
                CommModelObj.ENTITY_ID = $scope.BRANCH_LIST.filter(p => p.BRANCH_ID == $scope.EposSalesCategotyMappingSearch.BRANCH_ID)[0]["ENTITY_ID"];
                CommModelObj.BRANCH_ID = $scope.EposSalesCategotyMappingSearch.BRANCH_ID;
                CommModelObj.INTEGRATION_SYSTEM_ID = $scope.EposSalesCategotyMappingSearch.INTEGRATION_SYSTEM_ID;
                CommModelObj.USER_ID = parseInt($cookies.get("USERID"));
                CommModelObj.CATEGORY_MASTER_MAPPING = $scope.RESULT_SET;
                PrcCommMethods.ADMIN_API(CommModelObj, 'INS_UPD_EPOS_SALES_CATEGORY_CATEGORY_MASTER_MAPPING').then(function (data) {
                    if (data.data == 1) {
                        $scope.$parent.ShowAlertBox("Success", "Saved Successfully", 3000);
                        $scope.$parent.overlay_loadingNew = "none";
                        $scope.EPOS_SALES_CATEGORY_CATEGORY_MASTER_MAPPING_LIST = [];
                        $scope.EposSalesCategotyMappingSearch.DISPLAY_TEXT_BRANCH = 'Select';
                        $scope.EposSalesCategotyMappingSearch.BRANCH_ID = null;
                        $scope.INTEGRATIONSYSTEM_LIST = [];
                        $scope.INTEGRATIONSYSTEM_LIST = [{ "INTEGRATION_SYSTEM_ID": null, "INTEGRATION_SYSTEM_NAME": "Select", "INTEGRATION_TYPE_ID": null }];
                        $scope.EposSalesCategotyMappingSearch.DISPLAY_TEXT_INTEGRATION_SYSTEM_NAME = $scope.INTEGRATIONSYSTEM_LIST[0].INTEGRATION_SYSTEM_NAME;
                        $scope.EposSalesCategotyMappingSearch.INTEGRATION_SYSTEM_ID = $scope.INTEGRATIONSYSTEM_LIST[0].INTEGRATION_SYSTEM_ID;
                    }
                    else {
                        $scope.$parent.ShowAlertBox('Attention', 'Please Select Active/In-Active Option.', 3000); $scope.EposSalesCategotyMappingForm.submitted = false;
                        $scope.$parent.overlay_loadingNew = "none";
                    }
                });
            }
            else {
                $scope.$parent.ShowAlertBox('Attention', 'Please select category mapping.', 3000); $scope.EposSalesCategotyMappingForm.submitted = false;
                $scope.$parent.overlay_loadingNew = "none";
            }
        }
    };
    $scope.GET_INTEGRATION_DETAILS_BY_CUST_ENT_BRNH = function () {
        $scope.$parent.overlay_loadingNew = "block";
        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_ID = 0;
        CusModelObj.ENTITY_ID = $scope.BRANCH_LIST.filter(p => p.BRANCH_ID == $scope.EposSalesCategotyMappingSearch.BRANCH_ID)[0]["ENTITY_ID"];
        CusModelObj.BRANCH_ID = $scope.EposSalesCategotyMappingSearch.BRANCH_ID;
        if ($scope.BRANCH_LIST.filter(p => p.BRANCH_ID == $scope.EposSalesCategotyMappingSearch.BRANCH_ID)[0]["ENTITY_ID"] != null && $scope.EposSalesCategotyMappingSearch.BRANCH_ID != null) {
            PrcCommMethods.ADMIN_API(CusModelObj, 'GET_INTEGRATION_DETAILS_BY_CUST_ENT_BRNH').then(function (data) {
                if (data.data != null && data.data.Table.length > 0) {
                    if (data.data.Table.filter(p => p.INTEGRATION_TYPE_ID == 1).length == 0) {
                        $scope.INTEGRATIONSYSTEM_LIST = [];
                        $scope.INTEGRATIONSYSTEM_LIST = [{ "INTEGRATION_SYSTEM_ID": null, "INTEGRATION_SYSTEM_NAME": "Select", "INTEGRATION_TYPE_ID": null }];
                        $scope.$parent.ShowAlertBox('Attention', 'No record found', 3000);
                    }
                    else {
                        $scope.INTEGRATIONSYSTEM_LIST = [];
                        $scope.EposSalesCategotyMappingSearch.INTEGRATION_SYSTEM_ID = data.data.Table.filter(p => p.INTEGRATION_TYPE_ID == 1)[0]['INTEGRATION_SYSTEM_ID'];
                        $scope.EposSalesCategotyMappingSearch.DISPLAY_TEXT_INTEGRATION_SYSTEM_NAME = data.data.Table.filter(p => p.INTEGRATION_TYPE_ID == 1)[0]['INTEGRATION_SYSTEM_NAME'];
                        $scope.GET_EPOS_SALES_CATEGORY_CATEGORY_MASTER_MAPPING();
                    }
                    $scope.$parent.overlay_loadingNew = "none";
                }
                else {
                    $scope.INTEGRATIONSYSTEM_LIST = [];
                    $scope.INTEGRATIONSYSTEM_LIST = [{ "INTEGRATION_SYSTEM_ID": null, "INTEGRATION_SYSTEM_NAME": "Select", "INTEGRATION_TYPE_ID": null }];
                    $scope.$parent.ShowAlertBox('Attention', $scope.ENTITY_LIST.filter(p => p.ENTITY_ID == $scope.EposSalesCategotyMappingSearch.ENTITY_ID)[0]["ENTITY_NAME"] + ', is not mapped with the integration system.', 3000);
                    $scope.$parent.overlay_loadingNew = "none";
                };
            });
        }
        else {
            $scope.$parent.overlay_loadingNew = "none";
        }
    };

    //----------------------------------------------------------

    $scope.BRANCH_CHANGE_Fn = function (parameters) {
        $scope.EPOS_SALES_CATEGORY_CATEGORY_MASTER_MAPPING_LIST = [];
        $scope.EposSalesCategotyMappingSearch.DISPLAY_TEXT_BRANCH = parameters.BRANCH_NAME;
        $scope.EposSalesCategotyMappingSearch.BRANCH_ID = parameters.BRANCH_ID;
        if ($scope.EposSalesCategotyMappingSearch.BRANCH_ID != null) {
            $scope.INTEGRATIONSYSTEM_LIST = [];
            $scope.INTEGRATIONSYSTEM_LIST = [{ "INTEGRATION_SYSTEM_ID": null, "INTEGRATION_SYSTEM_NAME": "Select", "INTEGRATION_TYPE_ID": null }];
            $scope.EposSalesCategotyMappingSearch.DISPLAY_TEXT_INTEGRATION_SYSTEM_NAME = $scope.INTEGRATIONSYSTEM_LIST[0].INTEGRATION_SYSTEM_NAME;
            $scope.GET_INTEGRATION_DETAILS_BY_CUST_ENT_BRNH();
        }
        else if ($scope.EposSalesCategotyMappingSearch.BRANCH_ID == null) {
            $scope.INTEGRATIONSYSTEM_LIST = [];
            $scope.INTEGRATIONSYSTEM_LIST = [{ "INTEGRATION_SYSTEM_ID": null, "INTEGRATION_SYSTEM_NAME": "Select", "INTEGRATION_TYPE_ID": null }];
            $scope.EposSalesCategotyMappingSearch.DISPLAY_TEXT_INTEGRATION_SYSTEM_NAME = $scope.INTEGRATIONSYSTEM_LIST[0].INTEGRATION_SYSTEM_NAME;
            $scope.EposSalesCategotyMappingSearch.INTEGRATION_SYSTEM_ID = $scope.INTEGRATIONSYSTEM_LIST[0].INTEGRATION_SYSTEM_ID;
        }
    };
    $scope.INTEGRATION_CHANGE_Fn = function (parameters) {
        $scope.EposSalesCategotyMappingSearch.DISPLAY_TEXT_INTEGRATION_SYSTEM_NAME = parameters.SYSTEM_NAME;
        $scope.EposSalesCategotyMappingSearch.INTEGRATION_SYSTEM_ID = parameters.INTEGRATION_SYSTEM_ID;
    };
    $scope.Fn_CATEGORY_CLICK = function (cat, cat_line) {
        cat_line.SELECTED_CATEGORY_NAME = cat.CATEGORY_NAME;
        cat_line.CATEGORY_MASTER_ID = cat.ID;
    };
});
app.controller('SubscriptionMappingController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $localStorage) {
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(1);
    $scope.MODULES_BRANCH_LIST = [];
    $scope.SUBSCRIPTION_LIST = [];
    $scope.DATA_LIST = [];
    $scope.TABLE2_DATA = [];
    $scope.PI_BRANCH_LIST = [];
    $scope.ACCESS_VIEW_OR_EDIT = false;

    $scope.ON_PAGELOAD = function () {
        $scope.ACCESS_VIEW_OR_EDIT = $scope.$parent.CHECK_MODULE_ACCESS(138, 1);
    };
    //---- Subscription Mapping Functions-----------------------
    $scope.GET_BRANCH_LIST_FOR_POWER_INSIGHTS = function () {

        $scope.$parent.overlay_loadingNew = "block"
        CommonObj = new Object();
        CommonObj.USER_ID = parseInt($cookies.get("USERID"));
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
                    $scope.PI_BRANCH_LIST.push(item);

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
                    $scope.PI_BRANCH_LIST.push(item);

                }
            });
            $scope.$parent.overlay_loadingNew = "none"
        });
    };
    $scope.GET_BRANCH_LIST_FOR_POWER_INSIGHTS();
    $scope.MODULE_CHECK = function () {
        if ($scope.SUBSCRIPTION_LIST.filter(p => p.FLAG == true).length == 0) {
            angular.forEach($scope.PI_BRANCH_LIST, function (item) {
                item.FLAG = false;
            });
        }
    };
    $scope.INS_UPD_BRANCH_SUB_MODULES = function () {
        $scope.DATA_LIST = [];
        if ($scope.SUBSCRIPTION_LIST.filter(p => p.FLAG == true).length > 0 && $scope.PI_BRANCH_LIST.filter(p => p.FLAG == true).length > 0) {
            CommonObj = new Object();
            angular.forEach($scope.SUBSCRIPTION_LIST, function (sbusItem) {
                angular.forEach($scope.PI_BRANCH_LIST, function (moduBranch) {
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
                    $scope.$parent.ShowAlertBox('Success', 'Record updated successfully.', 3000);
                    $scope.$parent.overlay_loadingNew = "none"
                    setTimeout(function () {
                        window.location.reload();
                    }, 1000);
                }
                else {
                    $scope.$parent.ShowAlertBox('Error', 'Failed to update records.', 3000);
                    $scope.$parent.overlay_loadingNew = "none"
                }
            });
        }
        else {
            $scope.$parent.ShowAlertBox('Attention', 'Please select at lease one module and branch from the list.', 3000);
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
        CommonObj.USER_ID = parseInt($cookies.get("USERID"));
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
                $scope.$parent.ShowAlertBox('Attention', 'No record found.', 3000);
                $scope.$parent.overlay_loadingNew = "none";
            }
        });
    };
    $scope.GET_BRANCH_COVER_SETTINGS_FOR_POWER_INSIGHTS();
    $scope.INS_UPD_BRANCH_COVER_SETTINGS_FOR_POWER_INSIGHTS = function () {
        $scope.DATA_LIST = [];
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
                $scope.$parent.ShowAlertBox('Success', 'Record updated successfully.', 3000);
                $scope.$parent.overlay_loadingNew = "none"
                setTimeout(function () {
                    window.location.reload();
                }, 1000);
            }
            else {
                $scope.$parent.ShowAlertBox('Error', 'Failed to update records.', 3000);
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
        INTEGRATION_SYSTEM_ID: null,
        DISPLAY_TEXT_ENTITY: "Select",
        DISPLAY_TEXT_BRANCH: "Select",
        DISPLAY_TEXT_INTEGRATION_SYSTEM_NAME: "Select",

    };

    $scope.GET_BRANCH_LIST_FOR_POWER_INSIGHTS = function () {
        $scope.BRANCH_LIST = [];
        $scope.$parent.overlay_loadingNew = "block"
        CommonObj = new Object();
        CommonObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.ADMIN_API(CommonObj, 'GET_BRANCH_SUB_MODULES_FOR_POWER_INSIGHTS').then(function (data) {
            if (data.data != null && data.data.Table1) {
                $scope.BRANCH_LIST = data.data.Table1;
                $scope.$parent.overlay_loadingNew = "none"
            }
            else {
                $scope.BRANCH_LIST = [{ "BRANCH_ID": null, "BRANCH_NAME": "Select" }];
            }
        });
    };
    $scope.GET_BRANCH_LIST_FOR_POWER_INSIGHTS();
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
                $scope.$parent.ShowAlertBox('Attention', 'No record found on reservation status.', 3000);
            }
        });
    };
    $scope.GET_RESERVATION_STATUS_MASTER();
    $scope.GET_RESERVATION_STATUS_FOR_MAPPING = function () {
        $scope.ReservationMappingForm.submitted = true;
        $scope.RESERVATION_LIST = [];
        if ($scope.ReservationMappingForm.$valid) {
            ModelObj = new Object();
            ModelObj.ENTITY_ID = $scope.BRANCH_LIST.filter(p => p.BRANCH_ID == $scope.ReservationMappingSearch.BRANCH_ID)[0]["ENTITY_ID"];
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
                    $scope.$parent.ShowAlertBox('Attention', 'No record found.', 3000);
                }
            });
        }
    };
    $scope.INS_UPD_RESERVATION_STATUS_MAPPING = function () {
        $scope.RESERVATION_STATUS_MAPPING_TYPE = [];
        ModelObj = new Object();
        ModelObj.ENTITY_ID = $scope.BRANCH_LIST.filter(p => p.BRANCH_ID == $scope.ReservationMappingSearch.BRANCH_ID)[0]["ENTITY_ID"];
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

        if ($scope.RESERVATION_LIST.length > 0) {
            PrcCommMethods.ADMIN_API(ModelObj, 'INS_UPD_RESERVATION_STATUS_MAPPING').then(function (data) {
                if (data.data == 1) {
                    $scope.$parent.ShowAlertBox("Success", "Saved Successfully", 3000);
                    $scope.$parent.overlay_loadingNew = "none";
                    $scope.RESERVATION_LIST = [];
                    $scope.RESERVATION_STATUS_MAPPING_TYPE = [];
                    $scope.ReservationMappingSearch.DISPLAY_TEXT_BRANCH = "Select";
                    $scope.ReservationMappingSearch.BRANCH_ID = null;
                }
                else {
                    $scope.$parent.ShowAlertBox('Error', 'Failed to save records.Please connect with the support team', 3000);
                    $scope.$parent.overlay_loadingNew = "none";
                }
            });
        }
        else {
            $scope.$parent.ShowAlertBox('Attention', "Didn't find any records to save/update", 3000);
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
        if (confirm('Do you want to remove/delete this row?')) {
            RESERVATION_ROW.IS_VISIBLE = false;
            RESERVATION_ROW.DELETE_FLAG = 1;
        }
    };
    //------------------------------//
    $scope.BRANCH_CHANGE_Fn = function (parameters) {
        $scope.ReservationMappingSearch.DISPLAY_TEXT_BRANCH = parameters.BRANCH_NAME;
        $scope.ReservationMappingSearch.BRANCH_ID = parameters.BRANCH_ID;
        $scope.GET_RESERVATION_STATUS_FOR_MAPPING();
    };
    $scope.Fn_RESERVATION_CLICK = function (RESE_MAS_STATUS, RESERVATION) {
        RESERVATION.RESERVATION_STATUS_MASTER_ID = RESE_MAS_STATUS.RESERVATION_STATUS_MASTER_ID;

    };
});
app.controller('InventoryMappingController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $localStorage) {
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(1);
    $scope.ENTITY_LIST = [];
    $scope.BRANCH_LIST = [];
    $scope.INTEGRATIONSYSTEM_LIST = [];
    $scope.INTEGRATION_DETAILS_BY_CUST_ENT_BRNH = [];

    $scope.InventoryMappingSearch = {
        ENTITY_ID: null,
        BRANCH_ID: null,
        USER_ID: '',
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        ACTIVE: -1,
        INTEGRATION_SYSTEM_ID: null,
        DISPLAY_TEXT_ENTITY: "Select",
        DISPLAY_TEXT_BRANCH: "Select",
        DISPLAY_TEXT_INTEGRATION_SYSTEM_NAME: "Select",
        INTEGRATION_SYSTEM_ID: null
    };
    $scope.GET_CATEGORY_MASTER = function () {
        var CustmObj = new Object();
        var CustmObj = new Object();
        CustmObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CustmObj.BRANCH_ID = $scope.InventoryMappingSearch.BRANCH_ID;
        PrcCommMethods.ADMIN_API(CustmObj, 'GET_CATEGORY_MASTER').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.CATEGORY_MASTER_LIST = data.data.Table;
                var ITEM = { CATEGORY_NAME: "-Select-", COLOR: null, ID: null };
                $scope.CATEGORY_MASTER_LIST.push(ITEM);
            }
        });
    };
    $scope.GET_CATEGORY_MASTER();
    $scope.GET_BRANCH_LIST_FOR_POWER_INSIGHTS = function () {
        $scope.BRANCH_LIST = [];
        $scope.$parent.overlay_loadingNew = "block"
        CommonObj = new Object();
        CommonObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.ADMIN_API(CommonObj, 'GET_BRANCH_SUB_MODULES_FOR_POWER_INSIGHTS').then(function (data) {
            if (data.data != null && data.data.Table1) {
                $scope.BRANCH_LIST = data.data.Table1;
                $scope.$parent.overlay_loadingNew = "none"
            }
            else {
                $scope.BRANCH_LIST = [{ "BRANCH_ID": null, "BRANCH_NAME": "Select" }];
            }
        });
    };
    $scope.GET_BRANCH_LIST_FOR_POWER_INSIGHTS();
    $scope.GET_INVENTORY_CATEGORY_TO_WENODO_CATEGORY_MAPPING = function () {
        if ($scope.InventoryMappingSearch.BRANCH_ID != null && $scope.InventoryMappingSearch.BRANCH_ID != undefined) {
            ModelObj = new Object();
            ModelObj.ENTITY_ID = $scope.BRANCH_LIST.filter(p => p.BRANCH_ID == $scope.InventoryMappingSearch.BRANCH_ID)[0]["ENTITY_ID"];
            ModelObj.BRANCH_ID = $scope.InventoryMappingSearch.BRANCH_ID;
            ModelObj.INTEGRATION_SYSTEM_ID = $scope.INTEGRATION_DETAILS_BY_CUST_ENT_BRNH.filter(p => p.INTEGRATION_TYPE_ID == 7 && p.MODULE_ID == 4)[0]["INTEGRATION_SYSTEM_ID"];
            $scope.$parent.overlay_loadingNew = "block";
            PrcCommMethods.ADMIN_API(ModelObj, 'GET_INVENTORY_CATEGORY_TO_WENODO_CATEGORY_MAPPING').then(function (data) {
                if (data.data.Table != undefined && data.data.Table.length > 0) {
                    $scope.INVENTORY_CATEGORY_LIST = data.data.Table;
                    $scope.$parent.overlay_loadingNew = "none";
                }
                else {
                    $scope.INVENTORY_CATEGORY_LIST = [];
                    $scope.$parent.overlay_loadingNew = "none";
                    $scope.$parent.ShowAlertBox('Attention', 'No record found.', 3000);
                }
            });
        }
    };
    $scope.GET_INTEGRATION_DETAILS_BY_CUST_ENT_BRNH = function () {
        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_ID = 0;
        CusModelObj.ENTITY_ID = $scope.BRANCH_LIST.filter(p => p.BRANCH_ID == $scope.InventoryMappingSearch.BRANCH_ID)[0]["ENTITY_ID"];
        CusModelObj.BRANCH_ID = null;// $scope.InventoryMappingSearch.BRANCH_ID;
        PrcCommMethods.ADMIN_API(CusModelObj, 'GET_INTEGRATION_DETAILS_BY_CUST_ENT_BRNH').then(function (data) {
            if (data.data != null && data.data.Table.length > 0) {
                $scope.INTEGRATIONSYSTEM_LIST = data.data.Table;
                if ($scope.INTEGRATIONSYSTEM_LIST.filter(p => p.INTEGRATION_TYPE_ID == 7 && p.MODULE_ID == 4).length > 0) {
                    $scope.INTEGRATION_DETAILS_BY_CUST_ENT_BRNH = $scope.INTEGRATIONSYSTEM_LIST.filter(p => p.INTEGRATION_TYPE_ID == 7 && p.MODULE_ID == 4)
                    $scope.GET_INVENTORY_CATEGORY_TO_WENODO_CATEGORY_MAPPING();
                }
                else
                    $scope.$parent.ShowAlertBox('Attention', 'No data found..', 3000);
            }
            else {
                $scope.$parent.ShowAlertBox('Attention', 'Integration data not found.', 3000);

            };
        });
    };
    $scope.INS_UPD_INVENTORY_CATEGORY_TO_WENODO_CATEGORY_MAPPING = function () {
        $scope.INVENTORY_CATEGORY_MAPPING_TYPE = [];
        ModelObj = new Object();
        ModelObj.INTEGRATION_SYSTEM_ID = $scope.INTEGRATION_DETAILS_BY_CUST_ENT_BRNH.filter(p => p.INTEGRATION_TYPE_ID == 7 && p.MODULE_ID == 4)[0]["INTEGRATION_SYSTEM_ID"];
        ModelObj.ENTITY_ID = $scope.BRANCH_LIST.filter(p => p.BRANCH_ID == $scope.InventoryMappingSearch.BRANCH_ID)[0]["ENTITY_ID"];
        ModelObj.BRANCH_ID = $scope.InventoryMappingSearch.BRANCH_ID;
        ModelObj.USER_ID = parseInt($cookies.get("USERID"));
        angular.forEach($scope.INVENTORY_CATEGORY_LIST, function (item) {
            $scope.ITEM = [];
            $scope.ITEM = {
                "TYPE_NAME": null,
                "INVENTORY_CATEGORY_NAME": item.INVENTORY_CATEGORY_NAME,
                "CATEGORY_MASTER_ID": item.CATEGORY_MASTER_ID,
                "TABLE_ID": item.TABLE_ID
            };
            $scope.INVENTORY_CATEGORY_MAPPING_TYPE.push($scope.ITEM);
        });
        ModelObj.COMMON_DT = $scope.INVENTORY_CATEGORY_MAPPING_TYPE;

        if ($scope.INVENTORY_CATEGORY_MAPPING_TYPE.length > 0) {
            PrcCommMethods.ADMIN_API(ModelObj, 'INS_UPD_INVENTORY_CATEGORY_TO_WENODO_CATEGORY_MAPPING').then(function (data) {
                if (data.data == 1) {
                    $scope.$parent.ShowAlertBox("Success", "Saved Successfully", 3000);
                    $scope.$parent.overlay_loadingNew = "none";
                    $scope.INVENTORY_CATEGORY_LIST = [];
                    $scope.InventoryMappingSearch.DISPLAY_TEXT_BRANCH = "Select";
                    $scope.InventoryMappingSearch.BRANCH_ID = null;
                }
                else {
                    $scope.$parent.ShowAlertBox('Error', 'Failed to save records.Please connect with the support team', 3000);
                    $scope.$parent.overlay_loadingNew = "none";
                }
            });
        }
        else {
            $scope.$parent.ShowAlertBox('Attention', "Didn't find any records to save/update", 3000);
        }
    };

    //------------------------------//
    $scope.Fn_BRANCH_CHANGE = function (parameters) {
        $scope.InventoryMappingSearch.DISPLAY_TEXT_BRANCH = parameters.BRANCH_NAME;
        $scope.InventoryMappingSearch.BRANCH_ID = parameters.BRANCH_ID;
        $scope.GET_INTEGRATION_DETAILS_BY_CUST_ENT_BRNH();
    };
    $scope.Fn_CATEGORY_CLICK = function (cat, cat_line) {
        cat_line.SELECTED_CATEGORY_NAME = cat.CATEGORY_NAME;
        cat_line.CATEGORY_MASTER_ID = cat.ID;
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
                $scope.$parent.ShowAlertBox('Attention', 'No record found.', 3000);
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
        $location.path("Epos_Integration_Documentation").search({ "eposInt_ID": EPOS.INTEGRATION_SYSTEM_ID });
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
        $scope.EPOS_INTEGRATION_SYSTEM_ID = getUrlParameter('eposInt_ID', $location.absUrl());
    };
});
app.controller('RevenuewithReservationMappingController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $localStorage) {
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(1);
    $scope.ENTITY_LIST = [];
    $scope.PW_BRANCH_LIST = [];
    $scope.RESERVATION_LIST = [];
    $scope.RESERVATION_STATUS_MASTER = [];
    $scope.RESERVATION_STATUS_MAPPING_TYPE = [];
    $scope.CONTROLLER_LOAD = function () {
    }
    $scope.RevenueReservationMappingSearch = {
        ENTITY_ID: null,
        BRANCH_ID: null,
        USER_ID: '',
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        ACTIVE: -1,
        INTEGRATION_SYSTEM_ID: null,
        DISPLAY_TEXT_ENTITY: "Select",
        DISPLAY_TEXT_BRANCH: "Select",
        DISPLAY_TEXT_INTEGRATION_SYSTEM_NAME: "Select",
    };
    $scope.BLANK_DATA = { TABLE_ID: 0, EPOS_REVENUE_CENTER_ID: 'Select', EPOS_REVENUE_CENTER: '', RESERVATION_REVENUE_CENTER: null };
    $scope.REVENUE_LIST = [];
    $scope.ADD_MORE_Fn = function () {
        if ($scope.RevenueReservationMappingSearch.BRANCH_ID > 0) {
            $scope.REVENUE_LIST.push(angular.copy($scope.BLANK_DATA));
        }
        else {
            $scope.$parent.ShowAlertBox('Error', 'Please select site', 3000);
        }
    };
    $scope.GET_BRANCH_LIST_FOR_POWER_INSIGHTS = function () {
        $scope.PW_BRANCH_LIST = [];
        $scope.$parent.overlay_loadingNew = "block"
        CommonObj = new Object();
        CommonObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.ADMIN_API(CommonObj, 'GET_BRANCH_SUB_MODULES_FOR_POWER_INSIGHTS').then(function (data) {
            if (data.data != null && data.data.Table1) {
                $scope.PW_BRANCH_LIST = data.data.Table1;
                $scope.$parent.overlay_loadingNew = "none"
            }
            else {
                $scope.PW_BRANCH_LIST = [{ "BRANCH_ID": null, "BRANCH_NAME": "Select" }];
            }
        });
    };
    $scope.GET_BRANCH_LIST_FOR_POWER_INSIGHTS();


    $scope.GET_RESERVATION_SYSTEMS_REVENUE_CENTER = function (_map_data) {
        $scope.RESERVATION_SYSTEMS_REVENUE_CENTER_LIST = [];
        ModelObj = new Object();
        ModelObj.BRANCH_ID = $scope.RevenueReservationMappingSearch.BRANCH_ID;
        $scope.$parent.overlay_loadingNew = "block";
        PrcCommMethods.DASHBOARD_MODULES_API(ModelObj, 'GET_RESERVATION_SYSTEMS_REVENUE_CENTER', 'POWERINSIGHTAPI').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.RESERVATION_SYSTEMS_REVENUE_CENTER_LIST = data.data.Table;
                $scope.$parent.overlay_loadingNew = "none";

                angular.forEach(_map_data.data.Table, function (_loopValue) {
                    var siteIndex = $scope.RESERVATION_SYSTEMS_REVENUE_CENTER_LIST.findIndex(x => x.RESERVATION_REVENUE_CENTER == _loopValue.RESERVATION_REVENUE_CENTER);
                    if (siteIndex >= 0) {
                        $scope.ADD_REVENU.push(angular.copy($scope.RESERVATION_SYSTEMS_REVENUE_CENTER_LIST[siteIndex]));
                        $scope.RESERVATION_SYSTEMS_REVENUE_CENTER_LIST = $scope.RESERVATION_SYSTEMS_REVENUE_CENTER_LIST.filter(x => x.RESERVATION_REVENUE_CENTER !== _loopValue.RESERVATION_REVENUE_CENTER);
                    }
                });
                $scope.REVENUE_LIST = angular.copy(_map_data.data.Table);
                $scope.EPOS_REVENUE_CENTER_MAPPING_WITH_RESERVATION_SYSTEMS_LIST = _map_data.data.Table;
            }
            else {
                $scope.RESERVATION_SYSTEMS_REVENUE_CENTER_LIST = [];
                $scope.$parent.overlay_loadingNew = "none";
            }
        });
    };
    $scope.GET_EPOS_REVENUE_CENTER_MAPPING_WITH_RESERVATION_SYSTEMS = function () {
        $scope.EPOS_REVENUE_CENTER_MAPPING_WITH_RESERVATION_SYSTEMS_LIST = [];
        ModelObj = new Object();
        ModelObj.BRANCH_ID = $scope.RevenueReservationMappingSearch.BRANCH_ID;
        $scope.$parent.overlay_loadingNew = "block";
        PrcCommMethods.DASHBOARD_MODULES_API(ModelObj, 'GET_EPOS_REVENUE_CENTER_MAPPING_WITH_RESERVATION_SYSTEMS', 'POWERINSIGHTAPI').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.REVENUE_LIST = [];

                $scope.GET_RESERVATION_SYSTEMS_REVENUE_CENTER(data);


                $scope.$parent.overlay_loadingNew = "none";
            }
            else {
                $scope.EPOS_REVENUE_CENTER_MAPPING_WITH_RESERVATION_SYSTEMS_LIST = [];
                $scope.$parent.overlay_loadingNew = "none";
            }
        });
    };


    $scope.INS_UPD_EPOS_REVENUE_CENTER_MAPPING_WITH_RESERVATION_SYSTEMS = function () {
        $scope.RESERVATION_STATUS_MAPPING_TYPE = [];
        ModelObj = new Object();
        ModelObj.ENTITY_ID = $scope.RevenueReservationMappingSearch.ENTITY_ID;
        ModelObj.BRANCH_ID = $scope.RevenueReservationMappingSearch.BRANCH_ID;
        ModelObj.USER_ID = parseInt($cookies.get("USERID"));
        ModelObj.EPOS_REVENUE_CENTER_MAPPING_WITH_RESERVATION_SYSTEMS_TYPE = [];
        angular.forEach($scope.REVENUE_LIST, function (_loop_value) {
            var readonly = new Object();
            readonly.TABLE_ID = _loop_value.TABLE_ID;
            readonly.EPOS_REVENUE_CENTER_ID = _loop_value.EPOS_REVENUE_CENTER_ID;
            readonly.EPOS_REVENUE_CENTER = _loop_value.EPOS_REVENUE_CENTER;
            readonly.RESERVATION_REVENUE_CENTER = _loop_value.RESERVATION_REVENUE_CENTER == undefined || _loop_value.RESERVATION_REVENUE_CENTER == null ? null : _loop_value.RESERVATION_REVENUE_CENTER;
            ModelObj.EPOS_REVENUE_CENTER_MAPPING_WITH_RESERVATION_SYSTEMS_TYPE.push(readonly);
        });
        PrcCommMethods.DASHBOARD_MODULES_API(ModelObj, 'INS_UPD_EPOS_REVENUE_CENTER_MAPPING_WITH_RESERVATION_SYSTEMS', 'POWERINSIGHTAPI').then(function (data) {
            if (data.data == 1) {
                $scope.$parent.ShowAlertBox("Success", "Saved Successfully", 3000);
                $scope.$parent.overlay_loadingNew = "none";
                $scope.RevenueReservationMappingSearch.DISPLAY_TEXT_BRANCH = "Select";
                $scope.RevenueReservationMappingSearch.BRANCH_ID = null;
            }
            else {
                $scope.$parent.ShowAlertBox('Error', 'Failed to save records.Please connect with the support team', 3000);
                $scope.$parent.overlay_loadingNew = "none";
            }
        });
    };
    $scope.RESET = function () {
        $scope.RESERVATION_LIST = [];
        $scope.BRANCH_LIST = [];
        $scope.RevenueReservationMappingSearch = {
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
        if (confirm('Do you want to remove/delete this row?')) {
            RESERVATION_ROW.IS_VISIBLE = false;
            RESERVATION_ROW.DELETE_FLAG = 1;
        }
    };
    //------------------------------//
    $scope.BRANCH_CHANGE_Fn = function (parameters) {
        $scope.RevenueReservationMappingSearch.DISPLAY_TEXT_BRANCH = parameters.BRANCH_NAME;
        $scope.RevenueReservationMappingSearch.BRANCH_ID = parameters.BRANCH_ID;
        $scope.RevenueReservationMappingSearch.ENTITY_ID = parameters.ENTITY_ID;
        //$scope.GET_RESERVATION_SYSTEMS_REVENUE_CENTER();
        $scope.GET_EPOS_REVENUE_CENTER_MAPPING_WITH_RESERVATION_SYSTEMS();
    };
    $scope.Fn_REVENUE_RESERVATION_CLICK = function (_reservation, _revenue) {

        let copyreplace_revenue = angular.copy(_revenue.RESERVATION_REVENUE_CENTER);
        if (_reservation == '') {
            var resultIndex = $scope.ADD_REVENU.findIndex(x => x.RESERVATION_REVENUE_CENTER == angular.copy(_revenue.RESERVATION_REVENUE_CENTER));
            if (resultIndex >= 0) {
                $scope.RESERVATION_SYSTEMS_REVENUE_CENTER_LIST.push(angular.copy($scope.ADD_REVENU[resultIndex]));

                $scope.ADD_REVENU = $scope.ADD_REVENU.filter(x => x.RESERVATION_REVENUE_CENTER !== angular.copy(_revenue.RESERVATION_REVENUE_CENTER));

            }
            _revenue.RESERVATION_REVENUE_CENTER = $scope.DD_DEFAULT_TEXT;
            // _revenue.BRANCH_ID = '';
        }
        else {
            _revenue.RESERVATION_REVENUE_CENTER = _reservation.RESERVATION_REVENUE_CENTER;
            var resultreplaceIndex = $scope.ADD_REVENU.findIndex(x => x.RESERVATION_REVENUE_CENTER == angular.copy(copyreplace_revenue));
            if (resultreplaceIndex >= 0) {
                $scope.RESERVATION_SYSTEMS_REVENUE_CENTER_LIST.push(angular.copy($scope.ADD_REVENU[resultreplaceIndex]));
                $scope.ADD_REVENU = $scope.ADD_REVENU.filter(x => x.RESERVATION_REVENUE_CENTER !== angular.copy(copyreplace_revenue));

            }
            var resultIndex = $scope.RESERVATION_SYSTEMS_REVENUE_CENTER_LIST.findIndex(x => x.RESERVATION_REVENUE_CENTER == _reservation.RESERVATION_REVENUE_CENTER);
            if (resultIndex >= 0) {
                $scope.ADD_REVENU.push(angular.copy($scope.RESERVATION_SYSTEMS_REVENUE_CENTER_LIST[resultIndex]));
                $scope.RESERVATION_SYSTEMS_REVENUE_CENTER_LIST = $scope.RESERVATION_SYSTEMS_REVENUE_CENTER_LIST.filter(x => x.RESERVATION_REVENUE_CENTER != _reservation.RESERVATION_REVENUE_CENTER);
            }
        };
    }
    $scope.ADD_REVENU = [];
    $scope.Fn_EPOS_REVENU_CLICK = function (_reservation_system, _revenue) {
        _revenue.EPOS_REVENUE_CENTER = _reservation_system.EPOS_REVENUE_CENTER;
        _revenue.EPOS_REVENUE_CENTER_ID = _reservation_system.EPOS_REVENUE_CENTER_ID;
    };
    $scope.$parent.PI_child_scope = $scope;
});
app.controller('RevenueCenterSortingController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $localStorage) {
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(1);
    $scope.CONTROLLER_LOAD = function () { }
    $scope.RevenueCenterSearch = {
        USER_ID: '',
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        ACTIVE: -1,
    };
    $scope.GET_EPOS_REVENUE_CENTER_SORTING = function () {
        $scope.$parent.overlay_loadingNew = "block"
        CommonObj = new Object();
        CommonObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        PrcCommMethods.DASHBOARD_MODULES_API(CommonObj, 'GET_EPOS_REVENUE_CENTER_SORTING', 'POWERINSIGHTAPI').then(function (data) {
            if (data.data != null && data.data.Table) {
                $scope.REVENUE_CENTER_SORTING_LIST = data.data.Table;
                $scope.$parent.overlay_loadingNew = "none"
            }
            else {
                $scope.REVENUE_CENTER_SORTING_LIST = [];
            }
        });
    };
    $scope.GET_EPOS_REVENUE_CENTER_SORTING();

    $scope.INS_UPD_EPOS_REVENUE_CENTER_SORTING = function () {
        ModelObj = new Object();
        ModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        ModelObj.USER_ID = parseInt($cookies.get("USERID"));
        ModelObj.EPOS_REVENUE_CENTER_SORTING = [];
        angular.forEach($scope.REVENUE_CENTER_SORTING_LIST, function (_loop_value) {
            var readonly = new Object();
            readonly.TABLE_ID = _loop_value.TABLE_ID;
            readonly.SORT_ORDER = _loop_value.SORT_ORDER;
            readonly.EPOS_REVENUE_CENTER_ID = _loop_value.EPOS_REVENUE_CENTER_ID == undefined || _loop_value.EPOS_REVENUE_CENTER_ID == null ? null : _loop_value.EPOS_REVENUE_CENTER_ID;
            readonly.EPOS_REVENUE_CENTER = _loop_value.EPOS_REVENUE_CENTER == undefined || _loop_value.EPOS_REVENUE_CENTER == null ? null : _loop_value.EPOS_REVENUE_CENTER;
            ModelObj.EPOS_REVENUE_CENTER_SORTING.push(readonly);
        });
        PrcCommMethods.DASHBOARD_MODULES_API(ModelObj, 'INS_UPD_EPOS_REVENUE_CENTER_SORTING', 'POWERINSIGHTAPI').then(function (data) {
            if (data.data == 1) {
                $scope.GET_EPOS_REVENUE_CENTER_SORTING();
                $scope.$parent.ShowAlertBox("Success", "Saved Successfully", 3000);
                $scope.$parent.overlay_loadingNew = "none";
            }
            else {
                $scope.$parent.ShowAlertBox('Error', $scope.$parent.SOMETHINGWENTWRONG, 3000);
                $scope.$parent.overlay_loadingNew = "none";
            }
        });
    };
    $scope.RESET = function () {
        $scope.RevenueCenterSearch = {
            PAGE_NO: 1,
            PAGE_SIZE: 1000,
            ACTIVE: -1,
        };
    };



    $scope.$parent.PI_child_scope = $scope;
});
app.controller('OpeningHoursController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $localStorage) {
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(1);
    $scope.CONTROLLER_LOAD = function () { }
    $scope.TimeSearch = {
        USER_ID: '',
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        ACTIVE: -1,
    };
    $scope.GET_CUSTOMER_OPENING_HOUR = function () {
        $scope.$parent.overlay_loadingNew = "block"
        CommonObj = new Object();
        CommonObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        PrcCommMethods.DASHBOARD_MODULES_API(CommonObj, 'GET_CUSTOMER_OPENING_HOUR', 'POWERINSIGHTAPI').then(function (data) {
            if (data.data != null && data.data.Table) {
                $scope.CUSTOMER_OPENING_HOUR_LIST = data.data.Table;
                $scope.$parent.overlay_loadingNew = "none"
            }
            else {
                $scope.CUSTOMER_OPENING_HOUR_LIST = [];
            }
        });
    };
    $scope.GET_CUSTOMER_OPENING_HOUR();

    $scope.UPD_CUSTOMER_OPENING_HOUR = function () {
        const momentDate = $scope.TimeSearch.START_TIME;
        ModelObj = new Object();
        ModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        ModelObj.OPENING_HOUR = momentDate.hour();
        PrcCommMethods.DASHBOARD_MODULES_API(ModelObj, 'UPD_CUSTOMER_OPENING_HOUR', 'POWERINSIGHTAPI').then(function (data) {
            if (data.data == 1) {
                $scope.GET_CUSTOMER_OPENING_HOUR();
                $scope.RESET();
                $scope.$parent.ShowAlertBox("Success", "Saved Successfully", 3000);
                $scope.$parent.overlay_loadingNew = "none";
            }
            else {
                $scope.$parent.ShowAlertBox('Error', $scope.$parent.SOMETHINGWENTWRONG, 3000);
                $scope.$parent.overlay_loadingNew = "none";
            }
        });
    };
    $scope.RESET = function () {
        $scope.TimeSearch = {
            PAGE_NO: 1,
            PAGE_SIZE: 1000,
            ACTIVE: -1,
        };
    };
    $scope.EDIT_Fn = function (_open) {
        $scope.TimeSearch.START_TIME = moment().hour(_open.OPENING_HOUR);
    }
    $scope.$parent.PI_child_scope = $scope;
});






