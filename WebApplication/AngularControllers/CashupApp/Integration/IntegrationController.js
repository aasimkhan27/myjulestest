app.controller('IntegrationController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    //$scope.$parent.DISPLAY_FLAG = true;
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(1);
    //$scope.CASHUP_COMMON_CODE_Fn();
    $scope.IntegrationInbound_Search = {
        BRANCH_ID: null,
        CUSTOMER_ID: parseInt($cookies.get("CUSTOMER_ID")),
        USER_ID: $cookies.get("USERID"),
        ENTITY_ID: parseInt($cookies.get("ENTITY_ID")),
    }
    $scope.GET_CASHUP_INBOUND_INTEGRATION = function () {
        CommonObj = new Object();
        CommonObj.CUSTOMER_ID = $scope.IntegrationInbound_Search.CUSTOMER_ID;
        PrcCommMethods.CASHUP_APP_API(CommonObj, 'GET_CASHUP_INBOUND_INTEGRATION').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.CASHUP_INBOUND_LIST = data.data.Table;
            }
            else {
                $scope.CASHUP_INBOUND_LIST = [];
            }
        });
    };
    $scope.GET_CASHUP_INBOUND_INTEGRATION();

    $scope.$on('$destroy', function () {
        $('.modal.show').modal('hide');
    });
});