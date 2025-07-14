app.controller('PettyCashController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    if ($scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID == null || $scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID == undefined || $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_ID == null || $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_ID == undefined) {
        $location.path('CashUpApp_Entry');
        return;
    }
    $scope.$parent.REDIRECT_REGISTER_ENTRY = false;
    $scope.$parent.TAB_ID = 4;
    $scope.TAB_ID = 4;
    $scope.CASHUP_INFO = {};
    $scope.CASHUP_INFO.ACTUAL = 0;
    $scope.CASHUP_INFO.EPOS = 0;
    $scope.CASHUP_HEADER_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_ID;
    $scope.CASHUP_MAIN_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_MAIN_ID;
    
    $scope.AUTHORIZER_LIST = [];
    $scope.VENDOR_LIST = [];
    $scope.COST_CATEGORY_LIST = [];
    $scope.PETTY_CASH_DECLARATION_LIST = [];
    $scope.ADD_NEW_ROW_FLAG = false;
    $scope.TOTAL_GROSS = 0;
    $scope.TOTAL_VAT = 0;
    $scope.TOTAL_NET = 0;
    $scope.ADD_VENDOR = new Object();
    $scope.ADD_VENDOR.NAME = "";
    $scope.ADD_VENDOR.EMAIL = "";
    $scope.ADD_VENDOR.CONTACT = ""
    $scope.ADD_CC = new Object();
    $scope.ADD_CC.NAME = "";
    $scope.ADD_CC.GL_NAME = "";
    $scope.ADD_CC.GL_CODE = "";
    $scope.SELECTED_FILES = [];
    $scope.SELECTED_ROW_FOR_UPLOAD = null;
    $scope.SELECTED_INDEX = null;
    $scope.CASHUP_ENTRY_NOTE = "";
    $scope.TOTAL_GROSS = 0;
    $scope.TOTAL_VAT = 0;
    $scope.TOTAL_NET = 0;
    $scope.ADMIN_GET_BRANCH_STAFF = function () {
        CashupTabsObj = new Object();

        CashupTabsObj.CUSTOMER_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.CUSTOMER_ID;
        CashupTabsObj.ENTITY_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.ENTITY_ID;
        CashupTabsObj.LOCATION_ID = 0;
        CashupTabsObj.BRANCH_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID;
        CashupTabsObj.ACTIVE = 1;
        CashupTabsObj.STAFF_NAME = '';
        CashupTabsObj.PAGE_NO = 1;
        CashupTabsObj.PAGE_SIZE = 999;
        PrcCommMethods.ADMIN_API(CashupTabsObj, 'ADMIN_GET_BRANCH_STAFF').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.AUTHORIZER_LIST = data.data.Table;
            }
            else {
                $scope.AUTHORIZER_LIST = [];
            }
            $scope.GET_PETTY_CASH_COST_CATEGORIES();
        });

    };
    $scope.GET_CASHUP_VENDORS = function (flag) {
        CommonObj = new Object();
        CommonObj.BRANCH_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID;
        PrcCommMethods.CASHUP_APP_API(CommonObj, 'GET_CASHUP_VENDORS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.VENDOR_LIST = data.data.Table;
            }
            else {
                $scope.VENDOR_LIST = [];
            }
            if (flag == undefined) {
                $scope.ADMIN_GET_BRANCH_STAFF();
            }
            else if (flag == 1) {
                angular.forEach($scope.PETTY_CASH_DECLARATION_LIST, function (_row) {
                    _row.FILTERED_VENDOR_LIST = data.data.Table;
                });
            }
        });
    };
    $scope.GET_PETTY_CASH_COST_CATEGORIES = function (flag) {
        var Obj = new Object();
        Obj.BRANCH_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID;
        PrcCommMethods.CASHUP_APP_API(Obj, 'GET_PETTY_CASH_COST_CATEGORIES').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.COST_CATEGORY_LIST = data.data.Table;
            }
            if (flag == undefined) {
                $scope.GET_PETTY_CASH_DECLERATION();
            }
            else if (flag == 1) {
                angular.forEach($scope.PETTY_CASH_DECLARATION_LIST, function (_row) {
                    _row.FILTERED_COST_CATEGORY_LIST = data.data.Table;
                });
            }
        });
    };
    $scope.GET_PETTY_CASH_DECLERATION = function () {
        var Obj = new Object();
        Obj.CASHUP_HEADER_ID = $scope.CASHUP_HEADER_ID;
        PrcCommMethods.CASHUP_APP_API(Obj, 'GET_PETTY_CASH_DECLERATION').then(function (data) {
            $scope.PETTY_CASH_DECLARATION_LIST = [];
            if (data.data.Table.length > 0) {
                $scope.PETTY_CASH_DECLARATION_LIST = data.data.Table;
            }
            else
            {
                $scope.ADD_ROW();
            }
            if ($scope.ADD_NEW_ROW_FLAG == true) {
                $scope.ADD_NEW_ROW_FLAG = false;
                $scope.ADD_ROW();
            }
        });
    };
    $scope.GET_CASHUP_PTY_CSH_VNDR_SJTNS = function (_row) {
        var ModelObj = new Object();
        ModelObj.BRANCH_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID;
        ModelObj.VENDOR_NAME = _row.VENDOR_TEXT;
        PrcCommMethods.CASHUP_APP_API(ModelObj, 'GET_CASHUP_PTY_CSH_VNDR_SJTNS').then(function (data) {
            if (data.data.Table.length > 0) {
                _row.FILTERED_VENDOR_LIST = data.data.Table;
            }
        });
    };
    $scope.GET_CASHUP_HEADER_NOTES = function () {
        var CashupModelObj = new Object();
        CashupModelObj.NOTE_TYPE_ID = 4;
        CashupModelObj.CASHUP_HEADER_ID = $scope.CASHUP_HEADER_ID;
        PrcCommMethods.CASHUP_APP_API(CashupModelObj, 'GET_CASHUP_HEADER_NOTES').then(function (data) {
            if (data.data.Table != null && data.data.Table.length > 0) {
                $scope.PETTY_CASH_TAB_NOTE_LIST = data.data.Table.map(function (item) {
                    item.isEditable = false;
                    return item;
                });;
            }
        });
    };
    $scope.GET_CASHUP_VENDORS();
    $scope.GET_CASHUP_HEADER_NOTES();
    
    $scope.nginit_pettycash = function (_row) {
        $scope.$parent.$parent.GET_UPLOADS(_row, 13, _row.ID);
        _row.VENDOR_TEXT = "";
        _row.COST_CATEGORY_TEXT = "";
        _row.FILTERED_VENDOR_LIST = $scope.VENDOR_LIST;
        _row.FILTERED_COST_CATEGORY_LIST = $scope.COST_CATEGORY_LIST;
        
        if (_row.ACTIVE == true || _row.ACTIVE == 1) {
            if (!isNaN(parseFloat(_row.TOTAL_VALUE))) {
                $scope.TOTAL_GROSS += parseFloat(_row.TOTAL_VALUE);
            }
            if (!isNaN(parseFloat(_row.VAT_AMOUNT))) {
                $scope.TOTAL_VAT += parseFloat(_row.VAT_AMOUNT);
            }
            if (!isNaN(parseFloat(_row.NET_AMOUNT))) {
                $scope.TOTAL_NET += parseFloat(_row.NET_AMOUNT);
            }
        }
        
        //<td class="text-end">{{(TOTAL_GROSS = (((PETTY_CASH_DECLARATION_LIST) | total: 'TOTAL_VALUE' )| number:2) )}}</td>
        //    <td class="text-end">{{(TOTAL_VAT = (((PETTY_CASH_DECLARATION_LIST) | total: 'VAT_AMOUNT' )| number:2) )}}</td>
        //    <td class="text-end">{{(TOTAL_NET = (((PETTY_CASH_DECLARATION_LIST) | total: 'NET_AMOUNT' )| number:2) )}}</td>
    }

    $scope.DELETE_DECLARATION = function (ROW) {
        if (confirm('Are you sure you want to proceed?')) {
            if (ROW.ID == 0 || ROW.ID == null) {
                let index = $scope.PETTY_CASH_DECLARATION_LIST.indexOf(ROW);
                if (index !== -1) {
                    $scope.PETTY_CASH_DECLARATION_LIST.splice(index, 1);
                }
            }
            else {
                ROW.IS_DELETED = 1;
                ROW.ACTIVE = 0;
                $scope.INS_PETTY_CASH_DECLARATION(0);
            }

        }
    };

    $scope.ADD_NEW_ROW = function () {
        if ($scope.PETTY_CASH_DECLARATION_LIST.length == 0) {
            $scope.ADD_ROW();
        }
        else {
            $scope.ADD_NEW_ROW_FLAG = true;
            $scope.INS_PETTY_CASH_DECLARATION(0);
        }
    };

    $scope.ADD_ROW = function () {
        var ROW = new Object();
        ROW.ID = 0;
        ROW.CASHUP_HEADER_ID = $scope.CASHUP_HEADER_ID;
        ROW.ENTITY_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.ENTITY_ID;
        ROW.BRANCH_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID;
        ROW.PAID_TO = null;
        ROW.CASHUP_VENDOR_ID = null;
        ROW.PETTY_CASH_CATEGORY_ID = null;
        ROW.COST_CATEGORY_NAME = null;
        ROW.ITEM = null;
        ROW.TOTAL_VALUE = null;
        ROW.AUTHORIZED_BY_ID = null;
        ROW.AUTHORIZED_BY_NAME = null;
        ROW.VAT_AMOUNT = null;
        ROW.NET_AMOUNT = null;
        ROW.ACTIVE = 1;
        ROW.CREATED_BY = null;
        ROW.CREATED_DATE = null;
        ROW.MODIFIED_BY = null;
        ROW.MODIFIED_DATE = null;
        ROW.UPLOAD_IDS = null;
        ROW.FILE_NAME = null;
        ROW.IS_DELETED = 0;
        $scope.PETTY_CASH_DECLARATION_LIST.push(ROW);

    };
    $scope.SELECT_VENDOR = function (_row, _vendor) {
        _row.PAID_TO = _vendor.VENDOR_NAME;
        _row.CASHUP_VENDOR_ID = _vendor.CASHUP_VENDOR_ID;
    }
    $scope.ADD_NEW_VENDOR_POPUP = function () {
        var myModal = new bootstrap.Modal(document.getElementById('add_vendor'), {
            keyboard: false  // Optional: Close modal when pressing ESC
        });
        // Show the modal
        myModal.show();
    };

    
    $scope.ADD_NEW_COST_CATEGORY_POPUP = function () {
        var myModal = new bootstrap.Modal(document.getElementById('add_cost_category'), {
            keyboard: false  // Optional: Close modal when pressing ESC
        });
        // Show the modal
        myModal.show();
    };
    
    $scope.handleKeyPress = function ($event, site, field) {
        if ($event.keyCode === 13) {
            $event.preventDefault();
            if (field === 'name') {
                document.getElementById(`seating-${site.BRANCH_ID}`).focus();
            } else if (field === 'capacity') {
                document.getElementById(`save-${site.BRANCH_ID}`).click();
            }
        }
    };

    $scope.SHOW_DDL_Fn = function (FLAG) {
        if (FLAG == 1) {
            $(".searchableVendorButton").show();
        }
        if (FLAG == 1) {
            $(".searchableCostCategoryButton").show();
        }

    };
    $scope.SEARCH_COST_CATEGORY = function (_row) {
        _row.FILTERED_COST_CATEGORY_LIST = $scope.COST_CATEGORY_LIST.filter(cc => cc.COST_CATEGORY_NAME.toLowerCase().includes(_row.COST_CATEGORY_TEXT.toLowerCase()));
    }
    $scope.SELECT_COST_CATEGORY = function (_row, cc) {
        _row.COST_CATEGORY_NAME = cc.COST_CATEGORY_NAME;
        _row.PETTY_CASH_CATEGORY_ID = cc.PETTY_CASH_COST_CATEGORIE_ID;
    }
    $scope.EDIT_COMMENT = function (COMMENT) {
        COMMENT.isEditable = true;
    }

    $scope.VALIDATE_AMOUNT = function (_row,_current) {
        if (!isNaN(parseFloat(_row.TOTAL_VALUE)) && !isNaN(parseFloat(_row.VAT_AMOUNT))) {
            if (parseFloat(_row.VAT_AMOUNT) >= parseFloat(_row.TOTAL_VALUE)) {
                $scope.$parent.ShowAlertBox('Error', 'VAT amount can not be equal or greater than Gross amount.');
                if (_current == 'GROSS') {
                    _row.TOTAL_VALUE = 0;
                    _row.VAT_AMOUNT = 0;
                }
                else if (_current == 'VAT'){
                    _row.VAT_AMOUNT = 0;
                }
            }
        }
    }
    $scope.CALCULATE_NET_AMOUNT = function (_row) {
        if (!isNaN(parseFloat(_row.TOTAL_VALUE)) && isNaN(parseFloat(_row.VAT_AMOUNT)) ) {
            _row.NET_AMOUNT = _row.TOTAL_VALUE;
        }
        else if (parseFloat(_row.VAT_AMOUNT) < parseFloat(_row.TOTAL_VALUE)) {
            _row.NET_AMOUNT = parseFloat(_row.TOTAL_VALUE) - parseFloat(_row.VAT_AMOUNT);
        }
        else {
            _row.NET_AMOUNT = 0;
        }
        var totalGross = 0;
        var totalVAT = 0;
        var totalNET = 0;
        angular.forEach($scope.PETTY_CASH_DECLARATION_LIST, function (row) {
            if (row.ACTIVE == true || row.ACTIVE == 1) {
                if (!isNaN(parseFloat(row.TOTAL_VALUE))) {
                    totalGross += parseFloat(row.TOTAL_VALUE);
                }
                if (!isNaN(parseFloat(row.VAT_AMOUNT))) {
                    totalVAT += parseFloat(row.VAT_AMOUNT);
                }
                if (!isNaN(parseFloat(row.NET_AMOUNT))) {
                    totalNET += parseFloat(row.NET_AMOUNT);
                }
            }
        });
        $scope.TOTAL_GROSS = totalGross;
        $scope.TOTAL_VAT = totalVAT;
        $scope.TOTAL_NET = totalNET;
    }

    $scope.SELECT_AUTHORIZER = function (_row, _auth) {
        _row.AUTHORIZED_BY_NAME = _auth.NAME;
        _row.AUTHORIZED_BY_ID = _auth.TABLE_ID;
    }
    // File upload code starts

    $scope.SELECT_ROW_FOR_UPLOAD = function (ROW, index) {
        var fileInput = document.getElementById("CardFile" + index); // Reset the file input
        if (fileInput) {
            fileInput.value = ""; // Clear the input field
        }
        $scope.SELECTED_ROW_FOR_UPLOAD = ROW;
        $scope.SELECTED_ROW_FOR_UPLOAD.SELECTED_INDEX = index;
    }

    $scope.getTheFilesToUploadPcash = function ($files, ControlName, FileSize, List, Attachment_UPLOAD_TYPE_ID, index) {

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
        $scope.uploadFiles(Attachment_UPLOAD_TYPE_ID, '', extension, List, index, 'Pcash');
    };
    $scope.uploadFiles = function (Attachment_UPLOAD_TYPE_ID, ATTACHEMENT_TYPE_ID, filename, List, index, FolderName) {

        if (($scope.Files != undefined && $scope.Files.length > 0)) {
            $scope.DocImageResult = [];
            var data = new FormData();
            data.append("RelativeID", List.ID == 0 ? $scope.generaterandom(12) + "" + index : List.ID);
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


    $scope.SELECT_FILE_FOR_REUPLOAD = function (_row, _upls, index, parent_index) {
        $scope.DELETE_UPLOAD_CARD_ALL(_row, _upls, index);

        var myModal = new bootstrap.Modal(document.getElementById('pcash_upload'), {
            keyboard: false  // Optional: Close modal when pressing ESC
        });
        // Show the modal
        myModal.show();


        var fileInput = document.getElementById("CardFile" + parent_index); // Reset the file input
        if (fileInput) {
            fileInput.value = ""; // Clear the input field
        }
        $scope.SELECTED_ROW_FOR_UPLOAD = _row;
        $scope.SELECTED_ROW_FOR_UPLOAD.SELECTED_INDEX = parent_index;
    }

    
    
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

    //file upload code ends

    $scope.VALIDATE = function () {
        var isValid = true;
        angular.forEach($scope.PETTY_CASH_DECLARATION_LIST, function (list) {
            if (!isValid) return;
            if (parseFloat(list.TOTAL_VALUE) != 0 || parseFloat(list.VAT_AMOUNT) != 0) {
                if (parseFloat(list.VAT_AMOUNT) >= parseFloat(list.TOTAL_VALUE)) {
                    $scope.$parent.ShowAlertBox('Error', "VAT amount can not be equal or greater than Gross amount");
                    isValid = false;
                    return;
                }
            }
            else if (parseFloat(list.TOTAL_VALUE) == 0 && parseFloat(list.VAT_AMOUNT) == 0) {
                if (parseFloat(list.NET_AMOUNT) != 0) {
                    $scope.$parent.ShowAlertBox('Error', "Something went wrong, please check the entered amounts");
                    isValid = false;
                    return;
                }
            }
        })
        return isValid ? 1 : 0;
    }
    $scope.RESET_ON_MODAL_CLOSE = function () {
        $scope.TOTAL_GROSS = 0;
        $scope.TOTAL_VAT = 0;
        $scope.TOTAL_NET = 0;
        $scope.GET_CASHUP_VENDORS();
    }
    $scope.PREVIOUS = function () {
        if ($scope.$parent.CASHUP_ENTRY_SEARCH.IS_DATA_ENTRY_ENABLED == true) {
            $scope.INS_PETTY_CASH_DECLARATION(0, 1);
        }
        else {
            $scope.Fn_Cashup_entry_TAB_CLICK($scope.TAB_ID, 0);
        }
    }
    $scope.CONTINUE = function () {
        if ($scope.$parent.CASHUP_ENTRY_SEARCH.IS_DATA_ENTRY_ENABLED == true) {

            $scope.PcashEntryForm.submitted = true;
            if ($scope.PcashEntryForm.$valid) {
                if (!isNaN(parseFloat($scope.CASHUP_INFO.ACTUAL) - parseFloat($scope.CASHUP_INFO.EPOS))) {
                    if (parseFloat($scope.CASHUP_INFO.ACTUAL) - parseFloat($scope.CASHUP_INFO.EPOS) != 0) {
                        var myModal = new bootstrap.Modal(document.getElementById('proceed'), {
                            keyboard: false  // Optional: Close modal when pressing ESC
                        });
                        // Show the modal
                        myModal.show();
                    }
                    else {
                        $scope.INS_PETTY_CASH_DECLARATION(1);
                    }
                }
                else {
                    $scope.INS_PETTY_CASH_DECLARATION(1);
                }
            }
        }
        else {
            $scope.Fn_Cashup_entry_TAB_CLICK($scope.TAB_ID, 1);
        }
    }

    $scope.INS_PETTY_CASH_DECLARATION = function (isDraft,isPrevious) {
        if ($scope.VALIDATE() != 0) {
            $scope.PcashEntryForm.submitted = true;
            if ($scope.PcashEntryForm.$valid) {
                var CashupAppModelObj = new Object();
                CashupAppModelObj.CASHUP_HEADER_ID = $scope.CASHUP_HEADER_ID;
                CashupAppModelObj.ENTITY_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.ENTITY_ID;
                CashupAppModelObj.BRANCH_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID;
                CashupAppModelObj.USER_ID = parseInt($cookies.get("USERID"));
                CashupAppModelObj.IS_DRAFT = isDraft;
                CashupAppModelObj.STEP_NO = 5;
                var totalGross = 0;
                var declaration_list = [];
                angular.forEach($scope.PETTY_CASH_DECLARATION_LIST, function (row) {
                    var declaration = new Object();
                    declaration.TABLE_ID = (row.ID == undefined || row.ID == null) ? 0 : row.ID;
                    declaration.PAID_TO = row.PAID_TO;
                    declaration.PETTY_CASH_CATEGORY_ID = row.PETTY_CASH_CATEGORY_ID;
                    declaration.ITEM = row.ITEM;
                    declaration.TOTAL_VALUE = parseFloat(row.TOTAL_VALUE).toFixed(5);
                    declaration.AUTHORIZED_BY_ID = row.AUTHORIZED_BY_ID;
                    declaration.AUTHORIZED_BY_NAME = row.AUTHORIZED_BY_NAME;
                    declaration.VAT_AMOUNT = parseFloat(row.VAT_AMOUNT).toFixed(5);
                    declaration.NET_AMOUNT = parseFloat(row.NET_AMOUNT).toFixed(5);
                    declaration.ACTIVE = row.ACTIVE;
                    UPLOAD_IDS = "";
                    angular.forEach(row.UploadedFiles, function (FILE) {
                        if (UPLOAD_IDS == "") {
                            UPLOAD_IDS = FILE.UPLOAD_ID;
                        }
                        else {
                            UPLOAD_IDS = UPLOAD_IDS + "," + FILE.UPLOAD_ID;
                        }
                    });
                    declaration.UPLOAD_IDS = UPLOAD_IDS;
                    declaration.IS_DELETED = row.IS_DELETED;
                    declaration.CASHUP_VENDOR_ID = row.CASHUP_VENDOR_ID;
                    declaration_list.push(declaration);

                    if (row.ACTIVE == true || row.ACTIVE == 1) {
                        if (!isNaN(parseFloat(row.TOTAL_VALUE))) {
                            totalGross += parseFloat(row.TOTAL_VALUE);
                        }
                    }

                });
                CashupAppModelObj.TOTAL_PETTY_CASH = parseFloat(totalGross).toFixed(5);
                CashupAppModelObj.PETTY_CASH_DECLERATION = declaration_list;
                PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'INS_PETTY_CASH_DECLARATION').then(function (data) {
                    $scope.PcashEntryForm.submitted = false;
                    
                    
                    $scope.GET_CASHUP_ENTRY_HEADER($scope.CASHUP_HEADER_ID);
                    if (isDraft) {
                        $scope.Fn_Cashup_entry_TAB_CLICK($scope.TAB_ID, 1);
                    }
                    if (isPrevious == 1) {
                        $scope.Fn_Cashup_entry_TAB_CLICK($scope.TAB_ID, 0);
                    }
                    else {
                        $scope.TOTAL_GROSS = 0;
                        $scope.TOTAL_VAT = 0;
                        $scope.TOTAL_NET = 0;
                        $scope.GET_CASHUP_VENDORS();
                    }
                });
            }
        }
        
    };

    $scope.INS_UPD_PETTY_CASH_COST_CATEGORIES = function () {
        $scope.CC_FORM.submitted = true;
        if ($scope.CC_FORM.$valid) {
            var CashupModelObj = new Object();
            CashupModelObj.PETTY_CASH_COST_CATEGORIE_ID = 0;
            CashupModelObj.CATEGORY_NAME = $scope.ADD_CC.NAME;
            CashupModelObj.GL_NAME = $scope.ADD_CC.GL_NAME;
            CashupModelObj.GL_CODE = $scope.ADD_CC.GL_CODE;
            CashupModelObj.CUSTOMER_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.CUSTOMER_ID;
            CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            CashupModelObj.BRANCH_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID;
            CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
            CashupModelObj.ACTIVE = 1;
            CashupModelObj.COST_CATEGORIE_CREATOR = 2;
            PrcCommMethods.CASHUP_APP_API(CashupModelObj, 'INS_UPD_PETTY_CASH_COST_CATEGORIES').then(function (data) {
                if (data.data == 0) {
                    var myModal = new bootstrap.Modal(document.getElementById('add_cc_failure'), {
                        keyboard: false  // Optional: Close modal when pressing ESC
                    });
                    // Show the modal
                    myModal.show();
                }
                if (data.data > 0) {
                    var modalEl = document.getElementById('add_cost_category');
                    var existingModal = bootstrap.Modal.getInstance(modalEl);
                    if (existingModal) {
                        existingModal.hide();
                    }

                    var myModal = new bootstrap.Modal(document.getElementById('add_cc_success'), {
                        keyboard: false  // Optional: Close modal when pressing ESC
                    });
                    // Show the modal
                    myModal.show();
                    $scope.GET_PETTY_CASH_COST_CATEGORIES(1);
                }
                $scope.CC_FORM.submitted = false;
            });
        }

    };
    $scope.INS_UPD_CASHUP_VENDORS = function () {
        $scope.VENDER_FORM.submitted = true;
        if ($scope.VENDER_FORM.$valid) {
            var vendorObj = new Object();
            vendorObj.VENDOR_ID = 0;
            vendorObj.VENDOR_NAME = $scope.ADD_VENDOR.NAME;
            vendorObj.VENDOR_EMAIL = $scope.ADD_VENDOR.EMAIL;
            vendorObj.VENDOR_CONTACT = $scope.ADD_VENDOR.CONTACT;
            vendorObj.COUNTRY_ID = null;
            vendorObj.PHONE_CODE_ID = null;
            vendorObj.NATIONALITY_ID = null;
            vendorObj.CUSTOMER_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.CUSTOMER_ID;
            vendorObj.ENTITY_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.ENTITY_ID;
            vendorObj.BRANCH_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID;
            vendorObj.ACTIVE = 1;
            vendorObj.USER_ID = parseInt($cookies.get("USERID"));
            vendorObj.VENDOR_CREATOR = 2;

            PrcCommMethods.CASHUP_APP_API(vendorObj, 'INS_UPD_CASHUP_VENDORS').then(function (response) {
                if (response.status == 200) {
                    var modalEl = document.getElementById('add_vendor');
                    var existingModal = bootstrap.Modal.getInstance(modalEl);
                    if (existingModal) {
                        existingModal.hide();
                    }
                    
                    var myModal = new bootstrap.Modal(document.getElementById('add_vendor_success'), {
                        keyboard: false  // Optional: Close modal when pressing ESC
                    });
                    // Show the modal
                    myModal.show();
                    // to get the updated vendor list
                    $scope.GET_CASHUP_VENDORS(1);

                } else {
                    var myModal = new bootstrap.Modal(document.getElementById('add_vendor_failure'), {
                        keyboard: false  // Optional: Close modal when pressing ESC
                    });
                    // Show the modal
                    myModal.show();
                }
                $scope.ADD_VENDOR.NAME = "";
                $scope.ADD_VENDOR.EMAIL = "";
                $scope.ADD_VENDOR.CONTACT = "";
                $scope.VENDER_FORM.submitted = false;
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
    //Code for comments
    $scope.INS_UPD_CASHUP_HEADER_NOTES = function (COMMENT) {
        if (COMMENT == null || COMMENT == undefined || COMMENT.isEditable == true || COMMENT.isEditable == 1) {
            if (($scope.CASHUP_ENTRY_NOTE != null && $scope.CASHUP_ENTRY_NOTE != undefined && $scope.CASHUP_ENTRY_NOTE != "") || (COMMENT != null && COMMENT != undefined && COMMENT != "")) {
                var CashupModelObj = new Object();
                CashupModelObj.NOTE_TYPE_ID = 4;
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
                    $scope.PETTY_CASH_TAB_NOTE_LIST = [];
                    $scope.GET_CASHUP_HEADER_NOTES();

                });
            }
            else {
                alert('Comments cannot be empty while saving');
            }
        }
        
    };
    
    // comment code ends

    $scope.$on('$destroy', function () {
        $('.modal.show').modal('hide');
        $('.dropdown-menu').hide();
    });
});