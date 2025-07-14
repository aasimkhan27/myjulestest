app.controller('PurchaseRequestController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $(".modal-backdrop").remove();
    $scope.PurchaseRequestSearch = {
        NAME: '',
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        UPLOADE_TYPE_ID: 31,
        FILTER_URGENT_REQUESTS: null,
        IS_MULTI_FILE_UPLOAD_ALLOW: true,
        UploadedFiles: [],
        BASE_TO_PR_CONVERSION_RATE: 1,
    }
    $scope.PURCHASE_REQUEST_LIST = [];
    $scope.CURRENCY_LIST = [];

    $scope.UREGENT_REQUEST_LIST = [{ NAME: 'Yes', ID: 1 }, { NAME: 'No', ID: 0 }]
    $scope.STATUS_LIST = [{ STATUS_NAME: 'In Request Approval', STATUS_ID: 68 }, { STATUS_NAME: 'Buyer Processing', STATUS_ID: 69 }, { STATUS_NAME: 'Rejected', STATUS_ID: 71 }, { STATUS_NAME: 'PO Created', STATUS_ID: 72 }, { STATUS_NAME: 'Cancelled', STATUS_ID: 73 }, { STATUS_NAME: 'In PO Approval', STATUS_ID: 70 }]

    $scope.GET_PURCHASE_REQUEST_LAZY_LOAG = function () {

        $scope.GET_PURCHASE_REQUEST();
    }

    $scope.GET_PURCHASE_REQUEST = function (FLAG) {
        $scope.$parent.overlay_loadingNew = 'block';
        if (FLAG == 1) {
            $scope.PurchaseRequestSearch.PAGE_NO = 1;
            $scope.PURCHASE_REQUEST_LIST = [];
        }
        ModelObj = new Object();
        ModelObj.PR_NUMBER = $scope.PurchaseRequestSearch.FILTER_PR_NUMBER;
        ModelObj.NAME = $scope.PurchaseRequestSearch.FILTER_ITEM_NAME;
        ModelObj.START_DATE = $scope.PurchaseRequestSearch.START_DATE;
        ModelObj.END_DATE = $scope.PurchaseRequestSearch.END_DATE;
        ModelObj.BRANCH_ID = $scope.PurchaseRequestSearch.FILTER_BRANCH_ID;
        ModelObj.STATUS_IDS = $scope.PurchaseRequestSearch.FILTER_STATUS_ID;
        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        ModelObj.PAGE_NO = $scope.PurchaseRequestSearch.PAGE_NO;
        ModelObj.PAGE_SIZE = $scope.PurchaseRequestSearch.PAGE_SIZE;
        ModelObj.URGENT_REQUEST = $scope.PurchaseRequestSearch.FILTER_URGENT_REQUESTS == null ? -1 : $scope.PurchaseRequestSearch.FILTER_URGENT_REQUESTS;        //-1 // all 0 false 1 true
        ModelObj.PRIVILAGE_134 = $scope.CheckSubModuleAccess(134) || $scope.CheckSubModuleAccess(156) ? 1 : 0; //-- 0/1 ON THE BASIS OF PRIV 134
        ModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.P2P_API(ModelObj, 'GET_PURCHASE_REQUESTS', 'PO').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.$parent.overlay_loadingNew = 'none';
                $scope.PURCHASE_REQUEST_LIST = $scope.PURCHASE_REQUEST_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.PurchaseRequestSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.PurchaseRequestSearch.PAGE_NO = parseInt($scope.PurchaseRequestSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else {
                if ($scope.PURCHASE_REQUEST_LIST.length == 0) { }
                $scope.GetData = false;
                $scope.$parent.overlay_loadingNew = 'none';
            }
        });
    }


    $scope.GET_PURCHASE_REQUEST_PENDING_WITH_USER = function (LINE) {
        $scope.PR_VIEW_DETAILS.STATUS_DTLS = [];
        ModelObj = new Object();
        ModelObj.PURCHASE_REQUEST_ID = LINE.REQUEST_ID;
        ModelObj.STATUS_ID = LINE.STATUS_ID;
        PrcCommMethods.P2P_API(ModelObj, 'GET_PURCHASE_REQUEST_PENDING_WITH_USER', 'PO').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.PR_VIEW_DETAILS.STATUS_DTLS = data.data.Table;


            }
            else {
                $scope.PR_VIEW_DETAILS.STATUS_DTLS = [];
            }
        });
    }

    $scope.GET_CURRENCY = function () {
        var CustmObj = new Object();
        PrcCommMethods.HR_API(CustmObj, 'GET_CURRENCY').then(function (data) {
            if (data.data.Table != undefined) {
                $scope.CURRENCY_LIST = angular.copy(data.data.Table);
                var item = data.data.Table.filter(function (x) { return x.CURRENCY_ID == parseInt($cookies.get("CURRENCY_ID")) })
                if (item.length > 0) {
                    $scope.PurchaseRequestSearch.PR_CURRENCY_ID = angular.copy(item[0].CURRENCY_ID);
                    $scope.PurchaseRequestSearch.PR_CURRENCY_NAME = angular.copy(item[0].DISPLAY_TEXT);
                    $scope.PurchaseRequestSearch.BASE_CURRENCY_ID = angular.copy(item[0].CURRENCY_ID);
                    $scope.PurchaseRequestSearch.BASE_CURRENCY_NAME = angular.copy(item[0].DISPLAY_TEXT);
                }
            }
            else {
                $scope.CURRENCY_LIST = [];
            }
        });
    }
    $scope.GET_CONVERSION_RATE = function (FLAG) {
        ModelObj = new Object();
        ModelObj.FROM_CURRENCY_ID = $scope.PurchaseRequestSearch.BASE_CURRENCY_ID;
        ModelObj.TO_CURRENCY_ID = $scope.PurchaseRequestSearch.PR_CURRENCY_ID;
        ModelObj.DATE = $scope.PurchaseRequestSearch.PO_DATE == undefined || $scope.PurchaseRequestSearch.PO_DATE == "" || $scope.PurchaseRequestSearch.PO_DATE == null ? (new Date()).toDateString() : new Date().toDateString();
        PrcCommMethods.P2P_API(ModelObj, 'GET_CONVERSION_RATE', 'PO').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.PurchaseRequestSearch.BASE_TO_PR_CONVERSION_RATE = parseFloat(data.data.Table[0].Column1).toFixed(5);
            }
        });
    }


    $scope.GET_CURRENCY();
    $scope.DISCARD_PURCHASE_REQUEST_POP = function (DISCARD_DTLS) {
        $scope.DISCARD_DTLS = DISCARD_DTLS;
        $('#Comments').modal('show');
        $scope.formcomments.submitted = false;
    }
    $scope.RESET_DISCARD = function () {
        $scope.DISCARD_DTLS.DISCARD_COMMENTS = "";
        $scope.formcomments.submitted = false;
    }
    $scope.DISCARD_PURCHASE_REQUEST = function () {
        $scope.formcomments.submitted = true;
        if ($scope.formcomments.$valid) {
            if (confirm('Are you sure you want to cancel?')) {
                ModelObj = new Object();
                ModelObj.PR_PURCHASE_REQUEST_ID = $scope.DISCARD_DTLS.REQUEST_ID;
                ModelObj.USER_ID = parseInt($cookies.get("USERID"));
                ModelObj.COMMENTS = $scope.DISCARD_DTLS.DISCARD_COMMENTS;
                PrcCommMethods.P2P_API(ModelObj, 'DISCARD_PURCHASE_REQUEST', 'PO').then(function (data) {
                    if (data.data == 1) {
                        $scope.$parent.ShowAlert('Success', "Request " + $scope.DISCARD_DTLS.PR_NUMBER + " cancelled successfully", 3000);
                        $scope.GET_PURCHASE_REQUEST(1);
                        $('#Comments').modal('hide');
                        $scope.DISCARD_DTLS = {};
                    };
                    if (data.data == 0) {
                        $scope.$parent.ShowAlert('Error', $scope.SOMETHINGWENTWRONG, 3000);
                    };
                });
            };
        };
    }
    function reportrangeCoverView(startDate, endDate) {
        $scope.PurchaseRequestSearch.START_DATE = startDate.format($scope.$parent.Datelocaleformat.format);
        $scope.PurchaseRequestSearch.END_DATE = endDate.format($scope.$parent.Datelocaleformat.format);
        $('#reportrangeInvRecView span').html(startDate.format($scope.$parent.Datelocaleformat.format) + ' - ' + endDate.format($scope.$parent.Datelocaleformat.format));
        $scope.GET_PURCHASE_REQUEST(1);
    };
    $scope.RESET_RECO_UPLOAD_VIEW = function () {
        startDate = moment().startOf('month');//moment().startOf('isoWeek');//moment().subtract(6, 'days');
        endDate = moment().endOf('month'); //moment().subtract(0, 'days');
        $scope.$parent.SetUpDateRangeMultiDatePicker('reportrangeInvRecView', startDate, endDate, reportrangeCoverView);
    }
    $scope.RESET_RECO_UPLOAD_VIEW()
    $scope.RESET_PR_REQUEST = function () {
        $scope.PurchaseRequestSearch.FILTER_ITEM_NAME = "";
        $scope.PurchaseRequestSearch.PAGE_NO = 1;
        $scope.PurchaseRequestSearch.FILTER_URGENT_REQUESTS = "";
        $scope.PurchaseRequestSearch.FILTER_PR_NUMBER = "";
        $scope.PurchaseRequestSearch.FILTER_URGENT_REQUESTS = null;
        $scope.PurchaseRequestSearch.FILTER_STATUS_ID = null;
        $scope.PurchaseRequestSearch.FILTER_BRANCH_ID = null;
        $scope.RESET_RECO_UPLOAD_VIEW();
    }
    $scope.CHANGE_CURRENCY = function () {
        if ($scope.PurchaseRequestSearch.BASE_CURRENCY_ID == $scope.PurchaseRequestSearch.PR_CURRENCY_ID) {
            $scope.PurchaseRequestSearch.BASE_TO_PR_CONVERSION_RATE = 1;
        }
        else {
            $scope.GET_CONVERSION_RATE(1);
        }

    }
    $scope.GET_BRANCH_LIST = function (BRN_LIST) {
        var UserModelObj = new Object();
        UserModelObj.INTEGRATION_SYSTEM_ID = 16
        UserModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        UserModelObj.USER_ID = parseInt($cookies.get("USERID"));
        UserModelObj.MODULE_ID = parseInt($cookies.get("MODULE_ID"));
        PrcCommMethods.CASHUP_API(UserModelObj, 'GET_BRANCH_LIST').then(function (data) {
            if (data.data.length > 0) {
                $scope.BRANCH_LOGIN_LIST = data.data;
                if ($scope.BRANCH_LOGIN_LIST.length == 1) {
                    $scope.PurchaseRequestSearch.BRANCH_ID = $scope.BRANCH_LOGIN_LIST[0].BRANCH_ID;
                    $scope.PurchaseRequestSearch.FILTER_BRANCH_ID = $scope.BRANCH_LOGIN_LIST[0].BRANCH_ID;
                }
            };
        });
    }
    $scope.GET_BRANCH_LIST();

    $scope.RESET_PURCHASE_REQUEST = function () {
        $scope.PurchaseRequestSearch.ITEM_NAME = "";
        $scope.PurchaseRequestSearch.DESCRIPTION = "";
        $scope.PurchaseRequestSearch.QUANTITY = "";
        $scope.PurchaseRequestSearch.UOM_NAME = "";
        $scope.PurchaseRequestSearch.EXPECTED_PRICE = "";
        $scope.PurchaseRequestSearch.SUGGESTED_SUPPLIER = "";
        $scope.PurchaseRequestSearch.REQUIRED_DATE = "";
        $scope.PurchaseRequestSearch.URGENT_REQUEST = false;

        //$scope.PurchaseRequestSearch.BRANCH_ID = null;
        $scope.PurchaseRequestSearch.COMMENTS = "";
        $scope.PurchaseRequestSearch.UploadedFiles = [];
        if ($scope.BRANCH_LOGIN_LIST.length == 1) {
            $scope.PurchaseRequestSearch.BRANCH_ID = $scope.BRANCH_LOGIN_LIST[0].BRANCH_ID;
        }
        var item = $scope.CURRENCY_LIST.filter(function (x) { return x.CURRENCY_ID == parseInt($cookies.get("CURRENCY_ID")) })
        if (item.length > 0) {
            $scope.PurchaseRequestSearch.PR_CURRENCY_ID = angular.copy(item[0].CURRENCY_ID);
            $scope.PurchaseRequestSearch.PR_CURRENCY_NAME = angular.copy(item[0].DISPLAY_TEXT);
            $scope.PurchaseRequestSearch.BASE_CURRENCY_ID = angular.copy(item[0].CURRENCY_ID);
            $scope.PurchaseRequestSearch.BASE_CURRENCY_NAME = angular.copy(item[0].DISPLAY_TEXT);
        }
        $scope.RequestForm.submitted = false;
    }

    $scope.INS_PURCHASE_REQUEST = function () {
        $scope.RequestForm.submitted = true;
        var Acount = 0, Bcount = 0;
        if ($scope.RequestForm.$valid) {
            //if (confirm('Are you sure you want to submit?')) {
            if ($scope.PurchaseRequestSearch.QUANTITY == 0) {
                Acount = 1;
            }
            if ($scope.PurchaseRequestSearch.EXPECTED_PRICE == 0) {
                Bcount = 2;
            }
            var ptopobj = new Object()
            ptopobj.ITEM_NAME = $scope.PurchaseRequestSearch.ITEM_NAME;
            ptopobj.DESCRIPTION = $scope.PurchaseRequestSearch.DESCRIPTION;
            ptopobj.QUANTITY = $scope.PurchaseRequestSearch.QUANTITY;
            ptopobj.UOM_NAME = $scope.PurchaseRequestSearch.UOM_NAME;
            ptopobj.EXPECTED_PRICE = $scope.PurchaseRequestSearch.EXPECTED_PRICE;
            ptopobj.SUGGESTED_SUPPLIER = $scope.PurchaseRequestSearch.SUGGESTED_SUPPLIER;
            ptopobj.REQUIRED_DATE = new Date($scope.PurchaseRequestSearch.REQUIRED_DATE).toDateString();
            ptopobj.URGENT_REQUEST = $scope.PurchaseRequestSearch.URGENT_REQUEST ? 1 : 0;
            ptopobj.USER_ID = parseInt($cookies.get("USERID"));
            ptopobj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            ptopobj.BRANCH_ID = $scope.PurchaseRequestSearch.BRANCH_ID;
            ptopobj.COMMENTS = $scope.PurchaseRequestSearch.COMMENTS;

            if ($scope.PurchaseRequestSearch.PR_CURRENCY_ID == $scope.PurchaseRequestSearch.BASE_CURRENCY_ID) {
                ptopobj.BASE_TO_PR_CONVERSION_RATE = 1;
            }
            else {
                ptopobj.BASE_TO_PR_CONVERSION_RATE = $scope.PurchaseRequestSearch.BASE_TO_PR_CONVERSION_RATE;
            }
            ptopobj.PR_CURRENCY_ID = $scope.PurchaseRequestSearch.PR_CURRENCY_ID;

            ptopobj.BASE_CURRENCY_ID = $scope.PurchaseRequestSearch.BASE_CURRENCY_ID;
            ptopobj.UPLOAD_IDS = "";
            angular.forEach($scope.PurchaseRequestSearch.UploadedFiles, function (x) {
                if (ptopobj.UPLOAD_IDS == "") {
                    ptopobj.UPLOAD_IDS = x.ID;
                }
                else {
                    ptopobj.UPLOAD_IDS = ptopobj.UPLOAD_IDS + "," + x.ID;
                }
            });
            if (Acount == 0 && Bcount == 0) {
                PrcCommMethods.P2P_API(ptopobj, 'INS_PURCHASE_REQUEST', 'PO').then(function (data) {
                    if (data.data == null || data.data == undefined || data.data == 0) {
                        $scope.$parent.ShowAlert("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                    }
                    else if (data.data > 0) {
                        $scope.$parent.ShowAlert("Success", "Purchase Request saved successfully ", 3000);
                        $scope.GET_PURCHASE_REQUEST(1);
                        $('#Create_PR').modal('hide');
                        $scope.RESET_PURCHASE_REQUEST();
                    }
                    else if (data.data < 0) {
                        $scope.$parent.ShowAlert("Attention", "Please contact support to set your approval chain", 3000);
                    }
                });
            }
            if (Acount == 1 && Bcount == 2) {
                $scope.$parent.ShowAlert("Error", "Quantity and Expected amount should not be zero.", 3000);
            }
            else if (Acount == 1) {
                $scope.$parent.ShowAlert("Error", "Quantity should not be zero.", 3000);
            }
            else if (Bcount == 2) {
                $scope.$parent.ShowAlert("Error", "Expected amount should not be zero.", 3000);
            }
            // }
        }
    }

    $scope.REMOVE_FILTE = function (index, LINE) {
        //$scope.PurchaseRequestSearch.UploadedFiles.splice(index, 1)
        $scope.$parent.DELETE_UPLOAD_ALL($scope.PurchaseRequestSearch.UploadedFiles, LINE, index, 1);
    }
    $scope.PR_VIEW_POP = function (PR_DTLS) {
        $scope.PR_VIEW_DETAILS = PR_DTLS;
        $scope.PR_VIEW_DETAILS.UploadedFiles = [];
        $scope.$parent.GET_UPLOADS($scope.PR_VIEW_DETAILS, 31, PR_DTLS.REQUEST_ID);
        $scope.GET_PURCHASE_REQUEST_PENDING_WITH_USER(PR_DTLS);
        var item = $scope.CURRENCY_LIST.filter(function (x) { return x.CURRENCY_ID == PR_DTLS.PR_CURRENCY_ID })
        if (item.length > 0) {
            $scope.CURRENCY_CODE = angular.copy(item[0].CURRENCY_CODE);
        }

        $('#VIEW_PR').modal('show');
    }
    $(document).on("click", ".ranges ul li", function (event) {
        var a = $(this).attr("data-range-key");
        if (a == "Custom Date" && $scope.loader == 1) {
            $scope.loader = 2;
            var start = moment().startOf('month');
            var end = moment().add(1, 'M').endOf('month');
            //$('#' + ControlName).trigger('show.daterangepicker')
            $scope.$parent.SetUpDateRangeMultiDatePicker('reportrangeInvRecView', start, end, reportrangeCoverView, 1, "left", 'Open');
            $('#reportrangeInvRecView').data('daterangepicker').show();
        }
        else {
            $scope.loader = 1;
        }
    });
    $scope.loader = 1;
    $scope.$parent.DateInputLoad('PO_REQUEST');
});
