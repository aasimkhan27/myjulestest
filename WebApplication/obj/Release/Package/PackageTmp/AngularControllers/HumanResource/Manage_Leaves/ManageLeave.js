app.controller('ManageLeaveController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $interval, $localStorage) {
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(2);
    $scope.HR_COMMON_CODE_Fn();
    $scope.MyLeaveFormSearch = {
        CUSTOMER_ID: $cookies.get("CUSTOMER_ID"),
        EMPLY_PRSNL_ID: $cookies.get("EMPLY_PRSNL_ID"),
        DD_DEFAULT_TEXT: 'Choose',
        PAGE_NO: 1,
        PAGE_SIZE: $scope.$parent.PAGE_SIZE,
        UNITS_ID: 1,
        CUSTOM_MY_FLITER_STATUS_NAME: 'Choose',
        IS_MULTI_FILE_UPLOAD_ALLOW: true,
        LEAVE_REQUEST_ID: 0,
        YEAR: 0,
        MONTH: 0,
        DISPLAY_EMPLOYEE_TEXT_SEARCH: '',
        START_DATE: null,
        END_DATE: null,
        ABSENCE_TYPE_ID: null,
    }
    $scope.TeamLeaveFormSearch = {
        CUSTOMER_ID: $cookies.get("CUSTOMER_ID"),
        EMPLY_PRSNL_ID: $cookies.get("EMPLY_PRSNL_ID"),
        DD_DEFAULT_TEXT: 'Choose',
        CUSTOM_TEAM_STATUS_NAME: 'Choose',
        PAGE_NO: 1,
        UNITS_ID: 1,
        PAGE_SIZE: $scope.$parent.PAGE_SIZE,
        IS_MULTI_FILE_UPLOAD_ALLOW: true,
        LEAVE_REQUEST_ID: 0,
        YEAR: 0,
        MONTH: 0,
        DISPLAY_EMPLOYEE_TEXT_SEARCH: '',
        START_DATE: null,
        END_DATE: null,
        ABSENCE_TYPE_ID: null,
    }
    $scope.HRM_LOCK_DATE_LIST = [];
    $scope.STATUS_LIST = [{ STATUS_ID: 86, STATUS_NAME: "Pending" },
    { STATUS_ID: 87, STATUS_NAME: "Approved" }, { STATUS_ID: 88, STATUS_NAME: "Rejected" }, { STATUS_ID: 89, STATUS_NAME: "Cancelled" }, { STATUS_ID: 90, STATUS_NAME: "Auto Approved" }]
    $scope.FISICAL_YEAR_MONTH = $scope.$parent.MASTER_GET_CUSTOMER_SETTINGS_VALUES(89);
    $scope.HRM_GET_EMPLOYEE_STEP = function () {
        var UserModelObj = new Object();
        UserModelObj.EMPLY_PRSNL_ID = $cookies.get("EMPLY_PRSNL_ID");
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'HRM_GET_EMPLOYEE_STEP').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.EMPLOYEEHEADERDETAILS = data.data.Table[0];
            }
        })
    }

    $scope.SELF_ABSENCE_TYPES_FOR_EMPLOYEE_LEAVE_LIST = [];
    $scope.TEAM_ABSENCE_TYPES_FOR_EMPLOYEE_LEAVE_LIST = [];

    $scope.HRM_GET_ABSENCE_TYPES_FOR_EMPLOYEE_LEAVE = function (CLICK_FLAG) {
        var LeaveModelObj = new Object();
        LeaveModelObj.CUSTOMER_ID = $cookies.get("CUSTOMER_ID");
        LeaveModelObj.STANDARD_ROLE_ID_11 = 0;
        if (CLICK_FLAG == undefined || CLICK_FLAG == "LOAD_ABSENCE") {
            LeaveModelObj.STANDARD_ROLE_ID_11 = $scope.$parent.$parent.CheckStandardRoleAccess(11) || $scope.$parent.$parent.CheckStandardRoleAccess(1) || $scope.$parent.$parent.CheckStandardRoleAccess(6) ? 1 : 0;
        }
        if ($scope.LEAVE_TAB == 1) {
            $scope.SELF_ABSENCE_TYPES_FOR_EMPLOYEE_LEAVE_LIST = [];
            LeaveModelObj.EMPLY_PRSNL_ID = $cookies.get("EMPLY_PRSNL_ID"); // self leave 
        }
        else if ($scope.LEAVE_TAB == 2) {
            $scope.TEAM_ABSENCE_TYPES_FOR_EMPLOYEE_LEAVE_LIST = [];
            LeaveModelObj.EMPLY_PRSNL_ID = $scope.TeamLeaveFormSearch.DDL_EMPLOYEE_ID;// for tab 2 team leave 
        }
        LeaveModelObj.FLAG = $scope.LEAVE_TAB;
        PrcCommMethods.HUMANRESOURCE_API(LeaveModelObj, 'HRM_GET_ABSENCE_TYPES_FOR_EMPLOYEE_LEAVE').then(function (data) {
            if (data.data.Table.length > 0) {
                if ($scope.LEAVE_TAB == 1) {
                    $scope.SELF_ABSENCE_TYPES_FOR_EMPLOYEE_LEAVE_LIST = data.data.Table;
                }
                else if ($scope.LEAVE_TAB == 2) {
                    if (CLICK_FLAG == "LOAD_ABSENCE") {
                        // $scope.SELF_ABSENCE_TYPES_FOR_EMPLOYEE_LEAVE_LIST = data.data.Table;
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
    $scope.HRM_GET_ABSENCE_TYPES = function () {
        var AbsenceObject = new Object();
        AbsenceObject.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        AbsenceObject.CUSTOMER_ID = $cookies.get("CUSTOMER_ID");
        PrcCommMethods.HUMANRESOURCE_API(AbsenceObject, 'HRM_GET_ABSENCE_TYPES').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.SELF_ABSENCE_TYPES_FOR_EMPLOYEE_LEAVE_LIST = data.data.Table;
            } else {
                $scope.SELF_ABSENCE_TYPES_FOR_EMPLOYEE_LEAVE_LIST = [];
            };
        });
    }
    //changeYear: true,
    //changeMonth: true,
    //yearRange: '1920:' + year,
    //defaultDate: new Date(year, d.getMonth(), d.getDay())
    $scope.nginit_absencecount = function (_absenceCount) {
        _absenceCount.SHOW_HIDE = true;
        _absenceCount.UNIT_NAME = $scope.$parent.RETURN_UNITS_DAYS(_absenceCount.UNITS_ID);
    }

    $scope.HRM_GET_EMPLOYEE_ABSENCES_COUNT = function () {
        var LeaveModelObj = new Object();
        LeaveModelObj.EMPLY_PRSNL_ID = $cookies.get("EMPLY_PRSNL_ID");
        LeaveModelObj.ENTITY_ID = $cookies.get("ENTITY_ID");
        LeaveModelObj.DATE = null;
        LeaveModelObj.ABSENCE_TYPE_ID = 0;
        PrcCommMethods.HUMANRESOURCE_API(LeaveModelObj, 'HRM_GET_EMPLOYEE_ABSENCES_COUNT').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.EMPLOYEE_ABSENCES_COUNT_LIST = data.data.Table;
            }
            else {
                $scope.EMPLOYEE_ABSENCES_COUNT_LIST = [];
            }
        });
    };
    $scope.HRM_GET_EMPLOYEE_ABSENCES_COUNT_MY_APPLY_LEAVE = function (_absence) {
        var LeaveModelObj = new Object();
        LeaveModelObj.EMPLY_PRSNL_ID = $cookies.get("EMPLY_PRSNL_ID");
        LeaveModelObj.ENTITY_ID = $cookies.get("ENTITY_ID");
        LeaveModelObj.DATE = null;
        LeaveModelObj.ABSENCE_TYPE_ID = _absence.ABSENCE_TYPE_ID;
        PrcCommMethods.HUMANRESOURCE_API(LeaveModelObj, 'HRM_GET_EMPLOYEE_ABSENCES_COUNT').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.EMPLOYEE_ABSENCES_COUNT_MY_APPLY_LEAVE_DETAILS = data.data.Table[0];
            }
            else {
                $scope.EMPLOYEE_ABSENCES_COUNT_MY_APPLY_LEAVE_DETAILS = {
                };
            }
        });
    };

    $scope.EMPLOYEE_ABSENCES_COUNT_LIST_TEAM = {
        ANNUAL_ALLOWANCE: 0,
        AVAILABLE_TILL_DATE: 0,
        CALCULATED_ACCRUED: 0,
        BOOKED: 0,
        BOOKED_APPROVED: 0,
        BOOKED_PENDING: 0,
        REMAINING_BALANCE: 0,
    };
    $scope.HRM_GET_EMPLOYEE_ABSENCES_COUNT_TEAM = function () {
        var LeaveModelObj = new Object();
        LeaveModelObj.EMPLY_PRSNL_ID = $scope.TeamLeaveFormSearch.DDL_EMPLOYEE_ID;
        LeaveModelObj.ENTITY_ID = $cookies.get("ENTITY_ID");
        LeaveModelObj.DATE = null;
        LeaveModelObj.ABSENCE_TYPE_ID = $scope.TeamLeaveFormSearch.ABSENCE_TYPE_ID;

        PrcCommMethods.HUMANRESOURCE_API(LeaveModelObj, 'HRM_GET_EMPLOYEE_ABSENCES_COUNT').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.EMPLOYEE_ABSENCES_COUNT_LIST_TEAM = data.data.Table[0];
            }
            else {
                $scope.EMPLOYEE_ABSENCES_COUNT_LIST_TEAM = {
                    AVAILABLE_TILL_DATE: 0,
                    ANNUAL_ALLOWANCE: 0,
                    CALCULATED_ACCRUED: 0,
                    BOOKED: 0,
                    BOOKED_APPROVED: 0,
                    BOOKED_PENDING: 0,
                    REMAINING_BALANCE: 0,
                };
            }
        });
    };
    $scope.EDIT_HRM_GET_EMPLOYEE_ABSENCES_COUNT = function (_leave) {
        _leave.EMPLOYEE_ABSENCES_COUNT_LIST_TEAM = {
            AVAILABLE_TILL_DATE: 0,
            ANNUAL_ALLOWANCE: 0,
            CALCULATED_ACCRUED: 0,
            BOOKED: 0,
            BOOKED_APPROVED: 0,
            BOOKED_PENDING: 0,
            REMAINING_BALANCE: 0,
        };
        var LeaveModelObj = new Object();
        LeaveModelObj.EMPLY_PRSNL_ID = _leave.EMPLY_PRSNL_ID;
        LeaveModelObj.ENTITY_ID = $cookies.get("ENTITY_ID");
        LeaveModelObj.DATE = null;
        LeaveModelObj.ABSENCE_TYPE_ID = _leave.ABSENCE_TYPE_ID;
        PrcCommMethods.HUMANRESOURCE_API(LeaveModelObj, 'HRM_GET_EMPLOYEE_ABSENCES_COUNT').then(function (data) {
            if (data.data.Table.length > 0) {
                _leave.EMPLOYEE_ABSENCES_COUNT_LIST_TEAM = data.data.Table[0];
            }
            else {
                _leave.EMPLOYEE_ABSENCES_COUNT_LIST_TEAM = {
                    AVAILABLE_TILL_DATE: 0,
                    ANNUAL_ALLOWANCE: 0,
                    CALCULATED_ACCRUED: 0,
                    BOOKED: 0,
                    BOOKED_APPROVED: 0,
                    BOOKED_PENDING: 0,
                    REMAINING_BALANCE: 0,
                };
            }
        });
    };
    $scope.HRM_CHECK_ALREADY_TAKEN_LEAVE = function () {
        var LeaveModelObj = new Object();
        LeaveModelObj.EMPLY_PRSNL_ID = $scope.LEAVE_TAB == 1 ? $cookies.get("EMPLY_PRSNL_ID") : $scope.MyLeaveFormSearch.SELECTED_EMPLY_PRSNL_ID;
        LeaveModelObj.START_DATE = $scope.MyLeaveFormSearch.START_DATE;
        LeaveModelObj.END_DATE = $scope.MyLeaveFormSearch.END_DATE;
        LeaveModelObj.CUSTOMER_ID = $scope.MyLeaveFormSearch.CUSTOMER_ID;
        PrcCommMethods.HUMANRESOURCE_API(LeaveModelObj, 'HRM_CHECK_ALREADY_TAKEN_LEAVE').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.CHECK_ALREADY_TAKEN_LEAVE_LIST = data.data.Table;
            }
        });
    }
    $scope.isMyProcessing = false;
    $scope.calendar = [];

    function isSameDay(date1, date2) {
        const d1 = new Date(date1);
        const d2 = new Date(date2);

        d1.setHours(0, 0, 0, 0);
        d2.setHours(0, 0, 0, 0);

        return d1.getTime() === d2.getTime();
    }

    $scope.calendarMonths = [];
    $scope.generateCalendar = function () {
        $scope.calendarMonths = [];
        if (!$scope.MyLeaveFormSearch.START_DATE || !$scope.MyLeaveFormSearch.END_DATE) return;
        let start = new Date(moment($scope.MyLeaveFormSearch.START_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate('L'));
        let end = new Date(moment($scope.MyLeaveFormSearch.END_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate('L'));
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);

        // Start from the first day of the first month
        let current = new Date(start.getFullYear(), start.getMonth(), 1);
        var count = 0;
        while (current <= end) {
            $scope.minDate = new Date(start);
            $scope.maxDate = new Date(end);
            var monthStart
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
                    dayreadOnly.SELECTED_DURATION = false;
                    var _day_duration = $scope.HRM_LEAVE_REQUEST_LINE_TYPE.filter(function (x) { return isSameDay(x.LEAVE_DATE, gridStart) })
                    if (_day_duration.length > 0) {
                        dayreadOnly.DURATION = _day_duration[0].DURATION;
                        dayreadOnly.SELECTED_DURATION = _day_duration[0].DURATION > 0 ? true : false;
                    }
                    weekreadonly.days.push(dayreadOnly);
                    gridStart.setDate(gridStart.getDate() + 1);
                }
                weeks.push(weekreadonly);
            }

            $scope.calendarMonths.push({
                monthIndex: monthStart.getMonth(),
                monthName: monthStart.toLocaleString('default', { month: 'long', year: 'numeric' }),
                weeks: weeks
            });
            // Move to next month
            current.setMonth(current.getMonth() + 1);
        }
        console.log($scope.calendarMonths);
    };
    $scope.calendarMonthsTeam = [];
    $scope.generateCalendarTeam = function () {
        $scope.calendarMonthsTeam = [];
        if (!$scope.TeamLeaveFormSearch.START_DATE || !$scope.TeamLeaveFormSearch.END_DATE) return;
        let start = new Date(moment($scope.TeamLeaveFormSearch.START_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate('L'));
        let end = new Date(moment($scope.TeamLeaveFormSearch.END_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate('L'));
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);

        // Start from the first day of the first month
        let current = new Date(start.getFullYear(), start.getMonth(), 1);
        var count = 0;
        while (current <= end) {
            $scope.TeamminDate = new Date(start);
            $scope.TeammaxDate = new Date(end);
            var monthStart
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
                    dayreadOnly.SELECTED_DURATION = false;
                    var _day_duration = $scope.HRM_LEAVE_REQUEST_LINE_TYPE_TEAM.filter(function (x) { return isSameDay(x.LEAVE_DATE, gridStart) })
                    if (_day_duration.length > 0) {
                        dayreadOnly.DURATION = _day_duration[0].DURATION;
                        dayreadOnly.SELECTED_DURATION = _day_duration[0].DURATION > 0 ? true : false;
                    }
                    weekreadonly.days.push(dayreadOnly);
                    gridStart.setDate(gridStart.getDate() + 1);
                }
                weeks.push(weekreadonly);
            }

            $scope.calendarMonthsTeam.push({
                monthIndex: monthStart.getMonth(),
                monthName: monthStart.toLocaleString('default', { month: 'long', year: 'numeric' }),
                weeks: weeks
            });
            // Move to next month
            current.setMonth(current.getMonth() + 1);
        }
        console.log($scope.calendarMonthsTeam);
    };
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



    $scope.generateCalendarold = function () {
        $scope.calendar = [];
        if (!$scope.MyLeaveFormSearch.START_DATE || !$scope.MyLeaveFormSearch.END_DATE) return;
        let start = new Date(moment($scope.MyLeaveFormSearch.START_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate('L'));
        let end = new Date(moment($scope.MyLeaveFormSearch.END_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate('L'));
        //const start = new Date($scope.startDate);
        //const end = new Date($scope.endDate);

        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);

        $scope.minDate = new Date(start);
        $scope.maxDate = new Date(end);

        // Align to Monday
        const gridStart = new Date(start);
        const startDay = gridStart.getDay();
        const startOffset = (startDay === 0) ? 6 : startDay - 1;
        gridStart.setDate(gridStart.getDate() - startOffset);

        // Align to Sunday
        const gridEnd = new Date(end);
        const endDay = gridEnd.getDay();
        const endOffset = (7 - endDay) % 7;
        gridEnd.setDate(gridEnd.getDate() + endOffset);

        let current = new Date(gridStart);
        let lastMonth = null;
        var Weekcount = 0;
        while (current <= gridEnd) {
            let week = [];
            // Detect new month header
            const weekMonth = current.getMonth();
            const weekYear = current.getFullYear();
            const monthKey = weekYear + '-' + weekMonth;
            Weekcount++;
            if (monthKey !== lastMonth) {
                lastMonth = monthKey;
                $scope.calendar.push({
                    type: 'header',
                    label: current.toLocaleString('default', { month: 'long', year: 'numeric' })
                });
            }

            for (let i = 0; i < 7; i++) {
                var readOnly = Object();
                readOnly.DATE_INDEX = i;
                readOnly.DATE = new Date(current);
                readOnly.DURATION = 0;
                readOnly.SELECTED_DURATION = false;
                var _day_duration = $scope.HRM_LEAVE_REQUEST_LINE_TYPE.filter(function (x) { return isSameDay(x.LEAVE_DATE, current) })
                if (_day_duration.length > 0) {
                    readOnly.DURATION = _day_duration[0].DURATION;
                    readOnly.SELECTED_DURATION = _day_duration[0].DURATION > 0 ? true : false;
                }
                week.push(readOnly);
                current.setDate(current.getDate() + 1);
            }

            $scope.calendar.push({
                type: 'week',
                days: week,
                WEEK_INDEX: Weekcount
            });
        }
    };
    $scope.calender_fn = function (week, index) {
        //   week.WEEK_INDEX = (index + 1)
    }
    $scope.calender_fn = function (week, index) {
        week.WEEK_INDEX = (index + 1)
    }
    $scope.HRM_GET_LEAVE_DURATION = async function () {
        if ($scope.isMyProcessing == false && $scope.MyLeaveFormSearch.ABSENCE_TYPE_ID > 0 && ($scope.MyLeaveFormSearch.START_DATE != undefined && $scope.MyLeaveFormSearch.START_DATE != "" && $scope.MyLeaveFormSearch.START_DATE != null) && ($scope.MyLeaveFormSearch.END_DATE != undefined && $scope.MyLeaveFormSearch.END_DATE != "" && $scope.MyLeaveFormSearch.END_DATE != null)) {
            $scope.isMyProcessing = true; // Set flag
            $scope.HRM_LEAVE_REQUEST_LINE_TYPE = [];
            $scope.MyLeaveFormSearch.DURATION = 0;
            var EmploymentInfoObject = new Object();
            EmploymentInfoObject.EMPLY_PRSNL_ID = $cookies.get("EMPLY_PRSNL_ID");
            EmploymentInfoObject.ENTITY_ID = $cookies.get("ENTITY_ID");
            EmploymentInfoObject.CUSTOMER_ID = $cookies.get("CUSTOMER_ID");
            EmploymentInfoObject.ABSENCE_TYPE_ID = $scope.MyLeaveFormSearch.ABSENCE_TYPE_ID;
            EmploymentInfoObject.START_DATE = $scope.START_DATE_COMPLETE_SEND;
            EmploymentInfoObject.END_DATE = $scope.END_DATE_COMPLETE_SEND;

            if ($scope.MyLeaveFormSearch.START_TIME == undefined || $scope.MyLeaveFormSearch.START_TIME == null
                || $scope.MyLeaveFormSearch.START_TIME == '' ||
                $scope.MyLeaveFormSearch.START_TIME == true || $scope.MyLeaveFormSearch.END_TIME == undefined || $scope.MyLeaveFormSearch.END_TIME == null || $scope.MyLeaveFormSearch.END_TIME == '' || $scope.MyLeaveFormSearch.END_TIME == true) {

                EmploymentInfoObject.START_DATE = moment($scope.MyLeaveFormSearch.START_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate('L');
                EmploymentInfoObject.END_DATE = moment($scope.MyLeaveFormSearch.END_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate('L');
                EmploymentInfoObject.END_DATE.setHours(23);
                EmploymentInfoObject.END_DATE.setMinutes(59);
                EmploymentInfoObject.END_DATE.setSeconds(0);

                EmploymentInfoObject.START_DATE = $scope.HRM_CHANGE_UTC_TIME_ZONE_Fn(EmploymentInfoObject.START_DATE);
                EmploymentInfoObject.END_DATE = $scope.HRM_CHANGE_UTC_TIME_ZONE_Fn(EmploymentInfoObject.END_DATE);

                //EmploymentInfoObject.START_DATE = $scope.HRM_CHANGE_TIME_ZONE_Fn(new Date(EmploymentInfoObject.START_DATE));
                //EmploymentInfoObject.END_DATE = $scope.HRM_CHANGE_TIME_ZONE_Fn(new Date(EmploymentInfoObject.END_DATE));
            }
            else {
                if ($scope.MyLeaveFormSearch.START_TIME != undefined && $scope.MyLeaveFormSearch.START_TIME != '' && $scope.MyLeaveFormSearch.START_TIME != null && $scope.MyLeaveFormSearch.START_TIME != true) {
                    var start = moment($scope.MyLeaveFormSearch.START_TIME).format('H:mm');
                    var end = moment($scope.MyLeaveFormSearch.END_TIME).format('H:mm');
                    var ST = start.split(':');
                    var ET = end.split(':');
                    const START_TIME = moment($scope.START_DATE_COMPLETE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate('L');
                    const END_TIME = moment($scope.END_DATE_COMPLETE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate('L');

                    if (ST.length > 0) {
                        //START_TIME.set({ hour: ST[0], minute: ST[1], second: 0, millisecond: 0 });
                        START_TIME.setHours(ST[0]); START_TIME.setMinutes(ST[1]); START_TIME.setSeconds(0);
                    }
                    if (ET.length > 0) {
                        //END_TIME.set({ hour: ET[0], minute: ET[1], second: 0, millisecond: 0 });

                        END_TIME.setHours(ET[0]); END_TIME.setMinutes(ET[1]); END_TIME.setSeconds(0);
                    }
                    EmploymentInfoObject.START_DATE = START_TIME;
                    EmploymentInfoObject.END_DATE = END_TIME;
                    EmploymentInfoObject.START_DATE = $scope.HRM_CHANGE_UTC_TIME_ZONE_Fn(EmploymentInfoObject.START_DATE);
                    EmploymentInfoObject.END_DATE = $scope.HRM_CHANGE_UTC_TIME_ZONE_Fn(EmploymentInfoObject.END_DATE);
                }
                else {
                    EmploymentInfoObject.START_DATE = $scope.MyLeaveFormSearch.START_DATE;
                    EmploymentInfoObject.END_DATE = $scope.MyLeaveFormSearch.END_DATE;
                }
            }
            EmploymentInfoObject.ASSIGNMENT_REQUIRED = $scope.MyLeaveFormSearch.ASSIGNMENT_REQUIRED;
            EmploymentInfoObject.IGNORE_WORK_PATTERN = $scope.MyLeaveFormSearch.IS_IGNORE_WORK_PATTERN ? 1 : 0;
            EmploymentInfoObject.SETTING_88 = $scope.MyLeaveFormSearch.SETTING_88;
            EmploymentInfoObject.SETTING_61 = $scope.MyLeaveFormSearch.SETTING_61 ? 1 : 0;
            PrcCommMethods.HUMANRESOURCE_API(EmploymentInfoObject, 'HRM_GET_LEAVE_DURATION').then(function (data) {
                $scope.MY_SUBMITED_LEAVE = true;
                var IS_ENTITLEMENT_SELF = true;

                if (data.data.PO_SUCCESS != undefined && data.data.PO_SUCCESS[0].PO_SUCCESS == "-1") {
                    $scope.$parent.ShowAlertBox('Error', 'You do not have entitlement for selected time period', 3000);
                    $scope.MY_SUBMITED_LEAVE = false;
                }
                else {
                    if (data.data.Table.length > 0) {
                        data.data.Table.some(function (value, index) {
                            if (value.ABSENCE_EFFECTIVE_DATE === null && $scope.MyLeaveFormSearch.ASSIGNMENT_REQUIRED == true) {
                                IS_ENTITLEMENT_SELF = false;
                                return true; // Stops iteration;
                            }
                        });
                        if (IS_ENTITLEMENT_SELF == false) {
                            $scope.$parent.ShowAlertBox('Error', 'You do not have entitlement for selected time period', 3000);
                        }
                        else {

                            $scope.HRM_LEAVE_REQUEST_LINE_TYPE = data.data.Table;
                            $scope.generateCalendar()
                            $scope.MyLeaveFormSearch.DURATION = $filter('sumOfValue')(data.data.Table, 'DURATION');
                            $scope.HRM_LEAVE_REQUEST_BY_ID($scope.MyLeaveFormSearch, 'MY');
                            $scope.MyLeaveFormSearch.UNITS = $scope.$parent.RETURN_UNITS_DAYS(data.data.Table[0].UNITS_ID);
                            $scope.MyLeaveFormSearch.UNITS_ID = data.data.Table[0].UNITS_ID;
                            $scope.MyLeaveFormSearch.AVG_HRS_SHIFTS_PER_DAY = data.data.Table[0].AVG_HRS_SHIFTS_PER_DAY;
                        }
                    }
                }
                setTimeout(() => {
                    $scope.isMyProcessing = false; // Reset flag after processing
                    $scope.$apply(); // Ensure the view updates
                }, 1000);
            });
        }
        //if ($scope.isMyProcessing == false) {
        //    setTimeout(() => {
        //        $scope.HRM_GET_LEAVE_DURATION()

        //        $scope.$apply(); // Ensure the view updates
        //    }, 2000);
        //}
    }
    $scope.isTeamProcessing = false;
    var count = 0;
    $scope.HRM_GET_LEAVE_DURATION_TEAM = async function () {
        $scope.HRM_LEAVE_REQUEST_LINE_TYPE_TEAM = [];
        $scope.TeamLeaveFormSearch.HRM_LEAVE_REQUEST_LINE_TYPE_TEAM = [];
        if ($scope.isTeamProcessing == false && $scope.TeamLeaveFormSearch.ABSENCE_TYPE_ID > 0 && ($scope.TeamLeaveFormSearch.START_DATE != undefined && $scope.TeamLeaveFormSearch.START_DATE != "" && $scope.TeamLeaveFormSearch.START_DATE != null) && ($scope.TeamLeaveFormSearch.END_DATE != undefined && $scope.TeamLeaveFormSearch.END_DATE != "" && $scope.TeamLeaveFormSearch.END_DATE != null)) {
            $scope.TeamLeaveFormSearch.DURATION = 0;

            $scope.isTeamProcessing = true;
            var EmploymentInfoObject = new Object();
            EmploymentInfoObject.EMPLY_PRSNL_ID = $scope.TeamLeaveFormSearch.DDL_EMPLOYEE_ID;
            EmploymentInfoObject.ENTITY_ID = $cookies.get("ENTITY_ID");
            EmploymentInfoObject.CUSTOMER_ID = $cookies.get("CUSTOMER_ID");
            EmploymentInfoObject.ABSENCE_TYPE_ID = $scope.TeamLeaveFormSearch.ABSENCE_TYPE_ID;
            if ($scope.TeamLeaveFormSearch.START_TIME == undefined || $scope.TeamLeaveFormSearch.START_TIME == null
                || $scope.TeamLeaveFormSearch.START_TIME == '' ||
                $scope.TeamLeaveFormSearch.START_TIME == true || $scope.TeamLeaveFormSearch.END_TIME == undefined || $scope.TeamLeaveFormSearch.END_TIME == null || $scope.TeamLeaveFormSearch.END_TIME == '' || $scope.TeamLeaveFormSearch.END_TIME == true) {
                //EmploymentInfoObject.START_DATE = $scope.TeamLeaveFormSearch.START_DATE;
                //EmploymentInfoObject.END_DATE = $scope.TeamLeaveFormSearch.END_DATE;
                //EmploymentInfoObject.END_DATE = new Date($scope.TeamLeaveFormSearch.END_DATE);
                //EmploymentInfoObject.END_DATE.setHours(23)
                //EmploymentInfoObject.END_DATE.setMinutes(59);
                //EmploymentInfoObject.END_DATE.setSeconds(0);
                //EmploymentInfoObject.START_DATE = $scope.HRM_CHANGE_TIME_ZONE_Fn(new Date(EmploymentInfoObject.START_DATE));
                //EmploymentInfoObject.END_DATE = $scope.HRM_CHANGE_TIME_ZONE_Fn(new Date(EmploymentInfoObject.END_DATE));


                EmploymentInfoObject.START_DATE = moment($scope.TeamLeaveFormSearch.START_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate('L');
                EmploymentInfoObject.END_DATE = moment($scope.TeamLeaveFormSearch.END_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate('L');
                EmploymentInfoObject.END_DATE.setHours(23);
                EmploymentInfoObject.END_DATE.setMinutes(59);
                EmploymentInfoObject.END_DATE.setSeconds(0);

                EmploymentInfoObject.START_DATE = $scope.HRM_CHANGE_UTC_TIME_ZONE_Fn(EmploymentInfoObject.START_DATE);
                EmploymentInfoObject.END_DATE = $scope.HRM_CHANGE_UTC_TIME_ZONE_Fn(EmploymentInfoObject.END_DATE);


            }
            else {
                if ($scope.TeamLeaveFormSearch.START_TIME != undefined && $scope.TeamLeaveFormSearch.START_TIME != '' && $scope.TeamLeaveFormSearch.START_TIME != null && $scope.TeamLeaveFormSearch.START_TIME != true) {
                    var start = moment($scope.TeamLeaveFormSearch.START_TIME).format('H:mm');
                    var end = moment($scope.TeamLeaveFormSearch.END_TIME).format('H:mm');
                    var ST = start.split(':');
                    var ET = end.split(':');
                    const START_TIME = moment($scope.START_DATE_TEAM_COMPLETE, $scope.$parent.CONVERSION_DATE_FORMAT);
                    const END_TIME = moment($scope.END_DATE_TEAM_COMPLETE, $scope.$parent.CONVERSION_DATE_FORMAT);
                    if (ST.length > 0) {
                        START_TIME.set({ hour: ST[0], minute: ST[1], second: 0, millisecond: 0 });
                    }
                    if (ET.length > 0) {
                        END_TIME.set({ hour: ET[0], minute: ET[1], second: 0, millisecond: 0 });
                    }
                    EmploymentInfoObject.START_DATE = START_TIME;
                    EmploymentInfoObject.END_DATE = END_TIME;

                    EmploymentInfoObject.START_DATE = $scope.HRM_CHANGE_UTC_TIME_ZONE_Fn(EmploymentInfoObject.START_DATE);
                    EmploymentInfoObject.END_DATE = $scope.HRM_CHANGE_UTC_TIME_ZONE_Fn(EmploymentInfoObject.END_DATE);
                }
                else {
                    EmploymentInfoObject.START_DATE = $scope.TeamLeaveFormSearch.START_DATE;
                    EmploymentInfoObject.END_DATE = $scope.TeamLeaveFormSearch.END_DATE;
                }
            }
            EmploymentInfoObject.ASSIGNMENT_REQUIRED = $scope.TeamLeaveFormSearch.ASSIGNMENT_REQUIRED;
            EmploymentInfoObject.IGNORE_WORK_PATTERN = $scope.TeamLeaveFormSearch.IS_IGNORE_WORK_PATTERN ? 1 : 0;
            EmploymentInfoObject.SETTING_88 = $scope.TeamLeaveFormSearch.SETTING_88;
            EmploymentInfoObject.SETTING_61 = $scope.TeamLeaveFormSearch.SETTING_61 ? 1 : 0;
            PrcCommMethods.HUMANRESOURCE_API(EmploymentInfoObject, 'HRM_GET_LEAVE_DURATION').then(function (data) {
                $scope.TEAM_SUBMITED_LEAVE = true;
                var IS_ENTITLEMENT_TEAM = true;
                if (data.data.PO_SUCCESS != undefined && data.data.PO_SUCCESS[0].PO_SUCCESS == "-1") {
                    $scope.$parent.ShowAlertBox('Error', 'You do not have entitlement for selected time period', 3000);
                    $scope.TEAM_SUBMITED_LEAVE = false;
                }
                else {
                    if (data.data.Table.length > 0) {
                        data.data.Table.some(function (value, index) {
                            if (value.ABSENCE_EFFECTIVE_DATE === null && $scope.TeamLeaveFormSearch.ASSIGNMENT_REQUIRED == true) {
                                IS_ENTITLEMENT_TEAM = false;
                                return true; // Stops iteration;
                            }
                        });
                        if (IS_ENTITLEMENT_TEAM == false) {
                            $scope.$parent.ShowAlertBox('Error', 'You do not have entitlement for selected time period', 3000);
                        }
                        else {
                            $scope.HRM_LEAVE_REQUEST_LINE_TYPE_TEAM = data.data.Table;
                            $scope.generateCalendarTeam()
                            $scope.TeamLeaveFormSearch.DURATION = $filter('sumOfValue')(data.data.Table, 'DURATION');
                            $scope.TeamLeaveFormSearch.HRM_LEAVE_REQUEST_LINE_TYPE_TEAM = data.data.Table;
                            $scope.HRM_LEAVE_REQUEST_BY_ID($scope.TeamLeaveFormSearch, 'TEAM');
                            $scope.TeamLeaveFormSearch.UNITS = $scope.$parent.RETURN_UNITS_DAYS(data.data.Table[0].UNITS_ID);
                            $scope.TeamLeaveFormSearch.UNITS_ID = data.data.Table[0].UNITS_ID;
                            $scope.TeamLeaveFormSearch.AVG_HRS_SHIFTS_PER_DAY = data.data.Table[0].AVG_HRS_SHIFTS_PER_DAY;
                        };
                    }
                }
                setTimeout(() => {
                    $scope.isTeamProcessing = false; // Reset flag after processing
                    $scope.$apply(); // Ensure the view updates
                }, 1000);
            });
        }
        //if ($scope.isTeamProcessing == false) {
        //    setTimeout(() => {
        //        $scope.HRM_GET_LEAVE_DURATION_TEAM()
        //        alert()
        //        $scope.$apply(); // Ensure the view updates
        //    }, 2000);
        //}
    }

    $scope.GET_CUSTOMER_SETTINGS = function (_param_retun_value, _param_tableids, _param_CUSTOMER_ID, _param_module) {
        var readOnlyObject = new Object();
        readOnlyObject.CUSTOMER_ID = _param_retun_value.CUSTOMER_ID;
        readOnlyObject.MODULE_ID = _param_retun_value.MODULE_ID;
        readOnlyObject.TABLE_ID_LIST = [];
        angular.forEach(_param_tableids.split(','), function (_loop_value) {
            var readonly = new Object();
            readonly.TABLE_ID = _loop_value;
            readOnlyObject.TABLE_ID_LIST.push(readonly);
        });
        PrcCommMethods.HUMANRESOURCE_API(readOnlyObject, 'GET_CUSTOMER_SETTINGS').then(function (data) {
            if (data.data.Table.length > 0) {
                angular.forEach(data.data.Table, function (_loop_value) {
                    if (_loop_value.SETTING_MASTER_ID == 61) {
                        $scope.MyLeaveFormSearch.SETTING_61 = parseInt(_loop_value.SETTING_VALUE) == 1 ? true : false;
                        $scope.TeamLeaveFormSearch.SETTING_61 = parseInt(_loop_value.SETTING_VALUE) == 1 ? true : false;
                    }
                    else if (_loop_value.SETTING_MASTER_ID == 88) {
                        $scope.MyLeaveFormSearch.SETTING_88 = parseFloat(_loop_value.SETTING_VALUE);
                        $scope.TeamLeaveFormSearch.SETTING_88 = parseFloat(_loop_value.SETTING_VALUE);
                    }
                });
            }
            else if (data.data == 0) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
        });
    };

    $scope.LAZY_LOAD_TEAM_LEAVE_REQUEST_LIST = function () {
        $scope.TEAM_HRM_LEAVE_REQUEST_LIST();
    }
    $scope.TEAM_HRM_LEAVE_REQUEST_LIST = function (FLAG) {
        if (FLAG == 1) {
            $scope.LOAD_FETCH_TEXT = 'Fetching records';
            $scope.TeamLeaveFormSearch.PAGE_NO = 1;
            $scope.TEAM_LEAVE_REQUEST_LIST = [];
        }
        var LeaveListObject = new Object();
        LeaveListObject.FLAG = 2;
        LeaveListObject.EMPLY_PRSNL_ID = $cookies.get("EMPLY_PRSNL_ID");
        LeaveListObject.ABSENCE_TYPE_ID = $scope.TeamLeaveFormSearch.FILTER_ABSENCE_TYPE_ID; // 0 for all 
        LeaveListObject.STATUS_ID = $scope.TeamLeaveFormSearch.STATUS_ID; // 0 for all
        LeaveListObject.CUSTOMER_ID = $cookies.get("CUSTOMER_ID");
        LeaveListObject.ENTITY_ID = $cookies.get("ENTITY_ID");
        LeaveListObject.SEARCH = $scope.TeamLeaveFormSearch.FILTER_TEAM_SEARCH;
        LeaveListObject.MONTH = $scope.TeamLeaveFormSearch.FILTER_DATE == "" || $scope.TeamLeaveFormSearch.FILTER_DATE == null || $scope.TeamLeaveFormSearch.FILTER_DATE == undefined ? 0 : $scope.TeamLeaveFormSearch.FILTER_DATE.split('/')[0];
        LeaveListObject.YEAR = $scope.TeamLeaveFormSearch.FILTER_DATE == "" || $scope.TeamLeaveFormSearch.FILTER_DATE == null || $scope.TeamLeaveFormSearch.FILTER_DATE == undefined ? 0 : $scope.TeamLeaveFormSearch.FILTER_DATE.split('/')[1];
        LeaveListObject.STANDARD_ROLE_ID_11 = $scope.$parent.$parent.CheckStandardRoleAccess(11) || $scope.$parent.$parent.CheckStandardRoleAccess(1) || $scope.$parent.$parent.CheckStandardRoleAccess(6) ? 1 : 0;
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

    $scope.LAZY_LOAD_MY_LEAVE_REQUEST_LIST = function () {
        $scope.MY_HRM_LEAVE_REQUEST_LIST();
    }

    $scope.MY_HRM_LEAVE_REQUEST_LIST = function (FLAG) {
        if (FLAG == 1) {
            $scope.LOAD_FETCH_TEXT = 'Fetching records';
            $scope.MyLeaveFormSearch.PAGE_NO = 1;
            $scope.MY_LEAVE_REQUEST_LIST = [];
        }
        var LeaveListObject = new Object();
        LeaveListObject.FLAG = 1;
        LeaveListObject.EMPLY_PRSNL_ID = $cookies.get("EMPLY_PRSNL_ID");
        LeaveListObject.ABSENCE_TYPE_ID = $scope.MyLeaveFormSearch.FILTER_ABSENCE_TYPE_ID; // 0 for all 
        LeaveListObject.STATUS_ID = $scope.MyLeaveFormSearch.STATUS_ID; // 0 for all
        LeaveListObject.CUSTOMER_ID = $cookies.get("CUSTOMER_ID");
        LeaveListObject.ENTITY_ID = $cookies.get("ENTITY_ID");
        LeaveListObject.SEARCH = $scope.MyLeaveFormSearch.FILTER_MY_SEARCH;  // Full Name , EmployeNo
        LeaveListObject.MONTH = $scope.MyLeaveFormSearch.FILTER_DATE == "" || $scope.MyLeaveFormSearch.FILTER_DATE == null ||
            $scope.MyLeaveFormSearch.FILTER_DATE == undefined ? 0 : $scope.MyLeaveFormSearch.FILTER_DATE.split('/')[0];
        LeaveListObject.YEAR = $scope.MyLeaveFormSearch.FILTER_DATE == "" || $scope.MyLeaveFormSearch.FILTER_DATE == null ||
            $scope.MyLeaveFormSearch.FILTER_DATE == undefined ? 0 : $scope.MyLeaveFormSearch.FILTER_DATE.split('/')[1];
        LeaveListObject.STANDARD_ROLE_ID_11 = $scope.$parent.$parent.CheckStandardRoleAccess(11) || $scope.$parent.$parent.CheckStandardRoleAccess(1)
            || $scope.$parent.$parent.CheckStandardRoleAccess(6) ? 1 : 0;

        LeaveListObject.PAGE_NO = $scope.MyLeaveFormSearch.PAGE_NO;
        LeaveListObject.PAGE_SIZE = $scope.MyLeaveFormSearch.PAGE_SIZE;
        PrcCommMethods.HUMANRESOURCE_API(LeaveListObject, 'HRM_LEAVE_REQUEST_LIST').then(function (data) {
            //if (FLAG == 1) {
            //    $scope.MY_LEAVE_REQUEST_LIST = [];
            //}
            if (data.data.Table.length > 0) {
                $scope.$parent.overlay_loadingNew = 'none';
                $scope.MY_LEAVE_REQUEST_LIST = $scope.MY_LEAVE_REQUEST_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.MyLeaveFormSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.MyLeaveFormSearch.PAGE_NO = parseInt($scope.MyLeaveFormSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else {
                if ($scope.MY_LEAVE_REQUEST_LIST.length == 0) {
                    $scope.LOAD_FETCH_TEXT = 'No records found';
                }
                $scope.GetData = false;
                $scope.$parent.overlay_loadingNew = 'none';
            }
        });
    };

    $scope.HRM_LEAVE_REQUEST_BY_ID_FOR_APPROVAL = function (_leaveSearch, _click_flag) {
        var leaveObject = new Object();
        leaveObject.LEAVE_REQUEST_ID = _leaveSearch.CUSTOM_LEAVE_REQUEST_ID;
        leaveObject.ENTITY_ID = $cookies.get("ENTITY_ID");
        leaveObject.VIEWER_EMPLY_PRSNL_ID = $cookies.get("EMPLY_PRSNL_ID");
        leaveObject.EMPLY_PRSNL_ID = _leaveSearch.EMPLY_PRSNL_ID;
        leaveObject.CUSTOMER_ID = $cookies.get("CUSTOMER_ID");
        leaveObject.ABSENCE_TYPE_ID = _leaveSearch.CUSTOM_ABSENCE_TYPE_ID;
        leaveObject.START_DATE = _leaveSearch.START_DATE;
        leaveObject.END_DATE = _leaveSearch.END_DATE;

        leaveObject.ASSIGNMENT_REQUIRED = _leaveSearch.ASSIGNMENT_REQUIRED;
        leaveObject.IGNORE_WORK_PATTERN = _leaveSearch.IS_IGNORE_WORK_PATTERN ? 1 : 0;
        leaveObject.SETTING_88 = $scope.MyLeaveFormSearch.SETTING_88;
        leaveObject.SETTING_61 = 0;
        leaveObject.HRM_LEAVE_REQUEST_LINE_TYPE = [];

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

        let SP = _leaveSearch.CUSTOM_ABSENCE_TYPE_ID == _leaveSearch.ABSENCE_TYPE_ID ? 'HRM_LEAVE_REQUEST_BY_ID' : 'HRM_GET_LEAVE_DURATION';

        PrcCommMethods.HUMANRESOURCE_API(leaveObject, SP).then(function (data) {
            if (_leaveSearch.CUSTOM_ABSENCE_TYPE_ID == _leaveSearch.ABSENCE_TYPE_ID) {
                _leaveSearch.DURATION_LIST = [];
                _leaveSearch.DURATION_LIST = data.data.Table1;
                $scope.SELECTED_LEAVE_DETAILS.DISABLE_PRC_BTN = false;
                $scope.SELECTED_LEAVE_DETAILS.CUSTOM_UNITS_ID = data.data.Table[0].UNITS_ID;
            }
            else {
                $scope.EDIT_SUBMITED_LEAVE = true;
                var IS_ENTITLEMENT_TEAM = true;
                if (data.data.PO_SUCCESS != undefined && data.data.PO_SUCCESS[0].PO_SUCCESS == "-1") {
                    $scope.$parent.ShowAlertBox('Error', 'You do not have entitlement for selected time period', 3000);
                    $scope.EDIT_SUBMITED_LEAVE = false;
                }
                else {
                    _leaveSearch.DURATION_LIST = [];
                    _leaveSearch.HRM_LEAVE_REQUEST_LINE_TYPE_TEAM = data.data.Table;
                    _leaveSearch.DURATION_LIST = data.data.Table;
                    $scope.SELECTED_LEAVE_DETAILS.DISABLE_PRC_BTN = false;
                    $scope.SELECTED_LEAVE_DETAILS.CUSTOM_UNITS_ID = data.data.Table[0].UNITS_ID;
                }
            }
            $scope.generateCalendarForGridMyTeam(_leaveSearch);
            $scope.SELECTED_LEAVE_DETAILS.SELECTED_DURATION = $filter('sumOfValue')(data.data.Table, 'DURATION');
        });
    };

    $scope.HRM_LEAVE_REQUEST_BY_ID = function (_leaveSearch, _click_flag) {
        if (_leaveSearch.ABSENCE_TYPE_ID > 0 && (_leaveSearch.START_DATE != undefined && _leaveSearch.START_DATE != "" && _leaveSearch.START_DATE != null) &&
            (_leaveSearch.END_DATE != undefined && _leaveSearch.END_DATE != "" && _leaveSearch.END_DATE != null)) {
            var leaveObject = new Object();
            leaveObject.LEAVE_REQUEST_ID = _leaveSearch.LEAVE_REQUEST_ID;
            leaveObject.ENTITY_ID = $cookies.get("ENTITY_ID");
            leaveObject.VIEWER_EMPLY_PRSNL_ID = $cookies.get("EMPLY_PRSNL_ID");
            if (_click_flag == 'GIRD_CLICK' || _click_flag == 'APPROVED_CLICK') {
                leaveObject.EMPLY_PRSNL_ID = _leaveSearch.EMPLY_PRSNL_ID;
            }
            else {
                leaveObject.EMPLY_PRSNL_ID = _leaveSearch.DDL_EMPLOYEE_ID;
            }
            leaveObject.CUSTOMER_ID = $cookies.get("CUSTOMER_ID");
            leaveObject.ABSENCE_TYPE_ID = _leaveSearch.ABSENCE_TYPE_ID;
            var START_TIME, END_TIME;
            var START_DATE, END_DATE;

            //leaveObject.START_DATE = $scope.TeamLeaveFormSearch.START_DATE;
            //leaveObject.END_DATE = $scope.TeamLeaveFormSearch.END_DATE;
            if ($scope.LEAVE_TAB == 1 && _click_flag != 'GIRD_CLICK' && _click_flag != 'APPROVED_CLICK') {
                START_TIME = $scope.MyLeaveFormSearch.START_TIME;
                END_TIME = $scope.MyLeaveFormSearch.END_TIME;
                START_DATE = $scope.MyLeaveFormSearch.START_DATE;
                END_DATE = $scope.MyLeaveFormSearch.END_DATE;
            }
            else if ($scope.LEAVE_TAB == 2 && _click_flag != 'GIRD_CLICK' && _click_flag != 'APPROVED_CLICK') {
                START_TIME = $scope.TeamLeaveFormSearch.START_TIME;
                END_TIME = $scope.TeamLeaveFormSearch.END_TIME;
                START_DATE = $scope.TeamLeaveFormSearch.START_DATE;
                END_DATE = $scope.TeamLeaveFormSearch.END_DATE;
            }
            else {
                leaveObject.START_DATE = _leaveSearch.START_DATE;
                leaveObject.END_DATE = _leaveSearch.END_DATE;

                START_TIME = _leaveSearch.END_DATE;
                END_TIME = _leaveSearch.END_DATE;
            }

            if (_click_flag != 'GIRD_CLICK' && _click_flag != 'APPROVED_CLICK') {
                if (START_TIME == undefined || START_TIME == null
                    || START_TIME == '' ||
                    START_TIME == true || END_TIME == undefined || END_TIME == null || END_TIME == '' || END_TIME == true) {
                    leaveObject.START_DATE = moment(START_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate('L');
                    leaveObject.END_DATE = moment(END_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate('L');
                    leaveObject.END_DATE.setHours(23)
                    leaveObject.END_DATE.setMinutes(59);
                    leaveObject.END_DATE.setSeconds(0);
                    leaveObject.START_DATE = $scope.HRM_CHANGE_UTC_TIME_ZONE_Fn(leaveObject.START_DATE);
                    leaveObject.END_DATE = $scope.HRM_CHANGE_UTC_TIME_ZONE_Fn(leaveObject.END_DATE);
                }
                else {
                    if (START_TIME != undefined && START_TIME != '' && START_TIME != null && START_TIME != true) {
                        var start = moment(START_TIME).format('H:mm');
                        var end = moment(END_TIME).format('H:mm');
                        var ST = start.split(':');
                        var ET = end.split(':');
                        if ($scope.LEAVE_TAB == 1) {
                            START_TIME = moment($scope.START_DATE_COMPLETE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate('L');
                            END_TIME = moment($scope.END_DATE_COMPLETE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate('L');
                        }
                        else if ($scope.LEAVE_TAB == 2) {
                            START_TIME = moment($scope.START_DATE_TEAM_COMPLETE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate('L');
                            END_TIME = moment($scope.END_DATE_TEAM_COMPLETE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate('L');
                        }
                        if (ST.length > 0) {
                            //START_TIME.set({ hour: ST[0], minute: ST[1], second: 0, millisecond: 0 });
                            START_TIME.setHours(ST[0]); START_TIME.setMinutes(ST[1]); START_TIME.setSeconds(0);

                        }
                        if (ET.length > 0) {
                            //END_TIME.set({ hour: ET[0], minute: ET[1], second: 0, millisecond: 0 });
                            END_TIME.setHours(ET[0]); END_TIME.setMinutes(ET[1]); END_TIME.setSeconds(0);
                        }
                        leaveObject.START_DATE = START_TIME;
                        leaveObject.END_DATE = END_TIME;

                        leaveObject.START_DATE = $scope.HRM_CHANGE_UTC_TIME_ZONE_Fn(leaveObject.START_DATE);
                        leaveObject.END_DATE = $scope.HRM_CHANGE_UTC_TIME_ZONE_Fn(leaveObject.END_DATE);
                    }
                    else {
                        // Call on top on if condition
                        //leaveObject.START_DATE = $scope.TeamLeaveFormSearch.START_DATE;
                        //leaveObject.END_DATE = $scope.TeamLeaveFormSearch.END_DATE;
                    }
                }
            }

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
                _leaveSearch.EMPLOYEE_LIST_TEAM = data.data.Table3;
                _leaveSearch.EMPLOYEE_ABSENCES_COUNT_LIST_TEAM = angular.copy($scope.EMPLOYEE_ABSENCES_COUNT_LIST_TEAM);
                if (data.data.Table2.length > 0) {
                    _leaveSearch.EMPLOYEE_ABSENCES_COUNT_LIST_TEAM = data.data.Table2[0];
                };
            });
        }
    };

    $scope.EMPLOYEE_LIST_FOR_LEAVES_LIST = [];
    $scope.HRM_GET_EMPLOYEE_LIST_FOR_LEAVES = function () {
        var EmploymentInfoObject = new Object();
        EmploymentInfoObject.EMPLY_PRSNL_ID = parseInt($cookies.get("EMPLY_PRSNL_ID")) == 0 ? null : parseInt($cookies.get("EMPLY_PRSNL_ID"));
        EmploymentInfoObject.STANDARD_ROLE_ID_11 = $scope.$parent.$parent.CheckStandardRoleAccess(11) || $scope.$parent.$parent.CheckStandardRoleAccess(1) || $scope.$parent.$parent.CheckStandardRoleAccess(6) ? 1 : 0;
        EmploymentInfoObject.CUSTOMER_ID = $cookies.get("CUSTOMER_ID");
        EmploymentInfoObject.ENTITY_ID = $cookies.get("ENTITY_ID");
        PrcCommMethods.HUMANRESOURCE_API(EmploymentInfoObject, 'HRM_GET_EMPLOYEE_LIST_FOR_LEAVES').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.EMPLOYEE_LIST_FOR_LEAVES_LIST = data.data.Table;
            }
        });
    };

    $(document).ready(function () {
        $(".MymonthPicker").datepicker({
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
            $scope.MyLeaveFormSearch.FILTER_DATE = "";
            $scope.MY_HRM_LEAVE_REQUEST_LIST(1);
        });;
    });
    $(document).ready(function () {
        $(".TeammonthPicker").datepicker({
            format: "mm/yyyy",
            viewMode: "months",
            minViewMode: "months",
            autoclose: true,
            clearBtn: true,
            closeText: 'asd',
            onClose: function (dateText, inst) {
                alert('1')
            },
            clearDate: function (dateText, inst) {
            }
        }).on("clearDate", function () {
            $scope.TeamLeaveFormSearch.FILTER_TEAM_SEARCH = "";
            $scope.TeamLeaveFormSearch.FILTER_DATE = "";
            $scope.TEAM_HRM_LEAVE_REQUEST_LIST(1);
        });
    });


    $scope.LEAVE_TAB_Fn = function (TAB_ID) {
        $scope.LEAVE_TAB = TAB_ID;
        if (TAB_ID == 1) {
            $scope.HRM_GET_EMPLOYEE_STEP();
            $scope.HRM_GET_ABSENCE_TYPES_FOR_EMPLOYEE_LEAVE();
            $scope.HRM_GET_EMPLOYEE_ABSENCES_COUNT();
        } else if (TAB_ID == 2) {
            $scope.HRM_GET_EMPLOYEE_LIST_FOR_LEAVES();
            $scope.HRM_GET_ABSENCE_TYPES("TEAM_ABSENCE");
            // $scope.TEAM_HRM_LEAVE_REQUEST_LIST(1);
        }
    }

    $scope.DELETE_TEAM_FILE_UPLOAD_Fn = function (array, line, index) {
        $scope.HRM_DELETE_UPLOAD_FILE(array, line, index);
    };
    $scope.DATE_FILTER_CHANGE_Fn = function (FILTER_FLAG) {
        if (FILTER_FLAG == 1 && ($scope.MyLeaveFormSearch.FILTER_DATE != undefined && $scope.MyLeaveFormSearch.FILTER_DATE != "" && $scope.MyLeaveFormSearch.FILTER_DATE != null)) {
            $scope.MY_HRM_LEAVE_REQUEST_LIST(1);
        }
        else if (FILTER_FLAG == 2 && ($scope.TeamLeaveFormSearch.FILTER_DATE != undefined && $scope.TeamLeaveFormSearch.FILTER_DATE != "" && $scope.TeamLeaveFormSearch.FILTER_DATE != null)) {
            $scope.TEAM_HRM_LEAVE_REQUEST_LIST(1);
        };
    };
    $scope.START_DAY_OF_WEEK = $scope.$parent.MASTER_GET_CUSTOMER_SETTINGS_VALUES(47);
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

    $scope.EMPLOYEE_ALL_CLICK_Fn = function () {
        $scope.TeamLeaveFormSearch.EMPLOYEE_ALL_CHECK = !$scope.TeamLeaveFormSearch.EMPLOYEE_ALL_CHECK;
        angular.forEach($scope.TEAM_LEAVE_REQUEST_LIST, function (_loop_value) {
            _loop_value.IS_SELECTED = $scope.TeamLeaveFormSearch.EMPLOYEE_ALL_CHECK;
        });
    }

    $scope.EMPLOYEE_LIST_CLICK_Fn = function (_team_leave) {
        if (_team_leave.IS_SELECTED) {
            $scope.TeamLeaveFormSearch.EMPLOYEE_ALL_CHECK = true;
            angular.forEach($scope.TEAM_LEAVE_REQUEST_LIST, function (_loop_value) {
                if (_loop_value.IS_SELECTED == undefined || _loop_value.IS_SELECTED == false) {
                    $scope.TeamLeaveFormSearch.EMPLOYEE_ALL_CHECK = false;
                }
            });
        }
        else if (_team_leave.IS_SELECTED == false) {
            $scope.TeamLeaveFormSearch.EMPLOYEE_ALL_CHECK = false;
        };

    }
    $scope.VIEW_WORK_PATTERN = function (FLAG) {
        var count = 0;
        if (FLAG == 2) {
            if ($scope.TeamLeaveFormSearch.DDL_EMPLOYEE_ID == undefined || $scope.TeamLeaveFormSearch.DDL_EMPLOYEE_ID == null || $scope.TeamLeaveFormSearch.DDL_EMPLOYEE_ID == "") {
                count = 1;
            }
        }
        if (count == 0) {
            var LeaveModelObj = new Object();
            LeaveModelObj.WORK_PATTERN_ID = $scope.LEAVE_TAB == 1 ? $scope.EMPLOYEEHEADERDETAILS.WORK_PATTERN_ID : $scope.TeamLeaveFormSearch.WORK_PATTERN_ID;
            PrcCommMethods.HUMANRESOURCE_API(LeaveModelObj, 'HRM_GET_WORK_PATTERN_BY_ID').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.FILTER_WEEK_DAYS_Fn($scope.START_DAY_OF_WEEK);
                    $scope.HRM_WORK_PATTERN_LIST = data.data.Table;
                    $('#Work_Pattern').modal('show');

                }
            });
        }
        else {
            $scope.$parent.ShowAlertBox('Error', 'Please select Employee.', 3000);
        }
    }



    $scope.SET_DATE_Fn = function () {
        if (($scope.MyLeaveFormSearch.START_DATE == undefined || $scope.MyLeaveFormSearch.START_DATE == '' || $scope.MyLeaveFormSearch.START_DATE == null || $scope.MyLeaveFormSearch.END_DATE == undefined || $scope.MyLeaveFormSearch.END_DATE == '' || $scope.MyLeaveFormSearch.END_DATE == null)) {
        }
        else {
            $scope.DATE_SELECTE_FLAG = 0;
            $scope.START_DATE_COMPLETE = angular.copy($scope.MyLeaveFormSearch.START_DATE);
            $scope.END_DATE_COMPLETE = angular.copy($scope.MyLeaveFormSearch.END_DATE);

            const START_DATE = moment($scope.START_DATE_COMPLETE, $scope.$parent.CONVERSION_DATE_FORMAT);
            const END_DATE = moment($scope.END_DATE_COMPLETE, $scope.$parent.CONVERSION_DATE_FORMAT);

            START_DATE.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
            END_DATE.set({ hour: 23, minute: 59, second: 59, millisecond: 0 });

            $scope.START_DATE_COMPLETE_SEND = START_DATE;
            $scope.END_DATE_COMPLETE_SEND = END_DATE;

            if ($scope.MyLeaveFormSearch.START_TIME != undefined && $scope.MyLeaveFormSearch.START_TIME != '' && $scope.MyLeaveFormSearch.START_TIME != null && $scope.MyLeaveFormSearch.START_TIME != true
                && ($scope.MyLeaveFormSearch.END_TIME != undefined && $scope.MyLeaveFormSearch.END_TIME != '' && $scope.MyLeaveFormSearch.END_TIME != null && $scope.MyLeaveFormSearch.END_TIME != true)) {
                var start = moment($scope.MyLeaveFormSearch.START_TIME).format('H:mm');
                var end = moment($scope.MyLeaveFormSearch.END_TIME).format('H:mm');
                var ST = start.split(':');
                var ET = end.split(':');
                const START_TIME = moment($scope.START_DATE_COMPLETE, $scope.$parent.CONVERSION_DATE_FORMAT);;
                const END_TIME = moment($scope.END_DATE_COMPLETE, $scope.$parent.CONVERSION_DATE_FORMAT);;
                if (ST.length > 0) {
                    START_TIME.set({ hour: ST[0], minute: ST[1], second: 0, millisecond: 0 });
                }
                if (ET.length > 0) {
                    END_TIME.set({ hour: ET[0], minute: ET[1], second: 0, millisecond: 0 });
                }

                if (new Date(END_TIME) < new Date(START_TIME)) {
                    $scope.ShowAlertBox('Error', 'end date should not be less than start date', 3000);
                    $scope.MyLeaveFormSearch.START_TIME = null;
                    $scope.MyLeaveFormSearch.END_TIME = null;
                };
                $scope.START_DATE_COMPLETE_SEND = START_TIME;
                $scope.END_DATE_COMPLETE_SEND = END_TIME;

            }
            $scope.MyLeaveFormSearch.START_TIME_VALID = false;
            $scope.MyLeaveFormSearch.END_TIME_VALID = false;
            if (($scope.MyLeaveFormSearch.START_TIME != null && $scope.MyLeaveFormSearch.START_TIME != '' && $scope.MyLeaveFormSearch.START_TIME != undefined && $scope.MyLeaveFormSearch.START_TIME != true || $scope.MyLeaveFormSearch.END_TIME != null && $scope.MyLeaveFormSearch.END_TIME != '' && $scope.MyLeaveFormSearch.END_TIME != undefined && $scope.MyLeaveFormSearch.END_TIME != true)) {
                $scope.MyLeaveFormSearch.START_TIME_VALID = true;
                $scope.MyLeaveFormSearch.END_TIME_VALID = true;
            }
            if ($scope.MyLeaveFormSearch.START_DATE != undefined && $scope.MyLeaveFormSearch.START_DATE != '' && $scope.MyLeaveFormSearch.START_DATE != null && $scope.MyLeaveFormSearch.END_DATE != undefined && $scope.MyLeaveFormSearch.END_DATE != '' && $scope.MyLeaveFormSearch.END_DATE != null) {
                $scope.DATE_SELECTE_FLAG = 1;
                $scope.HRM_GET_LEAVE_DURATION();
            }
        }
    };
    $scope.SET_DATE_TEAM_Fn = function () {
        if (($scope.TeamLeaveFormSearch.START_DATE == undefined || $scope.TeamLeaveFormSearch.START_DATE == '' || $scope.TeamLeaveFormSearch.START_DATE == null || $scope.TeamLeaveFormSearch.END_DATE == undefined || $scope.TeamLeaveFormSearch.END_DATE == '' || $scope.TeamLeaveFormSearch.END_DATE == null)) {
        }
        else {
            $scope.DATE_SELECTE_FLAG = 0;
            $scope.START_DATE_TEAM_COMPLETE = angular.copy($scope.TeamLeaveFormSearch.START_DATE);
            $scope.END_DATE_TEAM_COMPLETE = angular.copy($scope.TeamLeaveFormSearch.END_DATE);

            const START_DATE = moment($scope.START_DATE_TEAM_COMPLETE, $scope.$parent.CONVERSION_DATE_FORMAT);
            const END_DATE = moment($scope.END_DATE_TEAM_COMPLETE, $scope.$parent.CONVERSION_DATE_FORMAT);
            START_DATE.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
            END_DATE.set({ hour: 23, minute: 59, second: 59, millisecond: 0 });

            $scope.START_DATE_TEAM_COMPLETE_SEND = START_DATE;
            $scope.END_DATE_TEAM_COMPLETE_SEND = END_DATE;
            if ($scope.TeamLeaveFormSearch.END_TIME != undefined && $scope.TeamLeaveFormSearch.END_TIME != '' && $scope.TeamLeaveFormSearch.END_TIME != null) {
                if (new Date($scope.END_DATE_TEAM_COMPLETE_SEND) < new Date($scope.START_DATE_TEAM_COMPLETE_SEND)) {
                    $scope.ShowAlertBox('Error', 'end date should not be less than start date', 3000);
                    $scope.TeamLeaveFormSearch.END_DATE = '';
                    $scope.TeamLeaveFormSearch.END_TIME = null;
                    $scope.TeamLeaveFormSearch.START_TIME = null;
                };
            }

            if ($scope.TeamLeaveFormSearch.START_TIME != undefined && $scope.TeamLeaveFormSearch.START_TIME != '' && $scope.TeamLeaveFormSearch.START_TIME != null && $scope.TeamLeaveFormSearch.START_TIME != true
                && ($scope.TeamLeaveFormSearch.END_TIME != undefined && $scope.TeamLeaveFormSearch.END_TIME != '' && $scope.TeamLeaveFormSearch.END_TIME != null && $scope.TeamLeaveFormSearch.END_TIME != true)) {
                var start = moment($scope.TeamLeaveFormSearch.START_TIME).format('H:mm');
                var end = moment($scope.TeamLeaveFormSearch.END_TIME).format('H:mm');
                var ST = start.split(':');
                var ET = end.split(':');
                const START_TIME = moment($scope.START_DATE_TEAM_COMPLETE, $scope.$parent.CONVERSION_DATE_FORMAT);
                const END_TIME = moment($scope.END_DATE_TEAM_COMPLETE, $scope.$parent.CONVERSION_DATE_FORMAT);
                if (ST.length > 0) {
                    START_TIME.set({ hour: ST[0], minute: ST[1], second: 0, millisecond: 0 });
                }
                if (ET.length > 0) {
                    END_TIME.set({ hour: ET[0], minute: ET[1], second: 0, millisecond: 0 });
                }
                if (new Date(END_TIME) < new Date(START_TIME)) {
                    $scope.ShowAlertBox('Error', 'end date should not be less than start date', 3000);
                    $scope.TeamLeaveFormSearch.START_TIME = null;
                    $scope.TeamLeaveFormSearch.END_TIME = null;
                };
                $scope.START_DATE_TEAM_COMPLETE_SEND = START_TIME;
                $scope.END_DATE_TEAM_COMPLETE_SEND = END_TIME;
            }
            $scope.TeamLeaveFormSearch.START_TIME_VALID = false;
            $scope.TeamLeaveFormSearch.END_TIME_VALID = false;
            if (($scope.TeamLeaveFormSearch.START_TIME != null && $scope.TeamLeaveFormSearch.START_TIME != ''
                && $scope.TeamLeaveFormSearch.START_TIME != undefined && $scope.TeamLeaveFormSearch.START_TIME != true || $scope.TeamLeaveFormSearch.END_TIME != null
                && $scope.TeamLeaveFormSearch.END_TIME != '' && $scope.TeamLeaveFormSearch.END_TIME != undefined && $scope.TeamLeaveFormSearch.END_TIME != true)) {
                $scope.TeamLeaveFormSearch.START_TIME_VALID = true;
                $scope.TeamLeaveFormSearch.END_TIME_VALID = true;
            }
            if ($scope.TeamLeaveFormSearch.START_DATE != undefined && $scope.TeamLeaveFormSearch.START_DATE != ''
                && $scope.TeamLeaveFormSearch.START_DATE != null && $scope.TeamLeaveFormSearch.END_DATE != undefined && $scope.TeamLeaveFormSearch.END_DATE != ''
                && $scope.TeamLeaveFormSearch.END_DATE != null) {
                $scope.DATE_SELECTE_FLAG = 1;
                $scope.HRM_GET_LEAVE_DURATION_TEAM();
            }
        }
    };
    $scope.SetStartCompleteDateMy = function (A, B, FLAG) {
        if (($scope.MyLeaveFormSearch.START_DATE != undefined && $scope.MyLeaveFormSearch.START_DATE != '' && $scope.MyLeaveFormSearch.START_DATE != null) && ($scope.MyLeaveFormSearch.END_DATE != undefined && $scope.MyLeaveFormSearch.END_DATE != '' && $scope.MyLeaveFormSearch.END_DATE != null)) {
            //if (new Date($scope.MyLeaveFormSearch.END_DATE) < new Date($scope.MyLeaveFormSearch.START_DATE)) {
            //    $scope.ShowAlertBox('Error', 'End date should be greater than start date', 3000);
            //    $scope.MyLeaveFormSearch.END_DATE = '';
            //    $scope.MyLeaveFormSearch.END_TIME = null;
            //}
            if (moment($scope.MyLeaveFormSearch.END_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate() < moment($scope.MyLeaveFormSearch.START_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate()) {
                $scope.ShowAlertBox('Error', 'End date should be greater than start date', 3000);
                $scope.MyLeaveFormSearch.END_DATE = '';
                $scope.MyLeaveFormSearch.END_TIME = null;
            }
        };
        if (FLAG == 1) {
            if (($scope.MyLeaveFormSearch.START_DATE != undefined && $scope.MyLeaveFormSearch.START_DATE != '' && $scope.MyLeaveFormSearch.START_DATE != null) &&
                ($scope.MyLeaveFormSearch.END_DATE != undefined && $scope.MyLeaveFormSearch.END_DATE != '' && $scope.MyLeaveFormSearch.END_DATE != null)) {
                $scope.SET_DATE_Fn();
                $('.MyEndLeave').datepicker('destroy');
                $scope.DateInputLoadMyLeaveEndDate();
            }
            else {
                if ($scope.MyLeaveFormSearch.END_DATE == undefined || $scope.MyLeaveFormSearch.END_DATE == '' || $scope.MyLeaveFormSearch.END_DATE == null) {
                    if ($scope.MyLeaveFormSearch.START_TIME == undefined || $scope.MyLeaveFormSearch.START_TIME == '' || $scope.MyLeaveFormSearch.START_TIME == null) {
                        $scope.MyLeaveFormSearch.END_DATE = $scope.MyLeaveFormSearch.START_DATE;
                        $scope.SET_DATE_Fn();
                        $('.MyEndLeave').datepicker('destroy');
                        $scope.DateInputLoadMyLeaveEndDate();
                    }
                    else if ($scope.MyLeaveFormSearch.END_TIME == undefined || $scope.MyLeaveFormSearch.END_TIME == '' || $scope.MyLeaveFormSearch.END_TIME == null) {
                        $scope.SET_DATE_Fn();
                    }
                }
            };
        };
    };
    $scope.SetEndCompleteDateMy = function () {
        if (($scope.MyLeaveFormSearch.START_DATE != undefined && $scope.MyLeaveFormSearch.START_DATE != '' && $scope.MyLeaveFormSearch.START_DATE != null) && ($scope.MyLeaveFormSearch.END_DATE != undefined && $scope.MyLeaveFormSearch.END_DATE != '' && $scope.MyLeaveFormSearch.END_DATE != null)) {
            //if (new Date($scope.MyLeaveFormSearch.END_DATE) < new Date($scope.MyLeaveFormSearch.START_DATE)) {
            //    $scope.ShowAlertBox('Error', 'End date should be greater than start date', 3000);
            //    $scope.MyLeaveFormSearch.END_DATE = '';
            //    $scope.MyLeaveFormSearch.END_TIME = null;
            //}
            if (moment($scope.MyLeaveFormSearch.END_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate() < moment($scope.MyLeaveFormSearch.START_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate()) {
                $scope.ShowAlertBox('Error', 'End date should be greater than start date', 3000);
                $scope.MyLeaveFormSearch.END_DATE = '';
                $scope.MyLeaveFormSearch.END_TIME = null;
            }
        };
        if (($scope.MyLeaveFormSearch.START_DATE == undefined || $scope.MyLeaveFormSearch.START_DATE == '' || $scope.MyLeaveFormSearch.START_DATE == null) || ($scope.MyLeaveFormSearch.END_DATE == undefined || $scope.MyLeaveFormSearch.END_DATE == '' || $scope.MyLeaveFormSearch.END_DATE == null)) {
        }
        else {
            $scope.SET_DATE_Fn();
        }
    };
    $scope.SET_MOMENT_START_TIME_COMPLETE_DATE = function (FLAG) {
        $scope.SET_DATE_Fn();
    };
    $scope.SET_MOMENT_END_TIME_COMPLETE_DATE = function (FLAG) {
        $scope.SET_DATE_Fn();
    };

    $scope.SetStartCompleteDateTeam = function (A, B, FLAG) {
        if (($scope.TeamLeaveFormSearch.START_DATE != undefined && $scope.TeamLeaveFormSearch.START_DATE != '' && $scope.TeamLeaveFormSearch.START_DATE != null) && ($scope.TeamLeaveFormSearch.END_DATE != undefined && $scope.TeamLeaveFormSearch.END_DATE != '' && $scope.TeamLeaveFormSearch.END_DATE != null)) {
            //if (new Date($scope.TeamLeaveFormSearch.END_DATE) < new Date($scope.TeamLeaveFormSearch.START_DATE)) {
            //    $scope.ShowAlertBox('Error', 'End date should be greater than start date', 3000);
            //    $scope.TeamLeaveFormSearch.END_DATE = '';
            //    $scope.TeamLeaveFormSearch.END_TIME = null;
            //}
            if (moment($scope.TeamLeaveFormSearch.END_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate() < moment($scope.TeamLeaveFormSearch.START_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate()) {
                $scope.ShowAlertBox('Error', 'End date should be greater than start date', 3000);
                $scope.TeamLeaveFormSearch.END_DATE = '';
                $scope.TeamLeaveFormSearch.END_TIME = null;
            }
        };
        if (FLAG == 1) {
            if (($scope.TeamLeaveFormSearch.START_DATE != undefined && $scope.TeamLeaveFormSearch.START_DATE != '' && $scope.TeamLeaveFormSearch.START_DATE != null) && ($scope.TeamLeaveFormSearch.END_DATE != undefined && $scope.TeamLeaveFormSearch.END_DATE != '' && $scope.TeamLeaveFormSearch.END_DATE != null)) {
                $scope.SET_DATE_TEAM_Fn();
                $('.TeamLeaveEndDate').datepicker('destroy');
                $scope.DateInputLoadTeamLeaveEndDate();
            }
            else {
                if ($scope.TeamLeaveFormSearch.END_DATE == undefined || $scope.TeamLeaveFormSearch.END_DATE == '' || $scope.TeamLeaveFormSearch.END_DATE == null) {
                    if ($scope.TeamLeaveFormSearch.START_TIME == undefined || $scope.TeamLeaveFormSearch.START_TIME == '' || $scope.TeamLeaveFormSearch.START_TIME == null) {
                        $scope.TeamLeaveFormSearch.END_DATE = $scope.TeamLeaveFormSearch.START_DATE;
                        $(".TeamLeaveEndDate").datepicker("setDate", $scope.TeamLeaveFormSearch.END_DATE);
                        $scope.SET_DATE_TEAM_Fn();
                        $('.TeamLeaveEndDate').datepicker('destroy');
                        $scope.DateInputLoadTeamLeaveEndDate();
                    }
                    else if ($scope.TeamLeaveFormSearch.END_TIME == undefined || $scope.TeamLeaveFormSearch.END_TIME == '' || $scope.TeamLeaveFormSearch.END_TIME == null) {
                        $scope.SET_DATE_TEAM_Fn();
                    }
                }
            };
        };
    };
    $scope.SetEndCompleteDateTeam = function () {
        if (($scope.TeamLeaveFormSearch.START_DATE != undefined && $scope.TeamLeaveFormSearch.START_DATE != '' && $scope.TeamLeaveFormSearch.START_DATE != null) && ($scope.TeamLeaveFormSearch.END_DATE != undefined && $scope.TeamLeaveFormSearch.END_DATE != '' && $scope.TeamLeaveFormSearch.END_DATE != null)) {
            //if (new Date($scope.TeamLeaveFormSearch.END_DATE) < new Date($scope.TeamLeaveFormSearch.START_DATE)) {
            //    $scope.ShowAlertBox('Error', 'End date should be greater than start date', 3000);
            //    $scope.TeamLeaveFormSearch.END_DATE = '';
            //    $scope.TeamLeaveFormSearch.END_TIME = null;
            //}
            if (moment($scope.TeamLeaveFormSearch.END_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate() < moment($scope.TeamLeaveFormSearch.START_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate()) {
                $scope.ShowAlertBox('Error', 'End date should be greater than start date', 3000);
                $scope.TeamLeaveFormSearch.END_DATE = '';
                $scope.TeamLeaveFormSearch.END_TIME = null;
            }

        };
        if (($scope.TeamLeaveFormSearch.START_DATE == undefined || $scope.TeamLeaveFormSearch.START_DATE == '' || $scope.TeamLeaveFormSearch.START_DATE == null) || ($scope.TeamLeaveFormSearch.END_DATE == undefined || $scope.TeamLeaveFormSearch.END_DATE == '' || $scope.TeamLeaveFormSearch.END_DATE == null)) {
        }
        else {
            $scope.SET_DATE_TEAM_Fn();
        }
    };
    $scope.SET_MOMENT_TEAM_START_TIME_COMPLETE_DATE = function (FLAG) {
        $scope.SET_DATE_TEAM_Fn();
    };
    $scope.SET_MOMENT_TEAM_END_TIME_COMPLETE_DATE = function (FLAG) {
        $scope.SET_DATE_TEAM_Fn();
    };
    $scope.SELECTED_ABSENCE_TYPE_Fn = function (_absence) {
        $scope.MyLeaveFormSearch.UNITS = "";
        if (_absence == '') {
            $scope.MyLeaveFormSearch.CUSTOM_ABSENCE_TYPE_NAME = $scope.MyLeaveFormSearch.DD_DEFAULT_TEXT;
            $scope.MyLeaveFormSearch.ABSENCE_TYPE_ID = '';
            $scope.HRM_GET_LEAVE_DURATION();
        }
        else {
            $scope.MyLeaveFormSearch.CUSTOM_ABSENCE_TYPE_NAME = _absence.ABSENCE_TYPE;
            $scope.MyLeaveFormSearch.ABSENCE_TYPE_ID = _absence.ABSENCE_TYPE_ID;
            $scope.MyLeaveFormSearch.ASSIGNMENT_REQUIRED = _absence.ASSIGNMENT_REQUIRED;

            var LOCK_DATE = $scope.HRM_LOCK_DATE_LIST.filter(function (x) { return x.BRANCH_ID == $scope.EMPLOYEEHEADERDETAILS.BRANCH_ID })
            if (LOCK_DATE.length > 0 && LOCK_DATE[0].LOCK_DATE != null) {
                if (new Date($scope.EMPLOYEEHEADERDETAILS.HIRING_DATE) > new Date(LOCK_DATE[0].LOCK_DATE)) {
                    $scope.MY_LOCK_DATE = new Date($scope.EMPLOYEEHEADERDETAILS.HIRING_DATE);
                }
                else {
                    const date = new Date(LOCK_DATE[0].LOCK_DATE);
                    date.setDate(date.getDate() + 1);
                    $scope.MY_LOCK_DATE = new Date(date);
                }
            }
            else {
                if (new Date($scope.EMPLOYEEHEADERDETAILS.HIRING_DATE) > new Date($scope.FISCAL_YEAR_START)) {
                    $scope.MY_LOCK_DATE = new Date();
                } else {
                    $scope.MY_LOCK_DATE = new Date();
                }
            }
            $scope.DateInputLoadMyLeaveStartDate();
            $scope.DateInputLoadMyLeaveEndDate();

            $scope.HRM_CHECK_ALREADY_TAKEN_LEAVE();
            $scope.HRM_GET_LEAVE_DURATION();
            $scope.HRM_GET_EMPLOYEE_ABSENCES_COUNT_MY_APPLY_LEAVE(_absence);

        }
    }
    $scope.SELECTED_ABSENCE_TYPE_APPROVE_REJECT_Fn = function (_absence) {
        $scope.SELECTED_LEAVE_DETAILS.DISABLE_PRC_BTN = true;
        $scope.SELECTED_LEAVE_DETAILS.CUSTOM_ABSENCE_TYPE = _absence.ABSENCE_TYPE;
        $scope.SELECTED_LEAVE_DETAILS.CUSTOM_ABSENCE_TYPE_ID = angular.copy(_absence.ABSENCE_TYPE_ID);
        //$scope.SELECTED_LEAVE_DETAILS.CUSTOM_UNITS_ID = angular.copy(_absence.UNITS_ID);
        $scope.SELECTED_LEAVE_DETAILS.ASSIGNMENT_REQUIRED = angular.copy(_absence.ASSIGNMENT_REQUIRED);
        $scope.SELECTED_LEAVE_DETAILS.CUSTOM_LEAVE_REQUEST_ID = 0;
        if ($scope.SELECTED_LEAVE_DETAILS.CUSTOM_ABSENCE_TYPE_ID == $scope.SELECTED_LEAVE_DETAILS.ABSENCE_TYPE_ID) {
            $scope.SELECTED_LEAVE_DETAILS.CUSTOM_LEAVE_REQUEST_ID = $scope.SELECTED_LEAVE_DETAILS.LEAVE_REQUEST_ID;
        }
        $scope.HRM_LEAVE_REQUEST_BY_ID_FOR_APPROVAL($scope.SELECTED_LEAVE_DETAILS);
        $scope.EDIT_HRM_GET_EMPLOYEE_ABSENCES_COUNT($scope.SELECTED_LEAVE_DETAILS);
    }
    $scope.SELECTED_ABSENCE_TYPE_TEAM_Fn = function (_absence) {
        $scope.TeamLeaveFormSearch.UNITS = "";
        if (_absence == '') {
            $scope.TeamLeaveFormSearch.CUSTOM_ABSENCE_TYPE_NAME = $scope.MyLeaveFormSearch.DD_DEFAULT_TEXT;
            $scope.TeamLeaveFormSearch.ABSENCE_TYPE_ID = '';
            // $scope.HRM_LEAVE_REQUEST_BY_ID($scope.TeamLeaveFormSearch, 'TEAM');
            $scope.HRM_GET_LEAVE_DURATION_TEAM();
        }
        else {
            $scope.TeamLeaveFormSearch.CUSTOM_ABSENCE_TYPE_NAME = _absence.ABSENCE_TYPE;
            $scope.TeamLeaveFormSearch.ABSENCE_TYPE_ID = _absence.ABSENCE_TYPE_ID;
            $scope.TeamLeaveFormSearch.ASSIGNMENT_REQUIRED = _absence.ASSIGNMENT_REQUIRED;

            $scope.DateInputLoadMyLeaveStartDate();
            $scope.DateInputLoadMyLeaveEndDate();


            $scope.HRM_CHECK_ALREADY_TAKEN_LEAVE();
            $scope.HRM_GET_ABSENCE_TYPES_FOR_EMPLOYEE_LEAVE();
            $scope.HRM_GET_EMPLOYEE_ABSENCES_COUNT_TEAM();
            //$scope.HRM_LEAVE_REQUEST_BY_ID($scope.TeamLeaveFormSearch, 'TEAM');
            $scope.HRM_GET_LEAVE_DURATION_TEAM();
        }
    }
    $scope.SELECTED_FILTER_ABSENCE_TYPE_MY_Fn = function (_absence) {
        if (_absence == '') {
            $scope.MyLeaveFormSearch.CUSTOM_FILFTER_ABSENCE_TYPE_NAME = $scope.MyLeaveFormSearch.DD_DEFAULT_TEXT;
            $scope.MyLeaveFormSearch.FILTER_ABSENCE_TYPE_ID = 0;
            $scope.MY_HRM_LEAVE_REQUEST_LIST(1);
        }
        else {
            $scope.MyLeaveFormSearch.CUSTOM_FILFTER_ABSENCE_TYPE_NAME = _absence.ABSENCE_TYPE;
            $scope.MyLeaveFormSearch.FILTER_ABSENCE_TYPE_ID = _absence.ABSENCE_TYPE_ID;
            $scope.MY_HRM_LEAVE_REQUEST_LIST(1);
            $scope.HRM_GET_EMPLOYEE_ABSENCES_COUNT();

        }
    }
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
    $scope.SELECTED_EMPLOYEE_LIST_FOR_LEAVES_Fn = function (_reportee) {
        if (_reportee == '') {
            $scope.TeamLeaveFormSearch.CUSTOM_EMPLOYEE_NAME = $scope.TeamLeaveFormSearch.DD_DEFAULT_TEXT;
            $scope.TeamLeaveFormSearch.DDL_EMPLOYEE_ID = '';
            $scope.TeamLeaveFormSearch.WORK_PATTERN_ID = '';
            $scope.TEAM_ABSENCE_TYPES_FOR_EMPLOYEE_LEAVE_LIST = [];
            //   $scope.HRM_LEAVE_REQUEST_BY_ID($scope.TeamLeaveFormSearch, 'TEAM');
            $scope.HRM_GET_LEAVE_DURATION_TEAM();
        }
        else {
            $scope.TeamLeaveFormSearch.CUSTOM_EMPLOYEE_NAME = _reportee.EMPLOYEE_NAME;
            $scope.TeamLeaveFormSearch.DDL_EMPLOYEE_ID = _reportee.EMPLY_PRSNL_ID;
            $scope.TeamLeaveFormSearch.WORK_PATTERN_ID = _reportee.WORK_PATTERN_ID;
            //var LOCK_DATE = $scope.HRM_LOCK_DATE_LIST.filter(function (x) { return x.BRANCH_ID == _reportee.BRANCH_ID })
            //if (LOCK_DATE.length > 0 && LOCK_DATE[0].LOCK_DATE != null) {
            //    const date = new Date(LOCK_DATE[0].LOCK_DATE); // or any specific date
            //    date.setDate(date.getDate() - 1);
            //    $scope.EMP_LOCK_DATE = new Date(date);
            //}
            //else {
            //    $scope.EMP_LOCK_DATE = new Date($scope.FISCAL_YEAR_START)
            //}
            $('.TeamLeaveStartDate').datepicker('destroy');
            $('.TeamLeaveEndDate').datepicker('destroy');
            var LOCK_DATE = $scope.HRM_LOCK_DATE_LIST.filter(function (x) { return x.BRANCH_ID == _reportee.BRANCH_ID })
            if (LOCK_DATE.length > 0 && LOCK_DATE[0].LOCK_DATE != null) {
                if (new Date(_reportee.HIRING_DATE) > new Date(LOCK_DATE[0].LOCK_DATE)) {
                    $scope.EMP_LOCK_DATE = new Date(_reportee.HIRING_DATE);
                }
                else {
                    const date = new Date(LOCK_DATE[0].LOCK_DATE);
                    date.setDate(date.getDate() + 1);
                    $scope.EMP_LOCK_DATE = new Date(date);
                }
                if (($scope.TeamLeaveFormSearch.START_DATE != undefined && $scope.TeamLeaveFormSearch.START_DATE != null && $scope.TeamLeaveFormSearch.START_DATE != "") && new Date(LOCK_DATE[0].LOCK_DATE) > new Date($scope.TeamLeaveFormSearch.START_DATE)) {
                    $scope.TeamLeaveFormSearch.START_DATE = "";
                    $scope.TeamLeaveFormSearch.END_DATE = "";
                }
            }
            else {
                if (new Date(_reportee.HIRING_DATE) > new Date($scope.FISCAL_YEAR_START)) {
                    $scope.EMP_LOCK_DATE = new Date();
                } else {
                    $scope.EMP_LOCK_DATE = new Date();
                }
            }
            $scope.DateInputLoadTeamLeaveStartDate();
            $scope.DateInputLoadTeamLeaveEndDate();

            $scope.HRM_GET_ABSENCE_TYPES_FOR_EMPLOYEE_LEAVE('EMPLOYEE_CHANGE');
            //  $scope.HRM_LEAVE_REQUEST_BY_ID($scope.TeamLeaveFormSearch, 'TEAM');
            $scope.HRM_GET_LEAVE_DURATION_TEAM();
            //$scope.TEAM_HRM_LEAVE_REQUEST_LIST(2);
            //$scope.HRM_CHECK_ALREADY_TAKEN_LEAVE(2);
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
    $scope.SELECTED_FILTER_MY_STATUS_Fn = function (_status) {
        if (_status == '') {
            $scope.MyLeaveFormSearch.CUSTOM_MY_FLITER_STATUS_NAME = $scope.MyLeaveFormSearch.DD_DEFAULT_TEXT;
            $scope.MyLeaveFormSearch.STATUS_ID = 0;
            $scope.MY_HRM_LEAVE_REQUEST_LIST(1);
        }
        else {
            $scope.MyLeaveFormSearch.CUSTOM_MY_FLITER_STATUS_NAME = _status.STATUS_NAME;
            $scope.MyLeaveFormSearch.STATUS_ID = _status.STATUS_ID;
            $scope.MY_HRM_LEAVE_REQUEST_LIST(1);
        };
    };

    $scope.DOWN_LOAD_EXCEL_Fn = function (FLAG) {
        if (FLAG == 1) {
            alasql('SELECT ABSENCE_TYPE,START_DATE,END_DATE,DURATION,UNIT_NAME,APP_REJ_CANCEL_BY,APP_REJ_CANCEL_BY_DATE,STATUS_NAME INTO XLSX("Leave",{headers:true}) FROM ?', [$scope.MY_LEAVE_REQUEST_LIST]);
        }
        else if (FLAG == 2) {
            var resultselectedEmp = $scope.TEAM_LEAVE_REQUEST_LIST.filter(function (x) { return x.IS_SELECTED });
            if (resultselectedEmp.length == 0) {
                resultselectedEmp = $scope.TEAM_LEAVE_REQUEST_LIST
            }
            alasql('SELECT  EMPLOYEE_NAME, ABSENCE_TYPE,START_DATE,END_DATE,DURATION,UNIT_NAME,APP_REJ_CANCEL_BY,APP_REJ_CANCEL_BY_DATE,STATUS_NAME INTO XLSX("Leave",{headers:true}) FROM ?', [resultselectedEmp]);
        }
    };
    $scope.POP_OPEN_LEAVER_DTL_Fn = function (_leaverDtls, leaveline) {
        $scope.SELECTED_LEAVE_DTLS = {};
        $scope.SELECTED_LEAVE_DTLS = _leaverDtls;
        $scope.SELECTED_LEAVER_DTLS = leaveline;
        //$scope.SELECTED_LINE_LEAVE_DTLS = _leaveDtls;
        $('#Sick_leaves').modal('show');
    };

    $scope.nginitteamleave_Fn = function (_leave, last) {
        _leave.SHORT_NAME = $scope.TextReturn(_leave.EMPLOYEE_NAME);
        //_leave.IS_REJECTED = new Date(_leave.START_DATE) > new Date($scope.CURRENT_DATE);
        var LOCK_DATE = $scope.HRM_LOCK_DATE_LIST.filter(function (x) { return x.BRANCH_ID == _leave.BRANCH_ID })
        if (LOCK_DATE.length > 0 && LOCK_DATE[0].LOCK_DATE != null) {
            _leave.IS_REJECTED = moment(moment(_leave.START_DATE), $scope.$parent.CONVERSION_DATE_FORMAT).toDate() > moment(moment(LOCK_DATE[0].LOCK_DATE), $scope.$parent.CONVERSION_DATE_FORMAT).toDate();
        }
        else {
            _leave.IS_REJECTED = moment(moment(_leave.START_DATE), $scope.$parent.CONVERSION_DATE_FORMAT).toDate() > moment($scope.CURRENT_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate();

        }
        _leave.UNIT_NAME = $scope.RETURN_UNITS_DAYS(_leave.UNITS_ID);

    }
    $scope.nginit_myleave = function (_leave) {
        _leave.SHORT_NAME = $scope.TextReturn(_leave.EMPLOYEE_NAME);
        //_leave.IS_REJECTED = new Date(_leave.START_DATE) > new Date($scope.CURRENT_DATE);
        var LOCK_DATE = $scope.HRM_LOCK_DATE_LIST.filter(function (x) { return x.BRANCH_ID == _leave.BRANCH_ID })
        if (LOCK_DATE.length > 0 && LOCK_DATE[0].LOCK_DATE != null) {
            _leave.IS_REJECTED = moment(moment(_leave.START_DATE), $scope.$parent.CONVERSION_DATE_FORMAT).toDate() > moment(moment(LOCK_DATE[0].LOCK_DATE), $scope.$parent.CONVERSION_DATE_FORMAT).toDate();
        } else {
            _leave.IS_REJECTED = moment(moment(_leave.START_DATE), $scope.$parent.CONVERSION_DATE_FORMAT).toDate() > moment($scope.CURRENT_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate();
        }
        _leave.UNIT_NAME = $scope.RETURN_UNITS_DAYS(_leave.UNITS_ID);

    }
    //$scope.SELECTED_TEAM_STATUS_Fn('');

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
    $scope.DURATION_CHANGE_Fn = function (_leave, day) {
        day.IS_CHANGED = 0;
        if (day.SELECTED_DURATION != day.OLD_SELECTED_DURATION) {
            day.IS_CHANGED = 1;
        }
        var LeaveModelObj = new Object();
        LeaveModelObj.HRM_LEAVE_REQUEST_LINE_TYPE = [];
        angular.forEach($scope.SELECTED_LEAVE_DETAILS.calendarMonths, function (_month_loop_value) {
            angular.forEach(_month_loop_value.weeks, function (_Week_loop_value) {
                angular.forEach(_Week_loop_value.days, function (_day_loop_value) {
                    var readonly = new Object()
                    if (_day_loop_value.DATE.getMonth() === _month_loop_value.monthIndex && _day_loop_value.SELECTED_DURATION && _day_loop_value.Value == false) {
                        readonly.ORIGINAL_DURATION = _day_loop_value.ORIGINAL_DURATION; // User selected duration 
                        LeaveModelObj.HRM_LEAVE_REQUEST_LINE_TYPE.push(readonly);
                    }
                });
            });
        });
        $scope.SELECTED_LEAVE_DETAILS.SELECTED_DURATION = $filter('sumOfValue')(LeaveModelObj.HRM_LEAVE_REQUEST_LINE_TYPE, 'ORIGINAL_DURATION');
    }
    $scope.ON_CHANGE_DURATION_Fn = function (calendarMonths, CLCIK_FLAG) {
        var LeaveModelObj = new Object();
        LeaveModelObj.HRM_LEAVE_REQUEST_LINE_TYPE = [];
        if (CLCIK_FLAG == 1) {
            angular.forEach(calendarMonths, function (_month_loop_value) {
                angular.forEach(_month_loop_value.weeks, function (_Week_loop_value) {
                    angular.forEach(_Week_loop_value.days, function (_day_loop_value) {
                        var readonly = new Object()
                        if (_day_loop_value.DATE.getMonth() === _month_loop_value.monthIndex && _day_loop_value.SELECTED_DURATION && _day_loop_value.Value == false) {
                            readonly.DURATION = _day_loop_value.DURATION; // User selected duration 
                            LeaveModelObj.HRM_LEAVE_REQUEST_LINE_TYPE.push(readonly);
                        }
                    });
                });
            });
            $scope.MyLeaveFormSearch.DURATION = $filter('sumOfValue')(LeaveModelObj.HRM_LEAVE_REQUEST_LINE_TYPE, 'DURATION');
        }
        if (CLCIK_FLAG == 2) {
            angular.forEach(calendarMonths, function (_month_loop_value) {
                angular.forEach(_month_loop_value.weeks, function (_Week_loop_value) {
                    angular.forEach(_Week_loop_value.days, function (_day_loop_value) {
                        var readonly = new Object()
                        if (_day_loop_value.DATE.getMonth() === _month_loop_value.monthIndex && _day_loop_value.SELECTED_DURATION && _day_loop_value.Value == false) {
                            readonly.DURATION = _day_loop_value.DURATION; // User selected duration 
                            LeaveModelObj.HRM_LEAVE_REQUEST_LINE_TYPE.push(readonly);
                        }
                    });
                });
            });
            $scope.TeamLeaveFormSearch.DURATION = $filter('sumOfValue')(LeaveModelObj.HRM_LEAVE_REQUEST_LINE_TYPE, 'DURATION');
        }
    }
    $scope.RESET_MY_LEAVE_Fn = function () {
        $scope.SELECTED_ABSENCE_TYPE_Fn('');
        $scope.MyLeaveFormSearch.START_DATE = "";
        $scope.MyLeaveFormSearch.END_DATE = "";
        $scope.DISPLAY_EMPLOYEE_TEXT_SEARCH = "";
        $scope.MyLeaveFormSearch.DURATION = "";
        $scope.MyLeaveFormSearch.START_TIME = "";
        $scope.MyLeaveFormSearch.END_TIME = "";
        $scope.MyLeaveFormSearch.UploadedFiles = [];
        $scope.MyLeaveFormSearch.REASON = "";
        $scope.MyLeaveFormSearch.IS_IGNORE_WORK_PATTERN = false;
        $scope.MyLeaveForm.submitted = false;
        $scope.calendarMonths = [];
    }
    $scope.RESET_TEAM_LEAVE_Fn = function () {

        $scope.SELECTED_ABSENCE_TYPE_TEAM_Fn('');
        $scope.SELECTED_EMPLOYEE_LIST_FOR_LEAVES_Fn('');
        $scope.TeamLeaveFormSearch.START_DATE = "";
        $scope.TeamLeaveFormSearch.START_DATE = "";
        $scope.TeamLeaveFormSearch.END_DATE = "";
        $scope.TeamLeaveFormSearch.DURATION = "";
        $scope.TeamLeaveFormSearch.START_TIME = "";
        $scope.TeamLeaveFormSearch.END_TIME = "";
        $scope.DISPLAY_EMPLOYEE_TEXT_SEARCH = "";
        $scope.TeamLeaveFormSearch.REASON = "";
        $scope.TeamLeaveFormSearch.DISPLAY_EMPLOYEE_TEXT_SEARCH = "";
        $scope.TeamLeaveFormSearch.UploadedFiles = [];
        $scope.TeamLeaveFormSearch.IGNORE_WORK_PATTERN = false;
        $scope.TeamLeaveFormSearch.LEAVE_REQUEST_BY_ID = [];
        $scope.TeamLeaveFormSearch.EMPLOYEE_LIST_TEAM = [];
        $scope.TeamLeaveFormSearch.LEAVE_REQUEST_BY_ID = [];
        $scope.TeamLeaveFormSearch.EMPLOYEE_LIST_TEAM = [];
        $scope.calendarMonthsTeam = [];
        $scope.TeamLeaveFormSearch.EMPLOYEE_ABSENCES_COUNT_LIST_TEAM = {
            ANNUAL_ALLOWANCE: 0,
            AVAILABLE_TILL_DATE: 0,
            CALCULATED_ACCRUED: 0,
            BOOKED: 0,
            BOOKED_APPROVED: 0,
            BOOKED_PENDING: 0,
            REMAINING_BALANCE: 0,
        };
        $scope.TeamLeaveForm.submitted = false;
    };

    $scope.DateInputLoadMyLeaveStartDate = function () {
        $(document).ready(function () {
            var date_start_inputs = document.getElementsByClassName("MyStartLeave") //our date input has the name "date"
            if (date_start_inputs.length > 0) {
                for (var i = 0; i < date_start_inputs.length; i++) {
                    var date_start_input = $('input[name="' + date_start_inputs[i].name + '"]'); //our date input has the name "date"
                    var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
                    // var dateStart = new Date($scope.CURRENT_DATE);
                    const dateStart = new Date($scope.CURRENT_DATE);
                    //  const today = new Date($scope.CURRENT_DATE);
                    //dateStart.setDate(today.getDate() - 200);
                    var optionsStart = {
                        todayBtn: "linked",
                        daysOfWeekHighlighted: "0,6",
                        autoclose: true,
                        todayHighlight: true,
                        format: 'dd/mm/yyyy',
                        clearBtn: true,
                        closeBtn: true,// close button visible
                        startDate: new Date(dateStart.getFullYear(), dateStart.getMonth(), dateStart.getDate())
                    };
                    date_start_input.datepicker(optionsStart);
                };
            }
        });
    }
    $scope.DateInputLoadMyLeaveEndDate = function () {
        var Endoptions = {}
        var date_end_inputs = document.getElementsByClassName("MyEndLeave") //our date input has the name "date"
        if (date_end_inputs.length > 0) {
            for (var i = 0; i < date_end_inputs.length; i++) {
                var date_end_input = $('input[name="' + date_end_inputs[i].name + '"]'); //our date input has the name "date"
                if ($scope.MyLeaveFormSearch.START_DATE == undefined || $scope.MyLeaveFormSearch.START_DATE == "" || $scope.MyLeaveFormSearch.START_DATE == "") {
                    var Enddate = new Date($scope.MY_LOCK_DATE);
                } else {
                    var Enddate = moment($scope.MyLeaveFormSearch.START_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate();
                }
                Endoptions = {
                    todayBtn: "linked",
                    daysOfWeekHighlighted: "0,6",
                    changeYear: true,
                    changeMonth: true,
                    //setStartDate: new Date(Enddate.getFullYear(), Enddate.getMonth(), Enddate.getDate()),
                    autoclose: true,
                    todayHighlight: true,
                    format: 'dd/mm/yyyy',
                    closeBtn: true,// close button visible
                    startDate: new Date(Enddate.getFullYear(), Enddate.getMonth(), Enddate.getDate())
                };
                date_end_input.datepicker(Endoptions);
            }
        }
    }
    $scope.DateInputLoadTeamLeaveStartDate = function () {
        $(document).ready(function () {
            var date_inputs = document.getElementsByClassName("TeamLeaveStartDate") //our date input has the name "date"
            if (date_inputs.length > 0) {
                for (var i = 0; i < date_inputs.length; i++) {
                    var date_input = $('input[name="' + date_inputs[i].name + '"]'); //our date input has the name "date"
                    var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
                    const oneWeekBack = new Date($scope.EMP_LOCK_DATE);
                    //const today = new Date($scope.EMP_LOCK_DATE);
                    //oneWeekBack.setDate(today.getDate() - 18)
                    var options = {
                        todayBtn: "linked",
                        daysOfWeekHighlighted: "0,6",
                        autoclose: true,
                        todayHighlight: true,
                        format: 'dd/mm/yyyy',
                        clearBtn: true,
                        closeBtn: true,// close button visible
                        startDate: oneWeekBack
                    };
                    date_input.datepicker(options);
                }
            }
        });
    }
    $scope.DateInputLoadTeamLeaveEndDate = function () {
        $(document).ready(function () {
            var date_inputs = document.getElementsByClassName("TeamLeaveEndDate") //our date input has the name "date"
            if (date_inputs.length > 0) {
                for (var i = 0; i < date_inputs.length; i++) {
                    var date_input = $('input[name="' + date_inputs[i].name + '"]'); //our date input has the name "date"
                    if ($scope.TeamLeaveFormSearch.START_DATE == undefined || $scope.TeamLeaveFormSearch.START_DATE == "" || $scope.TeamLeaveFormSearch.START_DATE == "") {
                        var Enddate = new Date($scope.EMP_LOCK_DATE);
                    } else {
                        //var Enddate = new Date($scope.TeamLeaveFormSearch.START_DATE);
                        var Enddate = moment($scope.TeamLeaveFormSearch.START_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate();
                    }
                    var options = {
                        todayBtn: "linked",
                        daysOfWeekHighlighted: "0,6",
                        autoclose: true,
                        todayHighlight: true,
                        format: 'dd/mm/yyyy',
                        clearBtn: true,
                        closeBtn: true,// close button visible
                        startDate: new Date(Enddate.getFullYear(), Enddate.getMonth(), Enddate.getDate())
                    };
                    date_input.datepicker(options);
                }
            }
        });
    }

    //$scope.DateInputLoadTeamLeave();
    $scope.HRM_INS_UPD_LEAVE_REQUESTS = function () {
        $scope.MyLeaveForm.submitted = true;
        if (!$scope.MyLeaveForm.$valid) {
        }
        //else if (new Date($scope.END_DATE_COMPLETE) < new Date($scope.START_DATE_COMPLETE)) {
        //    $scope.$parent.ShowAlertBox('Error', 'End date should not be less than start date', 3000);
        //}
        else if (moment($scope.END_DATE_COMPLETE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate() < moment($scope.START_DATE_COMPLETE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate()) {
            $scope.$parent.ShowAlertBox('Error', 'End date should not be less than start date', 3000);
        }
        //else if (moment($scope.START_DATE_COMPLETE_SEND, $scope.$parent.CONVERSION_DATE_FORMAT).toDate().isSame(($scope.END_DATE_COMPLETE_SEND, $scope.$parent.CONVERSION_DATE_FORMAT).toDate())) {
        //    $scope.$parent.ShowAlertBox('Error', 'End date should not be less than start date', 3000);
        //}
        else if (moment($scope.START_DATE_COMPLETE_SEND).isSame($scope.END_DATE_COMPLETE_SEND)) {
            $scope.$parent.ShowAlertBox('Error', 'End time should not be less than start time.', 3000);
        }
        else if ($scope.MY_SUBMITED_LEAVE == false) {
            $scope.$parent.ShowAlertBox('Error', 'You do not have entitlement for selected time period', 3000);
        }
        else if (($scope.MyLeaveFormSearch.START_TIME != undefined && $scope.MyLeaveFormSearch.START_TIME != null && $scope.MyLeaveFormSearch.START_TIME != '' && $scope.MyLeaveFormSearch.START_TIME != true) && ($scope.MyLeaveFormSearch.END_TIME == undefined || $scope.MyLeaveFormSearch.END_TIME == null || $scope.MyLeaveFormSearch.END_TIME == '' || $scope.MyLeaveFormSearch.END_TIME == true)) {
            $scope.$parent.ShowAlertBox('Error', 'Please select correct end time ', 1000);
        }
        else if ($scope.HRM_LEAVE_REQUEST_LINE_TYPE[0].ALLOW_NGTV_BAL == false && $scope.MyLeaveFormSearch.DURATION > $scope.EMPLOYEE_ABSENCES_COUNT_MY_APPLY_LEAVE_DETAILS.REMAINING_BALANCE) {
            $scope.$parent.ShowAlertBox('Error', 'There is insufficient balance.', 3000);
        }
        else if (($scope.MyLeaveFormSearch.START_TIME == undefined || $scope.MyLeaveFormSearch.START_TIME == null || $scope.MyLeaveFormSearch.START_TIME == '' || $scope.MyLeaveFormSearch.START_TIME == true) && ($scope.MyLeaveFormSearch.END_TIME != undefined && $scope.MyLeaveFormSearch.END_TIME != null && $scope.MyLeaveFormSearch.END_TIME != '' && $scope.MyLeaveFormSearch.END_TIME != true)) {
            $scope.$parent.ShowAlertBox('Error', 'Please select correct start time', 1000);
        }
        else {
            var LeaveModelObj = new Object();
            LeaveModelObj.LEAVE_REQUEST_ID = $scope.MyLeaveFormSearch.LEAVE_REQUEST_ID;
            LeaveModelObj.ABSENCE_TYPE_ID = $scope.MyLeaveFormSearch.ABSENCE_TYPE_ID;
            LeaveModelObj.EMPLY_PRSNL_ID = parseInt($cookies.get("EMPLY_PRSNL_ID"));
            LeaveModelObj.INITIATED_BY_EMPLY_PRSNL_ID = parseInt($cookies.get("EMPLY_PRSNL_ID"));
            LeaveModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            LeaveModelObj.START_DATE = $scope.START_DATE_COMPLETE_SEND;
            LeaveModelObj.END_DATE = $scope.END_DATE_COMPLETE_SEND;
            if ($scope.MyLeaveFormSearch.START_TIME == undefined || $scope.MyLeaveFormSearch.START_TIME == null || $scope.MyLeaveFormSearch.START_TIME == '' || $scope.MyLeaveFormSearch.START_TIME == true || $scope.MyLeaveFormSearch.END_TIME == undefined || $scope.MyLeaveFormSearch.END_TIME == null || $scope.MyLeaveFormSearch.END_TIME == '' || $scope.MyLeaveFormSearch.END_TIME == true) {

                LeaveModelObj.START_DATE = moment($scope.MyLeaveFormSearch.START_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate('L');
                LeaveModelObj.END_DATE = moment($scope.MyLeaveFormSearch.END_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate('L');

                LeaveModelObj.END_DATE.setHours(23)
                LeaveModelObj.END_DATE.setMinutes(59);
                LeaveModelObj.END_DATE.setSeconds(0);
                LeaveModelObj.START_DATE = $scope.HRM_CHANGE_UTC_TIME_ZONE_Fn(LeaveModelObj.START_DATE);
                LeaveModelObj.END_DATE = $scope.HRM_CHANGE_UTC_TIME_ZONE_Fn(LeaveModelObj.END_DATE);

            }
            else {
                if ($scope.MyLeaveFormSearch.START_TIME != undefined && $scope.MyLeaveFormSearch.START_TIME != '' && $scope.MyLeaveFormSearch.START_TIME != null && $scope.MyLeaveFormSearch.START_TIME != true) {
                    var start = moment($scope.MyLeaveFormSearch.START_TIME).format('H:mm');
                    var end = moment($scope.MyLeaveFormSearch.END_TIME).format('H:mm');
                    var ST = start.split(':');
                    var ET = end.split(':');
                    const START_TIME = moment($scope.START_DATE_COMPLETE, $scope.$parent.CONVERSION_DATE_FORMAT);
                    const END_TIME = moment($scope.END_DATE_COMPLETE, $scope.$parent.CONVERSION_DATE_FORMAT);
                    if (ST.length > 0) {
                        START_TIME.set({ hour: ST[0], minute: ST[1], second: 0, millisecond: 0 });
                    }
                    if (ET.length > 0) {
                        END_TIME.set({ hour: ET[0], minute: ET[1], second: 0, millisecond: 0 });
                    }
                    LeaveModelObj.START_DATE = START_TIME;
                    LeaveModelObj.END_DATE = END_TIME;
                }
            }
            LeaveModelObj.START_DATE = $scope.HRM_CHANGE_UTC_TIME_ZONE_Fn(LeaveModelObj.START_DATE);
            LeaveModelObj.END_DATE = $scope.HRM_CHANGE_UTC_TIME_ZONE_Fn(LeaveModelObj.END_DATE);
            LeaveModelObj.REASON = $scope.MyLeaveFormSearch.REASON;
            LeaveModelObj.IGNORE_WORK_PATTERN = $scope.MyLeaveFormSearch.IS_IGNORE_WORK_PATTERN ? 1 : 0;
            LeaveModelObj.USER_ID = parseInt($cookies.get("USERID"));
            LeaveModelObj.UPLOAD_IDS = '';
            if ($scope.MyLeaveFormSearch.UploadedFiles != undefined && $scope.MyLeaveFormSearch.UploadedFiles != null && $scope.MyLeaveFormSearch.UploadedFiles.length > 0) {
                angular.forEach($scope.MyLeaveFormSearch.UploadedFiles, function (val) { if (LeaveModelObj.UPLOAD_IDS == '') { LeaveModelObj.UPLOAD_IDS = val.UPLOAD_ID; } else { LeaveModelObj.UPLOAD_IDS = LeaveModelObj.UPLOAD_IDS + ',' + val.UPLOAD_ID; }; });
            }
            LeaveModelObj.TIME_ZONE = $cookies.get("TIMEZONE_OFFSET");
            LeaveModelObj.IS_WEB = 1;
            LeaveModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
            //LeaveModelObj.START_DATE = $scope.MyLeaveFormSearch.START_DATE;
            //LeaveModelObj.END_DATE = $scope.MyLeaveFormSearch.END_DATE;
            LeaveModelObj.REASON = $scope.MyLeaveFormSearch.REASON;
            // LeaveModelObj.DURATION = $scope.MyLeaveFormSearch.DURATION;
            LeaveModelObj.ASSIGNMENT_REQUIRED = $scope.MyLeaveFormSearch.ASSIGNMENT_REQUIRED ? 1 : 0;
            LeaveModelObj.WORK_PATTERN_ID = $scope.HRM_LEAVE_REQUEST_LINE_TYPE[0].WORK_PATTERN_ID;
            LeaveModelObj.UNITS_ID = $scope.HRM_LEAVE_REQUEST_LINE_TYPE[0].UNITS_ID;
            LeaveModelObj.HRM_LEAVE_REQUEST_LINE_TYPE = [];
            angular.forEach($scope.calendarMonths, function (_month_loop_value) {
                angular.forEach(_month_loop_value.weeks, function (_Week_loop_value) {
                    angular.forEach(_Week_loop_value.days, function (_day_loop_value) {
                        //angular.forEach($scope.HRM_LEAVE_REQUEST_LINE_TYPE, function (_loop_value) {
                        if (_day_loop_value.DATE.getMonth() === _month_loop_value.monthIndex && _day_loop_value.Value == false) {
                            var userdurationvalue = $scope.HRM_LEAVE_REQUEST_LINE_TYPE.filter(function (x) { return isSameDay(x.LEAVE_DATE, _day_loop_value.DATE) });
                            if (userdurationvalue.length > 0) {
                                _loop_value = userdurationvalue[0];
                                var readonly = new Object()
                                readonly.LEAVE_DATE = _loop_value.LEAVE_DATE;
                                readonly.DURATION = _day_loop_value.SELECTED_DURATION ? _day_loop_value.DURATION : 0; // User selected duration 
                                readonly.HOLIDAY_ENTITLEMENT_ID = _loop_value.HOLIDAY_ENTITLEMENT_ID;
                                readonly.EMPLOYEE_ABSENCE_ID = _loop_value.EMPLOYEE_ABSENCE_ID;
                                readonly.HOLIDAY_CALENDAR_LINE_ID = _loop_value.HOLIDAY_CALENDAR_LINE_ID;
                                readonly.EVENT_NAME = _loop_value.EVENT_NAME;
                                readonly.NON_WORKING_DAY_BY_WORK_PATTERN = _loop_value.NON_WORKING_DAY_BY_WORK_PATTERN;
                                readonly.IGNORE = _loop_value.IGNORE;
                                readonly.ORIGINAL_DURATION = _loop_value.ORIGINAL_DURATION;  // Original duration
                                LeaveModelObj.HRM_LEAVE_REQUEST_LINE_TYPE.push(readonly);
                            }
                        }
                        //});
                    });
                })
            })

            LeaveModelObj.DURATION = $filter('sumOfValue')(LeaveModelObj.HRM_LEAVE_REQUEST_LINE_TYPE, 'DURATION');
            PrcCommMethods.HUMANRESOURCE_API(LeaveModelObj, 'HRM_INS_UPD_LEAVE_REQUESTS').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.$parent.ShowAlertBox("Error", "there is already a leave in b/w of selected dates", 3000);
                }
                if (data.data.Table.length == 0) {
                    if (parseInt($cookies.get("EMPLY_PRSNL_ID")) == 0) {
                        $scope.$parent.ShowAlertBox("Success", "Leave Applied Successfully", 3000);
                    }
                    else {
                        $scope.$parent.ShowAlertBox("Success", "leave request submitted for managers approval", 3000);
                    }
                    // $scope.RESET_MASTER_LEAVE();
                    $scope.MY_HRM_LEAVE_REQUEST_LIST(1);
                    $scope.HRM_GET_EMPLOYEE_ABSENCES_COUNT();
                    $scope.RESET_MY_LEAVE_Fn();
                };
            });
        };
    }
    $scope.HRM_INS_UPD_LEAVE_REQUESTS_TEAM = function () {
        $scope.TeamLeaveForm.submitted = true;
        if (!$scope.TeamLeaveForm.$valid) {
        }
        //else if (new Date($scope.END_DATE_TEAM_COMPLETE) < new Date($scope.START_DATE_COMPLETE)) {
        //    $scope.$parent.ShowAlertBox('Error', 'End date should not be less than start date', 3000);
        //}
        else if (moment($scope.END_DATE_TEAM_COMPLETE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate() < moment($scope.START_DATE_TEAM_COMPLETE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate()) {
            $scope.$parent.ShowAlertBox('Error', 'End date should not be less than start date', 3000);
        }
        else if (moment($scope.START_DATE_TEAM_COMPLETE_SEND).isSame($scope.END_DATE_TEAM_COMPLETE_SEND)) {
            $scope.$parent.ShowAlertBox('Error', 'End time should not be less than start time.', 3000);
        }
        else if ($scope.TEAM_SUBMITED_LEAVE == false) {
            $scope.$parent.ShowAlertBox('Error', 'You do not have entitlement for selected time period', 3000);
        }
        //else if (!(moment($scope.START_DATE_COMPLETE_SEND).isBetween(moment($scope.REMAINING_DAYS.ALLOWED_RANGE_START), moment(REND), undefined, '[]'))) {
        //    $scope.$parent.ShowAlertBox('Error', 'You do not have entitlement for previous year', 1000);
        //}
        else if (($scope.TeamLeaveFormSearch.START_TIME != undefined && $scope.TeamLeaveFormSearch.START_TIME != null && $scope.TeamLeaveFormSearch.START_TIME != '' && $scope.TeamLeaveFormSearch.START_TIME != true) && ($scope.TeamLeaveFormSearch.END_TIME == undefined || $scope.TeamLeaveFormSearch.END_TIME == null || $scope.TeamLeaveFormSearch.END_TIME == '' || $scope.TeamLeaveFormSearch.END_TIME == true)) {
            $scope.$parent.ShowAlertBox('Error', 'Please select correct end time ', 1000);
        }
        else if ($scope.HRM_LEAVE_REQUEST_LINE_TYPE_TEAM[0].ALLOW_NGTV_BAL == false && $scope.TeamLeaveFormSearch.DURATION > $scope.TeamLeaveFormSearch.EMPLOYEE_ABSENCES_COUNT_LIST_TEAM.REMAINING_BALANCE) {
            $scope.$parent.ShowAlertBox('Error', 'There is insufficient balance.', 3000);
        }
        else if (($scope.TeamLeaveFormSearch.START_TIME == undefined || $scope.TeamLeaveFormSearch.START_TIME == null || $scope.TeamLeaveFormSearch.START_TIME == '' || $scope.TeamLeaveFormSearch.START_TIME == true) && ($scope.TeamLeaveFormSearch.END_TIME != undefined && $scope.TeamLeaveFormSearch.END_TIME != null && $scope.TeamLeaveFormSearch.END_TIME != '' && $scope.TeamLeaveFormSearch.END_TIME != true)) {
            $scope.$parent.ShowAlertBox('Error', 'Please select correct start time', 1000);
        }
        else {
            var LeaveModelObj = new Object();
            LeaveModelObj.LEAVE_REQUEST_ID = $scope.TeamLeaveFormSearch.LEAVE_REQUEST_ID;
            LeaveModelObj.EMPLY_PRSNL_ID = $scope.TeamLeaveFormSearch.DDL_EMPLOYEE_ID;
            // LeaveModelObj.EMP_PRS_ID  Dropdown
            LeaveModelObj.INITIATED_BY_EMPLY_PRSNL_ID = parseInt($cookies.get("EMPLY_PRSNL_ID")) == 0 ? null : parseInt($cookies.get("EMPLY_PRSNL_ID"));
            //LeaveModelObj.INITIATED_BY_EMP_ID  login user
            LeaveModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            LeaveModelObj.ABSENCE_TYPE_ID = $scope.TeamLeaveFormSearch.ABSENCE_TYPE_ID;

            LeaveModelObj.START_DATE = $scope.START_DATE_TEAM_COMPLETE_SEND;
            LeaveModelObj.END_DATE = $scope.END_DATE_TEAM_COMPLETE_SEND;
            if ($scope.TeamLeaveFormSearch.START_TIME == undefined || $scope.TeamLeaveFormSearch.START_TIME == null || $scope.TeamLeaveFormSearch.START_TIME == '' || $scope.TeamLeaveFormSearch.START_TIME == true || $scope.TeamLeaveFormSearch.END_TIME == undefined || $scope.TeamLeaveFormSearch.END_TIME == null || $scope.TeamLeaveFormSearch.END_TIME == '' || $scope.TeamLeaveFormSearch.END_TIME == true) {

                //LeaveModelObj.START_DATE = $scope.TeamLeaveFormSearch.START_DATE;
                //LeaveModelObj.END_DATE = new Date($scope.TeamLeaveFormSearch.END_DATE);

                //LeaveModelObj.END_DATE.setHours(23)
                //LeaveModelObj.END_DATE.setMinutes(59);
                //LeaveModelObj.END_DATE.setSeconds(0);
                LeaveModelObj.START_DATE = moment($scope.TeamLeaveFormSearch.START_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate('L');
                LeaveModelObj.END_DATE = moment($scope.TeamLeaveFormSearch.END_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate('L');

                LeaveModelObj.END_DATE.setHours(23)
                LeaveModelObj.END_DATE.setMinutes(59);
                LeaveModelObj.END_DATE.setSeconds(0);
                LeaveModelObj.START_DATE = $scope.HRM_CHANGE_UTC_TIME_ZONE_Fn(LeaveModelObj.START_DATE);
                LeaveModelObj.END_DATE = $scope.HRM_CHANGE_UTC_TIME_ZONE_Fn(LeaveModelObj.END_DATE);


            }
            else {
                if ($scope.TeamLeaveFormSearch.START_TIME != undefined && $scope.TeamLeaveFormSearch.START_TIME != '' && $scope.TeamLeaveFormSearch.START_TIME != null && $scope.TeamLeaveFormSearch.START_TIME != true) {
                    var start = moment($scope.TeamLeaveFormSearch.START_TIME).format('H:mm');
                    var end = moment($scope.TeamLeaveFormSearch.END_TIME).format('H:mm');
                    var ST = start.split(':');
                    var ET = end.split(':');
                    const START_TIME = moment($scope.START_DATE_TEAM_COMPLETE, $scope.$parent.CONVERSION_DATE_FORMAT);
                    const END_TIME = moment($scope.END_DATE_TEAM_COMPLETE, $scope.$parent.CONVERSION_DATE_FORMAT);
                    if (ST.length > 0) {
                        START_TIME.set({ hour: ST[0], minute: ST[1], second: 0, millisecond: 0 });
                        //START_TIME.setHours(ST[0]); START_TIME.setMinutes(ST[1]); START_TIME.setSeconds(0);
                    }
                    if (ET.length > 0) {
                        END_TIME.set({ hour: ET[0], minute: ET[1], second: 0, millisecond: 0 });
                        //  END_TIME.setHours(ET[0]); END_TIME.setMinutes(ET[1]); END_TIME.setSeconds(0);
                    }
                    LeaveModelObj.START_DATE = START_TIME;
                    LeaveModelObj.END_DATE = END_TIME;
                }
            }

            LeaveModelObj.START_DATE = $scope.HRM_CHANGE_UTC_TIME_ZONE_Fn(LeaveModelObj.START_DATE);
            LeaveModelObj.END_DATE = $scope.HRM_CHANGE_UTC_TIME_ZONE_Fn(LeaveModelObj.END_DATE);
            LeaveModelObj.COMMENTS = $scope.TeamLeaveFormSearch.COMMENTS;
            LeaveModelObj.USER_ID = parseInt($cookies.get("USERID"));
            LeaveModelObj.UPLOAD_IDS = '';
            if ($scope.TeamLeaveFormSearch.UploadedFiles != undefined && $scope.TeamLeaveFormSearch.UploadedFiles != null && $scope.TeamLeaveFormSearch.UploadedFiles.length > 0) {
                angular.forEach($scope.TeamLeaveFormSearch.UploadedFiles, function (val) { if (LeaveModelObj.UPLOAD_IDS == '') { LeaveModelObj.UPLOAD_IDS = val.UPLOAD_ID; } else { LeaveModelObj.UPLOAD_IDS = LeaveModelObj.UPLOAD_IDS + ',' + val.UPLOAD_ID; }; });
            }
            LeaveModelObj.TIME_ZONE = $cookies.get("TIMEZONE_OFFSET");
            LeaveModelObj.CUSTOMER_ID = $cookies.get("CUSTOMER_ID");
            LeaveModelObj.REASON = $scope.TeamLeaveFormSearch.REASON;
            LeaveModelObj.IGNORE_WORK_PATTERN = $scope.TeamLeaveFormSearch.IS_IGNORE_WORK_PATTERN ? 1 : 0;
            //LeaveModelObj.DURATION = $scope.TeamLeaveFormSearch.DURATION;
            LeaveModelObj.UNITS_ID = $scope.TeamLeaveFormSearch.UNITS_ID;
            if ($scope.HRM_LEAVE_REQUEST_LINE_TYPE_TEAM.length > 0) {
                LeaveModelObj.UNITS_ID = $scope.HRM_LEAVE_REQUEST_LINE_TYPE_TEAM[0].UNITS_ID;
                LeaveModelObj.WORK_PATTERN_ID = $scope.HRM_LEAVE_REQUEST_LINE_TYPE_TEAM[0].WORK_PATTERN_ID;
            }
            LeaveModelObj.HRM_LEAVE_REQUEST_LINE_TYPE = [];

            //angular.forEach($scope.HRM_LEAVE_REQUEST_LINE_TYPE_TEAM, function (_loop_value) {
            //    var readonly = new Object()
            //    readonly.LEAVE_DATE = _loop_value.LEAVE_DATE;
            //    readonly.DURATION = _loop_value.DURATION;
            //    readonly.HOLIDAY_ENTITLEMENT_ID = _loop_value.HOLIDAY_ENTITLEMENT_ID;
            //    readonly.EMPLOYEE_ABSENCE_ID = _loop_value.EMPLOYEE_ABSENCE_ID;
            //    readonly.HOLIDAY_CALENDAR_LINE_ID = _loop_value.HOLIDAY_CALENDAR_LINE_ID;
            //    readonly.EVENT_NAME = _loop_value.EVENT_NAME;
            //    readonly.NON_WORKING_DAY_BY_WORK_PATTERN = _loop_value.NON_WORKING_DAY_BY_WORK_PATTERN;
            //    readonly.IGNORE = _loop_value.IGNORE;
            //    readonly.ORIGINAL_DURATION = _loop_value.ORIGINAL_DURATION;
            //    LeaveModelObj.HRM_LEAVE_REQUEST_LINE_TYPE.push(readonly);
            //});
            angular.forEach($scope.calendarMonthsTeam, function (_month_loop_value) {
                angular.forEach(_month_loop_value.weeks, function (_Week_loop_value) {
                    angular.forEach(_Week_loop_value.days, function (_day_loop_value) {
                        //angular.forEach($scope.HRM_LEAVE_REQUEST_LINE_TYPE, function (_loop_value) {
                        if (_day_loop_value.DATE.getMonth() === _month_loop_value.monthIndex && _day_loop_value.Value == false) {
                            var userdurationvalue = $scope.HRM_LEAVE_REQUEST_LINE_TYPE_TEAM.filter(function (x) { return isSameDay(x.LEAVE_DATE, _day_loop_value.DATE) });
                            if (userdurationvalue.length > 0) {
                                _loop_value = userdurationvalue[0];
                                var readonly = new Object()
                                readonly.LEAVE_DATE = _loop_value.LEAVE_DATE;
                                readonly.DURATION = _day_loop_value.SELECTED_DURATION ? _day_loop_value.DURATION : 0; // User selected duration 
                                readonly.HOLIDAY_ENTITLEMENT_ID = _loop_value.HOLIDAY_ENTITLEMENT_ID;
                                readonly.EMPLOYEE_ABSENCE_ID = _loop_value.EMPLOYEE_ABSENCE_ID;
                                readonly.HOLIDAY_CALENDAR_LINE_ID = _loop_value.HOLIDAY_CALENDAR_LINE_ID;
                                readonly.EVENT_NAME = _loop_value.EVENT_NAME;
                                readonly.NON_WORKING_DAY_BY_WORK_PATTERN = _loop_value.NON_WORKING_DAY_BY_WORK_PATTERN;
                                readonly.IGNORE = _loop_value.IGNORE;
                                readonly.ORIGINAL_DURATION = _loop_value.ORIGINAL_DURATION;  // Original duration
                                LeaveModelObj.HRM_LEAVE_REQUEST_LINE_TYPE.push(readonly);
                            }
                        }
                        //});
                    });
                });
            });
            LeaveModelObj.DURATION = $filter('sumOfValue')(LeaveModelObj.HRM_LEAVE_REQUEST_LINE_TYPE, 'DURATION');
            PrcCommMethods.HUMANRESOURCE_API(LeaveModelObj, 'HRM_INS_UPD_LEAVE_REQUESTS').then(function (data) {
                if (data.data.Table.length > 0) {
                    //if (parseInt($cookies.get("EMPLY_PRSNL_ID")) == 0) {
                    //    $scope.$parent.ShowAlertBox("Success", "Leave request successfully submitted", 3000);
                    //}
                    //else {
                    //    if ($scope.LEAVE_TAB == 1) {
                    //        $scope.$parent.ShowAlertBox("Success", "leave request submitted for managers approval", 3000);
                    //    }
                    //    if ($scope.LEAVE_TAB == 2) {
                    //        $scope.$parent.ShowAlertBox("Success", "Leave request successfully submitted", 3000);
                    //    }
                    //}
                    $scope.$parent.ShowAlertBox("Error", "there is already a leave in b/w of selected dates", 3000);
                    //$scope.TEAM_HRM_LEAVE_REQUEST_LIST(1);
                    //$scope.RESET_TEAM_LEAVE_Fn();
                }
                if (data.data.Table.length == 0) {
                    if ($scope.LEAVE_TAB == 1) {
                        $scope.$parent.ShowAlertBox("Success", "leave request submitted for managers approval", 3000);
                    }
                    if ($scope.LEAVE_TAB == 2) {
                        $scope.$parent.ShowAlertBox("Success", "Leave request successfully submitted", 3000);
                    }
                    $('#leave').modal('hide');
                    $scope.TEAM_HRM_LEAVE_REQUEST_LIST(1);
                    $scope.RESET_TEAM_LEAVE_Fn();
                }
            });
        }
    }

    $scope.HRM_LEAVE_APP_REJ_LEAVE_REQUESTS = function (STATUS_ID) {
        var LeaveModelObj = new Object();
        LeaveModelObj.LEAVE_REQ_ID = $scope.SELECTED_LEAVE_DETAILS.LEAVE_REQUEST_ID;
        LeaveModelObj.STATUS_ID = STATUS_ID;
        LeaveModelObj.EMPLY_PRSNL_ID = parseInt($cookies.get("EMPLY_PRSNL_ID"));
        LeaveModelObj.COMMENTS = $scope.SELECTED_LEAVE_DETAILS.COMMENTS;
        LeaveModelObj.USER_ID = parseInt($cookies.get("USERID"));
        var InvalidCount = 0;
        if (STATUS_ID == 87) {
            if ($scope.EDIT_SUBMITED_LEAVE == false && $scope.SELECTED_LEAVE_DETAILS.ABSENCE_TYPE_ID != $scope.SELECTED_LEAVE_DETAILS.CUSTOM_ABSENCE_TYPE_ID) {
                $scope.$parent.ShowAlertBox('Error', 'You do not have entitlement for selected time period', 3000);
                InvalidCount = 1;
            }
            else if ($scope.SELECTED_LEAVE_DETAILS.ABSENCE_TYPE_ID != $scope.SELECTED_LEAVE_DETAILS.CUSTOM_ABSENCE_TYPE_ID &&
                $scope.SELECTED_LEAVE_DETAILS.DURATION_LIST[0].ALLOW_NGTV_BAL == false
                && $scope.SELECTED_LEAVE_DETAILS.DURATION > $scope.SELECTED_LEAVE_DETAILS.EMPLOYEE_ABSENCES_COUNT_LIST_TEAM.REMAINING_BALANCE) {
                $scope.$parent.ShowAlertBox('Error', 'There is insufficient balance.', 3000);
                InvalidCount = 1;
            }
            else {
                LeaveModelObj.LEAVE_REQUEST_ID = $scope.SELECTED_LEAVE_DETAILS.LEAVE_REQUEST_ID;
                LeaveModelObj.EMPLY_PRSNL_ID = $scope.SELECTED_LEAVE_DETAILS.EMPLY_PRSNL_ID;
                LeaveModelObj.INITIATED_BY_EMPLY_PRSNL_ID = parseInt($cookies.get("EMPLY_PRSNL_ID")) == 0 ? null : parseInt($cookies.get("EMPLY_PRSNL_ID"));
                LeaveModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
                LeaveModelObj.ABSENCE_TYPE_ID = $scope.SELECTED_LEAVE_DETAILS.CUSTOM_ABSENCE_TYPE_ID;
                LeaveModelObj.START_DATE = $scope.SELECTED_LEAVE_DETAILS.START_DATE;
                LeaveModelObj.END_DATE = $scope.SELECTED_LEAVE_DETAILS.END_DATE;
                LeaveModelObj.USER_ID = parseInt($cookies.get("USERID"));
                LeaveModelObj.UPLOAD_IDS = '';
                if ($scope.SELECTED_LEAVE_DETAILS.UploadedFiles != undefined && $scope.SELECTED_LEAVE_DETAILS.UploadedFiles != null
                    && $scope.SELECTED_LEAVE_DETAILS.UploadedFiles.length > 0) {
                    angular.forEach($scope.SELECTED_LEAVE_DETAILS.UploadedFiles, function (val) { if (LeaveModelObj.UPLOAD_IDS == '') { LeaveModelObj.UPLOAD_IDS = val.UPLOAD_ID; } else { LeaveModelObj.UPLOAD_IDS = LeaveModelObj.UPLOAD_IDS + ',' + val.UPLOAD_ID; }; });
                }
                LeaveModelObj.TIME_ZONE = $cookies.get("TIMEZONE_OFFSET");
                LeaveModelObj.CUSTOMER_ID = $cookies.get("CUSTOMER_ID");
                LeaveModelObj.REASON = $scope.SELECTED_LEAVE_DETAILS.REASON;
                LeaveModelObj.IGNORE_WORK_PATTERN = $scope.SELECTED_LEAVE_DETAILS.IS_IGNORE_WORK_PATTERN ? 1 : 0;
                // LeaveModelObj.DURATION = $scope.SELECTED_LEAVE_DETAILS.DURATION;
                LeaveModelObj.UNITS_ID = $scope.SELECTED_LEAVE_DETAILS.CUSTOM_UNITS_ID;
                LeaveModelObj.WORK_PATTERN_ID = $scope.SELECTED_LEAVE_DETAILS.WORK_PATTERN_ID;
                LeaveModelObj.HRM_LEAVE_REQUEST_LINE_TYPE = [];
                LeaveModelObj.IS_CHANGED = $scope.SELECTED_LEAVE_DETAILS.ABSENCE_TYPE_ID == $scope.SELECTED_LEAVE_DETAILS.CUSTOM_ABSENCE_TYPE_ID ? 0 : 1;
                angular.forEach($scope.SELECTED_LEAVE_DETAILS.calendarMonths, function (_month_loop_value) {
                    angular.forEach(_month_loop_value.weeks, function (_Week_loop_value) {
                        angular.forEach(_Week_loop_value.days, function (_day_loop_value) {
                            if (_day_loop_value.DATE.getMonth() === _month_loop_value.monthIndex && _day_loop_value.Value == false) {
                                var userdurationvalue = $scope.SELECTED_LEAVE_DETAILS.DURATION_LIST.filter(function (x) { return isSameDay(x.LEAVE_DATE, _day_loop_value.DATE) });
                                if (userdurationvalue.length > 0) {
                                    _loop_value = userdurationvalue[0];
                                    if (_day_loop_value.IS_CHANGED == 1 && LeaveModelObj.IS_CHANGED == 0) {
                                        LeaveModelObj.IS_CHANGED = 1;
                                    }
                                    var readonly = new Object()
                                    readonly.LEAVE_DATE = _loop_value.LEAVE_DATE;
                                    readonly.DURATION = _day_loop_value.SELECTED_DURATION ? _day_loop_value.ORIGINAL_DURATION : 0; // User selected duration 
                                    readonly.HOLIDAY_ENTITLEMENT_ID = _loop_value.HOLIDAY_ENTITLEMENT_ID;
                                    readonly.EMPLOYEE_ABSENCE_ID = _loop_value.EMPLOYEE_ABSENCE_ID;
                                    readonly.HOLIDAY_CALENDAR_LINE_ID = _loop_value.HOLIDAY_CALENDAR_LINE_ID;
                                    readonly.EVENT_NAME = _loop_value.EVENT_NAME;
                                    readonly.NON_WORKING_DAY_BY_WORK_PATTERN = _loop_value.NON_WORKING_DAY_BY_WORK_PATTERN;
                                    readonly.IGNORE = _loop_value.IGNORE;
                                    readonly.ORIGINAL_DURATION = _loop_value.ORIGINAL_DURATION;  // Original duration
                                    LeaveModelObj.HRM_LEAVE_REQUEST_LINE_TYPE.push(readonly);
                                }
                            }
                        });
                    });
                });
                LeaveModelObj.DURATION = $filter('sumOfValue')(LeaveModelObj.HRM_LEAVE_REQUEST_LINE_TYPE, 'DURATION');
            }
        }
        if (InvalidCount == 0) {
            PrcCommMethods.HUMANRESOURCE_API(LeaveModelObj, 'HRM_LEAVE_APP_REJ_LEAVE_REQUESTS').then(function (data) {
                if (data.data == 1) {
                    $scope.SELECTED_LEAVE_DETAILS = {};
                    $('#Reject_Leave').modal('hide');
                    $('#Approve_Leave').modal('hide');
                    $('#Cancel_Leave').modal('hide');
                    if (STATUS_ID == 89) {
                        $scope.$parent.ShowAlertBox("Success", "Leave Cancelled Successfully", 3000);
                    } else {
                        $scope.$parent.ShowAlertBox("Success", "Leave" + (STATUS_ID == 88 ? "  Rejected Successfully" : " Approved Successfully"), 3000);
                    }
                    if ($scope.LEAVE_TAB == 1) {
                        $scope.MY_HRM_LEAVE_REQUEST_LIST(1);
                        $scope.HRM_GET_EMPLOYEE_ABSENCES_COUNT();
                        $scope.RESET_MY_LEAVE_Fn();
                    }
                    else if ($scope.LEAVE_TAB == 2) {
                        $scope.TEAM_HRM_LEAVE_REQUEST_LIST(1);
                        $scope.RESET_TEAM_LEAVE_Fn();
                    }
                }
                else if (data.data == -1) {
                    $scope.$parent.ShowAlertBox("Success", "There is insufficient balance.", 3000);
                    if ($scope.LEAVE_TAB == 1) {
                        $scope.MY_HRM_LEAVE_REQUEST_LIST(1);
                        $scope.HRM_GET_EMPLOYEE_ABSENCES_COUNT();
                        $scope.RESET_MY_LEAVE_Fn();
                    }
                    else if ($scope.LEAVE_TAB == 2) {
                        $scope.TEAM_HRM_LEAVE_REQUEST_LIST(1);
                        $scope.RESET_TEAM_LEAVE_Fn();
                    }
                }
                else if (data.data == -2) {
                    $scope.$parent.ShowAlertBox("Success", "Someone has already taken action on the same leave request.", 3000);
                    if ($scope.LEAVE_TAB == 1) {
                        $scope.MY_HRM_LEAVE_REQUEST_LIST(1);
                        $scope.HRM_GET_EMPLOYEE_ABSENCES_COUNT();
                        $scope.RESET_MY_LEAVE_Fn();

                    }
                    else if ($scope.LEAVE_TAB == 2) {
                        $scope.TEAM_HRM_LEAVE_REQUEST_LIST(1);
                        $scope.RESET_TEAM_LEAVE_Fn();
                    }
                }
                if (data.data == 0) {
                }
            });
        }
        if (InvalidCount == 1) {
            $('#Approve_Leave').modal('show');
        }
    }
    $scope.GET_CUSTOMER_SETTINGS($scope.MyLeaveFormSearch, '88,61');
    //  $scope.DateInputLoadMyLeave();
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
    $scope.GET_UTC_TIME = function () {
        var UserModelObj = new Object();
        UserModelObj.TIMEZONE_OFFSET = "00:00";
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'GET_UTC_TIME').then(function (data) {
            $scope.CURRENT_DATE = new Date(data.data);
            $scope.FISICAL_YEAR_ID = new Date(data.data).getFullYear();
            $scope.YEAR_VALUE = "" + new Date(data.data).getFullYear();
            $scope.update_fisical_year(data.data);

            $scope.SELECTED_EMPLOYEE_LIST_FOR_LEAVES_Fn('');
            $scope.SELECTED_FILTER_ABSENCE_TYPE_MY_Fn('')
            $scope.SELECTED_ABSENCE_TYPE_Fn('');
            $scope.SELECTED_ABSENCE_TYPE_TEAM_Fn('');
            $scope.SELECTED_FILTER_ABSENCE_TYPE_TEAM_Fn('');

            if ($scope.MyLeaveFormSearch.EMPLY_PRSNL_ID > 0) {
                $scope.LEAVE_TAB_Fn(1);
            }
            else {
                $scope.LEAVE_TAB_Fn(2);
            }
        });
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
    $scope.GET_HRM_LOCK_DATE();


    $scope.HRM_VALIDATE_QR_FOR_SHIFT_LOGIN = function () {
        var UserModelObj = new Object();
        UserModelObj.QR_VALUE = '2826';
        UserModelObj.HRM_SCHDL_SHFT_ID = '5062';
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'HRM_VALIDATE_QR_FOR_SHIFT_LOGIN').then(function (data) {

        });
    }
    $scope.HRM_SCHDL_MOB_GET_EMPLOYEES_IN_CURRENT_SHIFT = function () {
        var UserModelObj = new Object();
        UserModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        UserModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        UserModelObj.MODULE_ID = '24';
        UserModelObj.STANDARD_ROLE_ID = '11';
        UserModelObj.BUSINESS_DATE = '2025-01-30T00:00:00.000';
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'HRM_SCHDL_MOB_GET_EMPLOYEES_IN_CURRENT_SHIFT').then(function (data) {

        });
    }
    $scope.HRM_SCHDL_MOB_GET_EMPLOYEES_IN_CURRENT_SHIFT();

    if ($scope.$parent.MASTER_GET_CUSTOMER_SETTINGS_VALUES(46) == 1) { //12
        $scope.TIME_FORMAT = "h:mm a";
    }
    else { //2 //24
        $scope.TIME_FORMAT = "HH:mm";
    }
});