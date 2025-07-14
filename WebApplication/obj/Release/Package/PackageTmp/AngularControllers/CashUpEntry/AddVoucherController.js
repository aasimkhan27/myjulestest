app.controller('VoucherAddListController', function ($scope, $http, $interval, CommService, $cookies, $filter, PrcCommMethods, $location, readFileData, readFileDataNew, $sce) {
    $scope.VoucherSearch = {
        VOUCHER_ID: null,
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        CODE: "",
        VALUE: "",
        VALIDITY_DATE: "",
        CUSTOMER_NAME: "",
        PAYMENT_METHOD_ID: null,
        CHECK_NO: "",
        NOTE: "",
        VOUCHER_TYPE: "Pre-Defined",
        MODE:""
    }
    $scope.vouchernumbervisible = true;
    $scope.MENU_CLICK(6, 'CV');
    $scope.GET_PAYMENT_METHODS = function () {
        var CashupModelObj = new Object();
        CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CashupModelObj.TYPE_ID = 2;
        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_PAYMENT_METHODS').then(function (data) {
            if (data != undefined && data.data != undefined) {
                $scope.PAYMENT_METHODS = data.data.Table.filter(function (x) { return x.FLAG == 3 });
                //$scope.PAYMENT_METHODS_RECEIVED = data.data.Table.filter(function (x) { return x.FLAG == 2 || x.FLAG == 3 });
            } else {
                $scope.PaymentList = null;
            }
        });
    }
    $scope.SetPayment = function (PaymentMethodId) {
         
        for (var i = 0; i < $scope.PAYMENT_METHODS.length; i++) {
            if ($scope.PAYMENT_METHODS[i].PAYMENT_METHOD_ID == PaymentMethodId) {
                $scope.VoucherSearch.METHOD_NAME = $scope.PAYMENT_METHODS[i].METHOD_NAME;
                $scope.VoucherSearch.MODE = $scope.PAYMENT_METHODS[i].METHOD_NAME;
                break;
            }
        }

    }
    //------------------------Select Redeeemed Data----------------------
    $scope.GET_PAYMENT_METHODS();


    $scope.RESETPAGESEARCH = function () {
        $scope.VoucherSearch.INVOICENUMBER = null;
        $scope.VoucherSearch.DEPOSIT_REFERENCE = null;
        $scope.VoucherSearch.PAYMENT_MODE_ID = null;
        $scope.VoucherSearch.PAYEE_NAME = null;
    }


    $scope.CheckDecimal = function (VISS) {
        if ($scope.VoucherSearch.VALUE == '.') {
            $scope.VoucherSearch.VALUE = '';
        }
    };
    $scope.GET_ENTRY_MASTER_DETAILS = function () {

        var CashupModelObj = new Object();
        CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CashupModelObj.BRANCH_ID = $scope.VoucherSearch.FILTER_BRANCH_ID;
        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_ENTRY_MASTER_DETAILS').then(function (data) {
            if (data != undefined && data.data != undefined) {
                $scope.MasterEntryList = data.data.Table;
              
            }
        });

    }
    $scope.SetVoucherValues_basisType = function (VOUCHER_TYPE) {
        
        //VISS.VOUCHER = null;
        //VISS.VALUE = null;
        //VISS.CODE = null;
        //VISS.VALIDITY_DATE = null;
        //VISS.ENTRY_TYPE_DETAIL_ID = null;
        $scope.VoucherSearch.CODE = "";
        $scope.VoucherSearch.VALUE = "";
        $scope.VoucherSearch.VALIDITY_DATE = "";
        $scope.VoucherSearch.CUSTOMER_NAME = "";
        $scope.VoucherSearch.PAYMENT_METHOD_ID = null;
        $scope.VoucherSearch.NOTE = "";
        $scope.VoucherSearch.MODE = "";
        
        if (VOUCHER_TYPE == 'Open Voucher') {
            $scope.vouchernumbervisible = false;
        }
        else {
            $scope.vouchernumbervisible = true;
        }
    };

    $scope.LAZY_GET_VOUCHER_LIST = function () {
        $scope.GET_OPEN_VOUCHER_DETAILS();
    };
    
    $scope.GET_OPEN_VOUCHER_DETAILS = function (FLAG) {

        var CashupModelObj = new Object();
        if (FLAG == 1) {
            $scope.VOUCHER_LIST = [];
            $scope.VoucherSearch.PAGE_NO = 1;
        }
        CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CashupModelObj.BRANCH_ID = $scope.VoucherSearch.FILTER_BRANCH_ID;
        CashupModelObj.CUSTOMER_NAME = $scope.VoucherSearch.FILTER_CUSTOMER_NAME;
        CashupModelObj.INVOICE_NUMBER = $scope.VoucherSearch.FILTER_INVOICE_NUMBER;
        CashupModelObj.VOUCHER_REFERENCE = $scope.VoucherSearch.FILTER_VOUCHER_REFERENCE;
        CashupModelObj.PAYMENT_MODE_ID = $scope.VoucherSearch.FILTER_PAYMENT_MODE_ID;
        CashupModelObj.VOUCHER_TYPE = $scope.VoucherSearch.FILTER_VOUCHER_TYPE;
        CashupModelObj.PAGE_NO = $scope.VoucherSearch.PAGE_NO;
        CashupModelObj.PAGE_SIZE = $scope.VoucherSearch.PAGE_SIZE;
        CashupModelObj.IS_SHOW_REDEEMED = 1;
        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_OPEN_VOUCHER_DETAILS').then(function (data) {

            if (data != undefined && data.data != undefined) {
                if (FLAG == 1) {
                    $scope.VOUCHER_LIST = [];
                    $scope.VOUCHER_LIST = data.data.Table;
                } else {
                    $scope.VOUCHER_LIST = $scope.VOUCHER_LIST.concat(data.data.Table);
                }
                $scope.VOUCHER_LIST = ($filter('filter')($scope.VOUCHER_LIST, { ENTRY_TYPE_ID: 1}));              
                if (data.data.Table.length < $scope.VoucherSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.VoucherSearch.PAGE_NO = parseInt($scope.VoucherSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }              
            }
            else {
                $scope.GetData = false;                
            }
            $scope.overlay_loadingNew = 'none';

        });
    }
    $scope.UPLOAD_VOUCHER_CHECK = function () {
        
        if ($scope.VoucherSearch.CODE != null && $scope.VoucherSearch.CODE != "") {

            var CashupModelObj = new Object();
            CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            CashupModelObj.BRANCH_ID = $scope.VoucherSearch.BRANCH_ID;
            CashupModelObj.VOUCHER = $scope.VoucherSearch.CODE;
            PrcCommMethods.CASHUP_API(CashupModelObj, 'UPLOAD_VOUCHER_CHECK').then(function (data) {
                if (data != undefined && data.data != undefined && data.data.length > 0) {
                    $scope.V_CHK = false;
                    if (data.data[0].SUCCESS_STATUS == true) {
                        $scope.V_CHK = true;
                        $scope.VoucherSearch.CODE = "";
                        $scope.VoucherSearch.VALUE = "";
                        $scope.VoucherSearch.VALIDITY_DATE = "";
                        $scope.VoucherSearch.CUSTOMER_NAME = "";
                        $scope.VoucherSearch.PAYMENT_METHOD_ID = null;
                        $scope.VoucherSearch.NOTE = "";
                        $scope.VoucherSearch.MODE = "";
                        //$scope.AddVoucherForm.submitted = true;
                        $scope.$parent.ShowAlert("Attention", "Voucher # entry is already exist.", 3000);
                    }
                    //else {
                    //    $scope.V_CHK = false;
                    //}
                }
            });
        } else {
            $scope.V_CHK = false;
            $scope.AddVoucherForm.submitted = true;
        }

    }
    $scope.RESET_ADDCANCEL = function () {
        $scope.VoucherSearch.CODE = "";
        $scope.VoucherSearch.VALUE = "";
        $scope.VoucherSearch.VALIDITY_DATE = "";
        $scope.VoucherSearch.CUSTOMER_NAME = "";
        $scope.VoucherSearch.PAYMENT_METHOD_ID = null;
        $scope.VoucherSearch.CHECK_NO = "";
        $scope.VoucherSearch.NOTE = "";
        $scope.VoucherSearch.VOUCHER_TYPE = "Pre-Defined";
        $scope.AddVoucherForm.submitted = false;
        $scope.vouchernumbervisible = true;

    }
    $scope.RESET_GET_VOUCHER = function () {
        $scope.VoucherSearch.FILTER_INVOICE_NUMBER = "";
        $scope.VoucherSearch.FILTER_VOUCHER_TYPE = "";
        $scope.VoucherSearch.FILTER_VOUCHER_REFERENCE = "";
        $scope.VoucherSearch.FILTER_CUSTOMER_NAME = "";
        $scope.VoucherSearch.FILTER_PAYMENT_MODE_ID = null;
        $scope.VOUCHER_LIST = [];
        $scope.GET_OPEN_VOUCHER_DETAILS(1);
    }
    //$scope.ADD_AMT_CANCEL = function (LINE) {
    //    $('#CancelVoucherForm').modal('show');
    //    $scope.SELECTED_LINE = "";
    //    $scope.SELECTED_LINE = angular.copy(LINE);
    //}


    var objBrach = new Object();
    objBrach.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
    objBrach.USER_ID = parseInt($cookies.get("USERID"));
    objBrach.MODULE_ID = 1;
    objBrach.PRIVILEGE_ID = $scope.$parent.CheckSubModuleAccess(123) ? 123 : 0;
    objBrach.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));

    PrcCommMethods.CASHUP_API(objBrach, "GET_BRANCH_LIST_BY_PRIVILEGE").then(function (data) {
        $scope.BRANCH_LIST = data.data.Table;
        if ($scope.BRANCH_LIST.length > 0) {
            $scope.VoucherSearch.BRANCH_ID = $scope.BRANCH_LIST[0].BRANCH_ID;
            $scope.VoucherSearch.FILTER_BRANCH_ID = $scope.BRANCH_LIST[0].BRANCH_ID;
            $scope.GET_OPEN_VOUCHER_DETAILS(1);
            $scope.GET_ENTRY_MASTER_DETAILS();
        }
    });   

    $scope.INSERT_ENTRY_VOUCHER_DECLARATION = function (FLAG_CONT) {
        if (($scope.VoucherSearch.CODE != "" && $scope.VoucherSearch.CODE != undefined) || ($scope.VoucherSearch.VALUE != "" && $scope.VoucherSearch.VALUE != undefined) || ($scope.VoucherSearch.VALIDITY_DATE != "" && $scope.VoucherSearch.VALIDITY_DATE != undefined) || ($scope.VoucherSearch.CUSTOMER_NAME != "" && $scope.VoucherSearch.CUSTOMER_NAME != undefined) || ($scope.VoucherSearch.PAYMENT_METHOD_ID != null && $scope.VoucherSearch.PAYMENT_METHOD_ID != undefined) || ($scope.VoucherSearch.CHECK_NO != "" && $scope.VoucherSearch.CHECK_NO != undefined) || ($scope.VoucherSearch.NOTE != "" && $scope.VoucherSearch.NOTE != undefined)) {
            $scope.AddVoucherForm.submitted = true;
        } else {
            $scope.AddVoucherForm.submitted = false;
        }

        if ($scope.AddVoucherForm.$valid && $scope.V_CHK==false) {

            var VoucherList = [];
            var ISSUE_TOTAL = 0;
            var REDEEMED_TOTAL = 0;

            var voucher = new Object();
            voucher.ID = $scope.VoucherSearch.VOUCHER_ID;
            voucher.ENTRY_TYPE_ID = 1// voucherissue.ENTRY_TYPE_ID;
            voucher.ENTRY_TYPE_DETAIL_ID = $scope.VoucherSearch.ENTRY_TYPE_DETAIL_ID != null && $scope.VoucherSearch.ENTRY_TYPE_DETAIL_ID != undefined ? VoucherSearch.ENTRY_TYPE_DETAIL_ID:0// voucherissue.ENTRY_TYPE_DETAIL_ID;
            voucher.VOUCHER_TYPE = $scope.VoucherSearch.VOUCHER_TYPE// voucherissue.VOUCHER_TYPE;
            voucher.CODE = $scope.VoucherSearch.CODE != null ? $scope.VoucherSearch.CODE : "";
            voucher.VALUE = parseFloat($scope.VoucherSearch.VALUE).toFixed(5);
            voucher.VALIDITY_DATE = $scope.VoucherSearch.VALIDITY_DATE;
            voucher.CUSTOMER_NAME = $scope.VoucherSearch.CUSTOMER_NAME + '';
            voucher.MODE = $scope.VoucherSearch.MODE;
            //var MODE = $scope.PAYMENT_METHODS.filter(function (x) { return x.PAYMENT_METHOD_ID == $scope.VoucherSearch.PAYMENT_METHOD_ID });
            //if (MODE.length > 0) {
            //    voucher.MODE = MODE[0].METHOD_NAME;
            //}
            voucher.PAYMENT_METHOD_ID = $scope.VoucherSearch.PAYMENT_METHOD_ID;
            voucher.CHECK_NO = $scope.VoucherSearch.CHECK_NO;
            voucher.NOTE = $scope.VoucherSearch.NOTE + '';
            voucher.IS_REDEEMED = false;
            voucher.IS_COMPLIMENTARY = false;
            voucher.IS_DELETED = 0;
            voucher.DEPOSIT_CANCELLATION_FEE = null;
            voucher.IS_CANCELLED = 0;
            voucher.TOTAL_AMT = voucher.VALUE;
            VoucherList.push(voucher);

            var CashupModelObj = new Object();
            CashupModelObj.VIEW_CASHUP_HEADER_ID = null;
            CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            CashupModelObj.BRANCH_ID = $scope.VoucherSearch.BRANCH_ID;
            CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
            CashupModelObj.ISSUE_TOTAL = ISSUE_TOTAL;
            CashupModelObj.REDEEMED_TOTAL = REDEEMED_TOTAL;
            CashupModelObj.DECLARATION_DETAILS = VoucherList;
            
            PrcCommMethods.CASHUP_API(CashupModelObj, 'VIEW_INS_ENTRY_VOUCHER_DECLARATION').then(function (data) {
                if (data.data == 1) {
                    $scope.VoucherSearch.CODE = "";
                    $scope.VoucherSearch.VALUE = "";
                    $scope.VoucherSearch.VALIDITY_DATE = "";
                    $scope.VoucherSearch.CUSTOMER_NAME = "";
                    $scope.VoucherSearch.PAYMENT_METHOD_ID = null;
                    $scope.VoucherSearch.CHECK_NO = "";
                    $scope.VoucherSearch.NOTE = "";
                    $scope.VoucherSearch.MODE = "";
                    $scope.VoucherSearch.VOUCHER_TYPE = "Pre-Defined";
                    $scope.V_CHK = true;
                    if (FLAG_CONT == undefined) {
                        $('#Add_Vouchers').modal('hide');
                    }
                    $scope.GET_OPEN_VOUCHER_DETAILS(1);
                    $scope.AddVoucherForm.submitted = false;
                }
            });
        }
    };

    $scope.CANCEL_ENTRY_VOUCHER_DECLARATION = function (LINE) {
        $scope.SELECTED_LINE = "";
        $scope.SELECTED_LINE = angular.copy(LINE);
       // if ($scope.CancelVoucherForm.$valid) {
        if (confirm('Are you sure you want to cancel this voucher?')) {
            var VoucherList = [];
            var ISSUE_TOTAL = 0;
            var REDEEMED_TOTAL = 0;

            var voucher = new Object();
            voucher.ID = $scope.SELECTED_LINE.ID;            
            voucher.ENTRY_TYPE_ID = 1// voucherissue.ENTRY_TYPE_ID;
            voucher.ENTRY_TYPE_DETAIL_ID = $scope.SELECTED_LINE.ENTRY_TYPE_DETAIL_ID;// voucherissue.ENTRY_TYPE_DETAIL_ID;
            voucher.VOUCHER_TYPE = $scope.SELECTED_LINE.VOUCHER_TYPE// voucherissue.VOUCHER_TYPE;
            voucher.CODE = $scope.SELECTED_LINE.CODE != null ? $scope.SELECTED_LINE.CODE : "";
            voucher.VALUE = parseFloat($scope.SELECTED_LINE.VALUE).toFixed(5);
            voucher.VALIDITY_DATE = $scope.SELECTED_LINE.VALIDITY_DATE;
            voucher.CUSTOMER_NAME = $scope.SELECTED_LINE.CUSTOMER_NAME;
            voucher.MODE = $scope.SELECTED_LINE.MODE;
            voucher.PAYMENT_METHOD_ID = $scope.SELECTED_LINE.PAYMENT_METHOD_ID;
            voucher.CHECK_NO = $scope.SELECTED_LINE.CHECK_NO;
            voucher.NOTE = $scope.SELECTED_LINE.NOTE;
            voucher.IS_REDEEMED = false;
            voucher.IS_COMPLIMENTARY = false;
            voucher.IS_DELETED = 0;
            voucher.DEPOSIT_CANCELLATION_FEE = 0;//$scope.SELECTED_LINE.CANCEL_AMT;
            voucher.IS_CANCELLED = true;
            voucher.TOTAL_AMT = voucher.VALUE;
            VoucherList.push(voucher);
            var CashupModelObj = new Object();
            CashupModelObj.VIEW_CASHUP_HEADER_ID = null;
            CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            CashupModelObj.BRANCH_ID = $scope.VoucherSearch.BRANCH_ID;
            CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
            CashupModelObj.ISSUE_TOTAL = ISSUE_TOTAL;
            CashupModelObj.REDEEMED_TOTAL = REDEEMED_TOTAL;
            CashupModelObj.DECLARATION_DETAILS = VoucherList;
            CashupModelObj.STEP_NO = 9;
            PrcCommMethods.CASHUP_API(CashupModelObj, 'VIEW_INS_ENTRY_VOUCHER_DECLARATION').then(function (data) {
                if (data.data != null && data.data != undefined && data.data != 0) {
                    $scope.SELECTED_LINE = "";
                 //   $('#CancelVoucherForm').modal('hide');
                    $scope.GET_OPEN_VOUCHER_DETAILS(1);
                    //$scope.CancelVoucherForm.submitted = false;
                }
            });
        }
    };
    $scope.CANCEL_RESET = function () {
        $scope.CancelVoucherForm.submitted = false;
        $scope.SELECTED_LINE.CANCEL_AMT = null;
        $scope.SELECTED_LINE.CANCEL_NOTES = null;
    }
    $scope.$parent.dateinputOpenDate();
    $scope.REDIRECTION_PAGE = function (Path) {
        $location.path(Path)
    };
});

