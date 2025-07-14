app.controller('PersonalController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.$parent.TabActive(2);
    $('.modal-backdrop').removeClass('modal-backdrop fade show');
    $scope.COMMON_CODE_CHANGE();
    $scope.CHECK_MODULE_ACCESS = false;
    $scope.ObjectHistoryData = {
    };
    $scope.IS_ACCESS_ADD_MORE_FEILD = $scope.$parent.CheckSubModuleAccess(118);
    $scope.$parent.EFFECTIVE_RESET_LOAD();
    $scope.$parent.SCROLL_TOP();
    $scope.$parent.$parent.overlay_loadingNew = 'block'
    $scope.STEP_FLAG = 1;
    $scope.ObjectData = [];
    $scope.EmpID = getUrlParameter('EmpID', $location.absUrl());
    $scope.EMPLOYEE_NO_SETTING = $scope.$parent.GET_ENTITY_SETTINGS(15)[0].SETTING_VALUE; //true then add manully
    $filter('lowercase')($location.absUrl()).indexOf("editpersonal") != -1 ? $scope.EDIT_PAGE = true : $scope.EDIT_PAGE = false;
    $scope.EmpSearch_1 = {
        EMP_PRS_ID: 0,
        TITLE: null,
        FIRST_NAME: '',
        MIDDLE_NAME: '',
        LAST_NAME: null,
        KNOWN_AS: null,
        GENDER_ID: null,
        NATIONALITY_ID: null,
        NATIONAL_TYPE_ID: null,
        DATE_OF_BIRTH: null,
        MARITAL_STATUS_ID: null,
        PARTNERS_FIRST_NAME: null,
        PARTNERS_MIDDLE_NAME: null,
        PARTNERS_LAST_NAME: null,
        DISPLAY_NAME: "",
        PARTNERS_NATIONAL_INSURANCE: null,
        PAGE_NO: 1,
        PAGE_SIZE: 10,
    }
    $scope.ResetEmp = function () {
        $scope.EmpSearch = {
            DEPARTMENT_NAME: "",
            DEPARTMENT_COLOR: '',
            PARENT_DEPARTMENT_ID: null,
            PAGE_NO: 1,
            PAGE_SIZE: 10,
        }

    }
    $scope.DateInputLoad = function () {
        $(document).ready(function () {
            var date_inputs = document.getElementsByClassName("dateinput") //our date input has the name "date"
            if (date_inputs.length > 0) {
                for (var i = 0; i < date_inputs.length; i++) {
                    var date_input = $('input[name="' + date_inputs[i].name + '"]'); //our date input has the name "date"
                    var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
                    var date = new Date();
                    var options = {
                        todayBtn: "linked",
                        daysOfWeekHighlighted: "0,6",
                        autoclose: true,
                        todayHighlight: true,
                        format: 'M dd, yyyy',
                        clearBtn: true,
                        closeBtn: true,// close button visible
                        startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate())
                    };
                    date_input.datepicker(options);
                }
            }
        });
    }
    $scope.GET_NATIONALITY = function (CUSTOM_FIELD) {
        var ModelObj = new Object();
        ModelObj.CUSTOMER_ID = null;//$scope.NationalitySearch.CUSTOMER_ID;;
        ModelObj.NATIONALITY_ID = '';
        ModelObj.NATIONALITY_NAME = '';
        ModelObj.ACTIVE = 1;
        ModelObj.PAGE_NO = 0;
        ModelObj.PAGE_SIZE = 0;
        ModelObj.ENTITY_ID = null;
        PrcCommMethods.ADMIN_API(ModelObj, 'ADMIN_GET_NATIONALITY').then(function (data) {
            if (data.data.Table.length > 0) {
                CUSTOM_FIELD.OPTION_LIST = data.data.Table;
            }
            else {
                CUSTOM_FIELD.OPTION_LIST = [];
            }
        });
    };
    $scope.GET_NATIONALITY_ID_TYPES = function (PREVIOUS_FIELD, CUSTOM_FIELD) {
        if (PREVIOUS_FIELD.FIELD_VALUE != undefined) {
            var PosiModelObj = new Object();
            PosiModelObj.ACTIVE = 1;
            PosiModelObj.NATIONALITY_ID = PREVIOUS_FIELD.FIELD_VALUE;
            PosiModelObj.NATIONAL_TYPE_NAME = "";
            PosiModelObj.PAGE_NO = 0;
            PosiModelObj.PAGE_SIZE = 0;
            PosiModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.ADMIN_API(PosiModelObj, 'ADMIN_GET_NATIONALITY_ID_TYPE').then(function (data) {
                // $scope.NATIONAL_ID_LIST = data.data.Table;
                if (data.data.Table.length > 0) {
                    CUSTOM_FIELD.OPTION_LIST = data.data.Table;

                    if ($scope.EmpID > 0) {
                    }
                    else {
                        var OPLT1 = CUSTOM_FIELD.OPTION_LIST.filter(function (x) { return x.IS_DEFAULT });
                        if (OPLT1.length > 0) {
                            //var index_94 = $scope.$parent.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 94);
                            CUSTOM_FIELD.FIELD_VALUE = OPLT1[0].TABLE_ID;
                        }
                    }
                    var OPLT = CUSTOM_FIELD.OPTION_LIST.filter(function (x) { return x.TABLE_ID == CUSTOM_FIELD.FIELD_VALUE });
                    var index_351 = $scope.$parent.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 351);
                    if (OPLT.length > 0) {
                        $scope.CUSTOM_FIELDS_LIST[index_351].ENTITY_COLUMN_NAME = OPLT[0].DISPLAY_TEXT + ' Number';
                    }
                }
                else {
                    CUSTOM_FIELD.OPTION_LIST = [];
                }
                //$scope.CHANGE_NATIONAL_INSURANCE();
            });
        }
        else {
            CUSTOM_FIELD.OPTION_LIST = [];
        }
    };
    $scope.HR_GET_NI_CATEOGRY_MASTER = function () {
        var PosiModelObj = new Object();
        PosiModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        PosiModelObj.CATEGORY_NAME = '';
        PosiModelObj.ACTIVE = 1;
        PosiModelObj.PAGE_NO = 0;
        PosiModelObj.PAGE_SIZE = 0;
        PrcCommMethods.ADMIN_API(PosiModelObj, 'ADMIN_GET_NI_CATEOGRY_MASTER').then(function (data) {
            $scope.NI_CATEOGRY_MASTER = data.data.Table;
        });
    };
    ///////////////////UpComing and History Code/////////////////////////////////
    $scope.EFFECTIVE_SEARCH = {
        EFFECTIVE_DATE: null,
        COMMENTS: '',
    };
    $scope.GetDataHistory = true;
    $scope.ViewHistoryEmpSearch_1 = {
    };
    $scope.EFFECTIVE_DATA_LIST = [];
    /////////////////////End UpComing and History Code///////////////////////////////////
    $scope.TERMINATION_DETAILS = [];
    $scope.EMP_SEARCH_NAME_DTL = {
    }
    $scope.HR_GET_EMPLOYEE = function () {
        $scope.EFFECTIVE_DATA_LIST = [];
        var PosiModelObj = new Object();
        PosiModelObj.EMPLOYEE_ID = $scope.EmpID;
        PosiModelObj.STEP_NO = 1;
        PosiModelObj.LOGIN_USER_EMP_ID = parseInt($cookies.get("EMPLOYEE_ID"));
        PosiModelObj.YEAR = 0;
        PrcCommMethods.HR_API(PosiModelObj, 'HR_GET_EMPLOYEE').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.EMPLOYEE_NO = data.data.Table[0].EMPLOYEE_NO;
                $scope.ObjectData = data.data.Table[0];
                $scope.ObjectHistoryData = data.data.Table[0];
                $scope.EFFECTIVE_DATA_LIST = data.data.Table1;
                if ($filter('lowercase')($location.absUrl()).indexOf("editpersonal") != -1) {
                    //  $('#EFFECTIVE_DATA').modal('show');
                }
                if ($filter('lowercase')($location.absUrl()).indexOf("editprofile") != -1) {
                    $scope.ViewEmpSearch_1 = data.data.Table[0];
                    $scope.ViewEmpSearch_1.COLMD = 'col-md-4';
                    $scope.ViewEmpSearch_1.IS_HEADER = true;
                    $scope.GET_CUSTOM_LABEL_APP_FIELD_MAPPING(5, data.data.Table[0]);
                }
                else {
                    $scope.COLMD = 'col-md-4';
                    $scope.$parent.GET_CUSTOM_APP_FIELD_MAPPING(5, $scope.COLMD);
                }
            }
            else {
                $scope.COLMD = 'col-md-4';
                $scope.$parent.GET_CUSTOM_APP_FIELD_MAPPING(5, $scope.COLMD);
            }
        });
    };
    $scope.GET_EMPLOYEE_PROFILE_HEADER = function () {
        $scope.TERMINATION_DETAILS = [];
        var PosiModelObj = new Object();
        PosiModelObj.EMPLOYEE_ID = $scope.EmpID;
        PrcCommMethods.HR_API(PosiModelObj, 'GET_EMPLOYEE_PROFILE_HEADER').then(function (data) {
            $scope.$parent.EmpSearch_HEADER = data.data.Table[0];
            if (data.data.Table1.length > 0) {
                $scope.STEP_NO = data.data.Table1[0].STEP_NO;
                $scope.EMP_SEARCH_NAME_DTL = data.data.Table1[0];
            }
            if (data.data.Table2.length > 0) {
                $scope.TERMINATION_DETAILS = data.data.Table2;
            }
            if ($filter('lowercase')($location.absUrl()).indexOf("editprofile") != -1 || $filter('lowercase')($location.absUrl()).indexOf("editpersonal") != -1) { // $('#EFFECTIVE_DATA').modal('show');
                $scope.$parent.CalculetteService(data.data.Table[0]);
            }

        });
        $scope.IS_EDITABLE_FLAG = true;
        if ($scope.EmpID == parseInt($cookies.get("EMPLOYEE_ID"))) {
            $scope.IS_EDITABLE_FLAG = false;
            $scope.EDIT_PROFILE_CHECK_MODULE_ACCESS = $scope.CheckSubModuleAccess(4);
        }
        else {
            $scope.EDIT_PROFILE_CHECK_MODULE_ACCESS = $scope.$parent.CHECK_MODULE_ACCESS(3, 3);
        }
    };
    ///Master js Also in use in fy
    $scope.COMMON_PAGE_LOAD_FY = function () {
        $scope.HR_GET_EMPLOYEE();
        $scope.GET_EMPLOYEE_PROFILE_HEADER();
    }
    if ($scope.EmpID > 0) {
        $scope.COMMON_PAGE_LOAD_FY();
    }
    else {
        $scope.COLMD = 'col-md-4';
        $scope.$parent.GET_CUSTOM_APP_FIELD_MAPPING(5, $scope.COLMD);
    }



    $scope.CHANGE_NATIONAL_INSURANCE = function () {
        var a = $scope.NATIONAL_ID_LIST.filter(function (x) { return x.NATIONAL_ID_TYPES_ID == $scope.EmpSearch_1.NATIONAL_TYPE_ID });
        if (a.length > 0) {
            $scope.visibletrue = true;
            $scope.DISPLAY_NAME_LBL = a[0].DISPLAY_NAME;
        }

    };

    $scope.CHECK_DOB = function (CUTOM_FLD) {
        var dateString = CUTOM_FLD.FIELD_VALUE;
        var a = (moment(dateString, "DD/MM/YYYY").toDate());
        var date1 = moment().subtract(13, 'years');
        var date2 = moment(date1).subtract(100, 'years');
        var SY = new Date(CUTOM_FLD.FIELD_VALUE).getFullYear();
        var D2Y = new Date(date2).getFullYear();
        if (SY <= D2Y) {
            $scope.$parent.ShowAlert('Error', 'Please select valid date format', 3000);
            CUTOM_FLD.FIELD_VALUE = '';
            return false;
        };
        if (moment(dateString, "DD/MM/YYYY").toDate() >= date1) {
            $scope.$parent.ShowAlert('Error', 'Your age should be more than 13 Years.', 3000);
            CUTOM_FLD.FIELD_VALUE = '';
            return false;
        };
        return true;
    }
    $scope.HR_INS_UPD_EMPLOYEE_STEP_1 = function (FLAG) {
        var IS_VALID = true;
        var count = 0;
        var CheckBoxList = $scope.$parent.CUSTOM_FIELDS_LIST.filter(x => x.FIELD_TYPE_ID == 7 && x.IS_MANDATORY == true);
        if (CheckBoxList.length > 0) {
            for (var i = 0; i < CheckBoxList.length; i++) {
                if (CheckBoxList[i].checkedOption.length == 0) {
                    IS_VALID = false;
                    break;
                };
            };
        };
        var FILE_UPLOAD_LIST = $scope.$parent.CUSTOM_FIELDS_LIST.filter(x => x.FIELD_TYPE_ID == 11 && x.IS_MANDATORY == true);
        if (FILE_UPLOAD_LIST.length > 0) {
            for (var i = 0; i < FILE_UPLOAD_LIST.length; i++) {
                if (FILE_UPLOAD_LIST[i].UploadedFiles == undefined || FILE_UPLOAD_LIST[i].UploadedFiles.length == 0) {
                    IS_VALID = false;
                    count++;
                    break;
                };
            };
        };

        $scope.CustomForm.submitted = true;
        if ($scope.CustomForm.$valid && IS_VALID) {
            var IS_VALID_DOB = true;
            var EmpModelObj = new Object();
            var IsValidCount = 0;
            angular.forEach($scope.$parent.CUSTOM_FIELDS_LIST, function (val) {
                val.IsValidCount = 0;
                if (val.FIELD_VALUE == undefined) {
                    val.FIELD_VALUE = '';
                }
                if (val.FIELD_TYPE_ID == 6 || val.FIELD_TYPE_ID == 7 || val.FIELD_TYPE_ID == 11) {

                    $scope.$parent.INSERT_FIELD_TYPE_ID_SET_VALUE(val.FIELD_TYPE_ID, val, $scope.EDIT_PAGE);
                    if (val.IsValidCount > 0) {
                        IsValidCount++;
                    }
                }
                if ($scope.EDIT_PAGE && val.FIELD_TYPE_ID != 3 && val.FIELD_TYPE_ID != 5 && val.FIELD_TYPE_ID != 10 || ($scope.EDIT_PAGE && val.FIELD_TYPE_ID == 3 && !val.IS_DB_DROPDOWN)) {
                    if (val.FIELD_TYPE_ID == 9) {
                        val.CHANGE_FLAG == 1 ? val.FIELD_VALUE == "" ? EmpModelObj[val.NG_MODEL] = '1/1/0001 12:00:00 AM' : EmpModelObj[val.NG_MODEL] = val.FIELD_VALUE : val.FIELD_VALUE = null;
                    }
                    else {
                        EmpModelObj[val.NG_MODEL] = val.CHANGE_FLAG == 1 ? val.FIELD_VALUE : null;
                    }
                    if (val.FIELD_MASTER_ID == 92) {
                        IS_VALID_DOB = $scope.CHECK_DOB(val);
                        EmpModelObj[val.NG_MODEL] = val.CHANGE_FLAG == 1 ? moment(val.FIELD_VALUE, "DD/MM/YYYY").format('L') : null;
                    }
                }
                else {
                    EmpModelObj[val.NG_MODEL] = val.FIELD_VALUE;
                    if (val.FIELD_TYPE_ID == 9) {
                        val.FIELD_VALUE == "" ? EmpModelObj[val.NG_MODEL] = '1/1/0001' : EmpModelObj[val.NG_MODEL] = val.FIELD_VALUE;
                    }
                    if (val.FIELD_MASTER_ID == 92) {
                        IS_VALID_DOB = $scope.CHECK_DOB(val);
                        EmpModelObj[val.NG_MODEL] = moment(val.FIELD_VALUE, "DD/MM/YYYY").format('L');
                    }
                }
            });
            EmpModelObj.EMP_PRS_ID = $scope.EmpID;
            EmpModelObj.USER_ID = parseInt($cookies.get("USERID"));
            EmpModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
            EmpModelObj.DISPLAY_NAME = $scope.EmpSearch_1.DISPLAY_NAME;
            EmpModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            EmpModelObj.EFFECTIVE_DATE = $scope.EFFECTIVE_SEARCH.EFFECTIVE_DATE;
            EmpModelObj.COMMENTS = $scope.EFFECTIVE_SEARCH.COMMENTS;
            EmpModelObj.SELF_UPDATE_FLAG = ($cookies.get("EMPLOYEE_ID") == parseInt(getUrlParameter('EmpID', $location.absUrl()))) ? 1 : 0;
            EmpModelObj.EMPLOYEE_NO = $scope.EMPLOYEE_NO;
            EmpModelObj.EMPLOYEE_NO = $scope.EMPLOYEE_NO;
            if (IsValidCount == 0 && IS_VALID_DOB) {
                $scope.CustomForm.submitted = false;
                PrcCommMethods.HR_API(EmpModelObj, 'HR_INS_UPD_EMPLOYEE_STEP_1').then(function (data) {
                    if (data.data == -1) {
                        $scope.$parent.ShowAlert('Warning', "Employee no already registered", 5000);
                    }
                    else if (data.data == 0) {
                        $scope.$parent.ShowAlert('Error', $scope.SOMETHINGWENTWRONG, 5000);
                    }
                    else {
                        if (FLAG == 1) {
                            $scope.$parent.ShowAlert('Success', 'Person Added Successfully', 5000);
                            $location.path('team')
                        }
                        else if (FLAG == 'VIEW') {
                            $scope.$parent.ShowAlert('Success', 'Profile Updated Successfully', 5000);
                            $location.path('EditProfile')
                        }
                        else {
                            $scope.STEP_FLAG = 2;
                            $scope.$parent.ShowAlert('Success', 'Person Added Successfully', 5000);
                            $location.path('EmpContact').search('EmpID', data.data).search('STG', 2)
                        }
                    }
                    $('#EFFECTIVE_DATA').modal('hide');
                });
            }
            else {
                if (!IS_VALID_DOB) {
                }
                else {
                    $scope.$parent.ShowAlert('Error', 'Please Upload File', 3000);
                }
            }
        }
        else {
            if (count > 0) {
                $scope.$parent.ShowAlert('Error', 'Please Upload File', 3000);
            }

            $('#EFFECTIVE_DATA').modal('hide');
        }
    };

    $scope.POP_EMPLOYEE_STEP_FLAG = function (LBL_TEXT) {
        var IS_VALID = true;
        var count = 0;
        var CheckBoxList = $scope.$parent.CUSTOM_FIELDS_LIST.filter(x => x.FIELD_TYPE_ID == 7 && x.IS_MANDATORY == true);
        if (CheckBoxList.length > 0) {
            for (var i = 0; i < CheckBoxList.length; i++) {
                if (CheckBoxList[i].checkedOption.length == 0) {
                    IS_VALID = false;
                    break;
                };
            };
        };
        var FILE_UPLOAD_LIST = $scope.$parent.CUSTOM_FIELDS_LIST.filter(x => x.FIELD_TYPE_ID == 11 && x.IS_MANDATORY == true);
        if (FILE_UPLOAD_LIST.length > 0) {
            for (var i = 0; i < FILE_UPLOAD_LIST.length; i++) {
                if (FILE_UPLOAD_LIST[i].UploadedFiles == undefined || FILE_UPLOAD_LIST[i].UploadedFiles.length == 0) {
                    IS_VALID = false;
                    count++;
                    break;
                };
            };
        };
        $scope.CustomForm.submitted = true;
        if ($scope.CustomForm.$valid && IS_VALID) {
            if (LBL_TEXT != undefined && LBL_TEXT != '') {
                $scope.EFFECTIVEForm.submitted = true;
                if ($scope.EFFECTIVEForm.$valid) {
                    $scope.HR_INS_UPD_EMPLOYEE_STEP_1(LBL_TEXT)
                }
                else {
                    $('#EFFECTIVE_DATA').modal('show');
                }
            }
            else {
                $('#EFFECTIVE_DATA').modal('show');
            }
        }
        else {
            if (count > 0) {
                $scope.$parent.ShowAlert('Error', 'Please Upload File', 3000);
            }
        }
    };
    $scope.GO_BACK_TO_LIST = function (FLAG) {
        $location.path('team')
    };
    $scope.TAB_CLICK = function (FLAG) {
        $scope.HR_GET_EMPLOYEE();
    };
    $scope.REDIRECTTOTEAM = function (FLAG) {
        window.location.href = '../DashBoard/hrIndex#!/team?stp=' + FLAG;
    };
    $scope.GET_EMPLOYEE_PROFILE_HEADER();
    $scope.PERSONAL_DETAILS = function () {
        $location.path('EditPersonal');
    };
    $scope.$parent.child_scope = $scope;

});
app.controller('ContactController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $('.modal-backdrop').removeClass('modal-backdrop fade show');
    $scope.COMMON_CODE_CHANGE();
    $scope.CHECK_MODULE_ACCESS = false;
    $scope.IS_ACCESS_ADD_MORE_FEILD = $scope.$parent.CheckSubModuleAccess(118);
    $scope.$parent.CURRENT_STEP_NO_EMP = 0;
    $scope.$parent.TabActive(2);
    $scope.$parent.EFFECTIVE_RESET_LOAD();
    $scope.$parent.$parent.overlay_loadingNew = 'block';
    $scope.ObjectHistoryData = {
    }
    $scope.$parent.SCROLL_TOP();
    $scope.ObjectData = [];
    $scope.EFFECTIVE_DATA_LIST = [];
    $scope.EMP_SEARCH_NAME_DTL = {
    }
    $scope.EmpID = getUrlParameter('EmpID', $location.absUrl());
    //$scope.YESNO = [{ ID: 1, NAME: "Yes" }, { ID: 2, NAME: "No" }];
    $scope.STEP_FLAG = 2;
    if ($filter('lowercase')($location.absUrl()).indexOf("editcontact") != -1) { $scope.EDIT_PAGE = true; $scope.$parent.EDIT_PAGE = true } else { $scope.EDIT_PAGE = false; $scope.$parent.EDIT_PAGE = false };
    $scope.BACKTOTEAM = "Back To Team";
    $scope.EmpSearch_2 = {
        EMP_CNT_ID: 0,
        TELEPHONE_NO: "",
        MOBILE_NO: "",
        BUSINESS_EMAIL: "",
        PERSONAL_EMAIL: "",
        COUNTRY_ID: null,
        ADDRESS_LINE_1: "",
        ADDRESS_LINE_2: "",
        CITY: "",
        COUNTY: "",
        POST_CODE: "",
        EMR_CONTACT_NAME: "",
        EMR_RELATIONSHIP_ID: null,
        EMR_CONTACT_NUMBER: "",
    };
    $scope.DateInputLoad = function () {
        $(document).ready(function () {
            var date_inputs = document.getElementsByClassName("dateinput") //our date input has the name "date"
            if (date_inputs.length > 0) {
                for (var i = 0; i < date_inputs.length; i++) {
                    var date_input = $('input[name="' + date_inputs[i].name + '"]'); //our date input has the name "date"
                    var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
                    var date = new Date();
                    var options = {
                        todayBtn: "linked",
                        daysOfWeekHighlighted: "0,6",
                        autoclose: true,
                        todayHighlight: true,
                        format: 'M dd, yyyy',
                        clearBtn: true,
                        closeBtn: true,// close button visible
                        startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate())
                    };
                    date_input.datepicker(options);
                }
            }
        });
    };
    $scope.DateInputLoad();
    $scope.GET_COUNTRY = function (CUSTOM_FIELD, ONCHANGEFLAG, Data_Obj) {
        var PosiModelObj = new Object();
        PrcCommMethods.HR_API(PosiModelObj, 'GET_COUNTRY').then(function (data) {
            if (data.data.Table.length > 0) {
                CUSTOM_FIELD.OPTION_LIST = data.data.Table;
                //if (ONCHANGEFLAG == 1) {
                //    var index = $scope.$parent.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === CUSTOM_FIELD.DEPENDANT_ID);
                //    $scope.HOURLY_PAYMENT_FY(CUSTOM_FIELD, $scope.$parent.CUSTOM_FIELDS_LIST_FILTER[index], ONCHANGEFLAG, Data_Obj);
                //}
            }
            else {
                CUSTOM_FIELD.OPTION_LIST = [];
            }
        });
    };
    $scope.GET_MOBILE_CODE = function (CUSTOM_FIELD) {
        var PosiModelObj = new Object();
        PrcCommMethods.HR_API(PosiModelObj, 'GET_MOBILE_CODE').then(function (data) {
            if (data.data.Table.length > 0) {
                CUSTOM_FIELD.OPTION_LIST = data.data.Table;
            }
            else {
                CUSTOM_FIELD.OPTION_LIST = [];
            }
        });
    };
    $scope.GET_EMERGENCY_CONTACT_RELATIONSHIP = function (CUSTOM_FIELD) {
        var PosiModelObj = new Object();
        PosiModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        PosiModelObj.ENTITY_ID = 0//parseInt($cookies.get("ENTITY_ID"));
        PosiModelObj.RELATIONSHIP_NAME = '';
        PosiModelObj.ACTIVE = 1;
        PosiModelObj.PAGE_NO = 0;
        PosiModelObj.PAGE_SIZE = 0;
        PrcCommMethods.ADMIN_API(PosiModelObj, 'ADMIN_GET_EMERGENCY_CONTACT_RELATIONSHIP').then(function (data) {
            //if (data.data.Table.length > 0) {
            //    $scope.RELATIONSHIP = data.data.Table;
            //}
            //else {
            //    $scope.RELATIONSHIP = [];
            //}

            if (data.data.Table.length > 0) {
                CUSTOM_FIELD.OPTION_LIST = data.data.Table;
            }
            else {
                CUSTOM_FIELD.OPTION_LIST = [];
            }

        });
    };
    $scope.HR_GET_EMPLOYEE = function () {
        $scope.EFFECTIVE_DATA_LIST = [];
        var PosiModelObj = new Object();
        PosiModelObj.EMPLOYEE_ID = $scope.EmpID;
        PosiModelObj.STEP_NO = 2;
        PosiModelObj.LOGIN_USER_EMP_ID = parseInt($cookies.get("EMPLOYEE_ID"));
        PrcCommMethods.HR_API(PosiModelObj, 'HR_GET_EMPLOYEE').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.EmpSearch_2 = data.data.Table[0];
                $scope.ObjectData = data.data.Table[0];
                $scope.$parent.CURRENT_STEP_NO_EMP = data.data.Table[0].STEP_NO;
                $scope.ObjectHistoryData = data.data.Table[0];
                $scope.EMP_CNT_ID = data.data.Table[0].EMP_CNT_ID;
                $scope.EFFECTIVE_DATA_LIST = data.data.Table1;
                $scope.COLMD = 'col-md-4'
                $scope.$parent.GET_CUSTOM_APP_FIELD_MAPPING(6, $scope.COLMD);
            }
            else {
                $scope.COLMD = 'col-md-4'
                $scope.$parent.GET_CUSTOM_APP_FIELD_MAPPING(6, $scope.COLMD);
            }
            if ($filter('lowercase')($location.absUrl()).indexOf("editcontact") != -1) {
                //   $('#EFFECTIVE_DATA').modal('show');
            }
            if ($filter('lowercase')($location.absUrl()).indexOf("viewcontact") != -1) {
                $scope.ViewEmpSearch_2 = data.data.Table[0];
                $scope.ViewEmpSearch_2.COLMD = 'col-md-4';
                $scope.ViewEmpSearch_2.IS_HEADER = true;
                $scope.GET_CUSTOM_LABEL_APP_FIELD_MAPPING(6, data.data.Table[0]);

            }
        });
    };
    $scope.COMMON_PAGE_LOAD_FY = function () {
        $scope.HR_GET_EMPLOYEE();
        $scope.GET_EMPLOYEE_PROFILE_HEADER();
    }

    if ($scope.EmpID > 0) {
        $scope.HR_GET_EMPLOYEE();
    };
    $scope.HR_CHECK_BUSINESS_EMAIL = function (CUSTOM_FIELD) {
        var PosiModelObj = new Object();
        PosiModelObj.BUSINESS_EMAIL = CUSTOM_FIELD.FIELD_VALUE;
        PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PosiModelObj.EMP_PRS_ID = $scope.EmpID;
        PrcCommMethods.HR_API(PosiModelObj, 'HR_CHECK_BUSINESS_EMAIL').then(function (data) {
            if (data.data > 0) {
            }
            if (data.data < 0) {
                CUSTOM_FIELD.FIELD_VALUE = '';
                $scope.$parent.ShowAlert('Error', 'Email already exists', 5000);
            }
        });
    }
    $scope.HR_INS_UPD_EMPLOYEE_STEP_2 = function (FLAG) {

        var IS_VALID = true;
        var count = 0;
        var INDEX_291 = $scope.$parent.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 291);
        var INDEX_120 = $scope.$parent.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 120);
        if (INDEX_291 > 0 && INDEX_120 > 0) {
            var SELECT_COUNTRY_CODE_VALUE_291 = $scope.$parent.CUSTOM_FIELDS_LIST[INDEX_291].FIELD_VALUE;
            //var CODES_VALUE_120 = $scope.$parent.CUSTOM_FIELDS_LIST[INDEX_120].FIELD_VALUE.replaceAll(' ', '');
            var CODES_VALUE_120 = $scope.$parent.CUSTOM_FIELDS_LIST[INDEX_120].FIELD_VALUE;
            var CODES_VALUE_120_IS_MANDATORY = $scope.$parent.CUSTOM_FIELDS_LIST[INDEX_120].IS_MANDATORY;
            var API_FLAG_120 = $scope.$parent.CUSTOM_FIELDS_LIST[INDEX_120].API_FLAG;

            if (API_FLAG_120 && SELECT_COUNTRY_CODE_VALUE_291 != undefined && SELECT_COUNTRY_CODE_VALUE_291 != null &&
                SELECT_COUNTRY_CODE_VALUE_291 != "" && CODES_VALUE_120 != undefined &&
                CODES_VALUE_120 != null && CODES_VALUE_120 != "") {
                var COUNTRY_CODE = $scope.$parent.CUSTOM_FIELDS_LIST[INDEX_291].OPTION_LIST.filter(function (x) { return x.COUNTRY_ID == SELECT_COUNTRY_CODE_VALUE_291 })
                var TWO_DIGIT_COUNTRY_CODE = COUNTRY_CODE[0].TWO_DIGIT_COUNTRY_CODE
                var API_PATH_120 = $scope.$parent.CUSTOM_FIELDS_LIST[INDEX_120].API_PATH;
                var API_KEY_120 = $scope.$parent.CUSTOM_FIELDS_LIST[INDEX_120].API_KEY;
            }
            if (CODES_VALUE_120 != undefined && CODES_VALUE_120 != null && CODES_VALUE_120 != "") {
                if (SELECT_COUNTRY_CODE_VALUE_291 == undefined || SELECT_COUNTRY_CODE_VALUE_291 == null || SELECT_COUNTRY_CODE_VALUE_291 == "") {
                    IS_VALID = false;
                    count = 2;
                }
            }
        }
        var CheckBoxList = $scope.$parent.CUSTOM_FIELDS_LIST.filter(x => x.FIELD_TYPE_ID == 7 && x.IS_MANDATORY == true);
        if (CheckBoxList.length > 0) {
            for (var i = 0; i < CheckBoxList.length; i++) {
                if (CheckBoxList[i].checkedOption.length == 0) {
                    IS_VALID = false;
                    break;
                };
            };
        };
        var FILE_UPLOAD_LIST = $scope.$parent.CUSTOM_FIELDS_LIST.filter(x => x.FIELD_TYPE_ID == 11 && x.IS_MANDATORY == true);
        if (FILE_UPLOAD_LIST.length > 0) {
            for (var i = 0; i < FILE_UPLOAD_LIST.length; i++) {
                if (FILE_UPLOAD_LIST[i].UploadedFiles == undefined || FILE_UPLOAD_LIST[i].UploadedFiles.length == 0) {
                    IS_VALID = false;
                    count = 1;
                    break;
                };
            };
        };
        $scope.CustomForm.submitted = true;
        if ($scope.CustomForm.$valid && IS_VALID) {
            $scope.$parent.overlay_loadingNew = 'block';
            var index_114 = $scope.$parent.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 114);
            var PosiModelObj = new Object();
            PosiModelObj.BUSINESS_EMAIL = $scope.$parent.CUSTOM_FIELDS_LIST[index_114].FIELD_VALUE;
            PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            PosiModelObj.EMP_PRS_ID = $scope.EmpID;
            PosiModelObj.API_FLAG_120 = API_FLAG_120 ? 1 : 0;

            PosiModelObj.API_PATH_120 = API_PATH_120;
            PosiModelObj.API_KEY_120 = API_KEY_120;

            PosiModelObj.CODES_VALUE_120 = CODES_VALUE_120;
            PosiModelObj.TWO_DIGIT_COUNTRY_CODE = TWO_DIGIT_COUNTRY_CODE;

            PrcCommMethods.HR_API(PosiModelObj, 'HR_CHECK_BUSINESS_EMAIL').then(function (data) {
                var IS_VALID = true;
                if (data.data[1].VALID != "" && API_FLAG_120 && SELECT_COUNTRY_CODE_VALUE_291 != undefined && SELECT_COUNTRY_CODE_VALUE_291 != null &&
                    SELECT_COUNTRY_CODE_VALUE_291 != "" && CODES_VALUE_120 != undefined &&
                    CODES_VALUE_120 != null && CODES_VALUE_120 != "") {
                    if (JSON.parse(data.data[1].VALID).results == undefined || JSON.parse(data.data[1].VALID).results != undefined && JSON.parse(data.data[1].VALID).results.length == 0) {
                        IS_VALID = false;
                    }
                }

                if (data.data[0].VALID > 0 && IS_VALID) {
                    $scope.CustomForm.submitted = true;
                    if ($scope.CustomForm.$valid) {
                        var EmpModelObj = new Object();
                        EmpModelObj.EMP_PRS_ID = $scope.EmpID;
                        EmpModelObj.EMP_CNT_ID = $scope.EMP_CNT_ID;
                        var IsValidCount = 0;
                        angular.forEach($scope.$parent.CUSTOM_FIELDS_LIST, function (val) {
                            val.IsValidCount = 0;
                            if (val.FIELD_VALUE == undefined) {
                                val.FIELD_VALUE = '';
                            }
                            if (val.FIELD_TYPE_ID == 6 || val.FIELD_TYPE_ID == 7 || val.FIELD_TYPE_ID == 11) {
                                $scope.$parent.INSERT_FIELD_TYPE_ID_SET_VALUE(val.FIELD_TYPE_ID, val, $scope.EDIT_PAGE)
                                val.IsValidCount = 0;
                                if (val.IsValidCount > 0) {
                                    IsValidCount++;
                                }
                            }
                            if ($scope.EDIT_PAGE && val.FIELD_TYPE_ID != 3 && val.FIELD_TYPE_ID != 5 && val.FIELD_TYPE_ID != 10 || ($scope.EDIT_PAGE && val.FIELD_TYPE_ID == 3 && !val.IS_DB_DROPDOWN)) {
                                if (val.FIELD_TYPE_ID == 9) {
                                    val.CHANGE_FLAG == 1 ? val.FIELD_VALUE == "" ? EmpModelObj[val.NG_MODEL] = '1/1/0001 12:00:00 AM' : EmpModelObj[val.NG_MODEL] = val.FIELD_VALUE : val.FIELD_VALUE = null;
                                }
                                else {
                                    EmpModelObj[val.NG_MODEL] = val.CHANGE_FLAG == 1 ? val.FIELD_VALUE : null;
                                }
                            }
                            else {
                                EmpModelObj[val.NG_MODEL] = val.FIELD_VALUE;
                                if (val.FIELD_TYPE_ID == 9) {
                                    val.FIELD_VALUE == "" ? EmpModelObj[val.NG_MODEL] = '1/1/0001' : EmpModelObj[val.NG_MODEL] = val.FIELD_VALUE;
                                }
                            }

                        });
                        EmpModelObj.USER_ID = parseInt($cookies.get("USERID"));
                        EmpModelObj.EFFECTIVE_DATE = $scope.EFFECTIVE_SEARCH.EFFECTIVE_DATE;
                        EmpModelObj.COMMENTS = $scope.EFFECTIVE_SEARCH.COMMENTS;
                        EmpModelObj.SELF_UPDATE_FLAG = ($cookies.get("EMPLOYEE_ID") == parseInt(getUrlParameter('EmpID', $location.absUrl()))) ? 1 : 0;
                        $scope.CustomForm.submitted = false;
                        PrcCommMethods.HR_API(EmpModelObj, 'HR_INS_UPD_EMPLOYEE_STEP_2').then(function (data) {
                            if (FLAG == 1) {
                                $scope.$parent.ShowAlert('Success', 'Contact Added Successfully', 5000);
                                $scope.REDIRECTTOTEAM(3);
                            }
                            else if (FLAG == 'VIEW') {
                                $scope.$parent.ShowAlert('Success', 'Contact Updated Successfully', 5000);
                                $location.path('ViewContact')
                            }
                            else if (data.data == 0) {
                                $scope.$parent.ShowAlert('Error', $scope.SOMETHINGWENTWRONG, 5000);
                            }
                            else if (data.data < 0) {
                                $scope.$parent.ShowAlert('Error', 'Email already exists', 5000);
                            }
                            else if (data.data > 0) {
                                $scope.$parent.ShowAlert('Success', 'Contact Added Successfully', 5000);
                                $location.path('Empemplment').search('EmpID', $scope.EmpID).search('STG', 3)
                                //$scope.EmpSearch_2.EMP_CNT_ID = data.data;
                            } else {
                                //}
                            }
                        });
                    }
                    else {
                        $('#EFFECTIVE_DATA').modal('hide');
                    }
                }
                if (data.data[0].VALID == -1 && IS_VALID) {
                    $scope.$parent.CUSTOM_FIELDS_LIST[index_114].FIELD_VALUE = '',
                        $scope.$parent.ShowAlert('Error', 'Email already exists', 5000);
                }
                if (!IS_VALID && data.data[0].VALID == -1 && API_FLAG_120) {
                    if (JSON.parse(data.data[1].VALID).results[CODES_VALUE_120] == 0) {
                        $scope.$parent.CUSTOM_FIELDS_LIST[INDEX_120].FIELD_VALUE = '';
                        $scope.$parent.ShowAlert('Error', 'Email already exists and Invalid pin code', 5000);
                    }
                }
                if (!IS_VALID && data.data[0].VALID > 0) {
                    if (JSON.parse(data.data[1].VALID).results != undefined && JSON.parse(data.data[1].VALID).results.length == 0) {
                        $scope.$parent.CUSTOM_FIELDS_LIST[INDEX_120].FIELD_VALUE = '';
                        $scope.$parent.ShowAlert('Error', 'Invalid pin code', 5000);
                        $('#EFFECTIVE_DATA').modal('hide');
                    }
                }
                $scope.$parent.overlay_loadingNew = 'none';
            });
        }
        else {
            if (count == 1) {
                $scope.$parent.ShowAlert('Error', 'Please Upload File', 3000);
            }
            if (count == 2) {
                $scope.$parent.ShowAlert('Error', 'Please select Country', 3000);
            }
        }
    };

    $scope.GO_BACK = function (FLAG) {
        //$scope.STEP_FLAG = FLAG;
        $location.path('Addemployee').search('EmpID', $scope.EmpID).search('STG', 3);
    };
    $scope.GO_BACK_TO_LIST = function (FLAG) {
        $location.path('team')
    };

    $scope.TAB_CLICK = function (FLAG) {
        $scope.HR_GET_EMPLOYEE();
    };
    //$scope.EMP_CONTACT_NO = function () {
    //    $scope.EmpSearch_2.EMR_CONTACT_NUMBER = "";
    //    var lngth = $scope.COUNTRY.filter(function (x) { return x.MOBILE_CODE == $scope.EmpSearch_2.EMP_MOBILE_CODE })
    //    if (lngth.length > 0) {
    //        $scope.EMP_MOBILE_LENGTH = lngth[0].MOBILE_LENGTH;
    //        $scope.MobileValidation($scope.EMP_MOBILE_LENGTH);
    //    }

    //}
    //$scope.ADD_CONTACT_NO = function () {
    //    $scope.EmpSearch_2.MOBILE_NO = "";
    //    var lngth = $scope.COUNTRY.filter(function (x) { return x.MOBILE_CODE == $scope.EmpSearch_2.BUSS_MOBILE_CODE })
    //    if (lngth.length > 0) {
    //        $scope.BUSS_MOBILE_LENGTH = lngth[0].MOBILE_LENGTH;
    //        $scope.MobileValidation1($scope.BUSS_MOBILE_LENGTH);
    //    }
    //}
    $scope.ngCOUNTRY = function (PRECUSTOM_FIELD, CUSTOM_FIELD, ONCHANGEFLAG, Data_Obj) {
        var Lst = PRECUSTOM_FIELD.COUNTRY.filter(function (x) { return x.COUNTRY_ID == PRECUSTOM_FIELD.FIELD_VALUE })
        if (Lst.length > 0) {
            PRECUSTOM_FIELD.MOBILE_CODE = Lst[0].TABLE_ID;
            PRECUSTOM_FIELD.EMR_CODE = Lst[0].TABLE_ID;
            PRECUSTOM_FIELD.EMR_CODE = Lst[0].TABLE_ID;
            // $scope.ADD_CONTACT_NO();
            // $scope.EMP_CONTACT_NO();
        }
    };

    $scope.REDIRECTTOTEAM = function (FLAG) {
        window.location.href = '../DashBoard/hrIndex#!/team?stp=' + FLAG;
    };

    $scope.CONTRACT_DETAILS = function () {
        $location.path('EditContact');
    };
    $scope.TERMINATION_DETAILS = [];
    if ($filter('lowercase')($location.absUrl()).indexOf("viewcontact") != -1) {
        $scope.GET_VIEW_EMPLOYEE_PROFILE = function () {
            $scope.$parent.$parent.overlay_loadingNew = 'block'
            var ModelObj = new Object();
            ModelObj.EMPLOYEE_ID = $scope.EmpID;
            ModelObj.STEP_NO = $scope.STEP_FLAG;
            ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));;
            PrcCommMethods.HR_API(ModelObj, 'HR_GET_EMPLOYEE').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.ViewEmpSearch_2 = data.data.Table[0];
                    $scope.ViewEmpSearch_2.COLMD = 'col-md-4';
                    $scope.ViewEmpSearch_2.IS_HEADER = true;
                    $scope.GET_CUSTOM_LABEL_APP_FIELD_MAPPING(6, data.data.Table[0]);
                }
                //if (data.data.Table1.length > 0) {
                //    $scope.$parent.EmpSearch_HEADER = data.data.Table1[0];
                //}

            });
        }
        //$scope.GET_VIEW_EMPLOYEE_PROFILE();
    };
    $scope.GET_EMPLOYEE_PROFILE_HEADER = function () {
        var PosiModelObj = new Object();
        PosiModelObj.EMPLOYEE_ID = $scope.EmpID;
        PrcCommMethods.HR_API(PosiModelObj, 'GET_EMPLOYEE_PROFILE_HEADER').then(function (data) {
            $scope.$parent.EmpSearch_HEADER = data.data.Table[0];
            $scope.STEP_NO = data.data.Table1[0].STEP_NO;
            $scope.EMP_SEARCH_NAME_DTL = data.data.Table1[0];
            $scope.TERMINATION_DETAILS = data.data.Table2;
            if ($filter('lowercase')($location.absUrl()).indexOf("viewcontact") != -1 || $filter('lowercase')($location.absUrl()).indexOf("editcontact") != -1) {
                $scope.$parent.CalculetteService(data.data.Table[0]);
            }
        });
        $scope.IS_EDITABLE_FLAG = true;
        if ($scope.EmpID == parseInt($cookies.get("EMPLOYEE_ID"))) {
            $scope.IS_EDITABLE_FLAG = false;
            $scope.EDIT_PROFILE_CHECK_MODULE_ACCESS = $scope.CheckSubModuleAccess(4);
        }
        else {
            $scope.EDIT_PROFILE_CHECK_MODULE_ACCESS = $scope.$parent.CHECK_MODULE_ACCESS(3, 3);
        }
    };
    $scope.GET_EMPLOYEE_PROFILE_HEADER();

    ///////////////////UpComing and History Code/////////////////////////////////
    $scope.EFFECTIVE_SEARCH = {
        EFFECTIVE_DATE: null,
        COMMENTS: '',
    };
    $scope.GetDataHistory = true;
    $scope.HISTORY_HEADERS_LIST = [];
    $scope.HISTORY_DETAILS_LIST = [];
    $scope.HR_GET_HISTORY_HEADERS_LAZY_LOAD = function () {
        $scope.HR_GET_HISTORY_HEADERS();
    };
    $scope.HistorySearch = {

    };
    $scope.HR_GET_HISTORY_HEADERS = function (FLAG, LINE) {
        var PosiModelObj = new Object();
        if (FLAG == undefined) {
            $scope.HistorySearch.PAGE_NO = 1;
            $scope.HistorySearch.PAGE_SIZE = 10;
        }
        $scope.$parent.$parent.overlay_loadingNew = 'block'
        PosiModelObj.APP_PAGE_ID = 6;
        PosiModelObj.TABLE_ID = $scope.ObjectData.EMP_CNT_ID;
        PosiModelObj.PAGE_NO = $scope.HistorySearch.PAGE_NO;
        PosiModelObj.PAGE_SIZE = $scope.HistorySearch.PAGE_SIZE;
        PrcCommMethods.HR_API(PosiModelObj, 'HR_GET_HISTORY_HEADERS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.HISTORY_HEADERS_LIST = $scope.HISTORY_HEADERS_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.HistorySearch.PAGE_SIZE) {
                    $scope.GetDataHistory = false;
                }
                else {
                    $scope.HistorySearch.PAGE_NO = parseInt($scope.HistorySearch.PAGE_NO) + 1;
                    $scope.GetDataHistory = true;
                }
            }
            else {
                if ($scope.HISTORY_HEADERS_LIST.length == 0) {
                }
                $scope.GetDataHistory = false;
                $scope.$parent.$parent.overlay_loadingNew = 'none';
            }
            $scope.$parent.$parent.overlay_loadingNew = 'none'
        });
    };
    $scope.POP_EMPLOYEE_STEP_FLAG = function (LBL_TEXT) {
        var IS_VALID = true;
        var count = 0;
        var CheckBoxList = $scope.$parent.CUSTOM_FIELDS_LIST.filter(x => x.FIELD_TYPE_ID == 7 && x.IS_MANDATORY == true);
        if (CheckBoxList.length > 0) {
            for (var i = 0; i < CheckBoxList.length; i++) {
                if (CheckBoxList[i].checkedOption.length == 0) {
                    IS_VALID = false;
                    break;
                }
            }
        }
        var FILE_UPLOAD_LIST = $scope.$parent.CUSTOM_FIELDS_LIST.filter(x => x.FIELD_TYPE_ID == 11 && x.IS_MANDATORY == true);
        if (FILE_UPLOAD_LIST.length > 0) {
            for (var i = 0; i < FILE_UPLOAD_LIST.length; i++) {
                if (FILE_UPLOAD_LIST[i].UploadedFiles == undefined || FILE_UPLOAD_LIST[i].UploadedFiles.length == 0) {
                    IS_VALID = false;
                    count++;
                    break;
                };
            };
        };
        $scope.CustomForm.submitted = true;
        if ($scope.CustomForm.$valid && IS_VALID) {
            if (LBL_TEXT != undefined && LBL_TEXT != '') {
                $scope.EFFECTIVEForm.submitted = true;
                if ($scope.EFFECTIVEForm.$valid) {
                    $scope.HR_INS_UPD_EMPLOYEE_STEP_2(LBL_TEXT)
                }
                else {
                    $('#EFFECTIVE_DATA').modal('show');
                }
            }
            else {
                $('#EFFECTIVE_DATA').modal('show');
            }
        }
        else {
            if (count > 0) {
                $scope.$parent.ShowAlert('Error', 'Please Upload File', 3000);
            }
        }
    };
    /////////////////////End UpComing and History Code///////////////////////////////////

    $scope.$parent.child_scope = $scope;
});
app.controller('EmploymentController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $('.modal-backdrop').removeClass('modal-backdrop fade show');
    $scope.COMMON_CODE_CHANGE();
    $scope.$parent.SCROLL_TOP();
    $scope.$parent.TabActive(2);
    $scope.IS_ACCESS_ADD_MORE_FEILD = $scope.$parent.CheckSubModuleAccess(118);
    $scope.$parent.EFFECTIVE_RESET_LOAD();
    $scope.EFFECTIVE_DATA_LIST = [];

    $scope.EMP_SEARCH_NAME_DTL = {}
    $scope.ObjectHistoryData = {};

    $scope.$parent.$parent.overlay_loadingNew = 'block';
    $scope.$parent.FTE = $scope.$parent.GET_ENTITY_SETTINGS(1)[0].SETTING_VALUE;
    //  $scope.$parent.START_DAY_OF_WEEK = $scope.$parent.GET_ENTITY_SETTINGS(4)[0].SETTING_VALUE;
    $filter('lowercase')($location.absUrl()).indexOf("editempemplment") != -1 ? $scope.EDIT_PAGE = true : $scope.EDIT_PAGE = false;
    $scope.ObjectData = [];
    $scope.EmpID = getUrlParameter('EmpID', $location.absUrl());
    $scope.STEP_FLAG = 3;
    $scope.BACKTOTEAM = "Back To Team";
    $scope.EmpSearch_3 = {
        EMP_EMENT_ID: 0,
        Emp_ID: null,
        COMPANY_ID: null,
        DEPARTMENT_ID: null,
        DIVISION_ID: null,
        COST_CENTER_ID: null,
        LOCATION_ID: null,
        BRANCH_ID: null,
        AREA_ID: null,
        EMP_CATEGORY_ID: null,
        EMP_SUB_CATE_ID: null,
        NOTICE_PERIOD_ID: null,
        PAGE_NO: 1,
        PAGE_SIZE: 10,
    }
    $scope.ResetEmp = function () {
        $scope.EmpSearch = {
            DEPARTMENT_NAME: "",
            DEPARTMENT_COLOR: '',
            PARENT_DEPARTMENT_ID: null,
            PAGE_NO: 1,
            PAGE_SIZE: 10,
        }
    };
    $scope.DateInputLoad = function () {
        $(document).ready(function () {
            var date_inputs = document.getElementsByClassName("dateinput") //our date input has the name "date"
            if (date_inputs.length > 0) {
                for (var i = 0; i < date_inputs.length; i++) {
                    var date_input = $('input[name="' + date_inputs[i].name + '"]'); //our date input has the name "date"
                    var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
                    var date = new Date();
                    var options = {
                        todayBtn: "linked",
                        daysOfWeekHighlighted: "0,6",
                        autoclose: true,
                        todayHighlight: true,
                        format: 'M dd, yyyy',
                        clearBtn: true,
                        closeBtn: true,// close button visible
                        startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate())
                    };
                    date_input.datepicker(options);
                }
            }
        });
    };
    $scope.DateInputLoad();

    $scope.REPORTING_MANAGER_LIST = [];
    $scope.GET_REPORTING_MANAGER_BY_POSITION = function (PREVIOUS_FIELD, CUSTOM_FIELD, RE_FILL_CUSTOM_FIELD) {
        var PosiModelObj = new Object();
        PosiModelObj.POSITION_ID = $scope.GET_ENTITY_SETTINGS(32)[0].SETTING_VALUE == "1" ? 0 : PREVIOUS_FIELD.FIELD_VALUE;// -- 0 WHEN SETTING 32 IS ON 
        PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PosiModelObj.EMP_PRS_ID = $scope.EmpID;
        PrcCommMethods.HR_API(PosiModelObj, 'GET_REPORTING_MANAGER_BY_POSITION').then(function (data) {
            if (data.data.Table.length > 0) {
                var Nam = data.data.Table.filter(function (x) { return x.TABLE_ID !== parseInt($scope.EmpID) });
                CUSTOM_FIELD.OPTION_LIST = Nam;
                CUSTOM_FIELD.OPTION_LIST_COPY = Nam;
                if (PREVIOUS_FIELD.OPTION_LIST != undefined) {
                    var IsMandayCheck = PREVIOUS_FIELD.OPTION_LIST.filter(function (x) { return x.POSITION_ID == PREVIOUS_FIELD.FIELD_VALUE });
                    if (IsMandayCheck.length > 0) {
                        if (IsMandayCheck[0].TOP_POSITION || $scope.GET_ENTITY_SETTINGS(32)[0].SETTING_VALUE == "1") {
                            CUSTOM_FIELD.IS_MANDATORY = false;
                        }
                        else {
                            CUSTOM_FIELD.IS_MANDATORY = true;
                        }
                    }
                    if (RE_FILL_CUSTOM_FIELD != undefined) {
                        CUSTOM_FIELD.FIELD_VALUE = CUSTOM_FIELD.FIELD_VALUE_TEXT;
                    }
                }
            }
            else {
                CUSTOM_FIELD.OPTION_LIST = [];
                var IsMandayCheck = PREVIOUS_FIELD.OPTION_LIST.filter(function (x) { return x.POSITION_ID == PREVIOUS_FIELD.FIELD_VALUE });
                if (IsMandayCheck.length > 0) {
                    if (IsMandayCheck[0].TOP_POSITION || $scope.GET_ENTITY_SETTINGS(32)[0].SETTING_VALUE == "1") {
                        CUSTOM_FIELD.IS_MANDATORY = false;
                    }
                    else {
                        CUSTOM_FIELD.IS_MANDATORY = true;
                    }
                }
            }
        });
    };
    $scope.GET_REPORTING_MANAGER_BY_POSITION_1_2 = function (CUSTOM_FIELD) {
        var PosiModelObj = new Object();
        PosiModelObj.POSITION_ID = 0
        PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PosiModelObj.EMP_PRS_ID = $scope.EmpID;
        PrcCommMethods.HR_API(PosiModelObj, 'GET_REPORTING_MANAGER_BY_POSITION').then(function (data) {
            if (data.data.Table.length > 0) {
                var Nam = data.data.Table.filter(function (x) { return x.TABLE_ID !== parseInt($scope.EmpID) });
                CUSTOM_FIELD.OPTION_LIST = Nam;
                CUSTOM_FIELD.OPTION_LIST_COPY = Nam;
            }
        });
    };

    $scope.EFFECTIVE_SEARCH = { EFFECTIVE_DATE: null, COMMENTS: '', };
    $scope.Positionsearch = {};
    $scope.ViewPositionSearch_1 = {};
    $scope.ViewPositionSearch_2 = {};
    $scope.ViewPositionSearch_3 = {};

    $scope.POSITIONS_RESET = function () {
        $scope.Positionsearch = {
        };
        $scope.PostionForm.submitted = false;
    }
    $scope.POSITIONS_CANCEL = function () {
        $('#AddPosition').modal('hide');
    }

    $scope.HR_GET_POSITION_DTLS = function (CUSTOM_FIELD) {
        var PosiModelObj = new Object();
        PosiModelObj.POSITION_ID = CUSTOM_FIELD.FIELD_VALUE_ID == undefined ? CUSTOM_FIELD.FIELD_VALUE : CUSTOM_FIELD.FIELD_VALUE_ID;
        PrcCommMethods.HR_API(PosiModelObj, 'HR_GET_POSITION').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.ViewPositionSearch_1 = data.data.Table[0];
                $scope.ViewPositionSearch_1.COLMD = 'col-md-4';
                $scope.ViewPositionSearch_1.Table3 = data.data.Table2;
                $scope.GET_CUSTOM_LABEL_APP_FIELD_MAPPING(2, data.data.Table[0]);

                $scope.ViewPositionSearch_2 = data.data.Table3[0];
                $scope.ViewPositionSearch_2.COLMD = 'col-md-4';
                $scope.GET_CUSTOM_LABEL_APP_FIELD_MAPPING(3, data.data.Table3[0]);
                $scope.ViewPositionSearch_3 = data.data.Table4[0];
                $scope.ViewPositionSearch_3.COLMD = 'col-md-4';
                $scope.GET_CUSTOM_LABEL_APP_FIELD_MAPPING(4, data.data.Table4[0]);

            }
            else {
                CUSTOM_FIELD.DTLS = [];
            }
        });
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
    $scope.POP_POSITION = function (CUSTOM_FIELD) {
        $('#position').modal('show');
        $scope.HR_GET_POSITION_DTLS(CUSTOM_FIELD);
    };
    $scope.HR_GET_POSITION = function (CUSTOM_FIELD, ONCHANGEFLAG) {
        var PosiModelObj = new Object();
        PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PosiModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        PosiModelObj.ACTIVE = 1;
        PosiModelObj.FLAG = 2;
        PosiModelObj.PAGE_NO = 0;
        PosiModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
        PosiModelObj.ADMIN_FLAG = $scope.$parent.CheckSubModuleAccess(47) ? 1 : 3;
        PosiModelObj.SORT_COLUMN_NO = 1;
        PosiModelObj.SORT_ORDER_NO = 1
        PrcCommMethods.HR_API(PosiModelObj, 'HR_GET_POSITION_LIST').then(function (data) {
            //$scope.POSITION_LIST = data.data.Table;
            if (data.data.Table.length > 0) {
                CUSTOM_FIELD.OPTION_LIST = data.data.Table;
                CUSTOM_FIELD.OPTION_LIST_COPY = data.data.Table;
            }
            else {
                CUSTOM_FIELD.OPTION_LIST = [];
            }
            if (ONCHANGEFLAG == 1) {
                var index_292 = $scope.$parent.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 292);
                $scope.GET_REPORTING_MANAGER_BY_POSITION(CUSTOM_FIELD, $scope.$parent.CUSTOM_FIELDS_LIST[index_292]);
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
    $scope.ADMIN_GET_HR_EMP_DECLARATION_MASTER = function (CUSTOM_FIELD, ONCHANGEFLAG) {
        var PosiModelObj = new Object();
        PosiModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        PosiModelObj.ACTIVE = 1;
        PosiModelObj.PAGE_NO = 0;
        PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PrcCommMethods.HR_API(PosiModelObj, 'ADMIN_GET_HR_EMP_DECLARATION_MASTER').then(function (data) {
            //    CUSTOM_FIELD.CONTRACT_TYPE = data.data.Table;
            if (data.data.Table.length > 0) {
                data.data.Table.push({ TABLE_ID: -1, DISPLAY_TEXT: '--Please Select--' })
                CUSTOM_FIELD.OPTION_LIST = data.data.Table;
                CUSTOM_FIELD.DISPLAY_FIELD_TEXT = '--Please Select--';
                if (ONCHANGEFLAG == 1) {
                    var Result = CUSTOM_FIELD.OPTION_LIST.filter(function (x) { return x.TABLE_ID == CUSTOM_FIELD.FIELD_VALUE })
                    //  CUSTOM_FIELD.DECLERATION_ID = Result[0].TABLE_ID;
                    if (Result.length > 0) {
                        CUSTOM_FIELD.DISPLAY_FIELD_TEXT = Result[0].DISPLAY_TEXT;
                    }
                }
            }
            else {
                CUSTOM_FIELD.OPTION_LIST = [];
            }
        });
    };

    $scope.HR_GET_NOTICE_PERIOD = function (CUSTOM_FIELD) {
        var PosiModelObj = new Object();
        PosiModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        PosiModelObj.ENTITY_ID = 0;
        PosiModelObj.ACTIVE = 1;
        PosiModelObj.PAGE_NO = 0;
        PosiModelObj.PAGE_SIZE = 0;
        PrcCommMethods.ADMIN_API(PosiModelObj, 'ADMIN_GET_NOTICE_PERIOD').then(function (data) {
            if (data.data.Table.length > 0) {
                CUSTOM_FIELD.OPTION_LIST = data.data.Table;
            }
            else {
                CUSTOM_FIELD.OPTION_LIST = [];
            }

        });
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

    $scope.Departmentsearch = { DEPARTMENT_NAME: "", }

    $scope.DEPARTMENT_REST = function () {
        $scope.Departmentsearch = {
            DEPARTMENT_NAME: "",
        };
        $scope.DepartmentForm.submitted = false;
    }
    $scope.INS_UPD_DEPARTMENT = function () {
        $scope.DepartmentForm.submitted = true;
        if ($scope.DepartmentForm.$valid) {
            var DeptModelObj = new Object();
            var color = document.getElementById('ids2').value;
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
                    var index_363 = $scope.$parent.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 363);
                    $scope.HR_GET_DEPARTMENTS($scope.$parent.CUSTOM_FIELDS_LIST[index_363]);
                    $scope.DEPARTMENT_REST();
                }
            });

        }
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
    $scope.HR_GET_POSITION_BY_ID = function (CUSTOM_FIELD) {
        var PosiModelObj = new Object();
        PosiModelObj.POSITION_ID = CUSTOM_FIELD.FIELD_VALUE;
        PosiModelObj.STEP_NO = 0;
        PrcCommMethods.HR_API(PosiModelObj, 'HR_GET_POSITION').then(function (data) {
            if (data.data.Table4.length > 0) {

                if ($scope.GET_ENTITY_SETTINGS(31)[0].SETTING_VALUE != "1") {
                    var index_340 = $scope.$parent.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === CUSTOM_FIELD.DEPENDANT_ID_340);
                    var index_339 = $scope.$parent.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === CUSTOM_FIELD.DEPENDANT_ID_339);
                    var index_337 = $scope.$parent.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === CUSTOM_FIELD.DEPENDANT_ID_337);
                    var index_338 = $scope.$parent.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 338);
                    var index_341 = $scope.$parent.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 341);
                    var index_342 = $scope.$parent.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 342);
                    var index_343 = $scope.$parent.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 343);
                    var index_344 = $scope.$parent.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 344);
                    var index_345 = $scope.$parent.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 345);
                    if (index_340 > -1) {
                        $scope.$parent.CUSTOM_FIELDS_LIST[index_340].FIELD_VALUE = data.data.Table4[0].WORK_PATTERN_ID;
                    }
                    if (index_339 > -1) {
                        $scope.$parent.CUSTOM_FIELDS_LIST[index_339].FIELD_VALUE = data.data.Table4[0].FTE;
                    }
                    if (index_337 > -1) {
                        $scope.$parent.CUSTOM_FIELDS_LIST[index_337].FIELD_VALUE = data.data.Table4[0].WEEKLY_HOURS;
                    }
                    if (index_338 > -1) {
                        $scope.$parent.CUSTOM_FIELDS_LIST[index_338].FIELD_VALUE = data.data.Table4[0].NO_OF_SHIFTS_PER_WEEK + '';
                    }
                    if (index_341 > -1) {
                        $scope.$parent.CUSTOM_FIELDS_LIST[index_341].FIELD_VALUE = data.data.Table4[0].CONTRACT_TYPE_ID;
                    }
                    if (index_342 > -1) {
                        $scope.$parent.CUSTOM_FIELDS_LIST[index_342].FIELD_VALUE = data.data.Table4[0].PROBATION_PERIOD_ID;
                    }
                    if (index_343 > -1) {
                        $scope.$parent.CUSTOM_FIELDS_LIST[index_343].FIELD_VALUE = data.data.Table4[0].OVERTIME_ELIGIBILITY;
                    }
                    if (index_344 > -1) {
                        $scope.$parent.CUSTOM_FIELDS_LIST[index_344].FIELD_VALUE = data.data.Table4[0].HOLIDAY_ENTITLEMENT_NAME;
                    }
                    if (index_345 > -1) {
                        $scope.$parent.CUSTOM_FIELDS_LIST[index_345].FIELD_VALUE = data.data.Table4[0].TRONC_ELIGIBILITY;
                    }
                    if (data.data.Table4[0].NO_OF_DAYS > 0) {
                        var index_144 = $scope.$parent.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 144);
                        var index_143 = $scope.$parent.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 143);
                        var hors = parseInt(data.data.Table4[0].NO_OF_DAYS) * 24;
                        if (index_144 > -1 && index_143 > -1) {
                            $scope.CUSTOM_FIELDS_LIST[index_144].FIELD_VALUE = moment(new Date(new Date($scope.CUSTOM_FIELDS_LIST[index_143].FIELD_VALUE).setHours(hors))).format("LL") == "Invalid date" ? '' : moment(new Date(new Date($scope.CUSTOM_FIELDS_LIST[index_143].FIELD_VALUE).setHours(hors))).format("LL");
                            $scope.$parent.EFFICTIVE_ON_CHANGE($scope.CUSTOM_FIELDS_LIST[index_144]);
                        }
                    }
                }
            }
            if (data.data.Table3.length > 0) {
                if ($scope.GET_ENTITY_SETTINGS(31)[0].SETTING_VALUE != "1") {
                    var index_346 = $scope.$parent.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 346);
                    var index_347 = $scope.$parent.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 347);
                    var index_348 = $scope.$parent.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 348);
                    var index_349 = $scope.$parent.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 349);
                    var index_350 = $scope.$parent.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 350);
                    if (index_346 > 0) {
                        $scope.$parent.CUSTOM_FIELDS_LIST[index_346].FIELD_VALUE = data.data.Table3[0].COST_CENTER_ID;
                    }
                    if (index_347 > 0) {
                        $scope.$parent.CUSTOM_FIELDS_LIST[index_347].FIELD_VALUE = data.data.Table3[0].LOCATION_ID;
                    }
                    if (index_349 > 0) {
                        $scope.$parent.CUSTOM_FIELDS_LIST[index_349].FIELD_VALUE = data.data.Table3[0].EMP_CATEGORY_ID;
                    }
                    if (index_348 > 0) {
                        $scope.$parent.CUSTOM_FIELDS_LIST[index_348].FIELD_VALUE = data.data.Table3[0].BRANCH_ID;
                    }
                    if (index_347 > 0 && index_348 > 0) {
                        $scope.GET_LOCATION_BRANCHES($scope.$parent.CUSTOM_FIELDS_LIST[index_347], $scope.$parent.CUSTOM_FIELDS_LIST[index_348]);
                    }
                    if (index_350 > 0) {
                        $scope.$parent.CUSTOM_FIELDS_LIST[index_350].FIELD_VALUE = data.data.Table3[0].EMP_SUB_CATE_ID;
                    }
                    if (index_349 > 0 && index_350 > 0) {
                        $scope.SUB_GET_EMPLOYEE_CATEGORY($scope.$parent.CUSTOM_FIELDS_LIST[index_349], $scope.$parent.CUSTOM_FIELDS_LIST[index_350]);
                    }
                }
            }
        });
    };
    $scope.GET_WORK_PERMIT_TYPE = function () {
        var PosiModelObj = new Object();
        PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PrcCommMethods.HR_API(PosiModelObj, 'GET_WORK_PERMIT_TYPE').then(function (data) {
            $scope.WORK_PERMIT_TYPE = data.data.Table;
        });
    };
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
                    var index_146 = $scope.$parent.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 146);
                    $scope.HR_GET_POSITION($scope.$parent.CUSTOM_FIELDS_LIST[index_146], 1);
                    $scope.$parent.ShowAlert('Success', 'Position Added Successfully', 5000);
                    $('#AddPosition').modal('hide');
                    $scope.POSITIONS_RESET();
                }
            });

        }
    }
    $scope.HR_GET_EMPLOYEE = function () {
        $scope.EFFECTIVE_DATA_LIST = [];
        var PosiModelObj = new Object();
        PosiModelObj.EMPLOYEE_ID = $scope.EmpID;
        PosiModelObj.STEP_NO = 3;
        PosiModelObj.LOGIN_USER_EMP_ID = parseInt($cookies.get("EMPLOYEE_ID"));
        PosiModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PrcCommMethods.HR_API(PosiModelObj, 'HR_GET_EMPLOYEE').then(function (data) {
            if (data.data.Table2.length > 0) { /// true meain disable 
                $scope.$parent.DISABLE_BRANCH_CHANGE = data.data.Table2[0].DISABLE_BRANCH_CHANGE;
            };
            if (data.data.Table.length > 0) {
                $scope.EmpSearch_3 = data.data.Table[0];
                $scope.EMP_EMENT_ID = data.data.Table[0].EMP_EMENT_ID;
                $scope.ObjectData = data.data.Table[0];
                $scope.ObjectHistoryData = data.data.Table[0];
                $scope.EFFECTIVE_DATA_LIST = data.data.Table1;
                if (data.data.Table2.length > 0) {
                    $scope.ObjectData.DISABLE_BRANCH_CHANGE = data.data.Table2[0].DISABLE_BRANCH_CHANGE;
                };
                $scope.COLMD = 'col-md-4';
                $scope.$parent.GET_CUSTOM_APP_FIELD_MAPPING(7, $scope.COLMD);
                if ($filter('lowercase')($location.absUrl()).indexOf("editempemplment") != -1) {
                    //  $('#EFFECTIVE_DATA').modal('show');
                }
                if ($filter('lowercase')($location.absUrl()).indexOf("viewempemplment") != -1) {

                    $scope.ViewEmpSearch_3 = data.data.Table[0];
                    $scope.ViewEmpSearch_3.COLMD = 'col-md-4';
                    data.data.Table[0].IS_HEADER = true;
                    //$scope.ViewEmpSearch_3.Table1 = data.data.Table1;
                    $scope.GET_CUSTOM_LABEL_APP_FIELD_MAPPING(7, data.data.Table[0], data);
                }
            }
            else {
                $scope.COLMD = 'col-md-4';
                $scope.$parent.GET_CUSTOM_APP_FIELD_MAPPING(7, $scope.COLMD);
            };

        });
    };
    $scope.COMMON_PAGE_LOAD_FY = function () {
        $scope.HR_GET_EMPLOYEE();
        $scope.GET_EMPLOYEE_PROFILE_HEADER();
    }
    if ($scope.EmpID > 0) {
        $scope.HR_GET_EMPLOYEE()
    }
    else {
        $scope.$parent.$parent.overlay_loadingNew = 'none';
    };
    $scope.HR_INS_UPD_EMPLOYEE_STEP_3 = function (FLAG) {
        var IS_VALID = true;
        var count = 0;
        var CheckBoxList = $scope.$parent.CUSTOM_FIELDS_LIST.filter(x => x.FIELD_TYPE_ID == 7 && x.IS_MANDATORY == true);
        if (CheckBoxList.length > 0) {
            for (var i = 0; i < CheckBoxList.length; i++) {
                if (CheckBoxList[i].checkedOption.length == 0) {
                    IS_VALID = false;
                    break;
                };
            };
        };
        var FILE_UPLOAD_LIST = $scope.$parent.CUSTOM_FIELDS_LIST.filter(x => x.FIELD_TYPE_ID == 11 && x.IS_MANDATORY == true);
        if (FILE_UPLOAD_LIST.length > 0) {
            for (var i = 0; i < FILE_UPLOAD_LIST.length; i++) {
                if (FILE_UPLOAD_LIST[i].UploadedFiles == undefined || FILE_UPLOAD_LIST[i].UploadedFiles.length == 0) {
                    IS_VALID = false;
                    count = 1;
                    break;
                };
            };
        };
        var index292 = $scope.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 292);
        var index364 = $scope.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 364);
        var index365 = $scope.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 365);

        if (index292 > 0 && index364 > 0 && index365 > 0 || index292 > 0 && index364 > 0 && index365 < 0) {
            var FIELD_VALUE_365 = null;
            var FIELD_VALUE_292 = $scope.CUSTOM_FIELDS_LIST[index292].FIELD_VALUE;
            var FIELD_VALUE_364 = $scope.CUSTOM_FIELDS_LIST[index364].FIELD_VALUE;
            if (index365 > 0) { var FIELD_VALUE_365 = $scope.CUSTOM_FIELDS_LIST[index365].FIELD_VALUE; }
            if (FIELD_VALUE_292 !== null && FIELD_VALUE_364 != null) {
                if (FIELD_VALUE_292 == FIELD_VALUE_364) {
                    count = 2;
                }
            }
            if (FIELD_VALUE_292 !== null && FIELD_VALUE_365 != null) {
                if (FIELD_VALUE_292 == FIELD_VALUE_365) {
                    count = 2;
                }
            }
            if (FIELD_VALUE_364 !== null && FIELD_VALUE_365 != null) {
                if (FIELD_VALUE_364 == FIELD_VALUE_365) {
                    count = 2;
                }
            }
        }
        $scope.CustomForm.submitted = true;
        if ($scope.CustomForm.$valid && IS_VALID && count == 0) {
            var EmpModelObj = new Object();
            EmpModelObj.EMP_PRS_ID = $scope.EmpID;
            EmpModelObj.EMP_EMENT_ID = $scope.EMP_EMENT_ID;
            var IsValidCount = 0;
            angular.forEach($scope.$parent.CUSTOM_FIELDS_LIST, function (val) {
                val.IsValidCount = 0;
                if (val.FIELD_VALUE == undefined) {
                    val.FIELD_VALUE = '';
                }
                if (val.FIELD_TYPE_ID == 6 || val.FIELD_TYPE_ID == 7 || val.FIELD_TYPE_ID == 11) {
                    $scope.$parent.INSERT_FIELD_TYPE_ID_SET_VALUE(val.FIELD_TYPE_ID, val, $scope.EDIT_PAGE);
                    if (val.IsValidCount > 0) {
                        IsValidCount++;
                    }
                }
                if ($scope.EDIT_PAGE && val.FIELD_TYPE_ID != 3 && val.FIELD_TYPE_ID != 5 && val.FIELD_TYPE_ID != 10 || ($scope.EDIT_PAGE && val.FIELD_TYPE_ID == 3 && !val.IS_DB_DROPDOWN)) {
                    if (val.FIELD_TYPE_ID == 9) {
                        val.CHANGE_FLAG == 1 ? val.FIELD_VALUE == "" ? EmpModelObj[val.NG_MODEL] = '1/1/0001' : EmpModelObj[val.NG_MODEL] = val.FIELD_VALUE : val.FIELD_VALUE = null;
                    }
                    else {
                        EmpModelObj[val.NG_MODEL] = val.CHANGE_FLAG == 1 ? val.FIELD_VALUE : null;
                    }
                    //if (val.FIELD_MASTER_ID == 292) {
                    //    EmpModelObj.REPORTING_MANAGER_IDS = val.CHANGE_FLAG == 1 ? val.FIELD_VALUE == '' || val.FIELD_VALUE == undefined || val.FIELD_VALUE == null ? -1 : val.FIELD_VALUE : null;
                    //}

                    if (val.FIELD_MASTER_ID == 356) {
                        EmpModelObj[val.NG_MODEL] = val.CHANGE_FLAG == 1 ? val.FIELD_VALUE == -1 ? null : val.FIELD_VALUE : null;
                    }
                    else if (val.FIELD_MASTER_ID == 338) {
                        EmpModelObj.NO_OF_SHIFTS_PER_WEEK = val.CHANGE_FLAG == 1 ? parseFloat(val.FIELD_VALUE) : null;
                    }
                    else if (val.FIELD_MASTER_ID == 143) {
                        // EmpModelObj[val.NG_MODEL] = moment(val.FIELD_VALUE, "DD/MM/YYYY").format('L');
                    }
                    else if (val.FIELD_MASTER_ID == 353 || val.FIELD_MASTER_ID == 354) {
                        if (val.FIELD_VALUE != undefined && val.FIELD_VALUE != null && val.FIELD_VALUE != '') {
                            EmpModelObj[val.NG_MODEL] = val.CHANGE_FLAG == 1 ? moment(val.FIELD_VALUE, "DD/MM/YYYY").format('L') : null;
                        }
                    }
                }
                else {
                    EmpModelObj[val.NG_MODEL] = val.FIELD_VALUE;
                    if (val.FIELD_TYPE_ID == 9) {
                        val.FIELD_VALUE == "" ? EmpModelObj[val.NG_MODEL] = '1/1/0001' : EmpModelObj[val.NG_MODEL] = val.FIELD_VALUE;
                    }
                    //if (val.FIELD_MASTER_ID == 292) {
                    //    EmpModelObj.REPORTING_MANAGER_IDS = val.FIELD_VALUE == '' || val.FIELD_VALUE == undefined || val.FIELD_VALUE == null ? -1 : val.FIELD_VALUE;
                    //}
                    if (val.FIELD_MASTER_ID == 338) {
                        EmpModelObj.NO_OF_SHIFTS_PER_WEEK = parseFloat(val.FIELD_VALUE);
                    }
                    else if (val.FIELD_MASTER_ID == 143) {
                        // EmpModelObj[val.NG_MODEL] = moment(val.FIELD_VALUE, "DD/MM/YYYY").format('L');
                    }
                    else if (val.FIELD_MASTER_ID == 356) {
                        EmpModelObj[val.NG_MODEL] = val.FIELD_VALUE == -1 ? null : val.FIELD_VALUE;
                    }
                    else if (val.FIELD_MASTER_ID == 353 || val.FIELD_MASTER_ID == 354) {
                        if (val.FIELD_VALUE != undefined && val.FIELD_VALUE != null && val.FIELD_VALUE != '') {
                            EmpModelObj[val.NG_MODEL] = moment(val.FIELD_VALUE, "DD/MM/YYYY").format('L');
                        }
                    }
                }
            });

            $scope.CustomForm.submitted = false;
            EmpModelObj.USER_ID = parseInt($cookies.get("USERID"));

            EmpModelObj.EFFECTIVE_DATE = $scope.EFFECTIVE_SEARCH.EFFECTIVE_DATE;
            EmpModelObj.COMMENTS = $scope.EFFECTIVE_SEARCH.COMMENTS;
            EmpModelObj.SELF_UPDATE_FLAG = ($cookies.get("EMPLOYEE_ID") == parseInt(getUrlParameter('EmpID', $location.absUrl()))) ? 1 : 0;
            PrcCommMethods.HR_API(EmpModelObj, 'HR_INS_UPD_EMPLOYEE_STEP_3').then(function (data) {
                if (FLAG == 1) {
                    $scope.$parent.ShowAlert('Success', 'Employment Added Successfully', 5000);
                    $location.path('team')
                }
                else if (FLAG == 'VIEW') {
                    $scope.$parent.ShowAlert('Success', 'Employment Updated Successfully', 5000);
                    $location.path('ViewEmpemplment')
                }
                else if (data.data == 0) {
                    $scope.$parent.ShowAlert('Error', $scope.SOMETHINGWENTWRONG, 5000);
                }
                else {
                    $scope.STEP_FLAG = 4;
                    //$scope.EmpSearch_3.EMP_EMENT_ID = data.data;
                    $scope.$parent.ShowAlert('Success', 'Contact Added Successfully', 5000);
                    $location.path('EmpQualifi').search('EmpID', $scope.EmpID).search('STG', 4)
                    $scope.$parent.ShowAlert('Success', 'Employment Added Successfully', 5000);
                }
            });
        }
        else {
            if (count == 1) {
                $scope.$parent.ShowAlert('Error', 'Please Upload File', 3000);
            }
            if (count == 2) {
                $scope.$parent.ShowAlert('Error', 'Reporting Manager can not be same', 3000);
            }
            $('#EFFECTIVE_DATA').modal('hide');
        }
    };
    $scope.GO_BACK_TO_LIST = function (FLAG) {
        $location.path('team')
    };
    $scope.TAB_CLICK = function (FLAG) {
        // $location.path('team')
        $scope.STEP_FLAG = FLAG;
        $scope.HR_GET_EMPLOYEE();
    };
    $scope.REDIRECTTOTEAM = function (FLAG) {
        window.location.href = '../DashBoard/hrIndex#!/team?stp=' + FLAG;
    };
    $scope.GO_BACK = function (FLAG) {
        //$scope.STEP_FLAG = FLAG;
        $location.path('EmpContact').search('EmpID', $scope.EmpID).search('STG', 3);
    };
    $scope.TERMINATION_DETAILS = [];

    $scope.GET_EMPLOYEE_PROFILE_HEADER = function () {
        var PosiModelObj = new Object();
        PosiModelObj.EMPLOYEE_ID = $scope.EmpID;
        PrcCommMethods.HR_API(PosiModelObj, 'GET_EMPLOYEE_PROFILE_HEADER').then(function (data) {
            $scope.$parent.EmpSearch_HEADER = data.data.Table[0];
            $scope.STEP_NO = data.data.Table1[0].STEP_NO;
            $scope.EMP_SEARCH_NAME_DTL = data.data.Table1[0];
            $scope.TERMINATION_DETAILS = data.data.Table2;
            if ($filter('lowercase')($location.absUrl()).indexOf("viewempemplment") != -1 || $filter('lowercase')($location.absUrl()).indexOf("editempemplment") != -1) {
                $scope.$parent.CalculetteService(data.data.Table[0]);
            }
        });
        $scope.IS_EDITABLE_FLAG = true;
        if ($scope.EmpID == parseInt($cookies.get("EMPLOYEE_ID"))) {
            $scope.IS_EDITABLE_FLAG = false;
        }
        else {
            $scope.EDIT_PROFILE_CHECK_MODULE_ACCESS = $scope.$parent.CHECK_MODULE_ACCESS(3, 3);
        }
    };
    $scope.GET_EMPLOYEE_PROFILE_HEADER();
    $scope.EDIT_EMPLOYMENT = function () {
        $location.path('EditEmpemplment');
    };

    $scope.POP_EMPLOYEE_STEP_FLAG = function (LBL_TEXT) {
        var IS_VALID = true;
        var count = 0;
        var CheckBoxList = $scope.$parent.CUSTOM_FIELDS_LIST.filter(x => x.FIELD_TYPE_ID == 7 && x.IS_MANDATORY == true);
        if (CheckBoxList.length > 0) {
            for (var i = 0; i < CheckBoxList.length; i++) {
                if (CheckBoxList[i].checkedOption.length == 0) {
                    IS_VALID = false;
                    break;
                }
            }
        }
        var FILE_UPLOAD_LIST = $scope.$parent.CUSTOM_FIELDS_LIST.filter(x => x.FIELD_TYPE_ID == 11 && x.IS_MANDATORY == true);
        if (FILE_UPLOAD_LIST.length > 0) {
            for (var i = 0; i < FILE_UPLOAD_LIST.length; i++) {
                if (FILE_UPLOAD_LIST[i].UploadedFiles == undefined || FILE_UPLOAD_LIST[i].UploadedFiles.length == 0) {
                    IS_VALID = false;
                    count++;
                    break;
                };
            };
        };
        $scope.CustomForm.submitted = true;
        //var selectedValues = $('#multipleSelect').val();
        if ($scope.CustomForm.$valid && IS_VALID) {
            if (LBL_TEXT != undefined && LBL_TEXT != '') {
                $scope.EFFECTIVEForm.submitted = true;
                if ($scope.EFFECTIVEForm.$valid) {
                    $scope.HR_INS_UPD_EMPLOYEE_STEP_3(LBL_TEXT)
                }
                else {
                    $('#EFFECTIVE_DATA').modal('show');
                }
            }
            else {
                $('#EFFECTIVE_DATA').modal('show');
            }
        }
        else {
            if (count > 0) {
                $scope.$parent.ShowAlert('Error', 'Please Upload File', 3000);
            }
        }
    };

    $scope.$parent.child_scope = $scope;
});
app.controller('QualificationsController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $('.modal-backdrop').removeClass('modal-backdrop fade show');
    $scope.CHECK_MODULE_ACCESS = false;
    $scope.COMMON_CODE_CHANGE();
    $scope.$parent.TabActive(2);
    $scope.ObjectHistoryData = {
    };
    $scope.EMP_SEARCH_NAME_DTL = {
    }
    $scope.$parent.$parent.overlay_loadingNew = 'block'
    $scope.$parent.SCROLL_TOP();
    $scope.EmpID = getUrlParameter('EmpID', $location.absUrl());
    $scope.ObjectData = [];
    $scope.CourseList = [];
    $scope.BACKTOTEAM = "Back To Team";
    $scope.STEP_FLAG = 4;
    //$scope.NATIONALITY_LIST = [{ ID: 1, NAME: "India" }, { ID: 2, NAME: "Bahrain" }, { ID: 3, NAME: "Dubai" }];
    //$scope.NATIONAL_ID_LIST = [{ ID: 1, NAME: "India1" }, { ID: 2, NAME: "Bahrain1" }, { ID: 3, NAME: "Dubai1" }];
    $scope.EDIT_PAGE = false;
    //   $filter('lowercase')($location.absUrl()).indexOf("empqualifi") != -1 ? $scope.EDIT_PAGE = true : $scope.EDIT_PAGE = false;

    $scope.Course = { TABLE_ID: 0, COURSE_NAME: "", EXPIRY_DATE: "", UPLOAD_IDS: "", DELETE_FLAG: 0 };
    $scope.EmpSearch_4 = {
        EMP_QUAL_ID: 0,
        FREQUENCY_ID: null,
        Emp_ID: null,
        COMPANY_ID: null,
    };
    $scope.ResetEmp = function () {
        $scope.EmpSearch = {
            DEPARTMENT_NAME: "",
            DEPARTMENT_COLOR: '',
            PARENT_DEPARTMENT_ID: null,
            PAGE_NO: 1,
            PAGE_SIZE: 10,
        }
    };

    $scope.DateInputLoad = function () {
        $(document).ready(function () {
            var date_inputs = document.getElementsByClassName("dateinput") //our date input has the name "date"
            if (date_inputs.length > 0) {
                for (var i = 0; i < date_inputs.length; i++) {
                    var date_input = $('input[name="' + date_inputs[i].name + '"]'); //our date input has the name "date"
                    var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
                    var date = new Date();
                    var options = {
                        todayBtn: "linked",
                        daysOfWeekHighlighted: "0,6",
                        autoclose: true,
                        todayHighlight: true,
                        format: 'M dd, yyyy',
                        clearBtn: true,
                        closeBtn: true,// close button visible
                        startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate())
                    };
                    date_input.datepicker(options);
                }
            }
        });
    };
    $scope.DateInputLoad();

    $scope.AddCourseLine = function () {
        $scope.CourseList.push(angular.copy($scope.Course));
        $scope.DateInputLoad();
    };
    $scope.AddCourseLine();

    $scope.CourseListDelete = [];

    $scope.RemoveCourceLine = function (LINE, index) {
        if (confirm('Are you Sure?')) {
            if (LINE.TABLE_ID == 0) {
                $scope.CourseList.splice(index, 1);
            }
            else {
                LINE.DELETE_FLAG = 1;
                $scope.CourseListDelete.push(angular.copy(LINE));
                $scope.CourseList.splice(index, 1);
            }
        }
    };
    $scope.NG_INIT_COURSE = function (CRS) {
        CRS.randomId = $scope.$parent.generaterandom(12);
    };

    $scope.HR_GET_COURSE_MASTER = function () {
        var PosiModelObj = new Object();
        PosiModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        PosiModelObj.COURSE_ID = 0
        PosiModelObj.COURSE_NAME = '';
        PosiModelObj.ACTIVE = 1;
        PosiModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PrcCommMethods.ADMIN_API(PosiModelObj, 'ADMIN_GET_HR_COURSE_MASTER').then(function (data) {
            $scope.COURSE_MASTER = data.data.Table;
        });
    };
    $scope.HR_GET_COURSE_MASTER();

    $scope.HR_GET_EMPLOYEE = function () {
        $scope.EFFECTIVE_DATA_LIST = [];
        var PosiModelObj = new Object();
        PosiModelObj.EMPLOYEE_ID = $scope.EmpID;
        PosiModelObj.STEP_NO = 4;
        PosiModelObj.LOGIN_USER_EMP_ID = parseInt($cookies.get("EMPLOYEE_ID"));
        PrcCommMethods.HR_API(PosiModelObj, 'HR_GET_EMPLOYEE').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.CourseList = [];
                var Data_Course = $filter('unique')(data.data.Table, 'TABLE_ID');
                $scope.EmpSearch_4.EMP_QUAL_ID = Data_Course[0].TABLE_ID;

                angular.forEach(Data_Course, function (val) {
                    var a = data.data.Table.filter(function (x) { return x.TABLE_ID == val.TABLE_ID && x.ORIGINAL_FILE_NAME != null });
                    if (a.length > 0) {
                        val.UploadedFiles = a;
                    }
                    $scope.CourseList.push(val);
                })
                //if (data.data.Table1.length > 0) {
                //    $scope.$parent.EmpSearch_HEADER = data.data.Table1[0];
                //    $scope.STEP_NO = data.data.Table1[0].STEP_NO;
                //}
                $scope.DateInputLoad();
            }

            if ($filter('lowercase')($location.absUrl()).indexOf("viewqualifi") != -1) {
                //if (data.data.Table.length > 0) {
                //    $scope.CourseList = [];
                //    var Data_Course = $filter('unique')(data.data.Table, 'TABLE_ID');
                //    $scope.EmpSearch_4.EMP_QUAL_ID = Data_Course[0].TABLE_ID;
                //    angular.forEach(Data_Course, function (val) {
                //        val.UploadedFiles = [];
                //        var a = data.data.Table.filter(function (x) { return x.TABLE_ID == val.TABLE_ID && x.ORIGINAL_FILE_NAME != null });
                //        if (a.length > 0) {
                //            val.UploadedFiles = a;
                //        }
                //        $scope.CourseList.push(val);
                //    })
                //    $scope.DateInputLoad();
                //    $scope.$parent.$parent.overlay_loadingNew = 'none'
                //}
            }


            $scope.$parent.$parent.overlay_loadingNew = 'none'
        });
    };

    if ($scope.EmpID > 0) {
        $scope.HR_GET_EMPLOYEE();
    }
    else {
        // $scope.GET_DEFAULT_CURRENCY_BY_EMP();
    };
    $scope.getTheFilesToUploadCource = function ($files, ControlName, FileSize, List, Attachment_UPLOAD_TYPE_ID, index) {
        if (FileSize == undefined || FileSize == null || FileSize == 0 || FileSize == '') {
            FileSize = AppVal.FileSize;
        }
        $scope.imagesrc = [];
        var valid = 0;
        for (var i = 0; i < $files.length; i++) {

            if ($scope.Attachment_UPLOAD_TYPE_ID == 12) {
                var validFormats = ['MPEG4', 'MP4', 'video/mp4'];
            }
            else {
                var validFormats = ['doc', 'docx', 'xml', 'pdf', 'csv', 'txt', 'text', 'jpg', 'jpeg', 'png', 'MPEG4', 'MP4', 'video/mp4', 'excel'];
            }
            var validity = validFormats.map(function (element) {
                if ($files[i].type.indexOf(element) != -1) {
                    return 1;
                }
                else {
                    return 0;
                }
            });
            valid = validity.indexOf(1);

            if (valid != -1) {
                if (($files[i].size / 1000000).toFixed(2) <= FileSize) {//File Size should not be more than 5 MB
                    var reader = new FileReader();
                    reader.fileName = $files[i].name;
                    reader.onload = function (event) {
                        var image = {};
                        image.Name = event.target.fileName;
                        image.Size = (event.total / 1024).toFixed(2);
                        image.Src = event.target.result;
                        $scope.imagesrc.push(image);
                        $scope.$apply();
                    }
                    //     reader.readAsDataURL($files[i]);
                    reader.readAsText($files[i]);
                }
                else {
                    $scope.ShowAlert('Error', 'Maximum File Size ' + FileSize + ' MB.', 5000);
                    angular.element("input[id='" + ControlName + "']").val(null);
                    return;
                }
            }
            else {
                $scope.ShowAlert('Error', 'Not a valid file.', 5000);
                angular.element("input[id='" + ControlName + "']").val(null);
                return;
            }

        }
        $scope.Files = $files;

        var fileUpload = document.getElementById("certificate" + index);
        extension = fileUpload.files[0].name;;
        $scope.uploadFiles(Attachment_UPLOAD_TYPE_ID, '', extension, List, index);
    };
    $scope.uploadFiles = function (Attachment_UPLOAD_TYPE_ID, ATTACHEMENT_TYPE_ID, filename, List, index) {
        if (($scope.Files != undefined && $scope.Files.length > 0)) {
            $scope.DocImageResult = [];
            var data = new FormData();
            data.append("RelativeID", List.TABLE_ID == 0 ? $scope.EmpID + List.randomId + "" + index : List.TABLE_ID);
            data.append("UPLOAD_TYPE_ID", Attachment_UPLOAD_TYPE_ID);
            data.append("VIRTUALPATH", '/Customer/Entity/' + parseInt($cookies.get("ENTITY_ID")) + '/HR/Employee/' + $scope.EmpID + '/Qualifications/');
            data.append("UPLOAD_ID", 0);
            data.append("ORIGINAL_FILE_NAME", filename);
            data.append("USER_ID", parseInt($cookies.get("USERID")));
            if (isNaN(parseInt($cookies.get("ENTITY_ID")))) {
                data.append("ENTITY_ID", 0);
            }
            else {
                data.append("ENTITY_ID", parseInt($cookies.get("ENTITY_ID")));
            }
            for (var i in $scope.Files) {
                data.append("uploadedFile", $scope.Files[i]);
            }
            var request = {
                method: 'POST',
                url: CommService.Get_CASHUP_API() + "api/PayrollAPI/UPLOADFILES",
                data: data,
                headers: {
                    'Content-Type': undefined
                }
            };
            $http(request).then(function (d) {

                if (d.data.length > 0 && d.data[0].UPLOADED_COMMENT != undefined) {
                    $scope.ShowAlert('Error', d.data[0].UPLOADED_COMMENT, 5000);
                }
                else {
                    List.UploadedFiles = d.data;
                }



                if (List.UPLOAD_IDS_REMOVE.length > 0) {
                    angular.forEach(List.UPLOAD_IDS_REMOVE, function (REMOVE_FILE) {
                        var index = List.UploadedFiles.findIndex(x => x.UPLOAD_ID === REMOVE_FILE.UPLOAD_ID);
                        if (index > -1) {
                            List.UploadedFiles.splice(index, 1);
                        }
                    });
                    //angular.forEach(List.UploadedFiles, function (UPLOAD_FILE) {
                    //    var index = List.UPLOAD_IDS_REMOVE.findIndex(x=>x.TABLE_ID === UPLOAD_FILE.TABLE_ID);
                    //    List.UploadedFiles.splice(index, 1);

                    //    //angular.forEach(List.UPLOAD_IDS_REMOVE, function (REMOVE_FILE) {
                    //    //})
                    //});
                }
            });
        }
    };
    $scope.DELETE_UPLOAD_QUALIFICATION = function (Array, item, index, FLAG) {
        if (confirm('Are you sure you want to delete the file?')) {
            if (FLAG == 1) {
                Array.splice(index, 1);
            }
            else {
                if (Array.UPLOAD_IDS_REMOVE == undefined) {
                    Array.UPLOAD_IDS_REMOVE = [];
                }
                Array.UPLOAD_IDS_REMOVE.push(angular.copy(item));
                Array.UploadedFiles.splice(index, 1);
            }
        }
    };
    $scope.HR_INS_UPD_EMPLOYEE_STEP_4 = function (FLAG) {
        $scope.EmpDtlsForm_4.submitted = true;
        if ($scope.EmpDtlsForm_4.$valid) {
            var EmpModelObj = new Object();
            EmpModelObj.EMP_PRS_ID = $scope.EmpID;
            EmpModelObj.EMPLOYEE_ID = $scope.EmpID;
            EmpModelObj.EMP_QUAL_ID = $scope.EmpSearch_4.EMP_QUAL_ID;
            EmpModelObj.STEP_NO = 4;
            EmpModelObj.USER_ID = parseInt($cookies.get("USERID"));
            EmpModelObj.QUALIFICATIONS = [];
            $scope.CourseListFinal = [];
            $scope.COURCE_VALID = true;
            var count = 0
            angular.forEach($scope.CourseList, function (value) {
                var CRSL = $scope.CourseList.filter(function (x) { return x.COURSE_MASTER_ID == value.COURSE_MASTER_ID });
                if (CRSL.length > 1) {
                    count++;
                    $scope.$parent.ShowAlert('Error', 'Course name should not be duplicate', 3000);
                }
                else {
                    var coulst = new Object();
                    coulst.TABLE_ID = value.TABLE_ID;
                    coulst.COURSE_NAME = value.COURSE_MASTER_ID == 1 ? value.COURSE_NAME_OTHERS : null;
                    coulst.COURSE_ID = value.COURSE_MASTER_ID;
                    coulst.EXPIRY_DATE = value.EXPIRY_DATE == undefined || value.EXPIRY_DATE == "" || value.EXPIRY_DATE == null ? '01-JAN-0001' : value.EXPIRY_DATE;
                    coulst.UPLOAD_IDS_ADD = value.UPLOAD_IDS == undefined ? "" : value.UPLOAD_IDS;
                    coulst.UPLOAD_IDS_REMOVE = "";
                    coulst.DELETE_FLAG = 0;
                    if (value.UploadedFiles == "" || value.UploadedFiles == undefined || value.UploadedFiles == null || value.UploadedFiles.length == 0) {
                        count++;
                        $scope.COURCE_VALID = false;
                    }
                    if (value.TABLE_ID == 0) {
                        angular.forEach(value.UploadedFiles, function (val) {
                            if (value.UPLOAD_IDS == "" || value.UPLOAD_IDS == undefined || value.UPLOAD_IDS == null) {
                                value.UPLOAD_IDS = val.ID;
                            }
                            else {
                                value.UPLOAD_IDS = value.UPLOAD_IDS + ',' + val.ID
                            }
                        });
                        if ($scope.EDIT_PAGE) {

                        }
                        else {
                            coulst.UPLOAD_IDS_ADD = value.UPLOAD_IDS;
                        }
                    }
                    var i = '';
                    angular.forEach(value.UPLOAD_IDS_REMOVE, function (val) {
                        if (i == "") {
                            i = val.UPLOAD_ID;
                            coulst.UPLOAD_IDS_REMOVE = i;
                        }
                        else {
                            coulst.UPLOAD_IDS_REMOVE = i + ',' + val.UPLOAD_ID;
                        }
                    });
                    $scope.CourseListFinal.push(coulst);
                }
            });
            if ($scope.CourseListDelete.length > 0) {
                angular.forEach($scope.CourseListDelete, function (value) {
                    var coulst = new Object();
                    coulst.TABLE_ID = value.TABLE_ID;
                    coulst.COURSE_NAME = null;
                    coulst.COURSE_ID = 0;
                    coulst.EXPIRY_DATE = value.EXPIRY_DATE;
                    coulst.UPLOAD_IDS_ADD = "";
                    coulst.UPLOAD_IDS_REMOVE = "";
                    coulst.DELETE_FLAG = 1;
                    $scope.CourseListFinal.push(coulst);
                });
            }
            EmpModelObj.QUALIFICATIONS = $scope.CourseListFinal;
            EmpModelObj.SELF_UPDATE_FLAG = ($cookies.get("EMPLOYEE_ID") == parseInt(getUrlParameter('EmpID', $location.absUrl()))) ? 1 : 0;
            if (count == 0) {
                PrcCommMethods.HR_API(EmpModelObj, 'HR_INS_UPD_EMPLOYEE_STEP_4').then(function (data) {
                    if (data.data == 0) {
                        $scope.$parent.ShowAlert('Error', $scope.SOMETHINGWENTWRONG, 5000);
                    }
                    else if (FLAG == 1) {
                        $scope.$parent.ShowAlert('Success', 'Qualifications Added Successfully', 5000);
                        $location.path('team')
                    }
                    else if (FLAG == 'VIEW') {
                        $scope.$parent.ShowAlert('Success', 'Qualifications Updated Successfully', 5000);
                        $location.path('ViewQualifi')
                    }
                    else {
                        $scope.STEP_FLAG = 5;
                        $location.path('EmpComp').search('EmpID', $scope.EmpID).search('STG', 5)
                        //$scope.CourseList = [];
                        //var Data_Course = $filter('unique')(data.data, 'TABLE_ID');
                        //$scope.EmpSearch_4.EMP_QUAL_ID = Data_Course[0].TABLE_ID;
                        //angular.forEach(Data_Course, function (val) {
                        //    var a = data.data.Table.filter(function (x) { return x.ORIGINAL_FILE_NAME != null });
                        //    if (a.length > 0) {
                        //        val.uploadFiles = a;
                        //    }
                        //    $scope.CourseList.push(val);
                        //})
                        $scope.$parent.ShowAlert('Success', 'Qualifications Added Successfully', 5000);
                    }
                });
            }
        }
    };
    $scope.GO_BACK = function (FLAG) {
        //$scope.STEP_FLAG = FLAG;
        $location.path('Empemplment').search('EmpID', $scope.EmpID).search('STG', 3);
    };
    $scope.GO_FORWARD = function (FLAG) {
        var EmpModelObj = new Object();
        EmpModelObj.EMP_PRS_ID = $scope.EmpID;
        EmpModelObj.EMPLOYEE_ID = $scope.EmpID;
        EmpModelObj.EMP_QUAL_ID = $scope.EmpSearch_4.EMP_QUAL_ID;
        EmpModelObj.STEP_NO = 4;
        EmpModelObj.USER_ID = parseInt($cookies.get("USERID"));
        EmpModelObj.QUALIFICATIONS = [];
        $scope.CourseListFinal = [];
        var coulst = new Object();
        coulst.TABLE_ID = null;
        coulst.COURSE_NAME = null;
        coulst.COURSE_ID = 0;
        coulst.EXPIRY_DATE = null;
        coulst.UPLOAD_IDS_ADD = "";
        coulst.UPLOAD_IDS_REMOVE = "";
        coulst.DELETE_FLAG = 0;
        $scope.CourseListFinal.push(coulst);
        EmpModelObj.QUALIFICATIONS = $scope.CourseListFinal;
        PrcCommMethods.HR_API(EmpModelObj, 'HR_INS_UPD_EMPLOYEE_STEP_4').then(function (data) {
            $location.path('EmpComp').search('EmpID', $scope.EmpID).search('STG', 5)
        });
    };
    $scope.GO_BACK_TO_LIST = function (FLAG) {
        $location.path('team')
    };

    $scope.TAB_CLICK = function (FLAG) {
        // $location.path('team')
        $scope.STEP_FLAG = FLAG;
        $scope.HR_GET_EMPLOYEE();
    };

    $scope.REDIRECTTOTEAM = function (FLAG) {
        window.location.href = '../DashBoard/hrIndex#!/team?stp=' + FLAG;
    };

    $scope.NG_COURSE_NAME = function (ID, LIST) {
        LIST.COURSE_NAME = "";
        LIST.COURSE_NAME_IS = false;
        if (ID == 1) {
            LIST.COURSE_NAME_IS = true;
        }
    };

    if ($filter('lowercase')($location.absUrl()).indexOf("viewqualifi") != -1) {
        $scope.GET_VIEW_EMPLOYEE_PROFILE = function () {
            $scope.$parent.$parent.overlay_loadingNew = 'block'
            var ModelObj = new Object();
            ModelObj.EMPLOYEE_ID = $scope.EmpID;
            ModelObj.STEP_NO = 4;
            ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));;
            PrcCommMethods.HR_API(ModelObj, 'HR_GET_EMPLOYEE').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.CourseList = [];
                    var Data_Course = $filter('unique')(data.data.Table, 'TABLE_ID');
                    $scope.EmpSearch_4.EMP_QUAL_ID = Data_Course[0].TABLE_ID;
                    angular.forEach(Data_Course, function (val) {
                        val.UploadedFiles = [];
                        var a = data.data.Table.filter(function (x) { return x.TABLE_ID == val.TABLE_ID && x.ORIGINAL_FILE_NAME != null });
                        if (a.length > 0) {
                            val.UploadedFiles = a;
                        }
                        $scope.CourseList.push(val);
                    })
                    $scope.DateInputLoad();
                    $scope.$parent.$parent.overlay_loadingNew = 'none'
                }
                //if (data.data.Table1.length > 0) {
                //    $scope.$parent.EmpSearch_HEADER = data.data.Table1[0];
                //    $scope.STEP_NO = data.data.Table1[0].STEP_NO;
                //}
            });
        }
        $scope.GET_VIEW_EMPLOYEE_PROFILE();
    };
    $scope.TERMINATION_DETAILS = [];
    $scope.GET_EMPLOYEE_PROFILE_HEADER = function () {
        var PosiModelObj = new Object();
        PosiModelObj.EMPLOYEE_ID = $scope.EmpID;
        PrcCommMethods.HR_API(PosiModelObj, 'GET_EMPLOYEE_PROFILE_HEADER').then(function (data) {
            $scope.$parent.EmpSearch_HEADER = data.data.Table[0];
            $scope.STEP_NO = data.data.Table1[0].STEP_NO;
            $scope.EMP_SEARCH_NAME_DTL = data.data.Table1[0];
            $scope.TERMINATION_DETAILS = data.data.Table2;
            if ($filter('lowercase')($location.absUrl()).indexOf("viewqualifi") != -1 || $filter('lowercase')($location.absUrl()).indexOf("editempqualifi") != -1) {
                $scope.$parent.CalculetteService(data.data.Table[0]);
            }
        });
        $scope.IS_EDITABLE_FLAG = true;
        if ($scope.EmpID == parseInt($cookies.get("EMPLOYEE_ID"))) {
            $scope.IS_EDITABLE_FLAG = false;
            $scope.EDIT_PROFILE_CHECK_MODULE_ACCESS = $scope.CheckSubModuleAccess(4);
        }
        else {
            $scope.EDIT_PROFILE_CHECK_MODULE_ACCESS = $scope.$parent.CHECK_MODULE_ACCESS(3, 3);
        }
    };
    $scope.GET_EMPLOYEE_PROFILE_HEADER();
    $scope.ADD_QUALIFICATION = function () {
        $location.path('EditEmpQualifi');
        //$scope.HR_GET_COURSE_MASTER();
    };
    $scope.$parent.child_scope = $scope;
});
app.controller('CompensationController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $('.modal-backdrop').removeClass('modal-backdrop fade show');
    $scope.COMMON_CODE_CHANGE();
    $scope.$parent.TabActive(2);
    $scope.$parent.SCROLL_TOP();
    $scope.IS_COMPENSATION_PAGE = true;
    $scope.IS_ACCESS_ADD_MORE_FEILD = $scope.$parent.CheckSubModuleAccess(118);
    $scope.$parent.EFFECTIVE_RESET_LOAD();
    $scope.EFFECTIVE_DATA_LIST = [];
    $scope.ObjectHistoryData = {
    };
    $scope.EMP_SEARCH_NAME_DTL = {
    }
    $scope.$parent.$parent.overlay_loadingNew = 'block'
    $scope.$parent.COLMD = 'col-md-4';
    $scope.EmpID = getUrlParameter('EmpID', $location.absUrl());
    $filter('lowercase')($location.absUrl()).indexOf("editempcomp") != -1 ? $scope.EDIT_PAGE = true : $scope.EDIT_PAGE = false;
    $scope.$parent.EDIT_PAGE = $scope.EDIT_PAGE
    $scope.BACKTOTEAM = "Back To Team";
    $scope.STEP_FLAG = 5;
    $scope.ObjectData = [];
    $scope.PASSWORD_LIST = [{ ID: 1, NAME: "Code" }, { ID: 2, NAME: "Other" }];
    //$scope.IS_EDIT_COMPENSATION = $scope.$parent.CheckSubModuleAccess(5);
    $scope.$parent.IS_COMPENSATION = false;
    $scope.IS_COMPENSATION = false;
    $scope.LABEL_ANNUAL_HOURLY = 'Annual Salary';
    $scope.IS_ANNUAL = true;
    $scope.EmpSearch_5 = {
        EMP_COMPST_ID: 0,
        UNIT_ID: null,
        Emp_ID: null,
        COMPANY_ID: null,
    };
    $scope.ResetEmp = function () {
        $scope.EmpSearch = {
            DEPARTMENT_NAME: "",
            DEPARTMENT_COLOR: '',
            PARENT_DEPARTMENT_ID: null,
            PAGE_NO: 1,
            PAGE_SIZE: 10,
        }
    };
    $scope.DateInputLoad = function () {
        $(document).ready(function () {
            var date_inputs = document.getElementsByClassName("dateinput") //our date input has the name "date"
            if (date_inputs.length > 0) {
                for (var i = 0; i < date_inputs.length; i++) {
                    var date_input = $('input[name="' + date_inputs[i].name + '"]'); //our date input has the name "date"
                    var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
                    var date = new Date();
                    var options = {
                        todayBtn: "linked",
                        daysOfWeekHighlighted: "0,6",
                        autoclose: true,
                        todayHighlight: true,
                        format: 'M dd, yyyy',
                        clearBtn: true,
                        closeBtn: true,// close button visible
                        startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate())
                    };
                    date_input.datepicker(options);
                }
            }
        });
    };
    $scope.DateInputLoad();
    $scope.ADDITIONAL_PAY_LIST = [];
    $scope.ADDITIONAL_PAY = { TABLE_ID: 0, PAY_CODE_ID: null, PAY_FREQUENCY_ID: null, RATE: "", AMOUNT: "", DELETE_FLAG: 0, IS_MANDATORY: false, IS_SELECT: false };
    $scope.ngchangeadditionpayment = function (item, index) {
        if (item != undefined) {
            item.count = 0;
            item.IS_MANDATORY = false;
            item.IS_SELECT = false;
            if (item.PAY_CODE_ID != undefined && item.PAY_CODE_ID != null && item.PAY_CODE_ID != '') {
                item.IS_MANDATORY = true;
                item.IS_SELECT = true;
                if (item.PREV_DATA.length > 0) {
                    if (item.PAY_CODE_ID != item.PREV_DATA[0].PAY_CODE_ID) {
                        item.count++;
                    }
                }
            };
            if (item.PAY_FREQUENCY_ID != undefined && item.PAY_FREQUENCY_ID != null && item.PAY_FREQUENCY_ID != '') {
                item.IS_MANDATORY = true;
                item.IS_SELECT = true;
                if (item.PREV_DATA.length > 0) {
                    if (item.PAY_FREQUENCY_ID != item.PREV_DATA[0].PAY_FREQUENCY_ID) {
                        item.count++;
                    }
                }
            }

            if (item.AMOUNT != undefined && item.AMOUNT != null && item.AMOUNT != '') {
                item.IS_MANDATORY = true;
                item.IS_SELECT = true;
                if (item.PREV_DATA.length > 0) {
                    if (item.AMOUNT != item.PREV_DATA[0].AMOUNT) {
                        item.count++;
                    }
                }
            }
            if (item.RATE != undefined && item.RATE != null && item.RATE != '') {
                item.IS_MANDATORY = true;
                item.IS_SELECT = true;
                if (item.PREV_DATA.length > 0) {
                    if (item.RATE != item.PREV_DATA[0].RATE) {
                        item.count++;
                    }
                }
            }

        }
    };
    $scope.EFFECTIVE_SEARCH = { EFFECTIVE_DATE: null, COMMENTS: '', };
    $scope.ADD_ADDITIONAL_PAY = function (FLAG) {
        if (FLAG == undefined) {
            $scope.ADDITIONAL_PAY.IS_MANDATORY = true;
        }
        $scope.ADDITIONAL_PAY_LIST.push(angular.copy($scope.ADDITIONAL_PAY));
    };
    $scope.ADD_ADDITIONAL_PAY(1);

    $scope.GET_HR_COST_CENTER = function (CUSTOM_FIELD) {
        var PosiModelObj = new Object();
        PosiModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PosiModelObj.ACTIVE = 1;
        PosiModelObj.PAGE_NO = 0;
        PosiModelObj.PAGE_SIZE = 0;
        PrcCommMethods.HR_API(PosiModelObj, 'ADMIN_GET_COST_CENTER').then(function (data) {
            if (data.data.Table.length > 0) {
                CUSTOM_FIELD.OPTION_LIST = data.data.Table;
            }
            else {
                CUSTOM_FIELD.OPTION_LIST = [];
            }

        });
    };
    $scope.GET_PAY_FREQUENCY = function (CUSTOM_FIELD, ONCHANGEFLAG, Data_Obj) {
        var PosiModelObj = new Object();
        PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PrcCommMethods.ADMIN_API(PosiModelObj, 'ADMIN_GET_PAY_FREQUENCY_ENTITY_MAPPING').then(function (data) {
            $scope.PAY_FREQUENCY = data.data.Table.filter(function (x) { return x.ACTIVE == true });
            if (data.data.Table.length > 0 && CUSTOM_FIELD != undefined) {
                CUSTOM_FIELD.OPTION_LIST = $scope.PAY_FREQUENCY;
                $scope.ANNUAL_SALARY_FY(CUSTOM_FIELD)
            }
            else {
                if (CUSTOM_FIELD != undefined) {
                    CUSTOM_FIELD.OPTION_LIST = [];
                }
            }

        });
    };
    $scope.GET_CURRENCY = function (CUSTOM_FIELD, Data_Obj) {
        var PosiModelObj = new Object();
        PosiModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        PrcCommMethods.HR_API(PosiModelObj, 'GET_CURRENCY').then(function (data) {
            $scope.CURRENCY = data.data.Table;
            $scope.EmpSearch_5.ADDITIONAL_CURRENCY_ID = parseInt($cookies.get("CURRENCY_ID"));
            if (data.data.Table.length > 0 && CUSTOM_FIELD != undefined) {
                CUSTOM_FIELD.OPTION_LIST = $scope.CURRENCY;
                if (Data_Obj != undefined || Data_Obj.length == 0) {
                    CUSTOM_FIELD.FIELD_VALUE = parseInt($cookies.get("CURRENCY_ID"));
                }
            }
            else {
                if (CUSTOM_FIELD != undefined) {
                    CUSTOM_FIELD.OPTION_LIST = [];
                }
            }

        });
    };
    $scope.GET_PAID_BY = function (CUSTOM_FIELD) {
        var PosiModelObj = new Object();
        PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PrcCommMethods.ADMIN_API(PosiModelObj, 'ADMIN_GET_PAID_BY_ENTITY_MAPPING').then(function (data) {
            //$scope.PAID_BY = data.data.Table;
            if (data.data.Table.length > 0) {
                CUSTOM_FIELD.OPTION_LIST = data.data.Table.filter(function (x) { return x.ACTIVE == true });
            }
            else {
                CUSTOM_FIELD.OPTION_LIST = [];
            }
        });
    };
    $scope.GET_PAY_CODE = function (CUSTOM_FIELD) {
        var PosiModelObj = new Object();
        PosiModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        PosiModelObj.ACTIVE = 1;
        PosiModelObj.PAGE_NO = 0;
        PosiModelObj.PAGE_SIZE = 0;
        //PosiModelObj.USER_ID = parseInt($cookies.get("ENTITY_ID"));
        PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PrcCommMethods.ADMIN_API(PosiModelObj, 'ADMIN_GET_PAY_CODE').then(function (data) {
            $scope.PAY_CODE = data.data.Table;
            if (data.data.Table.length > 0 && CUSTOM_FIELD != undefined) {
                CUSTOM_FIELD.OPTION_LIST = data.data.Table;
            }
            else {
                if (CUSTOM_FIELD != undefined) {
                    CUSTOM_FIELD.OPTION_LIST = [];
                }
            }
        });
    };
    $scope.GET_PAYMENT_TYPE = function (CUSTOM_FIELD) {
        var PosiModelObj = new Object();
        PosiModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        PosiModelObj.PAYMENT_TYPE_ID = 0;
        PosiModelObj.PAYMENT_TYPE_NAME = '';
        PosiModelObj.ACTIVE = 1;
        PosiModelObj.PAGE_SIZE = 0;
        PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PrcCommMethods.ADMIN_API(PosiModelObj, 'ADMIN_GET_PAYMENT_TYPE').then(function (data) {
            // $scope.PAYMENT_TYPE = data.data.Table;
            if (data.data.Table.length > 0) {
                CUSTOM_FIELD.OPTION_LIST = data.data.Table;
            }
            else {
                CUSTOM_FIELD.OPTION_LIST = [];
            }
        });
    };
    $scope.GET_UNITS = function (CUSTOM_FIELD) {
        var PosiModelObj = new Object();
        PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PrcCommMethods.HR_API(PosiModelObj, 'GET_UNITS').then(function (data) {
            // $scope.UNITS_LIST = data.data.Table;
            if (data.data.Table.length > 0) {
                CUSTOM_FIELD.OPTION_LIST = data.data.Table;
            }
            else {
                CUSTOM_FIELD.OPTION_LIST = [];
            }
        });
    };
    $scope.HR_GET_NI_CATEOGRY_MASTER = function (CUSTOM_FIELD) {
        var PosiModelObj = new Object();
        PosiModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        PosiModelObj.CATEGORY_NAME = '';
        PosiModelObj.ACTIVE = 1;
        PosiModelObj.PAGE_NO = 0;
        PosiModelObj.PAGE_SIZE = 0;
        PrcCommMethods.ADMIN_API(PosiModelObj, 'ADMIN_GET_NI_CATEOGRY_MASTER').then(function (data) {
            // $scope.NI_CATEOGRY_MASTER = data.data.Table;
            if (data.data.Table.length > 0) {
                CUSTOM_FIELD.OPTION_LIST = data.data.Table;
            }
            else {
                CUSTOM_FIELD.OPTION_LIST = [];
            }
        });
    };
    $scope.GET_HR_PENSION_SCHEME = function (CUSTOM_FIELD) {
        var PosiModelObj = new Object();
        PosiModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PrcCommMethods.HR_API(PosiModelObj, 'GET_HR_PENSION_SCHEME').then(function (data) {
            $scope.PENSION_SCHEME = data.data.Table;
            if (data.data.Table.length > 0) {
                CUSTOM_FIELD.OPTION_LIST = data.data.Table;
            }
            else {
                CUSTOM_FIELD.OPTION_LIST = [];
            }
        });
    };
    $scope.GET_PAY_FREQUENCY();
    $scope.GET_PAY_CODE();
    $scope.GET_CURRENCY();
    $scope.GET_DEFAULT_CURRENCY_BY_EMP = function () {
        var PosiModelObj = new Object();
        PosiModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
        PrcCommMethods.HR_API(PosiModelObj, 'GET_DEFAULT_CURRENCY_BY_EMP').then(function (data) {

            $scope.EmpSearch_5.ADDITIONAL_CURRENCY_ID = data.data.Table[0].CURRENCY_ID;
            $scope.EmpSearch_5.PAYMENT_CURRENCY_ID = data.data.Table[0].CURRENCY_ID;

        });
    };
    $scope.ADDITIONAL_PAY_LIST_COPY = [];
    $scope.NG_INIT_ADD_PAY_DE = function (P_LIST) {
        P_LIST.IS_MANDATORY = false;
        P_LIST.IS_SELECT = false;
        if (P_LIST.PAY_CODE_ID != undefined && P_LIST.PAY_CODE_ID != null && P_LIST.PAY_CODE_ID != ''
            || P_LIST.PAY_FREQUENCY_ID != undefined && P_LIST.PAY_FREQUENCY_ID != null && P_LIST.PAY_FREQUENCY_ID != ''
            || P_LIST.RATE != undefined && P_LIST.RATE != null && P_LIST.RATE != ''
            || P_LIST.AMOUNT != undefined && P_LIST.AMOUNT != null && P_LIST.AMOUNT != '') {
            P_LIST.IS_MANDATORY = true;
            P_LIST.IS_SELECT = true;
        }
        P_LIST.count = 0;
        var PREV_DATA = $scope.ADDITIONAL_PAY_LIST_COPY.filter(function (x) { return x.TABLE_ID == P_LIST.TABLE_ID })
        if (PREV_DATA.length > 0) {
            P_LIST.PREV_DATA = PREV_DATA;
        }
    }
    $scope.COMMON_PAGE_LOAD_FY = function () {
        $scope.HR_GET_EMPLOYEE();
        $scope.GET_EMPLOYEE_PROFILE_HEADER();
    }
    $scope.HR_GET_EMPLOYEE = function () {
        $scope.EFFECTIVE_DATA_LIST = [];
        var PosiModelObj = new Object();
        PosiModelObj.EMPLOYEE_ID = $scope.EmpID;
        PosiModelObj.STEP_NO = 5;
        PosiModelObj.LOGIN_USER_EMP_ID = parseInt($cookies.get("EMPLOYEE_ID"));
        PosiModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PrcCommMethods.HR_API(PosiModelObj, 'HR_GET_EMPLOYEE').then(function (data) {
            if (data.data.Table.length > 0) {
                //HIDE_MY_COMPENSATION //false
                if (parseInt($scope.EmpID) == parseInt($cookies.get("EMPLOYEE_ID"))) {
                    if ($scope.$parent.CHECK_MODULE_ACCESS(98, 1)) { //self Compensition
                        $scope.$parent.IS_COMPENSATION = true;
                        $scope.IS_COMPENSATION = true;
                        $scope.IS_EDIT_COMPENSATION = $scope.$parent.CHECK_MODULE_ACCESS(98, 3);
                    }
                    else if ($scope.$parent.CHECK_MODULE_ACCESS(100, 1)) { // All Compensition
                        if (data.data.Table[0].HIDE_MY_COMPENSATION) {
                            $scope.$parent.IS_COMPENSATION = false;
                            $scope.IS_COMPENSATION = false;
                        }
                        else {
                            $scope.$parent.IS_COMPENSATION = true;
                            $scope.IS_COMPENSATION = true;
                        }
                        $scope.IS_EDIT_COMPENSATION = $scope.$parent.CHECK_MODULE_ACCESS(100, 3);
                    }
                    else {
                        $scope.$parent.IS_COMPENSATION = false;
                        $scope.IS_COMPENSATION = false;
                    }
                }
                else if (parseInt($scope.EmpID) != parseInt($cookies.get("EMPLOYEE_ID"))) {
                    if (data.data.Table3[0].IS_BELOW == 1) {
                        if ($scope.$parent.CHECK_MODULE_ACCESS(99, 1)) { // Below Compensition
                            if (data.data.Table[0].HIDE_MY_COMPENSATION) {
                                $scope.$parent.IS_COMPENSATION = false;
                                $scope.IS_COMPENSATION = false;
                            }
                            else {
                                $scope.$parent.IS_COMPENSATION = true;
                                $scope.IS_COMPENSATION = true;
                            }
                            $scope.IS_EDIT_COMPENSATION = $scope.$parent.CHECK_MODULE_ACCESS(99, 3);
                        }
                    }
                    else if ($scope.$parent.CHECK_MODULE_ACCESS(100, 1)) {// All Compensition
                        if (data.data.Table[0].HIDE_MY_COMPENSATION) {
                            $scope.$parent.IS_COMPENSATION = false;
                            $scope.IS_COMPENSATION = false;
                        }
                        else {
                            $scope.$parent.IS_COMPENSATION = true;
                            $scope.IS_COMPENSATION = true;
                        }
                        $scope.IS_EDIT_COMPENSATION = $scope.$parent.CHECK_MODULE_ACCESS(100, 3);
                    }
                }

                $scope.ObjectData = data.data.Table[0];
                $scope.ObjectHistoryData = data.data.Table[0];
                $scope.EMP_COMPST_ID = data.data.Table[0].EMP_COMPST_ID;
                $scope.COLMD = 'col-md-4'
                $scope.$parent.GET_CUSTOM_APP_FIELD_MAPPING(9, $scope.COLMD, $scope.PRE_DEFINE_DATA);
                $scope.EFFECTIVE_DATA_LIST = data.data.Table2;
                if ($filter('lowercase')($location.absUrl()).indexOf("editempcomp") != -1) { // $('#EFFECTIVE_DATA').modal('show');
                }
                if ($filter('lowercase')($location.absUrl()).indexOf("viewempcomp") != -1) {
                    $scope.ViewEmpSearch_5 = {};
                    if (data.data.Table.length > 0) {
                        $scope.ViewEmpSearch_5 = data.data.Table[0];
                        $scope.ViewEmpSearch_5.ADDITIONAL_PAY_LIST = [];
                        $scope.ViewEmpSearch_5.COLMD = 'col-md-4';
                        $scope.ViewEmpSearch_5.APP_PAGE_ID = 9;
                        data.data.Table[0].IS_HEADER = true;
                        $scope.GET_CUSTOM_LABEL_APP_FIELD_MAPPING(9, data.data.Table[0], $scope.PRE_DEFINE_DATA);
                    }
                }
                if (data.data.Table1.length > 0) {
                    $scope.ADDITIONAL_PAY_LIST = data.data.Table1;
                    $scope.ADDITIONAL_PAY_LIST_COPY = angular.copy(data.data.Table1);
                    $scope.ViewEmpSearch_5.ADDITIONAL_PAY_LIST = data.data.Table1;
                    $scope.ViewEmpSearch_5.ADDITIONAL_PAY_LIST_COPY = angular.copy(data.data.Table1);
                }
            }
            else {
                $scope.COLMD = 'col-md-4'
                if ($scope.$parent.EmpSearch_HEADER == undefined) {
                    $scope.$parent.GET_CUSTOM_APP_FIELD_MAPPING(9, $scope.COLMD);
                }
                else {
                    $scope.$parent.GET_CUSTOM_APP_FIELD_MAPPING(9, $scope.COLMD, $scope.$parent.EmpSearch_HEADER[0]);
                }
            }
        });
    };
    $scope.TERMINATION_DETAILS = [];

    $scope.GET_EMPLOYEE_PROFILE_HEADER = function () {
        var PosiModelObj = new Object();
        PosiModelObj.EMPLOYEE_ID = $scope.EmpID;
        PrcCommMethods.HR_API(PosiModelObj, 'GET_EMPLOYEE_PROFILE_HEADER').then(function (data) {
            $scope.$parent.EmpSearch_HEADER = data.data.Table[0];
            $scope.PRE_DEFINE_DATA = data.data.Table[0];

            $scope.STEP_NO = data.data.Table1[0].STEP_NO;
            $scope.EMP_SEARCH_NAME_DTL = data.data.Table1[0];
            $scope.TERMINATION_DETAILS = data.data.Table2;
            //if ($filter('lowercase')($location.absUrl()).indexOf("viewqualifi") != -1 || $filter('lowercase')($location.absUrl()).indexOf("editempqualifi") != -1) {
            if ($filter('lowercase')($location.absUrl()).indexOf("viewempcomp") != -1 || $filter('lowercase')($location.absUrl()).indexOf("editempcomp") != -1) {
                $scope.$parent.CalculetteService(data.data.Table[0]);
            }
            $scope.HR_GET_EMPLOYEE();
        });
        $scope.IS_EDITABLE_FLAG = true;
        //if ($scope.EmpID == parseInt($cookies.get("EMPLOYEE_ID"))) {
        //    $scope.IS_EDITABLE_FLAG = false;
        //}
    };
    $scope.GET_EMPLOYEE_PROFILE_HEADER();

    $scope.HOURLY_PAYMENT_FY = function (PRECUSTOM_FIELD, CUSTOM_FIELD, ONCHANGEFLAG, Data_Obj) {
        var list = PRECUSTOM_FIELD.OPTION_LIST.filter(function (x) { return x.PAY_FREQUENCY_ID == PRECUSTOM_FIELD.FIELD_VALUE });
        if (list.length > 0) {
            if (list[0].HOURLY_PAYMENT == 0) {
                CUSTOM_FIELD.IS_ANNUAL = true;
                CUSTOM_FIELD.ENTITY_COLUMN_NAME = 'Annual Salary';
                if (ONCHANGEFLAG == 1) {
                    CUSTOM_FIELD.FIELD_VALUE = Data_Obj.ANNUAL_SALARY;
                }
            }
            if (list[0].HOURLY_PAYMENT == 1) {
                CUSTOM_FIELD.IS_HOURLY = true;
                CUSTOM_FIELD.ENTITY_COLUMN_NAME = 'Hourly Salary';
                if (ONCHANGEFLAG == 1) {
                    CUSTOM_FIELD.FIELD_VALUE = Data_Obj.HOURLY_SALARY;
                }
            }
        }
    };
    $scope.ANNUAL_SALARY_FY = function (PRECUSTOM_FIELD, CUSTOM_FIELD, ONCHANGEFLAG, Data_Obj) {
        var index = $scope.$parent.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 187);
        var index2 = $scope.$parent.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 190);
        var index3 = $scope.$parent.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 188);
        if ($scope.$parent.CUSTOM_FIELDS_LIST[index].OPTION_LIST.length > 0) {
            var PAY_FRE_NAME = $scope.CUSTOM_FIELDS_LIST[index].OPTION_LIST.filter(function (x) { return x.PAY_FREQUENCY_ID == $scope.$parent.CUSTOM_FIELDS_LIST[index].FIELD_VALUE });
        }
        if ($scope.$parent.CUSTOM_FIELDS_LIST[index].FIELD_VALUE == 1 && $scope.$parent.CUSTOM_FIELDS_LIST[index2].FIELD_VALUE == 1) {
            if (isNaN(parseFloat($scope.CUSTOM_FIELDS_LIST[index3].FIELD_VALUE) / 52)) {
                $scope.CUSTOM_FIELDS_LIST[index3].FIELD_VALUE_TEXT = '';
            }
            else {
                $scope.$parent.CUSTOM_FIELDS_LIST[index3].FIELD_VALUE_TEXT = PAY_FRE_NAME[0].PAY_FREQUENCY_NAME + ": " + (parseFloat($scope.$parent.CUSTOM_FIELDS_LIST[index3].FIELD_VALUE) / 52).toFixed(2);
            }
        }
        else if ($scope.$parent.CUSTOM_FIELDS_LIST[index].FIELD_VALUE == 2) {
            if (isNaN(parseFloat($scope.$parent.CUSTOM_FIELDS_LIST[index3].FIELD_VALUE) / 12)) {
                $scope.CUSTOM_FIELDS_LIST[index3].FIELD_VALUE_TEXT = '';
            }
            else {
                $scope.CUSTOM_FIELDS_LIST[index3].FIELD_VALUE_TEXT = PAY_FRE_NAME[0].PAY_FREQUENCY_NAME + ": " + (parseFloat($scope.$parent.CUSTOM_FIELDS_LIST[index3].FIELD_VALUE) / 12).toFixed(2);
            }
        }
        else if ($scope.$parent.CUSTOM_FIELDS_LIST[index].FIELD_VALUE == 3) {
            if (isNaN(parseFloat($scope.$parent.CUSTOM_FIELDS_LIST[index3].FIELD_VALUE) / 26)) {
                $scope.CUSTOM_FIELDS_LIST[index3].FIELD_VALUE_TEXT = '';
            }
            else {
                $scope.$parent.CUSTOM_FIELDS_LIST[index3].FIELD_VALUE_TEXT = PAY_FRE_NAME[0].PAY_FREQUENCY_NAME + ": " + (parseFloat($scope.$parent.CUSTOM_FIELDS_LIST[index3].FIELD_VALUE) / 26).toFixed(2);
            }
        }
        else if ($scope.$parent.CUSTOM_FIELDS_LIST[index].FIELD_VALUE == 4) {
            if (isNaN(parseFloat($scope.$parent.CUSTOM_FIELDS_LIST[index3].FIELD_VALUE) / 365)) {
                $scope.CUSTOM_FIELDS_LIST[index3].FIELD_VALUE_TEXT = '';
            }
            else {
                $scope.$parent.CUSTOM_FIELDS_LIST[index3].FIELD_VALUE_TEXT = PAY_FRE_NAME[0].PAY_FREQUENCY_NAME + ": " + (parseFloat($scope.$parent.CUSTOM_FIELDS_LIST[index3].FIELD_VALUE) / 365).toFixed(2);
            }
        }
    };

    $scope.BANK_VALIDATION = function (FLAG, SORT_CODE, ACCOUNT_NUMBER, API_PATH, API_KEY, API_PASSWORD) {
        var PosiModelObj = new Object();
        //PosiModelObj.API_NAME = 'BANKCHECKER';
        PosiModelObj.API_NAME = 'BANKCHECKER';
        if (PosiModelObj.API_NAME == "BANKCHECKER") {
            //API_KEY = 'f789e155acdf24f9640ebdf903700ec0';
            //API_PATH = 'https://www.bankaccountchecker.com/listener.php'
            PosiModelObj.BankCheckerApiKey = API_KEY//'9cf21727d649f6403aa65c753f3e7bf1';
            PosiModelObj.BankCheckerPassword = API_PASSWORD///'Example123$';
            PosiModelObj.API_PATH = API_PATH + "?key=" + PosiModelObj.BankCheckerApiKey + "&password=" + PosiModelObj.BankCheckerPassword + "&output=json&type=uk&sortcode=" + SORT_CODE + "&bankaccount=" + ACCOUNT_NUMBER + "&email=&phone=&country=";
        }
        if (PosiModelObj.API_NAME == "FETCHIFY") {
            PosiModelObj.BankCheckerApiKey = API_KEY//'0eeae-9abb9-4dd08-0779a';
            PosiModelObj.SORT_CODE = SORT_CODE;
            PosiModelObj.ACCOUNT_NUMBER = ACCOUNT_NUMBER;
            PosiModelObj.API_PATH = API_PATH//'https://api.craftyclicks.co.uk/bank/1.1/validate';
        }
        PrcCommMethods.HR_API(PosiModelObj, 'BANK_VALIDATION').then(function (data) {
            $scope.BANK_DETAILS = JSON.parse(data.data);
            $scope.$parent.$parent.overlay_loadingNew = 'none';
            if (PosiModelObj.API_NAME == "BANKCHECKER") {
                if ($scope.BANK_DETAILS == null) {
                    $scope.$parent.ShowAlert('Error', $scope.SOMETHINGWENTWRONG, 3000);
                }
                else if ($scope.BANK_DETAILS.resultCode == "01") {
                    $scope.HR_INS_UPD_EMPLOYEE_STEP_5(FLAG, $scope.BANK_DETAILS.resultCode);
                }
                else if ($scope.BANK_DETAILS.resultCode == "03") {
                    $scope.$parent.ShowAlert('Error', 'Your license has expired.', 3000);
                }
                else {
                    $scope.$parent.ShowAlert('Error', 'Sortcode and Bank Account are not valid', 3000);
                }
            }
            else {
                if ($scope.BANK_DETAILS.successful) {
                    // $scope.HR_INS_UPD_EMPLOYEE_STEP_5(FLAG, '01');
                }
                else {
                    $scope.$parent.ShowAlert('Error', 'Sortcode and Bank Account are not valid', 3000);
                    //"sortCode: Does not match the regex pattern ^[0-9]{6,6}$"
                }
            }
        });
    };
    $scope.HR_INS_UPD_EMPLOYEE_STEP_5 = function (FLAG, VALID) {
        var IS_VALID = true;
        var count = 0;
        var CheckBoxList = $scope.$parent.CUSTOM_FIELDS_LIST.filter(x => x.FIELD_TYPE_ID == 7 && x.IS_MANDATORY == true);
        if (CheckBoxList.length > 0) {
            for (var i = 0; i < CheckBoxList.length; i++) {
                if (CheckBoxList[i].checkedOption.length == 0) {
                    IS_VALID = false;
                    break;
                };
            };
        };
        var FILE_UPLOAD_LIST = $scope.$parent.CUSTOM_FIELDS_LIST.filter(x => x.FIELD_TYPE_ID == 11 && x.IS_MANDATORY == true);
        if (FILE_UPLOAD_LIST.length > 0) {
            for (var i = 0; i < FILE_UPLOAD_LIST.length; i++) {
                if (FILE_UPLOAD_LIST[i].UploadedFiles == undefined || FILE_UPLOAD_LIST[i].UploadedFiles.length == 0) {
                    IS_VALID = false;
                    count++;
                    break;
                };
            };
        };
        $scope.$parent.$parent.overlay_loadingNew = 'block'
        $scope.CustomForm.submitted = true;
        var Validcount = 0;
        if ($scope.CustomForm.$valid && IS_VALID) {
            var index221 = $scope.$parent.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID == 221);
            var index222 = $scope.$parent.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID == 222);
            var IS_API_CHECK = false;
            if (index221 > -1) {
                IS_API_CHECK = $scope.$parent.CUSTOM_FIELDS_LIST[index221].API_FLAG;
            }
            if (index221 > -1 && $scope.$parent.CUSTOM_FIELDS_LIST[index221].FIELD_VALUE != '' && $scope.$parent.CUSTOM_FIELDS_LIST[index221].FIELD_VALUE != null && $scope.$parent.CUSTOM_FIELDS_LIST[index221].FIELD_VALUE != undefined) {
                if ($scope.$parent.CUSTOM_FIELDS_LIST[index222].FIELD_VALUE == '' || $scope.$parent.CUSTOM_FIELDS_LIST[index222].FIELD_VALUE == undefined || $scope.$parent.CUSTOM_FIELDS_LIST[index222].FIELD_VALUE == null) {
                    $scope.$parent.ShowAlert('Error', 'Please Enter Account Number', 3000);
                    Validcount++;
                }
            }
            if (index222 > -1 && $scope.$parent.CUSTOM_FIELDS_LIST[index222].FIELD_VALUE != '' && $scope.$parent.CUSTOM_FIELDS_LIST[index222].FIELD_VALUE != null && $scope.$parent.CUSTOM_FIELDS_LIST[index222].FIELD_VALUE != undefined) {
                if ($scope.$parent.CUSTOM_FIELDS_LIST[index221].FIELD_VALUE == '' || $scope.$parent.CUSTOM_FIELDS_LIST[index221].FIELD_VALUE == undefined || $scope.$parent.CUSTOM_FIELDS_LIST[index221].FIELD_VALUE == null) {
                    $scope.$parent.ShowAlert('Error', 'Please Enter Sort Code', 3000);
                    Validcount++;
                }
            }
            if (IS_API_CHECK && index221 > -1 && index222 > -1 && VALID != '01' && $scope.$parent.CUSTOM_FIELDS_LIST[index221].FIELD_VALUE != '' && $scope.$parent.CUSTOM_FIELDS_LIST[index221].FIELD_VALUE != null && $scope.$parent.CUSTOM_FIELDS_LIST[index221].FIELD_VALUE != undefined && $scope.$parent.CUSTOM_FIELDS_LIST[index222].FIELD_VALUE != '' && $scope.$parent.CUSTOM_FIELDS_LIST[index222].FIELD_VALUE != null && $scope.$parent.CUSTOM_FIELDS_LIST[index222].FIELD_VALUE != undefined) {
                if ($scope.CustomForm.$valid && Validcount == 0) {
                    $scope.BANK_VALIDATION(FLAG, $scope.$parent.CUSTOM_FIELDS_LIST[index221].FIELD_VALUE, $scope.$parent.CUSTOM_FIELDS_LIST[index222].FIELD_VALUE, $scope.$parent.CUSTOM_FIELDS_LIST[index221].API_PATH, $scope.$parent.CUSTOM_FIELDS_LIST[index221].API_KEY, $scope.$parent.CUSTOM_FIELDS_LIST[index221].API_PASSWORD);
                }
                else {
                    $scope.$parent.$parent.overlay_loadingNew = 'none';
                };
            }
            else {
                var index190 = $scope.$parent.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID == 190);
                var index188 = $scope.$parent.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID == 188);
                var index191 = $scope.$parent.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID == 191);
                if ($scope.$parent.CUSTOM_FIELDS_LIST[index190].FIELD_VALUE == 1) {
                    if ($scope.$parent.CUSTOM_FIELDS_LIST[index188].FIELD_VALUE == 0 || $scope.$parent.CUSTOM_FIELDS_LIST[index188].FIELD_VALUE == '.') {
                        $scope.$parent.ShowAlert('Error', 'Please Enter valid Annual Salary', 3000);
                        Validcount++;
                    }
                }
                else {
                    if ($scope.$parent.CUSTOM_FIELDS_LIST[index191].FIELD_VALUE == 0 || $scope.$parent.CUSTOM_FIELDS_LIST[index191].FIELD_VALUE == '.') {
                        $scope.$parent.ShowAlert('Error', 'Please Enter valid Rate', 3000);
                        Validcount++;
                    }
                }
            };
            if (IS_API_CHECK && index221 > -1 && index222 > -1 && $scope.$parent.CUSTOM_FIELDS_LIST[index221].IS_MANDATORY == false && ($scope.$parent.CUSTOM_FIELDS_LIST[index221].FIELD_VALUE == '' || $scope.$parent.CUSTOM_FIELDS_LIST[index221].FIELD_VALUE == null || $scope.$parent.CUSTOM_FIELDS_LIST[index221].FIELD_VALUE == undefined) && $scope.$parent.CUSTOM_FIELDS_LIST[index222].IS_MANDATORY == false && ($scope.$parent.CUSTOM_FIELDS_LIST[index222].FIELD_VALUE == '' || $scope.$parent.CUSTOM_FIELDS_LIST[index222].FIELD_VALUE == null || $scope.$parent.CUSTOM_FIELDS_LIST[index222].FIELD_VALUE == undefined)) {
                IS_API_CHECK = false;
            };
            if ($scope.CustomForm.$valid && Validcount == 0 && !IS_API_CHECK || $scope.CustomForm.$valid && Validcount == 0 && IS_API_CHECK && VALID == "01") {
                var EmpModelObj = new Object();
                EmpModelObj.EMP_PRS_ID = $scope.EmpID;
                EmpModelObj.EMP_COMPST_ID = $scope.EMP_COMPST_ID;
                var IsValidCount = 0;
                angular.forEach($scope.$parent.CUSTOM_FIELDS_LIST, function (val) {
                    val.IsValidCount = 0;
                    if (val.FIELD_VALUE == undefined) {
                        val.FIELD_VALUE = '';
                    }
                    if (val.FIELD_TYPE_ID == 6 || val.FIELD_TYPE_ID == 7 || val.FIELD_TYPE_ID == 11) {
                        $scope.$parent.INSERT_FIELD_TYPE_ID_SET_VALUE(val.FIELD_TYPE_ID, val, $scope.EDIT_PAGE);
                        if (val.IsValidCount > 0) {
                            IsValidCount++;
                        }
                    }
                    if ($scope.EDIT_PAGE && val.FIELD_TYPE_ID != 3 && val.FIELD_TYPE_ID != 5 && val.FIELD_TYPE_ID != 10 || ($scope.EDIT_PAGE && val.FIELD_TYPE_ID == 3 && !val.IS_DB_DROPDOWN)) {
                        if (val.FIELD_TYPE_ID == 9) {
                            val.CHANGE_FLAG == 1 ? val.FIELD_VALUE == "" ? EmpModelObj[val.NG_MODEL] = '1/1/0001 12:00:00 AM' : EmpModelObj[val.NG_MODEL] = val.FIELD_VALUE : val.FIELD_VALUE = null;
                        }
                        else {
                            EmpModelObj[val.NG_MODEL] = val.CHANGE_FLAG == 1 ? val.FIELD_VALUE : null;
                        }
                    }
                    else {
                        EmpModelObj[val.NG_MODEL] = val.FIELD_VALUE;
                        if (val.FIELD_TYPE_ID == 9) {
                            val.FIELD_VALUE == "" ? EmpModelObj[val.NG_MODEL] = '1/1/0001' : EmpModelObj[val.NG_MODEL] = val.FIELD_VALUE;
                        }
                    }
                });
                let isvalid = true;
                if ($scope.ADDITIONAL_PAY_LIST.length > 0) {
                    $scope.ADDITIONAL_PAY_OBJ = [];
                    var ADDITIONAL_PAY_OBJ = { TABLE_ID: null, PAY_CODE_ID: null, RATE: null, AMOUNT: null, PAY_FREQUENCY_ID: null, DELETE_FLAG: null };
                    var count = 0;
                    angular.forEach($scope.ADDITIONAL_PAY_LIST, function (val) {
                        if (val.AMOUNT == '.') {
                            val.AMOUNT = '';
                            count = 1;
                            isvalid = false;
                        }
                        else if (val.RATE == '.') {
                            val.RATE = '';
                            count = 2;
                            isvalid = false;
                        }
                        else {
                            if (val.TABLE_ID == 0 && val.PAY_CODE_ID == null && val.PAY_FREQUENCY_ID == null && (val.RATE == undefined || val.RATE == '' || val.RATE == null || val.RATE == 0) && val.AMOUNT == "") {
                                if ($scope.ADDITIONAL_PAY_LIST.length == 1) {
                                    $scope.ADDITIONAL_PAY_OBJ.push(ADDITIONAL_PAY_OBJ);
                                }
                            }
                            else if (val.TABLE_ID > 0 && val.PAY_CODE_ID == null && val.PAY_FREQUENCY_ID == null && (val.RATE == undefined || val.RATE == '' || val.RATE == null || val.RATE == 0) && val.AMOUNT == "") {
                                var AdPaymentObj = new Object();
                                AdPaymentObj.TABLE_ID = val.TABLE_ID;
                                AdPaymentObj.PAY_CODE_ID = null;
                                AdPaymentObj.RATE = null;
                                AdPaymentObj.AMOUNT = null;
                                AdPaymentObj.PAY_FREQUENCY_ID = null;
                                val.DELETE_FLAG = 1;
                                AdPaymentObj.DELETE_FLAG = val.DELETE_FLAG;
                            }
                            else {
                                var AdPaymentObj = new Object();
                                AdPaymentObj.TABLE_ID = val.TABLE_ID;
                                AdPaymentObj.PAY_CODE_ID = val.PAY_CODE_ID;
                                AdPaymentObj.RATE = val.RATE == undefined || val.RATE == '' || val.RATE == undefined ? val.RATE = '' + 0 : '' + parseFloat(val.RATE);
                                AdPaymentObj.AMOUNT = '' + parseFloat(val.AMOUNT);
                                AdPaymentObj.PAY_FREQUENCY_ID = val.PAY_FREQUENCY_ID;
                                AdPaymentObj.DELETE_FLAG = val.DELETE_FLAG;
                            }
                            if ($scope.EDIT_PAGE) {
                                if (val.count > 0 && val.TABLE_ID != 0 || val.DELETE_FLAG == 1) {
                                    $scope.ADDITIONAL_PAY_OBJ.push(AdPaymentObj);
                                }
                                else if (val.TABLE_ID == 0 && val.PAY_CODE_ID != null && val.PAY_FREQUENCY_ID != null && val.AMOUNT != "") {
                                    $scope.ADDITIONAL_PAY_OBJ.push(AdPaymentObj);
                                }
                                else {
                                    if (AdPaymentObj !== undefined) {
                                        $scope.ADDITIONAL_PAY_OBJ.push(AdPaymentObj);
                                    }
                                }
                            }
                            else {
                                if (AdPaymentObj !== undefined) {
                                    $scope.ADDITIONAL_PAY_OBJ.push(AdPaymentObj);
                                }
                            }
                        }
                    });
                }

                EmpModelObj.ADDITIONAL_PAYMENT = $scope.ADDITIONAL_PAY_OBJ;
                EmpModelObj.USER_ID = parseInt($cookies.get("USERID"));
                EmpModelObj.CREATE_USER = 1;
                $scope.CustomForm.submitted = false;

                EmpModelObj.EFFECTIVE_DATE = $scope.EFFECTIVE_SEARCH.EFFECTIVE_DATE;
                EmpModelObj.COMMENTS = $scope.EFFECTIVE_SEARCH.COMMENTS;
                EmpModelObj.SELF_UPDATE_FLAG = ($cookies.get("EMPLOYEE_ID") == parseInt(getUrlParameter('EmpID', $location.absUrl()))) ? 1 : 0;
                if (($cookies.get("EMPLOYEE_ID") != parseInt(getUrlParameter('EmpID', $location.absUrl())))) {

                    EmpModelObj.HIDE_MY_COMPENSATION = $scope.ObjectData.HIDE_MY_COMPENSATION ? 1 : 0
                }
                if (isvalid) {
                    PrcCommMethods.HR_API(EmpModelObj, 'HR_INS_UPD_EMPLOYEE_STEP_5').then(function (data) {
                        if (FLAG == 1) {
                            $scope.$parent.ShowAlert('Success', 'Compensation Added Successfully', 5000);
                            $location.path('team')
                        }
                        else if (FLAG == 'VIEW') {
                            $scope.$parent.ShowAlert('Success', 'Compensation Updated Successfully', 5000);
                            $location.path('ViewEmpComp')
                        }
                        else if (data.data == 0) {
                            $scope.$parent.ShowAlert('Error', $scope.SOMETHINGWENTWRONG, 5000);
                        }
                        else {
                            $scope.STEP_FLAG = 6;
                            //$scope.EmpSearch_5.EMP_COMPST_ID = data.data;
                            $location.path('EmpLev').search('EmpID', $scope.EmpID).search('STG', 6)
                            $scope.$parent.ShowAlert('Success', 'Compensation Added Successfully', 5000);
                        }
                        $scope.$parent.$parent.overlay_loadingNew = 'none';
                    });
                }
                else {
                    if (count == 1) {
                        $scope.$parent.ShowAlert('Error', 'Please enter valid amount', 5000);
                    }
                    if (count == 2) {
                        $scope.$parent.ShowAlert('Error', 'Please enter valid rate', 5000);
                    }
                }
            }
            else {
                if ($scope.EDIT_PAGE) {
                    $('#EFFECTIVE_DATA').modal('hide');
                }
                $scope.$parent.$parent.overlay_loadingNew = 'none';
            }
        }
        else {
            if (count > 0) {
                $scope.$parent.ShowAlert('Error', 'Please Upload File', 3000);
            }
        }
    };
    $scope.GO_BACK = function (FLAG) {
        //$scope.STEP_FLAG = FLAG;
        $location.path('EmpQualifi').search('EmpID', $scope.EmpID).search('STG', 4);
    }
    $scope.GO_BACK_TO_LIST = function (FLAG) {
        $location.path('team')
    }
    $scope.TAB_CLICK = function (FLAG) {
        $scope.STEP_FLAG = FLAG;
    }
    $scope.IS_PASSWORD_PROTECTED_FY = function () {
        $scope.IS_PASSWORD_PROTECTED_ALLOW = !$scope.IS_PASSWORD_PROTECTED_ALLOW;
    };
    $scope.CHANGE_PASSWORD_OTHER = function () {
        $scope.TEXT_OTHER_ALLOW = false;
        if ($scope.EmpSearch_5.PASSWORD_ID == 2) {
            $scope.TEXT_OTHER_ALLOW = true;
        }
    };
    $scope.REDIRECTTOTEAM = function (FLAG) {
        window.location.href = '../DashBoard/hrIndex#!/team?stp=' + FLAG;
    };

    $scope.POP_EMPLOYEE_STEP_FLAG = function (LBL_TEXT, STEP_NO) {
        var IS_VALID = true;
        var count = 0;
        var CheckBoxList = $scope.$parent.CUSTOM_FIELDS_LIST.filter(x => x.FIELD_TYPE_ID == 7 && x.IS_MANDATORY == true);
        if (CheckBoxList.length > 0) {
            for (var i = 0; i < CheckBoxList.length; i++) {
                if (CheckBoxList[i].checkedOption.length == 0) {
                    IS_VALID = false;
                    break;
                }
            }
        }
        var FILE_UPLOAD_LIST = $scope.$parent.CUSTOM_FIELDS_LIST.filter(x => x.FIELD_TYPE_ID == 11 && x.IS_MANDATORY == true);
        if (FILE_UPLOAD_LIST.length > 0) {
            for (var i = 0; i < FILE_UPLOAD_LIST.length; i++) {
                if (FILE_UPLOAD_LIST[i].UploadedFiles == undefined || FILE_UPLOAD_LIST[i].UploadedFiles.length == 0) {
                    IS_VALID = false;
                    count++;
                    break;
                };
            };
        };
        $scope.CustomForm.submitted = true;
        if ($scope.CustomForm.$valid && IS_VALID) {
            if (LBL_TEXT != undefined && LBL_TEXT != '') {
                $scope.EFFECTIVEForm.submitted = true;
                if ($scope.EFFECTIVEForm.$valid) {
                    $scope.HR_INS_UPD_EMPLOYEE_STEP_5(LBL_TEXT);
                }
                else {
                    $('#EFFECTIVE_DATA').modal('show');
                }
            }
            else {
                $('#EFFECTIVE_DATA').modal('show');
            }
        }
        else {
            if (count > 0) {
                $scope.$parent.ShowAlert('Error', 'Please Upload File', 3000);
            }
        }
    };
    $scope.EDIT_COMPENS = function () {
        $location.path('EditEmpComp');
    };
    $scope.RemoveAddLine = function (LINE, index) {
        if (confirm('Are you Sure?')) {
            if (LINE.TABLE_ID != 0) {
                LINE.DELETE_FLAG = 1;
            }
            else {
                $scope.ADDITIONAL_PAY_LIST.splice(index, 1);
            }
        }
    };
    $scope.$parent.child_scope = $scope;

});
app.controller('EmpLeaveController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $localStorage) {
    $('.modal-backdrop').removeClass('modal-backdrop fade show');
    $scope.COMMON_CODE_CHANGE();
    $scope.IS_LEAVE_TAB = JSON.parse($localStorage.ENTITY_SETTINGS).filter(x => x.SETTING_ID == 16)[0]["SETTING_VALUE"];
    $scope.$parent.TabActive(2);
    $scope.$parent.SCROLL_TOP();
    $scope.STEP_FLAG = 6;
    $scope.BACKTOTEAM = "Back To Team";
    $scope.ObjectHistoryData = {
    };
    $scope.EMP_SEARCH_NAME_DTL = {
    }
    $scope.$parent.EFFECTIVE_RESET_LOAD();
    $filter('lowercase')($location.absUrl()).indexOf("editemplev") != -1 ? $scope.EDIT_PAGE = true : $scope.EDIT_PAGE = false;
    $scope.LeaveList = [];
    $scope.LeaveListDelete = [];
    $scope.REQUESTED_LEAVE = [];
    $scope.EFFECTIVE_DATA_LIST = [];
    $scope.EFFECTIVE_SEARCH = {
        EFFECTIVE_DATE: null,
        COMMENTS: '',
    };
    $scope.EmpID = getUrlParameter('EmpID', $location.absUrl());
    $scope.NO_OF_SHIFTS_PER_LIST = [{ ID: 1, NAME: "1" }, { ID: 2, NAME: "2" }, { ID: 3, NAME: "3" }, { ID: 4, NAME: "4" }, { ID: 5, NAME: "5" }, { ID: 6, NAME: "6" }, { ID: 7, NAME: "7" }];
    $scope.Leave = { TABLE_ID: 0, ABSENCE_TYPE_ID: null, UNIT_ID: null, ALLOCATION_DAYS: "", DELETE_FLAG: 0, START_DATE: null, END_DATE: null };
    $scope.EmpSearchGrd_6 = {
        PAGE_NO: 1,
        PAGE_SIZE: 10,
    }
    $scope.EmpSearch_6 = {
        EMP_Leave_ID: 0,
        Emp_ID: null,
        COMPANY_ID: null,
    };
    $scope.ResetEmp = function () {
        $scope.EmpSearch = {
            DEPARTMENT_NAME: "",
            DEPARTMENT_COLOR: '',
            PARENT_DEPARTMENT_ID: null,
            PAGE_NO: 1,
            PAGE_SIZE: 10,
        }
    };
    $scope.HOURSES = $scope.$parent.GET_ENTITY_SETTINGS(2)[0].SETTING_VALUE;
    $scope.WEEKY_WORKING_DAYS = $scope.$parent.GET_ENTITY_SETTINGS(3)[0].SETTING_VALUE;
    $scope.AddLeaveLine = function () {
        $scope.LeaveList.push(angular.copy($scope.Leave));
        //$scope.$parent.DateLeaveInputLoad();
    };
    $scope.AddObjLeaveLine = function () {
        if ($scope.SELECT_START_YEAR.LeaveList == undefined) {
            $scope.SELECT_START_YEAR.LeaveList = [];
        }
        $scope.SELECT_START_YEAR.LeaveList.push(angular.copy($scope.Leave));
        // $scope.SELECT_START_YEAR_OLD = $scope.SELECT_START_YEAR;
        $scope.EmpDtlsForm_6.submitted = false;
    };
    $scope.SELECTED_YEAR_DDL = [];
    $scope.DateLeaveInputLoad = function (LL, $index, FLAG) {
        let Is_valid = false;
        if (LL.YEAR_END_DATE_DATEPICKER != '' && LL.YEAR_END_DATE_DATEPICKER != null && LL.YEAR_END_DATE_DATEPICKER != undefined && FLAG == 1) {
            Is_valid = true;
        }
        if (LL.YEAR_END_DATE_DATEPICKER != '' && LL.YEAR_END_DATE_DATEPICKER != null && LL.YEAR_END_DATE_DATEPICKER != undefined && FLAG == 2) {
            Is_valid = true;
        }
        if (Is_valid) {
            $(document).ready(function () {
                if (FLAG == 1) {
                    var date_inputs = document.getElementsByName("YEAR_START_DATE_RANGE" + $index)
                }
                if (FLAG == 2) {
                    var date_inputs = document.getElementsByName("ALLOCYEAR_END_DATEATION" + $index)
                }
                if (date_inputs.length > 0) {
                    for (var i = 0; i < date_inputs.length; i++) {
                        var date_input = $('input[name="' + date_inputs[i].name + '"]'); //our date input has the name "date"
                        var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
                        if (FLAG == 1) {
                            var date = new Date(LL.YEAR_START_DATE_DATEPICKER);
                        }
                        if (FLAG == 2) {
                            var date = new Date(LL.YEAR_END_DATE_DATEPICKER);
                        }
                        var options = {
                            todayBtn: "linked",
                            daysOfWeekHighlighted: "0,6",
                            autoclose: true,
                            todayBtn: false,
                            forceParse: false,
                            validateOnBlur: false,
                            format: 'M dd, yyyy',
                            clearBtn: true,
                            closeBtn: true,// close button visible
                            ///startDate: new Date(date.getFullYear() + 1, 0, -0)
                            startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate())
                        };
                        date_input.datepicker(options).on("hide", function (e) {
                            if (e.date != undefined) {

                            }
                        })
                    }
                }
            });
        }
    }

    var ENTITY_CREATION_YEAR = parseInt($cookies.get("ENTITY_CREATION_YEAR"));
    ENTITY_CREATION_YEAR = ENTITY_CREATION_YEAR - 1;
    $scope.EMPLOYEE_ID = parseInt($cookies.get("EMPLOYEE_ID"));

    for (var i = 0; i < 7; i++) { var arry = { 'START_YEAR': ENTITY_CREATION_YEAR + i }; $scope.SELECTED_YEAR_DDL.push(arry); }
    $scope.AddLeaveLine();
    $scope.ON_ABSENCE_START_YEAR_CHANGE = function () {
        //  $scope.ABSENCE_TYPE_EMP = [];
        //  $scope.ABSENCE_TYPE_EMP = $scope.ABSENCE_TYPE_EMP_ALL.filter(function (x) { return x.START_YEAR == $scope.SELECT_START_YEAR.START_YEAR });
        //$scope.ViewEmpSearch_6 = $scope.ABSENCE_TYPE_EMP[0];
        //$scope.LeaveInit();
        $scope.HR_GET_EMPLOYEE();
    };

    //$scope.$watch('SELECT_START_YEAR', function (newValue, oldValue) {
    //    }
    //});
    $scope.ON_ABSENCE_START_YEAR_EDIT_CHANGE = function (SELECT_YEAR, Index) {
        $scope.$parent.$parent.overlay_loadingNew = 'block'
        var IS_VALID = true;
        //if ($scope.SELECT_START_YEAR.LeaveList == undefined || $scope.SELECT_START_YEAR.LeaveList.length == 0) {
        //    $scope.SELECT_START_YEAR = SELECT_YEAR;
        //    $scope.GET_HOLIDAY_ENTITLEMENT_FOR_ASSIGNMENT();
        //}
        //else {
        //if ($scope.SELECT_START_YEAR.LeaveList != ($scope.SELECT_START_YEAR_OLD.LeaveList) || $scope.SELECT_START_YEAR.LeaveList.length != ($scope.SELECT_START_YEAR_OLD.LeaveList.length)) {
        //    IS_VALID = false;
        //}
        for (var i = 0; i < $scope.SELECT_START_YEAR.LeaveList.length; i++) {
            if ($scope.SELECT_START_YEAR.LeaveList[i].RESET_FLAG > 0) {
                IS_VALID = false;
                break;
            }
        }
        if ($scope.LeaveListDelete.length > 0) {
            IS_VALID = false;
        }
        if ($scope.SELECT_START_YEAR.LeaveList.length != ($scope.SELECT_START_YEAR_OLD.LeaveList.length)) {
            IS_VALID = false;
        }
        if (!IS_VALID) {
            if (confirm('please save changes,otherwise data will be lost')) {
                $scope.LeaveListDelete = [];
                $scope.SELECT_START_YEAR = SELECT_YEAR;
                $scope.GET_HOLIDAY_ENTITLEMENT_FOR_ASSIGNMENT();
            }
            else {

            }
        }
        else {
            $scope.SELECT_START_YEAR = SELECT_YEAR;
            $scope.GET_HOLIDAY_ENTITLEMENT_FOR_ASSIGNMENT();
        }
        //}
    };
    $scope.HR_GET_EMPLOYEE = function () {
        $scope.EFFECTIVE_DATA_LIST = [];
        var PosiModelObj = new Object();
        PosiModelObj.EMPLOYEE_ID = $scope.EmpID;
        PosiModelObj.STEP_NO = 6;
        PosiModelObj.LOGIN_USER_EMP_ID = parseInt($cookies.get("EMPLOYEE_ID"));
        PosiModelObj.YEAR = $scope.SELECT_START_YEAR.START_YEAR;
        PrcCommMethods.HR_API(PosiModelObj, 'HR_GET_EMPLOYEE').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.ALL_LEAVE_LIST = data.data.Table;
                $scope.ABSENCE_TYPE_EMP = data.data.Table;
                $scope.ASSIGN_SELECTE_LEAVE(data.data.Table);
                $scope.$parent.$parent.overlay_loadingNew = 'none'
            }
            else {
                //$scope.LeaveList = [];
                //$scope.LeaveList_COPY = [];
                //$scope.SELECT_START_YEAR.LeaveList = [];
                //$scope.SELECT_START_YEAR.LeaveList.push(angular.copy($scope.Leave));
                // if ($scope.SELECT_START_YEAR.LeaveList == undefined) {
                $scope.SELECT_START_YEAR.LeaveList = [];
                //}
                $scope.SELECT_START_YEAR_OLD = angular.copy($scope.SELECT_START_YEAR);
                $scope.$parent.$parent.overlay_loadingNew = 'none'
                $scope.ABSENCE_TYPE_EMP = [];
            }
            if (data.data.Table1.length > 0) {
                $scope.EMP_WRK_PTTN_DTLS = data.data.Table1[0];
            }
            $scope.EFFECTIVE_DATA_LIST = data.data.Table2;
            $scope.ABSENCE_TYPE_EMP_ALL = [];
            if ($filter('lowercase')($location.absUrl()).indexOf("editemplev") != -1) {
            }
            if ($filter('lowercase')($location.absUrl()).indexOf("viewemplev") != -1) {
                if (data.data.Table.length > 0) {
                    $scope.ABSENCE_TYPE_EMP = [];
                    $scope.ABSENCE_TYPE_EMP_ALL = angular.copy(data.data.Table);
                    let duplicates = [];
                    for (let i = 0; i < data.data.Table.length - 1; i++) {
                        data.data.Table[i].DISPLAY_TEXT = data.data.Table[i].ABSENCE_TYPE_NAME;
                        if (data.data.Table[i + 1].ABSENCE_TYPE_ID === data.data.Table[i].ABSENCE_TYPE_ID) {
                            duplicates.push(data.data.Table[i])
                        }
                    }
                    angular.forEach(data.data.Table, function (x) {
                        x.DISPLAY_TEXT = x.ABSENCE_TYPE_NAME;
                        angular.forEach(duplicates, function (Y) {
                            if (x.ABSENCE_TYPE_ID == Y.ABSENCE_TYPE_ID) {
                                const options = { year: 'numeric', month: 'short' };
                                x.DATE_NAME = "[" + new Date(x.START_DATE).toLocaleDateString('en-us', options) + " " + new Date(x.END_DATE).toLocaleDateString('en-us', options) + "]";
                                x.DISPLAY_TEXT = x.ABSENCE_TYPE_NAME + ' ' + x.DATE_NAME;
                            }
                        })
                    })
                    $scope.ABSENCE_TYPE_EMP = data.data.Table;
                    $scope.STEP_NO = data.data.Table[0].STEP_NO;
                    if ($scope.ABSENCE_TYPE_EMP.length > 0) {
                        $scope.ViewEmpSearch_6 = $scope.ABSENCE_TYPE_EMP[0];
                        $scope.LeaveInit();
                    }
                    $scope.$parent.$parent.overlay_loadingNew = 'none'
                }
                if (data.data.Table1.length > 0) {
                    $scope.EMP_WRK_PTTN_DTLS = data.data.Table1[0];
                }
            }
        });
    };
    $scope.ASSIGN_SELECTE_LEAVE = function (AL) {
        var LeaveList = [];
        angular.forEach(AL, function (val) {
            var leveObj = new Object();
            leveObj.TABLE_ID = val.TABLE_ID;
            leveObj.ABSENCE_TYPE_ID = val.ABSENCE_TYPE_ID;
            leveObj.UNIT_ID = val.UNIT_ID;
            leveObj.UNIT_NAME = val.UNIT_NAME;
            leveObj.ALLOCATION_DAYS_CAL = val.ALLOCATION;
            leveObj.ALLOCATION_DAYS = val.ALLOCATION;
            leveObj.DELETE_FLAG = val.DELETE_FLAG;
            leveObj.YEAR_START_DATE = new Date(val.START_DATE);
            leveObj.YEAR_END_DATE = new Date(val.END_DATE);
            leveObj.YEAR_START_DATE_DATEPICKER = angular.copy(val.START_DATE);
            leveObj.YEAR_END_DATE_DATEPICKER = angular.copy(val.END_DATE);
            leveObj.HOLIDAY_ENTITLEMENT_ID = val.HOLIDAY_ENTITLEMENT_ID;
            leveObj.ALREADY_ACCURED = val.ALREADY_ACCURED;//Adjustment


            leveObj.ABSENCE_TYPE_ID_RESET = val.ABSENCE_TYPE_ID;
            leveObj.MAX_ALLOWED_CARRY_OVER = val.MAX_ALLOWED_CARRY_OVER;
            leveObj.CARRY_OVER_VALIDITY_IN_MONTHS = val.CARRY_OVER_VALIDITY_IN_MONTHS;
            leveObj.ACCURED_LEAVE = val.ACCURED_LEAVE == null || val.ACCURED_LEAVE == '' || val.ACCURED_LEAVE == undefined ? '-' : val.ACCURED_LEAVE;
            leveObj.CARRY_OVER = val.CARRY_OVER ? true : false;
            leveObj.ACTUAL_CARRY_OVER = val.ACTUAL_CARRY_OVER;
            leveObj.UNIT_ID_RESET = val.UNIT_ID;
            leveObj.UNIT_NAME_RESET = val.UNIT_NAME;
            leveObj.ALLOCATION_DAYS_CAL_RESET = val.ALLOCATION;
            leveObj.ALLOCATION_DAYS_RESET = val.ALLOCATION;
            leveObj.DELETE_FLAG_RESET = val.DELETE_FLAG;
            leveObj.YEAR_START_DATE_RESET = val.START_DATE;
            leveObj.HOLIDAY_ENTITLEMENT_ID_RESET = angular.copy(val.HOLIDAY_ENTITLEMENT_ID);
            leveObj.YEAR_END_DATE_RESET = val.END_DATE;
            leveObj.MAX_ALLOWED_CARRY_OVER_RESET = val.MAX_ALLOWED_CARRY_OVER;
            leveObj.CARRY_OVER_VALIDITY_IN_MONTHS_RESET = val.CARRY_OVER_VALIDITY_IN_MONTHS;
            leveObj.ACCURED_LEAVE_RESET = val.ACCURED_LEAVE == null || val.ACCURED_LEAVE == '' || val.ACCURED_LEAVE == undefined ? '-' : val.ACCURED_LEAVE;
            leveObj.CARRY_OVER_RESET = val.CARRY_OVER ? true : false;
            leveObj.ACTUAL_CARRY_OVER_RESET = val.ACTUAL_CARRY_OVER;
            leveObj.ABSENCE_BY_ID_RESET = val.ABSENCE_BY_ID;
            leveObj.ALREADY_ACCURED_RESET = val.ALREADY_ACCURED;



            leveObj.PREV_DATA = [];
            LeaveList.push(leveObj);
        })
        $scope.LeaveList_COPY = angular.copy(LeaveList);
        $scope.LeaveList = LeaveList;
        $scope.SELECT_START_YEAR.LeaveList = [];
        $scope.SELECT_START_YEAR.LeaveList = (LeaveList);
        $scope.SELECT_START_YEAR_OLD = angular.copy($scope.SELECT_START_YEAR);
    }
    $scope.HR_INS_UPD_EMPLOYEE_STEP_6 = function (FLAG) {
        var count = 0;
        var IsValid = true;
        for (var i = 0; i < $scope.ABSENCE_TYPE.length; i++) {
            var Lth = $scope.SELECT_START_YEAR.LeaveList.filter(function (x) {
                return x.DELETE_FLAG == 0 && $scope.ABSENCE_TYPE[i].HOLIDAY_ENTITLEMENT_ID == x.HOLIDAY_ENTITLEMENT_ID;
            });
            if (Lth.length > 1) {
                count++;
                break;
            }
        }

        $scope.EmpDtlsForm_6.submitted = true;
        if ($scope.EmpDtlsForm_6.$valid && count == 0) {
            var EmpModelObj = new Object();
            EmpModelObj.EMP_PRS_ID = $scope.EmpID;
            EmpModelObj.USER_ID = parseInt($cookies.get("USERID"));
            EmpModelObj.STEP_NO = 6;
            EmpModelObj.EMP_LEAVE = [];
            //   angular.forEach($scope.SELECT_START_YEAR, function (ddl) {
            angular.forEach($scope.SELECT_START_YEAR.LeaveList, function (LL) {
                if (LL.DELETE_FLAG == 0) {
                    var leveObj = new Object();
                    leveObj.TABLE_ID = LL.TABLE_ID;
                    leveObj.ABSENCE_TYPE_ID = LL.ABSENCE_TYPE_ID;
                    leveObj.UNIT_ID = LL.UNIT_ID;
                    leveObj.ALLOCATION_DAYS = '' + (LL.ALLOCATION_DAYS_CAL);
                    leveObj.DELETE_FLAG = LL.DELETE_FLAG;
                    leveObj.START_DATE = (new Date(LL.YEAR_START_DATE)).toDateString();
                    leveObj.END_DATE = (new Date(LL.YEAR_END_DATE)).toDateString();
                    leveObj.HOLIDAY_ENTITLEMENT_ID = LL.HOLIDAY_ENTITLEMENT_ID;
                    leveObj.MAX_ALLOWED_CARRY_OVER = (LL.MAX_ALLOWED_CARRY_OVER == undefined || LL.MAX_ALLOWED_CARRY_OVER == null || LL.MAX_ALLOWED_CARRY_OVER == '') ? 0 : LL.MAX_ALLOWED_CARRY_OVER;
                    leveObj.CARRY_OVER_VALIDITY_IN_MONTHS = (LL.CARRY_OVER_VALIDITY_IN_MONTHS == undefined || LL.CARRY_OVER_VALIDITY_IN_MONTHS == null || LL.CARRY_OVER_VALIDITY_IN_MONTHS == '') ? 0 : LL.CARRY_OVER_VALIDITY_IN_MONTHS;
                    leveObj.ACTUAL_CARRY_OVER = (LL.ACTUAL_CARRY_OVER == undefined || LL.ACTUAL_CARRY_OVER == null || LL.ACTUAL_CARRY_OVER == '') ? 0 : LL.ACTUAL_CARRY_OVER;
                    leveObj.CARRY_OVER = LL.CARRY_OVER ? 1 : 0;
                    leveObj.EMP_PRS_ID = $scope.EmpID;//1315
                    leveObj.ALREADY_ACCURED = (LL.ALREADY_ACCURED == undefined || LL.ALREADY_ACCURED == null || LL.ALREADY_ACCURED == '') ? 0 : LL.ALREADY_ACCURED;//Adjectment
                    if ($scope.EDIT_PAGE) {
                        if (LL.count > 0 && LL.TABLE_ID != 0) {
                            EmpModelObj.EMP_LEAVE.push(leveObj);
                        }
                        if (LL.TABLE_ID == 0) {
                            EmpModelObj.EMP_LEAVE.push(leveObj);
                        }
                    }
                    else {
                        EmpModelObj.EMP_LEAVE.push(leveObj);
                    }
                    if (new Date(LL.YEAR_START_DATE) > new Date(LL.YEAR_END_DATE)) {
                        IsValid = false;
                    }
                    if (LL.ALLOCATION_DAYS_CAL == '.') {
                        LL.ALLOCATION_DAYS_CAL = ''
                        count = 2;
                    }
                }
            });
            // })
            angular.forEach($scope.LeaveListDelete, function (BB) {
                LL = BB.PREV_DATA[0];
                var leveObj = new Object();
                leveObj.TABLE_ID = LL.TABLE_ID;
                leveObj.ABSENCE_TYPE_ID = LL.ABSENCE_TYPE_ID_RESET;
                leveObj.UNIT_ID = LL.UNIT_ID_RESET;
                leveObj.ALLOCATION_DAYS = LL.ALLOCATION_DAYS_CAL_RESET;
                leveObj.DELETE_FLAG = 1;
                leveObj.START_DATE = (new Date(LL.YEAR_START_DATE_RESET)).toDateString()//not update in database but use to pass c#//(new Date(LL.YEAR_START_DATE)).toDateString();
                leveObj.END_DATE = new Date(LL.YEAR_END_DATE_RESET).toDateString()//not update in database but use to pass c#// new Date(LL.YEAR_END_DATE).toDateString();
                leveObj.HOLIDAY_ENTITLEMENT_ID = LL.HOLIDAY_ENTITLEMENT_ID_RESET;
                leveObj.MAX_ALLOWED_CARRY_OVER = 0//LL.MAX_ALLOWED_CARRY_OVER;
                leveObj.CARRY_OVER_VALIDITY_IN_MONTHS = 0 //LL.CARRY_OVER_VALIDITY_IN_MONTHS;
                leveObj.ACTUAL_CARRY_OVER = 0//null //LL.ACTUAL_CARRY_OVER;
                leveObj.CARRY_OVER = 0;
                leveObj.EMP_PRS_ID = $scope.EmpID;
                leveObj.ALREADY_ACCURED = 0;
                EmpModelObj.EMP_LEAVE.push(leveObj);
            });
            EmpModelObj.EFFECTIVE_DATE = $scope.EFFECTIVE_SEARCH.EFFECTIVE_DATE;
            EmpModelObj.COMMENTS = $scope.EFFECTIVE_SEARCH.COMMENTS;
            EmpModelObj.SELF_UPDATE_FLAG = ($cookies.get("EMPLOYEE_ID") == parseInt(getUrlParameter('EmpID', $location.absUrl()))) ? 1 : 0;
            if (IsValid && count == 0) {
                PrcCommMethods.HR_API(EmpModelObj, 'HR_INS_UPD_EMPLOYEE_STEP_6').then(function (data) {
                    if (data.data == 0) {
                        $scope.$parent.ShowAlert('Error', $scope.$parent.SOMETHINGWENTWRONG, 5000);
                    }
                    else if (FLAG == 'VIEW') {
                        $scope.$parent.ShowAlert('Success', 'Leave Updated Successfully', 5000);
                        $scope.$parent.VIEW_TAB_CLICK(6);
                    }
                    else if (FLAG == 1) {
                        $location.path('team')
                        $scope.$parent.ShowAlert('Success', 'Leave Added Successfully', 5000);
                    }
                    else {
                        $scope.STEP_FLAG = 7;
                        $scope.$parent.ShowAlert('Success', 'Leave Added Successfully', 5000);
                        $location.path('EmpDoc').search('EmpID', $scope.EmpID).search('STG', 7)
                    }
                });
            }
            else {
                if (!IsValid) {
                    $scope.$parent.ShowAlert('Error', 'Year start date should be less then year end date', 3000);
                }
                if ($scope.EDIT_PAGE) {
                    $('#EFFECTIVE_DATA').modal('hide');
                }
            }
        }
        else {
            if (count > 0) {
                $scope.$parent.ShowAlert('Error', 'Absence type should not be duplicate', 5000);
            }
        }
    };

    $scope.LEAVE_TAB_CLICK = function (ABSENCE) {
        $scope.ViewEmpSearch_6 = ABSENCE;
        $scope.LeaveInit();
        console.log(ABSENCE);
    };

    $scope.LeaveInit = function (LEV) {
        if ((((parseFloat($scope.ViewEmpSearch_6.ALLOCATION) + parseFloat($scope.ViewEmpSearch_6.ACTUAL_CARRY_OVER)) - parseFloat($scope.ViewEmpSearch_6.APPROVED)) <= 0)) {
            $scope.ViewEmpSearch_6.REMAINING_DAY_ASS_CAL = 0;
        }
        else {
            $scope.ViewEmpSearch_6.REMAINING_DAY_ASS_CAL = ((parseFloat($scope.ViewEmpSearch_6.ALLOCATION) + parseFloat($scope.ViewEmpSearch_6.ACTUAL_CARRY_OVER)) - parseFloat($scope.ViewEmpSearch_6.APPROVED));
        }
        $scope.ViewEmpSearch_6.REMAINING_DAY_ACC_CAL = ((parseFloat($scope.ViewEmpSearch_6.ACCURED_LEAVE == null || $scope.ViewEmpSearch_6.ACCURED_LEAVE == '' || $scope.ViewEmpSearch_6.ACCURED_LEAVE == undefined ? 0 : $scope.ViewEmpSearch_6.ACCURED_LEAVE) + parseFloat($scope.ViewEmpSearch_6.ACTUAL_CARRY_OVER)) - parseFloat($scope.ViewEmpSearch_6.APPROVED));


        $scope.ViewEmpSearch_6.REMAINING_ACCRUED = ((parseFloat($scope.ViewEmpSearch_6.ACCURED_LEAVE == null || $scope.ViewEmpSearch_6.ACCURED_LEAVE == '' || $scope.ViewEmpSearch_6.ACCURED_LEAVE == undefined ? 0 : $scope.ViewEmpSearch_6.ACCURED_LEAVE)) - parseFloat($scope.ViewEmpSearch_6.APPROVED));

    };
    $scope.ADD_LEAVE = function () {
        $location.path('EditEmpLev');
        //$scope.HR_GET_COURSE_MASTER();
    };
    $scope.LAZY_LOAD = function () {
        $scope.GET_LEAVE_REQUEST_LIST();
    };
    $scope.GET_LEAVE_REQUEST_LIST = function (FLAG) {
        if (FLAG == '1') {
            $scope.REQUESTED_LEAVE = [];
            $scope.EmpSearchGrd_6.PAGE_NO = 1;
            $scope.EmpSearchGrd_6.PAGE_SIZE = 10;
        }
        var PosiModelObj = new Object();
        PosiModelObj.SELF_FLAG = 1;
        PosiModelObj.EMP_PRS_ID = $scope.EmpID;
        PosiModelObj.ABSENCE_TYPE_IDS = '';
        PosiModelObj.DEPARMENT_IDS = '';
        PosiModelObj.STATUS_IDS = '11,12,13,14,15';
        PosiModelObj.SORT_BY = 0;
        PosiModelObj.PAGE_NO = $scope.EmpSearchGrd_6.PAGE_NO;
        PosiModelObj.PAGE_SIZE = $scope.EmpSearchGrd_6.PAGE_SIZE;
        PrcCommMethods.HR_API(PosiModelObj, 'GET_LEAVE_REQUEST_LIST').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.$parent.$parent.overlay_loadingNew = 'none';
                $scope.REQUESTED_LEAVE = $scope.REQUESTED_LEAVE.concat(data.data.Table);
                if (data.data.Table.length < $scope.EmpSearchGrd_6.PAGE_SIZE) {
                    $scope.GetDataR = false;
                }
                else {
                    $scope.EmpSearchGrd_6.PAGE_NO = parseInt($scope.EmpSearchGrd_6.PAGE_NO) + 1;
                    $scope.GetDataR = true;
                }
            }
            else {
                if ($scope.REQUESTED_LEAVE.length == 0) {

                }
                $scope.GetDataR = false;
                $scope.$parent.$parent.overlay_loadingNew = 'none';
            }
        });
    };

    $scope.NG_INIT_REQUESTED_LEAVE = function (LL) {
        //LL.CAL_LEAVE_DAYS = (LL.DURATION_DAYS + (parseFloat(LL.DURATION_HOURS) / parseFloat($scope.HOURSES))) Old calculation
        LL.CAL_LEAVE_DAYS = (parseFloat(LL.DURATION_DAYS) + parseFloat(LL.DURATION_HOURS));
    };
    $scope.TERMINATION_DETAILS = [];
    $scope.GET_HOLIDAY_ENTITLEMENT_FOR_ASSIGNMENT = function () {
        HolEntitlObj = new Object();
        HolEntitlObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        HolEntitlObj.YEAR = $scope.SELECT_START_YEAR.START_YEAR;
        HolEntitlObj.EMP_PRS_ID = $scope.EmpID;
        PrcCommMethods.HR_API(HolEntitlObj, 'GET_HOLIDAY_ENTITLEMENT_FOR_ASSIGNMENT').then(function (data) {
            let duplicates = []
            for (let i = 0; i < data.data.Table.length - 1; i++) {
                data.data.Table[i].DISPLAY_TEXT = data.data.Table[i].ABSENCE_TYPE_NAME + '-' + data.data.Table[i].ENTITLEMENT_UNIT_NAME;
                if (data.data.Table[i + 1].ABSENCE_TYPE_ID === data.data.Table[i].ABSENCE_TYPE_ID) {
                    duplicates.push(data.data.Table[i])
                }
            }
            angular.forEach(data.data.Table, function (x) {
                x.DISPLAY_TEXT = x.ABSENCE_TYPE_NAME + '-' + x.ENTITLEMENT_UNIT_NAME;
                angular.forEach(duplicates, function (Y) {
                    if (x.ABSENCE_TYPE_ID == Y.ABSENCE_TYPE_ID) {
                        x.DISPLAY_TEXT = x.ABSENCE_TYPE_NAME + '-' + x.DATE_NAME + '-' + x.ENTITLEMENT_UNIT_NAME;
                    }
                })
            })
            $scope.ABSENCE_TYPE = data.data.Table;
            $scope.HR_GET_EMPLOYEE();
        });
    };
    $scope.EDIT_PROFILE_CHECK_MODULE_ACCESS = false;
    $scope.GET_EMPLOYEE_PROFILE_HEADER = function () {
        var PosiModelObj = new Object();
        PosiModelObj.EMPLOYEE_ID = $scope.EmpID;
        PrcCommMethods.HR_API(PosiModelObj, 'GET_EMPLOYEE_PROFILE_HEADER').then(function (data) {
            $scope.$parent.EmpSearch_HEADER = data.data.Table[0];
            $scope.STEP_NO = data.data.Table1[0].STEP_NO;
            $scope.EMP_SEARCH_NAME_DTL = data.data.Table1[0];
            $scope.TERMINATION_DETAILS = data.data.Table2;

            //$scope.CURRENT_YEAR = data.data.Table1[0].CURRENT_YEAR;
            $scope.SELECT_START_YEAR = $scope.SELECTED_YEAR_DDL.filter(function (x) { return x.START_YEAR == data.data.Table1[0].CURRENT_YEAR })[0];
            if ($scope.SELECT_START_YEAR.LeaveList == undefined) {
                $scope.SELECT_START_YEAR.LeaveList = [];
            }
            $scope.SELECT_START_YEAR_OLD = angular.copy($scope.SELECT_START_YEAR);
            $scope.GET_HOLIDAY_ENTITLEMENT_FOR_ASSIGNMENT();
            $scope.$parent.CalculetteService(data.data.Table[0]);
        });
        $scope.IS_EDITABLE_FLAG = true;
        if ($scope.EmpID == parseInt($cookies.get("EMPLOYEE_ID"))) {
            $scope.IS_EDITABLE_FLAG = false;
        }
        else {
            $scope.EDIT_PROFILE_CHECK_MODULE_ACCESS = $scope.$parent.CHECK_MODULE_ACCESS(3, 3);
        }
    };
    $scope.GET_EMPLOYEE_PROFILE_HEADER();
    $scope.GO_FORWARD_LEAVE = function (FLAG) {
        var EmpModelObj = new Object();
        EmpModelObj.EMP_PRS_ID = $scope.EmpID;
        EmpModelObj.EMPLOYEE_ID = $scope.EmpID;
        EmpModelObj.USER_ID = parseInt($cookies.get("USERID"));
        EmpModelObj.STEP_NO = 6;
        EmpModelObj.EMP_LEAVE = [];
        var leveObj = new Object();
        leveObj.TABLE_ID = null;
        leveObj.ABSENCE_TYPE_ID = null;
        leveObj.UNIT_ID = null;
        leveObj.ALLOCATION_DAYS = 0;
        leveObj.DELETE_FLAG = 0;
        leveObj.START_DATE = null;
        leveObj.END_DATE = new Date();
        leveObj.HOLIDAY_ENTITLEMENT_ID = 0;
        leveObj.MAX_ALLOWED_CARRY_OVER = 0;
        leveObj.CARRY_OVER_VALIDITY_IN_MONTHS = 0;
        leveObj.ACTUAL_CARRY_OVER = 0;
        leveObj.CARRY_OVER = 0;
        leveObj.EMP_PRS_ID = 0;
        EmpModelObj.EMP_LEAVE.push(leveObj);
        EmpModelObj.EFFECTIVE_DATE = $scope.EFFECTIVE_SEARCH.EFFECTIVE_DATE;
        EmpModelObj.COMMENTS = $scope.EFFECTIVE_SEARCH.COMMENTS;
        EmpModelObj.SELF_UPDATE_FLAG = ($cookies.get("EMPLOYEE_ID") == parseInt(getUrlParameter('EmpID', $location.absUrl()))) ? 1 : 0;
        PrcCommMethods.HR_API(EmpModelObj, 'HR_INS_UPD_EMPLOYEE_STEP_6').then(function (data) {
            $location.path('EmpDoc').search('EmpID', $scope.EmpID).search('STG', 7)
        });
    };
    if ($filter('lowercase')($location.absUrl()).indexOf("viewemplev") != -1) {
        $scope.GET_LEAVE_REQUEST_LIST(1);
    }
    $scope.RESET_LEAVE = function (leveObj) {
        leveObj.ABSENCE_TYPE_ID = leveObj.ABSENCE_TYPE_ID_RESET;
        leveObj.HOLIDAY_ENTITLEMENT_ID = leveObj.HOLIDAY_ENTITLEMENT_ID_RESET;
        leveObj.UNIT_ID = leveObj.UNIT_ID_RESET;
        leveObj.UNIT_NAME = leveObj.UNIT_NAME_RESET;
        leveObj.ALLOCATION_DAYS_CAL = leveObj.ALLOCATION_DAYS_CAL_RESET;
        leveObj.DELETE_FLAG = leveObj.DELETE_FLAG_RESET;
        //console.log(currentDate.toLocaleDateString('en-us', options));
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        leveObj.YEAR_START_DATE = new Date(leveObj.YEAR_START_DATE_RESET).toLocaleDateString('en-us', options);
        leveObj.YEAR_END_DATE = new Date(leveObj.YEAR_END_DATE_RESET).toLocaleDateString('en-us', options);
        leveObj.MAX_ALLOWED_CARRY_OVER = leveObj.MAX_ALLOWED_CARRY_OVER_RESET;
        leveObj.CARRY_OVER_VALIDITY_IN_MONTHS = leveObj.CARRY_OVER_VALIDITY_IN_MONTHS_RESET;
        leveObj.ACCURED_LEAVE = leveObj.ACCURED_LEAVE_RESET;
        leveObj.CARRY_OVER = leveObj.CARRY_OVER_RESET;
        leveObj.ACTUAL_CARRY_OVER = leveObj.ACTUAL_CARRY_OVER_RESET;
        //leveObj.ABSENCE_BY_ID = {
        //};
        //leveObj.ABSENCE_BY_ID = leveObj.ABSENCE_BY_ID_RESET;
        leveObj.RESET_FLAG = 0;
    };
    $scope.ON_VALUE_CHANGE = function (LL, $index) {
        LL.count = 0;
        if (LL.PREV_DATA.length > 0) {
            if (LL.ALLOCATION_DAYS_CAL != LL.PREV_DATA[0].ALLOCATION_DAYS_CAL) {
                LL.count++;
                LL.RESET_FLAG = 1;
            }
            if (LL.HOLIDAY_ENTITLEMENT_ID != LL.PREV_DATA[0].HOLIDAY_ENTITLEMENT_ID) {
                LL.count++;
                LL.RESET_FLAG = 1;
            }
            if (!(moment(LL.YEAR_START_DATE).isSame(moment(LL.PREV_DATA[0].YEAR_START_DATE), 'day'))) {
                LL.count++;
                LL.RESET_FLAG = 1;
            }
            if (!(moment(LL.YEAR_END_DATE).isSame(moment(LL.PREV_DATA[0].YEAR_END_DATE), 'day'))) {
                LL.count++;
                LL.RESET_FLAG = 1;
            }
            if (LL.MAX_ALLOWED_CARRY_OVER != LL.PREV_DATA[0].MAX_ALLOWED_CARRY_OVER) {
                LL.count++;
                LL.RESET_FLAG = 1;
            }
            if (LL.ALREADY_ACCURED != LL.PREV_DATA[0].ALREADY_ACCURED) {
                LL.count++;
                LL.RESET_FLAG = 1;
            }
        }
        //if (LL.HOLIDAY_ENTITLEMENT_ID != undefined && LL.HOLIDAY_ENTITLEMENT_ID != null && LL.HOLIDAY_ENTITLEMENT_ID != '') {
        //    if (LL.PREV_DATA.length > 0) {
        //        if (LL.HOLIDAY_ENTITLEMENT_ID != LL.PREV_DATA[0].HOLIDAY_ENTITLEMENT_ID) {
        //            LL.count++;
        //        }
        //    }
        //};
        //if (LL.ALLOCATION_DAYS_CAL != undefined && LL.ALLOCATION_DAYS_CAL != null && LL.ALLOCATION_DAYS_CAL != '') {
        //    if (LL.PREV_DATA.length > 0) {
        //        if (LL.ALLOCATION_DAYS_CAL != LL.PREV_DATA[0].ALLOCATION_DAYS_CAL) {
        //            LL.count++;
        //            LL.RESET_FLAG = 1;
        //        }
        //    }
        //}
        //if (LL.YEAR_START_DATE != undefined && LL.YEAR_START_DATE != null && LL.YEAR_START_DATE != '') {
        //    if (LL.PREV_DATA.length > 0) {
        //        if (!(moment(LL.YEAR_START_DATE).isSame(moment(LL.PREV_DATA[0].YEAR_START_DATE), 'day'))) {
        //            LL.count++;
        //            LL.RESET_FLAG = 1;
        //        }
        //    }
        //}
        //if (LL.YEAR_END_DATE != undefined && LL.YEAR_END_DATE != null && LL.YEAR_END_DATE != '') {
        //    if (LL.PREV_DATA.length > 0) {
        //        if (!(moment(LL.YEAR_END_DATE).isSame(moment(LL.PREV_DATA[0].YEAR_END_DATE), 'day'))) {
        //            LL.count++;
        //            LL.RESET_FLAG = 1;
        //        }
        //    }
        //}
        //if (LL.MAX_ALLOWED_CARRY_OVER != undefined && LL.MAX_ALLOWED_CARRY_OVER != null && LL.MAX_ALLOWED_CARRY_OVER != '') {
        //    if (LL.PREV_DATA.length > 0) {
        //        if (LL.MAX_ALLOWED_CARRY_OVER != LL.PREV_DATA[0].MAX_ALLOWED_CARRY_OVER) {
        //            LL.count++;
        //            LL.RESET_FLAG = 1;
        //        }
        //    }
        //}
        //if (LL.CARRY_OVER_VALIDITY_IN_MONTHS != undefined && LL.CARRY_OVER_VALIDITY_IN_MONTHS != null && LL.CARRY_OVER_VALIDITY_IN_MONTHS != '') {
        //    if (LL.PREV_DATA.length > 0) {
        //        if (LL.CARRY_OVER_VALIDITY_IN_MONTHS != LL.PREV_DATA[0].CARRY_OVER_VALIDITY_IN_MONTHS) {
        //            LL.count++;
        //            LL.RESET_FLAG = 1;
        //        }
        //    }
        //}
        //if (LL.CARRY_OVER != undefined && LL.CARRY_OVER != null && LL.CARRY_OVER != '') {
        //    if (LL.PREV_DATA.length > 0) {
        //        if (LL.CARRY_OVER != LL.PREV_DATA[0].CARRY_OVER) {
        //            LL.count++;
        //            LL.RESET_FLAG = 1;
        //        }
        //    }
        //}
        //if (LL.ACTUAL_CARRY_OVER != undefined && LL.ACTUAL_CARRY_OVER != null && LL.ACTUAL_CARRY_OVER != '') {
        //    if (LL.PREV_DATA.length > 0) {
        //        if (LL.ACTUAL_CARRY_OVER != LL.PREV_DATA[0].ACTUAL_CARRY_OVER) {
        //            LL.count++;
        //            LL.RESET_FLAG = 1;
        //        }
        //    }
        //}
        //if (parseFloat(LL.MAX_ALLOWED_CARRY_OVER) > parseFloat(LL.ALLOCATION_DAYS_CAL)) {
        //    $scope.$parent.ShowAlert("Error", "Max carry forward not greater than leave allocation", 2000)
        //    LL.MAX_ALLOWED_CARRY_OVER = 0;
        //}
        if (LL.CARRY_OVER) {
            // LL.MAX_ALLOWED_CARRY_OVER = LL.PREV_DATA[0].MAX_ALLOWED_CARRY_OVER;
            //LL.ACTUAL_CARRY_OVER = LL.PREV_DATA[0].ACTUAL_CARRY_OVER;
        }
        else {
            LL.MAX_ALLOWED_CARRY_OVER = 0;
            LL.ACTUAL_CARRY_OVER = 0;
        }

    };
    $scope.ON_ABSENCETYPECHANGE = function (LL, $index) {
        if (LL.TABLE_ID != 0) { LL.RESET_FLAG = 1; }

        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        var CALL = $scope.ABSENCE_TYPE.filter(function (x) { return x.HOLIDAY_ENTITLEMENT_ID == LL.HOLIDAY_ENTITLEMENT_ID });
        $scope.DateLeaveInputLoad(LL, $index, 2);

        LL.UNIT_NAME = CALL[0].ENTITLEMENT_UNIT_NAME;
        LL.ABSENCE_TYPE_ID = CALL[0].ABSENCE_TYPE_ID;
        LL.MAX_ALLOWED_CARRY_OVER = CALL[0].MAX_ALLOWED_CARRY_OVER;
        LL.CARRY_OVER_VALIDITY_IN_MONTHS = CALL[0].CARRY_OVER_VALIDITY_IN_MONTHS;
        LL.ALLOCATION_DAYS = parseInt(CALL[0].DEFAULT_ENTITLEMENT_VALUE);
        LL.UNIT_ID = parseInt(CALL[0].ENTITLEMENT_UNIT_ID);
        LL.YEAR_END_DATE = new Date(CALL[0].YEAR_END_DATE);
        LL.YEAR_END_DATE_DATEPICKER = angular.copy(CALL[0].YEAR_END_DATE);
        LL.HOLIDAY_ENTITLEMENT_ID = CALL[0].HOLIDAY_ENTITLEMENT_ID;

        var START_DATE = new Date($scope.$parent.EmpSearch_HEADER.START_DATE);
        var days = "";
        if (START_DATE > new Date(CALL[0].YEAR_START_DATE)) {
            LL.YEAR_START_DATE = new Date(START_DATE);
            days = PrcCommMethods.getDifferenceInDays(new Date(START_DATE), new Date(LL.YEAR_END_DATE));
        }
        else {

            LL.YEAR_START_DATE = new Date(CALL[0].YEAR_START_DATE);
            days = PrcCommMethods.getDifferenceInDays(new Date(CALL[0].YEAR_START_DATE), new Date(LL.YEAR_END_DATE));
        }
        LL.YEAR_START_DATE_DATEPICKER = angular.copy(CALL[0].YEAR_START_DATE);
        LL.YEAR_START_DATE = new Date(LL.YEAR_START_DATE).toLocaleDateString('en-us', options);
        LL.YEAR_END_DATE = new Date(LL.YEAR_END_DATE).toLocaleDateString('en-us', options);

        LL.UNIT_NAME = CALL[0].ENTITLEMENT_UNIT_NAME;
        LL.ALLOCATION_DAYS = parseInt(CALL[0].DEFAULT_ENTITLEMENT_VALUE);
        LL.UNIT_ID = parseInt(CALL[0].ENTITLEMENT_UNIT_ID);
        LL.HOLIDAY_ENTITLEMENT_ID = CALL[0].HOLIDAY_ENTITLEMENT_ID;
        LL.days = days + 1;
        if (CALL[0].ACCRUAL_METHOD_ID == 4) {
            LL.ALLOCATION_DAYS_CAL = LL.ALLOCATION_DAYS;
        }
        else {
            var SHIFT_HRS = 0;
            if (LL.UNIT_ID == 1 || LL.UNIT_ID == 3) {
                //Employee Weekly Working Days*((Year END date-(Employee Start Date or year start date which ever is latest))/7))*(Total Yearly Entitlement/(Total Working Days in a week*52)
                //=(E5*((D6-C7)/7))*(E4/(E3*52.143));
                var Result = parseFloat($scope.EMP_WRK_PTTN_DTLS.WEEKLY_HOURS * 1 / $scope.EMP_WRK_PTTN_DTLS.AVG_DAILY_HOURS * 1) * (LL.days / 7);
                var Result1 = LL.ALLOCATION_DAYS / (parseFloat($scope.WEEKY_WORKING_DAYS) * 52.143);
                if (Result1 > 1) {
                    Result1 = 1;
                }
                if ((Result * Result1).toFixed(2) > LL.ALLOCATION_DAYS) {
                    LL.ALLOCATION_DAYS_CAL = LL.ALLOCATION_DAYS;
                }
                else {
                    LL.ALLOCATION_DAYS_CAL = (Result * Result1).toFixed(2);
                }
            };
            if (LL.UNIT_ID == 2) {
                //=(L5*((D6-C7)/7))*(L4/(L3*52.143));
                //var EM_SHIFT_WRK_HRS = parseFloat($scope.EMP_WRK_PTTN_DTLS.NO_OF_SHIFTS_PER_WEEK) * parseFloat($scope.HOURSES);
                var EM_SHIFT_WRK_HRS = parseFloat($scope.EMP_WRK_PTTN_DTLS.WEEKLY_HOURS);
                var ENTITY_SHIFT_WRK_HRS = parseFloat($scope.WEEKY_WORKING_DAYS) * parseFloat($scope.HOURSES);
                var Result = EM_SHIFT_WRK_HRS * (LL.days / 7);
                var Result1 = LL.ALLOCATION_DAYS / (parseFloat(ENTITY_SHIFT_WRK_HRS) * 52.143);

                if (Result1 > 1) {
                    Result1 = 1;
                }
                //LL.ALLOCATION_DAYS_CAL = (Result * Result1).toFixed(2);
                if ((Result * Result1).toFixed(2) > LL.ALLOCATION_DAYS) {
                    LL.ALLOCATION_DAYS_CAL = LL.ALLOCATION_DAYS;
                }
                else {
                    LL.ALLOCATION_DAYS_CAL = (Result * Result1).toFixed(2);
                }


            };
        }
        $scope.DateLeaveInputLoad(LL, $index, 1);/// for first record, no record is there 

        $scope.DateLeaveInputLoad(LL, $index, 2);

        $scope.ON_VALUE_CHANGE(LL);

    };
    $scope.ON_CHANGE_CALC_FTE = function (LL) {
        var CALL = $scope.ABSENCE_TYPE.filter(function (x) { return x.ABSENCE_TYPE_ID == LL.ABSENCE_TYPE_ID });
        var days = PrcCommMethods.getDifferenceInDays(new Date($scope.$parent.EmpSearch_HEADER.START_DATE), new Date(LL.YEAR_END_DATE));
        LL.days = days;
        if (CALL[0].CALCULATION_METHOD_ID == 1) {
            LL.ALLOCATION_DAYS_CAL = (days * LL.ALLOCATION_DAYS * parseFloat($scope.$parent.EmpSearch_HEADER.FTE == undefined ? 1 : $scope.$parent.EmpSearch_HEADER.FTE) / 365).toFixed(0);
        }
        if (CALL[0].CALCULATION_METHOD_ID == 2) {
            LL.ALLOCATION_DAYS_CAL = days;
        }
        if (CALL[0].CALCULATION_METHOD_ID == 3) {
            LL.ALLOCATION_DAYS_CAL = (days * LL.ALLOCATION_DAYS * parseFloat($scope.$parent.EmpSearch_HEADER.FTE == undefined ? 1 : $scope.$parent.EmpSearch_HEADER.FTE) / 260).toFixed(0);
        }
    };
    $scope.GO_BACK = function (FLAG) {
        $location.path('EmpComp').search('EmpID', $scope.EmpID).search('STG', 5)
    };
    $scope.GO_BACK_TO_LIST = function (FLAG) {
        $location.path('team')
    };
    $scope.TAB_CLICK = function (FLAG) {
        $scope.STEP_FLAG = FLAG;
        $scope.HR_GET_EMPLOYEE();
    };

    $scope.REDIRECTTOTEAM = function (FLAG) {
        window.location.href = '../DashBoard/hrIndex#!/team?stp=' + FLAG;
    };
    $scope.LeaveListDelete = [];
    $scope.GET_UPLOADS = function (LIST) {
        var PosiModelObj = new Object();
        PosiModelObj.RELATIVE_ID = LIST.LEAVE_ID;
        PosiModelObj.UPLOAD_TYPE_ID = 10;
        PosiModelObj.VIRTUALPATH = '';
        PosiModelObj.TABLE_ID = -1;
        PosiModelObj.ORIGINAL_FILE_NAME = '';
        PosiModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.PAYROLL_API(PosiModelObj, 'GET_UPLOADS').then(function (data) {
            if (data.data.Table.length > 0) {
                LIST.UploadedFiles = [];
                LIST.UploadedFiles = data.data.Table;
            }
        });
    };
    $scope.DELETE_ALL_LIST = 0;
    $scope.RemoveLeaveLine = function (LINE, index, last) {
        if (confirm('Are you Sure?')) {
            $scope.DELETE_ALL_LIST = 0;
            if (LINE.TABLE_ID == 0) {
                $scope.SELECT_START_YEAR.LeaveList.splice(index, 1);
                //LINE.DELETE_FLAG = 1;
            }
            else {
                $scope.LeaveListDelete.push(angular.copy(LINE));
                //$scope.SELECT_START_YEAR.LeaveList.splice(index, 1);
                LINE.DELETE_FLAG = 1;
                if (last) {
                }
            }
        }
        var Leng = $scope.SELECT_START_YEAR.LeaveList.filter(function (x) { return x.DELETE_FLAG == 0 });
        if (Leng.length == 0) {
            $scope.DELETE_ALL_LIST = 1;
        }
        //$('.modal-backdrop').removeClass('modal-backdrop fade show');
        $scope.COMMON_CODE_CHANGE();
    };

    $scope.GET_LEAVE_REQUEST_BY_ID = function (EMP) {
        $scope.EMP_DTDS = [];
        var PosiModelObj = new Object();
        PosiModelObj.TABLE_ID = EMP.LEAVE_ID;
        PosiModelObj.ADMIN_FLAG = $scope.$parent.CheckSubModuleAccess(48) ? 1 : 0;//-- 1 FOR ADMIN ELSE 0
        PosiModelObj.TIME_ZONE = $cookies.get("TIMEZONE_OFFSET");
        PrcCommMethods.HR_API(PosiModelObj, 'GET_LEAVE_REQUEST_BY_ID').then(function (data) {
            EMP.OVERLAP_LIST = [];
            EMP.UPLOADED_FILES = [];
            if (data.data.Table1.length > 0) { EMP.OVERLAP_LIST = data.data.Table1; }
            if (data.data.Table2.length > 0) { EMP.UPLOADED_FILES = data.data.Table2; }
            if (data.data.Table.length > 0) {
                EMP.ENTITLEMENT_UNIT_ID = data.data.Table[0].ENTITLEMENT_UNIT_ID;
                EMP.DURATION_DAYS_PAID = data.data.Table[0].DURATION_DAYS_PAID;
                EMP.DURATION_DAYS_UNPAID = data.data.Table[0].DURATION_DAYS_UNPAID;
                EMP.DURATION_HOURS_PAID = data.data.Table[0].DURATION_HOURS_PAID;
                EMP.DURATION_HOURS_UNPAID = data.data.Table[0].DURATION_HOURS_UNPAID;
            }
            $scope.EMP_DTDS = EMP;
        });
    };
    $scope.GET_LEAVE_REQUEST_BY_ID_OVER_LAP = function (EMP) {
        var PosiModelObj = new Object();
        PosiModelObj.TABLE_ID = EMP.LEAVE_ID;
        PosiModelObj.ADMIN_FLAG = $scope.$parent.CheckSubModuleAccess(48) ? 1 : 0;//-- 1 FOR ADMIN ELSE 0
        PosiModelObj.TIME_ZONE = $cookies.get("TIMEZONE_OFFSET");
        PrcCommMethods.HR_API(PosiModelObj, 'GET_LEAVE_REQUEST_BY_ID').then(function (data) {
            EMP.OVERLAP_LIST = [];
            EMP.UPLOADED_FILES = [];
            if (data.data.Table1.length > 0) { EMP.OVERLAP_LIST = data.data.Table1; }
            if (data.data.Table2.length > 0) { EMP.UPLOADED_FILES = data.data.Table2; }
        });
    };

    $scope.POP_DELETE_LEAVE = function (RRL, FLAG) {
        $scope.LEAVE_CANCEL = '';
        $('#MY_REQUEST_LEAVE_DETAILS_C').modal('show');
        RRL.DIS_PLAY_FLAG = FLAG;
        $scope.EMP_DTDS = RRL;
        $scope.GET_UPLOADS(RRL);
        $scope.AbsenceSubmit.submitted = false;
        $scope.GET_LEAVE_REQUEST_BY_ID(RRL);
        $scope.GET_LEAVE_REQUEST_BY_ID_OVER_LAP(RRL);

    };
    $scope.COMMENT_FLAG = true;
    $scope.AbsenceSubmit = {
    };
    $scope.CHANGE_LEAVE_COMMTS = function () {
        $scope.REJECT_APPROVE_FLAG = 1;
        if ($scope.LEAVE_CANCEL != undefined && $scope.LEAVE_CANCEL != null && $scope.LEAVE_CANCEL != "") {
            $scope.REJECT_APPROVE_FLAG = 0;
        }
    }
    $scope.APP_REJ_HR_LEAVE_REQUESTS = function (LEVAE_FLAG, EMP_DTDS) {
        $scope.AbsenceSubmit.submitted = true;
        $scope.REJECT_APPROVE_FLAG = 0;
        var count = 0;
        if (LEVAE_FLAG == 13) {
            if ($scope.LEAVE_CANCEL == "" || $scope.LEAVE_CANCEL == null || $scope.LEAVE_CANCEL == undefined) {
                $scope.REJECT_APPROVE_FLAG = 1;
                count = 1;
            }
        }
        var DURATION_DAYS_PAID = EMP_DTDS.DURATION_DAYS_PAID;
        if (isNaN(parseFloat(EMP_DTDS.DURATION_DAYS_PAID))) {
            DURATION_DAYS_PAID = 0;
        }
        var DURATION_DAYS_UNPAID = EMP_DTDS.DURATION_DAYS_UNPAID;
        if (isNaN(parseFloat(EMP_DTDS.DURATION_DAYS_UNPAID))) {
            DURATION_DAYS_UNPAID = 0;
        }
        var DURATION_HOURS_PAID = EMP_DTDS.DURATION_HOURS_PAID;
        if (isNaN(parseFloat(EMP_DTDS.DURATION_HOURS_PAID))) {
            DURATION_HOURS_PAID = 0;
        }
        var DURATION_HOURS_UNPAID = EMP_DTDS.DURATION_HOURS_UNPAID;
        if (isNaN(parseFloat(EMP_DTDS.DURATION_HOURS_UNPAID))) {
            DURATION_HOURS_UNPAID = 0;
        }
        if (LEVAE_FLAG == 12 && (EMP_DTDS.ENTITLEMENT_UNIT_ID == 1 || EMP_DTDS.ENTITLEMENT_UNIT_ID == 3)) {
            var DAYS = parseFloat(DURATION_DAYS_PAID) + parseFloat(DURATION_DAYS_UNPAID);
            if (parseFloat(DAYS) > parseFloat(EMP_DTDS.DURATION_DAYS) || parseFloat(DAYS) < parseFloat(EMP_DTDS.DURATION_DAYS)) {
                count = 2;
            }
        };
        if (LEVAE_FLAG == 12 && EMP_DTDS.ENTITLEMENT_UNIT_ID == 2) {
            var HOURS = parseFloat(DURATION_HOURS_PAID) + parseFloat(DURATION_HOURS_UNPAID);
            if (parseFloat(HOURS) > parseFloat(EMP_DTDS.DURATION_HOURS) || parseFloat(HOURS) < parseFloat(EMP_DTDS.DURATION_HOURS)) {
                count = 2;
            }
        };

        if ($scope.AbsenceLeave.$valid && count == 0) {
            if (confirm('Are you Sure?')) {
                var LevModelObj = new Object();
                LevModelObj.TABLE_ID = EMP_DTDS.LEAVE_ID;
                LevModelObj.STATUS_ID = LEVAE_FLAG;
                LevModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
                LevModelObj.USER_ID = parseInt(
                    $cookies.get("USERID"));
                LevModelObj.COMMENTS = $scope.LEAVE_CANCEL;
                if (EMP_DTDS.ENTITLEMENT_UNIT_ID == 1 || EMP_DTDS.ENTITLEMENT_UNIT_ID == 3) {
                    LevModelObj.DURATION_PAID = parseFloat(DURATION_DAYS_PAID).toFixed(5);
                    LevModelObj.DURATION_UNPAID = parseFloat(DURATION_DAYS_UNPAID).toFixed(5);
                }
                if (EMP_DTDS.ENTITLEMENT_UNIT_ID == 2) {
                    LevModelObj.DURATION_PAID = parseFloat(DURATION_HOURS_PAID).toFixed(5);
                    LevModelObj.DURATION_UNPAID = parseFloat(DURATION_HOURS_UNPAID).toFixed(5);
                }

                PrcCommMethods.HR_API(LevModelObj, 'APP_REJ_HR_LEAVE_REQUESTS').then(function (data) {
                    if (data.data == 0) {
                        $scope.$parent.ShowAlert('Error', $scope.$parent.SOMETHINGWENTWRONG, 5000);
                    }
                    if (data.data == 1) {
                        //$scope.HR_GET_EMPLOYEE();
                        $scope.GET_LEAVE_REQUEST_LIST(1);
                        if (LEVAE_FLAG == 14) {
                            $scope.$parent.ShowAlert('Success', 'Cancel Successfully', 5000);
                        }
                        if (LEVAE_FLAG == 13) {
                            $scope.$parent.ShowAlert('Success', 'Rejected Successfully', 5000);
                        }
                        if (LEVAE_FLAG == 12) {
                            $scope.$parent.ShowAlert('Success', 'Approved Successfully', 5000);
                        }


                        $('#MY_REQUEST_LEAVE_DETAILS_C').modal('hide');
                    }
                });
            }
        } else {
            if (count == 2) {
                $scope.ShowAlert('Error', "Sum of Paid and Unpaid should be equal to total leave duration.", 5000);
            }
        }
    };
    $scope.POP_EMPLOYEE_STEP_FLAG = function (LBL_TEXT, STEP_NO) {
        var count = 0;
        var IsValid = true;
        $scope.EmpDtlsForm_6.submitted = true;
        if ($scope.EmpDtlsForm_6.$valid) {
            for (var i = 0; i < $scope.ABSENCE_TYPE.length; i++) {
                var Lth = $scope.SELECT_START_YEAR.LeaveList.filter(function (x) { return x.DELETE_FLAG == 0 && $scope.ABSENCE_TYPE[i].HOLIDAY_ENTITLEMENT_ID == x.HOLIDAY_ENTITLEMENT_ID });
                if (Lth.length > 1) {
                    count = 1;
                    break;
                }
            }
        }


        //angular.forEach($scope.SELECTED_YEAR_DDL, function (ddl) {
        angular.forEach($scope.SELECT_START_YEAR.LeaveList, function (LL) {
            if (LL.DELETE_FLAG == 0) {
                if (new Date(LL.YEAR_START_DATE) > new Date(LL.YEAR_END_DATE)) {
                    IsValid = false;
                }
                if (LL.ALLOCATION_DAYS_CAL == '.') {
                    LL.ALLOCATION_DAYS_CAL = ''
                    count = 2;
                }
            }
        })
        //})

        if (!IsValid) {
            $scope.$parent.ShowAlert('Error', 'Year start date should be less then year end date', 3000);
        }
        if ($scope.EmpDtlsForm_6.$valid && count == 0 && IsValid) {
            if (LBL_TEXT != undefined && LBL_TEXT != '') {
                $scope.EFFECTIVEForm.submitted = true;
                if ($scope.EFFECTIVEForm.$valid) {
                    $scope.HR_INS_UPD_EMPLOYEE_STEP_6(LBL_TEXT)
                }
                else {
                    $('#EFFECTIVE_DATA').modal('show');
                }
            }
            else {
                $('#EFFECTIVE_DATA').modal('show');
            }
        }
        else {
            if (count == 1) {
                $scope.$parent.ShowAlert('Error', 'Absence type should not be duplicate', 5000);
            }
        }
    };

    $scope.NG_INIT_LEAVE = function (P_LIST) {
        P_LIST.PREV_DATA = [];
        P_LIST.IS_MANDATORY = false;
        P_LIST.IS_SELECT = false;
        P_LIST.count = 0;
        var PREV_DATA = $scope.LeaveList_COPY.filter(function (x) { return x.TABLE_ID == P_LIST.TABLE_ID });
        if (PREV_DATA.length > 0) {
            P_LIST.PREV_DATA = PREV_DATA;
        };
    };
    //setInterval(function () {
    //    if (navigator.onLine) {
    //        console.log('your are connected')
    //    }
    //    else {
    //        console.log('your are disconnected')
    //    }
    //}, 1000); // Restart connection after 5 seconds.;
    $scope.$parent.child_scope = $scope;
});
app.controller('DocumentsController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $timeout) {
    $('.modal-backdrop').removeClass('modal-backdrop fade show');
    $scope.CHECK_MODULE_ACCESS = false;
    $scope.COMMON_CODE_CHANGE();
    $scope.$parent.TabActive(2);
    $scope.$parent.SCROLL_TOP();
    $scope.EFFECTIVE_DATA_LIST = [];
    $scope.FILE_SIZE = 10;
    $scope.$parent.EFFECTIVE_RESET_LOAD();
    $scope.EMP_SEARCH_NAME_DTL = {
    }
    $scope.ObjectHistoryData = {
    };
    $scope.$parent.$parent.overlay_loadingNew = 'block'
    $scope.EmpID = getUrlParameter('EmpID', $location.absUrl());

    $scope.EMP_WORK_PERMIT = [];
    $scope.PREV_EMP_WORK_PERMIT = [];
    $scope.EMP_CONTRACTS = [];
    $scope.EMP_OTHER_DOCUMENTS = [];
    $scope.EFFECTIVE_SEARCH = {
        EFFECTIVE_DATE: null,
        COMMENTS: '',
    }
    $scope.STEP_FLAG = 7;
    $scope.ObjectData = [];
    $scope.BACKTOTEAM = "Back To Team";
    $scope.EmpSearch_7 = {
        EMP_DOCUMENT_ID: 0,
        Emp_ID: null,
        COMPANY_ID: null,
        IS_WORK_PERMIT_REQ: false,
    };
    $scope.ResetEmp = function () {
        $scope.EmpSearch = {
            DEPARTMENT_NAME: "",
            DEPARTMENT_COLOR: '',
            PARENT_DEPARTMENT_ID: null,
            PAGE_NO: 1,
            PAGE_SIZE: 10,
        }
    };
    $scope.DateInputLoad = function () {
        $(document).ready(function () {
            var date_inputs = document.getElementsByClassName("dateinput") //our date input has the name "date"
            if (date_inputs.length > 0) {
                for (var i = 0; i < date_inputs.length; i++) {
                    var date_input = $('input[name="' + date_inputs[i].name + '"]'); //our date input has the name "date"
                    var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
                    var date = new Date();
                    var options = {
                        todayBtn: "linked",
                        daysOfWeekHighlighted: "0,6",
                        autoclose: true,
                        todayHighlight: true,
                        format: 'M dd, yyyy',
                        clearBtn: true,
                        closeBtn: true,// close button visible
                        startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate())
                    };
                    date_input.datepicker(options);
                }
            }
        });
    };
    $scope.DateInputLoad();

    $scope.GET_DOCUMENT_TYPE = function (CUSTOM_FIELD) {
        var PosiModelObj = new Object();
        PosiModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        PrcCommMethods.HR_API(PosiModelObj, 'GET_DOCUMENT_TYPE').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.DOCUMENT_TYPE = data.data.Table;
                //  CUSTOM_FIELD.OPTION_LIST = data.data.Table;
            }
            else {
                $scope.DOCUMENT_TYPE = [];
                //  CUSTOM_FIELD.OPTION_LIST = [];
            }
        });
    };
    $scope.GET_WORK_PERMIT_TYPE = function (CUSTOM_FIELD) {
        var PosiModelObj = new Object();
        PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PrcCommMethods.HR_API(PosiModelObj, 'GET_WORK_PERMIT_TYPE').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.WORK_PERMIT_TYPE = data.data.Table;
                //CUSTOM_FIELD.OPTION_LIST = data.data.Table;
            }
            else {
                $scope.WORK_PERMIT_TYPE = [];
                //CUSTOM_FIELD.OPTION_LIST = [];
            }
        });
    };

    $scope.GET_DOCUMENT_TYPE();
    $scope.GET_WORK_PERMIT_TYPE();
    $scope.HR_GET_EMPLOYEE = function () {
        $scope.EFFECTIVE_DATA_LIST = [];
        var PosiModelObj = new Object();
        PosiModelObj.EMPLOYEE_ID = $scope.EmpID;
        PosiModelObj.STEP_NO = 7;
        PosiModelObj.LOGIN_USER_EMP_ID = parseInt($cookies.get("EMPLOYEE_ID"));
        PrcCommMethods.HR_API(PosiModelObj, 'HR_GET_EMPLOYEE').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.EmpSearch_7 = data.data.Table[0];
                $scope.EMP_DOCUMENT_ID = data.data.Table[0].EMP_DOCUMENT_ID;
            }
            if (data.data.Table1.length > 0) {

                $scope.ObjectData = data.data.Table[0];
                $scope.ObjectHistoryData = data.data.Table[0];

                $scope.EMP_WORK_PERMIT = data.data.Table1.filter(function (x) { return x.UPLOAD_TYPE_ID == 5 });
                $scope.PREV_EMP_WORK_PERMIT = angular.copy($scope.EMP_WORK_PERMIT);
                $scope.EMP_CONTRACTS = data.data.Table1.filter(function (x) { return x.UPLOAD_TYPE_ID == 6 });
                $scope.EMP_OTHER_DOCUMENTS = data.data.Table1.filter(function (x) { return x.UPLOAD_TYPE_ID == 7 });
            }
            if (data.data.Table2.length > 0) {
                $scope.CHK_RIGHT_TO_WORK = data.data.Table2[0].CHK_RIGHT_TO_WORK == 1 ? true : false;
                $scope.EmpSearch_7.IS_WORK_PERMIT_REQ = data.data.Table2[0].CHK_RIGHT_TO_WORK == 1 ? true : false;
                if ($scope.EmpSearch_7.WORK_PERMIT_TYPE_ID != undefined && $scope.EmpSearch_7.WORK_PERMIT_TYPE_ID != null && $scope.EmpSearch_7.WORK_PERMIT_TYPE_ID != '') {
                    $scope.EmpSearch_7.IS_WORK_PERMIT_REQ = true;
                }
            }
            if (data.data.Table3.length > 0) {
                $scope.EFFECTIVE_DATA_LIST = data.data.Table3;
            }
            $scope.$parent.$parent.overlay_loadingNew = 'none'

            if ($filter('lowercase')($location.absUrl()).indexOf("editempdoc") != -1) {
                // $('#EFFECTIVE_DATA').modal('show');
            }
        });
    };
    if ($scope.EmpID > 0) {
        $scope.HR_GET_EMPLOYEE();
    };
    $scope.WorkPermitChanges = function () {
        if (!$scope.CHK_RIGHT_TO_WORK) {
            if ($scope.EmpSearch_7.WORK_PERMIT_TYPE_ID == undefined || $scope.EmpSearch_7.WORK_PERMIT_TYPE_ID == null || $scope.EmpSearch_7.WORK_PERMIT_TYPE_ID == '') {
                $scope.EmpSearch_7.IS_WORK_PERMIT_REQ = false;
                $scope.IS_WORK_PERMIT = true;
            }
            else {
                $scope.EmpSearch_7.IS_WORK_PERMIT_REQ = true;
                $scope.IS_WORK_PERMIT = false;
            }
        }
    };
    $scope.getTheFilesToUpload_7 = function ($files, ControlName, FileSize, FILE_TYPE) {
        if (FileSize == undefined || FileSize == null || FileSize == 0 || FileSize == '') {
            FileSize = AppVal.FileSize;
        }
        $scope.imagesrc = [];
        var valid = 0;
        for (var i = 0; i < $files.length; i++) {

            if ($scope.Attachment_UPLOAD_TYPE_ID == 12) {
                var validFormats = ['MPEG4', 'MP4', 'video/mp4'];
            }
            else {
                var validFormats = ['doc', 'docx', 'xml', 'pdf', 'csv', 'txt', 'text', 'jpg', 'jpeg', 'png', 'MPEG4', 'MP4', 'video/mp4', 'excel'];
            }
            var validity = validFormats.map(function (element) {
                if ($files[i].type.indexOf(element) != -1) {
                    return 1;
                }
                else {
                    return 0;
                }
            });
            valid = validity.indexOf(1);

            if (valid != -1) {
                if (($files[i].size / 1000000).toFixed(2) <= FileSize) {//File Size should not be more than 5 MB
                    var reader = new FileReader();
                    reader.fileName = $files[i].name;
                    reader.onload = function (event) {
                        var image = {};
                        image.Name = event.target.fileName;
                        image.Size = (event.total / 1024).toFixed(2);
                        image.Src = event.target.result;
                        $scope.imagesrc.push(image);
                        $scope.$apply();
                    }
                    //     reader.readAsDataURL($files[i]);
                    reader.readAsText($files[i]);
                }
                else {
                    $scope.ShowAlert('Error', 'Maximum File Size ' + FileSize + ' MB.', 5000);
                    angular.element("input[id='" + ControlName + "']").val(null);
                    return;
                }
            }
            else {
                $scope.ShowAlert('Error', 'Not a valid file.', 5000);
                angular.element("input[id='" + ControlName + "']").val(null);
                return;
            }

        }
        $scope.Files = $files;
        var fileUpload = document.getElementById(ControlName);
        extension = fileUpload.files[0].name;;
        $scope.uploadFiles_7(FILE_TYPE, '', extension);
    };
    $scope.RendomNumber = $scope.$parent.generaterandom(12);
    $scope.uploadFiles_7 = function (Attachment_UPLOAD_TYPE_ID, ATTACHEMENT_TYPE_ID, filename, List, index) {
        if (($scope.Files != undefined && $scope.Files.length > 0)) {
            $scope.DocImageResult = [];
            var data = new FormData();
            if ($scope.EMP_DOCUMENT_ID == undefined) {
                data.append("RelativeID", $scope.EmpID);
                data.append("UPLOAD_TYPE_ID", Attachment_UPLOAD_TYPE_ID);
            }
            else {
                if (Attachment_UPLOAD_TYPE_ID == 5) {
                    data.append("RelativeID", $scope.RendomNumber + '' + $scope.EmpID + '' + parseInt($cookies.get("USERID")));
                    data.append("UPLOAD_TYPE_ID", 12);
                }
                else {
                    data.append("RelativeID", $scope.EmpID);
                    data.append("UPLOAD_TYPE_ID", Attachment_UPLOAD_TYPE_ID);
                }
            }
            data.append("VIRTUALPATH", '/Customer/Entity/' + parseInt($cookies.get("ENTITY_ID")) + '/HR/Employee/' + $scope.EmpID + '/Documents/' + Attachment_UPLOAD_TYPE_ID + '/');
            data.append("UPLOAD_ID", 0);
            data.append("ORIGINAL_FILE_NAME", filename);
            data.append("USER_ID", parseInt($cookies.get("USERID")));
            if (isNaN(parseInt($cookies.get("ENTITY_ID")))) {
                data.append("ENTITY_ID", 0);
            }
            else {
                data.append("ENTITY_ID", parseInt($cookies.get("ENTITY_ID")));
            }
            for (var i in $scope.Files) {
                data.append("uploadedFile", $scope.Files[i]);
            }
            var request = {
                method: 'POST',
                url: CommService.Get_CASHUP_API() + "api/PayrollAPI/UPLOADFILES",
                data: data,
                headers: {
                    'Content-Type': undefined
                }
            };
            $http(request).then(function (d) {
                if (d.data.length > 0 && d.data[0].UPLOADED_COMMENT != undefined) {
                    $scope.ShowAlert('Error', d.data[0].UPLOADED_COMMENT, 5000);
                }
                else {
                    if (Attachment_UPLOAD_TYPE_ID == 5) {
                        $scope.EMP_WORK_PERMIT = d.data;
                    }
                    if (Attachment_UPLOAD_TYPE_ID == 6) {
                        $scope.EMP_CONTRACTS = d.data;
                    }
                    if (Attachment_UPLOAD_TYPE_ID == 7) {
                        $scope.EMP_OTHER_DOCUMENTS = d.data;
                    }
                }
            });
        }
    };
    $scope.GET_UPLOADS = function (Attachment_UPLOAD_TYPE_ID) {
        var PosiModelObj = new Object();
        PosiModelObj.RELATIVE_ID = $scope.EmpID;
        PosiModelObj.UPLOAD_TYPE_ID = Attachment_UPLOAD_TYPE_ID;
        PosiModelObj.VIRTUALPATH = '';
        PosiModelObj.TABLE_ID = -1;
        PosiModelObj.ORIGINAL_FILE_NAME = '';
        PosiModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.PAYROLL_API(PosiModelObj, 'GET_UPLOADS').then(function (data) {
            if (data.data.Table.length > 0) {
                if (Attachment_UPLOAD_TYPE_ID == 5) {
                    $scope.EMP_WORK_PERMIT = data.data.Table;
                }
                if (Attachment_UPLOAD_TYPE_ID == 6) {
                    $scope.EMP_CONTRACTS = data.data.Table;
                }
                if (Attachment_UPLOAD_TYPE_ID == 7) {
                    $scope.EMP_OTHER_DOCUMENTS = data.data.Table;
                }
            }
        });
    };
    $scope.HR_INS_UPD_EMPLOYEE_STEP_7 = function (FLAG) {
        if (FLAG == 'SKIP') {
            $scope.HR_INS_UPD_EMPLOYEE_STEP_7_NON_MADATORY();
        }
        else {
            if (!$scope.CHK_RIGHT_TO_WORK) {
                if ($scope.EmpSearch_7.WORK_PERMIT_TYPE_ID == undefined || $scope.EmpSearch_7.WORK_PERMIT_TYPE_ID == null || $scope.EmpSearch_7.WORK_PERMIT_TYPE_ID == '') {
                    $scope.EmpSearch_7.IS_WORK_PERMIT_REQ = false;
                    $scope.IS_WORK_PERMIT = true;
                }
                else {
                    $scope.IS_WORK_PERMIT = true;
                    if ($scope.EMP_WORK_PERMIT == undefined || $scope.EMP_WORK_PERMIT.length == 0) {
                        $scope.IS_WORK_PERMIT = false;
                    }
                }
            }
            else {
                $scope.IS_WORK_PERMIT = true;
                if ($scope.EMP_WORK_PERMIT == undefined || $scope.EMP_WORK_PERMIT.length == 0) {
                    $scope.IS_WORK_PERMIT = false;
                }
            }
            $scope.EmpDtlsForm_7.submitted = true;
            if ($scope.EmpDtlsForm_7.$valid && $scope.IS_WORK_PERMIT) {
                var EmpModelObj = new Object();
                EmpModelObj.EMP_PRS_ID = $scope.EmpID;
                EmpModelObj.EMP_DOCUMENT_ID = $scope.EmpSearch_7.EMP_DOCUMENT_ID;
                EmpModelObj.DOCUMENT_TYPE_ID = $scope.EmpSearch_7.DOCUMENT_TYPE_ID;
                EmpModelObj.WORK_PERMIT_TYPE_ID = $scope.EmpSearch_7.WORK_PERMIT_TYPE_ID;
                EmpModelObj.NOTES = $scope.EmpSearch_7.NOTES;
                EmpModelObj.EXPIRY_DATE = $scope.EmpSearch_7.EXPIRY_DATE;
                EmpModelObj.USER_ID = parseInt($cookies.get("USERID"));
                EmpModelObj.EFFECTIVE_DATE = $scope.EFFECTIVE_SEARCH.EFFECTIVE_DATE;
                EmpModelObj.COMMENTS = $scope.EFFECTIVE_SEARCH.COMMENTS;
                var Uploads = '';
                if ($scope.EMP_DOCUMENT_ID == undefined) {
                }
                else {
                    angular.forEach($scope.EMP_WORK_PERMIT, function (x) {
                        var IFNOT = $scope.PREV_EMP_WORK_PERMIT.filter(function (y) { return y.UPLOAD_ID == x.UPLOAD_ID });
                        if (IFNOT.length == 0) {
                            if (Uploads == '') {
                                Uploads = x.UPLOAD_ID;
                            }
                            else {
                                Uploads = Uploads + ',' + x.UPLOAD_ID;
                            }
                        }
                    });
                }
                EmpModelObj.UPLOAD_IDS = Uploads;
                EmpModelObj.EXPIRY_DATE = $scope.EmpSearch_7.EXPIRY_DATE;
                EmpModelObj.SELF_UPDATE_FLAG = ($cookies.get("EMPLOYEE_ID") == parseInt(getUrlParameter('EmpID', $location.absUrl()))) ? 1 : 0;
                PrcCommMethods.HR_API(EmpModelObj, 'HR_INS_UPD_EMPLOYEE_STEP_7').then(function (data) {
                    if (data.data == 0) {
                        $scope.$parent.ShowAlert('Error', $scope.$parent.SOMETHINGWENTWRONG, 5000);
                    }
                    else if (FLAG == 'VIEW') {
                        $scope.$parent.ShowAlert('Success', 'Documents Updated Successfully', 5000);
                        $scope.$parent.VIEW_TAB_CLICK(7);
                    }
                    else if (data.data > 0) {
                        $('#GO_TO').modal('show');
                    }
                });
            }
            else {
                $('#EFFECTIVE_DATA').modal('hide');
            }
        }
    };
    $scope.HR_INS_UPD_EMPLOYEE_STEP_7_NON_MADATORY = function (FLAG) {
        var EmpModelObj = new Object();
        EmpModelObj.EMP_PRS_ID = $scope.EmpID
        EmpModelObj.EMP_DOCUMENT_ID = -1;
        EmpModelObj.SELF_UPDATE_FLAG = ($cookies.get("EMPLOYEE_ID") == parseInt(getUrlParameter('EmpID', $location.absUrl()))) ? 1 : 0;
        PrcCommMethods.HR_API(EmpModelObj, 'HR_INS_UPD_EMPLOYEE_STEP_7').then(function (data) {
            if (data.data == 0) {
                $scope.$parent.ShowAlert('Error', $scope.$parent.SOMETHINGWENTWRONG, 5000);
            }
            if (data.data > 0) {
                //$scope.$parent.ShowAlert('Success', 'You have successfully Hired ' + $scope.$parent.EmpSearch_HEADER.FIRST_NAME, 5000);
                //window.location.href = "../DashBoard/hrIndex#!/EditProfile?EmpID=" + $scope.EmpID;
                $('#GO_TO').modal('show');
            }
        });
    };
    $scope.GO_BACK = function (FLAG) {
        //$scope.STEP_FLAG = FLAG;
        $location.path('EmpLev').search('EmpID', $scope.EmpID).search('STG', 6)
    };
    $scope.GO_BACK_TO_LIST = function (FLAG) {
        $location.path('team')
    };
    $scope.TERMINATION_DETAILS = [];
    $scope.GET_EMPLOYEE_PROFILE_HEADER = function () {
        var PosiModelObj = new Object();
        PosiModelObj.EMPLOYEE_ID = $scope.EmpID;
        PrcCommMethods.HR_API(PosiModelObj, 'GET_EMPLOYEE_PROFILE_HEADER').then(function (data) {
            $scope.$parent.EmpSearch_HEADER = data.data.Table[0];
            $scope.STEP_NO = data.data.Table1[0].STEP_NO;
            $scope.EMP_SEARCH_NAME_DTL = data.data.Table1[0];
            $scope.TERMINATION_DETAILS = data.data.Table2;
            if ($filter('lowercase')($location.absUrl()).indexOf("editempdoc") != -1 || $filter('lowercase')($location.absUrl()).indexOf("viewempdoc") != -1) {
                $scope.$parent.CalculetteService(data.data.Table[0]);
            }
        });
        $scope.IS_EDITABLE_FLAG = true;
        if ($scope.EmpID == parseInt($cookies.get("EMPLOYEE_ID"))) {
            $scope.IS_EDITABLE_FLAG = false;
            $scope.EDIT_PROFILE_CHECK_MODULE_ACCESS = $scope.CheckSubModuleAccess(4);
        }
        else {
            $scope.EDIT_PROFILE_CHECK_MODULE_ACCESS = $scope.$parent.CHECK_MODULE_ACCESS(3, 3);
        }
    };
    $scope.GET_EMPLOYEE_PROFILE_HEADER();

    $scope.TAB_CLICK = function (FLAG) {
        // $location.path('team')
        $scope.STEP_FLAG = FLAG;
        $scope.HR_GET_EMPLOYEE();
    };
    $scope.REDIRECTTOTEAM = function (FLAG) {
        window.location.href = '../DashBoard/hrIndex#!/team?stp=' + FLAG;
    };

    if ($filter('lowercase')($location.absUrl()).indexOf("viewempcomp") != -1) {
        //   $('#EFFECTIVE_DATA').modal('show');
        $scope.GET_VIEW_EMPLOYEE_PROFILE = function () {
            $scope.$parent.$parent.overlay_loadingNew = 'block'
            var ModelObj = new Object();
            ModelObj.EMPLOYEE_ID = $scope.EmpID;
            ModelObj.STEP_NO = 7;
            ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));;
            PosiModelObj.LOGIN_USER_EMP_ID = parseInt($cookies.get("EMPLOYEE_ID"));
            PrcCommMethods.HR_API(ModelObj, 'HR_GET_EMPLOYEE').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.EmpSearch_7 = data.data.Table[0];
                    $scope.EmpSearch_7.COLMD = 'col-md-4';
                    $scope.EmpSearch_7.IS_HEADER = false;
                    $scope.GET_CUSTOM_LABEL_APP_FIELD_MAPPING(11, data.data.Table[0]);
                }
                if (data.data.Table1.length > 0) {
                    $scope.EMP_WORK_PERMIT = data.data.Table1.filter(function (x) { return x.UPLOAD_TYPE_ID == 5 });
                    $scope.EMP_CONTRACTS = data.data.Table1.filter(function (x) { return x.UPLOAD_TYPE_ID == 6 });
                    $scope.EMP_OTHER_DOCUMENTS = data.data.Table1.filter(function (x) { return x.UPLOAD_TYPE_ID == 7 });
                }
                //if (data.data.Table2.length > 0) {
                //    $scope.$parent.EmpSearch_HEADER = data.data.Table2[0];
                //    $scope.STEP_NO = data.data.Table2[0].STEP_NO;
                //}
                if (data.data.Table3.length > 0) {
                    $scope.CHK_RIGHT_TO_WORK = data.data.Table3[0].CHK_RIGHT_TO_WORK == 1 ? true : false;
                    $scope.EmpSearch_7.IS_WORK_PERMIT_REQ = data.data.Table3[0].CHK_RIGHT_TO_WORK == 1 ? true : false;
                }
            });
        }
        //  $scope.GET_VIEW_EMPLOYEE_PROFILE();
    };

    $scope.ADD_DOCUMENT = function () {
        //$('#Add_Document').modal('show');
        $location.path('EditEmpDoc');
    };
    //$scope.POP_EMPLOYEE_STEP_FLAG = function (LBL_TEXT, STEP_NO) {
    //    if (LBL_TEXT != undefined && LBL_TEXT != '') {
    //        $scope.EFFECTIVEForm.submitted = true;
    //        if ($scope.EFFECTIVEForm.$valid) {
    //            $scope.HR_INS_UPD_EMPLOYEE_STEP_7(LBL_TEXT);
    //        }
    //    }
    //}

    $scope.POP_EMPLOYEE_STEP_FLAG = function (LBL_TEXT, STEP_NO) {
        if (!$scope.CHK_RIGHT_TO_WORK) {
            if ($scope.EmpSearch_7.WORK_PERMIT_TYPE_ID == undefined || $scope.EmpSearch_7.WORK_PERMIT_TYPE_ID == null || $scope.EmpSearch_7.WORK_PERMIT_TYPE_ID == '') {
                $scope.EmpSearch_7.IS_WORK_PERMIT_REQ = false;
                $scope.IS_WORK_PERMIT = true;
            }
            else {
                $scope.IS_WORK_PERMIT = true;
                if ($scope.EMP_WORK_PERMIT == undefined || $scope.EMP_WORK_PERMIT.length == 0) {
                    $scope.IS_WORK_PERMIT = false;
                }
            }
        }
        else {
            $scope.IS_WORK_PERMIT = true;
            if ($scope.EMP_WORK_PERMIT == undefined || $scope.EMP_WORK_PERMIT.length == 0) {
                $scope.IS_WORK_PERMIT = false;
            }
        }


        $scope.EmpDtlsForm_7.submitted = true;
        if ($scope.EmpDtlsForm_7.$valid && $scope.IS_WORK_PERMIT) {
            if (LBL_TEXT != undefined && LBL_TEXT != '') {
                $scope.EFFECTIVEForm.submitted = true;
                if ($scope.EFFECTIVEForm.$valid) {
                    $scope.HR_INS_UPD_EMPLOYEE_STEP_7(LBL_TEXT);
                }
                else {
                    $('#EFFECTIVE_DATA').modal('show');
                }
            }
            else {
                $('#EFFECTIVE_DATA').modal('show');
            }
        }
    };

    $scope.GOTO_FY = function (FLAG) {
        $('#GO_TO').modal('hide')
        $timeout(function () {
            if (FLAG == 1) {
                $scope.$parent.VIEW_TAB_CLICK(10);
            }
            else if (FLAG == 2) {
                $scope.$parent.VIEW_TAB_CLICK(1);
            }
        }, 1000);
    };
    $scope.$parent.child_scope = $scope;
});
app.controller('NoteController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $timeout, $interval) {
    $('.modal-backdrop').removeClass('modal-backdrop fade show');
    $scope.CHECK_MODULE_ACCESS = false;
    $scope.COMMON_CODE_CHANGE();
    $scope.$parent.TabActive(2);
    $scope.$parent.SCROLL_TOP();
    $scope.$parent.EFFECTIVE_RESET_LOAD();
    $scope.SETTING_MINTS = 5;
    $scope.$parent.$parent.overlay_loadingNew = 'block'
    $scope.EmpID = getUrlParameter('EmpID', $location.absUrl());


    $scope.ObjectData = [];
    $scope.BACKTOTEAM = "Back To Team";
    $scope.EmpNoteSearch = {
        EMP_DOCUMENT_ID: 0,
        Emp_ID: null,
        COMPANY_ID: null,
        IS_WORK_PERMIT_REQ: false,
        PAGE_NO: 1,
        PAGE_SIZE: 10,
    };
    $scope.ResetEmp = function () {
        $scope.EmpNoteSearch = {
            DEPARTMENT_NAME: "",
            DEPARTMENT_COLOR: '',
            PARENT_DEPARTMENT_ID: null,
            PAGE_NO: 1,
            PAGE_SIZE: 10,
        }
    };

    var timer = "";
    function clockUpdate() {
        var date = new moment($scope.CURRENT_UTC_TIME).add(1, 'seconds');
        $scope.CURRENT_UTC_TIME = date;
        $scope.$apply();
    }

    $scope.EMPLOYEE_NOTES_LIST = [];
    $scope.GET_EMPLOYEE_NOTES = function (FLAG) {
        if (FLAG == undefined) {
            $scope.EMPLOYEE_NOTES_LIST = [];
            $scope.EmpNoteSearch.PAGE_NO = 1;
        }
        var PosiModelObj = new Object();
        PosiModelObj.EMP_PRS_ID = $scope.EmpID;
        PosiModelObj.PAGE_NO = 0;//$scope.EmpNoteSearch.PAGE_NO;
        PosiModelObj.PAGE_SIZE = $scope.EmpNoteSearch.PAGE_SIZE;
        PrcCommMethods.HR_API(PosiModelObj, 'GET_EMPLOYEE_NOTES').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.CURRENT_UTC_TIME = angular.copy(data.data.UTC_TIME[0].UTC_TIME);
                if (timer) {
                    clearInterval(timer);
                }
                timer = setInterval(clockUpdate, 1000);
                if (data.data.Table != null && data.data.Table.length > 0) {
                    $scope.EMPLOYEE_NOTES_LIST = $scope.EMPLOYEE_NOTES_LIST.concat(data.data.Table);
                }
            }
        });
    };
    $scope.GET_EMPLOYEE_NOTES();
    $scope.RESET_EMPLOYEE_NOTES = function () {
        $scope.EmpNoteSearch.NOTE = ""
        $scope.EmpNoteSearch.TITLE = ""
        $scope.EmpNoteForm.submitted = false;
    }
    $scope.INS_UPD_EMPLOYEE_NOTES = function (FNL) {
        var valid;
        if (FNL == undefined) {
            $scope.EmpNoteForm.submitted = true;
            valid = $scope.EmpNoteForm.$valid
        }
        if (valid) {
            var EmpModelObj = new Object();
            EmpModelObj.TABLE_ID = FNL != undefined ? FNL.TABLE_ID : 0;
            EmpModelObj.EMP_PRS_ID = $scope.EmpID;
            EmpModelObj.TITLE = FNL != undefined ? FNL.EDIT_TITLE : $scope.EmpNoteSearch.TITLE;
            EmpModelObj.NOTE = FNL != undefined ? FNL.EDIT_NOTE : $scope.EmpNoteSearch.NOTE;
            EmpModelObj.USER_ID = parseInt($cookies.get("USERID"));
            EmpModelObj.DELETE_FLAG = FNL != undefined ? FNL.DELETE_FLAG : $scope.EmpNoteSearch.DELETE_FLAG;
            PrcCommMethods.HR_API(EmpModelObj, 'INS_UPD_EMPLOYEE_NOTES').then(function (data) {
                if (data.data == 0) {
                    $scope.$parent.ShowAlert('Error', $scope.$parent.SOMETHINGWENTWRONG, 5000);
                }
                if (data.data == 1) {
                    $scope.GET_EMPLOYEE_NOTES();
                    if (FNL == undefined) {
                        $scope.RESET_EMPLOYEE_NOTES();
                    }
                }
            });
        }
        else {
            $('#EFFECTIVE_DATA').modal('hide');
        }
    }

    $scope.DELETE_INS_UPD_EMPLOYEE_NOTES = function (FNL) {
        if (confirm("Are you sure?")) {
            var EmpModelObj = new Object();
            EmpModelObj.TABLE_ID = FNL.TABLE_ID;
            EmpModelObj.EMP_PRS_ID = $scope.EmpID;
            EmpModelObj.TITLE = "";
            EmpModelObj.NOTE = "";
            EmpModelObj.USER_ID = parseInt($cookies.get("USERID"));
            EmpModelObj.DELETE_FLAG = 1;
            PrcCommMethods.HR_API(EmpModelObj, 'INS_UPD_EMPLOYEE_NOTES').then(function (data) {
                if (data.data == 0) {
                    $scope.$parent.ShowAlert('Error', $scope.$parent.SOMETHINGWENTWRONG, 5000);
                }
                if (data.data == 1) {
                    $scope.GET_EMPLOYEE_NOTES();
                    //   $scope.RESET_EMPLOYEE_NOTES();
                }
            });
        }
        else {
            $('#EFFECTIVE_DATA').modal('hide');
        }
    }



    $scope.EDIT_NOTE_COMMENTS = function (LINE) {
        LINE.COPY_NOTE = angular.copy(LINE.NOTE);
        LINE.IS_EDIT = true;
    }
    $scope.SAVE_NOTE_COMMENTS = function (LINE) {
        $scope.INS_UPD_EMPLOYEE_NOTES(LINE);
    }
    $scope.CHECK_EVENTS = function ($event, LINE) {
        if ($event.keyCode == 27) {
            $scope.EDIT_NOTE_CANCEL(LINE);
        }
    }
    $scope.EDIT_NOTE_CANCEL = function (LINE) {
        LINE.NOTE = angular.copy(LINE.COPY_NOTE);
        LINE.IS_EDIT = false;
    }
    $scope.SET_TIME_AND_DATE = function (LINE) {
        LINE.START_COUNTDOWN = {
            minutes: 0,
            seconds: 0,
            getTimeRemaining: function (endtime) {
                var b = Date.parse(endtime) - Date.parse(new Date($scope.CURRENT_UTC_TIME));
                var t = endtime.getTime() - new Date($scope.CURRENT_UTC_TIME).getTime();
                var minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
                var seconds = Math.floor((b % (1000 * 60)) / 1000);
                return {
                    'minutes': minutes,
                    'seconds': seconds
                };
            },
            initializeClock: function (endtime) {
                function updateClock() {
                    var t = LINE.START_COUNTDOWN.getTimeRemaining(endtime);
                    LINE.START_COUNTDOWN.minutes = t.minutes;
                    LINE.START_COUNTDOWN.seconds = t.seconds;
                    if (t.seconds < 0) {
                        $interval.cancel(timeinterval);
                        LINE.IS_TIME_EDIT_FLAG = false;
                        LINE.IS_EDIT = false;
                    }
                }
                updateClock();
                var timeinterval = $interval(updateClock, 1000);
            }
        }
        var deadline = new Date(LINE.RESPONSE_END_DATE);
        LINE.START_COUNTDOWN.initializeClock(deadline);
    }
    $scope.NOTE_INIT = function (LINE) {
        var CREATED_DATE_TIME = angular.copy(LINE.CREATED_DATE);
        LINE.EDIT_NOTE = angular.copy(LINE.NOTE);
        LINE.EDIT_TITLE = angular.copy(LINE.TITLE);
        LINE.CREATED_DATE_TIME = moment(CREATED_DATE_TIME).add($scope.SETTING_MINTS, 'Minute');
        if (moment(LINE.CREATED_DATE_TIME) > moment($scope.CURRENT_UTC_TIME)) {
            LINE.IS_TIME_EDIT_FLAG = true;
            LINE.RESPONSE_END_DATE = new Date(LINE.CREATED_DATE_TIME);
            $scope.SET_TIME_AND_DATE(LINE);
        }
    }
    $scope.GO_BACK = function (FLAG) {
        //$scope.STEP_FLAG = FLAG;
        $location.path('EmpLev').search('EmpID', $scope.EmpID).search('STG', 6)
    };
    $scope.GO_BACK_TO_LIST = function (FLAG) {
        $location.path('team')
    };
    $scope.TERMINATION_DETAILS = [];
    $scope.GET_EMPLOYEE_PROFILE_HEADER = function () {
        var PosiModelObj = new Object();
        PosiModelObj.EMPLOYEE_ID = $scope.EmpID;
        PrcCommMethods.HR_API(PosiModelObj, 'GET_EMPLOYEE_PROFILE_HEADER').then(function (data) {
            $scope.$parent.EmpSearch_HEADER = data.data.Table[0];
            $scope.STEP_NO = data.data.Table1[0].STEP_NO;
            $scope.EMP_SEARCH_NAME_DTL = data.data.Table1[0];
            $scope.TERMINATION_DETAILS = data.data.Table2;
            if ($filter('lowercase')($location.absUrl()).indexOf("editempdoc") != -1 || $filter('lowercase')($location.absUrl()).indexOf("viewempdoc") != -1) {
                $scope.$parent.CalculetteService(data.data.Table[0]);
            }
        });
        $scope.IS_EDITABLE_FLAG = true;
        if ($scope.EmpID == parseInt($cookies.get("EMPLOYEE_ID"))) {
            $scope.IS_EDITABLE_FLAG = false;
            $scope.EDIT_PROFILE_CHECK_MODULE_ACCESS = $scope.CheckSubModuleAccess(4);
        }
        else {
            $scope.EDIT_PROFILE_CHECK_MODULE_ACCESS = $scope.$parent.CHECK_MODULE_ACCESS(3, 3);
        }
    };
    $scope.GET_EMPLOYEE_PROFILE_HEADER();

    $scope.TAB_CLICK = function (FLAG) {
        // $location.path('team')
        $scope.STEP_FLAG = FLAG;
        $scope.HR_GET_EMPLOYEE();
    };
    $scope.REDIRECTTOTEAM = function (FLAG) {
        window.location.href = '../DashBoard/hrIndex#!/team?stp=' + FLAG;
    };

    if ($filter('lowercase')($location.absUrl()).indexOf("viewempcomp") != -1) {

    };
    $scope.PRINT_NOTE = function () {
        const node = document.getElementById("NOTE_PDF");
        node.getElementsByClassName('mercue')[0].removeAttribute('hidden');
        angular.forEach(node.getElementsByClassName('blockquote'), function (x) {
            x.firstElementChild.style.display = 'none';
        })
        $scope.SHOW_ENT = true;
        var date = new Date();
        kendo.drawing.drawDOM($("#NOTE_PDF"))
            .then(function (group) {
                // Render the result as a PDF file
                return kendo.drawing.exportPDF(group, {
                    allPages: true,
                    paperSize: "auto",
                    margin: { left: "1cm", top: "1cm", right: "1cm", bottom: "1cm" },
                    template: $("#page-template").html(),
                });
            })
            .done(function (data) {
                // Save the PDF file
                kendo.saveAs({
                    dataURI: data,
                    fileName: "HR_NOTE_" + date.getDate() + '_' + date.getHours() + '_' + date.getMinutes() + ".pdf",
                    proxyURL: "https://demos.telerik.com/kendo-ui/service/export"
                });
                $scope.SHOW_ENT = false;
            });
        angular.forEach(node.getElementsByClassName('blockquote'), function (x) {
            x.firstElementChild.style.display = 'block';
        })
        node.getElementsByClassName('mercue')[0].setAttribute("style", "display:none")

    }

    $scope.GOTO_FY = function (FLAG) {
        $('#GO_TO').modal('hide')
        $timeout(function () {
            if (FLAG == 1) {
                $scope.$parent.VIEW_TAB_CLICK(10);
            }
            else if (FLAG == 2) {
                $scope.$parent.VIEW_TAB_CLICK(1);
            }
        }, 1000);
    };
    $scope.$parent.child_scope = $scope;
});
app.controller('ViewOthersController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.$parent.$parent.overlay_loadingNew = 'block'
    $(".tooltip").remove();
    $scope.ASSET_TYPE_OBJ = [];
    $scope.$parent.TabActive(2);
    $scope.ASSERT_EM_LIST = [];
    $scope.ASSET_TYPE_LIST = [];

    var assetobj = new Object();
    assetobj.COMPANY_ASSET_ID = 0;
    assetobj.ASSET_TYPE_ID = null;
    assetobj.ASSET_VALUE = null;
    assetobj.ISSUE_DATE = '';
    assetobj.DELETE_FLAG = 0;
    assetobj.RETURNED_DATE = null;
    $scope.ASSET_TYPE_OBJ = assetobj;
    $scope.ADD_ASSET = function () {
        $scope.ASSET_TYPE_LIST.push(angular.copy($scope.ASSET_TYPE_OBJ));
        $scope.$parent.dateinputOpenDate();
    }
    $scope.ADD_ASSET();
    $scope.ADMIN_GET_ASSET_TYPES = function () {
        var CONModelObj = new Object();
        CONModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        CONModelObj.ACTIVE = 1;
        CONModelObj.USER_ID = parseInt($cookies.get("USERID"));
        CONModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));;
        PrcCommMethods.ADMIN_API(CONModelObj, 'ADMIN_GET_ASSET_TYPES').then(function (data) {
            $scope.ASSETS_TYPE = data.data.Table;
        });
    };
    $scope.GET_HR_COMPANY_ASSETS = function () {
        var PosiModelObj = new Object();
        PosiModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        PrcCommMethods.HR_API(PosiModelObj, 'GET_HR_COMPANY_ASSETS').then(function (data) {
            $scope.COMPANY_ASSETS = data.data.Table[0];
        });
    };

    $scope.COMPANY_ASSET = function () {
        $('#Company_Assets').modal('show');
        $scope.ADMIN_GET_ASSET_TYPES();
        if ($scope.ASSERT_EM_LIST.length > 0) {
            $scope.ASSET_TYPE_LIST = angular.copy($scope.ASSERT_EM_LIST);
        }
        $scope.$parent.DateInputLoad();
        $scope.$parent.dateinputOpenDate();
    };

    $scope.EmpID = getUrlParameter('EmpID', $location.absUrl());
    $scope.EmpSearch_9 = {
    };
    $scope.ASSET_TYPE_LIST_DELETE = [];
    $scope.RemoveAssetLine = function (LINE, index) {
        if (confirm('Are you Sure?')) {
            if (LINE.COMPANY_ASSET_ID == 0 || LINE.COMPANY_ASSET_ID == undefined) {
                $scope.ASSET_TYPE_LIST.splice(index, 1);
            }
            else {
                LINE.DELETE_FLAG = 1;
                $scope.ASSET_TYPE_LIST_DELETE.push(angular.copy(LINE));
                $scope.ASSET_TYPE_LIST.splice(index, 1);
            };
        }

        $scope.NG_CHANGE_RETURN_DATE();
    };
    $scope.TERMINATION_DETAILS = [];
    $scope.GET_EMPLOYEE_PROFILE_HEADER = function () {
        var PosiModelObj = new Object();
        PosiModelObj.EMPLOYEE_ID = $scope.EmpID;
        PrcCommMethods.HR_API(PosiModelObj, 'GET_EMPLOYEE_PROFILE_HEADER').then(function (data) {
            $scope.$parent.EmpSearch_HEADER = data.data.Table[0];
            $scope.STEP_NO = data.data.Table1[0].STEP_NO;
            $scope.EMP_SEARCH_NAME_DTL = data.data.Table1[0];
            $scope.TERMINATION_DETAILS = data.data.Table2;
            $scope.$parent.CalculetteService(data.data.Table[0]);

        });

        $scope.IS_EDITABLE_FLAG = true;
        if ($scope.EmpID == parseInt($cookies.get("EMPLOYEE_ID"))) {
            $scope.IS_EDITABLE_FLAG = false;
        }
    };
    $scope.GET_EMPLOYEE_PROFILE_HEADER();

    $scope.NG_CHANGE_RETURN_DATE = function () {
        $scope.RETUNR_DATE_COUNT = 0;
        angular.forEach($scope.ASSET_TYPE_LIST, function (val) {
            val.RETURN_DATE_FLAG = 0;
            if (val.RETURNED_DATE == undefined || val.RETURNED_DATE == '' || val.RETURNED_DATE == null) { }
            else {
                if (new Date(val.ISSUE_DATE) > new Date(val.RETURNED_DATE)) {
                    val.RETURN_DATE_FLAG = 1;
                    $scope.RETUNR_DATE_COUNT++;
                }
            }
        });

    }

    $scope.HR_INS_UPD_EMP_ASSETS = function () {
        $scope.EmpDtlsForm_32.submitted = true;
        $scope.RETUNR_DATE_COUNT = 0;
        if ($scope.EmpDtlsForm_32.$valid) {
            angular.forEach($scope.ASSET_TYPE_LIST, function (val) {
                val.RETURN_DATE_FLAG = 0;
                if (val.RETURNED_DATE == undefined || val.RETURNED_DATE == '' || val.RETURNED_DATE == null) { }
                else {
                    if (new Date(val.ISSUE_DATE) > new Date(val.RETURNED_DATE)) {
                        val.RETURN_DATE_FLAG = 1;
                        $scope.RETUNR_DATE_COUNT++;
                    }
                }
            });
        }



        if ($scope.EmpDtlsForm_32.$valid && $scope.RETUNR_DATE_COUNT == 0) {
            var EmpModelObj = new Object();
            EmpModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
            EmpModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            EmpModelObj.USER_ID = parseInt($cookies.get("USERID"));
            EmpModelObj.EMP_PRS_ID = $scope.EmpID;
            $scope.ASSET_DTLS = [];
            angular.forEach($scope.ASSET_TYPE_LIST, function (val) {
                var assetobj = new Object();
                assetobj.TABLE_ID = val.COMPANY_ASSET_ID == undefined ? 0 : val.COMPANY_ASSET_ID;
                assetobj.ASSET_TYPE_ID = val.ASSET_TYPE_ID;
                assetobj.ASSET_VALUE = 0;
                assetobj.ISSUE_DATE = val.ISSUE_DATE;
                assetobj.DELETE_FLAG = val.DELETE_FLAG;
                assetobj.RETURNED_DATE = val.RETURNED_DATE == undefined || val.RETURNED_DATE == '' || val.RETURNED_DATE == null ? val.RETURNED_DATE = null : val.RETURNED_DATE;
                assetobj.NOTE = val.NOTE == undefined || val.NOTE == '' || val.NOTE == null ? val.NOTE = null : val.NOTE;
                $scope.ASSET_DTLS.push(assetobj);
            });
            if ($scope.ASSET_TYPE_LIST_DELETE.length > 0) {
                angular.forEach($scope.ASSET_TYPE_LIST_DELETE, function (val) {
                    var assetobj = new Object();
                    assetobj.TABLE_ID = val.COMPANY_ASSET_ID;
                    assetobj.ASSET_TYPE_ID = val.ASSET_TYPE_ID;
                    assetobj.ASSET_VALUE = 0;
                    assetobj.ISSUE_DATE = val.ISSUE_DATE;
                    assetobj.DELETE_FLAG = 1//val.DELETE_FLAG;
                    assetobj.RETURNED_DATE = val.RETURNED_DATE == undefined || val.RETURNED_DATE == '' || val.RETURNED_DATE == null ? val.RETURNED_DATE = null : val.RETURNED_DATE;
                    assetobj.NOTE = "";
                    $scope.ASSET_DTLS.push(assetobj);
                });
            }
            EmpModelObj.ASSET_DTLS = $scope.ASSET_DTLS;
            PrcCommMethods.HR_API(EmpModelObj, 'HR_INS_UPD_EMP_ASSETS').then(function (data) {
                if (data.data == 0) {
                    $scope.$parent.ShowAlert('Success', 'Assets Updated Successfully', 5000);
                }
                if (data.data > 0) {
                    $scope.GET_OTHER_DTL_FOR_PROFILE();
                    if ($scope.ASSERT_EM_LIST.length == 0) {
                        $scope.$parent.ShowAlert('Success', 'Assets Added Successfully', 5000);
                    }
                    else {
                        $scope.$parent.ShowAlert('Success', 'Assets Updated Successfully', 5000);
                    }
                    $('#Company_Assets').modal('hide');
                }
            });
        }
    };
    $scope.GET_OTHER_DTL_FOR_PROFILE = function () {
        var ModelObj = new Object();
        ModelObj.EMPLOYEE_ID = $scope.EmpID;
        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PrcCommMethods.HR_API(ModelObj, 'GET_OTHER_DTL_FOR_PROFILE').then(function (data) {
            $scope.$parent.$parent.overlay_loadingNew = 'none'
            $scope.EmpSearch_9 = data.data.Table[0];
            if (data.data.Table1.length > 0) {
                $scope.ASSERT_EM_LIST = data.data.Table1;
            }
        });
    };
    $scope.GET_OTHER_DTL_FOR_PROFILE();
});
app.controller('TeamListController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.RFLAG = parseInt(getUrlParameter('FLG', $location.absUrl()));
    $scope.COMMON_CODE_CHANGE();
    $scope.IN_RFLAG = 0;
    //veiw all prve
    //seeall team
    $scope.$parent.TabActive(2);
    $scope.ORG_HIERARCHY_ALL = [];
    $scope.EMPLOYEE_NO_SETTING = $scope.$parent.GET_ENTITY_SETTINGS(15)[0].SETTING_VALUE; //true then add manully
    $scope.IS_DEPARTMENT_FLAG = $scope.$parent.GET_ENTITY_SETTINGS(31)[0].SETTING_VALUE == "1" ? true : false;
    $scope.IS_POSITION_FLAG = $scope.$parent.GET_ENTITY_SETTINGS(32)[0].SETTING_VALUE == "1" ? true : false;

    $scope.TeamSearch = {
        EMPLOYEE_NO: '',
        NAME: '',
        DEPARTMENT_IDS: '',
        POSITIONS_IDS: "",
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        PAGE_NO_IN: 1,
        PAGE_NO_INVITE: 1,
        PAGE_SIZE_IN: 10,
        PAGE_SIZE_INVITE: 10,
        ACTIVE: 1,
        STATUS_IDS: 31,
        BRANCH_IDS: null,
        INCOM_BRANCH_IDS: null,
    };
    $scope.ResetEmp = function () {
        $scope.TeamSearch = {
            EMPLOYEE_NO: '',
            NAME: '',
            DEPARTMENT_IDS: '',
            POSITIONS_IDS: "",
            PAGE_NO: 1,
            PAGE_SIZE: 10,
            PAGE_NO_IN: 1,
            PAGE_SIZE_IN: 10,
            ACTIVE: 1,
            STATUS_IDS: 31,
        }
        $scope.RFLAG = 1;
        $scope.EMPLOYEE_DIRECTORY_SELECTED_LIST = [];
    };
    $scope.EMPLOYEE_DIRECTORY_LIST = [];
    $scope.HEADER_EMPT_LIST = [];

    $scope.ACTIVE_LIST = [{ NAME: "All", ID: -1, CLASS_NAME: '' },
    { NAME: "Active ", ID: 1, CLASS_NAME: '' },
    { NAME: "Inactive", ID: 0, CLASS_NAME: '' }];

    $scope.HEADER_EMPT_LIST = [{ NAME: "Employee Number", ID: 1, CLASS_NAME: 'w-8percent' },
    { NAME: "First Name ", ID: 2, CLASS_NAME: '' },
    { NAME: "Last Name", ID: 3, CLASS_NAME: '' },
    { NAME: "Department ", ID: 4, CLASS_NAME: '' },
    { NAME: "Position ", ID: 5, CLASS_NAME: '' },
    { NAME: "Branch ", ID: 7, CLASS_NAME: '' },
    { NAME: "Status ", ID: 6, CLASS_NAME: '' },
    ];
    $scope.HEADER_EMPT_INCOM_LIST = [{ NAME: "Employee Number", ID: 1, CLASS_NAME: '' },
    { NAME: "First Name ", ID: 2, CLASS_NAME: '' },
    { NAME: "Last Name", ID: 3, CLASS_NAME: '' },
    { NAME: "Department ", ID: 4, CLASS_NAME: '' },
    { NAME: "Position ", ID: 5, CLASS_NAME: '' },
    { NAME: "Branch ", ID: 7, CLASS_NAME: '' },
    ];

    $scope.HEADER_EMPT_INVT_LIST = [{ NAME: "Employee Number", ID: 1, CLASS_NAME: '' },
    { NAME: "First Name ", ID: 2, CLASS_NAME: '' },
    { NAME: "Last Name", ID: 3, CLASS_NAME: '' },
    { NAME: "Email", ID: 4, CLASS_NAME: '' },
    { NAME: "Status", ID: 5, CLASS_NAME: '' },
    { NAME: "Invitation Date ", ID: 6, CLASS_NAME: '' }];

    $scope.TEAMFILTER = [{ ID: 1, NAME: "All" }, { ID: 0, NAME: "Team" }];
    $scope.orderByField = 'EMPLOYEE_NO';
    $scope.HR_STATUS = [{ STATUS_ID: 31, STATUS_NAME: 'Invited' }, { STATUS_ID: 32, STATUS_NAME: 'Ready to hire' }, { STATUS_ID: 33, STATUS_NAME: 'Onboarded' }, { STATUS_ID: 34, STATUS_NAME: 'Cancelled' }]
    $scope.HR_GET_DEPARTMENTS = function () {
        var PosiModelObj = new Object();
        PosiModelObj.DEPARTMENT_NAME = "";
        PosiModelObj.DIVISION_NAME = "";
        PosiModelObj.PAGE_NO = 0;
        PosiModelObj.PAGE_SIZE = 1000;
        PosiModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PosiModelObj.FLAG = 1;
        PosiModelObj.SORT_COLUMN_NO = 1;
        PosiModelObj.SORT_ORDER_NO = 1;
        PrcCommMethods.HR_API(PosiModelObj, 'HR_GET_DEPARTMENTS').then(function (data) {
            $scope.HR_DEPARTMENTS = data.data.Table;
        });
    };
    $scope.HR_GET_POSITION = function () {
        var PosiModelObj = new Object();
        PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PosiModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        PosiModelObj.ACTIVE = 1;
        PosiModelObj.FLAG = 2;
        PosiModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
        PosiModelObj.ADMIN_FLAG = $scope.$parent.CheckSubModuleAccess(47) ? 1 : 3;
        PosiModelObj.SORT_COLUMN_NO = 1;
        PosiModelObj.SORT_ORDER_NO = 1
        PrcCommMethods.HR_API(PosiModelObj, 'HR_GET_POSITION_LIST').then(function (data) {
            $scope.POSITION_LIST = data.data.Table;
        });
    };
    $scope.HR_GET_DEPARTMENTS();
    $scope.HR_GET_POSITION();
    $scope.$parent.DateInputLoad();
    $scope.LAZY_LOAG_GET_EMPLOYEE_DIRECTORY = function () {
        $scope.GET_EMPLOYEE_DIRECTORY(2, $scope.SORT_COLUMN_NO, $scope.SORT_ORDER_NO_ASCDESC);
    };
    $scope.RESEND_INVITATION_ALLOW = false;
    $scope.GET_EMPLOYEE_DIRECTORY = function (FLAG, SORT_COLUMN_NO, SORT_ORDER_NO_ASCDESC) {
        if (SORT_COLUMN_NO != 0) {
            $scope.SORT_COLUMN_NO = SORT_COLUMN_NO;
            $scope.SORT_ORDER_NO_ASCDESC = SORT_ORDER_NO_ASCDESC;
            $scope.$parent.$parent.overlay_loadingNew = 'block';
            if (FLAG == 1) {
                $scope.EMPLOYEE_DIRECTORY_LIST = [];
                $scope.TeamSearch.PAGE_NO = 1;
            }
            var PosiModelObj = new Object();
            PosiModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
            PosiModelObj.EMP_PRS_ID = $scope.RFLAG == undefined || $scope.RFLAG == 0 || $scope.RFLAG == 2 ? parseInt($cookies.get("EMPLOYEE_ID")) : 0;

            if ($scope.$parent.CheckSubModuleAccess(48)) {
                PosiModelObj.FLAG = 1;
            }
            else if ($scope.RFLAG == undefined || $scope.RFLAG == 0) {
                PosiModelObj.FLAG = 0;
            }
            else {
                PosiModelObj.FLAG = 2;
            }

            PosiModelObj.FLAG == 2 ? PosiModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID")) : PosiModelObj.EMP_PRS_ID;
            // PosiModelObj.FLAG = $scope.$parent.CheckSubModuleAccess(39) == true ? 1 : $scope.RFLAG == undefined || $scope.RFLAG == 0 ? 0 : 2;// 1 FOR ALL AND 0 FOR MY TEAM 

            //FLAG= IOS me 1 and 2 ;

            //39==true flag 1 else false 2
            //Team =0

            PosiModelObj.EMPLOYEE_NO = $scope.TeamSearch.EMPLOYEE_NO;
            PosiModelObj.NAME = $scope.TeamSearch.EMPLOYEE_NAME;
            PosiModelObj.DEPARTMENT_IDS = $scope.TeamSearch.DEPARTMENT_ID;
            PosiModelObj.POSITIONS_IDS = $scope.TeamSearch.POSITION_ID;
            PosiModelObj.ACTIVE = $scope.TeamSearch.ACTIVE;
            PosiModelObj.PAGE_NO = $scope.TeamSearch.PAGE_NO;
            PosiModelObj.PAGE_SIZE = $scope.TeamSearch.PAGE_SIZE;
            PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            PosiModelObj.CURRENT_SHIFT = 0;//-- 0 FOR ALL AND 1 FOR CURRENCT SHIFT
            PosiModelObj.SORT_COLUMN_NO = SORT_COLUMN_NO;
            PosiModelObj.SORT_ORDER_NO = SORT_ORDER_NO_ASCDESC ? 1 : -1;//1 FOR ASC -1 FOR DESC
            PosiModelObj.BRANCH_IDS = $scope.TeamSearch.BRANCH_IDS;

            if (FLAG == 1) { $scope.PosiModelObj_Copy = angular.copy(PosiModelObj); }
            else {
                $scope.PosiModelObj_Copy.PAGE_NO = FLAG == undefined ? angular.copy($scope.TeamSearch.PAGE_NO) : $scope.PosiModelObj_Copy.PAGE_NO;
            }
            PrcCommMethods.HR_API(FLAG == undefined ? $scope.PosiModelObj_Copy : PosiModelObj, 'GET_EMPLOYEE_DIRECTORY').then(function (data) {
                //$scope.EMPLOYEE_DIRECTORY_LIST = data.data.Table;
                if (data.data.Table.length > 0) {
                    $scope.$parent.$parent.overlay_loadingNew = 'none';
                    $scope.EMPLOYEE_DIRECTORY_LIST = $scope.EMPLOYEE_DIRECTORY_LIST.concat(data.data.Table);
                    $scope.TeamSearch.IS_SELECTED = false;
                    var ctn = 0;
                    angular.forEach($scope.EMPLOYEE_DIRECTORY_LIST, function (XinL) {
                        var iList = $scope.EMPLOYEE_DIRECTORY_SELECTED_LIST.filter(function (x) { return XinL.ID == x.ID });
                        if (iList.length > 0) {
                            XinL.IS_SELECTED = true;
                            ctn++;
                        }
                    });
                    if (ctn == $scope.EMPLOYEE_DIRECTORY_LIST.length) {
                        $scope.TeamSearch.IS_SELECTED = true;
                    }


                    if (data.data.Table.length < $scope.TeamSearch.PAGE_SIZE) {
                        $scope.GetData = false;
                    }
                    else {
                        $scope.TeamSearch.PAGE_NO = parseInt($scope.TeamSearch.PAGE_NO) + 1;
                        $scope.GetData = true;
                    }
                }
                else {
                    if ($scope.EMPLOYEE_DIRECTORY_LIST.length == 0) {

                    }
                    $scope.GetData = false;
                    $scope.$parent.$parent.overlay_loadingNew = 'none';
                }

                $scope.$parent.CHECK_MODULE_ACCESS(3, 3) ? $scope.EDIT_ALLOW = true : $scope.EDIT_ALLOW = false;
                $scope.$parent.CHECK_MODULE_ACCESS(3, 4) ? $scope.DELETE_ALLOW = true : $scope.DELETE_ALLOW = false;
                $scope.$parent.CheckSubModuleAccess(104) ? $scope.RESEND_INVITATION_ALLOW = true : $scope.RESEND_INVITATION_ALLOW = false;///104	Resend Invitation
            });
        }
    };
    $scope.EMPLOYEE_DIRECTORY_SELECTED_LIST = [];
    $scope.INVITE_EMPLOYEE_ALL_FY = function () {
        if ($scope.TeamSearch.IS_SELECTED == false) {
            $scope.EMPLOYEE_DIRECTORY_SELECTED_LIST = [];
        }
        angular.forEach($scope.EMPLOYEE_DIRECTORY_LIST, function (value) {
            value.IS_SELECTED = $scope.TeamSearch.IS_SELECTED;
            if (value.IS_SELECTED && value.ACTIVE) {
                var iList = $scope.EMPLOYEE_DIRECTORY_SELECTED_LIST.filter(function (x) { return value.ID == x.ID; });
                if (iList.length == 0) {
                    $scope.EMPLOYEE_DIRECTORY_SELECTED_LIST.push(value);
                }
            } else {
                var iList = $scope.EMPLOYEE_DIRECTORY_SELECTED_LIST.filter(function (x) { return value.ID == x.ID; });
                if (iList.length > 0) {
                    $scope.EMPLOYEE_DIRECTORY_SELECTED_LIST.splice(iList, 1)
                }
            }
        });


    }
    $scope.INVITE_EMPLOYEE_LINE_FY = function (LINE) {
        $scope.TeamSearch.IS_SELECTED = true;
        var count = 0
        for (var i = 0; i < $scope.EMPLOYEE_DIRECTORY_LIST.length; i++) {
            var iList = $scope.EMPLOYEE_DIRECTORY_SELECTED_LIST.filter(function (x) { return $scope.EMPLOYEE_DIRECTORY_LIST[i].ID == x.ID; });
            if ($scope.EMPLOYEE_DIRECTORY_LIST[i].IS_SELECTED && $scope.EMPLOYEE_DIRECTORY_LIST[i].ACTIVE) {
                if (iList.length == 0) {
                    $scope.EMPLOYEE_DIRECTORY_SELECTED_LIST.push($scope.EMPLOYEE_DIRECTORY_LIST[i]);
                }
            }
            else {
                if (iList.length > 0) {
                    var indexofinv = $scope.EMPLOYEE_DIRECTORY_SELECTED_LIST.findIndex(x => x.ID === iList[0].ID);
                    $scope.EMPLOYEE_DIRECTORY_SELECTED_LIST.splice(indexofinv, 1);
                }
                count++;
            }
        }
        if ($scope.EMPLOYEE_DIRECTORY_SELECTED_LIST.length != $scope.EMPLOYEE_DIRECTORY_LIST.filter(function (x) { return x.ACTIVE == true }).length) {
            $scope.TeamSearch.IS_SELECTED = false;
        }
        $scope.COMMON_CODE_CHANGE();
    }
    $scope.RESEND_HR_INVITE = function () {
        if ($scope.EMPLOYEE_DIRECTORY_SELECTED_LIST.length == 0) {
            $scope.$parent.ShowAlert('Error', "Please select atleast one employee", 5000);
        }
        else {
            var PosiModelObj = new Object();
            PosiModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PosiModelObj.TABLE_ID_LIST = [];
            angular.forEach($scope.EMPLOYEE_DIRECTORY_SELECTED_LIST, function (x) {
                if (x.IS_SELECTED) {
                    var readonly = new Object();
                    readonly.TABLE_ID = x.ID;
                    PosiModelObj.TABLE_ID_LIST.push(readonly);
                }
            });
            PrcCommMethods.HR_API(PosiModelObj, 'RESEND_HR_INVITE').then(function (data) {
                if (data.data == 0) {
                    $scope.$parent.ShowAlert('Error', $scope.SOMETHINGWENTWRONG, 5000);
                }
                if (data.data == 1) {
                    $scope.$parent.ShowAlert('Success', 'Invitation Resent Successfully', 3000);
                    $scope.TeamSearch.IS_SELECTED = false;
                    angular.forEach($scope.EMPLOYEE_DIRECTORY_LIST, function (x) {
                        x.IS_SELECTED = false;
                    });
                    $scope.EMPLOYEE_DIRECTORY_SELECTED_LIST = [];
                }
            });
        }
    }
    $scope.GetDataInc = false;
    $scope.GetDataInvit = false;
    $scope.ON_BOARD_POP = function (EMP) {
        $('#ON_BOARD_POP').modal('show');
        $scope.SELECTED_EMP = angular.copy(EMP);
        $scope.CustomForm.submitted = false;
    };
    $scope.HR_ONBOARD_EMPLOYEE_FROM_INVITATION = function () {
        $scope.CustomForm.submitted = true;
        if ($scope.CustomForm.$valid) {
            var PosiModelObj = new Object();
            $scope.$parent.overlay_loadingNew = 'block';
            PosiModelObj.TABLE_ID = $scope.SELECTED_EMP.TABLE_ID;
            PosiModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PosiModelObj.COMMENTS = $scope.SELECTED_EMP.COMMENTS;
            PosiModelObj.EMPLOYEE_NO = $scope.SELECTED_EMP.EMPLOYEE_NO;
            PrcCommMethods.HR_API(PosiModelObj, 'HR_ONBOARD_EMPLOYEE_FROM_INVITATION').then(function (data) {
                $scope.$parent.overlay_loadingNew = 'none';
                if (data.data == null) {
                    $scope.$parent.ShowAlert('Error', $scope.SOMETHINGWENTWRONG, 5000);
                }
                if (data.data.PO_SUCCESS == -1) {
                    $scope.$parent.ShowAlert('Warning', 'Employee no already registered', 5000);
                }
                if (data.data.PO_SUCCESS == 1) {
                    $('#ON_BOARD_POP').modal('hide');
                    $scope.$parent.ShowAlert('Success', $scope.SELECTED_EMP.FIRST_NAME + ' ' + ($scope.SELECTED_EMP.LAST_NAME == undefined || $scope.SELECTED_EMP.LAST_NAME == null || $scope.SELECTED_EMP.LAST_NAME == '' ? '' : $scope.SELECTED_EMP.LAST_NAME) + ' Onboard Successfully', 5000);
                    window.location.href = '../DashBoard/hrIndex#!/Addemployee?x=1&EmpID=' + data.data.dataset.Table[0].EMP_PRS_ID;
                }
                $scope.CustomForm.submitted = false;
            });
        }
    };
    $scope.LAZY_LOAG_GET_INCOM_EMPLOYEE_DIRECTORY = function () {
        $scope.GET_INCOM_EMPLOYEE_DIRECTORY(2, $scope.SORT_COLUMN_NO_INCOM, $scope.SORT_ORDER_NO_ASCDESC_INCOM);
    };
    $scope.GET_INCOM_EMPLOYEE_DIRECTORY = function (FLAG, SORT_COLUMN_NO, SORT_ORDER_NO_ASCDESC) {
        if (SORT_COLUMN_NO == undefined) {
            SORT_COLUMN_NO = 1;
            SORT_ORDER_NO_ASCDESC = 1;
        }
        if (SORT_COLUMN_NO != 0) {
            $scope.SORT_COLUMN_NO_INCOM = SORT_COLUMN_NO;
            $scope.SORT_ORDER_NO_ASCDESC_INCOM = SORT_ORDER_NO_ASCDESC;
            $scope.$parent.$parent.overlay_loadingNew = 'block';

            if (FLAG == 1) {
                $scope.INCOM_EMPLOYEE_DIRECTORY_LIST = [];
                $scope.TeamSearch.PAGE_NO_IN = 1;
            }
            var PosiModelObj = new Object();
            PosiModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
            //PosiModelObj.FLAG = $scope.IN_RFLAG == undefined ? 0 : $scope.IN_RFLAG;// 1 FOR ALL AND 0 FOR MY TEAM
            PosiModelObj.EMPLOYEE_NO = $scope.TeamSearch.EMPLOYEE_NO_IN;
            PosiModelObj.NAME = $scope.TeamSearch.EMPLOYEE_NAME_IN;
            PosiModelObj.DEPARTMENT_IDS = $scope.TeamSearch.DEPARTMENT_ID_IN;
            PosiModelObj.POSITIONS_IDS = $scope.TeamSearch.POSITION_ID_IN;
            PosiModelObj.ACTIVE = -1;
            PosiModelObj.PAGE_NO = $scope.TeamSearch.PAGE_NO_IN;
            PosiModelObj.PAGE_SIZE = $scope.TeamSearch.PAGE_SIZE_IN;
            PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            PosiModelObj.SORT_COLUMN_NO = SORT_COLUMN_NO;
            PosiModelObj.SORT_ORDER_NO = SORT_ORDER_NO_ASCDESC ? 1 : -1;//1 FOR ASC -1 FOR DESC
            PosiModelObj.BRANCH_IDS = $scope.TeamSearch.INCOM_BRANCH_IDS;
            if ($scope.$parent.CheckSubModuleAccess(48) == true) {
                PosiModelObj.FLAG = 1;
            }
            else if ($scope.IN_RFLAG == undefined || $scope.IN_RFLAG == 0) {
                PosiModelObj.FLAG = 0;
            }
            else {
                PosiModelObj.FLAG = 2;
            }
            PosiModelObj.FLAG == 2 ? PosiModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID")) : PosiModelObj.EMP_PRS_ID;
            if (FLAG == 1) { $scope.POSModelObj_INCOM_Copy = angular.copy(PosiModelObj); }
            else {
                $scope.POSModelObj_INCOM_Copy.PAGE_NO_IN = FLAG == undefined ? angular.copy($scope.TeamSearch.PAGE_NO_IN) : $scope.POSModelObj_INCOM_Copy.PAGE_NO_IN;
            }
            PrcCommMethods.HR_API(FLAG == undefined ? $scope.POSModelObj_INCOM_Copy : PosiModelObj, 'GET_EMPLOYEE_DIRECTORY_INCOMPLETE').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.INCOM_EMPLOYEE_DIRECTORY_LIST = $scope.INCOM_EMPLOYEE_DIRECTORY_LIST.concat(data.data.Table);
                    $scope.$parent.$parent.overlay_loadingNew = 'none';
                    if (data.data.Table.length < $scope.TeamSearch.PAGE_SIZE_IN) {
                        $scope.GetDataInc = false;
                    }
                    else {
                        $scope.TeamSearch.PAGE_NO_IN = parseInt($scope.TeamSearch.PAGE_NO_IN) + 1;
                        $scope.GetDataInc = true;
                    }
                }
                else {
                    if ($scope.INCOM_EMPLOYEE_DIRECTORY_LIST.length == 0) {
                    }
                    $scope.GetDataInc = false;
                    $scope.$parent.$parent.overlay_loadingNew = 'none';
                }
                $scope.$parent.CHECK_MODULE_ACCESS(3, 3) ? $scope.EDIT_INCOM_ALLOW = true : $scope.EDIT_ALLOW = false;
                $scope.$parent.CHECK_MODULE_ACCESS(3, 4) ? $scope.DELETE_INCOM_ALLOW = true : $scope.DELETE_ALLOW = false;
            });
        }
    };
    $scope.ResetInviEmp = function () {
        $scope.TeamSearch.FIRST_NAME_INVITE = '';
        $scope.TeamSearch.LAST_NAME_INVITE = '';
        $scope.TeamSearch.PERSONAL_EMAIL_INVITE = '';
        $scope.TeamSearch.STATUS_IDS = 31;
        $scope.HR_GET_EMPLOYEE_INVITATION_LIST(1, 1, false);

    }
    $scope.LAZY_LOAG_HR_GET_EMPLOYEE_INVITATION_LIST = function () {
        $scope.HR_GET_EMPLOYEE_INVITATION_LIST(2, $scope.SORT_COLUMN_NO_INVT, $scope.SORT_ORDER_NO_ASCDESC_INVT);
    };
    $scope.HR_DEL_EMPLOYEE_INVITATION = function (EMP) {
        if (confirm('Are you sure?')) {
            var EmpModelObj = new Object();
            EmpModelObj.TABLE_ID = EMP.TABLE_ID;
            EmpModelObj.COMMENTS = EMP.COMMENTS;
            EmpModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.HR_API(EmpModelObj, 'HR_DEL_EMPLOYEE_INVITATION').then(function (data) {
                if (data.data == 1) {
                    $scope.ShowAlert('Success', 'Deleted Successfully', 5000);
                    $scope.HR_GET_EMPLOYEE_INVITATION_LIST(1, $scope.SORT_COLUMN_NO_INVT, $scope.SORT_ORDER_NO_ASCDESC_INVT);
                }
            });
        }
    };
    $scope.HR_GET_EMPLOYEE_INVITATION_LIST = function (FLAG, SORT_COLUMN_NO, SORT_ORDER_NO_ASCDESC) {
        if (SORT_COLUMN_NO == undefined) {
            SORT_COLUMN_NO = 1;
            SORT_ORDER_NO_ASCDESC = 1;
        }
        if (SORT_COLUMN_NO != 0) {
            $scope.SORT_COLUMN_NO_INVT = SORT_COLUMN_NO;
            $scope.SORT_ORDER_NO_ASCDESC_INVT = SORT_ORDER_NO_ASCDESC;

            $scope.$parent.$parent.overlay_loadingNew = 'block';
            if (FLAG == 1) {
                $scope.EMPLOYEE_INVITATION_LIST = [];
                $scope.TeamSearch.PAGE_NO_INVITE = 1;
            }
            var PosiModelObj = new Object();
            //PosiModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
            //PosiModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
            PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            PosiModelObj.FIRST_NAME = $scope.TeamSearch.FIRST_NAME_INVITE;
            PosiModelObj.LAST_NAME = $scope.TeamSearch.LAST_NAME_INVITE;
            PosiModelObj.PERSONAL_EMAIL = $scope.TeamSearch.PERSONAL_EMAIL_INVITE;
            PosiModelObj.STATUS_IDS = $scope.TeamSearch.STATUS_IDS;
            PosiModelObj.ACTIVE = -1;
            PosiModelObj.PAGE_NO = $scope.TeamSearch.PAGE_NO_INVITE;
            PosiModelObj.PAGE_SIZE = $scope.TeamSearch.PAGE_SIZE_INVITE;
            PosiModelObj.SORT_COLUMN_NO = SORT_COLUMN_NO;
            PosiModelObj.SORT_ORDER_NO = SORT_ORDER_NO_ASCDESC ? 1 : -1;//1 FOR ASC -1 FOR DESC
            //if (FLAG == undefined) { $scope.POSModelObj_INCOM_Copy = angular.copy(PosiModelObj); }
            //else
            //{
            //    $scope.POSModelObj_INCOM_Copy.PAGE_NO_IN = FLAG == 1 ? angular.copy($scope.TeamSearch.PAGE_NO_IN) : $scope.POSModelObj_INCOM_Copy.PAGE_NO_IN;
            //}
            //PrcCommMethods.HR_API(FLAG == 1 ? $scope.POSModelObj_INCOM_Copy : PosiModelObj, 'GET_EMPLOYEE_DIRECTORY_INCOMPLETE').then(function (data) {
            //if (FLAG == undefined) { $scope.PosiModelObj_Copy = angular.copy(PosiModelObj); }
            //else
            //{
            //    $scope.PosiModelObj_Copy.PAGE_NO = FLAG == 1 ? angular.copy($scope.TeamSearch.PAGE_NO) : $scope.PosiModelObj_Copy.PAGE_NO;
            //}

            if (FLAG == 1) {
                $scope.POSModelObj_INVITE_Copy = angular.copy(PosiModelObj);
            }
            else {
                $scope.POSModelObj_INVITE_Copy.PAGE_NO = FLAG == undefined ? angular.copy($scope.TeamSearch.PAGE_NO_INVITE) : $scope.POSModelObj_INVITE_Copy.PAGE_NO;
            }
            //PrcCommMethods.HR_API(FLAG == 1 ? $scope.PosiModelObj_Copy : PosiModelObj, 'GET_EMPLOYEE_DIRECTORY').then(function (data) {
            PrcCommMethods.HR_API(FLAG == undefined ? $scope.POSModelObj_INVITE_Copy : PosiModelObj, 'HR_GET_EMPLOYEE_INVITATION_LIST').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.EMPLOYEE_INVITATION_LIST = $scope.EMPLOYEE_INVITATION_LIST.concat(data.data.Table);
                    $scope.$parent.$parent.overlay_loadingNew = 'none';
                    if (data.data.Table.length < $scope.TeamSearch.PAGE_SIZE_INVITE) {
                        $scope.GetDataInvit = false;
                    }
                    else {
                        $scope.TeamSearch.PAGE_NO_INVITE = parseInt($scope.TeamSearch.PAGE_NO_INVITE) + 1;
                        $scope.GetDataInvit = true;
                    }
                }
                else {
                    if ($scope.EMPLOYEE_INVITATION_LIST.length == 0) {
                    }
                    $scope.GetDataInvit = false;
                    $scope.$parent.$parent.overlay_loadingNew = 'none';
                }

                $scope.$parent.CHECK_MODULE_ACCESS(45, 3) ? $scope.EDIT_INVIT_ALLOW = true : $scope.EDIT_INVIT_ALLOW = false;
                $scope.$parent.CHECK_MODULE_ACCESS(45, 4) ? $scope.DELETE_INVIT_ALLOW = true : $scope.DELETE_INVIT_ALLOW = false;
            });
        }
    };
    $scope.ResetInEmp = function () {
        $scope.TeamSearch.POSITION_ID_IN = null;
        $scope.TeamSearch.DEPARTMENT_ID_IN = null;
        $scope.TeamSearch.EMPLOYEE_NO_IN = null;
        $scope.TeamSearch.EMPLOYEE_NAME_IN = null;
        $scope.TeamSearch.PAGE_NO_IN = 1;
        $scope.TeamSearch.PAGE_SIZE_IN = 10;

        $scope.RFLAG = 1;
    };

    if (isNaN($scope.RFLAG)) {
        $scope.STEP_FLAG = 1;
        $scope.RFLAG = 1;
    }
    else {
        if ($scope.RFLAG == 2) {
            $scope.RFLAG = 1;
            $scope.STEP_FLAG = 3;
            $scope.GET_INCOM_EMPLOYEE_DIRECTORY(1, $scope.SORT_COLUMN_NO_INCOM, $scope.SORT_ORDER_NO_ASCDESC_INCOM);
        }
        else if ($scope.RFLAG == 4) {
            $scope.RFLAG = 2;
            $scope.STEP_FLAG = 4;
            $scope.HR_GET_EMPLOYEE_INVITATION_LIST(1, $scope.SORT_COLUMN_NO_INVT, $scope.SORT_ORDER_NO_ASCDESC_INVT);
        }
        else {
            $scope.STEP_FLAG = 2;
        }
    };
    $scope.TAB_DIRECTORY = false;
    $scope.TAB_INVT_DIRECTORY = false;
    if ($scope.$parent.CHECK_MODULE_ACCESS(3, 1)) {
        $scope.TAB_DIRECTORY = true;
        $scope.GET_EMPLOYEE_DIRECTORY(1, 1, false);
        $scope.STEP_FLAG = 2;
    }
    else if ($scope.$parent.CHECK_MODULE_ACCESS(45, 1)) {
        $scope.TAB_INVT_DIRECTORY = true;
        $scope.HR_GET_EMPLOYEE_INVITATION_LIST(1, 1, false);
        $scope.STEP_FLAG = 3;
    }
    else {
        $scope.STEP_FLAG = 1;
        $scope.RFLAG = 1;
    }
    $scope.TERMINATION_REASONS_LIST = [];
    $scope.REPLACEMENT_REPORTING_MANAGER_LIST = [];
    $scope.GET_TERMINATION_REASONS = function () {
        var TerModelObj = new Object();
        TerModelObj.ACTIVE = 1;
        TerModelObj.CUSTOMER_ID_TREMINATION = parseInt($cookies.get("CUSTOMER_ID"));
        TerModelObj.PAGE_NO = 0;
        PrcCommMethods.ADMIN_API(TerModelObj, 'ADMIN_GET_TERMINATION_REASONS').then(function (data) {
            $scope.TERMINATION_REASONS_LIST = data.data.Table;
        });
    };
    $scope.TerminateSearch = {
        EMP_PRS_ID: null,
        TERMINATION_REASONS_ID: null,
        TERMINATION_DATE: '',
        TERMINATION_COMMENTS: '',
    };
    $scope.RESET_TER = function () {
        $scope.TerminateSearch = {
            EMP_PRS_ID: null,
            TERMINATION_REASONS_ID: null,
            TERMINATION_DATE: '',
            TERMINATION_COMMENTS: '',
        }
        $scope.TermiForm.submitted = false;

    };
    $scope.GET_REPLACEMENT_REPORTING_MANAGER_LIST = function (EMP) {
        var GetAll = new Object();
        GetAll.EMP_PRS_ID = EMP.ID;
        PrcCommMethods.HR_API(GetAll, 'GET_REPLACEMENT_REPORTING_MANAGER_LIST').then(function (data) {
            $scope.REPLACEMENT_REPORTING_MANAGER_LIST = data.data.Table;
        });
    };
    $scope.TERM_REPORTING_EMPLOYEE_LIST = [];
    $scope.GET_REPORTING_EMPLOYEE_LIST = function (EMP) {
        var GetAll = new Object();
        GetAll.REPORTING_MANAGER_ID = EMP.ID;
        //GetAll.ADMIN_FLAG = 0 // only for termination employee
        //GetAll.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PrcCommMethods.HR_API(GetAll, 'GET_REPORTING_EMPLOYEE_LIST_FOR_TERMINATION').then(function (data) {
            $scope.TERM_REPORTING_EMPLOYEE_LIST = data.data.Table;
            if (data.data.Table.length > 0) {
                $scope.GET_REPLACEMENT_REPORTING_MANAGER_LIST(EMP)
            }
        });
    };
    $scope.HR_DELETE_EMPLOYEE_POP = function (EMP) {
        $scope.RESET_TER();
        $scope.TerminateSearch.EMP_PRS_ID = EMP.ID;
        $scope.EMP_DTSL = EMP;
        $('#ProfileInActive').modal('show');
        $scope.GET_TERMINATION_REASONS();
        $scope.GET_REPORTING_EMPLOYEE_LIST(EMP);
        $scope.$parent.dateinputOpenDate();
    };
    $scope.HR_DELETE_EMPLOYEE_COMP = function (EMP) {
        $scope.TermiForm.submitted = true;
        if ($scope.TermiForm.$valid) {
            if (confirm('Are you sure you want to mark this employee as a leaver?')) {
                var TrmModelObj = new Object();
                TrmModelObj.EMP_PRS_ID = $scope.TerminateSearch.EMP_PRS_ID;
                TrmModelObj.USER_ID = parseInt($cookies.get("USERID"));
                TrmModelObj.TERMINATION_DATE = $scope.TerminateSearch.TERMINATION_DATE;
                TrmModelObj.TERMINATION_REASONS_ID = $scope.TerminateSearch.TERMINATION_REASONS_ID;
                TrmModelObj.EMP_PRS_TERMIANTED_BY_ID = parseInt($cookies.get("EMPLOYEE_ID"));;
                TrmModelObj.TERMINATION_COMMENTS = $scope.TerminateSearch.TERMINATION_COMMENTS;
                TrmModelObj.MANAGER_REPLACEMENT_TYPE = [];
                if ($scope.TERM_REPORTING_EMPLOYEE_LIST.length > 0) {
                    angular.forEach($scope.TERM_REPORTING_EMPLOYEE_LIST, function (val) {
                        var Mang = new Object();
                        Mang.EMP_EMENT_ID = val.EMP_EMENT_ID;
                        Mang.EMP_PRS_ID = val.EMP_PRS_ID;
                        Mang.REPORTING_MANAGER_ID = val.REPORTING_MANAGER == 1 ? $scope.TerminateSearch.REPORTING_MANAGER_IDS : null;
                        Mang.SECONDARY_REPORTING_MANAGER_ID_1 = val.SECONDARY_REPORTING_MANAGER_1 == 1 ? $scope.TerminateSearch.REPORTING_MANAGER_IDS : null;
                        Mang.SECONDARY_REPORTING_MANAGER_ID_2 = val.SECONDARY_REPORTING_MANAGER_2 == 1 ? $scope.TerminateSearch.REPORTING_MANAGER_IDS : null;
                        TrmModelObj.MANAGER_REPLACEMENT_TYPE.push(Mang);
                    });
                }
                else {
                    var Mang = new Object();
                    Mang.EMP_EMENT_ID = null;
                    Mang.EMP_PRS_ID = null;
                    Mang.REPORTING_MANAGER_ID = null;
                    Mang.SECONDARY_REPORTING_MANAGER_ID_1 = null;
                    Mang.SECONDARY_REPORTING_MANAGER_ID_2 = null;
                    TrmModelObj.MANAGER_REPLACEMENT_TYPE.push(Mang);
                }
                TrmModelObj.STEP_NO = EMP.STEP_NO;
                TrmModelObj.PAY_HOLIDAY = $scope.TerminateSearch.PAY_HOLIDAY ? 1 : 0;
                PrcCommMethods.HR_API(TrmModelObj, 'HR_DELETE_EMPLOYEE').then(function (data) {
                    $scope.$parent.ShowAlert('Success', 'Employee Terminated Successfully', 3000);
                    //$scope.RESET_TER();
                    $('#ProfileInActive').modal('hide');
                    $scope.GET_EMPLOYEE_DIRECTORY(1, $scope.SORT_COLUMN_NO, $scope.SORT_ORDER_NO_ASCDESC);

                });
            }
        }
    };
    $scope.HR_DELETE_EMPLOYEE = function (EMP) {
        if (confirm('Are you Sure?')) {
            var TrmModelObj = new Object();
            TrmModelObj.EMP_PRS_ID = EMP.ID;
            TrmModelObj.USER_ID = parseInt($cookies.get("USERID"));
            TrmModelObj.TERMINATION_DATE = null;
            TrmModelObj.TERMINATION_REASONS_ID = null;
            TrmModelObj.TERMINATION_COMMENTS = 'IncompleteProfile';
            TrmModelObj.MANAGER_REPLACEMENT_TYPE = [];

            var Mang = new Object();
            Mang.EMP_EMENT_ID = 0;
            Mang.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
            Mang.REPORTING_MANAGER_ID = "";
            Mang.REPORTING_MANAGER_ID = null;
            Mang.SECONDARY_REPORTING_MANAGER_ID_1 = null;
            Mang.SECONDARY_REPORTING_MANAGER_ID_2 = null;
            TrmModelObj.MANAGER_REPLACEMENT_TYPE.push(Mang);
            TrmModelObj.STEP_NO = EMP.STEP_NO;
            TrmModelObj.PAY_HOLIDAY = 0;
            PrcCommMethods.HR_API(TrmModelObj, 'HR_DELETE_EMPLOYEE').then(function (data) {
                if (data.data == 1) {
                    $scope.$parent.ShowAlert('Success', 'Employee Deleted Successfully', 3000);
                    $scope.ResetEmp();
                    $scope.GET_INCOM_EMPLOYEE_DIRECTORY(1, $scope.SORT_COLUMN_NO_INCOM, $scope.SORT_ORDER_NO_ASCDESC_INCOM);
                }
                if (data.data == 0) {
                    $scope.$parent.ShowAlert('Error', $scope.SOMETHINGWENTWRONG, 5000);
                }
            });
        }
    };
    $scope.HR_DELETE_EMPLOYEE_INCOM = function () {


    }

    $scope.ADMIN_GET_BRANCH = function () {
        ModelObj = new Object();
        ModelObj.CUSTOMER_ID = parseInt($cookies.get('CUSTOMER_ID'));
        ModelObj.ENTITY_ID = parseInt($cookies.get('ENTITY_ID'));
        ModelObj.BRANCH_CODE = null;
        ModelObj.BRANCH_NAME = null;
        ModelObj.CONTACT_NAME = null;
        ModelObj.LOCATION_IDS = null;
        ModelObj.ACTIVE = 1;
        ModelObj.PAGE_NO = 0;
        ModelObj.PAGE_SIZE = 0;
        ModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.ADMIN_API(ModelObj, 'ADMIN_GET_BRANCH').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.DIRT_BRANCH_LIST = data.data.Table;
                $scope.INCOM_BRANCH_LIST = data.data.Table;
            }
        });
    }
    $scope.ADMIN_GET_BRANCH();

    $scope.TAB_CLICK = function (FLAG) {
        $scope.STEP_FLAG = FLAG;
        if (FLAG == 1) {
            //if ($scope.ORG_HIERARCHY_ALL.length == 0) { 
            $scope.HR_GET_ORG_HIERARCHY();
            //}
        }
    };
    //$scope.nginitemployeedrt = function (EML, index) {
    //    if (index == 0) {

    //    }
    //}
    function preview() {
        OrgChart.pdfPrevUI.show(chart, {
            format: 'A4'
        });
    };

    function nodePdfPreview(nodeId) {
        OrgChart.pdfPrevUI.show(chart, {
            format: 'A4',
            nodeId: nodeId
        });
    };

    function addSharholder(nodeId) {
        chart.addNode({ id: OrgChart.randomId(), pid: nodeId, tags: ["menu-without-add"] });
    };

    function addAssistant(nodeId) {
        var node = chart.getNode(nodeId);
        var data = { id: OrgChart.randomId(), pid: node.stParent.id, tags: ["assistant"] };
        chart.addNode(data);
    };


    function addDepartment(nodeId) {
        var node = chart.getNode(nodeId);
        var data = { id: OrgChart.randomId(), pid: node.stParent.id, tags: ["department"] };
        chart.addNode(data);
    };

    function addManager(nodeId) {
        chart.addNode({ id: OrgChart.randomId(), stpid: nodeId });
    };
    function searchFields() {
        chart.search(value, searchInFileds, retrieveFields);
    };
    function iterate(c, n) {
        if (Array.isArray(n)) {
            for (var i = 0; i < n.length; i++) {
                iterate(c, n[i])
            }
            return;
        }

        console.log(n.id);

        for (var i = 0; i < n.stChildren.length; i++) {
            iterate(c, n.stChildren[i])
        }

        for (var i = 0; i < n.children.length; i++) {
            iterate(c, n.children[i])
        }
    };
    $scope.HR_GET_ORG_HIERARCHY = function () {
        $scope.$parent.$parent.overlay_loadingNew = 'block';
        var PosiModelObj = new Object();
        PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PrcCommMethods.HR_API(PosiModelObj, 'HR_GET_ORG_HIERARCHY').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.$parent.$parent.overlay_loadingNew = 'none';
                var ORGLIST = [];
                var ORG_HIERARCHY_ALL = [];
                $scope.ORG_HIERARCHY_ALL = angular.copy(data.data.Table);
                $scope.ORG_HIERARCHY = data.data.Table.filter(function (x) { return x.PID == null });
                angular.forEach($scope.ORG_HIERARCHY_ALL, function (val, index) {
                    var obh = new Object()
                    obh.id = val.ID;
                    if (val.PID == null) {
                    }
                    else {
                        obh.pid = val.PID;
                    }
                    if (val.IMG == null) {
                        obh.img = "https://png.pngitem.com/pimgs/s/80-801053_aws-simple-icons-non-service-specific-user-default.png";//val.IMG;
                    }
                    else {
                        obh.img = window.location.origin + '/' + val.IMG;
                    }
                    obh.Name = val.NAME;
                    obh.Department = val.DEPARTMENT_NAME;
                    obh.Email = val.BUSINESS_EMAIL;
                    obh.Position = val.POSITION_TITLE;
                    obh.Phone = val.MOBILE_NO;
                    obh.Telephone = val.TELEPHONE_NO;
                    //obh.color = val.DEPARTMENT_COLOR;
                    ORGLIST.push(obh);
                });
                //angular.forEach($scope.ORG_HIERARCHY, function (val, index) {
                //    var obh = new Object()
                //    obh.id = val.ID;
                //    obh.Name = val.NAME;
                //    obh.Department = val.DEPARTMENT_NAME;
                //    obh.Email = val.BUSINESS_EMAIL;
                //    obh.Position = val.POSITION_TITLE;
                //    obh.Phone = val.MOBILE_NO;
                //    obh.Telephone = val.TELEPHONE_NO;
                //    if (val.IMG == null) {
                //        obh.img = "https://png.pngitem.com/pimgs/s/80-801053_aws-simple-icons-non-service-specific-user-default.png";//val.IMG;
                //    }
                //    else {
                //        obh.img = window.location.origin + '/' + val.IMG;
                //    }
                //    obh.c = val.DEPARTMENT_COLOR;
                //    ORGLIST.push(obh);
                //    var PLIST = $scope.ORG_HIERARCHY_ALL.filter(function (x) { return x.PID == val.ID })
                //    if (PLIST.length > 0) {
                //        angular.forEach(PLIST, function (plist) {
                //            var obh = new Object()
                //            obh.id = plist.ID;
                //            obh.pid = plist.PID;
                //            obh.Name = plist.NAME;
                //            obh.Department = plist.DEPARTMENT_NAME;
                //            obh.Email = plist.BUSINESS_EMAIL;
                //            obh.Position = plist.POSITION_TITLE;
                //            obh.Phone = plist.MOBILE_NO;
                //            obh.Telephone = plist.TELEPHONE_NO;
                //            if (plist.IMG == null) {
                //                obh.img = "https://png.pngitem.com/pimgs/s/80-801053_aws-simple-icons-non-service-specific-user-default.png";//val.IMG;
                //            }
                //            else {
                //                obh.img = window.location.origin + '/' + plist.IMG;
                //            }
                //            obh.c = val.DEPARTMENT_COLOR;
                //            ORGLIST.push(obh);
                //        })
                //    }
                //})
                OrgChart.templates.ana.size = [250, 250];
                OrgChart.templates.ana.node = '<rect x="0" y="0" rx="4" ry="5" filter="url(#shadow1)" style="font-size: 12px;"  height="250" width="250" fill="#f3f8fb" stroke-width="0" stroke="#2e6491"></rect>' +
                    '<rect x="0" y="0" rx="5" ry="5" height="36" width="250" fill="#004B6D" stroke-width="1" stroke="#2e6491"></rect>'
                //'<line x1="9.5" y1="32" x2="190.5" y2="32" stroke-width="10" stroke="#004B6D" />'
                OrgChart.templates.ana.field_Department = ' <text   width="140" style="font-size: 12px;" fill="#fff" x="130" y="20" text-anchor="middle">{val}</text> ';
                OrgChart.templates.ana.img_0 = '<clipPath id="{randId}"><circle cx="130" cy="100" r="40"></circle></clipPath><image preserveAspectRatio="xMidYMid slice" clip-path="url(#{randId})" xlink:href="{val}" x="90" y="60"  width="80" height="105"></image>';
                OrgChart.templates.ana.field_Name = '<text width="200" data-width="200" data-text-overflow="ellipsis" style="font-size: 13px;font-weight: bold;" fill="#004B6D" x="135" y="155" text-anchor="middle">{val}</text>';
                OrgChart.templates.ana.field_Position = '<text width="140" style="font-size: 11px;" fill="#004B6D" x="135" y="180" text-anchor="middle">{val}</text>';
                OrgChart.templates.ana.field_Email = '<text width="140" style="font-size: 11px;" fill="#004B6D" x="135" y="200" text-anchor="middle">{val}</text>';
                OrgChart.templates.ana.field_Phone = '<text width="140" style="font-size: 11px;" fill="#004B6D" x="135" y="225" text-anchor="middle">{val}</text>';
                //OrgChart.SEARCH_PLACEHOLDER = "Chercher";
                //OrgChart.templates.ana.field_Telephone = '<text width="140" style="font-size: 11px;" fill="#004B6D" x="100" y="225" text-anchor="middle">{val}</text>';
                var chart = new OrgChart(document.getElementById("tree"), {
                    collapsed: false,
                    mouseScrool: OrgChart.action.scroll,
                    template: "ana",
                    sticky: false,
                    enableDragDrop: false,
                    layout: OrgChart.tree,
                    levelSeparation: 200,
                    siblingSeparation: 150,
                    subtreeSeparation: 150,
                    assistantSeparation: 170,
                    searchDisplayField: "nema",
                    editForm: { readOnly: true },
                    //roots: [2, 4],
                    //menu: {
                    //    pdfPreview: {
                    //        text: "Export to PDF",
                    //        icon: OrgChart.icon.pdf(24, 24, '#7A7A7A'),
                    //        onClick: preview
                    //    },
                    //    csv: { text: "Save as CSV" }
                    //},
                    //nodeMenu: {
                    //    details: { text: "Details" },
                    //    edit: { text: "Edit" },
                    //    add: { text: "Add" },
                    //    remove: { text: "Remove" }
                    //},
                    align: OrgChart.ORIENTATION,
                    toolbar: {
                        fullScreen: true,
                        zoom: true,
                        fit: true,
                        expandAll: true
                    },
                    nodeBinding: {
                        img_0: "img",
                        field_Name: "Name",
                        field_Department: "Department",
                        field_Position: "Position",
                        field_Email: "Email",
                        field_Phone: "Phone",
                        field_Telephone: "Telephone",
                    },
                    //  nodes: ORGLIST
                });

                //chart.on('label', function (sender, args) {
                //    // your code goes here  
                //    // return false; to hide the label
                //    alert()
                //})
                //chart.search('c', ['Nema Deniel', 'Network Eng.'], ['Nema Deniel'])

                //OrgChart.events.on('layout', function (args) {
                //    alert('c')
                //    if (args.pnode.id == 100) {
                //        args.layout = OrgChart.treeLeftOffset;
                //    }
                //});

                chart.on('searchclick', function (sender, nodeId) {

                });

                //chart.on('init', function (sender) {
                //    iterate(sender, sender.roots)

                //});
                chart.editUI.on('field', function (sender, args) {
                    // alert()

                    // your code goes here 
                    // return false; to cancel the operation
                });



                //chart.on('redraw', function (sender, nodeId) {


                //    // your code goes here 
                //    // return false; to cancel the operation

                //});
                chart.load(ORGLIST);
            }
            else {
                $scope.$parent.$parent.overlay_loadingNew = 'none';
            }
        });
    };
    $scope.HR_GET_ORG_HIERARCHY();

    $scope.RedirectiononEmp = function (EMP) {
        if (EMP.STEP_NO == 1) {
            window.location.href = '../DashBoard/hrIndex#!/Addemployee?x=1&EmpID=' + EMP.ID;
        }
        if (EMP.STEP_NO == 2) {
            window.location.href = '../DashBoard/hrIndex#!/EmpContact?x=1&EmpID=' + EMP.ID;
        }
        if (EMP.STEP_NO == 3) {
            window.location.href = '../DashBoard/hrIndex#!/Empemplment?x=1&EmpID=' + EMP.ID;
        }
        if (EMP.STEP_NO == 4) {
            window.location.href = '../DashBoard/hrIndex#!/EmpQualifi?x=1&EmpID=' + EMP.ID;
        }
        if (EMP.STEP_NO == 5) {
            window.location.href = '../DashBoard/hrIndex#!/EmpComp?x=1&EmpID=' + EMP.ID;
        }
        if (EMP.STEP_NO == 6) {
            window.location.href = '../DashBoard/hrIndex#!/EmpLev?x=1&EmpID=' + EMP.ID;
        }
        if (EMP.STEP_NO == 7) {
            window.location.href = '../DashBoard/hrIndex#!/EmpDoc?x=1&EmpID=' + EMP.ID;
        }
    };
});
app.controller('HistoryListController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.EmpID = getUrlParameter('EmpID', $location.absUrl());
    $scope.COMMON_CODE_CHANGE();
    $scope.EFFECTIVE_DATA_LIST = [];
    $scope.$parent.$parent.overlay_loadingNew = 'block'
    $scope.$parent.TabActive(2);
    $scope.HistorySearch = {
        EMPLOYEE_NO: '',
        NAME: '',
        DEPARTMENT_IDS: '',
        POSITIONS_IDS: "",
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        PAGE_NO_IN: 1,
        PAGE_SIZE_IN: 10,
    };
    $scope.ResetEmp = function () {
        $scope.HistorySearch = {
            EMPLOYEE_NO: '',
            NAME: '',
            DEPARTMENT_IDS: '',
            POSITIONS_IDS: "",
            PAGE_NO: 1,
            PAGE_SIZE: 10,
            PAGE_NO_IN: 1,
            PAGE_SIZE_IN: 10,
        }
        $scope.RFLAG = 1;
    };
    $scope.HISTORY_HEADERS_LIST = [];
    $scope.HISTORY_DETAILS_LIST = [];
    $scope.GET_EMPLOYEE_PROFILE_HEADER = function () {
        var PosiModelObj = new Object();
        PosiModelObj.EMPLOYEE_ID = $scope.EmpID;
        PrcCommMethods.HR_API(PosiModelObj, 'GET_EMPLOYEE_PROFILE_HEADER').then(function (data) {
            $scope.$parent.EmpSearch_HEADER = data.data.Table[0];
            $scope.TERMINATION_DETAILS = data.data.Table2;
            $scope.EMP_SEARCH_NAME_DTL = data.data.Table1[0];
            $scope.$parent.CalculetteService(data.data.Table[0]);
        });
        $scope.IS_EDITABLE_FLAG = true;
        if ($scope.EmpID == parseInt($cookies.get("EMPLOYEE_ID"))) {
            $scope.IS_EDITABLE_FLAG = false;
        }
    };
    $scope.GET_EMPLOYEE_PROFILE_HEADER();
    $scope.HR_GET_HISTORY_HEADERS_LAZY_LOAD = function () {
        $scope.HR_GET_HISTORY_HEADERS();
    };
    $scope.HR_GET_HISTORY_HEADERS = function (FLAG) {
        var GET_ALL = new Object();
        if (FLAG == 1) {
            $scope.HistorySearch.PAGE_NO = 1;
            $scope.HistorySearch.PAGE_SIZE = 10;
        }
        $scope.$parent.$parent.overlay_loadingNew = 'block'
        GET_ALL.HISTORY_TYPE_ID = 1;
        GET_ALL.RELATIVE_ID = $scope.EmpID;
        GET_ALL.PAGE_NO = $scope.HistorySearch.PAGE_NO;
        GET_ALL.PAGE_SIZE = $scope.HistorySearch.PAGE_SIZE;
        PrcCommMethods.HR_API(GET_ALL, 'HR_GET_HISTORY_HEADERS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.HISTORY_HEADERS_LIST = $scope.HISTORY_HEADERS_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.HistorySearch.PAGE_SIZE) {
                    $scope.GetDataHistory = false;
                }
                else {
                    $scope.HistorySearch.PAGE_NO = parseInt($scope.HistorySearch.PAGE_NO) + 1;
                    $scope.GetDataHistory = true;
                }
            }
            else {
                if ($scope.HISTORY_HEADERS_LIST.length == 0) {
                }
                $scope.GetDataHistory = false;
                $scope.$parent.$parent.overlay_loadingNew = 'none';
            }
            $scope.$parent.$parent.overlay_loadingNew = 'none'
        });
    };
    $scope.HR_GET_HISTORY_HEADERS(1);
    $scope.ViewHistoryEmpSearch_1 = {
    };
    $scope.HR_GET_HISTORY_DETAILS = function (LINE) {
        $scope.$parent.$parent.overlay_loadingNew = 'block'
        var PosiModelObj = new Object();
        PosiModelObj.APP_PAGE_ID = LINE.APP_PAGE_ID;
        PosiModelObj.HISTORY_TYPE_ID = LINE.HISTORY_TYPE_ID;
        PosiModelObj.HISTORY_HDR_ID = LINE.HISTORY_HDR_ID;
        PosiModelObj.RELATIVE_ID = LINE.RELATIVE_ID;
        PosiModelObj.LOGIN_USER_EMP_ID = parseInt($cookies.get("EMPLOYEE_ID"));
        PosiModelObj.LOGIN_USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.HR_API(PosiModelObj, 'HR_GET_HISTORY_DETAILS').then(function (data) {
            $('#POP_HISTORY').modal('show');
            $scope.ViewHistoryEmpSearch_1 = {
            }
            $scope.$parent.ObjectHistoryData = {
            }
            if (LINE.APP_PAGE_ID == 10) {
                var ABSENCE = $filter('unique')(data.data.Table, 'ABSENCE_TYPE_ID');
                $scope.ViewHistoryEmpSearch_1.APP_PAGE_ID = LINE.APP_PAGE_ID;
                $scope.ViewHistoryEmpSearch_1.ABSENCE_TYPE_EMP_UPD = [];
                if (ABSENCE.length > 0) {
                    angular.forEach(ABSENCE, function (AB) {
                        var CHANGE_LIST = data.data.Table.filter(function (x) { return x.EMP_LEAVE_ID == AB.EMP_LEAVE_ID && x.EMP_HISTORY_HEADER_ID !== AB.EMP_HISTORY_HEADER_ID });
                        if (CHANGE_LIST.length > 0) {
                            AB.CHANGE_LIST = CHANGE_LIST;
                        }
                        else {
                            AB.CHANGE_LIST = [];
                        }
                    });
                    $scope.ViewHistoryEmpSearch_1.ABSENCE_TYPE_EMP_UPD = ABSENCE;
                }
            }
            else if (LINE.APP_PAGE_ID == 8) {
                // var COURCE = $filter('unique')(data.data.Table, 'EMP_QLFCTN_ID');
                var COURCE = data.data.Table.filter(function (x) { return x.EMP_HISTORY_HEADER_ID == LINE.HISTORY_HDR_ID });
                $scope.ViewHistoryEmpSearch_1.APP_PAGE_ID = LINE.APP_PAGE_ID;
                $scope.ViewHistoryEmpSearch_1.CourseList = [];
                if (COURCE.length > 0) {
                    angular.forEach(COURCE, function (CRS) {
                        var CHANGE_LIST = data.data.Table.filter(function (x) { return x.EMP_QLFCTN_ID == CRS.EMP_QLFCTN_ID && x.EMP_HISTORY_HEADER_ID != CRS.EMP_HISTORY_HEADER_ID });
                        if (CHANGE_LIST.length > 0) {
                            CRS.CHANGE_LIST = CHANGE_LIST;
                            //angular.forEach(CHANGE_LIST, function (x) {
                            //});
                        }
                        else {
                            CRS.CHANGE_LIST = [];
                        }
                        var UploadedFiles = data.data.Table.filter(function (x) { return x.TABLE_ID == CRS.TABLE_ID });
                        if (UploadedFiles.length > 0) {
                            CRS.UploadedFiles = UploadedFiles;
                        }
                        else {
                            CRS.UploadedFiles = [];
                        }

                    });
                    $scope.ViewHistoryEmpSearch_1.CourseList = COURCE;
                }
                else {
                    $scope.ViewHistoryEmpSearch_1.CourseList.push({ TABLE_ID: null, COURSE_NAME: null, EXPIRY_DATE: null, UPLOAD_IDS: null, DELETE_FLAG: 0 });
                }
            }
            else {
                var LIST = data.data.Table.filter(function (x) { return x.EMP_HISTORY_HEADER_ID == LINE.HISTORY_HDR_ID });
                var History = data.data.Table.filter(function (x) { return x.EMP_HISTORY_HEADER_ID != LINE.HISTORY_HDR_ID });
                if (History.length > 0) {
                    $scope.$parent.ObjectHistoryData = History[0];
                }
                if (LIST.length > 0) {
                    $scope.ViewHistoryEmpSearch_1 = LIST[0];
                    if (LINE.APP_PAGE_ID == 9) {


                        $scope.ViewHistoryEmpSearch_1.ADDITIONAL_PAY_LIST = [];
                        $scope.ViewHistoryEmpSearch_1.ADDITIONAL_PAY_LIST = data.data.Table1;




                    }
                    else if (LINE.APP_PAGE_ID == 7) {
                        ///Reporting manager data remove 
                        //if (data.data.Table1.length > 0) {
                        //    var REPRT_M = data.data.Table1.filter(function (x) { return parseInt(x.EMP_HISTORY_HEADER_ID) == $scope.$parent.ObjectHistoryData.EMP_HISTORY_HEADER_ID });
                        //    if (REPRT_M.length > 0) {
                        //        $scope.$parent.ObjectHistoryData.Table1 = REPRT_M;
                        //    }
                        //    var REPRT_M_HISTORY = data.data.Table1.filter(function (x) { return parseInt(x.EMP_HISTORY_HEADER_ID) != $scope.$parent.ObjectHistoryData.EMP_HISTORY_HEADER_ID });
                        //    if (REPRT_M_HISTORY.length > 0) {
                        //        $scope.ViewHistoryEmpSearch_1.Table1 = REPRT_M_HISTORY;
                        //    }
                        //}
                    }
                    else if (LINE.APP_PAGE_ID == 11) {
                        $scope.ViewHistoryEmpSearch_1.WORK_PERMIT_UPD = [];
                        var UP_LIST = data.data.Table1.filter(function (x) { return parseInt(x.EMP_HISTORY_HEADER_ID) == LINE.HISTORY_HDR_ID });
                        if (UP_LIST.length > 0) {
                            $scope.ViewHistoryEmpSearch_1.WORK_PERMIT_UPD = UP_LIST;
                            $scope.ViewHistoryEmpSearch_1.WORK_PERMIT_UPD[0].PRE_LIST = []
                            var PRE_LIST = data.data.Table1.filter(function (x) { return parseInt(x.EMP_HISTORY_HEADER_ID) != LINE.HISTORY_HDR_ID });
                            $scope.ViewHistoryEmpSearch_1.WORK_PERMIT_UPD[0].PRE_LIST = PRE_LIST;
                        }
                    }
                    $scope.ViewHistoryEmpSearch_1.COLMD = 'col-md-4';
                    $scope.ViewHistoryEmpSearch_1.APP_PAGE_ID = LINE.APP_PAGE_ID;
                    $scope.ViewHistoryEmpSearch_1.IS_HEADER = true;
                    $scope.GET_CUSTOM_LABEL_APP_FIELD_MAPPING(LINE.APP_PAGE_ID, LIST[0]);
                }
            }
            $scope.$parent.$parent.overlay_loadingNew = 'none'
        });
    };
});
app.controller('InviteApplicantController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    //$scope.$parent.$parent.overlay_loadingNew = 'block'
    $scope.DISSABLE_PAGE_FLAG = false;
    $scope.$parent.DISSABLE_WINDOW_ICON = false;
    $scope.COMMON_CODE_CHANGE();
    $scope.EMP_ID = getUrlParameter('EMP_ID', $location.absUrl());
    $scope.T_ID = getUrlParameter('T_ID', $location.absUrl());
    $scope.orderByField = 'CREATED_DATE';
    //var urlparameter = $scope.urlparam.split(':;:');
    //if (urlparameter.length > 0) {
    //    $scope.T_ID = urlparameter[0];
    //}

    $scope.$parent.overlay_loadingNew = 'block';
    $scope.ApplicantSearch = {
    };
    $scope.ResetApplication = function () {
        $scope.ApplicantSearch = {}
        angular.forEach($scope.CUSTOM_FIELDS_LIST, function (x) {
            if (x.FIELD_MASTER_ID != 115) {
                x.FIELD_VALUE = '';
            }
            if (x.FIELD_TYPE_ID == 3) {
                x.FIELD_VALUE = null;
            }
            if (x.FIELD_TYPE_ID == 7) {
                x.checkedOption = [];
            }
        })
        $scope.CustomForm.submitted = false;
        $scope.EMPLOYEE_NO = '';
    };

    $scope.VALIDATE_PASS_KEY = function () {
        var UserModelObj = new Object();
        UserModelObj.PassKey = $scope.T_ID;
        UserModelObj.ID = 0;
        UserModelObj.FLAG = 2;
        var httprequest = $http({
            method: 'POST',
            url: CommService.Get_CASHUP_API() + 'api/LoginAPI/VALIDATE_PASS_KEY',
            data: UserModelObj
        }).then(function (data) {
            if (data.data.Table.length > 0) {
                if (data.data.Table[0].SUCCESS == 1) {
                    $scope.LINK_EXPIRE_FLAG = true;
                    $scope.HR_GET_EMPLOYEE_INVITATION_BY_ID($scope.T_ID);
                }
                if (data.data.Table[0].SUCCESS == 0) {
                    $scope.LINK_EXPIRE_FLAG = false;
                }
            }
        });
    };

    $scope.HR_GET_EMPLOYEE_INVITATION_BY_ID = function (ENCRYPTED_KEY) {
        var EmpModelObj = new Object();
        EmpModelObj.TABLE_ID = $scope.EMP_ID;
        EmpModelObj.ENCRYPTED_KEY = ENCRYPTED_KEY;
        PrcCommMethods.HR_API(EmpModelObj, 'HR_GET_EMPLOYEE_INVITATION_BY_ID').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.DISSABLE_PAGE_FLAG = true;
                $scope.ObjectData = data.data.Table[0];
                $scope.EMP_ID = $scope.ObjectData.TABLE_ID;

                $scope.COLMD = 'col-md-4';
                if ($scope.T_ID != undefined) {
                    $cookies.put('ENTITY_ID', $scope.ObjectData.ENTITY_ID, { 'path': '/' });
                    $cookies.put('CUSTOMER_ID', $scope.ObjectData.CUSTOMER_ID, { 'path': '/' });
                }
                $scope.$parent.GET_CUSTOM_APP_FIELD_MAPPING(17, $scope.COLMD);
            }
            else {
                $scope.DISSABLE_PAGE_FLAG = false;

            }
        });
    };
    if (window.location.href.toLowerCase().indexOf("plain/index") != -1) {
        $scope.VALIDATE_PASS_KEY();
    }
    if ($scope.EMP_ID > 0) {
        $scope.HR_GET_EMPLOYEE_INVITATION_BY_ID();
        $scope.HEADER_EDIT_ADD = 'Edit'
    }
    else {
        $scope.HEADER_EDIT_ADD = 'Invite'
        $scope.$parent.GET_CUSTOM_APP_FIELD_MAPPING(17, $scope.COLMD);
    };

    $scope.BANK_VALIDATION = function (FLAG, SORT_CODE, ACCOUNT_NUMBER, API_PATH, API_KEY, API_PASSWORD) {
        var PosiModelObj = new Object();
        //PosiModelObj.API_NAME = 'BANKCHECKER';
        PosiModelObj.API_NAME = 'BANKCHECKER';
        if (PosiModelObj.API_NAME == "BANKCHECKER") {
            // API_KEY = '9cf21727d649f6403aa65c753f3e7bf1';
            // API_PATH = 'https://www.bankaccountchecker.com/listener.php'
            PosiModelObj.BankCheckerApiKey = API_KEY//'9cf21727d649f6403aa65c753f3e7bf1';
            PosiModelObj.BankCheckerPassword = API_PASSWORD//'Example123$';
            PosiModelObj.API_PATH = API_PATH + "?key=" + PosiModelObj.BankCheckerApiKey + "&password=" + PosiModelObj.BankCheckerPassword + "&output=json&type=uk&sortcode=" + SORT_CODE + "&bankaccount=" + ACCOUNT_NUMBER + "&email=&phone=&country=";
        }
        if (PosiModelObj.API_NAME == "FETCHIFY") {
            PosiModelObj.BankCheckerApiKey = API_KEY//'0eeae-9abb9-4dd08-0779a';
            PosiModelObj.SORT_CODE = SORT_CODE;
            PosiModelObj.ACCOUNT_NUMBER = ACCOUNT_NUMBER;
            PosiModelObj.API_PATH = API_PATH//'https://api.craftyclicks.co.uk/bank/1.1/validate';
        }
        PrcCommMethods.HR_API(PosiModelObj, 'BANK_VALIDATION').then(function (data) {
            $scope.BANK_DETAILS = JSON.parse(data.data);
            $scope.$parent.$parent.overlay_loadingNew = 'none';
            if (PosiModelObj.API_NAME == "BANKCHECKER") {
                if ($scope.BANK_DETAILS == null) {
                    $scope.$parent.ShowAlert('Error', $scope.SOMETHINGWENTWRONG, 3000);
                }
                else if ($scope.BANK_DETAILS.resultCode == "01") {
                    $scope.HR_INS_UPD_EMPLOYEE_INVITATION(FLAG, $scope.BANK_DETAILS.resultCode);
                }
                else if ($scope.BANK_DETAILS.resultCode == "03") {
                    $scope.$parent.ShowAlert('Error', 'Your license has expired.', 3000);
                }
                else {
                    $scope.$parent.ShowAlert('Error', 'Sortcode and Bank Account are not valid', 3000);
                }
            }
            else {
                if ($scope.BANK_DETAILS.successful) {
                    //    $scope.HR_INS_UPD_EMPLOYEE_INVITATION(FLAG, '01');
                }
                else {
                    $scope.$parent.ShowAlert('Error', 'Sortcode and Bank Account are not valid', 3000);
                    //"sortCode: Does not match the regex pattern ^[0-9]{6,6}$"
                }
            }
        });
    };


    $scope.HR_INS_UPD_EMPLOYEE_INVITATION = function (FLAG, VALID) {
        $scope.CustomForm.submitted = true;
        var Validcount = 0;
        var index221 = $scope.$parent.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID == 221)
        var IS_API_CHECK = false;
        if (index221 > -1) {
            IS_API_CHECK = $scope.$parent.CUSTOM_FIELDS_LIST[index221].API_FLAG;
        }
        var index222 = $scope.$parent.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID == 222)
        if (index221 > -1 && $scope.$parent.CUSTOM_FIELDS_LIST[index221].FIELD_VALUE != '' && $scope.$parent.CUSTOM_FIELDS_LIST[index221].FIELD_VALUE != null && $scope.$parent.CUSTOM_FIELDS_LIST[index221].FIELD_VALUE != undefined) {
            if ($scope.$parent.CUSTOM_FIELDS_LIST[index222].FIELD_VALUE == '' || $scope.$parent.CUSTOM_FIELDS_LIST[index222].FIELD_VALUE == undefined || $scope.$parent.CUSTOM_FIELDS_LIST[index222].FIELD_VALUE == null) {
                $scope.$parent.ShowAlert('Error', 'Please Enter Account Number', 3000);
                Validcount++;
            }
        }
        if (index222 > -1 && $scope.$parent.CUSTOM_FIELDS_LIST[index222].FIELD_VALUE != '' && $scope.$parent.CUSTOM_FIELDS_LIST[index222].FIELD_VALUE != null && $scope.$parent.CUSTOM_FIELDS_LIST[index222].FIELD_VALUE != undefined) {
            if ($scope.$parent.CUSTOM_FIELDS_LIST[index221].FIELD_VALUE == '' || $scope.$parent.CUSTOM_FIELDS_LIST[index221].FIELD_VALUE == undefined || $scope.$parent.CUSTOM_FIELDS_LIST[index221].FIELD_VALUE == null) {
                $scope.$parent.ShowAlert('Error', 'Please Enter Sort Code', 3000);
                Validcount++;
            }
        }
        if (IS_API_CHECK && index221 > -1 && index222 > -1 && VALID != '01' && $scope.$parent.CUSTOM_FIELDS_LIST[index221].FIELD_VALUE != '' && $scope.$parent.CUSTOM_FIELDS_LIST[index221].FIELD_VALUE != null && $scope.$parent.CUSTOM_FIELDS_LIST[index221].FIELD_VALUE != undefined && $scope.$parent.CUSTOM_FIELDS_LIST[index222].FIELD_VALUE != '' && $scope.$parent.CUSTOM_FIELDS_LIST[index222].FIELD_VALUE != null && $scope.$parent.CUSTOM_FIELDS_LIST[index222].FIELD_VALUE != undefined) {
            if ($scope.CustomForm.$valid && Validcount == 0) {
                //$scope.BANK_VALIDATION(FLAG, $scope.$parent.CUSTOM_FIELDS_LIST[index221].FIELD_VALUE, $scope.$parent.CUSTOM_FIELDS_LIST[index222].FIELD_VALUE);
                $scope.BANK_VALIDATION(FLAG, $scope.$parent.CUSTOM_FIELDS_LIST[index221].FIELD_VALUE, $scope.$parent.CUSTOM_FIELDS_LIST[index222].FIELD_VALUE, $scope.$parent.CUSTOM_FIELDS_LIST[index221].API_PATH, $scope.$parent.CUSTOM_FIELDS_LIST[index221].API_KEY, $scope.$parent.CUSTOM_FIELDS_LIST[index221].API_PASSWORD);
            }
        }
        else {
            if ($scope.CustomForm.$valid && Validcount == 0) {
                var EmpModelObj = new Object();
                var IsValidCount = 0;
                angular.forEach($scope.$parent.CUSTOM_FIELDS_LIST, function (val) {
                    val.IsValidCount = 0;
                    if (val.FIELD_VALUE == undefined) {
                        val.FIELD_VALUE = '';
                    }
                    if (val.FIELD_TYPE_ID == 6 || val.FIELD_TYPE_ID == 7 || val.FIELD_TYPE_ID == 11) {
                        $scope.$parent.INSERT_FIELD_TYPE_ID_SET_VALUE(val.FIELD_TYPE_ID, val, $scope.EDIT_PAGE);
                        if (val.IsValidCount > 0) {
                            IsValidCount++;
                        }
                    }
                    if ($scope.EDIT_PAGE && val.FIELD_TYPE_ID != 3 && val.FIELD_TYPE_ID != 5 && val.FIELD_TYPE_ID != 10 || ($scope.EDIT_PAGE && val.FIELD_TYPE_ID == 3 && !val.IS_DB_DROPDOWN)) {
                        if (val.FIELD_TYPE_ID == 9) {
                            val.CHANGE_FLAG == 1 ? val.FIELD_VALUE == "" ? EmpModelObj[val.NG_MODEL] = '1/1/0001 12:00:00 AM' : EmpModelObj[val.NG_MODEL] = val.FIELD_VALUE : val.FIELD_VALUE = null;
                        }
                        else {
                            EmpModelObj[val.NG_MODEL] = val.CHANGE_FLAG == 1 ? val.FIELD_VALUE : null;
                        }
                        if (val.FIELD_MASTER_ID == 92) {
                            EmpModelObj[val.NG_MODEL] = val.CHANGE_FLAG == 1 ? moment(val.FIELD_VALUE, "DD/MM/YYYY").format('L') : null;
                        }
                    }
                    else {
                        EmpModelObj[val.NG_MODEL] = val.FIELD_VALUE;
                        if (val.FIELD_TYPE_ID == 9) {
                            val.FIELD_VALUE == "" ? EmpModelObj[val.NG_MODEL] = '1/1/0001' : EmpModelObj[val.NG_MODEL] = val.FIELD_VALUE;
                        }
                        if (val.FIELD_MASTER_ID == 92) {
                            EmpModelObj[val.NG_MODEL] = moment(val.FIELD_VALUE, "DD/MM/YYYY").format('L');
                        }
                        //if (val.FIELD_MASTER_ID == 292) {
                        //    EmpModelObj.REPORTING_MANAGER_IDS = val.FIELD_VALUE == '' || val.FIELD_VALUE == undefined || val.FIELD_VALUE == null ? -1 : val.FIELD_VALUE;
                        //}
                        //else 

                        if (val.FIELD_MASTER_ID == 338) {
                            EmpModelObj.NO_OF_SHIFTS_PER_WEEK = parseFloat(val.FIELD_VALUE);
                        }
                        else if (val.FIELD_MASTER_ID == 143) {
                            // EmpModelObj[val.NG_MODEL] = moment(val.FIELD_VALUE, "DD/MM/YYYY").format('L');
                        }
                        else if (val.FIELD_MASTER_ID == 356) {
                            EmpModelObj[val.NG_MODEL] = val.FIELD_VALUE == -1 ? null : val.FIELD_VALUE;
                        }
                        else if (val.FIELD_MASTER_ID == 353 || val.FIELD_MASTER_ID == 354) {
                            if (val.FIELD_VALUE != undefined && val.FIELD_VALUE != null && val.FIELD_VALUE != '') {
                                EmpModelObj[val.NG_MODEL] = moment(val.FIELD_VALUE, "DD/MM/YYYY").format('L');
                            }
                        }
                    }
                });
                EmpModelObj.TABLE_ID = $scope.EMP_ID;
                EmpModelObj.USER_ID = $scope.T_ID != undefined ? 0 : parseInt($cookies.get("USERID"));
                EmpModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
                EmpModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
                EmpModelObj.FLAG = $scope.T_ID != undefined ? 0 : 1;
                EmpModelObj.ENCRYPTED_KEY = $scope.T_ID;
                EmpModelObj.EMPLOYEE_NO = $scope.EMPLOYEE_NO;
                if (IsValidCount == 0) {
                    $scope.submitted = true;
                    $scope.CustomForm.submitted = false;
                    PrcCommMethods.HR_API(EmpModelObj, 'HR_INS_UPD_EMPLOYEE_INVITATION').then(function (data) {
                        if ($scope.T_ID == undefined) {
                            if (FLAG == 1) {
                                $location.path('AddApplicant');
                            }
                            if (FLAG == 2) {
                                $location.path('team').search('FLG', 4);
                            }
                            if ($scope.EMP_ID > 0) {
                                $scope.ShowAlert('Success', 'Invitation Resent successfully', 5000);
                                angular.forEach($scope.CUSTOM_FIELDS_LIST, function (x) {
                                    x.FIELD_VALUE = '';
                                    if (x.FIELD_TYPE_ID == 3) {
                                        x.FIELD_VALUE = null;
                                    }
                                    if (x.FIELD_TYPE_ID == 7) {
                                        x.checkedOption = [];
                                    }
                                    if (x.FIELD_TYPE_ID == 11) {
                                        x.UploadedFiles = [];
                                    }
                                })
                                $scope.EMPLOYEE_NO = '';
                            }
                            else {
                                $scope.ShowAlert('Success', 'Invitation sent successfully', 5000);
                                angular.forEach($scope.CUSTOM_FIELDS_LIST, function (x) {
                                    x.FIELD_VALUE = '';
                                    if (x.FIELD_TYPE_ID == 3) {
                                        x.FIELD_VALUE = null;
                                    }
                                    if (x.FIELD_TYPE_ID == 7) {
                                        x.checkedOption = [];
                                    }
                                    if (x.FIELD_TYPE_ID == 11) {
                                        x.UploadedFiles = [];
                                    }
                                })
                                $scope.EMPLOYEE_NO = '';
                            }
                        }
                        if ($scope.T_ID != undefined) {
                            $scope.ShowAlert('Success', 'Submit successfully', 5000);
                            $scope.EMPLOYEE_NO = '';
                            //window.location.reload();
                        }
                    });
                }
            }
        }
    };
    $scope.GET_EMERGENCY_CONTACT_RELATIONSHIP = function (CUSTOM_FIELD) {
        var PosiModelObj = new Object();
        PosiModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));;
        PosiModelObj.ENTITY_ID = 0;
        PosiModelObj.RELATIONSHIP_NAME = '';
        PosiModelObj.ACTIVE = 1;
        PosiModelObj.PAGE_NO = 0;
        PosiModelObj.PAGE_SIZE = 0;
        PrcCommMethods.ADMIN_API(PosiModelObj, 'ADMIN_GET_EMERGENCY_CONTACT_RELATIONSHIP').then(function (data) {
            if (data.data.Table.length > 0) {
                CUSTOM_FIELD.OPTION_LIST = data.data.Table;
            }
            else {
                CUSTOM_FIELD.OPTION_LIST = [];
            }

        });
    };
    $scope.GET_NATIONALITY = function (CUSTOM_FIELD) {
        var ModelObj = new Object();
        ModelObj.CUSTOMER_ID = null;//$scope.NationalitySearch.CUSTOMER_ID;;
        ModelObj.NATIONALITY_ID = '';
        ModelObj.NATIONALITY_NAME = '';
        ModelObj.ACTIVE = 1;
        ModelObj.PAGE_NO = 0;
        ModelObj.PAGE_SIZE = 0;
        ModelObj.ENTITY_ID = null;
        PrcCommMethods.ADMIN_API(ModelObj, 'ADMIN_GET_NATIONALITY').then(function (data) {
            if (data.data.Table.length > 0) {
                CUSTOM_FIELD.OPTION_LIST = data.data.Table;
            }
            else {
                CUSTOM_FIELD.OPTION_LIST = [];
            }
        });
    };
    $scope.GET_NATIONALITY_ID_TYPES = function (PREVIOUS_FIELD, CUSTOM_FIELD) {
        if (PREVIOUS_FIELD.FIELD_VALUE != undefined) {
            var PosiModelObj = new Object();
            PosiModelObj.ACTIVE = 1;
            PosiModelObj.NATIONALITY_ID = PREVIOUS_FIELD.FIELD_VALUE;
            PosiModelObj.NATIONAL_TYPE_NAME = "";
            PosiModelObj.PAGE_NO = 0;
            PosiModelObj.PAGE_SIZE = 0;
            PosiModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.ADMIN_API(PosiModelObj, 'ADMIN_GET_NATIONALITY_ID_TYPE').then(function (data) {
                // $scope.NATIONAL_ID_LIST = data.data.Table;
                if (data.data.Table.length > 0) {
                    CUSTOM_FIELD.OPTION_LIST = data.data.Table;
                    var index_351 = $scope.$parent.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 351);
                    if ($scope.EMP_ID > 0) { }
                    else {
                        var OPLT1 = CUSTOM_FIELD.OPTION_LIST.filter(function (x) { return x.IS_DEFAULT });
                        if (OPLT1.length > 0) {
                            CUSTOM_FIELD.FIELD_VALUE = OPLT1[0].TABLE_ID;
                        }
                    }
                    var OPLT = CUSTOM_FIELD.OPTION_LIST.filter(function (x) { return x.TABLE_ID == CUSTOM_FIELD.FIELD_VALUE });
                    if (OPLT.length > 0) {
                        $scope.CUSTOM_FIELDS_LIST[index_351].ENTITY_COLUMN_NAME = OPLT[0].DISPLAY_TEXT + ' Number';
                    }
                }
                else {
                    CUSTOM_FIELD.OPTION_LIST = [];
                }
            });
        }
        else {
            CUSTOM_FIELD.OPTION_LIST = [];
        }
    };
    $scope.GET_COUNTRY = function (CUSTOM_FIELD, ONCHANGEFLAG, Data_Obj) {
        var PosiModelObj = new Object();
        PrcCommMethods.HR_API(PosiModelObj, 'GET_COUNTRY').then(function (data) {
            if (data.data.Table.length > 0) {
                CUSTOM_FIELD.OPTION_LIST = data.data.Table;
                //if (ONCHANGEFLAG == 1) {
                //    var index = $scope.$parent.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === CUSTOM_FIELD.DEPENDANT_ID);
                //    $scope.HOURLY_PAYMENT_FY(CUSTOM_FIELD, $scope.$parent.CUSTOM_FIELDS_LIST_FILTER[index], ONCHANGEFLAG, Data_Obj);
                //}
            }
            else {
                CUSTOM_FIELD.OPTION_LIST = [];
            }
        });
    };
    $scope.GET_HR_COST_CENTER = function (CUSTOM_FIELD) {
        var PosiModelObj = new Object();
        PosiModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PosiModelObj.ACTIVE = 1;
        PosiModelObj.PAGE_NO = 0;
        PosiModelObj.PAGE_SIZE = 0;
        PrcCommMethods.HR_API(PosiModelObj, 'ADMIN_GET_COST_CENTER').then(function (data) {
            if (data.data.Table.length > 0) {
                CUSTOM_FIELD.OPTION_LIST = data.data.Table;
            }
            else {
                CUSTOM_FIELD.OPTION_LIST = [];
            }

        });
    };
    $scope.GET_PAY_FREQUENCY = function (CUSTOM_FIELD, ONCHANGEFLAG, Data_Obj) {
        var PosiModelObj = new Object();
        PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PrcCommMethods.ADMIN_API(PosiModelObj, 'ADMIN_GET_PAY_FREQUENCY_ENTITY_MAPPING').then(function (data) {
            $scope.PAY_FREQUENCY = data.data.Table.filter(function (x) { return x.ACTIVE == true });
            if (data.data.Table.length > 0 && CUSTOM_FIELD != undefined) {
                CUSTOM_FIELD.OPTION_LIST = $scope.PAY_FREQUENCY;
                $scope.ANNUAL_SALARY_FY(CUSTOM_FIELD)
            }
            else {
                if (CUSTOM_FIELD != undefined) {
                    CUSTOM_FIELD.OPTION_LIST = [];
                }
            }

        });
    };
    $scope.GET_CURRENCY = function (CUSTOM_FIELD, Data_Obj) {
        var PosiModelObj = new Object();
        PosiModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        PrcCommMethods.HR_API(PosiModelObj, 'GET_CURRENCY').then(function (data) {
            $scope.CURRENCY = data.data.Table;
            //   $scope.EmpSearch_5.ADDITIONAL_CURRENCY_ID = parseInt($cookies.get("CURRENCY_ID"));
            if (data.data.Table.length > 0 && CUSTOM_FIELD != undefined) {
                CUSTOM_FIELD.OPTION_LIST = $scope.CURRENCY;
                if (Data_Obj == undefined || Data_Obj.length == 0) {
                    CUSTOM_FIELD.FIELD_VALUE = parseInt($cookies.get("CURRENCY_ID"));
                }
            }
            else {
                if (CUSTOM_FIELD != undefined) {
                    CUSTOM_FIELD.OPTION_LIST = [];
                }
            }

        });
    };
    $scope.GET_PAID_BY = function (CUSTOM_FIELD) {
        var PosiModelObj = new Object();
        PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PrcCommMethods.ADMIN_API(PosiModelObj, 'ADMIN_GET_PAID_BY_ENTITY_MAPPING').then(function (data) {
            //$scope.PAID_BY = data.data.Table;
            if (data.data.Table.length > 0) {
                CUSTOM_FIELD.OPTION_LIST = data.data.Table.filter(function (x) { return x.ACTIVE == true });
            }
            else {
                CUSTOM_FIELD.OPTION_LIST = [];
            }
        });
    };
    $scope.GET_PAY_CODE = function (CUSTOM_FIELD) {
        var PosiModelObj = new Object();
        PosiModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        PosiModelObj.ACTIVE = 1;
        PosiModelObj.PAGE_NO = 0;
        PosiModelObj.PAGE_SIZE = 0;
        //PosiModelObj.USER_ID = parseInt($cookies.get("ENTITY_ID"));
        PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PrcCommMethods.ADMIN_API(PosiModelObj, 'ADMIN_GET_PAY_CODE').then(function (data) {
            $scope.PAY_CODE = data.data.Table;
            if (data.data.Table.length > 0 && CUSTOM_FIELD != undefined) {
                CUSTOM_FIELD.OPTION_LIST = data.data.Table;
            }
            else {
                if (CUSTOM_FIELD != undefined) {
                    CUSTOM_FIELD.OPTION_LIST = [];
                }
            }
        });
    };
    $scope.GET_PAYMENT_TYPE = function (CUSTOM_FIELD) {
        var PosiModelObj = new Object();
        PosiModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        PosiModelObj.PAYMENT_TYPE_ID = 0;
        PosiModelObj.PAYMENT_TYPE_NAME = '';
        PosiModelObj.ACTIVE = 1;
        PosiModelObj.PAGE_SIZE = 0;
        PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PrcCommMethods.ADMIN_API(PosiModelObj, 'ADMIN_GET_PAYMENT_TYPE').then(function (data) {
            // $scope.PAYMENT_TYPE = data.data.Table;
            if (data.data.Table.length > 0) {
                CUSTOM_FIELD.OPTION_LIST = data.data.Table;
            }
            else {
                CUSTOM_FIELD.OPTION_LIST = [];
            }
        });
    };
    $scope.GET_UNITS = function (CUSTOM_FIELD) {
        var PosiModelObj = new Object();
        PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PrcCommMethods.HR_API(PosiModelObj, 'GET_UNITS').then(function (data) {
            // $scope.UNITS_LIST = data.data.Table;
            if (data.data.Table.length > 0) {
                CUSTOM_FIELD.OPTION_LIST = data.data.Table;
            }
            else {
                CUSTOM_FIELD.OPTION_LIST = [];
            }
        });
    };
    $scope.HR_GET_NI_CATEOGRY_MASTER = function (CUSTOM_FIELD) {
        var PosiModelObj = new Object();
        PosiModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        PosiModelObj.CATEGORY_NAME = '';
        PosiModelObj.ACTIVE = 1;
        PosiModelObj.PAGE_NO = 0;
        PosiModelObj.PAGE_SIZE = 0;
        PrcCommMethods.ADMIN_API(PosiModelObj, 'ADMIN_GET_NI_CATEOGRY_MASTER').then(function (data) {
            // $scope.NI_CATEOGRY_MASTER = data.data.Table;
            if (data.data.Table.length > 0) {
                CUSTOM_FIELD.OPTION_LIST = data.data.Table;
            }
            else {
                CUSTOM_FIELD.OPTION_LIST = [];
            }
        });
    };
    $scope.GET_HR_PENSION_SCHEME = function (CUSTOM_FIELD) {
        var PosiModelObj = new Object();
        PosiModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PrcCommMethods.HR_API(PosiModelObj, 'GET_HR_PENSION_SCHEME').then(function (data) {
            $scope.PENSION_SCHEME = data.data.Table;
            if (data.data.Table.length > 0) {
                CUSTOM_FIELD.OPTION_LIST = data.data.Table;
            }
            else {
                CUSTOM_FIELD.OPTION_LIST = [];
            }
        });
    };


    //////////////////////////////////Employeement//////////////////////////////////////////////////////////

    $scope.HR_GET_POSITION_DTLS = function (CUSTOM_FIELD) {
        var PosiModelObj = new Object();
        PosiModelObj.POSITION_ID = CUSTOM_FIELD.FIELD_VALUE_ID == undefined ? CUSTOM_FIELD.FIELD_VALUE : CUSTOM_FIELD.FIELD_VALUE_ID;
        PrcCommMethods.HR_API(PosiModelObj, 'HR_GET_POSITION').then(function (data) {
            if (data.data.Table.length > 0) {
                //CUSTOM_FIELD.POSITIONDETAILS = data.data.Table;
                //CUSTOM_FIELD.EMPLOYMENTDETAILS = data.data.Table4;
                //CUSTOM_FIELD.CONTRACTDETAILS = data.data.Table5;
                $scope.ViewPositionSearch_1 = data.data.Table[0];
                $scope.ViewPositionSearch_1.COLMD = 'col-md-4';
                $scope.ViewPositionSearch_1.Table3 = data.data.Table3;
                $scope.GET_CUSTOM_LABEL_APP_FIELD_MAPPING(2, data.data.Table[0]);

                $scope.ViewPositionSearch_2 = data.data.Table4[0];
                $scope.ViewPositionSearch_2.COLMD = 'col-md-4';
                $scope.GET_CUSTOM_LABEL_APP_FIELD_MAPPING(3, data.data.Table4[0]);
                $scope.ViewPositionSearch_3 = data.data.Table5[0];
                $scope.ViewPositionSearch_3.COLMD = 'col-md-4';
                $scope.GET_CUSTOM_LABEL_APP_FIELD_MAPPING(4, data.data.Table5[0]);
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
                    $scope.ViewPositionSearch_1.HR_POSITION_RESPONSIBILITY = data.data.Table1;
                }




            }
            else {
                CUSTOM_FIELD.DTLS = [];
            }
        });
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
    $scope.POP_POSITION = function (CUSTOM_FIELD) {
        $('#position').modal('show');
        $scope.HR_GET_POSITION_DTLS(CUSTOM_FIELD);
    };
    $scope.HR_GET_POSITION = function (CUSTOM_FIELD, ONCHANGEFLAG) {
        var PosiModelObj = new Object();
        PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PosiModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        PosiModelObj.ACTIVE = 1;
        PosiModelObj.FLAG = 2;
        PosiModelObj.PAGE_NO = 0;
        PosiModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
        PosiModelObj.ADMIN_FLAG = $scope.$parent.CheckSubModuleAccess(47) ? 1 : 3;
        PosiModelObj.SORT_COLUMN_NO = 1;
        PosiModelObj.SORT_ORDER_NO = 1
        PrcCommMethods.HR_API(PosiModelObj, 'HR_GET_POSITION_LIST').then(function (data) {
            //$scope.POSITION_LIST = data.data.Table;
            if (data.data.Table.length > 0) {
                CUSTOM_FIELD.OPTION_LIST = data.data.Table;
            }
            else {
                CUSTOM_FIELD.OPTION_LIST = [];
            }
            if (ONCHANGEFLAG == 1) {
                var index_292 = $scope.$parent.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 292);
                $scope.GET_REPORTING_MANAGER_BY_POSITION(CUSTOM_FIELD, $scope.$parent.CUSTOM_FIELDS_LIST[index_292]);

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
    $scope.ADMIN_GET_HR_EMP_DECLARATION_MASTER = function (CUSTOM_FIELD, ONCHANGEFLAG) {
        var PosiModelObj = new Object();
        PosiModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        PosiModelObj.ACTIVE = 1;
        PosiModelObj.PAGE_NO = 0;
        PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PrcCommMethods.HR_API(PosiModelObj, 'ADMIN_GET_HR_EMP_DECLARATION_MASTER').then(function (data) {
            //    CUSTOM_FIELD.CONTRACT_TYPE = data.data.Table;
            if (data.data.Table.length > 0) {
                data.data.Table.push({ TABLE_ID: -1, DISPLAY_TEXT: '--Please Select--' })
                CUSTOM_FIELD.OPTION_LIST = data.data.Table;
                CUSTOM_FIELD.DISPLAY_FIELD_TEXT = '--Please Select--';
                if (ONCHANGEFLAG == 1) {
                    var Result = CUSTOM_FIELD.OPTION_LIST.filter(function (x) { return x.TABLE_ID == CUSTOM_FIELD.FIELD_VALUE })
                    //  CUSTOM_FIELD.DECLERATION_ID = Result[0].TABLE_ID;
                    if (Result.length > 0) {
                        CUSTOM_FIELD.DISPLAY_FIELD_TEXT = Result[0].DISPLAY_TEXT;
                    }
                }
            }
            else {
                CUSTOM_FIELD.OPTION_LIST = [];
            }
        });
    };

    $scope.HR_GET_NOTICE_PERIOD = function (CUSTOM_FIELD) {
        var PosiModelObj = new Object();
        PosiModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        PosiModelObj.ENTITY_ID = 0;
        PosiModelObj.ACTIVE = 1;
        PosiModelObj.PAGE_NO = 0;
        PosiModelObj.PAGE_SIZE = 0;
        PrcCommMethods.ADMIN_API(PosiModelObj, 'ADMIN_GET_NOTICE_PERIOD').then(function (data) {
            if (data.data.Table.length > 0) {
                CUSTOM_FIELD.OPTION_LIST = data.data.Table;
            }
            else {
                CUSTOM_FIELD.OPTION_LIST = [];
            }

        });
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
    $scope.HR_GET_POSITION_BY_ID = function (CUSTOM_FIELD) {
        var PosiModelObj = new Object();
        PosiModelObj.POSITION_ID = CUSTOM_FIELD.FIELD_VALUE;
        PosiModelObj.STEP_NO = 0;
        PrcCommMethods.HR_API(PosiModelObj, 'HR_GET_POSITION').then(function (data) {
            if (data.data.Table5.length > 0) {
                var index_340 = $scope.$parent.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === CUSTOM_FIELD.DEPENDANT_ID_340);
                var index_339 = $scope.$parent.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === CUSTOM_FIELD.DEPENDANT_ID_339);
                var index_337 = $scope.$parent.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === CUSTOM_FIELD.DEPENDANT_ID_337);
                var index_338 = $scope.$parent.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 338);
                var index_341 = $scope.$parent.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 341);
                var index_342 = $scope.$parent.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 342);
                var index_343 = $scope.$parent.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 343);
                var index_344 = $scope.$parent.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 344);
                var index_345 = $scope.$parent.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 345);

                if (index_339 > -1) {
                    $scope.$parent.CUSTOM_FIELDS_LIST[index_339].FIELD_VALUE = data.data.Table5[0].FTE;
                }
                if (index_337 > -1) {
                    $scope.$parent.CUSTOM_FIELDS_LIST[index_337].FIELD_VALUE = data.data.Table5[0].WEEKLY_HOURS;
                }
                if (index_338 > -1) {
                    $scope.$parent.CUSTOM_FIELDS_LIST[index_338].FIELD_VALUE = data.data.Table5[0].NO_OF_SHIFTS_PER_WEEK + '';
                }
                if (index_341 > -1) {
                    $scope.$parent.CUSTOM_FIELDS_LIST[index_341].FIELD_VALUE = data.data.Table5[0].CONTRACT_TYPE_ID;
                }
                if (index_342 > -1) {
                    $scope.$parent.CUSTOM_FIELDS_LIST[index_342].FIELD_VALUE = data.data.Table5[0].PROBATION_PERIOD_ID;
                }
                if (index_343 > -1) {
                    $scope.$parent.CUSTOM_FIELDS_LIST[index_343].FIELD_VALUE = data.data.Table5[0].OVERTIME_ELIGIBILITY;
                }
                if (index_344 > -1) {
                    $scope.$parent.CUSTOM_FIELDS_LIST[index_344].FIELD_VALUE = data.data.Table5[0].HOLIDAY_ENTITLEMENT_NAME;
                }
                if (index_345 > -1) {
                    $scope.$parent.CUSTOM_FIELDS_LIST[index_345].FIELD_VALUE = data.data.Table5[0].TRONC_ELIGIBILITY;
                }
                if (data.data.Table5[0].NO_OF_DAYS > 0) {
                    var index_144 = $scope.$parent.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 144);
                    var index_143 = $scope.$parent.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 143);
                    var hors = parseInt(data.data.Table5[0].NO_OF_DAYS) * 24;
                    $scope.CUSTOM_FIELDS_LIST[index_144].FIELD_VALUE = moment(new Date(new Date($scope.CUSTOM_FIELDS_LIST[index_143].FIELD_VALUE).setHours(hors))).format("LL") == "Invalid date" ? '' : moment(new Date(new Date($scope.CUSTOM_FIELDS_LIST[index_143].FIELD_VALUE).setHours(hors))).format("LL");
                    $scope.$parent.EFFICTIVE_ON_CHANGE($scope.CUSTOM_FIELDS_LIST[index_144]);
                }

            }
            if (data.data.Table4.length > 0) {
                var index_346 = $scope.$parent.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 346);
                var index_347 = $scope.$parent.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 347);
                var index_348 = $scope.$parent.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 348);
                var index_349 = $scope.$parent.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 349);
                var index_350 = $scope.$parent.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 350);
                $scope.$parent.CUSTOM_FIELDS_LIST[index_346].FIELD_VALUE = data.data.Table4[0].COST_CENTER_ID;
                $scope.$parent.CUSTOM_FIELDS_LIST[index_347].FIELD_VALUE = data.data.Table4[0].LOCATION_ID;
                $scope.$parent.CUSTOM_FIELDS_LIST[index_349].FIELD_VALUE = data.data.Table4[0].EMP_CATEGORY_ID;
                $scope.$parent.CUSTOM_FIELDS_LIST[index_348].FIELD_VALUE = data.data.Table4[0].BRANCH_ID;
                $scope.GET_LOCATION_BRANCHES($scope.$parent.CUSTOM_FIELDS_LIST[index_347], $scope.$parent.CUSTOM_FIELDS_LIST[index_348]);
                $scope.$parent.CUSTOM_FIELDS_LIST[index_350].FIELD_VALUE = data.data.Table4[0].EMP_SUB_CATE_ID;
                $scope.SUB_GET_EMPLOYEE_CATEGORY($scope.$parent.CUSTOM_FIELDS_LIST[index_349], $scope.$parent.CUSTOM_FIELDS_LIST[index_350]);
            }
        });
    };
    $scope.GET_WORK_PERMIT_TYPE = function () {
        var PosiModelObj = new Object();
        PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PrcCommMethods.HR_API(PosiModelObj, 'GET_WORK_PERMIT_TYPE').then(function (data) {
            $scope.WORK_PERMIT_TYPE = data.data.Table;
        });
    };
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
    /////////////////////////////////END of emplyoeement//////////////////////////////////////////////////////////////


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
    if ($scope.T_ID != undefined) {
        $scope.$parent.child_scope = $scope;
    }
    else {
        $scope.$parent.child_scope = $scope;
    };
});
