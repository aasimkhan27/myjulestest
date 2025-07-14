app.controller('CostCenterController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.$parent.PAGE_HEADER = "Add Cost Center";
    $scope.$parent.urlpath = "HR_Cost_Center";
    $scope.GRP_ID = getUrlParameter('ID', $location.absUrl());
    $scope.EDIT_MODE = 0;
    $scope.COST_CENTER_LIST = [];
    $scope.ENTITY_LIST = [];
    $scope.CostCenterSearch = {
        COST_CENTER_ID: '',
        COST_CENTER_CODE: '',
        COST_CENTER_DESCRIPTION: '',
        ACTIVE: -1,
        PAGE_NO: 1,
        PAGE_SIZE: 10, CLICK_SEARCH: null,
        CUSTOMER_ID: null,
        ENTITY_ID: null
    };
    $scope.RESET_CC = function () {
        $scope.CostCenterSearch = {
            COST_CENTER_ID: '',
            COST_CENTER_CODE: '',
            COST_CENTER_DESCRIPTION: '',
            ACTIVE: -1,
            PAGE_NO: 1,
            PAGE_SIZE: 10, CLICK_SEARCH: null,
            CUSTOMER_ID: null,
            ENTITY_ID: null
        };
        $scope.CostCenterSearch.CUSTOMER_ID = null;
        $scope.CostCenterSearch.ENTITY_ID = null;
        $scope.ENTITY_LIST = [];
        $scope.EDIT_MODE = 0;
        $scope.CostCenterForm.submitted = false;
        $scope.ADMIN_GET_COST_CENTER(2);
    };

    if ($scope.GRP_ID > 0) {
        $scope.GET_ROLE_DETAILS_BY_ID();
    }
    else {
    }
    $scope.LAZY_ADMIN_GET_COST_CENTER = function () { $scope.ADMIN_GET_COST_CENTER(); };
    $scope.ADMIN_INS_UPD_COST_CENETR = function () {
        $scope.CostCenterForm.submitted = true;
        if ($scope.CostCenterForm.$valid) {
            if ($scope.CostCenterSearch.ACTIVE != -1) {
                document.getElementById("overlay_loading").style.display = "block";
                var BrnModelObj = new Object();
                BrnModelObj.CUSTOMER_ID = $scope.CostCenterSearch.CUSTOMER_ID;
                BrnModelObj.ENTITY_ID = $scope.CostCenterSearch.ENTITY_ID;
                BrnModelObj.COST_CENTER_ID = $scope.CostCenterSearch.COST_CENTER_ID;
                BrnModelObj.COST_CENTER_CODE = $scope.CostCenterSearch.COST_CENTER_CODE;
                BrnModelObj.COST_CENTER_DESCRIPTION = $scope.CostCenterSearch.COST_CENTER_DESCRIPTION;
                BrnModelObj.USER_ID = parseInt($cookies.get("USERID"));
                BrnModelObj.ACTIVE = $scope.CostCenterSearch.ACTIVE;
                BrnModelObj.COMMENTS = $scope.CostCenterSearch.COMMENTS;
                PrcCommMethods.ADMIN_API(BrnModelObj, 'ADMIN_INS_UPD_COST_CENETR').then(function (data) {
                    $scope.$parent.ShowAlert('Success', 'Save Successfully', 3000);
                    $scope.RESET_CC();
                    document.getElementById("overlay_loading").style.display = "none";
                });
            }
            else {
                $scope.$parent.ShowAlert('Attention', 'Please Select Active/In-Active Option.', 3000);
                document.getElementById("overlay_loading").style.display = "none";
            }
        }
    };
    $scope.ADMIN_GET_COST_CENTER = function (FLAG) {
        document.getElementById("overlay_loading").style.display = "block";
        var BrnModelObj = new Object();
        if (FLAG == 1) {
            $scope.CostCenterSearch.CLICK_SEARCH = 1;
            $scope.COST_CENTER_LIST = [];
            $scope.CostCenterSearch.PAGE_NO = 1;
            BrnModelObj.ACTIVE = $scope.CostCenterSearch.ACTIVE == -1 ? -1 : $scope.CostCenterSearch.ACTIVE ? 1 : 0;
        }
        else if (FLAG == 2) {
            $scope.COST_CENTER_LIST = [];
            BrnModelObj.ACTIVE = -1;
            $scope.CostCenterSearch.PAGE_NO = 1;
        }
        else if (FLAG == undefined) {
            if ($scope.CostCenterSearch.CLICK_SEARCH == 1)
                BrnModelObj.ACTIVE = $scope.CostCenterSearch.ACTIVE == -1 ? -1 : $scope.CostCenterSearch.ACTIVE ? 1 : 0;
            else {
                BrnModelObj.ACTIVE = -1;
            }
        }
        BrnModelObj.CUSTOMER_ID = $scope.CostCenterSearch.CLICK_SEARCH == 1 ? $scope.CostCenterSearch.CUSTOMER_ID : null;
        BrnModelObj.ENTITY_ID = $scope.CostCenterSearch.CLICK_SEARCH == 1 ? $scope.CostCenterSearch.ENTITY_ID : null;
        BrnModelObj.USER_ID = parseInt($cookies.get("USERID"));
        BrnModelObj.COST_CENTER_CODE = $scope.CostCenterSearch.CLICK_SEARCH == 1 ? $scope.CostCenterSearch.COST_CENTER_CODE : null;
        BrnModelObj.COST_CENTER_DESCRIPTION = $scope.CostCenterSearch.CLICK_SEARCH == 1 ? $scope.CostCenterSearch.COST_CENTER_DESCRIPTION : '';
        //BrnModelObj.ACTIVE = -1;//$scope.CostCenterSearch.ACTIVE;
        BrnModelObj.PAGE_NO = $scope.CostCenterSearch.PAGE_NO;
        BrnModelObj.PAGE_SIZE = $scope.CostCenterSearch.PAGE_SIZE;
        PrcCommMethods.ADMIN_API(BrnModelObj, 'ADMIN_GET_COST_CENTER').then(function (data) {
            //$scope.COST_CENTER_LIST = data.data.Table;
            if (data.data.Table.length > 0) {
                $scope.COST_CENTER_LIST = $scope.COST_CENTER_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.CostCenterSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                    document.getElementById("overlay_loading").style.display = "none";
                }
                else {
                    $scope.CostCenterSearch.PAGE_NO = parseInt($scope.CostCenterSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                    document.getElementById("overlay_loading").style.display = "none";
                }
            }
            else {
                if ($scope.COST_CENTER_LIST.length == 0) {
                }
                $scope.GetData = false;
                document.getElementById("overlay_loading").style.display = "none";
            }
        });
    };
    //$scope.ADMIN_GET_COST_CENTER_SEARCH = function () {
    //    $scope.CostCenterForm.submitted = false;
    //    var BrnModelObj = new Object();
    //    BrnModelObj.CUSTOMER_ID = $scope.CostCenterSearch.CUSTOMER_ID != null ? $scope.CostCenterSearch.CUSTOMER_ID : '';
    //    BrnModelObj.ENTITY_ID = $scope.CostCenterSearch.ENTITY_ID != null ? $scope.CostCenterSearch.ENTITY_ID : '';
    //    BrnModelObj.USER_ID = parseInt($cookies.get("USERID"));
    //    BrnModelObj.COST_CENTER_CODE = $scope.CostCenterSearch.COST_CENTER_CODE != null ? $scope.CostCenterSearch.COST_CENTER_CODE : '';
    //    BrnModelObj.COST_CENTER_DESCRIPTION = $scope.CostCenterSearch.COST_CENTER_DESCRIPTION != null ? $scope.CostCenterSearch.COST_CENTER_DESCRIPTION : '';
    //    BrnModelObj.ACTIVE = $scope.CostCenterSearch.ACTIVE;
    //    BrnModelObj.PAGE_NO = 1;//$scope.CostCenterSearch.PAGE_NO;
    //    BrnModelObj.PAGE_SIZE = 1000;//$scope.CostCenterSearch.PAGE_SIZE;
    //    PrcCommMethods.ADMIN_API(BrnModelObj, 'ADMIN_GET_COST_CENTER').then(function (data) {
    //        $scope.COST_CENTER_LIST = data.data.Table;



    //    });
    //}
    $scope.ADMIN_GET_COST_CENTER();
    $scope.EDIT_INS_UPD_COST_CENETR = function (CC) {
        $scope.CostCenterSearch.COST_CENTER_ID = CC.COST_CENTER_ID;
        $scope.CostCenterSearch.COST_CENTER_CODE = CC.COST_CENTER_CODE;
        $scope.CostCenterSearch.COST_CENTER_DESCRIPTION = CC.COST_CENTER_DESCRIPTION;
        $scope.CostCenterSearch.CUSTOMER_ID = CC.CUSTOMER_ID;
        $scope.CostCenterSearch.ENTITY_ID = CC.ENTITY_ID;
        $scope.GET_ENTITY_LIST();
        $scope.CostCenterSearch.ACTIVE = CC.ACTIVE ? 1 : 0;
        $scope.EDIT_MODE = 1;
        //$scope.CostCenterSearch.INACTIVE = false;
        //$scope.CostCenterSearch.ALL = false;

    };
    $scope.DELETE_INS_UPD_COST_CENETR = function (CC) {
        if (confirm('Are you sure?')) {
            var CCModelObj = new Object();
            CCModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));;
            CCModelObj.COST_CENTER_ID = CC.COST_CENTER_ID;
            CCModelObj.ACTIVE = 2;
            CCModelObj.COMMENTS = "";
            CCModelObj.COST_CENTER_CODE = CC.COST_CENTER_CODE;
            PrcCommMethods.ADMIN_API(CCModelObj, 'ADMIN_INS_UPD_COST_CENETR').then(function (data) {
                $scope.$parent.ShowAlert('Success', 'Delete Successfully', 3000);
                $scope.ADMIN_GET_COST_CENTER();
            });
        }
    };

    $scope.GET_ENTITY_LIST = function () {

        if ($scope.CostCenterSearch.CUSTOMER_ID != undefined || '' || null) {
            var CusModelObj = new Object();
            CusModelObj.CUSTOMER_ID = $scope.CostCenterSearch.CUSTOMER_ID;
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
        }
        else { $scope.ENTITY_LIST = []; }
    };
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
    $scope.ADMIN_GET_CUSTOMER();
});
app.controller('EmpCatController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.$parent.PAGE_HEADER = "Employee Category";
    $scope.$parent.urlpath = "Employee_Category";
    $scope.GRP_ID = getUrlParameter('ID', $location.absUrl());
    $scope.CATEGORY_LIST = [];
    $scope.ENTITY_LIST = [];
    $scope.EmpCatSearch = {
        CATEGORIES_ID: 0,
        CATEGORY_NAME: "",
        CATEGORY_CODE: '',
        CAT_HIERARCHY: "",
        ENTITY_ID: null,
        PARENT_ID: null,
        ACTIVE: -1,
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        CLICK_SEARCH: null,
    };
    $scope.RESET_EMP = function () {
        $scope.EmpCatSearch = {
            CATEGORIES_ID: 0,
            CATEGORY_NAME: "",
            CATEGORY_CODE: '',
            CAT_HIERARCHY: "",
            ENTITY_ID: null,
            PARENT_ID: null,
            ACTIVE: -1,
            PAGE_NO: 1,
            PAGE_SIZE: 10,
            CUSTOMER_ID: null,
            ENTITY_ID: null,
            CLICK_SEARCH: null
        };
        $scope.EmpCatForm.submitted = false;
        $scope.ENTITY_LIST = [];
        $scope.CATEGORY_LIST = [];
        $scope.ADMIN_GET_EMPLOYEE_CATEGORY(2);
    };
    $scope.LAZY_ADMIN_GET_EMPLOYEE_CATEGORY = function () {
        $scope.ADMIN_GET_EMPLOYEE_CATEGORY();
    };
    $scope.ADMIN_GET_EMPLOYEE_CATEGORY = function (FLAG) {
        document.getElementById("overlay_loading").style.display = "block";
        var EMPModelObj = new Object();
        if (FLAG == 1) {
            $scope.EmpCatSearch.CLICK_SEARCH = 1;
            $scope.CATEGORY_LIST = [];
            $scope.EmpCatSearch.PAGE_NO = 1;
            EMPModelObj.ACTIVE = $scope.EmpCatSearch.ACTIVE == -1 ? -1 : $scope.EmpCatSearch.ACTIVE ? 1 : 0;
        }
        else if (FLAG == 2) {
            $scope.CATEGORY_LIST = [];
            EMPModelObj.ACTIVE = $scope.EmpCatSearch.ACTIVE == -1 ? -1 : $scope.EmpCatSearch.ACTIVE ? 1 : 0;
            $scope.EmpCatSearch.PAGE_NO = 1;
        }
        else if (FLAG == undefined) {
            if ($scope.EmpCatSearch.CLICK_SEARCH == 1)
                EMPModelObj.ACTIVE = $scope.EmpCatSearch.ACTIVE == -1 ? -1 : $scope.EmpCatSearch.ACTIVE ? 1 : 0;
            else
                EMPModelObj.ACTIVE = -1;
        }
        EMPModelObj.CUSTOMER_ID = $scope.EmpCatSearch.CLICK_SEARCH == 1 ? ($scope.EmpCatSearch.CUSTOMER_ID == undefined ? 0 : $scope.EmpCatSearch.CUSTOMER_ID) : 0;
        EMPModelObj.CATEGORY_NAME = $scope.EmpCatSearch.CLICK_SEARCH == 1 ? $scope.EmpCatSearch.CATEGORY_NAME : '';
        EMPModelObj.CAT_LEVEL = 1;
        EMPModelObj.MODULE_ID = 2;
        EMPModelObj.ENTITY_ID = $scope.EmpCatSearch.CLICK_SEARCH == 1 ? ($scope.EmpCatSearch.ENTITY_ID == undefined ? 0 : $scope.EmpCatSearch.ENTITY_ID) : null;
        EMPModelObj.CATEGORY_CODE = $scope.EmpCatSearch.CLICK_SEARCH == 1 ? $scope.EmpCatSearch.CATEGORY_CODE : '';
        EMPModelObj.PAGE_NO = $scope.EmpCatSearch.PAGE_NO;
        EMPModelObj.PAGE_SIZE = $scope.EmpCatSearch.PAGE_SIZE;

        PrcCommMethods.ADMIN_API(EMPModelObj, 'ADMIN_GET_EMPLOYEE_CATEGORY').then(function (data) {
            // $scope.CATEGORY_LIST = data.data.Table;
            if (data.data.Table.length > 0) {
                $scope.CATEGORY_LIST = $scope.CATEGORY_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.EmpCatSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                    document.getElementById("overlay_loading").style.display = "none";
                }
                else {
                    $scope.EmpCatSearch.PAGE_NO = parseInt($scope.EmpCatSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                    document.getElementById("overlay_loading").style.display = "none";
                }
            }
            else {
                $scope.GetData = false;
                document.getElementById("overlay_loading").style.display = "none";
            }
        });
    };
    $scope.ADMIN_GET_EMPLOYEE_CATEGORY();

    $scope.ADMIN_INS_UPD_EMPLOYEE_CATEGORY = function () {
        $scope.EmpCatForm.submitted = true;
        if ($scope.EmpCatForm.$valid) {
            if ($scope.EmpCatSearch.ACTIVE != -1) {
                document.getElementById("overlay_loading").style.display = "block";
                var AdminModelObj = new Object();
                AdminModelObj.CUSTOMER_ID = $scope.EmpCatSearch.CUSTOMER_ID;
                AdminModelObj.CATEGORIES_ID = $scope.EmpCatSearch.CATEGORIES_ID;
                AdminModelObj.CATEGORY_NAME = $scope.EmpCatSearch.CATEGORY_NAME;
                AdminModelObj.CATEGORY_CODE = $scope.EmpCatSearch.CATEGORY_CODE;
                AdminModelObj.CAT_LEVEL = 1;
                AdminModelObj.ENTITY_ID = $scope.EmpCatSearch.ENTITY_ID;
                AdminModelObj.PARENT_ID = 0;
                AdminModelObj.ACTIVE = $scope.EmpCatSearch.ACTIVE == true ? 1 : 0;
                AdminModelObj.USER_ID = parseInt($cookies.get("USERID"));
                AdminModelObj.COMMENTS = "";
                AdminModelObj.MODULE_ID = 2;
                PrcCommMethods.ADMIN_API(AdminModelObj, 'ADMIN_INS_UPD_EMPLOYEE_CATEGORY').then(function (data) {
                    $scope.$parent.ShowAlert("Success", "Save Successfully", 3000);
                    $scope.RESET_EMP();
                    document.getElementById("overlay_loading").style.display = "none";
                });
            }
            else { $scope.$parent.ShowAlert('Attention', 'Please Select Active/In-Active Option.', 3000); document.getElementById("overlay_loading").style.display = "none"; }
        }
    };
    $scope.EDIT_INS_UPD_EMPLOYEE_CATEGORY = function (EM) {
        $scope.EmpCatSearch.CUSTOMER_ID = EM.CUSTOMER_ID;
        $scope.EmpCatSearch.ENTITY_ID = EM.ENTITY_ID;
        $scope.GET_ENTITY_LIST();
        $scope.EmpCatSearch.CATEGORY_NAME = EM.CATEGORY_NAME;
        $scope.EmpCatSearch.CATEGORY_CODE = EM.CATEGORY_CODE;
        $scope.EmpCatSearch.ACTIVE = EM.ACTIVE == true ? 1 : 0;
        $scope.EmpCatSearch.CATEGORIES_ID = EM.CATEGORY_ID;
    };
    $scope.DELETE_INS_UPD_EMPLOYEE_CATEGORY = function (EM) {
        if (confirm('Are you sure?')) {
            var AreaModelObj = new Object();
            AreaModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
            AreaModelObj.CATEGORIES_ID = EM.CATEGORY_ID;
            AreaModelObj.CAT_LEVEL = 1;
            AreaModelObj.ENTITY_ID = EM.ENTITY_ID;
            AreaModelObj.PARENT_ID = 0;
            AreaModelObj.ACTIVE = 2;
            AreaModelObj.USER_ID = parseInt($cookies.get("USERID"));
            AreaModelObj.COMMENTS = "";
            AreaModelObj.MODULE_ID = 2;
            AreaModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.ADMIN_API(AreaModelObj, 'ADMIN_INS_UPD_EMPLOYEE_CATEGORY').then(function (data) {
                $scope.$parent.ShowAlert("Success", "Inactive Successfully", 3000);
                $scope.RESET_EMP();

            });
        }
    };

    $scope.ADMIN_GET_CUSTOMER = function () {
        var EMPModelObj = new Object();
        EMPModelObj.CUSTOMER_NAME = '';
        EMPModelObj.CUSTOMER_CODE = '';
        EMPModelObj.ACTIVE = 1;
        EMPModelObj.PAGE_NO = 1;
        EMPModelObj.PAGE_SIZE = 1000;//$scope.CustomerSearch.PAGE_SIZE;
        EMPModelObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(EMPModelObj, 'ADMIN_GET_CUSTOMER').then(function (data) {
            $scope.CUSTOMER_LIST = data.data.Table;
        });
    };
    $scope.ADMIN_GET_CUSTOMER();
    $scope.GET_ENTITY_LIST = function () {
        if ($scope.EmpCatSearch.CUSTOMER_ID != undefined && $scope.EmpCatSearch.CUSTOMER_ID != '' && $scope.EmpCatSearch.CUSTOMER_ID != null) {
            var CusModelObj = new Object();
            CusModelObj.CUSTOMER_ID = $scope.EmpCatSearch.CUSTOMER_ID;
            CusModelObj.ACTIVE = 1;
            CusModelObj.PAGE_NO = 0;
            CusModelObj.USER_ID = parseInt($cookies.get("USERID"));
            CusModelObj.IS_LIVE = -1;
            PrcCommMethods.ADMIN_API(CusModelObj, 'ADMIN_GET_ENTITIES').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.ENTITY_LIST = data.data.Table;
                }
                else { $scope.ENTITY_LIST = []; };
            });
        }
        else
            $scope.ENTITY_LIST = [];
    };
    //$scope.GET_ENTITY_LIST();
});
app.controller('SubEmpCatController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.$parent.PAGE_HEADER = "Employee Sub Category";
    $scope.$parent.urlpath = "Employee_Sub_Category";
    $scope.GRP_ID = getUrlParameter('ID', $location.absUrl());
    $scope.SUB_CATEGORY_LIST = [];
    $scope.CUSTOMER_LIST = [];
    $scope.ENTITY_LIST = [];
    $scope.EmpCatSearch = {
        SUB_CATEGORY_ID: null,
        CATEGORIES_ID: null,
        CATEGORY_NAME: "",
        CAT_HIERARCHY: "",
        ENTITY_ID: null,
        PARENT_ID: null,
        ACTIVE: -1,
        PAGE_NO: 1,
        PAGE_SIZE: 10, CLICK_SEARCH: null
    };
    $scope.RESET_EMP = function () {
        $scope.EmpCatSearch = {
            SUB_CATEGORY_ID: null,
            CATEGORIES_ID: null,
            CATEGORY_NAME: "",
            CAT_HIERARCHY: "",
            ENTITY_ID: null,
            PARENT_ID: null,
            ACTIVE: -1,
            PAGE_NO: 1,
            PAGE_SIZE: 10, CLICK_SEARCH: null
        };
        $scope.EmpCatForm.submitted = false;
        $scope.SUB_CATEGORY_LIST = [];
        $scope.ENTITY_LIST = [];
        $scope.CATEGORY_LIST = [];
        $scope.SUB_CATEGORY_LIST = [];
        $scope.ADMIN_GET_EMPLOYEE_SUB_CATEGORY(2);
    };
    $scope.ADMIN_GET_EMPLOYEE_CATEGORY = function () {
        if ($scope.EmpCatSearch.ENTITY_ID != undefined) {
            var EMPModelObj = new Object();
            EMPModelObj.CUSTOMER_ID = $scope.EmpCatSearch.CUSTOMER_ID;
            //EMPModelObj.CATEGORY_NAME = $scope.EmpCatSearch.SUB_CATEGORY_NAME;
            EMPModelObj.ACTIVE = 1;
            EMPModelObj.PAGE_NO = 0  // $scope.EmpCatSearch.PAGE_NO;
            EMPModelObj.PAGE_SIZE = 1000;// $scope.EmpCatSearch.PAGE_SIZE;
            EMPModelObj.CAT_LEVEL = 1;
            EMPModelObj.MODULE_ID = 2;
            EMPModelObj.PARENT_ID = 0;
            EMPModelObj.ENTITY_ID = $scope.EmpCatSearch.ENTITY_ID;
            EMPModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.ADMIN_API(EMPModelObj, 'ADMIN_GET_EMPLOYEE_CATEGORY').then(function (data) {
                $scope.CATEGORY_LIST = data.data.Table;
            });
        }
        else
            $scope.CATEGORY_LIST = [];
    };
    $scope.LAZY_ADMIN_GET_EMPLOYEE_SUB_CATEGORY = function () {
        $scope.ADMIN_GET_EMPLOYEE_SUB_CATEGORY();
    };

    $scope.ADMIN_GET_EMPLOYEE_SUB_CATEGORY = function (FLAG) {
        document.getElementById("overlay_loading").style.display = "block";
        var EMPModelObj = new Object();
        if (FLAG == 1) {
            $scope.EmpCatSearch.CLICK_SEARCH = 1;
            $scope.SUB_CATEGORY_LIST = [];
            $scope.EmpCatSearch.PAGE_NO = 1;
            EMPModelObj.ACTIVE = $scope.EmpCatSearch.ACTIVE == -1 ? -1 : $scope.EmpCatSearch.ACTIVE ? 1 : 0;
        }
        else if (FLAG == 2) {
            $scope.SUB_CATEGORY_LIST = [];
            EMPModelObj.ACTIVE = $scope.EmpCatSearch.ACTIVE == -1 ? -1 : $scope.EmpCatSearch.ACTIVE ? 1 : 0;
            $scope.EmpCatSearch.PAGE_NO = 1;
        }
        else if (FLAG == undefined) {
            if ($scope.EmpCatSearch.CLICK_SEARCH == 1)
                EMPModelObj.ACTIVE = $scope.EmpCatSearch.ACTIVE == -1 ? -1 : $scope.EmpCatSearch.ACTIVE ? 1 : 0;
            else
                EMPModelObj.ACTIVE = -1;
        }

        EMPModelObj.CUSTOMER_ID = $scope.EmpCatSearch.CLICK_SEARCH == 1 ? $scope.EmpCatSearch.CUSTOMER_ID : null;
        EMPModelObj.CATEGORY_NAME = $scope.EmpCatSearch.CLICK_SEARCH == 1 ? $scope.EmpCatSearch.SUB_CATEGORY_NAME : '';
        //EMPModelObj.ACTIVE = -1;
        EMPModelObj.PAGE_NO = $scope.EmpCatSearch.PAGE_NO;
        EMPModelObj.PAGE_SIZE = $scope.EmpCatSearch.PAGE_SIZE;//;
        EMPModelObj.CAT_LEVEL = 2;
        EMPModelObj.MODULE_ID = 2;
        //EMPModelObj.PARENT_ID = 0;//$scope.EmpCatSearch.CATEGORY_ID;
        EMPModelObj.PARENT_ID = $scope.EmpCatSearch.CLICK_SEARCH == 1 ? $scope.EmpCatSearch.CATEGORY_ID : null;
        EMPModelObj.ENTITY_ID = $scope.EmpCatSearch.CLICK_SEARCH == 1 ? $scope.EmpCatSearch.ENTITY_ID : null;
        EMPModelObj.SUB_CATEGORY_CODE = $scope.EmpCatSearch.CLICK_SEARCH == 1 ? $scope.EmpCatSearch.SUB_CATEGORY_CODE : '';
        PrcCommMethods.ADMIN_API(EMPModelObj, 'ADMIN_GET_EMPLOYEE_SUB_CATEGORY').then(function (data) {
            //$scope.SUB_CATEGORY_LIST = data.data.Table;
            if (data.data.Table.length > 0) {
                $scope.SUB_CATEGORY_LIST = $scope.SUB_CATEGORY_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.EmpCatSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                    document.getElementById("overlay_loading").style.display = "none";
                }
                else {
                    $scope.EmpCatSearch.PAGE_NO = parseInt($scope.EmpCatSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                    document.getElementById("overlay_loading").style.display = "none";
                }
            }
            else {
                if ($scope.SUB_CATEGORY_LIST.length == 0) {
                }
                $scope.GetData = false;
                document.getElementById("overlay_loading").style.display = "none";
            }


        });
    };
    $scope.ADMIN_GET_EMPLOYEE_SUB_CATEGORY();
    //$scope.ADMIN_GET_EMPLOYEE_CATEGORY();

    $scope.ADMIN_GET_CUSTOMER = function () {
        var EMPModelObj = new Object();
        EMPModelObj.CUSTOMER_NAME = '';
        EMPModelObj.CUSTOMER_CODE = '';
        EMPModelObj.ACTIVE = 1;
        EMPModelObj.PAGE_NO = 1;
        EMPModelObj.PAGE_SIZE = 1000;//$scope.CustomerSearch.PAGE_SIZE;
        EMPModelObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(EMPModelObj, 'ADMIN_GET_CUSTOMER').then(function (data) {
            $scope.CUSTOMER_LIST = data.data.Table;
        });
    };
    $scope.GET_ENTITY_LIST = function () {
        if ($scope.EmpCatSearch.CUSTOMER_ID != undefined && $scope.EmpCatSearch.CUSTOMER_ID != '' && $scope.EmpCatSearch.CUSTOMER_ID != null) {
            var CusModelObj = new Object();
            CusModelObj.CUSTOMER_ID = $scope.EmpCatSearch.CUSTOMER_ID;
            CusModelObj.ACTIVE = 1;
            CusModelObj.PAGE_NO = 0;
            CusModelObj.USER_ID = parseInt($cookies.get("USERID"));
            CusModelObj.IS_LIVE = -1;
            PrcCommMethods.ADMIN_API(CusModelObj, 'ADMIN_GET_ENTITIES').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.ENTITY_LIST = data.data.Table;
                }
                else { $scope.ENTITY_LIST = []; };
            });
        }
        else
            $scope.ENTITY_LIST = [];
    };
    $scope.ADMIN_GET_CUSTOMER();

    $scope.ADMIN_INS_UPD_EMPLOYEE_CATEGORY = function () {
        $scope.EmpCatForm.submitted = true;
        if ($scope.EmpCatForm.$valid) {
            if ($scope.EmpCatSearch.ACTIVE != -1) {
                document.getElementById("overlay_loading").style.display = "block";
                var EMPModelObj = new Object();
                EMPModelObj.CUSTOMER_ID = $scope.EmpCatSearch.CUSTOMER_ID;
                EMPModelObj.CATEGORIES_ID = $scope.EmpCatSearch.SUB_CATEGORY_ID == null ? 0 : $scope.EmpCatSearch.SUB_CATEGORY_ID;
                EMPModelObj.CATEGORY_NAME = $scope.EmpCatSearch.SUB_CATEGORY_NAME;
                EMPModelObj.CAT_LEVEL = 2;
                EMPModelObj.ENTITY_ID = $scope.EmpCatSearch.ENTITY_ID;
                EMPModelObj.PARENT_ID = $scope.EmpCatSearch.CATEGORY_ID;
                EMPModelObj.ACTIVE = $scope.EmpCatSearch.ACTIVE ? 1 : 0;
                EMPModelObj.USER_ID = parseInt($cookies.get("USERID"));
                EMPModelObj.COMMENTS = "";
                EMPModelObj.MODULE_ID = 2;
                EMPModelObj.CATEGORY_CODE = $scope.EmpCatSearch.SUB_CATEGORY_CODE;

                PrcCommMethods.ADMIN_API(EMPModelObj, 'ADMIN_INS_UPD_EMPLOYEE_CATEGORY').then(function (data) {
                    $scope.$parent.ShowAlert("Success", "Save Successfully", 3000);
                    $scope.RESET_EMP();
                    document.getElementById("overlay_loading").style.display = "none";
                });
            }
            else { $scope.$parent.ShowAlert('Attention', 'Please Select Active/In-Active Option.', 3000); document.getElementById("overlay_loading").style.display = "none"; }
        }
    };
    $scope.EDIT_INS_UPD_EMPLOYEE_CATEGORY = function (EM) {
        $scope.EmpCatSearch.CUSTOMER_ID = EM.CUSTOMER_ID;
        $scope.EmpCatSearch.ENTITY_ID = EM.ENTITY_ID;
        $scope.EmpCatSearch.SUB_CATEGORY_ID = EM.SUB_CATEGORY_ID;
        $scope.EmpCatSearch.SUB_CATEGORY_NAME = EM.CATEGORY_NAME;
        $scope.EmpCatSearch.ACTIVE = EM.ACTIVE == true ? 1 : 0;
        $scope.EmpCatSearch.SUB_CATEGORY_NAME = EM.SUB_CATEGORY_NAME;
        $scope.EmpCatSearch.ENTITY_ID = EM.ENTITY_ID;
        $scope.GET_ENTITY_LIST();
        $scope.ADMIN_GET_EMPLOYEE_CATEGORY();
        $scope.EmpCatSearch.CATEGORY_ID = EM.CATEGORY_ID;
        $scope.EmpCatSearch.SUB_CATEGORY_CODE = EM.SUB_CATEGORY_CODE;

        //$scope.EmpCatSearch.C
    };
    $scope.DELETE_INS_UPD_EMPLOYEE_CATEGORY = function (EM) {
        if (confirm('Are you sure?')) {
            var EMPModelObj = new Object();
            EMPModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
            EMPModelObj.CATEGORIES_ID = EM.SUB_CATEGORY_ID;
            EMPModelObj.CAT_LEVEL = 1;
            EMPModelObj.ENTITY_ID = EM.ENTITY_ID;
            EMPModelObj.PARENT_ID = 0;
            EMPModelObj.ACTIVE = 2;
            EMPModelObj.USER_ID = parseInt($cookies.get("USERID"));
            EMPModelObj.COMMENTS = "";
            EMPModelObj.MODULE_ID = 2;
            EMPModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.ADMIN_API(EMPModelObj, 'ADMIN_INS_UPD_EMPLOYEE_CATEGORY').then(function (data) {
                $scope.$parent.ShowAlert("Success", "Inactive Successfully", 3000);
                $scope.RESET_EMP();
                $scope.ADMIN_GET_EMPLOYEE_SUB_CATEGORY();
            });
        }
    };
});
app.controller('ContractController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.$parent.PAGE_HEADER = "Contract Type";
    $scope.$parent.urlpath = "Contract_Type";
    $scope.GRP_ID = getUrlParameter('ID', $location.absUrl());
    $scope.CUSTOMER_LIST = [];
    $scope.ENTITY_LIST = [];
    $scope.CONTRACT_TYPE_LIST = [];
    $scope.ContractSearch = {
        CONTRACT_TYPE_NAME: "",
        ACTIVE: -1,
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        CUSTOMER_ID: null,
        ENTITY_ID: null,
        CLICK_SEARCH: null,
    };
    $scope.RESET_CON = function () {
        $scope.ContractSearch = {
            CONTRACT_TYPE_NAME: "",
            ACTIVE: -1,
            PAGE_NO: 1,
            PAGE_SIZE: 10,
            CLICK_SEARCH: null
        };
        $scope.ContactForm.submitted = false;
        $scope.CONTRACT_TYPE_LIST = [];
        $scope.ENTITY_LIST = []; $scope.ContractSearch.CLICK_SEARCH = null;
        $scope.ADMIN_GET_CONTRACT_TYPE(2);
    };
    $scope.LAZY_ADMIN_GET_CONTRACT_TYPE = function () {
        $scope.ADMIN_GET_CONTRACT_TYPE();
    };
    $scope.ADMIN_GET_CONTRACT_TYPE = function (FLAG) {
        var CONModelObj = new Object();
        if (FLAG == 1) {
            $scope.ContractSearch.CLICK_SEARCH = 1;
            $scope.CONTRACT_TYPE_LIST = [];
            $scope.ContractSearch.PAGE_NO = 1;
            CONModelObj.ACTIVE = $scope.ContractSearch.ACTIVE == -1 ? -1 : $scope.ContractSearch.ACTIVE ? 1 : 0;
        }
        else if (FLAG == 2) {
            $scope.CONTRACT_TYPE_LIST = [];
            $scope.ContractSearch.PAGE_NO = 1;
            CONModelObj.ACTIVE = $scope.ContractSearch.ACTIVE == -1 ? -1 : $scope.ContractSearch.ACTIVE ? 1 : 0;

        }
        else if (FLAG == undefined) {
            if ($scope.ContractSearch.CLICK_SEARCH == 1)
                CONModelObj.ACTIVE = $scope.ContractSearch.ACTIVE == -1 ? -1 : $scope.ContractSearch.ACTIVE ? 1 : 0;
            else
                CONModelObj.ACTIVE = -1;
        }

        CONModelObj.CUSTOMER_ID = $scope.ContractSearch.CLICK_SEARCH == 1 ? $scope.ContractSearch.CUSTOMER_ID : null;
        CONModelObj.ENTITY_ID = $scope.ContractSearch.CLICK_SEARCH == 1 ? $scope.ContractSearch.ENTITY_ID : null;
        CONModelObj.CONTRACT_TYPE_NAME = $scope.ContractSearch.CLICK_SEARCH == 1 ? $scope.ContractSearch.CONTRACT_TYPE_NAME : '';
        CONModelObj.PAGE_NO = $scope.ContractSearch.PAGE_NO;
        CONModelObj.PAGE_SIZE = $scope.ContractSearch.PAGE_SIZE;
        CONModelObj.CONTRACT_TYPE_CODE = $scope.ContractSearch.CLICK_SEARCH == 1 ? $scope.ContractSearch.CONTRACT_TYPE_CODE : '';
        PrcCommMethods.ADMIN_API(CONModelObj, 'ADMIN_GET_CONTRACT_TYPE').then(function (data) {
            //  $scope.CONTRACT_TYPE_LIST = data.data.Table;
            if (data.data.Table.length > 0) {
                $scope.CONTRACT_TYPE_LIST = $scope.CONTRACT_TYPE_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.ContractSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.ContractSearch.PAGE_NO = parseInt($scope.ContractSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else {
                if ($scope.CONTRACT_TYPE_LIST.length == 0) {
                }
                $scope.GetData = false;
            }

        });
    };
    $scope.ADMIN_GET_CONTRACT_TYPE();
    $scope.ADMIN_INS_UPD_CONTRACT_TYPE = function () {
        $scope.ContactForm.submitted = true;
        if ($scope.ContactForm.$valid) {
            if ($scope.ContractSearch.ACTIVE != -1) {
                var ContModelObj = new Object();
                ContModelObj.CUSTOMER_ID = $scope.ContractSearch.CUSTOMER_ID;
                ContModelObj.CONTRACT_TYPE_ID = $scope.ContractSearch.CONTRACT_TYPE_ID;
                ContModelObj.CONTRACT_TYPE_NAME = $scope.ContractSearch.CONTRACT_TYPE_NAME;
                ContModelObj.ACTIVE = $scope.ContractSearch.ACTIVE ? 1 : 0;
                ContModelObj.USER_ID = parseInt($cookies.get("USERID"));
                ContModelObj.COMMENT = $scope.ContractSearch.COMMENT;
                ContModelObj.ENTITY_ID = $scope.ContractSearch.ENTITY_ID;
                ContModelObj.CONTRACT_TYPE_CODE = $scope.ContractSearch.CONTRACT_TYPE_CODE;
                PrcCommMethods.ADMIN_API(ContModelObj, 'ADMIN_INS_UPD_CONTRACT_TYPE').then(function (data) {
                    $scope.$parent.ShowAlert("Success", "Save Successfully", 3000);
                    $scope.RESET_CON();
                });
            }
            else { $scope.$parent.ShowAlert('Attention', 'Please Select Active/In-Active Option.', 3000); $scope.ContactForm.submitted = false; }
        }
    };
    $scope.EDIT_ADMIN_INS_UPD_CONTRACT_TYPE = function (CON) {
        $scope.ContractSearch.CUSTOMER_ID = CON.CUSTOMER_ID;
        $scope.ContractSearch.ENTITY_ID = CON.ENTITY_ID;
        $scope.GET_ENTITY_LIST();
        $scope.ContractSearch.CONTRACT_TYPE_ID = CON.CONTRACT_TYPE_ID;
        $scope.ContractSearch.CONTRACT_TYPE_NAME = CON.CONTRACT_TYPE_NAME;
        $scope.ContractSearch.ACTIVE = CON.ACTIVE == true ? 1 : 0;
        $scope.ContractSearch.USER_ID = parseInt($cookies.get("USERID"));
        $scope.ContractSearch.CONTRACT_TYPE_CODE = CON.CONTRACT_CODE;
    };
    $scope.DELETE_ADMIN_INS_UPD_CONTRACT_TYPE = function (CONTRACT) {
        if (confirm('Are you sure?')) {
            var ContracrModelObj = new Object();
            ContracrModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
            ContracrModelObj.AREA_ID = CONTRACT.CONTRACT_TYPE_ID;
            ContracrModelObj.ACTIVE = 2;
            ContracrModelObj.USER_ID = parseInt($cookies.get("USERID"));
            ContracrModelObj.CONTRACT_TYPE_ID = CONTRACT.CONTRACT_TYPE_NAME;
            PrcCommMethods.ADMIN_API(ContracrModelObj, 'ADMIN_INS_UPD_CONTRACT_TYPE').then(function (data) {
                $scope.$parent.ShowAlert("Success", "Inactive Successfully", 3000);
                $scope.RESET_CON();
                $scope.ADMIN_GET_CONTRACT_TYPE();
            });
        }
    };

    $scope.GET_ENTITY_LIST = function () {

        if ($scope.ContractSearch.CUSTOMER_ID != undefined && $scope.ContractSearch.CUSTOMER_ID != '' && $scope.ContractSearch.CUSTOMER_ID != null) {
            var CusModelObj = new Object();
            CusModelObj.CUSTOMER_ID = $scope.ContractSearch.CUSTOMER_ID;
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
        }
        else { $scope.ENTITY_LIST = []; }
    };
    $scope.ADMIN_GET_CUSTOMER = function () {
        var ContracrModelObj = new Object();
        ContracrModelObj.CUSTOMER_NAME = '';
        ContracrModelObj.CUSTOMER_CODE = '';
        ContracrModelObj.ACTIVE = 1;
        ContracrModelObj.PAGE_NO = 1;
        ContracrModelObj.PAGE_SIZE = 1000;//$scope.CustomerSearch.PAGE_SIZE;
        ContracrModelObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(ContracrModelObj, 'ADMIN_GET_CUSTOMER').then(function (data) {
            $scope.CUSTOMER_LIST = data.data.Table;
        });
    };
    $scope.ADMIN_GET_CUSTOMER();
});
app.controller('NationalityController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.$parent.PAGE_HEADER = "Nationality";
    $scope.GRP_ID = getUrlParameter('ID', $location.absUrl());
    $scope.NATIONALITY_LIST = [];
    $scope.ENTITY_LIST = [];
    $scope.NationalitySearch = {
        NATIONALITY_ID: '',
        NATIONALITY_NAME: "",
        ACTIVE: 0,
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        CLICK_SEARCH: null
    };
    $scope.RESET_NAT = function () {
        $scope.NationalitySearch = {
            NATIONALITY_ID: '',
            NATIONALITY_NAME: "",
            ACTIVE: 0,
            PAGE_NO: 1,
            PAGE_SIZE: 10,
            CLICK_SEARCH: null
        };
        $scope.NationalityForm.submitted = false;
        $scope.ADMIN_GET_NATIONALITY(2);
    };
    $scope.ADMIN_GET_NATIONALITY = function (FLAG) {
        document.getElementById("overlay_loading").style.display = "block";
        var CONModelObj = new Object();
        if (FLAG == 1) {
            $scope.NationalitySearch.CLICK_SEARCH = 1;
            $scope.USER_LIST = [];
            $scope.NationalitySearch.PAGE_NO = 1;
            CONModelObj.ACTIVE = $scope.NationalitySearch.ACTIVE == -1 ? -1 : $scope.NationalitySearch.ACTIVE ? 1 : 0;
        }
        else if (FLAG == 2) {
            $scope.USER_LIST = [];
            CONModelObj.ACTIVE = $scope.NationalitySearch.ACTIVE == -1 ? -1 : $scope.NationalitySearch.ACTIVE ? 1 : 0;
            $scope.NationalitySearch.PAGE_NO = 1;
        }
        else if (FLAG == undefined) {
            if ($scope.UserSearch.CLICK_SEARCH == 1)
                CONModelObj.ACTIVE = $scope.NationalitySearch.ACTIVE == -1 ? -1 : $scope.NationalitySearch.ACTIVE ? 1 : 0;
            else {
                CONModelObj.ACTIVE = -1;
            }
        }

        CONModelObj.CUSTOMER_ID = null;//$scope.NationalitySearch.CUSTOMER_ID;;
        CONModelObj.NATIONALITY_ID = $scope.NationalitySearch.ACTIVE == 1 ? $scope.NationalitySearch.NATIONALITY_ID : null;
        CONModelObj.NATIONALITY_NAME = $scope.NationalitySearch.ACTIVE == 1 ? $scope.NationalitySearch.NATIONALITY_NAME : '';
        //CONModelObj.ACTIVE = -1;
        CONModelObj.PAGE_NO = $scope.NationalitySearch.PAGE_NO;
        CONModelObj.PAGE_SIZE = $scope.NationalitySearch.PAGE_SIZE;
        //CONModelObj.USER_ID = parseInt($cookies.get("USERID"));;
        CONModelObj.ENTITY_ID = null;//$scope.NationalitySearch.ENTITY_ID;
        PrcCommMethods.ADMIN_API(CONModelObj, 'ADMIN_GET_NATIONALITY').then(function (data) {
            //$scope.NATIONALITY_LIST = data.data.Table;
            if (data.data.Table.length > 0) {
                $scope.NATIONALITY_LIST = $scope.NATIONALITY_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.NationalitySearch.PAGE_SIZE) {
                    $scope.GetData = false;
                    document.getElementById("overlay_loading").style.display = "none";
                }
                else {
                    $scope.NationalitySearch.PAGE_NO = parseInt($scope.NationalitySearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                    document.getElementById("overlay_loading").style.display = "none";
                }
            }
            else
                $scope.GetData = false;
            document.getElementById("overlay_loading").style.display = "none";
        });
    };
    $scope.ADMIN_GET_NATIONALITY();
    $scope.ADMIN_INS_UPD_NATIONALITY = function () {
        $scope.NationalityForm.submitted = true;
        if ($scope.NationalityForm.$valid) {
            document.getElementById("overlay_loading").style.display = "block";
            var NatioModelObj = new Object();
            //NatioModelObj.CUSTOMER_ID = null;// $scope.NationalitySearch.CUSTOMER_ID;
            NatioModelObj.NATIONALITY_ID = $scope.NationalitySearch.NATIONALITY_ID;
            NatioModelObj.NATIONALITY_NAME = $scope.NationalitySearch.NATIONALITY_NAME;
            NatioModelObj.ACTIVE = $scope.NationalitySearch.ACTIVE ? 1 : 0;
            NatioModelObj.USER_ID = parseInt($cookies.get("USERID"));
            //NatioModelObj.ENTITY_ID = null;//$scope.NationalitySearch.ENTITY_ID;
            PrcCommMethods.ADMIN_API(NatioModelObj, 'ADMIN_INS_UPD_NATIONALITY').then(function (data) {
                $scope.$parent.ShowAlert("Success", "Save Successfully", 3000);
                $scope.RESET_NAT();
                document.getElementById("overlay_loading").style.display = "none";
            });
        }
    };
    $scope.EDIT_ADMIN_INS_UPD_NATIONALITY = function (NAT) {
        $scope.NationalitySearch.NATIONALITY_ID = NAT.NATIONALITY_ID;
        $scope.NationalitySearch.NATIONALITY_NAME = NAT.NATIONALITY_NAME;
        $scope.NationalitySearch.ACTIVE = NAT.ACTIVE ? true : false;
        //$scope.NationalitySearch.CUSTOMER_ID = NAT.CUSTOMER_ID;
        //$scope.NationalitySearch.ENTITY_ID = NAT.ENTITY_ID;
        //$scope.GET_ENTITY_LIST();;
    };
    $scope.DELETE_ADMIN_INS_UPD_NATIONALITY = function (NAT) {
        if (confirm('Are you sure?')) {
            var NatioModelObj = new Object();
            NatioModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
            NatioModelObj.NATIONALITY_ID = NAT.NATIONALITY_ID;
            NatioModelObj.ACTIVE = 2;
            NatioModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.ADMIN_API(NatioModelObj, 'ADMIN_INS_UPD_NATIONALITY').then(function (data) {
                $scope.$parent.ShowAlert("Success", "Inactive Successfully", 3000);
                $scope.RESET_NAT();
                $scope.ADMIN_GET_NATIONALITY();
            });
        }
    };

    $scope.GET_ENTITY_LIST = function () {

        if ($scope.NationalitySearch.CUSTOMER_ID != undefined && $scope.NationalitySearch.CUSTOMER_ID != '' && $scope.NationalitySearch.CUSTOMER_ID != null) {
            var CusModelObj = new Object();
            CusModelObj.CUSTOMER_ID = $scope.NationalitySearch.CUSTOMER_ID;
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
        }
        else { $scope.ENTITY_LIST = []; }
    };
    $scope.ADMIN_GET_CUSTOMER = function () {
        var ContracrModelObj = new Object();
        ContracrModelObj.CUSTOMER_NAME = '';
        ContracrModelObj.CUSTOMER_CODE = '';
        ContracrModelObj.ACTIVE = 1;
        ContracrModelObj.PAGE_NO = 1;
        ContracrModelObj.PAGE_SIZE = 1000;//$scope.CustomerSearch.PAGE_SIZE;
        ContracrModelObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(ContracrModelObj, 'ADMIN_GET_CUSTOMER').then(function (data) {
            $scope.CUSTOMER_LIST = data.data.Table;
        });
    };
    //$scope.ADMIN_GET_CUSTOMER();
});
app.controller('NationalityIDController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.$parent.PAGE_HEADER = "Nationality ID Type";
    $scope.$parent.urlpath = "National_ID_Type";
    $scope.GRP_ID = getUrlParameter('ID', $location.absUrl());

    $scope.NATIONALITYIDTYPE_LIST = [];
    $scope.NATIONALITY_LIST = [];
    $scope.CUSTOMER_LIST = [];
    $scope.ENTITY_LIST = [];
    $scope.NationalityIDTypeSearch = {
        NATIONALITY_ID: null,
        NATIONAL_ID_TYPE_IDS: 0,
        NATIONALITY_NAME: "",
        ACTIVE: -1,
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        CLICK_SEARCH: null
    };
    $scope.RESET_NAT = function () {
        $scope.NationalityIDTypeSearch = {
            NATIONALITY_ID: null,
            NATIONAL_ID_TYPE_IDS: 0,
            NATIONALITY_NAME: "",
            ACTIVE: -1,
            PAGE_NO: 1,
            PAGE_SIZE: 10,
            CLICK_SEARCH: null
            //, CUSTOMER_ID: null, ENTITY_ID: null
        };
        $scope.NationalityForm.submitted = false;
        $scope.ADMIN_GET_NATIONAL_ID_TYPE(2);
    };
    $scope.ADMIN_GET_NATIONALITY = function () {
        document.getElementById("overlay_loading").style.display = "block";
        var CONModelObj = new Object();
        CONModelObj.CUSTOMER_ID = null; //$scope.NationalityIDTypeSearch.CUSTOMER_ID;
        CONModelObj.NATIONALITY_NAME = '';//$scope.NationalityIDTypeSearch.NATIONALITY_NAME;
        CONModelObj.ACTIVE = -1;
        CONModelObj.PAGE_NO = 1;
        CONModelObj.PAGE_SIZE = 1000;
        CONModelObj.USER_ID = parseInt($cookies.get("USERID"));
        CONModelObj.ENTITY_ID = null;// $scope.NationalityIDTypeSearch.ENTITY_ID;
        PrcCommMethods.ADMIN_API(CONModelObj, 'ADMIN_GET_NATIONALITY').then(function (data) {
            $scope.NATIONALITY_LIST = data.data.Table;
            document.getElementById("overlay_loading").style.display = "none";
        });
    };
    $scope.LAZY_ADMIN_GET_NATIONAL_ID_TYPE = function () { $scope.ADMIN_GET_NATIONAL_ID_TYPE(); };
    $scope.ADMIN_GET_NATIONAL_ID_TYPE = function (FLAG) {
        document.getElementById("overlay_loading").style.display = "block";
        var CONModelObj = new Object();
        if (FLAG == 1) {
            $scope.NationalityIDTypeSearch.CLICK_SEARCH = 1;
            $scope.NATIONALITYIDTYPE_LIST = [];
            $scope.NationalityIDTypeSearch.PAGE_NO = 1;
            //CONModelObj.ACTIVE = $scope.NationalityIDTypeSearch.ACTIVE ? 1 : 0;
            CONModelObj.ACTIVE = $scope.NationalityIDTypeSearch.ACTIVE == -1 ? -1 : $scope.NationalityIDTypeSearch.ACTIVE ? 1 : 0;
        }
        else if (FLAG == 2) {
            $scope.NATIONALITYIDTYPE_LIST = [];
            CONModelObj.ACTIVE = -1;
            CONModelObj.ACTIVE = $scope.NationalityIDTypeSearch.ACTIVE == -1 ? -1 : $scope.NationalityIDTypeSearch.ACTIVE ? 1 : 0;
        }
        else if (FLAG == undefined) {
            if ($scope.NationalityIDTypeSearch.CLICK_SEARCH == 1)
                CONModelObj.ACTIVE = $scope.NationalityIDTypeSearch.ACTIVE == -1 ? -1 : $scope.NationalityIDTypeSearch.ACTIVE ? 1 : 0;
            else {
                CONModelObj.ACTIVE = -1;
            }
        }
        CONModelObj.NATIONALITY_ID = $scope.NationalityIDTypeSearch.CLICK_SEARCH == 1 ? $scope.NationalityIDTypeSearch.NATIONALITY_ID : null;
        CONModelObj.NATIONAL_TYPE_NAME = $scope.NationalityIDTypeSearch.CLICK_SEARCH == 1 ? $scope.NationalityIDTypeSearch.NATIONAL_TYPE_NAME : '';
        CONModelObj.PAGE_NO = $scope.NationalityIDTypeSearch.PAGE_NO;
        CONModelObj.PAGE_SIZE = $scope.NationalityIDTypeSearch.PAGE_SIZE;
        CONModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.ADMIN_API(CONModelObj, 'ADMIN_GET_NATIONALITY_ID_TYPE').then(function (data) {
            //$scope.NATIONALITYIDTYPE_LIST = data.data.Table;
            if (data.data.Table.length > 0) {
                $scope.NATIONALITYIDTYPE_LIST = $scope.NATIONALITYIDTYPE_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.NationalityIDTypeSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                    document.getElementById("overlay_loading").style.display = "none";
                }
                else {
                    $scope.NationalityIDTypeSearch.PAGE_NO = parseInt($scope.NationalityIDTypeSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                    document.getElementById("overlay_loading").style.display = "none";
                }
            }
            else {
                if ($scope.NATIONALITYIDTYPE_LIST.length == 0) {
                }
                $scope.GetData = false;
                document.getElementById("overlay_loading").style.display = "none";
            }
        });
    };
    $scope.ADMIN_GET_NATIONAL_ID_TYPE();
    $scope.ADMIN_GET_NATIONALITY();

    $scope.ADMIN_INS_UPD_NATIONALITY_ID_TYPES = function () {
        $scope.NationalityForm.submitted = true;
        if ($scope.NationalityForm.$valid) {
            if ($scope.NationalityIDTypeSearch.ACTIVE != -1) {
                document.getElementById("overlay_loading").style.display = "block";
                var NatioModelObj = new Object();
                NatioModelObj.CUSTOMER_ID = null;// $scope.NationalityIDTypeSearch.CUSTOMER_ID;
                NatioModelObj.NATIONALITY_ID_TYPES = $scope.NationalityIDTypeSearch.NATIONAL_ID_TYPE_IDS;
                NatioModelObj.NATIONALITY_ID = $scope.NationalityIDTypeSearch.NATIONALITY_ID;
                NatioModelObj.NATIONAL_TYPE_NAME = $scope.NationalityIDTypeSearch.NATIONAL_TYPE_NAME;
                NatioModelObj.ACTIVE = $scope.NationalityIDTypeSearch.ACTIVE ? 1 : 0;
                NatioModelObj.USER_ID = parseInt($cookies.get("USERID"));
                NatioModelObj.ENTITY_ID = null;//$scope.NationalityIDTypeSearch.ENTITY_ID;
                PrcCommMethods.ADMIN_API(NatioModelObj, 'ADMIN_INS_UPD_NATIONALITY_ID_TYPES').then(function (data) {
                    if (data.data == -1) {
                        $scope.$parent.ShowAlert("Error", "Selected Nationality Type Already Exists, in Selected Nationality.", 3000);
                        document.getElementById("overlay_loading").style.display = "none";
                    }
                    else {
                        $scope.$parent.ShowAlert("Success", "Save Successfully", 3000);
                        $scope.RESET_NAT();
                        document.getElementById("overlay_loading").style.display = "none";
                    }
                });
            }
            else { $scope.$parent.ShowAlert('Attention', 'Please Select Active/In-Active Option.', 3000); $scope.NationalityForm.submitted = false; document.getElementById("overlay_loading").style.display = "none"; }
        }
    };
    $scope.EDIT_ADMIN_INS_UPD_NATIONALITY = function (NAT) {

        $scope.NationalityIDTypeSearch.NATIONAL_ID_TYPE_IDS = NAT.NATIONALITY_ID_TYPES;
        $scope.NationalityIDTypeSearch.NATIONALITY_ID = NAT.NATIONALITY_ID;
        //  $scope.NationalityIDTypeSearch.NATIONALITY_NAME = NAT.NATIONAL_TYPE_NAME;
        $scope.NationalityIDTypeSearch.NATIONAL_TYPE_NAME = NAT.NATIONAL_TYPE_NAME;//
        $scope.NationalityIDTypeSearch.ACTIVE = NAT.ACTIVE == true ? 1 : 0;
        //$scope.NationalityIDTypeSearch.CUSTOMER_ID = NAT.CUSTOMER_ID;
        //$scope.NationalityIDTypeSearch.ENTITY_ID = NAT.ENTITY_ID;
        //$scope.GET_ENTITY_LIST();
        //$scope.ADMIN_GET_NATIONALITY();
    };
    $scope.DELETE_ADMIN_INS_UPD_NATIONALITY = function (NAT) {
        if (confirm('Are you sure?')) {
            var NatioModelObj = new Object();
            NatioModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
            NatioModelObj.NATIONALITY_ID_TYPES = NAT.NATIONALITY_ID_TYPES;
            NatioModelObj.NATIONALITY_ID = NAT.NATIONALITY_ID;
            NatioModelObj.NATIONALITY_NAME = NAT.NATIONAL_TYPE_NAME;
            NatioModelObj.ACTIVE = 2;
            NatioModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.ADMIN_API(NatioModelObj, 'ADMIN_INS_UPD_NATIONALITY_ID_TYPES').then(function (data) {
                $scope.$parent.ShowAlert("Success", "Inactive Successfully", 3000);
                $scope.RESET_NAT();
                $scope.ADMIN_GET_NATIONAL_ID_TYPE();
            });
        }
    };

    $scope.GET_ENTITY_LIST = function () {

        if ($scope.NationalityIDTypeSearch.CUSTOMER_ID != undefined || $scope.NationalityIDTypeSearch.CUSTOMER_ID != '' || $scope.NationalityIDTypeSearch.CUSTOMER_ID != null) {
            var CusModelObj = new Object();
            CusModelObj.CUSTOMER_ID = $scope.NationalityIDTypeSearch.CUSTOMER_ID;
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
        }
        else { $scope.ENTITY_LIST = []; }
    };
    $scope.ADMIN_GET_CUSTOMER = function () {
        var ContracrModelObj = new Object();
        ContracrModelObj.CUSTOMER_NAME = '';
        ContracrModelObj.CUSTOMER_CODE = '';
        ContracrModelObj.ACTIVE = 1;
        ContracrModelObj.PAGE_NO = 1;
        ContracrModelObj.PAGE_SIZE = 1000;//$scope.CustomerSearch.PAGE_SIZE;
        ContracrModelObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(ContracrModelObj, 'ADMIN_GET_CUSTOMER').then(function (data) {
            $scope.CUSTOMER_LIST = data.data.Table;
        });
    };
    //$scope.ADMIN_GET_CUSTOMER();
});
app.controller('EmergencyContactRelationshipController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.$parent.PAGE_HEADER = "Emergency Contact Relationship";
    $scope.$parent.urlpath = "EmergencyContactRelationship";
    $scope.GRP_ID = getUrlParameter('ID', $location.absUrl());
    $scope.EMERGENCY_CONTACT_LIST = [];
    $scope.CUSTOMER_LIST = [];
    $scope.ENTITY_LIST = [];
    $scope.ECRSearch = {
        EMERGENCY_CONTACT_RELATIONSHIP_ID: null,
        RELATIONSHIP_NAME: "",
        ACTIVE: -1,
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        CLICK_SEARCH: null,
        CUSTOMER_ID: null
    };
    $scope.RESET_REL = function () {
        $scope.ECRSearch = {
            EMERGENCY_CONTACT_RELATIONSHIP_ID: null,
            RELATIONSHIP_NAME: "",
            ACTIVE: -1,
            PAGE_NO: 1,
            PAGE_SIZE: 10,
            CUSTOMER_ID: null,
            CLICK_SEARCH: null
        };
        $scope.ECRForm.submitted = false;
        $scope.ENTITY_LIST = [];
        $scope.EMERGENCY_CONTACT_LIST = [];
        $scope.GET_EMERGENCY_CONTACT_RELATIONSHIP(2);
    };
    $scope.LAZY_GET_EMERGENCY_CONTACT_RELATIONSHIP = function () { $scope.GET_EMERGENCY_CONTACT_RELATIONSHIP(); };
    $scope.GET_EMERGENCY_CONTACT_RELATIONSHIP = function (FLAG) {
        document.getElementById("overlay_loading").style.display = "block";
        var CONModelObj = new Object();
        if (FLAG == 1) {
            $scope.ECRSearch.CLICK_SEARCH = 1;
            $scope.EMERGENCY_CONTACT_LIST = [];
            $scope.ECRSearch.PAGE_NO = 1;
            CONModelObj.ACTIVE = $scope.ECRSearch.ACTIVE == -1 ? -1 : $scope.ECRSearch.ACTIVE ? 1 : 0;
        }
        else if (FLAG == 2) {
            $scope.EMERGENCY_CONTACT_LIST = [];
            CONModelObj.ACTIVE = $scope.ECRSearch.ACTIVE == -1 ? -1 : $scope.ECRSearch.ACTIVE ? 1 : 0;
            $scope.ECRSearch.PAGE_NO = 1;
        }
        else if (FLAG == undefined) {
            if ($scope.ECRSearch.CLICK_SEARCH == 1)
                CONModelObj.ACTIVE = $scope.ECRSearch.ACTIVE == -1 ? -1 : $scope.ECRSearch.ACTIVE ? 1 : 0;
            else {
                CONModelObj.ACTIVE = -1;
            }
        }
        CONModelObj.CUSTOMER_ID = $scope.ECRSearch.CLICK_SEARCH == 1 ? $scope.ECRSearch.CUSTOMER_ID : null;//parseInt($cookies.get("CUSTOMER_ID"));
        CONModelObj.RELATIONSHIP_NAME = $scope.ECRSearch.CLICK_SEARCH == 1 ? $scope.ECRSearch.RELATIONSHIP_NAME : '';
        //CONModelObj.ACTIVE = -1;
        CONModelObj.PAGE_NO = $scope.ECRSearch.PAGE_NO;
        CONModelObj.PAGE_SIZE = $scope.ECRSearch.PAGE_SIZE;
        CONModelObj.USER_ID = parseInt($cookies.get("USERID"));
        CONModelObj.ENTITY_ID = 0;//$scope.ECRSearch.ENTITY_ID;
        PrcCommMethods.ADMIN_API(CONModelObj, 'ADMIN_GET_EMERGENCY_CONTACT_RELATIONSHIP').then(function (data) {
            //$scope.EMERGENCY_CONTACT_LIST = data.data.Table;
            if (data.data.Table.length > 0) {
                $scope.EMERGENCY_CONTACT_LIST = $scope.EMERGENCY_CONTACT_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.ECRSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                    document.getElementById("overlay_loading").style.display = "none";
                }
                else {
                    $scope.ECRSearch.PAGE_NO = parseInt($scope.ECRSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                    document.getElementById("overlay_loading").style.display = "none";
                }
            }
            else {
                if ($scope.EMERGENCY_CONTACT_LIST.length == 0) {
                }
                $scope.GetData = false;
                document.getElementById("overlay_loading").style.display = "none";
            }
        });
    };
    $scope.GET_EMERGENCY_CONTACT_RELATIONSHIP();
    $scope.ADMIN_INS_UPD_EMERGENCY_CONTACT_RELATIONSHIP = function () {
        $scope.ECRForm.submitted = true;
        if ($scope.ECRForm.$valid) {
            if ($scope.ECRSearch.ACTIVE != -1) {
                document.getElementById("overlay_loading").style.display = "block";
                var NatioModelObj = new Object();
                NatioModelObj.CUSTOMER_ID = $scope.ECRSearch.CUSTOMER_ID;
                NatioModelObj.EMERGENCY_CONTACT_RELATIONSHIP_ID = $scope.ECRSearch.EMERGENCY_CONTACT_RELATIONSHIP_ID;
                NatioModelObj.RELATIONSHIP_NAME = $scope.ECRSearch.RELATIONSHIP_NAME;
                NatioModelObj.ACTIVE = $scope.ECRSearch.ACTIVE ? 1 : 0;
                NatioModelObj.USER_ID = parseInt($cookies.get("USERID"));
                NatioModelObj.COMMENTS = $scope.ECRSearch.COMMENTS;
                NatioModelObj.ENTITY_ID = null;//$scope.ECRSearch.ENTITY_ID;
                PrcCommMethods.ADMIN_API(NatioModelObj, 'ADMIN_INS_UPD_EMERGENCY_CONTACT_RELATIONSHIP').then(function (data) {
                    $scope.$parent.ShowAlert("Success", "Save Successfully", 3000);
                    $scope.RESET_REL();
                    document.getElementById("overlay_loading").style.display = "none";
                });
            }
            else { $scope.$parent.ShowAlert('Attention', 'Please Select Active/In-Active Option.', 3000); document.getElementById("overlay_loading").style.display = "none"; }
        }
    };
    $scope.EDIT_INS_UPD_EMERGENCY_CONTACT_RELATIONSHIP = function (NAT) {
        $scope.ECRSearch.EMERGENCY_CONTACT_RELATIONSHIP_ID = NAT.EMERGENCY_CONTACT_RELATIONSHIP_ID;
        $scope.ECRSearch.RELATIONSHIP_NAME = NAT.RELATIONSHIP_NAME;
        $scope.ECRSearch.ACTIVE = NAT.ACTIVE == true ? 1 : 0;
        $scope.ECRSearch.CUSTOMER_ID = NAT.CUSTOMER_ID;
        // $scope.ECRSearch.ENTITY_ID = NAT.ENTITY_ID;
        // $scope.GET_ENTITY_LIST();
    };
    $scope.DELETE_INS_UPD_EMERGENCY_CONTACT_RELATIONSHIP = function (NAT) {
        if (confirm('Are you sure?')) {
            var NatioModelObj = new Object();
            NatioModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
            NatioModelObj.EMERGENCY_CONTACT_RELATIONSHIP_ID = NAT.EMERGENCY_CONTACT_RELATIONSHIP_ID;
            NatioModelObj.ACTIVE = 2;
            NatioModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.ADMIN_API(NatioModelObj, 'ADMIN_INS_UPD_EMERGENCY_CONTACT_RELATIONSHIP').then(function (data) {
                $scope.$parent.ShowAlert("Success", "Inactive Successfully", 3000);
                $scope.RESET_REL();
                $scope.GET_EMERGENCY_CONTACT_RELATIONSHIP();
            });
        }
    };

    $scope.GET_ENTITY_LIST = function () {

        if ($scope.ECRSearch.CUSTOMER_ID != undefined && $scope.ECRSearch.CUSTOMER_ID != '' && $scope.ECRSearch.CUSTOMER_ID != null) {
            var CusModelObj = new Object();
            CusModelObj.CUSTOMER_ID = $scope.ECRSearch.CUSTOMER_ID;
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
        }
        else { $scope.ENTITY_LIST = []; }
    };
    $scope.ADMIN_GET_CUSTOMER = function () {
        var ECRModelObj = new Object();
        ECRModelObj.CUSTOMER_NAME = '';
        ECRModelObj.CUSTOMER_CODE = '';
        ECRModelObj.ACTIVE = 1;
        ECRModelObj.PAGE_NO = 1;
        ECRModelObj.PAGE_SIZE = 1000;//$scope.CustomerSearch.PAGE_SIZE;
        ECRModelObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(ECRModelObj, 'ADMIN_GET_CUSTOMER').then(function (data) {
            $scope.CUSTOMER_LIST = data.data.Table;
        });
    };
    $scope.ADMIN_GET_CUSTOMER();
});
app.controller('PayFrequencyController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.$parent.PAGE_HEADER = "Pay Frequency";
    $scope.GRP_ID = getUrlParameter('ID', $location.absUrl());
    $scope.PAY_FREQUENCY_LIST = [];
    $scope.PayFSearch = {
        PAY_FREQUENCY_ID: null,
        HOURLY_PAYMENT: "",
        PAY_FREQUENCY_NAME: "",
        ACTIVE: 1,
        PAGE_NO: 1,
        PAGE_SIZE: 10
    };
    $scope.RESET_PAY = function () {
        $scope.PayFSearch = {
            PAY_FREQUENCY_ID: null,
            HOURLY_PAYMENT: "",
            PAY_FREQUENCY_NAME: "",
            ACTIVE: 1,
            PAGE_NO: 1,
            PAGE_SIZE: 10
        };
        $scope.PAYForm.submitted = false;
    };
    $scope.ADMIN_GET_PAY_FREQUENCY = function () {
        var CONModelObj = new Object();
        CONModelObj.PAY_FREQUENCY_NAME = $scope.PayFSearch.PAY_FREQUENCY_NAME;
        CONModelObj.ACTIVE = -1;
        CONModelObj.PAGE_NO = $scope.PayFSearch.PAGE_NO;
        CONModelObj.PAGE_SIZE = $scope.PayFSearch.PAGE_SIZE;
        PrcCommMethods.ADMIN_API(CONModelObj, 'ADMIN_GET_PAY_FREQUENCY').then(function (data) {
            $scope.PAY_FREQUENCY_LIST = data.data.Table;
        });
    };
    $scope.ADMIN_GET_PAY_FREQUENCY();
    $scope.ADMIN_INS_UPD_PAY_FREQUENCY = function () {
        $scope.PAYForm.submitted = true;
        if ($scope.PAYForm.$valid) {
            var NatioModelObj = new Object();
            //NatioModelObj.CUSTOMER_ID = $scope.PayFSearch.CUSTOMER_ID;
            NatioModelObj.PAY_FREQUENCY_ID = $scope.PayFSearch.PAY_FREQUENCY_ID;
            //NatioModelObj.HOURLY_PAYMENT = $scope.PayFSearch.HOURLY_PAYMENT;
            NatioModelObj.PAY_FREQUENCY_NAME = $scope.PayFSearch.PAY_FREQUENCY_NAME;
            NatioModelObj.ACTIVE = $scope.PayFSearch.ACTIVE ? 1 : 0;
            NatioModelObj.USER_ID = parseInt($cookies.get("USERID"));
            NatioModelObj.ENTITY_ID = $scope.PayFSearch.ENTITY_ID;
            PrcCommMethods.ADMIN_API(NatioModelObj, 'ADMIN_INS_UPD_PAY_FREQUENCY').then(function (data) {
                $scope.$parent.ShowAlert("Success", "Save Successfully", 3000);
                $scope.RESET_PAY();
                $scope.ADMIN_GET_PAY_FREQUENCY();
            });
        }
    };
    $scope.EDIT_INS_UPD_PAY_FREQUENCY = function (NAT) {
        $scope.PayFSearch.CUSTOMER_ID = NAT.CUSTOMER_ID;
        $scope.PayFSearch.ENTITY_ID = NAT.ENTITY_ID;
        $scope.PayFSearch.PAY_FREQUENCY_ID = NAT.PAY_FREQUENCY_ID;
        $scope.PayFSearch.PAY_FREQUENCY_NAME = NAT.PAY_FREQUENCY_NAME;
        $scope.PayFSearch.HOURLY_PAYMENT = NAT.HOURLY_PAYMENT;
        $scope.PayFSearch.ACTIVE = NAT.ACTIVE;
    };
    $scope.DELETE_INS_UPD_PAY_FREQUENCY = function (NAT) {
        if (confirm('Are you sure?')) {
            var NatioModelObj = new Object();
            NatioModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
            NatioModelObj.PAY_FREQUENCY_ID = NAT.PAY_FREQUENCY_ID;
            NatioModelObj.ACTIVE = 2;
            NatioModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.ADMIN_API(NatioModelObj, 'ADMIN_INS_UPD_PAY_FREQUENCY').then(function (data) {
                $scope.$parent.ShowAlert("Success", "Inactive Successfully", 3000);
                $scope.RESET_PAY();
                $scope.ADMIN_GET_PAY_FREQUENCY();
            });
        }
    };
    $scope.GET_ENTITY_LIST = function () {
        if ($scope.PayFSearch.CUSTOMER_ID != undefined) {
            var CusModelObj = new Object();
            CusModelObj.CUSTOMER_ID = $scope.PayFSearch.CUSTOMER_ID;
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
        }
        else { $scope.ENTITY_LIST = []; }
    };
    $scope.ADMIN_GET_CUSTOMER = function () {
        var AbsModelObj = new Object();
        AbsModelObj.CUSTOMER_NAME = '';
        AbsModelObj.CUSTOMER_CODE = '';
        AbsModelObj.ACTIVE = 1;
        AbsModelObj.PAGE_NO = 1;
        AbsModelObj.PAGE_SIZE = 1000;//$scope.CustomerSearch.PAGE_SIZE;
        AbsModelObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(AbsModelObj, 'ADMIN_GET_CUSTOMER').then(function (data) {
            $scope.CUSTOMER_LIST = data.data.Table;
        });
    };
    $scope.ADMIN_GET_CUSTOMER();
});
app.controller('PaidByController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.$parent.PAGE_HEADER = "Paid By";
    $scope.$parent.urlpath = "Paid_By";
    $scope.GRP_ID = getUrlParameter('ID', $location.absUrl());
    $scope.PAY_FREQUENCY_LIST = [];
    $scope.CUSTOMER_LIST = [];
    $scope.ENTITY_LIST = [];
    $scope.PAID_BY_LIST = [];
    $scope.PaidBySearch = {
        PAY_FREQUENCY_ID: null,
        HOURLY_PAYMENT: "",
        PAY_FREQUENCY_NAME: "",
        ACTIVE: -1,
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        CLICK_SEARCH: null, CUSTOMER_ID: null
    };
    $scope.RESET_PAD = function () {
        $scope.PaidBySearch = {
            PAY_FREQUENCY_ID: null,
            HOURLY_PAYMENT: "",
            PAY_FREQUENCY_NAME: "",
            ACTIVE: -1,
            PAGE_NO: 1,
            PAGE_SIZE: 10, CUSTOMER_ID: null,
            CLICK_SEARCH: null
        };
        $scope.PaidByForm.submitted = false;
        $scope.ENTITY_LIST = [];
        $scope.PAID_BY_LIST = [];
        $scope.ADMIN_GET_PAID_BY(2);
    };
    $scope.LAZY_ADMIN_GET_PAID_BY = function () { $scope.ADMIN_GET_PAID_BY(); };
    $scope.ADMIN_GET_PAID_BY = function (FLAG) {
        var PaidByModelObj = new Object();
        if (FLAG == 1) {
            $scope.PaidBySearch.CLICK_SEARCH = 1;
            $scope.PAID_BY_LIST = [];
            $scope.PaidBySearch.PAGE_NO = 1;
            PaidByModelObj.ACTIVE = $scope.PaidBySearch.ACTIVE == -1 ? -1 : $scope.PaidBySearch.ACTIVE ? 1 : 0;
        }
        else if (FLAG == 2) {
            $scope.PAID_BY_LIST = [];
            PaidByModelObj.ACTIVE = $scope.PaidBySearch.ACTIVE == -1 ? -1 : $scope.PaidBySearch.ACTIVE ? 1 : 0;
            $scope.PaidBySearch.PAGE_NO = 1;
        }
        else if (FLAG == undefined) {
            if ($scope.PaidBySearch.CLICK_SEARCH == 1)
                PaidByModelObj.ACTIVE = $scope.PaidBySearch.ACTIVE == -1 ? -1 : $scope.PaidBySearch.ACTIVE ? 1 : 0;
            else {
                PaidByModelObj.ACTIVE = -1;
            }
        }
        PaidByModelObj.CUSTOMER_ID = $scope.PaidBySearch.CLICK_SEARCH == 1 ? $scope.PaidBySearch.CUSTOMER_ID : null;
        PaidByModelObj.PAID_BY_ID = $scope.PaidBySearch.CLICK_SEARCH == 1 ? $scope.PaidBySearch.PAID_BY_ID : null;
        PaidByModelObj.PAID_BY_NAME = $scope.PaidBySearch.CLICK_SEARCH == 1 ? $scope.PaidBySearch.PAID_BY_NAME : '';
        //PaidByModelObj.ACTIVE = -1;
        PaidByModelObj.PAGE_NO = $scope.PaidBySearch.PAGE_NO;
        PaidByModelObj.PAGE_SIZE = $scope.PaidBySearch.PAGE_SIZE;
        PaidByModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PaidByModelObj.ENTITY_ID = $scope.PaidBySearch.ENTITY_ID;
        PrcCommMethods.ADMIN_API(PaidByModelObj, 'ADMIN_GET_PAID_BY').then(function (data) {

            if (data.data.Table.length > 0) {
                $scope.PAID_BY_LIST = $scope.PAID_BY_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.PaidBySearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.PaidBySearch.PAGE_NO = parseInt($scope.PaidBySearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else {
                if ($scope.PAID_BY_LIST.length == 0) {
                }
                $scope.GetData = false;
            }
        });
    };
    $scope.ADMIN_GET_PAID_BY();
    $scope.ADMIN_INS_UPD_PAID_BY = function () {
        $scope.PaidByForm.submitted = true;
        if ($scope.PaidByForm.$valid) {
            if ($scope.PaidBySearch.ACTIVE != -1) {
                var PaidByModelObj = new Object();
                PaidByModelObj.CUSTOMER_ID = $scope.PaidBySearch.CUSTOMER_ID;
                PaidByModelObj.PAID_BY_ID = $scope.PaidBySearch.PAID_BY_ID;
                PaidByModelObj.PAID_BY_NAME = $scope.PaidBySearch.PAID_BY_NAME;
                PaidByModelObj.ACTIVE = $scope.PaidBySearch.ACTIVE ? 1 : 0;
                PaidByModelObj.USER_ID = parseInt($cookies.get("USERID"));
                PaidByModelObj.ENTITY_ID = $scope.PaidBySearch.ENTITY_ID;
                PrcCommMethods.ADMIN_API(PaidByModelObj, 'ADMIN_INS_UPD_PAID_BY').then(function (data) {
                    $scope.$parent.ShowAlert("Success", "Save Successfully", 3000);
                    $scope.RESET_PAD();
                });
            }
            else { $scope.$parent.ShowAlert('Attention', 'Please Select Active/In-Active Option.', 3000); $scope.PaidByForm.submitted = false; }
        }
    };
    $scope.EDIT_INS_UPD_PAID_BY = function (NAT) {
        $scope.PaidBySearch.PAID_BY_ID = NAT.PAID_BY_ID;
        $scope.PaidBySearch.PAID_BY_NAME = NAT.PAID_BY_NAME;
        $scope.PaidBySearch.ACTIVE = NAT.ACTIVE == true ? 1 : 0;
        $scope.PaidBySearch.CUSTOMER_ID = NAT.CUSTOMER_ID;
        $scope.PaidBySearch.ENTITY_ID = NAT.ENTITY_ID;
        $scope.GET_ENTITY_LIST();
    };
    $scope.DELETE_INS_UPD_PAID_BY = function (NAT) {
        if (confirm('Are you sure?')) {
            var NatioModelObj = new Object();
            NatioModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
            NatioModelObj.PAID_BY_ID = NAT.PAID_BY_ID;
            NatioModelObj.ACTIVE = 2;
            NatioModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.ADMIN_API(NatioModelObj, 'ADMIN_INS_UPD_PAID_BY').then(function (data) {
                $scope.$parent.ShowAlert("Success", "Inactive Successfully", 3000);
                $scope.RESET_PAD();
                $scope.ADMIN_GET_PAID_BY();
            });
        }
    };

    $scope.GET_ENTITY_LIST = function () {

        if ($scope.PaidBySearch.CUSTOMER_ID != undefined && $scope.PaidBySearch.CUSTOMER_ID != '' && $scope.PaidBySearch.CUSTOMER_ID != null) {
            var CusModelObj = new Object();
            CusModelObj.CUSTOMER_ID = $scope.PaidBySearch.CUSTOMER_ID;
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
        }
        else { $scope.ENTITY_LIST = []; }
    };
    $scope.ADMIN_GET_CUSTOMER = function () {
        var PaidModelObj = new Object();
        PaidModelObj.CUSTOMER_NAME = '';
        PaidModelObj.CUSTOMER_CODE = '';
        PaidModelObj.ACTIVE = 1;
        PaidModelObj.PAGE_NO = 1;
        PaidModelObj.PAGE_SIZE = 1000;//$scope.CustomerSearch.PAGE_SIZE;
        PaidModelObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(PaidModelObj, 'ADMIN_GET_CUSTOMER').then(function (data) {
            $scope.CUSTOMER_LIST = data.data.Table;
        });
    };
    //$scope.ADMIN_GET_CUSTOMER();
});
app.controller('PayCodeController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.$parent.PAGE_HEADER = "Pay Code";
    $scope.$parent.urlpath = "Pay_Code";
    $scope.GRP_ID = getUrlParameter('ID', $location.absUrl());
    $scope.PAY_CODE_LIST = [];
    $scope.PaidCdSearch = {
        PAY_CODE_ID: null,
        HOURLY_PAYMENT: "",
        PAY_CODE_NAME: "",
        ACTIVE: -1,
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        PAY_CODE_ID: null,
        PAY_CODE_NAME: '', COMMENTS: '',
        CLICK_SEARCH: null
    };
    $scope.RESET_PCDE = function () {
        $scope.PaidCdSearch = {
            PAY_CODE_ID: null,
            HOURLY_PAYMENT: "",
            PAY_CODE_NAME: "",
            ACTIVE: -1,
            PAGE_NO: 1,
            PAGE_SIZE: 10, CUSTOMER_ID: null,
            PAY_CODE_ID: null,
            PAY_CODE_NAME: '', COMMENTS: '',
            CLICK_SEARCH: null
        };
        $scope.PaidCodeForm.submitted = false;
        $scope.ENTITY_LIST = [];
        $scope.PAY_CODE_LIST = [];
        $scope.ADMIN_GET_PAY_CODE(2);
    };
    $scope.ADMIN_GET_PAY_CODE = function (FLAG) {
        var CONModelObj = new Object();
        if (FLAG == 1) {
            $scope.PaidCdSearch.CLICK_SEARCH = 1;
            $scope.PAY_CODE_LIST = [];
            $scope.PaidCdSearch.PAGE_NO = 1;
            CONModelObj.ACTIVE = $scope.PaidCdSearch.ACTIVE == -1 ? -1 : $scope.PaidCdSearch.ACTIVE ? 1 : 0;
        }
        else if (FLAG == 2) {
            $scope.PAY_CODE_LIST = [];
            $scope.PaidCdSearch.PAGE_NO = 1;
            CONModelObj.ACTIVE = $scope.PaidCdSearch.ACTIVE == -1 ? -1 : $scope.PaidCdSearch.ACTIVE ? 1 : 0;
        }
        else if (FLAG == undefined) {
            if ($scope.PaidCdSearch.CLICK_SEARCH == 1)
                CONModelObj.ACTIVE = $scope.PaidCdSearch.ACTIVE == -1 ? -1 : $scope.PaidCdSearch.ACTIVE ? 1 : 0;
            else {
                CONModelObj.ACTIVE = -1;
            }
        }
        CONModelObj.CUSTOMER_ID = $scope.PaidCdSearch.CLICK_SEARCH == 1 ? $scope.PaidCdSearch.CUSTOMER_ID : null;
        CONModelObj.PAY_CODE_ID = $scope.PaidCdSearch.CLICK_SEARCH == 1 ? $scope.PaidCdSearch.PAY_CODE_ID : null;
        CONModelObj.PAY_CODE_NAME = $scope.PaidCdSearch.CLICK_SEARCH == 1 ? $scope.PaidCdSearch.PAY_CODE_NAME : '';
        //CONModelObj.ACTIVE = -1;
        CONModelObj.PAGE_NO = $scope.PaidCdSearch.PAGE_NO;
        CONModelObj.PAGE_SIZE = $scope.PaidCdSearch.PAGE_SIZE;
        CONModelObj.USER_ID = parseInt($cookies.get("USERID"));
        CONModelObj.ENTITY_ID = $scope.PaidCdSearch.CLICK_SEARCH == 1 ? $scope.PaidCdSearch.ENTITY_ID : null;
        PrcCommMethods.ADMIN_API(CONModelObj, 'ADMIN_GET_PAY_CODE').then(function (data) {
            //$scope.PAY_CODE_LIST = data.data.Table;
            if (data.data.Table.length > 0) {
                $scope.PAY_CODE_LIST = $scope.PAY_CODE_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.PaidCdSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.PaidCdSearch.PAGE_NO = parseInt($scope.PaidCdSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else
                $scope.GetData = false;
        });
    };
    $scope.ADMIN_GET_PAY_CODE();
    $scope.ADMIN_INS_UPD_PAY_CODE = function () {
        $scope.PaidCodeForm.submitted = true;
        if ($scope.PaidCodeForm.$valid) {
            if ($scope.PaidCdSearch.ACTIVE != -1) {
                var NatioModelObj = new Object();
                NatioModelObj.CUSTOMER_ID = $scope.PaidCdSearch.CUSTOMER_ID;
                NatioModelObj.ENTITY_ID = $scope.PaidCdSearch.ENTITY_ID;
                NatioModelObj.PAY_CODE_ID = $scope.PaidCdSearch.PAY_CODE_ID;
                NatioModelObj.PAY_CODE_NAME = $scope.PaidCdSearch.PAY_CODE_NAME;
                NatioModelObj.ACTIVE = $scope.PaidCdSearch.ACTIVE ? 1 : 0;
                NatioModelObj.USER_ID = parseInt($cookies.get("USERID"));
                NatioModelObj.COMMENTS = $scope.PaidCdSearch.COMMENTS;
                NatioModelObj.PAY_CODE_DESCRIPTION = $scope.PaidCdSearch.PAY_CODE_DESCRIPTION;

                PrcCommMethods.ADMIN_API(NatioModelObj, 'ADMIN_INS_UPD_PAY_CODE').then(function (data) {
                    $scope.$parent.ShowAlert("Success", "Save Successfully", 3000);
                    $scope.RESET_PCDE();
                });
            }
            else { $scope.$parent.ShowAlert('Attention', 'Please Select Active/In-Active Option.', 3000); $scope.PaidCodeForm.submitted = false; }
        }
    };
    $scope.EDIT_INS_UPD_PAY_CODE = function (NAT) {
        $scope.PaidCdSearch.PAY_CODE_ID = NAT.PAY_CODE_ID;
        $scope.PaidCdSearch.PAY_CODE_NAME = NAT.PAY_CODE_NAME;
        $scope.PaidCdSearch.ACTIVE = NAT.ACTIVE == true ? 1 : 0;
        $scope.PaidCdSearch.CUSTOMER_ID = NAT.CUSTOMER_ID
        $scope.PaidCdSearch.ENTITY_ID = NAT.ENTITY_ID;
        $scope.PaidCdSearch.PAY_CODE_DESCRIPTION = NAT.PAY_CODE_DESCRIPTION;
        $scope.GET_ENTITY_LIST();
    };
    $scope.DELETE_INS_UPD_PAY_CODE = function (NAT) {
        if (confirm('Are you sure?')) {
            var NatioModelObj = new Object();
            NatioModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
            NatioModelObj.PAY_CODE_ID = NAT.PAY_CODE_ID;
            NatioModelObj.ACTIVE = 2;
            NatioModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.ADMIN_API(NatioModelObj, 'ADMIN_INS_UPD_PAY_CODE').then(function (data) {
                $scope.$parent.ShowAlert("Success", "Inactive Successfully", 3000);
                $scope.RESET_PCDE();
                $scope.ADMIN_GET_PAY_CODE();
            });
        }
    };
    $scope.GET_ENTITY_LIST = function () {
        if ($scope.PaidCdSearch.CUSTOMER_ID != undefined && $scope.PaidCdSearch.CUSTOMER_ID != '' && $scope.PaidCdSearch.CUSTOMER_ID != null) {
            var CusModelObj = new Object();
            CusModelObj.CUSTOMER_ID = $scope.PaidCdSearch.CUSTOMER_ID;
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
        }
        else { $scope.ENTITY_LIST = []; }
    };
    $scope.ADMIN_GET_CUSTOMER = function () {
        var PayMtModelObj = new Object();
        PayMtModelObj.CUSTOMER_NAME = '';
        PayMtModelObj.CUSTOMER_CODE = '';
        PayMtModelObj.ACTIVE = 1;
        PayMtModelObj.PAGE_NO = 1;
        PayMtModelObj.PAGE_SIZE = 1000;//$scope.CustomerSearch.PAGE_SIZE;
        PayMtModelObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(PayMtModelObj, 'ADMIN_GET_CUSTOMER').then(function (data) {
            $scope.CUSTOMER_LIST = data.data.Table;
        });
    };
    $scope.ADMIN_GET_CUSTOMER();
    $scope.LAZY_ADMIN_GET_PAY_CODE = function () { $scope.ADMIN_GET_PAY_CODE(); };
});
app.controller('PaymentTypeController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.$parent.PAGE_HEADER = "Payment Type";
    $scope.$parent.urlpath = "Payment_Type";
    $scope.GRP_ID = getUrlParameter('ID', $location.absUrl());
    $scope.PAYMENT_TYPE_LIST = [];
    $scope.CUSTOMER_LIST = [];
    $scope.ENTITY_LIST = [];
    $scope.PayMtSearch = {
        PAYMENT_TYPE_ID: null,
        PAYMENT_TYPE_NAME: "",
        ACTIVE: -1,
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        CLICK_SEARCH: 0
    };
    $scope.RESET_PMTE = function () {
        $scope.PayMtSearch = {
            PAYMENT_TYPE_ID: null,
            PAYMENT_TYPE_NAME: "",
            ACTIVE: -1,
            PAGE_NO: 1,
            PAGE_SIZE: 10,
            CLICK_SEARCH: 0
        };
        $scope.PayMtForm.submitted = false;
        $scope.ENTITY_LIST = [];
        $scope.PAYMENT_TYPE_LIST = [];
        $scope.ADMIN_GET_PAYMENT_TYPE(2);
    };
    $scope.LAZY_ADMIN_GET_PAYMENT_TYPE = function () { $scope.ADMIN_GET_PAYMENT_TYPE(); };
    $scope.ADMIN_GET_PAYMENT_TYPE = function (FLAG) {
        var CONModelObj = new Object();
        if (FLAG == 1) {
            $scope.PayMtSearch.CLICK_SEARCH = 1;
            $scope.PAYMENT_TYPE_LIST = [];
            $scope.PayMtSearch.PAGE_NO = 1;
            //CONModelObj.ACTIVE = $scope.PayMtSearch.ACTIVE ? 1 : 0;
            CONModelObj.ACTIVE = $scope.PayMtSearch.ACTIVE == -1 ? -1 : $scope.PayMtSearch.ACTIVE ? 1 : 0;
        }
        else if (FLAG == 2) {
            $scope.PAYMENT_TYPE_LIST = [];
            CONModelObj.ACTIVE = $scope.PayMtSearch.ACTIVE == -1 ? -1 : $scope.PayMtSearch.ACTIVE ? 1 : 0;
            $scope.PayMtSearch.PAGE_NO = 1;
        }
        else if (FLAG == undefined) {
            if ($scope.PayMtSearch.CLICK_SEARCH == 1)
                CONModelObj.ACTIVE = $scope.PayMtSearch.ACTIVE == -1 ? -1 : $scope.PayMtSearch.ACTIVE ? 1 : 0;
            else {
                CONModelObj.ACTIVE = -1;
            }
        }
        CONModelObj.CUSTOMER_ID = $scope.PayMtSearch.CLICK_SEARCH == 1 ? $scope.PayMtSearch.CUSTOMER_ID : null;
        CONModelObj.PAYMENT_TYPE_ID = $scope.PayMtSearch.CLICK_SEARCH == 1 ? $scope.PayMtSearch.PAYMENT_TYPE_ID : null;
        CONModelObj.PAYMENT_TYPE_NAME = $scope.PayMtSearch.CLICK_SEARCH == 1 ? $scope.PayMtSearch.PAYMENT_TYPE_NAME : '';
        //CONModelObj.ACTIVE = -1;
        CONModelObj.PAGE_NO = $scope.PayMtSearch.PAGE_NO;
        CONModelObj.PAGE_SIZE = $scope.PayMtSearch.PAGE_SIZE;
        CONModelObj.USER_ID = parseInt($cookies.get("USERID"));
        CONModelObj.ENTITY_ID = $scope.PayMtSearch.CLICK_SEARCH == 1 ? $scope.PayMtSearch.ENTITY_ID : null;
        PrcCommMethods.ADMIN_API(CONModelObj, 'ADMIN_GET_PAYMENT_TYPE').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.PAYMENT_TYPE_LIST = $scope.PAYMENT_TYPE_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.PayMtSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.PayMtSearch.PAGE_NO = parseInt($scope.PayMtSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else {
                if ($scope.PAYMENT_TYPE_LIST.length == 0) {
                    $scope.PAYMENT_TYPE_LIST = [];
                }
                $scope.GetData = false;
            }
        });
    };
    $scope.ADMIN_GET_PAYMENT_TYPE();
    $scope.ADMIN_INS_UPD_PAYMENT_TYPE = function () {
        $scope.PayMtForm.submitted = true;
        if ($scope.PayMtForm.$valid) {
            if ($scope.PayMtSearch.ACTIVE != -1) {
                var NatioModelObj = new Object();
                NatioModelObj.CUSTOMER_ID = $scope.PayMtSearch.CUSTOMER_ID;
                NatioModelObj.PAYMENT_TYPE_ID = $scope.PayMtSearch.PAYMENT_TYPE_ID;
                NatioModelObj.PAYMENT_TYPE_NAME = $scope.PayMtSearch.PAYMENT_TYPE_NAME;
                NatioModelObj.ACTIVE = $scope.PayMtSearch.ACTIVE ? 1 : 0;
                NatioModelObj.USER_ID = parseInt($cookies.get("USERID"));
                NatioModelObj.COMMENTS = $scope.PayMtSearch.COMMENTS;
                NatioModelObj.ENTITY_ID = $scope.PayMtSearch.ENTITY_ID;
                PrcCommMethods.ADMIN_API(NatioModelObj, 'ADMIN_INS_UPD_PAYMENT_TYPE').then(function (data) {
                    $scope.$parent.ShowAlert("Success", "Save Successfully", 3000);
                    $scope.RESET_PMTE(1);
                });
            }
            else { $scope.$parent.ShowAlert('Attention', 'Please Select Active/In-Active Option.', 3000); $scope.PayMtForm.submitted = false; }
        }
    };
    $scope.EDIT_INS_UPD_PAYMENT_TYPE = function (NAT) {
        $scope.PayMtSearch.PAYMENT_TYPE_ID = NAT.PAYMENT_TYPE_ID;
        $scope.PayMtSearch.PAYMENT_TYPE_NAME = NAT.PAYMENT_TYPE_NAME;
        $scope.PayMtSearch.ACTIVE = NAT.ACTIVE == true ? 1 : 0;
        $scope.PayMtSearch.CUSTOMER_ID = NAT.CUSTOMER_ID;
        $scope.PayMtSearch.ENTITY_ID = NAT.ENTITY_ID;
        $scope.GET_ENTITY_LIST();
    };
    $scope.DELETE_INS_UPD_PAYMENT_TYPE = function (NAT) {
        if (confirm('Are you sure?')) {
            var NatioModelObj = new Object();
            NatioModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
            NatioModelObj.PAYMENT_TYPE_ID = NAT.PAYMENT_TYPE_ID;
            NatioModelObj.ACTIVE = 2;
            NatioModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.ADMIN_API(NatioModelObj, 'ADMIN_INS_UPD_PAYMENT_TYPE').then(function (data) {
                $scope.$parent.ShowAlert("Success", "Inactive Successfully", 3000);
                $scope.RESET_PMTE();
                $scope.ADMIN_GET_PAYMENT_TYPE();
            });
        }
    };

    $scope.GET_ENTITY_LIST = function () {

        if ($scope.PayMtSearch.CUSTOMER_ID != undefined && $scope.PayMtSearch.CUSTOMER_ID != '' && $scope.PayMtSearch.CUSTOMER_ID != null) {
            var CusModelObj = new Object();
            CusModelObj.CUSTOMER_ID = $scope.PayMtSearch.CUSTOMER_ID;
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
        }
        else { $scope.ENTITY_LIST = []; }
    };
    $scope.ADMIN_GET_CUSTOMER = function () {
        var PayMtModelObj = new Object();
        PayMtModelObj.CUSTOMER_NAME = '';
        PayMtModelObj.CUSTOMER_CODE = '';
        PayMtModelObj.ACTIVE = 1;
        PayMtModelObj.PAGE_NO = 1;
        PayMtModelObj.PAGE_SIZE = 1000;//$scope.CustomerSearch.PAGE_SIZE;
        PayMtModelObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(PayMtModelObj, 'ADMIN_GET_CUSTOMER').then(function (data) {
            $scope.CUSTOMER_LIST = data.data.Table;
        });
    };
    $scope.ADMIN_GET_CUSTOMER();
});
app.controller('AbsenceTypeController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.$parent.PAGE_HEADER = "Absence Type";
    $scope.$parent.urlpath = "Absence_Type";
    $scope.GRP_ID = getUrlParameter('ID', $location.absUrl());
    $scope.ABSENCE_TYPE_LIST = [];
    $scope.CUSTOMER_LIST = [];
    $scope.ENTITY_LIST = [];
    $scope.AbsenceTypeSearch = {
        ABSENCE_TYPE_ID: null,
        ABSENCE_TYPE_NAME: "",
        ACTIVE: -1,
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        CUSTOMER_ID: null,
        MANAGER: 0,
        EMPLOYEE: 0,
        CLICK_SEARCH: null
    };
    $scope.RESET_ABTYPE = function () {
        $scope.AbsenceTypeSearch = {
            ABSENCE_TYPE_ID: null,
            ABSENCE_TYPE_NAME: "",
            ACTIVE: -1,
            PAGE_NO: 1,
            PAGE_SIZE: 10,
            MANAGER: 0,
            EMPLOYEE: 0,
            CLICK_SEARCH: null
        };
        $scope.AbTypeForm.submitted = false;
        $scope.ENTITY_LIST = [];
        document.getElementById('ABSENCE_COLOR_CODE').children[1].children[0].children[0].style.backgroundColor = 'rgb(0,0,0)';
        $scope.ABSENCE_TYPE_LIST = [];
        $scope.ADMIN_GET_ABSENCE_TYPE(2);
    };
    $scope.LAZY_ADMIN_GET_ABSENCE_TYPE = function () {
        $scope.ADMIN_GET_ABSENCE_TYPE();
    };
    $scope.ADMIN_GET_ABSENCE_TYPE = function (FLAG) {
        var CONModelObj = new Object();
        if (FLAG == 1) {
            $scope.AbsenceTypeSearch.CLICK_SEARCH = 1;
            $scope.ABSENCE_TYPE_LIST = [];
            $scope.AbsenceTypeSearch.PAGE_NO = 1;
            //CONModelObj.ACTIVE = $scope.AbsenceTypeSearch.ACTIVE ? 1 : 0;
            CONModelObj.ACTIVE = $scope.AbsenceTypeSearch.ACTIVE == -1 ? -1 : $scope.AbsenceTypeSearch.ACTIVE ? 1 : 0;
        }
        else if (FLAG == 2) {
            $scope.ABSENCE_TYPE_LIST = [];
            //CONModelObj.ACTIVE = -1;
            CONModelObj.ACTIVE = $scope.AbsenceTypeSearch.ACTIVE == -1 ? -1 : $scope.AbsenceTypeSearch.ACTIVE ? 1 : 0;
            $scope.AbsenceTypeSearch.PAGE_NO = 1;
        }
        else if (FLAG == undefined) {
            if ($scope.AbsenceTypeSearch.CLICK_SEARCH == 1)
                //CONModelObj.ACTIVE = $scope.AbsenceTypeSearch.ACTIVE ? 1 : 0;
                CONModelObj.ACTIVE = $scope.AbsenceTypeSearch.ACTIVE == -1 ? -1 : $scope.AbsenceTypeSearch.ACTIVE ? 1 : 0;
            else {
                CONModelObj.ACTIVE = -1;
            }
        }
        //CONModelObj.CUSTOMER_ID = $scope.AbsenceTypeSearch.CUSTOMER_ID;
        CONModelObj.ABSENCE_TYPE_ID = $scope.AbsenceTypeSearch.CLICK_SEARCH == 1 ? $scope.AbsenceTypeSearch.ABSENCE_TYPE_ID : null;
        CONModelObj.ABSENCE_TYPE_NAME = $scope.AbsenceTypeSearch.CLICK_SEARCH == 1 ? $scope.AbsenceTypeSearch.ABSENCE_TYPE_NAME : '';
        //CONModelObj.ACTIVE = -1;
        CONModelObj.PAGE_NO = $scope.AbsenceTypeSearch.PAGE_NO;
        CONModelObj.PAGE_SIZE = $scope.AbsenceTypeSearch.PAGE_SIZE;
        CONModelObj.USER_ID = parseInt($cookies.get("USERID"));
        //CONModelObj.ENTITY_ID = $scope.AbsenceTypeSearch.ENTITY_ID;
        CONModelObj.MANAGER = $scope.AbsenceTypeSearch.MANAGER ? 1 : 0;
        CONModelObj.EMPLOYEE = $scope.AbsenceTypeSearch.EMPLOYEE ? 1 : 0;
        PrcCommMethods.ADMIN_API(CONModelObj, 'ADMIN_GET_ABSENCE_TYPE').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.ABSENCE_TYPE_LIST = $scope.ABSENCE_TYPE_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.AbsenceTypeSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.AbsenceTypeSearch.PAGE_NO = parseInt($scope.AbsenceTypeSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else {
                $scope.GetData = false;
            }
        });
    };
    $scope.ADMIN_GET_ABSENCE_TYPE();
    $scope.ADMIN_INS_UPD_ABSENCE_TYPE = function () {
        $scope.AbTypeForm.submitted = true;
        if ($scope.AbTypeForm.$valid) {
            if ($scope.AbsenceTypeSearch.ACTIVE != -1) {
                var AbsModelObj = new Object();
                //AbsModelObj.CUSTOMER_ID = $scope.AbsenceTypeSearch.CUSTOMER_ID;
                AbsModelObj.ABSENCE_TYPE_ID = $scope.AbsenceTypeSearch.ABSENCE_TYPE_ID;
                AbsModelObj.ABSENCE_TYPE_NAME = $scope.AbsenceTypeSearch.ABSENCE_TYPE_NAME;
                AbsModelObj.ABSENCE_COLOR_CODE = document.getElementById('ABS_COLOR').value;//$scope.AbsenceTypeSearch.ABSENCE_COLOR_CODE;
                AbsModelObj.ACTIVE = $scope.AbsenceTypeSearch.ACTIVE ? 1 : 0;
                AbsModelObj.USER_ID = parseInt($cookies.get("USERID"));
                AbsModelObj.COMMENTS = $scope.AbsenceTypeSearch.COMMENTS;
                //AbsModelObj.ENTITY_ID = $scope.AbsenceTypeSearch.ENTITY_ID;
                AbsModelObj.ABSENCE_CODE = $scope.AbsenceTypeSearch.ABSENCE_CODE;
                AbsModelObj.ABSENCE_DESCRIPTION = $scope.AbsenceTypeSearch.ABSENCE_DESCRIPTION;
                AbsModelObj.MANAGER = $scope.AbsenceTypeSearch.MANAGER ? 1 : 0;
                AbsModelObj.EMPLOYEE = $scope.AbsenceTypeSearch.EMPLOYEE ? 1 : 0;
                AbsModelObj.ENTITLEMENT_REQUIRED = $scope.AbsenceTypeSearch.ENTITLEMENT_REQUIRED ? 1 : 0;
                PrcCommMethods.ADMIN_API(AbsModelObj, 'ADMIN_INS_UPD_ABSENCE_TYPE').then(function (data) {
                    $scope.$parent.ShowAlert("Success", "Save Successfully", 3000);
                    $scope.RESET_ABTYPE();
                    document.getElementById('ABS_COLOR').value = '000000';
                });
            }
            else { $scope.$parent.ShowAlert('Attention', 'Please Select Active/In-Active Option.', 3000); }
        }
    };
    $scope.EDIT_INS_UPD_ABSENCE_TYPE = function (NAT) {
        $scope.AbsenceTypeSearch.ABSENCE_TYPE_ID = NAT.ABSENCE_TYPE_ID;
        $scope.AbsenceTypeSearch.ABSENCE_TYPE_NAME = NAT.ABSENCE_TYPE_NAME;
        $scope.AbsenceTypeSearch.ACTIVE = NAT.ACTIVE ? 1 : 0;
        $scope.AbsenceTypeSearch.CUSTOMER_ID = NAT.CUSTOMER_ID;
        document.getElementById('ABS_COLOR').value = NAT.ABSENCE_COLOR_CODE;
        $scope.AbsenceTypeSearch.ENTITY_ID = NAT.ENTITY_ID;
        $scope.AbsenceTypeSearch.ABSENCE_CODE = NAT.ABSENCE_CODE;
        $scope.AbsenceTypeSearch.ABSENCE_DESCRIPTION = NAT.ABSENCE_DESCRIPTION;
        $scope.AbsenceTypeSearch.MANAGER = NAT.MANAGER;
        $scope.AbsenceTypeSearch.EMPLOYEE = NAT.EMP;
        $scope.AbsenceTypeSearch.ENTITLEMENT_REQUIRED = NAT.ENTITLEMENT_REQUIRED;
        document.getElementsByClassName('color-preview current-color')[0].style.backgroundColor = '#' + NAT.ABSENCE_COLOR_CODE;
    };
    $scope.DELETE_INS_UPD_ABSENCE_TYPE = function (NAT) {
        if (confirm('Are you sure?')) {
            var NatioModelObj = new Object();
            NatioModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
            NatioModelObj.ABSENCE_TYPE_ID = NAT.ABSENCE_TYPE_ID;
            NatioModelObj.ACTIVE = 2;
            NatioModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.ADMIN_API(NatioModelObj, 'ADMIN_INS_UPD_ABSENCE_TYPE').then(function (data) {
                $scope.$parent.ShowAlert("Success", "Inactive Successfully", 3000);
                $scope.RESET_ABTYPE();
                $scope.ADMIN_GET_ABSENCE_TYPE();
            });
        }
    };
});
app.controller('UnitController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.$parent.PAGE_HEADER = "Unit";
    $scope.$parent.urlpath = "Units";
    $scope.GRP_ID = getUrlParameter('ID', $location.absUrl());
    $scope.UNIT_LIST = [];
    $scope.CUSTOMER_LIST = [];
    $scope.ENTITY_LIST = [];
    $scope.UnitSearch = {
        UNITS_ID: null,
        UNITS_NAME: "",
        ACTIVE: -1,
        PAGE_NO: 1,
        PAGE_SIZE: 10, CUSTOMER_ID: null,
        CLICK_SEARCH: null
    };
    $scope.RESET_UNIT = function () {
        $scope.UnitSearch = {
            UNITS_ID: null,
            UNITS_NAME: "",
            ACTIVE: -1,
            PAGE_NO: 1,
            PAGE_SIZE: 10, CUSTOMER_ID: null,
            CLICK_SEARCH: null
        }
        $scope.UnitForm.submitted = false; $scope.ENTITY_LIST = [];
        $scope.UNIT_LIST = [];
        $scope.ADMIN_GET_UNITS(2);
    };
    $scope.LAZY_ADMIN_GET_UNITS = function () { $scope.ADMIN_GET_UNITS(); };
    $scope.ADMIN_GET_UNITS = function (FLAG) {
        var CONModelObj = new Object();
        if (FLAG == 1) {
            $scope.UnitSearch.CLICK_SEARCH = 1;
            $scope.UNIT_LIST = [];
            $scope.UnitSearch.PAGE_NO = 1;
            CONModelObj.ACTIVE = $scope.UnitSearch.ACTIVE == -1 ? -1 : $scope.UnitSearch.ACTIVE ? 1 : 0;
        }
        else if (FLAG == 2) {
            $scope.UNIT_LIST = [];
            CONModelObj.ACTIVE = $scope.UnitSearch.ACTIVE == -1 ? -1 : $scope.UnitSearch.ACTIVE ? 1 : 0;
            $scope.UnitSearch.PAGE_NO = 1;
        }
        else if (FLAG == undefined) {
            if ($scope.UnitSearch.CLICK_SEARCH == 1)
                CONModelObj.ACTIVE = $scope.UnitSearch.ACTIVE == -1 ? -1 : $scope.UnitSearch.ACTIVE ? 1 : 0;
            else {
                CONModelObj.ACTIVE = -1;
            }
        }
        CONModelObj.CUSTOMER_ID = $scope.UnitSearch.CLICK_SEARCH == 1 ? $scope.UnitSearch.CUSTOMER_ID : null;
        CONModelObj.UNITS_ID = $scope.UnitSearch.CLICK_SEARCH == 1 ? $scope.UnitSearch.UNITS_ID : null;
        CONModelObj.UNITS_NAME = $scope.UnitSearch.CLICK_SEARCH == 1 ? $scope.UnitSearch.UNITS_NAME : '';
        //CONModelObj.ACTIVE = -1;
        CONModelObj.PAGE_NO = $scope.UnitSearch.PAGE_NO;
        CONModelObj.PAGE_SIZE = $scope.UnitSearch.PAGE_SIZE;
        CONModelObj.USER_ID = parseInt($cookies.get("USERID"));
        CONModelObj.ENTITY_ID = $scope.UnitSearch.CLICK_SEARCH == 1 ? $scope.UnitSearch.ENTITY_ID : null;
        PrcCommMethods.ADMIN_API(CONModelObj, 'ADMIN_GET_UNITS').then(function (data) {
            //$scope.UNIT_LIST = data.data.Table;
            if (data.data.Table.length > 0) {
                $scope.UNIT_LIST = $scope.UNIT_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.UnitSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.UnitSearch.PAGE_NO = parseInt($scope.UnitSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else {
                if ($scope.UNIT_LIST.length == 0) {
                    $scope.UNIT_LIST = [];
                }
                $scope.GetData = false;
            }
        });
    };
    $scope.ADMIN_GET_UNITS();
    $scope.ADMIN_INS_UPD_UNITS = function () {
        $scope.UnitForm.submitted = true;
        if ($scope.UnitForm.$valid) {
            if ($scope.UnitSearch.ACTIVE != -1) {
                var NatioModelObj = new Object();
                NatioModelObj.CUSTOMER_ID = $scope.UnitSearch.CUSTOMER_ID;
                NatioModelObj.UNITS_ID = $scope.UnitSearch.UNITS_ID;
                NatioModelObj.UNITS_NAME = $scope.UnitSearch.UNITS_NAME;
                NatioModelObj.ACTIVE = $scope.UnitSearch.ACTIVE ? 1 : 0;
                NatioModelObj.USER_ID = parseInt($cookies.get("USERID"));
                NatioModelObj.COMMENTS = $scope.UnitSearch.COMMENTS;
                NatioModelObj.ENTITY_ID = $scope.UnitSearch.ENTITY_ID;
                PrcCommMethods.ADMIN_API(NatioModelObj, 'ADMIN_INS_UPD_UNITS').then(function (data) {
                    $scope.$parent.ShowAlert("Success", "Save Successfully", 3000);
                    $scope.RESET_UNIT();
                });
            }
            else { $scope.$parent.ShowAlert('Attention', 'Please Select Active/In-Active Option.', 3000); $scope.UnitForm.submitted = false; }
        }
    };
    $scope.EDIT_INS_UPD_UNITS = function (NAT) {
        $scope.UnitSearch.UNITS_ID = NAT.UNITS_ID;
        $scope.UnitSearch.UNITS_NAME = NAT.UNITS_NAME;
        $scope.UnitSearch.ACTIVE = NAT.ACTIVE == true ? 1 : 0;;
        $scope.UnitSearch.CUSTOMER_ID = NAT.CUSTOMER_ID;
        $scope.UnitSearch.ENTITY_ID = NAT.ENTITY_ID;
        $scope.GET_ENTITY_LIST();
    };
    $scope.DELETE_INS_UPD_UNITS = function (NAT) {
        if (confirm('Are you sure?')) {
            var NatioModelObj = new Object();
            NatioModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
            NatioModelObj.UNITS_ID = NAT.UNITS_ID;
            NatioModelObj.ACTIVE = 2;
            NatioModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.ADMIN_API(NatioModelObj, 'ADMIN_INS_UPD_UNITS').then(function (data) {
                $scope.$parent.ShowAlert("Success", "Inactive Successfully", 3000);
                $scope.RESET_UNIT();
                $scope.ADMIN_GET_UNITS();
            });
        }
    };

    $scope.GET_ENTITY_LIST = function () {

        if ($scope.UnitSearch.CUSTOMER_ID != undefined && $scope.UnitSearch.CUSTOMER_ID != '' && $scope.UnitSearch.CUSTOMER_ID != null) {
            var CusModelObj = new Object();
            CusModelObj.CUSTOMER_ID = $scope.UnitSearch.CUSTOMER_ID;
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
        }
        else { $scope.ENTITY_LIST = []; }
    };
    $scope.ADMIN_GET_CUSTOMER = function () {
        var UnitModelObj = new Object();
        UnitModelObj.CUSTOMER_NAME = '';
        UnitModelObj.CUSTOMER_CODE = '';
        UnitModelObj.ACTIVE = 1;
        UnitModelObj.PAGE_NO = 1;
        UnitModelObj.PAGE_SIZE = 1000;//$scope.CustomerSearch.PAGE_SIZE;
        UnitModelObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(UnitModelObj, 'ADMIN_GET_CUSTOMER').then(function (data) {
            $scope.CUSTOMER_LIST = data.data.Table;
        });
    };
    $scope.ADMIN_GET_CUSTOMER();
});
app.controller('WorkTypeController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.$parent.PAGE_HEADER = "Work Permit Type";
    $scope.$parent.urlpath = "Work_Permit_Type";
    $scope.GRP_ID = getUrlParameter('ID', $location.absUrl());
    $scope.WORK_PERMIT_TYPE_LIST = [];
    $scope.CUSTOMER_LIST = [];
    $scope.ENTITY_LIST = [];
    $scope.WptSearch = {
        WORK_PERMIT_TYPE_ID: null,
        CUSTOMER_ID: "",
        ACTIVE: -1,
        PAGE_NO: 1,
        PAGE_SIZE: 10, CUSTOMER_ID: null, CLICK_SEARCH: null
    };
    $scope.RESET_WORK_PERMIT = function () {
        $scope.WptSearch = {
            WORK_PERMIT_TYPE_ID: null,
            WORK_PERMIT_TYPE_NAME: "",
            ACTIVE: -1,
            PAGE_NO: 1,
            PAGE_SIZE: 10, CLICK_SEARCH: null
        };
        $scope.WptForm.submitted = false;
        $scope.ENTITY_LIST = [];
        $scope.WORK_PERMIT_TYPE_LIST = [];
        $scope.ADMIN_GET_WORK_PERMIT_TYPE(2);
    };
    $scope.LAZY_ADMIN_GET_WORK_PERMIT_TYPE = function () { $scope.ADMIN_GET_WORK_PERMIT_TYPE(); };
    $scope.ADMIN_GET_WORK_PERMIT_TYPE = function (FLAG) {
        var CONModelObj = new Object();
        if (FLAG == 1) {
            $scope.WptSearch.CLICK_SEARCH = 1;
            $scope.WORK_PERMIT_TYPE_LIST = [];
            $scope.WptSearch.PAGE_NO = 1;
            CONModelObj.ACTIVE = $scope.WptSearch.ACTIVE == -1 ? -1 : $scope.WptSearch.ACTIVE ? 1 : 0;
        }
        else if (FLAG == 2) {
            $scope.WORK_PERMIT_TYPE_LIST = [];
            CONModelObj.ACTIVE = $scope.WptSearch.ACTIVE == -1 ? -1 : $scope.WptSearch.ACTIVE ? 1 : 0;
            $scope.WptSearch.PAGE_NO = 1;
        }
        else if (FLAG == undefined) {
            if ($scope.WptSearch.CLICK_SEARCH == 1)
                CONModelObj.ACTIVE = $scope.WptSearch.ACTIVE == -1 ? -1 : $scope.WptSearch.ACTIVE ? 1 : 0;
            else {
                CONModelObj.ACTIVE = -1;
            }
        }
        CONModelObj.CUSTOMER_ID = $scope.WptSearch.CLICK_SEARCH == 1 ? $scope.WptSearch.CUSTOMER_ID : null;
        CONModelObj.WORK_PERMIT_TYPE_ID = $scope.WptSearch.CLICK_SEARCH == 1 ? $scope.WptSearch.WORK_PERMIT_TYPE_ID : null;
        CONModelObj.WORK_PERMIT_NAME = $scope.WptSearch.CLICK_SEARCH == 1 ? $scope.WptSearch.WORK_PERMIT_TYPE_NAME : '';
        //CONModelObj.ACTIVE = -1;
        CONModelObj.PAGE_NO = $scope.WptSearch.PAGE_NO;
        CONModelObj.PAGE_SIZE = $scope.WptSearch.PAGE_SIZE;
        CONModelObj.USER_ID = parseInt($cookies.get("USERID"));
        CONModelObj.ENTITY_ID = $scope.WptSearch.CLICK_SEARCH == 1 ? $scope.WptSearch.ENTITY_ID : null;
        PrcCommMethods.ADMIN_API(CONModelObj, 'ADMIN_GET_WORK_PERMIT_TYPE').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.WORK_PERMIT_TYPE_LIST = $scope.WORK_PERMIT_TYPE_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.WptSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.WptSearch.PAGE_NO = parseInt($scope.WptSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else {
                if ($scope.WORK_PERMIT_TYPE_LIST.length == 0) {
                    $scope.WORK_PERMIT_TYPE_LIST = [];
                }
                $scope.GetData = false;
            }
        });
    };
    $scope.ADMIN_GET_WORK_PERMIT_TYPE();
    $scope.ADMIN_INS_UPD_WORK_PERMIT_TYPE = function () {
        $scope.WptForm.submitted = true;
        if ($scope.WptForm.$valid) {
            if ($scope.WptSearch.ACTIVE != -1) {
                var WorkPermintTypeModelObj = new Object();
                WorkPermintTypeModelObj.CUSTOMER_ID = $scope.WptSearch.CUSTOMER_ID;
                WorkPermintTypeModelObj.WORK_PERMIT_TYPE_ID = $scope.WptSearch.WORK_PERMIT_TYPE_ID;
                WorkPermintTypeModelObj.WORK_PERMIT_TYPE_NAME = $scope.WptSearch.WORK_PERMIT_TYPE_NAME;
                WorkPermintTypeModelObj.ACTIVE = $scope.WptSearch.ACTIVE ? 1 : 0;
                WorkPermintTypeModelObj.USER_ID = parseInt($cookies.get("USERID"));
                WorkPermintTypeModelObj.COMMENT = $scope.WptSearch.COMMENT;
                WorkPermintTypeModelObj.ENTITY_ID = $scope.WptSearch.ENTITY_ID;
                PrcCommMethods.ADMIN_API(WorkPermintTypeModelObj, 'ADMIN_INS_UPD_WORK_PERMIT_TYPE').then(function (data) {
                    $scope.$parent.ShowAlert("Success", "Save Successfully", 3000);
                    $scope.RESET_WORK_PERMIT();

                });
            }
            else { $scope.$parent.ShowAlert('Attention', 'Please Select Active/In-Active Option.', 3000); $scope.WptForm.submitted = false; }
        }
    };
    $scope.EDIT_INS_UPD_WORK_PERMIT_TYPE = function (WPT) {
        $scope.WptSearch.WORK_PERMIT_TYPE_ID = WPT.WORK_PERMIT_TYPE_ID;
        $scope.WptSearch.WORK_PERMIT_TYPE_NAME = WPT.WORK_PERMIT_TYPE_NAME;
        $scope.WptSearch.ACTIVE = WPT.ACTIVE == true ? 1 : 0;
        $scope.WptSearch.CUSTOMER_ID = WPT.CUSTOMER_ID;
        $scope.WptSearch.ENTITY_ID = WPT.ENTITY_ID;
        $scope.GET_ENTITY_LIST();
    };;
    $scope.DELETE_INS_UPD_WORK_PERMIT_TYPE = function (WPT) {
        if (confirm('Are you sure?')) {
            var WorkPermintTypeModelObj = new Object();
            WorkPermintTypeModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
            WorkPermintTypeModelObj.WORK_PERMIT_TYPE_ID = WPT.WORK_PERMIT_TYPE_ID;
            WorkPermintTypeModelObj.ACTIVE = 2;
            WorkPermintTypeModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.ADMIN_API(WorkPermintTypeModelObj, 'ADMIN_INS_UPD_WORK_PERMIT_TYPE').then(function (data) {
                $scope.$parent.ShowAlert("Success", "Inactive Successfully", 3000);
                $scope.RESET_WORK_PERMIT();
                $scope.ADMIN_GET_WORK_PERMIT_TYPE();
            });
        }
    };

    $scope.GET_ENTITY_LIST = function () {

        if ($scope.WptSearch.CUSTOMER_ID != undefined && $scope.WptSearch.CUSTOMER_ID != '' && $scope.WptSearch.CUSTOMER_ID != null) {
            var CusModelObj = new Object();
            CusModelObj.CUSTOMER_ID = $scope.WptSearch.CUSTOMER_ID;
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
        }
        else { $scope.ENTITY_LIST = []; }
    };
    $scope.ADMIN_GET_CUSTOMER = function () {
        var WptModelObj = new Object();
        WptModelObj.CUSTOMER_NAME = '';
        WptModelObj.CUSTOMER_CODE = '';
        WptModelObj.ACTIVE = 1;
        WptModelObj.PAGE_NO = 1;
        WptModelObj.PAGE_SIZE = 1000;//$scope.CustomerSearch.PAGE_SIZE;
        WptModelObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(WptModelObj, 'ADMIN_GET_CUSTOMER').then(function (data) {
            $scope.CUSTOMER_LIST = data.data.Table;
        });
    };
    $scope.ADMIN_GET_CUSTOMER();

});
app.controller('DocumentTypeController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.$parent.PAGE_HEADER = "Document Type";
    $scope.$parent.urlpath = "Document_Type";
    $scope.GRP_ID = getUrlParameter('ID', $location.absUrl());
    $scope.DOCUMENT_TYPE_LIST = [];
    $scope.CUSTOMER_LIST = [];
    $scope.ENTITY_LIST = [];
    $scope.DocSearch = {
        DOCUMENT_TYPE_ID: null,
        UNITS_NAME: "",
        ACTIVE: -1,
        PAGE_NO: 1,
        PAGE_SIZE: 10, CUSTOMER_ID: null,
        CLICK_SEARCH: null
    };
    $scope.RESET_DOC = function () {
        $scope.DocSearch = {
            DOCUMENT_TYPE_ID: null,
            UNITS_NAME: "",
            ACTIVE: -1,
            PAGE_NO: 1,
            PAGE_SIZE: 10, CUSTOMER_ID: null,
            CLICK_SEARCH: null
        };
        $scope.DocForm.submitted = false;
        $scope.ENTITY_LIST = [];
        $scope.DOCUMENT_TYPE_LIST = [];
        $scope.ADMIN_GET_DOCUMENT_TYPE(2);
    };
    $scope.LAZY_ADMIN_GET_DOCUMENT_TYPE = function () { $scope.ADMIN_GET_DOCUMENT_TYPE(); };
    $scope.ADMIN_GET_DOCUMENT_TYPE = function (FLAG) {
        var CONModelObj = new Object();
        if (FLAG == 1) {
            $scope.DocSearch.CLICK_SEARCH = 1;
            $scope.DOCUMENT_TYPE_LIST = [];
            $scope.DocSearch.PAGE_NO = 1;
            CONModelObj.ACTIVE = $scope.DocSearch.ACTIVE == -1 ? -1 : $scope.DocSearch.ACTIVE ? 1 : 0;
        }
        else if (FLAG == 2) {
            $scope.DOCUMENT_TYPE_LIST = [];
            CONModelObj.ACTIVE = $scope.DocSearch.ACTIVE == -1 ? -1 : $scope.DocSearch.ACTIVE ? 1 : 0;
            $scope.DocSearch.PAGE_NO = 1;
        }
        else if (FLAG == undefined) {
            if ($scope.DocSearch.CLICK_SEARCH == 1)
                CONModelObj.ACTIVE = $scope.DocSearch.ACTIVE == -1 ? -1 : $scope.DocSearch.ACTIVE ? 1 : 0;
            else {
                CONModelObj.ACTIVE = -1;
            }
        }
        CONModelObj.CUSTOMER_ID = $scope.DocSearch.CLICK_SEARCH == 1 ? $scope.DocSearch.CUSTOMER_ID : null;
        CONModelObj.DOCUMENT_TYPE_ID = $scope.DocSearch.CLICK_SEARCH == 1 ? $scope.DocSearch.DOCUMENT_TYPE_ID : null;
        CONModelObj.DOCUMENT_TYPE_NAME = $scope.DocSearch.CLICK_SEARCH == 1 ? $scope.DocSearch.DOCUMENT_TYPE_NAME : '';
        //CONModelObj.ACTIVE = -1;
        CONModelObj.PAGE_NO = $scope.DocSearch.PAGE_NO;
        CONModelObj.PAGE_SIZE = $scope.DocSearch.PAGE_SIZE;
        CONModelObj.USER_ID = parseInt($cookies.get("USERID"));
        CONModelObj.ENTITY_ID = $scope.DocSearch.CLICK_SEARCH == 1 ? $scope.DocSearch.ENTITY_ID : null;
        PrcCommMethods.ADMIN_API(CONModelObj, 'ADMIN_GET_DOCUMENT_TYPE').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.DOCUMENT_TYPE_LIST = $scope.DOCUMENT_TYPE_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.DocSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.DocSearch.PAGE_NO = parseInt($scope.DocSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else {
                if ($scope.DOCUMENT_TYPE_LIST.length == 0) {
                    $scope.DOCUMENT_TYPE_LIST = [];
                }
                $scope.GetData = false;
            }
        });
    };
    $scope.ADMIN_GET_DOCUMENT_TYPE();
    $scope.ADMIN_INS_UPD_DOCUMENT_TYPE = function () {
        $scope.DocForm.submitted = true;
        if ($scope.DocForm.$valid) {
            if ($scope.DocSearch.ACTIVE != -1) {
                var DocModelObj = new Object();
                DocModelObj.CUSTOMER_ID = $scope.DocSearch.CUSTOMER_ID;
                DocModelObj.DOCUMENT_TYPE_ID = $scope.DocSearch.DOCUMENT_TYPE_ID;
                DocModelObj.DOCUMENT_TYPE_NAME = $scope.DocSearch.DOCUMENT_TYPE_NAME;
                DocModelObj.ACTIVE = $scope.DocSearch.ACTIVE ? 1 : 0;
                DocModelObj.USER_ID = parseInt($cookies.get("USERID"));
                DocModelObj.COMMENT = $scope.DocSearch.COMMENT;
                DocModelObj.ENTITY_ID = null;//$scope.DocSearch.ENTITY_ID;
                PrcCommMethods.ADMIN_API(DocModelObj, 'ADMIN_INS_UPD_DOCUMENT_TYPE').then(function (data) {
                    $scope.$parent.ShowAlert("Success", "Save Successfully", 3000);
                    $scope.RESET_DOC();
                });
            }
            else { $scope.$parent.ShowAlert('Attention', 'Please Select Active/In-Active Option.', 3000); $scope.DocForm.submitted = false; }
        }
    };
    $scope.EDIT_INS_UPD_DOCUMENT_TYPE = function (NAT) {
        $scope.DocSearch.DOCUMENT_TYPE_ID = NAT.DOCUMENT_TYPE_ID;
        $scope.DocSearch.DOCUMENT_TYPE_NAME = NAT.DOCUMENT_TYPE_NAME;
        $scope.DocSearch.ACTIVE = NAT.ACTIVE == true ? 1 : 0;
        $scope.DocSearch.CUSTOMER_ID = NAT.CUSTOMER_ID;
        //$scope.DocSearch.ENTITY_ID = NAT.ENTITY_ID;
        //$scope.GET_ENTITY_LIST();

    };
    $scope.DELETE_INS_UPD_DOCUMENT_TYPE = function (NAT) {
        if (confirm('Are you sure?')) {
            var NatioModelObj = new Object();
            NatioModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
            NatioModelObj.DOCUMENT_TYPE_ID = NAT.DOCUMENT_TYPE_ID;
            NatioModelObj.ACTIVE = 2;
            NatioModelObj.USER_ID = parseInt($cookies.get("USERID"));
            NatioModelObj.COMMENT = "COMMENT";
            PrcCommMethods.ADMIN_API(NatioModelObj, 'ADMIN_INS_UPD_DOCUMENT_TYPE').then(function (data) {
                $scope.$parent.ShowAlert("Success", "Inactive Successfully", 3000);
                $scope.RESET_DOC();
                $scope.ADMIN_GET_DOCUMENT_TYPE();
            });
        }
    };

    $scope.GET_ENTITY_LIST = function () {

        if ($scope.DocSearch.CUSTOMER_ID != undefined && $scope.DocSearch.CUSTOMER_ID != '' && $scope.DocSearch.CUSTOMER_ID != null) {
            var CusModelObj = new Object();
            CusModelObj.CUSTOMER_ID = $scope.DocSearch.CUSTOMER_ID;
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
        }
        else { $scope.ENTITY_LIST = []; }
    };
    $scope.ADMIN_GET_CUSTOMER = function () {
        var DocModelObj = new Object();
        DocModelObj.CUSTOMER_NAME = '';
        DocModelObj.CUSTOMER_CODE = '';
        DocModelObj.ACTIVE = 1;
        DocModelObj.PAGE_NO = 1;
        DocModelObj.PAGE_SIZE = 1000;//$scope.CustomerSearch.PAGE_SIZE;
        DocModelObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(DocModelObj, 'ADMIN_GET_CUSTOMER').then(function (data) {
            $scope.CUSTOMER_LIST = data.data.Table;
        });
    };
    $scope.ADMIN_GET_CUSTOMER();
});
app.controller('TillController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.$parent.PAGE_HEADER = "Cashup Tills";
    $scope.GRP_ID = getUrlParameter('ID', $location.absUrl());
    $scope.DOCUMENT_TYPE_LIST = [];
    $scope.ENTITY_LIST = [];
    $scope.LOCATION = [];
    $scope.BRANCH_AREA_LISTS = [];

    $scope.TillSearch = {
        CUSTOMER_ID: null, ENTITY_ID: null, LOCATION_ID: null,
        TILLS_ID: null,
        TILLS_NAME: "",
        ACTIVE: 0,
        PAGE_NO: 1,
        PAGE_SIZE: 1000
    };
    $scope.RESET_TILS = function () {
        $scope.TillSearch = {
            TILLS_ID: null,
            TILLS_NAME: "",
            ACTIVE: 1,
            PAGE_NO: 1,
            PAGE_SIZE: 10
        };
        $scope.TillForm.submitted = false;
        $scope.ENTITY_LIST = [];
    };
    $scope.ADMIN_GET_TILLS = function () {
        var CONModelObj = new Object();
        CONModelObj.CUSTOMER_ID = $scope.TillSearch.CUSTOMER_ID;
        CONModelObj.TILLS_ID = $scope.TillSearch.TILLS_ID;
        CONModelObj.TILLS_NAME = $scope.TillSearch.TILLS_NAME;
        CONModelObj.ACTIVE = -1;
        CONModelObj.PAGE_NO = $scope.TillSearch.PAGE_NO;
        CONModelObj.PAGE_SIZE = $scope.TillSearch.PAGE_SIZE;
        CONModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.ADMIN_API(CONModelObj, 'ADMIN_GET_TILLS').then(function (data) {
            $scope.TILLS_LIST = data.data.Table;
        });
    };
    $scope.ADMIN_GET_TILLS();
    $scope.GET_ENTITY_LIST = function () {
        var GET_ALL = new Object();
        GET_ALL.CUSTOMER_ID = $scope.TillSearch.CUSTOMER_ID;
        GET_ALL.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.PAYROLL_API(GET_ALL, 'GET_ENTITY_LIST').then(function (data) {
            $scope.ENTITY_LIST = data.data.Table;
        });
    };
    $scope.GET_LOCATION = function () {
        //var ENT = $scope.ENTITY_LIST.filter(function (x) { return x.ENTITY_ID == $scope.GroupSearch.ENTITY_ID })
        if ($scope.TillSearch.ENTITY_ID != null && $scope.TillSearch.ENTITY_ID != undefined) {
            var GET_ALL = new Object();
            GET_ALL.ENTITY_ID = $scope.TillSearch.ENTITY_ID;//ENT[0].ENTITY_ID;
            GET_ALL.CUSTOMER_ID = $scope.TillSearch.CUSTOMER_ID;//ENT[0].CUSTOMER_ID;
            PrcCommMethods.HR_API(GET_ALL, 'GET_LOCATION').then(function (data) {
                $scope.LOCATION = data.data.Table;
            });
            //$scope.GET_BRANCH_LIST();

        }
        else {
            $scope.EMPLOYEE_CATEGORY = [];
            $scope.SUB_EMPLOYEE_CATEGORY = [];
            $scope.LOCATION = []; $scope.COST_CENTER_LIST = [];
        }

    };
    $scope.ADMIN_GET_BRANCH = function () {
        if ($scope.TillSearch.LOCATION_ID != null && $scope.TillSearch.LOCATION_ID != undefined) {
            var BrnModelObj = new Object();
            BrnModelObj.CUSTOMER_ID = $scope.TillSearch.CUSTOMER_ID;
            BrnModelObj.BRANCH_CODE = $scope.TillSearch.BRANCH_CODE;
            BrnModelObj.BRANCH_NAME = $scope.TillSearch.BRANCH_NAME;
            BrnModelObj.CONTACT_NAME = $scope.TillSearch.CONTACT_NAME;
            BrnModelObj.LOCATION_IDS = $scope.TillSearch.LOCATION_ID;
            BrnModelObj.ACTIVE = 1;//$scope.BrachSearch.ACTIVE ? 1 : 0;
            BrnModelObj.PAGE_NO = $scope.TillSearch.PAGE_NO;
            BrnModelObj.PAGE_SIZE = $scope.TillSearch.PAGE_SIZE;
            BrnModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.ADMIN_API(BrnModelObj, 'ADMIN_GET_BRANCH').then(function (data) {
                $scope.BRANCH_LIST = data.data.Table;
            });
        }
        else
            $scope.BRANCH_LIST = [];
    };
    $scope.ADMIN_GET_CUSTOMER = function () {
        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_NAME = "";
        CusModelObj.CUSTOMER_CODE = "";
        CusModelObj.ACTIVE = 1;
        CusModelObj.PAGE_NO = 1
        CusModelObj.PAGE_SIZE = 999;
        CusModelObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(CusModelObj, 'ADMIN_GET_CUSTOMER').then(function (data) {
            $scope.CUSTOMER_LIST = data.data.Table;
        });
    };
    $scope.ADMIN_GET_CUSTOMER();
    $scope.ADMIN_GET_AREA = function () {
        var AreaModelObj = new Object();
        AreaModelObj.CUSTOMER_NAME = "";
        AreaModelObj.CUSTOMER_CODE = "";
        AreaModelObj.ACTIVE = 1;
        AreaModelObj.PAGE_NO = 1
        AreaModelObj.PAGE_SIZE = 999;
        PrcCommMethods.ADMIN_API(AreaModelObj, 'ADMIN_GET_AREA').then(function (data) {
            $scope.AREA_LIST = data.data.Table;
        });
    };
    $scope.ADMIN_GET_BRANCH_AREA = function () {
        var AreaModelObj = new Object();
        AreaModelObj.CUSTOMER_ID = $scope.TillSearch.CUSTOMER_ID;
        AreaModelObj.BRANCH_AREA_CODE = $scope.TillSearch.BRANCH_ID;
        AreaModelObj.BRANCH_AREA_NAME = "";
        AreaModelObj.ACTIVE = 1;
        AreaModelObj.PAGE_NO = 1;
        AreaModelObj.PAGE_SIZE = 1000;
        PrcCommMethods.ADMIN_API(AreaModelObj, 'ADMIN_GET_BRANCH_AREA').then(function (data) {

            $scope.BRANCH_AREA_LISTS = data.data.Table;
        });
    };
    $scope.ADMIN_GET_AREA();
    $scope.ADMIN_INS_UPD_TILLS = function () {
        $scope.TillForm.submitted = true;
        if ($scope.TillForm.$valid) {
            var TillsModelObj = new Object();
            TillsModelObj.CUSTOMER_ID = $scope.TillSearch.CUSTOMER_ID;
            TillsModelObj.TILLS_ID = $scope.TillSearch.TILLS_ID;
            TillsModelObj.TILLS_NAME = $scope.TillSearch.TILLS_NAME;
            TillsModelObj.ENTITY_ID = $scope.TillSearch.ENTITY_ID;
            TillsModelObj.BRANCH_ID = $scope.TillSearch.BRANCH_ID;
            TillsModelObj.AREA_ID = $scope.TillSearch.AREA_ID;
            TillsModelObj.ACTIVE = $scope.TillSearch.ACTIVE ? 1 : 0;
            TillsModelObj.USER_ID = parseInt($cookies.get("USERID"));
            TillsModelObj.COMMENT = "COMMENT"
            PrcCommMethods.ADMIN_API(TillsModelObj, 'ADMIN_INS_UPD_TILLS').then(function (data) {
                $scope.$parent.ShowAlert("Success", "Save Successfully", 3000);
                $scope.RESET_TILS();
                $scope.ADMIN_GET_TILLS();
            });
        }
    };
    $scope.EDIT_INS_UPD_TILLS = function (NAT) {
        $scope.TillSearch = NAT;
        $scope.TillSearch.CUSTOMER_ID = NAT.CUSTOMER_ID;
        $scope.TillSearch.ENTITY_ID = NAT.ENTITY_ID;
        $scope.TillSearch.LOCATION_ID = NAT.LOCATION_ID;
        //$scope.GET_ENTITY_LIST
        //$scope.TillSearch.TILLS_ID = NAT.TILLS_ID;
        //$scope.TillSearch.TILLS_NAME = NAT.TILL_NAME;
        //$scope.TillSearch.ENTITY_ID = NAT.ENTITY_ID;
        //$scope.TillSearch.BRANCH_ID = NAT.BRANCH_ID;
        //$scope.TillSearch.AREA_ID = NAT.AREA_ID;
        //$scope.TillSearch.ACTIVE = NAT.ACTIVE;
        $scope.GET_ENTITY_LIST();
        $scope.GET_LOCATION();
        $scope.ADMIN_GET_BRANCH();
    };
    $scope.DELETE_INS_UPD_TILLS = function (TILLS) {
        if (confirm('Are you sure?')) {
            var TillsModelObj = new Object();
            TillsModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
            TillsModelObj.TILLS_ID = TILLS.TILL_ID;
            TillsModelObj.TILLS_NAME = TILLS.TILL_NAME
            TillsModelObj.ENTITY_ID = TILLS.ENTITY_ID
            TillsModelObj.BRANCH_ID = TILLS.BRANCH_ID;
            TillsModelObj.AREA_ID = TILLS.AREA_ID;
            TillsModelObj.ACTIVE = 2;
            TillsModelObj.USER_ID = parseInt($cookies.get("USERID"));
            TillsModelObj.COMMENT = "COMMENT";
            PrcCommMethods.ADMIN_API(TillsModelObj, 'ADMIN_INS_UPD_TILLS').then(function (data) {
                $scope.$parent.ShowAlert("Success", "Inactive Successfully", 3000);
                $scope.RESET_TILS();
                $scope.ADMIN_GET_TILLS();
            });
        }
    };

});
app.controller('SessionMappingController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {

    $scope.$parent.PAGE_HEADER = "Session Mapping";
    $scope.$parent.urlpath = "Cashup_session_mapping";
    $scope.CUSTOMER_LIST = [];
    $scope.ENTITY_LIST = [];
    $scope.LOCATION = [];
    $scope.BRANCH_AREA_LISTS = [];
    $scope.AREA_LIST = [];
    $scope.BRANCH_LIST = [];
    $scope.SESSION_LIST = [];
    $scope.SESSION_MAPPING_LIST = [];
    $scope.CurrentDate = new Date();
    $scope.SessionMappingSearch = {
        CUSTOMER_ID: null,
        ENTITY_ID: null,
        LOCATION_ID: null,
        BRANCH_ID: null, AREA_ID: null, SESSION_ID: null, SESSION_START: null, SESSION_END: null,
        ACTIVE: -1,
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        SESSION_NAME: null,
        CLICK_SEARCH: null,
        START_TIME: null,
        START_TIME_MIN: null,
        START_TIME_SEC: null,
        END_TIME: null,
        END_TIME_MIN: null,
        END_TIME_SEC: null,
        EDIT_FLAG: false,
        SHIFT_NAME_OF_COVERS: null,
        USE_IN_REPORTING_DASHBOARD: false,
        USE_IN_CASHUP:false
    };
    $scope.RESET_SESSION = function () {
        $scope.SessionMappingSearch = {
            CUSTOMER_ID: null,
            ENTITY_ID: null,
            LOCATION_ID: null,
            BRANCH_ID: null, AREA_ID: null, SESSION_ID: null, SESSION_START: null, SESSION_END: null,
            ACTIVE: -1,
            PAGE_NO: 1,
            PAGE_SIZE: 10,
            SESSION_NAME: null,
            CLICK_SEARCH: null,
            EDIT_FLAG: false,
            SHIFT_NAME_OF_COVERS: null,
            USE_IN_REPORTING_DASHBOARD: false,
            USE_IN_CASHUP: false
        };
        $scope.ENTITY_LIST = [];
        $scope.LOCATION = [];
        $scope.BRANCH_AREA_LISTS = [];
        $scope.AREA_LIST = [];
        $scope.BRANCH_LIST = [];
        $scope.SESSION_MAPPING_LIST = [];
        $scope.SessionMappingSearch.SESSION_MAPPING_ID = null;
        $scope.SessionMappingForm.submitted = false;
        $scope.ADMIN_GET_SESSION_MAPPING_LIST(2);
    };
    //$scope.SessionMappingSearch.EDIT_FLAG = false;
    // $scope.EDITFLAG = false;
    $scope.GET_ENTITY_LIST = function () {
        if ($scope.SessionMappingSearch.CUSTOMER_ID != undefined && $scope.SessionMappingSearch.CUSTOMER_ID != '' && $scope.SessionMappingSearch.CUSTOMER_ID != null) {
            var CusModelObj = new Object();
            CusModelObj.CUSTOMER_ID = $scope.SessionMappingSearch.CUSTOMER_ID;
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

        }
        else {
            $scope.ENTITY_LIST = [];
            $scope.LOCATION = [];
            $scope.BRANCH_LIST = [];
        }
        //$scope.EDITFLAG = false;
    };
    $scope.GET_LOCATION = function () {

        if ($scope.SessionMappingSearch.ENTITY_ID != null && $scope.SessionMappingSearch.ENTITY_ID != undefined) {
            var GET_ALL = new Object()
            GET_ALL.ENTITY_ID = $scope.SessionMappingSearch.ENTITY_ID;//ENT[0].ENTITY_ID;
            GET_ALL.CUSTOMER_ID = $scope.SessionMappingSearch.CUSTOMER_ID;//ENT[0].CUSTOMER_ID;
            GET_ALL.LOCATION_NAME = null;
            GET_ALL.LOCATION_CODE = null;
            GET_ALL.ACTIVE = 1;
            GET_ALL.PAGE_NO = 1;
            GET_ALL.PAGE_SIZE = 999;
            GET_ALL.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.ADMIN_API(GET_ALL, 'ADMIN_GET_LOCATION').then(function (data) {
                $scope.LOCATION = data.data.Table;
            });
            //$scope.GET_BRANCH_LIST();

        }
        else {
            $scope.EMPLOYEE_CATEGORY = [];
            $scope.SUB_EMPLOYEE_CATEGORY = [];
            $scope.LOCATION = []; $scope.COST_CENTER_LIST = [];
        }
        //$scope.EDITFLAG = false;
    };
    $scope.ADMIN_GET_BRANCH = function () {
        if ($scope.SessionMappingSearch.LOCATION_ID != null && $scope.SessionMappingSearch.LOCATION_ID != undefined) {
            var BrnModelObj = new Object();
            BrnModelObj.CUSTOMER_ID = $scope.SessionMappingSearch.CUSTOMER_ID;
            BrnModelObj.BRANCH_CODE = null;//$scope.SessionMappingSearch.EDIT_FLAG == true ? $scope.SessionMappingSearch.BRANCH_CODE:null  ;
            BrnModelObj.BRANCH_NAME = null;//$scope.SessionMappingSearch.EDIT_FLAG == true ? $scope.SessionMappingSearch.BRANCH_NAME : null  ;
            BrnModelObj.CONTACT_NAME = $scope.SessionMappingSearch.CONTACT_NAME;
            BrnModelObj.LOCATION_IDS = $scope.SessionMappingSearch.LOCATION_ID;
            BrnModelObj.ACTIVE = 1;//$scope.BrachSearch.ACTIVE ? 1 : 0;
            BrnModelObj.PAGE_NO = 1;
            BrnModelObj.PAGE_SIZE = 999;
            BrnModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.ADMIN_API(BrnModelObj, 'ADMIN_GET_BRANCH').then(function (data) {
                $scope.BRANCH_LIST = data.data.Table;
            });
        }
        else
            $scope.BRANCH_LIST = [];

        //$scope.EDITFLAG = false;
    };
    $scope.ADMIN_GET_CUSTOMER = function () {
        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_NAME = "";
        CusModelObj.CUSTOMER_CODE = "";
        CusModelObj.ACTIVE = 1;
        CusModelObj.PAGE_NO = 1
        CusModelObj.PAGE_SIZE = 999;
        CusModelObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(CusModelObj, 'ADMIN_GET_CUSTOMER').then(function (data) {
            $scope.CUSTOMER_LIST = data.data.Table;
        });
        $scope.EDITFLAG = false;
    };
    $scope.ADMIN_GET_CUSTOMER();

    $scope.ADMIN_GET_BRANCH_AREA = function (FLAG) {

        if ($scope.SessionMappingSearch.BRANCH_ID != undefined) {

            var BranchAreaMappingModelObj = new Object();
            BranchAreaMappingModelObj.CUSTOMER_ID = $scope.SessionMappingSearch.CUSTOMER_ID;
            BranchAreaMappingModelObj.BRANCH_ID = $scope.SessionMappingSearch.BRANCH_ID;
            BranchAreaMappingModelObj.AREA_ID = '';//$scope.SessionMappingSearch.AREA_ID == undefined ? 0 : $scope.SessionMappingSearch.AREA_ID;
            BranchAreaMappingModelObj.ACTIVE = 1;
            BranchAreaMappingModelObj.PAGE_NO = 1;
            BranchAreaMappingModelObj.PAGE_SIZE = $scope.SessionMappingSearch.PAGE_SIZE == undefined ? 10 : $scope.SessionMappingSearch.PAGE_SIZE;
            BranchAreaMappingModelObj.ENTITY_ID = $scope.SessionMappingSearch.ENTITY_ID;
            BranchAreaMappingModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.ADMIN_API(BranchAreaMappingModelObj, 'ADMIN_GET_BRANCH_AREA').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.AREA_LIST = data.data.Table;
                }
                else
                    $scope.AREA_LIST = [];
            });
        }
        else { $scope.AREA_LIST = []; }
    };
    $scope.ADMIN_GET_SESSION_MASTER = function () {
        var SessionObj = new Object();
        SessionObj.ACTIVE = 1;
        SessionObj.PAGE_NO = 1
        SessionObj.PAGE_SIZE = 999;
        PrcCommMethods.ADMIN_API(SessionObj, 'GET_SESSION_MASTER').then(function (data) {
            $scope.SESSION_LIST = data.data.Table;
        });
    };
    $scope.ADMIN_GET_SESSION_MASTER();
    $scope.ADMIN_GET_SESSION_MAPPING_LIST = function (FLAG) {

        var SessionObj = new Object();
        if (FLAG == 1) {
            $scope.SessionMappingSearch.CLICK_SEARCH = 1;
            $scope.SESSION_MAPPING_LIST = [];
            $scope.SessionMappingSearch.PAGE_NO = 1;
            //SessionObj.ACTIVE = $scope.SessionMappingSearch.ACTIVE ? 1 : 0;
            SessionObj.ACTIVE = $scope.SessionMappingSearch.ACTIVE == -1 ? -1 : $scope.SessionMappingSearch.ACTIVE ? 1 : 0;
        }
        else if (FLAG == 2) {
            $scope.SESSION_MAPPING_LIST = [];
            SessionObj.ACTIVE = $scope.SessionMappingSearch.ACTIVE == -1 ? -1 : $scope.SessionMappingSearch.ACTIVE ? 1 : 0;
            $scope.SessionMappingSearch.PAGE_NO = 1;
        }
        else if (FLAG == undefined) {
            if ($scope.SessionMappingSearch.CLICK_SEARCH == 1)
                SessionObj.ACTIVE = $scope.SessionMappingSearch.ACTIVE == -1 ? -1 : $scope.SessionMappingSearch.ACTIVE ? 1 : 0;
            else
                SessionObj.ACTIVE = -1;
        }

        if ($scope.SessionMappingSearch.SESSION_ID != null) {
            var SESSIONLIST = $scope.SESSION_LIST.filter(function (x) { return x.SESSION_MASTER_ID == $scope.SessionMappingSearch.SESSION_ID });
            $scope.SessionMappingSearch.SESSION_NAME = SESSIONLIST[0]['SESSION_NAME'];
        }
        else { $scope.SessionMappingSearch.SESSION_NAME = ''; }

        SessionObj.CUSTOMER_ID = $scope.SessionMappingSearch.CLICK_SEARCH == 1 ? $scope.SessionMappingSearch.CUSTOMER_ID : null;
        SessionObj.SESSION_NAME = $scope.SessionMappingSearch.CLICK_SEARCH == 1 ? $scope.SessionMappingSearch.SESSION_NAME : '';
        //SessionObj.ACTIVE = -1;
        SessionObj.PAGE_NO = $scope.SessionMappingSearch.PAGE_NO;
        SessionObj.PAGE_SIZE = $scope.SessionMappingSearch.PAGE_SIZE;
        SessionObj.ENTITY_ID = $scope.SessionMappingSearch.CLICK_SEARCH == 1 ? $scope.SessionMappingSearch.ENTITY_ID : null;
        SessionObj.LOCATION_ID = $scope.SessionMappingSearch.CLICK_SEARCH == 1 ? $scope.SessionMappingSearch.LOCATION_ID : null;
        SessionObj.BRANCH_ID = $scope.SessionMappingSearch.CLICK_SEARCH == 1 ? $scope.SessionMappingSearch.BRANCH_ID : null;
        SessionObj.AREA_ID = $scope.SessionMappingSearch.CLICK_SEARCH == 1 ? $scope.SessionMappingSearch.AREA_ID : null;
        SessionObj.USER_ID = parseInt($cookies.get("USERID"));
        SessionObj.SESSION_START = $scope.SessionMappingSearch.CLICK_SEARCH == 1 ? $scope.SessionMappingSearch.START_TIME + ":" + $scope.SessionMappingSearch.START_TIME_MIN + ":" + $scope.SessionMappingSearch.START_TIME_SEC : '';
        SessionObj.SESSION_END = $scope.SessionMappingSearch.CLICK_SEARCH == 1 ? $scope.SessionMappingSearch.END_TIME + ":" + $scope.SessionMappingSearch.END_TIME_MIN + ":" + $scope.SessionMappingSearch.END_TIME_SEC : '';
        PrcCommMethods.ADMIN_API(SessionObj, 'ADMIN_GET_CU_SESSION_MAPPING').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.SESSION_MAPPING_LIST = $scope.SESSION_MAPPING_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.SessionMappingSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.SessionMappingSearch.PAGE_NO = parseInt($scope.SessionMappingSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else {
                $scope.GetData = false;
            }
        });
    };
    $scope.ADMIN_GET_SESSION_MAPPING_LIST();

    $scope.GET_TIME_LIST = function () {
        var GetAll = new Object();
        PrcCommMethods.HR_API(GetAll, 'GET_TIME_LIST').then(function (data) {
            $scope.TIME_LIST = data.data.Table;
        });
    };
    $scope.GET_TIME_LIST();
    $scope.ADMIN_INS_UPD_SESSION_MAPPING = function (search)//search=0 is insert session mapping.search=1 for search
    {
        $scope.SessionMappingForm.submitted = true;
        if ($scope.SessionMappingForm.$valid) {
            if ($scope.SessionMappingSearch.ACTIVE != -1) {
                var SessionMappingModelObj = new Object();
                SessionMappingModelObj.CUSTOMER_ID = $scope.SessionMappingSearch.CUSTOMER_ID;
                SessionMappingModelObj.SESSION_MAPPING_ID = $scope.SessionMappingSearch.SESSION_MAPPING_ID != null ? $scope.SessionMappingSearch.SESSION_MAPPING_ID : 0;
                SessionMappingModelObj.ENTITY_ID = $scope.SessionMappingSearch.ENTITY_ID;
                SessionMappingModelObj.BRANCH_ID = $scope.SessionMappingSearch.BRANCH_ID;
                SessionMappingModelObj.AREA_ID = $scope.SessionMappingSearch.AREA_ID;
                SessionMappingModelObj.LOCATION_ID = $scope.SessionMappingSearch.LOCATION_ID;
                SessionMappingModelObj.SESSION_START = $scope.SessionMappingSearch.START_TIME + ":" + $scope.SessionMappingSearch.START_TIME_MIN + ":" + $scope.SessionMappingSearch.START_TIME_SEC; //$scope.SessionMappingSearch.SESSION_START;
                SessionMappingModelObj.SESSION_END = $scope.SessionMappingSearch.END_TIME + ":" + $scope.SessionMappingSearch.END_TIME_MIN + ":" + $scope.SessionMappingSearch.END_TIME_SEC;//$scope.SessionMappingSearch.SESSION_END;
                SessionMappingModelObj.CU_SESSION_ID = $scope.SessionMappingSearch.SESSION_ID;
                SessionMappingModelObj.ACTIVE = $scope.SessionMappingSearch.ACTIVE == true ? 1 : 0;
                SessionMappingModelObj.USER_ID = parseInt($cookies.get("USERID"));
                SessionMappingModelObj.COMMENT = ""
                SessionMappingModelObj.SHIFT_NAME_OF_COVERS = $scope.SessionMappingSearch.SHIFT_NAME_OF_COVERS;
                SessionMappingModelObj.USE_IN_REPORTING_DASHBOARD = $scope.SessionMappingSearch.USE_IN_REPORTING_DASHBOARD == true ? 1 : 0;
                SessionMappingModelObj.USE_IN_CASHUP = $scope.SessionMappingSearch.USE_IN_CASHUP == true ? 1 : 0;

                PrcCommMethods.ADMIN_API(SessionMappingModelObj, 'ADMIN_INS_UPD_CU_SESSION_MAPPING').then(function (data) {
                    $scope.$parent.ShowAlert("Success", "Save Successfully", 3000);
                    $scope.RESET_SESSION();
                });
            }
            else { $scope.$parent.ShowAlert("Attention", "Please select Active/Inactive option.", 3000); $scope.SessionMappingForm.submitted = false; }

        }

    };
    $scope.ADMIN_EDIT_SESSION_MAPPING = function (SML) {

        //$scope.SessionMappingSearch = SML;
        //$scope.EDITFLAG = true;
        $scope.SessionMappingSearch.EDIT_FLAG = true;
        $scope.SessionMappingSearch.CUSTOMER_ID = SML.CUSTOMER_ID;
        $scope.SessionMappingSearch.SESSION_MAPPING_ID = SML.SESSION_MAPPING_ID;
        $scope.SessionMappingSearch.ENTITY_ID = SML.ENTITY_ID;
        $scope.SessionMappingSearch.BRANCH_ID = SML.BRANCH_ID;
        $scope.SessionMappingSearch.AREA_ID = SML.AREA_ID;
        $scope.SessionMappingSearch.LOCATION_ID = SML.LOCATION_ID;
        //$scope.SessionMappingSearch.SESSION_START = SML.SESSION_START;
        //$scope.SessionMappingSearch.SESSION_END = SML.SESSION_END;
        $scope.SessionMappingSearch.START_TIME = SML.SESSION_START.split(':')[0];
        $scope.SessionMappingSearch.START_TIME_MIN = SML.SESSION_START.split(':')[1];
        $scope.SessionMappingSearch.START_TIME_SEC = SML.SESSION_START.split(':')[2];

        $scope.SessionMappingSearch.END_TIME = SML.SESSION_END.split(':')[0];
        $scope.SessionMappingSearch.END_TIME_MIN = SML.SESSION_END.split(':')[1];
        $scope.SessionMappingSearch.END_TIME_SEC = SML.SESSION_END.split(':')[2];

        $scope.SessionMappingSearch.SESSION_ID = SML.SESSION_ID;
        $scope.SessionMappingSearch.ACTIVE = SML.ACTIVE == true ? 1 : 0;
        $scope.SessionMappingSearch.SHIFT_NAME_OF_COVERS = SML.SHIFT_NAME_OF_COVERS;
        $scope.SessionMappingSearch.USE_IN_REPORTING_DASHBOARD = SML.USE_IN_REPORTING_DASHBOARD == true ? true: false;
        $scope.SessionMappingSearch.USE_IN_CASHUP = SML.USE_IN_CASHUP == true ? true: false;

        $scope.GET_ENTITY_LIST();
        $scope.GET_LOCATION();
        $scope.ADMIN_GET_BRANCH();
        $scope.ADMIN_GET_BRANCH_AREA();
    };
    $scope.LAZY_ADMIN_GET_SESSION_MAPPING_LIST = function () {
        $scope.ADMIN_GET_SESSION_MAPPING_LIST();
    };

});
app.controller('SetupFieldsController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    if ($scope.$parent.SELECTED_PAGE_NAME == undefined) {
        $scope.$parent.PAGE_HEADER = "Custom Field Mapping";
        //$location.path("Page_Header");
    }
    else {
        $scope.$parent.PAGE_HEADER = "Custom Field Mapping - " + angular.copy($scope.$parent.SELECTED_PAGE_NAME);
        $scope.$parent.SELECTED_PAGE_NAME = undefined;
    }
    $scope.$parent.urlpath = "Setup_Fields";
    $scope.APP_PAGE_ID = getUrlParameter('APP_PAGE_ID', $location.absUrl());
    $scope.CUSTOM_APP_LIST = [];
    $scope.CUSTOM_FIELDS_LIST = [];
    $scope.CUSTOM_CUNTROL_LIST = [];
    $scope.CUSTOMER_LIST = [];
    $scope.ENTITY_LIST = [];
    $scope.COPY_FROM_ENTITY_LIST = [];
    var setFocus = null;

    var CustomFieldModelObj;
    $scope.SetupFieldsSearch = {
        CUSTOMER_ID: null,
        ENTITY_ID: null,
        PAGE_NO: 1,
        PAGE_SIZE: 1000,
        CUSTOMER_LIST: null,
        ENTITY_LIST: null
    };
    $scope.GET_ENTITY_LIST = function () {
        if ($scope.SetupFieldsSearch.CUSTOMER_ID != undefined) {
            var CusModelObj = new Object();
            CusModelObj.CUSTOMER_ID = $scope.SetupFieldsSearch.CUSTOMER_ID;
            CusModelObj.ACTIVE = 1;
            CusModelObj.PAGE_NO = 0;
            CusModelObj.USER_ID = parseInt($cookies.get("USERID"));
            CusModelObj.IS_LIVE = -1;
            PrcCommMethods.ADMIN_API(CusModelObj, 'ADMIN_GET_ENTITIES').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.ENTITY_LIST = data.data.Table;
                }
                else { $scope.ENTITY_LIST = []; };
            });
        }
        else { $scope.ENTITY_LIST = []; };
        CustomFieldModelObj = null;

    };
    $scope.ADMIN_GET_CUSTOMER = function () {
        CustomFieldModelObj = new Object();
        CustomFieldModelObj.CUSTOMER_NAME = '';
        CustomFieldModelObj.CUSTOMER_CODE = '';
        CustomFieldModelObj.ACTIVE = 1;
        CustomFieldModelObj.PAGE_NO = 1;
        CustomFieldModelObj.PAGE_SIZE = 1000;//$scope.CustomerSearch.PAGE_SIZE;
        CustomFieldModelObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(CustomFieldModelObj, 'ADMIN_GET_CUSTOMER').then(function (data) {
            $scope.CUSTOMER_LIST = data.data.Table;
        });
        CustomFieldModelObj = null;
    };
    $scope.ADMIN_GET_CUSTOMER();

    $scope.ADMIN_CUSTOM_FIELD_RESET = function () {
        $scope.CustomFieldMapingForm.submitted = false;
        angular.forEach($scope.CUSTOM_FIELDS_LIST, function (item) {
            item.ACTIVE = false;
            item.COLUMN_NAME = null;
            item.FIELD_TYPE_ID = null;
            item.IS_MANDATORY = false;
        });
        $scope.SetupFieldsSearch.CUSTOMER_ID = null;
        $scope.ENTITY_LIST = [];
    };
    $scope.ADMIN_GET_CUSTOM_APP_LIST = function (APP_PAGE_ID) {
        CustomFieldModelObj = new Object();
        CustomFieldModelObj.APP_PAGE_ID = 0;
        CustomFieldModelObj.ACTIVE = 1;
        PrcCommMethods.ADMIN_API(CustomFieldModelObj, 'GET_APP_PAGES').then(function (data) {
            $scope.CUSTOM_APP_LIST = data.data.Table;
        });
    };
    $scope.ADMIN_GET_CUSTOM_APP_LIST(0);
    $scope.ADMIN_GET_CUSTOM_APP_FIELD_MAPPING = function () {
        $scope.CUSTOM_FIELDS_LIST = [];
        try {
            if ($scope.SetupFieldsSearch.ENTITY_ID != null || $scope.SetupFieldsSearch.ENTITY_ID == 0) {
                $scope.APP_PAGE_ID = $location.search().APP_PAGE_ID;
                CustomFieldModelObj = new Object();
                CustomFieldModelObj.APP_PAGE_ID = $scope.APP_PAGE_ID != null ? $scope.APP_PAGE_ID : 0;
                CustomFieldModelObj.CUSTOMER_ID = $scope.SetupFieldsSearch.CUSTOMER_ID;
                CustomFieldModelObj.ACTIVE = 1;
                CustomFieldModelObj.PAGE_NO = $scope.SetupFieldsSearch.PAGE_NO;
                CustomFieldModelObj.PAGE_SIZE = $scope.SetupFieldsSearch.PAGE_SIZE;
                CustomFieldModelObj.ENTITY_ID = $scope.SetupFieldsSearch.ENTITY_ID;
                PrcCommMethods.ADMIN_API(CustomFieldModelObj, 'GET_APP_PAGE_FIELD_MASTER').then(function (data) {
                    $scope.CUSTOM_FIELDS_LIST = data.data.Table;
                    $scope.ADMIN_GET_CUSTOM_CONTROL_LIST();
                    $scope.GET_APP_PAGE_HEADERS();
                });

            }
        } catch (e) {
            $scope.$parent.ShowAlert("Error", "Error", 3000);
        }
        CustomFieldModelObj = null;
        //$scope.CustomFieldMapingForm = { type: $scope.CUSTFLD.APP_PAGE_HEADER_ID[0].value };
    };
    $scope.ADMIN_GET_CUSTOM_CONTROL_LIST = function () {
        try {
            CustomFieldModelObj = new Object();
            PrcCommMethods.ADMIN_API(CustomFieldModelObj, 'GET_FIELD_TYPE_MASTER').then(function (data) {
                $scope.CUSTOM_CUNTROL_LIST = data.data.Table;
            });
        }
        catch (e) {
            $scope.$parent.ShowAlert("Error", "Error", 3000);
        }
        CustomFieldModelObj = null;
    };
    $scope.INS_UPD_APP_PAGE_FIELD_ENTITY = function () {
        $scope.IS_EDITABLE_MANDATORY_COUNT = 0;
        $scope.CustomFieldMapingForm.submitted = true;
        try {
            CustomFieldModelObj = new Object();
            var SELECTED_FIELDS = [];
            var count = 0;
            angular.forEach($scope.CUSTOM_FIELDS_LIST, function (CUSTOM_FIELDS) {
                CustomModelObj = new Object();
                //  if (CUSTOM_FIELDS.ACTIVE) {
                CustomModelObj.TABLE_ID = CUSTOM_FIELDS.TABLE_ID == null ? 0 : CUSTOM_FIELDS.TABLE_ID;
                CustomModelObj.APP_PAGE_FIELD_MASTER_ID = CUSTOM_FIELDS.FIELD_MASTER_ID;
                CustomModelObj.COLUMN_NAME = CUSTOM_FIELDS.ENTITY_COLUMN_NAME;
                if (CUSTOM_FIELDS.ACTIVE) {
                    if (CUSTOM_FIELDS.IS_MANDATORY == true || CUSTOM_FIELDS.IS_MANDATORY_MANAGER == true) {
                        if (CUSTOM_FIELDS.IS_EMP_EDIT == false) {
                            //$scope.IS_EDITABLE_MANDATORY_COUNT++;
                        }
                    }
                }
                if ($scope.APP_PAGE_ID == 17) {
                    CustomModelObj.ACTIVE = CUSTOM_FIELDS.APPLICANT_ACTIVE ? 1 : 0;
                }
                else {
                    CustomModelObj.ACTIVE = CUSTOM_FIELDS.ACTIVE ? 1 : 0;
                }
                CustomModelObj.CUSTOMER_ID = $scope.SetupFieldsSearch.CUSTOMER_ID;
                CustomModelObj.FIELD_TYPE_ID = CUSTOM_FIELDS.FIELD_TYPE_ID;
                CustomModelObj.IS_MANDATORY_EMP = CUSTOM_FIELDS.IS_MANDATORY ? 1 : 0;
                CustomModelObj.ENTITY_ID = $scope.SetupFieldsSearch.ENTITY_ID;
                CustomModelObj.VALUES = null;
                //|| CUSTOM_FIELDS.FIELD_TYPE_ID == 6 
                if (CUSTOM_FIELDS.FIELD_TYPE_ID == 3 && !CUSTOM_FIELDS.IS_DB_DROPDOWN || CUSTOM_FIELDS.FIELD_TYPE_ID == 7 || CUSTOM_FIELDS.FIELD_TYPE_ID == 8) {
                    var OPTION_VALUE = CUSTOM_FIELDS.FIELD_TYPE_ID == 3 && !CUSTOM_FIELDS.IS_DB_DROPDOWN || CUSTOM_FIELDS.FIELD_TYPE_ID == 7 || CUSTOM_FIELDS.FIELD_TYPE_ID == 8 ? CUSTOM_FIELDS.OPTION_TEXT == undefined || CUSTOM_FIELDS.OPTION_TEXT == null || CUSTOM_FIELDS.OPTION_TEXT == "" ? [] : CUSTOM_FIELDS.OPTION_TEXT.split('\n') : '';
                    var VALUE = '';
                    if (OPTION_VALUE.length > 0) {
                        for (var j = 0; j < OPTION_VALUE.length; j++) {
                            if (VALUE == '') {
                                VALUE = OPTION_VALUE[j];
                            }
                            else {
                                VALUE = VALUE + ':;:' + OPTION_VALUE[j];
                            }
                        }
                    }
                    else {
                        if (setFocus == null)
                            setFocus = 'FIELD_TYPE' + CUSTOM_FIELDS.FIELD_MASTER_ID;
                    }
                    if (OPTION_VALUE.length == 0) {
                        count++;

                    }
                    CustomModelObj.VALUES = VALUE;//CUSTOM_FIELDS.OPTION_VALUE_SEP == undefined ? null : CUSTOM_FIELDS.OPTION_VALUE_SEP;
                }
                CustomModelObj.APP_PAGES_ID = CUSTOM_FIELDS.APP_PAGE_ID;
                CustomModelObj.APP_PAGE_HEADER_ID = CUSTOM_FIELDS.APP_PAGE_HEADER_ID;
                CustomModelObj.IS_EMP_EDIT = CUSTOM_FIELDS.IS_EMP_EDIT ? 1 : 0;
                CustomModelObj.IS_MANDATORY_MANAGER = CUSTOM_FIELDS.IS_MANDATORY_MANAGER ? 1 : 0;
                CustomModelObj.MAP_AS_ID = CUSTOM_FIELDS.MAP_AS_ID;
                CustomModelObj.COLUMN_DESCRIPTION = CUSTOM_FIELDS.COLUMN_DESCRIPTION == undefined || CUSTOM_FIELDS.COLUMN_DESCRIPTION == null ? "" : CUSTOM_FIELDS.COLUMN_DESCRIPTION;;
                SELECTED_FIELDS.push(CustomModelObj);
                //}
            });
            if ($scope.IS_EDITABLE_MANDATORY_COUNT == 0) {
                if ($scope.CustomFieldMapingForm.$valid && count == 0) {
                    var CUSTOM_SELECTED_FIELD_LIST = new Object();
                    //CustomFieldModelObj.PAGE_FIELD_ENTITY_ID = 0;
                    //CustomFieldModelObj.APP_PAGE_ID = $scope.APP_PAGE_ID;
                    CustomFieldModelObj.USER_ID = parseInt($cookies.get("USERID"));
                    CustomFieldModelObj.CUSTOM_SELECTED_FIELD_LIST = SELECTED_FIELDS;
                    PrcCommMethods.ADMIN_API(CustomFieldModelObj, "INS_UPD_APP_PAGE_FIELD_ENTITY").then
                        (function (data) {
                            $scope.$parent.ShowAlert("Success", "Save Successfully", 3000);
                            $scope.ADMIN_GET_CUSTOM_APP_FIELD_MAPPING();
                        });
                }
                else {
                    $scope.$parent.ShowAlert("Error", "Please check, all mandatory fields are filled", 4000);
                    $('#' + setFocus).focus();
                    setFocus = null;
                }
            }
            else {
                $scope.$parent.ShowAlert("Attention", "Please check, employee editable and  Employee/Manager mandatory are in sync", 3000);
            }
        }
        catch (e) {
            $scope.$parent.ShowAlert("Error", "Error", 3000);
        }
        angular.element('input.ng-invalid').first().focus(); angular.element('select.ng-invalid').first().focus();
    };
    $scope.initializeAdmincustfields = function (LINE) {
        var i = '';
        if (LINE.FIELD_TYPE_ID == 3 || LINE.FIELD_TYPE_ID == 7 || LINE.FIELD_TYPE_ID == 8) {
            if (LINE.VALUES_ENTITY != null) {
                var Arry = LINE.VALUES_ENTITY.split(':;:')
                for (var j = 0; j < Arry.length; j++) {
                    if (i == '') {
                        i = Arry[j];
                    }
                    else {
                        i = i + '\n' + Arry[j];
                    }
                }
                LINE.VALUES_ENTITY = i;
                LINE.OPTION_TEXT = i;
                LINE.OPTION_VALUE_SEP = i;
            }
        }
        LINE.ONLY_17_PERSONAL_DISABLE = false;
        if (LINE.FIELD_MASTER_ID == 115 && $scope.APP_PAGE_ID == 17) {
            LINE.IS_MANDATORY_MANAGER = true;
            LINE.IS_MANDATORY = true;
            LINE.ONLY_17_PERSONAL_DISABLE = true;
            LINE.APPLICANT_ACTIVE = true;
        }


    };
    $scope.IS_EMP_MENDATORY_CHECK_BOX_CHECK = function (CUSTFLD) {
        if (CUSTFLD.IS_MANDATORY == true) {
            if (CUSTFLD.IS_EMP_EDIT) {
                CUSTFLD.EMPLOYEE_MANDATORY = 0;
            }
            else {
                CUSTFLD.EMPLOYEE_MANDATORY = 1;
                CUSTFLD.IS_EMP_EDIT = true;
            }
        }
        else {
            if (CUSTFLD.EMPLOYEE_MANDATORY == 1) {
                CUSTFLD.IS_EMP_EDIT = CUSTFLD.IS_MANDATORY;
            }
            CUSTFLD.EMPLOYEE_MANDATORY = 0;
        }

    };
    $scope.OPTION_SELECTION = {
    };
    $scope.NG_CHANGE_FIELD_TYPE = function (FTYPE) {
        if (FTYPE.FIELD_TYPE_ID == 3 || FTYPE.FIELD_TYPE_ID == 7 || FTYPE.FIELD_TYPE_ID == 8) {
            $scope.OPTION_SELECTION = FTYPE;
            // $scope.OPTION_SELECTION.OPTION_TEXT = FTYPE.VALUES_ENTITY;
            $('#FIELD_VALUE').modal('show');
        }
    };
    $scope.ADD_OPTION_COMMON = function (OPTION) {
        var OPTION_VALUE = OPTION.FIELD_TYPE_ID == 3 || OPTION.FIELD_TYPE_ID == 6 || OPTION.FIELD_TYPE_ID == 7 || OPTION.FIELD_TYPE_ID == 8 ? OPTION == undefined || OPTION == null || OPTION.OPTION_TEXT == undefined || OPTION.OPTION_TEXT == null || OPTION.OPTION_TEXT == "" ? [] : OPTION.OPTION_TEXT.split('\n') : '';
        if (OPTION.length == 0) {
            $scope.$parent.ShowAlert('Error', 'Please Enter Answer Options to Continue.', 3000)
        }
        else {
            var i = '';
            for (var j = 0; j < OPTION_VALUE.length; j++) {
                if (i == '') {
                    i = OPTION_VALUE[j];
                }
                else {
                    i = i + ':;:' + OPTION_VALUE[j];
                }
            }
            OPTION.OPTION_VALUE_SEP = i;
        }
        $('#FIELD_VALUE').modal('hide');
    };
    $scope.NG_CHANGE_CHECKBOX = function (CUSTFLD) {
        if (CUSTFLD.APP_PAGE_ID == 17) {
            //if (CUSTFLD.ENTITY_COLUMN_NAME == undefined || CUSTFLD.ENTITY_COLUMN_NAME == '' || CUSTFLD.ENTITY_COLUMN_NAME == null && CUSTFLD.APPLICANT_ACTIVE) {
            //    CUSTFLD.ENTITY_COLUMN_NAME = angular.copy(CUSTFLD.FIELD_MASTER_COLUMN_NAME);
            //}
            //else {
            //    CUSTFLD.ENTITY_COLUMN_NAME = angular.copy(CUSTFLD.FIELD_MASTER_COLUMN_NAME);
            //    CUSTFLD.IS_EMP_EDIT = false;
            //    CUSTFLD.IS_MANDATORY = false;
            //    CUSTFLD.IS_MANDATORY_MANAGER = false;
            //}
        }
        else {
            if (CUSTFLD.ENTITY_COLUMN_NAME == undefined || CUSTFLD.ENTITY_COLUMN_NAME == '' || CUSTFLD.ENTITY_COLUMN_NAME == null && CUSTFLD.ACTIVE) {
                CUSTFLD.ENTITY_COLUMN_NAME = angular.copy(CUSTFLD.FIELD_MASTER_COLUMN_NAME);
            }
            else {
                CUSTFLD.ENTITY_COLUMN_NAME = angular.copy(CUSTFLD.FIELD_MASTER_COLUMN_NAME);
                CUSTFLD.IS_EMP_EDIT = false;
                CUSTFLD.IS_MANDATORY = false;
                CUSTFLD.IS_MANDATORY_MANAGER = false;
            }
        }
    };
    $scope.GET_APP_PAGE_HEADERS = function () {
        var SetupPageHdrModelObj = new Object()
        SetupPageHdrModelObj.CUSTOMER_ID = $scope.SetupFieldsSearch.CUSTOMER_ID;
        SetupPageHdrModelObj.PAGE_HEADER_NAME = $scope.SetupFieldsSearch.PAGE_HEADER_NAME;
        SetupPageHdrModelObj.ACTIVE = 1;
        SetupPageHdrModelObj.PAGE_NO = 1;
        SetupPageHdrModelObj.PAGE_SIZE = 1000;
        SetupPageHdrModelObj.ENTITY_ID = $scope.SetupFieldsSearch.ENTITY_ID;
        SetupPageHdrModelObj.APP_PAGE_ID = $scope.APP_PAGE_ID;
        PrcCommMethods.ADMIN_API(SetupPageHdrModelObj, 'GET_APP_PAGE_HEADERS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.APP_PAGE_HEADER_LIST = data.data.Table;
            }
        });

    };
    $scope.GET_COPY_FROM_ENTITY_LIST = function () {
        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_ID = 0;
        CusModelObj.ACTIVE = 1;
        CusModelObj.PAGE_NO = 0;
        CusModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.ADMIN_API(CusModelObj, 'ADMIN_GET_ENTITIES').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.COPY_FROM_ENTITY_LIST = data.data.Table;
            }
            else
                $scope.COPY_FROM_ENTITY_LIST = [];
        });
    };
    $scope.COPY_FROM_ENTITY = function () {
        if ($scope.SetupFieldsSearch.ENTITY_ID != null && $scope.SetupFieldsSearch.ENTITY_ID != undefined) {
            $('#POP_MODAL').modal('show');
            $scope.GET_COPY_FROM_ENTITY_LIST();
            $scope.COPY_FROM_ENTITY_LIST = [];
            //$scope.ENTITY_LIST = [];
            //$scope.SetupFieldsSearch.CUSTOMER_ID = null;
        }
        else {
            $scope.$parent.ShowAlert("Error", "Please Select Entity, To Copy.", 4000);
        }
    };
    $scope.ADMIN_INS_COPY_FROM_ENTITY = function () {
        try {
            CustomFieldModelObj = new Object();
            CustomFieldModelObj.FROM_ENTITY_ID = $scope.SetupFieldsSearch.COPY_FROM_ENTITY_ID;
            CustomFieldModelObj.TO_ENTITY_ID = $scope.SetupFieldsSearch.ENTITY_ID;

            PrcCommMethods.ADMIN_API(CustomFieldModelObj, "ADMIN_INS_COPY_CUSTOM_FIELD_MAPPING_BY_ENTITY").then
                (function (data) {
                    $scope.COPY_CUSTOM_FIELD_MAPPING_BY_ENTITY = data.data.Table[0].APPROVED_DURATION_IN_MINS;
                    if ($scope.COPY_CUSTOM_FIELD_MAPPING_BY_ENTITY == -1) {
                        $scope.$parent.ShowAlert("Error", "Please Map 'Copy To' Custom Field, For Process.", 6000);
                    }
                    else {
                        $scope.$parent.ShowAlert("Success", "Save Successfully", 3000);
                        $scope.CUSTOMER_LIST = null;
                        $scope.ENTITY_LIST = [];
                    }

                    $('#POP_MODAL').modal('hide');
                });
        } catch (e) {
            $scope.$parent.ShowAlert("Error", "Error", 3000);

        }
    };
    $scope.REDIRECT_TO = function (CUSTOMFLD) {
        $scope.$parent.SELECTED_PAGE_NAME = CUSTOMFLD.DISPLAY_NAME;
        $location.path("Setup_Fields_Mapping").search("APP_PAGE_ID", CUSTOMFLD.APP_PAGES_ID);
    };
});
app.controller('WorkPatternController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    //$scope.$parent.PAGE_HEADER = "Work Pattern"
    $scope.COMMON_CODE_CHANGE();
    if (getUrlParameter('STAG', $location.absUrl()) == undefined)
        $scope.$parent.PAGE_HEADER = "Work Pattern List";
    if (getUrlParameter('STAG', $location.absUrl()) == 2)
        $scope.$parent.PAGE_HEADER = "Create Work Pattern";
    if (getUrlParameter('Wrk_ID', $location.absUrl()) != null)
        $scope.$parent.PAGE_HEADER = "Edit Work Pattern";

    $scope.$parent.urlpath = "WorkPatternList";
    $scope.Wrk_ID = getUrlParameter('Wrk_ID', $location.absUrl());
    $scope.NO_OF_SHIFTS_PER_LIST = [{ ID: 1, NAME: "1" }, { ID: 2, NAME: "2" }, { ID: 3, NAME: "3" }
        , { ID: 4, NAME: "4" }
        , { ID: 5, NAME: "5" }
        , { ID: 6, NAME: "6" }
        , { ID: 7, NAME: "7" }

    ];
    $scope.WORK_PATTERN_TYPES = [];
    $scope.SHIFTS = [];
    $scope.WORK_PATTERN_LIST = [];
    $scope.ENTITY_LIST = [];
    $scope.WrkPtnSearch = {
        CUSTOMER_ID: null,
        ENTITY_ID: null,
        WORK_PATTERN_ID: null,
        WORK_PATTERN_NAME: '',
        ACTIVE: -1,
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        CLICK_SEARCH: null,
    };
    $scope.RESET_WORK_PATTERNS = function () {
        $scope.WrkPtnSearch = {
            CUSTOMER_ID: null,
            ENTITY_ID: null,
            WORK_PATTERN_ID: null,
            WORK_PATTERN_NAME: '',
            ACTIVE: -1,
            PAGE_NO: 1,
            PAGE_SIZE: 10,
            CLICK_SEARCH: null,
        };
        $scope.WORK_PATTERN_LIST = []; $scope.ENTITY_LIST = [];
        $scope.ADMIN_GET_WORK_PATTERN(2);
    };
    $scope.HR_GET_WORK_PATTERN_TYPES = function () {
        var PosiModelObj = new Object();
        PrcCommMethods.HR_API(PosiModelObj, 'HR_GET_WORK_PATTERN_TYPES').then(function (data) {
            $scope.WORK_PATTERN_TYPES = data.data.Table;
        });
    };
    $scope.HR_GET_WORK_PATTERN_TYPES();
    $scope.HR_GET_SHIFTS = function () {
        var PosiModelObj = new Object();
        PosiModelObj.ENTITY_ID = $scope.WrkPtnSearch.ENTITY_ID;
        PrcCommMethods.HR_API(PosiModelObj, 'HR_GET_SHIFTS').then(function (data) {
            $scope.SHIFTS = data.data.Table;
        });
    };
    $scope.LAZY_ADMIN_GET_WORK_PATTERN = function () { $scope.ADMIN_GET_WORK_PATTERN(); };
    $scope.ADMIN_GET_WORK_PATTERN = function (FLAG) {
        document.getElementById("overlay_loading").style.display = "block";
        var PosiModelObj = new Object();
        if (FLAG == 1) {
            $scope.WrkPtnSearch.CLICK_SEARCH = 1;
            $scope.WORK_PATTERN_LIST = [];
            $scope.WrkPtnSearch.PAGE_NO = 1;
            PosiModelObj.ACTIVE = $scope.WrkPtnSearch.ACTIVE == -1 ? -1 : $scope.WrkPtnSearch.ACTIVE ? 1 : 0;
        }
        else if (FLAG == 2) {
            $scope.LOCATION_LIST = [];
            PosiModelObj.ACTIVE = $scope.WrkPtnSearch.ACTIVE == -1 ? -1 : $scope.WrkPtnSearch.ACTIVE ? 1 : 0;
            $scope.WrkPtnSearch.PAGE_NO = 1;
        }
        else if (FLAG == undefined) {
            if ($scope.WrkPtnSearch.CLICK_SEARCH == 1)
                PosiModelObj.ACTIVE = $scope.WrkPtnSearch.ACTIVE == -1 ? -1 : $scope.WrkPtnSearch.ACTIVE ? 1 : 0;
            else {
                PosiModelObj.ACTIVE = -1;
            }
        }
        PosiModelObj.CUSTOMER_ID = $scope.WrkPtnSearch.CLICK_SEARCH == 1 ? $scope.WrkPtnSearch.CUSTOMER_ID : null;
        PosiModelObj.ENTITY_ID = $scope.WrkPtnSearch.CLICK_SEARCH == 1 ? $scope.WrkPtnSearch.ENTITY_ID : null;
        PosiModelObj.WORK_PATTERN_NAME = $scope.WrkPtnSearch.CLICK_SEARCH == 1 ? $scope.WrkPtnSearch.WORK_PATTERN_NAME : '';
        PosiModelObj.WORK_PATTERN_CODE = $scope.WrkPtnSearch.CLICK_SEARCH == 1 ? $scope.WrkPtnSearch.WORK_PATTERN_CODE : '';
        PosiModelObj.WORK_PATTERN_DESC = $scope.WrkPtnSearch.CLICK_SEARCH == 1 ? $scope.WrkPtnSearch.WORK_PATTERN_DESC : '';
        PosiModelObj.WORK_PATTERN_TYPE_ID = $scope.WrkPtnSearch.CLICK_SEARCH == 1 ? $scope.WrkPtnSearch.WORK_PATTERN_TYPE_ID : null;
        //PosiModelObj.ACTIVE = $scope.WrkPtnSearch.ACTIVE;
        PosiModelObj.PAGE_NO = $scope.WrkPtnSearch.PAGE_NO;
        PosiModelObj.PAGE_SIZE = $scope.WrkPtnSearch.PAGE_SIZE;
        //PosiModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.ADMIN_API(PosiModelObj, 'ADMIN_GET_WORK_PATTERN').then(function (data) {
            //$scope.WORK_PATTERN_LIST = data.data.Table;
            if (data.data.Table.length > 0) {
                $scope.WORK_PATTERN_LIST = $scope.WORK_PATTERN_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.WrkPtnSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                    document.getElementById("overlay_loading").style.display = "none";
                }
                else {
                    $scope.WrkPtnSearch.PAGE_NO = parseInt($scope.WrkPtnSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                    document.getElementById("overlay_loading").style.display = "none";
                }
            }
            else { $scope.GetData = false; $scope.WORK_PATTERN_LIST = []; document.getElementById("overlay_loading").style.display = "none"; }

            if ($scope.Wrk_ID > 0) {
                $scope.EDIT_INS_UPD_WORK_PATTERN(data.data.Table[0]);
            }
        });
    };
    $scope.ADMIN_GET_WORK_PATTERN_BY_ID = function () {
        document.getElementById("overlay_loading").style.display = "block";
        var WpModelObj = new Object();
        WpModelObj.WORK_PATTERN_ID = $scope.WrkPtnSearch.WORK_PATTERN_ID;
        PrcCommMethods.ADMIN_API(WpModelObj, 'ADMIN_GET_WORK_PATTERN_BY_ID').then(function (data) {
            $scope.EDIT_INS_UPD_WORK_PATTERN(data.data.Table[0]);
            $scope.SHIFT_LIST = data.data.Table1;
            angular.forEach($scope.SHIFT_LIST, function (item) {
                item.DURATION = item.DURATION != null ? $scope.CALCULATE_DURATION(item.END_TIME, item.START_TIME, item.UN_PAID_BREAK) : null;
            });

            $scope.ADMIN_GET_ENTITY_SETTINGS();
            document.getElementById("overlay_loading").style.display = "none";
        });

    };
    $scope.EDIT_INS_UPD_WORK_PATTERN = function (NAT) {
        $scope.WrkPtnSearch.WORK_PATTERN_ID = NAT.WORK_PATTERN_ID;
        $scope.WrkPtnSearch.WORK_PATTERN_NAME = NAT.WORK_PATTERN_NAME;
        $scope.WrkPtnSearch.ACTIVE = NAT.ACTIVE == true ? 1 : 0;
        $scope.WrkPtnSearch.WORK_PATTERN_DESC = NAT.WORK_PATTERN_DESC;
        $scope.WrkPtnSearch.WORK_PATTERN_CODE = NAT.WORK_PATTERN_CODE;
        $scope.WrkPtnSearch.WORK_PATTERN_TYPE_ID = NAT.WORK_PATTERN_TYPE_ID;
        $scope.WrkPtnSearch.CUSTOMER_ID = NAT.CUSTOMER_ID;
        $scope.WrkPtnSearch.ENTITY_ID = NAT.ENTITY_ID;
        $scope.WrkPtnSearch.AVG_DAILY_HOURS = NAT.AVG_DAILY_HOURS;
        $scope.WrkPtnSearch.AVG_WEEKLY_HOURS = NAT.AVG_WEEKLY_HOURS;
        $scope.WrkPtnSearch.AVG_MONTHLY_HOURS = NAT.AVG_MONTHLY_HOURS;
        $scope.WrkPtnSearch.AVG_YEARLY_HOURS = NAT.AVG_YEARLY_HOURS;
        $scope.WrkPtnSearch.ACTIVE = NAT.ACTIVE == 1 ? true : false;

        $scope.WrkPtnSearch.AVG_DAILY_HOURS_TEXT = NAT.AVG_DAILY_HOURS;
        $scope.WrkPtnSearch.AVG_WEEKLY_HOURS_TEXT = NAT.AVG_WEEKLY_HOURS;
        $scope.WrkPtnSearch.AVG_MONTHLY_HOURS_TEXT = NAT.AVG_MONTHLY_HOURS;
        $scope.WrkPtnSearch.AVG_YEARLY_HOURS_TEXT = NAT.AVG_YEARLY_HOURS;
        $scope.WrkPtnSearch.SHIFT_COUNT_TEXT = NAT.NO_OF_SHIFTS_PER_WEEK;

        $scope.GET_ENTITY_LIST();
        $scope.HR_GET_SHIFTS();
        // $scope.SELECT_SHIFT_TYPES()
    };
    if ($scope.Wrk_ID > 0) {
        $scope.WrkPtnSearch.WORK_PATTERN_ID = $scope.Wrk_ID;
        $scope.ADMIN_GET_WORK_PATTERN_BY_ID();
    }
    else {
        $scope.ADMIN_GET_WORK_PATTERN();
    }
    $scope.FILTERBYSHIFT = function (CL) {
        return (CL.SHIFT != undefined && CL.SHIFT != null);
    };

    $scope.SELECT_SHIFT_TYPES = function () {
        $scope.HR_GET_SHIFTS();
        var Noofshift = 0;
        if ($scope.WrkPtnSearch.WORK_PATTERN_TYPE_ID == 1) {
            Noofshift = 7;
        }
        if ($scope.WrkPtnSearch.WORK_PATTERN_TYPE_ID == 2) {
            Noofshift = 14;
        }
        if ($scope.WrkPtnSearch.WORK_PATTERN_TYPE_ID == 3) {
            Noofshift = 31;
        }
        $scope.SHIFT_LIST = [];
        for (var i = 0; i < Noofshift; i++) {
            var List = { DAY_NO: i + 1, SHIFT_ID: null, START_TIME: "", END_TIME: "", PAID_BREAK: "", UN_PAID_BREAK: "" };
            $scope.SHIFT_LIST.push(List);
        }
        $scope.WrkPtnSearch.AVG_DAILY_HOURS_TEXT = null;
        $scope.WrkPtnSearch.AVG_WEEKLY_HOURS_TEXT = null;
        $scope.WrkPtnSearch.AVG_MONTHLY_HOURS_TEXT = null;
        $scope.WrkPtnSearch.AVG_YEARLY_HOURS_TEXT = null;
        $scope.WrkPtnSearch.SHIFT_COUNT_TEXT = null;
    };
    $scope.NG_SHIFT_CHANGES = function (List, SHIFT) {
        if (SHIFT != undefined && SHIFT != null) {
            List.SHIFT_ID = SHIFT.SHIFT_ID;
            List.START_TIME = SHIFT.START_TIME;
            List.END_TIME = SHIFT.END_TIME;
            List.PAID_BREAK = SHIFT.PAID_BREAK;
            List.UN_PAID_BREAK = SHIFT.UN_PAID_BREAK;
            let SHIFT_DURATION_CALCULATION = $scope.CALCULATE_DURATION(SHIFT.END_TIME, SHIFT.START_TIME, SHIFT.UN_PAID_BREAK);
            List.DURATION = SHIFT_DURATION_CALCULATION;//SHIFT.DURATION;
        }
        else {
            List.START_TIME = null;
            List.END_TIME = null;
            List.PAID_BREAK = null;
            List.UN_PAID_BREAK = null;
            List.DURATION = null;
            List.SHIFT_ID = null;
        }
    };
    $scope.HR_INS_UPD_WORK_PATTERNS = function () {
        $scope.WrkForm.submitted = true;
        if ($scope.WrkForm.$valid) {
            //if ($scope.WrkPtnSearch.ACTIVE != -1) {
            var ModelObj = new Object();
            ModelObj.WORK_PATTERN_ID = $scope.WrkPtnSearch.WORK_PATTERN_ID == null ? 0 : $scope.WrkPtnSearch.WORK_PATTERN_ID;
            ModelObj.WORK_PATTERN_TYPE_ID = $scope.WrkPtnSearch.WORK_PATTERN_TYPE_ID;
            ModelObj.CUSTOMER_ID = $scope.WrkPtnSearch.CUSTOMER_ID;
            ModelObj.ENTITY_ID = $scope.WrkPtnSearch.ENTITY_ID;
            ModelObj.WORK_PATTERN_CODE = $scope.WrkPtnSearch.WORK_PATTERN_CODE;
            ModelObj.WORK_PATTERN_NAME = $scope.WrkPtnSearch.WORK_PATTERN_NAME;
            ModelObj.WORK_PATTERN_DESC = $scope.WrkPtnSearch.WORK_PATTERN_DESC;
            ModelObj.AVG_DAILY_HOURS = $scope.WrkPtnSearch.AVG_DAILY_HOURS_TEXT;
            ModelObj.AVG_WEEKLY_HOURS = $scope.WrkPtnSearch.AVG_WEEKLY_HOURS_TEXT;
            ModelObj.AVG_MONTHLY_HOURS = $scope.WrkPtnSearch.AVG_MONTHLY_HOURS_TEXT;
            ModelObj.AVG_YEARLY_HOURS = $scope.WrkPtnSearch.AVG_YEARLY_HOURS_TEXT;
            ModelObj.NO_OF_SHIFTS_PER_WEEK = $scope.WrkPtnSearch.SHIFT_COUNT_TEXT;
            ModelObj.ACTIVE = $scope.WrkPtnSearch.ACTIVE == -1 ? $scope.WrkPtnSearch.ACTIVE = 0 : ($scope.WrkPtnSearch.ACTIVE == true ? $scope.WrkPtnSearch.ACTIVE = 1 : $scope.WrkPtnSearch.ACTIVE = 0);
            ModelObj.USER_ID = parseInt($cookies.get("USERID"));
            if ($scope.SHIFT_LIST.length > 0) {
                angular.forEach($scope.SHIFT_LIST, function (item) {
                    if (item.SHIFT_ID != null) {
                        if (item.PAID_BREAK == "" || item.PAID_BREAK == null || item.PAID_BREAK == 0) {
                            item.PAID_BREAK = 0;
                        }
                        else
                            item.PAID_BREAK = parseFloat(item.PAID_BREAK);

                        if (item.UN_PAID_BREAK == "" || item.UN_PAID_BREAK == null || item.UN_PAID_BREAK == 0) {
                            item.UN_PAID_BREAK = 0;
                        }
                        else
                            item.UN_PAID_BREAK = parseFloat(item.UN_PAID_BREAK);
                    }
                });

                ModelObj.HR_SHIFT_SCHEDULE_DTLS = angular.copy($scope.SHIFT_LIST);
                ModelObj.HR_SHIFT_SCHEDULE_DTLS.forEach(function (v) {
                    delete v.SHIFT; delete v.START_TIME; delete v.END_TIME; delete v.DURATION;
                    delete v.WORK_PATTERN_NAME; delete v.WORK_PATTERN_ID; delete v.WORK_PATTERN_DESC; delete v.WORK_PATTERN_CODE;
                    delete v.SHIFT_CODE; delete v.SHIFT_SCHEDULE_ID; delete v.SHIFT_TITLE; delete v.START_TIME; delete v.ACTIVE;
                });
            }
            PrcCommMethods.HR_API(ModelObj, 'HR_INS_UPD_WORK_PATTERNS').then(function (data) {
                $scope.$parent.ShowAlert('Success', 'Work Patterns Added Successfully', 5000);
                window.location.href = '../MAIN/Admin#!/WorkPatternList';
            });
            //}
            //else { $scope.$parent.ShowAlert('Attention', 'Please Select Active/In-Active Option.', 3000); $scope.WrkForm.submitted = false; }

        }
        angular.element('input.ng-invalid').first().focus(); angular.element('select.ng-invalid').first().focus();
    };
    $scope.GET_ENTITY_LIST = function () {
        if ($scope.WrkPtnSearch.CUSTOMER_ID != undefined) {
            var CusModelObj = new Object();
            CusModelObj.CUSTOMER_ID = $scope.WrkPtnSearch.CUSTOMER_ID;
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
        }
        else { $scope.ENTITY_LIST = []; }
    };
    $scope.ADMIN_GET_CUSTOMER = function () {
        var UnitModelObj = new Object();
        UnitModelObj.CUSTOMER_NAME = '';
        UnitModelObj.CUSTOMER_CODE = '';
        UnitModelObj.ACTIVE = 1;
        UnitModelObj.PAGE_NO = 1;
        UnitModelObj.PAGE_SIZE = 1000;//$scope.CustomerSearch.PAGE_SIZE;
        UnitModelObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(UnitModelObj, 'ADMIN_GET_CUSTOMER').then(function (data) {
            $scope.CUSTOMER_LIST = data.data.Table;
        });
    };
    $scope.ADMIN_GET_CUSTOMER();
    $scope.CREATE_WORKPATTERN_CLICK = function () {
        $location.path('WorkPattern').search('STAG', 2);
    };
    $scope.ADMIN_GET_ENTITY_SETTINGS = function () {
        if ($scope.WrkPtnSearch.ENTITY_ID != undefined) {
            EntSettingModelObj = new Object();
            EntSettingModelObj.ENTITY_ID = $scope.WrkPtnSearch.ENTITY_ID;
            EntSettingModelObj.SETTING_ID = 3;//set 3 for get value form DB for no. of working per week
            PrcCommMethods.ADMIN_API(EntSettingModelObj, 'ADMIN_GET_ENTITY_SETTINGS').then(function (data) {
                $scope.ENTITY_SETTING = data.data.Table;
                $scope.WORKING_DAY_SETTING = $scope.ENTITY_SETTING[0]["SETTING_VALUE"];
            });
        }
    };
    $scope.CALCULATE_DURATION = function (EndTime, StartTime, UN_PAID_BREAK) {

        var ST = StartTime.split(':');

        var ET = EndTime.split(':');
        var START_DATE_MIN = new Date();
        var END_DATE_MIN = new Date();
        START_DATE_MIN.setHours(parseInt(ST[0] == '' ? 0 : ST[0]));
        START_DATE_MIN.setMinutes(parseInt(ST[1] == '' ? 0 : ST[1]));
        START_DATE_MIN.setSeconds(parseInt(ST[2] == '' ? 0 : ST[2]));

        END_DATE_MIN.setHours(parseInt(ET[0] == '' ? 0 : ET[0]));
        END_DATE_MIN.setMinutes(parseInt(ET[1] == '' ? 0 : ET[1]));
        END_DATE_MIN.setSeconds(parseInt(ET[2] == '' ? 0 : ET[2]));
        var UN_PAID_BREAK_MIN = UN_PAID_BREAK == undefined || UN_PAID_BREAK == undefined == null ? UN_PAID_BREAK = 0 : UN_PAID_BREAK;

        if (moment(START_DATE_MIN) > moment(END_DATE_MIN)) {
            END_DATE_MIN.setDate(END_DATE_MIN.getDate() + 1);
        }
        var ms = moment(END_DATE_MIN, "DD/MM/YYYY HH:mm:ss").diff(moment(START_DATE_MIN, "DD/MM/YYYY HH:mm:ss"));
        var diffDuration = moment.duration(ms);

        return ((diffDuration / 3600000) * 60);//(($scope.EndTime - $scope.StartTime) / 3600000) * 60;
    };
});
app.controller('NoticePeriodController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.$parent.PAGE_HEADER = "Notice Period";
    $scope.$parent.urlpath = "NoticePeriod";
    $scope.GRP_ID = getUrlParameter('ID', $location.absUrl());
    $scope.NOTICE_PERIOD_LIST = [];
    $scope.CUSTOMER_LIST = [];
    $scope.ENTITY_LIST = [];
    $scope.NoticePeriodSearch = {
        NOTICE_PERIOD_ID: null,
        NOTICE_PERIOD_NAME: "",
        ACTIVE: -1,
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        NO_OF_DAYS: null, CUSTOMER_ID: null

    };
    $scope.RESET_NOTICE = function () {
        $scope.NoticePeriodSearch = {
            NOTICE_PERIOD_ID: null, CUSTOMER_ID: null,
            NOTICE_PERIOD_NAME: "",
            ACTIVE: -1,
            PAGE_NO: 1,
            PAGE_SIZE: 10, CUSTOMER_ID: null, NO_OF_DAYS: null
        };
        $scope.NoticePeriodForm.submitted = false; $scope.ENTITY_LIST = [];
        $scope.NOTICE_PERIOD_LIST = [];
        $scope.ADMIN_GET_NOTICE_PERIOD(2);
    };
    $scope.ADMIN_GET_NOTICE_PERIOD = function (FLAG) {
        var CONModelObj = new Object();
        if (FLAG == 1) {
            $scope.NoticePeriodSearch.CLICK_SEARCH = 1;
            $scope.NOTICE_PERIOD_LIST = [];
            $scope.NoticePeriodSearch.PAGE_NO = 1;
            CONModelObj.ACTIVE = $scope.NoticePeriodSearch.ACTIVE == -1 ? -1 : $scope.NoticePeriodSearch.ACTIVE ? 1 : 0;
        }
        else if (FLAG == 2) {
            $scope.NOTICE_PERIOD_LIST = [];
            $scope.NoticePeriodSearch.PAGE_NO = 1;
            CONModelObj.ACTIVE = $scope.NoticePeriodSearch.ACTIVE == -1 ? -1 : $scope.NoticePeriodSearch.ACTIVE ? 1 : 0;
        }
        else if (FLAG == undefined) {
            if ($scope.NoticePeriodSearch.CLICK_SEARCH == 1)
                CONModelObj.ACTIVE = $scope.NoticePeriodSearch.ACTIVE == -1 ? -1 : $scope.NoticePeriodSearch.ACTIVE ? 1 : 0;
            else
                CONModelObj.ACTIVE = -1;
        }
        CONModelObj.CUSTOMER_ID = $scope.NoticePeriodSearch.CLICK_SEARCH == 1 ? $scope.NoticePeriodSearch.CUSTOMER_ID : null;
        CONModelObj.ENTITY_ID = null;//$scope.NoticePeriodSearch.ENTITY_ID;
        CONModelObj.NOTICE_PERIOD_NAME = $scope.NoticePeriodSearch.CLICK_SEARCH == 1 ? $scope.NoticePeriodSearch.NOTICE_PERIOD_NAME : '';
        //CONModelObj.ACTIVE = -1;
        CONModelObj.PAGE_NO = $scope.NoticePeriodSearch.PAGE_NO;
        CONModelObj.PAGE_SIZE = $scope.NoticePeriodSearch.PAGE_SIZE;
        //CONModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.ADMIN_API(CONModelObj, 'ADMIN_GET_NOTICE_PERIOD').then(function (data) {
            //$scope.NOTICE_PERIOD_LIST = data.data.Table;
            if (data.data.Table.length > 0) {
                $scope.NOTICE_PERIOD_LIST = $scope.NOTICE_PERIOD_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.NoticePeriodSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.NoticePeriodSearch.PAGE_NO = parseInt($scope.NoticePeriodSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else {
                $scope.GetData = false;
                $scope.NOTICE_PERIOD_LIST = [];
            }
        });
    };
    $scope.ADMIN_GET_NOTICE_PERIOD();
    $scope.HR_INS_UPD_NOTICE_PERIOD = function () {
        $scope.NoticePeriodForm.submitted = true;
        if ($scope.NoticePeriodForm.$valid) {
            if ($scope.NoticePeriodSearch.ACTIVE != -1) {
                var NatioModelObj = new Object();
                NatioModelObj.CUSTOMER_ID = $scope.NoticePeriodSearch.CUSTOMER_ID;
                NatioModelObj.NOTICE_PERIOD_ID = $scope.NoticePeriodSearch.NOTICE_PERIOD_ID;
                NatioModelObj.NOTICE_PERIOD_NAME = $scope.NoticePeriodSearch.NOTICE_PERIOD_NAME;
                NatioModelObj.ACTIVE = $scope.NoticePeriodSearch.ACTIVE ? 1 : 0;
                NatioModelObj.USER_ID = parseInt($cookies.get("USERID"));
                NatioModelObj.ENTITY_ID = null;//$scope.NoticePeriodSearch.ENTITY_ID;
                NatioModelObj.NO_OF_DAYS = $scope.NoticePeriodSearch.NO_OF_DAYS;//$scope.NoticePeriodSearch.ENTITY_ID;
                PrcCommMethods.ADMIN_API(NatioModelObj, 'HR_INS_UPD_NOTICE_PERIOD').then(function (data) {
                    $scope.$parent.ShowAlert("Success", "Save Successfully", 3000);
                    $scope.RESET_NOTICE();
                });
            }
            else { $scope.$parent.ShowAlert('Attention', 'Please Select Active/In-Active Option.', 3000); $scope.NoticePeriodSearch.submitted = false; }
        }
    };
    $scope.EDIT_INS_UPD_NOTICEPERIOD = function (NAT) {
        $scope.NoticePeriodSearch.NOTICE_PERIOD_ID = NAT.NOTICE_PERIOD_ID;
        $scope.NoticePeriodSearch.NOTICE_PERIOD_NAME = NAT.NOTICE_PERIOD_NAME;
        $scope.NoticePeriodSearch.NO_OF_DAYS = NAT.NO_OF_DAYS;
        $scope.NoticePeriodSearch.ACTIVE = NAT.ACTIVE == true ? 1 : 0;
        $scope.NoticePeriodSearch.CUSTOMER_ID = NAT.CUSTOMER_ID;
        $scope.NoticePeriodSearch.ENTITY_ID = NAT.ENTITY_ID;
        $scope.GET_ENTITY_LIST();
    };
    $scope.DELETE_INS_UPD_UNITS = function (NAT) {
        if (confirm('Are you sure?')) {
            var NatioModelObj = new Object();
            NatioModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
            NatioModelObj.UNITS_ID = NAT.UNITS_ID;
            NatioModelObj.ACTIVE = 2;
            NatioModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.ADMIN_API(NatioModelObj, 'ADMIN_INS_UPD_UNITS').then(function (data) {
                $scope.$parent.ShowAlert("Success", "Inactive Successfully", 3000);
                $scope.RESET_NOTICE();
                $scope.ADMIN_GET_NOTICE_PERIOD();
            });
        }
    };
    $scope.GET_ENTITY_LIST = function () {
        if ($scope.NoticePeriodSearch.CUSTOMER_ID != undefined) {
            var CusModelObj = new Object();
            CusModelObj.CUSTOMER_ID = $scope.NoticePeriodSearch.CUSTOMER_ID;
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
        }
        else { $scope.ENTITY_LIST = []; }
    };
    $scope.ADMIN_GET_CUSTOMER = function () {
        var UnitModelObj = new Object();
        UnitModelObj.CUSTOMER_NAME = '';
        UnitModelObj.CUSTOMER_CODE = '';
        UnitModelObj.ACTIVE = 1;
        UnitModelObj.PAGE_NO = 1;
        UnitModelObj.PAGE_SIZE = 1000;//$scope.CustomerSearch.PAGE_SIZE;
        UnitModelObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(UnitModelObj, 'ADMIN_GET_CUSTOMER').then(function (data) {
            $scope.CUSTOMER_LIST = data.data.Table;
        });
    };
    $scope.ADMIN_GET_CUSTOMER();
    $scope.LAZY_ADMIN_GET_NOTICE_PERIOD = function () {
        $scope.ADMIN_GET_NOTICE_PERIOD();
    };
});
app.controller('CourceController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.$parent.PAGE_HEADER = "Course Name";
    $scope.$parent.urlpath = "Cource";
    $scope.GRP_ID = getUrlParameter('ID', $location.absUrl());
    $scope.COURSE_LIST = [];
    $scope.CUSTOMER_LIST = [];
    $scope.ENTITY_LIST = [];
    $scope.CourceSearch = {
        CUSTOMER_ID: null, ENTITY_ID: null,
        COURSE_ID: "",
        COURSE_NAME: '',
        ACTIVE: -1,
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        CLICK_SEARCH: null
    };
    $scope.RESET_COURCE = function () {
        $scope.CourceSearch = {
            CUSTOMER_ID: null, ENTITY_ID: null,
            COURSE_ID: "",
            COURSE_NAME: '',
            ACTIVE: -1,
            PAGE_NO: 1,
            PAGE_SIZE: 10,
            CLICK_SEARCH: null
        };
        $scope.CourceForm.submitted = false; $scope.ENTITY_LIST = [];
        $scope.COURSE_LIST = [];
        $scope.ADMIN_GET_HR_COURSE_MASTER(2);
    };
    $scope.LAZY_ADMIN_GET_HR_COURSE_MASTER = function () { $scope.ADMIN_GET_HR_COURSE_MASTER(); };
    $scope.ADMIN_GET_HR_COURSE_MASTER = function (FLAG) {
        var CONModelObj = new Object();
        if (FLAG == 1) {
            $scope.CourceSearch.CLICK_SEARCH = 1;
            $scope.COURSE_LIST = [];
            $scope.CourceSearch.PAGE_NO = 1;
            CONModelObj.ACTIVE = $scope.CourceSearch.ACTIVE == -1 ? -1 : $scope.CourceSearch.ACTIVE ? 1 : 0;
        }
        else if (FLAG == 2) {
            $scope.COURSE_LIST = [];
            CONModelObj.ACTIVE = $scope.CourceSearch.ACTIVE == -1 ? -1 : $scope.CourceSearch.ACTIVE ? 1 : 0;
            $scope.CourceSearch.PAGE_NO = 1;
        }
        else if (FLAG == undefined) {
            if ($scope.CourceSearch.CLICK_SEARCH == 1)
                CONModelObj.ACTIVE = $scope.CourceSearch.ACTIVE == -1 ? -1 : $scope.CourceSearch.ACTIVE ? 1 : 0;
            else {
                CONModelObj.ACTIVE = -1;
            }
        }
        CONModelObj.CUSTOMER_ID = $scope.CourceSearch.CLICK_SEARCH == 1 ? $scope.CourceSearch.CUSTOMER_ID : null;
        CONModelObj.ENTITY_ID = $scope.CourceSearch.CLICK_SEARCH == 1 ? $scope.CourceSearch.ENTITY_ID : null;
        CONModelObj.COURSE_ID = $scope.CourceSearch.CLICK_SEARCH == 1 ? $scope.CourceSearch.COURSE_ID : null;
        CONModelObj.COURSE_NAME = $scope.CourceSearch.CLICK_SEARCH == 1 ? $scope.CourceSearch.COURSE_NAME : '';
        //CONModelObj.ACTIVE = -1;
        CONModelObj.PAGE_NO = $scope.CourceSearch.PAGE_NO;
        CONModelObj.PAGE_SIZE = $scope.CourceSearch.PAGE_SIZE;
        CONModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.ADMIN_API(CONModelObj, 'ADMIN_GET_HR_COURSE_MASTER').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.COURSE_LIST = $scope.COURSE_LIST.concat(data.data.Table);//$scope.ABSENCE_TYPE_LIST.concat
                if (data.data.Table.length < $scope.CourceSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.CourceSearch.PAGE_NO = parseInt($scope.CourceSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else {
                if ($scope.COURSE_LIST.length == 0) {
                    $scope.COURSE_LIST = [];
                }
                $scope.GetData = false;
            }
        });
    }
    $scope.ADMIN_GET_HR_COURSE_MASTER();

    $scope.HR_INS_UPD_COURSE_MASTER = function () {
        $scope.CourceForm.submitted = true;
        if ($scope.CourceForm.$valid) {
            if ($scope.CourceSearch.ACTIVE != -1) {
                var NatioModelObj = new Object();
                NatioModelObj.CUSTOMER_ID = $scope.CourceSearch.CUSTOMER_ID;
                NatioModelObj.COURSE_MASTER_ID = $scope.CourceSearch.COURSE_MASTER_ID;
                NatioModelObj.COURSE_NAME = $scope.CourceSearch.COURSE_NAME;
                NatioModelObj.ACTIVE = $scope.CourceSearch.ACTIVE ? 1 : 0;
                NatioModelObj.USER_ID = parseInt($cookies.get("USERID"));
                NatioModelObj.ENTITY_ID = $scope.CourceSearch.ENTITY_ID;
                PrcCommMethods.HR_API(NatioModelObj, 'HR_INS_UPD_COURSE_MASTER').then(function (data) {
                    $scope.$parent.ShowAlert("Success", "Save Successfully", 3000);
                    $scope.RESET_COURCE();
                });
            }
            else { $scope.$parent.ShowAlert('Attention', 'Please Select Active/In-Active Option.', 3000); $scope.CourceForm.submitted = false; }
        }
    }
    $scope.EDIT_INS_UPD_COURSE_MASTER = function (NAT) {
        $scope.CourceSearch.COURSE_MASTER_ID = NAT.COURSE_ID;
        $scope.CourceSearch.COURSE_NAME = NAT.COURSE_NAME;
        $scope.CourceSearch.ACTIVE = NAT.ACTIVE == true ? 1 : 0;
        $scope.CourceSearch.CUSTOMER_ID = NAT.CUSTOMER_ID;
        $scope.CourceSearch.ENTITY_ID = NAT.ENTITY_ID;
        $scope.GET_ENTITY_LIST();
    }
    $scope.DELETE_INS_UPD_UNITS = function (NAT) {
        if (confirm('Are you sure?')) {
            var NatioModelObj = new Object();
            NatioModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
            NatioModelObj.UNITS_ID = NAT.UNITS_ID;
            NatioModelObj.ACTIVE = 2;
            NatioModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.ADMIN_API(NatioModelObj, 'ADMIN_INS_UPD_UNITS').then(function (data) {
                $scope.$parent.ShowAlert("Success", "Inactive Successfully", 3000);
                $scope.RESET_NOTICE();
                $scope.ADMIN_GET_NOTICE_PERIOD();
            });
        }
    }
    $scope.GET_ENTITY_LIST = function () {
        if ($scope.CourceSearch.CUSTOMER_ID != undefined) {
            var CusModelObj = new Object();
            CusModelObj.CUSTOMER_ID = $scope.CourceSearch.CUSTOMER_ID;
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
        }
        else { $scope.ENTITY_LIST = []; }
    };
    $scope.ADMIN_GET_CUSTOMER = function () {
        var UnitModelObj = new Object();
        UnitModelObj.CUSTOMER_NAME = '';
        UnitModelObj.CUSTOMER_CODE = '';
        UnitModelObj.ACTIVE = 1;
        UnitModelObj.PAGE_NO = 1;
        UnitModelObj.PAGE_SIZE = 1000;//$scope.CustomerSearch.PAGE_SIZE;
        UnitModelObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(UnitModelObj, 'ADMIN_GET_CUSTOMER').then(function (data) {
            $scope.CUSTOMER_LIST = data.data.Table;
        });
    };
    $scope.ADMIN_GET_CUSTOMER();
});
app.controller('HolidayEntitlementController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.$parent.PAGE_HEADER = "Leave Entitlement";
    $scope.$parent.urlpath = "HolidayEntitlement";
    $scope.GRP_ID = getUrlParameter('ID', $location.absUrl());
    $scope.HOLIDAYENTITLEMENT_LIST = [];
    $scope.CUSTOMER_LIST = [];
    $scope.ENTITY_LIST = [];
    $scope.ABSENCE_TYPE_LIST = [];
    var HolEntitlObj;
    $scope.EDIT_FLAG = false;

    $scope.CALCULATION_LIST = [{
        CALCULATION_ID: 1,
        CALCULATION_NAME: 'Calendar Day'
    }, {
        CALCULATION_ID: 2,
        CALCULATION_NAME: 'Working Day'
    }, {
        CALCULATION_ID: 3,
        CALCULATION_NAME: '260 Day'
    }, {
        CALCULATION_ID: 4,
        CALCULATION_NAME: 'Not Applicable'
    }];
    $scope.ENTITLEMENT_LIST = [{
        ENTITLEMENT_ID: 1,
        ENTITLEMENT_NAME: 'Days'
    }, {
        ENTITLEMENT_ID: 2,
        ENTITLEMENT_NAME: 'Hours'
    }, {
        ENTITLEMENT_ID: 3,
        ENTITLEMENT_NAME: 'Shift'
    }];
    $scope.ACCRUAL_METHOD_LIST = [{
        ACCRUAL_METHOD_ID: 1,
        ACCRUAL_METHOD_NAME: 'Daily'
    }, {
        ACCRUAL_METHOD_ID: 2,
        ACCRUAL_METHOD_NAME: 'Weekly'
    }, {
        ACCRUAL_METHOD_ID: 3,
        ACCRUAL_METHOD_NAME: 'Monthly'
    }, {
        ACCRUAL_METHOD_ID: 4,
        ACCRUAL_METHOD_NAME: 'ALL AT ONCE'
    }];
    $scope.years = [];
    $scope.LEAVE_ENT_YEAR = function () {
        $scope.LEAVE_ENT_YEAR_LIST = [];
        $scope.YEAR = new Date().getFullYear() - 1;
        for (var i = 0; i < 10; i++) {
            $scope.YEAR_ARR =
                {
                    ID: i,
                    YEAR: $scope.YEAR + i,
                };
            $scope.LEAVE_ENT_YEAR_LIST.push($scope.YEAR_ARR);
        }
    };
    $scope.LEAVE_ENT_YEAR();

    $scope.HolidayEntitlementSearch = {
        CUSTOMER_ID: null,
        COURSE_ID: "",
        COURSE_NAME: '',
        ACTIVE: -1,
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        ENTITLEMENT_REQUIRED: -1,
        EMPLOYEE: -1,
        MANAGER: -1,
        ENTITY_ID: null,
        CLICK_SEARCH: null,
        IS_PAID: false

    };
    $scope.RESET_HOLIDAY_ENTITLEMENT = function () {
        $scope.HolidayEntitlementSearch = {
            CUSTOMER_ID: null, ENTITY_ID: null,
            COURSE_ID: "",
            COURSE_NAME: '',
            ACTIVE: -1,
            PAGE_NO: 1,
            PAGE_SIZE: 10,
            CUSTOMER_ID: null,
            ENTITLEMENT_REQUIRED: -1,
            EMPLOYEE: -1,
            MANAGER: -1,
            CLICK_SEARCH: null,
            IS_PAID: false
        };
        $scope.EDIT_FLAG = false;
        $scope.HolidayForm.submitted = false; $scope.ENTITY_LIST = [];
        $scope.HOLIDAY_ENTITLEMENT_ID = null;
        $scope.ADMIN_GET_HOLIDAY_ENTITLEMENT_MASTER(2);
    }
    $scope.ADMIN_GET_HOLIDAY_ENTITLEMENT_MASTER = function (FLAG) {
        HolEntitlObj = new Object();
        if (FLAG == 1) {
            $scope.HolidayEntitlementSearch.CLICK_SEARCH = 1;
            $scope.HOLIDAYENTITLEMENT_LIST = [];
            $scope.HolidayEntitlementSearch.PAGE_NO = 1;
            HolEntitlObj.ACTIVE = $scope.HolidayEntitlementSearch.ACTIVE == -1 ? -1 : $scope.HolidayEntitlementSearch.ACTIVE ? 1 : 0;
        }
        else if (FLAG == 2) {
            $scope.HOLIDAYENTITLEMENT_LIST = [];
            HolEntitlObj.ACTIVE = -1;
            $scope.HolidayEntitlementSearch.PAGE_NO = 1;
        }
        else if (FLAG == undefined) {
            if ($scope.HolidayEntitlementSearch.CLICK_SEARCH == 1)
                HolEntitlObj.ACTIVE = $scope.HolidayEntitlementSearch.ACTIVE == -1 ? -1 : $scope.HolidayEntitlementSearch.ACTIVE ? 1 : 0;
            else {
                HolEntitlObj.ACTIVE = -1;
            }
        }
        HolEntitlObj.CUSTOMER_ID = $scope.HolidayEntitlementSearch.CLICK_SEARCH == 1 ? $scope.HolidayEntitlementSearch.CUSTOMER_ID : null;
        HolEntitlObj.ENTITY_ID = $scope.HolidayEntitlementSearch.CLICK_SEARCH == 1 ? $scope.HolidayEntitlementSearch.ENTITY_ID : null;
        //CONModelObj.COURSE_ID = $scope.HolidayEntitlementSearch.COURSE_ID;
        HolEntitlObj.HOLIDAY_ENTITLEMENT_NAME = $scope.HolidayEntitlementSearch.CLICK_SEARCH == 1 ? $scope.HolidayEntitlementSearch.HOLIDAY_ENTITLEMENT_NAME : '';
        //HolEntitlObj.ACTIVE = -1;
        //HolEntitlObj.ACTIVE = $scope.HolidayEntitlementSearch.ACTIVE == -1 ? -1 : $scope.HolidayEntitlementSearch.ACTIVE ? 1 : 0;
        HolEntitlObj.PAGE_NO = $scope.HolidayEntitlementSearch.PAGE_NO;
        HolEntitlObj.PAGE_SIZE = $scope.HolidayEntitlementSearch.PAGE_SIZE;
        HolEntitlObj.ACCRUAL_METHOD = $scope.HolidayEntitlementSearch.ENTITLEMENT_REQUIRED == -1 ? -1 : ($scope.HolidayEntitlementSearch.ENTITLEMENT_REQUIRED == false ? -1 : $scope.HolidayEntitlementSearch.ACCRUAL_METHOD);
        HolEntitlObj.USER_ID = parseInt($cookies.get("USERID"));
        if ($scope.HolidayEntitlementSearch.MANAGER == -1 && $scope.HolidayEntitlementSearch.EMPLOYEE == -1 && $scope.HolidayEntitlementSearch.ENTITLEMENT_REQUIRED == -1) {
            HolEntitlObj.MANAGER = -1;
            HolEntitlObj.EMPLOYEE = -1;
            HolEntitlObj.ENTITLEMENT_REQUIRED = -1;
        }
        else {
            HolEntitlObj.MANAGER = $scope.HolidayEntitlementSearch.MANAGER == -1 ? -1 : $scope.HolidayEntitlementSearch.MANAGER == true ? 1 : 0;
            HolEntitlObj.EMPLOYEE = $scope.HolidayEntitlementSearch.EMPLOYEE == -1 ? -1 : $scope.HolidayEntitlementSearch.EMPLOYEE == true ? 1 : 0;
            HolEntitlObj.ENTITLEMENT_REQUIRED = $scope.HolidayEntitlementSearch.ENTITLEMENT_REQUIRED == -1 ? -1 : $scope.HolidayEntitlementSearch.ENTITLEMENT_REQUIRED == true ? 1 : 0;
        }
        HolEntitlObj.ABSENCE_TYPE_ID = $scope.HolidayEntitlementSearch.ABSENCE_TYPE_ID;
        HolEntitlObj.IS_PAID = $scope.HolidayEntitlementSearch.IS_PAID?1:0;
        PrcCommMethods.HR_API(HolEntitlObj, 'ADMIN_GET_HOLIDAY_ENTITLEMENT_MASTER').then(function (data) {

            if (data.data.Table.length > 0) {
                $scope.HOLIDAYENTITLEMENT_LIST = $scope.HOLIDAYENTITLEMENT_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.HolidayEntitlementSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.HolidayEntitlementSearch.PAGE_NO = parseInt($scope.HolidayEntitlementSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else {
                if ($scope.HOLIDAYENTITLEMENT_LIST.length == 0) {
                    $scope.HOLIDAYENTITLEMENT_LIST = [];
                }
                $scope.GetData = false;
            }

        });
    };
    $scope.ADMIN_GET_HOLIDAY_ENTITLEMENT_MASTER();
    $scope.ADMIN_INS_UPD_HOLIDAY_ENTITLEMENT_MASTER = function () {
        $scope.HolidayForm.submitted = true;
        if ($scope.HolidayForm.$valid) {
            if ($scope.HolidayEntitlementSearch.ACTIVE != -1) {
                if (($scope.HolidayEntitlementSearch.EMPLOYEE != false && $scope.HolidayEntitlementSearch.EMPLOYEE != -1) || ($scope.HolidayEntitlementSearch.MANAGER != false && $scope.HolidayEntitlementSearch.MANAGER != -1)) {
                    HolEntitlObj = new Object();
                    CONCATE_DATE = new Date($scope.HolidayEntitlementSearch.START_YEAR, $scope.HolidayEntitlementSearch.YEAR_START_MONTH - 1, $scope.HolidayEntitlementSearch.YEAR_START_DAY);
                    CONCATE_END_DATE = new Date($scope.HolidayEntitlementSearch.START_YEAR + 1, $scope.HolidayEntitlementSearch.YEAR_START_MONTH - 1, $scope.HolidayEntitlementSearch.YEAR_START_DAY - 1);
                    CONCATE_END_DATE.setHours(23);
                    CONCATE_END_DATE.setMinutes(59);
                    CONCATE_END_DATE.setSeconds(59);
                    $scope.HolidayEntitlementSearch.ACCRUAL_METHOD = $scope.ACCRUAL_METHOD_LIST.filter(function (x) {
                        return x.ACCRUAL_METHOD_ID == $scope.HolidayEntitlementSearch.ACCRUAL_METHOD
                    });
                    $scope.HolidayEntitlementSearch.ENTITILEMENT_UNIT = $scope.ENTITLEMENT_LIST.filter(function (x) {
                        return x.ENTITLEMENT_ID == $scope.HolidayEntitlementSearch.ENTITILEMENT_UNIT
                    });
                    HolEntitlObj.HOLIDAY_ENTITLEMENT_ID = $scope.HolidayEntitlementSearch.HOLIDAY_ENTITLEMENT_ID = null ? 0 : $scope.HOLIDAY_ENTITLEMENT_ID;;
                    HolEntitlObj.CUSTOMER_ID = $scope.HolidayEntitlementSearch.CUSTOMER_ID;
                    HolEntitlObj.HOLIDAY_ENTITLEMENT_NAME = $scope.HolidayEntitlementSearch.HOLIDAY_ENTITLEMENT_NAME;
                    HolEntitlObj.ACTIVE = $scope.HolidayEntitlementSearch.ACTIVE ? 1 : 0;
                    HolEntitlObj.USER_ID = parseInt($cookies.get("USERID"));
                    HolEntitlObj.ENTITY_ID = $scope.HolidayEntitlementSearch.ENTITY_ID;
                    HolEntitlObj.ABSENCE_TYPE_ID = $scope.HolidayEntitlementSearch.ABSENCE_TYPE_ID;
                    HolEntitlObj.ENTITLEMENT_UNIT_ID = $scope.HolidayEntitlementSearch.ENTITILEMENT_UNIT[0].ENTITLEMENT_ID;
                    HolEntitlObj.ENTITLEMENT_UNIT_NAME = $scope.HolidayEntitlementSearch.ENTITILEMENT_UNIT[0].ENTITLEMENT_NAME;
                    HolEntitlObj.DEFAULT_ENTITLEMENT_VALUE = $scope.HolidayEntitlementSearch.ENTITLEMENT_VALUE;
                    HolEntitlObj.YEAR_START_DATE = (new Date(CONCATE_DATE)).toDateString();
                    HolEntitlObj.YEAR_END_DATE = (new Date(CONCATE_END_DATE)).toDateString();
                    HolEntitlObj.CARRY_OVER = 0;//$scope.HolidayEntitlementSearch.CARRY_OVER == true ? 1 : 0;
                    HolEntitlObj.MANAGER = $scope.HolidayEntitlementSearch.MANAGER == -1 ? 0 : ($scope.HolidayEntitlementSearch.MANAGER == true ? 1 : 0);
                    HolEntitlObj.EMPLOYEE = $scope.HolidayEntitlementSearch.EMPLOYEE == -1 ? 0 : ($scope.HolidayEntitlementSearch.EMPLOYEE == true ? 1 : 0);
                    HolEntitlObj.ENTITLEMENT_REQUIRED = $scope.HolidayEntitlementSearch.ENTITLEMENT_REQUIRED ? 1 : 0;
                    HolEntitlObj.ACCRUAL_METHOD_ID = $scope.HolidayEntitlementSearch.ENTITLEMENT_REQUIRED == true ? $scope.HolidayEntitlementSearch.ACCRUAL_METHOD[0].ACCRUAL_METHOD_ID : 4;
                    HolEntitlObj.ACCRUAL_METHOD_NAME = $scope.HolidayEntitlementSearch.ENTITLEMENT_REQUIRED == true ? $scope.HolidayEntitlementSearch.ACCRUAL_METHOD[0].ACCRUAL_METHOD_NAME : 'ALL AT ONCE';
                    HolEntitlObj.MAX_ALLOWED_CARRY_OVER = 0; //$scope.HolidayEntitlementSearch.CARRY_OVER == true ? $scope.HolidayEntitlementSearch.MAX_ALLOWED_CARRY_OVER : 0;
                    HolEntitlObj.CARRY_OVER_VALIDITY_IN_MONTHS = null;
                    HolEntitlObj.IS_PAID = $scope.HolidayEntitlementSearch.IS_PAID ? 1 : 0;
                    PrcCommMethods.HR_API(HolEntitlObj, 'ADMIN_INS_UPD_HOLIDAY_ENTITLEMENT_MASTER').then(function (data) {
                        if (data.data == -1) {
                            $scope.$parent.ShowAlert("Attention", "Holiday entitlement is overlapping,please check.", 3000);
                        }
                        else {
                            $scope.$parent.ShowAlert("Success", "Save Successfully", 3000);
                            HolEntitlObj = null;
                            $scope.RESET_HOLIDAY_ENTITLEMENT();
                        }
                    });
                }
                else { $scope.$parent.ShowAlert('Attention', 'Please Select Manager/Employee For Holiday Entitlement.', 3000); }
            }
            else { $scope.$parent.ShowAlert('Attention', 'Please Select Active/In-Active Option.', 3000); }
        }
    };
    $scope.EDIT_INS_UPD_LEAVE_EN_MASTER = function (HOLENT) {
        $scope.EDIT_FLAG = true;
        $scope.ddMMyyyy = $filter('date')(HOLENT.YEAR_START_DATE, 'dd/MM/yyyy');
        $scope.HOLIDAY_ENTITLEMENT_ID = HOLENT.HOLIDAY_ENTITLEMENT_ID;
        $scope.HolidayEntitlementSearch.ABSENCE_TYPE_ID = HOLENT.ABSENCE_TYPE_ID;
        $scope.HolidayEntitlementSearch.CALCULATION_METHOD_ID = HOLENT.CALCULATION_METHOD_ID;
        $scope.HolidayEntitlementSearch.ENTITLEMENT_VALUE = HOLENT.DEFAULT_ENTITLEMENT_VALUE;
        $scope.HolidayEntitlementSearch.ENTITILEMENT_UNIT = HOLENT.ENTITLEMENT_UNIT_ID;
        $scope.HolidayEntitlementSearch.DEFAULT_ENTITLEMENT_VALUE = HOLENT.DEFAULT_ENTITLEMENT_VALUE;
        //$scope.HolidayEntitlementSearch.CALCULATION_METHOD_ID =  HOLENT.CALCULATION_METHOD_ID;
        $scope.HolidayEntitlementSearch.ACCRUAL_METHOD = HOLENT.ACCRUAL_METHOD_ID;
        $scope.HolidayEntitlementSearch.YEAR_START_DAY = parseInt($scope.ddMMyyyy.split('/')[0]).toString();
        $scope.HolidayEntitlementSearch.YEAR_START_MONTH = parseInt($scope.ddMMyyyy.split('/')[1]).toString();
        $scope.HolidayEntitlementSearch.START_YEAR = parseInt($scope.ddMMyyyy.split('/')[2].toString());
        $scope.HolidayEntitlementSearch.ACTIVE = HOLENT.ACTIVE == true ? 1 : 0;
        $scope.HolidayEntitlementSearch.CUSTOMER_ID = HOLENT.CUSTOMER_ID;
        $scope.HolidayEntitlementSearch.ENTITY_ID = HOLENT.ENTITY_ID;
        $scope.HolidayEntitlementSearch.CARRY_OVER = HOLENT.CARRY_OVER == 1 ? true : false;
        $scope.HolidayEntitlementSearch.MANAGER = HOLENT.MANAGER == 1 ? true : false;;
        $scope.HolidayEntitlementSearch.EMPLOYEE = HOLENT.EMP == 1 ? true : false;;
        $scope.HolidayEntitlementSearch.ENTITLEMENT_REQUIRED = HOLENT.ENTITLEMENT_REQUIRED == 1 ? true : false;
        $scope.HolidayEntitlementSearch.ENTITLEMENT_REQUIRED = HOLENT.ENTITLEMENT_REQUIRED == 1 ? true : false;
        $scope.HolidayEntitlementSearch.MAX_ALLOWED_CARRY_OVER = HOLENT.MAX_ALLOWED_CARRY_OVER;
        $scope.HolidayEntitlementSearch.CARRY_OVER_VALIDITY_IN_MONTHS = HOLENT.CARRY_OVER_VALIDITY_IN_MONTHS;
        $scope.HolidayEntitlementSearch.IS_PAID = HOLENT.IS_PAID;

        $scope.GET_ENTITY_LIST();
        $scope.ADMIN_GET_ABSENCE_TYPE();
    }
    $scope.DELETE_INS_UPD_UNITS = function (NAT) {
        if (confirm('Are you sure?')) {
            HolEntitlObj = new Object();
            HolEntitlObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
            HolEntitlObj.UNITS_ID = NAT.UNITS_ID;
            HolEntitlObj.ACTIVE = 2;
            HolEntitlObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.ADMIN_API(HolEntitlObj, 'ADMIN_INS_UPD_UNITS').then(function (data) {
                $scope.$parent.ShowAlert("Success", "Inactive Successfully", 3000);
                HolEntitlObj = null;
                $scope.RESET_NOTICE()
                $scope.ADMIN_GET_HOLIDAY_ENTITLEMENT_MASTER()
            });
        }
    }
    $scope.GET_ENTITY_LIST = function () {
        if ($scope.HolidayEntitlementSearch.CUSTOMER_ID != undefined) {
            HolEntitlObj = new Object();
            HolEntitlObj.CUSTOMER_ID = $scope.HolidayEntitlementSearch.CUSTOMER_ID;
            HolEntitlObj.ACTIVE = 1;
            HolEntitlObj.PAGE_NO = 0;
            HolEntitlObj.USER_ID = parseInt($cookies.get("USERID"));
            HolEntitlObj.IS_LIVE = -1;
            PrcCommMethods.ADMIN_API(HolEntitlObj, 'ADMIN_GET_ENTITIES').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.ENTITY_LIST = data.data.Table;
                    HolEntitlObj = null;
                }
                else { $scope.ENTITY_LIST = []; };
            });
        }
        else { $scope.ENTITY_LIST = []; };
    };
    $scope.ADMIN_GET_CUSTOMER = function () {
        HolEntitlObj = new Object();
        HolEntitlObj.CUSTOMER_NAME = '';
        HolEntitlObj.CUSTOMER_CODE = '';
        HolEntitlObj.ACTIVE = 1;
        HolEntitlObj.PAGE_NO = 1;
        HolEntitlObj.PAGE_SIZE = 1000;//$scope.CustomerSearch.PAGE_SIZE;
        HolEntitlObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(HolEntitlObj, 'ADMIN_GET_CUSTOMER').then(function (data) {
            $scope.CUSTOMER_LIST = data.data.Table;
            HolEntitlObj = null;
        });
    };
    $scope.ADMIN_GET_CUSTOMER();
    $scope.ADMIN_GET_ABSENCE_TYPE = function () {
        HolEntitlObj = new Object();
        HolEntitlObj.ACTIVE = 1;
        HolEntitlObj.PAGE_NO = 0;
        HolEntitlObj.USER_ID = parseInt($cookies.get("USERID"));
        HolEntitlObj.MANAGER = 0;
        HolEntitlObj.ENTITY_ID = null;
        //$scope.ADMIN_GET_ENTITY_SETTINGS_BY_ID();
        PrcCommMethods.ADMIN_API(HolEntitlObj, 'ADMIN_GET_ABSENCE_TYPE').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.ABSENCE_TYPE_LIST = data.data.Table;
                HolEntitlObj = null;
            }
            else { $scope.ABSENCE_TYPE_LIST = []; }
        });
    };
    $scope.ADMIN_GET_ENTITY_SETTINGS_BY_ID = function () {
        EntSettingModelObj = new Object();
        EntSettingModelObj.ENTITY_ID = $scope.HolidayEntitlementSearch.ENTITY_ID;
        EntSettingModelObj.SETTING_ID = 0;
        EntSettingModelObj.ACTIVE = 1;
        EntSettingModelObj.PAGE_NO = 1;
        EntSettingModelObj.PAGE_SIZE = 1000;//$scope.CustomerSearch.PAGE_SIZE;
        PrcCommMethods.ADMIN_API(EntSettingModelObj, 'ADMIN_GET_ENTITY_SETTINGS').then(function (data) {
            if (data.data.Table.length > 0) {
                var item = data.data.Table.filter(function (x) { return x.SETTING_ID == 14 });
                if (item.length > 0) {
                    temp = item[0].SETTING_VALUE.split(':;:');
                    $scope.HolidayEntitlementSearch.YEAR_START_DAY = (temp[0]);
                    $scope.HolidayEntitlementSearch.YEAR_START_MONTH = (temp[1]);
                }
            }
        });
    };
    $scope.ADMIN_GET_ABSENCE_TYPE();
    $scope.ENTITLEMENT_REQUIRED_FILTER = function (CALCULATION_LIST) {
        return CALCULATION_LIST.CALCULATION_ID != 4;
    };
    $scope.LAZY_ADMIN_GET_HOLIDAY_ENTITLEMENT_MASTER = function () { $scope.ADMIN_GET_HOLIDAY_ENTITLEMENT_MASTER(); };


});
app.controller('TerminationReasonController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.$parent.PAGE_HEADER = "Termination Reason";
    $scope.$parent.urlpath = "TerminationReason";
    $scope.GRP_ID = getUrlParameter('ID', $location.absUrl());
    $scope.TERMINATION_REASON_LIST = [];
    $scope.ENTITY_LIST = [];
    $scope.TerminationReasonSearch = {
        CUSTOMER_ID: null,
        TERMINATIONS_REASONS_ID: "",
        TERMINATION_REASONS_NAME: '',
        TERMINATION_REASONS_CODE: '',
        ACTIVE: -1,
        PAGE_NO: 1,
        PAGE_SIZE: 10, CLICK_SEARCH: null
    };
    $scope.RESET_TERMINATION = function () {
        $scope.TerminationReasonSearch = {
            CUSTOMER_ID: null,
            TERMINATIONS_REASONS_ID: "",
            TERMINATION_REASONS_NAME: '',
            TERMINATION_REASONS_CODE: '',
            ACTIVE: -1,
            PAGE_NO: 1,
            PAGE_SIZE: 10, CUSTOMER_ID: null, CLICK_SEARCH: null
        };
        $scope.TerminationForm.submitted = false; $scope.ENTITY_LIST = [];
        $scope.TERMINATION_REASON_LIST = [];
        $scope.ADMIN_GET_TERMINATION_REASONS(2);
    };

    $scope.ADMIN_GET_TERMINATION_REASONS = function (FLAG) {
        document.getElementById("overlay_loading").style.display = "block";
        var CONModelObj = new Object();
        if (FLAG == 1) {
            $scope.TerminationReasonSearch.CLICK_SEARCH = 1;
            $scope.TERMINATION_REASON_LIST = [];
            $scope.TerminationReasonSearch.PAGE_NO = 1;
            CONModelObj.ACTIVE = $scope.TerminationReasonSearch.ACTIVE == -1 ? -1 : $scope.TerminationReasonSearch.ACTIVE ? 1 : 0;
        }
        else if (FLAG == 2) {
            $scope.TERMINATION_REASON_LIST = [];
            $scope.TerminationReasonSearch.PAGE_NO = 1;
            CONModelObj.ACTIVE = $scope.TerminationReasonSearch.ACTIVE == -1 ? -1 : $scope.TerminationReasonSearch.ACTIVE ? 1 : 0;
        }
        else if (FLAG == undefined) {
            if ($scope.TerminationReasonSearch.CLICK_SEARCH == 1)
                CONModelObj.ACTIVE = $scope.TerminationReasonSearch.ACTIVE == -1 ? -1 : $scope.TerminationReasonSearch.ACTIVE ? 1 : 0;
            else
                CONModelObj.ACTIVE = -1;
        }
        //CONModelObj.CUSTOMER_ID_TREMINATION = $scope.TerminationReasonSearch.CUSTOMER_ID == -1 ? "" : ($scope.TerminationReasonSearch.CUSTOMER_ID == null ? 0 : $scope.TerminationReasonSearch.CUSTOMER_ID);
        //CONModelObj.TERMINATION_REASONS_NAME = $scope.TerminationReasonSearch.TERMINATION_REASONS_NAME;
        //CONModelObj.TERMINATION_REASONS_CODE = $scope.TerminationReasonSearch.TERMINATION_REASONS_CODE;

        CONModelObj.CUSTOMER_ID_TREMINATION = $scope.TerminationReasonSearch.CLICK_SEARCH == 1 ? ($scope.TerminationReasonSearch.CUSTOMER_ID == null ? 0 : $scope.TerminationReasonSearch.CUSTOMER_ID) : 0;//$scope.TerminationReasonSearch.CUSTOMER_ID == -1 ? "" : ($scope.TerminationReasonSearch.CUSTOMER_ID == null ? 0 : $scope.TerminationReasonSearch.CUSTOMER_ID);
        CONModelObj.TERMINATION_REASONS_NAME = $scope.TerminationReasonSearch.CLICK_SEARCH == 1 ? $scope.TerminationReasonSearch.TERMINATION_REASONS_NAME : '';
        CONModelObj.TERMINATION_REASONS_CODE = $scope.TerminationReasonSearch.CLICK_SEARCH == 1 ? $scope.TerminationReasonSearch.TERMINATION_REASONS_CODE : '';


        CONModelObj.PAGE_NO = $scope.TerminationReasonSearch.PAGE_NO;
        CONModelObj.PAGE_SIZE = $scope.TerminationReasonSearch.PAGE_SIZE;
        CONModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.ADMIN_API(CONModelObj, 'ADMIN_GET_TERMINATION_REASONS').then(function (data) {
            //$scope.TERMINATION_REASON_LIST = data.data.Table;
            if (data.data != null && data.data.Table.length > 0) {
                $scope.TERMINATION_REASON_LIST = $scope.TERMINATION_REASON_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.TerminationReasonSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                    document.getElementById("overlay_loading").style.display = "none";
                }
                else {
                    $scope.TerminationReasonSearch.PAGE_NO = parseInt($scope.TerminationReasonSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                    document.getElementById("overlay_loading").style.display = "none";
                }
            }
            else {
                $scope.GetData = false;
                $scope.TERMINATION_REASON_LIST = [];
                document.getElementById("overlay_loading").style.display = "none";
            }
        });
    };
    $scope.ADMIN_GET_TERMINATION_REASONS();
    $scope.ADMIN_INS_UPD_TERMINATION_REASONS = function () {
        $scope.TerminationForm.submitted = true;
        if ($scope.TerminationForm.$valid) {
            if ($scope.TerminationReasonSearch.ACTIVE != -1) {
                if ($scope.TerminationReasonSearch.CUSTOMER_ID == null || $scope.TerminationReasonSearch.CUSTOMER_ID == -1) {
                    if (confirm('As Customer Not Selected,Are You Want To Set This Termination As "Default"?')) {
                        document.getElementById("overlay_loading").style.display = "block";
                        var NatioModelObj = new Object();
                        NatioModelObj.CUSTOMER_ID_TREMINATION = null;
                        NatioModelObj.TERMINATION_REASONS_ID = $scope.TerminationReasonSearch.TERMINATIONS_REASONS_ID;
                        NatioModelObj.TERMINATION_REASONS_NAME = $scope.TerminationReasonSearch.TERMINATION_REASONS_NAME;
                        NatioModelObj.TERMINATION_REASONS_CODE = $scope.TerminationReasonSearch.TERMINATION_REASONS_CODE;
                        NatioModelObj.ACTIVE = $scope.TerminationReasonSearch.ACTIVE ? 1 : 0;
                        NatioModelObj.USER_ID = parseInt($cookies.get("USERID"));
                        //NatioModelObj.ENTITY_ID = null;//$scope.TerminationReasonSearch.ENTITY_ID;
                        PrcCommMethods.ADMIN_API(NatioModelObj, 'ADMIN_INS_UPD_TERMINATION_REASONS').then(function (data) {
                            $scope.$parent.ShowAlert("Success", "Save Successfully", 3000);
                            $scope.RESET_TERMINATION();
                            //$scope.ADMIN_GET_TERMINATION_REASONS(2);
                            document.getElementById("overlay_loading").style.display = "none";
                        });
                    }
                }
                else {
                    document.getElementById("overlay_loading").style.display = "block";
                    var NatioModelObj = new Object();
                    NatioModelObj.CUSTOMER_ID_TREMINATION = $scope.TerminationReasonSearch.CUSTOMER_ID;
                    NatioModelObj.TERMINATION_REASONS_ID = $scope.TerminationReasonSearch.TERMINATIONS_REASONS_ID;
                    NatioModelObj.TERMINATION_REASONS_NAME = $scope.TerminationReasonSearch.TERMINATION_REASONS_NAME;
                    NatioModelObj.TERMINATION_REASONS_CODE = $scope.TerminationReasonSearch.TERMINATION_REASONS_CODE;
                    NatioModelObj.ACTIVE = $scope.TerminationReasonSearch.ACTIVE ? 1 : 0;
                    NatioModelObj.USER_ID = parseInt($cookies.get("USERID"));
                    //NatioModelObj.ENTITY_ID = null;//$scope.TerminationReasonSearch.ENTITY_ID;
                    PrcCommMethods.ADMIN_API(NatioModelObj, 'ADMIN_INS_UPD_TERMINATION_REASONS').then(function (data) {
                        $scope.$parent.ShowAlert("Success", "Save Successfully", 3000);
                        $scope.RESET_TERMINATION();
                        //$scope.ADMIN_GET_TERMINATION_REASONS(2);
                        document.getElementById("overlay_loading").style.display = "none";
                    });

                }
            }
            else { $scope.$parent.ShowAlert('Attention', 'Please Select Active/In-Active Option.', 3000); }
        }
    };
    $scope.EDIT_INS_UPD_TERMINATION_REASONS = function (NAT) {
        $scope.TerminationReasonSearch.TERMINATIONS_REASONS_ID = NAT.ID;
        $scope.TerminationReasonSearch.TERMINATION_REASONS_NAME = NAT.TERMINATION_REASONS_NAME;
        $scope.TerminationReasonSearch.ACTIVE = NAT.ACTIVE ? 1 : 0;
        $scope.TerminationReasonSearch.CUSTOMER_ID = NAT.CUSTOMER_ID == -1 ? null : NAT.CUSTOMER_ID;
        $scope.TerminationReasonSearch.ENTITY_ID = NAT.ENTITY_ID;
        $scope.TerminationReasonSearch.TERMINATION_REASONS_CODE = NAT.TERMINATION_REASONS_CODE;
        $scope.GET_ENTITY_LIST();
    };
    $scope.DELETE_INS_UPD_UNITS = function (NAT) {
        if (confirm('Are you sure?')) {
            var NatioModelObj = new Object();
            NatioModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
            NatioModelObj.UNITS_ID = NAT.UNITS_ID;
            NatioModelObj.ACTIVE = 2;
            NatioModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.ADMIN_API(NatioModelObj, 'ADMIN_INS_UPD_UNITS').then(function (data) {
                $scope.$parent.ShowAlert("Success", "Inactive Successfully", 3000);
                $scope.RESET_TERMINATION();
                $scope.ADMIN_GET_TERMINATION_REASONS();
            });
        }
    };
    $scope.GET_ENTITY_LIST = function () {
        if ($scope.TerminationReasonSearch.CUSTOMER_ID != undefined) {
            var CusModelObj = new Object();
            CusModelObj.CUSTOMER_ID = $scope.TerminationReasonSearch.CUSTOMER_ID;
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
        }
        else { $scope.ENTITY_LIST = []; }
    };
    $scope.ADMIN_GET_CUSTOMER = function () {
        $scope.CUSTOMER_LIST = [];
        var UnitModelObj = new Object();
        UnitModelObj.CUSTOMER_NAME = '';
        UnitModelObj.CUSTOMER_CODE = '';
        UnitModelObj.ACTIVE = 1;
        UnitModelObj.PAGE_NO = 1;
        UnitModelObj.PAGE_SIZE = 1000;//$scope.CustomerSearch.PAGE_SIZE;
        UnitModelObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(UnitModelObj, 'ADMIN_GET_CUSTOMER').then(function (data) {
            $scope.CUSTOMER_LIST = data.data.Table;
            var DEFAULT_OBJ = new Object();
            DEFAULT_OBJ.ACTIVE = true;
            DEFAULT_OBJ.BCC_USERS = "";;
            DEFAULT_OBJ.COMMENTS = "";
            DEFAULT_OBJ.CREATED_DATE = "";
            DEFAULT_OBJ.CUSTOMER_CODE = "";
            DEFAULT_OBJ.CUSTOMER_ID = -1;
            DEFAULT_OBJ.CUSTOMER_NAME = "DEFAULT";
            DEFAULT_OBJ.IS_LIVE = false;
            DEFAULT_OBJ.LOGO_PATH = "";
            DEFAULT_OBJ.PAGING = 1;
            DEFAULT_OBJ.URL = "";
            $scope.CUSTOMER_LIST.push(DEFAULT_OBJ);
        });
    };
    $scope.ADMIN_GET_CUSTOMER();
    $scope.LAZY_ADMIN_GET_TERMINATION_REASONS = function () {
        $scope.ADMIN_GET_TERMINATION_REASONS();
    };
});
app.controller('ShiftController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.$parent.PAGE_HEADER = "Shift";
    $scope.$parent.urlpath = "Shift";
    $scope.GRP_ID = getUrlParameter('ID', $location.absUrl());
    $scope.SHIFT_LIST = [];
    $scope.ENTITY_LIST = [];
    $scope.ShiftSearch = {
        CUSTOMER_ID: null,
        TERMINATIONS_REASONS_ID: "",
        SHIFT_MASTER_NAME: '',
        ACTIVE: -1,
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        START_TIME_AMPM: "AM",
        END_TIME_AMPM: "AM",
        CLICK_SEARCH: 0
    };
    $scope.RESET_SHIFT = function () {
        $scope.ShiftSearch = {
            CUSTOMER_ID: null,
            TERMINATIONS_REASONS_ID: "",
            SHIFT_MASTER_NAME: '',
            ACTIVE: -1,
            PAGE_NO: 1,
            PAGE_SIZE: 10, CUSTOMER_ID: null, RESET_FLAG: 3,
            FLAG: 3,
            CLICK_SEARCH: null
        };
        $scope.ShiftForm.submitted = false;
        $scope.ENTITY_LIST = [];
        $scope.ADMIN_GET_SHIFT_MASTER(2);
    };
    $scope.LAZY_ADMIN_GET_SHIFT = function () { $scope.ADMIN_GET_SHIFT_MASTER(); };
    $scope.ADMIN_GET_SHIFT_MASTER = function (FLAG) {
        document.getElementById("overlay_loading").style.display = "block";
        var CONModelObj = new Object();
        if (FLAG == 1) {
            $scope.ShiftSearch.CLICK_SEARCH = 1;
            $scope.SHIFT_LIST = [];
            $scope.ShiftSearch.PAGE_NO = 1;
            //CONModelObj.ACTIVE = $scope.ShiftSearch.ACTIVE ? 1 : 0;
            CONModelObj.ACTIVE = $scope.ShiftSearch.ACTIVE == -1 ? -1 : $scope.ShiftSearch.ACTIVE ? 1 : 0;
        }
        else if (FLAG == 2) {
            $scope.SHIFT_LIST = [];
            $scope.ShiftSearch.PAGE_NO = 1;
            CONModelObj.ACTIVE = $scope.ShiftSearch.ACTIVE == -1 ? -1 : $scope.ShiftSearch.ACTIVE ? 1 : 0;
        }
        else if (FLAG == undefined) {
            if ($scope.ShiftSearch.CLICK_SEARCH == 1)
                CONModelObj.ACTIVE = $scope.ShiftSearch.ACTIVE == -1 ? -1 : $scope.ShiftSearch.ACTIVE ? 1 : 0;
            else
                CONModelObj.ACTIVE = -1;
        }
        CONModelObj.CUSTOMER_ID = $scope.ShiftSearch.CLICK_SEARCH == 1 ? $scope.ShiftSearch.CUSTOMER_ID : null;
        CONModelObj.ENTITY_ID = $scope.ShiftSearch.CLICK_SEARCH == 1 ? $scope.ShiftSearch.ENTITY_ID : null;
        //CONModelObj.COURSE_ID = $scope.HolidayEntitlementSearch.COURSE_ID;
        CONModelObj.SHIFT_MASTER_NAME = $scope.ShiftSearch.CLICK_SEARCH == 1 ? $scope.ShiftSearch.SHIFT_MASTER_NAME : '';
        CONModelObj.PAGE_NO = $scope.ShiftSearch.PAGE_NO;
        CONModelObj.PAGE_SIZE = $scope.ShiftSearch.PAGE_SIZE;
        CONModelObj.CREATION_SOURCE = 1;
        PrcCommMethods.ADMIN_API(CONModelObj, 'ADMIN_GET_SHIFT_MASTER').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.SHIFT_LIST = $scope.SHIFT_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.ShiftSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                    document.getElementById("overlay_loading").style.display = "none";
                }
                else {
                    $scope.ShiftSearch.PAGE_NO = parseInt($scope.ShiftSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                    document.getElementById("overlay_loading").style.display = "none";
                }
            }
            else {
                $scope.GetData = false;
                document.getElementById("overlay_loading").style.display = "none";
            }
        });
    };
    $scope.ADMIN_GET_SHIFT_MASTER();
    $scope.GET_TIME_LIST = function () {
        var GetAll = new Object();
        PrcCommMethods.HR_API(GetAll, 'GET_TIME_LIST').then(function (data) {
            const searchRegExp = ':';
            const replaceWith = '.';
            angular.forEach(data.data.Table, function (x) {
                x.TIME_NAME_24 = x.TIME_NAME_24.replaceAll(searchRegExp, replaceWith);
            });
            $scope.TIME_LIST = data.data.Table;
        });
    };
    $scope.CalculateDuration = function (EndTime, StartTime, UN_PAID_BREAK) {
        //let START_TIME = moment($scope.Section_Week_Search.START_TIME).format('H:mm')
        var ST = StartTime.split(':');
        //let END_TIME = moment($scope.Section_Week_Search.END_TIME).format('H:mm')
        var ET = EndTime.split(':');
        var START_DATE_MIN = new Date();
        var END_DATE_MIN = new Date();
        START_DATE_MIN.setHours(parseInt(ST[0] == '' ? 0 : ST[0]));
        START_DATE_MIN.setMinutes(parseInt(ST[1] == '' ? 0 : ST[1]));
        START_DATE_MIN.setSeconds(parseInt(ST[2] == '' ? 0 : ST[2]));

        END_DATE_MIN.setHours(parseInt(ET[0] == '' ? 0 : ET[0]));
        END_DATE_MIN.setMinutes(parseInt(ET[1] == '' ? 0 : ET[1]));
        END_DATE_MIN.setSeconds(parseInt(ET[2] == '' ? 0 : ET[2]));
        var UN_PAID_BREAK_MIN = UN_PAID_BREAK == undefined || UN_PAID_BREAK == undefined == null ? UN_PAID_BREAK = 0 : UN_PAID_BREAK;
        //if (moment(START_DATE_MIN) > moment(END_DATE_MIN) && moment(END_DATE_MIN).format('HH:mm:ss') > 0) {
        if (moment(START_DATE_MIN) > moment(END_DATE_MIN)) {
            END_DATE_MIN.setDate(END_DATE_MIN.getDate() + 1);
        }
        var ms = moment(END_DATE_MIN, "DD/MM/YYYY HH:mm:ss").diff(moment(START_DATE_MIN, "DD/MM/YYYY HH:mm:ss"));
        var diffDuration = moment.duration(ms);
        //var timeTokens = EndTime.split(':');
        //$scope.EndTime = new Date(1970, 0, 1, timeTokens[0], timeTokens[1], timeTokens[2]);
        //timeTokens = StartTime.split(':');
        //$scope.StartTime = new Date(1970, 0, 1, timeTokens[0], timeTokens[1], timeTokens[2]);

        //if ($scope.StartTime > $scope.EndTime) {
        //    $scope.EndTime.setDate($scope.EndTime.getDate() + 1);
        //}
        return ((diffDuration / 3600000) * 60) - UN_PAID_BREAK_MIN;//(($scope.EndTime - $scope.StartTime) / 3600000) * 60;
    };
    $scope.GET_TIME_LIST();
    $scope.ADMIN_INS_UPD_SHIFT_MASTER = function () {
        $scope.ShiftForm.submitted = true;
        if ($scope.ShiftForm.$valid) {
            if ($scope.ShiftSearch.ACTIVE != -1) {
                document.getElementById("overlay_loading").style.display = "block";
                var NatioModelObj = new Object();
                //var START = $scope.TIME_LIST.filter(function (x) { return x.TIME_NAME_24 == $scope.ShiftSearch.START_TIME });
                //var END = $scope.TIME_LIST.filter(function (x) { return x.TIME_NAME_24 == $scope.ShiftSearch.END_TIME });

                NatioModelObj.CUSTOMER_ID = $scope.ShiftSearch.CUSTOMER_ID;
                NatioModelObj.SHIFT_MASTER_ID = $scope.ShiftSearch.SHIFT_MASTER_ID;
                NatioModelObj.SHIFT_CODE = $scope.ShiftSearch.SHIFT_CODE;
                NatioModelObj.SHIFT_TITLE = $scope.ShiftSearch.SHIFT_TITLE;
                NatioModelObj.START_TIME = $scope.ShiftSearch.START_TIME + ":" + $scope.ShiftSearch.START_TIME_MIN + ":" + $scope.ShiftSearch.START_TIME_SEC;//START[0].TIME_NAME ;//$scope.ShiftSearch.START_TIME;
                NatioModelObj.END_TIME = $scope.ShiftSearch.END_TIME + ":" + $scope.ShiftSearch.END_TIME_MIN + ":" + $scope.ShiftSearch.END_TIME_SEC;// END[0].TIME_NAME;//$scope.ShiftSearch.END_TIME;
                NatioModelObj.PAID_BREAK = $scope.ShiftSearch.PAID_BREAK;
                NatioModelObj.UN_PAID_BREAK = $scope.ShiftSearch.UN_PAID_BREAK;
                NatioModelObj.DURATION = $scope.ShiftSearch.DURATION;
                NatioModelObj.ACTIVE = $scope.ShiftSearch.ACTIVE ? 1 : 0;
                NatioModelObj.USER_ID = parseInt($cookies.get("USERID"));
                NatioModelObj.ENTITY_ID = $scope.ShiftSearch.ENTITY_ID;
                NatioModelObj.CREATION_SOURCE = 1;
                PrcCommMethods.ADMIN_API(NatioModelObj, 'ADMIN_INS_UPD_SHIFT_MASTER').then(function (data) {
                    $scope.$parent.ShowAlert("Success", "Save Successfully", 3000);
                    $scope.RESET_SHIFT();
                    document.getElementById("overlay_loading").style.display = "none";
                });
            }
            else {
                $scope.$parent.ShowAlert('Attention', 'Please Select Active/In-Active Option.', 3000); $scope.ShiftForm.submitted = false;
                document.getElementById("overlay_loading").style.display = "none";
            }
        }
    };
    $scope.EDIT_INS_UPD_SHIFT_MASTER = function (NAT) {

        $scope.ShiftSearch.SHIFT_MASTER_ID = NAT.SHIFT_MASTER_ID;
        $scope.ShiftSearch.SHIFT_CODE = NAT.SHIFT_CODE;
        $scope.ShiftSearch.SHIFT_TITLE = NAT.SHIFT_TITLE;
        $scope.ShiftSearch.START_TIME = NAT.START_TIME.split(':')[0]; //$scope.TIME_LIST.filter(function (x) { return x.TIME_NAME == NAT.START_TIME })[0].TIME_NAME_24; //NAT.START_TIME;
        $scope.ShiftSearch.START_TIME_MIN = NAT.START_TIME.split(':')[1];
        $scope.ShiftSearch.START_TIME_SEC = NAT.START_TIME.split(':')[2];
        $scope.ShiftSearch.PAID_BREAK = NAT.PAID_BREAK;
        $scope.ShiftSearch.UN_PAID_BREAK = NAT.UN_PAID_BREAK;
        $scope.ShiftSearch.END_TIME = NAT.END_TIME.split(':')[0];//$scope.TIME_LIST.filter(function (x) { return x.TIME_NAME == NAT.END_TIME })[0].TIME_NAME_24;//NAT.END_TIME;
        $scope.ShiftSearch.END_TIME_MIN = NAT.END_TIME.split(':')[1];//$scope.TIME_LIST.filter(function (x) { return x.TIME_NAME == NAT.END_TIME })[0].TIME_NAME_24;//NAT.END_TIME;
        $scope.ShiftSearch.END_TIME_SEC = NAT.END_TIME.split(':')[2];//$scope.TIME_LIST.filter(function (x) { return x.TIME_NAME == NAT.END_TIME })[0].TIME_NAME_24;//NAT.END_TIME;
        $scope.ShiftSearch.DURATION = NAT.DURATION;
        $scope.ShiftSearch.ACTIVE = NAT.ACTIVE == true ? 1 : 0;
        $scope.ShiftSearch.CUSTOMER_ID = NAT.CUSTOMER_ID;
        $scope.ShiftSearch.ENTITY_ID = NAT.ENTITY_ID;
        $scope.GET_ENTITY_LIST();
    };
    $scope.DELETE_INS_UPD_UNITS = function (NAT) {
        if (confirm('Are you sure?')) {
            var NatioModelObj = new Object();
            NatioModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
            NatioModelObj.UNITS_ID = NAT.UNITS_ID;
            NatioModelObj.ACTIVE = 2;
            NatioModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.ADMIN_API(NatioModelObj, 'ADMIN_INS_UPD_UNITS').then(function (data) {
                $scope.$parent.ShowAlert("Success", "Inactive Successfully", 3000);
                $scope.RESET_SHIFT();
                $scope.ADMIN_GET_SHIFT_MASTER();
            });
        }
    };
    $scope.GET_ENTITY_LIST = function () {
        if ($scope.ShiftSearch.CUSTOMER_ID != undefined) {
            var CusModelObj = new Object();
            CusModelObj.CUSTOMER_ID = $scope.ShiftSearch.CUSTOMER_ID;
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
        }
        else { $scope.ENTITY_LIST = []; }
    };
    $scope.ADMIN_GET_CUSTOMER = function () {
        var UnitModelObj = new Object();
        UnitModelObj.CUSTOMER_NAME = '';
        UnitModelObj.CUSTOMER_CODE = '';
        UnitModelObj.ACTIVE = 1;
        UnitModelObj.PAGE_NO = 1;
        UnitModelObj.PAGE_SIZE = 1000;//$scope.CustomerSearch.PAGE_SIZE;
        UnitModelObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(UnitModelObj, 'ADMIN_GET_CUSTOMER').then(function (data) {
            $scope.CUSTOMER_LIST = data.data.Table;
        });
    };
    $scope.ADMIN_GET_CUSTOMER();
});
app.controller('PensionSchController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.$parent.PAGE_HEADER = "Pension Scheme";
    $scope.$parent.urlpath = "PensionSch";
    $scope.GRP_ID = getUrlParameter('ID', $location.absUrl());
    $scope.PENSION_SCHEME_LIST = [];
    $scope.CUSTOMER_LIST = [];
    $scope.ENTITY_LIST = [];
    $scope.PensionSchSearch = {
        SCHEME_ID: null,
        SCHEME_NAME: "",
        PENSION_SCHEME_NAME: "",
        ACTIVE: -1,
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        CUSTOMER_ID: null,
        CLICK_SEARCH: null, ENTITY_ID: null
    };
    $scope.RESET_PEN = function () {
        $scope.PensionSchSearch = {
            SCHEME_ID: null,
            SCHEME_NAME: "",
            PENSION_SCHEME_NAME: "",
            ACTIVE: -1,
            PAGE_NO: 1,
            CUSTOMER_ID: null,
            PAGE_SIZE: 10,
            CLICK_SEARCH: null, ENTITY_ID: null
        };
        $scope.PensionSchForm.submitted = false;
        $scope.PENSION_SCHEME_LIST = [];
        $scope.ENTITY_LIST = [];
        $scope.ADMIN_GET_PENSION_SCHEME(2);
    };
    $scope.LAZY_ADMIN_GET_PENSION_SCHEME = function () {
        $scope.ADMIN_GET_PENSION_SCHEME();
    };
    $scope.ADMIN_GET_PENSION_SCHEME = function (FLAG) {
        var CONModelObj = new Object();
        if (FLAG == 1) {
            $scope.PensionSchSearch.CLICK_SEARCH = 1;
            $scope.PENSION_SCHEME_LIST = [];
            $scope.PensionSchSearch.PAGE_NO = 1;
            CONModelObj.ACTIVE = $scope.PensionSchSearch.ACTIVE == -1 ? -1 : $scope.PensionSchSearch.ACTIVE ? 1 : 0;
        }
        else if (FLAG == 2) {
            $scope.PENSION_SCHEME_LIST = [];
            CONModelObj.ACTIVE = $scope.PensionSchSearch.ACTIVE == -1 ? -1 : $scope.PensionSchSearch.ACTIVE ? 1 : 0;
            $scope.PensionSchSearch.PAGE_NO = 1;
        }
        else if (FLAG == undefined) {
            if ($scope.PensionSchSearch.CLICK_SEARCH == 1)
                CONModelObj.ACTIVE = $scope.PensionSchSearch.ACTIVE == -1 ? -1 : $scope.PensionSchSearch.ACTIVE ? 1 : 0;
            else {
                CONModelObj.ACTIVE = -1;
            }
        }
        CONModelObj.CUSTOMER_ID = $scope.PensionSchSearch.CLICK_SEARCH == 1 ? $scope.PensionSchSearch.CUSTOMER_ID : null;
        CONModelObj.SCHEME_ID = $scope.PensionSchSearch.CLICK_SEARCH == 1 ? $scope.PensionSchSearch.SCHEME_ID : null;
        CONModelObj.PENSION_SCHEME_NAME = $scope.PensionSchSearch.CLICK_SEARCH == 1 ? $scope.PensionSchSearch.PENSION_SCHEME_NAME : '';
        //if ($scope.PensionSchSearch.ACTIVE == -1) {
        //    CONModelObj.ACTIVE = -1;
        //}
        //else { CONModelObj.ACTIVE = $scope.PensionSchSearch.ACTIVE == true ? 1 : 0; }
        CONModelObj.PAGE_NO = $scope.PensionSchSearch.PAGE_NO;
        CONModelObj.PAGE_SIZE = $scope.PensionSchSearch.PAGE_SIZE;
        CONModelObj.USER_ID = parseInt($cookies.get("USERID"));
        CONModelObj.ENTITY_ID = $scope.PensionSchSearch.CLICK_SEARCH == 1 ? $scope.PensionSchSearch.ENTITY_ID : null;
        PrcCommMethods.ADMIN_API(CONModelObj, 'ADMIN_GET_PENSION_SCHEME').then(function (data) {
            //$scope.PENSION_SCHEME_LIST = data.data.Table;
            if (data.data.Table.length > 0) {
                $scope.PENSION_SCHEME_LIST = $scope.PENSION_SCHEME_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.PensionSchSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.PensionSchSearch.PAGE_NO = parseInt($scope.PensionSchSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else {
                $scope.GetData = false; $scope.PENSION_SCHEME_LIST = [];
            }

        });
    };
    $scope.ADMIN_GET_PENSION_SCHEME();
    $scope.ADMIN_INS_UPD_PENSION_SCHEME = function () {
        $scope.PensionSchForm.submitted = true;
        if ($scope.PensionSchForm.$valid) {
            if ($scope.PensionSchSearch.ACTIVE != -1) {
                var AbsModelObj = new Object();
                AbsModelObj.CUSTOMER_ID = $scope.PensionSchSearch.CUSTOMER_ID;
                AbsModelObj.PENSION_SCHEME_ID = $scope.PensionSchSearch.PENSION_SCHEME_ID;
                AbsModelObj.PENSION_SCHEME_NAME = $scope.PensionSchSearch.PENSION_SCHEME_NAME;
                AbsModelObj.ACTIVE = $scope.PensionSchSearch.ACTIVE ? 1 : 0;
                AbsModelObj.USER_ID = parseInt($cookies.get("USERID"));
                AbsModelObj.ENTITY_ID = $scope.PensionSchSearch.ENTITY_ID;
                PrcCommMethods.ADMIN_API(AbsModelObj, 'ADMIN_INS_UPD_PENSION_SCHEME').then(function (data) {
                    $scope.$parent.ShowAlert("Success", "Saved Successfully", 3000);
                    $scope.RESET_PEN();
                });
            }
            else { $scope.$parent.ShowAlert('Attention', 'Please Select Active/In-Active Option.', 3000); $scope.PensionSchSearch.submitted = false; }
        }
    };
    $scope.EDIT_INS_UPD_PENSION_SCHEME = function (NAT) {
        $scope.PensionSchSearch.PENSION_SCHEME_ID = NAT.PENSION_SCHEME_ID;
        $scope.PensionSchSearch.PENSION_SCHEME_NAME = NAT.PENSION_SCHEME_NAME;
        $scope.PensionSchSearch.ACTIVE = NAT.ACTIVE == true ? 1 : 0;
        $scope.PensionSchSearch.CUSTOMER_ID = NAT.CUSTOMER_ID;
        $scope.PensionSchSearch.ENTITY_ID = NAT.ENTITY_ID;
        $scope.GET_ENTITY_LIST();
    };
    $scope.DELETE_INS_UPD_ABSENCE_TYPE = function (NAT) {
        if (confirm('Are you sure?')) {
            var NatioModelObj = new Object();
            NatioModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
            NatioModelObj.ABSENCE_TYPE_ID = NAT.ABSENCE_TYPE_ID;
            NatioModelObj.ACTIVE = 2;
            NatioModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.ADMIN_API(NatioModelObj, 'ADMIN_INS_UPD_ABSENCE_TYPE').then(function (data) {
                $scope.$parent.ShowAlert("Success", "Inactive Successfully", 3000);
                $scope.RESET_PEN();
                $scope.ADMIN_GET_PENSION_SCHEME();
            });
        }
    };
    $scope.GET_ENTITY_LIST = function () {
        if ($scope.PensionSchSearch.CUSTOMER_ID != undefined && $scope.PensionSchSearch.CUSTOMER_ID != '' && $scope.PensionSchSearch.CUSTOMER_ID != null) {
            var CusModelObj = new Object();
            CusModelObj.CUSTOMER_ID = $scope.PensionSchSearch.CUSTOMER_ID;
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
        }
        else { $scope.ENTITY_LIST = []; }
    };
    $scope.ADMIN_GET_CUSTOMER = function () {
        var AbsModelObj = new Object();
        AbsModelObj.CUSTOMER_NAME = '';
        AbsModelObj.CUSTOMER_CODE = '';
        AbsModelObj.ACTIVE = 1;
        AbsModelObj.PAGE_NO = 1;
        AbsModelObj.PAGE_SIZE = 1000;//$scope.CustomerSearch.PAGE_SIZE;
        AbsModelObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(AbsModelObj, 'ADMIN_GET_CUSTOMER').then(function (data) {
            $scope.CUSTOMER_LIST = data.data.Table;
        });
    };
    $scope.ADMIN_GET_CUSTOMER();
    $scope.SEARCH_PENSION = function (FLAG) {
        $scope.SERACH_CLICK_FLAG = FLAG;
        $scope.ADMIN_GET_PENSION_SCHEME();
    };
});
app.controller('AssetTypeController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.$parent.PAGE_HEADER = "Asset Type";
    $scope.$parent.urlpath = "AssetType";
    $scope.ASSET_TYPE_LIST = [];
    $scope.CUSTOMER_LIST = [];
    $scope.ENTITY_LIST = [];
    $scope.AssetTypeSearch = {
        ABSENCE_TYPE_ID: null,
        ABSENCE_TYPE_NAME: "",
        ACTIVE: -1,
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        CUSTOMER_ID: null,
        CLICK_SEARCH: null
    };
    $scope.RESET_ASSETTYPE = function () {
        $scope.AssetTypeSearch = {
            ABSENCE_TYPE_ID: null,
            ABSENCE_TYPE_NAME: "",
            ACTIVE: -1,
            PAGE_NO: 1,
            PAGE_SIZE: 10,
            CUSTOMER_ID: null,
            CLICK_SEARCH: null
        };
        $scope.AssetForm.submitted = false;
        $scope.ENTITY_LIST = [];
        $scope.ADMIN_GET_ASSET_TYPES(2);
    };
    $scope.LAZY_ADMIN_GET_ASSET_TYPES = function () { $scope.ADMIN_GET_ASSET_TYPES(); };
    $scope.ADMIN_GET_ASSET_TYPES = function (FLAG) {
        var CONModelObj = new Object();
        if (FLAG == 1) {
            $scope.AssetTypeSearch.CLICK_SEARCH = 1;
            $scope.ASSET_TYPE_LIST = [];
            $scope.AssetTypeSearch.PAGE_NO = 1;
            //CONModelObj.ACTIVE = $scope.AssetTypeSearch.ACTIVE ? 1 : 0;
            CONModelObj.ACTIVE = $scope.AssetTypeSearch.ACTIVE == -1 ? -1 : $scope.AssetTypeSearch.ACTIVE ? 1 : 0;
        }
        else if (FLAG == 2) {
            $scope.ASSET_TYPE_LIST = [];
            CONModelObj.ACTIVE = $scope.AssetTypeSearch.ACTIVE == -1 ? -1 : $scope.AssetTypeSearch.ACTIVE ? 1 : 0;
            $scope.AssetTypeSearch.PAGE_NO = 1;
        }
        else if (FLAG == undefined) {
            if ($scope.AssetTypeSearch.CLICK_SEARCH == 1)
                CONModelObj.ACTIVE = $scope.AssetTypeSearch.ACTIVE == -1 ? -1 : $scope.AssetTypeSearch.ACTIVE ? 1 : 0;
            else {
                CONModelObj.ACTIVE = -1;
            }
        }
        CONModelObj.CUSTOMER_ID = $scope.AssetTypeSearch.CLICK_SEARCH == 1 ? $scope.AssetTypeSearch.CUSTOMER_ID : null;
        CONModelObj.ASSET_TYPE_NAME = $scope.AssetTypeSearch.CLICK_SEARCH == 1 ? $scope.AssetTypeSearch.ASSET_TYPE_NAME : '';
        //CONModelObj.ACTIVE = -1;
        CONModelObj.PAGE_NO = $scope.AssetTypeSearch.PAGE_NO;
        CONModelObj.PAGE_SIZE = $scope.AssetTypeSearch.PAGE_SIZE;
        //CONModelObj.USER_ID = parseInt($cookies.get("USERID"));
        CONModelObj.ENTITY_ID = null;// $scope.AssetTypeSearch.ENTITY_ID;
        PrcCommMethods.ADMIN_API(CONModelObj, 'ADMIN_GET_ASSET_TYPES').then(function (data) {
            // $scope.ASSET_TYPE_LIST = data.data.Table;
            if (data.data.Table.length > 0) {
                $scope.ASSET_TYPE_LIST = $scope.ASSET_TYPE_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.AssetTypeSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.AssetTypeSearch.PAGE_NO = parseInt($scope.AssetTypeSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else {
                if ($scope.ASSET_TYPE_LIST.length == 0) {
                }
                $scope.GetData = false;
            }
        });
    };
    $scope.ADMIN_GET_ASSET_TYPES();
    $scope.ADMIN_INS_UPD_ASSET_TYPES = function () {
        $scope.AssetForm.submitted = true;
        if ($scope.AssetForm.$valid) {
            if ($scope.AssetTypeSearch.ACTIVE != -1) {
                var AbsModelObj = new Object();
                AbsModelObj.CUSTOMER_ID = $scope.AssetTypeSearch.CUSTOMER_ID;
                AbsModelObj.ASSET_TYPE_ID = $scope.AssetTypeSearch.ASSET_TYPE_ID;
                AbsModelObj.ASSET_TYPE_NAME = $scope.AssetTypeSearch.ASSET_TYPE_NAME;
                AbsModelObj.ACTIVE = $scope.AssetTypeSearch.ACTIVE ? 1 : 0;
                AbsModelObj.USER_ID = parseInt($cookies.get("USERID"));
                AbsModelObj.ENTITY_ID = null;//$scope.AssetTypeSearch.ENTITY_ID;
                PrcCommMethods.ADMIN_API(AbsModelObj, 'ADMIN_INS_UPD_ASSET_TYPES').then(function (data) {
                    $scope.$parent.ShowAlert("Success", "Save Successfully", 3000);
                    $scope.RESET_ASSETTYPE(1);
                });
            }
            else { $scope.$parent.ShowAlert('Attention', 'Please Select Active/In-Active Option.', 3000); $scope.AssetForm.submitted = false; }
        }
    };
    $scope.EDIT_INS_UPD_ASSET_TYPES = function (NAT) {
        $scope.AssetTypeSearch.ASSET_TYPE_ID = NAT.ASSET_TYPE_ID;
        $scope.AssetTypeSearch.ASSET_TYPE_NAME = NAT.ASSET_TYPE_NAME;
        $scope.AssetTypeSearch.ACTIVE = NAT.ACTIVE == true ? 1 : 0;
        $scope.AssetTypeSearch.CUSTOMER_ID = NAT.CUSTOMER_ID;
        //$scope.AssetTypeSearch.ENTITY_ID = NAT.ENTITY_ID;
        //$scope.GET_ENTITY_LIST();
    };
    $scope.DELETE_INS_UPD_ABSENCE_TYPE = function (NAT) {
        if (confirm('Are you sure?')) {
            var NatioModelObj = new Object();
            NatioModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
            NatioModelObj.ABSENCE_TYPE_ID = NAT.ABSENCE_TYPE_ID;
            NatioModelObj.ACTIVE = 2;
            NatioModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.ADMIN_API(NatioModelObj, 'ADMIN_INS_UPD_ABSENCE_TYPE').then(function (data) {
                $scope.$parent.ShowAlert("Success", "Inactive Successfully", 3000);
                $scope.RESET_ASSETTYPE();
                $scope.ADMIN_GET_ASSET_TYPES();
            });
        }
    };
    $scope.GET_ENTITY_LIST = function () {

        if ($scope.AssetTypeSearch.CUSTOMER_ID != undefined) {
            var CusModelObj = new Object();
            CusModelObj.CUSTOMER_ID = $scope.AssetTypeSearch.CUSTOMER_ID;
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
        }
        else { $scope.ENTITY_LIST = []; }
    };
    $scope.ADMIN_GET_CUSTOMER = function () {
        var AbsModelObj = new Object();
        AbsModelObj.CUSTOMER_NAME = '';
        AbsModelObj.CUSTOMER_CODE = '';
        AbsModelObj.ACTIVE = 1;
        AbsModelObj.PAGE_NO = 1;
        AbsModelObj.PAGE_SIZE = 1000;//$scope.CustomerSearch.PAGE_SIZE;
        AbsModelObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(AbsModelObj, 'ADMIN_GET_CUSTOMER').then(function (data) {
            $scope.CUSTOMER_LIST = data.data.Table;
        });
    };
    $scope.ADMIN_GET_CUSTOMER();
});
app.controller('SetupPageHeaderController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    if ($scope.$parent.SELECTED_PAGE_NAME == undefined) {
        $scope.$parent.PAGE_HEADER = "Setup Page Header";
        //$location.path("Page_Header");
    }
    else {
        $scope.$parent.PAGE_HEADER = "Setup Page Header - " + angular.copy($scope.$parent.SELECTED_PAGE_NAME);
        $scope.$parent.SELECTED_PAGE_NAME = undefined;
    }
    $scope.$parent.urlpath = "Page_Header";
    $scope.APP_PAGE_HEADER_LIST = [];
    $scope.CUSTOMER_LIST = [];
    $scope.CUSTOM_APP_LIST = [];
    $scope.ENTITY_LIST = [];
    var EDIT_HEADER = 0;
    var SetupPageHdrModelObj;
    $scope.APP_PAGE_ID = getUrlParameter('APP_PAGE_ID', $location.absUrl());
    $scope.RESET_PAGE_HEADER = function () {
        $scope.SetupPageHeaderFormSearch = {
            CUSTOMER_ID: null,
            ENTITY_ID: null,
            APP_PAGE_ID: null,
            PAGE_HEADER: "",
            ACTIVE: -1,
            PAGE_NO: 1,
            PAGE_SIZE: 1000
        }
        $scope.SetupPageHeaderForm.submitted = false;
        $scope.ENTITY_LIST = [];
        $scope.PAGE_HEADER_EXIST = false;
        EDIT_HEADER = 0;
    }
    $scope.GET_ENTITY_LIST = function () {
        if ($scope.SetupPageHeaderFormSearch.CUSTOMER_ID != undefined) {
            SetupPageHdrModelObj = new Object();
            SetupPageHdrModelObj.CUSTOMER_ID = $scope.SetupPageHeaderFormSearch.CUSTOMER_ID;
            SetupPageHdrModelObj.ACTIVE = 1;
            SetupPageHdrModelObj.PAGE_NO = 0;
            SetupPageHdrModelObj.USER_ID = parseInt($cookies.get("USERID"));
            SetupPageHdrModelObj.IS_LIVE = -1;
            PrcCommMethods.ADMIN_API(SetupPageHdrModelObj, 'ADMIN_GET_ENTITIES').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.ENTITY_LIST = data.data.Table;
                }
                else
                    $scope.ENTITY_LIST = [];
            });
        }
        else { $scope.ENTITY_LIST = []; };
        SetupPageHdrModelObj = null;
    };
    $scope.ADMIN_GET_CUSTOMER = function () {
        SetupPageHdrModelObj = new Object();
        SetupPageHdrModelObj.CUSTOMER_NAME = '';
        SetupPageHdrModelObj.CUSTOMER_CODE = '';
        SetupPageHdrModelObj.ACTIVE = 1;
        SetupPageHdrModelObj.PAGE_NO = 1;
        SetupPageHdrModelObj.PAGE_SIZE = 1000;//$scope.CustomerSearch.PAGE_SIZE;
        SetupPageHdrModelObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(SetupPageHdrModelObj, 'ADMIN_GET_CUSTOMER').then(function (data) {
            $scope.CUSTOMER_LIST = data.data.Table;
        });
        SetupPageHdrModelObj = null;
    };
    $scope.ADMIN_GET_CUSTOMER();

    $scope.ADMIN_GET_CUSTOM_APP_LIST = function (APP_PAGE_ID) {
        SetupPageHdrModelObj = new Object();
        SetupPageHdrModelObj.APP_PAGE_ID = 0;
        SetupPageHdrModelObj.ACTIVE = 1;
        PrcCommMethods.ADMIN_API(SetupPageHdrModelObj, 'GET_APP_PAGES').then(function (data) {
            $scope.CUSTOM_APP_LIST = data.data.Table;

        });
        SetupPageHdrModelObj = null;
    };
    $scope.ADMIN_GET_CUSTOM_APP_LIST(0);
    //-------------Create page header section ----------------//
    $scope.SetupPageHeaderFormSearch = {
        CUSTOMER_ID: null,
        ENTITY_ID: null,
        APP_PAGE_ID: null,
        PAGE_HEADER: "",
        ACTIVE: -1,
        PAGE_NO: 1,
        PAGE_SIZE: 1000
    };

    $scope.ADMIN_INS_UPD_APP_PAGE_HEADERS = function () {

        $scope.SetupPageHeaderForm.submitted = true;
        $scope.PAGE_HEADER_EXIST = false;
        if ($scope.SetupPageHeaderForm.$valid) {
            $scope.CHECK_PAGE_HEADER();

            if ($scope.PAGE_HEADER_EXIST == false) {
                SetupPageHdrModelObj = new Object()
                if (EDIT_HEADER == 1)
                    SetupPageHdrModelObj.APP_PAGE_HEADER_ID = $scope.$parent.EditObject.APP_PAGE_HEADER_ID;
                else
                    SetupPageHdrModelObj.APP_PAGE_HEADER_ID = 0;

                SetupPageHdrModelObj.APP_PAGE_ID = $scope.APP_PAGE_ID;
                SetupPageHdrModelObj.HEADER_NAME = $scope.SetupPageHeaderFormSearch.PAGE_HEADER;
                SetupPageHdrModelObj.ACTIVE = $scope.SetupPageHeaderFormSearch.ACTIVE == true ? 1 : 0;
                SetupPageHdrModelObj.USER_ID = parseInt($cookies.get("USERID"));
                SetupPageHdrModelObj.EDIT_ICON = 1;
                SetupPageHdrModelObj.CUSTOMER_ID = $scope.SetupPageHeaderFormSearch.CUSTOMER_ID;
                SetupPageHdrModelObj.ENTITY_ID = $scope.SetupPageHeaderFormSearch.ENTITY_ID;
                try {
                    PrcCommMethods.ADMIN_API(SetupPageHdrModelObj, 'ADMIN_INS_UPD_APP_PAGE_HEADERS').then(function (data) {
                        $scope.$parent.ShowAlert('Success', 'Updated Successfully', 3000);
                        $scope.GET_APP_PAGE_HEADERS();
                        EDIT_HEADER = 0;
                        $scope.$parent.EditObject.EDIT = 0;
                    });
                    SetupPageHdrModelObj = null;
                    $scope.RESET_PAGE_HEADER();

                } catch (e) {
                    $scope.$parent.ShowAlert('Fail', 'Error', 3000);
                }
            }
            else {
                $scope.$parent.ShowAlert('Error', 'Entered Header Name Already Exist.', 3000);

            }
        }

    };
    $scope.ADMIN_EDIT_INS_UPD_PAGE_HEADER = function (OBJPH) {
        OBJPH.EDIT = 1;
        $scope.$parent.EditObject = OBJPH;
        EDIT_HEADER = 1;
        $scope.PAGE_HEADER_EXIST = false;
        $scope.ADMIN_GET_PAGE_HEADER_DETAIL();
    };
    $scope.ADMIN_GET_PAGE_HEADER_DETAIL = function () {
        if (EDIT_HEADER == 1 && $scope.$parent.EditObject != null) {
            $scope.SetupPageHeaderFormSearch.CUSTOMER_ID = $scope.$parent.EditObject.CUSTOMER_ID;
            $scope.SetupPageHeaderFormSearch.APP_PAGE_ID = $scope.$parent.EditObject.APP_PAGE_ID;
            $scope.SetupPageHeaderFormSearch.ENTITY_ID = $scope.$parent.EditObject.ENTITY_ID;
            //$scope.GET_ENTITY_LIST();

            $scope.SetupPageHeaderFormSearch.PAGE_HEADER = $scope.$parent.EditObject.HEADER_NAME;
            $scope.SetupPageHeaderFormSearch.ACTIVE = $scope.$parent.EditObject.ACTIVE;
        }

    };

    $scope.GET_APP_PAGE_HEADERS = function () {
        SetupPageHdrModelObj = new Object()
        SetupPageHdrModelObj.CUSTOMER_ID = $scope.SetupPageHeaderFormSearch.CUSTOMER_ID;
        SetupPageHdrModelObj.ENTITY_ID = $scope.SetupPageHeaderFormSearch.ENTITY_ID;
        SetupPageHdrModelObj.APP_PAGE_ID = $scope.APP_PAGE_ID;
        SetupPageHdrModelObj.ACTIVE = $scope.SetupPageHeaderFormSearch.ACTIVE;
        SetupPageHdrModelObj.PAGE_NO = 1;
        SetupPageHdrModelObj.PAGE_SIZE = $scope.SetupPageHeaderFormSearch.PAGE_SIZE;
        PrcCommMethods.ADMIN_API(SetupPageHdrModelObj, 'GET_APP_PAGE_HEADERS').then(function (data) {
            if (data.data.Table.length > 0) {
                if ($scope.SetupPageHeaderFormSearch.ENTITY_ID == undefined || $scope.SetupPageHeaderFormSearch.ENTITY_ID == 0)
                    $scope.APP_PAGE_HEADER_LIST = [];
                else
                    $scope.APP_PAGE_HEADER_LIST = data.data.Table;
            }
            else
                $scope.APP_PAGE_HEADER_LIST = [];

            $scope.$parent.EditObject = null;
            $scope.SetupPageHeaderFormSearch.PAGE_HEADER = '';
        });
        SetupPageHdrModelObj = null;
    };
    $scope.PAGE_HEADER_EXIST = false;

    $scope.CHECK_PAGE_HEADER = function () {
        if ($scope.APP_PAGE_HEADER_LIST.filter(x => x.EDIT != 1 && x.HEADER_NAME == $scope.SetupPageHeaderFormSearch.PAGE_HEADER).length > 0)
        //($filter('filter')($scope.APP_PAGE_HEADER_LIST, { HEADER_NAME: $scope.SetupPageHeaderFormSearch.PAGE_HEADER, EDIT: '!1' }, true)).length > 0)
        {
            $scope.PAGE_HEADER_EXIST = true;
        }
        else
            $scope.PAGE_HEADER_EXIST = false;
    };
    //-------------------------------------------------//

    $scope.REDIRECT_TO = function (CUSTOMFLD) {
        $scope.$parent.SELECTED_PAGE_NAME = CUSTOMFLD.DISPLAY_NAME;
        $location.path("Setup_Page_Header").search("APP_PAGE_ID", CUSTOMFLD.APP_PAGES_ID);

    };

});
app.controller('ProbationMasterController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.$parent.PAGE_HEADER = "Probation Period";
    $scope.$parent.urlpath = "Probation";
    $scope.PROBATION_LIST = [];
    $scope.CUSTOMER_LIST = [];
    $scope.ENTITY_LIST = [];
    $scope.ProbationSearch = {
        PROBATION_MASTER_ID: null,
        PROBATION_NAME: "",
        ACTIVE: -1,
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        CUSTOMER_ID: null, NO_OF_DAYS: null,
        CLICK_SEARCH: null
    };
    $scope.RESET_PB = function () {
        $scope.ProbationSearch = {
            PROBATION_MASTER_ID: null,
            PROBATION_NAME: "",
            ACTIVE: -1,
            PAGE_NO: 1,
            PAGE_SIZE: 10,
            NO_OF_DAYS: null,
            CLICK_SEARCH: null
        };
        $scope.PBForm.submitted = false;
        $scope.ENTITY_LIST = [];
        $scope.PROBATION_LIST = [];
        $scope.ADMIN_GET_PROBATION_MASTER(2);
    };
    $scope.LAZY_ADMIN_GET_PROBATION_MASTER = function () { $scope.ADMIN_GET_PROBATION_MASTER(); };
    $scope.ADMIN_GET_PROBATION_MASTER = function (FLAG) {
        var CONModelObj = new Object();
        if (FLAG == 1) {
            $scope.PROBATION_LIST = [];
            $scope.ProbationSearch.CLICK_SEARCH = 1;
            $scope.ProbationSearch.PAGE_NO = 1;
            CONModelObj.ACTIVE = $scope.ProbationSearch.ACTIVE == -1 ? -1 : $scope.ProbationSearch.ACTIVE ? 1 : 0;
        }
        else if (FLAG == 2) {
            $scope.PROBATION_LIST = [];
            $scope.ProbationSearch.PAGE_NO = 1;
            CONModelObj.ACTIVE = $scope.ProbationSearch.ACTIVE == -1 ? -1 : $scope.ProbationSearch.ACTIVE ? 1 : 0;
        }
        else if (FLAG == undefined) {
            if ($scope.ProbationSearch.CLICK_SEARCH == 1)
                CONModelObj.ACTIVE = $scope.ProbationSearch.ACTIVE == -1 ? -1 : $scope.ProbationSearch.ACTIVE ? 1 : 0;
            else {
                CONModelObj.ACTIVE = -1;
            }
        }
        CONModelObj.CUSTOMER_ID = $scope.ProbationSearch.CLICK_SEARCH == 1 ? $scope.ProbationSearch.CUSTOMER_ID : null;
        CONModelObj.PROBATION_NAME = $scope.ProbationSearch.CLICK_SEARCH == 1 ? $scope.ProbationSearch.PROBATION_NAME : '';
        //CONModelObj.ACTIVE = -1;
        CONModelObj.PAGE_NO = $scope.ProbationSearch.PAGE_NO;
        CONModelObj.PAGE_SIZE = $scope.ProbationSearch.PAGE_SIZE;
        CONModelObj.USER_ID = parseInt($cookies.get("USERID"));
        CONModelObj.ENTITY_ID = $scope.ProbationSearch.CLICK_SEARCH == 1 ? $scope.ProbationSearch.ENTITY_ID : null;
        PrcCommMethods.ADMIN_API(CONModelObj, 'ADMIN_GET_PROBATION_MASTER').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.PROBATION_LIST = $scope.PROBATION_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.ProbationSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.ProbationSearch.PAGE_NO = parseInt($scope.ProbationSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else {
                if ($scope.PROBATION_LIST.length == 0) {
                    $scope.PROBATION_LIST = [];
                }
                $scope.GetData = false;
            }
        });
    };
    $scope.ADMIN_GET_PROBATION_MASTER();
    $scope.INS_UPD_HR_PROBATION_MASTER = function () {
        $scope.PBForm.submitted = true;
        if ($scope.PBForm.$valid) {
            if ($scope.ProbationSearch.ACTIVE != -1) {
                var AbsModelObj = new Object();
                AbsModelObj.CUSTOMER_ID = $scope.ProbationSearch.CUSTOMER_ID;
                AbsModelObj.PROBATION_MASTER_ID = $scope.ProbationSearch.PROBATION_MASTER_ID;
                AbsModelObj.PROBATION_NAME = $scope.ProbationSearch.PROBATION_NAME;
                AbsModelObj.ACTIVE = $scope.ProbationSearch.ACTIVE ? 1 : 0;
                AbsModelObj.USER_ID = parseInt($cookies.get("USERID"));
                AbsModelObj.ENTITY_ID = $scope.ProbationSearch.ENTITY_ID;
                AbsModelObj.NO_OF_DAYS = $scope.ProbationSearch.NO_OF_DAYS;
                PrcCommMethods.HR_API(AbsModelObj, 'INS_UPD_HR_PROBATION_MASTER').then(function (data) {
                    $scope.$parent.ShowAlert("Success", "Save Successfully", 3000);
                    $scope.RESET_PB();
                });
            }
            else { $scope.$parent.ShowAlert('Attention', 'Please Select Active/In-Active Option.', 3000); $scope.PBForm.submitted = false; }
        }
    };
    $scope.EDIT_INS_UPD_PROBATION = function (NAT) {
        $scope.ProbationSearch.PROBATION_MASTER_ID = NAT.ID;
        $scope.ProbationSearch.PROBATION_NAME = NAT.PROBATION_NAME;
        $scope.ProbationSearch.NO_OF_DAYS = NAT.NO_OF_DAYS;
        $scope.ProbationSearch.ACTIVE = NAT.ACTIVE == true ? 1 : 0;
        $scope.ProbationSearch.CUSTOMER_ID = NAT.CUSTOMER_ID;
        $scope.ProbationSearch.ENTITY_ID = NAT.ENTITY_ID;
        $scope.GET_ENTITY_LIST();
    };
    $scope.DELETE_INS_UPD_ABSENCE_TYPE = function (NAT) {
        if (confirm('Are you sure?')) {
            var NatioModelObj = new Object();
            NatioModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
            NatioModelObj.PROBATION_MASTER_ID = NAT.PROBATION_MASTER_ID;
            NatioModelObj.ACTIVE = 2;
            NatioModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.ADMIN_API(NatioModelObj, 'ADMIN_INS_UPD_ABSENCE_TYPE').then(function (data) {
                $scope.$parent.ShowAlert("Success", "Inactive Successfully", 3000);
                $scope.RESET_PB();
                $scope.ADMIN_GET_PROBATION_MASTER();
            });
        }
    };
    $scope.GET_ENTITY_LIST = function () {
        if ($scope.ProbationSearch.CUSTOMER_ID != undefined) {
            var CusModelObj = new Object();
            CusModelObj.CUSTOMER_ID = $scope.ProbationSearch.CUSTOMER_ID;
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
        }
        else { $scope.ENTITY_LIST = []; }
    };
    $scope.ADMIN_GET_CUSTOMER = function () {
        var AbsModelObj = new Object();
        AbsModelObj.CUSTOMER_NAME = '';
        AbsModelObj.CUSTOMER_CODE = '';
        AbsModelObj.ACTIVE = 1;
        AbsModelObj.PAGE_NO = 1;
        AbsModelObj.PAGE_SIZE = 1000;//$scope.CustomerSearch.PAGE_SIZE;
        AbsModelObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(AbsModelObj, 'ADMIN_GET_CUSTOMER').then(function (data) {
            $scope.CUSTOMER_LIST = data.data.Table;
        });
    };
    $scope.ADMIN_GET_CUSTOMER();
});
app.controller('DivisionMasterController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.$parent.PAGE_HEADER = "Division";
    $scope.$parent.urlpath = "Division";
    $scope.DIVISION_LIST = [];
    $scope.CUSTOMER_LIST = [];
    $scope.ENTITY_LIST = [];
    $scope.DivsionSearch = {
        DIVISION_ID: null,
        DIVISION_NAME: "",
        ACTIVE: -1,
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        CUSTOMER_ID: null,
        ENTITY_ID: null,
        CLICK_SEARCH: null
    };
    $scope.RESET_DIV = function () {
        $scope.DivsionSearch = {
            DIVISION_ID: null,
            DIVISION_NAME: "",
            ACTIVE: -1,
            PAGE_NO: 1,
            PAGE_SIZE: 10,
            CUSTOMER_ID: null,
            ENTITY_ID: null,
            CLICK_SEARCH: null
        };
        $scope.DiviForm.submitted = false;
        $scope.ENTITY_LIST = [];
        $scope.DIVISION_LIST = [];
        $scope.HR_GET_DIVISION(2);
    };
    $scope.LAZY_ADMIN_GET_DIVISION = function () {
        $scope.HR_GET_DIVISION();
    };
    $scope.HR_GET_DIVISION = function (FLAG) {
        var CONModelObj = new Object();
        if (FLAG == 1) {
            $scope.DivsionSearch.CLICK_SEARCH = 1;
            $scope.DIVISION_LIST = [];
            $scope.DivsionSearch.PAGE_NO = 1;
            //CONModelObj.ACTIVE = $scope.DivsionSearch.ACTIVE ? 1 : 0;
            CONModelObj.ACTIVE = $scope.DivsionSearch.ACTIVE == -1 ? -1 : $scope.DivsionSearch.ACTIVE ? 1 : 0;
        }
        else if (FLAG == 2) {
            $scope.DIVISION_LIST = [];
            $scope.DivsionSearch.PAGE_NO = 1;
            CONModelObj.ACTIVE = $scope.DivsionSearch.ACTIVE == -1 ? -1 : $scope.DivsionSearch.ACTIVE ? 1 : 0;
        }
        else if (FLAG == undefined) {
            if ($scope.DivsionSearch.CLICK_SEARCH == 1)
                CONModelObj.ACTIVE = $scope.DivsionSearch.ACTIVE == -1 ? -1 : $scope.DivsionSearch.ACTIVE ? 1 : 0;
            else
                CONModelObj.ACTIVE = -1;
        }
        CONModelObj.CUSTOMER_ID = $scope.DivsionSearch.CLICK_SEARCH == 1 ? $scope.DivsionSearch.CUSTOMER_ID : null;
        CONModelObj.DIVISION_NAME = $scope.DivsionSearch.CLICK_SEARCH == 1 ? $scope.DivsionSearch.DIVISION_NAME : '';
        CONModelObj.DIVISION_CODE = $scope.DivsionSearch.CLICK_SEARCH == 1 ? $scope.DivsionSearch.DIVISION_CODE : '';
        CONModelObj.PAGE_NO = $scope.DivsionSearch.PAGE_NO;
        CONModelObj.PAGE_SIZE = $scope.DivsionSearch.PAGE_SIZE;
        CONModelObj.USER_ID = parseInt($cookies.get("USERID"));
        CONModelObj.ENTITY_ID = $scope.DivsionSearch.CLICK_SEARCH == 1 ? $scope.DivsionSearch.ENTITY_ID : null;
        PrcCommMethods.ADMIN_API(CONModelObj, 'ADMIN_GET_DIVISION').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.DIVISION_LIST = $scope.DIVISION_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.DivsionSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.DivsionSearch.PAGE_NO = parseInt($scope.DivsionSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else {
                $scope.GetData = false;
            }
        });
    };
    $scope.HR_GET_DIVISION();
    $scope.ADMIN_INS_UPD_DIVISION = function () {
        $scope.DiviForm.submitted = true;
        if ($scope.DiviForm.$valid) {
            if ($scope.DivsionSearch.ACTIVE != -1) {
                var AbsModelObj = new Object();
                AbsModelObj.CUSTOMER_ID = $scope.DivsionSearch.CUSTOMER_ID;
                AbsModelObj.DIVISION_ID = $scope.DivsionSearch.DIVISION_ID == null ? 0 : $scope.DivsionSearch.DIVISION_ID;
                AbsModelObj.DIVISION_NAME = $scope.DivsionSearch.DIVISION_NAME;
                AbsModelObj.DIVISION_CODE = $scope.DivsionSearch.DIVISION_CODE;
                AbsModelObj.USER_ID = parseInt($cookies.get("USERID"));
                AbsModelObj.ENTITY_ID = $scope.DivsionSearch.ENTITY_ID;
                AbsModelObj.ACTIVE = $scope.DivsionSearch.ACTIVE ? 1 : 0;
                PrcCommMethods.HR_API(AbsModelObj, 'ADMIN_INS_UPD_DIVISION').then(function (data) {
                    $scope.$parent.ShowAlert("Success", "Saved Successfully", 3000);
                    $scope.RESET_DIV();
                });
            }
            else { $scope.$parent.ShowAlert('Attention', 'Please Select Active/In-Active Option.', 3000); }
        }
    };
    $scope.EDIT_INS_UPD_DIVISION = function (NAT) {
        $scope.DivsionSearch.DIVISION_ID = NAT.DIVISION_ID;
        $scope.DivsionSearch.DIVISION_NAME = NAT.DIVISION_NAME;
        $scope.DivsionSearch.DIVISION_CODE = NAT.DIVISION_CODE;
        $scope.DivsionSearch.ACTIVE = NAT.ACTIVE == true ? 1 : 0;
        $scope.DivsionSearch.CUSTOMER_ID = NAT.CUSTOMER_ID;
        $scope.DivsionSearch.ENTITY_ID = NAT.ENTITY_ID;
        $scope.GET_ENTITY_LIST();
    };
    $scope.DELETE_INS_UPD_DIVISION = function (NAT) {
        if (confirm('Are you sure?')) {
            var NatioModelObj = new Object();
            NatioModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
            NatioModelObj.DIVISION_ID = NAT.DIVISION_ID;
            NatioModelObj.ACTIVE = 2;
            NatioModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.ADMIN_API(NatioModelObj, 'ADMIN_INS_UPD_ABSENCE_TYPE').then(function (data) {
                $scope.$parent.ShowAlert("Success", "Inactive Successfully", 3000);
                $scope.RESET_PB();
                $scope.HR_GET_DIVISION();
            });
        }
    };
    $scope.GET_ENTITY_LIST = function () {
        if ($scope.DivsionSearch.CUSTOMER_ID != undefined && $scope.DivsionSearch.CUSTOMER_ID != '' && $scope.DivsionSearch.CUSTOMER_ID != null) {
            var CusModelObj = new Object();
            CusModelObj.CUSTOMER_ID = $scope.DivsionSearch.CUSTOMER_ID;
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
        }
        else { $scope.ENTITY_LIST = []; }
    };
    $scope.ADMIN_GET_CUSTOMER = function () {
        var AbsModelObj = new Object();
        AbsModelObj.CUSTOMER_NAME = '';
        AbsModelObj.CUSTOMER_CODE = '';
        AbsModelObj.ACTIVE = 1;
        AbsModelObj.PAGE_NO = 1;
        AbsModelObj.PAGE_SIZE = 1000;//$scope.CustomerSearch.PAGE_SIZE;
        AbsModelObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(AbsModelObj, 'ADMIN_GET_CUSTOMER').then(function (data) {
            $scope.CUSTOMER_LIST = data.data.Table;
        });
    };
    $scope.ADMIN_GET_CUSTOMER();
});
app.controller('PayFreqEnitiyMapController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.$parent.PAGE_HEADER = "Pay Frequency Entity Mapping";
    $scope.$parent.urlpath = "Pay_F_EN";
    $scope.DIVISION_LIST = [];
    $scope.CUSTOMER_LIST = [];
    $scope.ENTITY_LIST = [];
    $scope.PayEntiFreSearch = {
        DIVISION_ID: null,
        DIVISION_NAME: "",
        ACTIVE: 0,
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        CUSTOMER_ID: null
    };
    $scope.RESET_PAY = function () {
        $scope.PayEntiFreSearch = {
            DIVISION_ID: null,
            DIVISION_NAME: "",
            ACTIVE: 0,
            PAGE_NO: 1,
            PAGE_SIZE: 1000
        };
        $scope.PayEntForm.submitted = false;
        $scope.ENTITY_LIST = [];
        $scope.PAY_FREQUENCY_ENTITY_MAPPING_LIST = [];
    };
    $scope.InitializeFreq = function (P_FRE) {
        P_FRE.ACTIVE = P_FRE.ACTIVE == 1 ? P_FRE.ACTIVE = true : P_FRE.ACTIVE = false;
    };
    $scope.ADMIN_INS_UPD_PAY_FREQUENCY_ENTITY_MAPPING = function () {
        $scope.PayEntForm.submitted = true;
        if ($scope.PayEntForm.$valid) {
            var AbsModelObj = new Object();
            AbsModelObj.CUSTOMER_ID = $scope.PayEntiFreSearch.CUSTOMER_ID;
            AbsModelObj.PAY_FREQUENCY_ENTITY_ID = $scope.PayEntiFreSearch.PAY_FREQUENCY_ENTITY_ID;
            AbsModelObj.ACTIVE = $scope.PayEntiFreSearch.ACTIVE ? 1 : 0;
            AbsModelObj.USER_ID = parseInt($cookies.get("USERID"));
            AbsModelObj.ENTITY_ID = $scope.PayEntiFreSearch.ENTITY_ID;
            AbsModelObj.PAY_FREQUENCY_IDS = "";
            var i = '';
            var count = 0;
            angular.forEach($scope.PAY_FREQUENCY_ENTITY_MAPPING_LIST, function (val) {
                if (val.ACTIVE) {
                    if (i == '') {
                        i = val.PAY_FREQUENCY_ID;
                        count++;
                    }
                    else {
                        i = i + ',' + val.PAY_FREQUENCY_ID;
                        count++
                    }
                }
            })
            AbsModelObj.PAY_FREQUENCY_IDS = i;
            if (count > 0) {
                PrcCommMethods.ADMIN_API(AbsModelObj, 'ADMIN_INS_UPD_PAY_FREQUENCY_ENTITY_MAPPING').then(function (data) {
                    $scope.$parent.ShowAlert("Success", "Save Successfully", 3000);
                    $scope.RESET_PAY()
                    $scope.PAY_FREQUENCY_ENTITY_MAPPING_LIST = [];
                });
            }
            else {
                $scope.$parent.ShowAlert("Error", "Please Select Atleast One Pay Frequency", 3000);
            }
        }
    };
    $scope.ADMIN_GET_PAY_FREQUENCY_ENTITY_MAPPING = function () {
        var AbsModelObj = new Object();
        AbsModelObj.ENTITY_ID = $scope.PayEntiFreSearch.ENTITY_ID;
        PrcCommMethods.ADMIN_API(AbsModelObj, 'ADMIN_GET_PAY_FREQUENCY_ENTITY_MAPPING').then(function (data) {
            $scope.PAY_FREQUENCY_ENTITY_MAPPING_LIST = data.data.Table;
        });
    };

    $scope.EDIT_INS_UPD_DIVISION = function (NAT) {
        $scope.PayEntiFreSearch.DIVISION_ID = NAT.DIVISION_ID;
        $scope.PayEntiFreSearch.DIVISION_NAME = NAT.DIVISION_NAME;
        $scope.PayEntiFreSearch.DIVISION_CODE = NAT.DIVISION_CODE;
        $scope.PayEntiFreSearch.ACTIVE = NAT.ACTIVE;
        $scope.PayEntiFreSearch.CUSTOMER_ID = NAT.CUSTOMER_ID;
        $scope.PayEntiFreSearch.ENTITY_ID = NAT.ENTITY_ID;
    };
    $scope.DELETE_INS_UPD_DIVISION = function (NAT) {
        if (confirm('Are you sure?')) {
            var NatioModelObj = new Object();
            NatioModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
            NatioModelObj.DIVISION_ID = NAT.DIVISION_ID;
            NatioModelObj.ACTIVE = 2;
            NatioModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.ADMIN_API(NatioModelObj, 'ADMIN_INS_UPD_ABSENCE_TYPE').then(function (data) {
                $scope.$parent.ShowAlert("Success", "Inactive Successfully", 3000);
                $scope.RESET_PB()
                $scope.HR_GET_DIVISION()
            });
        }
    };
    $scope.GET_ENTITY_LIST = function () {
        if ($scope.PayEntiFreSearch.CUSTOMER_ID != undefined && $scope.PayEntiFreSearch.CUSTOMER_ID != '' && $scope.PayEntiFreSearch.CUSTOMER_ID != null) {
            var CusModelObj = new Object();
            CusModelObj.CUSTOMER_ID = $scope.PayEntiFreSearch.CUSTOMER_ID;
            CusModelObj.ACTIVE = 1;
            CusModelObj.PAGE_NO = 0;
            CusModelObj.USER_ID = parseInt($cookies.get("USERID"));
            CusModelObj.IS_LIVE = -1;
            PrcCommMethods.ADMIN_API(CusModelObj, 'ADMIN_GET_ENTITIES').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.ENTITY_LIST = data.data.Table;
                }
                else { $scope.ENTITY_LIST = []; };
            });
        }
        else { $scope.ENTITY_LIST = []; };
    };
    $scope.ADMIN_GET_CUSTOMER = function () {
        var AbsModelObj = new Object();
        AbsModelObj.CUSTOMER_NAME = '';
        AbsModelObj.CUSTOMER_CODE = '';
        AbsModelObj.ACTIVE = 1;
        AbsModelObj.PAGE_NO = 1;
        AbsModelObj.PAGE_SIZE = 1000;//$scope.CustomerSearch.PAGE_SIZE;
        AbsModelObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(AbsModelObj, 'ADMIN_GET_CUSTOMER').then(function (data) {
            $scope.CUSTOMER_LIST = data.data.Table;
        });
    };
    $scope.ADMIN_GET_CUSTOMER();
});
app.controller('PaidByEnitiyMapController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.$parent.PAGE_HEADER = "Paid By Entity Mapping";
    $scope.$parent.urlpath = "Paid_By_EN";
    $scope.CUSTOMER_LIST = [];
    $scope.ENTITY_LIST = [];
    $scope.PaidByEntiSearch = {
        ACTIVE: 0,
        PAGE_NO: 1,
        PAGE_SIZE: 1000,
        CUSTOMER_ID: null
    };
    $scope.RESET_CODE = function () {
        $scope.PaidByEntiSearch = {
            ACTIVE: 0,
            PAGE_NO: 1,
            PAGE_SIZE: 1000
        };
        $scope.PaidByEntForm.submitted = false;
        $scope.ENTITY_LIST = [];
        $scope.PAID_BY_ENTITY_MAPPING_LIST = [];
    };
    $scope.ADMIN_INS_UPD_PAID_BY_ENTITY_MAPPING = function () {
        $scope.PaidByEntForm.submitted = true;
        if ($scope.PaidByEntForm.$valid) {
            var AbsModelObj = new Object();
            AbsModelObj.ACTIVE = $scope.PaidByEntiSearch.ACTIVE ? 1 : 0;
            AbsModelObj.USER_ID = parseInt($cookies.get("USERID"));
            AbsModelObj.ENTITY_ID = $scope.PaidByEntiSearch.ENTITY_ID;
            AbsModelObj.PAY_CODE_IDS = "";
            var i = '';
            var count = 0;
            angular.forEach($scope.PAID_BY_ENTITY_MAPPING_LIST, function (val) {
                if (val.ACTIVE) {
                    if (i == '') {
                        i = val.PAID_BY_ID;
                        count++;
                    }
                    else {
                        i = i + ',' + val.PAID_BY_ID;
                        count++;
                    }
                }
            });
            AbsModelObj.PAID_BY_IDS = i;
            if (count > 0) {
                PrcCommMethods.ADMIN_API(AbsModelObj, 'ADMIN_INS_UPD_PAID_BY_ENTITY_MAPPING').then(function (data) {
                    $scope.$parent.ShowAlert("Success", "Save Successfully", 3000);
                    $scope.RESET_CODE();
                    $scope.PAID_BY_ENTITY_MAPPING_LIST = [];
                });
            }
            else {
                $scope.$parent.ShowAlert("Error", "Please Select Atleast One", 3000);
            }
        }
    };
    $scope.ADMIN_GET_PAID_BY_ENTITY_MAPPING = function () {
        var AbsModelObj = new Object();
        AbsModelObj.ENTITY_ID = $scope.PaidByEntiSearch.ENTITY_ID;
        PrcCommMethods.ADMIN_API(AbsModelObj, 'ADMIN_GET_PAID_BY_ENTITY_MAPPING').then(function (data) {
            $scope.PAID_BY_ENTITY_MAPPING_LIST = data.data.Table;
        });
    };
    $scope.InitializeCode = function (P_FRE) {
        P_FRE.ACTIVE = P_FRE.ACTIVE == 1 ? P_FRE.ACTIVE = true : P_FRE.ACTIVE = false;
    };
    $scope.EDIT_INS_UPD_DIVISION = function (NAT) {
        $scope.PaidByEntiSearch.DIVISION_ID = NAT.DIVISION_ID;
        $scope.PaidByEntiSearch.DIVISION_NAME = NAT.DIVISION_NAME;
        $scope.PaidByEntiSearch.DIVISION_CODE = NAT.DIVISION_CODE;
        $scope.PaidByEntiSearch.ACTIVE = NAT.ACTIVE;
        $scope.PaidByEntiSearch.CUSTOMER_ID = NAT.CUSTOMER_ID;
        $scope.PaidByEntiSearch.ENTITY_ID = NAT.ENTITY_ID;
    };
    $scope.DELETE_INS_UPD_DIVISION = function (NAT) {
        if (confirm('Are you sure?')) {
            var NatioModelObj = new Object();
            NatioModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
            NatioModelObj.DIVISION_ID = NAT.DIVISION_ID;
            NatioModelObj.ACTIVE = 2;
            NatioModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.ADMIN_API(NatioModelObj, 'ADMIN_INS_UPD_ABSENCE_TYPE').then(function (data) {
                $scope.$parent.ShowAlert("Success", "Inactive Successfully", 3000);
                $scope.RESET_CODE();
                $scope.HR_GET_DIVISION();
            });
        }
    };
    $scope.GET_ENTITY_LIST = function () {
        if ($scope.PaidByEntiSearch.CUSTOMER_ID != undefined && $scope.PaidByEntiSearch.CUSTOMER_ID != '' && $scope.PaidByEntiSearch.CUSTOMER_ID != null) {
            var CusModelObj = new Object();
            CusModelObj.CUSTOMER_ID = $scope.PaidByEntiSearch.CUSTOMER_ID;
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
        }
        else { $scope.ENTITY_LIST = []; }
    };
    $scope.ADMIN_GET_CUSTOMER = function () {
        var AbsModelObj = new Object();
        AbsModelObj.CUSTOMER_NAME = '';
        AbsModelObj.CUSTOMER_CODE = '';
        AbsModelObj.ACTIVE = 1;
        AbsModelObj.PAGE_NO = 1;
        AbsModelObj.PAGE_SIZE = 1000;//$scope.CustomerSearch.PAGE_SIZE;
        AbsModelObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(AbsModelObj, 'ADMIN_GET_CUSTOMER').then(function (data) {
            $scope.CUSTOMER_LIST = data.data.Table;
        });
    };
    $scope.ADMIN_GET_CUSTOMER();
});
app.controller('CashupTabsController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.$parent.PAGE_HEADER = "Cashup Tabs";
    $scope.$parent.urlpath = "Cashup_Tabs";
    $scope.ENTITY_LIST = [];
    $scope.CUSTOMER_LIST = [];
    $scope.CASHUP_TABS_SETTING = [];
    $scope.CASHUP_TAB_SETTINGS_SELECT = [];
    var CashupTabsObj;
    $scope.CashuptabsSearch = {
        ACTIVE: 0,
        PAGE_NO: 1,
        PAGE_SIZE: 1000,
        CUSTOMER_ID: null,
        ENTITY_ID: null
    };
    $scope.GET_ENTITY_LIST = function () {
        if ($scope.CashuptabsSearch.CUSTOMER_ID != undefined) {
            CashupTabsObj = new Object();
            CashupTabsObj.CUSTOMER_ID = $scope.CashuptabsSearch.CUSTOMER_ID;
            CashupTabsObj.ACTIVE = 1;
            CashupTabsObj.PAGE_NO = 0;
            CashupTabsObj.USER_ID = parseInt($cookies.get("USERID"));
            CashupTabsObj.IS_LIVE = -1;
            PrcCommMethods.ADMIN_API(CashupTabsObj, 'ADMIN_GET_ENTITIES').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.ENTITY_LIST = data.data.Table;
                }
                else { $scope.ENTITY_LIST = []; };
            });
        }
        else { $scope.ENTITY_LIST = []; };
    };

    $scope.ADMIN_GET_CUSTOMER = function () {

        CashupTabsObj = new Object();
        CashupTabsObj.CUSTOMER_NAME = '';
        CashupTabsObj.CUSTOMER_CODE = '';
        CashupTabsObj.ACTIVE = 1;
        CashupTabsObj.PAGE_NO = 1;
        CashupTabsObj.PAGE_SIZE = 1000;//$scope.CustomerSearch.PAGE_SIZE;
        CashupTabsObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(CashupTabsObj, 'ADMIN_GET_CUSTOMER').then(function (data) {
            $scope.CUSTOMER_LIST = data.data.Table;
        });
        CashupTabsObj = null;
    };
    $scope.ADMIN_GET_CUSTOMER();
    $scope.ADMIN_GET_CASHUP_TAB_SETTINGS = function () {
        CashupTabsObj = new Object();
        CashupTabsObj.ENTITY_ID = $scope.CashuptabsSearch.ENTITY_ID;
        PrcCommMethods.ADMIN_API(CashupTabsObj, 'ADMIN_GET_CASHUP_TAB_SETTINGS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.CASHUP_TABS_SETTING = data.data.Table;
            }
        });
    };
    $scope.ADMIN_INS_UPD_CASHUP_TAB_SETTINGS = function () {
        $scope.CashuptabsForm.submitted = true;
        if ($scope.CashuptabsForm.$valid) {
            CashupTabsObj = new Object();
            $scope.CASHUP_TAB_SETTINGS_SELECT = [];
            angular.forEach($scope.CASHUP_TABS_SETTING, function (val) {
                var setting = new Object();
                setting.TABLE_ID = val.TABLE_ID == null ? 0 : val.TABLE_ID;
                setting.CASHUP_TAB_ID = val.CASHUP_TAB_ID;
                setting.FLAG = val.FLAG == true ? 1 : 0;
                $scope.CASHUP_TAB_SETTINGS_SELECT.push(setting);
            });
            if ($scope.CASHUP_TAB_SETTINGS_SELECT.filter(x => x.FLAG == true).length > 0) {
                CashupTabsObj.ENTITY_ID = $scope.CashuptabsSearch.ENTITY_ID;
                CashupTabsObj.USER_ID = parseInt($cookies.get("USERID"));
                CashupTabsObj.CASHUP_TAB_SETTINGS = $scope.CASHUP_TAB_SETTINGS_SELECT;
                try {
                    PrcCommMethods.ADMIN_API(CashupTabsObj, 'ADMIN_INS_UPD_CASHUP_TAB_SETTINGS').then(function (data) {

                        $scope.$parent.ShowAlert("Success", "Saved Successfully", 3000);
                        $scope.CASHUP_TABS_SETTING = [];
                        $scope.ResetTABSETTING();
                        CASHUP_TAB_SETTINGS_SELECT = [];
                    });
                } catch (e) {
                    $scope.$parent.ShowAlert("Error", "Fail", 3000);
                }
                $scope.CashuptabsForm.submitted = false;
            }
            else
                $scope.$parent.ShowAlert("Error", "Please select atlease one Tab from the list.", 3000);
        }
    };
    $scope.ResetTABSETTING = function () {
        $scope.CashuptabsSearch = {
            ACTIVE: 0,
            PAGE_NO: 1,
            PAGE_SIZE: 1000,
            CUSTOMER_ID: null,
            ENTITY_ID: null,
        };
        $scope.CASHUP_TABS_SETTING = [];
        $scope.ENTITY_LIST = [];
        $scope.CashuptabsForm.submitted = false;
    };
});
app.controller('BranchstafftabsController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.$parent.PAGE_HEADER = "Branch Staff Tabs";
    $scope.$parent.urlpath = "Branchstaff_Tabs";
    $scope.ENTITY_LIST = [];
    $scope.CUSTOMER_LIST = [];
    $scope.BRANCH_STAFF_TABS_SETTING = [];
    $scope.BRANCH_STAFF = [];
    $scope.LOCATION = [];
    $scope.BRANCH_LIST = [];
    $scope.TABLE_ID = null;
    var CashupTabsObj;
    $scope.BranchstafftabsSearch = {
        ACTIVE: -1,
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        CUSTOMER_ID: null,
        ENTITY_ID: null,
        BRANCH_ID: null,
        LOCATION_ID: null,
        CLICK_SEARCH: null
    };
    $scope.GET_ENTITY_LIST = function () {
        if ($scope.BranchstafftabsSearch.CUSTOMER_ID != undefined) {
            CashupTabsObj = new Object();
            CashupTabsObj.CUSTOMER_ID = $scope.BranchstafftabsSearch.CUSTOMER_ID;
            CashupTabsObj.ACTIVE = 1;
            CashupTabsObj.PAGE_NO = 0;
            CashupTabsObj.USER_ID = parseInt($cookies.get("USERID"));
            CashupTabsObj.IS_LIVE = -1;
            PrcCommMethods.ADMIN_API(CashupTabsObj, 'ADMIN_GET_ENTITIES').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.ENTITY_LIST = data.data.Table;
                }
                else { $scope.ENTITY_LIST = []; };
            });
        }
        else { $scope.ENTITY_LIST = []; };
    };
    $scope.ADMIN_GET_CUSTOMER = function () {

        CashupTabsObj = new Object();
        CashupTabsObj.CUSTOMER_NAME = '';
        CashupTabsObj.CUSTOMER_CODE = '';
        CashupTabsObj.ACTIVE = 1;
        CashupTabsObj.PAGE_NO = 1;
        CashupTabsObj.PAGE_SIZE = 1000;//$scope.CustomerSearch.PAGE_SIZE;
        CashupTabsObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(CashupTabsObj, 'ADMIN_GET_CUSTOMER').then(function (data) {
            $scope.CUSTOMER_LIST = data.data.Table;
        });
        CashupTabsObj = null;
    };
    $scope.GET_LOCATION = function () {
        if ($scope.BranchstafftabsSearch.ENTITY_ID != undefined && $scope.BranchstafftabsSearch.ENTITY_ID != null) {
            var GET_ALL = new Object()
            GET_ALL.ENTITY_ID = $scope.BranchstafftabsSearch.ENTITY_ID;//ENT[0].ENTITY_ID;
            GET_ALL.CUSTOMER_ID = $scope.BranchstafftabsSearch.CUSTOMER_ID;//ENT[0].CUSTOMER_ID;
            GET_ALL.LOCATION_NAME = null;
            GET_ALL.LOCATION_CODE = null;
            GET_ALL.ACTIVE = 1;
            GET_ALL.PAGE_NO = 1;
            GET_ALL.PAGE_SIZE = 1000;
            GET_ALL.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.ADMIN_API(GET_ALL, 'ADMIN_GET_LOCATION').then(function (data) {
                $scope.LOCATION = data.data.Table;
            });
        }
        else {
            $scope.LOCATION = [];
            $scope.BRANCH_LIST = [];
        }
    };
    $scope.ADMIN_GET_BRANCH = function () {
        if ($scope.BranchstafftabsSearch.LOCATION_ID != null && $scope.BranchstafftabsSearch.LOCATION_ID != undefined) {
            var CashupTabsObj = new Object();
            CashupTabsObj.CUSTOMER_ID = $scope.BranchstafftabsSearch.CUSTOMER_ID;
            CashupTabsObj.ENTITY_ID = $scope.BranchstafftabsSearch.ENTITY_ID;
            CashupTabsObj.BRANCH_CODE = $scope.BranchstafftabsSearch.BRANCH_CODE;
            CashupTabsObj.BRANCH_NAME = $scope.BranchstafftabsSearch.BRANCH_NAME;
            CashupTabsObj.CONTACT_NAME = $scope.BranchstafftabsSearch.CONTACT_NAME;
            CashupTabsObj.LOCATION_IDS = $scope.BranchstafftabsSearch.LOCATION_ID;
            CashupTabsObj.ACTIVE = 1;//$scope.BrachSearch.ACTIVE ? 1 : 0;
            CashupTabsObj.PAGE_NO = 1;
            CashupTabsObj.PAGE_SIZE = 1000;
            CashupTabsObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.ADMIN_API(CashupTabsObj, 'ADMIN_GET_BRANCH').then(function (data) {
                $scope.BRANCH_LIST = data.data.Table;
            });
        }
        else
            $scope.BRANCH_LIST = [];
    };
    $scope.ADMIN_GET_CUSTOMER();
    $scope.ADMIN_GET_BRANCH_STAFF = function (FLAG) {
        CashupTabsObj = new Object();
        if (FLAG == 1) {
            $scope.BranchstafftabsSearch.CLICK_SEARCH = 1;
            $scope.BRANCH_STAFF_TABS_SETTING = [];
            $scope.BranchstafftabsSearch.PAGE_NO = 1;
            CashupTabsObj.ACTIVE = $scope.BranchstafftabsSearch.ACTIVE == -1 ? -1 : $scope.BranchstafftabsSearch.ACTIVE ? 1 : 0;
        }
        else if (FLAG == 2) {
            $scope.BRANCH_STAFF_TABS_SETTING = [];
            CashupTabsObj.ACTIVE = -1;
            CashupTabsObj.ACTIVE = $scope.BranchstafftabsSearch.ACTIVE == -1 ? -1 : $scope.BranchstafftabsSearch.ACTIVE ? 1 : 0;
        }
        else if (FLAG == undefined) {
            if ($scope.BranchstafftabsSearch.CLICK_SEARCH == 1)
                CashupTabsObj.ACTIVE = $scope.BranchstafftabsSearch.ACTIVE == -1 ? -1 : $scope.BranchstafftabsSearch.ACTIVE ? 1 : 0;
            else {
                CashupTabsObj.ACTIVE = -1;
            }
        }
        CashupTabsObj.CUSTOMER_ID = $scope.BranchstafftabsSearch.CLICK_SEARCH == 1 ? $scope.BranchstafftabsSearch.CUSTOMER_ID : null;
        CashupTabsObj.ENTITY_ID = $scope.BranchstafftabsSearch.CLICK_SEARCH == 1 ? $scope.BranchstafftabsSearch.ENTITY_ID : null;
        CashupTabsObj.LOCATION_ID = $scope.BranchstafftabsSearch.CLICK_SEARCH == 1 ? $scope.BranchstafftabsSearch.LOCATION_ID : null;
        CashupTabsObj.BRANCH_ID = $scope.BranchstafftabsSearch.CLICK_SEARCH == 1 ? $scope.BranchstafftabsSearch.BRANCH_ID : null;
        //CashupTabsObj.ACTIVE = -1;
        CashupTabsObj.STAFF_NAME = $scope.BranchstafftabsSearch.CLICK_SEARCH == 1 ? $scope.BranchstafftabsSearch.STAFF_NAME : null;
        CashupTabsObj.PAGE_NO = $scope.BranchstafftabsSearch.PAGE_NO;
        CashupTabsObj.PAGE_SIZE = $scope.BranchstafftabsSearch.PAGE_SIZE;
        PrcCommMethods.ADMIN_API(CashupTabsObj, 'ADMIN_GET_BRANCH_STAFF').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.BRANCH_STAFF_TABS_SETTING = $scope.BRANCH_STAFF_TABS_SETTING.concat(data.data.Table);
                if (data.data.Table.length < $scope.BranchstafftabsSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.BranchstafftabsSearch.PAGE_NO = parseInt($scope.BranchstafftabsSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else {
                $scope.GetData = false;
            }
        });

    };
    $scope.ADMIN_GET_BRANCH_STAFF();
    $scope.ADMIN_INS_UPD_BRANCH_STAFF = function () {
        $scope.BranchstafftabsForm.submitted = true;
        if ($scope.BranchstafftabsForm.$valid) {
            if ($scope.BranchstafftabsSearch.ACTIVE != -1) {
                CashupTabsObj = new Object();
                $scope.BRANCH_STAFF = [];
                CashupTabsObj.ENTITY_ID = $scope.BranchstafftabsSearch.ENTITY_ID;
                CashupTabsObj.BRANCH_ID = $scope.BranchstafftabsSearch.BRANCH_ID;
                CashupTabsObj.USER_ID = parseInt($cookies.get("USERID"));
                var OBJBRANCH_STAFF = new Object();
                OBJBRANCH_STAFF.TABLE_ID = $scope.TABLE_ID == null ? 0 : $scope.TABLE_ID;
                OBJBRANCH_STAFF.NAME = $scope.BranchstafftabsSearch.STAFF_NAME;
                OBJBRANCH_STAFF.ACTIVE = $scope.BranchstafftabsSearch.ACTIVE;
                $scope.BRANCH_STAFF.push(OBJBRANCH_STAFF);
                CashupTabsObj.BRANCH_STAFF = $scope.BRANCH_STAFF;
                PrcCommMethods.ADMIN_API(CashupTabsObj, 'ADMIN_INS_UPD_BRANCH_STAFF').then(function (data) {
                    $scope.$parent.ShowAlert("Success", "Saved Successfully", 3000);
                    $scope.ResetBRNSTAFF();
                });
            }
            else { $scope.$parent.ShowAlert('Attention', 'Please Select Active/In-Active Option.', 3000); $scope.BranchstafftabsForm.submitted = false; }
        }

    };
    $scope.EDIT_INS_UPD_BRANCH_STAFF = function (BRN) {
        $scope.BranchstafftabsSearch.ENTITY_ID = BRN.ENTITY_ID;
        $scope.BranchstafftabsSearch.CUSTOMER_ID = BRN.CUSTOMER_ID;
        $scope.BranchstafftabsSearch.BRANCH_ID = BRN.BRANCH_ID;
        $scope.BranchstafftabsSearch.LOCATION_ID = BRN.LOCATION_ID;
        $scope.BranchstafftabsSearch.ACTIVE = BRN.ACTIVE == true ? 1 : 0;
        $scope.BranchstafftabsSearch.STAFF_NAME = BRN.NAME;
        $scope.TABLE_ID = BRN.TABLE_ID;
        $scope.GET_ENTITY_LIST();
        $scope.GET_LOCATION();
        $scope.ADMIN_GET_BRANCH();
    }
    $scope.ResetBRNSTAFF = function () {
        $scope.BranchstafftabsSearch = {
            ACTIVE: -1,
            PAGE_NO: 1,
            PAGE_SIZE: 10,
            CUSTOMER_ID: null,
            ENTITY_ID: null,
            BRANCH_ID: null,
            LOCATION_ID: null,
            STAFF_NAME: '',
            CLICK_SEARCH: null
        };
        $scope.TABLE_ID = null;
        $scope.BranchstafftabsForm.submitted = false;
        $scope.ENTITY_LIST = [];
        $scope.LOCATION = [];
        $scope.BRANCH_LIST = [];
        $scope.ADMIN_GET_BRANCH_STAFF(2);
    };
    $scope.LAZY_GET_BRANCH_STAFF = function () {
        $scope.ADMIN_GET_BRANCH_STAFF();
    };
});
app.controller('PDQController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.$parent.PAGE_HEADER = "PDQ";
    $scope.$parent.urlpath = "PDQ";
    $scope.ENTITY_LIST = [];
    $scope.CUSTOMER_LIST = [];
    $scope.PDQ_LIST = [];
    $scope.LOCATION = [];
    $scope.BRANCH_LIST = [];
    $scope.TABLE_ID = null;
    var CommonObj;
    $scope.PDQSearch = {
        ACTIVE: -1,
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        CUSTOMER_ID: null,
        ENTITY_ID: null,
        BRANCH_ID: null,
        LOCATION_ID: null,
        CLICK_SEARCH: null
    };

    $scope.ADMIN_GET_CUSTOMER = function () {
        CommonObj = new Object();
        CommonObj.CUSTOMER_NAME = '';
        CommonObj.CUSTOMER_CODE = '';
        CommonObj.ACTIVE = 1;
        CommonObj.PAGE_NO = 1;
        CommonObj.PAGE_SIZE = 1000;//$scope.CustomerSearch.PAGE_SIZE;
        CommonObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(CommonObj, 'ADMIN_GET_CUSTOMER').then(function (data) {
            $scope.CUSTOMER_LIST = data.data.Table;
        });
        CashupTabsObj = null;
    };
    $scope.ADMIN_GET_CUSTOMER();
    $scope.GET_ENTITY_LIST = function () {
        if ($scope.PDQSearch.CUSTOMER_ID != undefined) {
            CommonObj = new Object();
            CommonObj.CUSTOMER_ID = $scope.PDQSearch.CUSTOMER_ID;
            CommonObj.ACTIVE = 1;
            CommonObj.PAGE_NO = 0;
            CommonObj.PAGE_SIZE = 1000;
            CommonObj.USER_ID = parseInt($cookies.get("USERID"));
            CommonObj.IS_LIVE = -1;
            PrcCommMethods.ADMIN_API(CommonObj, 'ADMIN_GET_ENTITIES').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.ENTITY_LIST = data.data.Table;
                }
                else { $scope.ENTITY_LIST = []; };
            });
        }
        else { $scope.ENTITY_LIST = []; };
    };
    $scope.GET_LOCATION = function () {
        if ($scope.PDQSearch.ENTITY_ID != undefined && $scope.PDQSearch.ENTITY_ID != null) {
            CommonObj = new Object()
            CommonObj.ENTITY_ID = $scope.PDQSearch.ENTITY_ID;//ENT[0].ENTITY_ID;
            CommonObj.CUSTOMER_ID = $scope.PDQSearch.CUSTOMER_ID;//ENT[0].CUSTOMER_ID;
            CommonObj.LOCATION_NAME = null;
            CommonObj.LOCATION_CODE = null;
            CommonObj.ACTIVE = 1;
            CommonObj.PAGE_NO = 1;
            CommonObj.PAGE_SIZE = 1000;
            CommonObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.ADMIN_API(CommonObj, 'ADMIN_GET_LOCATION').then(function (data) {
                $scope.LOCATION = data.data.Table;
            });
        }
        else {
            $scope.LOCATION = [];
            $scope.BRANCH_LIST = [];
        }
    };
    $scope.ADMIN_GET_BRANCH = function () {
        if ($scope.PDQSearch.LOCATION_ID != null && $scope.PDQSearch.LOCATION_ID != undefined) {
            CommonObj = new Object();
            CommonObj.CUSTOMER_ID = $scope.PDQSearch.CUSTOMER_ID;
            CommonObj.ENTITY_ID = $scope.PDQSearch.ENTITY_ID;
            CommonObj.BRANCH_CODE = $scope.PDQSearch.BRANCH_CODE;
            CommonObj.BRANCH_NAME = $scope.PDQSearch.BRANCH_NAME;
            CommonObj.CONTACT_NAME = $scope.PDQSearch.CONTACT_NAME;
            CommonObj.LOCATION_IDS = $scope.PDQSearch.LOCATION_ID;
            CommonObj.ACTIVE = 1;//$scope.BrachSearch.ACTIVE ? 1 : 0;
            CommonObj.PAGE_NO = 1;
            CommonObj.PAGE_SIZE = 1000;
            CommonObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.ADMIN_API(CommonObj, 'ADMIN_GET_BRANCH').then(function (data) {
                $scope.BRANCH_LIST = data.data.Table;
            });
        }
        else
            $scope.BRANCH_LIST = [];
    };

    $scope.ADMIN_GET_PDQ_MASTER = function (FLAG) {
        CommonObj = new Object();
        if (FLAG == 1) {
            $scope.PDQSearch.CLICK_SEARCH = 1;
            $scope.PDQ_LIST = [];
            $scope.PDQSearch.PAGE_NO = 1;
            CommonObj.ACTIVE = $scope.PDQSearch.ACTIVE == -1 ? -1 : $scope.PDQSearch.ACTIVE == 1 ? 1 : 0;
        }
        else if (FLAG == 2) {
            $scope.PDQ_LIST = [];
            CommonObj.ACTIVE = $scope.PDQSearch.ACTIVE == -1 ? -1 : $scope.PDQSearch.ACTIVE == 1 ? 1 : 0;
            $scope.PDQSearch.PAGE_NO = 1;
        }
        else if (FLAG == undefined) {
            if ($scope.PDQSearch.CLICK_SEARCH == 1)
                CommonObj.ACTIVE = $scope.PDQSearch.ACTIVE == -1 ? -1 : $scope.PDQSearch.ACTIVE == 1 ? 1 : 0;
            else {
                CommonObj.ACTIVE = -1;
            }
        }
        CommonObj.PDQ_MASTER_ID = $scope.PDQ_MASTER_ID != null ? $scope.PDQ_MASTER_ID : null;
        CommonObj.CUSTOMER_ID = $scope.PDQSearch.CLICK_SEARCH == 1 ? $scope.PDQSearch.CUSTOMER_ID : null;
        CommonObj.LOCATION = $scope.PDQSearch.CLICK_SEARCH == 1 ? $scope.PDQSearch.LOCATION_ID : null;
        CommonObj.PDQ_CODE = $scope.PDQSearch.CLICK_SEARCH == 1 ? $scope.PDQSearch.PDQ_CODE : '';
        CommonObj.ENTITY_ID = $scope.PDQSearch.CLICK_SEARCH == 1 ? $scope.PDQSearch.ENTITY_ID : null;
        CommonObj.BRANCH_ID = $scope.PDQSearch.CLICK_SEARCH == 1 ? $scope.PDQSearch.BRANCH_ID : null;
        CommonObj.USER_ID = parseInt($cookies.get("USERID"));
        CommonObj.PAGE_NO = $scope.PDQSearch.PAGE_NO;
        CommonObj.PAGE_SIZE = $scope.PDQSearch.PAGE_SIZE;
        PrcCommMethods.ADMIN_API(CommonObj, 'ADMIN_GET_PDQ_MASTER').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.PDQ_LIST = $scope.PDQ_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.PDQSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.PDQSearch.PAGE_NO = parseInt($scope.PDQSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else {
                $scope.GetData = false;
            }
        });

    };
    $scope.ADMIN_GET_PDQ_MASTER();
    $scope.ADMIN_INS_UPD_PDQ_MASTER = function () {
        $scope.PDQForm.submitted = true;
        if ($scope.PDQForm.$valid) {
            CommonObj = new Object();
            CommonObj.PDQ_MASTER_ID = $scope.PDQ_MASTER_ID == null || undefined ? 0 : $scope.PDQ_MASTER_ID;
            CommonObj.PDQ_CODE = $scope.PDQSearch.PDQ_CODE;
            CommonObj.ENTITY_ID = $scope.PDQSearch.ENTITY_ID;
            CommonObj.BRANCH_ID = $scope.PDQSearch.BRANCH_ID;
            CommonObj.ACTIVE = $scope.PDQSearch.ACTIVE == -1 ? -1 : $scope.PDQSearch.ACTIVE == 1 ? 1 : 0;
            CommonObj.USER_ID = parseInt($cookies.get("USERID"));
            if (CommonObj.ACTIVE != -1) {
                PrcCommMethods.ADMIN_API(CommonObj, 'ADMIN_INS_UPD_PDQ_MASTER').then(function (data) {
                    $scope.$parent.ShowAlert("Success", "Saved Successfully", 3000);
                    $scope.ResetPDQ();
                });
            }
            else { $scope.$parent.ShowAlert("Attention", "Please select Active/Inactive option.", 3000); $scope.PDQForm.submitted = false; }

        }
    };
    $scope.EDIT_INS_UPD_PDQ_MASTER = function (PDQ) {
        $scope.PDQ_MASTER_ID = PDQ.PDQ_MASTER_ID;
        $scope.PDQSearch.CUSTOMER_ID = PDQ.CUSTOMER_ID;
        $scope.PDQSearch.ENTITY_ID = PDQ.ENTITY_ID;
        $scope.PDQSearch.BRANCH_ID = PDQ.BRANCH_ID;
        $scope.PDQSearch.LOCATION_ID = PDQ.LOCATION_ID;
        $scope.PDQSearch.ACTIVE = PDQ.ACTIVE == true ? 1 : 0;
        $scope.PDQSearch.PDQ_CODE = PDQ.PDQ_CODE;

        $scope.GET_ENTITY_LIST();
        $scope.GET_LOCATION();
        $scope.ADMIN_GET_BRANCH();
    };
    $scope.ResetPDQ = function () {
        $scope.PDQSearch = {
            ACTIVE: -1,
            PAGE_NO: 1,
            PAGE_SIZE: 10,
            CUSTOMER_ID: null,
            ENTITY_ID: null,
            BRANCH_ID: null,
            LOCATION_ID: null,
            PDQ_CODE: '',
            CLICK_SEARCH: null
        };
        $scope.PDQForm.submitted = false;
        $scope.PDQ_LIST = [];
        $scope.ENTITY_LIST = [];
        $scope.LOCATION = [];
        $scope.BRANCH_LIST = [];
        $scope.PDQ_MASTER_ID = null;
        $scope.ADMIN_GET_PDQ_MASTER(2);
    };
    $scope.LAZY_GET_PDQ = function () {
        $scope.ADMIN_GET_PDQ_MASTER();
    };
});
app.controller('ReasonforComplimentaryController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.$parent.PAGE_HEADER = "Complimentary";
    $scope.$parent.urlpath = "Reasonfor_Complimentary";
    $scope.ENTITY_LIST = [];
    $scope.CUSTOMER_LIST = [];
    $scope.COMPLIMETARY_LIST = [];
    var CommonObj;
    $scope.ComplimentarySearch = {
        ACTIVE: -1,
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        CUSTOMER_ID: null,
        ENTITY_ID: null,
        REASON: '',
        COMMENTS: '',
        CLICK_SEARCH: null
    };

    $scope.ADMIN_GET_CUSTOMER = function () {
        CommonObj = new Object();
        CommonObj.CUSTOMER_NAME = '';
        CommonObj.ACTIVE = 1;
        CommonObj.PAGE_NO = 1;
        CommonObj.PAGE_SIZE = 1000;//$scope.CustomerSearch.PAGE_SIZE;
        CommonObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(CommonObj, 'ADMIN_GET_CUSTOMER').then(function (data) {
            $scope.CUSTOMER_LIST = data.data.Table;
        });
        CashupTabsObj = null;
    };
    $scope.ADMIN_GET_CUSTOMER();
    $scope.GET_ENTITY_LIST = function () {
        if ($scope.ComplimentarySearch.CUSTOMER_ID != undefined) {
            CommonObj = new Object();
            CommonObj.CUSTOMER_ID = $scope.ComplimentarySearch.CUSTOMER_ID;
            CommonObj.ACTIVE = 1;
            CommonObj.PAGE_NO = 0;
            CommonObj.PAGE_SIZE = 1000;
            CommonObj.USER_ID = parseInt($cookies.get("USERID"));
            CommonObj.IS_LIVE = -1;
            PrcCommMethods.ADMIN_API(CommonObj, 'ADMIN_GET_ENTITIES').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.ENTITY_LIST = data.data.Table;
                }
                else { $scope.ENTITY_LIST = []; };
            });
        }
        else { $scope.ENTITY_LIST = []; };
    };
    $scope.ADMIN_GET_REASON_FOR_COMP = function (FLAG) {
        CommonObj = new Object();
        if (FLAG == 1) {
            $scope.ComplimentarySearch.CLICK_SEARCH = 1;
            $scope.COMPLIMETARY_LIST = [];
            $scope.ComplimentarySearch.PAGE_NO = 1;
            //CommonObj.ACTIVE = $scope.ComplimentarySearch.ACTIVE ? 1 : 0;
            CommonObj.ACTIVE = $scope.ComplimentarySearch.ACTIVE == -1 ? -1 : $scope.ComplimentarySearch.ACTIVE ? 1 : 0;
        }
        else if (FLAG == 2) {
            $scope.COMPLIMETARY_LIST = [];
            CommonObj.ACTIVE = -1;
            CommonObj.ACTIVE = $scope.ComplimentarySearch.ACTIVE == -1 ? -1 : $scope.ComplimentarySearch.ACTIVE ? 1 : 0;
        }
        else if (FLAG == undefined) {
            if ($scope.ComplimentarySearch.CLICK_SEARCH == 1)
                CommonObj.ACTIVE = $scope.ComplimentarySearch.ACTIVE == -1 ? -1 : $scope.ComplimentarySearch.ACTIVE ? 1 : 0;
            else {
                CommonObj.ACTIVE = -1;
            }
        }
        CommonObj.REASON_FOR_COMP_ID = $scope.ComplimentarySearch.CLICK_SEARCH == 1 ? ($scope.REASON_FOR_COMP_ID == undefined ? '' : $scope.REASON_FOR_COMP_ID) : null;
        CommonObj.ENTITY_ID = $scope.ComplimentarySearch.CLICK_SEARCH == 1 ? $scope.ComplimentarySearch.ENTITY_ID : null;
        CommonObj.REASON = $scope.ComplimentarySearch.CLICK_SEARCH == 1 ? $scope.ComplimentarySearch.REASON : null;
        CommonObj.CUSTOMER_ID = $scope.ComplimentarySearch.CLICK_SEARCH == 1 ? $scope.ComplimentarySearch.CUSTOMER_ID : null;
        CommonObj.PAGE_NO = $scope.ComplimentarySearch.PAGE_NO;
        CommonObj.PAGE_SIZE = $scope.ComplimentarySearch.PAGE_SIZE;
        PrcCommMethods.ADMIN_API(CommonObj, 'ADMIN_GET_REASON_FOR_COMP').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.COMPLIMETARY_LIST = $scope.COMPLIMETARY_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.ComplimentarySearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.ComplimentarySearch.PAGE_NO = parseInt($scope.ComplimentarySearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else {
                $scope.GetData = false;
            }
        });

    };
    $scope.ADMIN_GET_REASON_FOR_COMP();
    $scope.ADMIN_INS_UPD_REASON_FOR_COMP = function () {
        $scope.ComplimentaryForm.submitted = true;
        if ($scope.ComplimentaryForm.$valid) {
            if ($scope.ComplimentarySearch.ACTIVE != -1) {
                CommonObj = new Object();
                CommonObj.REASON_FOR_COMP_ID = $scope.REASON_FOR_COMP_ID == null || undefined ? 0 : $scope.REASON_FOR_COMP_ID;
                CommonObj.REASON = $scope.ComplimentarySearch.REASON;
                CommonObj.CUSTOMER_ID = $scope.ComplimentarySearch.CUSTOMER_ID;
                CommonObj.ENTITY_ID = $scope.ComplimentarySearch.ENTITY_ID;
                CommonObj.ACTIVE = $scope.ComplimentarySearch.ACTIVE ? 1 : 0;
                CommonObj.COMMENTS = $scope.ComplimentarySearch.COMMENTS;
                CommonObj.USER_ID = parseInt($cookies.get("USERID"));
                PrcCommMethods.ADMIN_API(CommonObj, 'ADMIN_INS_UPD_REASON_FOR_COMP').then(function (data) {
                    $scope.$parent.ShowAlert("Success", "Saved Successfully", 3000);
                    $scope.ResetCOMPLIMENTARY();
                });
            }
            else {
                $scope.$parent.ShowAlert('Attention', 'Please Select Active/In-Active Option.', 3000);
                $scope.ComplimentaryForm.submitted = false;
            }
        }
    };
    $scope.EDIT_INS_UPD_REASON_FOR_COMP = function (COMP) {
        $scope.REASON_FOR_COMP_ID = COMP.REASON_FOR_COMP_ID;
        $scope.ComplimentarySearch.REASON = COMP.REASON;
        $scope.ComplimentarySearch.ACTIVE = COMP.ACTIVE == true ? 1 : 0;
        $scope.ComplimentarySearch.CUSTOMER_ID = COMP.CUSTOMER_ID;
        $scope.ComplimentarySearch.ENTITY_ID = COMP.ENTITY_ID;
        $scope.ComplimentarySearch.COMMENTS = COMP.COMMENTS;
        $scope.GET_ENTITY_LIST();
    };
    $scope.ResetCOMPLIMENTARY = function () {
        $scope.ComplimentarySearch = {
            ACTIVE: -1,
            PAGE_NO: 1,
            PAGE_SIZE: 10,
            CUSTOMER_ID: null,
            ENTITY_ID: null,
            REASON: null,
            COMMENTS: '',
            CLICK_SEARCH: null
        }
        $scope.ComplimentaryForm.submitted = false;
        $scope.ENTITY_LIST = [];
        $scope.REASON_FOR_COMP_ID = null;
        $scope.ADMIN_GET_REASON_FOR_COMP(2);
    };
    $scope.LAZY_ADMIN_GET_REASON_FOR_COMP = function () {
        $scope.ADMIN_GET_REASON_FOR_COMP();
    };
});
app.controller('PettyCashMappingController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {

    $scope.$parent.PAGE_HEADER = "Petty Cash Mapping";
    $scope.$parent.urlpath = "PettyCashMapping";
    $scope.ENTITY_LIST = [];
    $scope.CUSTOMER_LIST = [];
    $scope.LOCATION = [];
    $scope.BRANCH_LIST = [];
    $scope.PETTY_CASH = [];
    $scope.TABLE_ID = null;
    var CommonObj;
    $scope.PettycashSearch = {
        // ACTIVE: 0,
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        CUSTOMER_ID: null,
        ENTITY_ID: null,
        BRANCH_ID: null,
        LOCATION_ID: null
    };
    $scope.GET_ENTITY_LIST = function () {
        if ($scope.PettycashSearch.CUSTOMER_ID != undefined) {
            CommonObj = new Object();
            CommonObj.CUSTOMER_ID = $scope.PettycashSearch.CUSTOMER_ID;
            CommonObj.ACTIVE = 1;
            CommonObj.PAGE_NO = 0;
            CommonObj.USER_ID = parseInt($cookies.get("USERID"));
            CommonObj.PAGE_SIZE = 1000;
            CommonObj.IS_LIVE = -1;
            PrcCommMethods.ADMIN_API(CommonObj, 'ADMIN_GET_ENTITIES').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.ENTITY_LIST = data.data.Table;
                    $scope.PETTY_CASH = [];
                }
                else {
                    $scope.ENTITY_LIST = [];
                    $scope.PETTY_CASH = [];
                };

            });
        }
        else { $scope.ENTITY_LIST = []; };
    };
    $scope.ADMIN_GET_CUSTOMER = function () {

        CommonObj = new Object();
        CommonObj.CUSTOMER_NAME = '';
        CommonObj.CUSTOMER_CODE = '';
        CommonObj.ACTIVE = 1;
        CommonObj.PAGE_NO = 1;
        CommonObj.PAGE_SIZE = 1000;//$scope.CustomerSearch.PAGE_SIZE;
        CommonObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(CommonObj, 'ADMIN_GET_CUSTOMER').then(function (data) {
            $scope.CUSTOMER_LIST = data.data.Table;
        });
        CashupTabsObj = null;
    };
    $scope.GET_LOCATION = function () {
        if ($scope.PettycashSearch.ENTITY_ID != undefined && $scope.PettycashSearch.ENTITY_ID != null) {
            CommonObj = new Object()
            CommonObj.ENTITY_ID = $scope.PettycashSearch.ENTITY_ID;//ENT[0].ENTITY_ID;
            CommonObj.CUSTOMER_ID = $scope.PettycashSearch.CUSTOMER_ID;//ENT[0].CUSTOMER_ID;
            CommonObj.LOCATION_NAME = null;
            CommonObj.LOCATION_CODE = null;
            CommonObj.ACTIVE = 1;
            CommonObj.PAGE_NO = 1;
            CommonObj.PAGE_SIZE = 1000;
            CommonObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.ADMIN_API(CommonObj, 'ADMIN_GET_LOCATION').then(function (data) {
                $scope.LOCATION = data.data.Table;
                $scope.PETTY_CASH = [];
            });
        }
        else {
            $scope.LOCATION = [];
            $scope.BRANCH_LIST = [];
            $scope.PETTY_CASH = [];
        }
    };
    $scope.ADMIN_GET_BRANCH = function () {
        if ($scope.PettycashSearch.LOCATION_ID != null && $scope.PettycashSearch.LOCATION_ID != undefined) {
            CommonObj = new Object();
            CommonObj.CUSTOMER_ID = $scope.PettycashSearch.CUSTOMER_ID;
            CommonObj.ENTITY_ID = $scope.PettycashSearch.ENTITY_ID;
            CommonObj.BRANCH_CODE = $scope.PettycashSearch.BRANCH_CODE;
            CommonObj.BRANCH_NAME = $scope.PettycashSearch.BRANCH_NAME;
            CommonObj.CONTACT_NAME = $scope.PettycashSearch.CONTACT_NAME;
            CommonObj.LOCATION_IDS = $scope.PettycashSearch.LOCATION_ID;
            CommonObj.ACTIVE = 1;//$scope.BrachSearch.ACTIVE ? 1 : 0;
            CommonObj.PAGE_NO = 1;
            CommonObj.PAGE_SIZE = 1000;
            CommonObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.ADMIN_API(CommonObj, 'ADMIN_GET_BRANCH').then(function (data) {
                $scope.BRANCH_LIST = data.data.Table;
                $scope.PETTY_CASH = [];
            });
        }
        else
            $scope.BRANCH_LIST = [];
        $scope.PETTY_CASH = [];
    };
    $scope.ADMIN_GET_CUSTOMER();
    $scope.ADMIN_GET_PETTY_CASH_CAT_MAPPING = function () {

        if ($scope.PettycashSearch.BRANCH_ID != null && $scope.PettycashSearch.BRANCH_ID != undefined) {
            CommonObj = new Object();
            CommonObj.ENTITY_ID = $scope.PettycashSearch.ENTITY_ID;
            CommonObj.BRANCH_ID = $scope.PettycashSearch.BRANCH_ID;
            PrcCommMethods.ADMIN_API(CommonObj, 'ADMIN_GET_PETTY_CASH_CAT_MAPPING').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.PETTY_CASH = data.data.Table;
                }
                else {
                    $scope.PETTY_CASH = [];
                }
            });
        }
    };

    $scope.ADMIN_INS_UPD_PETTY_CASH_CAT_MAPPING = function () {
        $scope.PettycashmappingForm.submitted = true;
        if ($scope.PettycashmappingForm.$valid) {

            CommonObj = new Object();
            var PETTY_CASH_CAT_IDS = '';
            angular.forEach($scope.PETTY_CASH, function (item) {
                if (item.SELECTED == true) {
                    if (PETTY_CASH_CAT_IDS == '') {
                        PETTY_CASH_CAT_IDS = item.PETTY_CASH_CAT_ID;
                    }
                    else {
                        PETTY_CASH_CAT_IDS = PETTY_CASH_CAT_IDS + ',' + item.PETTY_CASH_CAT_ID;
                    }
                }
            });
            if (PETTY_CASH_CAT_IDS != '') {
                CommonObj.ENTITY_ID = $scope.PettycashSearch.ENTITY_ID;
                CommonObj.BRANCH_ID = $scope.PettycashSearch.BRANCH_ID;
                CommonObj.USER_ID = parseInt($cookies.get("USERID"));
                CommonObj.PETTY_CASH_CAT_IDS = PETTY_CASH_CAT_IDS;
                CommonObj.COMMENT = $scope.PettycashSearch.COMMENTS;
                PrcCommMethods.ADMIN_API(CommonObj, 'ADMIN_INS_UPD_PETTY_CASH_CAT_MAPPING').then(function (data) {
                    if (data.data == 0) {
                        $scope.$parent.ShowAlert("Error", "Unable to save data, please connect support.", 3000);
                        PETTY_CASH_CAT_IDS = null;
                    }
                    else {
                        $scope.$parent.ShowAlert("Success", "Saved Successfully", 3000);
                        PETTY_CASH_CAT_IDS = null;
                        $scope.ResetPETTYCASH();
                    }

                });
            }
            else
                $scope.$parent.ShowAlert("Error", "Please select at lease one petty cash from the list", 3000);
        }

    };
    $scope.EDIT_ADMIN_INS_UPD_PETTY_CASH_CAT_MAPPING = function (PETTY) {
        $scope.PettycashSearch.ENTITY_ID = PETTY.ENTITY_ID;
        $scope.PettycashSearch.CUSTOMER_ID = PETTY.CUSTOMER_ID;
        $scope.PettycashSearch.BRANCH_ID = PETTY.BRANCH_ID;
        $scope.PettycashSearch.LOCATION_ID = PETTY.LOCATION_ID;
        $scope.PettycashSearch.ACTIVE = PETTY.ACTIVE;
        $scope.PettycashSearch.STAFF_NAME = PETTY.NAME;
        $scope.TABLE_ID = PETTY.TABLE_ID;
        $scope.GET_ENTITY_LIST();
        $scope.GET_LOCATION();
        $scope.ADMIN_GET_BRANCH();
    }
    $scope.ResetPETTYCASH = function () {

        $scope.PettycashSearch = {
            // ACTIVE: 0,
            PAGE_NO: 1,
            PAGE_SIZE: 1000,
            CUSTOMER_ID: null,
            ENTITY_ID: null,
            BRANCH_ID: null,
            LOCATION_ID: null,
            STAFF_NAME: ''
        }
        $scope.PettycashmappingForm.submitted = false;
        $scope.ENTITY_LIST = [];
        $scope.LOCATION = [];
        $scope.BRANCH_LIST = [];
        $scope.PETTY_CASH = [];
    };

});
app.controller('PettyCashController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.$parent.PAGE_HEADER = "Petty Cash";
    $scope.$parent.urlpath = "PettyCash";
    $scope.PETTY_CASH = [];
    $scope.TABLE_ID = null;
    var CommonObj;
    $scope.PettycashSearch = {
        ACTIVE: -1,
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        PETTY_CASH_CAT_NAME: '',
        CLICK_SEARCH: null
    };
    $scope.ADMIN_GET_PETTY_CASH_CAT = function (FLAG) {

        CommonObj = new Object();
        if (FLAG == 1) {
            $scope.PettycashSearch.CLICK_SEARCH = 1;
            $scope.PETTY_CASH = [];
            $scope.PettycashSearch.PAGE_NO = 1;
            //CommonObj.ACTIVE = $scope.PettycashSearch.ACTIVE ? 1 : 0;
            CommonObj.ACTIVE = $scope.PettycashSearch.ACTIVE == -1 ? -1 : $scope.PettycashSearch.ACTIVE ? 1 : 0;
        }
        else if (FLAG == 2) {
            $scope.PETTY_CASH = [];
            $scope.PettycashSearch.PAGE_NO = 1;
            CommonObj.ACTIVE = $scope.PettycashSearch.ACTIVE == -1 ? -1 : $scope.PettycashSearch.ACTIVE ? 1 : 0;
        }
        else if (FLAG == undefined) {
            if ($scope.PettycashSearch.CLICK_SEARCH == 1)
                CommonObj.ACTIVE = $scope.PettycashSearch.ACTIVE == -1 ? -1 : $scope.PettycashSearch.ACTIVE ? 1 : 0;
            else
                CommonObj.ACTIVE = -1;
        }
        CommonObj.PETTY_CASH_CAT_NAME = $scope.PettycashSearch.CLICK_SEARCH == 1 ? $scope.PettycashSearch.PETTY_CASH_CAT_NAME : '';
        CommonObj.PAGE_NO = $scope.PettycashSearch.PAGE_NO;
        CommonObj.PAGE_SIZE = $scope.PettycashSearch.PAGE_SIZE;
        PrcCommMethods.ADMIN_API(CommonObj, 'ADMIN_GET_PETTY_CASH_CAT').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.PETTY_CASH = $scope.PETTY_CASH.concat(data.data.Table);
                if (data.data.Table.length < $scope.PettycashSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.PettycashSearch.PAGE_NO = parseInt($scope.PettycashSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else {
                $scope.GetData = false;
            }
        });

    };
    $scope.ADMIN_GET_PETTY_CASH_CAT();
    $scope.ADMIN_INS_UPD_PETTY_CASH_CAT = function () {
        $scope.PettycashForm.submitted = true;
        if ($scope.PettycashForm.$valid) {
            if ($scope.PettycashSearch.ACTIVE != -1) {
                CommonObj = new Object();
                //CommonObj.PETTY_CASH_CAT_ID = $scope.PettycashSearch.CLICK_SEARCH == 1 ? ($scope.PETTY_CASH_CAT_ID == null ? 0 : $scope.PETTY_CASH_CAT_ID) : null;
                //CommonObj.PETTY_CASH_CAT_NAME = $scope.PettycashSearch.CLICK_SEARCH == 1 ? $scope.PettycashSearch.PETTY_CASH_CAT_NAME : '';
                CommonObj.PETTY_CASH_CAT_ID = $scope.PETTY_CASH_CAT_ID;
                CommonObj.PETTY_CASH_CAT_NAME = $scope.PettycashSearch.PETTY_CASH_CAT_NAME;

                CommonObj.ACTIVE = $scope.PettycashSearch.ACTIVE == true ? 1 : 0;
                CommonObj.COMMENTS = $scope.PettycashSearch.CLICK_SEARCH == 1 ? $scope.PettycashSearch.COMMENTS : '';
                CommonObj.USER_ID = parseInt($cookies.get("USERID"));
                PrcCommMethods.ADMIN_API(CommonObj, 'ADMIN_INS_UPD_PETTY_CASH_CAT').then(function (data) {
                    $scope.$parent.ShowAlert("Success", "Saved Successfully", 3000);
                    $scope.ResetPETTYCASH();
                });
            }
            else {
                $scope.$parent.ShowAlert('Attention', 'Please Select Active/In-Active Option.', 3000);
                $scope.PettycashForm.submitted = false;
            }
        }
    };
    $scope.EDIT_ADMIN_GET_PETTY_CASH_CAT = function (PETTYCASH) {

        $scope.PETTY_CASH_CAT_ID = PETTYCASH.PETTY_CASH_CAT_ID;
        $scope.PettycashSearch.PETTY_CASH_CAT_NAME = PETTYCASH.PETTY_CASH_CAT_NAME;
        $scope.PettycashSearch.ACTIVE = PETTYCASH.ACTIVE == true ? 1 : 0;
        $scope.PettycashSearch.COMMENTS = PETTYCASH.COMMENTS;
    };
    $scope.ResetPETTYCASH = function () {
        $scope.PettycashSearch = {
            ACTIVE: -1,
            PAGE_NO: 1,
            PAGE_SIZE: 10,
            PETTY_CASH_CAT_NAME: '',
            CLICK_SEARCH: null
        };
        $scope.PettycashForm.submitted = false;
        $scope.PETTY_CASH_CAT_ID = null;
        $scope.ADMIN_GET_PETTY_CASH_CAT(2);
    };
    $scope.LAZY_ADMIN_GET_PETTY_CASH_CAT = function () {
        $scope.ADMIN_GET_PETTY_CASH_CAT();
    };
});
app.controller('HrdeclarationController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.$parent.PAGE_HEADER = "HR Declaration";
    $scope.$parent.urlpath = 'Hrdeclaration';
    var HRModelObj;
    $scope.ENTITY_LIST = [];
    $scope.CUSTOMER_LIST = [];
    $scope.HR_EMP_DECLARATION_MASTER = [];
    $scope.HrdeclarationSearch = {
        CUSTOMER_ID: null,
        ENTITY_ID: null,
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        ACTIVE: -1,
        DECLARATION_NAME: null, COMMENTS: null,
        CLICK_SEARCH: null
    };
    $scope.RESET_HR_EMP_DECLARATION = function () {
        $scope.HrdeclarationSearch = {
            CUSTOMER_ID: null,
            PAGE_NO: 1,
            PAGE_SIZE: 10,
            ACTIVE: -1,
            DECLARATION_NAME: null, COMMENTS: null,
            CLICK_SEARCH: null
        };
        $scope.HrdeclarationForm.submitted = false;
        $scope.HrdeclarationSearch.DECLARATION_NAME = '';
        $scope.HrdeclarationSearch.COMMENTS = '';
        $scope.EMP_DECLARATION_MASTER_ID = null;
        $scope.HR_EMP_DECLARATION_MASTER = [];
        $scope.ADMIN_GET_HR_EMP_DECLARATION_MASTER(2);
    };
    $scope.LAZY_ADMIN_GET_HR_EMP_DECLARATION_MASTER = function () {
        $scope.ADMIN_GET_HR_EMP_DECLARATION_MASTER();
    };
    $scope.GET_ENTITY_LIST = function () {
        if ($scope.HrdeclarationSearch.CUSTOMER_ID != undefined && $scope.HrdeclarationSearch.CUSTOMER_ID != '' && $scope.HrdeclarationSearch.CUSTOMER_ID != null) {
            EntSettingModelObj = new Object();
            EntSettingModelObj.CUSTOMER_ID = $scope.HrdeclarationSearch.CUSTOMER_ID;
            EntSettingModelObj.ACTIVE = 1;
            EntSettingModelObj.PAGE_NO = 0;
            EntSettingModelObj.USER_ID = parseInt($cookies.get("USERID"));
            EntSettingModelObj.IS_LIVE = -1;
            PrcCommMethods.ADMIN_API(EntSettingModelObj, 'ADMIN_GET_ENTITIES').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.ENTITY_LIST = data.data.Table;
                }
                else { $scope.ENTITY_LIST = []; }
            });
        }
        else { $scope.ENTITY_LIST = []; }
    };
    $scope.ADMIN_GET_CUSTOMER = function () {
        EntSettingModelObj = new Object();
        EntSettingModelObj.CUSTOMER_NAME = '';
        EntSettingModelObj.CUSTOMER_CODE = '';
        EntSettingModelObj.ACTIVE = 1;
        EntSettingModelObj.PAGE_NO = 1;
        EntSettingModelObj.PAGE_SIZE = 1000;//$scope.CustomerSearch.PAGE_SIZE;
        EntSettingModelObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(EntSettingModelObj, 'ADMIN_GET_CUSTOMER').then(function (data) {
            $scope.CUSTOMER_LIST = data.data.Table;
        });
    };
    $scope.ADMIN_GET_CUSTOMER();
    $scope.ADMIN_GET_HR_EMP_DECLARATION_MASTER = function (FLAG) {
        HRModelObj = new Object();
        if (FLAG == 1) {
            $scope.HrdeclarationSearch.CLICK_SEARCH = 1;
            $scope.HR_EMP_DECLARATION_MASTER = [];
            $scope.HrdeclarationSearch.PAGE_NO = 1;
            HRModelObj.ACTIVE = $scope.HrdeclarationSearch.ACTIVE == -1 ? -1 : $scope.HrdeclarationSearch.ACTIVE ? 1 : 0;
        }
        else if (FLAG == 2) {
            $scope.HR_EMP_DECLARATION_MASTER = [];
            $scope.HrdeclarationSearch.PAGE_NO = 1;
            HRModelObj.ACTIVE = $scope.HrdeclarationSearch.ACTIVE == -1 ? -1 : $scope.HrdeclarationSearch.ACTIVE ? 1 : 0;
        }
        else if (FLAG == undefined) {
            if ($scope.HrdeclarationSearch.CLICK_SEARCH == 1)
                HRModelObj.ACTIVE = $scope.HrdeclarationSearch.ACTIVE == -1 ? -1 : $scope.HrdeclarationSearch.ACTIVE ? 1 : 0;
            else
                HRModelObj.ACTIVE = -1;
        }
        HRModelObj.CUSTOMER_ID = $scope.HrdeclarationSearch.CLICK_SEARCH == 1 ? $scope.HrdeclarationSearch.CUSTOMER_ID : null;
        HRModelObj.PAGE_NO = $scope.HrdeclarationSearch.PAGE_NO;
        HRModelObj.PAGE_SIZE = $scope.HrdeclarationSearch.PAGE_SIZE;
        HRModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.HR_API(HRModelObj, 'ADMIN_GET_HR_EMP_DECLARATION_MASTER').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.HR_EMP_DECLARATION_MASTER = $scope.HR_EMP_DECLARATION_MASTER.concat(data.data.Table);
                if (data.data.Table.length < $scope.HrdeclarationSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.HrdeclarationSearch.PAGE_NO = parseInt($scope.HrdeclarationSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else {
                $scope.GetData = false;
            }

        });
    };
    $scope.ADMIN_GET_HR_EMP_DECLARATION_MASTER();
    $scope.ADMIN_INS_UPD_HR_EMP_DECLARATION_MASTER = function () {
        $scope.HrdeclarationForm.submitted = true;
        if ($scope.HrdeclarationForm.$valid) {
            if ($scope.HrdeclarationSearch.ACTIVE != -1) {
                HRModelObj = new Object();
                HRModelObj.CUSTOMER_ID = $scope.HrdeclarationSearch.CUSTOMER_ID;
                HRModelObj.EMP_DECLARATION_MASTER_ID = $scope.EMP_DECLARATION_MASTER_ID != null ? $scope.EMP_DECLARATION_MASTER_ID : null;
                HRModelObj.DECLARATION_NAME = $scope.HrdeclarationSearch.DECLARATION_NAME;
                HRModelObj.USER_ID = parseInt($cookies.get("USERID"));
                HRModelObj.ACTIVE = $scope.HrdeclarationSearch.ACTIVE == true ? 1 : 0;
                HRModelObj.COMMENTS = $scope.HrdeclarationSearch.COMMENTS;
                PrcCommMethods.HR_API(HRModelObj, 'ADMIN_INS_UPD_HR_EMP_DECLARATION_MASTER').then(function (data) {
                    $scope.$parent.ShowAlert("Success", "Saved Successfully", 3000);
                    $scope.RESET_HR_EMP_DECLARATION();

                });
            }
            else { $scope.$parent.ShowAlert('Attention', 'Please Select Active/In-Active Option.', 3000); $scope.HrdeclarationForm.submitted = false; }
        }

    };
    $scope.EDIT_ADMIN_INS_UPD_HR_EMP_DECLARATION_MASTER = function (HRD) {
        $scope.EMP_DECLARATION_MASTER_ID = HRD.EMP_DECLARATION_MASTER_ID;
        $scope.HrdeclarationSearch.DECLARATION_NAME = HRD.DISPLAY_TEXT;
        $scope.HrdeclarationSearch.CUSTOMER_ID = HRD.CUSTOMER_ID;
        $scope.HrdeclarationSearch.COMMENTS = HRD.COMMENTS;
        $scope.HrdeclarationSearch.ACTIVE = HRD.ACTIVE == true ? 1 : 0;
        //$scope.HrdeclarationForm.submitted = false;
    };
    $scope.POPUP_HRDECLARATION = function (HRD) {
        $('#FIELD_VALUE').modal('show');
        $scope.HRD_DECLARATION_POPUP = HRD;
    };

});
app.controller("ShiftTypeController", function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.$parent.PAGE_HEADER = "Create Shift Type";
    $scope.$parent.urlpath = 'ShiftType';
    var ShiftModelObj;
    $scope.CUSTOMER_ID = [];
    $scope.ENTITY_LIST = [];
    $scope.SHIFT_TYPE_LIST = [];
    $scope.ShiftTypeSearch = {
        CUSTOMER_ID: null,
        ENTITY_ID: null,
        ACTIVE: -1,
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        DESCRIPTION: '',
        WAGE_MULTIPLIER: null, IS_DEFAULT: -1

    };

    $scope.GET_ENTITY_LIST = function () {
        if ($scope.ShiftTypeSearch.CUSTOMER_ID != undefined && $scope.ShiftTypeSearch.CUSTOMER_ID != '' && $scope.ShiftTypeSearch.CUSTOMER_ID != null) {
            EntSettingModelObj = new Object();
            EntSettingModelObj.CUSTOMER_ID = $scope.ShiftTypeSearch.CUSTOMER_ID;
            EntSettingModelObj.ACTIVE = 1;
            EntSettingModelObj.PAGE_NO = 0;
            EntSettingModelObj.USER_ID = parseInt($cookies.get("USERID"));
            EntSettingModelObj.IS_LIVE = -1;
            PrcCommMethods.ADMIN_API(EntSettingModelObj, 'ADMIN_GET_ENTITIES').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.ENTITY_LIST = data.data.Table;
                }
                else { $scope.ENTITY_LIST = []; };
            });
        }
        else { $scope.ENTITY_LIST = []; };
    };
    $scope.ADMIN_GET_CUSTOMER = function () {
        EntSettingModelObj = new Object();
        EntSettingModelObj.CUSTOMER_NAME = '';
        EntSettingModelObj.CUSTOMER_CODE = '';
        EntSettingModelObj.ACTIVE = 1;
        EntSettingModelObj.PAGE_NO = 1;
        EntSettingModelObj.PAGE_SIZE = 1000;//$scope.CustomerSearch.PAGE_SIZE;
        EntSettingModelObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(EntSettingModelObj, 'ADMIN_GET_CUSTOMER').then(function (data) {
            $scope.CUSTOMER_LIST = data.data.Table;
        });
    };
    $scope.ADMIN_GET_CUSTOMER();
    $scope.ResetSHIFT_TYPE = function () {
        $scope.ShiftTypeSearch = {
            CUSTOMER_ID: null,
            ENTITY_ID: null,
            ACTIVE: -1,
            PAGE_NO: 1,
            PAGE_SIZE: 10,
            DESCRIPTION: '',
            WAGE_MULTIPLIER: null
        };
        $scope.ENTITY_LIST = [];
        $scope.SHIFT_TYPE_LIST = [];
        $scope.ShiftTypeForm.submitted = false;
        $scope.SHIFT_TYPE_ID = null;
        document.getElementById("SHIFT_TYPE_COLOR_CODE").children[1].children[0].children[0].style.backgroundColor = 'rgb(0,0,0)';
        $scope.ADMIN_GET_SHIFT_TYPES(2);

    };

    $scope.LAZY_GET_SHIFT_TYPES = function () {
        $scope.ADMIN_GET_SHIFT_TYPES();
    };

    $scope.ADMIN_GET_SHIFT_TYPES = function (FLAG) {
        document.getElementById("overlay_loading").style.display = "block";
        ShiftModelObj = new Object();
        if (FLAG == 1) {
            $scope.ShiftTypeSearch.CLICK_SEARCH = 1;
            $scope.SHIFT_TYPE_LIST = [];
            $scope.ShiftTypeSearch.PAGE_NO = 1;
            //ShiftModelObj.ACTIVE = $scope.ShiftTypeSearch.ACTIVE == true ? 1 : 0;
            ShiftModelObj.ACTIVE = $scope.ShiftTypeSearch.ACTIVE == -1 ? -1 : $scope.ShiftTypeSearch.ACTIVE ? 1 : 0;
        }
        else if (FLAG == 2) {
            $scope.SHIFT_TYPE_LIST = [];
            $scope.ShiftTypeSearch.PAGE_NO = 1;
            ShiftModelObj.ACTIVE = $scope.ShiftTypeSearch.ACTIVE == -1 ? -1 : $scope.ShiftTypeSearch.ACTIVE ? 1 : 0;
        }
        else if (FLAG == undefined) {
            if ($scope.ShiftTypeSearch.CLICK_SEARCH == 1)
                ShiftModelObj.ACTIVE = $scope.ShiftTypeSearch.ACTIVE == -1 ? -1 : $scope.ShiftTypeSearch.ACTIVE ? 1 : 0;
            else
                ShiftModelObj.ACTIVE = -1;
        }

        ShiftModelObj.CUSTOMER_ID = $scope.ShiftTypeSearch.CLICK_SEARCH == 1 ? $scope.ShiftTypeSearch.CUSTOMER_ID : null;
        ShiftModelObj.ENTITY_ID = $scope.ShiftTypeSearch.CLICK_SEARCH == 1 ? $scope.ShiftTypeSearch.ENTITY_ID : null;
        ShiftModelObj.SHIFT_TYPE = $scope.ShiftTypeSearch.CLICK_SEARCH == 1 ? $scope.ShiftTypeSearch.SHIFT_TYPE : null;
        ShiftModelObj.PAGE_NO = $scope.ShiftTypeSearch.PAGE_NO;
        ShiftModelObj.PAGE_SIZE = $scope.ShiftTypeSearch.PAGE_SIZE;
        ShiftModelObj.IS_DEFAULT = -1;
        PrcCommMethods.ADMIN_API(ShiftModelObj, 'ADMIN_GET_SHIFT_TYPES').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.SHIFT_TYPE_LIST = $scope.SHIFT_TYPE_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.ShiftTypeSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                    document.getElementById("overlay_loading").style.display = "none";
                }
                else {
                    $scope.ShiftTypeSearch.PAGE_NO = parseInt($scope.ShiftTypeSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                    document.getElementById("overlay_loading").style.display = "none";
                }
            }
            else {
                $scope.GetData = false;
                document.getElementById("overlay_loading").style.display = "none";
            }
        });
    };
    $scope.ADMIN_GET_SHIFT_TYPES();
    $scope.ADMIN_INS_UPD_SHIFT_TYPES = function () {
        ShiftModelObj = new Object();
        $scope.ShiftTypeForm.submitted = true;
        if ($scope.ShiftTypeForm.$valid) {
            if ($scope.ShiftTypeSearch.ACTIVE != -1) {
                document.getElementById("overlay_loading").style.display = "block";
                ShiftModelObj.SHIFT_TYPE_ID = $scope.SHIFT_TYPE_ID == null ? null : $scope.SHIFT_TYPE_ID;
                ShiftModelObj.CUSTOMER_ID = $scope.ShiftTypeSearch.CUSTOMER_ID;
                ShiftModelObj.ENTITY_ID = $scope.ShiftTypeSearch.ENTITY_ID;
                ShiftModelObj.COMMENTS = $scope.ShiftTypeSearch.DESCRIPTION;
                ShiftModelObj.WAGE_MULTIPLIER = $scope.ShiftTypeSearch.WAGE_MULTIPLIER;
                ShiftModelObj.COLOR = document.getElementById('SHIFT_COLOR_CODE').value;
                ShiftModelObj.ACTIVE = $scope.ShiftTypeSearch.ACTIVE == true ? 1 : 0;
                ShiftModelObj.USER_ID = parseInt($cookies.get("USERID"));
                ShiftModelObj.SHIFT_TYPE = $scope.ShiftTypeSearch.SHIFT_TYPE_NAME;
                ShiftModelObj.IS_DEFAULT = $scope.ShiftTypeSearch.IS_DEFAULT == true ? 1 : 0;
                PrcCommMethods.ADMIN_API(ShiftModelObj, 'ADMIN_INS_UPD_SHIFT_TYPES').then(function (data) {
                    if (data.data == -1) {
                        $scope.$parent.ShowAlert("Warning", "Creating Please Make One Shift Type As Default.", 3000);
                        document.getElementById("overlay_loading").style.display = "none";
                    }
                    else {
                        $scope.$parent.ShowAlert("Success", "Saved Successfully.", 3000);
                        $scope.ResetSHIFT_TYPE();
                        document.getElementById("SHIFT_COLOR_CODE").value = '000000';
                        document.getElementById("overlay_loading").style.display = "none";
                    }

                });

            }
            else { $scope.$parent.ShowAlert('Attention', 'Please Select Active/In-Active Option.', 3000); $scope.ShiftTypeForm.submitted = false; document.getElementById("overlay_loading").style.display = "none"; }
        }

    };
    $scope.EDIT_ADMIN_INS_UPD_SHIFT_TYPES = function (SFT) {
        $scope.SHIFT_TYPE_ID = SFT.SHIFT_TYPE_ID;
        $scope.ShiftTypeSearch.CUSTOMER_ID = SFT.CUSTOMER_ID;
        $scope.ShiftTypeSearch.ENTITY_ID = SFT.ENTITY_ID;
        $scope.ShiftTypeSearch.DESCRIPTION = SFT.COMMENTS;
        $scope.ShiftTypeSearch.WAGE_MULTIPLIER = SFT.WAGE_MULTIPLIER;
        $scope.ShiftTypeSearch.ACTIVE = SFT.ACTIVE == true ? 1 : 0;
        $scope.ShiftTypeSearch.SHIFT_TYPE_NAME = SFT.SHIFT_TYPE;
        $scope.ShiftTypeSearch.IS_DEFAULT = SFT.IS_DEFAULT == 1 ? true : false;
        $scope.GET_ENTITY_LIST();
        document.getElementsByClassName('color-preview current-color')[0].style.backgroundColor = '#' + SFT.COLOR;
        document.getElementById("SHIFT_COLOR_CODE").value = SFT.COLOR;
    };
});
app.controller("NICategoryController", function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.$parent.PAGE_HEADER = "NI Category";
    $scope.$parent.urlpath = 'Setup_NICategory';
    var NICategoryModelObj;
    $scope.CUSTOMER_ID = [];
    $scope.NICATEGORY_LIST = [];
    $scope.NICategorySearch = {
        CUSTOMER_ID: null, NI_CATEGORY_NAME: null, NI_CATEGORY_ID: null,
        ACTIVE: -1,
        PAGE_NO: 1,
        PAGE_SIZE: 10,
    };
    $scope.ResetNICategory = function () {
        $scope.NICategorySearch = {
            CUSTOMER_ID: null, NI_CAT_NAME: null,
            ACTIVE: -1,
            PAGE_NO: 1,
            PAGE_SIZE: 10,
        };

        $scope.NICatagoryForm.submitted = false;
        $scope.NICATEGORY_LIST = [];
        $scope.ADMIN_GET_NI_CATEOGRY_MASTER(2);
    };
    $scope.ADMIN_GET_CUSTOMER = function () {
        EntSettingModelObj = new Object();
        EntSettingModelObj.CUSTOMER_NAME = '';
        EntSettingModelObj.CUSTOMER_CODE = '';
        EntSettingModelObj.ACTIVE = 1;
        EntSettingModelObj.PAGE_NO = 1;
        EntSettingModelObj.PAGE_SIZE = 1000;//$scope.CustomerSearch.PAGE_SIZE;
        EntSettingModelObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(EntSettingModelObj, 'ADMIN_GET_CUSTOMER').then(function (data) {
            $scope.CUSTOMER_LIST = data.data.Table;
        });
    };
    $scope.ADMIN_GET_CUSTOMER();
    $scope.LAZY_ADMIN_GET_NI_CATEOGRY_MASTER = function () { $scope.ADMIN_GET_NI_CATEOGRY_MASTER(); }
    $scope.ADMIN_GET_NI_CATEOGRY_MASTER = function (FLAG) {
        NICategoryModelObj = new Object();
        if (FLAG == 1) {
            $scope.NICategorySearch.CLICK_SEARCH = 1;
            $scope.NICATEGORY_LIST = [];
            $scope.NICategorySearch.PAGE_NO = 1;
            NICategoryModelObj.ACTIVE = $scope.NICategorySearch.ACTIVE == -1 ? -1 : $scope.NICategorySearch.ACTIVE ? 1 : 0;
        }
        else if (FLAG == 2) {
            $scope.NICATEGORY_LIST = [];
            $scope.NICategorySearch.PAGE_NO = 1;
            NICategoryModelObj.ACTIVE = $scope.NICategorySearch.ACTIVE == -1 ? -1 : $scope.NICategorySearch.ACTIVE ? 1 : 0;
        }
        else if (FLAG == undefined) {
            if ($scope.NICategorySearch.CLICK_SEARCH == 1)
                NICategoryModelObj.ACTIVE = $scope.NICategorySearch.ACTIVE == -1 ? -1 : $scope.NICategorySearch.ACTIVE ? 1 : 0;
            else
                NICategoryModelObj.ACTIVE = $scope.NICategorySearch.ACTIVE == -1 ? -1 : $scope.NICategorySearch.ACTIVE ? 1 : 0;
        }

        NICategoryModelObj.CUSTOMER_ID = $scope.NICategorySearch.CLICK_SEARCH == 1 ? $scope.NICategorySearch.CUSTOMER_ID : null;
        NICategoryModelObj.USER_ID = parseInt($cookies.get("USERID"));
        NICategoryModelObj.NI_CATEGORY_NAME = $scope.NICategorySearch.CLICK_SEARCH == 1 ? $scope.NICategorySearch.NI_CATEGORY_NAME : '';
        NICategoryModelObj.PAGE_NO = $scope.NICategorySearch.PAGE_NO;
        NICategoryModelObj.PAGE_SIZE = $scope.NICategorySearch.PAGE_SIZE;
        PrcCommMethods.ADMIN_API(NICategoryModelObj, 'ADMIN_GET_NI_CATEOGRY_MASTER').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.NICATEGORY_LIST = $scope.NICATEGORY_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.NICategorySearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.NICategorySearch.PAGE_NO = parseInt($scope.NICategorySearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else {
                $scope.GetData = false;
            }
        });
    };
    $scope.ADMIN_GET_NI_CATEOGRY_MASTER();
    $scope.ADMIN_INS_UPD_NI_CATEOGRY_MASTER = function () {
        $scope.NICatagoryForm.submitted = true;
        if ($scope.NICatagoryForm.$valid) {
            if ($scope.NICategorySearch.ACTIVE == -1) {
                $scope.$parent.ShowAlert("Warning", "Please Select Active/Inactive Status.", 3000);
            }
            else {
                NICategoryModelObj = new Object();
                $scope.NICatagoryForm.submitted = true;
                if ($scope.NICatagoryForm.$valid) {
                    NICategoryModelObj.CUSTOMER_ID = $scope.NICategorySearch.CUSTOMER_ID;
                    NICategoryModelObj.NI_CATEGORY_NAME = $scope.NICategorySearch.NI_CATEGORY_NAME;
                    NICategoryModelObj.NI_CATEGORY_ID = $scope.NICategorySearch.NI_CATEGORY_ID == null ? 0 : $scope.NICategorySearch.NI_CATEGORY_ID;
                    NICategoryModelObj.ACTIVE = $scope.NICategorySearch.ACTIVE == true ? 1 : 0;
                    NICategoryModelObj.USER_ID = parseInt($cookies.get("USERID"));
                    PrcCommMethods.ADMIN_API(NICategoryModelObj, 'ADMIN_INS_UPD_NI_CATEOGRY_MASTER').then(function (data) {
                        if (data.data == -1) {
                            $scope.$parent.ShowAlert("Error", "NI Category Name Already Exists", 3000);
                        }
                        else {
                            $scope.$parent.ShowAlert("Success", "Saved Successfully.", 3000);
                            $scope.ResetNICategory();
                        }
                    });
                }
            }
        }
    };
    $scope.EDIT_ADMIN_INS_UPD_NI_CATEOGRY_MASTER = function (NI) {
        $scope.NICategorySearch.NI_CATEGORY_NAME = NI.NI_CATEGORY_NAME;
        $scope.NICategorySearch.NI_CATEGORY_ID = NI.TABLE_ID;
        $scope.NICategorySearch.CUSTOMER_ID = NI.CUSTOMER_ID;
        $scope.NICategorySearch.ACTIVE = NI.ACTIVE == true ? 1 : 0;
    };
});
app.controller('SessionMappingCoversController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.$parent.PAGE_HEADER = "Session Mapping Covers";
    $scope.$parent.urlpath = "SessionMappingCovers";
    $scope.ENTITY_LIST = [];
    $scope.CUSTOMER_LIST = [];
    $scope.LOCATION = [];
    $scope.BRANCH_LIST = [];
    $scope.SESSION_MAPPING_COVERS = [];
    $scope.TABLE_ID = null;
    var CommonObj;
    $scope.SessionMappingSearch = {
        ACTIVE: -1,
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        CUSTOMER_ID: null,
        ENTITY_ID: null,
        BRANCH_ID: null,
        LOCATION_ID: null,
        DESCRIPTION: '',
        TABLE_ID: null,
        SESSION_ID: null,
        CLICK_SEARCH: null
    };
    $scope.GET_ENTITY_LIST = function () {
        if ($scope.SessionMappingSearch.CUSTOMER_ID != undefined) {
            CommonObj = new Object();
            CommonObj.CUSTOMER_ID = $scope.SessionMappingSearch.CUSTOMER_ID;
            CommonObj.ACTIVE = 1;
            CommonObj.PAGE_NO = 0;
            CommonObj.USER_ID = parseInt($cookies.get("USERID"));
            CommonObj.PAGE_SIZE = 1000;
            CommonObj.IS_LIVE = -1;
            PrcCommMethods.ADMIN_API(CommonObj, 'ADMIN_GET_ENTITIES').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.ENTITY_LIST = data.data.Table;
                }
                else { $scope.ENTITY_LIST = []; }
            });
        }
        else {
            $scope.ENTITY_LIST = []; $scope.LOCATION = [];
            $scope.BRANCH_LIST = [];
        }
    };
    $scope.ADMIN_GET_CUSTOMER = function () {

        CommonObj = new Object();
        CommonObj.CUSTOMER_NAME = '';
        CommonObj.CUSTOMER_CODE = '';
        CommonObj.ACTIVE = 1;
        CommonObj.PAGE_NO = 1;
        CommonObj.PAGE_SIZE = 1000;//$scope.CustomerSearch.PAGE_SIZE;
        CommonObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(CommonObj, 'ADMIN_GET_CUSTOMER').then(function (data) {
            $scope.CUSTOMER_LIST = data.data.Table;
        });
        CashupTabsObj = null;
    };
    $scope.GET_LOCATION = function () {
        if ($scope.SessionMappingSearch.ENTITY_ID != undefined && $scope.SessionMappingSearch.ENTITY_ID != null) {
            CommonObj = new Object();
            CommonObj.ENTITY_ID = $scope.SessionMappingSearch.ENTITY_ID;//ENT[0].ENTITY_ID;
            CommonObj.CUSTOMER_ID = $scope.SessionMappingSearch.CUSTOMER_ID;//ENT[0].CUSTOMER_ID;
            CommonObj.LOCATION_NAME = null;
            CommonObj.LOCATION_CODE = null;
            CommonObj.ACTIVE = 1;
            CommonObj.PAGE_NO = 1;
            CommonObj.PAGE_SIZE = 1000;
            CommonObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.ADMIN_API(CommonObj, 'ADMIN_GET_LOCATION').then(function (data) {
                $scope.LOCATION = data.data.Table;
            });
        }
        else {
            $scope.LOCATION = [];
            $scope.BRANCH_LIST = [];
        }
    };
    $scope.ADMIN_GET_BRANCH = function () {
        if ($scope.SessionMappingSearch.LOCATION_ID != null && $scope.SessionMappingSearch.LOCATION_ID != undefined) {
            CommonObj = new Object();
            CommonObj.CUSTOMER_ID = $scope.SessionMappingSearch.CUSTOMER_ID;
            CommonObj.ENTITY_ID = $scope.SessionMappingSearch.ENTITY_ID;
            CommonObj.BRANCH_CODE = $scope.SessionMappingSearch.BRANCH_CODE;
            CommonObj.BRANCH_NAME = $scope.SessionMappingSearch.BRANCH_NAME;
            CommonObj.CONTACT_NAME = $scope.SessionMappingSearch.CONTACT_NAME;
            CommonObj.LOCATION_IDS = $scope.SessionMappingSearch.LOCATION_ID;
            CommonObj.ACTIVE = 1;//$scope.BrachSearch.ACTIVE ? 1 : 0;
            CommonObj.PAGE_NO = 1;
            CommonObj.PAGE_SIZE = 1000;
            CommonObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.ADMIN_API(CommonObj, 'ADMIN_GET_BRANCH').then(function (data) {
                $scope.BRANCH_LIST = data.data.Table;
            });
        }
        else
            $scope.BRANCH_LIST = [];
    };
    $scope.ADMIN_GET_CUSTOMER();
    $scope.ADMIN_GET_CU_SESSION_MAPPING_FOR_COVERS = function (FLAG) {
        CommonObj = new Object();
        if (FLAG == 1) {
            $scope.SessionMappingSearch.CLICK_SEARCH = 1;
            $scope.SESSION_MAPPING_COVERS = [];
            $scope.SessionMappingSearch.PAGE_NO = 1;
            CommonObj.ACTIVE = $scope.SessionMappingSearch.ACTIVE == -1 ? -1 : $scope.SessionMappingSearch.ACTIVE ? 1 : 0;
        }
        else if (FLAG == 2) {
            $scope.SESSION_MAPPING_COVERS = [];
            $scope.SessionMappingSearch.PAGE_NO = 1;
            CommonObj.ACTIVE = $scope.SessionMappingSearch.ACTIVE == -1 ? -1 : $scope.SessionMappingSearch.ACTIVE ? 1 : 0;
        }
        else if (FLAG == undefined) {
            if ($scope.SessionMappingSearch.CLICK_SEARCH == 1)
                CommonObj.ACTIVE = $scope.SessionMappingSearch.ACTIVE == -1 ? -1 : $scope.SessionMappingSearch.ACTIVE ? 1 : 0;
            else
                CommonObj.ACTIVE = -1;
        }
        CommonObj.CUSTOMER_ID = $scope.SessionMappingSearch.CLICK_SEARCH == 1 ? $scope.SessionMappingSearch.CUSTOMER_ID : null;
        CommonObj.ENTITY_ID = $scope.SessionMappingSearch.CLICK_SEARCH == 1 ? $scope.SessionMappingSearch.ENTITY_ID : null;
        CommonObj.LOCATION_ID = $scope.SessionMappingSearch.CLICK_SEARCH == 1 ? $scope.SessionMappingSearch.LOCATION_ID : null;
        CommonObj.BRANCH_ID = $scope.SessionMappingSearch.CLICK_SEARCH == 1 ? $scope.SessionMappingSearch.BRANCH_ID : null;
        CommonObj.PAGE_NO = $scope.SessionMappingSearch.PAGE_NO;
        CommonObj.PAGE_SIZE = $scope.SessionMappingSearch.PAGE_SIZE;
        PrcCommMethods.CASHUP_API(CommonObj, 'ADMIN_GET_CU_SESSION_MAPPING_FOR_COVERS').then(function (data) {
            if (data.data != null && data.data.Table.length > 0) {
                $scope.SESSION_MAPPING_COVERS = $scope.SESSION_MAPPING_COVERS.concat(data.data.Table);
                if (data.data.Table.length < $scope.SessionMappingSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.SessionMappingSearch.PAGE_NO = parseInt($scope.SessionMappingSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else {
                $scope.GetData = false;
                $scope.SESSION_MAPPING_COVERS = [];
            }
        });
    };
    $scope.ADMIN_GET_CU_SESSION_MAPPING_FOR_COVERS();
    $scope.EDIT_ADMIN_GET_CU_SESSION_MAPPING_FOR_COVERS = function (SMC) {
        $scope.SessionMappingSearch.CUSTOMER_ID = SMC.CUSTOMER_ID;
        $scope.SessionMappingSearch.CUSTOMER_ID = SMC.CUSTOMER_ID;
        $scope.SessionMappingSearch.TABLE_ID = SMC.TABLE_ID;
        $scope.SessionMappingSearch.ENTITY_ID = SMC.ENTITY_ID;
        $scope.SessionMappingSearch.BRANCH_ID = SMC.BRANCH_ID;
        $scope.SessionMappingSearch.LOCATION_ID = SMC.LOCATION_ID;
        $scope.SessionMappingSearch.SESSION_ID = SMC.SESSION_ID;
        $scope.SessionMappingSearch.ACTIVE = SMC.ACTIVE == true ? 1 : 0;
        $scope.SessionMappingSearch.DESCRIPTION = SMC.DESCRIPTION;
        $scope.GET_ENTITY_LIST();
        $scope.GET_LOCATION();
        $scope.ADMIN_GET_BRANCH();
    };
    $scope.ADMIN_INS_UPD_CU_SESSION_MAPPING_FOR_COVERS = function () {
        $scope.SessionMappingForm.submitted = true;
        if ($scope.SessionMappingForm.$valid) {
            if ($scope.SessionMappingSearch.ACTIVE != -1) {
                CommonObj = new Object();
                CommonObj.TABLE_ID = $scope.SessionMappingSearch.TABLE_ID == null ? 0 : $scope.SessionMappingSearch.TABLE_ID;
                CommonObj.ENTITY_ID = $scope.SessionMappingSearch.ENTITY_ID;
                CommonObj.BRANCH_ID = $scope.SessionMappingSearch.BRANCH_ID;
                CommonObj.LOCATION_ID = $scope.SessionMappingSearch.LOCATION_ID;
                CommonObj.SESSION_ID = $scope.SessionMappingSearch.SESSION_ID;
                CommonObj.ACTIVE = $scope.SessionMappingSearch.ACTIVE == true ? 1 : 0;
                CommonObj.USER_ID = parseInt($cookies.get("USERID"));
                CommonObj.DESCRIPTION = $scope.SessionMappingSearch.DESCRIPTION;
                PrcCommMethods.CASHUP_API(CommonObj, 'ADMIN_INS_UPD_CU_SESSION_MAPPING_FOR_COVERS').then(function (data) {
                    if (data.data.Table[0]["TABLE_ID"] > 0) { $scope.$parent.ShowAlert("Success", "Saved Successfully", 3000); }
                    else { $scope.$parent.ShowAlert("Error", "Record Already Exists.", 3000); }
                    $scope.RESET();
                });
            }
            else { $scope.$parent.ShowAlert('Attention', 'Please Select Active/In-Active Option.', 3000); }
        }

    };
    $scope.EDIT_ADMIN_INS_UPD_PETTY_CASH_CAT_MAPPING = function (PETTY) {
        $scope.SessionMappingSearch.ENTITY_ID = PETTY.ENTITY_ID;
        $scope.SessionMappingSearch.CUSTOMER_ID = PETTY.CUSTOMER_ID;
        $scope.SessionMappingSearch.BRANCH_ID = PETTY.BRANCH_ID;
        $scope.SessionMappingSearch.LOCATION_ID = PETTY.LOCATION_ID;
        $scope.SessionMappingSearch.ACTIVE = PETTY.ACTIVE;
        $scope.SessionMappingSearch.STAFF_NAME = PETTY.NAME;
        $scope.TABLE_ID = PETTY.TABLE_ID;
        $scope.GET_ENTITY_LIST();
        $scope.GET_LOCATION();
        $scope.ADMIN_GET_BRANCH();
    };
    $scope.RESET = function () {
        $scope.SessionMappingSearch = {
            ACTIVE: -1,
            PAGE_NO: 1,
            PAGE_SIZE: 10,
            CUSTOMER_ID: null,
            ENTITY_ID: null,
            BRANCH_ID: null,
            LOCATION_ID: null,
            DESCRIPTION: '',
            TABLE_ID: null,
            SESSION_ID: null,
            CLICK_SEARCH: null
        };
        $scope.SessionMappingForm.submitted = false;
        $scope.ENTITY_LIST = [];
        $scope.LOCATION = [];
        $scope.BRANCH_LIST = [];
        $scope.SESSION_MAPPING_COVERS = [];
        $scope.ADMIN_GET_SESSION_MASTER();
        $scope.ADMIN_GET_CU_SESSION_MAPPING_FOR_COVERS(2);
    };
    $scope.ADMIN_GET_SESSION_MASTER = function () {
        var SessionObj = new Object();
        SessionObj.ACTIVE = 1;
        SessionObj.PAGE_NO = 1
        SessionObj.PAGE_SIZE = 999;
        PrcCommMethods.ADMIN_API(SessionObj, 'GET_SESSION_MASTER').then(function (data) {
            $scope.SESSION_LIST = data.data.Table;
            $scope.TEMP_LIST = [];
            angular.forEach($scope.SESSION_LIST, function (item) {
                if (item.SESSION_MASTER_ID != 4) {
                    $scope.TEMP_LIST.push(item);
                }
            });
            $scope.SESSION_LIST = $scope.TEMP_LIST;
        });
    };
    $scope.ADMIN_GET_SESSION_MASTER();
    $scope.ADMIN_GET_BRANCH_NAME = function (BRANCH) {
        angular.forEach($scope.BRANCH_LIST, function (item) {
            if (item.BRANCH_ID == $scope.SessionMappingSearch.BRANCH_ID) {
                $scope.SessionMappingSearch.DESCRIPTION = item.BRANCH_NAME;
            }
        });
    };
    $scope.ADMIN_GET_SESSION_NAME = function (SESSION_NAME) {

        angular.forEach($scope.SESSION_LIST, function (item) {
            if (item.SESSION_MASTER_ID == $scope.SessionMappingSearch.SESSION_ID) {
                $scope.SessionMappingSearch.DESCRIPTION = item.SESSION_NAME;
            }
        });
    };
    $scope.LAZY_ADMIN_GET_CU_SESSION_MAPPING_FOR_COVERS = function () {
        $scope.ADMIN_GET_CU_SESSION_MAPPING_FOR_COVERS();
    };
});
app.controller('ReasonforVOIDController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.$parent.PAGE_HEADER = "VOID";
    $scope.$parent.urlpath = "ReasonforVOID";
    $scope.ENTITY_LIST = [];
    $scope.CUSTOMER_LIST = [];
    $scope.COMPLIMETARY_LIST = [];
    $scope.LOCATION = [];
    $scope.BRANCH_LIST = [];
    var CommonObj;
    $scope.ComplimentarySearch = {
        ACTIVE: -1,
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        CUSTOMER_ID: null,
        ENTITY_ID: null,
        REASON: '',
        COMMENTS: '',
        CLICK_SEARCH: null
    };

    $scope.ADMIN_GET_CUSTOMER = function () {
        CommonObj = new Object();
        CommonObj.CUSTOMER_NAME = '';
        CommonObj.ACTIVE = 1;
        CommonObj.PAGE_NO = 1;
        CommonObj.PAGE_SIZE = 1000;//$scope.CustomerSearch.PAGE_SIZE;
        CommonObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(CommonObj, 'ADMIN_GET_CUSTOMER').then(function (data) {
            $scope.CUSTOMER_LIST = data.data.Table;
        });
        CashupTabsObj = null;
    };
    $scope.ADMIN_GET_CUSTOMER();
    $scope.GET_ENTITY_LIST = function () {
        if ($scope.ComplimentarySearch.CUSTOMER_ID != undefined) {
            CommonObj = new Object();
            CommonObj.CUSTOMER_ID = $scope.ComplimentarySearch.CUSTOMER_ID;
            CommonObj.ACTIVE = 1;
            CommonObj.PAGE_NO = 0;
            CommonObj.PAGE_SIZE = 1000;
            CommonObj.USER_ID = parseInt($cookies.get("USERID"));
            CommonObj.IS_LIVE = -1;
            PrcCommMethods.ADMIN_API(CommonObj, 'ADMIN_GET_ENTITIES').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.ENTITY_LIST = data.data.Table;
                }
                else { $scope.ENTITY_LIST = []; };
            });
        }
        else { $scope.ENTITY_LIST = []; };
    };
    $scope.GET_LOCATION = function () {
        if ($scope.ComplimentarySearch.ENTITY_ID != undefined && $scope.ComplimentarySearch.ENTITY_ID != null) {
            CommonObj = new Object();
            CommonObj.ENTITY_ID = $scope.ComplimentarySearch.ENTITY_ID;//ENT[0].ENTITY_ID;
            CommonObj.CUSTOMER_ID = $scope.ComplimentarySearch.CUSTOMER_ID;//ENT[0].CUSTOMER_ID;
            CommonObj.LOCATION_NAME = null;
            CommonObj.LOCATION_CODE = null;
            CommonObj.ACTIVE = 1;
            CommonObj.PAGE_NO = 1;
            CommonObj.PAGE_SIZE = 1000;
            CommonObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.ADMIN_API(CommonObj, 'ADMIN_GET_LOCATION').then(function (data) {
                $scope.LOCATION = data.data.Table;
            });
        }
        else {
            $scope.LOCATION = [];
            $scope.BRANCH_LIST = [];
        }
    };
    $scope.ADMIN_GET_BRANCH = function () {
        if ($scope.ComplimentarySearch.LOCATION_ID != null && $scope.ComplimentarySearch.LOCATION_ID != undefined) {
            CommonObj = new Object();
            CommonObj.CUSTOMER_ID = $scope.ComplimentarySearch.CUSTOMER_ID;
            CommonObj.ENTITY_ID = $scope.ComplimentarySearch.ENTITY_ID;
            CommonObj.BRANCH_CODE = $scope.ComplimentarySearch.BRANCH_CODE;
            CommonObj.BRANCH_NAME = $scope.ComplimentarySearch.BRANCH_NAME;
            CommonObj.CONTACT_NAME = $scope.ComplimentarySearch.CONTACT_NAME;
            CommonObj.LOCATION_IDS = $scope.ComplimentarySearch.LOCATION_ID;
            CommonObj.ACTIVE = 1;//$scope.BrachSearch.ACTIVE ? 1 : 0;
            CommonObj.PAGE_NO = 1;
            CommonObj.PAGE_SIZE = 1000;
            CommonObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.ADMIN_API(CommonObj, 'ADMIN_GET_BRANCH').then(function (data) {
                $scope.BRANCH_LIST = data.data.Table;
            });
        }
        else
            $scope.BRANCH_LIST = [];
    };
    $scope.ADMIN_GET_REASON_FOR_VOID = function (FLAG) {
        CommonObj = new Object();
        if (FLAG == 1) {
            $scope.ComplimentarySearch.CLICK_SEARCH = 1;
            $scope.COMPLIMETARY_LIST = [];
            $scope.ComplimentarySearch.PAGE_NO = 1;
            CommonObj.ACTIVE = $scope.ComplimentarySearch.ACTIVE == -1 ? -1 : $scope.ComplimentarySearch.ACTIVE == 1 ? 1 : 0;
        }
        else if (FLAG == 2) {
            $scope.COMPLIMETARY_LIST = [];
            CommonObj.ACTIVE = $scope.ComplimentarySearch.ACTIVE == -1 ? -1 : $scope.ComplimentarySearch.ACTIVE == 1 ? 1 : 0;
            $scope.ComplimentarySearch.PAGE_NO = 1;
        }
        else if (FLAG == undefined) {
            if ($scope.ComplimentarySearch.CLICK_SEARCH == 1)
                CommonObj.ACTIVE = $scope.ComplimentarySearch.ACTIVE == -1 ? -1 : $scope.ComplimentarySearch.ACTIVE == 1 ? 1 : 0;
            else {
                CommonObj.ACTIVE = -1;
            }
        }

        CommonObj.CUSTOMER_ID = $scope.ComplimentarySearch.CLICK_SEARCH == 1 ? $scope.ComplimentarySearch.CUSTOMER_ID : null;
        CommonObj.ENTITY_ID = $scope.ComplimentarySearch.CLICK_SEARCH == 1 ? $scope.ComplimentarySearch.ENTITY_ID : null;
        CommonObj.LOCATION_ID = $scope.ComplimentarySearch.CLICK_SEARCH == 1 ? $scope.ComplimentarySearch.LOCATION_ID : null;
        CommonObj.BRANCH_ID = $scope.ComplimentarySearch.CLICK_SEARCH == 1 ? $scope.ComplimentarySearch.BRANCH_ID : null;
        CommonObj.REASON = $scope.ComplimentarySearch.CLICK_SEARCH == 1 ? $scope.ComplimentarySearch.REASON : null;
        CommonObj.PAGE_NO = $scope.ComplimentarySearch.PAGE_NO;
        CommonObj.PAGE_SIZE = $scope.ComplimentarySearch.PAGE_SIZE;
        PrcCommMethods.CASHUP_API(CommonObj, 'ADMIN_GET_REASON_FOR_VOID').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.COMPLIMETARY_LIST = $scope.COMPLIMETARY_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.ComplimentarySearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.ComplimentarySearch.PAGE_NO = parseInt($scope.ComplimentarySearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else {
                $scope.GetData = false;
            }
        });
    };
    $scope.ADMIN_GET_REASON_FOR_VOID();
    $scope.ADMIN_INS_UPD_REASON_FOR_VOID = function () {
        $scope.ComplimentaryForm.submitted = true;
        if ($scope.ComplimentaryForm.$valid) {
            if ($scope.ComplimentarySearch.ACTIVE != -1) {
                CommonObj = new Object();
                CommonObj.VOID_ID = $scope.VOID_ID == null || $scope.VOID_ID == undefined ? 0 : $scope.VOID_ID;
                CommonObj.ENTITY_ID = $scope.ComplimentarySearch.ENTITY_ID;
                CommonObj.BRANCH_ID = $scope.ComplimentarySearch.BRANCH_ID;
                CommonObj.REASON = $scope.ComplimentarySearch.REASON;
                CommonObj.ACTIVE = $scope.ComplimentarySearch.ACTIVE ? 1 : 0;
                CommonObj.USER_ID = parseInt($cookies.get("USERID"));
                PrcCommMethods.CASHUP_API(CommonObj, 'ADMIN_INS_UPD_REASON_FOR_VOID').then(function (data) {
                    if (data.data == -1) {
                        $scope.$parent.ShowAlert("Attention", "Record Already Exist.", 3000);
                    }
                    else {
                        $scope.$parent.ShowAlert("Success", "Saved Successfully", 3000);
                        $scope.ResetCOMPLIMENTARY();
                    }
                });
            }
            else { $scope.$parent.ShowAlert('Attention', 'Please Select Active/In-Active Option.', 3000); $scope.ComplimentaryForm.submitted = false; }
        }
    };
    $scope.EDIT_ADMIN_INS_UPD_REASON_FOR_VOID = function (VOID) {
        $scope.VOID_ID = VOID.VOID_ID;
        $scope.ComplimentarySearch.REASON = VOID.VOID_REASON;
        $scope.ComplimentarySearch.ACTIVE = VOID.ACTIVE == true ? 1 : 0;
        $scope.ComplimentarySearch.CUSTOMER_ID = VOID.CUSTOMER_ID;
        $scope.ComplimentarySearch.ENTITY_ID = VOID.ENTITY_ID;
        $scope.ComplimentarySearch.LOCATION_ID = VOID.LOCATION_ID;
        $scope.ComplimentarySearch.BRANCH_ID = VOID.BRANCH_ID;
        $scope.GET_ENTITY_LIST();
        $scope.GET_LOCATION();
        $scope.ADMIN_GET_BRANCH();
    };
    $scope.ResetCOMPLIMENTARY = function () {
        $scope.ComplimentarySearch = {
            ACTIVE: -1,
            PAGE_NO: 1,
            PAGE_SIZE: 10,
            CUSTOMER_ID: null,
            ENTITY_ID: null,
            REASON: null,
            COMMENTS: '',
            CLICK_SEARCH: null
        }
        $scope.ComplimentaryForm.submitted = false;
        $scope.ENTITY_LIST = [];
        $scope.COMPLIMETARY_LIST = [];
        $scope.LOCATION = [];
        $scope.BRANCH_LIST = [];
        $scope.VOID_ID = null;
        $scope.ADMIN_GET_REASON_FOR_VOID(2);
    };
    $scope.LAZY_ADMIN_GET_REASON_FOR_VOID = function () {
        $scope.ADMIN_GET_REASON_FOR_VOID();
    };
});
app.controller('PKCEController', function ($scope, $http, $interval, CommService, $cookies, $filter, PrcCommMethods, $location, readFileData, $localStorage) {
    $scope.$parent.PAGE_HEADER = "OAuth2 Authentication";
    $scope.$parent.urlpath = "PKCE";
    $scope.PKCESearch = {
        REPORT_START_DATE: null,
        REPORT_END_DATE: null,
        BRANCH_ID: null
    };
    $scope.RESET_PKCE = function () {
        $scope.PKCESearch = {
            CODEVERIFIER: null,
            CODECHALLENGE: '',
            CODECHALLENGEMETHOD: '',
        };
        $scope.PKCEForm.submitted = false;
    }
    $scope.INS_SYS_NOTIFICATION = function () {
        $scope.PKCEForm.submitted = true;
        if ($scope.PKCEForm.$valid) {
            CashupModel = new Object();
            CashupModel.NOTIFICATION_ID = 45;
            CashupModel.USER_ID = $scope.PKCESearch.USER_ID;
            //CashupModel.PARAMETER_FOR_DB;
            CashupModel.PARAMETER_FOR_SRVC = window.location.origin + "/Login/GetToken#!/AuthlgtSpeed_L?Tok=" + $scope.PKCESearch.ENTITY_ID + ':;:' + $scope.PKCESearch.CODEVERIFIER + ':;:' + $scope.PKCESearch.CODECHALLENGE + ':;:' + $scope.PKCESearch.CODECHALLENGEMETHOD + ':;:' + $scope.PKCESearch.CUSTOMER_ID + ':;:' + $scope.PKCESearch.BRANCH_ID + ':;:' + (($scope.PKCESearch.CLIENT_ID == undefined || $scope.PKCESearch.CLIENT_ID == '' && $scope.PKCESearch.CLIENT_ID == null) ? '' : $scope.PKCESearch.CLIENT_ID) + ':;:' + (($scope.PKCESearch.CLIENT_SECRET == undefined || $scope.PKCESearch.CLIENT_SECRET == '' && $scope.PKCESearch.CLIENT_SECRET == null) ? '' : $scope.PKCESearch.CLIENT_SECRET) + ':;:' + $scope.PKCESearch.USER_ID;
            CashupModel.CUSTOMER_ID = $scope.PKCESearch.CUSTOMER_ID;
            CashupModel.ENTITY_ID = $scope.PKCESearch.ENTITY_ID;//parseInt($cookies.get("ENTITY_ID"));
            PrcCommMethods.ADMIN_API(CashupModel, 'INS_SYS_NOTIFICATION').then(function (data) {
                if (data.data == 1) {
                    $scope.$parent.ShowAlert('Success', 'Notification send successfully.', 5000);
                    $scope.RESET_PKCE();
                }
                if (data.data == 0 || data.data == null) {
                    $scope.$parent.ShowAlert('Error', $scope.$parent.SOMETHINGWENTWRONG, 5000);
                }
            });
        }
    };
    $scope.ADMIN_GET_CUSTOMER = function () {
        var EMPModelObj = new Object();
        EMPModelObj.CUSTOMER_NAME = '';
        EMPModelObj.CUSTOMER_CODE = '';
        EMPModelObj.ACTIVE = 1;
        EMPModelObj.PAGE_NO = 1;
        EMPModelObj.PAGE_SIZE = 1000;//$scope.CustomerSearch.PAGE_SIZE;
        EMPModelObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(EMPModelObj, 'ADMIN_GET_CUSTOMER').then(function (data) {
            $scope.CUSTOMER_LIST = data.data.Table;
        });
    };
    $scope.ADMIN_GET_CUSTOMER();
    $scope.GET_ENTITY_LIST = function () {
        if ($scope.PKCESearch.CUSTOMER_ID != undefined || $scope.PKCESearch.CUSTOMER_ID != '' || $scope.PKCESearch.CUSTOMER_ID != null) {
            var CusModelObj = new Object();
            CusModelObj.CUSTOMER_ID = $scope.PKCESearch.CUSTOMER_ID;
            CusModelObj.ACTIVE = 1;
            CusModelObj.PAGE_NO = 0;
            CusModelObj.USER_ID = parseInt($cookies.get("USERID"));
            CusModelObj.IS_LIVE = -1;
            PrcCommMethods.ADMIN_API(CusModelObj, 'ADMIN_GET_ENTITIES').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.ENTITY_LIST = data.data.Table;
                }
                else { $scope.ENTITY_LIST = []; };
            });
        }
        else {
            $scope.ENTITY_LIST = [];
        }

    };
    $scope.ADMIN_GET_BRANCH = function () {
        if ($scope.PKCESearch.ENTITY_ID != null && $scope.PKCESearch.ENTITY_ID != undefined) {
            $scope.GET_USERS_BY_ENTITY();
            var BrnModelObj = new Object();
            BrnModelObj.CUSTOMER_ID = $scope.PKCESearch.CUSTOMER_ID;
            BrnModelObj.ENTITY_ID = $scope.PKCESearch.ENTITY_ID;
            BrnModelObj.BRANCH_CODE = '';
            BrnModelObj.BRANCH_NAME = '';
            BrnModelObj.CONTACT_NAME = '';
            BrnModelObj.LOCATION_IDS = '';
            BrnModelObj.ACTIVE = 1;//$scope.BrachSearch.ACTIVE ? 1 : 0;
            BrnModelObj.PAGE_NO = 1;
            BrnModelObj.PAGE_SIZE = 999;
            BrnModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.ADMIN_API(BrnModelObj, 'ADMIN_GET_BRANCH').then(function (data) {
                $scope.BRANCH_LIST = data.data.Table;
            });
        }
        else {
            $scope.BRANCH_LIST = [];
        }
    };
    $scope.USERS_LIST = [];
    $scope.GET_USERS_BY_ENTITY = function () {
        var CusModelObj = new Object();
        CusModelObj.ENTITY_ID = $scope.PKCESearch.ENTITY_ID;
        PrcCommMethods.ADMIN_API(CusModelObj, 'GET_USERS_BY_ENTITY').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.USERS_LIST = data.data.Table;
            }
            else { $scope.USERS_LIST = []; };
        });
    };

});
app.controller('MicrosDataUploadController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $localStorage) {
    $scope.$parent.PAGE_HEADER = "Micros Data Upload";
    $scope.$parent.urlpath = "MicrosDataUpload";
    $scope.$parent.$parent.overlay_loading = 'none';
    $scope.MicrosDataUploadSearch = {
        MICROS_FILE_UPLOAD: null,

        LOGO_PATH: '',
        CUSTOMER_ID: '',
        UploadedFiles: [],
        USER_ID: '',
        FILE_NAME: '',
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        LOG_PAGE_NO: 1,
        LOG_PAGE_SIZE: 10,
        CLICK_SEARCH: 0,
        UPL_FILE_FLAG: 1,
        ORIGINAL_FILE_NAME: '',
        SERVER_FILE_NAME: '',
        BRANCH_BUDGET_LOG: null,
        START_DATE: null,
        END_DATE: null,
        SAMPLE_EXCEL_FILE: null,
        VIEW_BRANCH_BUDGETS: [],
        ENTITY_ID_UPLOAD: null,


    };
    $scope.UPLOAD_FILE_NAME = null;
    $scope.INVALID_EXCLE_CELL_COUNT = null;
    $scope.INVALID_EXCLE_CELL_FLAG = true;
    $scope.UPLOAD_FILE_NAME = [{ "FILE_NAME": "DISCOUNT DAILY TOTAL", "ID": 1 },
    { "FILE_NAME": "GUEST CHECK", "ID": 6 },
    { "FILE_NAME": "MENU ITEM DAILY TOTAL", "ID": 3 },
    { "FILE_NAME": "SERVICE CHARGE DAILY TOTAL", "ID": 4 },
    { "FILE_NAME": "TAX DAILY TOTAL", "ID": 5 },
    { "FILE_NAME": "TENDER DAILY TOTAL", "ID": 2 }];
    $scope.Files = null;
    $scope.DISABLE_UPLOAD_BUTTON = false;


    $scope.MICROS_DISCOUNT_DAILY_TOTAL_TYPE = [        { ID: 1, COLUMN_NAME: 'BUSINESS_DATE', MATCH_COLUMN_NAME: 'Business Date', IS_MANDATORY: true, HEADER_NAME: 'Business Date', FIELD_TYPE_ID: 9, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 2, COLUMN_NAME: 'CATEGORY_GROUP1_NAME', MATCH_COLUMN_NAME: 'Category Group 1 Name', IS_MANDATORY: true, HEADER_NAME: 'Category Group 1 Name', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 3, COLUMN_NAME: 'CATEGORY_GROUP2_NAME', MATCH_COLUMN_NAME: 'Category Group 2 Name', IS_MANDATORY: true, HEADER_NAME: 'Category Group 2 Name', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },//TIME DATATYPE        { ID: 4, COLUMN_NAME: 'CATEGORY_GROUP3_NAME', MATCH_COLUMN_NAME: 'Category Group 3 Name', IS_MANDATORY: true, HEADER_NAME: 'Category Group 3 Name', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 5, COLUMN_NAME: 'CATEGORY_GROUP4_NAME', MATCH_COLUMN_NAME: 'Category Group 4 Name', IS_MANDATORY: true, HEADER_NAME: 'Category Group 4 Name', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 6, COLUMN_NAME: 'DISCOUNT_COUNT_SUM', MATCH_COLUMN_NAME: 'Discount Count  (Sum)', IS_MANDATORY: true, HEADER_NAME: 'Discount Count  (Sum)', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 7, COLUMN_NAME: 'DISCOUNT_NAME', MATCH_COLUMN_NAME: 'Discount Name', IS_MANDATORY: true, HEADER_NAME: 'Discount Name', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 8, COLUMN_NAME: 'DISCOUNT_NUMBER', MATCH_COLUMN_NAME: 'Discount Number', IS_MANDATORY: true, HEADER_NAME: 'Discount Number', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 9, COLUMN_NAME: 'DISCOUNT_TOTAL_SUM', MATCH_COLUMN_NAME: 'Discount Total  (Sum)', IS_MANDATORY: true, HEADER_NAME: 'Discount Total  (Sum)', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 10, COLUMN_NAME: 'LOCATION_NAME', MATCH_COLUMN_NAME: 'Location Name', IS_MANDATORY: true, HEADER_NAME: 'Location Name', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 11, COLUMN_NAME: 'LOCATION_REFERENCE', MATCH_COLUMN_NAME: 'Location Reference', IS_MANDATORY: true, HEADER_NAME: 'Location Reference', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 12, COLUMN_NAME: 'REVENUE_CENTER_NAME', MATCH_COLUMN_NAME: 'Revenue Center Name', IS_MANDATORY: true, HEADER_NAME: 'Revenue Center Name', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },    ];
    $scope.MICROS_GUEST_CHECK_TYPE = [        { ID: 1, COLUMN_NAME: 'CHECK_NUMBER', MATCH_COLUMN_NAME: 'Check Number', IS_MANDATORY: true, HEADER_NAME: 'Check Number', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 2, COLUMN_NAME: 'CHECK_REF', MATCH_COLUMN_NAME: 'Check Ref.', IS_MANDATORY: true, HEADER_NAME: 'Check Ref.', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 3, COLUMN_NAME: 'CHECK_TOTAL_SUM', MATCH_COLUMN_NAME: 'Check Total  (Sum)', IS_MANDATORY: true, HEADER_NAME: 'Check Total  (Sum)', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 4, COLUMN_NAME: 'CLOSE_BUSINESS_DATE', MATCH_COLUMN_NAME: 'Close Business Date', IS_MANDATORY: true, HEADER_NAME: 'Close Business Date', FIELD_TYPE_ID: 9, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 5, COLUMN_NAME: 'CLOSE_FIXED_PERIOD', MATCH_COLUMN_NAME: 'Close Fixed Period', IS_MANDATORY: true, HEADER_NAME: 'Close Fixed Period', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 6, COLUMN_NAME: 'CLOSED', MATCH_COLUMN_NAME: 'Closed', IS_MANDATORY: true, HEADER_NAME: 'Closed', FIELD_TYPE_ID: 14, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 7, COLUMN_NAME: 'DISCOUNT_TOTAL_SUM', MATCH_COLUMN_NAME: 'Discount Total  (Sum)', IS_MANDATORY: true, HEADER_NAME: 'Discount Total  (Sum)', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 8, COLUMN_NAME: 'EMPLOYEE_LAST_NAME', MATCH_COLUMN_NAME: 'Employee Last Name', IS_MANDATORY: true, HEADER_NAME: 'Employee Last Name', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 9, COLUMN_NAME: 'ERROR_CORRECT_TOTAL_SUM', MATCH_COLUMN_NAME: 'Error Correct Total  (Sum)', IS_MANDATORY: true, HEADER_NAME: 'Error Correct Total  (Sum)', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 10, COLUMN_NAME: 'INFO', MATCH_COLUMN_NAME: 'Info', IS_MANDATORY: true, HEADER_NAME: 'Info', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 11, COLUMN_NAME: 'IQRYEMPLOYEENUMBER', MATCH_COLUMN_NAME: 'iQryemployeeNumber', IS_MANDATORY: true, HEADER_NAME: 'iQryemployeeNumber', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 12, COLUMN_NAME: 'LOCATION_NAME', MATCH_COLUMN_NAME: 'Location Name', IS_MANDATORY: true, HEADER_NAME: 'Location Name', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 13, COLUMN_NAME: 'LOCATION_REFERENCE', MATCH_COLUMN_NAME: 'Location Reference', IS_MANDATORY: true, HEADER_NAME: 'Location Reference', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 14, COLUMN_NAME: 'MANAGER_VOID_TOTAL_SUM', MATCH_COLUMN_NAME: 'Manager Void Total  (Sum)', IS_MANDATORY: true, HEADER_NAME: 'Manager Void Total  (Sum)', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 15, COLUMN_NAME: 'NO_GUESTS_SUM', MATCH_COLUMN_NAME: 'Number of Guests  (Sum)', IS_MANDATORY: true, HEADER_NAME: 'Number of Guests  (Sum)', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 16, COLUMN_NAME: 'NO_ITEMS_SUM', MATCH_COLUMN_NAME: 'Number of Items  (Sum)', IS_MANDATORY: true, HEADER_NAME: 'Number of Items  (Sum)', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 17, COLUMN_NAME: 'SERVICE_ROUNDS_SUM', MATCH_COLUMN_NAME: 'Number of Service Rounds  (Sum)', IS_MANDATORY: true, HEADER_NAME: 'Number of Service Rounds  (Sum)', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 18, COLUMN_NAME: 'OPEN_BUSINESS_DATE', MATCH_COLUMN_NAME: 'Open Business Date', IS_MANDATORY: true, HEADER_NAME: 'Open Business Date', FIELD_TYPE_ID: 9, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 19, COLUMN_NAME: 'OPEN_FIXED_PERIOD', MATCH_COLUMN_NAME: 'Open Fixed Period', IS_MANDATORY: true, HEADER_NAME: 'Open Fixed Period', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 20, COLUMN_NAME: 'OPENED', MATCH_COLUMN_NAME: 'Opened', IS_MANDATORY: true, HEADER_NAME: 'Opened', FIELD_TYPE_ID: 14, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 21, COLUMN_NAME: 'ORDER_TYPE_NAME', MATCH_COLUMN_NAME: 'Order Type Name', IS_MANDATORY: true, HEADER_NAME: 'Order Type Name', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 22, COLUMN_NAME: 'RETURN_TOTAL_SUM', MATCH_COLUMN_NAME: 'Return Total  (Sum)', IS_MANDATORY: true, HEADER_NAME: 'Return Total  (Sum)', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 23, COLUMN_NAME: 'REVENUE_CENTER_NAME', MATCH_COLUMN_NAME: 'Revenue Center Name', IS_MANDATORY: true, HEADER_NAME: 'Revenue Center Name', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 24, COLUMN_NAME: 'SERVICE_CHARGE_TOTAL_SUM', MATCH_COLUMN_NAME: 'Service Charge Total  (Sum)', IS_MANDATORY: true, HEADER_NAME: 'Service Charge Total  (Sum)', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 25, COLUMN_NAME: 'SUB_TOTAL_SUM', MATCH_COLUMN_NAME: 'Sub-total  (Sum)', IS_MANDATORY: true, HEADER_NAME: 'Sub-total  (Sum)', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 26, COLUMN_NAME: 'TABLE_GROUP_NO', MATCH_COLUMN_NAME: 'Table Group Number', IS_MANDATORY: true, HEADER_NAME: 'Table Group Number', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 27, COLUMN_NAME: 'TABLE_REF', MATCH_COLUMN_NAME: 'Table Ref.', IS_MANDATORY: true, HEADER_NAME: 'Table Ref.', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 28, COLUMN_NAME: 'TAX_EXEMPT_SUM', MATCH_COLUMN_NAME: 'Tax Exempt  (Sum)', IS_MANDATORY: true, HEADER_NAME: 'Tax Exempt  (Sum)', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 29, COLUMN_NAME: 'TAX_TOTAL_SUM', MATCH_COLUMN_NAME: 'Tax Total  (Sum)', IS_MANDATORY: true, HEADER_NAME: 'Tax Total  (Sum)', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 30, COLUMN_NAME: 'TIP_TOTAL_SUM', MATCH_COLUMN_NAME: 'Tip Total  (Sum)', IS_MANDATORY: true, HEADER_NAME: 'Tip Total  (Sum)', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 31, COLUMN_NAME: 'TRANSFER_STATUS', MATCH_COLUMN_NAME: 'Transfer Status', IS_MANDATORY: true, HEADER_NAME: 'Transfer Status', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 32, COLUMN_NAME: 'TRANSFER_CHECK_NO', MATCH_COLUMN_NAME: 'Transfer to Check Number', IS_MANDATORY: true, HEADER_NAME: 'Transfer to Check Number', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 33, COLUMN_NAME: 'VOID_TOTAL_SUM', MATCH_COLUMN_NAME: 'Void Total  (Sum)', IS_MANDATORY: true, HEADER_NAME: 'Void Total  (Sum)', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true }    ];
    $scope.MICROS_MENU_ITEM_DAILY_TOTAL_TYPE = [        { ID: 1, COLUMN_NAME: 'BUSINESS_DATE', MATCH_COLUMN_NAME: 'Business Date', IS_MANDATORY: true, HEADER_NAME: 'Business Date', FIELD_TYPE_ID: 9, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 2, COLUMN_NAME: 'CATEGORY_GROUP1_NAME', MATCH_COLUMN_NAME: 'Category Group 1 Name', IS_MANDATORY: true, HEADER_NAME: 'Category Group 1 Name', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 3, COLUMN_NAME: 'CATEGORY_GROUP2_NAME', MATCH_COLUMN_NAME: 'Category Group 2 Name', IS_MANDATORY: true, HEADER_NAME: 'Category Group 2 Name', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },//TIME DATATYPE        { ID: 4, COLUMN_NAME: 'CATEGORY_GROUP3_NAME', MATCH_COLUMN_NAME: 'Category Group 3 Name', IS_MANDATORY: true, HEADER_NAME: 'Category Group 3 Name', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 5, COLUMN_NAME: 'CATEGORY_GROUP4_NAME', MATCH_COLUMN_NAME: 'Category Group 4 Name', IS_MANDATORY: true, HEADER_NAME: 'Category Group 4 Name', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 6, COLUMN_NAME: 'DISCOUNT_TOTAL_SUM', MATCH_COLUMN_NAME: 'Discount Total  (Sum)', IS_MANDATORY: true, HEADER_NAME: 'Discount Total  (Sum)', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 7, COLUMN_NAME: 'DISCOUNT_VAT_TOTAL_EXT_SUM', MATCH_COLUMN_NAME: 'Discount VAT Total Ext  (Sum)', IS_MANDATORY: true, HEADER_NAME: 'Discount VAT Total Ext  (Sum)', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 8, COLUMN_NAME: 'EXT_REF1', MATCH_COLUMN_NAME: 'Ext Ref 1', IS_MANDATORY: true, HEADER_NAME: 'Ext Ref 1', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 9, COLUMN_NAME: 'FAMILY_GROUP_NAME', MATCH_COLUMN_NAME: 'Family Group Name', IS_MANDATORY: true, HEADER_NAME: 'Family Group Name', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 10, COLUMN_NAME: 'GROSS_SALES_AFTER_DISC_SUM', MATCH_COLUMN_NAME: 'Gross Sales after Disc.  (Sum)', IS_MANDATORY: true, HEADER_NAME: 'Gross Sales after Disc.  (Sum)', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 11, COLUMN_NAME: 'GROSS_SALES_BEFORE_DISC_SUM', MATCH_COLUMN_NAME: 'Gross Sales before Disc.  (Sum)', IS_MANDATORY: true, HEADER_NAME: 'Gross Sales before Disc.  (Sum)', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 12, COLUMN_NAME: 'LOCATION_NAME', MATCH_COLUMN_NAME: 'Location Name', IS_MANDATORY: true, HEADER_NAME: 'Location Name', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 13, COLUMN_NAME: 'LOCATION_REFERENCE', MATCH_COLUMN_NAME: 'Location Reference', IS_MANDATORY: true, HEADER_NAME: 'Location Reference', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 14, COLUMN_NAME: 'MAJOR_GROUP_NAME', MATCH_COLUMN_NAME: 'Major Group Name', IS_MANDATORY: true, HEADER_NAME: 'Major Group Name', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 15, COLUMN_NAME: 'MENU_ITEM_NAME', MATCH_COLUMN_NAME: 'Menu Item Name', IS_MANDATORY: true, HEADER_NAME: 'Menu Item Name', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 16, COLUMN_NAME: 'MENU_ITEM_NUMBER', MATCH_COLUMN_NAME: 'Menu Item Number', IS_MANDATORY: true, HEADER_NAME: 'Menu Item Number', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 17, COLUMN_NAME: 'ORDER_TYPE_NAME', MATCH_COLUMN_NAME: 'Order Type Name', IS_MANDATORY: true, HEADER_NAME: 'Order Type Name', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 18, COLUMN_NAME: 'PREP_COST_SUM', MATCH_COLUMN_NAME: 'Prep. Cost  (Sum)', IS_MANDATORY: true, HEADER_NAME: 'Prep. Cost  (Sum)', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 19, COLUMN_NAME: 'RETURN_COUNT_SUM', MATCH_COLUMN_NAME: 'Return Count  (Sum)', IS_MANDATORY: true, HEADER_NAME: 'Return Count  (Sum)', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 20, COLUMN_NAME: 'REVENUE_CENTER_NAME', MATCH_COLUMN_NAME: 'Revenue Center Name', IS_MANDATORY: true, HEADER_NAME: 'Revenue Center Name', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 21, COLUMN_NAME: 'SALES_COUNT_SUM', MATCH_COLUMN_NAME: 'Sales Count  (Sum)', IS_MANDATORY: true, HEADER_NAME: 'Sales Count  (Sum)', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 23, COLUMN_NAME: 'SALES_NET_VAT_AFTER_DISC_SUM', MATCH_COLUMN_NAME: 'Sales Net VAT after Disc.  (Sum)', IS_MANDATORY: true, HEADER_NAME: 'Sales Net VAT after Disc.  (Sum)', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 24, COLUMN_NAME: 'SALES_NET_VAT_BEFORE_DISC_SUM', MATCH_COLUMN_NAME: 'Sales Net VAT before Disc.  (Sum)', IS_MANDATORY: true, HEADER_NAME: 'Sales Net VAT before Disc.  (Sum)', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 25, COLUMN_NAME: 'SALES_TOTAL_SUM', MATCH_COLUMN_NAME: 'Sales Total  (Sum)', IS_MANDATORY: true, HEADER_NAME: 'Sales Total  (Sum)', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 26, COLUMN_NAME: 'VAT_TOTAL_SUM', MATCH_COLUMN_NAME: 'VAT Total  (Sum)', IS_MANDATORY: true, HEADER_NAME: 'VAT Total  (Sum)', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 27, COLUMN_NAME: 'VAT_TOTAL_EXT_SUM', MATCH_COLUMN_NAME: 'VAT Total Ext  (Sum)', IS_MANDATORY: true, HEADER_NAME: 'VAT Total Ext  (Sum)', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 28, COLUMN_NAME: 'VOLUME_SUM', MATCH_COLUMN_NAME: 'Volume  (Sum)', IS_MANDATORY: true, HEADER_NAME: 'Volume  (Sum)', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },    ];
    $scope.MICROS_SERVICE_CHARGE_DAILY_TOTAL_TYPE = [        { ID: 1, COLUMN_NAME: 'BUSINESS_DATE', MATCH_COLUMN_NAME: 'Business Date', IS_MANDATORY: true, HEADER_NAME: 'Business Date', FIELD_TYPE_ID: 9, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 2, COLUMN_NAME: 'CATEGORY_GROUP1_NAME', MATCH_COLUMN_NAME: 'Category Group 1 Name', IS_MANDATORY: true, HEADER_NAME: 'Category Group 1 Name', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 3, COLUMN_NAME: 'CATEGORY_GROUP2_NAME', MATCH_COLUMN_NAME: 'Category Group 2 Name', IS_MANDATORY: true, HEADER_NAME: 'Category Group 2 Name', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },//TIME DATATYPE        { ID: 4, COLUMN_NAME: 'CATEGORY_GROUP3_NAME', MATCH_COLUMN_NAME: 'Category Group 3 Name', IS_MANDATORY: true, HEADER_NAME: 'Category Group 3 Name', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 5, COLUMN_NAME: 'CATEGORY_GROUP4_NAME', MATCH_COLUMN_NAME: 'Category Group 4 Name', IS_MANDATORY: true, HEADER_NAME: 'Category Group 4 Name', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 6, COLUMN_NAME: 'LOCATION_NAME', MATCH_COLUMN_NAME: 'Location Name', IS_MANDATORY: true, HEADER_NAME: 'Location Name', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 7, COLUMN_NAME: 'LOCATION_REFERENCE', MATCH_COLUMN_NAME: 'Location Reference', IS_MANDATORY: true, HEADER_NAME: 'Location Reference', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 8, COLUMN_NAME: 'REVENUE_CENTER_NAME', MATCH_COLUMN_NAME: 'Revenue Center Name', IS_MANDATORY: true, HEADER_NAME: 'Revenue Center Name', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 9, COLUMN_NAME: 'SERVICE_CHARGE_COUNT_SUM', MATCH_COLUMN_NAME: 'Service Charge Count  (Sum)', IS_MANDATORY: true, HEADER_NAME: 'Service Charge Count  (Sum)', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 10, COLUMN_NAME: 'SERVICE_CHARGE_NAME', MATCH_COLUMN_NAME: 'Service Charge Name', IS_MANDATORY: true, HEADER_NAME: 'Service Charge Name', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 11, COLUMN_NAME: 'SERVICE_CHARGE_NUMBER', MATCH_COLUMN_NAME: 'Service Charge Number', IS_MANDATORY: true, HEADER_NAME: 'Service Charge Number', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 12, COLUMN_NAME: 'SERVICE_CHARGE_TOTAL_SUM', MATCH_COLUMN_NAME: 'Service Charge Total  (Sum)', IS_MANDATORY: true, HEADER_NAME: 'Service Charge Total  (Sum)', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 13, COLUMN_NAME: 'TAX_RATE', MATCH_COLUMN_NAME: 'Tax Rate', IS_MANDATORY: true, HEADER_NAME: 'Tax Rate', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 14, COLUMN_NAME: 'TYPE', MATCH_COLUMN_NAME: 'Type', IS_MANDATORY: true, HEADER_NAME: 'Type', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },    ];
    $scope.MICROS_TAX_DAILY_TOTAL_TYPE = [        { ID: 1, COLUMN_NAME: 'BUSINESS_DATE', MATCH_COLUMN_NAME: 'Business Date', IS_MANDATORY: true, HEADER_NAME: 'Business Date', FIELD_TYPE_ID: 9, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 2, COLUMN_NAME: 'CATEGORY_GROUP1_NAME', MATCH_COLUMN_NAME: 'Category Group 1 Name', IS_MANDATORY: true, HEADER_NAME: 'Category Group 1 Name', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 3, COLUMN_NAME: 'CATEGORY_GROUP2_NAME', MATCH_COLUMN_NAME: 'Category Group 2 Name', IS_MANDATORY: true, HEADER_NAME: 'Category Group 2 Name', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },//TIME DATATYPE        { ID: 4, COLUMN_NAME: 'CATEGORY_GROUP3_NAME', MATCH_COLUMN_NAME: 'Category Group 3 Name', IS_MANDATORY: true, HEADER_NAME: 'Category Group 3 Name', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 5, COLUMN_NAME: 'CATEGORY_GROUP4_NAME', MATCH_COLUMN_NAME: 'Category Group 4 Name', IS_MANDATORY: true, HEADER_NAME: 'Category Group 4 Name', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 6, COLUMN_NAME: 'LOCATION_NAME', MATCH_COLUMN_NAME: 'Location Name', IS_MANDATORY: true, HEADER_NAME: 'Location Name', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 7, COLUMN_NAME: 'LOCATION_REFERENCE', MATCH_COLUMN_NAME: 'Location Reference', IS_MANDATORY: true, HEADER_NAME: 'Location Reference', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 8, COLUMN_NAME: 'REVENUE_CENTER_NAME', MATCH_COLUMN_NAME: 'Revenue Center Name', IS_MANDATORY: true, HEADER_NAME: 'Revenue Center Name', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 9, COLUMN_NAME: 'TAX_COLLECTED_SUM', MATCH_COLUMN_NAME: 'Tax Collected  (Sum)', IS_MANDATORY: true, HEADER_NAME: 'Tax Collected  (Sum)', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 10, COLUMN_NAME: 'TAX_EXEMPT_SALES_SUM', MATCH_COLUMN_NAME: 'Tax Exempt Sales  (Sum)', IS_MANDATORY: true, HEADER_NAME: 'Tax Exempt Sales  (Sum)', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 11, COLUMN_NAME: 'TAX_NAME', MATCH_COLUMN_NAME: 'Tax Name', IS_MANDATORY: true, HEADER_NAME: 'Tax Name', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 12, COLUMN_NAME: 'TAX_NUMBER', MATCH_COLUMN_NAME: 'Tax Number', IS_MANDATORY: true, HEADER_NAME: 'Tax Number', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 13, COLUMN_NAME: 'TAX_RATE', MATCH_COLUMN_NAME: 'Tax Rate', IS_MANDATORY: true, HEADER_NAME: 'Tax Rate', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 14, COLUMN_NAME: 'TAXABLE_SALES_SUM', MATCH_COLUMN_NAME: 'Taxable Sales  (Sum)', IS_MANDATORY: true, HEADER_NAME: 'Taxable Sales  (Sum)', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 15, COLUMN_NAME: 'TYPE', MATCH_COLUMN_NAME: 'Type', IS_MANDATORY: true, HEADER_NAME: 'Type', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },    ];
    $scope.MICROS_TENDER_DAILY_TOTAL_TYPE = [        { ID: 1, COLUMN_NAME: 'BUSINESS_DATE', MATCH_COLUMN_NAME: 'Business Date', IS_MANDATORY: true, HEADER_NAME: 'Business Date', FIELD_TYPE_ID: 9, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 2, COLUMN_NAME: 'CATEGORY_GROUP1_NAME', MATCH_COLUMN_NAME: 'Category Group 1 Name', IS_MANDATORY: true, HEADER_NAME: 'Category Group 1 Name', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 3, COLUMN_NAME: 'CATEGORY_GROUP2_NAME', MATCH_COLUMN_NAME: 'Category Group 2 Name', IS_MANDATORY: true, HEADER_NAME: 'Category Group 2 Name', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },//TIME DATATYPE        { ID: 4, COLUMN_NAME: 'CATEGORY_GROUP3_NAME', MATCH_COLUMN_NAME: 'Category Group 3 Name', IS_MANDATORY: true, HEADER_NAME: 'Category Group 3 Name', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 5, COLUMN_NAME: 'CATEGORY_GROUP4_NAME', MATCH_COLUMN_NAME: 'Category Group 4 Name', IS_MANDATORY: true, HEADER_NAME: 'Category Group 4 Name', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 6, COLUMN_NAME: 'LOCATION_NAME', MATCH_COLUMN_NAME: 'Location Name', IS_MANDATORY: true, HEADER_NAME: 'Location Name', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 7, COLUMN_NAME: 'LOCATION_REFERENCE', MATCH_COLUMN_NAME: 'Location Reference', IS_MANDATORY: true, HEADER_NAME: 'Location Reference', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 8, COLUMN_NAME: 'REVENUE_CENTER_NAME', MATCH_COLUMN_NAME: 'Revenue Center Name', IS_MANDATORY: true, HEADER_NAME: 'Revenue Center Name', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 9, COLUMN_NAME: 'TENDER_COUNT_SUM', MATCH_COLUMN_NAME: 'Tender Count  (Sum)', IS_MANDATORY: true, HEADER_NAME: 'Tender Count  (Sum)', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 10, COLUMN_NAME: 'TENDER_NAME', MATCH_COLUMN_NAME: 'Tender Name', IS_MANDATORY: true, HEADER_NAME: 'Tender Name', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 11, COLUMN_NAME: 'TENDER_NUMBER', MATCH_COLUMN_NAME: 'Tender Number', IS_MANDATORY: true, HEADER_NAME: 'Tender Number', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },        { ID: 12, COLUMN_NAME: 'TENDER_TOTAL_SUM', MATCH_COLUMN_NAME: 'Tender Total  (Sum)', IS_MANDATORY: true, HEADER_NAME: 'Tender Total  (Sum)', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },    ];

    $scope.INS_MICROS_DISCOUNT_DAILY_TOTAL = function (MICROS_FILE_UPLOAD) {
        $scope.MicrosDataUploadForm.submitted = true;
        $scope.SHOW_TABLE = false;
        $scope.ERROR_EXCEL_DATA_LISE = [];
        var UPLOAD_FILE_COUNT = 0;
        if ($scope.MicrosDataUploadSearch.UploadedFiles.length > 0) {
            UPLOAD_FILE_COUNT++
        }

        if ($scope.MicrosDataUploadForm.$valid && UPLOAD_FILE_COUNT > 0) {
            $scope.$parent.$parent.overlay_loading = 'block';
            $scope.DISABLE_UPLOAD_BUTTON = true;
            ModelObj = new Object();
            ModelObj.MICROS_UPLOAD_ID = $scope.MicrosDataUploadSearch.MICROS_FILE_UPLOAD;
            ModelObj.USER_ID = parseInt($cookies.get("USERID"));
            ModelObj.SERVER_FILE_NAME = $scope.MicrosDataUploadSearch.UploadedFiles[0].SERVER_FILE_NAME;
            ModelObj.ORIGINAL_FILE_NAME = $scope.MicrosDataUploadSearch.UploadedFiles[0].ORIGINAL_FILE_NAME;
            ModelObj.LOGO_PATH = $scope.MicrosDataUploadSearch.UploadedFiles[0].FILE_PATH + $scope.MicrosDataUploadSearch.UploadedFiles[0].SERVER_FILE_NAME;
            //ModelObj.LOGO_PATH = ModelObj.LOGO_PATH.replace(/^.+?[/]/, '');
            if ($scope.MicrosDataUploadSearch.MICROS_FILE_UPLOAD == 1) {
                ModelObj.MICROS_DATATABLE = $scope.MICROS_DISCOUNT_DAILY_TOTAL_TYPE;
                PrcCommMethods.ADMIN_API(ModelObj, 'INS_MICROS_DISCOUNT_DAILY_TOTAL').then(function (data) {
                    if (data.data != null) {
                        if (data.data.Table1 != undefined && data.data.Table1[0]["ERROR"] == "CODE001") {
                            $scope.$parent.ShowAlert('Attention', 'Please check, uploaded excel file. Columns name are not match.', 3000);
                        }
                        else {
                            if (data.data.PO_SUCCESS_DT.length > 0) {
                                if (data.data.PO_SUCCESS_DT[0]['PO_SUCCESS'] == '1') {
                                    $scope.$parent.ShowAlert('Success', 'File uploaded successfully', 3000);
                                }
                                else if (data.data.PO_SUCCESS_DT[0]['PO_SUCCESS'] == '0') {
                                    $scope.SHOW_TABLE = true;
                                    $scope.JSON_COLUMN_NAME = Object.keys(data.data.Table[0]);
                                    $scope.ERROR_EXCEL_DATA_LISE = data.data.Table;
                                    $scope.$parent.ShowAlert('Error', 'Please check comment in below table.', 3000);
                                }
                            }
                            else {
                                $scope.$parent.ShowAlert('Attention', 'Please check uploaded file', 3000);
                            }
                        }
                    }
                    else {
                        $scope.$parent.ShowAlert('Attention', 'Please check uploaded file', 3000);
                    }
                    $scope.DISABLE_UPLOAD_BUTTON = false;
                    $scope.$parent.$parent.overlay_loading = 'none';
                    document.getElementById('uploadExcel1').value = '';
                    $scope.MicrosDataUploadSearch.MICROS_FILE_UPLOAD = null;
                    $scope.MicrosDataUploadForm.submitted = false;
                });
            }
            else if ($scope.MicrosDataUploadSearch.MICROS_FILE_UPLOAD == 6) {
                ModelObj.MICROS_DATATABLE = $scope.MICROS_GUEST_CHECK_TYPE;
                PrcCommMethods.ADMIN_API(ModelObj, 'INS_MICROS_GUEST_CHECK').then(function (data) {
                    if (data.data != null) {
                        if (data.data.Table1 != undefined && data.data.Table1[0]["ERROR"] == "CODE002") {
                            $scope.$parent.ShowAlert('Attention', 'Please check, uploaded excel file. Columns name are not match.', 3000);
                        }
                        else {
                            if (data.data.PO_SUCCESS_DT.length > 0) {
                                if (data.data.PO_SUCCESS_DT[0]['PO_SUCCESS'] == '1') {
                                    $scope.$parent.ShowAlert('Success', 'File uploaded successfully', 3000);
                                }
                                else if (data.data.PO_SUCCESS_DT[0]['PO_SUCCESS'] == '0') {
                                    $scope.SHOW_TABLE = true;
                                    $scope.JSON_COLUMN_NAME = Object.keys(data.data.Table[0]);
                                    $scope.ERROR_EXCEL_DATA_LISE = data.data.Table;
                                    $scope.$parent.ShowAlert('Error', 'Please check comment in below table.', 3000);
                                }
                            }
                            else {
                                $scope.$parent.ShowAlert('Attention', 'Please check uploaded file', 3000);
                            }
                        }
                    }
                    else {
                        $scope.$parent.ShowAlert('Attention', 'Please check uploaded file', 3000);
                    }
                    $scope.DISABLE_UPLOAD_BUTTON = false;
                    $scope.$parent.$parent.overlay_loading = 'none';
                    document.getElementById('uploadExcel1').value = '';
                    $scope.MicrosDataUploadSearch.MICROS_FILE_UPLOAD = null;
                    $scope.MicrosDataUploadForm.submitted = false;
                });
            }
            else if ($scope.MicrosDataUploadSearch.MICROS_FILE_UPLOAD == 3) {
                ModelObj.MICROS_DATATABLE = $scope.MICROS_MENU_ITEM_DAILY_TOTAL_TYPE;
                PrcCommMethods.ADMIN_API(ModelObj, 'INS_MICROS_MENU_ITEM_DAILY_TOTAL').then(function (data) {
                    if (data.data != null) {
                        if (data.data.Table1 != undefined && data.data.Table1[0]["ERROR"] == "CODE003") {
                            $scope.$parent.ShowAlert('Attention', 'Please check, uploaded excel file.Columns name are not match.', 3000);
                        }
                        else {
                            if (data.data.PO_SUCCESS_DT.length > 0) {
                                if (data.data.PO_SUCCESS_DT[0]['PO_SUCCESS'] == '1') {
                                    $scope.$parent.ShowAlert('Success', 'File uploaded successfully', 3000);
                                }
                                else if (data.data.PO_SUCCESS_DT[0]['PO_SUCCESS'] == '0') {
                                    $scope.SHOW_TABLE = true;
                                    $scope.JSON_COLUMN_NAME = Object.keys(data.data.Table[0]);
                                    $scope.ERROR_EXCEL_DATA_LISE = data.data.Table;
                                    $scope.$parent.ShowAlert('Error', 'Please check comment in below table.', 3000);
                                }
                            }
                            else {
                                $scope.$parent.ShowAlert('Attention', 'Please check uploaded file', 3000);
                            }
                        }
                    }
                    else {
                        $scope.$parent.ShowAlert('Attention', 'Please check uploaded file', 3000);
                    }
                    $scope.DISABLE_UPLOAD_BUTTON = false;
                    $scope.$parent.$parent.overlay_loading = 'none';
                    document.getElementById('uploadExcel1').value = '';
                    $scope.MicrosDataUploadSearch.MICROS_FILE_UPLOAD = null;
                    $scope.MicrosDataUploadForm.submitted = false;
                });
            }
            else if ($scope.MicrosDataUploadSearch.MICROS_FILE_UPLOAD == 4) {
                ModelObj.MICROS_DATATABLE = $scope.MICROS_SERVICE_CHARGE_DAILY_TOTAL_TYPE;
                PrcCommMethods.ADMIN_API(ModelObj, 'INS_MICROS_SERVICE_CHARGE_DAILY_TOTAL').then(function (data) {
                    if (data.data != null) {
                        if (data.data.Table1 != undefined && data.data.Table1[0]["ERROR"] == "CODE004") {
                            $scope.$parent.ShowAlert('Attention', 'Please check, uploaded excel file. Columns name are not match.', 3000);
                        }
                        else {
                            if (data.data.PO_SUCCESS_DT.length > 0) {
                                if (data.data.PO_SUCCESS_DT[0]['PO_SUCCESS'] == '1') {
                                    $scope.$parent.ShowAlert('Success', 'File uploaded successfully', 3000);
                                }
                                else if (data.data.PO_SUCCESS_DT[0]['PO_SUCCESS'] == '0') {
                                    $scope.SHOW_TABLE = true;
                                    $scope.JSON_COLUMN_NAME = Object.keys(data.data.Table[0]);
                                    $scope.ERROR_EXCEL_DATA_LISE = data.data.Table;
                                    $scope.$parent.ShowAlert('Error', 'Please check comment in below table.', 3000);
                                }
                            }
                            else {
                                $scope.$parent.ShowAlert('Attention', 'Please check uploaded file', 3000);
                            }
                        }
                    }
                    else {
                        $scope.$parent.ShowAlert('Attention', 'Please check uploaded file', 3000);
                    }
                    $scope.DISABLE_UPLOAD_BUTTON = false;
                    $scope.$parent.$parent.overlay_loading = 'none';
                    document.getElementById('uploadExcel1').value = '';
                    $scope.MicrosDataUploadSearch.MICROS_FILE_UPLOAD = null;
                    $scope.MicrosDataUploadForm.submitted = false;
                });
            }
            else if ($scope.MicrosDataUploadSearch.MICROS_FILE_UPLOAD == 5) {
                ModelObj.MICROS_DATATABLE = $scope.MICROS_TAX_DAILY_TOTAL_TYPE;
                PrcCommMethods.ADMIN_API(ModelObj, 'INS_MICROS_TAX_DAILY_TOTAL').then(function (data) {
                    if (data.data != null) {
                        if (data.data.Table1 != undefined && data.data.Table1[0]["ERROR"] == "CODE005") {
                            $scope.$parent.ShowAlert('Attention', 'Please check, uploaded excel file. Columns name are not match.', 3000);
                        } else {
                            if (data.data.PO_SUCCESS_DT.length > 0) {
                                if (data.data.PO_SUCCESS_DT[0]['PO_SUCCESS'] == '1') {
                                    $scope.$parent.ShowAlert('Success', 'File uploaded successfully', 3000);
                                }
                                else if (data.data.PO_SUCCESS_DT[0]['PO_SUCCESS'] == '0') {
                                    $scope.SHOW_TABLE = true;
                                    $scope.JSON_COLUMN_NAME = Object.keys(data.data.Table[0]);
                                    $scope.ERROR_EXCEL_DATA_LISE = data.data.Table;
                                    $scope.$parent.ShowAlert('Error', 'Please check comment in below table.', 3000);
                                }
                            }
                            else {
                                $scope.$parent.ShowAlert('Attention', 'Please check uploaded file', 3000);
                            }
                        }
                    }
                    else {
                        $scope.$parent.ShowAlert('Attention', 'Please check uploaded file', 3000);
                    }
                    $scope.DISABLE_UPLOAD_BUTTON = false;
                    $scope.$parent.$parent.overlay_loading = 'none';
                    document.getElementById('uploadExcel1').value = '';
                    $scope.MicrosDataUploadSearch.MICROS_FILE_UPLOAD = null;
                    $scope.MicrosDataUploadForm.submitted = false;
                });
            }
            else if ($scope.MicrosDataUploadSearch.MICROS_FILE_UPLOAD == 2) {
                ModelObj.MICROS_DATATABLE = $scope.MICROS_TENDER_DAILY_TOTAL_TYPE;
                PrcCommMethods.ADMIN_API(ModelObj, 'INS_MICROS_TENDER_DAILY_TOTAL').then(function (data) {
                    if (data.data != null) {
                        if (data.data.Table1 != undefined && data.data.Table1[0]["ERROR"] == "CODE006") {
                            $scope.$parent.ShowAlert('Attention', 'Please check, uploaded excel file. Columns name are not match.', 3000);
                        } else {
                            if (data.data.PO_SUCCESS_DT.length > 0) {
                                if (data.data.PO_SUCCESS_DT[0]['PO_SUCCESS'] == '1') {
                                    $scope.$parent.ShowAlert('Success', 'File uploaded successfully', 3000);
                                }
                                else if (data.data.PO_SUCCESS_DT[0]['PO_SUCCESS'] == '0') {
                                    $scope.SHOW_TABLE = true;
                                    $scope.JSON_COLUMN_NAME = Object.keys(data.data.Table[0]);
                                    $scope.ERROR_EXCEL_DATA_LISE = data.data.Table;
                                    $scope.$parent.ShowAlert('Error', 'Please check comment in below table.', 3000);
                                }
                            }
                            else {
                                $scope.$parent.ShowAlert('Attention', 'Please check uploaded file', 3000);
                            }
                        }
                    }
                    else {
                        $scope.$parent.ShowAlert('Attention', 'Please check uploaded file', 3000);
                    }
                    $scope.DISABLE_UPLOAD_BUTTON = false;
                    $scope.$parent.$parent.overlay_loading = 'none';
                    document.getElementById('uploadExcel1').value = '';
                    $scope.MicrosDataUploadSearch.MICROS_FILE_UPLOAD = null;
                    $scope.MicrosDataUploadForm.submitted = false;
                });
            }
        }
    };

    $scope.RESET_MICROS = function () {

        $scope.MicrosDataUploadSearch = {
            MICROS_FILE_UPLOAD: null,
            file: null,
            LOGO_PATH: '',
            CUSTOMER_ID: '',
            UploadedFiles: [],
            USER_ID: '',
            FILE_NAME: '',
            UPL_FILE_FLAG: 1,
            ORIGINAL_FILE_NAME: '',
            SERVER_FILE_NAME: '',
        };
        $scope.ERROR_EXCEL_DATA_LISE = [];
        document.getElementById('uploadExcel1').value = '';
        $scope.MicrosDataUploadForm.submitted = false;
    };
});
app.controller('CashupPaymentMappingController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.$parent.PAGE_HEADER = "Cashup Payment Method Mapping";
    // $scope.$parent.urlpath = "Cashup Payment Method Mapping";  
    $scope.INTEGRATIONSYSTEM_LIST = [];
    $scope.EPOS_PAYMENT_LIST = [];
    $scope.PAYMENTMETHOD_NAMES_LIST = [];
    $scope.EPOS_AMOUNT_LIST = [{ Name: '-', EPOS_AMOUNT_FLAG: null }, { Name: '<0', EPOS_AMOUNT_FLAG: -1 }, { Name: '>0', EPOS_AMOUNT_FLAG: 1 }];
    $scope.INTEGRATION_SYSTEM_ID = null;
    var CommonObj;

    $scope.GET_INTEGRATION_SYSTEMS = function () {

        CommonObj = new Object();
        CommonObj.INTEGRATION_TYPE_ID = 1;
        CommonObj.MODULE_ID = 1;
        PrcCommMethods.ADMIN_API(CommonObj, 'GET_INTEGRATION_SYSTEMS_EPOS').then(function (data) {

            $scope.INTEGRATIONSYSTEM_LIST = data.data.Table;
        });

    };
    $scope.GET_CASHUP_PAYMENT_METHOD_DISPLAY_NAMES = function () {

        CommonObj = new Object();
        PrcCommMethods.ADMIN_API(CommonObj, 'GET_CASHUP_PAYMENT_METHOD_DISPLAY_NAMES').then(function (data) {

            $scope.PAYMENTMETHOD_NAMES_LIST = data.data.Table;
        });

    };
    $scope.GET_INTEGRATION_SYSTEMS();
    $scope.GET_CASHUP_PAYMENT_METHOD_DISPLAY_NAMES();
    $scope.GET_EPOS_PAYMENT_METHOD_FOR_MAPPING = function () {

        CommonObj = new Object();
        CommonObj.INTEGRATION_SYSTEM_ID = $scope.INTEGRATION_SYSTEM_ID;
        PrcCommMethods.ADMIN_API(CommonObj, 'GET_EPOS_PAYMENT_METHOD_FOR_MAPPING').then(function (data) {

            if (data.data.Table != undefined && data.data.Table != null) {
                $scope.EPOS_PAYMENT_LIST = data.data.Table;
            } else {
                $scope.EPOS_PAYMENT_LIST = [];
            }
        });

    };

    $scope.INS_UPD_EPOS_PAYMENT_METHOD_MAPPING = function () {

        //$scope.CPMMForm.submitted = true;      
        var count = 0;
        $scope.EPOS_PAYMENT_LIST.filter(function (x) {
            if (x.CASHUP_PAYMENT_METHOD_DISPLAY_NAME_ID != 0) {
                count++;
            }
        });

        if (count > 0) {
            CommonObj = new Object();
            CommonObj.INTEGRATION_SYSTEM_ID = $scope.INTEGRATION_SYSTEM_ID;
            CommonObj.USER_ID = parseInt($cookies.get("USERID"));
            var EPOSPayment_List = [];
            var cnt = 0;
            angular.forEach($scope.EPOS_PAYMENT_LIST, function (val) {
                if (val.CASHUP_PAYMENT_METHOD_DISPLAY_NAME_ID != 0) {
                    var EPOS = new Object();
                    EPOS.TABLE_ID = val.TABLE_ID;
                    EPOS.EPOS_PAYMENT_NAME = val.EPOS_PAYMENT_NAME;
                    EPOS.CASHUP_PAYMENT_METHOD_DISPLAY_NAME_ID = val.CASHUP_PAYMENT_METHOD_DISPLAY_NAME_ID == undefined ? 0 : val.CASHUP_PAYMENT_METHOD_DISPLAY_NAME_ID;
                    EPOS.IS_DELETED = val.CASHUP_PAYMENT_METHOD_DISPLAY_NAME_ID == undefined ? 1 : val.IS_DELETED;
                    EPOS.EPOS_AMOUNT_FLAG = val.EPOS_AMOUNT_FLAG == undefined ? null : val.EPOS_AMOUNT_FLAG;
                    EPOSPayment_List[cnt] = EPOS;
                    cnt++;
                }
            });
            CommonObj.CASHUP_PAYMENT_METHOD_MAPPING = EPOSPayment_List;
            PrcCommMethods.ADMIN_API(CommonObj, 'INS_UPD_EPOS_PAYMENT_METHOD_MAPPING').then(function (data) {
                if (data.data == 1) {
                    $scope.$parent.ShowAlert("Success", "Saved Successfully", 3000);
                    $scope.ResetEPOS();
                } else {
                    $scope.$parent.ShowAlert("Error", "Data not saved.", 3000);
                }
            });
        } else {
            $scope.$parent.ShowAlert("Warning", "Atleast one record selected", 3000);
        }
    };
    $scope.DeleteLine = function (Array, index, EPOS) {

        if (EPOS.TABLE_ID == undefined || EPOS.TABLE_ID == 0) {
            $scope.EPOS_PAYMENT_LIST.splice(index, 1);
        }
        else {
            EPOS.IS_DELETED = 1;

        }
    };
    $scope.ResetEPOS = function () {
        $scope.EPOS_PAYMENT_LIST = [];
        $scope.INTEGRATION_SYSTEM_ID = null;
        $scope.GET_CASHUP_PAYMENT_METHOD_DISPLAY_NAMES();
        $scope.EPOS_AMOUNT_LIST = [{ Name: '-', EPOS_AMOUNT_FLAG: null }, { Name: '<0', EPOS_AMOUNT_FLAG: -1 }, { Name: '>0', EPOS_AMOUNT_FLAG: 1 }];
    }
});
app.controller("NoShowReasonController", function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.$parent.PAGE_HEADER = "No Show Reason";
    $scope.$parent.urlpath = 'Setup_NoShowReason';
    var NoShowModelObj;
    
    $scope.NO_SHOW_REASON_LIST = [];
    $scope.ENTITY_LIST = [];
    $scope.NoShowSearch = {
        NO_SHOW_REASONS_ID: null,
        ACTIVE: -1,
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        NO_SHOW_CODE: null,
        DESCRIPTION: null,
        NO_SHOW_CODE:null
    };
    $scope.ResetNoShow = function () {
        $scope.NoShowSearch = {
            NO_SHOW_REASON_ID: null,
            ACTIVE: -1,
            PAGE_NO: 1,
            PAGE_SIZE: 10,
            NO_SHOW_CODE: null,
            DESCRIPTION: null,
            ENTITY_DISABLE:false
        };
        
        $scope.NoShowForm.submitted = false;
        $scope.NO_SHOW_REASON_LIST = []; 
    };
    $scope.GET_ENTITY_LIST = function () {

        var NsModelObj = new Object();
        
        NsModelObj.ACTIVE = 1;
        NsModelObj.PAGE_NO = 0;
        NsModelObj.USER_ID = parseInt($cookies.get("USERID"));
        NsModelObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(NsModelObj, 'ADMIN_GET_ENTITIES').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.ENTITY_LIST = data.data.Table;
            }
            else { $scope.ENTITY_LIST = []; }
        });

    };
    $scope.GET_ENTITY_LIST();
    $scope.LAZY_ADMIN_GET_NO_SHOW_REASONS = function () { $scope.ADMIN_GET_NO_SHOW_REASONS(); }
    $scope.ADMIN_GET_NO_SHOW_REASONS = function (FLAG) {
        document.getElementById("overlay_loading").style.display = "block";
        NsModelObj = new Object();
        if (FLAG == 1) {
            $scope.NoShowSearch.CLICK_SEARCH = 1;
            $scope.NO_SHOW_REASON_LIST = [];
            $scope.NoShowSearch.PAGE_NO = 1;
            NsModelObj.ACTIVE = $scope.NoShowSearch.ACTIVE == -1 ? -1 : $scope.NoShowSearch.ACTIVE ? 1 : 0;
        }
        else if (FLAG == 2) {
            $scope.NICATEGORY_LIST = [];
            $scope.NoShowSearch.PAGE_NO = 1;
            NsModelObj.ACTIVE = $scope.NoShowSearch.ACTIVE == -1 ? -1 : $scope.NoShowSearch.ACTIVE ? 1 : 0;
        }
        else if (FLAG == undefined) {
            if ($scope.NoShowSearch.CLICK_SEARCH == 1)
                NsModelObj.ACTIVE = $scope.NoShowSearch.ACTIVE == -1 ? -1 : $scope.NoShowSearch.ACTIVE ? 1 : 0;
            else
                NsModelObj.ACTIVE = $scope.NoShowSearch.ACTIVE == -1 ? -1 : $scope.NoShowSearch.ACTIVE ? 1 : 0;
        }

        NsModelObj.ENTITY_ID = $scope.NoShowSearch.CLICK_SEARCH == 1 ? $scope.NoShowSearch.ENTITY_ID : null;         
        NsModelObj.CODE = $scope.NoShowSearch.CLICK_SEARCH == 1 ? $scope.NoShowSearch.NO_SHOW_CODE : '';
        NsModelObj.COMMENTS = $scope.NoShowSearch.CLICK_SEARCH == 1 ? $scope.NoShowSearch.NO_SHOW_DESCRIPTION : '';
        NsModelObj.PAGE_NO = $scope.NoShowSearch.PAGE_NO;
        NsModelObj.PAGE_SIZE = $scope.NoShowSearch.PAGE_SIZE;
        PrcCommMethods.ADMIN_API(NsModelObj, 'ADMIN_GET_NO_SHOW_REASONS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.NO_SHOW_REASON_LIST = $scope.NO_SHOW_REASON_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.NoShowSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                    document.getElementById("overlay_loading").style.display = "none";
                }
                else {
                    $scope.NoShowSearch.PAGE_NO = parseInt($scope.NoShowSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                    document.getElementById("overlay_loading").style.display = "none";
                }
            }
            else {
                $scope.GetData = false;
                $scope.$parent.ShowAlert("Attention", "No records found.", 3000);
                document.getElementById("overlay_loading").style.display = "none";
            }
        });
    };
 
    $scope.ADMIN_INS_UPD_NO_SHOW_REASONS = function () {
        $scope.NoShowForm.submitted = true;
        if ($scope.NoShowForm.$valid) {
            if ($scope.NoShowSearch.ACTIVE == -1) {
                $scope.$parent.ShowAlert("Warning", "Please Select Active/Inactive Status.", 3000);
            }
            else {
                NSModelObj = new Object();
                $scope.NoShowForm.submitted = true;
                if ($scope.NoShowForm.$valid) {
                    NSModelObj.ENTITY_ID = $scope.NoShowSearch.ENTITY_ID;                    
                    NSModelObj.NO_SHOW_REASON_ID = $scope.NoShowSearch.NO_SHOW_REASONS_ID;
                    NSModelObj.CODE = $scope.NoShowSearch.NO_SHOW_CODE;
                    NSModelObj.COMMENTS = $scope.NoShowSearch.NO_SHOW_DESCRIPTION;
                    NSModelObj.ACTIVE = $scope.NoShowSearch.ACTIVE == true ? 1 : 0;
                    NSModelObj.USER_ID = parseInt($cookies.get("USERID"));
                    PrcCommMethods.ADMIN_API(NSModelObj, 'ADMIN_INS_UPD_NO_SHOW_REASONS').then(function (data) {
                        if (data.data == -1) {
                            $scope.$parent.ShowAlert("Error", "No show code already exists", 3000);
                        }
                        else {
                            $scope.$parent.ShowAlert("Success", "Saved Successfully.", 3000);
                            $scope.ResetNoShow();
                            $scope.NO_SHOW_REASON_LIST = []; 
                        }
                    });
                }
            }
        }
    };
    $scope.EDIT_SHOW_REASONS = function (NI) {
       
        $scope.NoShowSearch.ENTITY_ID = NI.ENTITY_ID;
        $scope.NoShowSearch.NO_SHOW_REASONS_ID = NI.NO_SHOW_REASONS_ID;
        $scope.NoShowSearch.NO_SHOW_CODE = NI.NO_SHOW_CODE;
        $scope.NoShowSearch.NO_SHOW_DESCRIPTION = NI.NO_SHOW_DESCRIPTION;
        $scope.NoShowSearch.ACTIVE = NI.ACTIVE == true ? 1 : 0;
        $scope.NoShowSearch.ENTITY_DISABLE = true;
    };
    $scope.POPUP_NO_SHOE_COMMENT = function (HRD) {
        $('#FIELD_VALUE').modal('show');
        $scope.HRD_DECLARATION_POPUP = HRD;
    };
   
});