app.controller('InvContactMappController', function ($scope, $http, $interval, CommService, $cookies, $filter, PrcCommMethods, $location, readFileData, $localStorage) {
    $(".tooltip").remove();
    $scope.HIDE_SHOW_HEADER_FILTER = true;
    $scope.Inv_recon_Search = {
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        PAGE_NO_ID: 1,
        PAGE_SIZE_ID: 10,
        UploadedFiles: [],
        INTEGRATION_SYSTEM_ID: 25,
        UPLOADE_TYPE_ID: 29,
        CUSTOM_STEP_NO: 2,
        ENTITY_ID: parseInt($cookies.get("ENTITY_ID")),
        FILTER_STATUS_ID: null,
        FILTER_CONTACT_ALL: 'All',
    }
    $scope.RESET_RECO_UPLOAD = function () {
        $scope.COPY_CODE_ARRY = [];
        $scope.CODE_ARRY = [];
        $scope.INVALID_EXCLE_CELL_COUNT = null;
        $scope.INV_RECO_UPLOAD_DETAILS_LIST = [];
        $scope.DUPLICATE_INVOICE_CONTACT_LIST = [];
        $scope.ERROR_LIST = [];
        $scope.INVALID_EXCLE_CELL_FLAG = false;
        $scope.Inv_recon_Search = {
            PAGE_NO: 1,
            PAGE_SIZE: 10,
            PAGE_NO_ID: 1,
            PAGE_SIZE_ID: 10,
            UploadedFiles: [],
            INTEGRATION_SYSTEM_ID: 25,
            UPLOADE_TYPE_ID: 29
        }
        UploadstartDate = moment().subtract(1, 'days');//moment().startOf('isoWeek');//moment().subtract(6, 'days');
        UploadendDate = moment().subtract(1, 'days'); //moment().subtract(0, 'days');
        $scope.$parent.SetUpDateRangeMultiDatePicker('reportrange', UploadstartDate, UploadendDate, reportrange);
        $('#reportrange span').html(UploadstartDate.format($scope.$parent.Datelocaleformat.format) + ' - ' + UploadendDate.format($scope.$parent.Datelocaleformat.format));
        angular.element("input[id=Inv_recorduploadExcel1]").val(null);
    }
    $scope.BRANCH_LIST = JSON.parse($localStorage.BRANCH_LOGIN_LIST);
    $scope.BRANCH_LIST_VIEW = angular.copy($scope.BRANCH_LIST);
    if ($scope.BRANCH_LIST.length > 0) { $scope.Inv_recon_Search.BRANCH_ID = $scope.BRANCH_LIST[0].BRANCH_ID;}
    $scope.HEADER_ID = getUrlParameter('HEADER_ID', $location.absUrl());

    $scope.INV_RECO_CONTACT_MAPPING_LIST = [];
    $scope.GET_INV_RECO_CONTACT_MAPPING = function (HEADER_DTLS) {
        var CustmObj = new Object();
        CustmObj.HEADER_ID = HEADER_DTLS.ID;
        PrcCommMethods.CASHUP_API(CustmObj, 'GET_INV_RECO_CONTACT_MAPPING').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.INV_RECO_CONTACT_MAPPING_LIST = data.data.Table;
            }
        });
    }
    $scope.INV_RECO_RECONCILE_HEADER_DTLS = {}

    $scope.INV_RECO_UPLOAD_HEADER_BY_ID_LIST = [];
    $scope.GET_INV_RECO_UPLOAD_HEADER_BY_ID = function (HEADER_ID) {
        var CustmObj = new Object();
        CustmObj.HEADER_ID = HEADER_ID;
        PrcCommMethods.CASHUP_API(CustmObj, 'GET_INV_RECO_UPLOAD_HEADER_BY_ID').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.INV_RECO_UPLOAD_HEADER_BY_ID_LIST = (data.data.Table);
                if (data.data.Table.length > 0) {
                    $scope.Inv_recon_Search.STEP_NO = data.data.Table[0].STEP_NO;
                    $scope.Inv_recon_Search.CREATED_DATE = data.data.Table[0].CREATED_DATE;
                    $scope.Inv_recon_Search.EMAIL = data.data.Table[0].EMAIL;
                    $scope.Inv_recon_Search.ENTITY_NAME = data.data.Table[0].ENTITY_NAME;
                    $scope.Inv_recon_Search.NAME = data.data.Table[0].NAME;
                    $scope.Inv_recon_Search.BRANCH_NAME = data.data.Table[0].BRANCH_NAME;
                    $scope.Inv_recon_Search.FROM_DATE = data.data.Table[0].FROM_DATE;
                    $scope.Inv_recon_Search.TO_DATE = data.data.Table[0].TO_DATE;
                    $scope.Inv_recon_Search.RECORD_COUNT = data.data.Table[0].RECORD_COUNT;
                    $scope.$parent.STEP_PROCESS($scope.Inv_recon_Search.STEP_NO);
                    $scope.Inv_recon_Search.STATUS_ID = data.data.Table[0].STATUS_ID;
                    $scope.Inv_recon_Search.STATUS_NAME = data.data.Table[0].STATUS_NAME;
                    $scope.Inv_recon_Search.BRANCH_ID = (data.data.Table[0].BRANCH_ID);
                    data.data.Table[0].ID = HEADER_ID;
                    $scope.GET_INV_RECO_CONTACT_MAPPING(data.data.Table[0]);
                }
            }
        });
    };
    if ($scope.HEADER_ID != undefined) {
        $scope.GET_INV_RECO_UPLOAD_HEADER_BY_ID($scope.HEADER_ID);
    }
    else {
        $scope.Inv_recon_Search.STEP_NO = 1;
        $scope.$parent.STEP_PROCESS(1);
    }

    $scope.contactfilter = function (item) {
        return $scope.Inv_recon_Search.IS_SHOW_UN_MAP ? item.CONTACT_ID == null : item;
    }
    $scope.XERO_CONTACTS_LIST = [];
    $scope.GET_XERO_CONTACTS = function (SELECTED_CONTACT, FLAG) {
        if (FLAG == undefined) {
            $scope.Inv_recon_Search.IS_MAP_RECORD = false;
            $scope.Inv_recon_Search.IS_MAP = false;
            $scope.Inv_recon_Search.CONTACT_NAME = "";
            $scope.SELECTED_CONTACT = "";
            $scope.SELECTED_CONTACT = SELECTED_CONTACT;
        }
        if ($scope.XERO_CONTACTS_LIST.length == 0) {
            var CustmObj = new Object();
            CustmObj.ENTITY_ID = $scope.Inv_recon_Search.ENTITY_ID;
            CustmObj.BRANCH_ID = $scope.Inv_recon_Search.BRANCH_ID;
            CustmObj.SUPPLIER_NAME = "";
            CustmObj.PAGE_NO = 0;
            CustmObj.PAGE_SIZE = 0;
            PrcCommMethods.CASHUP_API(CustmObj, 'GET_XERO_CONTACTS').then(function (data) {
                if (data.data.Table.length > 0) {
                    if (FLAG == undefined) {
                        $('#mismatch').modal('show')
                    }
                    $scope.XERO_CONTACTS_LIST = data.data.Table;

                    $('#AddCustomScroll_REQ').find('.dropdown-menu').addClass('custom-scrollbar');
                    $('#AddCustomScroll_SHD').find('.dropdown-menu').addClass('custom-scrollbar');
                }
            });
        }
        else {
            if (FLAG == undefined) {
                $('#mismatch').modal('show')
            }
        }
    }
    //1 ext 0 miss
    $scope.INS_UPD_INV_RECO_CONTACT_MAPPING = function () {
        var CustmObj = new Object();
        CustmObj.TABLE_ID = $scope.Inv_recon_Search.TABLE_ID;
        CustmObj.HEADER_ID = $scope.HEADER_ID;
        CustmObj.ENTITY_ID = $scope.Inv_recon_Search.ENTITY_ID;
        CustmObj.BRANCH_ID = $scope.Inv_recon_Search.BRANCH_ID;
        CustmObj.CONTACT_NAME = $scope.SELECTED_CONTACT.CONTACT;/// take form grid contact name 
        var supplierdtls = $scope.XERO_CONTACTS_LIST.filter(function (x) { return x.CONTACT_NAME == $scope.Inv_recon_Search.CONTACT_NAME });
        if (supplierdtls.length > 0) {
            CustmObj.XERO_CONTACT_ID = supplierdtls[0].XERO_CONTACT_ID;
        }
        CustmObj.INTEGRATION_SYSTEM_ID = $scope.Inv_recon_Search.INTEGRATION_SYSTEM_ID;
        CustmObj.USER_ID = parseInt($cookies.get("USERID"));
        CustmObj.DELETE_FLAG = 0;//--1 FOR DELETE ELSE 0
        CustmObj.MAP_CONTACT = $scope.Inv_recon_Search.IS_MAP_RECORD ? 1 : 0;
        CustmObj.LINE_TABLE_ID = $scope.SELECTED_CONTACT.LINE_TABLE_ID;
        if (supplierdtls.length > 0) {
            PrcCommMethods.CASHUP_API(CustmObj, 'INS_UPD_INV_RECO_CONTACT_MAPPING').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.Inv_recon_Search.STEP_NO = data.data.Table[0].STEP_NO;
                    if ($scope.Inv_recon_Search.STEP_NO == 2) {
                        data.data.Table[0].ID = $scope.HEADER_ID;
                        $scope.GET_INV_RECO_CONTACT_MAPPING(data.data.Table[0]);
                    }
                    else if ($scope.Inv_recon_Search.STEP_NO == 3 || $scope.Inv_recon_Search.STEP_NO == 4) {
                        data.data.Table[0].ID = $scope.HEADER_ID;
                        $scope.Inv_recon_Search.STATUS_ID = data.data.Table[0].STATUS_ID;
                        var obj = new Object();
                        obj.STEP_NO = 3;
                        obj.ID = $scope.HEADER_ID;
                        $scope.$parent.STEP_PROCESS($scope.Inv_recon_Search.STEP_NO);
                        $scope.$parent.INV_REC_PAGE_LOAD(obj);
                    }
                    $('#mismatch').modal('hide');
                }
            });
        }
        else {
            $scope.$parent.ShowAlert('Error', "Invalid Supplier", 5000);
        }
    }
    $scope.$on('ngRepeatFinishedRender', function (ngRepeatFinishedEvent) {
        $scope.COMMON_CODE_CHANGE();
    });

    $scope.HIDE_SHOW_FILTER_FY = function () {
        $scope.HIDE_SHOW_HEADER_FILTER = !$scope.HIDE_SHOW_HEADER_FILTER;
    }
    $scope.INV_UPLOAD_FILE_DETAILS_FY = function (INV) {
        $location.path('Inv_Upload_File').search({ HEADER_ID: INV.ID })
    }
    $scope.$parent.child_scope = $scope;
    $scope.COMMON_CODE_CHANGE();
});
