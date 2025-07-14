app.controller('EmpReportingController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(2);
    $scope.HR_COMMON_CODE_Fn();
    $scope.DD_DEFAULT_TEXT = $scope.$parent.DD_DEFAULT_TEXT;
    $scope.FETCHED_DATA_FROM_DB = [];
    $scope.ACTUAL_REPORT_DATA = [];
    $scope.SECTION_LIST = [{ "SECTION_ID": "1", "SECTION_NAME": "Personal Details" }, { "SECTION_ID": "2", "SECTION_NAME": "Employment Info" }, { "SECTION_ID": "3", "SECTION_NAME": "Wages" }, { "SECTION_ID": "4", "SECTION_NAME": "Access" }];

    $scope.ReportSearch = {
        IS_PAGE_LOAD_FIRST_TIME: 0,
        CUSTOMER_ID: $cookies.get("CUSTOMER_ID"),
        MODULE_ID: parseInt($cookies.get("MODULE_ID")),
        USER_ID: parseInt($cookies.get("USERID")),
        ENTITY_ID: $cookies.get("ENTITY_ID"),
        EMPLY_PRSNL_ID: $cookies.get("EMPLY_PRSNL_ID"),
        DD_DEFAULT_TEXT: $scope.$parent.DD_DEFAULT_TEXT,
        DEPARTMENT_DEFAULT_TEXT: 'Department',
        POSITION_DEFAULT_TEXT: 'Position',
        BRANCH_DEFAULT_TEXT: 'Site',
        PAYTYPE_DEFAULT_TEXT: 'Pay Type',
        VIEW_BY_DEFAULT_TEXT: 'View By',
        ROLE_DEFAULT_TEXT: 'Standerd Role',
        HOLIDAY_PLAN_DEFAULT_TEXT: 'Holiday Plan',
        ORDER_BY_DEFAULT_TEXT: 'None',
        ABSENCE_DEFAULT_TEXT: 'Absance Type',
        TERMINATION_REASONS_DEFAULT_TEXT: 'Termination Reson',
        FREQUENCY_NAME_DEFAULT_TEXT: 'Pay Schedule',
        SECTION_DEFAULT_TEXT: 'Section',
        DEPARTMENT_NAME: null,
        DEPARTMENT_ID: null,
        POSITION_NAME: null,
        POSITION_ID: null,
        BRANCH_NAME: null,
        BRANCH_ID: null,
        PAYTYPE_ID: null,
        PAYTYPE_NAME: null,
        VIEW_BY_ID: null,
        VIEW_BY_NAME: null,
        ABSENCE_TYPE: null,
        ABSENCE_TYPE_ID: null,
        TERMINATION_REASONS_ID: null,
        TERMINATION_REASONS_NAME: null,
        VIEW_BY_LIST: [{ "VIEW_BY_ID": 1, "VIEW_BY_NAME": "Day" }, { "VIEW_BY_ID": 2, "VIEW_BY_NAME": "Week" }, { "VIEW_BY_ID": 3, "VIEW_BY_NAME": "Custom" }],
        ORDER_BY_LIST: [{ "ORDER_BY_ID": 2, "ORDER_BY_NAME": "Employee Name" }, { "ORDER_BY_ID": 3, "ORDER_BY_NAME": "Site" }, { "ORDER_BY_ID": 4, "ORDER_BY_NAME": "Department" }, { "ORDER_BY_ID": 5, "ORDER_BY_NAME": "Position" }],
        ORDER_BY_LIST_40: [{ "ORDER_BY_ID": 2, "ORDER_BY_NAME": "Employee" }, { "ORDER_BY_ID": 3, "ORDER_BY_NAME": "Site" }, { "ORDER_BY_ID": 4, "ORDER_BY_NAME": "Department" }, { "ORDER_BY_ID": 5, "ORDER_BY_NAME": "Position" }],
        ORDER_BY_FILTER_LIST: [{ "ORDER_BY_ID": 1, "ORDER_BY_NAME": "None" }, { "ORDER_BY_ID": 2, "ORDER_BY_NAME": "EMPLOYEE_NAME" }, { "ORDER_BY_ID": 3, "ORDER_BY_NAME": "SITE" }, { "ORDER_BY_ID": 4, "ORDER_BY_NAME": "DEPARTMENT" }, { "ORDER_BY_ID": 5, "ORDER_BY_NAME": "POSITION" }],
        ORDER_BY_FILTER_LIST_40: [{ "ORDER_BY_ID": 1, "ORDER_BY_NAME": "None" }, { "ORDER_BY_ID": 2, "ORDER_BY_NAME": "EMPLOYEE_NAME" }, { "ORDER_BY_ID": 3, "ORDER_BY_NAME": "SITE" }, { "ORDER_BY_ID": 4, "ORDER_BY_NAME": "DEPARTMENT" }, { "ORDER_BY_ID": 5, "ORDER_BY_NAME": "POSITION" }],
        ROLE_ID: null,
        ROLE_NAME: null,
        REPORT_ID: null,
        REPORT_NAME: null,
        START_DATE: null,
        END_DATE: null,
        SORT_COLUMN_NO: 1,
        SORT_ORDER_NO: 1,
        ENTITLEMENT_NAME: null,
        HOLIDAY_ENTITLEMENT_ID: null,
        REPORT_OBJECT: null,
        IS_LAZY_LOAD_CLICKED: false,
        PAGE_NO: 1,
        PAGE_SIZE: 2000,
        INITIAL_START_DATE: null,
        INITIAL_END_DATE: null,
        SINGLE_DATE_CONTROL_DISPLAY: true,
        WEEK_DATE_CONTROL_DISPLAY: false,
        CALENDAR_DATE_CONTROL_DISPLAY: false,
        DEPARTMENT_IDS: [],
        POSITION_IDS: [],
        PAY_TYPE_IDS: [],
        ABS_TYPE_IDS: [],
        TERMINATION_REASON_IDS: [],
        SITE_IDS: [],
        ROLES_ASSIGNMENT_IDS: [],
        HOLIDAY_ENTITLEMENT_IDS: [],
        REPORT_USER_COLUMN_MAPPING_TYPE: [],
        SEARCH: '',
        SITES: [],
        DEPARTMENTS: [],
        POSITIONS: [],
        PAY_TYPES: [],
        ABSENCE_TYPES: [],
        TERMINATION_REASONS: [],
        ROLES_ASSIGNMENTS: [],
        PAYSCHEDULE_BY_ID_LIST: [],
        SECTION_IDS: [],
        SECTIONS: [],
        PAYSCHEDULE_ID: null,
        REPORT_CALANDER_DATE_FORMAT: "DD/MMM/yyyy",
        PARAMETER_CALANDER_DATE_FORMAT: "MM/DD/yyyy",
        DEFAULT_DDMMYYY_CALANDER_DATE_FORMAT: 'dd/M/yyyy',
        TOTAL_SCHEDULED_DURATION: 0
    };

    /* Based on Report type fetch filter data and fill  */
    $scope.REPORT_COLUMN_MAPPING_Fn = function (_rpt) {
        var CusModelObj = new Object();
        CusModelObj.USER_ID = $scope.ReportSearch.USER_ID;
        CusModelObj.ENTITY_ID = $scope.ReportSearch.ENTITY_ID;

        CusModelObj.REPORT_ID = _rpt.REPORT_ID;
        PrcCommMethods.REPORT_API(CusModelObj, 'REPORT_COLUMN_MAPPING').then(function (data) {
            if (data.data.Table.length > 0) {

                $scope.ReportSearch.SITE_FLAG = false;
                $scope.ReportSearch.DEPARTMENT_FLAG = false;
                $scope.ReportSearch.POSITION_FLAG = false;
                $scope.ReportSearch.PAYTYPE_FLAG = false;
                $scope.ReportSearch.DATERANGE_FLAG = false;
                $scope.ReportSearch.GROUPBY_FLAG = false;
                $scope.ReportSearch.ABSENCE_FLAG = false;
                $scope.ReportSearch.SINGLEDATE_SELECTION_FLAG = false;
                $scope.ReportSearch.TERMINATION_REASON_FLAG = false;
                $scope.ReportSearch.SINGLE_DATE_CONTROL_DISPLAY = false;
                $scope.ReportSearch.WEEK_DATE_CONTROL_DISPLAY = false;
                $scope.ReportSearch.CALENDAR_DATE_CONTROL_DISPLAY = false;
                $scope.ReportSearch.STANDARD_ROLE_FLAG = false;
                $scope.ReportSearch.PAYSCHEDULE_FLAG = false;
                $scope.ReportSearch.SECTION_FLAG = false;

                $scope.ReportSearch.PAYSCHEDULE_NAME = $scope.ReportSearch.FREQUENCY_NAME_DEFAULT_TEXT;
                $scope.ReportSearch.PAY_SCHEDULE_ID = '';


                $scope.REPORT_FILTERS_LIST = data.data.Table;
                $scope.SET_FIELDS_LIST = data.data.Table1;
                angular.forEach($scope.REPORT_FILTERS_LIST, function (item) {
                    switch (item.FILTER_ID) {
                        case 1:
                            $scope.ReportSearch.DEPARTMENT_FLAG = true;
                            break;
                        case 2:
                            $scope.ReportSearch.POSITION_FLAG = true;
                            break;
                        case 3:
                            $scope.ReportSearch.PAYTYPE_FLAG = true;
                            break;
                        case 4:
                            // code block
                            break;
                        case 5:
                            $scope.ReportSearch.GROUPBY_FLAG = true;
                            break;
                        case 6:
                            $scope.ReportSearch.SITE_FLAG = true;
                            break;
                        case 7:
                            break;
                        case 8:
                            break;
                        case 9:
                            {
                                if ($scope.ReportSearch.REPORT_OBJECT != null && $scope.ReportSearch.REPORT_OBJECT.REPORT_ID == 40) {
                                    $scope.ReportSearch.DATERANGE_FLAG = false;
                                    $scope.ReportSearch.CALENDAR_DATE_CONTROL_DISPLAY = false;
                                }
                                else {
                                    $scope.ReportSearch.DATERANGE_FLAG = true;
                                    $scope.ReportSearch.CALENDAR_DATE_CONTROL_DISPLAY = true;
                                }
                            }
                            break;
                        case 10:
                            {
                                $scope.ReportSearch.SINGLEDATE_SELECTION_FLAG = true;
                                $scope.ReportSearch.SINGLE_DATE_CONTROL_DISPLAY = true;
                            }
                            break;
                        case 11:
                            $scope.ReportSearch.ABSENCE_FLAG == true;
                            break;
                        case 12:
                            $scope.ReportSearch.TERMINATION_REASON_FLAG = true;
                            break;
                        case 13:
                            $scope.ReportSearch.STANDARD_ROLE_FLAG = true;
                            break;
                        case 14:
                            break;
                        case 15:
                            $scope.ReportSearch.PAYSCHEDULE_FLAG = true;
                            break;
                        case 16:
                            $scope.ReportSearch.SITE_FLAG = false;
                            $scope.ReportSearch.DEPARTMENT_FLAG = false;
                            $scope.ReportSearch.POSITION_FLAG = false;
                            $scope.ReportSearch.SECTION_FLAG = true;
                            break;
                        default:
                        // code block
                    }

                });
                $scope.SET_FIELDS_ALL = $scope.SET_FIELDS_LIST.filter(p => p.SHOW_FLAG == true).length == $scope.SET_FIELDS_LIST.length ? true : false;
            }
            if (data.data.Table.length == 0) {
                $scope.$parent.ShowAlertBox("Attention", 'Report filter not found.', 3000);
                $scope.SET_FIELDS_ALL = false;
            }
        });
    };
    $scope.HRM_GET_DEPARTMENTS_Fn = function () {
        $scope.SHOW_WARNING_MESSAGE_FOR_DEPARTMENT = false;
        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_ID = $scope.ReportSearch.CUSTOMER_ID;
        CusModelObj.ENTITY_ID = null;
        CusModelObj.PAGE_NO = 0;
        CusModelObj.PAGE_SIZE = 0;
        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_GET_DEPARTMENTS').then(function (data) {
            $scope.ReportSearch.DEPARTMENT_IDS = [];
            if (data.data != null && data.data.Table.length > 0) {
                $scope.DEPARTMENTS_LIST = data.data.Table;
                angular.forEach($scope.DEPARTMENTS_LIST, function (item) {
                    var _obj = new Object();
                    _obj.TABLE_ID = item.DEPARTMENT_ID;
                    $scope.ReportSearch.DEPARTMENT_IDS.push(_obj);
                    $scope.ReportSearch.DEPARTMENTS.push(item.DEPARTMENT_NAME);
                    item.IS_SELECTED = true;
                });
            }
            else {
                $scope.DEPARTMENTS_LIST = data.data.Table.length > 0 ? data.data.Table : [];
                angular.forEach($scope.DEPARTMENTS_LIST, function (item) {
                    var _obj = new Object();
                    _obj.TABLE_ID = "";
                    $scope.ReportSearch.DEPARTMENT_IDS.push(_obj);
                });
                //$scope.$parent.DEPARTMENTS_LIST.push(angular.copy($scope.BLANK_DEPARTMENT));
            }

        });
    }; $scope.HRM_GET_DEPARTMENTS_Fn();
    $scope.HRM_GET_POSITIONS_Fn = function () {
        $scope.SHOW_WARNING_MESSAGE_FOR_POSITION = false;
        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_ID = $scope.ReportSearch.CUSTOMER_ID;
        CusModelObj.ENTITY_ID = null;
        CusModelObj.PAGE_NO = 0;
        CusModelObj.PAGE_SIZE = 0;
        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_GET_POSITIONS').then(function (data) {
            $scope.ReportSearch.POSITION_IDS = [];
            if (data.data != null && data.data.Table.length > 0) {
                $scope.POSITIONS_LIST = data.data.Table;
                angular.forEach($scope.POSITIONS_LIST, function (item) {
                    var _obj = new Object();
                    _obj.TABLE_ID = item.POSITION_ID;
                    $scope.ReportSearch.POSITION_IDS.push(_obj);
                    $scope.ReportSearch.POSITIONS.push(item.POSITION_NAME);
                });

            } else {
                $scope.POSITIONS_LIST = data.data.Table.length > 0 ? data.data.Table : [];
                angular.forEach($scope.POSITIONS_LIST, function (item) {
                    var _obj = new Object();
                    _obj.TABLE_ID = "-1";
                    $scope.ReportSearch.POSITION_IDS.push(_obj);
                });
                //$scope.$parent.POSITIONS_LIST.push(angular.copy($scope.BLANK_POSITION));
            }

        });
    }; $scope.HRM_GET_POSITIONS_Fn();
    $scope.HRM_GET_PAYTYPES_Fn = function () {
        var reportObj = new Object()
        PrcCommMethods.HUMANRESOURCE_API(reportObj, 'HRM_GET_PAYTYPES').then(function (data) {
            $scope.ReportSearch.PAY_TYPE_IDS = [];
            if (data.data != null && data.data.Table.length > 0) {
                $scope.PAYTYPES_LIST = data.data.Table;
                angular.forEach($scope.PAYTYPES_LIST, function (item) {
                    var _obj = new Object();
                    _obj.TABLE_ID = item.PAYTYPE_ID;
                    $scope.ReportSearch.PAY_TYPE_IDS.push(_obj);
                    $scope.ReportSearch.PAY_TYPES.push(item.PAY_TYPE);
                    item.IS_SELECTED = true;
                });
            }
            else {
                $scope.POSITIONS_LIST = [];
                angular.forEach($scope.PAYTYPES_LIST, function (item) {
                    var _obj = new Object();
                    _obj.TABLE_ID = "-1";
                    $scope.ReportSearch.PAY_TYPE_IDS.push(_obj);
                });
            }
        });
    }; $scope.HRM_GET_PAYTYPES_Fn();
    $scope.HRM_GET_ABSENCE_TYPES_Fn = function () {
        var reportObj = new Object();
        reportObj.CUSTOMER_ID = $scope.ReportSearch.CUSTOMER_ID;
        reportObj.ENTITY_ID = $scope.ReportSearch.ENTITY_ID;
        PrcCommMethods.HUMANRESOURCE_API(reportObj, 'HRM_GET_ABSENCE_TYPES').then(function (data) {
            $scope.ReportSearch.ABS_TYPE_IDS = [];
            if (data.data != null && data.data.Table.length > 0) {
                $scope.ABSENCE_TYPE_LIST = data.data.Table;
                angular.forEach($scope.ABSENCE_TYPE_LIST, function (item) {
                    var _obj = new Object();
                    _obj.TABLE_ID = item.ABSENCE_TYPE_ID;
                    $scope.ReportSearch.ABS_TYPE_IDS.push(_obj);
                    $scope.ReportSearch.ABSENCE_TYPES.push(item.ABSENCE_TYPE);
                    item.IS_SELECTED = true;
                });
            } else {
                $scope.ABSENCE_TYPE_LIST = [];
                angular.forEach($scope.ABSENCE_TYPE_LIST, function (item) {
                    var _obj = new Object();
                    _obj.TABLE_ID = "-1";
                    $scope.ReportSearch.ABS_TYPE_IDS.push(_obj);
                });
            }
        });
    }; $scope.HRM_GET_ABSENCE_TYPES_Fn();
    $scope.HRM_GET_TERMINATION_REASONS_Fn = function () {
        var reportObj = new Object();
        reportObj.CUSTOMER_ID = $scope.ReportSearch.CUSTOMER_ID;
        reportObj.ENTITY_ID = $scope.ReportSearch.ENTITY_ID;
        PrcCommMethods.HUMANRESOURCE_API(reportObj, 'HRM_GET_TERMINATION_REASONS').then(function (data) {
            $scope.ReportSearch.TERMINATION_REASON_IDS = [];
            if (data.data != null && data.data.Table.length > 0) {
                $scope.TERMINATION_REASONS_LIST = data.data.Table;
                angular.forEach($scope.TERMINATION_REASONS_LIST, function (item) {
                    var _obj = new Object();
                    _obj.TABLE_ID = item.TERMINATION_REASONS_ID;
                    $scope.ReportSearch.TERMINATION_REASON_IDS.push(_obj);
                    $scope.ReportSearch.TERMINATION_REASONS.push(item.TERMINATION_REASONS_NAME);
                    item.IS_SELECTED = true;
                });
            }
            else {
                $scope.TERMINATION_REASONS_LIST = [];
                angular.forEach($scope.TERMINATION_REASONS_LIST, function (item) {
                    var _obj = new Object();
                    _obj.TABLE_ID = "";
                    $scope.ReportSearch.TERMINATION_REASON_IDS.push(_obj);
                });
            }
        });
    }; $scope.HRM_GET_TERMINATION_REASONS_Fn();
    $scope.ADMIN_GET_BRANCH_LIST_fn = function () {
        var UserModelObj = new Object();
        UserModelObj.CUSTOMER_ID = $scope.ReportSearch.CUSTOMER_ID;
        UserModelObj.ENTITY_ID = $cookies.get("ENTITY_ID");
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'ADMIN_GET_BRANCH_LIST').then(function (data) {
            $scope.ReportSearch.SITE_IDS = [];
            if (data.data != null && data.data.Table.length > 0) {
                $scope.HR_BRANCH_LIST = data.data.Table;
                angular.forEach($scope.HR_BRANCH_LIST, function (item) {
                    var _obj = new Object();
                    _obj.TABLE_ID = item.BRANCH_ID;
                    $scope.ReportSearch.SITE_IDS.push(_obj);
                    $scope.ReportSearch.SITES.push(item.BRANCH_NAME);
                    item.IS_SELECTED = true;
                });
            }
            else {
                $scope.HR_BRANCH_LIST = [];
                angular.forEach($scope.HR_BRANCH_LIST, function (item) {
                    var _obj = new Object();
                    _obj.TABLE_ID = "";
                    $scope.ReportSearch.SITE_IDS.push(_obj);
                });
            }
        });
    }; $scope.ADMIN_GET_BRANCH_LIST_fn();
    $scope.HRM_GET_ACCESS_ROLES_ASSIGNMENT = function (FLAG) {
        $scope.ACCESS_ROLES_ASSIGNMENT_LIST = [];
        var UserModelObj = new Object();
        UserModelObj.CUSTOMER_ID = $scope.ReportSearch.CUSTOMER_ID;
        UserModelObj.MODULE_ID = $scope.ReportSearch.MODULE_ID;
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'GET_MODULE_ROLES').then(function (data) {
            $scope.ReportSearch.ROLES_ASSIGNMENT_IDS = [];
            if (data.data != null && data.data.Table.length > 0) {
                $scope.ACCESS_ROLES_ASSIGNMENT_LIST = data.data.Table;
                angular.forEach($scope.ACCESS_ROLES_ASSIGNMENT_LIST, function (item) {
                    var _obj = new Object();
                    _obj.TABLE_ID = item.STANDARD_ROLE_ID;
                    $scope.ReportSearch.ROLES_ASSIGNMENT_IDS.push(_obj);
                    $scope.ReportSearch.ROLES_ASSIGNMENTS.push(item.ROLE_NAME);
                    item.IS_SELECTED = true;
                });
            }
            else {
                $scope.ACCESS_ROLES_ASSIGNMENT_LIST = [];
                angular.forEach($scope.ACCESS_ROLES_ASSIGNMENT_LIST, function (item) {
                    var _obj = new Object();
                    _obj.TABLE_ID = "";
                    $scope.ReportSearch.ROLES_ASSIGNMENT_IDS.push(_obj);
                });
            }
        });
    }; $scope.HRM_GET_ACCESS_ROLES_ASSIGNMENT();
    $scope.HRM_GET_HOLIDAY_ENTITLEMENTS = function () {
        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_ID = $scope.ReportSearch.CUSTOMER_ID;
        CusModelObj.ENTITY_ID = $scope.ReportSearch.ENTITY_ID;;
        CusModelObj.PAGE_NO = 0;
        CusModelObj.PAGE_SIZE = 0;
        CusModelObj.SORT_COLUMN_NO = $scope.ReportSearch.SORT_COLUMN_NO;
        CusModelObj.SORT_ORDER_NO = $scope.ReportSearch.SORT_ORDER_NO;
        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_GET_HOLIDAY_ENTITLEMENTS').then(function (data) {
            $scope.ReportSearch.HOLIDAY_ENTITLEMENT_IDS = [];
            if (data.data != null && data.data.Table.length > 0) {
                $scope.$parent.HOLIDAY_ENTITLEMENTS_LIST = data.data.Table;
                angular.forEach($scope.HOLIDAY_ENTITLEMENTS_LIST, function (item) {
                    var _obj = new Object();
                    _obj.TABLE_ID = item.HOLIDAY_ENTITLEMENT_ID;
                    $scope.ReportSearch.HOLIDAY_ENTITLEMENT_IDS.push(_obj);
                });
            }
            else {
                $scope.$parent.HOLIDAY_ENTITLEMENTS_LIST = [];
                angular.forEach($scope.HOLIDAY_ENTITLEMENTS_LIST, function (item) {
                    var _obj = new Object();
                    _obj.TABLE_ID = "";
                    $scope.ReportSearch.HOLIDAY_ENTITLEMENT_IDS.push(_obj);
                });
            }
        });
    }; $scope.HRM_GET_HOLIDAY_ENTITLEMENTS();
    $scope.HRM_GET_PAYSCHEDULES = function () {
        var RepModelObj = new Object();
        RepModelObj.CUSTOMER_ID = $scope.ReportSearch.CUSTOMER_ID;
        RepModelObj.ENTITY_ID = null;
        RepModelObj.PAGE_NO = $scope.ReportSearch.PAGE_NO;
        RepModelObj.PAGE_SIZE = $scope.ReportSearch.PAGE_SIZE;
        PrcCommMethods.HUMANRESOURCE_API(RepModelObj, 'HRM_GET_PAYSCHEDULES').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.ReportSearch.PAY_SCHEDULE_LIST = data.data.Table;
            }
            else {
                $scope.ReportSearch.PAY_SCHEDULE_LIST = [];
            }
        });
    }; $scope.HRM_GET_PAYSCHEDULES();

    $scope.HRM_GET_SECTIONS_Fn = function () {
        $scope.ReportSearch.SECTION_IDS = [];
        angular.forEach($scope.SECTION_LIST, function (item) {
            var _obj = new Object();
            _obj.TABLE_ID = item.SECTION_ID;
            $scope.ReportSearch.SECTION_IDS.push(_obj);
            $scope.ReportSearch.SECTIONS.push(item.SECTION_NAME);
            item.IS_SELECTED = true;
        });


    }; $scope.HRM_GET_SECTIONS_Fn();
    /**Report Button display */
    $scope.GET_REPORT_BY_USER_ID = function () {//return sp name with parameter 

        var CusModelObj = new Object();
        CusModelObj.USER_ID = $scope.ReportSearch.USER_ID;
        CusModelObj.ENTITY_ID = $scope.ReportSearch.ENTITY_ID;
        CusModelObj.MODULE_ID = $scope.ReportSearch.MODULE_ID;
        PrcCommMethods.REPORT_API(CusModelObj, 'GET_REPORT_BY_USER_ID').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.$parent.ASSIGNED_REPORT_LIST = data.data.Table;
                $scope.REPORT_COLUMN_MAPPING_Fn($scope.$parent.ASSIGNED_REPORT_LIST[0]);
                $scope.IS_REPORT_BUTTON_SELECTED_Fn($scope.$parent.ASSIGNED_REPORT_LIST[0], 1);
            }
            if (data.data.Table.length == 0) {
                document.getElementById("loader").style.display = "none";
                $scope.$parent.ShowAlertBox("Attention", 'You don’t have access to view reports. Please contact your administrator.', 3000);
            }
        });
    }; $scope.GET_REPORT_BY_USER_ID();
    /**Mark active when report button clicked(top) */
    $scope.IS_REPORT_BUTTON_SELECTED_Fn = function (RPT_OBJ, waitParamenter) {
        $scope.ReportSearch.TOTAL_SCHEDULED_DURATION = 0;
        document.getElementById("loader").style.display = "block";
        $scope.FETCHED_DATA_FROM_DB = [];
        $scope.ACTUAL_REPORT_DATA = [];
        $scope.ReportSearch.SEARCH = "";
        $scope.ReportSearch.PAGE_NO = 1;
        $scope.$parent.ASSIGNED_REPORT_LIST.map((item) => {
            item.REPORT_ID == RPT_OBJ.REPORT_ID ? item.IS_SELECTED = true : item.IS_SELECTED = false;
        });
        // $('#Pay_Shcedule_Date_Selected span').html("");
        $scope.ReportSearch.REPORT_ID = RPT_OBJ.REPORT_ID;
        $scope.ReportSearch.REPORT_OBJECT = RPT_OBJ;
        if (RPT_OBJ.REPORT_ID != 43 && RPT_OBJ.REPORT_ID != 40) { $scope.CLICK_VIEWBY_VIEW_Fn(''); }
        else {
            if (RPT_OBJ.REPORT_ID != 40) {
                $scope.ReportSearch.DATE_FILTER = moment().format($scope.ReportSearch.REPORT_CALANDER_DATE_FORMAT);
                $scope.ReportSearch.START_DATE = moment().format($scope.ReportSearch.PARAMETER_CALANDER_DATE_FORMAT);
                $scope.ReportSearch.END_DATE = moment().format($scope.ReportSearch.PARAMETER_CALANDER_DATE_FORMAT);
                if (waitParamenter = 1) {
                    setTimeout(() => {
                        $scope.FETCHED_DATA_FROM_DB = [];
                        $scope.ACTUAL_REPORT_DATA = [];
                        $scope.GET_REPORT_DATA($scope.ReportSearch.REPORT_OBJECT);
                    }, 2000);
                }
                else {
                    $scope.FETCHED_DATA_FROM_DB = [];
                    $scope.ACTUAL_REPORT_DATA = [];
                    $scope.GET_REPORT_DATA($scope.ReportSearch.REPORT_OBJECT);
                }
            }
            else {
                $scope.ReportSearch.BranchALL = true;
                $scope.ReportSearch.DepartmentALL = true;
                $scope.ReportSearch.PositionALL = true;
                $scope.ReportSearch.PaytypeALL = true;
                $scope.ReportSearch.AbsenceALL = true;
                $scope.ReportSearch.SectionALL = true;
                $scope.ReportSearch.TerminationReasonALL = true;
                $scope.ReportSearch.StandardRoleALL = true;
                $scope.ReportSearch.SectionALL = true;
                document.getElementById("loader").style.display = "none";
                $scope.RESET_ALL_CONTROL_CHECKBOX_AS_SELECTED();
            }
        }

        //$scope.dateinputddmmyy(1);
        //let date = new Date($scope.ReportSearch.START_DATE);
        //$scope.ReportSearch.END_DATE = new Date(new Date($scope.ReportSearch.START_DATE).getFullYear(), new Date($scope.ReportSearch.START_DATE).getMonth() + 1, 0);      

    };

    /**Fetching data based on report id with case statement*/
    $scope.GET_REPORT_DATA_BY_REPORT_ID = function () {

        if ($scope.ReportSearch.REPORT_ID != '' && $scope.ReportSearch.REPORT_ID != null) {

            switch ($scope.ReportSearch.REPORT_ID) {
                case 41:
                    $scope.REPORT_LABOUR_VARIANCE_Fn();
                    break;
                case 2:
                    $scope.HRM_GET_POSITIONS_Fn();
                    break;
                case 3:
                    $scope.HRM_GET_PAYTYPES_Fn();
                    break;
                case 4:
                    // code block
                    break;
                case 5:
                    // code block
                    break;
                case 6:
                    $scope.ADMIN_GET_BRANCH_LIST_fn();
                    break;
                case 7:
                    // code block
                    break;
                case 8:
                    $scope.HRM_GET_ACCESS_ROLES_ASSIGNMENT();
                    break;
                case 9:
                    // code block
                    break;
                case 10:
                    // code block
                    break;
                case 11:
                    // code block
                    break;
                case 12:
                    // code block
                    break;
                default:
                // code block
            }
        }
    };
    $scope.ShowHideColumns = function (field) {

        elements = document.getElementsByName(field.REPORT_COLUMN_MAPPING_MASTER_ID);
        for (var i = 0; i < elements.length; i++) {
            field.SHOW_FLAG ? elements[i].style.removeProperty('display') : elements[i].style.setProperty('display', 'none');
        }
        $scope.COLUMNS_LIST.filter(x => x.REPORT_COLUMN_MAPPING_MASTER_ID == field.REPORT_COLUMN_MAPPING_MASTER_ID)[0]["SHOW_FLAG"] = field.SHOW_FLAG;
    };
    $scope.ShowHideColumns_All = function (field) {
        angular.forEach(field.filter(p => p.UNEDITABLE == false), function (item) {
            elements = document.getElementsByName(item.REPORT_COLUMN_MAPPING_MASTER_ID);
            for (var i = 0; i < elements.length; i++) {
                item.SHOW_FLAG ? elements[i].style.removeProperty('display') : elements[i].style.setProperty('display', 'none');
            }
            $scope.COLUMNS_LIST.filter(x => x.REPORT_COLUMN_MAPPING_MASTER_ID == item.REPORT_COLUMN_MAPPING_MASTER_ID)[0]["SHOW_FLAG"] = item.SHOW_FLAG;
        });

    };
    $scope.ShowHideRows = function (row, iscollapsed) {
        if (row.PARENT_ID == 0) {
            if (iscollapsed != undefined) {
                row.SHOW_FLAG = iscollapsed;
            }
            else {
                row.SHOW_FLAG = !row.SHOW_FLAG;
            }
            $scope.FETCHED_DATA_FROM_DB.filter(y => y.PARENT_ID == row.ROW_ID ? y.SHOW_FLAG = row.SHOW_FLAG : '');

        }
        //elements = document.getElementsByName('row' + row.ROW_ID);
        //for (var i = 0; i < elements.length; i++) {
        //    !row.SHOW_FLAG ? elements[i].style.removeProperty('display') : elements[i].style.setProperty('display', 'none');
        //}

    };
    /**By report id fetch data from DB */

    $scope.FILTER_DATA = function () {
        $scope.FETCHED_DATA_FROM_DB = angular.copy($filter('filter')($scope.ACTUAL_REPORT_DATA, function (_record) {
            result = false;
            $scope.search_Flag = false;
            if ($scope.ReportSearch.REPORT_OBJECT.REPORT_ID != 40) {
                if ($scope.SET_FIELDS_LIST.filter(x => x.FE_COLUMN == "Name" && x.SHOW_FLAG == false).length > 0) { $scope.search_Flag = true; }
                if ($scope.SET_FIELDS_LIST.filter(x => x.FE_COLUMN == "Employee Name" && x.SHOW_FLAG == false).length > 0) { $scope.search_Flag = true; }

                if ($scope.search_Flag == true) {
                    result = true;
                }
                else {
                    if ($scope.ReportSearch.SEARCH == '' || _record.EMPLOYEE_NAME.toLowerCase().indexOf($scope.ReportSearch.SEARCH.toLowerCase()) != -1) {
                        result = true;
                    }
                    else {
                        result = false;
                    }
                }
                if ($scope.ReportSearch.REPORT_OBJECT.REPORT_ID != 56) {
                    if (result && $scope.ReportSearch.SITES.findIndex(x => x == _record.SITE) >= 0) {
                        result = true;
                    }
                    else {
                        result = false;
                    }

                    if (result && $scope.ReportSearch.DEPARTMENTS.findIndex(x => x == _record.DEPARTMENT) >= 0) {
                        result = true;
                    }
                    else {
                        result = false;
                    }

                    if (result && $scope.ReportSearch.POSITIONS.findIndex(x => x == _record.POSITION) >= 0) {
                        result = true;
                    }
                    else {
                        result = false;
                    }
                    if ($scope.REPORT_FILTERS_LIST.findIndex(x => x.FILTER_NAME.toLowerCase() == "pay type") > 0) {
                        if ((result && $scope.ReportSearch.PAY_TYPES.findIndex(x => x == _record.PAY_TYPE) >= 0)) {
                            result = true;
                        }
                        else {
                            result = false;
                        }
                    }
                    if ($scope.REPORT_FILTERS_LIST.findIndex(x => x.FILTER_NAME.toLowerCase() == "absence type") > 0) {
                        if (result && $scope.ReportSearch.ABSENCE_TYPES.findIndex(x => x == _record.ABSENCE_TYPE) >= 0) {
                            result = true;
                        }
                        else {
                            result = false;
                        }
                    }
                    if ($scope.REPORT_FILTERS_LIST.findIndex(x => x.FILTER_NAME.toLowerCase() == "termination reason") > 0) {
                        if (result && $scope.ReportSearch.TERMINATION_REASONS.findIndex(x => x == _record.TERMINATION_REASON) >= 0) {
                            result = true;
                        }
                        else {
                            result = false;
                        }
                    }
                    if ($scope.REPORT_FILTERS_LIST.findIndex(x => x.FILTER_NAME.toLowerCase() == "standard role") > 0) {
                        if (result && $scope.ReportSearch.ROLES_ASSIGNMENTS.findIndex(x => x == _record.ROLE_NAME) >= 0) {
                            result = true;
                        }
                        else {
                            result = false;
                        }
                    }
                }
                else {
                    if ($scope.REPORT_FILTERS_LIST.findIndex(x => x.FILTER_NAME.toLowerCase() == "section") > 0) {
                        if (result && $scope.ReportSearch.SECTIONS.findIndex(x => x == _record.SECTION_NAME) >= 0) {
                            result = true;
                        }
                        else {
                            result = false;
                        }
                    }
                }
            }
            else {

                if ($scope.ReportSearch.SEARCH == '' || _record.Employee.toLowerCase().indexOf($scope.ReportSearch.SEARCH.toLowerCase()) != -1) {
                    result = true;
                }
                else {
                    result = false;
                }
            }
            return result;

        }));
    };

    $scope.GET_REPORT_DATA = function (REPORT_OBJ) {
        document.getElementById("loader").style.display = "block";
        $scope.ReportSearch.SEARCH = "";
        $scope.ReportSearch.REPORT_NAME = REPORT_OBJ.REPORT_NAME;
        var reportObj = new Object();
        reportObj.CUSTOMER_ID = $scope.ReportSearch.CUSTOMER_ID;
        reportObj.ENTITY_ID = $scope.ReportSearch.ENTITY_ID;
        reportObj.DEPARTMENT_IDS = $scope.ReportSearch.DEPARTMENT_IDS;
        reportObj.POSITION_IDS = $scope.ReportSearch.POSITION_IDS;
        reportObj.START_DATE = $scope.ReportSearch.START_DATE;
        reportObj.END_DATE = $scope.ReportSearch.END_DATE;
        reportObj.DATE = $scope.ReportSearch.START_DATE;
        reportObj.USER_ID = $scope.ReportSearch.USER_ID;
        reportObj.EMPLY_PRSNL_ID = $scope.ReportSearch.EMPLY_PRSNL_ID;
        reportObj.PAGE_SIZE = $scope.ReportSearch.PAGE_SIZE;
        reportObj.PAGE_NO = $scope.ReportSearch.PAGE_NO;
        reportObj.REPORT_ID = REPORT_OBJ.REPORT_ID;
        reportObj.ABS_TYPE_IDS = $scope.ReportSearch.ABS_TYPE_IDS;
        reportObj.BRANCH_IDS = $scope.ReportSearch.SITE_IDS;
        reportObj.TERMINATION_REASON_IDS = $scope.ReportSearch.TERMINATION_REASON_IDS;
        reportObj.STANDARD_ROLE = $scope.ReportSearch.ROLES_ASSIGNMENT_IDS;
        reportObj.PAY_TYPE_IDS = $scope.ReportSearch.PAY_TYPE_IDS;
        reportObj.PAY_SCHEDULE_ID = $scope.ReportSearch.PAYSCHEDULE_ID;
        reportObj.SECTION_IDS = $scope.ReportSearch.SECTION_IDS;


        reportObj.SP_EXECUTION_PARAMETERS = REPORT_OBJ.PARAMETERS;
        reportObj.SP_EXECUTION_NAME = REPORT_OBJ.SP_NAME;
        //CusModelObj.FILTER_IDS = Array.prototype.map.call($scope.$parent.SET_FIELDS_LIST.filter(x => x.IS_SELECTED == true), s => s.FE_COLUMN_ID).toString();
        PrcCommMethods.REPORT_API(reportObj, 'GET_REPORT_DATA').then(function (data) {

            try {
                if (data.data.data.length > 0) {
                    if (data.data.data.length < $scope.ReportSearch.PAGE_SIZE) {
                        $scope.GetData = false;
                        $scope.FETCHED_DATA_FROM_DB = angular.copy($scope.FETCHED_DATA_FROM_DB.concat(data.data.data));
                        $scope.ACTUAL_REPORT_DATA = angular.copy($scope.FETCHED_DATA_FROM_DB);
                        $scope.ReportSearch.PAGE_NO = 1;
                        document.getElementById("loader").style.display = "none";
                    }
                    else {
                        $scope.GetData = true;

                        $scope.FETCHED_DATA_FROM_DB = angular.copy($scope.FETCHED_DATA_FROM_DB.concat(data.data.data));
                        $scope.ACTUAL_REPORT_DATA = angular.copy($scope.FETCHED_DATA_FROM_DB);
                        $scope.LAZY_LOAD_GET_REPORT_DATA();
                    }
                }
                else {
                    if ($scope.ReportSearch.PAGE_NO > 1) {
                        $scope.GetData = false;
                        $scope.ReportSearch.PAGE_NO = 1;
                        document.getElementById("loader").style.display = "none";
                    }
                    else {
                        $scope.FETCHED_DATA_FROM_DB = [];
                        $scope.GetData = false;
                        $scope.ReportSearch.PAGE_NO = 1;
                        document.getElementById("loader").style.display = "none";
                    }
                }
            }
            catch (err) {
                document.getElementById("loader").style.display = "none";
                $scope.ReportSearch.PAGE_NO = 1;
            }
        });
        $scope.RESET_ALL_CONTROL_CHECKBOX_AS_SELECTED();
    };
    $scope.LAZY_LOAD_GET_REPORT_DATA = function () {
        $scope.ReportSearch.PAGE_NO = parseInt($scope.ReportSearch.PAGE_NO) + 1;
        $scope.ReportSearch.IS_LAZY_LOAD_CLICKED = true;
        document.getElementById("loader").style.display = "block";
        $scope.GET_REPORT_DATA($scope.ReportSearch.REPORT_OBJECT);
    };
    $scope.SHOW_COMMENTS_POPUP_ON_CLICK_Fn = function (Comment) {
        $scope.ReportSearch.COMMENTS = Comment;
    };

    //---------------------------//

    /**Fill all fiters with value or default*/
    $scope.CLICK_BRANCH_VIEW_Fn = function (_pram_table) {
        if (_pram_table == undefined || _pram_table == '') {
            $scope.ReportSearch.BRANCH_NAME = $scope.ReportSearch.BRANCH_DEFAULT_TEXT;
            $scope.ReportSearch.BRANCH_ID = '';
        } else {
            $scope.ReportSearch.BRANCH_NAME = _pram_table.BRANCH_NAME;
            $scope.ReportSearch.BRANCH_ID = _pram_table.BRANCH_ID;
            $scope.GET_REPORT_DATA($scope.ReportSearch.REPORT_OBJECT);
        }
    }; $scope.CLICK_BRANCH_VIEW_Fn();
    $scope.CLICK_DEPARTMENT_VIEW_Fn = function (_pram_table) {
        $scope.ReportSearch.PAGE_NO = 1;
        if (_pram_table == undefined || _pram_table == '') {
            $scope.ReportSearch.DEPARTMENT_NAME = $scope.ReportSearch.DEPARTMENT_DEFAULT_TEXT;
            $scope.ReportSearch.DEPARTMENT_ID = '';
        } else {
            $scope.ReportSearch.DEPARTMENT_NAME = _pram_table.DEPARTMENT_NAME;
            $scope.ReportSearch.DEPARTMENT_ID = _pram_table.DEPARTMENT_ID;
            //$scope.GET_REPORT_DATA($scope.ReportSearch.REPORT_OBJECT);
        }
    }; $scope.CLICK_DEPARTMENT_VIEW_Fn();
    $scope.CLICK_POSITION_VIEW_Fn = function (_pram_table) {
        $scope.ReportSearch.PAGE_NO = 1;
        if (_pram_table == undefined || _pram_table == '') {
            $scope.ReportSearch.POSITION_NAME = $scope.ReportSearch.POSITION_DEFAULT_TEXT;
            $scope.ReportSearch.POSITION_ID = '';

        } else {
            $scope.ReportSearch.POSITION_NAME = _pram_table.POSITION_NAME;
            $scope.ReportSearch.POSITION_ID = _pram_table.POSITION_ID;

        }
    }; $scope.CLICK_POSITION_VIEW_Fn();
    $scope.CLICK_PAYTYPE_VIEW_Fn = function (_pram_table) {
        $scope.ReportSearch.PAGE_NO = 1;
        if (_pram_table == undefined || _pram_table == '') {
            $scope.ReportSearch.PAYTYPE_NAME = $scope.ReportSearch.PAYTYPE_DEFAULT_TEXT;
            $scope.ReportSearch.PAYTYPE_ID = '';
        } else {
            $scope.ReportSearch.PAYTYPE_NAME = _pram_table.PAY_TYPE;
            $scope.ReportSearch.PAYTYPE_ID = _pram_table.PAYTYPE_ID;
            $scope.GET_REPORT_DATA($scope.ReportSearch.REPORT_OBJECT);
        }

        //$scope.$parent.PAYTYPE_VIEW_DISPALY_TEXT = _pram_table.PAYTYPE_DEFAULT_TEXT;
        //$scope.$parent.PAYTYPE_VIEW_ID = _pram_table.PAYTYPE_ID;
    }; $scope.CLICK_PAYTYPE_VIEW_Fn('');
    $scope.CLICK_VIEWBY_VIEW_Fn = function (_pram_table) {

        $scope.FETCHED_DATA_FROM_DB = [];
        $scope.ACTUAL_REPORT_DATA = [];
        $scope.ReportSearch.PAGE_NO = 1;
        $scope.ReportSearch.VIEW_BY_ID = _pram_table.VIEW_BY_ID;
        if (_pram_table == undefined || _pram_table == '') {
            $scope.ReportSearch.SINGLE_DATE_CONTROL_DISPLAY = false;
            $scope.ReportSearch.WEEK_DATE_CONTROL_DISPLAY = false;
            $scope.ReportSearch.CALENDAR_DATE_CONTROL_DISPLAY = true;
            $scope.ReportSearch.VIEW_BY_NAME = $scope.ReportSearch.VIEW_BY_DEFAULT_TEXT;
            $scope.ReportSearch.VIEW_BY_ID = '';
            startDate = moment().startOf('month');
            endDate = moment().endOf('month');
            $scope.ReportSearch.START_DATE = startDate.format($scope.ReportSearch.REPORT_CALANDER_DATE_FORMAT);
            $scope.ReportSearch.END_DATE = endDate.format($scope.ReportSearch.REPORT_CALANDER_DATE_FORMAT);
            reportrange(moment(new Date(startDate)), moment(new Date(endDate)));
        }
        else {
            $scope.ReportSearch.VIEW_BY_NAME = _pram_table.VIEW_BY_NAME;
            $scope.ReportSearch.VIEW_BY_ID = _pram_table.VIEW_BY_ID;
            if (_pram_table.VIEW_BY_ID == 1 || _pram_table == undefined || _pram_table == '') {
                $scope.ReportSearch.SINGLE_DATE_CONTROL_DISPLAY = true;
                $scope.ReportSearch.WEEK_DATE_CONTROL_DISPLAY = false;
                $scope.ReportSearch.CALENDAR_DATE_CONTROL_DISPLAY = false;
                $scope.ReportSearch.DATE = $scope.ReportSearch.START_DATE;
                $scope.ReportSearch.END_DATE = $scope.ReportSearch.START_DATE;
                if ($scope.ReportSearch.DATE_FILTER != undefined) {
                    var datearray = $scope.ReportSearch.DATE_FILTER.split("/");
                    var newdate = datearray[1] + '/' + datearray[0] + '/' + datearray[2];
                    $scope.ReportSearch.START_DATE = newdate;
                    $scope.ReportSearch.END_DATE = newdate;
                    $scope.GET_REPORT_DATA($scope.ReportSearch.REPORT_OBJECT);
                }
                else {
                    //const today = new Date()
                    //const yyyy = today.getFullYear();
                    //let mm = today.getMonth() + 1; // Months start at 0!
                    //let dd = today.getDate();
                    //if (dd < 10) dd = '0' + dd;
                    //if (mm < 10) mm = '0' + mm;

                    //var newdate = dd + '/' + mm + '/' + yyyy;                    
                    //var newdateMMDDYY = mm + '/' + dd + '/' + yyyy;


                    $scope.ReportSearch.DATE_FILTER = moment().format($scope.ReportSearch.REPORT_CALANDER_DATE_FORMAT);
                    $scope.ReportSearch.START_DATE = moment().format($scope.ReportSearch.PARAMETER_CALANDER_DATE_FORMAT);
                    $scope.ReportSearch.END_DATE = moment().format($scope.ReportSearch.PARAMETER_CALANDER_DATE_FORMAT);
                    $scope.GET_REPORT_DATA($scope.ReportSearch.REPORT_OBJECT);
                }
            }
            if (_pram_table.VIEW_BY_ID == 2) {

                $scope.ReportSearch.SINGLE_DATE_CONTROL_DISPLAY = false;
                $scope.ReportSearch.WEEK_DATE_CONTROL_DISPLAY = true;
                $scope.ReportSearch.CALENDAR_DATE_CONTROL_DISPLAY = false;
                let date = new Date($scope.ReportSearch.START_DATE);
                $scope.ReportSearch.END_DATE = new Date(date.setDate(date.getDate() + 7));

                $scope.set_week_picker(_day);
                //$scope.GET_REPORT_DATA($scope.ReportSearch.REPORT_OBJECT);
            }
            if (_pram_table.VIEW_BY_ID == 3) {

                startDate = moment().startOf('month');
                endDate = moment().endOf('month');

                $scope.ReportSearch.SINGLE_DATE_CONTROL_DISPLAY = false;
                $scope.ReportSearch.WEEK_DATE_CONTROL_DISPLAY = false;
                $scope.ReportSearch.CALENDAR_DATE_CONTROL_DISPLAY = true;
                $scope.SetUpDateRangereportsDatePicker('reportrange', startDate, endDate, reportrange);
                $scope.ReportSearch.INITIAL_START_DATE = startDate.format($scope.$parent.Datelocaleformat.format);
                $scope.ReportSearch.INITIAL_END_DATE = endDate.format($scope.$parent.Datelocaleformat.format);
                //$('#reportrange span').html(startDate.format($scope.$parent.Datelocaleformat.format) + ' - ' + endDate.format($scope.$parent.Datelocaleformat.format));
                //$scope.ReportSearch.DATE = $scope.ReportSearch.START_DATE;
                //let date = new Date($scope.ReportSearch.START_DATE);
                //$scope.ReportSearch.END_DATE = new Date(new Date($scope.ReportSearch.START_DATE).getFullYear(), new Date($scope.ReportSearch.START_DATE).getMonth() + 1, 0);

                //$scope.GET_REPORT_DATA($scope.ReportSearch.REPORT_OBJECT);
            }
        }

    }; $scope.CLICK_VIEWBY_VIEW_Fn('');
    $scope.CLICK_ACCESS_ROLES_ASSIGNMENT_VIEW_Fn = function (_pram_table) {
        if (_pram_table == undefined || _pram_table == '') {
            $scope.ReportSearch.ROLE_NAME = $scope.ReportSearch.ROLE_DEFAULT_TEXT;
            $scope.ReportSearch.ROLE_ID = '';
        } else {
            $scope.ReportSearch.ROLE_NAME = _pram_table.ROLE_NAME;
            $scope.ReportSearch.ROLE_ID = _pram_table.STANDARD_ROLE_ID;
        }
    }; $scope.CLICK_ACCESS_ROLES_ASSIGNMENT_VIEW_Fn();
    $scope.CLICK_ENTITLEMENT_VIEW_Fn = function (_pram_table) {
        if (_pram_table == undefined || _pram_table == '') {
            $scope.ReportSearch.ENTITLEMENT_NAME = $scope.ReportSearch.HOLIDAY_PLAN_DEFAULT_TEXT;
            $scope.ReportSearch.HOLIDAY_ENTITLEMENT_ID = '';
        } else {
            $scope.ReportSearch.ENTITLEMENT_NAME = _pram_table.ENTITLEMENT_NAME;
            $scope.ReportSearch.HOLIDAY_ENTITLEMENT_ID = _pram_table.HOLIDAY_ENTITLEMENT_ID;
        }
    }; $scope.CLICK_ENTITLEMENT_VIEW_Fn();
    $scope.CLICK_ORDER_BY_ID_VIEW_Fn = function (_pram_table) {

        if (_pram_table == undefined || _pram_table == '') {
            $scope.ReportSearch.ORDER_BY_FROM_OBJECT = "";
            $scope.ReportSearch.ORDER_BY_NAME = 'None';//$scope.ReportSearch.ORDER_BY_DEFAULT_TEXT;
            $scope.ReportSearch.ORDER_BY_ID = '';
            $scope.ReportSearch.ORDER_BY_FROM_OBJECT = "EMPLOYEE_NAME";
        } else {
            let ORDERBY_FIELD_NAME = $scope.ReportSearch.ORDER_BY_FILTER_LIST.filter(x => x.ORDER_BY_ID == _pram_table.ORDER_BY_ID)[0]["ORDER_BY_NAME"];
            $scope.ReportSearch.ORDER_BY_FROM_OBJECT = _pram_table.ORDER_BY_ID == 2 || _pram_table.ORDER_BY_ID == 1 ? "EMPLOYEE_NAME" : ORDERBY_FIELD_NAME;
            $scope.ReportSearch.ORDER_BY_NAME = _pram_table.ORDER_BY_NAME;
            $scope.ReportSearch.ORDER_BY_ID = _pram_table.ORDER_BY_ID;
        }
        $scope.ReportSearch.ORDER_BY = _pram_table.ORDER_BY_NAME;

    }; $scope.CLICK_ORDER_BY_ID_VIEW_Fn('');
    $scope.CLICK_ABSENCE_TYPE_VIEW_Fn = function (_pram_table) {
        if (_pram_table == undefined || _pram_table == '') {
            $scope.ReportSearch.ABSENCE_TYPE = $scope.ReportSearch.ABSENCE_DEFAULT_TEXT;
            $scope.ReportSearch.ABSENCE_TYPE_ID = '';
        } else {
            $scope.ReportSearch.ABSENCE_TYPE = _pram_table.ABSENCE_TYPE;
            $scope.ReportSearch.ABSENCE_TYPE_ID = _pram_table.ABSENCE_TYPE_ID;
        }
    }; $scope.CLICK_ABSENCE_TYPE_VIEW_Fn('');
    $scope.CLICK_TERMINATION_REASONS_VIEW_Fn = function (_pram_table) {
        if (_pram_table == undefined || _pram_table == '') {
            $scope.ReportSearch.TERMINATION_REASONS_NAME = $scope.ReportSearch.TERMINATION_REASONS_DEFAULT_TEXT;
            $scope.ReportSearch.TERMINATION_REASONS_ID = '';
        } else {
            $scope.ReportSearch.TERMINATION_REASONS_NAME = _pram_table.TERMINATION_REASONS_NAME;
            $scope.ReportSearch.TERMINATION_REASONS_ID = _pram_table.TERMINATION_REASONS_ID;
        }
    }; $scope.CLICK_TERMINATION_REASONS_VIEW_Fn('');
    $scope.ON_PAY_SCHEDULE_DATE_SELECTION_SUBMIT_Fn = function () {
        if ($scope.ReportSearch.PAYSCHEDULE_ID != null && $scope.ReportSearch.PAYSCHEDULE_ID != "" && $scope.ReportSearch.START_DATE != null && $scope.ReportSearch.END_DATE != null) {
            $('#pay_schedule').modal('hide');
            $scope.FETCHED_DATA_FROM_DB = [];
            $scope.ACTUAL_REPORT_DATA = [];
            $scope.ReportSearch.SEARCH = "";
            $scope.ReportSearch.PAGE_NO = 1;
            $('#Pay_Shcedule_Date_Selected span').html(moment($scope.ReportSearch.START_DATE).format($scope.ReportSearch.REPORT_CALANDER_DATE_FORMAT) + ' - ' + moment($scope.ReportSearch.END_DATE).format($scope.ReportSearch.REPORT_CALANDER_DATE_FORMAT));
            //$scope.GET_REPORT_DATA($scope.ReportSearch.REPORT_OBJECT);
            $scope.RPRT_HRM_PAYROLL($scope.ReportSearch.REPORT_OBJECT);
        }
        else
            $scope.$parent.ShowAlertBox("Attention", 'Please select date to view report data.', 3000);
    };
    $scope.CLICK_PAY_SCHEDULE_VIEW_Fn = function (_pram_table) {
        if (_pram_table == undefined || _pram_table == '') {
            $scope.ReportSearch.PAYSCHEDULE_NAME = $scope.ReportSearch.FREQUENCY_NAME_DEFAULT_TEXT;
            $scope.ReportSearch.PAY_SCHEDULE_ID = '';
        } else {
            $scope.ReportSearch.PAYSCHEDULE_NAME = _pram_table.PAYSCHEDULE_NAME;
            $scope.ReportSearch.PAY_SCHEDULE_ID = _pram_table.PAYSCHEDULE_ID;
        }
    }; $scope.CLICK_PAY_SCHEDULE_VIEW_Fn('');
    $scope.SELECT_PAY_SCHEDULE_OPTIOS_Fn = function (_parameter) {
        //$scope.FETCHED_DATA_FROM_DB = [];
        //$scope.ACTUAL_REPORT_DATA = [];
        //$scope.ReportSearch.SEARCH = "";
        //$scope.ReportSearch.PAGE_NO = 1;
        $scope.ReportSearch.PAYSCHEDULE_ID = _parameter.PAYSCHEDULE_ID;
        $scope.ReportSearch.START_DATE = _parameter.START_DATE;
        $scope.ReportSearch.END_DATE = _parameter.END_DATE;
    };
    $scope.ON_SCHEDULE_POPUP_CLOSE_BUTTON_CLICK_Fn = function () {
        //$scope.FETCHED_DATA_FROM_DB = [];
        //$scope.ACTUAL_REPORT_DATA = [];
        //$scope.ReportSearch.SEARCH = "";
        //$scope.ReportSearch.PAGE_NO = 1;
        //$scope.ReportSearch.PAYSCHEDULE_ID = null;
        //$scope.ReportSearch.START_DATE = null;
        //$scope.ReportSearch.END_DATE = null;
        $('#pay_schedule').modal('hide');
    };
    $scope.ON_COMMENT_POPUP_CLOSE_BUTTON_CLICK_Fn = function () {
        $('#show_reason').modal('hide');
    };
    $scope.CLICK_SECTION_VIEW_Fn = function (_pram_table) {

        $scope.ReportSearch.PAGE_NO = 1;
        if (_pram_table == undefined || _pram_table == '') {
            $scope.ReportSearch.SECTION_NAME = $scope.ReportSearch.SECTION_DEFAULT_TEXT;
            $scope.ReportSearch.SECTION_ID = '';
        } else {
            $scope.ReportSearch.SECTION_NAME = _pram_table.SECTION_NAME;
            $scope.ReportSearch.SECTION_ID = _pram_table.SECTION_ID;
        }
    }; $scope.CLICK_SECTION_VIEW_Fn();
    /** NG change */
    $scope.NG_CHANGE_BRANCH = function (_field) {
        $scope.ReportSearch.SITES = [];
        $scope.HR_BRANCH_LIST.filter(x => x.IS_SELECTED == true).length == $scope.HR_BRANCH_LIST.length ? $scope.ReportSearch.BranchALL = true : $scope.ReportSearch.BranchALL = false;

        if ($scope.HR_BRANCH_LIST.filter(x => x.IS_SELECTED == true).length > 0) {
            angular.forEach($scope.HR_BRANCH_LIST.filter(x => x.IS_SELECTED == true), function (item) {
                $scope.ReportSearch.SITES.push(item.BRANCH_NAME);
            });
        }
        if ($scope.ReportSearch.REPORT_OBJECT.REPORT_ID == 40) {
            $scope.FETCHED_DATA_FROM_DB = [];
            $scope.RPRT_HRM_PAYROLL();
        }
        else
            $scope.FILTER_DATA();
    };
    $scope.NG_CHANGE_DEPARTMENT = function (_pram_table) {
        $scope.ReportSearch.DEPARTMENTS = [];
        $scope.DEPARTMENTS_LIST.filter(x => x.IS_SELECTED == true).length == $scope.DEPARTMENTS_LIST.length ? $scope.ReportSearch.DepartmentALL = true : $scope.ReportSearch.DepartmentALL = false;
        if ($scope.DEPARTMENTS_LIST.filter(x => x.IS_SELECTED == true).length > 0) {
            angular.forEach($scope.DEPARTMENTS_LIST.filter(x => x.IS_SELECTED == true), function (item) {
                $scope.ReportSearch.DEPARTMENTS.push(item.DEPARTMENT_NAME);
            });
        }
        if ($scope.ReportSearch.REPORT_OBJECT.REPORT_ID == 40) {
            $scope.FETCHED_DATA_FROM_DB = [];
            $scope.RPRT_HRM_PAYROLL();
        }
        else
            $scope.FILTER_DATA();
    };
    $scope.NG_CHANGE_POSITION = function (_pram_table) {
        $scope.ReportSearch.POSITIONS = [];
        $scope.POSITIONS_LIST.filter(x => x.IS_SELECTED == true).length == $scope.POSITIONS_LIST.length ? $scope.ReportSearch.PositionALL = true : $scope.ReportSearch.PositionALL = false;
        if ($scope.POSITIONS_LIST.filter(x => x.IS_SELECTED == true).length > 0) {
            angular.forEach($scope.POSITIONS_LIST.filter(x => x.IS_SELECTED == true), function (item) {
                $scope.ReportSearch.POSITIONS.push(item.POSITION_NAME);
            });
        }
        if ($scope.ReportSearch.REPORT_OBJECT.REPORT_ID == 40) {
            $scope.FETCHED_DATA_FROM_DB = [];
            $scope.RPRT_HRM_PAYROLL();
        }
        else
            $scope.FILTER_DATA();
    }
    $scope.NG_CHANGE = function () {
        //var datearray = $scope.ReportSearch.DATE_FILTER.split("/");
        //var newdate = datearray[1] + '/' + datearray[0] + '/' + datearray[2];
        $scope.ReportSearch.START_DATE = moment($scope.ReportSearch.DATE_FILTER).format($scope.ReportSearch.PARAMETER_CALANDER_DATE_FORMAT);
        $scope.ReportSearch.END_DATE = $scope.ReportSearch.START_DATE;

        //$scope.ReportSearch.DATE_FILTER = moment($scope.ReportSearch.START_DATE).format($scope.ReportSearch.REPORT_CALANDER_DATE_FORMAT);
        $scope.FETCHED_DATA_FROM_DB = [];
        $scope.ACTUAL_REPORT_DATA = [];
        $scope.GET_REPORT_DATA($scope.ReportSearch.REPORT_OBJECT);
    };
    $scope.NG_CHANGE_PAY_TYPE = function (_pram_table) {
        $scope.ReportSearch.PAY_TYPES = [];
        $scope.PAYTYPES_LIST.filter(x => x.IS_SELECTED == true).length == $scope.PAYTYPES_LIST.length ? $scope.ReportSearch.PaytypeALL = true : $scope.ReportSearch.PaytypeALL = false;
        if ($scope.PAYTYPES_LIST.filter(x => x.IS_SELECTED == true).length > 0) {
            angular.forEach($scope.PAYTYPES_LIST.filter(x => x.IS_SELECTED == true), function (item) {
                $scope.ReportSearch.PAY_TYPES.push(item.PAY_TYPE);
            });
        }
        $scope.FILTER_DATA();
    };
    $scope.NG_CHANGE_ABSENCE_TYPE = function (_pram_table) {
        $scope.ReportSearch.ABSENCE_TYPES = [];
        $scope.ABSENCE_TYPE_LIST.filter(x => x.IS_SELECTED == true).length == $scope.ABSENCE_TYPE_LIST.length ? $scope.ReportSearch.AbsenceALL = true : $scope.ReportSearch.AbsenceALL = false;
        if ($scope.ABSENCE_TYPE_LIST.filter(x => x.IS_SELECTED == true).length > 0) {
            angular.forEach($scope.ABSENCE_TYPE_LIST.filter(x => x.IS_SELECTED == true), function (item) {
                $scope.ReportSearch.ABSENCE_TYPES.push(item.ABSENCE_TYPE);
            });
        }
        $scope.FILTER_DATA();
    };
    $scope.NG_CHANGE_TERMINATION_REASONS_TYPE = function (_pram_table) {
        $scope.ReportSearch.TERMINATION_REASONS = [];
        $scope.TERMINATION_REASONS_LIST.filter(x => x.IS_SELECTED == true).length == $scope.TERMINATION_REASONS_LIST.length ? $scope.ReportSearch.TerminationReasonALL = true : $scope.ReportSearch.TerminationReasonALL = false;
        if ($scope.TERMINATION_REASONS_LIST.filter(x => x.IS_SELECTED == true).length > 0) {
            angular.forEach($scope.TERMINATION_REASONS_LIST.filter(x => x.IS_SELECTED == true), function (item) {
                $scope.ReportSearch.TERMINATION_REASONS.push(item.TERMINATION_REASONS_NAME);
            });
        }
        $scope.FILTER_DATA();
    };
    $scope.NG_CHANGE_ACCESS_ROLES_ASSIGNMENT_TYPE = function (_pram_table) {
        $scope.ReportSearch.ROLES_ASSIGNMENTS = [];
        $scope.ACCESS_ROLES_ASSIGNMENT_LIST.filter(x => x.IS_SELECTED == true).length == $scope.ACCESS_ROLES_ASSIGNMENT_LIST.length ? $scope.ReportSearch.StandardRoleALL = true : $scope.ReportSearch.StandardRoleALL = false;
        if ($scope.ACCESS_ROLES_ASSIGNMENT_LIST.filter(x => x.IS_SELECTED == true).length > 0) {
            angular.forEach($scope.ACCESS_ROLES_ASSIGNMENT_LIST.filter(x => x.IS_SELECTED == true), function (item) {
                $scope.ReportSearch.ROLES_ASSIGNMENTS.push(item.ROLE_NAME);
            });
        }
        $scope.FILTER_DATA();
    };
    $scope.NG_CHANGE_REPORT_USER_COLUMN_MAPPING = function () {

        $scope.REPORT_USER_COLUMN_MAPPING_TYPE = [];
        angular.forEach($scope.SET_FIELDS_LIST, function (item) {
            var _obj = new Object();
            _obj.REPORT_COLUMN_MAPPING_MASTER_ID = item.REPORT_COLUMN_MAPPING_MASTER_ID;
            _obj.SHOW_FLAG = item.SHOW_FLAG;
            $scope.REPORT_USER_COLUMN_MAPPING_TYPE.push(_obj);
        });

        var rptModelObj = new Object();
        rptModelObj.USER_ID = $scope.ReportSearch.USER_ID;
        rptModelObj.ENTITY_ID = $scope.ReportSearch.ENTITY_ID;
        rptModelObj.REPORT_ID = $scope.ReportSearch.REPORT_OBJECT.REPORT_ID;
        rptModelObj.REPORT_USER_COLUMN_MAPPING_TYPE = $scope.REPORT_USER_COLUMN_MAPPING_TYPE;
        PrcCommMethods.REPORT_API(rptModelObj, 'RPRT_INS_UPD_USER_COLUMN_MAPPING').then(function (data) {
            if (data.data.Table.length == 0) {
                $scope.$parent.ShowAlertBox("Attention", 'Sorry, unable to save the data.Please contact support.', 3000);
            }
        });

    };
    $scope.RESET_ALL_CONTROL_CHECKBOX_AS_SELECTED = function () {
        $scope.ReportSearch.BranchALL = true;
        $scope.ReportSearch.DepartmentALL = true;
        $scope.ReportSearch.PositionALL = true;
        $scope.ReportSearch.PaytypeALL = true;
        $scope.ReportSearch.AbsenceALL = true;
        $scope.ReportSearch.SectionALL = true;
        $scope.ReportSearch.TerminationReasonALL = true;
        $scope.ReportSearch.StandardRoleALL = true;
        $scope.ReportSearch.SectionALL = true;
        if ($scope.ReportSearch.REPORT_ID == 40) {
            if ($scope.HR_BRANCH_LIST != undefined) {
                angular.forEach($scope.HR_BRANCH_LIST.filter(x => x.IS_SELECTED == false), function (item) {
                    item.IS_SELECTED = true;
                });
            }
            if ($scope.DEPARTMENTS_LIST != undefined) {
                angular.forEach($scope.DEPARTMENTS_LIST.filter(x => x.IS_SELECTED == false), function (item) {
                    item.IS_SELECTED = true;
                });
            }
            if ($scope.POSITIONS_LIST != undefined) {
                angular.forEach($scope.POSITIONS_LIST.filter(x => x.IS_SELECTED == false), function (item) {
                    item.IS_SELECTED = true;
                });
            }
        }
        else {
            if ($scope.HR_BRANCH_LIST != undefined) {
                angular.forEach($scope.HR_BRANCH_LIST.filter(x => x.IS_SELECTED == false), function (item) {
                    item.IS_SELECTED = true;
                });
            }
            if ($scope.DEPARTMENTS_LIST != undefined) {
                angular.forEach($scope.DEPARTMENTS_LIST.filter(x => x.IS_SELECTED == false), function (item) {
                    item.IS_SELECTED = true;
                });
            }
            if ($scope.POSITIONS_LIST != undefined) {
                angular.forEach($scope.POSITIONS_LIST.filter(x => x.IS_SELECTED == false), function (item) {
                    item.IS_SELECTED = true;
                });
            }
            if ($scope.PAYTYPES_LIST != undefined) {
                angular.forEach($scope.PAYTYPES_LIST.filter(x => x.IS_SELECTED == false), function (item) {
                    item.IS_SELECTED = true;
                });
            }
            if ($scope.ABSENCE_TYPE_LIST != undefined) {
                angular.forEach($scope.ABSENCE_TYPE_LIST.filter(x => x.IS_SELECTED == false), function (item) {
                    item.IS_SELECTED = true;
                });
            }
            if ($scope.TERMINATION_REASONS_LIST != undefined) {
                angular.forEach($scope.TERMINATION_REASONS_LIST.filter(x => x.IS_SELECTED == false), function (item) {
                    item.IS_SELECTED = true;
                });
            }
            if ($scope.ACCESS_ROLES_ASSIGNMENT_LIST != undefined) {
                angular.forEach($scope.ACCESS_ROLES_ASSIGNMENT_LIST.filter(x => x.IS_SELECTED == false), function (item) {
                    item.IS_SELECTED = true;
                });
            }
            if ($scope.SECTION_LIST != undefined) {
                angular.forEach($scope.SECTION_LIST.filter(x => x.IS_SELECTED == false), function (item) {
                    item.IS_SELECTED = true;
                });
            }
        }
    };
    $scope.NG_CHANGE_PAY_SCHEDULE = function (_pram_table) {
        if (_pram_table == null || _pram_table == "") {

            $scope.$parent.ShowAlertBox("Attention", "Please select data from the list.", 3000);
            $('#Pay_Shcedule_Date_Selected span').html("");
        }
        else {
            //$('#Pay_Shcedule_Date_Selected span').html("");
            //$scope.FETCHED_DATA_FROM_DB = [];
            //$scope.ACTUAL_REPORT_DATA = [];
            $scope.ReportSearch.SEARCH = "";
            $scope.ReportSearch.PAGE_NO = 1;
            $scope.ReportSearch.START_DATE = null;
            $scope.ReportSearch.END_DATE = null;

            $scope.ReportSearch.PAYSCHEDULE_NAME = _pram_table.PAYSCHEDULE_NAME;
            $scope.ReportSearch.PAY_SCHEDULE_ID = _pram_table.PAYSCHEDULE_ID;
            $scope.ReportSearch.PAY_SCHEDULE_TABLE_ID = _pram_table.ID;
            var RepModelObj = new Object();
            RepModelObj.PAYSCHEDULE_ID = _pram_table.PAYSCHEDULE_ID;
            PrcCommMethods.HUMANRESOURCE_API(RepModelObj, 'HRM_GET_PAYSCHEDULE_BY_ID').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.ReportSearch.PAYSCHEDULE_BY_ID_LIST = data.data.Table1;
                    ///$('#pay_schedule').modal('show');
                }
                else {
                    $scope.$parent.ShowAlertBox("Attention", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                }
            });
        }
    }
    $scope.NG_CLICK_PAY_SCHEDULE_TEXTBOX = function () {
        if ($scope.ReportSearch.PAY_SCHEDULE_ID != null && $scope.ReportSearch.PAY_SCHEDULE_ID != "") {
            var RepModelObj = new Object();
            RepModelObj.PAYSCHEDULE_ID = $scope.ReportSearch.PAY_SCHEDULE_ID;
            PrcCommMethods.HUMANRESOURCE_API(RepModelObj, 'HRM_GET_PAYSCHEDULE_BY_ID').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.ReportSearch.PAYSCHEDULE_BY_ID_LIST = data.data.Table1;
                    //$('#pay_schedule').modal('show');
                }
                else {
                    $scope.$parent.ShowAlertBox("Attention", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                }
            });
        }
    };
    $scope.NG_CHANGE_SECTION = function (_pram_table) {
        $scope.ReportSearch.SECTIONS = [];
        $scope.SECTION_LIST.filter(x => x.IS_SELECTED == true).length == $scope.SECTION_LIST.length ? $scope.ReportSearch.SectionALL = true : $scope.ReportSearch.SectionALL = false;
        if ($scope.SECTION_LIST.filter(x => x.IS_SELECTED == true).length > 0) {
            angular.forEach($scope.SECTION_LIST.filter(x => x.IS_SELECTED == true), function (item) {
                $scope.ReportSearch.SECTIONS.push(item.SECTION_NAME);
            });
        }
        $scope.FILTER_DATA();
    };
    $scope.NG_CHANGE_SET_FIELDS_ALL_Fn = function (All_FLAG) {
        angular.forEach($scope.SET_FIELDS_LIST, function (item) {
            if (item.UNEDITABLE == false) {
                item.SHOW_FLAG = All_FLAG;
            }
        });

    };
    $scope.NG_CHANGE_VIEW_Fn = function (_pram_table) {
        if (_pram_table == undefined || _pram_table == '') {
            $scope.ReportSearch.ORDER_BY_FROM_OBJECT = "";
            $scope.ReportSearch.ORDER_BY_NAME = 'None';//$scope.ReportSearch.ORDER_BY_DEFAULT_TEXT;
            $scope.ReportSearch.ORDER_BY_ID = '';
            $scope.ReportSearch.ORDER_BY_FROM_OBJECT = "EMPLOYEE_NAME";
        } else {
            let ORDERBY_FIELD_NAME = $scope.ReportSearch.ORDER_BY_FILTER_LIST_40.filter(x => x.ORDER_BY_ID == _pram_table.ORDER_BY_ID)[0]["ORDER_BY_NAME"];
            $scope.ReportSearch.ORDER_BY_FROM_OBJECT = _pram_table.ORDER_BY_ID == 2 || _pram_table.ORDER_BY_ID == 1 ? "EMPLOYEE_NAME" : ORDERBY_FIELD_NAME;
            $scope.ReportSearch.ORDER_BY_NAME = _pram_table.ORDER_BY_NAME;
            $scope.ReportSearch.ORDER_BY_ID = _pram_table.ORDER_BY_ID;
        }

        $scope.FETCHED_DATA_FROM_DB = [];
        $scope.RPRT_HRM_PAYROLL('', _pram_table.ORDER_BY_NAME);
    };
    /** Code select all or un select all */


    $scope.BRANCH_APPLY_ALL_Fn = function (BRANCH_COUNT) {
        $scope.ReportSearch.BranchALL = true;
        $scope.ReportSearch.SITES = [];
        if (BRANCH_COUNT == $scope.HR_BRANCH_LIST.length) {
            $scope.ReportSearch.BranchALL = false;
            if ($scope.HR_BRANCH_LIST.filter(x => x.IS_SELECTED == true).length > 0) {
                angular.forEach($scope.HR_BRANCH_LIST, function (item) {
                    item.IS_SELECTED = false;
                });
            }
            else {
                angular.forEach($scope.HR_BRANCH_LIST.filter(x => x.IS_SELECTED == true), function (item) {
                    $scope.ReportSearch.SITES.push(item.BRANCH_NAME);
                });
            }
        }
        else {
            angular.forEach($scope.HR_BRANCH_LIST, function (item) {
                item.IS_SELECTED = true;
            });
        }
        angular.forEach($scope.HR_BRANCH_LIST.filter(x => x.IS_SELECTED == true), function (item) {
            $scope.ReportSearch.SITES.push(item.BRANCH_NAME);
        });
        if ($scope.ReportSearch.REPORT_OBJECT.REPORT_ID == 40) {
            $scope.FETCHED_DATA_FROM_DB = [];
            $scope.RPRT_HRM_PAYROLL();
        }
        else
            $scope.FILTER_DATA();
    };
    $scope.DEPARTMENT_APPLY_ALL_Fn = function (DEPARTMENT_COUNT) {
        $scope.ReportSearch.DepartmentALL = true;
        $scope.ReportSearch.DEPARTMENTS = [];
        if (DEPARTMENT_COUNT == $scope.DEPARTMENTS_LIST.length) {
            $scope.ReportSearch.DepartmentALL = false;
            if ($scope.DEPARTMENTS_LIST.filter(x => x.IS_SELECTED == true).length > 0) {
                angular.forEach($scope.DEPARTMENTS_LIST, function (item) {
                    item.IS_SELECTED = false;
                });
            }
            else {
                angular.forEach($scope.DEPARTMENTS_LIST.filter(x => x.IS_SELECTED == true), function (item) {
                    $scope.ReportSearch.DEPARTMENTS.push(item.DEPARTMENT_NAME);
                });
            }
        }
        else {
            angular.forEach($scope.DEPARTMENTS_LIST, function (item) {
                item.IS_SELECTED = true;
            });
        }
        angular.forEach($scope.DEPARTMENTS_LIST.filter(x => x.IS_SELECTED == true), function (item) {
            $scope.ReportSearch.DEPARTMENTS.push(item.DEPARTMENT_NAME);
        });
        if ($scope.ReportSearch.REPORT_OBJECT.REPORT_ID == 40) {
            $scope.FETCHED_DATA_FROM_DB = [];
            $scope.RPRT_HRM_PAYROLL();
        }
        else
            $scope.FILTER_DATA();
    };
    $scope.POSITION_APPLY_ALL_Fn = function (POSITION_COUNT) {
        $scope.ReportSearch.PositionALL = true;
        $scope.ReportSearch.POSITIONS = [];
        if (POSITION_COUNT == $scope.POSITIONS_LIST.length) {
            $scope.ReportSearch.PositionALL = false;
            if ($scope.POSITIONS_LIST.filter(x => x.IS_SELECTED == true).length > 0) {
                angular.forEach($scope.POSITIONS_LIST, function (item) {
                    item.IS_SELECTED = false;
                });
            }
            else {
                angular.forEach($scope.POSITIONS_LIST.filter(x => x.IS_SELECTED == true), function (item) {
                    $scope.ReportSearch.POSITIONS.push(item.POSITION_NAME);
                });
            }
        }
        else {
            angular.forEach($scope.POSITIONS_LIST, function (item) {
                item.IS_SELECTED = true;
            });
        }
        angular.forEach($scope.POSITIONS_LIST.filter(x => x.IS_SELECTED == true), function (item) {
            $scope.ReportSearch.POSITIONS.push(item.POSITION_NAME);
        });
        if ($scope.ReportSearch.REPORT_OBJECT.REPORT_ID == 40) {
            $scope.FETCHED_DATA_FROM_DB = [];
            $scope.RPRT_HRM_PAYROLL();
        }
        else
            $scope.FILTER_DATA();
    };
    $scope.PAYTYPE_APPLY_ALL_Fn = function (PAYTYPE_COUNT) {
        $scope.ReportSearch.PaytypeALL = true;
        $scope.ReportSearch.PAY_TYPES = [];
        if (PAYTYPE_COUNT == $scope.PAYTYPES_LIST.length) {
            $scope.ReportSearch.PaytypeALL = false;
            if ($scope.PAYTYPES_LIST.filter(x => x.IS_SELECTED == true).length > 0) {
                angular.forEach($scope.PAYTYPES_LIST, function (item) {
                    item.IS_SELECTED = false;
                });
            }
            else {
                angular.forEach($scope.PAYTYPES_LIST.filter(x => x.IS_SELECTED == true), function (item) {
                    $scope.ReportSearch.PAY_TYPES.push(item.PAY_TYPE);
                });
            }
        }
        else {
            angular.forEach($scope.PAYTYPES_LIST, function (item) {
                item.IS_SELECTED = true;
            });
        }
        angular.forEach($scope.PAYTYPES_LIST.filter(x => x.IS_SELECTED == true), function (item) {
            $scope.ReportSearch.PAY_TYPES.push(item.PAY_TYPE);
        });
        $scope.FILTER_DATA();
    };
    $scope.ABSENCE_APPLY_ALL_Fn = function (ABSENCE_COUNT) {
        $scope.ReportSearch.AbsenceALL = true;
        $scope.ReportSearch.ABSENCE_TYPES = [];
        if (ABSENCE_COUNT == $scope.ABSENCE_TYPE_LIST.length) {
            $scope.ReportSearch.AbsenceALL = false;
            if ($scope.ABSENCE_TYPE_LIST.filter(x => x.IS_SELECTED == true).length > 0) {
                angular.forEach($scope.ABSENCE_TYPE_LIST, function (item) {
                    item.IS_SELECTED = false;
                });
            }
            else {
                angular.forEach($scope.ABSENCE_TYPE_LIST.filter(x => x.IS_SELECTED == true), function (item) {
                    $scope.ReportSearch.ABSENCE_TYPES.push(item.ABSENCE_TYPE);
                });
            }
        }
        else {
            angular.forEach($scope.ABSENCE_TYPE_LIST, function (item) {
                item.IS_SELECTED = true;
            });
        }
        angular.forEach($scope.ABSENCE_TYPE_LIST.filter(x => x.IS_SELECTED == true), function (item) {
            $scope.ReportSearch.ABSENCE_TYPES.push(item.ABSENCE_TYPE);
        });
        $scope.FILTER_DATA();
    };
    $scope.TERMINATION_RESONS_APPLY_ALL_Fn = function (TERMINATION_RESONS_COUNT) {
        $scope.ReportSearch.AbsenceALL = true;
        $scope.ReportSearch.TERMINATION_REASONS = [];
        if (TERMINATION_RESONS_COUNT == $scope.TERMINATION_REASONS_LIST.length) {
            $scope.ReportSearch.AbsenceALL = false;
            if ($scope.TERMINATION_REASONS_LIST.filter(x => x.IS_SELECTED == true).length > 0) {
                angular.forEach($scope.TERMINATION_REASONS_LIST, function (item) {
                    item.IS_SELECTED = false;
                });
            }
            else {
                angular.forEach($scope.TERMINATION_REASONS_LIST.filter(x => x.IS_SELECTED == true), function (item) {
                    $scope.ReportSearch.TERMINATION_REASONS.push(item.TERMINATION_REASONS_NAME);
                });
            }
        }
        else {
            angular.forEach($scope.TERMINATION_REASONS_LIST, function (item) {
                item.IS_SELECTED = true;
            });
        }
        angular.forEach($scope.TERMINATION_REASONS_LIST.filter(x => x.IS_SELECTED == true), function (item) {
            $scope.ReportSearch.TERMINATION_REASONS.push(item.TERMINATION_REASONS_NAME);
        });
        $scope.FILTER_DATA();
    };
    $scope.STANDARD_ROLE_APPLY_ALL_Fn = function (STANDARD_ROLE_COUNT) {
        $scope.ReportSearch.StandardRoleALL = true;
        $scope.ReportSearch.ROLES_ASSIGNMENTS = [];
        if (STANDARD_ROLE_COUNT == $scope.ACCESS_ROLES_ASSIGNMENT_LIST.length) {
            $scope.ReportSearch.StandardRoleALL = false;
            if ($scope.ACCESS_ROLES_ASSIGNMENT_LIST.filter(x => x.IS_SELECTED == true).length > 0) {
                angular.forEach($scope.ACCESS_ROLES_ASSIGNMENT_LIST, function (item) {
                    item.IS_SELECTED = false;
                });
            }
            else {
                angular.forEach($scope.ACCESS_ROLES_ASSIGNMENT_LIST.filter(x => x.IS_SELECTED == true), function (item) {
                    $scope.ReportSearch.ROLES_ASSIGNMENTS.push(item.ROLE_NAME);
                });
            }
        }
        else {
            angular.forEach($scope.ACCESS_ROLES_ASSIGNMENT_LIST, function (item) {
                item.IS_SELECTED = true;
            });
        }
        angular.forEach($scope.ACCESS_ROLES_ASSIGNMENT_LIST.filter(x => x.IS_SELECTED == true), function (item) {
            $scope.ReportSearch.ROLES_ASSIGNMENTS.push(item.ROLE_NAME);
        });
        $scope.FILTER_DATA();
    };
    $scope.SECTION_APPLY_ALL_Fn = function (SECTION_COUNT) {
        $scope.ReportSearch.SectionALL = true;
        $scope.ReportSearch.SECTIONS = [];
        if (SECTION_COUNT == $scope.SECTION_LIST.length) {
            $scope.ReportSearch.SectionALL = false;
            if ($scope.SECTION_LIST.filter(x => x.IS_SELECTED == true).length > 0) {
                angular.forEach($scope.SECTION_LIST, function (item) {
                    item.IS_SELECTED = false;
                });
            }
            else {
                angular.forEach($scope.SECTION_LIST.filter(x => x.IS_SELECTED == true), function (item) {
                    $scope.ReportSearch.SECTIONS.push(item.SECTION_NAME);
                });
            }
        }
        else {
            angular.forEach($scope.SECTION_LIST, function (item) {
                item.IS_SELECTED = true;
            });
        }
        angular.forEach($scope.SECTION_LIST.filter(x => x.IS_SELECTED == true), function (item) {
            $scope.ReportSearch.SECTIONS.push(item.SECTION_NAME);
        });
        $scope.FILTER_DATA();
    };

    /* End*/

    $scope.$on('ngReportBindFinish', function (ngRepeatFinishedEvent) {
        $scope.COLUMNS_LIST = angular.copy($scope.SET_FIELDS_LIST);
        //if Report.iscollapsable
        if ($scope.ReportSearch.REPORT_OBJECT['IS_COLLAPSABLE'] == true)
            $scope.FETCHED_DATA_FROM_DB.filter(row => row.PARENT_ID == 0 ? $scope.ShowHideRows(row, true) : '');

    });

    $scope.CONVERT_TO_EXCEL_CSV = function (optionID) {
        $scope.EXCEL_REPORT_DATA_LIST = [];
        $scope.SELCTED_ITEM = [];
        var report_Date = '_' + new Date().getFullYear() + '_' + new Date().getMonth() + '_' + new Date().getDay();
        if ($scope.ReportSearch.REPORT_OBJECT.REPORT_ID == 40) {
            let cleanedData = $scope.FETCHED_DATA_FROM_DB.map(row => {
                let cleanedRow = {};
                for (let key in row) {
                    cleanedRow[key] = (row[key] === null || row[key] === undefined) ? '' : row[key];
                }
                return cleanedRow;
            });
            alasql('SELECT * INTO XLSX("' + $scope.ReportSearch.REPORT_NAME + report_Date + '",{headers:true}) FROM ?', [cleanedData]);
        }
        else {
            angular.forEach($scope.FETCHED_DATA_FROM_DB.filter(x => x.PARENT_ID != 0), function (_data) {
                angular.forEach(_data, function (_item) {
                    angular.forEach($scope.SET_FIELDS_LIST, function (filterItem) {
                        if (_item.ID == filterItem["REPORT_COLUMN_MAPPING_MASTER_ID"] && filterItem["SHOW_FLAG"] == true)
                            $scope.SELCTED_ITEM[filterItem["FE_COLUMN"]] = _item['VALUE'] == null ? "" : _item['VALUE'];
                    });
                });
                $scope.EXCEL_REPORT_DATA_LIST.push($scope.SELCTED_ITEM);
                $scope.SELCTED_ITEM = [];
            });
            $scope.details = {};
            $scope.details.Details = $scope.EXCEL_REPORT_DATA_LIST;
            if ($scope.FETCHED_DATA_FROM_DB.filter(x => x.PARENT_ID == 0).length > 0) {
                $scope.EXCEL_REPORT_DATA_LIST = [];
                $scope.SELCTED_ITEM = [];
                angular.forEach($scope.FETCHED_DATA_FROM_DB.filter(x => x.PARENT_ID == 0), function (_data) {
                    angular.forEach(_data, function (_item) {
                        angular.forEach($scope.SET_FIELDS_LIST, function (filterItem) {
                            if (_item.ID == filterItem["REPORT_COLUMN_MAPPING_MASTER_ID"] && filterItem["SHOW_FLAG"] == true && _item.SHOW_DATA == true)
                                $scope.SELCTED_ITEM[filterItem["FE_COLUMN"]] = _item['VALUE'] == null ? "" : _item['VALUE'];
                        });
                    });
                    $scope.EXCEL_REPORT_DATA_LIST.push($scope.SELCTED_ITEM);
                    $scope.SELCTED_ITEM = [];
                });

                $scope.details.Summary = $scope.EXCEL_REPORT_DATA_LIST;
            }
            if ($scope.details.Summary == undefined) {
                var opts = [{ sheetid: $scope.ReportSearch.REPORT_NAME, headers: true }];
                alasql('SELECT INTO XLSX("' + $scope.ReportSearch.REPORT_NAME + report_Date + '",?) FROM ?', [opts, [$scope.details.Details]]);
            }
            else {
                var opts = [{ sheetid: 'Summary', headers: true }, { sheetid: 'Details', headers: true }];
                alasql('SELECT INTO XLSX("' + $scope.ReportSearch.REPORT_NAME + report_Date + '",?) FROM ?', [opts, [$scope.details.Summary, $scope.details.Details]]);
            }
        }
    };
    /**calendarWeeks*/
    $scope.START_DAY_OF_WEEK = 1;
    $scope.addDays = function (date, days) { date.setDate(date.getDate() + days); return date; }
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
        $scope.weekpicker.val(moment($scope.start_date).format($scope.ReportSearch.REPORT_CALANDER_DATE_FORMAT) + ' - ' + moment($scope.end_date).format($scope.ReportSearch.REPORT_CALANDER_DATE_FORMAT));

        $scope.ReportSearch.START_DATE = moment($scope.start_date).format("MM/DD/yyyy");// $scope.start_date;
        $scope.ReportSearch.END_DATE = moment($scope.end_date).format("MM/DD/yyyy");//$scope.end_date;

        // $scope.WEEK_NO = weekYear($scope.start_date);
        if (!$scope.$$phase) { $scope.$apply(); }
        $scope.FETCHED_DATA_FROM_DB = [];
        $scope.ACTUAL_REPORT_DATA = [];
        if ($scope.ReportSearch.REPORT_OBJECT != null)
            $scope.GET_REPORT_DATA($scope.ReportSearch.REPORT_OBJECT);
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
            prev.setDate(prev.getDate() - 6);
            $scope.set_week_picker(prev);
        });
        $('.week-next').on('click', function () {
            var next = new Date($scope.end_date.getTime());
            next.setDate(next.getDate() + 1);
            $scope.set_week_picker(next);
        });
        $scope.set_week_picker(date, FLAG != undefined ? 2 : 1);
    };
    var _day = $scope.addDays(new Date(), 0);
    $scope.DATE_WEEK_PICKER(_day, 1);
    $scope.dateinputddmmyy = function (index) {
        $(document).ready(function () {

            var date_inputs = document.getElementsByClassName("dateinputddmmyy") //our date input has the name "date"
            if (date_inputs.length > 0) {
                for (var i = 0; i < date_inputs.length; i++) {
                    var date_input = $('input[name="' + date_inputs[i].name + '"]'); //our date input has the name "date"
                    var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
                    // var date = new Date();
                    var options = {
                        todayBtn: "linked",
                        daysOfWeekHighlighted: "0,6",
                        autoclose: true,
                        todayHighlight: false,
                        format: $scope.ReportSearch.DEFAULT_DDMMYYY_CALANDER_DATE_FORMAT,
                        clearBtn: true,
                        closeBtn: true,// close button visible
                        //  startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate())
                    };
                    date_input.datepicker(options).on("hide", function (e) {
                    })
                }
            }
        });
    };
    $scope.dateinputddmmyy(1);
    $scope.SetUpDateRangereportsDatePicker = function (ControlName, startDate, endDate, FunctionName, DEFAULT_DISPLAY_FLAG, ARROW_POSITION, OpenFlag) {
        $('#' + ControlName).daterangepicker({
            startDate: DEFAULT_DISPLAY_FLAG == 1 ? startDate : startDate,
            endDate: DEFAULT_DISPLAY_FLAG == 1 ? startDate : endDate,
            "opens": ARROW_POSITION == undefined ? "right" : "left",
            "linkedCalendars": false,
            "showCustomRangeLabel": true,
            //"alwaysShowCalendars": true,
            //locale: {
            //    format: 'DD-MMM-YYYY'
            //}
            locale: {
                format: 'M/DD hh:mm A',
                "customRangeLabel": "Custom Date",
                "weekLabel": "W",
                "daysOfWeek": [
                    "Su",
                    "Mo",
                    "Tu",
                    "We",
                    "Th",
                    "Fr",
                    "Sa"
                ],
                "monthNames": [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December"
                ],
                "firstDay": 1
            },

        }, FunctionName);
        if (DEFAULT_DISPLAY_FLAG == undefined || DEFAULT_DISPLAY_FLAG == 0) {
            FunctionName(startDate, endDate, 1);
            if (OpenFlag == "Open") {
                $('#' + ControlName).trigger('show.daterangepicker')
            }
        }

    };
    function reportrange(start, end) {
        document.getElementById("loader").style.display = "block";
        $scope.ReportSearch.START_DATE = start.format("MM/DD/yyyy");
        $scope.ReportSearch.END_DATE = end.format("MM/DD/yyyy");
        $scope.ReportSearch.INITIAL_START_DATE = startDate.format($scope.$parent.Datelocaleformat.format);
        $scope.ReportSearch.INITIAL_END_DATE = endDate.format($scope.$parent.Datelocaleformat.format);
        //document.getElementById("reportrange").innerText = start.format($scope.$parent.Datelocaleformat.format) + ' - ' + end.format($scope.$parent.Datelocaleformat.format);     
        let _datestr = moment(new Date(start)).format($scope.ReportSearch.REPORT_CALANDER_DATE_FORMAT) + ' - ' + moment(new Date(end)).format($scope.ReportSearch.REPORT_CALANDER_DATE_FORMAT)
        $('#reportrange span').html(_datestr);
        $scope.FETCHED_DATA_FROM_DB = [];
        $scope.ACTUAL_REPORT_DATA = [];
        if ($scope.ReportSearch.REPORT_OBJECT != null)
            setTimeout(() => {
                $scope.FETCHED_DATA_FROM_DB = [];
                $scope.ACTUAL_REPORT_DATA = [];
                $scope.GET_REPORT_DATA($scope.ReportSearch.REPORT_OBJECT);
            }, 3000);
    };

    function Pay_Shcedule_Date_Selected(start, end) {
        document.getElementById("loader").style.display = "block";
        $scope.ReportSearch.START_DATE = start.format("MM/DD/yyyy");
        $scope.ReportSearch.END_DATE = end.format("MM/DD/yyyy");
        $scope.ReportSearch.INITIAL_START_DATE = startDate.format($scope.$parent.Datelocaleformat.format);
        $scope.ReportSearch.INITIAL_END_DATE = endDate.format($scope.$parent.Datelocaleformat.format);
        //document.getElementById("reportrange").innerText = start.format($scope.$parent.Datelocaleformat.format) + ' - ' + end.format($scope.$parent.Datelocaleformat.format);     
        let _datestr = moment(new Date(start)).format($scope.ReportSearch.REPORT_CALANDER_DATE_FORMAT) + ' - ' + moment(new Date(end)).format($scope.ReportSearch.REPORT_CALANDER_DATE_FORMAT)
        $('#Pay_Shcedule_Date_Selected span').html(_datestr);
        $scope.RPRT_HRM_PAYROLL($scope.ReportSearch.REPORT_OBJECT, '', 1);
    };
    $(function () {
        startDate = moment().startOf('month');
        endDate = moment().endOf('month');
        $scope.SetUpDateRangereportsDatePicker('reportrange', startDate, endDate, reportrange);
        $scope.SetUpDateRangereportsDatePicker('Pay_Shcedule_Date_Selected', startDate, endDate, Pay_Shcedule_Date_Selected, 1);
        //$('#reportrange span').html(startDate.format($scope.ReportSearch.REPORT_CALANDER_DATE_FORMAT) + ' - ' + endDate.format($scope.ReportSearch.REPORT_CALANDER_DATE_FORMAT));
        $('#reportrange span').html(moment(startDate).format($scope.ReportSearch.REPORT_CALANDER_DATE_FORMAT) + ' - ' + moment(endDate).format($scope.ReportSearch.REPORT_CALANDER_DATE_FORMAT));
        $('#Pay_Shcedule_Date_Selected span').html('Please select date range');

    });
    $(document).on("click", ".ranges ul li", function (event) {
        var CUSTOM_DATE_TYPE_SELECTED = $(this).attr("data-range-key");
        if (CUSTOM_DATE_TYPE_SELECTED == "Custom Date" && $scope.IS_CUSTOME_DATE_SELECTED == 1) {
            $scope.IS_CUSTOME_DATE_SELECTED = 2;
            var start = moment().startOf('month');
            var end = moment().add(1, 'M').endOf('month');
            $scope.SetUpDateRangereportsDatePicker('reportrange', start, end, reportrange, 1, "right", 'Open');
            $('#reportrange span').html(moment(startDate).format($scope.ReportSearch.REPORT_CALANDER_DATE_FORMAT) + ' - ' + moment(endDate).format($scope.ReportSearch.REPORT_CALANDER_DATE_FORMAT));
            $('#reportrange').data('daterangepicker').show();
        }
        else {
            $scope.IS_CUSTOME_DATE_SELECTED = 1;
        }
    });
    $scope.$parent.HRMIndexscope = $scope;

    /* print pdf file */
    $scope.PRINT_PDF_PAGE = function (ID, FILE_NAME) {

        window.scrollTo(0, 0);
        document.getElementById("loader").style.display = "block";
        const node = document.getElementById(ID);
        const clone = node.cloneNode(true);
        if (clone.getElementsByClassName('table-responsive').length != 0 && clone.getElementsByClassName('table-responsive') != undefined) {
            for (let i = 0; i < clone.getElementsByClassName('table-responsive').length; i++) {
                clone.getElementsByClassName('table-responsive')[i].classList.remove('scrollbar-wrapper');
                clone.getElementsByClassName('table-responsive')[i].classList.remove('mx-height-400');
                //clone.getElementsByClassName('table-responsive')[i].getElementsByClassName('mb-0')[0].getElementsByClassName('t_foot_fixed')[0].setAttribute("style", "display:none");
            }
            for (let i = 0; i < clone.getElementsByClassName('table-responsive')[0].getElementsByClassName('ng-hide').length; i++) {
                clone.getElementsByClassName('table-responsive')[0].getElementsByClassName('ng-hide')[i].setAttribute("style", "display:none")
                //clone.getElementsByClassName('table-responsive')[0].classList.remove('fa-chevron-down');
            }
            //for (let i = 0; i < clone.getElementsByClassName('table-responsive')[0].getElementsByClassName('fa-chevron-down').length; i++) {
            //    clone.getElementsByClassName('table-responsive')[0].classList.remove('fa-chevron-down');
            //    //clone.getElementsByClassName('table-responsive')[0].classList.remove('fa-chevron-down');
            //}
        }
        if (clone.getElementsByClassName('dropdown-menu DontHideOnClick scrollbar-wrapper w-auto show').length != 0 && clone.getElementsByClassName('dropdown-menu DontHideOnClick scrollbar-wrapper w-auto show') != undefined) {
            for (let i = 0; i < clone.getElementsByClassName('dropdown-menu DontHideOnClick scrollbar-wrapper w-auto show').length; i++) {
                clone.getElementsByClassName('dropdown-menu DontHideOnClick scrollbar-wrapper w-auto show')[i].setAttribute("style", "display:none");
            }
        }


        clone.getElementsByClassName('col-xxl-auto col-xl-auto col-md-auto site_width')[0].setAttribute("style", "display:none");
        clone.getElementsByClassName('col-xxl-auto col-xl-auto col-md-auto department_filter')[0].setAttribute("style", "display:none");
        clone.getElementsByClassName('col-xxl-auto col-xl-auto col-md-auto position_filter')[0].setAttribute("style", "display:none");
        clone.getElementsByClassName('col-xxl-auto col-xl-auto col-md-auto pay_type')[0].setAttribute("style", "display:none");
        clone.getElementsByClassName('col-xxl-auto col-xl-auto col-md-auto holiday_plan')[0].setAttribute("style", "display:none");
        clone.getElementsByClassName('col-xxl-auto col-xl-auto col-md-auto absence_type')[0].setAttribute("style", "display:none");
        clone.getElementsByClassName('col-xxl-auto col-xl-auto col-md-auto absence_type')[0].setAttribute("style", "display:none");
        clone.getElementsByClassName('col-xxl-auto col-xl-auto col-md-auto termination_filter')[0].setAttribute("style", "display:none");
        clone.getElementsByClassName('col-xxl-auto col-xl-auto col-md-auto standard_role')[0].setAttribute("style", "display:none");
        clone.getElementsByClassName('col-xxl-auto col-xl-auto col-md-auto date_filter')[0].setAttribute("style", "display:none");
        clone.getElementsByClassName('col-xxl-2 col-xl-2 col-md-2 date_ranger_filter')[0].setAttribute("style", "display:none");
        clone.getElementsByClassName('col-xxl-2 col-xl-2 col-md-2 single_date_filter')[0].setAttribute("style", "display:none");
        clone.getElementsByClassName('col-xxl-2 col-xl-2 col-md-2 week_rng')[0].setAttribute("style", "display:none");
        clone.getElementsByClassName('col-xxl-2 col-xl-2 col-md-2 pdf_date_filter')[0].setAttribute("style", "display:none");
        clone.getElementsByClassName('col-xxl-auto col-xl-auto col-md-auto pay_schedule')[0].setAttribute("style", "display:none");
        clone.getElementsByClassName('col-xxl-auto col-xl-auto col-md-auto section_type')[0].setAttribute("style", "display:none");

        angular.forEach($scope.REPORT_FILTERS_LIST, function (item) {
            switch (item.FILTER_ID) {
                case 1:
                    {
                        $scope.ReportSearch.REPORT_ID != 56 ? clone.getElementsByClassName('col-xxl-auto col-xl-auto col-md-auto department_filter')[0].setAttribute("style", "display:block") :
                            clone.getElementsByClassName('col-xxl-auto col-xl-auto col-md-auto department_filter')[0].setAttribute("style", "display:none");
                    }
                    break;
                case 2:
                    {
                        $scope.ReportSearch.REPORT_ID != 56 ? clone.getElementsByClassName('col-xxl-auto col-xl-auto col-md-auto position_filter')[0].setAttribute("style", "display:block") :
                            clone.getElementsByClassName('col-xxl-auto col-xl-auto col-md-auto position_filter')[0].setAttribute("style", "display:none");
                    }
                    break;
                case 3:
                    clone.getElementsByClassName('col-xxl-auto col-xl-auto col-md-auto pay_type')[0].setAttribute("style", "display:block");
                    break;
                case 4:
                    // code block
                    break;
                case 5:
                    break;
                case 6:
                    {
                        $scope.ReportSearch.REPORT_ID != 56 ? clone.getElementsByClassName('col-xxl-auto col-xl-auto col-md-auto site_width')[0].setAttribute("style", "display:block") :
                            clone.getElementsByClassName('col-xxl-auto col-xl-auto col-md-auto site_width')[0].setAttribute("style", "display:none");
                    }
                    break;
                case 7:
                    break;
                case 8:
                    break;
                case 9:
                    {
                        if ($scope.ReportSearch.VIEW_BY_ID == 1) {
                            clone.getElementsByClassName('col-xxl-auto col-xl-auto col-md-auto date_filter')[0].setAttribute("style", "display:block");
                            var date_Display = moment($scope.ReportSearch.START_DATE).format($scope.$parent.Datelocaleformat.format);
                            clone.getElementsByClassName('col-xxl-2 col-xl-2 col-md-2 pdf_date_filter')[0].setAttribute("style", "display:block");
                            clone.getElementsByClassName('col-xxl-2 col-xl-2 col-md-2 pdf_date_filter')[0].getElementsByClassName("date_range mb-2")[0].children[0].innerHTML = date_Display;
                        }
                        else {
                            clone.getElementsByClassName('col-xxl-auto col-xl-auto col-md-auto date_filter')[0].setAttribute("style", "display:block");
                            var date_Display = moment($scope.ReportSearch.START_DATE).format($scope.$parent.Datelocaleformat.format) + ' - ' + moment($scope.ReportSearch.END_DATE).format($scope.$parent.Datelocaleformat.format);
                            clone.getElementsByClassName('col-xxl-2 col-xl-2 col-md-2 pdf_date_filter')[0].setAttribute("style", "display:block");
                            clone.getElementsByClassName('col-xxl-2 col-xl-2 col-md-2 pdf_date_filter')[0].getElementsByClassName("date_range mb-2")[0].children[0].innerHTML = date_Display;
                        }
                    }
                    break;
                case 10:
                    {
                        var date_Display = moment($scope.ReportSearch.START_DATE).format($scope.$parent.Datelocaleformat.format);
                        clone.getElementsByClassName('col-xxl-2 col-xl-2 col-md-2 pdf_date_filter')[0].setAttribute("style", "display:block");
                        clone.getElementsByClassName('col-xxl-2 col-xl-2 col-md-2 pdf_date_filter')[0].getElementsByClassName("date_range mb-2")[0].children[0].innerHTML = date_Display;
                    }
                    break;
                case 11:
                    clone.getElementsByClassName('col-xxl-auto col-xl-auto col-md-auto absence_type')[0].setAttribute("style", "display:block");
                    break;
                case 12:
                    clone.getElementsByClassName('col-xxl-auto col-xl-auto col-md-auto termination_filter')[0].setAttribute("style", "display:block");
                    break;
                case 13:
                    clone.getElementsByClassName('col-xxl-auto col-xl-auto col-md-auto standard_role')[0].setAttribute("style", "display:block");
                    break;
                case 14:
                    break;
                case 15:
                    break;
                case 16:
                    clone.getElementsByClassName('col-xxl-auto col-xl-auto col-md-auto section_type')[0].setAttribute("style", "display:block");
                    break;
                default:
                // code block
            }
        });
        if ($scope.ReportSearch.REPORT_ID != 43) {
            clone.getElementsByClassName('PDF_HIDE')[0].setAttribute("style", "display:none");
        }
        clone.querySelectorAll("#PRINT_PDF_PAGE")[0].style.display = 'none';
        clone.querySelectorAll("#EXPORT_XL_CSV")[0].style.display = 'none';


        var HTML = '<html><head><link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/timepicker/1.3.5/jquery.timepicker.min.css">' +
            '<link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />' +
            '<link href="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/fontawesome-pro-6.5.1-web/css/fontawesome.min.css" rel="stylesheet" />' +
            '<link href="https://app.wenodo.com/E_Scripts/Select2angularjs/select2.css" rel="stylesheet" />' +
            '<link href="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/fontawesome-pro-6.5.1-web/css/light.css" rel="stylesheet" />' +
            '<link href="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/fontawesome-pro-6.5.1-web/css/regular.css" rel="stylesheet" />' +
            '<link href="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/fontawesome-pro-6.5.1-web/css/solid.css" rel="stylesheet" />' +
            '<link href="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/fontawesome-pro-6.5.1-web/css/brands.css" rel="stylesheet" />' +
            '<link rel="stylesheet" href="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/bootstrap/bootstrap.css" />' +
            '<link href="https://app.wenodo.com/E_Scripts/daterangepicker-master/daterangepicker.css" rel="stylesheet" />' +
            '<link href="https://app.wenodo.com/E_Scripts/bootstrap-datepicker-1.6.4-dist/css/bootstrap-datepicker3.css" rel="stylesheet" />' +
            '<link href=" https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/css/select2.min.css" rel="stylesheet" />' +
            '<link rel="stylesheet" type="text/css" href="https://app.wenodo.com/E_Content/CustomCss/HR/hr-style.css?v=2" />' +
            '<link rel="stylesheet" type="text/css" href="https://app.wenodo.com/E_Content/CustomCss/HR/responsive.css">' +
            '<link href="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/Countries/intltelinput.min.css" rel="stylesheet" />' +
            '<script src="https://app.wenodo.com/AngularControllers/MasterCntrl.js"></script>' +
            '<script src="https://app.wenodo.com/AngularControllers/HumanResource/HRIndexController.js"></script>' +
            '<script src="https://app.wenodo.com/AngularControllers/HumanResource/UserJourneyController.js"></script>' +
            '<script src="https://app.wenodo.com/E_Scripts/angular-sanitize.min.js"></script>' +
            '<script src="https://app.wenodo.com/E_Scripts/MomentTimePicker/moment-with-locales.min.js"></script>' +
            '<script src="https://app.wenodo.com/E_Scripts/MomentTimePicker/angular-moment-picker.min.js"></script>' +
            '<link href="https://app.wenodo.com/E_Scripts/MomentTimePicker/angular-moment-picker.min.css" rel="stylesheet" />' +
            '<link href="https://app.wenodo.com/E_Content/plugins/croppie/croppie.css" rel="stylesheet" />' +
            '<script src="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/bootstrap/bootstrap.bundle.min.js"></script>' +
            '<script src="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/scrollbar/simplebar.js"></script>' +
            '<script src="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/scrollbar/custom.js"></script>' +
            '<script src="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/apex-chart/apex-chart.js"></script>' +
            '<script src="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/bootstrap/bootstrap-notify.min.js"></script>' +
            '<script src="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/wow/wow.min.js"></script>' +
            '<script src="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/tooltip-init.js"></script>' +
            '<script src="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/script.js"></script>' +
            '<script src="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/height-equal.js"></script>' +
            '<script src="https://app.wenodo.com/E_Scripts/bootstrap-datepicker-1.6.4-dist/js/bootstrap-datepicker.js"></script>' +
            '<script src="https://app.wenodo.com/E_Scripts/daterangepicker-master/daterangepicker.js"></script>' +
            '<script type="text/javascript" src="https://app.wenodo.com/E_Scripts/ExcelPdfJS/html2canvas.min.js"></script>' +
            '<script src="https://app.wenodo.com/E_Scripts/ExcelPdfJS/jspdf.min.js"></script>' +
            '<script src="https://app.wenodo.com/E_Scripts/Calendar/ui-bootstrap-tpls.min.js"></script>' +
            '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css">' +
            '<script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js"></script>' +
            '<script src="//cdnjs.cloudflare.com/ajax/libs/timepicker/1.3.5/jquery.timepicker.min.js"></script>' +
            '<script src="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/sidebar-menu.js"></script>' +
            '<script src="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/Countries/telephone-input.js"></script>' +
            '<script src="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/Countries/intltelinput.min.js"></script>' +
            '<script src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js"></script>' +
            '<script src="https://app.wenodo.com/E_Scripts/Select2angularjs/select2.js"></script>' +
            '<script src="https://app.wenodo.com/E_Scripts/Select2angularjs/select2_locale_sv.js"></script>' +
            '<script src="https://app.wenodo.com/E_Scripts/Select2angularjs/sc-select2.directive.js"></script>' +
            '<script src="https://app.wenodo.com/E_Scripts/ExcelPdfJS/alasql.min.js"></script>' +
            '<script src="https://app.wenodo.com/E_Scripts/ExcelPdfJS/xlsx.core.min.js"></script>' +
            '<script src="https://app.wenodo.com/E_Content/plugins/croppie/croppie.min.js"></script><script src ="https://app.wenodo.com/AngularControllers/CommonMethod.js"></script></head><body>' + clone.innerHTML + '</body></html>';

        let iframe = document.createElement("iframe");
        iframe.style.visibility = "hidden";
        if ($scope.ReportSearch.REPORT_ID == 41) {
            iframe.height = "7500px";
            iframe.width = "7500px";
        }
        else if ($scope.ReportSearch.REPORT_ID == 45) {
            iframe.height = "6000px";
            iframe.width = "7500px";
        }
        else {
            iframe.height = "4000px";
            iframe.width = "5000px";
        }

        document.body.appendChild(iframe);
        let iframedoc = iframe.contentDocument || iframe.contentWindow.document;
        iframedoc.body.innerHTML = HTML;


        html2canvas(iframedoc.body, { useCORS: true, scale: 2 }).then(function (canvas) {
            FILE_NAME = $scope.ReportSearch.REPORT_NAME;
            var imgBase64 = canvas.toDataURL('image/jpeg', 2.0);
            var doc = "";
            doc = new jsPDF("l", "pt", [canvas.width, canvas.height]);
            const pageWidth = doc.internal.pageSize.width;
            const pageHeight = doc.internal.pageSize.height;
            const widthRatio = pageWidth / canvas.width;
            const heightRatio = pageHeight / canvas.height;
            const ratio = widthRatio > heightRatio ? heightRatio : widthRatio;
            const canvasHeight = canvas.height * ratio;
            const ratio_1 = heightRatio > widthRatio ? widthRatio : heightRatio;
            const canvasWidth = canvas.width * ratio;
            doc.addImage(imgBase64, 'PNG', 20, 50, canvasWidth - 40, canvasHeight);
            doc.save(FILE_NAME + '.pdf');
            document.getElementById("loader").style.display = "none";
            document.querySelectorAll('iframe').forEach(
                function (elem) {
                    elem.parentNode.removeChild(elem);
                });
        });
    };
    $scope.RPRT_HRM_PAYROLL = function (REPORT_OBJECT, SHORT_ORDER_NAME, CLEAR_DATA_FLAG) {

        var reportObj = new Object();
        reportObj.PR_PAYTYPE_IDS = [];
        reportObj.PR_BRANCH_IDS = [];
        reportObj.PR_POSITION_IDS = [];
        reportObj.PR_DEPARTMENT_IDS = [];

        angular.forEach($scope.PAYTYPES_LIST, function (item) {
            if (item.IS_SELECTED == true) {
                var _obj = new Object();
                _obj.TABLE_ID = item.PAYTYPE_ID;
                reportObj.PR_PAYTYPE_IDS.push(_obj);
            }
        });
        if (reportObj.PR_PAYTYPE_IDS.length == 0) {
            var _obj = new Object();
            _obj.TABLE_ID = "";
            reportObj.PR_PAYTYPE_IDS.push(_obj);
        }
        angular.forEach($scope.HR_BRANCH_LIST, function (item) {
            if (item.IS_SELECTED == true) {
                var _obj = new Object();
                _obj.TABLE_ID = item.BRANCH_ID;
                reportObj.PR_BRANCH_IDS.push(_obj);
            }
        });
        if (reportObj.PR_BRANCH_IDS.length == 0) {
            var _obj = new Object();
            _obj.TABLE_ID = "";
            reportObj.PR_BRANCH_IDS.push(_obj);
        }
        angular.forEach($scope.POSITIONS_LIST, function (item) {
            if (item.IS_SELECTED == true) {
                var _obj = new Object();
                _obj.TABLE_ID = item.POSITION_ID;
                reportObj.PR_POSITION_IDS.push(_obj);
            }
        });
        if (reportObj.PR_POSITION_IDS.length == 0) {
            var _obj = new Object();
            _obj.TABLE_ID = "";
            reportObj.PR_POSITION_IDS.push(_obj);
        }
        angular.forEach($scope.DEPARTMENTS_LIST, function (item) {
            if (item.IS_SELECTED == true) {
                var _obj = new Object();
                _obj.TABLE_ID = item.DEPARTMENT_ID;
                reportObj.PR_DEPARTMENT_IDS.push(_obj);
            }
        });
        if (reportObj.PR_DEPARTMENT_IDS.length == 0) {
            var _obj = new Object();
            _obj.TABLE_ID = "";
            reportObj.PR_DEPARTMENT_IDS.push(_obj);
        }

        document.getElementById("loader").style.display = "block";
        $scope.ReportSearch.SEARCH = "";
        $scope.ReportSearch.REPORT_NAME = $scope.ReportSearch.REPORT_OBJECT.REPORT_NAME;

        reportObj.REPORT_40_FILTER = SHORT_ORDER_NAME == undefined || SHORT_ORDER_NAME == "" ? "Employee" : SHORT_ORDER_NAME;
        reportObj.CUSTOMER_ID = $scope.ReportSearch.CUSTOMER_ID;
        reportObj.ENTITY_ID = $scope.ReportSearch.ENTITY_ID;
        //reportObj.PR_DEPARTMENT_IDS = $scope.ReportSearch.PR_DEPARTMENT_IDS;
        //reportObj.PR_POSITION_IDS = $scope.ReportSearch.PR_POSITION_IDS;
        //reportObj.PR_BRANCH_IDS = $scope.ReportSearch.PR_SITE_IDS;
        reportObj.START_DATE = $scope.ReportSearch.START_DATE;
        reportObj.END_DATE = $scope.ReportSearch.END_DATE;
        reportObj.DATE = $scope.ReportSearch.START_DATE;
        reportObj.USER_ID = $scope.ReportSearch.USER_ID;
        reportObj.EMPLY_PRSNL_ID = $scope.ReportSearch.EMPLY_PRSNL_ID;
        reportObj.PAGE_SIZE = $scope.ReportSearch.PAGE_SIZE;
        reportObj.PAGE_NO = $scope.ReportSearch.PAGE_NO;
        reportObj.SETTING_88 = $scope.$parent.MASTER_GET_CUSTOMER_SETTINGS_VALUES(88);
        reportObj.PAY_SCHEDULE_ID = 0;
        reportObj.REPORT_ID = $scope.ReportSearch.REPORT_OBJECT.REPORT_ID;
        reportObj.DATETIME_FORMAT = $scope.$parent.DISPLAY_DATE_FORMAT;

        PrcCommMethods.REPORT_API(reportObj, 'RPRT_HRM_PAYROLL').then(function (data) {
            try {
                if (CLEAR_DATA_FLAG == 1) {
                    $scope.FETCHED_DATA_FROM_DB = [];
                }
                if (data.data.PO_SUCCESS[0].PO_SUCCESS == 1) {
                    if (data.data.Table.length < $scope.ReportSearch.PAGE_SIZE) {
                        $scope.GetData = false;
                        $scope.FETCHED_DATA_FROM_DB = angular.copy($scope.FETCHED_DATA_FROM_DB.concat(data.data.Table));
                        $scope.ACTUAL_REPORT_DATA = angular.copy($scope.FETCHED_DATA_FROM_DB);
                        $scope.ReportSearch.PAGE_NO = 1;
                        document.getElementById("loader").style.display = "none";
                    }
                    else {
                        $scope.GetData = true;
                        $scope.FETCHED_DATA_FROM_DB = angular.copy($scope.FETCHED_DATA_FROM_DB.concat(data.data.Table));
                        $scope.ACTUAL_REPORT_DATA = angular.copy($scope.FETCHED_DATA_FROM_DB);
                        $scope.LAZY_LOAD_GET_REPORT_DATA();
                    }

                }
                else {
                    if ($scope.ReportSearch.PAGE_NO > 1) {
                        $scope.GetData = false;
                        $scope.ReportSearch.PAGE_NO = 1;
                        document.getElementById("loader").style.display = "none";
                    }
                    else {
                        $scope.FETCHED_DATA_FROM_DB = [];
                        $scope.GetData = false;
                        $scope.ReportSearch.PAGE_NO = 1;
                        document.getElementById("loader").style.display = "none";
                    }
                }
            }
            catch (err) {
                document.getElementById("loader").style.display = "none";
                $scope.ReportSearch.PAGE_NO = 1;
            }
        });

    };
    $scope.LAZY_LOAD_RPRT_HRM_PAYROLL = function () {
        $scope.ReportSearch.PAGE_NO = parseInt($scope.ReportSearch.PAGE_NO) + 1;
        $scope.ReportSearch.IS_LAZY_LOAD_CLICKED = true;
        $scope.RPRT_HRM_PAYROLL($scope.ReportSearch.REPORT_OBJECT);
    };
});
