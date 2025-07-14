app.controller('SettingController', function ($scope, $http) {
   // $scope.$parent.DISPLAY_FLAG = true;
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(1);
    $scope.$parent.$parent.overlay_loading_HR_Loader = 'none';
});