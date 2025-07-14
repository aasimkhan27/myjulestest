app.controller('EPOS_Validation_EntryController', function ($scope, $http, $interval, CommService, $cookies, $filter, PrcCommMethods, $location, readFileData, readFileDataNew, $sce, $localStorage) {
    console.log($scope.$parent);
    $scope.VALIDATION_SEARCH = {
        ENTITY_ID: null,
        BRANCH_ID: null,
        PAGE_NO: 1, PAGE_SIZE: 10,
        USER_NAME: null,
        START_DATE: '',
        INTEGRATION_SYSTEM_ID: null,
        STATUS: null,
        FILE_UPLOAD_COTROLER_ID: null
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
    $scope.BlankValidate = { ID: 0, ENTITY_ID: 22, BRANCH_ID: 29, INTEGRATION_SYSTEM_ID: 1, NET: null, TAX: null, GROSS: null, DISCOUNT: null, TIPS: null, SERVICE_CHARGE: null, STATUS: null, UPLOAD_IDS: null, COMMENTS: null, CASHUP_DATE: '', STATUS: '', UploadedFiles: [] };


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
            $scope.GET_EPOS_SALES_VALIDATION(1);
        })
    };
    $scope.GET_UTC_TIME();
    $scope.MATCH_VALIDATION_STATUS = function (_epos, _val) {
        // _epos.STATUS = true;
        if ((_epos.VALIDATION_NET != null && _epos.VALIDATION_NET != '' && _epos.EPOS_NET != null && _epos.EPOS_NET != '') || (_epos.VALIDATION_TAX != null && _epos.VALIDATION_TAX != '' && _epos.EPOS_TAX != null && _epos.EPOS_TAX != '') || (_epos.VALIDATION_GROSS != null && _epos.VALIDATION_GROSS != '' && _epos.EPOS_GROSS != null && _epos.EPOS_GROSS != '') || (_epos.VALIDATION_DISCOUNT != null && _epos.VALIDATION_DISCOUNT != '' && _epos.EPOS_DISCOUNT != null && _epos.EPOS_DISCOUNT != '') || (_epos.VALIDATION_TIPS != null && _epos.VALIDATION_TIPS != '' && _epos.EPOS_TIPS != null && _epos.EPOS_TIPS != '') || (_epos.VALIDATION_SERVICE_CHARGE != null && _epos.VALIDATION_SERVICE_CHARGE != '' && _epos.EPOS_SERVICE_CHARGE != null && _epos.EPOS_SERVICE_CHARGE != '')) {
            switch (_val) {
                case 1:
                    _epos.STATUS_NET = false;
                    if (Math.abs(parseFloat(_epos.EPOS_NET).toFixed(2) - parseFloat(_epos.VALIDATION_NET)) > 1) {
                        // _epos.STATUS = false;
                        _epos.STATUS_NET = true;
                    }
                    break;
                case 2:
                    _epos.STATUS_TAX = false;
                    if (Math.abs(parseFloat(_epos.EPOS_TAX).toFixed(2) - parseFloat(_epos.VALIDATION_TAX)) > 1) {
                        // _epos.STATUS = false;
                        _epos.STATUS_TAX = true;
                    }
                    break;
                case 3:
                    _epos.STATUS_GROSS = false;
                    if (Math.abs(parseFloat(_epos.EPOS_GROSS).toFixed(2) - parseFloat(_epos.VALIDATION_GROSS)) > 1) {
                        _epos.STATUS_GROSS = true;
                        //_epos.STATUS = false;
                    }
                    break;
                case 4:
                    _epos.STATUS_DISCOUNT = false;
                    if (Math.abs(parseFloat(_epos.EPOS_DISCOUNT).toFixed(2) - parseFloat(_epos.VALIDATION_DISCOUNT)) > 1) {
                        _epos.STATUS_DISCOUNT = true;
                        //_epos.STATUS = false;
                    }
                    break;
                case 5:
                    _epos.STATUS_TIPS = false;
                    if (Math.abs(parseFloat(_epos.EPOS_TIPS).toFixed(2) - parseFloat(_epos.VALIDATION_TIPS)) > 1) {
                        _epos.STATUS_TIPS = true;
                        // _epos.STATUS = false;
                    }
                    break;
                case 6:
                    _epos.STATUS_SRV_CHARGES = false;
                    if (Math.abs(parseFloat(_epos.EPOS_SERVICE_CHARGE).toFixed(2) - parseFloat(_epos.VALIDATION_SERVICE_CHARGE)) > 1) {
                        _epos.STATUS_SRV_CHARGES = true;
                        //_epos.STATUS = false;
                    }
                    break;

                default:
                    _epos.STATUS_TOTAL = false;
                    if (Math.abs(parseFloat(_epos.TOTAL_EPOS).toFixed(2) - parseFloat(_epos.TOTAL_VALIDATION)) > 1) {
                        _epos.STATUS_TOTAL = true;
                        // _epos.STATUS = false;
                    }
            }
        }
        if (_epos.STATUS_NET != undefined || _epos.STATUS_TAX != undefined || _epos.STATUS_GROSS != undefined || _epos.STATUS_DISCOUNT != undefined || _epos.STATUS_TIPS != undefined || _epos.STATUS_SRV_CHARGES != undefined || _epos.STATUS_TOTAL != undefined) {
            if (_epos.STATUS_NET == true || _epos.STATUS_TAX == true || _epos.STATUS_GROSS == true || _epos.STATUS_DISCOUNT == true || _epos.STATUS_TIPS == true || _epos.STATUS_SRV_CHARGES == true || _epos.STATUS_TOTAL == true) {
                _epos.STATUS = 2;
            } else {
                _epos.STATUS = 3;
            }
        } else {
            _epos.STATUS = 1;
        }

    }

    //This block is modified by moitreya on 4th april

    $scope.GET_INTEGRATION_DETAILS_BY_CUST_ENT_BRNH = function () {
        $scope.$parent.overlay_loadingNew = "block";
        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_ID = 0;
        CusModelObj.ENTITY_ID = $scope.VALIDATION_SEARCH.ENTITY_ID;
        CusModelObj.BRANCH_ID = $scope.VALIDATION_SEARCH.BRANCH_ID;
        // Remove the condition that checks EntityId and BranchId != null
        // This enables us also search by EPOS systems only
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

    //THIS IS THE ORIGINAL CODE. BACKUP on 4th april
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
                //$scope.VALIDATION_SEARCH.ENTITY_ID = $scope.ENTITY_LIST[0].ENTITY_NAME;
            }
            else { $scope.ENTITY_LIST = []; };
        });
    };
    $scope.GET_ENTITY_LIST();
    $scope.ADMIN_GET_BRANCH = function () {
        // $scope.GET_INTEGRATION_DETAILS_BY_CUST_ENT_BRNH();
        if ($scope.VALIDATION_SEARCH.ENTITY_ID != null && $scope.VALIDATION_SEARCH.ENTITY_ID != undefined) {
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
                    $scope.GET_INTEGRATION_DETAILS_BY_CUST_ENT_BRNH(); //uncommented by moitreya 4th april 2025

                }
                else
                    $scope.BRANCH_LIST = [];
            });
        } else {
            $scope.BRANCH_LIST = [];
            $scope.INTEGRATIONSYSTEM_LIST = [];
        }
        //}
        //else {
        //    $scope.BRANCH_LIST = [];
        //}
    };
    $scope.RESET_SEARCH = function () {
        $scope.VALIDATION_SEARCH.ENTITY_ID = null;
        $scope.VALIDATION_SEARCH.BRANCH_ID = null;
        $scope.VALIDATION_SEARCH.INTEGRATION_SYSTEM_ID = null;
        $scope.VALIDATION_SEARCH.STATUS = null;
        $scope.VALIDATION_SEARCH.USER_NAME = null;
        $scope.GET_EPOS_SALES_VALIDATION(1);
    }
    $scope.LAZY_GET_EPOS_SALES_VALIDATION = function () {
        $scope.GET_EPOS_SALES_VALIDATION();
    };
    $scope.GET_EPOS_SALES_VALIDATION = function (FLAG) {
        var CustmObj = new Object();
        if (FLAG == 1) {
            $scope.EPOS_SALES_LIST = [];
            $scope.VALIDATION_SEARCH.PAGE_NO = 1;
        }
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
                console.log(data.data);
                $scope.EPOS_SALES_LIST = $scope.EPOS_SALES_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.VALIDATION_SEARCH.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.VALIDATION_SEARCH.PAGE_NO = parseInt($scope.VALIDATION_SEARCH.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else {
                $scope.GetData = false;
                $scope.EPOS_SALES_LIST = [];
            }
        });

    };
    $scope.init_EPOS_Upload_List = function (_LINE) {
        $scope.$parent.GET_UPLOADS(_LINE, 53, _LINE.EPOS_SALES_VALIDATION_ID);
        $scope.MATCH_VALIDATION_STATUS(_LINE, 1);
        $scope.MATCH_VALIDATION_STATUS(_LINE, 2);
        $scope.MATCH_VALIDATION_STATUS(_LINE, 3);
        $scope.MATCH_VALIDATION_STATUS(_LINE, 4);
        $scope.MATCH_VALIDATION_STATUS(_LINE, 5);
        $scope.MATCH_VALIDATION_STATUS(_LINE, 6);

    }
    $scope.INS_UPD_EPOS_SALES_VALIDATION = function (EPOS_EDIT, FLAG) {


        $scope.EposValidationForm.submitted = true;
        if ($scope.EposValidationForm.$valid) {
            var CustmObj = new Object();
            CustmObj.USER_ID = $cookies.get("USERID");

            CustmObj.EPOS_SALES_VALIDATION = [];
            if (FLAG != 1) {
                angular.forEach($scope.EPOS_SALES_LIST, function (_epos) {

                    var EposSalesTypeObj = new Object();
                    EposSalesTypeObj.ENTITY_ID = _epos.ENTITY_ID;
                    EposSalesTypeObj.BRANCH_ID = _epos.BRANCH_ID;
                    EposSalesTypeObj.INTEGRATION_SYSTEM_ID = _epos.INTEGRATION_SYSTEM_ID;
                    EposSalesTypeObj.NET = (_epos.VALIDATION_NET == null || _epos.VALIDATION_NET == undefined || _epos.VALIDATION_NET == 0) ? 0 : parseFloat(_epos.VALIDATION_NET);
                    EposSalesTypeObj.TAX = (_epos.VALIDATION_TAX == null || _epos.VALIDATION_TAX == undefined || _epos.VALIDATION_TAX == 0) ? 0 : parseFloat(_epos.VALIDATION_TAX);
                    EposSalesTypeObj.GROSS = (_epos.VALIDATION_GROSS == null || _epos.VALIDATION_GROSS == undefined || _epos.VALIDATION_GROSS == 0) ? 0 : parseFloat(_epos.VALIDATION_GROSS);
                    EposSalesTypeObj.DISCOUNT = (_epos.VALIDATION_DISCOUNT == null || _epos.VALIDATION_DISCOUNT == undefined || _epos.VALIDATION_DISCOUNT == 0) ? 0 : parseFloat(_epos.VALIDATION_DISCOUNT);
                    EposSalesTypeObj.TIPS = (_epos.VALIDATION_TIPS == null || _epos.VALIDATION_TIPS == undefined || _epos.VALIDATION_TIPS == 0) ? 0 : parseFloat(_epos.VALIDATION_TIPS);
                    EposSalesTypeObj.SERVICE_CHARGE = (_epos.VALIDATION_SERVICE_CHARGE == null || _epos.VALIDATION_SERVICE_CHARGE == undefined || _epos.VALIDATION_SERVICE_CHARGE == 0) ? 0 : parseFloat(_epos.VALIDATION_SERVICE_CHARGE);
                    EposSalesTypeObj.STATUS = _epos.STATUS == null ? 1 : _epos.STATUS;
                    //EposSalesTypeObj.UPLOAD_IDS = _epos.UPLOAD_IDS == undefined || _epos.UPLOAD_IDS == null ? null : _epos.UPLOAD_ID;
                    if (_epos.UploadedFiles.length > 0) {
                        angular.forEach(_epos.UploadedFiles, function (_upload_val) {
                            if (EposSalesTypeObj.UPLOAD_IDS == "" || EposSalesTypeObj.UPLOAD_IDS == null || EposSalesTypeObj.UPLOAD_IDS == undefined) {
                                EposSalesTypeObj.UPLOAD_IDS = _upload_val.ID;
                            }
                            else {
                                EposSalesTypeObj.UPLOAD_IDS = EposSalesTypeObj.UPLOAD_IDS + ',' + _upload_val.ID;
                            }
                        });
                    } else {
                        EposSalesTypeObj.UPLOAD_IDS = null;
                    }
                    EposSalesTypeObj.COMMENTS = _epos.COMMENTS == undefined ? null : _epos.COMMENTS;
                    EposSalesTypeObj.CASHUP_DATE = $scope.VALIDATION_SEARCH.START_DATE;
                    CustmObj.EPOS_SALES_VALIDATION.push(EposSalesTypeObj);

                });
            } else {
                var EposSalesTypeObj = new Object();
                //EposSalesTypeObj.ENTITY_ID = EPOS_EDIT.EPOS_SALES_VALIDATION_ID;
                EposSalesTypeObj.ENTITY_ID = EPOS_EDIT.ENTITY_ID;
                EposSalesTypeObj.BRANCH_ID = EPOS_EDIT.BRANCH_ID;
                EposSalesTypeObj.INTEGRATION_SYSTEM_ID = EPOS_EDIT.INTEGRATION_SYSTEM_ID;
                EposSalesTypeObj.NET = (EPOS_EDIT.VALIDATION_NET == null || EPOS_EDIT.VALIDATION_NET == undefined || EPOS_EDIT.VALIDATION_NET == 0) ? 0 : parseFloat(EPOS_EDIT.VALIDATION_NET);
                EposSalesTypeObj.TAX = (EPOS_EDIT.VALIDATION_TAX == null || EPOS_EDIT.VALIDATION_TAX == undefined || EPOS_EDIT.VALIDATION_TAX == 0) ? 0 : parseFloat(EPOS_EDIT.VALIDATION_TAX);
                EposSalesTypeObj.GROSS = (EPOS_EDIT.VALIDATION_GROSS == null || EPOS_EDIT.VALIDATION_GROSS == undefined || EPOS_EDIT.VALIDATION_GROSS == 0) ? 0 : parseFloat(EPOS_EDIT.VALIDATION_GROSS);
                EposSalesTypeObj.DISCOUNT = (EPOS_EDIT.VALIDATION_DISCOUNT == null || EPOS_EDIT.VALIDATION_DISCOUNT == undefined || EPOS_EDIT.VALIDATION_DISCOUNT == 0) ? 0 : parseFloat(EPOS_EDIT.VALIDATION_DISCOUNT);
                EposSalesTypeObj.TIPS = (EPOS_EDIT.VALIDATION_TIPS == null || EPOS_EDIT.VALIDATION_TIPS == undefined || EPOS_EDIT.VALIDATION_TIPS == 0) ? 0 : parseFloat(EPOS_EDIT.VALIDATION_TIPS);
                EposSalesTypeObj.SERVICE_CHARGE = (EPOS_EDIT.VALIDATION_SERVICE_CHARGE == null || EPOS_EDIT.VALIDATION_SERVICE_CHARGE == undefined || EPOS_EDIT.VALIDATION_SERVICE_CHARGE == 0) ? 0 : parseFloat(EPOS_EDIT.VALIDATION_SERVICE_CHARGE);
                EposSalesTypeObj.STATUS = EPOS_EDIT.STATUS == null ? 1 : EPOS_EDIT.STATUS;
                // EposSalesTypeObj.UPLOAD_IDS = EPOS_EDIT.UPLOAD_IDS == undefined || EPOS_EDIT.UPLOAD_IDS == null ? null : EPOS_EDIT.UPLOAD_ID;
                if (EPOS_EDIT.UploadedFiles.length > 0) {
                    angular.forEach(EPOS_EDIT.UploadedFiles, function (_upload_val) {
                        if (EposSalesTypeObj.UPLOAD_IDS == "" || EposSalesTypeObj.UPLOAD_IDS == null || EposSalesTypeObj.UPLOAD_IDS == undefined) {
                            EposSalesTypeObj.UPLOAD_IDS = _upload_val.ID;
                        }
                        else {
                            EposSalesTypeObj.UPLOAD_IDS = EposSalesTypeObj.UPLOAD_IDS + ',' + _upload_val.ID;
                        }
                    });
                } else {
                    EposSalesTypeObj.UPLOAD_IDS = null;
                }
                EposSalesTypeObj.COMMENTS = EPOS_EDIT.COMMENTS == undefined ? null : EPOS_EDIT.COMMENTS;
                EposSalesTypeObj.CASHUP_DATE = $scope.VALIDATION_SEARCH.START_DATE;
                CustmObj.EPOS_SALES_VALIDATION.push(EposSalesTypeObj);
            }

            PrcCommMethods.CASHUP_API(CustmObj, 'INS_UPD_EPOS_SALES_VALIDATION').then(function (data) {
                if (data.data == 1) {
                    $scope.$parent.ShowAlert("Success", "Updated Successfully", 3000);
                    $scope.GET_EPOS_SALES_VALIDATION(1);

                }
                if (data.data == 0) {
                    $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                }
            });

        }
    }
    $scope.RESET_EPOS = function (EPOS) {
        angular.forEach(EPOS.UploadedFiles, function (_val) {
            var CashupModelObj = new Object();
            CashupModelObj.ID = parseInt(_val.ID);
            PrcCommMethods.CASHUP_API(CashupModelObj, 'DELETE_UPLOAD').then(function (data) {
                //$scope.ShowAlert('Success', 'Delete success.', 5000);
            });
        })
        EPOS.VALIDATION_NET = null;
        EPOS.VALIDATION_TAX = null;
        EPOS.VALIDATION_GROSS = null;
        EPOS.VALIDATION_DISCOUNT = null;
        EPOS.VALIDATION_TIPS = null;
        EPOS.VALIDATION_SERVICE_CHARGE = null;
        EPOS.STATUS = null;
        EPOS.UPLOAD_IDS = null;
        EPOS.COMMENTS = '';
        //EPOS.CASHUP_DATE = '';
        $scope.INS_UPD_EPOS_SALES_VALIDATION(EPOS, 1);



        //$scope.EposValidationForm.submitted = false;

    }


    $scope.getTheFilesToUploadEPOS = function ($files, ControlName, FileSize, List, Attachment_UPLOAD_TYPE_ID, index) {

        if (FileSize == undefined || FileSize == null || FileSize == 0 || FileSize == '') {
            FileSize = AppVal.FileSize;
        }
        $scope.imagesrc = [];
        var valid = 0;
        for (var i = 0; i < $files.length; i++) {

            if ($scope.Attachment_UPLOAD_TYPE_ID == 12) {
                var validFormats = ['MPEG4', 'MP4', 'video/mp4'];
            }
            else {
                var validFormats = ['doc', 'docx', 'xml', 'pdf', 'csv', 'txt', 'text', 'jpg', 'jpeg', 'png', 'MPEG4', 'MP4', 'video/mp4', 'excel'];
            }
            var validity = validFormats.map(function (element) {
                if ($files[i].type.indexOf(element) != -1) {
                    return 1;
                }
                else {
                    return 0;
                }
            });
            valid = validity.indexOf(1);

            if (valid != -1) {
                if (($files[i].size / 1000000).toFixed(2) <= FileSize) {//File Size should not be more than 5 MB
                    var reader = new FileReader();
                    reader.fileName = $files[i].name;
                    reader.onload = function (event) {
                        var image = {};
                        image.Name = event.target.fileName;
                        image.Size = (event.total / 1024).toFixed(2);
                        image.Src = event.target.result;
                        $scope.imagesrc.push(image);
                        $scope.$apply();
                    }
                    reader.readAsText($files[i]);
                }
                else {
                    $scope.ShowAlert('Error', 'Maximum File Size ' + FileSize + ' MB.', 5000);
                    angular.element("input[id='" + ControlName + "']").val(null);
                    return;
                }
            }
            else {
                $scope.ShowAlert('Error', 'Not a valid file.', 5000);
                angular.element("input[id='" + ControlName + "']" + index).val(null);
                return;
            }
        }
        $scope.Files = $files;
        var fileUpload = document.getElementById("EPOSFILE" + index);
        extension = fileUpload.files[0].name;
        $scope.uploadFiles(Attachment_UPLOAD_TYPE_ID, '', extension, List, index, ControlName);
        $scope.VALIDATION_SEARCH.FILE_UPLOAD_COTROLER_ID = index;
    };
    $scope.uploadFiles = function (Attachment_UPLOAD_TYPE_ID, ATTACHEMENT_TYPE_ID, filename, List, index, ControlName) {

        if (($scope.Files != undefined && $scope.Files.length > 0)) {
            $scope.DocImageResult = [];
            var data = new FormData();
            data.append("RelativeID", List.EPOS_SALES_VALIDATION_ID > 0 ? List.EPOS_SALES_VALIDATION_ID : List.ID); 
            //data.append("RelativeID", List.EPOS_SALES_VALIDATION_ID > 0 ? "SALES_VAIDATION_" + List.EPOS_SALES_VALIDATION_ID : "CASHUP_ID_" + List.ID);
            data.append("UPLOAD_TYPE_ID", Attachment_UPLOAD_TYPE_ID);
            data.append("VIRTUALPATH", '/EPOS_/' + ControlName + '/' + parseInt(List.ENTITY_ID) + '/');
            data.append("UPLOAD_ID", 0);
            data.append("ORIGINAL_FILE_NAME", filename);
            data.append("USER_ID", parseInt($cookies.get("USERID")));
            if (isNaN(parseInt(List.ENTITY_ID))) {
                data.append("ENTITY_ID", 0);
            }
            else {
                data.append("ENTITY_ID", parseInt(List.ENTITY_ID));
            }
            for (var i in $scope.Files) {
                data.append("uploadedFile", $scope.Files[i]);
            }
            var request = {
                method: 'POST',
                url: CommService.Get_CASHUP_API() + "api/PayrollAPI/UPLOADFILES",
                data: data,
                headers: {
                    'Content-Type': undefined
                }
            };

            $http(request).then(function (d) {
                if (d.data.length > 0 && d.data[0].UPLOADED_COMMENT != undefined) {
                    $scope.ShowAlertBox('Error', d.data[0].UPLOADED_COMMENT, 5000);
                }
                else {
                    if (List.UploadedFiles.length == 0) {
                        List.UploadedFiles = d.data;
                    } else {

                        // List.UploadedFiles = List.UploadedFiles.concat(d.data);
                        List.UploadedFiles = d.data;

                    }
                    // List.UploadedFiles.push( d.data );
                    //List.UploadedFiles = List.UploadedFiles.concat(d.data);
                }
                if (List.UPLOAD_IDS_REMOVE == undefined) {
                    List.UPLOAD_IDS_REMOVE = [];
                }

                if (List.UPLOAD_IDS_REMOVE.length > 0) {
                    angular.forEach(List.UPLOAD_IDS_REMOVE, function (REMOVE_FILE) {
                        var index = List.UploadedFiles.findIndex(x => x.UPLOAD_ID === REMOVE_FILE.UPLOAD_ID);
                        if (index > -1) {
                            List.UploadedFiles.splice(index, 1);
                        }
                    });
                    //angular.forEach(List.UploadedFiles, function (UPLOAD_FILE) {
                    //    var index = List.UPLOAD_IDS_REMOVE.findIndex(x=>x.TABLE_ID === UPLOAD_FILE.TABLE_ID);
                    //    List.UploadedFiles.splice(index, 1);

                    //    //angular.forEach(List.UPLOAD_IDS_REMOVE, function (REMOVE_FILE) {
                    //    //})
                    //});
                }
                //angular.element("input[id='" + ControlName + index + "']").val(null);
                document.getElementById("EPOSFILE" + $scope.VALIDATION_SEARCH.FILE_UPLOAD_COTROLER_ID).value = "";
                //if (d.data.length > 0 && d.data[0].UPLOADED_COMMENT != undefined) {
                //    $scope.ShowAlert('Error', d.data[0].UPLOADED_COMMENT, 5000);
                //}
                //else {
                //    List.UploadedFiles = d.data;
                ////}
                //var temp =  d.data ;
                //List.UploadedFiles.push(temp);
                //document.getElementById("EPOSFILE" + $scope.VALIDATION_SEARCH.FILE_UPLOAD_COTROLER_ID).value = "";
            });
        }

    };

    $scope.DELETE_UPLOAD_VALIDATE_ALL = function (Array, item, index) {
        if (confirm('Are you sure you want to delete?')) {
            Array.UploadedFiles.splice(index, 1);
            var CashupModelObj = new Object();
            CashupModelObj.ID = parseInt(item.ID);
            PrcCommMethods.CASHUP_API(CashupModelObj, 'DELETE_UPLOAD').then(function (data) {
                $scope.ShowAlert('Success', 'Delete success.', 5000);
            });
        }
    };
    //$scope.DELETE_UPLOAD_VALIDATE_ALL = function (Array, item, index, FLAG) {
    //    if (confirm('Are you sure you want to delete the file?')) {
    //        if (FLAG == 1) {
    //            Array.splice(index, 1);
    //        }
    //        else {
    //            if (Array.UPLOAD_IDS_REMOVE == undefined || Array.UPLOAD_IDS_REMOVE == '') {
    //                Array.UPLOAD_IDS_REMOVE = [];
    //            }
    //            Array.UPLOAD_IDS_REMOVE.push(angular.copy(item));
    //            Array.UploadedFiles.splice(index, 1);
    //        }
    //    }
    //};
    $scope.EPOS_REFRESH = function (EPOS, INTEGRATION_STATUS) {
        if (confirm('Are you sure you want to Refresh EPOS Data?')) {
            $scope.$parent.$parent.overlay_loading_coffee = 'block';

            var CashupModelObj = new Object();
            CashupModelObj.CASHUP_MAIN_ID = EPOS.ID;
            CashupModelObj.INTEGRATION_STATUS = INTEGRATION_STATUS;
            CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
            CashupModelObj.SYNC_SOURCE = 3; //1 Auto Sync, 2 Web App, 3 Monitoring, 4 DB
            PrcCommMethods.CASHUP_API(CashupModelObj, 'UPD_CASHUP_MAIN_FOR_INTEGRATION').then(function (data) {
                console.log(data.data);
                /*
                if (data.data == 1) {
                    $scope.ShowWait = true;
                }
                $scope.start();
                */

            });
        }

    };
});