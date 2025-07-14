app.controller('InviteEmergencyDetailsController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {

    //$scope.$parent.DISPLAY_FLAG = false;
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(2);
    $scope.$parent.HIDE_HEADER_DETAIL = false;
    $scope.$parent.$parent.overlay_loading_HR_Loader = 'none';
    $scope.regexPattern = /^[a-zA-Z!@#$%^&*()_+={}[\]:;\"'<>?,./\\|`~ ]+$/;

    $scope.InviteEmergencyDetails = {
        EMPLY_PRSNL_ID: getUrlParameter('EMP_ID', $location.absUrl()),
        CUSTOMER_ID: getUrlParameter('CUS_ID', $location.absUrl()), 
        ENTITY_ID: null,
        MODULE_ID: $cookies.get("MODULE_ID"),
        USER_ID:1,// $cookies.get("USERID"),
        DD_DEFAULT_TEXT: $scope.$parent.DD_DEFAULT_TEXT,
        EMERGENCY_CONTACT_NAME: '',
        EMERGENCY_CONTACT_RELATION: '',
        EMERGENCY_PHONE_CODE_ID: '',
        EMERGENCY_PHONE_NUMBER: '',
        EMERGENCY_PHONE_NUMBER_TEXT:''
    };
    var emergency_phone_number = '';
    $scope.INVITE_APPLICANT_HEADER = {
        ONBOARDING_STEP: 1,
        ACTIVE_TAB_ID: 4
    };
    $scope.ADMIN_GET_COUNTRY = function () {
        var UserModelObj = new Object();
        PrcCommMethods.ADMIN_API(UserModelObj, 'GET_COUNTRY').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.NATIONALITY_LIST = data.data.Table;
                $scope.HRM_GET_ONBOARDING_STEP_4();
            }
            else if (data.data == null) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG + 'while fetching Country!', 3000);
            } else {
                $scope.HRM_GET_ONBOARDING_STEP_4();
            }
        });
    };

    $scope.HRM_GET_EMPLOYEE_STEP = function () {
        var personaldetailobj = new Object()
        personaldetailobj.EMPLY_PRSNL_ID = $scope.InviteEmergencyDetails.EMPLY_PRSNL_ID;
        personaldetailobj.CUSTOMER_ID = $scope.InviteEmergencyDetails.CUSTOMER_ID;
        PrcCommMethods.HUMANRESOURCE_API(personaldetailobj, 'HRM_GET_EMPLOYEE_STEP').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.EMPLOYEE_STEP = data.data.Table[0];
                if ($scope.EMPLOYEE_STEP.ONBOARDING_STEP == null || $scope.EMPLOYEE_STEP.ONBOARDING_STEP == undefined || $scope.EMPLOYEE_STEP.ONBOARDING_STEP == 0) {
                    $scope.INVITE_APPLICANT_HEADER.ONBOARDING_STEP = 1;
                    $scope.INVITE_APPLICANT_HEADER.ACTIVE_TAB_ID = 1;
                    $scope.NEXT_Fn(1);
                } else {
                    $scope.INVITE_APPLICANT_HEADER.ONBOARDING_STEP = $scope.EMPLOYEE_STEP.ONBOARDING_STEP;
                }
            };
        });
    };


    $scope.HRM_GET_ONBOARDING_STEP_4 = function () {
        var UserModelObj = new Object();
        UserModelObj.EMPLY_PRSNL_ID = $scope.InviteEmergencyDetails.EMPLY_PRSNL_ID;
        UserModelObj.CUSTOMER_ID = $scope.InviteEmergencyDetails.CUSTOMER_ID;
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'HRM_GET_ONBOARDING_STEP_4').then(function (data) {
            if (data.data.Table.length > 0) {
                let RESULT_PERSNL = data.data.Table[0];
                $scope.STEP_NO = RESULT_PERSNL.STEP_NO;

                $scope.InviteEmergencyDetails.EMERGENCY_CONTACT_NAME = RESULT_PERSNL.EMERGENCY_CONTACT_NAME;
                $scope.InviteEmergencyDetails.EMERGENCY_CONTACT_RELATION = RESULT_PERSNL.EMERGENCY_CONTACT_RELATION;
                $scope.InviteEmergencyDetails.EMERGENCY_PHONE_NUMBER_TEXT = RESULT_PERSNL.EMERGENCY_PHONE_NUMBER;
                $scope.InviteEmergencyDetails.EMERGENCY_PHONE_CODE_ID = RESULT_PERSNL.EMERGENCY_PHONE_CODE_ID;


                var primary_phonne_resultdtls = $scope.NATIONALITY_LIST.filter(function (x) { return x.COUNTRY_ID == $scope.InviteEmergencyDetails.EMERGENCY_PHONE_CODE_ID });
                if (primary_phonne_resultdtls.length > 0) {
                    var resultiso2 = primary_phonne_resultdtls[0].TWO_DIGIT_COUNTRY_CODE.toLowerCase();
                    $scope.BIND_PHONE_CALENDAR_Fn('emergencyphone', resultiso2, 1);
                }
                else {
                    $scope.BIND_PHONE_CALENDAR_Fn('emergencyphone', 'GB', 1);
                }

            }
            $scope.BIND_PHONE_CALENDAR_Fn('emergencyphone', 'GB', 1);
        });
    };

    $scope.HRM_INS_UPD_ONBOARDING_STEP_4 = function (FLAG) {
        $scope.InviteEmergencyDetailsForm.submitted = true;
        if ($scope.InviteEmergencyDetailsForm.$valid) {

            let emergency_phone_number_result = emergency_phone_number.getSelectedCountryData();
            let emergencymobile_code = emergency_phone_number_result.areaCodes != null && emergency_phone_number_result.areaCodes.length > 0 ? ('+' + emergency_phone_number_result.dialCode) + '-' + emergency_phone_number_result.areaCodes[0] : '+' + emergency_phone_number_result.dialCode;

            var emergencydtls = $scope.NATIONALITY_LIST.filter(function (x) { return x.MOBILE_CODE == emergencymobile_code && x.TWO_DIGIT_COUNTRY_CODE.toLowerCase() == emergency_phone_number_result.iso2 });

            var emergencyDetailsObject = new Object()
            emergencyDetailsObject.EMPLY_PRSNL_ID = $scope.InviteEmergencyDetails.EMPLY_PRSNL_ID;
            emergencyDetailsObject.ENTITY_ID = $scope.InviteEmergencyDetails.ENTITY_ID;
            emergencyDetailsObject.CUSTOMER_ID = $scope.InviteEmergencyDetails.CUSTOMER_ID;
            emergencyDetailsObject.USER_ID = $scope.InviteEmergencyDetails.USER_ID;

            emergencyDetailsObject.EMERGENCY_CONTACT_NAME = $scope.InviteEmergencyDetails.EMERGENCY_CONTACT_NAME;
            emergencyDetailsObject.EMERGENCY_CONTACT_RELATION = $scope.InviteEmergencyDetails.EMERGENCY_CONTACT_RELATION;
            emergencyDetailsObject.EMERGENCY_PHONE_CODE_ID = emergencydtls.length > 0 ? emergencydtls[0].COUNTRY_ID : null;
            emergencyDetailsObject.EMERGENCY_PHONE_NUMBER = $scope.InviteEmergencyDetails.EMERGENCY_PHONE_NUMBER_TEXT;


            PrcCommMethods.HUMANRESOURCE_API(emergencyDetailsObject, 'HRM_INS_UPD_ONBOARDING_STEP_4').then(function (data) {
                if (data.data > 0) {
                    $scope.$parent.ShowAlertBox("Success", 'Data submitted successfully.', 3000);
                    $scope.NEXT_Fn(FLAG,4);
                }
                if (data.data == 0) {
                    $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                }
            });
        } else {
            $scope.$parent.ShowAlertBox("Attention", $scope.$parent.MANDATORY_MSG, 3000);
        }
    }
    $scope.BIND_PHONE_CALENDAR_Fn = function (DIV_ID_NAME, COUNTRY_ISO2, FLAG) {

        if (FLAG == 1) {
            emergency_phone_number = window.intlTelInput(document.querySelector("#" + DIV_ID_NAME), {
                initialCountry: COUNTRY_ISO2,
                separateDialCode: true,
                preferredCountries: [COUNTRY_ISO2],
                hiddenInput: "emergency_phone_number",
                utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18.1.0/build/js/utils.js",
            });
        }

    };
    $scope.NEXT_Fn = function (_page_flag, current_page = 0) {
        if ($scope.EMPLOYEE_STEP.ONBOARDING_STEP >= _page_flag - 1 || current_page + 1 >= _page_flag) {
            $scope.INVITE_APPLICANT_HEADER.ACTIVE_TAB_ID = _page_flag;
            switch (_page_flag) {
                case 1:
                    $location.path("Invite_Personal_Details").search("CUS_ID", getUrlParameter('CUS_ID', $location.absUrl())).search("EMP_ID", getUrlParameter('EMP_ID', $location.absUrl()));
                    break;
                case 2:
                    $location.path("Invite_Contact_Details").search("CUS_ID", getUrlParameter('CUS_ID', $location.absUrl())).search("EMP_ID", getUrlParameter('EMP_ID', $location.absUrl()));
                    break;
                case 3:
                    $location.path("Invite_Other_Details").search("CUS_ID", getUrlParameter('CUS_ID', $location.absUrl())).search("EMP_ID", getUrlParameter('EMP_ID', $location.absUrl()));
                    break;
                case 4:
                    $location.path("Invite_Emergency_Contact").search("CUS_ID", getUrlParameter('CUS_ID', $location.absUrl())).search("EMP_ID", getUrlParameter('EMP_ID', $location.absUrl()));
                    break;
                case 5:
                    $location.path("Invite_Payment_Details").search("CUS_ID", getUrlParameter('CUS_ID', $location.absUrl())).search("EMP_ID", getUrlParameter('EMP_ID', $location.absUrl()));
                    break;
                default:
                    $location.path("#").search("CUS_ID", getUrlParameter('CUS_ID', $location.absUrl())).search("EMP_ID", getUrlParameter('EMP_ID', $location.absUrl()));  }
        } else {
            alert("Please complete each step in order before proceeding!");
        }
    };


    $scope.PAGE_LOAD = 0;
    $scope.HRM_GET_EMPLOYEE_DETAILS_BY_PASSKEY = function () {
        var personaldetailobj = new Object()
        personaldetailobj.PASSKEY = getUrlParameter('passkey', $location.absUrl());
        PrcCommMethods.HUMANRESOURCE_API(personaldetailobj, 'HRM_GET_EMPLOYEE_DETAILS_BY_PASSKEY').then(function (data) {
            if (data.data.Table.length > 0) {
                $location.path("Invite_Emergency_Contact").search("CUS_ID", data.data.Table[0].CUSTOMER_ID).search("EMP_ID", data.data.Table[0].EMPLY_PRSNL_ID);
                $scope.ADMIN_GET_COUNTRY();
                $scope.HRM_GET_EMPLOYEE_STEP();
            }
        });
    }

    $scope.VALIDATE_PASS_KEY = function () {
        var UserModelObj = new Object();
        UserModelObj.PassKey = getUrlParameter('passkey', $location.absUrl());
        UserModelObj.ID = 0;
        UserModelObj.FLAG = 3;
        var httprequest = $http({
            method: 'POST',
            url: CommService.Get_CASHUP_API() + 'api/LoginAPI/VALIDATE_PASS_KEY',
            data: UserModelObj
        }).then(function (data) {
            if (data.data.Table.length > 0) {
                if (data.data.Table[0].SUCCESS == 1) {
                    $scope.LINK_EXPIRE_FLAG = true;
                    $scope.HRM_GET_EMPLOYEE_DETAILS_BY_PASSKEY();
                }
                if (data.data.Table[0].SUCCESS == 0) {
                    $scope.LINK_EXPIRE_FLAG = false;
                }
                $scope.PAGE_LOAD = 1;
            }
        });
    };
    $scope.VALIDATE_PASS_KEY();



})