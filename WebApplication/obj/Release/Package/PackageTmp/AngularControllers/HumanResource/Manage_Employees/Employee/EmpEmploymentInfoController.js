app.controller('EmpEmploymentInfoController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(2);
    $scope.$parent.$parent.overlay_loading_HR_Loader = 'none';
    $scope.STEP_FLAG = 2;
    $scope.PAGE_LOAD_FLAG = 0;
    $scope.DD_DEFAULT_TEXT = $scope.$parent.DD_DEFAULT_TEXT;
    $(".modal-backdrop").remove();
    $scope.EDIT_STEP_NO = getUrlParameter('STEP_NO', $location.absUrl());
    $scope.EDIT_STEP_NO = $scope.EDIT_STEP_NO == undefined ? 0 : $scope.EDIT_STEP_NO;
    // $scope.EDIT_MODE = $scope.EDIT_STEP_NO < 9 ? false : true;
    $scope.MY_PROFILE_FLAG = 0;
    $scope.EmploymentInfo = {
        EMPLY_PRSNL_ID: getUrlParameter('EMP_ID', $location.absUrl()),
        CUSTOMER_ID: $cookies.get("CUSTOMER_ID"),
        MODULE_ID: parseInt($cookies.get("MODULE_ID")),
        USER_ID: $cookies.get("USERID"),
        ENTITY_ID: null,// $cookies.get("ENTITY_ID"),
        COUNTRY_ID: null,
        PAGE_NO: 1,
        PAGE_SIZE: $scope.$parent.PAGE_SIZE,
        REPORTING_MANAGER_NAME: "",
        EDIT_FLAG: false,
        EMPLYMNT_INFO_ID: 0,
        HIRING_DATE: null,
        TERMINATION_DATE: null,
        ADDITIONAL_CONTACT_EMAIL: '',
        STARTER_DECLARATION_ID: null,
        PRIMARY_REPORTING_MANAGER_ID: '',
        SECONDARY_REPORTING_MANAGER_ID: '',
        RTW_STATUS: false,
        TEAMHUB_PIN: '',
        INCLUDE_IN_SCHEDULE: null,
        LACTATION_BREAK_START_DATE: null,
        LACTATION_BREAK_END_DATE: null,
        NI_NUMBER: '',
        PENSIONS: '',
        CLOCKIN_CLOCKOUT_PIN: '',
        WORK_PATTERN_ID: '',
        WORK_PATTERN_TYPE_ID: 0,
        MON: 0,
        TUE: 0,
        WED: 0,
        THU: 0,
        FRI: 0,
        SAT: 0,
        SUN: 0,
        TOTAL: 0,
        SET_PROBATION_END_DATE: '',
        SOURCE: '',
        ADD_NOTES_FOR_THIS_EMPLOYEE: '',
        COMMENTS: '',
        EFFECTIVE_DATE: null,
        WORK_PATTERN_DEFAULT_TEXT: $scope.DD_DEFAULT_TEXT,
        CUSTOM_WORK_PATTERN_TITLE: $scope.DD_DEFAULT_TEXT,
        PRI_REPORTING_MANAGER_DEFAULT_TEXT: $scope.DD_DEFAULT_TEXT,
        CUSTOM_PRIMARY_REPORTING_MANAGER: $scope.DD_DEFAULT_TEXT,
        SEC_REPORTING_MANAGER_DEFAULT_TEXT: $scope.DD_DEFAULT_TEXT,
        CUSTOM_SECONDARY_REPORTING_MANAGER: $scope.DD_DEFAULT_TEXT,
        CUSTOM_TERTIARY_REPORTING_MANAGER: $scope.DD_DEFAULT_TEXT,
        TERTIARY_REPORTING_MANAGER_DEFAULT_TEXT: $scope.DD_DEFAULT_TEXT,
        CUSTOM_EMPLOYEE_TYPE: $scope.DD_DEFAULT_TEXT,
        CUSTOME_WORK_PATTERN_ID: 0,
        SiteArray: [],
        ADDITIONAL_CONTACT_EMAIL: '',
        CUSTOM_INCLUDE_IN_SCHEDULE_TEXT: $scope.DD_DEFAULT_TEXT,
        CUSTOM_DECLARATION_NAME: $scope.DD_DEFAULT_TEXT,
        PROBATION_MONTH: 0,
        IS_VALIDATED: true,
        REPORTER_CHECK: false
    };
    $scope.fieldChanges = {};
    $scope.WATCH_GROUP_Fn = function (field, DATE_FALG) {
        if (DATE_FALG == 1) {
            $scope.fieldChanges[field] = $scope.EmploymentInfo[field] !== $scope.OrignalData[field];
        }
        else {
            $scope.fieldChanges[field] = $scope.EmploymentInfo[field] !== $scope.OrignalData[field];
        }
    };

    $scope.WATCH_GRID_GROUP_Fn = function (item, field, index) {
        item[field] = item[field] !== $scope.OrignalData.SiteArray[index][field];
    };
    if (parseInt(getUrlParameter('EMP_ID', $location.absUrl())) == parseInt($cookies.get("EMPLY_PRSNL_ID"))) {
        $scope.EDIT_MODE = true;
        $scope.MY_PROFILE_FLAG = 1;
    };
    $scope.HRM_GET_EMPLOYEE_STEP = function () {
        var UserModelObj = new Object();
        UserModelObj.EMPLY_PRSNL_ID = getUrlParameter('EMP_ID', $location.absUrl());
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'HRM_GET_EMPLOYEE_STEP').then(function (data) {
            if (data.data.Table.length > 0) {
                let RESULT_PERSNL = data.data.Table[0];
                $scope.HeaderPrimaryDetails.FIRST_NAME = RESULT_PERSNL.FIRST_NAME;
                $scope.HeaderPrimaryDetails.MIDDLE_NAME = RESULT_PERSNL.MIDDLE_NAME;
                $scope.HeaderPrimaryDetails.LAST_NAME = RESULT_PERSNL.LAST_NAME;
                $scope.HeaderPrimaryDetails.STANDARD_ROLE_ID = RESULT_PERSNL.STANDARD_ROLE_ID;
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
                    $scope.STEP_NO = RESULT_PERSNL.STEP_NO;
                    if (RESULT_PERSNL.STEP_NO == 9) {
                        $scope.EDIT_STEP_NO = RESULT_PERSNL.STEP_NO == undefined ? 0 : RESULT_PERSNL.STEP_NO;
                    } else {
                        $scope.EDIT_STEP_NO = RESULT_PERSNL.STEP_NO;
                    }
                    $scope.EDIT_MODE = $scope.EDIT_STEP_NO < 9 ? false : true;
                    if (parseInt(getUrlParameter('EMP_ID', $location.absUrl())) == parseInt($cookies.get("EMPLY_PRSNL_ID"))) {
                        $scope.EDIT_MODE = true;
                        if ($scope.SHOW_EDIT_ACCESS) {
                            $scope.MY_PROFILE_FLAG = 0;
                        }
                        else {
                            $scope.MY_PROFILE_FLAG = 1;
                        };
                    };
                }
                $scope.PAGE_LOAD_FLAG = 1;
            } else {
                if ($cookies.get("EMPLY_PRSNL_ID") == 0) {
                    $scope.SHOW_EDIT_ACCESS = true;
                } else {
                    $scope.SHOW_EDIT_ACCESS = $scope.CheckEmployeeAllBranchAccess('EDIT_EMPLOYEE');
                };
                $scope.PAGE_LOAD_FLAG = 1;
            }
        });
    }
    $scope.HRM_GET_EMPLOYEE_STEP();
    $scope.HRM_EDIT_DETAILS = function () {
        $scope.EDIT_MODE = false;
        if ($scope.EmploymentInfo.PRIMARY_REPORTING_MANAGER_ID == null || $scope.EmploymentInfo.PRIMARY_REPORTING_MANAGER_ID == '') {
            $scope.EmploymentInfo.REPORTER_CHECK = true;
        }

    };
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
    $scope.START_DAY_OF_WEEK = $scope.$parent.MASTER_GET_CUSTOMER_SETTINGS_VALUES(47);
    if ($scope.START_DAY_OF_WEEK != -9999) {
        $scope.FILTER_WEEK_DAYS_Fn($scope.START_DAY_OF_WEEK);
    } else {
        $scope.FILTER_WEEK_DAYS_Fn(0);
    }
    $scope.EMPLOYEE_DECLARATION_DROPDOWN = [];
    $scope.PRIMARY_REPORTING_MANAGER_DROPDOWN = [];
    $scope.SECONDARY_REPORTING_MANAGER_DROPDOWN = [];
    $scope.TERTIARY_REPORTING_MANAGER_DROPDOWN = [];
    $scope.WORK_PATTERN_DROPDOWN = [];
    $scope.BRANCH_DROPDOWN = [];
    $scope.DEPARTMENT_SUGGESTIONS_DROPDOWN = [];
    $scope.POSITIONS_SUGGESTIONS_DROPDOWN = [];
    $scope.SECTIONS_SUGGESTIONS_DROPDOWN = [];
    $scope.SITES_LISTS_DELETED = [];
    if (getUrlParameter('EMP_ID', $location.absUrl()) == undefined || getUrlParameter('EMP_ID', $location.absUrl()) == "" || getUrlParameter('EMP_ID', $location.absUrl()) == null) {
        $scope.showHideClass = 'placeholder_eye_slash';  //placeholder_eye
    }
    else {
        $scope.inputType = 'Passwordkey';
        $scope.showHideClass = 'placeholder_eye';
    }
    $scope.SHOWPASSWORD = function () {
        if ($scope.inputType == 'Passwordkey') {
            $scope.inputType = 'text';
            $scope.showHideClass = 'placeholder_eye_slash';  //placeholder_eye
        }
        else {
            $scope.inputType = 'Passwordkey';
            $scope.showHideClass = 'placeholder_eye';
        }
    };
    $scope.dateinputHireDateddmmyyy = function () {
        $(document).ready(function () {
            var date_inputs = document.getElementsByClassName("dateinputHireddmmyyy") //our date input has the name "date"
            if (date_inputs.length > 0) {
                for (var i = 0; i < date_inputs.length; i++) {
                    var date_input = $('input[name="' + date_inputs[i].name + '"]'); //our date input has the name "date"
                    var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
                    // var date = new Date();
                    var options = {
                        todayBtn: "linked",
                        daysOfWeekHighlighted: "0,6",
                        autoclose: true,
                        todayHighlight: true,
                        format: 'dd/mm/yyyy',
                        closeText: 'Clear',
                        forceParse: false,
                        validateOnBlur: false,
                        clearBtn: true,
                        closeBtn: true,// close button visible
                        //  startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate())
                    };
                    date_input.datepicker(options).on("hide", function (e) {
                        if (e.date != undefined) {

                        }
                    })
                }
            }
        });
    }
    $scope.dateinputProbationHire = function () {
        $(document).ready(function () {
            var date_inputs = document.getElementsByClassName("dateinputProbationHire") //our date input has the name "date"
            if (date_inputs.length > 0) {
                for (var i = 0; i < date_inputs.length; i++) {
                    var date_input = $('input[name="' + date_inputs[i].name + '"]'); //our date input has the name "date"
                    if ($scope.EmploymentInfo.HIRING_DATE == undefined || $scope.EmploymentInfo.HIRING_DATE == null || $scope.EmploymentInfo.HIRING_DATE == '') {
                        var date = new Date($scope.CURRENT_DATE);
                    }
                    else {
                        var date = moment($scope.EmploymentInfo.SET_PROBATION_END_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate();
                    }
                    var options = {
                        todayBtn: "linked",
                        daysOfWeekHighlighted: "0,6",
                        autoclose: true,
                        todayHighlight: true,
                        format: 'dd/mm/yyyy',
                        closeText: 'Clear',
                        forceParse: false,
                        validateOnBlur: false,
                        clearBtn: true,
                        closeBtn: true,// close button visible
                        startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate())
                    };
                    date_input.datepicker(options);
                }
            }
        });
    }

    $scope.INCLUDE_IN_SCHEDULE_DROPDOWN = [
        { "INCLUDE_IN_SCHEDULE": 1, "INCLUDE_IN_SCHEDULE_TEXT": "Yes" },
        { "INCLUDE_IN_SCHEDULE": 0, "INCLUDE_IN_SCHEDULE_TEXT": "No" },
    ];
    $scope.HRM_GET_EMPLOYEE_DECLARATION = function () {
        var EmploymentInfoObject = new Object();
        EmploymentInfoObject.CUSTOMER_ID = $scope.EmploymentInfo.CUSTOMER_ID;
        EmploymentInfoObject.COUNTRY_ID = $scope.EmploymentInfo.COUNTRY_ID;
        PrcCommMethods.HUMANRESOURCE_API(EmploymentInfoObject, 'HRM_GET_EMPLOYEE_DECLARATION').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.EMPLOYEE_DECLARATION_DROPDOWN = data.data.Table;
            }
            else if (data.data == 0) {
                $scope.EMPLOYEE_DECLARATION_DROPDOWN = [];
            }
        });
    };
    //$scope.SELECTED_BRANCH_Fn = function (_branch, _site) {
    //}
    $scope.HRM_GET_USER_MANAGEMENT_ACCESS = function () {
        var EmploymentInfoObject = new Object();
        EmploymentInfoObject.CUSTOMER_ID = $cookies.get("CUSTOMER_ID");
        EmploymentInfoObject.ENTITY_ID = $cookies.get("ENTITY_ID");
        EmploymentInfoObject.EMPLY_PRSNL_ID = $cookies.get("EMPLY_PRSNL_ID");
        PrcCommMethods.HUMANRESOURCE_API(EmploymentInfoObject, 'HRM_GET_USER_MANAGEMENT_ACCESS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.BRANCH_DROPDOWN = data.data.Table.filter(x => x.TIME_SHEETS == true);  //TIME_SHEET edit Employee; 
            }
            else if (data.data == 0) {
                $scope.BRANCH_DROPDOWN = [];
            }
            if (data.data.Table1.length > 0) {
                $scope.DEPARTMENT_SUGGESTIONS_DROPDOWN = data.data.Table1;
            }
            if (data.data.Table2.length > 0) {
                $scope.POSITIONS_SUGGESTIONS_DROPDOWN = data.data.Table2;
            }
            $scope.PAGE_LOAD();
        });
    };
    $scope.HRM_GET_SECTIONS = function () {
        var EmploymentInfoObject = new Object();
        EmploymentInfoObject.CUSTOMER_ID = $scope.EmploymentInfo.CUSTOMER_ID;
        EmploymentInfoObject.ENTITY_ID = $scope.EmploymentInfo.ENTITY_ID;
        EmploymentInfoObject.PAGE_NO = $scope.EmploymentInfo.PAGE_NO;
        EmploymentInfoObject.PAGE_SIZE = $scope.EmploymentInfo.PAGE_SIZE;
        PrcCommMethods.HUMANRESOURCE_API(EmploymentInfoObject, 'HRM_GET_SECTIONS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.SECTIONS_SUGGESTIONS_DROPDOWN = data.data.Table;
            }
            else if (data.data == 0) {
                $scope.SECTIONS_SUGGESTIONS_DROPDOWN = [];
            }
        });
    };
    $scope.HRM_GET_EMPLOYEE_TYPES = function () {
        var EmploymentInfoObject = new Object();
        EmploymentInfoObject.CUSTOMER_ID = $scope.EmploymentInfo.CUSTOMER_ID;
        EmploymentInfoObject.ENTITY_ID = $scope.EmploymentInfo.ENTITY_ID;
        PrcCommMethods.HUMANRESOURCE_API(EmploymentInfoObject, 'HRM_GET_EMPLOYEE_TYPES').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.EMPLOYEE_TYPES_LIST = data.data.Table;
            }
            else if (data.data == 0) {
                $scope.EMPLOYEE_TYPES_LIST = [];
            }
        });
    };

    $scope.HRM_GET_WORK_PATTERNS = function () {
        var EmploymentInfoObject = new Object();
        EmploymentInfoObject.CUSTOMER_ID = $scope.EmploymentInfo.CUSTOMER_ID;
        EmploymentInfoObject.ENTITY_ID = $scope.EmploymentInfo.ENTITY_ID;
        EmploymentInfoObject.PAGE_NO = $scope.EmploymentInfo.PAGE_NO;
        EmploymentInfoObject.PAGE_SIZE = $scope.EmploymentInfo.PAGE_SIZE;
        PrcCommMethods.HUMANRESOURCE_API(EmploymentInfoObject, 'HRM_GET_WORK_PATTERNS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.WORK_PATTERN_DROPDOWN = data.data.Table;
                if ($scope.EmploymentInfo.CUSTOME_WORK_PATTERN_ID > 0) {
                    var work = $scope.WORK_PATTERN_DROPDOWN.find(x => x.WORK_PATTERN_ID == $scope.EmploymentInfo.CUSTOME_WORK_PATTERN_ID);
                    $scope.SELECTED_WORK_PATTERN_Fn(work, $scope.EmploymentInfo);
                }
            }
            else {
                $scope.WORK_PATTERN_DROPDOWN = [];
            }
        });
    };

    $scope.HRM_GET_WORK_PATTERNS();
    $scope.HRM_GET_REPORTING_MANAGER = function () {

        var EmploymentInfoObject = new Object();
        EmploymentInfoObject.CUSTOMER_ID = $scope.EmploymentInfo.CUSTOMER_ID;
        EmploymentInfoObject.EMPLY_PRSNL_ID = $scope.EmploymentInfo.EMPLY_PRSNL_ID;;
        EmploymentInfoObject.REPORTING_MANAGER_NAME = $scope.EmploymentInfo.REPORTING_MANAGER_NAME;
        EmploymentInfoObject.ENTITY_ID = $cookies.get("ENTITY_ID");
        PrcCommMethods.HUMANRESOURCE_API(EmploymentInfoObject, 'HRM_GET_REPORTING_MANAGER').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.SECONDARY_REPORTING_MANAGER_DROPDOWN = data.data.Table;
                $scope.PRIMARY_REPORTING_MANAGER_DROPDOWN = data.data.Table;
                $scope.TERTIARY_REPORTING_MANAGER_DROPDOWN = data.data.Table;
            }
        });
    };
    $scope.HRM_GET_REPORTING_MANAGER();
    //$scope.SET_SECONDARY_REPORT_MG = function (_primary) {
    //    angular.forEach($scope.SECONDARY_REPORTING_MANAGER_DROPDOWN, function (_second) {
    //        if (_second.SECONDARY_REPORTING_MANAGER_ID == _primary.PRIMARY_REPORTING_MANAGER_ID) {
    //        }
    //    })      
    //}
    $scope.GET_CUSTOMER_SETTINGS = function () {
        var readOnlyObject = new Object();
        readOnlyObject.CUSTOMER_ID = $scope.EmploymentInfo.CUSTOMER_ID;
        readOnlyObject.MODULE_ID = $scope.EmploymentInfo.MODULE_ID;
        readOnlyObject.TABLE_ID_LIST = [];

        var readonly = new Object();
        readonly.TABLE_ID = 49;
        readOnlyObject.TABLE_ID_LIST.push(readonly);

        PrcCommMethods.HUMANRESOURCE_API(readOnlyObject, 'GET_CUSTOMER_SETTINGS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.EmploymentInfo.PROBATION_MONTH = parseInt(data.data.Table[0].SETTING_VALUE);
            }
            else if (data.data == 0) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
        });
    };
    $scope.ADD_SITE_Fn = function (FLAG) {
        $scope.EmploymentInfo.SiteArray.push({
            EMPLOYMENT_INFO_BRANCH_ID: 0,
            BRANCH_ID: '',
            BRANCH_NAME: '',
            CUSTOM_BRANCH_NAME: $scope.DD_DEFAULT_TEXT,
            BRANCH_DEFAULT_TEXT: $scope.DD_DEFAULT_TEXT,
            START_DATE: $scope.EmploymentInfo.HIRING_DATE == null ? '' : moment($scope.EmploymentInfo.HIRING_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).format($scope.$parent.CONVERSION_DATE_FORMAT),
            DEPARTMENT_ID: '',
            DEPARTMENT_NAME: '',
            CUSTOM_DEPARTMENT_NAME: $scope.DD_DEFAULT_TEXT,
            DEPARTMENT_DEFAULT_TEXT: $scope.DD_DEFAULT_TEXT,
            POSITION_ID: '',
            POSITION_NAME: '',
            CUSTOM_POSITION_NAME: $scope.DD_DEFAULT_TEXT,
            POSITION_DEFAULT_TEXT: $scope.DD_DEFAULT_TEXT,
            SECTION_ID: '',
            SECTION_NAME: '',
            CUSTOM_SECTION_NAME: $scope.DD_DEFAULT_TEXT,
            SECTION_DEFAULT_TEXT: $scope.DD_DEFAULT_TEXT,
            IS_PRIME: FLAG == 1 ? true : false,
            DELETE_FLAG: false,
        });
        $scope.$parent.$parent.DATE_INPUT_LOAD();
    };

    function reportrange(start, end, default_flag) {
        $scope.EmploymentInfo.LACTATION_BREAK_START_DATE = start.format($scope.$parent.CONVERSION_DATE_FORMAT);
        $scope.EmploymentInfo.LACTATION_BREAK_END_DATE = end.format($scope.$parent.CONVERSION_DATE_FORMAT);

        if (default_flag == 1) {
            $scope.EmploymentInfo.LACTATION_BREAK_START_DATE = '';
            $scope.EmploymentInfo.LACTATION_BREAK_END_DATE = '';
            $('#reportrange span').html("Add here");
        } else {

            $('#reportrange span').html(start.format($scope.$parent.CONVERSION_DATE_FORMAT) + ' - ' + end.format($scope.$parent.CONVERSION_DATE_FORMAT));
        }

    };
    $scope.CHECK_PS_EMAIL1 = function (_email) {
        var UserModelObj = new Object();
        UserModelObj.EMPLY_PRSNL_ID = $scope.EmploymentInfo.EMPLY_PRSNL_ID;
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'HRM_GET_EMPLOYEE_PERSONAL').then(function (data) {
            if (data.data.Table.length > 0) {
                if (_email == data.data.Table[0].EMAIL) {
                    $scope.EmploymentInfo.ADDITIONAL_CONTACT_EMAIL = '';
                    $scope.$parent.ShowAlertBox("Attention", 'Additional contact email id is not same for your personal email id.', 3000);
                };
            };
        });
    }
    $scope.PAGE_LOAD = function () {
        data = new Date();
        var start = moment().subtract(6 + data.getDay(), 'days');   //moment().startOf('isoWeek');//moment().subtract(6, 'days');
        var end = moment().subtract(data.getDay(), 'days');   //moment().subtract(0, 'days');

        $scope.EmploymentInfo.LACTATION_BREAK_START_DATE = start.format($scope.$parent.CONVERSION_DATE_FORMAT);
        $scope.EmploymentInfo.LACTATION_BREAK_END_DATE = end.format($scope.$parent.CONVERSION_DATE_FORMAT);


        $scope.$parent.SetUpDateRangeMultiDatePicker('reportrange', start, end, reportrange, 0, "left");
        // 

        if ($scope.EmploymentInfo.EMPLY_PRSNL_ID > 0) {
            $scope.HRM_GET_EMPLOYEE_EMPLOYMENT_INFO();
        }
        else {
            $scope.ADD_SITE_Fn();
        }
    };

    $scope.SELECTED_DECLARATION_Fn = function (declaration, _click_flag) {
        if (declaration == '') {
            $scope.EmploymentInfo.CUSTOM_DECLARATION_NAME = $scope.DD_DEFAULT_TEXT;
            $scope.EmploymentInfo.STARTER_DECLARATION_ID = '';
        } else {
            $scope.EmploymentInfo.CUSTOM_DECLARATION_NAME = declaration.DECLARATION_NAME;
            $scope.EmploymentInfo.STARTER_DECLARATION_ID = declaration.STARTER_DECLARATION_ID;
        };
        if (_click_flag == 1) {
            $scope.WATCH_GROUP_Fn('STARTER_DECLARATION_ID');
        };
    };
    $scope.SELECTED_PRI_RM_Fn = function (_primary, _levels, _click_flag) {
        $(".searchablePrimaryButton").hide();
        if (_primary == '') {
            $scope.EmploymentInfo.CUSTOM_PRIMARY_REPORTING_MANAGER = $scope.DD_DEFAULT_TEXT;
            $scope.EmploymentInfo.PRIMARY_REPORTING_MANAGER_ID = '';
            $scope.SELECTED_SEC_RM_Fn('');
            $scope.SELECTED_TERTIARY_RM_Fn('');
        }
        else {
            $scope.EmploymentInfo.CUSTOM_PRIMARY_REPORTING_MANAGER = _primary.EMPLOYEE_NAME;
            $scope.EmploymentInfo.PRIMARY_REPORTING_MANAGER_ID = _primary.ID;
        };
        if (_levels == 1) {
            $scope.VALID_REPORTING_MANAGER_SELECTION(1);
        };
        if (_click_flag == 1) {
            $scope.WATCH_GROUP_Fn('PRIMARY_REPORTING_MANAGER_ID');
        };
    };

    $scope.SELECTED_SEC_RM_Fn = function (_secondary, _levels, _click_flag) {
        $(".searchableSecondryButton").hide();

        if (_secondary == '') {
            $scope.EmploymentInfo.CUSTOM_SECONDARY_REPORTING_MANAGER = $scope.DD_DEFAULT_TEXT;
            $scope.EmploymentInfo.SECONDARY_REPORTING_MANAGER_ID = '';
            $scope.SELECTED_TERTIARY_RM_Fn('');
        }
        else {
            $scope.EmploymentInfo.CUSTOM_SECONDARY_REPORTING_MANAGER = _secondary.EMPLOYEE_NAME;
            $scope.EmploymentInfo.SECONDARY_REPORTING_MANAGER_ID = _secondary.ID;
        }
        if (_levels == 2) {
            $scope.VALID_REPORTING_MANAGER_SELECTION(2);
        }
        if (_click_flag == 1) {
            $scope.WATCH_GROUP_Fn('SECONDARY_REPORTING_MANAGER_ID');
        }
    };
    $scope.SELECTED_TERTIARY_RM_Fn = function (_TERTIARY, _levels, _click_flag) {
        $(".searchableTERTIARYButton").hide();
        if (_TERTIARY == '') {
            $scope.EmploymentInfo.CUSTOM_TERTIARY_REPORTING_MANAGER = $scope.DD_DEFAULT_TEXT;
            $scope.EmploymentInfo.TERTIARY_REPORTING_MANAGER_ID = '';
        }
        else {
            $scope.EmploymentInfo.CUSTOM_TERTIARY_REPORTING_MANAGER = _TERTIARY.EMPLOYEE_NAME;
            $scope.EmploymentInfo.TERTIARY_REPORTING_MANAGER_ID = _TERTIARY.ID;
        }
        if (_levels == 3) {
            $scope.VALID_REPORTING_MANAGER_SELECTION(3);
        }
        if (_click_flag == 1) {
            $scope.WATCH_GROUP_Fn('TERTIARY_REPORTING_MANAGER_ID');
        }
    };
    $scope.SELECTED_EMPLOYEE_TYPES_Fn = function (_param_emply_type, _click_flag) {
        if (_param_emply_type == '') {
            $scope.EmploymentInfo.CUSTOM_EMPLOYEE_TYPE = $scope.DD_DEFAULT_TEXT;
            $scope.EmploymentInfo.EMPLOYEE_TYPE_ID = '';
        }
        else {
            $scope.EmploymentInfo.CUSTOM_EMPLOYEE_TYPE = _param_emply_type.EMPLOYEE_TYPE_NAMES;
            $scope.EmploymentInfo.EMPLOYEE_TYPE_ID = _param_emply_type.EMPLOYEE_TYPES_ID;
        }
        if (_click_flag == 1) {
            $scope.WATCH_GROUP_Fn('EMPLOYEE_TYPE_ID');
        }
    };
    $scope.SELECTED_DEPARTMENT_Fn = function (_param_department, _site) {
        if (_param_department == '') {
            _site.CUSTOM_DEPARTMENT_NAME = $scope.DD_DEFAULT_TEXT;
            _site.DEPARTMENT_ID = '';
        }
        else {
            _site.CUSTOM_DEPARTMENT_NAME = _param_department.DEPARTMENT_NAME;
            _site.DEPARTMENT_ID = _param_department.DEPARTMENT_ID;
            _site.DISPLAY_DEPARTMENT_TEXT_SEARCH = "";
        }
    };

    $scope.SHOW_DDL_Fn = function (FLAG) {
        if (FLAG == 1) {
            $(".searchablePrimaryButton").show();
        }
        if (FLAG == 2) {
            $(".searchableSecondryButton").show();
        }
        if (FLAG == 3) {
            $(".searchableTERTIARYButton").show();
        }
    }

    $scope.RESET_CHECK = function () {
        $(".searchablePrimaryButton").hide();
        $(".searchableSecondryButton").hide();
        $(".searchableTERTIARYButton").hide();
        if ($scope.EmploymentInfo.PRIMARY_REPORTING_MANAGER_ID != '' && $scope.EmploymentInfo.PRIMARY_REPORTING_MANAGER_ID != null) {
            if ($scope.EmploymentInfo.REPORTER_CHECK == true) {
                $scope.EmploymentInfo.CUSTOM_PRIMARY_REPORTING_MANAGER = $scope.DD_DEFAULT_TEXT;
                $scope.EmploymentInfo.PRIMARY_REPORTING_MANAGER_ID = '';

                $scope.EmploymentInfo.CUSTOM_SECONDARY_REPORTING_MANAGER = $scope.DD_DEFAULT_TEXT;
                $scope.EmploymentInfo.SECONDARY_REPORTING_MANAGER_ID = '';

                $scope.EmploymentInfo.CUSTOM_TERTIARY_REPORTING_MANAGER = $scope.DD_DEFAULT_TEXT;
                $scope.EmploymentInfo.TERTIARY_REPORTING_MANAGER_ID = '';
                $scope.EmploymentInfo.IS_VALIDATED = true;
            }
        }
    }

    $scope.SELECTED_POSITION_Fn = function (_position, _site) {
        if (_position == '') {
            _site.CUSTOM_POSITION_NAME = $scope.DD_DEFAULT_TEXT;
            _site.POSITION_ID = '';
        }
        else {
            _site.CUSTOM_POSITION_NAME = _position.POSITION_NAME;
            _site.POSITION_ID = _position.POSITION_ID;
            _site.DISPLAY_POSITION_TEXT_SEARCH = "";
        }
    };

    $scope.SELECTED_SECTION_Fn = function (_section, _site) {
        if (_section == '') {
            _site.CUSTOM_SECTION_NAME = $scope.DD_DEFAULT_TEXT;
            _site.SECTION_ID = '';
        }
        else {
            _site.CUSTOM_SECTION_NAME = _section.SECTION_NAME;
            _site.SECTION_ID = _section.SECTION_ID;
            _site.DISPLAY_SECTION_TEXT_SEARCH = "";
        }
    };

    $scope.SELECTED_SCHEDULE_Fn = function (_schedule, _employementInfo) {
        if (_schedule == '') {
            $scope.EmploymentInfo.CUSTOM_INCLUDE_IN_SCHEDULE_TEXT = $scope.DD_DEFAULT_TEXT;
            $scope.EmploymentInfo.INCLUDE_IN_SCHEDULE = '';
        } else {
            $scope.EmploymentInfo.CUSTOM_INCLUDE_IN_SCHEDULE_TEXT = _schedule.INCLUDE_IN_SCHEDULE_TEXT;
            $scope.EmploymentInfo.INCLUDE_IN_SCHEDULE = _schedule.INCLUDE_IN_SCHEDULE;
        }
    };
    $scope.ADD_SITE = [];
    $scope.SELECTED_BRANCH_Fn = function (_branch, _site) {
        if (_branch == '') {
            if (_site.BRANCH_ID != '' && _site.BRANCH_ID != undefined && _site.BRANCH_ID != null) {
                let lastRecord = $scope.ADD_SITE.find(x => x.BRANCH_ID == _site.BRANCH_ID);
                if (lastRecord != null && lastRecord != undefined) {
                    $scope.ADD_SITE = $scope.ADD_SITE.filter(x => x.BRANCH_ID != _site.BRANCH_ID);
                    $scope.BRANCH_DROPDOWN.push(angular.copy(lastRecord));
                }
            }
            _site.CUSTOM_BRANCH_NAME = $scope.DD_DEFAULT_TEXT;
            _site.BRANCH_ID = '';
            _site.CUSTOM_POSITION_NAME = $scope.DD_DEFAULT_TEXT;
            _site.DEPARTMENT_ID = '';
            _site.POSITION_ID = '';
            _site.CUSTOM_DEPARTMENT_NAME = $scope.DD_DEFAULT_TEXT;
            _site.DEPARTMENT_SUGGESTIONS_DROPDOWN = [];
            _site.POSITIONS_SUGGESTIONS_DROPDOWN = [];
        } else {
            let lastRecord = $scope.ADD_SITE.find(x => x.BRANCH_ID == _site.BRANCH_ID);
            if (lastRecord != undefined && lastRecord != null) {
                $scope.ADD_SITE = $scope.ADD_SITE.filter(x => x.BRANCH_ID !== lastRecord.BRANCH_ID);
                $scope.BRANCH_DROPDOWN.push(angular.copy(lastRecord));
            }
            _site.CUSTOM_BRANCH_NAME = _branch.BRANCH_NAME;
            _site.BRANCH_ID = _branch.BRANCH_ID;
            var siteIndex = $scope.BRANCH_DROPDOWN.findIndex(x => x.BRANCH_ID == _site.BRANCH_ID);
            if (siteIndex >= 0) {
                $scope.ADD_SITE.push(angular.copy($scope.BRANCH_DROPDOWN[siteIndex]));
                $scope.BRANCH_DROPDOWN = $scope.BRANCH_DROPDOWN.filter(x => x.BRANCH_ID != _site.BRANCH_ID);
            }
            _site.CUSTOM_POSITION_NAME = $scope.DD_DEFAULT_TEXT;
            _site.DEPARTMENT_ID = '';
            _site.POSITION_ID = '';
            _site.CUSTOM_DEPARTMENT_NAME = $scope.DD_DEFAULT_TEXT;
            _site.DEPARTMENT_SUGGESTIONS_DROPDOWN = [];
            _site.POSITIONS_SUGGESTIONS_DROPDOWN = [];
            if ($cookies.get("EMPLY_PRSNL_ID") == null || parseInt($cookies.get("EMPLY_PRSNL_ID")) == 0) {
                _site.DEPARTMENT_SUGGESTIONS_DROPDOWN = $scope.DEPARTMENT_SUGGESTIONS_DROPDOWN;
                _site.POSITIONS_SUGGESTIONS_DROPDOWN = $scope.POSITIONS_SUGGESTIONS_DROPDOWN;
            }
            else {
                _site.DEPARTMENT_SUGGESTIONS_DROPDOWN = $scope.DEPARTMENT_SUGGESTIONS_DROPDOWN.filter(function (x) { return x.BRANCH_ID == _site.BRANCH_ID });
                _site.POSITIONS_SUGGESTIONS_DROPDOWN = $scope.POSITIONS_SUGGESTIONS_DROPDOWN.filter(function (x) { return x.BRANCH_ID == _site.BRANCH_ID });
            }
        }
    };

    $scope.SELECTED_WORK_PATTERN_Fn = function (_param_work_pattern, _employementInfo, _click_flag) {
        if (_param_work_pattern == 'Custom') {
            $scope.EmploymentInfo.CUSTOM_WORK_PATTERN_TITLE = "Custom";
            $('#Edit_WorkPattern').modal('show');
        }
        else if (_param_work_pattern == '') {
            $scope.EmploymentInfo.CUSTOM_WORK_PATTERN_TITLE = $scope.EmploymentInfo.WORK_PATTERN_DEFAULT_TEXT;
            $scope.EmploymentInfo.WORK_PATTERN_ID = '';
        } else {
            $scope.EmploymentInfo.CUSTOM_WORK_PATTERN_TITLE = _param_work_pattern.TITLE;
            $scope.EmploymentInfo.WORK_PATTERN_ID = _param_work_pattern.WORK_PATTERN_ID;
            _employementInfo.EDIT_FLAG = false;
            _employementInfo.TOTAL = _param_work_pattern.TOTAL;
            _employementInfo.MON = _param_work_pattern.MON;
            _employementInfo.TUE = _param_work_pattern.TUE;
            _employementInfo.WED = _param_work_pattern.WED;
            _employementInfo.THU = _param_work_pattern.THU;
            _employementInfo.FRI = _param_work_pattern.FRI;
            _employementInfo.SAT = _param_work_pattern.SAT;
            _employementInfo.SUN = _param_work_pattern.SUN;
            _employementInfo.WORK_PATTERN_TYPE_ID = _param_work_pattern.WORK_PATTERN_TYPE_ID;
        }

    };
    $scope.CLOSE_EDIT_WORKPATTERN_Fn = function () {
        $scope.SELECTED_WORK_PATTERN_Fn('');
        $scope.HRM_GET_WORK_PATTERNS();
        $('#Edit_WorkPattern').modal('hide');
    };
    $scope.WORK_PATTERN_EDIT_Fn = function () {
        if ($scope.EmploymentInfo.WORK_PATTERN_TYPE_ID > 0) {
            $scope.EmploymentInfo.EDIT_FLAG = !$scope.EmploymentInfo.EDIT_FLAG;
        }

    };

    $scope.nginit_sites = function (site) {
        site.BRANCH_DEFAULT_TEXT = $scope.DD_DEFAULT_TEXT;
        if ((site.CUSTOM_BRANCH_NAME == undefined || site.CUSTOM_BRANCH_NAME == "" || site.CUSTOM_BRANCH_NAME == null) && (site.BRANCH_NAME == '' || site.BRANCH_NAME == undefined || site.BRANCH_NAME == null)) {
            site.CUSTOM_BRANCH_NAME = site.BRANCH_DEFAULT_TEXT;
        }
        else if (site.BRANCH_NAME != '' && site.BRANCH_NAME != undefined && site.BRANCH_NAME != null) {
            site.CUSTOM_BRANCH_NAME = site.BRANCH_NAME;
        };

        site.DEPARTMENT_DEFAULT_TEXT = $scope.DD_DEFAULT_TEXT;
        if ((site.CUSTOM_DEPARTMENT_NAME == undefined || site.CUSTOM_DEPARTMENT_NAME == "" || site.CUSTOM_DEPARTMENT_NAME == null) && (site.DEPARTMENT_NAME == '' || site.DEPARTMENT_NAME == undefined || site.DEPARTMENT_NAME == null)) {
            site.CUSTOM_DEPARTMENT_NAME = site.DEPARTMENT_DEFAULT_TEXT;
        }
        else if (site.DEPARTMENT_NAME != '' && site.DEPARTMENT_NAME != undefined && site.DEPARTMENT_NAME != null) {
            site.CUSTOM_DEPARTMENT_NAME = site.DEPARTMENT_NAME;
        };

        site.POSITION_DEFAULT_TEXT = $scope.DD_DEFAULT_TEXT;
        if ((site.CUSTOM_POSITION_NAME == undefined || site.CUSTOM_POSITION_NAME == "" || site.CUSTOM_POSITION_NAME == null) && (site.POSITION_NAME == '' || site.POSITION_NAME == undefined || site.POSITION_NAME == null)) {
            site.CUSTOM_POSITION_NAME = site.POSITION_DEFAULT_TEXT;
        }
        else if (site.POSITION_NAME != '' && site.POSITION_NAME != undefined && site.POSITION_NAME != null) {
            site.CUSTOM_POSITION_NAME = site.POSITION_NAME;
        };
        site.SECTION_DEFAULT_TEXT = $scope.DD_DEFAULT_TEXT;
        if ((site.CUSTOM_SECTION_NAME == undefined || site.CUSTOM_SECTION_NAME == "" || site.CUSTOM_SECTION_NAME == null) && (site.SECTION_NAME == '' || site.SECTION_NAME == undefined || site.SECTION_NAME == null)) {
            site.CUSTOM_SECTION_NAME = site.SECTION_DEFAULT_TEXT;
        }
        else if (site.SECTION_NAME != '' && site.SECTION_NAME != undefined && site.SECTION_NAME != null) {
            site.CUSTOM_SECTION_NAME = site.SECTION_NAME;
        };

        if (site.EMPLOYMENT_INFO_BRANCH_ID > 0) {
            //site.IS_PRIME = site.IS_PRIME;
            if ($scope.EmploymentInfo.HIRING_DATE !== "" && $scope.EmploymentInfo.HIRING_DATE !== null && $scope.EmploymentInfo.HIRING_DATE !== undefined) {
                // site.START_DATE = site.START_DATE == null ? $filter('date')($scope.EmploymentInfo.HIRING_DATE, $scope.$parent.CONVERSION_DATE_FORMAT) : moment(site.START_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate();
                site.START_DATE = site.START_DATE == null ? $filter('date')($scope.EmploymentInfo.HIRING_DATE, $scope.$parent.CONVERSION_DATE_FORMAT) : moment(site.START_DATE).format($scope.$parent.CONVERSION_DATE_FORMAT);
            }
            //$(".dateinputOpen ").datepicker("setDate", _loopValue.START_DATE);
            $scope.$parent.$parent.DATE_INPUT_LOAD();
            if (site.IS_PRIME) {
                $scope.COPY_POSITION_ID = site.POSITION_ID;
            }
        }

        if ($cookies.get("EMPLY_PRSNL_ID") == null || parseInt($cookies.get("EMPLY_PRSNL_ID")) == 0) {
            site.DEPARTMENT_SUGGESTIONS_DROPDOWN = $scope.DEPARTMENT_SUGGESTIONS_DROPDOWN;
            site.POSITIONS_SUGGESTIONS_DROPDOWN = $scope.POSITIONS_SUGGESTIONS_DROPDOWN;
        }
        else {
            site.DEPARTMENT_SUGGESTIONS_DROPDOWN = $scope.DEPARTMENT_SUGGESTIONS_DROPDOWN.filter(function (x) { return x.BRANCH_ID == site.BRANCH_ID });
            site.POSITIONS_SUGGESTIONS_DROPDOWN = $scope.POSITIONS_SUGGESTIONS_DROPDOWN.filter(function (x) { return x.BRANCH_ID == site.BRANCH_ID });
        }
    };
    $scope.REMOVE_SITE_Fn = function (SITE, index) {
        if (confirm('Are you Sure?')) {
            if (SITE.EMPLOYMENT_INFO_BRANCH_ID == 0) {
                var siteIndex = $scope.ADD_SITE.findIndex(x => x.BRANCH_ID == SITE.BRANCH_ID);
                if (siteIndex >= 0) {
                    $scope.BRANCH_DROPDOWN.push(angular.copy($scope.ADD_SITE[siteIndex]));
                    $scope.ADD_SITE = $scope.ADD_SITE.filter(x => x.BRANCH_ID !== SITE.BRANCH_ID);
                }
                $scope.EmploymentInfo.SiteArray.splice(index, 1);
                if ($scope.EmploymentInfo.SiteArray.length == 0) {
                    $scope.ADD_SITE_Fn(0);
                }
            }
            else {
                SITE.DELETE_FLAG = true;
                var siteIndex = $scope.ADD_SITE.findIndex(x => x.BRANCH_ID == SITE.BRANCH_ID);
                if (siteIndex >= 0) {
                    $scope.BRANCH_DROPDOWN.push(angular.copy($scope.ADD_SITE[siteIndex]));
                    $scope.ADD_SITE = $scope.ADD_SITE.filter(x => x.BRANCH_ID !== SITE.BRANCH_ID);
                }
                $scope.SITES_LISTS_DELETED.push(angular.copy(SITE));
                $scope.EmploymentInfo.SiteArray.splice(index, 1);

                if ($scope.EmploymentInfo.SiteArray.length == 0) {
                    $scope.ADD_SITE_Fn(0);
                }
            }
        }
    };
    $scope.SET_IS_PRIME_Fn = function (selectedSite) {
        $scope.EmploymentInfo.SiteArray.forEach(function (site) {
            if (site === selectedSite) {
                site.IS_PRIME = true;
            } else {
                site.IS_PRIME = false;
            }
        });
    };

    $scope.HRM_GET_EMPLOYEE_PERSONAL = function () {
        var UserModelObj = new Object();
        UserModelObj.EMPLY_PRSNL_ID = $scope.EmploymentInfo.EMPLY_PRSNL_ID
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'HRM_GET_EMPLOYEE_PERSONAL').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.GENDER_ID = data.data.Table[0].GENDER_ID;
            }
        })
    }
    $scope.HRM_GET_EMPLOYEE_PERSONAL();

    $scope.HRM_GET_EMPLOYEE_EMPLOYMENT_INFO = function () {
        $scope.$parent.overlay_loadingNew = 'block';
        var EmploymentInfoObject = new Object();
        EmploymentInfoObject.EMPLY_PRSNL_ID = $scope.EmploymentInfo.EMPLY_PRSNL_ID;
        EmploymentInfoObject.ENTITY_ID = $cookies.get("ENTITY_ID");
        PrcCommMethods.HUMANRESOURCE_API(EmploymentInfoObject, 'HRM_GET_EMPLOYEE_EMPLOYMENT_INFO').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.OrignalData = {}
                var result = data.data.Table[0];
                $scope.EmploymentInfo.EMPLYMNT_INFO_ID = result.EMPLYMNT_INFO_ID;
                $scope.EmploymentInfo.HIRING_DATE = '';
                if (result.HIRING_DATE != null && result.HIRING_DATE != undefined) {
                    $scope.EmploymentInfo.HIRING_DATE = moment(result.HIRING_DATE).format($scope.$parent.CONVERSION_DATE_FORMAT);
                    $scope.GET_SERVICE_AGE_Fn(moment($scope.EmploymentInfo.HIRING_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate());
                }
                if (result.TERMINATION_DATE != null && result.TERMINATION_DATE != undefined) {
                    $scope.EmploymentInfo.TERMINATION_DATE = moment(result.TERMINATION_DATE).format($scope.$parent.CONVERSION_DATE_FORMAT);
                };
                //$scope.EmploymentInfo.TERMINATION_DATE = result.TERMINATION_DATE == null ? '' : $filter('date')(new Date(result.TERMINATION_DATE));
                $scope.EmploymentInfo.ADDITIONAL_CONTACT_EMAIL = result.ADDITIONAL_CONTACT_EMAIL;
                $scope.EmploymentInfo.STARTER_DECLARATION_ID = result.STARTER_DECLARATION_ID;
                $scope.EmploymentInfo.CUSTOM_DECLARATION_NAME = result.STARTER_DECLARATION;
                var index_DEC = $scope.EMPLOYEE_DECLARATION_DROPDOWN.findIndex(function (item) { return item.STARTER_DECLARATION_ID === $scope.EmploymentInfo.STARTER_DECLARATION_ID; });
                if (index_DEC >= 0) {
                    $scope.SELECTED_DECLARATION_Fn($scope.EMPLOYEE_DECLARATION_DROPDOWN[index_DEC], $scope.EmploymentInfo);
                }
                $scope.EmploymentInfo.PRIMARY_REPORTING_MANAGER_ID = result.PRIMARY_REPORTING_MANAGER_ID;
                if ($scope.EmploymentInfo.PRIMARY_REPORTING_MANAGER_ID == '' || $scope.EmploymentInfo.PRIMARY_REPORTING_MANAGER_ID == null || $scope.EmploymentInfo.PRIMARY_REPORTING_MANAGER_ID == undefined) {
                    $scope.EmploymentInfo.REPORTER_CHECK = true;
                }
                $scope.EmploymentInfo.SECONDARY_REPORTING_MANAGER_ID = result.SECONDARY_REPORTING_MANAGER_ID;
                $scope.EmploymentInfo.TERTIARY_REPORTING_MANAGER_ID = result.TERTIARY_REPORTING_MANAGER_ID;
                if (result.EMPLOYEE_TYPE_ID != null) {
                    $scope.EmploymentInfo.EMPLOYEE_TYPE_ID = result.EMPLOYEE_TYPE_ID;
                    $scope.EmploymentInfo.CUSTOM_EMPLOYEE_TYPE = result.EMPLOYEE_TYPE_NAMES;
                }
                else {
                    $scope.SELECTED_EMPLOYEE_TYPES_Fn('');
                }

                $scope.EmploymentInfo.EXCLUDE_FROM_PAYROLL = result.EXCLUDE_FROM_PAYROLL;

                var index_PRI = $scope.PRIMARY_REPORTING_MANAGER_DROPDOWN.findIndex(function (item) {
                    return item.ID === $scope.EmploymentInfo.PRIMARY_REPORTING_MANAGER_ID;
                });
                if (index_PRI >= 0) {
                    $scope.SELECTED_PRI_RM_Fn($scope.PRIMARY_REPORTING_MANAGER_DROPDOWN[index_PRI], $scope.EmploymentInfo);
                }

                var index_SEC = $scope.SECONDARY_REPORTING_MANAGER_DROPDOWN.findIndex(function (item) {
                    return item.ID === $scope.EmploymentInfo.SECONDARY_REPORTING_MANAGER_ID;
                });
                if (index_SEC >= 0) {
                    $scope.SELECTED_SEC_RM_Fn($scope.SECONDARY_REPORTING_MANAGER_DROPDOWN[index_SEC], $scope.EmploymentInfo);
                }
                var index_T = $scope.TERTIARY_REPORTING_MANAGER_DROPDOWN.findIndex(function (item) {
                    return item.ID === $scope.EmploymentInfo.TERTIARY_REPORTING_MANAGER_ID;
                });
                if (index_T >= 0) {
                    $scope.SELECTED_TERTIARY_RM_Fn($scope.TERTIARY_REPORTING_MANAGER_DROPDOWN[index_T], $scope.EmploymentInfo);
                };

                $scope.EmploymentInfo.RTW_STATUS = result.RTW_STATUS;
                $scope.EmploymentInfo.TEAMHUB_PIN = result.TEAMHUB_PIN;
                $scope.EmploymentInfo.INCLUDE_IN_SCHEDULE = result.INCLUDE_IN_SCHEDULE;

                var schedule = $scope.INCLUDE_IN_SCHEDULE_DROPDOWN.find(x => x.INCLUDE_IN_SCHEDULE == $scope.EmploymentInfo.INCLUDE_IN_SCHEDULE);
                if (schedule != undefined) {
                    $scope.SELECTED_SCHEDULE_Fn(schedule, $scope.EmploymentInfo);
                }

                if (result.LACTATION_BREAK_START_DATE != '' && result.LACTATION_BREAK_START_DATE != null) {

                    //$scope.EmploymentInfo.LACTATION_BREAK_START_DATE = $filter('date')(new Date(result.LACTATION_BREAK_START_DATE));
                    //$scope.EmploymentInfo.LACTATION_BREAK_END_DATE = $filter('date')(new Date(result.LACTATION_BREAK_END_DATE));

                    $scope.EmploymentInfo.LACTATION_BREAK_START_DATE = $filter('date')((result.LACTATION_BREAK_START_DATE), $scope.$parent.DISPLAY_DATE_FORMAT);
                    $scope.EmploymentInfo.LACTATION_BREAK_END_DATE = $filter('date')((result.LACTATION_BREAK_END_DATE), $scope.$parent.DISPLAY_DATE_FORMAT);

                    $('#reportrange span').html(($scope.EmploymentInfo.LACTATION_BREAK_START_DATE + ' - ' + $scope.EmploymentInfo.LACTATION_BREAK_END_DATE));
                } else {
                    $('#reportrange span').html("Add here");
                }
                if (result.CLOCKIN_CLOCKOUT_PIN == null || result.CLOCKIN_CLOCKOUT_PIN == undefined || result.CLOCKIN_CLOCKOUT_PIN == '') {
                    $scope.showHideClass = 'placeholder_eye_slash';  //placeholder_eye
                    $scope.inputType = 'text';
                }
                else {
                    // $scope.inputType = '';
                    $scope.showHideClass = 'placeholder_eye';
                    $scope.inputType = 'Passwordkey';
                }

                $scope.EmploymentInfo.CLOCKIN_CLOCKOUT_PIN = result.CLOCKIN_CLOCKOUT_PIN;
                if (result.WORK_PATTERN_ID) {
                    $scope.EmploymentInfo.WORK_PATTERN_ID = result.WORK_PATTERN_ID;
                    $scope.EmploymentInfo.CUSTOM_WORK_PATTERN_TITLE = result.TITLE;
                    var workIndex = $scope.WORK_PATTERN_DROPDOWN.findIndex(x => x.WORK_PATTERN_ID === result.WORK_PATTERN_ID);
                    if (workIndex >= 0) {
                        $scope.SELECTED_WORK_PATTERN_Fn($scope.WORK_PATTERN_DROPDOWN[workIndex], $scope.EmploymentInfo);
                    }
                    else {
                        $scope.EmploymentInfo.MON = result.MON;
                        $scope.EmploymentInfo.TUE = result.TUE;
                        $scope.EmploymentInfo.WED = result.WED;
                        $scope.EmploymentInfo.THU = result.THU;
                        $scope.EmploymentInfo.FRI = result.FRI;
                        $scope.EmploymentInfo.SAT = result.SAT;
                        $scope.EmploymentInfo.SUN = result.SUN;
                        $scope.EmploymentInfo.WORK_PATTERN_TYPE_ID = result.WORK_PATTERN_TYPE_ID;
                    };
                }

                $scope.EmploymentInfo.SOURCE = result.SOURCE;
                $scope.EmploymentInfo.ADD_NOTES_FOR_THIS_EMPLOYEE = result.ADD_NOTES_FOR_THIS_EMPLOYEE;
                $scope.EmploymentInfo.COMMENTS = result.COMMENTS;
                $scope.EmploymentInfo.EFFECTIVE_DATE = result.EFFECTIVE_DATE;


                if (result.SET_PROBATION_END_DATE != undefined && result.SET_PROBATION_END_DATE != null && result.SET_PROBATION_END_DATE != '') {
                    $scope.EmploymentInfo.SET_PROBATION_END_DATE = moment(result.SET_PROBATION_END_DATE).format($scope.$parent.CONVERSION_DATE_FORMAT);
                    //$scope.EmploymentInfo.SET_PROBATION_END_DATE = $filter('date')(new Date(result.SET_PROBATION_END_DATE));
                }
                $scope.$parent.$parent.DATE_INPUT_LOAD();
                $scope.dateinputProbationHire();
            }
            else {
                $scope.dateinputProbationHire();
            }

            if (data.data.Table1.length > 0) {
                $scope.EmploymentInfo.SiteArray = data.data.Table1;
                let isAnyPrimary = false;
                angular.forEach($scope.EmploymentInfo.SiteArray, function (_loopValue) {
                    if (_loopValue.IS_PRIME) {
                        isAnyPrimary = true;
                    }
                    var siteIndex = $scope.BRANCH_DROPDOWN.findIndex(x => x.BRANCH_ID == _loopValue.BRANCH_ID);
                    if (siteIndex >= 0) {
                        $scope.ADD_SITE.push(angular.copy($scope.BRANCH_DROPDOWN[siteIndex]));
                        $scope.BRANCH_DROPDOWN = $scope.BRANCH_DROPDOWN.filter(x => x.BRANCH_ID !== _loopValue.BRANCH_ID);
                    }
                    //if (_loopValue.START_DATE == null ) {
                    //    _loopValue.START_DATE == '';
                    //   // $(".dateinputOpen ").datepicker("setDate", _loopValue.START_DATE);
                    //}
                })
                if (!isAnyPrimary) {
                    $scope.EmploymentInfo.SiteArray[0].IS_PRIME = true;
                }
            }
            else {
                $scope.ADD_SITE_Fn(1);
            }
            $scope.$parent.$parent.DATE_INPUT_LOAD();
            $scope.$parent.overlay_loadingNew = 'none';
            $scope.OrignalData = angular.copy($scope.EmploymentInfo);
        });
    };
    $scope.VALIDATION_AFTER_Fn = function (_param_empinfo, FLAG) {
        if (_param_empinfo.ADDITIONAL_CONTACT_EMAIL != null && _param_empinfo.ADDITIONAL_CONTACT_EMAIL != "" && _param_empinfo.ADDITIONAL_CONTACT_EMAIL != undefined && $scope.EmploymentInfo.IS_VALIDATED == true) {
            $scope.HRM_INS_UPD_EMPLOYEE_EMPLOYMENT_INFO(_param_empinfo, FLAG);
        } else {
            if ($scope.EmploymentInfo.IS_VALIDATED == true)
                $scope.HRM_INS_UPD_EMPLOYEE_EMPLOYMENT_INFO(_param_empinfo, FLAG);
            else {
                $scope.$parent.ShowAlertBox("Attention", 'Reporting manager should be different in each level.', 3000);
            }
        }
    }
    $scope.HRM_CLICK_EFFICTIVE_DATE = function (_param_empinfo, FLAG) {
        $scope.EffectiveForm.submitted = true;
        if ($scope.EffectiveForm.$valid) {
            $scope.VALID_REPORTING_MANAGER_SELECTION();
            $scope.VALIDATION_AFTER_Fn(_param_empinfo, FLAG);
        }
    }
    $scope.HRM_EMPLOYEE_GET_UPCOMING_HISTORY_UPDATES_POPUP = function (_flag) {
        $scope.$parent.POP_EFFECTIVE_TAB_Fn(1);
        $scope.POP_EMPLOYEE_GET_UPCOMING_UPDATES_LIST = [];
        $scope.POP_EMPLOYEE_HISTORY_HEADERS_LIST = [];

        var personaldetailobj = new Object()
        personaldetailobj.EMPLY_PRSNL_ID = $scope.EmploymentInfo.EMPLY_PRSNL_ID;
        personaldetailobj.STEP_NO = 2;
        personaldetailobj.ENTITY_ID = $cookies.get("ENTITY_ID");
        personaldetailobj.EFFECTIVE_DATE = moment($scope.EmploymentInfo.EFFECTIVE_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).format('L');
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
    $scope.HRM_CHECK_EMAIL = function (_param_empinfo, FLAG) {
        $scope.REDIRECTION_FLAG = FLAG;
        $scope.EmploymentInfoform.submitted = true;
        let valid = 0;
        let IS_PRIM_COUNT = 0;
        $scope.EmploymentInfo.IS_PRIMARY = false;
        if ($scope.EmploymentInfoform.$valid) {
            $scope.VALID_REPORTING_MANAGER_SELECTION();
            angular.forEach($scope.EmploymentInfo.SiteArray, function (val) {
                //if ($filter('date')(new Date(val.START_DATE), $scope.$parent.CONVERSION_DATE_FORMAT) < $filter('date')($scope.EmploymentInfo.HIRING_DATE, $scope.$parent.CONVERSION_DATE_FORMAT)) {
                //    val.RETURN_DATE_FLAG = 1;
                //    valid++;

                //}
                if (moment(val.START_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate() < moment($scope.EmploymentInfo.HIRING_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate()) {
                    val.RETURN_DATE_FLAG = 1;
                    valid++;
                }

                if (val.IS_PRIME == true) {
                    $scope.EmploymentInfo.IS_PRIMARY = true;
                    IS_PRIM_COUNT = 0;
                }
                if (val.IS_PRIME == false && $scope.EmploymentInfo.IS_PRIMARY == false) {
                    $scope.EmploymentInfo.IS_PRIMARY = false;
                    IS_PRIM_COUNT = IS_PRIM_COUNT + 1;
                }
            });

            if ($scope.EmploymentInfo.IS_VALIDATED == false) { valid++; }
            if (IS_PRIM_COUNT == $scope.EmploymentInfo.SiteArray.length) {
                if ($scope.EmploymentInfo.IS_PRIMARY == false) { valid++; }
            }
        }
        else {
            $scope.$parent.ShowAlertBox("Attention", $scope.$parent.MANDATORY_MSG, 3000);
        }
        if ($scope.EmploymentInfoform.$valid && valid == 0) {
            if ($scope.EDIT_STEP_NO == 9) {
                if ($scope.EmploymentInfo.EFFECTIVE_DATE == undefined || $scope.EmploymentInfo.EFFECTIVE_DATE == null || $scope.EmploymentInfo.EFFECTIVE_DATE == '') {
                    $scope.EmploymentInfo.EFFECTIVE_DATE = moment($scope.CURRENT_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).format($scope.$parent.CONVERSION_DATE_FORMAT);
                }
                //$('#EffectiveDate').modal('show');
                $scope.$parent.EFFECTIVE_DATE_PICKER($scope.HeaderPrimaryDetails.LOCK_DATE);
                $scope.HRM_EMPLOYEE_GET_UPCOMING_HISTORY_UPDATES_POPUP();
            }
            else {
                $scope.VALIDATION_AFTER_Fn(_param_empinfo, FLAG);
            }
        }
        else {
            if ($scope.EmploymentInfoform.$valid) {
                if ($scope.EmploymentInfo.IS_VALIDATED == false) {
                    $scope.$parent.ShowAlertBox("Attention", 'Reporting manager should be different in each level.', 3000);
                }
                else if ($scope.EmploymentInfo.IS_PRIMARY == false) {
                    $scope.$parent.ShowAlertBox("Attention", 'Please set atleast one primary site.', 3000);
                }
                else {
                    $scope.$parent.ShowAlertBox("Attention", $scope.$parent.MANDATORY_MSG, 3000);
                }
            }
        }
    };
    $scope.CHECK_DATE = function () {
        if ($scope.EmploymentInfo.HIRING_DATE != null && $scope.EmploymentInfo.HIRING_DATE != '' && $scope.EmploymentInfo.HIRING_DATE != undefined) {
            //if (new Date($scope.EmploymentInfo.TERMINATION_DATE) < new Date($scope.EmploymentInfo.HIRING_DATE)) {
            //    $scope.$parent.ShowAlertBox("Attention", 'Termination date is not greater the hiring date.', 3000);
            //    $scope.EmploymentInfo.TERMINATION_DATE = null;
            //}
            if (moment($scope.EmploymentInfo.TERMINATION_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate() < moment($scope.EmploymentInfo.HIRING_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate()) {
                $scope.$parent.ShowAlertBox("Attention", 'Termination date is not greater the hiring date.', 3000);
                $scope.EmploymentInfo.TERMINATION_DATE = null;
            }
        }
    }
    $scope.POSITION_ID_CHANGE = false;
    $scope.HRM_INS_UPD_EMPLOYEE_EMPLOYMENT_INFO = function (_param_empinfo, FLAG) {
        $scope.EmploymentInfoform.submitted = true;
        $scope.EmploymentInfo.IS_PRIMARY = false;
        let date = moment($scope.EmploymentInfo.HIRING_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate();
        if (date.getFullYear() < 1900) {
            $scope.$parent.ShowAlertBox("Warning", 'Please Select Valid Hiring Date', 3000);
            $scope.EmploymentInfoform.$valid = false;
        }
        let valid = 0;
        let IS_PRIM_COUNT = 0;
        if ($scope.EmploymentInfoform.$valid) {
            

            angular.forEach($scope.EmploymentInfo.SiteArray, function (val) {
                //if (new Date(val.START_DATE) < new Date($filter('date')($scope.EmploymentInfo.HIRING_DATE, $scope.$parent.CONVERSION_DATE_FORMAT))) {
                //    val.RETURN_DATE_FLAG = 1;
                //    valid++;
                //}
                if (moment(val.START_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate() < moment($scope.EmploymentInfo.HIRING_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate()) {
                    val.RETURN_DATE_FLAG = 1;
                    valid++;;
                }

                if (val.IS_PRIME == true) {
                    $scope.EmploymentInfo.IS_PRIMARY = true;
                    IS_PRIM_COUNT = 0;
                    if (val.POSITION_ID != $scope.COPY_POSITION_ID) {
                        $scope.POSITION_ID_CHANGE = true;
                    }
                }
                if (val.IS_PRIME == false && $scope.EmploymentInfo.IS_PRIMARY == false) {
                    $scope.EmploymentInfo.IS_PRIMARY = false
                    IS_PRIM_COUNT = IS_PRIM_COUNT + 1;
                }
            });
        }
        if (IS_PRIM_COUNT == $scope.EmploymentInfo.SiteArray.length) {
            if ($scope.EmploymentInfo.IS_PRIMARY == false) { valid++; }
        }
        if ($scope.EmploymentInfoform.$valid && valid == 0) {
            $scope.WATCH_GROUP_Fn('SET_PROBATION_END_DATE');
            $scope.WATCH_GROUP_Fn('WORK_PATTERN_ID');
            $scope.WATCH_GROUP_Fn('INCLUDE_IN_SCHEDULE')
            var EmploymentInfoObject = new Object();
            EmploymentInfoObject.CUSTOMER_ID = $scope.EmploymentInfo.CUSTOMER_ID;
            EmploymentInfoObject.ENTITY_ID = $cookies.get("ENTITY_ID");
            EmploymentInfoObject.EMPLY_PRSNL_ID = $scope.EmploymentInfo.EMPLY_PRSNL_ID;
            EmploymentInfoObject.ACTIVE = 1;
            EmploymentInfoObject.USER_ID = $scope.EmploymentInfo.USER_ID;
            EmploymentInfoObject.EMPLYMNT_INFO_ID = $scope.EmploymentInfo.EMPLYMNT_INFO_ID || 0;
            EmploymentInfoObject.HIRING_DATE = $scope.EDIT_STEP_NO == 9 && !$scope.fieldChanges.HIRING_DATE ? null : moment($scope.EmploymentInfo.HIRING_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).format('L');
            if ($scope.EmploymentInfo.TERMINATION_DATE != "" && $scope.EmploymentInfo.TERMINATION_DATE == null && $scope.EmploymentInfo.TERMINATION_DATE == undefined) {
                EmploymentInfoObject.TERMINATION_DATE = $scope.EDIT_STEP_NO == 9 && !$scope.fieldChanges.TERMINATION_DATE ? null : moment($scope.EmploymentInfo.TERMINATION_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).format('L');
            };
            EmploymentInfoObject.ADDITIONAL_CONTACT_EMAIL = $scope.EDIT_STEP_NO == 9 && !$scope.fieldChanges.ADDITIONAL_CONTACT_EMAIL ? null : $scope.EmploymentInfo.ADDITIONAL_CONTACT_EMAIL;
            EmploymentInfoObject.STARTER_DECLARATION_ID = $scope.EDIT_STEP_NO == 9 && !$scope.fieldChanges.STARTER_DECLARATION_ID ? null : $scope.EmploymentInfo.STARTER_DECLARATION_ID;
            EmploymentInfoObject.PRIMARY_REPORTING_MANAGER_ID = $scope.EDIT_STEP_NO == 9 && $scope.fieldChanges.PRIMARY_REPORTING_MANAGER_ID && $scope.EmploymentInfo.CUSTOM_PRIMARY_REPORTING_MANAGER == $scope.EmploymentInfo.DD_DEFAULT_TEXT ? -1 : $scope.EDIT_STEP_NO == 9 && !$scope.fieldChanges.PRIMARY_REPORTING_MANAGER_ID ? null : $scope.EmploymentInfo.PRIMARY_REPORTING_MANAGER_ID;
            EmploymentInfoObject.SECONDARY_REPORTING_MANAGER_ID = $scope.EDIT_STEP_NO == 9 && $scope.fieldChanges.SECONDARY_REPORTING_MANAGER_ID && $scope.EmploymentInfo.CUSTOM_SECONDARY_REPORTING_MANAGER == $scope.EmploymentInfo.DD_DEFAULT_TEXT ? -1 : $scope.EDIT_STEP_NO == 9 && !$scope.fieldChanges.SECONDARY_REPORTING_MANAGER_ID ? null : $scope.EmploymentInfo.SECONDARY_REPORTING_MANAGER_ID;
            EmploymentInfoObject.TERTIARY_REPORTING_MANAGER_ID = $scope.EDIT_STEP_NO == 9 && $scope.fieldChanges.TERTIARY_REPORTING_MANAGER_ID && $scope.EmploymentInfo.CUSTOM_TERTIARY_REPORTING_MANAGER == $scope.EmploymentInfo.DD_DEFAULT_TEXT ? -1 : $scope.EDIT_STEP_NO == 9 && !$scope.fieldChanges.TERTIARY_REPORTING_MANAGER_ID ? null : $scope.EmploymentInfo.TERTIARY_REPORTING_MANAGER_ID;
            EmploymentInfoObject.RTW_STATUS = $scope.EDIT_STEP_NO == 9 && !$scope.fieldChanges.RTW_STATUS ? null : $scope.EmploymentInfo.RTW_STATUS;
            EmploymentInfoObject.TEAMHUB_PIN = $scope.EDIT_STEP_NO == 9 && !$scope.fieldChanges.TEAMHUB_PIN ? null : $scope.EmploymentInfo.TEAMHUB_PIN;
            EmploymentInfoObject.INCLUDE_IN_SCHEDULE = $scope.EDIT_STEP_NO == 9 && !$scope.fieldChanges.INCLUDE_IN_SCHEDULE ? null : $scope.EmploymentInfo.INCLUDE_IN_SCHEDULE == 1 ? true : false;
            //EmploymentInfoObject.LACTATION_BREAK_START_DATE = $scope.EmploymentInfo.LACTATION_BREAK_START_DATE == "" || $scope.EmploymentInfo.LACTATION_BREAK_START_DATE == undefined ? null : $scope.EmploymentInfo.LACTATION_BREAK_START_DATE;
            //EmploymentInfoObject.LACTATION_BREAK_END_DATE = $scope.EmploymentInfo.LACTATION_BREAK_END_DATE == "" || $scope.EmploymentInfo.LACTATION_BREAK_END_DATE == undefined ? null : $scope.EmploymentInfo.LACTATION_BREAK_END_DATE;


            EmploymentInfoObject.LACTATION_BREAK_START_DATE = $scope.EDIT_STEP_NO == 9 && !$scope.fieldChanges.LACTATION_BREAK_START_DATE ? null : $scope.EmploymentInfo.LACTATION_BREAK_START_DATE == "" || $scope.EmploymentInfo.LACTATION_BREAK_START_DATE == undefined ? null : moment($scope.EmploymentInfo.LACTATION_BREAK_START_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).format('L');
            EmploymentInfoObject.LACTATION_BREAK_END_DATE = $scope.EDIT_STEP_NO == 9 && !$scope.fieldChanges.LACTATION_BREAK_END_DATE ? null : $scope.EmploymentInfo.LACTATION_BREAK_END_DATE == "" || $scope.EmploymentInfo.LACTATION_BREAK_END_DATE == undefined ? null : moment($scope.EmploymentInfo.LACTATION_BREAK_END_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).format('L');


            EmploymentInfoObject.CLOCKIN_CLOCKOUT_PIN = $scope.EDIT_STEP_NO == 9 && !$scope.fieldChanges.CLOCKIN_CLOCKOUT_PIN ? null : $scope.EmploymentInfo.CLOCKIN_CLOCKOUT_PIN;
            EmploymentInfoObject.WORK_PATTERN_ID = $scope.EDIT_STEP_NO == 9 && !$scope.fieldChanges.WORK_PATTERN_ID ? null : $scope.EmploymentInfo.WORK_PATTERN_ID;
            //EmploymentInfoObject.SET_PROBATION_END_DATE = $scope.EmploymentInfo.SET_PROBATION_END_DATE;

            EmploymentInfoObject.SET_PROBATION_END_DATE = $scope.EDIT_STEP_NO == 9 && !$scope.fieldChanges.SET_PROBATION_END_DATE ? null : moment($scope.EmploymentInfo.SET_PROBATION_END_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).format('L');

            EmploymentInfoObject.SOURCE = $scope.EDIT_STEP_NO == 9 && !$scope.fieldChanges.SOURCE ? null : $scope.EmploymentInfo.SOURCE;
            EmploymentInfoObject.EMPLOYEE_TYPE_ID = $scope.EDIT_STEP_NO == 9 && !$scope.fieldChanges.EMPLOYEE_TYPE_ID ? null : $scope.EmploymentInfo.EMPLOYEE_TYPE_ID;
            EmploymentInfoObject.EXCLUDE_FROM_PAYROLL = $scope.EDIT_STEP_NO == 9 && !$scope.fieldChanges.EXCLUDE_FROM_PAYROLL ? null : $scope.EmploymentInfo.EXCLUDE_FROM_PAYROLL ? 1 : 0;

            EmploymentInfoObject.ADD_NOTES_FOR_THIS_EMPLOYEE = $scope.EDIT_STEP_NO == 9 && !$scope.fieldChanges.ADD_NOTES_FOR_THIS_EMPLOYEE ? null : $scope.EmploymentInfo.ADD_NOTES_FOR_THIS_EMPLOYEE;
            EmploymentInfoObject.COMMENTS = $scope.EmploymentInfo.EFFECTIVE_COMMENTS;
            //EmploymentInfoObject.EFFECTIVE_DATE = $scope.EmploymentInfo.EFFECTIVE_DATE == "" || $scope.EmploymentInfo.EFFECTIVE_DATE == undefined ? null :$scope.EmploymentInfo.EFFECTIVE_DATE;
            EmploymentInfoObject.EFFECTIVE_DATE = $scope.EmploymentInfo.EFFECTIVE_DATE == "" || $scope.EmploymentInfo.EFFECTIVE_DATE == undefined ? null : moment($scope.EmploymentInfo.EFFECTIVE_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).format('L');

            EmploymentInfoObject.HRM_EMPLOYEE_EMPLOYMENT_INFO_BRANCH_TYPE = [];
            angular.forEach($scope.EmploymentInfo.SiteArray, function (_loop_value, index) {
                var _empType = new Object()
                _empType.EMPLOYMENT_INFO_BRANCH_ID = _loop_value.EMPLOYMENT_INFO_BRANCH_ID > 0 ? _loop_value.EMPLOYMENT_INFO_BRANCH_ID : 0;
                var fieldChanges = $scope.OrignalData.SiteArray[index];
                if (fieldChanges != undefined && $scope.EDIT_STEP_NO == 9 && _loop_value.EMPLOYMENT_INFO_BRANCH_ID == fieldChanges.EMPLOYMENT_INFO_BRANCH_ID) {
                    fieldChanges.BOOL_BRANCH_ID = _loop_value.BRANCH_ID != fieldChanges.BRANCH_ID;
                    fieldChanges.BOOL_START_DATE = moment(_loop_value.START_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).format('L') != moment(moment(fieldChanges.START_DATE), $scope.$parent.CONVERSION_DATE_FORMAT).format('L');
                    fieldChanges.BOOL_DEPARTMENT_ID = _loop_value.DEPARTMENT_ID != fieldChanges.DEPARTMENT_ID;
                    fieldChanges.BOOL_POSITION_ID = _loop_value.POSITION_ID != fieldChanges.POSITION_ID;
                    fieldChanges.BOOL_SECTION_ID = _loop_value.SECTION_ID != fieldChanges.SECTION_ID;
                    fieldChanges.BOOL_IS_PRIME = _loop_value.IS_PRIME != fieldChanges.IS_PRIME;
                };
                _empType.BRANCH_ID = fieldChanges != undefined && $scope.EDIT_STEP_NO == 9 && !fieldChanges.BOOL_BRANCH_ID ? null : _loop_value.BRANCH_ID;
                _empType.START_DATE = fieldChanges != undefined && $scope.EDIT_STEP_NO == 9 && !fieldChanges.BOOL_START_DATE ? null : moment(_loop_value.START_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).format('L');
                _empType.DEPARTMENT_ID = fieldChanges != undefined && $scope.EDIT_STEP_NO == 9 && !fieldChanges.BOOL_DEPARTMENT_ID ? null : _loop_value.DEPARTMENT_ID;
                _empType.POSITION_ID = fieldChanges != undefined && $scope.EDIT_STEP_NO == 9 && !fieldChanges.BOOL_POSITION_ID ? null : _loop_value.POSITION_ID;
                _empType.SECTION_ID = fieldChanges != undefined && $scope.EDIT_STEP_NO == 9 && !fieldChanges.BOOL_SECTION_ID ? null : (_loop_value.SECTION_ID == undefined || _loop_value.SECTION_ID == "" || _loop_value.SECTION_ID == null) ? null : _loop_value.SECTION_ID;
                _empType.IS_PRIME = fieldChanges != undefined && $scope.EDIT_STEP_NO == 9 && !fieldChanges.BOOL_IS_PRIME ? null : _loop_value.IS_PRIME;
                _empType.DELETE_FLAG = 0;
                EmploymentInfoObject.HRM_EMPLOYEE_EMPLOYMENT_INFO_BRANCH_TYPE.push(_empType);
            });

            if ($scope.SITES_LISTS_DELETED.length > 0) {
                angular.forEach($scope.SITES_LISTS_DELETED, function (_loop_value) {
                    var _empType = new Object()
                    _empType.EMPLOYMENT_INFO_BRANCH_ID = _loop_value.EMPLOYMENT_INFO_BRANCH_ID > 0 ? _loop_value.EMPLOYMENT_INFO_BRANCH_ID : 0;
                    _empType.BRANCH_ID = _loop_value.BRANCH_ID;
                    _empType.START_DATE = moment(_loop_value.START_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).format('L');
                    _empType.DEPARTMENT_ID = _loop_value.DEPARTMENT_ID;
                    _empType.POSITION_ID = _loop_value.POSITION_ID;
                    _empType.SECTION_ID = _loop_value.SECTION_ID;
                    _empType.IS_PRIME = _loop_value.IS_PRIME;
                    _empType.DELETE_FLAG = 1;
                    EmploymentInfoObject.HRM_EMPLOYEE_EMPLOYMENT_INFO_BRANCH_TYPE.push(_empType);
                });
            }
            if (valid == 0) {
                if ($scope.POP_EMPLOYEE_HISTORY_HEADERS_LIST != undefined && $scope.POP_EMPLOYEE_HISTORY_HEADERS_LIST.length > 0) {
                    EmploymentInfoObject.TABLE_ID_LIST = [];
                    angular.forEach($scope.POP_EMPLOYEE_HISTORY_HEADERS_LIST, function (_History_value) {
                        var readOnly = new Object();
                        readOnly.TABLE_ID = _History_value.HISTORY_HEADER_ID;
                        EmploymentInfoObject.TABLE_ID_LIST.push(readOnly);
                    });
                    PrcCommMethods.HUMANRESOURCE_API(EmploymentInfoObject, 'HRM_EMPLOYEE_UPD_BACKDATED_CHANGE').then(function (data) { });
                }
                PrcCommMethods.HUMANRESOURCE_API(EmploymentInfoObject, 'HRM_INS_UPD_EMPLOYEE_EMPLOYMENT_INFO').then(function (data) {
                    if (data.data > 0) {
                        $('#EffectiveDate').modal('hide');
                        if (_param_empinfo.EMPLY_PRSNL_ID == 0) {
                            $scope.$parent.ShowAlertBox("Success", 'Employment Info added successfully', 3000);
                        }
                        else if (_param_empinfo.EMPLY_PRSNL_ID > 0) {
                            $scope.$parent.ShowAlertBox("Success", 'Employment Info updated successfully', 3000);
                        }
                        if (FLAG == 1) {
                            if ($scope.POSITION_ID_CHANGE == true && $scope.EDIT_STEP_NO == 9) {
                                $('#WageR_pop').modal('show');
                            }
                            else {
                                $scope.TAB_CLICK_HR_HEADER_Fn(0);
                            }
                        }
                        else {
                            if ($scope.POSITION_ID_CHANGE == true && $scope.EDIT_STEP_NO == 9) {
                                $('#WageR_pop').modal('show');
                            }
                            else {
                                $scope.TAB_CLICK_HR_HEADER_Fn(3, getUrlParameter('EMP_ID', $location.absUrl()));
                            }
                        }
                    }

                    else if (data.data < 0) {
                        $('#EffectiveDate').modal('hide');
                        $scope.$parent.ShowAlertBox("Attention", 'Already Added', 3000);
                    }
                    if (data.data == 0) {
                        $('#EffectiveDate').modal('hide');
                        $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                    }
                });
            }

        } else {
            if ($scope.EmploymentInfo.IS_VALIDATED == false) {
                $scope.$parent.ShowAlertBox("Attention", 'Reporting manager should be different in each level.', 3000);
            }
            else if ($scope.EmploymentInfo.IS_PRIMARY == false) {
                $scope.$parent.ShowAlertBox("Attention", 'Please set atleast one primary site.', 3000);
            }
            else {
                $scope.$parent.ShowAlertBox("Attention", $scope.$parent.MANDATORY_MSG, 3000);
            }
        }
    };
    function isDateValid(dateString) {
        let date = moment(dateString, $scope.$parent.CONVERSION_DATE_FORMAT, true);
        return date.isValid();
    }
    function isDateValidddmmyy(dateString) {
        let date = moment(dateString, $scope.$parent.CONVERSION_DATE_FORMAT, true);
        return date.isValid();
    }

    $scope.CHECK_DATE_BY_HIRINGDATE = function (_site) {
        if (_site.START_DATE != null && _site.START_DATE != '' && $scope.EmploymentInfo.HIRING_DATE != null && $scope.EmploymentInfo.HIRING_DATE != '') {
            {
                //let formattedDate = moment($scope.EmploymentInfo.HIRING_DATE, 'DD/MM/YYYY').format('MMM DD, YYYY');
                //  $(".dateofbirth ").datepicker("setDate", moment(RESULT_PERSNL.DOB).format("DD/MM/YYYY"));
                //var temp = date.format('M dd,YYYY')
                if (isDateValidddmmyy(_site.START_DATE) && moment($scope.EmploymentInfo.HIRING_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate() > moment(_site.START_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate()) {
                    _site.RETURN_DATE_FLAG = 1;
                } else {
                    _site.RETURN_DATE_FLAG = 0;
                }

                //if (isDateValid(_site.START_DATE) && new Date(formattedDate) > new Date(_site.START_DATE)) {
                //    _site.RETURN_DATE_FLAG = 1;
                //} else {
                //    _site.RETURN_DATE_FLAG = 0;
                //}
            }
        }
    }


    $scope.GET_SERVICE_AGE_Fn = function (dateString) {
        var ageInYears = moment().diff(moment(dateString), 'years');
        var ageInMonths = moment().diff(moment(dateString).add(ageInYears, 'years'), 'months');
        if (isNaN(ageInYears) || isNaN(ageInMonths)) {
            $scope.SERVICE_AGE_FORMAT = "0 years, 0 months";
        }
        else {
            $scope.SERVICE_AGE_FORMAT = ageInYears + " years," + ageInMonths + " months";
        }
    }

    $scope.HIRINGDATE_CHANGE_Fn = function () {
        if ($scope.EmploymentInfo.HIRING_DATE != null && $scope.EmploymentInfo.HIRING_DATE != undefined && $scope.EmploymentInfo.HIRING_DATE != '') {
            $scope.SET_PROBATION_DATE_Fn(moment($scope.EmploymentInfo.HIRING_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate());
            if ($scope.EDIT_STEP_NO < 3) {
                $scope.EmploymentInfo.SiteArray[0].START_DATE = moment($scope.EmploymentInfo.HIRING_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate();
                $(".dateinputOpen ").datepicker("setDate", $scope.EmploymentInfo.SiteArray[0].START_DATE);
            }
            $scope.GET_SERVICE_AGE_Fn(moment($scope.EmploymentInfo.HIRING_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate());
        }
        else {
            $scope.EmploymentInfo.SET_PROBATION_END_DATE = '';
            //if ($scope.EmploymentInfo.SiteArray == undefined )
            //$scope.EmploymentInfo.SiteArray[0].START_DATE = '';
            //$(".dateinputOpen ").datepicker("setDate", $scope.EmploymentInfo.SiteArray[0].START_DATE);
            //$scope.$parent.$parent.DateInputLoad();
        }
    }

    $scope.SET_PROBATION_DATE_Fn = function (hiringDate) {
        const currentDate = new Date(hiringDate);
        currentDate.setDate(currentDate.getDate() - 1);
        $scope.EmploymentInfo.SET_PROBATION_END_DATE = moment(moment(currentDate).add($scope.EmploymentInfo.PROBATION_MONTH, 'M')).format($scope.$parent.CONVERSION_DATE_FORMAT);
        $('.dateinputProbationHire ').datepicker('destroy');
        $scope.dateinputProbationHire();
    }

    $scope.CHECK_DATE_BY_PROBITION = function () {
        if (isDateValidddmmyy($scope.EmploymentInfo.SET_PROBATION_END_DATE) && moment($scope.EmploymentInfo.SET_PROBATION_END_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate() < moment($scope.EmploymentInfo.HIRING_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate()) {
            $scope.$parent.ShowAlertBox("Warning", 'Probation end date should not be less than hiring date.', 3000);
            $scope.EmploymentInfo.SET_PROBATION_END_DATE = '';
        };
    };

    $scope.HRM_GET_EMPLOYEE_DECLARATION();
    $scope.HRM_GET_USER_MANAGEMENT_ACCESS();

    // $scope.HRM_GET_DEPARTMENTS();
    // $scope.HRM_GET_POSITIONS();
    $scope.HRM_GET_SECTIONS();
    $scope.GET_CUSTOMER_SETTINGS();
    $scope.HRM_GET_EMPLOYEE_TYPES();
    $scope.$parent.$parent.DATE_INPUT_LOAD();



    $scope.GET_UTC_TIME = function () {
        var UserModelObj = new Object();
        UserModelObj.TIMEZONE_OFFSET = "00:00";
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'GET_UTC_TIME').then(function (data) {
            if (data.data != null) {
                $scope.CURRENT_DATE = new Date(data.data);
                $scope.dateinputHireDateddmmyyy();


            }
            if ($scope.CURRENT_DATE == '') {
                $scope.CURRENT_DATE = new Date();
            }
        })
    };
    $scope.GET_UTC_TIME();


    $scope.VALID_REPORTING_MANAGER_SELECTION = function (DDL_FLAG) {
        if ($scope.EmploymentInfo.PRIMARY_REPORTING_MANAGER_ID != '' && $scope.EmploymentInfo.PRIMARY_REPORTING_MANAGER_ID != null) {
            if ($scope.EmploymentInfo.PRIMARY_REPORTING_MANAGER_ID == $scope.EmploymentInfo.PRIMARY_REPORTING_MANAGER_ID && $scope.EmploymentInfo.PRIMARY_REPORTING_MANAGER_ID == $scope.EmploymentInfo.SECONDARY_REPORTING_MANAGER_ID && $scope.EmploymentInfo.PRIMARY_REPORTING_MANAGER_ID == $scope.EmploymentInfo.TERTIARY_REPORTING_MANAGER_ID) {
                $scope.$parent.ShowAlertBox("Attention", 'Reporting Manager on each level should not same', 3000);
                $scope.EmploymentInfo.IS_VALIDATED = false;

            }
            else if ($scope.EmploymentInfo.PRIMARY_REPORTING_MANAGER_ID == $scope.EmploymentInfo.PRIMARY_REPORTING_MANAGER_ID && $scope.EmploymentInfo.PRIMARY_REPORTING_MANAGER_ID == $scope.EmploymentInfo.SECONDARY_REPORTING_MANAGER_ID) {
                $scope.$parent.ShowAlertBox("Attention", 'Reporting Manager on each level should not same', 3000);
                $scope.EmploymentInfo.IS_VALIDATED = false;
            }
            else if ($scope.EmploymentInfo.PRIMARY_REPORTING_MANAGER_ID == $scope.EmploymentInfo.PRIMARY_REPORTING_MANAGER_ID && $scope.EmploymentInfo.PRIMARY_REPORTING_MANAGER_ID == $scope.EmploymentInfo.TERTIARY_REPORTING_MANAGER_ID) {
                $scope.$parent.ShowAlertBox("Attention", 'Reporting Manager on each level should not same', 3000);
                $scope.EmploymentInfo.IS_VALIDATED = false;
            }
            else
                if (($scope.EmploymentInfo.SECONDARY_REPORTING_MANAGER_ID != '' && $scope.EmploymentInfo.SECONDARY_REPORTING_MANAGER_ID != null) && ($scope.EmploymentInfo.TERTIARY_REPORTING_MANAGER_ID != '' && $scope.EmploymentInfo.TERTIARY_REPORTING_MANAGER_ID != null)) {
                    if ($scope.EmploymentInfo.SECONDARY_REPORTING_MANAGER_ID == $scope.EmploymentInfo.SECONDARY_REPORTING_MANAGER_ID && $scope.EmploymentInfo.SECONDARY_REPORTING_MANAGER_ID == $scope.EmploymentInfo.TERTIARY_REPORTING_MANAGER_ID) {
                        $scope.$parent.ShowAlertBox("Attention", 'Reporting Manager on each level should not same', 3000);
                        $scope.EmploymentInfo.IS_VALIDATED = false;
                    }
                    else
                        $scope.EmploymentInfo.IS_VALIDATED = true;
                }
                else {
                    $scope.EmploymentInfo.IS_VALIDATED = true;
                }
        }
        if ($scope.EmploymentInfo.IS_VALIDATED == false) {
            if (DDL_FLAG == 1) {
                $scope.EmploymentInfo.PRIMARY_REPORTING_MANAGER_ID = "";
                $scope.EmploymentInfo.CUSTOM_PRIMARY_REPORTING_MANAGER = $scope.DD_DEFAULT_TEXT;
            } else if (DDL_FLAG == 2) {
                $scope.EmploymentInfo.SECONDARY_REPORTING_MANAGER_ID = "";
                $scope.EmploymentInfo.CUSTOM_SECONDARY_REPORTING_MANAGER = $scope.DD_DEFAULT_TEXT;
            } else if (DDL_FLAG == 3) {
                $scope.EmploymentInfo.TERTIARY_REPORTING_MANAGER_ID = "";
                $scope.EmploymentInfo.CUSTOM_TERTIARY_REPORTING_MANAGER = $scope.DD_DEFAULT_TEXT;
            }
            $scope.EmploymentInfo.IS_VALIDATED = true;
        }

    };
    $scope.LAZY_LOAD_HRM_GET_EMPLOYEE_HISTORY_HEADERS = function () {
        $scope.HRM_GET_EMPLOYEE_HISTORY_HEADERS();
    }

    ////////////////////////////History upcoming update//////////
    $scope.EFFECTIVE_TAB_Fn = function (FLAG) {
        $scope.EFFECTIVE_TAB = FLAG;
    };
    $scope.EFFECTIVE_TAB_Fn(1);

    $scope.HRM_GET_EMPLOYEE_HISTORY_HEADERS = function (FLAG) {
        if (FLAG == 1) {
            $scope.EmploymentInfo.PAGE_NO = 1;
            $scope.EMPLOYEE_HISTORY_HEADERS_LIST = [];
        }

        var EmploymentInfoObject = new Object();
        EmploymentInfoObject.EMPLY_PRSNL_ID = getUrlParameter('EMP_ID', $location.absUrl());
        EmploymentInfoObject.PAGE_NO = $scope.EmploymentInfo.PAGE_NO;
        EmploymentInfoObject.PAGE_SIZE = $scope.EmploymentInfo.PAGE_SIZE;
        EmploymentInfoObject.STEP_NO = 2;
        PrcCommMethods.HUMANRESOURCE_API(EmploymentInfoObject, 'HRM_GET_EMPLOYEE_HISTORY_HEADERS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.EMPLOYEE_HISTORY_HEADERS_LIST = $scope.EMPLOYEE_HISTORY_HEADERS_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.EmploymentInfo.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.EmploymentInfo.PAGE_NO = parseInt($scope.EmploymentInfo.PAGE_NO) + 1;
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
    //data - bs - toggle="modal"
    //data - bs - target="#History_pop" 

    $scope.HRM_GET_EMPLOYEE_HISTORY_DETAILS = function (_history) {
        $scope.SELECTED_UPDATE = _history;
        $scope.IS_HISTORY = true;
        var EmploymentInfoObject = new Object();
        EmploymentInfoObject.HISTORY_HEADER_ID = _history.HISTORY_HEADER_ID
        EmploymentInfoObject.STEP_NO = $scope.STEP_FLAG;
        EmploymentInfoObject.EMPLY_PRSNL_ID = getUrlParameter('EMP_ID', $location.absUrl());;
        PrcCommMethods.HUMANRESOURCE_API(EmploymentInfoObject, 'HRM_GET_EMPLOYEE_HISTORY_DETAILS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.OLD_DATA = angular.copy(data.data.Table[0]);
                $scope.OLD_DATA.CUSTOM_DECLARATION_NAME = data.data.Table[0].STARTER_DECLARATION;
                $scope.OLD_DATA.SiteArray = angular.copy(data.data.Table1);
                $scope.OLD_DATA.CUSTOM_PRIMARY_REPORTING_MANAGER = data.data.Table[0].PRIMARY_REPORTING_MANAGER;
                $scope.OLD_DATA.CUSTOM_SECONDARY_REPORTING_MANAGER = data.data.Table[0].SECONDARY_REPORTING_MANAGER;
                $scope.OLD_DATA.CUSTOM_WORK_PATTERN_TITLE = data.data.Table[0].WORK_PATTERN_TYPE;
                $scope.OLD_DATA.CUSTOM_WORK_PATTERN_TITLE = data.data.Table[0].TITLE;
            }
            if (data.data.Table2.length > 0) {
                $scope.NEW_DATA = data.data.Table2[0];
                $scope.NEW_DATA.SiteArray = data.data.Table3;
            }
            $('#History_pop').modal('show');
        });
    }

    $scope.HRM_EMPLOYEE_GET_UPCOMING_UPDATES = function () {

        $scope.IS_HISTORY = false;
        var EmploymentInfoObject = new Object();
        EmploymentInfoObject.EMPLY_PRSNL_ID = getUrlParameter('EMP_ID', $location.absUrl());
        EmploymentInfoObject.ENTITY_ID = $cookies.get("ENTITY_ID");
        EmploymentInfoObject.STEP_NO = 2;
        PrcCommMethods.HUMANRESOURCE_API(EmploymentInfoObject, 'HRM_EMPLOYEE_GET_UPCOMING_UPDATES').then(function (data) {
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

    $scope.nginitHistorysites = function (_site) {
        //if ($scope.NEW_DATA.SiteArray[index] != undefined) {
        _site.DELETE_FLAG = false;
        var siteresult = $scope.NEW_DATA.SiteArray.filter(function (x) { return x.EMPLOYMENT_INFO_BRANCH_ID == _site.EMPLOYMENT_INFO_BRANCH_ID });
        if (siteresult.length > 0) {
            _site.NEW_DATA = siteresult[0];
            _site.DELETE_FLAG = siteresult[0].DELETE_FLAG == null ? false : true;
        }
        //};
    }
    $scope.HRM_EMPLOYEE_GET_UPCOMING_UPDATE_DETAILS = function (_tabledtls) {
        var EmploymentInfoObject = new Object();
        EmploymentInfoObject.UPDATE_TABLE_ID = _tabledtls.UPDATE_TABLE_ID;
        EmploymentInfoObject.STEP_NO = 2;
        PrcCommMethods.HUMANRESOURCE_API(EmploymentInfoObject, 'HRM_EMPLOYEE_GET_UPCOMING_UPDATE_DETAILS').then(function (data) {
            if (data.data.Table.length > 0) {
                _tabledtls.UPCOMING_DETAILS = data.data.Table;
                $scope.OLD_DATA = angular.copy($scope.EmploymentInfo);// In upcoming case ;
                $scope.NEW_DATA = data.data.Table[0];
                $scope.SELECTED_UPDATE = _tabledtls;

                $('#History_pop').modal('show');
            }
            else {
                _tabledtls.UPCOMING_DETAILS = [];
            }
        });
    };
    $scope.HRM_DISCARD_PENDING_UPDATES = function () {
        var EmploymentInfoObject = new Object();
        EmploymentInfoObject.UPDATE_TABLE_ID = $scope.SELECTED_UPDATE.UPDATE_TABLE_ID;
        EmploymentInfoObject.STEP_NO = 2;
        EmploymentInfoObject.DISCARD_COMMENTS = $scope.DISCARD_COMMENTS;
        PrcCommMethods.HUMANRESOURCE_API(EmploymentInfoObject, 'HRM_DISCARD_PENDING_UPDATES').then(function (data) {
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
        var EmploymentInfoObject = new Object();
        EmploymentInfoObject.UPDATE_TABLE_ID = $scope.SELECTED_UPDATE.UPDATE_TABLE_ID;
        EmploymentInfoObject.STEP_NO = 2;
        EmploymentInfoObject.DISCARD_COMMENTS = $scope.DISCARD_COMMENTS;
        PrcCommMethods.HUMANRESOURCE_API(EmploymentInfoObject, 'HRM_PROCESS_PENDING_UPDATES').then(function (data) {
            if (data.data == 1) {
                $scope.$parent.ShowAlertBox("Success", "Record processed successfully", 3000);
                $('#Process_pop').modal('hide');
                $scope.HRM_EMPLOYEE_GET_UPCOMING_UPDATES();
                $scope.HRM_GET_EMPLOYEE_EMPLOYMENT_INFO();
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
});