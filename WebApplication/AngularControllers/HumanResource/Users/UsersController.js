app.controller('UsersController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    //$scope.$parent.DISPLAY_FLAG = true;
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(1);
    $scope.HR_COMMON_CODE_Fn();
    $scope.$parent.$parent.overlay_loading_HR_Loader = 'none';
    $scope.UserSearch = {
        CUSTOMER_ID: $cookies.get("CUSTOMER_ID"),
        USER_ID: $cookies.get("USERID"),
        ENTITY_ID: null,
    }
    $scope.PlaceHolder = "Type here...";
    $scope.EMPLOYEE_TYPES_LIST = [];
    $scope.TERMINATION_REASONS_LIST = [];
    $scope.QUALIFICATION_TYPE_LIST = [];
    $scope.DOCUMENT_REQUEST_LIST = [];


    $scope.BLANK_EMPLOYEE_TYPES = { EMPLOYEE_TYPES_ID: 0, EMPLOYEE_TYPE_NAMES: '', EDITABLE: 1 };
    $scope.BLANK_TERMINATION_TYPES = { TERMINATION_REASONS_ID: 0, TERMINATION_REASONS_NAME: '', EDITABLE: 1 };
    $scope.BLANK_QUALIFICATION_TYPE = { QUALIFICATION_TYPE_ID: 0, QUALIFICATION_NAMES: '', EDITABLE: 1 };
    $scope.BLANK_DOCUMENT_REQUEST = { DOCUMENT_REQUEST_MSTR_ID: 0, DOCUMENT_REQUEST_NAMES: '' };
    $scope.HRM_GET_EMPLOYEE_TYPES = function () {
        var UserModelObj = new Object();
        UserModelObj.CUSTOMER_ID = $cookies.get("CUSTOMER_ID");
        UserModelObj.ENTITY_ID = null;
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'HRM_GET_EMPLOYEE_TYPES').then(function (data) {
            if (data.data.Table.length > 0) {
                if ($scope.EMPLOYEE_TYPES_LIST.length > data.data.Table.length) {
                    let lastData = $scope.EMPLOYEE_TYPES_LIST[$scope.EMPLOYEE_TYPES_LIST.length - 1];
                    $scope.EMPLOYEE_TYPES_LIST = data.data.Table;
                  //  $scope.EMPLOYEE_TYPES_LIST.push(angular.copy(lastData));
                } else {
                    $scope.EMPLOYEE_TYPES_LIST = data.data.Table;
                  //  $scope.EMPLOYEE_TYPES_LIST.push(angular.copy($scope.BLANK_EMPLOYEE_TYPES));
                }
            }
            else if (data.data == 0) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            } else {
                //$scope.EMPLOYEE_TYPES_LIST.push(angular.copy($scope.BLANK_EMPLOYEE_TYPES));
                $scope.EMPLOYEE_TYPES_LIST = data.data.Table.length > 0 ? data.data.Table : [];
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
                console.log($scope.EMPLOYEE_STATUSES_LIST);
            }
            else if (data.data == 0) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
        });
    }

    $scope.HRM_GET_TERMINATION_REASONS = function () {
        var UserModelObj = new Object();
        UserModelObj.CUSTOMER_ID = $cookies.get("CUSTOMER_ID");
        UserModelObj.ENTITY_ID = null;
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'HRM_GET_TERMINATION_REASONS').then(function (data) {
            if (data.data.Table.length > 0) {
                if ($scope.TERMINATION_REASONS_LIST.length > data.data.Table.length) {
                    let lastData = $scope.TERMINATION_REASONS_LIST[$scope.TERMINATION_REASONS_LIST.length - 1];
                    $scope.TERMINATION_REASONS_LIST = data.data.Table;
                   // $scope.TERMINATION_REASONS_LIST.push(angular.copy(lastData));
                } else {
                    $scope.TERMINATION_REASONS_LIST = data.data.Table;
                   // $scope.TERMINATION_REASONS_LIST.push(angular.copy($scope.BLANK_TERMINATION_TYPES));
                }
            }
            else if (data.data == 0) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            } else {
                //$scope.TERMINATION_REASONS_LIST.push(angular.copy($scope.BLANK_TERMINATION_TYPES));
                $scope.TERMINATION_REASONS_LIST = data.data.Table.length > 0 ? data.data.Table : [];
            }
        });
    }


    $scope.HRM_GET_DOCUMENT_REQUEST_MSTR = function () {
        var UserModelObj = new Object();
        UserModelObj.CUSTOMER_ID = $cookies.get("CUSTOMER_ID");
        UserModelObj.ENTITY_ID = null;
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'HRM_GET_DOCUMENT_REQUEST_MSTR').then(function (data) {
            if (data.data.Table.length > 0) {
                if ($scope.DOCUMENT_REQUEST_LIST.length > data.data.Table.length) {
                    let lastData = $scope.DOCUMENT_REQUEST_LIST[$scope.DOCUMENT_REQUEST_LIST.length - 1];
                    $scope.DOCUMENT_REQUEST_LIST = data.data.Table;
                  //  $scope.DOCUMENT_REQUEST_LIST.push(angular.copy(lastData));
                } else {
                    $scope.DOCUMENT_REQUEST_LIST = data.data.Table;
                   // $scope.DOCUMENT_REQUEST_LIST.push(angular.copy($scope.BLANK_DOCUMENT_REQUEST));
                }
            }
            else if (data.data == 0) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            } else {
                //$scope.DOCUMENT_REQUEST_LIST.push(angular.copy($scope.BLANK_DOCUMENT_REQUEST));
                $scope.DOCUMENT_REQUEST_LIST = data.data.Table.length > 0 ? data.data.Table : [];
            }
        });
    }
    $scope.HRM_GET_QUALIFICATION_TYPE = function () {
        var UserModelObj = new Object();
        UserModelObj.CUSTOMER_ID = $cookies.get("CUSTOMER_ID");
        UserModelObj.ENTITY_ID = null;
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'HRM_GET_QUALIFICATION_TYPE').then(function (data) {
            if (data.data.Table.length > 0) {
                if ($scope.QUALIFICATION_TYPE_LIST.length > data.data.Table.length) {
                    let lastData = $scope.QUALIFICATION_TYPE_LIST[$scope.QUALIFICATION_TYPE_LIST.length - 1];
                    $scope.QUALIFICATION_TYPE_LIST = data.data.Table;
                   // $scope.QUALIFICATION_TYPE_LIST.push(angular.copy(lastData));
                } else {
                    $scope.QUALIFICATION_TYPE_LIST = data.data.Table;
                  //  $scope.QUALIFICATION_TYPE_LIST.push(angular.copy($scope.BLANK_QUALIFICATION_TYPE));
                }
            }
            else if (data.data == 0) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            } else {
                //$scope.QUALIFICATION_TYPE_LIST.push(angular.copy($scope.BLANK_QUALIFICATION_TYPE));
                $scope.QUALIFICATION_TYPE_LIST = data.data.Table.length > 0 ? data.data.Table : [];
            }
        });
    }

    $scope.GET_CUSTOMER_SETTINGS = function (_param_retun_value, _param_tableids, _param_customer, _param_module) {
        var readOnlyObject = new Object();
        readOnlyObject.CUSTOMER_ID = _param_retun_value.CUSTOMER_ID;
        readOnlyObject.MODULE_ID = _param_retun_value.MODULE_ID;
        readOnlyObject.TABLE_ID_LIST = [];
        //---Employee Number Generation       48
        angular.forEach(_param_tableids.split(','), function (_loop_value) {
            var readonly = new Object();
            readonly.TABLE_ID = _loop_value;
            readOnlyObject.TABLE_ID_LIST.push(readonly);
        });
        PrcCommMethods.HUMANRESOURCE_API(readOnlyObject, 'GET_CUSTOMER_SETTINGS').then(function (data) {
            if (data.data.Table.length > 0) {
                angular.forEach(data.data.Table, function (_loop_value) {
                    if (_loop_value.SETTING_MASTER_ID == 48) {
                        $scope.UserSearch.AUTO_GENERATE = parseInt(_loop_value.SETTING_VALUE) == 1 ? true : false;
                    }
                    else if (_loop_value.SETTING_MASTER_ID == 49) {
                        $scope.UserSearch.DEFAULT_PROB_IN_MONTHS = _loop_value.SETTING_VALUE;
                    }
                    else if (_loop_value.SETTING_MASTER_ID == 83) {
                        $scope.UserSearch.AUTO_GENERATE_PREFIX_NO = _loop_value.SETTING_VALUE;
                    }
                });
            }
            else if (data.data == 0) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
        });
    }


    $scope.HRM_GET_EMPLOYEE_TYPES();
    $scope.HRM_GET_EMPLOYEE_STATUSES();
    $scope.HRM_GET_TERMINATION_REASONS();
    $scope.HRM_GET_DOCUMENT_REQUEST_MSTR();
    $scope.HRM_GET_QUALIFICATION_TYPE();

    $scope.HRM_INS_UPD_EMPLOYEE_TYPES = function (_param_employee, _param_index, _param_call_Flag) {
        $scope.EMPLOYEE_TYPES_FORM.submitted = true;
        var Valid = 0;
        if (_param_call_Flag == 1 && _param_employee.EMPLOYEE_TYPES_ID == undefined) {
            angular.forEach($scope.EMPLOYEE_TYPES_LIST, function (_param) {
                if (_param.EMPLOYEE_TYPES_ID != 0) {
                    if (_param.EMPLOYEE_TYPE_NAMES == _param_employee.EMPLOYEE_TYPE_NAMES) {
                        Valid++;
                    }
                }
            })
        }
        var _var_confirm_msg = true;
        if (_param_call_Flag == 2) {
            //_var_confirm_msg = confirm('Are you sure, do you want to proceed?')
        }
        if (_var_confirm_msg && _param_employee.EMPLOYEE_TYPE_NAMES != "" && _param_employee.EMPLOYEE_TYPE_NAMES != null && _param_employee.EMPLOYEE_TYPE_NAMES != undefined) {
            if (_param_call_Flag == 2 || Valid == 0) {
            var CusModelObj = new Object();
            CusModelObj.EMPLOYEE_TYPES_ID = _param_employee.EMPLOYEE_TYPES_ID;
            CusModelObj.EMPLOYEE_TYPE_NAMES = _param_employee.EMPLOYEE_TYPE_NAMES;
            CusModelObj.CUSTOMER_ID = $scope.UserSearch.CUSTOMER_ID;
            CusModelObj.ENTITY_ID = $scope.UserSearch.ENTITY_ID;
            CusModelObj.ACTIVE = _param_call_Flag == 2 ? 0 : 1;
            CusModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_INS_UPD_EMPLOYEE_TYPES').then(function (data) {
                if (data.data > 0) {
                    if (_param_employee.EMPLOYEE_TYPES_ID == 0 && _param_call_Flag == 1) {
                        $scope.$parent.ShowAlertBox("Success", 'Employee Type added successfully', 3000);
                    }
                    else if (_param_employee.EMPLOYEE_TYPES_ID > 0 && _param_call_Flag == 1) {
                        $scope.$parent.ShowAlertBox("Success", 'Employee Type updated successfully', 3000);
                    }
                    else if (_param_employee.EMPLOYEE_TYPES_ID > 0 && _param_call_Flag == 2) {
                        $scope.$parent.ShowAlertBox("Success", 'Employee Type Deleted successfully', 3000);
                    }
                    $scope.HRM_GET_EMPLOYEE_TYPES();
                    _param_employee.EMPLOYEE_TYPE_NAMES = '';
                    $scope.EMPLOYEE_TYPES_FORM.submitted = false;

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
        if (_param_employee.EMPLOYEE_TYPE_NAMES == undefined || _param_employee.EMPLOYEE_TYPE_NAMES == null || _param_employee.EMPLOYEE_TYPE_NAMES == "") {
            _param_employee.EMPLOYEE_TYPE_NAMES = '';
            $scope.EMPLOYEE_TYPES_FORM.submitted = false;
            $scope.$parent.ShowAlertBox("Error", 'Please enter a valuable information', 3000);
        };
        if (Valid > 0) {
            $scope.$parent.ShowAlertBox("Attention", _param_employee.EMPLOYEE_TYPE_NAMES + ' is already saved. Please, save different name.', 3000);
        }
    }
    $scope.HRM_INS_UPD_TERMINATION_REASONS = function (_param_employee_ter, _param_index, _param_call_Flag) {
        $scope.TERMINATION_REASONS_FORM.submitted = true;
        var _var_confirm_msg = true;
        var Valid = 0;
        if (_param_call_Flag == 1 && _param_employee_ter.TERMINATION_REASONS_ID == undefined) {
            angular.forEach($scope.TERMINATION_REASONS_LIST, function (_param) {
                if (_param.TERMINATION_REASONS_ID != 0) {
                    if (_param.TERMINATION_REASONS_NAME == $scope.UserSearch.TERMINATION_REASONS_NAMES) {
                        Valid++;
                    }
                }
            })
        }
        if (_param_call_Flag == 2) {
            //_var_confirm_msg = confirm('Are you sure, do you want to proceed?')
        }
        if (_var_confirm_msg && _param_employee_ter.TERMINATION_REASONS_NAMES != "" && _param_employee_ter.TERMINATION_REASONS_NAMES != undefined && _param_employee_ter.TERMINATION_REASONS_NAMES != null) {
            if (_param_call_Flag == 2 || Valid == 0) {
            var CusModelObj = new Object();
            CusModelObj.TERMINATION_REASONS_ID = _param_employee_ter.TERMINATION_REASONS_ID;
            CusModelObj.TERMINATION_REASONS_NAMES = _param_employee_ter.TERMINATION_REASONS_NAMES;
            CusModelObj.CUSTOMER_ID = $scope.UserSearch.CUSTOMER_ID;
            CusModelObj.ENTITY_ID = $scope.UserSearch.ENTITY_ID;
            CusModelObj.ACTIVE = _param_call_Flag == 2 ? 0 : 1;
            CusModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_INS_UPD_TERMINATION_REASONS').then(function (data) {
                if (data.data > 0) {
                    if (_param_employee_ter.TERMINATION_REASONS_ID == 0 && _param_call_Flag == 1) {
                        $scope.$parent.ShowAlertBox("Success", 'Termination Reasons added successfully', 3000);
                    }
                    else if (_param_employee_ter.TERMINATION_REASONS_ID > 0 && _param_call_Flag == 1) {
                        $scope.$parent.ShowAlertBox("Success", 'Termination Reasons updated successfully', 3000);
                    }
                    else if (_param_employee_ter.TERMINATION_REASONS_ID > 0 && _param_call_Flag == 2) {
                        $scope.$parent.ShowAlertBox("Success", 'Termination Reasons Deleted successfully', 3000);
                    }
                    $scope.HRM_GET_TERMINATION_REASONS();
                    _param_employee_ter.TERMINATION_REASONS_NAMES = '';
                    $scope.TERMINATION_REASONS_FORM.submitted = false;

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
        if (_param_employee_ter.TERMINATION_REASONS_NAMES == undefined || _param_employee_ter.TERMINATION_REASONS_NAMES == null || _param_employee_ter.TERMINATION_REASONS_NAMES == "") {
            _param_employee_ter.TERMINATION_REASONS_NAMES = '';
            $scope.TERMINATION_REASONS_FORM.submitted = false;
            $scope.$parent.ShowAlertBox("Error", 'Please enter a valuable information', 3000);
        };
        if (Valid > 0) {
            $scope.$parent.ShowAlertBox("Attention", _param_employee_ter.TERMINATION_REASONS_NAMES + ' is already saved. Please, save different name.', 3000);
        }
    }
    $scope.HRM_INS_UPD_QUALIFICATION_TYPE = function (_param_qualification, _param_index, _param_call_Flag) {
        $scope.QUALIFICATION_TYPE_FORM.submitted = true;
        var _var_confirm_msg = true;
        var Valid = 0;
        if (_param_call_Flag == 1 && _param_qualification.QUALIFICATION_TYPE_ID == undefined) {
            angular.forEach($scope.QUALIFICATION_TYPE_LIST, function (_param) {
                if (_param.QUALIFICATION_TYPE_ID != 0) {
                    if (_param.QUALIFICATION_NAMES == $scope.UserSearch.QUALIFICATION_NAMES) {
                        Valid++;
                    }
                }
            })
        }
        if (_param_call_Flag == 2) {
            //_var_confirm_msg = confirm('Are you sure, do you want to proceed?')
        }
        if (_var_confirm_msg && _param_qualification.QUALIFICATION_NAMES != "" && _param_qualification.QUALIFICATION_NAMES != null && _param_qualification.QUALIFICATION_NAMES != undefined) {
            if (_param_call_Flag == 2 || Valid == 0) {
            var CusModelObj = new Object();
            CusModelObj.QUALIFICATION_TYPE_ID = _param_qualification.QUALIFICATION_TYPE_ID;
            CusModelObj.QUALIFICATION_NAMES = _param_qualification.QUALIFICATION_NAMES;
            CusModelObj.CUSTOMER_ID = $scope.UserSearch.CUSTOMER_ID;
            CusModelObj.ENTITY_ID = $scope.UserSearch.ENTITY_ID;
            CusModelObj.ACTIVE = _param_call_Flag == 2 ? 0 : 1;
            CusModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_INS_UPD_QUALIFICATION_TYPE').then(function (data) {
                if (data.data > 0) {
                    if (_param_qualification.QUALIFICATION_TYPE_ID == 0 && _param_call_Flag == 1) {
                        $scope.$parent.ShowAlertBox("Success", 'Qualification Type added successfully', 3000);
                    }
                    else if (_param_qualification.QUALIFICATION_TYPE_ID > 0 && _param_call_Flag == 1) {
                        $scope.$parent.ShowAlertBox("Success", 'Qualification Type updated successfully', 3000);
                    }
                    else if (_param_qualification.QUALIFICATION_TYPE_ID > 0 && _param_call_Flag == 2) {
                        $scope.$parent.ShowAlertBox("Success", 'Qualification Type Deleted successfully', 3000);
                    }
                    $scope.HRM_GET_QUALIFICATION_TYPE();
                    _param_qualification.QUALIFICATION_NAMES = '';
                    $scope.QUALIFICATION_TYPE_FORM.submitted = false;
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
        if (_param_qualification.QUALIFICATION_NAMES == undefined || _param_qualification.QUALIFICATION_NAMES == null || _param_qualification.QUALIFICATION_NAMES == "") {
            _param_qualification.QUALIFICATION_NAMES = '';
            $scope.QUALIFICATION_TYPE_FORM.submitted = false;
            $scope.$parent.ShowAlertBox("Error", 'Please enter a valuable information', 3000);
        };
        if (Valid > 0) {
            $scope.$parent.ShowAlertBox("Attention", _param_qualification.QUALIFICATION_NAMES + ' is already saved. Please, save different name.', 3000);
        }
    }
    $scope.HRM_INS_UPD_DOCUMENT_REQUEST_MSTR = function (_param_document, _param_index, _param_call_Flag) {
        $scope.DOCUMENT_REQUEST_FORM.submitted = true;
        var _var_confirm_msg = true;
        var Valid = 0;
        if (_param_call_Flag == 1 && _param_document.DOCUMENT_REQUEST_MSTR_ID == undefined) {
            angular.forEach($scope.DOCUMENT_REQUEST_LIST, function (_param) {
                if (_param.DOCUMENT_REQUEST_MSTR_ID != 0) {
                    if (_param.DOCUMENT_REQUEST_NAMES == $scope.UserSearch.DOCUMENT_REQUEST_NAMES) {
                        Valid++;
                    }
                }
            })
        }
        if (_param_call_Flag == 2) {
            //_var_confirm_msg = confirm('Are you sure, do you want to proceed?')
        }
        if (_var_confirm_msg && _param_document.DOCUMENT_REQUEST_NAMES != "" && _param_document.DOCUMENT_REQUEST_NAMES != null && _param_document.DOCUMENT_REQUEST_NAMES != undefined) {
            if (_param_call_Flag == 2 || Valid == 0) {
            var CusModelObj = new Object();
            CusModelObj.DOCUMENT_REQUEST_MSTR_ID = _param_document.DOCUMENT_REQUEST_MSTR_ID;
            CusModelObj.DOCUMENT_REQUEST_NAMES = _param_document.DOCUMENT_REQUEST_NAMES;
            CusModelObj.CUSTOMER_ID = $scope.UserSearch.CUSTOMER_ID;
            CusModelObj.ENTITY_ID = $scope.UserSearch.ENTITY_ID;
            CusModelObj.ACTIVE = _param_call_Flag == 2 ? 0 : 1;
            CusModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_INS_UPD_DOCUMENT_REQUEST_MSTR').then(function (data) {
                if (data.data > 0) {
                    if (_param_document.DOCUMENT_REQUEST_MSTR_ID == 0 && _param_call_Flag == 1) {
                        $scope.$parent.ShowAlertBox("Success", 'Document Request added successfully', 3000);
                    }
                    else if (_param_document.DOCUMENT_REQUEST_MSTR_ID > 0 && _param_call_Flag == 1) {
                        $scope.$parent.ShowAlertBox("Success", 'Document Request updated successfully', 3000);
                    }
                    else if (_param_document.DOCUMENT_REQUEST_MSTR_ID > 0 && _param_call_Flag == 2) {
                        $scope.$parent.ShowAlertBox("Success", 'Document Request Deleted successfully', 3000);
                    }
                    $scope.HRM_GET_DOCUMENT_REQUEST_MSTR();
                    _param_document.DOCUMENT_REQUEST_NAMES = '';
                    $scope.DOCUMENT_REQUEST_FORM.submitted = false;
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
        if (_param_document.DOCUMENT_REQUEST_NAMES == undefined || _param_document.DOCUMENT_REQUEST_NAMES == null || _param_document.DOCUMENT_REQUEST_NAMES == "") {
            _param_document.DOCUMENT_REQUEST_NAMES = '';
            $scope.DOCUMENT_REQUEST_FORM.submitted = false;        
            $scope.$parent.ShowAlertBox("Error", 'Please enter a valuable information', 3000);
        };
        if (Valid > 0) {
            $scope.$parent.ShowAlertBox("Attention", _param_document.DOCUMENT_REQUEST_NAMES + ' is already saved. Please, save different name.', 3000);
        }
    }

    $scope.INS_UPD_CUSTOMER_SETTINGS = function (SETTING_VALUE, SETTING_MASTER_ID) {
        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_ID = $scope.UserSearch.CUSTOMER_ID;
        CusModelObj.USER_ID = $scope.UserSearch.USER_ID;
        CusModelObj.CUSTOMER_SETTINGS_TYPE = [];
        var readonly = new Object()
        readonly.SETTING_VALUE = SETTING_VALUE;
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

    $scope.INS_UPD_CUSTOMER_SETTINGS_MULTIPLE = function () {
        //84	Employers NI %
        //85	Employers Pension %
        //86	Holiday Accrual %
        //87	Exclude Salaried from Holiday Accrual done tru

        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_ID = $scope.UserSearch.CUSTOMER_ID;
        CusModelObj.USER_ID = $scope.UserSearch.USER_ID;
        CusModelObj.CUSTOMER_SETTINGS_TYPE = [];
        CusModelObj.BRANCH_TYPE = [];
        CusModelObj.POSITIONS_TYPE = [];
        CusModelObj.DEPARTMENTS_TYPE = [];
        CusModelObj.EMPLOYEES_TYPE = [];

        var readonly = new Object()
        readonly.SETTING_VALUE = $scope.UserSearch.AUTO_GENERATE ? '1' : '0';
        readonly.SETTING_MASTER_ID = 48;
        CusModelObj.CUSTOMER_SETTINGS_TYPE.push(readonly);

        var readonly = new Object()
        readonly.SETTING_VALUE = $scope.UserSearch.AUTO_GENERATE_PREFIX_NO == undefined || $scope.UserSearch.AUTO_GENERATE_PREFIX_NO == null ? '' : $scope.UserSearch.AUTO_GENERATE_PREFIX_NO;
        readonly.SETTING_MASTER_ID = 83;
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
    
    $scope.ADD_MORE_EMPLOYEE_TYPE_Fn = function () {
        $scope.EMPLOYEE_TYPES_LIST.push(angular.copy($scope.BLANK_EMPLOYEE_TYPES));
    };
    $scope.ADD_MORE_TERMINATION_TYPE_Fn = function () {
        $scope.TERMINATION_REASONS_LIST.push(angular.copy($scope.BLANK_TERMINATION_TYPES));
    };
    $scope.ADD_MORE_QUALIFICATION_TYPE_Fn = function () {
        $scope.QUALIFICATION_TYPE_LIST.push(angular.copy($scope.BLANK_QUALIFICATION_TYPE));
    };
    $scope.ADD_MORE_DOCUMENT_REQUEST_Fn = function () {
        $scope.DOCUMENT_REQUEST_LIST.push(angular.copy($scope.BLANK_DOCUMENT_REQUEST));
    };


    $scope.EDIT_EMPLOYEE_TYPES_Fn = function (_param_employee, index) {
        _param_employee.HIDE_SHOW = !_param_employee.HIDE_SHOW;
    };
    $scope.EDIT_TERMINATION_TYPES_Fn = function (_param_employee_ter, index) {
        _param_employee_ter.TERMINATION_REASONS_NAMES = _param_employee_ter.TERMINATION_REASONS_NAME;
        _param_employee_ter.HIDE_SHOW = !_param_employee_ter.HIDE_SHOW;
    };
    $scope.EDIT_QUALIFICATION_TYPE_Fn = function (_param_qualification, index) {
        _param_qualification.HIDE_SHOW = !_param_qualification.HIDE_SHOW;
    };
    $scope.EDIT_DOCUMENT_REQUEST_Fn = function (_param_document, index) {
        _param_document.HIDE_SHOW = !_param_document.HIDE_SHOW;
    };


    $scope.DELETE_EMPLOYEE_TYPES_Fn = function (_param_employee, index) {
        $scope.SELECTED_EMPLOYEE = _param_employee;
        $scope.SELECTED_EMPLOYEE.MESSAGE = "It is safe to perform this operation as it hasn't been assigned to any employee. Do you want to proceed?";
        $('#Employee_Type').modal('show');

    }
    $scope.DELETE_TERMINATION_TYPES_Fn = function (_param_employee_ter, index) {
        _param_employee_ter.TERMINATION_REASONS_NAMES = _param_employee_ter.TERMINATION_REASONS_NAME;
        $scope.SELECTED_TERMINATION_TYPE = _param_employee_ter;
        $scope.SELECTED_TERMINATION_TYPE.MESSAGE = "It is safe to perform this operation as it hasn't been assigned to any employee. Do you want to proceed?";
        $('#Termination_Type').modal('show');

    }
    $scope.DELETE_QUALIFICATION_TYPES_Fn = function (_param_qualification, index) {
        $scope.SELECTED_QUALIFICATION = _param_qualification;
        $scope.SELECTED_QUALIFICATION.MESSAGE = "It is safe to perform this operation as it hasn't been assigned to any employee. Do you want to proceed?";
        $('#Qualification_Type').modal('show');

    }
    $scope.DELETE_DOCUMENT_REQUEST_Fn = function (_param_document, index) {
        $scope.SELECTED_DOCUMENT = _param_document;
        $scope.SELECTED_DOCUMENT.MESSAGE = "It is safe to perform this operation as it hasn't been assigned to any employee. Do you want to proceed?";
        $('#Document_Request').modal('show');

    }



    $scope.GET_CUSTOMER_SETTINGS($scope.UserSearch, '48,83,49');

});


