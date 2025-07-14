app.controller('GeneralController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(1);
    $scope.HR_COMMON_CODE_Fn();
    $scope.GeneralSearch = {
        CUSTOMER_ID: $cookies.get("CUSTOMER_ID"),
        ENTITY_ID: null,
        USER_ID: $cookies.get("USERID"),
    }
    $scope.PlaceHolder = "Type here...";
    $scope.DD_NO_HOLIDAY_DEFAULT_TEXT = "No holiday"
    $scope.CalendarSearch = {
        CUSTOMER_ID: $cookies.get("CUSTOMER_ID"),
        ENTITY_ID: null,
        MODULE_ID: $cookies.get("MODULE_ID"),
        USER_ID: $cookies.get("USERID"),
        DD_DEFAULT_TEXT: $scope.$parent.DD_DEFAULT_TEXT,
        DD_NO_HOLIDAY_DEFAULT_TEXT: $scope.DD_NO_HOLIDAY_DEFAULT_TEXT,
        HOURS: 8,
        UploadedFiles: [],
    }
    $scope.PermissionSearch = {
        CUSTOMER_ID: $cookies.get("CUSTOMER_ID"),
        ENTITY_ID: null,
        MODULE_ID: $cookies.get("MODULE_ID"),
        USER_ID: $cookies.get("USERID"),
    }
    $scope.NotificationSearch = {
        CUSTOMER_ID: $cookies.get("CUSTOMER_ID"),
        ENTITY_ID: null,
        MODULE_ID: $cookies.get("MODULE_ID"),
        USER_ID: $cookies.get("USERID"),
        DD_DEFAULT_TEXT: $scope.$parent.DD_DEFAULT_TEXT,
        PAGE_NO: 1,
        PAGE_SIZE: 10,
    }
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
    $scope.DEPARTMENTS_LIST = [];
    $scope.FINANCIAL_YEAR_START_MONTH_LIST = [
        { ID: 1, Text: 'January' },
        { ID: 2, Text: 'February' },
        { ID: 3, Text: 'March' },
        { ID: 4, Text: 'April' },
        { ID: 5, Text: 'May' },
        { ID: 6, Text: 'June' },
        { ID: 7, Text: 'July' },
        { ID: 8, Text: 'August' },
        { ID: 9, Text: 'September' },
        { ID: 10, Text: 'October' },
        { ID: 11, Text: 'November' },
        { ID: 12, Text: 'December' }
    ];

    $scope.WEEKDAY_LIST = [
        { "DAY_ID": "0", "DAY_NAME": "SUNDAY" },
        { "DAY_ID": "1", "DAY_NAME": "MONDAY" },
        { "DAY_ID": "2", "DAY_NAME": "TUESDAY" },
        { "DAY_ID": "3", "DAY_NAME": "WEDNESDAY " },
        { "DAY_ID": "4", "DAY_NAME": "THURSDAY " },
        { "DAY_ID": "5", "DAY_NAME": "FRIDAY " },
        { "DAY_ID": "6", "DAY_NAME": "SATURDAY" },
    ];
    $scope.TIME_LIST = [
        { "TIME_ID": "1", "TIME_NAME": "12 Hour " },
        { "TIME_ID": "2", "TIME_NAME": "24 Hour" },
    ];
    $scope.EMAIL_LOG_STATUS_LIST = [
        { "STATUS_ID": "-1", "STATUS_NAME": "NOTIFICATION PREFERENCE OFF" },
        { "STATUS_ID": "-2", "STATUS_NAME": "ENTITY NOT LIVE" },
        { "STATUS_ID": "0", "STATUS_NAME": "PENDING" },
        { "STATUS_ID": "1", "STATUS_NAME": "IN PROCESS" },
        { "STATUS_ID": "2", "STATUS_NAME": "SUCCESS" },
        { "STATUS_ID": "3", "STATUS_NAME": "ERROR" }
    ];
    //$scope.NOTIFICATION_TYPE_LIST = [
    //    { "NOTIFICATION_ID": "1", "NOTIFICATION_NAME": "Leave Request" },
    //    { "NOTIFICATION_ID": "2", "NOTIFICATION_NAME": "Manager notification on leave application" },
    //    { "NOTIFICATION_ID": "3", "NOTIFICATION_NAME": "New Team Member" },
    //    { "NOTIFICATION_ID": "4", "NOTIFICATION_NAME": "Employee Notification for Successful onboarding" },
    //    { "NOTIFICATION_ID": "5", "NOTIFICATION_NAME": "Profile Update" },
    //    { "NOTIFICATION_ID": "6", "NOTIFICATION_NAME": "Event" },
    //];
    $scope.DEPARTMENTS_LIST = [];
    $scope.POSITIONS_LIST = [];
    $scope.SECTIONS_LIST = [];
    $scope.ASSETS_LIST = [];
    $scope.TAGS_LIST = [];
    $scope.BLANK_DEPARTMENT = { DEPARTMENT_ID: 0, DISPLAY_TEXT: '' };
    $scope.BLANK_POSITION = { POSITION_ID: 0, DISPLAY_TEXT: '' };
    $scope.BLANK_SECTION = { SECTION_ID: 0, DISPLAY_TEXT: '' };
    $scope.BLANK_ASSET = { ASSET_ID: 0, DISPLAY_TEXT: '' };
    $scope.BLANK_TAG = { TAG_ID: 0, DISPLAY_TEXT: '' };

    $scope.HRM_GET_DEPARTMENTS = function () {
        $scope.SHOW_WARNING_MESSAGE_FOR_DEPARTMENT = false;
        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_ID = $scope.GeneralSearch.CUSTOMER_ID;
        CusModelObj.ENTITY_ID = null;
        CusModelObj.PAGE_NO = 0;
        CusModelObj.PAGE_SIZE = 0;
        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_GET_DEPARTMENTS').then(function (data) {
            if ($scope.DEPARTMENTS_LIST.length > data.data.Table.length) {
                let lastData = $scope.DEPARTMENTS_LIST[$scope.DEPARTMENTS_LIST.length - 1];
                $scope.DEPARTMENTS_LIST = data.data.Table;
                // $scope.DEPARTMENTS_LIST.push(angular.copy(lastData));

            } else {
                $scope.DEPARTMENTS_LIST = data.data.Table.length > 0 ? data.data.Table : [];
                //$scope.DEPARTMENTS_LIST.push(angular.copy($scope.BLANK_DEPARTMENT));
            }

        });
    }
    $scope.HRM_GET_POSITIONS = function () {
        $scope.SHOW_WARNING_MESSAGE_FOR_POSITION = false;
        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_ID = $scope.GeneralSearch.CUSTOMER_ID;
        CusModelObj.ENTITY_ID = null;
        CusModelObj.PAGE_NO = 0;
        CusModelObj.PAGE_SIZE = 0;
        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_GET_POSITIONS').then(function (data) {
            if ($scope.POSITIONS_LIST.length > data.data.Table.length) {
                let lastData = $scope.POSITIONS_LIST[$scope.POSITIONS_LIST.length - 1];
                $scope.POSITIONS_LIST = data.data.Table;
                //$scope.POSITIONS_LIST.push(angular.copy(lastData));

            } else {
                $scope.POSITIONS_LIST = data.data.Table.length > 0 ? data.data.Table : [];
                // $scope.POSITIONS_LIST.push(angular.copy($scope.BLANK_POSITION));
            }

        });
    }
    $scope.HRM_GET_SECTIONS = function () {
        $scope.SHOW_WARNING_MESSAGE_FOR_SECTION = false;
        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_ID = $scope.GeneralSearch.CUSTOMER_ID;
        CusModelObj.ENTITY_ID = null;
        CusModelObj.PAGE_NO = 0;
        CusModelObj.PAGE_SIZE = 0;
        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_GET_SECTIONS').then(function (data) {
            if ($scope.SECTIONS_LIST.length > data.data.Table.length) {
                let lastData = $scope.SECTIONS_LIST[$scope.SECTIONS_LIST.length - 1];
                $scope.SECTIONS_LIST = data.data.Table;
                //$scope.SECTIONS_LIST.push(angular.copy(lastData));

            } else {
                $scope.SECTIONS_LIST = data.data.Table.length > 0 ? data.data.Table : [];
                //  $scope.SECTIONS_LIST.push(angular.copy($scope.BLANK_SECTION));
            }

        });
    }

    //$scope.NOTIFICATION_TYPE_LIST = [];
    $scope.GET_NOTIFICATIONS_MASTER_BY_MODULE_ID = function () {
        var CusModelObj = new Object();
        CusModelObj.NOTIFICATION_MASTER_ID = $scope.NotificationSearch.MODULE_ID;
        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'GET_NOTIFICATIONS_MASTER_BY_MODULE_ID').then(function (data) {
            $scope.NOTIFICATION_TYPE_LIST = data.data.Table;
        });
    }

    $scope.LAZY_LOAD_EMAIL_LOGS = function () {
        $scope.GET_EMAIL_LOGS();
    }
    $scope.GET_EMAIL_LOGS = function (FLAG) {
        if (FLAG == 1) {
            $scope.NotificationSearch.PAGE_NO = 1;
            $scope.EMAIL_LOGS_LIST = [];
        }
        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_ID = $scope.NotificationSearch.CUSTOMER_ID;
        CusModelObj.MODULE_ID = $scope.NotificationSearch.MODULE_ID;
        CusModelObj.DATE = $scope.NotificationSearch.DATE;
        CusModelObj.STATUS = $scope.NotificationSearch.STATUS;
        CusModelObj.NOTIFICATION_MASTER_ID = $scope.NotificationSearch.NOTIFICATION_MASTER_ID;
        CusModelObj.SETTING_46 = $scope.NotificationSearch.SETTING_46;
        CusModelObj.SEARCH = $scope.NotificationSearch.SEARCH;
        CusModelObj.PAGE_NO = $scope.NotificationSearch.PAGE_NO;
        CusModelObj.PAGE_SIZE = $scope.NotificationSearch.PAGE_SIZE;
        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'GET_EMAIL_LOGS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.EMAIL_LOGS_LIST = $scope.EMAIL_LOGS_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.NotificationSearch.PAGE_SIZE) {
                    $scope.GRID_DATA = false;
                }
                else {
                    $scope.NotificationSearch.PAGE_NO = parseInt($scope.NotificationSearch.PAGE_NO) + 1;
                    $scope.GRID_DATA = true;
                }
            }
            else {
                if ($scope.EMAIL_LOGS_LIST.length == 0) {
                    $scope.LOAD_FETCH_TEXT = 'No records yet!';
                }
                $scope.GRID_DATA = false;
                $scope.$parent.overlay_loadingNew = 'none';
            }
        });
    }
    $scope.SELECTED_DDL_STATUS_Fn = function (_status) {
        if (_status == '') {
            $scope.NotificationSearch.CUSTOM_DDL_STATUS_NAME = $scope.NotificationSearch.DD_DEFAULT_TEXT;
            $scope.NotificationSearch.DDL_STATUS_ID = "";
        }
        else {
            $scope.NotificationSearch.CUSTOM_DDL_STATUS_NAME = _status.STATUS_NAME;
            $scope.NotificationSearch.DDL_STATUS_ID = _status.STATUS_ID;
        }
    }
    $scope.SELECTED_DDL_STATUS_Fn('');
    $scope.SELECTED_DDL_NOTIFICATION_TYPE_Fn = function (_notification) {
        if (_notification == '') {
            $scope.NotificationSearch.CUSTOM_DDL_NOTIFICATION_NAME = $scope.NotificationSearch.DD_DEFAULT_TEXT;
            $scope.NotificationSearch.DDL_NOTIFICATION_ID = "";
        }
        else {
            $scope.NotificationSearch.CUSTOM_DDL_NOTIFICATION_NAME = _notification.NOTIFICATION_NAME;
            $scope.NotificationSearch.DDL_NOTIFICATION_ID = _notification.TABLE_ID;
        }
    }
    $scope.SELECTED_DDL_NOTIFICATION_TYPE_Fn('');
    $scope.getEmailLogFilter = function () {
        let filters = {};
        if ($scope.NotificationSearch.EMAIL_LOGS) {
            filters['USER_NAME'] = $scope.NotificationSearch.EMAIL_LOGS;
        }
        if ($scope.NotificationSearch.DDL_STATUS_ID) {
            filters['STATUS'] = $scope.NotificationSearch.DDL_STATUS_ID;
        }
        if ($scope.NotificationSearch.DDL_NOTIFICATION_ID) {
            filters['ID'] = $scope.NotificationSearch.DDL_NOTIFICATION_ID;
        }
        return filters;
    };

    $scope.dateinputMailLogDate = function () {
        $(document).ready(function () {
            var date_inputs = document.getElementsByClassName("MailLogDate") //our date input has the name "date"
            if (date_inputs.length > 0) {
                for (var i = 0; i < date_inputs.length; i++) {
                    var date_input = $('input[name="' + date_inputs[i].name + '"]'); //our date input has the name "date"
                    var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
                    //var date = new Date();
                    var options = {
                        todayBtn: "linked",
                        daysOfWeekHighlighted: "0,6",
                        autoclose: true,
                        todayHighlight: false,
                        format: 'dd/mm/yyyy',
                        clearBtn: true,
                        closeBtn: true,// close button visible
                        //  startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate())
                    };
                    date_input.datepicker(options);
                }
            }
        });
    }
    $scope.HRM_GET_ASSETS = function () {
        $scope.SHOW_WARNING_MESSAGE_FOR_ASSET = false;
        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_ID = $scope.GeneralSearch.CUSTOMER_ID;
        CusModelObj.ENTITY_ID = null;
        CusModelObj.PAGE_NO = 0;
        CusModelObj.PAGE_SIZE = 0;
        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_GET_ASSETS').then(function (data) {
            if ($scope.ASSETS_LIST.length > data.data.Table.length) {
                let lastData = $scope.ASSETS_LIST[$scope.ASSETS_LIST.length - 1];
                $scope.ASSETS_LIST = data.data.Table;
                //$scope.ASSETS_LIST.push(angular.copy(lastData));

            } else {
                $scope.ASSETS_LIST = data.data.Table.length > 0 ? data.data.Table : [];
                //  $scope.ASSETS_LIST.push(angular.copy($scope.BLANK_ASSET));
            }

        });
    }

    $scope.HRM_GET_TAGS = function () {
        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_ID = $scope.GeneralSearch.CUSTOMER_ID;
        CusModelObj.ENTITY_ID = null;
        CusModelObj.PAGE_NO = 0;
        CusModelObj.PAGE_SIZE = 0;
        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_GET_TAGS').then(function (data) {
            if ($scope.TAGS_LIST.length > data.data.Table.length) {
                let lastData = $scope.TAGS_LIST[$scope.TAGS_LIST.length - 1];
                $scope.TAGS_LIST = data.data.Table;
                // $scope.TAGS_LIST.push(angular.copy(lastData));

            } else {
                $scope.TAGS_LIST = data.data.Table.length > 0 ? data.data.Table : [];
                // $scope.TAGS_LIST.push(angular.copy($scope.BLANK_TAG));
            }

        });
    }



    $scope.ADMIN_GET_ENTITY_LIST = function () {
        var UserModelObj = new Object();
        UserModelObj.CUSTOMER_ID = $scope.GeneralSearch.CUSTOMER_ID;
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'ADMIN_GET_ENTITY_LIST').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.HR_ENTITY_DTLS = data.data.Table[0];
            }
            else if (data.data == null) {
                $scope.$parent.ShowAlert("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
        });
    }
    //Calender Tab
    $scope.HRM_GET_HOLIDAY_CALENDARS = function () {
        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_ID = $scope.GeneralSearch.CUSTOMER_ID;
        CusModelObj.ENTITY_ID = $scope.GeneralSearch.ENTITY_ID;
        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_GET_HOLIDAY_CALENDARS').then(function (data) {
            $scope.HOLIDAY_CALENDARS_LIST = data.data.Table;
        });
    }
    //$scope.ORGANISATION_PERMISSIONS_LIST = [];
    ///Permission
    $scope.HRM_GET_ORGANISATION_PERMISSIONS = function () {
        var UserModelObj = new Object();
        UserModelObj.CUSTOMER_ID = $scope.PermissionSearch.CUSTOMER_ID;
        UserModelObj.ADMIN_ENTITY_ID = $scope.PermissionSearch.ENTITY_ID;
        UserModelObj.MODULE_ID = $scope.PermissionSearch.MODULE_ID;
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'HRM_GET_ORGANISATION_PERMISSIONS').then(function (data) {
            if (data.data.Table.length > 0) {
                angular.forEach(data.data.Table, function (val) {
                    if (val.ACTIVE == 1) {
                        val.ACTIVE = true;
                    } else {
                        val.ACTIVE = false;
                    }
                })
                $scope.ORGANISATION_PERMISSIONS_LIST = data.data.Table;
            }
            else if (data.data == null) {
                $scope.$parent.ShowAlert("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
        });
    }

    ///Notifications
    $scope.GET_CUSTOMERS_NOTIFICATIONS = function () {
        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_ID = $scope.NotificationSearch.CUSTOMER_ID;
        CusModelObj.ENTITY_ID = $scope.NotificationSearch.ENTITY_ID;
        CusModelObj.MODULE_ID = $scope.NotificationSearch.MODULE_ID;
        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'GET_CUSTOMERS_NOTIFICATIONS').then(function (data) {
            $scope.CUSTOMERS_NOTIFICATIONS_LIST = data.data.Table;
        });
    }

    //Calender Tab
    $scope.HRM_GET_HOLIDAY_CALENDAR_BRANCH_MAPPING = function () {
        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_ID = $scope.GeneralSearch.CUSTOMER_ID;
        CusModelObj.ENTITY_ID = $scope.GeneralSearch.ENTITY_ID;
        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_GET_HOLIDAY_CALENDAR_BRANCH_MAPPING').then(function (data) {
            $scope.HOLIDAY_CALENDAR_BRANCH_MAPPING = data.data.Table;
            $scope.HRM_GET_HOLIDAY_CALENDARS();
        });
    }

    $scope.HRM_GET_DEPARTMENT_SUGGESTIONS = function () {
        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_ID = $scope.GeneralSearch.CUSTOMER_ID;
        CusModelObj.ENTITY_ID = null;
        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_GET_DEPARTMENT_SUGGESTIONS').then(function (data) {
            $scope.DEPARTMENT_SUGGESTIONS_LIST = data.data.Table;


        });
    }
    $scope.HRM_GET_POSITIONS_SUGGESTIONS = function () {
        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_ID = $scope.GeneralSearch.CUSTOMER_ID;
        CusModelObj.ENTITY_ID = null;
        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_GET_POSITIONS_SUGGESTIONS').then(function (data) {
            $scope.POSITIONS_SUGGESTIONS_LIST = data.data.Table;
        });
    }
    $scope.HRM_GET_SECTIONS_SUGGESTIONS = function () {
        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_ID = $scope.GeneralSearch.CUSTOMER_ID;
        CusModelObj.ENTITY_ID = null;
        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_GET_SECTIONS_SUGGESTIONS').then(function (data) {
            $scope.SECTIONS_SUGGESTIONS_LIST = data.data.Table;
        });
    }
    $scope.HRM_GET_ASSETS_SUGGESTIONS = function () {
        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_ID = $scope.GeneralSearch.CUSTOMER_ID;
        CusModelObj.ENTITY_ID = null;
        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_GET_ASSETS_SUGGESTIONS').then(function (data) {
            $scope.ASSETS_SUGGESTIONS_LIST = data.data.Table;
        });
    }
    $scope.HRM_GET_TAGS_SUGGESTIONS = function () {
        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_ID = $scope.GeneralSearch.CUSTOMER_ID;
        CusModelObj.ENTITY_ID = null;
        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_GET_TAGS_SUGGESTIONS').then(function (data) {
            $scope.TAGS_SUGGESTIONS_LIST = data.data.Table;
        });
    }

    $scope.$on('ngRepeatFinishedEntityRender', function (ngRepeatFinishedEvent) {

    });
    $scope.HRM_GET_DEPARTMENTS();
    $scope.HRM_GET_POSITIONS();
    $scope.HRM_GET_SECTIONS();
    $scope.HRM_GET_ASSETS();
    $scope.HRM_GET_TAGS();
    $scope.ADMIN_GET_ENTITY_LIST();

    $scope.SELECTED_FISCAL_YEAR_Fn = function (_financial_year) {
        $scope.CalendarSearch.CUSTOM_FISCAL_YEAR = _financial_year.YEAR_NAME;
        $scope.CalendarSearch.YEAR_ID = _financial_year.YEAR_ID;
    };



    $scope.HRM_INS_UPD_DEPARTMENTS = function (_param_department, _param_index, _param_call_Flag) {
        $scope.DEPARTMENT_FORM.submitted = true;
        var Valid = 0;
        if (_param_call_Flag == 1 && _param_department.DEPARTMENT_ID == undefined) {
            angular.forEach($scope.DEPARTMENTS_LIST, function (_param) {
                if (_param.DEPARTMENT_ID != 0) {
                    if (_param.DEPARTMENT_NAME == _param_department.DEPARTMENT_NAME) {
                        Valid++;
                    }
                }
            })
        }
        var _var_confirm_msg = true;
        if (_param_call_Flag == 2) {
            //_var_confirm_msg = confirm('Are you sure, do you want to proceed?')
        }

        if (_var_confirm_msg && _param_department.DEPARTMENT_NAME !== "" && _param_department.DEPARTMENT_NAME !== undefined) {
            if (_param_call_Flag == 2 || Valid == 0) {
                var CusModelObj = new Object();
                CusModelObj.DEPARTMENT_ID = _param_department.DEPARTMENT_ID;
                CusModelObj.DEPARTMENT_NAME = _param_department.DEPARTMENT_NAME;
                CusModelObj.CUSTOMER_ID = $scope.GeneralSearch.CUSTOMER_ID;
                CusModelObj.ENTITY_ID = $scope.GeneralSearch.ENTITY_ID;
                CusModelObj.ACTIVE = _param_call_Flag == 2 ? 0 : 1;
                CusModelObj.USER_ID = $scope.GeneralSearch.USER_ID;
                PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_INS_UPD_DEPARTMENTS').then(function (data) {
                    if (data.data > 0) {
                        if (_param_department.DEPARTMENT_ID == 0 && _param_call_Flag == 1) {
                            $scope.$parent.ShowAlertBox("Success", 'Department added successfully', 3000);
                        }
                        else if (_param_department.DEPARTMENT_ID > 0 && _param_call_Flag == 1) {
                            $scope.$parent.ShowAlertBox("Success", 'Department updated successfully', 3000);
                        }
                        else if (_param_department.DEPARTMENT_ID > 0 && _param_call_Flag == 2) {
                            $scope.$parent.ShowAlertBox("Success", 'Department Deleted successfully', 3000);
                        }
                        $scope.HRM_GET_DEPARTMENTS();
                        _param_department.DEPARTMENT_NAME = "";
                        $scope.DEPARTMENT_FORM.submitted = false;
                    }
                    else if (data.data < 0) {
                        $scope.$parent.ShowAlertBox("Attention", 'Already Added', 3000);
                        //$scope.HRM_GET_DEPARTMENTS();
                    }
                    if (data.data == 0) {
                        $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                    }
                });
            }
        }
        if (_param_department.DEPARTMENT_NAME == undefined || _param_department.DEPARTMENT_NAME == null || _param_department.DEPARTMENT_NAME == "") {
            $scope.$parent.ShowAlertBox("Error", 'Please enter a valuable information', 3000);
        };
        if (Valid > 0) {
            $scope.$parent.ShowAlertBox("Attention", _param_department.DEPARTMENT_NAME + ' is already saved.Please, save different name.', 3000);
        }
    }
    $scope.HRM_INS_UPD_POSITIONS = function (_param_position, _param_index, _param_call_Flag) {
        $scope.POSITION_FORM.submitted = true;
        var Valid = 0;
        if (_param_call_Flag == 1 && _param_position.POSITION_ID == undefined) {
            angular.forEach($scope.POSITIONS_LIST, function (_param) {
                if (_param.POSITION_ID != 0) {
                    if (_param.POSITION_NAME == _param_position.POSITION_NAME) {
                        Valid++;
                    }
                }
            })
        }
        var _var_confirm_msg = true;
        if (_param_call_Flag == 2) {
            //_var_confirm_msg = confirm('Are you sure, do you want to proceed?')
        }
        if (_var_confirm_msg && _param_position.POSITION_NAME != "" && _param_position.POSITION_NAME != undefined && _param_position.POSITION_NAME != null) {
            if (_param_call_Flag == 2 || Valid == 0) {
                var CusModelObj = new Object();
                CusModelObj.POSITION_ID = _param_position.POSITION_ID;
                CusModelObj.POSITION_NAME = _param_position.POSITION_NAME;
                CusModelObj.CUSTOMER_ID = $scope.GeneralSearch.CUSTOMER_ID;
                CusModelObj.ENTITY_ID = $scope.GeneralSearch.ENTITY_ID;
                CusModelObj.ACTIVE = _param_call_Flag == 2 ? 0 : 1;
                CusModelObj.USER_ID = $scope.GeneralSearch.USER_ID;
                PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_INS_UPD_POSITIONS').then(function (data) {
                    if (data.data > 0) {
                        if (_param_position.POSITION_ID == 0 && _param_call_Flag == 1) {
                            $scope.$parent.ShowAlertBox("Success", 'Position added successfully', 3000);
                        }
                        else if (_param_position.POSITION_ID > 0 && _param_call_Flag == 1) {
                            $scope.$parent.ShowAlertBox("Success", 'Position updated successfully', 3000);
                        }
                        else if (_param_position.POSITION_ID > 0 && _param_call_Flag == 2) {
                            $scope.$parent.ShowAlertBox("Success", 'Position Deleted successfully', 3000);
                        }
                        $scope.HRM_GET_POSITIONS();
                        _param_position.POSITION_NAME = "";
                        $scope.POSITION_FORM.submitted = false;
                    }
                    else if (data.data < 0) {
                        $scope.$parent.ShowAlertBox("Attention", 'Already Added', 3000);
                        //$scope.HRM_GET_POSITIONS();
                    }
                    if (data.data == 0) {
                        $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                    }
                });
            }
        }
        if (_param_position.POSITION_NAME == undefined || _param_position.POSITION_NAME == null || _param_position.POSITION_NAME == "") {
            $scope.$parent.ShowAlertBox("Error", 'Please enter a valuable information', 3000);
        };
        if (Valid > 0) {
            $scope.$parent.ShowAlertBox("Attention", _param_position.POSITION_NAME + ' is already saved.Please, save different name.', 3000);
        }
    }
    $scope.HRM_INS_UPD_SECTIONS = function (_param_section, _param_index, _param_call_Flag) {
        $scope.SECTION_FORM.submitted = true;
        var Valid = 0;
        if (_param_call_Flag == 1 && _param_section.SECTION_ID == undefined) {
            angular.forEach($scope.SECTIONS_LIST, function (_param) {
                if (_param.SECTION_ID != 0) {
                    if (_param.SECTION_NAME == _param_section.SECTION_NAME) {
                        Valid++;
                    }
                }
            })
        }
        var _var_confirm_msg = true;
        if (_param_call_Flag == 2) {
            //_var_confirm_msg = confirm('Are you sure, do you want to proceed?')
        }
        if (_var_confirm_msg && _param_section.SECTION_NAME != "" && _param_section.SECTION_NAME != undefined && _param_section.SECTION_NAME != null) {
            if (_param_call_Flag == 2 || Valid == 0) {
                var CusModelObj = new Object();
                CusModelObj.SECTION_ID = _param_section.SECTION_ID == undefined || _param_section.SECTION_ID == null ? 0 : _param_section.SECTION_ID;
                CusModelObj.SECTION_NAME = _param_section.SECTION_NAME;
                CusModelObj.CUSTOMER_ID = $scope.GeneralSearch.CUSTOMER_ID;
                CusModelObj.ENTITY_ID = $scope.GeneralSearch.ENTITY_ID;
                CusModelObj.ACTIVE = _param_call_Flag == 2 ? 0 : 1;
                CusModelObj.USER_ID = $scope.GeneralSearch.USER_ID;
                PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_INS_UPD_SECTIONS').then(function (data) {
                    if (data.data > 0) {
                        if (_param_section.SECTION_ID == 0 && _param_call_Flag == 1) {
                            $scope.$parent.ShowAlertBox("Success", 'Section added successfully', 3000);
                        }
                        else if (_param_section.SECTION_ID > 0 && _param_call_Flag == 1) {
                            $scope.$parent.ShowAlertBox("Success", 'Section updated successfully', 3000);
                        }
                        else if (_param_section.SECTION_ID > 0 && _param_call_Flag == 2) {
                            $scope.$parent.ShowAlertBox("Success", 'Section Deleted successfully', 3000);
                        }
                        $scope.HRM_GET_SECTIONS();
                        _param_section.SECTION_NAME = '';
                        $scope.SECTION_FORM.submitted = false;

                    }
                    else if (data.data < 0) {
                        $scope.$parent.ShowAlertBox("Attention", 'Already Added', 3000);
                        //$scope.HRM_GET_POSITIONS();
                    }
                    if (data.data == 0) {
                        $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                    }
                });
            }
        }
        if (_param_section.SECTION_NAME == undefined || _param_section.SECTION_NAME == null || _param_section.SECTION_NAME == "") {
            $scope.$parent.ShowAlertBox("Error", 'Please enter a valuable information', 3000);
        };
        if (Valid > 0) {
            $scope.$parent.ShowAlertBox("Attention", _param_section.SECTION_NAME + ' is already saved.Please, save different name.', 3000);
        }
    }
    $scope.HRM_INS_UPD_ASSETS = function (_param_asset, _param_index, _param_call_Flag) {
        $scope.ASSET_FORM.submitted = true;
        var _var_confirm_msg = true;
        var Valid = 0;
        if (_param_call_Flag == 1 && _param_asset.ASSET_ID == undefined) {
            angular.forEach($scope.ASSETS_LIST, function (_param) {
                if (_param.ASSET_ID != 0) {
                    if (_param.ASSET_NAME == _param_asset.ASSET_NAME) {
                        Valid++;
                    }
                }
            })
        }
        if (_param_call_Flag == 2) {
            //_var_confirm_msg = confirm('Are you sure, do you want to proceed?')
        }
        if (_var_confirm_msg && _param_asset.ASSET_NAME !== "" && _param_asset.ASSET_NAME !== undefined && _param_asset.ASSET_NAME !== null) {
            if (_param_call_Flag == 2 || Valid == 0) {
                var CusModelObj = new Object();
                CusModelObj.ASSET_ID = _param_asset.ASSET_ID;
                CusModelObj.ASSET_NAME = _param_asset.ASSET_NAME;
                CusModelObj.CUSTOMER_ID = $scope.GeneralSearch.CUSTOMER_ID;
                CusModelObj.ENTITY_ID = $scope.GeneralSearch.ENTITY_ID;
                CusModelObj.ACTIVE = _param_call_Flag == 2 ? 0 : 1;
                CusModelObj.USER_ID = $scope.GeneralSearch.USER_ID;
                PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_INS_UPD_ASSETS').then(function (data) {
                    if (data.data > 0) {
                        if (_param_asset.ASSET_ID == 0 && _param_call_Flag == 1) {
                            $scope.$parent.ShowAlertBox("Success", 'Asset added successfully', 3000);
                        }
                        else if (_param_asset.ASSET_ID > 0 && _param_call_Flag == 1) {
                            $scope.$parent.ShowAlertBox("Success", 'Asset updated successfully', 3000);
                        }
                        else if (_param_asset.ASSET_ID > 0 && _param_call_Flag == 2) {
                            $scope.$parent.ShowAlertBox("Success", 'Asset Deleted successfully', 3000);
                        }
                        $scope.HRM_GET_ASSETS();
                        _param_asset.ASSET_NAME = '';
                        $scope.ASSET_FORM.submitted = false;
                    }
                    else if (data.data < 0) {
                        $scope.$parent.ShowAlertBox("Attention", 'Already Added', 3000);
                        //$scope.HRM_GET_POSITIONS();
                    }
                    if (data.data == 0) {
                        $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                    }

                });
            }
        }
        if (_param_asset.ASSET_NAME == undefined || _param_asset.ASSET_NAME == null || _param_asset.ASSET_NAME == "") {
            $scope.$parent.ShowAlertBox("Error", 'Please enter a valuable information', 3000);
        };
        if (Valid > 0) {
            $scope.$parent.ShowAlertBox("Attention", _param_asset.ASSET_NAME + ' is already saved.Please, save different name.', 3000);
        }
    }
    $scope.HRM_INS_UPD_TAGS = function (_param_tag, _param_index, _param_call_Flag) {
        $scope.TAG_FORM.submitted = true;
        var Valid = 0;
        if (_param_call_Flag == 1 && _param_tag.TAG_ID == undefined) {
            angular.forEach($scope.TAGS_LIST, function (_param) {
                if (_param.TAG_ID != 0) {
                    if (_param.TAG_NAME == _param_tag.TAG_NAME) {
                        Valid++;
                    }
                }
            })
        }
        var _var_confirm_msg = true;
        if (_param_call_Flag == 2) {
            //_var_confirm_msg = confirm('Are you sure, do you want to proceed?')
        }
        if (_var_confirm_msg && _param_tag.TAG_NAME !== "" && _param_tag.TAG_NAME !== undefined && _param_tag.TAG_NAME !== null) {
            if (_param_call_Flag == 2 || Valid == 0) {
                var CusModelObj = new Object();
                CusModelObj.TAG_ID = _param_tag.TAG_ID;
                CusModelObj.TAG_NAME = _param_tag.TAG_NAME;
                CusModelObj.CUSTOMER_ID = $scope.GeneralSearch.CUSTOMER_ID;
                CusModelObj.ENTITY_ID = $scope.GeneralSearch.ENTITY_ID;
                CusModelObj.ACTIVE = _param_call_Flag == 2 ? 0 : 1;
                CusModelObj.USER_ID = $scope.GeneralSearch.USER_ID;
                PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_INS_UPD_TAGS').then(function (data) {
                    if (data.data > 0) {
                        if (_param_tag.TAG_ID == 0 && _param_call_Flag == 1) {
                            $scope.$parent.ShowAlertBox("Success", 'Tag added successfully', 3000);
                        }
                        else if (_param_tag.TAG_ID > 0 && _param_call_Flag == 1) {
                            $scope.$parent.ShowAlertBox("Success", 'Tag updated successfully', 3000);
                        }
                        else if (_param_tag.TAG_ID > 0 && _param_call_Flag == 2) {
                            $scope.$parent.ShowAlertBox("Success", 'Tag Deleted successfully', 3000);
                        }
                        $scope.HRM_GET_TAGS();
                        _param_tag.TAG_NAME = '';
                        $scope.TAG_FORM.submitted = false;
                    }
                    else if (data.data < 0) {
                        $scope.$parent.ShowAlertBox("Attention", 'Already Added', 3000);
                        //$scope.HRM_GET_POSITIONS();
                    }
                    if (data.data == 0) {
                        $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                    }
                });
            }
        }
        if (_param_tag.TAG_NAME == undefined || _param_tag.TAG_NAME == null || _param_tag.TAG_NAME == "") {
            $scope.$parent.ShowAlertBox("Error", 'Please enter a valuable information', 3000);
        };
        if (Valid > 0) {
            $scope.$parent.ShowAlertBox("Attention", _param_tag.TAG_NAME + ' is already saved.Please, save different name.', 3000);
        }
    }

    //Permission//
    $scope.HRM_INS_UPD_ORGANISATION_PERMISSIONS = function (_param_organisation) {
        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_ID = $scope.PermissionSearch.CUSTOMER_ID;
        CusModelObj.ENTITY_ID = $scope.PermissionSearch.ENTITY_ID;
        CusModelObj.USER_ID = parseInt($cookies.get("USERID"));
        CusModelObj.ACTIVE = _param_organisation.ACTIVE ? 1 : 0;
        CusModelObj.STANDARD_ROLE_ID = _param_organisation.STANDARD_ROLE_ID;
        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_INS_UPD_ORGANISATION_PERMISSIONS').then(function (data) {
            if (data.data == 1) {
                //_param_organisation.ROLE_NAME
                $scope.$parent.ShowAlertBox("Success", 'Permission updated successfully', 3000);
            }
            if (data.data == 0) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
        });
    }

    //Calender Tab//
    $scope.HRM_UPLOAD_HOLIDAY_CALENDAR = function () {
        $scope.Calendarform.submitted = true;
        if ($scope.Calendarform.$valid && $scope.HRM_HOLIDAY_CALENDAR_UPLOAD_TYPE.length > 0) {
            var CusModelObj = new Object();
            CusModelObj.USER_ID = $scope.GeneralSearch.USER_ID;
            CusModelObj.CALENDAR_NAME = $scope.CalendarSearch.CALENDAR_NAME;
            CusModelObj.CUSTOMER_ID = $scope.CalendarSearch.CUSTOMER_ID;
            CusModelObj.ENTITY_ID = $scope.CalendarSearch.ENTITY_ID;
            CusModelObj.UPLOADED_FILEPATH = $scope.CalendarSearch.UploadedFiles[0].ORIGINAL_FILE_NAME + ":;:" + $scope.CalendarSearch.UploadedFiles[0].FILE_PATH + $scope.CalendarSearch.UploadedFiles[0].SERVER_FILE_NAME;
            CusModelObj.HRM_HOLIDAY_CALENDAR_UPLOAD_TYPE = [];
            angular.forEach($scope.HRM_HOLIDAY_CALENDAR_UPLOAD_TYPE, function (_loop_val) {
                var readonly = new Object()
                readonly.EVENT_DATE = moment(_loop_val.EVENT_DATE, "DD/MM/YYYY").format('L');
                readonly.EVENT_NAME = _loop_val.EVENT_NAME;
                CusModelObj.HRM_HOLIDAY_CALENDAR_UPLOAD_TYPE.push(readonly);
            });
            PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_UPLOAD_HOLIDAY_CALENDAR').then(function (data) {
                $('#Upload_Calendar').modal('hide');
                $scope.$parent.ShowAlertBox("Success", "File upload Successfully", 3000);
                $scope.HRM_GET_HOLIDAY_CALENDARS();
                $scope.CalendarSearch.CALENDAR_NAM = "";
            });
        }
    }

    $scope.INS_UPD_CUSTOMER_SETTINGS = function () {
        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_ID = $scope.CalendarSearch.CUSTOMER_ID;
        CusModelObj.USER_ID = $scope.GeneralSearch.USER_ID;
        //46	Time format // 47	First day of the week //88 Standard Employee Working Hours per Day
        //// CUSTOMER SETTING
        CusModelObj.CUSTOMER_SETTINGS_TYPE = [];
        CusModelObj.BRANCH_TYPE = [];
        CusModelObj.POSITIONS_TYPE = [];
        CusModelObj.DEPARTMENTS_TYPE = [];
        CusModelObj.EMPLOYEES_TYPE = [];
        var readonly = new Object()
        readonly.SETTING_VALUE = $scope.CalendarSearch.TIME_ID;
        readonly.SETTING_MASTER_ID = 46;
        CusModelObj.CUSTOMER_SETTINGS_TYPE.push(readonly);

        var readonly = new Object()
        readonly.SETTING_VALUE = $scope.CalendarSearch.DAY_ID;
        readonly.SETTING_MASTER_ID = 47;
        CusModelObj.CUSTOMER_SETTINGS_TYPE.push(readonly);

        var readonly = new Object()
        readonly.SETTING_VALUE = $scope.CalendarSearch.HOURS.toString();
        readonly.SETTING_MASTER_ID = 88;
        CusModelObj.CUSTOMER_SETTINGS_TYPE.push(readonly);

        var readonly = new Object()
        readonly.SETTING_VALUE = $scope.CalendarSearch.YEAR_ID.toString();
        readonly.SETTING_MASTER_ID = 89;
        CusModelObj.CUSTOMER_SETTINGS_TYPE.push(readonly);

        let resultobject = $scope.$parent.BLANK_SETTING_OBJECT();
        CusModelObj.BRANCH_TYPE.push(resultobject);
        CusModelObj.POSITIONS_TYPE.push(resultobject);
        CusModelObj.DEPARTMENTS_TYPE.push(resultobject);
        CusModelObj.EMPLOYEES_TYPE.push(resultobject);

        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'INS_UPD_CUSTOMER_SETTINGS').then(function (data) {
            if (data.data == 0) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
            else if (data.data > 0) {
                $scope.$parent.ShowAlertBox("Success", "Saved Successfully", 3000);
                $scope.HRM_GET_HOLIDAY_CALENDAR_BRANCH_MAPPING();
                $scope.$parent.MASTER_GET_CUSTOMER_SETTINGS('46,47,88,89', true, "NO_REDIRECTION");
            }
        });
    }


    //Calender Tab //
    $scope.HRM_INS_UPD_HOLIDAY_CALENDAR_BRANCH_MAPPING = function (DELETE_FLAG) {
        //   $scope.sitecalendarfrom.submitted = true;
        if ($scope.HOLIDAY_CALENDARS_LIST.length > 0) {
            var CusModelObj = new Object();
            CusModelObj.CUSTOMER_ID = $scope.CalendarSearch.CUSTOMER_ID;
            CusModelObj.USER_ID = $scope.GeneralSearch.USER_ID;
            CusModelObj.HRM_HOLIDAY_CALENDAR_BRANCH_MAPPING_TYPE = []
            let selectioncount = 0;
            angular.forEach($scope.HOLIDAY_CALENDAR_BRANCH_MAPPING, function (_loop_val) {
                //if (_loop_val.HOLIDAY_CALENDAR_ID != null && _loop_val.HOLIDAY_CALENDAR_ID != undefined && _loop_val.HOLIDAY_CALENDAR_ID != "") {
                selectioncount = selectioncount + 1;
                var readonly = new Object()
                readonly.TABLE_ID = _loop_val.TABLE_ID;
                readonly.BRANCH_ID = _loop_val.BRANCH_ID;
                readonly.ENTITY_ID = _loop_val.ENTITY_ID == undefined ? null : _loop_val.ENTITY_ID;
                readonly.HLDY_CLNDR_HDR_ID = _loop_val.HOLIDAY_CALENDAR_ID;
                readonly.DELETE_FLAG = DELETE_FLAG == 1 || _loop_val.HOLIDAY_CALENDAR_ID == "" || _loop_val.HOLIDAY_CALENDAR_ID == null || _loop_val.HOLIDAY_CALENDAR_ID == undefined ? 1 : 0;
                CusModelObj.HRM_HOLIDAY_CALENDAR_BRANCH_MAPPING_TYPE.push(readonly);
                // }
            });
            ////46	Time format // 47	First day of the week //88 Standard Employee Working Hours per Day
            ////// CUSTOMER SETTING
            //CusModelObj.CUSTOMER_SETTINGS_TYPE = [];
            //CusModelObj.BRANCH_TYPE = [];
            //CusModelObj.POSITIONS_TYPE = [];
            //CusModelObj.DEPARTMENTS_TYPE = [];
            //CusModelObj.EMPLOYEES_TYPE = [];
            //var readonly = new Object()
            //readonly.SETTING_VALUE = $scope.CalendarSearch.TIME_ID;
            //readonly.SETTING_MASTER_ID = 46;
            //CusModelObj.CUSTOMER_SETTINGS_TYPE.push(readonly);

            //var readonly = new Object()
            //readonly.SETTING_VALUE = $scope.CalendarSearch.DAY_ID;
            //readonly.SETTING_MASTER_ID = 47;
            //CusModelObj.CUSTOMER_SETTINGS_TYPE.push(readonly);

            //var readonly = new Object()
            //readonly.SETTING_VALUE = $scope.CalendarSearch.HOURS.toString();
            //readonly.SETTING_MASTER_ID = 88;
            //CusModelObj.CUSTOMER_SETTINGS_TYPE.push(readonly);

            //let resultobject = $scope.$parent.BLANK_SETTING_OBJECT();
            //CusModelObj.BRANCH_TYPE.push(resultobject);
            //CusModelObj.POSITIONS_TYPE.push(resultobject);
            //CusModelObj.DEPARTMENTS_TYPE.push(resultobject);
            //CusModelObj.EMPLOYEES_TYPE.push(resultobject);

            if (selectioncount > 0 || DELETE_FLAG == 1) {
                PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_INS_UPD_HOLIDAY_CALENDAR_BRANCH_MAPPING').then(function (data) {
                    if (data.data == 0) {
                        $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                    }
                    else if (data.data == 1 && DELETE_FLAG != 1) {
                        $scope.$parent.ShowAlertBox("Success", "Saved Successfully", 3000);
                        $scope.HRM_GET_HOLIDAY_CALENDAR_BRANCH_MAPPING();
                        //$scope.$parent.MASTER_GET_CUSTOMER_SETTINGS('46,47', true,"NO_REDIRECTION");
                    } else if (data.data == 1 && DELETE_FLAG == 1) {
                        $scope.$parent.ShowAlertBox("Success", "Deleted Successfully", 3000);
                        $scope.HRM_GET_HOLIDAY_CALENDAR_BRANCH_MAPPING();
                        //   $scope.$parent.MASTER_GET_CUSTOMER_SETTINGS('46,47', true,"NO_REDIRECTION");
                    }
                });
            }
            if (selectioncount == 0 && DELETE_FLAG != 1) {
                $scope.$parent.ShowAlertBox("Attention", 'Map holiday calendar to your sites', 3000);
            }
        }
        else {
            $scope.$parent.ShowAlertBox("Attention", ' Please, upload at least one holiday calendar to map', 3000);
        }
    }


    $scope.HRM_DEACTIVATE_HOLIDAY_CALENDAR = function () {
        var CusModelObj = new Object();
        CusModelObj.HOLIDAY_CALENDAR_ID = $scope.SELECTED_HOLIDAY.HOLIDAY_CALENDAR_ID;

        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_DEACTIVATE_HOLIDAY_CALENDAR').then(function (data) {
            if (data.data == 0) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
            else if (data.data == 1) {
                $scope.$parent.ShowAlertBox("Success", "Deleted Successfully", 3000);
                $scope.HRM_GET_HOLIDAY_CALENDAR_BRANCH_MAPPING();
            }
        });
    }
    ///Notifications
    $scope.INS_UPD_CUSTOMERS_NOTIFICATIONS = function (_param_notification) {
        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_ID = $scope.NotificationSearch.CUSTOMER_ID;
        CusModelObj.ENTITY_ID = $scope.NotificationSearch.ENTITY_ID;
        CusModelObj.MODULE_ID = $scope.NotificationSearch.MODULE_ID;
        CusModelObj.USER_ID = $scope.NotificationSearch.USER_ID;
        CusModelObj.CUSTOMERS_NOTIFICATIONS_TYPE = [];
        var readonly = new Object();
        readonly.NTFCTN_MSTR_ID = _param_notification.NTFCTN_MSTR_ID;
        readonly.ACTIVE = _param_notification.ACTIVE ? 1 : 0;
        CusModelObj.CUSTOMERS_NOTIFICATIONS_TYPE.push(readonly);
        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'INS_UPD_CUSTOMERS_NOTIFICATIONS').then(function (data) {
            if (data.data == 1) {
                $scope.$parent.ShowAlertBox("Success", 'Notification updated successfully', 3000);
            }
            if (data.data == 0) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
        });
    }

    $scope.REMOVE_UPLOAD_Fn = function (item, index) {
        var CashupModelObj = new Object();
        CashupModelObj.ID = item.UPLOAD_ID;
        PrcCommMethods.CASHUP_API(CashupModelObj, 'DELETE_UPLOAD').then(function (data) {
            angular.element("input[id=HR_HolidayCalendaruploadExcel1]").val(null);
            $scope.$parent.ShowAlertBox('Success', 'Removed Successfully', 5000);
            $scope.CalendarSearch.UploadedFiles = [];
        });
    };

    $scope.OR_TAB_CLICK_Fn = function (TAB_ID) {
        $scope.TAB_ID = TAB_ID;
        if (TAB_ID == 2) {

            $scope.HRM_GET_HOLIDAY_CALENDAR_BRANCH_MAPPING();
        }
        else if (TAB_ID == 3) {
            $scope.dateinputMailLogDate();
            $scope.GET_CUSTOMERS_NOTIFICATIONS();
            $scope.GET_NOTIFICATIONS_MASTER_BY_MODULE_ID();
            $scope.GET_EMAIL_LOGS(1);
        }
        else if (TAB_ID == 4) {
            $scope.HRM_GET_ORGANISATION_PERMISSIONS();
        };

    }
    $scope.OR_TAB_CLICK_Fn(1);




    $scope.ADD_MORE_DEPARTMENT_Fn = function () {
        $scope.DEPARTMENTS_LIST.push(angular.copy($scope.BLANK_DEPARTMENT));
        $scope.HRM_GET_SECTIONS_SUGGESTIONS();
    };
    $scope.ADD_MORE_POSITION_Fn = function () {
        $scope.POSITIONS_LIST.push(angular.copy($scope.BLANK_POSITION));
    };
    $scope.ADD_MORE_SECTION_Fn = function () {
        $scope.SECTIONS_LIST.push(angular.copy($scope.BLANK_SECTION));
    };
    $scope.ADD_MORE_ASSETS_Fn = function () {
        $scope.ASSETS_LIST.push(angular.copy($scope.BLANK_ASSET));
    }
    $scope.ADD_MORE_TAGS_Fn = function () {
        $scope.TAGS_LIST.push(angular.copy($scope.BLANK_TAG));
    }

    //calendar//
    $scope.SELECTED_TIME_Fn = function (_param_calendar) {
        if (_param_calendar == '') {
            $scope.CalendarSearch.CUSTOM_TIME_NAME = $scope.CalendarSearch.DD_DEFAULT_TEXT;
        }
        else {
            $scope.CalendarSearch.CUSTOM_TIME_NAME = _param_calendar.TIME_NAME;
            $scope.CalendarSearch.TIME_ID = _param_calendar.TIME_ID;
        }
    }
    //calendar//
    $scope.SELECTED_CALENDAR_Fn = function (_param_holiday, _param_calendar_Mapping) {
        if (_param_holiday == '') {
            _param_calendar_Mapping.CUSTOM_CALENDAR_NAME = $scope.CalendarSearch.DD_NO_HOLIDAY_DEFAULT_TEXT;
            _param_calendar_Mapping.HOLIDAY_CALENDAR_ID = '';
        }
        else {
            _param_calendar_Mapping.CUSTOM_CALENDAR_NAME = _param_holiday.CALENDAR_NAME;
            _param_calendar_Mapping.HOLIDAY_CALENDAR_ID = _param_holiday.HOLIDAY_CALENDAR_ID;
        }
    }
    $scope.SELECTED_WEEK_Fn = function (_param_calendar) {
        if (_param_calendar == '') {
            $scope.CalendarSearch.CUSTOM_DAY_NAME = $scope.CalendarSearch.DD_DEFAULT_TEXT;
        }
        else {
            $scope.CalendarSearch.CUSTOM_DAY_NAME = _param_calendar.DAY_NAME;
            $scope.CalendarSearch.DAY_ID = _param_calendar.DAY_ID;
        }
    }

    //calendar
    $scope.HOLIDAY_CALENDAR = [{ ID: 1, COLUMN_NAME: 'EVENT_DATE', MATCH_COLUMN_NAME: 'EVENT_DATE(DD/MM/YYYY)', IS_MANDATORY: true, HEADER_NAME: 'EVENT_DATE', FIELD_TYPE_ID: 9, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },
    { ID: 2, COLUMN_NAME: 'EVENT_NAME', MATCH_COLUMN_NAME: 'EVENT_NAME', IS_MANDATORY: true, HEADER_NAME: 'EVENT_NAME', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },];

    //calendar

    $scope.nginit_holidayCalendermap = function (_calendar_Mapping) {
        _calendar_Mapping.HOLIDAY_CALENDAR_ID > 0 ? _calendar_Mapping.CUSTOM_CALENDAR_NAME = _calendar_Mapping.CALENDAR_NAME : _calendar_Mapping.CUSTOM_CALENDAR_NAME = $scope.CalendarSearch.DD_NO_HOLIDAY_DEFAULT_TEXT;
    }
    //calendar
    $scope.DOWNLOAD_CALENDAR_Fn = function () {
        ModelObj = new Object();
        ModelObj.FILE_NAME = "CALENDAR_UPLOAD";
        ModelObj.FILE_PATH = "CALENDAR_UPLOAD";
        ModelObj.EXCEL_DATATABLE = $scope.HOLIDAY_CALENDAR;
        ModelObj.UPLOADE_TYPE_ID = 1;
        PrcCommMethods.HUMANRESOURCE_API(ModelObj, 'DOWNLOAD_HOLIDAY_CALENDAR').then(function (data) {
            $scope.SERVER_FILE_PATH = '/' + data.data.FOLDER_NAME + data.data.RETURN_FILE_NAME;
            $scope.FILE_NAME = ModelObj.FILE_NAME;
            var url = $scope.SERVER_FILE_PATH;
            window.open(url, $scope.FILE_NAME);
        });
    }
    $scope.HRM_HOLIDAY_CALENDAR_UPLOAD_TYPE = [];
    $scope.EXCEL_HOLIDAY_CALENDAR_VALIDATE = function () {
        $scope.$parent.overlay_loadingNew = 'block';
        $scope.INVALID_EXCLE_CELL_FLAG = false;
        $scope.SubmiteUpload = true;
        $scope.COPY_CODE_ARRY = [];
        $scope.CODE_ARRY = [];
        $scope.INVALID_EXCLE_CELL_COUNT = null;
        $scope.HRM_HOLIDAY_CALENDAR_UPLOAD_TYPE = [];
        $scope.INVALID_INVOICE_CONTACT_LIST = [];
        $scope.ERROR_LIST = [];
        if ($scope.CalendarSearch.UploadedFiles != undefined && $scope.CalendarSearch.UploadedFiles.length > 0 || document.getElementById('HR_HolidayCalendaruploadExcel1').value != null && document.getElementById('HR_HolidayCalendaruploadExcel1').value != '') {
            ModelObj = new Object();
            ModelObj.UPLOAD_TYPE_ID = 1;
            ModelObj.SERVER_FILE_NAME = $scope.CalendarSearch.UploadedFiles[0].SERVER_FILE_NAME;
            ModelObj.ORIGINAL_FILE_NAME = $scope.CalendarSearch.UploadedFiles[0].ORIGINAL_FILE_NAME;
            ModelObj.FILE_PATH = $scope.CalendarSearch.UploadedFiles[0].FILE_PATH + $scope.CalendarSearch.UploadedFiles[0].SERVER_FILE_NAME;
            // ModelObj.DATETIME_FORMAT_CULTURE = ["MM/dd/yyyy hh:mm:ss tt", "M/d/yyyy hh:mm:ss tt", "MM/dd/yyyy", "M/d/yyyy"];
            ModelObj.DATETIME_FORMAT_CULTURE = $scope.$parent.DATE_FORMATE_CULTURE;
            ModelObj.LANGUAGE_SYMBOL = $scope.$parent.LANGUAGE_SYMBOL;
            ModelObj.FROM_DATE = $scope.CalendarSearch.FROM_DATE;
            ModelObj.TO_DATE = $scope.CalendarSearch.TO_DATE;
            ModelObj.EXCEL_DATATABLE = $scope.HOLIDAY_CALENDAR;
            PrcCommMethods.HUMANRESOURCE_API(ModelObj, 'EXCEL_HOLIDAY_CALENDAR_VALIDATE').then(function (data) {
                $scope.HRM_HOLIDAY_CALENDAR_UPLOAD_TYPE = [];
                $scope.submitted = true;
                $scope.INVALID_EXCLE_CELL_COUNT = null;
                $scope.INVALID_HOLIDAY_CALENDAR_LIST = [];
                $scope.ERROR_LIST = data.data.errorlogobj;
                $scope.CalendarSearch.MAX_DATE = new Date(data.data.MAX_DATE);
                $scope.CalendarSearch.MIN_DATE = new Date(data.data.MIN_DATE);
                if ($scope.ERROR_LIST.length == 0) {
                    if (data.data.IS_VALID_COUNT > 0) {
                        $scope.INVALID_EXCLE_CELL_COUNT = parseInt(data.data.IS_VALID_COUNT);
                        $scope.INVALID_EXCLE_CELL_FLAG = true;
                        $scope.INVALID_HOLIDAY_CALENDAR_LIST = data.data.HEADER_CLOUMN_NAMES;
                        $('#View_Report').modal('show');
                        $scope.$parent.overlay_loadingNew = 'none';
                        angular.element("input[id=HR_HolidayCalendaruploadExcel1]").val(null);
                        $scope.CalendarSearch.UploadedFiles = [];
                    }
                    else if (data.data.error == "CODE_MAX001") {
                        $scope.CalendarSearch.UploadedFiles = [];
                        $scope.$parent.ShowAlertBox('Error', 'Please select correct From Date ', 1000);
                        angular.element("input[id=HR_HolidayCalendaruploadExcel1]").val(null);
                    }
                    else if (data.data.error == "CODE_MIN001") {
                        $scope.CalendarSearch.UploadedFiles = [];
                        $scope.$parent.ShowAlertBox('Error', 'Please select correct From Date ', 1000);
                        angular.element("input[id=HR_HolidayCalendaruploadExcel1]").val(null);
                    }
                    else if (data.data.error == "CODE_DUP001") {
                        $scope.CalendarSearch.UploadedFiles = [];
                        $scope.$parent.ShowAlertBox('Warning', 'Duplicate invoice and supplier found', 3000);
                        $scope.submitted = false;
                        $scope.IS_VALID_UPLOAD_FILE = false;
                        $scope.HRM_HOLIDAY_CALENDAR_UPLOAD_TYPE = data.data.HEADER_CLOUMN_NAMES;
                        $scope.DUPLICATE_HRM_HOLIDAY_CALENDAR_UPLOAD_TYPE = data.data.DUPLICATE_DTLS;
                        angular.element("input[id=HR_HolidayCalendaruploadExcel1]").val(null);
                    }
                    else if (data.data.error == "CODE0001") {
                        $scope.CalendarSearch.UploadedFiles = [];
                        $scope.$parent.ShowAlertBox('Warning', 'No changes found in uploaded Excel', 3000);
                        $scope.submitted = false;
                        $scope.IS_VALID_UPLOAD_FILE = false;
                        angular.element("input[id=HR_HolidayCalendaruploadExcel1]").val(null);
                    }
                    else if (data.data.error == "CODE0003") {
                        $scope.CalendarSearch.UploadedFiles = [];
                        angular.element("input[id=HR_HolidayCalendaruploadExcel1]").val(null);
                        $scope.$parent.ShowAlertBox('Warning', 'Some thing wrong in excel or Enable editing mode in excel', 3000);
                        $scope.submitted = false;
                        $scope.IS_VALID_UPLOAD_FILE = false;
                        if (data.data.Msg == 'A malformed URI was found in the document. Please provide a OpenSettings.RelationshipErrorRewriter to handle these errors while opening a package.') {
                            $scope.Message = "";
                            var List = { DISPLAY_TEXT: "", IS_VALID: false, IS_DATA_VALID: true, CODE: "CODE0003" };
                            $scope.CODE_ARRY.push(List);
                            $scope.COPY_CODE_ARRY.push(List);
                        };
                    }
                    else if (data.data.error == "CODE0002") {
                        $scope.CalendarSearch.UploadedFiles = [];
                        angular.element("input[id=HR_HolidayCalendaruploadExcel1]").val(null);
                        $scope.$parent.ShowAlertBox('Warning', 'Invalid Excel,either the column header is deleted or mismatch', 3000);
                        $scope.submitted = false;
                        $scope.IS_VALID_UPLOAD_FILE = false;
                    }
                    else if (data.data.HEADER_CLOUMN_NAMES.length == 0) {
                        $scope.$parent.ShowAlertBox('Warning', 'No record found', 3000);
                        $scope.submitted = false;
                        $scope.IS_VALID_UPLOAD_FILE = false;
                        angular.element("input[id=HR_HolidayCalendaruploadExcel1]").val(null);
                    }
                    else {
                        $scope.HRM_HOLIDAY_CALENDAR_UPLOAD_TYPE = data.data.HEADER_CLOUMN_NAMES;
                        $scope.INVALID_EXCLE_CELL_FLAG = false;
                        $scope.INVALID_EXCLE_CELL_COUNT = parseInt(data.data.IS_VALID_COUNT);
                        $scope.$parent.ShowAlertBox('Success', 'File validated successfully,please click on upload', 5000);
                        // $scope.INS_INV_RECO_UPLOAD();
                        angular.element("input[id=HR_HolidayCalendaruploadExcel1]").val(null);
                    }
                }
                else {
                    $scope.HRM_HOLIDAY_CALENDAR_UPLOAD_TYPE = data.data.HEADER_CLOUMN_NAMES;
                    $scope.$parent.overlay_loadingNew = 'none';
                }
            });
        }
        else {
            $scope.$parent.ShowAlertBox('Attention', 'Please Upload File', 3000);
        }
    };
    $scope.COPY_CODE_ARRY = [];
    $scope.CODE_ARRY = [];
    $scope.$on('ngRepeatFinishedRender', function (ngRepeatFinishedEvent) {
        $scope.CODE_ARRY = $scope.COPY_CODE_ARRY;
    });
    $scope.$on('ngRepeatFinishedRender', function (ngRepeatFinishedEvent) {
        $scope.COMMON_CODE_CHANGE();
    });
    $scope.ngintvalidationvalue = function (key, value) {
        var List
        if (value == "<i class='fa fa-exclamation-triangle text-danger'></i>") {
            List = { DISPLAY_TEXT: "", IS_VALID: true, CODE: 'BLANK' };
            $scope.COPY_CODE_ARRY.push(List);
        }
        else {
            if (key == "COMMENTS") {

            }
            var val = value.split(':;:');
            if (val.length > 1) {
                if (val[1] == "DDL0004") {
                    List = { DISPLAY_TEXT: val[0], IS_VALID: false, IS_DATA_VALID: true, CODE: val[1], Suggestion: val, D_COLUMN_NAME: val[2] };
                    $scope.COPY_CODE_ARRY.push(List);
                }
                else if (val[0] == "UPLOAD0001") {
                    List = { DISPLAY_TEXT: value, IS_VALID: false };
                }
                else {
                    List = { DISPLAY_TEXT: val[0], IS_VALID: false, IS_DATA_VALID: true, CODE: val[1], Suggestion: val };
                    $scope.COPY_CODE_ARRY.push(List);
                }
            }
            else {
                if (key == "NI Number" && value != '' || key == "NI Number*" && value != '') {
                    const repeatRegex = /^[A-CEGHJ-PR-TW-Z]{1}[A-CEGHJ-NPR-TW-Z]{1}[0-9]{6}[A-D]{1}$/i;
                    var found = value.match(repeatRegex);
                    if (found == null) {
                        List = { DISPLAY_TEXT: value, IS_VALID: false, IS_DATA_VALID: true, CODE: "INVALID0011" };
                        $scope.COPY_CODE_ARRY.push(List);
                    }
                    else {
                        List = { DISPLAY_TEXT: value, IS_VALID: false };
                    }
                }
                else {
                    List = { DISPLAY_TEXT: value, IS_VALID: false };
                }
            }
        }
        return List;
    };

    $scope.CLOSE_Fn = function () {
        $('#View_Report').modal('hide');
    }
    $scope.SHOW_WARNING_MESSAGE_FOR_DEPARTMENT = false;
    $scope.SHOW_WARNING_MESSAGE_FOR_POSITION = false;
    $scope.SHOW_WARNING_MESSAGE_FOR_SECTION = false;
    $scope.SHOW_WARNING_MESSAGE_FOR_ASSET = false;
    $scope.MAPPED_EMPLOYEE_DEPARTMENT_COUNT = 0;
    $scope.MAPPED_EMPLOYEE_POSITION_COUNT = 0;
    $scope.MAPPED_EMPLOYEE_SECTION_COUNT = 0;
    $scope.MAPPED_EMPLOYEE_ASSET_COUNT = 0;
    // checking if Employee mapeed
    $scope.HRM_GET_EMPLOYEE_COUNT_FOR_DEPT_POS_SEC_ASET = function (RELATIVE_ID, FLAG) {
        var CusModelObj = new Object();

        CusModelObj.RELATIVE_ID = RELATIVE_ID;
        CusModelObj.FLAG = FLAG;
        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_GET_EMPLOYEE_COUNT_FOR_DEPT_POS_SEC_ASET').then(function (data) {
            if (data.data.Table.length > 0) {
                // DEPARTMENT
                if (FLAG == 1 && data.data.Table[0].DEPARTMENT_COUNT > 0) {
                    $scope.MAPPED_EMPLOYEE_DEPARTMENT_COUNT = data.data.Table[0].DEPARTMENT_COUNT;
                    $scope.SHOW_WARNING_MESSAGE_FOR_DEPARTMENT = true;
                }
                // POSITION
                if (FLAG == 2 && data.data.Table[0].POSITION_COUNT > 0) {
                    $scope.MAPPED_EMPLOYEE_POSITION_COUNT = data.data.Table[0].POSITION_COUNT;
                    $scope.SHOW_WARNING_MESSAGE_FOR_POSITION = true;
                }
                //SECTION
                if (FLAG == 3 && data.data.Table[0].SECTION_COUNT > 0) {
                    $scope.MAPPED_EMPLOYEE_SECTION_COUNT = data.data.Table[0].SECTION_COUNT;
                    $scope.SHOW_WARNING_MESSAGE_FOR_SECTION = true;
                }
                // ASSET
                if (FLAG == 4 && data.data.Table[0].ASSETS_COUNT > 0) {
                    $scope.MAPPED_EMPLOYEE_ASSET_COUNT = data.data.Table[0].ASSETS_COUNT;
                    $scope.SHOW_WARNING_MESSAGE_FOR_ASSET = true;
                }
            } else {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
        });

    }

    $scope.EDIT_DEPARTMENT_Fn = function (_param_department, index) {
        $scope.HRM_GET_EMPLOYEE_COUNT_FOR_DEPT_POS_SEC_ASET(_param_department.DEPARTMENT_ID, 1);
        _param_department.HIDE_SHOW = !_param_department.HIDE_SHOW;
        $scope.HRM_GET_DEPARTMENT_SUGGESTIONS();
    };
    $scope.EDIT_POSITION_Fn = function (_param_position, index) {
        $scope.HRM_GET_EMPLOYEE_COUNT_FOR_DEPT_POS_SEC_ASET(_param_position.POSITION_ID, 2);
        _param_position.HIDE_SHOW = !_param_position.HIDE_SHOW;
        $scope.HRM_GET_POSITIONS_SUGGESTIONS();
    };

    $scope.EDIT_SECTION_Fn = function (_param_section, index) {
        $scope.HRM_GET_EMPLOYEE_COUNT_FOR_DEPT_POS_SEC_ASET(_param_section.SECTION_ID, 3);
        _param_section.HIDE_SHOW = !_param_section.HIDE_SHOW;
        $scope.HRM_GET_SECTIONS_SUGGESTIONS();
    };

    $scope.EDIT_ASSETS_Fn = function (_param_asset, index) {
        $scope.HRM_GET_EMPLOYEE_COUNT_FOR_DEPT_POS_SEC_ASET(_param_asset.ASSET_ID, 4);
        _param_asset.HIDE_SHOW = !_param_asset.HIDE_SHOW;
        $scope.HRM_GET_ASSETS_SUGGESTIONS();
    }
    $scope.EDIT_TAGS_Fn = function (_param_tag, index) {
        _param_tag.HIDE_SHOW = !_param_tag.HIDE_SHOW;
        $scope.HRM_GET_TAGS_SUGGESTIONS();
    }

    $scope.DELETE_DEPARTMENT_Fn = function (_param_department, index) {
        $scope.SELECTED_DEPARTMENT = _param_department;
        var CusModelObj = new Object();
        CusModelObj.RELATIVE_ID = _param_department.DEPARTMENT_ID;
        CusModelObj.FLAG = 1;
        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_GET_EMPLOYEE_COUNT_FOR_DEPT_POS_SEC_ASET').then(function (data) {
            if (data.data.Table.length > 0) {
                if (data.data.Table[0].DEPARTMENT_COUNT > 0) {
                    $scope.$parent.ShowAlertBox("Attention", _param_department.DEPARTMENT_NAME + ' Department are not deleted because this department its already schedule in employee.', 3000);
                } else {
                    $scope.SELECTED_DEPARTMENT.MESSAGE = "It is safe to perform this operation as it hasn't been assigned to any employee. Do you want to proceed?";
                    $('#Delete_Department').modal('show');
                }
            } else {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
        });

    }
    $scope.DELETE_POSITION_Fn = function (_param_position, index) {
        $scope.SELECTED_POSITION = _param_position;
        var CusModelObj = new Object();
        CusModelObj.RELATIVE_ID = _param_position.POSITION_ID;
        CusModelObj.FLAG = 2;
        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_GET_EMPLOYEE_COUNT_FOR_DEPT_POS_SEC_ASET').then(function (data) {
            if (data.data.Table.length > 0) {
                if (data.data.Table[0].POSITION_COUNT > 0) {
                    $scope.$parent.ShowAlertBox("Attention", _param_position.POSITION_NAME + ' Position are not deleted because this position its already schedule in employee.', 3000);
                } else {
                    $scope.SELECTED_POSITION.MESSAGE = "It is safe to perform this operation as it hasn't been assigned to any employee. Do you want to proceed?";
                    $('#Delete_Position').modal('show');
                }
            } else {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
        });
    }
    $scope.DELETE_SECTION_Fn = function (_param_section, index) {
        $scope.SELECTED_SECTION = _param_section;
        var CusModelObj = new Object();
        CusModelObj.RELATIVE_ID = _param_section.SECTION_ID;
        CusModelObj.FLAG = 3;
        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_GET_EMPLOYEE_COUNT_FOR_DEPT_POS_SEC_ASET').then(function (data) {
            if (data.data.Table.length > 0) {
                if (data.data.Table[0].SECTION_COUNT > 0) {
                    $scope.$parent.ShowAlertBox("Attention", _param_section.SECTION_NAME + ' Section are not deleted because this Section its already schedule in employee.', 3000);
                } else {
                    $scope.SELECTED_SECTION.MESSAGE = "It is safe to perform this operation as it hasn't been assigned to any employee. Do you want to proceed?";
                    $('#Delete_Section').modal('show');
                }
            } else {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
        });

    }
    $scope.DELETE_ASSET_Fn = function (_param_asset, index) {
        $scope.SELECTED_ASSET = _param_asset;
        var CusModelObj = new Object();
        CusModelObj.RELATIVE_ID = _param_asset.ASSET_ID;
        CusModelObj.FLAG = 4;
        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_GET_EMPLOYEE_COUNT_FOR_DEPT_POS_SEC_ASET').then(function (data) {
            if (data.data.Table.length > 0) {
                if (data.data.Table[0].ASSETS_COUNT > 0) {
                    $scope.$parent.ShowAlertBox("Attention", _param_asset.ASSET_NAME + ' Asset are not deleted because this Asset its already schedule in employee.', 3000);
                } else {
                    $scope.SELECTED_ASSET.MESSAGE = "It is safe to perform this operation as it hasn't been assigned to any employee. Do you want to proceed?";
                    $('#Delete_Asset').modal('show');
                }
            } else {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
        });

    }
    $scope.DELETE_TAG_Fn = function (_param_tag) {
        $scope.SELECTED_TAG = _param_tag;
        $scope.SELECTED_TAG.MESSAGE = "It is safe to perform this operation as it hasn't been assigned to any employee. Do you want to proceed?";
        $('#Delete_Tag').modal('show');
    }
    $scope.DELETE_HOLIDAY_CALENDAR_Fn = function (_param_holiday) {
        $scope.SELECTED_HOLIDAY = _param_holiday;
        var CusModelObj = new Object();
        CusModelObj.HOLIDAY_CALENDAR_ID = _param_holiday.HOLIDAY_CALENDAR_ID;
        CusModelObj.ENTITY_ID = $scope.CalendarSearch.ENTITY_ID
        CusModelObj.CUSTOMER_ID = $scope.CalendarSearch.CUSTOMER_ID;
        //CusModelObj.FLAG = 1;
        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_COUNT_HOLIDAY_CALENDAR').then(function (data) {
            if (data.data.Table.length > 0) {
                var Valid = 0; $scope.COUNT_VAL = 0;
                angular.forEach(data.data.Table, function (_count) {
                    if (_count.TABLE_NAME == "TOTAL") {
                        if (_count.RECORD_COUNT > 0) {
                            $scope.COUNT_VAL = _count.RECORD_COUNT;
                            // $scope.$parent.ShowAlertBox("Attention", $scope.SELECTED_HOLIDAY.CALENDAR_NAME + ' Since the holiday calendar is already in use, it cannot be removed.', 3000);
                            Valid++;
                        }
                    }
                });
                $('#Delete_Document').modal('show');
                //if (Valid == 0) {
                //    $('#Delete_Document').modal('show');
                //}

            } else {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
        });
    }
    $scope.HRM_GET_HOLIDAY_CALENDAR_BY_ID = function (_param_holiday) {
        $scope.HOLIDAY_CALENDAR_LIST = [];
        var CusModelObj = new Object();
        CusModelObj.HOLIDAY_CALENDAR_ID = _param_holiday.HOLIDAY_CALENDAR_ID;
        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_GET_HOLIDAY_CALENDAR_BY_ID').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.HOLIDAY_CALENDAR_LIST = data.data.Table;
                $('#Holiday_Calender').modal('show');
            } else {
                $scope.$parent.ShowAlertBox("Attention", 'Record not found.', 3000);
            }
        });
    }


    $scope.UPDATE_FISCAL_YEAR_SETTING_Fn = function () { // only customer setup time it work 
        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_ID = $scope.CalendarSearch.CUSTOMER_ID;
        CusModelObj.USER_ID = $scope.GeneralSearch.USER_ID;
        CusModelObj.CUSTOMER_SETTINGS_TYPE = [];
        CusModelObj.BRANCH_TYPE = [];
        CusModelObj.POSITIONS_TYPE = [];
        CusModelObj.DEPARTMENTS_TYPE = [];
        CusModelObj.EMPLOYEES_TYPE = [];
        var readonly = new Object()
        readonly.SETTING_VALUE = 1;
        readonly.SETTING_MASTER_ID = 89;
        CusModelObj.CUSTOMER_SETTINGS_TYPE.push(readonly);
        let resultobject = $scope.$parent.BLANK_SETTING_OBJECT();
        CusModelObj.BRANCH_TYPE.push(resultobject);
        CusModelObj.POSITIONS_TYPE.push(resultobject);
        CusModelObj.DEPARTMENTS_TYPE.push(resultobject);
        CusModelObj.EMPLOYEES_TYPE.push(resultobject);

        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'INS_UPD_CUSTOMER_SETTINGS').then(function (data) {
            if (data.data == 0) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
            else if (data.data > 0) {
                $scope.$parent.MASTER_GET_CUSTOMER_SETTINGS('89', true, "NO_REDIRECTION");
            }
        });
    };
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
                //   _param_retun_value.CUSTOMER_SETTINGS = data.data.Table;
                angular.forEach(data.data.Table, function (_loop_value) {
                    if (_loop_value.SETTING_MASTER_ID == 46) {
                        //calendar
                        $scope.SELECTED_TIME_Fn($scope.TIME_LIST.filter(function (x) { return x.TIME_ID == parseInt(_loop_value.SETTING_VALUE) })[0]);
                    }
                    else if (_loop_value.SETTING_MASTER_ID == 47) {
                        //calendar
                        $scope.SELECTED_WEEK_Fn($scope.WEEKDAY_LIST.filter(function (x) { return x.DAY_ID == parseInt(_loop_value.SETTING_VALUE) })[0]);
                    }
                    else if (_loop_value.SETTING_MASTER_ID == 88) {
                        //hours
                        $scope.CalendarSearch.HOURS = parseFloat(_loop_value.SETTING_VALUE);
                    }
                    else if (_loop_value.SETTING_MASTER_ID == 89) {
                        if (_loop_value.SETTING_VALUE != undefined && _loop_value.SETTING_VALUE != null && _loop_value.SETTING_VALUE != "") {
                            $scope.CalendarSearch.YEAR_ID = parseFloat(_loop_value.SETTING_VALUE);
                            let fiscalIndex = $scope.FISCAL_YEARS.findIndex(x => x.YEAR_ID == _loop_value.SETTING_VALUE);
                            $scope.SELECTED_FISCAL_YEAR_Fn($scope.FISCAL_YEARS[fiscalIndex]);
                        }
                        else {
                            $scope.UPDATE_FISCAL_YEAR_SETTING_Fn(1);
                        }
                    }
                })
            }
            else if (data.data == 0) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
        });
    }


    $scope.GET_CUSTOMER_SETTINGS($scope.CalendarSearch, '46,47,88,89');
    $scope.$parent.$parent.overlay_loading_HR_Loader = 'none';
    $scope.$parent.$parent.child_scope = $scope;
});