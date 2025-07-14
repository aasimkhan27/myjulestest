app.controller('EmpAccessController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {

    //$scope.$parent.DISPLAY_FLAG = false;
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(2);
    $scope.$parent.$parent.overlay_loading_HR_Loader = 'none';
    $scope.HR_COMMON_CODE_Fn();
    $(".modal-backdrop").remove();
    $scope.UserAccessSearch = {
        EMPLY_PRSNL_ID: getUrlParameter('EMP_ID', $location.absUrl()),
        CUSTOMER_ID: $cookies.get("CUSTOMER_ID"),
        ENTITY_ID: null,// $cookies.get("ENTITY_ID"),
        MODULE_ID: $cookies.get("MODULE_ID"),
        USER_ID: $cookies.get("USERID"),
        CUSTOM_PAY_TYPE: 'Choose',
        DD_DEFAULT_TEXT: 'Choose',
        SCHEDULING: false,
        ABSENCE: false,
        REPORTS: false,
        LOGIN_EMPLOYEE_ID: $cookies.get("EMPLY_PRSNL_ID"),
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        STEP_NO: 5,
    }

    $scope.IS_ROLE_CHANGED = false;
    $scope.STEP_FLAG = 5;
    $scope.EDIT_STEP_NO = getUrlParameter('STEP_NO', $location.absUrl());
    $scope.EDIT_STEP_NO = $scope.EDIT_STEP_NO == undefined ? 0 : $scope.EDIT_STEP_NO;
    $scope.MY_PROFILE_FLAG = 0;
    if (parseInt(getUrlParameter('EMP_ID', $location.absUrl())) == parseInt($cookies.get("EMPLY_PRSNL_ID"))) {
        $scope.EDIT_MODE = true;
        $scope.MY_PROFILE_FLAG = 1;
    };
    $scope.POSITIONS_EMP_LIST = [];
    $scope.EMPLOYTEE_EMP_LIST = [];
    $scope.HRM_EDIT_DETAILS = function () {
        $scope.EDIT_MODE = false;
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
                $scope.HeaderPrimaryDetails.PRIMARY_REPORTING_MANAGER_ID = RESULT_PERSNL.PRIMARY_REPORTING_MANAGER_ID;
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

    $scope.MODULE_ACCESS = [
        { 'MODULE_NAME': 'Scheduling', EMPLOYEE_ACCESS_ID: 1 },
        { 'MODULE_NAME': 'Time Sheet', EMPLOYEE_ACCESS_ID: 2 },
        { 'MODULE_NAME': 'Reports', EMPLOYEE_ACCESS_ID: 3 },
        { 'MODULE_NAME': 'Absence', EMPLOYEE_ACCESS_ID: 4 }];
    $scope.SUB_MODULE_PAGE_LIST = [
        { 'SUB_MODULE_NAME': 'GENERAL', SUB_MODULE_PAGE_ID: 1 },
        { 'SUB_MODULE_NAME': 'ANNOUNCEMENT', SUB_MODULE_PAGE_ID: 2 },
        { 'SUB_MODULE_NAME': 'MEMO', SUB_MODULE_PAGE_ID: 3 }]
    $scope.ASSIGNEE_REPORTS_LIST = [];
    $scope.ASSIGNEE_BRANCH_LIST = [];
    $scope.GET_MODULE_ROLES = function (_emp_data) {
        var UserModelObj = new Object();
        UserModelObj.CUSTOMER_ID = $scope.UserAccessSearch.CUSTOMER_ID;
        UserModelObj.MODULE_ID = $scope.UserAccessSearch.MODULE_ID;
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'GET_MODULE_ROLES').then(function (data) {
            if (data.data.Table.length > 0) {
                if (_emp_data != undefined) {
                    $scope.UserAccessSearch.EMPLOYEE_ACCESS_ID = _emp_data.data.Table[0].EMPLOYEE_ACCESS_ID;
                    $scope.UserAccessSearch.STANDARD_ROLE_ID = _emp_data.data.Table[0].STANDARD_ROLE_ID;
                    $scope.UserAccessSearch.CUSTOM_ROLE_NAME = _emp_data.data.Table[0].ROLE_NAME;

                    $scope.ASSIGNEE_BRANCH_LIST = _emp_data.data.Table1;
                    $scope.ASSIGNEE_REPORTS_LIST = _emp_data.data.Table2;

                    $scope.HRM_GET_USER_MANAGEMENT_ACCESS();

                    $scope.EMPLOYEE_ACCESS_LIST = data.data.Table;
                }
                else {
                    $scope.HRM_GET_USER_MANAGEMENT_ACCESS();
                }
                $scope.MODULE_ROLES_LIST = data.data.Table;

            }
            else if (data.data == null) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
            else {
                $scope.MODULE_ROLES_LIST = [];
                $scope.HRM_GET_USER_MANAGEMENT_ACCESS();
            }
        });
    }
    $scope.HRM_GET_EMPLOYEE_ACCESS = function () {
        var UserModelObj = new Object();
        UserModelObj.EMPLY_PRSNL_ID = $scope.UserAccessSearch.EMPLY_PRSNL_ID;
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'HRM_GET_EMPLOYEE_ACCESS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.GET_MODULE_ROLES(data);
            }
            else {
                $scope.EMPLOYEE_ACCESS_LIST = [];
                $scope.GET_MODULE_ROLES();
            }
        });
    }

    $scope.SUB_MODULE_BY_STANDARD_ROLE_ID = [];
    $scope.SUB_MODULE_BY_STANDARD_ROLE_ID_COPY = [];

    $scope.GET_SUB_MODULE_BY_STANDARD_ROLE_ID = function () {
        var UserModelObj = new Object();
        UserModelObj.STANDARD_ROLE_ID = $scope.UserAccessSearch.STANDARD_ROLE_ID;
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'GET_SUB_MODULE_BY_STANDARD_ROLE_ID').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.SUB_MODULE_BY_STANDARD_ROLE_ID = data.data.Table;
                if ($scope.IS_ROLE_CHANGED == false) {
                    $scope.SUB_MODULE_BY_STANDARD_ROLE_ID_COPY = data.data.Table;
                }
            }
            else if (data.data == null) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
            else {
                $scope.SUB_MODULE_BY_STANDARD_ROLE_ID = [];
            }
        });
    }

    $scope.HRM_GET_EMPLOYEE_LIST_BY_ENTITY_BRANCH = function (_site, _module) {
        var UserModelObj = new Object();
        UserModelObj.ENTITY_ID = $cookies.get("ENTITY_ID");
        UserModelObj.BRANCH_ID = _site.BRANCH_ID;
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'HRM_GET_EMPLOYEE_LIST_BY_ENTITY_BRANCH').then(function (data) {
            if (data.data.Table.length > 0) {
                _site.INIT_INCLUDE_EMPLOYTEE_EMP_LIST = angular.copy(data.data.Table);
                _site.INIT_EXCLUDE_EMPLOYTEE_EMP_LIST = angular.copy(data.data.Table);
                if ($scope.ASSIGNEE_BRANCH_LIST.length > 0) {
                    let branchresult = $scope.ASSIGNEE_BRANCH_LIST.filter(function (_filter_value) { return _site.BRANCH_ID == _filter_value.BRANCH_ID && _filter_value.SUB_MODULE_ID == 6 });
                    if (branchresult.length > 0) {
                        let Emplyidis = branchresult[0].EMPLY_PRSNL_IDS_INCLUDE == null ? '' : branchresult[0].EMPLY_PRSNL_IDS_INCLUDE.split(',');
                        if (Emplyidis.length > 0) {
                            angular.forEach(_site.INIT_INCLUDE_EMPLOYTEE_EMP_LIST, function (_emp_loop_value) {
                                let result_DB_EMP = Emplyidis.filter(function (x) { return parseInt(x) == _emp_loop_value.EMPLY_PRSNL_ID });
                                if (result_DB_EMP.length > 0) {
                                    _site.INCLUDE_EMPLOYEES_LIST.push(_emp_loop_value);
                                }
                            });
                        }
                        //if (_site.INCLUDE_EMPLOYEES_LIST.length > 0) {
                        //if (branchresult)
                        if (_module.SUB_MODULE_ID == 6) {
                            $scope.HRM_GET_POSITION_EMPLOYEE_LIST_FOR_EXCLUDE(_site, _module, 1, branchresult);
                        }
                        //}
                    };
                }
            }
        });
    };
    $scope.ADMIN_GET_DEPARTMENT_POSITION_Fn = function () {
        var UserModelObj = new Object();
        UserModelObj.CUSTOMER_ID = $cookies.get("CUSTOMER_ID");
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'ADMIN_GET_DEPARTMENT_POSITION').then(function (data) {
            if (data.data.DEPARTMENT.length > 0) {
                $scope.SCHD_DEPARTMENTS_EMP_LIST = data.data.DEPARTMENT;
            }
            if (data.data.POSITION.length > 0) {
                $scope.SCHD_POSITIONS_EMP_LIST = data.data.POSITION;
            }
            $scope.GET_SUB_MODULE_BY_STANDARD_ROLE_ID();
        });
    }

    $scope.HRM_GET_POSITION_EMPLOYEE_LIST_FOR_EXCLUDE = function (_site, _module, _AUTO_FILL_FLAG, branchresult) {
        var UserModelObj = new Object();
        UserModelObj.ENTITY_ID = $cookies.get("ENTITY_ID");
        UserModelObj.BRANCH_ID = _site.BRANCH_ID;
        UserModelObj.SUB_MODULE_ID = _module.SUB_MODULE_ID;
        UserModelObj.DEPARTMENTS_TYPE = [];
        UserModelObj.POSITIONS_TYPE = [];
        UserModelObj.EMPLOYEES_TYPE = [];

        angular.forEach(_site.INCLUDE_DEPARTMENTS_LIST, function (_dep_loop_value) {
            var readonly = new Object();
            readonly.TABLE_ID = _dep_loop_value.DEPARTMENT_ID;
            UserModelObj.DEPARTMENTS_TYPE.push(readonly);
        });

        angular.forEach(_site.INCLUDE_POSITIONS_LIST, function (_post_loop_value) {
            var readonly = new Object();
            readonly.TABLE_ID = _post_loop_value.POSITION_ID;
            UserModelObj.POSITIONS_TYPE.push(readonly);
        });

        angular.forEach(_site.INCLUDE_EMPLOYEES_LIST, function (_emp_loop_value) {
            var readonly = new Object();
            readonly.TABLE_ID = _emp_loop_value.EMPLY_PRSNL_ID;
            UserModelObj.EMPLOYEES_TYPE.push(readonly);
        });
        if (UserModelObj.DEPARTMENTS_TYPE.length == 0) {
            var readonly = new Object();
            readonly.TABLE_ID = 0;
            UserModelObj.DEPARTMENTS_TYPE.push(readonly);
        }
        if (UserModelObj.POSITIONS_TYPE.length == 0) {
            var readonly = new Object();
            readonly.TABLE_ID = 0;
            UserModelObj.POSITIONS_TYPE.push(readonly);
        }
        if (UserModelObj.EMPLOYEES_TYPE.length == 0) {
            var readonly = new Object();
            readonly.TABLE_ID = 0;
            UserModelObj.EMPLOYEES_TYPE.push(readonly);
        }
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'HRM_GET_POSITION_EMPLOYEE_LIST_FOR_EXCLUDE').then(function (data) {
            if (data.data.Table.length > 0) {
                _site.INIT_EXCLUDE_POSITIONS_EMP_LIST = angular.copy(data.data.Table);
                _site.INIT_EXCLUDE_EMPLOYTEE_EMP_LIST = angular.copy(data.data.Table1);

                if (_AUTO_FILL_FLAG == 1) {
                    //////////////////////// Exclude//////////////////
                    //let Excludedeprtids = branchresult[0].DEPARTMENT_IDS_EXCLUDE == null ? '' : branchresult[0].DEPARTMENT_IDS_EXCLUDE.split(',');
                    let ExcludePostionids = branchresult[0].POSITION_IDS_EXCLUDE == null ? '' : branchresult[0].POSITION_IDS_EXCLUDE.split(',');
                    let ExcludeEmplyids = branchresult[0].EMPLY_PRSNL_IDS_EXCLUDE == null ? '' : branchresult[0].EMPLY_PRSNL_IDS_EXCLUDE.split(',');

                    //if (Excludedeprtids.length > 0) {
                    //    angular.forEach(_site.INIT_EXCLUDE_DEPARTMENTS_EMP_LIST, function (_dep_loop_value) {
                    //        let result_DB_DEPT = Excludedeprtids.filter(function (x) { return parseInt(x) == _dep_loop_value.DEPARTMENT_ID });
                    //        if (result_DB_DEPT.length > 0) {
                    //            _site.EXCLUDE_DEPARTMENTS_LIST.push(_dep_loop_value);
                    //        }
                    //    });
                    //}
                    if (ExcludePostionids.length > 0) {
                        angular.forEach(_site.INIT_EXCLUDE_POSITIONS_EMP_LIST, function (_post_loop_value) {
                            let result_DB_POSI = ExcludePostionids.filter(function (x) { return parseInt(x) == _post_loop_value.POSITION_ID });
                            if (result_DB_POSI.length > 0) {
                                _site.EXCLUDE_POSITIONS_LIST.push(_post_loop_value);
                                //EXCLUDE_POSITIONS_LIST
                            }
                        });
                    }
                    if (ExcludeEmplyids.length > 0) {
                        angular.forEach(_site.INIT_EXCLUDE_EMPLOYTEE_EMP_LIST, function (_emp_loop_value) {
                            let result_DB_EMP = ExcludeEmplyids.filter(function (x) { return parseInt(x) == _emp_loop_value.EMPLY_PRSNL_ID });
                            if (result_DB_EMP.length > 0) {
                                _site.EXCLUDE_EMPLOYEES_LIST.push(_emp_loop_value);
                            }
                        });
                    }

                    //_site.INCLUDE_POSITIONS_LIST = [];
                    //_site.INIT_INCLUDE_POSITIONS_EMP_LIST = angular.copy($scope.SCHD_POSITIONS_EMP_LIST);

                    //_site.INCLUDE_EMPLOYEES_LIST = [];
                    //_site.INIT_INCLUDE_EMPLOYTEE_EMP_LIST = angular.copy($scope.EMPLOYTEE_EMP_LIST);

                    //_site.EXCLUDE_DEPARTMENTS_LIST = [];
                    //_site.INIT_EXCLUDE_DEPARTMENTS_EMP_LIST = angular.copy($scope.SCHD_DEPARTMENTS_EMP_LIST);

                    //_site.EXCLUDE_POSITIONS_LIST = [];
                    //_site.INIT_EXCLUDE_POSITIONS_EMP_LIST = angular.copy($scope.SCHD_POSITIONS_EMP_LIST);


                }
                else if (_AUTO_FILL_FLAG == 0) {
                    if (_site.EXCLUDE_DEPARTMENTS_LIST.length > 0) {
                        angular.forEach(_site.EXCLUDE_DEPARTMENTS_LIST, function (_department) {
                            _site.INIT_EXCLUDE_DEPARTMENTS_EMP_LIST = _site.INIT_EXCLUDE_DEPARTMENTS_EMP_LIST.filter(item => item.DEPARTMENT_ID !== _department.DEPARTMENT_ID);
                        });
                    };
                    if (_site.EXCLUDE_POSITIONS_LIST.length > 0) {
                        angular.forEach(_site.EXCLUDE_POSITIONS_LIST, function (_position) {
                            _site.INIT_EXCLUDE_POSITIONS_EMP_LIST = _site.INIT_EXCLUDE_POSITIONS_EMP_LIST.filter(item => item.POSITION_ID !== _position.POSITION_ID);
                        });
                    };
                    if (_site.INCLUDE_EMPLOYEES_LIST.length > 0) {
                        angular.forEach(_site.INCLUDE_EMPLOYEES_LIST, function (_employee) {
                            _site.INIT_EXCLUDE_EMPLOYTEE_EMP_LIST = _site.INIT_EXCLUDE_EMPLOYTEE_EMP_LIST.filter(item => item.EMPLY_PRSNL_ID !== _employee.EMPLY_PRSNL_ID);
                        });
                    };
                }
            }
        });
    };
    $scope.DEPARTMENTS_EMP_LIST = [];
    $scope.HRM_GET_USER_MANAGEMENT_ACCESS = function () {
        var UserModelObj = new Object();
        UserModelObj.CUSTOMER_ID = $cookies.get("CUSTOMER_ID");
        UserModelObj.ENTITY_ID = $cookies.get("ENTITY_ID");
        UserModelObj.EMPLY_PRSNL_ID = $cookies.get("EMPLY_PRSNL_ID");
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'HRM_GET_USER_MANAGEMENT_ACCESS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.HR_BRANCH_LIST = data.data.Table;
            }
            if (data.data.Table1.length > 0) {
                $scope.DEPARTMENTS_EMP_LIST = data.data.Table1;
            }
            if (data.data.Table2.length > 0) {
                $scope.POSITIONS_EMP_LIST = data.data.Table2;
            }
            if (data.data.Table3.length > 0) {
                $scope.EMPLOYTEE_EMP_LIST = data.data.Table3;
            }
            else if (data.data == null) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
            $scope.ADMIN_GET_DEPARTMENT_POSITION_Fn();
        });
    };
    $scope.GET_REPORTS_BY_MODULE_ID = function () {
        var UserAccesModelObj = new Object();
        UserAccesModelObj.MODULE_ID = $scope.UserAccessSearch.MODULE_ID;
        UserAccesModelObj.CUSTOMER_ID = $scope.UserAccessSearch.CUSTOMER_ID;
        PrcCommMethods.HUMANRESOURCE_API(UserAccesModelObj, 'GET_REPORTS_BY_MODULE_ID').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.REPORTS_BY_MODULE_ID_LIST = data.data.Table;
            }
            else if (data.data == null) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
            else {
                $scope.REPORTS_BY_MODULE_ID_LIST = [];
            }
        });
    }

    $scope.nginit_employee = function (_employee) {
        _employee.SHORT_NAME = $scope.TextReturn(_employee.EMPLOYEE_NAME);
        //if (_employee.PROFILE_PIC_PATH != "" && _employee.PROFILE_PIC_PATH != null) {
        //    _employee.PROFILE_PIC_PATH = "/" + $scope.$parent.UPLOAD_FOLDER_NAME + _employee.PROFILE_PIC_PATH;
        //}
    }
    $scope.nginit_site = function (_site, _module) {
        //6 "Scheduling"
        //10 User Managment
        //8 "Reports"

        if (_module.SUB_MODULE_ID == 14) {
            _site.INIT_INCLUDE_BRANCH_EMP_LIST = angular.copy($scope.HR_BRANCH_LIST);
            _site.INIT_INCLUDE_DEPARTMENTS_EMP_LIST = angular.copy($scope.DEPARTMENTS_EMP_LIST);
            _site.INIT_INCLUDE_POSITIONS_EMP_LIST = angular.copy($scope.POSITIONS_EMP_LIST);
            _site.INIT_INCLUDE_EMPLOYTEE_EMP_LIST = angular.copy($scope.EMPLOYTEE_EMP_LIST.filter(function (Branch) { return Branch.BRANCH_ID == _site.BRANCH_ID }));

            _site.INIT_EXCLUDE_BRANCH_EMP_LIST = angular.copy($scope.HR_BRANCH_LIST);
            _site.INIT_EXCLUDE_DEPARTMENTS_EMP_LIST = angular.copy($scope.DEPARTMENTS_EMP_LIST);
            _site.INIT_EXCLUDE_POSITIONS_EMP_LIST = angular.copy($scope.POSITIONS_EMP_LIST);
            _site.INIT_EXCLUDE_EMPLOYTEE_EMP_LIST = angular.copy($scope.filter(function (Branch) { return Branch.BRANCH_ID == _site.BRANCH_ID }));

            _site.INCLUDE_BRANCH_LIST = [];
            _site.INCLUDE_DEPARTMENTS_LIST = [];
            _site.INCLUDE_POSITIONS_LIST = [];
            _site.INCLUDE_EMPLOYEES_LIST = [];

            _site.EXCLUDE_BRANCH_LIST = [];
            _site.EXCLUDE_DEPARTMENTS_LIST = [];
            _site.EXCLUDE_POSITIONS_LIST = [];
            _site.EXCLUDE_EMPLOYEES_LIST = [];
        }
        else if (_module.SUB_MODULE_ID == 6) { //6 "Scheduling"
            _site.SHOW_WAGE = false;
            _site.TIME_SHEETS = false;
            _site.FEED_ACCESS = false;

            if ($cookies.get("EMPLY_PRSNL_ID") == null || parseInt($cookies.get("EMPLY_PRSNL_ID")) == 0) {
                _site.INIT_INCLUDE_DEPARTMENTS_EMP_LIST = angular.copy($scope.SCHD_DEPARTMENTS_EMP_LIST);
                _site.INIT_INCLUDE_POSITIONS_EMP_LIST = angular.copy($scope.SCHD_POSITIONS_EMP_LIST);
            }
            else {
                //_site.INIT_INCLUDE_DEPARTMENTS_EMP_LIST = angular.copy($scope.SCHD_DEPARTMENTS_EMP_LIST.filter(function (ff) { return ff.BRANCH_ID == _site.BRANCH_ID }));
                //_site.INIT_INCLUDE_POSITIONS_EMP_LIST = angular.copy($scope.SCHD_POSITIONS_EMP_LIST.filter(function (ff) { return ff.BRANCH_ID == _site.BRANCH_ID }));

                _site.INIT_INCLUDE_DEPARTMENTS_EMP_LIST = angular.copy($scope.SCHD_DEPARTMENTS_EMP_LIST); // Not depend on employee access which is given by super admin to employee
                _site.INIT_INCLUDE_POSITIONS_EMP_LIST = angular.copy($scope.SCHD_POSITIONS_EMP_LIST);
            }
            _site.INIT_INCLUDE_EMPLOYTEE_EMP_LIST = [];
            //Branch Call
            //  _site.INIT_EXCLUDE_DEPARTMENTS_EMP_LIST = angular.copy($scope.SCHD_DEPARTMENTS_EMP_LIST);
            //  _site.INIT_EXCLUDE_POSITIONS_EMP_LIST = angular.copy($scope.SCHD_POSITIONS_EMP_LIST);
            // _site.INIT_EXCLUDE_EMPLOYTEE_EMP_LIST = angular.copy($scope.EMPLOYTEE_EMP_LIST);

            _site.INCLUDE_DEPARTMENTS_LIST = [];
            _site.INCLUDE_POSITIONS_LIST = [];
            _site.INCLUDE_EMPLOYEES_LIST = [];

            _site.EXCLUDE_DEPARTMENTS_LIST = [];
            _site.EXCLUDE_POSITIONS_LIST = [];
            _site.EXCLUDE_EMPLOYEES_LIST = [];
            $scope.HRM_GET_EMPLOYEE_LIST_BY_ENTITY_BRANCH(_site, _module);
        }
        else if (_module.SUB_MODULE_ID == 10) {   //10 User Managment
            _site.SHOW_WAGE = false;
            _site.TIME_SHEETS = false;
            _site.FEED_ACCESS = false;

            if ($cookies.get("EMPLY_PRSNL_ID") == null || parseInt($cookies.get("EMPLY_PRSNL_ID")) == 0) {
                _site.INIT_INCLUDE_DEPARTMENTS_EMP_LIST = angular.copy($scope.DEPARTMENTS_EMP_LIST);
                _site.INIT_INCLUDE_POSITIONS_EMP_LIST = angular.copy($scope.POSITIONS_EMP_LIST);
                _site.INIT_INCLUDE_EMPLOYTEE_EMP_LIST = angular.copy($scope.EMPLOYTEE_EMP_LIST.filter(function (Branch) { return Branch.BRANCH_ID == _site.BRANCH_ID }));


            }
            else {
                _site.INIT_INCLUDE_DEPARTMENTS_EMP_LIST = angular.copy($scope.DEPARTMENTS_EMP_LIST.filter(function (ff) { return ff.BRANCH_ID == _site.BRANCH_ID }));
                _site.INIT_INCLUDE_POSITIONS_EMP_LIST = angular.copy($scope.POSITIONS_EMP_LIST.filter(function (ff) { return ff.BRANCH_ID == _site.BRANCH_ID }));
                _site.INIT_INCLUDE_EMPLOYTEE_EMP_LIST = angular.copy($scope.EMPLOYTEE_EMP_LIST.filter(function (ff) { return ff.BRANCH_ID == _site.BRANCH_ID }));
            }
            _//site.INIT_EXCLUDE_DEPARTMENTS_EMP_LIST = angular.copy($scope.DEPARTMENTS_EMP_LIST);
            //_site.INIT_EXCLUDE_POSITIONS_EMP_LIST = angular.copy($scope.POSITIONS_EMP_LIST);
            //_site.INIT_EXCLUDE_EMPLOYTEE_EMP_LIST = angular.copy($scope.EMPLOYTEE_EMP_LIST);
            _site.INCLUDE_DEPARTMENTS_LIST = [];
            _site.INCLUDE_POSITIONS_LIST = [];
            _site.INCLUDE_EMPLOYEES_LIST = [];

            _site.EXCLUDE_DEPARTMENTS_LIST = [];
            _site.EXCLUDE_POSITIONS_LIST = [];
            _site.EXCLUDE_EMPLOYEES_LIST = [];

        }

        if (_module.SUB_MODULE_ID == 6 || _module.SUB_MODULE_ID == 10 || _module.SUB_MODULE_ID == 14) {
            if ($scope.ASSIGNEE_BRANCH_LIST.length > 0) {
                let branchresult = $scope.ASSIGNEE_BRANCH_LIST.filter(function (_filter_value) { return _site.BRANCH_ID == _filter_value.BRANCH_ID && _module.SUB_MODULE_ID == _filter_value.SUB_MODULE_ID });
                if (branchresult.length > 0) {
                    _site.EMPLOYEE_ACCESS_SUB_MODULES_ID = branchresult[0].EMPLOYEE_ACCESS_SUB_MODULES_ID;
                    _site.ACTIVE = branchresult[0].ACTIVE;
                    if (branchresult[0].ACTIVE) {
                        _module.MODULE_ACTIVE = true;
                    }
                    _site.SHOW_WAGE = branchresult[0].SHOW_WAGE;
                    _site.TIME_SHEETS = branchresult[0].TIME_SHEETS;
                    _site.FEED_ACCESS = branchresult[0].FEED_ACCESS;

                    _site.ALL_POSITIONS_INCLUDE = branchresult[0].ALL_POSITIONS_INCLUDE;
                    _site.ALL_DEPARTMENTS_INCLUDE = branchresult[0].ALL_DEPARTMENTS_INCLUDE;
                    //////////////////////// Include//////////////////

                    let deprtidis = branchresult[0].DEPARTMENT_IDS_INCLUDE == null ? '' : branchresult[0].DEPARTMENT_IDS_INCLUDE.split(',');
                    let Postionidis = branchresult[0].POSITION_IDS_INCLUDE == null ? '' : branchresult[0].POSITION_IDS_INCLUDE.split(',');
                    let Emplyidis = branchresult[0].EMPLY_PRSNL_IDS_INCLUDE == null ? '' : branchresult[0].EMPLY_PRSNL_IDS_INCLUDE.split(',');

                    if (deprtidis.length > 0) {
                        angular.forEach(_site.INIT_INCLUDE_DEPARTMENTS_EMP_LIST, function (_dep_loop_value) {
                            let result_DB_DEPT = deprtidis.filter(function (x) { return parseInt(x) == _dep_loop_value.DEPARTMENT_ID });
                            if (result_DB_DEPT.length > 0) {
                                _site.INCLUDE_DEPARTMENTS_LIST.push(_dep_loop_value);
                            }
                        });
                    }
                    if (Postionidis.length > 0) {
                        angular.forEach(_site.INIT_INCLUDE_POSITIONS_EMP_LIST, function (_post_loop_value) {
                            let result_DB_POSI = Postionidis.filter(function (x) { return parseInt(x) == _post_loop_value.POSITION_ID });
                            if (result_DB_POSI.length > 0) {
                                _site.INCLUDE_POSITIONS_LIST.push(_post_loop_value);
                            }
                        });
                    }
                    if (Emplyidis.length > 0) {
                        angular.forEach(_site.INIT_INCLUDE_EMPLOYTEE_EMP_LIST, function (_emp_loop_value) {
                            let result_DB_EMP = Emplyidis.filter(function (x) { return parseInt(x) == _emp_loop_value.EMPLY_PRSNL_ID });
                            if (result_DB_EMP.length > 0) {
                                _site.INCLUDE_EMPLOYEES_LIST.push(_emp_loop_value);
                            }
                        });
                    }
                    if (_module.SUB_MODULE_ID != 6) {
                        if (_site.INCLUDE_DEPARTMENTS_LIST.length > 0 || _site.INCLUDE_POSITIONS_LIST.length > 0 || _site.INCLUDE_EMPLOYEES_LIST.length > 0) {
                            $scope.HRM_GET_POSITION_EMPLOYEE_LIST_FOR_EXCLUDE(_site, _module, 1, branchresult);
                        }
                    }
                };
            }
        };
        //$('[data-toggle="tooltip"]').tooltip();
        //$('[data-toggle="popover"]').popover();
    }
    $scope.nginit_report = function (_report, _module) {
        if ($scope.ASSIGNEE_REPORTS_LIST.length > 0) {

            if ($scope.ASSIGNEE_REPORTS_LIST.some(x => x.ACTIVE == 1)) {
                _module.MODULE_ACTIVE = true;
            } else {
                _module.MODULE_ACTIVE = false;
            }
            let reportresult = $scope.ASSIGNEE_REPORTS_LIST.filter(function (x) { return x.REPORT_ID == _report.REPORT_ID });
            if (reportresult.length > 0) {
                _report.ACTIVE = reportresult[0].ACTIVE == 1 ? true : false;
            }
        }
    }
    $scope.nginitStandarrole = function (_module) {
        _module.HR_BRANCH_LIST = angular.copy($scope.HR_BRANCH_LIST);
        _module.SUB_MODULE_PAGE_LIST = angular.copy($scope.SUB_MODULE_PAGE_LIST);
        //$('[data-toggle="tooltip"]').tooltip();
        //$('[data-toggle="popover"]').popover();
    }

    $scope.GET_REPORTS_BY_MODULE_ID();
    $scope.HRM_GET_EMPLOYEE_ACCESS();

    $scope.HRM_CLICK_EFFICTIVE_DATE = function () {
        $scope.EffectiveForm.submitted = true;
        if ($scope.EffectiveForm.$valid) {
            $scope.HRM_INS_UPD_EMPLOYEE_ACCESS('', 1);
        }
    }
    $scope.ALL_BRANCH_Fn = function () {

        if ($scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].HR_BRANCH_LIST[$scope.SELECTED_SITE_INDEX].ALL_DEPARTMENTS_INCLUDE == true) {
            angular.forEach($scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].HR_BRANCH_LIST[$scope.SELECTED_SITE_INDEX].INIT_INCLUDE_DEPARTMENTS_EMP_LIST, function (_department) {
                $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].HR_BRANCH_LIST[$scope.SELECTED_SITE_INDEX].INCLUDE_DEPARTMENTS_LIST.push(angular.copy(_department));
            });

            $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].HR_BRANCH_LIST[$scope.SELECTED_SITE_INDEX].INIT_INCLUDE_DEPARTMENTS_EMP_LIST = [];
        }   
        else if ($scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].HR_BRANCH_LIST[$scope.SELECTED_SITE_INDEX].ALL_DEPARTMENTS_INCLUDE == false) {
            angular.forEach($scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].HR_BRANCH_LIST[$scope.SELECTED_SITE_INDEX].INCLUDE_DEPARTMENTS_LIST, function (_department) {
                $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].HR_BRANCH_LIST[$scope.SELECTED_SITE_INDEX].INIT_INCLUDE_DEPARTMENTS_EMP_LIST.push(angular.copy(_department));
            });
            $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].HR_BRANCH_LIST[$scope.SELECTED_SITE_INDEX].INCLUDE_DEPARTMENTS_LIST = [];
        }
    }
    $scope.ALL_POSITION_Fn = function () {
        if ($scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].HR_BRANCH_LIST[$scope.SELECTED_SITE_INDEX].ALL_POSITIONS_INCLUDE == true) {
            angular.forEach($scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].HR_BRANCH_LIST[$scope.SELECTED_SITE_INDEX].INIT_INCLUDE_POSITIONS_EMP_LIST, function (_position) {
                $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].HR_BRANCH_LIST[$scope.SELECTED_SITE_INDEX].INCLUDE_POSITIONS_LIST.push(angular.copy(_position));
            });
            $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].HR_BRANCH_LIST[$scope.SELECTED_SITE_INDEX].INIT_INCLUDE_POSITIONS_EMP_LIST = [];
        } else if ($scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].HR_BRANCH_LIST[$scope.SELECTED_SITE_INDEX].ALL_POSITIONS_INCLUDE == false) {
            angular.forEach($scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].HR_BRANCH_LIST[$scope.SELECTED_SITE_INDEX].INCLUDE_POSITIONS_LIST, function (_position) {
                $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].HR_BRANCH_LIST[$scope.SELECTED_SITE_INDEX].INIT_INCLUDE_POSITIONS_EMP_LIST.push(angular.copy(_position));
            });
            $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].HR_BRANCH_LIST[$scope.SELECTED_SITE_INDEX].INCLUDE_POSITIONS_LIST = [];
        }
    }
    $scope.CHECK_CLICK_Fn = function (_site) {
        if (!_site.ACTIVE) {
            $scope.$parent.ShowAlertBox("Attention", "Please Enable the access", 3000);
        }
    }
    $scope.POP_EXCLUDE_Fn = function (_site, _module, index, TYPE, _module_Index) {
        if (_site.ACTIVE && !$scope.EDIT_MODE) {
            $scope.TYPE = TYPE;
            $scope.SELECTED_SITE = _site;
            $scope.SELECTED_SITE_INDEX = index;
            $scope.SELECTED_MODULE = _module;
            $scope.SELECTED_MODULE_INDEX = _module_Index;



            if (TYPE == 'Exclude') {
                $scope.POSITION_NAME = "";
                $scope.EMPLOYEES_NAME = "";
                if (_site.INCLUDE_COUNT > 0) {
                    $('#Exclude').modal('show');
                    $scope.HRM_GET_POSITION_EMPLOYEE_LIST_FOR_EXCLUDE(_site, _module, 0);
                }
                else {
                    $scope.$parent.ShowAlertBox("Attention", "Please Include to Exclude the access", 3000);

                }
            } else if (TYPE == 'Include') {
                //// Included
                $scope.DEPARTMENT_NAME = "";
                $scope.POSITION_NAME = "";
                $scope.EMPLOYEES_NAME = "";
                if (_site.INCLUDE_DEPARTMENTS_LIST.length > 0) {
                    angular.forEach(_site.INCLUDE_DEPARTMENTS_LIST, function (_department) {
                        _site.INIT_INCLUDE_DEPARTMENTS_EMP_LIST = _site.INIT_INCLUDE_DEPARTMENTS_EMP_LIST.filter(item => item.DEPARTMENT_ID !== _department.DEPARTMENT_ID);
                    });
                };

                if (_site.INCLUDE_POSITIONS_LIST.length > 0) {
                    angular.forEach(_site.INCLUDE_POSITIONS_LIST, function (_position) {
                        _site.INIT_INCLUDE_POSITIONS_EMP_LIST = _site.INIT_INCLUDE_POSITIONS_EMP_LIST.filter(item => item.POSITION_ID !== _position.POSITION_ID);
                    });
                };
                if (_site.INCLUDE_EMPLOYEES_LIST.length > 0) {
                    angular.forEach(_site.INCLUDE_EMPLOYEES_LIST, function (_employee) {
                        _site.INIT_INCLUDE_EMPLOYTEE_EMP_LIST = _site.INIT_INCLUDE_EMPLOYTEE_EMP_LIST.filter(item => item.EMPLY_PRSNL_ID !== _employee.EMPLY_PRSNL_ID);
                    });
                };

                //// excuded
                //_site.EXCLUDE_EMPLOYEES_LIST = [];


                $('#Include').modal('show');
            }
        }
        else {
            // $scope.$parent.ShowAlertBox("Attention", "Please Enable the access", 3000);
        }
    }

    $scope.POP_FEED_EXCLUDE_Fn = function (_site, _module, index, TYPE, _module_Index) {
        if (_site.ACTIVE && !$scope.EDIT_MODE) {
            $scope.TYPE = TYPE;
            $scope.SELECTED_SITE = _site;
            $scope.SELECTED_SITE_INDEX = index;
            $scope.SELECTED_MODULE = _module;
            $scope.SELECTED_MODULE_INDEX = _module_Index;
            if (TYPE == 'Exclude') {
                $('#FeedExclude').modal('show');
            } else if (TYPE == 'Include') {
                $('#FeedInclude').modal('show');
            }
        }
        else {
            $scope.$parent.ShowAlertBox("Attention", "Please Enable the access", 3000);
        }
    }

    $scope.ADD_DEPARTMENTS_LIST = [];
    $scope.ADD_POSITIONS_LIST = [];
    $scope.ADD_EMPLOYEE_LIST = [];

    $scope.ADD_DEPARTMENTS_Fn = function (_department) {
        $scope.DEPARTMENT_NAME = "";
        $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].HR_BRANCH_LIST[$scope.SELECTED_SITE_INDEX].INCLUDE_DEPARTMENTS_LIST.push(angular.copy(_department));
        $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].HR_BRANCH_LIST[$scope.SELECTED_SITE_INDEX].INIT_INCLUDE_DEPARTMENTS_EMP_LIST = $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].HR_BRANCH_LIST[$scope.SELECTED_SITE_INDEX].INIT_INCLUDE_DEPARTMENTS_EMP_LIST.filter(function (department) {
            return department !== _department;
        });
    }
    $scope.REMOVE_DEPARTMENTS_Fn = function (_department) {
        $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].HR_BRANCH_LIST[$scope.SELECTED_SITE_INDEX].INIT_INCLUDE_DEPARTMENTS_EMP_LIST.push(angular.copy(_department));
        $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].HR_BRANCH_LIST[$scope.SELECTED_SITE_INDEX].INCLUDE_DEPARTMENTS_LIST = $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].HR_BRANCH_LIST[$scope.SELECTED_SITE_INDEX].INCLUDE_DEPARTMENTS_LIST.filter(function (department) {
            return department !== _department;
        });
    }

    $scope.ADD_POSITIONS_Fn = function (_position) {
        $scope.POSITION_NAME = "";
        $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].HR_BRANCH_LIST[$scope.SELECTED_SITE_INDEX].INCLUDE_POSITIONS_LIST.push(angular.copy(_position));
        $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].HR_BRANCH_LIST[$scope.SELECTED_SITE_INDEX].INIT_INCLUDE_POSITIONS_EMP_LIST = $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].HR_BRANCH_LIST[$scope.SELECTED_SITE_INDEX].INIT_INCLUDE_POSITIONS_EMP_LIST.filter(function (position) {
            return position !== _position;
        });
    }
    $scope.REMOVE_POSITIONS_Fn = function (_postition) {
        $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].HR_BRANCH_LIST[$scope.SELECTED_SITE_INDEX].INIT_INCLUDE_POSITIONS_EMP_LIST.push(angular.copy(_postition));
        $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].HR_BRANCH_LIST[$scope.SELECTED_SITE_INDEX].INCLUDE_POSITIONS_LIST = $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].HR_BRANCH_LIST[$scope.SELECTED_SITE_INDEX].INCLUDE_POSITIONS_LIST.filter(function (position) {
            return position !== _postition;
        });
    }
    $scope.ADD_EMPLOYEE_Fn = function (_employee) {
        $scope.EMPLOYEES_NAME = "";
        $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].HR_BRANCH_LIST[$scope.SELECTED_SITE_INDEX].INCLUDE_EMPLOYEES_LIST.push(angular.copy(_employee));
        $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].HR_BRANCH_LIST[$scope.SELECTED_SITE_INDEX].INIT_INCLUDE_EMPLOYTEE_EMP_LIST = $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].HR_BRANCH_LIST[$scope.SELECTED_SITE_INDEX].INIT_INCLUDE_EMPLOYTEE_EMP_LIST.filter(function (employee) {
            return employee !== _employee;
        });
    }
    $scope.REMOVE_EMPLOYEE_Fn = function (_employee) {
        $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].HR_BRANCH_LIST[$scope.SELECTED_SITE_INDEX].INIT_INCLUDE_EMPLOYTEE_EMP_LIST.push(angular.copy(_employee));
        $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].HR_BRANCH_LIST[$scope.SELECTED_SITE_INDEX].INCLUDE_EMPLOYEES_LIST = $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].HR_BRANCH_LIST[$scope.SELECTED_SITE_INDEX].INCLUDE_EMPLOYEES_LIST.filter(function (employee) {
            return employee !== _employee;
        });
    }
    ////////////////////////////////nasdie

    //Feed//////
    $scope.ADD_FEED_DEPARTMENTS_LIST = [];
    $scope.ADD_FEED_POSITIONS_LIST = [];
    $scope.ADD_FEED_EMPLOYEE_LIST = [];

    $scope.ACTIVE_CHECK_BOX_Fn = function (_site) {
        if (_site.ACTIVE && _site.FEED_ACCESS == false) {
            _site.FEED_ACCESS = true;
        };
    };
    $scope.ADD_FEED_INCLUDE_BRANCH_Fn = function (_branch) {
        $scope.BRANCH_NAME = "";
        $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].SUB_MODULE_PAGE_LIST[$scope.SELECTED_SITE_INDEX].INCLUDE_BRANCH_LIST.push(angular.copy(_branch));
        $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].SUB_MODULE_PAGE_LIST[$scope.SELECTED_SITE_INDEX].INIT_INCLUDE_BRANCH_EMP_LIST = $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].SUB_MODULE_PAGE_LIST[$scope.SELECTED_SITE_INDEX].INIT_INCLUDE_BRANCH_EMP_LIST.filter(function (branch) {
            return branch !== _branch;
        });
    }

    $scope.REMOVE_FEED_INCLUDE_BRANCH_Fn = function (_branch) {
        $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].SUB_MODULE_PAGE_LIST[$scope.SELECTED_SITE_INDEX].INIT_INCLUDE_BRANCH_EMP_LIST.push(angular.copy(_branch));
        $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].SUB_MODULE_PAGE_LIST[$scope.SELECTED_SITE_INDEX].INCLUDE_BRANCH_LIST = $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].SUB_MODULE_PAGE_LIST[$scope.SELECTED_SITE_INDEX].INCLUDE_BRANCH_LIST.filter(function (branch) {
            return branch !== _branch;
        });
    }

    $scope.ADD_FEED_DEPARTMENTS_Fn = function (_department) {
        $scope.DEPARTMENT_NAME = "";
        $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].SUB_MODULE_PAGE_LIST[$scope.SELECTED_SITE_INDEX].INCLUDE_DEPARTMENTS_LIST.push(angular.copy(_department));
        $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].SUB_MODULE_PAGE_LIST[$scope.SELECTED_SITE_INDEX].INIT_INCLUDE_DEPARTMENTS_EMP_LIST = $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].SUB_MODULE_PAGE_LIST[$scope.SELECTED_SITE_INDEX].INIT_INCLUDE_DEPARTMENTS_EMP_LIST.filter(function (department) {
            return department !== _department;
        });
    }
    $scope.REMOVE_FEED_DEPARTMENTS_Fn = function (_department) {
        $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].SUB_MODULE_PAGE_LIST[$scope.SELECTED_SITE_INDEX].INIT_INCLUDE_DEPARTMENTS_EMP_LIST.push(angular.copy(_department));
        $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].SUB_MODULE_PAGE_LIST[$scope.SELECTED_SITE_INDEX].INCLUDE_DEPARTMENTS_LIST = $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].SUB_MODULE_PAGE_LIST[$scope.SELECTED_SITE_INDEX].INCLUDE_DEPARTMENTS_LIST.filter(function (department) {
            return department !== _department;
        });
    }

    $scope.ADD_FEED_POSITIONS_Fn = function (_position) {
        $scope.POSITION_NAME = "";
        $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].SUB_MODULE_PAGE_LIST[$scope.SELECTED_SITE_INDEX].INCLUDE_POSITIONS_LIST.push(angular.copy(_position));
        $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].SUB_MODULE_PAGE_LIST[$scope.SELECTED_SITE_INDEX].INIT_INCLUDE_POSITIONS_EMP_LIST = $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].SUB_MODULE_PAGE_LIST[$scope.SELECTED_SITE_INDEX].INIT_INCLUDE_POSITIONS_EMP_LIST.filter(function (position) {
            return position !== _position;
        });
    }
    $scope.REMOVE_FEED_POSITIONS_Fn = function (_postition) {
        $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].SUB_MODULE_PAGE_LIST[$scope.SELECTED_SITE_INDEX].INIT_INCLUDE_POSITIONS_EMP_LIST.push(angular.copy(_postition));
        $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].SUB_MODULE_PAGE_LIST[$scope.SELECTED_SITE_INDEX].INCLUDE_POSITIONS_LIST = $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].SUB_MODULE_PAGE_LIST[$scope.SELECTED_SITE_INDEX].INCLUDE_POSITIONS_LIST.filter(function (position) {
            return position !== _postition;
        });
    }

    $scope.ADD_FEED_EMPLOYEE_Fn = function (_employee) {
        $scope.EMPLOYEES_NAME = "";
        $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].SUB_MODULE_PAGE_LIST[$scope.SELECTED_SITE_INDEX].INCLUDE_EMPLOYEES_LIST.push(angular.copy(_employee));
        $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].SUB_MODULE_PAGE_LIST[$scope.SELECTED_SITE_INDEX].INIT_INCLUDE_EMPLOYTEE_EMP_LIST = $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].SUB_MODULE_PAGE_LIST[$scope.SELECTED_SITE_INDEX].INIT_INCLUDE_EMPLOYTEE_EMP_LIST.filter(function (employee) {
            return employee !== _employee;
        });
    }
    $scope.REMOVE_FEED_EMPLOYEE_Fn = function (_employee) {
        $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].SUB_MODULE_PAGE_LIST[$scope.SELECTED_SITE_INDEX].INIT_INCLUDE_EMPLOYTEE_EMP_LIST.push(angular.copy(_employee));
        $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].SUB_MODULE_PAGE_LIST[$scope.SELECTED_SITE_INDEX].INCLUDE_EMPLOYEES_LIST = $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].SUB_MODULE_PAGE_LIST[$scope.SELECTED_SITE_INDEX].INCLUDE_EMPLOYEES_LIST.filter(function (employee) {
            return employee !== _employee;
        });
    }

    $scope.ADD_FEED_EXCLUDE_BRANCH_Fn = function (_branch) {
        $scope.BRANCH_NAME = "";
        $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].SUB_MODULE_PAGE_LIST[$scope.SELECTED_SITE_INDEX].EXCLUDE_BRANCH_LIST.push(angular.copy(_branch));
        $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].SUB_MODULE_PAGE_LIST[$scope.SELECTED_SITE_INDEX].INIT_EXCLUDE_BRANCH_EMP_LIST = $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].SUB_MODULE_PAGE_LIST[$scope.SELECTED_SITE_INDEX].INIT_EXCLUDE_BRANCH_EMP_LIST.filter(function (branch) {
            return branch !== _branch;
        });
    }
    $scope.REMOVE_FEED_EXCLUDE_BRANCH_Fn = function (_branch) {
        $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].SUB_MODULE_PAGE_LIST[$scope.SELECTED_SITE_INDEX].INIT_EXCLUDE_BRANCH_EMP_LIST.push(angular.copy(_branch));
        $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].SUB_MODULE_PAGE_LIST[$scope.SELECTED_SITE_INDEX].EXCLUDE_BRANCH_LIST = $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].SUB_MODULE_PAGE_LIST[$scope.SELECTED_SITE_INDEX].EXCLUDE_BRANCH_LIST.filter(function (branch) {
            return branch !== _branch;
        });
    }

    $scope.ADD_FEED_EXCLUDE_DEPARTMENTS_Fn = function (_department) {
        $scope.DEPARTMENT_NAME = "";
        $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].SUB_MODULE_PAGE_LIST[$scope.SELECTED_SITE_INDEX].EXCLUDE_DEPARTMENTS_LIST.push(angular.copy(_department));
        $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].SUB_MODULE_PAGE_LIST[$scope.SELECTED_SITE_INDEX].INIT_EXCLUDE_DEPARTMENTS_EMP_LIST = $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].SUB_MODULE_PAGE_LIST[$scope.SELECTED_SITE_INDEX].INIT_EXCLUDE_DEPARTMENTS_EMP_LIST.filter(function (department) {
            return department !== _department;
        });
    }
    $scope.REMOVE_FEED_EXCLUDE_DEPARTMENTS_Fn = function (_department) {
        $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].SUB_MODULE_PAGE_LIST[$scope.SELECTED_SITE_INDEX].INIT_EXCLUDE_DEPARTMENTS_EMP_LIST.push(angular.copy(_department));
        $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].SUB_MODULE_PAGE_LIST[$scope.SELECTED_SITE_INDEX].EXCLUDE_DEPARTMENTS_LIST = $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].SUB_MODULE_PAGE_LIST[$scope.SELECTED_SITE_INDEX].EXCLUDE_DEPARTMENTS_LIST.filter(function (department) {
            return department !== _department;
        });
    }
    $scope.ADD_FEED_EXCLUDE_POSITIONS_Fn = function (_position) {
        $scope.POSITION_NAME = "";
        $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].SUB_MODULE_PAGE_LIST[$scope.SELECTED_SITE_INDEX].EXCLUDE_POSITIONS_LIST.push(angular.copy(_position));
        $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].SUB_MODULE_PAGE_LIST[$scope.SELECTED_SITE_INDEX].INIT_EXCLUDE_POSITIONS_EMP_LIST = $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].SUB_MODULE_PAGE_LIST[$scope.SELECTED_SITE_INDEX].INIT_EXCLUDE_POSITIONS_EMP_LIST.filter(function (position) {
            return position !== _position;
        });
    }
    $scope.REMOVE_FEED_EXCLUDE_POSITIONS_Fn = function (_postition) {
        $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].SUB_MODULE_PAGE_LIST[$scope.SELECTED_SITE_INDEX].INIT_EXCLUDE_POSITIONS_EMP_LIST.push(angular.copy(_postition));
        $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].SUB_MODULE_PAGE_LIST[$scope.SELECTED_SITE_INDEX].EXCLUDE_POSITIONS_LIST = $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].SUB_MODULE_PAGE_LIST[$scope.SELECTED_SITE_INDEX].EXCLUDE_POSITIONS_LIST.filter(function (position) {
            return position !== _postition;
        });
    }
    $scope.ADD_FEED_EXCLUDE_EMPLOYEE_Fn = function (_employee) {
        $scope.EMPLOYEES_NAME = "";
        $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].SUB_MODULE_PAGE_LIST[$scope.SELECTED_SITE_INDEX].EXCLUDE_EMPLOYEES_LIST.push(angular.copy(_employee));
        $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].SUB_MODULE_PAGE_LIST[$scope.SELECTED_SITE_INDEX].INIT_EXCLUDE_EMPLOYTEE_EMP_LIST = $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].SUB_MODULE_PAGE_LIST[$scope.SELECTED_SITE_INDEX].INIT_EXCLUDE_EMPLOYTEE_EMP_LIST.filter(function (employee) {
            return employee !== _employee;
        });
    }
    $scope.REMOVE_FEED_EXCLUDE_EMPLOYEE_Fn = function (_employee) {
        $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].SUB_MODULE_PAGE_LIST[$scope.SELECTED_SITE_INDEX].INIT_EXCLUDE_EMPLOYTEE_EMP_LIST.push(angular.copy(_employee));
        $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].SUB_MODULE_PAGE_LIST[$scope.SELECTED_SITE_INDEX].EXCLUDE_EMPLOYEES_LIST = $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].SUB_MODULE_PAGE_LIST[$scope.SELECTED_SITE_INDEX].EXCLUDE_EMPLOYEES_LIST.filter(function (employee) {
            return employee !== _employee;
        });
    }
    // End Feed//////
    $scope.ADD_EXCLUDE_DEPARTMENTS_Fn = function (_department) {
        $scope.DEPARTMENT_NAME = "";
        $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].HR_BRANCH_LIST[$scope.SELECTED_SITE_INDEX].EXCLUDE_DEPARTMENTS_LIST.push(angular.copy(_department));
        $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].HR_BRANCH_LIST[$scope.SELECTED_SITE_INDEX].INIT_EXCLUDE_DEPARTMENTS_EMP_LIST = $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].HR_BRANCH_LIST[$scope.SELECTED_SITE_INDEX].INIT_EXCLUDE_DEPARTMENTS_EMP_LIST.filter(function (department) {
            return department !== _department;
        });
    }
    $scope.REMOVE_EXCLUDE_DEPARTMENTS_Fn = function (_department) {
        $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].HR_BRANCH_LIST[$scope.SELECTED_SITE_INDEX].INIT_EXCLUDE_DEPARTMENTS_EMP_LIST.push(angular.copy(_department));
        $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].HR_BRANCH_LIST[$scope.SELECTED_SITE_INDEX].EXCLUDE_DEPARTMENTS_LIST = $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].HR_BRANCH_LIST[$scope.SELECTED_SITE_INDEX].EXCLUDE_DEPARTMENTS_LIST.filter(function (department) {
            return department !== _department;
        });
    }
    $scope.ADD_EXCLUDE_POSITIONS_Fn = function (_position) {
        $scope.POSITION_NAME = "";
        $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].HR_BRANCH_LIST[$scope.SELECTED_SITE_INDEX].EXCLUDE_POSITIONS_LIST.push(angular.copy(_position));
        $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].HR_BRANCH_LIST[$scope.SELECTED_SITE_INDEX].INIT_EXCLUDE_POSITIONS_EMP_LIST = $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].HR_BRANCH_LIST[$scope.SELECTED_SITE_INDEX].INIT_EXCLUDE_POSITIONS_EMP_LIST.filter(function (position) {
            return position !== _position;
        });
    }
    $scope.REMOVE_EXCLUDE_POSITIONS_Fn = function (_postition) {
        $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].HR_BRANCH_LIST[$scope.SELECTED_SITE_INDEX].INIT_EXCLUDE_POSITIONS_EMP_LIST.push(angular.copy(_postition));
        $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].HR_BRANCH_LIST[$scope.SELECTED_SITE_INDEX].EXCLUDE_POSITIONS_LIST = $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].HR_BRANCH_LIST[$scope.SELECTED_SITE_INDEX].EXCLUDE_POSITIONS_LIST.filter(function (position) {
            return position !== _postition;
        });
    }
    $scope.ADD_EXCLUDE_EMPLOYEE_Fn = function (_employee) {
        $scope.EMPLOYEES_NAME = "";
        $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].HR_BRANCH_LIST[$scope.SELECTED_SITE_INDEX].EXCLUDE_EMPLOYEES_LIST.push(angular.copy(_employee));
        $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].HR_BRANCH_LIST[$scope.SELECTED_SITE_INDEX].INIT_EXCLUDE_EMPLOYTEE_EMP_LIST = $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].HR_BRANCH_LIST[$scope.SELECTED_SITE_INDEX].INIT_EXCLUDE_EMPLOYTEE_EMP_LIST.filter(function (employee) {
            return employee !== _employee;
        });
    }
    $scope.REMOVE_EXCLUDE_EMPLOYEE_Fn = function (_employee) {
        $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].HR_BRANCH_LIST[$scope.SELECTED_SITE_INDEX].INIT_EXCLUDE_EMPLOYTEE_EMP_LIST.push(angular.copy(_employee));
        $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].HR_BRANCH_LIST[$scope.SELECTED_SITE_INDEX].EXCLUDE_EMPLOYEES_LIST = $scope.SUB_MODULE_BY_STANDARD_ROLE_ID[$scope.SELECTED_MODULE_INDEX].HR_BRANCH_LIST[$scope.SELECTED_SITE_INDEX].EXCLUDE_EMPLOYEES_LIST.filter(function (employee) {
            return employee !== _employee;
        });
    }


    $scope.SELECTED_ROLE_Fn = function (_role) {
        if (_role == '') {
            $scope.UserAccessSearch.CUSTOM_ROLE_NAME = $scope.UserAccessSearch.DD_DEFAULT_TEXT;
            $scope.UserAccessSearch.STANDARD_ROLE_ID = '';
        }
        else {
            $scope.UserAccessSearch.CUSTOM_ROLE_NAME = _role.ROLE_NAME;
            $scope.UserAccessSearch.STANDARD_ROLE_ID = _role.STANDARD_ROLE_ID;
            $scope.IS_ROLE_CHANGED = true;
            $scope.GET_SUB_MODULE_BY_STANDARD_ROLE_ID();
        }
    }
    $scope.SELECTED_ROLE_Fn('');
    $scope.SET_DROPSCROLL = function () {
        $('.AddCustomScroll_Contact').find('.dropdown-menu').addClass('scrollbar-wrapper w-100');
        $('.AddCustomScroll_Contact').find('.dropdown-menu li').addClass('p-2');
    }
    $scope.nginitemployee = function (_employee) {
        _employee.SHORT_NAME = $scope.TextReturn(_employee.EMPLOYEE_NAME);
    }
    $scope.HRM_GET_REPORTING_EMPLOYEE_LIST_FOR_MANAGER_TERMINATION = function () {
        $scope.HRM_GET_REPORTING_EMPLOYEE_LIST_FOR_MANAGER_LIST = [];
        var UserModelObj = new Object();
        UserModelObj.MANAGER_EMPLY_PRSNL_ID = $scope.UserAccessSearch.EMPLY_PRSNL_ID;
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'HRM_GET_REPORTING_EMPLOYEE_LIST_FOR_MANAGER_TERMINATION').then(function (data) {
            if (data.data == null) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
            if (data.data.Table.length > 0) {
                $scope.HRM_GET_REPORTING_EMPLOYEE_LIST_FOR_MANAGER_LIST = data.data.Table;
                $('#Employee_Details').modal('show');
            } else {
                if ($scope.HRM_GET_REPORTING_EMPLOYEE_LIST_FOR_MANAGER_LIST.length == 0) {
                    $scope.UserRoleForm.submitted = true;
                    if ($scope.UserRoleForm.$valid) {
                        $('#EffectiveDate').modal('show');
                    }
                    else {
                        $scope.$parent.ShowAlertBox("Attention", $scope.$parent.MANDATORY_MSG, 3000);
                    }
                }
            }

        });
    }
    $scope.HRM_INS_UPD_EMPLOYEE_ACCESS = function (FLAG, EFFECTIVE_FLAG) {
        // remove false condition with effictive date func start.
        if ($scope.EDIT_STEP_NO == 9 && EFFECTIVE_FLAG == undefined && false) {
            $scope.UserRoleForm.submitted = true;
            if ($scope.UserAccessSearch.STANDARD_ROLE_ID == 15 || $scope.UserAccessSearch.STANDARD_ROLE_ID == 10 || $scope.UserAccessSearch.STANDARD_ROLE_ID == 5) {
                $scope.HRM_GET_REPORTING_EMPLOYEE_LIST_FOR_MANAGER_TERMINATION();
            } else {
                if ($scope.UserRoleForm.$valid) {
                    if (($scope.UserAccessSearch.STANDARD_ROLE_ID == 15 || $scope.UserAccessSearch.STANDARD_ROLE_ID == 10 || $scope.UserAccessSearch.STANDARD_ROLE_ID == 5) && ($scope.HeaderPrimaryDetails.PRIMARY_REPORTING_MANAGER_ID == undefined || $scope.HeaderPrimaryDetails.PRIMARY_REPORTING_MANAGER_ID == '' || $scope.HeaderPrimaryDetails.PRIMARY_REPORTING_MANAGER_ID == null)) {
                        $scope.$parent.ShowAlertBox("Error", "A reporting manager is mandatory for an employee access.", 3000);
                    }
                    else {
                        $('#EffectiveDate').modal('show');
                    }
                }
                else {
                    $scope.$parent.ShowAlertBox("Attention", $scope.$parent.MANDATORY_MSG, 3000);
                }
            }
        }
        else {
            $scope.UserRoleForm.submitted = true;
            var validationcount = 0;
            if (($scope.UserAccessSearch.STANDARD_ROLE_ID == 15 || $scope.UserAccessSearch.STANDARD_ROLE_ID == 10 || $scope.UserAccessSearch.STANDARD_ROLE_ID == 5) && ($scope.HeaderPrimaryDetails.PRIMARY_REPORTING_MANAGER_ID == undefined || $scope.HeaderPrimaryDetails.PRIMARY_REPORTING_MANAGER_ID == '' || $scope.HeaderPrimaryDetails.PRIMARY_REPORTING_MANAGER_ID == null)) {
                validationcount = 1;

            }

            if ($scope.UserRoleForm.$valid && validationcount == 0) {
                var UserAccesModelObj = new Object();
                UserAccesModelObj.EMPLOYEE_ACCESS_ID = $scope.UserAccessSearch.EMPLOYEE_ACCESS_ID;
                UserAccesModelObj.EMPLY_PRSNL_ID = $scope.UserAccessSearch.EMPLY_PRSNL_ID;
                UserAccesModelObj.USER_ID = $scope.UserAccessSearch.USER_ID;
                UserAccesModelObj.STANDARD_ROLE_ID = $scope.UserAccessSearch.STANDARD_ROLE_ID;
                UserAccesModelObj.EFFECTIVE_DATE = $scope.UserAccessSearch.EFFECTIVE_DATE == "" || $scope.UserAccessSearch.EFFECTIVE_DATE == undefined ? null : $scope.UserAccessSearch.EFFECTIVE_DATE;
                UserAccesModelObj.COMMENTS = $scope.UserAccessSearch.EFFECTIVE_COMMENTS;

                UserAccesModelObj.HRM_EMPLOYEE_ACCESS_SUB_MODULES_TYPE = [];
                UserAccesModelObj.REPORT_MAPPING_TYPE = [];
                if ($scope.IS_ROLE_CHANGED) {
                    var newArray = $scope.SUB_MODULE_BY_STANDARD_ROLE_ID_COPY.filter(function (existingItem) {
                        var findObject = $scope.SUB_MODULE_BY_STANDARD_ROLE_ID.find(x => x.SUB_MODULE_ID == existingItem.SUB_MODULE_ID);
                        if (findObject != undefined) {

                        } else {
                            return existingItem;
                        }
                    });
                    $scope.SUB_MODULE_BY_STANDARD_ROLE_ID_COPY = newArray;
                    angular.forEach($scope.SUB_MODULE_BY_STANDARD_ROLE_ID_COPY, function (_loop_module_value) {
                        if (_loop_module_value.SUB_MODULE_ID == 6 || _loop_module_value.SUB_MODULE_ID == 10 || _loop_module_value.SUB_MODULE_ID == 14) {
                            angular.forEach(_loop_module_value.HR_BRANCH_LIST, function (_loop_branch_value) {
                                var _modules = new Object();
                                _modules.EMPLOYEE_ACCESS_SUB_MODULES_ID = _loop_branch_value.EMPLOYEE_ACCESS_SUB_MODULES_ID == undefined ? 0 : _loop_branch_value.EMPLOYEE_ACCESS_SUB_MODULES_ID;
                                _modules.SUB_MODULE_ID = _loop_module_value.SUB_MODULE_ID;
                                _modules.BRANCH_ID = _loop_branch_value.BRANCH_ID;
                                _modules.ACTIVE = 0;
                                _modules.SHOW_WAGE = 0;
                                _modules.TIME_SHEETS = 0;
                                _modules.POSITION_IDS_INCLUDE = null; _modules.DEPARTMENT_IDS_INCLUDE = null; _modules.EMPLY_PRSNL_IDS_INCLUDE = null;
                                _modules.POSITION_IDS_EXCLUDE = null; _modules.DEPARTMENT_IDS_EXCLUDE = null; _modules.EMPLY_PRSNL_IDS_EXCLUDE = null;
                                _modules.BRANCH_IDS_INCLUDE = null;
                                _modules.BRANCH_IDS_EXCLUDE = null;
                                _modules.SUB_MODULE_PAGE_ID = null;
                                _modules.FEED_ACCESS = 0;
                                _modules.ALL_POSITIONS_INCLUDE = 0;
                                _modules.ALL_DEPARTMENTS_INCLUDE = 0;
                                UserAccesModelObj.HRM_EMPLOYEE_ACCESS_SUB_MODULES_TYPE.push(_modules);
                            });
                        }
                        if (_loop_module_value.SUB_MODULE_ID == 8) {
                            angular.forEach(_loop_module_value.REPORTS_BY_MODULE_ID_LIST, function (_loop_report_value) {
                                var _Reportmodules = new Object();
                                _Reportmodules.USER_ID = null//$scope.UserAccessSearch.USER_ID;
                                _Reportmodules.EMPLY_PRSNL_ID = $scope.UserAccessSearch.EMPLY_PRSNL_ID;
                                _Reportmodules.REPORT_ID = _loop_report_value.REPORT_ID;
                                _Reportmodules.ACTIVE = 0;
                                UserAccesModelObj.REPORT_MAPPING_TYPE.push(_Reportmodules);
                            });
                        }
                    });
                }

                angular.forEach($scope.SUB_MODULE_BY_STANDARD_ROLE_ID, function (_loop_module_value) {
                    //6 "Scheduling"
                    //10 User Managment
                    //8 "Reports"
                    if (_loop_module_value.SUB_MODULE_ID == 14) {
                        angular.forEach(_loop_module_value.SUB_MODULE_PAGE_LIST, function (_loop_submodule_value) {
                            var _modules = new Object();
                            _modules.EMPLOYEE_ACCESS_SUB_MODULES_ID = _loop_submodule_value.EMPLOYEE_ACCESS_SUB_MODULES_ID == undefined ? 0 : _loop_submodule_value.EMPLOYEE_ACCESS_SUB_MODULES_ID;
                            _modules.SUB_MODULE_ID = _loop_module_value.SUB_MODULE_ID;
                            _modules.BRANCH_ID = null;

                            if (_loop_module_value.MODULE_ACTIVE == false) {
                                _modules.ACTIVE = 0;
                                _modules.SHOW_WAGE = 0;
                                _modules.TIME_SHEETS = 0;
                            } else {
                                _modules.ACTIVE = _loop_submodule_value.ACTIVE ? 1 : 0;
                                _modules.SHOW_WAGE = 0;
                                _modules.TIME_SHEETS = 0;
                            }
                            _modules.POSITION_IDS_INCLUDE = null; _modules.DEPARTMENT_IDS_INCLUDE = null; _modules.EMPLY_PRSNL_IDS_INCLUDE = null;
                            _modules.POSITION_IDS_EXCLUDE = null; _modules.DEPARTMENT_IDS_EXCLUDE = null; _modules.EMPLY_PRSNL_IDS_EXCLUDE = null;
                            _modules.BRANCH_IDS_INCLUDE = null;
                            _modules.BRANCH_IDS_EXCLUDE = null;

                            if (_loop_module_value.MODULE_ACTIVE == false) {

                            } else {
                                angular.forEach(_loop_submodule_value.INCLUDE_BRANCH_LIST, function (_loop_includebrn_value) {
                                    if (_modules.BRANCH_IDS_INCLUDE == null) {
                                        _modules.BRANCH_IDS_INCLUDE = _loop_includebrn_value.BRANCH_ID + '';
                                    }
                                    else {
                                        _modules.BRANCH_IDS_INCLUDE = _modules.BRANCH_IDS_INCLUDE + ',' + _loop_includebrn_value.BRANCH_ID;
                                    }
                                });
                                angular.forEach(_loop_submodule_value.INCLUDE_DEPARTMENTS_LIST, function (_loop_includeDept_value) {
                                    if (_modules.DEPARTMENT_IDS_INCLUDE == null) {
                                        _modules.DEPARTMENT_IDS_INCLUDE = _loop_includeDept_value.DEPARTMENT_ID + '';
                                    }
                                    else {
                                        _modules.DEPARTMENT_IDS_INCLUDE = _modules.DEPARTMENT_IDS_INCLUDE + ',' + _loop_includeDept_value.DEPARTMENT_ID;
                                    }
                                });
                                angular.forEach(_loop_submodule_value.INCLUDE_POSITIONS_LIST, function (_loop_includePosition_value) {
                                    if (_modules.POSITION_IDS_INCLUDE == null) {
                                        _modules.POSITION_IDS_INCLUDE = _loop_includePosition_value.POSITION_ID + '';
                                    }
                                    else {
                                        _modules.POSITION_IDS_INCLUDE = _modules.POSITION_IDS_INCLUDE + ',' + _loop_includePosition_value.POSITION_ID;
                                    }
                                });
                                angular.forEach(_loop_submodule_value.INCLUDE_EMPLOYEES_LIST, function (_loop_includeEmp_value) {
                                    if (_modules.EMPLY_PRSNL_IDS_INCLUDE == null) {
                                        _modules.EMPLY_PRSNL_IDS_INCLUDE = _loop_includeEmp_value.EMPLY_PRSNL_ID + '';
                                    }
                                    else {
                                        _modules.EMPLY_PRSNL_IDS_INCLUDE = _modules.EMPLY_PRSNL_IDS_INCLUDE + ',' + _loop_includeEmp_value.EMPLY_PRSNL_ID;
                                    }
                                });
                                angular.forEach(_loop_submodule_value.EXCLUDE_BRANCH_LIST, function (_loop_Excludebrn_value) {
                                    if (_modules.BRANCH_IDS_EXCLUDE == null) {
                                        _modules.BRANCH_IDS_EXCLUDE = _loop_Excludebrn_value.BRANCH_ID + '';
                                    }
                                    else {
                                        _modules.BRANCH_IDS_EXCLUDE = _modules.BRANCH_IDS_EXCLUDE + ',' + _loop_Excludebrn_value.BRANCH_ID;
                                    }
                                });
                                angular.forEach(_loop_submodule_value.EXCLUDE_DEPARTMENTS_LIST, function (_loop_ExcludeDept_value) {
                                    if (_modules.DEPARTMENT_IDS_EXCLUDE == null) {
                                        _modules.DEPARTMENT_IDS_EXCLUDE = _loop_ExcludeDept_value.DEPARTMENT_ID + '';
                                    }
                                    else {
                                        _modules.DEPARTMENT_IDS_EXCLUDE = _modules.DEPARTMENT_IDS_EXCLUDE + ',' + _loop_ExcludeDept_value.DEPARTMENT_ID;
                                    }
                                });
                                angular.forEach(_loop_submodule_value.EXCLUDE_POSITIONS_LIST, function (_loop_ExcludePosition_value) {
                                    if (_modules.POSITION_IDS_EXCLUDE == null) {
                                        _modules.POSITION_IDS_EXCLUDE = _loop_ExcludePosition_value.POSITION_ID + '';
                                    }
                                    else {
                                        _modules.POSITION_IDS_EXCLUDE = _modules.POSITION_IDS_EXCLUDE + ',' + _loop_ExcludePosition_value.POSITION_ID;
                                    }
                                });
                                angular.forEach(_loop_submodule_value.EXCLUDE_EMPLOYEES_LIST, function (_loop_ExcludeEmp_value) {
                                    if (_modules.EMPLY_PRSNL_IDS_EXCLUDE == null) {
                                        _modules.EMPLY_PRSNL_IDS_EXCLUDE = _loop_ExcludeEmp_value.EMPLY_PRSNL_ID + '';
                                    }
                                    else {
                                        _modules.EMPLY_PRSNL_IDS_EXCLUDE = _modules.EMPLY_PRSNL_IDS_EXCLUDE + ',' + _loop_ExcludeEmp_value.EMPLY_PRSNL_ID;
                                    }
                                });
                            }
                            _modules.SUB_MODULE_PAGE_ID = _loop_submodule_value.SUB_MODULE_PAGE_ID;
                            _modules.FEED_ACCESS = null;
                            _modules.ALL_POSITIONS_INCLUDE = 0;
                            _modules.ALL_DEPARTMENTS_INCLUDE = 0;
                            UserAccesModelObj.HRM_EMPLOYEE_ACCESS_SUB_MODULES_TYPE.push(_modules);
                        });
                    }
                    if (_loop_module_value.SUB_MODULE_ID == 6 || _loop_module_value.SUB_MODULE_ID == 10) {
                        angular.forEach(_loop_module_value.HR_BRANCH_LIST, function (_loop_branch_value) {
                            var _modules = new Object();
                            _modules.EMPLOYEE_ACCESS_SUB_MODULES_ID = _loop_branch_value.EMPLOYEE_ACCESS_SUB_MODULES_ID == undefined ? 0 : _loop_branch_value.EMPLOYEE_ACCESS_SUB_MODULES_ID;
                            _modules.SUB_MODULE_ID = _loop_module_value.SUB_MODULE_ID;
                            _modules.BRANCH_ID = _loop_branch_value.BRANCH_ID;
                            if (_loop_module_value.MODULE_ACTIVE == false || _loop_branch_value.ACTIVE == false) {
                                _modules.ACTIVE = 0;
                                _modules.SHOW_WAGE = 0;
                                _modules.TIME_SHEETS = 0;

                            } else {
                                _modules.ACTIVE = _loop_branch_value.ACTIVE ? 1 : 0;
                                _modules.SHOW_WAGE = _loop_branch_value.SHOW_WAGE ? 1 : 0;
                                _modules.TIME_SHEETS = _loop_branch_value.TIME_SHEETS ? 1 : 0;
                            }
                            _modules.POSITION_IDS_INCLUDE = null; _modules.DEPARTMENT_IDS_INCLUDE = null; _modules.EMPLY_PRSNL_IDS_INCLUDE = null;
                            _modules.POSITION_IDS_EXCLUDE = null; _modules.DEPARTMENT_IDS_EXCLUDE = null; _modules.EMPLY_PRSNL_IDS_EXCLUDE = null;
                            _modules.BRANCH_IDS_INCLUDE = null;
                            _modules.BRANCH_IDS_EXCLUDE = null;
                            _modules.SUB_MODULE_PAGE_ID = null;
                            _modules.FEED_ACCESS = 0;
                            _modules.ALL_POSITIONS_INCLUDE = 0;
                            _modules.ALL_DEPARTMENTS_INCLUDE = 0;
                            if (_loop_module_value.MODULE_ACTIVE == false || _loop_branch_value.ACTIVE == false) {

                            } else {
                                angular.forEach(_loop_branch_value.INCLUDE_DEPARTMENTS_LIST, function (_loop_includeDept_value) {
                                    if (_modules.DEPARTMENT_IDS_INCLUDE == null) {
                                        _modules.DEPARTMENT_IDS_INCLUDE = _loop_includeDept_value.DEPARTMENT_ID + '';
                                    }
                                    else {
                                        _modules.DEPARTMENT_IDS_INCLUDE = _modules.DEPARTMENT_IDS_INCLUDE + ',' + _loop_includeDept_value.DEPARTMENT_ID;
                                    }
                                });
                                angular.forEach(_loop_branch_value.INCLUDE_POSITIONS_LIST, function (_loop_includePosition_value) {
                                    if (_modules.POSITION_IDS_INCLUDE == null) {
                                        _modules.POSITION_IDS_INCLUDE = _loop_includePosition_value.POSITION_ID + '';
                                    }
                                    else {
                                        _modules.POSITION_IDS_INCLUDE = _modules.POSITION_IDS_INCLUDE + ',' + _loop_includePosition_value.POSITION_ID;
                                    }
                                });
                                angular.forEach(_loop_branch_value.INCLUDE_EMPLOYEES_LIST, function (_loop_includeEmp_value) {
                                    if (_modules.EMPLY_PRSNL_IDS_INCLUDE == null) {
                                        _modules.EMPLY_PRSNL_IDS_INCLUDE = _loop_includeEmp_value.EMPLY_PRSNL_ID + '';
                                    }
                                    else {
                                        _modules.EMPLY_PRSNL_IDS_INCLUDE = _modules.EMPLY_PRSNL_IDS_INCLUDE + ',' + _loop_includeEmp_value.EMPLY_PRSNL_ID;
                                    }
                                });
                                angular.forEach(_loop_branch_value.EXCLUDE_DEPARTMENTS_LIST, function (_loop_ExcludeDept_value) {
                                    if (_modules.DEPARTMENT_IDS_EXCLUDE == null) {
                                        _modules.DEPARTMENT_IDS_EXCLUDE = _loop_ExcludeDept_value.DEPARTMENT_ID + '';
                                    }
                                    else {
                                        _modules.DEPARTMENT_IDS_EXCLUDE = _modules.DEPARTMENT_IDS_EXCLUDE + ',' + _loop_ExcludeDept_value.DEPARTMENT_ID;
                                    }
                                });
                                angular.forEach(_loop_branch_value.EXCLUDE_POSITIONS_LIST, function (_loop_ExcludePosition_value) {
                                    if (_modules.POSITION_IDS_EXCLUDE == null) {
                                        _modules.POSITION_IDS_EXCLUDE = _loop_ExcludePosition_value.POSITION_ID + '';
                                    }
                                    else {
                                        _modules.POSITION_IDS_EXCLUDE = _modules.POSITION_IDS_EXCLUDE + ',' + _loop_ExcludePosition_value.POSITION_ID;
                                    }
                                });
                                angular.forEach(_loop_branch_value.EXCLUDE_EMPLOYEES_LIST, function (_loop_ExcludeEmp_value) {
                                    if (_modules.EMPLY_PRSNL_IDS_EXCLUDE == null) {
                                        _modules.EMPLY_PRSNL_IDS_EXCLUDE = _loop_ExcludeEmp_value.EMPLY_PRSNL_ID + '';
                                    }
                                    else {
                                        _modules.EMPLY_PRSNL_IDS_EXCLUDE = _modules.EMPLY_PRSNL_IDS_EXCLUDE + ',' + _loop_ExcludeEmp_value.EMPLY_PRSNL_ID;
                                    }
                                });
                                _modules.FEED_ACCESS = _loop_branch_value.FEED_ACCESS ? 1 : 0;
                                _modules.ALL_POSITIONS_INCLUDE = _loop_branch_value.ALL_POSITIONS_INCLUDE ? 1 : 0;;
                                _modules.ALL_DEPARTMENTS_INCLUDE = _loop_branch_value.ALL_DEPARTMENTS_INCLUDE ? 1 : 0;;

                            }
                            UserAccesModelObj.HRM_EMPLOYEE_ACCESS_SUB_MODULES_TYPE.push(_modules);
                        });
                    }
                    if (_loop_module_value.SUB_MODULE_ID == 8) {
                        angular.forEach(_loop_module_value.REPORTS_BY_MODULE_ID_LIST, function (_loop_report_value) {
                            var _Reportmodules = new Object();
                            _Reportmodules.USER_ID = null//$scope.UserAccessSearch.USER_ID;  // beacuse of current employee userid is not generat, current employee creating in is process 
                            _Reportmodules.EMPLY_PRSNL_ID = $scope.UserAccessSearch.EMPLY_PRSNL_ID;
                            _Reportmodules.REPORT_ID = _loop_report_value.REPORT_ID;
                            if (_loop_module_value.MODULE_ACTIVE == false || _loop_module_value.ACTIVE == false) {
                                _Reportmodules.ACTIVE = 0;
                            } else {
                                _Reportmodules.ACTIVE = _loop_report_value.ACTIVE ? 1 : 0;
                            }
                            UserAccesModelObj.REPORT_MAPPING_TYPE.push(_Reportmodules);
                        });
                    }
                });
                if (UserAccesModelObj.HRM_EMPLOYEE_ACCESS_SUB_MODULES_TYPE.length == 0) {
                    var _modules = new Object();
                    _modules.EMPLOYEE_ACCESS_SUB_MODULES_ID = null;
                    _modules.SUB_MODULE_ID = null;
                    _modules.BRANCH_ID = null;
                    _modules.ACTIVE = null;
                    _modules.SHOW_WAGE = null;
                    _modules.TIME_SHEETS = null;

                    _modules.POSITION_IDS_INCLUDE = null; _modules.DEPARTMENT_IDS_INCLUDE = null; _modules.EMPLY_PRSNL_IDS_INCLUDE = null;
                    _modules.POSITION_IDS_EXCLUDE = null; _modules.DEPARTMENT_IDS_EXCLUDE = null; _modules.EMPLY_PRSNL_IDS_EXCLUDE = null;
                    _modules.BRANCH_IDS_INCLUDE = null;
                    _modules.BRANCH_IDS_EXCLUDE = null;
                    _modules.SUB_MODULE_PAGE_ID = null;
                    _modules.FEED_ACCESS = null;
                    _modules.ALL_POSITIONS_INCLUDE = null;
                    _modules.ALL_DEPARTMENTS_INCLUDE = null;
                    UserAccesModelObj.HRM_EMPLOYEE_ACCESS_SUB_MODULES_TYPE.push(_modules);
                }
                if (UserAccesModelObj.REPORT_MAPPING_TYPE.length == 0) {
                    var _Reportmodules = new Object();
                    _Reportmodules.USER_ID = null;
                    _Reportmodules.EMPLY_PRSNL_ID = null;
                    _Reportmodules.REPORT_ID = null;
                    _Reportmodules.ACTIVE = null;
                    UserAccesModelObj.REPORT_MAPPING_TYPE.push(_Reportmodules);
                }
                PrcCommMethods.HUMANRESOURCE_API(UserAccesModelObj, 'HRM_INS_UPD_EMPLOYEE_ACCESS').then(function (data) {
                    if (data.data > 0) {
                        $scope.$parent.ShowAlertBox("Success", 'Access Updated Successfully', 3000);
                        if (FLAG == 1) {
                            $scope.TAB_CLICK_HR_HEADER_Fn(0);
                        }
                        else {
                            $scope.TAB_CLICK_HR_HEADER_Fn(6, getUrlParameter('EMP_ID', $location.absUrl()));
                        }
                    }
                    else if (data.data == null || data.data == 0) {
                        $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                    }
                });
            }
            else {
                if (validationcount == 1) {
                    $scope.$parent.ShowAlertBox("Error", "A reporting manager is mandatory for an employee access.", 3000);
                }
                else {
                    $scope.$parent.ShowAlertBox("Attention", $scope.$parent.MANDATORY_MSG, 3000);
                }
            }
        }
    }



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
            $scope.UserAccessSearch.PAGE_NO = 1;
            $scope.EMPLOYEE_HISTORY_HEADERS_LIST = [];
        }

        var EfftInfoObject = new Object();
        EfftInfoObject.EMPLY_PRSNL_ID = getUrlParameter('EMP_ID', $location.absUrl());
        EfftInfoObject.PAGE_NO = $scope.UserAccessSearch.PAGE_NO;
        EfftInfoObject.PAGE_SIZE = $scope.UserAccessSearch.PAGE_SIZE;
        EfftInfoObject.STEP_NO = $scope.UserAccessSearch.STEP_NO;
        PrcCommMethods.HUMANRESOURCE_API(EfftInfoObject, 'HRM_GET_EMPLOYEE_HISTORY_HEADERS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.EMPLOYEE_HISTORY_HEADERS_LIST = $scope.EMPLOYEE_HISTORY_HEADERS_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.UserAccessSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.UserAccessSearch.PAGE_NO = parseInt($scope.UserAccessSearch.PAGE_NO) + 1;
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
        EfftInfoObject.STEP_NO = $scope.UserAccessSearch.STEP_NO;;
        PrcCommMethods.HUMANRESOURCE_API(EfftInfoObject, 'HRM_EMPLOYEE_GET_UPCOMING_UPDATES').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.EMPLOYEE_GET_UPCOMING_UPDATES_LIST = data.data.Table;
            }
            else {
                $scope.EMPLOYEE_GET_UPCOMING_UPDATES_LIST = [];
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
        var EfftInfoObject = new Object();
        EfftInfoObject.UPDATE_TABLE_ID = _tabledtls.UPDATE_TABLE_ID;
        EfftInfoObject.STEP_NO = $scope.UserAccessSearch.STEP_NO;;
        PrcCommMethods.HUMANRESOURCE_API(EfftInfoObject, 'HRM_EMPLOYEE_GET_UPCOMING_UPDATE_DETAILS').then(function (data) {
            if (data.data.Table.length > 0) {
                _tabledtls.UPCOMING_DETAILS = data.data.Table;
                $scope.OLD_DATA = angular.copy($scope.UserAccessSearch);// In upcoming case ;
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
        var EfftInfoObject = new Object();
        EfftInfoObject.UPDATE_TABLE_ID = $scope.SELECTED_UPDATE.UPDATE_TABLE_ID;
        EfftInfoObject.STEP_NO = $scope.UserAccessSearch.STEP_NO;
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
        EfftInfoObject.STEP_NO = $scope.UserAccessSearch.STEP_NO;;
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
    $scope.HRM_EMPLOYEE_GET_UPCOMING_UPDATES();
    $scope.HRM_GET_EMPLOYEE_HISTORY_HEADERS(1);
});