app.controller('OrganisationController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $localStorage) {
    //$scope.$parent.DISPLAY_FLAG = true;
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(1);
    $scope.HR_COMMON_CODE_Fn();
    $scope.OrganisationSearch = {
        CUSTOMER_ID: $cookies.get("CUSTOMER_ID"),
        ENTITY_ID: null,
        DD_DEFAULT_TEXT: $scope.$parent.DD_DEFAULT_TEXT,
        USER_ID: $cookies.get("USERID"),
        UK_PINCODE_REG_X: $scope.$parent.UK_PINCODE_REG_X,
        GCC_PINCODE_REG_X: $scope.$parent.GCC_PINCODE_REG_X,
        US_PINCODE_REG_X: $scope.$parent.US_PINCODE_REG_X,
    }
    $scope.HR_ENTITY_LIST = [];
    $scope.HR_BRANCH_LIST = [];
    $scope.TIME_ZONE_NAME_LIST = [];
    $scope.DEPARTMENTS_LIST = [];
    $scope.HIDE_FILED = false;
    $scope.UPLOAD_FOLDER_NAME = "Uploads";
    if (parseInt(getUrlParameter('ID', $location.absUrl())) > 0 && ($scope.OrganisationSearch.USER_ID == "" || $scope.OrganisationSearch.USER_ID == null || $scope.OrganisationSearch.USER_ID == undefined)) {
        $cookies.put('USERID', $scope.OrganisationSearch.USER_ID, { 'path': '/' });
    };

    $scope.BLANK_ENTITY = {
        ENTITY_ID: 0, ENTITY_NAME: 'New Entity', SHOW_HIDE: true, HR_ENTITY_BY_ID: { CUSTOM_COUNTRY_NAME: $scope.DD_DEFAULT_TEXT, CUSTOM_STATE_NAME: $scope.DD_DEFAULT_TEXT, CUSTOM_CURRENCY_NAME: $scope.DD_DEFAULT_TEXT, FINANCIAL_YEAR_START_MONTH: 1, PR_NO_PREFIX: null, PR_NO_SUFFIX: null, PR_NO_MIN_LENGTH_EXCLUDING_PREFIX_AND_SUFFIX: 5, REQ_NO_MIN_LENGTH_EXCLUDING_PREFIX_AND_SUFFIX: 5, PO_NO_MIN_LENGTH_EXCLUDING_PREFIX_AND_SUFFIX: 5, REQ_NO_PREFIX: 'REQ-', PO_NO_PREFIX: 'PO-' }
    };
    $scope.BLANK_BRANCH = { BRANCH_ID: 0, BRANCH_NAME: 'New Site', SHOW_HIDE: true, HR_BRANCH_BY_ID: { CUSTOM_ENTITY_NAME: $scope.DD_DEFAULT_TEXT, CUSTOM_COUNTRY_NAME: $scope.DD_DEFAULT_TEXT, CUSTOM_STATE_NAME: $scope.DD_DEFAULT_TEXT, CUSTOM_CURRENCY_NAME: $scope.DD_DEFAULT_TEXT, BRANCH_NAME: 'New Site' } };
    $scope.FINANCIAL_YEAR_START_MONTH_LIST = [
        { ID: 1, Text: 'January' },
        { ID: 2, Text: 'February' },
        { ID: 3, Text: 'March' },
        { ID: 4, Text: 'April' },
        { ID: 5, Text: 'May' },
        { ID: 6, Text: 'June' },
        { ID: 7, Text: 'July' },
        { ID: 8, Text: 'August' },
        { ID: 9, Text: 'September' },
        { ID: 10, Text: 'October' },
        { ID: 11, Text: 'November' },
        { ID: 12, Text: 'December' }
    ];
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
        UserModelObj.CUSTOMER_ID = $scope.OrganisationSearch.CUSTOMER_ID;
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
        UserModelObj.CUSTOMER_ID = $scope.OrganisationSearch.CUSTOMER_ID;
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'ADMIN_GET_BRANCH_LIST').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.HR_BRANCH_LIST = data.data.Table;
            }
            else if (data.data == null) {
                $scope.$parent.ShowAlert("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
        });
    }
    $scope.ADMIN_GET_ENTITY_BY_ID = function (_param_entity, _param_line, _param_active) {
        _param_active == undefined ? _param_entity.SHOW_HIDE = !_param_entity.SHOW_HIDE : '';
        if (_param_entity.HR_ENTITY_BY_ID == undefined) {
            var UserModelObj = new Object();
            UserModelObj.ENTITY_ID = _param_entity.ENTITY_ID;
            PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'ADMIN_GET_ENTITY_BY_ID').then(function (data) {
                if (data.data.Table.length > 0) {
                    _param_entity.HR_ENTITY_BY_ID = data.data.Table[0];
                    _param_entity.ENTITY_MODULE_LIST = data.data.Table1;
                    if (_param_entity.HR_ENTITY_BY_ID.COUNTRY_ID > 0) {
                        var _result_country = $scope.COUNTRY_LIST.filter(function (_param_country) { return _param_country.COUNTRY_ID == _param_entity.HR_ENTITY_BY_ID.COUNTRY_ID });
                        $scope.SELECTED_ENTITY_COUNTRY_Fn(_result_country[0], _param_entity, 1);
                        _param_entity.HR_ENTITY_BY_ID.CUSTOM_STATE_NAME = _param_entity.HR_ENTITY_BY_ID.STATE_NAME;
                    }
                    else {
                        _param_entity.HR_ENTITY_BY_ID.CUSTOM_COUNTRY_NAME = $scope.DD_DEFAULT_TEXT;
                        _param_entity.HR_ENTITY_BY_ID.CUSTOM_STATE_NAME = $scope.DD_DEFAULT_TEXT;
                    };

                    if (_param_entity.HR_ENTITY_BY_ID.CURRENCY_ID == undefined || _param_entity.HR_ENTITY_BY_ID.CURRENCY_ID == null || _param_entity.HR_ENTITY_BY_ID.CURRENCY_ID == "") {
                        $scope.SELECTED_ENTITY_CURRENCY_Fn('', _param_entity);
                    }
                    else {
                        _param_entity.HR_ENTITY_BY_ID.CUSTOM_CURRENCY_NAME = _param_entity.HR_ENTITY_BY_ID.CURRENCY_NAME;
                    };
                    if (_param_active == 0) {
                        $scope.ADMIN_INS_UPD_ENTITIES(_param_entity, _param_line, _param_active);
                    }
                }
                else if (data.data == null) {
                    $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                }
            });
        }
        else {
            if (_param_active == 0) {
                $scope.ADMIN_INS_UPD_ENTITIES(_param_entity, _param_line, _param_active);
            }
            if (_param_entity.HR_ENTITY_BY_ID.COUNTRY_ID > 0) {
                var _result_country = $scope.COUNTRY_LIST.filter(function (_param_country) { return _param_country.COUNTRY_ID == _param_entity.HR_ENTITY_BY_ID.COUNTRY_ID });
                if (_result_country.length > 0) {
                    $scope.SELECTED_ENTITY_COUNTRY_Fn(_result_country[0], _param_entity, 1);
                    _param_entity.HR_ENTITY_BY_ID.CUSTOM_STATE_NAME = _param_entity.HR_ENTITY_BY_ID.STATE_NAME;
                }
            }
            if (_param_entity.HR_ENTITY_BY_ID.CURRENCY_ID == undefined || _param_entity.HR_ENTITY_BY_ID.CURRENCY_ID == null || _param_entity.HR_ENTITY_BY_ID.CURRENCY_ID == "") {
                $scope.SELECTED_ENTITY_CURRENCY_Fn('', _param_entity);
            }
            else {
                _param_entity.HR_ENTITY_BY_ID.CUSTOM_CURRENCY_NAME = _param_entity.HR_ENTITY_BY_ID.CURRENCY_NAME;
            }
        }
    }
    $scope.ADMIN_GET_BRANCH_BY_ID = function (_param_branch) {
        _param_branch.SHOW_HIDE = !_param_branch.SHOW_HIDE;
        if (_param_branch.HR_BRANCH_BY_ID == undefined) {
            var UserModelObj = new Object();
            UserModelObj.BRANCH_ID = _param_branch.BRANCH_ID;
            PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'ADMIN_GET_BRANCH_BY_ID').then(function (data) {
                if (data.data.Table.length > 0) {
                    _param_branch.HR_BRANCH_BY_ID = data.data.Table[0];
                    var result = _param_branch.HR_BRANCH_BY_ID.ADDRESS != null && _param_branch.HR_BRANCH_BY_ID.ADDRESS != undefined ? _param_branch.HR_BRANCH_BY_ID.ADDRESS.split(':;:') : '';
                    if (result.length > 0) {
                        _param_branch.HR_BRANCH_BY_ID.ADDRESS_1 = result[0];
                        _param_branch.HR_BRANCH_BY_ID.ADDRESS_2 = result[1] == 'undefined' ? '' : result[1];
                    }
                    if (_param_branch.HR_BRANCH_BY_ID.ENTITY_ID > 0) {
                        _param_branch.HR_BRANCH_BY_ID.CUSTOM_ENTITY_NAME = _param_branch.HR_BRANCH_BY_ID.ENTITY_NAME;
                    }
                    else {
                        param_branch.HR_BRANCH_BY_ID.CUSTOM_ENTITY_NAME = $scope.DD_DEFAULT_TEXT;
                    }
                    if (_param_branch.HR_BRANCH_BY_ID.COUNTRY_ID > 0) {
                        var _result_country = $scope.COUNTRY_LIST.filter(function (_param_country) { return _param_country.COUNTRY_ID == _param_branch.HR_BRANCH_BY_ID.COUNTRY_ID });
                        $scope.SELECTED_BRANCH_COUNTRY_Fn(_result_country[0], _param_branch, 1);
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
                else if (data.data == null) {
                    $scope.$parent.ShowAlert("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                }

            });
        } else {
            var result = _param_branch.HR_BRANCH_BY_ID.ADDRESS != null && _param_branch.HR_BRANCH_BY_ID.ADDRESS != undefined ? _param_branch.HR_BRANCH_BY_ID.ADDRESS.split(':;:') : '';
            if (result.length > 0) {
                _param_branch.HR_BRANCH_BY_ID.ADDRESS_1 = result[0];
                _param_branch.HR_BRANCH_BY_ID.ADDRESS_2 = result[1] == 'undefined' ? '' : result[1];
            }

            if (_param_branch.HR_BRANCH_BY_ID.COUNTRY_ID > 0) {
                var _result_country = $scope.COUNTRY_LIST.filter(function (_param_country) { return _param_country.COUNTRY_ID == _param_branch.HR_BRANCH_BY_ID.COUNTRY_ID });
                $scope.SELECTED_BRANCH_COUNTRY_Fn(_result_country[0], _param_branch, 1);
                _param_branch.HR_BRANCH_BY_ID.CUSTOM_STATE_NAME = _param_branch.HR_BRANCH_BY_ID.STATE_NAME;
            }
            else {
                _param_branch.HR_BRANCH_BY_ID.CUSTOM_COUNTRY_NAME = $scope.DD_DEFAULT_TEXT;
                _param_branch.HR_BRANCH_BY_ID.CUSTOM_STATE_NAME = $scope.DD_DEFAULT_TEXT;
            };
            if (_param_branch.HR_BRANCH_BY_ID.ENTITY_ID > 0) {
                _param_branch.HR_BRANCH_BY_ID.CUSTOM_ENTITY_NAME = _param_branch.HR_BRANCH_BY_ID.ENTITY_NAME;
            }
            else {
                param_branch.HR_BRANCH_BY_ID.CUSTOM_ENTITY_NAME = $scope.DD_DEFAULT_TEXT;
            }
            if (_param_branch.HR_BRANCH_BY_ID.CURRENCY_ID == undefined || _param_branch.HR_BRANCH_BY_ID.CURRENCY_ID == null || _param_branch.HR_BRANCH_BY_ID.CURRENCY_ID == "") {
                $scope.SELECTED_BRANCH_CURRENCY_Fn('', _param_branch);
            }
            else {
                _param_branch.HR_BRANCH_BY_ID.CUSTOM_CURRENCY_NAME = _param_branch.HR_BRANCH_BY_ID.CURRENCY_NAME;
            };
        }
    }

    $scope.HRM_GET_DEPARTMENTS = function () {
        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_ID = $scope.OrganisationSearch.CUSTOMER_ID;
        CusModelObj.ENTITY_ID = null;
        CusModelObj.PAGE_NO = 1;
        CusModelObj.PAGE_SIZE = 10;
        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_GET_DEPARTMENTS').then(function (data) {
            $scope.DEPARTMENTS_LIST = data.data.Table;
        });
    }
    $scope.HRM_GET_POSITIONS = function () {
        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_ID = $scope.OrganisationSearch.CUSTOMER_ID;
        CusModelObj.ENTITY_ID = null;
        CusModelObj.PAGE_NO = 1;
        CusModelObj.PAGE_SIZE = 10;
        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_GET_POSITIONS').then(function (data) {
            $scope.POSITIONS_LIST = data.data.Table;

        });
    }
    $scope.HRM_GET_SECTIONS = function () {
        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_ID = $scope.OrganisationSearch.CUSTOMER_ID;
        CusModelObj.ENTITY_ID = null;
        CusModelObj.PAGE_NO = 1;
        CusModelObj.PAGE_SIZE = 10;
        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_GET_SECTIONS').then(function (data) {
            $scope.SECTIONS_LIST = data.data.Table;

        });
    }
    $scope.HRM_GET_ASSETS = function () {
        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_ID = $scope.OrganisationSearch.CUSTOMER_ID;
        CusModelObj.ENTITY_ID = null;
        CusModelObj.PAGE_NO = 1;
        CusModelObj.PAGE_SIZE = 10;
        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_GET_ASSETS').then(function (data) {
            $scope.ASSETS_LIST = data.data.Table;

        });
    }
    $scope.HRM_GET_TAGS = function () {
        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_ID = $scope.OrganisationSearch.CUSTOMER_ID;
        CusModelObj.ENTITY_ID = null;
        CusModelObj.PAGE_NO = 1;
        CusModelObj.PAGE_SIZE = 10;
        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_GET_TAGS').then(function (data) {
            $scope.TAGS_LIST = data.data.Table;

        });
    }

    $scope.GET_STATES = function (_param_entity, _param_index, _param_call_flag) {
        _param_entity.STATES = [];
        var CusModelObj = new Object();
        if (_param_call_flag == 'ENTITY') {
            $('#single-select-tagging' + _param_index).select2({ minimumResultsForSearch: -1, allowClear: true });
            CusModelObj.COUNTRY_ID = _param_entity.HR_ENTITY_BY_ID.COUNTRY_ID;
        }
        else if (_param_call_flag == 'SITE') {
            $('#branch_single_select_tagging' + _param_index).select2({ minimumResultsForSearch: -1, allowClear: true });
            CusModelObj.COUNTRY_ID = _param_entity.HR_BRANCH_BY_ID.COUNTRY_ID;
        }
        PrcCommMethods.HR_API(CusModelObj, 'GET_STATES').then(function (data) {
            _param_entity.STATES = data.data.Table;
            if (_param_call_flag == 'ENTITY') {
                $('#single-select-tagging' + _param_index).select2({ minimumResultsForSearch: -1, allowClear: true });
                _param_entity.HR_ENTITY_BY_ID.POST_BOX_LABEL_NAME = "Post Code";
                if (_param_entity.HR_ENTITY_BY_ID.COUNTRY_ID == 187 || _param_entity.HR_ENTITY_BY_ID.COUNTRY_ID == 224 || _param_entity.HR_ENTITY_BY_ID.COUNTRY_ID == 117 || _param_entity.HR_ENTITY_BY_ID.COUNTRY_ID == 174 || _param_entity.HR_ENTITY_BY_ID.COUNTRY_ID == 162 || _param_entity.HR_ENTITY_BY_ID.COUNTRY_ID == 19) {
                    _param_entity.HR_ENTITY_BY_ID.POST_BOX_LABEL_NAME = 'PO Box'
                    _param_entity.HR_ENTITY_BY_ID.STATE_LABEL_NAME = '';
                }

            }
            else if (_param_call_flag == 'SITE') {
                $('#branch_single_select_tagging' + _param_index).select2({ minimumResultsForSearch: -1, allowClear: true });
                _param_entity.HR_BRANCH_BY_ID.POST_BOX_LABEL_NAME = "Post Code";
                if (_param_entity.HR_BRANCH_BY_ID.COUNTRY_ID == 187 || _param_entity.HR_BRANCH_BY_ID.COUNTRY_ID == 224 || _param_entity.HR_BRANCH_BY_ID.COUNTRY_ID == 117 || _param_entity.HR_BRANCH_BY_ID.COUNTRY_ID == 174 || _param_entity.HR_BRANCH_BY_ID.COUNTRY_ID == 162 || _param_entity.HR_BRANCH_BY_ID.COUNTRY_ID == 19) {
                    _param_entity.HR_BRANCH_BY_ID.POST_BOX_LABEL_NAME = 'PO Box'
                    _param_entity.HR_BRANCH_BY_ID.STATE_LABEL_NAME = '';
                }
            }

        });
    };
    $scope.GET_CURRENCY = function () {
        var PosiModelObj = new Object();
        PosiModelObj.CUSTOMER_ID = $scope.OrganisationSearch.CUSTOMER_ID;
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

    $scope.ADMIN_GET_COUNTRY();
    $scope.ADMIN_GET_ENTITY_LIST();
    $scope.ADMIN_GET_BRANCH_LIST();

    $scope.REMOVE_PROFILE_IMG = function (_list) {
        _list.LOGO_PATH = null;
    }

    $scope.UPLOAD_FILES = function (FOLDER_NAME, INDEX, FILE) {
        // $scope.HR_ENTITY_LIST[INDEX].HR_ENTITY_BY_ID.LOGO_PATH = '';
        //$scope.HR_ENTITY_LIST[INDEX].HR_ENTITY_BY_ID = [];
        var Temp_Floader = '';
        var guid = 1;
        if (FOLDER_NAME == 'ENTITY') {
            guid = 1;
            // Temp_Floader = "/"+ FOLDER_NAME + "_" + INDEX + '_';
            Temp_Floader = "/" + FOLDER_NAME + "/";
        } else if (FOLDER_NAME == 'SITE') {
            guid = 1;
            //Temp_Floader = "/" + FOLDER_NAME + "_" + INDEX + '_';
            Temp_Floader = "/" + FOLDER_NAME + "/";
        }
        var data = new FormData();
        data.append("CUSTOMER_ID", $scope.OrganisationSearch.CUSTOMER_ID); /// Use for old      
        data.append("FILE_PATH", Temp_Floader);
        data.append("GUID", guid);
        data.append("file", FILE);

        var _api_path = CommService.GET_HUMANRESOURCE_API() + "api/HumanResourceAPI/UPLOAD_FILE";
        var request = { method: 'POST', url: _api_path, data: data, headers: { 'Content-Type': undefined } };
        $http(request).then(function (d) {
            if (FOLDER_NAME == 'ENTITY') {
                $scope.HR_ENTITY_LIST[INDEX].HR_ENTITY_BY_ID.LOGO_PATH = d.data;
            }
            else if (FOLDER_NAME == 'SITE') {
                $scope.HR_BRANCH_LIST[INDEX].HR_BRANCH_BY_ID.LOGO_PATH = d.data;
            }
            $scope.CLOSE_UPLOAD_Fn();
        });
    };

    $scope.GET_CURRENCY();
    $scope.GET_TIME_ZONE_DROPDOWN();
    $scope.UPDATE_LOGOPATH = function (VAL) {
        VAL = $scope.UPDATED_LOGOPATH;
    }

    $scope.PAGE_LOAD_ENTITY = 1;
    $scope.$on('ngRepeatFinishedEntityRender', function (ngRepeatFinishedEvent) {
        angular.forEach($scope.HR_ENTITY_LIST, function (_value, index) {
            $("#single-select-tagging" + index).select2({ minimumResultsForSearch: -1, });
            $("#single-select-taggingC" + index).select2({ minimumResultsForSearch: -1, });
            $("#single-select-taggingS" + index).select2({ minimumResultsForSearch: -1, });
            $("#single-select-taggingF" + index).select2({ minimumResultsForSearch: -1, });
            $("#single-select-taggingT" + index).select2({ minimumResultsForSearch: -1, });
        });
    });
    $scope.$on('ngRepeatFinishedBranchRender', function (ngRepeatFinishedEvent) {
        angular.forEach($scope.HR_BRANCH_LIST, function (_value, index) {
            $("#Branch_single-select-tagging" + index).select2({ minimumResultsForSearch: -1, });
            $("#Branch_single-select-taggingC" + index).select2({ minimumResultsForSearch: -1, });
            $("#Branch_single-select-taggingS" + index).select2({ minimumResultsForSearch: -1, });
            $("#Branch_single-select-taggingF" + index).select2({ minimumResultsForSearch: -1, });
            $("#Branch_single-select-taggingT" + index).select2({ minimumResultsForSearch: -1, });
            $(".single-select").select2({ minimumResultsForSearch: -1, });
        });
    });
    $scope.ADMIN_INS_UPD_ENTITIES_AND_LOCATION = function (_param_Header, _param_line, _param_active) {
        _param_Header.entityform.submitted = true;
        var EntModelObj = new Object();
        var validationCount = 0;
        if (_param_Header.entityform.$valid && _param_active == 1) {
            if (_param_line.LOGO_PATH == undefined || _param_line.LOGO_PATH == "" || _param_line.LOGO_PATH == null) {
                validationCount = 1;
                $scope.$parent.ShowAlertBox('Attention', 'Please upload logo.', 3000);
                return;
            }
        }
        if (_param_Header.entityform.$valid && validationCount == 0) {
            EntModelObj.CUSTOMER_ID = $scope.OrganisationSearch.CUSTOMER_ID;
            EntModelObj.ENTITY_ID = _param_line.ENTITY_ID == null ? 0 : _param_line.ENTITY_ID;
            EntModelObj.ENTITY_NAME = _param_line.ENTITY_NAME;
            EntModelObj.ADDRESS_1 = _param_line.ADDRESS_1;
            EntModelObj.ADDRESS_2 = _param_line.ADDRESS_2;
            EntModelObj.CITY_NAME = _param_line.CITY_NAME;
            EntModelObj.STATE_ID = _param_line.STATE_ID;
            EntModelObj.COUNTRY_ID = _param_line.COUNTRY_ID;
            EntModelObj.ZIPCODE = _param_line.ZIPCODE;
            EntModelObj.CURRENCY_ID = _param_line.CURRENCY_ID;
            EntModelObj.CONTACT_NAME = _param_line.CONTACT_NAME;
            EntModelObj.CONTACT_NUMBER = _param_line.CONTACT_NUMBER;
            EntModelObj.CONTACT_EMAIL = _param_line.CONTACT_EMAIL;
            EntModelObj.LIMITED_COMPANY_NAME = _param_line.LIMITED_COMPANY_NAME;
            EntModelObj.COMPANY_REGISTRATION_NO = _param_line.COMPANY_REGISTRATION_NO;
            EntModelObj.USER_ID = parseInt($cookies.get("USERID"));
            EntModelObj.LOGO_PATH = _param_line.LOGO_PATH;
            EntModelObj.FINANCIAL_YEAR_START_MONTH = (_param_line.FINANCIAL_YEAR_START_MONTH == undefined || _param_line.FINANCIAL_YEAR_START_MONTH == "" || _param_line.FINANCIAL_YEAR_START_MONTH == null) ? 1 : _param_line.FINANCIAL_YEAR_START_MONTH;
            EntModelObj.TIME_ZONE_NAME = _param_line.TIME_ZONE_NAME;
            PrcCommMethods.HUMANRESOURCE_API(EntModelObj, 'ADMIN_INS_UPD_ENTITIES_AND_LOCATION').then(function (data) {
                if (data.data == 0) {
                    $scope.$parent.ShowAlertBox('Error', $scope.$parent.SOMETHINGWENTWRONG, 3000);
                }
                if (data.data > 1) {
                    if (_param_line.ENTITY_ID == parseInt($cookies.get("ENTITY_ID"))) {
                        $cookies.put('COUNTRY_ID', _param_line.COUNTRY_ID, { 'path': '/' });
                        $cookies.put('CURRENCY_ID', _param_line.CURRENCY_ID, { 'path': '/' });
                        $cookies.put('CURRENCY_CODE', _param_line.CURRENCY_CODE, { 'path': '/' });
                        $cookies.put('CURRENCY_SYMBOL', _param_line.CURRENCY_SYMBOL, { 'path': '/' });
                        $cookies.put('TWO_DIGIT_COUNTRY_CODE', _param_line.TWO_DIGIT_COUNTRY_CODE == null || _param_line.TWO_DIGIT_COUNTRY_CODE == '' || _param_line.TWO_DIGIT_COUNTRY_CODE == undefined ? 'gb' : _param_line.TWO_DIGIT_COUNTRY_CODE, { 'path': '/' });
                        //$cookies.put('TIMEZONE_OFFSET', _param_line.TIMEZONE_OFFSET, { 'path': '/' });
                        $cookies.put('ENTITY_NAME', _param_line.ENTITY_NAME, { 'path': '/' });
                        $cookies.put('LOGO_PATH', _param_line.LOGO_PATH, { 'path': '/' });
                        if (_param_line.CURRENCY_CULTURE == undefined) {
                            $cookies.put('CURRENCY_CULTURE', 'en-GB', { 'path': '/' });
                        }
                        else {
                            $cookies.put('CURRENCY_CULTURE', _param_line.CURRENCY_CULTURE, { 'path': '/' });
                        }
                        $scope.$parent.LOGO_PATH = _param_line.LOGO_PATH;
                        //$localStorage.ENTITY_LIST = JSON.stringify(data.data.Table1);
                    }
                    var ENTITY_LIST = JSON.parse($localStorage.ENTITY_LIST);
                    angular.forEach(ENTITY_LIST, function (_loop_val) {
                        if (_param_line.ENTITY_ID == _loop_val.ENTITY_ID) {
                            //_loop_val.COUNTRY_ID = _param_line.COUNTRY_ID;
                            //_loop_val.CURRENCY_CODE = _param_line.CURRENCY_CODE;
                            //_loop_val.CURRENCY_SYMBOL = _param_line.CURRENCY_SYMBOL;
                            //_loop_val.TWO_DIGIT_COUNTRY_CODE = _param_line.TWO_DIGIT_COUNTRY_CODE;
                            //_loop_val.COUNTRY_ID = _param_line.COUNTRY_ID;
                            _loop_val.ENTITY_NAME = _param_line.ENTITY_NAME;
                            _loop_val.LOGO_PATH = _param_line.LOGO_PATH;
                        }
                    });
                    $localStorage.ENTITY_LIST = JSON.stringify(ENTITY_LIST);
                    if (_param_line.ENTITY_ID == 0) {
                        _param_Header.SHOW_HIDE = false;
                        $scope.$parent.ShowAlertBox('Success', 'Entity Added Successfully', 3000);
                        $scope.ADMIN_GET_ENTITY_LIST();
                    }
                    else {
                        _param_Header.SHOW_HIDE = false;
                        $scope.$parent.ShowAlertBox('Success', 'Entity Updated Successfully', 3000);
                    }
                    window.scrollTo(0, 0);
                    //$scope.ADMIN_GET_ENTITY_LIST();
                    //$scope.ADMIN_GET_BRANCH_LIST();
                }
            });
        }
    };
    $scope.ADMIN_INS_UPD_BRANCH = function (_param_Header, _param_line, _param_index, _param_form) {
        _param_Header.branchform.submitted = true;
        var EntModelObj = new Object();
        if (_param_Header.branchform.$valid) {
            var LogCount = 0;
            if (_param_line.LOGO_PATH == undefined || _param_line.LOGO_PATH == "" || _param_line.LOGO_PATH.length == 0) {
                LogCount++;
            }
            if (LogCount > 0) {
                $scope.$parent.ShowAlertBox('Attention', 'Please upload logo.', 3000);
            }
        }
        if (_param_Header.branchform.$valid && LogCount == 0) {
            EntModelObj.CUSTOMER_ID = $scope.OrganisationSearch.CUSTOMER_ID;
            EntModelObj.BRANCH_ID = _param_line.BRANCH_ID == null ? 0 : _param_line.BRANCH_ID;
            EntModelObj.ENTITY_ID = _param_line.ENTITY_ID;
            EntModelObj.LOCATION_ID = _param_line.LOCATION_ID;
            EntModelObj.CURRENCY_ID = _param_line.CURRENCY_ID;
            EntModelObj.STATE_ID = _param_line.STATE_ID;
            EntModelObj.COUNTRY_ID = _param_line.COUNTRY_ID;
            EntModelObj.CITY = _param_line.CITY_NAME;
            EntModelObj.BRANCH_NAME = _param_line.BRANCH_NAME;
            EntModelObj.BRANCH_ADDRESS = _param_line.ADDRESS_1 + ":;:" + (_param_line.ADDRESS_2 == undefined || _param_line.ADDRESS_2 == null ? "" : _param_line.ADDRESS_2);
            EntModelObj.CONTACT_NAME = _param_line.CONTACT_NAME == undefined || _param_line.CONTACT_NAME == "" || _param_line.CONTACT_NAME == null ? "" : _param_line.CONTACT_NAME;
            EntModelObj.CONTACT_NUMBER = _param_line.CONTACT_NUMBER;
            EntModelObj.CONTACT_EMAIL = _param_line.CONTACT_EMAIL == undefined || _param_line.CONTACT_EMAIL == "" || _param_line.CONTACT_EMAIL == null ? "" : _param_line.CONTACT_EMAIL;
            EntModelObj.ZIPCODE = _param_line.ZIPCODE;
            EntModelObj.FAX = _param_line.FAX;
            EntModelObj.USER_ID = parseInt($cookies.get("USERID"));
            EntModelObj.ACTIVE = 1;//_param_line.ACTIVE == true ? 1 : 0;
            EntModelObj.COPY_FROM_TABLE_ID = null;
            EntModelObj.LATITUDE = _param_line.LATITUDE;
            EntModelObj.LONGITUDE = _param_line.LONGITUDE;
            EntModelObj.GEOFENCE_RADIUS = _param_line.GEOFENCE_RADIUS;
            EntModelObj.TIME_ZONE_NAME = _param_line.TIME_ZONE_NAME == undefined || _param_line.TIME_ZONE_NAME == "" ? null : _param_line.TIME_ZONE_NAME;
            EntModelObj.ORIGINAL_LATITUDE = _param_line.ORIGINAL_LATITUDE;
            EntModelObj.ORIGINAL_LONGITUDE = _param_line.ORIGINAL_LONGITUDE;
            EntModelObj.VARIANCE = _param_line.VARIANCE;
            EntModelObj.LOGO_PATH = _param_line.LOGO_PATH;
            EntModelObj.IS_REVENUE_BRANCH = _param_line.IS_REVENUE_BRANCH ? 1 : 0;
            EntModelObj.USE_EPOS_COVERS_IN_DASHBOARDS = _param_line.USE_EPOS_COVERS_IN_DASHBOARDS ? 1 : 0;
            EntModelObj.SHOW_IN_DASHBOARD = _param_line.SHOW_IN_DASHBOARD ? 1 : 0;
            PrcCommMethods.ADMIN_API(EntModelObj, 'ADMIN_INS_UPD_BRANCH').then(function (data) {
                if (data.data == 0) {
                    $scope.$parent.ShowAlertBox('Error', $scope.$parent.SOMETHINGWENTWRONG, 3000);
                }
                else {
                    var _var_msg = "Site Added Successfully";
                    _param_Header.SHOW_HIDE = false;
                    if (_param_line.BRANCH_ID > 0) {
                        _var_msg = 'Site Updated Successfully';
                        _param_Header.SHOW_HIDE = false;
                        // $scope.ADMIN_GET_BRANCH_LIST();
                    }
                    else {
                        $scope.ADMIN_GET_BRANCH_LIST();
                    }
                    $scope.$parent.ShowAlertBox('Success', _var_msg, 3000);

                    //_param_Header.SHOW_HIDE = false;
                }
                window.scrollTo(0, 0);
            });
        }
    };

    $scope.HRM_INS_UPD_DEPARTMENTS = function (_param_department) {
        var CusModelObj = new Object();
        CusModelObj.DEPARTMENT_ID = _param_department.DEPARTMENT_ID;
        CusModelObj.DEPARTMENT_NAME = _param_department.DISPLAY_TEXT;
        CusModelObj.CUSTOMER_ID = $scope.OrganisationSearch.CUSTOMER_ID;
        CusModelObj.ENTITY_ID = $scope.OrganisationSearch.ENTITY_ID;
        CusModelObj.ACTIVE = _param_department.ACTIVE;
        CusModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_INS_UPD_DEPARTMENTS').then(function (data) {
            $scope.TAGS_LIST = data.data.Table;
        });
    }
    $scope.OR_TAB_CLICK_Fn = function (TAB_ID) {
        $scope.TAB_ID = TAB_ID;
        if (TAB_ID == 2) {
            $scope.HRM_GET_DEPARTMENTS();
            $scope.HRM_GET_POSITIONS();
            $scope.HRM_GET_SECTIONS();
            $scope.HRM_GET_ASSETS();
            $scope.HRM_GET_TAGS();
        };
    }
    $scope.OR_TAB_CLICK_Fn(1);
    $scope.ADD_MORE_ENTITY_Fn = function () {
        $scope.HR_ENTITY_LIST.push(angular.copy($scope.BLANK_ENTITY));
        $scope.$parent.UPLOAD_CODE_Fn();
    };

    $scope.ADD_MORE_SITES_Fn = function () {
        if ($scope.HR_BRANCH_LIST.length < $scope.HR_ENTITY_DTLS.NO_OF_SITES) {
            $scope.HR_BRANCH_LIST.push(angular.copy($scope.BLANK_BRANCH));
        } else {
            $scope.$parent.ShowAlertBox('Attention', 'You have reached the maximum limit of your subscription. Please contact support or your account manager to review the same.', 3000);

        }
        //if ($scope.HR_ENTITY_DTLS.NO_OF_SITES <= $scope.HR_BRANCH_LIST.length) {
        //    $scope.$parent.ShowAlertBox('Attention', 'Created sites should not be greater than ' + $scope.HR_ENTITY_DTLS.NO_OF_SITES, 3000);          
        //}
        //else {
        //    $scope.HR_BRANCH_LIST.push(angular.copy($scope.BLANK_BRANCH));
        //}

    };

    $scope.SELECTED_ENTITY_COUNTRY_Fn = function (_param_country, _param_entity, _param_Load_Flag) {
        if (_param_country == '') {
            _param_entity.HR_ENTITY_BY_ID.CUSTOM_COUNTRY_NAME = $scope.DD_DEFAULT_TEXT;
            _param_entity.HR_ENTITY_BY_ID.COUNTRY_ID = null;
            _param_entity.HR_ENTITY_BY_ID.STATE_ID = null;
            _param_entity.HR_ENTITY_BY_ID.CUSTOM_STATE_NAME = $scope.DD_DEFAULT_TEXT;
            _param_entity.HR_ENTITY_BY_ID.STATES = [];
            $scope.SELECTED_ENTITY_CURRENCY_Fn('', _param_entity);
            _param_entity.HR_ENTITY_BY_ID.TIME_ZONE = null;
        }
        else {
            _param_entity.HR_ENTITY_BY_ID.CUSTOM_COUNTRY_NAME = _param_country.DISPLAY_TEXT;
            _param_entity.HR_ENTITY_BY_ID.COUNTRY_ID = _param_country.COUNTRY_ID;
            //State 
            $scope.GET_STATES(_param_entity, 0, 'ENTITY');
            // End of state 



            if (_param_Load_Flag == undefined) {
                _param_entity.HR_ENTITY_BY_ID.STATE_ID = null;
                _param_entity.HR_ENTITY_BY_ID.CUSTOM_STATE_NAME = $scope.DD_DEFAULT_TEXT;

                //Currency 
                if (_param_country.CURRENCY_ID > 0) {
                    let _result_Currency = $scope.CURRENCY.filter(function (_param_currency) { return _param_currency.CURRENCY_ID == _param_country.CURRENCY_ID });
                    $scope.SELECTED_ENTITY_CURRENCY_Fn(_result_Currency[0], _param_entity);
                }
                else {
                    $scope.SELECTED_ENTITY_CURRENCY_Fn('', _param_entity);
                }
                //End of currency
            }

            _param_entity.HR_ENTITY_BY_ID.POST_BOX_LABEL_NAME = 'Post Code'
            _param_entity.HR_ENTITY_BY_ID.SHOW_HIDE_COUNTY = true;
            _param_entity.HR_ENTITY_BY_ID.STATE_LABEL_NAME = 'State';

            if (_param_entity.HR_ENTITY_BY_ID.COUNTRY_ID == 187 || _param_entity.HR_ENTITY_BY_ID.COUNTRY_ID == 224 || _param_entity.HR_ENTITY_BY_ID.COUNTRY_ID == 117 || _param_entity.HR_ENTITY_BY_ID.COUNTRY_ID == 174 || _param_entity.HR_ENTITY_BY_ID.COUNTRY_ID == 162 || _param_entity.HR_ENTITY_BY_ID.COUNTRY_ID == 19) { //GCC
                _param_entity.HR_ENTITY_BY_ID.POST_BOX_LABEL_NAME = 'PO Box'
                _param_entity.HR_ENTITY_BY_ID.STATE_LABEL_NAME = '';
                _param_entity.HR_ENTITY_BY_ID.SHOW_HIDE_COUNTY = false;
            }
            else if (_param_entity.HR_ENTITY_BY_ID.COUNTRY_ID == 225) {//UK
                _param_entity.HR_ENTITY_BY_ID.SHOW_HIDE_COUNTY = true;
                _param_entity.HR_ENTITY_BY_ID.STATE_LABEL_NAME = 'County';
                _param_entity.HR_ENTITY_BY_ID.POST_BOX_LABEL_NAME = 'Post Code'
            } else if (_param_entity.HR_ENTITY_BY_ID.COUNTRY_ID == 226) {//US
                _param_entity.HR_ENTITY_BY_ID.SHOW_HIDE_COUNTY = true;
                _param_entity.HR_ENTITY_BY_ID.POST_BOX_LABEL_NAME = 'Zip Code'
                _param_entity.HR_ENTITY_BY_ID.STATE_LABEL_NAME = 'State';
            }

        }
    }
    $scope.SELECTED_ENTITY_CURRENCY_Fn = function (_param_currency, _param_entity, _param_Load_Flag) {
        if (_param_currency == '') {
            _param_entity.HR_ENTITY_BY_ID.CUSTOM_CURRENCY_NAME = $scope.DD_DEFAULT_TEXT;
            _param_entity.HR_ENTITY_BY_ID.CURRENCY_ID = "";
        }
        else {
            _param_entity.HR_ENTITY_BY_ID.CUSTOM_CURRENCY_NAME = _param_currency.DISPLAY_TEXT;
            _param_entity.HR_ENTITY_BY_ID.CURRENCY_ID = _param_currency.CURRENCY_ID;
        }
    }
    $scope.SELECTED_ENTITY_STATE_Fn = function (_param_state, _entity) {
        if (_entity == '') {
            _entity.HR_ENTITY_BY_ID.CUSTOM_STATE_NAME = $scope.DD_DEFAULT_TEXT;
            _entity.HR_ENTITY_BY_ID.STATE_ID = "";
        }
        else {
            _entity.HR_ENTITY_BY_ID.CUSTOM_STATE_NAME = _param_state.STATE_NAME;
            _entity.HR_ENTITY_BY_ID.STATE_ID = _param_state.STATE_ID;
        }
    }

    $scope.SELECTED_BRANCH_ENTITY_Fn = function (_param_entity, _param_branch, _param_Load_Flag) {
        if (_param_entity == '') {
            _param_branch.HR_BRANCH_BY_ID.CUSTOM_ENTITY_NAME = $scope.DD_DEFAULT_TEXT;
            _param_branch.HR_BRANCH_BY_ID.ENTITY_ID = "";
            _param_branch.HR_BRANCH_BY_ID.LOCATION_ID = "";
        }
        else {
            _param_branch.HR_BRANCH_BY_ID.CUSTOM_ENTITY_NAME = _param_entity.ENTITY_NAME;
            _param_branch.HR_BRANCH_BY_ID.ENTITY_ID = _param_entity.ENTITY_ID;
            _param_branch.HR_BRANCH_BY_ID.LOCATION_ID = _param_entity.LOCATION_ID;
        }
    }
    $scope.SELECTED_BRANCH_CURRENCY_Fn = function (_param_currency, _param_branch, _param_Load_Flag) {
        if (_param_currency == '') {
            _param_branch.HR_BRANCH_BY_ID.CUSTOM_CURRENCY_NAME = $scope.DD_DEFAULT_TEXT;
            _param_branch.HR_BRANCH_BY_ID.CURRENCY_ID = "";
        }
        else {
            _param_branch.HR_BRANCH_BY_ID.CUSTOM_CURRENCY_NAME = _param_currency.DISPLAY_TEXT;
            _param_branch.HR_BRANCH_BY_ID.CURRENCY_ID = _param_currency.CURRENCY_ID;
        }
    }
    $scope.SELECTED_BRANCH_STATE_Fn = function (_param_state, _param_branch, _param_entity) {
        if (_param_state == '') {
            _param_branch.HR_BRANCH_BY_ID.CUSTOM_STATE_NAME = $scope.DD_DEFAULT_TEXT;
            _param_branch.HR_BRANCH_BY_ID.STATE_ID = null;
        }
        else {
            _param_branch.HR_BRANCH_BY_ID.CUSTOM_STATE_NAME = _param_state.STATE_NAME;
            _param_branch.HR_BRANCH_BY_ID.STATE_ID = _param_state.STATE_ID;
        }
    }
    $scope.SELECTED_BRANCH_COUNTRY_Fn = function (_country, _param_branch, _param_Load_Flag) {
        if (_country == '') {
            _param_branch.HR_BRANCH_BY_ID.CUSTOM_COUNTRY_NAME = $scope.DD_DEFAULT_TEXT;
            _param_branch.HR_BRANCH_BY_ID.COUNTRY_ID = "";
            $scope.SELECTED_BRANCH_CURRENCY_Fn('');
            $scope.SELECTED_BRANCH_STATE_Fn('');
        }
        else {
            _param_branch.HR_BRANCH_BY_ID.CUSTOM_COUNTRY_NAME = _country.COUNTRY_NAME;
            _param_branch.HR_BRANCH_BY_ID.COUNTRY_ID = _country.COUNTRY_ID;
            $scope.GET_STATES(_param_branch, 0, 'SITE');
            if (_param_Load_Flag == undefined) {
                _param_branch.HR_BRANCH_BY_ID.STATE_ID = null;
                _param_branch.HR_BRANCH_BY_ID.CUSTOM_STATE_NAME = $scope.DD_DEFAULT_TEXT;

                //Currency 
                if (_country.CURRENCY_ID > 0) {
                    let _result_currency = $scope.CURRENCY.filter(function (_param_currency) { return _param_currency.CURRENCY_ID == _country.CURRENCY_ID });
                    $scope.SELECTED_BRANCH_CURRENCY_Fn(_result_currency[0], _param_branch);
                }
                else {
                    $scope.SELECTED_BRANCH_CURRENCY_Fn('', _param_branch);
                }
                //End of currency
            }

            _param_branch.HR_BRANCH_BY_ID.POST_BOX_LABEL_NAME = 'Post Code'
            _param_branch.HR_BRANCH_BY_ID.SHOW_HIDE_COUNTY = true;
            _param_branch.HR_BRANCH_BY_ID.STATE_LABEL_NAME = 'State';
            if (_param_branch.HR_BRANCH_BY_ID.COUNTRY_ID == 187 || _param_branch.HR_BRANCH_BY_ID.COUNTRY_ID == 224 || _param_branch.HR_BRANCH_BY_ID.COUNTRY_ID == 117 || _param_branch.HR_BRANCH_BY_ID.COUNTRY_ID == 174 || _param_branch.HR_BRANCH_BY_ID.COUNTRY_ID == 162 || _param_branch.HR_BRANCH_BY_ID.COUNTRY_ID == 19) { //GCC
                _param_branch.HR_BRANCH_BY_ID.POST_BOX_LABEL_NAME = 'PO Box'
                _param_branch.HR_BRANCH_BY_ID.STATE_LABEL_NAME = '';
                _param_branch.HR_BRANCH_BY_ID.SHOW_HIDE_COUNTY = false;
            }
            else if (_param_branch.HR_BRANCH_BY_ID.COUNTRY_ID == 225) {//UK
                _param_branch.HR_BRANCH_BY_ID.SHOW_HIDE_COUNTY = true;
                _param_branch.HR_BRANCH_BY_ID.STATE_LABEL_NAME = 'County';
                _param_branch.HR_BRANCH_BY_ID.POST_BOX_LABEL_NAME = 'Post Code'
            } else if (_param_branch.HR_BRANCH_BY_ID.COUNTRY_ID == 226) {//US
                _param_branch.HR_BRANCH_BY_ID.SHOW_HIDE_COUNTY = true;
                _param_branch.HR_BRANCH_BY_ID.POST_BOX_LABEL_NAME = 'Zip Code'
                _param_branch.HR_BRANCH_BY_ID.STATE_LABEL_NAME = 'State';
            }
        }
    }

    $scope.BLANK_DEPARTMENT = { DEPARTMENT_ID: 0, DISPLAY_TEXT: '' };
    $scope.BLANK_POSITION = { POSITION_ID: 0, DISPLAY_TEXT: '' };
    $scope.BLANK_SECTION = { SECTION_ID: 0, DISPLAY_TEXT: '' };
    $scope.BLANK_ASSET = { ASSET_ID: 0, DISPLAY_TEXT: '' };
    $scope.BLANK_TAG = { TAG_ID: 0, DISPLAY_TEXT: '' };

    $scope.ADD_MORE_DEPARTMENT_Fn = function () {
        $scope.DEPARTMENTS_LIST.push(angular.copy($scope.BLANK_DEPARTMENT));
    };
    $scope.ADD_MORE_POSITION_Fn = function () {
        $scope.POSITIONS_LIST.push(angular.copy($scope.BLANK_POSITION));
    };
    $scope.ADD_MORE_SECTION_Fn = function () {
        $scope.SECTIONS_LIST.push(angular.copy($scope.BLANK_SECTION));
    };
    $scope.ADD_MORE_ASSETS_Fn = function () {
        $scope.ASSETS_LIST.push(angular.copy($scope.BLANK_ASSET));
    }
    $scope.ADD_MORE_TAGS_Fn = function () {
        $scope.TAGS_LIST.push(angular.copy($scope.BLANK_TAG));
    }

    $scope.DELETE_ENTITY_DTLS_Fn = function (_param_Header, _param_line, _param_index) {
        if (_param_Header.ENTITY_ID == 0) {
            $scope.HR_ENTITY_LIST.splice(_param_index, 1)
            $scope.$parent.ShowAlertBox('Success', 'Entity Deleted Successfully', 3000);
        }
        else if (_param_Header.ENTITY_ID > 0) {
            if (confirm('Are you sure, do you want to proceed?')) {

                $scope.ADMIN_GET_ENTITY_BY_ID(_param_Header, _param_line, 0)

            }
        }
    }
    $scope.DELETE_BRANCH_DTLS_Fn = function (_param_branch, index) {
        if (_param_branch.BRANCH_ID == 0) {
            $scope.HR_BRANCH_LIST.splice(index, 1);
            $scope.$parent.ShowAlertBox('Success', 'Branch Deleted Successfully', 3000);
        }
        else if (_param_branch.BRANCH_ID > 0) {
            if (confirm('Are you sure, do you want to proceed?')) {
                $scope.HR_BRANCH_LIST.slice(index, 1);
            }
        }
    }
    $scope.DELETE_DEPARTMENT_Fn = function (_param_department, index) {
        if (_param_department.DEPARTMENT_ID == 0) {
            $scope.HR_BRANCH_LIST.splice(index, 1);
            $scope.$parent.ShowAlertBox('Success', 'Department Deleted Successfully', 3000);
        }
        else if (_param_department.DEPARTMENT_ID > 0) {
            if (confirm('Are you sure, do you want to proceed?')) {
                $scope.HR_BRANCH_LIST.slice(index, 1);
            }
        }
    }
    $scope.DELETE_POSITION_Fn = function (_param_position, index) {
        if (_param_position.POSITION_ID == 0) {
            $scope.HR_BRANCH_LIST.splice(index, 1);
            $scope.$parent.ShowAlertBox('Success', 'Position Deleted Successfully', 3000);
        }
        else if (_param_position.POSITION_ID > 0) {
            if (confirm('Are you sure, do you want to proceed?')) {
                $scope.HR_BRANCH_LIST.slice(index, 1);
            }
        }
    }
    $scope.DELETE_SECTION_Fn = function () {
        if (_param_branch.BRANCH_ID == 0) {
            $scope.HR_BRANCH_LIST.splice(index, 1);
            $scope.$parent.ShowAlertBox('Success', 'Section Deleted Successfully', 3000);
        }
        else if (_param_branch.BRANCH_ID > 0) {
            if (confirm('Are you sure, do you want to proceed?')) {
                $scope.HR_BRANCH_LIST.slice(index, 1);
            }
        }
    }
    $scope.DELETE_ASSET_Fn = function () {
        if (_param_branch.BRANCH_ID == 0) {
            $scope.HR_BRANCH_LIST.splice(index, 1);
            $scope.$parent.ShowAlertBox('Success', 'Asset Deleted Successfully', 3000);
        }
        else if (_param_branch.BRANCH_ID > 0) {
            if (confirm('Are you sure, do you want to proceed?')) {
                $scope.HR_BRANCH_LIST.slice(index, 1);
            }
        }
    }
    $scope.DELETE_ASSET_Fn = function () {
        if (_param_branch.BRANCH_ID == 0) {
            $scope.HR_BRANCH_LIST.splice(index, 1);
            $scope.$parent.ShowAlertBox('Success', 'Asset Deleted Successfully', 3000);
        }
        else if (_param_branch.BRANCH_ID > 0) {
            if (confirm('Are you sure, do you want to proceed?')) {
                $scope.HR_BRANCH_LIST.slice(index, 1);
            }
        }
    }

    $scope.imageSrc = null;
    $scope.croppedImage = null;
    let cropper = null;
    // Upload and display image
    $scope.UPLOAD_IMAGE_Fn = function (index, FOLDER) {
        $scope.ACTIVE_INDEX = index;
        $scope.ACTIVE_FOLDER = FOLDER;
    };
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
                // Example: Create a URL for the Blob and display it
                // const blobUrl = URL.createObjectURL(blob);
                // $scope.UPLOAD_FILES('PROFILE_UPLOAD', 1, blob);
                $scope.UPLOAD_FILES($scope.ACTIVE_FOLDER, $scope.ACTIVE_INDEX, blob);
                //const imgElement = document.createElement('img');
                //imgElement.src = blobUrl;
                //document.body.appendChild(imgElement);
            }, 'image/png');
        }
    }
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
    $scope.$parent.$parent.overlay_loading_HR_Loader = 'none';
});