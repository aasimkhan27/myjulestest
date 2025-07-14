app.controller('CustomerIntegrationController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.$parent.PAGE_HEADER = "Customer Integration";
    $scope.$parent.urlpath = "CustomerIntegration";
    $scope.CustomerIntegrationSearch = {
        CUSTOMER_ID: null,
        ENTITY_ID: null,
        BRANCH_ID: null,
        INTEGRATION_TYPE_ID: null,
        INTEGRATION_SYSTEM_ID: null,
        MODULE_ID: null,
        URL_PARAMETERS: '',
        URL_PATH: '',
        ACTIVE: 0,
        CREATED_BY: parseInt($cookies.get("USERID")),
        API_KEY: '',
        USERID: '',
        PASSWORD: '',
        IS_OUTBOUND: 0,
        INTEGRATION_PICKUP_FLAG: 0,
        LAST_PICKUP_DATE: '',
        //ERROR_DESCRIPTION: '',
        INTEGRATION_START_DATE: '',
        INT_GRP_MAS_ID: '',
        INTEGRATION_STATUS: '',
        AUTOMATION_URL: '',
        AUTOMATION_USER_NAME: '',
        AUTOMATION_PASSWORD: '',
        AUTOMATION_PARAMETERS: '',
        PAGE_NO: 1,
        PAGE_SIZE: 10,
    };
    $scope.CUSTOMER_INTEGRATION_LIST = [];

    $scope.ADMIN_GET_CUSTOMER = function () {
        var UserModelObj = new Object();
        UserModelObj.CUSTOMER_NAME = '';
        UserModelObj.CUSTOMER_CODE = '';
        UserModelObj.ACTIVE = 1;
        UserModelObj.PAGE_NO = 1;
        UserModelObj.PAGE_SIZE = 1000;//$scope.CustomerSearch.PAGE_SIZE;
        UserModelObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(UserModelObj, 'ADMIN_GET_CUSTOMER').then(function (data) {
            $scope.CUSTOMER_LIST = data.data.Table;
        });
    };
    $scope.GET_ENTITY_LIST = function () {
        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_ID = $scope.CustomerIntegrationSearch.CUSTOMER_ID;
        CusModelObj.ACTIVE = 1;
        CusModelObj.PAGE_NO = 0;
        CusModelObj.USER_ID = parseInt($cookies.get("USERID"));
        CusModelObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(CusModelObj, 'ADMIN_GET_ENTITIES').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.ENTITY_LIST = data.data.Table;
            }
            else { $scope.ENTITY_LIST = []; }
        });

    };
    $scope.ADMIN_GET_BRANCH = function () {
        var BrnModelObj = new Object();
        BrnModelObj.CUSTOMER_ID = $scope.CustomerIntegrationSearch.CUSTOMER_ID;
        BrnModelObj.ENTITY_ID = $scope.CustomerIntegrationSearch.ENTITY_ID;
        BrnModelObj.BRANCH_CODE = '';
        BrnModelObj.BRANCH_NAME = '';
        BrnModelObj.CONTACT_NAME = '';
        BrnModelObj.LOCATION_IDS = $scope.CustomerIntegrationSearch.LOCATION_ID;
        BrnModelObj.ACTIVE = 1;
        BrnModelObj.PAGE_NO = 0;
        BrnModelObj.PAGE_SIZE = 0;
        BrnModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.ADMIN_API(BrnModelObj, 'ADMIN_GET_BRANCH').then(function (data) {
            $scope.BRANCH_LIST = data.data.Table;
        });
    }
    $scope.GET_MODULE_BY_ID = function () {
        var GetModById = new Object();
        GetModById.MODULE_ID = 0;
        PrcCommMethods.ADMIN_API(GetModById, 'GET_MODULE_BY_ID').then(function (data) {
            $scope.MODULE_BY_LIST = data.data.Table;
        });
    }
    $scope.GET_INTEGRATION_TYPE_BY_ID = function () {
        var IntTypeobj = new Object();
        IntTypeobj.INTEGRATION_TYPE_ID = 0;
        PrcCommMethods.ADMIN_API(IntTypeobj, 'GET_INTEGRATION_TYPE_BY_ID').then(function (data) {
            $scope.INTEGRATION_TYPE_LIST = data.data.Table;
        });
    }
    $scope.GET_INTEGRATION_SYSTEM_BY_ID = function () {
        var IntSystemObj = new Object();
        IntSystemObj.INTEGRATION_SYSTEM_ID = 0;
        IntSystemObj.INTEGRATION_TYPE_ID = $scope.CustomerIntegrationSearch.INTEGRATION_TYPE_ID;
        //PrcCommMethods.ADMIN_API(IntSystemObj, 'GET_INTEGRATION_SYSTEM_BY_ID').then(function (data) {
        //    $scope.INTEGRATION_SYSTEM_LIST = data.data.Table;
        //});

        PrcCommMethods.ADMIN_API(IntSystemObj, 'GET_INTEGRATION_SYSTEM_BY_ID').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.INTEGRATION_SYSTEM_LIST = data.data.Table;
            }
            else { $scope.INTEGRATION_SYSTEM_LIST = []; }
        });
    }
    $scope.GET_CUSTOMER_INTEGRATION = function (FLAG) {
        if (FLAG == 1) {
            $scope.CUSTOMER_INTEGRATION_LIST = [];
            $scope.CustomerIntegrationSearch.PAGE_NO = 1;
        }

        var GetCustInt = new Object();
        GetCustInt.CUSTOMER_ID = $scope.CustomerIntegrationSearch.CUSTOMER_ID;
        GetCustInt.ENTITY_ID = $scope.CustomerIntegrationSearch.ENTITY_ID;
        GetCustInt.INTEGRATION_SYSTEM_ID = $scope.CustomerIntegrationSearch.INTEGRATION_SYSTEM_ID;
        GetCustInt.BRANCH_ID = $scope.CustomerIntegrationSearch.BRANCH_ID;
        GetCustInt.PAGE_NO = $scope.CustomerIntegrationSearch.PAGE_NO;
        GetCustInt.PAGE_SIZE = $scope.CustomerIntegrationSearch.PAGE_SIZE;
        PrcCommMethods.ADMIN_API(GetCustInt, 'GET_CUSTOMER_INTEGRATION').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.CUSTOMER_INTEGRATION_LIST = $scope.CUSTOMER_INTEGRATION_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.CustomerIntegrationSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.CustomerIntegrationSearch.PAGE_NO = parseInt($scope.CustomerIntegrationSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else {
                //if ($scope.GET_CUSTOMER_INTEGRATION_LIST.length == 0) {
                //    $scope.GET_CUSTOMER_INTEGRATION_LIST = [];
                //}
                $scope.GetData = false;
            }
        });
    }

    $scope.EDIT_INS_UPD_CUSTOMER_INTEGRATION = function (CIN) {
        $scope.CustomerIntegrationSearch.CUSTOMER_INTEGRATION_ID = CIN.CUSTOMER_INTEGRATION_ID;
        $scope.CustomerIntegrationSearch.CUSTOMER_ID = CIN.CUSTOMER_ID;
        $scope.CustomerIntegrationSearch.ENTITY_ID = CIN.ENTITY_ID;
        $scope.CustomerIntegrationSearch.BRANCH_ID = CIN.BRANCH_ID;
        $scope.CustomerIntegrationSearch.INTEGRATION_TYPE_ID = CIN.INTEGRATION_TYPE_ID;
        $scope.CustomerIntegrationSearch.INTEGRATION_SYSTEM_ID = CIN.INTEGRATION_SYSTEM_ID;
        $scope.CustomerIntegrationSearch.MODULE_ID = CIN.MODULE_ID;
        $scope.CustomerIntegrationSearch.URL_PARAMETERS = CIN.URL_PARAMETERS;
        $scope.CustomerIntegrationSearch.URL_PATH = CIN.URL_PATH;
        $scope.CustomerIntegrationSearch.ACTIVE = CIN.ACTIVE == true ? true : false;
        $scope.CustomerIntegrationSearch.CREATED_BY = CIN.CREATED_BY;
        $scope.CustomerIntegrationSearch.API_KEY = CIN.API_KEY;
        $scope.CustomerIntegrationSearch.USERID = CIN.USERID;
        $scope.CustomerIntegrationSearch.PASSWORD = CIN.PASSWORD;
        $scope.CustomerIntegrationSearch.IS_OUTBOUND = CIN.IS_OUTBOUND == true ? true : false;
        $scope.CustomerIntegrationSearch.INTEGRATION_PICKUP_FLAG = CIN.INTEGRATION_PICKUP_FLAG == true ? true : false;
        $scope.CustomerIntegrationSearch.LAST_PICKUP_DATE = CIN.LAST_PICKUP_DATE;
        //$scope.CustomerIntegrationSearch.ERROR_DESCRIPTION = CIN.ERROR_DESCRIPTION;
        $scope.CustomerIntegrationSearch.INTEGRATION_START_DATE = CIN.INTEGRATION_START_DATE;
        $scope.CustomerIntegrationSearch.INT_GRP_MAS_ID = CIN.INT_GRP_MAS_ID;
        $scope.CustomerIntegrationSearch.INTEGRATION_STATUS = CIN.INTEGRATION_STATUS;
        $scope.CustomerIntegrationSearch.AUTOMATION_URL = CIN.AUTOMATION_URL;
        $scope.CustomerIntegrationSearch.AUTOMATION_USER_NAME = CIN.AUTOMATION_USER_NAME;
        $scope.CustomerIntegrationSearch.AUTOMATION_PASSWORD = CIN.AUTOMATION_PASSWORD;
        $scope.CustomerIntegrationSearch.AUTOMATION_PARAMETERS = CIN.AUTOMATION_PARAMETERS;
        $scope.GET_ENTITY_LIST();
        $scope.ADMIN_GET_BRANCH();
        $scope.GET_INTEGRATION_SYSTEM_BY_ID();
        //$scope.GET_CUSTOMER_INTEGRATION();
    };

    $scope.LAZY_GET_CUSTOMER_INTEGRATION = function () { $scope.GET_CUSTOMER_INTEGRATION(); };
    $scope.GET_CUSTOMER_INTEGRATION(1);
    $scope.GET_MODULE_BY_ID();
    $scope.GET_INTEGRATION_TYPE_BY_ID();
    $scope.GET_INTEGRATION_SYSTEM_BY_ID();
    $scope.ADMIN_GET_CUSTOMER();
    $scope.GET_ENTITY_LIST();
    $scope.ADMIN_GET_BRANCH();

    $scope.INS_UPD_CUSTOMER_INTEGRATION = function () {
        $scope.CustomerIntegrationForm.submitted = true;
        if ($scope.CustomerIntegrationForm.$valid) {
            var CustomerIntegrationObj = new Object();
            CustomerIntegrationObj.CUSTOMER_INTEGRATION_ID = $scope.CustomerIntegrationSearch.CUSTOMER_INTEGRATION_ID;
            //console.log("CID", $scope.CustomerIntegrationSearch.CUSTOMER_INTEGRATION_ID);
            CustomerIntegrationObj.CUSTOMER_ID = $scope.CustomerIntegrationSearch.CUSTOMER_ID;
            CustomerIntegrationObj.ENTITY_ID = $scope.CustomerIntegrationSearch.ENTITY_ID;
            //console.log($scope.CustomerIntegrationSearch.ENTITY_ID);
            CustomerIntegrationObj.BRANCH_ID = $scope.CustomerIntegrationSearch.BRANCH_ID;
            //console.log($scope.CustomerIntegrationSearch.BRANCH_ID);
            CustomerIntegrationObj.INTEGRATION_TYPE_ID = $scope.CustomerIntegrationSearch.INTEGRATION_TYPE_ID;
            CustomerIntegrationObj.INTEGRATION_SYSTEM_ID = $scope.CustomerIntegrationSearch.INTEGRATION_SYSTEM_ID;
            CustomerIntegrationObj.MODULE_ID = $scope.CustomerIntegrationSearch.MODULE_ID;
            CustomerIntegrationObj.URL_PARAMETERS = $scope.CustomerIntegrationSearch.URL_PARAMETERS;
            CustomerIntegrationObj.URL_PATH = $scope.CustomerIntegrationSearch.URL_PATH;
            CustomerIntegrationObj.ACTIVE = $scope.CustomerIntegrationSearch.ACTIVE ? 1 : 0;
            CustomerIntegrationObj.CREATED_BY = parseInt($cookies.get("USERID"));
            CustomerIntegrationObj.API_KEY = $scope.CustomerIntegrationSearch.API_KEY;
            CustomerIntegrationObj.USERID = $scope.CustomerIntegrationSearch.USERID;
            CustomerIntegrationObj.PASSWORD = $scope.CustomerIntegrationSearch.PASSWORD;
            CustomerIntegrationObj.IS_OUTBOUND = $scope.CustomerIntegrationSearch.IS_OUTBOUND ? 1 : 0;
            CustomerIntegrationObj.INTEGRATION_PICKUP_FLAG = $scope.CustomerIntegrationSearch.INTEGRATION_PICKUP_FLAG ? 1 : 0;
            CustomerIntegrationObj.LAST_PICKUP_DATE = $scope.CustomerIntegrationSearch.LAST_PICKUP_DATE || null;
            //CustomerIntegrationObj.ERROR_DESCRIPTION = $scope.CustomerIntegrationSearch.ERROR_DESCRIPTION;
            CustomerIntegrationObj.INTEGRATION_START_DATE = $scope.CustomerIntegrationSearch.INTEGRATION_START_DATE || null;
            CustomerIntegrationObj.INT_GRP_MAS_ID = $scope.CustomerIntegrationSearch.INT_GRP_MAS_ID;
            CustomerIntegrationObj.INTEGRATION_STATUS = $scope.CustomerIntegrationSearch.INTEGRATION_STATUS;
            CustomerIntegrationObj.AUTOMATION_URL = $scope.CustomerIntegrationSearch.AUTOMATION_URL;
            CustomerIntegrationObj.AUTOMATION_USER_NAME = $scope.CustomerIntegrationSearch.AUTOMATION_USER_NAME;
            CustomerIntegrationObj.AUTOMATION_PASSWORD = $scope.CustomerIntegrationSearch.AUTOMATION_PASSWORD;
            CustomerIntegrationObj.AUTOMATION_PARAMETERS = $scope.CustomerIntegrationSearch.AUTOMATION_PARAMETERS;
            PrcCommMethods.ADMIN_API(CustomerIntegrationObj, 'ADMIN_INS_UPD_CUSTOMER_INTEGRATION').then(function (data) {
                $scope.$parent.ShowAlert("Success", "Inactive Successfully", 3000);
                $cookies.CUSTOMER_INTEGRATION_SAVE = data.data.Table;
                //console.log("Sent Successfull");
                $scope.GET_CUSTOMER_INTEGRATION();
                $scope.RESET_CUSTOMER_INTEGREATION();
            });
        }

        else {
            console.log("Form validation failed!");
        }
    }

    $scope.RESET_CUSTOMER_INTEGREATION = function () {
        $scope.CustomerIntegrationSearch = {
            CUSTOMER_INTEGRATION_ID: null,
            CUSTOMER_ID: null,
            ENTITY_ID : null,
            INTEGRATION_TYPE_ID : null,
            INTEGRATION_SYSTEM_ID : null,
            MODULE_ID : null,
            URL_PARAMETERS : '',
            URL_PATH : '',
            ACTIVE : false,
            CREATED_BY : parseInt($cookies.get("USERID")),
            BRANCH_ID : null,
            API_KEY : '',
            USERID : '',
            PASSWORD: '',
            IS_OUTBOUND: false,
            INTEGRATION_PICKUP_FLAG: false,
            LAST_PICKUP_DATE : '',
            //ERROR_DESCRIPTION : '',
            INTEGRATION_START_DATE : '',
            INT_GRP_MAS_ID : '',
            INTEGRATION_STATUS: null,
            AUTOMATION_URL : '',
            AUTOMATION_USER_NAME : '',
            AUTOMATION_PASSWORD : '',
            AUTOMATION_PARAMETERS : '',
            PAGE_NO : 1,
            PAGE_SIZE : 10,
        }
        //$scope.ENTITY_LIST = [];
        $scope.ADMIN_GET_BRANCH();
        $scope.GET_ENTITY_LIST();
        $scope.CustomerIntegrationForm.submitted = false;
        $scope.GET_CUSTOMER_INTEGRATION(1);
    }

})