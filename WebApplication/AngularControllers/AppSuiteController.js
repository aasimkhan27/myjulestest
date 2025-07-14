app.controller('AppSuiteController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $localStorage) {
    var delete_cookie = function (name) {document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';};

    delete_cookie('DSH_BRANCH_ID');
    delete_cookie('DSH_START_DATE');
    delete_cookie('DSH_END_DATE');

    $cookies.put('DSH_BRANCH_ID', "", { 'path': '/' });
    $cookies.put('DSH_START_DATE', "", { 'path': '/' });
    $cookies.put('DSH_END_DATE', "", { 'path': '/' });
    delete $localStorage.USER_FILTERS_LIST;
    delete $localStorage.SUB_MODULE_PAGE_LIST;
    delete $localStorage.MODULE_IDS_FOR_CONTROL_PANEL;
});