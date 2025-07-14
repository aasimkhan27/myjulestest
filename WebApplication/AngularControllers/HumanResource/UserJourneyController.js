app.controller('UserJRController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $interval) {
    //$scope.$parent.DISPLAY_FLAG = false;
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(2);
    $scope.UserJrSearch = {
        PACKAGE_NAME: 'Choose',
        CUSTOMER_ID: $cookies.get("CUSTOMER_ID_HR"),
    };
    $scope.SHOW_USER_JR = true
    $scope.PACKAGE_LIST = [{ PACKAGE_SUBSCRIPTION_MAPPING_ID: 3, NAME: 'Basic' }, { PACKAGE_SUBSCRIPTION_MAPPING_ID: 4, NAME: 'Premium' }, { PACKAGE_SUBSCRIPTION_MAPPING_ID: 5, NAME: 'Enterprise' }];
    $scope.SELECT_PAKAGE_NAME_Fn = function (_package) {
        $scope.UserJrSearch.PACKAGE_SUBSCRIPTION_MAPPING_ID = _package.PACKAGE_SUBSCRIPTION_MAPPING_ID;
        $scope.UserJrSearch.PACKAGE_NAME = _package.NAME;
    }
    $scope.INS_UPD_SUBSCRIPTION = function () {
        $scope.UserJourneyform.submitted = true;
        if ($scope.UserJourneyform.$valid) {
            var full_number = phone_number.getSelectedCountryData();
            var UserModelObj = new Object();
            UserModelObj.FIRST_NAME = $scope.UserJrSearch.FIRST_NAME;
            UserModelObj.LAST_NAME = $scope.UserJrSearch.LAST_NAME;
            UserModelObj.USER_EMAIL = $scope.UserJrSearch.USER_EMAIL;
            UserModelObj.MOBILE_CODE = full_number.dialCode;
            UserModelObj.TWO_DIGIT_COUNTRY_CODE = full_number.iso2;
            UserModelObj.MOBILE_NO = $scope.UserJrSearch.PHONE_TEXT;
            UserModelObj.COMPANY_NAME = $scope.UserJrSearch.COMPANY_NAME;
            UserModelObj.PACKAGE_SUBSCRIPTION_MAPPING_ID = $scope.UserJrSearch.PACKAGE_SUBSCRIPTION_MAPPING_ID;
            UserModelObj.NO_OF_SITES = $scope.UserJrSearch.NO_OF_SITES;
            UserModelObj.NO_OF_USERS = $scope.UserJrSearch.NO_OF_USERS;
            PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'INS_UPD_SUBSCRIPTION').then(function (data) {
                if (data.data == 1) {
                    //$location.path('Basic_Details');
                    $scope.$parent.ShowAlertBox("Success", "Saved successfully ", 3000);
                    $scope.SHOW_USER_JR = false

                }
                else if (data.data == 0) {
                    $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                }
            });
        }
    }
    $scope.$parent.$parent.overlay_loading_HR_Loader = 'none';
    $scope.$parent.HIDE_HEADER_DETAIL = false;
});

