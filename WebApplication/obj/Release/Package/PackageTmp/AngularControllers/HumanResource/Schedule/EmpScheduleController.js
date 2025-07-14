//function dragMe() {
app.directive('dragMe', [function () {
    var DDO = {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.prop('draggable', true);
            element.on('dragstart', function (event) {
                event.dataTransfer.setData('text', event.target.id)
            });
        }
    };
    return DDO;
}]);
app.filter('sumOf', function () {
    return function (data, key) {
        if (angular.isUndefined(data) || angular.isUndefined(key))
            return 0;
        var sum = 0;
        angular.forEach(data, function (value) {
            sum = sum + parseFloat(value[key]);
        });
        return sum;
    };
});

//dropOnMe.$inject = [];
//function dropOnMe() {
app.directive('dropOnMe', [function () {
    var DDO = {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.on('dragover', function (event) {
                event.preventDefault();
            });
            element.on('drop', function (event) {
                event.preventDefault();
                var data = event.dataTransfer.getData("text");
                event.target.appendChild(document.getElementById(data));
            });
        }
    };
    return DDO;
}]);

app.controller('EmpSchedulerController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $localStorage, $timeout) {
    $scope.HEADER_LABEL_SHIFT = 'Add';
    $scope.EXCEPTION_VIEW = false;
    //$scope.$parent.DISPLAY_FLAG = false;
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(2);
    $scope.HR_COMMON_CODE_Fn();
    $scope.$parent.$parent.overlay_loading_HR_Loader = 'none';

    $scope.START_DAY_OF_WEEK = $scope.$parent.MASTER_GET_CUSTOMER_SETTINGS_VALUES(47);
    if ($scope.START_DAY_OF_WEEK == -9999) {
        $scope.START_DAY_OF_WEEK = 1;
    }
    $scope.addDays = function (date, days) { date.setDate(date.getDate() + days); return date; }

    // Time Format 1 for 12 Hours & 2 for 24 Hours
    $scope.TIME_FORMAT = $scope.$parent.MASTER_GET_CUSTOMER_SETTINGS_VALUES(46);


    $scope.CURRENT_DATE = '';
    $scope.GET_UTC_TIME = function () {
        var UserModelObj = new Object();
        UserModelObj.TIMEZONE_OFFSET = "0:0";
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'GET_UTC_TIME').then(function (data) {
            if (data.data != null) {
                $scope.CURRENT_DATE = new Date(data.data);
            }
            if ($scope.CURRENT_DATE == '') {
                $scope.CURRENT_DATE = new Date();
            }
        })
    };
    $scope.GET_UTC_TIME();
    $scope.MasterData = {
        CUSTOMER_ID: $cookies.get("CUSTOMER_ID"),
        ENTITY_ID: parseInt($cookies.get("ENTITY_ID")),
        MODULE_ID: $cookies.get("MODULE_ID"),
        USER_ID: $cookies.get("USERID"),
        EMPLY_PRSNL_ID: $cookies.get("EMPLY_PRSNL_ID") == undefined || $cookies.get("EMPLY_PRSNL_ID") == null ? 0 : $cookies.get("EMPLY_PRSNL_ID"),
        PAGE_NO: 1,
        PAGE_SIZE: 10
    };
    $scope.SHOW_TOTALS = false;
    $scope.HIDE_COST_HOURS = true;
    $scope.HIDE_COST = true;
    $scope.SHOW_APPROVALS = false;
    $scope.ShiftEmpSearch = {
        CUSTOMER_ID: $cookies.get("CUSTOMER_ID"),
        ENTITY_ID: parseInt($cookies.get("ENTITY_ID")),
        MODULE_ID: $cookies.get("MODULE_ID"),
        USER_ID: $cookies.get("USERID"),
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        CUSTOM_BREAK_NAME: $scope.$parent.DD_DEFAULT_TEXT,
        CUSTOM_VIEW_NAME: '',
        FREQUENCY_NAME: '',
        YEAR: '',
        DD_DEFAULT_TEXT: $scope.$parent.DD_DEFAULT_TEXT,
        IS_BREAK_RULE_APPLIED: false,
        IS_SPECIAL_WAGE: false,
        CUSTOM_BRANCH_NAME: $scope.$parent.DD_DEFAULT_TEXT,
        CHRLENGTH: 500

    };
    $scope.AddShiftSearch = {
        CUSTOMER_ID: $cookies.get("CUSTOMER_ID"),
        ENTITY_ID: parseInt($cookies.get("ENTITY_ID")),
        MODULE_ID: $cookies.get("MODULE_ID"),
        USER_ID: $cookies.get("USERID"),
        EMPLY_PRSNL_ID: $cookies.get("EMPLY_PRSNL_ID"),
        LOGIN_EMPLOYEE_ID: $cookies.get("EMPLY_PRSNL_ID") == 0 ? null : $cookies.get("EMPLY_PRSNL_ID"),
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        DD_DEFAULT_TEXT: $scope.$parent.DD_DEFAULT_TEXT,
        CUSTOM_BRANCH_NAME: $scope.$parent.DD_DEFAULT_TEXT,
        CUSTOM_EMPLOYEE_NAME: $scope.$parent.DD_DEFAULT_TEXT,
        CUSTOM_DEPARTMENT_NAME: $scope.$parent.DD_DEFAULT_TEXT,
        CUSTOM_POSITION_NAME: $scope.$parent.DD_DEFAULT_TEXT,
        CUSTOM_SHIFT_NAME: $scope.$parent.DD_DEFAULT_TEXT,
        CUSTOM_SECTION_NAME: $scope.$parent.DD_DEFAULT_TEXT,
        CUSTOM_WAGE_NAME: $scope.$parent.DD_DEFAULT_TEXT,
        CUSTOM_CLOCK_NAME: $scope.$parent.DD_DEFAULT_TEXT,
        SET_DEFAULT: false,
        SECTION: '',
        SHIFT_COUNT: '',
        SCHEDULED_START: '',
        SCHEDULED_END: '',
        SCHEDULED_PAID_BREAK: '',
        SCHEDULED_UNPAID_BREAK: '',
        BUSINESS_DATE: '',
        SCHDL_SHIFT_ID: 0,
        BRANCH_ID: '',
        EMPLY_BRANCH_ID: '',
        WAGE_TYPE_ID: '',
        WAGE_COST: '',
        WAGE: '',
        CLOCK_ID: '',
        STATUS_ID: 91,
    };
    $scope.ShiftEmpSearch.GROUP_BY_VIEW_ID = 1;
    $scope.ShiftEmpSearch.SHIFT_STATUS_VIEW_ID = 0;
    ///--- Ensure adequate rest time between shifts ID -> 82 SETTING_NAME -> Ensure adequate rest time between shifts
    //ID -> 51 SETTING_NAME -> Show as warning:: Enforce the rule SETTING_VALUE -> 0 WARNING 1 ENFORCE PARENT_ID -> 82 
    // 1 PAID 2 UNPAID
    //

    $scope.FORECAST_TYPE = [{ ID: 1, COLUMN_NAME: 'FORECAST_DATE', MATCH_COLUMN_NAME: 'DATE', IS_MANDATORY: true, HEADER_NAME: 'DATE', FIELD_TYPE_ID: 9, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },
    { ID: 2, COLUMN_NAME: 'FORECAST_VALUE', MATCH_COLUMN_NAME: 'AMOUNT', IS_MANDATORY: true, HEADER_NAME: 'AMOUNT', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true }];

    $scope.BREAK_LIST = [
        { "BREAK_RULE_TYPE_ID": "1", "BREAK_NAME": "Paid" },
        { "BREAK_RULE_TYPE_ID": "2", "BREAK_NAME": "Unpaid" }];

    $scope.VIEW_LIST = [
        { "VIEW_ID": 1, "VIEW_NAME": "Day View" },
        { "VIEW_ID": 2, "VIEW_NAME": "Week View" }];

    $scope.WAGES_LIST = [
        { "WAGE_TYPE_ID": "1", "WAGE_NAME": "HOURLY" },
        { "WAGE_TYPE_ID": "2", "WAGE_NAME": "FIXED COST" },
        { "WAGE_TYPE_ID": "3", "WAGE_NAME": "MULTIPLIER" }
    ];

    $scope.GROUP_BY_LIST = [
        { "GROUP_ID": "1", "GROUP_NAME": "Person" },
        { "GROUP_ID": "2", "GROUP_NAME": "Department" },
        { "GROUP_ID": "3", "GROUP_NAME": "Position" },
        { "GROUP_ID": "4", "GROUP_NAME": "Department then Section" }
    ];
    $scope.SHIFTS_STATUS_LIST = [
        { "STATUS_ID": "0", "STATUS_NAME": "All" },
        { "STATUS_ID": "92", "STATUS_NAME": "Published" },
        { "STATUS_ID": "91", "STATUS_NAME": "Unpublished" },
        { "STATUS_ID": "93", "STATUS_NAME": "Approved" }
    ];

    $scope.RESET_SHIFT_Fn = function () {
        $scope.SHIFT_FORM.submitted = false;
        $scope.ShiftEmpSearch.CUSTOM_SHIFT_BREAK_NAME = $scope.ShiftEmpSearch.DD_DEFAULT_TEXT;
        $scope.ShiftEmpSearch.CUSTOM_WAGE_NAME = $scope.ShiftEmpSearch.DD_DEFAULT_TEXT;
        $scope.ShiftEmpSearch.SHIFT_MASTER_ID = 0;
        $scope.ShiftEmpSearch.SHIFT_NAME = "";
        $scope.ShiftEmpSearch.START_TIME = "";
        $scope.ShiftEmpSearch.END_TIME = "";
        $scope.ShiftEmpSearch.SHIFT_COUNT = "";
        $scope.ShiftEmpSearch.SCHEDULED_PAID_BREAK = "";
        $scope.ShiftEmpSearch.SCHEDULED_UNPAID_BREAK = "";
        $scope.ShiftEmpSearch.SCHEDULED_DURATION = "";
        $scope.ShiftEmpSearch.SHIFT_DURATION = "";
        $scope.ShiftEmpSearch.IS_SPECIAL_WAGE = false;
        $scope.ShiftEmpSearch.CUSTOM_WAGE_NAME = "";
        $scope.ShiftEmpSearch.WAGE_TYPE_ID = "";
        $scope.ShiftEmpSearch.WAGE = "";
        $scope.ShiftEmpSearch.NOTE = "";
    }


    $scope.BREAK_RULES_LIST = [];
    $scope.SHIFT_MASTER_LIST = [];
    $scope.BRANCH_EMP_LIST = [];

    //Shift Tab 
    // $scope.SHIFT_BRANCH_LIST = [];
    // $scope.SHIFT_POSITIONS_LIST = [];
    // $scope.SHIFT_DEPARTMENTS_LIST = [];
    $scope.SHIFT_EMPLOYEES_LIST = [];
    //$scope.ADD_SHIFT_DEPARTMENTS_LIST = [];
    // $scope.ADD_SHIFT_POSITIONS_LIST = [];
    $scope.ADD_SHIFT_BRANCH_LIST = [];
    $scope.ADD_SHIFT_EMPLOYEES_LIST = [];


    $scope.COUNTLENGTH = function (val, str) {
        if (val <= 500) {
            $scope.ShiftEmpSearch.CHRLENGTH = val;
        } else {
            $scope.ShiftEmpSearch.NOTE = str.substring(0, str.length - 1);
            alert("You have reached the maximum number of characters.");
        }
    }

    //$scope.schedulefilter = function () {
    //    return function (_employeeShift) {
    //        if (_employeeShift.GROUP_BY_ID != 0 && _employeeShift.SECONDARY_GROUP_BY_ID == 0) {

    //            return _employeeShift;
    //        }
    //        else if (_employeeShift.GROUP_BY_ID == -1 && _employeeShift.SECONDARY_GROUP_BY_ID != 0) {
    //            return _employeeShift;
    //        }
    //        else if (_employeeShift.EMPLOYEE_NAME.toLowerCase().indexOf($scope.SEARCH_EMPLOYEE) != -1) {
    //            return _employeeShift;
    //        }
    //    }

    //}


    //$scope.GET_CUSTOMER_SETTINGS = function (_param_retun_value, _param_tableids) {
    //    var punchClockObject = new Object();
    //    punchClockObject.CUSTOMER_ID = $scope.MasterData.CUSTOMER_ID;
    //    punchClockObject.MODULE_ID = $scope.MasterData.MODULE_ID;
    //    punchClockObject.TABLE_ID_LIST = [];

    //    angular.forEach(_param_tableids.split(','), function (_loop_value) {
    //        var readonly = new Object();
    //        readonly.TABLE_ID = _loop_value;
    //        punchClockObject.TABLE_ID_LIST.push(readonly);
    //    });
    //    PrcCommMethods.HUMANRESOURCE_API(punchClockObject, 'GET_CUSTOMER_SETTINGS').then(function (data) {
    //        if (data.data.Table.length > 0) {
    //            angular.forEach(data.data.Table, function (_loop_value) {
    //                if (_loop_value.SETTING_MASTER_ID == 66) { //66 Track when employee clocks in early by
    //                    $scope.MasterData.TRACK_EMPLOYEE_EARLY = parseFloat(_loop_value.SETTING_VALUE);
    //                }
    //                else if (_loop_value.SETTING_MASTER_ID == 67) {  //67 Track when employee clocks out late by
    //                    $scope.MasterData.TRACK_EMPLOYEE_LATE = parseFloat(_loop_value.SETTING_VALUE);
    //                }
    //                else if (_loop_value.SETTING_MASTER_ID == 68) {  //68 Threshold for Variance Between Clock-in Clock-out and Scheduled Hours
    //                    $scope.MasterData.THRESHOLD_FOR_VARIANCE = parseFloat(_loop_value.SETTING_VALUE);
    //                }
    //            });
    //        }
    //        else if (data.data == 0) {
    //            $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
    //        }
    //    });
    //};

    //$scope.GET_CUSTOMER_SETTINGS($scope.PunchClockGeneralSearch, '66,67,68');
    $scope.VIEW_TABULAR_Fn = function () {
        $('#VIEW_T').modal('show');
    }
    $scope.FILTER_EMPLOYEE_SHIFTS_LIST = function () {
        $scope.selected_employee_count = 0;
        $scope.EMPLOYEE_SHIFTS_LIST = [];
        $scope.EMPLOYEE_SHIFTS_LIST = angular.copy($filter('filter')($scope.EMPLOYEE_SHIFTS_LIST_TO_FILTER, function (_employeeShift) {
            if ($scope.SEARCH_EMPLOYEE == undefined || $scope.SEARCH_EMPLOYEE == "") {
                return true;
            }
            else {

                if (_employeeShift.GROUP_BY_ID != 0 && _employeeShift.SECONDARY_GROUP_BY_ID == 0) {

                    return true;
                }
                else if (_employeeShift.GROUP_BY_ID == -1 && _employeeShift.SECONDARY_GROUP_BY_ID != 0) {
                    return true;
                }
                else if (_employeeShift.EMPLOYEE_NAME.toLowerCase().indexOf($scope.SEARCH_EMPLOYEE.toLowerCase()) == -1) {
                    return false;
                }
                else {
                    return true;
                }
            }

        }));
    };
    $scope.EXCEPTION_VIEW = false;
    $scope.HRM_GET_SCHDLS = function () {
        $scope.selected_employee_count = 0;
        if ($scope.START_DATE != undefined && $scope.END_DATE != undefined) {
            var CusModelObj = new Object();
            CusModelObj.ENTITY_ID = $scope.MasterData.ENTITY_ID;
            CusModelObj.USER_ID = $scope.MasterData.USER_ID;
            // CusModelObj.BRANCH_ID = $scope.ShiftEmpSearch.BRANCH_ID;
            CusModelObj.TBL_BRANCH_IDS = $scope.ShiftEmpSearch.BRANCH_IDs;
            $scope.HIDE_COST = $scope.SCHEDULE_BRANCH_LIST.find(x => x.BRANCH_ID == $scope.ShiftEmpSearch.BRANCH_ID).SHOW_WAGE;
            $scope.SHOW_HIDE_COST = $scope.ShiftEmpSearch.BRANCH_ID > 0 && $scope.HIDE_COST ? true : $scope.SCHEDULE_BRANCH_LIST.filter(function (x) { return x.SHOW_WAGE == false }).length > 0 ? false : true;
            $scope.SHOW_BULK_APPROVAL = $scope.SCHEDULE_BRANCH_LIST.find(x => x.BRANCH_ID == $scope.ShiftEmpSearch.BRANCH_ID).TIME_SHEETS;
            $scope.SHOW_APPROVALS = $scope.SCHEDULE_BRANCH_LIST.filter(function (x) { return x.TIME_SHEETS == false }).length > 0 ? false : true;
            CusModelObj.SCHEDULED_START = $scope.$parent.HRM_CHANGE_TIME_ZONE_Fn(new Date($scope.START_DATE));
            CusModelObj.SCHEDULED_END = $scope.$parent.HRM_CHANGE_TIME_ZONE_Fn(new Date($scope.ShiftEmpSearch.VIEW_ID == 1 ? $scope.START_DATE : $scope.END_DATE));
            $scope.EXCEPTION_VIEW = getUrlParameter('e', $location.absUrl()) == 1 ? true : $scope.EXCEPTION_VIEW;
            CusModelObj.SCHEDULE_GROUP_BY_ID = $scope.EXCEPTION_VIEW ? 5 : ($scope.ShiftEmpSearch.GROUP_BY_VIEW_ID || 1);
            CusModelObj.VIEW_TYPE_ID = $scope.ShiftEmpSearch.VIEW_ID;
            CusModelObj.SCHEDULE_STATUS_ID = $scope.ShiftEmpSearch.SHIFT_STATUS_VIEW_ID;
            CusModelObj.CUSTOMER_ID = $scope.MasterData.CUSTOMER_ID;
            CusModelObj.EMPLY_PRSNL_ID = $scope.MasterData.EMPLY_PRSNL_ID;
            CusModelObj.SETTING_54 = $scope.$parent.MASTER_GET_CUSTOMER_SETTINGS_VALUES(54);
            CusModelObj.SETTING_66 = $scope.$parent.MASTER_GET_CUSTOMER_SETTINGS_VALUES(66);
            CusModelObj.SETTING_67 = $scope.$parent.MASTER_GET_CUSTOMER_SETTINGS_VALUES(67);
            CusModelObj.SETTING_68 = $scope.$parent.MASTER_GET_CUSTOMER_SETTINGS_VALUES(68);
            CusModelObj.CURRENT_DATE = moment();
            CusModelObj.IS_SCHEDULE_EXCEL = false;
            if ($scope.ShiftEmpSearch.VIEW_ID == 1) {
                $scope.START_DATE = $filter('date')($scope.START_DATE);
            }

            PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_GET_SCHDLS').then(function (data) {
                if (data.data != null) {
                    $scope.EMPLOYEE_SHIFTS_LIST = data.data.datalist;
                    //$scope.RowCount = 1;

                    $scope.EXCEPTION_COUNT = data.data.EXCEPTION_COUNT;
                    //   $scope.EMPLOYEE_SHIFTS_FOOTER = data.data.Footer;
                    $scope.EMPLOYEE_SHIFTS_LIST_TO_FILTER = angular.copy(data.data.datalist);
                    $scope.EMPLOYEE_SHIFTS_DATES = [];
                    for (var i = 0; i < data.data.list_dates.length; i++) {
                        var datobj = new Object();
                        datobj.DATE = data.data.list_dates[i];
                        datobj.DATE_FOR_TOTALS = data.data.list_dates[i].replace('Z', '');
                        datobj.IS_SELECTED = false;
                        $scope.EMPLOYEE_SHIFTS_DATES.push(datobj);
                    }
                    $scope.totals = data.data.totals;
                    $scope.BRANCH_TOTALS = data.data._Branch_totals;
                    $scope.FOOTER_DATA = data.data.FooterData;
                    $scope.FILTER_EMPLOYEE_SHIFTS_LIST();
                    if ($scope.ShiftEmpSearch.BRANCH_ID > 0) {
                        $scope.HRM_SCHDL_GET_SHIFT_EMPLY_LIST($scope.ShiftEmpSearch.BRANCH_ID);
                    }
                    //$timeout(function () {
                    //    $scope.RowCount = 5;
                    //}, 5);
                    //$timeout(function () {
                    //    $scope.RowCount = 10;
                    //}, 10);
                    //$timeout(function () {
                    //    $scope.RowCount = $scope.EMPLOYEE_SHIFTS_LIST.length;
                    //}, 15);
                    $scope.HRM_SCHDL_GET_WAGE_FORCAST();
                }
            });
        }
    };
    $scope.HRM_GET_SCHDLS_FOR_EXCEL = function () {


        if ($scope.START_DATE != undefined && $scope.END_DATE != undefined) {
            var CusModelObj = new Object();
            CusModelObj.ENTITY_ID = $scope.MasterData.ENTITY_ID;
            CusModelObj.USER_ID = $scope.MasterData.USER_ID;
            CusModelObj.BRANCH_ID = $scope.ShiftEmpSearch.BRANCH_ID;
            $scope.HIDE_COST = $scope.SCHEDULE_BRANCH_LIST.find(x => x.BRANCH_ID == $scope.ShiftEmpSearch.BRANCH_ID).SHOW_WAGE;
            CusModelObj.SCHEDULED_START = $scope.$parent.HRM_CHANGE_TIME_ZONE_Fn(new Date($scope.START_DATE));
            CusModelObj.SCHEDULED_END = $scope.$parent.HRM_CHANGE_TIME_ZONE_Fn(new Date($scope.ShiftEmpSearch.VIEW_ID == 1 ? $scope.START_DATE : $scope.END_DATE));
            $scope.EXCEPTION_VIEW = getUrlParameter('e', $location.absUrl()) == 1 ? true : $scope.EXCEPTION_VIEW;
            CusModelObj.SCHEDULE_GROUP_BY_ID = $scope.EXCEPTION_VIEW ? 5 : ($scope.ShiftEmpSearch.GROUP_BY_VIEW_ID || 1);
            CusModelObj.VIEW_TYPE_ID = $scope.ShiftEmpSearch.VIEW_ID;
            CusModelObj.SCHEDULE_STATUS_ID = $scope.ShiftEmpSearch.SHIFT_STATUS_VIEW_ID;
            CusModelObj.CUSTOMER_ID = $scope.MasterData.CUSTOMER_ID;
            CusModelObj.EMPLY_PRSNL_ID = $scope.MasterData.EMPLY_PRSNL_ID;
            CusModelObj.SETTING_54 = $scope.$parent.MASTER_GET_CUSTOMER_SETTINGS_VALUES(54);
            CusModelObj.SETTING_66 = $scope.$parent.MASTER_GET_CUSTOMER_SETTINGS_VALUES(66);
            CusModelObj.SETTING_67 = $scope.$parent.MASTER_GET_CUSTOMER_SETTINGS_VALUES(67);
            CusModelObj.SETTING_68 = $scope.$parent.MASTER_GET_CUSTOMER_SETTINGS_VALUES(68);
            CusModelObj.IS_SCHEDULE_EXCEL = true;
            CusModelObj.CURRENT_DATE = moment();
            if ($scope.ShiftEmpSearch.VIEW_ID == 1) {
                $scope.START_DATE = $filter('date')($scope.START_DATE);
            }

            PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_GET_SCHDLS').then(function (data) {
                if (data.data != null) {
                    //$scope.EMPLOYEE_SHIFTS_LIST_FOR_EXCEL = data.data.datalist; 
                    $scope.CONVERT_TO_EXCEL_CSV(data.data.datalist);
                }
            });
        }
    };

    $scope.HRM_SCHDL_GET_SHIFT_EMPLY_LIST = function (branch_id, employee_id) {
        var CusModelObj = new Object();
        //CusModelObj.BRANCH_ID = branch_id;
        //if ($scope.ShiftEmpSearch.BRANCH_ID == 0) {

        //}
        //else {

        //}
        //$scope.SCHEDULE_BRANCH_LIST.map(a => a.branch_id)
        CusModelObj.TABLE_ID_LIST = $scope.ShiftEmpSearch.BRANCH_IDs;
        CusModelObj.SETTING_54 = $scope.$parent.MASTER_GET_CUSTOMER_SETTINGS_VALUES(54);
        CusModelObj.CUSTOMER_ID = $scope.MasterData.CUSTOMER_ID;
        CusModelObj.EMPLY_PRSNL_ID = $scope.MasterData.EMPLY_PRSNL_ID;
        CusModelObj.SCHEDULED_START = $scope.$parent.HRM_CHANGE_TIME_ZONE_Fn(new Date($scope.START_DATE));
        CusModelObj.SCHEDULED_END = $scope.$parent.HRM_CHANGE_TIME_ZONE_Fn(new Date($scope.ShiftEmpSearch.VIEW_ID == 1 ? $scope.START_DATE : $scope.END_DATE));
        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_SCHDL_GET_SHIFT_EMPLY_LIST').then(function (data) {
            if (data.data != null && data.data.Table.length > 0) {
                $scope.EMPLOYEE_LIST = data.data.Table;
                if (employee_id) {
                    let empIndex = $scope.EMPLOYEE_LIST.findIndex(x => x.EMPLY_PRSNL_ID == employee_id);
                    if (empIndex >= 0) {
                        $scope.EMPLOYEE_LIST[empIndex].IS_EMPLOYEE_SELECTED = true;
                    }
                }
            } else {
                $scope.EMPLOYEE_LIST = [];
            }
        });
    };

    $scope.INS_UPD_USER_FILTERS_Fn = function () {
        var USER_FILTER = [];
        //7	 Branch //8	Group By  //9	Shift Status //10	Shift View 
        var readOnly = new Object();
        readOnly.VALUE = $scope.ShiftEmpSearch.BRANCH_ID;
        readOnly.FILTERS_ID = 7;
        USER_FILTER.push(readOnly);

        //2	Group By
        var readOnly = new Object();
        readOnly.VALUE = $scope.ShiftEmpSearch.GROUP_BY_VIEW_ID;
        readOnly.FILTERS_ID = 8;
        USER_FILTER.push(readOnly);

        //3	Shift Status
        var readOnly = new Object();
        readOnly.VALUE = $scope.ShiftEmpSearch.SHIFT_STATUS_VIEW_ID;
        readOnly.FILTERS_ID = 9;
        USER_FILTER.push(readOnly);

        //4	Shift Week/Day View
        var readOnly = new Object();
        readOnly.VALUE = $scope.ShiftEmpSearch.VIEW_ID;
        readOnly.FILTERS_ID = 10;
        USER_FILTER.push(readOnly);
        $scope.USER_FILTERS_LIST = [];
        $scope.$parent.INS_UPD_USER_FILTERS(2, USER_FILTER, true);
        $(".dropdown-menu").removeClass("show");
    }
    $scope.ShiftEmpSearch.SELECTED_BRANCHES = [];
    $scope.SELECTED_SCHEDULE_BRANCH_Fn = function (branch, is_first_time) {
        if (branch == undefined || branch == '') {
            $scope.ShiftEmpSearch.CUSTOM_BRANCH_NAME = $scope.ShiftEmpSearch.DD_DEFAULT_TEXT;
            $scope.ShiftEmpSearch.BRANCH_ID = '';
        } else {
            $scope.ShiftEmpSearch.SELECTED_BRANCHES = [];
            $scope.ShiftEmpSearch.CUSTOM_BRANCH_NAME = branch.BRANCH_NAME;
            $scope.ShiftEmpSearch.BRANCH_ID = branch.BRANCH_ID;
            $scope.ShiftEmpSearch.BRANCH_IDs = [];
            if (branch.BRANCH_ID == 0) {
                angular.forEach($scope.SCHEDULE_BRANCH_LIST, function (item) {
                    if (item.BRANCH_ID != 0) {
                        var _branch = new Object();
                        _branch.TABLE_ID = item.BRANCH_ID;
                        $scope.ShiftEmpSearch.BRANCH_IDs.push(_branch);
                        $scope.ShiftEmpSearch.SELECTED_BRANCHES.push(item);
                    }
                });
            }
            else {
                var _branch = new Object();
                _branch.TABLE_ID = branch.BRANCH_ID;
                $scope.ShiftEmpSearch.BRANCH_IDs.push(_branch);
                $scope.ShiftEmpSearch.SELECTED_BRANCHES.push(branch);
            }
            //  = branch.BRANCH_ID;
            // for shift
            //       $scope.AddShiftSearch.SHIFT_BRANCH_ID = $scope.ShiftEmpSearch.BRANCH_ID;
            //       $scope.AddShiftSearch.EMPLY_BRANCH_ID = $scope.ShiftEmpSearch.BRANCH_ID;
            //       $scope.AddShiftSearch.CUSTOM_BRANCH_NAME = $scope.ShiftEmpSearch.CUSTOM_BRANCH_NAME;
            $scope.HRM_SCHDL_GET_SHIFT_EMPLY_LIST(branch.BRANCH_ID);
            //       $scope.DEPARTMENTS_LIST = $scope.ALL_DEPARTMENTS_LIST.filter(x => x.BRANCH_ID == $scope.ShiftEmpSearch.BRANCH_ID);
            //       $scope.POSITIONS_LIST = $scope.ALL_POSITIONS_LIST.filter(x => x.BRANCH_ID == $scope.ShiftEmpSearch.BRANCH_ID);
            if (!is_first_time) {
                $scope.HRM_GET_SCHDLS();

            }
        }
    };
    // calling branch api
    // $scope.HRM_SCHDL_GET_SHIFT_BRANCH_LIST();

    $scope.CLICK_GROUP_BY_VIEW_Fn = function (_pram_group, is_first_time) {
        $scope.ShiftEmpSearch.GROUP_BY_VIEW_DISPALY_TEXT = _pram_group.GROUP_NAME;
        $scope.ShiftEmpSearch.GROUP_BY_VIEW_ID = _pram_group.GROUP_ID;
        if (!is_first_time) {
            $scope.HRM_GET_SCHDLS();
        }
    }

    $scope.CLICK_SHIFT_STATUS_VIEW_Fn = function (_pram_status, is_first_time) {
        $scope.ShiftEmpSearch.SHIFT_STATUS_VIEW_DISPALY_TEXT = _pram_status.STATUS_NAME;
        $scope.ShiftEmpSearch.SHIFT_STATUS_VIEW_ID = _pram_status.STATUS_ID;
        if (!is_first_time) {
            $scope.HRM_GET_SCHDLS();
        }
    }

    $scope.SELECTED_VIEW_Fn = function (_param_break, is_first_time) {
        $scope.ShiftEmpSearch.CUSTOM_VIEW_NAME = _param_break.VIEW_NAME;
        $scope.ShiftEmpSearch.VIEW_ID = _param_break.VIEW_ID;

        if ($scope.ShiftEmpSearch.VIEW_ID == 1) {
            $scope.START_DATE = $filter('date')($scope.CURRENT_DATE);
            $scope.$parent.$parent.DateInputLoad('', 1);
        }

        if ($scope.ShiftEmpSearch.VIEW_ID == 2) {

        }
        if (!is_first_time) {
            $scope.HRM_GET_SCHDLS();
        }
    };

    //$scope.CLICK_GROUP_BY_VIEW_Fn($scope.GROUP_BY_LIST[0], true);
    //$scope.CLICK_SHIFT_STATUS_VIEW_Fn($scope.SHIFTS_STATUS_LIST[0], true);
    //$scope.SELECTED_VIEW_Fn($scope.VIEW_LIST[1]);


    $scope.HRM_GET_SCHEDULING_ACCESS = function () {
        if ($scope.SCHEDULE_BRANCH_LIST == undefined || $scope.DEPARTMENTS_LIST == undefined || $scope.POSITIONS_LIST == undefined) {
            var SCHEDULING_ACCESSObj = new Object();
            SCHEDULING_ACCESSObj.CUSTOMER_ID = $scope.MasterData.CUSTOMER_ID;
            SCHEDULING_ACCESSObj.ENTITY_ID = $scope.MasterData.ENTITY_ID;
            SCHEDULING_ACCESSObj.EMPLY_PRSNL_ID = $scope.MasterData.EMPLY_PRSNL_ID;
            PrcCommMethods.HUMANRESOURCE_API(SCHEDULING_ACCESSObj, 'HRM_GET_SCHEDULING_ACCESS').then(function (data) {
                if (data.data != null) {
                    //$localStorage.SHDL_ACESSS_BRANCH_LIST = JSON.stringify(data.data.Table);
                    //$localStorage.SHDL_ACESSS_DEPARTMENT_LIST = JSON.stringify(data.data.Table1);
                    //$localStorage.SHDL_ACESSS_POSITION_LIST = JSON.stringify(data.data.Table2);
                    $scope.SCHEDULE_BRANCH_LIST = [{
                        BRANCH_ID: 0,
                        BRANCH_NAME: "All Branches",
                        IS_PRIME: -1,
                        PRIME_BRANCH_ID: 0,
                        SHOW_WAGE: true,
                        TIME_SHEETS: true
                    }];
                    $scope.SCHEDULE_BRANCH_LIST = $scope.SCHEDULE_BRANCH_LIST.concat(data.data.Table);// JSON.parse($localStorage.SHDL_ACESSS_BRANCH_LIST);              
                    $scope.ADD_SHIFT_BRANCH_LIST = data.data.Table;
                    $scope.ALL_DEPARTMENTS_LIST = data.data.Table1;
                    $scope.ALL_POSITIONS_LIST = data.data.Table2;
                    $scope.$parent.$parent.GET_USER_FILTERS(24, true);

                    //$scope.DEPARTMENTS_LIST = data.data.Table1.filter(x => x.BRANCH_ID == $scope.ShiftEmpSearch.BRANCH_ID);
                    //$scope.POSITIONS_LIST = data.data.Table2.filter(x => x.BRANCH_ID == $scope.ShiftEmpSearch.BRANCH_ID);
                    // alert($scope.ShiftEmpSearch.BRANCH_ID);
                }
            });
        }
        else {
            $scope.HRM_GET_SCHDLS();

        }
    };
    $scope.HRM_SCHDL_GET_WAGE_FORCAST = function () {
        var FORECASTOBJ = new Object();
        FORECASTOBJ.ENTITY_ID = $scope.MasterData.ENTITY_ID;
        //FORECASTOBJ.BRANCH_ID = $scope.AddShiftSearch.SHIFT_BRANCH_ID;
        FORECASTOBJ.TBL_BRANCH_IDS = $scope.ShiftEmpSearch.BRANCH_IDs;
        FORECASTOBJ.START_DATE = $scope.$parent.HRM_CHANGE_TIME_ZONE_Fn(new Date($scope.START_DATE));
        FORECASTOBJ.END_DATE = $scope.$parent.HRM_CHANGE_TIME_ZONE_Fn(new Date($scope.ShiftEmpSearch.VIEW_ID == 1 ? $scope.START_DATE : $scope.END_DATE));
        PrcCommMethods.HUMANRESOURCE_API(FORECASTOBJ, "HRM_SCHDL_GET_WAGE_FORCAST").then(function (data) {
            $scope.SALES_BY_BRANCH_LIST = data.data.Table3;
            if (data.data.Table != undefined && data.data.Table.length > 0) {
                $scope.WAGE_FORECAST_LIST = [];
                $scope.GUEST_FORECAST_LIST = [];
                $scope.SALES_FORECAST_LIST = [];
                angular.forEach($scope.ShiftEmpSearch.SELECTED_BRANCHES, function (brnch) {
                    if (brnch.BRANCH_ID != 0) {
                        //FORECAST_VALUE: $scope.SALES_FORECAST_LIST.filter(x => x.BRANCH_ID == brnch.BRANCH_ID && x.SCHEDULE_DATE == dats.DATE_FOR_TOTALS)[0].SALES_FORCAST_VALUE == '' || $scope.SALES_FORECAST_LIST.filter(x => x.BRANCH_ID == brnch.BRANCH_ID && x.SCHEDULE_DATE == dats.DATE_FOR_TOTALS)[0].SALES_FORCAST_VALUE == null ? '0' : ($scope.SALES_FORECAST_LIST.filter(x => x.BRANCH_ID == brnch.BRANCH_ID && x.SCHEDULE_DATE == dats.DATE_FOR_TOTALS)[0].SALES_FORCAST_VALUE + '')
                        angular.forEach($scope.EMPLOYEE_SHIFTS_DATES, function (dats) {


                            var WAGE = data.data.Table.filter(function (x) { return x.BRANCH_ID == brnch.BRANCH_ID && x.SCHEDULE_DATE == dats.DATE_FOR_TOTALS });
                            var GUEST = data.data.Table1.filter(function (x) { return x.BRANCH_ID == brnch.BRANCH_ID && x.SCHEDULE_DATE == dats.DATE_FOR_TOTALS });
                            var SALES = data.data.Table2.filter(function (x) { return x.BRANCH_ID == brnch.BRANCH_ID && x.SCHEDULE_DATE == dats.DATE_FOR_TOTALS });
                            if (SALES.length > 0) {
                                $scope.SALES_FORECAST_LIST.push(SALES[0]);
                            }
                            else {
                                $scope.SALES_FORECAST_LIST.push({ SALES_FORCAST_VALUE: 0, BRANCH_ID: brnch.BRANCH_ID, SCHEDULE_DATE: dats.DATE_FOR_TOTALS });
                            }
                            if (WAGE.length > 0) {
                                $scope.WAGE_FORECAST_LIST.push(WAGE[0]);
                            }
                            else {
                                $scope.WAGE_FORECAST_LIST.push({ WAGE_FORECAST_VALUE: 0, BRANCH_ID: brnch.BRANCH_ID, SCHEDULE_DATE: dats.DATE_FOR_TOTALS });
                            }
                            if (GUEST.length > 0) {
                                $scope.GUEST_FORECAST_LIST.push(GUEST[0]);
                            }
                            else {
                                $scope.GUEST_FORECAST_LIST.push({ GUEST_FORECAST_VALUE: 0, BRANCH_ID: brnch.BRANCH_ID, SCHEDULE_DATE: dats.DATE_FOR_TOTALS });
                            }
                        });
                    }
                });

            }
            else {
                $scope.SALES_FORECAST_LIST = [];
                $scope.WAGE_FORECAST_LIST = [];
                $scope.GUEST_FORECAST_LIST = [];
                angular.forEach($scope.ShiftEmpSearch.SELECTED_BRANCHES, function (brnch) {
                    if (brnch.BRANCH_ID != 0) {
                        angular.forEach($scope.EMPLOYEE_SHIFTS_DATES, function (dats) {
                            $scope.SALES_FORECAST_LIST.push({ SALES_FORCAST_VALUE: 0, BRANCH_ID: brnch.BRANCH_ID, SCHEDULE_DATE: dats.DATE_FOR_TOTALS });// = [{ SALES_FORCAST_VALUE: 0 }, { SALES_FORCAST_VALUE: 0 }, { SALES_FORCAST_VALUE: 0 }, { SALES_FORCAST_VALUE: 0 }, { SALES_FORCAST_VALUE: 0 }, { SALES_FORCAST_VALUE: 0 }, { SALES_FORCAST_VALUE: 0 }];
                            $scope.WAGE_FORECAST_LIST.push({ WAGE_FORECAST_VALUE: 0, BRANCH_ID: brnch.BRANCH_ID, SCHEDULE_DATE: dats.DATE_FOR_TOTALS });//  = [{ WAGE_FORECAST_VALUE: 0 }, { WAGE_FORECAST_VALUE: 0 }, { WAGE_FORECAST_VALUE: 0 }, { WAGE_FORECAST_VALUE: 0 }, { WAGE_FORECAST_VALUE: 0 }, { WAGE_FORECAST_VALUE: 0 }, { WAGE_FORECAST_VALUE: 0 }];
                            $scope.GUEST_FORECAST_LIST.push({ GUEST_FORECAST_VALUE: 0, BRANCH_ID: brnch.BRANCH_ID, SCHEDULE_DATE: dats.DATE_FOR_TOTALS });//  = [{ GUEST_FORECAST_VALUE: 0 }, { GUEST_FORECAST_VALUE: 0 }, { GUEST_FORECAST_VALUE: 0 }, { GUEST_FORECAST_VALUE: 0 }, { GUEST_FORECAST_VALUE: 0 }, { GUEST_FORECAST_VALUE: 0 }, { GUEST_FORECAST_VALUE: 0 }];
                        });
                    }
                });
            }
            $scope.TotalActualSales = {};
            angular.forEach($scope.SALES_BY_BRANCH_LIST, function (item) {
                if (!$scope.TotalActualSales[item.CASHUP_DATE]) {
                    $scope.TotalActualSales[item.CASHUP_DATE] = {
                        data: [],
                        totalValue: 0
                    };
                }
                $scope.TotalActualSales[item.CASHUP_DATE].data.push(item);
                $scope.TotalActualSales[item.CASHUP_DATE].totalValue += item.ACTUAL_NET_REVENUE;
            });
        });
    };
    $scope.HRM_SCHDL_INS_UPD_WAGE_FORCAST = function () {
        var FORECASTOBJ = new Object();
        FORECASTOBJ.ENTITY_ID = $scope.MasterData.ENTITY_ID;
        FORECASTOBJ.BRANCH_ID = $scope.AddShiftSearch.SHIFT_BRANCH_ID;
        FORECASTOBJ.START_DATE = $scope.$parent.HRM_CHANGE_TIME_ZONE_Fn(new Date($scope.START_DATE));
        FORECASTOBJ.END_DATE = $scope.$parent.HRM_CHANGE_TIME_ZONE_Fn(new Date($scope.ShiftEmpSearch.VIEW_ID == 1 ? $scope.START_DATE : $scope.END_DATE));
        FORECASTOBJ.USER_ID = $scope.MasterData.USER_ID;
        FORECASTOBJ.WAGE_FORECAST = [];
        FORECASTOBJ.GUEST_FORECAST = [];
        FORECASTOBJ.SALES_FORCAST = [];
        FORECASTOBJ.SALES_ACTUAL = [];
        angular.forEach($scope.ShiftEmpSearch.SELECTED_BRANCHES, function (brnch) {
            if (brnch.BRANCH_ID != 0) {
                angular.forEach($scope.EMPLOYEE_SHIFTS_DATES, function (dats) {
                    FORECASTOBJ.WAGE_FORECAST.push({
                        BRANCH_ID: brnch.BRANCH_ID,
                        FORECAST_DATE: dats.DATE,
                        FORECAST_VALUE: $scope.WAGE_FORECAST_LIST.filter(x => x.BRANCH_ID == brnch.BRANCH_ID && x.SCHEDULE_DATE == dats.DATE_FOR_TOTALS)[0].WAGE_FORECAST_VALUE == '' || $scope.WAGE_FORECAST_LIST.filter(x => x.BRANCH_ID == brnch.BRANCH_ID && x.SCHEDULE_DATE == dats.DATE_FOR_TOTALS)[0].WAGE_FORECAST_VALUE == null ? '0' : ($scope.WAGE_FORECAST_LIST.filter(x => x.BRANCH_ID == brnch.BRANCH_ID && x.SCHEDULE_DATE == dats.DATE_FOR_TOTALS)[0].WAGE_FORECAST_VALUE + '')
                    });
                    FORECASTOBJ.GUEST_FORECAST.push({
                        BRANCH_ID: brnch.BRANCH_ID,
                        FORECAST_DATE: dats.DATE,
                        FORECAST_VALUE: $scope.GUEST_FORECAST_LIST.filter(x => x.BRANCH_ID == brnch.BRANCH_ID && x.SCHEDULE_DATE == dats.DATE_FOR_TOTALS)[0].GUEST_FORECAST_VALUE == '' || $scope.GUEST_FORECAST_LIST.filter(x => x.BRANCH_ID == brnch.BRANCH_ID && x.SCHEDULE_DATE == dats.DATE_FOR_TOTALS)[0].GUEST_FORECAST_VALUE == null ? '0' : ($scope.GUEST_FORECAST_LIST.filter(x => x.BRANCH_ID == brnch.BRANCH_ID && x.SCHEDULE_DATE == dats.DATE_FOR_TOTALS)[0].GUEST_FORECAST_VALUE + '')
                    });
                    FORECASTOBJ.SALES_FORCAST.push({
                        BRANCH_ID: brnch.BRANCH_ID,
                        FORECAST_DATE: dats.DATE,
                        FORECAST_VALUE: $scope.SALES_FORECAST_LIST.filter(x => x.BRANCH_ID == brnch.BRANCH_ID && x.SCHEDULE_DATE == dats.DATE_FOR_TOTALS)[0].SALES_FORCAST_VALUE == '' || $scope.SALES_FORECAST_LIST.filter(x => x.BRANCH_ID == brnch.BRANCH_ID && x.SCHEDULE_DATE == dats.DATE_FOR_TOTALS)[0].SALES_FORCAST_VALUE == null ? '0' : ($scope.SALES_FORECAST_LIST.filter(x => x.BRANCH_ID == brnch.BRANCH_ID && x.SCHEDULE_DATE == dats.DATE_FOR_TOTALS)[0].SALES_FORCAST_VALUE + '')
                    });
                    if (!$scope.SALES_BY_BRANCH_LIST.filter(x => x.BRANCH_ID == brnch.BRANCH_ID && x.CASHUP_DATE == dats.DATE_FOR_TOTALS)[0].IS_EPOS_SALES) {
                        BRANCH_ID: brnch.BRANCH_ID,
                            FORECASTOBJ.SALES_ACTUAL.push({
                                BRANCH_ID: brnch.BRANCH_ID,
                                FORECAST_DATE: dats.DATE,
                                FORECAST_VALUE: $scope.SALES_BY_BRANCH_LIST.filter(x => x.BRANCH_ID == brnch.BRANCH_ID && x.CASHUP_DATE == dats.DATE_FOR_TOTALS)[0].ACTUAL_NET_REVENUE == '' || $scope.SALES_BY_BRANCH_LIST.filter(x => x.BRANCH_ID == brnch.BRANCH_ID && x.CASHUP_DATE == dats.DATE_FOR_TOTALS)[0].ACTUAL_NET_REVENUE == null ? '0' : $scope.SALES_BY_BRANCH_LIST.filter(x => x.BRANCH_ID == brnch.BRANCH_ID && x.CASHUP_DATE == dats.DATE_FOR_TOTALS)[0].ACTUAL_NET_REVENUE + ''
                            });
                    }
                });
            }
        });
        if (FORECASTOBJ.WAGE_FORECAST.length == 0) {
            FORECASTOBJ.WAGE_FORECAST = [{
                BRANCH_ID: null,
                FORECAST_DATE: null,
                FORECAST_VALUE: null
            }];
        }
        if (FORECASTOBJ.GUEST_FORECAST.length == 0) {
            FORECASTOBJ.GUEST_FORECAST = [{
                BRANCH_ID: null,
                FORECAST_DATE: null,
                FORECAST_VALUE: null
            }];
        }
        if (FORECASTOBJ.SALES_FORCAST.length == 0) {
            FORECASTOBJ.SALES_FORCAST = [{
                BRANCH_ID: null,
                FORECAST_DATE: null,
                FORECAST_VALUE: null
            }];
        }
        if (FORECASTOBJ.SALES_ACTUAL.length == 0) {
            FORECASTOBJ.SALES_ACTUAL = [{
                BRANCH_ID: null,
                FORECAST_DATE: null,
                FORECAST_VALUE: null
            }];
        }
        PrcCommMethods.HUMANRESOURCE_API(FORECASTOBJ, "HRM_SCHDL_INS_UPD_WAGE_FORCAST").then(function (data) {
            $scope.$parent.ShowAlertBox("Success", "Record saved successfully.", 3000);
        });
    };



    $scope.REMOVE_UPLOAD_Fn = function (item, index) {
        var HRMModelObj = new Object();
        HRMModelObj.ID = item.UPLOAD_ID;
        PrcCommMethods.CASHUP_API(HRMModelObj, 'DELETE_UPLOAD').then(function (data) {
            angular.element("input[id=HR_uploadExcel1]").val(null);
            $scope.$parent.ShowAlertBox('Success', 'Removed Successfully', 5000);
            $scope.FORECAST_UPLOAD.UploadedFiles = [];
        });
    };
    $scope.SELECTED_UPLOAD_BRANCH_Fn = function (_Branch) {
        if (_Branch == '') {
            $scope.AddShiftSearch.CUSTOM_UPLOAD_BRANCH_NAME = $scope.AddShiftSearch.DD_DEFAULT_TEXT;
            $scope.AddShiftSearch.UPLOAD_BRANCH_ID = "";
        }
        else {
            $scope.AddShiftSearch.CUSTOM_UPLOAD_BRANCH_NAME = _Branch.BRANCH_NAME;
            $scope.AddShiftSearch.UPLOAD_BRANCH_ID = _Branch.BRANCH_ID;
        }
    }

    $scope.UPLOAD_FORECAST = function (_titlename, _titleid, UPLOAD_TYPE_ID) {
        $scope.FORECAST_UPLOAD = {};
        $scope.FORECAST_UPLOAD.TITLE_NAME = _titlename;
        $scope.FORECAST_UPLOAD.TITLE_ID = _titleid;
        $scope.FORECAST_UPLOAD.UPL_FILE_FLAG = 1;
        $scope.FORECAST_UPLOAD.UPLOAD_TYPE_ID = UPLOAD_TYPE_ID;
        $scope.HRM_FORECAST_UPLOAD_TYPE = [];
        $scope.INVALID_EXCLE_CELL_FLAG = false;
        $scope.SubmiteUpload = true;
        $scope.COPY_CODE_ARRY = [];
        $scope.CODE_ARRY = [];
        $scope.INVALID_EXCLE_CELL_COUNT = null;
        $scope.HRM_HOLIDAY_CALENDAR_UPLOAD_TYPE = [];
        $scope.INVALID_INVOICE_CONTACT_LIST = [];
        $scope.ERROR_LIST = [];
        $scope.INVALID_FORECAST_LIST = [];
        $scope.SELECTED_UPLOAD_BRANCH_Fn('');
        angular.element("input[id=HR_uploadExcel1]").val(null);
        $('#Upload_Forecast').modal('show');

    }
    $scope.DOWNLOAD_FORECAST_TEMPLATE_Fn = function () {
        ModelObj = new Object();
        if ($scope.FORECAST_UPLOAD.TITLE_NAME == 'Sales') {
            ModelObj.FILE_NAME = "Sales";
            ModelObj.FILE_PATH = "Sales";
            ModelObj.EXCEL_DATATABLE = $scope.FORECAST_TYPE;
            ModelObj.UPLOADE_TYPE_ID = $scope.FORECAST_UPLOAD.UPLOAD_TYPE_ID;
        }
        else if ($scope.FORECAST_UPLOAD.TITLE_NAME == 'Wage') {
            ModelObj.FILE_NAME = "Wage";
            ModelObj.FILE_PATH = "Wage";
            ModelObj.EXCEL_DATATABLE = $scope.FORECAST_TYPE;
            ModelObj.UPLOADE_TYPE_ID = $scope.FORECAST_UPLOAD.UPLOAD_TYPE_ID;
        }
        else if ($scope.FORECAST_UPLOAD.TITLE_NAME == 'Guest') {
            ModelObj.FILE_NAME = "Guest Forecast";
            ModelObj.FILE_PATH = "Guestforecase";
            ModelObj.EXCEL_DATATABLE = $scope.FORECAST_TYPE;
            ModelObj.UPLOADE_TYPE_ID = $scope.FORECAST_UPLOAD.UPLOAD_TYPE_ID;
        };
        PrcCommMethods.HR_API(ModelObj, 'DOWNLOAD_OPENXML_UPLOAD').then(function (data) {
            $scope.SERVER_FILE_PATH = '/' + data.data.FOLDER_NAME + data.data.RETURN_FILE_NAME;
            $scope.FILE_NAME = ModelObj.FILE_NAME;
            window.location.href = $scope.SERVER_FILE_PATH;
        });
    }
    $scope.set_week_picker = function (date, FLAG) {
        $scope.start_date = new Date(date.getFullYear(), date.getMonth(), parseInt($scope.START_DAY_OF_WEEK) + date.getDate() - date.getDay());//new Date(date.getFullYear(), date.getMonth(), 1 + date.getDate() - date.getDay());
        $scope.end_date = new Date(date.getFullYear(), date.getMonth(), parseInt($scope.START_DAY_OF_WEEK) + date.getDate() - date.getDay() + 6); //new Date(date.getFullYear(), date.getMonth(), $scope.start_date.getDate() + (6));
        if ($scope.start_date > date) {
            if (FLAG == 1) {
                var increasedays = $scope.start_date.getDate() - date.getDate();
                $scope.start_date = new Date(date.getFullYear(), date.getMonth(), $scope.start_date.getDate() - ((7 - increasedays) + increasedays));
                //  $scope.end_date = new Date(date.getFullYear(), date.getMonth(), $scope.start_date.getDate() + (6));
                $scope.end_date = $scope.addDays(new Date($scope.start_date), 6);
            }
        }
        var StartDD = $scope.start_date.getDate();
        var Startmm = $scope.start_date.getMonth() + 1;
        var start_dateyyyy = $scope.start_date.getFullYear();

        var EndDD = $scope.end_date.getDate();
        var Endmm = $scope.end_date.getMonth() + 1;
        var Endyyyy = $scope.end_date.getFullYear();

        if (StartDD < 10) { StartDD = '0' + StartDD; }
        if (Startmm < 10) { Startmm = '0' + Startmm; }
        var start_dateddmmyy = StartDD + '/' + Startmm + '/' + start_dateyyyy;

        if (EndDD < 10) { EndDD = '0' + EndDD; }
        if (Endmm < 10) { Endmm = '0' + Endmm; }
        var end_dateddmmyy = EndDD + '/' + Endmm + '/' + Endyyyy;

        $scope.weekpicker.datepicker('update', $scope.start_date); //(($scope.start_date.getMonth() + 1) + '/' + $scope.start_date.getDate() + '/' + $scope.start_date.getFullYear() + ' - ' + ($scope.end_date.getMonth() + 1) + '/' + $scope.end_date.getDate() + '/' + $scope.end_date.getFullYear()));
        $scope.weekpicker.val(start_dateddmmyy + ' - ' + end_dateddmmyy);

        $scope.START_DATE = $scope.start_date;
        $scope.END_DATE = $scope.end_date;

        $scope.HRM_GET_SCHEDULING_ACCESS();
        // $scope.WEEK_NO = weekYear($scope.start_date);
        if (!$scope.$$phase) { $scope.$apply(); }
    };
    $scope.DATE_WEEK_PICKER = function (date, FLAG) {
        $scope.weekpicker = $('.week-picker');
        $scope.weekpicker.datepicker({
            weekStart: parseInt($scope.START_DAY_OF_WEEK),
            autoclose: true,
            forceParse: false,
            todayHighlight: true,
            container: '#week-picker-wrapper',
            calendarWeeks: true,

        }).on("changeDate", function (e) {
            $scope.set_week_picker(e.date);
        });
        $('.week-prev').on('click', function () {
            var prev = new Date($scope.start_date.getTime());
            prev.setDate(prev.getDate() - 7);
            $scope.set_week_picker(prev);
        });
        $('.week-next').on('click', function () {
            var next = new Date($scope.end_date.getTime());
            next.setDate(next.getDate() + 1);
            $scope.set_week_picker(next);
        });
        $scope.set_week_picker(date);
        //if (new Date(date.getFullYear(), date.getMonth(), parseInt($scope.START_DAY_OF_WEEK) + date.getDate() - date.getDay()) > date) {
        //    date = $scope.addDays(new Date(), -7);
        //    //for schedule limitaion
        //    //$scope.SCHEDULE_LIMITATION_START_DATE = new Date(date.getFullYear(), date.getMonth(), parseInt($scope.START_DAY_OF_WEEK) + date.getDate() - date.getDay());
        //    $scope.SCHEDULE_LIMITATION_END_DATE = new Date(date.getFullYear(), date.getMonth(), parseInt($scope.START_DAY_OF_WEEK) + date.getDate() - date.getDay() + 6);
        //    $scope.set_week_picker(date, FLAG != undefined ? 2 : 1);
        //} else {
        //    //$scope.SCHEDULE_LIMITATION_START_DATE = new Date(date.getFullYear(), date.getMonth(), parseInt($scope.START_DAY_OF_WEEK) + date.getDate() - date.getDay());
        //    $scope.SCHEDULE_LIMITATION_END_DATE = new Date(date.getFullYear(), date.getMonth(), parseInt($scope.START_DAY_OF_WEEK) + date.getDate() - date.getDay() + 6);
        //    $scope.set_week_picker(date, FLAG != undefined ? 2 : 1);
        //}
    };



    $scope.CHECK_PAST_DATE_RANGE = function (startDate, endDate) {
        // 0 for past , 1 for future and 2 for in between
        var currentDate = new Date($scope.CURRENT_DATE);
        currentDate.setHours(0, 0, 0, 0);

        var startDateObj = new Date(startDate);
        startDateObj.setHours(0, 0, 0, 0);

        var endDateObj = new Date(endDate);
        endDateObj.setHours(0, 0, 0, 0);

        if (currentDate > endDateObj) {
            return 0; // Past
        } else if (currentDate < startDateObj) {
            return 1; // Future
        } else {
            return 2; // In between
        }
    };

    var _day = $scope.addDays(new Date(), 0);
    $scope.DATE_WEEK_PICKER(_day, 1);

    $scope.FILTER_LOAD_Fn = function () {
        if ($scope.USER_FILTERS_LIST != undefined && $scope.USER_FILTERS_LIST.length > 0) {
            angular.forEach($scope.USER_FILTERS_LIST, function (item) {
                if (item.FILTERS_ID == 7) { // BRANCH
                    let branch = $scope.SCHEDULE_BRANCH_LIST.find(x => x.BRANCH_ID == parseInt(item.VALUE));
                    if (branch != undefined) {
                        $scope.SELECTED_SCHEDULE_BRANCH_Fn(branch, true);
                    }
                }
                if (item.FILTERS_ID == 8) {// GROUP
                    let group = $scope.GROUP_BY_LIST.find(x => x.GROUP_ID == parseInt(item.VALUE));
                    if (group != undefined) {
                        $scope.CLICK_GROUP_BY_VIEW_Fn(group, true);
                    }
                }
                if (item.FILTERS_ID == 9) {// STATUS
                    let status = $scope.SHIFTS_STATUS_LIST.find(x => x.STATUS_ID == parseInt(item.VALUE));
                    if (status != undefined) {
                        $scope.CLICK_SHIFT_STATUS_VIEW_Fn(status, true);
                    }
                }
                if (item.FILTERS_ID == 10) {//Shift View 
                    let view = $scope.VIEW_LIST.find(x => x.VIEW_ID == parseInt(item.VALUE));
                    if (view != undefined) {
                        $scope.SELECTED_VIEW_Fn(view, true);
                    }
                }
            });
            // $scope.DATE_WEEK_PICKER(_day, 1);
        }
        else {

            let branch = $scope.SCHEDULE_BRANCH_LIST.find(x => x.IS_PRIME == -1);
            //let branch = $scope.SCHEDULE_BRANCH_LIST.find(x => x.IS_PRIME == 1);

            $scope.SELECTED_SCHEDULE_BRANCH_Fn(branch, true);
            $scope.CLICK_GROUP_BY_VIEW_Fn($scope.GROUP_BY_LIST[0], true);
            $scope.CLICK_SHIFT_STATUS_VIEW_Fn($scope.SHIFTS_STATUS_LIST[0], true);
            $scope.SELECTED_VIEW_Fn($scope.VIEW_LIST[1], true);
            // $scope.DATE_WEEK_PICKER(_day, 1);
        }
        $scope.HRM_GET_SCHDLS();

    };
    function isDateValid(dateString) {
        let date = moment(dateString, 'MMM D, YYYY', true);
        return date.isValid();
    }
    $scope.CHANGE_VIEW_DATE_Fn = function (day_view_date) {
        if (isDateValid(day_view_date)) {
            $scope.START_DATE = new Date(day_view_date);
            $scope.END_DATE = new Date(day_view_date);
            $scope.HRM_GET_SCHDLS();
        }
    };

    //$scope.HRM_GET_DEPARTMENTS = function () {
    //    var AbsenceObject = new Object();
    //    AbsenceObject.CUSTOMER_ID = $scope.ShiftEmpSearch.CUSTOMER_ID;
    //    AbsenceObject.ENTITY_ID = null;
    //    AbsenceObject.PAGE_NO = $scope.ShiftEmpSearch.PAGE_NO;
    //    AbsenceObject.PAGE_SIZE = $scope.ShiftEmpSearch.PAGE_SIZE;
    //    PrcCommMethods.HUMANRESOURCE_API(AbsenceObject, 'HRM_GET_DEPARTMENTS').then(function (data) {
    //        if (data.data.Table.length > 0) {
    //           // $scope.SHIFT_DEPARTMENTS_LIST = data.data.Table;
    //            $scope.DEPARTMENTS_LIST = data.data.Table;
    //        } else {
    //          //  $scope.SHIFT_DEPARTMENTS_LIST = [];
    //        }

    //    });
    //};
    //$scope.HRM_GET_POSITIONS = function () {
    //    var AbsenceObject = new Object();
    //    AbsenceObject.CUSTOMER_ID = $scope.ShiftEmpSearch.CUSTOMER_ID;
    //    AbsenceObject.ENTITY_ID = null;
    //    AbsenceObject.PAGE_NO = $scope.ShiftEmpSearch.PAGE_NO;
    //    AbsenceObject.PAGE_SIZE = $scope.ShiftEmpSearch.PAGE_SIZE;
    //    PrcCommMethods.HUMANRESOURCE_API(AbsenceObject, 'HRM_GET_POSITIONS').then(function (data) {
    //        if (data.data.Table.length > 0) {
    //            $scope.SHIFT_POSITIONS_LIST = data.data.Table;
    //            $scope.POSITIONS_LIST = data.data.Table;
    //        } else {
    //            $scope.SHIFT_POSITIONS_LIST = [];
    //        }
    //    });
    //};
    $scope.HRM_GET_EMPLOYTEE_LIST_BY_EMPLY_PRSNL_ID = function () {
        var UserModelObj = new Object();
        UserModelObj.EMPLY_PRSNL_ID = $scope.ShiftEmpSearch.LOGIN_EMPLOYEE_ID;
        UserModelObj.CUSTOMER_ID = $scope.ShiftEmpSearch.CUSTOMER_ID;
        UserModelObj.ENTITY_ID = $scope.ShiftEmpSearch.ENTITY_ID;
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'HRM_GET_EMPLOYTEE_LIST_BY_EMPLY_PRSNL_ID').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.SHIFT_EMPLOYEES_LIST = data.data.Table;
            }
            else if (data.data == null) {
                $scope.SHIFT_EMPLOYEES_LIST = [];
            }
        });
    };
    // $scope.HRM_GET_DEPARTMENTS();
    // $scope.HRM_GET_POSITIONS();
    $scope.HRM_GET_EMPLOYTEE_LIST_BY_EMPLY_PRSNL_ID();


    $scope.SETVALUE_WAGE = function (flag) {//1 for shift master or 2 for add/edit shift
        if (flag == 1) {

            if ($scope.ShiftEmpSearch.IS_SPECIAL_WAGE == false) {
                $scope.ShiftEmpSearch.WAGE = "";
                $scope.ShiftEmpSearch.WAGE_TYPE_ID = "";
                $scope.ShiftEmpSearch.CUSTOM_WAGE_NAME = "Choose";
            }
            else {
                $scope.ShiftEmpSearch.WAGE = "";
                $scope.ShiftEmpSearch.WAGE_TYPE_ID = "";
                $scope.ShiftEmpSearch.CUSTOM_WAGE_NAME = "Choose";
                $scope.ShiftEmpSearch.IS_SPECIAL_WAGE = true;
            }
        }
        if (flag == 2) {
            if ($scope.AddShiftSearch.IS_SPECIAL_WAGE == false) {
                $scope.AddShiftSearch.WAGE = "";
                $scope.AddShiftSearch.WAGE_TYPE_ID = "";
                $scope.AddShiftSearch.CUSTOM_WAGE_NAME = "Choose";
            }
            else {
                $scope.AddShiftSearch.IS_SPECIAL_WAGE = true;
                $scope.AddShiftSearch.WAGE = "";
                $scope.AddShiftSearch.WAGE_TYPE_ID = "";
                $scope.AddShiftSearch.CUSTOM_WAGE_NAME = "Choose";
            }
            $scope.AddShiftSearch.WAGE_COST = "0.00";
        }
    }

    $scope.SETVALUE_USE_AS = function (USE_AS) {
        if (USE_AS == 1) {
            $scope.USE_CLOCKIN = false;
            $scope.UPDATE_TOTAL_DURATION_Fn($scope.AddShiftSearch.SCHEDULED_START, $scope.AddShiftSearch.SCHEDULED_END, 3);
            if (!$scope.USE_SCHEDULED) {
                $scope.AddShiftSearch.APPROVED_CLOCK_IN = "";
                $scope.AddShiftSearch.APPROVED_CLOCK_OUT = "";
                $scope.AddShiftSearch.TOTAL_APPROVED_CLOCK_HOURS = 0;
            }
        }
        else {
            $scope.USE_SCHEDULED = false;
            $scope.UPDATE_TOTAL_DURATION_Fn($scope.AddShiftSearch.CLOCK_IN, $scope.AddShiftSearch.CLOCK_OUT, 3);
            if (!$scope.USE_CLOCKIN) {
                $scope.AddShiftSearch.APPROVED_CLOCK_IN = "";
                $scope.AddShiftSearch.APPROVED_CLOCK_OUT = "";
                $scope.AddShiftSearch.TOTAL_APPROVED_CLOCK_HOURS = 0;
            }
        }

    }
    $scope.BREAK_RULE_CHECKED_Fn = function () {
        if ($scope.ShiftEmpSearch.IS_BREAK_RULE_APPLIED) {
            $scope.ShiftEmpSearch.BREAK_HOURS = "";
            $scope.ShiftEmpSearch.BREAK_TYPE_ID = "";
            $scope.ShiftEmpSearch.CUSTOM_SHIFT_BREAK_NAME = "Choose";
        }
    }
    $scope.RETUN_BLANK_OBJ = function (blankObj) {
        blankObj.TABLE_ID = 0;
        blankObj.RELATIVE_ID = null;
        blankObj.INCLUDE_FLAG = null;
        blankObj.DELETE_FLAG = null;
        blankObj.SETTING_MASTER_ID = null;

        return blankObj;
    }

    ///Shift Tab MASTER//
    $scope.HRM_INS_UPD_SHIFT_MASTER = function (_param_call_Flag) {

        //if (_shiftcnt.indexOf(".") != -1) {
        //    $scope.$parent.ShowAlertBox("Error", "Please enter whole number.", 3000);
        //    return;
        //}
        var ShiftObj = new Object();
        ShiftObj.SHIFT_MASTER_ID = $scope.ShiftEmpSearch.SHIFT_MASTER_ID;
        ShiftObj.ACTIVE = _param_call_Flag == 2 ? 0 : 1;
        ShiftObj.USER_ID = $scope.AddShiftSearch.USER_ID;
        if (_param_call_Flag != 2) {
            $scope.SHIFT_FORM.submitted = true;
            var _shiftcnt = $scope.ShiftEmpSearch.SHIFT_COUNT;
            if (_shiftcnt == undefined || _shiftcnt == null || _shiftcnt == '') {
                $scope.$parent.ShowAlertBox("Error", "Please enter shift count.", 3000);
                return;
            }
            else if (parseFloat(_shiftcnt) < 0.1 || parseFloat(_shiftcnt) > 3) {
                $scope.$parent.ShowAlertBox("Error", "Shift Count must be between 0.1 and 3.", 3000);
                return;
            }
            if ($scope.SHIFT_FORM.$valid) {
                ShiftObj.SHIFT_MASTER_ID = $scope.ShiftEmpSearch.SHIFT_MASTER_ID;
                ShiftObj.SHIFT_NAME = $scope.ShiftEmpSearch.SHIFT_NAME;
                ShiftObj.START_TIME = $scope.$parent.HRM_CHANGE_TIME_ZONE_Fn(new Date($scope.ShiftEmpSearch.START_TIME));
                ShiftObj.END_TIME = $scope.$parent.HRM_CHANGE_TIME_ZONE_Fn(new Date($scope.ShiftEmpSearch.END_TIME));
                ShiftObj.SHIFT_COUNT = $scope.ShiftEmpSearch.SHIFT_COUNT;
                ShiftObj.SCHEDULED_PAID_BREAK = $scope.ShiftEmpSearch.SCHEDULED_PAID_BREAK;
                ShiftObj.SCHEDULED_UNPAID_BREAK = $scope.ShiftEmpSearch.SCHEDULED_UNPAID_BREAK;
                ShiftObj.SCHEDULED_DURATION = $scope.ShiftEmpSearch.SCHEDULED_DURATION;
                ShiftObj.NOTE = $scope.ShiftEmpSearch.NOTE;
                ShiftObj.ACTIVE = _param_call_Flag == 2 ? 0 : 1;
                ShiftObj.USER_ID = $scope.MasterData.USER_ID;
                ShiftObj.CUSTOMER_ID = $scope.MasterData.CUSTOMER_ID;
                ShiftObj.ENTITY_ID = $scope.MasterData.ENTITY_ID;
                ShiftObj.IS_SPECIAL_WAGE = $scope.ShiftEmpSearch.IS_SPECIAL_WAGE;
                ShiftObj.WAGE = $scope.ShiftEmpSearch.WAGE;
                ShiftObj.WAGE_TYPE_ID = $scope.ShiftEmpSearch.WAGE_TYPE_ID;
            }
            else {
                var ShiftObj = null;
            }
        }
        if (ShiftObj != null) {

            PrcCommMethods.HUMANRESOURCE_API(ShiftObj, 'HRM_INS_UPD_SHIFT_MASTER').then(function (data) {
                if (data.data > 0) {
                    if ($scope.ShiftEmpSearch.SHIFT_MASTER_ID == 0 && _param_call_Flag == 1) {
                        $scope.$parent.ShowAlertBox("Success", 'Shift template save successfully', 3000);
                    }
                    else if ($scope.ShiftEmpSearch.SHIFT_MASTER_ID > 0 && _param_call_Flag == 1) {
                        $scope.$parent.ShowAlertBox("Success", 'Shift template updated successfully', 3000);
                    }
                    else if ($scope.ShiftEmpSearch.SHIFT_MASTER_ID > 0 && _param_call_Flag == 2) {
                        $scope.$parent.ShowAlertBox("Success", 'Shift template deleted successfully', 3000);
                    }
                    $('#add_shift_template').modal('hide');
                    $scope.HRM_SCHDL_GET_SHIFT_TEMPLATES(1);
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

    $scope.HRM_SCHDL_GET_SHIFT_TEMPLATES = function (FLAG) {
        $scope.$parent.overlay_loadingNew = 'block';
        if (FLAG == 1) {
            $scope.LOAD_FETCH_TEXT = 'fetching record...';
            $scope.ShiftEmpSearch.PAGE_NO = 1;
            $scope.SHIFT_SCHDL_PIN_LIST = [];
        }
        var _shift_templates = new Object();
        _shift_templates.ENTITY_ID = $scope.MasterData.ENTITY_ID;
        _shift_templates.USER_ID = $scope.MasterData.USER_ID;
        PrcCommMethods.HUMANRESOURCE_API(_shift_templates, 'HRM_SCHDL_GET_SHIFT_TEMPLATES').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.$parent.overlay_loadingNew = 'none';
                $scope.SHIFT_SCHDL_PIN_LIST = data.data.Table;
                if (data.data.Table.length < $scope.ShiftEmpSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.ShiftEmpSearch.PAGE_NO = parseInt($scope.ShiftEmpSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else {
                if ($scope.SHIFT_SCHDL_PIN_LIST.length == 0) { $scope.LOAD_FETCH_TEXT = 'no record yet'; }
                $scope.GetData = false;
                $scope.$parent.overlay_loadingNew = 'none';
            }
        });
    };
    $scope.HRM_SCHDL_GET_SHIFT_TEMPLATES(1);

    //Shift_Edit
    $scope.HRM_GET_SHIFT_MASTER_BY_ID = function (_param_shift) {
        var PunchClockObject = new Object();
        PunchClockObject.SHIFT_MASTER_ID = _param_shift;  //_param_shift.SHIFT_MASTER_ID;
        PrcCommMethods.HUMANRESOURCE_API(PunchClockObject, 'HRM_GET_SHIFT_MASTER_BY_ID').then(function (data) {
            if (data.data.Table.length > 0) {
                let _Shift = data.data.Table[0];
                $scope.ShiftEmpSearch.SHIFT_MASTER_ID = _Shift.SHIFT_MASTER_ID;
                $scope.ShiftEmpSearch.SHIFT_NAME = _Shift.SHIFT_NAME;
                $scope.ShiftEmpSearch.START_TIME = moment($scope.ConvertTimeToDate(new Date($scope.CURRENT_DATE), _Shift.START_TIME));
                $scope.ShiftEmpSearch.END_TIME = moment($scope.ConvertTimeToDate(new Date($scope.CURRENT_DATE), _Shift.END_TIME));

                $scope.UPDATE_TOTAL_DURATION_Fn($scope.ShiftEmpSearch.START_TIME, $scope.ShiftEmpSearch.END_TIME, 2);

                $scope.ShiftEmpSearch.SHIFT_COUNT = _Shift.SHIFT_COUNT;

                $scope.ShiftEmpSearch.SCHEDULED_PAID_BREAK = _Shift.PAID_BREAK;
                $scope.ShiftEmpSearch.SCHEDULED_UNPAID_BREAK = _Shift.UNPAID_BREAK;

                $scope.ShiftEmpSearch.SCHEDULED_UNPAID_BREAK = _Shift.UNPAID_BREAK;
                $scope.ShiftEmpSearch.IS_SPECIAL_WAGE = _Shift.IS_SPECIAL_WAGE;
                $scope.ShiftEmpSearch.WAGE = _Shift.WAGE;

                if (_Shift.WAGE_TYPE_ID == null || _Shift.WAGE_TYPE_ID == 0) {
                    $scope.ShiftEmpSearch.CUSTOM_WAGE_NAME = $scope.ShiftEmpSearch.DD_DEFAULT_TEXT;
                    $scope.ShiftEmpSearch.WAGE_TYPE_ID = 0;
                    $scope.SETVALUE_WAGE(1);
                }
                else {
                    $scope.ShiftEmpSearch.CUSTOM_WAGE_NAME = $scope.WAGES_LIST.filter(item => item.WAGE_TYPE_ID == _Shift.WAGE_TYPE_ID)[0].WAGE_NAME;
                    $scope.ShiftEmpSearch.WAGE_TYPE_ID = _Shift.WAGE_TYPE_ID;
                }
                $scope.ShiftEmpSearch.NOTE = _Shift.NOTE;
                $scope.ShiftEmpSearch.CHRLENGTH = _Shift.NOTE.length;
                $('#add_shift_template').modal('show');
            }

        });
    }
    $scope.HRM_SCHDL_INS_UPD_PIN_SHIFT_MASTER = function (SHIFT_MASTER_ID, IS_PIN) {
        var ShiftObj = new Object();
        ShiftObj.CUSTOMER_ID = $scope.ShiftEmpSearch.CUSTOMER_ID;
        ShiftObj.USER_ID = $scope.ShiftEmpSearch.USER_ID;
        ShiftObj.SHIFT_MASTER_ID = SHIFT_MASTER_ID;
        ShiftObj.IS_PIN = IS_PIN;
        ShiftObj.ACTIVE = 1;
        PrcCommMethods.HUMANRESOURCE_API(ShiftObj, 'HRM_SCHDL_INS_UPD_PIN_SHIFT_MASTER').then(function (data) {
            if (data.data > 0) {
                $scope.HRM_SCHDL_GET_SHIFT_TEMPLATES(1);
            }
            if (data.data == 0) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
        });
    }

    $('input.timepicker_START_TIME').timepicker({
        change: function (time) {
            const currentDate = new Date($scope.CURRENT_DATE);
            const selectedTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), time.getHours(), time.getMinutes());
            $scope.ShiftEmpSearch.START_TIME = new Date(selectedTime);
        }
    });
    $('input.timepicker_END_TIME').timepicker({
        change: function (time) {
            const currentDate = new Date($scope.CURRENT_DATE);
            const selectedTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), time.getHours(), time.getMinutes());
            $scope.ShiftEmpSearch.END_TIME = selectedTime;
        }
    });


    /// Start of Shift tab department site,position and emplyee add and remove
    //$scope.ADD_SHIFT_BRANCH_Fn = function (_branch) {
    //    $scope.ShiftEmpSearch.BranchSearch = '';
    //    $scope.ADD_SHIFT_BRANCH_LIST.push(angular.copy(_branch));
    //    $scope.SHIFT_BRANCH_LIST = $scope.SHIFT_BRANCH_LIST.filter(function (branch) {
    //        return branch !== _branch;
    //    });
    //};
    //$scope.REMOVE_SHIFT_BRANCH_Fn = function (_branch) {
    //    $scope.SHIFT_BRANCH_LIST.push(angular.copy(_branch));
    //    $scope.ADD_SHIFT_BRANCH_LIST = $scope.ADD_SHIFT_BRANCH_LIST.filter(function (branch) {
    //        return branch !== _branch;
    //    });
    //};

    //$scope.ADD_SHIFT_DEPARTMENTS_Fn = function (_department) {
    //    $scope.ShiftEmpSearch.DepartmentSearch = '';
    //    $scope.ADD_SHIFT_DEPARTMENTS_LIST.push(angular.copy(_department));
    //    $scope.SHIFT_DEPARTMENTS_LIST = $scope.SHIFT_DEPARTMENTS_LIST.filter(function (department) {
    //        return department !== _department;
    //    });
    //};

    //$scope.REMOVE_SHIFT_DEPARTMENTS_Fn = function (_department) {
    //    $scope.SHIFT_DEPARTMENTS_LIST.push(angular.copy(_department));
    //    $scope.ADD_SHIFT_DEPARTMENTS_LIST = $scope.ADD_SHIFT_DEPARTMENTS_LIST.filter(function (department) {
    //        return department !== _department;
    //    });
    //};
    //$scope.ADD_SHIFT_POSITIONS_Fn = function (_position) {
    //    $scope.ShiftEmpSearch.PositionSearch = '';
    //    $scope.ADD_SHIFT_POSITIONS_LIST.push(angular.copy(_position));
    //    $scope.SHIFT_POSITIONS_LIST = $scope.SHIFT_POSITIONS_LIST.filter(function (position) {
    //        return position !== _position;
    //    });
    //};

    //$scope.REMOVE_SHIFT_POSITIONS_Fn = function (_postition) {
    //    $scope.SHIFT_POSITIONS_LIST.push(angular.copy(_postition));
    //    $scope.ADD_SHIFT_POSITIONS_LIST = $scope.ADD_SHIFT_POSITIONS_LIST.filter(function (position) {
    //        return position !== _postition;
    //    });
    //};

    $scope.ADD_SHIFT_EMPLOYEE_Fn = function (_employee) {
        $scope.ShiftEmpSearch.EmployeeSearch = '';
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

    //Shift Tab
    $scope.SELECTED_SHIFT_BREAK_Fn = function (_param_break) {
        if (_param_break == '') {
            $scope.ShiftEmpSearch.CUSTOM_SHIFT_BREAK_NAME = $scope.ShiftEmpSearch.DD_DEFAULT_TEXT;
            $scope.ShiftEmpSearch.BREAK_TYPE_ID = "";
        }
        else {
            $scope.ShiftEmpSearch.CUSTOM_SHIFT_BREAK_NAME = _param_break.BREAK_NAME;
            $scope.ShiftEmpSearch.BREAK_TYPE_ID = _param_break.BREAK_RULE_TYPE_ID;
        }
    };

    //Shift Tab
    $scope.SELECTED_WAGE_Fn = function (_param_wage, flag) {
        if (flag == undefined) {
            if (_param_wage == undefined || _param_wage == '') {
                $scope.ShiftEmpSearch.CUSTOM_WAGE_NAME = $scope.ShiftEmpSearch.DD_DEFAULT_TEXT;
                $scope.ShiftEmpSearch.WAGE_TYPE_ID = "";
            }
            else {
                $scope.ShiftEmpSearch.CUSTOM_WAGE_NAME = _param_wage.WAGE_NAME;
                $scope.ShiftEmpSearch.WAGE_TYPE_ID = _param_wage.WAGE_TYPE_ID;
            }
        }
        else {
            if (_param_wage == undefined || _param_wage == '') {
                $scope.AddShiftSearch.CUSTOM_WAGE_NAME = $scope.ShiftEmpSearch.DD_DEFAULT_TEXT;
                $scope.AddShiftSearch.WAGE_TYPE_ID = "";
            }
            else {
                $scope.AddShiftSearch.CUSTOM_WAGE_NAME = _param_wage.WAGE_NAME;
                $scope.AddShiftSearch.WAGE_TYPE_ID = _param_wage.WAGE_TYPE_ID;
            }
        }
    }

    $scope.DELETE_SHIFT_Fn = function (_param_shift_master_id, _param_shift_name) {
        $scope.SELECTED_MASTER_ID = _param_shift_master_id;
        $scope.SELECTED_SHIFT_NAME = _param_shift_name;
        $scope.SELECTED_MASTER_ID.MESSAGE = "It is safe to perform this operation as it hasn't been assigned to any employee. Do you want to proceed?";
        $('#add_shift_template').modal('hide');
        $('#Shift_Template').modal('show');

    }


    $scope.SHOW_SHIFT_POPUP_Fn = function () {
        $scope.RESET_SHIFT_Fn();
        $('#add_shift_template').modal('show');

        $('#timepicker_START_TIME').timepicker({
            template: 'modal',
            interval: 30,
            _timeFormat: 'h:mm p',
            _interval: 60,
            _minTime: '10',
            _maxTime: '6:00pm',
            _defaultTime: '11',
            startTime: '00:00',
            dynamic: false,
            dropdown: true,
            scrollbar: true

        });
        $('#timepicker_END_TIME').timepicker({
            template: 'modal',
            interval: 30,
            _timeFormat: 'h:mm p',
            _interval: 60,
            _minTime: '10',
            _maxTime: '6:00pm',
            _defaultTime: '11',
            startTime: '00:00',
            dynamic: false,
            dropdown: true,
            scrollbar: true

        });

    };
    $scope.SHOW_SHIFT_EDIT_POPUP_Fn = function (_param_shift) {
        $scope.HRM_GET_SHIFT_MASTER_BY_ID(_param_shift);
    }
    $scope.ConvertDateFormat = function (dateString) {
        if (dateString != null && dateString != undefined && dateString != '') {
            return new Date(dateString);
        } else {
            return dateString;
        }
    }
    $scope.ConvertTimeToAM_PM = function (time24) {
        if ($scope.TIME_FORMAT == 1) {

            const [hours, minutes] = time24.split(':');
            let hour = parseInt(hours);
            let ampm = 'AM';
            if (hour > 12) {
                hour -= 12;
                ampm = 'PM';
            } else if (hour === 0) {
                hour = 12;
            }
            let formattedTime = `${hour}:${minutes.padStart(2, '0')} ${ampm}`;
            return formattedTime;
        } else {
            return time24;
        }
    };

    // common function for date
    $scope.ConvertTimeToDate = function (dateInput, timeString) {
        if (timeString instanceof Date) {
            return new Date(timeString);
        }
        else if (timeString.includes("-")) {
            return new Date(timeString);
        }
        else {
            const [hours, minutes, seconds] = timeString.split(':').map(Number);
            const date = new Date(dateInput);
            date.setHours(hours);
            date.setMinutes(minutes);
            date.setSeconds(seconds || 0);
            return date;
        }
    };
    $scope.calculateDuration = function (inputStartDate, inputEndDate, format) {
        let startDate = moment(inputStartDate, "DD/MM/YYYY HH:mm:ss");
        let endDate = moment(inputEndDate, "DD/MM/YYYY HH:mm:ss");

        //if (endDate.isBefore(startDate)) {
        //    endDate.add(1, 'days');
        //}
        let ms = endDate.diff(startDate);
        let diffDuration = moment.duration(ms);
        let totalMinutes = Math.abs(diffDuration.asMinutes());
        let hours = Math.floor(totalMinutes / 60);
        let minutes = totalMinutes % 60;
        let decimalHours = hours + (minutes / 60);
        if (format == "HOURS") {
            return parseFloat(decimalHours.toFixed(2));
        }
        if (format == "TIME") {
            return parseFloat(totalMinutes.toFixed(2));
        } else {
            return (`${hours} ${hours === 1 ? 'hour' : 'hours'} ${minutes} ${minutes === 1 ? 'min' : 'mins'}`);
        }
    };
    $scope.TotalMinutesToHoursString = function (totalMinutes) {
        if (totalMinutes == NaN || totalMinutes <= 0 || totalMinutes == undefined) {
            return `${0} ${'hour'} ${0} ${'minute'}`;
        }
        let hours = Math.floor(totalMinutes / 60);
        let minutes = totalMinutes % 60;

        let hoursText = hours === 1 ? 'hour' : 'hours';
        let minutesText = minutes === 1 ? 'min' : 'mins';

        return `${hours} ${hoursText} ${minutes} ${minutesText}`;
    };

    $scope.SELECTED_WAGE_Fn('');
    $scope.SELECTED_SHIFT_BREAK_Fn('');

    //------------ Add Shift Section -----------------------


    $scope.BlankShiftObject = {
        CUSTOMER_ID: $cookies.get("CUSTOMER_ID"),
        ENTITY_ID: parseInt($cookies.get("ENTITY_ID")),
        MODULE_ID: $cookies.get("MODULE_ID"),
        USER_ID: $cookies.get("USERID"),
        EMPLY_PRSNL_ID: $cookies.get("EMPLY_PRSNL_ID"),
        LOGIN_EMPLOYEE_ID: $cookies.get("EMPLY_PRSNL_ID") == 0 ? null : $cookies.get("EMPLY_PRSNL_ID"),
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        DD_DEFAULT_TEXT: $scope.$parent.DD_DEFAULT_TEXT,
        CUSTOM_BRANCH_NAME: $scope.AddShiftSearch.CUSTOM_BRANCH_NAME,
        CUSTOM_EMPLOYEE_NAME: $scope.$parent.DD_DEFAULT_TEXT,
        CUSTOM_DEPARTMENT_NAME: $scope.$parent.DD_DEFAULT_TEXT,
        CUSTOM_POSITION_NAME: $scope.$parent.DD_DEFAULT_TEXT,
        CUSTOM_SHIFT_NAME: $scope.$parent.DD_DEFAULT_TEXT,
        CUSTOM_SECTION_NAME: $scope.$parent.DD_DEFAULT_TEXT,
        CUSTOM_WAGE_NAME: $scope.$parent.DD_DEFAULT_TEXT,
        CUSTOM_CLOCK_NAME: $scope.$parent.DD_DEFAULT_TEXT,
        SET_DEFAULT: false,
        SECTION: '',
        SHIFT_COUNT: '',
        SCHEDULED_START: '',
        SCHEDULED_END: '',
        SCHEDULED_PAID_BREAK: '',
        SCHEDULED_UNPAID_BREAK: '',
        BUSINESS_DATE: '',
        SCHDL_SHIFT_ID: 0,
        BRANCH_ID: $scope.ShiftEmpSearch.BRANCH_ID,
        EMPLY_BRANCH_ID: '',
        WAGE_TYPE_ID: '',
        WAGE_COST: '',
        WAGE: '',
        CLOCK_ID: '',
        STATUS_ID: 91,
    };

    $scope.CLOCK_DROPDOWN = [
        { CLOCK_ID: 1, CLOCK_NAME: "Clock In/Clock Out" },
        { CLOCK_ID: 2, CLOCK_NAME: "Break In/Break Out" }
    ];
    $scope.ng_initemployeeshifts = function (_employeeShift) {
        if (_employeeShift.GROUP_BY_ID != 0 && _employeeShift.GROUP_BY_ID != -1) {
            _employeeShift.EMPLOYEECOUNT = $filter('unique')($scope.EMPLOYEE_SHIFTS_LIST.filter(item => item.SECONDARY_GROUP_BY_ID == 0 && item.PARENT_ID == _employeeShift.GROUP_BY_ID), 'EMPLOYEE_ID').length;
            _employeeShift.EMPLOYEE_SHIFTS_DATES = angular.copy($scope.EMPLOYEE_SHIFTS_DATES);
        }

        //_employeeShift.SHORT_NAME = $scope.TextReturn(_employeeShift.EMPLOYEE_NAME);


    };

    $scope.ng_initemployee = function (_employee) {
        _employee.SHORT_NAME = $scope.TextReturn(_employee.EMPLOYEE_NAME);

    };

    $scope.EDIT_MODE = false;
    $scope.VIEW_MODE = false;
    $scope.APPROVE_MODE = false;
    $scope.ENABLE_UPDATE_BUTTON = true;
    $scope.ENABLE_APPROVE_BUTTON = false;
    $scope.GET_DRAGGED_SHIFT = function (_shift, flag) {

        if (flag == 0)
            $scope.DRAGGED_SHIFT = _shift;
        else
            $scope.DRAGGED_SHIFT = {
                DURATION: _shift.SCHEDULED_DURATION,
                END_TIME: _shift.SCHEDULED_END,
                IS_SPECIAL_WAGE: false,
                PAID_BREAK: _shift.SCHEDULED_PAID_BREAK,
                SHIFT_COUNT: _shift.SHIFT_COUNT,
                SHIFT_MASTER_ID: _shift.SHIFT_MASTER_ID,
                SHIFT_NAME: _shift.SHIFT_NAME,
                START_TIME: _shift.SCHEDULED_START,
                UNPAID_BREAK: _shift.SCHEDULED_UNPAID_BREAK,
                WAGE: 0,
                WAGE_TYPE_ID: null
            }
        //{{ADD_SHIFT_POPUP_Fn(2, 2,_employeeShift)}}
    }
    $scope.ADD_SHIFT_POPUP_Fn = function (flag, index, employee, shift) {
        if ($scope.ShiftEmpSearch.BRANCH_ID == 0) {
            //$scope.AddShiftSearch.SHIFT_BRANCH_ID = angular.copy(employee.PRIMARY_BRANCH_ID);
            $scope.SELECTED_SHIFT_SCHEDULE_BRANCH_Fn($scope.SCHEDULE_BRANCH_LIST.find(x => x.BRANCH_ID == employee.PRIMARY_BRANCH_ID));
        }
        else {
            //$scope.AddShiftSearch.SHIFT_BRANCH_ID = angular.copy($scope.ShiftEmpSearch.BRANCH_ID);

            $scope.SELECTED_SHIFT_SCHEDULE_BRANCH_Fn($scope.SCHEDULE_BRANCH_LIST.find(x => x.BRANCH_ID == $scope.ShiftEmpSearch.BRANCH_ID));
        }
        $scope.SELECTED_BRANCH_Fn($scope.SCHEDULE_BRANCH_LIST.find(x => x.BRANCH_ID == $scope.AddShiftSearch.SHIFT_BRANCH_ID), false, employee.EMPLOYEE_ID);
        $scope.DEPARTMENTS_LIST = $scope.ALL_DEPARTMENTS_LIST.filter(x => x.BRANCH_ID == $scope.AddShiftSearch.SHIFT_BRANCH_ID);
        $scope.POSITIONS_LIST = $scope.ALL_POSITIONS_LIST.filter(x => x.BRANCH_ID == $scope.AddShiftSearch.SHIFT_BRANCH_ID);
        $scope.HEADER_LABEL_SHIFT = 'Add';
        $scope.TEXT_SEARCH = "";
        //flag- 1 Plain Shift, 2 - Employee Shift, 3 - From select Employee Popup
        $('#add_employee').modal('hide');
        $scope.SHOW_REFRESH_WAGE = true;
        $scope.showpopup = true;
        $scope.AddShiftSearch.BUSINESS_DATE = $filter('date')(new Date($scope.EMPLOYEE_SHIFTS_DATES[0].DATE));
        $scope.AddShiftSearch.SUBTRACT_BREAK_61 = $scope.$parent.MASTER_GET_CUSTOMER_SETTINGS_VALUES(61) == 1 ? true : false;
        flag == 1 ? $scope.AddShiftSearch.SHIFT_COUNT = 1 : '';
        if (flag == 1 && $scope.AddShiftSearch.SHIFT_BRANCH_ID != $scope.ShiftEmpSearch.BRANCH_ID) {

            $scope.AddShiftSearch.SHIFT_BRANCH_ID = $scope.ShiftEmpSearch.BRANCH_ID;
            $scope.AddShiftSearch.EMPLY_BRANCH_ID = $scope.ShiftEmpSearch.BRANCH_ID;
            $scope.AddShiftSearch.CUSTOM_BRANCH_NAME = $scope.ShiftEmpSearch.CUSTOM_BRANCH_NAME;
            $scope.HRM_SCHDL_GET_SHIFT_EMPLY_LIST($scope.AddShiftSearch.SHIFT_BRANCH_ID);
        }
        else if (flag == 2) {
            $scope.AddShiftSearch.BUSINESS_DATE = $filter('date')(new Date($scope.EMPLOYEE_SHIFTS_DATES[index].DATE));
            if (shift != undefined) {
                $scope.SELECTED_SHIFT_TEMPLATE_Fn(shift);
            }
            else {
                $scope.AddShiftSearch.SHIFT_COUNT = 1;
            }
            if ($scope.AddShiftSearch.SHIFT_BRANCH_ID != employee.PRIMARY_BRANCH_ID) {
                $scope.SELECTED_BRANCH_Fn($scope.SCHEDULE_BRANCH_LIST.find(x => x.BRANCH_ID == employee.PRIMARY_BRANCH_ID), false, employee.EMPLOYEE_ID);
                //$scope.AddShiftSearch.SHIFT_BRANCH_ID = $scope.ShiftEmpSearch.BRANCH_ID;
                //$scope.AddShiftSearch.EMPLY_BRANCH_ID = $scope.ShiftEmpSearch.BRANCH_ID;
                //$scope.AddShiftSearch.CUSTOM_BRANCH_NAME = $scope.ShiftEmpSearch.CUSTOM_BRANCH_NAME;
                //$scope.HRM_SCHDL_GET_SHIFT_EMPLY_LIST($scope.AddShiftSearch.SHIFT_BRANCH_ID, employee.EMPLOYEE_ID);
            }
            else {
                $scope.EMPLOYEE_LIST.map(function (employee) { employee.IS_EMPLOYEE_SELECTED = false; });
                let empIndex = $scope.EMPLOYEE_LIST.findIndex(x => x.EMPLY_PRSNL_ID == employee.EMPLOYEE_ID);
                if (empIndex >= 0) {
                    $scope.EMPLOYEE_LIST[empIndex].IS_EMPLOYEE_SELECTED = true;
                    var department = $scope.DEPARTMENTS_LIST.filter(x => x.DEPARTMENT_ID == $scope.EMPLOYEE_LIST[empIndex].DEPARTMENT_ID)[0];
                    $scope.SELECTED_DEPARTMENT_Fn(department);
                    var position = $scope.POSITIONS_LIST.filter(x => x.POSITION_ID == $scope.EMPLOYEE_LIST[empIndex].POSITION_ID)[0];
                    $scope.SELECTED_POSITION_Fn(position);
                }
            }
        }
        else if (flag == 3) {
            $scope.AddShiftSearch.BUSINESS_DATE = $filter('date')(new Date($scope.EMPLOYEE_SHIFTS_DATES[index].DATE));
            if (shift != undefined) {
                $scope.SELECTED_SHIFT_TEMPLATE_Fn(shift);
                $scope.DRAGGED_SHIFT = undefined;
                //if ($scope.AddShiftSearch.SHIFT_BRANCH_ID != $scope.ShiftEmpSearch.BRANCH_ID) {
                //    $scope.AddShiftSearch.SHIFT_BRANCH_ID = $scope.ShiftEmpSearch.BRANCH_ID;
                //    $scope.AddShiftSearch.EMPLY_BRANCH_ID = $scope.ShiftEmpSearch.BRANCH_ID;
                //    $scope.AddShiftSearch.CUSTOM_BRANCH_NAME = $scope.ShiftEmpSearch.CUSTOM_BRANCH_NAME;
                //    $scope.HRM_SCHDL_GET_SHIFT_EMPLY_LIST($scope.AddShiftSearch.SHIFT_BRANCH_ID, employee.EMPLOYEE_ID);
                //}
                //else

                {
                    $scope.EMPLOYEE_LIST.map(function (employee) { employee.IS_EMPLOYEE_SELECTED = false; });
                    let empIndex = $scope.EMPLOYEE_LIST.findIndex(x => x.EMPLY_PRSNL_ID == employee.EMPLOYEE_ID);
                    if (empIndex >= 0) {
                        $scope.EMPLOYEE_LIST[empIndex].IS_EMPLOYEE_SELECTED = true;
                        var department = $scope.DEPARTMENTS_LIST.filter(x => x.DEPARTMENT_ID == $scope.EMPLOYEE_LIST[empIndex].DEPARTMENT_ID)[0];
                        $scope.SELECTED_DEPARTMENT_Fn(department);
                        var position = $scope.POSITIONS_LIST.filter(x => x.POSITION_ID == $scope.EMPLOYEE_LIST[empIndex].POSITION_ID)[0];
                        $scope.SELECTED_POSITION_Fn(position);
                    }
                }
            }
            else {
                $scope.showpopup = false;
                $scope.$parent.ShowAlertBox("Error", "Please drag and drop shift to proceed");
            }
        }

        $(".dateinput").datepicker("setDate", $scope.AddShiftSearch.BUSINESS_DATE);
        //$scope.selected_employee_count = 0;

        //if (employee != undefined) {
        //    let matchEmployee = $scope.EMPLOYEE_SHIFTS_LIST.find(x => x.EMPLOYEE_ID == employee_id);
        //    if (matchEmployee != undefined && $scope.EMPLOYEE_LIST.length > 0) {
        //        let foundData = $scope.EMPLOYEE_LIST.find(x => x.EMPLY_PRSNL_ID == employee_id);
        //        if (foundData != undefined) {
        //            foundData.IS_EMPLOYEE_SELECTED = true;
        //        }
        //    }
        //}
        $scope.AddShiftForm.submitted = false;
        $scope.VIEW_MODE = false;
        $scope.APPROVE_MODE = false;
        //let startDate = $scope.addDays(new Date($scope.SCHEDULE_LIMITATION_START_DATE), -($scope.SCHEDULE_LIMITATION * 7));
        $scope.Fn_SHIFT_TAB_CLICK(2);


        //let endDate = $scope.addDays(new Date($scope.SCHEDULE_LIMITATION_END_DATE), $scope.SCHEDULE_LIMITATION * 7);
        //if (new Date($scope.END_DATE) > endDate) {
        //    $scope.$parent.ShowAlertBox("Warning", `Shift creation is limited to ${$scope.SCHEDULE_LIMITATION} weeks before or after the current week.`, 3000);
        if ($scope.showpopup) {
            $('#Add_Shift').modal('show');
        }

    }
    $scope.BULK_MANGAER_APPROVAL_Fn = function () {
        $location.path('Approve_manager_rota');
    }
    $scope.HRM_GET_SECTIONS = function () {
        $scope.SECTIONS_LIST = [];
        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_ID = $scope.AddShiftSearch.CUSTOMER_ID;
        CusModelObj.ENTITY_ID = null;
        CusModelObj.PAGE_NO = 0;
        CusModelObj.PAGE_SIZE = 100;
        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_GET_SECTIONS').then(function (data) {
            if (data.data != null && data.data.Table.length > 0) {
                $scope.SECTIONS_LIST = data.data.Table;
            }

        });
    };
    $scope.HRM_SCHDL_GET_SHIFT_HISTORY = function (SHIFT_ID) {
        var CusModelObj = new Object();
        CusModelObj.SCHDL_SHIFT_ID = SHIFT_ID;
        CusModelObj.ENTITY_ID = $scope.AddShiftSearch.ENTITY_ID;
        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_SCHDL_GET_SHIFT_HISTORY').then(function (data) {
            if (data.data != null && data.data.Table.length > 0) {
                $scope.SHIFT_HISTORY_LIST = data.data.Table;
            } else {
                $scope.SHIFT_HISTORY_LIST = [];
            }
        });
    };
    $scope.HRM_SCHDL_GET_VIEW_WAGE = function () {
        var CusModelObj = new Object();
        CusModelObj.EMPLY_PRSNL_ID = $scope.AddShiftSearch.EMPLOYEE_ID;
        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_SCHDL_GET_VIEW_WAGE').then(function (data) {
            if (data.data != null && data.data.Table.length > 0) {

            } else {

            }
        });
    };
    $scope.SELECTED_EMPLOYEE_Fn = function (employee) {
        if (employee) {
            employee.IS_EMPLOYEE_SELECTED = !employee.IS_EMPLOYEE_SELECTED;
        }
        $scope.UPDATE_TOTAL_DURATION_Fn($scope.AddShiftSearch.SCHEDULED_START, $scope.AddShiftSearch.SCHEDULED_END, 1);
    };
    $scope.SELECTED_SHIFT_SCHEDULE_BRANCH_Fn = function (branch) {
        $scope.AddShiftSearch.SHIFT_CUSTOM_BRANCH_NAME = branch.BRANCH_NAME;
        $scope.AddShiftSearch.SHIFT_BRANCH_ID = branch.BRANCH_ID;
        $scope.HIDE_COST = branch.SHOW_WAGE;
    };
    $scope.SELECTED_BRANCH_Fn = function (branch, editmode, employeeid) {
        if (branch == '') {
            $scope.AddShiftSearch.CUSTOM_BRANCH_NAME = $scope.AddShiftSearch.DD_DEFAULT_TEXT;
            $scope.AddShiftSearch.EMPLY_BRANCH_ID = '';
        } else {
            $scope.AddShiftSearch.CUSTOM_BRANCH_NAME = branch.BRANCH_NAME;
            //$scope.AddShiftSearch.SHIFT_BRANCH_ID = branch.BRANCH_ID;
            $scope.AddShiftSearch.EMPLY_BRANCH_ID = branch.BRANCH_ID;

            $scope.HRM_SCHDL_GET_SHIFT_EMPLY_LIST(branch.BRANCH_ID, employeeid);
        }
    };
    $scope.SELECTED_DEPARTMENT_Fn = function (department) {
        if (department == undefined || department == '') {
            $scope.AddShiftSearch.CUSTOM_DEPARTMENT_NAME = $scope.AddShiftSearch.DD_DEFAULT_TEXT;
            $scope.AddShiftSearch.DEPARTMENT_ID = '';
        } else {
            $scope.AddShiftSearch.CUSTOM_DEPARTMENT_NAME = department.DEPARTMENT_NAME;
            $scope.AddShiftSearch.DEPARTMENT_ID = department.DEPARTMENT_ID;
        }
    };
    $scope.SELECTED_POSITION_Fn = function (position) {
        if (position == undefined || position == '') {
            $scope.AddShiftSearch.CUSTOM_POSITION_NAME = $scope.AddShiftSearch.DD_DEFAULT_TEXT;
            $scope.AddShiftSearch.POSITION_ID = '';
        } else {
            $scope.AddShiftSearch.CUSTOM_POSITION_NAME = position.POSITION_NAME;
            $scope.AddShiftSearch.POSITION_ID = position.POSITION_ID;
        }
    };
    $scope.SELECTED_SECTION_Fn = function (section) {
        if (section == undefined || section == '') {
            $scope.AddShiftSearch.CUSTOM_SECTION_NAME = $scope.AddShiftSearch.DD_DEFAULT_TEXT;
            $scope.AddShiftSearch.SECTION_ID = '';
        } else {
            $scope.AddShiftSearch.CUSTOM_SECTION_NAME = section.SECTION_NAME;
            $scope.AddShiftSearch.SECTION_ID = section.SECTION_ID;
        }
    };
    $scope.SELECTED_SHIFT_TEMPLATE_Fn = function (shift) {
        if (shift == undefined || shift == '') {
            $scope.AddShiftSearch.CUSTOM_SHIFT_NAME = $scope.AddShiftSearch.DD_DEFAULT_TEXT;
            $scope.AddShiftSearch.SHIFT_MASTER_ID = '';
            $scope.AddShiftSearch.CUSTOM_WAGE_NAME = $scope.ShiftEmpSearch.DD_DEFAULT_TEXT;
            $scope.AddShiftSearch.WAGE_TYPE_ID = 0;
        } else {
            $scope.AddShiftSearch.CUSTOM_SHIFT_NAME = shift.SHIFT_NAME;
            $scope.AddShiftSearch.SHIFT_MASTER_ID = shift.SHIFT_MASTER_ID;

            $scope.AddShiftSearch.SHIFT_COUNT = shift.SHIFT_COUNT;
            $scope.AddShiftSearch.SCHEDULED_START = moment($scope.ConvertTimeToDate($scope.AddShiftSearch.BUSINESS_DATE, shift.START_TIME));
            $scope.AddShiftSearch.SCHEDULED_END = moment($scope.ConvertTimeToDate($scope.AddShiftSearch.BUSINESS_DATE, shift.END_TIME));
            $scope.UPDATE_TOTAL_DURATION_Fn($scope.AddShiftSearch.SCHEDULED_START, $scope.AddShiftSearch.SCHEDULED_END, 1);
            $scope.AddShiftSearch.SCHEDULED_PAID_BREAK = shift.PAID_BREAK;
            $scope.AddShiftSearch.SCHEDULED_UNPAID_BREAK = shift.UNPAID_BREAK;


            $scope.AddShiftSearch.IS_SPECIAL_WAGE = shift.IS_SPECIAL_WAGE;
            $scope.AddShiftSearch.WAGE = shift.WAGE;

            if (shift.WAGE_TYPE_ID == null || shift.WAGE_TYPE_ID == 0) {
                $scope.AddShiftSearch.CUSTOM_WAGE_NAME = $scope.ShiftEmpSearch.DD_DEFAULT_TEXT;
                $scope.AddShiftSearch.WAGE_TYPE_ID = 0;
                $scope.SETVALUE_WAGE(2);
            }
            else {
                $scope.AddShiftSearch.CUSTOM_WAGE_NAME = $scope.WAGES_LIST.filter(item => item.WAGE_TYPE_ID == shift.WAGE_TYPE_ID)[0].WAGE_NAME;
                $scope.AddShiftSearch.WAGE_TYPE_ID = shift.WAGE_TYPE_ID;
            }
        }
    };
    $scope.SETDATE_FN = function (SCHDL_START_DATE, SCHDL_END_DATE, BUSINESS_DATE) {
        //SCHDL_START_DATE = moment(SCHDL_START_DATE).set('date', moment(BUSINESS_DATE).date()).set('seconds', 00);
        // SCHDL_END_DATE = moment(SCHDL_END_DATE).set('date', moment(BUSINESS_DATE).date()).set('seconds', 00);
        SCHDL_START_DATE = moment(SCHDL_START_DATE).set('month', moment(BUSINESS_DATE).month()).set('date', moment(BUSINESS_DATE).date()).set('seconds', 00);
        SCHDL_END_DATE = moment(SCHDL_END_DATE).set('month', moment(BUSINESS_DATE).month()).set('date', moment(BUSINESS_DATE).date()).set('seconds', 00);


        if (!SCHDL_END_DATE.isAfter(SCHDL_START_DATE) || SCHDL_END_DATE.isSame(SCHDL_START_DATE)) {
            //SCHDL_END_DATE.set(SCHDL_END_DATE.getDate() + 1);
            SCHDL_END_DATE = moment(SCHDL_END_DATE).set('date', SCHDL_END_DATE.date() + 1);
        }
        $scope.AddShiftSearch.SCHEDULED_START = SCHDL_START_DATE;
        $scope.AddShiftSearch.SCHEDULED_END = SCHDL_END_DATE;
    }
    $scope.UPDATE_TOTAL_DURATION_Fn = function (SCHDL_START_DATE, SCHDL_END_DATE, FLAG, BREAK) {
        //Flag= 1 -if this is add shift popup or 2 - shift template popup or 3- Approved Clock or 4 for breaks or 5 for ClockInout
        if ((FLAG == 5 || (SCHDL_END_DATE != undefined && SCHDL_END_DATE != '')) && SCHDL_START_DATE != undefined && SCHDL_START_DATE != '') {
            if (FLAG == 1) {
                //  month = moment($scope.AddShiftForm.BUSINESS_DATE.$viewValue).month()+1; 

                //SCHDL_START_DATE = moment(SCHDL_START_DATE).set('date', moment($scope.AddShiftForm.BUSINESS_DATE.$viewValue).date()).set('seconds', 00);
                if ($scope.AddShiftForm.BUSINESS_DATE.$viewValue != '') {
                    SCHDL_START_DATE = moment(SCHDL_START_DATE).set('month', moment($scope.AddShiftForm.BUSINESS_DATE.$viewValue).month()).set('date', moment($scope.AddShiftForm.BUSINESS_DATE.$viewValue).date()).set('seconds', 00);
                    SCHDL_END_DATE = moment(SCHDL_END_DATE).set('month', moment($scope.AddShiftForm.BUSINESS_DATE.$viewValue).month()).set('date', moment($scope.AddShiftForm.BUSINESS_DATE.$viewValue).date()).set('seconds', 00);
                }
                else {
                    SCHDL_START_DATE = moment(SCHDL_START_DATE).set('date', moment($scope.AddShiftForm.BUSINESS_DATE.$viewValue).date()).set('seconds', 00);
                    SCHDL_END_DATE = moment(SCHDL_END_DATE).set('date', moment($scope.AddShiftForm.BUSINESS_DATE.$viewValue).date()).set('seconds', 00);
                }
                if (!SCHDL_END_DATE.isAfter(SCHDL_START_DATE) || SCHDL_END_DATE.isSame(SCHDL_START_DATE)) {
                    //SCHDL_END_DATE.set(SCHDL_END_DATE.getDate() + 1);
                    SCHDL_END_DATE = moment(SCHDL_END_DATE).set('date', SCHDL_END_DATE.date() + 1);
                }
                //else if (SCHDL_END_DATE.isSame(SCHDL_START_DATE)) {
                //    $scope.$parent.ShowAlertBox("Error", "Shift Timing cannot be same", 3000);
                //}$scope.$parent.MASTER_GET_CUSTOMER_SETTINGS_VALUES(61) 

                $scope.AddShiftSearch.SCHEDULED_START = SCHDL_START_DATE;
                $scope.AddShiftSearch.SCHEDULED_END = SCHDL_END_DATE;
                $scope.AddShiftSearch.TOTAL_SHIFT_LENGTH = $scope.calculateDuration(SCHDL_START_DATE, SCHDL_END_DATE, 'TIME');
                var empcount = $scope.EMPLOYEE_LIST.filter(item => item.IS_EMPLOYEE_SELECTED == true).length;
                $scope.AddShiftSearch.SCHEDULED_DURATION = $scope.AddShiftSearch.TOTAL_SHIFT_LENGTH - ($scope.AddShiftSearch.SUBTRACT_BREAK_61 ? ($scope.AddShiftSearch.SCHEDULED_UNPAID_BREAK == undefined || $scope.AddShiftSearch.SCHEDULED_UNPAID_BREAK == "" ? 0 : $scope.AddShiftSearch.SCHEDULED_UNPAID_BREAK) : 0);
            }
            else if (FLAG == 2) {
                //SCHDL_START_DATE = moment(SCHDL_START_DATE).set('seconds', 00);
                //SCHDL_END_DATE = moment(SCHDL_END_DATE).set('seconds', 00);
                ////if (!SCHDL_END_DATE.isAfter(SCHDL_START_DATE) || SCHDL_END_DATE.isSame(SCHDL_START_DATE)) {
                ////    //SCHDL_END_DATE.set(SCHDL_END_DATE.getDate() + 1);
                ////    SCHDL_END_DATE = moment(SCHDL_END_DATE).set('date', SCHDL_END_DATE.date() + 1);
                ////}
                SCHDL_START_DATE = moment(SCHDL_START_DATE).set('date', moment($scope.CURRENT_DATE.$viewValue).date()).set('seconds', 00);
                SCHDL_END_DATE = moment(SCHDL_END_DATE).set('date', moment($scope.CURRENT_DATE.$viewValue).date()).set('seconds', 00);
                if (!SCHDL_END_DATE.isAfter(SCHDL_START_DATE) || SCHDL_END_DATE.isSame(SCHDL_START_DATE)) {
                    //SCHDL_END_DATE.set(SCHDL_END_DATE.getDate() + 1);
                    SCHDL_END_DATE = moment(SCHDL_END_DATE).set('date', SCHDL_END_DATE.date() + 1);
                }
                $scope.ShiftEmpSearch.START_TIME = SCHDL_START_DATE;
                $scope.ShiftEmpSearch.END_TIME = SCHDL_END_DATE;

                $scope.ShiftEmpSearch.SHIFT_DURATION = $scope.calculateDuration(SCHDL_START_DATE, SCHDL_END_DATE, 'HOURS');
                $scope.ShiftEmpSearch.SCHEDULED_DURATION = $scope.calculateDuration(SCHDL_START_DATE, SCHDL_END_DATE, 'TIME');
            }
            else if (FLAG == 3) {
                //SCHDL_START_DATE = moment(SCHDL_START_DATE).set('seconds', 00);
                //// if (SCHDL_END_DATE)
                //SCHDL_END_DATE = moment(SCHDL_END_DATE).set('seconds', 00);


                if (!$scope.USE_CLOCKIN && !$scope.USE_SCHEDULED) {

                    if ($scope.AddShiftForm.BUSINESS_DATE.$viewValue != '') {
                        SCHDL_START_DATE = moment(SCHDL_START_DATE).set('month', moment($scope.AddShiftForm.BUSINESS_DATE.$viewValue).month()).set('date', moment($scope.AddShiftForm.BUSINESS_DATE.$viewValue).date()).set('seconds', 00);
                        SCHDL_END_DATE = moment(SCHDL_END_DATE).set('month', moment($scope.AddShiftForm.BUSINESS_DATE.$viewValue).month()).set('date', moment($scope.AddShiftForm.BUSINESS_DATE.$viewValue).date()).set('seconds', 00);
                    }
                    else {
                        SCHDL_START_DATE = moment(SCHDL_START_DATE).set('date', moment($scope.AddShiftForm.BUSINESS_DATE.$viewValue).date()).set('seconds', 00);
                        SCHDL_END_DATE = moment(SCHDL_END_DATE).set('date', moment($scope.AddShiftForm.BUSINESS_DATE.$viewValue).date()).set('seconds', 00);
                    }

                    if (!SCHDL_END_DATE.isAfter(SCHDL_START_DATE) || SCHDL_END_DATE.isSame(SCHDL_START_DATE)) {
                        SCHDL_END_DATE = moment(SCHDL_END_DATE).set('date', SCHDL_END_DATE.date() + 1);
                    }
                }
                else {
                    SCHDL_START_DATE = moment(SCHDL_START_DATE).set('seconds', 00);
                    SCHDL_END_DATE = moment(SCHDL_END_DATE).set('seconds', 00);
                }
                $scope.AddShiftSearch.APPROVED_CLOCK_IN = SCHDL_START_DATE;
                $scope.AddShiftSearch.APPROVED_CLOCK_OUT = SCHDL_END_DATE;
                $scope.AddShiftSearch.TOTAL_APPROVED_CLOCK_HOURS = $scope.calculateDuration(SCHDL_START_DATE, SCHDL_END_DATE, 'HOURS');
                $scope.AddShiftSearch.TOTAL_APPROVED_CLOCK_MINUTES = $scope.calculateDuration(SCHDL_START_DATE, SCHDL_END_DATE, 'TIME');
            }
            else if (FLAG == 4) {
                SCHDL_START_DATE = moment(SCHDL_START_DATE).set('month', moment($scope.AddShiftForm.BUSINESS_DATE.$viewValue).month()).set('date', moment($scope.AddShiftForm.BUSINESS_DATE.$viewValue).date()).set('seconds', 00);
                SCHDL_END_DATE = moment(SCHDL_END_DATE).set('month', moment($scope.AddShiftForm.BUSINESS_DATE.$viewValue).month()).set('date', moment($scope.AddShiftForm.BUSINESS_DATE.$viewValue).date()).set('seconds', 00);
                if (!SCHDL_END_DATE.isAfter(SCHDL_START_DATE) && !SCHDL_END_DATE.isSame(SCHDL_START_DATE)) {
                    //SCHDL_END_DATE.set(SCHDL_END_DATE.getDate() + 1);
                    SCHDL_END_DATE = moment(SCHDL_END_DATE).set('date', SCHDL_END_DATE.date() + 1);
                }
                BREAK.BREAK_IN = SCHDL_START_DATE;
                BREAK.BREAK_OUT = SCHDL_END_DATE;

                BREAK.DURATION = $scope.calculateDuration(SCHDL_START_DATE, SCHDL_END_DATE, 'TIME');
            }
            else if (FLAG == 5) {
                if ($scope.AddShiftForm.BUSINESS_DATE.$viewValue != '') {
                    SCHDL_START_DATE = moment(SCHDL_START_DATE).set('month', moment($scope.AddShiftForm.BUSINESS_DATE.$viewValue).month()).set('date', moment($scope.AddShiftForm.BUSINESS_DATE.$viewValue).date()).set('seconds', 00);
                }
                else {
                    SCHDL_START_DATE = moment(SCHDL_START_DATE).set('date', moment($scope.AddShiftForm.BUSINESS_DATE.$viewValue).date()).set('seconds', 00);
                }
                if (SCHDL_END_DATE != undefined) {

                    if ($scope.AddShiftForm.BUSINESS_DATE.$viewValue != '') {
                        SCHDL_END_DATE = moment(SCHDL_END_DATE).set('month', moment($scope.AddShiftForm.BUSINESS_DATE.$viewValue).month()).set('date', moment($scope.AddShiftForm.BUSINESS_DATE.$viewValue).date()).set('seconds', 00);
                    }
                    else {
                        SCHDL_END_DATE = moment(SCHDL_END_DATE).set('date', moment($scope.AddShiftForm.BUSINESS_DATE.$viewValue).date()).set('seconds', 00);
                    }
                    if (!SCHDL_END_DATE.isAfter(SCHDL_START_DATE) && !SCHDL_END_DATE.isSame(SCHDL_START_DATE)) {
                        //SCHDL_END_DATE.set(SCHDL_END_DATE.getDate() + 1);
                        SCHDL_END_DATE = moment(SCHDL_END_DATE).set('date', SCHDL_END_DATE.date() + 1);
                    }
                    $scope.AddShiftSearch.CLOCK_IN = SCHDL_START_DATE;
                    $scope.AddShiftSearch.CLOCK_OUT = !SCHDL_END_DATE._isValid ? "" : SCHDL_END_DATE;
                    if (SCHDL_END_DATE._isValid) {
                        $scope.AddShiftSearch.CLOCK_IN_SHIFT_DURATION = $scope.calculateDuration(SCHDL_START_DATE, SCHDL_END_DATE, 'HOURS');
                    }

                }
                else {
                    $scope.AddShiftSearch.CLOCK_IN = SCHDL_START_DATE;
                }

            }

        }
    };

    $scope.SELECTED_ADD_SHIFT_WAGE_Fn = function (wage) {
        if (wage == '') {
            $scope.AddShiftSearch.CUSTOM_WAGE_NAME = $scope.AddShiftSearch.DD_DEFAULT_TEXT;
            $scope.AddShiftSearch.WAGE_TYPE_ID = '';
        } else {
            $scope.AddShiftSearch.CUSTOM_WAGE_NAME = wage.WAGE_NAME;
            $scope.AddShiftSearch.WAGE_TYPE_ID = wage.WAGE_TYPE_ID;
        }
    };
    $scope.SELECTED_CLOCK_Fn = function (clock) {
        if (clock == '') {
            $scope.AddShiftSearch.CUSTOM_CLOCK_NAME = $scope.AddShiftSearch.DD_DEFAULT_TEXT;
            $scope.AddShiftSearch.CLOCK_ID = '';
        } else {
            $scope.AddShiftSearch.CUSTOM_CLOCK_NAME = clock.CLOCK_NAME;
            $scope.AddShiftSearch.CLOCK_ID = clock.CLOCK_ID;
        }
    };

    $scope.HRM_SCHDL_GET_WAGE_COST = function (flag) {
        var _shiftcnt = $scope.AddShiftSearch.SHIFT_COUNT;
        if (_shiftcnt == undefined || _shiftcnt == null || _shiftcnt == '' || _shiftcnt == '.') {
            $scope.$parent.ShowAlertBox("Error", "Please enter shift count.", 3000);
            return;
        }
        else if (parseFloat(_shiftcnt) < 0.1 || parseFloat(_shiftcnt) > 3) {
            $scope.$parent.ShowAlertBox("Error", "Shift Count must be between 0.1 and 3.", 3000);
            return;
        }
        //if (_shiftcnt.indexOf(".") != -1) {
        //    $scope.$parent.ShowAlertBox("Error", "Please enter whole number.", 3000);
        //    return;
        //}
        if ($scope.AddShiftSearch.TOTAL_SHIFT_LENGTH <= (parseInt($scope.AddShiftSearch.SCHEDULED_UNPAID_BREAK) + parseInt($scope.AddShiftSearch.SCHEDULED_PAID_BREAK))) {
            $scope.$parent.ShowAlertBox("Error", "Break cannot be more than or equal to shift length.", 3000);
            return;
        }
        if ($scope.EMPLOYEE_LIST != null && $scope.EMPLOYEE_LIST.length > 0) {
            $scope.ANY_SELECTED_EMPLOYEE = $scope.EMPLOYEE_LIST.filter(item => item.IS_EMPLOYEE_SELECTED == true).length > 0 ? false : true;
        } else {
            $scope.ANY_SELECTED_EMPLOYEE = true;
        }
        $scope.AddShiftForm.submitted = true;
        if ($scope.AddShiftSearch.LOGIN_EMPLOYEE_ID == 0) {
            const message = "Please log in with an employee account; super admin may cause errors.";

            $scope.$parent.ShowAlertBox("Warning", message, 3000);
        }
        else if ((flag == 2 || $scope.AddShiftForm.$valid) && !$scope.ANY_SELECTED_EMPLOYEE) {
            $scope.IS_COST_FETCHING = true;
            var ShiftObj = new Object();
            ShiftObj.TABLE_ID_LIST = [];

            angular.forEach($scope.EMPLOYEE_LIST, function (item) {
                if (item.IS_EMPLOYEE_SELECTED == true) {
                    var readOnly = new Object();
                    readOnly.TABLE_ID = item.EMPLY_PRSNL_ID;
                    ShiftObj.TABLE_ID_LIST.push(readOnly);
                }
            });

            ShiftObj.BUSINESS_DATE = $scope.AddShiftSearch.BUSINESS_DATE;
            ShiftObj.SHIFT_COUNT = $scope.AddShiftSearch.SHIFT_COUNT;
            ShiftObj.SCHEDULED_START = $scope.$parent.HRM_CHANGE_TIME_ZONE_Fn(new Date($scope.AddShiftSearch.SCHEDULED_START));
            ShiftObj.SCHEDULED_END = $scope.$parent.HRM_CHANGE_TIME_ZONE_Fn(new Date($scope.AddShiftSearch.SCHEDULED_END));
            ShiftObj.SCHEDULED_PAID_BREAK = $scope.AddShiftSearch.SCHEDULED_PAID_BREAK;
            ShiftObj.SCHEDULED_UNPAID_BREAK = $scope.AddShiftSearch.SCHEDULED_UNPAID_BREAK;
            ShiftObj.IS_SPECIAL_WAGE = $scope.AddShiftSearch.IS_SPECIAL_WAGE;
            ShiftObj.WAGE = $scope.AddShiftSearch.WAGE;
            ShiftObj.WAGE_TYPE_ID = $scope.AddShiftSearch.WAGE_TYPE_ID;
            ShiftObj.SUBTRACT_BREAK_61 = $scope.$parent.MASTER_GET_CUSTOMER_SETTINGS_VALUES(61) == "1" ? true : false;
            ShiftObj.EXCLUDE_HOLIDAY_ACCRUAL_87 = $scope.$parent.MASTER_GET_CUSTOMER_SETTINGS_VALUES(87) == "1" ? true : false;;
            ShiftObj.YEAR_START_89 = $scope.$parent.MASTER_GET_CUSTOMER_SETTINGS_VALUES(89);
            ShiftObj.SCHEDULE_START = ShiftObj.BUSINESS_DATE;
            ShiftObj.SCHEDULE_END = ShiftObj.SCHEDULED_END;



            PrcCommMethods.HUMANRESOURCE_API(ShiftObj, 'HRM_SCHDL_GET_WAGE_COST').then(function (data) {
                if (data.data != null && data.data.Table.length > 0) {
                    $scope.AddShiftSearch.WAGE_COST = data.data.Table[0].COST;

                }
                $scope.IS_COST_FETCHING = false;
            });
        }
    };
    $scope.HRM_SCHDL_GET_SHIFT_BY_ID = function (shiftId) {
        $scope.HRM_SCHDL_GET_SHIFT_HISTORY(shiftId);
        var ShiftObj = new Object();
        ShiftObj.SCHDL_SHIFT_ID = shiftId;
        ShiftObj.CUSTOMER_ID = $scope.MasterData.CUSTOMER_ID;
        ShiftObj.ENTITY_ID = $scope.MasterData.ENTITY_ID;
        PrcCommMethods.HUMANRESOURCE_API(ShiftObj, 'HRM_SCHDL_GET_SHIFT_BY_ID').then(function (data) {

            if (data.data != null && data.data.Table.length > 0) {
                var resultObject = data.data.Table[0];

                $scope.DEPARTMENTS_LIST = $scope.ALL_DEPARTMENTS_LIST.filter(x => x.BRANCH_ID == resultObject.BRANCH_ID);
                $scope.POSITIONS_LIST = $scope.ALL_POSITIONS_LIST.filter(x => x.BRANCH_ID == resultObject.BRANCH_ID);

                $scope.AddShiftSearch.SUBTRACT_BREAK_61 = resultObject.SUBTRACT_BREAK_61;
                $scope.SELECTED_SHIFT_SCHEDULE_BRANCH_Fn($scope.SCHEDULE_BRANCH_LIST.find(x => x.BRANCH_ID == resultObject.BRANCH_ID));
                $scope.SELECTED_BRANCH_Fn($scope.SCHEDULE_BRANCH_LIST.find(x => x.BRANCH_ID == resultObject.EMPLY_BRANCH_ID), true, resultObject.EMPLY_PRSNL_ID);
                $scope.SELECTED_SECTION_Fn($scope.SECTIONS_LIST.find(x => x.SECTION_ID == resultObject.SECTION_ID));
                $scope.SELECTED_DEPARTMENT_Fn($scope.DEPARTMENTS_LIST.find(x => x.DEPARTMENT_ID == resultObject.DEPARTMENT_ID));
                $scope.SELECTED_POSITION_Fn($scope.POSITIONS_LIST.find(x => x.POSITION_ID == resultObject.POSITION_ID));
                $scope.SELECTED_SHIFT_TEMPLATE_Fn($scope.SHIFT_SCHDL_PIN_LIST.find(x => x.SHIFT_MASTER_ID == resultObject.SHIFT_MASTER_ID));
                $scope.SELECTED_WAGE_Fn($scope.WAGES_LIST.find(x => x.WAGE_TYPE_ID == resultObject.WAGE_TYPE_ID), 1);
                //  $scope.EMPLOYEE_LIST.filter(x => x.EMPLY_PRSNL_ID == resultObject.EMPLY_PRSNL_ID)[0].IS_EMPLOYEE_SELECTED = true;
                $scope.AddShiftSearch.SCHDL_SHIFT_ID = resultObject.SCHDL_SHIFT_ID;
                $scope.AddShiftSearch.SHIFT_COUNT = resultObject.SHIFT_COUNT;
                $scope.AddShiftSearch.SCHEDULED_PAID_BREAK = resultObject.SCHEDULED_PAID_BREAK;
                $scope.AddShiftSearch.SCHEDULED_UNPAID_BREAK = resultObject.SCHEDULED_UNPAID_BREAK;
                $scope.AddShiftSearch.SCHEDULED_DURATION = resultObject.SCHEDULED_DURATION;
                $scope.AddShiftSearch.SHIFT_BRANCH_ID = resultObject.BRANCH_ID;
                $scope.AddShiftSearch.CUSTOM_BRANCH_NAME = resultObject.BRANCH_NAME;
                $scope.AddShiftSearch.EMPLY_BRANCH_ID = resultObject.EMPLY_BRANCH_ID;
                $scope.AddShiftSearch.EMPLOYEE_ID = resultObject.EMPLY_PRSNL_ID;
                $scope.AddShiftSearch.CUSTOM_EMPLOYEE_NAME = resultObject.EMPLOYEE_NAME;

                $scope.AddShiftSearch.APPROVED_SHIFT_DURATION = resultObject.APPROVED_SHIFT_DURATION;
                $scope.AddShiftSearch.IS_SPECIAL_WAGE = resultObject.IS_SPECIAL_WAGE;
                $scope.AddShiftSearch.WAGE = resultObject.SPECIAL_WAGE;

                //  let _branch = $scope.SCHEDULE_BRANCH_LIST.find(x => x.BRANCH_ID == resultObject.EMPLY_BRANCH_ID);

                //$scope.AddShiftSearch.POSITION_ID = resultObject.POSITION_ID;
                //$scope.AddShiftSearch.CUSTOM_POSITION_NAME = resultObject.POSITION_NAME;
                //$scope.AddShiftSearch.DEPARTMENT_ID = resultObject.DEPARTMENT_ID;
                //$scope.AddShiftSearch.CUSTOM_DEPARTMENT_NAME = resultObject.DEPARTMENT_NAME;
                //$scope.AddShiftSearch.SECTION_ID = resultObject.SECTION_ID;
                //$scope.AddShiftSearch.CUSTOM_SECTION_NAME = resultObject.SECTION_NAME;



                //$scope.AddShiftSearch.SHIFT_MASTER_ID = resultObject.SHIFT_MASTER_ID;
                //$scope.AddShiftSearch.CUSTOM_SHIFT_NAME = resultObject.SHIFT_NAME;
                $scope.AddShiftSearch.STATUS_ID = resultObject.STATUS_ID;


                // delete pop up
                $scope.SHOW_START_DATE = new Date(resultObject.SCHEDULED_START);
                $scope.SHOW_END_DATE = new Date(resultObject.SCHEDULED_END);
                $scope.SHIFT_DATE = new Date(resultObject.BUSINESS_DATE);

                $scope.AddShiftSearch.BUSINESS_DATE = $filter('date')(new Date(resultObject.BUSINESS_DATE));
                //   $scope.AddShiftSearch.SCHEDULED_START = moment(new Date(resultObject.SCHEDULED_START));
                //   $scope.AddShiftSearch.SCHEDULED_END = moment(new Date(resultObject.SCHEDULED_END));
                $scope.AddShiftSearch.START_TIME = new Date(resultObject.SCHEDULED_START);
                $scope.AddShiftSearch.END_TIME = new Date(resultObject.SCHEDULED_END);
                $scope.UPDATE_TOTAL_DURATION_Fn(moment(new Date(resultObject.SCHEDULED_START)), moment(new Date(resultObject.SCHEDULED_END)), 1);
                $scope.UPDATE_TOTAL_DURATION_Fn(resultObject.CLOCK_IN, resultObject.CLOCK_OUT, 5);
                $scope.UPDATE_TOTAL_DURATION_Fn(resultObject.APPROVED_CLOCK_IN, resultObject.APPROVED_CLOCK_OUT, 3);
                $scope.USE_CLOCKIN = false;
                $scope.USE_SCHEDULED = false;
                $scope.AddShiftSearch.CLOCK_IN_IMAGE_PATH = resultObject.CLOCK_IN_IMAGE_PATH;
                $scope.AddShiftSearch.CLOCK_OUT_IMAGE_PATH = resultObject.CLOCK_OUT_IMAGE_PATH;
                var SCHEDULED_COST = resultObject.SCHEDULED_COST == null ? 0 : resultObject.SCHEDULED_COST;
                var SCHEDULED_HOLIDAY_ACCRUAL_COST = resultObject.SCHEDULED_HOLIDAY_ACCRUAL_COST == null ? 0 : resultObject.SCHEDULED_HOLIDAY_ACCRUAL_COST;
                var SCHEDULED_NIC = resultObject.SCHEDULED_NIC == null ? 0 : resultObject.SCHEDULED_NIC;
                var SCHEDULED_PENSION = resultObject.SCHEDULED_PENSION == null ? 0 : resultObject.SCHEDULED_PENSION;
                $scope.AddShiftSearch.WAGE_COST = SCHEDULED_COST + SCHEDULED_HOLIDAY_ACCRUAL_COST + SCHEDULED_NIC + SCHEDULED_PENSION;

                var APPROVED_COST = resultObject.APPROVED_COST == null ? 0 : resultObject.APPROVED_COST;
                var APPROVED_HOLIDAY_ACCRUAL_COST = resultObject.APPROVED_HOLIDAY_ACCRUAL_COST == null ? 0 : resultObject.APPROVED_HOLIDAY_ACCRUAL_COST;
                var APPROVED_NIC = resultObject.APPROVED_NIC == null ? 0 : resultObject.APPROVED_NIC;
                var APPROVED_PENSION = resultObject.APPROVED_PENSION == null ? 0 : resultObject.APPROVED_PENSION;
                $scope.AddShiftSearch.APPROVED_WAGE_COST = APPROVED_COST + APPROVED_HOLIDAY_ACCRUAL_COST + APPROVED_NIC + APPROVED_PENSION;
                //let currentDate = new Date($scope.CURRENT_DATE);
                //if (new Date(resultObject.SCHEDULED_END) <= new Date($scope.CURRENT_DATE)) {
                //    $scope.PREVIOUS_DATE_SHIFT = true;
                //} else {
                //    $scope.PREVIOUS_DATE_SHIFT = false;
                //}
                // for enable view and update


                if ($scope.EDIT_MODE) {
                    $scope.SHOW_REFRESH_WAGE = true;
                    switch ($scope.AddShiftSearch.STATUS_ID) {
                        case 91:
                            $scope.ENABLE_UPDATE_BUTTON = true;
                            $scope.Fn_SHIFT_TAB_CLICK(2);
                            break;
                        case 92:
                            $scope.ENABLE_UPDATE_BUTTON = true;
                            $scope.Fn_SHIFT_TAB_CLICK(2);
                            break;
                        case 93:
                            $scope.ENABLE_UPDATE_BUTTON = false;
                            $scope.ENABLE_APPROVE_BUTTON = false;
                            $scope.Fn_SHIFT_TAB_CLICK(1);
                            $scope.VIEW_MODE = true;
                            break;
                        default:
                            $scope.ENABLE_UPDATE_BUTTON = true;
                            $scope.Fn_SHIFT_TAB_CLICK(2);
                    }
                }
                else if ($scope.APPROVE_MODE) {
                    $scope.SHOW_REFRESH_WAGE = false;
                    $scope.ENABLE_UPDATE_BUTTON = false;
                    $scope.ENABLE_APPROVE_BUTTON = true;

                    $scope.Fn_SHIFT_TAB_CLICK(1);
                    if (resultObject.USE_SCHEDULE_AS_ACTUAL == 1) {
                        $scope.USE_SCHEDULED = true;
                        $scope.SETVALUE_USE_AS(1);
                    }
                    $scope.VIEW_MODE = true;
                    $scope.SHOW_REFRESH_WAGE = false;
                }
                else if ($scope.VIEW_MODE) {
                    $scope.SHOW_REFRESH_WAGE = false;
                    if ($scope.AddShiftSearch.STATUS_ID == 93) {
                        $scope.ENABLE_UPDATE_BUTTON = false;
                        $scope.ENABLE_APPROVE_BUTTON = false;
                        $scope.Fn_SHIFT_TAB_CLICK(1);
                    } else {
                        $scope.ENABLE_UPDATE_BUTTON = false;
                        $scope.ENABLE_APPROVE_BUTTON = false;
                        $scope.Fn_SHIFT_TAB_CLICK(4);
                    }

                }
                else if ($scope.CLOCKINOUT) {
                    $scope.CLOCKINOUT = false;
                    if (moment(moment(resultObject.SCHEDULED_END).format('LL')).isSameOrBefore(moment(moment($scope.CURRENT_DATE).format('LL')))) {
                        $('#divClockInOut').modal('show');
                    }
                    else {
                        $scope.$parent.ShowAlertBox("Error", 'You cannot do Clock In/Out for future date.', 3000);
                    }
                }
                $scope.GET_EMPLOYEE_SHORT_NAME_Fn();
            }
            //if (data.data.Table1.length > 0) {
            //    $scope.AddShiftSearch.NOTE = data.data.Table1[0].NOTE;
            //}

            if (data.data.Table1.length > 0) {
                $scope.COMMUNICATION_LIST = data.data.Table1;
            } else {
                $scope.COMMUNICATION_LIST = [];
            }
            if (data.data.Table2.length > 0) {
                $scope.BREAK_IN_LIST = data.data.Table2;
            } else {
                $scope.BREAK_IN_LIST = [];
            }
            //$scope.HRM_SCHDL_GET_WAGE_COST(2);
        });
    };
    $scope.HRM_SCHDL_INS_SHIFTS = function (MARK_UNAVAILABLE_FLAG) {

        //if (_shiftcnt.indexOf(".") != -1) {
        //    $scope.$parent.ShowAlertBox("Error", "Please enter whole number.", 3000);
        //    return;
        //}
        if ($scope.AddShiftSearch.SHIFT_BRANCH_ID == 0) {

        }
        if ($scope.AddShiftSearch.TOTAL_SHIFT_LENGTH <= (parseInt($scope.AddShiftSearch.SCHEDULED_UNPAID_BREAK) + parseInt($scope.AddShiftSearch.SCHEDULED_PAID_BREAK))) {
            $scope.$parent.ShowAlertBox("Error", "Break cannot be more than or equal to shift length.", 3000);
            return;
        }
        if ($scope.EMPLOYEE_LIST != null && $scope.EMPLOYEE_LIST.length > 0) {
            $scope.ANY_SELECTED_EMPLOYEE = $scope.EMPLOYEE_LIST.filter(item => item.IS_EMPLOYEE_SELECTED == true).length > 0 ? false : true;
        } else {
            $scope.ANY_SELECTED_EMPLOYEE = true;
        }
        $scope.AddShiftForm.submitted = true;
        var _shiftcnt = $scope.AddShiftSearch.SHIFT_COUNT;
        if (_shiftcnt == undefined || _shiftcnt == null || _shiftcnt == '' || _shiftcnt == '.') {
            $scope.$parent.ShowAlertBox("Error", "Please enter shift count.", 3000);
            return;
        }
        else if (parseFloat(_shiftcnt) < 0.1 || parseFloat(_shiftcnt) > 3) {
            $scope.$parent.ShowAlertBox("Error", "Shift Count must be between 0.1 and 3.", 3000);
            return;
        }
        if ($scope.AddShiftSearch.LOGIN_EMPLOYEE_ID == 0) {
            const message = "Please log in with an employee account; super admin may cause errors.";

            $scope.$parent.ShowAlertBox("Warning", message, 3000);
        }
        else if ($scope.AddShiftForm.$valid && !$scope.ANY_SELECTED_EMPLOYEE) {
            var ShiftObj = new Object();
            // for Employee Dropdowm
            ShiftObj.TABLE_ID_LIST = [];

            angular.forEach($scope.EMPLOYEE_LIST, function (item) {
                if (item.IS_EMPLOYEE_SELECTED) {
                    var readOnly = new Object();
                    readOnly.TABLE_ID = item.EMPLY_PRSNL_ID;
                    ShiftObj.TABLE_ID_LIST.push(readOnly);
                }
            });
            ShiftObj.BUSINESS_DATE = $scope.$parent.HRM_CHANGE_TIME_ZONE_Fn(new Date($scope.AddShiftForm.BUSINESS_DATE.$viewValue));
            ShiftObj.ENTITY_ID = $scope.MasterData.ENTITY_ID;
            ShiftObj.BRANCH_ID = $scope.AddShiftSearch.SHIFT_BRANCH_ID;
            ShiftObj.POSITION_ID = $scope.AddShiftSearch.POSITION_ID;
            ShiftObj.DEPARTMENT_ID = $scope.AddShiftSearch.DEPARTMENT_ID;
            ShiftObj.SECTION_ID = $scope.AddShiftSearch.SECTION_ID;
            ShiftObj.NOTE = $scope.AddShiftSearch.NOTE;
            ShiftObj.SHIFT_COUNT = $scope.AddShiftSearch.SHIFT_COUNT;
            ShiftObj.SCHEDULED_PAID_BREAK = $scope.AddShiftSearch.SCHEDULED_PAID_BREAK;
            ShiftObj.SCHEDULED_UNPAID_BREAK = $scope.AddShiftSearch.SCHEDULED_UNPAID_BREAK;
            ShiftObj.SHIFT_MASTER_ID = $scope.AddShiftSearch.SHIFT_MASTER_ID == "" ? null : $scope.AddShiftSearch.SHIFT_MASTER_ID;
            $scope.SETDATE_FN($scope.AddShiftSearch.SCHEDULED_START, $scope.AddShiftSearch.SCHEDULED_END, $scope.AddShiftForm.BUSINESS_DATE.$viewValue);
            ShiftObj.SCHEDULED_START = $scope.$parent.HRM_CHANGE_TIME_ZONE_Fn(new Date($scope.AddShiftSearch.SCHEDULED_START));
            ShiftObj.SCHEDULED_END = $scope.$parent.HRM_CHANGE_TIME_ZONE_Fn(new Date($scope.AddShiftSearch.SCHEDULED_END));

            ShiftObj.USER_ID = $scope.AddShiftSearch.USER_ID;
            ShiftObj.EMPLY_BRANCH_ID = $scope.AddShiftSearch.EMPLY_BRANCH_ID;
            ShiftObj.MARK_UNAVAILABLE = MARK_UNAVAILABLE_FLAG;
            ShiftObj.IS_SPECIAL_WAGE = $scope.AddShiftSearch.IS_SPECIAL_WAGE;
            ShiftObj.WAGE = $scope.AddShiftSearch.WAGE;
            ShiftObj.WAGE_TYPE_ID = $scope.AddShiftSearch.WAGE_TYPE_ID;
            ShiftObj.SCHEDULED_DURATION = $scope.AddShiftSearch.SCHEDULED_DURATION;
            ShiftObj.TOTAL_SHIFT_LENGTH = $scope.AddShiftSearch.TOTAL_SHIFT_LENGTH;
            ShiftObj.TOTAL_COST = 0;//$scope.AddShiftSearch.TOTAL_COST;
            ShiftObj.SUBTRACT_BREAK_61 = $scope.$parent.MASTER_GET_CUSTOMER_SETTINGS_VALUES(61) == "1" ? true : false;
            ShiftObj.EXCLUDE_HOLIDAY_ACCRUAL_87 = $scope.$parent.MASTER_GET_CUSTOMER_SETTINGS_VALUES(87) == "1" ? true : false;;
            ShiftObj.YEAR_START_89 = $scope.$parent.MASTER_GET_CUSTOMER_SETTINGS_VALUES(89);
            ShiftObj.SCHEDULE_START = new Date($scope.EMPLOYEE_SHIFTS_DATES[0].DATE);
            ShiftObj.SCHEDULE_END = new Date($scope.EMPLOYEE_SHIFTS_DATES[6].DATE);

            PrcCommMethods.HUMANRESOURCE_API(ShiftObj, 'HRM_SCHDL_INS_SHIFTS').then(function (data) {
                if (data.data == null || data.data == 0) {
                    $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                }
                if (data.data.Table.length > 0) {
                    $scope.OVERLAP_EMP_LIST = data.data.Table;
                    $('#overlap_employee_POPUP').modal('show');
                    $('#Add_Shift').modal('hide');
                    $scope.$parent.ShowAlertBox("Error", "Shift Overlapping, please correct shift timings", 3000);
                }
                else if (data.data.Table.length == 0) {
                    $scope.$parent.ShowAlertBox("Success", 'Record saved successfully', 3000);
                    $scope.RESET_Fn();
                    $scope.HRM_GET_SCHDLS();
                    $('#Add_Shift').modal('hide');
                    $scope.AddShiftForm.submitted = false;
                }
            });
        }
    };
    $scope.HRM_SCHDL_UPD_SHIFT = function (ACTIVE_FLAG, MARK_UNAVAILABLE_FLAG) {

        //if (_shiftcnt.indexOf(".") != -1) {
        //    $scope.$parent.ShowAlertBox("Error", "Please enter whole number.", 3000);
        //    return;
        //}
        if ($scope.AddShiftSearch.TOTAL_SHIFT_LENGTH <= (parseInt($scope.AddShiftSearch.SCHEDULED_UNPAID_BREAK) + parseInt($scope.AddShiftSearch.SCHEDULED_PAID_BREAK))) {
            $scope.$parent.ShowAlertBox("Error", "Break cannot be more than or equal to shift length.", 3000);
            return;
        }
        if ($scope.EMPLOYEE_LIST != null && $scope.EMPLOYEE_LIST.length > 0) {
            $scope.ANY_SELECTED_EMPLOYEE = $scope.EMPLOYEE_LIST.filter(item => item.IS_EMPLOYEE_SELECTED).length > 0 ? false : true;
        } else {
            $scope.ANY_SELECTED_EMPLOYEE = true;
        }
        $scope.AddShiftForm.submitted = true;
        var _shiftcnt = $scope.AddShiftSearch.SHIFT_COUNT;
        if (_shiftcnt == undefined || _shiftcnt == null || _shiftcnt == '' || _shiftcnt == '.') {
            $scope.$parent.ShowAlertBox("Error", "Please enter shift count.", 3000);
            return;
        }
        else if (parseFloat(_shiftcnt) < 0.1 || parseFloat(_shiftcnt) > 3) {
            $scope.$parent.ShowAlertBox("Error", "Shift Count must be between 0.1 and 3.", 3000);
            return;
        }
        if ($scope.AddShiftForm.$valid && !$scope.ANY_SELECTED_EMPLOYEE) {
            var ShiftObj = new Object();

            ShiftObj.SCHDL_SHIFT_ID = $scope.AddShiftSearch.SCHDL_SHIFT_ID;
            ShiftObj.EMPLY_PRSNL_ID = $scope.AddShiftSearch.EMPLOYEE_ID;
            ShiftObj.ENTITY_ID = $scope.AddShiftSearch.ENTITY_ID;
            ShiftObj.BRANCH_ID = $scope.AddShiftSearch.SHIFT_BRANCH_ID;
            ShiftObj.POSITION_ID = $scope.AddShiftSearch.POSITION_ID;
            ShiftObj.DEPARTMENT_ID = $scope.AddShiftSearch.DEPARTMENT_ID;
            ShiftObj.SECTION_ID = $scope.AddShiftSearch.SECTION_ID;
            ShiftObj.SHIFT_MASTER_ID = $scope.AddShiftSearch.SHIFT_MASTER_ID == "" ? null : $scope.AddShiftSearch.SHIFT_MASTER_ID;
            ShiftObj.NOTE = $scope.AddShiftSearch.NOTE;
            ShiftObj.SHIFT_COUNT = $scope.AddShiftSearch.SHIFT_COUNT;
            $scope.SETDATE_FN($scope.AddShiftSearch.SCHEDULED_START, $scope.AddShiftSearch.SCHEDULED_END, $scope.AddShiftForm.BUSINESS_DATE.$viewValue);
            ShiftObj.SCHEDULED_START = $scope.$parent.HRM_CHANGE_TIME_ZONE_Fn(new Date($scope.AddShiftSearch.SCHEDULED_START));
            ShiftObj.SCHEDULED_END = $scope.$parent.HRM_CHANGE_TIME_ZONE_Fn(new Date($scope.AddShiftSearch.SCHEDULED_END));
            ShiftObj.SCHEDULED_PAID_BREAK = $scope.AddShiftSearch.SCHEDULED_PAID_BREAK;
            ShiftObj.SCHEDULED_UNPAID_BREAK = $scope.AddShiftSearch.SCHEDULED_UNPAID_BREAK;
            ShiftObj.USER_ID = $scope.AddShiftSearch.USER_ID;
            ShiftObj.MARK_UNAVAILABLE = MARK_UNAVAILABLE_FLAG;
            ShiftObj.SETTING_46 = $scope.$parent.MASTER_GET_CUSTOMER_SETTINGS_VALUES(46);
            ShiftObj.WAGE = $scope.AddShiftSearch.WAGE;
            ShiftObj.WAGE_TYPE_ID = $scope.AddShiftSearch.WAGE_TYPE_ID;
            ShiftObj.IS_SPECIAL_WAGE = $scope.AddShiftSearch.IS_SPECIAL_WAGE;
            ShiftObj.SUBTRACT_BREAK_61 = $scope.$parent.MASTER_GET_CUSTOMER_SETTINGS_VALUES(61) == "1" ? true : false;
            ShiftObj.EXCLUDE_HOLIDAY_ACCRUAL_87 = $scope.$parent.MASTER_GET_CUSTOMER_SETTINGS_VALUES(87) == "1" ? true : false;;
            ShiftObj.YEAR_START_89 = $scope.$parent.MASTER_GET_CUSTOMER_SETTINGS_VALUES(89);
            ShiftObj.SCHEDULE_START = new Date($scope.EMPLOYEE_SHIFTS_DATES[0].DATE);
            ShiftObj.SCHEDULE_END = new Date($scope.EMPLOYEE_SHIFTS_DATES[6].DATE);

            PrcCommMethods.HUMANRESOURCE_API(ShiftObj, 'HRM_SCHDL_UPD_SHIFT').then(function (data) {
                if (data.data.Table == undefined) {

                    $scope.$parent.ShowAlertBox("Success", 'Shift updated successfully', 3000);
                    $scope.HRM_GET_SCHDLS();
                    $scope.RESET_Fn();
                    $('#Add_Shift').modal('hide');
                    $scope.AddShiftForm.submitted = false;
                }
                else if (data.data.Table.length > 0) {
                    $scope.OVERLAP_EMP_LIST = data.data.Table;
                    $('#overlap_employee_POPUP').modal('show');

                    $scope.$parent.ShowAlertBox("Error", "Shift Overlapping, please correct shift timings", 3000);
                }
                //if (data.data == 0) {
                //    $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                //}
                //// Business Date Validation
                //if (data.data == -1) {
                //    $scope.$parent.ShowAlertBox("Error", "You cannot edit a past shift.", 3000);
                //}
                //// Shift Start time validation
                //if (data.data == -2) {
                //    $scope.$parent.ShowAlertBox("Error", "This shift has already started and cannot be edited.", 3000);
                //}
                //// Approved Shift
                //if (data.data == -3) {
                //    $scope.$parent.ShowAlertBox("Error", "You cannot edit an approved shift.", 3000);
                //}
            });

        }
    };
    $scope.CLOCKINOUT = false;
    $scope.HRM_CLOCK_IN_SHIFTS = function (shiftId) {
        $scope.CLOCKINOUT = true;
        $scope.AddShiftSearch.CLOCK_IN = "";
        $scope.AddShiftSearch.CLOCK_OUT = "";
        $scope.EDIT_MODE = false;
        $scope.APPROVE_MODE = false;
        $scope.VIEW_MODE = false;
        $scope.HRM_SCHDL_GET_SHIFT_BY_ID(shiftId);
    };
    $scope.HRM_RESET_CLOCKINOUT = function () {
        $scope.RESET_Fn();
        $('#divClockInOut').modal('hide');
    }
    $scope.HRM_SAVE_CLOCKINOUT = function () {
        $scope.CLOCKINFORM.submitted = true;
        if ($scope.CLOCKINFORM.$valid) {
            var ModelObj = new Object();
            ModelObj.SCHDL_SHIFT_ID = $scope.AddShiftSearch.SCHDL_SHIFT_ID;
            ModelObj.CLOCK_IN = $scope.$parent.HRM_CHANGE_TIME_ZONE_Fn(new Date($scope.AddShiftSearch.CLOCK_IN));
            if ($scope.AddShiftSearch.CLOCK_OUT != null || $scope.AddShiftSearch.CLOCK_OUT != undefined || $scope.AddShiftSearch.CLOCK_OUT != "") {
                ModelObj.CLOCK_OUT = $scope.$parent.HRM_CHANGE_TIME_ZONE_Fn(new Date($scope.AddShiftSearch.CLOCK_OUT));
            }
            ModelObj.SETTING_46 = $scope.$parent.MASTER_GET_CUSTOMER_SETTINGS_VALUES(46);
            ModelObj.USER_ID = $scope.MasterData.USER_ID;
            ModelObj.CLOCK_IN_SOURCE = "WEB";
            ModelObj.CLOCK_OUT_SOURCE = "WEB";
            PrcCommMethods.HUMANRESOURCE_API(ModelObj, 'HRM_SAVE_CLOCKINOUT').then(function (data) {
                if (data.data != null || data.data == 1) {
                    $scope.$parent.ShowAlertBox("Success", 'Clock In/Out saved successfully.', 3000);
                    $scope.HRM_RESET_CLOCKINOUT();
                }
            });
        } else {
            $scope.$parent.ShowAlertBox("Error", 'Please enter clock in.', 3000);
        }
    };

    $scope.HRM_SCHDL_INS_WAGE = function () {
        var CusModelObj = new Object();
        CusModelObj.SCHDL_SHIFT_ID = $scope.AddShiftSearch.SCHDL_SHIFT_ID;
        CusModelObj.WAGE = $scope.AddShiftSearch.WAGE;
        CusModelObj.WAGE_TYPE_ID = $scope.AddShiftSearch.WAGE_TYPE_ID;
        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_SCHDL_INS_WAGE').then(function (data) {
            if (data.data == null && data.data == 0) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
            if (data.data > 0) {
                $scope.$parent.ShowAlertBox("Success", 'Wage saved successfully', 3000);
            }
        });
    };

    $scope.HRM_SCHDL_UPD_CLOCK_IN = function () {
        $scope.CLOCK_FORM.submitted = true;
        if ($scope.CLOCK_FORM.$valid) {
            var CusModelObj = new Object();
            CusModelObj.SCHDL_SHIFT_ID = $scope.AddShiftSearch.SCHDL_SHIFT_ID;
            CusModelObj.CLOCK_IN = $scope.$parent.HRM_CHANGE_TIME_ZONE_Fn($scope.ConvertTimeToDate($scope.AddShiftSearch.BUSINESS_DATE, $scope.AddShiftSearch.CLOCK_IN));
            PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_SCHDL_UPD_CLOCK_IN').then(function (data) {
                if (data.data == null || data.data == 0) {
                    $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                }
                if (data.data > 0) {
                    $scope.$parent.ShowAlertBox("Success", 'Clock in saved successfully', 3000);
                }
            });
        }
    };

    $scope.HRM_SCHDL_UPD_CLOCK_OUT = function () {
        $scope.CLOCK_FORM.submitted = true;
        if ($scope.CLOCK_FORM.$valid) {
            var CusModelObj = new Object();
            CusModelObj.SCHDL_SHIFT_ID = $scope.AddShiftSearch.SCHDL_SHIFT_ID;
            CusModelObj.CLOCK_OUT = $scope.$parent.HRM_CHANGE_TIME_ZONE_Fn($scope.ConvertTimeToDate($scope.AddShiftSearch.BUSINESS_DATE, $scope.AddShiftSearch.CLOCK_OUT));
            PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_SCHDL_UPD_CLOCK_OUT').then(function (data) {
                if (data.data == null || data.data == 0) {
                    $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                }
                if (data.data > 0) {
                    $scope.$parent.ShowAlertBox("Success", 'Clock out saved successfully', 3000);
                }
            });
        }
    };
    $scope.HRM_SCHDL_PUBLISH_SHIFTS = function (SHIFT_ID, MULTI_SHIFT_IDS) {

        var CusModelObj = new Object();
        CusModelObj.TABLE_ID_LIST = [];
        CusModelObj.USER_ID = $scope.AddShiftSearch.USER_ID;
        CusModelObj.ENTITY_ID = $scope.AddShiftSearch.ENTITY_ID;
        if (SHIFT_ID != undefined && SHIFT_ID != '') {
            let readOnly = new Object();
            readOnly.TABLE_ID = SHIFT_ID;
            CusModelObj.TABLE_ID_LIST.push(readOnly);
        } else {
            let multiple_id = MULTI_SHIFT_IDS.split(',');
            angular.forEach(multiple_id, function (item) {
                let readOnly = new Object();
                readOnly.TABLE_ID = parseInt(item);
                CusModelObj.TABLE_ID_LIST.push(readOnly);
            });
        }
        CusModelObj.START_DATE = null;
        CusModelObj.END_DATE = null;
        CusModelObj.SETTING_46 = $scope.$parent.MASTER_GET_CUSTOMER_SETTINGS_VALUES(46);
        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_SCHDL_PUBLISH_SHIFTS').then(function (data) {
            $scope.$parent.ShowAlertBox("Success", 'Shift has been publish successfully.', 3000);
            $('#publish_complete_shift').modal('hide');
            $scope.HRM_GET_SCHDLS();
        });
    };
    $scope.approve_shift_count = 0;
    $scope.APPROVE_MULTI_SHIFT_Fn = function () {

        $scope.approve_shift_count = 0;
        $scope.shift_without_exception_count = 0;
        $scope.shift_with_exception_count = 0;
        $scope.APPROVE_MULTI_SHIFT_IDS = '';
        $scope.APPROVE_SHIFT_IDS_WITH_EXCEPTION = '';
        $scope.ALL_APPROVE_SHIFT_IDS = '';
        $scope.APPROVE_SHIFT_IDS_WITHOUT_EXCEPTION = '';
        $scope.OTHER_STATUS_SELECTED = false;
        $scope.EMPLOYEE_SHIFTS_LIST.map(function (employeeShift) {
            [0, 1, 2, 3, 4, 5, 6].map(function (value) {
                if (employeeShift['day' + value + '_shift_count'] > 0) {
                    let shiftDays = employeeShift['day' + value + '_shift'];
                    angular.forEach(shiftDays, function (item) {
                        if ($scope.selected_employee_count > 0) {
                            if (item.IS_SHIFT_SELECTED) {
                                if (item.STATUS_ID == 92 && new Date($scope.CURRENT_DATE) >= new Date(item.SCHEDULED_END)) {

                                    if ($scope.ALL_APPROVE_SHIFT_IDS.length == 0) {
                                        $scope.ALL_APPROVE_SHIFT_IDS += item.SCHDL_SHIFT_ID;
                                    } else {
                                        $scope.ALL_APPROVE_SHIFT_IDS += ',' + item.SCHDL_SHIFT_ID;
                                    }
                                    $scope.approve_shift_count++;
                                    if (!item.NOSHOW && !item.CLOCKING_VARIANCE && !item.IS_ON_LEAVE) {
                                        $scope.shift_without_exception_count++;
                                        if ($scope.APPROVE_SHIFT_IDS_WITHOUT_EXCEPTION.length == 0) {
                                            $scope.APPROVE_SHIFT_IDS_WITHOUT_EXCEPTION += item.SCHDL_SHIFT_ID;
                                        } else {
                                            $scope.APPROVE_SHIFT_IDS_WITHOUT_EXCEPTION += ',' + item.SCHDL_SHIFT_ID;
                                        }
                                    }
                                    else {
                                        if ($scope.APPROVE_SHIFT_IDS_WITH_EXCEPTION.length == 0) {
                                            $scope.APPROVE_SHIFT_IDS_WITH_EXCEPTION += item.SCHDL_SHIFT_ID;
                                        } else {
                                            $scope.APPROVE_SHIFT_IDS_WITH_EXCEPTION += ',' + item.SCHDL_SHIFT_ID;
                                        }
                                        $scope.shift_with_exception_count++;
                                    }
                                }

                                else {
                                    if (item.STATUS_ID == 92 && new Date(new Date(new Date($scope.CURRENT_DATE).setHours(0)).setMinutes(0)).setSeconds(0) < new Date(new Date(new Date(item.SCHEDULED_END).setHours(0)).setMinutes(0)).setSeconds(0)) {
                                        $scope.OTHER_STATUS_SELECTED = true;
                                    }
                                    item.IS_SHIFT_SELECTED = false;
                                    $scope.selected_employee_count--;
                                    ($scope.EMPLOYEE_SHIFTS_LIST.filter(x => x.GROUP_BY_ID == employeeShift.PARENT_ID))[0].EMPLOYEE_SHIFTS_DATES[value].IS_SELECTED = false;
                                }
                            }
                        } else if (item.STATUS_ID == 92 && new Date($scope.CURRENT_DATE) >= new Date(item.SCHEDULED_END)) {

                            if ($scope.ALL_APPROVE_SHIFT_IDS.length == 0) {
                                $scope.ALL_APPROVE_SHIFT_IDS += item.SCHDL_SHIFT_ID;
                            } else {
                                $scope.ALL_APPROVE_SHIFT_IDS += ',' + item.SCHDL_SHIFT_ID;
                            }
                            $scope.approve_shift_count++;
                            if (!item.NOSHOW && !item.CLOCKING_VARIANCE && !item.IS_ON_LEAVE) {
                                $scope.shift_without_exception_count++;
                                if ($scope.APPROVE_SHIFT_IDS_WITHOUT_EXCEPTION.length == 0) {
                                    $scope.APPROVE_SHIFT_IDS_WITHOUT_EXCEPTION += item.SCHDL_SHIFT_ID;
                                } else {
                                    $scope.APPROVE_SHIFT_IDS_WITHOUT_EXCEPTION += ',' + item.SCHDL_SHIFT_ID;
                                }
                            }
                            else {
                                if ($scope.APPROVE_SHIFT_IDS_WITH_EXCEPTION.length == 0) {
                                    $scope.APPROVE_SHIFT_IDS_WITH_EXCEPTION += item.SCHDL_SHIFT_ID;
                                } else {
                                    $scope.APPROVE_SHIFT_IDS_WITH_EXCEPTION += ',' + item.SCHDL_SHIFT_ID;
                                }
                                $scope.shift_with_exception_count++;
                            }
                        }
                    });
                }
            });
        });
        if ($scope.selected_employee_count == 0 && $scope.OTHER_STATUS_SELECTED) {
            $scope.$parent.ShowAlertBox("Warning", "Please select only published shifts from previous dates to approve.", 3000);
        }
        else if ($scope.ALL_APPROVE_SHIFT_IDS.length != 0) {
            $('#approve_complete_shift').modal('show');
        }
        else if ($scope.selected_employee_count == 0) {
            $scope.$parent.ShowAlertBox("Warning", "Please select shifts to approve.", 3000);
        }

    };
    $scope.HRM_SCHDL_APPROVE_MULTIPLE_SHIFTS = function (MULTI_SHIFT_IDS) {
        var CusModelObj = new Object();
        CusModelObj.TABLE_ID_LIST = [];
        CusModelObj.USER_ID = $scope.AddShiftSearch.USER_ID;
        CusModelObj.CUSTOMER_ID = $scope.MasterData.CUSTOMER_ID;
        CusModelObj.ENTITY_ID = $scope.MasterData.ENTITY_ID;
        CusModelObj.COMMENTS = null;
        let multiple_id = MULTI_SHIFT_IDS.split(',');
        angular.forEach(multiple_id, function (item) {
            let readOnly = new Object();
            readOnly.TABLE_ID = parseInt(item);
            CusModelObj.TABLE_ID_LIST.push(readOnly);
        });
        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_SCHDL_APPROVE_MULTIPLE_SHIFTS').then(function (data) {
            if (data.data == null || data.data == 0) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
            if (data.data > 0) {
                $scope.$parent.ShowAlertBox("Success", 'Shifts has been approved successfully.', 3000);
                $('#approve_complete_shift').modal('hide');
                $scope.HRM_GET_SCHDLS();
            }
        });
    };
    $scope.HRM_SCHDL_APPROVE_BY_SHIFT_ID = function (SHIFT) {
        $scope.ActualForm.submitted = true;
        if ($scope.ActualForm.$valid) {
            var CusModelObj = new Object();
            CusModelObj.SCHDL_SHIFT_ID = SHIFT.SCHDL_SHIFT_ID;
            CusModelObj.APPROVED_CLOCK_IN = $scope.$parent.HRM_CHANGE_TIME_ZONE_Fn(new Date($scope.AddShiftSearch.APPROVED_CLOCK_IN));
            CusModelObj.APPROVED_CLOCK_OUT = $scope.$parent.HRM_CHANGE_TIME_ZONE_Fn(new Date($scope.AddShiftSearch.APPROVED_CLOCK_OUT));
            CusModelObj.USER_ID = $scope.MasterData.USER_ID;
            CusModelObj.USE_SCHEDULED_AS_APPROVED = $scope.USE_SCHEDULED;
            CusModelObj.USE_CLOCK_IN_OUT_AS_APPROVED = $scope.USE_CLOCKIN;
            CusModelObj.COMMENTS = $scope.AddShiftSearch.NOTE;
            if ($scope.BREAK_IN_LIST.length > 0) {
                CusModelObj.HRM_SCHDL_SHIFT_APPROVED_BREAKS = [];
                angular.forEach($scope.BREAK_IN_LIST, function (_break) {
                    let readOnly = new Object();
                    readOnly.BREAK_ID = _break.BREAK_ID;
                    readOnly.APPROVED_BREAK_IN = $scope.$parent.HRM_CHANGE_TIME_ZONE_Fn(new Date(_break.BREAK_IN));
                    readOnly.APPROVED_BREAK_OUT = $scope.$parent.HRM_CHANGE_TIME_ZONE_Fn(new Date(_break.BREAK_OUT));
                    readOnly.IS_DISCARDED = _break.IS_DISCARDED;
                    CusModelObj.HRM_SCHDL_SHIFT_APPROVED_BREAKS.push(readOnly);
                });
            }
            else {

                CusModelObj.HRM_SCHDL_SHIFT_APPROVED_BREAKS = [{
                    BREAK_ID: null,
                    APPROVED_BREAK_IN: null,
                    APPROVED_BREAK_OUT: null,
                    IS_DISCARDED: null
                }];

            }
            PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_SCHDL_APPROVE_BY_SHIFT_ID').then(function (data) {
                if (data.data == null || data.data == 0) {
                    $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                }
                if (data.data > 0) {
                    $scope.$parent.ShowAlertBox("Success", 'Shifts approved successfully', 3000);
                    $('#Add_Shift').modal('hide');
                    $scope.HRM_GET_SCHDLS();
                    $scope.ENABLE_APPROVE_BUTTON = false;
                    $scope.AddShiftSearch.SCHDL_SHIFT_ID = 0;
                    $scope.BREAK_IN_LIST = [];
                    $scope.AddShiftSearch.APPROVED_CLOCK_IN = "";
                    $scope.AddShiftSearch.APPROVED_CLOCK_OUT = "";
                    $scope.USE_SCHEDULED = false;
                    $scope.USE_CLOCKIN = false;
                    $scope.RESET_Fn();
                }
            });
        }
    };

    $scope.HRM_SCHDL_REVERT_SHIFT_APPROVAL = function (SHIFT_ID, EMPLOYEE_ID) {
        var CusModelObj = new Object();
        CusModelObj.SCHDL_SHIFT_ID = SHIFT_ID;
        CusModelObj.COMMENTS = $scope.AddShiftSearch.COMMENTS;
        CusModelObj.LOGIN_EMPLOYEE_ID = $scope.AddShiftSearch.LOGIN_EMPLOYEE_ID;
        CusModelObj.USER_ID = $scope.AddShiftSearch.USER_ID;

        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_SCHDL_REVERT_SHIFT_APPROVAL').then(function (data) {
            if (data.data == null || data.data == 0) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
            if (data.data > 0) {
                $scope.$parent.ShowAlertBox("Success", 'Shift has been reverted successfully', 3000);
                $scope.HRM_GET_SCHDLS();
            }
        });
    };
    $scope.EXCEPTION_VIEW = false;
    $scope.VIEW_EXCEPTIONS = function (FLAG) {
        if (FLAG == 2) {
            $scope.EXCEPTION_VIEW = true;
        }
        $scope.SHOW_ACTUAL_TIME = false;
        $scope.HRM_GET_SCHDLS();
        $('#approve_complete_shift').modal('hide');
    }
    $scope.HRM_SCHDL_DELETE_MULTIPLE_SHIFTS = function (SHIFT_ID, MULTI_SHIFT_IDS) {
        var CusModelObj = new Object();
        CusModelObj.TABLE_ID_LIST = [];
        CusModelObj.SCHEDULE_START = new Date($scope.EMPLOYEE_SHIFTS_DATES[0].DATE);
        CusModelObj.SCHEDULE_END = new Date($scope.EMPLOYEE_SHIFTS_DATES[6].DATE);
        CusModelObj.ENTITY_ID = $scope.AddShiftSearch.ENTITY_ID;
        CusModelObj.USER_ID = $scope.AddShiftSearch.USER_ID;
        CusModelObj.SETTING_46 = $scope.$parent.MASTER_GET_CUSTOMER_SETTINGS_VALUES(46);
        if (SHIFT_ID != undefined && SHIFT_ID != '') {
            let readOnly = new Object();
            readOnly.TABLE_ID = SHIFT_ID;
            CusModelObj.TABLE_ID_LIST.push(readOnly);
        } else {
            let multiple_id = MULTI_SHIFT_IDS.split(',');
            angular.forEach(multiple_id, function (item) {
                let readOnly = new Object();
                readOnly.TABLE_ID = parseInt(item);
                CusModelObj.TABLE_ID_LIST.push(readOnly);
            });
        }
        CusModelObj.START_DATE = null;
        CusModelObj.END_DATE = null;
        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_SCHDL_DELETE_MULTIPLE_SHIFTS').then(function (data) {
            if (data.data == null || data.data == 0) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
            if (data.data > 0) {
                $scope.$parent.ShowAlertBox("Success", 'Shifts has been successfully deleted', 3000);
                $scope.HRM_GET_SCHDLS();
                $('#delete_shift').modal('hide');
                $('#Add_Shift').modal('hide');
                ($scope.EMPLOYEE_SHIFTS_LIST.filter(x => x.PARENT_ID == 0)).map(function (employeeshift) {
                    [0, 1, 2, 3, 4, 5, 6].map(function (value) {
                        employeeshift.EMPLOYEE_SHIFTS_DATES[value].IS_SELECTED = false;
                    });
                });
            }

        });
    };
    $scope.HRM_SCHDL_DELETE_WEEK_SHIFTS = function () {
        var CusModelObj = new Object();
        CusModelObj.TABLE_ID_LIST = [];
        CusModelObj.START_DATE = $scope.$parent.HRM_CHANGE_TIME_ZONE_Fn(new Date($scope.START_DATE));
        CusModelObj.END_DATE = $scope.$parent.HRM_CHANGE_TIME_ZONE_Fn(new Date($scope.END_DATE));
        CusModelObj.USER_ID = $scope.AddShiftSearch.USER_ID;
        CusModelObj.ENTITY_ID = $scope.AddShiftSearch.ENTITY_ID;
        CusModelObj.LOGIN_EMPLOYEE_ID = $scope.AddShiftSearch.LOGIN_EMPLOYEE_ID;

        $scope.EMPLOYEE_SHIFTS_LIST.map(function (employeeShift) {
            [0, 1, 2, 3, 4, 5, 6].map(function (value) {
                if (employeeShift['day' + value + '_shift_count'] > 0) {
                    let shiftDays = employeeShift['day' + value + '_shift'];
                    angular.forEach(shiftDays, function (item) {
                        let readOnly = new Object();
                        readOnly.TABLE_ID = item.SCHDL_SHIFT_ID;
                        CusModelObj.TABLE_ID_LIST.push(readOnly);

                    });

                }
            });
        });
        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_SCHDL_DELETE_WEEK_SHIFTS').then(function (data) {
            if (data.data == null || data.data == 0) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
            if (data.data > 0) {
                $scope.$parent.ShowAlertBox("Success", 'This week Shifts has been successfully deleted', 3000);
                $scope.HRM_GET_SCHDLS();
                $('#delete_this_week').modal('hide');
            }
        });
    };
    $scope.CHECK_ANY_EMPLOYEE_SELECTED = function () {
        if ($scope.EMPLOYEE_LIST != null && $scope.EMPLOYEE_LIST.length > 0) {
            $scope.ANY_SELECTED_EMPLOYEE = $scope.EMPLOYEE_LIST.filter(item => item.IS_EMPLOYEE_SELECTED == true).length > 0 ? false : true;
        }
    };
    $scope.CLOSE_OVERLAP_POPUP_Fn = function () {
        $('#overlap_employee_POPUP').modal('hide');
        $('#Add_Shift').modal('show');
    };
    $scope.RESET_Fn = function () {
        $('#Add_Shift').modal('hide');
        $scope.AddShiftForm.submitted = false;
        $scope.ActualForm.submitted = false;
        $scope.BlankShiftObject.BRANCH_ID = $scope.AddShiftSearch.SHIFT_BRANCH_ID;
        $scope.BlankShiftObject.EMPLY_BRANCH_ID = $scope.AddShiftSearch.EMPLY_BRANCH_ID;
        $scope.BlankShiftObject.CUSTOM_BRANCH_NAME = $scope.AddShiftSearch.CUSTOM_BRANCH_NAME;
        $scope.AddShiftSearch = angular.copy($scope.BlankShiftObject);
        $scope.EMPLOYEE_LIST.forEach(function (employee) {
            if (employee.IS_EMPLOYEE_SELECTED) {
                employee.IS_EMPLOYEE_SELECTED = false;
            }
        });
        $scope.EDIT_MODE = false;
        $scope.VIEW_MODE = false;
        $scope.APPROVE_MODE = false;
        $scope.ENABLE_UPDATE_BUTTON = false;
        $scope.ENABLE_APPROVE_BUTTON = false;
    };

    $scope.EMPLOYEE_SHIFT_EDIT_Fn = function (ShiftId, ShiftDtls) {
        $scope.HEADER_LABEL_SHIFT = 'Edit';
        $scope.EDIT_MODE = true;
        $scope.HIDE_COST = ShiftDtls.HIDE_COST;
        $scope.HRM_SCHDL_GET_SHIFT_BY_ID(ShiftId);
        $('#Add_Shift').modal('show');
    };
    $scope.DELETE_ADD_SHIFT_Fn = function (Shift, EMPLOYEE) {
        if (Shift) {
            $scope.DELETE = {};
            $scope.DELETE.SHIFT = Shift;
            $scope.DELETE.EMPLOYEE = EMPLOYEE;
        }
        else {
            $scope.DELETE = {};
            $scope.DELETE.SHIFT = {};
            $scope.DELETE.SHIFT.BUSINESS_DATE = $scope.AddShiftSearch.BUSINESS_DATE;
            $scope.DELETE.SHIFT.SCHEDULED_START = $scope.AddShiftSearch.SCHEDULED_START;
            $scope.DELETE.SHIFT.SCHEDULED_END = $scope.AddShiftSearch.SCHEDULED_END;
            $scope.DELETE.SHIFT.SCHDL_SHIFT_ID = $scope.AddShiftSearch.SCHDL_SHIFT_ID;
            $scope.DELETE.EMPLOYEE = {};
            $scope.DELETE.EMPLOYEE.EMPLOYEE_NAME = $scope.AddShiftSearch.CUSTOM_EMPLOYEE_NAME;
        }
        $('#delete_shift').modal('show');
    };


    $scope.VIEW_ADD_SHIFT = function (ShiftId, ShiftDtls) {
        $scope.HEADER_LABEL_SHIFT = 'View';
        $scope.VIEW_MODE = true;
        $scope.ENABLE_APPROVE_BUTTON = false;
        $scope.APPROVE_MODE = false;
        $scope.HIDE_COST = ShiftDtls.HIDE_COST;
        $('#Add_Shift').modal('show');
        $scope.HRM_SCHDL_GET_SHIFT_BY_ID(ShiftId);
    };
    $scope.APPROVE_SHIFT_Fn = function (Shift) {
        if (moment(moment(Shift.BUSINESS_DATE).format('LL')).isSameOrBefore(moment(moment($scope.CURRENT_DATE).format('LL')))) {
            $scope.HEADER_LABEL_SHIFT = 'Approve';
            $scope.VIEW_MODE = true;
            $scope.APPROVE_MODE = true;
            $scope.ENABLE_APPROVE_BUTTON = true;
            $scope.HRM_SCHDL_GET_SHIFT_BY_ID(Shift.SCHDL_SHIFT_ID);
            $('#Add_Shift').modal('show');
        } else {
            $scope.$parent.ShowAlertBox("Error", 'You cannot approve a future date shift', 3000);
        }

    };
    function startOfWeek(date) {
        // Calculate the difference between the date's day of the month and its day of the week
        var diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);

        // Set the date to the start of the week by setting it to the calculated difference
        return new Date(date.setDate(diff));
    }
    function endOfWeek(date) {
        // Calculate the date of the last day of the week by adding the difference between the day of the month and the day of the week, then adding 6.
        var lastday = date.getDate() - ((date.getDay() == 0 ? 7 : date.getDay()) - 1) + 6;
        // Set the date to the calculated last day of the week.
        return new Date(date.setDate(lastday));
    }
    $scope.COPY_SHIFT = function (shiftId, index, EmployeeName) {
        $scope.COPY_SHIFT_IDS = "" + shiftId;
        $scope.COPY_TYPE = 2;
        $scope.COPIED_SHIFT_EMPLOYEE = EmployeeName;
        $scope.IS_SINGLE_SHIFT_COPY = true;
        var date = new Date($scope.EMPLOYEE_SHIFTS_DATES[index].DATE);
        $scope.SELECTED_FOR_COPY_DATE = date;
        $scope.COPY_DAYS_ARRAY = [];

        for (var i = 1; i <= 20; i++) {
            let start_date_copy = new Date(date.getFullYear(), date.getMonth(), date.getDate() + i);
            var WeekObj = new Object();
            WeekObj.BUSINESS_DATE = angular.copy(start_date_copy);
            WeekObj.START_DATE = startOfWeek(angular.copy(start_date_copy));
            WeekObj.END_DATE = endOfWeek(angular.copy(start_date_copy));

            $scope.COPY_DAYS_ARRAY.push(WeekObj);
        }
        $('#copy_shift_day').modal('show');
    };
    $scope.COPY_DAY_SHIFT_Fn = function (VIEW_TYPE) {
        $scope.IS_SINGLE_SHIFT_COPY = false;
        $scope.COPY_TYPE = 2;
        $scope.COPY_DAYS_ARRAY = [];
        let index_value = -1;
        let is_multi_date_selected = false;
        let selectedDateIndex = null;
        $scope.COPY_SHIFT_IDS = '';
        $scope.EMPLOYEE_SHIFTS_LIST.map(function (employeeShift) {
            [0, 1, 2, 3, 4, 5, 6].map(function (value) {
                if (employeeShift['day' + value + '_shift_count'] > 0) {
                    let shiftDays = employeeShift['day' + value + '_shift'];
                    angular.forEach(shiftDays, function (item) {
                        if (item.IS_SHIFT_SELECTED) {
                            if ($scope.COPY_SHIFT_IDS.length == 0) {
                                $scope.COPY_SHIFT_IDS += item.SCHDL_SHIFT_ID;
                            } else {
                                $scope.COPY_SHIFT_IDS += ',' + item.SCHDL_SHIFT_ID;
                            }
                            if (index_value === -1) {
                                index_value = value;
                                selectedDateIndex = value;
                            } else if (index_value !== value) {
                                is_multi_date_selected = true;
                            }
                        }
                    });

                }
            });
        });
        if (!is_multi_date_selected && selectedDateIndex !== null) {
            $scope.SHIFT_EXISTS = 0;
            $scope.AddShiftSearch.COPY_WEEK_VALUE = 1;
            $('#copy_shift_day').modal('show');
            var date = new Date($scope.EMPLOYEE_SHIFTS_DATES[selectedDateIndex].DATE);
            $scope.SELECTED_FOR_COPY_DATE = date;
            $scope.COPY_DAYS_ARRAY = [];
            for (var i = 1; i <= 20; i++) {
                let start_date_copy = new Date(date.getFullYear(), date.getMonth(), date.getDate() + i);
                var WeekObj = new Object();
                var WeekObj = new Object();
                WeekObj.BUSINESS_DATE = angular.copy(start_date_copy);
                WeekObj.START_DATE = startOfWeek(angular.copy(start_date_copy));
                WeekObj.END_DATE = endOfWeek(angular.copy(start_date_copy));
                $scope.COPY_DAYS_ARRAY.push(WeekObj);
            }
        } else if (is_multi_date_selected) {
            $scope.$parent.ShowAlertBox("Error", "Multiple dates have been selected. Please select only one date for copying.", 3000);
        } else {
            $scope.$parent.ShowAlertBox("Warning", "No date has been selected. Please select a date to proceed.", 3000);
        }
    };

    $scope.HRM_SCHDL_COPY_SHIFTS = function () {
        var IS_REFRESH_PAGE = false;
        var CopyObj = new Object();
        CopyObj.COPY_TYPE = $scope.COPY_TYPE;
        CopyObj.USER_ID = $scope.MasterData.USER_ID;
        CopyObj.ENTITY_ID = $scope.MasterData.ENTITY_ID;
        CopyObj.SUBTRACT_BREAK_61 = $scope.$parent.MASTER_GET_CUSTOMER_SETTINGS_VALUES(61) == "1" ? true : false;
        CopyObj.EXCLUDE_HOLIDAY_ACCRUAL_87 = $scope.$parent.MASTER_GET_CUSTOMER_SETTINGS_VALUES(87) == "1" ? true : false;
        CopyObj.YEAR_START_89 = $scope.$parent.MASTER_GET_CUSTOMER_SETTINGS_VALUES(89);
        CopyObj.HRM_SCHDL_MULTI_DATE_LIST = [];
        CopyObj.TABLE_ID_LIST = [];
        if ($scope.COPY_TYPE == 1) {
            $scope.GET_ALL_SHIFT_IDS();
            $scope.COPY_SHIFT_IDS = $scope.ALL_SHIFT_IDS;
        }
        if ($scope.COPY_SHIFT_IDS.length > 0) {
            let multiple_id = $scope.COPY_SHIFT_IDS.split(',');
            angular.forEach(multiple_id, function (item) {
                let readOnly = new Object();
                readOnly.TABLE_ID = parseInt(item);
                CopyObj.TABLE_ID_LIST.push(readOnly);
            });
        }
        if ($scope.COPY_DAYS_ARRAY != undefined && $scope.COPY_DAYS_ARRAY.length > 0) {
            angular.forEach($scope.COPY_DAYS_ARRAY, function (item) {
                if (item.IS_SELECTED) {
                    let readOnly = new Object();
                    readOnly.START_DATE = $scope.$parent.HRM_CHANGE_TIME_ZONE_Fn(new Date(item.START_DATE));
                    readOnly.END_DATE = $scope.$parent.HRM_CHANGE_TIME_ZONE_Fn(new Date(item.END_DATE));
                    readOnly.BUSINESS_DATE = $scope.$parent.HRM_CHANGE_TIME_ZONE_Fn(new Date(item.BUSINESS_DATE));
                    if ($scope.EMPLOYEE_SHIFTS_DATES.findIndex(x => new Date(x.DATE).toISOString() == new Date(readOnly.BUSINESS_DATE).toISOString()) > 0) {
                        IS_REFRESH_PAGE = true;
                    }
                    CopyObj.HRM_SCHDL_MULTI_DATE_LIST.push(readOnly);
                }
            });
        }
        if ($scope.COPY_WEEK_ARRAY != undefined && $scope.COPY_WEEK_ARRAY.length > 0) {
            angular.forEach($scope.COPY_WEEK_ARRAY, function (item) {
                if (item.IS_SELECTED) {
                    let readOnly = new Object();
                    readOnly.START_DATE = $scope.$parent.HRM_CHANGE_TIME_ZONE_Fn(new Date(item.START_DATE));
                    readOnly.END_DATE = $scope.$parent.HRM_CHANGE_TIME_ZONE_Fn(new Date(item.END_DATE));
                    readOnly.BUSINESS_DATE = null;
                    CopyObj.HRM_SCHDL_MULTI_DATE_LIST.push(readOnly);
                }
            });
        }
        PrcCommMethods.HUMANRESOURCE_API(CopyObj, 'HRM_SCHDL_COPY_SHIFTS').then(function (data) {
            if (data.data == null || data.data == 0) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
            if (data.data > 0) {
                $scope.$parent.ShowAlertBox("Success", 'Shift(s) has been copied successfully.', 3000);
                IS_REFRESH_PAGE ? $scope.HRM_GET_SCHDLS() : '';
                $('#copy_shift_day').modal('hide');
                $scope.COPY_DAYS_ARRAY = [];
                $scope.COPY_WEEK_ARRAY = [];
                $scope.COPY_SHIFT_IDS = "";
            }
            if (data.data < 0) {
                $scope.COPY_DAYS_ARRAY = [];
                $scope.COPY_WEEK_ARRAY = [];
                $scope.COPY_SHIFT_IDS = "";
                $('#copy_shift_day').modal('hide');
                $scope.$parent.ShowAlertBox("Error", 'Please remove overlaping shifts to copy.', 3000);
            }
        });
    };
    $scope.COPY_WEEK_SHIFT_Fn = function (VIEW_TYPE) {
        //if ($scope.SHIFTS_LIST_ALL.length > 0) {
        $scope.SHIFT_EXISTS = 0;
        $scope.COPY_TYPE = 1;
        $scope.AddShiftSearch.COPY_WEEK_VALUE = 1;
        $('#copy_shift_week').modal('show');
        var date = $scope.END_DATE;
        $scope.COPY_WEEK_ARRAY = [];
        for (var i = 0; i < 4; i++) {
            if ($scope.COPY_WEEK_ARRAY.length > 0) {
                var date = new Date($scope.COPY_WEEK_ARRAY[$scope.COPY_WEEK_ARRAY.length - 1].END_DATE);
            }
            let start_date_copy = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
            let end_date_copy = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 7);
            var NextWeekObj = new Object();
            NextWeekObj.START_DATE = angular.copy(start_date_copy);
            NextWeekObj.END_DATE = angular.copy(end_date_copy);
            NextWeekObj.BUSINESS_DATE = null;
            $scope.COPY_WEEK_ARRAY.push(NextWeekObj);
        }
    };
    $scope.COPY_DAY_SHIFT_ALERT_POPUP = function () {
        let any_date_selected = false;
        angular.forEach($scope.COPY_DAYS_ARRAY, function (item) {
            if (item.IS_SELECTED) {
                any_date_selected = true;
            }
        });
        if (any_date_selected) {
            $('#copy_shift_day').modal('hide');
            $('#copy_shift_day_alert').modal('show');
        } else {
            $scope.$parent.ShowAlertBox("Warning", "No date has been selected. Please select a date to proceed.", 3000);
        }
    };

    $scope.selected_employee_count = 0;
    $scope.EMPLOYEE_WISE_SHIFT_CHECK_Fn = function (employeeShift) {
        let isAnyShift = false;
        [0, 1, 2, 3, 4, 5, 6].map(function (value) {
            if (employeeShift['day' + value + '_shift_count'] > 0) {
                let shiftDays = employeeShift['day' + value + '_shift'];
                angular.forEach(shiftDays, function (item) {
                    var cnt = 0;
                    if (item.IS_SHIFT_SELECTED) {
                        cnt++;
                    }
                    item.IS_SHIFT_SELECTED = employeeShift.IS_SELECTED;
                    if (cnt == 0) {
                        $scope.selected_employee_count++;
                    }
                    if (!item.IS_SHIFT_SELECTED) {
                        ($scope.EMPLOYEE_SHIFTS_LIST.filter(x => x.GROUP_BY_ID == employeeShift.PARENT_ID))[0].EMPLOYEE_SHIFTS_DATES[value].IS_SELECTED = false;
                        $scope.selected_employee_count--;
                    }
                });
                /*$scope.selected_employee_count = 1;*/
                isAnyShift = true;
            }
        });
    };
    $scope.increment_selected = function (shift, index, _employeeShift) {
        if (shift.IS_SHIFT_SELECTED) {
            $scope.selected_employee_count++;
        }
        else {
            _employeeShift.IS_SELECTED = false;
            ($scope.EMPLOYEE_SHIFTS_LIST.filter(x => x.GROUP_BY_ID == _employeeShift.PARENT_ID))[0].EMPLOYEE_SHIFTS_DATES[index].IS_SELECTED = false;
            $scope.selected_employee_count--;
        }
    };
    $scope.DATE_WISE_SHIFT_CHECK_Fn = function (index, PARENT_ID) {
        $scope.ANY_SHIFT_SELECTED = false;
        var _selected_date = ($scope.EMPLOYEE_SHIFTS_LIST.filter(x => x.GROUP_BY_ID == PARENT_ID))[0].EMPLOYEE_SHIFTS_DATES[index];
        ($scope.EMPLOYEE_SHIFTS_LIST.filter(x => x.PARENT_ID == PARENT_ID)).map(function (employeeShift) {


            if (employeeShift['day' + index + '_shift_count'] > 0) {
                let shiftDays = employeeShift['day' + index + '_shift'];
                angular.forEach(shiftDays, function (item) {
                    var cnt = 0;
                    if (item.IS_SHIFT_SELECTED) {
                        cnt++;
                    }
                    item.IS_SHIFT_SELECTED = _selected_date.IS_SELECTED;

                    if (!_selected_date.IS_SELECTED) {
                        employeeShift.IS_SELECTED = false;
                        $scope.selected_employee_count--;
                    }
                    else if (cnt == 0) {
                        $scope.selected_employee_count++;
                    }

                });
            }
        });
        //  $scope.checkEmployeeCount();
    };
    $scope.SHOW_HIDE_RECORDS = function (_employeeShift, flag) {//1- Parent 2- SECTION
        if (flag == 1) {

            if (_employeeShift.HIDE_ROWS == undefined || _employeeShift.HIDE_ROWS == null) {
                _employeeShift.HIDE_ROWS = true;
            }
            else {
                _employeeShift.HIDE_ROWS = !_employeeShift.HIDE_ROWS;
            }

            var elements = document.getElementsByName("GROUPBY_" + _employeeShift.GROUP_BY_ID);
            for (var i = 0; i < elements.length; i++) {
                _employeeShift.HIDE_ROWS ? elements[i].setAttribute('style', 'display: none !important') : elements[i].style.removeProperty("display");
            }
        }
        else if (flag == 2) {
            if (_employeeShift.HIDE_ROWS == undefined || _employeeShift.HIDE_ROWS == null) {
                _employeeShift.HIDE_ROWS = true;
            }
            else {
                _employeeShift.HIDE_ROWS = !_employeeShift.HIDE_ROWS;
            }

            var elements = document.getElementsByClassName("SECONDARYGROUPBY_" + _employeeShift.SECONDARY_GROUP_BY_ID);
            for (var i = 0; i < elements.length; i++) {
                _employeeShift.HIDE_ROWS ? elements[i].setAttribute('style', 'display: none !important') : elements[i].style.removeProperty("display");
            }
        }
    }
    $scope.SHOW_ACTUAL_CLOCKED_INFO_Fn = function () {
        $scope.SHOW_ACTUAL_INFO = true;
    };
    $scope.CANCEL_CHECKED_SHIFT_Fn = function () {
        $scope.selected_employee_count = 0;
        $scope.EMPLOYEE_SHIFTS_LIST.map(function (employeeShift) {
            employeeShift.IS_SELECTED = false;
            if ($scope.ShiftEmpSearch.VIEW_ID == 2) {
                [0, 1, 2, 3, 4, 5, 6].map(function (value) {
                    if (employeeShift['day' + value + '_shift_count'] > 0) {

                        let shiftDays = employeeShift['day' + value + '_shift'];
                        angular.forEach(shiftDays, function (item) {
                            item.IS_SHIFT_SELECTED = false;
                        });
                    }
                    if (employeeShift.PARENT_ID != 0) {
                        ($scope.EMPLOYEE_SHIFTS_LIST.filter(x => x.GROUP_BY_ID == employeeShift.PARENT_ID))[0].EMPLOYEE_SHIFTS_DATES[value].IS_SELECTED = false;
                    }
                });
            }


        });

        // $scope.checkEmployeeCount();
    };

    $scope.GET_ALL_SHIFT_IDS = function () {
        $scope.ALL_SHIFT_IDS = "";
        $scope.EMPLOYEE_SHIFTS_LIST.map(function (employeeShift) {
            [0, 1, 2, 3, 4, 5, 6].map(function (value) {
                if (employeeShift['day' + value + '_shift_count'] > 0) {
                    let shiftDays = employeeShift['day' + value + '_shift'];
                    angular.forEach(shiftDays, function (item) {
                        if ($scope.ALL_SHIFT_IDS.length == 0) {
                            $scope.ALL_SHIFT_IDS += item.SCHDL_SHIFT_ID;
                        } else {
                            $scope.ALL_SHIFT_IDS += ',' + item.SCHDL_SHIFT_ID;
                        }
                    });
                }
            });
        });
    }
    $scope.PUBLISH_MULTI_SHIFTS_Fn = function () {
        $scope.PUBLISH_SHIFT_COUNT = 0;
        $scope.PUBLISH_MULTI_SHIFT_IDS = '';
        $scope.PUBLISH_ENTIRE_SHIFT_IDS = '';
        $scope.NO_MULTI_SHIFT_AVAILABLE = true;
        $scope.ENTIRE_PUBLISH_SHIFT = true;
        $scope.EMPLOYEE_SHIFTS_LIST.map(function (employeeShift) {

            [0, 1, 2, 3, 4, 5, 6].map(function (value) {
                if (employeeShift['day' + value + '_shift_count'] > 0) {
                    let shiftDays = employeeShift['day' + value + '_shift'];
                    angular.forEach(shiftDays, function (item) {
                        if (item.IS_SHIFT_SELECTED) {
                            $scope.ENTIRE_PUBLISH_SHIFT = false;
                            if (item.STATUS_ID == 91) {
                                $scope.NO_MULTI_SHIFT_AVAILABLE = false;
                                if ($scope.PUBLISH_MULTI_SHIFT_IDS.length == 0) {
                                    $scope.PUBLISH_MULTI_SHIFT_IDS += item.SCHDL_SHIFT_ID;
                                } else {
                                    $scope.PUBLISH_MULTI_SHIFT_IDS += ',' + item.SCHDL_SHIFT_ID;
                                }
                            } else if (item.IS_SHIFT_SELECTED) {

                                ($scope.EMPLOYEE_SHIFTS_LIST.filter(x => x.GROUP_BY_ID == employeeShift.PARENT_ID))[0].EMPLOYEE_SHIFTS_DATES[value].IS_SELECTED = false;
                                item.IS_SHIFT_SELECTED = false;
                                employeeShift.IS_SELECTED = false;
                                $scope.selected_employee_count--;
                            }
                            // for entire shift
                            if ($scope.PUBLISH_ENTIRE_SHIFT_IDS.length == 0) {
                                $scope.PUBLISH_ENTIRE_SHIFT_IDS += item.SCHDL_SHIFT_ID;
                            } else {
                                $scope.PUBLISH_ENTIRE_SHIFT_IDS += ',' + item.SCHDL_SHIFT_ID;
                            }
                        } else if (item.STATUS_ID == 91) {
                            if ($scope.PUBLISH_ENTIRE_SHIFT_IDS.length == 0) {
                                $scope.PUBLISH_ENTIRE_SHIFT_IDS += item.SCHDL_SHIFT_ID;
                            } else {
                                $scope.PUBLISH_ENTIRE_SHIFT_IDS += ',' + item.SCHDL_SHIFT_ID;
                            }
                            $scope.PUBLISH_SHIFT_COUNT++;
                        }
                    });
                }
            });
        });
        if ($scope.PUBLISH_ENTIRE_SHIFT_IDS.length == 0) {
            $scope.ENTIRE_PUBLISH_SHIFT = false;
        }
        if (!$scope.NO_MULTI_SHIFT_AVAILABLE || $scope.ENTIRE_PUBLISH_SHIFT) {

            $('#publish_complete_shift').modal('show');
        } else {
            $scope.selected_employee_count = 0;
            $scope.$parent.ShowAlertBox("Warning", "Please select an unpublished shift to publish.", 3000);
        }
    };


    $scope.DELETE_MULTIPLE_SHIFTS_Fn = function (IS_DELETE_WEEK) {
        $scope.DELETE_MULTI_SHIFT_IDS = '';
        $scope.NO_SHIFT_AVAILABLE = true;
        $scope.IS_ANY_APPROVED_SHIFT = false;
        $scope.EMPLOYEE_SHIFTS_LIST.map(function (employeeShift) {
            [0, 1, 2, 3, 4, 5, 6].map(function (value) {
                if (employeeShift['day' + value + '_shift_count'] > 0) {
                    let shiftDays = employeeShift['day' + value + '_shift'];
                    angular.forEach(shiftDays, function (item) {
                        if (item.IS_SHIFT_SELECTED) {
                            if (item.STATUS_ID == 93) {
                                $scope.IS_ANY_APPROVED_SHIFT = true;
                                return;
                            }
                            if ($scope.DELETE_MULTI_SHIFT_IDS.length == 0) {
                                $scope.DELETE_MULTI_SHIFT_IDS += item.SCHDL_SHIFT_ID;
                            } else {
                                $scope.DELETE_MULTI_SHIFT_IDS += ',' + item.SCHDL_SHIFT_ID;
                            }
                        }
                        else if (IS_DELETE_WEEK != undefined && IS_DELETE_WEEK == 1) {
                            if (item.STATUS_ID == 93) {
                                $scope.IS_ANY_APPROVED_SHIFT = true;
                                return;
                            }
                            if ($scope.DELETE_MULTI_SHIFT_IDS.length == 0) {
                                $scope.DELETE_MULTI_SHIFT_IDS += item.SCHDL_SHIFT_ID;
                            } else {
                                $scope.DELETE_MULTI_SHIFT_IDS += ',' + item.SCHDL_SHIFT_ID;
                            }
                        }
                    });

                    $scope.NO_SHIFT_AVAILABLE = false;
                }
            });
        });
        if ($scope.IS_ANY_APPROVED_SHIFT) {
            $scope.$parent.ShowAlertBox("Error", "Approved shifts cannot be deleted.", 3000);
        }
        else {

            $('#delete_multi_shift').modal('show');
        }
    };
    $scope.GET_EMPLOYEE_SHORT_NAME_Fn = function () {
        $scope.AddShiftSearch.SHORT_NAME = $scope.TextReturn($scope.AddShiftSearch.CUSTOM_EMPLOYEE_NAME);
    };
    $scope.BREAK_IN_LIST = [];
    $scope.DISCARD_BREAKS_LIST = [];
    $scope.ADD_NEW_BREAK_IN_Fn = function (BREAK_IN, BREAK_OUT, IS_DISCARDED, TOTAL_MINUTES) {
        $scope.BREAK_IN_LIST.push({ BREAK_ID: 0, BREAK_IN: BREAK_IN || '', BREAK_OUT: BREAK_OUT || '', IS_DISCARDED: false, TOTAL_MINUTES: TOTAL_MINUTES || 0 });
    };
    $scope.InitializeBreaks = function (_break) {
        if (_break.BREAK_IN != null && $scope.AddShiftSearch.STATUS_ID != 93) {
            $scope.UPDATE_TOTAL_DURATION_Fn(_break.BREAK_IN, _break.BREAK_OUT, 4, _break);

        }
        else {
            $scope.UPDATE_TOTAL_DURATION_Fn(_break.APPROVED_BREAK_IN, _break.APPROVED_BREAK_OUT, 4, _break);
        }
    }
    $scope.REMOVE_BREAK_IN_Fn = function (_break) {
        _break.IS_DISCARDED = true;
    };
    $scope.DISCARD_BREAKS_Fn = function (breakObj) {
        breakObj.IS_DISCARDED = true;
    };


    $scope.CHECK_IS_CURRENT_DATE = function (date) {
        let currentDate = new Date($scope.CURRENT_DATE);
        let inputDate = new Date(date);

        let currentYear = currentDate.getFullYear();
        let currentMonth = currentDate.getMonth();
        let currentDay = currentDate.getDate();

        let inputYear = inputDate.getFullYear();
        let inputMonth = inputDate.getMonth();
        let inputDay = inputDate.getDate();

        return (
            currentYear === inputYear &&
            currentMonth === inputMonth &&
            currentDay === inputDay
        );
    };

    $scope.DAY_VIEW_HEADING_LIST = [
        '1a', '2a', '3a', '4a', '5a', '6a', '7a', '8a',
        '9a', '10a', '11a', '12p', '1p', '2p', '3p', '4p',
        '5p', '6p', '7p', '8p', '9p', '10p', '11p', '12a'
    ];
    $scope.GET_SHIFT_LENGTH_CLASS_Fn = function (_shift) {
        if (_shift != null) {
            let shift_length = $scope.calculateDuration(new Date(_shift.SCHEDULED_START), new Date(_shift.SCHEDULED_END), "HOURS");

            _shift.SHIFT_LENGTH_CLASS = `wid_${Math.floor(shift_length) == 1 ? Math.floor(shift_length) : Math.floor(shift_length) + 1}`;
        }
    };

    $scope.DAY_VIEW_UI_Fn = function (_employeeShift) {
        if (_employeeShift != null && _employeeShift.SHIFT_COUNT > 0 && _employeeShift.shifts != undefined) {
            if (_employeeShift.SHIFT_COUNT > 1 && _employeeShift.shifts.length > 0) {
                _employeeShift.shifts.sort(function (a, b) {
                    return new Date(a.SCHEDULED_START) - new Date(b.SCHEDULED_START);
                });
            }
        }
    }
    $scope.EXCEL_FORECAST_VALIDATE = function () {
        $scope.$parent.overlay_loadingNew = 'block';
        $scope.INVALID_EXCLE_CELL_FLAG = false;
        $scope.SubmiteUpload = true;
        $scope.COPY_CODE_ARRY = [];
        $scope.CODE_ARRY = [];
        $scope.INVALID_EXCLE_CELL_COUNT = null;
        $scope.HRM_HOLIDAY_CALENDAR_UPLOAD_TYPE = [];
        $scope.INVALID_INVOICE_CONTACT_LIST = [];
        $scope.ERROR_LIST = [];
        if ($scope.FORECAST_UPLOAD.UploadedFiles != undefined && $scope.FORECAST_UPLOAD.UploadedFiles.length > 0 || document.getElementById('HR_uploadExcel1').value != null && document.getElementById('HR_uploadExcel1').value != '') {
            ModelObj = new Object();
            ModelObj.UPLOAD_TYPE_ID = $scope.FORECAST_UPLOAD.UPLOAD_TYPE_ID;
            ModelObj.SERVER_FILE_NAME = $scope.FORECAST_UPLOAD.UploadedFiles[0].SERVER_FILE_NAME;
            ModelObj.ORIGINAL_FILE_NAME = $scope.FORECAST_UPLOAD.UploadedFiles[0].ORIGINAL_FILE_NAME;
            ModelObj.FILE_PATH = $scope.FORECAST_UPLOAD.UploadedFiles[0].FILE_PATH + $scope.FORECAST_UPLOAD.UploadedFiles[0].SERVER_FILE_NAME;
            // ModelObj.DATETIME_FORMAT_CULTURE = ["MM/dd/yyyy hh:mm:ss tt", "M/d/yyyy hh:mm:ss tt", "MM/dd/yyyy", "M/d/yyyy"];
            ModelObj.DATETIME_FORMAT_CULTURE = $scope.$parent.DATE_FORMATE_CULTURE;
            ModelObj.LANGUAGE_SYMBOL = $scope.$parent.LANGUAGE_SYMBOL;
            //ModelObj.FROM_DATE = $scope.FORECAST_UPLOAD.FROM_DATE;
            //ModelObj.TO_DATE = $scope.FORECAST_UPLOAD.TO_DATE;
            ModelObj.EXCEL_DATATABLE = $scope.FORECAST_TYPE;
            PrcCommMethods.HUMANRESOURCE_API(ModelObj, 'EXCEL_FORECAST_VALIDATE').then(function (data) {
                $scope.HRM_FORECAST_UPLOAD_TYPE = [];
                $scope.submitted = true;
                $scope.INVALID_EXCLE_CELL_COUNT = null;
                $scope.INVALID_FORECAST_LIST = [];
                $scope.ERROR_LIST = data.data.errorlogobj;
                $scope.FORECAST_UPLOAD.MAX_DATE = new Date(data.data.MAX_DATE);
                $scope.FORECAST_UPLOAD.MIN_DATE = new Date(data.data.MIN_DATE);
                if ($scope.ERROR_LIST.length == 0) {
                    if (data.data.IS_VALID_COUNT > 0) {
                        $scope.INVALID_EXCLE_CELL_COUNT = parseInt(data.data.IS_VALID_COUNT);
                        $scope.INVALID_EXCLE_CELL_FLAG = true;
                        $scope.INVALID_FORECAST_LIST = data.data.HEADER_CLOUMN_NAMES;
                        $('#View_Report').modal('show');

                        $scope.$parent.overlay_loadingNew = 'none';
                        angular.element("input[id=HR_uploadExcel1]").val(null);
                        $scope.FORECAST_UPLOAD.UploadedFiles = [];
                    }
                    else if (data.data.error == "CODE_MAX001") {
                        $scope.FORECAST_UPLOAD.UploadedFiles = [];
                        $scope.$parent.ShowAlertBox('Error', 'Please select correct From Date ', 1000);
                        angular.element("input[id=HR_uploadExcel1]").val(null);
                    }
                    else if (data.data.error == "CODE_MIN001") {
                        $scope.FORECAST_UPLOAD.UploadedFiles = [];
                        $scope.$parent.ShowAlertBox('Error', 'Please select correct From Date ', 1000);
                        angular.element("input[id=HR_uploadExcel1]").val(null);
                    }
                    else if (data.data.error == "CODE_DUP001") {
                        $scope.FORECAST_UPLOAD.UploadedFiles = [];
                        $scope.$parent.ShowAlertBox('Warning', 'Duplicate invoice and supplier found', 3000);
                        $scope.submitted = false;
                        $scope.IS_VALID_UPLOAD_FILE = false;
                        $scope.HRM_FORECAST_UPLOAD_TYPE = data.data.HEADER_CLOUMN_NAMES;
                        $scope.DUPLICATE_HRM_FORECAST_UPLOAD_TYPE = data.data.DUPLICATE_DTLS;
                        angular.element("input[id=HR_uploadExcel1]").val(null);
                    }
                    else if (data.data.error == "CODE0001") {
                        $scope.FORECAST_UPLOAD.UploadedFiles = [];
                        $scope.$parent.ShowAlertBox('Warning', 'No changes found in uploaded Excel', 3000);
                        $scope.submitted = false;
                        $scope.IS_VALID_UPLOAD_FILE = false;
                        angular.element("input[id=HR_uploadExcel1]").val(null);
                    }
                    else if (data.data.error == "CODE0003") {
                        $scope.FORECAST_UPLOAD.UploadedFiles = [];
                        angular.element("input[id=HR_uploadExcel1]").val(null);
                        $scope.$parent.ShowAlertBox('Warning', 'Something is wrong in Excel. Please check or enable editing mode in Excel.', 3000);
                        $scope.submitted = false;
                        $scope.IS_VALID_UPLOAD_FILE = false;
                        if (data.data.Msg == 'A malformed URI was found in the document. Please provide a OpenSettings.RelationshipErrorRewriter to handle these errors while opening a package.') {
                            $scope.Message = "";
                            var List = { DISPLAY_TEXT: "", IS_VALID: false, IS_DATA_VALID: true, CODE: "CODE0003" };
                            $scope.CODE_ARRY.push(List);
                            $scope.COPY_CODE_ARRY.push(List);
                        };
                    }
                    else if (data.data.error == "CODE0002") {
                        $scope.FORECAST_UPLOAD.UploadedFiles = [];
                        angular.element("input[id=HR_uploadExcel1]").val(null);
                        $scope.$parent.ShowAlertBox('Warning', 'Invalid Excel,either the column header is deleted or mismatch', 3000);
                        $scope.submitted = false;
                        $scope.IS_VALID_UPLOAD_FILE = false;
                    }
                    else if (data.data.HEADER_CLOUMN_NAMES.length == 0) {
                        $scope.$parent.ShowAlertBox('Warning', 'No record found', 3000);
                        $scope.submitted = false;
                        $scope.IS_VALID_UPLOAD_FILE = false;
                        angular.element("input[id=HR_uploadExcel1]").val(null);
                    }
                    else {
                        $scope.HRM_FORECAST_UPLOAD_TYPE = data.data.HEADER_CLOUMN_NAMES;
                        $scope.INVALID_EXCLE_CELL_FLAG = false;
                        $scope.INVALID_EXCLE_CELL_COUNT = parseInt(data.data.IS_VALID_COUNT);
                        $scope.$parent.ShowAlertBox('Success', 'File validated successfully, please click on upload', 5000);
                        // $scope.INS_INV_RECO_UPLOAD();
                        angular.element("input[id=HR_uploadExcel1]").val(null);
                    }
                }
                else {
                    $scope.HRM_FORECAST_UPLOAD_TYPE = data.data.HEADER_CLOUMN_NAMES;
                    $scope.$parent.overlay_loadingNew = 'none';
                }
            });
        }
        else {
            $scope.$parent.ShowAlertBox('Attention', 'Please Upload File', 3000);
        }
    };
    $scope.COPY_CODE_ARRY = [];
    $scope.CODE_ARRY = [];
    $scope.ngintvalidationvalue = function (key, value) {
        var List
        if (value == "<i class='fa fa-exclamation-triangle text-danger'></i>") {
            List = { DISPLAY_TEXT: "", IS_VALID: true, CODE: 'BLANK' };
            $scope.COPY_CODE_ARRY.push(List);
        }
        else {
            if (key == "COMMENTS") {
            }
            var val = value.split(':;:');
            if (val.length > 1) {
                if (val[1] == "DDL0004") {
                    List = { DISPLAY_TEXT: val[0], IS_VALID: false, IS_DATA_VALID: true, CODE: val[1], Suggestion: val, D_COLUMN_NAME: val[2] };
                    $scope.COPY_CODE_ARRY.push(List);
                }
                else if (val[0] == "UPLOAD0001") {
                    List = { DISPLAY_TEXT: value, IS_VALID: false };
                }
                else {
                    List = { DISPLAY_TEXT: val[0], IS_VALID: false, IS_DATA_VALID: true, CODE: val[1], Suggestion: val };
                    $scope.COPY_CODE_ARRY.push(List);
                }
            }
            else {
                List = { DISPLAY_TEXT: value, IS_VALID: false };
            }
        }
        return List;
    };
    $scope.HRM_UPLOAD_FORECAST = function () {
        var ForecastObj = new Object();
        ForecastObj.BRANCH_ID = $scope.AddShiftSearch.UPLOAD_BRANCH_ID;
        ForecastObj.ENTITY_ID = $scope.AddShiftSearch.ENTITY_ID;
        ForecastObj.USER_ID = $scope.AddShiftSearch.USER_ID;
        ForecastObj.SERVER_FILE_NAME = $scope.FORECAST_UPLOAD.UploadedFiles[0].SERVER_FILE_NAME;
        ForecastObj.ORIGINAL_FILE_NAME = $scope.FORECAST_UPLOAD.UploadedFiles[0].ORIGINAL_FILE_NAME;
        ForecastObj.START_DATE = $scope.$parent.HRM_CHANGE_TIME_ZONE_Fn(new Date($scope.FORECAST_UPLOAD.MIN_DATE));
        ForecastObj.END_DATE = $scope.$parent.HRM_CHANGE_TIME_ZONE_Fn(new Date($scope.FORECAST_UPLOAD.MAX_DATE));
        ForecastObj.EXCEL_DATATABLE = [];
        angular.forEach($scope.HRM_FORECAST_UPLOAD_TYPE, function (_loop_value) {
            var readonly = new Object();
            //readonly.BRANCH_ID = $scope.AddShiftSearch.UPLOAD_BRANCH_ID;
            readonly.FORECAST_DATE = moment.utc(_loop_value.FORECAST_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).local().toDate()
            readonly.FORECAST_VALUE = _loop_value.FORECAST_VALUE;
            ForecastObj.EXCEL_DATATABLE.push(readonly);
        });
        if ($scope.FORECAST_UPLOAD.UPLOAD_TYPE_ID == 54) {
            PrcCommMethods.HUMANRESOURCE_API(ForecastObj, 'HRM_SCHDL_INS_UPD_WAGE_COST_FORECAST').then(function (data) {
                if (data.data == 1) {
                    $scope.$parent.ShowAlertBox('Success', 'Data uploaded successfully', 1000);
                    $('#Upload_Forecast').modal('hide');
                    $scope.HRM_GET_SCHDLS();

                }
                if (data.data == 0) {
                    $scope.$parent.ShowAlertBox('Error', $scope.$parent.SOMETHINGWENTWRONG, 1000);
                }
            });
        }
        else if ($scope.FORECAST_UPLOAD.UPLOAD_TYPE_ID == 55) {
            PrcCommMethods.HUMANRESOURCE_API(ForecastObj, 'HRM_SCHDL_INS_UPD_GUEST_FORECAST').then(function (data) {
                if (data.data == 1) {
                    $scope.$parent.ShowAlertBox('Success', 'Data uploaded successfully', 1000);
                    $('#Upload_Forecast').modal('hide');
                    $scope.HRM_GET_SCHDLS();

                }
                if (data.data == 0) {
                    $scope.$parent.ShowAlertBox('Error', $scope.$parent.SOMETHINGWENTWRONG, 1000);
                }
            });
        }
        else if ($scope.FORECAST_UPLOAD.UPLOAD_TYPE_ID == 56) {
            PrcCommMethods.HUMANRESOURCE_API(ForecastObj, 'HRM_SCHDL_INS_UPD_SALES_FORECAST').then(function (data) {
                if (data.data == 1) {
                    $scope.$parent.ShowAlertBox('Success', 'Data uploaded successfully', 1000);
                    $('#Upload_Forecast').modal('hide');
                    $scope.HRM_GET_SCHDLS();
                    $scope.AddShiftSearch.UPLOAD_BRANCH_ID = "";
                }
                if (data.data == 0) {
                    $scope.$parent.ShowAlertBox('Error', $scope.$parent.SOMETHINGWENTWRONG, 1000);
                }
            });
        }

    }
    //$scope.GET_SHIFT_Fn = function (_employeeShift, index) {
    //    if (_employeeShift.SHIFT_COUNT > 0 && _employeeShift.shifts != undefined && _employeeShift.shifts.length > 0) {
    //        var foundData = _employeeShift.shifts.find(x => (new Date(x.SCHEDULED_START).getHours() - 1) == index);
    //        if (foundData != undefined) {
    //            return foundData;
    //        } else {
    //            return null;
    //        }

    //    } else {
    //        return null;
    //    }
    //}

    $scope.HRM_GET_SECTIONS();
    $scope.TEXT_SEARCH = '';
    $scope.Fn_SHIFT_TAB_CLICK = function (_tabId) {
        $scope.ADD_SHIFT_TAB_ID = _tabId;
    };
    $scope.Fn_SHIFT_TAB_CLICK(2);
    $scope.$parent.$parent.child_scope = $scope;
    $scope.$parent.$parent.DateInputLoad('', 1);

    $scope.PRIN_PDF_SCHEDULE = function () {
        window.scrollTo(0, 0);
        const node = document.getElementById("divSchedule");
        const clone = node.cloneNode(true);
        var elements = clone.getElementsByClassName("HIDEINPDF");
        var elements_count = elements.length;
        if (elements != undefined) {
            for (var i = elements_count - 1; i >= 0; i--) {
                elements[i].remove();
            }
        }
        html2canvas(document.body.appendChild(clone), { useCORS: true, scale: 2 }).then(function (canvas) {
            var imgBase64 = canvas.toDataURL('image/jpeg', 2.0);
            var doc = "";
            var canvashight = canvas.height;
            doc = new jsPDF("l", "pt", [canvas.width, canvashight]);//doc = new jsPDF("p", "pt",[pdfWidth,htmlHeight]);

            const pageWidth = doc.internal.pageSize.width;
            const pageHeight = doc.internal.pageSize.height;
            const widthRatio = pageWidth / canvas.width;
            const heightRatio = pageHeight / canvashight;
            const ratio = widthRatio > heightRatio ? heightRatio : widthRatio;
            const canvasHeight = canvashight * ratio;
            const ratio_1 = heightRatio > widthRatio ? widthRatio : heightRatio;
            const canvasWidth = canvas.width * ratio_1;
            doc.addImage(imgBase64, 'PNG', 8, 15, canvasWidth, canvasHeight); //(img,Left,Top,Width,Height)
            doc.save('Schedule.pdf');

        });
        document.body.removeChild(clone);
        $(".dropdown-menu").removeClass("show");
    }


    $scope.CONVERT_TO_EXCEL_CSV = function (data_table) {
        $scope.EXCEL_REPORT_DATA_LIST = [];
        $scope.JSON_COLUMN_NAME = Object.keys(data_table[0]);
        angular.forEach(data_table, function (item) {
            $scope.SELECTED_DATA = [];
            for (var i = 0; i < $scope.JSON_COLUMN_NAME.length; i++) {
                item[$scope.JSON_COLUMN_NAME[i]] == null ? item[$scope.JSON_COLUMN_NAME[i]] = "" : item[$scope.JSON_COLUMN_NAME[i]] = item[$scope.JSON_COLUMN_NAME[i]];
                item[$scope.JSON_COLUMN_NAME[i]] = moment(item[$scope.JSON_COLUMN_NAME[i]], "YYYY-MM-DDTHH:mm:ss", true).isValid() ? item[$scope.JSON_COLUMN_NAME[i]] = moment(item[$scope.JSON_COLUMN_NAME[i]], "YYYY-MM-DDTHH:mm:ss").format("DD/MM/YYYY hh:mm A") : item[$scope.JSON_COLUMN_NAME[i]] = item[$scope.JSON_COLUMN_NAME[i]];
            }
            $scope.EXCEL_REPORT_DATA_LIST.push(item);
        });

        alasql('SELECT * INTO XLSX("Schedule",{headers:true}) FROM ?', [$scope.EXCEL_REPORT_DATA_LIST]);
        $(".dropdown-menu").removeClass("show");
    };

});

