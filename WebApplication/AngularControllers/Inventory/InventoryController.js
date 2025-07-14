app.controller('InventoryController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.$parent.COMMON_CODE_CHANGE();
    $scope.RIGHT_ASIDE_OPEN = function (ASIDE_NAME) {
        document.getElementById(ASIDE_NAME).style.width = "60%";
        document.getElementById(ASIDE_NAME).style.zIndex = "1050";
        $('.side-backdrop').addClass('side-backdrop show').removeClass('hide');
        
    };
    
    $scope.RIGHT_ASIDE_CLOSE = function (ASIDE_NAME) {
        document.getElementById(ASIDE_NAME).style.width = "0";
        document.getElementById(ASIDE_NAME).style.zIndex = "-1";
        $('.side-backdrop').removeClass('show').addClass('hide');
    };
    $scope.TAB_FLAG = 1;
    $scope.TAB_FLAG_GROSS_REVENUE = 1;
    $scope.TAB_FLAG_GROUPED_SALES = 1;
    
    $scope.InventorySearch = {
        TOTAL_GUEST_AVERAGE_SPEND: true,
    };
    $scope.TAB_CLICK_SHDL_FY = function (FLAG) {
        $scope.TAB_FLAG = FLAG
    }
    $scope.TAB_CLICK_SHDL_GROSS_REVENUE_FY = function (FLAG) {
        $scope.TAB_FLAG_GROSS_REVENUE = FLAG
    }
    $scope.TAB_CLICK_SHDL_TAB_FLAG_GROUPED_SALES_FY = function (FLAG) {
        $scope.TAB_FLAG_GROUPED_SALES = FLAG
    }
    $scope.CHANGE_TAB = function (T) {
        if ($scope.InventorySearch[T] == true) {
            $scope.InventorySearch[T] = false;
        }
        else if ($scope.InventorySearch[T] == false) {
            $scope.InventorySearch[T] = true;
        }
    };
});