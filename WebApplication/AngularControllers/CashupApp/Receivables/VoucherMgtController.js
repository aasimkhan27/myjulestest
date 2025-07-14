app.controller('VoucherMgtController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $sce) {
    //$scope.$parent.DISPLAY_FLAG = false;
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(2);
    //$scope.CASHUP_COMMON_CODE_Fn();
    $scope.$parent.CASHUP_COMMON_RESET_Fn();
    $scope.VOUCHER_STATUS = function (status) {
        switch (status) {
            case 1:
                return 'Issued';
            case 2:
                return 'Redeem Partially';
            case 3:
                return 'Redeem Fully';
            case 4:
                return 'Cancelled';
            default:
                return '';
        }

    }
    //document.getElementById("loader").style.display = "block";
    $scope.CAHSUP_PRIVILEGE_ID = "1165";
    $scope.CASHUP_PRIVILEGE = true;
    $scope.SiteSearch = {};
    $scope.sortColumn = 'VOUCHER';       // default sort column
    $scope.reverseSort = false;          // false = ascending, true = descending
    $scope.warning_flag = false;
    $scope.GetData = true;
    $scope.setSort = function (column) {
        if ($scope.sortColumn === column) {
            $scope.reverseSort = !$scope.reverseSort;
        } else {
            $scope.sortColumn = column;
            $scope.reverseSort = false;
        }
    };
    $scope.getSortClass = function (column) {
        if ($scope.sortColumn === column) {
            return $scope.reverseSort ? 'fa-arrow-down txt-primary' : 'fa-arrow-up txt-primary';
        }
        //return '';
        return 'fa-arrow-up-arrow-down'; // default icon
    };
    $scope.DOWNLOAD_FILE_PATH = "/Uploads/Voucher_Template.xlsx";
    $scope.UPLOAD_REPORT_PATH = "";
    $scope.INVALID_EXCLE_CELL_FLAG = true;
    $scope.INVALID_EXCLE_CELL_COUNT = 0;
    $scope.PREVIEW_VOUCHERS_ENTRY = [];
    $scope.VOUCHER_UPLOAD_REPORT = [];
    $scope.VOUCHER_TABLE = [{ ID: 1, COLUMN_NAME: 'INVOICE', IS_MANDATORY: true, HEADER_NAME: 'INVOICE', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, FIELD_MASTER_ID: -1 },
    { ID: 2, COLUMN_NAME: 'VOUCHER_TYPE', IS_MANDATORY: true, HEADER_NAME: 'VOUCHER_TYPE', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, FIELD_MASTER_ID: -1 },
    { ID: 3, COLUMN_NAME: 'VOUCHER', IS_MANDATORY: true, HEADER_NAME: 'VOUCHER', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, FIELD_MASTER_ID: -1 },
    { ID: 4, COLUMN_NAME: 'AMOUNT', IS_MANDATORY: true, HEADER_NAME: 'AMOUNT', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, FIELD_MASTER_ID: -1 },//TIME DATATYPE
    { ID: 5, COLUMN_NAME: 'DATE', IS_MANDATORY: true, HEADER_NAME: 'DATE', FIELD_TYPE_ID: 9, VALUES_ENTITY: '', ACTIVE: true, FIELD_MASTER_ID: -1 },
    { ID: 6, COLUMN_NAME: 'PAYMENT_METHOD', IS_MANDATORY: true, HEADER_NAME: 'PAYMENT_METHOD', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, FIELD_MASTER_ID: -1 },
    { ID: 7, COLUMN_NAME: 'SOLD_TO', IS_MANDATORY: false, HEADER_NAME: 'SOLD_TO', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, FIELD_MASTER_ID: -1 },
    { ID: 8, COLUMN_NAME: 'NOTE', IS_MANDATORY: false, HEADER_NAME: 'NOTE', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, FIELD_MASTER_ID: -1 }];
    $scope.VOUCHER_MGT_SEARCH = {
        SEARCH_TEXT: '',
        SELECTED_SITE: null,
        CUSTOMER_ID: parseInt($cookies.get("CUSTOMER_ID")),
        ENTITY_ID: parseInt($cookies.get("ENTITY_ID")),
        USER_ID: parseInt($cookies.get("USERID")),
        MODULE_ID: parseInt($cookies.get("MODULE_ID")),
        START_DATE: null,
        END_DATE: null,
        VOUCHER_TYPE: '',
        MODE_OF_PAYMENT: null,
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        UploadedFiles: null,
        DATA_ENTRY_ENABLED:false
    }
    $scope.VOUCHER_ISSUE_SINGLE = {
        SELECTED_SITE: null,
        CUSTOMER_ID: parseInt($cookies.get("CUSTOMER_ID")),
        ENTITY_ID: parseInt($cookies.get("ENTITY_ID")),
        USER_ID: parseInt($cookies.get("USERID")),
        MODULE_ID: parseInt($cookies.get("MODULE_ID")),
        INVOICE_NO: null,
        VOUCHER_TYPE: null,
        VOUCHER_NUMBER: null,
        AMOUNT: null,
        PAYMENT_METHOD: null,
        VALIDITY_DATE: null,
        SOLD_TO: null,
        NOTE: null
    }

    $scope.MODE_OF_PAYMENT_LIST = [];
    $scope.VOUCHER_LIST = [];
    $scope.VOUCHER_ENTRY_LIST = [];
    $scope.CHECKED_ALL = false;
    $scope.dateinputddmmyy = function (index) {
        $(document).ready(function () {
            var date_inputs = document.getElementsByClassName("dateinputddmmyy") //our date input has the name "date"
            if (date_inputs.length > 0) {
                for (var i = 0; i < date_inputs.length; i++) {
                    var date_input = $('input[name="' + date_inputs[i].name + '"]'); //our date input has the name "date"
                    var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
                    // var date = new Date();
                    var options = {
                        todayBtn: "linked",
                        daysOfWeekHighlighted: "0,6",
                        autoclose: true,
                        todayHighlight: false,
                        format: $scope.$parent.CALENDAR_DATE_FORMAT,
                        //format: 'yyyy-mm-dd',
                        clearBtn: true,
                        closeBtn: true,// close button visible
                        //  startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate())
                    };
                    date_input.datepicker(options).on("hide", function (e) {

                    })
                }
            }
        });
    }
    $scope.dateinputddmmyy(1);
    //$scope.$parent.Datelocaleformat = { format: 'DD/MM/YYYY' };
    function reportrange(startDate, endDate) {
        $scope.VOUCHER_MGT_SEARCH.START_DATE = startDate.format($scope.$parent.DB_DATE_FORMAT);
        $scope.VOUCHER_MGT_SEARCH.END_DATE = endDate.format($scope.$parent.DB_DATE_FORMAT);
        $('#reportrange span').html(startDate.format($scope.$parent.DATE_RANGE_FORMAT) + ' - ' + endDate.format($scope.$parent.DATE_RANGE_FORMAT));
        $scope.GET_VOUCHER_MANAGEMENT();
    }
    $(function () {

        startDate = new moment().add(0, 'months').date(1);//new moment().subtract(1, 'months').date(1); //moment().add('months', 1).date(0);//moment().startOf('month');   //moment().startOf('isoWeek');//moment().subtract(6, 'days');
        //console.log("SD", startDate);
        endDate = moment().endOf('month'); //moment().subtract(0, 'days');
        //console.log("ED", endDate);
        $scope.$parent.SetUpDateRangeMultiDatePicker('reportrange', startDate, endDate, reportrange);
        $('#reportrange span').html(startDate.format($scope.$parent.DATE_RANGE_FORMAT) + ' - ' + endDate.format($scope.$parent.DATE_RANGE_FORMAT));
    });

    $(document).on("click", ".ranges ul li", function (event) {

        var a = $(this).attr("data-range-key");
        if (a == "Custom Date" && ($scope.loader == 1)) {
            $scope.loader = 2;
            var start = moment().startOf('month');
            var end = moment().add(1, 'M').endOf('month');
            //$('#' + ControlName).trigger('show.daterangepicker')
            $scope.$parent.SetUpDateRangeMultiDatePicker('reportrange', start, end, reportrange, 1, "right", 'Open');
            $('#reportrange').data('daterangepicker').show();
        }
        else {
            $scope.loader = 1;
        }
    });

    $scope.GET_CASHUP_TYPE = function (Sites) {
        var CashupModelObj = {
            CUSTOMER_ID: $scope.VOUCHER_MGT_SEARCH.CUSTOMER_ID,
            ENTITY_ID: $scope.VOUCHER_MGT_SEARCH.ENTITY_ID
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
                Sites = Sites.filter(_site => _site.WILl_USE_IN_CASHUP == true);
                $scope.FILTERED_SITES_LIST = Sites;
                if ($scope.FILTERED_SITES_LIST && $scope.FILTERED_SITES_LIST.length > 0) {
                    $scope.CASHUP_PRIVILEGE = true;
                }
                else {
                    $scope.CASHUP_PRIVILEGE = false;
                }
                $scope.SELECT_SITE(Sites[0]);
            } else {
                $scope.CASHUP_PRIVILEGE = false;
            }
        }).catch(function (error) {
            $scope.CASHUP_PRIVILEGE = false;
        });
    }
    $scope.GET_PRIVILEGE = function () {
        if ($scope.$parent.$parent.CHECK_CASHUP_PRIVILEGE($scope.CAHSUP_PRIVILEGE_ID)) {
            $scope.FILTERED_SITES_LIST = $scope.$parent.$parent.CHECK_CASHUP_USER_PRIVILEGE($scope.CAHSUP_PRIVILEGE_ID, parseInt($cookies.get("ENTITY_ID")));
            if ($scope.FILTERED_SITES_LIST && $scope.FILTERED_SITES_LIST.length > 0) {
                $scope.FILTERED_SITES_LIST[0].IS_SELECTED = true;
                $scope.GET_CASHUP_TYPE($scope.FILTERED_SITES_LIST);
            }
            else {
                $scope.CASHUP_PRIVILEGE = false;
            }
        }
        else {
            $scope.CASHUP_PRIVILEGE = false;
        }
    };

    $scope.GET_PRIVILEGE();
    //$scope.GET_USER_ROLES_BY_USER_ID();
    $scope.GET_VOUCHER_MANAGEMENT = function (flag) {
        if (flag == null || flag == undefined) {
            $scope.VOUCHER_MGT_SEARCH.PAGE_NO = 1;
            $scope.GetData = true;
        }
        var CashupAppModelObj = new Object();
        CashupAppModelObj.BRANCH_ID = $scope.VOUCHER_MGT_SEARCH.SELECTED_SITE.BRANCH_ID;
        CashupAppModelObj.SEARCH_TEXT = $scope.VOUCHER_MGT_SEARCH.SEARCH_TEXT;
        CashupAppModelObj.VOUCHER_TYPE = '';
        CashupAppModelObj.PAYMENT_MODE_ID = $scope.VOUCHER_MGT_SEARCH.MODE_OF_PAYMENT == null ? 0 : $scope.VOUCHER_MGT_SEARCH.MODE_OF_PAYMENT.MODE_OF_PAYMENT_ID;
        CashupAppModelObj.START_DATE = $scope.VOUCHER_MGT_SEARCH.START_DATE;
        CashupAppModelObj.END_DATE = $scope.VOUCHER_MGT_SEARCH.END_DATE;
        CashupAppModelObj.PAGE_NO = $scope.VOUCHER_MGT_SEARCH.PAGE_NO;
        CashupAppModelObj.PAGE_SIZE = $scope.VOUCHER_MGT_SEARCH.PAGE_SIZE;
        PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'GET_VOUCHER_MANAGEMENT').then(function (data) {
            if (data.data.Table.length > 0) {

                if (flag == null || flag == undefined) {
                    $scope.VOUCHER_LIST = data.data.Table;
                }
                else if (flag == 1) {
                    $scope.VOUCHER_LIST = $scope.VOUCHER_LIST.concat(data.data.Table);
                }
                if (data.data.Table.length < $scope.VOUCHER_MGT_SEARCH.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.VOUCHER_MGT_SEARCH.PAGE_NO = parseInt($scope.VOUCHER_MGT_SEARCH.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else if ($scope.VOUCHER_MGT_SEARCH.PAGE_NO > 1 && data.data.Table.length == 0) {
                $scope.GetData = false;
            }
            else if ($scope.VOUCHER_MGT_SEARCH.PAGE_NO == 1 && data.data.Table.length == 0) {
                $scope.VOUCHER_LIST = [];
                $scope.LOAD_FETCH_TEXT = 'No Records Found !';
            }
            //document.getElementById("loader").style.display = "none";
        });
    }

    $scope.GET_MODE_OF_PAYMENTS = function (_site) {
        var ModelObj = new Object();
        ModelObj.BRANCH_ID = _site.BRANCH_ID;//$scope.VOUCHER_MGT_SEARCH.SELECTED_SITE.BRANCH_ID;
        PrcCommMethods.CASHUP_APP_API(ModelObj, 'GET_MODE_OF_PAYMENTS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.MODE_OF_PAYMENT_LIST = data.data.Table.filter(_row => _row.ACTIVE == true);
            }
            else {
                $scope.MODE_OF_PAYMENT_LIST = [];
            }
        });
    };

    $scope.EXPORT_VOUCHER_LIST = function (export_flag) {
        var CashupAppModelObj = new Object();
        CashupAppModelObj.BRANCH_ID = $scope.VOUCHER_MGT_SEARCH.SELECTED_SITE.BRANCH_ID;
        CashupAppModelObj.SEARCH_TEXT = $scope.VOUCHER_MGT_SEARCH.SEARCH_TEXT;
        CashupAppModelObj.VOUCHER_TYPE = '';
        CashupAppModelObj.PAYMENT_MODE_ID = $scope.VOUCHER_MGT_SEARCH.MODE_OF_PAYMENT == null ? 0 : $scope.VOUCHER_MGT_SEARCH.MODE_OF_PAYMENT.MODE_OF_PAYMENT_ID;
        CashupAppModelObj.START_DATE = $scope.VOUCHER_MGT_SEARCH.START_DATE;
        CashupAppModelObj.END_DATE = $scope.VOUCHER_MGT_SEARCH.END_DATE;
        CashupAppModelObj.PAGE_NO = 0;
        CashupAppModelObj.PAGE_SIZE = 0;
        CashupAppModelObj.CASHUP_REPORT_TYPE = 19;
        CashupAppModelObj.EXPORT_FLAG = export_flag;
        CashupAppModelObj.FILE_PATH = "/VOUCHER_MGT_" + "/CUSTOMER_" + $scope.VOUCHER_MGT_SEARCH.CUSTOMER_ID + "/" + "USER_ID_" + $scope.VOUCHER_MGT_SEARCH.USER_ID + "/" + (export_flag == 1 ? "CSV" : "XLSX") + "/";
        CashupAppModelObj.FILE_NAME = "VouchersRecord";
        PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'EXPORT_CASHUP_REPORTS').then(function (data) {
            if (data.data != null) {
                $scope.SERVER_FILE_PATH = '/' + data.data.FOLDER_NAME + data.data.RETURN_FILE_NAME;
                $scope.FILE_NAME = CashupAppModelObj.FILE_NAME;
                window.location.href = $scope.SERVER_FILE_PATH;
            } else {
                alert("Export failed. Please try again.");
            }
        });
    }

    $scope.UPLOAD_VOUCHER_CHECK = function () {
        var CashupAppModelObj = new Object();
        CashupAppModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CashupAppModelObj.BRANCH_ID = $scope.VOUCHER_ISSUE_SINGLE.SELECTED_SITE.BRANCH_ID;
        CashupAppModelObj.VOUCHER_REFERENCE = $scope.VOUCHER_ISSUE_SINGLE.VOUCHER_NUMBER;
        PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'UPLOAD_VOUCHER_CHECK').then(function (data) {
            if (data.data.Table[0].SUCCESS_STATUS == true) {
                $scope.$parent.ShowAlertBox('Error', 'The Voucher Number Already Exists For This Branch!', 3000)
                $scope.VOUCHER_ISSUE_SINGLE.VOUCHER_NUMBER = null;
            }
        });
    }



    $scope.CHECK_ALL_VOUCHERS = function () {
        if ($scope.CHECKED_ALL == false) {
            angular.forEach($scope.VOUCHER_LIST, function (_row) {
                _row.CHECKED = true;
            });
        }
        else {
            angular.forEach($scope.VOUCHER_LIST, function (_row) {
                _row.CHECKED = false;
            });
        }
    }
    $scope.nginit_vouchers_list = function (_row) {
        _row.CHECKED = false;
    }
    $scope.VALIDATE_AMOUNT = function (_row) {
        if (_row != null && _row != undefined) {
            if (parseFloat(_row.AMOUNT) > parseFloat(_row.REMAINING_AMOUNT)) {
                $scope.$parent.ShowAlertBox('Error', "Redeemed Amount can't be larger than Remaining Amount");
                _row.AMOUNT = _row.REMAINING_AMOUNT;
            }
        }
    }
    $scope.FILEUPLOADCLICK = function () {
        $scope.Refreshdata();
    };
    $scope.Refreshdata = function () {
        $scope.INVALID_EXCLE_CELL_COUNT = 0;
        $scope.COPY_CODE_ARRY = [];
        $scope.CODE_ARRY = [];
        $scope.submitted = false;
    };
    $scope.SELECT_SITE = function (_site,flag) {
        $scope.MODE_OF_PAYMENT_LIST = [];
        $scope.VOUCHER_MGT_SEARCH.MODE_OF_PAYMENT = null;
        $scope.VOUCHER_MGT_SEARCH.SELECTED_SITE = _site;
        $scope.SELECT_SITE_VOUCHER_ISSUE_SINGLE(_site);
        if (_site.STANDARD_ROLE_ID == 16 || _site.STANDARD_ROLE_ID == 17 || _site.STANDARD_ROLE_ID == 18) {
            $scope.VOUCHER_MGT_SEARCH.DATA_ENTRY_ENABLED = true;
        }
        else {
            $scope.VOUCHER_MGT_SEARCH.DATA_ENTRY_ENABLED = false;
        }
        $scope.GET_MODE_OF_PAYMENTS(_site);
        if (flag == null || flag == undefined) {
            $scope.GET_VOUCHER_MANAGEMENT();
        }
        
    }
    $scope.SELECT_SITE_VOUCHER_ISSUE_SINGLE = function (_site) {
        $scope.VOUCHER_ISSUE_SINGLE.SELECTED_SITE = _site;
        $scope.MODE_OF_PAYMENT_LIST = [];
        $scope.VOUCHER_ISSUE_SINGLE.PAYMENT_METHOD = null;
        $scope.GET_MODE_OF_PAYMENTS(_site);
    }
    $scope.SELECT_VOUCHER_TYPE = function (_type) {
        $scope.VOUCHER_MGT_SEARCH.VOUCHER_TYPE = _type;
        $scope.GET_VOUCHER_MANAGEMENT();
    };
    $scope.SELECT_VOUCHER_TYPE_ISSUE_SINGLE = function (_type) {
        $scope.VOUCHER_ISSUE_SINGLE.VOUCHER_TYPE = _type;
        $scope.GET_MODE_OF_PAYMENTS();
    }
    $scope.SELECT_MODE_OF_PAYMENT = function (_mode_of_payment) {
        if (_mode_of_payment == 'Choose') {
            $scope.VOUCHER_MGT_SEARCH.MODE_OF_PAYMENT = null;
        }
        else {
            $scope.VOUCHER_MGT_SEARCH.MODE_OF_PAYMENT = _mode_of_payment;
        }
        $scope.GET_VOUCHER_MANAGEMENT();
    };
    $scope.SELECT_MODE_OF_PAYMENT_ISSUE_SINGLE = function (_mode_of_payment) {
        $scope.VOUCHER_ISSUE_SINGLE.PAYMENT_METHOD = _mode_of_payment;
    }
    $scope.RESET_VOUCHER_ISSUE_SINGLE = function () {
        $scope.VOUCHER_ISSUE_SINGLE.INVOICE_NO = null;
        $scope.VOUCHER_ISSUE_SINGLE.VOUCHER_TYPE = null;
        $scope.VOUCHER_ISSUE_SINGLE.VOUCHER_NUMBER = null;
        $scope.VOUCHER_ISSUE_SINGLE.AMOUNT = null;
        $scope.VOUCHER_ISSUE_SINGLE.PAYMENT_METHOD = null;
        $scope.VOUCHER_ISSUE_SINGLE.VALIDITY_DATE = null;
        $scope.VOUCHER_ISSUE_SINGLE.SOLD_TO = null;
        $scope.VOUCHER_ISSUE_SINGLE.NOTE = null;
    }

    $scope.RESET_VOUCHER_SEARCH = function () {
        $scope.VOUCHER_MGT_SEARCH.START_DATE = moment().startOf('month').format($scope.$parent.DB_DATE_FORMAT);
        $scope.VOUCHER_MGT_SEARCH.END_DATE = moment().endOf('month').format($scope.$parent.DB_DATE_FORMAT);
        $scope.VOUCHER_MGT_SEARCH.SELECTED_SITE = null;
        $scope.VOUCHER_MGT_SEARCH.SEARCH_TEXT = '';
        $scope.VOUCHER_MGT_SEARCH.MODE_OF_PAYMENT = null;
        $scope.VOUCHER_MGT_SEARCH.PAGE_NO = 1;
        $scope.VOUCHER_MGT_SEARCH.PAGE_SIZE = 10;
        $scope.VOUCHER_MGT_SEARCH.VOUCHER_TYPE = '';
        $scope.VOUCHER_MGT_SEARCH.UploadedFiles = null;
        $scope.VOUCHER_MGT_SEARCH.DATA_ENTRY_ENABLED = false;
        $scope.SELECT_SITE($scope.FILTERED_SITES_LIST[0], 1);
        $scope.$parent.SetUpDateRangeMultiDatePicker('reportrange', startDate, endDate, reportrange);
        $('#reportrange span').html(startDate.format($scope.$parent.DATE_RANGE_FORMAT) + ' - ' + endDate.format($scope.$parent.DATE_RANGE_FORMAT));
    }
    $scope.REDEEM_CANCEL = function (flag) {
        $scope.VOUCHER_ENTRY_LIST = [];
        $scope.warning_flag = false;
        angular.forEach($scope.VOUCHER_LIST, function (_row) {
            if (_row.CHECKED == true) {
                if (flag == 1 && (_row.STATUS == 3 || _row.STATUS == 4)) {
                    $scope.warning_flag = true;
                }
                else if (flag == 2 && _row.STATUS != 1) {
                    $scope.warning_flag = true;
                }
                else {
                    var ROW = new Object();
                    ROW.ID = flag == 2 ? _row.VOUCHER_ID : 0;
                    ROW.ENTRY_TYPE_ID = _row.ENTRY_TYPE_ID;
                    //ROW.ENTRY_TYPE_DETAIL_ID = flag == 1 ? _row.VOUCHER_ID : null;
                    ROW.ENTRY_TYPE_DETAIL_ID = flag == 1 ? (_row.ENTRY_TYPE_DETAIL_ID == null ? _row.VOUCHER_ID : _row.ENTRY_TYPE_DETAIL_ID) : null;
                    ROW.ENTITY_ID = $scope.VOUCHER_MGT_SEARCH.ENTITY_ID;
                    ROW.BRANCH_ID = $scope.VOUCHER_MGT_SEARCH.SELECTED_SITE.BRANCH_ID;
                    ROW.CASHUP_HEADER_ID = null;
                    ROW.VOUCHER_TYPE = _row.VOUCHER_TYPE;
                    ROW.TABLE_NUMBER = null;
                    ROW.NO_OF_COVERS = null;
                    ROW.VOUCHER_NUMBER = _row.VOUCHER;
                    ROW.DEPOSIT_REFERENCE = null;
                    ROW.VOID_TYPE = null;
                    ROW.AMOUNT = _row.REMAINING_AMOUNT;
                    ROW.VALIDITY_DATE = moment(_row.VALIDITY_DATE).format($scope.$parent.CONVERSION_DATE_FORMAT);
                    ROW.REASON_OF_COMP = null;
                    ROW.SOLD_TO = _row.SOLD_TO;
                    ROW.NAME_OF_PAYEE = null;
                    ROW.TIME = null;
                    ROW.DEPOSITE_PAYMENT_METHOD = null;
                    ROW.VOUCHER_PAYMENT_METHOD = _row.PAYMENT_METHOD;
                    ROW.VOUCHER_INVOICE_NUMBER = _row.INVOICE;
                    ROW.DEPOSITE_INVOICE_NUMBER = null;
                    ROW.COMP_CHECK_NO = null;
                    ROW.VOID_CHECK_NO = null;
                    ROW.NOTE = _row.NOTE;
                    ROW.IS_REDEEMED = flag == 1 ? 1 : 0;
                    ROW.AUTHORIZED_BY = null;
                    ROW.ACTIVE = 1;
                    ROW.CREATED_BY = $scope.VOUCHER_MGT_SEARCH.USER_ID;
                    ROW.CREATED_DATE = _row.CREATED_DATE;
                    ROW.MODIFIED_BY = null;
                    ROW.MODIFIED_DATE = null;
                    ROW.DISCOUNT = null;
                    ROW.FOOD = null;
                    ROW.DRINKS = null;
                    ROW.LIGHT_SPEED_ACCOUNTFISCID = null;
                    ROW.IS_DELETED = 0;
                    ROW.PAYMENT_METHOD_ID = _row.PAYMENT_METHOD_ID;
                    ROW.RESTRICT_DELETE = null;
                    ROW.IS_CANCELLED = flag == 2 ? 1 : null;
                    ROW.DEPOSIT_CANCELLATION_FEE = null;
                    ROW.TOTAL_AMT = _row.VOUCHER_AMOUNT;
                    ROW.UPLOAD_IDS = null;
                    ROW.FILE_NAME = null;
                    ROW.REMAINING_AMOUNT = _row.REMAINING_AMOUNT;
                    ROW.REDEEMED_BY = null;
                    ROW.IS_EXTERNAL_RECORD = _row.IS_EXTERNAL_RECORD;
                    $scope.VOUCHER_ENTRY_LIST.push(ROW);
                }
            }
        })
        if ($scope.VOUCHER_ENTRY_LIST.length > 0) {
            if (flag == 1) {
                if ($scope.warning_flag == true) {
                    var myModal = new bootstrap.Modal(document.getElementById('confirm_redeem'), {
                        keyboard: false  // Optional: Close modal when pressing ESC
                    });
                    // Show the modal
                    myModal.show();
                }
                else {
                    var myModal = new bootstrap.Modal(document.getElementById('redeem'), {
                        keyboard: false  // Optional: Close modal when pressing ESC
                    });
                    // Show the modal
                    myModal.show();
                }
            }
            else if (flag == 2) {
                if ($scope.warning_flag == true) {
                    var myModal = new bootstrap.Modal(document.getElementById('cancel'), {
                        keyboard: false  // Optional: Close modal when pressing ESC
                    });
                    // Show the modal
                    myModal.show();
                }
                else {
                    $scope.INS_ENTRY_VOUCHER_DECLARATION(2);
                }
            }
        }
    }
    $scope.getTheFilesToUploadVoucherMgmt = function ($files, ControlName, FileSize, List, Attachment_UPLOAD_TYPE_ID, index) {

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
                angular.element("input[id='" + ControlName + "']").val(null);
                return;
            }
        }

        $scope.Files = $files;
        var fileUpload = document.getElementById("uploadExcel");
        if (fileUpload.files[0] == null || fileUpload.files[0] == undefined) {
            var extension = $files[0].name;
        }
        else {
            extension = fileUpload.files[0].name;
        }
        
        $scope.uploadFiles(Attachment_UPLOAD_TYPE_ID, '', extension, List, index, 'VoucherMgt');
    };
    $scope.uploadFiles = function (Attachment_UPLOAD_TYPE_ID, ATTACHEMENT_TYPE_ID, filename, List, index, FolderName) {

        if (($scope.Files != undefined && $scope.Files.length > 0)) {
            $scope.DocImageResult = [];
            var data = new FormData();
            data.append("RelativeID", $scope.generaterandom(12));
            //data.append("RelativeID", List.ID == 0 ? $scope.generaterandom(12) + "" + index : List.ID);
            data.append("UPLOAD_TYPE_ID", Attachment_UPLOAD_TYPE_ID);
            data.append("VIRTUALPATH", '/CashUp/' + FolderName + '/' + parseInt($scope.VOUCHER_MGT_SEARCH.SELECTED_SITE.BRANCH_ID) + '/');
            data.append("UPLOAD_ID", 0);
            data.append("ORIGINAL_FILE_NAME", filename);
            data.append("USER_ID", parseInt($cookies.get("USERID")));
            if (isNaN(parseInt($cookies.get("ENTITY_ID")))) {
                data.append("ENTITY_ID", 0);
            }
            else {
                data.append("ENTITY_ID", parseInt($cookies.get("ENTITY_ID")));
            }
            for (var i in $scope.Files) {
                data.append("uploadedfile", $scope.Files[i]);
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
                    $scope.ShowAlert('Error', d.data[0].UPLOADED_COMMENT, 5000);
                }
                else {
                    List.UploadedFiles = d.data;
                }
                //var fileInput = document.getElementById("uploadExcel"); // Reset the file input
                //if (fileInput) {
                //    fileInput.value = ""; // Clear the input field
                //}
                $scope.EXCEL_VOUCHER_VALIDATE();
            });
        }
    };
    $scope.generaterandom = function (n) {
        var add = 1, max = 12 - add;   // 12 is the min safe number Math.random() can generate without it starting to pad the end with zeros.   
        if (n > max) {
            return $scope.generaterandom(max) + $scope.generaterandom(n - max);
        }
        max = Math.pow(10, n + add);
        var min = max / 10; // Math.pow(10, n) basically
        var number = Math.floor(Math.random() * (max - min + 1)) + min;
        return ("" + number).substring(add);
    };

    $scope.DELETE_UPLOAD_CARD_ALL = function (Array, item, index) {
        if (confirm('Are you sure you want to delete?')) {
            Array.UploadedFiles.splice(index, 1);
            var CashupModelObj = new Object();
            CashupModelObj.ID = parseInt(item.ID);
            PrcCommMethods.CASHUP_APP_API(CashupModelObj, 'DELETE_UPLOAD').then(function (data) {
                var fileInput = document.getElementById("uploadExcel"); // Reset the file input
                if (fileInput) {
                    fileInput.value = ""; // Clear the input field
                }
                $scope.$parent.ShowAlertBox('Success', 'Deletion Success.', 3000);
                $scope.PREVIEW_VOUCHERS_ENTRY = [];
                $scope.CODE_ARRY = [];
                $scope.VOUCHER_MGT_SEARCH.UploadedFiles = null;
                $scope.INVALID_EXCLE_CELL_COUNT = 0;
                $scope.COPY_CODE_ARRY = [];
                $scope.CODE_ARRY = [];
                $scope.submitted = false;
            });
        }
    };
    $scope.$watch('VOUCHER_ISSUE_SINGLE.SELECTED_SITE.BRANCH_NAME', function (newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.UPLOAD_VOUCHER_CHECK();
        }
    });
    $scope.$watch('VOUCHER_MGT_SEARCH.MODE_OF_PAYMENT', function (newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.GET_VOUCHER_MANAGEMENT();
        }
    });
    $scope.$on('ngRepeatFinishedRender', function (ngRepeatFinishedEvent) {
        $scope.CODE_ARRY = $scope.COPY_CODE_ARRY;
    });
    $scope.ngintvalidationvalue = function (key, value) {
        var List;
        if (value == "<i class='fa fa-exclamation-triangle text-danger'></i>") {
            List = { DISPLAY_TEXT: "", IS_VALID: true };
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
                    if (key == "DATE" || key == "CREATED_DATE") {
                        value = value.split(' ')[0];
                    }
                    List = { DISPLAY_TEXT: value, IS_VALID: false };
                }
            }
        }
        return List;
    };
    $scope.EXCEL_VOUCHER_VALIDATE = function () {

        $scope.COPY_CODE_ARRY = [];
        $scope.CODE_ARRY = [];
        $scope.INVALID_EXCLE_CELL_COUNT = 0;
        var x = document.getElementById('uploadExcel');
        if ((document.getElementById('uploadExcel').value != null && document.getElementById('uploadExcel').value != '') || ($scope.Files != null && $scope.Files != undefined && $scope.Files.length>0)){
            ModelObj = new Object();
            ModelObj.UPLOAD_TYPE_ID = 1;
            ModelObj.SERVER_FILE_NAME = $scope.VOUCHER_MGT_SEARCH.UploadedFiles[0].SERVER_FILE_NAME;
            ModelObj.ORIGINAL_FILE_NAME = $scope.VOUCHER_MGT_SEARCH.UploadedFiles[0].ORIGINAL_FILE_NAME;
            ModelObj.FILE_PATH = $scope.VOUCHER_MGT_SEARCH.UploadedFiles[0].FILE_PATH + $scope.VOUCHER_MGT_SEARCH.UploadedFiles[0].SERVER_FILE_NAME;
            ModelObj.DATETIME_FORMAT_CULTURE = ["MM/dd/yyyy hh:mm:ss tt", "M/d/yyyy hh:mm:ss tt", "MM/dd/yyyy", "M/d/yyyy", "yyyy-MM-dd","dd-MM-yyyy"];
            ModelObj.LANGUAGE_SYMBOL = $scope.$parent.$parent.LANGUAGE_SYMBOL;
            ModelObj.EXCEL_DATATABLE = $scope.VOUCHER_TABLE;
            PrcCommMethods.CASHUP_APP_API(ModelObj, 'EXCEL_COVERS_VALIDATE').then(function (data) {
                $scope.VOUCHER_VALIDATE_LIST = [];
                $scope.submitted = true;
                $scope.VOUCHER_VALIDATE_LIST = data.data.HEADER_CLOUMN_NAMES;
                $scope.PREVIEW_VOUCHERS_ENTRY = data.data.HEADER_CLOUMN_NAMES;
                if (data.data.IS_VALID_COUNT > 0) {
                    $scope.INVALID_EXCLE_CELL_COUNT = parseInt(data.data.IS_VALID_COUNT);
                    $scope.INVALID_EXCLE_CELL_FLAG = true;
                    //$('#View_Report').modal('show');
                }

                else if (data.data.error == "CODE0001") {
                    $scope.$parent.ShowAlertBox('Warning', "No changes found in uploaded Excel", 3000);
                    $scope.submitted = false;
                    $scope.IS_VALID_UPLOAD_FILE = false;
                }
                else if (data.data.error == "CODE0003") {
                    $scope.$parent.ShowAlertBox('Warning', 'Some thing wrong in excel or Enable editing mode in excel', 3000);
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
                    $scope.$parent.ShowAlertBox('Warning', 'Invalid Excel,either the column header is deleted or mismatch', 3000);
                    $scope.submitted = false;
                    $scope.IS_VALID_UPLOAD_FILE = false;
                }
                else if (data.data.HEADER_CLOUMN_NAMES.length == 0) {
                    $scope.$parent.ShowAlertBox('Warning', 'No record found', 3000);
                    $scope.submitted = false;
                    $scope.IS_VALID_UPLOAD_FILE = false;
                }
                else {
                    $scope.INVALID_EXCLE_CELL_FLAG = false;
                    $scope.INVALID_EXCLE_CELL_COUNT = parseInt(data.data.IS_VALID_COUNT);
                    $scope.$parent.ShowAlertBox('Success', 'File validated successfully,please click on submit', 5000);
                }
            });
            $scope.submitted = false;
        }
        else {
            $scope.$parent.ShowAlertBox('Attention', 'Please Upload File', 3000);
            $scope.submitted = false;
        }
        var fileInput = document.getElementById("uploadExcel"); // Reset the file input
        if (fileInput) {
            fileInput.value = ""; // Clear the input field
        }
    };
    $scope.RESET_BULK = function () {
        $scope.PREVIEW_VOUCHERS_ENTRY = [];
        var fileInput = document.getElementById("uploadExcel"); // Reset the file input
        if (fileInput) {
            fileInput.value = ""; // Clear the input field
        }
    }
    $scope.CLOSE_REPORT_VIEW = function () {
        $scope.VOUCHER_UPLOAD_REPORT = [];
        $scope.GET_VOUCHER_MANAGEMENT();
    }
    $scope.GENERATE_VOUCHER_UPLOAD_REPORT = function () {
        var export_flag = 2;
        var CashupAppModelObj = new Object();
        angular.forEach($scope.VOUCHER_UPLOAD_REPORT, function (_line) {
            if (_line.IS_REJECTED == false) {
                //_line.COMMENTS = "Success";
            }
        })
        CashupAppModelObj.UPLOAD_REPORT = $scope.VOUCHER_UPLOAD_REPORT;
        CashupAppModelObj.EXPORT_FLAG = export_flag;
        CashupAppModelObj.FILE_PATH = "/VOUCHER_MGT_UPLOAD_REPORT" + "/CUSTOMER_" + $scope.VOUCHER_MGT_SEARCH.CUSTOMER_ID + "/" + "USER_ID_" + $scope.VOUCHER_MGT_SEARCH.USER_ID + "/" + (export_flag == 1 ? "CSV" : "XLSX") + "/";
        CashupAppModelObj.FILE_NAME = "VoucherUploadReport";
        PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'GENERATE_VOUCHER_UPLOAD_REPORT').then(function (data) {
            if (data.data != null) {
                $scope.SERVER_FILE_PATH = '/' + data.data.FOLDER_NAME + data.data.RETURN_FILE_NAME;
                $scope.FILE_NAME = CashupAppModelObj.FILE_NAME;
                $scope.UPLOAD_REPORT_PATH = $scope.SERVER_FILE_PATH;
            } else {
                alert("Export failed. Please try again.");
            }
        });

    };
    $scope.INS_ENTRY_VOUCHER_DECLARATION = function (type, closeModal) { //type 0 = issue single // type 2 = cancel // type 3 redeem
        if (type == 1) {
            $scope.IssueSingleVoucherForm.submitted = true;
            if ($scope.IssueSingleVoucherForm.$valid) {
                var CashupAppModelObj = new Object();
                CashupAppModelObj.CASHUP_HEADER_ID = null;
                CashupAppModelObj.ENTITY_ID = $scope.VOUCHER_ISSUE_SINGLE.ENTITY_ID;
                CashupAppModelObj.BRANCH_ID = $scope.VOUCHER_ISSUE_SINGLE.SELECTED_SITE.BRANCH_ID;
                CashupAppModelObj.USER_ID = $scope.VOUCHER_ISSUE_SINGLE.USER_ID;
                CashupAppModelObj.ISSUE_TOTAL = parseFloat($scope.VOUCHER_ISSUE_SINGLE.AMOUNT).toFixed(5);
                CashupAppModelObj.REDEEMED_TOTAL = 0;
                CashupAppModelObj.IS_DRAFT = null;
                CashupAppModelObj.STEP_NO = null;
                var declaration_list = [];
                var declaration = new Object();
                declaration.TABLE_ID = 0;
                declaration.ENTRY_TYPE_ID = 1;
                declaration.ENTRY_TYPE_DETAIL_ID = null;
                declaration.VOUCHER_TYPE = $scope.VOUCHER_ISSUE_SINGLE.VOUCHER_TYPE;
                declaration.CODE = $scope.VOUCHER_ISSUE_SINGLE.VOUCHER_NUMBER;
                declaration.VALUE = parseFloat($scope.VOUCHER_ISSUE_SINGLE.AMOUNT).toFixed(5);
                //declaration.VALIDITY_DATE = _row.VALIDITY_DATE;
                declaration.VALIDITY_DATE = moment($scope.VOUCHER_ISSUE_SINGLE.VALIDITY_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).format($scope.$parent.DB_DATE_FORMAT);
                declaration.CUSTOMER_NAME = $scope.VOUCHER_ISSUE_SINGLE.SOLD_TO;
                declaration.MODE = $scope.VOUCHER_ISSUE_SINGLE.PAYMENT_METHOD.METHOD_NAME;
                declaration.CHECK_NO = $scope.VOUCHER_ISSUE_SINGLE.INVOICE_NO;
                declaration.NOTE = $scope.VOUCHER_ISSUE_SINGLE.NOTE;
                declaration.IS_REDEEMED = 0;
                declaration.AUTHORIZED_BY_ID = null;
                declaration.DISCOUNT = null;
                declaration.FOOD = null;
                declaration.DRINKS = null;
                declaration.LIGHT_SPEED_ACCOUNTFISCID = null;
                declaration.IS_DELETED = 0;
                declaration.PAYMENT_METHOD_ID = $scope.VOUCHER_ISSUE_SINGLE.PAYMENT_METHOD.MODE_OF_PAYMENT_ID;
                declaration.DEPOSIT_CANCELLATION_FEE = null;
                declaration.IS_CANCELLED = 0;
                declaration.TOTAL_AMT = parseFloat($scope.VOUCHER_ISSUE_SINGLE.AMOUNT).toFixed(5);
                declaration.UPLOAD_IDS = null;
                declaration.REDEEMED_BY = null;
                declaration.IS_EXTERNAL_RECORD = 1;
                declaration_list.push(declaration);
                CashupAppModelObj.ENTRY_DECLERATION_TYPE = declaration_list;
                PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'INS_ENTRY_VOUCHER_DECLARATION').then(function (data) {
                    $scope.IssueSingleVoucherForm.submitted = false;
                    $scope.GET_VOUCHER_MANAGEMENT();
                    $scope.RESET_VOUCHER_ISSUE_SINGLE();
                    if (closeModal) {
                        var modalEl = document.getElementById('issue_single');
                        var existingModal = bootstrap.Modal.getInstance(modalEl);
                        if (existingModal) {
                            existingModal.hide();
                        }
                    }
                });
            }
        }
        if (type == 2) {
            var CashupAppModelObj = new Object();
            CashupAppModelObj.CASHUP_HEADER_ID = null;
            CashupAppModelObj.ENTITY_ID = $scope.VOUCHER_MGT_SEARCH.ENTITY_ID;
            CashupAppModelObj.BRANCH_ID = $scope.VOUCHER_MGT_SEARCH.SELECTED_SITE.BRANCH_ID;
            CashupAppModelObj.USER_ID = $scope.VOUCHER_MGT_SEARCH.USER_ID;
            CashupAppModelObj.ISSUE_TOTAL = 0;
            CashupAppModelObj.REDEEMED_TOTAL = 0;
            CashupAppModelObj.IS_DRAFT = null;
            CashupAppModelObj.STEP_NO = null;
            var declaration_list = [];
            angular.forEach($scope.VOUCHER_ENTRY_LIST, function (_row) {
                var declaration = new Object();
                declaration.TABLE_ID = _row.ID;
                declaration.ENTRY_TYPE_ID = _row.ENTRY_TYPE_ID;
                declaration.ENTRY_TYPE_DETAIL_ID = _row.ENTRY_TYPE_DETAIL_ID;
                declaration.VOUCHER_TYPE = _row.VOUCHER_TYPE;
                declaration.CODE = _row.VOUCHER_NUMBER;
                declaration.VALUE = parseFloat(_row.AMOUNT).toFixed(5);
                declaration.VALIDITY_DATE = moment(_row.VALIDITY_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).format($scope.$parent.DB_DATE_FORMAT);
                declaration.CUSTOMER_NAME = _row.SOLD_TO;
                declaration.MODE = _row.VOUCHER_PAYMENT_METHOD;
                declaration.CHECK_NO = _row.VOUCHER_INVOICE_NUMBER;
                declaration.NOTE = _row.NOTE;
                declaration.IS_REDEEMED = _row.IS_REDEEMED;
                declaration.AUTHORIZED_BY_ID = null;
                declaration.DISCOUNT = null;
                declaration.FOOD = null;
                declaration.DRINKS = null;
                declaration.LIGHT_SPEED_ACCOUNTFISCID = null;
                declaration.IS_DELETED = _row.IS_DELETED;
                declaration.PAYMENT_METHOD_ID = _row.PAYMENT_METHOD_ID;
                declaration.DEPOSIT_CANCELLATION_FEE = null;
                declaration.IS_CANCELLED = _row.IS_CANCELLED;
                declaration.TOTAL_AMT = _row.TOTAL_AMT;
                declaration.UPLOAD_IDS = _row.UPLOAD_IDS;
                declaration.REDEEMED_BY = _row.REDEEMED_BY;
                declaration.IS_EXTERNAL_RECORD = _row.IS_EXTERNAL_RECORD;
                declaration_list.push(declaration);
            });
            CashupAppModelObj.ENTRY_DECLERATION_TYPE = declaration_list;
            PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'INS_ENTRY_VOUCHER_DECLARATION').then(function (data) {

                $scope.GET_VOUCHER_MANAGEMENT();
            });
        }

        if (type == 3) {
            $scope.VoucherRedeemForm.submitted = true;
            if ($scope.VoucherRedeemForm.$valid) {
                var CashupAppModelObj = new Object();
                CashupAppModelObj.CASHUP_HEADER_ID = null;
                CashupAppModelObj.ENTITY_ID = $scope.VOUCHER_MGT_SEARCH.ENTITY_ID;
                CashupAppModelObj.BRANCH_ID = $scope.VOUCHER_MGT_SEARCH.SELECTED_SITE.BRANCH_ID;
                CashupAppModelObj.USER_ID = $scope.VOUCHER_MGT_SEARCH.USER_ID;
                CashupAppModelObj.ISSUE_TOTAL = 0;
                CashupAppModelObj.REDEEMED_TOTAL = 0;
                CashupAppModelObj.IS_DRAFT = null;
                CashupAppModelObj.STEP_NO = null;
                var declaration_list = [];
                angular.forEach($scope.VOUCHER_ENTRY_LIST, function (_row) {
                    var declaration = new Object();
                    declaration.TABLE_ID = _row.ID;
                    declaration.ENTRY_TYPE_ID = _row.ENTRY_TYPE_ID;
                    declaration.ENTRY_TYPE_DETAIL_ID = _row.ENTRY_TYPE_DETAIL_ID;
                    declaration.VOUCHER_TYPE = _row.VOUCHER_TYPE;
                    declaration.CODE = _row.VOUCHER_NUMBER;
                    declaration.VALUE = parseFloat(_row.AMOUNT).toFixed(5);
                    declaration.VALIDITY_DATE = moment(_row.VALIDITY_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).format($scope.$parent.DB_DATE_FORMAT);
                    declaration.CUSTOMER_NAME = _row.SOLD_TO;
                    declaration.MODE = _row.VOUCHER_PAYMENT_METHOD;
                    declaration.CHECK_NO = _row.VOUCHER_INVOICE_NUMBER;
                    declaration.NOTE = _row.NOTE;
                    declaration.IS_REDEEMED = 1;
                    declaration.AUTHORIZED_BY_ID = null;
                    declaration.DISCOUNT = null;
                    declaration.FOOD = null;
                    declaration.DRINKS = null;
                    declaration.LIGHT_SPEED_ACCOUNTFISCID = null;
                    declaration.IS_DELETED = _row.IS_DELETED;
                    declaration.PAYMENT_METHOD_ID = _row.PAYMENT_METHOD_ID;
                    declaration.DEPOSIT_CANCELLATION_FEE = null;
                    declaration.IS_CANCELLED = 0;
                    declaration.TOTAL_AMT = _row.TOTAL_AMT;
                    declaration.UPLOAD_IDS = _row.UPLOAD_IDS;
                    declaration.REDEEMED_BY = _row.REDEEMED_BY;
                    declaration.IS_EXTERNAL_RECORD = _row.IS_EXTERNAL_RECORD;
                    declaration_list.push(declaration);
                });
                CashupAppModelObj.ENTRY_DECLERATION_TYPE = declaration_list;
                PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'INS_ENTRY_VOUCHER_DECLARATION').then(function (data) {
                    $scope.VoucherRedeemForm.submitted = false;
                    var modalEl = document.getElementById('redeem');
                    var existingModal = bootstrap.Modal.getInstance(modalEl);
                    if (existingModal) {
                        existingModal.hide();
                    }
                    $scope.GET_VOUCHER_MANAGEMENT();
                });
            }
        }
    }

    $scope.UPLOAD_VOUCHERS = function () {

        var VoucherList = [];
        $scope.ISVALID = false;
        if ($scope.PREVIEW_VOUCHERS_ENTRY.length > 0) {
            angular.forEach($scope.PREVIEW_VOUCHERS_ENTRY, function (item) {
                var voucher = new Object();
                //voucher.ID = $scope.VoucherSearch.VOUCHER_ID;                
                voucher.INVOICE = item.INVOICE;
                voucher.VOUCHER_TYPE = item.VOUCHER_TYPE;
                voucher.VOUCHER = item.VOUCHER;
                voucher.VOUCHER_AMOUNT = parseFloat(item.AMOUNT).toFixed(5);
                //voucher.VOUCHER_DATE = moment(item.DATE, "DD-MM-YYYY HH:mm:ss").format($scope.$parent.DB_DATE_FORMAT);
                voucher.VOUCHER_DATE = item.DATE;
                voucher.PAYMENT_METHOD = item.PAYMENT_METHOD;
                voucher.SOLD_TO = item.SOLD_TO;
                voucher.NOTE = item.NOTE;
                voucher.COVERS = 1;
                VoucherList.push(voucher);
            });

            var CashupModelObj = new Object();
            //CashupModelObj.VIEW_CASHUP_HEADER_ID = null;
            CashupModelObj.ENTITY_ID = $scope.VOUCHER_MGT_SEARCH.ENTITY_ID;
            CashupModelObj.BRANCH_ID = $scope.VOUCHER_MGT_SEARCH.SELECTED_SITE.BRANCH_ID;
            CashupModelObj.USER_ID = $scope.VOUCHER_MGT_SEARCH.USER_ID
            CashupModelObj.SERVER_FILE_NAME = '../Uploads/' + $scope.VOUCHER_MGT_SEARCH.UploadedFiles[0].FILE_PATH + $scope.VOUCHER_MGT_SEARCH.UploadedFiles[0].SERVER_FILE_NAME;
            CashupModelObj.ORIGINAL_FILE_NAME = $scope.VOUCHER_MGT_SEARCH.UploadedFiles[0].ORIGINAL_FILE_NAME;
            CashupModelObj.VOUCHER_LINE_TYPE = VoucherList;// VoucherList.filter(p => p.CHECK_NO != null);

            PrcCommMethods.CASHUP_APP_API(CashupModelObj, 'UPLOAD_VOUCHERS').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.PREVIEW_VOUCHERS_ENTRY = [];
                    $scope.VOUCHER_UPLOAD_REPORT = data.data.Table;
                    document.getElementById('uploadExcel').value = null;
                    $scope.CODE_ARRY = [];
                    $scope.VOUCHER_MGT_SEARCH.UploadedFiles = null;
                    $scope.INVALID_EXCLE_CELL_COUNT = 0;
                    $scope.COPY_CODE_ARRY = [];
                    $scope.CODE_ARRY = [];
                    $scope.submitted = false;
                    $scope.GENERATE_VOUCHER_UPLOAD_REPORT();
                    if (data.data.Table.filter(_row => _row.IS_REJECTED == true).length == 0) {
                        $scope.$parent.ShowAlertBox('Success', 'Data uploaded successfully.', 3000);
                        $scope.GET_VOUCHER_MANAGEMENT();
                    }
                    var myModal = new bootstrap.Modal(document.getElementById('review_bulk'), {
                        keyboard: false  // Optional: Close modal when pressing ESC
                    });
                    // Show the modal
                    myModal.show();
                }
                else {
                    $scope.$parent.ShowAlertBox('Attention', 'Sorry, unable to upload the data.', 3000);
                    $scope.submitted = false;
                }
            });

            $scope.submitted = false;
        }
        else {
            $scope.$parent.ShowAlertBox('Attention', 'Please upload deposit file.', 3000);
        }
    };

    $scope.EXPORT_PAGE_TO_PDF = function () {
        window.scrollTo(0, 0);
        document.getElementById("loader").style.display = "block";
        const node = document.getElementById("PRINT_REPORT");
        const clone = node.cloneNode(true);
        const liveSiteFilterValue = document.querySelector('#select_label') ?.textContent.trim();
        const liveDateRangeValue = document.querySelector('#reportrange span') ?.textContent.trim();


        var elementsToRemove = clone.querySelectorAll('.col-xxl-2.col-xl-2.col-md-2, .col-xxl-auto.col-xl-auto.col-md-auto');
        elementsToRemove.forEach(el => el.remove());

        elementsToRemove = clone.querySelectorAll('#cashup-report-hide');
        elementsToRemove.forEach(el => el.remove());

        elementsToRemove = clone.querySelectorAll('.form-check-input');
        elementsToRemove.forEach(el => el.remove());

        const reportTitleElement = clone.querySelector('#cashup-report-header h6');

        if (reportTitleElement) {
            reportTitleElement.textContent = 'Vouchers';
        }

        const reportHeader = clone.querySelector('#report_header');

        if (reportHeader) {
            // a. Make the entire header container visible
            reportHeader.classList.remove('d-none');

            // b. Apply Flexbox for alignment
            reportHeader.style.display = 'flex';
            reportHeader.style.justifyContent = 'space-between';
            reportHeader.style.alignItems = 'center';
            reportHeader.style.marginBottom = '20px';

            // c. Find the logo wrapper inside the header and ensure it's visible
            const logoWrapper = reportHeader.querySelector('.logo-wrapper');
            if (logoWrapper) {
                // This removes the .ng-hide class added by ng-show="false"
                logoWrapper.classList.remove('ng-hide');

                // d. Resize the logo image for the PDF
                const logoImages = logoWrapper.querySelectorAll('img');
                logoImages.forEach(img => {
                    img.style.maxWidth = 'none';
                    img.style.maxHeight = 'none';
                    img.style.width = '200px';
                    img.style.height = 'auto';
                });
            }
        }

        // --- Filter Display Logic (uses the new variables) ---
        const filterDisplayBar = document.createElement('div');
        filterDisplayBar.style.display = 'flex';
        filterDisplayBar.style.flexWrap = 'wrap';
        filterDisplayBar.style.gap = '25px';
        filterDisplayBar.style.marginBottom = '20px';
        filterDisplayBar.style.padding = '10px';
        filterDisplayBar.style.border = '1px solid #e0e0e0';
        filterDisplayBar.style.borderRadius = '5px';
        filterDisplayBar.style.backgroundColor = '#f9f9f9';
        filterDisplayBar.style.alignItems = 'center';

        // Use the value read from the LIVE document
        if (liveSiteFilterValue) {
            const siteDisplay = document.createElement('div');
            siteDisplay.innerHTML = `<strong>Site:</strong> ${liveSiteFilterValue}`;
            filterDisplayBar.appendChild(siteDisplay);
        }

        // Use the value read from the LIVE document
        if (liveDateRangeValue) {
            const dateDisplay = document.createElement('div');
            dateDisplay.innerHTML = `<strong>Date Range:</strong> ${liveDateRangeValue}`;
            filterDisplayBar.appendChild(dateDisplay);
        }

        // Now, remove the original container from the clone
        const originalFilterContainer = clone.querySelector('.resCashupHeader');
        if (originalFilterContainer) {
            originalFilterContainer.remove();
        }

        // Insert the new bar into the clone
        if (reportHeader) {
            reportHeader.after(filterDisplayBar);
        }

        const actionColumnCells = clone.querySelectorAll('.cashup-action-column');
        actionColumnCells.forEach(cell => cell.remove());
        // --- END: Filter Display Logic ---

        var HTML = '<html><head><link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/timepicker/1.3.5/jquery.timepicker.min.css">' +
            '<link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />' +
            '<link href="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/fontawesome-pro-6.5.1-web/css/fontawesome.min.css" rel="stylesheet" />' +
            '<link href="https://app.wenodo.com/E_Scripts/Select2angularjs/select2.css" rel="stylesheet" />' +
            '<link href="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/fontawesome-pro-6.5.1-web/css/light.css" rel="stylesheet" />' +
            '<link href="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/fontawesome-pro-6.5.1-web/css/regular.css" rel="stylesheet" />' +
            '<link href="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/fontawesome-pro-6.5.1-web/css/solid.css" rel="stylesheet" />' +
            '<link href="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/fontawesome-pro-6.5.1-web/css/brands.css" rel="stylesheet" />' +
            '<link rel="stylesheet" href="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/bootstrap/bootstrap.css" />' +
            '<link href="https://app.wenodo.com/E_Scripts/daterangepicker-master/daterangepicker.css" rel="stylesheet" />' +
            '<link href="https://app.wenodo.com/E_Scripts/bootstrap-datepicker-1.6.4-dist/css/bootstrap-datepicker3.css" rel="stylesheet" />' +
            '<link href=" https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/css/select2.min.css" rel="stylesheet" />' +
            '<link rel="stylesheet" type="text/css" href="https://app.wenodo.com/E_Content/CustomCss/HR/hr-style.css?v=2" />' +
            '<link rel="stylesheet" type="text/css" href="https://app.wenodo.com/E_Content/CustomCss/HR/responsive.css">' +
            '<link href="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/Countries/intltelinput.min.css" rel="stylesheet" />' +
            '<script src="https://app.wenodo.com/AngularControllers/MasterCntrl.js"></script>' +
            '<script src="https://app.wenodo.com/AngularControllers/HumanResource/HRIndexController.js"></script>' +
            '<script src="https://app.wenodo.com/AngularControllers/HumanResource/UserJourneyController.js"></script>' +
            '<script src="https://app.wenodo.com/E_Scripts/angular-sanitize.min.js"></script>' +
            '<script src="https://app.wenodo.com/E_Scripts/MomentTimePicker/moment-with-locales.min.js"></script>' +
            '<script src="https://app.wenodo.com/E_Scripts/MomentTimePicker/angular-moment-picker.min.js"></script>' +
            '<link href="https://app.wenodo.com/E_Scripts/MomentTimePicker/angular-moment-picker.min.css" rel="stylesheet" />' +
            '<link href="https://app.wenodo.com/E_Content/plugins/croppie/croppie.css" rel="stylesheet" />' +
            '<script src="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/bootstrap/bootstrap.bundle.min.js"></script>' +
            '<script src="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/scrollbar/simplebar.js"></script>' +
            '<script src="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/scrollbar/custom.js"></script>' +
            '<script src="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/apex-chart/apex-chart.js"></script>' +
            '<script src="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/bootstrap/bootstrap-notify.min.js"></script>' +
            '<script src="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/wow/wow.min.js"></script>' +
            '<script src="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/tooltip-init.js"></script>' +
            '<script src="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/script.js"></script>' +
            '<script src="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/height-equal.js"></script>' +
            '<script src="https://app.wenodo.com/E_Scripts/bootstrap-datepicker-1.6.4-dist/js/bootstrap-datepicker.js"></script>' +
            '<script src="https://app.wenodo.com/E_Scripts/daterangepicker-master/daterangepicker.js"></script>' +
            '<script type="text/javascript" src="https://app.wenodo.com/E_Scripts/ExcelPdfJS/html2canvas.min.js"></script>' +
            '<script src="https://app.wenodo.com/E_Scripts/ExcelPdfJS/jspdf.min.js"></script>' +
            '<script src="https://app.wenodo.com/E_Scripts/Calendar/ui-bootstrap-tpls.min.js"></script>' +
            '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css">' +
            '<script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js"></script>' +
            '<script src="//cdnjs.cloudflare.com/ajax/libs/timepicker/1.3.5/jquery.timepicker.min.js"></script>' +
            '<script src="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/sidebar-menu.js"></script>' +
            '<script src="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/Countries/telephone-input.js"></script>' +
            '<script src="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/Countries/intltelinput.min.js"></script>' +
            '<script src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js"></script>' +
            '<script src="https://app.wenodo.com/E_Scripts/Select2angularjs/select2.js"></script>' +
            '<script src="https://app.wenodo.com/E_Scripts/Select2angularjs/select2_locale_sv.js"></script>' +
            '<script src="https://app.wenodo.com/E_Scripts/Select2angularjs/sc-select2.directive.js"></script>' +
            '<script src="https://app.wenodo.com/E_Scripts/ExcelPdfJS/alasql.min.js"></script>' +
            '<script src="https://app.wenodo.com/E_Scripts/ExcelPdfJS/xlsx.core.min.js"></script>' +
            '<script src="https://app.wenodo.com/E_Content/plugins/croppie/croppie.min.js"></script><script src ="https://app.wenodo.com/AngularControllers/CommonMethod.js"></script></head><body>' + clone.innerHTML + '</body></html>';
        let iframe = document.createElement("iframe");
        iframe.style.visibility = "hidden";
        iframe.height = "1000px";
        iframe.width = "1500px";
        document.body.appendChild(iframe);
        let iframedoc = iframe.contentDocument || iframe.contentWindow.document;
        iframedoc.body.innerHTML = HTML;
        html2canvas(iframedoc.body, { useCORS: true, scale: 2 }).then(function (canvas) {
            FILE_NAME = "Float Entry Export";
            var imgBase64 = canvas.toDataURL('image/jpeg', 2.0);
            var doc = "";
            doc = new jsPDF("l", "pt", [canvas.width, canvas.height]);
            const pageWidth = doc.internal.pageSize.width;
            const pageHeight = doc.internal.pageSize.height;
            const widthRatio = pageWidth / canvas.width;
            const heightRatio = pageHeight / canvas.height;
            const ratio = widthRatio > heightRatio ? heightRatio : widthRatio;
            const canvasHeight = canvas.height * ratio;
            const ratio_1 = heightRatio > widthRatio ? widthRatio : heightRatio;
            const canvasWidth = canvas.width * ratio;
            doc.addImage(imgBase64, 'PNG', 20, 50, canvasWidth - 40, canvasHeight);
            doc.save(FILE_NAME + '.pdf');
            document.getElementById("loader").style.display = "none";
            document.querySelectorAll('iframe').forEach(
                function (elem) {
                    elem.parentNode.removeChild(elem);
                });
        });
    }
    $scope.$on('$destroy', function () {
        $('.modal.show').modal('hide');
    });
});