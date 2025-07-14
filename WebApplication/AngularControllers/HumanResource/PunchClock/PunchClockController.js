app.controller('PunchClockController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    //$scope.$parent.DISPLAY_FLAG = true;
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(1);
    $scope.HR_COMMON_CODE_Fn();
    $scope.$parent.$parent.overlay_loading_HR_Loader = 'none';


    $scope.PUNCH_CLOCK_TAB_ID = 1;
    $scope.Fn_PUNCH_CLOCK_TAB_CLICK = function (PUNCH_CLOCK_TAB_ID) {
        $scope.PUNCH_CLOCK_TAB_ID = PUNCH_CLOCK_TAB_ID;
    }

    $scope.PunchClockGeneralSearch = {
        CUSTOMER_ID: $cookies.get("CUSTOMER_ID"),
        MODULE_ID: parseInt($cookies.get("MODULE_ID")),
        USER_ID: parseInt($cookies.get("USERID")),
        ENTITY_ID: null,
        PAGE_NO: 0,
        PAGE_SIZE: 20,
        LOGIN_EMPLOYEE_ID: 0,
    };


    $scope.PUNCHCLOCK_BRANCH_SETTINGS_LIST = [];
    $scope.OVERTIME_RULES_LIST = [];
    $scope.HR_BRANCH_LIST = [];
    $scope.PUNCHCLOCK_BRANCH_SETTINGS_TYPE = [];
    //Exceptions for Clock-in/out
    $scope.DD_BRANCH_LIST = [];
    $scope.POSITIONS_LIST = [];
    $scope.DEPARTMENTS_LIST = [];
    $scope.EMPLOYEES_LIST = [];
    $scope.ADD_DEPARTMENTS_LIST = [];
    $scope.ADD_POSITIONS_LIST = [];
    $scope.ADD_BRANCH_LIST = [];
    $scope.ADD_EMPLOYEES_LIST = [];
    //Take Breaks During Employee’s Shifts
    $scope.SHIFT_BRANCH_LIST = [];
    $scope.SHIFT_POSITIONS_LIST = [];
    $scope.SHIFT_DEPARTMENTS_LIST = [];
    $scope.SHIFT_EMPLOYEES_LIST = [];
    $scope.ADD_SHIFT_DEPARTMENTS_LIST = [];
    $scope.ADD_SHIFT_POSITIONS_LIST = [];
    $scope.ADD_SHIFT_BRANCH_LIST = [];
    $scope.ADD_SHIFT_EMPLOYEES_LIST = [];
    //Accept ROTA as Clock-in/out time
    $scope.ROTA_BRANCH_LIST = [];
    $scope.ROTA_POSITIONS_LIST = [];
    $scope.ROTA_DEPARTMENTS_LIST = [];
    $scope.ROTA_EMPLOYEES_LIST = [];
    $scope.ADD_ROTA_DEPARTMENTS_LIST = [];
    $scope.ADD_ROTA_POSITIONS_LIST = [];
    $scope.ADD_ROTA_BRANCH_LIST = [];
    $scope.ADD_ROTA_EMPLOYEES_LIST = [];

    var DD_Default_Text = "Choose";
    $scope.PunchClockRulesSearch = {
        CUSTOMER_ID: $cookies.get("CUSTOMER_ID"),
        MODULE_ID: parseInt($cookies.get("MODULE_ID")),
        USER_ID: parseInt($cookies.get("USERID")),
        ENTITY_ID: null,
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        POSITION_DEFAULT_TEXT: DD_Default_Text,
        CUSTOM_POSITION_NAME: DD_Default_Text,
    };
    $scope.POSITIONS_ORULE_LIST = [];
    $scope.OVERTIME_POSITIONS_LIST = [];
    $scope.OVERTIME_DEPARTMENTS_LIST = [];
    $scope.OVERTIME_EMPLOYEES_LIST = [];
    $scope.ADD_OVERTIME_DEPARTMENTS_LIST = [];
    $scope.ADD_OVERTIME_POSITIONS_LIST = [];
    $scope.ADD_OVERTIME_EMPLOYEES_LIST = [];
    $scope.SCHEDULE_DEPARTMENTS_LIST = [];
    $scope.SCHEDULE_EMPLOYEES_LIST = [];
    $scope.ADD_SCHEDULE_DEPARTMENTS_LIST = [];
    $scope.ADD_SCHEDULE_EMPLOYEES_LIST = [];

    $scope.PunchClockOthersSearch = {
        CUSTOMER_ID: $cookies.get("CUSTOMER_ID"),
        MODULE_ID: parseInt($cookies.get("MODULE_ID")),
        USER_ID: parseInt($cookies.get("USERID")),
        ENTITY_ID: null,
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        CUSTOM_BRANCH_NAME: DD_Default_Text,
        BRANCH_DEFAULT_TEXT: DD_Default_Text,
    };

    $scope.BRANCH_WIFI_MAPPING_LIST = [];
    $scope.BRANCH_WIFI_LIST = [];

    $scope.HRM_GET_PUNCHCLOCK_BRANCH_SETTINGS = function () {
        var PunchClockObject = new Object();
        PunchClockObject.ENTITY_ID = $scope.PunchClockGeneralSearch.ENTITY_ID;
        PunchClockObject.CUSTOMER_ID = $scope.PunchClockGeneralSearch.CUSTOMER_ID;
        PrcCommMethods.HUMANRESOURCE_API(PunchClockObject, 'HRM_GET_PUNCHCLOCK_BRANCH_SETTINGS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.PUNCHCLOCK_BRANCH_SETTINGS_LIST = data.data.Table;
                $scope.ADMIN_GET_BRANCH_LIST();
            }
            else {
                $scope.PUNCHCLOCK_BRANCH_SETTINGS_LIST = [];
                $scope.ADMIN_GET_BRANCH_LIST();
            }
        });
    };
    $scope.HRM_GET_OVERTIME_RULES = function () {
        var PunchClockObject = new Object();
        PunchClockObject.CUSTOMER_ID = $scope.PunchClockGeneralSearch.CUSTOMER_ID;
        PrcCommMethods.HUMANRESOURCE_API(PunchClockObject, 'HRM_GET_OVERTIME_RULES').then(function (data) {
            $scope.OVERTIME_RULES_LIST = data.data.Table;
        });
    };

    $scope.HRM_GET_DEPARTMENTS = function () {
        var AbsenceObject = new Object();
        AbsenceObject.CUSTOMER_ID = $scope.PunchClockGeneralSearch.CUSTOMER_ID;
        AbsenceObject.ENTITY_ID = $scope.PunchClockGeneralSearch.ENTITY_ID;
        AbsenceObject.PAGE_NO = $scope.PunchClockGeneralSearch.PAGE_NO;
        AbsenceObject.PAGE_SIZE = $scope.PunchClockGeneralSearch.PAGE_SIZE;
        PrcCommMethods.HUMANRESOURCE_API(AbsenceObject, 'HRM_GET_DEPARTMENTS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.DEPARTMENTS_LIST = data.data.Table;
                $scope.SHIFT_DEPARTMENTS_LIST = data.data.Table;
                $scope.ROTA_DEPARTMENTS_LIST = data.data.Table;
                $scope.OVERTIME_DEPARTMENTS_LIST = data.data.Table;
                $scope.SCHEDULE_DEPARTMENTS_LIST = data.data.Table;
            } else {
                $scope.DEPARTMENTS_LIST = [];
                $scope.SHIFT_DEPARTMENTS_LIST = [];
                $scope.ROTA_DEPARTMENTS_LIST = [];
                $scope.OVERTIME_DEPARTMENTS_LIST = [];
                $scope.SCHEDULE_DEPARTMENTS_LIST = [];
            }
        });
    };
    $scope.HRM_GET_POSITIONS = function () {
        var AbsenceObject = new Object();
        AbsenceObject.CUSTOMER_ID = $scope.PunchClockGeneralSearch.CUSTOMER_ID;
        AbsenceObject.ENTITY_ID = $scope.PunchClockGeneralSearch.ENTITY_ID;
        AbsenceObject.PAGE_NO = $scope.PunchClockGeneralSearch.PAGE_NO;
        AbsenceObject.PAGE_SIZE = $scope.PunchClockGeneralSearch.PAGE_SIZE;
        PrcCommMethods.HUMANRESOURCE_API(AbsenceObject, 'HRM_GET_POSITIONS').then(function (data) {

            if (data.data.Table.length > 0) {
                $scope.POSITIONS_LIST = data.data.Table;
                $scope.SHIFT_POSITIONS_LIST = data.data.Table;
                $scope.ROTA_POSITIONS_LIST = data.data.Table;
                $scope.OVERTIME_POSITIONS_LIST = data.data.Table;
                $scope.POSITIONS_ORULE_LIST = data.data.Table;
            } else {
                $scope.POSITIONS_LIST = [];
                $scope.SHIFT_POSITIONS_LIST = [];
                $scope.ROTA_POSITIONS_LIST = [];
                $scope.OVERTIME_POSITIONS_LIST = [];
                $scope.POSITIONS_ORULE_LIST = [];
            }
        });
    };

    $scope.nginit_clockinout = function (_branch) {
        if ($scope.PUNCHCLOCK_BRANCH_SETTINGS_LIST.length > 0) {
            let resultbranch = $scope.PUNCHCLOCK_BRANCH_SETTINGS_LIST.filter(function (x) { return _branch.BRANCH_ID == x.BRANCH_ID });
            if (resultbranch.length > 0) {
                _branch.GEO_LOCATION = resultbranch[0].GEO_LOCATION;
                _branch.QR_SCAN = resultbranch[0].QR_SCAN;
                _branch.CLOCK_IN_TERMINAL = resultbranch[0].CLOCK_IN_TERMINAL;
                _branch.MOBILE_SELFIE = resultbranch[0].MOBILE_SELFIE;
                _branch.CLOCK_IN_TERMINAL_SELFIE = resultbranch[0].CLOCK_IN_TERMINAL_SELFIE;
            }

        }
    };




    $scope.HRM_GET_EMPLOYTEE_LIST_BY_EMPLY_PRSNL_ID = function () {
        var UserModelObj = new Object();
        UserModelObj.EMPLY_PRSNL_ID = $scope.PunchClockGeneralSearch.LOGIN_EMPLOYEE_ID;
        UserModelObj.CUSTOMER_ID = $scope.PunchClockGeneralSearch.CUSTOMER_ID;
        UserModelObj.ENTITY_ID = $scope.PunchClockGeneralSearch.ENTITY_ID;
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'HRM_GET_EMPLOYTEE_LIST_BY_EMPLY_PRSNL_ID').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.EMPLOYEES_LIST = data.data.Table;
                $scope.SHIFT_EMPLOYEES_LIST = data.data.Table;
                $scope.ROTA_EMPLOYEES_LIST = data.data.Table;
                $scope.OVERTIME_EMPLOYEES_LIST = data.data.Table;
                $scope.SCHEDULE_EMPLOYEES_LIST = data.data.Table;

            }
            else if (data.data == null) {
                $scope.EMPLOYEES_LIST = [];
                $scope.SHIFT_EMPLOYEES_LIST = [];
                $scope.ROTA_EMPLOYEES_LIST = [];
                $scope.OVERTIME_EMPLOYEES_LIST = [];
                $scope.SCHEDULE_EMPLOYEES_LIST = [];
            }
        });
    };

    $scope.HRM_INS_UPD_PUNCHCLOCK_BRANCH_SETTINGS = function () {

        var PunchClockObject = new Object();

        PunchClockObject.CUSTOMER_ID = $scope.PunchClockGeneralSearch.CUSTOMER_ID;
        PunchClockObject.USER_ID = $scope.PunchClockGeneralSearch.USER_ID;

        PunchClockObject.HRM_PUNCHCLOCK_BRANCH_SETTINGS_TYPE = [];

        angular.forEach($scope.HR_BRANCH_LIST, function (_loop_value) {
            var _readOnly = new Object()
            _readOnly.ENTITY_ID = _loop_value.ENTITY_ID;
            _readOnly.BRANCH_ID = _loop_value.BRANCH_ID;
            _readOnly.GEO_LOCATION = _loop_value.GEO_LOCATION ? 1 : 0;
            _readOnly.QR_SCAN = _loop_value.QR_SCAN ? 1 : 0;
            _readOnly.CLOCK_IN_TERMINAL = _loop_value.CLOCK_IN_TERMINAL ? 1 : 0;
            _readOnly.MOBILE_SELFIE = _loop_value.MOBILE_SELFIE ? 1 : 0;
            _readOnly.CLOCK_IN_TERMINAL_SELFIE = _loop_value.CLOCK_IN_TERMINAL_SELFIE ? 1 : 0;
            PunchClockObject.HRM_PUNCHCLOCK_BRANCH_SETTINGS_TYPE.push(_readOnly);
        });
        PrcCommMethods.HUMANRESOURCE_API(PunchClockObject, 'HRM_INS_UPD_PUNCHCLOCK_BRANCH_SETTINGS').then(function (data) {
            if (data.data > 0) {
                $scope.$parent.ShowAlertBox("Success", 'Punch Clock updated successfully', 3000);
            }
            else if (data.data < 0) {
                $scope.$parent.ShowAlertBox("Attention", 'Already Added', 3000);
            }
            if (data.data == 0) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }

        });

    };


    $scope.UPDATE_SHIFT_Fn = function () {
        if ($scope.PunchClockGeneralSearch.ENABLE_EMPLOYEE_BREAK != true) {
            $scope.INS_UPD_CUSTOMER_SETTINGS(0, 62, 2);
        }

    };

    // Exceptions for Clock-in/out
    $scope.ADD_BRANCH_Fn = function (_branch) {
        $scope.exceptionBranchSearch = '';
        $scope.ADD_BRANCH_LIST.push(angular.copy(_branch));
        $scope.DD_BRANCH_LIST = $scope.DD_BRANCH_LIST.filter(function (item) {
            return item !== _branch;
        });
        $scope.INS_UPD_CUSTOMER_SETTINGS(anyDataExistsInDDList(1), 58, '', 1, 0, _branch.BRANCH_ID);
    };
    $scope.REMOVE_BRANCH_Fn = function (_branch) {
        $scope.DD_BRANCH_LIST.push(angular.copy(_branch));
        $scope.ADD_BRANCH_LIST = $scope.ADD_BRANCH_LIST.filter(function (item) {
            return item !== _branch;
        });
        $scope.INS_UPD_CUSTOMER_SETTINGS(anyDataExistsInDDList(1), 58, '', 1, 1, _branch.BRANCH_ID, _branch.TABLE_ID);
    };
    $scope.ADD_DEPARTMENTS_Fn = function (_department) {
        $scope.exceptionDepartmentSearch = '';
        $scope.ADD_DEPARTMENTS_LIST.push(angular.copy(_department));
        $scope.DEPARTMENTS_LIST = $scope.DEPARTMENTS_LIST.filter(function (department) {
            return department !== _department;
        });
        $scope.INS_UPD_CUSTOMER_SETTINGS(anyDataExistsInDDList(1), 58, '', 2, 0, _department.DEPARTMENT_ID);
    };
    $scope.REMOVE_DEPARTMENTS_Fn = function (_department) {
        $scope.DEPARTMENTS_LIST.push(angular.copy(_department));
        $scope.ADD_DEPARTMENTS_LIST = $scope.ADD_DEPARTMENTS_LIST.filter(function (department) {
            return department !== _department;
        });
        $scope.INS_UPD_CUSTOMER_SETTINGS(anyDataExistsInDDList(1), 58, '', 2, 1, _department.DEPARTMENT_ID, _department.TABLE_ID);
    };
    $scope.ADD_POSITIONS_Fn = function (_position) {
        $scope.exceptionPositionSearch = '';
        $scope.ADD_POSITIONS_LIST.push(angular.copy(_position));
        $scope.POSITIONS_LIST = $scope.POSITIONS_LIST.filter(function (position) {
            return position !== _position;
        });
        $scope.INS_UPD_CUSTOMER_SETTINGS(anyDataExistsInDDList(1), 58, '', 3, 0, _position.POSITION_ID);
    };
    $scope.REMOVE_POSITIONS_Fn = function (position) {
        $scope.POSITIONS_LIST.push(angular.copy(position));
        $scope.ADD_POSITIONS_LIST = $scope.ADD_POSITIONS_LIST.filter(function (position) {
            return position !== position;
        });
        $scope.INS_UPD_CUSTOMER_SETTINGS(anyDataExistsInDDList(1), 58, '', 3, 1, position.POSITION_ID, position.TABLE_ID);
    };
    $scope.ADD_EMPLOYEE_Fn = function (_employee) {
        $scope.exceptionEmployeeSearch = '';
        $scope.ADD_EMPLOYEES_LIST.push(angular.copy(_employee));
        $scope.EMPLOYEES_LIST = $scope.EMPLOYEES_LIST.filter(function (item) {
            return item !== _employee;
        });
        $scope.INS_UPD_CUSTOMER_SETTINGS(anyDataExistsInDDList(1), 58, '', 4, 0, _employee.EMPLY_PRSNL_ID);
    };
    $scope.REMOVE_EMPLOYEE_Fn = function (_employee) {
        $scope.EMPLOYEES_LIST.push(angular.copy(_employee));
        $scope.ADD_EMPLOYEES_LIST = $scope.ADD_EMPLOYEES_LIST.filter(function (item) {
            return item !== _employee;
        });
        $scope.INS_UPD_CUSTOMER_SETTINGS(anyDataExistsInDDList(1), 58, '', 4, 1, _employee.EMPLY_PRSNL_ID, _employee.TABLE_ID);
    };

    // Take Breaks During Employee’s Shifts
    $scope.ADD_SHIFT_BRANCH_Fn = function (_branch) {
        $scope.shiftBranchSearch = '';
        $scope.ADD_SHIFT_BRANCH_LIST.push(angular.copy(_branch));
        $scope.SHIFT_BRANCH_LIST = $scope.SHIFT_BRANCH_LIST.filter(function (item) {
            return item.BRANCH_ID !== _branch.BRANCH_ID;
        });
        $scope.INS_UPD_CUSTOMER_SETTINGS(anyDataExistsInDDList(2), 62, '', 1, 0, _branch.BRANCH_ID);
    };

    $scope.REMOVE_SHIFT_BRANCH_Fn = function (_branch) {
        $scope.SHIFT_BRANCH_LIST.push(angular.copy(_branch));
        $scope.ADD_SHIFT_BRANCH_LIST = $scope.ADD_SHIFT_BRANCH_LIST.filter(function (item) {
            return item.BRANCH_ID !== _branch.BRANCH_ID;
        });
        $scope.INS_UPD_CUSTOMER_SETTINGS(anyDataExistsInDDList(2), 62, '', 1, 1, _branch.BRANCH_ID, _branch.TABLE_ID);
    };

    $scope.ADD_SHIFT_DEPARTMENTS_Fn = function (_department) {
        $scope.shiftDepartmentSearch = '';
        $scope.ADD_SHIFT_DEPARTMENTS_LIST.push(angular.copy(_department));
        $scope.SHIFT_DEPARTMENTS_LIST = $scope.SHIFT_DEPARTMENTS_LIST.filter(function (item) {
            return item.DEPARTMENT_ID !== _department.DEPARTMENT_ID;
        });
        $scope.INS_UPD_CUSTOMER_SETTINGS(anyDataExistsInDDList(2), 62, '', 2, 0, _department.DEPARTMENT_ID);
    };

    $scope.REMOVE_SHIFT_DEPARTMENTS_Fn = function (_department) {
        $scope.SHIFT_DEPARTMENTS_LIST.push(angular.copy(_department));
        $scope.ADD_SHIFT_DEPARTMENTS_LIST = $scope.ADD_SHIFT_DEPARTMENTS_LIST.filter(function (item) {
            return item.DEPARTMENT_ID !== _department.DEPARTMENT_ID;
        });
        $scope.INS_UPD_CUSTOMER_SETTINGS(anyDataExistsInDDList(2), 62, '', 2, 1, _department.DEPARTMENT_ID, _department.TABLE_ID);
    };
    $scope.ADD_SHIFT_POSITIONS_Fn = function (_position) {
        $scope.shiftPositionSearch = '';
        $scope.ADD_SHIFT_POSITIONS_LIST.push(angular.copy(_position));
        $scope.SHIFT_POSITIONS_LIST = $scope.SHIFT_POSITIONS_LIST.filter(function (position) {
            return position.POSITION_ID !== _position.POSITION_ID;
        });
        $scope.INS_UPD_CUSTOMER_SETTINGS(anyDataExistsInDDList(2), 62, '', 3, 0, _position.POSITION_ID);
    };

    $scope.REMOVE_SHIFT_POSITIONS_Fn = function (_postition) {
        $scope.SHIFT_POSITIONS_LIST.push(angular.copy(_postition));
        $scope.ADD_SHIFT_POSITIONS_LIST = $scope.ADD_SHIFT_POSITIONS_LIST.filter(function (position) {
            return position.POSITION_ID !== _postition.POSITION_ID;
        });
        $scope.INS_UPD_CUSTOMER_SETTINGS(anyDataExistsInDDList(2), 62, '', 3, 1, _postition.POSITION_ID, _postition.TABLE_ID);
    };

    $scope.ADD_SHIFT_EMPLOYEE_Fn = function (_employee) {
        $scope.shiftEmployeeSearch = '';
        $scope.ADD_SHIFT_EMPLOYEES_LIST.push(angular.copy(_employee));
        $scope.SHIFT_EMPLOYEES_LIST = $scope.SHIFT_EMPLOYEES_LIST.filter(function (item) {
            return item.EMPLY_PRSNL_ID !== _employee.EMPLY_PRSNL_ID;
        });
        $scope.INS_UPD_CUSTOMER_SETTINGS(anyDataExistsInDDList(2), 62, '', 4, 0, _employee.EMPLY_PRSNL_ID);
    };

    $scope.REMOVE_SHIFT_EMPLOYEE_Fn = function (_employee) {
        $scope.SHIFT_EMPLOYEES_LIST.push(angular.copy(_employee));
        $scope.ADD_SHIFT_EMPLOYEES_LIST = $scope.ADD_SHIFT_EMPLOYEES_LIST.filter(function (item) {
            return item.EMPLY_PRSNL_ID !== _employee.EMPLY_PRSNL_ID;
        });
        $scope.INS_UPD_CUSTOMER_SETTINGS(anyDataExistsInDDList(2), 62, '', 4, 1, _employee.EMPLY_PRSNL_ID, _employee.TABLE_ID);
    };

    // Accept ROTA as Clock-in/out time
    $scope.ADD_ROTA_BRANCH_Fn = function (_branch) {
        $scope.rotaBranchSearch = '';
        $scope.ADD_ROTA_BRANCH_LIST.push(angular.copy(_branch));
        $scope.ROTA_BRANCH_LIST = $scope.ROTA_BRANCH_LIST.filter(function (item) {
            return item !== _branch;
        });
        $scope.INS_UPD_CUSTOMER_SETTINGS(anyDataExistsInDDList(3), 63, '', 1, 0, _branch.BRANCH_ID);
    };

    $scope.REMOVE_ROTA_BRANCH_Fn = function (_branch) {
        $scope.ROTA_BRANCH_LIST.push(angular.copy(_branch));
        $scope.ADD_ROTA_BRANCH_LIST = $scope.ADD_ROTA_BRANCH_LIST.filter(function (item) {
            return item !== _branch;
        });
        $scope.INS_UPD_CUSTOMER_SETTINGS(anyDataExistsInDDList(3), 63, '', 1, 1, _branch.BRANCH_ID, _branch.TABLE_ID);
    };

    $scope.ADD_ROTA_DEPARTMENTS_Fn = function (_department) {
        $scope.rotaDepartmentSearch = '';
        $scope.ADD_ROTA_DEPARTMENTS_LIST.push(angular.copy(_department));
        $scope.ROTA_DEPARTMENTS_LIST = $scope.ROTA_DEPARTMENTS_LIST.filter(function (item) {
            return item !== _department;
        });
        $scope.INS_UPD_CUSTOMER_SETTINGS(anyDataExistsInDDList(3), 63, '', 2, 0, _department.DEPARTMENT_ID);
    };

    $scope.REMOVE_ROTA_DEPARTMENTS_Fn = function (_department) {
        $scope.ROTA_DEPARTMENTS_LIST.push(angular.copy(_department));
        $scope.ADD_ROTA_DEPARTMENTS_LIST = $scope.ADD_ROTA_DEPARTMENTS_LIST.filter(function (item) {
            return item !== _department;
        });
        $scope.INS_UPD_CUSTOMER_SETTINGS(anyDataExistsInDDList(3), 63, '', 2, 1, _department.DEPARTMENT_ID, _department.TABLE_ID);
    };
    $scope.ADD_ROTA_POSITIONS_Fn = function (_position) {
        $scope.rotaPositionSearch = '';
        $scope.ADD_ROTA_POSITIONS_LIST.push(angular.copy(_position));
        $scope.ROTA_POSITIONS_LIST = $scope.ROTA_POSITIONS_LIST.filter(function (position) {
            return position !== _position;
        });
        $scope.INS_UPD_CUSTOMER_SETTINGS(anyDataExistsInDDList(3), 63, '', 3, 0, _position.POSITION_ID);
    };

    $scope.REMOVE_ROTA_POSITIONS_Fn = function (_position) {
        $scope.ROTA_POSITIONS_LIST.push(angular.copy(_position));
        $scope.ADD_ROTA_POSITIONS_LIST = $scope.ADD_ROTA_POSITIONS_LIST.filter(function (position) {
            return position !== _position;
        });
        $scope.INS_UPD_CUSTOMER_SETTINGS(anyDataExistsInDDList(3), 63, '', 3, 1, _position.POSITION_ID, _position.TABLE_ID);
    };

    $scope.ADD_ROTA_EMPLOYEE_Fn = function (_employee) {
        $scope.rotaEmployeeSearch = '';
        $scope.ADD_ROTA_EMPLOYEES_LIST.push(angular.copy(_employee));
        $scope.ROTA_EMPLOYEES_LIST = $scope.ROTA_EMPLOYEES_LIST.filter(function (item) {
            return item !== _employee;
        });
        $scope.INS_UPD_CUSTOMER_SETTINGS(anyDataExistsInDDList(3), 63, '', 4, 0, _employee.EMPLY_PRSNL_ID);
    };

    $scope.REMOVE_ROTA_EMPLOYEE_Fn = function (_employee) {
        $scope.ROTA_EMPLOYEES_LIST.push(angular.copy(_employee));
        $scope.ADD_ROTA_EMPLOYEES_LIST = $scope.ADD_ROTA_EMPLOYEES_LIST.filter(function (item) {
            return item !== _employee;
        });
        $scope.INS_UPD_CUSTOMER_SETTINGS(anyDataExistsInDDList(3), 63, '', 4, 1, _employee.EMPLY_PRSNL_ID, _employee.TABLE_ID);
    };

    var anyDataExistsInDDList = function (SettingListTypeFlag) {
        if (SettingListTypeFlag == 1) {
            if ($scope.ADD_BRANCH_LIST.length == 0 && $scope.ADD_DEPARTMENTS_LIST.length == 0 && $scope.ADD_POSITIONS_LIST.length == 0 && $scope.ADD_EMPLOYEES_LIST.length == 0) {
                return 0;
            } else {
                return 1;
            }
        }
        if (SettingListTypeFlag == 2) {
            if ($scope.ADD_SHIFT_BRANCH_LIST.length == 0 && $scope.ADD_SHIFT_DEPARTMENTS_LIST.length == 0 && $scope.ADD_SHIFT_POSITIONS_LIST.length == 0 && $scope.ADD_SHIFT_EMPLOYEES_LIST.length == 0) {
                return 0;
            } else {
                return 1;
            }
        }
        if (SettingListTypeFlag == 3) {
            if ($scope.ADD_ROTA_BRANCH_LIST.length == 0 && $scope.ADD_ROTA_DEPARTMENTS_LIST.length == 0 && $scope.ADD_ROTA_POSITIONS_LIST.length == 0 && $scope.ADD_ROTA_EMPLOYEES_LIST.length == 0) {
                return 0;
            } else {
                return 1;
            }
        }
        if (SettingListTypeFlag == 4) {
            if ($scope.ADD_OVERTIME_DEPARTMENTS_LIST.length == 0 && $scope.ADD_OVERTIME_POSITIONS_LIST.length == 0 && $scope.ADD_OVERTIME_EMPLOYEES_LIST.length == 0) {
                return 0;
            } else {
                return 1;
            }
        }
        if (SettingListTypeFlag == 4) {
            if ($scope.ADD_SCHEDULE_DEPARTMENTS_LIST.length == 0 && $scope.ADD_SCHEDULE_EMPLOYEES_LIST.length == 0) {
                return 0;
            } else {
                return 1;
            }
        }

        return 1;
    };


    // ----------- RULE TAB ----------------


    $scope.ROUNDING_RULE_START_LIST = [
        { "RULE_START_ID": 1, "RULE_START_NAME": "Round Up" },
        { "RULE_START_ID": 2, "RULE_START_NAME": "Round Down" },
        { "RULE_START_ID": 3, "RULE_START_NAME": "Actuals" }
    ];

    $scope.ROUNDING_RULE_END_LIST = [
        { "RULE_END_ID": 1, "RULE_END_NAME": "Round Up" },
        { "RULE_END_ID": 2, "RULE_END_NAME": "Round Down" },
        { "RULE_END_ID": 3, "RULE_END_NAME": "Actuals" }
    ];

    $scope.WEEKDAY_LIST = [
        { "DAY_ID": 0, "DAY_NAME": "SUNDAY " },
        { "DAY_ID": 1, "DAY_NAME": "MONDAY" },
        { "DAY_ID": 2, "DAY_NAME": "TUESDAY" },
        { "DAY_ID": 3, "DAY_NAME": "WEDNESDAY " },
        { "DAY_ID": 4, "DAY_NAME": "THURSDAY " },
        { "DAY_ID": 5, "DAY_NAME": "FRIDAY " },
        { "DAY_ID": 6, "DAY_NAME": "SATURDAY" }
    ];

    $scope.MULTIPLICATION_FACTORS_LIST = [
        { "FACTOR_NAME": "x0.5", "FACTOR_VALUE": "0.5" },
        { "FACTOR_NAME": "x1", "FACTOR_VALUE": "1.0" },
        { "FACTOR_NAME": "x1.5", "FACTOR_VALUE": "1.5" },
        { "FACTOR_NAME": "x2", "FACTOR_VALUE": "2.0" },
        { "FACTOR_NAME": "x2.5", "FACTOR_VALUE": "2.5" },
        { "FACTOR_NAME": "x3", "FACTOR_VALUE": "3.0" }
    ];
    $scope.SELECTED_RULE_START_Fn = function (_start) {
        $scope.PunchClockRulesSearch.CUSTOM_RULE_START_NAME = _start.RULE_START_NAME;
        $scope.PunchClockRulesSearch.RULE_START_ID = _start.RULE_START_ID;
    };
    $scope.SELECTED_RULE_END_Fn = function (_end) {
        $scope.PunchClockRulesSearch.CUSTOM_RULE_END_NAME = _end.RULE_END_NAME;
        $scope.PunchClockRulesSearch.RULE_END_ID = _end.RULE_END_ID;
    };

    $scope.ROUND_RULE_SAVE_Fn = function () {
        var SETTINGS = [];
        var readonly = new Object()
        readonly.SETTING_VALUE = $scope.PunchClockRulesSearch.RULE_START_ID;
        readonly.SETTING_MASTER_ID = 64;
        SETTINGS.push(readonly);

        readonly = new Object()
        readonly.SETTING_VALUE = $scope.PunchClockRulesSearch.RULE_END_ID;
        readonly.SETTING_MASTER_ID = 65;
        SETTINGS.push(readonly);

        $scope.INS_UPD_CUSTOMER_SETTINGS('', '', '', '', '', '', '', SETTINGS);
    };

    $scope.CLOCK_INOUT_RULE_SAVE_Fn = function () {
        $scope.ClockRuleform.submitted = true;
        if ($scope.ClockRuleform.$valid) {
            var SETTINGS = [];
            var readonly = new Object()
            readonly.SETTING_VALUE = $scope.PunchClockRulesSearch.TRACK_EMPLOYEE_EARLY || 0;
            readonly.SETTING_MASTER_ID = 66;
            SETTINGS.push(readonly);

            readonly = new Object()
            readonly.SETTING_VALUE = $scope.PunchClockRulesSearch.TRACK_EMPLOYEE_LATE || 0;
            readonly.SETTING_MASTER_ID = 67;
            SETTINGS.push(readonly);

            $scope.INS_UPD_CUSTOMER_SETTINGS('', '', '', '', '', '', '', SETTINGS);
        }
    };

    $scope.SELECTED_FACTOR_Fn = function (_factor, show_modal) {
        if (show_modal == 0) {
            $('#multiplication-factor-alert').modal('hide');
        }
        if (_factor.FACTOR_VALUE > 2 && show_modal == 1) {
            $('#multiplication-factor-alert').modal('show');
            $scope.SELECTED_MULTI_FACTOR = _factor;
        } else {

            $scope.PunchClockRulesSearch.CUSTOM_FACTOR_NAME = _factor.FACTOR_NAME;
            $scope.PunchClockRulesSearch.FACTOR_VALUE = _factor.FACTOR_VALUE;
        }

    };

    $scope.ADD_OVERTIME_DEPARTMENTS_Fn = function (_department) {
        $scope.overtimeDepartmentSearch = '';
        $scope.ADD_OVERTIME_DEPARTMENTS_LIST.push(angular.copy(_department));
        $scope.OVERTIME_DEPARTMENTS_LIST = $scope.OVERTIME_DEPARTMENTS_LIST.filter(function (department) {
            return department !== _department;
        });
        $scope.INS_UPD_CUSTOMER_SETTINGS(anyDataExistsInDDList(4), 71, '', 2, 0, _department.DEPARTMENT_ID);
    };
    $scope.REMOVE_OVERTIME_DEPARTMENTS_Fn = function (_department) {
        $scope.OVERTIME_DEPARTMENTS_LIST.push(angular.copy(_department));
        $scope.ADD_OVERTIME_DEPARTMENTS_LIST = $scope.ADD_OVERTIME_DEPARTMENTS_LIST.filter(function (department) {
            return department !== _department;
        });
        $scope.INS_UPD_CUSTOMER_SETTINGS(anyDataExistsInDDList(4), 71, '', 2, 1, _department.DEPARTMENT_ID, _department.TABLE_ID);
    };
    $scope.ADD_OVERTIME_POSITIONS_Fn = function (_position) {
        $scope.overtimePositionSearch = '';
        $scope.ADD_OVERTIME_POSITIONS_LIST.push(angular.copy(_position));
        $scope.OVERTIME_POSITIONS_LIST = $scope.OVERTIME_POSITIONS_LIST.filter(function (position) {
            return position !== _position;
        });
        $scope.INS_UPD_CUSTOMER_SETTINGS(anyDataExistsInDDList(4), 71, '', 3, 0, _position.POSITION_ID);
    };
    $scope.REMOVE_OVERTIME_POSITIONS_Fn = function (_postition) {
        $scope.OVERTIME_POSITIONS_LIST.push(angular.copy(_postition));
        $scope.ADD_OVERTIME_POSITIONS_LIST = $scope.ADD_OVERTIME_POSITIONS_LIST.filter(function (position) {
            return position !== _postition;
        });
        $scope.INS_UPD_CUSTOMER_SETTINGS(anyDataExistsInDDList(4), 71, '', 3, 1, _postition.POSITION_ID, _postition.TABLE_ID);
    };
    $scope.ADD_OVERTIME_EMPLOYEE_Fn = function (_employee) {
        $scope.overtimeEmployeeSearch = '';
        $scope.ADD_OVERTIME_EMPLOYEES_LIST.push(angular.copy(_employee));
        $scope.OVERTIME_EMPLOYEES_LIST = $scope.OVERTIME_EMPLOYEES_LIST.filter(function (item) {
            return item !== _employee;
        });
        $scope.INS_UPD_CUSTOMER_SETTINGS(anyDataExistsInDDList(4), 71, '', 4, 0, _employee.EMPLY_PRSNL_ID);
    };
    $scope.REMOVE_OVERTIME_EMPLOYEE_Fn = function (_employee) {
        $scope.OVERTIME_EMPLOYEES_LIST.push(angular.copy(_employee));
        $scope.ADD_OVERTIME_EMPLOYEES_LIST = $scope.ADD_OVERTIME_EMPLOYEES_LIST.filter(function (item) {
            return item !== _employee;
        });
        $scope.INS_UPD_CUSTOMER_SETTINGS(anyDataExistsInDDList(4), 71, '', 4, 1, _employee.EMPLY_PRSNL_ID, _employee.TABLE_ID);
    };

    $scope.ADD_SCHEDULE_DEPARTMENTS_Fn = function (_department) {
        $scope.scheduleepartmentSearch = '';
        $scope.ADD_SCHEDULE_DEPARTMENTS_LIST.push(angular.copy(_department));
        $scope.SCHEDULE_DEPARTMENTS_LIST = $scope.SCHEDULE_DEPARTMENTS_LIST.filter(function (department) {
            return department !== _department;
        });
        $scope.INS_UPD_CUSTOMER_SETTINGS(anyDataExistsInDDList(5), 73, '', 2, 0, _department.DEPARTMENT_ID);
    };
    $scope.REMOVE_SCHEDULE_DEPARTMENTS_Fn = function (_department) {
        $scope.SCHEDULE_DEPARTMENTS_LIST.push(angular.copy(_department));
        $scope.ADD_SCHEDULE_DEPARTMENTS_LIST = $scope.ADD_SCHEDULE_DEPARTMENTS_LIST.filter(function (department) {
            return department !== _department;
        });
        $scope.INS_UPD_CUSTOMER_SETTINGS(anyDataExistsInDDList(5), 73, '', 2, 1, _department.DEPARTMENT_ID, _department.TABLE_ID);
    };

    $scope.ADD_SCHEDULE_EMPLOYEE_Fn = function (_employee) {
        $scope.scheduleEmployeeSearch = '';
        $scope.ADD_SCHEDULE_EMPLOYEES_LIST.push(angular.copy(_employee));
        $scope.SCHEDULE_EMPLOYEES_LIST = $scope.SCHEDULE_EMPLOYEES_LIST.filter(function (item) {
            return item !== _employee;
        });
        $scope.INS_UPD_CUSTOMER_SETTINGS(anyDataExistsInDDList(5), 73, '', 4, 0, _employee.EMPLY_PRSNL_ID);
    };
    $scope.REMOVE_SCHEDULE_EMPLOYEE_Fn = function (_employee) {
        $scope.SCHEDULE_EMPLOYEES_LIST.push(angular.copy(_employee));
        $scope.ADD_SCHEDULE_EMPLOYEES_LIST = $scope.ADD_SCHEDULE_EMPLOYEES_LIST.filter(function (item) {
            return item !== _employee;
        });
        $scope.INS_UPD_CUSTOMER_SETTINGS(anyDataExistsInDDList(5), 73, '', 4, 1, _employee.EMPLY_PRSNL_ID, _employee.TABLE_ID);
    };

    $scope.ADMIN_GET_BRANCH_LIST = function () {
        var PunchClockObject = new Object();
        PunchClockObject.CUSTOMER_ID = $scope.PunchClockGeneralSearch.CUSTOMER_ID;
        PrcCommMethods.HUMANRESOURCE_API(PunchClockObject, 'ADMIN_GET_BRANCH_LIST').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.HR_BRANCH_LIST = data.data.Table;
                $scope.DD_BRANCH_LIST = data.data.Table;
                $scope.SHIFT_BRANCH_LIST = data.data.Table;
                $scope.ROTA_BRANCH_LIST = data.data.Table;
                $scope.BRANCH_WIFI_LIST = data.data.Table;
            }
            else {
                $scope.HR_BRANCH_LIST = [];
                $scope.DD_BRANCH_LIST = [];
                $scope.SHIFT_BRANCH_LIST = [];
                $scope.ROTA_BRANCH_LIST = [];
                $scope.BRANCH_WIFI_LIST = [];
            }
            $scope.GET_CUSTOMER_SETTINGS($scope.PunchClockGeneralSearch, '57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73');
        });

    };

    $scope.HRM_GET_OVERTIME_RULES = function () {
        var PunchClockObject = new Object();
        PunchClockObject.CUSTOMER_ID = $scope.PunchClockRulesSearch.CUSTOMER_ID;
        PrcCommMethods.HUMANRESOURCE_API(PunchClockObject, 'HRM_GET_OVERTIME_RULES').then(function (data) {
            if (data.data.Table.length > 0) {
                var result = data.data.Table[0];
                $scope.PunchClockRulesSearch.OVERTIME_RULES_ID = result.OVERTIME_RULES_ID;
                $scope.PunchClockRulesSearch.LENGTH = result.LENGTH;
                $scope.PunchClockRulesSearch.WAGE_MULTIPLIER = result.WAGE_MULTIPLIER;
            }
            else {

            }
            if (data.data.Table1.length > 0) {
                var result = data.data.Table1;
                angular.forEach(result, function (_loop_value) {
                    var p_index = $scope.POSITIONS_ORULE_LIST.findIndex(x => x.POSITION_ID == _loop_value.POSITION_ID)
                    if (p_index >= 0) {
                        $scope.POSITIONS_ORULE_LIST[p_index].IS_SELECTED = true;
                    }
                });
            }
            if (data.data.Table2.length > 0) {
                var result = data.data.Table2;
                angular.forEach(result, function (_loop_value) {
                    var p_index = $scope.WEEKDAY_LIST.findIndex(x => x.DAY_ID == _loop_value.DAY_OF_THE_WEEK)
                    if (p_index >= 0) {
                        $scope.WEEKDAY_LIST[p_index].IS_SELECTED = true;
                    }
                });
            }

        });

    };
    // common function
    $scope.GET_CUSTOMER_SETTINGS = function (_param_retun_value, _param_tableids) {
        var punchClockObject = new Object();
        punchClockObject.CUSTOMER_ID = _param_retun_value.CUSTOMER_ID;
        punchClockObject.MODULE_ID = _param_retun_value.MODULE_ID;
        punchClockObject.TABLE_ID_LIST = [];

        angular.forEach(_param_tableids.split(','), function (_loop_value) {
            var readonly = new Object();
            readonly.TABLE_ID = _loop_value;
            punchClockObject.TABLE_ID_LIST.push(readonly);
        });
        PrcCommMethods.HUMANRESOURCE_API(punchClockObject, 'GET_CUSTOMER_SETTINGS').then(function (data) {
            if (data.data.Table.length > 0) {
                angular.forEach(data.data.Table, function (_loop_value) {
                    if (_loop_value.SETTING_MASTER_ID == 57) {
                        $scope.PunchClockGeneralSearch.ALLOW_QR = parseInt(_loop_value.SETTING_VALUE) == 0 ? false : true;
                        $scope.PunchClockGeneralSearch.MINS = parseInt(_loop_value.SETTING_VALUE) == 0 ? 0 : parseInt(_loop_value.SETTING_VALUE);
                    }
                    else if (_loop_value.SETTING_MASTER_ID == 58) {
                        $scope.PunchClockGeneralSearch.EXCEPTION_CLOCK = parseInt(_loop_value.SETTING_VALUE) == 1 ? true : false;
                    }
                    else if (_loop_value.SETTING_MASTER_ID == 59) {
                        $scope.PunchClockGeneralSearch.CLOCK_IN_ALLOW = parseInt(_loop_value.SETTING_VALUE) == 0 ? false : true;
                        if ($scope.PunchClockGeneralSearch.CLOCK_IN_ALLOW) {
                            $scope.PunchClockGeneralSearch.HOURS = parseInt(_loop_value.SETTING_VALUE);
                        }
                    }
                    else if (_loop_value.SETTING_MASTER_ID == 60) {
                        const setting_value = parseInt(_loop_value.SETTING_VALUE);
                        $scope.PunchClockGeneralSearch.ENABLE_CLOCK = setting_value == 0 ? false : true;
                    }
                    else if (_loop_value.SETTING_MASTER_ID == 61) {
                        $scope.PunchClockGeneralSearch.ENABLE_SUBTRACT = parseFloat(_loop_value.SETTING_VALUE) == 1 ? true : false;
                    }
                    else if (_loop_value.SETTING_MASTER_ID == 62) {
                        $scope.PunchClockGeneralSearch.ENABLE_EMPLOYEE_BREAK = parseFloat(_loop_value.SETTING_VALUE) == 1 ? true : false;
                    }
                    else if (_loop_value.SETTING_MASTER_ID == 63) {
                        $scope.PunchClockGeneralSearch.ROTA = parseFloat(_loop_value.SETTING_VALUE) == 1 ? true : false;
                    }
                    else if (_loop_value.SETTING_MASTER_ID == 64) {
                        $scope.PunchClockRulesSearch.RULE_START_ID = parseFloat(_loop_value.SETTING_VALUE);

                        if ($scope.PunchClockRulesSearch.RULE_START_ID == 0) {
                            $scope.SELECTED_RULE_START_Fn($scope.ROUNDING_RULE_START_LIST[2]);
                        } else {
                            $scope.SELECTED_RULE_START_Fn($scope.ROUNDING_RULE_START_LIST[$scope.PunchClockRulesSearch.RULE_START_ID - 1]);
                        }
                    }
                    else if (_loop_value.SETTING_MASTER_ID == 65) {
                        $scope.PunchClockRulesSearch.RULE_END_ID = parseFloat(_loop_value.SETTING_VALUE);

                        if ($scope.PunchClockRulesSearch.RULE_END_ID == 0) {
                            $scope.SELECTED_RULE_END_Fn($scope.ROUNDING_RULE_END_LIST[2]);
                        } else {
                            $scope.SELECTED_RULE_END_Fn($scope.ROUNDING_RULE_END_LIST[$scope.PunchClockRulesSearch.RULE_END_ID - 1]);
                        }
                    }
                    else if (_loop_value.SETTING_MASTER_ID == 66) {
                        $scope.PunchClockRulesSearch.TRACK_EMPLOYEE_EARLY = parseFloat(_loop_value.SETTING_VALUE);
                    }
                    else if (_loop_value.SETTING_MASTER_ID == 67) {
                        $scope.PunchClockRulesSearch.TRACK_EMPLOYEE_LATE = parseFloat(_loop_value.SETTING_VALUE);
                    }
                    else if (_loop_value.SETTING_MASTER_ID == 68) {
                        $scope.PunchClockRulesSearch.THRESHOLD_FOR_VARIANCE = parseFloat(_loop_value.SETTING_VALUE);
                    }
                    else if (_loop_value.SETTING_MASTER_ID == 69) {
                        $scope.PunchClockRulesSearch.ALLOW_AUTO_CLOCK = parseFloat(_loop_value.SETTING_VALUE) == 0 ? false : true;
                        if ($scope.PunchClockRulesSearch.ALLOW_AUTO_CLOCK) {
                            $scope.PunchClockRulesSearch.HOURS = parseFloat(_loop_value.SETTING_VALUE);
                        }
                    }
                    else if (_loop_value.SETTING_MASTER_ID == 70) {
                        $scope.PunchClockRulesSearch.SCHEDULE_MESSAGE = _loop_value.SETTING_VALUE;
                    }
                    else if (_loop_value.SETTING_MASTER_ID == 71) {
                        $scope.PunchClockRulesSearch.OVERTIME_PAY = parseFloat(_loop_value.SETTING_VALUE) == 1 ? 1 : 0;
                    }
                    else if (_loop_value.SETTING_MASTER_ID == 72) {
                        $scope.PunchClockRulesSearch.ENABLE = parseFloat(_loop_value.SETTING_VALUE) == 0 ? false : true;
                        if ($scope.PunchClockRulesSearch.ENABLE) {
                            $scope.PunchClockRulesSearch.FACTOR_VALUE = parseFloat(_loop_value.SETTING_VALUE);
                            var f_index = $scope.MULTIPLICATION_FACTORS_LIST.findIndex(x => x.FACTOR_VALUE == $scope.PunchClockRulesSearch.FACTOR_VALUE);
                            if (f_index >= 0) {
                                $scope.SELECTED_FACTOR_Fn($scope.MULTIPLICATION_FACTORS_LIST[f_index]);
                            }
                        } else {
                            $scope.SELECTED_FACTOR_Fn($scope.MULTIPLICATION_FACTORS_LIST[1]);
                        }
                    } else if (_loop_value.SETTING_MASTER_ID == 73) {
                        $scope.PunchClockRulesSearch.HIDE_SCEDULE = parseFloat(_loop_value.SETTING_VALUE) == 0 ? 0 : 1;
                    }

                });
            }
            else if (data.data == 0) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
            if (data.data.Table1.length > 0) {
                angular.forEach(data.data.Table1, function (_loop_value) {
                    if (_loop_value.SETTING_MASTER_ID == 58) {
                        // for Exception
                        $scope.ADD_BRANCH_LIST.push(_loop_value);
                        $scope.DD_BRANCH_LIST = $scope.DD_BRANCH_LIST.filter(function (branch) {
                            return branch.BRANCH_ID !== _loop_value.BRANCH_ID;
                        });

                    }
                    if (_loop_value.SETTING_MASTER_ID == 62) {
                        // for Shifts
                        $scope.ADD_SHIFT_BRANCH_LIST.push(_loop_value);
                        $scope.SHIFT_BRANCH_LIST = $scope.SHIFT_BRANCH_LIST.filter(function (branch) {
                            return branch.BRANCH_ID !== _loop_value.BRANCH_ID;
                        });
                    }
                    if (_loop_value.SETTING_MASTER_ID == 63) {
                        // for ROTA
                        $scope.ADD_ROTA_BRANCH_LIST.push(_loop_value);
                        $scope.ROTA_BRANCH_LIST = $scope.ROTA_BRANCH_LIST.filter(function (branch) {
                            return branch.BRANCH_ID !== _loop_value.BRANCH_ID;
                        });
                    }

                });
            }

            if (data.data.Table2.length > 0) {
                angular.forEach(data.data.Table2, function (_loop_value) {
                    if (_loop_value.SETTING_MASTER_ID == 58) {
                        // for Exception
                        $scope.ADD_DEPARTMENTS_LIST.push(_loop_value);
                        $scope.DEPARTMENTS_LIST = $scope.DEPARTMENTS_LIST.filter(function (department) {
                            return department.DEPARTMENT_ID !== _loop_value.DEPARTMENT_ID;
                        });

                    }
                    if (_loop_value.SETTING_MASTER_ID == 62) {
                        // for Shifts
                        $scope.ADD_SHIFT_DEPARTMENTS_LIST.push(_loop_value);
                        $scope.SHIFT_DEPARTMENTS_LIST = $scope.SHIFT_DEPARTMENTS_LIST.filter(function (department) {
                            return department.DEPARTMENT_ID !== _loop_value.DEPARTMENT_ID;
                        });
                    }
                    if (_loop_value.SETTING_MASTER_ID == 63) {
                        // for ROTA
                        $scope.ADD_ROTA_DEPARTMENTS_LIST.push(_loop_value);
                        $scope.ROTA_DEPARTMENTS_LIST = $scope.ROTA_DEPARTMENTS_LIST.filter(function (department) {
                            return department.DEPARTMENT_ID !== _loop_value.DEPARTMENT_ID;
                        });
                    }
                    if (_loop_value.SETTING_MASTER_ID == 71) {
                        // for OVERTIME
                        $scope.ADD_OVERTIME_DEPARTMENTS_LIST.push(_loop_value);
                        $scope.OVERTIME_DEPARTMENTS_LIST = $scope.OVERTIME_DEPARTMENTS_LIST.filter(function (department) {
                            return department.DEPARTMENT_ID !== _loop_value.DEPARTMENT_ID;
                        });
                    }
                    if (_loop_value.SETTING_MASTER_ID == 73) {
                        // for SCHEDULE
                        $scope.ADD_SCHEDULE_DEPARTMENTS_LIST.push(_loop_value);
                        $scope.SCHEDULE_DEPARTMENTS_LIST = $scope.SCHEDULE_DEPARTMENTS_LIST.filter(function (department) {
                            return department.DEPARTMENT_ID !== _loop_value.DEPARTMENT_ID;
                        });
                    }
                });
            }

            if (data.data.Table3.length > 0) {
                angular.forEach(data.data.Table3, function (_loop_value) {
                    if (_loop_value.SETTING_MASTER_ID == 58) {
                        // for Exception
                        $scope.ADD_POSITIONS_LIST.push(_loop_value);
                        $scope.POSITIONS_LIST = $scope.POSITIONS_LIST.filter(function (position) {
                            return position.POSITION_ID !== _loop_value.POSITION_ID;
                        });

                    }
                    if (_loop_value.SETTING_MASTER_ID == 62) {
                        // for Shifts
                        $scope.ADD_SHIFT_POSITIONS_LIST.push(_loop_value);
                        $scope.SHIFT_POSITIONS_LIST = $scope.SHIFT_POSITIONS_LIST.filter(function (position) {
                            return position.POSITION_ID !== _loop_value.POSITION_ID;
                        });
                    }
                    if (_loop_value.SETTING_MASTER_ID == 63) {
                        // for ROTA
                        $scope.ADD_ROTA_POSITIONS_LIST.push(_loop_value);
                        $scope.ROTA_POSITIONS_LIST = $scope.ROTA_POSITIONS_LIST.filter(function (position) {
                            return position.POSITION_ID !== _loop_value.POSITION_ID;
                        });
                    }
                    if (_loop_value.SETTING_MASTER_ID == 71) {
                        // for OVERTIME
                        $scope.ADD_OVERTIME_POSITIONS_LIST.push(_loop_value);
                        $scope.OVERTIME_POSITIONS_LIST = $scope.OVERTIME_POSITIONS_LIST.filter(function (position) {
                            return position.POSITION_ID !== _loop_value.POSITION_ID;
                        });
                    }
                });
            }

            if (data.data.Table4.length > 0) {
                angular.forEach(data.data.Table4, function (_loop_value) {
                    if (_loop_value.SETTING_MASTER_ID == 58) {
                        // for Exception
                        $scope.ADD_EMPLOYEES_LIST.push(_loop_value);
                        $scope.EMPLOYEES_LIST = $scope.EMPLOYEES_LIST.filter(function (employee) {
                            return employee.EMPLY_PRSNL_ID !== _loop_value.EMPLY_PRSNL_ID;
                        });

                    }
                    if (_loop_value.SETTING_MASTER_ID == 62) {
                        // for Shifts
                        $scope.ADD_SHIFT_EMPLOYEES_LIST.push(_loop_value);
                        $scope.SHIFT_EMPLOYEES_LIST = $scope.SHIFT_EMPLOYEES_LIST.filter(function (employee) {
                            return employee.EMPLY_PRSNL_ID !== _loop_value.POSITIEMPLY_PRSNL_IDON_ID;
                        });
                    }
                    if (_loop_value.SETTING_MASTER_ID == 63) {
                        // for ROTA
                        $scope.ADD_ROTA_EMPLOYEES_LIST.push(_loop_value);
                        $scope.ROTA_EMPLOYEES_LIST = $scope.ROTA_EMPLOYEES_LIST.filter(function (employee) {
                            return employee.EMPLY_PRSNL_ID !== _loop_value.EMPLY_PRSNL_ID;
                        });
                    }
                    if (_loop_value.SETTING_MASTER_ID == 71) {
                        // for OVERTIME
                        $scope.ADD_OVERTIME_EMPLOYEES_LIST.push(_loop_value);
                        $scope.OVERTIME_EMPLOYEES_LIST = $scope.OVERTIME_EMPLOYEES_LIST.filter(function (employee) {
                            return employee.EMPLY_PRSNL_ID !== _loop_value.EMPLY_PRSNL_ID;
                        });
                    }
                    if (_loop_value.SETTING_MASTER_ID == 73) {
                        // for SCHEDULE
                        $scope.ADD_SCHEDULE_EMPLOYEES_LIST.push(_loop_value);
                        $scope.SCHEDULE_EMPLOYEES_LIST = $scope.SCHEDULE_EMPLOYEES_LIST.filter(function (employee) {
                            return employee.EMPLY_PRSNL_ID !== _loop_value.EMPLY_PRSNL_ID;
                        });
                    }
                });
            }
        });
    };
    $scope.HRM_INS_UPD_OVERTIME_RULES = function () {

        if ($scope.OverTimeRuleform.$valid) {


            var OverTimeRuleObject = new Object();

            OverTimeRuleObject.CUSTOMER_ID = $scope.PunchClockRulesSearch.CUSTOMER_ID;
            OverTimeRuleObject.ACTIVE = 1;
            OverTimeRuleObject.USER_ID = $scope.PunchClockRulesSearch.USER_ID;

            OverTimeRuleObject.OVERTIME_RULES_ID = $scope.PunchClockRulesSearch.OVERTIME_RULES_ID || 0;
            OverTimeRuleObject.LENGTH = $scope.PunchClockRulesSearch.LENGTH;
            OverTimeRuleObject.WAGE_MULTIPLIER = $scope.PunchClockRulesSearch.WAGE_MULTIPLIER;

            OverTimeRuleObject.OVERTIME_RULES_POSITIONS_ID_LIST = [];
            OverTimeRuleObject.OVERTIME_RULES_DAY_ID_LIST = [];

            angular.forEach($scope.WEEKDAY_LIST, function (_loopValue) {
                if (_loopValue.IS_SELECTED) {
                    var readOnly = new Object();
                    readOnly.TABLE_ID = _loopValue.DAY_ID;
                    OverTimeRuleObject.OVERTIME_RULES_DAY_ID_LIST.push(readOnly);
                }
            });

            angular.forEach($scope.POSITIONS_ORULE_LIST, function (_loopValue) {
                if (_loopValue.IS_SELECTED) {
                    var readOnly = new Object();
                    readOnly.TABLE_ID = _loopValue.POSITION_ID
                    OverTimeRuleObject.OVERTIME_RULES_POSITIONS_ID_LIST.push(readOnly);
                }
            });

            if (OverTimeRuleObject.OVERTIME_RULES_POSITIONS_ID_LIST.length == 0) {
                var readOnly = new Object();
                readOnly.TABLE_ID = 0;
                OverTimeRuleObject.OVERTIME_RULES_POSITIONS_ID_LIST.push(readOnly);
            }
            if (OverTimeRuleObject.OVERTIME_RULES_DAY_ID_LIST.length == 0) {
                var readOnly = new Object();
                readOnly.TABLE_ID = 0;
                OverTimeRuleObject.OVERTIME_RULES_DAY_ID_LIST.push(readOnly);
            }
            PrcCommMethods.HUMANRESOURCE_API(OverTimeRuleObject, 'HRM_INS_UPD_OVERTIME_RULES').then(function (data) {
                if (data.data > 0) {
                    if ($scope.PunchClockRulesSearch.OVERTIME_RULES_ID == 0 && $scope.PunchClockRulesSearch.OVERTIME_RULES_ID == undefined) {
                        $scope.$parent.ShowAlertBox("Success", 'Overtime Rule created successfully', 3000);
                    }
                    else if ($scope.PunchClockRulesSearch.OVERTIME_RULES_ID > 0) {
                        $scope.$parent.ShowAlertBox("Success", 'Overtime Rule updated successfully', 3000);
                    }
                }
                else if (data.data < 0) {
                    $scope.$parent.ShowAlertBox("Attention", 'Already Added', 3000);
                }
                if (data.data == 0) {
                    $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                }
            });
        } else {
            $scope.OverTimeRuleform.submitted = true;
        }
    };
    // commone function
   
    $scope.INS_UPD_CUSTOMER_SETTINGS = function (SETTING_VALUE, SETTING_MASTER_ID, MULTI_SETTINGS_REMOVE_TYPE, TYPE_FLAG, DELETE_FLAG, RELATIVE_ID, TABLE_ID, MULTI_SETTINGS) {
        if (SETTING_MASTER_ID == 57 && SETTING_VALUE < 5 && $scope.PunchClockGeneralSearch.ALLOW_QR) {
            $scope.$parent.ShowAlertBox("Warning", 'QR code refresh interval must be at least 5 minutes.', 3000);
        } else {

            var CusModelObj = new Object();
            CusModelObj.CUSTOMER_ID = $scope.PunchClockGeneralSearch.CUSTOMER_ID;
            CusModelObj.USER_ID = $scope.PunchClockGeneralSearch.USER_ID;

            CusModelObj.CUSTOMER_SETTINGS_TYPE = [];
            CusModelObj.BRANCH_TYPE = [];
            CusModelObj.POSITIONS_TYPE = [];
            CusModelObj.DEPARTMENTS_TYPE = [];
            CusModelObj.EMPLOYEES_TYPE = [];

            // MULTI_SETTINGS_REMOVE_TYPE 2 for shifts
            if (MULTI_SETTINGS_REMOVE_TYPE == 2) {
                if ($scope.ADD_SHIFT_BRANCH_LIST.length > 0) {
                    angular.forEach($scope.ADD_SHIFT_BRANCH_LIST, function (_loop_value) {
                        var readonly = new Object();
                        readonly.TABLE_ID = _loop_value.TABLE_ID || 0;
                        readonly.RELATIVE_ID = _loop_value.BRANCH_ID;
                        readonly.INCLUDE_FLAG = 0;
                        readonly.DELETE_FLAG = 1;
                        readonly.SETTING_MASTER_ID = _loop_value.SETTING_MASTER_ID;
                        CusModelObj.BRANCH_TYPE.push(readonly);
                        $scope.SHIFT_BRANCH_LIST.push(_loop_value);
                    });
                    $scope.ADD_SHIFT_BRANCH_LIST = [];
                }
                if ($scope.ADD_SHIFT_DEPARTMENTS_LIST.length > 0) {
                    angular.forEach($scope.ADD_SHIFT_DEPARTMENTS_LIST, function (_loop_value) {
                        var readonly = new Object();
                        readonly.TABLE_ID = _loop_value.TABLE_ID || 0;
                        readonly.RELATIVE_ID = _loop_value.DEPARTMENT_ID;
                        readonly.INCLUDE_FLAG = 0;
                        readonly.DELETE_FLAG = 1;
                        readonly.SETTING_MASTER_ID = _loop_value.SETTING_MASTER_ID;
                        CusModelObj.DEPARTMENTS_TYPE.push(readonly);
                        $scope.SHIFT_DEPARTMENTS_LIST.push(_loop_value);
                    });
                    $scope.ADD_SHIFT_DEPARTMENTS_LIST = [];
                }
                if ($scope.ADD_SHIFT_POSITIONS_LIST.length > 0) {
                    angular.forEach($scope.ADD_SHIFT_POSITIONS_LIST, function (_loop_value) {
                        var readonly = new Object();
                        readonly.TABLE_ID = _loop_value.TABLE_ID || 0;
                        readonly.RELATIVE_ID = _loop_value.POSITION_ID;
                        readonly.INCLUDE_FLAG = 0;
                        readonly.DELETE_FLAG = 1;
                        readonly.SETTING_MASTER_ID = _loop_value.SETTING_MASTER_ID;
                        CusModelObj.POSITIONS_TYPE.push(readonly);
                        $scope.SHIFT_POSITIONS_LIST.push(_loop_value);
                    });
                    $scope.ADD_SHIFT_POSITIONS_LIST = [];
                }
                if ($scope.ADD_SHIFT_EMPLOYEES_LIST.length > 0) {
                    angular.forEach($scope.ADD_SHIFT_EMPLOYEES_LIST, function (_loop_value) {
                        var readonly = new Object();
                        readonly.TABLE_ID = _loop_value.TABLE_ID || 0;
                        readonly.RELATIVE_ID = _loop_value.EMPLY_PRSNL_ID;
                        readonly.INCLUDE_FLAG = 0;
                        readonly.DELETE_FLAG = 1;
                        readonly.SETTING_MASTER_ID = _loop_value.SETTING_MASTER_ID;
                        CusModelObj.EMPLOYEES_TYPE.push(readonly);
                        $scope.SHIFT_EMPLOYEES_LIST.push(_loop_value);
                    });
                    $scope.ADD_SHIFT_EMPLOYEES_LIST = [];
                }

            }

            if (MULTI_SETTINGS && MULTI_SETTINGS.length > 0) {
                angular.forEach(MULTI_SETTINGS, function (_loop_value) {
                    var readonly = new Object();
                    readonly.SETTING_VALUE = _loop_value.SETTING_VALUE;
                    readonly.SETTING_MASTER_ID = _loop_value.SETTING_MASTER_ID;
                    CusModelObj.CUSTOMER_SETTINGS_TYPE.push(readonly);
                });
            } else {
                var readonly = new Object();
                readonly.SETTING_VALUE = SETTING_VALUE || 0;
                readonly.SETTING_MASTER_ID = SETTING_MASTER_ID;
                CusModelObj.CUSTOMER_SETTINGS_TYPE.push(readonly);
            }


            // TYPE_FLAG 1 for Branch, 2 for Department, 3 for Position, 4 for Employees

            let resultobject = $scope.$parent.BLANK_SETTING_OBJECT();
            if (TYPE_FLAG == 1) {
                var readonly = new Object();
                readonly.TABLE_ID = TABLE_ID || 0;
                readonly.RELATIVE_ID = RELATIVE_ID;
                readonly.INCLUDE_FLAG = 0;
                readonly.DELETE_FLAG = DELETE_FLAG == 1 ? 1 : 0;
                readonly.SETTING_MASTER_ID = SETTING_MASTER_ID;
                CusModelObj.BRANCH_TYPE.push(readonly);

            } else if (CusModelObj.BRANCH_TYPE.length == 0) {
                CusModelObj.BRANCH_TYPE.push(resultobject);
            }

            if (TYPE_FLAG == 2) {
                var readonly = new Object();
                readonly.TABLE_ID = TABLE_ID || 0;
                readonly.RELATIVE_ID = RELATIVE_ID;
                readonly.INCLUDE_FLAG = 0;
                readonly.DELETE_FLAG = DELETE_FLAG == 1 ? 1 : 0;
                readonly.SETTING_MASTER_ID = SETTING_MASTER_ID;
                CusModelObj.DEPARTMENTS_TYPE.push(readonly);

            } else if (CusModelObj.DEPARTMENTS_TYPE.length == 0) {
                CusModelObj.DEPARTMENTS_TYPE.push(resultobject);
            }

            if (TYPE_FLAG == 3) {
                var readonly = new Object();
                readonly.TABLE_ID = TABLE_ID || 0;
                readonly.RELATIVE_ID = RELATIVE_ID;
                readonly.INCLUDE_FLAG = 0;
                readonly.DELETE_FLAG = DELETE_FLAG == 1 ? 1 : 0;
                readonly.SETTING_MASTER_ID = SETTING_MASTER_ID;
                CusModelObj.POSITIONS_TYPE.push(readonly);

            } else if (CusModelObj.POSITIONS_TYPE.length == 0) {
                CusModelObj.POSITIONS_TYPE.push(resultobject);
            }
            if (TYPE_FLAG == 4) {
                var readonly = new Object();
                readonly.TABLE_ID = TABLE_ID || 0;
                readonly.RELATIVE_ID = RELATIVE_ID;
                readonly.INCLUDE_FLAG = 0;
                readonly.DELETE_FLAG = DELETE_FLAG == 1 ? 1 : 0;
                readonly.SETTING_MASTER_ID = SETTING_MASTER_ID;
                CusModelObj.EMPLOYEES_TYPE.push(readonly);

            } else if (CusModelObj.EMPLOYEES_TYPE.length == 0) {
                CusModelObj.EMPLOYEES_TYPE.push(resultobject);
            }

            PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'INS_UPD_CUSTOMER_SETTINGS').then(function (data) {
                if (data.data > 0 && (DELETE_FLAG == 0 || DELETE_FLAG == undefined)) {
                    $scope.$parent.ShowAlertBox("Success", 'Updated successfully', 3000);
                } if (data.data > 0 && DELETE_FLAG == 1) {
                    $scope.$parent.ShowAlertBox("Success", 'Deleted successfully', 3000);
                }
                if (data.data == 0) {
                    $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                }
            });
        }
    };



    $scope.HRM_GET_PUNCHCLOCK_BRANCH_SETTINGS();

    $scope.HRM_GET_OVERTIME_RULES();
    $scope.HRM_GET_POSITIONS();
    $scope.HRM_GET_DEPARTMENTS();
    $scope.HRM_GET_EMPLOYTEE_LIST_BY_EMPLY_PRSNL_ID();
    $scope.HRM_GET_OVERTIME_RULES();

    // -------------------- Other Tab -------------------------


    $scope.HRM_GET_BRANCH_WIFI_MAPPING = function () {
        var PunchClockObject = new Object();
        PunchClockObject.CUSTOMER_ID = $scope.PunchClockGeneralSearch.CUSTOMER_ID;
        PrcCommMethods.HUMANRESOURCE_API(PunchClockObject, 'HRM_GET_BRANCH_WIFI_MAPPING').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.BRANCH_WIFI_MAPPING_LIST = data.data.Table;
            } else {
                $scope.ADD_BRANCH_WIFI();
            }
        });
    };

    $scope.nginit_wifi_mapping = function (wifi_param) {
        wifi_param.BRANCH_DEFAULT_TEXT = DD_Default_Text;
        if ((wifi_param.CUSTOM_BRANCH_NAME == undefined || wifi_param.CUSTOM_BRANCH_NAME == "" || wifi_param.CUSTOM_BRANCH_NAME == null) && (wifi_param.BRANCH_NAME == '' || wifi_param.BRANCH_NAME == undefined || wifi_param.BRANCH_NAME == null)) {
            wifi_param.CUSTOM_BRANCH_NAME = wifi_param.BRANCH_DEFAULT_TEXT;
        }
        else if (wifi_param.BRANCH_NAME != '' && wifi_param.BRANCH_NAME != undefined && wifi_param.BRANCH_NAME != null) {
            wifi_param.CUSTOM_BRANCH_NAME = wifi_param.BRANCH_NAME;
        };

    };

    $scope.HRM_INS_UPD_BRANCH_WIFI_MAPPING = function (DELETE_FLAG) {

        if ($scope.PunchClockOtherform.$valid) {

            var OverTimeOtherObject = new Object();
            OverTimeOtherObject.CUSTOMER_ID = $scope.PunchClockRulesSearch.CUSTOMER_ID;
            OverTimeOtherObject.USER_ID = $scope.PunchClockRulesSearch.USER_ID;
            OverTimeOtherObject.HRM_BRANCH_WIFI_MAPPING_TYPE = [];

            angular.forEach($scope.BRANCH_WIFI_MAPPING_LIST, function (_loopValue) {
                var readOnly = new Object();
                readOnly.BRANCH_WIFI_MAPPING_ID = _loopValue.BRANCH_WIFI_MAPPING_ID;
                readOnly.BRANCH_ID = _loopValue.BRANCH_ID;
                readOnly.WIFI_IP = _loopValue.WIFI_IP;
                readOnly.DELETE_FLAG = DELETE_FLAG == 1 ? 1 : 0;
                OverTimeOtherObject.HRM_BRANCH_WIFI_MAPPING_TYPE.push(readOnly);

            });

            let blankObject = $scope.$parent.BLANK_SETTING_OBJECT();
            if (OverTimeOtherObject.HRM_BRANCH_WIFI_MAPPING_TYPE.length == 0) {
                OverTimeOtherObject.HRM_BRANCH_WIFI_MAPPING_TYPE.push(blankObject);
            }

            PrcCommMethods.HUMANRESOURCE_API(OverTimeOtherObject, 'HRM_INS_UPD_BRANCH_WIFI_MAPPING').then(function (data) {
                if (data.data > 0) {
                    $scope.$parent.ShowAlertBox("Success", 'Branch Wifi updated successfully', 3000);
                }
                else if (data.data < 0) {
                    $scope.$parent.ShowAlertBox("Attention", 'Already Added', 3000);
                }
                if (data.data == 0) {
                    $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                }
            });
        } else {
            $scope.PunchClockOtherform.submitted = true;
        }
    };

    $scope.ADD_BRANCH_WIFI = function () {
        $scope.BRANCH_WIFI_MAPPING_LIST.push({
            BRANCH_WIFI_MAPPING_ID: '',
            BRANCH_ID: 0,
            WIFI_IP: '',
            CUSTOM_BRANCH_NAME: DD_Default_Text,
            BRANCH_DEFAULT_TEXT: DD_Default_Text,
            DELETE_FLAG: 0
        })
    };

    $scope.SELECTED_WIFI_BRANCH_Fn = function (_param_branch, _otherObject) {
        if (_param_branch == '') {
            _otherObject.CUSTOM_BRANCH_NAME = DD_Default_Text;
            _otherObject.BRANCH_ID = '';
        } else {
            _otherObject.CUSTOM_BRANCH_NAME = _param_branch.BRANCH_NAME;
            _otherObject.BRANCH_ID = _param_branch.BRANCH_ID;
        }


    }

    $scope.HRM_GET_BRANCH_WIFI_MAPPING();
    $scope.SET_DROPSCROLL = function () {
        $('.AddCustomScroll_Contact').find('.dropdown-menu').addClass('scrollbar-wrapper w-100');
        $('.AddCustomScroll_Contact').find('.dropdown-menu li').addClass('p-2');
    }
});