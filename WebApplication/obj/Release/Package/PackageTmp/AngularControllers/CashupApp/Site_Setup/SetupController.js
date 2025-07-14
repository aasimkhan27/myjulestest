app.controller('SetupController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    //$scope.$parent.DISPLAY_FLAG = true;
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(1);
    //$scope.CASHUP_COMMON_CODE_Fn();
    $scope.Setup_Search = {
        BRANCH_ID: null,
        CUSTOMER_ID: parseInt($cookies.get("CUSTOMER_ID")),
        USER_ID: $cookies.get("USERID"),
        ENTITY_ID: parseInt($cookies.get("ENTITY_ID")),
        CUSTOM_DDL_BRANCH_NAME: $scope.$parent.DD_DEFAULT_TEXT,
        DD_DEFAULT_TEXT: $scope.$parent.DD_DEFAULT_TEXT,
        PAGE_NO: 0,
        PAGE_SIZE: 100,
    }
    $scope.Vender_Search = {
        CASHUP_VENDOR_ID: 0,
        VENDOR_NAME: '',
        VENDOR_EMAIL: '',
        VENDOR_CONTACT: '',
        PAGE_NO: 0,
        PAGE_SIZE: 100,
        ACTIVE: true,
    }
    $scope.Cost_Category_Search = {
        PETTY_CASH_COST_CATEGORIE_ID: null,
        PETTY_CASH_CATEGORY_ID: null,
        CATEGORY_NAME: '',
        GL_NAME: null,
        GL_CODE: null,
    }
    $scope.PDQ_LIST = [];
    $scope.AUTHORIZER_LIST = [];
    $scope.ACCOUNT_CUSTOMER_CUSTOMERS = [];
    $scope.SELECTED_DDL_BRANCH_Fn = function (_branch) {
        if (_branch == '') {
            $scope.Setup_Search.CUSTOM_DDL_BRANCH_NAME = $scope.Setup_Search.DD_DEFAULT_TEXT;
            $scope.Setup_Search.BRANCH_ID = "";
        }
        else {
            //$scope.VOIDS_FORM.submitted = false;
            $scope.Setup_Search.CUSTOM_DDL_BRANCH_NAME = _branch.BRANCH_NAME;
            $scope.Setup_Search.BRANCH_ID = _branch.BRANCH_ID;
            $scope.ADMIN_GET_PDQ_MASTER();
            $scope.GET_ACCOUNT_CUSTOMER_CUSTOMERS();
            $scope.ADMIN_GET_BRANCH_STAFF();
            $scope.GET_VOIDS();
            $scope.GET_COMPS();
            $scope.GET_CASHUP_VENDORS();
            $scope.GET_PETTY_CASH_COST_CATEGORIES();
            $scope.GET_CASHUP_CARDS_Fn();
        }
    }
    var commObj = new Object();
    commObj.CUSTOMER_ID = $scope.Setup_Search.CUSTOMER_ID;
    commObj.ENTITY_ID = $scope.Setup_Search.ENTITY_ID;
    PrcCommMethods.CASHUP_APP_API(commObj, 'ADMIN_GET_BRANCH_LIST').then(function (data) {
        $scope.BRANCH_LIST = data.data.Table;

        if ($scope.BRANCH_LIST.length > 0) {
            $scope.Setup_Search.CUSTOM_DDL_BRANCH_NAME = $scope.BRANCH_LIST[0].BRANCH_NAME;
            $scope.Setup_Search.BRANCH_ID = $scope.BRANCH_LIST[0].BRANCH_ID;
            $scope.ADMIN_GET_PDQ_MASTER();
            $scope.GET_ACCOUNT_CUSTOMER_CUSTOMERS();
            $scope.ADMIN_GET_BRANCH_STAFF();
            $scope.GET_VOIDS();
            $scope.GET_COMPS();
            $scope.GET_CASHUP_CARDS_Fn();
            $scope.GET_CASHUP_BASIC_SETUP($scope.BRANCH_LIST);
            $scope.GET_CASHUP_VENDORS();
            $scope.GET_PETTY_CASH_COST_CATEGORIES();
        } else {
            $scope.Setup_Search.CUSTOM_DDL_BRANCH_NAME = $scope.Setup_Search.DD_DEFAULT_TEXT;
            $scope.Setup_Search.BRANCH_ID = "";
            $scope.ADMIN_GET_PDQ_MASTER(1);
        }
    });

    $scope.GET_CASHUP_BASIC_SETUP = function (Sites) {
        var CashupModelObj = {
            CUSTOMER_ID: $scope.Setup_Search.CUSTOMER_ID,
            ENTITY_ID: $scope.Setup_Search.ENTITY_ID
        };
        PrcCommMethods.CASHUP_APP_API(CashupModelObj, 'GET_CASHUP_TYPE').then(function (data) {
            if (data.data) {
                $scope.CashupTypeData = data.data;
                Sites.forEach(function (site) {

                    var matchedData = $scope.CashupTypeData.Table.find(function (cashup) {
                        return cashup.BRANCH_ID === site.BRANCH_ID;
                    });

                    if (matchedData) {
                        site.CASHUP_TYPE = matchedData.CASHUP_TYPE;
                        site.CASHUP_TYPE_MSTR_ID = matchedData.CASHUP_TYPE_MSTR_ID;
                        site.WILl_USE_IN_CASHUP = true;
                    }
                    else {
                        site.WILl_USE_IN_CASHUP = false;
                    }

                });
            } else {
                $scope.CashupTypeData = [];
                console.error("No Cashup Types available.");
            }
        }).catch(function (error) {
            console.error("Error fetching Cashup Types:", error);
        });
    }
    $scope.ADMIN_GET_PDQ_MASTER = function () {
        CommonObj = new Object();

        CommonObj.PDQ_MASTER_ID = $scope.PDQ_MASTER_ID != null ? $scope.PDQ_MASTER_ID : 0;
        CommonObj.CUSTOMER_ID = $scope.Setup_Search.CUSTOMER_ID;
        CommonObj.LOCATION = 0;
        CommonObj.PDQ_CODE = '';
        CommonObj.ENTITY_ID = $scope.Setup_Search.ENTITY_ID;
        CommonObj.BRANCH_ID = $scope.Setup_Search.BRANCH_ID;
        CommonObj.ACTIVE = 1;
        CommonObj.USER_ID = parseInt($cookies.get("USERID"));
        CommonObj.PAGE_NO = $scope.Setup_Search.PAGE_NO;
        CommonObj.PAGE_SIZE = $scope.Setup_Search.PAGE_SIZE;
        PrcCommMethods.ADMIN_API(CommonObj, 'ADMIN_GET_PDQ_MASTER').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.PDQ_LIST = data.data.Table;
            }
            else {
                $scope.PDQ_LIST = data.data.Table.length > 0 ? data.data.Table : [];
            }
        });

    };
    $scope.GET_CASHUP_VENDORS = function () {
        CommonObj = new Object();
        CommonObj.BRANCH_ID = $scope.Setup_Search.BRANCH_ID;
        PrcCommMethods.CASHUP_APP_API(CommonObj, 'GET_CASHUP_VENDORS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.VENDOR_LIST = data.data.Table;
            }
            else {
                $scope.VENDOR_LIST = data.data.Table.length > 0 ? data.data.Table : [];
            }
        });
    };
    $scope.GET_ACCOUNT_CUSTOMER_CUSTOMERS = function () {
        var CashupModelObj = new Object();
        CashupModelObj.BRANCH_ID = $scope.Setup_Search.BRANCH_ID;
        CashupModelObj.ACTIVE = 1;
        PrcCommMethods.CASHUP_APP_API(CashupModelObj, 'GET_ACCOUNT_CUSTOMER_CUSTOMERS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.ACCOUNT_CUSTOMER_CUSTOMERS = data.data.Table;
            }
            else {
                $scope.ACCOUNT_CUSTOMER_CUSTOMERS = [];
            }
        });
    }
    $scope.ADMIN_GET_BRANCH_STAFF = function () {
        CashupTabsObj = new Object();

        CashupTabsObj.CUSTOMER_ID = $scope.Setup_Search.CUSTOMER_ID;
        CashupTabsObj.ENTITY_ID = $scope.Setup_Search.ENTITY_ID;
        CashupTabsObj.LOCATION_ID = 0;
        CashupTabsObj.BRANCH_ID = $scope.Setup_Search.BRANCH_ID;
        CashupTabsObj.ACTIVE = 1;
        CashupTabsObj.STAFF_NAME = '';
        CashupTabsObj.PAGE_NO = 1;
        CashupTabsObj.PAGE_SIZE = 100;
        PrcCommMethods.ADMIN_API(CashupTabsObj, 'ADMIN_GET_BRANCH_STAFF').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.AUTHORIZER_LIST = data.data.Table;
            }
            else {
                $scope.AUTHORIZER_LIST = [];
            }
        });

    };
    $scope.GET_COMPS = function () {
        var params = new Object();
        params.BRANCH_ID = $scope.Setup_Search.BRANCH_ID,
            PrcCommMethods.CASHUP_APP_API(params, 'GET_CASHUP_REASON_FOR_COMP').then(function (data) {
                if (data.data.Table.length > 0) {
                    data.data.Table.forEach(function (record) {
                        record.HIDE_SHOW = false;
                    });
                    $scope.COMPS_LIST = data.data.Table;
                    $scope.COMPS_FORM.Error = false;
                }
                else {
                    $scope.COMPS_LIST = [];
                    $scope.GetData = false;
                }
            });
    };
    $scope.GET_VOIDS = function () {
        var CommonObj = new Object();
        CommonObj.CUSTOMER_ID = $scope.Setup_Search.CUSTOMER_ID;
        CommonObj.ENTITY_ID = $scope.Setup_Search.ENTITY_ID;
        CommonObj.LOCATION_ID = 0;
        CommonObj.BRANCH_ID = $scope.Setup_Search.BRANCH_ID;
        CommonObj.REASON = null;
        CommonObj.ACTIVE = 1;
        CommonObj.PAGE_NO = 0;

        CommonObj.PAGE_SIZE = 999;
        PrcCommMethods.CASHUP_APP_API(CommonObj, 'ADMIN_GET_REASON_FOR_VOID').then(function (data) {
            if (data.data.Table.length > 0) {
                data.data.Table.forEach(function (record) {
                    record.HIDE_SHOW = false;
                });

                $scope.VOIDS_LIST = data.data.Table;
            }
            else {
                $scope.GetData = false;
                $scope.VOIDS_LIST = []
            }
        });
    };
    $scope.GET_CASHUP_CARDS_Fn = function () {
        var params = new Object();
        params.CUSTOMER_ID = $scope.Setup_Search.CUSTOMER_ID
        PrcCommMethods.CASHUP_APP_API(params, "GET_CASHUP_CARDS").then(function (data) {
            if (data == null) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.$parent.SOMETHINGWENTWRONG, 3000);
            }
            else if (data.data.Table.length > 0) {
                $scope.CARDS_LIST = data.data.Table.map((record) => ({ ...record, HIDE_SHOW: false, HIDE_SHOW: false, IS_DEFAULT: ["Amex", "Visa", "Mastercard", "Others"].includes(record.CARD_NAME), }));
            } else {
                $scope.CARDS_LIST = [];
            }
        }).catch(function (error) {
            console.error("Error fetching cards: ", error);
        });
    };
    $scope.GET_PETTY_CASH_COST_CATEGORIES = function () {
        var Obj = new Object();
        Obj.BRANCH_ID = $scope.Setup_Search.BRANCH_ID;
        PrcCommMethods.CASHUP_APP_API(Obj, 'GET_PETTY_CASH_COST_CATEGORIES').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.COST_CATEGORY_LIST = data.data.Table;
                //$scope.VOIDS_LIST = data.data.Table;
            }
            else {
                $scope.GetData = false;
                $scope.COST_CATEGORY_LIST = [];
                //$scope.VOIDS_LIST = [];
            }
        });
    }
    $scope.GET_CASHUP_COUNT_FOR_DELETE = function (_item,_count_type_id) {
        let _PDQ_ID = 0;
        let _CASHUP_VENDOR_ID = 0;
        let _COST_CATEGORY_ID = 0;
        let _AUTHORIZED_BY_ID = 0;

        switch (_count_type_id) {
            case 1:
                _PDQ_ID = _item.PDQ_MASTER_ID;
                break;
            case 2:
                _CASHUP_VENDOR_ID = _item.CASHUP_VENDOR_ID;
                break;
            case 3:
                _COST_CATEGORY_ID = _item.PETTY_CASH_COST_CATEGORIE_ID;
                break;
            case 4:
                _AUTHORIZED_BY_ID = _item.TABLE_ID;
                break;
        }


        var CashupAppModelObj = new Object();
        CashupAppModelObj.COUNT_TYPE_ID = _count_type_id;
        CashupAppModelObj.PDQ_ID = _PDQ_ID;
        CashupAppModelObj.CASHUP_VENDOR_ID = _CASHUP_VENDOR_ID;
        CashupAppModelObj.COST_CATEGORY_ID = _COST_CATEGORY_ID;
        CashupAppModelObj.AUTHORIZED_BY_ID = _AUTHORIZED_BY_ID;
        CashupAppModelObj.BRANCH_ID = $scope.Setup_Search.BRANCH_ID;
        PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'GET_CASHUP_COUNT_FOR_DELETE').then(function (data) {

            if (data.data.RestrictDelete == null || data.data.RestrictDelete == undefined || data.data.RestrictDelete.length == 0) {
                //something went wrong in the backend
                return;
            }
            
            switch (_count_type_id) {
                case 1:
                    $scope.SELECTED_PDQ = _item;
                    if (data.data.RestrictDelete[0].RESTRICT_DELETE == 1) {
                        $scope.SELECTED_PDQ.MESSAGE = "This PDQ Terminal " + _item.PDQ_CODE + " can't be deleted as its reference has been used in other cashups.";
                        $scope.SELECTED_PDQ.RESTRICT_DELETE = true;
                    }
                    else {
                        $scope.SELECTED_PDQ.RESTRICT_DELETE = false;
                        $scope.SELECTED_PDQ.MESSAGE = "It is safe to perform this operation as it hasn't been assigned to any cashup. Do you want to proceed?";
                    }
                    $('#Delete_PDQ').modal('show');
                    break;
                case 2:
                    $scope.SELECTED_VENDER = _item;
                    if (data.data.RestrictDelete[0].RESTRICT_DELETE == 1) {
                        $scope.SELECTED_VENDER.RESTRICT_DELETE = true;
                        $scope.SELECTED_VENDER.MESSAGE = "The Vendor " + _item.VENDOR_NAME + " can't be deleted as its reference has been used in other cashups.";
                    }
                    else {
                        $scope.SELECTED_VENDER.MESSAGE = "It is safe to perform this operation as it hasn't been assigned to any cashup. Do you want to proceed?";
                        $scope.SELECTED_VENDER.RESTRICT_DELETE = false;
                    }
                    $('#Delete_Vender').modal('show');
                    break;
                case 3:
                    $scope.SELECTED_CATEGORY = _item;
                    if (data.data.RestrictDelete[0].RESTRICT_DELETE == 1) {
                        $scope.SELECTED_CATEGORY.MESSAGE = "The Cost Category " + _item.COST_CATEGORY_NAME + " can't be deleted as its reference has been used in other cashups.";
                        $scope.SELECTED_CATEGORY.RESTRICT_DELETE = true;
                    }
                    else {
                        $scope.SELECTED_CATEGORY.RESTRICT_DELETE = false;
                        $scope.SELECTED_CATEGORY.MESSAGE = "It is safe to perform this operation as it hasn't been assigned to any cashup. Do you want to proceed?";
                    }
                    $('#Delete_Cost').modal('show');
                    break;
                case 4:
                    $scope.SELECTED_AUTH = _item;
                    if (data.data.RestrictDelete[0].RESTRICT_DELETE == 1) {
                        $scope.SELECTED_AUTH.RESTRICT_DELETE = true;
                        $scope.SELECTED_AUTH.MESSAGE = "The Authorizer " + _item.NAME + " can't be deleted as its reference has been used in other cashups.";
                    }
                    else {
                        $scope.SELECTED_AUTH.RESTRICT_DELETE = false;
                        $scope.SELECTED_AUTH.MESSAGE = "It is safe to perform this operation as it hasn't been assigned to any cashup. Do you want to proceed?";
                    }
                    $('#Delete_Authorize').modal('show');
                    break;
                default:
                    //something went wrong in the front end
                    break;
            }
        });
    }
    $scope.EDIT_PDQ_Fn = function (_param_pdq, index) {
        _param_pdq.HIDE_SHOW = !_param_pdq.HIDE_SHOW;
    };
    $scope.EDIT_AUTHORIZE_Fn = function (_param_auth, index) {
        _param_auth.HIDE_SHOW = !_param_auth.HIDE_SHOW;
    };
    $scope.DELETE_PDQ_Fn = function (_param_pdq, index) {
        $scope.SELECTED_PDQ = _param_pdq;
        $scope.SELECTED_PDQ.MESSAGE = "It is safe to perform this operation as it hasn't been assigned to any cashup. Do you want to proceed?";
        $('#Delete_PDQ').modal('show');
    }
    $scope.DELETE_AUTHORIZE_Fn = function (_param_auth, index) {
        $scope.SELECTED_AUTH = _param_auth;
        $scope.SELECTED_AUTH.MESSAGE = "It is safe to perform this operation as it hasn't been assigned to any cashup. Do you want to proceed?";
        $('#Delete_Authorize').modal('show');
        //var CusModelObj = new Object();
        //CusModelObj.RELATIVE_ID = _param_pdq.DEPARTMENT_ID;
        //CusModelObj.FLAG = 1;
        //PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_GET_EMPLOYEE_COUNT_FOR_DEPT_POS_SEC_ASET').then(function (data) {
        //    if (data.data.Table.length > 0) {
        //        if (data.data.Table[0].DEPARTMENT_COUNT > 0) {
        //            $scope.$parent.ShowAlertBox("Attention", _param_department.DEPARTMENT_NAME + ' Department are not deleted because this department its already schedule in employee.', 3000);
        //        } else {
        //            $scope.SELECTED_DEPARTMENT.MESSAGE = "It is safe to perform this operation as it hasn't been assigned to any employee. Do you want to proceed?";
        //            $('#Delete_PDQ').modal('show');
        //        }
        //    } else {
        //        $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
        //    }
        //});

    }
    $scope.EDIT_CARD_Fn = function (_card) {
        _card.HIDE_SHOW = !_card.HIDE_SHOW
    }

    $scope.DELETE_COMP_Fn = function (_comp, _index) {

        var compObj = new Object();
        compObj.CASHUP_REASON_FOR_COMP_ID = _comp.CASHUP_REASON_FOR_COMP_ID;
        compObj.REASON = _comp.REASONS;
        compObj.CUSTOMER_ID = $scope.Setup_Search.CUSTOMER_ID;
        compObj.ENTITY_ID = $scope.Setup_Search.ENTITY_ID;
        compObj.BRANCH_ID = $scope.Setup_Search.BRANCH_ID;
        compObj.ACTIVE = 0;
        compObj.USER_ID = $scope.Setup_Search.USER_ID;


        PrcCommMethods.CASHUP_APP_API(compObj, 'INS_UPD_CASHUP_REASON_FOR_COMP').then(function (response) {
            if (response.data > 0) {
                $scope.$parent.ShowAlertBox("Success", 'Comp deleted successfully', 3000);
                $scope.GET_COMPS();
            } else {
                $scope.$parent.ShowAlertBox("Error", 'Something went wrong. Please try again later.', 3000);
            }
        });
    }

    $scope.DELETE_VOID_Fn = function (_void, _index) {
        var voidObj = {
            VOID_ID: _void.VOID_ID,
            ENTITY_ID: $cookies.get("ENTITY_ID"),
            BRANCH_ID: $scope.Setup_Search.BRANCH_ID,
            REASON: _void.VOID_REASON,
            ACTIVE: 0,
            USER_ID: $cookies.get("USERID")
        };

        PrcCommMethods.CASHUP_APP_API(voidObj, 'ADMIN_INS_UPD_REASON_FOR_VOID')
            .then(function (response) {
                if (response.data > 0) {
                    $scope.$parent.ShowAlertBox("Success", 'Void deleted successfully', 3000);
                    $scope.GET_VOIDS();
                } else {
                    $scope.$parent.ShowAlertBox("Error", 'Something went wrong. Please try again later.', 3000);
                }
            })
            .catch(function (error) {
                $scope.$parent.ShowAlertBox("Error", 'Something went wrong. Please try again later.', 3000);
            });

    };
    $scope.ADD_NEW_VOID = function () {
        if ($scope.NewVoid.VOID_REASON && $scope.NewVoid.VOID_REASON.trim() !== "") {
            isDuplicate = false;
            if ($scope.VOIDS_LIST) {
                angular.forEach($scope.VOIDS_LIST, function (existingVoid) {
                    if (existingVoid.VOID_REASON == $scope.NewVoid.VOID_REASON) {
                        isDuplicate = true;
                        $scope.VOIDS_FORM.Error = true;
                    }
                });
            }
            if (isDuplicate) { $scope.$parent.ShowAlertBox("Attention", $scope.NewVoid.VOID_REASON + ' already exists. Please choose a different name.', 3000); return; }
            var newVoid = {
                VOID_REASON: $scope.NewVoid.VOID_REASON, VOID_ID: 0, HIDE_SHOW: true, BRANCH_ID: $scope.Setup_Search.BRANCH_ID
            };
            //if ($scope.VOIDS_LIST) $scope.VOIDS_LIST.push(newVoid);
            $scope.ADMIN_INS_UPD_REASON_FOR_VOID(newVoid, 1);
            $scope.NewVoid.VOID_REASON = "";
        } else {
            $scope.$parent.ShowAlertBox("Error", 'Please enter a valid Void Name', 3000);
            $scope.VOIDS_FORM.Error = true;
        }
    };
    $scope.EDIT_VOID_Fn = function (_void, index) {
        _void.HIDE_SHOW = !_void.HIDE_SHOW
    };

    $scope.EDIT_COMP_Fn = function (_comp) {
        _comp.HIDE_SHOW = !_comp.HIDE_SHOW;
    };



    $scope.ADD_NEW_COMP = function () {
        if ($scope.NewComp.REASONS && $scope.NewComp.REASONS.trim() !== "") {

            isDuplicate = false;
            if ($scope.COMPS_LIST) {
                angular.forEach($scope.COMPS_LIST, function (existingVoid) {
                    if (existingVoid.REASONS == $scope.NewComp.REASONS) {
                        isDuplicate = true;
                        $scope.VOIDS_FORM.Error = true;
                    }
                });
            }



            if (isDuplicate) {
                $scope.$parent.ShowAlertBox("Attention", $scope.NewComp.REASONS + ' already exists. Please choose a different name.', 3000);
                return;
            }
            var newComp = {
                REASONS: $scope.NewComp.REASONS,
                VOID_ID: 0,
                HIDE_SHOW: true,
                BRANCH_ID: $scope.Setup_Search.BRANCH_ID
            };
            if ($scope.COMPS_LIST) $scope.COMPS_LIST.push(newComp);

            $scope.INS_UPD_CASHUP_REASON_FOR_COMP(newComp, 1);
            $scope.NewComp.REASONS = "";
        } else {
            $scope.$parent.ShowAlertBox("Error", 'Please enter a valid Void Name', 3000);
            $scope.COMPS_FORM.Error = true;
        }
    };

    $scope.EDIT_VENDER_Fn = function (_param_vender) {
        $scope.Vender_Search.CASHUP_VENDOR_ID = _param_vender.CASHUP_VENDOR_ID;
        $scope.Vender_Search.VENDOR_NAME = _param_vender.VENDOR_NAME;
        $scope.Vender_Search.VENDOR_EMAIL = _param_vender.VENDOR_EMAIL;
        $scope.Vender_Search.VENDOR_CONTACT = _param_vender.VENDOR_CONTACT;

    }

    $scope.EDIT_COST_CATEGORY_Fn = function (_param_vender) {
        $scope.Cost_Category_Search.PETTY_CASH_COST_CATEGORIE_ID = _param_vender.PETTY_CASH_COST_CATEGORIE_ID;
        $scope.Cost_Category_Search.CATEGORY_NAME = _param_vender.COST_CATEGORY_NAME;
        $scope.Cost_Category_Search.GL_NAME = _param_vender.GL_NAME;
        $scope.Cost_Category_Search.GL_CODE = _param_vender.GL_CODE;

    }
    $scope.POP_VENDER_DELETE_Fn = function (_param_vender) {
        $scope.SELECTED_VENDER = _param_vender;
        $scope.SELECTED_VENDER.MESSAGE = "It is safe to perform this operation as it hasn't been assigned to any cashup. Do you want to proceed?";
        $('#Delete_Vender').modal('show');

    }
    $scope.POP_DELETE_COST_CATEGORY_Fn = function (_param_vender) {
        $scope.SELECTED_CATEGORY = _param_vender;
        $scope.SELECTED_CATEGORY.MESSAGE = "It is safe to perform this operation as it hasn't been assigned to any cashup. Do you want to proceed?";
        $('#Delete_Cost').modal('show');
    }

    $scope.ADMIN_INS_UPD_PDQ_MASTER = function (_param_pdq, _param_index, _param_call_Flag) {
        $scope.PDQ_FORM.submitted = true;
        var Valid = 0;
        if (_param_call_Flag == 1 && (_param_pdq.PDQ_MASTER_ID == undefined || _param_pdq.PDQ_MASTER_ID == null || _param_pdq.PDQ_MASTER_ID == 0)) {
            angular.forEach($scope.PDQ_LIST, function (_param) {
                if (_param.PDQ_MASTER_ID != 0) {
                    if (_param.PDQ_CODE == _param_pdq.PDQ_CODE) {
                        Valid++;
                    }
                }
            })
        }
        if ($scope.PDQ_FORM.$valid && Valid == 0) {
            CommonObj = new Object();
            CommonObj.PDQ_MASTER_ID = _param_pdq.PDQ_MASTER_ID == undefined ? 0 : _param_pdq.PDQ_MASTER_ID;
            CommonObj.PDQ_CODE = _param_pdq.PDQ_CODE;
            CommonObj.ENTITY_ID = $scope.Setup_Search.ENTITY_ID;
            CommonObj.BRANCH_ID = $scope.Setup_Search.BRANCH_ID;
            CommonObj.ACTIVE = _param_call_Flag == 2 ? 0 : 1;
            CommonObj.USER_ID = parseInt($cookies.get("USERID"));

            PrcCommMethods.ADMIN_API(CommonObj, 'ADMIN_INS_UPD_PDQ_MASTER').then(function (data) {
                if (data.data > 0) {
                    if (_param_pdq.PDQ_MASTER_ID == 0 && _param_call_Flag == 1) {
                        $scope.$parent.ShowAlertBox("Success", 'PDQ added successfully', 3000);
                    } else if (_param_pdq.PDQ_MASTER_ID > 0 && _param_call_Flag == 1) {
                        $scope.$parent.ShowAlertBox("Success", 'PDQ updated successfully', 3000);
                    }
                    else if (_param_pdq.PDQ_MASTER_ID > 0 && _param_call_Flag == 2) {
                        $scope.$parent.ShowAlertBox("Success", 'PDQ Deleted successfully', 3000);
                    }
                    $scope.ADMIN_GET_PDQ_MASTER();
                    _param_pdq.PDQ_CODE = "";
                    $scope.PDQ_FORM.submitted = false;
                } if (data.data < 0) {
                    $scope.$parent.ShowAlertBox("Attention", 'Already Added', 3000);
                }
                if (data.data == 0) {
                    $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                }


            });
        } else {
            if (Valid > 0) {
                $scope.$parent.ShowAlertBox("Attention", _param_pdq.PDQ_CODE + ' is already saved.Please, save different code.', 3000);
            }
        }
    };
    $scope.INS_UPD_ACCOUNT_CUSTOMER_CUSTOMERS = function (_param_vender, _param_call_Flag) {

        $scope.VENDER_FORM.submitted = true;
        if ($scope.VENDER_FORM.$valid) {
            var CashupModelObj = new Object();
            CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            CashupModelObj.BRANCH_ID = $scope.Setup_Search.BRANCH_ID;
            CashupModelObj.CUSTOMER_ID = _param_vender.CUSTOMER_ID;
            CashupModelObj.CUSTOMER_NAME = _param_vender.NAME;
            CashupModelObj.EMAIL = _param_vender.EMAIL;
            CashupModelObj.PHONE = _param_vender.PHONE;
            CashupModelObj.ACTIVE = 1;
            PrcCommMethods.CASHUP_APP_API(CashupModelObj, 'INS_UPD_ACCOUNT_CUSTOMER_CUSTOMERS').then(function (data) {
                if (data.data == 0) {
                    $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                }
                if (data.data > 0) {
                    if (_param_vender.CUSTOMER_ID == 0) {
                        $scope.$parent.ShowAlertBox("Success", 'Vender added successfully', 3000);
                    } else if (_param_vender.CUSTOMER_ID > 0) {
                        $scope.$parent.ShowAlertBox("Success", 'Vender updated successfully', 3000);
                    }
                }
                $scope.GET_ACCOUNT_CUSTOMER_CUSTOMERS();
                $scope.RESET_CUSTOMER();
            });
        }
    }
    $scope.ADMIN_INS_UPD_BRANCH_STAFF = function (_param_auth, _param_index, _param_call_Flag) {
        $scope.AUTHORIZER_FORM.submitted = true;
        var Valid = 0;
        if (_param_call_Flag == 1 && (_param_auth.TABLE_ID == undefined || _param_auth.TABLE_ID == null || _param_auth.TABLE_ID == 0)) {
            angular.forEach($scope.AUTHORIZER_LIST, function (_param) {
                if (_param.TABLE_ID != 0) {
                    if (_param.NAME == _param_auth.NAME) {
                        Valid++;
                    }
                }
            })
        }
        if ($scope.AUTHORIZER_FORM.$valid && Valid == 0) {
            // if ($scope.BranchstafftabsSearch.ACTIVE != -1) {
            CashupTabsObj = new Object();
            $scope.BRANCH_STAFF = [];
            CashupTabsObj.ENTITY_ID = $scope.Setup_Search.ENTITY_ID;
            CashupTabsObj.BRANCH_ID = $scope.Setup_Search.BRANCH_ID;
            CashupTabsObj.USER_ID = parseInt($cookies.get("USERID"));
            var OBJBRANCH_STAFF = new Object();
            OBJBRANCH_STAFF.TABLE_ID = _param_auth.TABLE_ID == null ? 0 : _param_auth.TABLE_ID;
            OBJBRANCH_STAFF.NAME = _param_auth.NAME;
            OBJBRANCH_STAFF.ACTIVE = _param_call_Flag == 2 ? 0 : 1;
            $scope.BRANCH_STAFF.push(OBJBRANCH_STAFF);
            CashupTabsObj.BRANCH_STAFF = $scope.BRANCH_STAFF;
            PrcCommMethods.ADMIN_API(CashupTabsObj, 'ADMIN_INS_UPD_BRANCH_STAFF').then(function (data) {
                if (data.data > 0) {
                    if (_param_auth.TABLE_ID == 0 && _param_call_Flag == 1) {
                        $scope.$parent.ShowAlertBox("Success", ' Authorizers added successfully', 3000);
                    } else if (_param_auth.TABLE_ID > 0 && _param_call_Flag == 1) {
                        $scope.$parent.ShowAlertBox("Success", ' Authorizers updated successfully', 3000);
                    }
                    else if (_param_auth.TABLE_ID > 0 && _param_call_Flag == 2) {
                        $scope.$parent.ShowAlertBox("Success", ' Authorizers Deleted successfully', 3000);
                    }
                    $scope.ADMIN_GET_BRANCH_STAFF();
                    _param_auth.NAME = "";
                    $scope.AUTHORIZER_FORM.submitted = false;
                } if (data.data < 0) {
                    $scope.$parent.ShowAlertBox("Attention", 'Already Added', 3000);
                }
                if (data.data == 0) {
                    $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                }
                //$scope.ResetBRNSTAFF();
            });
            //}
            //else { $scope.$parent.ShowAlert('Attention', 'Please Select Active/In-Active Option.', 3000); $scope.BranchstafftabsForm.submitted = false; }
        } else {
            if (Valid > 0) {
                $scope.$parent.ShowAlertBox("Attention", _param_auth.NAME + ' is already saved.Please, save different name.', 3000);
            }
        }

    };
    $scope.RESET_VENDOR = function () {
        $scope.Vender_Search = {
            CUSTOMER_ID: 0,
            CUSTOMER_NAME: null,
            EMAIL: null,
            PHONE: null,
            PAGE_NO: 1,
            PAGE_SIZE: 10,
        }
        $scope.VENDER_FORM.submitted = false;
    }

    $scope.RESET_CATEGORY = function () {
        $scope.Cost_Category_Search = {
            PETTY_CASH_COST_CATEGORIE_ID: null,
            PETTY_CASH_CATEGORY_ID: null,
            CATEGORY_NAME: '',
            GL_NAME: null,
            GL_CODE: null,
        }
        $scope.COST_CATEGORY_FORM.submitted = false;
    }


    //Cost Cateory
    $scope.INS_UPD_PETTY_CASH_COST_CATEGORIES = function (_param_cost, _param_call_Flag) {

        $scope.COST_CATEGORY_FORM.submitted = true;
        if ($scope.COST_CATEGORY_FORM.$valid || _param_call_Flag == 0) {
            var CashupModelObj = new Object();
            CashupModelObj.PETTY_CASH_COST_CATEGORIE_ID = _param_cost.PETTY_CASH_COST_CATEGORIE_ID;
            CashupModelObj.CATEGORY_NAME = _param_cost.CATEGORY_NAME;
            CashupModelObj.GL_NAME = _param_cost.GL_NAME;
            CashupModelObj.GL_CODE = _param_cost.GL_CODE;
            CashupModelObj.CUSTOMER_ID = $scope.Setup_Search.CUSTOMER_ID;
            CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            CashupModelObj.BRANCH_ID = $scope.Setup_Search.BRANCH_ID;
            CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
            CashupModelObj.ACTIVE = _param_call_Flag;
            CashupModelObj.COST_CATEGORIE_CREATOR = 1;
            PrcCommMethods.CASHUP_APP_API(CashupModelObj, 'INS_UPD_PETTY_CASH_COST_CATEGORIES').then(function (data) {
                if (data.data == 0) {
                    $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                }
                if (data.data > 0) {
                    $scope.RESET_CATEGORY();
                    $scope.GET_PETTY_CASH_COST_CATEGORIES();
                    if (_param_cost.PETTY_CASH_COST_CATEGORIE_ID == 0) {
                        $scope.$parent.ShowAlertBox("Success", 'Category added successfully', 3000);
                    } else if (_param_cost.PETTY_CASH_COST_CATEGORIE_ID > 0) {
                        $scope.$parent.ShowAlertBox("Success", 'Category updated successfully', 3000);
                    }
                }

            });
        }
    }

    $scope.INS_UPD_CASHUP_REASON_FOR_COMP = function (_comp, _index, _callFlag) {
        $scope.COMPS_FORM.submitted = true;
        if (_comp.REASONS === undefined || _comp.REASONS === '') {
            $scope.$parent.ShowAlertBox("Error", 'Please enter a valid Comp Name', 3000);
            return;
        }

        var isDuplicate = false;
        if (_callFlag === 1 && _comp.CASHUP_REASON_FOR_COMP_ID === 0) {
            angular.forEach($scope.COMPS_LIST, function (existingComp) {
                if (existingComp.REASONS === _comp.REASON && existingComp.CASHUP_REASON_FOR_COMP_ID !== 0) {
                    isDuplicate = true;
                }
            });
        }

        if (isDuplicate) {
            $scope.$parent.ShowAlertBox("Attention", _comp.REASON + ' already exists. Please choose a different name.', 3000);
            return;
        }

        var compObj = new Object();
        compObj.CASHUP_REASON_FOR_COMP_ID = _comp.CASHUP_REASON_FOR_COMP_ID ? _comp.CASHUP_REASON_FOR_COMP_ID : 0;
        compObj.REASON = _comp.REASONS;
        compObj.CUSTOMER_ID = $scope.Setup_Search.CUSTOMER_ID;
        compObj.ENTITY_ID = $scope.Setup_Search.ENTITY_ID;
        compObj.BRANCH_ID = $scope.Setup_Search.BRANCH_ID;
        compObj.ACTIVE = 1; // 0 for delete
        compObj.USER_ID = $scope.Setup_Search.USER_ID;

        PrcCommMethods.CASHUP_APP_API(compObj, 'INS_UPD_CASHUP_REASON_FOR_COMP')
            .then(function (response) {
                if (response.data > 0) {
                    if (_comp.CASHUP_REASON_FOR_COMP_ID === 0 && _callFlag === 1) {
                        $scope.$parent.ShowAlertBox("Success", 'Comp added successfully', 3000);
                    } else if (_comp.CASHUP_REASON_FOR_COMP_ID > 0 && _callFlag === 1) {
                        $scope.$parent.ShowAlertBox("Success", 'Comp updated successfully', 3000);
                    } else if (_comp.CASHUP_REASON_FOR_COMP_ID > 0 && _callFlag === 2) {
                        $scope.$parent.ShowAlertBox("Success", 'Comp deleted successfully', 3000);
                    }
                    $scope.GET_COMPS();
                    _comp.REASONS = ""; // Clear the name input
                    $scope.COMPS_FORM.submitted = false;
                } else if (response.data < 0) {
                    $scope.$parent.ShowAlertBox("Attention", 'Comp already exists in the database.', 3000);
                } else {
                    $scope.$parent.ShowAlertBox("Error", $scope.$parent.$parent.SOMETHINGWENTWRONG, 3000);
                }
            })
    };
    $scope.ADMIN_INS_UPD_REASON_FOR_VOID = function (_void, _callFlag) {
        $scope.VOIDS_FORM.submitted = true;
        if (_void.VOID_REASON === undefined || _void.VOID_REASON === '') {
            $scope.$parent.ShowAlertBox("Error", 'Please enter a valid Void Name', 3000);
            return;
        }
        var voidObj = new Object;
        voidObj.VOID_ID = _void.VOID_ID || 0; // 0 for new void
        voidObj.REASON = _void.VOID_REASON;
        voidObj.BRANCH_ID = $scope.Setup_Search.BRANCH_ID;
        voidObj.ENTITY_ID = $cookies.get("ENTITY_ID");
        voidObj.ACTIVE = _callFlag === 2 ? 0 : 1; // 0 for delete, 1 for add/update
        voidObj.USER_ID = $cookies.get("USERID");
        PrcCommMethods.CASHUP_APP_API(voidObj, 'ADMIN_INS_UPD_REASON_FOR_VOID')
            .then(function (response) {
                if (response.data > 0) {
                    if (_void.VOID_ID === 0 && _callFlag === 1) {
                        $scope.$parent.ShowAlertBox("Success", 'Void added successfully', 3000);
                    } else if (_void.VOID_ID > 0 && _callFlag === 1) {
                        $scope.$parent.ShowAlertBox("Success", 'Void updated successfully', 3000);
                    } else if (_void.VOID_ID > 0 && _callFlag === 2) {
                        $scope.$parent.ShowAlertBox("Success", 'Void deleted successfully', 3000);
                    }
                    $scope.GET_VOIDS();
                    $scope.VOIDS_FORM.submitted = false;
                }
                else if (response.data < 0) {
                    $scope.NewVoid.VOID_REASON = null;

                    $scope.$parent.ShowAlertBox("Attention", 'Void already exists in the database.', 3000);
                }
                else {
                    $scope.$parent.ShowAlertBox("Error", 'Something went wrong. Please try again later.', 3000);
                }
            });

    };
    $scope.INS_UPD_CASHUP_CARDS_Fn = function (card) {

        var CardsObjModel = new Object;
        CardsObjModel.CASHUP_CARD_ID = card.CASHUP_CARD_ID;
        CardsObjModel.CARD_NAME = card.CARD_NAME;
        CardsObjModel.IS_DEFAULT = card.IS_DEFAULT ? 1 : 0;
        CardsObjModel.IN_USE = card.IN_USE ? 1 : 0;
        CardsObjModel.CUSTOMER_ID = $scope.General_search.CUSTOMER_ID
        CardsObjModel.ENTITY_ID = $scope.General_search.ENTITY_ID;
        CardsObjModel.BRANCH_ID = null;
        CardsObjModel.USER_ID = $scope.General_search.USER_ID;
        PrcCommMethods.CASHUP_APP_API(CardsObjModel, 'INS_UPD_CASHUP_CARDS').then(function (response) {
            if (response.status == 200) {
                $scope.$parent.ShowAlertBox("Success", 'Card Enabled successfully', 3000);
                $scope.GET_COMPS(1);
            } else {
                $scope.$parent.ShowAlertBox("Error", 'Something went wrong. Please try again later.', 3000);
            }
        });
    };

    $scope.INS_UPD_CASHUP_VENDORS = function (_Vender_Search, _call_Flag) {
        $scope.VENDER_FORM.submitted = true;
        if ($scope.VENDER_FORM.$valid || _call_Flag == 0) {
            var vendorObj = new Object();
            vendorObj.VENDOR_ID = _Vender_Search.CASHUP_VENDOR_ID ? _Vender_Search.CASHUP_VENDOR_ID : 0;
            vendorObj.VENDOR_NAME = _Vender_Search.VENDOR_NAME;
            vendorObj.VENDOR_EMAIL = _Vender_Search.VENDOR_EMAIL;
            vendorObj.VENDOR_CONTACT = _Vender_Search.VENDOR_CONTACT;
            vendorObj.COUNTRY_ID = null;
            vendorObj.PHONE_CODE_ID = null;
            vendorObj.NATIONALITY_ID = null;
            vendorObj.CUSTOMER_ID = $scope.Setup_Search.CUSTOMER_ID;
            vendorObj.ENTITY_ID = $scope.Setup_Search.ENTITY_ID;
            vendorObj.BRANCH_ID = $scope.Setup_Search.BRANCH_ID;
            vendorObj.ACTIVE = _call_Flag;
            vendorObj.USER_ID = $scope.Setup_Search.USER_ID;
            vendorObj.VENDOR_CREATOR = 1;
            PrcCommMethods.CASHUP_APP_API(vendorObj, 'INS_UPD_CASHUP_VENDORS').then(function (response) {
                if (response.status == 200) {
                    $scope.$parent.ShowAlertBox("Success", 'Vendors added successfully', 3000);
                    $scope.GET_CASHUP_VENDORS();
                    $scope.RESET_VENDOR();
                } else {
                    $scope.$parent.ShowAlertBox("Error", 'Something went wrong. Please try again later.', 3000);
                }
            });
        }
    }
    $scope.$on('$destroy', function () {
        $('.modal.show').modal('hide');
    });
});