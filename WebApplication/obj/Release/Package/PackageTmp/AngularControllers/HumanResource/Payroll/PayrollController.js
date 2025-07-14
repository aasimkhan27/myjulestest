app.controller('PayrollController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    //$scope.$parent.DISPLAY_FLAG = true;
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(1);
    $scope.$parent.$parent.overlay_loading_HR_Loader = 'none';
    $scope.HR_COMMON_CODE_Fn();
    $scope.payrollsearch = {
        CUSTOMER_ID: $cookies.get("CUSTOMER_ID"),
        ENTITY_ID: null,
        MODULE_ID: $cookies.get("MODULE_ID"),
        USER_ID: $cookies.get("USERID"),
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        DD_DEFAULT_TEXT: $scope.$parent.DD_DEFAULT_TEXT,
    }
    $scope.payschedulesearch = {
        CUSTOMER_ID: $cookies.get("CUSTOMER_ID"),
        ENTITY_ID: null,
        MODULE_ID: $cookies.get("MODULE_ID"),
        USER_ID: $cookies.get("USERID"),
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        CUSTOM_FREQUENCY_NAME: $scope.$parent.DD_DEFAULT_TEXT,
        FREQUENCY_NAME: '',
        YEAR: '',
        DD_DEFAULT_TEXT: $scope.$parent.DD_DEFAULT_TEXT,
    }
    $scope.PayCalculationsearch = {
        CUSTOMER_ID: $cookies.get("CUSTOMER_ID"),
        ENTITY_ID: null,
        MODULE_ID: $cookies.get("MODULE_ID"),
        USER_ID: $cookies.get("USERID"),
    }

    $scope.RESET_Fn = function () {
        $scope.payrollsearch.PAYCODE_ID = "";
        $scope.payrollsearch.CODE = "";
        $scope.payrollsearch.TITLE = "";
        $scope.payrollsearch.TYPE_ID = "";
        $scope.payrollsearch.CUSTOM_TYPE_NAME = $scope.$parent.DD_DEFAULT_TEXT;
        $scope.payrollsearch.CALCULATION_ID = "";
        $scope.payrollsearch.CUSTOM_CALCULATION_NAME = $scope.$parent.DD_DEFAULT_TEXT;
        $scope.payrollsearch.DEFAULT_VALUES = "";
        $scope.payrollsearch.RECURRING = false;
        $scope.payrollsearch.NI = false;
        $scope.payrollsearch.TAX = false;
        $scope.payrollsearch.PENSION = false;
        $scope.PAYROLL_FORM.submitted = false;
        $scope.SHOW_WARNING_MESSAGE_FOR_PAYCODE = false;
        $scope.MAPPED_EMPLOYEE_PAYCODE_COUNT = 0;
    };

    $scope.RESET_PRIVIEW_Fn = function () {
        $scope.payschedulesearch.PAYSCHEDULE_ID = "";
        $scope.payschedulesearch.NAME = "";
        $scope.payschedulesearch.FREQUENCY = "";
        $scope.payschedulesearch.START_DATE = "";
        $scope.payschedulesearch.END_DATE = "";
        $scope.payschedulesearch.FIRST_PAYDAY = "";
        $scope.payschedulesearch.HOLIDAY_CALENDAR_ID = "";
        $scope.payschedulesearch.CUSTOM_CALCULATION_NAME = $scope.payschedulesearch.DD_DEFAULT_TEXT;
        $scope.payschedulesearch.CUSTOM_CALENDAR_NAME = $scope.payschedulesearch.DD_DEFAULT_TEXT;
        $scope.payschedulesearch.CUSTOM_FREQUENCY_NAME = $scope.payschedulesearch.DD_DEFAULT_TEXT;
        $scope.PAY_SCHEDULEFORM.submitted = false;
        $scope.END_DATE_FLAG = 0;
        $scope.SHOW_WARNING_MESSAGE_FOR_PAYCODE = false;
        $scope.MAPPED_EMPLOYEE_PAYCODE_COUNT = 0;

    }
    $scope.ADDITION_TYPE = [{ TYPE_ID: 1, TYPE_NAME: 'Addition' }, { TYPE_ID: -1, TYPE_NAME: 'Deduction' }];
    $scope.CALCULATION_LIST = [{ CALCULATION_ID: 1, CALCULATION_NAME: 'Fixed Amount  ' },
    { CALCULATION_ID: 2, CALCULATION_NAME: 'Multiplier Day' },
    { CALCULATION_ID: 3, CALCULATION_NAME: 'Multiplier Hourly' },
    { CALCULATION_ID: 4, CALCULATION_NAME: 'Multiplier Shift' }]

    $scope.FREQUENCY_LIST = [{ FREQUENCY: 1, FREQUENCY_NAME: 'Weekly' }, { FREQUENCY: 2, FREQUENCY_NAME: 'Monthly' }, { FREQUENCY: 3, FREQUENCY_NAME: 'Fortnightly' }, { FREQUENCY: 4, FREQUENCY_NAME: 'Custom' }];
    $scope.YEAR_LIST = [];
    ///CURRENT _DATE API
    $scope.CURRENT_DATE = function () {
        var CusModelObj = new Object();
        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'CURRENT_DATE').then(function (data) {
            if (data.data != '') {
                var t = +data.data.substring(0, data.data.length - 4);
                var e = Date.UTC(1601, 0, 1);
                var dt = new Date(e + t);
                var year = new Date(dt).getFullYear();
                for (var i = 0; i < 5; i++) {
                    var readonly = new Object();
                    readonly.YEAR = parseInt(year) + i;
                    $scope.YEAR_LIST.push(readonly);
                }

            }
        });
    }
    $scope.LAZY_LOAD_HRM_GET_PAYCODES = function () {
        $scope.HRM_GET_PAYCODES();

    }
    //paycode
    $scope.HRM_GET_PAYCODES = function (FLAG) {
        $scope.$parent.overlay_loadingNew = 'block';
        if (FLAG == 1) {
            $scope.payrollsearch.PAGE_NO = 1;
            $scope.PAYCODES_LIST = [];
        }

        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_ID = $scope.payrollsearch.CUSTOMER_ID;
        CusModelObj.ENTITY_ID = $scope.payrollsearch.ENTITY_ID;
        CusModelObj.PAGE_NO = $scope.payrollsearch.PAGE_NO;;
        CusModelObj.PAGE_SIZE = $scope.payrollsearch.PAGE_SIZE;
        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_GET_PAYCODES').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.$parent.overlay_loadingNew = 'none';
                $scope.PAYCODES_LIST = $scope.PAYCODES_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.payrollsearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.payrollsearch.PAGE_NO = parseInt($scope.payrollsearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else {
                if ($scope.PAYCODES_LIST.length == 0) { };
                $scope.GetData = false;
                $scope.$parent.overlay_loadingNew = 'none';
            }
        });
    }
    // and  ///Payschedule
    $scope.HRM_GET_HOLIDAY_CALENDARS = function () {
        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_ID = $scope.payrollsearch.CUSTOMER_ID;
        CusModelObj.ENTITY_ID = $scope.payrollsearch.ENTITY_ID;
        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_GET_HOLIDAY_CALENDARS').then(function (data) {
            $scope.HOLIDAY_CALENDARS_LIST = data.data.Table;
        });
    }
    ///Payschedule
    $scope.HRM_GET_PAYSCHEDULE_DATES = function () {
        var CusModelObj = new Object();
        CusModelObj.FREQUENCY = $scope.payschedulesearch.FREQUENCY;
        //CusModelObj.START_DATE = new Date($scope.payschedulesearch.START_DATE).toDateString();
        //CusModelObj.END_DATE = new Date($scope.payschedulesearch.END_DATE).toDateString();
        //CusModelObj.FIRST_PAYDAY = new Date($scope.payschedulesearch.FIRST_PAYDAY).toDateString();
        //moment($scope.payschedulesearch.START_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate();
        CusModelObj.START_DATE = moment($scope.payschedulesearch.START_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).format('L');
        CusModelObj.END_DATE = moment($scope.payschedulesearch.END_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).format('L');
        CusModelObj.FIRST_PAYDAY = moment($scope.payschedulesearch.FIRST_PAYDAY, $scope.$parent.CONVERSION_DATE_FORMAT).format('L');
        CusModelObj.HOLIDAY_CALENDAR_ID = $scope.payschedulesearch.HOLIDAY_CALENDAR_ID;
        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_GET_PAYSCHEDULE_DATES').then(function (data) {
            $scope.PAYSCHEDULE_DATES_LIST = data.data.Table;
            $('#Preview_Pay_Schedule').modal('show');
        });
    }
    ///Payschedule
    $scope.HRM_GET_PAYSCHEDULE_BY_ID = function (_param_payschedule, param_call_flag) {
        var CusModelObj = new Object();
        CusModelObj.PAYSCHEDULE_ID = _param_payschedule.PAYSCHEDULE_ID;
        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_GET_PAYSCHEDULE_BY_ID').then(function (data) {
            $scope.PAYSCHEDULE_BY_ID_LIST = data.data.Table1;
            if (param_call_flag == undefined) {
                let payresult = data.data.Table[0];
                $scope.payschedulesearch.PAYSCHEDULE_ID = payresult.PAYSCHEDULE_ID;
                $scope.payschedulesearch.NAME = payresult.PAYSCHEDULE_NAME;
                $scope.payschedulesearch.FREQUENCY = payresult.FREQUENCY;
                $scope.payschedulesearch.START_DATE = ($filter('date')((payresult.START_DATE), $scope.$parent.DISPLAY_DATE_FORMAT));
                $scope.payschedulesearch.END_DATE = ($filter('date')((payresult.END_DATE), $scope.$parent.DISPLAY_DATE_FORMAT));
                $scope.payschedulesearch.FIRST_PAYDAY = payresult.FIRST_PAYDAY == null ? '' : ($filter('date')((payresult.FIRST_PAYDAY), $scope.$parent.DISPLAY_DATE_FORMAT));
                $scope.payschedulesearch.HOLIDAY_CALENDAR_ID = payresult.HOLIDAY_CALENDAR_ID;
                ///
                $scope.payschedulesearch.CUSTOM_FREQUENCY_NAME = _param_payschedule.FREQUENCY_NAME;
                $scope.payschedulesearch.CUSTOM_CALENDAR_NAME = _param_payschedule.CALENDAR_NAME;
            }
            else if (param_call_flag == 1) {
                let payresult = data.data.Table[0];
                $scope.payschedulesearch.VIEW_PAYSCHEDULE_ID = payresult.PAYSCHEDULE_ID;
                $scope.payschedulesearch.VIEW_NAME = payresult.PAYSCHEDULE_NAME;
                $scope.payschedulesearch.VIEW_FREQUENCY = payresult.FREQUENCY;
                $scope.payschedulesearch.VIEW_START_DATE = ($filter('date')((payresult.START_DATE), $scope.$parent.DISPLAY_DATE_FORMAT));
                $scope.payschedulesearch.VIEW_END_DATE = ($filter('date')((payresult.END_DATE), $scope.$parent.DISPLAY_DATE_FORMAT));
                $scope.payschedulesearch.VIEW_FIRST_PAYDAY = payresult.FIRST_PAYDAY == null ? '' : ($filter('date')((payresult.FIRST_PAYDAY), $scope.$parent.DISPLAY_DATE_FORMAT));
                $scope.payschedulesearch.VIEW_HOLIDAY_CALENDAR_ID = payresult.HOLIDAY_CALENDAR_ID;
                $scope.payschedulesearch.VIEW_CUSTOM_FREQUENCY_NAME = _param_payschedule.FREQUENCY_NAME;
                $scope.payschedulesearch.VIEW_CUSTOM_CALENDAR_NAME = _param_payschedule.CALENDAR_NAME;

                $('#View_Calendar').modal('show');
            }
        });
    }
    // Date lock
    $scope.GET_HRM_LOCK_DATE = function () {
        var PunchClockObject = new Object();
        PunchClockObject.CUSTOMER_ID = $cookies.get("CUSTOMER_ID");
        PrcCommMethods.HUMANRESOURCE_API(PunchClockObject, 'GET_HRM_LOCK_DATE').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.HRM_LOCK_DATE_LIST = data.data.Table;
            }
            else {
                $scope.HRM_LOCK_DATE_LIST = [];
            }
        });

    };
    $scope.GET_HRM_LOCK_DATE();
    ///Payschedule
    $scope.HRM_GET_PAYSCHEDULE_DROPDOWN = function () {
        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_ID = $scope.payrollsearch.CUSTOMER_ID;
        CusModelObj.ENTITY_ID = $scope.payrollsearch.ENTITY_ID;
        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_GET_PAYSCHEDULE_DROPDOWN').then(function (data) {
            $scope.PAYSCHEDULE_DROPDOWN_LIST = data.data.Table;
        });
    }
    $scope.LAZY_LOAD_HRM_GET_PAYSCHEDULES = function () {
        $scope.HRM_GET_PAYSCHEDULES();
    }
    ///Payschedule
    $scope.HRM_GET_PAYSCHEDULES = function (FLAG) {
        $scope.$parent.overlay_loadingNew = 'block';
        if (FLAG == 1) {
            $scope.payschedulesearch.PAGE_NO = 1;
            $scope.PAYSCHEDULES_LIST = [];
        }
        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_ID = $scope.payschedulesearch.CUSTOMER_ID;
        CusModelObj.ENTITY_ID = $scope.payschedulesearch.ENTITY_ID;
        CusModelObj.PAGE_NO = $scope.payschedulesearch.PAGE_NO;
        CusModelObj.PAGE_SIZE = $scope.payschedulesearch.PAGE_SIZE;
        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_GET_PAYSCHEDULES').then(function (data) {
            //   $scope.PAYSCHEDULES_LIST = data.data.Table;
            if (data.data.Table.length > 0) {
                $scope.$parent.overlay_loadingNew = 'none';
                $scope.PAYSCHEDULES_LIST = $scope.PAYSCHEDULES_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.payschedulesearch.PAGE_SIZE) {
                    $scope.PayscheduleGetData = false;
                }
                else {
                    $scope.payschedulesearch.PAGE_NO = parseInt($scope.payschedulesearch.PAGE_NO) + 1;
                    $scope.PayscheduleGetData = true;
                }
            }
            else {
                if ($scope.PAYSCHEDULES_LIST.length == 0) { }
                $scope.PayscheduleGetData = false;
                $scope.$parent.overlay_loadingNew = 'none';
            }
        });
    }
    // paycode Note: when passing @PI_ACTIVE=0 for deleting, passing @PI_USER_ID, @PI_PAYCODE_ID is must
    $scope.HRM_INS_UPD_PAYCODES = function () {
        $scope.PAYROLL_FORM.submitted = true;
        if ($scope.PAYROLL_FORM.$valid) {
            var CusModelObj = new Object();
            CusModelObj.PAYCODE_ID = $scope.payrollsearch.PAYCODE_ID;
            CusModelObj.CODE = $scope.payrollsearch.CODE;
            CusModelObj.TITLE = $scope.payrollsearch.TITLE;
            CusModelObj.TYPE_ID = $scope.payrollsearch.TYPE_ID;
            CusModelObj.CALCULATION_ID = $scope.payrollsearch.CALCULATION_ID;
            CusModelObj.DEFAULT_VALUES = $scope.payrollsearch.DEFAULT_VALUES;
            CusModelObj.RECURRING = $scope.payrollsearch.RECURRING ? 1 : 0;
            CusModelObj.NI = $scope.payrollsearch.NI ? 1 : 0;
            CusModelObj.TAX = $scope.payrollsearch.TAX ? 1 : 0;
            CusModelObj.PENSION = $scope.payrollsearch.PENSION ? 1 : 0;
            CusModelObj.ENTITY_ID = $scope.payrollsearch.ENTITY_ID;
            CusModelObj.CUSTOMER_ID = $scope.payrollsearch.CUSTOMER_ID;
            CusModelObj.USER_ID = $scope.payrollsearch.USER_ID;
            CusModelObj.ACTIVE = 1;
            PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_INS_UPD_PAYCODES').then(function (data) {
                if (data.data > 0) {
                    if ($scope.payrollsearch.PAYCODE_ID == 0 || $scope.payrollsearch.PAYCODE_ID == '' || $scope.payrollsearch.PAYCODE_ID == undefined) {
                        $scope.$parent.ShowAlertBox("Success", 'Pay code added successfully', 3000);
                    }
                    else if (data.data > 0) {
                        $scope.$parent.ShowAlertBox("Success", 'Pay code  updated successfully', 3000);
                    }
                    $scope.RESET_Fn();
                    $scope.HRM_GET_PAYCODES(1);
                }
                else if (data.data < 0) {
                    $scope.$parent.ShowAlertBox("Attention", 'Pay code already added', 3000);
                }
                if (data.data == 0) {
                    $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                }
            });
        }
    }
    // paycode Note: when passing @PI_ACTIVE=0 for deleting, passing @PI_USER_ID, @PI_PAYCODE_ID is must
    $scope.DELETE_PAYCODES = function () {
        var CusModelObj = new Object();
        CusModelObj.PAYCODE_ID = $scope.SELECTED_PAYCODE.PAYCODE_ID;
        CusModelObj.CUSTOMER_ID = $scope.payrollsearch.CUSTOMER_ID;
        CusModelObj.USER_ID = $scope.payrollsearch.USER_ID;
        CusModelObj.ACTIVE = 0;
        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_INS_UPD_PAYCODES').then(function (data) {
            if (data.data > 0) {
                $scope.$parent.ShowAlertBox("Success", 'Pay code deleted successfully', 3000);
                $scope.HRM_GET_PAYCODES(1);
            }
            else if (data.data < 0) {
                $scope.$parent.ShowAlertBox("Attention", 'Pay code already added', 3000);
            }
            if (data.data == 0) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
        });
    }
    $scope.SHOW_WARNING_MESSAGE_FOR_PAYCODE = false;
    $scope.MAPPED_EMPLOYEE_PAYCODE_COUNT = 0;

    //paycode
    $scope.EDIT_PAY_CODE_Fn = function (_param_paycode) {
        var CusModelObj = new Object();
        CusModelObj.PAYCODE_ID = _param_paycode.PAYCODE_ID;
        CusModelObj.CUSTOMER_ID = _param_paycode.CUSTOMER_ID;
        CusModelObj.ENTITY_ID = $scope.payrollsearch.ENTITY_ID;
        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_GET_EMPLOYEE_COUNT_FOR_PAYCODES').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.MAPPED_EMPLOYEE_PAYCODE_COUNT = data.data.Table.length;
                $scope.SHOW_WARNING_MESSAGE_FOR_PAYCODE = true;
            } else {
                $scope.SHOW_WARNING_MESSAGE_FOR_PAYCODE = false;
                $scope.MAPPED_EMPLOYEE_PAYCODE_COUNT = 0;
            }
        });
        $scope.payrollsearch.PAYCODE_ID = _param_paycode.PAYCODE_ID;
        $scope.payrollsearch.CODE = _param_paycode.CODE;
        $scope.payrollsearch.TITLE = _param_paycode.TITLE;
        $scope.payrollsearch.TYPE_ID = _param_paycode.TYPE_ID;
        $scope.payrollsearch.CUSTOM_TYPE_NAME = _param_paycode.TYPE_NAME;
        $scope.payrollsearch.CALCULATION_ID = _param_paycode.CALCULATION_ID;
        $scope.payrollsearch.CUSTOM_CALCULATION_NAME = _param_paycode.CALCULATION_NAME;
        $scope.payrollsearch.DEFAULT_VALUES = _param_paycode.DEFAULT_VALUES;
        $scope.payrollsearch.RECURRING = _param_paycode.RECURRING;
        $scope.payrollsearch.NI = _param_paycode.NI;
        $scope.payrollsearch.TAX = _param_paycode.TAX;
        $scope.payrollsearch.PENSION = _param_paycode.PENSION;
    };

    //PaySchedule
    $scope.EDIT_PAY_SCHEDULES_Fn = function (_param_payschedule, _param_index) {

        $scope.HRM_GET_PAYSCHEDULE_BY_ID(_param_payschedule);
        //var CusModelObj = new Object();
        //CusModelObj.PAYCODE_ID = $scope.SELECTED_PAYCODE.PAYCODE_ID;
        //CusModelObj.CUSTOMER_ID = $scope.payrollsearch.CUSTOMER_ID;
        //CusModelObj.USER_ID = $scope.payrollsearch.USER_ID;
        //CusModelObj.ACTIVE = 0;
        //PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_INS_UPD_PAYCODES').then(function (data) {
        //    if (data.data > 0) {
        //        $scope.$parent.ShowAlertBox("Success", 'Pay code deleted successfully', 3000);
        //        $scope.HRM_GET_PAYCODES(1);
        //    }
        //    else if (data.data < 0) {
        //        $scope.$parent.ShowAlertBox("Attention", 'Pay code already added', 3000);
        //    }
        //    if (data.data == 0) {
        //        $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
        //    }
        //});

    }

    //payschedule
    $scope.VIEW_PAY_SCHEDULES_Fn = function (_param_payschedule, _param_index) {
        $scope.HRM_GET_PAYSCHEDULE_BY_ID(_param_payschedule, 1);
    }
    //payschedule
    $scope.DELETE_PAY_SCHEDULES_Fn = function (_payschedule, index) {
        $scope.SELECTED_PAYSCHEDULE = _payschedule;

        var CusModelObj = new Object();
        CusModelObj.PAYSCHEDULES_ID = $scope.SELECTED_PAYSCHEDULE.PAYSCHEDULE_ID;
        //CusModelObj.FLAG = 1;
        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_GET_EMPLOYEE_COUNT_FOR_PAYSCHEDULES').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.COUNT_VAL = 0;
                if (data.data.Table[0].EMPLOYEE_COUNT_FOR_PAYSCHEDULES > 0) {
                    $scope.COUNT_VAL = data.data.Table[0].EMPLOYEE_COUNT_FOR_PAYSCHEDULES;
                    //$scope.$parent.ShowAlertBox("Attention", $scope.SELECTED_PAYSCHEDULE.PAYSCHEDULE_NAME + ' Pay schedule are not deleted because this schedule its already schedule in employee.', 3000);
                }
                $('#Deletepayschedule').modal('show');
                //else {
                //    //$scope.SELECTED_DEPARTMENT.MESSAGE = "It is safe to perform this operation as it hasn't been assigned to any employee. Do you want to proceed?";
                //    $('#Deletepayschedule').modal('show');
                //}
            } else {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
        });

    }
    $scope.DELETE_PAY_SCHEDULE = function (_payschedule) {
        var CusModelObj = new Object();
        CusModelObj.PAYSCHEDULE_ID = _payschedule.PAYSCHEDULE_ID;
        CusModelObj.NAME = _payschedule.PAYSCHEDULE_NAME;
        CusModelObj.FREQUENCY = _payschedule.FREQUENCY;//, --1 WEEKLY 2 MONTHLY 3 FORTNIGHTLY'
        CusModelObj.START_DATE = $filter('date')(_payschedule.START_DATE, 'MMM d, y');  //new Date(_payschedule.START_DATE); 
        CusModelObj.END_DATE = $filter('date')(_payschedule.START_DATE, 'MMM d, y');
        CusModelObj.FIRST_PAYDAY = _payschedule.FIRST_PAYDAY;
        CusModelObj.HOLIDAY_CALENDAR_ID = _payschedule.HOLIDAY_CALENDAR_ID;
        CusModelObj.ENTITY_ID = $scope.payschedulesearch.ENTITY_ID;
        CusModelObj.CUSTOMER_ID = $scope.payschedulesearch.CUSTOMER_ID;;
        CusModelObj.USER_ID = $scope.payschedulesearch.USER_ID;;
        CusModelObj.ACTIVE = 0;
        CusModelObj.HRM_PAYSCHEDULES_DATES = [{ START_DATE: '', END_DATE: '', PAY_DATE: '' }];

        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_INS_UPD_PAYSCHEDULE').then(function (data) {
            if (data.data > 0) {
                $scope.$parent.ShowAlertBox("Success", 'Pay schedule deleted successfully', 3000);
                $scope.HRM_GET_PAYSCHEDULES(1);
            }
            else if (data.data == 0) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
        });
    }
    $scope.CHECK_DATE_END_Fn = function () {
        if ($scope.payschedulesearch.END_DATE != '' && $scope.payschedulesearch.END_DATE != null && $scope.payschedulesearch.START_DATE != '' && $scope.payschedulesearch.START_DATE != null && new Date($scope.payschedulesearch.END_DATE) > new Date($scope.payschedulesearch.START_DATE)) {
            $scope.END_DATE_FLAG = 0;
        }

    }
    $scope.nginit_datelock = function (_line, FLAG_LAST) {
        if (_line.LOCK_DATE != null) {
            //_line.LOCK_DATE = ($filter('date')(new Date(_line.LOCK_DATE)));
            _line.LOCK_DATE = ($filter('date')((_line.LOCK_DATE), $scope.$parent.DISPLAY_DATE_FORMAT));
        }
        if (FLAG_LAST) {
            $scope.$parent.$parent.DATE_INPUT_LOAD('OPEN_ALL', 0);
        }
    }

    //$scope.DATE_DAY_CAL = function () {
    //    if ($scope.payschedulesearch.FREQUENCY != null && $scope.payschedulesearch.FREQUENCY != "" && $scope.payschedulesearch.FREQUENCY != undefined && $scope.payschedulesearch.START_DATE != '' && $scope.payschedulesearch.START_DATE != null) {
    //        if ($scope.payschedulesearch.FREQUENCY == 1) {
    //            var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    //            var firstDate = new Date($scope.payschedulesearch.START_DATE);
    //            var secondDate = new Date($scope.payschedulesearch.END_DATE);

    //            //calculate time difference  
    //            var time_difference = secondDate.getTime() - firstDate.getTime();

    //            //calculate days difference by dividing total milliseconds in a day  
    //            var result = (time_difference / (1000 * 60 * 60 * 24)) + 1;
    //            if (result!=7) {
    //                $scope.payschedulesearch.END_DATE = '';
    //                $scope.$parent.ShowAlertBox("Attention", 'Your weekly are not be  ' + result + ' days', 3000);

    //            }
    //        }
    //        if ($scope.payschedulesearch.FREQUENCY == 2) {
    //            var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    //            var firstDate = new Date($scope.payschedulesearch.START_DATE);
    //            var secondDate = new Date($scope.payschedulesearch.END_DATE);

    //            //calculate time difference  
    //            var time_difference = secondDate.getTime() - firstDate.getTime();

    //            //calculate days difference by dividing total milliseconds in a day  
    //            var result = (time_difference / (1000 * 60 * 60 * 24)) + 1;
    //            if (result < 28 || result > 31) {
    //                $scope.payschedulesearch.END_DATE = '';
    //                $scope.$parent.ShowAlertBox("Attention", 'Your monthly are not be  ' + result + ' days', 3000);

    //            }
    //        }
    //    }
    //}
    $scope.CHECK_DATE_FIRSTPAY_Fn = function (_asset) {
        if ($scope.payschedulesearch.FIRST_PAYDAY != '' && $scope.payschedulesearch.FIRST_PAYDAY != null && $scope.payschedulesearch.START_DATE != '' && $scope.payschedulesearch.START_DATE != null
            && moment($scope.payschedulesearch.FIRST_PAYDAY, $scope.$parent.CONVERSION_DATE_FORMAT).toDate() > moment($scope.payschedulesearch.START_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate()) {
            $scope.FIRST_PAY_DATE_FLAG = 0;
        }
        //if ($scope.payschedulesearch.FIRST_PAYDAY != '' && $scope.payschedulesearch.FIRST_PAYDAY != null && $scope.payschedulesearch.START_DATE != '' && $scope.payschedulesearch.START_DATE != null
        //    && new Date($scope.payschedulesearch.FIRST_PAYDAY) > new Date($scope.payschedulesearch.START_DATE)) {
        //    $scope.FIRST_PAY_DATE_FLAG = 0;
        //}
    }
    ///Payschedule
    $scope.HRM_INS_UPD_PAYSCHEDULE = function (FLAG) {
        let valid = 0;
        if ($scope.PAY_SCHEDULEFORM.$valid) {
            $scope.END_DATE_FLAG = 0;
            if (FLAG == undefined && moment($scope.payschedulesearch.START_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate() > moment($scope.payschedulesearch.END_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate()) {
                $scope.END_DATE_FLAG = 1;
                valid++;
                $('#Preview_Pay_Schedule').modal('hide');
            }
            //if (new Date($scope.payschedulesearch.START_DATE) > new Date($scope.payschedulesearch.END_DATE)) {
            //    $scope.END_DATE_FLAG = 1;
            //    valid++;
            //    $('#Preview_Pay_Schedule').modal('hide');
            //}
        }
        //if (moment($scope.payschedulesearch.START_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate() > moment($scope.payschedulesearch.END_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate()) {
        //    $scope.END_DATE_FLAG = 1;
        //    valid++;
        //}
        if (valid == 0) {
            $scope.PAY_SCHEDULEFORM.submitted = true;
        }
        if ($scope.PAY_SCHEDULEFORM.$valid && valid == 0) {
            var CusModelObj = new Object();
            CusModelObj.PAYSCHEDULE_ID = $scope.payschedulesearch.PAYSCHEDULE_ID;
            CusModelObj.NAME = $scope.payschedulesearch.NAME;
            CusModelObj.FREQUENCY = $scope.payschedulesearch.FREQUENCY;//, --1 WEEKLY 2 MONTHLY 3 FORTNIGHTLY'

            CusModelObj.START_DATE = FLAG == 1 ? null : moment($scope.payschedulesearch.START_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).format('L');
            CusModelObj.END_DATE = FLAG == 1 ? null : moment($scope.payschedulesearch.END_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).format('L');
            CusModelObj.FIRST_PAYDAY = FLAG == 1 ? null : moment($scope.payschedulesearch.FIRST_PAYDAY, $scope.$parent.CONVERSION_DATE_FORMAT).format('L');

            CusModelObj.HOLIDAY_CALENDAR_ID = FLAG == 1 ? null : $scope.payschedulesearch.HOLIDAY_CALENDAR_ID;
            CusModelObj.ENTITY_ID = $scope.payschedulesearch.ENTITY_ID;
            CusModelObj.CUSTOMER_ID = $scope.payschedulesearch.CUSTOMER_ID;
            CusModelObj.USER_ID = $scope.payschedulesearch.USER_ID;
            CusModelObj.ACTIVE = 1;
            CusModelObj.HRM_PAYSCHEDULES_DATES = [];
            if (FLAG == 1) {
                var readonly = new Object()
                readonly.START_DATE = null;
                readonly.END_DATE = null;
                readonly.PAY_DATE = null;
                CusModelObj.HRM_PAYSCHEDULES_DATES.push(readonly);
            }
            else {
                angular.forEach($scope.PAYSCHEDULE_DATES_LIST, function (_loop_value) {
                    var readonly = new Object()
                    readonly.START_DATE = ($filter('date')(new Date(_loop_value.START_DATE)));
                    readonly.END_DATE = ($filter('date')(new Date(_loop_value.END_DATE)));
                    readonly.PAY_DATE = ($filter('date')(new Date(_loop_value.PAY_DATE)));
                    CusModelObj.HRM_PAYSCHEDULES_DATES.push(readonly);
                });
            }
            if (valid == 0) {
                PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_INS_UPD_PAYSCHEDULE').then(function (data) {
                    if (data.data > 0) {
                        if ($scope.payschedulesearch.PAYSCHEDULE_ID == 0 || $scope.payschedulesearch.PAYSCHEDULE_ID == undefined || $scope.payschedulesearch.PAYSCHEDULE_ID == '' || $scope.payschedulesearch.PAYSCHEDULE_ID == null) {
                            $scope.$parent.ShowAlertBox("Success", 'Pay schedule added successfully', 3000);
                        }
                        else if (data.data > 0) {
                            $scope.$parent.ShowAlertBox("Success", 'Pay schedule updated successfully', 3000);
                        }

                        $('#Preview_Pay_Schedule').modal('hide');
                        $scope.HRM_GET_PAYSCHEDULES(1);
                        $scope.RESET_PRIVIEW_Fn();
                    }
                    else if (data.data < 0) {
                        //$scope.$parent.ShowAlertBox("Attention", 'Pay schedule already added', 3000);
                        $('#Duplicate_Schedule').modal('show');
                        $('#Preview_Pay_Schedule').modal('hide');
                    }
                    if (data.data == 0) {
                        $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                    }
                });
            }
        }
    }

    $scope.INS_UPD_CUSTOMER_SETTINGS = function (SETTING_VALUE, SETTING_MASTER_ID) {
        var CusModelObj = new Object();
        CusModelObj.validcount = 0;
        CusModelObj.CUSTOMER_ID = $scope.payschedulesearch.CUSTOMER_ID;
        CusModelObj.USER_ID = $scope.payschedulesearch.USER_ID;
        CusModelObj.CUSTOMER_SETTINGS_TYPE = [];
        if (SETTING_VALUE > 12 && SETTING_MASTER_ID == 49) {
            CusModelObj.validcount = 1;
            $scope.$parent.ShowAlertBox("Error", 'Month should not be more than 12', 3000);
        }
        if (CusModelObj.validcount == 0) {
            var readonly = new Object()
            readonly.SETTING_VALUE = SETTING_VALUE ? 1 : 0;
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
                    $scope.$parent.ShowAlertBox("Success", 'Updated successfully', 3000);
                }
                if (data.data == 0) {
                    $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                }
            });
        }
    }
    /// INS_UPD_CUSTOMER_SETTINGS for calculation
    $scope.INS_UPD_CUSTOMER_SETTINGS_CALCULATION = function () {
        //84	Employers NI %
        //85	Employers Pension %
        //86	Holiday Accrual %
        //87	Exclude Salaried from Holiday Accrual done tru

        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_ID = $scope.PayCalculationsearch.CUSTOMER_ID;
        CusModelObj.USER_ID = $scope.PayCalculationsearch.USER_ID;
        CusModelObj.CUSTOMER_SETTINGS_TYPE = [];
        CusModelObj.BRANCH_TYPE = [];
        CusModelObj.POSITIONS_TYPE = [];
        CusModelObj.DEPARTMENTS_TYPE = [];
        CusModelObj.EMPLOYEES_TYPE = [];

        var readonly = new Object()
        readonly.SETTING_VALUE = $scope.PayCalculationsearch.EMPLOYERS_NI;
        readonly.SETTING_MASTER_ID = 84;
        CusModelObj.CUSTOMER_SETTINGS_TYPE.push(readonly);

        var readonly = new Object()
        readonly.SETTING_VALUE = $scope.PayCalculationsearch.EMPLOYERS_PENSION;
        readonly.SETTING_MASTER_ID = 85;
        CusModelObj.CUSTOMER_SETTINGS_TYPE.push(readonly);

        var readonly = new Object()
        readonly.SETTING_VALUE = $scope.PayCalculationsearch.HOLIDAY_ACCRUEL;
        readonly.SETTING_MASTER_ID = 86;
        CusModelObj.CUSTOMER_SETTINGS_TYPE.push(readonly);


        let resultobject = $scope.$parent.BLANK_SETTING_OBJECT();
        CusModelObj.BRANCH_TYPE.push(resultobject);
        CusModelObj.POSITIONS_TYPE.push(resultobject);
        CusModelObj.DEPARTMENTS_TYPE.push(resultobject);
        CusModelObj.EMPLOYEES_TYPE.push(resultobject);

        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'INS_UPD_CUSTOMER_SETTINGS').then(function (data) {
            if (data.data > 0) {
                $scope.$parent.ShowAlertBox("Success", 'Updated successfully', 3000);
            }
            if (data.data == 0) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
        });
    }

    // DAta lock
    $scope.HRM_INS_UPD_LOCK_DATE_BRANCH_SETTING = function () {
        //$scope.LockDatefrom.submitted = true;
        // if ($scope.LockDatefrom.$valid) {
        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_ID = $cookies.get("CUSTOMER_ID");
        CusModelObj.USER_ID = $cookies.get("USERID");
        CusModelObj.HRM_LOCK_DATE = [];
        angular.forEach($scope.HRM_LOCK_DATE_LIST, function (_loop_value) {
            var readonly = new Object()
            readonly.HRM_LOCK_DATE_ID = _loop_value.HRM_LOCK_DATE_ID == undefined ? 0 : _loop_value.HRM_LOCK_DATE_ID;
            //readonly.LOCK_DATE = ($filter('date')(new Date(_loop_value.LOCK_DATE)));
            readonly.LOCK_DATE = _loop_value.LOCK_DATE == undefined || _loop_value.LOCK_DATE == null || _loop_value.LOCK_DATE == "" ? null : moment(_loop_value.LOCK_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).format('L');
            readonly.ENTITY_ID = null;
            readonly.BRANCH_ID = _loop_value.BRANCH_ID;
            readonly.ACTIVE = 1;
            CusModelObj.HRM_LOCK_DATE.push(readonly);
        });
        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_INS_UPD_LOCK_DATE_BRANCH_SETTING').then(function (data) {
            if (data.data > 0) {
                $scope.$parent.ShowAlertBox("Success", 'Date locked successfully', 3000);
                $scope.GET_HRM_LOCK_DATE();
            }
            else if (data.data < 0) {
            }
            if (data.data == 0) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
        });
        //}
    }

    //payschedule
    $scope.POP_PRIVIEW_SAVE_Fn = function () {
        $scope.PAY_SCHEDULEFORM.submitted = true;
        if ($scope.PAY_SCHEDULEFORM.$valid && $scope.payschedulesearch.FREQUENCY != 4) {

            var valid = 0;
            $scope.END_DATE_FLAG = 0;
            $scope.FIRST_PAY_DATE_FLAG = 0;
            if (moment($scope.payschedulesearch.START_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate() > moment($scope.payschedulesearch.END_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate()) {
                $scope.END_DATE_FLAG = 1;
                valid++;
            }
            if (moment($scope.payschedulesearch.FIRST_PAYDAY, $scope.$parent.CONVERSION_DATE_FORMAT).toDate() < moment($scope.payschedulesearch.START_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate()) {
                $scope.FIRST_PAY_DATE_FLAG = 1;
                valid++;
            }
            if ($scope.payschedulesearch.FREQUENCY == 1) {
                var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
                //var firstDate = new Date($scope.payschedulesearch.START_DATE);
                //var secondDate = new Date($scope.payschedulesearch.END_DATE);
                var firstDate = moment($scope.payschedulesearch.START_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate();
                var secondDate = moment($scope.payschedulesearch.END_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate();

                //($filter('date')((payresult.START_DATE), $scope.$parent.CONVERSION_DATE_FORMAT));


                //calculate time difference  
                var time_difference = secondDate.getTime() - firstDate.getTime();

                //calculate days difference by dividing total milliseconds in a day  
                var result = (time_difference / (1000 * 60 * 60 * 24));
                if (result > 6 || result < 6) { // indexing start on zero in week 
                    $scope.payschedulesearch.END_DATE = '';
                    $scope.FREQUENCY_DAY_FLAG = 0;
                    $scope.$parent.ShowAlertBox("Attention", 'The date range should be in between 7 days', 3000);
                    valid++;
                }
            }
            if ($scope.payschedulesearch.FREQUENCY == 2) {
                //var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
                ////var firstDate = new Date($scope.payschedulesearch.START_DATE);
                ////var secondDate = new Date($scope.payschedulesearch.END_DATE);
                //var firstDate = moment($scope.payschedulesearch.START_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate();
                //var secondDate = moment($scope.payschedulesearch.END_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate();
                ////calculate time difference  
                //var time_difference = secondDate.getTime() - firstDate.getTime();
                ////calculate days difference by dividing total milliseconds in a day  
                //var result = (time_difference / (1000 * 60 * 60 * 24));
                //if (result < 27) {
                //    $scope.payschedulesearch.END_DATE = '';
                //    $scope.FREQUENCY_DAY_FLAG = 0;
                //    $scope.$parent.ShowAlertBox("Attention", 'The date range should be greater than 27 days', 3000);
                //    valid++;
                //}

                var firstDate = moment($scope.payschedulesearch.START_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate();
                var secondDate = moment($scope.payschedulesearch.END_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate();
                var monthname = moment($scope.payschedulesearch.START_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).format('MMMM');

                const monthStart = moment(firstDate).startOf('month');
                const monthEnd = moment(secondDate).endOf('month');
                // Check if the start and end match
                const isStartOfMonth = moment(firstDate).isSame(monthStart, 'day');
                const isEndOfMonth = moment(secondDate).isSame(monthEnd, 'day');

                if (isStartOfMonth && isEndOfMonth) {
                    console.log('The dates match the start and end of the month.');
                } else {
                    $scope.payschedulesearch.END_DATE = '';
                    $scope.FREQUENCY_DAY_FLAG = 0;
                    $scope.$parent.ShowAlertBox("Attention", 'Please select a correct start date and end date of month (' + monthname + ')', 3000);
                    valid++;
                }
            }
            if ($scope.payschedulesearch.FREQUENCY == 3) {
                var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
                //var firstDate = new Date($scope.payschedulesearch.START_DATE);
                //var secondDate = new Date($scope.payschedulesearch.END_DATE);
                var firstDate = moment($scope.payschedulesearch.START_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate();
                var secondDate = moment($scope.payschedulesearch.END_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate();
                //calculate time difference  
                var time_difference = secondDate.getTime() - firstDate.getTime();

                //calculate days difference by dividing total milliseconds in a day  
                var result = (time_difference / (1000 * 60 * 60 * 24));
                //if (result > 7 || result < 6) {
                if (result > 13 || result < 13) {
                    $scope.payschedulesearch.END_DATE = '';
                    $scope.FREQUENCY_DAY_FLAG = 0;
                    $scope.$parent.ShowAlertBox("Attention", 'The date range should be in between 14 days', 3000);
                    valid++;
                }
            }
            if (valid == 0) {
                $scope.HRM_GET_PAYSCHEDULE_DATES();
            }
        }
        else if ($scope.payschedulesearch.FREQUENCY == 4) {
            if ($scope.PAY_SCHEDULEFORM.$valid) {
                $scope.HRM_INS_UPD_PAYSCHEDULE(1);
            }
        }
    }

    $scope.PAY_ROLL_TAB_CLICK = function (FLAG) {
        $scope.TAB_ID = FLAG;
        if (FLAG == 2) {
            $scope.HRM_GET_HOLIDAY_CALENDARS();
            $scope.HRM_GET_PAYSCHEDULES(1);
            $scope.GET_CUSTOMER_SETTINGS($scope.payschedulesearch, '79,84,85,86,87');
        }
        if (FLAG == 3) {
            $scope.GET_CUSTOMER_SETTINGS($scope.PayCalculationsearch, '79,84,85,86,87');
        }
    }
    $scope.PAY_ROLL_TAB_CLICK(1);

    $scope.SELECTED_TYPE_Fn = function (_param_payroll) {
        if (_param_payroll == '') {
            $scope.payrollsearch.CUSTOM_TYPE_NAME = $scope.payrollsearch.DD_DEFAULT_TEXT;
            $scope.payrollsearch.TYPE_ID = '';
        }
        else {
            $scope.payrollsearch.CUSTOM_TYPE_NAME = _param_payroll.TYPE_NAME;
            $scope.payrollsearch.TYPE_ID = _param_payroll.TYPE_ID;
        }
    }
    $scope.SELECTED_CALCULATION_Fn = function (_param_calculation) {
        if (_param_calculation == '') {
            $scope.payrollsearch.CUSTOM_CALCULATION_NAME = $scope.payrollsearch.DD_DEFAULT_TEXT;
            $scope.payrollsearch.CALCULATION_ID = '';
        }
        else {
            $scope.payrollsearch.CUSTOM_CALCULATION_NAME = _param_calculation.CALCULATION_NAME;
            $scope.payrollsearch.CALCULATION_ID = _param_calculation.CALCULATION_ID;
        }
    }

    $scope.SELECTED_FREQUENCY_Fn = function (_param_frequency) {
        if (_param_frequency == '') {
            $scope.payschedulesearch.CUSTOM_FREQUENCY_NAME = $scope.payschedulesearch.DD_DEFAULT_TEXT;
            $scope.payschedulesearch.FREQUENCY = ''
        }
        else {
            $scope.payschedulesearch.CUSTOM_FREQUENCY_NAME = _param_frequency.FREQUENCY_NAME;
            $scope.payschedulesearch.FREQUENCY = _param_frequency.FREQUENCY;
        }
    }


    $scope.SELECTED_CALENDAR_Fn = function (_param_holiday) {
        if (_param_holiday == '') {
            $scope.payschedulesearch.CUSTOM_CALENDAR_NAME = $scope.payschedulesearch.DD_DEFAULT_TEXT;
            $scope.payschedulesearch.HOLIDAY_CALENDAR_ID = "";
        }
        else {
            $scope.payschedulesearch.CUSTOM_CALENDAR_NAME = _param_holiday.CALENDAR_NAME;
            $scope.payschedulesearch.HOLIDAY_CALENDAR_ID = _param_holiday.HOLIDAY_CALENDAR_ID;
        }
    }
    $scope.SELECTED_CALCULATION_Fn('');
    $scope.SELECTED_TYPE_Fn('');
    $scope.SELECTED_CALENDAR_Fn('');

    $scope.HRM_GET_PAYCODES(1);
    $scope.CURRENT_DATE();
    $scope.POP_DELETE_PAY_CODE = function (_parma_paycode) {
        $scope.SELECTED_PAYCODE = _parma_paycode;
        $scope.COUNT_VAL = 0;
        var CusModelObj = new Object();
        CusModelObj.PAYCODE_ID = _parma_paycode.PAYCODE_ID;
        CusModelObj.CUSTOMER_ID = _parma_paycode.CUSTOMER_ID;
        CusModelObj.ENTITY_ID = _parma_paycode.ENTITY_ID;
        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_GET_EMPLOYEE_COUNT_FOR_PAYCODES').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.COUNT_VAL = data.data.Table.length;
                //$scope.$parent.ShowAlertBox("Attention", $scope.SELECTED_PAYCODE.CODE + ' Pay Code are not deleted because this code its already apply in employee list.', 3000);
            }
            $('#Deletepaycode').modal('show');
            //else {
            //    $('#Deletepaycode').modal('show');
            //}
        });

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
                    if (_loop_value.SETTING_MASTER_ID == 79) {
                        $scope.payschedulesearch.LOCK_PAYROLL_PERIOD = parseInt(_loop_value.SETTING_VALUE) == 1 ? true : false;
                    }
                    else if (_loop_value.SETTING_MASTER_ID == 84) {
                        $scope.PayCalculationsearch.EMPLOYERS_NI = parseFloat(_loop_value.SETTING_VALUE);
                    }
                    else if (_loop_value.SETTING_MASTER_ID == 85) {
                        $scope.PayCalculationsearch.EMPLOYERS_PENSION = parseFloat(_loop_value.SETTING_VALUE);
                    }
                    else if (_loop_value.SETTING_MASTER_ID == 86) {
                        $scope.PayCalculationsearch.HOLIDAY_ACCRUEL = parseFloat(_loop_value.SETTING_VALUE);
                    }
                    else if (_loop_value.SETTING_MASTER_ID == 87) {
                        $scope.PayCalculationsearch.ENABLE_EMPLOYEE_CONFIRM = parseInt(_loop_value.SETTING_VALUE) == 1 ? true : false;;
                    }
                });
            }
            else if (data.data == 0) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
        });
    }
    $scope.$parent.$parent.DATE_INPUT_LOAD();
});