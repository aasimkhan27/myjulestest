app.controller('EPOSValidationViewController', function ($scope, $http, $interval, CommService, $cookies, $filter, PrcCommMethods, $location, readFileData, $localStorage) {
    $(".tooltip").remove();
    $scope.BlankValidate = {
        ID: 1,
        ENTITY_ID: 23,
        BRANCH_ID: 28,
        INTEGRATION_SYSTEM_ID: 1,
        ENTITY_NAME: 'entity',
        BRANCH_NAME: 'branch',
        INTEGRATION_SYSTEM_NAME: 'xyz',
        SUBMITTED_BY: 'ARSALAN',
        NET: 2.5,
        TAX: 12.5,
        GROSS: 20.5,
        DISCOUNT: 11.5,
        TIPS: 22.5,
        SERVICE_CHARGE: 11,
        STATUS: 'Active',
        UPLOAD_IDS: null,
        COMMENTS: 'my comment',
        CASHUP_DATE: '',
    };
    $scope.VALIDATION_SEARCH = {
        ENTITY_ID: null,
        BRANCH_ID: null,
        PAGE_NO: 1,
        PAGE_SIZE: 500,
        USER_NAME: null,
        START_DATE: '',
        INTEGRATION_SYSTEM_ID: null,
        STATUS: null,
        SHOW_MISMATCH: true,
    };
    $scope.ENTITY_LIST = [];
    $scope.BRANCH_LIST = [];
    $scope.EPOS_LIST = [];
    $scope.INTEGRATIONSYSTEM_LIST = [];
    $scope.STATUS_LIST = [
        { STATUS_ID: 1, STATUS_NAME: 'Pending' },
        { STATUS_ID: 2, STATUS_NAME: 'MisMatch' },
        { STATUS_ID: 3, STATUS_NAME: 'Match' }
    ]
    $scope.SHOWHIDE = false;
    $scope.SET_SHOWHIDE = function (_val) {
        if (!_val) {
            $scope.SHOWHIDE = true;
        } else {
            $scope.SHOWHIDE = false;
        }

    }
    $scope.GET_UTC_TIME = function () {
        var UserModelObj = new Object();
        UserModelObj.TIMEZONE_OFFSET = "00:00";
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'GET_UTC_TIME').then(function (data) {
            if (data.data != null) {
                $scope.CURRENT_DATE = new Date(data.data);
                $scope.CURRENT_DATE.setDate($scope.CURRENT_DATE.getDate() - 1);
                $scope.VALIDATION_SEARCH.START_DATE = $scope.CURRENT_DATE;
            }
            if ($scope.CURRENT_DATE == '') {
                $scope.CURRENT_DATE = new Date();
                $scope.CURRENT_DATE.setDate($scope.CURRENT_DATE.getDate() - 1);
                $scope.VALIDATION_SEARCH.START_DATE = $scope.CURRENT_DATE;
            }
            $scope.GET_EPOS_SALES_VALIDATION();
        })
    };
    $scope.GET_UTC_TIME();
    $scope.GET_ENTITY_LIST = function () {
        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_ID = 0;
        CusModelObj.ACTIVE = 1;
        CusModelObj.PAGE_NO = 0;
        CusModelObj.USER_ID = parseInt($cookies.get("USERID"));
        CusModelObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(CusModelObj, 'ADMIN_GET_ENTITIES').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.ENTITY_LIST = data.data.Table;
                // $scope.GET_EPOS_SALES_VALIDATION(1);
            }
            else { $scope.ENTITY_LIST = []; };
        });
    };
    //This block is modified by moitreya on 4th april
    $scope.GET_INTEGRATION_DETAILS_BY_CUST_ENT_BRNH = function () {
        $scope.$parent.overlay_loadingNew = "block";
        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_ID = 0;
        CusModelObj.ENTITY_ID = $scope.VALIDATION_SEARCH.ENTITY_ID;
        CusModelObj.BRANCH_ID = $scope.VALIDATION_SEARCH.BRANCH_ID;
        // Remove the condition that checks EntityId and BranchId != null
        // This enables us to also search by EPOS systems only
        PrcCommMethods.ADMIN_API(CusModelObj, 'GET_INTEGRATION_DETAILS_BY_CUST_ENT_BRNH').then(function (data) {
            $scope.INTEGRATIONSYSTEM_LIST = [];
            if (data.data != null && data.data.Table.length > 0) {
                //$scope.INTEGRATIONSYSTEM_LIST = data.data.Table.filter(p => p.INTEGRATION_TYPE_ID == 1);
                //$scope.INTEGRATIONSYSTEM_LIST = data.data.Table;
                $scope.INTEGRATIONSYSTEM_LIST = $filter('unique')(data.data.Table, 'INTEGRATION_SYSTEM_ID');
                angular.forEach($scope.INTEGRATIONSYSTEM_LIST, function (_val) {
                    if (_val.INTEGRATION_TYPE_ID == 1) {
                        $scope.VALIDATION_SEARCH.INTEGRATION_SYSTEM_ID = data.data.Table.filter(p => p.INTEGRATION_TYPE_ID == 1)[0]['INTEGRATION_SYSTEM_ID'];
                    }
                })

                //$scope.VALIDATION_SEARCH.INTEGRATION_SYSTEM_ID = data.data.Table.filter(p => p.INTEGRATION_TYPE_ID == 1)[0]['INTEGRATION_SYSTEM_ID'];
                if ($scope.INTEGRATIONSYSTEM_LIST.length == 0) {
                    $scope.$parent.ShowAlert('Attention', $scope.ENTITY_LIST.filter(p => p.ENTITY_ID == $scope.VALIDATION_SEARCH.ENTITY_ID)[0]["ENTITY_NAME"] + ', is not mapped with the integration system.', 3000);
                }
                else {
                    // $scope.VALIDATION_SEARCH.INTEGRATION_SYSTEM_ID = data.data.Table.filter(p => p.INTEGRATION_TYPE_ID == 1)[0]['INTEGRATION_SYSTEM_ID'];
                    //$scope.GET_EPOS_SALES_VALIDATION(1);
                }
                $scope.$parent.overlay_loadingNew = "none";

            }
            else {
                $scope.INTEGRATIONSYSTEM_LIST = [];
                $scope.$parent.ShowAlert('Attention', $scope.ENTITY_LIST.filter(p => p.ENTITY_ID == $scope.VALIDATION_SEARCH.ENTITY_ID)[0]["ENTITY_NAME"] + ', is not mapped with the integration system.', 3000);
                $scope.$parent.overlay_loadingNew = "none";
            };
        });
    };

    $scope.GET_INTEGRATION_DETAILS_BY_CUST_ENT_BRNH(); //line added by moitreya

    //Backup code on 4th april by moitreya
    /*
    $scope.GET_INTEGRATION_DETAILS_BY_CUST_ENT_BRNH = function () {
        $scope.$parent.overlay_loadingNew = "block";
        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_ID = 0;
        CusModelObj.ENTITY_ID = $scope.VALIDATION_SEARCH.ENTITY_ID;
        CusModelObj.BRANCH_ID = $scope.VALIDATION_SEARCH.BRANCH_ID;
        if ($scope.VALIDATION_SEARCH.ENTITY_ID != null && $scope.VALIDATION_SEARCH.BRANCH_ID != null) {
            PrcCommMethods.ADMIN_API(CusModelObj, 'GET_INTEGRATION_DETAILS_BY_CUST_ENT_BRNH').then(function (data) {
                $scope.INTEGRATIONSYSTEM_LIST = [];
                if (data.data != null && data.data.Table.length > 0) {
                    //$scope.INTEGRATIONSYSTEM_LIST = data.data.Table.filter(p => p.INTEGRATION_TYPE_ID == 1);
                    $scope.INTEGRATIONSYSTEM_LIST = data.data.Table;
                    angular.forEach($scope.INTEGRATIONSYSTEM_LIST, function (_val) {
                        if (_val.INTEGRATION_TYPE_ID == 1) {
                            $scope.VALIDATION_SEARCH.INTEGRATION_SYSTEM_ID = data.data.Table.filter(p => p.INTEGRATION_TYPE_ID == 1)[0]['INTEGRATION_SYSTEM_ID'];
                        }
                    })
                    //$scope.VALIDATION_SEARCH.INTEGRATION_SYSTEM_ID = data.data.Table.filter(p => p.INTEGRATION_TYPE_ID == 1)[0]['INTEGRATION_SYSTEM_ID'];
                    if ($scope.INTEGRATIONSYSTEM_LIST.length == 0) {
                        $scope.$parent.ShowAlert('Attention', $scope.ENTITY_LIST.filter(p => p.ENTITY_ID == $scope.VALIDATION_SEARCH.ENTITY_ID)[0]["ENTITY_NAME"] + ', is not mapped with the integration system.', 3000);
                    }
                    else {
                        // $scope.VALIDATION_SEARCH.INTEGRATION_SYSTEM_ID = data.data.Table.filter(p => p.INTEGRATION_TYPE_ID == 1)[0]['INTEGRATION_SYSTEM_ID'];
                        //$scope.GET_EPOS_SALES_VALIDATION(1);
                    }
                    $scope.$parent.overlay_loadingNew = "none";

                }
                else {
                    $scope.INTEGRATIONSYSTEM_LIST = [];
                    $scope.$parent.ShowAlert('Attention', $scope.ENTITY_LIST.filter(p => p.ENTITY_ID == $scope.VALIDATION_SEARCH.ENTITY_ID)[0]["ENTITY_NAME"] + ', is not mapped with the integration system.', 3000);
                    $scope.$parent.overlay_loadingNew = "none";
                };
            });
        }
        else {
            $scope.$parent.overlay_loadingNew = "none";
        }
    };
    */
    $scope.GET_ENTITY_LIST();
    //$scope.GET_INTEGRATION_DETAILS_BY_CUST_ENT_BRNH = function () {
    //    $scope.$parent.overlay_loadingNew = "block";
    //    var CusModelObj = new Object();
    //    CusModelObj.CUSTOMER_ID = 0;
    //    CusModelObj.ENTITY_ID = $scope.VALIDATION_SEARCH.ENTITY_ID;
    //    CusModelObj.BRANCH_ID = $scope.VALIDATION_SEARCH.BRANCH_ID;
    //    if ($scope.VALIDATION_SEARCH.ENTITY_ID != null && $scope.VALIDATION_SEARCH.BRANCH_ID != null) {
    //        PrcCommMethods.ADMIN_API(CusModelObj, 'GET_INTEGRATION_DETAILS_BY_CUST_ENT_BRNH').then(function (data) {
    //            $scope.INTEGRATIONSYSTEM_LIST = [];
    //            if (data.data != null && data.data.Table.length > 0) {
    //                $scope.INTEGRATIONSYSTEM_LIST = data.data.Table.filter(p => p.INTEGRATION_TYPE_ID == 1);
    //                if ($scope.INTEGRATIONSYSTEM_LIST.length == 0) {
    //                    $scope.$parent.ShowAlert('Attention', $scope.ENTITY_LIST.filter(p => p.ENTITY_ID == $scope.VALIDATION_SEARCH.ENTITY_ID)[0]["ENTITY_NAME"] + ', is not mapped with the integration system.', 3000);
    //                }
    //                else
    //                    $scope.VALIDATION_SEARCH.INTEGRATION_SYSTEM_ID = data.data.Table.filter(p => p.INTEGRATION_TYPE_ID == 1)[0]['INTEGRATION_SYSTEM_ID'];
    //                $scope.$parent.overlay_loadingNew = "none";
    //                // $scope.GET_EPOS_SALES_VALIDATION();
    //            }
    //            else {
    //                $scope.INTEGRATIONSYSTEM_LIST = [];
    //                $scope.$parent.ShowAlert('Attention', $scope.ENTITY_LIST.filter(p => p.ENTITY_ID == $scope.VALIDATION_SEARCH.ENTITY_ID)[0]["ENTITY_NAME"] + ', is not mapped with the integration system.', 3000);
    //                $scope.$parent.overlay_loadingNew = "none";
    //            };

    //        });
    //    }
    //    else {
    //        $scope.$parent.overlay_loadingNew = "none";
    //    }
    //};
    $scope.RESET_SEARCH = function () {
        $scope.VALIDATION_SEARCH.ENTITY_ID = null;
        $scope.VALIDATION_SEARCH.BRANCH_ID = null;
        $scope.VALIDATION_SEARCH.INTEGRATION_SYSTEM_ID = null;
        $scope.VALIDATION_SEARCH.STATUS = null;
        $scope.VALIDATION_SEARCH.USER_NAME = null;
        $scope.GET_EPOS_SALES_VALIDATION();
    }
    $scope.ADMIN_GET_BRANCH = function () {
        $scope.BRANCH_LIST = [];
        $scope.SHOW_WEEKLY_CASHUP_HTML_TABLE_FLAG = false;
        ModelObj = new Object();
        ModelObj.CUSTOMER_ID = 0;//parseInt($cookies.get('CUSTOMER_ID'));
        ModelObj.ENTITY_ID = $scope.VALIDATION_SEARCH.ENTITY_ID;
        ModelObj.BRANCH_CODE = null;
        ModelObj.BRANCH_NAME = null;
        ModelObj.CONTACT_NAME = null;
        ModelObj.LOCATION_IDS = null;
        ModelObj.ACTIVE = 1;
        ModelObj.PAGE_NO = 0;
        ModelObj.PAGE_SIZE = 0;
        ModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.ADMIN_API(ModelObj, 'ADMIN_GET_BRANCH').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.BRANCH_LIST = data.data.Table;
                $scope.VALIDATION_SEARCH.INTEGRATION_SYSTEM_ID = null;
                $scope.GET_INTEGRATION_DETAILS_BY_CUST_ENT_BRNH(); //added by moitreya 4th april 2025
            }
            else {
                $scope.BRANCH_LIST = [];
            }
        });
    };

    $scope.VALIDATION_SEARCH.SHOW_MISMATCH = true;

    $scope.init_EPOS_Upload_List = function (_LINE) {
        $scope.$parent.GET_UPLOADS(_LINE, 53, _LINE.EPOS_SALES_VALIDATION_ID);

    }
    $scope.CHECK_MISMATCH = function (_LINE) {
        _LINE.XERO_LPD_HOURS = new Date(_LINE.XERO_LAST_PICKUP_DATE).getHours;
        _LINE.INV_LPD_HOURS = new Date(_LINE.INV_LAST_PICKUP_DATE).getHours;
        _LINE.ROTA_LPD_HOURS = new Date(_LINE.ROTA_LAST_PICKUP_DATE).getHours;

        _LINE.NET_SALES_MATCH = Math.abs((_LINE.VALIDATION_NET == null ? 0 : _LINE.VALIDATION_NET) - (_LINE.EPOS_NET == null ? 0 : _LINE.EPOS_NET)) > 1;
        _LINE.TAX_MATCH = Math.abs((_LINE.VALIDATION_TAX == null ? 0 : _LINE.VALIDATION_TAX) - (_LINE.EPOS_TAX == null ? 0 : _LINE.EPOS_TAX)) > 1;
        _LINE.GROSS_EXC_DISC_MATCH = Math.abs((_LINE.VALIDATION_GROSS == null ? 0 : _LINE.VALIDATION_GROSS) - (_LINE.EPOS_GROSS == null ? 0 : _LINE.EPOS_GROSS)) > 1;
        _LINE.DISCOUNT_MATCH = Math.abs((_LINE.VALIDATION_DISCOUNT == null ? 0 : _LINE.VALIDATION_DISCOUNT) - (_LINE.EPOS_DISCOUNT == null ? 0 : _LINE.EPOS_DISCOUNT)) > 1;
        _LINE.TIPS_MATCH = Math.abs((_LINE.VALIDATION_TIPS == null ? 0 : _LINE.VALIDATION_TIPS) - (_LINE.EPOS_TIPS == null ? 0 : _LINE.EPOS_TIPS)) > 1;
        _LINE.SERVICE_CHARGE_MATCH = Math.abs((_LINE.VALIDATION_SERVICE_CHARGE == null ? 0 : _LINE.VALIDATION_SERVICE_CHARGE) - (_LINE.EPOS_SERVICE_CHARGE == null ? 0 : _LINE.EPOS_SERVICE_CHARGE)) > 1;

        _LINE.TOTAL_VALIDATION = ((_LINE.VALIDATION_GROSS == null ? 0 : _LINE.VALIDATION_GROSS) + (_LINE.VALIDATION_TIPS == null ? 0 : _LINE.VALIDATION_TIPS) + (_LINE.VALIDATION_SERVICE_CHARGE == null ? 0 : _LINE.VALIDATION_SERVICE_CHARGE));
        _LINE.TOTAL_EPOS = ((_LINE.EPOS_GROSS == null ? 0 : _LINE.EPOS_GROSS) + (_LINE.EPOS_TIPS == null ? 0 : _LINE.EPOS_TIPS) + (_LINE.EPOS_SERVICE_CHARGE == null ? 0 : _LINE.EPOS_SERVICE_CHARGE));
        _LINE.TOTAL_MATCH = Math.abs(_LINE.TOTAL_VALIDATION - _LINE.TOTAL_EPOS) > 1;
        _LINE.MISMATCH = false;
        if ((_LINE.XERO_CUSTOMER_INTEGRATION_ID != null && (_LINE.XERO_INTEGRATION_STATUS == 0 || _LINE.XERO_INTEGRATION_STATUS == 5 || _LINE.XERO_INTEGRATION_STATUS == 1 || _LINE.XERO_INTEGRATION_STATUS == 3)) || (_LINE.XERO_INTEGRATION_STATUS == 2 && _LINE.XERO_LPD_HOURS > 24)) {
            _LINE.XERO_MATCH = true;
        }
        if ((_LINE.INV_CUSTOMER_INTEGRATION_ID != null && (_LINE.INV_INTEGRATION_STATUS == 0 || _LINE.INV_INTEGRATION_STATUS == 5 || _LINE.INV_INTEGRATION_STATUS == 1 || _LINE.INV_INTEGRATION_STATUS == 3)) || (_LINE.INV_INTEGRATION_STATUS == 2 && _LINE.INV_LPD_HOURS > 24)) {
            _LINE.INV_MATCH = true;
        }
        if ((_LINE.ROTA_CUSTOMER_INTEGRATION_ID != null && (_LINE.ROTA_INTEGRATION_STATUS == 0 || _LINE.ROTA_INTEGRATION_STATUS == 5 || _LINE.ROTA_INTEGRATION_STATUS == 1 || _LINE.ROTA_INTEGRATION_STATUS == 3)) || (_LINE.ROTA_INTEGRATION_STATUS == 2 && _LINE.ROTA_LPD_HOURS > 24)) {
            _LINE.ROTA_MATCH = true;
        }

        if (_LINE.NET_SALES_MATCH || _LINE.TAX_MATCH || _LINE.GROSS_EXC_DISC_MATCH || _LINE.DISCOUNT_MATCH || _LINE.TIPS_MATCH || _LINE.SERVICE_CHARGE_MATCH || _LINE.TOTAL_MATCH || _LINE.XERO_MATCH || _LINE.INV_MATCH || _LINE.ROTA_MATCH) {
            _LINE.MISMATCH = true;
        }

    }
    $scope.getValidationFilter = function () {
        let filters = {};
        if ($scope.VALIDATION_SEARCH.SHOW_MISMATCH) {
            filters['MISMATCH'] = $scope.VALIDATION_SEARCH.SHOW_MISMATCH;
        }

        return filters;
    };

    $scope.GET_EPOS_SALES_VALIDATION = function (FLAG) {
        var CustmObj = new Object();
        if (FLAG == 1) {
            $scope.VALIDATION_SEARCH.PAGE_NO = 1;
        }
        $scope.EPOS_SALES_LIST = [];

        CustmObj.ENTITY_ID = $scope.VALIDATION_SEARCH.ENTITY_ID;
        CustmObj.BRANCH_ID = $scope.VALIDATION_SEARCH.BRANCH_ID == null ? null : $scope.VALIDATION_SEARCH.BRANCH_ID;
        CustmObj.INTEGRATION_SYSTEM_ID = $scope.VALIDATION_SEARCH.INTEGRATION_SYSTEM_ID == null ? null : $scope.VALIDATION_SEARCH.INTEGRATION_SYSTEM_ID;
        CustmObj.USER_NAME = $scope.VALIDATION_SEARCH.USER_NAME == null ? null : $scope.VALIDATION_SEARCH.USER_NAME;
        CustmObj.START_DATE = $scope.VALIDATION_SEARCH.START_DATE;
        CustmObj.PAGE_NO = $scope.VALIDATION_SEARCH.PAGE_NO;
        CustmObj.PAGE_SIZE = $scope.VALIDATION_SEARCH.PAGE_SIZE;
        CustmObj.STATUS_ID = $scope.VALIDATION_SEARCH.STATUS == null ? null : $scope.VALIDATION_SEARCH.STATUS;

        PrcCommMethods.CASHUP_API(CustmObj, 'GET_EPOS_SALES_VALIDATION').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.EPOS_SALES_LIST = $scope.EPOS_SALES_LIST.concat(data.data.Table);

            }
            else {

                $scope.EPOS_SALES_LIST = [];
            }


            for (var i = 0; i < $scope.EPOS_SALES_LIST.length; i++) {
                $scope.CHECK_MISMATCH($scope.EPOS_SALES_LIST[i]);
            }

        });

    };

});