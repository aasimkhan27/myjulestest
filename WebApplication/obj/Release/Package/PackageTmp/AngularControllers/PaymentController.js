app.controller('PaymentController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.$parent.TabActive(2);
    $('.modal-backdrop').removeClass('modal-backdrop fade show');
    $scope.COMMON_CODE_CHANGE();
    $scope.HIDE_SHOW_FY = function () {
        $scope.hideshow = $scope.hideshow ? false:true;
    }

    $scope.$parent.DateInputLoad(); 
    $scope.$parent.child_scope = $scope;
});
