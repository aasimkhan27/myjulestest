app.controller('InviteContactDetailsController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    //$scope.$parent.DISPLAY_FLAG = false;
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(2);
    $scope.$parent.HIDE_HEADER_DETAIL = false;
    $scope.$parent.$parent.overlay_loading_HR_Loader = 'none';
    $scope.InviteContactDetails = {
        EMPLY_PRSNL_ID: getUrlParameter('EMP_ID', $location.absUrl()),
        CUSTOMER_ID: getUrlParameter('CUS_ID', $location.absUrl()),
        ENTITY_ID: null,
        MODULE_ID: $cookies.get("MODULE_ID"),
        USER_ID: 1,// $cookies.get("USERID"),
        DD_DEFAULT_TEXT: $scope.$parent.DD_DEFAULT_TEXT,
        EMAIL: '',
        PRIMARY_PHONE: '',
        PRIMARY_PHONE_CODE_ID: '',
        PRIMARY_PHONE_TEXT: '',
        POSTAL_CODE: '',
        CITY: '',
        ADDRESS_LINE1: '',
        ADDRESS_LINE2: '',
        COUNTRY_ID: '',
        CUSTOM_COUNTRY_NAME: $scope.$parent.DD_DEFAULT_TEXT,
        POST_CODE_NAME: 'Post Code',
        SHOW_HIDE_COUNTY: true,
        COUNTY_NAME: 'State',
        UK_PINCODE_REG_X: $scope.$parent.UK_PINCODE_REG_X,
        GCC_PINCODE_REG_X: $scope.$parent.GCC_PINCODE_REG_X,
        US_PINCODE_REG_X: $scope.$parent.US_PINCODE_REG_X,
    };
    var primary_phone_number = '';

    $scope.NATIONALITY_LIST = '';
    $scope.INVITE_APPLICANT_HEADER = {
        ONBOARDING_STEP: 1,
        ACTIVE_TAB_ID: 2
    };
    $scope.ADMIN_GET_COUNTRY = function () {
        var UserModelObj = new Object();
        PrcCommMethods.ADMIN_API(UserModelObj, 'GET_COUNTRY').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.NATIONALITY_LIST = data.data.Table;
                $scope.HRM_GET_ONBOARDING_STEP_2();
            }
            else if (data.data == null) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG + 'while fetching Country!', 3000);
            } else {
                $scope.HRM_GET_ONBOARDING_STEP_2();
            }
        });
    };

    $scope.HRM_GET_EMPLOYEE_STEP = function () {
        var contactdetailsobj = new Object()
        contactdetailsobj.EMPLY_PRSNL_ID = $scope.InviteContactDetails.EMPLY_PRSNL_ID;
        contactdetailsobj.CUSTOMER_ID = $scope.InviteContactDetails.CUSTOMER_ID;
        PrcCommMethods.HUMANRESOURCE_API(contactdetailsobj, 'HRM_GET_EMPLOYEE_STEP').then(function (data) {
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
    $scope.HRM_GET_ONBOARDING_STEP_2 = function () {
        var UserModelObj = new Object();
        UserModelObj.EMPLY_PRSNL_ID = $scope.InviteContactDetails.EMPLY_PRSNL_ID;
        UserModelObj.CUSTOMER_ID = $scope.InviteContactDetails.CUSTOMER_ID;
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'HRM_GET_ONBOARDING_STEP_2').then(function (data) {
            if (data.data.Table.length > 0) {
                let RESULT_PERSNL = data.data.Table[0];
                $scope.STEP_NO = RESULT_PERSNL.STEP_NO;

                $scope.InviteContactDetails.EMAIL = RESULT_PERSNL.EMAIL;
                $scope.InviteContactDetails.POSTAL_CODE = RESULT_PERSNL.POSTAL_CODE;
                $scope.InviteContactDetails.CITY = RESULT_PERSNL.CITY;
                $scope.InviteContactDetails.COUNTY = RESULT_PERSNL.COUNTY;
                $scope.InviteContactDetails.ADDRESS_LINE1 = RESULT_PERSNL.ADDRESS_LINE1;
                $scope.InviteContactDetails.ADDRESS_LINE2 = RESULT_PERSNL.ADDRESS_LINE2;
                $scope.InviteContactDetails.PRIMARY_PHONE_CODE_ID = RESULT_PERSNL.PRIMARY_PHONE_CODE_ID;
                $scope.InviteContactDetails.COUNTRY_ID = RESULT_PERSNL.COUNTRY_ID || '';
                $scope.InviteContactDetails.PRIMARY_PHONE_TEXT = RESULT_PERSNL.PRIMARY_PHONE;
                $scope.InviteContactDetails.CUSTOM_COUNTRY_NAME = RESULT_PERSNL.COUNTRY_NAME || $scope.InviteContactDetails.DD_DEFAULT_TEXT;

                $scope.InviteContactDetails.POST_CODE_NAME = 'Post Code';
                $scope.InviteContactDetails.SHOW_HIDE_COUNTY = true;
                $scope.InviteContactDetails.COUNTY_NAME = 'State';
                if (RESULT_PERSNL.COUNTRY_ID == 187 || RESULT_PERSNL.COUNTRY_ID == 224 || RESULT_PERSNL.COUNTRY_ID == 117 || RESULT_PERSNL.COUNTRY_ID == 174 || RESULT_PERSNL.COUNTRY_ID == 162 || RESULT_PERSNL.COUNTRY_ID == 19) { //GCC
                    $scope.InviteContactDetails.POST_CODE_NAME = 'PO Box'
                    $scope.InviteContactDetails.COUNTY_NAME = '';
                    $scope.InviteContactDetails.SHOW_HIDE_COUNTY = false;
                }
                else if (RESULT_PERSNL.COUNTRY_ID == 225) {//UK
                    $scope.InviteContactDetails.SHOW_HIDE_COUNTY = true;
                    $scope.InviteContactDetails.COUNTY_NAME = 'County';
                    $scope.InviteContactDetails.POST_CODE_NAME = 'Post Code'
                } else if (RESULT_PERSNL.COUNTRY_ID == 226) {//US
                    $scope.InviteContactDetails.SHOW_HIDE_COUNTY = true;
                    $scope.InviteContactDetails.POST_CODE_NAME = 'Zip Code'
                    $scope.InviteContactDetails.COUNTY_NAME = 'State';
                }

                var primary_phonne_resultdtls = $scope.NATIONALITY_LIST.filter(function (x) { return x.COUNTRY_ID == $scope.InviteContactDetails.PRIMARY_PHONE_CODE_ID });
                if (primary_phonne_resultdtls.length > 0) {
                    var resultiso2 = primary_phonne_resultdtls[0].TWO_DIGIT_COUNTRY_CODE.toLowerCase();
                    $scope.BIND_PHONE_CALENDAR_Fn('primaryphone', resultiso2, 1);
                }
                else {
                    $scope.BIND_PHONE_CALENDAR_Fn('primaryphone', 'gb', 1);
                }

            } else {
                $scope.BIND_PHONE_CALENDAR_Fn('primaryphone', 'gb', 1);

            }
        });
    };

    $scope.HRM_INS_UPD_ONBOARDING_STEP_2 = function (FLAG) {
        $scope.InviteContactDetailsForm.submitted = true;
        if ($scope.InviteContactDetailsForm.$valid) {


            let primary_phone_number_result = primary_phone_number.getSelectedCountryData();
            let primarymobile_code = primary_phone_number_result.areaCodes != null && primary_phone_number_result.areaCodes.length > 0 ? ('+' + primary_phone_number_result.dialCode) + '-' + primary_phone_number_result.areaCodes[0] : '+' + primary_phone_number_result.dialCode;

            var primary_phonne_dtls = $scope.NATIONALITY_LIST.filter(function (x) { return x.MOBILE_CODE == primarymobile_code && x.TWO_DIGIT_COUNTRY_CODE.toLowerCase() == primary_phone_number_result.iso2 });


            var contactDetailsObject = new Object()
            contactDetailsObject.EMPLY_PRSNL_ID = $scope.InviteContactDetails.EMPLY_PRSNL_ID;
            contactDetailsObject.ENTITY_ID = $scope.InviteContactDetails.ENTITY_ID;
            contactDetailsObject.CUSTOMER_ID = $scope.InviteContactDetails.CUSTOMER_ID;
            contactDetailsObject.USER_ID = $scope.InviteContactDetails.USER_ID;

            contactDetailsObject.EMAIL = $scope.InviteContactDetails.EMAIL;
            contactDetailsObject.PRIMARY_PHONE = $scope.InviteContactDetails.PRIMARY_PHONE_TEXT;
            contactDetailsObject.PRIMARY_PHONE_CODE_ID = primary_phonne_dtls.length > 0 ? primary_phonne_dtls[0].COUNTRY_ID : null;
            contactDetailsObject.POSTAL_CODE = $scope.InviteContactDetails.POSTAL_CODE;
            contactDetailsObject.CITY = $scope.InviteContactDetails.CITY;
            contactDetailsObject.COUNTY = $scope.InviteContactDetails.COUNTY;
            contactDetailsObject.ADDRESS_LINE1 = $scope.InviteContactDetails.ADDRESS_LINE1;
            contactDetailsObject.ADDRESS_LINE2 = $scope.InviteContactDetails.ADDRESS_LINE2;
            contactDetailsObject.COUNTRY_ID = $scope.InviteContactDetails.COUNTRY_ID;


            PrcCommMethods.HUMANRESOURCE_API(contactDetailsObject, 'HRM_INS_UPD_ONBOARDING_STEP_2').then(function (data) {
                if (data.data > 0) {
                    $scope.$parent.ShowAlertBox("Success", 'Data submitted successfully.', 3000);
                    $scope.NEXT_Fn(FLAG, 2);
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
            primary_phone_number = window.intlTelInput(document.querySelector("#" + DIV_ID_NAME), {
                initialCountry: COUNTRY_ISO2,
                separateDialCode: true,
                preferredCountries: [COUNTRY_ISO2],
                hiddenInput: "primary_phone_number",
                utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18.1.0/build/js/utils.js",
            });
        }

    };

    $scope.SELECTED_COUNTRY_Fn = function (_param_country) {
        if (_param_country == '') {
            $scope.InviteContactDetails.CUSTOM_COUNTRY_NAME = $scope.InviteContactDetails.DD_DEFAULT_TEXT;
            $scope.InviteContactDetails.COUNTRY_ID = ''
        }
        else {
            $scope.InviteContactDetails.DISPLAY_COUNTRY_TEXT_SEARCH = '';
            $scope.InviteContactDetails.CUSTOM_COUNTRY_NAME = _param_country.COUNTRY_NAME;
            $scope.InviteContactDetails.COUNTRY_ID = _param_country.COUNTRY_ID;
            $scope.InviteContactDetails.POST_CODE_NAME = 'Post Code';
            $scope.InviteContactDetails.SHOW_HIDE_COUNTY = true;
            $scope.InviteContactDetails.COUNTY_NAME = 'State';
            if (_param_country.COUNTRY_ID == 187 || _param_country.COUNTRY_ID == 224 || _param_country.COUNTRY_ID == 117 || _param_country.COUNTRY_ID == 174 || _param_country.COUNTRY_ID == 162 || _param_country.COUNTRY_ID == 19) { //GCC
                $scope.InviteContactDetails.POST_CODE_NAME = 'PO Box'
                $scope.InviteContactDetails.COUNTY_NAME = '';
                $scope.InviteContactDetails.SHOW_HIDE_COUNTY = false;
            }
            else if (_param_country.COUNTRY_ID == 225) {//UK
                $scope.InviteContactDetails.SHOW_HIDE_COUNTY = true;
                $scope.InviteContactDetails.COUNTY_NAME = 'County';
                $scope.InviteContactDetails.POST_CODE_NAME = 'Post Code'
            } else if (_param_country.COUNTRY_ID == 226) {//US
                $scope.InviteContactDetails.SHOW_HIDE_COUNTY = true;
                $scope.InviteContactDetails.POST_CODE_NAME = 'Zip Code'
                $scope.InviteContactDetails.COUNTY_NAME = 'State';
            }






        }
    }
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
                    $location.path("#").search("CUS_ID", getUrlParameter('CUS_ID', $location.absUrl())).search("EMP_ID", getUrlParameter('EMP_ID', $location.absUrl()));
            }
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
                $location.path("Invite_Contact_Details").search("CUS_ID", data.data.Table[0].CUSTOMER_ID).search("EMP_ID", data.data.Table[0].EMPLY_PRSNL_ID);
                $scope.HRM_GET_EMPLOYEE_STEP();
                $scope.ADMIN_GET_COUNTRY();
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
});