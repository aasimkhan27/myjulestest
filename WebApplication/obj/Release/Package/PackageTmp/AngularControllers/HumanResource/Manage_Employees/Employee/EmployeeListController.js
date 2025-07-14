app.controller('EmployeeListController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    //$scope.$parent.DISPLAY_FLAG = false;
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(2);
    $scope.HR_COMMON_CODE_Fn();
    $(".modal-backdrop").remove();
    $scope.TABLE_VIEW_ID = 1;
    $scope.$parent.$parent.overlay_loading_HR_Loader = 'none';
    $scope.EmployeeSearch = {
        PAGE_NO: 1,
        PAGE_SIZE: $scope.$parent.PAGE_SIZE,
        CUSTOMER_ID: $cookies.get("CUSTOMER_ID"),
        ENTITY_ID: $cookies.get("ENTITY_ID"),
        EMPLY_PRSNL_ID: $cookies.get("EMPLY_PRSNL_ID"),
        MODULE_ID: $cookies.get("MODULE_ID"),
        USER_ID: $cookies.get("USERID"),
        CUSTOM_PAY_TYPE: $scope.$parent.DD_DEFAULT_TEXT,
        DD_DEFAULT_TEXT: $scope.$parent.DD_DEFAULT_TEXT,
        CUSTOME_REPORTING_MANAGER: $scope.$parent.DD_DEFAULT_TEXT,
        DD_DEFAULT_BULK_UPDATE_TEXT: 'Bulk Update',
        MANAGER_ID: '',
        IS_LAZY_LOAD_CLICKED: false,
        BULK_UPDATE_TYPE_ID: 0,
    };
    $scope.DEPARTMENT_ID = getUrlParameter('DID', $location.absUrl());
    $scope.TEAM_ID = getUrlParameter('TID', $location.absUrl());
    $scope.BRANCH_EMP_LIST = [];
    $scope.DEPARTMENTS_EMP_LIST = [];
    $scope.POSITIONS_EMP_LIST = [];
    $scope.EMPLOYTEE_EMP_LIST = [];
    $scope.EMPLOYEE_LIST = [];
    $scope.EMPLOYEE_STATUSES_LIST = [];
    $scope.BLANK_INVITE_LIST = [{ FIRST_NAME: '', LAST_NAME: '', EMAIL: '' }];
    $scope.TABLE_VIEW_LIST = [{ 'NAME': 'Table View', ID: 1, class: 'fa-table-layout' }, { 'NAME': 'Card View', ID: 2, class: 'fa-table-cells-large' }]
    $scope.BULK_UPDATE_LIST = [];
    $scope.EmployeeSearch.BranchALL = true;
    $scope.EmployeeSearch.DepartmentALL = true;
    $scope.EmployeeSearch.PositionALL = true;
    $scope.EmployeeSearch.StatusALL = true;
    if ($cookies.get("EMPLY_PRSNL_ID") == 0) {
        $scope.IS_ADD_EMPLOYEE = true;
    }
    else {
        $scope.IS_ADD_EMPLOYEE = $scope.CheckEmployeeAllBranchAccess('EDIT_EMPLOYEE');
    }


    $scope.EMPLOYEE_REDIRECTION_Fn = function (_param_employee) {
        switch (_param_employee.STEP_NO) {
            case 1:
                $location.path("PrimaryDetails").search("EMP_ID", _param_employee.EMPLY_PRSNL_ID).search("STEP_NO", _param_employee.STEP_NO);
                break;
            case 2:
                $location.path("EmploymentInfo").search("EMP_ID", _param_employee.EMPLY_PRSNL_ID).search("STEP_NO", _param_employee.STEP_NO);
                break;
            case 3:
                $location.path("Wages").search("EMP_ID", _param_employee.EMPLY_PRSNL_ID).search("STEP_NO", _param_employee.STEP_NO);
                break;
            case 4:
                $location.path("EmpAbsences").search("EMP_ID", _param_employee.EMPLY_PRSNL_ID).search("STEP_NO", _param_employee.STEP_NO);
                break;
            case 5:
                $location.path("EmpAccess").search("EMP_ID", _param_employee.EMPLY_PRSNL_ID).search("STEP_NO", _param_employee.STEP_NO);
                break;
            case 6:
                $location.path("Document").search("EMP_ID", _param_employee.EMPLY_PRSNL_ID).search("STEP_NO", _param_employee.STEP_NO);
                break;
            case 7:
                $location.path("Assets").search("EMP_ID", _param_employee.EMPLY_PRSNL_ID).search("STEP_NO", _param_employee.STEP_NO);
                break;
            case 8:
                $location.path("Qualificaiton").search("EMP_ID", _param_employee.EMPLY_PRSNL_ID).search("STEP_NO", _param_employee.STEP_NO);
                break;
            case 9:
                $location.path("PrimaryDetails").search("EMP_ID", _param_employee.EMPLY_PRSNL_ID).search("STEP_NO", _param_employee.STEP_NO);
                break;
            default:
                break;
        }
    }
    $scope.SET_SELECTALL = function () {

    }
    $scope.HRM_GET_EMPLOYEE_STATUSES = function () {
        var UserModelObj = new Object();
        UserModelObj.CUSTOMER_ID = $scope.EmployeeSearch.CUSTOMER_ID;
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

    $scope.ADMIN_GET_DEPARTMENT_POSITION_Fn = function () {
        var UserModelObj = new Object();
        UserModelObj.CUSTOMER_ID = $cookies.get("CUSTOMER_ID");
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'ADMIN_GET_DEPARTMENT_POSITION').then(function (data) {
            if (data.data.DEPARTMENT.length > 0) {
                $scope.DEPARTMENTS_EMP_LIST = data.data.DEPARTMENT;
            }
            if (data.data.POSITION.length > 0) {
                $scope.POSITIONS_EMP_LIST = data.data.POSITION;
            }
        });
    }
    $scope.HRM_GET_BULK_UPDATE_TYPE_DROPDOWN = function () {
        var UserModelObj = new Object();
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'HRM_GET_BULK_UPDATE_TYPE_DROPDOWN').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.BULK_UPDATE_LIST = data.data.Table;
            }
            else if (data.data == 0) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
        });
    }
    $scope.ADMIN_GET_BRANCH_LIST = function () {
        var UserModelObj = new Object();
        UserModelObj.CUSTOMER_ID = $scope.EmployeeSearch.CUSTOMER_ID;
        UserModelObj.ENTITY_ID = $cookies.get("ENTITY_ID");
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'ADMIN_GET_BRANCH_LIST').then(function (data) {
            if (data.data == null || data.data.Table.length == 0) {
                $scope.$parent.ShowAlert("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
            if (data.data.Table.length > 0) {
                $scope.BRANCH_EMP_LIST = data.data.Table;
            }
        });
    }

    $scope.ng_initemployee = function (_employee, LAST_FLAG) {
        _employee.SHORT_NAME = $scope.TextReturn(_employee.EMPLOYEE_NAME);

        if (LAST_FLAG) {
            $(".dropstart").click(function () {
                $("td.ME_sticky_right").css("z-index", 0);
                $(this).parent().css("z-index", 9);
            });

            //$('.table-responsive').on('shown.bs.dropdown', function (e) {
            //    var t = $(this),
            //        m = $(e.target).find('.dropdown-menu'),
            //        tb = t.offset().top + t.height(),
            //        mb = m.offset().top + m.outerHeight(true),
            //        d = 20; // Space for shadow + scrollbar.
            //    if (t[0].scrollWidth > t.innerWidth()) {
            //        if (mb + d > tb) {
            //            t.css('padding-bottom', ((mb + d) - tb));
            //        }
            //    } else {
            //        t.css('overflow', 'visible');
            //    }
            //}).on('hidden.bs.dropdown', function () {
            //    $(this).css({ 'padding-bottom': '', 'overflow': '' });
            //});
        }
    }

    $scope.LAZY_LOAD_HRM_GET_EMPLOYEE_LIST = function () {
        $scope.EmployeeSearch.IS_LAZY_LOAD_CLICKED = true;
        $scope.HRM_GET_EMPLOYEE_LIST();
    }
    $scope._pageload_flag = 1;
    $scope.isProcessing = false;

    $scope.HRM_GET_EMPLOYEE_LIST = function (FLAG, _pageload_flag, BRANCH_COUNT, DEPARTMENT_COUNT, POSITION_COUNT, STATUS_COUNT) {
        $scope.$parent.overlay_loadingNew = 'block';
        if (FLAG == 1) {
            $scope.EmployeeSearch.PAGE_NO = 1;
            $scope.EMPLOYEE_LIST = [];
            $scope.BRANCH_IDS = false;
            $scope.DEPARTMENT_IDS = false;
            $scope.POSITION_IDS = false;
            $scope.isProcessing = true; // Set flag
            $scope.LOAD_FETCH_TEXT = 'Fetching records!';
        }
        var UserModelObj = new Object();
        UserModelObj.CUSTOMER_ID = $scope.EmployeeSearch.CUSTOMER_ID;
        UserModelObj.ENTITY_ID = $scope.EmployeeSearch.ENTITY_ID;
        UserModelObj.SEARCH = $scope.EmployeeSearch.SEARCH;
        UserModelObj.EMPLY_PRSNL_ID = $cookies.get("EMPLY_PRSNL_ID");
        UserModelObj.USER_ID = $cookies.get("USERID");
        UserModelObj.STANDARD_ROLE_ID = $cookies.get("STANDARD_ROLE_ID");
        UserModelObj.MODULE_ID = $cookies.get("MODULE_ID");
        UserModelObj.BRANCH_IDS = "";
        UserModelObj.DEPARTMENT_IDS = "";
        UserModelObj.POSITION_IDS = "";
        UserModelObj.STATUS_ID_LIST = [];

        var BlankObj = new Object();
        BlankObj.TABLE_ID = 0;

        UserModelObj.BRANCH_COUNT = 0;
        angular.forEach($scope.BRANCH_EMP_LIST, function (_loop_value) {
            if (_loop_value.IS_SELECTED) {
                UserModelObj.BRANCH_COUNT = UserModelObj.BRANCH_COUNT + 1;
                if (UserModelObj.BRANCH_IDS == "") {
                    UserModelObj.BRANCH_IDS = _loop_value.BRANCH_ID;
                }
                else {
                    UserModelObj.BRANCH_IDS = UserModelObj.BRANCH_IDS + "," + _loop_value.BRANCH_ID;
                }
            };
        });
        if ($scope.BRANCH_EMP_LIST.length == UserModelObj.BRANCH_COUNT) {
            UserModelObj.BRANCH_IDS = "";
        }

        UserModelObj.DEPPARTMENT_COUNT = 0;
        angular.forEach($scope.DEPARTMENTS_EMP_LIST, function (_loop_value) {
            if (_loop_value.IS_SELECTED) {
                UserModelObj.DEPPARTMENT_COUNT = UserModelObj.DEPPARTMENT_COUNT + 1;
                //var readonly = new Object();
                //readonly.TABLE_ID = _loop_value.DEPARTMENT_ID;
                //UserModelObj.DEPARTMENTS_ID_LIST.push(readonly);

                if (UserModelObj.DEPARTMENT_IDS == "") {
                    UserModelObj.DEPARTMENT_IDS = _loop_value.DEPARTMENT_ID;
                }
                else {
                    UserModelObj.DEPARTMENT_IDS = UserModelObj.DEPARTMENT_IDS + "," + _loop_value.DEPARTMENT_ID;
                };
            }
        });

        UserModelObj.POSITION_COUNT = 0;
        angular.forEach($scope.POSITIONS_EMP_LIST, function (_loop_value) {
            if (_loop_value.IS_SELECTED) {
                UserModelObj.POSITION_COUNT = UserModelObj.POSITION_COUNT + 1;
                if (UserModelObj.POSITION_IDS == "") {
                    UserModelObj.POSITION_IDS = _loop_value.POSITION_ID;
                }
                else {
                    UserModelObj.POSITION_IDS = UserModelObj.POSITION_IDS + "," + _loop_value.POSITION_ID;
                };
            }
        });
        if ($scope.POSITIONS_EMP_LIST.length == UserModelObj.POSITION_COUNT) {
            UserModelObj.POSITION_IDS = "";
        };
        angular.forEach($scope.EMPLOYEE_STATUSES_LIST, function (_loop_value) {
            if (_pageload_flag) {
                _loop_value.IS_SELECTED = true;
            }
            if (_loop_value.IS_SELECTED) {
                var readonly = new Object();
                readonly.TABLE_ID = _loop_value.EMPLOYEE_STATUS_ID;
                if ($scope._pageload_flag == 1 && $scope.DEPARTMENT_ID > 0 && (_loop_value.EMPLOYEE_STATUS_ID == 6 || _loop_value.EMPLOYEE_STATUS_ID == 5)) {
                    _loop_value.IS_SELECTED = false;
                }
                else if ($scope._pageload_flag == 1 && $scope.TEAM_ID > 0 && (_loop_value.EMPLOYEE_STATUS_ID == 1 || _loop_value.EMPLOYEE_STATUS_ID == 6)) {
                    _loop_value.IS_SELECTED = false;
                    $scope.EmployeeSearch.StatusALL = false;
                }
                else {
                    UserModelObj.STATUS_ID_LIST.push(readonly);
                };
            }
        });
        if (UserModelObj.STATUS_ID_LIST.length == 0) {
            UserModelObj.STATUS_ID_LIST.push(BlankObj);
        }
        if ($scope.DEPARTMENTS_EMP_LIST.length == UserModelObj.DEPPARTMENT_COUNT) {
            UserModelObj.DEPARTMENT_IDS = "";
        }
        else {
            $scope.EmployeeSearch.DepartmentALL = false;
        }
        if ($scope._pageload_flag == 1 && UserModelObj.DEPARTMENT_IDS == "" && $scope.DEPARTMENT_ID > 0) {
            UserModelObj.DEPARTMENT_IDS = getUrlParameter('DID', $location.absUrl());
            $scope.EmployeeSearch.DepartmentALL = false;
            $scope.EmployeeSearch.StatusALL = false;
        }


        UserModelObj.PAGE_NO = $scope.EmployeeSearch.PAGE_NO;
        UserModelObj.PAGE_SIZE = $scope.EmployeeSearch.PAGE_SIZE;
        UserModelObj.DATE_FORMAT = $scope.$parent.DISPLAY_DATE_FORMAT;
        $scope.BRANCH_IDS = false;
        $scope.DEPARTMENT_IDS = false;
        $scope.POSITION_IDS = false;
        $scope.STATUS_IDS = false;
        if (BRANCH_COUNT == 0) {
            UserModelObj.BRANCH_IDS = '-1';
            $scope.BRANCH_IDS = true;
        }
        if (DEPARTMENT_COUNT == 0) {
            UserModelObj.DEPARTMENT_IDS = '-1';
            $scope.DEPARTMENT_IDS = true;
        }
        if (POSITION_COUNT == 0) {
            UserModelObj.POSITION_IDS = '-1';
            $scope.POSITION_IDS = true;
        }
        if (STATUS_COUNT == 0) {
            UserModelObj.STATUS_ID_LIST = [];
            BlankObj.TABLE_ID = '-1';
            $scope.STATUS_IDS = true;
            UserModelObj.STATUS_ID_LIST.push(BlankObj);
        }
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'HRM_GET_EMPLOYEE_LIST').then(function (data) {
            if (data.data.length > 0) {
                $scope.$parent.overlay_loadingNew = 'none';
                //$scope.SET_CHECKBOX_ALL();
                if ($scope.EmployeeSearch.IS_ALL_SELECTED) {
                    for (var i = 0; i < data.data.length; i++) {
                        data.data[i].IS_SELECTED = $scope.EmployeeSearch.IS_ALL_SELECTED;
                    }
                }
                $scope.EMPLOYEE_LIST = $scope.EMPLOYEE_LIST.concat(data.data);
                $scope.EmployeeSearch.TOTAL_COUNT = $scope.EMPLOYEE_LIST[0].TOTAL_COUNT;
                if (data.data.length < $scope.EmployeeSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.EmployeeSearch.PAGE_NO = parseInt($scope.EmployeeSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else {
                if ($scope.EMPLOYEE_LIST.length == 0) {
                    $scope.LOAD_FETCH_TEXT = 'No records yet!';
                }
                $scope.GetData = false;
                $scope.$parent.overlay_loadingNew = 'none';
            }
            $scope._pageload_flag = 0;

            setTimeout(() => {
                $scope.isProcessing = false; // Reset flag after processing
                $scope.$apply(); // Ensure the view updates
            }, 2000);
        });
    }

    $scope.HRM_EMPLOYEE_PASSWORD_RESET = function (_employee) {
        var UserModelObj = new Object();
        UserModelObj.EMPLY_PRSNL_ID = _employee.EMPLY_PRSNL_ID;
        UserModelObj.ENTITY_ID = $cookies.get("ENTITY_ID");
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'HRM_EMPLOYEE_PASSWORD_RESET').then(function (data) {
            if (data.data == 1) {
                $scope.$parent.ShowAlertBox("Success", "Password reset link send to email successfully", 3000);
            }
            if (data.data == 0) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
        });
    }

    $scope.HRM_EMPLOYEE_DELETE = function (_employee) {
        var UserModelObj = new Object();
        UserModelObj.EMPLY_PRSNL_ID = _employee.EMPLY_PRSNL_ID;
        UserModelObj.USER_ID = $cookies.get("USERID");
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'HRM_EMPLOYEE_DELETE').then(function (data) {
            if (data.data == 1) {
                $scope.$parent.ShowAlertBox("Success", "Deleted successfully", 3000);
                $('#DELETE_EMPLOYEE_BY_ID').modal('hide');
                $scope.HRM_GET_EMPLOYEE_LIST(1);
            }
            if (data.data == 0) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
            $('#DELETE_EMPLOYEE_BY_ID').modal('hide');
        });
    };

    $scope.HRM_GET_REPORTING_EMPLOYEE_LIST_FOR_MANAGER_TERMINATION = function () {
        var UserModelObj = new Object();
        UserModelObj.MANAGER_EMPLY_PRSNL_ID = $scope.SELECTED_TERMINATED_EMPLOYEE_EMPLOYEE.EMPLY_PRSNL_ID;
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'HRM_GET_REPORTING_EMPLOYEE_LIST_FOR_MANAGER_TERMINATION').then(function (data) {
            if (data.data == null) {
                $scope.$parent.ShowAlert("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
            if (data.data.Table.length > 0) {
                $scope.HRM_GET_REPORTING_EMPLOYEE_LIST_FOR_MANAGER_TERMINATION_LIST = data.data.Table;
                //$scope.HRM_GET_REPORTING_MANAGER(1);
                $('#Termination_Popup').modal('show');
            }
            else {
                $('#Termination_Popup').modal('show');
            }
        });
    }

    $scope.DELETE_EMPLOYEE_Fn = function (_employee) {
        $scope.SELECTED_EMPLOYEE = _employee;
        $('#DELETE_EMPLOYEE_BY_ID').modal('show');

        // $scope.$parent.DATE_INPUT_LOAD('HRM', 1, 0)
    };



    $scope.TERMINATE_EMPLOYEE_Fn = function (_employee) {
        $scope.SELECTED_TERMINATED_EMPLOYEE_EMPLOYEE = _employee;
        $scope.REPORTING_MANAGER_LIST = [];
        $scope.HRM_GET_REPORTING_EMPLOYEE_LIST_FOR_MANAGER_TERMINATION_LIST = [];
        //$scope.SELECTED_REPORTING_MANAGER('', $scope.TerminationSearch);
        $scope.HRM_GET_TERMINATION_REASONS($scope.SELECTED_TERMINATED_EMPLOYEE_EMPLOYEE);
        $scope.HRM_GET_REPORTING_EMPLOYEE_LIST_FOR_MANAGER_TERMINATION();
        // Subtract month
        let currentDate = moment($scope.CURRENT_DATE);
        let newDate = currentDate.subtract(1, 'months');
        $('.dateinputleaver').datepicker('destroy');
        if (moment(_employee.HIRING_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate() > moment(newDate, $scope.$parent.CONVERSION_DATE_FORMAT).toDate()) {
            $scope.$parent.DATE_INPUT_LOAD('HRM', 1, 'leaver', moment(_employee.HIRING_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).format('L'));
        }
        else {
            $scope.$parent.DATE_INPUT_LOAD('HRM', 1, 'leaver');
        }
    };
    $scope.HRM_INS_UPD_EMPLOYEE_TERMINATION = function () {
        //  all your leave cancel and shif  past the termin date will bee auto cancel, Do you want to process
        $scope.EmployeeTeminationForm.submitted = true;
        if ($scope.EmployeeTeminationForm.$valid) {
            if (confirm('All future leaves and shifts after the Termination date will be cancelled and deleted, respectively. Do you still want to proceed?')) {
                var UserModelObj = new Object();
                UserModelObj.EMPLOYEE_TERMINATION_ID = $scope.SELECTED_TERMINATED_EMPLOYEE_EMPLOYEE.EMPLOYEE_TERMINATION_ID;
                if ($cookies.get("EMPLY_PRSNL_ID") != null && $cookies.get("EMPLY_PRSNL_ID") != '' && $cookies.get("EMPLY_PRSNL_ID") != '0') {
                    UserModelObj.TERMINATOR_EMPLY_PRSNL_ID = $cookies.get("EMPLY_PRSNL_ID");
                }
                else {
                    UserModelObj.TERMINATOR_EMPLY_PRSNL_ID = null;
                }
                UserModelObj.USER_ID = $cookies.get("USERID");
                UserModelObj.EMPLY_PRSNL_ID = $scope.SELECTED_TERMINATED_EMPLOYEE_EMPLOYEE.EMPLY_PRSNL_ID;
                //UserModelObj.TERMINATION_DATE =  $scope.TerminationSearch.TERMINATION_DATE;//Done
                UserModelObj.TERMINATION_DATE = moment($scope.TerminationSearch.TERMINATION_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).format('L');//Done
                UserModelObj.TERMINATION_REASON_ID = $scope.TerminationSearch.TERMINATION_REASONS_ID;//Done
                UserModelObj.TERMINATION_COMMENTS = $scope.TerminationSearch.TERMINATION_COMMENTS;
                UserModelObj.IS_DISCARD = $scope.TerminationSearch.IS_DISCARD;
                UserModelObj.DISCARD_COMMENT = $scope.TerminationSearch.DISCARD_COMMENT;
                UserModelObj.PAY_HOLIDAY = $scope.TerminationSearch.PAY_HOLIDAY ? 1 : 0;
                UserModelObj.REPLACEMENT_MANAGER_EMPLY_PRSNL_ID = $scope.TerminationSearch.REPORTING_MANAGER_ID;
                UserModelObj.ENTITY_ID = $cookies.get("ENTITY_ID");
                PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'HRM_INS_UPD_EMPLOYEE_TERMINATION').then(function (data) {
                    if (data.data == 1) {
                        $scope.$parent.ShowAlertBox("Success", "employee terminated successfully", 3000);
                        $('#Termination_Popup').modal('hide');
                        $scope.HRM_GET_EMPLOYEE_LIST(1);
                    }
                    if (data.data == 0) {
                        $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                    }
                });
            }
        }
    }
    $scope.ADMIN_GET_BRANCH_LIST();
    $scope.ADMIN_GET_DEPARTMENT_POSITION_Fn();
    $scope.HRM_GET_EMPLOYEE_STATUSES();
    $scope.HRM_GET_BULK_UPDATE_TYPE_DROPDOWN();

    $scope.HRM_INS_UPD_EMPLOYEE_INVITE_LIST = [];
    $scope.ADD_INVITE_APPLICANT_Fn = function () {
        $scope.HRM_INS_UPD_EMPLOYEE_INVITE_LIST.push(angular.copy($scope.BLANK_INVITE_LIST));
    };
    $scope.ADD_INVITE_APPLICANT_Fn();

    $scope.DELETE_INVITE_APPLICANT_Fn = function (_invite_applicant, index) {
        $scope.HRM_INS_UPD_EMPLOYEE_INVITE_LIST.splice(index, 1);
    }
    $scope.HRM_GET_USER_MANAGEMENT_ACCESS = function () {
        var EmploymentInfoObject = new Object();
        EmploymentInfoObject.CUSTOMER_ID = $cookies.get("CUSTOMER_ID");
        EmploymentInfoObject.ENTITY_ID = $cookies.get("ENTITY_ID");
        EmploymentInfoObject.EMPLY_PRSNL_ID = $cookies.get("EMPLY_PRSNL_ID");
        PrcCommMethods.HUMANRESOURCE_API(EmploymentInfoObject, 'HRM_GET_USER_MANAGEMENT_ACCESS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.BRANCH_DROPDOWN = data.data.Table.filter(x => x.TIME_SHEETS == true);
            }
            else if (data.data == 0) {
                $scope.BRANCH_DROPDOWN = [];
            }
        });
    };

    $scope.SENT_INVITE = function () {
        $scope.HRM_GET_USER_MANAGEMENT_ACCESS();
        $('#Invite_Applicant').modal('show');
    }
    $scope.HRM_INS_UPD_EMPLOYEE_INVITE = function () {
        $scope.InviteForm.submitted = true;
        if ($scope.InviteForm.$valid && $scope.HRM_INS_UPD_EMPLOYEE_INVITE_LIST.length > 0) {
            var UserModelObj = new Object();
            UserModelObj.CUSTOMER_ID = $scope.EmployeeSearch.CUSTOMER_ID;
            UserModelObj.COMMENTS = $scope.EmployeeSearch.COMMENTS;
            UserModelObj.USER_ID = $scope.EmployeeSearch.USER_ID;
            UserModelObj.BRANCH_ID = $scope.EmployeeSearch.BRANCH_ID;
            UserModelObj.ENTITY_ID = $scope.EmployeeSearch.ENTITY_ID;
            UserModelObj.HRM_EMPLOYEE_INVITE_TYPE = [];
            angular.forEach($scope.HRM_INS_UPD_EMPLOYEE_INVITE_LIST, function (_invite_loop_value) {
                var inviteobj = new Object();
                inviteobj.FIRST_NAME = _invite_loop_value.FIRST_NAME;
                inviteobj.LAST_NAME = _invite_loop_value.LAST_NAME;
                inviteobj.EMAIL = _invite_loop_value.EMAIL;
                UserModelObj.HRM_EMPLOYEE_INVITE_TYPE.push(inviteobj);
            });
            PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'HRM_INS_UPD_EMPLOYEE_INVITE').then(function (data) {
                if (data.data == 0) {
                    $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                } else if (data.data > 1) {
                    $('#Invite_Applicant').modal('hide');
                    $scope.HRM_INS_UPD_EMPLOYEE_INVITE_LIST = [];
                    $scope.ADD_INVITE_APPLICANT_Fn();
                    $scope.ADD_INVITE_APPLICANT_Fn();
                    $scope.$parent.ShowAlertBox("Success", 'Invitation send successfully', 3000);
                    $scope.SELECTED_BRANCH_Fn('');
                    $scope.EmployeeSearch.BRANCH_ID = "";
                    $scope.InviteForm.submitted = false;
                    $scope.HRM_GET_EMPLOYEE_LIST(1);
                };
            });
        }
        if ($scope.InviteForm.$valid && $scope.HRM_INS_UPD_EMPLOYEE_INVITE_LIST.length == 0) {
            $scope.$parent.ShowAlertBox("Error", 'Please add at least one member.', 3000);
        }
    }
    $scope.CLICK_TABLE_VIEW_Fn = function (_pram_table) {
        $scope.TABLE_VIEW_DISPALY_TEXT = _pram_table.NAME;
        $scope.TABLE_VIEW_ID = _pram_table.ID;
    }
    $scope.CLICK_TABLE_VIEW_Fn($scope.TABLE_VIEW_LIST[0]);    //  $scope.LOAD_VALUES = 'No records yet!';
    $scope.BRANCH_MSG = 'At least one site should be selected';
    $scope.DEPARTMENT_MSG = 'At least one department should be selected';
    $scope.POSITION_MSG = 'At least one position should be selected';
    $scope.STATUS_MSG = 'At least one status should be selected';

    $scope.FILTER_Fn = function (CLICK_FLAG) {
        var BRANCH_COUNT = 1, DEPARTMENT_COUNT = 1; POSITION_COUNT = 1, STATUS_COUNT = 1;
        if ($scope.BRANCH_EMP_LIST.length == $scope.BRANCH_EMP_LIST.filter(function (x) { return x.IS_SELECTED }).length) {
            $scope.EmployeeSearch.BranchALL = true;
        }
        else if ($scope.BRANCH_EMP_LIST.filter(function (x) { return x.IS_SELECTED == false }).length == $scope.BRANCH_EMP_LIST.length) {
            if (CLICK_FLAG == 1) {
                $scope.$parent.ShowAlertBox("Success", $scope.BRANCH_MSG, 3000);
            }
            BRANCH_COUNT = 0;
        }
        else {
            $scope.EmployeeSearch.BranchALL = false;
        }

        if ($scope.DEPARTMENTS_EMP_LIST.length == $scope.DEPARTMENTS_EMP_LIST.filter(function (x) { return x.IS_SELECTED }).length) {
            $scope.EmployeeSearch.DepartmentALL = true;
        }
        else if ($scope.DEPARTMENTS_EMP_LIST.filter(function (x) { return x.IS_SELECTED == false }).length == $scope.DEPARTMENTS_EMP_LIST.length) {
            if (CLICK_FLAG == 2) {
                $scope.$parent.ShowAlertBox("Success", $scope.DEPARTMENT_MSG, 3000);
            }
            DEPARTMENT_COUNT = 0;
        }
        else {
            $scope.EmployeeSearch.DepartmentALL = false;
        }

        if ($scope.POSITIONS_EMP_LIST.length == $scope.POSITIONS_EMP_LIST.filter(function (x) { return x.IS_SELECTED }).length) {
            $scope.EmployeeSearch.PositionALL = true;
        }
        else if ($scope.POSITIONS_EMP_LIST.filter(function (x) { return x.IS_SELECTED == false }).length == $scope.POSITIONS_EMP_LIST.length) {
            if (CLICK_FLAG == 3) {
                $scope.$parent.ShowAlertBox("Success", $scope.POSITION_MSG, 3000);
            }
            POSITION_COUNT = 0;
        }
        else {
            $scope.EmployeeSearch.PositionALL = false;
        }

        if ($scope.EMPLOYEE_STATUSES_LIST.length == $scope.EMPLOYEE_STATUSES_LIST.filter(function (x) { return x.IS_SELECTED }).length) {
            $scope.EmployeeSearch.StatusALL = true;
        }
        else if ($scope.EMPLOYEE_STATUSES_LIST.filter(function (x) { return x.IS_SELECTED == false }).length == $scope.EMPLOYEE_STATUSES_LIST.length) {
            if (CLICK_FLAG == 4) {
                $scope.$parent.ShowAlertBox("Success", $scope.STATUS_MSG, 3000);
            }
            STATUS_COUNT = 0;
        }
        else {
            $scope.EmployeeSearch.StatusALL = false;
        }

        $scope.HRM_GET_EMPLOYEE_LIST(1, false, BRANCH_COUNT, DEPARTMENT_COUNT, POSITION_COUNT, STATUS_COUNT);
    };

    $scope.BRANCH_APPLY_ALL_Fn = function (BRANCH_COUNT) {
        $scope.EmployeeSearch.BranchALL = true;
        if (BRANCH_COUNT == $scope.BRANCH_EMP_LIST.length) {
            $scope.EmployeeSearch.BranchALL = false;
            $scope.$parent.ShowAlertBox("Success", $scope.BRANCH_MSG, 3000);
        }
        angular.forEach($scope.BRANCH_EMP_LIST, function (item) {
            item.IS_SELECTED = $scope.EmployeeSearch.BranchALL;
        });
        $scope.HRM_GET_EMPLOYEE_LIST(1, false, $scope.BRANCH_EMP_LIST.filter(function (x) { return x.IS_SELECTED }).length, $scope.DEPARTMENTS_EMP_LIST.filter(function (x) { return x.IS_SELECTED }).length, $scope.POSITIONS_EMP_LIST.filter(function (x) { return x.IS_SELECTED }).length);
    }

    $scope.DEPARTMENT_APPLY_ALL_Fn = function (DEPARTMENT_COUNT) {
        $scope.EmployeeSearch.DepartmentALL = true;
        if (DEPARTMENT_COUNT == $scope.DEPARTMENTS_EMP_LIST.length) {
            $scope.EmployeeSearch.DepartmentALL = false;
            $scope.$parent.ShowAlertBox("Success", $scope.DEPARTMENT_MSG, 3000);
        }
        angular.forEach($scope.DEPARTMENTS_EMP_LIST, function (item) {
            item.IS_SELECTED = $scope.EmployeeSearch.DepartmentALL;
        });
        $scope.HRM_GET_EMPLOYEE_LIST(1, false, $scope.BRANCH_EMP_LIST.filter(function (x) { return x.IS_SELECTED }).length, $scope.DEPARTMENTS_EMP_LIST.filter(function (x) { return x.IS_SELECTED }).length, $scope.POSITIONS_EMP_LIST.filter(function (x) { return x.IS_SELECTED }).length, $scope.EMPLOYEE_STATUSES_LIST.filter(function (x) { return x.IS_SELECTED }).length);
    }
    $scope.POSTION_APPLY_ALL_Fn = function (POSITION_COUNT) {
        $scope.EmployeeSearch.PositionALL = true;
        if (POSITION_COUNT == $scope.POSITIONS_EMP_LIST.length) {
            $scope.EmployeeSearch.PositionALL = false;
            $scope.$parent.ShowAlertBox("Success", $scope.POSITION_MSG, 3000);
        };
        angular.forEach($scope.POSITIONS_EMP_LIST, function (item) {
            item.IS_SELECTED = $scope.EmployeeSearch.PositionALL;
        });
        $scope.HRM_GET_EMPLOYEE_LIST(1, false, $scope.BRANCH_EMP_LIST.filter(function (x) { return x.IS_SELECTED }).length, $scope.DEPARTMENTS_EMP_LIST.filter(function (x) { return x.IS_SELECTED }).length, $scope.POSITIONS_EMP_LIST.filter(function (x) { return x.IS_SELECTED }).length, $scope.EMPLOYEE_STATUSES_LIST.filter(function (x) { return x.IS_SELECTED }).length);
    }

    $scope.STATUSES_APPLY_ALL_Fn = function (STATUS_COUNT) {
        $scope.EmployeeSearch.StatusALL = true;
        if (STATUS_COUNT == $scope.EMPLOYEE_STATUSES_LIST.length) {
            $scope.EmployeeSearch.StatusALL = false;
            $scope.$parent.ShowAlertBox("Success", $scope.STATUS_MSG, 3000);
        };
        angular.forEach($scope.EMPLOYEE_STATUSES_LIST, function (item) {
            item.IS_SELECTED = $scope.EmployeeSearch.StatusALL;
        });
        $scope.HRM_GET_EMPLOYEE_LIST(1, false, $scope.BRANCH_EMP_LIST.filter(function (x) { return x.IS_SELECTED }).length, $scope.DEPARTMENTS_EMP_LIST.filter(function (x) { return x.IS_SELECTED }).length, $scope.POSITIONS_EMP_LIST.filter(function (x) { return x.IS_SELECTED }).length, $scope.EMPLOYEE_STATUSES_LIST.filter(function (x) { return x.IS_SELECTED }).length);
    }
    $scope.SELECTED_BRANCH_Fn = function (_branch) {
        if (_branch == '') {
            $scope.EmployeeSearch.CUSTOM_BRANCH_NAME = $scope.EmployeeSearch.DD_DEFAULT_TEXT;
            $scope.EmployeeSearch.BRANCH_ID = '';
        }
        else {
            $scope.EmployeeSearch.CUSTOM_BRANCH_NAME = _branch.BRANCH_NAME;
            $scope.EmployeeSearch.BRANCH_ID = _branch.BRANCH_ID;
        }
    }
    $scope.SELECTED_BRANCH_Fn('');

    $scope.SELECTED_EMPLOYEE_LIST = [];

    $scope.SET_CHECKBOX_ALL = function () {
        for (var i = 0; i < $scope.EMPLOYEE_LIST.length; i++) {
            $scope.EMPLOYEE_LIST[i].IS_SELECTED = $scope.EmployeeSearch.IS_ALL_SELECTED;
        }
    };
    $scope.HRM_EMPLOYEE_RESEND_INVITE = function (_employee) {
        var UserModelObj = new Object();
        var BlankObj = new Object();
        UserModelObj.TABLE_ID_LIST = [];
        BlankObj.TABLE_ID = _employee.EMPLY_PRSNL_ID;
        UserModelObj.TABLE_ID_LIST.push(BlankObj);
        UserModelObj.USER_ID = $cookies.get("USERID");
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'HRM_EMPLOYEE_RESEND_INVITE').then(function (data) {
            if (data.data == 1) {
                $scope.$parent.ShowAlertBox("Success", "Invitation resend successfully", 3000);
            }
            if (data.data == 0) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
        });
    };
    $scope.CHECK_EMIL_INVITE = function (_invite) {
        if (_invite.EMAIL != null && _invite.EMAIL != '' && _invite.EMAIL != undefined) {
            angular.forEach($scope.EMPLOYEE_LIST, function (_param) {
                if (_param.EMPLOYEE_STATUS_ID == 1) {
                    if (_param.EMAIL == _invite.EMAIL) {
                        $scope.$parent.ShowAlertBox("Attention", _invite.EMAIL + ' Email id is already send invite.', 3000);
                        _invite.EMAIL = '';
                    }
                }
            })
        }
    }
    //Bulk Upload;
    $scope.SELECTED_EMPLOYEES_Fn = function () {
        $scope.EmployeeSearch.IS_ALL_SELECTED = true;
        for (var i = 0; i < $scope.EMPLOYEE_LIST.length; i++) {
            if (!$scope.EMPLOYEE_LIST[i].IS_SELECTED) {
                $scope.EmployeeSearch.IS_ALL_SELECTED = false;
                break
            }
        }
    }

    $scope.SELECTED_DDL_BRANCH_Fn = function (_branch) {
        if (_branch == '') {
            $scope.EmployeeSearch.CUSTOM_DDL_BRANCH_NAME = $scope.EmployeeSearch.DD_DEFAULT_TEXT;
            $scope.EmployeeSearch.DDL_BRANCH_ID = "";
        }
        else {
            $scope.EmployeeSearch.CUSTOM_DDL_BRANCH_NAME = _branch.BRANCH_NAME;
            $scope.EmployeeSearch.DDL_BRANCH_ID = _branch.BRANCH_ID;
        }
    }
    $scope.SELECTED_DDL_BRANCH_Fn('');

    $scope.SELECTED_DDL_DEPARTMENT_Fn = function (_department) {
        if (_department == '') {
            $scope.EmployeeSearch.CUSTOM_DDL_DEPARTMENT_NAME = $scope.EmployeeSearch.DD_DEFAULT_TEXT;
            $scope.EmployeeSearch.DDL_DEPARTMENT_ID = "";
        }
        else {
            $scope.EmployeeSearch.CUSTOM_DDL_DEPARTMENT_NAME = _department.DEPARTMENT_NAME;
            $scope.EmployeeSearch.DDL_DEPARTMENT_ID = _department.DEPARTMENT_ID;
        }
    }
    $scope.SELECTED_DDL_DEPARTMENT_Fn('');

    $scope.SELECTED_DDL_POSITION_Fn = function (_position) {
        if (_position == '') {
            $scope.EmployeeSearch.CUSTOM_DDL_POSITION_NAME = $scope.EmployeeSearch.DD_DEFAULT_TEXT;
            $scope.EmployeeSearch.DDL_POSITION_ID = "";
        }
        else {
            $scope.EmployeeSearch.CUSTOM_DDL_POSITION_NAME = _position.POSITION_NAME;
            $scope.EmployeeSearch.DDL_POSITION_ID = _position.POSITION_ID;
        }
    }
    $scope.SELECTED_DDL_DEPARTMENT_Fn('');
    $scope.SELECTED_DDL_POSITION_Fn('');


    $scope.CANCEL_MANAGE_EMPLOYEE_Fn = function (_manage_id) {

        $scope.MANAGE_EMPLOYEE_Fn('');
    }
    $scope.BACK_TO_EDIT_Fn = function (_manage_id) {
        $scope.EmployeeSearch.PREVIEW_FLAG = 0;
    }
    $scope.BULK_UPLOAD_PREVIEW_Fn = function (_Preview) {
        $scope.EmployeeSearch.PREVIEW_FLAG = _Preview || 1;
    }


    $scope.getManagerEmployeeFilter = function () {
        let filters = {};
        if ($scope.EmployeeSearch.BULK_EMPLOYEE_SEARCH) {
            filters['EMPLOYEE_NAME'] = $scope.EmployeeSearch.BULK_EMPLOYEE_SEARCH;
        }
        if ($scope.EmployeeSearch.DDL_DEPARTMENT_ID) {
            filters['DEPARTMENT_ID'] = $scope.EmployeeSearch.DDL_DEPARTMENT_ID;
        }
        if ($scope.EmployeeSearch.DDL_BRANCH_ID) {
            filters['BRANCH_ID'] = $scope.EmployeeSearch.DDL_BRANCH_ID;
        }
        if ($scope.EmployeeSearch.DDL_POSITION_ID) {
            filters['POSITION_ID'] = $scope.EmployeeSearch.DDL_POSITION_ID;
        }

        return filters;
    };
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
    $scope.dateinputEffectiveDate = function () {
        $(document).ready(function () {
            var date_inputs = document.getElementsByClassName("EffectiveDate") //our date input has the name "date"
            if (date_inputs.length > 0) {
                for (var i = 0; i < date_inputs.length; i++) {
                    var date_input = $('input[name="' + date_inputs[i].name + '"]'); //our date input has the name "date"
                    var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
                    var date = new Date($scope.CURRENT_DATE);
                    var options = {
                        todayBtn: "linked",
                        daysOfWeekHighlighted: "0,6",
                        autoclose: true,
                        todayHighlight: true,
                        format: 'dd/mm/yyyy',
                        clearBtn: true,
                        closeBtn: true,// close button visible
                        startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate())
                    };
                    date_input.datepicker(options);
                }
            }
        });
    }
    $scope.MANAGE_EMPLOYEE_Fn = function (_manage) {

        if (_manage == '') {
            $scope.EmployeeSearch.CUSTOM_MANAGE_NAME = $scope.EmployeeSearch.DD_DEFAULT_BULK_UPDATE_TEXT;
            $scope.EmployeeSearch.BULK_UPDATE_TYPE_ID = 0;
            //$scope.EmployeeSearch.EFFECTIVE_FROM = '';
        }
        else {
            $scope.dateinputEffectiveDate();
            $scope.EmployeeSearch.CUSTOM_MANAGE_NAME = _manage.BULK_UPDATE_TYPE;
            $scope.EmployeeSearch.BULK_UPDATE_TYPE_ID = _manage.BULK_UPDATE_TYPE_ID;
            $scope.SELECTED_EMPLOYEE_LIST = [];
            if (_manage.BULK_UPDATE_TYPE_ID == 1) { // Add Manager
                $scope.BulkForm.submitted = false;
                $scope.EmployeeSearch.BULK_EMPLOYEE_SEARCH = '';
                $scope.EmployeeSearch.CUSTOM_DDL_BRANCH_NAME = $scope.EmployeeSearch.DD_DEFAULT_TEXT;
                $scope.EmployeeSearch.DDL_BRANCH_ID = "";
                $scope.EmployeeSearch.CUSTOM_DDL_DEPARTMENT_NAME = $scope.EmployeeSearch.DD_DEFAULT_TEXT;
                $scope.EmployeeSearch.DDL_DEPARTMENT_ID = "";
                $scope.EmployeeSearch.CUSTOM_DDL_POSITION_NAME = $scope.EmployeeSearch.DD_DEFAULT_TEXT;
                $scope.EmployeeSearch.DDL_POSITION_ID = "";
                $scope.EmployeeSearch.EFFECTIVE_FROM = '';
                $scope.EmployeeSearch.CUSTOME_REPORTING_MANAGER = $scope.EmployeeSearch.DD_DEFAULT_TEXT;
                $scope.EmployeeSearch.REPORTING_MANAGER_ID = '';
                $scope.HRM_GET_REPORTING_MANAGER();
            }
            else if (_manage.BULK_UPDATE_TYPE_ID == 2) { // Terminate 
                $scope.TerminationForm.submitted = false;
                $scope.TerminationSearch.BULK_EMPLOYEE_SEARCH = '';
                $scope.TerminationSearch.CUSTOM_TERMINATION_BRANCH_NAME = $scope.TerminationSearch.DD_DEFAULT_TEXT;
                $scope.TerminationSearch.TERMINATION_BRANCH_ID = '';
                $scope.TerminationSearch.CUSTOM_TERMINATION_DEPARTMENT_NAME = $scope.TerminationSearch.DD_DEFAULT_TEXT;
                $scope.TerminationSearch.TERMINATION_DEPARTMENT_ID = '';
                $scope.TerminationSearch.CUSTOM_TERMINATION_POSITION_NAME = $scope.TerminationSearch.DD_DEFAULT_TEXT;
                $scope.TerminationSearch.TERMINATION_POSITION_ID = '';
                $scope.TerminationSearch.CUSTOM_TERMINATION_REASON = $scope.TerminationSearch.DD_DEFAULT_TEXT;
                $scope.TerminationSearch.TERMINATION_REASONS_ID = '';
                $scope.TerminationSearch.EFFECTIVE_FROM = '';
                $scope.HRM_GET_TERMINATION_REASONS();
            }
            else if (_manage.BULK_UPDATE_TYPE_ID == 5) {//Assign Workparttern 
                $scope.WorkPatternForm.submitted = false;
                $scope.WorkPatternSearch.BULK_EMPLOYEE_SEARCH = '';
                $scope.WorkPatternSearch.CUSTOM_WORK_PATTERN_BRANCH_NAME = $scope.WorkPatternSearch.DD_DEFAULT_TEXT;
                $scope.WorkPatternSearch.WORK_PATTERN_BRANCH_ID = '';
                $scope.WorkPatternSearch.CUSTOM_WORK_PATTERN_DEPARTMENT_NAME = $scope.WorkPatternSearch.DD_DEFAULT_TEXT;
                $scope.WorkPatternSearch.WORK_PATTERN_DEPARTMENT_ID = '';
                $scope.WorkPatternSearch.CUSTOM_WORK_PATTERN_POSITION_NAME = $scope.WorkPatternSearch.DD_DEFAULT_TEXT;
                $scope.WorkPatternSearch.WORK_PATTERN_POSITION_ID = '';
                $scope.WorkPatternSearch.EFFECTIVE_FROM = '';
                $scope.WorkPatternSearch.CUSTOM_WORK_PATTERN_TITLE = $scope.WorkPatternSearch.DD_DEFAULT_TEXT;
                $scope.WorkPatternSearch.WORK_PATTERN_ID = '';
                $scope.HRM_GET_WORK_PATTERNS();
            }
            else if (_manage.BULK_UPDATE_TYPE_ID == 9) { // Not working on this phase
                //$scope.HRM_GET_PAYTYPES();
            }
            else if (_manage.BULK_UPDATE_TYPE_ID == 7) { // Export
                $scope.EmployeeSearch.BULK_UPDATE_TYPE_ID = 0;
                $scope.SELECTED_EMPLOYEE_EXPORT();
            }
        }

    }
    //$scope.MANAGE_EMPLOYEE_Fn("");
    $scope.HRM_GET_EMPLOYEE_LIST_FOR_BULK_UPDATE = function () {
        var UserModelObj = new Object();
        UserModelObj.BULK_UPDATE_TYPE_ID = $scope.EmployeeSearch.BULK_UPDATE_TYPE_ID;
        UserModelObj.TABLE_ID_LIST = [];
        $scope.SELECTED_EMPLOYEE_LIST_COPY = [];
        angular.forEach($scope.EMPLOYEE_LIST, function (_selected) {
            if (_selected.IS_SELECTED == true) {
                _selected.IS_SELECTED_NO_MANAGER = false;
                $scope.SELECTED_EMPLOYEE_LIST_COPY.push(_selected);
                var emptableids = new Object();
                emptableids.TABLE_ID = _selected.EMPLY_PRSNL_ID;
                UserModelObj.TABLE_ID_LIST.push(emptableids);
            };
        });
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'HRM_GET_EMPLOYEE_LIST_FOR_BULK_UPDATE').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.EMPLOYEE_LIST_FOR_BULK_UPDATE_LIST = data.data.Table;
                $scope.SELECTED_EMPLOYEE_LIST = [];
                $scope.SELECTED_EMPLOYEE_LIST_TERMINATE = [];
                $scope.SELECTED_EMPLOYEE_LIST_WORK_PATTERN = [];

                if ($scope.EmployeeSearch.BULK_UPDATE_TYPE_ID == 1) {
                    $scope.SELECTED_EMPLOYEE_LIST = angular.copy($scope.EMPLOYEE_LIST_FOR_BULK_UPDATE_LIST);
                    angular.forEach($scope.SELECTED_EMPLOYEE_LIST, function (_val) {
                        _val.IS_DELETED = 0;
                    })
                } else if ($scope.EmployeeSearch.BULK_UPDATE_TYPE_ID == 2) {
                    $scope.SELECTED_EMPLOYEE_LIST_TERMINATE = angular.copy($scope.EMPLOYEE_LIST_FOR_BULK_UPDATE_LIST);
                    angular.forEach($scope.SELECTED_EMPLOYEE_LIST_TERMINATE, function (_val) {
                        _val.IS_DELETED = 0;
                    })
                } else if ($scope.EmployeeSearch.BULK_UPDATE_TYPE_ID == 5) {
                    $scope.SELECTED_EMPLOYEE_LIST_WORK_PATTERN = angular.copy($scope.EMPLOYEE_LIST_FOR_BULK_UPDATE_LIST);
                    angular.forEach($scope.SELECTED_EMPLOYEE_LIST_WORK_PATTERN, function (_val) {
                        _val.IS_DELETED = 0;
                    })
                }
            }
            else if (data.data == 0) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            };
        });
    }
    // //////////////////Manager Update////////////////
    $scope.nginit_bulkmanager = function (_employee, index, last) {
        if (last) {
            $scope.dateinputEffectiveDate();
            // $scope.$parent.$parent.DateInputLoad();
        }
        _employee.SHORT_NAME = $scope.TextReturn(_employee.EMPLOYEE_NAME);
        // _employee.IS_DELETED = 0;
        if (_employee.EMPLOYEE_STATUS_ID == 3 || _employee.EMPLOYEE_STATUS_ID == 7 || _employee.EMPLOYEE_STATUS_ID == 4) {
            _employee.IS_EXCETION = false;
            _employee.IS_SELECTED_NO_MANAGER = false;

        } else {
            _employee.IS_EXCETION = true;
            _employee.IS_SELECTED_NO_MANAGER = true;
        }
        if (_employee.REPORTEE_COUNT != 0) {
            // _employee.EFFECTIVE_FROM = '';
            if (_employee.PRIMARY_REPORTING_MANAGER_ID == null) {
                _employee.IS_SELECTED_NO_MANAGER = true;
            }
        }
        if (!_employee.IS_EXCETION) {
            //var _emp_data = $scope.EMPLOYEE_LIST_FOR_BULK_UPDATE_LIST.filter(_emp => _emp.EMPLY_PRSNL_ID == _employee.EMPLY_PRSNL_ID);
            // if (_emp_data != undefined && _emp_data.length > 0) {
            var _reportee_data = $scope.REPORTING_MANAGER_LIST.filter(_reportee => _reportee.ID == _employee.PRIMARY_REPORTING_MANAGER_ID);
            if (_reportee_data != undefined && _reportee_data.length > 0) {
                _employee.CUSTOME_REPORTING_MANAGER = _reportee_data[0].EMPLOYEE_NAME;
                _employee.PRIMARY_REPORTING_MANAGER_ID = _reportee_data[0].ID;
                _employee.SECONDARY_REPORTING_MANAGER_ID = _employee.SECONDARY_REPORTING_MANAGER_ID;
                _employee.TERTIARY_REPORTING_MANAGER_ID = _employee.TERTIARY_REPORTING_MANAGER_ID;
            };
            //};

        }

    }
    $scope.nginit_Terminatemanager = function (_employee, index, last) {

        if (last) {
            $scope.dateinputEffectiveDate();
            // $scope.$parent.$parent.DateInputLoad();
        }
        _employee.SHORT_NAME = $scope.TextReturn(_employee.EMPLOYEE_NAME);
        // _employee.IS_DELETED = 0;
        if (_employee.EMPLOYEE_STATUS_ID == 3 || _employee.EMPLOYEE_STATUS_ID == 7 || _employee.EMPLOYEE_STATUS_ID == 4) {
            _employee.IS_EXCETION = false;

        } else {
            _employee.IS_EXCETION = true;
        }
        //$scope.SELECTED_EMPLOYEE_LIST_TERMINATE.filter(function (x) { return x.IS_DELETED == 0});


    }

    // ---------------  Termination -------------------
    $scope.TerminationSearch = {
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        CUSTOMER_ID: $cookies.get("CUSTOMER_ID"),
        ENTITY_ID: null,
        EMPLY_PRSNL_ID: $cookies.get("EMPLY_PRSNL_ID"),
        MODULE_ID: $cookies.get("MODULE_ID"),
        USER_ID: $cookies.get("USERID"),
        DD_DEFAULT_TEXT: $scope.$parent.DD_DEFAULT_TEXT,
        CUSTOM_TERMINATION_REASON: $scope.$parent.DD_DEFAULT_TEXT,
        CUSTOM_TERMINATION_BRANCH_NAME: $scope.$parent.DD_DEFAULT_TEXT,
        CUSTOM_TERMINATION_DEPARTMENT_NAME: $scope.$parent.DD_DEFAULT_TEXT,
        CUSTOM_TERMINATION_POSITION_NAME: $scope.$parent.DD_DEFAULT_TEXT,
        BULK_EMPLOYEE_SEARCH: '',
        TERMINATION_BRANCH_ID: '',
        TERMINATION_DEPARTMENT_ID: '',
        TERMINATION_POSITION_ID: '',
        EFFECTIVE_FROM: '',
    };
    $scope.TERMINATION_REASONS_LIST = [];
    $scope.HRM_GET_TERMINATION_REASONS = function () {
        var UserModelObj = new Object();
        UserModelObj.CUSTOMER_ID = $scope.TerminationSearch.CUSTOMER_ID;
        UserModelObj.ENTITY_ID = $scope.TerminationSearch.ENTITY_ID;
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'HRM_GET_TERMINATION_REASONS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.TERMINATION_REASONS_LIST = data.data.Table;
            }
            else if (data.data == 0) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
            $scope.HRM_GET_EMPLOYEE_LIST_FOR_BULK_UPDATE();
        });
    };
    $scope.HRM_GET_REPORTING_MANAGER = function (FLAG) {
        var modalObject = new Object();
        modalObject.CUSTOMER_ID = $scope.EmployeeSearch.CUSTOMER_ID;
        modalObject.EMPLY_PRSNL_ID = 0; //$scope.EmployeeSearch.EMPLY_PRSNL_ID;
        modalObject.REPORTING_MANAGER_NAME = $scope.EmployeeSearch.REPORTING_MANAGER_NAME;
        modalObject.ENTITY_ID = $cookies.get("ENTITY_ID");
        PrcCommMethods.HUMANRESOURCE_API(modalObject, 'HRM_GET_REPORTING_MANAGER').then(function (data) {
            if (data.data.Table.length > 0) {
                if (FLAG == 1) {
                    $scope.REPORTING_MANAGER_LIST = [];
                    angular.forEach(data.data.Table, function (_reportee) {
                        var removerepot = $scope.HRM_GET_REPORTING_EMPLOYEE_LIST_FOR_MANAGER_TERMINATION_LIST.filter(function (x) { return x.EMPLY_PRSNL_ID == _reportee.ID });
                        if (removerepot.length == 0) {
                            $scope.REPORTING_MANAGER_LIST.push(_reportee);
                        }
                    });
                }
                else {
                    $scope.REPORTING_MANAGER_LIST = data.data.Table;
                }
                $scope.HRM_GET_EMPLOYEE_LIST_FOR_BULK_UPDATE();
            }
        });

    };


    $scope.SELECTED_TERMINATION_REASON_Fn = function (terminationReason, _searchresult) {
        if (terminationReason == '') {
            _searchresult.CUSTOM_TERMINATION_REASON = $scope.TerminationSearch.DD_DEFAULT_TEXT;
            _searchresult.TERMINATION_REASONS_ID = '';
        } else {
            _searchresult.CUSTOM_TERMINATION_REASON = terminationReason.TERMINATION_REASONS_NAME;
            _searchresult.TERMINATION_REASONS_ID = terminationReason.TERMINATION_REASONS_ID;
        };
    };
    $scope.SELECTED_TERMINATION_BRANCH_Fn = function (_branch) {
        if (_branch == '') {
            $scope.TerminationSearch.CUSTOM_TERMINATION_BRANCH_NAME = $scope.TerminationSearch.DD_DEFAULT_TEXT;
            $scope.TerminationSearch.TERMINATION_BRANCH_ID = '';
        }
        else {
            $scope.TerminationSearch.CUSTOM_TERMINATION_BRANCH_NAME = _branch.BRANCH_NAME;
            $scope.TerminationSearch.TERMINATION_BRANCH_ID = _branch.BRANCH_ID;
        }
    };

    $scope.SELECTED_TERMINATION_DEPARTMENT_Fn = function (_department) {
        if (_department == '') {
            $scope.TerminationSearch.CUSTOM_TERMINATION_DEPARTMENT_NAME = $scope.TerminationSearch.DD_DEFAULT_TEXT;
            $scope.TerminationSearch.TERMINATION_DEPARTMENT_ID = '';
        }
        else {
            $scope.TerminationSearch.CUSTOM_TERMINATION_DEPARTMENT_NAME = _department.DEPARTMENT_NAME;
            $scope.TerminationSearch.TERMINATION_DEPARTMENT_ID = _department.DEPARTMENT_ID;
        }
    };

    $scope.SELECTED_TERMINATION_POSITION_Fn = function (_position) {
        if (_position == '') {
            $scope.TerminationSearch.CUSTOM_TERMINATION_POSITION_NAME = $scope.TerminationSearch.DD_DEFAULT_TEXT;
            $scope.TerminationSearch.TERMINATION_POSITION_ID = '';
        }
        else {
            $scope.TerminationSearch.CUSTOM_TERMINATION_POSITION_NAME = _position.POSITION_NAME;
            $scope.TerminationSearch.TERMINATION_POSITION_ID = _position.POSITION_ID;
        }
    };

    $scope.SELECTED_EMP_TERMINATION_REASON_Fn = function (terminationReason, employee) {
        if (terminationReason == '') {
            employee.CUSTOM_TERMINATION_REASON = $scope.TerminationSearch.DD_DEFAULT_TEXT;
            employee.TERMINATION_REASONS_ID = '';
        } else {
            employee.CUSTOM_TERMINATION_REASON = terminationReason.TERMINATION_REASONS_NAME;
            employee.TERMINATION_REASONS_ID = terminationReason.TERMINATION_REASONS_ID;
        }
    };

    $scope.TERMINATION_APPLY_Fn = function () {
        $scope.TerminationForm.submitted = false;
        let termination = $scope.SELECTED_EMPLOYEE_LIST_TERMINATE.filter(function (x) { return x.EMPLOYEE_NAME == $scope.TerminationSearch.BULK_EMPLOYEE_SEARCH || x.DEPARTMENT_ID == $scope.TerminationSearch.TERMINATION_DEPARTMENT_ID || x.BRANCH_ID == $scope.TerminationSearch.TERMINATION_BRANCH_ID || x.POSITION_ID == $scope.TerminationSearch.TERMINATION_POSITION_ID });
        if (termination.length == 0) {
            termination = $scope.SELECTED_EMPLOYEE_LIST_TERMINATE;
        }
        angular.forEach(termination, function (item) {
            if (!item.IS_EXCETION && item.REPORTEE_COUNT == 0) {
                if ($scope.TerminationSearch.TERMINATION_REASONS_ID != '') {

                    //if ($scope.TerminationSearch.BULK_EMPLOYEE_SEARCH) {
                    //    filters['EMPLOYEE_NAME'] = $scope.TerminationSearch.BULK_EMPLOYEE_SEARCH;
                    //}
                    //if ($scope.TerminationSearch.TERMINATION_DEPARTMENT_ID) {
                    //    filters['DEPARTMENT_ID'] = $scope.TerminationSearch.TERMINATION_DEPARTMENT_ID;
                    //}
                    //if ($scope.TerminationSearch.TERMINATION_BRANCH_ID) {
                    //    filters['BRANCH_ID'] = $scope.TerminationSearch.TERMINATION_BRANCH_ID;
                    //}
                    //if ($scope.TerminationSearch.TERMINATION_POSITION_ID) {
                    //    filters['POSITION_ID'] = $scope.TerminationSearch.TERMINATION_POSITION_ID;
                    //}


                    let termination = $scope.TERMINATION_REASONS_LIST.find(x => x.TERMINATION_REASONS_ID == $scope.TerminationSearch.TERMINATION_REASONS_ID);
                    if (termination != undefined) {
                        $scope.SELECTED_EMP_TERMINATION_REASON_Fn(termination, item);
                    }
                }
                if ($scope.TerminationSearch.EFFECTIVE_FROM != '') {
                    item.EFFECTIVE_FROM = $scope.TerminationSearch.EFFECTIVE_FROM;
                    $(".EffectiveDate ").datepicker("setDate", item.EFFECTIVE_FROM);
                } else {
                    item.EFFECTIVE_FROM = '';
                    //$(".EffectiveDate ").datepicker("setDate", item.EFFECTIVE_FROM);
                }
            }
        });
    };
    $scope.getEmployeeFilter = function () {
        let filters = {};

        if ($scope.TerminationSearch.BULK_EMPLOYEE_SEARCH) {
            filters['EMPLOYEE_NAME'] = $scope.TerminationSearch.BULK_EMPLOYEE_SEARCH;
        }
        if ($scope.TerminationSearch.TERMINATION_DEPARTMENT_ID) {
            filters['DEPARTMENT_ID'] = $scope.TerminationSearch.TERMINATION_DEPARTMENT_ID;
        }
        if ($scope.TerminationSearch.TERMINATION_BRANCH_ID) {
            filters['BRANCH_ID'] = $scope.TerminationSearch.TERMINATION_BRANCH_ID;
        }
        if ($scope.TerminationSearch.TERMINATION_POSITION_ID) {
            filters['POSITION_ID'] = $scope.TerminationSearch.TERMINATION_POSITION_ID;
        }

        return filters;
    };
    //------------------ Work Pattern -------------------------

    $scope.WorkPatternSearch = {
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        CUSTOMER_ID: $cookies.get("CUSTOMER_ID"),
        ENTITY_ID: null,
        EMPLY_PRSNL_ID: $cookies.get("EMPLY_PRSNL_ID"),
        MODULE_ID: $cookies.get("MODULE_ID"),
        USER_ID: $cookies.get("USERID"),
        DD_DEFAULT_TEXT: $scope.$parent.DD_DEFAULT_TEXT,
        CUSTOM_WORK_PATTERN_BRANCH_NAME: $scope.$parent.DD_DEFAULT_TEXT,
        CUSTOM_WORK_PATTERN_DEPARTMENT_NAME: $scope.$parent.DD_DEFAULT_TEXT,
        CUSTOM_WORK_PATTERN_POSITION_NAME: $scope.$parent.DD_DEFAULT_TEXT,
        CUSTOM_WORK_PATTERN_TITLE: $scope.$parent.DD_DEFAULT_TEXT,
        BULK_EMPLOYEE_SEARCH: '',
        WORK_PATTERN_BRANCH_ID: '',
        WORK_PATTERN_DEPARTMENT_ID: '',
        WORK_PATTERN_POSITION_ID: '',
        WORK_PATTERN_ID: '',
        EFFECTIVE_FROM: ''
    };

    $scope.HRM_GET_WORK_PATTERNS = function () {

        var modalObject = new Object();
        modalObject.CUSTOMER_ID = $scope.WorkPatternSearch.CUSTOMER_ID;
        modalObject.ENTITY_ID = $scope.WorkPatternSearch.ENTITY_ID;;
        modalObject.PAGE_NO = $scope.WorkPatternSearch.PAGE_NO;
        modalObject.PAGE_SIZE = $scope.WorkPatternSearch.PAGE_SIZE;
        PrcCommMethods.HUMANRESOURCE_API(modalObject, 'HRM_GET_WORK_PATTERNS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.WORK_PATTERN_DROPDOWN = data.data.Table;
            }
            else {
                $scope.WORK_PATTERN_DROPDOWN = [];
            }
            $scope.HRM_GET_EMPLOYEE_LIST_FOR_BULK_UPDATE();
        });
    };
    $scope.SET_OUTER_CLICK = function (_param) {
        $(".EffectiveDate ").datepicker("setDate", _param.EFFECTIVE_FROM);
    }

    $scope.nginit_WPEmployee = function (_employee, index, last) {
        if (last) {
            $scope.dateinputEffectiveDate();
        };
        _employee.SHORT_NAME = $scope.TextReturn(_employee.EMPLOYEE_NAME);
        if (_employee.EMPLOYEE_STATUS_ID == 3 || _employee.EMPLOYEE_STATUS_ID == 7 || _employee.EMPLOYEE_STATUS_ID == 4) {
            _employee.IS_EXCETION = false;

        } else {
            _employee.IS_EXCETION = true;
        }
        let workpatternlist = $scope.SELECTED_EMPLOYEE_LIST_WORK_PATTERN.filter(function (x) { return x.EMPLOYEE_NAME == $scope.WorkPatternSearch.BULK_EMPLOYEE_SEARCH || x.DEPARTMENT_ID == $scope.WorkPatternSearch.WORK_PATTERN_DEPARTMENT_ID || x.BRANCH_ID == $scope.WorkPatternSearch.WORK_PATTERN_BRANCH_ID || x.POSITION_ID == $scope.WorkPatternSearch.WORK_PATTERN_POSITION_ID });
        if (workpatternlist.length == 0) {
            workpatternlist = $scope.SELECTED_EMPLOYEE_LIST_WORK_PATTERN;
        }
        if (!_employee.IS_EXCETION) {
            var _emp_data = workpatternlist.filter(_emp => _emp.EMPLY_PRSNL_ID == _employee.EMPLY_PRSNL_ID);
            if (_emp_data != undefined && _emp_data.length > 0) {
                var _wrk_ptrn_data = $scope.WORK_PATTERN_DROPDOWN.filter(_wrk => _wrk.WORK_PATTERN_ID == _emp_data[0].WORK_PATTERN_ID);
                if (_wrk_ptrn_data != undefined && _wrk_ptrn_data.length > 0) {
                    _employee.CUSTOM_WORK_PATTERN_TITLE = _wrk_ptrn_data[0].TITLE;
                    _employee.WORK_PATTERN_TYPE_ID = _wrk_ptrn_data[0].WORK_PATTERN_TYPE_ID;
                    _employee.WORK_PATTERN_ID = _wrk_ptrn_data[0].WORK_PATTERN_ID;
                    _employee.OLD_WORK_PATTERN_TYPE_ID = angular.copy(_wrk_ptrn_data[0].WORK_PATTERN_TYPE_ID);
                    _employee.employee_wrkptn = _wrk_ptrn_data[0];
                    _employee.PRIMARY_REPORTING_MANAGER_ID = _emp_data[0].PRIMARY_REPORTING_MANAGER_ID;
                    _employee.SECONDARY_REPORTING_MANAGER_ID = _emp_data[0].SECONDARY_REPORTING_MANAGER_ID;
                    _employee.TERTIARY_REPORTING_MANAGER_ID = _emp_data[0].TERTIARY_REPORTING_MANAGER_ID;
                };
            };
        }
    };
    $scope.SELECTED_WORK_PATTERN_Fn = function (_param_work_pattern) {

        if (_param_work_pattern == '') {
            $scope.WorkPatternSearch.CUSTOM_WORK_PATTERN_TITLE = $scope.WorkPatternSearch.DD_DEFAULT_TEXT;
            $scope.WorkPatternSearch.WORK_PATTERN_ID = '';
        } else {

            $scope.WorkPatternSearch.CUSTOM_WORK_PATTERN_TITLE = _param_work_pattern.TITLE;
            $scope.WorkPatternSearch.WORK_PATTERN_ID = _param_work_pattern.WORK_PATTERN_ID;

            $scope.WorkPatternSearch.TOTAL = _param_work_pattern.TOTAL;
            $scope.WorkPatternSearch.MON = _param_work_pattern.MON;
            $scope.WorkPatternSearch.TUE = _param_work_pattern.TUE;
            $scope.WorkPatternSearch.WED = _param_work_pattern.WED;
            $scope.WorkPatternSearch.THU = _param_work_pattern.THU;
            $scope.WorkPatternSearch.FRI = _param_work_pattern.FRI;
            $scope.WorkPatternSearch.SAT = _param_work_pattern.SAT;
            $scope.WorkPatternSearch.SUN = _param_work_pattern.SUN;
            $scope.WorkPatternSearch.WORK_PATTERN_TYPE_ID = _param_work_pattern.WORK_PATTERN_TYPE_ID;
            $scope.WorkPatternSearch.WORK_PATTERN_TYPE = _param_work_pattern.WORK_PATTERN_TYPE;
        }

    };

    $scope.SELECTED_EMP_WORK_PATTERN_Fn = function (_param_work_pattern, _workPattern) {
        if (_param_work_pattern == '') {
            _workPattern.CUSTOM_WORK_PATTERN_TITLE = $scope.WorkPatternSearch.DD_DEFAULT_TEXT;
            _workPattern.WORK_PATTERN_ID = '';
        } else {
            //if (_workPattern.OLD_WORK_PATTERN_TYPE_ID == 3 && _workPattern.WORK_PATTERN_TYPE_ID != _workPattern.OLD_WORK_PATTERN_TYPE_ID) {

            //}
            //else {
            _workPattern.CUSTOM_WORK_PATTERN_TITLE = _param_work_pattern.TITLE;
            _workPattern.WORK_PATTERN_ID = _param_work_pattern.WORK_PATTERN_ID;
            _workPattern.WORK_PATTERN_TYPE_ID = _param_work_pattern.WORK_PATTERN_TYPE_ID;
            _workPattern.EDIT_FLAG = false;
            _workPattern.employee_wrkptn = _param_work_pattern;
            //}

            //_workPattern.TOTAL = _param_work_pattern.TOTAL;
            //_workPattern.MON = _param_work_pattern.MON;
            //_workPattern.TUE = _param_work_pattern.TUE;
            //_workPattern.WED = _param_work_pattern.WED;
            //_workPattern.THU = _param_work_pattern.THU;
            //_workPattern.FRI = _param_work_pattern.FRI;
            //_workPattern.SAT = _param_work_pattern.SAT;
            //_workPattern.SUN = _param_work_pattern.SUN;
            //_workPattern.UNITS = _param_work_pattern.UNITS;
            //_workPattern.WORK_PATTERN_TYPE_ID = _param_work_pattern.WORK_PATTERN_TYPE_ID;
            //_workPattern.WORK_PATTERN_TYPE = _param_work_pattern.WORK_PATTERN_TYPE;
        }

    };

    $scope.SELECTED_WORK_PATTERN_BRANCH_Fn = function (_branch) {
        if (_branch == '') {
            $scope.WorkPatternSearch.CUSTOM_WORK_PATTERN_BRANCH_NAME = $scope.WorkPatternSearch.DD_DEFAULT_TEXT;
            $scope.WorkPatternSearch.WORK_PATTERN_BRANCH_ID = '';
        }
        else {
            $scope.WorkPatternSearch.CUSTOM_WORK_PATTERN_BRANCH_NAME = _branch.BRANCH_NAME;
            $scope.WorkPatternSearch.WORK_PATTERN_BRANCH_ID = _branch.BRANCH_ID;
        }
    };

    $scope.SELECTED_WORK_PATTERN_DEPARTMENT_Fn = function (_department) {
        if (_department == '') {
            $scope.WorkPatternSearch.CUSTOM_WORK_PATTERN_DEPARTMENT_NAME = $scope.WorkPatternSearch.DD_DEFAULT_TEXT;
            $scope.WorkPatternSearch.WORK_PATTERN_DEPARTMENT_ID = '';
        }
        else {
            $scope.WorkPatternSearch.CUSTOM_WORK_PATTERN_DEPARTMENT_NAME = _department.DEPARTMENT_NAME;
            $scope.WorkPatternSearch.WORK_PATTERN_DEPARTMENT_ID = _department.DEPARTMENT_ID;
        }
    };

    $scope.SELECTED_WORK_PATTERN_POSITION_Fn = function (_position) {
        if (_position == '') {
            $scope.WorkPatternSearch.CUSTOM_WORK_PATTERN_POSITION_NAME = $scope.WorkPatternSearch.DD_DEFAULT_TEXT;
            $scope.WorkPatternSearch.WORK_PATTERN_POSITION_ID = '';
        }
        else {
            $scope.WorkPatternSearch.CUSTOM_WORK_PATTERN_POSITION_NAME = _position.POSITION_NAME;
            $scope.WorkPatternSearch.WORK_PATTERN_POSITION_ID = _position.POSITION_ID;
        }
    };

    $scope.WORK_PATTERN_APPLY_Fn = function () {
        $scope.WorkPatternForm.submitted = false;
        let workpatternlist = $scope.SELECTED_EMPLOYEE_LIST_WORK_PATTERN.filter(function (x) { return x.EMPLOYEE_NAME == $scope.WorkPatternSearch.BULK_EMPLOYEE_SEARCH || x.DEPARTMENT_ID == $scope.WorkPatternSearch.WORK_PATTERN_DEPARTMENT_ID || x.BRANCH_ID == $scope.WorkPatternSearch.WORK_PATTERN_BRANCH_ID || x.POSITION_ID == $scope.WorkPatternSearch.WORK_PATTERN_POSITION_ID });
        if (workpatternlist.length == 0) {
            workpatternlist = $scope.SELECTED_EMPLOYEE_LIST_WORK_PATTERN;
        }
        angular.forEach(workpatternlist, function (item) {
            item.EFFECTIVE_FROM = '';
            if (!item.IS_EXCETION) {

                if ($scope.WorkPatternSearch.WORK_PATTERN_ID != '') {
                    let workPattern = $scope.WORK_PATTERN_DROPDOWN.find(x => x.WORK_PATTERN_ID == $scope.WorkPatternSearch.WORK_PATTERN_ID);
                    if (workPattern != undefined) {
                        $scope.SELECTED_EMP_WORK_PATTERN_Fn(workPattern, item);
                    }
                }
                if ($scope.WorkPatternSearch.EFFECTIVE_FROM != '') {
                    item.EFFECTIVE_FROM = $scope.WorkPatternSearch.EFFECTIVE_FROM;
                    $(".EffectiveDate ").datepicker("setDate", item.EFFECTIVE_FROM);
                }
            }
        });
    }
    $scope.getWPEmployeeFilter = function () {
        let filters = {};

        if ($scope.WorkPatternSearch.BULK_EMPLOYEE_SEARCH) {
            filters['EMPLOYEE_NAME'] = $scope.WorkPatternSearch.BULK_EMPLOYEE_SEARCH;
        }
        if ($scope.WorkPatternSearch.WORK_PATTERN_DEPARTMENT_ID) {
            filters['DEPARTMENT_ID'] = $scope.WorkPatternSearch.WORK_PATTERN_DEPARTMENT_ID;
        }
        if ($scope.WorkPatternSearch.WORK_PATTERN_BRANCH_ID) {
            filters['BRANCH_ID'] = $scope.WorkPatternSearch.WORK_PATTERN_BRANCH_ID;
        }
        if ($scope.WorkPatternSearch.WORK_PATTERN_POSITION_ID) {
            filters['POSITION_ID'] = $scope.WorkPatternSearch.WORK_PATTERN_POSITION_ID;
        }

        return filters;
    };

    //$scope.HRM_GET_WORK_PATTERNS(); when worka


    //-----------------Leave Entitlement-----------------------------

    $scope.EntitlementSearch = {
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        SORT_COLUMN_NO: 1,
        SORT_ORDER_NO: 1,
        CUSTOMER_ID: $cookies.get("CUSTOMER_ID"),
        ENTITY_ID: null,
        EMPLY_PRSNL_ID: $cookies.get("EMPLY_PRSNL_ID"),
        MODULE_ID: $cookies.get("MODULE_ID"),
        USER_ID: $cookies.get("USERID"),
        DD_DEFAULT_TEXT: $scope.$parent.DD_DEFAULT_TEXT,
        CUSTOM_BRANCH_NAME: $scope.$parent.DD_DEFAULT_TEXT,
        CUSTOM_DEPARTMENT_NAME: $scope.$parent.DD_DEFAULT_TEXT,
        CUSTOM_POSITION_NAME: $scope.$parent.DD_DEFAULT_TEXT,
        CUSTOM_ENTITLEMENT_NAME: $scope.$parent.DD_DEFAULT_TEXT,
        BULK_EMPLOYEE_SEARCH: '',
        BRANCH_ID: '',
        DEPARTMENT_ID: '',
        POSITION_ID: '',
        HOLIDAY_ENTITLEMENT_ID: '',
        EFFECTIVE_FROM: ''
    };
    $scope.HOLIDAY_ENTITLEMENTS_LIST = [];
    $scope.HRM_GET_HOLIDAY_ENTITLEMENTS = function () {
        $scope.$parent.overlay_loadingNew = 'block';

        var AbsenceObject = new Object();
        AbsenceObject.CUSTOMER_ID = $scope.EntitlementSearch.CUSTOMER_ID;
        AbsenceObject.ENTITY_ID = $scope.EntitlementSearch.ENTITY_ID;;
        AbsenceObject.PAGE_NO = $scope.EntitlementSearch.PAGE_NO;
        AbsenceObject.PAGE_SIZE = $scope.EntitlementSearch.PAGE_SIZE;
        AbsenceObject.SORT_COLUMN_NO = $scope.EntitlementSearch.SORT_COLUMN_NO;
        AbsenceObject.SORT_ORDER_NO = $scope.EntitlementSearch.SORT_ORDER_NO;
        PrcCommMethods.HUMANRESOURCE_API(AbsenceObject, 'HRM_GET_HOLIDAY_ENTITLEMENTS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.HOLIDAY_ENTITLEMENTS_LIST = data.data.Table;

            }
        });
    };

    $scope.SELECTED_ENTITLEMENT_Fn = function (entitlement) {
        if (entitlement == '') {
            $scope.EntitlementSearch.CUSTOM_ENTITLEMENT_NAME = $scope.EntitlementSearch.DD_DEFAULT_TEXT;
            $scope.EntitlementSearch.HOLIDAY_ENTITLEMENT_ID = '';
        }
        else {
            $scope.EntitlementSearch.CUSTOM_ENTITLEMENT_NAME = entitlement.ENTITLEMENT_NAME;
            $scope.EntitlementSearch.HOLIDAY_ENTITLEMENT_ID = entitlement.HOLIDAY_ENTITLEMENT_ID;

            $scope.EntitlementSearch.INITIAL_VALUE = entitlement.INITIAL_VALUE;
            $scope.EntitlementSearch.UNITS = entitlement.UNITS;
            $scope.EntitlementSearch.RESET_DATE = entitlement.RESET_DATE;
            $scope.EntitlementSearch.LEAVE_PAID = entitlement.LEAVE_PAID;
        }
    };

    $scope.SELECTED_EMP_ENTITLEMENT_Fn = function (entitlement, employee) {
        if (entitlement == '') {
            employee.CUSTOM_ENTITLEMENT_NAME = $scope.EntitlementSearch.DD_DEFAULT_TEXT;
            employee.HOLIDAY_ENTITLEMENT_ID = '';
        }
        else {
            employee.CUSTOM_ENTITLEMENT_NAME = entitlement.ENTITLEMENT_NAME;
            employee.HOLIDAY_ENTITLEMENT_ID = entitlement.HOLIDAY_ENTITLEMENT_ID;
            let hiringDate = employee.HIRING_DATE != null ? new Date(employee.HIRING_DATE) : new Date();
            employee.ACTUAL_ALLOWANCE = calculateAnnualAllowance(entitlement.INITIAL_VALUE, hiringDate, entitlement.ROUND_UP_DOWN);;
        }
    };
    var calculateAnnualAllowance = function (annualLeave, hiringDate, roundDown) {

        var month = hiringDate.getMonth();
        month = 12 - month;

        var annualAllowance = (annualLeave * (month / 12));
        if (roundDown) {
            annualAllowance = Math.floor(annualAllowance);
        } else {
            annualAllowance = Math.ceil(annualAllowance);
        }
        return annualAllowance;
    };

    $scope.SELECTED_ENTITLEMENT_BRANCH_Fn = function (_branch) {
        if (_branch == '') {
            $scope.EntitlementSearch.CUSTOM_BRANCH_NAME = $scope.EntitlementSearch.DD_DEFAULT_TEXT;
            $scope.EntitlementSearch.BRANCH_ID = '';
        }
        else {
            $scope.EntitlementSearch.CUSTOM_BRANCH_NAME = _branch.BRANCH_NAME;
            $scope.EntitlementSearch.BRANCH_ID = _branch.BRANCH_ID;
        }
    };

    $scope.SELECTED_ENTITLEMENT_DEPARTMENT_Fn = function (_department) {
        if (_department == '') {
            $scope.EntitlementSearch.CUSTOM_DEPARTMENT_NAME = $scope.EntitlementSearch.DD_DEFAULT_TEXT;
            $scope.EntitlementSearch.DEPARTMENT_ID = '';
        }
        else {
            $scope.EntitlementSearch.CUSTOM_DEPARTMENT_NAME = _department.DEPARTMENT_NAME;
            $scope.EntitlementSearch.DEPARTMENT_ID = _department.DEPARTMENT_ID;
        }
    };

    $scope.SELECTED_ENTITLEMENT_POSITION_Fn = function (_position) {
        if (_position == '') {
            $scope.EntitlementSearch.CUSTOM_POSITION_NAME = $scope.EntitlementSearch.DD_DEFAULT_TEXT;
            $scope.EntitlementSearch.POSITION_ID = '';
        }
        else {
            $scope.EntitlementSearch.CUSTOM_POSITION_NAME = _position.POSITION_NAME;
            $scope.EntitlementSearch.POSITION_ID = _position.POSITION_ID;
        }
    };


    $scope.HOLIDAY_APPLY_Fn = function () {
        angular.forEach($scope.SELECTED_EMPLOYEE_LIST, function (item) {
            if ($scope.EntitlementSearch.HOLIDAY_ENTITLEMENT_ID != '') {
                let holiday = $scope.HOLIDAY_ENTITLEMENTS_LIST.find(x => x.HOLIDAY_ENTITLEMENT_ID == $scope.EntitlementSearch.HOLIDAY_ENTITLEMENT_ID);
                if (holiday != undefined) {
                    $scope.SELECTED_EMP_ENTITLEMENT_Fn(holiday, item);
                }
            }
            if ($scope.EntitlementSearch.EFFECTIVE_FROM != '') {
                item.EFFECTIVE_FROM = $scope.EntitlementSearch.EFFECTIVE_FROM;
            }
        });
    }
    $scope.getHolidayEmployeeFilter = function () {
        let filters = {};

        if ($scope.EntitlementSearch.BULK_EMPLOYEE_SEARCH) {
            filters['EMPLOYEE_NAME'] = $scope.EntitlementSearch.BULK_EMPLOYEE_SEARCH;
        }
        if ($scope.EntitlementSearch.DEPARTMENT_ID) {
            filters['DEPARTMENT_ID'] = $scope.EntitlementSearch.DEPARTMENT_ID;
        }
        if ($scope.EntitlementSearch.BRANCH_ID) {
            filters['BRANCH_ID'] = $scope.EntitlementSearch.BRANCH_ID;
        }
        if ($scope.EntitlementSearch.POSITION_ID) {
            filters['POSITION_ID'] = $scope.EntitlementSearch.POSITION_ID;
        }

        return filters;
    };


    // $scope.HRM_GET_HOLIDAY_ENTITLEMENTS(); call when entitment call

    //----------------------------- Update Wage -------------------------------

    $scope.WageSearch = {
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        SORT_COLUMN_NO: 1,
        SORT_ORDER_NO: 1,
        CUSTOMER_ID: $cookies.get("CUSTOMER_ID"),
        ENTITY_ID: null,
        EMPLY_PRSNL_ID: $cookies.get("EMPLY_PRSNL_ID"),
        MODULE_ID: $cookies.get("MODULE_ID"),
        USER_ID: $cookies.get("USERID"),
        DD_DEFAULT_TEXT: $scope.$parent.DD_DEFAULT_TEXT,
        CUSTOM_BRANCH_NAME: $scope.$parent.DD_DEFAULT_TEXT,
        CUSTOM_DEPARTMENT_NAME: $scope.$parent.DD_DEFAULT_TEXT,
        CUSTOM_POSITION_NAME: $scope.$parent.DD_DEFAULT_TEXT,
        CUSTOM_PAY_TYPE: $scope.$parent.DD_DEFAULT_TEXT,
        BULK_EMPLOYEE_SEARCH: '',
        BRANCH_ID: '',
        DEPARTMENT_ID: '',
        POSITION_ID: '',
        PAYTYPE_ID: '',
        EFFECTIVE_FROM: '',
        Hourly_Wage_Label: 'Hourly Wage'
    };
    $scope.PAYTYPES_LIST = [];
    $scope.HRM_GET_PAYTYPES = function () {
        var wagesobj = new Object()
        PrcCommMethods.HUMANRESOURCE_API(wagesobj, 'HRM_GET_PAYTYPES').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.PAYTYPES_LIST = data.data.Table;
            };
        });
    }

    $scope.SELECTED_PAYTYPE_Fn = function (payType) {
        if (payType == '') {
            $scope.WageSearch.CUSTOM_PAY_TYPE = $scope.WageSearch.DD_DEFAULT_TEXT;
            $scope.WageSearch.PAYTYPE_ID = '';
            $scope.SHOW_LABEL_HOURLY_RATE = "Rate Type";
        } else {
            $scope.WageSearch.CUSTOM_PAY_TYPE = payType.PAY_TYPE;
            $scope.WageSearch.PAYTYPE_ID = payType.PAYTYPE_ID;

            if (payType.PAYTYPE_ID == 1) {
                $scope.SHOW_LABEL_HOURLY_RATE = "Annual Salary";
            } else {
                $scope.SHOW_LABEL_HOURLY_RATE = payType.PAY_TYPE;
            }
        }
    }
    $scope.SELECTED_WAGE_BRANCH_Fn = function (_branch) {
        if (_branch == '') {
            $scope.WageSearch.CUSTOM_BRANCH_NAME = $scope.WageSearch.DD_DEFAULT_TEXT;
            $scope.WageSearch.BRANCH_ID = '';
        }
        else {
            $scope.WageSearch.CUSTOM_BRANCH_NAME = _branch.BRANCH_NAME;
            $scope.WageSearch.BRANCH_ID = _branch.BRANCH_ID;
        }
    };

    $scope.SELECTED_WAGE_DEPARTMENT_Fn = function (_department) {
        if (_department == '') {
            $scope.WageSearch.CUSTOM_DEPARTMENT_NAME = $scope.WageSearch.DD_DEFAULT_TEXT;
            $scope.WageSearch.DEPARTMENT_ID = '';
        }
        else {
            $scope.WageSearch.CUSTOM_DEPARTMENT_NAME = _department.DEPARTMENT_NAME;
            $scope.WageSearch.DEPARTMENT_ID = _department.DEPARTMENT_ID;
        }
    };

    $scope.SELECTED_WAGE_POSITION_Fn = function (_position) {
        if (_position == '') {
            $scope.WageSearch.CUSTOM_POSITION_NAME = $scope.WageSearch.DD_DEFAULT_TEXT;
            $scope.WageSearch.POSITION_ID = '';
        }
        else {
            $scope.WageSearch.CUSTOM_POSITION_NAME = _position.POSITION_NAME;
            $scope.WageSearch.POSITION_ID = _position.POSITION_ID;
        }
    };

    $scope.getWageEmployeeFilter = function () {
        let filters = {};

        if ($scope.WageSearch.BULK_EMPLOYEE_SEARCH) {
            filters['EMPLOYEE_NAME'] = $scope.WageSearch.BULK_EMPLOYEE_SEARCH;
        }
        if ($scope.WageSearch.DEPARTMENT_ID) {
            filters['DEPARTMENT_ID'] = $scope.WageSearch.DEPARTMENT_ID;
        }
        if ($scope.WageSearch.BRANCH_ID) {
            filters['BRANCH_ID'] = $scope.WageSearch.BRANCH_ID;
        }
        if ($scope.WageSearch.POSITION_ID) {
            filters['POSITION_ID'] = $scope.WageSearch.POSITION_ID;
        }

        return filters;
    };
    // $scope.HRM_GET_PAYTYPES(); hide call  when buld upload click

    // -------------------- Absence --------------------------

    $scope.AbsenceSearch = {
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        SORT_COLUMN_NO: 1,
        SORT_ORDER_NO: 1,
        CUSTOMER_ID: $cookies.get("CUSTOMER_ID"),
        ENTITY_ID: null,
        EMPLY_PRSNL_ID: $cookies.get("EMPLY_PRSNL_ID"),
        MODULE_ID: $cookies.get("MODULE_ID"),
        USER_ID: $cookies.get("USERID"),
        DD_DEFAULT_TEXT: $scope.$parent.DD_DEFAULT_TEXT,
        CUSTOM_BRANCH_NAME: $scope.$parent.DD_DEFAULT_TEXT,
        CUSTOM_DEPARTMENT_NAME: $scope.$parent.DD_DEFAULT_TEXT,
        CUSTOM_POSITION_NAME: $scope.$parent.DD_DEFAULT_TEXT,
        CUSTOM_ABSENCE_TYPE: $scope.$parent.DD_DEFAULT_TEXT,
        BULK_EMPLOYEE_SEARCH: '',
        BRANCH_ID: '',
        DEPARTMENT_ID: '',
        POSITION_ID: '',
        PAYTYPE_ID: '',
        START_DATE: '',
        END_DATE: '',
    };



    $scope.ABSENCE_TYPE_LIST = [];
    $scope.HRM_GET_ABSENCE_TYPES = function () {
        var AbsenceObject = new Object();
        AbsenceObject.ENTITY_ID = $scope.AbsenceSearch.ENTITY_ID;
        AbsenceObject.CUSTOMER_ID = $scope.AbsenceSearch.CUSTOMER_ID;
        PrcCommMethods.HUMANRESOURCE_API(AbsenceObject, 'HRM_GET_ABSENCE_TYPES').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.ABSENCE_TYPE_LIST = data.data.Table;
            }
        });
    };
    $scope.SELECTED_ABSENCE_TYPE_Fn = function (_absType) {
        if (_absType == '') {
            $scope.AbsenceSearch.CUSTOM_ABSENCE_TYPE = $scope.AbsenceSearch.DD_DEFAULT_TEXT;
            $scope.AbsenceSearch.ABSENCE_TYPE_ID = '';
        } else {
            $scope.AbsenceSearch.CUSTOM_ABSENCE_TYPE = _absType.ABSENCE_TYPE;
            $scope.AbsenceSearch.ABSENCE_TYPE_ID = _absType.ABSENCE_TYPE_ID;
        }
    };
    $scope.SELECTED_EMP_ABSENCE_TYPE_Fn = function (_absType, employee) {
        if (_absType == '') {
            employee.CUSTOM_ABSENCE_TYPE = $scope.AbsenceSearch.DD_DEFAULT_TEXT;
            employee.ABSENCE_TYPE_ID = '';
        } else {
            employee.CUSTOM_ABSENCE_TYPE = _absType.ABSENCE_TYPE;
            employee.ABSENCE_TYPE_ID = _absType.ABSENCE_TYPE_ID;
        }
    };

    $scope.SELECTED_ABSENCE_BRANCH_Fn = function (_branch) {
        if (_branch == '') {
            $scope.AbsenceSearch.CUSTOM_BRANCH_NAME = $scope.AbsenceSearch.DD_DEFAULT_TEXT;
            $scope.AbsenceSearch.BRANCH_ID = '';
        }
        else {
            $scope.AbsenceSearch.CUSTOM_BRANCH_NAME = _branch.BRANCH_NAME;
            $scope.AbsenceSearch.BRANCH_ID = _branch.BRANCH_ID;
        }
    };

    $scope.SELECTED_ABSENCE_DEPARTMENT_Fn = function (_department) {
        if (_department == '') {
            $scope.AbsenceSearch.CUSTOM_DEPARTMENT_NAME = $scope.AbsenceSearch.DD_DEFAULT_TEXT;
            $scope.AbsenceSearch.DEPARTMENT_ID = '';
        }
        else {
            $scope.AbsenceSearch.CUSTOM_DEPARTMENT_NAME = _department.DEPARTMENT_NAME;
            $scope.AbsenceSearch.DEPARTMENT_ID = _department.DEPARTMENT_ID;
        }
    };

    $scope.SELECTED_ABSENCE_POSITION_Fn = function (_position) {
        if (_position == '') {
            $scope.AbsenceSearch.CUSTOM_POSITION_NAME = $scope.AbsenceSearch.DD_DEFAULT_TEXT;
            $scope.AbsenceSearch.POSITION_ID = '';
        }
        else {
            $scope.AbsenceSearch.CUSTOM_POSITION_NAME = _position.POSITION_NAME;
            $scope.AbsenceSearch.POSITION_ID = _position.POSITION_ID;
        }
    };

    $scope.ABSENCE_APPLY_Fn = function () {
        angular.forEach($scope.SELECTED_EMPLOYEE_LIST, function (item) {
            if ($scope.AbsenceSearch.TERMINATION_REASONS_ID != '') {
                let absenceType = $scope.ABSENCE_TYPE_LIST.find(x => x.ABSENCE_TYPE_ID == $scope.AbsenceSearch.ABSENCE_TYPE_ID);
                if (absenceType != undefined) {
                    $scope.SELECTED_EMP_ABSENCE_TYPE_Fn(absenceType, item);
                }
            }
            if ($scope.AbsenceSearch.START_DATE != '') {
                item.START_DATE = $scope.AbsenceSearch.START_DATE;
            }
            if ($scope.AbsenceSearch.END_DATE != '') {
                item.END_DATE = $scope.AbsenceSearch.END_DATE;
            }
        });
    };
    $scope.getAbsenceEmployeeFilter = function () {
        let filters = {};

        if ($scope.AbsenceSearch.BULK_EMPLOYEE_SEARCH) {
            filters['EMPLOYEE_NAME'] = $scope.AbsenceSearch.BULK_EMPLOYEE_SEARCH;
        }
        if ($scope.AbsenceSearch.DEPARTMENT_ID) {
            filters['DEPARTMENT_ID'] = $scope.AbsenceSearch.DEPARTMENT_ID;
        }
        if ($scope.AbsenceSearch.BRANCH_ID) {
            filters['BRANCH_ID'] = $scope.AbsenceSearch.BRANCH_ID;
        }
        if ($scope.AbsenceSearch.POSITION_ID) {
            filters['POSITION_ID'] = $scope.AbsenceSearch.POSITION_ID;
        }

        return filters;
    };
    // $scope.HRM_GET_ABSENCE_TYPES(); Call When buld upload call


    // ------------------------- Export -----------------------------------
    $scope.EXPORT_EMPLOYEE_LIST = function (_param_export_flag) {
        $scope.$parent.overlay_loadingNew = 'block';
        var UserModelObj = new Object();
        UserModelObj.CUSTOMER_ID = $scope.EmployeeSearch.CUSTOMER_ID;
        UserModelObj.SEARCH = $scope.EmployeeSearch.SEARCH;
        UserModelObj.DATE_FORMAT = $scope.$parent.DISPLAY_DATE_FORMAT;
        UserModelObj.BRANCH_ID_LIST = [];
        UserModelObj.ENTITY_ID_LIST = [];
        UserModelObj.DEPARTMENTS_ID_LIST = [];
        UserModelObj.STATUS_ID_LIST = [];
        UserModelObj.CUSTOMER_ID = $scope.EmployeeSearch.CUSTOMER_ID;
        UserModelObj.ENTITY_ID = $scope.EmployeeSearch.ENTITY_ID;
        UserModelObj.SEARCH = $scope.EmployeeSearch.SEARCH;
        UserModelObj.EMPLY_PRSNL_ID = $cookies.get("EMPLY_PRSNL_ID");
        UserModelObj.USER_ID = $cookies.get("USERID");
        UserModelObj.STANDARD_ROLE_ID = $cookies.get("STANDARD_ROLE_ID");
        UserModelObj.MODULE_ID = $cookies.get("MODULE_ID");
        // UserModelObj.ADMIN_ENTITY_ID = $cookies.get("ENTITY_ID");
        UserModelObj.CUSTOMER_ID = $cookies.get("CUSTOMER_ID");
        UserModelObj.BRANCH_IDS = "";
        UserModelObj.DEPARTMENT_IDS = "";
        UserModelObj.STATUS_ID_LIST = [];
        var BlankObj = new Object();
        BlankObj.TABLE_ID = 0;
        UserModelObj.BRANCH_COUNT = 0;
        angular.forEach($scope.BRANCH_EMP_LIST, function (_loop_value) {
            if (_loop_value.IS_SELECTED) {
                UserModelObj.BRANCH_COUNT = UserModelObj.BRANCH_COUNT + 1;
                if (UserModelObj.BRANCH_IDS == "") {
                    UserModelObj.BRANCH_IDS = _loop_value.BRANCH_ID;
                }
                else {
                    UserModelObj.BRANCH_IDS = UserModelObj.BRANCH_IDS + "," + _loop_value.BRANCH_ID;
                }
            };
        });
        if ($scope.BRANCH_EMP_LIST.length == UserModelObj.BRANCH_COUNT) {
            UserModelObj.BRANCH_IDS = "";
        }

        UserModelObj.DEPPARTMENT_COUNT = 0;
        angular.forEach($scope.DEPARTMENTS_EMP_LIST, function (_loop_value) {
            if (_loop_value.IS_SELECTED) {
                UserModelObj.DEPPARTMENT_COUNT = UserModelObj.DEPPARTMENT_COUNT + 1;
                //var readonly = new Object();
                //readonly.TABLE_ID = _loop_value.DEPARTMENT_ID;
                //UserModelObj.DEPARTMENTS_ID_LIST.push(readonly);

                if (UserModelObj.DEPARTMENT_IDS == "") {
                    UserModelObj.DEPARTMENT_IDS = _loop_value.DEPARTMENT_ID;
                }
                else {
                    UserModelObj.DEPARTMENT_IDS = UserModelObj.DEPARTMENT_IDS + "," + _loop_value.DEPARTMENT_ID;
                };
            }
        });
        if ($scope.DEPARTMENTS_EMP_LIST.length == UserModelObj.DEPPARTMENT_COUNT) {
            UserModelObj.DEPARTMENT_IDS = "";
        }
        UserModelObj.POSITION_IDS = "";
        UserModelObj.POSITION_COUNT = 0;
        angular.forEach($scope.POSITIONS_EMP_LIST, function (_loop_value) {
            if (_loop_value.IS_SELECTED) {
                UserModelObj.POSITION_COUNT = UserModelObj.POSITION_COUNT + 1;
                if (UserModelObj.POSITION_IDS == "") {
                    UserModelObj.POSITION_IDS = _loop_value.POSITION_ID;
                }
                else {
                    UserModelObj.POSITION_IDS = UserModelObj.POSITION_IDS + "," + _loop_value.POSITION_ID;
                };
            }
        });
        if ($scope.POSITIONS_EMP_LIST.length == UserModelObj.POSITION_COUNT) {
            UserModelObj.POSITION_IDS = "";
        };
        angular.forEach($scope.EMPLOYEE_STATUSES_LIST, function (_loop_value) {
            if (_loop_value.IS_SELECTED) {
                var readonly = new Object();
                readonly.TABLE_ID = _loop_value.EMPLOYEE_STATUS_ID;
                UserModelObj.STATUS_ID_LIST.push(readonly);
            }
        });
        if (UserModelObj.STATUS_ID_LIST.length == 0) {
            UserModelObj.STATUS_ID_LIST.push(BlankObj);
        }
        UserModelObj.PAGE_NO = 0;
        UserModelObj.PAGE_SIZE = 0;
        UserModelObj.EXPORT_FLAG = _param_export_flag;
        UserModelObj.FILE_PATH = "/CUSTOMER_" + $scope.EmployeeSearch.CUSTOMER_ID + "/" + "USER_ID_" + $scope.EmployeeSearch.USER_ID + "/" + (_param_export_flag == 1 ? "CSV" : "XLSX") + "/";
        UserModelObj.FILE_NAME = "Employees";
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'EXPORT_EMPLOYEE_LIST').then(function (data) {
            if (data.data != null) {
                $scope.SERVER_FILE_PATH = '/' + data.data.FOLDER_NAME + data.data.RETURN_FILE_NAME;
                $scope.FILE_NAME = UserModelObj.FILE_NAME;
                window.location.href = $scope.SERVER_FILE_PATH;
            }
        });
    }

    $scope.SELECTED_REPORTING_MANAGER = function (manager, _searchresult) {
        if (manager == '') {
            _searchresult.CUSTOME_REPORTING_MANAGER = $scope.EmployeeSearch.DD_DEFAULT_TEXT;
            _searchresult.REPORTING_MANAGER_ID = '';
        } else {
            _searchresult.CUSTOME_REPORTING_MANAGER = manager.EMPLOYEE_NAME;
            _searchresult.REPORTING_MANAGER_ID = manager.ID;
            // _searchresult.MANAGER_ID = manager.ID;
        }
    };
    $scope.SELECTED_EMP_REPORTING_MANAGER = function (manager, employee) {
        if (manager == '') {
            employee.CUSTOME_REPORTING_MANAGER = $scope.EmployeeSearch.DD_DEFAULT_TEXT;
            employee.PRIMARY_REPORTING_MANAGER_ID = '';
        } else {
            employee.CUSTOME_REPORTING_MANAGER = manager.EMPLOYEE_NAME;
            employee.PRIMARY_REPORTING_MANAGER_ID = manager.ID;
            if (manager.EMPLOYEE_NAME == employee.EMPLOYEE_NAME) {
                //employee.CUSTOME_REPORTING_MANAGER = $scope.EmployeeSearch.DD_DEFAULT_TEXT;
                //employee.MANAGER_ID = '';
                employee.NAME_CHECK = 1;
            } else {
                //employee.CUSTOME_REPORTING_MANAGER = manager.EMPLOYEE_NAME;
                //employee.MANAGER_ID = manager.ID;
                employee.NAME_CHECK = 0;
            }
        }
    };
    $scope.MANAGER_APPLY_Fn = function () {
        $scope.BulkForm.submitted = false;
        let addemployeelist = $scope.SELECTED_EMPLOYEE_LIST.filter(function (x) { return x.EMPLOYEE_NAME == $scope.EmployeeSearch.BULK_EMPLOYEE_SEARCH || x.DEPARTMENT_ID == $scope.EmployeeSearch.DDL_DEPARTMENT_ID || x.BRANCH_ID == $scope.EmployeeSearch.DDL_BRANCH_ID || x.POSITION_ID == $scope.EmployeeSearch.DDL_POSITION_ID });
        if (addemployeelist.length == 0) {
            addemployeelist = $scope.SELECTED_EMPLOYEE_LIST;
        }
        angular.forEach(addemployeelist, function (item, index) {

            if (!item.IS_EXCETION && item.REPORTEE_COUNT == 0) {
                if ($scope.EmployeeSearch.REPORTING_MANAGER_ID != '') {
                    let manager = $scope.REPORTING_MANAGER_LIST.find(x => x.ID == $scope.EmployeeSearch.REPORTING_MANAGER_ID);
                    if (manager != undefined) {
                        $scope.SELECTED_EMP_REPORTING_MANAGER(manager, item);
                    }
                } else {
                    item.PRIMARY_REPORTING_MANAGER_ID = '';
                    item.CUSTOME_REPORTING_MANAGER = $scope.EmployeeSearch.DD_DEFAULT_TEXT;
                }
                if ($scope.EmployeeSearch.EFFECTIVE_FROM != '') {
                    item.EFFECTIVE_FROM = $scope.EmployeeSearch.EFFECTIVE_FROM;
                    $("#ReportingEffectiveDate" + index).datepicker("setDate", item.EFFECTIVE_FROM);
                } else {
                    item.EFFECTIVE_FROM = '';
                    $("#ReportingEffectiveDate" + index).datepicker("setDate", item.EFFECTIVE_FROM);
                }
            }
        });
    };

    $scope.SELECTED_NO_MANAGER = function (_employee) {
        if (_employee.IS_SELECTED_NO_MANAGER == true) {
            _employee.CUSTOME_REPORTING_MANAGER = $scope.EmployeeSearch.DD_DEFAULT_TEXT;
            _employee.PRIMARY_REPORTING_MANAGER_ID = null;
            _employee.NAME_CHECK = 0;
        }
    }

    $scope.CHECK_SAME_MANAGER = function (_employee) {
        if (_employee.MANAGER_ID != undefined && _employee.MANAGER_ID != null && _employee.MANAGER_ID != '') {
            _employee.NAME_CHECK = 0;
            angular.forEach($scope.SELECTED_EMPLOYEE_LIST, function (_param) {
                if (_param.EMPLOYEE_NAME == _employee.EMPLOYEE_NAME) {
                    _employee.CUSTOME_REPORTING_MANAGER = $scope.EmployeeSearch.DD_DEFAULT_TEXT;
                    _employee.MANAGER_ID = '';
                    _employee.NAME_CHECK = 1;
                }
            })
        }
    }
    $scope.REMOVE_TOOL_fn = function () {
        $(".tooltip").remove();
    }
    $scope.REMOVE_EMPLOYEE = function (_param, index) {
        if (confirm('Are you Sure?')) {
            _param.IS_DELETED = 1;
            //$scope.SELECTED_EMPLOYEE_LIST.splice(index, 1);  
            //$scope.$apply(); 
            //$scope.BulkForm.submitted = false;
            $scope.REMOVE_TOOL_fn();
        }
    }
    $scope.REMOVE_TERMINATE_EMPLOYEE = function (_param, index) {
        if (confirm('Are you Sure?')) {
            //$scope.SELECTED_EMPLOYEE_LIST_TERMINATE.splice(index, 1);
            //$scope.$apply();
            //$scope.TerminationForm.submitted = false;
            _param.IS_DELETED = 1;
            // let terminate=$scope.SELECTED_EMPLOYEE_LIST_TERMINATE.filter(function (x) { return x.IS_DELETED == 0 });
            //  $scope.SELECTED_EMPLOYEE_LIST_TERMINATE = terminate;
            //for (var i = 0; i < $scope.SELECTED_EMPLOYEE_LIST_TERMINATE.length; i++) {
            //    $scope.nginit_Terminatemanager($scope.SELECTED_EMPLOYEE_LIST_TERMINATE[i]);
            //}
            //nginit_Terminatemanager();          

            $scope.REMOVE_TOOL_fn();
        }
    }
    $scope.REMOVE_WORKPATTERN_EMPLOYEE = function (_param, index) {
        if (confirm('Are you Sure?')) {
            //$scope.SELECTED_EMPLOYEE_LIST_WORK_PATTERN.splice(index, 1);
            //$scope.$apply();
            //$scope.WorkPatternForm.submitted = false;
            _param.IS_DELETED = 1;
            $scope.REMOVE_TOOL_fn();
        }
    }

    $scope.SELECTED_EMPLOYEE_EXPORT = function () {
        var UserModelObj = new Object();
        UserModelObj.CUSTOMER_ID = $scope.EmployeeSearch.CUSTOMER_ID;
        UserModelObj.SEARCH = $scope.EmployeeSearch.SEARCH;
        UserModelObj.DATE_FORMAT = $scope.$parent.DISPLAY_DATE_FORMAT;
        UserModelObj.EMPLY_PRSNL_ID = $cookies.get("EMPLY_PRSNL_ID");
        UserModelObj.USER_ID = $cookies.get("USERID");
        UserModelObj.STANDARD_ROLE_ID = $cookies.get("STANDARD_ROLE_ID");
        //UserModelObj.ADMIN_ENTITY_ID = $cookies.get("ENTITY_ID");
        UserModelObj.MODULE_ID = $cookies.get("MODULE_ID");
        UserModelObj.CUSTOMER_ID = $cookies.get("CUSTOMER_ID");
        UserModelObj.SELECTED_EMPLOYEE_EXPORT = [];
        angular.forEach($scope.EMPLOYEE_LIST, function (item) {
            if (item.IS_SELECTED) {
                var readonly = new Object();
                readonly.EMPLOYEE_NAME = item.EMPLOYEE_NAME;
                readonly.EMPLOYEE_NUMBER = item.EMPLOYEE_NUMBER;
                readonly.BRANCH_NAME = item.BRANCH_NAME;
                readonly.DEPARTMENT_NAME = item.DEPARTMENT_NAME;
                readonly.POSITION_NAME = item.POSITION_NAME;
                readonly.HIRING_DATE = item.HIRING_DATE == null || item.HIRING_DATE == '' || item.HIRING_DATE == undefined ? '' : moment(item.HIRING_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate();
                readonly.EMAIL = item.EMAIL;
                readonly.PRIMARY_PHONE = item.PRIMARY_PHONE;
                readonly.MANAGER_NAME = item.MANAGER_NAME;
                readonly.HOURLY_RATE = item.HOURLY_RATE;
                readonly.PAY_TYPE = item.PAY_TYPE;
                readonly.ROLE_NAME = item.ROLE_NAME;
                readonly.PAYSCHEDULE_NAME = item.PAYSCHEDULE_NAME;
                readonly.EMPLOYEE_STATUS_NAMES = item.EMPLOYEE_STATUS_NAMES;
                readonly.PRIMARY_PHONE_CODE = "";
                readonly.TERMINATION_DATE = item.TERMINATION_DATE == null || item.TERMINATION_DATE == '' || item.TERMINATION_DATE == undefined ? '' : moment(item.TERMINATION_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate();
                readonly.SHOW_WAGE = item.SHOW_WAGE;
                readonly.EMPLY_PRSNL_ID = item.EMPLY_PRSNL_ID;
                UserModelObj.SELECTED_EMPLOYEE_EXPORT.push(readonly);
            }
        });

        UserModelObj.EXPORT_FLAG = 3;
        UserModelObj.FILE_PATH = "/CUSTOMER_" + $scope.EmployeeSearch.CUSTOMER_ID + "/" + "USER_ID_" + $scope.EmployeeSearch.USER_ID + "/" + "XLSX" + "/";
        UserModelObj.FILE_NAME = "Employees";
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'EXPORT_EMPLOYEE_LIST').then(function (data) {
            if (data.data != null) {
                $scope.SERVER_FILE_PATH = '/' + data.data.FOLDER_NAME + data.data.RETURN_FILE_NAME;
                $scope.FILE_NAME = UserModelObj.FILE_NAME;
                window.location.href = $scope.SERVER_FILE_PATH;
            }
        });
    }

    $scope.HRM_BULK_UPDATE_MANAGER = function () {
        $scope.BulkForm.submitted = true;
        var check_same_emp_valid = 0;
        angular.forEach($scope.SELECTED_EMPLOYEE_LIST, function (_select_emp) {
            if (_select_emp.NAME_CHECK == 1) {
                check_same_emp_valid++;
            }
        })
        if (check_same_emp_valid == 0) {
            if ($scope.BulkForm.$valid) {
                var BulkObj = new Object();
                BulkObj.USER_ID = $cookies.get("USERID");
                BulkObj.CUSTOMER_ID = $cookies.get("CUSTOMER_ID");
                BulkObj.ENTITY_ID = $cookies.get("ENTITY_ID");
                BulkObj.COMMENTS = "";
                BulkObj.BULK_UPDATE_MANAGER = [];
                var valid = 0;
                angular.forEach($scope.SELECTED_EMPLOYEE_LIST, function (_select_emp) {
                    if (!_select_emp.IS_EXCETION && _select_emp.REPORTEE_COUNT == 0 && _select_emp.NAME_CHECK == 0 && _select_emp.IS_DELETED == 0) {
                        if (_select_emp.NAME_CHECK == 1) {
                            valid++;
                        }
                        var BulkTypeObj = new Object();
                        BulkTypeObj.EMPLY_PRSNL_ID = _select_emp.EMPLY_PRSNL_ID;
                        BulkTypeObj.PRIMARY_REPORTING_MANAGER_ID = _select_emp.PRIMARY_REPORTING_MANAGER_ID;
                        BulkTypeObj.SECONDARY_REPORTING_MANAGER_ID = _select_emp.SECONDARY_REPORTING_MANAGER_ID;
                        BulkTypeObj.TERTIARY_REPORTING_MANAGER_ID = _select_emp.TERTIARY_REPORTING_MANAGER_ID;
                        BulkTypeObj.TERMINATION_REASON_ID = null;
                        BulkTypeObj.WORK_PATTERN_ID = null;
                        BulkTypeObj.HOLIDAY_ENTITLEMENTS_ID = null;
                        BulkTypeObj.ACTUAL_ALLOWANCE = null;
                        BulkTypeObj.STANDARD_ROLE_ID = null;
                        BulkTypeObj.PAYTYPE_ID = null;
                        BulkTypeObj.WAGE = null;
                        BulkTypeObj.ABSENCE_TYPE_ID = null;
                        BulkTypeObj.START_DATE = null;
                        BulkTypeObj.END_DATE = null;
                        BulkTypeObj.EFFECTIVE_FROM = (_select_emp.EFFECTIVE_FROM == undefined || _select_emp.EFFECTIVE_FROM == '' || _select_emp.EFFECTIVE_FROM == null) ? '' : moment(_select_emp.EFFECTIVE_FROM, "DD/MM/YYYY").format('L');
                        BulkTypeObj.COMMENTS = _select_emp.COMMENTS == undefined || _select_emp.COMMENTS == null ? "" : _select_emp.COMMENTS;
                        BulkObj.BULK_UPDATE_MANAGER.push(BulkTypeObj);
                        valid++;
                    }
                });
                if (valid > 0) {
                    PrcCommMethods.HUMANRESOURCE_API(BulkObj, 'HRM_BULK_UPDATE_MANAGER').then(function (data) {
                        if (data.data == 1) {
                            $scope.$parent.ShowAlertBox("Success", "Updated Successfully", 3000);
                            $scope.HRM_GET_EMPLOYEE_LIST(1);
                            $scope.EmployeeSearch.BULK_UPDATE_TYPE_ID = 0;
                            $scope.EmployeeSearch.EFFECTIVE_FROM = '';
                            $scope.EmployeeSearch.REPORTING_MANAGER_ID = '';
                            $scope.EmployeeSearch.CUSTOME_REPORTING_MANAGER = $scope.EmployeeSearch.DD_DEFAULT_TEXT;
                            $scope.SELECTED_EMPLOYEE_LIST = [];
                            $scope.BulkForm.submitted = false;
                        }
                        if (data.data == 0) {
                            if ($scope.EmployeeSearch.BULK_EMPLOYEE_SEARCH != '' || $scope.EmployeeSearch.DDL_BRANCH_ID != '' || $scope.EmployeeSearch.DDL_DEPARTMENT_ID != '' || $scope.EmployeeSearch.DDL_POSITION_ID != '') {
                                $scope.$parent.ShowAlertBox("Attention", "Please assign add manager to filtered out employees as well.", 3000);
                            } else {
                                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                            }
                        }
                    });
                } else if (valid == 0) {
                    $scope.$parent.ShowAlertBox("Attention", "Selected employee record are not valid to add employee.", 3000);
                }
            }
        } else {
            $scope.$parent.ShowAlertBox("Attention", "A person cannot assign themselves as their own manager.", 3000);
        }
    }
    $scope.HRM_BULK_UPDATE_TERMINATION = function () {
        $scope.TerminationForm.submitted = true;
        var valid = 0;
        if ($scope.TerminationForm.$valid) {
            var TerObj = new Object();
            TerObj.USER_ID = $cookies.get("USERID");
            TerObj.CUSTOMER_ID = $cookies.get("CUSTOMER_ID");
            TerObj.ENTITY_ID = $cookies.get("ENTITY_ID");
            TerObj.COMMENTS = "";
            TerObj.BULK_UPDATE_TERMINATION = [];

            angular.forEach($scope.SELECTED_EMPLOYEE_LIST_TERMINATE, function (_select_emp) {
                if (!_select_emp.IS_EXCETION && _select_emp.REPORTEE_COUNT == 0 && _select_emp.IS_DELETED == 0) {
                    var TermminTypeObj = new Object();
                    TermminTypeObj.EMPLY_PRSNL_ID = _select_emp.EMPLY_PRSNL_ID;
                    TermminTypeObj.PRIMARY_REPORTING_MANAGER_ID = null;
                    TermminTypeObj.SECONDARY_REPORTING_MANAGER_ID = null;
                    TermminTypeObj.TERTIARY_REPORTING_MANAGER_ID = null;
                    TermminTypeObj.TERMINATION_REASON_ID = _select_emp.TERMINATION_REASONS_ID == undefined || _select_emp.TERMINATION_REASONS_ID == null || _select_emp.TERMINATION_REASONS_ID == '' ? null : _select_emp.TERMINATION_REASONS_ID;
                    TermminTypeObj.WORK_PATTERN_ID = null;
                    TermminTypeObj.HOLIDAY_ENTITLEMENTS_ID = null;
                    TermminTypeObj.ACTUAL_ALLOWANCE = null;
                    TermminTypeObj.STANDARD_ROLE_ID = null;
                    TermminTypeObj.PAYTYPE_ID = null;
                    TermminTypeObj.WAGE = null;
                    TermminTypeObj.ABSENCE_TYPE_ID = null;
                    TermminTypeObj.START_DATE = null;
                    TermminTypeObj.END_DATE = null;
                    TermminTypeObj.EFFECTIVE_FROM = (_select_emp.EFFECTIVE_FROM == undefined || _select_emp.EFFECTIVE_FROM == '' || _select_emp.EFFECTIVE_FROM == null) ? "" : moment(_select_emp.EFFECTIVE_FROM, "DD/MM/YYYY").format('L');
                    TermminTypeObj.COMMENTS = _select_emp.COMMENTS == undefined || _select_emp.COMMENTS == null ? "" : _select_emp.COMMENTS;
                    TerObj.BULK_UPDATE_TERMINATION.push(TermminTypeObj);
                    valid++;
                }
            });
            if (valid > 0) {
                PrcCommMethods.HUMANRESOURCE_API(TerObj, 'HRM_BULK_UPDATE_TERMINATION').then(function (data) {
                    if (data.data == 1) {
                        $scope.$parent.ShowAlertBox("Success", "Updated Successfully", 3000);
                        $scope.HRM_GET_EMPLOYEE_LIST(1);
                        $scope.EmployeeSearch.BULK_UPDATE_TYPE_ID = 0;
                        $scope.SELECTED_EMPLOYEE_LIST_TERMINATE = [];
                        $scope.TerminationSearch.EFFECTIVE_FROM = '';
                        $scope.TerminationSearch.TERMINATION_REASONS_ID = '';
                        $scope.TerminationSearch.CUSTOM_TERMINATION_REASON = $scope.TerminationSearch.DD_DEFAULT_TEXT;
                        $scope.TerminationForm.submitted = false;
                    }
                    if (data.data == 0) {
                        if ($scope.TerminationSearch.BULK_EMPLOYEE_SEARCH != '' || $scope.TerminationSearch.TERMINATION_BRANCH_ID != '' || $scope.TerminationSearch.TERMINATION_DEPARTMENT_ID != '' || $scope.TerminationSearch.TERMINATION_POSITION_ID != '') {
                            $scope.$parent.ShowAlertBox("Attention", "Please assign terminate to filtered out employees as well.", 3000);
                        } else {
                            $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                        }

                    }
                });
            } else if (valid == 0) {
                $scope.$parent.ShowAlertBox("Attention", "Selected employee record are not valid to terminate.", 3000);
            }

        }
    }

    $scope.HRM_BULK_UPDATE_WORK_PATTERN = function () {
        $scope.WorkPatternForm.submitted = true;
        if ($scope.WorkPatternForm.$valid) {
            var WrkObj = new Object();
            WrkObj.USER_ID = $cookies.get("USERID");
            WrkObj.CUSTOMER_ID = $cookies.get("CUSTOMER_ID");
            WrkObj.ENTITY_ID = $cookies.get("ENTITY_ID");
            WrkObj.COMMENTS = "";
            WrkObj.HRM_BULK_UPDATE_WORK_PATTERN = [];
            var valid = 0;
            angular.forEach($scope.SELECTED_EMPLOYEE_LIST_WORK_PATTERN, function (_select_emp) {
                if (!_select_emp.IS_EXCETION && _select_emp.IS_DELETED == 0) {
                    var WrkTypeObj = new Object();
                    WrkTypeObj.EMPLY_PRSNL_ID = _select_emp.EMPLY_PRSNL_ID;
                    WrkTypeObj.PRIMARY_REPORTING_MANAGER_ID = _select_emp.PRIMARY_REPORTING_MANAGER_ID == undefined ? null : _select_emp.PRIMARY_REPORTING_MANAGER_ID;
                    WrkTypeObj.SECONDARY_REPORTING_MANAGER_ID = _select_emp.SECONDARY_REPORTING_MANAGER_ID == undefined ? null : _select_emp.SECONDARY_REPORTING_MANAGER_ID;
                    WrkTypeObj.TERTIARY_REPORTING_MANAGER_ID = _select_emp.TERTIARY_REPORTING_MANAGER_ID == undefined ? null : _select_emp.TERTIARY_REPORTING_MANAGER_ID;
                    WrkTypeObj.TERMINATION_REASON_ID = null;
                    WrkTypeObj.WORK_PATTERN_ID = _select_emp.WORK_PATTERN_ID;
                    WrkTypeObj.HOLIDAY_ENTITLEMENTS_ID = null;
                    WrkTypeObj.ACTUAL_ALLOWANCE = null;
                    WrkTypeObj.STANDARD_ROLE_ID = null;
                    WrkTypeObj.PAYTYPE_ID = null;
                    WrkTypeObj.WAGE = null;
                    WrkTypeObj.ABSENCE_TYPE_ID = null;
                    WrkTypeObj.START_DATE = null;
                    WrkTypeObj.END_DATE = null;
                    WrkTypeObj.EFFECTIVE_FROM = moment(_select_emp.EFFECTIVE_FROM, "DD/MM/YYYY").format('L');
                    WrkTypeObj.COMMENTS = _select_emp.COMMENTS == undefined || _select_emp.COMMENTS == null ? "" : _select_emp.COMMENTS;
                    WrkObj.HRM_BULK_UPDATE_WORK_PATTERN.push(WrkTypeObj);
                    valid++;
                }
            });
            if (valid > 0) {
                PrcCommMethods.HUMANRESOURCE_API(WrkObj, 'HRM_BULK_UPDATE_WORK_PATTERN').then(function (data) {
                    if (data.data == 1) {
                        $scope.$parent.ShowAlertBox("Success", "Updated Successfully", 3000);
                        $scope.HRM_GET_EMPLOYEE_LIST(1);
                        $scope.EmployeeSearch.BULK_UPDATE_TYPE_ID = 0;
                        $scope.SELECTED_EMPLOYEE_LIST_WORK_PATTERN = [];
                        // $scope.EmployeeSearch.EFFECTIVE_FROM = '';
                    }
                    if (data.data == 0) {
                        if ($scope.WorkPatternSearch.BULK_EMPLOYEE_SEARCH != '' || $scope.WorkPatternSearch.WORK_PATTERN_BRANCH_ID != '' || $scope.WorkPatternSearch.WORK_PATTERN_DEPARTMENT_ID != '' || $scope.WorkPatternSearch.WORK_PATTERN_POSITION_ID != '') {
                            $scope.$parent.ShowAlertBox("Attention", "Please assign work pattern to filtered out employees as well.", 3000);
                        } else {
                            $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                        }
                    }
                });
            } else if (valid == 0) {
                $scope.$parent.ShowAlertBox("Attention", "Selected employee record are not valid to assign work pattern.", 3000);
            }
        }
    }
    $scope.HRM_BULK_WAGE = function () {
        $scope.WageForm.submitted = true;
        if ($scope.WageForm.$valid) {

        }
    }
});