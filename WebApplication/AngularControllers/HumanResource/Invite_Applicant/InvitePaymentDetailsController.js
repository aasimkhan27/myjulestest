app.controller('InvitePaymentDetailsController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {

    ///$scope.$parent.DISPLAY_FLAG = false;
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(2);
    $scope.$parent.HIDE_HEADER_DETAIL = false;
    $scope.$parent.$parent.overlay_loading_HR_Loader = 'none';
    $scope.regexPattern = /^[a-zA-Z!@#$%^&*()_+={}[\]:;\"'<>?,./\\|`~ ]+$/;

    $scope.InvitePaymentDetails = {
        EMPLY_PRSNL_ID: getUrlParameter('EMP_ID', $location.absUrl()),
        CUSTOMER_ID: getUrlParameter('CUS_ID', $location.absUrl()),
        ENTITY_ID: null,
        MODULE_ID: $cookies.get("MODULE_ID"),
        USER_ID: 1,//$cookies.get("USERID"),
        DD_DEFAULT_TEXT: $scope.$parent.DD_DEFAULT_TEXT,
        ROLL_NUMBER: '',
        ACCOUNT_NUMBER: '',
        SORT_CODE: '',
        SORT_CODE_LABEL: 'Sort Code',
        BANK_NAME: '',
        ACCOUNT_HOLDER_NAME: '',
        ACCOUNT_NUMBER_LABEL: "Account Number",
    };

    $scope.INVITE_APPLICANT_HEADER = {
        ONBOARDING_STEP: 1,
        ACTIVE_TAB_ID: 5
    };

    $scope.HRM_GET_EMPLOYEE_STEP = function () {
        var personaldetailobj = new Object()
        personaldetailobj.EMPLY_PRSNL_ID = $scope.InvitePaymentDetails.EMPLY_PRSNL_ID;
        personaldetailobj.CUSTOMER_ID = $scope.InvitePaymentDetails.CUSTOMER_ID;
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
    $scope.SORT_MAX_LENGTH = 10;
    $scope.HRM_GET_ONBOARDING_STEP_1 = function () {
        var UserModelObj = new Object();
        UserModelObj.EMPLY_PRSNL_ID = $scope.InvitePaymentDetails.EMPLY_PRSNL_ID
        UserModelObj.CUSTOMER_ID = $scope.InvitePaymentDetails.CUSTOMER_ID
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'HRM_GET_ONBOARDING_STEP_1').then(function (data) {
            if (data.data.Table.length > 0) {
                let RESULT_PERSNL = data.data.Table[0];
                $scope.InvitePaymentDetails.FIRST_NAME = RESULT_PERSNL.FIRST_NAME;
                $scope.InvitePaymentDetails.LAST_NAME = RESULT_PERSNL.LAST_NAME;
            }
            $scope.HRM_GET_ONBOARDING_STEP_2();
        });
    };
    $scope.HRM_GET_ONBOARDING_STEP_2 = function () {
        var UserModelObj = new Object();
        UserModelObj.EMPLY_PRSNL_ID = $scope.InvitePaymentDetails.EMPLY_PRSNL_ID;
        UserModelObj.CUSTOMER_ID = $scope.InvitePaymentDetails.CUSTOMER_ID;
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'HRM_GET_ONBOARDING_STEP_2').then(function (data) {
            if (data.data.Table.length > 0) {
                let RESULT_PERSNL = data.data.Table[0];

                $scope.InvitePaymentDetails.SORT_CODE_LABEL = "Sort Code";
                $scope.InvitePaymentDetails.ACCOUNT_NUMBER_LABEL = "Account Number";
                $scope.InvitePaymentDetails.COUNTRY_ID = RESULT_PERSNL.COUNTRY_ID;
                if (RESULT_PERSNL.COUNTRY_ID == 187 || RESULT_PERSNL.COUNTRY_ID == 224 || RESULT_PERSNL.COUNTRY_ID == 117 || RESULT_PERSNL.COUNTRY_ID == 174 || RESULT_PERSNL.COUNTRY_ID == 162 || RESULT_PERSNL.COUNTRY_ID == 19) {
                    $scope.InvitePaymentDetails.SORT_CODE_LABEL = "IBAN Number";
                    $scope.InvitePaymentDetails.ACCOUNT_NUMBER_LABEL = "Labour Card Number";
                    $scope.SORT_MAX_LENGTH = 34;
                }
                else if (RESULT_PERSNL.COUNTRY_ID == 225) {//UK
                    $scope.SORT_MAX_LENGTH = 6;
                } else if (RESULT_PERSNL.COUNTRY_ID == 226) {//US
                    $scope.InvitePaymentDetails.SORT_CODE_LABEL = "Routing Transit Number";
                    $scope.SORT_MAX_LENGTH = 9;
                } else if (RESULT_PERSNL.COUNTRY_ID == 101) {//India
                    $scope.InvitePaymentDetails.SORT_CODE_LABEL = "IFSC Code";
                    $scope.SORT_MAX_LENGTH = 11;
                } else {//Other
                    $scope.InvitePaymentDetails.SORT_CODE_LABEL = "Branch Number";
                    $scope.SORT_MAX_LENGTH = 20;
                }
            }
            $scope.HRM_GET_ONBOARDING_STEP_5();
        });
    };

    $scope.HRM_GET_ONBOARDING_STEP_5 = function () {
        var UserModelObj = new Object();
        UserModelObj.EMPLY_PRSNL_ID = $scope.InvitePaymentDetails.EMPLY_PRSNL_ID;
        UserModelObj.CUSTOMER_ID = $scope.InvitePaymentDetails.CUSTOMER_ID;
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'HRM_GET_ONBOARDING_STEP_5').then(function (data) {
            if (data.data.Table.length > 0) {
                let RESULT_PERSNL = data.data.Table[0];
                $scope.STEP_NO = RESULT_PERSNL.STEP_NO;

                $scope.InvitePaymentDetails.ACCOUNT_HOLDER_NAME = RESULT_PERSNL.ACCOUNT_HOLDER_NAME;
                $scope.InvitePaymentDetails.BANK_NAME = RESULT_PERSNL.BANK_NAME;
                $scope.InvitePaymentDetails.SORT_CODE = RESULT_PERSNL.SORT_CODE;
                $scope.InvitePaymentDetails.ACCOUNT_NUMBER = RESULT_PERSNL.ACCOUNT_NUMBER;
                $scope.InvitePaymentDetails.ROLL_NUMBER = RESULT_PERSNL.ROLL_NUMBER;

            } else {
                if ($scope.InvitePaymentDetails.ACCOUNT_HOLDER_NAME == '') {
                    $scope.InvitePaymentDetails.ACCOUNT_HOLDER_NAME = $scope.InvitePaymentDetails.FIRST_NAME + " " + $scope.InvitePaymentDetails.LAST_NAME;
                }
            }
        });
    };

    $scope.HRM_BANK_VALIDATION = function () {
        if ($scope.InvitePaymentDetails.COUNTRY_ID == 225) {
            $scope.InvitePaymentDetailsForm.submitted = true;
            if ($scope.InvitePaymentDetailsForm.$valid) {
                var personaldetailobj = new Object()
                personaldetailobj.CUSTOMER_ID = $scope.InvitePaymentDetails.CUSTOMER_ID;
                personaldetailobj.EMPLY_PRSNL_ID = $scope.InvitePaymentDetails.EMPLY_PRSNL_ID;
                personaldetailobj.EMPLOYEE_NUMBER = $scope.InvitePaymentDetails.EMPLOYEE_NUMBER;
                personaldetailobj.EMAIL = $scope.InvitePaymentDetails.EMAIL;
                personaldetailobj.SORT_CODE = $scope.InvitePaymentDetails.SORT_CODE;
                personaldetailobj.ACCOUNT_NUMBER = $scope.InvitePaymentDetails.ACCOUNT_NUMBER;
                personaldetailobj.COUNTRY_ID = $scope.InvitePaymentDetails.COUNTRY_ID;
                PrcCommMethods.HUMANRESOURCE_API(personaldetailobj, 'HRM_BANK_VALIDATION').then(function (data) {
                    $scope.BANK_DETAILS = JSON.parse(data.data);
                    if ($scope.BANK_DETAILS == null) {
                        $scope.$parent.ShowAlertBox('Error', $scope.SOMETHINGWENTWRONG, 3000);
                        count = 1;
                    }
                    else if ($scope.BANK_DETAILS.resultCode == "01") {
                        $scope.HRM_INS_UPD_ONBOARDING_STEP_5();
                    }
                    else if ($scope.BANK_DETAILS.resultCode == "03") {
                        $scope.$parent.ShowAlertBox('Error', 'Your license has expired.', 3000);
                        count = 1;
                    }
                    else {
                        $scope.$parent.ShowAlertBox('Error', 'Sortcode and Bank Account are not valid', 3000);
                        count = 1;
                    }
                });
            }
        }
        else {
            $scope.HRM_INS_UPD_ONBOARDING_STEP_5();
        }
    }

    $scope.HRM_INS_UPD_ONBOARDING_STEP_5 = function (FLAG) {
        $scope.InvitePaymentDetailsForm.submitted = true;
        if ($scope.InvitePaymentDetailsForm.$valid) {

            var emergencyDetailsObject = new Object()
            emergencyDetailsObject.EMPLY_PRSNL_ID = $scope.InvitePaymentDetails.EMPLY_PRSNL_ID;
            emergencyDetailsObject.ENTITY_ID = $scope.InvitePaymentDetails.ENTITY_ID;
            emergencyDetailsObject.CUSTOMER_ID = $scope.InvitePaymentDetails.CUSTOMER_ID;
            emergencyDetailsObject.USER_ID = $scope.InvitePaymentDetails.USER_ID;

            emergencyDetailsObject.ACCOUNT_HOLDER_NAME = $scope.InvitePaymentDetails.ACCOUNT_HOLDER_NAME;
            emergencyDetailsObject.BANK_NAME = $scope.InvitePaymentDetails.BANK_NAME;
            emergencyDetailsObject.ACCOUNT_NUMBER = $scope.InvitePaymentDetails.ACCOUNT_NUMBER;
            emergencyDetailsObject.ROLL_NUMBER = $scope.InvitePaymentDetails.ROLL_NUMBER;
            emergencyDetailsObject.SORT_CODE = $scope.InvitePaymentDetails.SORT_CODE;


            PrcCommMethods.HUMANRESOURCE_API(emergencyDetailsObject, 'HRM_INS_UPD_ONBOARDING_STEP_5').then(function (data) {
                if (data.data > 0) {
                    //  $scope.$parent.ShowAlertBox("Success", 'Data submitted successfully. Thank you for updating your record.It has been forwarded to HR for processing.', 3000);
                    $scope.SUBMIT_Fn();
                }
                if (data.data == 0) {
                    $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                }
            });
        } else {
            $scope.$parent.ShowAlertBox("Attention", $scope.$parent.MANDATORY_MSG, 3000);
        }
    }
    $scope.SUBMIT_Fn = function () {
        if ($scope.InvitePaymentDetailsForm.$valid) {
            $('#Saved_Successfully').modal('show');
        } else {
            $scope.InvitePaymentDetailsForm.submitted = true;
        }
    };

    $scope.NEXT_Fn = function (_page_flag) {
        if ($scope.INVITE_APPLICANT_HEADER.ONBOARDING_STEP >= _page_flag) {
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
                    $location.path("#").search("CUS_ID", $scope.InvitePaymentDetails.CUSTOMER_ID).search("EMP_ID", $scope.InvitePaymentDetails.EMPLY_PRSNL_ID);
            }
        }
    };
    $scope.HRM_GET_EMPLOYEE_DETAILS_BY_PASSKEY = function () {
        var personaldetailobj = new Object()
        personaldetailobj.PASSKEY = getUrlParameter('passkey', $location.absUrl());
        PrcCommMethods.HUMANRESOURCE_API(personaldetailobj, 'HRM_GET_EMPLOYEE_DETAILS_BY_PASSKEY').then(function (data) {
            if (data.data.Table.length > 0) {
                $location.path("Invite_Payment_Details").search("CUS_ID", data.data.Table[0].CUSTOMER_ID).search("EMP_ID", data.data.Table[0].EMPLY_PRSNL_ID);
                $scope.HRM_GET_ONBOARDING_STEP_1();
                $scope.HRM_GET_EMPLOYEE_STEP();
            }
        });
    }
    $scope.PAGE_LOAD = 0;
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

    $scope.OKAY_Fn = function () {
        window.location.href = "https://www.wenodo.com";
    }
});