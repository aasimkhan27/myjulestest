app.controller('ScheduleController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    //$scope.$parent.DISPLAY_FLAG = true;
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(1);
    $scope.HR_COMMON_CODE_Fn();
    $scope.$parent.$parent.overlay_loading_HR_Loader = 'none';
    $scope.ScheduleSearch = {
        CUSTOMER_ID: $cookies.get("CUSTOMER_ID"),
        ENTITY_ID: null,
        MODULE_ID: $cookies.get("MODULE_ID"),
        USER_ID: $cookies.get("USERID"),
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        DD_DEFAULT_TEXT: $scope.$parent.DD_DEFAULT_TEXT,
        CUSTOM_BREAK_NAME: $scope.$parent.DD_DEFAULT_TEXT,
        FREQUENCY_NAME: '',
        YEAR: '',
    }
    $scope.ShiftSearch = {
        CUSTOMER_ID: $cookies.get("CUSTOMER_ID"),
        ENTITY_ID: null,
        MODULE_ID: $cookies.get("MODULE_ID"),
        USER_ID: $cookies.get("USERID"),
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        CUSTOM_BREAK_NAME: $scope.$parent.DD_DEFAULT_TEXT,
        FREQUENCY_NAME: '',
        YEAR: '',
        DD_DEFAULT_TEXT: $scope.$parent.DD_DEFAULT_TEXT,
        IS_BREAK_RULE_APPLIED: false,
        IS_SPECIAL_WAGE: false,
    }
    ///--- Ensure adequate rest time between shifts ID -> 82 SETTING_NAME -> Ensure adequate rest time between shifts
    //ID -> 51 SETTING_NAME -> Show as warning:: Enforce the rule SETTING_VALUE -> 0 WARNING 1 ENFORCE PARENT_ID -> 82 
    // 1 PAID 2 UNPAID
    //
    $scope.BREAK_LIST = [
        { "BREAK_RULE_TYPE_ID": "1", "BREAK_NAME": "Paid" },
        { "BREAK_RULE_TYPE_ID": "2", "BREAK_NAME": "Unpaid" }];

    $scope.WAGES_LIST = [
        { "WAGE_TYPE_ID": "1", "WAGE_NAME": "Hourly" },
        { "WAGE_TYPE_ID": "2", "WAGE_NAME": "Fixed Cost" },
        { "WAGE_TYPE_ID": "3", "WAGE_NAME": "Multiplier" }];

    $scope.RESET_Fn = function () {
        $scope.ScheduleSearch.BREAK_RULE_ID = "";
        $scope.ScheduleSearch.BREAK_RULE_NAME = "";
        $scope.ScheduleSearch.BREAK_DURATION = "";
        $scope.ScheduleSearch.SHIFT_DURATION = "";
        $scope.ScheduleSearch.CUSTOM_BREAK_NAME = $scope.ScheduleSearch.DD_DEFAULT_TEXT;
        $scope.BREAK_TYPES_FORM.submitted = false;
    }
    $scope.RESET_SHIFT_Fn = function () {
        $scope.SHIFT_FORM.submitted = false;
        $scope.ShiftSearch.CUSTOM_SHIFT_BREAK_NAME = $scope.ShiftSearch.DD_DEFAULT_TEXT;
        $scope.ShiftSearch.CUSTOM_WAGE_NAME = $scope.ShiftSearch.DD_DEFAULT_TEXT;
        $scope.ShiftSearch.SHIFT_MASTER_ID = "";
        $scope.ShiftSearch.SHIFT_NAME = "";
        $scope.ShiftSearch.START_TIME = "";
        $scope.ShiftSearch.END_TIME = "";
        $scope.ShiftSearch.SHIFT_COUNT = "";
        $scope.ShiftSearch.BREAK_HOURS = "";
        $scope.ShiftSearch.IS_BREAK_RULE_APPLIED = "";
        $scope.ShiftSearch.BREAK_TYPE_ID = "";
        $scope.ShiftSearch.NOTE = "";
        $scope.ShiftSearch.IS_SPECIAL_WAGE = "";
        $scope.ShiftSearch.WAGE = "";
        $scope.ShiftSearch.WAGE_TYPE_ID = "";
        $scope.ADD_SHIFT_DEPARTMENTS_LIST = [];
        $scope.ADD_SHIFT_POSITIONS_LIST = [];
        $scope.ADD_SHIFT_BRANCH_LIST = [];
        $scope.ADD_SHIFT_EMPLOYEES_LIST = [];
    }

    $scope.GET_CUSTOMER_SETTINGS = function (_param_retun_value, _param_tableids, _param_customer, _param_module) {
        var readOnlyObject = new Object();
        readOnlyObject.CUSTOMER_ID = _param_retun_value.CUSTOMER_ID;
        readOnlyObject.MODULE_ID = _param_retun_value.MODULE_ID;
        readOnlyObject.TABLE_ID_LIST = [];
        //46	Time format // 47	First day of the week
        angular.forEach(_param_tableids.split(','), function (_loop_value) {
            var readonly = new Object();
            readonly.TABLE_ID = _loop_value;
            readOnlyObject.TABLE_ID_LIST.push(readonly);
        });
        PrcCommMethods.HUMANRESOURCE_API(readOnlyObject, 'GET_CUSTOMER_SETTINGS').then(function (data) {
            if (data.data.Table.length > 0) {
                angular.forEach(data.data.Table, function (_loop_value) {
                    if (_loop_value.SETTING_MASTER_ID == 55) {
                        $scope.ScheduleSearch.ENABLE_EMPLOYEE_CONFIRM = parseInt(_loop_value.SETTING_VALUE) == 1 ? true : false;
                    }
                    else if (_loop_value.SETTING_MASTER_ID == 56) {
                        $scope.ScheduleSearch.ALLOW_EMPLOYEE_CONFIRM = parseFloat(_loop_value.SETTING_VALUE) == 1 ? true : false;
                    }
                    else if (_loop_value.SETTING_MASTER_ID == 52) {
                        $scope.ScheduleSearch.LIMIT_SCHEDULING_OVER = parseFloat(_loop_value.SETTING_VALUE);
                    }
                    else if (_loop_value.SETTING_MASTER_ID == 51) {
                        $scope.ScheduleSearch.SHOW_AS_WARNING = parseFloat(_loop_value.SETTING_VALUE) == 1 ? true : false;
                    }
                    else if (_loop_value.SETTING_MASTER_ID == 82) {
                        $scope.ScheduleSearch.ENSURE_ADEQUATE = false;
                        if (parseFloat(_loop_value.SETTING_VALUE) > 0) {
                            $scope.ScheduleSearch.ENSURE_ADEQUATE = true;
                            $scope.ScheduleSearch.VALUE_IN_HOURS = parseFloat(_loop_value.SETTING_VALUE);
                        }
                    }
                    else if (_loop_value.SETTING_MASTER_ID == 53) {
                        $scope.ShiftSearch.CROSS_SITE_SCHEDULING = parseFloat(_loop_value.SETTING_VALUE) == 1 ? true : false;
                    }
                    else if (_loop_value.SETTING_MASTER_ID == 54) {
                        $scope.ShiftSearch.FULL_NAME = parseFloat(_loop_value.SETTING_VALUE) == 1 ? true : false;
                    }
                });
            }
            else if (data.data == 0) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
        });
    }

    $scope.BREAK_RULES_LIST = [];
    $scope.SHIFT_MASTER_LIST = [];


    //Shift Tab 
    $scope.SHIFT_BRANCH_LIST = [];
    $scope.SHIFT_POSITIONS_LIST = [];
    $scope.SHIFT_DEPARTMENTS_LIST = [];
    $scope.SHIFT_EMPLOYEES_LIST = [];
    $scope.ADD_SHIFT_DEPARTMENTS_LIST = [];
    $scope.ADD_SHIFT_POSITIONS_LIST = [];
    $scope.ADD_SHIFT_BRANCH_LIST = [];
    $scope.ADD_SHIFT_EMPLOYEES_LIST = [];


    $scope.SCHEDULE_TAB_CLICK_Fn = function (FLAG) {
        $scope.TAB_ID = FLAG;
        $scope.GET_CUSTOMER_SETTINGS($scope.ScheduleSearch, '82,51,52,55,56,53,54');
        if (FLAG == 2) {
            $scope.ADMIN_GET_BRANCH_LIST();
            $scope.HRM_GET_DEPARTMENTS();
            $scope.HRM_GET_POSITIONS();
            $scope.HRM_GET_EMPLOYTEE_LIST_BY_EMPLY_PRSNL_ID();
            $scope.HRM_GET_SHIFT_MASTER(1);
        }
    }
    //shift 
    $scope.HRM_GET_SHIFT_MASTER_BY_ID = function (_param_shift) {
        var PunchClockObject = new Object();
        PunchClockObject.SHIFT_MASTER_ID = _param_shift.SHIFT_MASTER_ID;
        PrcCommMethods.HUMANRESOURCE_API(PunchClockObject, 'HRM_GET_SHIFT_MASTER_BY_ID').then(function (data) {
            if (data.data.Table.length > 0) {
                let _Shift = data.data.Table[0];
                $scope.ShiftSearch.SHIFT_MASTER_ID = _Shift.SHIFT_MASTER_ID;
                $scope.ShiftSearch.SHIFT_NAME = _Shift.SHIFT_NAME;
                $scope.ShiftSearch.START_TIME = _Shift.START_TIME;
                $scope.ShiftSearch.END_TIME = _Shift.END_TIME;
                $scope.ShiftSearch.SHIFT_COUNT = _Shift.SHIFT_COUNT;
                $scope.ShiftSearch.BREAK_HOURS = _Shift.BREAK_HOURS;
                $scope.ShiftSearch.IS_BREAK_RULE_APPLIED = _Shift.IS_BREAK_RULE_APPLIED;
                $scope.ShiftSearch.BREAK_TYPE_ID = _Shift.BREAK_TYPE_ID;
                if ($scope.ShiftSearch.BREAK_TYPE_ID != '') {
                    let foundObject = $scope.BREAK_LIST.find(x => x.BREAK_RULE_TYPE_ID == $scope.ShiftSearch.BREAK_TYPE_ID);
                    if (foundObject != undefined) {
                        $scope.SELECTED_SHIFT_BREAK_Fn(foundObject);
                    }
                }
                $scope.ShiftSearch.NOTE = _Shift.NOTE;
                $scope.ShiftSearch.IS_SPECIAL_WAGE = _Shift.IS_SPECIAL_WAGE;
                $scope.ShiftSearch.WAGE = _Shift.WAGE;
                $scope.ShiftSearch.WAGE_TYPE_ID = _Shift.WAGE_TYPE_ID;
                if ($scope.ShiftSearch.WAGE_TYPE_ID != '') {
                    let foundObject = $scope.WAGES_LIST.find(x => x.WAGE_TYPE_ID == $scope.ShiftSearch.WAGE_TYPE_ID);
                    if (foundObject != undefined) {
                        $scope.SELECTED_WAGE_Fn(foundObject);
                    }
                }
            }
            if (data.data.Table1.length > 0) {

            };
            if (data.data.Table2.length > 0) {
                angular.forEach(data.data.Table2, function (item) {
                    let foundObject = $scope.SHIFT_BRANCH_LIST.find(x => x.BRANCH_ID == item.BRANCH_ID);
                    if (foundObject != undefined) {
                        $scope.ADD_SHIFT_BRANCH_LIST.push(foundObject);
                    }
                });
            };
            if (data.data.Table3.length > 0) {
                angular.forEach(data.data.Table3, function (item) {
                    let foundObject = $scope.SHIFT_DEPARTMENTS_LIST.find(x => x.DEPARTMENT_ID == item.DEPARTMENT_ID);
                    if (foundObject != undefined) {
                        $scope.ADD_SHIFT_DEPARTMENTS_LIST.push(foundObject);
                    }
                });
            };
            if (data.data.Table4.length > 0) {
                angular.forEach(data.data.Table4, function (item) {
                    let foundObject = $scope.SHIFT_POSITIONS_LIST.find(x => x.POSITION_ID == item.POSITION_ID);
                    if (foundObject != undefined) {
                        $scope.ADD_SHIFT_POSITIONS_LIST.push(foundObject);
                    }
                });
            };
            if (data.data.Table5.length > 0) {
                angular.forEach(data.data.Table5, function (item) {
                    let foundObject = $scope.SHIFT_EMPLOYEES_LIST.find(x => x.EMPLY_PRSNL_ID == item.EMPLY_PRSNL_ID);
                    if (foundObject != undefined) {
                        $scope.ADD_SHIFT_EMPLOYEES_LIST.push(foundObject);
                    }
                });
            };
        });
    }
    //shift tab
    $scope.LAZY_LOAD_SHIFT_MASTER_Fn = function () {
        $scope.HRM_GET_SHIFT_MASTER();
    }

    ///Sift Tab
    $scope.HRM_GET_SHIFT_MASTER = function (FLAG) {
        $scope.$parent.overlay_loadingNew = 'block';
        if (FLAG == 1) {
            $scope.LOAD_SHIFT_FETCH_TEXT = 'fetching record...';
            $scope.ShiftSearch.PAGE_NO = 1;
            $scope.SHIFT_MASTER_LIST = [];
        }
        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_ID = $scope.ShiftSearch.CUSTOMER_ID;
        CusModelObj.ENTITY_ID = $scope.ShiftSearch.ENTITY_ID;
        CusModelObj.PAGE_NO = $scope.ShiftSearch.PAGE_NO;
        CusModelObj.PAGE_SIZE = $scope.ShiftSearch.PAGE_SIZE;
        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_GET_SHIFT_MASTER').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.$parent.overlay_loadingNew = 'none';
                $scope.SHIFT_MASTER_LIST = $scope.SHIFT_MASTER_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.ShiftSearch.PAGE_SIZE) {
                    $scope.ShiftGetData = false;
                }
                else {
                    $scope.ShiftSearch.PAGE_NO = parseInt($scope.ShiftSearch.PAGE_NO) + 1;
                    $scope.ShiftGetData = true;
                }
            }
            else {
                if ($scope.SHIFT_MASTER_LIST.length == 0) {
                    $scope.LOAD_SHIFT_FETCH_TEXT = 'No record yet';
                }
                $scope.ShiftGetData = false;
                $scope.$parent.overlay_loadingNew = 'none';
            }
        });
    }

    $scope.ADMIN_GET_BRANCH_LIST = function () {
        var PunchClockObject = new Object();
        PunchClockObject.CUSTOMER_ID = $scope.ShiftSearch.CUSTOMER_ID;
        PrcCommMethods.HUMANRESOURCE_API(PunchClockObject, 'ADMIN_GET_BRANCH_LIST').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.SHIFT_BRANCH_LIST = data.data.Table;
            }
            else {
                $scope.SHIFT_BRANCH_LIST = [];
            }
            //   $scope.GET_CUSTOMER_SETTINGS($scope.ShiftSearch, '57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73');
        });

    };
    $scope.HRM_GET_DEPARTMENTS = function () {
        var AbsenceObject = new Object();
        AbsenceObject.CUSTOMER_ID = $scope.ShiftSearch.CUSTOMER_ID;
        AbsenceObject.ENTITY_ID = $scope.ShiftSearch.ENTITY_ID;
        AbsenceObject.PAGE_NO = $scope.ShiftSearch.PAGE_NO;
        AbsenceObject.PAGE_SIZE = $scope.ShiftSearch.PAGE_SIZE;
        PrcCommMethods.HUMANRESOURCE_API(AbsenceObject, 'HRM_GET_DEPARTMENTS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.SHIFT_DEPARTMENTS_LIST = data.data.Table;
            } else {
                $scope.SHIFT_DEPARTMENTS_LIST = [];
            }

        });
    };
    $scope.HRM_GET_POSITIONS = function () {
        var AbsenceObject = new Object();
        AbsenceObject.CUSTOMER_ID = $scope.ShiftSearch.CUSTOMER_ID;
        AbsenceObject.ENTITY_ID = $scope.ShiftSearch.ENTITY_ID;
        AbsenceObject.PAGE_NO = $scope.ShiftSearch.PAGE_NO;
        AbsenceObject.PAGE_SIZE = $scope.ShiftSearch.PAGE_SIZE;
        PrcCommMethods.HUMANRESOURCE_API(AbsenceObject, 'HRM_GET_POSITIONS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.SHIFT_POSITIONS_LIST = data.data.Table;
            } else {
                $scope.SHIFT_POSITIONS_LIST = [];
            }
        });
    };
    $scope.HRM_GET_EMPLOYTEE_LIST_BY_EMPLY_PRSNL_ID = function () {
        var UserModelObj = new Object();
        UserModelObj.EMPLY_PRSNL_ID = $scope.ShiftSearch.LOGIN_EMPLOYEE_ID;
        UserModelObj.CUSTOMER_ID = $scope.ShiftSearch.CUSTOMER_ID;
        UserModelObj.ENTITY_ID = $scope.ShiftSearch.ENTITY_ID;
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'HRM_GET_EMPLOYTEE_LIST_BY_EMPLY_PRSNL_ID').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.SHIFT_EMPLOYEES_LIST = data.data.Table;
            }
            else if (data.data == null) {
                $scope.SHIFT_EMPLOYEES_LIST = [];
            }
        });
    };


    $scope.LAZY_LOAD_GET_BREAK_RULES = function () {
        $scope.HRM_GET_BREAK_RULES();
    }
    $scope.HRM_GET_BREAK_RULES = function (FLAG) {
        $scope.$parent.overlay_loadingNew = 'block';
        if (FLAG == 1) {
            $scope.LOAD_FETCH_TEXT = 'fetching record...';
            $scope.ScheduleSearch.PAGE_NO = 1;
            $scope.BREAK_RULES_LIST = [];
        }
        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_ID = $scope.ScheduleSearch.CUSTOMER_ID;
        CusModelObj.ENTITY_ID = $scope.ScheduleSearch.ENTITY_ID;
        CusModelObj.PAGE_NO = $scope.ScheduleSearch.PAGE_NO;
        CusModelObj.PAGE_SIZE = $scope.ScheduleSearch.PAGE_SIZE;
        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_GET_BREAK_RULES').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.$parent.overlay_loadingNew = 'none';
                $scope.BREAK_RULES_LIST = $scope.BREAK_RULES_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.ScheduleSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.ScheduleSearch.PAGE_NO = parseInt($scope.ScheduleSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else {
                if ($scope.BREAK_RULES_LIST.length == 0) { $scope.LOAD_FETCH_TEXT = 'no record yet'; }
                $scope.GetData = false;
                $scope.$parent.overlay_loadingNew = 'none';
            }
        });
    }
    $scope.HRM_INS_UPD_BREAK_RULES = function () {
        $scope.BREAK_TYPES_FORM.submitted = true;
        if ($scope.BREAK_TYPES_FORM.$valid) {
            var CusModelObj = new Object();
            CusModelObj.BREAK_RULE_ID = $scope.ScheduleSearch.BREAK_RULE_ID;
            CusModelObj.BREAK_RULE_NAME = $scope.ScheduleSearch.BREAK_RULE_NAME;
            CusModelObj.BREAK_RULE_TYPE_ID = $scope.ScheduleSearch.BREAK_RULE_TYPE_ID;
            CusModelObj.BREAK_DURATION = $scope.ScheduleSearch.BREAK_DURATION;
            CusModelObj.SHIFT_DURATION = $scope.ScheduleSearch.SHIFT_DURATION;
            CusModelObj.CUSTOMER_ID = $scope.ScheduleSearch.CUSTOMER_ID;
            CusModelObj.ENTITY_ID = $scope.ScheduleSearch.ENTITY_ID;
            CusModelObj.ACTIVE = 1;
            CusModelObj.USER_ID = $scope.ScheduleSearch.USER_ID;
            PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_INS_UPD_BREAK_RULES').then(function (data) {
                if (data.data > 0) {
                    if ($scope.ScheduleSearch.BREAK_RULE_ID == 0) {
                        $scope.$parent.ShowAlertBox("Success", 'Break rule added successfully', 3000);
                    }
                    else if ($scope.ScheduleSearch.BREAK_RULE_ID > 0) {
                        $scope.$parent.ShowAlertBox("Success", 'Break rule updated successfully', 3000);
                    }
                    $scope.HRM_GET_BREAK_RULES(1);
                    $scope.RESET_Fn();
                }
                else if (data.data < 0) {
                    $scope.$parent.ShowAlertBox("Attention", 'Already Added', 3000);
                }
                if (data.data == 0) {
                    $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                }
            });
        }
    }
    $scope.SCHEDULE_TAB_CLICK_Fn(3);

    $scope.DELETE_BREAK_RULE_Fn = function (_break_rule) {
        if (confirm('Are you sure you want to proceed?')) {
            var CusModelObj = new Object();
            CusModelObj.BREAK_RULE_ID = _break_rule.BREAK_RULE_ID;
            CusModelObj.BREAK_RULE_NAME = _break_rule.BREAK_RULE_NAME;
            CusModelObj.BREAK_RULE_TYPE_ID = _break_rule.BREAK_RULE_TYPE_ID;
            CusModelObj.BREAK_DURATION = _break_rule.BREAK_DURATION;
            CusModelObj.SHIFT_DURATION = _break_rule.SHIFT_DURATION;
            CusModelObj.CUSTOMER_ID = $scope.ScheduleSearch.CUSTOMER_ID;
            CusModelObj.ENTITY_ID = $scope.ScheduleSearch.ENTITY_ID;
            CusModelObj.ACTIVE = 0;
            CusModelObj.USER_ID = $scope.ScheduleSearch.USER_ID;
            PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_INS_UPD_BREAK_RULES').then(function (data) {
                if (data.data > 0) {
                    $scope.$parent.ShowAlertBox("Success", 'Break rule Deleted successfully', 3000);
                    $scope.HRM_GET_BREAK_RULES(1);
                }
                else if (data.data == 0) {
                    $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                }
            });
        }

    }
    $scope.UPDATE_BREAK_RULE_Fn = function (_break_rule) {
        $scope.ScheduleSearch.BREAK_RULE_ID = _break_rule.BREAK_RULE_ID;
        $scope.ScheduleSearch.BREAK_RULE_NAME = _break_rule.BREAK_RULE_NAME;
        $scope.ScheduleSearch.CUSTOM_BREAK_NAME = $scope.BREAK_LIST[_break_rule.BREAK_RULE_TYPE_ID - 1].BREAK_NAME;
        $scope.ScheduleSearch.BREAK_RULE_TYPE_ID = _break_rule.BREAK_RULE_TYPE_ID;
        $scope.ScheduleSearch.BREAK_DURATION = _break_rule.BREAK_DURATION;
        $scope.ScheduleSearch.SHIFT_DURATION = _break_rule.SHIFT_DURATION;
    }
    $scope.INS_UPD_CUSTOMER_SETTINGS = function (SETTING_VALUE, SETTING_MASTER_ID) {
        var validcount = 0;
        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_ID = $scope.ScheduleSearch.CUSTOMER_ID;
        CusModelObj.USER_ID = $scope.ScheduleSearch.USER_ID;
        CusModelObj.CUSTOMER_SETTINGS_TYPE = [];

        if (SETTING_VALUE > 53 && SETTING_MASTER_ID == 52) {
            validcount = 1;
            $scope.$parent.ShowAlertBox("Error", 'Please add valid week number', 3000);
        }
        if (validcount == 0) {
            var readonly = new Object()
            if (SETTING_MASTER_ID == 52) {
                readonly.SETTING_VALUE = $scope.ScheduleSearch.LIMIT_SCHEDULING_OVER;
            }
            else {
                readonly.SETTING_VALUE = SETTING_VALUE ? 1 : 0;
            }
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
                    $scope.$parent.MASTER_GET_CUSTOMER_SETTINGS('46,47,52', true, "NO_REDIRECTION");
                    $scope.$parent.ShowAlertBox("Success", 'Update successfully', 3000);
                }
                if (data.data == 0) {
                    $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                }
            });
        }
    }
    $scope.INS_UPD_CUSTOMER_SETTINGS_MULTIPLE = function () {
        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_ID = $scope.ScheduleSearch.CUSTOMER_ID;
        CusModelObj.USER_ID = $scope.ScheduleSearch.USER_ID;
        CusModelObj.CUSTOMER_SETTINGS_TYPE = [];
        CusModelObj.BRANCH_TYPE = [];
        CusModelObj.POSITIONS_TYPE = [];
        CusModelObj.DEPARTMENTS_TYPE = [];
        CusModelObj.EMPLOYEES_TYPE = [];

        var readonly = new Object()
        readonly.SETTING_VALUE = $scope.ScheduleSearch.SHOW_AS_WARNING ? 1 : 0;
        readonly.SETTING_MASTER_ID = 51; //child
        CusModelObj.CUSTOMER_SETTINGS_TYPE.push(readonly);

        var readonly = new Object()
        readonly.SETTING_VALUE = $scope.ScheduleSearch.ENSURE_ADEQUATE ? $scope.ScheduleSearch.VALUE_IN_HOURS : 0;
        readonly.SETTING_MASTER_ID = 82; //parent
        CusModelObj.CUSTOMER_SETTINGS_TYPE.push(readonly);

        let resultobject = $scope.$parent.BLANK_SETTING_OBJECT();
        CusModelObj.BRANCH_TYPE.push(resultobject);
        CusModelObj.POSITIONS_TYPE.push(resultobject);
        CusModelObj.DEPARTMENTS_TYPE.push(resultobject);
        CusModelObj.EMPLOYEES_TYPE.push(resultobject);

        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'INS_UPD_CUSTOMER_SETTINGS').then(function (data) {
            if (data.data > 0) {
                $scope.$parent.ShowAlertBox("Success", 'Update successfully', 3000);
            }
            if (data.data == 0) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
        });
    }

    $scope.RETUN_BLANK_OBJ = function (blankObj) {
        blankObj.TABLE_ID = 0;
        blankObj.RELATIVE_ID = null;
        blankObj.INCLUDE_FLAG = null;
        blankObj.DELETE_FLAG = null;
        blankObj.SETTING_MASTER_ID = null;

        return blankObj;
    }


    $scope.BREAK_RULE_CHECKED_Fn = function () {

    }

    ///Shift Tab//
    $scope.HRM_INS_UPD_SHIFT_MASTER = function () {
        $scope.SHIFT_FORM.submitted = true;
        if ($scope.SHIFT_FORM.$valid) {
            var ShiftObj = new Object();
            ShiftObj.SHIFT_MASTER_ID = $scope.ShiftSearch.SHIFT_MASTER_ID;
            ShiftObj.SHIFT_NAME = $scope.ShiftSearch.SHIFT_NAME;
            ShiftObj.START_TIME = $scope.ShiftSearch.START_TIME;
            ShiftObj.END_TIME = $scope.ShiftSearch.END_TIME;
            ShiftObj.SHIFT_COUNT = $scope.ShiftSearch.SHIFT_COUNT;
            ShiftObj.BREAK_HOURS = $scope.ShiftSearch.BREAK_HOURS;
            ShiftObj.IS_BREAK_RULE_APPLIED = $scope.ShiftSearch.IS_BREAK_RULE_APPLIED;
            ShiftObj.BREAK_TYPE_ID = $scope.ShiftSearch.BREAK_TYPE_ID;
            ShiftObj.NOTE = $scope.ShiftSearch.NOTE;
            ShiftObj.IS_SPECIAL_WAGE = $scope.ShiftSearch.IS_SPECIAL_WAGE;
            ShiftObj.WAGE = $scope.ShiftSearch.WAGE;
            ShiftObj.WAGE_TYPE_ID = $scope.ShiftSearch.WAGE_TYPE_ID;
            ShiftObj.ACTIVE = 1;
            ShiftObj.USER_ID = $scope.ShiftSearch.USER_ID;
            ShiftObj.CUSTOMER_ID = $scope.ShiftSearch.CUSTOMER_ID;
            ShiftObj.ENTITY_ID = $scope.ShiftSearch.ENTITY_ID;
            ShiftObj.BRANCH_TYPE = [];
            ShiftObj.DEPARTMENTS_TYPE = [];
            ShiftObj.POSITIONS_TYPE = [];
            ShiftObj.EMPLOYEES_TYPE = [];
            ShiftObj.BREAK_RULES_TYPE = [];

            if ($scope.ADD_SHIFT_BRANCH_LIST.length > 0) {
                angular.forEach($scope.ADD_SHIFT_BRANCH_LIST, function (_loop_value) {
                    var readonly = new Object();
                    readonly.TABLE_ID = _loop_value.BRANCH_ID;
                    //readonly.RELATIVE_ID = _loop_value.BRANCH_ID;
                    //readonly.INCLUDE_FLAG = 0;
                    //readonly.DELETE_FLAG = 1;
                    //readonly.SETTING_MASTER_ID = _loop_value.SETTING_MASTER_ID;
                    ShiftObj.BRANCH_TYPE.push(readonly);
                });
            }
            if ($scope.ADD_SHIFT_DEPARTMENTS_LIST.length > 0) {
                angular.forEach($scope.ADD_SHIFT_DEPARTMENTS_LIST, function (_loop_value) {
                    var readonly = new Object();
                    readonly.TABLE_ID = _loop_value.DEPARTMENT_ID;
                    //readonly.RELATIVE_ID = _loop_value.DEPARTMENT_ID;
                    //readonly.INCLUDE_FLAG = 0;
                    //readonly.DELETE_FLAG = 1;
                    //readonly.SETTING_MASTER_ID = _loop_value.SETTING_MASTER_ID;
                    ShiftObj.DEPARTMENTS_TYPE.push(readonly);
                });
            }
            if ($scope.ADD_SHIFT_POSITIONS_LIST.length > 0) {
                angular.forEach($scope.ADD_SHIFT_POSITIONS_LIST, function (_loop_value) {
                    var readonly = new Object();
                    readonly.TABLE_ID = _loop_value.POSITION_ID;
                    //readonly.RELATIVE_ID = _loop_value.POSITION_ID;
                    //readonly.INCLUDE_FLAG = 0;
                    //readonly.DELETE_FLAG = 1;
                    //readonly.SETTING_MASTER_ID = _loop_value.SETTING_MASTER_ID;
                    ShiftObj.POSITIONS_TYPE.push(readonly);
                });
            }
            if ($scope.ADD_SHIFT_EMPLOYEES_LIST.length > 0) {
                angular.forEach($scope.ADD_SHIFT_EMPLOYEES_LIST, function (_loop_value) {
                    var readonly = new Object();
                    readonly.TABLE_ID = _loop_value.EMPLY_PRSNL_ID;
                    //readonly.RELATIVE_ID = _loop_value.EMPLY_PRSNL_ID;
                    //readonly.INCLUDE_FLAG = 0;
                    //readonly.DELETE_FLAG = 1;
                    //readonly.SETTING_MASTER_ID = _loop_value.SETTING_MASTER_ID;
                    ShiftObj.EMPLOYEES_TYPE.push(readonly);
                });
            }

            if (ShiftObj.BRANCH_TYPE.length == 0) {
                var branchObj = new Object()
                branchObj.TABLE_ID = 0;
                ShiftObj.BRANCH_TYPE.push(branchObj);

            }
            if (ShiftObj.DEPARTMENTS_TYPE.length == 0) {
                var DepartmentObj = new Object()
                DepartmentObj.TABLE_ID = 0;
                ShiftObj.DEPARTMENTS_TYPE.push(DepartmentObj);
            }
            if (ShiftObj.POSITIONS_TYPE.length == 0) {
                var positionObj = new Object()
                positionObj.TABLE_ID = 0;
                ShiftObj.POSITIONS_TYPE.push(positionObj);

            }
            if (ShiftObj.EMPLOYEES_TYPE.length == 0) {
                var EmployeeObj = new Object()
                EmployeeObj.TABLE_ID = 0;
                ShiftObj.EMPLOYEES_TYPE.push(EmployeeObj);
            }


            if (ShiftObj.BREAK_RULES_TYPE.length == 0) {
                var BreakObj = new Object()
                BreakObj.TABLE_ID = 0;
                ShiftObj.BREAK_RULES_TYPE.push(BreakObj);
            }


            PrcCommMethods.HUMANRESOURCE_API(ShiftObj, 'HRM_INS_UPD_SHIFT_MASTER').then(function (data) {
                if (data.data > 0) {
                    if ($scope.ShiftSearch.SHIFT_MASTER_ID == 0) {
                        $scope.$parent.ShowAlertBox("Success", 'Shift template save successfully', 3000);
                    }
                    else if ($scope.ShiftSearch.SHIFT_MASTER_ID > 0) {
                        $scope.$parent.ShowAlertBox("Success", 'Shift template updated successfully', 3000);
                    }
                    $scope.HRM_GET_SHIFT_MASTER(1);
                    $scope.RESET_SHIFT_Fn();
                }
                else if (data.data < 0) {
                    $scope.$parent.ShowAlertBox("Attention", 'Already Added', 3000);
                }
                if (data.data == 0) {
                    $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                }
            });
        }
    }

    $('input.timepicker_START_TIME').timepicker({
        change: function (time) {
            const currentDate = new Date();
            const selectedTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), time.getHours(), time.getMinutes());

            $scope.ShiftSearch.START_TIME = new Date(selectedTime);
        }
    });
    $('input.timepicker_END_TIME').timepicker({
        change: function (time) {
            const currentDate = new Date();
            const selectedTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), time.getHours(), time.getMinutes());
            $scope.ShiftSearch.END_TIME = selectedTime;
        }
    });
    $scope.LAZY_LOAD_SHIFT_MASTER_Fn();

    /// Start of Shift tab department site,position and emplyee add and remove
    $scope.ADD_SHIFT_BRANCH_Fn = function (_branch) {
        $scope.ShiftSearch.BranchSearch = '';
        $scope.ADD_SHIFT_BRANCH_LIST.push(angular.copy(_branch));
        $scope.SHIFT_BRANCH_LIST = $scope.SHIFT_BRANCH_LIST.filter(function (branch) {
            return branch !== _branch;
        });
    };
    $scope.REMOVE_SHIFT_BRANCH_Fn = function (_branch) {
        $scope.SHIFT_BRANCH_LIST.push(angular.copy(_branch));
        $scope.ADD_SHIFT_BRANCH_LIST = $scope.ADD_SHIFT_BRANCH_LIST.filter(function (branch) {
            return branch !== _branch;
        });
    };

    $scope.ADD_SHIFT_DEPARTMENTS_Fn = function (_department) {
        $scope.ShiftSearch.DepartmentSearch = '';
        $scope.ADD_SHIFT_DEPARTMENTS_LIST.push(angular.copy(_department));
        $scope.SHIFT_DEPARTMENTS_LIST = $scope.SHIFT_DEPARTMENTS_LIST.filter(function (department) {
            return department !== _department;
        });
    };

    $scope.REMOVE_SHIFT_DEPARTMENTS_Fn = function (_department) {
        $scope.SHIFT_DEPARTMENTS_LIST.push(angular.copy(_department));
        $scope.ADD_SHIFT_DEPARTMENTS_LIST = $scope.ADD_SHIFT_DEPARTMENTS_LIST.filter(function (department) {
            return department !== _department;
        });
    };
    $scope.ADD_SHIFT_POSITIONS_Fn = function (_position) {
        $scope.ShiftSearch.PositionSearch = '';
        $scope.ADD_SHIFT_POSITIONS_LIST.push(angular.copy(_position));
        $scope.SHIFT_POSITIONS_LIST = $scope.SHIFT_POSITIONS_LIST.filter(function (position) {
            return position !== _position;
        });
    };

    $scope.REMOVE_SHIFT_POSITIONS_Fn = function (_postition) {
        $scope.SHIFT_POSITIONS_LIST.push(angular.copy(_postition));
        $scope.ADD_SHIFT_POSITIONS_LIST = $scope.ADD_SHIFT_POSITIONS_LIST.filter(function (position) {
            return position !== _postition;
        });
    };

    $scope.ADD_SHIFT_EMPLOYEE_Fn = function (_employee) {
        $scope.ShiftSearch.EmployeeSearch = '';
        $scope.ADD_SHIFT_EMPLOYEES_LIST.push(angular.copy(_employee));
        $scope.SHIFT_EMPLOYEES_LIST = $scope.SHIFT_EMPLOYEES_LIST.filter(function (Employee) {
            return Employee !== _employee;
        });
    };

    $scope.REMOVE_SHIFT_EMPLOYEE_Fn = function (_employee) {
        $scope.SHIFT_EMPLOYEES_LIST.push(angular.copy(_employee));
        $scope.ADD_SHIFT_EMPLOYEES_LIST = $scope.ADD_SHIFT_EMPLOYEES_LIST.filter(function (Employee) {
            return Employee !== _employee;
        });
    };

    /// End of Shift tab department site,position and emplyee add and remove




    //General//
    $scope.SELECTED_BREAK_Fn = function (_param_break) {
        if (_param_break == '') {
            $scope.ScheduleSearch.CUSTOM_BREAK_NAME = $scope.ScheduleSearch.DD_DEFAULT_TEXT;
            $scope.ScheduleSearch.BREAK_RULE_TYPE_ID = "";
        }
        else {
            $scope.ScheduleSearch.CUSTOM_BREAK_NAME = _param_break.BREAK_NAME;
            $scope.ScheduleSearch.BREAK_RULE_TYPE_ID = _param_break.BREAK_RULE_TYPE_ID;
        }
    }
    //Shift Tab
    $scope.SELECTED_SHIFT_BREAK_Fn = function (_param_break) {
        if (_param_break == '') {
            $scope.ShiftSearch.CUSTOM_SHIFT_BREAK_NAME = $scope.ShiftSearch.DD_DEFAULT_TEXT;
            $scope.ScheduleSearch.BREAK_TYPE_ID = "";
        }
        else {
            $scope.ShiftSearch.CUSTOM_SHIFT_BREAK_NAME = _param_break.BREAK_NAME;
            $scope.ShiftSearch.BREAK_TYPE_ID = _param_break.BREAK_RULE_TYPE_ID;
        }
    }


   

    //Shift Tab
    $scope.SELECTED_WAGE_Fn = function (_param_wage) {
        if (_param_wage == '') {
            $scope.ShiftSearch.CUSTOM_WAGE_NAME = $scope.ShiftSearch.DD_DEFAULT_TEXT;
            $scope.ScheduleSearch.WAGE_TYPE_ID = "";
        }
        else {
            $scope.ShiftSearch.CUSTOM_WAGE_NAME = _param_wage.WAGE_NAME;
            $scope.ShiftSearch.WAGE_TYPE_ID = _param_wage.WAGE_TYPE_ID;
        }
    }
    $scope.SELECTED_WAGE_Fn('');
    $scope.SELECTED_SHIFT_BREAK_Fn('');
    $scope.HRM_GET_BREAK_RULES(1);
});