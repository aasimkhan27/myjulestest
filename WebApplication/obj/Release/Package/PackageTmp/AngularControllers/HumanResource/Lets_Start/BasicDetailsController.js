app.controller('BasicDetailsController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $interval) {
    //$scope.$parent.DISPLAY_FLAG = false;
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(2);
    $scope.BasicDetails = {
        PACKAGE_NAME: 'Choose',
        USER_ID: getUrlParameter('ID', $location.absUrl()),
        DD_DEFAULT_TEXT: $scope.$parent.DD_DEFAULT_TEXT,
        STEP_NO: 1,
    };
    var phone_number
    $scope.BIND_PHONE_CALENDAR_Fn = function (DIV_ID_NAME, COUNTRY_ISO2, FLAG) {
        phone_number = window.intlTelInput(document.querySelector("#" + DIV_ID_NAME), {
            initialCountry: COUNTRY_ISO2,
            preferredCountries: [COUNTRY_ISO2],
            separateDialCode: true,
            hiddenInput: "full_number",
            autoHideDialCode: true,
            autoPlaceholder: "ON",
            dropdownContainer: document.body,
            formatOnDisplay: true,
            hiddenInput: "full_number",
            nationalMode: true,
            placeholderNumberType: "MOBILE",
            separateDialCode: true,
            utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18.1.0/build/js/utils.js",
        });
    }
    $scope.LINK_EXPIRE_FLAG = "";
    $scope.PAGE_LOAD = 0;
    $scope.VALIDATE_PASS_KEY = function () {
        var UserModelObj = new Object();
        UserModelObj.PassKey = getUrlParameter('passkey', $location.absUrl());
        UserModelObj.ID = getUrlParameter('ID', $location.absUrl());
        UserModelObj.FLAG = 1;
        var httprequest = $http({
            method: 'POST',
            url: CommService.Get_CASHUP_API() + 'api/LoginAPI/VALIDATE_PASS_KEY',
            data: UserModelObj
        }).then(function (data) {
            if (data.data.Table.length > 0) {
                if (data.data.Table[0].SUCCESS == 1) {
                    $scope.LINK_EXPIRE_FLAG = true;
                    $scope.GET_USER_DATA_FOR_BASIC_DETAILS();
                }
                if (data.data.Table[0].SUCCESS == 0) {
                    $scope.LINK_EXPIRE_FLAG = false;
                }
                $scope.PAGE_LOAD = 1;
            }
        });
    };
    $scope.GET_USER_DATA_FOR_BASIC_DETAILS = function () {
        var UserModelObj = new Object();
        UserModelObj.USER_ID = $scope.BasicDetails.USER_ID;
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'GET_USER_DATA_FOR_BASIC_DETAILS').then(function (data) {
            if (data.data.Table.length > 0) {
                if (data.data.Table[0].PASSKEY == null) {
                    $scope.LINK_EXPIRE_FLAG = false;
                }
                else {
                    $scope.LINK_EXPIRE_FLAG = true;
                    $scope.BasicDetails.FIRST_NAME = data.data.Table[0].FIRST_NAME;
                    $scope.BasicDetails.LAST_NAME = data.data.Table[0].LAST_NAME;
                    $scope.BasicDetails.EMAIL = data.data.Table[0].PRIMARY_EMAIL;
                    $scope.BasicDetails.MOBILE_CODE = data.data.Table[0].MOBILE_CODE;
                    $scope.BasicDetails.PHONE_TEXT = data.data.Table[0].MOBILE_NO;
                    $scope.BasicDetails.CUSTOMER_ID = data.data.Table[0].CUSTOMER_ID;
                    $scope.BasicDetails.STEP_NO = data.data.Table[0].PASSWORD != undefined && data.data.Table[0].PASSWORD != "" && data.data.Table[0].PASSWORD != null ? 2 : 1;
                    $scope.BasicDetails.PASSWORD = data.data.Table[0].PASSWORD;
                    $scope.BasicDetails.ConfirmPassword = data.data.Table[0].PASSWORD;
                    $cookies.put('CUSTOMER_ID_HR', data.data.Table[0].CUSTOMER_ID, { 'path': '/' });
                    if (data.data.Table[0].TWO_DIGIT_COUNTRY_CODE != '' && data.data.Table[0].TWO_DIGIT_COUNTRY_CODE != null) {
                        var resultiso2 = data.data.Table[0].TWO_DIGIT_COUNTRY_CODE.toLowerCase();
                        $scope.BIND_PHONE_CALENDAR_Fn('country', resultiso2, 1);
                    }
                    else {
                    }
                }
                $scope.PAGE_LOAD = 1;
            }
            else if (data.data == 0) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
            else {
                $scope.BIND_PHONE_CALENDAR_Fn('country', 'gb', 1);
            }
        });
    }
    if (getUrlParameter('passkey', $location.absUrl()) != "" && getUrlParameter('passkey', $location.absUrl()) != null && getUrlParameter('passkey', $location.absUrl()) != undefined) {
        $scope.VALIDATE_PASS_KEY()
    } else {
        $scope.GET_USER_DATA_FOR_BASIC_DETAILS();
    }

    $scope.SELECT_PAKAGE_NAME_Fn = function (_package) {
        $scope.BasicDetails.PACKAGE_SUBSCRIPTION_MAPPING_ID = _package.PACKAGE_SUBSCRIPTION_MAPPING_ID;
        $scope.BasicDetails.PACKAGE_NAME = _package.NAME;
    }
    $scope.INS_UPD_USER_DATA_FOR_BASIC_DETAILS = function () {
        $scope.BASIC_FORM.submitted = true;
        if ($scope.BASIC_FORM.$valid) {
            var full_number = phone_number.getSelectedCountryData();
            var UserModelObj = new Object();
            UserModelObj.USER_ID = getUrlParameter('ID', $location.absUrl());
            UserModelObj.FIRST_NAME = $scope.BasicDetails.FIRST_NAME;
            UserModelObj.LAST_NAME = $scope.BasicDetails.LAST_NAME;
            UserModelObj.MOBILE_CODE = full_number.dialCode;
            UserModelObj.TWO_DIGIT_COUNTRY_CODE = full_number.iso2;
            UserModelObj.MOBILE_NO = $scope.BasicDetails.PHONE_TEXT;
            UserModelObj.PASSWORD = $scope.BasicDetails.PASSWORD;
            PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'INS_UPD_USER_DATA_FOR_BASIC_DETAILS').then(function (data) {
                if (data.data == 1) {
                    $scope.$parent.ShowAlertBox("Success", "Saved successfully ", 3000);
                    $location.path('Enter_Sites');
                }
                else if (data.data == 0) {
                    $scope.$parent.ShowAlert("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                }
            });
        }
    }

    $scope.LET_GET_START_Fn = function (PATH_FLAG) {
        if (PATH_FLAG == 1) {
            $location.path('Basic_Details').search('ID', getUrlParameter('ID', $location.absUrl()), { 'path': '/' })
        } else if (PATH_FLAG == 2) {
            if ($scope.BasicDetails.STEP_NO == 2) {
                $location.path('Enter_Sites').search('ID', getUrlParameter('ID', $location.absUrl()), { 'path': '/' })
            }
            else {
                $scope.$parent.ShowAlertBox("Attention", 'Please complete basic detail go on to the next step', 4000);
            }
        }
    }
    $scope.LOGIN_Fn = function () {
        $window.location.href = '../Login/Index'
    }
    $scope.$parent.$parent.HIDE_HEADER_DETAIL = false;

    $scope.$parent.$parent.overlay_loading_HR_Loader = 'none';
});
app.controller('EntitySiteController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $interval) {
    $scope.$parent.DISPLAY_FLAG = false;
    $scope.UK_PINCODE_REG_X = $scope.$parent.UK_PINCODE_REG_X;
    $scope.GCC_PINCODE_REG_X = $scope.$parent.GCC_PINCODE_REG_X;
    $scope.US_PINCODE_REG_X = $scope.$parent.US_PINCODE_REG_X;
    $scope.PAGE_LOAD = 0;
    $scope.EntitySiteSearch = {
        CUSTOMER_ID: $cookies.get("CUSTOMER_ID_HR"),
        USER_ID: getUrlParameter('ID', $location.absUrl()),
        ENTITY_ID: null,
        AUTO_SEARCH: 2,
        DISPLAY_COUNTRY_TEXT: $scope.DD_DEFAULT_TEXT,
        SHOW_MSG: false,
        CUSTOM_COUNTRY_NAME: $scope.DD_DEFAULT_TEXT,
        CUSTOM_STATE_NAME: $scope.DD_DEFAULT_TEXT,
        FINANCIAL_YEAR_START_MONTH: 1,
        SHOW_HIDE_COUNTY: true,
        POST_CODE: 'Post Code',
        COUNTY_NAME: 'State',

    }
    $scope.LOGIN_Fn = function () {
        $window.location.href = '../Login/Index'
    }
    $scope.RESET_Fn = function () {
        $scope.EntitySiteSearch = {
            CUSTOMER_ID: $cookies.get("CUSTOMER_ID_HR"),
            ENTITY_ID: null,
            AUTO_SEARCH: 2,
            DISPLAY_COUNTRY_TEXT: $scope.DD_DEFAULT_TEXT,
            SHOW_MSG: false,
            CUSTOM_COUNTRY_NAME: $scope.DD_DEFAULT_TEXT,
            CUSTOM_STATE_NAME: $scope.DD_DEFAULT_TEXT,
            FINANCIAL_YEAR_START_MONTH: 1,
            SHOW_HIDE_COUNTY: true,
            POST_CODE: 'Post Code',
            COUNTY_NAME: 'State',
        }

    }

    $scope.RESET_BRANCH_Fn = function (_entity, _entity, index) {
        _entity.BRANCH_NAME = "";
        _entity.ADDRESS_1 = "";
        _entity.ADDRESS_2 = "";
        _entity.ADDRESS_2 = "";
        _entity.COUNTRY_ID = null;
        _entity.COUNTRY_ID = "";
        _entity.STATE_ID = null;
        _entity.STATE_ID = null;
        _entity.STATES = [];
        _entity.CITY_NAME = "";
        _entity.ZIPCODE = "";
        $("#Branch_single-select-tagging" + index).select2({ minimumResultsForSearch: -1, });
        $("#Branch_single-select-taggingC" + index).select2({ minimumResultsForSearch: -1, });
        $("#Branch_single-select-taggingS" + index).select2({ minimumResultsForSearch: -1, });
        $("#Branch_single-select-taggingF" + index).select2({ minimumResultsForSearch: -1, });
        $("#Branch_single-select-taggingT" + index).select2({ minimumResultsForSearch: -1, });
        $('#item-img_site_' + index).on('change', function () {
            readFile(this, index, 'SITE');
        });
        $('#replacePhoto' + index).on('click', function () {
            $('#cropImagePop').modal('hide');
            $('#item-img_site_' + index).trigger('click');
        });

        _entity.branchform.submitted = false;
    }
    $scope.RESET_ENTITY_Fn = function () {
        $scope.EntitySiteSearch.CUSTOMER_ID = $cookies.get("CUSTOMER_ID_HR");
        $scope.EntitySiteSearch.DISPLAY_COUNTRY_TEXT = $scope.DD_DEFAULT_TEXT;
        $scope.EntitySiteSearch.SHOW_MSG = false;
        $scope.EntitySiteSearch.CUSTOM_COUNTRY_NAME = $scope.DD_DEFAULT_TEXT;
        $scope.EntitySiteSearch.CUSTOM_STATE_NAME = $scope.DD_DEFAULT_TEXT;
        $scope.EntitySiteSearch.FINANCIAL_YEAR_START_MONTH = 1;
        $scope.EntitySiteSearch.SHOW_HIDE_COUNTY = true;
        $scope.EntitySiteSearch.POST_CODE = 'Post Code';
        $scope.EntitySiteSearch.COUNTY_NAME = 'State';
        $scope.entityform.submitted = false;
    }
    //2128
    $scope.HR_ENTITY_LIST = [];
    $scope.HR_BRANCH_LIST = [];
    $scope.TIME_ZONE_NAME_LIST = [];

    $scope.GET_USER_DATA_FOR_BASIC_DETAILS = function () {
        var UserModelObj = new Object();
        UserModelObj.USER_ID = $scope.EntitySiteSearch.USER_ID;
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'GET_USER_DATA_FOR_BASIC_DETAILS').then(function (data) {
            if (data.data.Table.length > 0) {
                if (data.data.Table[0].PASSKEY == null) {
                    $scope.LINK_EXPIRE_FLAG = false;
                }
                else {
                    $scope.LINK_EXPIRE_FLAG = true;
                    let STEP_NO = data.data.Table[0].PASSWORD != undefined && data.data.Table[0].PASSWORD != "" && data.data.Table[0].PASSWORD != null ? 2 : 1;
                    if (STEP_NO == 1) {
                        $location.path('Basic_Details').search('ID', getUrlParameter('ID', $location.absUrl()), { 'path': '/' })
                    }

                }
                $scope.PAGE_LOAD = 1;
            }
            else if (data.data == 0) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }

        });
    }
    $scope.VALIDATE_PASS_KEY = function () {
        var UserModelObj = new Object();
        UserModelObj.PassKey = getUrlParameter('passkey', $location.absUrl());
        UserModelObj.ID = getUrlParameter('ID', $location.absUrl());
        UserModelObj.FLAG = 1;
        var httprequest = $http({
            method: 'POST',
            url: CommService.Get_CASHUP_API() + 'api/LoginAPI/VALIDATE_PASS_KEY',
            data: UserModelObj
        }).then(function (data) {
            if (data.data.Table.length > 0) {
                if (data.data.Table[0].SUCCESS == 1) {
                    $scope.LINK_EXPIRE_FLAG = true;
                    $scope.GET_USER_DATA_FOR_BASIC_DETAILS();
                }
                if (data.data.Table[0].SUCCESS == 0) {
                    $scope.LINK_EXPIRE_FLAG = false;
                }
                $scope.PAGE_LOAD = 1;
            }
        });
    };

    if (getUrlParameter('passkey', $location.absUrl()) != "" && getUrlParameter('passkey', $location.absUrl()) != null && getUrlParameter('passkey', $location.absUrl()) != undefined) {
        $scope.VALIDATE_PASS_KEY()
    } else {
        $scope.GET_USER_DATA_FOR_BASIC_DETAILS();
    }

    $scope.BLANK_BRANCH = { BRANCH_ID: 0, BRANCH_NAME: 'New Site', HR_BRANCH_BY_ID: {} };

    $scope.ADMIN_GET_COUNTRY = function () {
        var UserModelObj = new Object();
        PrcCommMethods.ADMIN_API(UserModelObj, 'GET_COUNTRY').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.COUNTRY_LIST = data.data.Table;
            }
            else if (data.data == null) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
        });
    }

    $scope.ADMIN_GET_ENTITY_LIST = function () {
        var UserModelObj = new Object();
        UserModelObj.CUSTOMER_ID = $scope.EntitySiteSearch.CUSTOMER_ID;
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'ADMIN_GET_ENTITY_LIST').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.HR_ENTITY_LIST = data.data.Table;
                $scope.HR_ENTITY_DTLS = data.data.Table[0];
            }
            else if (data.data == null) {
                $scope.$parent.ShowAlert("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
        });
    }
    $scope.ADMIN_GET_BRANCH_LIST = function () {
        var UserModelObj = new Object();
        UserModelObj.CUSTOMER_ID = $scope.EntitySiteSearch.CUSTOMER_ID;
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'ADMIN_GET_BRANCH_LIST').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.HR_BRANCH_LIST = data.data.Table;
                $scope.ADMIN_GET_ENTITY_LIST();
            }
            else if (data.data == null) {
                $scope.$parent.ShowAlert("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
            else {
                $scope.HR_BRANCH_LIST = [];
                $scope.ADMIN_GET_ENTITY_LIST();
            }
        });
    }
    $scope.ADMIN_GET_ENTITY_BY_ID = function (_param_entity) {
        ///_param_entity.SHOW_HIDE = !_param_entity.SHOW_HIDE;
        var UserModelObj = new Object();
        UserModelObj.ENTITY_ID = _param_entity.ENTITY_ID;
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'ADMIN_GET_ENTITY_BY_ID').then(function (data) {
            if (data.data.Table.length > 0) {
                let _let_entity = data.data.Table[0];
                $scope.EntitySiteSearch.ENTITY_ID = _let_entity.ENTITY_ID;
                $scope.EntitySiteSearch.COMPANY_REGISTRATION_NO = _let_entity.COMPANY_REGISTRATION_NO;
                $scope.EntitySiteSearch.LIMITED_COMPANY_NAME = _let_entity.LIMITED_COMPANY_NAME;
                $scope.EntitySiteSearch.ENTITY_NAME = _let_entity.ENTITY_NAME;
                $scope.EntitySiteSearch.ADDRESS_1 = _let_entity.ADDRESS_1;
                $scope.EntitySiteSearch.ADDRESS_2 = _let_entity.ADDRESS_2;
                $scope.EntitySiteSearch.COMPANY_REGISTRATION_NO = _let_entity.COMPANY_REGISTRATION_NO;
                $scope.EntitySiteSearch.COUNTRY_ID = _let_entity.COUNTRY_ID;
                if (_let_entity.COUNTRY_ID == undefined || _let_entity.COUNTRY_ID == null) {
                    $scope.EntitySiteSearch.CUSTOM_COUNTRY_NAME = $scope.DD_DEFAULT_TEXT;
                }
                else {
                    var _result_country = $scope.COUNTRY_LIST.filter(function (_param_country) { return _param_country.COUNTRY_ID == _let_entity.COUNTRY_ID });
                    $scope.SELECTED_ENTITY_COUNTRY_Fn(_result_country[0], $scope.EntitySiteSearch);
                }
                $scope.EntitySiteSearch.STATE_ID = _let_entity.STATE_ID;
                $scope.EntitySiteSearch.ZIPCODE = _let_entity.ZIPCODE;
                $scope.EntitySiteSearch.CITY_NAME = _let_entity.CITY_NAME;
                $scope.EntitySiteSearch.CUSTOM_STATE_NAME = _let_entity.STATE_NAME || $scope.DD_DEFAULT_TEXT;

                $('#AddEntity').modal('show');
            }
            else if (data.data == null) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
        });

    }
    $scope.ADMIN_GET_BRANCH_BY_ID = function (_param_branch, _param_index) {
        _param_branch.SHOW_HIDE = !_param_branch.SHOW_HIDE;
        if (_param_branch.HR_BRANCH_BY_ID == undefined) {
            var UserModelObj = new Object();
            UserModelObj.BRANCH_ID = _param_branch.BRANCH_ID;
            PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'ADMIN_GET_BRANCH_BY_ID').then(function (data) {
                if (data.data.Table.length > 0) {
                    _param_branch.HR_BRANCH_BY_ID = data.data.Table[0];


                    if (_param_branch.HR_BRANCH_BY_ID.ADDRESS != null && _param_branch.HR_BRANCH_BY_ID.ADDRESS.length > 0) {
                        var result = _param_branch.HR_BRANCH_BY_ID.ADDRESS.split(':;:');
                        _param_branch.HR_BRANCH_BY_ID.ADDRESS_1 = result[0];
                        _param_branch.HR_BRANCH_BY_ID.ADDRESS_2 = result[1];
                    };
                    if (_param_branch.HR_BRANCH_BY_ID.COUNTRY_ID > 0) {
                        var _result_country = $scope.COUNTRY_LIST.filter(function (_param_country) { return _param_country.COUNTRY_ID == _param_branch.HR_BRANCH_BY_ID.COUNTRY_ID });
                        $scope.SELECTED_COUNTRY_Fn(_result_country[0], _param_branch, 1);
                        _param_branch.HR_BRANCH_BY_ID.CUSTOM_STATE_NAME = _param_branch.HR_BRANCH_BY_ID.STATE_NAME;
                    }
                    else {
                        _param_branch.HR_BRANCH_BY_ID.POST_CODE_LABEL = 'Post Code'
                        $scope.SELECTED_COUNTRY_Fn('', _param_branch);
                        _param_branch.HR_BRANCH_BY_ID.CUSTOM_COUNTRY_NAME = $scope.DD_DEFAULT_TEXT;
                        _param_branch.HR_BRANCH_BY_ID.CUSTOM_STATE_NAME = $scope.DD_DEFAULT_TEXT;
                    };

                    if (_param_branch.HR_BRANCH_BY_ID.CURRENCY_ID == undefined || _param_branch.HR_BRANCH_BY_ID.CURRENCY_ID == null || _param_branch.HR_BRANCH_BY_ID.CURRENCY_ID == "") {
                        $scope.SELECTED_BRANCH_CURRENCY_Fn('', _param_branch);
                    }
                    else {
                        _param_branch.HR_BRANCH_BY_ID.CUSTOM_CURRENCY_NAME = _param_branch.HR_BRANCH_BY_ID.CURRENCY_NAME;
                    };

                }
                else if (data.data == null) {
                    $scope.$parent.ShowAlert("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                }
                else {
                    if (_param_branch.HR_BRANCH_BY_ID.COUNTRY_ID > 0) {
                        var _result_country = $scope.COUNTRY_LIST.filter(function (_param_country) { return _param_country.COUNTRY_ID == _param_branch.HR_BRANCH_BY_ID.COUNTRY_ID });
                        $scope.SELECTED_COUNTRY_Fn(_result_country[0], _param_branch, 1);
                        _param_branch.HR_BRANCH_BY_ID.CUSTOM_STATE_NAME = _param_branch.HR_BRANCH_BY_ID.STATE_NAME;
                    }
                    else {
                        _param_branch.HR_BRANCH_BY_ID.CUSTOM_COUNTRY_NAME = $scope.DD_DEFAULT_TEXT;
                        _param_branch.HR_BRANCH_BY_ID.CUSTOM_STATE_NAME = $scope.DD_DEFAULT_TEXT;
                    };

                    if (_param_branch.HR_BRANCH_BY_ID.CURRENCY_ID == undefined || _param_branch.HR_BRANCH_BY_ID.CURRENCY_ID == null || _param_branch.HR_BRANCH_BY_ID.CURRENCY_ID == "") {
                        $scope.SELECTED_BRANCH_CURRENCY_Fn('', _param_branch);
                    }
                    else {
                        _param_branch.HR_BRANCH_BY_ID.CUSTOM_CURRENCY_NAME = _param_branch.HR_BRANCH_BY_ID.CURRENCY_NAME;
                    };
                }
            });
        }
    }


    $scope.GET_STATES = function (_param_entity, _param_index, _param_call_flag) {
        _param_entity.STATES = [];
        var CusModelObj = new Object();
        if (_param_call_flag == 'ENTITY') {
            CusModelObj.COUNTRY_ID = _param_entity.COUNTRY_ID;
        }
        else if (_param_call_flag == 'SITE') {
            CusModelObj.COUNTRY_ID = _param_entity.COUNTRY_ID;
        }
        else if (_param_call_flag == 'SITE_LIST') {
            CusModelObj.COUNTRY_ID = _param_entity.HR_BRANCH_BY_ID.COUNTRY_ID;
        }
        PrcCommMethods.HR_API(CusModelObj, 'GET_STATES').then(function (data) {
            _param_entity.STATES = data.data.Table;
            if (_param_call_flag == 'SITE') {
                _param_entity.POST_CODE_LABEL = 'Post Code'
                _param_entity.SHOW_HIDE_COUNTY = true;
                _param_entity.STATE_LABEL_NAME = 'State';

                if (_param_entity.COUNTRY_ID == 187 || _param_entity.COUNTRY_ID == 224 || _param_entity.COUNTRY_ID == 117 || _param_entity.COUNTRY_ID == 174 || _param_entity.COUNTRY_ID == 162 || _param_entity.COUNTRY_ID == 19) { //GCC

                    _param_entity.POST_CODE_LABEL = 'PO Box'
                    _param_entity.STATE_LABEL_NAME = '';
                    _param_entity.SHOW_HIDE_COUNTY = false;

                }
                else if (_param_entity.COUNTRY_ID == 225) {//UK

                    _param_entity.SHOW_HIDE_COUNTY = true;
                    _param_entity.STATE_LABEL_NAME = 'County';
                    _param_entity.POST_CODE_LABEL = 'Post Code'

                } else if (_param_entity.COUNTRY_ID == 226) {//US

                    _param_entity.SHOW_HIDE_COUNTY = true;
                    _param_entity.POST_CODE_LABEL = 'Zip Code'
                    _param_entity.STATE_LABEL_NAME = 'State';

                }

            }

        });
    };
    $scope.GET_CURRENCY = function () {
        var PosiModelObj = new Object();
        PosiModelObj.CUSTOMER_ID = $scope.EntitySiteSearch.CUSTOMER_ID;
        PrcCommMethods.HR_API(PosiModelObj, 'GET_CURRENCY').then(function (data) {
            $scope.CURRENCY = data.data.Table;
        });
    };
    $scope.GET_TIME_ZONE_DROPDOWN = function () {
        var EntModelObj = new Object();
        EntModelObj = null;
        PrcCommMethods.ADMIN_API(EntModelObj, 'GET_TIME_ZONE_DROPDOWN').then(function (data) {
            $scope.TIME_ZONE_NAME_LIST = data.data.Table;
        });

    };
    $scope.GET_COMPANY_ADDRESS = function () {
        var PosiModelObj = new Object();
        PosiModelObj.CompanyNumber = $scope.EntitySiteSearch.COMPANY_REGISTRATION_NO;
        PrcCommMethods.HR_API(PosiModelObj, 'GET_COMPANY_ADDRESS').then(function (data) {
            //    $scope.CURRENCY = data.data.Table;
            console.log(data.data.Table);
        });
    }
    $scope.ADMIN_GET_COUNTRY();

    $scope.ADMIN_GET_BRANCH_LIST();
    $scope.GET_CURRENCY();
    $scope.GET_TIME_ZONE_DROPDOWN();
    $scope.PAGE_LOAD_ENTITY = 1;
    $scope.$on('ngRepeatFinishedEntityRender', function (ngRepeatFinishedEvent) {
    });
    $scope.$on('ngRepeatFinishedBranchRender', function (ngRepeatFinishedEvent) {
        angular.forEach($scope.HR_BRANCH_LIST, function (_value, index) {
            $("#Branch_single-select-tagging" + index).select2({ minimumResultsForSearch: -1, });
            $("#Branch_single-select-taggingC" + index).select2({ minimumResultsForSearch: -1, });
            $("#Branch_single-select-taggingS" + index).select2({ minimumResultsForSearch: -1, });
            $("#Branch_single-select-taggingF" + index).select2({ minimumResultsForSearch: -1, });
            $("#Branch_single-select-taggingT" + index).select2({ minimumResultsForSearch: -1, });
            $('#item-img_site_' + index).on('change', function () {
                readFile(this, index, 'SITE');
            });
            $('#replacePhoto' + index).on('click', function () {
                $('#cropImagePop').modal('hide');
                $('#item-img_site_' + index).trigger('click');
            });
        })
    });
    $scope.$on('$viewContentLoaded', function () {
        $('#single-select-tagging').select2({ minimumResultsForSearch: -1, allowClear: true });
        $('#my-single').select2({ minimumResultsForSearch: -1, allowClear: true });
        $('#single-select-taggingC').select2({ minimumResultsForSearch: -1, allowClear: true });
    });
    $scope.ENTITY_MODULE_LIST = [];
    $scope.ADMIN_INS_UPD_ENTITIES_AND_LOCATION = function (_param_line, _param_index, _param_form) {
        $scope.entityform.submitted = true;
        if ($scope.entityform.$valid) {
            var EntModelObj = new Object();
            EntModelObj.CUSTOMER_ID = _param_line.CUSTOMER_ID;
            EntModelObj.ENTITY_ID = _param_line.ENTITY_ID == null ? 0 : _param_line.ENTITY_ID;
            EntModelObj.ENTITY_NAME = _param_line.ENTITY_NAME;
            EntModelObj.ADDRESS_1 = _param_line.ADDRESS_1;
            EntModelObj.ADDRESS_2 = _param_line.ADDRESS_2;
            EntModelObj.CITY_NAME = _param_line.CITY_NAME;
            EntModelObj.STATE_ID = _param_line.STATE_ID;
            EntModelObj.COUNTRY_ID = _param_line.COUNTRY_ID;
            EntModelObj.ZIPCODE = _param_line.ZIPCODE;
            EntModelObj.CURRENCY_ID = _param_line.CURRENCY_ID == undefined ? null : _param_line.CURRENCY_ID;
            EntModelObj.CONTACT_NAME = _param_line.CONTACT_NAME;
            EntModelObj.CONTACT_NUMBER = _param_line.CONTACT_NUMBER;
            EntModelObj.CONTACT_EMAIL = _param_line.CONTACT_EMAIL;
            EntModelObj.LIMITED_COMPANY_NAME = _param_line.LIMITED_COMPANY_NAME;
            EntModelObj.COMPANY_REGISTRATION_NO = _param_line.COMPANY_REGISTRATION_NO;
            EntModelObj.USER_ID = getUrlParameter('ID', $location.absUrl());
            EntModelObj.LOGO_PATH = "";// _param_line.LOGO_PATH = _param_line.UploadedFiles[0].FILE_PATH + _param_line.UploadedFiles[0].SERVER_FILE_NAME;
            EntModelObj.FINANCIAL_YEAR_START_MONTH = _param_line.FINANCIAL_YEAR_START_MONTH;
            EntModelObj.TIME_ZONE_NAME = _param_line.TIME_ZONE_NAME;
            PrcCommMethods.HUMANRESOURCE_API(EntModelObj, 'ADMIN_INS_UPD_ENTITIES_AND_LOCATION').then(function (data) {
                if (data.data > 0) {
                    if (EntModelObj.ENTITY_ID > 0) {
                        $scope.$parent.ShowAlertBox('Success', 'Entity Updated Successfully', 3000);
                    } else {
                        $scope.$parent.ShowAlertBox('Success', 'Entity Added Successfully', 3000);
                    }
                    $scope.ADMIN_GET_ENTITY_LIST();
                    $('#AddEntity').modal('hide');
                    $scope.entityform.submitted = false;
                }
                if (data.data == 0) {
                    $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                }
            });
        }
    };

    $scope.ADMIN_INS_UPD_BRANCH = function (_param_Header, _param_line, _param_index, _param_from) {
        _param_Header.branchform.submitted = true;
        var EntModelObj = new Object();
        if (_param_Header.branchform.$valid) {
            EntModelObj.CUSTOMER_ID = _param_line.CUSTOMER_ID;
            EntModelObj.BRANCH_ID = _param_from == 0 ? 0 : _param_line.BRANCH_ID;
            EntModelObj.ENTITY_ID = _param_line.ENTITY_ID;
            EntModelObj.LOCATION_ID = _param_line.LOCATION_ID;
            EntModelObj.CURRENCY_ID = _param_line.CURRENCY_ID == undefined ? null : _param_line.CURRENCY_ID;
            EntModelObj.STATE_ID = _param_line.STATE_ID;
            EntModelObj.COUNTRY_ID = _param_line.COUNTRY_ID;
            EntModelObj.CITY = _param_line.CITY_NAME;
            EntModelObj.BRANCH_NAME = _param_line.BRANCH_NAME;
            EntModelObj.BRANCH_ADDRESS = _param_line.ADDRESS_1 + ':;:' + (_param_line.ADDRESS_2 == undefined || _param_line.ADDRESS_2 == null ? "" : _param_line.ADDRESS_2);
            EntModelObj.CONTACT_NAME = _param_line.CONTACT_NAME;
            EntModelObj.CONTACT_NUMBER = _param_line.CONTACT_NUMBER;
            EntModelObj.CONTACT_EMAIL = _param_line.CONTACT_EMAIL;
            EntModelObj.ZIPCODE = _param_line.ZIPCODE;
            EntModelObj.FAX = _param_line.FAX;
            //EntModelObj.LIMITED_COMPANY_NAME = _param_line.LIMITED_COMPANY_NAME;
            //EntModelObj.COMPANY_REGISTRATION_NO = _param_line.COMPANY_REGISTRATION_NO;
            EntModelObj.USER_ID = parseInt($cookies.get("USERID"));
            EntModelObj.ACTIVE = 1;//_param_line.ACTIVE == true ? 1 : 0;
            EntModelObj.COPY_FROM_TABLE_ID = null;
            EntModelObj.LATITUDE = _param_line.LATITUDE;
            EntModelObj.LONGITUDE = _param_line.LONGITUDE;
            EntModelObj.GEOFENCE_RADIUS = _param_line.GEOFENCE_RADIUS;
            EntModelObj.TIME_ZONE_NAME = _param_line.TIME_ZONE_NAME;
            EntModelObj.ORIGINAL_LATITUDE = _param_line.ORIGINAL_LATITUDE;
            EntModelObj.ORIGINAL_LONGITUDE = _param_line.ORIGINAL_LONGITUDE;
            EntModelObj.VARIANCE = _param_line.VARIANCE;
            EntModelObj.LOGO_PATH = _param_line.LOGO_PATH;
            EntModelObj.IS_REVENUE_BRANCH = _param_line.IS_REVENUE_BRANCH ? 1 : 0;
            EntModelObj.USE_EPOS_COVERS_IN_DASHBOARDS = _param_line.USE_EPOS_COVERS_IN_DASHBOARDS ? 1 : 0;
            EntModelObj.SHOW_IN_DASHBOARD = _param_line.SHOW_IN_DASHBOARD ? 1 : 0;
            PrcCommMethods.ADMIN_API(EntModelObj, 'ADMIN_INS_UPD_BRANCH').then(function (data) {
                var _var_msg = "Branch Added Successfully";
                _param_Header.SHOW_SITE_DTLS = false;
                _param_Header.SHOW_HIDE = false;
                if (_param_line.BRANCH_ID > 0) {
                    _var_msg = 'Branch Updated Successfully';
                    $scope.ADMIN_GET_BRANCH_LIST();
                }
                else {
                    _param_line.BRANCH_NAME = "";
                    _param_line.ADDRESS_1 = "";
                    _param_line.ADDRESS_2 = "";
                    _param_line.COUNTRY_ID = "";
                    _param_line.STATE_ID = "";
                    _param_line.CITY_NAME = "";
                    _param_line.ZIPCODE = "";
                    _param_Header.branchform.submitted = false;
                    $scope.ADMIN_GET_BRANCH_LIST();
                }
                $scope.$parent.ShowAlertBox('Success', _var_msg, 3000);
            });
        }
    };

    $scope.EDIT_ENTITY_Fn = function (_param_entity, _param_index) {
        $scope.EntitySiteSearch.ENTITY_ID = _param_entity.ENTITY_ID;
        $scope.ADMIN_GET_ENTITY_BY_ID($scope.EntitySiteSearch);
        _param_entity.branchform.submitted = false;
    }

    $scope.nginit_entity = function (_entity) {
        _entity.HR_BRANCH_LIST = angular.copy($scope.HR_BRANCH_LIST.filter(function (_site) { return _site.ENTITY_ID == _entity.ENTITY_ID }));
    }


    $scope.UPD_PENDING_SETUP = function () {
        if ($scope.HR_BRANCH_LIST.length > 0) {
            var EntModelObj = new Object();
            EntModelObj.USER_ID = getUrlParameter('ID', $location.absUrl());
            PrcCommMethods.HUMANRESOURCE_API(EntModelObj, 'UPD_PENDING_SETUP').then(function (data) {
                $scope.$parent.ENTITY_LIST = $scope.HR_ENTITY_LIST;
                $scope.ENTITY_LIST = $scope.HR_ENTITY_LIST;
                var ENTITY = []
                for (var i = 0; i < $scope.HR_ENTITY_LIST.length; i++) {
                    if ($scope.HR_ENTITY_LIST[i].HR_BRANCH_LIST.length > 0) {
                        ENTITY = $scope.HR_ENTITY_LIST[i];
                        break;
                    }
                }
                $scope.$parent.$parent.SelectEntity(ENTITY, 'HRM_ADMIN', getUrlParameter('ID', $location.absUrl()), $scope.ENTITY_LIST);
            });
        }
        else {
            $scope.$parent.ShowAlertBox('Attention', 'Please created atleast one site to get start.', 3000);
        }
    }
    $scope.PREVIOUS_Fn = function () {
        $location.path('Basic_Details');
    }
    $scope.EDIT_SITE_Fn = function (_branch, index) {
        $scope.ADMIN_GET_BRANCH_BY_ID(_branch, index);
    }



    $scope.ADD_MORE_ENTITY_Fn = function () {
        $scope.HR_ENTITY_LIST.push(angular.copy($scope.BLANK_ENTITY));
    };
    $scope.ADD_MORE_SITES_Fn = function () {
        $scope.HR_BRANCH_LIST.push(angular.copy($scope.BLANK_BRANCH));
    };

    $scope.ADD_ADDRESS_fn = function () {
        if ($scope.EntitySiteSearch.AUTO_SEARCH == 1) {
            $scope.EntitySiteSearch.LIMITED_COMPANY_NAME = "";
            $scope.EntitySiteSearch.ADDRESS_1 = "";
            $scope.EntitySiteSearch.ADDRESS_2 = "";
        }
    }

    $scope.ADD_SITE_Fn = function (_param_entity) {
        if ($scope.HR_BRANCH_LIST.length == $scope.HR_ENTITY_DTLS.NO_OF_SITES) {
            $scope.EntitySiteSearch.SHOW_MSG == true;
            alert('You need to subscribe for more. Click on to subscription link')
        }
        else {
            $scope.EntitySiteSearch.SHOW_MSG == false;
            _param_entity.SHOW_SITE_DTLS = !_param_entity.SHOW_SITE_DTLS;
        }
        if (!_param_entity.SHOW_ENTITY_DTLS) {
            _param_entity.SHOW_ENTITY_DTLS = !_param_entity.SHOW_ENTITY_DTLS;
        }
        _param_entity.POST_CODE_LABEL = 'Post Code'
        _param_entity.SHOW_HIDE_COUNTY = true;
        _param_entity.STATE_LABEL_NAME = 'State';
    }

    $scope.ENTITY_HEADER_CLICK_Fn = function (_parma_entity) {
        _parma_entity.SHOW_ENTITY_DTLS = !_parma_entity.SHOW_ENTITY_DTLS;
    }

    $scope.SELECTED_COUNTRY_Fn = function (_param_country, _param_branch, _param_Load_Flag) {
        if (_param_country == '') {
            _param_branch.HR_BRANCH_BY_ID.CUSTOM_COUNTRY_NAME = $scope.DD_DEFAULT_TEXT;
            _param_branch.HR_BRANCH_BY_ID.COUNTRY_ID = null;
            _param_branch.HR_BRANCH_BY_ID.STATE_ID = null;
            _param_branch.HR_BRANCH_BY_ID.CUSTOM_STATE_NAME = $scope.DD_DEFAULT_TEXT;
            _param_branch.HR_BRANCH_BY_ID.CURRENCY_ID = "";
            _param_branch.STATES = [];
        }
        else {
            _param_branch.HR_BRANCH_BY_ID.CUSTOM_COUNTRY_NAME = _param_country.DISPLAY_TEXT;
            _param_branch.HR_BRANCH_BY_ID.COUNTRY_ID = _param_country.COUNTRY_ID;
            _param_branch.HR_BRANCH_BY_ID.CURRENCY_ID = _param_country.CURRENCY_ID;

            //_param_branch.HR_BRANCH_BY_ID.STATE_ID = null;
            //_param_branch.HR_BRANCH_BY_ID.CUSTOM_STATE_NAME = $scope.DD_DEFAULT_TEXT;

            if (_param_Load_Flag == undefined) {
                _param_branch.HR_BRANCH_BY_ID.STATE_ID = null;
                _param_branch.HR_BRANCH_BY_ID.CUSTOM_STATE_NAME = $scope.DD_DEFAULT_TEXT;
            }
            $scope.GET_STATES(_param_branch, 0, 'SITE_LIST');
            _param_branch.HR_BRANCH_BY_ID.POST_CODE_LABEL = 'Post Code'
            _param_branch.HR_BRANCH_BY_ID.SHOW_HIDE_COUNTY = true;
            _param_branch.HR_BRANCH_BY_ID.STATE_LABEL_NAME = 'State';

            if (_param_branch.HR_BRANCH_BY_ID.COUNTRY_ID == 187 || _param_branch.HR_BRANCH_BY_ID.COUNTRY_ID == 224 || _param_branch.HR_BRANCH_BY_ID.COUNTRY_ID == 117 || _param_branch.HR_BRANCH_BY_ID.COUNTRY_ID == 174 || _param_branch.HR_BRANCH_BY_ID.COUNTRY_ID == 162 || _param_branch.HR_BRANCH_BY_ID.COUNTRY_ID == 19) { //GCC

                _param_branch.HR_BRANCH_BY_ID.POST_CODE_LABEL = 'PO Box'
                _param_branch.HR_BRANCH_BY_ID.STATE_LABEL_NAME = '';
                _param_branch.HR_BRANCH_BY_ID.SHOW_HIDE_COUNTY = false;

            }
            else if (_param_branch.HR_BRANCH_BY_ID.COUNTRY_ID == 225) {//UK

                _param_branch.HR_BRANCH_BY_ID.SHOW_HIDE_COUNTY = true;
                _param_branch.HR_BRANCH_BY_ID.STATE_LABEL_NAME = 'County';
                _param_branch.HR_BRANCH_BY_ID.POST_CODE_LABEL = 'Post Code'

            } else if (_param_branch.HR_BRANCH_BY_ID.COUNTRY_ID == 226) {//US

                _param_branch.HR_BRANCH_BY_ID.SHOW_HIDE_COUNTY = true;
                _param_branch.HR_BRANCH_BY_ID.POST_CODE_LABEL = 'Zip Code'
                _param_branch.HR_BRANCH_BY_ID.STATE_LABEL_NAME = 'State';

            }
        }
    }

    $scope.SELECTED_ENTITY_COUNTRY_Fn = function (_param_country, _param_branch) {
        if (_param_country == '') {
            _param_branch.CUSTOM_COUNTRY_NAME = $scope.DD_DEFAULT_TEXT;
            _param_branch.COUNTRY_ID = null;
            _param_branch.STATE_ID = null;
            _param_branch.CUSTOM_STATE_NAME = $scope.DD_DEFAULT_TEXT;
            _param_branch.STATES = [];
            _param_branch.CURRENCY_ID = "";
        }
        else {
            _param_branch.CUSTOM_COUNTRY_NAME = _param_country.DISPLAY_TEXT;
            _param_branch.COUNTRY_ID = _param_country.COUNTRY_ID;
            _param_branch.CURRENCY_ID = _param_country.CURRENCY_ID;
            $scope.GET_STATES(_param_branch, 0, 'ENTITY');
            _param_branch.STATE_ID = null;
            _param_branch.CUSTOM_STATE_NAME = $scope.DD_DEFAULT_TEXT;

            $scope.EntitySiteSearch.POST_CODE = 'Post Code'
            $scope.EntitySiteSearch.SHOW_HIDE_COUNTY = true;
            $scope.EntitySiteSearch.COUNTY_NAME = 'State';

            $scope.EntitySiteSearch.SHOW_HIDE_NI_NUMBER = true;
            if (_param_country.COUNTRY_ID == 187 || _param_country.COUNTRY_ID == 224 || _param_country.COUNTRY_ID == 117 || _param_country.COUNTRY_ID == 174 || _param_country.COUNTRY_ID == 162 || _param_country.COUNTRY_ID == 19) { //GCC
                $scope.EntitySiteSearch.POST_CODE = 'PO Box'
                $scope.EntitySiteSearch.COUNTY_NAME = '';
                $scope.EntitySiteSearch.SHOW_HIDE_COUNTY = false;
            }
            else if (_param_country.COUNTRY_ID == 225) {//UK
                $scope.EntitySiteSearch.SHOW_HIDE_COUNTY = true;
                $scope.EntitySiteSearch.COUNTY_NAME = 'County';
                $scope.EntitySiteSearch.POST_CODE = 'Post Code'
            } else if (_param_country.COUNTRY_ID == 226) {//US
                $scope.EntitySiteSearch.SHOW_HIDE_COUNTY = true;
                $scope.EntitySiteSearch.POST_CODE = 'Zip Code'
                $scope.EntitySiteSearch.COUNTY_NAME = 'State';
            }
        }
    }

    $scope.SELECTED_ENTITY_STATE_Fn = function (_param_state, _param_branch) {
        if (_param_state == '') {
            _param_branch.CUSTOM_STATE_NAME = $scope.DD_DEFAULT_TEXT;
        }
        else {
            _param_branch.CUSTOM_STATE_NAME = _param_state.STATE_NAME;
            _param_branch.STATE_ID = _param_state.STATE_ID;
        }
    }

    $scope.SELECTED_STATE_Fn = function (_param_state, _param_branch) {
        if (_param_state == '') {
            _param_branch.HR_BRANCH_BY_ID.CUSTOM_STATE_NAME = $scope.DD_DEFAULT_TEXT;
        }
        else {
            _param_branch.HR_BRANCH_BY_ID.CUSTOM_STATE_NAME = _param_state.STATE_NAME;
            _param_branch.HR_BRANCH_BY_ID.STATE_ID = _param_state.STATE_ID;
        }
    }

    $scope.COUNTRY_BRANCH_Fn = function (_branch) {
        _branch.HR_BRANCH_BY_ID.COUNTRY_ID = 0;
    }

    $scope.LET_GET_START_Fn = function (PATH_FLAG) {
        if (PATH_FLAG == 1) {
            $location.path('Basic_Details').search('ID', getUrlParameter('ID', $location.absUrl()), { 'path': '/' })
        } else if (PATH_FLAG == 2) {
            $location.path('Enter_Sites').search('ID', getUrlParameter('ID', $location.absUrl()), { 'path': '/' })
        }
    }

    $scope.DELETE_ENTITY_DTLS_Fn = function (_param_entity, index) {
        if (_param_entity.ENTITY_ID == 0) {
            $scope.HR_ENTITY_LIST.splice(index, 1)
            $scope.$parent.ShowAlertBox('Success', 'Entity Deleted Successfully', 3000);
        }
        else if (_param_entity.ENTITY_ID > 0) {
            if (confirm('Are you sure, do you want to proceed?')) {
                var EntModelObj = new Object();
                EntModelObj.ENTITY_ID = _param_entity.ENTITY_ID;
                EntModelObj.USER_ID = $scope.EntitySiteSearch.USER_ID;
                PrcCommMethods.HUMANRESOURCE_API(EntModelObj, 'DELETE_ENTITY').then(function (data) {
                    $scope.$parent.ShowAlertBox('Success', 'Entity Added Successfully', 3000);
                    $scope.ADMIN_GET_BRANCH_LIST();
                });
            }
        }
    }
    $scope.DELETE_BRANCH_DTLS_Fn = function (_param_line, index) {
        if (confirm('Are you sure, do you want to proceed?')) {
            var EntModelObj = new Object();
            EntModelObj.BRANCH_ID = _param_line.BRANCH_ID;
            EntModelObj.USER_ID = $scope.EntitySiteSearch.USER_ID;
            PrcCommMethods.HUMANRESOURCE_API(EntModelObj, 'DELETE_BRANCH').then(function (data) {
                $scope.ADMIN_GET_BRANCH_LIST();
                $scope.$parent.ShowAlertBox('Success', 'Branch Deleted Successfully', 3000);
            });
        }
    }
    $scope.POP_ADD_ENTITY_Fn = function () {
        $scope.RESET_Fn();
        $('#AddEntity').modal('show');
    };
    $scope.$parent.$parent.HIDE_HEADER_DETAIL = false;
    $scope.$parent.$parent.overlay_loading_HR_Loader = 'none';
});