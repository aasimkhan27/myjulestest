app.controller('AccessController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.HR_COMMON_CODE_Fn();
    //$scope.$parent.DISPLAY_FLAG = true;
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(1);
    $scope.$parent.$parent.overlay_loading_HR_Loader = 'none';
    $scope.OrganisationSearch = {
        CUSTOMER_ID: $cookies.get("CUSTOMER_ID"),
        MODULE_ID: parseInt($cookies.get("MODULE_ID")),
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        SEARCH: '',
        DD_DEFAULT_TEXT: 'Role',
    };
    $scope.ACCESS_ROLES_ASSIGNMENT_LIST = [];

    $scope.HRM_GET_ACCESS_ROLES_ASSIGNMENT = function (FLAG) {
        $scope.$parent.overlay_loadingNew = 'block';
        if (FLAG == 1) {
            $scope.OrganisationSearch.PAGE_NO = 1;
            $scope.ACCESS_ROLES_ASSIGNMENT_LIST = [];
        }
        var UserModelObj = new Object();
        UserModelObj.CUSTOMER_ID = $scope.OrganisationSearch.CUSTOMER_ID;
        UserModelObj.STANDARD_ROLE_ID = $scope.OrganisationSearch.STANDARD_ROLE_ID;
        UserModelObj.SEARCH = $scope.OrganisationSearch.SEARCH;
        UserModelObj.PAGE_NO = $scope.OrganisationSearch.PAGE_NO;
        UserModelObj.PAGE_SIZE = $scope.OrganisationSearch.PAGE_SIZE;
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'HRM_GET_ACCESS_ROLES_ASSIGNMENT').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.ACCESS_ROLES_ASSIGNMENT_LIST = $scope.ACCESS_ROLES_ASSIGNMENT_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.OrganisationSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.OrganisationSearch.PAGE_NO = parseInt($scope.OrganisationSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else {
                if ($scope.ACCESS_ROLES_ASSIGNMENT_LIST.length == 0) {
                    $scope.$parent.LOAD_FETCH_TEXT = 'No records yet!';
                }
                $scope.GetData = false;
                $scope.$parent.overlay_loadingNew = 'none';
            }
        });
    };
    $scope.GET_MODULE_ROLES_WITH_PRIVILEGE_OBJ = function () {
        var UserModelObj = new Object();
        UserModelObj.CUSTOMER_ID = $scope.OrganisationSearch.CUSTOMER_ID;
        UserModelObj.MODULE_ID = $scope.OrganisationSearch.MODULE_ID;
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'GET_MODULE_ROLES_WITH_PRIVILEGE_OBJ').then(function (data) {
            if (data.data.length > 0) {
                $scope.MODULE_ROLES_LIST = data.data;
                $scope.ROLES_LIST = data.data[0].ROLE_LIST;

                console.log("GET_MODULE_ROLES", data.data);
                //$scope.GET_MODULE_ROLES_WITH_PRIVILEGE();
            }
            else if (data.data == null) {
                $scope.$parent.ShowAlert("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
            else {
                $scope.MODULE_ROLES_LIST = [];
            }
        });
    };

    $scope.GET_MODULE_ROLES_WITH_PRIVILEGE = function () {
        var UserModelObj = new Object();
        UserModelObj.CUSTOMER_ID = $scope.OrganisationSearch.CUSTOMER_ID;
        UserModelObj.MODULE_ID = $scope.OrganisationSearch.MODULE_ID;
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'GET_MODULE_ROLES_WITH_PRIVILEGE').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.MODULE_ROLES_WITH_PRIVILEGE_LIST = data.data.Table;
                console.log("MODULE_ROLES_WITH_PRIVILEGE", data.data.Table);
            }
            else if (data.data == null) {
                $scope.$parent.ShowAlert("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
        });
    };
    $scope.GET_MODULE_ROLES_WITH_PRIVILEGE_OBJ();

    $scope.LAZY_LOAD_GET_ACCESS_ROLES_ASSIGNMENT_Fn = function () {
        $scope.HRM_GET_ACCESS_ROLES_ASSIGNMENT();
    };
    $scope.SELECTED_ROLE_Fn = function (_role) {
        if (_role == '') {
            $scope.OrganisationSearch.CUSTOM_ROLE_NAME = $scope.OrganisationSearch.DD_DEFAULT_TEXT;
            $scope.OrganisationSearch.STANDARD_ROLE_ID = '';
            $scope.HRM_GET_ACCESS_ROLES_ASSIGNMENT(1);
        }
        else {
            $scope.OrganisationSearch.CUSTOM_ROLE_NAME = _role.ROLE_NAME;
            $scope.OrganisationSearch.STANDARD_ROLE_ID = _role.STANDARD_ROLE_ID;
            $scope.IS_ROLE_CHANGED = true;
            $scope.HRM_GET_ACCESS_ROLES_ASSIGNMENT(1);
        }

    };
    $scope.SELECTED_ROLE_Fn('');

    $scope.ng_initemployee = function (_employee) {
        _employee.SHORT_NAME = $scope.TextReturn(_employee.EMPLOYEE_NAME);
        _employee.SHORT_NAME = $scope.TextReturn(_employee.EMAIL);
    };

});