app.controller('VoucherUploadController', function ($scope, $http, $interval, CommService, $cookies, $filter, PrcCommMethods, $location, readFileData, readFileDataNew, $sce) {
    $scope.PAGE_LOAD = 1;
    $scope.$parent.dateinputOpenDate();
    $scope.DOWNLOAD_FILE_PATH = "/Uploads/Voucher_Template.xlsx";
    $scope.VoucherSearch = {
        VOUCHER_ID: null,
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        UploadedFiles: null,
        PAGE_NO_DTL: 1,
        PAGE_SIZE_NO_DTL: 500,
        UPL_FILE_FLAG: 1,
        ORIGINAL_FILE_NAME: '',
        SERVER_FILE_NAME: '',
        ENTITY_ID: null,
        BRANCH_ID: null
    };
    $scope.MENU_CLICK(6, 'CV');
    $scope.VOUCHER_VALIDATE_LIST = [];
    $scope.VOUCHER_TABLE = [{ ID: 1, COLUMN_NAME: 'INVOICE', IS_MANDATORY: true, HEADER_NAME: 'INVOICE', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, FIELD_MASTER_ID: -1 },
        { ID: 2, COLUMN_NAME: 'VOUCHER_TYPE', IS_MANDATORY: true, HEADER_NAME: 'VOUCHER_TYPE', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, FIELD_MASTER_ID: -1 },
        { ID: 3, COLUMN_NAME: 'VOUCHER', IS_MANDATORY: true, HEADER_NAME: 'VOUCHER', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, FIELD_MASTER_ID: -1 },
        { ID: 4, COLUMN_NAME: 'AMOUNT', IS_MANDATORY: true, HEADER_NAME: 'AMOUNT', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, FIELD_MASTER_ID: -1 },//TIME DATATYPE
        { ID: 5, COLUMN_NAME: 'DATE', IS_MANDATORY: true, HEADER_NAME: 'DATE', FIELD_TYPE_ID: 9, VALUES_ENTITY: '', ACTIVE: true, FIELD_MASTER_ID: -1 },
        { ID: 6, COLUMN_NAME: 'PAYMENT_METHOD', IS_MANDATORY: true, HEADER_NAME: 'PAYMENT_METHOD', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, FIELD_MASTER_ID: -1 },
        { ID: 7, COLUMN_NAME: 'SOLD_TO', IS_MANDATORY: false, HEADER_NAME: 'SOLD_TO', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, FIELD_MASTER_ID: -1 },
        { ID: 8, COLUMN_NAME: 'NOTE', IS_MANDATORY: false, HEADER_NAME: 'NOTE', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, FIELD_MASTER_ID: -1 }];
    function reportrange(startDate, endDate) {
        $scope.VoucherSearch.START_DATE_FILTER = startDate.format($scope.$parent.Datelocaleformat.format);
        $scope.VoucherSearch.END_DATE_FILTER = endDate.format($scope.$parent.Datelocaleformat.format);
        $('#reportrange span').html(startDate.format($scope.$parent.Datelocaleformat.format) + ' - ' + endDate.format($scope.$parent.Datelocaleformat.format));

    };
    $scope.NG_PAGE_LOAD = function () {
        $(function () {
            startDate = moment().startOf('month');//moment().startOf('isoWeek');//moment().subtract(6, 'days');
            endDate = moment().endOf('month'); //moment().subtract(0, 'days');
            $scope.$parent.SetUpDateRangeMultiDatePicker('reportrange', startDate, endDate, reportrange);
            $scope.$parent.SetUpDateRangeMultiDatePicker('reportrangeCoverView', startDate, endDate, reportrangeCoverView);
            $('#reportrange span').html(startDate.format($scope.$parent.Datelocaleformat.format) + ' - ' + endDate.format($scope.$parent.Datelocaleformat.format));
        });
    }
    $scope.NG_PAGE_LOAD();
    $scope.RESETPAGESEARCH = function () {
        $scope.VoucherSearch.INVOICENUMBER = null;
        $scope.VoucherSearch.DEPOSIT_REFERENCE = null;
        $scope.VoucherSearch.PAYMENT_MODE_ID = null;
        $scope.VoucherSearch.PAYEE_NAME = null;
    };

    $scope.CheckDecimal = function (VISS) {
        if ($scope.VoucherSearch.VALUE == '.') {
            $scope.VoucherSearch.VALUE = '';
        }
    };


    var objBrach = new Object();
    objBrach.USER_ID = parseInt($cookies.get("USERID"));
    objBrach.MODULE_ID = 1;
    objBrach.PRIVILEGE_ID = $scope.$parent.CheckSubModuleAccess(123) ? 123 : 0;
    objBrach.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));

    PrcCommMethods.CASHUP_API(objBrach, "GET_BRANCH_LIST_BY_PRIVILEGE").then(function (data) {
        $scope.BRANCH_LIST = data.data.Table;
        if ($scope.BRANCH_LIST.length > 0) {
            $scope.VoucherSearch.BRANCH_ID = $scope.BRANCH_LIST[0].BRANCH_ID;
            //  $scope.VoucherSearch.BRANCH_ID_FILTER = $scope.BRANCH_LIST[0].BRANCH_ID;
            $scope.GET_DEPOSITS(1);
        }
    });
  
    $scope.UPLOAD_VOUCHERS = function () {
        
        var VoucherList = [];
        var voucher = new Object();
        $scope.ISVALID = false;
        if ($scope.VOUCHER_VALIDATE_LIST.length > 0) {
            angular.forEach($scope.VOUCHER_VALIDATE_LIST, function (item) {
                var voucher = new Object();
                //voucher.ID = $scope.VoucherSearch.VOUCHER_ID;                
                voucher.INVOICE = item.INVOICE;
                voucher.VOUCHER_TYPE = item.VOUCHER_TYPE;
                voucher.VOUCHER = item.VOUCHER;
                voucher.VOUCHER_AMOUNT = parseFloat(item.AMOUNT).toFixed(5);
                voucher.VOUCHER_DATE = item.DATE;
                voucher.PAYMENT_METHOD = item.PAYMENT_METHOD;
                voucher.SOLD_TO = item.SOLD_TO;
                voucher.NOTE = item.NOTE;
                voucher.COVERS = 1;
                VoucherList.push(voucher);
            });

            var CashupModelObj = new Object();
            //CashupModelObj.VIEW_CASHUP_HEADER_ID = null;
            CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            CashupModelObj.BRANCH_ID = $scope.VoucherSearch.BRANCH_ID;
            CashupModelObj.USER_ID = parseInt($cookies.get("USERID")); // '../Uploads/' + $scope.CoversSearch.UploadedFiles[0].FILE_PATH + $scope.CoversSearch.UploadedFiles[0].SERVER_FILE_NAME;
            CashupModelObj.SERVER_FILE_NAME = '../Uploads/' + $scope.VoucherSearch.UploadedFiles[0].FILE_PATH + $scope.VoucherSearch.UploadedFiles[0].SERVER_FILE_NAME;
            CashupModelObj.ORIGINAL_FILE_NAME = $scope.VoucherSearch.UploadedFiles[0].ORIGINAL_FILE_NAME;
            CashupModelObj.VOUCHER_LINE_TYPE = VoucherList;// VoucherList.filter(p => p.CHECK_NO != null);

            PrcCommMethods.CASHUP_API(CashupModelObj, 'UPLOAD_VOUCHERS').then(function (data) {

                if (data.data != null && data.data != undefined && data.data != 0) {
                    $scope.$parent.ShowAlert('Success', 'Data uploaded successfully.', 3000);


                    $scope.VOUCHER_VALIDATE_LIST = [];
                    document.getElementById('uploadExcel1').value = null;
                    $scope.VOUCHER_VALIDATE_LIST = [];
                    $scope.CODE_ARRY = [];
                    $scope.VoucherSearch.UploadedFiles = null;
                    $scope.INVALID_EXCLE_CELL_COUNT = 1;
                    $scope.COPY_CODE_ARRY = [];
                    $scope.CODE_ARRY = [];
                    $scope.submitted = false;
                   $scope.GET_VOUCHER_LOG_HDR();
                }
                else {
                    $scope.$parent.ShowAlert('Attention', 'Sorry, unable to upload the data.', 3000);
                    $scope.submitted = false;
                }

            });
            $scope.UploadepositForm.submitted = false;
            $scope.submitted = false;
        }
        else {
            $scope.$parent.ShowAlert('Attention', 'Please upload deposit file.', 3000);
        }
    };

   

    $scope.$on('ngRepeatFinishedRender', function (ngRepeatFinishedEvent) {
        $scope.CODE_ARRY = $scope.COPY_CODE_ARRY;
    });

    $scope.Refreshdata = function () {
        $scope.INVALID_EXCLE_CELL_COUNT = 1;
        $scope.COPY_CODE_ARRY = [];
        $scope.CODE_ARRY = [];
        $scope.submitted = false;
    };

    $scope.FILEUPLOADCLICK = function () {
        $scope.Refreshdata();
    };

    $scope.EXCEL_VOUCHER_VALIDATE = function () {

        $scope.COPY_CODE_ARRY = [];
        $scope.CODE_ARRY = [];
        $scope.INVALID_EXCLE_CELL_COUNT = 1;
        if (document.getElementById('uploadExcel1').value != null && document.getElementById('uploadExcel1').value != '') {
            ModelObj = new Object();
            ModelObj.UPLOAD_TYPE_ID = 1;
            ModelObj.SERVER_FILE_NAME = $scope.VoucherSearch.UploadedFiles[0].SERVER_FILE_NAME;
            ModelObj.ORIGINAL_FILE_NAME = $scope.VoucherSearch.UploadedFiles[0].ORIGINAL_FILE_NAME;
            ModelObj.FILE_PATH = $scope.VoucherSearch.UploadedFiles[0].FILE_PATH + $scope.VoucherSearch.UploadedFiles[0].SERVER_FILE_NAME;
            ModelObj.DATETIME_FORMAT_CULTURE = ["MM/dd/yyyy hh:mm:ss tt", "M/d/yyyy hh:mm:ss tt", "MM/dd/yyyy", "M/d/yyyy"];
            ModelObj.LANGUAGE_SYMBOL = $scope.$parent.LANGUAGE_SYMBOL;
            ModelObj.EXCEL_DATATABLE = $scope.VOUCHER_TABLE;
            PrcCommMethods.CASHUP_API(ModelObj, 'EXCEL_COVERS_VALIDATE').then(function (data) {
                $scope.VOUCHER_VALIDATE_LIST = [];
                $scope.submitted = true;
                $scope.VOUCHER_VALIDATE_LIST = data.data.HEADER_CLOUMN_NAMES;

                if (data.data.IS_VALID_COUNT > 0) {
                    $scope.INVALID_EXCLE_CELL_COUNT = parseInt(data.data.IS_VALID_COUNT);
                    $scope.INVALID_EXCLE_CELL_FLAG = true;
                    //$('#View_Report').modal('show');
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
                    $scope.INVALID_EXCLE_CELL_FLAG = false;
                    $scope.INVALID_EXCLE_CELL_COUNT = parseInt(data.data.IS_VALID_COUNT);
                    $scope.$parent.ShowAlert('Success', 'File validated successfully,please click on submit', 5000);
                }
            });
            $scope.submitted = false;
        }
        else {
            $scope.$parent.ShowAlert('Attention', 'Please Upload File', 3000);
            $scope.submitted = false;
        }
    };

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

    $scope.RESET_UPLOAD = function () {
        $scope.Refreshdata();
        document.getElementById('uploadExcel1').value = null;
        $scope.VOUCHER_VALIDATE_LIST = [];
        $scope.CODE_ARRY = [];
        $scope.VoucherSearch.UploadedFiles == null;
        $scope.submitted = false;
    };
    //====================== View record=======================
    $scope.GET_VOUCHER_LOG_HDR = function (FLAG) {
        if (FLAG == undefined) {
            $scope.VOUCHER_LOG_HDR_DETAILS = [];
            $scope.VoucherSearch.PAGE_NO = 1;
        }
        ModelObj = new Object();
        ModelObj.USER_NAME = $scope.VoucherSearch.USER_NAME;
        ModelObj.ORIGINAL_FILE_NAME = $scope.VoucherSearch.ORIGINAL_FILE_NAME;
        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        ModelObj.BRANCH_ID = $scope.VoucherSearch.BRANCH_ID_FILTER;
        //ModelObj.START_DATE = $scope.VoucherSearch.START_DATE_FILTER;
        //ModelObj.END_DATE = $scope.VoucherSearch.END_DATE_FILTER;
        ModelObj.PAGE_NO = $scope.VoucherSearch.PAGE_NO;
        ModelObj.PAGE_SIZE = $scope.VoucherSearch.PAGE_SIZE;
        PrcCommMethods.CASHUP_API(ModelObj, 'GET_UPLOAD_VOUCHERS').then(function (data) {
            if (data.data.Table.length > 0) {
                if (FLAG == undefined) {
                    $scope.VOUCHER_LOG_HDR_DETAILS = [];
                    $scope.VOUCHER_LOG_HDR_DETAILS = data.data.Table;
                } else {
                    $scope.VOUCHER_LOG_HDR_DETAILS = $scope.VOUCHER_LOG_HDR_DETAILS.concat(data.data.Table);
                }
                if (data.data.Table.length < $scope.VoucherSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.VoucherSearch.PAGE_NO = parseInt($scope.VoucherSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else {
                $scope.GetData = false;
            }
            
        });
    };

    function reportrange(startDate, endDate) {
        $scope.VoucherSearch.START_DATE_FILTER = startDate.format($scope.$parent.Datelocaleformat.format);
        $scope.VoucherSearch.END_DATE_FILTER = endDate.format($scope.$parent.Datelocaleformat.format);
        $('#reportrange span').html(startDate.format($scope.$parent.Datelocaleformat.format) + ' - ' + endDate.format($scope.$parent.Datelocaleformat.format));

    };
    function reportrangeCoverView(startDate, endDate) {
        $scope.VoucherSearch.START_DATE_VIEW_FILTER = startDate.format($scope.$parent.Datelocaleformat.format);
        $scope.VoucherSearch.END_DATE_VIEW_FILTER = endDate.format($scope.$parent.Datelocaleformat.format);
        $('#reportrangeCoverView span').html(startDate.format($scope.$parent.Datelocaleformat.format) + ' - ' + endDate.format($scope.$parent.Datelocaleformat.format));
    };

    $scope.NG_PAGE_LOAD = function () {
        $(function () {
            startDate = moment().startOf('month');//moment().startOf('isoWeek');//moment().subtract(6, 'days');
            endDate = moment().endOf('month'); //moment().subtract(0, 'days');
            $scope.$parent.SetUpDateRangeMultiDatePicker('reportrange', startDate, endDate, reportrange);
            $scope.$parent.SetUpDateRangeMultiDatePicker('reportrangeCoverView', startDate, endDate, reportrangeCoverView);
            $('#reportrange span').html(startDate.format($scope.$parent.Datelocaleformat.format) + ' - ' + endDate.format($scope.$parent.Datelocaleformat.format));
            $('#reportrangeCoverView span').html(startDate.format($scope.$parent.Datelocaleformat.format) + ' - ' + endDate.format($scope.$parent.Datelocaleformat.format));
        });
    }
    $scope.NG_PAGE_LOAD();
    $scope.GET_VOUCHER_LOG_HDR();
    $scope.showPage=function() {
        document.getElementById("loader").style.display = "none";
        //document.getElementById("myDiv").style.display = "block";
    }
    $scope.LAZY_VOUCHER_LOG_HDR_DETAILS = function () {
        //var myVar;
        //myVar = setTimeout($scope.showPage(), 3000);
        $scope.GET_VOUCHER_LOG_HDR(1);
    };

    $scope.RESET_FILTER = function () {
        $scope.VoucherSearch.USER_NAME = null;
        $scope.VoucherSearch.BRANCH_ID_FILTER = null;
        $scope.VoucherSearch.ORIGINAL_FILE_NAME = null;
        $scope.VOUCHER_LOG_HDR_DETAILS = [];
        //var objBrach = new Object();
        //objBrach.USER_ID = parseInt($cookies.get("USERID"));
        //objBrach.MODULE_ID = 1;
        //objBrach.PRIVILEGE_ID = $scope.$parent.CheckSubModuleAccess(123) ? 123 : 0;
        //objBrach.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));

        //PrcCommMethods.CASHUP_API(objBrach, "GET_BRANCH_LIST_BY_PRIVILEGE").then(function (data) {
        //    $scope.BRANCH_LIST = data.data.Table;
        //    if ($scope.BRANCH_LIST.length > 0) {
        //       // $scope.VoucherSearch.BRANCH_ID = $scope.BRANCH_LIST[0].BRANCH_ID;
        //        $scope.VoucherSearch.BRANCH_ID_FILTER = $scope.BRANCH_LIST[0].BRANCH_ID;
        //        $scope.GET_DEPOSITS(1);
        //    }
        //});
        $scope.GET_VOUCHER_LOG_HDR();

    }
    $scope.LAZY_VOUCHER_LOG_DETAILS = function (COVER) {

        $scope.GET_VOUCHER_LOG_DTL(COVER, 1)
    }

    $scope.GET_VOUCHER_LOG_DTL = function (COVER, FLAG) {

        if (FLAG == undefined) {
            $scope.VOUCHER_LOG_DETAILS = [];
            $scope.VoucherSearch.PAGE_NO_DTL = 1;
        }
        $scope.COVERS_LINE = COVER;
        $scope.UPLOADED_FILE_NAME = COVER.ORIGINAL_FILE_NAME;
        if (COVER.VOUCHER_LOG_DETAILS == undefined || COVER.VOUCHER_LOG_DETAILS.length == 0 || FLAG == 1) {
            ModelObj = new Object();
            ModelObj.VOUCHER_LOG_HDR_ID = COVER.UPLOAD_VOUCHER_ID;
            ModelObj.PAGE_NO = $scope.VoucherSearch.PAGE_NO_DTL;
            ModelObj.PAGE_SIZE = $scope.VoucherSearch.PAGE_SIZE_NO_DTL;
            PrcCommMethods.CASHUP_API(ModelObj, 'GET_UPLOAD_VOUCHER_LINE_LOG').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.VOUCHER_LOG_DETAILS = $scope.VOUCHER_LOG_DETAILS.concat(data.data.Table);
                    if (data.data.Table.length < $scope.VoucherSearch.PAGE_SIZE_NO_DTL) {
                        $scope.GetDataDTL = false;
                    }
                    else {
                        $scope.VoucherSearch.PAGE_NO_DTL = parseInt($scope.VoucherSearch.PAGE_NO_DTL) + 1;
                        $scope.GetDataDTL = true;
                    }
                }
                else {
                    $scope.GetDataDTL = false;
                }
                COVER.VOUCHER_LOG_DETAILS = $scope.VOUCHER_LOG_DETAILS;
            });
        }
        else {
            $scope.VOUCHER_LOG_DETAILS = [];
            $scope.VOUCHER_LOG_DETAILS = COVER.VOUCHER_LOG_DETAILS;
        }

        //BOOKING_SOURCE: "Booking NAC"
        //COVER_COUNT: 2
        //CREATED_DATE: "2022-06-07T19:33:19"
        //CU_COVER_LOG_HDR_ID: 1
        //ID: 11
        //PAGING: 11
        //RESERVATION_DATE: "2022-06-07T00:00:00"
        //RESERVATION_TIME: "21:45:00"
        //REVENUE_CENTRE: ""
        //SHIFT_NAME: "DINNER"
        //STATUS: "Complete"

    };
    $scope.REDIRECTION_PAGE = function (Path) {
        $location.path(Path)
    };
});