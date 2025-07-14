app.controller('EmpPrimaryDetailsController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    //$scope.$parent.DISPLAY_FLAG = false;
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(2);
    $scope.$parent.$parent.overlay_loading_HR_Loader = 'none';
    $scope.PAGE_LOAD = 0;
    $scope.HR_COMMON_CODE_Fn();
    $scope.TITLE_LIST = [{ TITLE_ID: 'Mr', NAME: 'Mr' }, { TITLE_ID: 'Mrs', NAME: 'Mrs' }, { TITLE_ID: 'Ms', NAME: 'Ms' }];
    $(".modal-backdrop").remove();
    $scope.PrimaryDetails = {
        EMPLY_PRSNL_ID: getUrlParameter('EMP_ID', $location.absUrl()),
        CUSTOMER_ID: $cookies.get("CUSTOMER_ID"),
        ENTITY_ID: $cookies.get("ENTITY_ID"),
        MODULE_ID: $cookies.get("MODULE_ID"),
        USER_ID: $cookies.get("USERID"),
        DD_DEFAULT_TEXT: 'Choose',
        CUSTOM_GENDER_NAME: 'Choose',
        CUSTOM_NATIONALITY_NAME: 'Choose',
        CUSTOM_COUNTRY_NAME: 'Choose',
        POST_CODE: 'Post Code',
        CUSTOM_STUDENT_LOAN_NAME: 'Choose',
        FIRST_NAME: '',
        MIDDLE_NAME: '',
        PROFILE: '',
        KNOWN_AS: '',
        GENDER_ID: '',
        DOB: '',
        NI_NUMBER: '',
        EMPLOYEE_NUMBER: '',
        TAX_ID: '',
        SHARE_CODE: '',
        PRIMARY_PHONE_CODE_ID: '',
        PRIMARY_PHONE: '',
        PRIMARY_PHONE_TEXT: '',
        SECONDARY_PHONE_CODE_ID: '',
        SECONDARY_PHONE: '',
        SECONDARY_PHONE_TEXT: '',
        EMAIL: '',
        EMERGENCY_CONTACT_NAME: '',
        EMERGENCY_CONTACT_RELATION: '',
        EMERGENCY_PHONE_CODE_ID: '',
        EMERGENCY_PHONE_NUMBER: '',
        EMERGENCY_PHONE_NUMBER_TEXT: '',
        ADDRESS_LINE1: '',
        ADDRESS_LINE2: '',
        CITY: '',
        COUNTY: '',
        COUNTRY_ID: '',
        POSTAL_CODE: '',
        ACCOUNT_HOLDER_NAME: '',
        ACCOUNT_NUMBER: '',
        SORT_CODE: '',
        BANK_NAME: '',
        COMMENTS: '',
        EFFECTIVE_DATE: null,
        PROFILE_PIC_PATH: null,
        COUNTY_NAME: 'County',
        SORT_CODE_LABEL: 'Sort Code',
        ACCOUNT_NUMBER_LABEL: 'Account Number',
        UK_PINCODE_REG_X: $scope.$parent.UK_PINCODE_REG_X,
        GCC_PINCODE_REG_X: $scope.$parent.GCC_PINCODE_REG_X,
        US_PINCODE_REG_X: $scope.$parent.US_PINCODE_REG_X,
        POSTAL_CODE_IS_VALID: '',
        STUDENT_LOAN_TYPE: 0,
        PAGE_SIZE: 10,
        SHOW_HIDE_NI_NUMBER: parseInt($cookies.get("COUNTRY_ID")) == 187 || parseInt($cookies.get("COUNTRY_ID")) == 224 || parseInt($cookies.get("COUNTRY_ID")) == 117 || parseInt($cookies.get("COUNTRY_ID")) == 174 || parseInt($cookies.get("COUNTRY_ID")) == 162 || parseInt($cookies.get("COUNTRY_ID")) == 19 ? false : true,
    }
    if ($scope.$parent.CheckStandardRoleAccess(5) || $scope.$parent.CheckStandardRoleAccess(10) || $scope.$parent.CheckStandardRoleAccess(15)) {
        //Employee //5, 10, 15 Employee
        $scope.IS_EMPLOYEE = true;
    }
    if (getUrlParameter('EMP_ID', $location.absUrl()) == undefined || getUrlParameter('EMP_ID', $location.absUrl()) == "" || getUrlParameter('EMP_ID', $location.absUrl()) == null) {
        $scope.showHideClass = 'placeholder_eye_slash';
        //placeholder_eye
    }
    else {
        $scope.inputType = 'Passwordkey';
        $scope.showHideClass = 'placeholder_eye';
        $scope.PLACE_HOLDER_NI = "Type Here";
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
    var primary_phone_number;
    var phone_number;
    var secoundary_phone_number;
    $scope.GENDER_LIST = [
        { GENDER_ID: 1, GENDER_NAME: 'Male' },
        { GENDER_ID: 2, GENDER_NAME: 'Female' },
        { GENDER_ID: 3, GENDER_NAME: 'Do not wish to specify' }]

    $scope.STEP_FLAG = 1;
    $scope.EDIT_STEP_NO = getUrlParameter('STEP_NO', $location.absUrl());
    $scope.EDIT_STEP_NO = $scope.EDIT_STEP_NO == undefined ? 0 : $scope.EDIT_STEP_NO;

    $scope.HRM_GET_EMPLOYEE_STEP = function () {
        var UserModelObj = new Object();
        UserModelObj.EMPLY_PRSNL_ID = $scope.PrimaryDetails.EMPLY_PRSNL_ID;
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'HRM_GET_EMPLOYEE_STEP').then(function (data) {
            if (data.data.Table.length > 0) {
                let RESULT_PERSNL = data.data.Table[0];
                $scope.HeaderPrimaryDetails.FIRST_NAME = RESULT_PERSNL.FIRST_NAME;
                $scope.HeaderPrimaryDetails.MIDDLE_NAME = RESULT_PERSNL.MIDDLE_NAME;
                $scope.HeaderPrimaryDetails.LAST_NAME = RESULT_PERSNL.LAST_NAME;
                $scope.PrimaryDetails.BRANCH_ID = RESULT_PERSNL.BRANCH_ID;
                if (RESULT_PERSNL.STEP_NO == 9) {
                    $scope.PrimaryDetails.LOCK_DATE = $scope.$parent.CHECK_LOCK_DATE_Fn(RESULT_PERSNL.BRANCH_ID);
                }
                $scope.STEP_NO = RESULT_PERSNL.STEP_NO;
                $scope.PAGE_LOAD = 1;
                if (RESULT_PERSNL.EMPLOYEE_STATUS_ID == 5) {
                    $scope.SHOW_EDIT_ACCESS = false;
                }
                else {
                    if (RESULT_PERSNL.STEP_NO == 9) {
                        $scope.EDIT_STEP_NO = RESULT_PERSNL.STEP_NO == undefined ? 0 : RESULT_PERSNL.STEP_NO;
                        $scope.SHOW_CONTACT_EMAIL = $scope.$parent.CheckEmployeepermission(parseInt($cookies.get("ENTITY_ID")), RESULT_PERSNL.BRANCH_ID, parseInt($cookies.get("STANDARD_ROLE_ID")));
                    }
                    else {
                        $scope.EDIT_STEP_NO = RESULT_PERSNL.STEP_NO;
                    }
                    if ($cookies.get("EMPLY_PRSNL_ID") == 0) {
                        $scope.SHOW_EDIT_ACCESS = true;
                    }
                    else if (RESULT_PERSNL.BRANCH_ID == null) {
                        $scope.SHOW_EDIT_ACCESS = $scope.CheckEmployeeAllBranchAccess('EDIT_EMPLOYEE');
                    }
                    else {
                        $scope.SHOW_EDIT_ACCESS = $scope.CheckEmployeeAccess(parseInt($cookies.get("ENTITY_ID")), RESULT_PERSNL.BRANCH_ID, "EDIT_EMPLOYEE");
                    }
                    //if ($scope.SHOW_EDIT_ACCESS) {
                    //    $scope.SHOW_CONTACT_EMAIL = 1;
                    //}
                    $scope.EDIT_MODE = $scope.EDIT_STEP_NO < 9 ? false : true;
                    if (parseInt(getUrlParameter('EMP_ID', $location.absUrl())) == parseInt($cookies.get("EMPLY_PRSNL_ID"))) {
                        $scope.EDIT_MODE = true;
                        $scope.SHOW_EDIT_ACCESS = true;
                        $scope.MY_PROFILE_FLAG = 1;
                        $scope.SHOW_CONTACT_EMAIL = 1;
                    };
                }
            }

        })
    }
    $scope.HRM_GET_STUDENT_LOAN_PLAN = function () {
        var UserModelObj = new Object();
        UserModelObj.COUNTRY_ID = $cookies.get("COUNTRY_ID");
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'HRM_GET_STUDENT_LOAN_PLAN').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.STUDENT_LOAN_LIST = data.data.Table;
                if ($scope.PrimaryDetails.STUDENT_LOAN_MASTER_ID > 0) {
                    var result = $scope.STUDENT_LOAN_LIST.filter(function (x) { return x.STUDENT_LOAN_MASTER_ID == $scope.PrimaryDetails.STUDENT_LOAN_MASTER_ID });
                    if (result.length > 0) {
                        $scope.SELECTED_STUDENT_LOAN_Fn(result[0]);
                    }
                }
            }

        });
    }
    $scope.HRM_GET_GENDERS = function () {
        var personaldetailobj = new Object()
        personaldetailobj.CUSTOMER_ID = $scope.PrimaryDetails.CUSTOMER_ID;
        PrcCommMethods.HUMANRESOURCE_API(personaldetailobj, 'HRM_GET_GENDERS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.GENDER_LIST = data.data.Table;
            };
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
                        ///   parseInt(_loop_value.SETTING_VALUE) == 1 mean manual and zero for auto generate
                        $scope.PrimaryDetails.AUTO_MANUAL_GENERATE = parseInt(_loop_value.SETTING_VALUE) == 1 ? false : true;
                    }
                    else if (_loop_value.SETTING_MASTER_ID == 83) {
                        $scope.PrimaryDetails.AUTO_GENERATE_PREFIX_NO = _loop_value.SETTING_VALUE;
                    }
                });
            }
            else if (data.data == 0) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
        });
    }
    $scope.HRM_GET_GENDERS();
    $scope.GET_CUSTOMER_SETTINGS($scope.PrimaryDetails, '48,83');
    if ($scope.PrimaryDetails.EMPLY_PRSNL_ID > 0) {
        $scope.HRM_GET_EMPLOYEE_STEP();
    }
    else {
        $scope.STEP_NO = 1;
        $scope.HeaderPrimaryDetails.FIRST_NAME = "-";
        $scope.HeaderPrimaryDetails.MIDDLE_NAME = "-";
        $scope.HeaderPrimaryDetails.LAST_NAME = "-";
        if ($cookies.get("EMPLY_PRSNL_ID") == 0) {
            $scope.SHOW_EDIT_ACCESS = true;
        }
        else {
            $scope.SHOW_EDIT_ACCESS = $scope.CheckEmployeeAllBranchAccess('EDIT_EMPLOYEE');
        }
    }
    $scope.EDIT_MODE = $scope.EDIT_STEP_NO < 9 ? false : true;
    $scope.MY_PROFILE_FLAG = 0;
    if (parseInt(getUrlParameter('EMP_ID', $location.absUrl())) == parseInt($cookies.get("EMPLY_PRSNL_ID"))) {
        $scope.EDIT_MODE = true;
        $scope.MY_PROFILE_FLAG = 1;
    };
    $scope.FILL_ACCOUNT_HOLDER_NAME = function () {
        if ($scope.PrimaryDetails.FIRST_NAME != '' && $scope.PrimaryDetails.FIRST_NAME != undefined && $scope.PrimaryDetails.LAST_NAME != '' && $scope.PrimaryDetails.LAST_NAME != undefined) {
            if ($scope.PrimaryDetails.ACCOUNT_HOLDER_NAME == '' || $scope.PrimaryDetails.EMPLY_PRSNL_ID == undefined) {
                $scope.PrimaryDetails.ACCOUNT_HOLDER_NAME = $scope.PrimaryDetails.FIRST_NAME + " " + $scope.PrimaryDetails.LAST_NAME;
            }
        }
    }
    //$scope.FILL_FIRST_ACCOUNT_HOLDER_NAME = function () {
    //    if ($scope.PrimaryDetails.FIRST_NAME != '' && $scope.PrimaryDetails.FIRST_NAME != undefined) {
    //        if ($scope.PrimaryDetails.ACCOUNT_HOLDER_NAME == '' || $scope.PrimaryDetails.EMPLY_PRSNL_ID == undefined) {
    //            $scope.PrimaryDetails.ACCOUNT_HOLDER_NAME = $scope.PrimaryDetails.FIRST_NAME ;
    //        }
    //    }
    //}
    //$scope.FILL_LAST_ACCOUNT_HOLDER_NAME = function () {
    //    if ($scope.PrimaryDetails.LAST_NAME != '' && $scope.PrimaryDetails.LAST_NAME != undefined) {
    //        if ($scope.PrimaryDetails.ACCOUNT_HOLDER_NAME == '' || $scope.PrimaryDetails.EMPLY_PRSNL_ID == undefined) {
    //            $scope.PrimaryDetails.ACCOUNT_HOLDER_NAME = $scope.PrimaryDetails.FIRST_NAME + " " + $scope.PrimaryDetails.LAST_NAME;
    //        }
    //    }
    //}
    $scope.HRM_EDIT_DETAILS = function () {
        $scope.EDIT_MODE = !$scope.EDIT_MODE;
    }
    $scope.fieldChanges = {};
    $scope.WATCH_GROUP_Fn = function (field, DATE_FALG) {
        if (DATE_FALG == 1) {
            $scope.fieldChanges[field] = $scope.PrimaryDetails[field] !== $scope.OrignalData[field];
        }
        else {
            $scope.fieldChanges[field] = $scope.PrimaryDetails[field] !== $scope.OrignalData[field];
        }
    };

    $scope.HRM_GET_EMPLOYEE_PERSONAL = function () {
        var UserModelObj = new Object();
        UserModelObj.EMPLY_PRSNL_ID = $scope.PrimaryDetails.EMPLY_PRSNL_ID
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'HRM_GET_EMPLOYEE_PERSONAL').then(function (data) {
            if (data.data.Table.length > 0) {
                let RESULT_PERSNL = data.data.Table[0];
                $scope.OrignalData = {}
                $scope.HeaderPrimaryDetails.FIRST_NAME = RESULT_PERSNL.FIRST_NAME;
                $scope.HeaderPrimaryDetails.LAST_NAME = RESULT_PERSNL.LAST_NAME;
                $scope.PrimaryDetails.FIRST_NAME = RESULT_PERSNL.FIRST_NAME;
                $scope.PrimaryDetails.MIDDLE_NAME = RESULT_PERSNL.MIDDLE_NAME;
                $scope.PrimaryDetails.LAST_NAME = RESULT_PERSNL.LAST_NAME;
                $scope.PrimaryDetails.NATIONALITY_ID = RESULT_PERSNL.NATIONALITY_ID;
                $scope.PrimaryDetails.CUSTOM_NATIONALITY_NAME = RESULT_PERSNL.NATIONALITY;
                $scope.PrimaryDetails.KNOWN_AS = RESULT_PERSNL.KNOWN_AS;
                $scope.PrimaryDetails.GENDER_ID = RESULT_PERSNL.GENDER_ID;
                $scope.PrimaryDetails.CUSTOM_TITLE_NAME = RESULT_PERSNL.TITLE;
                $scope.PrimaryDetails.TITLE_NAME = RESULT_PERSNL.TITLE;
               
                if (RESULT_PERSNL.TITLE == null || RESULT_PERSNL.TITLE == '') {
                    $scope.SELECTED_TITLE_Fn('');
                }
                $scope.GET_AGE_Fn(RESULT_PERSNL.DOB);
                $scope.PrimaryDetails.DOB = moment(RESULT_PERSNL.DOB).format("DD/MM/YYYY");
                if (RESULT_PERSNL.DOB != null && RESULT_PERSNL.DOB != '' && RESULT_PERSNL.DOB != undefined) {
                    $(".dateofbirth ").datepicker("setDate", moment(RESULT_PERSNL.DOB).format("DD/MM/YYYY"));
                }
                if (RESULT_PERSNL.NI_NUMBER == null || RESULT_PERSNL.NI_NUMBER == undefined || RESULT_PERSNL.NI_NUMBER == '') {
                    $scope.showHideClass = 'placeholder_eye_slash';  //placeholder_eye
                    $scope.inputType = 'text';
                }
                else {
                    // $scope.inputType = '';
                    $scope.showHideClass = 'placeholder_eye';
                    $scope.inputType = 'Passwordkey';
                }
                $scope.PrimaryDetails.NI_NUMBER = RESULT_PERSNL.NI_NUMBER;

                $scope.DEFAULT_COUNTRY_Fn(RESULT_PERSNL);

                $scope.PrimaryDetails.EMPLOYEE_NUMBER = RESULT_PERSNL.EMPLOYEE_NUMBER;
                $scope.PrimaryDetails.TAX_ID = RESULT_PERSNL.TAX_ID;
                $scope.PrimaryDetails.SHARE_CODE = RESULT_PERSNL.SHARE_CODE;

                $scope.PrimaryDetails.PRIMARY_PHONE_CODE_ID = RESULT_PERSNL.PRIMARY_PHONE_CODE_ID;
                $scope.PrimaryDetails.PRIMARY_PHONE_TEXT = RESULT_PERSNL.PRIMARY_PHONE;

                $scope.PrimaryDetails.SECONDARY_PHONE_CODE_ID = RESULT_PERSNL.SECONDARY_PHONE_CODE_ID;
                $scope.PrimaryDetails.SECONDARY_PHONE_TEXT = RESULT_PERSNL.SECONDARY_PHONE;

                $scope.PrimaryDetails.EMAIL = RESULT_PERSNL.EMAIL;
                $scope.PrimaryDetails.EMERGENCY_CONTACT_NAME = RESULT_PERSNL.EMERGENCY_CONTACT_NAME;
                $scope.PrimaryDetails.EMERGENCY_CONTACT_RELATION = RESULT_PERSNL.EMERGENCY_CONTACT_RELATION;
                $scope.PrimaryDetails.EMERGENCY_PHONE_CODE_ID = RESULT_PERSNL.EMERGENCY_PHONE_CODE_ID;
                $scope.PrimaryDetails.EMERGENCY_PHONE_NUMBER_TEXT = RESULT_PERSNL.EMERGENCY_PHONE_NUMBER;
                $scope.PrimaryDetails.ADDRESS_LINE1 = RESULT_PERSNL.ADDRESS_LINE1;
                $scope.PrimaryDetails.ADDRESS_LINE2 = RESULT_PERSNL.ADDRESS_LINE2;
                $scope.PrimaryDetails.CITY = RESULT_PERSNL.CITY;
                $scope.PrimaryDetails.COUNTY = RESULT_PERSNL.COUNTY;
                $scope.PrimaryDetails.COUNTRY_ID = RESULT_PERSNL.COUNTRY_ID;
                $scope.PrimaryDetails.CUSTOM_COUNTRY_NAME = RESULT_PERSNL.COUNTRY_NAME;
                $scope.PrimaryDetails.POSTAL_CODE = RESULT_PERSNL.POSTAL_CODE;
                //if (RESULT_PERSNL.ACCOUNT_HOLDER_NAME == '') {
                //    if ($scope.PrimaryDetails.FIRST_NAME != '' && $scope.PrimaryDetails.LAST_NAME != '') {
                //        $scope.PrimaryDetails.ACCOUNT_HOLDER_NAME = $scope.PrimaryDetails.FIRST_NAME + " " + $scope.PrimaryDetails.LAST_NAME;
                //    }
                //}
                $scope.PrimaryDetails.ACCOUNT_HOLDER_NAME = RESULT_PERSNL.ACCOUNT_HOLDER_NAME;
                $scope.PrimaryDetails.ACCOUNT_NUMBER = RESULT_PERSNL.ACCOUNT_NUMBER;
                $scope.PrimaryDetails.SORT_CODE = RESULT_PERSNL.SORT_CODE;
                $scope.PrimaryDetails.BANK_NAME = RESULT_PERSNL.BANK_NAME;
                $scope.PrimaryDetails.COMMENTS = RESULT_PERSNL.COMMENTS;
                if ('/dist/img/user1-128x128.jpg' == RESULT_PERSNL.PROFILE_PIC_PATH) {
                    $scope.PrimaryDetails.PROFILE_PIC_PATH = "";
                    $scope.PrimaryDetails.PROFILE_PIC_PATH_COPY = "";
                    $scope.PrimaryDetails.DISPLAY_PROFILE_PIC_PATH = "";

                }
                else {
                    $scope.PrimaryDetails.PROFILE_PIC_PATH = RESULT_PERSNL.PROFILE_PIC_PATH;
                    $scope.PrimaryDetails.PROFILE_PIC_PATH_COPY = angular.copy(RESULT_PERSNL.PROFILE_PIC_PATH);
                    $scope.PrimaryDetails.DISPLAY_PROFILE_PIC_PATH = RESULT_PERSNL.PROFILE_PIC_PATH;
                }
                $scope.PrimaryDetails.CUSTOM_GENDER_NAME = RESULT_PERSNL.GENDER;

                $scope.PrimaryDetails.STUDENT_LOAN_TYPE = RESULT_PERSNL.STUDENT_LOAN_TYPE;
                $scope.PrimaryDetails.STUDENT_LOAN_MASTER_ID = RESULT_PERSNL.STUDENT_LOAN_MASTER_ID;
                $scope.HRM_GET_STUDENT_LOAN_PLAN();
                if (RESULT_PERSNL.STUDENT_LOAN_MASTER_ID > 0) {
                }
                else {
                    $scope.SELECTED_STUDENT_LOAN_Fn('');
                }

                var primary_phonne_resultdtls = $scope.NATIONALITY_LIST.filter(function (x) { return x.COUNTRY_ID == $scope.PrimaryDetails.PRIMARY_PHONE_CODE_ID });
                if (primary_phonne_resultdtls.length > 0) {
                    var resultiso2 = primary_phonne_resultdtls[0].TWO_DIGIT_COUNTRY_CODE.toLowerCase();
                    $scope.BIND_PHONE_CALENDAR_Fn('primaryphone', resultiso2, 1);
                }
                else {
                    $scope.BIND_PHONE_CALENDAR_Fn('primaryphone', $scope.$parent.TWO_DIGIT_COUNTRY_CODE.toLowerCase(), 1);
                }
                var secoundary_phonne_dtls = $scope.NATIONALITY_LIST.filter(function (x) { return x.COUNTRY_ID == $scope.PrimaryDetails.SECONDARY_PHONE_CODE_ID });
                if (secoundary_phonne_dtls.length > 0) {
                    var resultiso2 = secoundary_phonne_dtls[0].TWO_DIGIT_COUNTRY_CODE.toLowerCase();
                    $scope.BIND_PHONE_CALENDAR_Fn('secondaryphone', resultiso2, 2);
                } else {
                    $scope.BIND_PHONE_CALENDAR_Fn('secondaryphone', $scope.$parent.TWO_DIGIT_COUNTRY_CODE.toLowerCase(), 2);
                }
                var emergency_phonne_dtls = $scope.NATIONALITY_LIST.filter(function (x) { return x.COUNTRY_ID == $scope.PrimaryDetails.EMERGENCY_PHONE_CODE_ID });
                if (emergency_phonne_dtls.length > 0) {
                    var resultiso2 = emergency_phonne_dtls[0].TWO_DIGIT_COUNTRY_CODE.toLowerCase();
                    $scope.BIND_PHONE_CALENDAR_Fn('Countryphone', resultiso2, 3);
                } else {
                    $scope.BIND_PHONE_CALENDAR_Fn('Countryphone', $scope.$parent.TWO_DIGIT_COUNTRY_CODE.toLowerCase(), 3);
                }
                $scope.OrignalData = angular.copy($scope.PrimaryDetails);
            }
            else if (data.data == null) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
            else {
                // $scope.PrimaryDetails.COUNTRY_ID = $cookies.get("COUNTRY_ID");
                //$scope.DEFAULT_COUNTRY_Fn($scope.PrimaryDetails);
                var EntityCountryDtls = $scope.NATIONALITY_LIST.filter(function (x) { return x.COUNTRY_ID == $cookies.get("COUNTRY_ID"); });
                if (EntityCountryDtls.length > 0) {
                    $scope.SELECTED_COUNTRY_Fn(EntityCountryDtls[0]);
                    $scope.BIND_PHONE_CALENDAR_Fn('primaryphone', EntityCountryDtls[0].TWO_DIGIT_COUNTRY_CODE.toLowerCase(), 1);
                    $scope.BIND_PHONE_CALENDAR_Fn('secondaryphone', EntityCountryDtls[0].TWO_DIGIT_COUNTRY_CODE.toLowerCase(), 2);
                    $scope.BIND_PHONE_CALENDAR_Fn('Countryphone', EntityCountryDtls[0].TWO_DIGIT_COUNTRY_CODE.toLowerCase(), 3);
                }
                else {
                    $scope.SELECTED_COUNTRY_Fn('');
                    $scope.BIND_PHONE_CALENDAR_Fn('primaryphone', $scope.$parent.TWO_DIGIT_COUNTRY_CODE.toLowerCase(), 1);
                    $scope.BIND_PHONE_CALENDAR_Fn('secondaryphone', $scope.$parent.TWO_DIGIT_COUNTRY_CODE.toLowerCase(), 2);
                    $scope.BIND_PHONE_CALENDAR_Fn('Countryphone', $scope.$parent.TWO_DIGIT_COUNTRY_CODE.toLowerCase(), 3);
                }
                $scope.OrignalData = angular.copy($scope.PrimaryDetails);
                $scope.HRM_GET_STUDENT_LOAN_PLAN();
                $scope.SELECTED_TITLE_Fn('');
            }
        });
    }
    $scope.DOB_CHANGE_RESULT = function () {
        $scope.GET_AGE_Fn(moment($scope.PrimaryDetails.DOB, "DD/MM/YYYY").toDate());

    }
    $scope.dateinputdateofbirth = function () {
        $(document).ready(function () {
            var date_inputs = document.getElementsByClassName("dateofbirth") //our date input has the name "date"
            if (date_inputs.length > 0) {
                for (var i = 0; i < date_inputs.length; i++) {
                    var date_input = $('input[name="' + date_inputs[i].name + '"]'); //our date input has the name "date"
                    var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
                    // var date = new Date();
                    var options = {
                        todayBtn: "linked",
                        daysOfWeekHighlighted: "0,6",
                        autoclose: true,
                        todayHighlight: false,
                        //format: $scope.$parent.DATE_FORMATE,
                        format: 'dd/mm/yyyy',
                        clearBtn: true,
                        //endDate: "today",
                        // minDate: '-30Y',
                        endDate: '-5Y',
                        closeBtn: true,// close button visible
                        //  startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate())

                    };
                    date_input.datepicker(options).on("hide", function (e) {
                        if ($scope.PrimaryDetails.DOB != undefined && $scope.PrimaryDetails.DOB != '' && $scope.PrimaryDetails.DOB != null) {
                            var dateString = e.date;
                            var a = (moment(dateString, "DD/MM/YYYY").toDate());
                            var date1 = moment().subtract(5, 'years');
                            var date2 = moment(date1).subtract(100, 'years');
                            var SY = new Date(e.date).getFullYear();
                            var D2Y = new Date(date2).getFullYear();
                            if (SY <= D2Y) {
                                $scope.ShowAlertBox('Error', 'Please select valid date format', 3000);
                                date_input.datepicker('clearDates');
                            };
                            if (moment(dateString, "DD/MM/YYYY").toDate() >= date1) {
                                $scope.ShowAlertBox('Error', 'Your age should be more than 5 Years.', 3000);
                                date_input.datepicker('clearDates');
                            };
                            $scope.GET_AGE_Fn(a);
                            $scope.$apply();
                        }
                    })
                }
            }
        });
    }
    $scope.GET_AGE_Fn = function (dateString) {
        //var birthDate = moment(dateString).format("DD/MM/YYYY");
        var ageInYears = moment().diff(moment(dateString), 'years');
        var ageInMonths = moment().diff(moment(dateString).add(ageInYears, 'years'), 'months');
        if (isNaN(ageInYears) || isNaN(ageInMonths)) {
            $scope.AGE_FORMAT = "0 years, 0 months";
        }
        else {
            $scope.AGE_FORMAT = ageInYears + " years," + ageInMonths + " months";
        }

    }
    $scope.ADMIN_GET_COUNTRY = function () {
        var UserModelObj = new Object();
        PrcCommMethods.ADMIN_API(UserModelObj, 'GET_COUNTRY').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.NATIONALITY_LIST = data.data.Table;

                $scope.HRM_GET_EMPLOYEE_PERSONAL();
            }
            else if (data.data == null) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
        });
    }
    $scope.ADMIN_GET_COUNTRY();

    $scope.UPLOAD_FILES = function (FOLDER_NAME, INDEX, FILE) {
        let path = FOLDER_NAME;
        if ($scope.PrimaryDetails.PROFILE_PIC_PATH_COPY != "" && $scope.PrimaryDetails.PROFILE_PIC_PATH_COPY != null && $scope.PrimaryDetails.PROFILE_PIC_PATH_COPY != undefined) {
            let resultath = $scope.PrimaryDetails.PROFILE_PIC_PATH_COPY.split('/')
            path = resultath[2];
        }
        if (parseInt(getUrlParameter('EMP_ID', $location.absUrl())) > 0) {
            path = '/PROFILE_UPLOAD/EMPLY_PRSNL_ID_' + parseInt(getUrlParameter('EMP_ID', $location.absUrl())) + "/";
        }
        var data = new FormData();
        data.append("CUSTOMER_ID", $scope.PrimaryDetails.CUSTOMER_ID); /// Use for old
        data.append("FILE_PATH", path);
        data.append("file", FILE);
        data.append("GUID", 1);

        //data.append("USER_ID", 3157);
        //data.append("CUSTOMER_ID", 360);
        //data.append("ENTITY_ID", 593);
        //data.append("EMPLY_PRSNL_ID", 1921);
        //data.append("BRANCH_ID", 491);
        //data.append("UPLOAD_TYPE_ID", -1);
        //for (var i in $scope.Files) {
        //    data.append("file", $scope.Files[i]);
        //}
        var _api_path = CommService.GET_HUMANRESOURCE_API() + "api/HumanResourceAPI/UPLOAD_FILE";
        // var _api_path = CommService.GET_HUMANRESOURCE_API() + "api/HumanResourceAPI/ONLY_FILES_UPLOAD";
        var request = { method: 'POST', url: _api_path, data: data, headers: { 'Content-Type': undefined } };
        $http(request).then(function (d) {
            if (FOLDER_NAME == 'PROFILE_UPLOAD') {
                $scope.PrimaryDetails.PROFILE_PIC_PATH = "";
                $scope.PrimaryDetails.PROFILE_PIC_PATH = d.data;
                $scope.PrimaryDetails.DISPLAY_PROFILE_PIC_PATH = d.data;
                $scope.WATCH_GROUP_Fn('PROFILE_PIC_PATH');
                $('.item-img').val('');
                $('.cr-slider-wrap p').remove();
                $('#cropImagePop').modal('hide');

            }
        });
    };
    $scope.HRM_CLICK_EFFICTIVE_DATE = function () {
        $scope.EffectiveForm.submitted = true;
        if ($scope.EffectiveForm.$valid) {
            $scope.HRM_CHECK_EMPLOYEE_NUMBER($scope.REDIRECTION_FLAG, 1);
        }
    }
    $scope.HRM_EMPLOYEE_GET_UPCOMING_HISTORY_UPDATES_POPUP = function (_flag) {
        $scope.$parent.POP_EFFECTIVE_TAB_Fn(1);
        $scope.POP_EMPLOYEE_GET_UPCOMING_UPDATES_LIST = [];
        $scope.POP_EMPLOYEE_HISTORY_HEADERS_LIST = [];

        var personaldetailobj = new Object()
        personaldetailobj.EMPLY_PRSNL_ID = $scope.PrimaryDetails.EMPLY_PRSNL_ID;
        personaldetailobj.STEP_NO = 1;
        personaldetailobj.ENTITY_ID = $cookies.get("ENTITY_ID");
        personaldetailobj.EFFECTIVE_DATE = moment($scope.PrimaryDetails.EFFECTIVE_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).format('L');
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
    $scope.HRM_CHECK_EMPLOYEE_NUMBER = function (FLAG, EFFECTIVE_FLAG) {
        $scope.REDIRECTION_FLAG = FLAG;
        if ($scope.EDIT_STEP_NO == 9 && EFFECTIVE_FLAG == undefined) {
            $scope.primaryForm.submitted = true;
            if ($scope.primaryForm.$valid) {
                if ($scope.PrimaryDetails.EFFECTIVE_DATE == undefined || $scope.PrimaryDetails.EFFECTIVE_DATE == null || $scope.PrimaryDetails.EFFECTIVE_DATE == '') {
                    $scope.PrimaryDetails.EFFECTIVE_DATE = moment($scope.CURRENT_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).format($scope.$parent.CONVERSION_DATE_FORMAT);
                }
                $scope.$parent.EFFECTIVE_DATE_PICKER($scope.PrimaryDetails.LOCK_DATE);
                $scope.HRM_EMPLOYEE_GET_UPCOMING_HISTORY_UPDATES_POPUP();
            }
            else {
                $scope.$parent.ShowAlertBox("Attention", $scope.$parent.MANDATORY_MSG, 3000);
            }
        }
        else {
            $scope.primaryForm.submitted = true;
            if ($scope.primaryForm.$valid) {
                var personaldetailobj = new Object()
                personaldetailobj.CUSTOMER_ID = $scope.PrimaryDetails.CUSTOMER_ID;
                personaldetailobj.EMPLY_PRSNL_ID = $scope.PrimaryDetails.EMPLY_PRSNL_ID;
                personaldetailobj.EMPLOYEE_NUMBER = $scope.PrimaryDetails.EMPLOYEE_NUMBER;
                personaldetailobj.EMAIL = $scope.PrimaryDetails.EMAIL;
                personaldetailobj.SORT_CODE = $scope.PrimaryDetails.SORT_CODE;
                personaldetailobj.ACCOUNT_NUMBER = $scope.PrimaryDetails.ACCOUNT_NUMBER;
                personaldetailobj.COUNTRY_ID = $scope.PrimaryDetails.COUNTRY_ID;
                personaldetailobj.ENTITY_ID = $cookies.get("ENTITY_ID");
                PrcCommMethods.HUMANRESOURCE_API(personaldetailobj, 'HRM_CHECK_EMPLOYEE_NUMBER').then(function (data) {
                    var count = 0;
                    if (data.data.RESPONSE_CONTENT != null) {
                        $scope.BANK_DETAILS = JSON.parse(data.data.RESPONSE_CONTENT);
                        if ($scope.PrimaryDetails.COUNTRY_ID == 225) {
                            if ($scope.BANK_DETAILS == null) {
                                $scope.$parent.ShowAlertBox('Error', $scope.SOMETHINGWENTWRONG, 3000);
                                count = 1;
                            }
                            else if ($scope.BANK_DETAILS.resultCode == "01") {

                            }
                            else if ($scope.BANK_DETAILS.resultCode == "03") {
                                $scope.$parent.ShowAlertBox('Error', 'Your license has expired.', 3000);
                                count = 1;
                            }
                            else {
                                $scope.$parent.ShowAlertBox('Error', 'Sortcode and Bank Account are not valid', 3000);
                                count = 1;
                            }
                        }
                    }
                    var resultCheck = data.data.VALITAION.split(':;:')
                    if (resultCheck.length > 0) {
                        ///   parseInt(_loop_value.SETTING_VALUE) == 1(false) mean manual and zero(true) for auto generate
                        if ($scope.PrimaryDetails.AUTO_MANUAL_GENERATE == false && resultCheck[0] == 1 && resultCheck[1] == 1) {
                            //$scope.HRM_INS_UPD_EMPLOYEE_PERSONAL(FLAG);
                        } else if ($scope.PrimaryDetails.AUTO_MANUAL_GENERATE && resultCheck[1] == 1) {
                            //$scope.HRM_INS_UPD_EMPLOYEE_PERSONAL(FLAG);
                        }
                        else {
                            if (resultCheck[0] == -1) {
                                $scope.$parent.ShowAlertBox("Error", " employee number already exist,please add  valid employee number", 3000);
                                count = 1;
                            }
                            if (resultCheck[1] == -1) {
                                $scope.$parent.ShowAlertBox("Error", "email id already exist, please add  unqiue email id  ", 3000);
                                count = 1;
                            }
                        }
                    }
                    if (count == 0) {
                        $scope.HRM_INS_UPD_EMPLOYEE_PERSONAL(FLAG);
                    }
                });
            }
            else {
                $scope.$parent.ShowAlertBox("Attention", $scope.$parent.MANDATORY_MSG, 3000);
            }
        }
    }

    $scope.HRM_INS_UPD_EMPLOYEE_PERSONAL = function (FLAG) {
        $scope.primaryForm.submitted = true;
        if ($scope.primaryForm.$valid) {
            $scope.WATCH_GROUP_Fn('DOB', 1);
            let primary_phone_number_result = primary_phone_number.getSelectedCountryData();
            let primarymobile_code = primary_phone_number_result.areaCodes != null && primary_phone_number_result.areaCodes.length > 0 ? ('+' + primary_phone_number_result.dialCode) + '-' + primary_phone_number_result.areaCodes[0] : '+' + primary_phone_number_result.dialCode;
            let secoundary_phone_number_result = secoundary_phone_number.getSelectedCountryData();
            let secoundarymobile_code = secoundary_phone_number_result.areaCodes != null && secoundary_phone_number_result.areaCodes.length > 0 ? ('+' + primary_phone_number_result.dialCode) + '-' + secoundary_phone_number_result.areaCodes[0] : '+' + secoundary_phone_number_result.dialCode;
            let emergency_phone_number_result = phone_number.getSelectedCountryData();
            let emergencymobile_code = emergency_phone_number_result.areaCodes != null && emergency_phone_number_result.areaCodes.length > 0 ? ('+' + emergency_phone_number_result.dialCode) + '-' + emergency_phone_number_result.areaCodes[0] : '+' + emergency_phone_number_result.dialCode;

            var primary_phonne_dtls = $scope.NATIONALITY_LIST.filter(function (x) { return x.MOBILE_CODE == primarymobile_code && x.TWO_DIGIT_COUNTRY_CODE.toLowerCase() == primary_phone_number_result.iso2 });
            var secoundary_phonne_dtls = $scope.NATIONALITY_LIST.filter(function (x) { return x.MOBILE_CODE == secoundarymobile_code && x.TWO_DIGIT_COUNTRY_CODE.toLowerCase() == secoundary_phone_number_result.iso2 });
            var emergency_phonne_dtls = $scope.NATIONALITY_LIST.filter(function (x) { return x.MOBILE_CODE == emergencymobile_code && x.TWO_DIGIT_COUNTRY_CODE.toLowerCase() == emergency_phone_number_result.iso2 });
            // primary_phonne_dtls.length > 0 ? ($scope.EDIT_STEP_NO == 9 && !$scope.fieldChanges.COUNTRY_ID ? null : primary_phonne_dtls[0].COUNTRY_ID) : null;// $scope.PrimaryDetails.PRIMARY_PHONE_CODE_ID;//pending
            if (primary_phonne_dtls.length > 0) {
                if ($scope.EDIT_STEP_NO == 9) {
                    $scope.PrimaryDetails.PRIMARY_PHONE_CODE_ID = primary_phonne_dtls[0].COUNTRY_ID;
                    $scope.WATCH_GROUP_Fn('PRIMARY_PHONE_CODE_ID');
                }
                else {
                    $scope.PrimaryDetails.PRIMARY_PHONE_CODE_ID = primary_phonne_dtls[0].COUNTRY_ID;
                }
            }
            else {
                $scope.PrimaryDetails.PRIMARY_PHONE_CODE_ID = null
            };
            if (secoundary_phonne_dtls.length > 0) {
                if ($scope.EDIT_STEP_NO == 9) {
                    $scope.PrimaryDetails.SECONDARY_PHONE_CODE_ID = secoundary_phonne_dtls[0].COUNTRY_ID;
                    $scope.WATCH_GROUP_Fn('SECONDARY_PHONE_CODE_ID');
                }
                else {
                    $scope.PrimaryDetails.SECONDARY_PHONE_CODE_ID = secoundary_phonne_dtls[0].COUNTRY_ID;
                }
            }
            else {
                $scope.PrimaryDetails.SECONDARY_PHONE_CODE_ID = null
            };
            if (emergency_phonne_dtls.length > 0) {
                if ($scope.EDIT_STEP_NO == 9) {
                    $scope.PrimaryDetails.EMERGENCY_PHONE_CODE_ID = emergency_phonne_dtls[0].COUNTRY_ID;
                    $scope.WATCH_GROUP_Fn('EMERGENCY_PHONE_CODE_ID');
                }
                else {
                    $scope.PrimaryDetails.EMERGENCY_PHONE_CODE_ID = emergency_phonne_dtls[0].COUNTRY_ID;
                }
            }
            else {
                $scope.PrimaryDetails.EMERGENCY_PHONE_CODE_ID = null
            };
            var personaldetailobj = new Object()
            personaldetailobj.EMPLY_PRSNL_ID = $scope.PrimaryDetails.EMPLY_PRSNL_ID;
            personaldetailobj.ENTITY_ID = $scope.PrimaryDetails.ENTITY_ID;
            personaldetailobj.CUSTOMER_ID = $scope.PrimaryDetails.CUSTOMER_ID;
            personaldetailobj.USER_ID = $scope.PrimaryDetails.USER_ID;
            personaldetailobj.PROFILE_PIC_PATH = $scope.EDIT_STEP_NO == 9 && !$scope.fieldChanges.PROFILE_PIC_PATH ? null : $scope.PrimaryDetails.PROFILE_PIC_PATH;
            if ($scope.PrimaryDetails.PROFILE_PIC_PATH == undefined || $scope.PrimaryDetails.PROFILE_PIC_PATH == null || $scope.PrimaryDetails.PROFILE_PIC_PATH == "") {
                personaldetailobj.PROFILE_PIC_PATH = '';
            }
            else {
                personaldetailobj.PROFILE_PIC_PATH = $scope.EDIT_STEP_NO == 9 && !$scope.fieldChanges.PROFILE_PIC_PATH ? null : $scope.PrimaryDetails.PROFILE_PIC_PATH;
            }
            personaldetailobj.FIRST_NAME = $scope.EDIT_STEP_NO == 9 && !$scope.fieldChanges.FIRST_NAME ? null : $scope.PrimaryDetails.FIRST_NAME;
            personaldetailobj.MIDDLE_NAME = $scope.EDIT_STEP_NO == 9 && !$scope.fieldChanges.MIDDLE_NAME ? null : $scope.PrimaryDetails.MIDDLE_NAME;
            personaldetailobj.LAST_NAME = $scope.EDIT_STEP_NO == 9 && !$scope.fieldChanges.LAST_NAME ? null : $scope.PrimaryDetails.LAST_NAME;

            personaldetailobj.NATIONALITY_ID = $scope.EDIT_STEP_NO == 9 && !$scope.fieldChanges.NATIONALITY_ID ? null : $scope.PrimaryDetails.NATIONALITY_ID;
            personaldetailobj.KNOWN_AS = $scope.EDIT_STEP_NO == 9 && !$scope.fieldChanges.KNOWN_AS ? null : $scope.PrimaryDetails.KNOWN_AS;
            personaldetailobj.GENDER_ID = $scope.EDIT_STEP_NO == 9 && !$scope.fieldChanges.GENDER_ID ? null : $scope.PrimaryDetails.GENDER_ID;

            personaldetailobj.DOB = $scope.EDIT_STEP_NO == 9 && !$scope.fieldChanges.DOB ? null : moment($scope.PrimaryDetails.DOB, "DD/MM/YYYY").format('L');
            personaldetailobj.NI_NUMBER = $scope.EDIT_STEP_NO == 9 && !$scope.fieldChanges.NI_NUMBER ? null : $scope.PrimaryDetails.NI_NUMBER;
            personaldetailobj.EMPLOYEE_NUMBER = $scope.EDIT_STEP_NO == 9 && !$scope.fieldChanges.EMPLOYEE_NUMBER ? null : $scope.PrimaryDetails.EMPLOYEE_NUMBER;
            personaldetailobj.TAX_ID = $scope.EDIT_STEP_NO == 9 && !$scope.fieldChanges.TAX_ID ? null : $scope.PrimaryDetails.TAX_ID;

            personaldetailobj.SHARE_CODE = $scope.EDIT_STEP_NO == 9 && !$scope.fieldChanges.SHARE_CODE ? null : $scope.PrimaryDetails.SHARE_CODE;

            personaldetailobj.PRIMARY_PHONE_CODE_ID = $scope.EDIT_STEP_NO == 9 && !$scope.fieldChanges.PRIMARY_PHONE_CODE_ID ? null : $scope.PrimaryDetails.PRIMARY_PHONE_CODE_ID;
            // $scope.PrimaryDetails.PRIMARY_PHONE_CODE_ID;//pending
            personaldetailobj.PRIMARY_PHONE = $scope.EDIT_STEP_NO == 9 && !$scope.fieldChanges.PRIMARY_PHONE_TEXT ? null : $scope.PrimaryDetails.PRIMARY_PHONE_TEXT;

            personaldetailobj.SECONDARY_PHONE_CODE_ID = $scope.EDIT_STEP_NO == 9 && !$scope.fieldChanges.SECONDARY_PHONE_CODE_ID ? null : $scope.PrimaryDetails.SECONDARY_PHONE_CODE_ID;// $scope.PrimaryDetails.SECONDARY_PHONE_CODE_ID;//pending
            personaldetailobj.SECONDARY_PHONE = $scope.EDIT_STEP_NO == 9 && !$scope.fieldChanges.SECONDARY_PHONE_TEXT ? null : $scope.PrimaryDetails.SECONDARY_PHONE_TEXT;
            personaldetailobj.EMAIL = $scope.EDIT_STEP_NO == 9 && !$scope.fieldChanges.EMAIL ? null : $scope.PrimaryDetails.EMAIL;

            personaldetailobj.EMERGENCY_CONTACT_NAME = $scope.EDIT_STEP_NO == 9 && !$scope.fieldChanges.EMERGENCY_CONTACT_NAME ? null : $scope.PrimaryDetails.EMERGENCY_CONTACT_NAME;
            personaldetailobj.EMERGENCY_CONTACT_RELATION == $scope.EDIT_STEP_NO == 9 && !$scope.fieldChanges.EMERGENCY_CONTACT_NAME ? null : $scope.PrimaryDetails.EMERGENCY_CONTACT_RELATION;
            personaldetailobj.EMERGENCY_PHONE_CODE_ID = $scope.EDIT_STEP_NO == 9 && !$scope.fieldChanges.EMERGENCY_PHONE_CODE_ID ? null : $scope.PrimaryDetails.EMERGENCY_PHONE_CODE_ID; /// $scope.PrimaryDetails.EMERGENCY_PHONE_CODE_ID;

            personaldetailobj.EMERGENCY_PHONE_NUMBER = $scope.EDIT_STEP_NO == 9 && !$scope.fieldChanges.EMERGENCY_PHONE_NUMBER_TEXT ? null : $scope.PrimaryDetails.EMERGENCY_PHONE_NUMBER_TEXT;
            personaldetailobj.ADDRESS_LINE1 = $scope.EDIT_STEP_NO == 9 && !$scope.fieldChanges.ADDRESS_LINE1 ? null : $scope.PrimaryDetails.ADDRESS_LINE1;
            personaldetailobj.ADDRESS_LINE2 = $scope.EDIT_STEP_NO == 9 && !$scope.fieldChanges.ADDRESS_LINE2 ? null : $scope.PrimaryDetails.ADDRESS_LINE2;

            personaldetailobj.CITY = $scope.EDIT_STEP_NO == 9 && !$scope.fieldChanges.CITY ? null : $scope.PrimaryDetails.CITY;
            personaldetailobj.COUNTY = $scope.EDIT_STEP_NO == 9 && !$scope.fieldChanges.COUNTY ? null : $scope.PrimaryDetails.COUNTY;
            personaldetailobj.COUNTRY_ID = $scope.EDIT_STEP_NO == 9 && !$scope.fieldChanges.COUNTRY_ID ? null : $scope.PrimaryDetails.COUNTRY_ID;

            personaldetailobj.POSTAL_CODE = $scope.EDIT_STEP_NO == 9 && !$scope.fieldChanges.POSTAL_CODE ? null : $scope.PrimaryDetails.POSTAL_CODE;
            personaldetailobj.ACCOUNT_HOLDER_NAME = $scope.EDIT_STEP_NO == 9 && !$scope.fieldChanges.ACCOUNT_HOLDER_NAME ? null : $scope.PrimaryDetails.ACCOUNT_HOLDER_NAME;
            personaldetailobj.ACCOUNT_NUMBER = $scope.EDIT_STEP_NO == 9 && !$scope.fieldChanges.ACCOUNT_NUMBER ? null : $scope.PrimaryDetails.ACCOUNT_NUMBER;

            personaldetailobj.SORT_CODE = $scope.EDIT_STEP_NO == 9 && !$scope.fieldChanges.SORT_CODE ? null : $scope.PrimaryDetails.SORT_CODE;
            personaldetailobj.BANK_NAME = $scope.EDIT_STEP_NO == 9 && !$scope.fieldChanges.BANK_NAME ? null : $scope.PrimaryDetails.BANK_NAME;
            personaldetailobj.COMMENTS = $scope.PrimaryDetails.EFFECTIVE_COMMENTS;

            personaldetailobj.EFFECTIVE_DATE = $scope.PrimaryDetails.EFFECTIVE_DATE == "" || $scope.PrimaryDetails.EFFECTIVE_DATE == undefined ? null : moment($scope.PrimaryDetails.EFFECTIVE_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).format('L');
            ///   parseInt(_loop_value.SETTING_VALUE) == 1 mean manual and zero for auto generate
            personaldetailobj.SETTING_48 = $scope.PrimaryDetails.AUTO_MANUAL_GENERATE ? 0 : 1 //--0 FOR AUTO GENERATE
            personaldetailobj.SETTING_83 = $scope.PrimaryDetails.AUTO_GENERATE_PREFIX_NO;

            personaldetailobj.STUDENT_LOAN_MASTER_ID = $scope.EDIT_STEP_NO == 9 && $scope.fieldChanges.STUDENT_LOAN_MASTER_ID && $scope.PrimaryDetails.CUSTOM_STUDENT_LOAN_NAME == $scope.PrimaryDetails.DD_DEFAULT_TEXT ? -1 : $scope.EDIT_STEP_NO == 9 && !$scope.fieldChanges.STUDENT_LOAN_MASTER_ID ? null : $scope.PrimaryDetails.STUDENT_LOAN_MASTER_ID;
            personaldetailobj.STUDENT_LOAN = $scope.EDIT_STEP_NO == 9 && !$scope.fieldChanges.STUDENT_LOAN_TYPE ? null : $scope.PrimaryDetails.STUDENT_LOAN_TYPE;
            personaldetailobj.TITLE = $scope.EDIT_STEP_NO == 9 && !$scope.fieldChanges.TITLE_NAME ? null : $scope.PrimaryDetails.TITLE_NAME;

            if ($scope.POP_EMPLOYEE_HISTORY_HEADERS_LIST != undefined && $scope.POP_EMPLOYEE_HISTORY_HEADERS_LIST.length > 0) {
                personaldetailobj.TABLE_ID_LIST = [];
                angular.forEach($scope.POP_EMPLOYEE_HISTORY_HEADERS_LIST, function (_History_value) {
                    var readOnly = new Object();
                    readOnly.TABLE_ID = _History_value.HISTORY_HEADER_ID;
                    personaldetailobj.TABLE_ID_LIST.push(readOnly);
                });
                PrcCommMethods.HUMANRESOURCE_API(personaldetailobj, 'HRM_EMPLOYEE_UPD_BACKDATED_CHANGE').then(function (data) { });
            }
            PrcCommMethods.HUMANRESOURCE_API(personaldetailobj, 'HRM_INS_UPD_EMPLOYEE_PERSONAL').then(function (data) {
                if (data.data > 0) {
                    if ($scope.PrimaryDetails.EMPLY_PRSNL_ID > 0) {
                        $scope.$parent.ShowAlertBox("Success", 'Personal details updated successfully', 3000);
                    }
                    else {
                        $scope.$parent.ShowAlertBox("Success", 'Personal details saved successfully', 3000);
                    }
                    if (parseInt(getUrlParameter('EMP_ID', $location.absUrl())) == parseInt($cookies.get("EMPLY_PRSNL_ID"))) {
                        let IMAGE_PATH = "";
                        //if ($scope.PrimaryDetails.PROFILE_PIC_PATH == undefined || $scope.PrimaryDetails.PROFILE_PIC_PATH == null || $scope.PrimaryDetails.PROFILE_PIC_PATH == "") {
                        //    IMAGE_PATH = "../dist/img/user1-128x128.jpg";
                        //}
                        //else {
                        //    IMAGE_PATH = $scope.PrimaryDetails.PROFILE_PIC_PATH;
                        //}
                        IMAGE_PATH = $scope.PrimaryDetails.PROFILE_PIC_PATH;
                        $cookies.put('IMAGE_PATH', IMAGE_PATH, { 'path': '/' });
                        $scope.$parent.IMAGE_PATH = IMAGE_PATH;
                    };
                    if (FLAG == 1) {
                        $scope.TAB_CLICK_HR_HEADER_Fn(0, data.data);
                    }
                    else if ($scope.EDIT_STEP_NO == 9) {
                        $location.path('EmploymentInfo').search("EMP_ID", data.data).search('STEP_NO', $scope.EDIT_STEP_NO);
                    }
                    else {
                        $location.path('EmploymentInfo').search("EMP_ID", data.data).search('STEP_NO', 2);
                    }
                }
                if (data.data == 0) {
                    $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                }
            });
        } else {
            $scope.$parent.ShowAlertBox("Attention", $scope.$parent.MANDATORY_MSG, 3000);
        }
    }

    $scope.CLICK_FN = function () {
        let a = { age: 29, name: 'Dionysia' };
        let b = { name: 'Dionysia', age: 29 };

        console.log(_.isEqual(a, b)); // true
    }
    $scope.REMOVE_PROFILE_IMG = function () {
        $scope.PrimaryDetails.PROFILE_PIC_PATH = "";
        $scope.PrimaryDetails.DISPLAY_PROFILE_PIC_PATH = "";
    };
    $scope.isDropdownOpen = true;
    $scope.DEFAULT_COUNTRY_Fn = function (RESULT_PERSNL) {
        $scope.PrimaryDetails.SHOW_HIDE_COUNTY = true;
        $scope.PrimaryDetails.SORT_CODE_LABEL = "Sort Code";
        $scope.PrimaryDetails.COUNTY_NAME = "State";
        $scope.PrimaryDetails.ACCOUNT_NUMBER_LABEL = "Account Number";
        // $scope.PrimaryDetails.SHOW_HIDE_NI_NUMBER = true;
        $scope.ACCOUNT_NUMBER_LABEL_DIRECTIVE = "";
        $scope.SORT_IFSC_CODE_DIRECTIVE = "";
        if (RESULT_PERSNL.COUNTRY_ID == 187 || RESULT_PERSNL.COUNTRY_ID == 224 || RESULT_PERSNL.COUNTRY_ID == 117 || RESULT_PERSNL.COUNTRY_ID == 174 || RESULT_PERSNL.COUNTRY_ID == 162 || RESULT_PERSNL.COUNTRY_ID == 19) {
            $scope.PrimaryDetails.POST_CODE = 'PO Box'
            $scope.PrimaryDetails.COUNTY_NAME = '';
            // $scope.PrimaryDetails.SHOW_HIDE_COUNTY = false;
            $scope.PrimaryDetails.SORT_CODE_LABEL = "Labour Card Number";
            $scope.PrimaryDetails.ACCOUNT_NUMBER_LABEL = "IBAN Number";
            //  $scope.PrimaryDetails.SHOW_HIDE_NI_NUMBER = false;
            $scope.PrimaryDetails.SORT_MAX_LENGTH = 34;
            $scope.ACCOUNT_NUMBER_LABEL_DIRECTIVE = /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/;
        }
        else if (RESULT_PERSNL.COUNTRY_ID == 225) {//UK
            $scope.PrimaryDetails.SHOW_HIDE_COUNTY = true;
            $scope.PrimaryDetails.COUNTY_NAME = 'County';
            $scope.PrimaryDetails.POST_CODE = 'Post Code';
            $scope.PrimaryDetails.SORT_MAX_LENGTH = 6;
            $scope.ACCOUNT_NUMBER_LABEL_DIRECTIVE = /^\d{8}$/;
        } else if (RESULT_PERSNL.COUNTRY_ID == 226) {//US
            $scope.PrimaryDetails.SHOW_HIDE_COUNTY = true;
            $scope.PrimaryDetails.POST_CODE = 'Zip Code'
            $scope.PrimaryDetails.COUNTY_NAME = 'State';
            $scope.PrimaryDetails.SORT_CODE_LABEL = "Routing Transit Number";
            $scope.PrimaryDetails.SORT_MAX_LENGTH = 9;
            $scope.ACCOUNT_NUMBER_LABEL_DIRECTIVE = /^\d{6,17}$/;
        } else if (RESULT_PERSNL.COUNTRY_ID == 101) {//India
            $scope.PrimaryDetails.SORT_CODE_LABEL = "IFSC Code";
            $scope.PrimaryDetails.SORT_MAX_LENGTH = 11;
            $scope.ACCOUNT_NUMBER_LABEL_DIRECTIVE = /^\d{6,18}$/;
            $scope.SORT_IFSC_CODE_DIRECTIVE = /^[A-Z]{4}0[A-Z0-9]{6}$/
        } else {
            $scope.PrimaryDetails.SORT_CODE_LABEL = "Branch Number";
            $scope.PrimaryDetails.SORT_MAX_LENGTH = 20;
        }
    }
    $scope.SELECTED_TITLE_Fn = function (_param_title, Click_FLAG) {
        if (_param_title == '') {
            $scope.PrimaryDetails.CUSTOM_TITLE_NAME = $scope.PrimaryDetails.DD_DEFAULT_TEXT;
            $scope.PrimaryDetails.TITLE_NAME = ''
        }
        else {
            $scope.PrimaryDetails.CUSTOM_TITLE_NAME = _param_title.NAME;
            $scope.PrimaryDetails.TITLE_NAME = _param_title.TITLE_ID;
            if (_param_title.TITLE_ID == 'Mr') {
                $scope.SELECTED_GENDER_Fn($scope.GENDER_LIST[0]);
            }
            else {
                $scope.SELECTED_GENDER_Fn($scope.GENDER_LIST[1]);
            }
        }

        if (Click_FLAG == 1) {
            $scope.WATCH_GROUP_Fn('TITLE_NAME');
        }
    }
    $scope.SELECTED_GENDER_Fn = function (_param_gender, click_fag) {
        if (_param_gender == '') {
            $scope.PrimaryDetails.CUSTOM_GENDER_NAME = $scope.PrimaryDetails.DD_DEFAULT_TEXT;
            $scope.PrimaryDetails.GENDER_ID = ''
            $scope.PrimaryDetails.GENDER = '';
        }
        else {
            $scope.PrimaryDetails.CUSTOM_GENDER_NAME = _param_gender.GENDER;
            $scope.PrimaryDetails.GENDER = _param_gender.GENDER; // for upcomming update
            $scope.PrimaryDetails.GENDER_ID = _param_gender.GENDER_ID;
        }
        if (click_fag == 1) {
            $scope.WATCH_GROUP_Fn('GENDER_ID');
        }
    }

    $scope.SELECTED_NATIONALITY_Fn = function (_param_nationality, click_flag) {
        if (_param_nationality == '') {
            $scope.PrimaryDetails.CUSTOM_NATIONALITY_NAME = $scope.PrimaryDetails.DD_DEFAULT_TEXT;
            $scope.PrimaryDetails.NATIONALITY_ID = ''
        }
        else {
            $scope.PrimaryDetails.CUSTOM_NATIONALITY_NAME = _param_nationality.NATIONALITY;
            $scope.PrimaryDetails.NATIONALITY_ID = _param_nationality.COUNTRY_ID;
            $scope.PrimaryDetails.DISPLAY_NATIONALITY_TEXT_SEARCH = '';
        }
        $('#divNewNotifications_0').removeClass('show');
        if (click_flag == 1) {
            $scope.WATCH_GROUP_Fn('NATIONALITY_ID');
        }
    }
    $scope.SELECTED_COUNTRY_Fn = function (_param_country, Click_flag) {
        if (_param_country == '') {
            $scope.PrimaryDetails.CUSTOM_COUNTRY_NAME = $scope.PrimaryDetails.DD_DEFAULT_TEXT;
            $scope.PrimaryDetails.COUNTRY_ID = ''
        }
        else {
            $scope.PrimaryDetails.DISPLAY_COUNTRY_TEXT_SEARCH = '';
            $scope.PrimaryDetails.CUSTOM_COUNTRY_NAME = _param_country.COUNTRY_NAME;
            $scope.PrimaryDetails.COUNTRY_ID = _param_country.COUNTRY_ID;
            $scope.PrimaryDetails.POST_CODE = 'Post Code'
            $scope.PrimaryDetails.SHOW_HIDE_COUNTY = true;
            $scope.PrimaryDetails.COUNTY_NAME = 'State';
            $scope.PrimaryDetails.SORT_CODE_LABEL = "Sort Code";
            $scope.PrimaryDetails.ACCOUNT_NUMBER_LABEL = "Account Number";
            $scope.ACCOUNT_NUMBER_LABEL_DIRECTIVE = "";
            $scope.SORT_IFSC_CODE_DIRECTIVE = "";
            if (_param_country.COUNTRY_ID == 187 || _param_country.COUNTRY_ID == 224 || _param_country.COUNTRY_ID == 117 || _param_country.COUNTRY_ID == 174 || _param_country.COUNTRY_ID == 162 || _param_country.COUNTRY_ID == 19) {
                //GCC
                $scope.PrimaryDetails.POST_CODE = 'PO Box'
                $scope.PrimaryDetails.COUNTY_NAME = '';
                $scope.PrimaryDetails.SHOW_HIDE_COUNTY = false;
                $scope.PrimaryDetails.SORT_CODE_LABEL = "Labour Card Number";
                $scope.PrimaryDetails.ACCOUNT_NUMBER_LABEL = "IBAN Number";
                //  $scope.PrimaryDetails.SHOW_HIDE_NI_NUMBER = false;
                $scope.PrimaryDetails.SORT_MAX_LENGTH = 34;
                $scope.ACCOUNT_NUMBER_LABEL_DIRECTIVE = /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/;
            }
            else if (_param_country.COUNTRY_ID == 225) {//UK
                $scope.PrimaryDetails.SHOW_HIDE_COUNTY = true;
                $scope.PrimaryDetails.COUNTY_NAME = 'County';
                $scope.PrimaryDetails.POST_CODE = 'Post Code';
                $scope.PrimaryDetails.SORT_MAX_LENGTH = 6;
                $scope.ACCOUNT_NUMBER_LABEL_DIRECTIVE = /^\d{8}$/;
            } else if (_param_country.COUNTRY_ID == 226) {//US
                $scope.PrimaryDetails.SHOW_HIDE_COUNTY = true;
                $scope.PrimaryDetails.POST_CODE = 'Zip Code'
                $scope.PrimaryDetails.COUNTY_NAME = 'State';
                $scope.PrimaryDetails.SORT_CODE_LABEL = "Routing Transit Number";
                $scope.PrimaryDetails.SORT_MAX_LENGTH = 9;
                $scope.ACCOUNT_NUMBER_LABEL_DIRECTIVE = /^\d{6,17}$/;
            }
            else if (_param_country.COUNTRY_ID == 101) {//India
                $scope.PrimaryDetails.SORT_CODE_LABEL = "IFSC Code";
                $scope.PrimaryDetails.SORT_MAX_LENGTH = 11;
                $scope.ACCOUNT_NUMBER_LABEL_DIRECTIVE = /^\d{6,18}$/;
                $scope.SORT_IFSC_CODE_DIRECTIVE = /^[A-Z]{4}0[A-Z0-9]{6}$/;
            } else {
                $scope.PrimaryDetails.SORT_CODE_LABEL = "Branch Number";
                $scope.PrimaryDetails.SORT_MAX_LENGTH = 20;
            }
        }
        if (Click_flag == 1) {
            $scope.WATCH_GROUP_Fn('COUNTRY_ID');
        }
    }
    $scope.SELECTED_STUDENT_LOAN_Fn = function (_loan, Click_FLag) {
        if (_loan == '') {
            $scope.PrimaryDetails.CUSTOM_STUDENT_LOAN_NAME = $scope.PrimaryDetails.DD_DEFAULT_TEXT;
            $scope.PrimaryDetails.STUDENT_LOAN_NAME = '';
            $scope.PrimaryDetails.STUDENT_LOAN_MASTER_ID = "";
        } else {
            $scope.PrimaryDetails.CUSTOM_STUDENT_LOAN_NAME = _loan.STUDENT_LOAN_PLAN;
            $scope.PrimaryDetails.STUDENT_LOAN_MASTER_ID = _loan.STUDENT_LOAN_MASTER_ID;
        }
        if (Click_FLag == 1) {
            $scope.WATCH_GROUP_Fn('STUDENT_LOAN_MASTER_ID');
        }
    };

    $scope.BIND_PHONE_CALENDAR_Fn = function (DIV_ID_NAME, COUNTRY_ISO2, FLAG) {
        if ($scope.NATIONALITY_LIST.length > 0) {
            if (FLAG == 1) {
                primary_phone_number = window.intlTelInput(document.querySelector("#" + DIV_ID_NAME), {
                    initialCountry: COUNTRY_ISO2,
                    preferredCountries: [COUNTRY_ISO2],
                    //separateDialCode: true,
                    hiddenInput: "full_number",
                    dropdownContainer: document.body,
                    countrySearch: false,
                    nationalMode: true,
                    // strictMode: true,
                    // separateDialCode: false,
                    utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18.1.0/build/js/utils.js",
                });
            }
            if (FLAG == 2) {
                secoundary_phone_number = window.intlTelInput(document.querySelector("#" + DIV_ID_NAME), {
                    initialCountry: COUNTRY_ISO2,
                    // separateDialCode: false,
                    strictMode: true,

                    preferredCountries: [COUNTRY_ISO2],
                    hiddenInput: "full_number",
                    utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18.1.0/build/js/utils.js",
                });
            }
            if (FLAG == 3) {
                phone_number = window.intlTelInput(document.querySelector("#" + DIV_ID_NAME), {
                    initialCountry: COUNTRY_ISO2,
                    // separateDialCode: false,
                    strictMode: true,
                    preferredCountries: [COUNTRY_ISO2],
                    hiddenInput: "full_number",
                    utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18.1.0/build/js/utils.js",
                });
            }
        }
    }

    $scope.POP_CROP_IMG_Fn = function () {
        $('#cropImagePop').modal('show');
    }

    $scope.COPY_TO_CLIPBOARD_Fn = function (data) {
        navigator.clipboard.writeText(data);
    }
    $scope.$on('$viewContentLoaded', function () {
        // $scope.cropImage_Fn();
        $scope.dateinputdateofbirth();
    });

    $scope.focusInput = function (event) {
        //document.getElementById('searchBox').focus();
        //var search = document.getElementById('searchBox');
        //event.target.search.focus();
        //var searchBox = document.getElementById('searchBox');
        //searchBox.focus();  // Focus on the search box
        //searchBox.select();  // Select the text inside the search box
        var inputElement = event.target;
        inputElement.focus(); // This ensures the textbox is focused
    };

    // Optional: Reset the search text when the input loses focus
    $scope.blurInput = function () {
        if ($scope.PrimaryDetails.DISPLAY_NATIONALITY_TEXT_SEARCH === '') {
            console.log("Input field lost focus with no text.");
        }
    };

    $scope.openDropdown = function () {
        var dropdownMenu = document.querySelector('.dropdown-menu');
        var searchInput = document.querySelector('.dropdown-menu input');
        // Open the dropdown programmatically by adding 'show' class (Bootstrap 4)
        dropdownMenu.classList.add('show');
        // Focus on the search input and make the cursor blink
        searchInput.focus();
        // Function to handle focus event
        $scope.onSearchFocus = function () {
            // You can add any custom logic here when the search input is focused
        };
        // Function to handle blur event
        $scope.onSearchBlur = function () {
            // You can add logic for when the search input loses focus
        };
    };

    $scope.imageSrc = null;
    $scope.croppedImage = null;
    let cropper = null;
    // Upload and display image

    $scope.uploadImage = function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                $scope.$apply(() => {
                    $scope.imageSrc = e.target.result;
                });

                // Initialize Cropper.js
                const imageElement = document.getElementById('image');
                if (cropper) cropper.destroy(); // Destroy previous cropper instance
                cropper = new Cropper(imageElement, {
                    aspectRatio: 1,
                    viewMode: 2,
                    center: true,
                    //restore: false,
                    // zoomOnWheel: false,
                    background: false,
                    containWithinAspectRatio: true,
                    //cropBoxResizable: false,
                    minCropBoxWidth: 100,
                    minCropBoxHeight: 100,
                    maxCropBoxWidth: 420,
                    maxCropBoxHeight: 230,
                    minCropBoxWidth: 420,
                    minCropBoxHeight: 230,
                    minContainerWidth: 600,
                    minContainerHeight: 600,
                    modal: true,
                    scalable: true,
                    rotatable: true,
                    checkOrientation: true,
                    // cropBoxResizable: true,
                    dragMode: 'move',
                    minCropBoxWidth: 346,
                    minCropBoxHeight: 269,
                    minContainerHeight: 400,
                    minContainerWidth: 400,
                    minCanvasWidth: 400,
                    minCanvasHeight: 400,
                    responsive: true,
                    dragMode: 'move',
                    //autoCropArea: 1,
                    autoCropArea: 0.8,
                    initialAspectRatio: 1,
                    data: { //define cropbox size
                        width: 240,
                        height: 90,
                    },
                    ready() {
                        //Make the crop box circular
                        //const containerData = cropper.getContainerData();
                        //const imageData = cropper.getImageData();
                        const cropBox = this.cropper.cropper.querySelector('.cropper-view-box');
                        cropBox.style.borderRadius = '50%';

                        //const cropBoxData = cropper.getCropBoxData();
                        //cropBoxData.height = 200; // Fixed height in pixels
                        //cropper.setCropBoxData(cropBoxData);

                        //if (imageData.width > containerData.width || imageData.height > containerData.height) {
                        //    cropper.zoomTo(containerData.width / imageData.naturalWidth); // Scale the image to fit width
                        //}
                        //cropper.setCropBoxData({
                        //    width: 300, // Fixed width
                        //    height: 300, // Fixed height
                        //});

                    },
                });
            };
            reader.readAsDataURL(file);
        }
        $('#cropImagePop').modal('show');
    };
    $scope.CLOSE_UPLOAD_Fn = function () {
        $('.item-img').val('');
        $('.cr-slider-wrap p').remove();
        $('#cropImagePop').modal('hide');
    }
    // Crop the image
    $scope.cropImage = function () {
        if (cropper) {
            //const canvas = cropper.getCroppedCanvas();
            //$scope.croppedImage = canvas.toBlob('image/png');
            cropper.getCroppedCanvas({
                width: 300,  // Optional: Specify output width
                height: 300, // Optional: Specify output height
            }).toBlob((blob) => {
                // Handle the Blob object
                console.log(blob);
                // Example: Create a URL for the Blob and display it
                // const blobUrl = URL.createObjectURL(blob);
                $scope.UPLOAD_FILES('PROFILE_UPLOAD', 1, blob);
                //const imgElement = document.createElement('img');
                //imgElement.src = blobUrl;
                //document.body.appendChild(imgElement);
            }, 'image/png');
        }
    }
    var result
    $scope.setMoveLeftMode = function () {
        if (cropper) {
            cropper.move(-10, 0); // move left
        }
    };
    // Set Crop Mode
    $scope.setCropRightMode = function () {
        if (cropper) {
            cropper.move(10, 0); //  move rigt
        }
    };
    $scope.setMoveUpMode = function () {
        if (cropper) {
            cropper.move(0, -10); //  move up
        }
    };
    // Set Crop Mode
    $scope.setCropDownMode = function () {
        if (cropper) {
            cropper.move(0, 10); //  move down
        }
    };
    $scope.zoomIn = function () {
        if (cropper) {
            cropper.zoom(0.1); // Zoom in by 10%
        }
    };
    // Zoom Out Function
    $scope.zoomOut = function () {
        if (cropper) {
            cropper.zoom(-0.1); // Zoom out by 10%
        }
    };
    let scaleX = 1; // Track horizontal flip state
    let scaleY = 1; // Track vertical flip state
    $scope.ScaleModeX = function () {
        if (cropper) {
            scaleX = scaleX === 1 ? -1 : 1; // Toggle horizontal flip
            cropper.scaleX(scaleX);
        }
    }
    //$scope.flipY = function () {
    //    if (cropper) {
    //        scaleY = scaleY === 1 ? -1 : 1; // Toggle vertical flip
    //        cropper.scaleY(scaleY);
    //    }
    //};
    $scope.ScaleModeY = function () {
        if (cropper) {
            scaleY = scaleY === 1 ? -1 : 1; // Toggle vertical flip
            cropper.scaleY(scaleY);
        }
    }
    $scope.openDropdown = function (val) {
        if (!$scope.EDIT_MODE) {
            var dropdownMenu = document.querySelector('#divNewNotifications_' + val);
            var searchInput = document.querySelector('#divNewNotifications_' + val + ' input');

            // Open the dropdown programmatically by adding 'show' class (Bootstrap 4)
            dropdownMenu.classList.add('show');

            // Focus on the search input and make the cursor blink
            searchInput.focus();
            // Function to handle focus event
            $scope.onSearchFocus = function () {
                // You can add any custom logic here when the search input is focused
            };

            // Function to handle blur event
            $scope.onSearchBlur = function () {
                // You can add logic for when the search input loses focus
            };
        }
    };


    $scope.selectedIndex = -1;
    $scope.selectedCountryIndex = -1;
    $scope.handleKeyDown = function (event) {
        var listLength = $scope.NATIONALITY_LIST.length;
        if (event.key === "ArrowDown") {
            event.preventDefault();
            $scope.selectedIndex = ($scope.selectedIndex + 1) % listLength;
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            $scope.selectedIndex = ($scope.selectedIndex - 1 + listLength) % listLength;
        } else if (event.key === "Enter" && $scope.selectedIndex >= 0) {
            $scope.SELECTED_NATIONALITY_Fn($scope.NATIONALITY_LIST[$scope.selectedIndex]);
        }
    };
    $scope.handleCountryKeyDown = function (event) {
        var listLength = $scope.NATIONALITY_LIST.length;
        if (event.key === "ArrowDown") {
            event.preventDefault();
            $scope.selectedCountryIndex = ($scope.selectedCountryIndex + 1) % listLength;
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            $scope.selectedCountryIndex = ($scope.selectedCountryIndex - 1 + listLength) % listLength;
        } else if (event.key === "Enter" && $scope.selectedCountryIndex >= 0) {
            $scope.SELECTED_COUNTRY_Fn($scope.NATIONALITY_LIST[$scope.selectedCountryIndex]);
        }
    };


    $scope.EFFECTIVE_TAB_Fn = function (FLAG) {
        $scope.EFFECTIVE_TAB = FLAG;
    };
    $scope.EFFECTIVE_TAB_Fn(1);

    $scope.HRM_GET_EMPLOYEE_HISTORY_HEADERS = function (FLAG) {
        if (FLAG == 1) {
            $scope.PrimaryDetails.PAGE_NO = 1;
            $scope.EMPLOYEE_HISTORY_HEADERS_LIST = [];
        }

        var PrimaryDetailsObject = new Object();
        PrimaryDetailsObject.EMPLY_PRSNL_ID = getUrlParameter('EMP_ID', $location.absUrl());
        PrimaryDetailsObject.PAGE_NO = $scope.PrimaryDetails.PAGE_NO;
        PrimaryDetailsObject.PAGE_SIZE = $scope.PrimaryDetails.PAGE_SIZE;
        PrimaryDetailsObject.STEP_NO = 1;
        PrcCommMethods.HUMANRESOURCE_API(PrimaryDetailsObject, 'HRM_GET_EMPLOYEE_HISTORY_HEADERS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.EMPLOYEE_HISTORY_HEADERS_LIST = $scope.EMPLOYEE_HISTORY_HEADERS_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.PrimaryDetails.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.PrimaryDetails.PAGE_NO = parseInt($scope.PrimaryDetails.PAGE_NO) + 1;
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
        var PrimaryDetailsObject = new Object();
        PrimaryDetailsObject.HISTORY_HEADER_ID = _history.HISTORY_HEADER_ID
        PrimaryDetailsObject.STEP_NO = 1;
        PrimaryDetailsObject.EMPLY_PRSNL_ID = getUrlParameter('EMP_ID', $location.absUrl());;
        PrcCommMethods.HUMANRESOURCE_API(PrimaryDetailsObject, 'HRM_GET_EMPLOYEE_HISTORY_DETAILS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.OLD_DATA = angular.copy(data.data.Table[0]);
                $scope.OLD_DATA.PRIMARY_PHONE_TEXT = $scope.OLD_DATA.PRIMARY_PHONE;
                $scope.OLD_DATA.SECONDARY_PHONE_TEXT = $scope.OLD_DATA.SECONDARY_PHONE;
                $scope.OLD_DATA.EMERGENCY_PHONE_NUMBER_TEXT = $scope.OLD_DATA.EMERGENCY_PHONE_NUMBER;
            }
            if (data.data.Table1.length > 0) {
                $scope.NEW_DATA = data.data.Table1[0];
            }
            $('#History_pop').modal('show');
        });
    }
    $scope.HRM_EMPLOYEE_GET_UPCOMING_UPDATES = function () {

        $scope.IS_HISTORY = false;
        var PrimaryDetailsObject = new Object();
        PrimaryDetailsObject.EMPLY_PRSNL_ID = getUrlParameter('EMP_ID', $location.absUrl());
        PrimaryDetailsObject.ENTITY_ID = $cookies.get("ENTITY_ID");
        PrimaryDetailsObject.STEP_NO = 1;
        PrcCommMethods.HUMANRESOURCE_API(PrimaryDetailsObject, 'HRM_EMPLOYEE_GET_UPCOMING_UPDATES').then(function (data) {
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

    $scope.nginitHistorysites = function (_site, index) {
        if ($scope.NEW_DATA.SiteArray[index] != undefined) {
            _site.NEW_DATA = $scope.NEW_DATA.SiteArray[index];
        };
    }

    $scope.HRM_EMPLOYEE_GET_UPCOMING_UPDATE_DETAILS = function (_tabledtls) {
        var PrimaryDetailsObject = new Object();
        PrimaryDetailsObject.UPDATE_TABLE_ID = _tabledtls.UPDATE_TABLE_ID;
        PrimaryDetailsObject.STEP_NO = 1;
        PrcCommMethods.HUMANRESOURCE_API(PrimaryDetailsObject, 'HRM_EMPLOYEE_GET_UPCOMING_UPDATE_DETAILS').then(function (data) {
            if (data.data.Table.length > 0) {
                _tabledtls.UPCOMING_DETAILS = data.data.Table;
                $scope.OLD_DATA = angular.copy($scope.PrimaryDetails);// In upcoming case ;


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
        var PrimaryDetailsObject = new Object();
        PrimaryDetailsObject.UPDATE_TABLE_ID = $scope.SELECTED_UPDATE.UPDATE_TABLE_ID;
        PrimaryDetailsObject.STEP_NO = 1;
        PrimaryDetailsObject.DISCARD_COMMENTS = $scope.DISCARD_COMMENTS;
        PrcCommMethods.HUMANRESOURCE_API(PrimaryDetailsObject, 'HRM_DISCARD_PENDING_UPDATES').then(function (data) {
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
        var PrimaryDetailsObject = new Object();
        PrimaryDetailsObject.UPDATE_TABLE_ID = $scope.SELECTED_UPDATE.UPDATE_TABLE_ID;
        PrimaryDetailsObject.STEP_NO = 1;
        PrimaryDetailsObject.DISCARD_COMMENTS = $scope.DISCARD_COMMENTS;
        PrcCommMethods.HUMANRESOURCE_API(PrimaryDetailsObject, 'HRM_PROCESS_PENDING_UPDATES').then(function (data) {
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
    if ($scope.EDIT_STEP_NO == 9) {
        $scope.HRM_EMPLOYEE_GET_UPCOMING_UPDATES();
        $scope.HRM_GET_EMPLOYEE_HISTORY_HEADERS(1);
    }
    //$scope.$parent.$parent.DATE_INPUT_LOAD();
});