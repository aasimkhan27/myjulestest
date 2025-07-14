app.controller('CashupUserListController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    //$scope.$parent.DISPLAY_FLAG = true;
    //$scope.$parent.$parent.DISPLAY_FLAG = true;
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(1);
    //$scope.CASHUP_COMMON_CODE_Fn();
    $scope.user_Search = [];
    $scope.user_Search.CUSTOMER_ID = parseInt($cookies.get('CUSTOMER_ID'));
    $scope.user_Search.ENTITY_ID = parseInt($cookies.get('ENTITY_ID'));
    $scope.user_Search.USER_ID = parseInt($cookies.get('USERID'));
    $scope.user_Search.MODULE_ID = 1;
    $scope.user_Search.SEARCH = null;
    $scope.SELECTED_USER = null;
    $scope.PAGE_NO = 1;
    $scope.PAGE_SIZE = 999;
    $scope.DELETE_USER_DETAILS = {
        BRANCH_ID: null,
        CUSTOMER_ID: parseInt($cookies.get("CUSTOMER_ID")),
        USER_ID: $cookies.get("USERID"),
        ENTITY_ID: parseInt($cookies.get("ENTITY_ID")),
        NAME: null,
        PRIMARY_EMAIL: null,
        MOBILE_NO: null,
        MODULE_ID: 1,
        DD_DEFAULT_TEXT: $scope.$parent.DD_DEFAULT_TEXT,
        CUSTOM_CALCULATION_TYPE: $scope.$parent.DD_DEFAULT_TEXT,
        CREATED_BY: null,
        NAME: null,
        PRIMARY_EMAIL: null,
        SECONDARY_EMAIL: null,
        NOTIFICATION_EMAIL: null,
        MOBILE_CODE: $cookies.get('MOBILE_CODE'), //
        MOBILE_NO: null,
        USER_NAME: null,
        USER_ROLE: null,
        DEFAULT_ENTITY_ID: null,
        DESIGNATION: 'analyst',
    };


    $scope.GET_USER_ROLES_BY_CUSTOMER_ID = function () {
        var objuser = new Object();
        objuser.CUSTOMER_ID = $scope.user_Search.CUSTOMER_ID;
        if ($scope.user_Search.SEARCH != undefined || $scope.user_Search.SEARCH != null) {
            objuser.SEARCH = $scope.user_Search.SEARCH;
        }
        objuser.PAGE_NO = 1;
        objuser.PAGE_SIZE = 999999;
        PrcCommMethods.CASHUP_APP_API(objuser, 'GET_USER_ROLES_BY_CUSTOMER_ID').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.USERS_LIST = data.data.Table.filter(_row => _row.ENTITY_ID == $scope.user_Search.ENTITY_ID);
                $scope.MERGE_USERS($scope.USERS_LIST);
            }
        });
    };
    $scope.GET_USER_ROLES_BY_CUSTOMER_ID();

    $scope.MERGE_USERS = function (_USERS_LIST) {
        const groupedUsers = _USERS_LIST.reduce((acc, user) => {
            if (!acc[user.USER_NAME]) {
                acc[user.USER_NAME] = [];
            }
            acc[user.USER_NAME].push(user);
            return acc;
        }, {});

        const mergedUsers = Object.keys(groupedUsers).map(username => {
            const userGroup = groupedUsers[username];
            return {
                USER_ID: userGroup[0].USER_ID,
                USER_NAME: username,
                //ROLES: userGroup.map(user => (user.STANDARD_ROLE_ID != null && user.STANDARD_ROLE_ID != undefined) ? ({
                //    BRANCH_NAME: user.BRANCH_NAME,
                //    STANDARD_ROLE_NAME: user.STANDARD_ROLE_NAME,
                //    STANDARD_ROLE_ID: user.STANDARD_ROLE_ID
                //}):null),
                ROLES: userGroup.map(user => ({
                    BRANCH_NAME: user.BRANCH_NAME,
                    STANDARD_ROLE_NAME: user.STANDARD_ROLE_NAME,
                    STANDARD_ROLE_ID: user.STANDARD_ROLE_ID
                })),
                EMAIL: userGroup[0].PRIMARY_EMAIL,
                PHONE_NUMBER: userGroup[0].MOBILE_NO,
                CREATED_DATE: new Date(userGroup[0].CREATED_DATE),
                LAST_LOGIN: new Date(userGroup[0].LAST_LOGIN)
            };
        });
        angular.forEach(mergedUsers, function (_user) {
            var _tempUserRoles = angular.copy(_user.ROLES);
            angular.forEach(_user.ROLES, function (_role) {
                if (_role.STANDARD_ROLE_ID == null || _role.STANDARD_ROLE_ID == undefined) {
                    var _tempRole = _tempUserRoles.filter(_t => _t.BRANCH_NAME == _role.BRANCH_NAME)[0];
                    let index = _tempUserRoles.indexOf(_tempRole);
                    if (index !== -1) {
                        _tempUserRoles.splice(index, 1);
                    }
                }
            });
            _user.ROLES = _tempUserRoles;
        })

        $scope.USERS_LIST = mergedUsers;

    };


    $scope.EDIT_USER_Fn = function (user) {
        var url = "../Main/AdminIndex#!/Add_Cashup_User?USER_ID=" + user.USER_ID + "&USER_NAME=" + user.USER_NAME;
        window.open(url, "_self");
    };

    // Delete User Helper Functions
    $scope.MODIFIED_SITES_LIST = [];
    $scope.GET_CUSTOMERS_NOTIFICATIONS = function () {
        CommonObj = new Object();
        CommonObj.CUSTOMER_ID = $scope.DELETE_USER_DETAILS.CUSTOMER_ID;
        CommonObj.ENTITY_ID = $scope.DELETE_USER_DETAILS.ENTITY_ID;
        CommonObj.MODULE_ID = $scope.DELETE_USER_DETAILS.MODULE_ID;
        PrcCommMethods.CASHUP_APP_API(CommonObj, 'GET_CUSTOMERS_NOTIFICATIONS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.NOTIFICATIONS_MASTER_LIST.forEach(function (_notification) {
                    var matchingMapping = data.data.Table.find(function (mapping) {
                        return _notification.TABLE_ID === mapping.NTFCTN_MSTR_ID;
                    });
                    if (matchingMapping) {
                        _notification.ACTIVE = matchingMapping.ACTIVE == 1 ? true : false;
                    }
                });
            }
            else {
                $scope.CUST_NOTIFICATIONS_LIST = [];
            }

        });
    };

    $scope.GET_USER_NTFCTN_PREFRENCES = function () {
        CommonObj = new Object();
        CommonObj.ENTITY_ID = $scope.DELETE_USER_DETAILS.ENTITY_ID;
        CommonObj.USER_ID = $scope.DELETE_USER_DETAILS.USER_ID;
        PrcCommMethods.CASHUP_APP_API(CommonObj, 'GET_USER_NTFCTN_PREFRENCES').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.NOTIFICATIONS_MASTER_LIST.forEach(function (_notification) {
                    var matchingMapping = data.data.Table.find(function (mapping) {
                        return _notification.TABLE_ID === mapping.NOTIFICATION_MASTER_ID;
                    });
                    if (matchingMapping) {
                        _notification.ACTIVE = matchingMapping.EMAIL_NOTIFICATION;
                    }
                });
            }
            else {
                $scope.CUST_NOTIFICATIONS_LIST = [];
            }
            $scope.INS_UPD_USER();
            
        });
    }

    $scope.GET_NOTIFICATIONS_MASTER_BY_MODULE_ID = function () {
        CommonObj = new Object();
        CommonObj.MODULE_ID = $scope.DELETE_USER_DETAILS.MODULE_ID;
        PrcCommMethods.CASHUP_APP_API(CommonObj, 'GET_NOTIFICATIONS_MASTER_BY_MODULE_ID').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.NOTIFICATIONS_MASTER_LIST = data.data.Table;
                if ($scope.DELETE_USER_DETAILS.USER_ID !== undefined) {
                    $scope.GET_USER_NTFCTN_PREFRENCES();
                }
                else {
                    $scope.GET_CUSTOMERS_NOTIFICATIONS();
                }
            }
            else {
                $scope.NOTIFICATIONS_MASTER_LIST = [];
            }
        });
    };

    
    $scope.GET_CASHUP_BASIC_SETUP = function (Sites) {
        var CashupModelObj = {
            CUSTOMER_ID: $scope.DELETE_USER_DETAILS.CUSTOMER_ID,
            ENTITY_ID: $scope.DELETE_USER_DETAILS.ENTITY_ID
        };
        PrcCommMethods.CASHUP_APP_API(CashupModelObj, 'GET_CASHUP_TYPE').then(function (data) {
            if (data.data) {
                $scope.CashupTypeData = data.data;
                Sites.forEach(function (site) {

                    var matchedData = $scope.CashupTypeData.Table.find(function (cashup) {
                        return cashup.BRANCH_ID === site.BRANCH_ID;
                    });

                    if (matchedData) {
                        site.CASHUP_TYPE = matchedData.CASHUP_TYPE;
                        site.CASHUP_TYPE_MSTR_ID = matchedData.CASHUP_TYPE_MSTR_ID;
                        site.WILl_USE_IN_CASHUP = true;
                    }
                    else {
                        site.WILl_USE_IN_CASHUP = false;
                    }

                });
            } else {
                $scope.CashupTypeData = [];
                console.error("No Cashup Types available.");
            }
        }).catch(function (error) {
            console.error("Error fetching Cashup Types:", error);
        });
    };

    $scope.GET_PRIVILEGE = function (_flag) {
        CommonObj = new Object();
        CommonObj.MODULE_ID = $scope.DELETE_USER_DETAILS.MODULE_ID;
        CommonObj.ENTITY_ID = $scope.DELETE_USER_DETAILS.ENTITY_ID;
        PrcCommMethods.ADMIN_API(CommonObj, 'GET_PRIVILEGE').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.PRIVILAGE_LIST = data.data.Table;
                angular.forEach($scope.SITES_LIST, function (_site) {
                    _site.PRIVILAGE_LIST = data.data.Table;
                });

                angular.forEach($scope.PRIVILAGE_LIST, function (_val) {
                    angular.forEach($scope.SITES_LIST, function (_site) {
                        _site['ACTIVE_' + _val.PRIVILEGE_ID] = false;
                    });
                })
                $scope.GET_USER_ROLES_BY_CUSTOMER_ID();
                $scope.GET_USER_ROLES_BY_USER_ID();

            }
            else {
                $scope.PRIVILAGE_LIST = [];
            }
        });
    };

    $scope.GET_MODULE_ROLES = function () {
        var CommObj = new Object();
        CommObj.CUSTOMER_ID = $scope.DELETE_USER_DETAILS.CUSTOMER_ID;
        CommObj.MODULE_ID = $scope.DELETE_USER_DETAILS.MODULE_ID;
        PrcCommMethods.CASHUP_APP_API(CommObj, 'GET_MODULE_ROLES').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.SITES_LIST.forEach(function (site) {
                    site.STANDARD_ROLE_ID = '';
                    site.MODULE_ROLES_LIST = data.data.Table;
                });

            }
        });
    };

    $scope.GET_MODULE_ROLES_WITH_PRIVILEGE = function () {
        var UserModelObj = new Object();
        UserModelObj.CUSTOMER_ID = $scope.DELETE_USER_DETAILS.CUSTOMER_ID;
        UserModelObj.MODULE_ID = $scope.DELETE_USER_DETAILS.MODULE_ID;
        PrcCommMethods.CASHUP_APP_API(UserModelObj, 'GET_MODULE_ROLES_WITH_PRIVILEGE').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.ROLES_WITH_PRIVILEGE = data.data.Table;
            }
            else if (data.data == null) {
                $scope.$parent.ShowAlert("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
            else {
                $scope.MODULE_ROLES_LIST = [];
            }
            $scope.GET_NOTIFICATIONS_MASTER_BY_MODULE_ID();
        });
    };

    $scope.ADMIN_GET_BRANCH_LIST = function () {
        var Obj = new Object();
        Obj.CUSTOMER_ID = $scope.DELETE_USER_DETAILS.CUSTOMER_ID;
        Obj.ENTITY_ID = $scope.DELETE_USER_DETAILS.ENTITY_ID;

        PrcCommMethods.CASHUP_APP_API(Obj, 'ADMIN_GET_BRANCH_LIST').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.SITES_LIST = data.data.Table;
                $scope.GET_CASHUP_BASIC_SETUP($scope.SITES_LIST);
                $scope.GET_PRIVILEGE(0);
                $scope.GET_MODULE_ROLES();
                $scope.GET_MODULE_ROLES_WITH_PRIVILEGE();
            }
        });
    };

    $scope.GET_USER_ROLES_BY_USER_ID = function () {
        CommonObj = new Object();
        CommonObj.USER_ID = $scope.DELETE_USER_DETAILS.USER_ID;
        PrcCommMethods.CASHUP_APP_API(CommonObj, 'GET_USER_ROLES_BY_USER_ID').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.SAVED_MODULE_ROLES = data.data.Table.filter(_row => row.ENTITY_ID == $scope.user_Search.ENTITY_ID);

                $scope.SAVED_MODULE_ROLES.forEach(function (_role) {
                    let USER_PRIVILEGE_IDS = _role.USER_PRIVILEGE_IDS.split(',').map(function (id) { return parseInt(id, 10) });
                    $scope.SITES_LIST.forEach(function (site) {
                        if (site.BRANCH_ID == _role.BRANCH_ID) {
                            site.STANDARD_ROLE_ID = _role.STANDARD_ROLE_ID;
                            site.CUSTOM_ROLE_NAME = _role.STANDARD_ROLE_NAME;
                            $scope.PRIVILAGE_LIST.forEach(function (_privilege) {
                                var matched = USER_PRIVILEGE_IDS.includes(_privilege.PRIVILEGE_ID);
                                if (matched) {
                                    site['ACTIVE_' + _privilege.PRIVILEGE_ID] = true;
                                }
                                else {
                                    site['ACTIVE_' + _privilege.PRIVILEGE_ID] = false;
                                }
                            })
                        }
                    });
                    var MODIFIED_SITES_LIST = new Object();
                    MODIFIED_SITES_LIST.ENTITY_ID = $scope.DELETE_USER_DETAILS.ENTITY_ID;
                    MODIFIED_SITES_LIST.BRANCH_ID = _role.BRANCH_ID;
                    MODIFIED_SITES_LIST.STANDARD_ROLE_ID = _role.STANDARD_ROLE_ID;
                    MODIFIED_SITES_LIST.ACTIVE = 1;
                    MODIFIED_SITES_LIST.USER_PRIVILEGE_IDS = _role.USER_PRIVILEGE_IDS;
                    $scope.MODIFIED_SITES_LIST.push(MODIFIED_SITES_LIST);
                })
                $scope.GET_NOTIFICATIONS_MASTER_BY_MODULE_ID();
            }
            else {
                $scope.VENDOR_LIST = data.data.Table.length > 0 ? data.data.Table : [];
            }
        });
    };

    $scope.INS_UPD_USER = function () {
        var CashupAppObj = new Object();
        CashupAppObj.CUSTOMER_ID = $scope.DELETE_USER_DETAILS.CUSTOMER_ID;
        CashupAppObj.USER_ID = $scope.DELETE_USER_DETAILS.USER_ID;
        CashupAppObj.CREATED_BY = $cookies.get("USERID");
        CashupAppObj.ACTIVE = 0; // For Delete User
        CashupAppObj.NAME = $scope.DELETE_USER_DETAILS.USER_NAME;
        CashupAppObj.PRIMARY_EMAIL = $scope.DELETE_USER_DETAILS.EMAIL == null ? '' : $scope.DELETE_USER_DETAILS.EMAIL;
        CashupAppObj.SECONDARY_EMAIL = $scope.DELETE_USER_DETAILS.SECONDARY_EMAIL == null ? null : $scope.DELETE_USER_DETAILS.SECONDARY_EMAIL;
        CashupAppObj.NOTIFICATION_EMAIL = $scope.DELETE_USER_DETAILS.EMAIL;
        CashupAppObj.MOBILE_CODE = $scope.DELETE_USER_DETAILS.MOBILE_CODE == null ? '' : $scope.DELETE_USER_DETAILS.MOBILE_CODE;
        CashupAppObj.MOBILE_NO = $scope.DELETE_USER_DETAILS.MOBILE_NO == null ? null : parseFloat($scope.DELETE_USER_DETAILS.MOBILE_NO);
        CashupAppObj.USER_NAME = $scope.DELETE_USER_DETAILS.USER_NAME;
        //CashupAppObj.USER_ROLE_TYPE = [];

        if ($scope.MODIFIED_SITES_LIST.length != 0) {
            CashupAppObj.USER_ROLE_TYPE = angular.copy($scope.MODIFIED_SITES_LIST);
        }
        else {
            CashupAppObj.USER_ROLE_TYPE = [];
            angular.forEach($scope.SITES_LIST, function (_site) {
                var user_empty_role_obj = new Object();
                user_empty_role_obj.ENTITY_ID = $scope.DELETE_USER_DETAILS.ENTITY_ID;
                user_empty_role_obj.BRANCH_ID = _site.BRANCH_ID;
                user_empty_role_obj.STANDARD_ROLE_ID = null;
                user_empty_role_obj.ACTIVE = 1;
                user_empty_role_obj.USER_PRIVILEGE_IDS = "";
                CashupAppObj.USER_ROLE_TYPE.push(user_empty_role_obj);
            });
        }
        //CashupAppObj.USER_ROLE_TYPE = angular.copy($scope.MODIFIED_SITES_LIST);
        CashupAppObj.DEFAULT_ENTITY_ID = $scope.DELETE_USER_DETAILS.ENTITY_ID;
        CashupAppObj.DESIGNATION = $scope.DELETE_USER_DETAILS.DESIGNATION == null ? '' : $scope.DELETE_USER_DETAILS.DESIGNATION;
        CashupAppObj.ENTITY_ID = $scope.DELETE_USER_DETAILS.ENTITY_ID;

        //CashupAppObj.CUSTOMERS_NOTIFICATIONS = [];
        CashupAppObj.CUSTOMERS_NOTIFICATIONS = [];
        angular.forEach($scope.NOTIFICATIONS_MASTER_LIST, function (_notification) {
            var notificationObj = new Object();
            notificationObj.NTFCTN_MSTR_ID = _notification.TABLE_ID;
            notificationObj.ACTIVE = _notification.ACTIVE ? 1 : 0;
            CashupAppObj.CUSTOMERS_NOTIFICATIONS.push(notificationObj);
        });

        PrcCommMethods.CASHUP_APP_API(CashupAppObj, 'INS_UPD_USER').then(function (data) {
            if (data.data > 0) {
                $scope.$parent.ShowAlertBox("Success", 'User deleted successfully', 3000);
            }
            else {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }

            $scope.GET_USER_ROLES_BY_CUSTOMER_ID();
        });
    };
    
    // Helper Function Ends here

    $scope.POP_DELETE_USER_Fn = function (user) {
        $scope.SELECTED_USER = user;
    };
    $scope.DELETE_USER_Fn = function (selected_user) {
        $scope.DELETE_USER_DETAILS.CUSTOMER_ID = $scope.user_Search.CUSTOMER_ID;
        $scope.DELETE_USER_DETAILS.ENTITY_ID = $scope.user_Search.ENTITY_ID;
        $scope.DELETE_USER_DETAILS.USER_NAME = selected_user.USER_NAME;
        $scope.DELETE_USER_DETAILS.USER_ID = selected_user.USER_ID;
        $scope.DELETE_USER_DETAILS.MOBILE_NO = selected_user.PHONE_NUMBER;
        //$scope.INS_UPD_USER();
        $scope.ADMIN_GET_BRANCH_LIST();
        
    };


    $scope.EXPORT_USERS_LIST = function (export_flag) {
        
        var export_dataTable = [];
        angular.forEach($scope.USERS_LIST, function (_user) {
            var export_user_obj = new Object();
            export_user_obj.USER_NAME = _user.USER_NAME;
            var roleString = "";
            angular.forEach(_user.ROLES, function (_role) {
                if (_role.STANDARD_ROLE_ID != null && _role.STANDARD_ROLE_ID != undefined) {
                    if (roleString == "") {
                        roleString = _role.BRANCH_NAME + ":" + _role.STANDARD_ROLE_NAME;
                    }
                    else {
                        roleString = roleString + ", " + _role.BRANCH_NAME + ":" + _role.STANDARD_ROLE_NAME;
                    }
                }
            })
            export_user_obj.ROLES = roleString;
            export_user_obj.DATE = _user.CREATED_DATE;
            export_user_obj.EMAIL = _user.EMAIL;
            export_user_obj.PHONE_NUMBER = _user.PHONE_NUMBER;
            export_user_obj.LAST_LOGIN = _user.LAST_LOGIN;
            export_dataTable.push(export_user_obj)
        });
        var CashupAppModelObj = new Object();
        CashupAppModelObj.USERS_EXPORT_LIST = export_dataTable;
        CashupAppModelObj.EXPORT_FLAG = export_flag;
        CashupAppModelObj.FILE_PATH = "/CahupUsersExport_" + "/CUSTOMER_" + $scope.user_Search.CUSTOMER_ID + "/" + "USER_ID_" + $scope.user_Search.USER_ID + "/" + (export_flag == 1 ? "CSV" : "XLSX") + "/";
        CashupAppModelObj.FILE_NAME = "CashupUsersList";
        PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'EXPORT_USERS_LIST').then(function (data) {
            if (data.data != null) {
                $scope.SERVER_FILE_PATH = '/' + data.data.FOLDER_NAME + data.data.RETURN_FILE_NAME;
                $scope.FILE_NAME = CashupAppModelObj.FILE_NAME;
                window.location.href = $scope.SERVER_FILE_PATH;
            } else {
                alert("Export failed. Please try again.");
            }
        });
    }
    $scope.$on('$destroy', function () {
        $('.modal.show').modal('hide');
    });
});