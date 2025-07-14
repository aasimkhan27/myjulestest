app.controller('CashUpUsersController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    //$scope.$parent.DISPLAY_FLAG = true;
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(1);
    //$scope.CASHUP_COMMON_CODE_Fn();
    $scope.UserDetails = {
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
        SECONDARY_EMAIL: null,
        NOTIFICATION_EMAIL: null,
        MOBILE_CODE: '+91',
        USER_NAME: null,
        USER_ROLE: null,
        DEFAULT_ENTITY_ID: null,
        DESIGNATION: null,
    }
    $scope.Is_Edit_UserDetails = {
        USER_ID: getUrlParameter('USER_ID', $location.absUrl()),
        USER_NAME: decodeURIComponent(getUrlParameter('USER_NAME', $location.absUrl()))
    }

    $scope.user_Search = [];
    $scope.user_Search.CUSTOMER_ID = $cookies.get('CUSTOMER_ID');
    $scope.user_Search.ENTITY_ID = $cookies.get('ENTITY_ID');
    $scope.user_Search.MODULE_ID = 1;
    $scope.DD_DEFAULT_TEXT = $scope.$parent.DD_DEFAULT_TEXT
    $scope.MODIFIED_SITES_LIST = [];

    $scope.GET_CUSTOMERS_NOTIFICATIONS = function () {
        CommonObj = new Object();
        CommonObj.CUSTOMER_ID = $scope.user_Search.CUSTOMER_ID;
        CommonObj.ENTITY_ID = $scope.user_Search.ENTITY_ID;
        CommonObj.MODULE_ID = $scope.user_Search.MODULE_ID;
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
    }

    $scope.GET_USER_NTFCTN_PREFRENCES = function () {
        CommonObj = new Object();
        CommonObj.ENTITY_ID = $scope.user_Search.ENTITY_ID;
        CommonObj.USER_ID = $scope.Is_Edit_UserDetails.USER_ID;
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
        });
    }

    $scope.GET_NOTIFICATIONS_MASTER_BY_MODULE_ID = function () {
        CommonObj = new Object();
        CommonObj.MODULE_ID = $scope.UserDetails.MODULE_ID;
        PrcCommMethods.CASHUP_APP_API(CommonObj, 'GET_NOTIFICATIONS_MASTER_BY_MODULE_ID').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.NOTIFICATIONS_MASTER_LIST = data.data.Table;
                if ($scope.Is_Edit_UserDetails.USER_ID !== undefined) {
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

    $scope.GET_CASHUP_TYPE = function (Sites) {
        var CashupModelObj = {
            CUSTOMER_ID: $scope.user_Search.CUSTOMER_ID,
            ENTITY_ID: $scope.user_Search.ENTITY_ID
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
    }

    $scope.GET_PRIVILEGE = function (_flag) {
        CommonObj = new Object();
        CommonObj.MODULE_ID = $scope.UserDetails.MODULE_ID;
        CommonObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
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

                if ($scope.Is_Edit_UserDetails.USER_ID !== undefined) {
                    $scope.GET_USER_ROLES_BY_CUSTOMER_ID();
                    $scope.GET_USER_ROLES_BY_USER_ID();
                }
                else { $scope.RESET_Fn(); }
            }
            else {
                $scope.PRIVILAGE_LIST = [];
            }
        });
    };

    $scope.GET_MODULE_ROLES = function () {
        var CommObj = new Object();
        CommObj.CUSTOMER_ID = $scope.user_Search.CUSTOMER_ID
        CommObj.MODULE_ID = 1;
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
        UserModelObj.CUSTOMER_ID = $scope.UserDetails.CUSTOMER_ID;
        UserModelObj.MODULE_ID = $scope.UserDetails.MODULE_ID;
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
        });
    }

    $scope.RESET_Fn = function () {
        $scope.User_form.submitted = false;
        $scope.UserDetails = {
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
            MOBILE_CODE: '+91',
            MOBILE_NO: null,
            USER_NAME: null,
            USER_ROLE: null,
            DEFAULT_ENTITY_ID: null,
            DESIGNATION: 'analyst',
        }


        $scope.SITES_LIST.forEach(function (site) {

            site.STANDARD_ROLE_ID = null;
            site.CUSTOM_ROLE_NAME = $scope.UserDetails.DD_DEFAULT_TEXT;
            $scope.PRIVILAGE_LIST.forEach(function (_privilege) {

                site['ACTIVE_' + _privilege.PRIVILEGE_ID] = false;


                site['ACTIVE_' + _privilege.PRIVILEGE_ID] = false;

            })

        });

    }

    $scope.RESET_NOTIFCATION = function () {
        $scope.NOTIFICATIONS_MASTER_LIST.forEach(function (_notification) {
            _notification.ACTIVE = false;

        });
    }

    $scope.ADMIN_GET_BRANCH_LIST = function () {
        var Obj = new Object();
        Obj.CUSTOMER_ID = $scope.user_Search.CUSTOMER_ID;
        Obj.ENTITY_ID = $scope.user_Search.ENTITY_ID;
        PrcCommMethods.CASHUP_APP_API(Obj, 'ADMIN_GET_BRANCH_LIST').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.SITES_LIST = data.data.Table;
                $scope.GET_CASHUP_TYPE($scope.SITES_LIST);
                $scope.GET_PRIVILEGE(0);
                $scope.GET_MODULE_ROLES();
                $scope.GET_MODULE_ROLES_WITH_PRIVILEGE();


            }
        });
    };

    $scope.ADMIN_GET_BRANCH_LIST();
    $scope.GET_USER_ROLES_BY_CUSTOMER_ID = function () {
        var objuser = new Object();
        objuser.CUSTOMER_ID = $scope.user_Search.CUSTOMER_ID;
        objuser.SEARCH = $scope.Is_Edit_UserDetails.USER_NAME;
        objuser.PAGE_NO = 1;
        objuser.PAGE_SIZE = 999;
        PrcCommMethods.CASHUP_APP_API(objuser, 'GET_USER_ROLES_BY_CUSTOMER_ID').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.USERS_LIST = data.data.Table.filter(_row => _row.ENTITY_ID == $scope.UserDetails.ENTITY_ID);
                $scope.MERGE_USERS($scope.USERS_LIST);
            }
        });
    }

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
                USER_NAME: username,
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


        $scope.UserDetails.NAME = mergedUsers[0].USER_NAME;
        $scope.UserDetails.MOBILE_NO = mergedUsers[0].PHONE_NUMBER;
        $scope.UserDetails.PRIMARY_EMAIL = mergedUsers[0].EMAIL;

    };

    $scope.GET_USER_ROLES_BY_USER_ID = function () {
        CommonObj = new Object();
        CommonObj.USER_ID = $scope.Is_Edit_UserDetails.USER_ID;
        PrcCommMethods.CASHUP_APP_API(CommonObj, 'GET_USER_ROLES_BY_USER_ID').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.SAVED_MODULE_ROLES = data.data.Table.filter(_row => _row.ENTITY_ID == $scope.UserDetails.ENTITY_ID);

                $scope.SAVED_MODULE_ROLES.forEach(function (_role) {
                    let USER_PRIVILEGE_IDS = _role.USER_PRIVILEGE_IDS.split(',').map(function (id) { return parseInt(id, 10) });
                    $scope.SITES_LIST.forEach(function (site) {
                        if (site.BRANCH_ID == _role.BRANCH_ID) {
                            site.STANDARD_ROLE_ID = _role.STANDARD_ROLE_ID;
                            site.CUSTOM_ROLE_NAME = _role.STANDARD_ROLE_NAME;
                            site.IS_ANY_ADMIN = false;
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
                    angular.forEach($scope.SITES_LIST, function (_site) {
                        let selected_Role_id = _site.STANDARD_ROLE_ID;
                        $scope.SELECTED_ROLE_PRIVILEGES = $filter('filter')($scope.ROLES_WITH_PRIVILEGE, { STANDARD_ROLE_ID: selected_Role_id });

                        $scope.PRIVILAGE_LIST.forEach(function (_privilege) {

                            var matchingPrivilege = $scope.SELECTED_ROLE_PRIVILEGES.find(function (privilege) {
                                return privilege.PRIVILEGE_ID === _privilege.PRIVILEGE_ID;
                            });


                            _site['INACTIVE_' + _privilege.PRIVILEGE_ID] = matchingPrivilege ? matchingPrivilege.FLAG == 0 ? true : false : true;

                        });
                    })
                    var MODIFIED_SITES_LIST = new Object();
                    MODIFIED_SITES_LIST.ENTITY_ID = $scope.UserDetails.ENTITY_ID;
                    MODIFIED_SITES_LIST.BRANCH_ID = _role.BRANCH_ID;
                    MODIFIED_SITES_LIST.STANDARD_ROLE_ID = _role.STANDARD_ROLE_ID;
                    MODIFIED_SITES_LIST.ACTIVE = 1;
                    MODIFIED_SITES_LIST.USER_PRIVILEGE_IDS = _role.USER_PRIVILEGE_IDS;
                    $scope.MODIFIED_SITES_LIST.push(MODIFIED_SITES_LIST);
                })
            }
            else {
                $scope.VENDOR_LIST = data.data.Table.length > 0 ? data.data.Table : [];
            }
        });
    }

    $scope.GET_NOTIFICATIONS_MASTER_BY_MODULE_ID();

    $scope.nginit_notification = function (_notification) {
        _notification.ACTIVE = false;
    }
    $scope.SET_NOTIFICATION = function (_notification) {
        _notification.ACTIVE = _notification.ACTIVE ? true : false;
    }
    $scope.SET_FLAG = function (_role) {
        _role.FLAG = _role.FLAG == 1 ? 1 : 0;
    }


    $scope.SELECTED_STANDARD_ROLE_Fn = function (_role, _site) {
        if (_role == '') {
            _site.CUSTOM_ROLE_NAME = $scope.UserDetails.DD_DEFAULT_TEXT;
            _site.STANDARD_ROLE_ID = '';
            angular.forEach($scope.MODIFIED_SITES_LIST, function (_mod) {

                if (_mod.BRANCH_ID == _site.BRANCH_ID) {
                    _mod.ACTIVE = 1;
                    _mod.STANDARD_ROLE_ID = null;
                    _mod.USER_PRIVILEGE_IDS = null;
                }

            });
            $scope.PRIVILAGE_LIST.forEach(function (_privilege) {
                _site['ACTIVE_' + _privilege.PRIVILEGE_ID] = false;
            })

        }
        else {
            _site.CUSTOM_ROLE_NAME = _role.ROLE_NAME;
            _site.STANDARD_ROLE_ID = _role.STANDARD_ROLE_ID;
            let selected_Role_id = _role.STANDARD_ROLE_ID;
            $scope.SELECTED_ROLE_PRIVILEGES = $filter('filter')($scope.ROLES_WITH_PRIVILEGE, { STANDARD_ROLE_ID: selected_Role_id });
            var USER_PRIVILEGE_IDS = [];
            $scope.PRIVILAGE_LIST.forEach(function (_privilege) {

                var matchingPrivilege = $scope.SELECTED_ROLE_PRIVILEGES.find(function (privilege) {
                    return privilege.PRIVILEGE_ID === _privilege.PRIVILEGE_ID;
                });

                _site['ACTIVE_' + _privilege.PRIVILEGE_ID] = matchingPrivilege ? matchingPrivilege.FLAG == 1 ? true : false : false;
                _site['INACTIVE_' + _privilege.PRIVILEGE_ID] = matchingPrivilege ? matchingPrivilege.FLAG == 0 ? true : false : true;
                if (matchingPrivilege.FLAG == 1) USER_PRIVILEGE_IDS.push(_privilege.PRIVILEGE_ID);
            });
            var hasMatchingRecord = $scope.MODIFIED_SITES_LIST.find(function (site) {
                return site.BRANCH_ID === _site.BRANCH_ID;
            });

            if (hasMatchingRecord) {
                hasMatchingRecord.USER_PRIVILEGE_IDS = USER_PRIVILEGE_IDS.join(',');
                hasMatchingRecord.STANDARD_ROLE_ID = $scope.SELECTED_ROLE_PRIVILEGES[0].STANDARD_ROLE_ID;
            }
            else {
                var MODIFIED_SITES_LIST = new Object();
                MODIFIED_SITES_LIST.ENTITY_ID = $scope.UserDetails.ENTITY_ID;
                MODIFIED_SITES_LIST.BRANCH_ID = _site.BRANCH_ID;
                MODIFIED_SITES_LIST.STANDARD_ROLE_ID = $scope.SELECTED_ROLE_PRIVILEGES[0].STANDARD_ROLE_ID;
                MODIFIED_SITES_LIST.ACTIVE = 1;
                MODIFIED_SITES_LIST.USER_PRIVILEGE_IDS = USER_PRIVILEGE_IDS.join(',');
                $scope.MODIFIED_SITES_LIST.push(MODIFIED_SITES_LIST);
            }

        }

    };
    //$scope.SELECTED_STANDARD_ROLE_Fn = function (_role, _site) {
    //    if (_role == '') {
    //        _site.CUSTOM_ROLE_NAME = $scope.UserDetails.DD_DEFAULT_TEXT;
    //        _site.STANDARD_ROLE_ID = '';
    //        angular.forEach($scope.MODIFIED_SITES_LIST, function (_mod) {

    //            if (_mod.BRANCH_ID == _site.BRANCH_ID) {
    //                _mod.ACTIVE = 0;
    //            }

    //        });
    //        $scope.PRIVILAGE_LIST.forEach(function (_privilege) {
    //            _site['ACTIVE_' + _privilege.PRIVILEGE_ID] = false;
    //        })

    //    }
    //    else if (_role.STANDARD_ROLE_ID == 16) {
    //        angular.forEach($scope.SITES_LIST, function (each_site) {
    //            $scope.PROVIDE_SITE_ROLE(_role, each_site);
    //        });
    //    }
    //    else {
    //        $scope.PROVIDE_SITE_ROLE(_role, _site);
    //    }

    //};
    //$scope.PROVIDE_SITE_ROLE = function(_role, _site){
    //    _site.CUSTOM_ROLE_NAME = _role.ROLE_NAME;
    //    _site.STANDARD_ROLE_ID = _role.STANDARD_ROLE_ID;
    //    let selected_Role_id = _role.STANDARD_ROLE_ID;
    //    $scope.SELECTED_ROLE_PRIVILEGES = $filter('filter')($scope.ROLES_WITH_PRIVILEGE, { STANDARD_ROLE_ID: selected_Role_id });
    //    var USER_PRIVILEGE_IDS = [];
    //    $scope.PRIVILAGE_LIST.forEach(function (_privilege) {

    //        var matchingPrivilege = $scope.SELECTED_ROLE_PRIVILEGES.find(function (privilege) {
    //            return privilege.PRIVILEGE_ID === _privilege.PRIVILEGE_ID;
    //        });

    //        _site['ACTIVE_' + _privilege.PRIVILEGE_ID] = matchingPrivilege ? matchingPrivilege.FLAG == 1 ? true : false : false;
    //        _site['INACTIVE_' + _privilege.PRIVILEGE_ID] = matchingPrivilege ? matchingPrivilege.FLAG == 0 ? true : false : true;
    //        if (matchingPrivilege.FLAG == 1) USER_PRIVILEGE_IDS.push(_privilege.PRIVILEGE_ID);
    //    });
    //    var hasMatchingRecord = $scope.MODIFIED_SITES_LIST.find(function (site) {
    //        return site.BRANCH_ID === _site.BRANCH_ID;
    //    });

    //    if (hasMatchingRecord) {
    //        hasMatchingRecord.USER_PRIVILEGE_IDS = USER_PRIVILEGE_IDS.join(',');
    //        hasMatchingRecord.STANDARD_ROLE_ID = $scope.SELECTED_ROLE_PRIVILEGES[0].STANDARD_ROLE_ID;
    //    }
    //    else {
    //        var MODIFIED_SITES_LIST = new Object();
    //        MODIFIED_SITES_LIST.ENTITY_ID = $scope.UserDetails.ENTITY_ID;
    //        MODIFIED_SITES_LIST.BRANCH_ID = _site.BRANCH_ID;
    //        MODIFIED_SITES_LIST.STANDARD_ROLE_ID = $scope.SELECTED_ROLE_PRIVILEGES[0].STANDARD_ROLE_ID;
    //        MODIFIED_SITES_LIST.ACTIVE = 1;
    //        MODIFIED_SITES_LIST.USER_PRIVILEGE_IDS = USER_PRIVILEGE_IDS.join(',');
    //        $scope.MODIFIED_SITES_LIST.push(MODIFIED_SITES_LIST);
    //    }
    //}

    $scope.MANAGE_USER_ROLES = function (_site, _flag, _privilege_id) {

        $scope.MODIFIED_SITES_LIST.forEach(function (site) {
            if (site.BRANCH_ID === _site.BRANCH_ID && site.STANDARD_ROLE_ID === _site.STANDARD_ROLE_ID) {
                site.USER_PRIVILEGE_IDS = site.USER_PRIVILEGE_IDS.split(',');
                if (!_flag) {

                    const index = site.USER_PRIVILEGE_IDS.indexOf(_privilege_id.toString());
                    if (index !== -1) {
                        site.USER_PRIVILEGE_IDS.splice(index, 1);
                    }
                }
                else if (_flag) {
                    if (!site.USER_PRIVILEGE_IDS.includes(_privilege_id.toString())) {
                        site.USER_PRIVILEGE_IDS.push(_privilege_id);
                    }
                }
                site.USER_PRIVILEGE_IDS = site.USER_PRIVILEGE_IDS.join(',');
            }
        });
    };

    $scope.nginit_branch_role = function (_branch) {
        if ((_branch.CUSTOM_ROLE_NAME == undefined || _branch.CUSTOM_ROLE_NAME == "" || _branch.CUSTOM_ROLE_NAME == null) && (_branch.STANDARD_ROLE_ID == '' || _branch.STANDARD_ROLE_ID == undefined || _branch.STANDARD_ROLE_ID == null)) {
            _branch.CUSTOM_ROLE_NAME = $scope.UserDetails.DD_DEFAULT_TEXT;
        }
        else if (_branch.ROLE_NAME != '' && _branch.ROLE_NAME != undefined && _branch.ROLE_NAME != null) {
            _branch.CUSTOM_ROLE_NAME = _branch.ROLE_NAME;
        };
    };
    $scope.INS_UPD_USER = function () {
        $scope.User_form.submitted = true;
        if ($scope.User_form.$valid) {
            var CashupAppObj = new Object();
            CashupAppObj.CUSTOMER_ID = $scope.UserDetails.CUSTOMER_ID;
            CashupAppObj.USER_ID = $scope.Is_Edit_UserDetails.USER_ID ? $scope.Is_Edit_UserDetails.USER_ID : 0;
            CashupAppObj.CREATED_BY = $scope.UserDetails.USER_ID;
            CashupAppObj.ACTIVE = 1;
            CashupAppObj.NAME = $scope.UserDetails.NAME;
            CashupAppObj.PRIMARY_EMAIL = $scope.UserDetails.PRIMARY_EMAIL == null ? '' : $scope.UserDetails.PRIMARY_EMAIL;
            CashupAppObj.SECONDARY_EMAIL = $scope.UserDetails.SECONDARY_EMAIL == null ? null : $scope.UserDetails.SECONDARY_EMAIL;
            CashupAppObj.NOTIFICATION_EMAIL = $scope.UserDetails.PRIMARY_EMAIL;
            CashupAppObj.MOBILE_CODE = $scope.UserDetails.MOBILE_CODE == null ? '' : $scope.UserDetails.MOBILE_CODE;
            CashupAppObj.MOBILE_NO = $scope.UserDetails.MOBILE_NO == null ? '' : $scope.UserDetails.MOBILE_NO;
            CashupAppObj.USER_NAME = $scope.UserDetails.NAME;
            if ($scope.MODIFIED_SITES_LIST.length != 0) {
                CashupAppObj.USER_ROLE_TYPE = angular.copy($scope.MODIFIED_SITES_LIST);
            }
            else {
                CashupAppObj.USER_ROLE_TYPE = [];
                angular.forEach($scope.SITES_LIST, function (_site) {
                    var user_empty_role_obj = new Object();
                    user_empty_role_obj.ENTITY_ID = $scope.UserDetails.ENTITY_ID;
                    user_empty_role_obj.BRANCH_ID = _site.BRANCH_ID;
                    user_empty_role_obj.STANDARD_ROLE_ID = null;
                    user_empty_role_obj.ACTIVE = 1;
                    user_empty_role_obj.USER_PRIVILEGE_IDS = "";
                    CashupAppObj.USER_ROLE_TYPE.push(user_empty_role_obj);
                });
            }

            CashupAppObj.DEFAULT_ENTITY_ID = $scope.UserDetails.ENTITY_ID;
            CashupAppObj.DESIGNATION = $scope.UserDetails.DESIGNATION == null ? '' : $scope.UserDetails.DESIGNATION;
            CashupAppObj.ENTITY_ID = $scope.UserDetails.ENTITY_ID;

            CashupAppObj.CUSTOMERS_NOTIFICATIONS = [];
            angular.forEach($scope.NOTIFICATIONS_MASTER_LIST, function (_notification) {
                var notificationObj = new Object();
                notificationObj.NTFCTN_MSTR_ID = _notification.TABLE_ID;
                notificationObj.ACTIVE = _notification.ACTIVE ? 1 : 0;
                CashupAppObj.CUSTOMERS_NOTIFICATIONS.push(notificationObj);
            });

            PrcCommMethods.CASHUP_APP_API(CashupAppObj, 'INS_UPD_USER').then(function (data) {
                if (data.data > 0) {
                    if (!$scope.Is_Edit_UserDetails.USER_ID) {
                        $scope.$parent.ShowAlertBox("Success", 'User Saved successfully', 3000);
                    }
                    else if ($scope.Is_Edit_UserDetails.USER_ID) {
                        $scope.$parent.ShowAlertBox("Success", 'User Updated successfully', 3000);
                    }
                    $scope.UserDetails = {};
                    $scope.RESET_Fn();
                    $scope.RESET_NOTIFCATION();
                }
                //else if () {

                //}
                if (data.data == 0) {
                    $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                }
            });
        }
    };
    $scope.$on('$destroy', function () {
        $('.modal.show').modal('hide');
    });
});