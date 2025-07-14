app.controller('Pay_StatementController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    //====================== Request List =====================================
    $scope.STATEMENT_LIST = [];
    $scope.UPLOADSTATEMENT_DOC = [];
    $scope.COMMON_CODE_CHANGE();
    // $scope.REQUESTList = { ID: 0, TYPE_NAME:''};
    var startDate;
    var endDate;
    $scope.STATUS_LIST = [{ STATUS_ID: 40, STATUS_NAME: 'Pending Reconciliation' },
    { STATUS_ID: 49, STATUS_NAME: 'Sent To Supplier' },
    { STATUS_ID: 50, STATUS_NAME: 'Reconciled' },
    ]
    $scope.StatementSearch = {
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        ACTIVE: 1,
        BRANCH_LOGIN_ID: parseInt($cookies.get("BRANCH_ID")),

    };

    $scope.$parent.overlay_loadingNew = 'block';
    function reportrange(startDate, endDate) {
        $scope.StatementSearch.START_DATE = startDate.format($scope.$parent.Datelocaleformat.format);
        $scope.StatementSearch.END_DATE = endDate.format($scope.$parent.Datelocaleformat.format);
        $('#reportrange span').html(startDate.format($scope.$parent.Datelocaleformat.format) + ' - ' + endDate.format($scope.$parent.Datelocaleformat.format));
    };
    $(function () {
        startDate = moment().startOf('month');//moment().startOf('isoWeek');//moment().subtract(6, 'days');
        endDate = moment().endOf('month'); //moment().subtract(0, 'days');
        $scope.$parent.SetUpDateRangeMultiDatePicker('reportrange', startDate, endDate, reportrange);
        $('#reportrange span').html(startDate.format($scope.$parent.Datelocaleformat.format) + ' - ' + endDate.format($scope.$parent.Datelocaleformat.format));
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

    $scope.loader = 1;
    //$scope.initStateUploadList = function (State_LINE) {
    //    if (State_LINE.ID != 0) {
    //        if (State_LINE.UploadedFiles == undefined) {
    //            State_LINE.UploadedFiles = [];
    //        }
    //        var FileArray = State_LINE.FILE_NAME != "" ? State_LINE.FILE_NAME.split(':;:') : [];
    //        if (FileArray.length > 0) {
    //            var obj = new Object()
    //            obj.ID = CARD_LINE.UPLOAD_IDS;
    //            obj.FILE_PATH = FileArray[0];
    //            obj.SERVER_FILE_NAME = FileArray[1];
    //            obj.ORIGINAL_FILE_NAME = FileArray[2];
    //            CARD_LINE.UploadedFiles.push(obj);
    //        }
    //    }
    //}
    $scope.LAZY_GET_STATEMENT_LIST = function () {
        $scope.GET_PYMNT_STATEMENTS();
    };
    $scope.GET_PYMNT_STATEMENTS = function (FLAG) {
        var PaymentModelObj = new Object();
        if (FLAG == 1) {
            $scope.STATEMENT_LIST = [];
            $scope.StatementSearch.PAGE_NO = 1;
        }
        PaymentModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PaymentModelObj.BRANCH_LOGIN_ID = $scope.StatementSearch.BRANCH_LOGIN_ID;
        PaymentModelObj.SUPPLIER_NAME = $scope.StatementSearch.SUPPLIER_NAME;
        PaymentModelObj.START_DATE = $scope.StatementSearch.START_DATE == undefined ? moment().startOf('month').format($scope.$parent.Datelocaleformat.format) : $scope.StatementSearch.START_DATE;//$scope.START_DATE == undefined ?null : $scope.START_DATE; 
        PaymentModelObj.END_DATE = $scope.StatementSearch.END_DATE == undefined ? moment().endOf('month').format($scope.$parent.Datelocaleformat.format) : $scope.StatementSearch.END_DATE;//$scope.END_DATE == undefined ? null : $scope.END_DATE; ; 
        PaymentModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PaymentModelObj.STATUS_IDS = $scope.StatementSearch.STATUS_IDS;
        PaymentModelObj.PAGE_NO = $scope.StatementSearch.PAGE_NO;
        PaymentModelObj.PAGE_SIZE = $scope.StatementSearch.PAGE_SIZE;
        PrcCommMethods.PAYMENT_API(PaymentModelObj, 'GET_PYMNT_STATEMENTS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.STATEMENT_LIST = $scope.STATEMENT_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.StatementSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.StatementSearch.PAGE_NO = parseInt($scope.StatementSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            } else {
                $scope.STATEMENT_LIST = [];
                $scope.GetData = false;
            }
            $scope.SUPPLIER_ID_VALID = true;
            $scope.REFERENCE_VALID = true;
            $scope.AMOUNT_VALID = true;
            $scope.$parent.overlay_loadingNew = 'none';
        })
    }
    $scope.GET_PYMNT_STATEMENTS(1);

    //====================== UPLOAD STATEMENT ==================================
    $scope.UPLOAD = {
        BRANCH_LOGIN_ID: parseInt($cookies.get("BRANCH_ID")),
    };

    $scope.SetValues = function (Supplier, IndexVal) {
        // 
        //angular.forEach($scope.SUPPLIERList, function (value) {
        //    if (value.SUPPLIER_NAME == Supplier) {
        //        //Supplier.ID = value.ID;
        //        $scope.SUPPLIER_NAME = value.SUPPLIER_NAME;
        //    }
        //});
    };

    $scope.GET_PYMNT_SUPPLIER = function () {

        var PaymentModelObj = new Object();
        PaymentModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PaymentModelObj.BRANCH_LOGIN_ID = $scope.UPLOAD.BRANCH_LOGIN_ID;
        PaymentModelObj.PAGE_NO = 0;
        PaymentModelObj.PAGE_SIZE = 0;
        PaymentModelObj.SUPPLIER_NAME = null;
        PaymentModelObj.FLAG = 1;
        PrcCommMethods.PAYMENT_API(PaymentModelObj, 'GET_PYMNT_SUPPLIER').then(function (data) {
            if (data.data != undefined && data.data.Table.length > 0) {
                $scope.SUPPLIERLIST = data.data.Table;
                $('#AddCustomScroll').find('.dropdown-menu').addClass('custom-scrollbar');
                $('.AddCustomScroll').find('.dropdown-menu').addClass('custom-scrollbar');
            } else {
                $scope.SUPPLIERLIST = [];
            }
        })
    }
    $scope.GET_PYMNT_SUPPLIER();

    $scope.VALIDATESTATEMENT = function () {
        $scope.UPLOADSTATEVALID = true;
        $scope.SUPPLIER_ID_VALID = true;
        $scope.REFERENCE_VALID = true;
        $scope.AMOUNT_VALID = true;

        if ($scope.SUPPLIER_NAME == null || $scope.SUPPLIER_NAME == undefined || $scope.SUPPLIER_NAME == "") {
            $scope.SUPPLIER_ID_VALID = false;
        }
        //if ($scope.REFERENCE == null || $scope.REFERENCE == undefined || $scope.REFERENCE == "") {
        //    $scope.REFERENCE_VALID = false;
        //}
        //if ($scope.AMOUNT == null || $scope.AMOUNT == 0 || $scope.AMOUNT == "" || $scope.AMOUNT == undefined) {
        //    $scope.AMOUNT_VALID = false;
        //}
        if (!$scope.SUPPLIER_ID_VALID) {
            $scope.UPLOADSTATEVALID = false;
        }
    }

    $scope.RESET_UPLOAD_STATEMENT = function () {
        $scope.UPLOAD.BRANCH_LOGIN_ID = parseInt($cookies.get("BRANCH_ID"));
        $scope.SUPPLIER_NAME = "";
        $scope.REFERENCE = "";
        $scope.AMOUNT = "";
        $scope.UPLOADSTATEMENT_DOC = [];
        angular.element("input[id='StatementFile']").val(null);
        $scope.UPLOADSTATEVALID = true;
        $scope.SUPPLIER_ID_VALID = true;
        $scope.REFERENCE_VALID = true;
        $scope.AMOUNT_VALID = true;
    }
    $scope.INS_PYMNT_STATEMENTS = function () {
        $scope.VALIDATESTATEMENT();
        if ($scope.UPLOADSTATEVALID) {
            var count = 0;
            var List = $scope.SUPPLIERLIST.filter(function (x) { return x.SUPPLIER_NAME == $scope.SUPPLIER_NAME })
            if (List.length == 0) {
                count = 1;
            }
            var PaymentModelObj = new Object();
            PaymentModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            PaymentModelObj.BRANCH_LOGIN_ID = $scope.UPLOAD.BRANCH_LOGIN_ID;
            if (List.length > 0) {
                PaymentModelObj.SUPPLIER_ID = List[0].ID;
            }
            PaymentModelObj.REFERENCE = $scope.REFERENCE;
            PaymentModelObj.AMOUNT = $scope.AMOUNT;
            PaymentModelObj.USER_ID = parseInt($cookies.get("USERID"));
            if ($scope.UPLOADSTATEMENT_DOC == undefined && count == 0 || $scope.UPLOADSTATEMENT_DOC.length == 0 && count == 0) {
                count = 2
            }
            else {
                angular.forEach($scope.UPLOADSTATEMENT_DOC, function (x) {
                    //  if (x.UploadedFiles != undefined && x.UploadedFiles.length > 0) {
                    PaymentModelObj.UPLOAD_IDS = x.ID.toString();
                    // x.FILE_NAME = x.UploadedFiles[0].FILE_PATH + ":;:" + x.UploadedFiles[0].SERVER_FILE_NAME + ":;:" + x.UploadedFiles[0].ORIGINAL_FILE_NAME;

                    //}
                    //else {
                    //    x.UPLOAD_IDS = "";
                    //    x.FILE_NAME = "";
                    //    x.UploadedFiles = [];
                    //}
                    //x.VISA_BIFURCATION = 0;
                    //x.MASTERCARD_BIFURCATION = 0;
                    //x.AMEX_BIFURCATION = 0;
                    //x.DINERS_BIFURCATION = 0;

                });
            }
            if (count == 0) {
                PrcCommMethods.PAYMENT_API(PaymentModelObj, 'INS_PYMNT_STATEMENTS').then(function (data) {
                    if (data.data == 1) {
                        $scope.$parent.ShowAlert("Success", 'Request Send Successfully', 3000);
                        $scope.RESETSTATEMENT();
                        $scope.GET_PYMNT_STATEMENTS(1);
                        $("#Upload_Statement").modal('hide');
                    }
                    if (data.data == 0) {
                        $scope.$parent.ShowAlert("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                    }
                });
            } else {
                if (count == 1) {
                    $scope.$parent.ShowAlert("Error", "Invalid supplier, please select valid supplier", 3000);
                }
                else if (count == 2) {
                    $scope.$parent.ShowAlert("Error", "Please select a file to upload", 3000);
                }
            }
        }

    }
    $scope.GET_PYMNT_STATEMENTS_COLUMN_HEADERS = function (STATEMENT, STATEMENT_ID) {
        $scope.STATEMENT_HEADERS = [];
        $scope.MAPPING_HEADERS = [];
        $scope.SELECTED_STATEMENT = [];
        if (STATEMENT.MAPPING_HEADERS == undefined || STATEMENT.MAPPING_HEADERS == null || STATEMENT.MAPPING_HEADERS.length == 0) {

            var PaymentModelObj = new Object();
            PaymentModelObj.STATEMENT_ID = parseInt(STATEMENT_ID);
            PrcCommMethods.PAYMENT_API(PaymentModelObj, 'GET_PYMNT_STATEMENTS_COLUMN_HEADERS').then(function (data) {
                if (data.data != null) {
                    $scope.STATEMENT_HEADERS = data.data.Table;
                    if (data.data.Table2.length > 0) {
                        $scope.MAPPING_HEADERS = data.data.Table2;
                    }
                    else {
                        $scope.MAPPING_HEADERS = data.data.Table1;
                    }
                    STATEMENT.STATEMENT_HEADERS = angular.copy(data.data.Table);
                    STATEMENT.MAPPING_HEADERS = angular.copy(data.data.Table1);
                    STATEMENT.MAPPED_HEADERS = angular.copy(data.data.Table2);
                    $scope.MAPPED_HEADERS = angular.copy(data.data.Table2);
                    $scope.SELECTED_STATEMENT = angular.copy(STATEMENT);
                    $("#MAP_STATEMENT").modal('show');
                }
                if (data.data == 0) {
                    $scope.$parent.ShowAlert("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                }
            });
        }
        else {
            $scope.STATEMENT_HEADERS = angular.copy(STATEMENT.STATEMENT_HEADERS);
            $scope.MAPPED_HEADERS = angular.copy(STATEMENT.MAPPED_HEADERS);
            if ($scope.MAPPED_HEADERS.length > 0) {
                $scope.MAPPING_HEADERS = angular.copy(STATEMENT.MAPPED_HEADERS);
            } else {

                $scope.MAPPING_HEADERS = angular.copy(STATEMENT.MAPPING_HEADERS);
            }
            $scope.SELECTED_STATEMENT = angular.copy(STATEMENT);
            $("#MAP_STATEMENT").modal('show');
        }
    }
    $scope.INS_SUPPLIER_STATEMENT_MAPPING = function () {
        $scope.SchIMapStatementForm.submitted = true;
        if ($scope.SchIMapStatementForm.$valid) {
            var PaymentModelObj = new Object();
            PaymentModelObj.XERO_CONTACT_ID = parseInt($scope.SELECTED_STATEMENT.SUPPLIER_ID);
            PaymentModelObj.PYMNT_SUPPLIER_FIELD_MAPPING_TYPE = [];
            angular.forEach($scope.MAPPING_HEADERS, function (val) {
                //var SELECTED_STATEMENT_HEAD = $scope.STATEMENT_HEADERS.filter(function (x) { return x.MATRIX_ID == val.MATRIX_ID })
                var Readonly = new Object();
                Readonly.COLUMN_ID = parseInt(val.COLUMN_ID);
                Readonly.TABLE_NO = parseInt(val.SELECTED_STATEMENT_HEAD.TABLE_NO);
                Readonly.ROW_NO = parseInt(val.SELECTED_STATEMENT_HEAD.ROW_NO);
                Readonly.CELL_NO = parseInt(val.SELECTED_STATEMENT_HEAD.CELL_NO);
                Readonly.VALUE = val.VALUE;
                PaymentModelObj.PYMNT_SUPPLIER_FIELD_MAPPING_TYPE.push(Readonly);
            });
            PrcCommMethods.PAYMENT_API(PaymentModelObj, 'INS_SUPPLIER_STATEMENT_MAPPING').then(function (data) {
                if (data.data == 1) {
                    $scope.$parent.ShowAlert("Success", 'Save Successfully', 3000);
                    $scope.SchIMapStatementForm.submitted = false;
                    $('#MAP_STATEMENT').modal('hide');
                }
                if (data.data == 0) {
                    $scope.$parent.ShowAlert("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                }
            });
        }
    }
    $scope.FillSelectedMapping = function (header) {
        if ($scope.MAPPED_HEADERS.length > 0) {
            header.SELECTED_STATEMENT_HEAD = $scope.STATEMENT_HEADERS.filter(function (x) { return x.TABLE_NO == header.TABLE_NO && x.ROW_NO == header.ROW_NO && x.CELL_NO == header.CELL_NO })[0];// $filter('filter')($scope.STATEMENT_HEADERS, { 'COLUMN_ID': header.COLUMN_ID}, true)[0];
        }
    }
    $scope.RESET_SUPPLIER_STATEMENT_MAPPING = function () {
        $scope.MAPPING_HEADERS = angular.copy($scope.SELECTED_STATEMENT.MAPPING_HEADERS);
        $scope.SchIMapStatementForm.submitted = false;
    }

    $scope.getTheFilesToUploadStatement = function ($files, ControlName, FileSize, List, Attachment_UPLOAD_TYPE_ID) {

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
        // List.ID = 0;
        var fileUpload = document.getElementById(ControlName);
        if (fileUpload.files[0] != null && fileUpload.files[0] != undefined) {
            extension = fileUpload.files[0].name;
            $scope.uploadFiles(Attachment_UPLOAD_TYPE_ID, '', extension, List);
        }
    };
    //$scope.RendomNumber = $scope.$parent.generaterandom(12);
    $scope.uploadFiles = function (Attachment_UPLOAD_TYPE_ID, ATTACHEMENT_TYPE_ID, filename, List, index) {

        if (($scope.Files != undefined && $scope.Files.length > 0)) {
            $scope.DocImageResult = [];
            var data = new FormData();
            //   data.append("RelativeID", List.ID == 0 ? $scope.$parent.generaterandom(12) + "" + index : List.ID);
            data.append("RelativeID", $scope.$parent.generaterandom(12));
            data.append("UPLOAD_TYPE_ID", Attachment_UPLOAD_TYPE_ID);
            //data.append("VIRTUALPATH", '/Statement/' + FolderName + '/' + parseInt($scope.$parent.CASHUP.CASHUP_MAIN_ID)) + '/';
            data.append("VIRTUALPATH", '/Statement/' + Attachment_UPLOAD_TYPE_ID + '/');
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
                    $scope.ShowAlert('Error', d.data[0].UPLOADED_COMMENT, 5000);
                }
                else { 
                List.UploadedFiles = d.data;
                    $scope.UPLOADSTATEMENT_DOC = d.data;
                }
            });
        }
    };
    $scope.DELETE_UPLOAD_STATEMENT_ALL = function (item, index, FLAG) {

        if (confirm('Are you sure you want to delete?')) {

            $scope.UPLOADSTATEMENT_DOC.splice(index, 1);
            var PaymentModelObj = new Object();
            PaymentModelObj.ID = parseInt(item.ID);
            PrcCommMethods.CASHUP_API(PaymentModelObj, 'DELETE_UPLOAD').then(function (data) {
                $scope.ShowAlert('Success', 'File deleted successfully.', 5000);
                $scope.UPLOADSTATEMENT_DOC = [];
                angular.element("input[id='StatementFile']").val(null);

            });
        }
    };

    $scope.RESETSTATEMENT = function () {

        $scope.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        //$scope.USER_ID = 0;
        $scope.SUPPLIER_ID = null;
        $scope.REFERENCE = null;
        $scope.AMOUNT = null;
        $scope.UPLOAD.BRANCH_LOGIN_ID = parseInt($cookies.get("BRANCH_ID"));
        $scope.UPLOADSTATEMENT_DOC = [];
    }
    $scope.RESETPAGESTATEMENT = function () {
        $scope.StatementSearch.SUPPLIER_NAME = null;
        $scope.StatementSearch.STATUS_IDS = null;
        $scope.StatementSearch.BRANCH_LOGIN_ID = parseInt($cookies.get("BRANCH_ID"));
        $scope.GET_PYMNT_STATEMENTS(1);
    }


});
app.controller('Pay_StatementViewController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.COMMON_CODE_CHANGE();
    $scope.STATEMENT_LIST = [];
    $scope.StatementViewSearch = {
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        ACTIVE: 1,
        STATEMENT_ID: getUrlParameter('STATEMENT_ID', $location.absUrl()),
        STATEMENT_HEADER: {
        }
    };
    $scope.GET_PYMNT_STATEMENT_BY_ID = function () {
        var PaymentModelObj = new Object();
        PaymentModelObj.STATEMENT_ID = $scope.StatementViewSearch.STATEMENT_ID;
        PrcCommMethods.PAYMENT_API(PaymentModelObj, 'GET_PYMNT_STATEMENT_BY_ID').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.StatementViewSearch.STATEMENT_HEADER = data.data.Table[0];
                $scope.pdfUrl = window.location.origin + '/uploads' + data.data.Table[0].FILE_PATH + '' + data.data.Table[0].SERVER_FILE_NAME
                //$scope.pdfUrl = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/149125/relativity.pdf';
                $scope.STATEMENT_LIST = data.data.Table1;
            }
        })
    }
    $scope.GET_PYMNT_STATEMENT_BY_ID();
});
app.controller('Pay_StatementReconcileController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.COMMON_CODE_CHANGE();
    $scope.STATEMENT_LIST = [];
    $scope.RECONCILE = true
    $scope.StatementReconcileSearch = {
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        ACTIVE: 1,
        STATEMENT_ID: getUrlParameter('STATEMENT_ID', $location.absUrl()),
        RECONCILE_HEADER: {
        }
    };
    $scope.STATUS_LIST = [{ STATUS_ID: 44, STATUS_NAME: 'Invoice Not Found' },
    { STATUS_ID: 45, STATUS_NAME: 'Matched' },
    { STATUS_ID: 46, STATUS_NAME: 'Invoice Paid' },
    { STATUS_ID: 47, STATUS_NAME: 'Mismatched' }
    ]
    $scope.PYMNT_RECONSILE_STATEMENT_BY_ID = function () {
        var PaymentModelObj = new Object();
        PaymentModelObj.STATEMENT_ID = $scope.StatementReconcileSearch.STATEMENT_ID;
        PaymentModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PaymentModelObj.RECONCILE_FLAG = 1;
        PrcCommMethods.PAYMENT_API(PaymentModelObj, 'PYMNT_RECONSILE_STATEMENT_BY_ID').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.StatementReconcileSearch.RECONCILE_HEADER = data.data.Table[0];
                $scope.RECONSILE_STATEMENT_LIST = data.data.Table1;
            }
        });
    }
    //FILE_BALANCE_AMOUNT
    //:
    //945
    //FILE_DUE_DATE
    //:
    //null
    //FILE_INVOICE_AMOUNT
    //:
    //945
    //FILE_INVOICE_DATE
    //:
    //"2022-10-17T00:00:00"
    //FILE_INVOICE_NUMBER
    //:
    //"14060"
    //FILE_RECONSILIATION_DATE
    //:
    //"2023-02-06T11:31:25.537"
    //FILE_TABLE_ID
    //:
    //1
    //STATUS
    //:
    //46
    //STATUS_NAME
    //:
    //"Invoice Paid"
    //XERO_BALANCE_AMOUNT
    //:
    //0
    //XERO_DUE_DATE
    //:
    //"2022-10-17T01:00:00"
    //XERO_INVOICE_AMOUNT
    //:
    //945
    //XERO_INVOICE_DATE
    //:
    //"2022-10-17T00:00:00"
    //XERO_INVOICE_NUMBER
    //:
    //"14060"
    $scope.RESET_SEND_TO_SUPPLIER = function () {
        $scope.StatementReconcileSearch.SUBJECT = "";
        $scope.StatementReconcileSearch.EMAILS = "";
        $scope.StatementReconcileSearch.BODY = "";
        $scope.StatementReconcileSearch.SUBJECT = "";
        $scope.SendtosupplierForm.submitted = false;
    }

    $scope.PYMNT_RECONSILE_STATEMENT_BY_ID();

    $scope.UPD_PYMNT_RECONSILE_SEND_TO_SUPPLIER = function () {
        $scope.SendtosupplierForm.submitted = true;
        if ($scope.SendtosupplierForm.$valid) {
            var PaymentModelObj = new Object();
            PaymentModelObj.STATEMENT_ID = $scope.StatementReconcileSearch.STATEMENT_ID;
            PaymentModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PaymentModelObj.EMAILS = $scope.StatementReconcileSearch.EMAILS;
            PaymentModelObj.SUBJECT = $scope.StatementReconcileSearch.SUBJECT;
            PaymentModelObj.BODY = $scope.StatementReconcileSearch.BODY;
            PaymentModelObj.PYMNT_INVCS_FRM_UPLD_STMNTS_WITH_REMARK_TYPE = [];
            angular.forEach($scope.RECONSILE_STATEMENT_LIST, function (val) {
                var readOnly = new Object()
                readOnly.TABLE_ID = val.FILE_TABLE_ID;
                readOnly.REMARK = val.REMARK;
                PaymentModelObj.PYMNT_INVCS_FRM_UPLD_STMNTS_WITH_REMARK_TYPE.push(readOnly);
            });
            PrcCommMethods.PAYMENT_API(PaymentModelObj, 'UPD_PYMNT_RECONSILE_SEND_TO_SUPPLIER').then(function (data) {
                if (data.data == 1) {
                    $location.path('Statement').search();
                }
                if (data.data == 0) {
                }
            });
        }
    }
});