app.controller('PositionController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $timeout) {
    $('.modal-backdrop').removeClass('modal-backdrop fade show');
    $scope.COMMON_CODE_CHANGE();
    $scope.$parent.SCROLL_TOP();
    $scope.YESNO = [{ ID: 1, NAME: "Yes" }, { ID: 2, NAME: "No" }];
    $scope.POSITION_ID = getUrlParameter('PId', $location.absUrl());
    $scope.STEP_FLAG = 1;
    $scope.$parent.overlay_loadingNew = 'block';
    $scope.IS_ACCESS_ADD_MORE_FEILD = $scope.$parent.CheckSubModuleAccess(117);
    $scope.NO_OF_SHIFTS_PER_LIST = [{ ID: 1, NAME: "1" }, { ID: 2, NAME: "2" }, { ID: 3, NAME: "3" }
        , { ID: 4, NAME: "4" }
        , { ID: 5, NAME: "5" }
        , { ID: 6, NAME: "6" }
        , { ID: 7, NAME: "7" }

    ];
    $scope.PositionSearch = {
        POSITION_TEXT: '',
        POSITION_ID: '',
        POSITION_TITLE: '',
        JOB_DESCRIPTION: '',
        DEPARTMENT_ID: null,
        REPORTING_POSITION_ID: null,
        PAGE_NO: 1,
        PAGE_SIZE: 10,
    };
    $scope.WrkPtnSearch = {
        POSITION_ID: 0,
        WORK_PATTERN_CODE: '',
        WORK_PATTERN_NAME: '',
        WORK_PATTERN_DESC: '',
        WORK_PATTERN_TYPE_ID: null,
    },
        $scope.ResetStep1 = function () {
            $scope.PositionSearch.POSITION_TITLE = '',
                $scope.PositionSearch.JOB_DESCRIPTION = '',
                $scope.PositionSearch.DEPARTMENT_ID = null,
                $scope.PositionSearch.REPORTING_POSITION_ID = null


            $scope.RESET_CUSTOM_FIELD_PAGE();
            $scope.CustomForm.submitted = false;
        }
    $scope.ResetPosition = function () {
        $scope.PositionSearch = {
            DEPARTMENT_NAME: "",
            DEPARTMENT_COLOR: '',
            PARENT_DEPARTMENT_ID: null,
            PAGE_NO: 1,
            PAGE_SIZE: 10,
        }
    }
    $scope.HR_GET_DEPARTMENTS = function (CUSTOM_FIELD) {
        var DeptModelObj = new Object();
        DeptModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        DeptModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        DeptModelObj.FLAG = $scope.$parent.CheckSubModuleAccess(46) ? 1 : 3;
        DeptModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
        DeptModelObj.SORT_COLUMN_NO = 1;
        DeptModelObj.SORT_ORDER_NO = 1;
        PrcCommMethods.HR_API(DeptModelObj, 'HR_GET_DEPARTMENTS').then(function (data) {
            CUSTOM_FIELD.OPTION_LIST = data.data.Table;
        });
    };
    $scope.SELECT_SHIFT_TYPES = function () {
        var Noofshift = 0;
        if ($scope.WrkPtnSearch.WORK_PATTERN_TYPE_ID == 1) {
            Noofshift = 7;
        }
        if ($scope.WrkPtnSearch.WORK_PATTERN_TYPE_ID == 2) {
            Noofshift = 14;
        }
        if ($scope.WrkPtnSearch.WORK_PATTERN_TYPE_ID == 3) {
            Noofshift = 31;
        }
        $scope.SHIFT_LIST = [];
        for (var i = 0; i < Noofshift; i++) {
            var List = { TABLE_ID: 0, REMOVE_FLAG: 0, DAY_NO: i + 1, SHIFT_ID: null, START_TIME: "", END_TIME: "", PAID_BREAK: "", UN_PAID_BREAK: "" };
            $scope.SHIFT_LIST.push(List);
        }
    };
    $scope.HR_GET_SHIFTS = function () {
        var PosiModelObj = new Object();
        PosiModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        PrcCommMethods.HR_API(PosiModelObj, 'HR_GET_SHIFTS').then(function (data) {
            $scope.SHIFTS = data.data.Table;
        });
    };

    $scope.HR_GET_POSITION_LIST = function (CUSTOM_FIELD) {
        var IS_ACCESS_ALL = $scope.$parent.CheckSubModuleAccess(47);
        var PosiModelObj = new Object();
        PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PosiModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        PosiModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
        PosiModelObj.ACTIVE = 1;
        PosiModelObj.FLAG = 2;
        PosiModelObj.ADMIN_FLAG = IS_ACCESS_ALL ? 1 : 3;
        PosiModelObj.SORT_COLUMN_NO = 1;
        PosiModelObj.SORT_ORDER_NO = 1
        PrcCommMethods.HR_API(PosiModelObj, 'HR_GET_POSITION_LIST').then(function (data) {
            if (data.data.Table.length > 0) {
                if (parseInt($scope.POSITION_ID) > 0) {
                    var index = data.data.Table.findIndex(x => x.POSITION_ID === parseInt($scope.POSITION_ID));
                    if (index > -1) {
                        var List = angular.copy(data.data.Table.splice(index, 1));
                    }
                }
                if (IS_ACCESS_ALL) {
                    var a = {
                        TABLE_ID: -1,
                        DISPLAY_TEXT: 'No Reporting Position',
                    }
                    data.data.Table.push(a);
                }
                CUSTOM_FIELD.OPTION_LIST = data.data.Table;
            }
            else {
                CUSTOM_FIELD.OPTION_LIST = [];
                if (IS_ACCESS_ALL) {
                    var a = {
                        TABLE_ID: -1,
                        DISPLAY_TEXT: 'No Reporting Position',
                    }
                    CUSTOM_FIELD.OPTION_LIST.push(a);
                }
            }
        });
    };

    $scope.ObjectData = [];
    $scope.COMMON_PAGE_LOAD_FY = function () {
        if ($scope.POSITION_ID > 0) {
            $scope.HR_GET_POSITION();
            $scope.TxtSucEdit = "Edit";
        } else {
            $scope.TxtSucEdit = "Add";
            $scope.STEP_FLAG = 1; $scope.COLMD = 'col-md-4'
            $scope.$parent.GET_CUSTOM_APP_FIELD_MAPPING(2, $scope.COLMD);
        };
    }
    $scope.HR_GET_POSITION = function () {
        var PosiModelObj = new Object();
        PosiModelObj.POSITION_ID = $scope.POSITION_ID;
        PosiModelObj.STEP_NO = 1;
        PrcCommMethods.HR_API(PosiModelObj, 'HR_GET_POSITION').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.ObjectData = data.data.Table[0];
                $scope.STEP_NO = data.data.Table[0].STEP_NO;
                $scope.POSITION_ID_TEXT = data.data.Table[0].POSITION_ID_TEXT;
                //if (data.data.Table3.length > 0) {
                //    $scope.ObjectData.REPORTING_POSITION_ID = data.data.Table3[0].REPORTING_POSITION_ID;
                //};
                //$scope.PositionSearch.POSITION_ID = data.data.Table[0].POSITION_ID;
                //$scope.POSITION_ID = data.data.Table[0].POSITION_ID;
                //if ($scope.STEP_NO == 1) {

                //    if (data.data.Table3.length > 0) {
                //        $scope.PositionSearch.REPORTING_POSITION_ID = data.data.Table3[0].REPORTING_POSITION_ID;
                //    }
                if (data.data.Table1.length > 0) {
                    angular.forEach(data.data.Table1, function (val) {
                        val.IS_TRUE = true,
                            val.TABLE_ID = val.POSITION_RESPONSIBILITY_ID,
                            val.IS_SELECTED = true,
                            val.REMOVE_FLAG = 0
                        var List = data.data.Table2.filter(function (x) { return x.POSITION_RESPONSIBILITY_ID == val.POSITION_RESPONSIBILITY_ID });
                        if (List.length > 0) {
                            val.TASK_MASTER = [];
                            var TaskId = "";
                            List.filter(function (x) {
                                val.IS_TRUE = true;
                                if (TaskId == "") {
                                    TaskId = x.TASK_ID;
                                }
                                else {
                                    TaskId = TaskId + "," + x.TASK_ID;
                                }
                                x.IS_TRUE = true
                            })
                            val.TASK_IDS = TaskId;
                            val.TASK_MASTER = List;
                        }
                    })
                    $scope.HR_POSITION_RESPONSIBILITY = data.data.Table1;
                }
                //  }
                $scope.COLMD = 'col-md-4'
                $scope.$parent.GET_CUSTOM_APP_FIELD_MAPPING(2, $scope.COLMD);

                //if ($scope.STEP_NO == 2) {
                //    $scope.PositionSearch_2.ENTITY_ID = data.data.Table[0].ENTITY_ID;
                //    $scope.PositionSearch_2.COST_CENTER_ID = data.data.Table[0].COST_CENTER_ID;
                //    $scope.PositionSearch_2.LOCATION_ID = data.data.Table[0].LOCATION_ID;
                //    $scope.PositionSearch_2.BRANCH_ID = data.data.Table[0].BRANCH_ID;
                //    $scope.PositionSearch_2.EMP_CATEGORY_ID = data.data.Table[0].EMP_CATEGORY_ID;
                //    $scope.PositionSearch_2.EMP_SUB_CATE_ID = data.data.Table[0].EMP_SUB_CATE_ID;
                //    $scope.GET_LOCATION_BRANCHES();
                //    $scope.SUB_GET_EMPLOYEE_CATEGORY();
                //}
                //if ($scope.STEP_NO == 3) {
                //    $scope.PositionSearch_3 = data.data.Table[0];
                //}
            }
            else {
                $scope.STEP_FLAG = 1;
            }
        });

    };

    $scope.COMMON_PAGE_LOAD_FY();

    //if ($scope.POSITION_ID > 0) {
    //    $scope.HR_GET_POSITION();
    //    $scope.TxtSucEdit = "Edit";
    //} else {
    //    $scope.TxtSucEdit = "Add";
    //    $scope.STEP_FLAG = 1; $scope.COLMD = 'col-md-4'
    //    $scope.$parent.GET_CUSTOM_APP_FIELD_MAPPING(2, $scope.COLMD);
    //};

    $scope.GET_ENTITIES = function () {
        var PosiModelObj = new Object();
        PosiModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        PrcCommMethods.HR_API(PosiModelObj, 'GET_ENTITIES').then(function (data) {
            $scope.ENTITIES = data.data.Table;
        });
    };
    $scope.GET_LOCATION_BRANCHES = function () {
        var PosiModelObj = new Object();
        PosiModelObj.LOCATION_ID = $scope.PositionSearch_2.LOCATION_ID;
        PrcCommMethods.HR_API(PosiModelObj, 'GET_LOCATION_BRANCHES').then(function (data) {
            $scope.LOCATION_BRANCHES = data.data.Table;
        });
    };
    $scope.GET_EMPLOYEE_CATEGORY = function (FLAG) {
        var PosiModelObj = new Object();
        PosiModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        PosiModelObj.CAT_LEVEL = 1;
        PosiModelObj.MODULE_ID = 2;
        PosiModelObj.PARENT_ID = 0;
        PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));;
        PrcCommMethods.HR_API(PosiModelObj, 'GET_EMPLOYEE_CATEGORY').then(function (data) {
            $scope.EMPLOYEE_CATEGORY = data.data.Table;
        });
    };

    $scope.SUB_GET_EMPLOYEE_CATEGORY = function () {
        var PosiModelObj = new Object();
        PosiModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        PosiModelObj.CAT_LEVEL = 2;
        PosiModelObj.MODULE_ID = 2;
        PosiModelObj.PARENT_ID = $scope.PositionSearch_2.EMP_CATEGORY_ID;
        PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PrcCommMethods.HR_API(PosiModelObj, 'GET_EMPLOYEE_CATEGORY').then(function (data) {
            $scope.SUB_EMPLOYEE_CATEGORY = data.data.Table;
        });
    };
    $scope.HR_GET_DIVISION = function () {
        var PosiModelObj = new Object();
        PosiModelObj.DIVISION_NAME = $scope.PositionSearch.DIVISION_NAME;
        PosiModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        PosiModelObj.PAGE_NO = 1;
        PosiModelObj.PAGE_SIZE = 50;
        PrcCommMethods.HR_API(PosiModelObj, 'HR_GET_DIVISION').then(function (data) {
            $scope.DIVISION = data.data.Table;
        });
    };
    $scope.GET_HR_PROBATION_MASTER = function () {
        var PosiModelObj = new Object();
        PosiModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        PosiModelObj.ENTITY_ID = 0;
        PosiModelObj.ACTIVE = 1;
        PosiModelObj.PAGE_NO = 0;
        PosiModelObj.PAGE_SIZE = 0;
        PrcCommMethods.ADMIN_API(PosiModelObj, 'GET_HR_PROBATION_MASTER').then(function (data) {
            $scope.PROBATION_MASTER = data.data.Table;
        });
    };
    //  $scope.GET_HR_PROBATION_MASTER();
    // $scope.HR_GET_DIVISION();
    //$scope.HR_GET_DEPARTMENTS();
    //  $scope.GET_LOCATION();
    // $scope.GET_EMPLOYEE_CATEGORY(1);
    //$scope.GET_HR_COST_CENTER();
    //$scope.HR_GET_CONTRACT_TYPE();
    // $scope.HR_GET_WORK_PATTERNS();
    //HR_GET_POSITION_LIST
    // $scope.HR_GET_POSITION_LIST();
    // $scope.GET_ENTITIES();
    $scope.TASK_MASTER = [];
    $scope.GET_TASK_MASTER = function () {
        var PosiModelObj = new Object();
        PosiModelObj.TASK_MASTER_ID = "";
        PosiModelObj.TASK_NAME = "";
        PosiModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        PosiModelObj.PAGE_NO = 1;
        PosiModelObj.PAGE_SIZE = 100;
        PrcCommMethods.HR_API(PosiModelObj, 'GET_TASK_MASTER').then(function (data) {
            $scope.TASK_MASTER = data.data.Table;
        });
    };
    $scope.GET_TASK_MASTER();
    $scope.TSK = {
        submitted: false,
    };
    $scope.HR_INS_UPD_TASK_MASTER = function () {
        $scope.TSK.submitted = true;
        if ($scope.TaksForm.$valid) {
            var PosiModelObj = new Object();
            PosiModelObj.TASK_MASTER_ID = "";
            PosiModelObj.TASK_NAME = $scope.TASK_NAME;
            PosiModelObj.TASK_DESC = $scope.TASK_DESC;
            PosiModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
            PosiModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.HR_API(PosiModelObj, 'HR_INS_UPD_TASK_MASTER').then(function (data) {
                $scope.GET_TASK_MASTER();
                $scope.TASK_NAME = "";
                $scope.$parent.ShowAlert('Success', 'Added Successfully', 3000);
                $scope.TSK.submitted = false;
                $('#Add_Task').modal('hide');
            });
        }
    };
    $scope.POP_ADD_TASK = function () {
        $('#Add_Task').modal('show');
    };
    $scope.HR_POSITION_RESPONSIBILITY = [];
    $scope.HR_POSITION_RESPONSIBILITY_DELETE = [];
    $scope.DELETE_RESPONSIBILITY = function (index, LINE) {
        if (confirm("Are you Sure?")) {
            if (LINE.TABLE_ID == 0) {
                $scope.HR_POSITION_RESPONSIBILITY.splice(index, 1);
            }
            else {
                $scope.HR_POSITION_RESPONSIBILITY_DELETE.push(angular.copy(LINE));
                $scope.HR_POSITION_RESPONSIBILITY.splice(index, 1);
            }
        }

    };
    $scope.DELETE_TASK = function (item) {
        if (confirm("Are you Sure?")) {
            item.IS_SELECTED = false;
            item.IS_TRUE = false;
        }
    };

    $scope.EDIT_FLAG = 0;
    $scope.POP_ADD_RESPONSIBILITY = function (LIST, EDIT_FLAG, index) {
        $scope.EDIT_FLAG = 0;
        $('#Add_Responsibility').modal('show');
        $scope.RESPONSIBILITY_NAME = "";
        $scope.RESPONSIBILITY_DESCRIPTION = "";
        $scope.TASK_MASTER.filter(function (x) { x.IS_SELECTED = false });
        if (EDIT_FLAG == 1) {
            $scope.EDIT_FLAG = 1;
            //LIST.EDIT_FLAG = 1;
            $scope.EDIT_FLAG_CURRENT_INDEX = index;
            $scope.RESPONSIBILITY_NAME = LIST.RESPONSIBILITY_NAME
            $scope.RESPONSIBILITY_DESCRIPTION = LIST.RESPONSIBILITY_DESCRIPTION
            angular.forEach($scope.TASK_MASTER, function (val) {
                val.IS_SELECTED = false;
                var Ln = LIST.TASK_MASTER.filter(function (x) { return val.TASK_ID == x.TASK_ID && x.IS_TRUE == true })
                if (Ln.length > 0) {
                    val.IS_SELECTED = true;
                }
            })
        }
    };
    $scope.ADD_RESPONSIBILITY = function (FLAG) {
        var str = 'Added'
        $scope.Taskcount = 1;
        $scope.AddResform.submitted = true;


        //angular.forEach($scope.TASK_MASTER, function (val) {
        //    if (val.IS_SELECTED) {
        //        $scope.Taskcount++;
        //    }
        //});
        if ($scope.AddResform.$valid && $scope.Taskcount > 0) {
            if ($scope.EDIT_FLAG == 1) {
                str = 'Update'
                $scope.EDIT_FLAG = 0;
                var TaskId = "";
                angular.forEach($scope.TASK_MASTER, function (val) {
                    val.IS_TRUE = false;
                    if (val.IS_SELECTED) {
                        val.IS_TRUE = true;
                        if (TaskId == "") {
                            TaskId = val.TASK_ID;
                        }
                        else {
                            TaskId = TaskId + "," + val.TASK_ID;
                        }
                    }
                });
                $scope.HR_POSITION_RESPONSIBILITY[$scope.EDIT_FLAG_CURRENT_INDEX].RESPONSIBILITY_NAME = $scope.RESPONSIBILITY_NAME;
                $scope.HR_POSITION_RESPONSIBILITY[$scope.EDIT_FLAG_CURRENT_INDEX].RESPONSIBILITY_DESCRIPTION = $scope.RESPONSIBILITY_DESCRIPTION;
                $scope.HR_POSITION_RESPONSIBILITY[$scope.EDIT_FLAG_CURRENT_INDEX].TaskId = TaskId;
                $scope.HR_POSITION_RESPONSIBILITY[$scope.EDIT_FLAG_CURRENT_INDEX].TASK_MASTER = angular.copy($scope.TASK_MASTER);
                $scope.HR_POSITION_RESPONSIBILITY[$scope.EDIT_FLAG_CURRENT_INDEX].EDIT_FLAG = 0;
                $scope.TASK_MASTER.filter(function (x) { x.IS_SELECTED = false; });
                $scope.RESPONSIBILITY_NAME = "";
                $scope.RESPONSIBILITY_DESCRIPTION = "";
                $scope.AddResform.submitted = false;
                $scope.$parent.ShowAlert('Success', str + ' Successfully  ', 3000);
            }
            else {
                var TaskId = "";
                angular.forEach($scope.TASK_MASTER, function (val) {
                    val.IS_TRUE = false;
                    if (val.IS_SELECTED) {
                        val.IS_TRUE = true;
                        if (TaskId == "") {
                            TaskId = val.TASK_ID;
                        }
                        else {
                            TaskId = TaskId + "," + val.TASK_ID;
                        }
                    }
                });
                $scope.HR_POSITION_RESPONSIBILITY.push({ TABLE_ID: 0, RESPONSIBILITY_NAME: $scope.RESPONSIBILITY_NAME, RESPONSIBILITY_DESCRIPTION: $scope.RESPONSIBILITY_DESCRIPTION, TASK_IDS: TaskId, REMOVE_FLAG: 0, TASK_MASTER: angular.copy($scope.TASK_MASTER) });
                $scope.RESPONSIBILITY_NAME = "";
                $scope.RESPONSIBILITY_DESCRIPTION = "";
                $scope.AddResform.submitted = false;
                $scope.TASK_MASTER.filter(function (x) { x.IS_SELECTED = false; })
                $scope.$parent.ShowAlert('Success', 'Successfully  ' + str, 3000);
            }
            if (FLAG == 1) { $('#Add_Responsibility').modal('hide'); };
        }
        else {
            if ($scope.Taskcount == 0) {
                $scope.$parent.ShowAlert('Error', 'Please Select Task', 30000);
            }
        }

    };
    $scope.DisplayDetails = function (SelectedLine) {
        SelectedLine.TrBackColor == '#bcffd8' ? SelectedLine.TrBackColor = '' : SelectedLine.TrBackColor = '#bcffd8';
        if (SelectedLine.ShowDetails) {
            SelectedLine.ShowDetails = false;
        }
        else {
            SelectedLine.ShowDetails = true;
        }
    };
    $scope.HR_INS_UPD_POSITIONS_STEP_1 = function (FLAG) {
        $scope.CustomForm.submitted = true;
        if ($scope.CustomForm.$valid) {
            var PosiModelObj = new Object();
            var IsValidCount = 0;
            angular.forEach($scope.$parent.CUSTOM_FIELDS_LIST, function (val) {
                if (val.FIELD_TYPE_ID == 6) {
                    val.FIELD_VALUE = val.FIELD_VALUE ? 1 : 0
                }
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
                PosiModelObj[val.NG_MODEL] = val.FIELD_VALUE;
                //if (val.FIELD_MASTER_ID == 24) {
                //    PosiModelObj.REPORTING_POSITION_ID = val.FIELD_VALUE;
                //}
            });
            PosiModelObj.POSITION_ID = $scope.POSITION_ID;
            PosiModelObj.TOP_POSITION = PosiModelObj.REPORTING_POSITION_ID == -1 ? 1 : 0;
            PosiModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PosiModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
            PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            PosiModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
            PosiModelObj.HR_POSITION_RESPONSIBILITY = [];
            var HR_POSITION_RESPONSIBILITY = [];
            if ($scope.HR_POSITION_RESPONSIBILITY.length > 0) {
                //$scope.HR_POSITION_RESPONSIBILITY.push({ TABLE_ID: 0, RESPONSIBILITY_NAME: $scope.RESPONSIBILITY_NAME, RESPONSIBILITY_DESCRIPTION: $scope.RESPONSIBILITY_DESCRIPTION, TASK_IDS: TaskId, REMOVE_FLAG: 0, TASK_MASTER: angular.copy($scope.TASK_MASTER) });
                angular.forEach($scope.HR_POSITION_RESPONSIBILITY, function (x) {
                    var obj = new Object();
                    obj.TABLE_ID = x.TABLE_ID == undefined || x.TABLE_ID == null || x.TABLE_ID == '' ? 0 : x.TABLE_ID;
                    obj.RESPONSIBILITY_NAME = x.RESPONSIBILITY_NAME;
                    obj.RESPONSIBILITY_DESCRIPTION = x.RESPONSIBILITY_DESCRIPTION;
                    var Task = "";
                    angular.forEach(x.TASK_MASTER, function (TAK) {
                        if (TAK.IS_TRUE) {
                            if (Task == "") {
                                Task = TAK.TASK_ID;
                            }
                            else {
                                Task = Task + "," + TAK.TASK_ID;
                            }
                        }
                    });
                    obj.TASK_IDS = Task;
                    obj.REMOVE_FLAG = 0;
                    HR_POSITION_RESPONSIBILITY.push(obj);
                });
                PosiModelObj.HR_POSITION_RESPONSIBILITY = HR_POSITION_RESPONSIBILITY;
                if ($scope.HR_POSITION_RESPONSIBILITY_DELETE.length > 0) {
                    angular.forEach($scope.HR_POSITION_RESPONSIBILITY_DELETE, function (x) {
                        var obj = new Object();
                        obj.TABLE_ID = x.TABLE_ID;
                        obj.RESPONSIBILITY_NAME = "";
                        obj.RESPONSIBILITY_DESCRIPTION = "";
                        obj.TASK_IDS = "";
                        obj.REMOVE_FLAG = 1;
                        HR_POSITION_RESPONSIBILITY.push(obj);
                    });
                }
            }
            else {
                if ($scope.HR_POSITION_RESPONSIBILITY_DELETE.length > 0) {
                    angular.forEach($scope.HR_POSITION_RESPONSIBILITY_DELETE, function (x) {
                        var obj = new Object();
                        obj.TABLE_ID = x.TABLE_ID;
                        obj.RESPONSIBILITY_NAME = "";
                        obj.RESPONSIBILITY_DESCRIPTION = "";
                        obj.TASK_IDS = "";
                        obj.REMOVE_FLAG = 1;
                        HR_POSITION_RESPONSIBILITY.push(obj);
                    });
                    PosiModelObj.HR_POSITION_RESPONSIBILITY = HR_POSITION_RESPONSIBILITY;
                }
                else {
                    PosiModelObj.HR_POSITION_RESPONSIBILITY.push({ TABLE_ID: -1, RESPONSIBILITY_NAME: "", RESPONSIBILITY_DESCRIPTION: "", TASK_IDS: "", REMOVE_FLAG: 0 });
                }
            }
            if (IsValidCount == 0) {
                $scope.CustomForm.submitted = false;
                PrcCommMethods.CASHUP_API(PosiModelObj, 'POSITION_RESPONSIBILITY').then(function (data) {
                    if (data.data.Table.length > 0 && data.data.Table[0].POSITION_ID == -1) {
                        $scope.$parent.ShowAlert('Error', 'Position already exist', 5000);
                        $scope.$parent.overlay_loadingNew = 'none';
                    }
                    else if (data.data.Table.length > 0) {
                        $scope.$parent.ShowAlert('Success', 'Position  ' + $scope.TxtSucEdit + ' Successfully', 5000);
                        $scope.PositionSearch.POSITION_ID = data.data.Table[0].POSITION_ID;
                        $scope.PositionSearch.POSITION_TEXT = data.data.Table[0].POSITION_ID_TEXT;
                        $scope.STEP_FLAG = 2;
                        if (FLAG == 1) {
                            $location.path('Pst_Lst')
                        }
                        else {
                            $location.path('AddpositionEmpdtl').search('PId', data.data.Table[0].POSITION_ID).search('STG', 2)
                        }
                    }
                });
            }
            else {

            }
        }
    };

    $scope.GO_BACK = function (FLAG) {
        $scope.STEP_FLAG = FLAG;
        $scope.STEP_NO = FLAG;
        $scope.HR_GET_POSITION()
    };
    $scope.GO_BACK_TO_LIST = function (FLAG) {
        $location.path('team')
    };
    $scope.CAL_FTE = function () {
        if (isNaN($scope.PositionSearch_3.WEEKLY_HOURS)) {
        }
        else {
            $scope.PositionSearch_3.FTE = (parseFloat($scope.PositionSearch_3.WEEKLY_HOURS) / parseFloat($scope.FTE_CAL)).toFixed(2);
        }
    };
    $scope.POP_ADD_WORK_PATTERN = function () {
        $('#Add_workptn').modal('show');
        $scope.HR_GET_WORK_PATTERN_TYPES();
        $scope.HR_GET_SHIFTS()
    };
    $scope.NG_SHIFT_CHANGES = function (List, SHIFT_ID, index) {
        var index = index + 1;
        var item = $scope.SHIFTS.filter(function (x) { return x.SHIFT_ID == SHIFT_ID });
        List.START_TIME = item[0].START_TIME;
        List.END_TIME = item[0].END_TIME;
        List.PAID_BREAK = item[0].PAID_BREAK;
        List.UN_PAID_BREAK = item[0].UN_PAID_BREAK;
    };
    $scope.HR_INS_UPD_WORK_PATTERNS = function () {
        $scope.WrkForm.submitted = true;
        if ($scope.WrkForm.$valid) {
            var PosiModelObj = new Object();
            PosiModelObj.WORK_PATTERN_ID = 0;
            PosiModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
            PosiModelObj.WORK_PATTERN_CODE = $scope.WrkPtnSearch.WORK_PATTERN_CODE;
            PosiModelObj.WORK_PATTERN_NAME = $scope.WrkPtnSearch.WORK_PATTERN_NAME
            PosiModelObj.WORK_PATTERN_DESC = $scope.WrkPtnSearch.WORK_PATTERN_DESC
            PosiModelObj.WORK_PATTERN_TYPE_ID = $scope.WrkPtnSearch.WORK_PATTERN_TYPE_ID
            PosiModelObj.ACTIVE = 1;
            PosiModelObj.USER_ID = parseInt($cookies.get("USERID"));
            if ($scope.SHIFT_LIST.length > 0) {
                PosiModelObj.HR_SHIFT_SCHEDULE = $scope.SHIFT_LIST;
            }
            PrcCommMethods.HR_API(PosiModelObj, 'HR_INS_UPD_WORK_PATTERNS').then(function (data) {
                //if (data.data == 1) {
                $scope.$parent.ShowAlert('Success', 'Work Patterns Added Successfully', 5000);
                $scope.HR_GET_WORK_PATTERNS();
                $('#Add_workptn').modal('hide');
                //  }
            });
        }
    };
    $scope.$parent.child_scope = $scope;
});
app.controller('PositionListController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.COMMON_CODE_CHANGE();
    $scope.PositionSearch = {
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        IS_EDIT_POSITION: $scope.$parent.CHECK_MODULE_ACCESS(2, 3),
    };

    $scope.IS_DEPARTMENT_FLAG = $scope.$parent.GET_ENTITY_SETTINGS(31)[0].SETTING_VALUE == "1" ? true : false;
    $scope.IS_POSITION_FLAG = $scope.$parent.GET_ENTITY_SETTINGS(32)[0].SETTING_VALUE == "1" ? true : false;

    $scope.$parent.SCROLL_TOP();
    $scope.ResetPostion = function () {
        $scope.PositionSearch = {
            PAGE_NO: 1,
            PAGE_SIZE: 10,
            IS_EDIT_POSITION: $scope.$parent.CHECK_MODULE_ACCESS(2, 3),
        }
    };

    $scope.HEADER_PST_LIST = [];

    if ($scope.IS_POSITION_FLAG) {
        $scope.HEADER_PST_LIST = [
            { NAME: "Position ID", ID: 1, CLASS_NAME: 'text-nowrap' },
            { NAME: "Position", ID: 2, CLASS_NAME: 'text-nowrap' },
            { NAME: "Employee Count", ID: 7, CLASS_NAME: 'text-nowrap' },
            { NAME: "Status", ID: 8, CLASS_NAME: '' }];

    }
    else {
        $scope.HEADER_PST_LIST = [
            { NAME: "Position ID", ID: 1, CLASS_NAME: 'text-nowrap' },
            { NAME: "Position", ID: 2, CLASS_NAME: 'text-nowrap' },
            { NAME: "Reporting Position ID", ID: 3, CLASS_NAME: 'text-nowrap' },
            { NAME: "Reporting Position", ID: 4, CLASS_NAME: 'text-nowrap' },
            { NAME: "Department", ID: 5, CLASS_NAME: 'text-nowrap' },
            { NAME: "Branch", ID: 6, CLASS_NAME: 'text-nowrap' },
            { NAME: "Employee Count", ID: 7, CLASS_NAME: 'text-nowrap' },
            { NAME: "Status", ID: 8, CLASS_NAME: '' }];

    }

    
    $scope.STATUS = [{ ID: 0, NAME: 'ALL' }, { ID: 2, NAME: 'Active' }, { ID: 1, NAME: 'InActive' }];

    $scope.Positionsearch = {};
    $scope.POSITIONS_RESET = function () {
        $scope.Positionsearch = {
        };
        $scope.GET_POSITIONS(1, 1, false);
        $scope.PostionForm.submitted = false;
    }
    $scope.POSITIONS_CANCEL = function () {
        $('#AddPosition').modal('hide');
    }

    $scope.HR_INS_UPD_POSITIONS = function () {
        $scope.PostionForm.submitted = true;
        if ($scope.PostionForm.$valid) {
            var EmpModelObj = new Object();
            EmpModelObj.POSITION_ID = $scope.Positionsearch.POSITION_ID;
            EmpModelObj.POSITION_TITLE = $scope.Positionsearch.POSITION_TITLE;
            EmpModelObj.IS_MANAGER_POSITION = $scope.Positionsearch.IS_MANAGER_POSITION ? 1 : 0;
            EmpModelObj.IS_ADMIN_POSITION = $scope.Positionsearch.IS_ADMIN_POSITION ? 1 : 0;

            EmpModelObj.USER_ID = parseInt($cookies.get("USERID"));
            EmpModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
            EmpModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            PrcCommMethods.HR_API(EmpModelObj, 'HR_INS_UPD_POSITIONS').then(function (data) {
                if (data.data == 0) {
                    $scope.$parent.ShowAlert('Error', $scope.SOMETHINGWENTWRONG, 5000);
                }
                if (data.data == -1) {
                    $scope.$parent.ShowAlert('Error', "Position already existed", 5000);
                }
                else {
                    $('#AddPosition').modal('hide');
                    $scope.POSITIONS_RESET();
                }
            });

        }
    }
    $scope.GET_POSITION_LAZY_LOAD = function () {
        $scope.GET_POSITIONS(2, $scope.SORT_COLUMN_NO, $scope.SORT_ORDER_NO_ASCDESC);
    };
    $scope.RedirectiononPosition = function (LINE, STEP_NO) {
        if ($scope.IS_POSITION_FLAG) {
            $('#AddPosition').modal('show');
            $scope.Positionsearch.POSITION_ID = LINE.POSITION_ID;
            $scope.Positionsearch.POSITION_TITLE = LINE.POSITION_TITLE;
            $scope.Positionsearch.IS_MANAGER_POSITION = LINE.IS_MANAGER_POSITION    
            $scope.Positionsearch.IS_ADMIN_POSITION = LINE.IS_ADMIN_POSITION 
        }
        else {
            window.location.href = '../DashBoard/hrIndex#!/Addposition?x=1&PId=' + LINE.POSITION_ID + '&STG=1';
        }

        

    };
    $scope.BRANCH_LIST = [];
    $scope.ADMIN_GET_BRANCH = function () {
        var BrnModelObj = new Object();
        BrnModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        BrnModelObj.BRANCH_CODE = '';
        BrnModelObj.BRANCH_NAME = '';
        BrnModelObj.CONTACT_NAME = '';
        BrnModelObj.LOCATION_IDS = '';
        BrnModelObj.ACTIVE = 1;
        BrnModelObj.PAGE_NO = 1;
        BrnModelObj.PAGE_SIZE = 999;
        BrnModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.ADMIN_API(BrnModelObj, 'ADMIN_GET_BRANCH').then(function (data) {
            $scope.BRANCH_LIST = data.data.Table;
        });
    };
    //  $scope.ADMIN_GET_BRANCH();

    $scope.GET_POSITIONS = function (FLAG, SORT_COLUMN_NO, SORT_ORDER_NO_ASCDESC) {
        if (SORT_COLUMN_NO != 0) {
            $scope.SORT_COLUMN_NO = SORT_COLUMN_NO;
            $scope.SORT_ORDER_NO_ASCDESC = SORT_ORDER_NO_ASCDESC;
            if (FLAG == 1) {
                $scope.POSITIONS_LIST = [];
                $scope.PositionSearch.PAGE_NO = 1;
            }
            var POSModelObj = new Object();
            POSModelObj.DEPARTMENT_NAME = $scope.PositionSearch.DEPARTMENT_NAME;
            POSModelObj.JOB_DESCRIPTION = $scope.PositionSearch.JOB_DESCRIPTION;
            POSModelObj.POSITION_TITLE = $scope.PositionSearch.POSITION_TITLE;
            POSModelObj.POSITION_ID_TEXT = $scope.PositionSearch.POSITION_ID_TEXT;
            POSModelObj.REPORTING_POSITION_ID_TEXT = $scope.PositionSearch.REPORTING_POSITION_ID;
            POSModelObj.REPORTING_POSITION_TITLE = $scope.PositionSearch.REPORTING_POSITION_NAME;
            POSModelObj.BRANCH_NAME = $scope.PositionSearch.BRANCH_NAME;
            POSModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
            POSModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            POSModelObj.ACTIVE = 1;
            POSModelObj.FLAG = $scope.PositionSearch.FLAG;
            POSModelObj.PAGE_NO = $scope.PositionSearch.PAGE_NO;
            POSModelObj.PAGE_SIZE = $scope.PositionSearch.PAGE_SIZE;
            POSModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
            POSModelObj.ADMIN_FLAG = $scope.$parent.CheckSubModuleAccess(47) ? 1 : 2;
            POSModelObj.SORT_COLUMN_NO = SORT_COLUMN_NO;
            POSModelObj.SORT_ORDER_NO = SORT_ORDER_NO_ASCDESC ? 1 : -1;//1 FOR ASC -1 FOR DESC
            if (FLAG == 1) { $scope.POSModelObj_Copy = angular.copy(POSModelObj); }
            else {
                $scope.POSModelObj_Copy.PAGE_NO = FLAG == 2 ? angular.copy($scope.PositionSearch.PAGE_NO) : $scope.POSModelObj_Copy.PAGE_NO;
            }
            PrcCommMethods.HR_API(FLAG == 2 ? $scope.POSModelObj_Copy : POSModelObj, 'HR_GET_POSITION_LIST').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.POSITIONS_LIST = $scope.POSITIONS_LIST.concat(data.data.Table);
                    if (data.data.Table.length < $scope.PositionSearch.PAGE_SIZE) {
                        $scope.GetData = false;
                    }
                    else {
                        $scope.PositionSearch.PAGE_NO = parseInt($scope.PositionSearch.PAGE_NO) + 1;
                        $scope.GetData = true;
                    }
                }
                else {
                    if ($scope.POSITIONS_LIST.length == 0) {
                    }
                    $scope.GetData = false;
                }

            });
        }
    };
    $scope.GET_POSITIONS(1, 1, false);
})
app.controller('EmployeeDtlController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $('.modal-backdrop').removeClass('modal-backdrop fade show');
    $scope.COMMON_CODE_CHANGE();
    $scope.$parent.SCROLL_TOP();
    $scope.POSITION_ID = getUrlParameter('PId', $location.absUrl());
    $scope.STEP_FLAG = 2//getUrlParameter('STG', $location.absUrl());
    $scope.IS_ACCESS_ADD_MORE_FEILD = $scope.$parent.CheckSubModuleAccess(117);
    $scope.$parent.overlay_loadingNew = 'block';
    $scope.PositionSearch_2 = {
        POSITION_ID: null,
        COMPANY_ID: null,
        DEPARTMENT_ID: null,
        DIVISION_ID: null,
        COST_CENTER_ID: null,
        LOCATION_ID: null,
        BRANCH_ID: null,
        AREA_ID: null,
        EMP_CATEGORY_ID: null,
        EMP_SUB_CATE_ID: null,
        PAGE_NO: 1,
        PAGE_SIZE: 10,
    };

    $scope.GET_HR_COST_CENTER = function (CUSTOM_FIELD) {
        var PosiModelObj = new Object();
        PosiModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PosiModelObj.ACTIVE = 1;
        PosiModelObj.PAGE_NO = 0;
        PosiModelObj.PAGE_SIZE = 0;
        PrcCommMethods.ADMIN_API(PosiModelObj, 'ADMIN_GET_COST_CENTER').then(function (data) {
            if (data.data.Table.length > 0) {
                CUSTOM_FIELD.OPTION_LIST = data.data.Table;
            }
            else {
                CUSTOM_FIELD.OPTION_LIST = [];
            }
        });
    };

    $scope.GET_LOCATION = function (CUSTOM_FIELD) {
        var PosiModelObj = new Object();
        PosiModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PosiModelObj.ACTIVE = 1;
        PosiModelObj.PAGE_NO = 0;
        PrcCommMethods.ADMIN_API(PosiModelObj, 'ADMIN_GET_LOCATION').then(function (data) {
            // $scope.LOCATION = data.data.Table;
            if (data.data.Table.length > 0) {
                CUSTOM_FIELD.OPTION_LIST = data.data.Table;
            }
            else {
                CUSTOM_FIELD.OPTION_LIST = [];
            }
        });
    };
    $scope.GET_GROUP_MAPPING = function (CUSTOM_FIELD) {

        var PosiModelObj = new Object();
        PosiModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        PosiModelObj.ENTITY_IDS = parseInt($cookies.get("ENTITY_ID"));

        var index_42 = $scope.$parent.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 42);
        var index_43 = $scope.$parent.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 43);
        var index_44 = $scope.$parent.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 44);
        var index_45 = $scope.$parent.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 45);
        var index_46 = $scope.$parent.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 46);

        PosiModelObj.COST_CENTER_IDS = $scope.$parent.CUSTOM_FIELDS_LIST[index_42].FIELD_VALUE == null ? '' : $scope.$parent.CUSTOM_FIELDS_LIST[index_42].FIELD_VALUE;
        PosiModelObj.LOCATION_IDS = $scope.$parent.CUSTOM_FIELDS_LIST[index_43].FIELD_VALUE == null ? '' : $scope.$parent.CUSTOM_FIELDS_LIST[index_43].FIELD_VALUE;
        PosiModelObj.BRANCH_IDS = $scope.$parent.CUSTOM_FIELDS_LIST[index_44].FIELD_VALUE == null ? '' : $scope.$parent.CUSTOM_FIELDS_LIST[index_44].FIELD_VALUE;
        PosiModelObj.CATEGORY_IDS = $scope.$parent.CUSTOM_FIELDS_LIST[index_45].FIELD_VALUE == null ? '' : $scope.$parent.CUSTOM_FIELDS_LIST[index_45].FIELD_VALUE;
        PosiModelObj.SUB_CATEGORY_IDS = $scope.$parent.CUSTOM_FIELDS_LIST[index_46].FIELD_VALUE == null ? '' : $scope.$parent.CUSTOM_FIELDS_LIST[index_46].FIELD_VALUE;
        //PosiModelObj.AREA_IDS = $scope.$parent.CUSTOM_FIELDS_LIST[index_45].FIELD_VALUE;
        //PosiModelObj.AREA_IDS = $scope.$parent.CUSTOM_FIELDS_LIST[index_45].FIELD_VALUE;

        if ($scope.STEP_NO >= 2) {
            PosiModelObj.POSITION_IDS = $scope.POSITION_ID;
        }
        if ($scope.STEP_NO == null) {
            PosiModelObj.POSITION_IDS = '';
        }
        PosiModelObj.ACTIVE = 1;
        PosiModelObj.PAGE_NO = 0;
        PosiModelObj.MODULE_ID = 2;
        PrcCommMethods.ADMIN_API(PosiModelObj, 'GET_GROUP_MAPPING').then(function (data) {
            $scope.GROUP_MAPPING_LIST = data.data.Table;
        });
    };
    $scope.HR_GET_CONTRACT_TYPE = function (CUSTOM_FIELD) {
        var PosiModelObj = new Object();
        PosiModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        PrcCommMethods.HR_API(PosiModelObj, 'GET_CONTRACT_TYPE').then(function (data) {
            //$scope.CONTRACT_TYPE = data.data.Table;
            if (data.data.Table.length > 0) {
                CUSTOM_FIELD.OPTION_LIST = data.data.Table;
            }
            else {
                CUSTOM_FIELD.OPTION_LIST = [];
            }
        });
    };
    $scope.HR_GET_WORK_PATTERN_TYPES = function () {
        var PosiModelObj = new Object();
        PrcCommMethods.HR_API(PosiModelObj, 'HR_GET_WORK_PATTERN_TYPES').then(function (data) {
            $scope.WORK_PATTERN_TYPES = data.data.Table;
        });
    };
    $scope.GET_ENTITIES = function () {
        var PosiModelObj = new Object();
        PosiModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        PrcCommMethods.HR_API(PosiModelObj, 'GET_ENTITIES').then(function (data) {
            $scope.ENTITIES = data.data.Table;
        });
    };
    $scope.GET_LOCATION_BRANCHES = function (PREVIOUS_FIELD, CUSTOM_FIELD) {
        var PosiModelObj = new Object();
        PosiModelObj.LOCATION_ID = PREVIOUS_FIELD.FIELD_VALUE;
        PrcCommMethods.HR_API(PosiModelObj, 'GET_LOCATION_BRANCHES').then(function (data) {
            //$scope.LOCATION_BRANCHES = data.data.Table;
            if (data.data.Table.length > 0) {
                CUSTOM_FIELD.OPTION_LIST = data.data.Table;
            }
            else {
                CUSTOM_FIELD.OPTION_LIST = [];
            }
        });
    };
    $scope.GET_EMPLOYEE_CATEGORY = function (CUSTOM_FIELD) {
        var PosiModelObj = new Object();
        PosiModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        PosiModelObj.CAT_LEVEL = 1;
        PosiModelObj.MODULE_ID = 2;
        PosiModelObj.PARENT_ID = 0;
        PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));;
        PrcCommMethods.HR_API(PosiModelObj, 'GET_EMPLOYEE_CATEGORY').then(function (data) {
            //$scope.EMPLOYEE_CATEGORY = data.data.Table;
            if (data.data.Table.length > 0) {
                CUSTOM_FIELD.OPTION_LIST = data.data.Table;
            }
            else {
                CUSTOM_FIELD.OPTION_LIST = [];
            }
        });
    };
    $scope.SUB_GET_EMPLOYEE_CATEGORY = function (PREVIOUS_FIELD, CUSTOM_FIELD) {
        // alert();
        var PosiModelObj = new Object();
        PosiModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        PosiModelObj.CAT_LEVEL = 2;
        PosiModelObj.MODULE_ID = 2;
        PosiModelObj.PARENT_ID = PREVIOUS_FIELD.FIELD_VALUE// $scope.PositionSearch_2.EMP_CATEGORY_ID;
        PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PrcCommMethods.HR_API(PosiModelObj, 'GET_EMPLOYEE_CATEGORY').then(function (data) {
            CUSTOM_FIELD.OPTION_LIST = data.data.Table;
        });
    };
    // $scope.GET_HR_PROBATION_MASTER();
    // $scope.GET_LOCATION();
    // $scope.GET_EMPLOYEE_CATEGORY(CUSTOM_FIELD,1);
    // $scope.GET_HR_COST_CENTER();
    // $scope.HR_GET_CONTRACT_TYPE();
    //$scope.GET_GROUP_MAPPING();
    // $scope.GET_ENTITIES();
    var ENTITY_NAME = $scope.ENTITY_LIST.filter(function (x) { return x.ENTITY_ID == parseInt($cookies.get("ENTITY_ID")) })[0].ENTITY_NAME;
    $scope.ENTITY_NAME = ENTITY_NAME;
    $scope.ObjectData = [];
    $scope.HR_GET_POSITION = function () {
        var PosiModelObj = new Object();
        PosiModelObj.POSITION_ID = $scope.POSITION_ID;
        PosiModelObj.STEP_NO = 2;
        PrcCommMethods.HR_API(PosiModelObj, 'HR_GET_POSITION').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.ObjectData = data.data.Table[0];
                $scope.COLMD = 'col-md-4'
                $scope.$parent.GET_CUSTOM_APP_FIELD_MAPPING(3, $scope.COLMD);
                $scope.POSITION_EMP_DTL_ID = data.data.Table[0].ID;
                $scope.STEP_NO = data.data.Table[0].STEP_NO;
            }
            else {
                $scope.STEP_FLAG = 2;
                $scope.COLMD = 'col-md-4'
                $scope.$parent.GET_CUSTOM_APP_FIELD_MAPPING(3, $scope.COLMD);
            }

        });
    };
    $scope.COMMON_PAGE_LOAD_FY = function () {
        if ($scope.POSITION_ID > 0) {
            $scope.HR_GET_POSITION();
            $scope.TxtSucEdit = "Edit";
        };
    }
    $scope.COMMON_PAGE_LOAD_FY();
    $scope.NGINIT_GROUPMAPPINGLIST = function (RL) {
        if ($scope.STEP_NO == null) {
            RL.IS_SELECTED = false;
        }
        else {
            RL.IS_SELECTED = true;
        }
    };
    
    $scope.HR_INS_UPD_POSITIONS_STEP_2 = function (FLAG) {
        $scope.CustomForm.submitted = true;
        if ($scope.CustomForm.$valid) {
            var PosiModelObj = new Object();
            var IsValidCount = 0;
            angular.forEach($scope.$parent.CUSTOM_FIELDS_LIST, function (val) {
                if (val.FIELD_TYPE_ID == 6) {
                    val.FIELD_VALUE = val.FIELD_VALUE ? 1 : 0
                }
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
                PosiModelObj[val.NG_MODEL] = val.FIELD_VALUE;
            });
            PosiModelObj.POSITION_EMP_DTL_ID = $scope.POSITION_EMP_DTL_ID;
            //PosiModelObj.COST_CENTER_ID = $scope.PositionSearch_2.COST_CENTER_ID;
            //PosiModelObj.LOCATION_ID = $scope.PositionSearch_2.LOCATION_ID;
            //PosiModelObj.BRANCH_ID = $scope.PositionSearch_2.BRANCH_ID;
            //PosiModelObj.AREA_ID = $scope.PositionSearch_2.AREA_ID;
            //PosiModelObj.EMP_CATEGORY_ID = $scope.PositionSearch_2.EMP_CATEGORY_ID;
            //PosiModelObj.EMP_SUB_CATE_ID = $scope.PositionSearch_2.EMP_SUB_CATE_ID;
            PosiModelObj.POSITION_ID = $scope.POSITION_ID;
            PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            PosiModelObj.USER_ID = parseInt($cookies.get("USERID"));
            var i = '';
            var Remove = '';
            angular.forEach($scope.GROUP_MAPPING_LIST, function (val) {
                if (val.IS_SELECTED) {
                    if (i == '') {
                        i = val.GROUP_MASTER_ID;
                    }
                    else {
                        i = i + ',' + val.GROUP_MASTER_ID;
                    }
                }
                if (!val.IS_SELECTED) {
                    if (Remove == '') {
                        Remove = val.GROUP_MASTER_ID;
                    }
                    else {
                        Remove = Remove + ',' + val.GROUP_MASTER_ID;
                    }
                }
            });

            PosiModelObj.GROUP_IDS_ADD = i;
            PosiModelObj.GROUP_IDS_REMOVE = Remove;
            $scope.CustomForm.submitted = false;
            if (IsValidCount == 0) {
                PrcCommMethods.HR_API(PosiModelObj, 'HR_INS_UPD_POSITIONS_STEP_2').then(function (data) {
                    $scope.$parent.ShowAlert('Success', 'Position  ' + $scope.TxtSucEdit + ' Successfully', 5000);
                    $scope.STEP_FLAG = 3;
                    if (FLAG == 1) {
                        $location.path('Pst_Lst')
                    }
                    else {
                        $location.path('AddpositionCntdtls').search('STG', 3)
                    }
                });
            }
        }
    };
    $scope.GO_BACK = function (FLAG) {
        $location.path('Addposition').search('STG', 1)
    };
    $scope.GO_BACK_TO_LIST = function (FLAG) {
        $location.path('team')
    };
    $scope.$parent.child_scope = $scope;
});
app.controller('ContractController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $('.modal-backdrop').removeClass('modal-backdrop fade show');
    $scope.COMMON_CODE_CHANGE();
    $scope.$parent.SCROLL_TOP();
    $scope.$parent.overlay_loadingNew = 'block';
    $scope.YESNO = [{ ID: 1, NAME: "Yes" }, { ID: 2, NAME: "No" }];
    $scope.POSITION_ID = getUrlParameter('PId', $location.absUrl());
    $scope.STEP_FLAG = 3;// getUrlParameter('STG', $location.absUrl());
    $scope.IS_ACCESS_ADD_MORE_FEILD = $scope.$parent.CheckSubModuleAccess(117);
    // $scope.STEP_NO = 2;
    $scope.NO_OF_SHIFTS_PER_LIST = [{ ID: 1, NAME: "1" }, { ID: 2, NAME: "2" }, { ID: 3, NAME: "3" }
        , { ID: 4, NAME: "4" }
        , { ID: 5, NAME: "5" }
        , { ID: 6, NAME: "6" }
        , { ID: 7, NAME: "7" }

    ];
    $scope.PositionSearch_3 = {
        POSITION_ID: null,
        COMPANY_ID: null,
        DEPARTMENT_ID: null,
        DIVISION_ID: null,
        COST_CENTER_ID: null,
        LOCATION_ID: null,
        BRANCH_ID: null,
        AREA_ID: null,
        PROBATION_PERIOD_ID: null,
        EMP_CATEGORY_ID: null,
        EMP_SUB_CATE_ID: null,
        PAGE_NO: 1,
        PAGE_SIZE: 10,
    };
    $scope.WrkPtnSearch = {
        POSITION_ID: 0,
        WORK_PATTERN_CODE: '',
        WORK_PATTERN_NAME: '',
        WORK_PATTERN_DESC: '',
        WORK_PATTERN_TYPE_ID: null,
    };
    $scope.HR_GET_WORK_PATTERNS = function (CUSTOM_FIELD) {
        var PosiModelObj = new Object();
        PosiModelObj.ACTIVE = 1;
        PosiModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PrcCommMethods.ADMIN_API(PosiModelObj, 'ADMIN_GET_WORK_PATTERN').then(function (data) {
            //  $scope.WORK_PATTERNS = data.data.Table;
            if (data.data.Table.length > 0) {
                CUSTOM_FIELD.OPTION_LIST = data.data.Table;
            }
            else {
                CUSTOM_FIELD.OPTION_LIST = [];
            }
        });
    };
    $scope.HR_GET_CONTRACT_TYPE = function (CUSTOM_FIELD) {
        var PosiModelObj = new Object();
        PosiModelObj.ACTIVE = 1;
        PosiModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        PosiModelObj.CONTRACT_TYPE_NAME = '';
        PosiModelObj.PAGE_NO = 0;
        PosiModelObj.PAGE_SIZE = 0;
        PosiModelObj.CONTRACT_TYPE_CODE = '';
        PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PrcCommMethods.ADMIN_API(PosiModelObj, 'ADMIN_GET_CONTRACT_TYPE').then(function (data) {
            //    CUSTOM_FIELD.CONTRACT_TYPE = data.data.Table;
            if (data.data.Table.length > 0) {
                CUSTOM_FIELD.OPTION_LIST = data.data.Table;
            }
            else {
                CUSTOM_FIELD.OPTION_LIST = [];
            }
        });
    };

    $scope.HR_GET_WORK_PATTERN_TYPES = function () {
        var PosiModelObj = new Object();
        PrcCommMethods.HR_API(PosiModelObj, 'HR_GET_WORK_PATTERN_TYPES').then(function (data) {
            $scope.WORK_PATTERN_TYPES = data.data.Table;
        });
    };
    $scope.ObjectData = [];
    $scope.SELECT_SHIFT_TYPES = function () {
        var Noofshift = 0;
        if ($scope.WrkPtnSearch.WORK_PATTERN_TYPE_ID == 1) {
            Noofshift = 7;
        }
        if ($scope.WrkPtnSearch.WORK_PATTERN_TYPE_ID == 2) {
            Noofshift = 14;
        }
        if ($scope.WrkPtnSearch.WORK_PATTERN_TYPE_ID == 3) {
            Noofshift = 31;
        }
        $scope.SHIFT_LIST = [];
        for (var i = 0; i < Noofshift; i++) {
            var List = { TABLE_ID: 0, REMOVE_FLAG: 0, DAY_NO: i + 1, SHIFT_ID: null, START_TIME: "", END_TIME: "", PAID_BREAK: "", UN_PAID_BREAK: "" };
            $scope.SHIFT_LIST.push(List);
        }
    };
    $scope.HR_GET_SHIFTS = function () {
        var PosiModelObj = new Object();
        PosiModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        PrcCommMethods.HR_API(PosiModelObj, 'HR_GET_SHIFTS').then(function (data) {
            $scope.SHIFTS = data.data.Table;
        });
    };
    $scope.HR_GET_POSITION = function () {
        var PosiModelObj = new Object();
        PosiModelObj.POSITION_ID = $scope.POSITION_ID;
        PosiModelObj.STEP_NO = 3;
        PrcCommMethods.HR_API(PosiModelObj, 'HR_GET_POSITION').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.ObjectData = data.data.Table[0];
                $scope.POSITION_CONT_DTL_ID = data.data.Table[0].ID;
                $scope.COLMD = 'col-md-4'
                $scope.$parent.GET_CUSTOM_APP_FIELD_MAPPING(4, $scope.COLMD);
                $scope.STEP_NO = data.data.Table[0].STEP_NO;
            }
            else {
                $scope.STEP_FLAG = 3;
                $scope.COLMD = 'col-md-4'
                $scope.$parent.GET_CUSTOM_APP_FIELD_MAPPING(4, $scope.COLMD);
            }
        });
    };
    //if ($scope.POSITION_ID > 0) {
    //    $scope.HR_GET_POSITION();
    //    $scope.TxtSucEdit = "Edit";
    //};


    $scope.COMMON_PAGE_LOAD_FY = function () {
        if ($scope.POSITION_ID > 0) {
            $scope.HR_GET_POSITION();
            $scope.TxtSucEdit = "Edit";
        };
    }
    $scope.COMMON_PAGE_LOAD_FY();

    $scope.GET_HR_PROBATION_MASTER = function (CUSTOM_FIELD) {
        var PosiModelObj = new Object();
        PosiModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        PosiModelObj.ENTITY_ID = 0;
        PosiModelObj.ACTIVE = 1;
        PosiModelObj.PAGE_NO = 0;
        PosiModelObj.PAGE_SIZE = 0;
        PrcCommMethods.ADMIN_API(PosiModelObj, 'ADMIN_GET_PROBATION_MASTER').then(function (data) {
            $scope.PROBATION_MASTER = data.data.Table;
            if (data.data.Table.length > 0) {
                CUSTOM_FIELD.OPTION_LIST = data.data.Table;
            }
            else {
                CUSTOM_FIELD.OPTION_LIST = [];
            }

        });
    };
    $scope.HR_INS_UPD_POSITIONS_STEP_3 = function (FLAG) {
        $scope.CustomForm.submitted = true;
        if ($scope.CustomForm.$valid) {
            var PosiModelObj = new Object();
            var IsValidCount = 0;
            angular.forEach($scope.$parent.CUSTOM_FIELDS_LIST, function (val) {
                if (val.FIELD_TYPE_ID == 6) {
                    val.FIELD_VALUE = val.FIELD_VALUE ? 1 : 0
                }
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
                PosiModelObj[val.NG_MODEL] = val.FIELD_VALUE;
            });
            PosiModelObj.POSITION_ID = $scope.POSITION_ID;
            PosiModelObj.POSITION_CONT_DTL_ID = $scope.POSITION_CONT_DTL_ID;
            PosiModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PosiModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
            if (IsValidCount == 0) {
                $scope.CustomForm.submitted = false;
                PrcCommMethods.HR_API(PosiModelObj, 'HR_INS_UPD_POSITIONS_STEP_3').then(function (data) {
                    $scope.$parent.ShowAlert('Success', 'Position  ' + $scope.TxtSucEdit + ' Successfully', 5000);
                    if (FLAG != 1 && $scope.$parent.CHECK_MODULE_ACCESS(3, 2)) {
                        $location.path('Addemployee')
                    }
                    else {
                        $location.path('Pst_Lst')
                    }
                });
            }
        }
    };
    $scope.GO_BACK = function (FLAG) {
        $location.path('AddpositionEmpdtl').search('STG', 2)
    };
    $scope.GO_BACK_TO_LIST = function (FLAG) {
        $location.path('team')
    };
    $scope.POP_ADD_WORK_PATTERN = function () {
        $('#Add_workptn').modal('show');
        $scope.HR_GET_WORK_PATTERN_TYPES();
        $scope.HR_GET_SHIFTS()
    };
    $scope.NG_SHIFT_CHANGES = function (List, SHIFT_ID, index) {
        var index = index + 1;
        var item = $scope.SHIFTS.filter(function (x) { return x.SHIFT_ID == SHIFT_ID });
        List.START_TIME = item[0].START_TIME;
        List.END_TIME = item[0].END_TIME;
        List.PAID_BREAK = item[0].PAID_BREAK;
        List.UN_PAID_BREAK = item[0].UN_PAID_BREAK;
    };
    $scope.HR_INS_UPD_WORK_PATTERNS = function () {
        $scope.WrkForm.submitted = true;
        if ($scope.WrkForm.$valid) {
            var PosiModelObj = new Object();
            PosiModelObj.WORK_PATTERN_ID = 0;
            PosiModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
            PosiModelObj.WORK_PATTERN_CODE = $scope.WrkPtnSearch.WORK_PATTERN_CODE;
            PosiModelObj.WORK_PATTERN_NAME = $scope.WrkPtnSearch.WORK_PATTERN_NAME
            PosiModelObj.WORK_PATTERN_DESC = $scope.WrkPtnSearch.WORK_PATTERN_DESC
            PosiModelObj.WORK_PATTERN_TYPE_ID = $scope.WrkPtnSearch.WORK_PATTERN_TYPE_ID
            PosiModelObj.ACTIVE = 1;
            PosiModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            if ($scope.SHIFT_LIST.length > 0) {
                PosiModelObj.HR_SHIFT_SCHEDULE = $scope.SHIFT_LIST;
            }
            PrcCommMethods.HR_API(PosiModelObj, 'HR_INS_UPD_WORK_PATTERNS').then(function (data) {
                //if (data.data == 1) {
                $scope.$parent.ShowAlert('Success', 'Work Patterns Added Successfully', 5000);
                $scope.HR_GET_WORK_PATTERNS();
                $('#Add_workptn').modal('hide');
                //  }
            });
        }
    };
    $scope.$parent.child_scope = $scope;

});
