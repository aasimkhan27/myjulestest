app.controller('EmpAbsencesController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(2);
    $scope.HR_COMMON_CODE_Fn();
    $(".modal-backdrop").remove();
    $scope.STEP_FLAG = 4;
    $scope.DD_DefaultText = $scope.$parent.DD_DEFAULT_TEXT;
    $scope.$parent.$parent.overlay_loading_HR_Loader = 'none';
    $scope.AbsenceSearch = {
        EMPLY_PRSNL_ID: getUrlParameter('EMP_ID', $location.absUrl()),
        CUSTOMER_ID: $cookies.get("CUSTOMER_ID"),
        MODULE_ID: parseInt($cookies.get("MODULE_ID")),
        USER_ID: $cookies.get("USERID"),
        ENTITY_ID: $cookies.get("ENTITY_ID"),
        PAGE_NO: 0,
        PAGE_SIZE: $scope.$parent.PAGE_SIZE,
        SORT_COLUMN_NO: 1,
        SORT_ORDER_NO: 1,
        EFFECTIVE_DATE: null,
        COMMENTS: '',
        CUSTOM_ENTITLEMENT_NAME: $scope.DD_DefaultText,
        WORK_PATTERN_ID: '',
        WORK_PATTERN_TYPE_ID: '',
        FISICAL_YEAR_ID: 2024,
        YEAR_VALUE: '2024',
        STEP_NO: 4,
    };
    $scope.IS_SELF = false;
    if ($scope.AbsenceSearch.EMPLY_PRSNL_ID == parseInt($cookies.get("EMPLY_PRSNL_ID"))) {
        $scope.IS_SELF = true;

    }
    $scope.fieldChanges = {};
    $scope.WATCH_GROUP_Fn = function (field, DATE_FALG) {
        if (DATE_FALG == 1) {
            $scope.fieldChanges[field] = $scope.WagesSearch[field] !== $scope.OrignalData[field];
        }
        else {
            $scope.fieldChanges[field] = $scope.WagesSearch[field] !== $scope.OrignalData[field];
        }
    };
    $scope.EMPLOYEE_WORK_PATTERN = '';
    $scope.EDIT_STEP_NO = getUrlParameter('STEP_NO', $location.absUrl());
    $scope.EDIT_STEP_NO = $scope.EDIT_STEP_NO == undefined ? 0 : $scope.EDIT_STEP_NO;
    $scope.EDIT_MODE = $scope.EDIT_STEP_NO < 9 ? false : true;
    $scope.MY_PROFILE_FLAG = 0;
    if (parseInt(getUrlParameter('EMP_ID', $location.absUrl())) == parseInt($cookies.get("EMPLY_PRSNL_ID"))) {
        $scope.EDIT_MODE = true;
        $scope.MY_PROFILE_FLAG = 1;
    };
    $scope.FISICAL_YEAR_MONTH = $scope.$parent.MASTER_GET_CUSTOMER_SETTINGS_VALUES(89);
    if ($scope.FISICAL_YEAR_MONTH == 0) {
        $scope.FISICAL_YEAR_MONTH = 4;
    }
    $scope.update_fisical_year = function (data) {
        let date = new Date(data);
        let start_year = date.getFullYear();
        if (date.getMonth() < ($scope.FISICAL_YEAR_MONTH - 1)) {
            start_year = (date.getFullYear() - 1);
        }
        $scope.FISCAL_YEAR_START = new Date(start_year, $scope.FISICAL_YEAR_MONTH - 1, 1);
        $scope.FISCAL_YEAR_END = new Date($scope.FISCAL_YEAR_START);
        $scope.FISCAL_YEAR_END.setMonth($scope.FISCAL_YEAR_END.getMonth() + 12);
        $scope.FISCAL_YEAR_END = new Date($scope.FISCAL_YEAR_END.setDate($scope.FISCAL_YEAR_END.getDate() - 1));
    };

    $scope.HRM_EDIT_DETAILS = function () {
        $scope.EDIT_MODE = false;
    };
    $scope.HRM_LOCK_DATE_LIST = [];
    $scope.EntitlementArray = [];
    $scope.EntitlementArrayDeleted = [];
    $scope.HOLIDAY_ENTITLEMENTS_LIST = [];
    $scope.ABSENCES_LIST = [];
    $scope.WORK_PATTERN = null;
    function isSameDay(date1, date2) {
        const d1 = new Date(date1);
        const d2 = new Date(date2);

        d1.setHours(0, 0, 0, 0);
        d2.setHours(0, 0, 0, 0);

        return d1.getTime() === d2.getTime();
    }
    $scope.generateCalendarForGridMyTeam = function (_leave) {
        _leave.calendarMonths = [];
        if (!_leave.START_DATE || !_leave.END_DATE) return;
        let start = new Date(_leave.START_DATE);
        let end = new Date(_leave.END_DATE);
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);

        // Start from the first day of the first month
        let current = new Date(start.getFullYear(), start.getMonth(), 1);
        var count = 0;
        while (current <= end) {
            _leave.minDate = new Date(start);
            _leave.maxDate = new Date(end);
            var monthStart;
            if (count == 0) {
                monthStart = new Date(start);
            }
            else {
                monthStart = new Date(current.getFullYear(), current.getMonth(), 1);
            }
            count = 1;
            let monthEnd = new Date(current.getFullYear(), current.getMonth() + 1, 0);

            // Align to Monday
            let gridStart = new Date(monthStart);
            let day = gridStart.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
            let offset = (day === 0) ? 6 : day - 1;
            gridStart.setDate(gridStart.getDate() - offset);

            // Always create 6 weeks (6 x 7 = 42 cells)
            let weeks = [];

            for (let w = 0; w < 6; w++) {
                let days = [];
                var weekreadonly = new Object()
                weekreadonly.WEEK_INDEX = w;
                weekreadonly.days = [];
                for (let d = 0; d < 7; d++) {
                    //week.push(new Da  te(gridStart));
                    //gridStart.setDate(gridStart.getDate() + 1);
                    var dayreadOnly = Object();
                    dayreadOnly.DATE_INDEX = d;
                    dayreadOnly.DATE = new Date(gridStart);
                    dayreadOnly.DURATION = 0;
                    dayreadOnly.OLD_DURATION = 0;
                    dayreadOnly.SELECTED_DURATION = false;
                    var _day_duration = _leave.DURATION_LIST.filter(function (x) { return isSameDay(x.LEAVE_DATE, gridStart) })
                    if (_day_duration.length > 0) {
                        dayreadOnly.DURATION = _day_duration[0].DURATION;
                        dayreadOnly.SELECTED_DURATION = _day_duration[0].DURATION > 0 ? true : false;
                        dayreadOnly.OLD_DURATION = angular.copy(dayreadOnly.DURATION);
                        dayreadOnly.OLD_SELECTED_DURATION = angular.copy(_day_duration[0].DURATION > 0 ? true : false);
                        dayreadOnly.ORIGINAL_DURATION = angular.copy(_day_duration[0].ORIGINAL_DURATION);
                    }
                    weekreadonly.days.push(dayreadOnly);
                    gridStart.setDate(gridStart.getDate() + 1);
                }
                weeks.push(weekreadonly);
            }
            _leave.calendarMonths.push({
                monthIndex: monthStart.getMonth(),
                monthName: monthStart.toLocaleString('default', { month: 'long', year: 'numeric' }),
                weeks: weeks
            });
            // Move to next month
            current.setMonth(current.getMonth() + 1);
        }
        console.log($scope.calendarMoncalendarMonthsthsTeam);
    };
    $scope.GET_HRM_LOCK_DATE = function () {
        var UserModelObj = new Object();
        UserModelObj.CUSTOMER_ID = $cookies.get("CUSTOMER_ID");
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'GET_HRM_LOCK_DATE').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.HRM_LOCK_DATE_LIST = data.data.Table;
                $scope.GET_UTC_TIME();
            }
        });
    }
    $scope.GET_UTC_TIME = function () {
        var UserModelObj = new Object();
        UserModelObj.TIMEZONE_OFFSET = "00:00";
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'GET_UTC_TIME').then(function (data) {
            if (data.data != null) {
                $scope.CURRENT_DATE = new Date(data.data);
            }
            if ($scope.CURRENT_DATE == '') {
                $scope.CURRENT_DATE = new Date();
            }
            $scope.AbsenceSearch.FISICAL_YEAR_ID = new Date(data.data).getFullYear();
            $scope.AbsenceSearch.YEAR_VALUE = "" + new Date(data.data).getFullYear();
            $scope.update_fisical_year(data.data);
        });
    };
    $scope.GET_HRM_LOCK_DATE();

    $scope.FISCAL_YEARS_LIST = [];
    $scope.HRM_GET_EMPLOYEE_STEP = function () {
        var UserModelObj = new Object();
        UserModelObj.EMPLY_PRSNL_ID = getUrlParameter('EMP_ID', $location.absUrl());
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'HRM_GET_EMPLOYEE_STEP').then(function (data) {
            if (data.data.Table.length > 0) {
                let RESULT_PERSNL = data.data.Table[0];
                $scope.HeaderPrimaryDetails.FIRST_NAME = RESULT_PERSNL.FIRST_NAME;
                $scope.HeaderPrimaryDetails.MIDDLE_NAME = RESULT_PERSNL.MIDDLE_NAME;
                $scope.HeaderPrimaryDetails.LAST_NAME = RESULT_PERSNL.LAST_NAME;
                $scope.HeaderPrimaryDetails.PRIMARY_REPORTING_MANAGER_ID = RESULT_PERSNL.PRIMARY_REPORTING_MANAGER_ID;
                $scope.HeaderPrimaryDetails.BRANCH_ID = RESULT_PERSNL.BRANCH_ID;

                if (RESULT_PERSNL.STEP_NO == 9) {
                    $scope.HeaderPrimaryDetails.LOCK_DATE = $scope.$parent.CHECK_LOCK_DATE_Fn(RESULT_PERSNL.BRANCH_ID);
                }
                $scope.STEP_NO = RESULT_PERSNL.STEP_NO;
                if (RESULT_PERSNL.EMPLOYEE_STATUS_ID == 5) {
                    $scope.SHOW_EDIT_ACCESS = false;
                    $scope.EDIT_MODE = true;
                }
                else {
                    if ($cookies.get("EMPLY_PRSNL_ID") == 0) {
                        $scope.SHOW_EDIT_ACCESS = true;
                    }
                    else if (RESULT_PERSNL.BRANCH_ID == null) {
                        $scope.SHOW_EDIT_ACCESS = $scope.CheckEmployeeAllBranchAccess('EDIT_EMPLOYEE');
                    }
                    else {
                        $scope.SHOW_EDIT_ACCESS = $scope.CheckEmployeeAccess(parseInt($cookies.get("ENTITY_ID")), RESULT_PERSNL.BRANCH_ID, 'EDIT_EMPLOYEE');
                    }
                    if (RESULT_PERSNL.STEP_NO == 9) {
                        $scope.EDIT_STEP_NO = RESULT_PERSNL.STEP_NO == undefined ? 0 : RESULT_PERSNL.STEP_NO;
                    }
                    else {
                        $scope.EDIT_STEP_NO = RESULT_PERSNL.STEP_NO;
                    }
                    if (parseInt(getUrlParameter('EMP_ID', $location.absUrl())) == parseInt($cookies.get("EMPLY_PRSNL_ID"))) {
                        $scope.EDIT_MODE = true;
                        if ($scope.SHOW_EDIT_ACCESS) {
                            $scope.MY_PROFILE_FLAG = 0;
                        }
                        else {
                            $scope.MY_PROFILE_FLAG = 1;
                        }
                    };
                }
            } else {
                if ($cookies.get("EMPLY_PRSNL_ID") == 0) {
                    $scope.SHOW_EDIT_ACCESS = true;
                } else {
                    $scope.SHOW_EDIT_ACCESS = $scope.CheckEmployeeAllBranchAccess('EDIT_EMPLOYEE');
                }
            }
        })
    }
    $scope.HRM_GET_EMPLOYEE_STEP();
    $scope.HRM_EMPLOYEE_GET_UPCOMING_HISTORY_UPDATES_POPUP = function (_flag) {
        $scope.$parent.POP_EFFECTIVE_TAB_Fn(1);
        $scope.POP_EMPLOYEE_GET_UPCOMING_UPDATES_LIST = [];
        $scope.POP_EMPLOYEE_HISTORY_HEADERS_LIST = [];

        var personaldetailobj = new Object()
        personaldetailobj.EMPLY_PRSNL_ID = $scope.AbsenceSearch.EMPLY_PRSNL_ID;
        personaldetailobj.STEP_NO = 4;
        personaldetailobj.ENTITY_ID = $cookies.get("ENTITY_ID");
        personaldetailobj.EFFECTIVE_DATE = moment($scope.AbsenceSearch.EFFECTIVE_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).format('L');
        PrcCommMethods.HUMANRESOURCE_API(personaldetailobj, 'HRM_EMPLOYEE_GET_UPCOMING_HISTORY_UPDATES_POPUP').then(function (data) {
            if (data.data.Table.length > 0 || data.data.Table1.length > 0) {
                $scope.POP_EMPLOYEE_GET_UPCOMING_UPDATES_LIST = data.data.Table;
                $scope.POP_EMPLOYEE_HISTORY_HEADERS_LIST = data.data.Table1;
                $scope.MODEL_FLAG = "modal-fullscreen";
                if (_flag == undefined) {
                    $('#EffectiveDate').modal('show');
                }
            }
            else {
                $scope.MODEL_FLAG = "";
                if (_flag == undefined) {
                    $('#EffectiveDate').modal('show');
                }
            }
        });
    }
    $scope.HRM_GET_EMPLOYEE_ABSENCES = function (OLD_DATA_FLAG) {
        if (OLD_DATA_FLAG == 1) {
            $scope.ABSENCES_HISTORY_LIST = [];
        } else {
            $scope.EntitlementArray = [];
        }

        var AbsenceObject = new Object();
        AbsenceObject.EMPLY_PRSNL_ID = $scope.AbsenceSearch.EMPLY_PRSNL_ID;
        AbsenceObject.ENTITY_ID = $scope.AbsenceSearch.ENTITY_ID;
        AbsenceObject.FLAG = OLD_DATA_FLAG || 0;
        PrcCommMethods.HUMANRESOURCE_API(AbsenceObject, 'HRM_GET_EMPLOYEE_ABSENCES').then(function (data) {
            $scope.$parent.$parent.DATE_INPUT_LOAD();
            if (data.data != null && data.data.Table.length > 0) {
                $scope.OrignalData = {
                    EntitlementArray: []
                }
                if (OLD_DATA_FLAG == 1) {
                    $scope.ABSENCES_HISTORY_LIST = angular.copy(data.data.Table);
                    $('#entitlement_old_data').modal('show');
                } else {
                    $scope.ABSENCES_LIST = data.data.Table;
                    angular.forEach($scope.ABSENCES_LIST, function (_loop_value) {
                        var _absType = new Object();
                        _absType.HOLIDAY_ENTITLEMENT_PLAN = _loop_value.HOLIDAY_ENTITLEMENT_PLAN;
                        _absType.EMPLOYEE_ABSENCE_ID = _loop_value.EMPLOYEE_ABSENCE_ID;
                        _absType.ABSENCE_TYPE = _loop_value.ABSENCE_TYPE;
                        _absType.ACTUAL_TAKEN = _loop_value.ACTUAL_TAKEN + '' || 0 + '';
                        _absType.HOLIDAY_ENTITLEMENT_ID = _loop_value.HOLIDAY_ENTITLEMENT_ID;
                        _absType.ABSENCE_EFFECTIVE_DATE = _loop_value.ABSENCE_EFFECTIVE_DATE == null ? '' : moment(_loop_value.ABSENCE_EFFECTIVE_DATE).format($scope.$parent.CONVERSION_DATE_FORMAT);
                        _absType.ANNUAL_ALLOWANCE = parseFloat(_loop_value.ANNUAL_ALLOWANCE).toFixed(2);
                        _absType.ACCRUED = parseFloat(_loop_value.CALCULATED_ACCRUED).toFixed(2) + '' || 0 + '';
                        _absType.DB_ACCRUED = angular.copy(parseFloat(_loop_value.ACCRUED).toFixed(2) + '' || 0 + '');
                        _absType.DB_ACCRUED = _loop_value.ACCRUED + '';
                        _absType.ACCRUED = _loop_value.CALCULATED_ACCRUED != undefined && _loop_value.CALCULATED_ACCRUED != null && _loop_value.CALCULATED_ACCRUED != "" ? parseFloat(_loop_value.CALCULATED_ACCRUED).toFixed(2) + '' : 0 + '';
                        _absType.ADJUSTMENT = _loop_value.ADJUSTMENT != undefined && _loop_value.ADJUSTMENT != null && _loop_value.ADJUSTMENT != "" ? parseFloat(_loop_value.ADJUSTMENT).toFixed(2) + '' : 0 + '';
                        _absType.TAKEN = _loop_value.TAKEN != undefined && _loop_value.TAKEN != null && _loop_value.TAKEN != "" ? parseFloat(_loop_value.TAKEN).toFixed(2) + '' : 0 + '';
                        _absType.AVAILABLE_TILL_DATE = _loop_value.AVAILABLE_TILL_DATE != undefined && _loop_value.AVAILABLE_TILL_DATE != null && _loop_value.AVAILABLE_TILL_DATE != "" ? parseFloat(_loop_value.AVAILABLE_TILL_DATE).toFixed(2) : 0 + '';
                        _absType.BOOKED = _loop_value.BOOKED != undefined && _loop_value.BOOKED != null && _loop_value.BOOKED != "" ? parseFloat(_loop_value.BOOKED).toFixed(2) + '' : 0 + '';
                        _absType.BOOKED_PENDING = _loop_value.BOOKED_PENDING != undefined && _loop_value.BOOKED_PENDING != null && _loop_value.BOOKED_PENDING != "" ? parseFloat(_loop_value.BOOKED_PENDING).toFixed(2) + '' : 0 + '';
                        _absType.BOOKED_APPROVED = _loop_value.BOOKED_APPROVED != undefined && _loop_value.BOOKED_APPROVED != null && _loop_value.BOOKED_APPROVED != "" ? parseFloat(_loop_value.BOOKED_APPROVED).toFixed(2) + '' : 0 + '';
                        _absType.REMAINING_ANNUAL_BALANCE = _loop_value.REMAINING_BALANCE != undefined && _loop_value.REMAINING_BALANCE != null && _loop_value.REMAINING_BALANCE != "" ? parseFloat(_loop_value.REMAINING_BALANCE).toFixed(2) + '' : 0 + '';
                        _absType.TOTAL_DAYS_WORKED = _loop_value.TOTAL_DAYS_WORKED + '';
                        _absType.AVG_HOURS_WORKED = _loop_value.AVG_HOURS_WORKED + '';
                        _absType.AVG_PAY = _loop_value.AVG_PAY + '';
                        _absType.ENTITLEMENT_END_DATE = _loop_value.ENTITLEMENT_END_DATE == null ? '' : moment(_loop_value.ENTITLEMENT_END_DATE).format($scope.$parent.CONVERSION_DATE_FORMAT);
                        _absType.DELETE_FLAG = 0;
                        _absType.ENTITLEMENT_DEFAULT_TEXT = $scope.DD_DefaultText;
                        _absType.CUSTOM_ENTITLEMENT_NAME = $scope.DD_DefaultText;
                        _absType.UNITS = $scope.$parent.RETURN_UNITS_DAYS(_loop_value.UNITS_ID);
                        _absType.ABSENCE_TYPE_ID = _loop_value.ABSENCE_TYPE_ID;
                        _absType.OLD_ENTITLEMENT_ACTIVE = moment(moment(_loop_value.ABSENCE_END_DATE), $scope.$parent.CONVERSION_DATE_FORMAT).toDate() < moment(moment(_loop_value.ENTITLEMENT_END_DATE), $scope.$parent.CONVERSION_DATE_FORMAT).toDate() ? 0 : 1;  //  0 for end 1 for active; 
                        _absType.ABSENCE_END_DATE = _loop_value.ABSENCE_END_DATE;
                        _absType.ENTITLEMENT_START_DATE = _loop_value.ENTITLEMENT_START_DATE;
                        _absType.ENTITLEMENT_END_DATE = _loop_value.ENTITLEMENT_END_DATE;
                        _absType.ACTUAL_NEXT_RESET_DATE = angular.copy(_loop_value.NEXT_RESET_DATE);
                        $scope.EntitlementArray.push(_absType);
                    });
                    $scope.AbsenceSearch.EntitlementArray = angular.copy($scope.EntitlementArray);
                    $scope.OrignalData.EntitlementArray = angular.copy($scope.AbsenceSearch);
                }
            } else {
                $scope.OrignalData = {
                    EntitlementArray: []
                }
                $scope.ABSENCES_LIST = [];
                $scope.ADD_ENTITLEMENT_Fn();
            }
            if (data.data.Table1.length > 0) {
                if (OLD_DATA_FLAG == 1) {

                } else {
                    $scope.EMPLOYEE_WORK_PATTERN = data.data.Table1[0];
                }
            }
            if (data.data.Table2.length > 0) {
                if (OLD_DATA_FLAG == 1) {

                } else {
                    $scope.AbsenceSearch.HIRING_DATE = data.data.Table2[0].HIRING_DATE;
                }
                // fiscal year
                /* FISCAL_LIST_Fn(new Date($scope.AbsenceSearch.HIRING_DATE).getFullYear());*/
            }
        });
        $scope.$parent.$parent.DATE_INPUT_LOAD();
    };
    $scope.nginit_entitlement = function (_entitlement) {
        if ((_entitlement.CUSTOM_ENTITLEMENT_NAME == undefined || _entitlement.CUSTOM_ENTITLEMENT_NAME == "" || _entitlement.CUSTOM_ENTITLEMENT_NAME == null) && (_entitlement.HOLIDAY_ENTITLEMENT_ID == '' || _entitlement.HOLIDAY_ENTITLEMENT_ID == undefined || _entitlement.HOLIDAY_ENTITLEMENT_ID == null)) {
            _entitlement.CUSTOM_ENTITLEMENT_NAME = $scope.DD_Default_Text;
        }
        else if (_entitlement.HOLIDAY_ENTITLEMENT_ID != '' && _entitlement.HOLIDAY_ENTITLEMENT_ID != undefined && _entitlement.HOLIDAY_ENTITLEMENT_ID != null) {
            _entitlement.HOLIDAY_ENTITLEMENT_ID = _entitlement.HOLIDAY_ENTITLEMENT_ID;
            _entitlement.CUSTOM_ENTITLEMENT_NAME = _entitlement.HOLIDAY_ENTITLEMENT_PLAN + '-' + _entitlement.ABSENCE_TYPE;
        };
        //if (_entitlement.ABSENCE_EFFECTIVE_DATE != "") {
        //    _entitlement.ABSENCE_EFFECTIVE_DATE = $filter('date')(new Date(_entitlement.ABSENCE_EFFECTIVE_DATE));
        //}
    }

    $scope.nginitteamleave_Fn = function (_leave) {
        _leave.SHORT_NAME = $scope.TextReturn(_leave.EMPLOYEE_NAME);
        var LOCK_DATE = $scope.HRM_LOCK_DATE_LIST.filter(function (x) { return x.BRANCH_ID == _leave.BRANCH_ID })
        if (LOCK_DATE.length > 0 && LOCK_DATE[0].LOCK_DATE != null) {
            _leave.IS_REJECTED = moment(moment(_leave.START_DATE), $scope.$parent.CONVERSION_DATE_FORMAT).toDate() > moment(moment(LOCK_DATE[0].LOCK_DATE), $scope.$parent.CONVERSION_DATE_FORMAT).toDate();
        }
        else {
            _leave.IS_REJECTED = moment(moment(_leave.START_DATE), $scope.$parent.CONVERSION_DATE_FORMAT).toDate() > moment($scope.CURRENT_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate();

        }
        _leave.UNIT_NAME = $scope.$parent.RETURN_UNITS_DAYS(_leave.UNITS_ID);
    }
    $scope.HRM_GET_HOLIDAY_ENTITLEMENTS = function () {
        $scope.$parent.overlay_loadingNew = 'block';

        var AbsenceObject = new Object();
        AbsenceObject.CUSTOMER_ID = $scope.AbsenceSearch.CUSTOMER_ID;
        AbsenceObject.ENTITY_ID = null;
        AbsenceObject.PAGE_NO = $scope.AbsenceSearch.PAGE_NO;
        AbsenceObject.PAGE_SIZE = $scope.AbsenceSearch.PAGE_SIZE;
        AbsenceObject.SORT_COLUMN_NO = $scope.AbsenceSearch.SORT_COLUMN_NO;
        AbsenceObject.SORT_ORDER_NO = $scope.AbsenceSearch.SORT_ORDER_NO;
        PrcCommMethods.HUMANRESOURCE_API(AbsenceObject, 'HRM_GET_HOLIDAY_ENTITLEMENTS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.HOLIDAY_ENTITLEMENTS_LIST = data.data.Table;

            }
            else {
                $scope.HOLIDAY_ENTITLEMENTS_LIST = [];

            }
        });
    };

    $scope.HRM_GET_HOLIDAY_ENTITLEMENTS();
    $scope.HRM_GET_EMPLOYEE_EMPLOYMENT_INFO = function () {
        var EmploymentInfoObject = new Object();
        EmploymentInfoObject.EMPLY_PRSNL_ID = $scope.AbsenceSearch.EMPLY_PRSNL_ID;
        PrcCommMethods.HUMANRESOURCE_API(EmploymentInfoObject, 'HRM_GET_EMPLOYEE_EMPLOYMENT_INFO').then(function (data) {
            if (data.data.Table.length > 0) {
                var result = data.data.Table[0];
                $scope.HIRING_DATE = moment(result.HIRING_DATE);
                // $scope.TERMINATION_DATE = result.TERMINATION_DATE == null ? '' : $filter('date')(new Date(result.TERMINATION_DATE));
            }

        });
    };
    $scope.HRM_GET_EMPLOYEE_EMPLOYMENT_INFO();
    function isDateValid(dateString) {
        //let date = moment(dateString, 'MMM D, YYYY', true);
        let date = moment(dateString, $scope.$parent.CONVERSION_DATE_FORMAT, true);
        return date.isValid();
    }

    $scope.CHECK_EFFECTIVEDATE_BY_HIRINGDATE = function (_absence) {
        // check holiday entitlement should be selected
        if ((_absence.HOLIDAY_ENTITLEMENT_ID == "" || _absence.HOLIDAY_ENTITLEMENT_ID == '' || _absence.HOLIDAY_ENTITLEMENT_ID == undefined) && isDateValid(_absence.ABSENCE_EFFECTIVE_DATE)) {
            $scope.$parent.ShowAlertBox("Attention", "Please select holiday entitlement before effective date!", 3000);
            _absence.ABSENCE_EFFECTIVE_DATE = '';
        }
        else if (_absence.ABSENCE_EFFECTIVE_DATE != null && _absence.ABSENCE_EFFECTIVE_DATE != '' && $scope.HIRING_DATE != null) {
            let selectedHoliday = angular.copy($scope.HOLIDAY_ENTITLEMENTS_LIST.find(x => x.HOLIDAY_ENTITLEMENT_ID == _absence.HOLIDAY_ENTITLEMENT_ID));
            //let startDate = new Date();
            //let endDate = new Date();
            let startDate = moment();
            let endDate = moment();
            // Biggest one 
            //if (new Date($scope.HIRING_DATE) > new Date($scope.FISCAL_YEAR_START)) {
            if (moment($scope.HIRING_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate() > moment($scope.FISCAL_YEAR_START, $scope.$parent.CONVERSION_DATE_FORMAT).toDate()) {
                //check on hiring date
                //if (isDateValid(_absence.ABSENCE_EFFECTIVE_DATE) && new Date(_absence.ABSENCE_EFFECTIVE_DATE) < new Date($scope.HIRING_DATE)) {
                if (isDateValid(_absence.ABSENCE_EFFECTIVE_DATE)
                    && moment(_absence.ABSENCE_EFFECTIVE_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate() >= moment($scope.HIRING_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate()) {

                }
                else if (isDateValid(_absence.ABSENCE_EFFECTIVE_DATE)
                    && moment(_absence.ABSENCE_EFFECTIVE_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate() < moment($scope.HIRING_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate()) {
                    //$scope.$parent.ShowAlertBox("Attention", `Effective date should not be less than Hiring date (${new Date($scope.HIRING_DATE).toDateString()}).`, 3000);
                    $scope.$parent.ShowAlertBox("Attention", `Effective date should not be less than Hiring date (${moment($scope.HIRING_DATE, $scope.$parent.CONVERSION_DATE_FORMAT)}).`, 3000);
                    _absence.ABSENCE_EFFECTIVE_DATE = '';
                }

            } else {
                //if (isDateValid(_absence.ABSENCE_EFFECTIVE_DATE) && new Date(_absence.ABSENCE_EFFECTIVE_DATE) < new Date($scope.FISCAL_YEAR_START)) {
                if (isDateValid(_absence.ABSENCE_EFFECTIVE_DATE)
                    && moment(_absence.ABSENCE_EFFECTIVE_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate() < moment($scope.FISCAL_YEAR_START, $scope.$parent.CONVERSION_DATE_FORMAT).toDate()) {
                    $scope.$parent.ShowAlertBox("Attention", `Effective date should not be less than FISCAL start date (${moment($scope.FISCAL_YEAR_START, $scope.$parent.CONVERSION_DATE_FORMAT)}).`, 3000);
                    _absence.ABSENCE_EFFECTIVE_DATE = '';
                }
            }
            // which one is small
            //if (new Date(selectedHoliday.NEXT_RESET_DATE) > new Date($scope.FISCAL_YEAR_END)) {
            if (moment(moment(selectedHoliday.NEXT_RESET_DATE), $scope.$parent.CONVERSION_DATE_FORMAT).toDate() > moment($scope.FISCAL_YEAR_END, $scope.$parent.CONVERSION_DATE_FORMAT).toDate()) {
                //if (isDateValid(_absence.ABSENCE_EFFECTIVE_DATE) && new Date(_absence.ABSENCE_EFFECTIVE_DATE) >= new Date($scope.FISCAL_YEAR_END)) {
                if (moment($scope.HIRING_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate() > moment($scope.FISCAL_YEAR_START, $scope.$parent.CONVERSION_DATE_FORMAT).toDate() && isDateValid(_absence.ABSENCE_EFFECTIVE_DATE)
                    && moment(_absence.ABSENCE_EFFECTIVE_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate() >= moment($scope.HIRING_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate()) {
                }
                else if (isDateValid(_absence.ABSENCE_EFFECTIVE_DATE) && moment(_absence.ABSENCE_EFFECTIVE_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate() >= moment($scope.FISCAL_YEAR_END, $scope.$parent.CONVERSION_DATE_FORMAT).toDate()) {
                    $scope.$parent.ShowAlertBox("Attention", `Effective date should not be greater than Fiscal year end date (${moment($scope.FISCAL_YEAR_END, $scope.$parent.CONVERSION_DATE_FORMAT)}).`, 3000);
                    _absence.ABSENCE_EFFECTIVE_DATE = '';
                }
                //endDate = new Date($scope.FISCAL_YEAR_END);
                endDate = moment($scope.FISCAL_YEAR_END);
            } else {
                //if (isDateValid(_absence.ABSENCE_EFFECTIVE_DATE) && new Date(_absence.ABSENCE_EFFECTIVE_DATE) > new Date(selectedHoliday.NEXT_RESET_DATE)) {
                if (isDateValid(_absence.ABSENCE_EFFECTIVE_DATE) && moment(_absence.ABSENCE_EFFECTIVE_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate() > moment(moment(selectedHoliday.NEXT_RESET_DATE), $scope.$parent.CONVERSION_DATE_FORMAT).toDate()) {
                    //$scope.$parent.ShowAlertBox("Attention", `Effective date should not be greater than Entitlement end date (${new Date(selectedHoliday.NEXT_RESET_DATE).toDateString()}).`, 3000);
                    $scope.$parent.ShowAlertBox("Attention", `Effective date should not be greater than Entitlement end date (${moment(moment(selectedHoliday.NEXT_RESET_DATE), $scope.$parent.CONVERSION_DATE_FORMAT)}).`, 3000);
                    _absence.ABSENCE_EFFECTIVE_DATE = '';
                }
                //endDate = new Date(selectedHoliday.NEXT_RESET_DATE);
                endDate = moment(selectedHoliday.NEXT_RESET_DATE);
            }
            //startDate = new Date(_absence.ABSENCE_EFFECTIVE_DATE);
            startDate = moment(_absence.ABSENCE_EFFECTIVE_DATE);

            if (isDateValid(_absence.ABSENCE_EFFECTIVE_DATE)
                && moment(_absence.ABSENCE_EFFECTIVE_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate() >= moment($scope.HIRING_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate()
                && moment($scope.HIRING_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate() > moment($scope.FISCAL_YEAR_END, $scope.$parent.CONVERSION_DATE_FORMAT).toDate()
            ) {

                if (_absence.ACTUAL_NEXT_RESET_DATE == undefined) {
                    _absence.ACTUAL_NEXT_RESET_DATE = selectedHoliday.NEXT_RESET_DATE;
                }

                _absence.NEXT_RESET_DATE = angular.copy(_absence.ACTUAL_NEXT_RESET_DATE);
                var Nexta = moment(_absence.NEXT_RESET_DATE);
                var Nextb = Nexta.add(1, 'year');
                _absence.NEXT_RESET_DATE = moment(Nextb);
                endDate = moment(_absence.NEXT_RESET_DATE);
                selectedHoliday.NEXT_RESET_DATE = angular.copy(moment(_absence.NEXT_RESET_DATE));

                var Fiscala = moment($scope.FISCAL_YEAR_END);
                var Fiscalb = Fiscala.add(1, 'year');
                if (isDateValid(_absence.ABSENCE_EFFECTIVE_DATE) && selectedHoliday != undefined) {
                    //_absence.ANNUAL_ALLOWANCE = calculateAnnualAllowance(selectedHoliday, _absence.ABSENCE_EFFECTIVE_DATE, endDate);
                    _absence.ANNUAL_ALLOWANCE = calculateAnnualAllowance(selectedHoliday, moment(_absence.ABSENCE_EFFECTIVE_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate(), endDate, Fiscalb);
                }
            }
            else {
                if (isDateValid(_absence.ABSENCE_EFFECTIVE_DATE) && selectedHoliday != undefined) {
                    //_absence.ANNUAL_ALLOWANCE = calculateAnnualAllowance(selectedHoliday, _absence.ABSENCE_EFFECTIVE_DATE, endDate);
                    _absence.ANNUAL_ALLOWANCE = calculateAnnualAllowance(selectedHoliday, moment(_absence.ABSENCE_EFFECTIVE_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate(), endDate, $scope.FISCAL_YEAR_END);
                }
            }
        }
    }

    $scope.HRM_CLICK_EFFICTIVE_DATE = function () {
        $scope.EffectiveForm.submitted = true;
        if ($scope.EffectiveForm.$valid) {
            $scope.HRM_INS_UPD_EMPLOYEE_ABSENCES($scope.REDIRECTION_FLAG, 1);
        };
    };

    $scope.subtractOneDayKeepYear = function (date) {
        const originalYear = date.getFullYear();
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() - 1);
        // Check if the year changed and correct it
        if (newDate.getFullYear() !== originalYear) {
            newDate.setFullYear(originalYear);
        }
        return newDate;
    }

    $scope.HRM_INS_UPD_EMPLOYEE_ABSENCES = function (FLAG, EFFECTIVE_FLAG) {
        $scope.REDIRECTION_FLAG = FLAG;
        if ($scope.EDIT_STEP_NO == 9 && EFFECTIVE_FLAG == undefined) {
            $scope.AbsenceSearchform.submitted = true;
            if ($scope.AbsenceSearchform.$valid) {
                if ($scope.AbsenceSearch.EFFECTIVE_DATE == undefined || $scope.AbsenceSearch.EFFECTIVE_DATE == null || $scope.AbsenceSearch.EFFECTIVE_DATE == '') {
                    $scope.AbsenceSearch.EFFECTIVE_DATE = moment($scope.CURRENT_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).format($scope.$parent.CONVERSION_DATE_FORMAT);
                }
                //$('#EffectiveDate').modal('show');
                $scope.$parent.EFFECTIVE_DATE_PICKER($scope.HeaderPrimaryDetails.LOCK_DATE);
                $scope.HRM_EMPLOYEE_GET_UPCOMING_HISTORY_UPDATES_POPUP();

            }
            else {
                $scope.$parent.ShowAlertBox("Attention", $scope.$parent.MANDATORY_MSG, 3000);
            }
        }
        else {
            $scope.AbsenceSearchform.submitted = true;
            if ($scope.AbsenceSearchform.$valid) {
                var AbsenceObject = new Object();
                AbsenceObject.EMPLY_PRSNL_ID = $scope.AbsenceSearch.EMPLY_PRSNL_ID;
                AbsenceObject.USER_ID = $scope.AbsenceSearch.USER_ID;
                AbsenceObject.COMMENTS = $scope.AbsenceSearch.EFFECTIVE_COMMENTS;
                AbsenceObject.EFFECTIVE_DATE = $scope.AbsenceSearch.EFFECTIVE_DATE == "" || $scope.AbsenceSearch.EFFECTIVE_DATE == undefined ? null : moment($scope.AbsenceSearch.EFFECTIVE_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).format('L');
                AbsenceObject.HRM_EMPLOYEE_ABSENCE_TYPE = [];
                AbsenceObject.HRM_EMPLOYEE_ABSENCE_TYPEF_FOR_VALIDATION = [];
                if ($scope.EntitlementArray.length > 0) {
                    angular.forEach($scope.EntitlementArray, function (_loop_value) {
                        if ((_loop_value.EMPLOYEE_ABSENCE_ID == 0 && $scope.EDIT_STEP_NO == 9) || ($scope.EDIT_STEP_NO < 9) || $scope.EDIT_STEP_NO == 9 && _loop_value.ACTUAL_TAKEN == 0 && _loop_value.OLD_ENTITLEMENT_ACTIVE == 1 || $scope.EDIT_STEP_NO == 9 && parseFloat(_loop_value.ADJUSTMENT) > 0 && _loop_value.OLD_ENTITLEMENT_ACTIVE == 1) {
                            var Array = $scope.EDIT_STEP_NO == 9 ? $scope.OrignalData.EntitlementArray.length == 0 ? [] : $scope.OrignalData.EntitlementArray.EntitlementArray : null;
                            var OrginalData = $scope.EDIT_STEP_NO == 9 ? Array.filter(function (_Orginal_entit) { return _loop_value.EMPLOYEE_ABSENCE_ID == _Orginal_entit.EMPLOYEE_ABSENCE_ID }) : '';
                            var fieldChanges;
                            if (OrginalData != undefined && OrginalData.length > 0 && $scope.EDIT_STEP_NO == 9 && _loop_value.EMPLOYEE_ABSENCE_ID == OrginalData[0].EMPLOYEE_ABSENCE_ID) {
                                fieldChanges = OrginalData[0];
                                fieldChanges.BOOL_HOLIDAY_ENTITLEMENT_ID = _loop_value.HOLIDAY_ENTITLEMENT_ID != fieldChanges.HOLIDAY_ENTITLEMENT_ID;
                                fieldChanges.BOOL_ABSENCE_EFFECTIVE_DATE = moment(_loop_value.ABSENCE_EFFECTIVE_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).format('L') != moment(moment(fieldChanges.ABSENCE_EFFECTIVE_DATE), $scope.$parent.CONVERSION_DATE_FORMAT).format('L');
                                fieldChanges.BOOL_ANNUAL_ALLOWANCE = _loop_value.ANNUAL_ALLOWANCE != fieldChanges.ANNUAL_ALLOWANCE;
                                fieldChanges.BOOL_DB_ACCRUED = _loop_value.DB_ACCRUED != fieldChanges.DB_ACCRUED;
                                fieldChanges.BOOL_ADJUSTMENT = _loop_value.ADJUSTMENT != fieldChanges.ADJUSTMENT;
                                fieldChanges.BOOL_TAKEN = _loop_value.TAKEN != fieldChanges.TAKEN;
                                fieldChanges.BOOL_AVAILABLE_TILL_DATE = _loop_value.AVAILABLE_TILL_DATE != fieldChanges.AVAILABLE_TILL_DATE;
                                fieldChanges.BOOL_BOOKED = _loop_value.BOOKED != fieldChanges.BOOKED;
                                fieldChanges.BOOL_REMAINING_ANNUAL_BALANCE = _loop_value.REMAINING_ANNUAL_BALANCE != fieldChanges.REMAINING_ANNUAL_BALANCE;
                                fieldChanges.BOOL_TOTAL_DAYS_WORKED = _loop_value.TOTAL_DAYS_WORKED != fieldChanges.TOTAL_DAYS_WORKED;
                                fieldChanges.BOOL_AVG_HOURS_WORKED = _loop_value.AVG_HOURS_WORKED != fieldChanges.AVG_HOURS_WORKED;
                                fieldChanges.BOOL_AVG_PAY = _loop_value.AVG_PAY != fieldChanges.AVG_PAY;
                                fieldChanges.BOOL_ENTITLEMENT_END_DATE = _loop_value.ENTITLEMENT_END_DATE != fieldChanges.ENTITLEMENT_END_DATE;
                            };
                            var _absType = new Object()
                            _absType.EMPLOYEE_ABSENCE_ID = _loop_value.EMPLOYEE_ABSENCE_ID;
                            _absType.HOLIDAY_ENTITLEMENT_ID = _loop_value.HOLIDAY_ENTITLEMENT_ID;
                            _absType.ABSENCE_EFFECTIVE_DATE = fieldChanges != undefined && $scope.EDIT_STEP_NO == 9 && !fieldChanges.BOOL_ABSENCE_EFFECTIVE_DATE ? null : moment(_loop_value.ABSENCE_EFFECTIVE_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).format('L');
                            _absType.ANNUAL_ALLOWANCE = fieldChanges != undefined && $scope.EDIT_STEP_NO == 9 && !fieldChanges.BOOL_ANNUAL_ALLOWANCE ? null : _loop_value.ANNUAL_ALLOWANCE == undefined || _loop_value.ANNUAL_ALLOWANCE == null || _loop_value.ANNUAL_ALLOWANCE == '' ? 0 + '' : _loop_value.ANNUAL_ALLOWANCE;
                            _absType.ACCRUED = fieldChanges != undefined && $scope.EDIT_STEP_NO == 9 && !fieldChanges.BOOL_DB_ACCRUED ? null : _loop_value.DB_ACCRUED == undefined || _loop_value.DB_ACCRUED == null || _loop_value.DB_ACCRUED == '' ? 0 + '' : _loop_value.DB_ACCRUED + '';
                            _absType.ADJUSTMENT = fieldChanges != undefined && $scope.EDIT_STEP_NO == 9 && !fieldChanges.BOOL_ADJUSTMENT ? null : _loop_value.ADJUSTMENT == undefined || _loop_value.ADJUSTMENT == null || _loop_value.ADJUSTMENT == '' ? 0 + '' : _loop_value.ADJUSTMENT + '';
                            _absType.TAKEN = fieldChanges != undefined && $scope.EDIT_STEP_NO == 9 && !fieldChanges.BOOL_TAKEN ? null : _loop_value.TAKEN == undefined || _loop_value.TAKEN == null || _loop_value.TAKEN == '' ? 0 : parseFloat(parseFloat(_loop_value.TAKEN) - parseFloat(_loop_value.ACTUAL_TAKEN)).toFixed(2) + '';
                            _absType.AVAILABLE_TILL_DATE = fieldChanges != undefined && $scope.EDIT_STEP_NO == 9 && !fieldChanges.BOOL_AVAILABLE_TILL_DATE ? null : _loop_value.AVAILABLE_TILL_DATE == undefined || _loop_value.AVAILABLE_TILL_DATE == null || _loop_value.AVAILABLE_TILL_DATE == '' ? 0 + '' : _loop_value.AVAILABLE_TILL_DATE + '';
                            _absType.BOOKED = fieldChanges != undefined && $scope.EDIT_STEP_NO == 9 && !fieldChanges.BOOL_BOOKED ? null : _loop_value.BOOKED == undefined || _loop_value.BOOKED == null || _loop_value.BOOKED == '' ? 0 : _loop_value.BOOKED + '';
                            _absType.REMAINING_ANNUAL_BALANCE = fieldChanges != undefined && $scope.EDIT_STEP_NO == 9 && !fieldChanges.BOOL_REMAINING_ANNUAL_BALANCE ? null : _loop_value.REMAINING_ANNUAL_BALANCE == undefined || _loop_value.REMAINING_ANNUAL_BALANCE == null || _loop_value.REMAINING_ANNUAL_BALANCE == '' ? 0 + '' : _loop_value.REMAINING_ANNUAL_BALANCE + '';
                            _absType.TOTAL_DAYS_WORKED = fieldChanges != undefined && $scope.EDIT_STEP_NO == 9 && !fieldChanges.BOOL_TOTAL_DAYS_WORKED ? null : _loop_value.TOTAL_DAYS_WORKED == undefined || _loop_value.TOTAL_DAYS_WORKED == null || _loop_value.TOTAL_DAYS_WORKED == '' ? 0 + '' : _loop_value.TOTAL_DAYS_WORKED + '';
                            _absType.AVG_HOURS_WORKED = fieldChanges != undefined && $scope.EDIT_STEP_NO == 9 && !fieldChanges.BOOL_AVG_HOURS_WORKED ? null : _loop_value.AVG_HOURS_WORKED == undefined || _loop_value.AVG_HOURS_WORKED == null || _loop_value.AVG_HOURS_WORKED == '' ? 0 + '' : _loop_value.AVG_HOURS_WORKED + '';
                            _absType.AVG_PAY = fieldChanges != undefined && $scope.EDIT_STEP_NO == 9 && !fieldChanges.BOOL_AVG_PAY ? null : _loop_value.AVG_PAY == undefined || _loop_value.AVG_PAY == null || _loop_value.AVG_PAY == '' ? 0 + '' : _loop_value.AVG_PAY + '';
                            _absType.DELETE_FLAG = 0;
                            if (_loop_value.EMPLOYEE_ABSENCE_ID > 0) {
                                _absType.ABSENCE_END_DATE = moment(moment(_loop_value.ENTITLEMENT_END_DATE), $scope.$parent.CONVERSION_DATE_FORMAT).format('L');
                            }
                            else {
                                if (moment($scope.HIRING_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate() > moment($scope.FISCAL_YEAR_START, $scope.$parent.CONVERSION_DATE_FORMAT).toDate() && (isDateValid(_loop_value.ABSENCE_EFFECTIVE_DATE)
                                    && moment(_loop_value.ABSENCE_EFFECTIVE_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate() >= moment($scope.HIRING_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate())) {
                                    //let d = moment(moment(_loop_value.NEXT_RESET_DATE), $scope.$parent.CONVERSION_DATE_FORMAT).toDate('L');
                                    let d = moment(moment(_loop_value.NEXT_RESET_DATE), $scope.CONVERSION_DATE_FORMAT, true).subtract(1, 'days').toDate('L');
                                    _absType.ABSENCE_END_DATE = $scope.HRM_CHANGE_TIME_ZONE_Fn(d);
                                }
                                else if (moment(moment(_loop_value.NEXT_RESET_DATE), $scope.$parent.CONVERSION_DATE_FORMAT).toDate() > moment($scope.FISCAL_YEAR_END, $scope.$parent.CONVERSION_DATE_FORMAT).toDate()) {
                                    _absType.ABSENCE_END_DATE = moment($scope.FISCAL_YEAR_END, $scope.$parent.CONVERSION_DATE_FORMAT).format('L');
                                } else {
                                    //let d = moment(moment(_loop_value.NEXT_RESET_DATE), $scope.$parent.CONVERSION_DATE_FORMAT).toDate('L');
                                    //_absType.ABSENCE_END_DATE = $scope.HRM_CHANGE_TIME_ZONE_Fn($scope.subtractOneDayKeepYear(d));
                                    let d = moment(moment(_loop_value.NEXT_RESET_DATE), $scope.CONVERSION_DATE_FORMAT, true).subtract(1, 'days').toDate('L');
                                    _absType.ABSENCE_END_DATE = $scope.HRM_CHANGE_TIME_ZONE_Fn(d);
                                    //NEXT_RESET_DATE
                                }
                                // ABSENCE_END_DATE   ONE DAY BEFORE START OF  NEXT RESET DATE    MEAN NEXTDATE IS 1APR2025 THEN END DATE IS 31MRH2025
                            }
                            AbsenceObject.HRM_EMPLOYEE_ABSENCE_TYPE.push(angular.copy(_absType));
                            _absType.ABSENCE_TYPE_ID = _loop_value.ABSENCE_TYPE_ID;
                            AbsenceObject.HRM_EMPLOYEE_ABSENCE_TYPEF_FOR_VALIDATION.push(angular.copy(_absType));
                        }
                    });
                }
                if (AbsenceObject.HRM_EMPLOYEE_ABSENCE_TYPEF_FOR_VALIDATION.length > 0) { // End of old Entitlement
                    angular.forEach($scope.EntitlementArray, function (_loop_value) {
                        let same_old_entitl = AbsenceObject.HRM_EMPLOYEE_ABSENCE_TYPEF_FOR_VALIDATION.filter(function (_new_entit) { return _new_entit.ABSENCE_TYPE_ID == _loop_value.ABSENCE_TYPE_ID && _loop_value.HOLIDAY_ENTITLEMENT_ID != _new_entit.HOLIDAY_ENTITLEMENT_ID });
                        if (same_old_entitl.length > 0 && _loop_value.EMPLOYEE_ABSENCE_ID > 0 && _loop_value.OLD_ENTITLEMENT_ACTIVE == 1) {
                            var _absType = new Object()
                            _absType.EMPLOYEE_ABSENCE_ID = _loop_value.EMPLOYEE_ABSENCE_ID;
                            _absType.HOLIDAY_ENTITLEMENT_ID = _loop_value.HOLIDAY_ENTITLEMENT_ID;
                            _absType.ABSENCE_EFFECTIVE_DATE = moment(_loop_value.ABSENCE_EFFECTIVE_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).format('L');
                            _absType.ANNUAL_ALLOWANCE = _loop_value.ANNUAL_ALLOWANCE == undefined || _loop_value.ANNUAL_ALLOWANCE == null || _loop_value.ANNUAL_ALLOWANCE == '' ? 0 + '' : _loop_value.ANNUAL_ALLOWANCE + '';
                            _absType.ACCRUED = _loop_value.DB_ACCRUED == undefined || _loop_value.DB_ACCRUED == null || _loop_value.DB_ACCRUED == '' ? 0 + '' : _loop_value.DB_ACCRUED + '';
                            _absType.ADJUSTMENT = _loop_value.ADJUSTMENT == undefined || _loop_value.ADJUSTMENT == null || _loop_value.ADJUSTMENT == '' ? 0 + '' : _loop_value.ADJUSTMENT + '';
                            _absType.TAKEN = _loop_value.TAKEN == undefined || _loop_value.TAKEN == null || _loop_value.TAKEN == '' ? 0 : parseFloat(parseFloat(_loop_value.TAKEN) - parseFloat(_loop_value.ACTUAL_TAKEN)).toFixed(2) + '';
                            _absType.AVAILABLE_TILL_DATE = _loop_value.AVAILABLE_TILL_DATE == undefined || _loop_value.AVAILABLE_TILL_DATE == null || _loop_value.AVAILABLE_TILL_DATE == '' ? 0 + '' : _loop_value.AVAILABLE_TILL_DATE + '';
                            _absType.BOOKED = _loop_value.BOOKED == undefined || _loop_value.BOOKED == null || _loop_value.BOOKED == '' ? 0 + '' : _loop_value.BOOKED + '';
                            _absType.REMAINING_ANNUAL_BALANCE = _loop_value.REMAINING_ANNUAL_BALANCE == undefined || _loop_value.REMAINING_ANNUAL_BALANCE == null || _loop_value.REMAINING_ANNUAL_BALANCE == '' ? 0 + '' : _loop_value.REMAINING_ANNUAL_BALANCE + '';
                            _absType.TOTAL_DAYS_WORKED = _loop_value.TOTAL_DAYS_WORKED == undefined || _loop_value.TOTAL_DAYS_WORKED == null || _loop_value.TOTAL_DAYS_WORKED == '' ? 0 + '' : _loop_value.TOTAL_DAYS_WORKED + '';
                            _absType.AVG_HOURS_WORKED = _loop_value.AVG_HOURS_WORKED == undefined || _loop_value.AVG_HOURS_WORKED == null || _loop_value.AVG_HOURS_WORKED == '' ? 0 + '' : _loop_value.AVG_HOURS_WORKED + '';
                            _absType.AVG_PAY = _loop_value.AVG_PAY == undefined || _loop_value.AVG_PAY == null || _loop_value.AVG_PAY == '' ? 0 + '' : _loop_value.AVG_PAY + '';
                            _absType.DELETE_FLAG = 0;
                            let d = moment(moment(same_old_entitl[0].ABSENCE_EFFECTIVE_DATE), $scope.$parent.CONVERSION_DATE_FORMAT).toDate('L');
                            _absType.ABSENCE_END_DATE = $scope.HRM_CHANGE_TIME_ZONE_Fn($scope.subtractOneDayKeepYear(d));
                            AbsenceObject.HRM_EMPLOYEE_ABSENCE_TYPE = AbsenceObject.HRM_EMPLOYEE_ABSENCE_TYPE.filter(item => item.EMPLOYEE_ABSENCE_ID !== _loop_value.EMPLOYEE_ABSENCE_ID);
                            AbsenceObject.HRM_EMPLOYEE_ABSENCE_TYPE.push(angular.copy(_absType));
                        }
                    });
                }
                if ($scope.EntitlementArrayDeleted.length > 0) {
                    angular.forEach($scope.EntitlementArrayDeleted, function (_loop_value) {
                        var _absType = new Object();
                        _absType.EMPLOYEE_ABSENCE_ID = _loop_value.EMPLOYEE_ABSENCE_ID;
                        _absType.HOLIDAY_ENTITLEMENT_ID = _loop_value.HOLIDAY_ENTITLEMENT_ID;
                        _absType.ABSENCE_EFFECTIVE_DATE = moment(_loop_value.ABSENCE_EFFECTIVE_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).format('L');
                        _absType.ANNUAL_ALLOWANCE = _loop_value.ANNUAL_ALLOWANCE || 0;
                        _absType.ACCRUED = _loop_value.DB_ACCRUED || 0;
                        _absType.ADJUSTMENT = _loop_value.ADJUSTMENT || 0;
                        _absType.TAKEN = _loop_value.TAKEN;
                        _absType.AVAILABLE_TILL_DATE = _loop_value.AVAILABLE_TILL_DATE;
                        _absType.BOOKED = _loop_value.BOOKED;
                        _absType.REMAINING_ANNUAL_BALANCE = _loop_value.REMAINING_ANNUAL_BALANCE == undefined || _loop_value.REMAINING_ANNUAL_BALANCE == null || _loop_value.REMAINING_ANNUAL_BALANCE == '' ? 0 : _loop_value.REMAINING_ANNUAL_BALANCE;
                        _absType.TOTAL_DAYS_WORKED = _loop_value.TOTAL_DAYS_WORKED || 0;
                        _absType.AVG_HOURS_WORKED = _loop_value.AVG_HOURS_WORKED || 0;
                        _absType.AVG_PAY = _loop_value.AVG_PAY || 0;
                        _absType.DELETE_FLAG = 1;
                        if (_loop_value.EMPLOYEE_ABSENCE_ID > 0) {
                            _absType.ABSENCE_END_DATE = _loop_value.ENTITLEMENT_END_DATE;
                        } else {
                            let d = moment(_loop_value.NEXT_RESET_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate('L');
                            _absType.ABSENCE_END_DATE = $scope.HRM_CHANGE_TIME_ZONE_Fn($scope.subtractOneDayKeepYear(d));
                        }
                        AbsenceObject.HRM_EMPLOYEE_ABSENCE_TYPE.push(_absType);
                    });
                }
                if (AbsenceObject.HRM_EMPLOYEE_ABSENCE_TYPE.length == 0) {
                    var _absType = new Object();
                    _absType.EMPLOYEE_ABSENCE_ID = null;
                    _absType.HOLIDAY_ENTITLEMENT_ID = null;
                    _absType.ABSENCE_EFFECTIVE_DATE = null;
                    _absType.ANNUAL_ALLOWANCE = null;
                    _absType.ACCRUED = null;
                    _absType.ADJUSTMENT = null;
                    _absType.TAKEN = null;
                    _absType.AVAILABLE_TILL_DATE = null;
                    _absType.BOOKED = null;
                    _absType.REMAINING_ANNUAL_BALANCE = null;
                    _absType.TOTAL_DAYS_WORKED = null;
                    _absType.AVG_HOURS_WORKED = null;
                    _absType.AVG_PAY = null;
                    _absType.DELETE_FLAG = null;;
                    _absType.ABSENCE_END_DATE = null;
                    AbsenceObject.HRM_EMPLOYEE_ABSENCE_TYPE.push(_absType);
                }
                if ($scope.POP_EMPLOYEE_HISTORY_HEADERS_LIST != undefined && $scope.POP_EMPLOYEE_HISTORY_HEADERS_LIST.length > 0) {
                    AbsenceObject.TABLE_ID_LIST = [];
                    angular.forEach($scope.POP_EMPLOYEE_HISTORY_HEADERS_LIST, function (_History_value) {
                        var readOnly = new Object();
                        readOnly.TABLE_ID = _History_value.HISTORY_HEADER_ID;
                        AbsenceObject.TABLE_ID_LIST.push(readOnly);
                    });
                    PrcCommMethods.HUMANRESOURCE_API(AbsenceObject, 'HRM_EMPLOYEE_UPD_BACKDATED_CHANGE').then(function (data) { });
                }
                PrcCommMethods.HUMANRESOURCE_API(AbsenceObject, 'HRM_INS_UPD_EMPLOYEE_ABSENCES').then(function (data) {
                    if (data.data > 0) {
                        $scope.$parent.ShowAlertBox("Success", 'Absence updated successfully', 3000);
                        if (FLAG == 1) {
                            $scope.TAB_CLICK_HR_HEADER_Fn(0);
                        }
                        else {
                            $scope.TAB_CLICK_HR_HEADER_Fn(5, getUrlParameter('EMP_ID', $location.absUrl()));
                        }
                        $scope.EntitlementArray = [];
                    }
                    else if (data.data < 0) {
                        $scope.$parent.ShowAlertBox("Attention", 'Already Added', 3000);
                    }
                    if (data.data == 0) {
                        $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                    }
                    $scope.$parent.$parent.DATE_INPUT_LOAD();
                });
            } else {
                $scope.$parent.ShowAlertBox("Attention", $scope.$parent.MANDATORY_MSG, 3000);
            }
        }
    };
    $scope.SELECTED_ENTITLEMENT_Fn = function (_entitlement, _absence, parma_index) {
        if (_entitlement == '') {
            _absence.CUSTOM_ENTITLEMENT_NAME = $scope.DD_DefaultText;
            _absence, HOLIDAY_ENTITLEMENT_ID = '';
            _absence.ABSENCE_TYPE_ID = "";
        }
        else {
            //if (_absence.ABSENCE_EFFECTIVE_DATE != null && _absence.ABSENCE_EFFECTIVE_DATE != '' && _absence.ABSENCE_EFFECTIVE_DATE != undefined
            //    && new Date(_entitlement.NEXT_RESET_DATE) < new Date(_absence.ABSENCE_EFFECTIVE_DATE)) {
            if (_absence.ABSENCE_EFFECTIVE_DATE != null && _absence.ABSENCE_EFFECTIVE_DATE != '' && _absence.ABSENCE_EFFECTIVE_DATE != undefined
                && moment(moment(_entitlement.NEXT_RESET_DATE), $scope.$parent.CONVERSION_DATE_FORMAT).toDate() < moment(_absence.ABSENCE_EFFECTIVE_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate()) {
                $scope.$parent.ShowAlertBox("Warning", "The selected holiday entitlement has already expired. Please select a valid entitlement.", 3000);
            } else {
                var Isalreadyentitlemt = false;
                var IsalreadyAbsencetype = false;

                for (var i = 0; i < $scope.EntitlementArray.length; i++) {
                    Isalreadyentitlemt = $scope.EntitlementArray[i].HOLIDAY_ENTITLEMENT_ID == _entitlement.HOLIDAY_ENTITLEMENT_ID && parma_index != i;
                    if (Isalreadyentitlemt) {
                        break;
                    }
                    if (_absence.ABSENCE_EFFECTIVE_DATE != '' && _absence.ABSENCE_EFFECTIVE_DATE != undefined && _absence.ABSENCE_EFFECTIVE_DATE != null) {
                        IsalreadyAbsencetype = $scope.EntitlementArray[i].ABSENCE_TYPE_ID == _entitlement.ABSENCE_TYPE_ID && parma_index != i;
                        if (IsalreadyAbsencetype) {
                            break;
                        }
                    }
                };
                if (Isalreadyentitlemt) {
                    $scope.$parent.ShowAlertBox('Error', "Same Entitlement is not allowed", 3000);
                }
                else if (IsalreadyAbsencetype) {
                    $scope.$parent.ShowAlertBox('Error', "Same Absence type is not allowed", 3000);
                }
                else {

                    if ((_entitlement.UNITS_ID == 2 && ($scope.EMPLOYEE_WORK_PATTERN.WORK_PATTERN_TYPE_ID != 3 && $scope.EMPLOYEE_WORK_PATTERN.WORK_PATTERN_TYPE_ID != 4)) || (_entitlement.UNITS_ID != 2 && $scope.EMPLOYEE_WORK_PATTERN.WORK_PATTERN_TYPE_ID == 3) || (_entitlement.UNITS_ID != 2 && $scope.EMPLOYEE_WORK_PATTERN.WORK_PATTERN_TYPE_ID == 4)) {

                        if ($scope.EMPLOYEE_WORK_PATTERN.WORK_PATTERN_TYPE_ID != 3 && $scope.EMPLOYEE_WORK_PATTERN.WORK_PATTERN_TYPE_ID != 4) {
                            $scope.AlertMessage1 = "Your work pattern is not a shift based work schedule.";
                            $scope.AlertMessage2 = "Hence, assigned holiday entitlement cannot be shift based.";
                        } else {
                            $scope.AlertMessage1 = "Your work pattern is shift based work schedule.";
                            $scope.AlertMessage2 = "Hence, assigned holiday entitlement has to be a shift based plan.";
                        }
                        //if ($scope.EMPLOYEE_WORK_PATTERN.WORK_PATTERN_TYPE_ID != 3 && $scope.EMPLOYEE_WORK_PATTERN.WORK_PATTERN_TYPE_ID != 4 ) {
                        //    $scope.AlertMessage1 = "Your work pattern is not a shift based work schedule.";
                        //    $scope.AlertMessage2 = "Hence, assigned holiday entitlement cannot be shift based.";
                        //} else {
                        //    $scope.AlertMessage1 = "Your work pattern is shift based work schedule.";
                        //    $scope.AlertMessage2 = "Hence, assigned holiday entitlement has to be a shift based plan.";
                        //}
                        $('#alert-workpattern').modal('show');
                    }
                    else {
                        _absence.CUSTOM_ENTITLEMENT_NAME = _entitlement.ENTITLEMENT_NAME + "-" + _entitlement.ABSENCE_TYPE;
                        _absence.HOLIDAY_ENTITLEMENT_ID = _entitlement.HOLIDAY_ENTITLEMENT_ID;
                        _absence.HOLIDAY_ENTITLEMENT_PLAN = _entitlement.ENTITLEMENT_NAME;
                        _absence.ABSENCE_TYPE = _entitlement.ABSENCE_TYPE;
                        _absence.NEXT_RESET_DATE = angular.copy(_entitlement.NEXT_RESET_DATE);
                        _absence.ACTUAL_NEXT_RESET_DATE = angular.copy(_entitlement.NEXT_RESET_DATE);
                        _absence.UNITS = _entitlement.UNITS;
                        _absence.UNITS_ID = _entitlement.UNITS_ID;
                        _absence.ABSENCE_TYPE_ID = _entitlement.ABSENCE_TYPE_ID;
                        if (_absence.ABSENCE_EFFECTIVE_DATE != null && _absence.ABSENCE_EFFECTIVE_DATE != '' && _absence.ABSENCE_EFFECTIVE_DATE != undefined) {
                            $scope.CHECK_EFFECTIVEDATE_BY_HIRINGDATE(_absence);
                        }
                        //if ($scope.EMPLOYEE_WORK_PATTERN != null) {
                        //}
                    }
                }

            }
        }
    };
    var calculateAnnualAllowance = function (_entitlement, start_employee_date, end_employee_date, FISCAL_YEAR_END) {

        //let ent_end_date = new Date(_entitlement.NEXT_RESET_DATE);
        //let ent_start_date = new Date(ent_end_date);
        //ent_start_date = new Date(ent_start_date.setFullYear(ent_end_date.getFullYear() - 1));
        //ent_end_date = new Date(ent_end_date.setDate(ent_end_date.getDate() - 1));

        let ent_end_date = moment(_entitlement.NEXT_RESET_DATE);
        let ent_start_date = moment(ent_end_date);
        const fullYear = ent_end_date.year();
        ent_start_date = moment(ent_start_date.year(fullYear - 1));
        ent_end_date = moment(ent_end_date.date(ent_end_date.date() - 1));

        if (_entitlement.CALCULATION_TYPE_ID == 1) { // Calendar Days (365 Days in a year)
            if (_entitlement.UNITS_ID != 2) { // hours and days
                let result = calculateDays(start_employee_date, end_employee_date, ent_start_date, ent_end_date);
                let proratedAnnualLeave = result.totalDays > 0 ? ((_entitlement.INITIAL_VALUE * result.remainingDays) / result.totalDays) : 0;
                //  const annualAllowance = _entitlement.ROUND_UP_DOWN ? Math.floor(proratedAnnualLeave) : Math.ceil(proratedAnnualLeave);
                if (_entitlement.ROUND_UP_DOWN == 0) {
                    annualAllowance = Math.floor(proratedAnnualLeave).toFixed(2);
                }
                else if (_entitlement.ROUND_UP_DOWN == 1) {
                    annualAllowance = Math.ceil(proratedAnnualLeave).toFixed(2);
                }
                else if (_entitlement.ROUND_UP_DOWN == 2) {
                    annualAllowance = parseFloat(proratedAnnualLeave).toFixed(2);
                }
                return annualAllowance;
            }
            if (_entitlement.UNITS_ID == 2) { //"Shifts"
                let result = calculateDays(start_employee_date, end_employee_date, ent_start_date, ent_end_date);
                let proratedAnnualLeave = (_entitlement.INITIAL_VALUE * result.remainingDays) / result.totalDays;
                if (_entitlement.ROUND_UP_DOWN == 0) {
                    annualAllowance = Math.floor(proratedAnnualLeave).toFixed(2);
                }
                else if (_entitlement.ROUND_UP_DOWN == 1) {
                    annualAllowance = Math.ceil(proratedAnnualLeave).toFixed(2);
                }
                else if (_entitlement.ROUND_UP_DOWN == 2) {
                    annualAllowance = parseFloat(proratedAnnualLeave).toFixed(2);
                }
                return annualAllowance;
            }
        }
        else if (_entitlement.CALCULATION_TYPE_ID == 2 && $scope.EMPLOYEE_WORK_PATTERN != null) { // Working Days (using working days in the work pattern)

            if (_entitlement.UNITS_ID != 2) { // hours and days  
                let result = calculateDays(start_employee_date, end_employee_date, ent_start_date, ent_end_date);
                // let result = countDaysAndSpecificWeekdays(start_employee_date, FISCAL_YEAR_END, weekdaysToCount, ent_start_date, ent_end_date);
                // let proratedAnnualLeave = result.totalDays > 0 ? ((_entitlement.INITIAL_VALUE * result.totalRemainingDays) / result.totalDays) : 0;
                var CONTRACTUAL_NUMBER_DAY_HRS = _entitlement.UNITS_ID == 1 ? $scope.EMPLOYEE_WORK_PATTERN.CONTRACTUAL_NUMBER_OF_DAYS : $scope.EMPLOYEE_WORK_PATTERN.TOTAL;
                let remainingDays = result.remainingDays / 7;
                let totalDays = result.totalDays / 7;
                let Contractual_number_of_days_or_hrs_remaining = remainingDays * CONTRACTUAL_NUMBER_DAY_HRS;
                let Contractual_number_of_days_or_hrs_total = totalDays * CONTRACTUAL_NUMBER_DAY_HRS;
                let proratedAnnualLeave = result.totalDays > 0 ? ((_entitlement.INITIAL_VALUE * Contractual_number_of_days_or_hrs_remaining) / Contractual_number_of_days_or_hrs_total) : 0;

                if (_entitlement.ROUND_UP_DOWN == 0) {
                    annualAllowance = Math.floor(proratedAnnualLeave).toFixed(2);
                }
                else if (_entitlement.ROUND_UP_DOWN == 1) {
                    annualAllowance = Math.ceil(proratedAnnualLeave).toFixed(2);
                }
                else if (_entitlement.ROUND_UP_DOWN == 2) {
                    annualAllowance = parseFloat(proratedAnnualLeave).toFixed(2);
                }

                return annualAllowance;
            }
            if (_entitlement.UNITS_ID == 2) { // shift 
                //let totalDayCount = 0
                //let totalWeekDaysCount = 0;
                let result = calculateDays(start_employee_date, end_employee_date, ent_start_date, ent_end_date);
                //let proratedAnnualLeave = totalDayCount > 0 ? ((_entitlement.INITIAL_VALUE * totalWeekDaysCount) / totalDayCount) : 0;
                // var CONTRACTUAL_NUMBER_DAY_HRS = _entitlement.UNITS_ID == 1 ? $scope.EMPLOYEE_WORK_PATTERN.CONTRACTUAL_NUMBER_OF_DAYS : $scope.EMPLOYEE_WORK_PATTERN.TOTAL;
                let CONTRACTUAL_NUMBER_OF_SHIFTS_OR_TOTAL = $scope.EMPLOYEE_WORK_PATTERN.WORK_PATTERN_TYPE_ID == 3 ? $scope.EMPLOYEE_WORK_PATTERN.TOTAL : $scope.EMPLOYEE_WORK_PATTERN.CONTRACTUAL_NUMBER_OF_SHIFTS;
                let remainingDays = result.remainingDays * 7;
                let totalDays = result.totalDays * 7;
                let Contractual_number_of_shift_or_total_remaining = remainingDays * CONTRACTUAL_NUMBER_OF_SHIFTS_OR_TOTAL;
                let Contractual_number_of_shift_or_total_total = totalDays * CONTRACTUAL_NUMBER_OF_SHIFTS_OR_TOTAL;
                let proratedAnnualLeave = result.totalDays > 0 ? ((_entitlement.INITIAL_VALUE * Contractual_number_of_shift_or_total_remaining) / Contractual_number_of_shift_or_total_total) : 0;
                if (_entitlement.ROUND_UP_DOWN == 0) {
                    annualAllowance = Math.floor(proratedAnnualLeave).toFixed(2);
                }
                else if (_entitlement.ROUND_UP_DOWN == 1) {
                    annualAllowance = Math.ceil(proratedAnnualLeave).toFixed(2);
                }
                else if (_entitlement.ROUND_UP_DOWN == 2) {
                    annualAllowance = parseFloat(proratedAnnualLeave).toFixed(2);
                }
                return annualAllowance;
            }
        }
    }
    var calculateAnnualAllowancOld = function (_entitlement, start_employee_date, end_employee_date, FISCAL_YEAR_END) {

        //let ent_end_date = new Date(_entitlement.NEXT_RESET_DATE);
        //let ent_start_date = new Date(ent_end_date);
        //ent_start_date = new Date(ent_start_date.setFullYear(ent_end_date.getFullYear() - 1));
        //ent_end_date = new Date(ent_end_date.setDate(ent_end_date.getDate() - 1));

        let ent_end_date = moment(_entitlement.NEXT_RESET_DATE);
        let ent_start_date = moment(ent_end_date);
        const fullYear = ent_end_date.year();
        ent_start_date = moment(ent_start_date.year(fullYear - 1));
        ent_end_date = moment(ent_end_date.date(ent_end_date.date() - 1));

        if (_entitlement.CALCULATION_TYPE_ID == 1) { // Calendar Days (365 Days in a year)
            if (_entitlement.UNITS_ID != 2) { // hours and days
                let result = calculateDays(start_employee_date, end_employee_date, ent_start_date, ent_end_date);
                let proratedAnnualLeave = result.totalDays > 0 ? ((_entitlement.INITIAL_VALUE * result.remainingDays) / result.totalDays) : 0;
                //  const annualAllowance = _entitlement.ROUND_UP_DOWN ? Math.floor(proratedAnnualLeave) : Math.ceil(proratedAnnualLeave);
                if (_entitlement.ROUND_UP_DOWN == 0) {
                    annualAllowance = Math.floor(proratedAnnualLeave).toFixed(2);
                }
                else if (_entitlement.ROUND_UP_DOWN == 1) {
                    annualAllowance = Math.ceil(proratedAnnualLeave).toFixed(2);
                }
                else if (_entitlement.ROUND_UP_DOWN == 2) {
                    annualAllowance = parseFloat(proratedAnnualLeave).toFixed(2);
                }
                return annualAllowance;
            }
            if (_entitlement.UNITS_ID == 2) { //"Shifts"
                let result = calculateDays(start_employee_date, end_employee_date, ent_start_date, ent_end_date);
                let proratedAnnualLeave = (_entitlement.INITIAL_VALUE * result.remainingDays) / result.totalDays;
                if (_entitlement.ROUND_UP_DOWN == 0) {
                    annualAllowance = Math.floor(proratedAnnualLeave).toFixed(2);
                }
                else if (_entitlement.ROUND_UP_DOWN == 1) {
                    annualAllowance = Math.ceil(proratedAnnualLeave).toFixed(2);
                }
                else if (_entitlement.ROUND_UP_DOWN == 2) {
                    annualAllowance = parseFloat(proratedAnnualLeave).toFixed(2);
                }
                return annualAllowance;
            }
        }
        else if (_entitlement.CALCULATION_TYPE_ID == 2 && $scope.EMPLOYEE_WORK_PATTERN != null) { // Working Days (using working days in the work pattern)
            let weekdaysToCount = [];
            if ($scope.EMPLOYEE_WORK_PATTERN.SUN > 0) {
                weekdaysToCount.push(0);
            }
            if ($scope.EMPLOYEE_WORK_PATTERN.MON > 0) {
                weekdaysToCount.push(1);
            }
            if ($scope.EMPLOYEE_WORK_PATTERN.TUE > 0) {
                weekdaysToCount.push(2);
            }
            if ($scope.EMPLOYEE_WORK_PATTERN.WED > 0) {
                weekdaysToCount.push(3);
            }
            if ($scope.EMPLOYEE_WORK_PATTERN.THU > 0) {
                weekdaysToCount.push(4);
            }
            if ($scope.EMPLOYEE_WORK_PATTERN.FRI > 0) {
                weekdaysToCount.push(5);
            }
            if ($scope.EMPLOYEE_WORK_PATTERN.SAT > 0) {
                weekdaysToCount.push(6);
            }
            if (_entitlement.UNITS_ID != 2) { // hours and days  
                let result = countDaysAndSpecificWeekdays(start_employee_date, FISCAL_YEAR_END, weekdaysToCount, ent_start_date, ent_end_date);
                let proratedAnnualLeave = result.totalDays > 0 ? ((_entitlement.INITIAL_VALUE * result.totalRemainingDays) / result.totalDays) : 0;
                // const annualAllowance = _entitlement.ROUND_UP_DOWN ? Math.floor(proratedAnnualLeave) : Math.ceil(proratedAnnualLeave);
                if (_entitlement.ROUND_UP_DOWN == 0) {
                    annualAllowance = Math.floor(proratedAnnualLeave).toFixed(2);
                }
                else if (_entitlement.ROUND_UP_DOWN == 1) {
                    annualAllowance = Math.ceil(proratedAnnualLeave).toFixed(2);
                }
                else if (_entitlement.ROUND_UP_DOWN == 2) {
                    annualAllowance = parseFloat(proratedAnnualLeave).toFixed(2);
                }

                return annualAllowance;
            }
            if (_entitlement.UNITS_ID == 2) { // Shift 
                let totalDayCount = 0
                let totalWeekDaysCount = 0;
                let result = countDaysAndSpecificWeekdays(start_employee_date, FISCAL_YEAR_END, weekdaysToCount, ent_start_date, ent_end_date);
                if ($scope.EMPLOYEE_WORK_PATTERN.SUN > 0) {
                    totalWeekDaysCount += result.remainingDays[0] * $scope.EMPLOYEE_WORK_PATTERN.SUN;
                    totalDayCount += result.totalDaysWeekCount[0] * $scope.EMPLOYEE_WORK_PATTERN.SUN;
                }
                if ($scope.EMPLOYEE_WORK_PATTERN.MON > 0) {
                    totalWeekDaysCount += result.remainingDays[1] * $scope.EMPLOYEE_WORK_PATTERN.MON;
                    totalDayCount += result.totalDaysWeekCount[1] * $scope.EMPLOYEE_WORK_PATTERN.MON;
                }
                if ($scope.EMPLOYEE_WORK_PATTERN.TUE > 0) {
                    totalWeekDaysCount += result.remainingDays[2] * $scope.EMPLOYEE_WORK_PATTERN.TUE;
                    totalDayCount += result.totalDaysWeekCount[2] * $scope.EMPLOYEE_WORK_PATTERN.TUE;
                }
                if ($scope.EMPLOYEE_WORK_PATTERN.WED > 0) {
                    totalWeekDaysCount += result.remainingDays[3] * $scope.EMPLOYEE_WORK_PATTERN.WED;
                    totalDayCount += result.totalDaysWeekCount[3] * $scope.EMPLOYEE_WORK_PATTERN.WED;
                }
                if ($scope.EMPLOYEE_WORK_PATTERN.THU > 0) {
                    totalWeekDaysCount += result.remainingDays[4] * $scope.EMPLOYEE_WORK_PATTERN.THU;
                    totalDayCount += result.totalDaysWeekCount[4] * $scope.EMPLOYEE_WORK_PATTERN.THU;
                }
                if ($scope.EMPLOYEE_WORK_PATTERN.FRI > 0) {
                    totalWeekDaysCount += result.remainingDays[5] * $scope.EMPLOYEE_WORK_PATTERN.FRI;
                    totalDayCount += result.totalDaysWeekCount[5] * $scope.EMPLOYEE_WORK_PATTERN.FRI;
                }
                if ($scope.EMPLOYEE_WORK_PATTERN.SAT > 0) {
                    totalWeekDaysCount += result.remainingDays[6] * $scope.EMPLOYEE_WORK_PATTERN.SAT;
                    totalDayCount += result.totalDaysWeekCount[6] * $scope.EMPLOYEE_WORK_PATTERN.SAT;
                }
                let proratedAnnualLeave = totalDayCount > 0 ? ((_entitlement.INITIAL_VALUE * totalWeekDaysCount) / totalDayCount) : 0;
                // total number of days * cantaual base 
                // const annualAllowance = _entitlement.ROUND_UP_DOWN ? Math.floor(proratedAnnualLeave) : Math.ceil(proratedAnnualLeave);

                if (_entitlement.ROUND_UP_DOWN == 0) {
                    annualAllowance = Math.floor(proratedAnnualLeave).toFixed(2);
                }
                else if (_entitlement.ROUND_UP_DOWN == 1) {
                    annualAllowance = Math.ceil(proratedAnnualLeave).toFixed(2);
                }
                else if (_entitlement.ROUND_UP_DOWN == 2) {
                    annualAllowance = parseFloat(proratedAnnualLeave).toFixed(2);
                }
                return annualAllowance;
            }
        }
    }

    function calculateDays(startDate, endDate, ent_start_date, ent_end_date) {
        //const firstDayOfYear = new Date(startDate);
        //const lastDayOfYear = new Date(endDate);
        //ent_start_date = new Date(ent_start_date);
        //ent_end_date = new Date(ent_end_date);

        const firstDayOfYear = moment(startDate, $scope.$parent.CONVERSION_DATE_FORMAT).toDate('L');
        const lastDayOfYear = moment(endDate, $scope.$parent.CONVERSION_DATE_FORMAT).toDate('L');
        ent_start_date = moment(ent_start_date, $scope.$parent.CONVERSION_DATE_FORMAT).toDate('L');
        ent_end_date = moment(ent_end_date, $scope.$parent.CONVERSION_DATE_FORMAT).toDate('L');

        let totalDaysInYear = Math.floor((ent_end_date - ent_start_date) / (1000 * 60 * 60 * 24));
        var remainingDays = Math.floor((lastDayOfYear - firstDayOfYear) / (1000 * 60 * 60 * 24));
        //if (totalDaysInYear > remainingDays) {
        //    remainingDays = remainingDays+1 ;
        //}
        return {
            totalDays: totalDaysInYear + 1,
            remainingDays: remainingDays + 1
        };
    }
    function countDaysAndSpecificWeekdays(startDateStr, endDateStr, weekdays, ent_start_date, ent_end_date) {
        //ent_start_date = new Date(ent_start_date);
        //ent_end_date = new Date(ent_end_date);

        //const startDate = new Date(startDateStr);
        //const endDate = new Date(endDateStr);
        // moment(_leaveSearch.START_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).format('L');
        ent_start_date = moment(ent_start_date, $scope.$parent.CONVERSION_DATE_FORMAT).toDate('L');
        ent_end_date = moment(ent_end_date, $scope.$parent.CONVERSION_DATE_FORMAT).toDate('L');
        //const startDate = moment(startDateStr);
        //const endDate = moment(endDateStr);
        const startDate = moment(startDateStr, $scope.$parent.CONVERSION_DATE_FORMAT).toDate('L');
        const endDate = moment(endDateStr, $scope.$parent.CONVERSION_DATE_FORMAT).toDate('L');

        const remainingDays = {};
        const totalDaysWeekCount = {};
        weekdays.forEach(day => {
            remainingDays[day] = 0;
            totalDaysWeekCount[day] = 0;
        });

        let totalDays = 0;
        for (let date = ent_start_date; date <= ent_end_date; date.setDate(date.getDate() + 1)) {
            let dayOfWeek = date.getDay();
            if (weekdays.includes(date.getDay())) {
                totalDaysWeekCount[dayOfWeek]++;
                totalDays++;
            }
        }

        let totalRemainingDays = 0;
        for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
            let dayOfWeek = date.getDay();
            if (weekdays.includes(date.getDay())) {
                remainingDays[dayOfWeek]++;
                totalRemainingDays++;
            }
        }

        return { totalDays, remainingDays, totalRemainingDays, totalDaysWeekCount };
    }
    $scope.ADD_ENTITLEMENT_Fn = function () {
        $scope.EntitlementArray.push({
            HOLIDAY_ENTITLEMENT_PLAN: 'New Entitlement',
            EMPLOYEE_ABSENCE_ID: 0,
            HOLIDAY_ENTITLEMENT_ID: '',
            ABSENCE_EFFECTIVE_DATE: '',
            ANNUAL_ALLOWANCE: 0,
            ACCRUED: 0,
            ACTUAL_TAKEN: 0,
            DB_ACCRUED: 0,
            ADJUSTMENT: '',
            TAKEN: '',
            AVAILABLE_TILL_DATE: '',
            BOOKED: '',
            REMAINING_ANNUAL_BALANCE: 0,
            TOTAL_DAYS_WORKED: '',
            AVG_HOURS_WORKED: '',
            AVG_PAY: '',
            DELETE_FLAG: 0,
            ENTITLEMENT_DEFAULT_TEXT: $scope.DD_DefaultText,
            CUSTOM_ENTITLEMENT_NAME: $scope.DD_DefaultText,
            OLD_ENTITLEMENT_ACTIVE: 1,
        });

        $scope.$parent.$parent.DATE_INPUT_LOAD();
    };
    $scope.REMOVE_ENTITLEMENT_Fn = function (index) {
        if ($scope.EntitlementArray[index].EMPLOYEE_ABSENCE_ID > 0) {
            $scope.EntitlementArrayDeleted.push($scope.EntitlementArray[index]);
        }
        $scope.EntitlementArray.splice(index, 1);

    }
    $scope.HRM_GET_EMPLOYEE_ABSENCES();

    $scope.GET_OLD_ENTITLEMENT_Fn = function () {
        $scope.HRM_GET_EMPLOYEE_ABSENCES(1);
    }
    $(document).ready(function () {
        $(".TeammonthPicker").datepicker({
            format: "mm/yyyy",
            viewMode: "months",
            minViewMode: "months",
            autoclose: true,
            clearBtn: true,
            closeText: 'asd',
            onClose: function (dateText, inst) {
            },
            clearDate: function (dateText, inst) {
            }
        }).on("clearDate", function () {
            $scope.TeamLeaveFormSearch.FILTER_TEAM_SEARCH = "";
            $scope.TEAM_HRM_LEAVE_REQUEST_LIST(1);
        });;
    });
    // leave History
    $scope.TeamLeaveFormSearch = {
        CUSTOMER_ID: $cookies.get("CUSTOMER_ID"),
        EMPLY_PRSNL_ID: getUrlParameter('EMP_ID', $location.absUrl()),
        DD_DEFAULT_TEXT: 'Choose',
        CUSTOM_TEAM_STATUS_NAME: 'Choose',
        PAGE_NO: 1,
        UNITS_ID: 1,
        PAGE_SIZE: 10,
        FILTER_DATE: '',
    }
    $scope.SELF_ABSENCE_TYPES_FOR_EMPLOYEE_LEAVE_LIST = [];
    $scope.TEAM_ABSENCE_TYPES_FOR_EMPLOYEE_LEAVE_LIST = [];
    $scope.STATUS_LIST = [{ STATUS_ID: 86, STATUS_NAME: "Pending" },
    { STATUS_ID: 87, STATUS_NAME: "Approved" }, { STATUS_ID: 88, STATUS_NAME: "Rejected" }, { STATUS_ID: 89, STATUS_NAME: "Cancelled" }, { STATUS_ID: 90, STATUS_NAME: "Auto Approved" }]
    $scope.CANCEL_LEAVE_POP_Fn = function (_leave_details) {
        $scope.SELECTED_LEAVE_DETAILS = _leave_details;
        $('#Reject_Leave').modal('show');
    };
    $scope.LEAVE_TAB = 1;
    $scope.HRM_GET_ABSENCE_TYPES_FOR_EMPLOYEE_LEAVE = function (CLICK_FLAG) {
        var LeaveModelObj = new Object();
        LeaveModelObj.CUSTOMER_ID = $cookies.get("CUSTOMER_ID");
        if (CLICK_FLAG == undefined || CLICK_FLAG == "LOAD_ABSENCE") {
            LeaveModelObj.STANDARD_ROLE_ID_11 = $scope.$parent.$parent.CheckStandardRoleAccess(11) ? 1 : 0;
        }
        if ($scope.LEAVE_TAB == 1) {
            $scope.SELF_ABSENCE_TYPES_FOR_EMPLOYEE_LEAVE_LIST = [];
            LeaveModelObj.EMPLY_PRSNL_ID = $scope.TeamLeaveFormSearch.EMPLY_PRSNL_ID; // self leave 
        }
        else if ($scope.LEAVE_TAB == 2) {
            $scope.TEAM_ABSENCE_TYPES_FOR_EMPLOYEE_LEAVE_LIST = [];
            LeaveModelObj.EMPLY_PRSNL_ID = $scope.TeamLeaveFormSearch.EMPLY_PRSNL_ID;// for tab 2 team leave 
        }
        LeaveModelObj.FLAG = 2;
        PrcCommMethods.HUMANRESOURCE_API(LeaveModelObj, 'HRM_GET_ABSENCE_TYPES_FOR_EMPLOYEE_LEAVE').then(function (data) {
            if (data.data.Table.length > 0) {
                if ($scope.LEAVE_TAB == 1) {
                    $scope.SELF_ABSENCE_TYPES_FOR_EMPLOYEE_LEAVE_LIST = data.data.Table;
                }
                else if ($scope.LEAVE_TAB == 2) {
                    if (CLICK_FLAG == "LOAD_ABSENCE") {
                        $scope.SELF_ABSENCE_TYPES_FOR_EMPLOYEE_LEAVE_LIST = data.data.Table;
                    }
                    else {
                        $scope.TEAM_ABSENCE_TYPES_FOR_EMPLOYEE_LEAVE_LIST = data.data.Table;
                        $scope.TEAM_HRM_LEAVE_REQUEST_LIST(1);
                    }
                }
            }
        });
    }
    $scope.HRM_GET_ABSENCE_TYPES_FOR_EMPLOYEE_LEAVE_EDIT = function (_leave) {
        $scope.EDIT_ABSENCE_TYPES_FOR_EMPLOYEE_LEAVE_LIST = [];
        var LeaveModelObj = new Object();
        LeaveModelObj.CUSTOMER_ID = $cookies.get("CUSTOMER_ID");
        LeaveModelObj.STANDARD_ROLE_ID_11 = $scope.$parent.$parent.CheckStandardRoleAccess(11) || $scope.$parent.$parent.CheckStandardRoleAccess(1) || $scope.$parent.$parent.CheckStandardRoleAccess(6) ? 1 : 0;
        LeaveModelObj.EMPLY_PRSNL_ID = _leave.EMPLY_PRSNL_ID;
        LeaveModelObj.FLAG = 2;
        PrcCommMethods.HUMANRESOURCE_API(LeaveModelObj, 'HRM_GET_ABSENCE_TYPES_FOR_EMPLOYEE_LEAVE').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.EDIT_ABSENCE_TYPES_FOR_EMPLOYEE_LEAVE_LIST = data.data.Table;
            };
        });
    }
    $scope.HRM_LEAVE_REQUEST_BY_ID = function (_leaveSearch, _click_flag) {
        if (_leaveSearch.ABSENCE_TYPE_ID > 0 && (_leaveSearch.START_DATE != undefined && _leaveSearch.START_DATE != "" && _leaveSearch.START_DATE != null) && (_leaveSearch.END_DATE != undefined && _leaveSearch.END_DATE != "" && _leaveSearch.END_DATE != null)) {
            var leaveObject = new Object();
            leaveObject.LEAVE_REQUEST_ID = _leaveSearch.LEAVE_REQUEST_ID;
            leaveObject.ENTITY_ID = $cookies.get("ENTITY_ID");
            leaveObject.VIEWER_EMPLY_PRSNL_ID = $cookies.get("EMPLY_PRSNL_ID");
            if (_click_flag == 'GIRD_CLICK') {
                leaveObject.EMPLY_PRSNL_ID = _leaveSearch.EMPLY_PRSNL_ID;
            }
            else {
                leaveObject.EMPLY_PRSNL_ID = _leaveSearch.DDL_EMPLOYEE_ID;
            }
            leaveObject.CUSTOMER_ID = $cookies.get("CUSTOMER_ID");
            leaveObject.ABSENCE_TYPE_ID = _leaveSearch.ABSENCE_TYPE_ID;

            //leaveObject.START_DATE = _leaveSearch.START_DATE;
            //leaveObject.END_DATE = _leaveSearch.END_DATE;

            leaveObject.START_DATE = moment(_leaveSearch.START_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).format('L');
            leaveObject.END_DATE = moment(_leaveSearch.END_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).format('L');

            leaveObject.HRM_LEAVE_REQUEST_LINE_TYPE = [];
            //HRM_LEAVE_REQUEST_LINE_TYPE_TEAM and My same array 
            angular.forEach(_leaveSearch.HRM_LEAVE_REQUEST_LINE_TYPE_TEAM, function (_loop_value) {
                var readonly = new Object()
                readonly.LEAVE_DATE = _loop_value.LEAVE_DATE;
                readonly.DURATION = _loop_value.DURATION;
                readonly.HOLIDAY_ENTITLEMENT_ID = _loop_value.HOLIDAY_ENTITLEMENT_ID;
                readonly.EMPLOYEE_ABSENCE_ID = _loop_value.EMPLOYEE_ABSENCE_ID;
                readonly.HOLIDAY_CALENDAR_LINE_ID = _loop_value.HOLIDAY_CALENDAR_LINE_ID;
                readonly.EVENT_NAME = _loop_value.EVENT_NAME;
                readonly.NON_WORKING_DAY_BY_WORK_PATTERN = _loop_value.NON_WORKING_DAY_BY_WORK_PATTERN;
                readonly.IGNORE = _loop_value.IGNORE;
                readonly.ORIGINAL_DURATION = _loop_value.ORIGINAL_DURATION;
                leaveObject.HRM_LEAVE_REQUEST_LINE_TYPE.push(readonly);
            });
            if (leaveObject.HRM_LEAVE_REQUEST_LINE_TYPE.length == 0) {
                var readonly = new Object()
                readonly.LEAVE_DATE = null;
                readonly.DURATION = null;
                readonly.HOLIDAY_ENTITLEMENT_ID = null;
                readonly.EMPLOYEE_ABSENCE_ID = null;
                readonly.HOLIDAY_CALENDAR_LINE_ID = null;
                readonly.EVENT_NAME = null;
                readonly.NON_WORKING_DAY_BY_WORK_PATTERN = null;
                readonly.IGNORE = null;
                readonly.ORIGINAL_DURATION = null;
                leaveObject.HRM_LEAVE_REQUEST_LINE_TYPE.push(readonly);
            };
            PrcCommMethods.HUMANRESOURCE_API(leaveObject, 'HRM_LEAVE_REQUEST_BY_ID').then(function (data) {
                _leaveSearch.LEAVE_REQUEST_BY_ID = [];
                _leaveSearch.EMPLOYEE_LIST_TEAM = [];
                _leaveSearch.LEAVE_REQUEST_BY_ID = data.data.Table1;
                _leaveSearch.EMPLOYEE_LIST_TEAM = data.data.Table3;
                _leaveSearch.DURATION_LIST = data.data.Table1;
                _leaveSearch.EMPLOYEE_ABSENCES_COUNT_LIST_TEAM = angular.copy($scope.EMPLOYEE_ABSENCES_COUNT_LIST_TEAM);
                $scope.generateCalendarForGridMyTeam(_leaveSearch);
                if (data.data.Table2.length > 0) {
                    _leaveSearch.EMPLOYEE_ABSENCES_COUNT_LIST_TEAM = data.data.Table2[0];
                };

                if (_click_flag == 'GIRD_CLICK' || _click_flag == 'APPROVED_CLICK') {
                    _leaveSearch.DURATION_LIST = data.data.Table1;
                    $scope.generateCalendarForGridMyTeam(_leaveSearch);
                    if (_click_flag == 'APPROVED_CLICK') {
                        $scope.SELECTED_LEAVE_DETAILS = _leaveSearch;
                        $scope.SELECTED_LEAVE_DETAILS.SELECTED_DURATION = angular.copy(_leaveSearch.DURATION);
                        $scope.SELECTED_LEAVE_DETAILS.CUSTOM_ABSENCE_TYPE = _leaveSearch.ABSENCE_TYPE;
                        $scope.SELECTED_LEAVE_DETAILS.CUSTOM_ABSENCE_TYPE_ID = _leaveSearch.ABSENCE_TYPE_ID;
                        $scope.SELECTED_LEAVE_DETAILS.CUSTOM_UNITS_ID = _leaveSearch.UNITS_ID;
                        $('#Approve_Leave').modal('show');
                    };
                };


            });
        }
    };
    $scope.LAZY_LOAD_TEAM_LEAVE_REQUEST_LIST = function () {
        $scope.TEAM_HRM_LEAVE_REQUEST_LIST();
    }
    $scope.OPEN_LEAVE_DETAIL_Fn = function (_team_leave) {
        _team_leave.SHOW_HIDE = !_team_leave.SHOW_HIDE;
        $scope.HRM_LEAVE_REQUEST_BY_ID(_team_leave, 'GIRD_CLICK');
        if (_team_leave.UPLOAD_IDS != "") {
            $scope.$parent.GET_UPLOADS(_team_leave, 50, _team_leave.LEAVE_REQUEST_ID);
        }
        else {
            _team_leave.UploadedFiles = [];
        }
    };
    $scope.TEAM_HRM_LEAVE_REQUEST_LIST = function (FLAG) {
        if (FLAG == 1) {
            $scope.LOAD_FETCH_TEXT = 'Fetching records';
            $scope.TeamLeaveFormSearch.PAGE_NO = 1;
            $scope.TEAM_LEAVE_REQUEST_LIST = [];
        }
        var LeaveListObject = new Object();
        LeaveListObject.FLAG = 1;
        LeaveListObject.EMPLY_PRSNL_ID = getUrlParameter('EMP_ID', $location.absUrl());
        LeaveListObject.ABSENCE_TYPE_ID = $scope.TeamLeaveFormSearch.FILTER_ABSENCE_TYPE_ID; // 0 for all 
        LeaveListObject.STATUS_ID = $scope.TeamLeaveFormSearch.STATUS_ID; // 0 for all
        LeaveListObject.CUSTOMER_ID = $cookies.get("CUSTOMER_ID");
        LeaveListObject.ENTITY_ID = $cookies.get("ENTITY_ID");
        LeaveListObject.SEARCH = $scope.TeamLeaveFormSearch.FILTER_TEAM_SEARCH;
        LeaveListObject.MONTH = $scope.TeamLeaveFormSearch.FILTER_DATE == "" || $scope.TeamLeaveFormSearch.FILTER_DATE == null || $scope.TeamLeaveFormSearch.FILTER_DATE == undefined ? 0 : $scope.TeamLeaveFormSearch.FILTER_DATE.split('/')[0];
        LeaveListObject.YEAR = $scope.TeamLeaveFormSearch.FILTER_DATE == "" || $scope.TeamLeaveFormSearch.FILTER_DATE == null || $scope.TeamLeaveFormSearch.FILTER_DATE == undefined ? 0 : $scope.TeamLeaveFormSearch.FILTER_DATE.split('/')[1];
        LeaveListObject.STANDARD_ROLE_ID_11 = 0;
        LeaveListObject.PAGE_NO = $scope.TeamLeaveFormSearch.PAGE_NO;
        LeaveListObject.PAGE_SIZE = $scope.TeamLeaveFormSearch.PAGE_SIZE;
        PrcCommMethods.HUMANRESOURCE_API(LeaveListObject, 'HRM_LEAVE_REQUEST_LIST').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.$parent.overlay_loadingNew = 'none';
                $scope.TEAM_LEAVE_REQUEST_LIST = $scope.TEAM_LEAVE_REQUEST_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.TeamLeaveFormSearch.PAGE_SIZE) {
                    $scope.GetDataTeam = false;
                }
                else {
                    $scope.TeamLeaveFormSearch.PAGE_NO = parseInt($scope.TeamLeaveFormSearch.PAGE_NO) + 1;
                    $scope.GetDataTeam = true;
                };

            }
            else {
                if ($scope.TEAM_LEAVE_REQUEST_LIST.length == 0) {
                    $scope.LOAD_FETCH_TEXT = 'No records found';
                };
                $scope.GetDataTeam = false;
                $scope.$parent.overlay_loadingNew = 'none';
            };
        });
    };
    $scope.APPROVE_LEAVE_POP_Fn = function (_leave_details) {
        $scope.HRM_GET_ABSENCE_TYPES_FOR_EMPLOYEE_LEAVE_EDIT(_leave_details);
        $scope.HRM_LEAVE_REQUEST_BY_ID(_leave_details, 'APPROVED_CLICK') // call both duration and by id 
    };
    $scope.REJECT_LEAVE_POP_Fn = function (_leave_details) {
        $scope.SELECTED_LEAVE_DETAILS = _leave_details;
        $scope.AUTO_APPROVED_FLAG = false;
        if ($scope.SELECTED_LEAVE_DETAILS.STATUS_ID == 90) {
            if (new Date($scope.SELECTED_LEAVE_DETAILS.START_DATE) < new Date()) {
                $scope.AUTO_APPROVED_FLAG = true;
            }
        }
        $('#Reject_Leave').modal('show');
    };
    $scope.CANCEL_LEAVE_POP_Fn = function (_leave_details) {
        $scope.SELECTED_LEAVE_DETAILS = _leave_details;
        $scope.AUTO_APPROVED_FLAG = false;
        $('#Cancel_Leave').modal('show');
    };
    $scope.SELECTED_FILTER_ABSENCE_TYPE_TEAM_Fn = function (_absence) {
        if (_absence == '') {
            $scope.TeamLeaveFormSearch.CUSTOM_FILFTER_TEAM_ABSENCE_TYPE_NAME = $scope.TeamLeaveFormSearch.DD_DEFAULT_TEXT;
            $scope.TeamLeaveFormSearch.FILTER_ABSENCE_TYPE_ID = 0;
            $scope.TEAM_HRM_LEAVE_REQUEST_LIST(1);
        }
        else {
            $scope.TeamLeaveFormSearch.CUSTOM_FILFTER_TEAM_ABSENCE_TYPE_NAME = _absence.ABSENCE_TYPE;
            $scope.TeamLeaveFormSearch.FILTER_ABSENCE_TYPE_ID = _absence.ABSENCE_TYPE_ID;
            $scope.TEAM_HRM_LEAVE_REQUEST_LIST(1);
        }
    }
    $scope.SELECTED_TEAM_STATUS_Fn = function (_status) {
        if (_status == '') {
            $scope.TeamLeaveFormSearch.CUSTOM_TEAM_STATUS_NAME = $scope.TeamLeaveFormSearch.DD_DEFAULT_TEXT;
            $scope.TeamLeaveFormSearch.STATUS_ID = 0;
            $scope.TEAM_HRM_LEAVE_REQUEST_LIST(1);
        }
        else {
            $scope.TeamLeaveFormSearch.CUSTOM_TEAM_STATUS_NAME = _status.STATUS_NAME;
            $scope.TeamLeaveFormSearch.STATUS_ID = _status.STATUS_ID;
            $scope.TEAM_HRM_LEAVE_REQUEST_LIST(1);
        }
    }
    $scope.HRM_LEAVE_APP_REJ_LEAVE_REQUESTS = function (STATUS_ID) {
        var LeaveModelObj = new Object();
        LeaveModelObj.LEAVE_REQ_ID = $scope.SELECTED_LEAVE_DETAILS.LEAVE_REQUEST_ID;
        LeaveModelObj.STATUS_ID = STATUS_ID;
        LeaveModelObj.EMPLY_PRSNL_ID = parseInt($cookies.get("EMPLY_PRSNL_ID"));
        LeaveModelObj.APP_REJ_COMMENTS = $scope.SELECTED_LEAVE_DETAILS.COMMENTS;
        LeaveModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.HUMANRESOURCE_API(LeaveModelObj, 'HRM_LEAVE_APP_REJ_LEAVE_REQUESTS').then(function (data) {
            if (data.data == 1) {
                $('#Reject_Leave').modal('hide');
                $scope.$parent.ShowAlertBox("Success", "Leave cancel successfully", 3000);
                $scope.TEAM_HRM_LEAVE_REQUEST_LIST(1);
            }
            if (data.data == 0) {

            }
        });
    }

    $scope.DATE_FILTER_CHANGE_Fn = function (FILTER_FLAG) {
        if (FILTER_FLAG == 1 && ($scope.MyLeaveFormSearch.FILTER_DATE != undefined && $scope.MyLeaveFormSearch.FILTER_DATE != "" && $scope.MyLeaveFormSearch.FILTER_DATE != null)) {
            $scope.MY_HRM_LEAVE_REQUEST_LIST(1);
        }
        else if (FILTER_FLAG == 2 && ($scope.TeamLeaveFormSearch.FILTER_DATE != undefined && $scope.TeamLeaveFormSearch.FILTER_DATE != "" && $scope.TeamLeaveFormSearch.FILTER_DATE != null)) {
            $scope.TEAM_HRM_LEAVE_REQUEST_LIST(1);
        };
    };
    $scope.SELECTED_FILTER_ABSENCE_TYPE_TEAM_Fn('');
    $scope.HRM_GET_ABSENCE_TYPES_FOR_EMPLOYEE_LEAVE();

    ////////////////////////////History upcoming update//////////
    $scope.EFFECTIVE_TAB_Fn = function (FLAG) {
        $scope.EFFECTIVE_TAB = FLAG;
    };
    $scope.EFFECTIVE_TAB_Fn(1);
    $scope.EMPLOYEE_GET_UPCOMING_UPDATES_LIST = [];
    $scope.LAZY_LOAD_HRM_GET_EMPLOYEE_HISTORY_HEADERS = function () {
        $scope.HRM_GET_EMPLOYEE_HISTORY_HEADERS();
    }
    $scope.HRM_GET_EMPLOYEE_HISTORY_HEADERS = function (FLAG) {
        if (FLAG == 1) {
            $scope.AbsenceSearch.PAGE_NO = 1;
            $scope.EMPLOYEE_HISTORY_HEADERS_LIST = [];
        }

        var EfftInfoObject = new Object();
        EfftInfoObject.EMPLY_PRSNL_ID = getUrlParameter('EMP_ID', $location.absUrl());
        EfftInfoObject.PAGE_NO = $scope.AbsenceSearch.PAGE_NO;
        EfftInfoObject.PAGE_SIZE = $scope.AbsenceSearch.PAGE_SIZE;
        EfftInfoObject.STEP_NO = $scope.AbsenceSearch.STEP_NO;
        PrcCommMethods.HUMANRESOURCE_API(EfftInfoObject, 'HRM_GET_EMPLOYEE_HISTORY_HEADERS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.EMPLOYEE_HISTORY_HEADERS_LIST = $scope.EMPLOYEE_HISTORY_HEADERS_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.AbsenceSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.AbsenceSearch.PAGE_NO = parseInt($scope.AbsenceSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else {
                if ($scope.EMPLOYEE_HISTORY_HEADERS_LIST.length == 0) {
                    $scope.LOAD_FETCH_TEXT = 'No records yet!';
                }
                $scope.GetData = false;
                $scope.$parent.overlay_loadingNew = 'none';
            };
        });
    }
    $scope.HRM_EMPLOYEE_GET_UPCOMING_UPDATES = function () {
        var EfftInfoObject = new Object();
        EfftInfoObject.EMPLY_PRSNL_ID = getUrlParameter('EMP_ID', $location.absUrl());
        EfftInfoObject.ENTITY_ID = $cookies.get("ENTITY_ID");
        EfftInfoObject.STEP_NO = $scope.AbsenceSearch.STEP_NO;;
        PrcCommMethods.HUMANRESOURCE_API(EfftInfoObject, 'HRM_EMPLOYEE_GET_UPCOMING_UPDATES').then(function (data) {
            if (data.data.Table.length > 0) {

                $scope.EMPLOYEE_GET_UPCOMING_UPDATES_LIST = data.data.Table;
            } else {
                $scope.EMPLOYEE_GET_UPCOMING_UPDATES_LIST = [];
                $scope.LOAD_FETCH_TEXT = 'No records yet!';
            }
        });
    };
    $scope.HRM_GET_EMPLOYEE_HISTORY_DETAILS = function (_history) {
        $scope.IS_HISTORY = true;
        var EmploymentInfoObject = new Object();
        EmploymentInfoObject.HISTORY_HEADER_ID = _history.HISTORY_HEADER_ID
        EmploymentInfoObject.STEP_NO = $scope.STEP_FLAG;
        EmploymentInfoObject.EMPLY_PRSNL_ID = getUrlParameter('EMP_ID', $location.absUrl());;
        PrcCommMethods.HUMANRESOURCE_API(EmploymentInfoObject, 'HRM_GET_EMPLOYEE_HISTORY_DETAILS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.OLD_DATA = {};
                $scope.OLD_DATA.EntitlementArray = angular.copy(data.data.Table);
                $scope.NEW_DATA = {};
                $scope.NEW_DATA.EntitlementArray = data.data.Table1;

                $scope.SELECTED_UPDATE = _history;
                //$scope.OLD_DATA = angular.copy(data.data.Table[0]);
                //if (data.data.Table1.length > 0) {
                //    $scope.NEW_DATA = data.data.Table1[0];
                //}
            }
            $('#History_pop').modal('show');
        });
    }

    $scope.PROCEED_POP_Fn = function (_updates) {
        $scope.SELECTED_UPDATE = _updates;
        $('#Process_pop').modal('show');
    }
    $scope.DISCARD_POP_Fn = function (_updates) {
        $scope.SELECTED_UPDATE = _updates;
        $('#Discard_pop').modal('show');
    }
    $scope.HRM_EMPLOYEE_GET_UPCOMING_UPDATE_DETAILS = function (_tabledtls) {
        $scope.IS_HISTORY = false;
        var EfftInfoObject = new Object();
        EfftInfoObject.UPDATE_TABLE_ID = _tabledtls.UPDATE_TABLE_ID;
        EfftInfoObject.STEP_NO = $scope.AbsenceSearch.STEP_NO;
        PrcCommMethods.HUMANRESOURCE_API(EfftInfoObject, 'HRM_EMPLOYEE_GET_UPCOMING_UPDATE_DETAILS').then(function (data) {
            if (data.data.Table.length > 0) {
                _tabledtls.UPCOMING_DETAILS = data.data.Table;
                //$scope.OLD_DATA = angular.copy($scope.AbsenceSearch);// In upcoming case ;
                //$scope.NEW_DATA = data.data.Table[0];
                $scope.OLD_DATA = {};
                $scope.OLD_DATA.EntitlementArray = angular.copy($scope.EntitlementArray);
                $scope.NEW_DATA = {};
                $scope.NEW_DATA.EntitlementArray = data.data.Table;

                $scope.SELECTED_UPDATE = _tabledtls;
                $('#History_pop').modal('show');
            }
            else {
                _tabledtls.UPCOMING_DETAILS = [];
            }
        });
    };

    $scope.nginitHistoryentitlement = function (_absence, index) {
        _absence.NEW_DATA = $scope.NEW_DATA.EntitlementArray[index];

    };
    $scope.HRM_DISCARD_PENDING_UPDATES = function () {
        var EfftInfoObject = new Object();
        EfftInfoObject.UPDATE_TABLE_ID = $scope.SELECTED_UPDATE.UPDATE_TABLE_ID;
        EfftInfoObject.STEP_NO = $scope.AbsenceSearch.STEP_NO;;
        EfftInfoObject.DISCARD_COMMENTS = $scope.DISCARD_COMMENTS;
        PrcCommMethods.HUMANRESOURCE_API(EfftInfoObject, 'HRM_DISCARD_PENDING_UPDATES').then(function (data) {
            if (data.data == 1) {
                $scope.$parent.ShowAlertBox("Success", "Record discarded successfully", 3000);
                $('#Discard_pop').modal('hide');
                $scope.HRM_EMPLOYEE_GET_UPCOMING_UPDATES();
            }
            if (data.data == 0) {
                $scope.$parent.ShowAlertBox("Error", $scope.SOMETHINGWENTWRONG, 3000);
            }
        });
    };
    $scope.HRM_PROCESS_PENDING_UPDATES = function () {
        var EfftInfoObject = new Object();
        EfftInfoObject.UPDATE_TABLE_ID = $scope.SELECTED_UPDATE.UPDATE_TABLE_ID;
        EfftInfoObject.STEP_NO = $scope.AbsenceSearch.STEP_NO;;
        EfftInfoObject.DISCARD_COMMENTS = $scope.DISCARD_COMMENTS;
        PrcCommMethods.HUMANRESOURCE_API(EfftInfoObject, 'HRM_PROCESS_PENDING_UPDATES').then(function (data) {
            if (data.data == 1) {
                $scope.$parent.ShowAlertBox("Success", "Record processed successfully", 3000);
                $('#Process_pop').modal('hide');
                $scope.HRM_EMPLOYEE_GET_UPCOMING_UPDATES();
            }
            if (data.data == 0) {
                $scope.$parent.ShowAlertBox("Error", $scope.SOMETHINGWENTWRONG, 3000);
            }
        });
    }

    //$scope.GET_UTC_TIME = function () {
    //    var UserModelObj = new Object();
    //    UserModelObj.TIMEZONE_OFFSET = "00:00";
    //    PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'GET_UTC_TIME').then(function (data) {
    //        if (data.data != null) {
    //            $scope.CURRENT_DATE = new Date(data.data);
    //        }
    //        if ($scope.CURRENT_DATE == '') {
    //            $scope.CURRENT_DATE = new Date();
    //        }
    //    })
    //};
    // $scope.GET_UTC_TIME();
    $scope.HRM_EMPLOYEE_GET_UPCOMING_UPDATES();
    $scope.HRM_GET_EMPLOYEE_HISTORY_HEADERS(1);
    $scope.$parent.$parent.DATE_INPUT_LOAD();
});