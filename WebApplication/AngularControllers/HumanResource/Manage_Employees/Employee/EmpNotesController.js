app.controller('EmpNotesController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    //$scope.$parent.DISPLAY_FLAG = false;
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(2);

    $scope.$parent.$parent.overlay_loading_HR_Loader = 'none';
    $scope.HR_COMMON_CODE_Fn();
    $(".modal-backdrop").remove();
    $scope.NotesSearch = {
        EMPLY_PRSNL_ID: getUrlParameter('EMP_ID', $location.absUrl()),
        CUSTOMER_ID: $cookies.get("CUSTOMER_ID"),
        MODULE_ID: parseInt($cookies.get("MODULE_ID")),
        USER_ID: $cookies.get("USERID"),
        ENTITY_ID: null,// $cookies.get("ENTITY_ID"),
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        NOTES_ID: 0,
        DELETE_FLAG: false,
        SKIP_FLAG: false,
    };
    $scope.EDIT_STEP_NO = getUrlParameter('STEP_NO', $location.absUrl());
    $scope.EDIT_STEP_NO = $scope.EDIT_STEP_NO == undefined ? 0 : $scope.EDIT_STEP_NO;
    $scope.EDIT_MODE = $scope.EDIT_STEP_NO < 9 ? false : true;
    $scope.MY_PROFILE_FLAG = 0;
    if (parseInt(getUrlParameter('EMP_ID', $location.absUrl())) == parseInt($cookies.get("EMPLY_PRSNL_ID"))) {
        $scope.EDIT_MODE = true;
        $scope.MY_PROFILE_FLAG = 1;
    };
    $scope.STEP_FLAG = 9;
    $scope.NOTES_LISTS = [];


    $scope.HRM_GET_EMPLOYEE_STEP = function () {
        var UserModelObj = new Object();
        UserModelObj.EMPLY_PRSNL_ID = getUrlParameter('EMP_ID', $location.absUrl());
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'HRM_GET_EMPLOYEE_STEP').then(function (data) {
            if (data.data.Table.length > 0) {
                let RESULT_PERSNL = data.data.Table[0];
                $scope.HeaderPrimaryDetails.FIRST_NAME = RESULT_PERSNL.FIRST_NAME;
                $scope.HeaderPrimaryDetails.MIDDLE_NAME = RESULT_PERSNL.MIDDLE_NAME;
                $scope.HeaderPrimaryDetails.LAST_NAME = RESULT_PERSNL.LAST_NAME;
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
                    }
                    if ($cookies.get("EMPLY_PRSNL_ID") == 0) {
                        $scope.SHOW_EDIT_ACCESS = true;
                    }
                    else {
                        $scope.SHOW_EDIT_ACCESS = $scope.CheckEmployeeAccess(parseInt($cookies.get("ENTITY_ID")), RESULT_PERSNL.BRANCH_ID, 'EDIT_EMPLOYEE');
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
                }
            }
        })
    }
    $scope.HRM_GET_EMPLOYEE_STEP();
    $scope.HRM_GET_EMPLOYEE_NOTES = function () {
        var NotesObject = new Object();
        NotesObject.EMPLY_PRSNL_ID = $scope.NotesSearch.EMPLY_PRSNL_ID;
        PrcCommMethods.HUMANRESOURCE_API(NotesObject, 'HRM_GET_EMPLOYEE_NOTES').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.NOTES_LISTS = data.data.Table;
            }
            else if (data.data == 0) {
                $scope.NOTES_LISTS = [];
            }
        });
    };
    $scope.POP_NOTES_Fn = function () {
        $scope.NotesSearch.NOTES_ID = '';
        $scope.NotesSearch.NOTE = '';
        $('#Add_Notes').modal('show');
        $scope.Notesform.submitted = false;
    }

    $scope.EDIT_NOTES_Fn = function (_notes) {
        $scope.NotesSearch.NOTES_ID = _notes.ID;
        $scope.NotesSearch.NOTE = _notes.NOTE;
        $('#Add_Notes').modal('show');
    }

    $scope.HRM_INS_UPD_EMPLOYEE_NOTES = function (Skip_FLAG, Continue_FLAG) {
        $scope.Notesform.submitted = true;
        if ($scope.Notesform.$valid || Skip_FLAG == 1 || Skip_FLAG == undefined) {
            var NotesObject = new Object();
            NotesObject.USER_ID = $scope.NotesSearch.USER_ID;
            NotesObject.NOTES_ID = $scope.NotesSearch.NOTES_ID;
            NotesObject.EMPLY_PRSNL_ID = $scope.NotesSearch.EMPLY_PRSNL_ID;
            NotesObject.NOTE = $scope.NotesSearch.NOTE;
            NotesObject.DELETE_FLAG = $scope.NotesSearch.DELETE_FLAG;
            if (Skip_FLAG == undefined) {
                NotesObject.SKIP_FLAG = null;
            }
            else {
                NotesObject.SKIP_FLAG = Skip_FLAG == 1 ? true : false;
            }
            PrcCommMethods.HUMANRESOURCE_API(NotesObject, 'HRM_INS_UPD_EMPLOYEE_NOTES').then(function (data) {
                if (data.data > 0) {
                    $('#Add_Notes').modal('hide');
                    if (Skip_FLAG == 0) {
                        if ($scope.NotesSearch.NOTES_ID > 0) {
                            $scope.$parent.ShowAlertBox("Success", 'Notes updated successfully', 3000);
                        }
                        else {
                            $scope.$parent.ShowAlertBox("Success", 'Notes added successfully', 3000);
                        }
                        $scope.NotesSearch.NOTE = null;
                        $scope.HRM_GET_EMPLOYEE_NOTES();
                        $scope.Notesform.submitted = false;
                    }
                    else if (Skip_FLAG == 1 || Skip_FLAG == undefined) {
                        $scope.$parent.ShowAlertBox("Success", 'Created successfully', 3000);
                        $scope.TAB_CLICK_HR_HEADER_Fn(0);
                    }
                }
                else if (data.data < 0) {
                    // $scope.$parent.ShowAlertBox("Attention", 'Already Added', 3000);
                    if (Skip_FLAG == 1 || Skip_FLAG == 0) {
                        $scope.$parent.ShowAlertBox("Success", 'Created successfully', 3000);
                        $scope.TAB_CLICK_HR_HEADER_Fn(0);
                    }
                }
                else if (data.data == 0) {
                    $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                }
                else {
                    if (Skip_FLAG == 1 || Skip_FLAG == undefined) {
                        $scope.$parent.ShowAlertBox("Success", 'Created successfully', 3000);
                        $scope.TAB_CLICK_HR_HEADER_Fn(0);
                    }
                }
                if (data.data == 0 && (Skip_FLAG == 1 || Skip_FLAG == 0)) {
                    $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                }
            });
        }
        else {
            if (Skip_FLAG != 1) {
                $scope.$parent.ShowAlertBox("Attention", $scope.$parent.MANDATORY_MSG, 3000);
            }
            $scope.EmploymentInfoform.submitted = true;
        }
    };

    $scope.HRM_GET_EMPLOYEE_NOTES();

    $scope.nginit_notes = function (_note) {
        //_note.DATE = $filter('date')(new Date(_note.DATE));
        _note.DATE = _note.DATE == null ? '' : moment(_note.DATE).format($scope.$parent.CONVERSION_DATE_FORMAT);
    }
    $scope.$parent.$parent.DateInputLoad();
});