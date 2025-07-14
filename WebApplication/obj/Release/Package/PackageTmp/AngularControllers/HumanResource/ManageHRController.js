app.controller('ManageHRController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $interval) {
    //$scope.$parent.DISPLAY_FLAG = false;
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(2);
    $scope.TABLE_VIEW_ID = 1;
    $scope.$parent.$parent.overlay_loading_HR_Loader = 'none';
});

