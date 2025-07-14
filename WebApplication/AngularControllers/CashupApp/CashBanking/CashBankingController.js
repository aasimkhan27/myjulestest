app.controller('CashBankingController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    //$scope.$parent.DISPLAY_FLAG = false;
    //$scope.$parent.$parent.DISPLAY_FLAG = false;
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(2);
    //$scope.CASHUP_COMMON_CODE_Fn();
    $scope.BANKED_CASH_PAGE_NO = 1;
    $scope.BANKED_CASH_PAGE_SIZE = 10;
    $scope.$parent.CASHUP_COMMON_RESET_Fn();
    $scope.CASH_BANKING_SEARCH = {
        ENTITY_ID: parseInt($cookies.get("ENTITY_ID")),
        MODULE_ID: parseInt($cookies.get("MODULE_ID")),
        USER_ID: parseInt($cookies.get("USERID")),
        CUSTOMER_ID: parseInt($cookies.get("CUSTOMER_ID")),
        SELECTED_SITE: null,
        EPOS_TOTAL: null,
        BANKED_CASH: null,
        DEPOSIT_DATE: null,
        BANK_SLIP_REF: null,
        NOTES: null,
        COMMENT: null,
        PAGE_NO: 1,
        PAGE_SIZE: 20,
        BANKING_HEADER_ID: 0,
        SUBMIT_FLAG: 1,
        CASH_BANKING_ENTRY_ID: 0,
        IS_DELETED: 0,
        UPLOAD_IDS:""
    }

    $scope.RECORD_CHECKED_ALL = false;
    $scope.CASHUP_BANKING_RECORDS = [];
    $scope.CASHUP_BANKING_ENTRY_LIST = [];
    $scope.CAHSUP_PRIVILEGE_ID = "1171";
    $scope.CASHUP_PRIVILEGE = true;
    $scope.SiteSearch = {};
    $scope.GetData = true;
    $scope.IS_APPROVE = false;

    
    $scope.CHECK_TAB_ACCESS = function () {
        var hasAccess = false;
        angular.forEach($scope.FILTERED_SITES_LIST, function (_row) {
            if (_row.STANDARD_ROLE_ID == 16 || _row.STANDARD_ROLE_ID == 17 || _row.STANDARD_ROLE_ID==18) {
                hasAccess = true;
            }
        })
        return hasAccess;
    }
    $scope.GET_CASHUP_TYPE = function (Sites,flag) {
        var CashupModelObj = {
            CUSTOMER_ID: $scope.CASH_BANKING_SEARCH.CUSTOMER_ID,
            ENTITY_ID: $scope.CASH_BANKING_SEARCH.ENTITY_ID
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
                if (flag == 1) {
                    $scope.FILTERED_SITES_LIST = Sites;
                    if ($scope.FILTERED_SITES_LIST && $scope.FILTERED_SITES_LIST.length > 0) {
                        $scope.CASHUP_PRIVILEGE = true;
                    }
                    else {
                        $scope.CASHUP_PRIVILEGE = false;
                    }
                }
                else {
                    $scope.FILTERED_SITES_LIST_FOR_BANKING = Sites;
                }
                $scope.SELECT_SITE(Sites[0]);
                
            } else {
                if (flag == 1) {
                    $scope.CASHUP_PRIVILEGE = false;
                }
                
            }
        }).catch(function (error) {
            if (flag == 1) {
                $scope.CASHUP_PRIVILEGE = false;
            }
        });
    }

    $scope.GET_PRIVILEGE = function () {
        if ($scope.$parent.$parent.CHECK_CASHUP_PRIVILEGE($scope.CAHSUP_PRIVILEGE_ID)) {
            $scope.FILTERED_SITES_LIST = $scope.$parent.$parent.CHECK_CASHUP_USER_PRIVILEGE($scope.CAHSUP_PRIVILEGE_ID, parseInt($cookies.get("ENTITY_ID")));
            $scope.FILTERED_SITES_LIST_FOR_BANKING = $scope.FILTERED_SITES_LIST.filter(function (site) {
                if (site.STANDARD_ROLE_ID == 19) return false;
                else return true;
            });
            if ($scope.FILTERED_SITES_LIST && $scope.FILTERED_SITES_LIST.length > 0) {
                $scope.GET_CASHUP_TYPE($scope.FILTERED_SITES_LIST,1);
                $scope.GET_CASHUP_TYPE($scope.FILTERED_SITES_LIST_FOR_BANKING,2);
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


    $scope.BANKED_CASH_LIST = [];
    $scope.INIT_BANKED_RECORDS = [];
    $scope.GET_CASHUP_BANKED_RECORDS = function (flag) {

        if (flag == null || flag == undefined) {
            $scope.BANKED_CASH_PAGE_NO = 1;
            $scope.GetData = true;
        }


        var CashupAppModelObj = new Object();
        CashupAppModelObj.BRANCH_ID = $scope.CASH_BANKING_SEARCH.SELECTED_SITE.BRANCH_ID;
        CashupAppModelObj.PAGE_NO = $scope.BANKED_CASH_PAGE_NO;
        CashupAppModelObj.PAGE_SIZE = $scope.BANKED_CASH_PAGE_SIZE;
        PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'GET_CASHUP_BANKED_RECORDS').then(function (data) {

            if (data.data.Table.length > 0) {

                if (flag == null || flag == undefined) {
                    $scope.INIT_BANKED_RECORDS = data.data.Table;
                }
                else if (flag == 1) {
                    $scope.INIT_BANKED_RECORDS = $scope.INIT_BANKED_RECORDS.concat(data.data.Table);
                }
                if (data.data.Table.length < $scope.BANKED_CASH_PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.BANKED_CASH_PAGE_NO = parseInt($scope.BANKED_CASH_PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else if ($scope.BANKED_CASH_PAGE_NO > 1 && data.data.Table.length == 0) {
                $scope.GetData = false;
            }
            else if ($scope.BANKED_CASH_PAGE_NO == 1 && data.data.Table.length == 0) {
                $scope.INIT_BANKED_RECORDS = [];

            }



            if ($scope.INIT_BANKED_RECORDS.length > 0) {
                $scope.BANKED_CASH_LIST = [];
                const groupedMap = {};

                // Step 1: Group data by CASH_BANKING_HDR_ID
                $scope.INIT_BANKED_RECORDS.forEach(item => {
                    const id = item.CASH_BANKING_HDR_ID;
                    if (!groupedMap[id]) {
                        groupedMap[id] = [];
                    }
                    groupedMap[id].push(item);
                });

                // Step 2: Build BANKED_CASH_LIST
                $scope.BANKED_CASH_LIST = Object.keys(groupedMap).map(hdrId => {
                    const group = groupedMap[hdrId];
                    const first = group[0];

                    return {
                        PARENT_ID: null,
                        CASHUP_LIST: group.map(row => ({
                            PARENT_ID: row.CASH_BANKING_HDR_ID,
                            CASH_BANKING_HDR_ID: null,
                            BRANCH_ID: row.BRANCH_ID,
                            BRANCH_NAME: row.BRANCH_NAME,
                            BANKED_DATE: null,
                            CASHUP_DATE: row.CASHUP_DATE,
                            EPOS_CASH: row.EPOS_CASH,
                            BANKED_CASH: null,
                            APPROVED_DATE: row.APPROVED_DATE,
                            BANKING_STATUS: row.BANKING_STATUS,
                            UPLOAD_IDS: row.UPLOAD_IDS,
                            CASHUP_MAIN_ID: row.CASHUP_MAIN_ID
                        })),
                        CASH_BANKING_HDR_ID: first.CASH_BANKING_HDR_ID,
                        BRANCH_ID: first.BRANCH_ID,
                        BRANCH_NAME: first.BRANCH_NAME,
                        BANKED_DATE: first.BANKED_DATE,
                        CASHUP_DATE: null,
                        EPOS_CASH_TOTAL: first.EPOS_CASH_TOTAL,
                        //EPOS_CASH: group.reduce((sum, row) => sum + row.EPOS_CASH, 0),
                        BANKED_CASH: first.BANKED_CASH,
                        APPROVED_DATE: first.APPROVED_DATE,
                        BANKING_STATUS: first.BANKING_STATUS,
                        UPLOAD_IDS: first.UPLOAD_IDS,
                        CASH_BANKING_ENTRY_ID: first.CASH_BANKING_ENTRY_ID,
                        COMMENTS: first.CASH_BANKING_COMMENTS,
                        NOTES: first.NOTES,
                        BANK_SLIP: first.BANK_SLIP,
                        STANDARD_ROLE_ID: $scope.FILTERED_SITES_LIST.filter(_site=>_site.BRANCH_ID == first.BRANCH_ID)[0].STANDARD_ROLE_ID
                    };
                });
            }
            else {
                $scope.INIT_BANKED_RECORDS = [];
                $scope.BANKED_CASH_LIST = [];
                $scope.LOAD_FETCH_TEXT = 'No Records Found !';
            }
        });
    }
    
    $scope.GET_CASHUP_BANKING_RECORDS = function (flag) {
        if (flag == null || flag == undefined) {
            $scope.CASH_BANKING_SEARCH.PAGE_NO = 1;
            $scope.GetData = true;
        }
        var CashupAppModelObj = new Object();
        CashupAppModelObj.BRANCH_ID = $scope.CASH_BANKING_SEARCH.SELECTED_SITE.BRANCH_ID;
        CashupAppModelObj.FROM_DATE = null;
        CashupAppModelObj.TO_DATE = null;
        CashupAppModelObj.PAGE_NO = $scope.CASH_BANKING_SEARCH.PAGE_NO;
        CashupAppModelObj.PAGE_SIZE = $scope.CASH_BANKING_SEARCH.PAGE_SIZE;
        PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'GET_CASHUP_BANKING_RECORDS').then(function (data) {
            if (data.data.Table.length > 0) {
                if (flag == null || flag == undefined) {
                    $scope.CASHUP_BANKING_RECORDS = data.data.Table;
                }
                else if (flag == 1) {
                    $scope.CASHUP_BANKING_RECORDS = $scope.CASHUP_BANKING_RECORDS.concat(data.data.Table);
                }
                if (data.data.Table.length < $scope.CASH_BANKING_SEARCH.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.CASH_BANKING_SEARCH.PAGE_NO = parseInt($scope.CASH_BANKING_SEARCH.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else if ($scope.CASH_BANKING_SEARCH.PAGE_NO > 1 && data.data.Table.length == 0) {
                $scope.GetData = false;
            }
            else if ($scope.CASH_BANKING_SEARCH.PAGE_NO == 1 && data.data.Table.length == 0) {
                $scope.CASHUP_BANKING_RECORDS = [];
                $scope.LOAD_FETCH_TEXT = 'No Records Found !';
            }
        })
    }

    $scope.SELECT_SITE = function (_site) {
        $scope.CASH_BANKING_SEARCH.SELECTED_SITE = _site;
        $scope.GET_CASHUP_BANKING_RECORDS();
        $scope.GET_CASHUP_BANKED_RECORDS();
    }
    $scope.nginit_cashbanking = function (_row) {
        _row.CHECKED = false;
    }
    $scope.nginit_banked_cash = function (_row) {
        $scope.$parent.$parent.GET_UPLOADS(_row, 27, _row.CASH_BANKING_ENTRY_ID);
        _row.isOpen = false;
    }
    $scope.UPDATE_ENTRY = function (_row) {
        if (_row.CHECKED == true) {
            let index = $scope.CASHUP_BANKING_ENTRY_LIST.indexOf(_row);
            if (index !== -1) {
                $scope.CASHUP_BANKING_ENTRY_LIST.splice(index, 1);
            }
        }
        else {
            $scope.CASHUP_BANKING_ENTRY_LIST.push(_row);
        }
        $scope.CALCULATE_EPOS_CASH();
    }
    $scope.CHECK_ALL_RECORDS = function () {
        if ($scope.RECORD_CHECKED_ALL == false) {
            $scope.CASHUP_BANKING_ENTRY_LIST = [];
            angular.forEach($scope.CASHUP_BANKING_RECORDS, function (_row) {
                _row.CHECKED = true;
                $scope.CASHUP_BANKING_ENTRY_LIST.push(_row);
            })
        }
        else {
            $scope.CASHUP_BANKING_ENTRY_LIST = [];
            angular.forEach($scope.CASHUP_BANKING_RECORDS, function (_row) {
                _row.CHECKED = false;
            })
        }
    }
    $scope.CALCULATE_EPOS_CASH = function () {
        var total = 0;
        angular.forEach($scope.CASHUP_BANKING_ENTRY_LIST, function (_row) {
            if (!isNaN(parseFloat(_row.EPOS_CASH))) {
                total += parseFloat(_row.EPOS_CASH);
            }
        })
        $scope.CASH_BANKING_SEARCH.EPOS_TOTAL = total.toFixed(2);
        $scope.CASH_BANKING_SEARCH.BANKED_CASH = total.toFixed(2);

    }
    $scope.SELECT_ROW_FOR_APPROVAL = function(_row){
        $scope.IS_APPROVE = true;
        
        $scope.CASHUP_BANKING_ENTRY_LIST = [];
        $scope.RESET_ENTRY();
        angular.forEach(_row.CASHUP_LIST, function (cashup) {
            var entry = new Object();
            entry.CASHUP_MAIN_ID = cashup.CASHUP_MAIN_ID;
            entry.BRANCH_ID = cashup.BRANCH_ID;
            entry.BRANCH_NAME = cashup.BRANCH_NAME;
            entry.CASHUP_DATE = cashup.CASHUP_DATE;
            entry.EPOS_CASH = cashup.EPOS_CASH;
            entry.BANKING_STATUS = cashup.BANKING_STATUS;
            
            $scope.CASHUP_BANKING_ENTRY_LIST.push(entry);
        })
        $scope.CALCULATE_EPOS_CASH();
        $scope.CASH_BANKING_SEARCH.DEPOSIT_DATE = moment(_row.BANKED_DATE).format($scope.$parent.CONVERSION_DATE_FORMAT);
        $scope.CASH_BANKING_SEARCH.BANKING_HEADER_ID = _row.CASH_BANKING_HDR_ID;
        $scope.CASH_BANKING_SEARCH.CASH_BANKING_ENTRY_ID = _row.CASH_BANKING_ENTRY_ID;
        $scope.CASH_BANKING_SEARCH.COMMENTS = _row.COMMENTS;
        $scope.CASH_BANKING_SEARCH.NOTES = _row.NOTES;
        $scope.CASH_BANKING_SEARCH.BANK_SLIP_REF = _row.BANK_SLIP;
        $scope.CASH_BANKING_SEARCH.UPLOAD_IDS = _row.UPLOAD_IDS;
        $scope.$parent.$parent.GET_UPLOADS($scope.CASH_BANKING_SEARCH, 27, _row.CASH_BANKING_ENTRY_ID);
        $scope.$parent.Fn_TAB_CLICK(2);
    }
    $scope.dateinputddmmyy = function (index) {
        $(document).ready(function () {
            var date_inputs = document.getElementsByClassName("dateinputddmmyy") //our date input has the name "date"
            if (date_inputs.length > 0) {
                for (var i = 0; i < date_inputs.length; i++) {
                    var date_input = $('input[name="' + date_inputs[i].name + '"]'); //our date input has the name "date"
                    var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
                    var date = new Date();
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
                        endDate:date
                    };
                    date_input.datepicker(options).on("hide", function (e) {

                    })
                }
            }
        });
    }
    $scope.dateinputddmmyy(1);


    $scope.getTheFilesToUploadCashBank = function ($files, ControlName, FileSize, List, Attachment_UPLOAD_TYPE_ID) {

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
        var fileUpload = document.getElementById("File");
        extension = fileUpload.files[0].name;
        $scope.uploadFiles(Attachment_UPLOAD_TYPE_ID, '', extension, List, 'CashBank');
    };
    $scope.uploadFiles = function (Attachment_UPLOAD_TYPE_ID, ATTACHEMENT_TYPE_ID, filename, List, FolderName) {

        if (($scope.Files != undefined && $scope.Files.length > 0)) {
            $scope.DocImageResult = [];
            var data = new FormData();
            data.append("RelativeID", List.CASH_BANKING_ENTRY_ID == 0 ? $scope.generaterandom(12) + "" : List.CASH_BANKING_ENTRY_ID);
            //data.append("RelativeID", $scope.generaterandom(12));
            data.append("UPLOAD_TYPE_ID", Attachment_UPLOAD_TYPE_ID);
            data.append("VIRTUALPATH", '/CashUp/' + FolderName + '/' + $scope.CASH_BANKING_SEARCH.SELECTED_SITE.BRANCH_ID + '/');
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
                var fileInput = document.getElementById("File"); // Reset the file input
                if (fileInput) {
                    fileInput.value = ""; // Clear the input field
                }
            });
        }
    };
    $scope.DELETE_UPLOAD_ALL = function (Array, item, index) {
        if (confirm('Are you sure you want to delete?')) {
            Array.UploadedFiles.splice(index, 1);
            var CashupModelObj = new Object();
            CashupModelObj.ID = parseInt(item.ID);
            PrcCommMethods.CASHUP_APP_API(CashupModelObj, 'DELETE_UPLOAD').then(function (data) {
                var fileInput = document.getElementById("File"); // Reset the file input
                if (fileInput) {
                    fileInput.value = ""; // Clear the input field
                }
                alert("Deletion Success");
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

    $scope.RESET_ENTRY = function () {
        $scope.CASHUP_BANKING_ENTRY_LIST = [];
        $scope.CASH_BANKING_SEARCH.EPOS_TOTAL = null;
        $scope.CASH_BANKING_SEARCH.BANKED_CASH = null;
        $scope.CASH_BANKING_SEARCH.DEPOSIT_DATE = null;
        $scope.CASH_BANKING_SEARCH.BANK_SLIP_REF = null;
        $scope.CASH_BANKING_SEARCH.NOTES = null;
        $scope.CASH_BANKING_SEARCH.UploadedFiles = [];
        $scope.CASH_BANKING_SEARCH.BANKING_HEADER_ID = 0;
        $scope.CASH_BANKING_SEARCH.CASH_BANKING_ENTRY_ID = 0;
        $scope.CASH_BANKING_SEARCH.SUBMIT_FLAG = 1;
        $scope.CASH_BANKING_SEARCH.IS_DELETED = 0;
        $scope.CASH_BANKING_SEARCH.COMMENTS = null;
        angular.forEach($scope.CASHUP_BANKING_RECORDS, function (_row) {
            _row.CHECKED = false;
        })
        $scope.RECORD_CHECKED_ALL = false;
    }
    $scope.APPROVE = function () {
        $scope.CASH_BANKING_SEARCH.SUBMIT_FLAG = 2;
        $scope.CASH_BANKING_SEARCH.IS_DELETED = 0;
        $scope.INS_UPD_CASH_BANKING_ENTRY();
    }
    $scope.REJECT = function () {
        $scope.CASH_BANKING_SEARCH.SUBMIT_FLAG = 3;
        $scope.CASH_BANKING_SEARCH.IS_DELETED = 1;
        $scope.INS_UPD_CASH_BANKING_ENTRY();
    }
    $scope.EXPORT_BANKED_CASH = function (export_flag) {
        var ExportList = [];
        angular.forEach($scope.BANKED_CASH_LIST, function (_row) {
            var ExportObject = new Object();
            ExportObject.SITE = _row.BRANCH_NAME;
            ExportObject.BANKED_DATE = _row.BANKED_DATE;
            ExportObject.CASHUP_DATE = null;
            ExportObject.EPOS_CASH = _row.EPOS_CASH_TOTAL;
            ExportObject.BANKED_CASH = _row.BANKED_CASH;
            ExportObject.APPROVED_DATE = _row.APPROVED_DATE;
            ExportObject.BANKING_STATUS = _row.BANKING_STATUS;
            ExportList.push(ExportObject);
            angular.forEach(_row.CASHUP_LIST, function (cashup) {
                var ExportObject = new Object();
                ExportObject.SITE = cashup.BRANCH_NAME;
                ExportObject.BANKED_DATE = null;
                ExportObject.CASHUP_DATE = cashup.CASHUP_DATE;
                ExportObject.EPOS_CASH = cashup.EPOS_CASH;
                ExportObject.BANKED_CASH = null;
                ExportObject.APPROVED_DATE = null;
                ExportObject.BANKING_STATUS = null;
                ExportList.push(ExportObject);
            });
        });

        var CashupAppModelObj = new Object();
        CashupAppModelObj.BANKED_CASH_EXPORT_LIST = ExportList;
        CashupAppModelObj.EXPORT_FLAG = export_flag;
        CashupAppModelObj.FILE_PATH = "/CASH_BANKING_"+"/CUSTOMER_" + $scope.CASH_BANKING_SEARCH.CUSTOMER_ID + "/" + "USER_ID_" + $scope.CASH_BANKING_SEARCH.USER_ID + "/" + (export_flag == 1 ? "CSV" : "XLSX") + "/";
        CashupAppModelObj.FILE_NAME = "Banked_Cash_Record";
        PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'EXPORT_BANKED_CASH').then(function (data) {
            if (data.data != null) {
                $scope.SERVER_FILE_PATH = '/' + data.data.FOLDER_NAME + data.data.RETURN_FILE_NAME;
                $scope.FILE_NAME = CashupAppModelObj.FILE_NAME;
                window.location.href = $scope.SERVER_FILE_PATH;
            } else {
                alert("Export failed. Please try again.");
            }
        });
    }
    $scope.INS_UPD_CASH_BANKING_ENTRY = function (flag) {

        $scope.CashBankingEntryForm.submitted = true;
        if ($scope.CashBankingEntryForm.$valid) {
            var CashupAppModelObj = new Object();
            CashupAppModelObj.ENTITY_ID = $scope.CASH_BANKING_SEARCH.ENTITY_ID;
            CashupAppModelObj.BRANCH_ID = $scope.CASH_BANKING_SEARCH.SELECTED_SITE.BRANCH_ID;
            CashupAppModelObj.USER_ID = $scope.CASH_BANKING_SEARCH.USER_ID;
            CashupAppModelObj.BANKABLE_CASH = $scope.CASH_BANKING_SEARCH.EPOS_TOTAL;
            CashupAppModelObj.VARIANCE = parseFloat($scope.CASH_BANKING_SEARCH.BANKED_CASH) - parseFloat($scope.CASH_BANKING_SEARCH.EPOS_CASH);
            CashupAppModelObj.BANKING_HEADER_ID = $scope.CASH_BANKING_SEARCH.BANKING_HEADER_ID;

            var cashupMainIds = [];
            angular.forEach($scope.CASHUP_BANKING_ENTRY_LIST, function (_row) {
                var mainId = new Object();
                mainId.TABLE_ID = _row.CASHUP_MAIN_ID
                cashupMainIds.push(mainId);
            })
            CashupAppModelObj.TABLE_ID_LIST = cashupMainIds;
            CashupAppModelObj.SUBMIT_FLAG = $scope.CASH_BANKING_SEARCH.SUBMIT_FLAG;
            CashupAppModelObj.COMMENTS = $scope.CASH_BANKING_SEARCH.COMMENT;

            var banking_entry_list = [];
            var banking_entry_obj = new Object();
            banking_entry_obj.TABLE_ID = $scope.CASH_BANKING_SEARCH.CASH_BANKING_ENTRY_ID;
            banking_entry_obj.BANKED_AMOUNT = $scope.CASH_BANKING_SEARCH.BANKED_CASH;
            banking_entry_obj.DEPOSIT_DATE = moment($scope.CASH_BANKING_SEARCH.DEPOSIT_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).format($scope.$parent.DB_DATE_FORMAT);; // require conversaion
            banking_entry_obj.DEPOSITED_BY = $scope.CASH_BANKING_SEARCH.USER_ID;
            banking_entry_obj.BANK_SLIP = $scope.CASH_BANKING_SEARCH.BANK_SLIP_REF;
            banking_entry_obj.IS_DELETED = $scope.CASH_BANKING_SEARCH.IS_DELETED;
            banking_entry_obj.NOTES = $scope.CASH_BANKING_SEARCH.NOTES;
            UPLOAD_IDS = "";
            angular.forEach($scope.CASH_BANKING_SEARCH.UploadedFiles, function (FILE) {
                if (UPLOAD_IDS == "") {
                    UPLOAD_IDS = FILE.UPLOAD_ID;
                }
                else {
                    UPLOAD_IDS = UPLOAD_IDS + "," + FILE.UPLOAD_ID;
                }
            });
            banking_entry_obj.UPLOAD_IDS = UPLOAD_IDS;
            banking_entry_list.push(banking_entry_obj);
            CashupAppModelObj.CASH_BANKING_ENTRY_TYPE = banking_entry_list;
            PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'INS_UPD_CASH_BANKING_ENTRY').then(function (data) {
                if (data.data > 0) {
                    $scope.CashBankingEntryForm.submitted = false;
                    $scope.IS_APPROVE = false;
                    $scope.RESET_ENTRY();
                    $scope.GET_CASHUP_BANKING_RECORDS();
                    $scope.GET_CASHUP_BANKED_RECORDS();
                }

            });
        }
    }
});