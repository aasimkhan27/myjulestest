app.controller('DepartmentController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.COMMON_CODE_CHANGE();
    $scope.Dptid = getUrlParameter('DptID', $location.absUrl());
    $scope.$parent.overlay_loadingNew = 'block';
    $scope.IS_ACCESS_ADD_MORE_FEILD = $scope.$parent.CheckSubModuleAccess(116);
    $scope.AddTeam = {
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        PAGE_NOE: 1,
        PAGE_SIZEE: 10,
    };
    $scope.DeparmentSearch = {
        DEPARTMENT_NAME: "",
        DEPARTMENT_COLOR: '',
        PARENT_DEPARTMENT_ID: null,
        DIVISION_ID: null,
        DIVISION_NAME: null,
        DIVISION_CODE: null,
        DEPARTMENT_CODE: null,
        CUSTOM_FIELD_1: null,
        CUSTOM_FIELD_2: null,
        CUSTOM_FIELD_3: null,
        CUSTOM_FIELD_4: null,
        CUSTOM_FIELD_5: null,
        CUSTOM_FIELD_6: null,
        CUSTOM_FIELD_7: null,
        CUSTOM_FIELD_8: null,
        CUSTOM_FIELD_9: null,
        CUSTOM_FIELD_10: null,
        CUSTOM_FIELD_11: null,
        CUSTOM_FIELD_12: null,
        CUSTOM_FIELD_13: null,
        CUSTOM_FIELD_14: null,
        CUSTOM_FIELD_15: null,
        PAGE_NO: 1,
        PAGE_SIZE: 999,
    };
    $scope.ResetDept = function () {
        $scope.DeparmentSearch = {
            DEPARTMENT_NAME: "",
            DEPARTMENT_COLOR: '',
            PARENT_DEPARTMENT_ID: null,
            DIVISION_ID: null,
            DIVISION_NAME: null,
            DIVISION_CODE: null,
            DEPARTMENT_CODE: null,
            CUSTOM_FIELD_1: null,
            CUSTOM_FIELD_2: null,
            CUSTOM_FIELD_3: null,
            CUSTOM_FIELD_4: null,
            CUSTOM_FIELD_5: null,
            CUSTOM_FIELD_6: null,
            CUSTOM_FIELD_7: null,
            CUSTOM_FIELD_8: null,
            CUSTOM_FIELD_9: null,
            CUSTOM_FIELD_10: null,
            CUSTOM_FIELD_11: null,
            CUSTOM_FIELD_12: null,
            CUSTOM_FIELD_13: null,
            CUSTOM_FIELD_14: null,
            CUSTOM_FIELD_15: null,
            PAGE_NO: 1,
            PAGE_SIZE: 10,
        }
        angular.forEach($scope.CUSTOM_FIELDS_LIST, function (x) {
            x.FIELD_VALUE = '';
            if (x.FIELD_TYPE_ID == 3) {
                x.FIELD_VALUE = null;
            }
            if (x.FIELD_TYPE_ID == 7) {
                x.checkedOption = [];
            }
        })
        $scope.CustomForm.submitted = false;

        document.getElementById('ids2').value = '000000';
        var a = document.getElementsByClassName('current-color')
        a[0].style.backgroundColor = '#000000';
    };
    $scope.HR_GET_REPORTING_DEPARTMENTS = function (CUSTOM_FIELD) {
        var IS_ACCESS_ALL = $scope.$parent.CheckSubModuleAccess(46);///USE 46 INSTEAD OF 40 
        var DeptModelObj = new Object();
        DeptModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        DeptModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        DeptModelObj.DEPARTMENT_ID = $scope.Dptid;
        //DeptModelObj.FLAG = 3;
        DeptModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
        DeptModelObj.FLAG = IS_ACCESS_ALL ? 1 : 3;
        DeptModelObj.SORT_COLUMN_NO = 1;
        DeptModelObj.SORT_ORDER_NO = 1;
        PrcCommMethods.HR_API(DeptModelObj, 'HR_GET_DEPARTMENTS').then(function (data) {
            if (parseInt($scope.Dptid) > 0) {
                var index = data.data.Table.findIndex(x => x.DEPARTMENT_ID === parseInt($scope.Dptid));
                if (index > -1) {
                    var List = angular.copy(data.data.Table.splice(index, 1));
                }
                else {
                    var List = angular.copy(data.data.Table.splice(index, 1));
                }

            }
            if (IS_ACCESS_ALL) {
                var a = {
                    TABLE_ID: -1,
                    DISPLAY_TEXT: 'No Reporting Department',
                }
                data.data.Table.push(a);
            }
            CUSTOM_FIELD.OPTION_LIST = data.data.Table;
        });
    };
    $scope.HR_GET_DEPARTMENT_DETAIL_BY_ID = function (CUSTOM_FIELD) {
        var DeptModelObj = new Object();
        // DeptModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        // DeptModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        DeptModelObj.DEPARTMENT_ID = $scope.Dptid;
        //  DeptModelObj.FLAG = 1;
        PrcCommMethods.HR_API(DeptModelObj, 'HR_GET_DEPARTMENT_DETAIL_BY_ID').then(function (data) {
            $scope.ObjectData = data.data.Table[0];
            $scope.COLMD = 'col-md-4';
            $scope.$parent.GET_CUSTOM_APP_FIELD_MAPPING(1, $scope.COLMD);
        });
    };
    $scope.HR_GET_DIVISION = function (CUSTOM_FIELD) {
        var DeptModelObj = new Object();
        DeptModelObj.ACTIVE = 1;
        DeptModelObj.PAGE_NO = 0;
        DeptModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        DeptModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PrcCommMethods.HR_API(DeptModelObj, 'HR_GET_DIVISION').then(function (data) {
            CUSTOM_FIELD.OPTION_LIST = data.data.Table;
        });
    };
    //praveenmca2002@gmail.com;
    $scope.INS_UPD_DEPARTMENT = function (FLAG) {
        $scope.CustomForm.submitted = true;
        if ($scope.CustomForm.$valid) {
            var DeptModelObj = new Object();
            var IsValidCount = 0;
            angular.forEach($scope.$parent.CUSTOM_FIELDS_LIST, function (val) {
                if (val.FIELD_TYPE_ID == 7) {
                    var i = '';
                    for (var j = 0; j < val.checkedOption.length; j++) {
                        if (i == '') {
                            i = val.checkedOption[j];
                        }
                        else {
                            i = i + ':;:' + val.checkedOption[j];
                        }
                    }
                    val.FIELD_VALUE = i;
                }
                if (val.FIELD_TYPE_ID == 6) {
                    val.FIELD_VALUE = val.FIELD_VALUE ? 1 : 0
                }
                if (val.FIELD_TYPE_ID == 11) {
                    if (val.UploadedFiles == undefined || val.UploadedFiles.length == 0) {
                        if (val.IS_MANDATORY == 1) {
                            IsValidCount++;
                        }
                    }
                    else {
                        var FILE = '';
                        for (var j = 0; j < val.UploadedFiles.length; j++) {
                            if (FILE == '') {
                                FILE = val.UploadedFiles[j].FILE_PATH + ':;:' + val.UploadedFiles[j].ORIGINAL_FILE_NAME + ':;:' + val.UploadedFiles[j].SERVER_FILE_NAME;
                            }
                            else {
                                FILE = FILE + ':;:' + val.UploadedFiles[j].FILE_PATH + ':;:' + val.UploadedFiles[j].ORIGINAL_FILE_NAME + ':;:' + val.UploadedFiles[j].SERVER_FILE_NAME;
                            }
                        }
                        val.FIELD_VALUE = FILE;
                    }
                }
                if (val.FIELD_VALUE == undefined) {
                    val.FIELD_VALUE = '';
                }

                DeptModelObj[val.NG_MODEL] = val.FIELD_VALUE;
                if (val.FIELD_MASTER_ID == 2) {
                    var color = document.getElementById('ids2').value;
                    DeptModelObj.DEPARTMENT_COLOR = color;
                }
                //DeptModelObj.DEPARTMENT_COLOR = $scope.DeparmentSearch.DEPARTMENT_COLOR;

            });
            DeptModelObj.DEPARTMENT_ID = $scope.Dptid;
            DeptModelObj.USER_ID = parseInt($cookies.get("USERID"));
            DeptModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
            DeptModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            DeptModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
            DeptModelObj.ACTIVE = 1;
            if (IsValidCount == 0) {
                $scope.CustomForm.submitted = false;
                PrcCommMethods.HR_API(DeptModelObj, 'HR_INS_UPD_DEPARTMENT').then(function (data) {
                    if (FLAG == 1 && $scope.$parent.CHECK_MODULE_ACCESS(2, 2)) {
                        $location.path('Addposition');
                    }
                    else if (FLAG == 2) {
                        $location.path('Dpt_Lst');
                    }
                    if ($scope.Dptid > 0) {
                        $scope.ShowAlert('Success', 'Department Updated Successfully', 5000);
                    }
                    else {
                        $scope.ShowAlert('Success', 'Department Added Successfully', 5000);
                    }
                });
            }
        }
    };

    $scope.COMMON_PAGE_LOAD_FY = function () {
        if ($scope.Dptid > 0) {
            $scope.HR_GET_DEPARTMENT_DETAIL_BY_ID();
            $scope.HEADER_EDIT_ADD = 'Edit'
        }
        else {
            $scope.HEADER_EDIT_ADD = 'Add'
            $scope.$parent.GET_CUSTOM_APP_FIELD_MAPPING(1, $scope.COLMD);
        };
    }
    $scope.COMMON_PAGE_LOAD_FY();
    //if ($scope.Dptid > 0) {
    //    $scope.HR_GET_DEPARTMENT_DETAIL_BY_ID();
    //    $scope.HEADER_EDIT_ADD = 'Edit'
    //}
    //else {
    //    $scope.HEADER_EDIT_ADD = 'Add'
    //    $scope.$parent.GET_CUSTOM_APP_FIELD_MAPPING(1, $scope.COLMD);
    //};
    $scope.RedirectiononEmp = function (EMP) {
        $('#New_Employee').modal('hide');
        if (EMP.STEP_NO == 1) {
            window.location.href = '../DashBoard/hrIndex#!/Addemployee?x=1&EmpID=' + EMP.EMP_PRS_ID;
        }
        if (EMP.STEP_NO == 2) {
            window.location.href = '../DashBoard/hrIndex#!/EmpContact?x=1&EmpID=' + EMP.EMP_PRS_ID;
        }
        if (EMP.STEP_NO == 3) {
            window.location.href = '../DashBoard/hrIndex#!/Empemplment?x=1&EmpID=' + EMP.EMP_PRS_ID;
        }
        if (EMP.STEP_NO == 4) {
            window.location.href = '../DashBoard/hrIndex#!/EmpQualifi?x=1&EmpID=' + EMP.EMP_PRS_ID;
        }
        if (EMP.STEP_NO == 5) {
            window.location.href = '../DashBoard/hrIndex#!/EmpComp?x=1&EmpID=' + EMP.EMP_PRS_ID;
        }
        if (EMP.STEP_NO == 6) {
            window.location.href = '../DashBoard/hrIndex#!/EmpLev?x=1&EmpID=' + EMP.EMP_PRS_ID;
        }
        if (EMP.STEP_NO == 7) {
            window.location.href = '../DashBoard/hrIndex#!/EmpDoc?x=1&EmpID=' + EMP.EMP_PRS_ID;
        }
    };
    $scope.toggleCheck = function (Optionvalue, LINE) {
        if (LINE.checkedOption == undefined) {
            LINE.checkedOption = [];
        }
        if (LINE.checkedOption.indexOf(Optionvalue) === -1) {
            LINE.checkedOption.push(Optionvalue);
        } else {
            LINE.checkedOption.splice(LINE.checkedOption.indexOf(Optionvalue), 1);
        }
    };
    $scope.DisplayDetails = function (SelectedLine) {
        if (SelectedLine.ShowDetails) {
            SelectedLine.ShowDetails = false;
        }
        else {
            SelectedLine.ShowDetails = true;
        }
    };
    $scope.$parent.child_scope = $scope;
});
app.controller('DepartmentListController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.COMMON_CODE_CHANGE();
    $scope.DeptSearch = {
        DEPARTMENT_NAME: '',
        DIVISION_NAME: '',
        DEPARTMENT_CODE: '',
        DIVISION_CODE: '',
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        IS_EDIT_DEPARTMENT: $scope.$parent.CHECK_MODULE_ACCESS(1, 3)
    };
    $scope.RESET_DEPT = function () {
        $scope.DeptSearch = {
            DEPARTMENT_NAME: '',
            DIVISION_NAME: '',
            DEPARTMENT_CODE: '',
            DIVISION_CODE: '',
            PAGE_NO: 1,
            PAGE_SIZE: 10,
            IS_EDIT_DEPARTMENT: $scope.$parent.CHECK_MODULE_ACCESS(1, 3)
        }
    };

    $scope.HEADER_DEPT_LIST = [];

    $scope.IS_DEPARTMENT_FLAG = $scope.$parent.GET_ENTITY_SETTINGS(31)[0].SETTING_VALUE == "1" ? true : false;
    $scope.IS_POSITION_FLAG = $scope.$parent.GET_ENTITY_SETTINGS(32)[0].SETTING_VALUE == "1" ? true : false;
    if ($scope.IS_DEPARTMENT_FLAG) {
        $scope.HEADER_DEPT_LIST = [{ NAME: "Department Name", ID: 1, CLASS_NAME: '' },
        { NAME: "Department Code", ID: 2, CLASS_NAME: '' },
        { NAME: "Employee Count", ID: 5, CLASS_NAME: '' }];
    }
    else {
        $scope.HEADER_DEPT_LIST = [{ NAME: "Department Name", ID: 1, CLASS_NAME: '' },
        { NAME: "Department Code", ID: 2, CLASS_NAME: '' },
        { NAME: "Division Name ", ID: 3, CLASS_NAME: '' },
        { NAME: "Reporting Department ", ID: 4, CLASS_NAME: '' },
        { NAME: "Employee Count", ID: 5, CLASS_NAME: '' }];
    }

    

    $scope.Departmentsearch = {
        DEPARTMENT_NAME: "",
    }
    $scope.DEPARTMENT_REST = function () {
        $scope.Departmentsearch = {
            DEPARTMENT_NAME: "",
        };
        $scope.HR_GET_DEPARTMENTS(1, 1, false);
        $scope.DepartmentForm.submitted = false;
    }
    $scope.INS_UPD_DEPARTMENT = function () {
        $scope.DepartmentForm.submitted = true;
        if ($scope.DepartmentForm.$valid) {
            var DeptModelObj = new Object();
            var color = document.getElementById('ids2').value;
            DeptModelObj.DEPARTMENT_ID = $scope.Departmentsearch.DEPARTMENT_ID;
            DeptModelObj.DEPARTMENT_COLOR = color;
            DeptModelObj.DEPARTMENT_NAME = $scope.Departmentsearch.DEPARTMENT_NAME;
            DeptModelObj.DEPARTMENT_CODE = $scope.Departmentsearch.DEPARTMENT_CODE;
            DeptModelObj.USER_ID = parseInt($cookies.get("USERID"));
            DeptModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
            DeptModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            DeptModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
            DeptModelObj.ACTIVE = 1;
            $scope.DepartmentForm.submitted = false;
            PrcCommMethods.HR_API(DeptModelObj, 'HR_INS_UPD_DEPARTMENT').then(function (data) {
                if (data.data == -1) {
                    $scope.ShowAlert('Error', 'Department Already existed', 5000);
                }
                if (data.data > 1) {
                    $scope.ShowAlert('Success', 'Department Added Successfully', 5000);
                    $scope.DEPARTMENT_REST();
                    $('#AddDepartment').modal('hide');
                }
            });
        }
    };

    $scope.EDIT_DEPARTMENT = function (DeptSearch) {
        if ($scope.IS_DEPARTMENT_FLAG) {
            $('#AddDepartment').modal('show');
            $scope.Departmentsearch.DEPARTMENT_ID = DeptSearch.DEPARTMENT_ID;
            $scope.Departmentsearch.DEPARTMENT_NAME = DeptSearch.DEPARTMENT_NAME;
            $scope.Departmentsearch.DEPARTMENT_CODE = DeptSearch.DEPARTMENT_CODE;
            document.getElementById('ids2').value = DeptSearch.DEPARTMENT_COLOR;
            var a = document.getElementsByClassName('current-color')
            a[0].style.backgroundColor = '#' + DeptSearch.DEPARTMENT_COLOR;
        }
        else {
            window.location.href = "../DashBoard/hrIndex#!/Adddepartment?DptID=" + DeptSearch.DEPARTMENT_ID;
        }
        //href = "../DashBoard/hrIndex#!/Adddepartment?DptID={{PPL.DEPARTMENT_ID}}" 
    }


    $scope.GET_DEPARTMENT_LAZY_LOAD = function () {
        $scope.HR_GET_DEPARTMENTS(2, $scope.SORT_COLUMN_NO, $scope.SORT_ORDER_NO_ASCDESC);
    };
    //1 DEPARTMENT_NAME;
    ///2 DEPARTMENT_CODE;
    ///3 DIVISION_NAME;
    ///4 PARENT_DEPARTMENT_NAME;
    $scope.HR_GET_DEPARTMENTS = function (FLAG, SORT_COLUMN_NO, SORT_ORDER_NO_ASCDESC) {
        if (SORT_COLUMN_NO != 0) {
            $scope.SORT_COLUMN_NO = SORT_COLUMN_NO;
            $scope.SORT_ORDER_NO_ASCDESC = SORT_ORDER_NO_ASCDESC;
            if (FLAG == 1) {
                $scope.DEPARTMENT_LIST = [];
                $scope.DeptSearch.PAGE_NO = 1;
            }
            var POSModelObj = new Object();
            POSModelObj.DEPARTMENT_NAME = $scope.DeptSearch.DEPARTMENT_NAME;
            POSModelObj.DIVISION_NAME = $scope.DeptSearch.DIVISION_NAME;
            POSModelObj.DEPARTMENT_CODE = $scope.DeptSearch.DEPARTMENT_CODE;
            POSModelObj.DIVISION_CODE = $scope.DeptSearch.DIVISION_CODE;
            POSModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
            POSModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            POSModelObj.PAGE_NO = $scope.DeptSearch.PAGE_NO;
            POSModelObj.PAGE_SIZE = $scope.DeptSearch.PAGE_SIZE;
            POSModelObj.FLAG = $scope.$parent.CheckSubModuleAccess(46) ? 1 : 2;
            POSModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
            POSModelObj.SORT_COLUMN_NO = SORT_COLUMN_NO;
            POSModelObj.SORT_ORDER_NO = SORT_ORDER_NO_ASCDESC ? 1 : -1;//1 FOR ASC -1 FOR DESC
            if (FLAG == 1) { $scope.POSModelObj_Dir_Copy = angular.copy(POSModelObj); }
            else {
                $scope.POSModelObj_Dir_Copy.PAGE_NO = FLAG == undefined ? angular.copy($scope.DeptSearch.PAGE_NO) : $scope.POSModelObj_Dir_Copy.PAGE_NO;
            }
            PrcCommMethods.HR_API(FLAG == undefined ? $scope.POSModelObj_Dir_Copy : POSModelObj, 'HR_GET_DEPARTMENTS').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.DEPARTMENT_LIST = $scope.DEPARTMENT_LIST.concat(data.data.Table);
                    if (data.data.Table.length < $scope.DeptSearch.PAGE_SIZE) {
                        $scope.GetData = false;
                    }
                    else {
                        $scope.DeptSearch.PAGE_NO = parseInt($scope.DeptSearch.PAGE_NO) + 1;
                        $scope.GetData = true;
                    }
                }
                else {
                    if ($scope.DEPARTMENT_LIST.length == 0) {
                    }
                    $scope.GetData = false;
                }

            });
        }
    };
    $scope.HR_GET_DEPARTMENTS(1, 1, false);
    $scope.initcheckeditadd = function () {

    };
})