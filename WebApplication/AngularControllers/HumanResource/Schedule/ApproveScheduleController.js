app.controller('ApproveScheduleController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(2);
    $scope.HR_COMMON_CODE_Fn();
    $scope.$parent.$parent.overlay_loading_HR_Loader = 'none';
    $scope.ApprovedShiftSearch = {
        CUSTOMER_ID: $cookies.get("CUSTOMER_ID"),
        ENTITY_ID: $cookies.get("ENTITY_ID"),
        MODULE_ID: $cookies.get("MODULE_ID"),
        USER_ID: $cookies.get("USERID"),
        EMPLY_PRSNL_ID: $cookies.get("EMPLY_PRSNL_ID"),
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        CUSTOM_BREAK_NAME: $scope.$parent.DD_DEFAULT_TEXT,
        FREQUENCY_NAME: '',
        YEAR: '',
        DD_DEFAULT_TEXT: $scope.$parent.DD_DEFAULT_TEXT,
        DDL_CUSTOM_BRANCH_NAME: "All Branches",
        CUSTOM_BRANCH_NAME: "All Branches",
        CUSTOM_BRANCH_NAME: "All Branches",
        DDL_CUSTOM_APPROVE_NAME: "All",
        CUSTOM_APPROVE_NAME: "All",
        BRANCH_ID: 0,
        IS_BREAK_RULE_APPLIED: false,
        IS_SPECIAL_WAGE: false,
    }
    $scope.CHOOSE_APPROVAL_TIME = [{ NAME: 'Use Actuals', USE_APPROVED_TYPE_ID: 1 }, { NAME: 'Use Schedule', USE_APPROVED_TYPE_ID: 2 }, { NAME: 'Select Time', USE_APPROVED_TYPE_ID: 3 }];
    $scope.APPROVAL_LIST = [{ NAME: 'All', STATUS_ID: 1 },
    { NAME: 'Approve', STATUS_ID: 93 }, { NAME: 'Revert', STATUS_ID: 92 }];
    $scope.CONSTRUCTOR = 10;
    $scope.PAGE_LOAD = 0;
    // $scope.TIME_FORMAT = $scope.$parent.MASTER_GET_CUSTOMER_SETTINGS_VALUES(46);
    if ($scope.$parent.MASTER_GET_CUSTOMER_SETTINGS_VALUES(46) == 1) { //12
        $scope.TIME_FORMAT = "h:mm a";
    }
    else { //2 //24
        $scope.TIME_FORMAT = "HH:mm";
    }

    $scope.DateInputLoadApproveManagerDate = function () {
        $(document).ready(function () {
            var date_inputs = document.getElementsByClassName("Managerdateinput") //our date input has the name "date"
            if (date_inputs.length > 0) {
                for (var i = 0; i < date_inputs.length; i++) {
                    var date_input = $('input[name="' + date_inputs[i].name + '"]'); //our date input has the name "date"
                    const oneWeekBack = new Date($scope.CURRENT_DATE);
                    const today = new Date($scope.CURRENT_DATE);
                    oneWeekBack.setDate(today.getDate() - 60)
                    var options = {
                        endDate: "today",
                        todayBtn: "linked",
                        daysOfWeekHighlighted: "0,6",
                        autoclose: true,
                        todayHighlight: true,
                        format: 'M dd, yyyy',
                        clearBtn: true,
                        closeBtn: true,// close button visible
                        startDate: oneWeekBack
                    };
                    date_input.datepicker(options);
                }
            }
        });
    }
    $scope.APPROVE_EMP_ROTA_Fn = function () {
        $scope.PAGE_LOAD = 0;
        $scope.HRM_GET_SCHDLS();
    }
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
    $scope.EMPLOYEE_SHIFTS_LIST = [];
    $scope.HRM_GET_SCHEDULING_ACCESS = function () {
        if ($scope.SCHEDULE_BRANCH_LIST == undefined || $scope.DEPARTMENTS_LIST == undefined || $scope.POSITIONS_LIST == undefined) {
            var SCHEDULING_ACCESSObj = new Object();
            SCHEDULING_ACCESSObj.CUSTOMER_ID = $scope.ApprovedShiftSearch.CUSTOMER_ID;
            SCHEDULING_ACCESSObj.ENTITY_ID = $scope.ApprovedShiftSearch.ENTITY_ID;
            SCHEDULING_ACCESSObj.EMPLY_PRSNL_ID = $scope.ApprovedShiftSearch.EMPLY_PRSNL_ID;
            PrcCommMethods.HUMANRESOURCE_API(SCHEDULING_ACCESSObj, 'HRM_GET_SCHEDULING_ACCESS').then(function (data) {
                if (data.data != null) {
                    $scope.SCHEDULE_BRANCH_LIST = [{
                        BRANCH_ID: 0,
                        BRANCH_NAME: "All Branches",
                        IS_PRIME: -1,
                        PRIME_BRANCH_ID: 0,
                        SHOW_WAGE: true,
                        TIME_SHEETS: true,
                    }];
                    $scope.SCHEDULE_BRANCH_LIST = $scope.SCHEDULE_BRANCH_LIST.concat(data.data.Table);// JSON.parse($localStorage.SHDL_ACESSS_BRANCH_LIST);              
                    $scope.SCHEDULE_BRANCH_LIST = $scope.SCHEDULE_BRANCH_LIST.filter(function (x) { x.IS_SELECTED = true; return x.IS_SELECTED && x.TIME_SHEETS });
                    $scope.APPROVE_EMP_ROTA_Fn();
                    //$scope.$parent.$parent.GET_USER_FILTERS(24, true);
                }
            });
        }
        else {
            $scope.HRM_GET_SCHDLS();
        }
    };

    $scope.HRM_GET_SCHDLS = function () {
        $scope.selected_employee_count = 0;
        if ($scope.ApprovedShiftSearch.START_DATE != undefined) {
            var CusModelObj = new Object();
            CusModelObj.ENTITY_ID = $scope.ApprovedShiftSearch.ENTITY_ID;
            CusModelObj.USER_ID = $scope.ApprovedShiftSearch.USER_ID;
            CusModelObj.BRANCH_ID = $scope.ApprovedShiftSearch.BRANCH_ID;
            //CusModelObj.TBL_BRANCH_IDS = $scope.ApprovedShiftSearch.BRANCH_IDs;
            CusModelObj.TBL_BRANCH_IDS = [];
            angular.forEach($scope.SCHEDULE_BRANCH_LIST, function (_branch) {
                // if (_branch.IS_SELECTED) {  // remove this code when check box is open
                if ($scope.ApprovedShiftSearch.BRANCH_ID == _branch.BRANCH_ID || $scope.ApprovedShiftSearch.BRANCH_ID == 0) {
                    var readOnly = new Object();
                    readOnly.TABLE_ID = _branch.BRANCH_ID;
                    CusModelObj.TBL_BRANCH_IDS.push(readOnly);
                }
            });
            CusModelObj.SCHEDULED_START = $scope.$parent.HRM_CHANGE_TIME_ZONE_Fn(new Date($scope.ApprovedShiftSearch.START_DATE));
            CusModelObj.SCHEDULED_END = $scope.$parent.HRM_CHANGE_TIME_ZONE_Fn(new Date($scope.ApprovedShiftSearch.START_DATE));
            CusModelObj.SCHEDULE_GROUP_BY_ID = 7;
            CusModelObj.VIEW_TYPE_ID = 1;
            CusModelObj.SCHEDULE_STATUS_ID = $scope.ApprovedShiftSearch.SHIFT_STATUS_VIEW_ID;
            CusModelObj.CUSTOMER_ID = $scope.ApprovedShiftSearch.CUSTOMER_ID;
            CusModelObj.EMPLY_PRSNL_ID = $scope.ApprovedShiftSearch.EMPLY_PRSNL_ID;
            CusModelObj.SETTING_54 = $scope.$parent.MASTER_GET_CUSTOMER_SETTINGS_VALUES(54);
            CusModelObj.SETTING_66 = $scope.$parent.MASTER_GET_CUSTOMER_SETTINGS_VALUES(66);
            CusModelObj.SETTING_67 = $scope.$parent.MASTER_GET_CUSTOMER_SETTINGS_VALUES(67);
            CusModelObj.SETTING_68 = $scope.$parent.MASTER_GET_CUSTOMER_SETTINGS_VALUES(68);
            CusModelObj.CURRENT_DATE = moment();
            CusModelObj.BRANCH_LIST = $scope.SCHEDULE_BRANCH_LIST;
            CusModelObj.IS_SCHEDULE_EXCEL = false;
            if ($scope.ApprovedShiftSearch.VIEW_ID == 1) {
                $scope.ApprovedShiftSearch.START_DATE = $filter('date')($scope.ApprovedShiftSearch.START_DATE);
            }

            PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_GET_SCHDLS').then(function (data) {
                if (data.data != null) {
                    $scope.EMPLOYEE_SHIFTS_LIST = data.data.datalist;
                    $scope.EMPLOYEE_SHIFTS_LIST_TO_FILTER = angular.copy(data.data.datalist);
                    $scope.PAGE_LOAD = 1;
                }
                else {
                    $scope.EMPLOYEE_SHIFTS_LIST = [];
                    $scope.PAGE_LOAD = 1;
                }
                if ($scope.EMPLOYEE_SHIFTS_LIST.length == 0) {
                    $scope.LOAD_FETCH_TEXT = "No record found";
                    $scope.PAGE_LOAD = 1;
                    //$scope.PAGE_LOAD = 0;
                    //$scope.EMPLOYEE_SHIFTS_LIST = [];
                }
            });
        }
    };
    $scope.HRM_SCHDL_APPROVE_BY_SHIFT_ID = function (SHIFT) {
        if (SHIFT.STATUS_ID == 93) {
            $scope.HRM_SCHDL_REVERT_SHIFT_APPROVAL(SHIFT);
        }
        else {
            SHIFT.submitted = true;
            if (SHIFT.APPROVED_CLOCK_IN != undefined && SHIFT.APPROVED_CLOCK_IN != null && SHIFT.APPROVED_CLOCK_IN != '' &&
                SHIFT.APPROVED_CLOCK_OUT != undefined && SHIFT.APPROVED_CLOCK_OUT != null && SHIFT.APPROVED_CLOCK_OUT != '') {
                var CusModelObj = new Object();
                CusModelObj.SCHDL_SHIFT_ID = SHIFT.SCHDL_SHIFT_ID;

                APPROVED_CLOCK_IN = angular.copy(new Date(SHIFT.DATE));
                APPROVED_CLOCK_OUT = angular.copy(new Date(SHIFT.DATE));

                let START_TIME = moment(SHIFT.APPROVED_CLOCK_IN).format('H:mm')
                var ST = START_TIME.split(':');
                let END_TIME = moment(SHIFT.APPROVED_CLOCK_OUT).format('H:mm')
                var ET = END_TIME.split(':');

                APPROVED_CLOCK_IN.setHours(parseFloat(ST[0]));
                APPROVED_CLOCK_IN.setMinutes(parseFloat(ST[1]));
                APPROVED_CLOCK_IN.setSeconds(0);

                APPROVED_CLOCK_OUT.setHours(parseFloat(ET[0]));
                APPROVED_CLOCK_OUT.setMinutes(parseFloat(ET[1]));
                APPROVED_CLOCK_OUT.setSeconds(0);

                if (moment(APPROVED_CLOCK_IN) > moment(APPROVED_CLOCK_OUT)) {
                    APPROVED_CLOCK_OUT.setDate(APPROVED_CLOCK_OUT.getDate() + 1);
                }

                CusModelObj.APPROVED_CLOCK_IN = $scope.$parent.HRM_CHANGE_TIME_ZONE_Fn(new Date(APPROVED_CLOCK_IN));
                CusModelObj.APPROVED_CLOCK_OUT = $scope.$parent.HRM_CHANGE_TIME_ZONE_Fn(new Date(APPROVED_CLOCK_OUT));
                CusModelObj.USER_ID = $cookies.get("USERID");
                CusModelObj.USE_CLOCK_IN_OUT_AS_APPROVED = false;
                CusModelObj.USE_SCHEDULED_AS_APPROVED = false;
                if (SHIFT.USE_APPROVED_TYPE_ID == 1) {
                    CusModelObj.USE_CLOCK_IN_OUT_AS_APPROVED = true;
                }
                else if (SHIFT.USE_APPROVED_TYPE_ID == 2) {
                    CusModelObj.USE_SCHEDULED_AS_APPROVED = true;
                }
                CusModelObj.COMMENTS = SHIFT.NOTE;
                if (SHIFT.BREAK_IN_LIST.length > 0) {
                    CusModelObj.HRM_SCHDL_SHIFT_APPROVED_BREAKS = [];
                    angular.forEach(SHIFT.BREAK_IN_LIST, function (_break) {
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
                        $scope.HRM_GET_SCHDLS();
                        //$scope.RESET_Fn();
                    }
                });
            }
        }
    };
    $scope.HRM_SCHDL_GET_BREAKS_BY_SHIFT_ID = function (_emp_shift, BREAK_IN, BREAK_OUT, IS_DISCARDED, TOTAL_MINUTES, MODEL_FLAG) {
        if (MODEL_FLAG == undefined && (_emp_shift.BREAK_IN_LIST == undefined || _emp_shift.BREAK_IN_LIST.length == 0) || MODEL_FLAG == 1 || _emp_shift.STATUS_ID == 93) {
            var CusModelObj = new Object();
            CusModelObj.SCHDL_SHIFT_ID = _emp_shift.SCHDL_SHIFT_ID;
            PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_SCHDL_GET_BREAKS_BY_SHIFT_ID').then(function (data) {
                if (data.data.Table.length > 0) {
                    _emp_shift.BREAK_IN_LIST = data.data.Table;
                    if (MODEL_FLAG == undefined) {
                        $('#AddBreak').modal('show');
                    }
                }
                else {
                    if (MODEL_FLAG == undefined) {
                        $('#AddBreak').modal('show');
                    }
                    //if (_emp_shift.BREAK_IN_LIST.filter(function (x) { return x.IS_DISCARDED == false }).length == 0) {
                    //    _emp_shift.BREAK_IN_LIST.push({ BREAK_ID: 0, BREAK_IN: BREAK_IN || '', BREAK_OUT: BREAK_OUT || '', IS_DISCARDED: false, TOTAL_MINUTES: TOTAL_MINUTES || 0 });
                    //};
                }
            });
        }
        else {
            if (MODEL_FLAG == undefined) {
                $('#AddBreak').modal('show');
            }
        }
    };
    $scope.HRM_SCHDL_REVERT_SHIFT_APPROVAL = function (SHIFT) {
        var CusModelObj = new Object();
        CusModelObj.SCHDL_SHIFT_ID = SHIFT.SCHDL_SHIFT_ID;
        CusModelObj.COMMENTS = "";
        CusModelObj.LOGIN_EMPLOYEE_ID = $cookies.get("EMPLY_PRSNL_ID") == undefined || $cookies.get("EMPLY_PRSNL_ID") == null ? 0 : $cookies.get("EMPLY_PRSNL_ID");
        CusModelObj.USER_ID = $cookies.get("USERID");
        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_SCHDL_REVERT_SHIFT_APPROVAL').then(function (data) {
            if (data.data == null || data.data == 0) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
            else if (data.data > 0) {
                $scope.$parent.ShowAlertBox("Success", 'Shift has been reverted successfully', 3000);
                $scope.HRM_GET_SCHDLS();
            }
        });
    };
    $scope.POP_ADD_NEW_BREAK_IN_Fn = function (BREAK_IN, BREAK_OUT, IS_DISCARDED, TOTAL_MINUTES, _emp_shift, ADD_FLAG, index, MODEL_OPEN_FLAG) {
        //if (ADD_FLAG == undefined) {// _emp_shift.BREAK_SHOW_HIDE = !_emp_shift.BREAK_SHOW_HIDE;}
        $scope.SELECTED_EMPLOYEE = _emp_shift;
        var index342 = $scope.EMPLOYEE_SHIFTS_LIST.findIndex(x => x.SCHDL_SHIFT_ID === _emp_shift.SCHDL_SHIFT_ID);
        $scope.ACTIVE_INDEX = index342;
        $scope.HRM_SCHDL_GET_BREAKS_BY_SHIFT_ID(_emp_shift, BREAK_IN, BREAK_OUT, IS_DISCARDED, TOTAL_MINUTES, MODEL_OPEN_FLAG);
    };
    $scope.ADD_NEW_BREAK_IN_Fn = function (BREAK_IN, BREAK_OUT, IS_DISCARDED, TOTAL_MINUTES, _emp_shift, ADD_FLAG, index) {
        $scope.EMPLOYEE_SHIFTS_LIST[$scope.ACTIVE_INDEX].BREAK_IN_LIST.push({ BREAK_ID: 0, BREAK_IN: BREAK_IN || '', BREAK_OUT: BREAK_OUT || '', IS_DISCARDED: false, TOTAL_MINUTES: TOTAL_MINUTES || 0, DURATION: 0 });
    }
    $scope.UPDATE_TOTAL_DURATION_Fn = function (SCHDL_START_DATE, SCHDL_END_DATE, FLAG, BREAK) {
        //Flag= 1 -if this is add shift popup or 2 - shift template popup or 3- Approved Clock or 4 for breaks or 5 for ClockInout
        if (SCHDL_START_DATE != null && SCHDL_START_DATE != undefined && SCHDL_START_DATE != '' && SCHDL_END_DATE != null && SCHDL_END_DATE != undefined && SCHDL_END_DATE != '') {
            SCHDL_START_DATE = moment(SCHDL_START_DATE).set('date', moment($scope.ApprovedShiftSearch.START_DATE.$viewValue).date()).set('seconds', 00);
            SCHDL_END_DATE = moment(SCHDL_END_DATE).set('date', moment($scope.ApprovedShiftSearch.START_DATE.$viewValue).date()).set('seconds', 00);
            if (!SCHDL_END_DATE.isAfter(SCHDL_START_DATE) && !SCHDL_END_DATE.isSame(SCHDL_START_DATE)) {
                SCHDL_END_DATE = moment(SCHDL_END_DATE).set('date', SCHDL_END_DATE.date() + 1);
            }
            BREAK.BREAK_IN = SCHDL_START_DATE;
            BREAK.BREAK_OUT = SCHDL_END_DATE;
            BREAK.DURATION = $scope.calculateDuration(SCHDL_START_DATE, SCHDL_END_DATE, 'TIME');
        }
    };
    $scope.SELECTED_SCHEDULE_BRANCH_Fn = function (branch) {

        $scope.ApprovedShiftSearch.CUSTOM_BRANCH_NAME = "";
        $scope.ApprovedShiftSearch.CUSTOM_BRANCH_NAME = branch.BRANCH_NAME;
        $scope.ApprovedShiftSearch.BRANCH_ID = branch.BRANCH_ID;
        $scope.HRM_GET_SCHDLS();

        //var count = 0;
        //$scope.ApprovedShiftSearch.BRANCH_IDS = branch.BRANCH_NAME;

        //angular.forEach($scope.SCHEDULE_BRANCH_LIST, function (item) {
        //    if (item.IS_SELECTED) {
        //        if ($scope.ApprovedShiftSearch.CUSTOM_BRANCH_NAME == undefined ||
        //            $scope.ApprovedShiftSearch.CUSTOM_BRANCH_NAME == $scope.ApprovedShiftSearch.DDL_CUSTOM_BRANCH_NAME) {
        //            $scope.ApprovedShiftSearch.CUSTOM_BRANCH_NAME = branch.BRANCH_NAME;
        //        }
        //        else {
        //            $scope.ApprovedShiftSearch.CUSTOM_BRANCH_NAME = $scope.ApprovedShiftSearch.CUSTOM_BRANCH_NAME + "," + branch.BRANCH_NAME;
        //        }
        //        count++;
        //    }
        //});
        //if ($scope.SCHEDULE_BRANCH_LIST.length == count) {
        //    $scope.ApprovedShiftSearch.CUSTOM_BRANCH_NAME = $scope.ApprovedShiftSearch.DDL_CUSTOM_BRANCH_NAME;
        //}

    };

    $scope.SELECTED_APPROVE_Fn = function (approve) {
        if (approve == "") {
            $scope.ApprovedShiftSearch.CUSTOM_APPROVE_NAME = $scope.ApprovedShiftSearch.DDL_CUSTOM_APPROVE_NAME;
            $scope.ApprovedShiftSearch.STATUS_ID = 1;
        }
        else {
            $scope.ApprovedShiftSearch.CUSTOM_APPROVE_NAME = approve.NAME;
            $scope.ApprovedShiftSearch.STATUS_ID = approve.STATUS_ID;
        }
    };
    $scope.excludeApproved = function (item) {
        return item.STATUS_ID !== $scope.ApprovedShiftSearch.STATUS_ID;
    };
    $scope.CHOOSE_APPROVAL_Fn = function (_timetype, _emp_shift) {
        _emp_shift.TIME_TYPE = _timetype.NAME;
        _emp_shift.USE_APPROVED_TYPE_ID = _timetype.USE_APPROVED_TYPE_ID;
        if (_timetype.USE_APPROVED_TYPE_ID == 3) {
            _emp_shift.APPROVED_CLOCK_IN = ""
            _emp_shift.APPROVED_CLOCK_OUT = "";
            _emp_shift.APPROVED_BREAK_DURATION_EXCLUDING_PAID_BREAK_MINUTES = 0;
            if (_emp_shift.ACTUAL_BREAK_DURATION_MINUTES > 0) {
                _emp_shift.APPROVED_BREAK_DURATION_EXCLUDING_PAID_BREAK_MINUTES = angular.copy(_emp_shift.ACTUAL_BREAK_DURATION_MINUTES);
            };

        } else if (_timetype.USE_APPROVED_TYPE_ID == 1) { // Use Actuals
            _emp_shift.APPROVED_CLOCK_IN = angular.copy(moment(_emp_shift.CLOCK_IN));
            _emp_shift.APPROVED_CLOCK_OUT = angular.copy(moment(_emp_shift.CLOCK_OUT));
            if (_emp_shift.ACTUAL_BREAK_DURATION_MINUTES == 0) {
                _emp_shift.APPROVED_BREAK_DURATION_EXCLUDING_PAID_BREAK_MINUTES = angular.copy(_emp_shift.SCHEDULED_UNPAID_BREAK_MINUTES);
            } else {
                _emp_shift.APPROVED_BREAK_DURATION_EXCLUDING_PAID_BREAK_MINUTES = angular.copy(_emp_shift.ACTUAL_BREAK_DURATION_MINUTES);
            };


        }
        else if (_timetype.USE_APPROVED_TYPE_ID == 2) { //Use Schedule
            _emp_shift.APPROVED_CLOCK_IN = angular.copy(moment(_emp_shift.SCHEDULED_START));
            _emp_shift.APPROVED_CLOCK_OUT = angular.copy(moment(_emp_shift.SCHEDULED_END));
            _emp_shift.APPROVED_BREAK_DURATION_EXCLUDING_PAID_BREAK_MINUTES = angular.copy(_emp_shift.SCHEDULED_UNPAID_BREAK_MINUTES);
            if (_emp_shift.BREAK_IN_LIST == undefined || _emp_shift.BREAK_IN_LIST.length == 0) {
                $scope.POP_ADD_NEW_BREAK_IN_Fn(null, null, false, 0, _emp_shift, 0, _emp_shift.INDEX, 1);
            };

            if (_emp_shift.ACTUAL_BREAK_DURATION_MINUTES > 0) {
                _emp_shift.APPROVED_BREAK_DURATION_EXCLUDING_PAID_BREAK_MINUTES = angular.copy(_emp_shift.ACTUAL_BREAK_DURATION_MINUTES);
            };
        }
    }
    $scope.REMOVE_BREAK_IN_Fn = function (_break) {
        _break.IS_DISCARDED = true;
    };
    $scope.nginit_approval = function (_employee) {
        _employee.SHORT_NAME = $scope.$parent.TextReturn(_employee.EMPLOYEE_NAME);
        _employee.BREAK_IN_LIST = [];
        //  var USER_SCH = $scope.CHOOSE_APPROVAL_TIME.filter(function (x) { return x.USE_APPROVED_TYPE_ID == _employee.USE_APPROVED_TYPE_ID });
        if (_employee.USE_SCHEDULE_AS_ACTUAL == 1 && _employee.STATUS_ID == 92) {
            _employee.APPROVED_CLOCK_IN = angular.copy(moment(_employee.SCHEDULED_START));
            _employee.APPROVED_CLOCK_OUT = angular.copy(moment(_employee.SCHEDULED_END));
            _employee.TIME_TYPE = $scope.CHOOSE_APPROVAL_TIME[1].NAME;
            _employee.USE_APPROVED_TYPE_ID = 2;
            if (_employee.ACTUAL_BREAK_DURATION_MINUTES == 0) {
                _employee.APPROVED_BREAK_DURATION_EXCLUDING_PAID_BREAK_MINUTES = angular.copy(_employee.SCHEDULED_UNPAID_BREAK_MINUTES);
            }
        }
        else {
            if (_employee.APPROVED_CLOCK_IN != null || _employee.APPROVED_CLOCK_OUT != null) {
                if (_employee.APPROVED_CLOCK_IN != null) {
                    _employee.APPROVED_CLOCK_IN = moment(_employee.APPROVED_CLOCK_IN);
                };
                if (_employee.APPROVED_CLOCK_OUT != null) {
                    _employee.APPROVED_CLOCK_OUT = moment(_employee.APPROVED_CLOCK_OUT);
                };
            };
            if (_employee.USE_APPROVED_TYPE_ID == 3 || _employee.USE_APPROVED_TYPE_ID == 0) { //Select Time
                _employee.TIME_TYPE = $scope.CHOOSE_APPROVAL_TIME[2].NAME;
                if (_employee.ACTUAL_BREAK_DURATION_MINUTES > 0 && _employee.STATUS_ID == 92) {
                    _employee.APPROVED_BREAK_DURATION_EXCLUDING_PAID_BREAK_MINUTES = _employee.ACTUAL_BREAK_DURATION_MINUTES;
                    $scope.POP_ADD_NEW_BREAK_IN_Fn(null, null, false, 0, _employee, 0, _employee.INDEX, 1);
                };
            }
            else if (_employee.USE_APPROVED_TYPE_ID == 1) { // Use Actuals
                _employee.TIME_TYPE = $scope.CHOOSE_APPROVAL_TIME[0].NAME;
                if (_employee.ACTUAL_BREAK_TAKEN == true && _employee.STATUS_ID == 93) {
                    _employee.APPROVED_BREAK_DURATION_EXCLUDING_PAID_BREAK_MINUTES = _employee.APPROVED_BREAK_DURATION_MINUTES;
                }
                else {
                    if (_employee.APPROVED_BREAK_DURATION_EXCLUDING_PAID_BREAK_MINUTES == 0 && _employee.ACTUAL_BREAK_DURATION_MINUTES == 0 && _employee.STATUS_ID == 93) {
                        _employee.APPROVED_BREAK_DURATION_EXCLUDING_PAID_BREAK_MINUTES = _employee.SCHEDULED_UNPAID_BREAK_MINUTES;
                    }
                    else if (_employee.ACTUAL_BREAK_DURATION_MINUTES > 0 && _employee.STATUS_ID == 93) {
                        _employee.APPROVED_BREAK_DURATION_EXCLUDING_PAID_BREAK_MINUTES = _employee.ACTUAL_BREAK_DURATION_MINUTES;
                    };
                }
            } else if (_employee.USE_APPROVED_TYPE_ID == 2) { //Use Schedule
                _employee.TIME_TYPE = $scope.CHOOSE_APPROVAL_TIME[1].NAME;
                if (_employee.ACTUAL_BREAK_TAKEN == true && _employee.STATUS_ID == 93) {
                    _employee.APPROVED_BREAK_DURATION_EXCLUDING_PAID_BREAK_MINUTES = _employee.APPROVED_BREAK_DURATION_MINUTES;
                }
                else {
                    if (_employee.APPROVED_BREAK_DURATION_EXCLUDING_PAID_BREAK_MINUTES == 0 && _employee.STATUS_ID == 93) {
                        _employee.APPROVED_BREAK_DURATION_EXCLUDING_PAID_BREAK_MINUTES = _employee.SCHEDULED_UNPAID_BREAK_MINUTES;
                    };
                }
            };
        };
    }
    $scope.InitializeBreaks = function (_break, _emp_shift) {
        if (_break.BREAK_IN != null && _emp_shift.STATUS_ID != 93) {
            $scope.UPDATE_TOTAL_DURATION_Fn(_break.BREAK_IN, _break.BREAK_OUT, 4, _break);
        }
        else {
            $scope.UPDATE_TOTAL_DURATION_Fn(_break.APPROVED_BREAK_IN, _break.APPROVED_BREAK_OUT, 4, _break);
        }
    }
    $scope.GET_UTC_TIME = function () {
        var UserModelObj = new Object();
        UserModelObj.TIMEZONE_OFFSET = "0:0";
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'GET_UTC_TIME').then(function (data) {
            if (data.data != null) {
                $scope.CURRENT_DATE = new Date(data.data);
                const date = new Date(data.data);
                $scope.ApprovedShiftSearch.START_DATE = $filter('date')(new Date(date.setDate(date.getDate() - 1))); // Subtract one day
                $scope.DateInputLoadApproveManagerDate();

                $scope.HRM_GET_SCHEDULING_ACCESS();
            }
            if ($scope.CURRENT_DATE == '') {
                $scope.CURRENT_DATE = new Date();
                $scope.DateInputLoadApproveManagerDate();
            }
        })
    };
    $scope.GET_UTC_TIME();
});