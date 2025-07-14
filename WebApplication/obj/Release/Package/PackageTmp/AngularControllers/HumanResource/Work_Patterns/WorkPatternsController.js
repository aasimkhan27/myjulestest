app.controller('WorkPatternsController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    //$scope.$parent.DISPLAY_FLAG = true;
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(1);
    $scope.HR_COMMON_CODE_Fn();
    $scope.$parent.$parent.overlay_loading_HR_Loader = 'none';
    $scope.DD_DefaultText = $scope.$parent.DD_DEFAULT_TEXT;


    $scope.WorkPatternsSearch = {
        CUSTOMER_ID: $cookies.get("CUSTOMER_ID"),
        MODULE_ID: parseInt($cookies.get("MODULE_ID")),
        USER_ID: $cookies.get("USERID"),
        ENTITY_ID: null,
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        TOTAL: 0,
        MON: null,
        TUE: null,
        WED: null,
        THU: null,
        FRI: null,
        SAT: null,
        SUN: null,
        TOTAL_HOURS: null,
        WORK_PATTERN_ID: 0,
        CUSTOM_RATE_RULE_NAME: $scope.$parent.DD_DEFAULT_TEXT,
        DD_DEFAULT_TEXT: $scope.$parent.DD_DEFAULT_TEXT,
    };

    $scope.PRO_RATE_RULE_LIST = [{ PRO_RATE_RULE_ID: 1, RATE_RULE_NAME: '260 Rule' },
    { PRO_RATE_RULE_ID: 2, RATE_RULE_NAME: '365 Rule' }, { PRO_RATE_RULE_ID: 3, RATE_RULE_NAME: 'Working Day Rule' }];

    const BlankPageObject = {
        CUSTOMER_ID: $cookies.get("CUSTOMER_ID"),
        MODULE_ID: parseInt($cookies.get("MODULE_ID")),
        USER_ID: $cookies.get("USERID"),
        ENTITY_ID: null,
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        TOTAL: 0,
        MON: null,
        TUE: null,
        WED: null,
        THU: null,
        FRI: null,
        SAT: null,
        SUN: null,
        TOTAL_HOURS: null,
        WORK_PATTERN_ID: 0,
        WORK_PATTERN_ID: 0,
    };
    $scope.SELECTED_WORKPATTERN = {};
    $scope.WORK_PATTERNS_LIST = [];
    $scope.FILTER_WEEK_DAYS_Fn = function (index) {
        var weekDays = [
            { day: "SUN", value: 0, fullName: "Sunday" },
            { day: "MON", value: 1, fullName: "Monday" },
            { day: "TUE", value: 2, fullName: "Tuesday" },
            { day: "WED", value: 3, fullName: "Wednesday" },
            { day: "THU", value: 4, fullName: "Thursday" },
            { day: "FRI", value: 5, fullName: "Friday" },
            { day: "SAT", value: 6, fullName: "Saturday" }
        ];
        const startIndex = weekDays.findIndex(function (item) {
            return item.value === parseInt(index);
        });

        $scope.daysOfWeek = [
            ...weekDays.slice(startIndex).map(function (item) {
                return item;
            }),
            ...weekDays.slice(0, startIndex).map(function (item) {
                return item;
            })
        ];

    };



    $scope.HRM_GET_WORK_PATTERN_TYPES = function () {
        var WorkPatternObject = new Object();
        PrcCommMethods.HUMANRESOURCE_API(WorkPatternObject, 'HRM_GET_WORK_PATTERN_TYPES').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.WORK_PATTERN_TYPES = data.data.Table;
                $scope.SELECTED_WORK_PATTERN_TYPE_Fn($scope.WORK_PATTERN_TYPES[0]);
            }
            else if (data.data == 0) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
        });
    }
    $scope.SET_HOURS_PER_DAY = function (_day, index, _dayValue) {
        if (_day > 24) {
            $scope.$parent.ShowAlertBox("Attention", 'Day of hours is not greater the 24.', 3000);
            if (_dayValue.day == "MON")
                $scope.WorkPatternsSearch.MON = null;
            if (_dayValue.day == "TUE")
                $scope.WorkPatternsSearch.TUE = null;
            if (_dayValue.day == "WED")
                $scope.WorkPatternsSearch.WED = null;
            if (_dayValue.day == "THU")
                $scope.WorkPatternsSearch.THU = null;
            if (_dayValue.day == "FRI")
                $scope.WorkPatternsSearch.FRI = null;
            if (_dayValue.day == "SAT")
                $scope.WorkPatternsSearch.SAT = null;
            if (_dayValue.day == "SUN")
                $scope.WorkPatternsSearch.SUN = null;
            //angular.forEach($scope.daysOfWeek, function (_param, $index) {
            //    if (ind == index) {
            //    }
            //})
            _day = null;
        }
    }

    //$scope.GET_CUSTOMER_SETTINGS = function () {
    //    var WorkPatternObject = new Object();
    //    WorkPatternObject.CUSTOMER_ID = $scope.WorkPatternsSearch.CUSTOMER_ID;
    //    WorkPatternObject.MODULE_ID = $scope.WorkPatternsSearch.MODULE_ID;
    //    WorkPatternObject.TABLE_ID_LIST = [];
    //    var readonly = new Object();
    //    readonly.TABLE_ID = 47;
    //    WorkPatternObject.TABLE_ID_LIST.push(readonly);
    //    PrcCommMethods.HUMANRESOURCE_API(WorkPatternObject, 'GET_CUSTOMER_SETTINGS').then(function (data) {
    //        if (data.data.Table.length > 0) {
    //            $scope.CUSTOMER_SETTINGS = data.data.Table;
    //            $scope.FILTER_WEEK_DAYS_Fn($scope.CUSTOMER_SETTINGS[0].SETTING_VALUE);
    //        }
    //        else if (data.data == 0) {
    //            $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
    //        }
    //    });
    //}

    $scope.START_DAY_OF_WEEK = $scope.$parent.MASTER_GET_CUSTOMER_SETTINGS_VALUES(47);
    if ($scope.START_DAY_OF_WEEK != -9999) {
        $scope.FILTER_WEEK_DAYS_Fn($scope.START_DAY_OF_WEEK);
    } else {
        $scope.FILTER_WEEK_DAYS_Fn(0);
    }
    //$scope.CHECK_LIMIT_DAYS_Fn = function () {
    //    if ($scope.WorkPatternsSearch.CONTRACTUAL_NUMBER_OF_DAYS > 7) {
    //        $scope.$parent.ShowAlertBox("Attention", 'Contractual number of days cannot exceed 7.', 3000);
    //        $scope.WorkPatternsSearch.CONTRACTUAL_NUMBER_OF_DAYS = null;
    //    }
    //}
    $scope.CHECK_LIMIT = function (_day, index, _dayValue) {
        if (_day > 10) {
            $scope.$parent.ShowAlertBox("Attention", 'Shift count cannot exceed 10.', 3000);
            if (_dayValue.day == "MON")
                $scope.WorkPatternsSearch.MON = null;
            if (_dayValue.day == "TUE")
                $scope.WorkPatternsSearch.TUE = null;
            if (_dayValue.day == "WED")
                $scope.WorkPatternsSearch.WED = null;
            if (_dayValue.day == "THU")
                $scope.WorkPatternsSearch.THU = null;
            if (_dayValue.day == "FRI")
                $scope.WorkPatternsSearch.FRI = null;
            if (_dayValue.day == "SAT")
                $scope.WorkPatternsSearch.SAT = null;
            if (_dayValue.day == "SUN")
                $scope.WorkPatternsSearch.SUN = null;
            //angular.forEach($scope.daysOfWeek, function (_param, $index) {
            //    if (ind == index) {
            //    }
            //})
            _day = null;
        }
    }
    $scope.LAZY_LOAD_HRM_GET_WORK_PATTERNS = function () {
        $scope.HRM_GET_WORK_PATTERNS();
    }

    $scope.HRM_GET_WORK_PATTERNS = function (FLAG) {
        $scope.$parent.overlay_loadingNew = 'block';
        if (FLAG == 1) {
            $scope.WorkPatternsSearch.PAGE_NO = 1;
            $scope.WORK_PATTERNS_LIST = [];
        }
        var WorkPatternObject = new Object();
        WorkPatternObject.CUSTOMER_ID = $scope.WorkPatternsSearch.CUSTOMER_ID;
        WorkPatternObject.ENTITY_ID = $scope.WorkPatternsSearch.ENTITY_ID;
        WorkPatternObject.PAGE_NO = $scope.WorkPatternsSearch.PAGE_NO;
        WorkPatternObject.PAGE_SIZE = $scope.WorkPatternsSearch.PAGE_SIZE;
        PrcCommMethods.HUMANRESOURCE_API(WorkPatternObject, 'HRM_GET_WORK_PATTERNS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.$parent.overlay_loadingNew = 'none';
                $scope.WORK_PATTERNS_LIST = $scope.WORK_PATTERNS_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.WorkPatternsSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.WorkPatternsSearch.PAGE_NO = parseInt($scope.WorkPatternsSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else {
                if ($scope.WORK_PATTERNS_LIST.length == 0) { }
                $scope.GetData = false;
                $scope.$parent.overlay_loadingNew = 'none';
            }
        });
    }

    $scope.HRM_GET_HOLIDAY_CALENDARS = function () {
        $scope.$parent.$parent.overlay_loading_HR_Loader = 'block';
        var WorkPatternObject = new Object();
        WorkPatternObject.CUSTOMER_ID = $scope.WorkPatternsSearch.CUSTOMER_ID;
        WorkPatternObject.ENTITY_ID = $scope.WorkPatternsSearch.ENTITY_ID;
        PrcCommMethods.HUMANRESOURCE_API(WorkPatternObject, 'HRM_GET_HOLIDAY_CALENDARS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.HOLIDAY_CALENDARS_LIST = data.data.Table;
                $scope.SELECTED_CALENDAR_Fn($scope.HOLIDAY_CALENDARS_LIST[0]);
            }
            else if (data.data == 0) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
        });
        $scope.$parent.$parent.overlay_loading_HR_Loader = 'block';
    }


    $scope.HRM_INS_UPD_WORK_PATTERNS = function (_param_work_pattern, admin_flag, employment_info_flag, employment_info_detail) {
        $scope.WorkPatternsform.submitted = true;
        if ($scope.WorkPatternsform.$valid) {
            var WorkPatternObject = new Object();
            WorkPatternObject.WORK_PATTERN_ID = _param_work_pattern.WORK_PATTERN_ID;
            WorkPatternObject.WORK_PATTERN_TYPE_ID = _param_work_pattern.WORK_PATTERN_TYPE_ID;
            WorkPatternObject.CUSTOMER_ID = _param_work_pattern.CUSTOMER_ID;
            WorkPatternObject.ENTITY_ID = employment_info_flag == 1 ? employment_info_detail.ENTITY_ID : _param_work_pattern.ENTITY_ID;
            WorkPatternObject.IS_ADMIN = admin_flag == false ? false : true;
            WorkPatternObject.ACTIVE = 1;
            WorkPatternObject.USER_ID = _param_work_pattern.USER_ID;
            WorkPatternObject.TITLE = _param_work_pattern.TITLE;
            WorkPatternObject.CONTRACTUAL_NUMBER_OF_DAYS_COUNT = [];
            if (_param_work_pattern.WORK_PATTERN_TYPE_ID == 1 || _param_work_pattern.WORK_PATTERN_TYPE_ID == 3) {
                WorkPatternObject.MON = _param_work_pattern.MON;
                if (WorkPatternObject.MON > 0) {
                    WorkPatternObject.CONTRACTUAL_NUMBER_OF_DAYS_COUNT.push(1);
                }

                WorkPatternObject.TUE = _param_work_pattern.TUE;
                if (WorkPatternObject.TUE > 0) {
                    WorkPatternObject.CONTRACTUAL_NUMBER_OF_DAYS_COUNT.push(1);
                }
                WorkPatternObject.WED = _param_work_pattern.WED;
                if (WorkPatternObject.WED > 0) {
                    WorkPatternObject.CONTRACTUAL_NUMBER_OF_DAYS_COUNT.push(1);
                }
                WorkPatternObject.THU = _param_work_pattern.THU;
                if (WorkPatternObject.THU > 0) {
                    WorkPatternObject.CONTRACTUAL_NUMBER_OF_DAYS_COUNT.push(1);
                }
                WorkPatternObject.FRI = _param_work_pattern.FRI;
                if (WorkPatternObject.FRI > 0) {
                    WorkPatternObject.CONTRACTUAL_NUMBER_OF_DAYS_COUNT.push(1);
                }
                WorkPatternObject.SAT = _param_work_pattern.SAT;
                if (WorkPatternObject.SAT > 0) {
                    WorkPatternObject.CONTRACTUAL_NUMBER_OF_DAYS_COUNT.push(1);
                }
                WorkPatternObject.SUN = _param_work_pattern.SUN;
                if (WorkPatternObject.SUN > 0) {
                    WorkPatternObject.CONTRACTUAL_NUMBER_OF_DAYS_COUNT.push(1);
                }
            }
            else if (_param_work_pattern.WORK_PATTERN_TYPE_ID == 2 || _param_work_pattern.WORK_PATTERN_TYPE_ID == 4) {
                WorkPatternObject.MON = _param_work_pattern.MON ? 1 : 0;
                if (WorkPatternObject.MON > 0) {
                    WorkPatternObject.CONTRACTUAL_NUMBER_OF_DAYS_COUNT.push(1);
                }
                WorkPatternObject.TUE = _param_work_pattern.TUE ? 1 : 0;
                if (WorkPatternObject.TUE > 0) {
                    WorkPatternObject.CONTRACTUAL_NUMBER_OF_DAYS_COUNT.push(1);
                }
                WorkPatternObject.WED = _param_work_pattern.WED ? 1 : 0;
                if (WorkPatternObject.WED > 0) {
                    WorkPatternObject.CONTRACTUAL_NUMBER_OF_DAYS_COUNT.push(1);
                }
                WorkPatternObject.THU = _param_work_pattern.THU ? 1 : 0;
                if (WorkPatternObject.THU > 0) {
                    WorkPatternObject.CONTRACTUAL_NUMBER_OF_DAYS_COUNT.push(1);
                }
                WorkPatternObject.FRI = _param_work_pattern.FRI ? 1 : 0;
                if (WorkPatternObject.FRI > 0) {
                    WorkPatternObject.CONTRACTUAL_NUMBER_OF_DAYS_COUNT.push(1);
                }
                WorkPatternObject.SAT = _param_work_pattern.SAT ? 1 : 0;
                if (WorkPatternObject.SAT > 0) {
                    WorkPatternObject.CONTRACTUAL_NUMBER_OF_DAYS_COUNT.push(1);
                }
                WorkPatternObject.SUN = _param_work_pattern.SUN ? 1 : 0;
                if (WorkPatternObject.SUN > 0) {
                    WorkPatternObject.CONTRACTUAL_NUMBER_OF_DAYS_COUNT.push(1);
                }
            }
            WorkPatternObject.TOTAL = _param_work_pattern.WORK_PATTERN_TYPE_ID == 2 ? _param_work_pattern.TOTAL_HOURS : _param_work_pattern.TOTAL;
            WorkPatternObject.HOLIDAY_CALENDAR_ID = _param_work_pattern.HOLIDAY_CALENDAR_ID;
            WorkPatternObject.PRO_RATE_RULE_ID = _param_work_pattern.PRO_RATE_RULE_ID;
            WorkPatternObject.CONTRACTUAL_HOURS_PER_WEEK = $scope.WorkPatternsSearch.WORK_PATTERN_TYPE_ID == 3 ? _param_work_pattern.CONTRACTUAL_HOURS_PER_WEEK : null;

            WorkPatternObject.CONTRACTUAL_NUMBER_OF_DAYS = _param_work_pattern.CONTRACTUAL_NUMBER_OF_DAYS;

            WorkPatternObject.CONTRACTUAL_NUMBER_OF_SHIFTS = $scope.WorkPatternsSearch.WORK_PATTERN_TYPE_ID == 4 ? _param_work_pattern.CONTRACTUAL_NUMBER_OF_SHIFTS : null;

            if (WorkPatternObject.CONTRACTUAL_NUMBER_OF_DAYS_COUNT.length >= _param_work_pattern.CONTRACTUAL_NUMBER_OF_DAYS) {
                PrcCommMethods.HUMANRESOURCE_API(WorkPatternObject, 'HRM_INS_UPD_WORK_PATTERNS').then(function (data) {
                    if (data.data > 0) {
                        if (_param_work_pattern.WORK_PATTERN_ID == 0) {
                            $scope.$parent.ShowAlertBox("Success", 'Work Pattern added successfully', 3000);
                        }
                        else if (_param_work_pattern.WORK_PATTERN_ID > 0) {
                            $scope.$parent.ShowAlertBox("Success", 'Work Pattern updated successfully', 3000);
                        }
                        if (admin_flag == false) {
                            $scope.$parent.EmploymentInfo.CUSTOME_WORK_PATTERN_ID = data.data;
                        }
                        $scope.RESET_Fn();
                        if ($scope.WORK_PATTERN_TYPES.length == 0) {
                            $scope.WorkPatternsSearch.CUSTOM_WORK_PATTERN_TYPE = $scope.DD_DefaultText;
                        } else {
                            $scope.SELECTED_WORK_PATTERN_TYPE_Fn($scope.WORK_PATTERN_TYPES[0]);
                        }
                        if ($scope.HOLIDAY_CALENDARS_LIST.length > 0) {
                            $scope.SELECTED_CALENDAR_Fn($scope.HOLIDAY_CALENDARS_LIST[0]);
                        } else {
                            $scope.WorkPatternsSearch.CUSTOM_CALENDAR_NAME = $scope.DD_DefaultText;;
                        }
                        $scope.WORK_PATTERNS_LIST = [];
                        $scope.HRM_GET_WORK_PATTERNS(1);
                    }
                    else if (data.data < 0) {
                        if (admin_flag == false) {
                            if (data.data == -1) {
                                var work = $scope.WORK_PATTERNS_LIST.find(x => x.TITLE == _param_work_pattern.TITLE);
                                if (work != undefined) {
                                    $scope.$parent.EmploymentInfo.CUSTOME_WORK_PATTERN_ID = work.WORK_PATTERN_ID;
                                }

                            } else if (data.data == -2) {
                                var work = $scope.WORK_PATTERNS_LIST.find(x => x.MON == _param_work_pattern.MON && x.TUE == _param_work_pattern.TUE && x.WED == _param_work_pattern.WED && x.THU == _param_work_pattern.THU && x.FRI == _param_work_pattern.FRI && x.SAT == _param_work_pattern.SAT && x.SUN == _param_work_pattern.SUN && x.TOTAL == _param_work_pattern.TOTAL && x.UNITS == _param_work_pattern.UNITS);
                                if (work != undefined) {
                                    $scope.$parent.EmploymentInfo.CUSTOME_WORK_PATTERN_ID = work.WORK_PATTERN_ID;
                                }
                            }
                        }
                        $scope.$parent.ShowAlertBox("Attention", 'Already Added', 3000);
                    }

                    if (data.data == 0) {
                        $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                    }

                    if (admin_flag == false) {
                        $scope.$parent.CLOSE_EDIT_WORKPATTERN_Fn();
                    }
                    $scope.WorkPatternsform.submitted = false;


                });
            }
            else if (WorkPatternObject.CONTRACTUAL_NUMBER_OF_DAYS_COUNT.length <= _param_work_pattern.CONTRACTUAL_NUMBER_OF_DAYS) {
                $scope.$parent.ShowAlertBox("Error", 'Contractual number of days should not be more then days count.', 3000);
            }
        }
    }
    $scope.POP_DELETE_Fn = function (_workPattern) {
        $scope.SELECTED_WORKPATTERN = _workPattern;
        var CusModelObj = new Object();
        CusModelObj.WORK_PATTERN_ID = _workPattern.WORK_PATTERN_ID;
        CusModelObj.CUSTOMER_ID = $scope.WorkPatternsSearch.CUSTOMER_ID;
        //CusModelObj.ENTITY_ID = $scope.CalendarSearch.ENTITY_ID

        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'GET_EMPLOYEE_COUNT_FOR_WORK_PATTERN').then(function (data) {
            if (data.data.Table.length > 0) {
                var Valid = 0; var Workpattern_Use = ''; $scope.COUNT_VAL = 0;
                angular.forEach(data.data.Table, function (_count) {
                    if (_count.TABLE_NAME != "TOTAL") {
                        if (_count.RECORD_COUNT != 0) {
                            Workpattern_Use = _count.WORK_PATTERN_NAME + "(" + _count.RECORD_COUNT + ")" + ",";
                        }
                    }
                    if (_count.TABLE_NAME == "TOTAL") {
                        if (_count.RECORD_COUNT > 0) {
                            $scope.COUNT_VAL = _count.RECORD_COUNT;
                            //  $scope.$parent.ShowAlertBox("Attention", $scope.SELECTED_WORKPATTERN.TITLE + ' its already used in ' + Workpattern_Use+" so this work pattern not deleted.", 3000);
                            Valid++;
                        }
                    }
                })
                $('#Delete_WorkPattern').modal('show');
                //if (Valid == 0) {
                //    $('#Delete_WorkPattern').modal('show');
                //}

            } else {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
        });

    }

    $scope.DELETE_WORK_PATTERNS_Fn = function (_param_work_pattern) {
        var WorkPatternObject = new Object();
        WorkPatternObject.WORK_PATTERN_ID = _param_work_pattern.WORK_PATTERN_ID;
        WorkPatternObject.CUSTOMER_ID = $scope.WorkPatternsSearch.CUSTOMER_ID;
        WorkPatternObject.ENTITY_ID = $scope.WorkPatternsSearch.ENTITY_ID;
        WorkPatternObject.ACTIVE = 0;
        WorkPatternObject.USER_ID = $scope.WorkPatternsSearch.USER_ID;
        PrcCommMethods.HUMANRESOURCE_API(WorkPatternObject, 'HRM_INS_UPD_WORK_PATTERNS').then(function (data) {
            if (data.data > 0) {
                $scope.$parent.ShowAlertBox("Success", 'Work Pattern deleted successfully', 3000);

                $scope.HRM_GET_WORK_PATTERNS(1);
            }
            if (data.data == 0) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
        });
    }
    //$scope.CALCULATE_SHIFT_DAYS_Fn = function (_totalShifs) {
    //    $scope.WorkPatternsSearch.MON = 1;
    //    $scope.WorkPatternsSearch.TUE = 1;
    //    $scope.WorkPatternsSearch.WED = 1;
    //    $scope.WorkPatternsSearch.THU = 1;
    //    $scope.WorkPatternsSearch.FRI = 1;
    //    $scope.WorkPatternsSearch.SAT = 1;
    //    $scope.WorkPatternsSearch.SUN = 1;
    //};
    $scope.SELECTED_CALENDAR_Fn = function (_param_calendar) {
        $scope.WorkPatternsSearch.CUSTOM_CALENDAR_NAME = _param_calendar.CALENDAR_NAME;
        $scope.WorkPatternsSearch.HOLIDAY_CALENDAR_ID = _param_calendar.HOLIDAY_CALENDAR_ID || 0;
    }

    $scope.SELECTED_WORK_PATTERN_TYPE_Fn = function (_param_work_pattern) {
        $scope.WorkPatternsSearch.CUSTOM_WORK_PATTERN_TYPE = _param_work_pattern.WORK_PATTERN_TYPE;
        $scope.WorkPatternsSearch.WORK_PATTERN_TYPE_ID = _param_work_pattern.WORK_PATTERN_TYPE_ID;


        if (_param_work_pattern.WORK_PATTERN_TYPE_ID == 1 && $scope.WorkPatternsSearch.WORK_PATTERN_ID < 1) {
            $scope.WorkPatternsSearch.MON = null;
            $scope.WorkPatternsSearch.TUE = null;
            $scope.WorkPatternsSearch.WED = null;
            $scope.WorkPatternsSearch.THU = null;
            $scope.WorkPatternsSearch.FRI = null;
            $scope.WorkPatternsSearch.SAT = null;
            $scope.WorkPatternsSearch.SUN = null;
            $scope.WorkPatternsSearch.TOTAL = null;


        }
        else if (_param_work_pattern.WORK_PATTERN_TYPE_ID == 2 && $scope.WorkPatternsSearch.WORK_PATTERN_ID < 1 || _param_work_pattern.WORK_PATTERN_TYPE_ID == 4 && $scope.WorkPatternsSearch.WORK_PATTERN_ID < 1) {
            $scope.WorkPatternsSearch.MON = true;
            $scope.WorkPatternsSearch.TUE = true;
            $scope.WorkPatternsSearch.WED = true;
            $scope.WorkPatternsSearch.THU = true;
            $scope.WorkPatternsSearch.FRI = true;
            $scope.WorkPatternsSearch.SAT = true;
            $scope.WorkPatternsSearch.SUN = true;
            $scope.WorkPatternsSearch.TOTAL_HOURS = null;


        }
        else if (_param_work_pattern.WORK_PATTERN_TYPE_ID == 3 && $scope.WorkPatternsSearch.WORK_PATTERN_ID < 1) {
            $scope.WorkPatternsSearch.MON = 1;
            $scope.WorkPatternsSearch.TUE = 1;
            $scope.WorkPatternsSearch.WED = 1;
            $scope.WorkPatternsSearch.THU = 1;
            $scope.WorkPatternsSearch.FRI = 1;
            $scope.WorkPatternsSearch.SAT = 1;
            $scope.WorkPatternsSearch.SUN = 1;
        }
    }

    $scope.EDIT_WORKPATTERN_Fn = function (_workPattern) {

        $scope.WorkPatternsSearch.WORK_PATTERN_ID = _workPattern.WORK_PATTERN_ID;
        $scope.WorkPatternsSearch.WORK_PATTERN_TYPE_ID = _workPattern.WORK_PATTERN_TYPE_ID;
        $scope.WorkPatternsSearch.WORK_PATTERN_TYPE = _workPattern.WORK_PATTERN_TYPE;
        $scope.WorkPatternsSearch.TITLE = _workPattern.TITLE;
        $scope.WorkPatternsSearch.HOLIDAY_CALENDAR_ID = _workPattern.HOLIDAY_CALENDAR_ID;
        $scope.WorkPatternsSearch.CALENDAR_NAME = _workPattern.CALENDAR_NAME;
        $scope.WorkPatternsSearch.CONTRACTUAL_HOURS_PER_WEEK = _workPattern.CONTRACTUAL_HOURS_PER_WEEK;
        $scope.WorkPatternsSearch.CONTRACTUAL_NUMBER_OF_DAYS = _workPattern.CONTRACTUAL_NUMBER_OF_DAYS;
        $scope.WorkPatternsSearch.CONTRACTUAL_NUMBER_OF_SHIFTS = _workPattern.CONTRACTUAL_NUMBER_OF_SHIFTS;
        $scope.WorkPatternsSearch.PRO_RATE_RULE_ID = _workPattern.PRO_RATE_RULE_ID;
        if (_workPattern.PRO_RATE_RULE_ID > 0) {
            let rate_rule_result = $scope.PRO_RATE_RULE_LIST.find(x => x.PRO_RATE_RULE_ID == _workPattern.PRO_RATE_RULE_ID);
            $scope.SELECTED_RATE_RULE_Fn(rate_rule_result);
        }
        else {
            $scope.SELECTED_RATE_RULE_Fn('');
        }
        $scope.SELECTED_WORK_PATTERN_TYPE_Fn(_workPattern);
        var calendar = $scope.HOLIDAY_CALENDARS_LIST.find(x => x.HOLIDAY_CALENDAR_ID == _workPattern.HOLIDAY_CALENDAR_ID);
        if (calendar != undefined) {
            $scope.SELECTED_CALENDAR_Fn(calendar);
        }
        else {
            $scope.SELECTED_CALENDAR_Fn('');
        }

        if (_workPattern.WORK_PATTERN_TYPE_ID == 1 || _workPattern.WORK_PATTERN_TYPE_ID == 3) {

            $scope.WorkPatternsSearch.MON = _workPattern.MON;
            $scope.WorkPatternsSearch.TUE = _workPattern.TUE;
            $scope.WorkPatternsSearch.WED = _workPattern.WED;
            $scope.WorkPatternsSearch.THU = _workPattern.THU;
            $scope.WorkPatternsSearch.FRI = _workPattern.FRI;
            $scope.WorkPatternsSearch.SAT = _workPattern.SAT;
            $scope.WorkPatternsSearch.SUN = _workPattern.SUN;
            $scope.WorkPatternsSearch.TOTAL = _workPattern.TOTAL;

        }
        else if (_workPattern.WORK_PATTERN_TYPE_ID == 2 || _workPattern.WORK_PATTERN_TYPE_ID == 4) {

            $scope.WorkPatternsSearch.MON = _workPattern.MON == 1 ? true : false;
            $scope.WorkPatternsSearch.TUE = _workPattern.TUE == 1 ? true : false;
            $scope.WorkPatternsSearch.WED = _workPattern.WED == 1 ? true : false;
            $scope.WorkPatternsSearch.THU = _workPattern.THU == 1 ? true : false;
            $scope.WorkPatternsSearch.FRI = _workPattern.FRI == 1 ? true : false;
            $scope.WorkPatternsSearch.SAT = _workPattern.SAT == 1 ? true : false;
            $scope.WorkPatternsSearch.SUN = _workPattern.SUN == 1 ? true : false;
            $scope.WorkPatternsSearch.TOTAL_HOURS = _workPattern.TOTAL;
        }


    }

    $scope.HRM_GET_WORK_PATTERN_TYPES();
    $scope.HRM_GET_HOLIDAY_CALENDARS();
    /*$scope.GET_CUSTOMER_SETTINGS();*/
    $scope.HRM_GET_WORK_PATTERNS(1);

    $scope.CLOSE_EDIT_WORKPATTERN_Fn = function () {
        $scope.$parent.CLOSE_EDIT_WORKPATTERN_Fn();
    };

    $scope.SELECTED_RATE_RULE_Fn = function (_rule) {
        if (_rule == '') {
            $scope.WorkPatternsSearch.CUSTOM_RATE_RULE_NAME = $scope.DD_DefaultText;
            $scope.WorkPatternsSearch.PRO_RATE_RULE_ID = '';
        }
        else {
            $scope.WorkPatternsSearch.CUSTOM_RATE_RULE_NAME = _rule.RATE_RULE_NAME;
            $scope.WorkPatternsSearch.PRO_RATE_RULE_ID = _rule.PRO_RATE_RULE_ID;
        }
    }
    $scope.SELECTED_RATE_RULE_Fn('');

    $scope.RESET_Fn = function () {
        $scope.WorkPatternsSearch = angular.copy(BlankPageObject);
        $scope.SELECTED_WORK_PATTERN_TYPE_Fn($scope.WORK_PATTERN_TYPES[0]);

        if ($scope.HOLIDAY_CALENDARS_LIST.length > 0) {
            $scope.SELECTED_CALENDAR_Fn($scope.HOLIDAY_CALENDARS_LIST[0]);
        } else {
            $scope.WorkPatternsSearch.CUSTOM_CALENDAR_NAME = $scope.DD_DefaultText;
        }
        $scope.SELECTED_RATE_RULE_Fn('');
    };
}); 