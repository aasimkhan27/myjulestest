app.controller('EmpWagesController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    //$scope.$parent.DISPLAY_FLAG = false;
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(2);
    $(".modal-backdrop").remove();
    $scope.HR_COMMON_CODE_Fn();
    $scope.$parent.$parent.overlay_loading_HR_Loader = 'none';
    $scope.DD_DEFAULT_TEXT = $scope.$parent.DD_DEFAULT_TEXT;

    $scope.WagesSearch = {
        EMPLY_PRSNL_ID: getUrlParameter('EMP_ID', $location.absUrl()),
        CUSTOMER_ID: $cookies.get("CUSTOMER_ID"),
        ENTITY_ID: null,// $cookies.get("ENTITY_ID"),
        MODULE_ID: $cookies.get("MODULE_ID"),
        USER_ID: $cookies.get("USERID"),
        CUSTOM_PAY_TYPE: $scope.DD_DEFAULT_TEXT,
        DD_DEFAULT_TEXT: $scope.DD_DEFAULT_TEXT,
        STEP_NO: 3,
        PAGE_SIZE: $scope.$parent.PAGE_SIZE
    }
    $scope.PayCodeSearch = {
        EMPLY_PRSNL_ID: getUrlParameter('EMP_ID', $location.absUrl()),
        CUSTOMER_ID: $cookies.get("CUSTOMER_ID"),
        ENTITY_ID: null,
        MODULE_ID: $cookies.get("MODULE_ID"),
        USER_ID: $cookies.get("USERID"),
        CUSTOM_PAY_TYPE: $scope.DD_DEFAULT_TEXT,
        DD_DEFAULT_TEXT: $scope.DD_DEFAULT_TEXT,
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
    $scope.STEP_FLAG = 3;
    $scope.EDIT_STEP_NO = getUrlParameter('STEP_NO', $location.absUrl());
    $scope.EDIT_STEP_NO = $scope.EDIT_STEP_NO == undefined ? 0 : $scope.EDIT_STEP_NO;
    $scope.EDIT_MODE = $scope.EDIT_STEP_NO < 9 ? false : true;
    $scope.MY_PROFILE_FLAG = 0;

    if (parseInt(getUrlParameter('EMP_ID', $location.absUrl())) == parseInt($cookies.get("EMPLY_PRSNL_ID"))) {
        $scope.EDIT_MODE = true;
        $scope.MY_PROFILE_FLAG = 1;
    } else {
        $scope.SUPER_ADMIN_FLAG = 0;// HR Manage , manager 
    };
    $scope.HRM_EDIT_DETAILS = function () {
        $scope.EDIT_MODE = false;

    }

    $scope.ADDITION_TYPE = [{ TYPE_ID: 1, TYPE_NAME: 'Addition' }, { TYPE_ID: -1, TYPE_NAME: 'Deduction' }];
    $scope.CALCULATION_LIST = [{ CALCULATION_ID: 1, CALCULATION_NAME: 'Fixed Amount' },
    { CALCULATION_ID: 2, CALCULATION_NAME: 'Multiplier Day' },
    { CALCULATION_ID: 3, CALCULATION_NAME: 'Multiplier Hourly' },
    { CALCULATION_ID: 4, CALCULATION_NAME: 'Multiplier Shift' }]

    $scope.GET_CUSTOMER_SETTINGS = function (_param_retun_value, _param_tableids, _param_customer, _param_module) {
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
                    if (_loop_value.SETTING_MASTER_ID == 79) {
                        // $scope.WagesSearch.LOCK_PAYROLL_PERIOD = parseInt(_loop_value.SETTING_VALUE) == 1 ? true : false;
                    }
                    else if (_loop_value.SETTING_MASTER_ID == 84) {
                        $scope.WagesSearch.EMPLOYER_NI_PRCNT = parseFloat(_loop_value.SETTING_VALUE);
                    }
                    else if (_loop_value.SETTING_MASTER_ID == 85) {
                        $scope.WagesSearch.PENSIONS = parseFloat(_loop_value.SETTING_VALUE);
                    }
                    else if (_loop_value.SETTING_MASTER_ID == 86) {
                        $scope.WagesSearch.HOLIDAY_ACCRUEL_PRCNT = parseFloat(_loop_value.SETTING_VALUE);
                    }
                    else if (_loop_value.SETTING_MASTER_ID == 87) {
                        //   $scope.WagesSearch.ENABLE_EMPLOYEE_CONFIRM = parseInt(_loop_value.SETTING_VALUE) == 1 ? true : false;;
                    }
                });
            }
            else if (data.data == 0) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
        });
    }

    $scope.HRM_GET_EMPLOYEE_STEP = function () {
        var UserModelObj = new Object();
        UserModelObj.EMPLY_PRSNL_ID = getUrlParameter('EMP_ID', $location.absUrl());
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'HRM_GET_EMPLOYEE_STEP').then(function (data) {
            if (data.data.Table.length > 0) {
                let RESULT_PERSNL = data.data.Table[0];
                $scope.HeaderPrimaryDetails.FIRST_NAME = RESULT_PERSNL.FIRST_NAME;
                $scope.HeaderPrimaryDetails.MIDDLE_NAME = RESULT_PERSNL.MIDDLE_NAME;
                $scope.HeaderPrimaryDetails.LAST_NAME = RESULT_PERSNL.LAST_NAME;
                $scope.HeaderPrimaryDetails.BRANCH_ID = RESULT_PERSNL.BRANCH_ID;
                $scope.HeaderPrimaryDetails.LOCK_DATE = $scope.$parent.CHECK_LOCK_DATE_Fn(RESULT_PERSNL.BRANCH_ID);

                $scope.SHOW_WAGE = $scope.CheckEmployeeAccess(parseInt($cookies.get("ENTITY_ID")), $scope.HeaderPrimaryDetails.BRANCH_ID, "SHOW_WAGE");
                $scope.STEP_NO = RESULT_PERSNL.STEP_NO;
                if (RESULT_PERSNL.EMPLOYEE_STATUS_ID == 5) {
                    $scope.SHOW_EDIT_ACCESS = false;
                    $scope.EDIT_MODE = true;
                }
                else {
                    if (RESULT_PERSNL.STEP_NO == 9) {
                        $scope.EDIT_STEP_NO = RESULT_PERSNL.STEP_NO == undefined ? 0 : RESULT_PERSNL.STEP_NO;
                    } else {
                        $scope.EDIT_STEP_NO = RESULT_PERSNL.STEP_NO;
                        // $scope.SHOW_EDIT_ACCESS = true;
                    }
                    if ($cookies.get("EMPLY_PRSNL_ID") == 0) {
                        $scope.SHOW_EDIT_ACCESS = true;
                    }
                    else if (RESULT_PERSNL.BRANCH_ID == null) {
                        $scope.SHOW_EDIT_ACCESS = $scope.CheckEmployeeAllBranchAccess('EDIT_EMPLOYEE');
                    }
                    else {
                        $scope.SHOW_EDIT_ACCESS = $scope.CheckEmployeeAccess(parseInt($cookies.get("ENTITY_ID")), RESULT_PERSNL.BRANCH_ID, "EDIT_EMPLOYEE");
                        if ($scope.CheckEmployeeAccess(parseInt($cookies.get("ENTITY_ID")), RESULT_PERSNL.BRANCH_ID, "SHOW_WAGE") == false && $scope.EDIT_STEP_NO == 9) {
                            $scope.SHOW_EDIT_ACCESS = false;
                        }
                    }
                    $scope.EDIT_MODE = $scope.EDIT_STEP_NO < 9 ? false : true;
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
        personaldetailobj.EMPLY_PRSNL_ID = $scope.WagesSearch.EMPLY_PRSNL_ID;
        personaldetailobj.STEP_NO = 3;
        personaldetailobj.ENTITY_ID = $cookies.get("ENTITY_ID");
        personaldetailobj.EFFECTIVE_DATE = moment($scope.WagesSearch.EFFECTIVE_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).format('L');
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



    $scope.WAGE_POSITION_LIST = [];

    $scope.HRM_GET_EMPLOYEE_WAGES = function () {
        var wagesobj = new Object()
        wagesobj.EMPLY_PRSNL_ID = $scope.WagesSearch.EMPLY_PRSNL_ID;
        PrcCommMethods.HUMANRESOURCE_API(wagesobj, 'HRM_GET_EMPLOYEE_WAGES').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.OrignalData = {}
                let _wage_header_result = data.data.Table[0];
                $scope.WagesSearch.EMPLOYEE_WAGES_ID = _wage_header_result.EMPLOYEE_WAGES_ID;

                $scope.WagesSearch.PAYTYPE_ID = _wage_header_result.PAYTYPE_ID;
                $scope.WagesSearch.CUSTOM_PAY_TYPE = _wage_header_result.PAY_TYPE;
                $scope.WagesSearch.PAID_BANK_HOLIDAY = _wage_header_result.PAID_BANK_HOLIDAY == 1 || _wage_header_result.PAID_BANK_HOLIDAY == true ? true : false;
                $scope.WagesSearch.ORDINAL = _wage_header_result.ORDINAL;
                switch ($scope.WagesSearch.PAYTYPE_ID) {
                    case 1:
                        $scope.RATE_LABEL = 'Monthly Salary';
                        break;
                    case 2:
                        $scope.RATE_LABEL = 'Hourly Rate';
                        break;
                    case 3:
                        $scope.RATE_LABEL = "Shift Rate";
                        break;
                    case 4:
                        $scope.RATE_LABEL = "Daily Rate";
                        break;
                }
                $scope.WagesSearch.PAYSCHEDULE_ID = _wage_header_result.PAYSCHEDULE_ID;
                $scope.WagesSearch.CUSTOM_PAY_SCHEDULE = _wage_header_result.PAYSCHEDULE_NAME;
                $scope.WagesSearch.NI_CATEGORY_ID = _wage_header_result.NI_CATEGORY_ID;

                if (_wage_header_result.NI_LETTER != null && _wage_header_result.NI_LETTER != undefined && _wage_header_result.NI_LETTER != '' && _wage_header_result.NI_TEXT != null && _wage_header_result.NI_TEXT != undefined && _wage_header_result.NI_TEXT != '') {
                    $scope.WagesSearch.CUSTOM_NI_CATEGORY = _wage_header_result.NI_LETTER + '-' + _wage_header_result.NI_TEXT;
                }
                else {
                    $scope.SELECTED_NI_CATEGORY_Fn('');
                }
                //setting details 
                $scope.WagesSearch.PENSIONS = _wage_header_result.PENSIONS;
                $scope.WagesSearch.EMPLOYER_NI_PRCNT = _wage_header_result.EMPLOYER_NI_PRCNT;
                $scope.WagesSearch.HOLIDAY_ACCRUEL_PRCNT = _wage_header_result.HOLIDAY_ACCRUEL_PRCNT;
                //end of setting details 
            } else {
                $scope.GET_CUSTOMER_SETTINGS($scope.WagesSearch, '84,85,86');
            };
            if (data.data.Table1.length > 0) {
                $scope.WAGE_POSITION_LIST = data.data.Table1;
                if ($scope.WAGE_POSITION_LIST.length == 1) {
                    if ($scope.WAGE_POSITION_LIST[0].EMPLOYEE_WAGES_ID == null && $scope.WAGE_POSITION_LIST[0].IS_PRIME == null) {
                        $scope.WAGE_POSITION_LIST[0].IS_PRIME = true;
                    }
                }
                $scope.WagesSearch.WAGE_POSITION_LIST = data.data.Table1;
            }
            else {
                $scope.WAGE_POSITION_LIST = [];
            }
            angular.forEach($scope.WAGE_POSITION_LIST, function (_loop_position_dtls) {
                $scope.CALCULATE_MONTHLY_RATE_Fn(_loop_position_dtls);
            });
            if (data.data.Table2.length > 0) {
                $scope.ADDITIONS_DEDUCTIONS_LIST = data.data.Table2;
                $scope.WagesSearch.ADDITIONS_DEDUCTIONS_LIST = data.data.Table2;
            }
            else {
                $scope.ADDITIONS_DEDUCTIONS_LIST = [];
                $scope.WagesSearch.ADDITIONS_DEDUCTIONS_LIST = [];
            }
            $scope.OrignalData = angular.copy($scope.WagesSearch);
        });
    }
    $scope.HRM_GET_PAYSCHEDULE_DROPDOWN = function () {
        var wagesobj = new Object()
        wagesobj.ENTITY_ID = $scope.WagesSearch.ENTITY_ID;
        wagesobj.CUSTOMER_ID = $scope.WagesSearch.CUSTOMER_ID;
        PrcCommMethods.HUMANRESOURCE_API(wagesobj, 'HRM_GET_PAYSCHEDULE_DROPDOWN').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.PAYSCHEDULE_DROPDOWN_LIST = data.data.Table;
            };
        });
    }
    $scope.SET_IS_PRIME_Fn = function (_position) {

        angular.forEach($scope.WAGE_POSITION_LIST, function (_wage) {
            _wage.IS_PRIME = false;
        });
        _position.IS_PRIME = true;
    };
    $scope.HRM_GET_PAYTYPES = function () {
        var wagesobj = new Object()
        wagesobj.EMPLY_PRSNL_ID = $scope.WagesSearch.EMPLY_PRSNL_ID;
        PrcCommMethods.HUMANRESOURCE_API(wagesobj, 'HRM_GET_PAYTYPES').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.PAYTYPES_LIST = data.data.Table;
            };
        });
    }
    $scope.HRM_GET_NI_CATEGORY = function () {
        var wagesobj = new Object()
        wagesobj.EMPLY_PRSNL_ID = $scope.WagesSearch.EMPLY_PRSNL_ID;
        PrcCommMethods.HUMANRESOURCE_API(wagesobj, 'HRM_GET_NI_CATEGORY').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.NI_CATEGORY_LIST = data.data.Table;
            };
        });
    }
    $scope.HRM_GET_PAYCODES = function () {
        var wagesobj = new Object()
        wagesobj.ENTITY_ID = $scope.WagesSearch.ENTITY_ID;
        wagesobj.CUSTOMER_ID = $scope.WagesSearch.CUSTOMER_ID;
        wagesobj.PAGE_NO = 0;
        wagesobj.PAGE_SIZE = 0;
        PrcCommMethods.HUMANRESOURCE_API(wagesobj, 'HRM_GET_PAYCODES').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.PAYCODES_LIST = data.data.Table;
            };
        });
    }
    $scope.FREQUENCY_LIST = [{ FREQUENCY: 1, FREQUENCY_NAME: 'Weekly' },
    { FREQUENCY: 2, FREQUENCY_NAME: 'Monthly' },
    { FREQUENCY: 3, FREQUENCY_NAME: 'Fortnightly' },]

    $scope.HRM_GET_PAYSCHEDULE_BY_ID = function () {
        var CusModelObj = new Object();
        CusModelObj.PAYSCHEDULE_ID = $scope.WagesSearch.PAYSCHEDULE_ID;
        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_GET_PAYSCHEDULE_BY_ID').then(function (data) {
            $scope.PAYSCHEDULE_BY_ID_LIST = data.data.Table1;
            $('#Preview_Pay_Dates').modal('show');
            let payresult = data.data.Table[0];
            $scope.WagesSearch.VIEW_PAYSCHEDULE_ID = payresult.PAYSCHEDULE_ID;
            $scope.WagesSearch.VIEW_NAME = payresult.PAYSCHEDULE_NAME;
            angular.forEach($scope.FREQUENCY_LIST, function (_freq) {
                if (_freq.FREQUENCY == payresult.FREQUENCY) {
                    $scope.WagesSearch.VIEW_FREQUENCY = _freq.FREQUENCY_NAME;
                }
            })
            //$scope.WagesSearch.VIEW_FREQUENCY = payresult.FREQUENCY;
            $scope.WagesSearch.VIEW_CUSTOM_PAYROLL_CALENDAR_YEAR = payresult.PAYROLL_CALENDAR_YEAR;
            $scope.WagesSearch.VIEW_START_DATE = ($filter('date')(new Date(payresult.START_DATE)));
            $scope.WagesSearch.VIEW_END_DATE = ($filter('date')(new Date(payresult.END_DATE)));
            $scope.WagesSearch.VIEW_FIRST_PAYDAY = payresult.FIRST_PAYDAY == null ? '' : ($filter('date')(new Date(payresult.FIRST_PAYDAY)));
            $scope.WagesSearch.VIEW_HOLIDAY_CALENDAR_ID = payresult.HOLIDAY_CALENDAR_ID;
            $scope.WagesSearch.VIEW_PAYROLL_CALENDAR_YEAR = payresult.YEAR;
            $scope.SELECTED_POP_CODE_Fn('');
            $scope.SELECTED_TYPE_Fn('');
            $scope.SELECTED_CALCULATION_Fn('');
            ///
            //  $scope.WagesSearch.VIEW_CUSTOM_FREQUENCY_NAME = _param_payschedule.FREQUENCY_NAME; noumna pending
            $scope.WagesSearch.VIEW_CUSTOM_CALENDAR_NAME = payresult.CALENDAR_NAME;
            $('#View_Calendar').modal('show');
        });
    }
    $scope.HRM_GET_PAYTYPES();
    $scope.HRM_GET_PAYSCHEDULE_DROPDOWN();

    $scope.HRM_GET_NI_CATEGORY();
    $scope.HRM_GET_PAYCODES();
    $scope.HRM_GET_EMPLOYEE_WAGES();

    //$scope.CHECK_HOURLY = function (_hourly) {
    //    if (_hourly != null && _hourly != 0) {
    //        if (_hourly >= 36) {
    //            _hourly = '';
    //            $scope.$parent.ShowAlertBox("Attention", 'Hourly rate is not greater then 36 hour per a day.', 3000)               
    //        }
    //    }
    //}

    $scope.ADDITIONS_DEDUCTIONS_LIST = [];
    $scope.ADDITIONS_DEDUCTIONS_DELETED_LIST = [];
    $scope.HRM_CLICK_EFFICTIVE_DATE = function () {
        $scope.EffectiveForm.submitted = true;
        if ($scope.EffectiveForm.$valid) {
            $scope.HRM_INS_UPD_EMPLOYEE_WAGES($scope.REDIRECTION_FLAG, 1);
        }
    }

    $scope.HRM_INS_UPD_EMPLOYEE_WAGES = function (FLAG, EFFECTIVE_FLAG) {
        $scope.REDIRECTION_FLAG = FLAG;
        if ($scope.EDIT_STEP_NO == 9 && EFFECTIVE_FLAG == undefined) {
            $scope.WagesForm.submitted = true;
            $scope.FLAG
            if ($scope.WagesForm.$valid) {
                if ($scope.WagesSearch.EFFECTIVE_DATE == undefined || $scope.WagesSearch.EFFECTIVE_DATE == null || $scope.WagesSearch.EFFECTIVE_DATE == '') {
                    $scope.WagesSearch.EFFECTIVE_DATE = moment($scope.CURRENT_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).format($scope.$parent.CONVERSION_DATE_FORMAT);
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
            $scope.WagesForm.submitted = true;
            if ($scope.WagesForm.$valid) {
                var wagesobj = new Object()

                wagesobj.EMPLOYEE_WAGES_ID = $scope.WagesSearch.EMPLOYEE_WAGES_ID;
                wagesobj.EMPLY_PRSNL_ID = $scope.WagesSearch.EMPLY_PRSNL_ID;
                wagesobj.ENTITY_ID = $cookies.get("ENTITY_ID");

                wagesobj.PAYTYPE_ID = $scope.EDIT_STEP_NO == 9 && !$scope.fieldChanges.PAYTYPE_ID ? null : $scope.WagesSearch.PAYTYPE_ID;
                wagesobj.PAYSCHEDULE_ID = $scope.EDIT_STEP_NO == 9 && !$scope.fieldChanges.PAYSCHEDULE_ID ? null : $scope.WagesSearch.PAYSCHEDULE_ID;
                wagesobj.NI_CATEGORY_ID = $scope.EDIT_STEP_NO == 9 && !$scope.fieldChanges.NI_CATEGORY_ID ? null : $scope.WagesSearch.NI_CATEGORY_ID;
                wagesobj.PENSIONS = $scope.EDIT_STEP_NO == 9 && !$scope.fieldChanges.PENSIONS ? null : $scope.WagesSearch.PENSIONS == undefined || $scope.WagesSearch.PENSIONS == "" || $scope.WagesSearch.PENSIONS == null ? 0 : $scope.WagesSearch.PENSIONS;
                wagesobj.EMPLOYER_NI_PRCNT = $scope.EDIT_STEP_NO == 9 && !$scope.fieldChanges.EMPLOYER_NI_PRCNT ? null : $scope.WagesSearch.EMPLOYER_NI_PRCNT == undefined || $scope.WagesSearch.EMPLOYER_NI_PRCNT == "" || $scope.WagesSearch.EMPLOYER_NI_PRCNT == null ? 0 : $scope.WagesSearch.EMPLOYER_NI_PRCNT;
                wagesobj.HOLIDAY_ACCRUEL_PRCNT = $scope.EDIT_STEP_NO == 9 && !$scope.fieldChanges.HOLIDAY_ACCRUEL_PRCNT ? null : $scope.WagesSearch.HOLIDAY_ACCRUEL_PRCNT == undefined || $scope.WagesSearch.HOLIDAY_ACCRUEL_PRCNT == "" || $scope.WagesSearch.HOLIDAY_ACCRUEL_PRCNT == null ? 0 : $scope.WagesSearch.HOLIDAY_ACCRUEL_PRCNT;
                wagesobj.PAY_TYPE = $scope.EDIT_STEP_NO == 9 && !$scope.fieldChanges.PAYTYPE_ID ? null : $scope.WagesSearch.PAYTYPE_ID;

                wagesobj.USER_ID = $scope.WagesSearch.USER_ID;
                wagesobj.HRM_EMPLOYEE_WAGES_POSITIONS_TYPE = [];
                wagesobj.HRM_EMPLOYEE_WAGES_ADDS_AND_DEDUCTS_TYPE = [];
                angular.forEach($scope.WAGE_POSITION_LIST, function (_loop_value, index) {

                    var fieldChanges = $scope.OrignalData.WAGE_POSITION_LIST[index];
                    if (fieldChanges != undefined && $scope.EDIT_STEP_NO == 9 && _loop_value.EMPLOYEE_WAGES_POSITIONS_ID == fieldChanges.EMPLOYEE_WAGES_POSITIONS_ID) {
                        fieldChanges.BOOL_POSITION_ID = _loop_value.POSITION_ID != fieldChanges.POSITION_ID;
                        fieldChanges.BOOL_HOURLY_RATE = _loop_value.HOURLY_RATE != fieldChanges.HOURLY_RATE;
                        fieldChanges.BOOL_TRONC_RATE = _loop_value.TRONC_RATE != fieldChanges.TRONC_RATE;
                        fieldChanges.BOOL_IS_PRIME = _loop_value.IS_PRIME != fieldChanges.IS_PRIME;
                    };
                    var _positionType = new Object()
                    _positionType.EMPLOYEE_WAGES_POSITIONS_ID = _loop_value.EMPLOYEE_WAGES_POSITIONS_ID == undefined ? 0 : _loop_value.EMPLOYEE_WAGES_POSITIONS_ID;
                    _positionType.POSITION_ID = fieldChanges != undefined && $scope.EDIT_STEP_NO == 9 && !fieldChanges.BOOL_POSITION_ID ? null : _loop_value.POSITION_ID;
                    _positionType.HOURLY_RATE = fieldChanges != undefined && $scope.EDIT_STEP_NO == 9 && !fieldChanges.BOOL_HOURLY_RATE ? null : _loop_value.HOURLY_RATE;
                    _positionType.TRONC_RATE = fieldChanges != undefined && $scope.EDIT_STEP_NO == 9 && !fieldChanges.BOOL_TRONC_RATE ? null : _loop_value.TRONC_RATE == undefined || _loop_value.TRONC_RATE == '' ? null : _loop_value.TRONC_RATE;
                    _positionType.IS_PRIME = fieldChanges != undefined && $scope.EDIT_STEP_NO == 9 && !fieldChanges.BOOL_IS_PRIME ? null : _loop_value.IS_PRIME ? 1 : 0;
                    if (_loop_value.IS_PRIME == 1) {
                        wagesobj.HOURLY_RATE = _loop_value.HOURLY_RATE;
                        //  wagesobj.PAY_TYPE = $scope.WagesSearch.PAYTYPE_ID;
                    }
                    wagesobj.HRM_EMPLOYEE_WAGES_POSITIONS_TYPE.push(_positionType);
                });
                angular.forEach($scope.ADDITIONS_DEDUCTIONS_LIST, function (_loop_value, index) {
                    var fieldChanges = $scope.OrignalData.ADDITIONS_DEDUCTIONS_LIST[index];
                    if (fieldChanges != undefined && $scope.EDIT_STEP_NO == 9 && _loop_value.WAGES_ADDS_AND_DEDUCTS_ID == fieldChanges.WAGES_ADDS_AND_DEDUCTS_ID) {
                        fieldChanges.BOOL_PAYCODE_ID = _loop_value.PAYCODE_ID != fieldChanges.PAYCODE_ID;
                        //fieldChanges.BOOL_EFFECTIVE_FROM = _loop_value.EFFECTIVE_FROM != fieldChanges.EFFECTIVE_FROM;
                        //fieldChanges.BOOL_EFFECTIVE_TILL = _loop_value.EFFECTIVE_TILL != fieldChanges.EFFECTIVE_TILL;
                        fieldChanges.BOOL_EFFECTIVE_FROM = moment(_loop_value.EFFECTIVE_FROM, $scope.$parent.CONVERSION_DATE_FORMAT).format('L') != moment(moment(fieldChanges.EFFECTIVE_FROM), $scope.$parent.CONVERSION_DATE_FORMAT).format('L');
                        fieldChanges.BOOL_EFFECTIVE_TILL = moment(_loop_value.EFFECTIVE_TILL, $scope.$parent.CONVERSION_DATE_FORMAT).format('L') != moment(moment(fieldChanges.EFFECTIVE_TILL), $scope.$parent.CONVERSION_DATE_FORMAT).format('L');
                    };
                    var _addDucType = new Object()
                    _addDucType.WAGES_ADDS_AND_DEDUCTS_ID = _loop_value.WAGES_ADDS_AND_DEDUCTS_ID == undefined ? 0 : _loop_value.WAGES_ADDS_AND_DEDUCTS_ID;
                    _addDucType.PAYCODE_ID = fieldChanges != undefined && $scope.EDIT_STEP_NO == 9 && !fieldChanges.BOOL_PAYCODE_ID ? null : _loop_value.PAYCODE_ID;
                    _addDucType.EFFECTIVE_FROM = fieldChanges != undefined && $scope.EDIT_STEP_NO == 9 && !fieldChanges.BOOL_EFFECTIVE_FROM ? null : moment(_loop_value.EFFECTIVE_FROM, $scope.$parent.CONVERSION_DATE_FORMAT).format('L');
                    _addDucType.EFFECTIVE_TILL = fieldChanges != undefined && $scope.EDIT_STEP_NO == 9 && !fieldChanges.BOOL_EFFECTIVE_TILL ? null : moment(_loop_value.EFFECTIVE_TILL, $scope.$parent.CONVERSION_DATE_FORMAT).format('L');
                    _addDucType.DELETE_FLAG =  0;
                    wagesobj.HRM_EMPLOYEE_WAGES_ADDS_AND_DEDUCTS_TYPE.push(_addDucType);
                });
                angular.forEach($scope.ADDITIONS_DEDUCTIONS_DELETED_LIST, function (_loop_value) {
                    var _addDucType = new Object()
                    _addDucType.WAGES_ADDS_AND_DEDUCTS_ID = _loop_value.WAGES_ADDS_AND_DEDUCTS_ID;
                    _addDucType.PAYCODE_ID = null;
                    _addDucType.EFFECTIVE_FROM = null;
                    _addDucType.EFFECTIVE_TILL = null;
                    _addDucType.DELETE_FLAG = 1;
                    wagesobj.HRM_EMPLOYEE_WAGES_ADDS_AND_DEDUCTS_TYPE.push(_addDucType);
                });
                if (wagesobj.HRM_EMPLOYEE_WAGES_ADDS_AND_DEDUCTS_TYPE.length == 0) {
                    var _addDucType = new Object()
                    _addDucType.WAGES_ADDS_AND_DEDUCTS_ID = null;
                    _addDucType.PAYCODE_ID = null;
                    _addDucType.EFFECTIVE_FROM = null;
                    _addDucType.EFFECTIVE_TILL = null;
                    _addDucType.DELETE_FLAG = null;
                    wagesobj.HRM_EMPLOYEE_WAGES_ADDS_AND_DEDUCTS_TYPE.push(_addDucType);
                }
                wagesobj.COMMENTS = $scope.WagesSearch.EFFECTIVE_COMMENTS;
                wagesobj.EFFECTIVE_DATE = $scope.WagesSearch.EFFECTIVE_DATE == "" || $scope.WagesSearch.EFFECTIVE_DATE == undefined ? null : moment($scope.WagesSearch.EFFECTIVE_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).format('L');
                wagesobj.PAID_BANK_HOLIDAY = $scope.EDIT_STEP_NO == 9 && !$scope.fieldChanges.PAID_BANK_HOLIDAY ? null : $scope.WagesSearch.PAID_BANK_HOLIDAY ? 1 : 0;
                wagesobj.ORDINAL = $scope.EDIT_STEP_NO == 9 && !$scope.fieldChanges.ORDINAL ? null : $scope.WagesSearch.ORDINAL;
                if ($scope.POP_EMPLOYEE_HISTORY_HEADERS_LIST != undefined && $scope.POP_EMPLOYEE_HISTORY_HEADERS_LIST.length > 0) {
                    wagesobj.TABLE_ID_LIST = [];
                    angular.forEach($scope.POP_EMPLOYEE_HISTORY_HEADERS_LIST, function (_History_value) {
                        var readOnly = new Object();
                        readOnly.TABLE_ID = _History_value.HISTORY_HEADER_ID;
                        wagesobj.TABLE_ID_LIST.push(readOnly);
                    });
                    PrcCommMethods.HUMANRESOURCE_API(wagesobj, 'HRM_EMPLOYEE_UPD_BACKDATED_CHANGE').then(function (data) { });
                }

                PrcCommMethods.HUMANRESOURCE_API(wagesobj, 'HRM_INS_UPD_EMPLOYEE_WAGES').then(function (data) {
                    if (data.data > 0) {
                        if ($scope.WagesSearch.EMPLOYEE_WAGES_ID > 0) {
                            $scope.$parent.ShowAlertBox("Success", 'Wages updated successfully', 3000);
                        }
                        else {
                            $scope.$parent.ShowAlertBox("Success", 'Wages created successfully', 3000);
                        }
                        if (FLAG == 1) {
                            $scope.TAB_CLICK_HR_HEADER_Fn(0);
                        }
                        else {
                            $scope.TAB_CLICK_HR_HEADER_Fn(4, getUrlParameter('EMP_ID', $location.absUrl()));
                        }
                    }
                    else if (data.data == -3) {
                        if ($scope.WagesSearch.EMPLOYEE_WAGES_ID > 0) {
                            $scope.$parent.ShowAlertBox("Warning", 'Wages updated successfully. Hourly rate is less than NMW.', 3000);
                        }
                        else {
                            $scope.$parent.ShowAlertBox("Warning", 'Wages created successfully. Hourly rate is less than NMW.', 3000);
                        }
                        $('#EffectiveDate').modal('hide');
                        if (FLAG == 1) {
                            $scope.TAB_CLICK_HR_HEADER_Fn(0);
                        }
                        else {
                            $scope.TAB_CLICK_HR_HEADER_Fn(4, getUrlParameter('EMP_ID', $location.absUrl()));
                        }
                    }
                    if (data.data == 0) {
                        $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                    }
                });
            } else {
                $scope.$parent.ShowAlertBox("Attention", $scope.$parent.MANDATORY_MSG, 3000);
            }
        }
    }

    $scope.ADDITION_TYPE = [{ TYPE_ID: 1, TYPE_NAME: 'Addition' }, { TYPE_ID: -1, TYPE_NAME: 'Deduction' }];
    $scope.nginit_additiondeduction = function (_additionDeduction, last) {
        if (_additionDeduction.WAGES_ADDS_AND_DEDUCTS_ID > 0) {
            _additionDeduction.TYPE_NAME = _additionDeduction.TYPE_ID == 1 || _additionDeduction.TYPE_ID == -1 ? $scope.ADDITION_TYPE.filter(function (_param_type) { return _additionDeduction.TYPE_ID == _param_type.TYPE_ID })[0].TYPE_NAME : null;

            //_additionDeduction.EFFECTIVE_FROM = $filter('date')(new Date(_additionDeduction.EFFECTIVE_FROM));
            //_additionDeduction.EFFECTIVE_TILL = $filter('date')(new Date(_additionDeduction.EFFECTIVE_TILL));

            _additionDeduction.EFFECTIVE_FROM = moment(_additionDeduction.EFFECTIVE_FROM).format($scope.$parent.CONVERSION_DATE_FORMAT);
            _additionDeduction.EFFECTIVE_TILL = moment(_additionDeduction.EFFECTIVE_TILL).format($scope.$parent.CONVERSION_DATE_FORMAT);
        }
        if (last) {
            $scope.$parent.$parent.DATE_INPUT_LOAD();
        }
    }
    $scope.ADD_PAY_CODE = function () {
        $scope.PayCodeForm.submitted = true;
        if ($scope.PayCodeForm.$valid) {
            let Addittiondeduction = {
                'CODE': $scope.PayCodeSearch.CUSTOM_POP_PAY_CODE,
                'PAYCODE_ID': $scope.PayCodeSearch.POP_PAYCODE_ID,
                'TITLE': $scope.PayCodeSearch.TITLE,
                'DEFAULT_VALUES': $scope.PayCodeSearch.DEFAULT_VALUES,
                'RECURRING': $scope.PayCodeSearch.RECURRING,
                'NI': $scope.PayCodeSearch.NI,
                'TAX': $scope.PayCodeSearch.TAX,
                'PENSION': $scope.PayCodeSearch.PENSION,
                'CALCULATION_NAME': $scope.PayCodeSearch.CUSTOM_CALCULATION_NAME,
                'CALCULATION_ID': $scope.PayCodeSearch.CALCULATION_ID,
                'TYPE_NAME': $scope.PayCodeSearch.CUSTOM_TYPE_NAME,
                'TYPE_ID': $scope.PayCodeSearch.TYPE_ID
            };
            $scope.ADDITIONS_DEDUCTIONS_LIST.push(angular.copy(Addittiondeduction));
            $('#Addition_Deduction').modal('hide');
            $scope.$parent.$parent.DATE_INPUT_LOAD();
        }
    }

    $scope.VIEW_PAY_SCHEDULES_Fn = function () {
        if ($scope.WagesSearch.PAYSCHEDULE_ID !== '') {
            $scope.HRM_GET_PAYSCHEDULE_BY_ID();
        }
        else {
            alert('Please select valid pay schedule');
        }
    }
    $scope.RATE_LABEL = 'Monthly Salary';
    $scope.SELECTED_PAY_TYPE_Fn = function (_param_paytype, _click_flag) {
        if (_param_paytype == '') {
            $scope.WagesSearch.CUSTOM_PAY_TYPE = $scope.WagesSearch.DD_DEFAULT_TEXT;
            $scope.WagesSearch.PAYTYPE_ID = ''
            $scope.RATE_LABEL = 'Rate Type';

        }
        else {
            $scope.WagesSearch.CUSTOM_PAY_TYPE = _param_paytype.PAY_TYPE;
            $scope.WagesSearch.PAYTYPE_ID = _param_paytype.PAYTYPE_ID;
            switch (_param_paytype.PAYTYPE_ID) {
                case 1:
                    $scope.RATE_LABEL = 'Annual Salary';
                    break;
                case 2:
                    $scope.RATE_LABEL = 'Hourly Rate';
                    break;
                case 3:
                    $scope.RATE_LABEL = "Shift Rate";
                    break;
                case 4:
                    $scope.RATE_LABEL = "Daily Rate";
                    break;

            }
        }
        angular.forEach($scope.WAGE_POSITION_LIST, function (_loop_position_dtls) {
            $scope.CALCULATE_MONTHLY_RATE_Fn(_loop_position_dtls);
        });

        if (_click_flag == 1) {
            $scope.WATCH_GROUP_Fn("PAYTYPE_ID");
        }
    }


    $scope.CALCULATE_MONTHLY_RATE_Fn = function (_position, _nginitflag) {
        if ($scope.EDIT_STEP_NO == 9) {
            _position.SHOW_WAGE = $scope.CheckEmployeeAccess(parseInt($cookies.get("ENTITY_ID")), $scope.HeaderPrimaryDetails.BRANCH_ID, "SHOW_WAGE");
            _position.INPUT_TYPE = _position.SHOW_WAGE ? 'text' : 'password';
        }
        else {
            _position.SHOW_WAGE = true;
            _position.INPUT_TYPE = 'text';
        }
        if ($scope.WagesSearch.PAYTYPE_ID == 1) {
            if ($scope.WagesSearch.PAYSCHEDULE_ID != null && $scope.WagesSearch.PAYSCHEDULE_ID != '' && $scope.WagesSearch.PAYSCHEDULE_ID != undefined) {
                var Freq_Id = 0;
                if ($scope.PAYSCHEDULE_DROPDOWN_LIST.length > 0) {
                    angular.forEach($scope.PAYSCHEDULE_DROPDOWN_LIST, function (_param) {
                        if (_param.PAYSCHEDULE_ID == $scope.WagesSearch.PAYSCHEDULE_ID) {
                            Freq_Id = _param.FREQUENCY;
                        }
                    })
                }

                $scope.RATE_LABEL = 'Annual Salary';
                var Rsultcal = 0.00;
                if (Freq_Id == 1) {
                    if (isNaN(parseFloat(parseFloat(_position.HOURLY_RATE) / 52).toFixed(2))) {
                    }
                    else {
                        Rsultcal = parseFloat(parseFloat(_position.HOURLY_RATE) / 52).toFixed(2);
                    }
                    _position.MONTH_CAL = "Weekly: " + Rsultcal;
                } else if (Freq_Id == 2) {
                    if (isNaN(parseFloat(parseFloat(_position.HOURLY_RATE) / 12).toFixed(2))) {
                    }
                    else {
                        Rsultcal = parseFloat(parseFloat(_position.HOURLY_RATE) / 12).toFixed(2);
                    }
                    _position.MONTH_CAL = "Monthly: " + Rsultcal;
                } else if (Freq_Id == 3) {
                    if (isNaN(parseFloat(parseFloat(_position.HOURLY_RATE) / 26).toFixed(2))) {
                    }
                    else {
                        Rsultcal = parseFloat(parseFloat(_position.HOURLY_RATE) / 26).toFixed(2);
                    }
                    _position.MONTH_CAL = "Fortnightly: " + Rsultcal;
                }

            }
        } else {
            _position.MONTH_CAL = "";
        }
        if (_nginitflag == 0 && ($scope.WagesSearch.EMPLOYEE_WAGES_ID == undefined || $scope.WagesSearch.EMPLOYEE_WAGES_ID == '' || $scope.WagesSearch.EMPLOYEE_WAGES_ID == null || $scope.WagesSearch.EMPLOYEE_WAGES_ID == 0)) {
            _position.IS_PRIME = true;
        }
        _position.INPUT_TYPE == 'password' ? _position.MONTH_CAL = '' : _position.MONTH_CAL;
    }
    $scope.SELECTED_PAY_SCHEDULE_Fn = function (_param_paysch, _click_flag) {
        if (_param_paysch == '') {
            $scope.WagesSearch.CUSTOM_PAY_SCHEDULE = $scope.WagesSearch.DD_DEFAULT_TEXT;
            $scope.WagesSearch.PAYSCHEDULE_ID = ''
        }
        else {
            $scope.WagesSearch.CUSTOM_PAY_SCHEDULE = _param_paysch.PAYSCHEDULE_NAME;
            $scope.WagesSearch.PAYSCHEDULE_ID = _param_paysch.PAYSCHEDULE_ID;
        }
        angular.forEach($scope.WAGE_POSITION_LIST, function (_param) {
            if ($scope.WagesSearch.PAYTYPE_ID == 1) {
                if ($scope.WagesSearch.PAYSCHEDULE_ID != null && $scope.WagesSearch.PAYSCHEDULE_ID != '' && $scope.WagesSearch.PAYSCHEDULE_ID != undefined) {
                    //var Freq_Id = _param_paysch.FREQUENCY;
                    $scope.RATE_LABEL = 'Annual Salary';
                    if (_param.HOURLY_RATE != null && _param.HOURLY_RATE != '' && _param.HOURLY_RATE != undefined) {
                        if (_param_paysch.FREQUENCY == 1) {
                            _param.MONTH_CAL = "Weekly: " + parseFloat(parseFloat(_param.HOURLY_RATE) / 52).toFixed(2);
                        } else if (_param_paysch.FREQUENCY == 2) {
                            _param.MONTH_CAL = "Monthly: " + parseFloat(parseFloat(_param.HOURLY_RATE) / 12).toFixed(2);
                        } else if (_param_paysch.FREQUENCY == 3) {
                            _param.MONTH_CAL = "Fortnightly: " + parseFloat(parseFloat(_param.HOURLY_RATE) / 26).toFixed(2);
                        }
                    }

                    // })                
                }
            } else {
                _param.MONTH_CAL = "";
            }
        })
        if (_click_flag == 1) {
            $scope.WATCH_GROUP_Fn("PAYSCHEDULE_ID");
        }
    }

    $scope.SELECTED_CODE_Fn = function (_param_code, _click_flag) {
        if (_param_code == '') {
            $scope.WagesSearch.CUSTOM_PAY_CODE = $scope.WagesSearch.DD_DEFAULT_TEXT;
            $scope.WagesSearch.PAYCODE_ID = ''
        }
        else {
            $scope.WagesSearch.CUSTOM_PAY_CODE = _param_code.CODE;
            $scope.WagesSearch.PAYCODE_ID = _param_code.PAYCODE_ID;
        }


    }
    $scope.SELECTED_POP_CODE_Fn = function (_param_code) {
        if (_param_code == '') {
            $scope.PayCodeSearch.CUSTOM_POP_PAY_CODE = $scope.WagesSearch.DD_DEFAULT_TEXT;
            $scope.PayCodeSearch.POP_PAYCODE_ID = ''
            $scope.RESET_POP_Fn(1);

        }
        else {
            $scope.PayCodeSearch.CUSTOM_POP_PAY_CODE = _param_code.CODE;
            $scope.PayCodeSearch.POP_PAYCODE_ID = _param_code.PAYCODE_ID;
            $scope.PayCodeSearch.TITLE = _param_code.TITLE;
            $scope.PayCodeSearch.DEFAULT_VALUES = _param_code.DEFAULT_VALUES;
            $scope.PayCodeSearch.RECURRING = _param_code.RECURRING;
            $scope.PayCodeSearch.NI = _param_code.NI;
            $scope.PayCodeSearch.TAX = _param_code.TAX;
            $scope.PayCodeSearch.PENSION = _param_code.PENSION;
            $scope.PayCodeSearch.CUSTOM_CALCULATION_NAME = _param_code.CALCULATION_NAME;
            $scope.PayCodeSearch.CALCULATION_ID = _param_code.CALCULATION_ID;
            $scope.PayCodeSearch.CUSTOM_TYPE_NAME = _param_code.TYPE_NAME;
            $scope.PayCodeSearch.TYPE_ID = _param_code.TYPE_ID;
        }
    }

    $scope.SELECTED_NI_CATEGORY_Fn = function (_param_ni_cat, _click_flag) {
        if (_param_ni_cat == '') {
            $scope.WagesSearch.CUSTOM_NI_CATEGORY = $scope.PayCodeSearch.DD_DEFAULT_TEXT;
            $scope.WagesSearch.NI_CATEGORY_ID = '';
        }
        else {
            $scope.WagesSearch.CUSTOM_NI_CATEGORY = _param_ni_cat.NI_LETTER + "-" + _param_ni_cat.NI_TEXT;
            $scope.WagesSearch.NI_CATEGORY_ID = _param_ni_cat.NI_CATEGORY_ID;
        }
        if (_click_flag == 1) {
            $scope.WATCH_GROUP_Fn("NI_CATEGORY_ID");
        }
    }

    $scope.SELECTED_TYPE_Fn = function (_param_payroll, _click_flag) {
        if (_param_payroll == '') {
            $scope.PayCodeSearch.CUSTOM_TYPE_NAME = $scope.PayCodeSearch.DD_DEFAULT_TEXT;
            $scope.PayCodeSearch.TYPE_ID = '';
        }
        else {
            $scope.PayCodeSearch.CUSTOM_TYPE_NAME = _param_payroll.TYPE_NAME;
            $scope.PayCodeSearch.TYPE_ID = _param_payroll.TYPE_ID;
        }
        if (_click_flag == 1) {
            $scope.WATCH_GROUP_Fn("TYPE_ID");
        }
    }
    $scope.SELECTED_CALCULATION_Fn = function (_param_calculation, _click_flag) {
        if (_param_calculation == '') {
            $scope.PayCodeSearch.CUSTOM_CALCULATION_NAME = $scope.WagesSearch.DD_DEFAULT_TEXT;
            $scope.PayCodeSearch.CALCULATION_ID = '';
        }
        else {
            $scope.PayCodeSearch.CUSTOM_CALCULATION_NAME = _param_calculation.CALCULATION_NAME;
            $scope.PayCodeSearch.CALCULATION_ID = _param_calculation.CALCULATION_ID;
        }
        if (_click_flag == 1) {
            $scope.WATCH_GROUP_Fn("CALCULATION_ID");
        }
    }


    $scope.DELETE_PAY_CODE = function (paycode, _paycodeIndex) {
        if (paycode.WAGES_ADDS_AND_DEDUCTS_ID > 0) {
            $scope.ADDITIONS_DEDUCTIONS_DELETED_LIST.push(angular.copy(paycode));
            $scope.ADDITIONS_DEDUCTIONS_LIST.splice(_paycodeIndex, 1);
        }
        else {
            $scope.ADDITIONS_DEDUCTIONS_LIST.splice(_paycodeIndex, 1);
        }
    }
    $scope.RESET_POP_Fn = function (FLAG) {
        if (FLAG == undefined) {
            $scope.SELECTED_POP_CODE_Fn('');
        }
        $scope.SELECTED_TYPE_Fn('');
        $scope.SELECTED_CALCULATION_Fn('');
        $scope.PayCodeSearch.POP_PAYCODE_ID = "";
        $scope.PayCodeSearch.TITLE = "";
        $scope.PayCodeSearch.DEFAULT_VALUES = "";
        $scope.PayCodeSearch.RECURRING = false;
        $scope.PayCodeSearch.NI = false;
        $scope.PayCodeSearch.TAX = false;
        $scope.PayCodeSearch.PENSION = false;
        $scope.PayCodeSearch.CALCULATION_ID = "";
        $scope.PayCodeSearch.TYPE_ID = "";
        $scope.PayCodeForm.submitted = false;

    }
    $scope.POP_ADDITIONS_DEDUCTIONS_VIEW_Fn = function () {
        $scope.RESET_POP_Fn();
        $('#Addition_Deduction').modal('show');
    }

    $scope.VALIDATE_EFFECTIVE_DATE = function (_deduction) {
        if (_deduction.EFFECTIVE_FROM != null && _deduction.EFFECTIVE_FROM != "" && _deduction.EFFECTIVE_FROM != undefined && _deduction.EFFECTIVE_TILL != null && _deduction.EFFECTIVE_TILL != "" && _deduction.EFFECTIVE_TILL != undefined) {
            //if (new Date(_deduction.EFFECTIVE_FROM) > new Date(_deduction.EFFECTIVE_TILL)) {
            //    _deduction.EFFECTIVE_TILL = null;
            //    $scope.$parent.ShowAlertBox("Warning", "Effective till date should not be less than effective from date!")
            //}
            if (moment(_deduction.EFFECTIVE_FROM, $scope.$parent.CONVERSION_DATE_FORMAT).toDate() > moment(_deduction.EFFECTIVE_TILL, $scope.$parent.CONVERSION_DATE_FORMAT).toDate()) {
                _deduction.EFFECTIVE_TILL = null;
                $scope.$parent.ShowAlertBox("Warning", "Effective till date should not be less than effective from date!")
            }
        }
    }

    $scope.SELECTED_PAY_SCHEDULE_Fn('');
    $scope.SELECTED_PAY_TYPE_Fn('');
    $scope.SELECTED_CODE_Fn('');
    $scope.SELECTED_NI_CATEGORY_Fn('');
    ////////////////////////////History upcoming update//////////
    $scope.EFFECTIVE_TAB_Fn = function (FLAG) {
        $scope.EFFECTIVE_TAB = FLAG;
    };
    $scope.EFFECTIVE_TAB_Fn(1);
    $scope.LAZY_LOAD_HRM_GET_EMPLOYEE_HISTORY_HEADERS = function () {
        $scope.HRM_GET_EMPLOYEE_HISTORY_HEADERS();
    }
    $scope.HRM_GET_EMPLOYEE_HISTORY_HEADERS = function (FLAG) {
        if (FLAG == 1) {
            $scope.WagesSearch.PAGE_NO = 1;
            $scope.EMPLOYEE_HISTORY_HEADERS_LIST = [];
        }

        var EfftInfoObject = new Object();
        EfftInfoObject.EMPLY_PRSNL_ID = getUrlParameter('EMP_ID', $location.absUrl());
        EfftInfoObject.PAGE_NO = $scope.WagesSearch.PAGE_NO;
        EfftInfoObject.PAGE_SIZE = $scope.WagesSearch.PAGE_SIZE;
        EfftInfoObject.STEP_NO = $scope.WagesSearch.STEP_NO;
        PrcCommMethods.HUMANRESOURCE_API(EfftInfoObject, 'HRM_GET_EMPLOYEE_HISTORY_HEADERS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.EMPLOYEE_HISTORY_HEADERS_LIST = $scope.EMPLOYEE_HISTORY_HEADERS_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.WagesSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.WagesSearch.PAGE_NO = parseInt($scope.WagesSearch.PAGE_NO) + 1;
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
        EfftInfoObject.STEP_NO = $scope.WagesSearch.STEP_NO;;
        PrcCommMethods.HUMANRESOURCE_API(EfftInfoObject, 'HRM_EMPLOYEE_GET_UPCOMING_UPDATES').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.EMPLOYEE_GET_UPCOMING_UPDATES_LIST = data.data.Table;
            }
            else {
                $scope.EMPLOYEE_GET_UPCOMING_UPDATES_LIST = [];
                $scope.LOAD_FETCH_TEXT = 'No records yet!';
            }
        });
    };
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
        EfftInfoObject.STEP_NO = $scope.WagesSearch.STEP_NO;;
        PrcCommMethods.HUMANRESOURCE_API(EfftInfoObject, 'HRM_EMPLOYEE_GET_UPCOMING_UPDATE_DETAILS').then(function (data) {
            if (data.data.Table.length > 0) {
                _tabledtls.UPCOMING_DETAILS = data.data.Table;

                $scope.OLD_DATA = angular.copy($scope.WagesSearch);// In upcoming case ;
                $scope.OLD_DATA.WAGE_POSITION_LIST = $scope.WAGE_POSITION_LIST;
                $scope.OLD_DATA.ADDITIONS_DEDUCTIONS_LIST = $scope.ADDITIONS_DEDUCTIONS_LIST;

                $scope.NEW_DATA = data.data.Table[0];
                $scope.NEW_DATA.CUSTOM_NI_CATEGORY = data.data.Table[0].NI_LETTER + "-" + data.data.Table[0].NI_TEXT;
                $scope.NEW_DATA.WAGE_POSITION_LIST = data.data.Table1;
                $scope.NEW_DATA.ADDITIONS_DEDUCTIONS_LIST = data.data.Table2;

                $scope.SELECTED_UPDATE = _tabledtls;
                $('#History_pop').modal('show');
            }
            else {
                _tabledtls.UPCOMING_DETAILS = [];
            }
        });
    };

    $scope.HRM_GET_EMPLOYEE_HISTORY_DETAILS = function (_history) {
        $scope.IS_HISTORY = true;
        $scope.SELECTED_UPDATE = _history;
        var EmploymentInfoObject = new Object();
        EmploymentInfoObject.HISTORY_HEADER_ID = _history.HISTORY_HEADER_ID
        EmploymentInfoObject.STEP_NO = $scope.STEP_FLAG;
        EmploymentInfoObject.EMPLY_PRSNL_ID = getUrlParameter('EMP_ID', $location.absUrl());;
        PrcCommMethods.HUMANRESOURCE_API(EmploymentInfoObject, 'HRM_GET_EMPLOYEE_HISTORY_DETAILS').then(function (data) {
            if (data.data.Table.length > 0) {
                //NI_CATEGORY_ID
                $scope.OLD_DATA = angular.copy(data.data.Table[0]);
                $scope.OLD_DATA.CUSTOM_PAY_TYPE = $scope.OLD_DATA.PAY_TYPE;
                $scope.OLD_DATA.CUSTOM_PAY_SCHEDULE = $scope.OLD_DATA.PAYSCHEDULE_NAME;
                $scope.OLD_DATA.CUSTOM_NI_CATEGORY = data.data.Table[0].NI_LETTER != null ? data.data.Table[0].NI_LETTER + "-" + data.data.Table[0].NI_TEXT : '';
                $scope.OLD_DATA.WAGE_POSITION_LIST = data.data.Table1;
                $scope.OLD_DATA.ADDITIONS_DEDUCTIONS_LIST = data.data.Table2;

                $scope.NEW_DATA = data.data.Table3[0];
                //$scope.NEW_DATA.CUSTOM_NI_CATEGORY = data.data.Table[0].NI_LETTER != null ? data.data.Table[0].NI_LETTER + "-" + data.data.Table[0].NI_TEXT : '';


                $scope.NEW_DATA.WAGE_POSITION_LIST = data.data.Table4;
                $scope.NEW_DATA.ADDITIONS_DEDUCTIONS_LIST = data.data.Table5;
            }
            $('#History_pop').modal('show');
        });
    }

    $scope.HISTORY_CALCULATE_MONTHLY_RATE_Fn = function (_position, index) {
        _position.NEW_DATA = $scope.NEW_DATA.WAGE_POSITION_LIST[index];
    }

    $scope.nginitHistoryadditiondeduction = function (_additionDeduction, index) {
        _additionDeduction.NEW_DATA = $scope.NEW_DATA.ADDITIONS_DEDUCTIONS_LIST[index];
    }
    $scope.HRM_DISCARD_PENDING_UPDATES = function () {
        var EfftInfoObject = new Object();
        EfftInfoObject.UPDATE_TABLE_ID = $scope.SELECTED_UPDATE.UPDATE_TABLE_ID;
        EfftInfoObject.STEP_NO = $scope.WagesSearch.STEP_NO;;
        EfftInfoObject.DISCARD_COMMENTS = $scope.DISCARD_COMMENTS;
        PrcCommMethods.HUMANRESOURCE_API(EfftInfoObject, 'HRM_DISCARD_PENDING_UPDATES').then(function (data) {
            if (data.data == 1) {
                $scope.$parent.ShowAlertBox("Success", "Record discarded successfully", 3000);
                $('#Discard_pop').modal('hide');
                $scope.HRM_EMPLOYEE_GET_UPCOMING_UPDATES();
                $scope.HRM_GET_EMPLOYEE_HISTORY_HEADERS(1);
            }
            if (data.data == 0) {
                $scope.$parent.ShowAlertBox("Error", $scope.SOMETHINGWENTWRONG, 3000);
            }
        });
    };
    $scope.HRM_PROCESS_PENDING_UPDATES = function () {
        var EfftInfoObject = new Object();
        EfftInfoObject.UPDATE_TABLE_ID = $scope.SELECTED_UPDATE.UPDATE_TABLE_ID;
        EfftInfoObject.STEP_NO = $scope.WagesSearch.STEP_NO;;
        EfftInfoObject.DISCARD_COMMENTS = $scope.DISCARD_COMMENTS;
        PrcCommMethods.HUMANRESOURCE_API(EfftInfoObject, 'HRM_PROCESS_PENDING_UPDATES').then(function (data) {
            if (data.data == 1) {
                $scope.$parent.ShowAlertBox("Success", "Record processed successfully", 3000);
                $('#Process_pop').modal('hide');

                $scope.HRM_EMPLOYEE_GET_UPCOMING_UPDATES();
                $scope.HRM_GET_EMPLOYEE_HISTORY_HEADERS(1);
                $scope.HRM_GET_EMPLOYEE_WAGES();

            }
            if (data.data == 0) {
                $scope.$parent.ShowAlertBox("Error", $scope.SOMETHINGWENTWRONG, 3000);
            }
        });
    }

    if ($scope.EDIT_STEP_NO == 9) {
        $scope.HRM_EMPLOYEE_GET_UPCOMING_UPDATES();
        $scope.HRM_GET_EMPLOYEE_HISTORY_HEADERS(1);
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
        })
    };
    $scope.GET_UTC_TIME();
    $scope.$parent.$parent.DATE_INPUT_LOAD();
});