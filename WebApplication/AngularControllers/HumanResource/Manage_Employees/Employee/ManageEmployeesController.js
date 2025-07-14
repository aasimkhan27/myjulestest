app.controller('ManageEmployeesController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    //$scope.$parent.DISPLAY_FLAG = true;
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(2);
    $scope.$parent.$parent.overlay_loading_HR_Loader = 'none';
});