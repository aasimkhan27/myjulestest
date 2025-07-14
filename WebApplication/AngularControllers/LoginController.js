app.filter('unique', function () {
    return function (collection, keyname) {
        var output = [],
            keys = [];

        angular.forEach(collection, function (item) {
            var key = item[keyname];
            if (keys.indexOf(key) === -1) {
                keys.push(key);
                output.push(item);
            }
        });
        return output;
    };
});
app.directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.myEnter);
                });

                event.preventDefault();
            }
        });
    };
});
function checkCookies() {
    try {
        // Try to set a test cookie
        document.cookie = "testcookie=1; SameSite=Strict";
        const cookiesEnabled = document.cookie.indexOf("testcookie=") !== -1;

        // If cookies are disabled, show the error message
        if (!cookiesEnabled) {
            document.getElementById("cookie-error").style.display = "block";
        } else {
            // Clear the test cookie
            document.cookie = "testcookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        }
    } catch (error) {
        // In case of any error, assume cookies are disabled
        document.getElementById("cookie-error").style.display = "block";
    }
}

window.onload = checkCookies;
app.controller('LoginController', function ($scope, $http, $cookies, $window, CommService, $localStorage, $filter, $location, $timeout) {
    $scope.LOGIN_FLAG = true
    $scope.LINK_EXPIRE_FLAG = false;
    $scope.showResetPasswordbox = false;

    $scope.user = {
        username: '',
        password: '',
        Supplierpassword: '',
        SupplierName: '',
        SupplierUserName: '',
        SupplierPhone: '',
        urlparam: '',
        Location: []
    }
    $scope.user.username = getUrlParameter('em', $location.absUrl());
    $scope.user.urlparam = getUrlParameter('x', $location.absUrl());
    $scope.overlay_loading = 'none';
    $scope.usernamefocus = false;
    $scope.passwordfocus = false;
    $scope.Supplierpasswordfocus = false;
    $scope.supplierNamefocus = false;
    $scope.SupplierUserNamefocus = false;
    $scope.SupplierUserPhonefocus = false;
    $scope.SupplierLocationfocus = false;
    $scope.uservalid = true;
    $scope.passwordvalid = true;
    $scope.Supplierpasswordvalid = true;
    $scope.supplierNamevalid = true;
    $scope.SupplierUserNamevalid = true;
    $scope.SupplierUserPhonevalid = true;
    $scope.SupplierLocationvalid = true;
    $scope.INVALID_LOGIN = false;
    $scope.INVALID_SUPPLIER = false;
    $scope.ALL_DEVICES_LOGOUT = false;
    $scope.ValidationStyle = "border: 1px solid white;border-radius: 10px !important;padding-left: 10px;";
    var input = $('.form-control-login');
    function validate(input) {
        if ($(input).attr('type') == 'email' && $(input).attr('name') == 'Useremail') {
            if ($(input).val().trim() == '') {
                $scope.UsernameValidationMessage = 'Enter Email';
                $scope.uservalid = false;
                return false;
            }
            else if ($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                $scope.uservalid = false;
                $scope.UsernameValidationMessage = 'Enter valid Email';
                return false;
            }
        }
        else {
            if ($scope.user.password == '') {
                $scope.passwordvalid = false;
                return false;
            }
        }
    }

    $scope.username_focus = function () {
        $scope.usernamefocus = true;
        $scope.uservalid = true;
    }
    $scope.supplierName_focus = function () {
        $scope.supplierNamefocus = true;
        $scope.supplierNamevalid = true;
    }
    $scope.supplierPassword_focus = function () {
        $scope.Supplierpasswordfocus = true;
        $scope.Supplierpasswordvalid = true;
    }
    $scope.SupplierUserName_focus = function () {
        $scope.SupplierUserNamefocus = true;
        $scope.SupplierUserNamevalid = true;
    }
    $scope.SupplierUserPhone_focus = function () {
        $scope.SupplierUserPhonefocus = true;
        $scope.SupplierUserPhonevalid = true;
    }
    $scope.SupplierLocation_focus = function () {
        $scope.SupplierLocationfocus = true;
        $scope.SupplierLocationvalid = true;
    }
    $scope.password_focus = function () {
        $scope.passwordvalid = true;
        $scope.passwordfocus = true;
    }
    $scope.ClearSessionData = function () {
        var cookies = $cookies.getAll();
        angular.forEach(cookies, function (v, k) {
            $cookies.remove(k, { 'path': '/' });
        });
        delete $localStorage.ENTITY_SETTINGS;
        delete $localStorage.USER_PRIVILEGE;
        delete $localStorage.ENTITY_LIST;
        delete $localStorage.MODULE_LIST;
        delete $localStorage.SUB_MODULE_LIST;
        delete $localStorage.BRANCH_LOGIN_LIST;
        delete $localStorage.USER_FILTERS_LIST;
        delete $localStorage.HUMAN_RESOURCE_BRANCH_LIST;
        delete $localStorage.EMPLOYEE_ACCESS_LIST;
        delete $localStorage.SUB_MODULE_PAGE_LIST;
        delete $localStorage.USER_ROLES_BY_USER_ID;
        delete $localStorage.MODULE_IDS_FOR_CONTROL_PANEL;
        delete $localStorage.USER_ROLES_BY_USER_ID;
        delete $localStorage.CASHUP_PRIVILAGE_LIST;
        //delete $localStorage.LCache;
        //delete $localStorage.MCache;
        //delete $localStorage.ULR;
        //delete $localStorage.CRIB_DETAIL;
        //delete $localStorage.UOMList;
        //delete $localStorage.CUST_MODULE_CONFIG;
    };
    $scope.ClearSessionData();
    $scope.ValidateAndLogin = function () {
        var UserModelObj = new Object();
        UserModelObj.UserName = $scope.user.username;
        UserModelObj.Password = $scope.user.password;
        var httpRequest = $http({
            method: 'POST',
            url: CommService.Get_CASHUP_API() + 'api/LoginAPI/USER_LOGIN',
            data: UserModelObj
        }).then(function (data) {
            if (data.data != null && data.data.Table.length > 0 && data.data.Table1.length > 0) {
                //if (data.data.Table[0].EMPLOYEE_PERSONAL_ID == null) {
                //    $scope.INVALID_LOGIN = true;
                //    $scope.ValidationMessage = 'Incomplete profile contact with hr.';
                //}
                //else {
                $cookies.put('EMAIL', $scope.user.username, { 'path': '/' });
                $cookies.put('USERID', data.data.Table[0].USER_ID, { 'path': '/' });
                $cookies.put('IMAGE_PATH', data.data.Table[0].IMAGE_PATH, { 'path': '/' });
                $cookies.put('DESIGNATION', data.data.Table[0].DESIGNATION == null || data.data.Table[0].DESIGNATION == undefined ? '' : data.data.Table[0].DESIGNATION, { 'path': '/' });
                //$cookies.put('EMPLOYEE_ID', data.data.Table[0].EMPLOYEE_PERSONAL_ID, { 'path': '/' });
                //var ROLEIDs = data.data.Table[0].ROLE_IDS.split(",");
                //$cookies.put('ROLE_ID', 12121, { 'path': '/' });
                $cookies.put('MOBILE_CODE', data.data.Table[0].MOBILE_CODE, { 'path': '/' });
                $cookies.put('MOBILE_NO', data.data.Table[0].MOBILE_NO, { 'path': '/' });
                $cookies.put('NAME', data.data.Table[0].NAME, { 'path': '/' });
                $cookies.put('UEM', parseInt(120), { 'path': '/' });
                $cookies.put('CREATED_BY', data.data.Table[0].CREATED_BY, { 'path': '/' });
                if (data.data.Table[0].PENDING_SETUP) {
                    $localStorage.ENTITY_LIST = JSON.stringify(data.data.Table1);
                    var DENTITY = data.data.Table1.filter(function (x) { return x.DEFAULT_ENTITY == 1 });
                    if (DENTITY.length > 0) {
                        $cookies.put('CURRENCY_ID', DENTITY[0].CURRENCY_ID, { 'path': '/' });
                        $cookies.put('CURRENCY_CODE', DENTITY[0].CURRENCY_CODE, { 'path': '/' });
                        $cookies.put('TWO_DIGIT_COUNTRY_CODE', DENTITY[0].TWO_DIGIT_COUNTRY_CODE == null || DENTITY[0].TWO_DIGIT_COUNTRY_CODE == '' || DENTITY[0].TWO_DIGIT_COUNTRY_CODE == undefined ? 'gb' : DENTITY[0].TWO_DIGIT_COUNTRY_CODE, { 'path': '/' });
                        $cookies.put('CURRENCY_SYMBOL', DENTITY[0].CURRENCY_SYMBOL, { 'path': '/' });
                        $cookies.put('TIMEZONE_OFFSET', DENTITY[0].TIMEZONE_OFFSET, { 'path': '/' });
                        $cookies.put('ENTITY_ID', DENTITY[0].ENTITY_ID, { 'path': '/' });
                        $cookies.put('ENTITY_NAME', DENTITY[0].ENTITY_NAME, { 'path': '/' });
                        let EMPLY_PRSNL_ID = DENTITY[0].EMPLY_PRSNL_ID == undefined || DENTITY[0].EMPLY_PRSNL_ID == null || DENTITY[0].EMPLY_PRSNL_ID == '' ? 0 : DENTITY[0].EMPLY_PRSNL_ID;
                        $cookies.put('EMPLY_PRSNL_ID', EMPLY_PRSNL_ID, { 'path': '/' });
                        $cookies.put('EMPLOYEE_ID', DENTITY[0].EMPLOYEE_PERSONAL_ID, { 'path': '/' });
                        $cookies.put('COUNTRY_ID', DENTITY[0].COUNTRY_ID, { 'path': '/' });
                        $cookies.put('CUSTOMER_ID', DENTITY[0].CUSTOMER_ID, { 'path': '/' });
                        $cookies.put('CUSTOMER_ID_HR', DENTITY[0].CUSTOMER_ID, { 'path': '/' });
                        $cookies.put('LOGO_PATH', DENTITY[0].LOGO_PATH, { 'path': '/' });
                        $cookies.put('ENTITY_CREATION_YEAR', DENTITY[0].ENTITY_CREATION_YEAR, { 'path': '/' });
                        $cookies.put('SELECTED_TAB', data.data.Table[0].PENDING_SETUP, { 'path': '/' });
                        $cookies.put('SELECTED_MODULE', '', { 'path': '/' });
                        if (DENTITY[0].CURRENCY_CULTURE == undefined) {
                            $cookies.put('CURRENCY_CULTURE', 'en-GB', { 'path': '/' });
                        }
                        else {
                            $cookies.put('CURRENCY_CULTURE', DENTITY[0].CURRENCY_CULTURE, { 'path': '/' });
                        }
                    }
                    else {
                        $cookies.put('CURRENCY_ID', data.data.Table1[0].CURRENCY_ID, { 'path': '/' });
                        $cookies.put('CURRENCY_CODE', data.data.Table1[0].CURRENCY_CODE, { 'path': '/' });
                        $cookies.put('CURRENCY_SYMBOL', data.data.Table1[0].CURRENCY_SYMBOL, { 'path': '/' });
                        $cookies.put('TWO_DIGIT_COUNTRY_CODE', data.data.Table1[0].TWO_DIGIT_COUNTRY_CODE == null || data.data.Table1[0].TWO_DIGIT_COUNTRY_CODE == '' || data.data.Table1[0].TWO_DIGIT_COUNTRY_CODE == undefined ? 'gb' : data.data.Table1[0].TWO_DIGIT_COUNTRY_CODE, { 'path': '/' });
                        $cookies.put('TIMEZONE_OFFSET', data.data.Table1[0].TIMEZONE_OFFSET, { 'path': '/' });
                        $cookies.put('ENTITY_ID', data.data.Table1[0].ENTITY_ID, { 'path': '/' });
                        $cookies.put('ENTITY_NAME', data.data.Table1[0].ENTITY_NAME, { 'path': '/' });
                        $cookies.put('EMPLOYEE_ID', data.data.Table1[0].EMPLOYEE_PERSONAL_ID, { 'path': '/' });
                        $cookies.put('CUSTOMER_ID', data.data.Table1[0].CUSTOMER_ID, { 'path': '/' });
                        $cookies.put('LOGO_PATH', data.data.Table1[0].LOGO_PATH, { 'path': '/' });
                        $cookies.put('ENTITY_CREATION_YEAR', data.data.Table1[0].ENTITY_CREATION_YEAR, { 'path': '/' });
                        $cookies.put('SELECTED_TAB', 1, { 'path': '/' });
                        if (data.data.Table1[0].CURRENCY_CULTURE == undefined) {
                            $cookies.put('CURRENCY_CULTURE', 'en-GB', { 'path': '/' });
                        }
                        else {
                            $cookies.put('CURRENCY_CULTURE', data.data.Table1[0].CURRENCY_CULTURE, { 'path': '/' });
                        }
                    }
                    window.location.href = "../Hr/HRIndex#!/Enter_Sites?ID=" + data.data.Table[0].USER_ID;
                }
                else if (data.data.Table[0].CREATED_BY == 999999999) {
                    window.location.href = "../MAIN/Admin#!/Sindx";
                }
                else {
                    if (data.data.Table1.length > 0) {
                        $localStorage.ENTITY_LIST = JSON.stringify(data.data.Table1);
                        var DENTITY = data.data.Table1.filter(function (x) { return x.DEFAULT_ENTITY == 1 });
                        if (DENTITY.length > 0) {
                            $cookies.put('CURRENCY_ID', DENTITY[0].CURRENCY_ID, { 'path': '/' });
                            $cookies.put('CURRENCY_CODE', DENTITY[0].CURRENCY_CODE, { 'path': '/' });
                            $cookies.put('CURRENCY_SYMBOL', DENTITY[0].CURRENCY_SYMBOL, { 'path': '/' });
                            $cookies.put('TWO_DIGIT_COUNTRY_CODE', data.data.Table1[0].TWO_DIGIT_COUNTRY_CODE == null || data.data.Table1[0].TWO_DIGIT_COUNTRY_CODE == '' || data.data.Table1[0].TWO_DIGIT_COUNTRY_CODE == undefined ? 'gb' : data.data.Table1[0].TWO_DIGIT_COUNTRY_CODE, { 'path': '/' });
                            $cookies.put('TIMEZONE_OFFSET', DENTITY[0].TIMEZONE_OFFSET, { 'path': '/' });
                            $cookies.put('ENTITY_ID', DENTITY[0].ENTITY_ID, { 'path': '/' });
                            $cookies.put('ENTITY_NAME', DENTITY[0].ENTITY_NAME, { 'path': '/' });
                            let EMPLY_PRSNL_ID = DENTITY[0].EMPLY_PRSNL_ID == undefined || DENTITY[0].EMPLY_PRSNL_ID == null || DENTITY[0].EMPLY_PRSNL_ID == '' ? 0 : DENTITY[0].EMPLY_PRSNL_ID;
                            $cookies.put('EMPLY_PRSNL_ID', EMPLY_PRSNL_ID, { 'path': '/' });
                            $cookies.put('EMPLOYEE_ID', DENTITY[0].EMPLOYEE_PERSONAL_ID, { 'path': '/' });
                            $cookies.put('CUSTOMER_ID', DENTITY[0].CUSTOMER_ID, { 'path': '/' });
                            $cookies.put('COUNTRY_ID', DENTITY[0].COUNTRY_ID, { 'path': '/' });
                            $cookies.put('LOGO_PATH', DENTITY[0].LOGO_PATH, { 'path': '/' });
                            $cookies.put('ENTITY_CREATION_YEAR', DENTITY[0].ENTITY_CREATION_YEAR, { 'path': '/' });
                            $cookies.put('SELECTED_TAB', 1, { 'path': '/' });
                            $cookies.put('SELECTED_MODULE', '', { 'path': '/' });
                            if (DENTITY[0].CURRENCY_CULTURE == undefined) {
                                $cookies.put('CURRENCY_CULTURE', 'en-GB', { 'path': '/' });
                            }
                            else {
                                $cookies.put('CURRENCY_CULTURE', DENTITY[0].CURRENCY_CULTURE, { 'path': '/' });
                            }
                        }
                        else {
                            $cookies.put('CURRENCY_ID', data.data.Table1[0].CURRENCY_ID, { 'path': '/' });
                            $cookies.put('CURRENCY_CODE', data.data.Table1[0].CURRENCY_CODE, { 'path': '/' });
                            $cookies.put('CURRENCY_SYMBOL', data.data.Table1[0].CURRENCY_SYMBOL, { 'path': '/' });
                            $cookies.put('TWO_DIGIT_COUNTRY_CODE', data.data.Table1[0].TWO_DIGIT_COUNTRY_CODE == null || data.data.Table1[0].TWO_DIGIT_COUNTRY_CODE == '' || data.data.Table1[0].TWO_DIGIT_COUNTRY_CODE == undefined ? 'gb' : data.data.Table1[0].TWO_DIGIT_COUNTRY_CODE, { 'path': '/' });
                            $cookies.put('TIMEZONE_OFFSET', data.data.Table1[0].TIMEZONE_OFFSET, { 'path': '/' });
                            $cookies.put('ENTITY_ID', data.data.Table1[0].ENTITY_ID, { 'path': '/' });
                            $cookies.put('ENTITY_NAME', data.data.Table1[0].ENTITY_NAME, { 'path': '/' });
                            let EMPLY_PRSNL_ID = data.data.Table1[0].EMPLY_PRSNL_ID == undefined || data.data.Table1[0].EMPLY_PRSNL_ID == null || data.data.Table1[0].EMPLY_PRSNL_ID == '' ? 0 : data.data.Table1[0].EMPLY_PRSNL_ID;
                            $cookies.put('EMPLY_PRSNL_ID', EMPLY_PRSNL_ID, { 'path': '/' });
                            $cookies.put('EMPLOYEE_ID', data.data.Table1[0].EMPLOYEE_PERSONAL_ID, { 'path': '/' });
                            $cookies.put('CUSTOMER_ID', data.data.Table1[0].CUSTOMER_ID, { 'path': '/' });
                            $cookies.put('COUNTRY_ID', data.data.Table1[0].COUNTRY_ID, { 'path': '/' });
                            $cookies.put('LOGO_PATH', data.data.Table1[0].LOGO_PATH, { 'path': '/' });
                            $cookies.put('ENTITY_CREATION_YEAR', data.data.Table1[0].ENTITY_CREATION_YEAR, { 'path': '/' });
                            $cookies.put('SELECTED_TAB', 1, { 'path': '/' });
                            if (data.data.Table1[0].CURRENCY_CULTURE == undefined) {
                                $cookies.put('CURRENCY_CULTURE', 'en-GB', { 'path': '/' });
                            }
                            else {
                                $cookies.put('CURRENCY_CULTURE', data.data.Table1[0].CURRENCY_CULTURE, { 'path': '/' });
                            }
                        }
                        window.location.href = "../Main/MainIndex";
                    }
                }
            }
            else {
                $scope.INVALID_LOGIN = true;
                if (data.data.Table1 != undefined) {
                    if (data.data.Table1.length == 0) {
                        $scope.ValidationMessage = 'Access Denied, You Don’t Have Permission.\nPlease Contact To Support.';
                    }
                }
                else
                    $scope.ValidationMessage = 'Please enter a valid Username & Password.';
            }
        });


    }

    $scope.SetPassword = function () {
        if ($scope.user.urlparam != undefined) {
            var urlparameter = $scope.user.urlparam.split(':;:');
            if (urlparameter.length > 1) {
                if ($scope.user.password == $scope.user.conf_password) {
                    var UserModelObj = new Object();
                    UserModelObj.Password = $scope.user.conf_password;
                    UserModelObj.PassKey = urlparameter[0];
                    UserModelObj.ID = urlparameter[1];
                    var httpRequest = $http({
                        method: 'POST',
                        url: CommService.Get_CASHUP_API() + 'api/LoginAPI/PASSWORD_UPDATE',
                        data: UserModelObj
                    }).then(function (data) {
                        if (data.data != null && data.data.length > 0) {
                            alert("Password updated successfully");
                            window.location.href = "../Login/Index";
                        }
                        else {
                            $scope.INVALID_LOGIN = true;
                        }
                    });
                }
                else {
                    $scope.INVALID_LOGIN = true;
                }
            }
            else {
                alert('Your password setting link has been expired or invalid. Please contact support at Call: 02080377700 | Email: support@wenodo.com');
            }
        }
        else {
            alert("Please enter a valid URL");
            window.location.href = "../Login/Index";
        }

    }
    $scope.GotToForgetPassword = function () {
        $scope.ValidationMessageforget = '';
        $scope.INVALID_EMAIL = false;
        $scope.LOGIN_FLAG = false;
    }
    $scope.BackToForgetPassword = function () {
        $scope.ValidationMessageforget = '';
        $scope.INVALID_EMAIL = false;
        $scope.LOGIN_FLAG = true;
    }
    $scope.ValidateAndForgetPassword = function () {
        $scope.FLAG_ONE = 0;
        var UserModelObj = new Object();
        UserModelObj.UserName = $scope.user.username;;
        var httprequest = $http({
            method: 'POST',
            url: CommService.Get_CASHUP_API() + 'api/LoginAPI/FORGOT_PASSWORD',
            data: UserModelObj
        }).then(function (data) {
            if (data.data.Table.length > 0) {
                if (data.data.Table[0].SUCCESS == 1) {
                    $scope.ValidationStyle = "border: 1px solid #0093ff;border-radius: 10px !important;padding-left: 10px;box-shadow: 3px 2px #a53e3e;";
                    $scope.LOGIN_FLAG = false;
                    $scope.INVALID_EMAIL = true;
                    $scope.FLAG_ONE = 1;
                    $scope.ValidationMessageforget = ' Password Reset link has been sent to your email';
                }
                if (data.data.Table[0].SUCCESS == 0) {
                    $scope.ValidationStyle = "border: 1px solid #ca5959;border-radius: 10px !important;padding-left: 10px;box-shadow: 3px 2px #a53e3e;";
                    $scope.LOGIN_FLAG = false;
                    $scope.FLAG_ONE = 2;
                    $scope.INVALID_EMAIL = true;
                    $scope.ValidationMessageforget = 'Please enter a valid/registered username.';
                }
            }
        });
    }
    $scope.VALIDATE_PASS_KEY = function () {
        var urlparameter = $scope.user.urlparam.split(':;:');
        var UserModelObj = new Object();
        UserModelObj.PassKey = urlparameter[0];
        UserModelObj.ID = urlparameter[1];
        UserModelObj.FLAG = 1;
        var httprequest = $http({
            method: 'POST',
            url: CommService.Get_CASHUP_API() + 'api/LoginAPI/VALIDATE_PASS_KEY',
            data: UserModelObj
        }).then(function (data) {
            if (data.data.Table.length > 0) {
                if (data.data.Table[0].SUCCESS == 1) {
                    $scope.LINK_EXPIRE_FLAG = true;
                }
                if (data.data.Table[0].SUCCESS == 0) {
                    $scope.LINK_EXPIRE_FLAG = false;
                }

                $scope.showResetPasswordbox = true;
                $scope.overlay_loading = 'none';
            }
        });
    }
    $scope.INS_LOGOUT_LOG = function (USER_ID, LOGOUT_TYPE_ID) {
        var UserModelObj = new Object();
        UserModelObj.USER_ID = USER_ID;
        UserModelObj.LOGOUT_TYPE_ID = LOGOUT_TYPE_ID;
        var httprequest = $http({
            method: 'POST',
            url: CommService.Get_Login_API() + 'api/LoginAPI/INS_LOGOUT_LOG',
            data: UserModelObj
        }).then(function (data) {
            $('#LogOut').modal('hide');
            $scope.ValidationStyle = "border: 1px solid #ca5959;border-radius: 10px !important;padding-left: 10px;box-shadow: 3px 2px #a53e3e;";
            $scope.ALL_DEVICES_LOGOUT = true;
            //$window.location.href = '/Login';
        });
    }
    $scope.INS_LOGIN_LOG = function (USER_ID) {
        var LOGIN_LOG = new Object();
        LOGIN_LOG.USER_ID = USER_ID;
        var httpRequest = $http({
            method: 'POST',
            url: CommService.Get_Login_API() + 'api/LoginAPI/INS_LOGIN_LOG',
            data: LOGIN_LOG
        }).then(function (data) {
            return data.data;
        });
    }
    //$scope.tester = function () {
    //    var httpRequest = $http({
    //        method: 'POST',
    //        url: 'https://data.vmos-serverless.com/cubejs-api/v1/load',
    //        data: {
    //            "query": {
    //                "measures": ["OrderItems.count"],
    //                "dimensions": [
    //                    "OrderItems.uuid",
    //                    "OrderItems.bundleUuid",
    //                   "OrderItems.orderNumber",
    //                    "OrderItems.itemUuid",
    //                    "OrderItems.catalogBundleUuid",
    //                    "OrderItems.catalogItemUuid",
    //                    "OrderItems.category",
    //                    "OrderItems.type",
    //                    "OrderItems.bundle",
    //                    "OrderItems.itemName",
    //                    "OrderItems.itemGroupName",
    //                    "OrderItems.mealDealName",
    //                    "OrderItems.mealDealBasketUuid",
    //                    "OrderItems.itemQuantityPortions",
    //                    "OrderItems.itemQuantity",
    //                    "OrderItems.promotionName",
    //                    "OrderItems.itemSize",
    //                    "OrderItems.orderPromotionName",
    //                    "OrderItems.catalogPromotionName",
    //                    "OrderItems.tableNumber",
    //                    "OrderItems.channel",
    //                    "OrderItems.tillId",
    //                    "OrderItems.operatorEmail",
    //                    "OrderItems.vatRate",
    //                    "OrderItems.catalogVatRate",
    //                    "OrderItems.createdAt",
    //                    "OrderItems.updatedAt",
    //                    "OrderItems.updatedAtUtc",
    //                    "OrderItems.pickupTimeDt",
    //                    "OrderItems.slot15min",
    //                    "OrderItems.slot60min",
    //                    "OrderItems.firstOrderDate",
    //                    "OrderItems.confirmedAt",
    //                    "OrderItems.inProductionAt",
    //                    "OrderItems.readyToCollectAt",
    //                    "OrderItems.collectedAt",
    //                    "OrderItems.cancelledAt",
    //                    "OrderItems.refundedAt",
    //                    "OrderItems.integrationErrorAt",
    //                    "OrderItems.integrationErrorCorrectedAt",
    //                    "OrderItems.externalCategory",
    //                    "OrderItems.numTotalOrdersSoFar",
    //                    "OrderItems.vmosVersion",
    //                    "OrderItems.taxExempt",
    //                    "OrderItems.bundleTaxExempt",
    //                    "OrderItems.salesTaxRate"],
    //                "timeDimensions": [{ "dimension": "OrderItems.createdAt", "granularity": "day", "dateRange": ["2022-03-08", "2022-03-08"] }]
    //            }
    //        },
    //        headers: { "authorization": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0ZW5hbnQiOiJzbWFzaGluZ3BsYXRlcyJ9.l3zFS8-HN6l08Bkpf6ZLQSiJ7wrW2dB2vZdHk4NuIdM" }
    //    }).then(function (data) {
    //    });
    //}
    //$scope.tester();

    if (localStorage.chkbox && localStorage.chkbox != '') {
        $('#ckb1').attr('checked', 'checked');
        $('#rememberChkBox').attr('checked', 'checked');
        //$('#signinId').val(localStorage.username);
        //$('#signinPwd').val(localStorage.pass);
        $scope.user.username = localStorage.username;
        $scope.user.password = localStorage.pass;

    } else {
        $('#ckb1').removeAttr('checked');
        $('#signinId').val('');
        $('#signinPwd').val('');
    }
    $scope.rememberme = function () {
        if ($('#ckb1').is(':checked')) {
            // save username and password
            localStorage.username = $scope.user.username
            localStorage.pass = $scope.user.password;
            localStorage.chkbox = $('#ckb1').val();

        } else {
            localStorage.username = '';
            localStorage.pass = '';
            localStorage.chkbox = '';
            $scope.user.username = '';
            $scope.user.password = '';
        }
    };
    if (window.location.href.toLowerCase().indexOf("login/setpassword") != -1) {
        $scope.overlay_loading = 'block';
        $scope.VALIDATE_PASS_KEY();
    }
    const togglePassword = document.querySelector('#togglePassword');
    const password = document.querySelector('#password');
    togglePassword.addEventListener('click', function (e) {
        // toggle the type attribute
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
        // toggle the eye / eye slash icon
        $("#togglePassword").toggleClass("fa-eye-slash");
        this.classList.toggle('fa-eye');
    });
    $scope.Backtologin = function () {
        window.location.href = "../Login/Index";
    }
    $scope.TokenSearch = {
        CLIENT_ID: '',
        CLIENT_SECRET: '',
    };
    $scope.KEY_CLIENT_ID = false;
    var IS_PROD = false;
    $scope.OAUTH2_AUTHORIZE = function (FLAG) {
        if (FLAG == undefined) {
            $scope.CustomForm.submitted = true;
        }
        if ($scope.CustomForm != undefined && $scope.CustomForm.$valid || FLAG == 1) {
            var Urlprm = getUrlParameter('Tok', $location.absUrl());
            var TokenSplit = Urlprm.split(':;:');
            $cookies.put('TOK_ENTITY_ID', TokenSplit[0], { 'path': '/' });
            $cookies.put('code-verifier', TokenSplit[1], { 'path': '/' });
            $cookies.put('TOK_CUSTOMER_ID', TokenSplit[4], { 'path': '/' });
            $cookies.put('TOK_BRANCH_ID', TokenSplit[5], { 'path': '/' });
            if (TokenSplit[7] == undefined || TokenSplit[7] === '') {
                $cookies.put('TOK_CLIENT_ID', $scope.TokenSearch.CLIENT_ID, { 'path': '/' });
                $cookies.put('TOK_SECRET_ID', $scope.TokenSearch.CLIENT_SECRET, { 'path': '/' });
            }
            var str = $scope.TokenSearch.CLIENT_ID + ':' + $scope.TokenSearch.CLIENT_SECRET;
            var String64 = window.btoa(str);
            if (IS_PROD) {
                var StaggingUrl = "https://lightspeedapis.com/resto/oauth2/v1/authorize"
            }
            else {
                var StaggingUrl = "https://test.lightspeedapis.com/resto/oauth2/v1/authorize"
            }

            var url = StaggingUrl + "?response_type=code&client_id=" + $scope.TokenSearch.CLIENT_ID + "&code_challenge=" + TokenSplit[2] + "&code_challenge_method=" + TokenSplit[3];
            var settings = {
                "url": url,
                "method": "GET",
                "timeout": 0
            };
            $.ajax(settings).done(function (response) {
                $scope.overlay_loading = 'none';
                window.open(url, "_self");
            });
        }
    }


    if (window.location.href.toLowerCase().indexOf("login/gettoken") != -1) {
        $scope.KEY_CLIENT_ID = false;
        $scope.overlay_loading = 'block';
        var Urlprm = getUrlParameter('Tok', $location.absUrl());
        var TokenSplit = Urlprm.split(':;:');
        $cookies.put('TOK_CLIENT_ID', '', { 'path': '/' });
        $cookies.put('TOK_SECRET_ID', '', { 'path': '/' });
        $cookies.put('TOK_ENTITY_ID', TokenSplit[0], { 'path': '/' });
        $cookies.put('code-verifier', TokenSplit[1], { 'path': '/' });
        $cookies.put('TOK_CUSTOMER_ID', TokenSplit[4], { 'path': '/' });
        $cookies.put('TOK_BRANCH_ID', TokenSplit[5], { 'path': '/' });

        if (TokenSplit[6] != undefined && TokenSplit[6] !== '' && TokenSplit[6] !== null && TokenSplit[7] != undefined && TokenSplit[7] !== '' && TokenSplit[7] !== null) {
            $cookies.put('TOK_CLIENT_ID', TokenSplit[6], { 'path': '/' });
            $cookies.put('TOK_SECRET_ID', TokenSplit[7], { 'path': '/' });
            $cookies.put('TOK_USER_ID', TokenSplit[8], { 'path': '/' });

            $scope.TokenSearch.CLIENT_ID = TokenSplit[6];
            $scope.TokenSearch.CLIENT_SECRET = TokenSplit[7];
            IS_PROD = false;
            if (window.location.origin == "https://app.wenodo.com") {
                IS_PROD = true;
            }
            $scope.OAUTH2_AUTHORIZE(1);
        }
        else {
            $scope.KEY_CLIENT_ID = true;
        }
    }
    $scope.RESET_OAUTH2_AUTHORIZE = function () {
        $scope.TokenSearch = {
            CLIENT_ID: '',
            CLIENT_SECRET: '',
        };
        $scope.CustomForm.submitted = false;
    }
});
app.controller('RedirectionTokenController', function ($scope, $http, $cookies, $filter, CommService, $window, $localStorage, PrcCommMethods, $location) {
    $scope.TokenSearch = {
        CLIENT_ID: '',
        CLIENT_SECRET: '',
    }
    $scope.DISPLAY_MSG = '';
    var IS_PROD = false;
    if (window.location.origin == "https://app.wenodo.com") {
        IS_PROD = true;
    }
    IS_PROD = false;
    var code = getUrlParameter('code', $location.absUrl());
    $scope.GENERATE_TOKEN = function () {
        var str = $scope.TokenSearch.CLIENT_ID + ':' + $scope.TokenSearch.CLIENT_SECRET;

        var BaseString64 = window.btoa(str);
        var redirect_uri = "https://testing.wenodo.com/redirection/lightspeed"
        var StaggingUrl = "https://test.lightspeedapis.com/resto/oauth2/v1/token";

        $scope.overlay_loadingNew = 'block'
        var PosiModelObj = new Object();
        PosiModelObj.LS_AUTH_TOKEN_URL = StaggingUrl;
        PosiModelObj.BASE64STRING = BaseString64;
        PosiModelObj.REDIRECT_URI = redirect_uri;
        PosiModelObj.CODE_VERIFIER = $cookies.get("code-verifier");
        PosiModelObj.CODE = code;
        PosiModelObj.CUSTOMER_ID = $cookies.get("TOK_CUSTOMER_ID");
        PosiModelObj.ENTITY_ID = $cookies.get("TOK_ENTITY_ID");
        PosiModelObj.BRANCH_ID = $cookies.get("TOK_BRANCH_ID");
        PosiModelObj.INTEGRATION_SYSTEM_ID = 11;
        PosiModelObj.USER_ID = $cookies.get("TOK_USER_ID");
        PosiModelObj.URL_PATH = "https://test.lightspeedapis.com/resto/rest/financial/receipt";
        PrcCommMethods.ADMIN_API(PosiModelObj, 'UPD_INTEGRATION_TOKENS').then(function (data) {
            if (data.data == 1) {
                $scope.DISPLAY_MSG = 'Token generated and saved successfully';
            }
            else {
                $scope.DISPLAY_MSG = $scope.SOMETHINGWENTWRONG;
            }
        });

        //var settings = {
        //    "url": StaggingUrl,
        //    "method": "POST",
        //    "timeout": 0,
        //    "headers": {
        //        "Authorization": BaseString64,//"eGpmOUhnTHRtZ2liR2FwS3BiMkhWTUd5dFJtWE9WUDM6SEZDMUd3Y0RLUmxBSzZlRg==",
        //        "Content-Type": "application/x-www-form-urlencoded"
        //    },
        //    "data": {
        //        "grant_type": "authorization_code",
        //        "redirect_uri": "https://app.wenodo.com/redirection/lightspeed",
        //        "code_verifier": $cookies.get("code-verifier"),
        //        "code": code
        //    }
        //};
        //$.ajax(settings).done(function (response) {

        //}).fail(function (err) {
        //    $scope.DISPLAY_MSG = 'Link expire please try again.';
        //    $scope.$apply();
        //})
        // .always(function () {
        //    $scope.DISPLAY_MSG = 'Link expire please try again.';
        //    $scope.$apply();
        //});
        // }
    }
    if ($cookies.get("TOK_CLIENT_ID") != undefined && $cookies.get("TOK_CLIENT_ID") != '') {
        $scope.TokenSearch.CLIENT_ID = $cookies.get("TOK_CLIENT_ID");
        $scope.TokenSearch.CLIENT_SECRET = $cookies.get("TOK_SECRET_ID");
        $scope.GENERATE_TOKEN();
    }
    else {
        $scope.DISPLAY_MSG = "Link expire please try again."
    }
    $scope.RESET_GENERATE_TOKEN = function () {
        $scope.TokenSearch = {
            CLIENT_ID: '',
            CLIENT_SECRET: '',
        }
        $scope.CustomForm.submitted = false;
    }
});
