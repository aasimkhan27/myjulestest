app.controller('ReportingController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    //$scope.$parent.DISPLAY_FLAG = true;
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(1);
    $scope.HR_COMMON_CODE_Fn();
    $scope.$parent.$parent.overlay_loading_HR_Loader = 'none';
    $scope.ReportSearch = {
        CUSTOMER_ID: $cookies.get("CUSTOMER_ID"),
        USER_ID: $cookies.get("USERID"),
        ENTITY_ID: null,
    }

    $scope.GET_CUSTOMER_SETTINGS = function (_param_retun_value, _param_tableids, _param_customer, _param_module) {
        var readOnlyObject = new Object();
        readOnlyObject.CUSTOMER_ID = _param_retun_value.CUSTOMER_ID;
        readOnlyObject.MODULE_ID = _param_retun_value.MODULE_ID;
        readOnlyObject.TABLE_ID_LIST = [];
        //---Employee Number Generation       48
        angular.forEach(_param_tableids.split(','), function (_loop_value) {
            var readonly = new Object();
            readonly.TABLE_ID = _loop_value;
            readOnlyObject.TABLE_ID_LIST.push(readonly);
        });
        PrcCommMethods.HUMANRESOURCE_API(readOnlyObject, 'GET_CUSTOMER_SETTINGS').then(function (data) {
            if (data.data.Table.length > 0) {
                angular.forEach(data.data.Table, function (_loop_value) {
                    if (_loop_value.SETTING_MASTER_ID == 80) {
                        $scope.ReportSearch.LABOR_ENABLE = parseInt(_loop_value.SETTING_VALUE) == 1 ? true : false;
                    }
                    else if (_loop_value.SETTING_MASTER_ID == 81) {
                        $scope.ReportSearch.SET_LABOUT_COST = _loop_value.SETTING_VALUE;
                    }
                });
            }
            else if (data.data == 0) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
        });
    }
    $scope.CHECK_LIMIT = function () {
        if ($scope.ReportSearch.SET_LABOUT_COST != null && $scope.ReportSearch.SET_LABOUT_COST != undefined) {
            if ($scope.ReportSearch.SET_LABOUT_COST == 0) {
                $scope.ReportSearch.SET_LABOUT_COST = '';
                $scope.$parent.ShowAlertBox("Attention", 'Upper limit is not set 0.', 3000);
            }
        }
    }

    $scope.INS_UPD_CUSTOMER_SETTINGS = function (SETTING_VALUE, SETTING_MASTER_ID) {
        var validCount = true;
        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_ID = $scope.ReportSearch.CUSTOMER_ID;
        CusModelObj.USER_ID = $scope.ReportSearch.USER_ID;
        CusModelObj.CUSTOMER_SETTINGS_TYPE = [];
        if (SETTING_MASTER_ID == 81) {
            $scope.LOBORFORM.submitted = true
            validCount = $scope.LOBORFORM.$valid;
        }
        if (validCount) {
            var readonly = new Object()
            readonly.SETTING_VALUE = SETTING_VALUE;
            readonly.SETTING_MASTER_ID = SETTING_MASTER_ID;
            CusModelObj.CUSTOMER_SETTINGS_TYPE.push(readonly);

            CusModelObj.BRANCH_TYPE = [];
            CusModelObj.POSITIONS_TYPE = [];
            CusModelObj.DEPARTMENTS_TYPE = [];
            CusModelObj.EMPLOYEES_TYPE = [];
            let resultobject = $scope.$parent.BLANK_SETTING_OBJECT();
            CusModelObj.BRANCH_TYPE.push(resultobject);
            CusModelObj.POSITIONS_TYPE.push(resultobject);
            CusModelObj.DEPARTMENTS_TYPE.push(resultobject);
            CusModelObj.EMPLOYEES_TYPE.push(resultobject);
            PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'INS_UPD_CUSTOMER_SETTINGS').then(function (data) {
                if (data.data > 0) {
                    $scope.$parent.ShowAlertBox("Success", 'Updated successfully', 3000);
                }
                if (data.data == 0) {
                    $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                }
            });
        }
    }
    $scope.GET_CUSTOMER_SETTINGS($scope.ReportSearch, '80,81')
});