app.controller('PunchHRMClockController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $interval) {
    //$scope.$parent.DISPLAY_FLAG = false;
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(2);
    $scope.TABLE_VIEW_ID = 1;
    $scope.$parent.$parent.overlay_loading_HR_Loader = 'none';
    $scope.HRM_RE_DIRECT = function () {
        window.open('../Plain/Index#!/QR_Code', '_blank');
    }
    if ($scope.$parent.CheckSubModuleAccess(110) == false) {
        //   window.location.href = "../Main/MainIndex";
    }
    localStorage.openpages = Date.now();
    var onLocalStorageEvent = function (e) {
        if (e.key == "openpages") {
            // Emit that you're already available.
            localStorage.page_available = Date.now();
        }
        if (e.key == "page_available") {
            //   alert("One more page already open");
        }
    };
    window.addEventListener('storage', onLocalStorageEvent, false);

    $scope.noBack = function () {
        window.history.forward();
    }
    $scope.noBack();
    $scope.$parent.DISSABLE_WINDOW_ICON = false;
    $scope.ClockInOutSearch = {
        ENTITY_ID: parseInt($cookies.get('ENTITY_ID')),
        PAGE_NO: 1,
        PAGE_NO_LOGS: 1,
        PAGE_SIZE: 10,
        PAGE_SIZE_LOGS: 10,
        BRANCH_ID: 0,
        VALUE_FOR_QR: 0,
        USER_NAME: "",
        PASSWORD: '',
        FIRST_NAME: '-',
        LAST_NAME: '-',
    }
    $scope.COMMON_CODE_CHANGE();
    var TODAY_DAY;
    $scope.$parent.CLOCK_IN_OUT_PAGE_LOAD = 1;
    $scope.ENABLE_QR_CODE_REFRESH = $scope.$parent.MASTER_GET_CUSTOMER_SETTINGS_VALUES(57);
    $scope.SHIFT_LOGIN_TOLERANCE_IN_MINUTES = $scope.$parent.MASTER_GET_CUSTOMER_SETTINGS_VALUES(59);
    //alert($scope.SHIFT_LOGIN_TOLERANCE_IN_MINUTES);
    //    $scope.SETTING_VALUE_25 = $scope.$parent.GET_ENTITY_SETTINGS(25)[0].SETTING_VALUE;
    //  $scope.SETTING_VALUE_36 = $scope.$parent.GET_ENTITY_SETTINGS(36)[0].SETTING_VALUE;
    // $scope.SETTING_VALUE_43 = $scope.$parent.GET_ENTITY_SETTINGS(43)[0].SETTING_VALUE;

    $scope.HRM_GET_EMPLOYEE_STEP = function () {
        var UserModelObj = new Object();
        UserModelObj.EMPLY_PRSNL_ID = parseInt($cookies.get('EMPLY_PRSNL_ID')),
            PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'HRM_GET_EMPLOYEE_STEP').then(function (data) {
                if (data.data.Table.length > 0) {
                    let RESULT_PERSNL = data.data.Table[0];
                    $scope.ClockInOutSearch.BRANCH_ID = RESULT_PERSNL.BRANCH_ID;
                    $scope.HRM_GET_PUNCHCLOCK_BRANCH_SETTINGS(RESULT_PERSNL);
                }
                else {
                    $scope.HRM_GET_PUNCHCLOCK_BRANCH_SETTINGS();
                }
            });
    }

    $scope.HRM_GET_PUNCHCLOCK_BRANCH_SETTINGS = function (RESULT_PERSNL) {
        var PunchClockObject = new Object();
        PunchClockObject.ENTITY_ID = null;
        PunchClockObject.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        PrcCommMethods.HUMANRESOURCE_API(PunchClockObject, 'HRM_GET_PUNCHCLOCK_BRANCH_SETTINGS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.PUNCHCLOCK_BRANCH_SETTINGS_LIST = data.data.Table.filter(x => x.QR_SCAN == true && x.ENTITY_ID == parseInt($cookies.get('ENTITY_ID')));
                if (RESULT_PERSNL != undefined) {
                    var PRIMARY_BRANCH = $scope.PUNCHCLOCK_BRANCH_SETTINGS_LIST.filter(function (x) { return x.BRANCH_ID == RESULT_PERSNL.BRANCH_ID });
                    if (PRIMARY_BRANCH.length > 0) {
                        $scope.SELECTED_BRANCH_Fn(PRIMARY_BRANCH[0]);
                    }
                    else {
                        $scope.SELECTED_BRANCH_Fn($scope.PUNCHCLOCK_BRANCH_SETTINGS_LIST[0]);
                    }
                }
                else {
                    if ($scope.PUNCHCLOCK_BRANCH_SETTINGS_LIST.length > 0) {
                        $scope.SELECTED_BRANCH_Fn($scope.PUNCHCLOCK_BRANCH_SETTINGS_LIST[0]);
                    }
                    else {
                        $scope.PUNCHCLOCK_BRANCH_SETTINGS_LIST = [];
                    }
                }

            }
            else {
                $scope.PUNCHCLOCK_BRANCH_SETTINGS_LIST = [];
            }
            $scope.GET_VALUE_FOR_QR_GENERATION();
        });
    };
    $scope.SELECTED_BRANCH_Fn = function (_branch) {
        $scope.ClockInOutSearch.CUSTOM_BRANCH_NAME = _branch.BRANCH_NAME;
        $scope.ClockInOutSearch.BRANCH_ID = _branch.BRANCH_ID;
        $scope.GET_VALUE_FOR_QR_GENERATION();
        $scope.HRM_GET_EMPLOYEE_LIST();

    };
    //$scope.ROTA_GET_BRANCH_SECTION = function () {
    //    ModelObj = new Object();
    //    ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
    //    ModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
    //    PrcCommMethods.HR_API(ModelObj, 'HR_GET_EMP_BRANCH').then(function (data) {
    //        if (data.data.Table.length > 0) {
    //            $scope.BRANCH_AND_SECTION_LIST = $filter("unique")(data.data.Table, 'BRANCH_ID');
    //            if (data.data.CustomTable1.length > 0) {
    //                $scope.ClockInOutSearch.BRANCH_ID = data.data.CustomTable1[0].BRANCH_ID;
    //            }
    //            else {
    //                $scope.ClockInOutSearch.BRANCH_ID = data.data.Table[0].BRANCH_ID;
    //            }

    //            $scope.GET_VALUE_FOR_QR_GENERATION();
    //        } else {
    //            $scope.BRANCH_AND_SECTION_LIST = [];
    //        };
    //    });
    //}
    $scope.HRM_GET_EMPLOYEE_STEP();


    var promise;
    $scope.GET_VALUE_FOR_QR_GENERATION = function (Flag) {
        ModelObj = new Object();
        ModelObj.USER_ID = parseInt($cookies.get("USERID"));
        ModelObj.BRANCH_ID = $scope.ClockInOutSearch.BRANCH_ID;
        PrcCommMethods.HR_API(ModelObj, 'GET_VALUE_FOR_QR_GENERATION').then(function (data) {
            if (data.data.Table.length > 0) {
                if (Flag == 1) {
                    if (confirm('Are you sure, refresh the QR code?')) {
                        var tag_id = document.getElementById('RenderHtml');
                        tag_id.innerHTML = '<div id="qrcode"></div>';
                        $('#qrcode').qrcode('' + data.data.Table[0].VALUE_FOR_QR);
                        $scope.ClockInOutSearch.VALUE_FOR_QR = data.data.Table[0].VALUE_FOR_QR;

                    }
                } else {
                    var tag_id = document.getElementById('RenderHtml');
                    tag_id.innerHTML = '<div id="qrcode"></div>';
                    $('#qrcode').qrcode('' + data.data.Table[0].VALUE_FOR_QR);
                    $scope.ClockInOutSearch.VALUE_FOR_QR = data.data.Table[0].VALUE_FOR_QR;
                }

                if (parseInt($scope.SETTING_VALUE_36) > 0) {
                    $interval.cancel(promise);
                    $scope.TIMER_START();
                }
            }
        });

    }

    $scope.GET_EMP_PRS_ID = function () {
        $scope.ClockInOutForm.submitted = true;
        if ($scope.ClockInOutForm.$valid) {
            $scope.PAGE_LOAD = 2;
            $scope.CLICK_BUTTON = true;
            ModelObj = new Object();
            ModelObj.USER_NAME = $scope.ClockInOutSearch.USER_NAME;
            ModelObj.PASSWORD = $scope.ClockInOutSearch.PASSWORD;
            ModelObj.SETTING_FLAG = $scope.SETTING_VALUE_25;
            ModelObj.ENTITY_ID = parseInt($cookies.get('ENTITY_ID')),
                PrcCommMethods.HR_API(ModelObj, 'GET_EMP_PRS_ID').then(function (data) {
                    if (data.data.Table.length > 0) {
                        $scope.HRM_SCHDL_MOB_GET_EMPLOYEE_SHIFTS(data.data.Table[0].EMP_PRS_ID);
                        $scope.EMP_PRS_ID = data.data.Table[0].EMP_PRS_ID;
                        $scope.ClockInOutSearch.FIRST_NAME = data.data.Table[0].FIRST_NAME;
                        $scope.ClockInOutSearch.LAST_NAME = data.data.Table[0].LAST_NAME;
                    }
                    else {
                        $scope.ShowAlertBox('Error', 'Invalid Login Email / Employee # Or Password', 5000);
                        $scope.ClockInOutSearch.USER_NAME = "";
                        $scope.ClockInOutSearch.PASSWORD = "";
                        $scope.ClockInOutForm.submitted = false;
                        $scope.ClockInOutSearch.FIRST_NAME = "-";
                        $scope.ClockInOutSearch.LAST_NAME = "-";
                    }
                    $scope.GET_UTC_TIME(1);
                    $scope.CLICK_BUTTON = false;
                });
        }
    }
    $scope.RESET_EMP = function () {
        $scope.ClockInOutSearch.USER_NAME = "";
        $scope.ClockInOutSearch.PASSWORD = "";
        $scope.ClockInOutForm.submitted = false;
        $scope.ClockInOutSearch.FIRST_NAME = "-";
        $scope.ClockInOutSearch.LAST_NAME = "-";
        $scope.CLOCK_IN_SHIFT_LIST = [];
        $scope.TODAY_SHIFT_LIST = [];
        $scope.CLOCK_IN_SHIFT_DETAILS = [];
        $scope.PAGE_LOAD = 1;
        $scope.EMP_PRS_ID = "";
        $scope.GET_UTC_TIME(1);
    }
    $scope.TODAY_SHIFT_LIST = [];
    $scope.CLOCK_IN_SHIFT_LIST = [];
    $scope.CLICK_BUTTON = false;
    $scope.PAGE_LOAD = 1;

    $scope.ROTA_INS_UPD_LOGIN_LOGOUT_FY = function (EL, SHIFT) {
        if ($scope.SETTING_VALUE_43 == "1") {
            if (SHIFT.ON_BREAK_TABLE_ID > 0) {
                $scope.$parent.ShowAlertBox("Error", "Please mark your self to break out", 3000);
            }
            else {

                var text = "";
                if (SHIFT.CLOCK_IN_SHIFT_DETAILS == null || SHIFT.CLOCK_IN_SHIFT_DETAILS.length == 0) {
                    text = "Are you sure, you want to clock-in";
                }
                else {
                    text = "Are you sure, you want to clock-out";
                }
                if (confirm(text)) {
                    var ModelObj = new Object();
                    ModelObj.TABLE_ID = SHIFT.CLOCK_IN_SHIFT_DETAILS == null || SHIFT.CLOCK_IN_SHIFT_DETAILS.length == 0 ? 0 : SHIFT.CLOCK_IN_SHIFT_DETAILS[0].ROTA_LOGIN_LOGOUT_TABLE_ID;
                    ModelObj.EMP_PRS_ID = EL.EMP_PRS_ID;
                    ModelObj.LOGIN_DATE = null;
                    ModelObj.LOGOUT_DATE = null;
                    ModelObj.SHIFT_ID = SHIFT.SHIFT_ID;
                    ModelObj.IS_MOBILE = "1";
                    ModelObj.CLOCK_IN_SOURCE = "WEB InOut";
                    PrcCommMethods.HR_API(ModelObj, 'HRM_SCHDL_UPD_CLOCK_IN').then(function (data) {
                        if (data.data == 1) {
                            if (SHIFT.LOGIN_LOGOUT_DETAILS == null || SHIFT.LOGIN_LOGOUT_DETAILS.length == 0) {
                                $scope.$parent.ShowAlertBox("Success", "Successfully Login", 3000);
                            }
                            else if (SHIFT.LOGIN_LOGOUT_DETAILS.length > 0) {
                                $scope.$parent.ShowAlertBox("Success", "Successfully Logout", 3000);
                            }
                            $scope.HRM_SCHDL_MOB_GET_EMPLOYEE_SHIFTS($scope.EMP_PRS_ID);
                        }
                        if (data.data == 0) {
                            $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                        }
                    });
                }
            }
        }
        else {
            $scope.$parent.ShowAlertBox('Attention', 'Clock In & Out services has been disabled on this app. Please contact admin', 3000);
        }
    }
    $scope.CLOCK_IN_MODAL_Fn = function (_shift) {
        $scope.SELECTED_SHIFT = _shift;
        $scope.HRM_SCHDL_UPD_CLOCK_IN();
    }
    $scope.CLOCK_OUT_MODAL_Fn = function (_shift) {
        //|| _shift.COMPLETED_BREAK_COUNT
        if (_shift.BREAK_IN != null && _shift.CLOCK_IN != null && _shift.CLOCK_OUT == null) {
            $scope.$parent.ShowAlertBox('Error', 'Cannot clock-out , please complete the break.', 3000);
        }
        else {
            $scope.SELECTED_SHIFT = _shift;
            $scope.HRM_SCHDL_UPD_CLOCK_OUT();
        }
    }

    $scope.TAKE_BREAK_Fn = function (_shift) {
        $scope.SELECTED_SHIFT = _shift;
        if (_shift.BREAK_IN == null) {
            $scope.HRM_SCHDL_INS_BREAK_IN();
        }
        else {
            $scope.HRM_SCHDL_INS_BREAK_OUT();
        }
    }

    $scope.MESSAGE_CLICK = function (SHIFT, FLAG) {
        if (FLAG == 1) {
            if (SHIFT.CLOCK_IN_SHIFT_DETAILS.length > 0 && SHIFT.CLOCK_IN != null && SHIFT.CLOCK_OUT == null) {
                $scope.$parent.ShowAlertBox('Error', 'Already Clock-In', 3000);
            }
            else if (SHIFT.CLOCK_IN_SHIFT_DETAILS.length > 0 && SHIFT.CLOCK_IN != null && SHIFT.CLOCK_OUT != null) {
                $scope.$parent.ShowAlertBox('Error', 'Cannot clock-In, as the shift has already been completed', 3000);
            } else if (SHIFT.CLCIN_CLCOUT_GONE) {
                $scope.$parent.ShowAlertBox('Error', 'Cannot clock-In , as the shift time has passed or not started yet ', 3000);
            } else if (!SHIFT.CLCIN_IN) {
                $scope.$parent.ShowAlertBox('Error', 'Cannot clock-In , in future shifts', 3000);
            };
        };
        if (FLAG == 2) {
            if (SHIFT.CLOCK_IN_SHIFT_DETAILS > 0 && SHIFT.CLOCK_OUT != null) {
                $scope.$parent.ShowAlertBox('Error', 'Cannot clock-Out, as the shift has already been completed', 3000);
            }
            else if (SHIFT.CLCIN_CLCOUT_GONE) {
                $scope.$parent.ShowAlertBox('Error', 'Cannot clock-Out , as the shift time has passed or not started yet ', 3000);
            }
            else if (!SHIFT.CLCIN_IN) {
                $scope.$parent.ShowAlertBox('Error', 'Cannot clock-Out in future shifts', 3000);
            };;
        };
    };
    $scope.LOAD_FETCH_TEXT = "Please search by login email / user name to get shift detail";
    $scope.HRM_SCHDL_MOB_GET_EMPLOYEE_SHIFTS = function (EMP_PRS_ID) {
        $scope.LOAD_FETCH_TEXT = 'Fetching records..';
        ModelObj = new Object();
        ModelObj.BUSINESS_DATE = new Date(TODAY_DAY).toDateString();
        ModelObj.EMPLY_PRSNL_ID = EMP_PRS_ID;
        ModelObj.USER_ID = parseInt($cookies.get("USERID"));
        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        ModelObj.BRANCH_ID = $scope.ClockInOutSearch.BRANCH_ID;
        PrcCommMethods.HUMANRESOURCE_API(ModelObj, 'HRM_SCHDL_MOB_GET_EMPLOYEE_SHIFTS').then(function (data) {
            $scope.PAGE_LOAD = 1;
            $scope.CLOCK_IN_SHIFT_LIST = [];
            $scope.TODAY_SHIFT_LIST = [];
            $scope.CLOCK_IN_SHIFT_DETAILS = [];
            if (data.data.Table.length > 0) {
                $scope.TODAY_SHIFT_LIST = data.data.Table;//Repotee shift 
                $scope.PAGE_LOAD = 2;
            }
            else {
                $scope.LOAD_FETCH_TEXT = 'No record found..';
            }
            //if (data.data.Table1.length > 0) {
            //    $scope.CLOCK_IN_SHIFT_LIST = data.data.Table1;/// repotee leave ;
            //    $scope.CLOCK_IN_SHIFT_DETAILS = data.data.Table2;
            //    $scope.PAGE_LOAD = 2;
            //}
            //if (data.data.Table2.length > 0) {
            //    $scope.CLOCK_IN_SHIFT_DETAILS = data.data.Table2; //Self shift ;
            //    $scope.PAGE_LOAD = 2;
            //}
            if (data.data.Table.length == 0) {
                $scope.PAGE_LOAD = 2;
            }
            $scope.CLICK_BUTTON = false;
        });
    }

    function clockUpdate() {
        if (TODAY_DAY !== undefined) {
            var date = new moment(TODAY_DAY).add(1, 'seconds');
            let displayDate = Intl.DateTimeFormat('en-GB', { hour: 'numeric', minute: 'numeric', second: 'numeric' }).format(new Date(date)); TODAY_DAY = new Date(date);
            $scope.CURRENT_TIME_ACCORDING_TIME_ZONE = date;
            $scope.CURRENT_TIME_HOURS = moment(date).hour();
            $scope.CURRENT_TIME_MINUTE = moment(date).minute();
            $scope.CURRENT_TIME_SECOND = moment(date).second();
            var a = moment(TODAY_DAY);//now
            var b = moment($scope.COPY_TODAY_DAY);
            var minutes = a.diff(b, 'minutes')
            if (minutes > 2) {
                $scope.$parent.UPDATE_UEM();
                $scope.GET_UTC_TIME(1);
            }
            $scope.$apply();
        }
    }
    $scope.GET_UTC_TIME = function (FLAG) {
        var ModelObj = new Object();
        //ModelObj.TIMEZONE_OFFSET = $cookies.get("TIMEZONE_OFFSET");
        ModelObj.TIMEZONE_OFFSET = $scope.GET_LOCAL_TIME_ZONE();
        PrcCommMethods.HR_API(ModelObj, 'GET_UTC_TIME').then(function (data) {
            TODAY_DAY = new Date(data.data);
            $scope.COPY_TODAY_DAY = angular.copy(new Date(data.data));
            if (FLAG == undefined) {
                $(document).ready(function () {
                    clockUpdate();
                    setInterval(clockUpdate, 1000);
                })
            }
        });
    };
    $scope.GET_UTC_TIME();
    function RefreshQRCode() {
        $scope.GET_VALUE_FOR_QR_GENERATION()
    }

    $scope.TIMER_START = function () {
        if (parseInt($scope.ENABLE_QR_CODE_REFRESH) > 0) {
            let millsec = parseInt($scope.ENABLE_QR_CODE_REFRESH) * 60000;
            promise = $interval(RefreshQRCode, millsec);
        }
    }
    $scope.TIMER_START();
    $scope.VALIDATE_QR_FOR_SHIFT_LOGIN = function () {
        ModelObj = new Object();
        ModelObj.QR_VALUE = $scope.ClockInOutSearch.VALUE_FOR_QR;
        PrcCommMethods.HR_API(ModelObj, 'VALIDATE_QR_FOR_SHIFT_LOGIN').then(function (data) {
            if (data.data.Table[0].SUCCESS == 1) {
            }
            if (data.data.Table[0].SUCCESS == 0) {
            }
        });
    }

    $scope.SELECT_EMP_RESULT = function () {

    }
    $scope.SHOW_VIEW_DETAILS = function (LINE, index, viewdetailname) {
        //$('#showmenu').click(function () {
        LINE.STEP_FLAG = 1;
        $scope.ROTA_GET_SHIFT_DETAILS_BY_ID(LINE);
        LINE.HIDE_SHOW = LINE.HIDE_SHOW == undefined || LINE.HIDE_SHOW == false ? LINE.HIDE_SHOW = true : LINE.HIDE_SHOW = false;
        $('#' + viewdetailname + '' + index).slideToggle("slow");
        //});
    }
    $scope.ROTA_GET_SHIFT_DETAILS_BY_ID = function (SHIFT) {
        $scope.SHIFT_FLAG = 1;
        ModelObj = new Object();
        ModelObj.SHIFT_ID = SHIFT.SHIFT_ID;
        PrcCommMethods.HR_API(ModelObj, 'ROTA_GET_SHIFT_DETAILS_BY_ID').then(function (data) {
            SHIFT.SHIFT_TAGS_LIST = data.data.Table4;
            SHIFT.LOGIN_LOGOUT_DETAILS_BY_ID = data.data.Table3;
            SHIFT.BREAK_LIST = data.data.Table1.filter(function (x) { return x.ACTUAL_BREAK == false });
            SHIFT.ACTUAL_BREAK_LIST = data.data.Table1.filter(function (x) { return x.ACTUAL_BREAK && !x.IS_DISCARDED });
            SHIFT.DISCARDED_BREAK_LIST = data.data.Table1.filter(function (x) { return x.IS_DISCARDED });

        });
    }
    $scope.TAB_CLICK = function (FLAG, SHIFT) {
        SHIFT.STEP_FLAG = FLAG;
    }

    //$scope.NG_INIT_CLOCK_IN_SHIFT_DETAILS_FY = function (LINE) {
    //    LINE.START_TIME_TOLERANCE = angular.copy(moment(LINE.START_TIME).subtract($scope.SHIFT_LOGIN_TOLERANCE_IN_MINUTES, "minutes").toDate());
    //    LINE.END_TIME_MOMENT = angular.copy(moment(LINE.END_TIME));
    //    LINE.CLOCK_IN_SHIFT_DETAILS = $scope.CLOCK_IN_SHIFT_DETAILS.filter(function (x) { return x.SHIFT_ID == LINE.SHIFT_ID });
    //}


    $scope.nginit_todayShift = function (_shift) {
        _shift.ms = moment(new Date(_shift.SCHEDULED_END), "DD/MM/YYYY HH:mm:ss").diff(moment(new Date(_shift.SCHEDULED_START), "DD/MM/YYYY HH:mm:ss"));
        var diffDuration = moment.duration(_shift.ms);
        var mint = 0;
        if (diffDuration._data.minutes > 0) {
            mint = diffDuration._data.minutes / 60;
        }
        _shift.HOURS = diffDuration._data.hours + parseFloat(parseFloat(mint).toFixed(2));
        _shift.TOTAL_BREAK_IN = null;
        if (_shift.ACTUAL_BREAK_DURATION > 0) {
            _shift.TOTAL_BREAK_IN_HOURS = parseInt(_shift.ACTUAL_BREAK_DURATION / 60);
            _shift.TOTAL_BREAK_IN_MINUT = parseFloat(_shift.ACTUAL_BREAK_DURATION % 60);
            if (_shift.TOTAL_BREAK_IN_HOURS == 0) {
                _shift.TOTAL_BREAK_IN = "00" + ":" + (_shift.TOTAL_BREAK_IN_MINUT < 10 ? "0" + _shift.TOTAL_BREAK_IN_MINUT : _shift.TOTAL_BREAK_IN_MINUT);
            }
            else if (_shift.TOTAL_BREAK_IN_HOURS < 10) {
                _shift.TOTAL_BREAK_IN = "0" + _shift.TOTAL_BREAK_IN_HOURS + ":" + (_shift.TOTAL_BREAK_IN_MINUT < 10 ? "0" + _shift.TOTAL_BREAK_IN_MINUT : _shift.TOTAL_BREAK_IN_MINUT);
            }
            else if (_shift.TOTAL_BREAK_IN_HOURS > 10) {
                _shift.TOTAL_BREAK_IN = _shift.TOTAL_BREAK_IN_HOURS + ":" + (_shift.TOTAL_BREAK_IN_MINUT < 10 ? "0" + _shift.TOTAL_BREAK_IN_MINUT : _shift.TOTAL_BREAK_IN_MINUT);
            }
        }
        else {
            _shift.TOTAL_BREAK_IN = "00:00";
        }

        if ($scope.SHIFT_LOGIN_TOLERANCE_IN_MINUTES == -9999) {
            _shift.START_TIME_TOLERANCE = angular.copy(moment(_shift.SCHEDULED_START).subtract(0, "minutes").toDate());
        } else {
            _shift.START_TIME_TOLERANCE = angular.copy(moment(_shift.SCHEDULED_START).subtract($scope.SHIFT_LOGIN_TOLERANCE_IN_MINUTES, "minutes").toDate());
        }
        _shift.END_TIME_MOMENT = angular.copy(moment(_shift.SCHEDULED_END));
    }

    $scope.HRM_EMPLOYTEE_LIST = [];
    $scope.HRM_GET_EMPLOYEE_LIST = function (FLAG, _pageload_flag) {
        $scope.EMPLOYEE_LIST = [];
        var UserModelObj = new Object();
        UserModelObj.CUSTOMER_ID = $cookies.get("CUSTOMER_ID");
        UserModelObj.ENTITY_ID = $cookies.get("ENTITY_ID");
        UserModelObj.EMPLY_PRSNL_ID = $cookies.get("EMPLY_PRSNL_ID");
        UserModelObj.USER_ID = $cookies.get("USERID");
        UserModelObj.STANDARD_ROLE_ID = $cookies.get("STANDARD_ROLE_ID");
        UserModelObj.MODULE_ID = $cookies.get("MODULE_ID");
        UserModelObj.BRANCH_ID = $scope.ClockInOutSearch.BRANCH_ID;
        UserModelObj.SEARCH = "";
        UserModelObj.PAGE_NO = 0;
        UserModelObj.PAGE_SIZE = 0;
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'HRM_GET_EMPLOYEE_LIST_BY_SCHEDULING_ACCESS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.HRM_EMPLOYTEE_LIST = data.data.Table;
                for (var i = 0; i < $scope.HRM_EMPLOYTEE_LIST.length; i++) {
                    if ($scope.HRM_EMPLOYTEE_LIST[i].PROFILE_PIC_PATH == null || $scope.HRM_EMPLOYTEE_LIST[i].PROFILE_PIC_PATH == "") {
                        $scope.HRM_EMPLOYTEE_LIST[i].SHORT_NAME = $scope.$parent.TextReturn($scope.HRM_EMPLOYTEE_LIST[i].EMPLOYEE_NAME);
                    }
                };
            };
        });
    }

    $scope.selectEmployeeTypeAhead = function (EMP) {
        if (EMP !== null && EMP !== undefined && EMP !== undefined) {
            $scope.HRM_SCHDL_MOB_GET_EMPLOYEE_SHIFTS(EMP.EMPLY_PRSNL_ID);
        }
        else {
            $scope.$parent.ShowAlertBox('Warning', 'no result found ', 3000);
        }
    };

    $scope.LOGIN_MANAGER = function () {
        var UserModelObj = new Object();
        UserModelObj.UserName = $scope.$parent.User_Email;
        UserModelObj.Password = $scope.ClockInOutSearch.MANAGER_PASSWORD;
        var httpRequest = $http({
            method: 'POST',
            url: CommService.Get_CASHUP_API() + 'api/LoginAPI/USER_LOGIN',
            data: UserModelObj
        }).then(function (data) {
            if (data.data != null && data.data.Table.length > 0 && data.data.Table1.length > 0) {
                $scope.$parent.CLOCK_IN_OUT_PAGE_LOAD = undefined;
                $scope.$parent.DISSABLE_WINDOW_ICON = true;
                $('#Login').modal('hide');
                window.location.href = "../DashBoard/hrIndex#!/Hr_index";
            }
            else {
                $scope.ShowAlertBox('Error', 'Invalid  Password', 5000);
            }
        });
    }
    $scope.RESET_LOGIN_MANAGER = function () {
        $scope.ClockInOutSearch.MANAGER_PASSWORD = "";
    }
    //=====================Printing QR Code===========================
    $scope.PRINT_QRCODE = function () {
        $('#PRINT_QRCODE').modal('show');
        $scope.QRCODE_PRINT();

    };
    $scope.QRCODE_PRINT = function () {
        html2canvas($("#qrcode"), { // DIV ID HERE
            onrendered: function (canvas) {
                var imgData = canvas.toDataURL('image/png');
                var doc = new jsPDF('landscape');
                var Branch_Name = "";
                $scope.PUNCHCLOCK_BRANCH_SETTINGS_LIST.filter(function (x) {
                    if (x.BRANCH_ID == $scope.ClockInOutSearch.BRANCH_ID) {
                        Branch_Name = x.BRANCH_NAME;
                    }
                });
                doc.setFontSize(30);

                doc.text(75, 25, Branch_Name + " - " + (new Date().toLocaleString()));
                doc.addImage(imgData, 'PDF', 60, 40, 160, 100);
                doc.save("QR_COD - (" + Branch_Name + " - " + (new Date().toLocaleString()) + ")" + ".pdf");

            }
        });

        window.history.pushState(null, "", window.location.href);
        window.onpopstate = function () {
            window.history.pushState(null, "", window.location.href);
        };
        //alert("Successfully!, Browser back button disabled");
        // $("#message").text("Successfully!, Browser back button disabled").delay(2000).fadeOut(1000);
    }
    $scope.SELECTED_SHIFT = {
    };
    $scope.ON_SHIFT_CLICK = function (shift, FLAG) {
        $scope.SELECT_FLAG = FLAG
        $scope.SELECTED_SHIFT = shift;
        $('#Preview_Image').modal('show');
    }
    $scope.MODAL_CLOCKIN = function (shift) {
        $('#Preview_Image').modal('hide');
        $scope.SELECTED_SHIFT = {
        };
    }
    $scope.HRM_SCHDL_UPD_CLOCK_IN = function () {
        var ModelObj = new Object();
        ModelObj.SCHDL_SHIFT_ID = $scope.SELECTED_SHIFT.SHIFT_ID;
        ModelObj.CLOCK_IN_SOURCE = "Web Inout";
        ModelObj.FLAG = 9;
        const date1 = new Date();
        ModelObj.USER_ID = parseInt($cookies.get('USERID'));
        ModelObj.TIMEZONE_OFFSET = date1.getTimezoneOffset();
        if (ModelObj.TIMEZONE_OFFSET == "0") {
            ModelObj.TIMEZONE_OFFSET = "00:00"
        } else {
            ModelObj.TIMEZONE_OFFSET = $scope.GET_LOCAL_TIME_ZONE();
        }
        ModelObj.SETTING_46 = $scope.$parent.MASTER_GET_CUSTOMER_SETTINGS_VALUES(46);
        PrcCommMethods.HUMANRESOURCE_API(ModelObj, 'HRM_SCHDL_UPD_CLOCK_IN').then(function (data) {
            if (data.data > 0) {
                //$scope.HRM_SCHDL_UPD_CLOCK_IN_FY(EL, SHIFT);
                //$scope.$parent.ShowAlertBox("Success", "Clock-In Successfully", 3000);
                $('#Clock-in-modal').modal('show');
                $scope.HRM_SCHDL_MOB_GET_EMPLOYEE_SHIFTS($scope.SELECTED_SHIFT.EMPLY_PRSNL_ID);
            } else if (data.data == -1) {
                //$scope.HRM_SCHDL_UPD_CLOCK_IN_FY(EL, SHIFT);
                $scope.$parent.ShowAlertBox("Success", "Already action taken", 3000);
                $scope.HRM_SCHDL_MOB_GET_EMPLOYEE_SHIFTS($scope.SELECTED_SHIFT.EMPLY_PRSNL_ID);
            };
            if (data.data == 0) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            };
        });
    }

    $scope.HRM_SCHDL_UPD_CLOCK_OUT = function () {
        var ModelObj = new Object();
        ModelObj.SCHDL_SHIFT_ID = $scope.SELECTED_SHIFT.SHIFT_ID;
        ModelObj.CLOCK_OUT_SOURCE = "Web In out";
        ModelObj.FLAG = 9;
        const date1 = new Date();
        ModelObj.USER_ID = parseInt($cookies.get('USERID'));
        ModelObj.TIMEZONE_OFFSET = date1.getTimezoneOffset();
        if (ModelObj.TIMEZONE_OFFSET == "0") {
            ModelObj.TIMEZONE_OFFSET = "00:00"
        } else {
            ModelObj.TIMEZONE_OFFSET = $scope.GET_LOCAL_TIME_ZONE();
        }
        ModelObj.SETTING_46 = $scope.$parent.MASTER_GET_CUSTOMER_SETTINGS_VALUES(46);
        PrcCommMethods.HUMANRESOURCE_API(ModelObj, 'HRM_SCHDL_UPD_CLOCK_OUT').then(function (data) {
            if (data.data > 0) {
                //$scope.HRM_SCHDL_UPD_CLOCK_IN_FY(EL, SHIFT);
                //$scope.$parent.ShowAlertBox("Success", "Clock-In Successfully", 3000);
                $('#Clock-out-modal').modal('show');
                $scope.HRM_SCHDL_MOB_GET_EMPLOYEE_SHIFTS($scope.SELECTED_SHIFT.EMPLY_PRSNL_ID);
            } else if (data.data == -1) {
                //$scope.HRM_SCHDL_UPD_CLOCK_IN_FY(EL, SHIFT);
                $scope.$parent.ShowAlertBox("Success", "Already action taken", 3000);
                $scope.HRM_SCHDL_MOB_GET_EMPLOYEE_SHIFTS($scope.SELECTED_SHIFT.EMPLY_PRSNL_ID);
            };
            if (data.data == 0) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            };
        });
    }

    $scope.HRM_SCHDL_INS_BREAK_IN = function () {
        var ModelObj = new Object();
        ModelObj.SCHDL_SHIFT_ID = $scope.SELECTED_SHIFT.SHIFT_ID;
        ModelObj.SOURCE = "Web";
        ModelObj.FLAG = 9;
        const date1 = new Date();
        ModelObj.USER_ID = parseInt($cookies.get('USERID'));
        ModelObj.TIMEZONE_OFFSET = date1.getTimezoneOffset();
        if (ModelObj.TIMEZONE_OFFSET == "0") {
            ModelObj.TIMEZONE_OFFSET = "00:00"
        } else {
            ModelObj.TIMEZONE_OFFSET = $scope.GET_LOCAL_TIME_ZONE();
        }
        ModelObj.SETTING_46 = $scope.$parent.MASTER_GET_CUSTOMER_SETTINGS_VALUES(46);
        PrcCommMethods.HUMANRESOURCE_API(ModelObj, 'HRM_SCHDL_INS_BREAK_IN').then(function (data) {
            if (data.data > 1) {
                $scope.HRM_SCHDL_MOB_GET_EMPLOYEE_SHIFTS($scope.SELECTED_SHIFT.EMPLY_PRSNL_ID);
                $scope.$parent.ShowAlertBox("Success", "Break start successfully", 3000);
            } else if (data.data == -1) {
                $scope.$parent.ShowAlertBox("Success", "Already action taken", 3000);
                $scope.HRM_SCHDL_MOB_GET_EMPLOYEE_SHIFTS($scope.SELECTED_SHIFT.EMPLY_PRSNL_ID);
            };
            if (data.data == 0) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            };
        });
    }
    $scope.HRM_SCHDL_INS_BREAK_OUT = function () {
        var ModelObj = new Object();
        ModelObj.SCHDL_SHIFT_ID = $scope.SELECTED_SHIFT.SHIFT_ID;
        ModelObj.SCHDL_SHIFT_BREAK_ID = $scope.SELECTED_SHIFT.SCHDL_SHIFT_BREAK_ID;
        ModelObj.SOURCE = "Web";
        ModelObj.FLAG = 9;
        const date1 = new Date();
        ModelObj.USER_ID = parseInt($cookies.get('USERID'));
        ModelObj.TIMEZONE_OFFSET = date1.getTimezoneOffset();
        if (ModelObj.TIMEZONE_OFFSET == "0") {
            ModelObj.TIMEZONE_OFFSET = "00:00"
        } else {
            ModelObj.TIMEZONE_OFFSET = $scope.GET_LOCAL_TIME_ZONE();
        }
        ModelObj.SETTING_46 = $scope.$parent.MASTER_GET_CUSTOMER_SETTINGS_VALUES(46);
        PrcCommMethods.HUMANRESOURCE_API(ModelObj, 'HRM_SCHDL_INS_BREAK_OUT').then(function (data) {
            if (data.data > 1) {
                $scope.HRM_SCHDL_MOB_GET_EMPLOYEE_SHIFTS($scope.SELECTED_SHIFT.EMPLY_PRSNL_ID);
                $scope.$parent.ShowAlertBox("Success", "Break End successfully", 3000);
            }
            if (data.data == 0) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            };
        });
    }

    $scope.ROTA_INS_SHIFT_BREAKS = function (LINE) {
        //if (!(moment(SHIFT_CELL_BREAK_TIME).isBetween(moment(LINE.START_TIME), moment(LINE.END_TIME), undefined, '[]'))) {
        //    Count++
        //    $scope.$parent.ShowAlert('Error', 'please select timing  between shift hours ', 1000);
        //}
        var text = "";
        if (LINE.ON_BREAK_TABLE_ID == 0) {
            text = "Are you sure, do you want to go on break";
        }
        else {
            text = "Are you sure, you want to end your break";
        }
        IS_OK = confirm(text);
        if (IS_OK) {
            var ModelObj = new Object();
            ModelObj.TABLE_ID = LINE.ON_BREAK_TABLE_ID;
            ModelObj.SHIFT_ID = LINE.SHIFT_ID;
            ModelObj.USER_ID = parseInt($cookies.get("USERID"));
            ModelObj.IN_OUT_FLAG = LINE.ON_BREAK_TABLE_ID == 0 ? 1 : 0;//-- 1 FOR OUR 0 FOR IN
            ModelObj.NOTES = "";
            ModelObj.DATE_TIME = null;
            ModelObj.LOGIN_INFO = "WEB InOut";
            ModelObj.BREAK_SOURCE = "WEB InOut";
            PrcCommMethods.HR_API(ModelObj, 'ROTA_INS_SHIFT_BREAKS').then(function (data) {
                if (data.data.Table[0].TABLE_ID > 0 && LINE.ON_BREAK_TABLE_ID == 0) {
                    $scope.$parent.ShowAlertBox("Success", "Successfully On Breaks", 3000);
                }
                else if (data.data.Table[0].TABLE_ID > 0 && LINE.ON_BREAK_TABLE_ID > 1) {
                    $scope.$parent.ShowAlertBox("Success", "Successfully Back In Breaks", 3000);
                }
                if (data.data == undefined || data.data.Table == undefined) {
                    $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                }
                $scope.GET_EMP_PRS_ID();
                $scope.ROTA_GET_SHIFT_DETAILS_BY_ID(LINE);
            });
        }
    }

    window.history.pushState(null, null, window.location.href);
    window.onpopstate = function () {
        window.history.go(1);
    };
});

