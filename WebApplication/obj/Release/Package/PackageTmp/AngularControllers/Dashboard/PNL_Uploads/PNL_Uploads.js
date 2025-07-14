app.controller('PNLDshBtUploadController', function ($scope, $http, $interval, CommService, $cookies, $filter, PrcCommMethods, $location, readFileData, $localStorage) {
    $(".tooltip").remove();
    $scope.PNL_UPLOAD_DETAILS_TYPE = [{ ID: 1, COLUMN_NAME: 'XERO_ACCOUNT_CODE', MATCH_COLUMN_NAME: 'XERO_ACCOUNT_CODE', IS_MANDATORY: true, HEADER_NAME: 'XERO_ACCOUNT_CODE', FIELD_TYPE_ID: 2, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true, FIELD_MASTER_ID: 1 },
    { ID: 2, COLUMN_NAME: 'PNL_WEEK_AMOUNT', MATCH_COLUMN_NAME: 'PNL_WEEK_AMOUNT', IS_MANDATORY: true, HEADER_NAME: 'PNL_WEEK_AMOUNT', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true, FIELD_MASTER_ID: 1 },
    { ID: 3, COLUMN_NAME: 'PNL_BUDGET_AMOUNT', MATCH_COLUMN_NAME: 'PNL_BUDGET_AMOUNT', IS_MANDATORY: true, HEADER_NAME: 'PNL_BUDGET_AMOUNT', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true, FIELD_MASTER_ID: 1 },
    ];
    $scope.INTEGRATION_SYSTEM_LIST = [{ INTEGRATION_SYSTEM_ID: 25, NAME: 'Demo Test' }];
    $scope.START_DAY_OF_WEEK = 1;
    $scope.PNL_Upload_Search = {
        PAGE_NO: 1,
        PAGE_NO_LINE: 1,
        PAGE_SIZE: 10,
        UploadedFiles: [],
        INTEGRATION_SYSTEM_ID: 25,
        BRANCH_ID: null,
        FILTER_BRANCH_ID: null,
        UPLOADE_TYPE_ID: 30,
        ENTITY_ID: parseInt($cookies.get("ENTITY_ID")),
        ENTITY_NAME: parseInt($cookies.get("ENTITY_NAME")),
    }

    $scope.RESET_PNL_UPLOAD = function () {
        $scope.COPY_CODE_ARRY = [];
        $scope.CODE_ARRY = [];
        $scope.INVALID_EXCLE_CELL_COUNT = null;
        $scope.INV_RECO_UPLOAD_DETAILS_LIST = [];
        $scope.DUPLICATE_INVOICE_CONTACT_LIST = [];
        $scope.ERROR_LIST = [];
        $scope.INVALID_EXCLE_CELL_FLAG = false;
        $scope.PNL_Upload_Search = {
            PAGE_NO: 1,
            PAGE_SIZE: 10,
            UploadedFiles: [],
            INTEGRATION_SYSTEM_ID: 25,
            UPLOADE_TYPE_ID: 29,
            ENTITY_ID: parseInt($cookies.get("ENTITY_ID")),
            ENTITY_NAME: parseInt($cookies.get("ENTITY_NAME")),
        }
        UploadstartDate = moment().subtract(1, 'days');//moment().startOf('isoWeek');//moment().subtract(6, 'days');
        UploadendDate = moment().subtract(1, 'days'); //moment().subtract(0, 'days');
        $scope.$parent.SetUpDateRangeMultiDatePicker('reportrange', UploadstartDate, UploadendDate, reportrange);
        $('#reportrange span').html(UploadstartDate.format($scope.$parent.Datelocaleformat.format) + ' - ' + UploadendDate.format($scope.$parent.Datelocaleformat.format));
        angular.element("input[id=Inv_recorduploadExcel1]").val(null);
        if ($scope.BRANCH_LIST.length > 0) {
            $scope.PNL_Upload_Search.BRANCH_ID = $scope.BRANCH_LIST[0].BRANCH_ID;
            $scope.PNL_Upload_Search.FILTER_BRANCH_ID = $scope.BRANCH_LIST[0].BRANCH_ID;
        };
    }
    function addDays(date, days) {
        date.setDate(date.getDate() + days);
        return date;
    }
    function set_week_picker(date, FLAG) {
        $scope.start_date = new Date(date.getFullYear(), date.getMonth(), parseInt($scope.START_DAY_OF_WEEK) + date.getDate() - date.getDay());//new Date(date.getFullYear(), date.getMonth(), 1 + date.getDate() - date.getDay());
        $scope.end_date = new Date(date.getFullYear(), date.getMonth(), parseInt($scope.START_DAY_OF_WEEK) + date.getDate() - date.getDay() + 6); //new Date(date.getFullYear(), date.getMonth(), $scope.start_date.getDate() + (6));
        // $scope.end_date = new Date(date.getFullYear(), date.getMonth(), parseInt($scope.START_DAY_OF_WEEK) + date.getDate() - date.getDay() + 6);

        if ($scope.start_date > date) {
            if (FLAG == 1) {
                var increasedays = $scope.start_date.getDate() - date.getDate();
                $scope.start_date = new Date(date.getFullYear(), date.getMonth(), $scope.start_date.getDate() - ((7 - increasedays) + increasedays));
                $scope.end_date = new Date($scope.start_date).addDays(6);
            }
        }
        var StartDD = $scope.start_date.getDate();
        var Startmm = $scope.start_date.getMonth() + 1;
        var start_dateyyyy = $scope.start_date.getFullYear();

        var EndDD = $scope.end_date.getDate();
        var Endmm = $scope.end_date.getMonth() + 1;
        var Endyyyy = $scope.end_date.getFullYear();

        if (StartDD < 10) { StartDD = '0' + StartDD; }
        if (Startmm < 10) { Startmm = '0' + Startmm; }
        var start_dateddmmyy = StartDD + '/' + Startmm + '/' + start_dateyyyy;

        if (EndDD < 10) { EndDD = '0' + EndDD; }
        if (Endmm < 10) { Endmm = '0' + Endmm; }
        var end_dateddmmyy = EndDD + '/' + Endmm + '/' + Endyyyy;

        $scope.weekpicker.datepicker('update', $scope.start_date); //(($scope.start_date.getMonth() + 1) + '/' + $scope.start_date.getDate() + '/' + $scope.start_date.getFullYear() + ' - ' + ($scope.end_date.getMonth() + 1) + '/' + $scope.end_date.getDate() + '/' + $scope.end_date.getFullYear()));
        $scope.weekpicker.val(start_dateddmmyy + ' - ' + end_dateddmmyy);
        //$scope.weekpicker.val(($scope.start_date.getMonth() + 1) + '/' + $scope.start_date.getDate() + '/' + $scope.start_date.getFullYear() + ' - ' + ($scope.end_date.getMonth() + 1) + '/' + $scope.end_date.getDate() + '/' + $scope.end_date.getFullYear());
        $scope.PNL_Upload_Search.PNL_WEEK_START = $scope.start_date;
        $scope.PNL_Upload_Search.PNL_WEEK_END = $scope.end_date;
    };
    function set_week_picker_filter(date, FLAG) {
        $scope.start_date_filter = new Date(date.getFullYear(), date.getMonth(), parseInt($scope.START_DAY_OF_WEEK) + date.getDate() - date.getDay());//new Date(date.getFullYear(), date.getMonth(), 1 + date.getDate() - date.getDay());
        $scope.end_date_filter = new Date(date.getFullYear(), date.getMonth(), parseInt($scope.START_DAY_OF_WEEK) + date.getDate() - date.getDay() + 6); //new Date(date.getFullYear(), date.getMonth(), $scope.start_date.getDate() + (6));
        // $scope.end_date = new Date(date.getFullYear(), date.getMonth(), parseInt($scope.START_DAY_OF_WEEK) + date.getDate() - date.getDay() + 6);

        if ($scope.start_date_filter > date) {
            if (FLAG == 1) {
                var increasedays = $scope.start_date_filter.getDate() - date.getDate();
                $scope.start_date_filter = new Date(date.getFullYear(), date.getMonth(), $scope.start_date_filter.getDate() - ((7 - increasedays) + increasedays));
                $scope.end_date_filter = new Date($scope.start_date_filter).addDays(6);
            }
        }
        var StartDD = $scope.start_date_filter.getDate();
        var Startmm = $scope.start_date_filter.getMonth() + 1;
        var start_dateyyyy = $scope.start_date_filter.getFullYear();

        var EndDD = $scope.end_date.getDate();
        var Endmm = $scope.end_date.getMonth() + 1;
        var Endyyyy = $scope.end_date.getFullYear();

        if (StartDD < 10) { StartDD = '0' + StartDD; }
        if (Startmm < 10) { Startmm = '0' + Startmm; }
        var start_dateddmmyy = StartDD + '/' + Startmm + '/' + start_dateyyyy;

        if (EndDD < 10) { EndDD = '0' + EndDD; }
        if (Endmm < 10) { Endmm = '0' + Endmm; }
        var end_dateddmmyy = EndDD + '/' + Endmm + '/' + Endyyyy;

        $scope.filterweekpicker.datepicker('update', $scope.start_date_filter); //(($scope.start_date.getMonth() + 1) + '/' + $scope.start_date.getDate() + '/' + $scope.start_date.getFullYear() + ' - ' + ($scope.end_date.getMonth() + 1) + '/' + $scope.end_date.getDate() + '/' + $scope.end_date.getFullYear()));
        $scope.filterweekpicker.val(start_dateddmmyy + ' - ' + end_dateddmmyy);
        //$scope.weekpicker.val(($scope.start_date.getMonth() + 1) + '/' + $scope.start_date.getDate() + '/' + $scope.start_date.getFullYear() + ' - ' + ($scope.end_date.getMonth() + 1) + '/' + $scope.end_date.getDate() + '/' + $scope.end_date.getFullYear());
        $scope.PNL_Upload_Search.FILTER_WEEK_START = $scope.start_date_filter;
        $scope.PNL_Upload_Search.FILTER_WEEK_END = $scope.end_date_filter;
        if (FLAG == 1) {
            $scope.GET_PNL_NOMINAL_AMOUNT_BUDGET_HEADER(1, 1, false);
        };
    };
    $scope.GET_UTC_TIME = function (FLAG) {
        var ModelObj = new Object();
        ModelObj.TIMEZONE_OFFSET = $cookies.get("TIMEZONE_OFFSET");
        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        ModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
        PrcCommMethods.HR_API(ModelObj, 'GET_UTC_TIME').then(function (data) {
            $scope.DATE_WEEK_PICKER_DRDA(new Date(data.data));
            if (FLAG != 1) {
                $scope.DATE_WEEK_PICKER_FILTER(new Date(data.data));
            }
        });
    };
    $scope.DATE_WEEK_PICKER_DRDA = function (date) {
        $scope.weekpicker = $('.week-picker');
        $scope.weekpicker.datepicker({
            weekStart: parseInt($scope.START_DAY_OF_WEEK),
            autoclose: true,
            forceParse: false,
            todayHighlight: true,
            container: '#week-picker-wrapper',
            maxDate: 'today'
        }).on("changeDate", function (e) {
            set_week_picker(e.date);
        });
        $('.week-prev').on('click', function () {
            var prev = new Date($scope.start_date.getTime());
            prev.setDate(prev.getDate() - 6);
            set_week_picker(prev);
        });
        $('.week-next').on('click', function () {
            var next = new Date($scope.end_date.getTime());
            next.setDate(next.getDate() + 1);
            set_week_picker(next);
        });
        set_week_picker(date, 1);
    };
    $scope.DATE_WEEK_PICKER_FILTER = function (date) {
        $scope.filterweekpicker = $('.week-filter-picker');
        $scope.filterweekpicker.datepicker({
            weekStart: parseInt($scope.START_DAY_OF_WEEK),
            autoclose: true,
            forceParse: false,
            todayHighlight: true,
            container: '#week-filter-picker-wrapper',
            maxDate: 'today'
        }).on("changeDate", function (e) {
            set_week_picker_filter(e.date);
        });
        $('.week-filter-prev').on('click', function () {
            var prev = new Date($scope.start_date.getTime());
            prev.setDate(prev.getDate() - 6);
            set_week_picker_filter(prev);
        });
        $('.week-filter-next').on('click', function () {
            var next = new Date($scope.end_date.getTime());
            next.setDate(next.getDate() + 1);
            set_week_picker_filter(next);
        });
        set_week_picker_filter(date, 1);
    };

    $scope.ENTITY_CHANGE_FY = function (FLAG) {
        var RevModelObj = new Object();
        RevModelObj.ENTITY_ID = $scope.PNL_Upload_Search.ENTITY_ID;
        RevModelObj.USER_ID = parseInt($cookies.get("USERID"));
        RevModelObj.MODULE_ID = 0;
        PrcCommMethods.DASHBOARD_MODULES_API(RevModelObj, 'GET_BRANCH_LIST_FOR_DASHBOARD').then(function (data) {
            $scope.BRANCH_LIST = data.data.Table;
            if ($scope.BRANCH_LIST.length > 0) {
                $scope.PNL_Upload_Search.BRANCH_ID = parseInt($scope.BRANCH_LIST[0].BRANCH_ID);
                $scope.PNL_Upload_Search.FILTER_BRANCH_ID = $scope.BRANCH_LIST[0].BRANCH_ID;
            };
            if (FLAG == 1) {
                $scope.GET_UTC_TIME();
            }
            else {
                $scope.GET_TAKINGS_REVIEW();
            };
        });
    };
    $scope.ENTITY_CHANGE_FY(1);
    $scope.PNL_NOMINAL_AMOUNT_BUDGET_HEADER_LIST = [];
    $scope.GET_PNL_NOMINAL_AMOUNT_BUDGET_HEADER_LAZY_LOAD = function () {
        $scope.GET_PNL_NOMINAL_AMOUNT_BUDGET_HEADER(2, 1, 1);
    }


    $scope.GET_PNL_NOMINAL_AMOUNT_BUDGET_HEADER = function (FLAG, SORT_COLUMN_NO, SORT_ORDER_NO_ASCDESC) {
        if (SORT_COLUMN_NO != 0) {
            $scope.SORT_COLUMN_NO = SORT_COLUMN_NO;
            $scope.SORT_ORDER_NO_ASCDESC = SORT_ORDER_NO_ASCDESC;
            if (FLAG == 1) {
                $scope.PNL_NOMINAL_AMOUNT_BUDGET_HEADER_LIST = [];
                $scope.PNL_Upload_Search.PAGE_NO = 1;
            }
            var POSModelObj = new Object();
            POSModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            POSModelObj.USER_ID = parseInt($cookies.get("USERID"));
            POSModelObj.BRANCH_ID = $scope.PNL_Upload_Search.FILTER_BRANCH_ID;
            POSModelObj.FILE_NAME = $scope.PNL_Upload_Search.FILTER_FILE_NAME;
            POSModelObj.PNL_TITLE = $scope.PNL_Upload_Search.FILTER_PNL_TITLE;
            POSModelObj.PNL_WEEK_START = new Date($scope.PNL_Upload_Search.FILTER_WEEK_START).toDateString();
            POSModelObj.PNL_WEEK_END = new Date($scope.PNL_Upload_Search.FILTER_WEEK_END).toDateString();
            POSModelObj.PAGE_NO = $scope.PNL_Upload_Search.PAGE_NO;
            POSModelObj.PAGE_SIZE = $scope.PNL_Upload_Search.PAGE_SIZE;
            if (FLAG == 1) { $scope.POSModelObj_Dir_Copy = angular.copy(POSModelObj); }
            else {
                $scope.POSModelObj_Dir_Copy.PAGE_NO = FLAG == undefined ? angular.copy($scope.PNL_Upload_Search.PAGE_NO) : $scope.POSModelObj_Dir_Copy.PAGE_NO;
            }
            PrcCommMethods.DASHBOARD_MODULES_API(FLAG == undefined ? $scope.POSModelObj_Dir_Copy : POSModelObj, 'GET_PNL_NOMINAL_AMOUNT_BUDGET_HEADER').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.PNL_NOMINAL_AMOUNT_BUDGET_HEADER_LIST = $scope.PNL_NOMINAL_AMOUNT_BUDGET_HEADER_LIST.concat(data.data.Table);
                    if (data.data.Table.length < $scope.PNL_Upload_Search.PAGE_SIZE) {
                        $scope.GetData = false;
                    }
                    else {
                        $scope.PNL_Upload_Search.PAGE_NO = parseInt($scope.PNL_Upload_Search.PAGE_NO) + 1;
                        $scope.GetData = true;
                    }
                }
                else {
                    if ($scope.PNL_NOMINAL_AMOUNT_BUDGET_HEADER_LIST.length == 0) {
                    }
                    $scope.GetData = false;
                }
            });
        }
    };
    $scope.PNL_NOMINAL_AMOUNT_BUDGET_LINE = [];
    $scope.GET_PNL_NOMINAL_AMOUNT_BUDGET_LINE_LAZY_LOAD = function () {
        $scope.GET_PNL_NOMINAL_AMOUNT_BUDGET_LINE($scope.SELECTED_LINE, 2);
    }
    $scope.DELETE_PNL_NOMINAL_AMOUNT_BUDGET_HEADER = function () {
        if (confirm('Are you sure you want to delete?')) {
            var POSModelObj = new Object();
            POSModelObj.HEADER_ID = LINE.ID;
            PrcCommMethods.DASHBOARD_MODULES_API(OSModelObj, 'DELETE_PNL_NOMINAL_AMOUNT_BUDGET_HEADER').then(function (data) {
                if (data.data == 1) {
                    $scope.$parent.ShowAlert('Success', "Deleted Successfully", 30000);
                    $scope.GET_PNL_NOMINAL_AMOUNT_BUDGET_HEADER(1, 1, 1);
                }
                if (data.data == 0) {
                    $scope.$parent.ShowAlert('Error', $scope.SOMETHINGWENTWRONG, 30000);
                }
            });
        }
    }
    $scope.GET_PNL_NOMINAL_AMOUNT_BUDGET_LINE = function (LINE, FLAG) {
        $scope.SELECTED_LINE = LINE
        if (FLAG == 1) {
            $scope.PNL_NOMINAL_AMOUNT_BUDGET_LINE = [];
            $scope.PNL_Upload_Search.PAGE_NO_LINE = 1;
        }
        var POSModelObj = new Object();
        POSModelObj.HEADER_ID = LINE.ID;
        POSModelObj.PAGE_NO = $scope.PNL_Upload_Search.PAGE_NO_LINE;
        POSModelObj.PAGE_SIZE = $scope.PNL_Upload_Search.PAGE_SIZE;
        if (FLAG == 1) { $scope.POSModelObj_Dir_Copy = angular.copy(POSModelObj); }
        else {
            $scope.POSModelObj_Dir_Copy.PAGE_NO_LINE = FLAG == undefined ? angular.copy($scope.PNL_Upload_Search.PAGE_NO_LINE) : $scope.POSModelObj_Dir_Copy.PAGE_NO_LINE;
        }
        PrcCommMethods.DASHBOARD_MODULES_API(FLAG == undefined ? $scope.POSModelObj_Dir_Copy : POSModelObj, 'GET_PNL_NOMINAL_AMOUNT_BUDGET_LINE').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.PNL_NOMINAL_AMOUNT_BUDGET_LINE = $scope.PNL_NOMINAL_AMOUNT_BUDGET_LINE.concat(data.data.Table);

                if (data.data.Table.length < $scope.PNL_Upload_Search.PAGE_SIZE) {
                    $scope.GetLineData = false;
                }
                else {
                    $scope.PNL_Upload_Search.PAGE_NO_LINE = parseInt($scope.PNL_Upload_Search.PAGE_NO_LINE) + 1;
                    $scope.GetLineData = true;
                }
            }
            else {
                if ($scope.PNL_NOMINAL_AMOUNT_BUDGET_LINE.length == 0) {
                }
                $scope.GetLineData = false;
            }
            $('#VIEW_LINE').modal('show');
        });

    }
    $scope.RESET_FILTER = function () {
        $scope.PNL_Upload_Search.FILTER_PNL_TITLE = "";
        $scope.PNL_Upload_Search.FILTER_FILE_NAME = "";
        $scope.PNL_Upload_Search.FILTER_BRANCH_ID = null;
        $scope.PNL_Upload_Search.PNL_COGS = "";
        $scope.PNL_Upload_Search.PNL_WAGE = "";
        $scope.PNL_Upload_Search.PNL_COST = "";
    }
    $scope.RESET_INS = function () {
        $scope.PNL_Upload_Search.PNL_TITLE = "";
        $scope.PNL_Upload_Search.UploadedFiles = [];
        $scope.PNL_Upload_Search.FILTER_FILE_NAME = "";
        $scope.PNL_Upload_Search.PNL_COGS = "";
        $scope.PNL_Upload_Search.PNL_WAGE = "";
        $scope.PNL_Upload_Search.PNL_COST = "";
        $scope.PNL_Upload_Search.PNL_BASIS = "";
        $scope.RESET_FILE();
        $scope.PNLForm.submitted = false;
    }

    $scope.INS_PNL_NOMINAL_AMOUNT_BUDGET_HEADER = function () {
        $scope.PNLForm.submitted = true;
        if ($scope.PNLForm.$valid && $scope.INV_RECO_UPLOAD_DETAILS_LIST.length > 0) {
            var CustmObj = new Object();
            CustmObj.PNL_TITLE = $scope.PNL_Upload_Search.PNL_TITLE;
            CustmObj.PNL_WEEK_START = new Date($scope.PNL_Upload_Search.PNL_WEEK_START).toDateString();
            CustmObj.PNL_WEEK_END = new Date($scope.PNL_Upload_Search.PNL_WEEK_END).toDateString();
            CustmObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            CustmObj.BRANCH_ID = $scope.PNL_Upload_Search.BRANCH_ID;
            CustmObj.FILE_PATH = $scope.PNL_Upload_Search.UploadedFiles[0].ORIGINAL_FILE_NAME + ":;:" + $scope.PNL_Upload_Search.UploadedFiles[0].FILE_PATH + $scope.PNL_Upload_Search.UploadedFiles[0].SERVER_FILE_NAME;
            CustmObj.USER_ID = parseInt($cookies.get("USERID"));
            CustmObj.PNL_BASIS = $scope.PNL_Upload_Search.PNL_BASIS;
            CustmObj.PNL_COGS = $scope.PNL_Upload_Search.PNL_COGS;
            CustmObj.PNL_WAGE = $scope.PNL_Upload_Search.PNL_WAGE;
            CustmObj.PNL_COST = $scope.PNL_Upload_Search.PNL_COST;
            CustmObj.PNL_NOMINAL_AMOUNT_BUDGET_LINE = [];
            angular.forEach($scope.INV_RECO_UPLOAD_DETAILS_LIST, function (val) {
                var obj = new Object();
                obj.XERO_ACCOUNT_CODE = val.XERO_ACCOUNT_CODE;
                obj.PNL_WEEK_AMOUNT = val.PNL_WEEK_AMOUNT;
                obj.PNL_BUDGET_AMOUNT = val.PNL_BUDGET_AMOUNT;
                CustmObj.PNL_NOMINAL_AMOUNT_BUDGET_LINE.push(obj);
            })
            PrcCommMethods.DASHBOARD_MODULES_API(CustmObj, 'INS_PNL_NOMINAL_AMOUNT_BUDGET_HEADER').then(function (data) {
                if (data.data == 1) {
                    $scope.GET_PNL_NOMINAL_AMOUNT_BUDGET_HEADER(1, 1, 1);
                    $scope.ShowAlert('Success', 'Save Successfully', 5000);
                    $scope.RESET_INS();
                    $('#PNLUpload').modal('hide');

                }
                if (data.data == 0) {
                    $scope.ShowAlert('Error', $scope.$parent.SOMETHINGWENTWRONG, 5000);
                }
            });
        }
    }

    $scope.RESET_FILE = function () {
        angular.element("input[id=Inv_recorduploadExcel1]").val(null);
        $scope.INV_RECO_UPLOAD_DETAILS_LIST = [];
        $scope.PNL_Upload_Search.UploadedFiles = [];
    }
    $scope.RESET_RECO_UPLOAD_VIEW = function () {
        $scope.PNL_Upload_Search.PAGE_NO_ID = 1;
        $scope.PNL_Upload_Search.PAGE_SIZE_ID = 10;
        $scope.PNL_Upload_Search.BRANCH_ID_FILTER = null;
        $scope.PNL_Upload_Search.FILE_NAME_FILTER = null;
        startDate = moment().startOf('month');//moment().startOf('isoWeek');//moment().subtract(6, 'days');
        endDate = moment().endOf('month'); //moment().subtract(0, 'days');

        $scope.$parent.SetUpDateRangeMultiDatePicker('reportrangeInvRecView', startDate, endDate, reportrangeCoverView);
        $scope.$parent.SetUpDateRangeMultiDatePicker('reportrangeInvRecView', startDate, endDate, reportrangeCoverView);

    }
    $scope.DOWNLOAD_TEMPLATE_PNL = function () {
        ModelObj = new Object();
        ModelObj.FILE_NAME = "PNL_UPLOAD";
        ModelObj.FILE_PATH = "PNL_UPLOAD";
        ModelObj.EXCEL_DATATABLE = $scope.PNL_UPLOAD_DETAILS_TYPE;
        ModelObj.UPLOADE_TYPE_ID = $scope.PNL_Upload_Search.UPLOADE_TYPE_ID;
        PrcCommMethods.HR_API(ModelObj, 'DOWNLOAD_OPENXML_UPLOAD').then(function (data) {
            $scope.SERVER_FILE_PATH = '/' + data.data.FOLDER_NAME + data.data.RETURN_FILE_NAME;
            $scope.FILE_NAME = ModelObj.FILE_NAME;
            //window.location.assign($scope.SERVER_FILE_PATH);
            var url = $scope.SERVER_FILE_PATH;
            window.open(url, $scope.FILE_NAME);
        });
    }
    $scope.SubmiteUpload = true;
    $scope.INV_RECO_UPLOAD_DETAILS_LIST = [];

    $scope.EXCEL_PNL_VALIDATE = function () {
        $scope.$parent.overlay_loadingNew = 'block';
        $scope.INVALID_EXCLE_CELL_FLAG = false;
        $scope.SubmiteUpload = true;
        $scope.COPY_CODE_ARRY = [];
        $scope.CODE_ARRY = [];
        $scope.INVALID_EXCLE_CELL_COUNT = null;
        $scope.INV_RECO_UPLOAD_DETAILS_LIST = [];
        $scope.INVALID_INVOICE_CONTACT_LIST = [];
        $scope.ERROR_LIST = [];
        if ($scope.PNL_Upload_Search.UploadedFiles != undefined && $scope.PNL_Upload_Search.UploadedFiles.length > 0 || document.getElementById('Inv_recorduploadExcel1').value != null && document.getElementById('Inv_recorduploadExcel1').value != '') {
            ModelObj = new Object();
            ModelObj.UPLOAD_TYPE_ID = 1;
            ModelObj.SERVER_FILE_NAME = $scope.PNL_Upload_Search.UploadedFiles[0].SERVER_FILE_NAME;
            ModelObj.ORIGINAL_FILE_NAME = $scope.PNL_Upload_Search.UploadedFiles[0].ORIGINAL_FILE_NAME;
            ModelObj.FILE_PATH = $scope.PNL_Upload_Search.UploadedFiles[0].FILE_PATH + $scope.PNL_Upload_Search.UploadedFiles[0].SERVER_FILE_NAME;
            ModelObj.DATETIME_FORMAT_CULTURE = ["MM/dd/yyyy hh:mm:ss tt", "M/d/yyyy hh:mm:ss tt", "MM/dd/yyyy", "M/d/yyyy"];
            ModelObj.LANGUAGE_SYMBOL = $scope.$parent.LANGUAGE_SYMBOL;
            ModelObj.FROM_DATE = $scope.PNL_Upload_Search.FROM_DATE;
            ModelObj.TO_DATE = $scope.PNL_Upload_Search.TO_DATE;
            ModelObj.EXCEL_DATATABLE = $scope.PNL_UPLOAD_DETAILS_TYPE;
            PrcCommMethods.DASHBOARD_MODULES_API(ModelObj, 'EXCEL_PNL_VALIDATE').then(function (data) {
                $scope.INV_RECO_UPLOAD_DETAILS_LIST = [];
                $scope.submitted = true;
                $scope.INVALID_EXCLE_CELL_COUNT = null;
                $scope.ERROR_LIST = data.data.errorlogobj;
                if ($scope.ERROR_LIST.length == 0) {
                    if (data.data.IS_VALID_COUNT > 0) {
                        $scope.INVALID_EXCLE_CELL_COUNT = parseInt(data.data.IS_VALID_COUNT);
                        $scope.INVALID_EXCLE_CELL_FLAG = true;
                        $scope.INVALID_INVOICE_CONTACT_LIST = data.data.HEADER_CLOUMN_NAMES;
                        $('#View_Report').modal('show');
                        $scope.$parent.overlay_loadingNew = 'none';
                    }
                    else if (data.data.error == "CODE_MAX001") {
                        $scope.$parent.ShowAlert('Error', 'Please select correct From Date ', 1000);
                    }
                    else if (data.data.error == "CODE_MIN001") {
                        $scope.$parent.ShowAlert('Error', 'Please select correct From Date ', 1000);
                    }
                    else if (data.data.error == "CODE_DUP001") {
                        $scope.$parent.ShowAlert('Warning', 'Duplicate invoice and supplier found', 3000);
                        $scope.submitted = false;
                        $scope.IS_VALID_UPLOAD_FILE = false;
                        $scope.INV_RECO_UPLOAD_DETAILS_LIST = data.data.HEADER_CLOUMN_NAMES;
                        $scope.DUPLICATE_INVOICE_CONTACT_LIST = data.data.DUPLICATE_DTLS;
                    }
                    else if (data.data.error == "CODE0001") {
                        $scope.$parent.ShowAlert('Warning', 'No changes found in uploaded Excel', 3000);
                        $scope.submitted = false;
                        $scope.IS_VALID_UPLOAD_FILE = false;
                    }
                    else if (data.data.error == "CODE0003") {
                        $scope.$parent.ShowAlert('Warning', 'Some thing worng in excel or Enable editing mode in excel', 3000);
                        $scope.submitted = false;
                        $scope.IS_VALID_UPLOAD_FILE = false;
                        if (data.data.Msg == 'A malformed URI was found in the document. Please provide a OpenSettings.RelationshipErrorRewriter to handle these errors while opening a package.') {
                            $scope.Message = "";
                            var List = { DISPLAY_TEXT: "", IS_VALID: false, IS_DATA_VALID: true, CODE: "CODE0003" };
                            $scope.CODE_ARRY.push(List);
                            $scope.COPY_CODE_ARRY.push(List);
                        };
                    }
                    else if (data.data.error == "CODE0002") {
                        $scope.$parent.ShowAlert('Warning', 'Invalid Excel,either the column header is deleted or mismatch', 3000);
                        $scope.submitted = false;
                        $scope.IS_VALID_UPLOAD_FILE = false;
                    }
                    else if (data.data.HEADER_CLOUMN_NAMES.length == 0) {
                        $scope.$parent.ShowAlert('Warning', 'No record found', 3000);
                        $scope.submitted = false;
                        $scope.IS_VALID_UPLOAD_FILE = false;
                    }
                    else {
                        $scope.INV_RECO_UPLOAD_DETAILS_LIST = data.data.HEADER_CLOUMN_NAMES;
                        $scope.INVALID_EXCLE_CELL_FLAG = false;
                        $scope.INVALID_EXCLE_CELL_COUNT = parseInt(data.data.IS_VALID_COUNT);
                        $scope.$parent.ShowAlert('Success', 'File validated successfully,please click on submit', 5000);
                        $scope.$parent.overlay_loadingNew = 'none';
                        angular.element("input[id=Inv_recorduploadExcel1]").val(null);

                    }
                }
                else {
                    $scope.INV_RECO_UPLOAD_DETAILS_LIST = data.data.HEADER_CLOUMN_NAMES;
                    $scope.$parent.overlay_loadingNew = 'none';
                }
            });
        }
        else {
            $scope.$parent.ShowAlert('Attention', 'Please Upload File', 3000);
        }
    };
    $scope.$on('ngRepeatFinishedRender', function (ngRepeatFinishedEvent) {
        $scope.COMMON_CODE_CHANGE();
    });
    $scope.ngintvalidationvalue = function (key, value) {
        var List
        if (value == "<i class='fa fa-exclamation-triangle text-danger'></i>") {
            List = { DISPLAY_TEXT: "", IS_VALID: true, CODE: 'BLANK' };
            $scope.COPY_CODE_ARRY.push(List);
        }
        else {
            if (key == "COMMENTS") {

            }
            var val = value.split(':;:');
            if (val.length > 1) {
                if (val[1] == "DDL0004") {
                    List = { DISPLAY_TEXT: val[0], IS_VALID: false, IS_DATA_VALID: true, CODE: val[1], Suggestion: val, D_COLUMN_NAME: val[2] };
                    $scope.COPY_CODE_ARRY.push(List);
                }
                else if (val[0] == "UPLOAD0001") {
                    List = { DISPLAY_TEXT: value, IS_VALID: false };
                }
                else {
                    List = { DISPLAY_TEXT: val[0], IS_VALID: false, IS_DATA_VALID: true, CODE: val[1], Suggestion: val };
                    $scope.COPY_CODE_ARRY.push(List);
                }
            }
            else {
                if (key == "NI Number" && value != '' || key == "NI Number*" && value != '') {
                    const repeatRegex = /^[A-CEGHJ-PR-TW-Z]{1}[A-CEGHJ-NPR-TW-Z]{1}[0-9]{6}[A-D]{1}$/i;
                    var found = value.match(repeatRegex);
                    if (found == null) {
                        List = { DISPLAY_TEXT: value, IS_VALID: false, IS_DATA_VALID: true, CODE: "INVALID0011" };
                        $scope.COPY_CODE_ARRY.push(List);
                    }
                    else {
                        List = { DISPLAY_TEXT: value, IS_VALID: false };
                    }
                }
                else {
                    List = { DISPLAY_TEXT: value, IS_VALID: false };
                }
            }
        }
        return List;
    };

    $scope.NG_PAGE_LOAD = function () {
    }
    $scope.NG_PAGE_LOAD();
    $scope.PNL_UPLOAD_POP_FY = function () {
        $('#PNLUpload').modal('show');
        $scope.GET_UTC_TIME(1);
    }
    $scope.$parent.child_scope = $scope;
    $scope.COMMON_CODE_CHANGE();
});
