app.controller('PNLController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.Search_FY = {
        ShowDetails: false,
    }
    $scope.DisplayDetails = function (SelectedLine) {
        if (SelectedLine.ShowDetails) {
            SelectedLine.ShowDetails = false;
        }
        else {
            SelectedLine.ShowDetails = true;
        }
    }

});