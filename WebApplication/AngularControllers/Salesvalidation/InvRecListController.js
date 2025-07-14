app.controller('InvRecListController', function ($scope, $http, $interval, CommService, $cookies, $filter, PrcCommMethods, $location, readFileData, $localStorage) {
    $(".tooltip").remove();
    $scope.Inv_recon_Search = {
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        PAGE_NO_ID: 1,
        PAGE_SIZE_ID: 10,
        UploadedFiles: [],
        INTEGRATION_SYSTEM_ID: 25,
        UPLOADE_TYPE_ID: 29,
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
    if ($scope.BRANCH_LIST.length > 0) {
        $scope.Inv_recon_Search.BRANCH_ID = $scope.BRANCH_LIST[0].BRANCH_ID;
    }
    $scope.LAZY_GET_INV_RECO_UPLOAD = function () {
        $scope.GET_INV_RECO_UPLOAD(1);
    }
    $scope.GET_INV_RECO_UPLOAD = function (FLAG) {
        if (FLAG == undefined) {
            $scope.Inv_recon_Search.PAGE_NO = 1;
            $scope.INV_RECO_UPLOAD_LIST = [];
        }
        $scope.$parent.overlay_loadingNew = 'block';
        var CustmObj = new Object();
        CustmObj.INTEGRATION_SYSTEM_ID = $scope.Inv_recon_Search.INTEGRATION_SYSTEM_ID;

        CustmObj.ENTITY_ID = $scope.Inv_recon_Search.ENTITY_ID;
        CustmObj.BRANCH_ID = $scope.Inv_recon_Search.BRANCH_ID_FILTER;
        CustmObj.UPLOAD_DATE_START = $scope.Inv_recon_Search.UPLOAD_DATE_START;
        CustmObj.UPLOAD_DATE_END = $scope.Inv_recon_Search.UPLOAD_DATE_END;
        CustmObj.FILE_NAME = $scope.Inv_recon_Search.FILE_NAME_FILTER;
        CustmObj.UPLOADED_BY = $scope.Inv_recon_Search.UPLOADED_BY;
        CustmObj.PAGE_NO = $scope.Inv_recon_Search.PAGE_NO;
        CustmObj.PAGE_SIZE = $scope.Inv_recon_Search.PAGE_SIZE;
        PrcCommMethods.CASHUP_API(CustmObj, 'GET_INV_RECO_UPLOAD').then(function (data) {
            if (data.data.Table != undefined) {
                if (data.data.Table.length > 0) {
                    $scope.INV_RECO_UPLOAD_LIST = $scope.INV_RECO_UPLOAD_LIST.concat(data.data.Table);
                    $scope.$parent.overlay_loadingNew = 'none';
                    if (data.data.Table.length < $scope.Inv_recon_Search.PAGE_SIZE) {
                        $scope.ViewGetData = false;
                    }
                    else {
                        $scope.Inv_recon_Search.PAGE_NO = parseInt($scope.Inv_recon_Search.PAGE_NO) + 1;
                        $scope.ViewGetData = true;
                    }
                }
                else {
                    $scope.$parent.overlay_loadingNew = 'none';
                    $scope.ViewGetData = false;
                }
            }
            else {
                $scope.INV_RECO_UPLOAD_LIST = [];
                $scope.ViewGetData = false;
                $scope.$parent.overlay_loadingNew = 'none';
            }
        });
    };
    $scope.GET_INV_RECO_UPLOAD();
    $scope.RESET_RECO_UPLOAD_VIEW = function () {
        $scope.Inv_recon_Search.PAGE_NO_ID = 1;
        $scope.Inv_recon_Search.PAGE_SIZE_ID = 10;
        $scope.Inv_recon_Search.BRANCH_ID_FILTER = null;
        $scope.Inv_recon_Search.FILE_NAME_FILTER = null;
        startDate = moment().startOf('month');//moment().startOf('isoWeek');//moment().subtract(6, 'days');
        endDate = moment().endOf('month'); //moment().subtract(0, 'days');

        $scope.$parent.SetUpDateRangeMultiDatePicker('reportrangeInvRecView', startDate, endDate, reportrangeCoverView);
        $scope.$parent.SetUpDateRangeMultiDatePicker('reportrangeInvRecView', startDate, endDate, reportrangeCoverView);

    }
    $scope.INV_RECO_UPLOAD_DETAILS_TYPE = [{ ID: 1, COLUMN_NAME: 'ACCOUNT', MATCH_COLUMN_NAME: 'ACCOUNT', IS_MANDATORY: true, HEADER_NAME: 'ACCOUNT', FIELD_TYPE_ID: 2, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true, FIELD_MASTER_ID: 1 },
    { ID: 2, COLUMN_NAME: 'CONTACT', MATCH_COLUMN_NAME: 'CONTACT', IS_MANDATORY: true, HEADER_NAME: 'CONTACT', FIELD_TYPE_ID: 2, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true, FIELD_MASTER_ID: 1 },
    { ID: 3, COLUMN_NAME: 'DATE', MATCH_COLUMN_NAME: 'DATE', IS_MANDATORY: true, HEADER_NAME: 'DATE', FIELD_TYPE_ID: 9, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true, FIELD_MASTER_ID: 1 },
    { ID: 5, COLUMN_NAME: 'INVOICE_NUMBER', MATCH_COLUMN_NAME: 'INVOICE_NUMBER', IS_MANDATORY: true, HEADER_NAME: 'INVOICE_NUMBER', FIELD_TYPE_ID: 2, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true, FIELD_MASTER_ID: 1 },
    { ID: 6, COLUMN_NAME: 'NET_AMOUNT', MATCH_COLUMN_NAME: 'NET_AMOUNT', IS_MANDATORY: true, HEADER_NAME: 'NET_AMOUNT', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true, FIELD_MASTER_ID: 1 },

    ];
    $scope.DOWNLOAD_TEMPLATE_INV_REC = function () {
        ModelObj = new Object();
        ModelObj.FILE_NAME = "INV_RECO";
        ModelObj.FILE_PATH = "INV_RECO";
        ModelObj.EXCEL_DATATABLE = $scope.INV_RECO_UPLOAD_DETAILS_TYPE;
        ModelObj.UPLOADE_TYPE_ID = $scope.Inv_recon_Search.UPLOADE_TYPE_ID;
        PrcCommMethods.HR_API(ModelObj, 'DOWNLOAD_OPENXML_UPLOAD').then(function (data) {
            $scope.SERVER_FILE_PATH = '/' + data.data.FOLDER_NAME + data.data.RETURN_FILE_NAME;
            $scope.FILE_NAME = ModelObj.FILE_NAME;
            //window.location.assign($scope.SERVER_FILE_PATH);
            var url = $scope.SERVER_FILE_PATH;
            window.open(url, $scope.FILE_NAME);
        });
    }

    $scope.VIEW_INV_RECO_UPLOAD = function (LINE) {
        $scope.$parent.STEP_PROCESS(8);
        $scope.$parent.INV_REC_PAGE_LOAD(LINE);
    };

    $scope.DISCARD_INV_RECO_UPLOAD = function (INV) {
        var CustmObj = new Object();
        CustmObj.HEADER_ID = INV.ID;
        CustmObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.CASHUP_API(CustmObj, 'DISCARD_INV_RECO_UPLOAD').then(function (data) {
            $scope.GET_INV_RECO_UPLOAD();
        });
    }
    function reportrangeCoverView(startDate, endDate) {
        $scope.Inv_recon_Search.UPLOAD_DATE_START = startDate.format($scope.$parent.Datelocaleformat.format);
        $scope.Inv_recon_Search.UPLOAD_DATE_END = endDate.format($scope.$parent.Datelocaleformat.format);
        $('#reportrangeInvRecView span').html(startDate.format($scope.$parent.Datelocaleformat.format) + ' - ' + endDate.format($scope.$parent.Datelocaleformat.format));
    };
    $scope.NG_PAGE_LOAD = function () {
        startDate = moment().startOf('month');//moment().startOf('isoWeek');//moment().subtract(6, 'days');
        endDate = moment().endOf('month'); //moment().subtract(0, 'days');
        UploadstartDate = moment().subtract(1, 'days');//moment().startOf('isoWeek');//moment().subtract(6, 'days');
        UploadendDate = moment().subtract(1, 'days'); //moment().subtract(0, 'days');
        $scope.$parent.SetUpDateRangeMultiDatePicker('reportrangeInvRecView', startDate, endDate, reportrangeCoverView);
        $('#reportrangeInvRecView span').html(startDate.format($scope.$parent.Datelocaleformat.format) + ' - ' + endDate.format($scope.$parent.Datelocaleformat.format));
    }
    $scope.NG_PAGE_LOAD();
    $scope.$parent.child_scope = $scope;
    $scope.COMMON_CODE_CHANGE();

});