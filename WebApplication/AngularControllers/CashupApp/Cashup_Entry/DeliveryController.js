app.controller('DeliveryController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    if ($scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID == null || $scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID == undefined || $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_ID == null || $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_ID == undefined) {
        $location.path('CashUpApp_Entry');
        return;
    }
    $scope.$parent.REDIRECT_REGISTER_ENTRY = false;
    $scope.$parent.TAB_ID = 5;
    $scope.TAB_ID = 5;
    $scope.CASHUP_HEADER_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_ID;
    $scope.CASHUP_MAIN_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_MAIN_ID;
    $scope.CASHUP_INFO = {};
    $scope.CASHUP_INFO.ACTUAL = 0;
    $scope.CASHUP_INFO.EPOS = 0;
    $scope.CASHUP_ENTRY_NOTE = "";
    $scope.DELIVERY_TAB_NOTE_LIST = [];
    $scope.TOTAL_DELHIVERY_AMT = 0;
    $scope.DELIVERY_DECLARATION_LIST = [];
    $scope.MODE_OF_PAYMENT_LIST = [];
    $scope.GET_CASHUP_HEADER_NOTES = function () {
        var CashupModelObj = new Object();
        CashupModelObj.NOTE_TYPE_ID = 8;
        CashupModelObj.CASHUP_HEADER_ID = $scope.CASHUP_HEADER_ID;
        PrcCommMethods.CASHUP_APP_API(CashupModelObj, 'GET_CASHUP_HEADER_NOTES').then(function (data) {
            if (data.data.Table != null && data.data.Table.length > 0) {
                $scope.DELIVERY_TAB_NOTE_LIST = data.data.Table.map(function (item) {
                    item.isEditable = false;
                    return item;
                });
            }
        });
    };
    $scope.GET_CASHUP_HEADER_NOTES();
    $scope.GET_MODE_OF_PAYMENTS = function () {
        var ModelObj = new Object();
        ModelObj.BRANCH_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID;
        PrcCommMethods.CASHUP_APP_API(ModelObj, 'GET_MODE_OF_PAYMENTS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.MODE_OF_PAYMENT_LIST = data.data.Table;
            }
            $scope.GET_CASHUP_DELIVERY();
        });
    };
    $scope.GET_MODE_OF_PAYMENTS();
    $scope.GET_CASHUP_DELIVERY = function () {
        var ModelObj = new Object();
        ModelObj.CASHUP_HEADER_ID = $scope.CASHUP_HEADER_ID;
        PrcCommMethods.CASHUP_APP_API(ModelObj, 'GET_CASHUP_DELIVERY').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.DELIVERY_DECLARATION_LIST = data.data.Table;
            }
            else {
                $scope.ADD_ROW();
            }
            if ($scope.ADD_NEW_ROW_FLAG == true) {
                $scope.ADD_NEW_ROW_FLAG = false;
                $scope.ADD_ROW();
            }
        });
    };

    $scope.ADD_ROW = function () {
        var ROW = new Object();
        ROW.CASHUP_DELIVERY_ID = 0;
        ROW.CASHUP_HEADER_ID = $scope.CASHUP_HEADER_ID;
        ROW.NAME = null;
        ROW.DATE = null;
        ROW.NUMBER = null;
        ROW.AMOUNT = null;
        ROW.NOTE = null;
        ROW.UNITS = null;
        ROW.MODE_OF_PAYMENT_ID = null;
        ROW.ACTIVE = 1;
        ROW.IS_DELETED = 0;
        ROW.UPLOAD_IDS = null;
        $scope.DELIVERY_DECLARATION_LIST.push(ROW);

    };
    $scope.nginit_delivery = function (_row) {
        $scope.$parent.$parent.GET_UPLOADS(_row, 58, _row.CASHUP_DELIVERY_ID);
        //_row.DATE = $filter('date')(_row.DATE, 'yyyy-MM-dd');
        if (_row.DATE != null) {
            _row.DATE = moment(_row.DATE, $scope.$parent.DB_DATE_FORMAT).format($scope.$parent.CONVERSION_DATE_FORMAT);
        }
        if (_row.ACTIVE == true || _row.ACTIVE == 1) {
            if (!isNaN(parseFloat(_row.AMOUNT))) {
                $scope.TOTAL_DELHIVERY_AMT += parseFloat(_row.AMOUNT);
            }
        }
        _row.SELECTED_MODE_OF_PAYMENT_NAME = $scope.MODE_OF_PAYMENT_LIST.find(mp => mp.MODE_OF_PAYMENT_ID == _row.MODE_OF_PAYMENT_ID).METHOD_NAME;
    };
    $scope.ADD_NEW_ROW = function () {
        if ($scope.DELIVERY_DECLARATION_LIST.length == 0) {
            $scope.ADD_ROW();
        }
        else {
            $scope.ADD_NEW_ROW_FLAG = true;
            $scope.INS_UPD_CASHUP_DELIVERY(0);
        }
    };
    $scope.SELECT_MODE_OF_PAYMENT = function (_row, _mode_of_payment) {
        _row.MODE_OF_PAYMENT_ID = _mode_of_payment.MODE_OF_PAYMENT_ID;
        _row.SELECTED_MODE_OF_PAYMENT_NAME = _mode_of_payment.METHOD_NAME;
    };
    $scope.CALCULATE_TOTAL = function () {
        var total = 0;
        angular.forEach($scope.DELIVERY_DECLARATION_LIST, function (_row) {
            if (_row.ACTIVE == true || _row.ACTIVE == 1) {
                if (!isNaN(parseFloat(_row.AMOUNT))) {
                    total += parseFloat(_row.AMOUNT);
                }
            }
        });
        $scope.TOTAL_DELHIVERY_AMT = total;
    }
    $scope.DELETE_DECLARATION = function (ROW) {
        if (confirm('Are you sure you want to proceed?')) {
            if (ROW.CASHUP_DELIVERY_ID == 0 || ROW.CASHUP_DELIVERY_ID == null) {
                let index = $scope.DELIVERY_DECLARATION_LIST.indexOf(ROW);
                if (index !== -1) {
                    $scope.DELIVERY_DECLARATION_LIST.splice(index, 1);
                }
            }
            else {
                ROW.ACTIVE = false;
                $scope.CALCULATE_TOTAL();
                $scope.INS_UPD_CASHUP_DELIVERY(0);
            }
        }
    };
    $scope.EDIT_COMMENT = function (COMMENT) {
        COMMENT.isEditable = true;
    }
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

    $scope.getTheFilesToUploadDelivery = function ($files, ControlName, FileSize, List, Attachment_UPLOAD_TYPE_ID, index) {

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
        var fileUpload = document.getElementById("CardFile" + index);
        extension = fileUpload.files[0].name;
        $scope.uploadFiles(Attachment_UPLOAD_TYPE_ID, '', extension, List, index, 'Delivery');
    };
    $scope.uploadFiles = function (Attachment_UPLOAD_TYPE_ID, ATTACHEMENT_TYPE_ID, filename, List, index, FolderName) {

        if (($scope.Files != undefined && $scope.Files.length > 0)) {
            $scope.DocImageResult = [];
            var data = new FormData();
            data.append("RelativeID", List.CASHUP_DELIVERY_ID == 0 ? $scope.generaterandom(12) + "" + index : List.CASHUP_DELIVERY_ID);
            data.append("UPLOAD_TYPE_ID", Attachment_UPLOAD_TYPE_ID);
            data.append("VIRTUALPATH", '/CashUp/' + FolderName + '/' + parseInt($scope.CASHUP_MAIN_ID) + '/');
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
                var fileInput = document.getElementById("CardFile" + index); // Reset the file input
                if (fileInput) {
                    fileInput.value = ""; // Clear the input field
                }
            });
        }
    };
    $scope.DELETE_UPLOAD_CARD_ALL = function (Array, item, index) {
        if (confirm('Are you sure you want to delete?')) {
            Array.UploadedFiles.splice(index, 1);
            var CashupModelObj = new Object();
            CashupModelObj.ID = parseInt(item.ID);
            PrcCommMethods.CASHUP_APP_API(CashupModelObj, 'DELETE_UPLOAD').then(function (data) {
                var fileInput = document.getElementById("CardFile" + index); // Reset the file input
                if (fileInput) {
                    fileInput.value = ""; // Clear the input field
                }
                alert("Deletion Success");
            });
        }
    };
    $scope.PREVIOUS=function(){
        if ($scope.$parent.CASHUP_ENTRY_SEARCH.IS_DATA_ENTRY_ENABLED == true) {
            $scope.INS_UPD_CASHUP_DELIVERY(0, 1);
        }
        else {
            $scope.Fn_Cashup_entry_TAB_CLICK($scope.TAB_ID, 0);
        }
    }
    $scope.CONTINUE = function () {
        if ($scope.$parent.CASHUP_ENTRY_SEARCH.IS_DATA_ENTRY_ENABLED == true) {
            $scope.DeliveryEntryForm.submitted = true;
            if ($scope.DeliveryEntryForm.$valid) {
                if (!isNaN(parseFloat($scope.CASHUP_INFO.ACTUAL) - parseFloat($scope.CASHUP_INFO.EPOS))) {
                    if (parseFloat($scope.CASHUP_INFO.ACTUAL) - parseFloat($scope.CASHUP_INFO.EPOS) != 0) {
                        var myModal = new bootstrap.Modal(document.getElementById('proceed'), {
                            keyboard: false  // Optional: Close modal when pressing ESC
                        });
                        // Show the modal
                        myModal.show();
                    }
                    else {
                        //$scope.Fn_Cashup_entry_TAB_CLICK($scope.TAB_ID, 1);
                        $scope.INS_UPD_CASHUP_DELIVERY(1);
                    }
                }
                else {
                    //$scope.Fn_Cashup_entry_TAB_CLICK($scope.TAB_ID, 1);
                    $scope.INS_UPD_CASHUP_DELIVERY(1);
                }
            }
        }
        else {
            $scope.Fn_Cashup_entry_TAB_CLICK($scope.TAB_ID, 1);
        }
    }

    $scope.RESET_ON_MODAL_CLOSE = function () {
        
    }
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

    

    $scope.INS_UPD_CASHUP_DELIVERY = function (isDraft,isPrevious) {
        $scope.DeliveryEntryForm.submitted = true;
        if ($scope.DeliveryEntryForm.$valid) {
            var CashupAppModelObj = new Object();
            CashupAppModelObj.CASHUP_HEADER_ID = $scope.CASHUP_HEADER_ID;
            CashupAppModelObj.TOTAL_DELHIVERY_AMT = $scope.TOTAL_DELHIVERY_AMT;
            CashupAppModelObj.USER_ID = parseInt($cookies.get("USERID"));
            CashupAppModelObj.STEP_NO = 6;
            CashupAppModelObj.IS_DRAFT = isDraft;
            var declaration_list = [];
            angular.forEach($scope.DELIVERY_DECLARATION_LIST, function (declaration) {
                var declarationObj = new Object();
                declarationObj.CASHUP_DELIVERY_ID = declaration.CASHUP_DELIVERY_ID == null ? 0 : declaration.CASHUP_DELIVERY_ID;
                declarationObj.NAME = declaration.NAME;
                declarationObj.DATE = moment(declaration.DATE, $scope.$parent.CONVERSION_DATE_FORMAT).format($scope.$parent.DB_DATE_FORMAT);
                //declarationObj.DATE = declaration.DATE;
                declarationObj.NUMBER = declaration.NUMBER;
                declarationObj.AMOUNT = parseFloat(declaration.AMOUNT).toFixed(5);
                declarationObj.NOTE = declaration.NOTE;
                declarationObj.UNITS = declaration.UNITS;
                declarationObj.MODE_OF_PAYMENT_ID = declaration.MODE_OF_PAYMENT_ID;
                declarationObj.ACTIVE = declaration.ACTIVE;
                declarationObj.IS_DELETED = declaration.IS_DELETED;
                UPLOAD_IDS = "";
                angular.forEach(declaration.UploadedFiles, function (FILE) {
                    if (UPLOAD_IDS == "") {
                        UPLOAD_IDS = FILE.UPLOAD_ID;
                    }
                    else {
                        UPLOAD_IDS = UPLOAD_IDS + "," + FILE.UPLOAD_ID;
                    }
                });
                declarationObj.UPLOAD_IDS = UPLOAD_IDS;
                declaration_list.push(declarationObj);
            });
            CashupAppModelObj.CASHUP_DELIVERY = declaration_list;
            PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'INS_UPD_CASHUP_DELIVERY').then(function (data) {
                $scope.DeliveryEntryForm.submitted = false;
                $scope.GET_CASHUP_ENTRY_HEADER($scope.CASHUP_HEADER_ID);
                if (isDraft == 1) {
                    $scope.Fn_Cashup_entry_TAB_CLICK($scope.TAB_ID, 1);
                }
                if (isPrevious == 1) {
                    $scope.Fn_Cashup_entry_TAB_CLICK($scope.TAB_ID, 0);
                }
                else {
                    $scope.TOTAL_DELHIVERY_AMT = 0;
                    $scope.GET_CASHUP_DELIVERY();
                }
            });
        }
    };
    $scope.NOTE_INIT = function (LINE) {
        LINE.DELETE_NOTE = 0;
    }
    $scope.DELETE_COMMENT = function (COMMENT) {
        COMMENT.isEditable = true;
        COMMENT.DELETE_NOTE = 1;
        $scope.INS_UPD_CASHUP_HEADER_NOTES(COMMENT);
    }
    $scope.INS_UPD_CASHUP_HEADER_NOTES = function (COMMENT) {
        if (COMMENT == null || COMMENT == undefined || COMMENT.isEditable == true || COMMENT.isEditable == 1) {
            if (($scope.CASHUP_ENTRY_NOTE != null && $scope.CASHUP_ENTRY_NOTE != undefined && $scope.CASHUP_ENTRY_NOTE != "") || (COMMENT != null && COMMENT != undefined && COMMENT != "")) {
                var CashupModelObj = new Object();
                CashupModelObj.NOTE_TYPE_ID = 8;
                CashupModelObj.CASHUP_HEADER_ID = $scope.CASHUP_HEADER_ID;
                CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));

                //new insert
                if (COMMENT == undefined || COMMENT == null) {
                    CashupModelObj.CASHUP_HEADER_NOTES_ID = 0; // for new insert
                    CashupModelObj.NOTE = $scope.CASHUP_ENTRY_NOTE;
                    CashupModelObj.DELETE_NOTE = 0;
                }
                //Edit condition
                if (COMMENT != undefined && COMMENT != null) {
                    CashupModelObj.CASHUP_HEADER_NOTES_ID = COMMENT.TABLE_ID;
                    CashupModelObj.NOTE = COMMENT.NOTE;
                    CashupModelObj.DELETE_NOTE = COMMENT.DELETE_NOTE;
                }
                PrcCommMethods.CASHUP_APP_API(CashupModelObj, 'INS_UPD_CASHUP_HEADER_NOTES').then(function (data) {
                    $scope.CASHUP_ENTRY_NOTE = "";
                    if (COMMENT != undefined && COMMENT != null) {
                        COMMENT.isEditable = false;
                    }
                    $scope.DELIVERY_TAB_NOTE_LIST = [];
                    $scope.GET_CASHUP_HEADER_NOTES();

                });
            }
            else {
                alert('Comments cannot be empty while saving');
            }
        }
    };
    $scope.$on('$destroy', function () {
        $('.modal.show').modal('hide');
        $('.dropdown-menu').hide();
    });
});