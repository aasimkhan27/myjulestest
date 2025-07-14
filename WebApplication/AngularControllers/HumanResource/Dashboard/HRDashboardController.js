app.controller('HRDashboardController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $interval) {
    //$scope.$parent.DISPLAY_FLAG = false;
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(2);
    $scope.HR_COMMON_CODE_Fn();
    $scope.DashboardSearch = {
        EMPLY_PRSNL_ID: $cookies.get("EMPLY_PRSNL_ID") == null ? 0 : $cookies.get("EMPLY_PRSNL_ID"),
        MISSING_EMAIL: 0,
        MISSING_ADDRESS: 0,
        MISSING_BANK_ACCOUNT: 0,
        MISSING_EMERGENCY_CONTACT: 0,
        MISSING_PRIMARY_PHONE: 0,
        PAGE_NO_N: 1,
        PAGE_NO_A: 1,
        PAGE_NO_R: 1,
        PAGE_SIZE: 10,
        DSHBRD_GET_DEPARTMENT: {
        },
        EMPLOYEE_ABSENCES_COUNT_LIST: {
            ANNUAL_ALLOWANCE: 0,
            CALCULATED_ACCRUED: 0,
            AVAILABLE_TILL_DATE: 0,
            BOOKED: 0,
            BOOKED_APPROVED: 0,
            BOOKED_PENDING: 0,
            REMAINING_BALANCE: 0,
            TAKEN: 0,
            UNIT_NAME: '-'
        },
        DSHBRD_GET_PRIMARY_DETAILS: {
        }
    }
    $scope.IS_SUPER_ADMIN = false;
    $scope.IS_HR_MANAGER = false;
    $scope.IS_SITE_MANAGER = false;
    $scope.IS_TEAM_MANAGER = false;
    $scope.IS_EMPLOYEE = false;
   
    $scope.FORMATE_DATE_TIME = 'h:mm a'
    $scope.SCHDL_MOB_GET_SHIFTS_LEAVES_BY_DATE_LIST = [];
    $scope.DashboardSearch.IS_KNOWN_AS = $scope.$parent.MASTER_GET_CUSTOMER_SETTINGS_VALUES(54);
    if ($scope.$parent.CheckStandardRoleAccess(5) || $scope.$parent.CheckStandardRoleAccess(10) || $scope.$parent.CheckStandardRoleAccess(15)) {
        //Employee //5, 10, 15 Employee
        $scope.IS_EMPLOYEE = true;
        $scope.DashboardSearch.VIEW_TYPE = 1;
        $scope.TEAM_VIEW_FLAG = 2;
        $scope.DashboardSearch.COMPLIANCE = '#!/PrimaryDetails?EMP_ID=' + $scope.DashboardSearch.EMPLY_PRSNL_ID + '&STEP_NO=9';
    } else {
        $scope.DashboardSearch.VIEW_TYPE = 2;
        //$scope.TEAM_VIEW_FLAG = 3;  MANAGER TEAM old code end by database side 
        $scope.TEAM_VIEW_FLAG = 2;
        $scope.DashboardSearch.COMPLIANCE = '#!/Employee_List';
        if ($scope.$parent.CheckStandardRoleAccess(1) || $scope.$parent.CheckStandardRoleAccess(6) || $scope.$parent.CheckStandardRoleAccess(11)) {
            //SuperAdmin //1, 6, 11 Super Admin
            $scope.IS_SUPER_ADMIN = true;
        }
        if ($scope.$parent.CheckStandardRoleAccess(2) || $scope.$parent.CheckStandardRoleAccess(7) || $scope.$parent.CheckStandardRoleAccess(12)) {
            //2, 7, 12 Hr Manager
            $scope.IS_HR_MANAGER = true;
        }
        if ($scope.$parent.CheckStandardRoleAccess(3) || $scope.$parent.CheckStandardRoleAccess(8) || $scope.$parent.CheckStandardRoleAccess(13)) {
            //3, 8, 13 Site manager
            $scope.IS_SITE_MANAGER = true;
        }
        if ($scope.$parent.CheckStandardRoleAccess(4) || $scope.$parent.CheckStandardRoleAccess(9) || $scope.$parent.CheckStandardRoleAccess(14)) {
            //4, 9, 14 Team Manager
            $scope.IS_TEAM_MANAGER = true;
        }
    }


    $scope.HRM_GET_PUNCHCLOCK_BRANCH_SETTINGS = function () {
        var PunchClockObject = new Object();
        PunchClockObject.ENTITY_ID = null;
        PunchClockObject.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        PrcCommMethods.HUMANRESOURCE_API(PunchClockObject, 'HRM_GET_PUNCHCLOCK_BRANCH_SETTINGS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.PUNCHCLOCK_BRANCH_SETTINGS_LIST = data.data.Table.filter(x => x.QR_SCAN == true);
            }
            else {
                $scope.PUNCHCLOCK_BRANCH_SETTINGS_LIST = [];
            }
        });
    };
    $scope.HRM_GET_PUNCHCLOCK_BRANCH_SETTINGS();

    $scope.TEAM_VIEW = [{ NAME: 'My View', ID: 1, NG_SHOW:true },
        { NAME: 'Team View', ID: $scope.TEAM_VIEW_FLAG , NG_SHOW: true}]; //--1 FOR SELF, 2 FOR EMPLY_TEAM, 3 MANAGER TEAM, 

    $scope.SELECT_EMP_RESULT = function () {
        if ($scope.selectedEmployee !== null && $scope.selectedEmployee !== undefined && $scope.selectedEmployee.originalObject !== undefined) {
            if ($scope.selectedEmployee.originalObject.STEP_NO == 9) {
                $location.path('PrimaryDetails').search('EMP_ID', $scope.selectedEmployee.originalObject.EMPLY_PRSNL_ID).search('STEP_NO', $scope.selectedEmployee.originalObject.STEP_NO);
            }
            else if ($scope.selectedEmployee.originalObject.STEP_NO < 9) {
                $scope.RedirectiononEmp($scope.selectedEmployee.originalObject);
            };
        }
        else {
            $scope.$parent.ShowAlertBox('Warning', 'no result found ', 3000);
        }
    }

    $scope.HR_COMMON_CODE_Fn();
    $scope.HRM_DSHBRD_GET_PRIMARY_DETAILS = function () {
        var DshboardObj = new Object();
        DshboardObj.EMPLY_PRSNL_ID = $scope.DashboardSearch.EMPLY_PRSNL_ID;
        PrcCommMethods.HUMANRESOURCE_API(DshboardObj, 'HRM_DSHBRD_GET_PRIMARY_DETAILS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.DashboardSearch.DSHBRD_GET_PRIMARY_DETAILS = data.data.Table[0];
                //SCHEDULE START & SCHEDULE END  DISPLAY
            }
        });
    }
    //-- 1 FOR EMPLOYEE AND 2 FOR MANAGER
    $scope.HRM_DSHBRD_GET_COMPLIANCE_LIST = [];
    $scope.HRM_DSHBRD_GET_COMPLIANCE = function () {
        var DshboardObj = new Object();
        DshboardObj.EMPLY_PRSNL_ID = $scope.DashboardSearch.EMPLY_PRSNL_ID;
        DshboardObj.NO_OF_DAYS = 7;
        DshboardObj.VIEW_TYPE = $scope.DashboardSearch.VIEW_TYPE;
        DshboardObj.CUSTOMER_ID = $cookies.get("CUSTOMER_ID");
        DshboardObj.ENTITY_ID = $cookies.get("ENTITY_ID");
        PrcCommMethods.HUMANRESOURCE_API(DshboardObj, 'HRM_DSHBRD_GET_COMPLIANCE').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.MISSING_DETAIL_LIST = data.data.Table;
            }
            $scope.DOC_EXPIRY_LIST = [];
            if (data.data.Table1.length > 0) {
                $scope.DOC_EXPIRY_LIST = data.data.Table1;
            }
            $scope.HRM_DSHBRD_GET_COMPLIANCE_LIST = [];
            if (data.data.Table2.length > 0) {
                $scope.HRM_DSHBRD_GET_COMPLIANCE_LIST = data.data.Table2;/// Emp Below NMW
            }
            $scope.$parent.EQUALIZER();
        });
    }

    $scope.DSHBRD_GET_TEAM = [];
    $scope.DSHBRD_GET_TODAY_HIGHLIGHTS_LIST = [];
    $scope.HRM_DSHBRD_GET_TODAY_HIGHLIGHTS = function () { //COMPLIANCE
        var DshboardObj = new Object();
        DshboardObj.EMPLY_PRSNL_ID = $scope.DashboardSearch.EMPLY_PRSNL_ID;
        DshboardObj.ENTITY_ID = $cookies.get("ENTITY_ID");
        DshboardObj.VIEW_TYPE = $scope.DashboardSearch.VIEW_TYPE;
        DshboardObj.SETTING_61 = $scope.$parent.MASTER_GET_CUSTOMER_SETTINGS_VALUES(61);
        DshboardObj.SETTING_68 = $scope.$parent.MASTER_GET_CUSTOMER_SETTINGS_VALUES(68);
        PrcCommMethods.HUMANRESOURCE_API(DshboardObj, 'HRM_DSHBRD_GET_TODAY_HIGHLIGHTS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.DSHBRD_GET_TODAY_HIGHLIGHTS_LIST = data.data.Table;
                $scope.$parent.EQUALIZER();
            }
        });
    }
    $scope.NEXT_7_DAYS_LIST = [];
    $scope.NEXT_7_DAYS_COPY_LIST = [];
    $scope.HRM_SCHDL_MOB_GET_SHIFTS_LEAVES_BY_DATE = function () {
        var DshboardObj = new Object();
        DshboardObj.EMPLY_PRSNL_ID = $scope.DashboardSearch.EMPLY_PRSNL_ID;
        DshboardObj.START_DATE = new Date($scope.NEXT_7_DAYS_LIST[0].DATE).toDateString();
        DshboardObj.END_DATE = new Date($scope.NEXT_7_DAYS_LIST[6].DATE).toDateString();
        PrcCommMethods.HUMANRESOURCE_API(DshboardObj, 'HRM_SCHDL_MOB_GET_SHIFTS_LEAVES_BY_DATE').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.SCHDL_MOB_GET_SHIFTS_LEAVES_BY_DATE_LIST = data.data.Table;

                $scope.NEXT_7_DAYS_COPY_LIST = angular.copy($scope.NEXT_7_DAYS_LIST);
                $scope.$parent.EQUALIZER();
            }
            if (data.data.Table1.length > 0) {
                $scope.EMPLOYEE_DATA = data.data.Table1[0];
                $scope.EMPLOYEE_DATA.SHORT_NAME = $scope.TextReturn(data.data.Table1[0].EMPLOYEE_NAME);
            }
        });
    }
    $scope.GET_NEXT_7_DAYS = function () {
        $scope.NEXT_7_DAYS_LIST = []
        const options = { weekday: 'short', day: '2-digit', month: 'short' };
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            const formatted = date;
            var NextWeekObj = new Object();
            NextWeekObj.DATE = new Date(formatted);
            NextWeekObj.Days = new Date(formatted).getDate();
            $scope.NEXT_7_DAYS_LIST.push(NextWeekObj);
        }
        $scope.NEXT_7_DAYS_COPY_LIST = $scope.NEXT_7_DAYS_LIST;
        $scope.HRM_SCHDL_MOB_GET_SHIFTS_LEAVES_BY_DATE();

    }
    $scope.GET_NEXT_7_DAYS();

    $scope.dayOfWeekNamesShort = [];
    $scope.dayOfWeekNamesShort = [{ ID: 1, NAME: "Mon" }, { ID: 2, NAME: "Tue" }, { ID: 3, NAME: "Wed" }, { ID: 4, NAME: "Thu" }, { ID: 5, NAME: "Fri" }, { ID: 6, NAME: "Sat" }, { ID: 7, NAME: "Sun" }];

    Date.prototype.addDays = function (days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    };
    function startOfWeek(date) {
        var diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);
        return new Date(date.setDate(diff));
    };
    dt = new Date();
    var curr = new Date; // get current date
    $scope.CURR_DAY = curr.getDate();
    $scope.CURRENT_YEAR = curr.getFullYear();
    var STARTDATE = startOfWeek(new Date());
    $scope.WEEK_LIST = [];
    for (var i = 0; i < 7; i++) {
        var NextWeekObj = new Object();
        NextWeekObj.DATE = new Date(STARTDATE.addDays(i));
        NextWeekObj.Days = new Date(NextWeekObj.DATE).getDate();
        $scope.WEEK_LIST.push(NextWeekObj);
    };
    $scope.dayOfWeekNamesShort = angular.copy($scope.WEEK_LIST);
    $scope.DashboardSearch.START_DATE = $scope.dayOfWeekNamesShort[0].DATE;
    $scope.DashboardSearch.END_DATE = $scope.dayOfWeekNamesShort[6].DATE;
    function dateCheck(from, to, check) {
        var fDate, lDate, cDate;
        fDate = Date.parse(from);
        lDate = Date.parse(to);
        cDate = Date.parse(check);
        if ((cDate <= lDate && cDate >= fDate)) {
            return true;
        }
        return false;
    };

    $scope.HRM_DSHBRD_GET_CALENDAR = function (FLAG) { //
        var DshboardObj = new Object();
        DshboardObj.EMPLY_PRSNL_ID = $scope.DashboardSearch.EMPLY_PRSNL_ID;
        DshboardObj.VIEW_TYPE = FLAG == undefined ? $scope.DashboardSearch.VIEW_TYPE : FLAG;
      //  --1 FOR SELF, 2 FOR EMPLY_TEAM, 3 MANAGER TEAM, 4 SUPER ADMIN
        DshboardObj.START_DATE = new Date($scope.DashboardSearch.START_DATE).toDateString();
        DshboardObj.END_DATE = new Date($scope.DashboardSearch.END_DATE).toDateString();
        DshboardObj.ENTITY_ID = $cookies.get("ENTITY_ID");
        PrcCommMethods.HUMANRESOURCE_API(DshboardObj, 'HRM_DSHBRD_GET_CALENDAR').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.DSHBRD_GET_CALENDAR_LIST = data.data.Table;
                $scope.$parent.EQUALIZER();
            }
            else {
                $scope.DSHBRD_GET_CALENDAR_LIST = [];
            }
        });

    }

    $scope.nginitusercalendarlist = function (_calendar) {
        _calendar.SHORT_NAME = $scope.TextReturn(_calendar.EMPLOYEE_NAME);
        //if (_calendar.PROFILE_PIC_PATH != "" && _calendar.PROFILE_PIC_PATH != null) {
        //    _calendar.PROFILE_PIC_PATH = "/" + $scope.$parent.UPLOAD_FOLDER_NAME + _calendar.PROFILE_PIC_PATH;
        //}
        _calendar.dayOfWeekNamesShort = angular.copy($scope.dayOfWeekNamesShort)
    };
    $scope.nginitdayOfWeekNamesShort = function (week, index, val) {
        week.USER_LEAVE = [];
        var USERS_DATA = $scope.DSHBRD_GET_CALENDAR_LIST.filter(function (x) { return x.EMPLY_PRSNL_ID == val.EMPLY_PRSNL_ID });
        week.IS_LEAVE = false;
        week.IS_AVAILABLE = true;
        week.IS_UNAVAILABLE = false;
        week.IS_TERMINATE = false;
        angular.forEach(USERS_DATA, function (_LOOP_USER_STATUS) {
            var NextDate = new Date(val.dayOfWeekNamesShort[index].DATE).setHours(0, 0, 0, 0);
            if (_LOOP_USER_STATUS.LEAVE_DATE != null) {
                var LEAVE_DATE = new Date(_LOOP_USER_STATUS.LEAVE_DATE);
                LEAVE_DATE.setHours(0, 0, 0, 0);
                if (dateCheck(new Date(LEAVE_DATE), new Date(LEAVE_DATE), new Date(NextDate))) {
                    week.IS_LEAVE = true;
                    week.IS_AVAILABLE = false;
                };
            }
            if (_LOOP_USER_STATUS.TERMINATION_DATE != null) {
                var TERMINATION_DATE = new Date(_LOOP_USER_STATUS.TERMINATION_DATE);
                TERMINATION_DATE.setHours(0, 0, 0, 0);
                if (new Date(NextDate) >= new Date(TERMINATION_DATE)) {
                    week.IS_TERMINATE = true;
                    week.IS_AVAILABLE = false;
                };
            }

            if (_LOOP_USER_STATUS.BUSINESS_DATE == null) {
                //var LEAVE_DATE = new Date(_LOOP_USER_STATUS.BUSINESS_DATE);
                //LEAVE_DATE.setHours(0, 0, 0, 0);
                //if (dateCheck(new Date(BUSINESS_DATE), new Date(BUSINESS_DATE), new Date(NextDate))) {
                //    week.IS_AVAILABLE = true;
                //};
                week.IS_AVAILABLE = true;
            }
            if (_LOOP_USER_STATUS.BUSINESS_DATE != null && !week.IS_LEAVE) {
                // bussniss h to unavilable 
                if (_LOOP_USER_STATUS.BUSINESS_DATE != null) {
                    var BUSINESS_DATE = new Date(_LOOP_USER_STATUS.BUSINESS_DATE);
                    BUSINESS_DATE.setHours(0, 0, 0, 0);
                    if (dateCheck(new Date(BUSINESS_DATE), new Date(BUSINESS_DATE), new Date(NextDate))) {
                        week.IS_UNAVAILABLE = true;
                        week.IS_AVAILABLE = false;
                    };
                }
            }
        });
    };
    $scope.HRM_DSHBRD_SCHEDULE_VS_ACTUAL = function () { //
        var DshboardObj = new Object();
        //DshboardObj.START_DATE = $scope.DashboardSearch.START_DATE;
        //DshboardObj.END_DATE = $scope.DashboardSearch.END_DATE;
        DshboardObj.GRAPH_START_DATE = new Date($scope.DashboardSearch.START_DATE).toDateString();
        DshboardObj.GRAPH_END_DATE = new Date($scope.DashboardSearch.END_DATE).toDateString();
        DshboardObj.EMPLY_PRSNL_ID = $scope.DashboardSearch.EMPLY_PRSNL_ID;
        DshboardObj.ENTITY_ID = $cookies.get("ENTITY_ID");
        DshboardObj.SETTING_61 = $scope.$parent.MASTER_GET_CUSTOMER_SETTINGS_VALUES(61);
        DshboardObj.VIEW_TYPE = $scope.DashboardSearch.VIEW_TYPE;//--- 1 for Employee , 2 for Manager
        PrcCommMethods.HUMANRESOURCE_API(DshboardObj, 'HRM_DSHBRD_SCHEDULE_VS_ACTUAL').then(function (data) {
            if (data != null) {
                $scope.$parent.EQUALIZER();
                $scope.DSHBRD_SCHEDULE_VS_ACTUAL = data.data.Table;
                var SalesByCategoryoptions = {
                    series: data.data[0].ChartOutputData.SERIESDATALIST,
                    chart: {
                        type: 'bar',
                        columnWidth: '100%',
                        fontFamily: 'Montserrat, sans-serif',
                        height: 337,
                        toolbar: {
                            show: false
                        },
                    },
                    stroke: {
                        width: 0,
                        colors: ['#fff']
                    },
                    dataLabels: {
                        enabled: false,
                    },
                    plotOptions: {
                        bar: {
                            borderRadius: 3,
                            borderRadiusApplication: "end",
                            borderRadiusWhenStacked: "last",
                            horizontal: false
                        }
                    },
                    xaxis: {
                        labels: {
                            style: {
                                colors: '#94A3B8',
                                fontWeight: '500',
                            }
                        },
                        categories: [
                            'Mon',
                            'Tue',
                            'Wed',
                            'Thu',
                            'Fri',
                            'Sat',
                            'Sun',
                        ]
                    },
                    fill: {
                        opacity: 1
                    },

                    // colors: ['#88c3ff', '#84fc8f', '#87a9b8', '#ebb687'],
                    colors: ['#05A6F0', '#1DCA5D'],
                    yaxis: {
                        show: false,
                    },
                    grid: {
                        show: false,
                    },
                    legend: {
                        position: 'top',
                        horizontalAlign: 'right',
                        fontSize: '12',
                        labels: {
                            colors: "#1E2432",  // TEXT COLOR CAN BE CHANGED HERE
                            useSeriesColors: false
                        },
                        markers: {
                            width: 8,
                            height: 8,
                            radius: 12,
                            offsetX: 0,
                            offsetY: 0,
                        },
                    }
                };
                var SalesByCategorychart = new ApexCharts(document.querySelector("#Schedule_Actual"), SalesByCategoryoptions);
                SalesByCategorychart.render();
            }
        });
    }
    $scope.HRM_DSHBRD_GET_EMPLOYEES_IN_DEPARTMENT = function () { //
        var DshboardObj = new Object();
        DshboardObj.EMPLY_PRSNL_ID = $scope.DashboardSearch.EMPLY_PRSNL_ID;
        DshboardObj.ENTITY_ID = $cookies.get("ENTITY_ID");
        PrcCommMethods.HUMANRESOURCE_API(DshboardObj, 'HRM_DSHBRD_GET_EMPLOYEES_IN_DEPARTMENT').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.DashboardSearch.DSHBRD_GET_DEPARTMENT = data.data.Table[0];
                $scope.$parent.EQUALIZER();
            }
            if (data.data.Table1.length > 0) {
                $scope.DSHBRD_GET_EMPLOYEES = data.data.Table1;
                $scope.$parent.EQUALIZER();
            }
        });
    }
    $scope.HRM_DSHBRD_GET_TEAM = function () { //
        var DshboardObj = new Object();
        DshboardObj.EMPLY_PRSNL_ID = $scope.DashboardSearch.EMPLY_PRSNL_ID;
        DshboardObj.USER_ID = $cookies.get("USERID");
        DshboardObj.ENTITY_ID = $cookies.get("ENTITY_ID");
        PrcCommMethods.HUMANRESOURCE_API(DshboardObj, 'HRM_DSHBRD_GET_TEAM').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.DSHBRD_GET_TEAM = data.data.Table;
                $scope.$parent.EQUALIZER();
            }
        });
    }
    $scope.HRM_GET_EMPLOYEE_ABSENCES_COUNT = function () {
        var LeaveModelObj = new Object();
        LeaveModelObj.EMPLY_PRSNL_ID = $cookies.get("EMPLY_PRSNL_ID");
        LeaveModelObj.ENTITY_ID = $cookies.get("ENTITY_ID");
        LeaveModelObj.DATE = null;
        LeaveModelObj.ABSENCE_TYPE_ID = 1;
        PrcCommMethods.HUMANRESOURCE_API(LeaveModelObj, 'HRM_GET_EMPLOYEE_ABSENCES_COUNT').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.DashboardSearch.EMPLOYEE_ABSENCES_COUNT_LIST = data.data.Table[0];
                $scope.DashboardSearch.EMPLOYEE_ABSENCES_COUNT_LIST.UNIT_NAME = $scope.$parent.RETURN_UNITS_DAYS(data.data.Table[0].UNITS_ID);
                $scope.$parent.EQUALIZER();
            }
            else {
                $scope.DashboardSearch.EMPLOYEE_ABSENCES_COUNT_LIST = {
                    ANNUAL_ALLOWANCE: 0,
                    CALCULATED_ACCRUED: 0,
                    AVAILABLE_TILL_DATE: 0,
                    BOOKED: 0,
                    BOOKED_APPROVED: 0,
                    BOOKED_PENDING: 0,
                    REMAINING_BALANCE: 0,
                    TAKEN: 0,
                    UNIT_NAME: '-'
                };
            }
        });
    };
    $scope.HRM_GET_EMPLOYEE_LIST = function (FLAG, _pageload_flag) {
        $scope.EMPLOYEE_LIST = [];
        var UserModelObj = new Object();
        UserModelObj.CUSTOMER_ID = $cookies.get("CUSTOMER_ID");
        UserModelObj.ENTITY_ID = $cookies.get("ENTITY_ID");
        UserModelObj.SEARCH = "";
        UserModelObj.EMPLY_PRSNL_ID = $cookies.get("EMPLY_PRSNL_ID");
        UserModelObj.USER_ID = $cookies.get("USERID");
        UserModelObj.STANDARD_ROLE_ID = $cookies.get("STANDARD_ROLE_ID");
        UserModelObj.MODULE_ID = $cookies.get("MODULE_ID");
        UserModelObj.BRANCH_IDS = "";
        UserModelObj.DEPARTMENT_IDS = "";
        UserModelObj.POSITION_IDS = "";
        UserModelObj.STATUS_ID_LIST = [];
        UserModelObj.ORIGIN_URL = window.location.origin;
        //UserModelObj.ORIGIN_URL = "https://testing.wenodo.com/";
        angular.forEach($scope.EMPLOYEE_STATUSES_LIST, function (_loop_value) {
            var readonly = new Object();
            readonly.TABLE_ID = _loop_value.EMPLOYEE_STATUS_ID;
            UserModelObj.STATUS_ID_LIST.push(readonly);

        });

        UserModelObj.PAGE_NO = 0;
        UserModelObj.PAGE_SIZE = 0;
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'HRM_GET_EMPLOYEE_LIST').then(function (data) {
            if (data.data.length > 0) {
                $scope.EMPLOYEE_LIST = $scope.EMPLOYEE_LIST.concat(data.data);
                $scope.$parent.EQUALIZER();
            }
        });
    }
    $scope.HRM_GET_EMPLOYEE_STATUSES = function () {
        var UserModelObj = new Object();
        UserModelObj.CUSTOMER_ID = $cookies.get("CUSTOMER_ID");
        UserModelObj.ENTITY_ID = null;
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'HRM_GET_EMPLOYEE_STATUSES').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.EMPLOYEE_STATUSES_LIST = data.data.Table;
                $scope.HRM_GET_EMPLOYEE_LIST(1, true);

            }
            else {
                $scope.HRM_GET_EMPLOYEE_LIST(1, true);
            }
        });
    };
    $scope.SYSTM_NTFCTNS_LIST = [];
    $scope.DSHBRD_GET_MY_REQUEST_LIST = [];
    $scope.DSHBRD_GET_ACTIONS_LIST = [];
    $scope.LAZY_LOAD_GET_SYSTM_NTFCTNS = function () {
        $scope.GET_SYSTM_NTFCTNS();
    }
    $scope.GET_SYSTM_NTFCTNS = function (FLAG) {
        if (FLAG == 1) {
            $scope.DashboardSearch.PAGE_NO_N = 1;
            $scope.SYSTM_NTFCTNS_LIST = [];
        }
        var LeaveModelObj = new Object();
        LeaveModelObj.USER_ID = $cookies.get("USERID");
        LeaveModelObj.MODULE_ID = $cookies.get("MODULE_ID");
        LeaveModelObj.ENTITY_ID = $cookies.get("ENTITY_ID");
        LeaveModelObj.PAGE_NO = $scope.DashboardSearch.PAGE_NO_N;
        LeaveModelObj.PAGE_SIZE = $scope.DashboardSearch.PAGE_SIZE;
        PrcCommMethods.HUMANRESOURCE_API(LeaveModelObj, 'GET_SYSTM_NTFCTNS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.SYSTM_NTFCTNS_LIST = $scope.SYSTM_NTFCTNS_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.DashboardSearch.PAGE_SIZE) {
                    $scope.GRID_DATA_TAB_1 = false;
                }
                else {
                    $scope.DashboardSearch.PAGE_NO_N = parseInt($scope.DashboardSearch.PAGE_NO_N) + 1;
                    $scope.GRID_DATA_TAB_1 = true;
                }
            }
            else {
                if ($scope.SYSTM_NTFCTNS_LIST.length == 0) {
                    $scope.LOAD_FETCH_TEXT = 'No records yet!';
                }
                $scope.GRID_DATA_TAB_1 = false;
                $scope.$parent.overlay_loadingNew = 'none';
            }
        });
    }
    $scope.LAZY_LOAD_DSHBRD_GET_MY_REQUEST = function () {
        $scope.HRM_DSHBRD_GET_MY_REQUEST();
    }
    $scope.HRM_DSHBRD_GET_MY_REQUEST = function (FLAG) {
        if (FLAG == 1) {
            $scope.DashboardSearch.PAGE_NO_R = 1;
            $scope.DSHBRD_GET_MY_REQUEST_LIST = [];
        }
        var LeaveModelObj = new Object();
        LeaveModelObj.EMPLY_PRSNL_ID = $cookies.get("EMPLY_PRSNL_ID");
        LeaveModelObj.CUSTOMER_ID = $cookies.get("CUSTOMER_ID");
        LeaveModelObj.ENTITY_ID = $cookies.get("ENTITY_ID");
        LeaveModelObj.PAGE_NO = $scope.DashboardSearch.PAGE_NO_R;
        LeaveModelObj.PAGE_SIZE = 10;
        PrcCommMethods.HUMANRESOURCE_API(LeaveModelObj, 'HRM_DSHBRD_GET_MY_REQUEST').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.DSHBRD_GET_MY_REQUEST_LIST = $scope.DSHBRD_GET_MY_REQUEST_LIST.concat(data.data.Table);

                if (data.data.Table.length < $scope.DashboardSearch.PAGE_SIZE) {
                    $scope.GRID_DATA_TAB_3 = false;
                }
                else {
                    $scope.DashboardSearch.PAGE_NO_R = parseInt($scope.DashboardSearch.PAGE_NO_R) + 1;
                    $scope.GRID_DATA_TAB_3 = true;
                }
            }
            else {
                if ($scope.DSHBRD_GET_MY_REQUEST_LIST.length == 0) {
                    $scope.LOAD_FETCH_TEXT = 'No records yet!';
                }
                $scope.GRID_DATA_TAB_3 = false;
                $scope.$parent.overlay_loadingNew = 'none';
            }
            $scope.$parent.EQUALIZER();
        });
    }
    $scope.LAZY_LOAD_HRM_DSHBRD_GET_ACTIONS = function () {
        $scope.HRM_DSHBRD_GET_ACTIONS();
    }


    $scope.HRM_DSHBRD_GET_ACTIONS = function (FLAG) {
        if (FLAG == 1) {
            $scope.DashboardSearch.PAGE_NO_A = 1;
            $scope.DSHBRD_GET_ACTIONS_LIST = [];
        }
        var LeaveModelObj = new Object();
        LeaveModelObj.EMPLY_PRSNL_ID = $cookies.get("EMPLY_PRSNL_ID");
        LeaveModelObj.CUSTOMER_ID = $cookies.get("CUSTOMER_ID");
        LeaveModelObj.ENTITY_ID = $cookies.get("ENTITY_ID");
        LeaveModelObj.PAGE_NO = $scope.DashboardSearch.PAGE_NO_A;
        LeaveModelObj.PAGE_SIZE = $scope.DashboardSearch.PAGE_SIZE;
        PrcCommMethods.HUMANRESOURCE_API(LeaveModelObj, 'HRM_DSHBRD_GET_ACTIONS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.DSHBRD_GET_ACTIONS_LIST = $scope.DSHBRD_GET_ACTIONS_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.DashboardSearch.PAGE_SIZE) {
                    $scope.GRID_DATA_TAB_2 = false;
                }
                else {
                    $scope.DashboardSearch.PAGE_NO_A = parseInt($scope.DashboardSearch.PAGE_NO_A) + 1;
                    $scope.GRID_DATA_TAB_2 = true;
                }
            }
            else {
                if ($scope.DSHBRD_GET_ACTIONS_LIST.length == 0) {
                    $scope.LOAD_FETCH_TEXT = 'No records yet!';
                }
                $scope.GRID_DATA_TAB_2 = false;
                $scope.$parent.overlay_loadingNew = 'none';
            }
            $scope.$parent.EQUALIZER();
        });
    }


    $scope.SELECTED_VIEW_TYPE_Fn = function (_view_type) {
        if (_view_type == '') {
            $scope.DashboardSearch.CUSTOM_VIEW_NAME = $scope.TEAM_VIEW[0].NAME;
            $scope.HRM_DSHBRD_GET_CALENDAR($scope.TEAM_VIEW[0].ID);
        }
        else {
            $scope.DashboardSearch.CUSTOM_VIEW_NAME = _view_type.NAME;
            $scope.HRM_DSHBRD_GET_CALENDAR(_view_type.ID);

        };
    };

    $scope.HRM_GET_EMPLOYEE_ABSENCES_COUNT();
    $scope.HRM_DSHBRD_GET_PRIMARY_DETAILS();
    $scope.HRM_DSHBRD_GET_COMPLIANCE();

    $scope.HRM_DSHBRD_GET_TODAY_HIGHLIGHTS();
    //$scope.HRM_DSHBRD_GET_CALENDAR();

    $scope.onItemSelected = function (result) {
        console.log('12');
    }

    $scope.MISSING_DETAILS_Fn = function (_filter_name) {
        $scope.REDIRECT_STEP_NO = 9;
        $scope.EMPLOYEE_DETAILS = [];
        if (_filter_name == "MISSING_EMAIL") {
            $scope.MISSING_MSG = "Missing Email";
            $scope.REDIRECTION_PATH = "#!PrimaryDetails"
            $scope.EMPLOYEE_DETAILS = $filter('filter')($scope.MISSING_DETAIL_LIST, { 'MISSING_EMAIL': 1 });
        }
        else if (_filter_name == "MISSING_ADDRESS") {
            $scope.MISSING_MSG = "Missing Address";
            $scope.REDIRECTION_PATH = "#!PrimaryDetails"
            $scope.EMPLOYEE_DETAILS = $filter('filter')($scope.MISSING_DETAIL_LIST, { 'MISSING_ADDRESS': 1 });
        }
        else if (_filter_name == "MISSING_BANK_ACCOUNT") {
            $scope.MISSING_MSG = "Missing Bank Account";
            $scope.REDIRECTION_PATH = "#!PrimaryDetails"
            $scope.EMPLOYEE_DETAILS = $filter('filter')($scope.MISSING_DETAIL_LIST, { 'MISSING_BANK_ACCOUNT': 1 });
        }
        else if (_filter_name == "MISSING_EMERGENCY_CONTACT") {
            $scope.MISSING_MSG = "Emergency Contact";
            $scope.REDIRECTION_PATH = "#!PrimaryDetails"
            $scope.EMPLOYEE_DETAILS = $filter('filter')($scope.MISSING_DETAIL_LIST, { 'MISSING_EMERGENCY_CONTACT': 1 });
        }
        else if (_filter_name == "MISSING_PRIMARY_PHONE") {
            $scope.MISSING_MSG = "Primary Phone";
            $scope.REDIRECTION_PATH = "#!PrimaryDetails"
            $scope.EMPLOYEE_DETAILS = $filter('filter')($scope.MISSING_DETAIL_LIST, { 'MISSING_PRIMARY_PHONE': 1 });
        }
        $('#Compliance_Details').modal('show');
    }
    $scope.DOC_DETAILS_Fn = function (_filter_name) {
        $scope.REDIRECT_STEP_NO = 9;
        $scope.EMPLOYEE_DETAILS = [];
        if (_filter_name == "CONTRACTS") {
            $scope.REDIRECTION_PATH = "#!Document"
            $scope.MISSING_MSG = "Contracts expired";
            $scope.EMPLOYEE_DETAILS = $filter('filter')($scope.DOC_EXPIRY_LIST, { 'UPLOAD_TYPE_ID': 44 });
        }
        if (_filter_name == "ID_PROOF") {
            $scope.REDIRECTION_PATH = "#!Document"
            $scope.MISSING_MSG = "ID Proof expired";
            $scope.EMPLOYEE_DETAILS = $filter('filter')($scope.DOC_EXPIRY_LIST, { 'UPLOAD_TYPE_ID': 49 });
        }
        if (_filter_name == "RTW_EXPIRY") {
            $scope.REDIRECTION_PATH = "#!Document"
            $scope.MISSING_MSG = "RTW Expiry";
            $scope.EMPLOYEE_DETAILS = $filter('filter')($scope.DOC_EXPIRY_LIST, { 'UPLOAD_TYPE_ID': 45 });
        }
        $('#Compliance_Details').modal('show');
    }
    $scope.TEAM_EMPLOYEE_Fn = function (_filter_name) {
        $scope.EMPLOYEE_DETAILS = [];
        if (_filter_name == "HIRED_LAST_MONTH") {
            $scope.MISSING_MSG = "Hired Last Month";
            $scope.REDIRECTION_PATH = "#!EmploymentInfo";
            $scope.REDIRECT_STEP_NO = 9;
            $scope.EMPLOYEE_DETAILS = $filter('filter')($scope.DSHBRD_GET_TEAM, { 'EVENT_SUB_TYPE_ID': 1 });
        }
        if (_filter_name == "ENDING_30_DAYS") {
            $scope.MISSING_MSG = "Ending 30 Days";
            $scope.REDIRECTION_PATH = "#!EmploymentInfo";
            $scope.REDIRECT_STEP_NO = 9;
            $scope.EMPLOYEE_DETAILS = $filter('filter')($scope.DSHBRD_GET_TEAM, { 'EVENT_SUB_TYPE_ID': 5 });
        }
        if (_filter_name == "ENDING_30_PLUS_DAYS") {
            $scope.MISSING_MSG = "Ending 30+ Days";
            $scope.REDIRECTION_PATH = "#!EmploymentInfo"
            $scope.REDIRECT_STEP_NO = 9;
            $scope.EMPLOYEE_DETAILS = $filter('filter')($scope.DSHBRD_GET_TEAM, { 'EVENT_SUB_TYPE_ID': 6 });
        }
        if (_filter_name == "JOINING_SOON") {
            $scope.MISSING_MSG = "Joining Soon";
            $scope.REDIRECTION_PATH = "#!PrimaryDetails";
            $scope.REDIRECT_STEP_NO = 9;
            $scope.EMPLOYEE_DETAILS = $filter('filter')($scope.DSHBRD_GET_TEAM, { 'EVENT_SUB_TYPE_ID': 3 });
        }
        if (_filter_name == "READY_TO_HIRE") {
            $scope.MISSING_MSG = "Ready to Hire";
            $scope.REDIRECTION_PATH = "#!PrimaryDetails"
            $scope.REDIRECT_STEP_NO = 1;
            $scope.EMPLOYEE_DETAILS = $filter('filter')($scope.DSHBRD_GET_TEAM, { 'EVENT_SUB_TYPE_ID': 2 });
        }
        $('#Compliance_Details').modal('show');
    }
    $scope.EMPLOYEE_DETAILS = [];
    $scope.TODAY_HIGHLIGHT_Fn = function (_filter_name) {
        $scope.EMPLOYEE_DETAILS = [];
        $scope.REDIRECT_STEP_NO = 9;
        if (_filter_name == "NO_SHOW") {
            $scope.MISSING_MSG = "No Show";
            $scope.REDIRECTION_PATH = "#!HRM_Schedule"
            $scope.EMPLOYEE_DETAILS = $filter('filter')($scope.DSHBRD_GET_TODAY_HIGHLIGHTS_LIST, { 'EVENT_SUB_TYPE_ID': 2 });
        }
        if (_filter_name == "MISSING_CLOCK_OUT") {
            $scope.MISSING_MSG = "Missing Clock-out";
            $scope.REDIRECTION_PATH = "#!HRM_Schedule"
            $scope.EMPLOYEE_DETAILS = $filter('filter')($scope.DSHBRD_GET_TODAY_HIGHLIGHTS_LIST, { 'EVENT_SUB_TYPE_ID': 3 });
        }
        if (_filter_name == "CONTRACTED") {
            $scope.MISSING_MSG = "Variance from contracted hours";
            $scope.REDIRECTION_PATH = "#!HRM_Schedule"
            $scope.EMPLOYEE_DETAILS = $filter('filter')($scope.DSHBRD_GET_TODAY_HIGHLIGHTS_LIST, { 'EVENT_SUB_TYPE_ID': 4 });
        }
        if (_filter_name == "ABSENCE") {
            $scope.MISSING_MSG = "Absence";
            $scope.REDIRECTION_PATH = "#!HRM_Schedule"
            $scope.EMPLOYEE_DETAILS = $filter('filter')($scope.DSHBRD_GET_TODAY_HIGHLIGHTS_LIST, { 'EVENT_SUB_TYPE_ID': 5 });
        }
        $('#Compliance_Details').modal('show');
    }
    $scope.NOTIFICATION_TAB_ID = 8;
    $scope.Fn_TAB_CLICK_NO = function (_TAB_FLAG) {
        $scope.NOTIFICATION_TAB_ID = _TAB_FLAG;
        if (_TAB_FLAG == 8) {
            $scope.GET_SYSTM_NTFCTNS(1);
        }
        else if (_TAB_FLAG == 9) {
            if ($scope.DSHBRD_GET_ACTIONS_LIST.length == 0) {
                $scope.HRM_DSHBRD_GET_ACTIONS(1);
            }

        } else if (_TAB_FLAG == 10) {
            if ($scope.DSHBRD_GET_MY_REQUEST_LIST.length == 0) {
                $scope.HRM_DSHBRD_GET_MY_REQUEST(1);
            }
        }
    }

    $scope.Fn_TAB_CLICK = function (_TAB_FLAG) {
        $scope.TAB_ID = _TAB_FLAG;
        if (_TAB_FLAG == 1) {
            $scope.NOTIFICATION_TAB_ID = 8;
            $scope.GET_SYSTM_NTFCTNS(1);
        }
        else if (_TAB_FLAG == 2) {
            $scope.NOTIFICATION_TAB_ID = 9;
            if ($scope.DSHBRD_GET_ACTIONS_LIST.length == 0) {
                $scope.HRM_DSHBRD_GET_ACTIONS(1);
            }

        } else if (_TAB_FLAG == 3) {
            $scope.NOTIFICATION_TAB_ID = 10;
            if ($scope.DSHBRD_GET_MY_REQUEST_LIST.length == 0) {
                $scope.HRM_DSHBRD_GET_MY_REQUEST(1);
            }
        }
    }
    $scope.Fn_TAB_CLICK(2);
    if ($scope.IS_EMPLOYEE) {
        $scope.SELECTED_VIEW_TYPE_Fn($scope.TEAM_VIEW[0]);
    } else {
        $scope.SELECTED_VIEW_TYPE_Fn($scope.TEAM_VIEW[1]);
        $scope.HRM_GET_EMPLOYEE_STATUSES();
    };
    $scope.nginitemployee = function (_employee) {
        _employee.SHORT_NAME = $scope.TextReturn(_employee.EMPLOYEE_NAME);
    }
    $scope.nginitnextsevendays = function (_week) {
        if ($scope.SCHDL_MOB_GET_SHIFTS_LEAVES_BY_DATE_LIST.length > 0) {
            var shiftdata = $scope.SCHDL_MOB_GET_SHIFTS_LEAVES_BY_DATE_LIST.filter(function (x) { return x.TYPE_ID == 1 && new Date(x.BUSINESS_DATE).getDate() == _week.Days });
            if (shiftdata.length > 0) {
                _week.Shiftdata = shiftdata;
            };
            var Leavedata = $scope.SCHDL_MOB_GET_SHIFTS_LEAVES_BY_DATE_LIST.filter(function (x) { return x.TYPE_ID == 2 && new Date(x.BUSINESS_DATE).getDate() == _week.Days });
            if (Leavedata.length > 0) {
                _week.Leavedata = Leavedata[0];
            };
            var BankHdata = $scope.SCHDL_MOB_GET_SHIFTS_LEAVES_BY_DATE_LIST.filter(function (x) { return x.TYPE_ID == 3 && new Date(x.BUSINESS_DATE).getDate() == _week.Days });
            if (BankHdata.length > 0) {
                _week.BankHdata = BankHdata[0];
            };
        }
    }
    $scope.HRM_RE_DIRECT = function () {
        window.open('../HR/HRM_O_Index#!/QR_Code', '_blank');
    }
    $scope.REDIRECTION_Fn = function (_employee) {
        //REDIRECTION_PATH + '?EMP_ID=' + _employee.EMPLY_PRSNL_ID + '&STEP_NO=9'
        $('#Compliance_Details').modal('hide');
        $location.path('HRM_Schedule').search('EMP_ID', _employee.EMPLY_PRSNL_ID);
    }
    $scope.GET_SYSTM_NTFCTNS(1);
    $scope.HRM_DSHBRD_SCHEDULE_VS_ACTUAL();
    $scope.HRM_DSHBRD_GET_EMPLOYEES_IN_DEPARTMENT();
    $scope.HRM_DSHBRD_GET_TEAM();
});