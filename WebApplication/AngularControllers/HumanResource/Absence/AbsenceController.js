app.controller('AbsenceController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    //$scope.$parent.DISPLAY_FLAG = true;
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(1);
    $scope.$parent.$parent.overlay_loading_HR_Loader = 'none';
   
    $scope.HR_COMMON_CODE_Fn();
    $scope.Fn_ABSENCE_TAB_CLICK = function (ABSENCE_TAB_ID) {
        $scope.ABSENCE_TAB_ID = ABSENCE_TAB_ID;
    };


    $scope.COUNT_HOLIDAY_VAL = 0;
    $scope.Fn_ABSENCE_TAB_CLICK(3);
    $scope.AbsenceSearch = {
        CUSTOMER_ID: $cookies.get("CUSTOMER_ID"),
        MODULE_ID: parseInt($cookies.get("MODULE_ID")),
        USER_ID: parseInt($cookies.get("USERID")),
        ENTITY_ID: null,
        PAGE_NO: 1,
        PAGE_SIZE: $scope.$parent.PAGE_SIZE,
        SORT_COLUMN_NO: 1,
        SORT_ORDER_NO: 1,
        CUSTOM_UNITS_NAME: null,
        CUSTOM_RELEASE_PERIOD: null,
        ACCURAL_METHOD: 1,
        ROUND_UP_DOWN: '',
        USE_52_WEEK_AVG: false,
        LEAVE_PAID: true,
        RENEW_AUTO: false,
        APPLY_AUTO: false,
        ALLOW_NGTV_BAL: false,
        PRO_RATE_LEAVE: false,
        LOGIN_EMPLOYEE_ID: 0,
        DD_DEFAULT_TEXT: $scope.$parent.DD_DEFAULT_TEXT,
        CUSTOM_ABSENCE_TYPE: $scope.$parent.DD_DEFAULT_TEXT,
        CUSTOM_CALCULATION_TYPE: $scope.$parent.DD_DEFAULT_TEXT,
        CUSTOM_ROUND_UP_DOWN: $scope.$parent.DD_DEFAULT_TEXT,
        DISABLE_FIELDS_ON_UPDATE: false,
    };

    const BlankPageObject = {
        CUSTOMER_ID: $cookies.get("CUSTOMER_ID"),
        MODULE_ID: parseInt($cookies.get("MODULE_ID")),
        USER_ID: parseInt($cookies.get("USERID")),
        ENTITY_ID: null,
        PAGE_NO: 1,
        PAGE_SIZE: $scope.$parent.PAGE_SIZE,
        SORT_COLUMN_NO: 1,
        SORT_ORDER_NO: 1,
        CUSTOM_UNITS_NAME: null,
        CUSTOM_RELEASE_PERIOD: null,
        ACCURAL_METHOD: 1,
        ROUND_UP_DOWN: '',
        USE_52_WEEK_AVG: false,
        LEAVE_PAID: true,
        RENEW_AUTO: false,
        APPLY_AUTO: false,
        ALLOW_NGTV_BAL: false,
        PRO_RATE_LEAVE: false,
        DD_DEFAULT_TEXT: $scope.$parent.DD_DEFAULT_TEXT,
        CUSTOM_ABSENCE_TYPE: $scope.$parent.DD_DEFAULT_TEXT,
        DISABLE_FIELDS_ON_UPDATE: false,
    };

    $scope.PlaceHolder = "Type here...";

    // Setting Tab
    $scope.AbsenceSettingSearch = {
        CUSTOMER_ID: $cookies.get("CUSTOMER_ID"),
        MODULE_ID: parseInt($cookies.get("MODULE_ID")),
        ENTITY_ID: null,
        USER_ID: parseInt($cookies.get("USERID")),
        PAGE_NO: 1,
        PAGE_SIZE: $scope.$parent.PAGE_SIZE,
        SORT_COLUMN_NO: 1,
        SORT_ORDER_NO: 1,
    };

    $scope.DEPARTMENTS_MASTER_LIST = [];
    $scope.POSITIONS_MASTER_LIST = [];
    $scope.EMPLOYEES_MASTER_LIST = [];
    $scope.DEPARTMENTS_LIST = [];
    $scope.POSITIONS_LIST = [];
    $scope.EMPLOYEES_LIST = [];
    $scope.ABSENCE_TYPE_LIST = [];
    $scope.HOLIDAY_ENTITLEMENTS_LIST = [];
    $scope.ADD_DEPARTMENTS_LIST = [];
    $scope.ADD_POSITIONS_LIST = [];
    $scope.ADD_EMPLOYEES_LIST = [];

    $scope.UNITS_LIST = [
        { "UNITS_ID": "1", "UNITS_NAME": "Days " },
        { "UNITS_ID": "2", "UNITS_NAME": "Shifts" },
        { "UNITS_ID": "3", "UNITS_NAME": "Hours" }
    ];

    $scope.RELEASE_PERIOD_LIST = [
        { "RELEASE_PERIOD": 1, "RELEASE_PERIOD_NAME": "Daily" },
        { "RELEASE_PERIOD": 2, "RELEASE_PERIOD_NAME": "Weekly" },
        { "RELEASE_PERIOD": 3, "RELEASE_PERIOD_NAME": "Monthly" },
        //{ "RELEASE_PERIOD": 4, "RELEASE_PERIOD_NAME": "4" },
        //{ "RELEASE_PERIOD": 5, "RELEASE_PERIOD_NAME": "5" },
        //{ "RELEASE_PERIOD": 6, "RELEASE_PERIOD_NAME": "6" },
        //{ "RELEASE_PERIOD": 7, "RELEASE_PERIOD_NAME": "7" },
        //{ "RELEASE_PERIOD": 8, "RELEASE_PERIOD_NAME": "8" },
        //{ "RELEASE_PERIOD": 9, "RELEASE_PERIOD_NAME": "9" },
        //{ "RELEASE_PERIOD": 10, "RELEASE_PERIOD_NAME": "10" },
        //{ "RELEASE_PERIOD": 11, "RELEASE_PERIOD_NAME": "11" },
        //{ "RELEASE_PERIOD": 12, "RELEASE_PERIOD_NAME": "12" }
    ];


    $scope.STARTING_ON_LIST = [
        { "STARTING_ON": "1", "STARTING_ON_NAME": "The employee's hire date " },
        { "STARTING_ON": "2", "STARTING_ON_NAME": "A specific date" },
    ];

    $scope.CALCULATION_TYPE_LIST = [
        { "CALCULATION_TYPE_ID": 1, "CALCULATION_TYPE": "Calendar Days (365 Days in a year)" },
        { "CALCULATION_TYPE_ID": 2, "CALCULATION_TYPE": "Working Days (using working days in the work pattern)" },
    ];
    // --0 FOR ROUND UP AND 1 FOR ROUND DOWN AND 2 FOR ACTUAL
    $scope.ROUND_UP_DOWN_LIST = [
        { "ROUND_UP_DOWN_ID": 0, "ROUND_UP_DOWN": "Round Up" },
        { "ROUND_UP_DOWN_ID": 1, "ROUND_UP_DOWN": "Round Down" },
        { "ROUND_UP_DOWN_ID": 2, "ROUND_UP_DOWN": "Actuals" }
    ];

    $scope.FISCAL_YEARS = [
        { "YEAR_ID": 1, "YEAR_NAME": "January" },
        { "YEAR_ID": 2, "YEAR_NAME": "February" },
        { "YEAR_ID": 3, "YEAR_NAME": "March" },
        { "YEAR_ID": 4, "YEAR_NAME": "April" },
        { "YEAR_ID": 5, "YEAR_NAME": "May" },
        { "YEAR_ID": 6, "YEAR_NAME": "June" },
        { "YEAR_ID": 7, "YEAR_NAME": "July" },
        { "YEAR_ID": 8, "YEAR_NAME": "August" },
        { "YEAR_ID": 9, "YEAR_NAME": "September" },
        { "YEAR_ID": 10, "YEAR_NAME": "October" },
        { "YEAR_ID": 11, "YEAR_NAME": "November" },
        { "YEAR_ID": 12, "YEAR_NAME": "December" }
    ];
    $(document).ready(function () {
        $(".ddmmPicker").datepicker({
            format: "dd/mm",
            minViewMode: 'days',
            maxViewMode: 'months',
            changeMonth: true,
            clearBtn: true,
            changeYear: false,
            closeText: 'asd',
            onClose: function (dateText, inst) {

            },
            clearDate: function (dateText, inst) {
            }
        });
    });
    $scope.DateInputLoaddmm = function (FLAG, SET_MONTH) {
        $(document).ready(function () {
            var date_inputs = document.getElementsByClassName("dateinputddmm") //our date input has the name "date"
            $(function () {
                $('[data-toggle="tooltip"]').tooltip();
                $('[data-toggle="popover"]').popover();
            });
            if (date_inputs.length > 0) {
                for (var i = 0; i < date_inputs.length; i++) {
                    var date_input = $('input[name="' + date_inputs[i].name + '"]'); //our date input has the name "date"
                    var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
                    var date = new Date();
                    var getMonth = date.getMonth();
                    var getDate = date.getDate();
                    var options = {
                        todayBtn: "linked",
                        daysOfWeekHighlighted: "0,6",
                        autoclose: true,
                        todayHighlight: true,
                        format: 'dd/mm',
                        clearBtn: true,
                        closeBtn: true,// close button visible
                        startDate: new Date(date.getFullYear(), date.getMonth(), getDate)
                    };
                    date_input.datepicker(options);
                }

            }
        });
    };


    $scope.HRM_GET_ABSENCE_TYPES = function () {
        var AbsenceObject = new Object();
        AbsenceObject.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        AbsenceObject.CUSTOMER_ID = $scope.AbsenceSearch.CUSTOMER_ID;
        PrcCommMethods.HUMANRESOURCE_API(AbsenceObject, 'HRM_GET_ABSENCE_TYPES').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.ABSENCE_TYPE_LIST = data.data.Table;
            } else {
                $scope.ABSENCE_TYPE_LIST = [];
            }
        });
    };
    $scope.HRM_GET_DEPARTMENTS = function () {
        var AbsenceObject = new Object();
        AbsenceObject.CUSTOMER_ID = $scope.AbsenceSearch.CUSTOMER_ID;
        AbsenceObject.ENTITY_ID = $scope.AbsenceSearch.ENTITY_ID;
        AbsenceObject.PAGE_NO = $scope.AbsenceSearch.PAGE_NO;
        AbsenceObject.PAGE_SIZE = $scope.AbsenceSearch.PAGE_SIZE;
        PrcCommMethods.HUMANRESOURCE_API(AbsenceObject, 'HRM_GET_DEPARTMENTS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.DEPARTMENTS_LIST = data.data.Table;
                $scope.DEPARTMENTS_MASTER_LIST = data.data.Table;
            } else {
                $scope.DEPARTMENTS_LIST = [];
            };

        });
    };
    $scope.HRM_GET_POSITIONS = function () {
        var AbsenceObject = new Object();
        AbsenceObject.CUSTOMER_ID = $scope.AbsenceSearch.CUSTOMER_ID;
        AbsenceObject.ENTITY_ID = $scope.AbsenceSearch.ENTITY_ID;
        AbsenceObject.PAGE_NO = $scope.AbsenceSearch.PAGE_NO;
        AbsenceObject.PAGE_SIZE = $scope.AbsenceSearch.PAGE_SIZE;
        PrcCommMethods.HUMANRESOURCE_API(AbsenceObject, 'HRM_GET_POSITIONS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.POSITIONS_LIST = data.data.Table;
                $scope.POSITIONS_MASTER_LIST = data.data.Table;
            } else {
                $scope.POSITIONS_LIST = [];
            };

        });
    };
    $scope.HRM_GET_EMPLOYTEE_LIST_BY_EMPLY_PRSNL_ID = function () {
        var UserModelObj = new Object();
        UserModelObj.EMPLY_PRSNL_ID = $scope.AbsenceSearch.LOGIN_EMPLOYEE_ID;
        UserModelObj.CUSTOMER_ID = $scope.AbsenceSearch.CUSTOMER_ID;
        UserModelObj.ENTITY_ID = $scope.AbsenceSearch.ENTITY_ID;
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'HRM_GET_EMPLOYTEE_LIST_BY_EMPLY_PRSNL_ID').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.EMPLOYEES_LIST = data.data.Table;
                $scope.EMPLOYEES_MASTER_LIST = data.data.Table;
            }
            else if (data.data == null) {
                $scope.EMPLOYEES_LIST = [];
            };
        });
    };


    $scope.LAZY_LOAD_HRM_GET_HOLIDAY_ENTITLEMENTS = function () {
        $scope.HRM_GET_HOLIDAY_ENTITLEMENTS();
    };
    $scope.HRM_GET_HOLIDAY_ENTITLEMENTS = function (FLAG) {
        $scope.$parent.overlay_loadingNew = 'block';
        if (FLAG == 1) {
            $scope.AbsenceSearch.PAGE_NO = 1;
            $scope.HOLIDAY_ENTITLEMENTS_LIST = [];
        };
        var AbsenceObject = new Object();
        AbsenceObject.CUSTOMER_ID = $scope.AbsenceSearch.CUSTOMER_ID;
        AbsenceObject.ENTITY_ID = $scope.AbsenceSearch.ENTITY_ID;;
        AbsenceObject.PAGE_NO = $scope.AbsenceSearch.PAGE_NO;
        AbsenceObject.PAGE_SIZE = $scope.AbsenceSearch.PAGE_SIZE;
        AbsenceObject.SORT_COLUMN_NO = $scope.AbsenceSearch.SORT_COLUMN_NO;
        AbsenceObject.SORT_ORDER_NO = $scope.AbsenceSearch.SORT_ORDER_NO;
        PrcCommMethods.HUMANRESOURCE_API(AbsenceObject, 'HRM_GET_HOLIDAY_ENTITLEMENTS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.$parent.overlay_loadingNew = 'none';
                $scope.HOLIDAY_ENTITLEMENTS_LIST = $scope.HOLIDAY_ENTITLEMENTS_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.AbsenceSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.AbsenceSearch.PAGE_NO = parseInt($scope.AbsenceSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                };
            }
            else {
                if ($scope.HOLIDAY_ENTITLEMENTS_LIST.length == 0) { }
                $scope.GetData = false;
                $scope.$parent.overlay_loadingNew = 'none';
            };
        });
    };
    $scope.HRM_GET_HOLIDAY_ENTITLEMENT_BY_ID = function (_entitlementId) {
        var AbsenceObject = new Object();
        AbsenceObject.HOLIDAY_ENTITLEMENT_ID = _entitlementId;
        PrcCommMethods.HUMANRESOURCE_API(AbsenceObject, 'HRM_GET_HOLIDAY_ENTITLEMENT_BY_ID').then(function (data) {
            if (data.data.Table.length > 0) {


                $scope.AbsenceSearch.HOLIDAY_ENTITLEMENT_ID = data.data.Table[0].HOLIDAY_ENTITLEMENT_ID;
                $scope.AbsenceSearch.ENTITLEMENT_NAME = data.data.Table[0].ENTITLEMENT_NAME;
                $scope.AbsenceSearch.INITIAL_VALUE = data.data.Table[0].INITIAL_VALUE;
                $scope.AbsenceSearch.UNITS_ID = data.data.Table[0].UNITS_ID;
                let unit = $scope.UNITS_LIST.find(x => x.UNITS_ID == data.data.Table[0].UNITS_ID);
                if (unit != undefined) {
                    $scope.SELECTED_UNIT_Fn(unit);
                };
                $scope.AbsenceSearch.FULL_TIME_VALUE = data.data.Table[0].FULL_TIME_VALUE;
                $scope.AbsenceSearch.ABSENCE_TYPE_ID = data.data.Table[0].ABSENCE_TYPE_ID;

                if (data.data.Table[0].ABSENCE_TYPE_ID > 0 && $scope.ABSENCE_TYPE_LIST.length > 0) {
                    $scope.SELECTED_ABSENCE_TYPE_Fn($scope.ABSENCE_TYPE_LIST[$scope.ABSENCE_TYPE_LIST.findIndex(x => x.ABSENCE_TYPE_ID == data.data.Table[0].ABSENCE_TYPE_ID)]);
                };

                $scope.AbsenceSearch.RESET_DATE = data.data.Table[0].RESET_DATE;
                $scope.AbsenceSearch.ROUND_UP_DOWN = data.data.Table[0].ROUND_UP_DOWN;
                $scope.AbsenceSearch.LEAVE_PAID = data.data.Table[0].LEAVE_PAID;
                $scope.AbsenceSearch.RENEW_AUTO = data.data.Table[0].RENEW_AUTO;
                $scope.AbsenceSearch.APPLY_AUTO = data.data.Table[0].APPLY_AUTO;
                $scope.AbsenceSearch.ALLOW_NGTV_BAL = data.data.Table[0].ALLOW_NGTV_BAL;
                $scope.AbsenceSearch.USE_52_WEEK_AVG = data.data.Table[0].USE_52_WEEK_AVG;
                $scope.AbsenceSearch.ACCURAL_METHOD = data.data.Table[0].ACCURAL_METHOD;
                $scope.AbsenceSearch.LEAVE_ACCURAL_RATE = data.data.Table[0].LEAVE_ACCURAL_RATE;
                $scope.AbsenceSearch.ACCURE_ON_OVERTIME_HOURS = data.data.Table[0].ACCURE_ON_OVERTIME_HOURS;
                $scope.AbsenceSearch.PERCENTAGE_OF_ENTITLEMENT = data.data.Table[0].PERCENTAGE_OF_ENTITLEMENT;
                $scope.AbsenceSearch.RELEASE_PERIOD = data.data.Table[0].RELEASE_PERIOD;

                if (data.data.Table[0].ROLLOVER_LEAVE_BALANCE == false) {
                    $scope.AbsenceSearch.ROLLOVER_LEAVE_BALANCE = true;
                }
                else {
                    if (data.data.Table[0].ROLLOVER_BALANCE == -1) {
                        $scope.AbsenceSearch.ROLLOVER_FULL_BALANCE = false;
                    }
                    else {
                        $scope.AbsenceSearch.ADD_THE_BALANCE = data.data.Table[0].ROLLOVER_BALANCE;
                        $scope.AbsenceSearch.ROLLOVER_FULL_BALANCE = true;
                    };
                };

                //$scope.AbsenceSearch.ROLLOVER_LEAVE_BALANCE = data.data.Table[0].ROLLOVER_LEAVE_BALANCE;

                if (data.data.Table[0].CALCULATION_TYPE_ID > 0 && $scope.CALCULATION_TYPE_LIST.length > 0) {
                    $scope.SELECTED_CALCULATION_TYPE_Fn($scope.CALCULATION_TYPE_LIST[$scope.CALCULATION_TYPE_LIST.findIndex(x => x.CALCULATION_TYPE_ID == data.data.Table[0].CALCULATION_TYPE_ID)]);
                };
                if (data.data.Table[0].ROUND_UP_DOWN >= 0 && $scope.ROUND_UP_DOWN_LIST.length > 0) {
                    $scope.SELECTED_ROUND_Fn($scope.ROUND_UP_DOWN_LIST[$scope.ROUND_UP_DOWN_LIST.findIndex(x => x.ROUND_UP_DOWN_ID == data.data.Table[0].ROUND_UP_DOWN)]);
                };


                if (data.data.Table[0].RELEASE_PERIOD > 0 && $scope.RELEASE_PERIOD_LIST.length > 0) {
                    $scope.SELECTED_RELEASE_PERIOD_Fn($scope.RELEASE_PERIOD_LIST[$scope.RELEASE_PERIOD_LIST.findIndex(x => x.RELEASE_PERIOD == data.data.Table[0].RELEASE_PERIOD)]);
                };

                $scope.AbsenceSearch.STARTING_ON = data.data.Table[0].STARTING_ON;

                if (data.data.Table[0].STARTING_ON > 0 && $scope.STARTING_ON_LIST.length > 0) {
                    $scope.SELECTED_STARTING_ON_Fn($scope.STARTING_ON_LIST[$scope.STARTING_ON_LIST.findIndex(x => x.STARTING_ON == data.data.Table[0].STARTING_ON)]);
                };

                $scope.AbsenceSearch.STARTING_ON_DATE = ($filter('date')(new Date(data.data.Table[0].STARTING_ON_DATE)));
                $scope.AbsenceSearch.PRO_RATE_LEAVE = data.data.Table[0].PRO_RATE_LEAVE;
                if (data.data.Table1.length > 0) {
                    $scope.ADD_DEPARTMENTS_LIST = data.data.Table1;
                    $scope.DEPARTMENTS_LIST = $scope.DEPARTMENTS_LIST.filter(function (department) {
                        return !$scope.ADD_DEPARTMENTS_LIST.some(function (addDepartment) {
                            return department.DEPARTMENT_ID === addDepartment.DEPARTMENT_ID;
                        });
                    });
                };
                if (data.data.Table2.length > 0) {
                    $scope.ADD_POSITIONS_LIST = data.data.Table2;
                    $scope.POSITIONS_LIST = $scope.POSITIONS_LIST.filter(function (position) {
                        return $scope.ADD_POSITIONS_LIST.some(function (addPosition) {
                            return position.POSITION_ID != addPosition.POSITION_ID;
                        });
                    });
                };
                if (data.data.Table3.length > 0) {
                    $scope.ADD_EMPLOYEES_LIST = data.data.Table3;
                    $scope.EMPLOYEES_LIST = $scope.EMPLOYEES_LIST.filter(function (employee) {
                        return $scope.ADD_EMPLOYEES_LIST.some(function (item) {
                            return employee.EMPLY_PRSNL_ID != item.EMPLY_PRSNL_ID;
                        });
                    });
                };
                $scope.$parent.scrollToSection("absence");
            }
            else {
                if (data.data == 0) {
                    $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                };
            };
        });
    };


    $scope.ADD_DEPARTMENTS_Fn = function (_department) {
        $scope.departmentSearch = '';
        $scope.ADD_DEPARTMENTS_LIST.push(angular.copy(_department));
        $scope.DEPARTMENTS_LIST = $scope.DEPARTMENTS_LIST.filter(function (department) {
            return department !== _department;
        });
    };

    $scope.REMOVE_DEPARTMENTS_Fn = function (_department) {
        $scope.DEPARTMENTS_LIST.push(angular.copy(_department));
        $scope.ADD_DEPARTMENTS_LIST = $scope.ADD_DEPARTMENTS_LIST.filter(function (department) {
            return department !== _department;
        });
    };
    $scope.ADD_POSITIONS_Fn = function (_position) {
        $scope.positionSearch = '';
        $scope.ADD_POSITIONS_LIST.push(angular.copy(_position));
        $scope.POSITIONS_LIST = $scope.POSITIONS_LIST.filter(function (position) {
            return position !== _position;
        });
    };

    $scope.REMOVE_POSITIONS_Fn = function (_postition) {
        $scope.POSITIONS_LIST.push(angular.copy(_postition));
        $scope.ADD_POSITIONS_LIST = $scope.ADD_POSITIONS_LIST.filter(function (position) {
            return position !== _postition;
        });
    };

    $scope.ADD_EMPLOYEE_Fn = function (_employee) {
        $scope.employeeSearch = '';
        $scope.ADD_EMPLOYEES_LIST.push(angular.copy(_employee));
        $scope.EMPLOYEES_LIST = $scope.EMPLOYEES_LIST.filter(function (item) {
            return item !== _employee;
        });
    };

    $scope.REMOVE_EMPLOYEE_Fn = function (_employee) {
        $scope.EMPLOYEES_LIST.push(angular.copy(_employee));
        $scope.ADD_EMPLOYEES_LIST = $scope.ADD_EMPLOYEES_LIST.filter(function (item) {
            return item !== _employee;
        });
    };



    $scope.EDIT_HOLIDAY_ENTITLEMENT_Fn = function (_param_absence) {
        $scope.SELECTED_HOLIDAY = _param_absence;
        $scope.COUNT_HOLIDAY_VAL = 0;
        var CusModelObj = new Object();
        CusModelObj.HOLIDAY_ENTITLEMENT_ID = _param_absence.HOLIDAY_ENTITLEMENT_ID;
        CusModelObj.CUSTOMER_ID = $cookies.get("CUSTOMER_ID");
        CusModelObj.ENTITY_ID = $cookies.get("ENTITY_ID");//$scope.AbsenceSearch.ENTITY_ID;
        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_GET_EMPLOYEE_COUNT_FOR_HOLIDAY_ENTITLEMENTS').then(function (data) {
            if (data.data.Table.length > 0) {
                var Valid = 0; $scope.COUNT_VAL = 0;
                angular.forEach(data.data.Table, function (_count) {
                    if (_count.RECORD_COUNT > 0) {
                        Valid = Valid + _count.RECORD_COUNT;
                    };
                })
                $scope.COUNT_HOLIDAY_VAL = Valid;

                if (Valid > 0) {
                    $scope.AbsenceSearch.DISABLE_FIELDS_ON_UPDATE = true;
                }
                else {
                    $scope.AbsenceSearch.DISABLE_FIELDS_ON_UPDATE = false;
                };
                $scope.HRM_GET_HOLIDAY_ENTITLEMENT_BY_ID(_param_absence.HOLIDAY_ENTITLEMENT_ID);
            } else {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            };
        });
    };

    $scope.POP_DELETE_HOLIDAY_Fn = function (_holiday) {
        $scope.SELECTED_HOLIDAY = _holiday;
        var CusModelObj = new Object();
        CusModelObj.HOLIDAY_ENTITLEMENT_ID = _holiday.HOLIDAY_ENTITLEMENT_ID;
        CusModelObj.CUSTOMER_ID = $scope.AbsenceSearch.CUSTOMER_ID;
        CusModelObj.ENTITY_ID = $cookies.get("ENTITY_ID");//$scope.AbsenceSearch.ENTITY_ID;
        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_GET_EMPLOYEE_COUNT_FOR_HOLIDAY_ENTITLEMENTS').then(function (data) {
            if (data.data.Table.length > 0) {
                var Valid = 0; $scope.COUNT_VAL = 0;
                angular.forEach(data.data.Table, function (_count) {
                    if (_count.RECORD_COUNT > 0) {
                        Valid = Valid + _count.RECORD_COUNT;
                    }
                })
                $scope.COUNT_VAL = Valid;
                $('#Delete_HolidayEntitlement').modal('show');
            } else {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            };
        });
    };
    $scope.DELETE_HOLIDAY_ENTITLEMENT_Fn = function (_holiday_param) {
        $scope.HRM_DELETE_HOLIDAY_ENTITLEMENTS(_holiday_param, true);
    };

    $scope.ACCRUAL_METHOD_Fn = function (_methodType) {
        $scope.AbsenceSearch.ACCURAL_METHOD = _methodType;
        console.log("Absence Method", $scope.AbsenceSearch.ACCURAL_METHOD);
    };

    $scope.SELECTED_UNIT_Fn = function (_param_units) {
        $scope.AbsenceSearch.CUSTOM_UNITS_NAME = _param_units.UNITS_NAME;
        $scope.AbsenceSearch.UNITS_ID = _param_units.UNITS_ID;
    };
    $scope.SELECTED_RELEASE_PERIOD_Fn = function (_releasePeriod) {
        $scope.AbsenceSearch.CUSTOM_RELEASE_PERIOD_NAME = _releasePeriod.RELEASE_PERIOD_NAME;
        $scope.AbsenceSearch.RELEASE_PERIOD = _releasePeriod.RELEASE_PERIOD;
    };
    $scope.SELECTED_RELEASE_PERIOD_Fn($scope.RELEASE_PERIOD_LIST[1]);
    $scope.SELECTED_STARTING_ON_Fn = function (_startingOn) {
        $scope.AbsenceSearch.CUSTOM_STARTING_ON_NAME = _startingOn.STARTING_ON_NAME;
        $scope.AbsenceSearch.STARTING_ON = _startingOn.STARTING_ON;
    };
    $scope.SELECTED_ABSENCE_TYPE_Fn = function (_absType) {
        if (_absType == '') {
            $scope.AbsenceSearch.CUSTOM_ABSENCE_TYPE = $scope.AbsenceSearch.DD_DEFAULT_TEXT;
            $scope.AbsenceSearch.ABSENCE_TYPE_ID = '';
        } else {
            $scope.AbsenceSearch.CUSTOM_ABSENCE_TYPE = _absType.ABSENCE_TYPE;
            $scope.AbsenceSearch.ABSENCE_TYPE_ID = _absType.ABSENCE_TYPE_ID;
        }
    };
    $scope.SELECTED_UNIT_Fn($scope.UNITS_LIST[0]);

    $scope.SEARCH_DEPARTMENT_Fn = function (_department) {
        if (!_department) {
            return $scope.DEPARTMENTS_LIST;
        };

        var lowerCaseSearchName = _department.toLowerCase();

        return $scope.DEPARTMENTS_LIST.filter(function (department) {
            return department.DEPARTMENT_NAME.toLowerCase().includes(lowerCaseSearchName);
        });
    };
    $scope.SELECTED_CALCULATION_TYPE_Fn = function (calculationType) {
        if (calculationType == '') {
            $scope.AbsenceSearch.CUSTOM_CALCULATION_TYPE = $scope.AbsenceSearch.DD_DEFAULT_TEXT;
            $scope.AbsenceSearch.CALCULATION_TYPE_ID = '';
        } else {
            $scope.AbsenceSearch.CUSTOM_CALCULATION_TYPE = calculationType.CALCULATION_TYPE;
            $scope.AbsenceSearch.CALCULATION_TYPE_ID = calculationType.CALCULATION_TYPE_ID;
        };
    };

    $scope.SELECTED_ROUND_Fn = function (round) {
        if (round == '') {
            $scope.AbsenceSearch.CUSTOM_ROUND_UP_DOWN = $scope.AbsenceSearch.DD_DEFAULT_TEXT;
            $scope.AbsenceSearch.ROUND_UP_DOWN_ID = '';
        } else {
            $scope.AbsenceSearch.CUSTOM_ROUND_UP_DOWN = round.ROUND_UP_DOWN;
            $scope.AbsenceSearch.ROUND_UP_DOWN_ID = round.ROUND_UP_DOWN_ID;
        };
    };

    $scope.SELECTED_FISCAL_YEAR_Fn = function (_financial_year) {
        $scope.AbsenceSettingSearch.CUSTOM_FISCAL_YEAR = _financial_year.YEAR_NAME;
        $scope.AbsenceSettingSearch.YEAR_ID = _financial_year.YEAR_ID;
    };
    $scope.SELECTED_FISCAL_YEAR_Fn($scope.FISCAL_YEARS[0]);
    $scope.nginitteamleave_Fn = function (_employee) {
        _employee.SHORT_NAME = $scope.TextReturn(_employee.EMPLOYEE_NAME);
    };

    $scope.HRM_GET_DEPARTMENTS();
    $scope.HRM_GET_POSITIONS();
    $scope.HRM_GET_ABSENCE_TYPES();
    $scope.HRM_GET_HOLIDAY_ENTITLEMENTS(1);
    $scope.HRM_GET_EMPLOYTEE_LIST_BY_EMPLY_PRSNL_ID();
    // Setting Tab


    $scope.GET_CUSTOMER_SETTINGS = function (_param_retun_value, _param_tableids, _param_CUSTOMER_ID, _param_module) {
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
                    if (_loop_value.SETTING_MASTER_ID == 74) {
                        $scope.AbsenceSettingSearch.TIME_OFF = parseInt(_loop_value.SETTING_VALUE) == 1 ? true : false;
                    }
                    else if (_loop_value.SETTING_MASTER_ID == 75) {
                        $scope.AbsenceSettingSearch.WORK_PATTERN = parseInt(_loop_value.SETTING_VALUE) == 1 ? true : false;
                    }
                    else if (_loop_value.SETTING_MASTER_ID == 76) {
                        $scope.AbsenceSettingSearch.ROLLOVER_LEAVE_BALANCE = parseInt(_loop_value.SETTING_VALUE) == 1 ? true : false;
                    }
                    else if (_loop_value.SETTING_MASTER_ID == 77) {
                        const setting_value = parseInt(_loop_value.SETTING_VALUE);
                        $scope.AbsenceSettingSearch.ROLLOVER_FULL_BALANCE = setting_value == 0 ? false : true;
                        if ($scope.AbsenceSettingSearch.ROLLOVER_FULL_BALANCE) {
                            $scope.AbsenceSettingSearch.ADD_THE_BALANCE = setting_value;
                        }
                    }
                    else if (_loop_value.SETTING_MASTER_ID == 78) {
                        $scope.AbsenceSettingSearch.TIME_OFF_ADV = parseFloat(_loop_value.SETTING_VALUE) == 1 ? true : false;
                    }
                    else if (_loop_value.SETTING_MASTER_ID == 89) {
                        if (_loop_value.SETTING_VALUE != null) {
                            $scope.AbsenceSettingSearch.YEAR_ID = parseFloat(_loop_value.SETTING_VALUE);
                            let fiscalIndex = $scope.FISCAL_YEARS.findIndex(x => x.YEAR_ID == _loop_value.SETTING_VALUE);
                            if (fiscalIndex > 0) {
                                $scope.SELECTED_FISCAL_YEAR_Fn($scope.FISCAL_YEARS[fiscalIndex]);
                            }
                        }
                        else {
                            $scope.AbsenceSettingSearch.YEAR_ID = 1;
                            $scope.UPDATE_FISCAL_YEAR_SETTING_Fn(1);
                        };
                    };
                });
            }
            else if (data.data == 0) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            };
        });
    };

    $scope.EDIT_ABSENCE_TYPE_Fn = function (_param_absenece, index) {
        $scope.AbsenceSettingSearch.ABSENCE_TYPE_ID = _param_absenece.ABSENCE_TYPE_ID;
        $scope.AbsenceSettingSearch.ABSENCE_TYPE = _param_absenece.ABSENCE_TYPE;

        $scope.AbsenceSettingSearch.APPLY_BY_EMPLOYEE = _param_absenece.APPLY_BY_EMPLOYEE;
        $scope.AbsenceSettingSearch.APPLY_BY_MANAGER = _param_absenece.APPLY_BY_MANAGER;
        $scope.AbsenceSettingSearch.ASSIGNMENT_REQUIRED = _param_absenece.ASSIGNMENT_REQUIRED;
    };

    $scope.DELETE_ABSENCE_TYPE_Fn = function (_param_absenece, index) {

        $scope.SELECTED_ABSENCE = _param_absenece;

        var AbsenceSettingObject = new Object();
        AbsenceSettingObject.ABSENCE_TYPE_ID = $scope.SELECTED_ABSENCE.ABSENCE_TYPE_ID;
        PrcCommMethods.HUMANRESOURCE_API(AbsenceSettingObject, 'HRM_GET_EMPLOYEE_COUNT_FOR_ABSENCE_TYPE').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.COUNT_VAL = 0;
                if (data.data.Table[0].EMPLOYEE_COUNT_FOR_ABSENCE_TYPE > 0) {
                    $scope.COUNT_VAL = data.data.Table[0].EMPLOYEE_COUNT_FOR_ABSENCE_TYPE;
                    //$scope.$parent.ShowAlertBox("Attention", data.data.Table[0].ABSENCE_TYPE + ' Absence type are not deleted because this type its already schedule in employee.', 3000);
                }
                $('#Delete_Absence').modal('show');
                //else {
                //    $scope.SELECTED_ABSENCE.MESSAGE = "It is safe to perform this operation as it hasn't been assigned to any employee. Do you want to proceed?";
                //    $('#Delete_Absence').modal('show');
                //}
            } else {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            };
        });
    }
    $scope.LAZY_LOAD_GET_ABSENCE_TYPES = function () {
        // $scope.HRM_INS_UPD_ABSENCE_TYPES();
    };
    $scope.HRM_DELETE_ABSENCE_TYPES = function (_param_absence, _param_call_Flag) {
        var AbsenceSettingObject = new Object();
        AbsenceSettingObject.CUSTOMER_ID = $scope.AbsenceSettingSearch.CUSTOMER_ID;
        AbsenceSettingObject.ENTITY_ID = $scope.AbsenceSettingSearch.ENTITY_ID;
        AbsenceSettingObject.ACTIVE = 0;
        AbsenceSettingObject.USER_ID = $scope.AbsenceSettingSearch.USER_ID;
        AbsenceSettingObject.ABSENCE_TYPE_ID = _param_absence.ABSENCE_TYPE_ID;
        AbsenceSettingObject.ABSENCE_TYPE = "";
        AbsenceSettingObject.APPLY_BY_MANAGER = 0;
        AbsenceSettingObject.APPLY_BY_EMPLOYEE = 0;
        PrcCommMethods.HUMANRESOURCE_API(AbsenceSettingObject, 'HRM_INS_UPD_ABSENCE_TYPES').then(function (data) {
            if (data.data > 0) {
                $scope.$parent.ShowAlertBox("Success", 'Absence Type deleted successfully', 3000);
                $scope.HRM_GET_ABSENCE_TYPES();
            };
            if (data.data == 0) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            };
        });
    };
    $scope.HRM_INS_UPD_ABSENCE_TYPES = function (_param_absence, _param_call_Flag) {
        $scope.ABSENCE_FORM.submitted = true;
        if ($scope.ABSENCE_FORM.$valid) {
            var AbsenceSettingObject = new Object();
            AbsenceSettingObject.CUSTOMER_ID = $scope.AbsenceSettingSearch.CUSTOMER_ID;
            AbsenceSettingObject.ENTITY_ID = $scope.AbsenceSettingSearch.ENTITY_ID;
            AbsenceSettingObject.ACTIVE = _param_call_Flag == 2 ? 0 : 1;
            AbsenceSettingObject.USER_ID = $scope.AbsenceSettingSearch.USER_ID;
            AbsenceSettingObject.ABSENCE_TYPE_ID = $scope.AbsenceSettingSearch.ABSENCE_TYPE_ID;
            AbsenceSettingObject.ABSENCE_TYPE = $scope.AbsenceSettingSearch.ABSENCE_TYPE;
            AbsenceSettingObject.APPLY_BY_MANAGER = $scope.AbsenceSettingSearch.APPLY_BY_MANAGER ? 1 : 0;
            AbsenceSettingObject.APPLY_BY_EMPLOYEE = $scope.AbsenceSettingSearch.APPLY_BY_EMPLOYEE ? 1 : 0;
            AbsenceSettingObject.ASSIGNMENT_REQUIRED = $scope.AbsenceSettingSearch.ASSIGNMENT_REQUIRED ? 1 : 0;
            PrcCommMethods.HUMANRESOURCE_API(AbsenceSettingObject, 'HRM_INS_UPD_ABSENCE_TYPES').then(function (data) {
                if (data.data > 0) {
                    if (($scope.AbsenceSettingSearch.ABSENCE_TYPE_ID == 0 || $scope.AbsenceSettingSearch.ABSENCE_TYPE_ID == undefined) && _param_call_Flag == 1) {
                        $scope.$parent.ShowAlertBox("Success", 'Absence Type added successfully', 3000);
                    }
                    else if ($scope.AbsenceSettingSearch.ABSENCE_TYPE_ID > 0 && _param_call_Flag == 1) {
                        $scope.$parent.ShowAlertBox("Success", 'Absence Type updated successfully', 3000);
                    }
                    else if ($scope.AbsenceSettingSearch.ABSENCE_TYPE_ID > 0 && _param_call_Flag == 2) {
                        $scope.$parent.ShowAlertBox("Success", 'Absence Type Deleted successfully', 3000);
                    };

                    $scope.HRM_GET_ABSENCE_TYPES();
                    $scope.ABSENCE_TYPE_RESET_Fn();

                }
                else if (data.data < 0) {
                    $scope.$parent.ShowAlertBox("Attention", 'Already Added', 3000);
                };
                if (data.data == 0) {
                    $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                };
            });
        }
    };

    $scope.INS_UPD_CUSTOMER_SETTINGS = function (SETTING_VALUE, SETTING_MASTER_ID, MULTI_SETTINGS, DEFAULT_SETTING) {
        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_ID = $scope.AbsenceSettingSearch.CUSTOMER_ID;
        CusModelObj.USER_ID = $scope.AbsenceSettingSearch.USER_ID;
        CusModelObj.CUSTOMER_SETTINGS_TYPE = [];
        if (MULTI_SETTINGS != undefined && MULTI_SETTINGS.length > 0) {
            angular.forEach(MULTI_SETTINGS, function (_loop_value) {
                var readonly = new Object();
                readonly.SETTING_VALUE = _loop_value.SETTING_VALUE;
                readonly.SETTING_MASTER_ID = _loop_value.SETTING_MASTER_ID;
                CusModelObj.CUSTOMER_SETTINGS_TYPE.push(readonly);
            });
        } else {
            var readonly = new Object();
            readonly.SETTING_VALUE = SETTING_VALUE ? 1 : 0;
            readonly.SETTING_MASTER_ID = SETTING_MASTER_ID;
            CusModelObj.CUSTOMER_SETTINGS_TYPE.push(readonly);
        }
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
                if (DEFAULT_SETTING == 1) {
                }
                else {
                    $scope.$parent.ShowAlertBox("Success", 'Updated successfully', 3000);
                };
            }
            if (data.data == 0) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            };
            $scope.$parent.MASTER_GET_CUSTOMER_SETTINGS('46,47,52,89', true, "NO_REDIRECTION");
        });
    };

    $scope.UPDATE_CUSTOMER_SETTINGS_Fn = function () {
        var SETTINGS = [];
        var readonly = new Object()
        readonly.SETTING_VALUE = $scope.AbsenceSettingSearch.ROLLOVER_LEAVE_BALANCE ? 1 : 0;
        readonly.SETTING_MASTER_ID = 76;
        SETTINGS.push(readonly);

        readonly = new Object()
        readonly.SETTING_VALUE = $scope.AbsenceSettingSearch.ROLLOVER_FULL_BALANCE == false ? 0 : $scope.AbsenceSettingSearch.ADD_THE_BALANCE;
        readonly.SETTING_MASTER_ID = 77;
        SETTINGS.push(readonly);

        $scope.INS_UPD_CUSTOMER_SETTINGS('', '', SETTINGS);
    };

    $scope.UPDATE_FISCAL_YEAR_SETTING_Fn = function (DEAFULT_SET) {
        var SETTINGS = [];
        var readonly = new Object()
        readonly.SETTING_VALUE = 1;
        readonly.SETTING_MASTER_ID = 89;
        SETTINGS.push(readonly);
        $scope.INS_UPD_CUSTOMER_SETTINGS('', '', SETTINGS, DEAFULT_SET);
    };

    function getNextResetDate(resetResult) {
        const currentYear = new Date().getFullYear();
        const resetDay = resetResult[0];
        const resetMonth = resetResult[1];

        if (new Date(currentYear, resetMonth, resetDay) > new Date()) {
            return new Date(currentYear, resetMonth, resetDay);
        } else {
            return new Date(currentYear + 1, resetMonth, resetDay);
        };
    }

    $scope.HRM_INS_UPD_HOLIDAY_ENTITLEMENTS = function (_param_absence, _delete_flag = false) {
        $scope.Absenceform.submitted = true;
        let count = 0;
        var resetresult = _param_absence.RESET_DATE.split('/');
        if (resetresult.length < 2 || resetresult.length > 2) {
            count = 1;
        }
        else {
            if (resetresult[0] > 31 || resetresult[1] > 12) {

                count = 1;
            }
        };
        resetresult[0] = parseInt(resetresult[0]) < 10 ? "0" + parseInt(resetresult[0]) : resetresult[0];
        resetresult[1] = parseInt(resetresult[1]) < 10 ? "0" + parseInt(resetresult[1]) : resetresult[1];
        _param_absence.RESET_DATE = resetresult[0] + "/" + resetresult[1];

        if ($scope.Absenceform.$valid && count == 0) {
            resetresult[1] = resetresult[1] - 1;
            //let NEXT_RESET_DATE = new Date(new Date().getFullYear(), resetresult[1], resetresult[0]);
            let NEXT_RESET_DATE = new Date(getNextResetDate(resetresult));
            var AbsenceObject = new Object();
            AbsenceObject.CUSTOMER_ID = $scope.AbsenceSearch.CUSTOMER_ID;
            AbsenceObject.ENTITY_ID = $scope.AbsenceSearch.ENTITY_ID;
            AbsenceObject.ACTIVE = _delete_flag == true ? 0 : 1;
            AbsenceObject.USER_ID = $scope.AbsenceSearch.USER_ID;
            AbsenceObject.HOLIDAY_ENTITLEMENT_ID = _param_absence.HOLIDAY_ENTITLEMENT_ID;
            AbsenceObject.ENTITLEMENT_NAME = _param_absence.ENTITLEMENT_NAME;
            AbsenceObject.INITIAL_VALUE = _param_absence.INITIAL_VALUE;
            AbsenceObject.UNITS_ID = _param_absence.UNITS_ID;
            AbsenceObject.FULL_TIME_VALUE = _param_absence.FULL_TIME_VALUE;
            AbsenceObject.ABSENCE_TYPE_ID = _param_absence.ABSENCE_TYPE_ID;
            AbsenceObject.RESET_DATE = _param_absence.RESET_DATE;
            AbsenceObject.ROUND_UP_DOWN = _param_absence.ROUND_UP_DOWN_ID;
            AbsenceObject.LEAVE_PAID = ((_param_absence.LEAVE_PAID == true || _param_absence.LEAVE_PAID == 'true') && _param_absence.LEAVE_PAID != 'false') ? 1 : 0;
            AbsenceObject.RENEW_AUTO = _param_absence.RENEW_AUTO ? 1 : 0;
            AbsenceObject.APPLY_AUTO = _param_absence.APPLY_AUTO ? 1 : 0;
            AbsenceObject.ALLOW_NGTV_BAL = _param_absence.ALLOW_NGTV_BAL ? 1 : 0;
            AbsenceObject.USE_52_WEEK_AVG = _param_absence.USE_52_WEEK_AVG ? 1 : 0;
            AbsenceObject.ACCURAL_METHOD = _param_absence.ACCURAL_METHOD;
            AbsenceObject.LEAVE_ACCURAL_RATE = null;
            AbsenceObject.ACCURE_ON_OVERTIME_HOURS = null;
            AbsenceObject.PERCENTAGE_OF_ENTITLEMENT = null;
            AbsenceObject.RELEASE_PERIOD = null;
            if (_param_absence.ACCURAL_METHOD == 2) {
                AbsenceObject.LEAVE_ACCURAL_RATE = _param_absence.LEAVE_ACCURAL_RATE;
                AbsenceObject.ACCURE_ON_OVERTIME_HOURS = _param_absence.ACCURE_ON_OVERTIME_HOURS ? 1 : 0;
            }
            else if (_param_absence.ACCURAL_METHOD == 3) {
                AbsenceObject.RELEASE_PERIOD = _param_absence.RELEASE_PERIOD;
                AbsenceObject.PERCENTAGE_OF_ENTITLEMENT = _param_absence.PERCENTAGE_OF_ENTITLEMENT;
            }
            else if (_param_absence.ACCURAL_METHOD == 4) {
                AbsenceObject.RELEASE_PERIOD = _param_absence.RELEASE_PERIOD;
                AbsenceObject.PERCENTAGE_OF_ENTITLEMENT = _param_absence.PERCENTAGE_OF_ENTITLEMENT;
            }
            if (_param_absence.ACCURAL_METHOD == 3 || _param_absence.ACCURAL_METHOD == 4) {
                AbsenceObject.STARTING_ON = _param_absence.STARTING_ON;
                AbsenceObject.STARTING_ON_DATE = _param_absence.STARTING_ON_DATE;
            }
            AbsenceObject.PRO_RATE_LEAVE = _param_absence.PRO_RATE_LEAVE ? 1 : 0;
            AbsenceObject.CALCULATION_TYPE_ID = _param_absence.CALCULATION_TYPE_ID;
            AbsenceObject.NEXT_RESET_DATE = new Date(NEXT_RESET_DATE).toDateString();
            AbsenceObject.ROLLOVER_LEAVE_BALANCE = _param_absence.ROLLOVER_LEAVE_BALANCE ? 0 : 1; //--0 FOR RESET AND 1 FOR ROLLOVER
            AbsenceObject.ROLLOVER_BALANCE = -1;
            if (_param_absence.ROLLOVER_FULL_BALANCE) {  ///--   (-1 FOR FULL ELSE NUMBER)
                AbsenceObject.ROLLOVER_BALANCE = _param_absence.ADD_THE_BALANCE;
            }
            AbsenceObject.HRM_HOLIDAY_ENTITLEMENTS_DEPARTMENTS = [];
            AbsenceObject.HRM_HOLIDAY_ENTITLEMENTS_POSITIONS = [];
            AbsenceObject.HRM_HOLIDAY_ENTITLEMENTS_EMPLOYEES = [];

            let blankObject = new Object();
            blankObject.TABLE_ID = 0;
            if ($scope.ADD_DEPARTMENTS_LIST.length > 0) {
                angular.forEach($scope.ADD_DEPARTMENTS_LIST, function (_loop_value) {
                    var _depType = new Object()
                    _depType.TABLE_ID = _loop_value.DEPARTMENT_ID;
                    AbsenceObject.HRM_HOLIDAY_ENTITLEMENTS_DEPARTMENTS.push(_depType);
                });
            }
            if ($scope.ADD_POSITIONS_LIST.length > 0) {
                angular.forEach($scope.ADD_POSITIONS_LIST, function (_loop_value) {
                    var _posType = new Object()
                    _posType.TABLE_ID = _loop_value.POSITION_ID;
                    AbsenceObject.HRM_HOLIDAY_ENTITLEMENTS_POSITIONS.push(_posType);
                });
            }
            if ($scope.ADD_EMPLOYEES_LIST.length > 0) {
                angular.forEach($scope.ADD_EMPLOYEES_LIST, function (_loop_value) {
                    var _empType = new Object()
                    _empType.TABLE_ID = _loop_value.EMPLY_PRSNL_ID;
                    AbsenceObject.HRM_HOLIDAY_ENTITLEMENTS_EMPLOYEES.push(_empType);
                });
            }

            if (AbsenceObject.HRM_HOLIDAY_ENTITLEMENTS_DEPARTMENTS.length == 0) {
                AbsenceObject.HRM_HOLIDAY_ENTITLEMENTS_DEPARTMENTS.push(blankObject);
            }
            if (AbsenceObject.HRM_HOLIDAY_ENTITLEMENTS_POSITIONS.length == 0) {
                AbsenceObject.HRM_HOLIDAY_ENTITLEMENTS_POSITIONS.push(blankObject);
            }
            if (AbsenceObject.HRM_HOLIDAY_ENTITLEMENTS_EMPLOYEES.length == 0) {
                AbsenceObject.HRM_HOLIDAY_ENTITLEMENTS_EMPLOYEES.push(blankObject);
            }

            PrcCommMethods.HUMANRESOURCE_API(AbsenceObject, 'HRM_INS_UPD_HOLIDAY_ENTITLEMENTS').then(function (data) {
                if (data.data > 0) {
                    if (AbsenceObject.HOLIDAY_ENTITLEMENT_ID == 0 || AbsenceObject.HOLIDAY_ENTITLEMENT_ID == undefined) {
                        $scope.$parent.ShowAlertBox("Success", 'Holiday Entitlement added successfully', 3000);
                    }
                    else if (AbsenceObject.HOLIDAY_ENTITLEMENT_ID > 0) {
                        $scope.$parent.ShowAlertBox("Success", 'Holiday Entitlement updated successfully', 3000);
                    }

                    $scope.ADD_DEPARTMENTS_LIST = [];
                    $scope.ADD_POSITIONS_LIST = [];
                    $scope.ADD_EMPLOYEES_LIST = [];

                    $scope.DEPARTMENTS_LIST = $scope.DEPARTMENTS_MASTER_LIST;
                    $scope.POSITIONS_LIST = $scope.POSITIONS_MASTER_LIST;
                    $scope.EMPLOYEES_LIST = $scope.EMPLOYEES_MASTER_LIST;

                    $scope.AbsenceSearch = angular.copy(BlankPageObject);
                    $scope.SELECTED_UNIT_Fn($scope.UNITS_LIST[0]);
                    $scope.SELECTED_CALCULATION_TYPE_Fn('');
                    $scope.SELECTED_ROUND_Fn('');
                    $scope.SELECTED_RELEASE_PERIOD_Fn($scope.RELEASE_PERIOD_LIST[1]);
                    $scope.HRM_GET_HOLIDAY_ENTITLEMENTS(1);
                }
                else if (data.data < 0) {
                    $scope.$parent.ShowAlertBox("Attention", 'Already Added', 3000);
                }
                if (data.data == 0) {
                    $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                }
                $scope.Absenceform.submitted = false;
                angular.forEach($scope.ADD_DEPARTMENTS_LIST, function (_loop_value) {
                    $scope.DEPARTMENTS_LIST.push(_loop_value);
                });
                angular.forEach($scope.ADD_POSITIONS_LIST, function (_loop_value) {
                    $scope.POSITIONS_LIST.push(_loop_value);
                });
                angular.forEach($scope.ADD_EMPLOYEES_LIST, function (_loop_value) {
                    $scope.EMPLOYEES_LIST.push(_loop_value);
                });

            });

        }
        if (count == 1) {
            $scope.$parent.ShowAlertBox("Error", 'Please provide a given format (dd/mm)', 3000);
        }
    };
    $scope.HRM_DELETE_HOLIDAY_ENTITLEMENTS = function (_param_absence, _delete_flag = true) {
        let count = 0;
        var resetresult = _param_absence.RESET_DATE.split('/');
        if (resetresult.length < 2 || resetresult.length > 2) {
            count = 1;
        }
        else {
            if (resetresult[0] > 31 || resetresult[1] > 12) {

                count = 1;
            }
        }
        resetresult[1] = resetresult[1] - 1;
        let NEXT_RESET_DATE = new Date(new Date().getFullYear(), resetresult[1], resetresult[0]);
        var AbsenceObject = new Object();
        AbsenceObject.CUSTOMER_ID = $scope.AbsenceSearch.CUSTOMER_ID;
        AbsenceObject.ENTITY_ID = $scope.AbsenceSearch.ENTITY_ID;
        AbsenceObject.ACTIVE = _delete_flag == true ? 0 : 1;
        AbsenceObject.USER_ID = $scope.AbsenceSearch.USER_ID;
        AbsenceObject.HOLIDAY_ENTITLEMENT_ID = _param_absence.HOLIDAY_ENTITLEMENT_ID;
        AbsenceObject.ENTITLEMENT_NAME = _param_absence.ENTITLEMENT_NAME;
        AbsenceObject.INITIAL_VALUE = _param_absence.INITIAL_VALUE;
        AbsenceObject.UNITS_ID = _param_absence.UNITS_ID;
        AbsenceObject.FULL_TIME_VALUE = _param_absence.FULL_TIME_VALUE;
        AbsenceObject.ABSENCE_TYPE_ID = _param_absence.ABSENCE_TYPE_ID;
        AbsenceObject.RESET_DATE = _param_absence.RESET_DATE;
        AbsenceObject.ROUND_UP_DOWN = _param_absence.ROUND_UP_DOWN_ID;
        AbsenceObject.LEAVE_PAID = _param_absence.LEAVE_PAID ? 1 : 0;
        AbsenceObject.RENEW_AUTO = _param_absence.RENEW_AUTO ? 1 : 0;
        AbsenceObject.APPLY_AUTO = _param_absence.APPLY_AUTO ? 1 : 0;
        AbsenceObject.ALLOW_NGTV_BAL = _param_absence.ALLOW_NGTV_BAL ? 1 : 0;
        AbsenceObject.USE_52_WEEK_AVG = _param_absence.USE_52_WEEK_AVG ? 1 : 0;
        AbsenceObject.ACCURAL_METHOD = _param_absence.ACCURAL_METHOD;
        AbsenceObject.LEAVE_ACCURAL_RATE = _param_absence.LEAVE_ACCURAL_RATE;
        AbsenceObject.ACCURE_ON_OVERTIME_HOURS = _param_absence.ACCURE_ON_OVERTIME_HOURS ? 1 : 0;
        AbsenceObject.PERCENTAGE_OF_ENTITLEMENT = _param_absence.PERCENTAGE_OF_ENTITLEMENT;
        AbsenceObject.RELEASE_PERIOD = _param_absence.RELEASE_PERIOD;
        AbsenceObject.STARTING_ON = _param_absence.STARTING_ON;
        AbsenceObject.STARTING_ON_DATE = _param_absence.STARTING_ON_DATE;
        AbsenceObject.PRO_RATE_LEAVE = _param_absence.PRO_RATE_LEAVE ? 1 : 0;
        AbsenceObject.CALCULATION_TYPE_ID = _param_absence.CALCULATION_TYPE_ID;
        AbsenceObject.NEXT_RESET_DATE = new Date(NEXT_RESET_DATE).toDateString();
        AbsenceObject.HRM_HOLIDAY_ENTITLEMENTS_DEPARTMENTS = [];
        AbsenceObject.HRM_HOLIDAY_ENTITLEMENTS_POSITIONS = [];
        AbsenceObject.HRM_HOLIDAY_ENTITLEMENTS_EMPLOYEES = [];

        let blankObject = new Object();
        blankObject.TABLE_ID = 0;
        if ($scope.ADD_DEPARTMENTS_LIST.length > 0) {
            angular.forEach($scope.ADD_DEPARTMENTS_LIST, function (_loop_value) {
                var _depType = new Object()
                _depType.TABLE_ID = _loop_value.DEPARTMENT_ID;
                AbsenceObject.HRM_HOLIDAY_ENTITLEMENTS_DEPARTMENTS.push(_depType);
            });
        }
        if ($scope.ADD_POSITIONS_LIST.length > 0) {
            angular.forEach($scope.ADD_POSITIONS_LIST, function (_loop_value) {
                var _posType = new Object()
                _posType.TABLE_ID = _loop_value.POSITION_ID;
                AbsenceObject.HRM_HOLIDAY_ENTITLEMENTS_POSITIONS.push(_posType);
            });
        }
        if ($scope.ADD_EMPLOYEES_LIST.length > 0) {
            angular.forEach($scope.ADD_EMPLOYEES_LIST, function (_loop_value) {
                var _empType = new Object()
                _empType.TABLE_ID = _loop_value.EMPLY_PRSNL_ID;
                AbsenceObject.HRM_HOLIDAY_ENTITLEMENTS_EMPLOYEES.push(_empType);
            });
        }

        if (AbsenceObject.HRM_HOLIDAY_ENTITLEMENTS_DEPARTMENTS.length == 0) {
            AbsenceObject.HRM_HOLIDAY_ENTITLEMENTS_DEPARTMENTS.push(blankObject);
        }
        if (AbsenceObject.HRM_HOLIDAY_ENTITLEMENTS_POSITIONS.length == 0) {
            AbsenceObject.HRM_HOLIDAY_ENTITLEMENTS_POSITIONS.push(blankObject);
        }
        if (AbsenceObject.HRM_HOLIDAY_ENTITLEMENTS_EMPLOYEES.length == 0) {
            AbsenceObject.HRM_HOLIDAY_ENTITLEMENTS_EMPLOYEES.push(blankObject);
        }

        PrcCommMethods.HUMANRESOURCE_API(AbsenceObject, 'HRM_INS_UPD_HOLIDAY_ENTITLEMENTS').then(function (data) {
            if (data.data > 0) {
                if (AbsenceObject.HOLIDAY_ENTITLEMENT_ID > 0 && _delete_flag) {
                    $scope.$parent.ShowAlertBox("Success", 'Holiday Entitlement deleted successfully', 3000);
                }
                $scope.HOLIDAY_ENTITLEMENTS_LIST = [];
                $scope.HRM_GET_HOLIDAY_ENTITLEMENTS(1);
            }
            else if (data.data == 0) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
        });
    };

    $scope.ABSENCE_TYPE_RESET_Fn = function () {
        $scope.AbsenceSettingSearch.ABSENCE_TYPE_ID = "";
        $scope.AbsenceSettingSearch.ABSENCE_TYPE = "";
        $scope.AbsenceSettingSearch.APPLY_BY_EMPLOYEE = false;
        $scope.AbsenceSettingSearch.APPLY_BY_MANAGER = false;
        $scope.AbsenceSettingSearch.ASSIGNMENT_REQUIRED = false;



        $scope.ABSENCE_FORM.submitted = false;
    }
    $scope.RESET_Fn = function () {
        $scope.AbsenceSearch = angular.copy(BlankPageObject);
        $scope.SELECTED_UNIT_Fn($scope.UNITS_LIST[0]);
        $scope.ADD_DEPARTMENTS_LIST = [];
        $scope.ADD_POSITIONS_LIST = [];
        $scope.ADD_EMPLOYEES_LIST = [];
        $scope.DEPARTMENTS_LIST = $scope.DEPARTMENTS_MASTER_LIST;
        $scope.POSITIONS_LIST = $scope.POSITIONS_MASTER_LIST;
        $scope.EMPLOYEES_LIST = $scope.EMPLOYEES_MASTER_LIST;
        $scope.COUNT_HOLIDAY_VAL = 0;
        $scope.SELECTED_UNIT_Fn($scope.UNITS_LIST[0]);
        $scope.SELECTED_CALCULATION_TYPE_Fn('');
        $scope.SELECTED_ROUND_Fn('');
        $scope.SELECTED_RELEASE_PERIOD_Fn($scope.RELEASE_PERIOD_LIST[1]);
        $scope.HOLIDAY_ENTITLEMENTS_LIST = [];
        $scope.HRM_GET_HOLIDAY_ENTITLEMENTS();
        $scope.AbsenceSearch.HOLIDAY_ENTITLEMENT_ID = 0;



    };
    $scope.validateDate = function (dateString) {
        if (dateString.length < 3) {
            $scope.AbsenceSearch.RESET_DATE = '';
            return false;
        } else {
            const dateParts = dateString.split('/');
            if (dateParts[0] == "" || dateParts[1] == "") {
                $scope.AbsenceSearch.RESET_DATE = '';
                return false;
            }
            if (dateParts[0].length > 2 || dateParts[1].length > 2) {
                $scope.$parent.ShowAlertBox("Warning", "Please enter valid day and month", 3000);
                $scope.AbsenceSearch.RESET_DATE = '';
                return false;
            }
            if (dateParts.length !== 2) {
                $scope.$parent.ShowAlertBox("Warning", "Please enter valid day and month", 3000);
                $scope.AbsenceSearch.RESET_DATE = '';
                return false;
            }
            const day = parseInt(dateParts[0], 10);
            const month = parseInt(dateParts[1], 10);
            if (dateParts[0].length == 2 && day == 0) {
                $scope.$parent.ShowAlertBox("Warning", "Please enter valid day and month", 3000);
                $scope.AbsenceSearch.RESET_DATE = '';
                return false;
            }
            if (month == 0 && dateParts[1].length == 1) {
                $scope.$parent.ShowAlertBox("Warning", "Please enter valid day and month", 3000);
                $scope.AbsenceSearch.RESET_DATE = '';
                return false;
            }
            else if (month < 1 || month > 12) {
                $scope.$parent.ShowAlertBox("Warning", "Please enter valid day and month", 3000);
                $scope.AbsenceSearch.RESET_DATE = '';
                return false;
            }
            const currentYear = new Date().getFullYear();
            const daysInMonth = new Date(currentYear, month, 0).getDate();
            if (day < 1 || day > daysInMonth) {
                $scope.$parent.ShowAlertBox("Warning", "Please enter valid day and month", 3000);
                $scope.AbsenceSearch.RESET_DATE = '';
                return false;
            }
            return true;
        }
    }

    $scope.GET_CUSTOMER_SETTINGS($scope.AbsenceSettingSearch, '74,75,76,77,78,89');
    $scope.DateInputLoaddmm();
    $scope.$parent.$parent.DateInputLoad();
});