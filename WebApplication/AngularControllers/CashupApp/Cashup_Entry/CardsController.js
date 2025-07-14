app.controller('CardsController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    if ($scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID == null || $scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID == undefined || $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_ID == null || $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_ID == undefined) {
        $location.path('CashUpApp_Entry');
        return;
    }
    $scope.$parent.REDIRECT_REGISTER_ENTRY = false;
    $scope.$parent.TAB_ID = 3;
    $scope.TAB_ID = 3;
    $scope.CASHUP_HEADER_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_ID;
    $scope.CASHUP_MAIN_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_MAIN_ID;
    $scope.CASHUP_INFO = [];
    $scope.CASHUP_INFO.ACTUAL = $scope.$parent.CASHUP_HEADER_VALUES.CARDS.ACTUAL;
    $scope.CASHUP_INFO.EPOS = $scope.$parent.CASHUP_HEADER_VALUES.CARDS.EPOS;

    $scope.DD_DEFAULT_TEXT = {
        PDQ: "Select PDQ"
    };
    $scope.ADD_NEW_ROW_FLAG = false;
    $scope.CARDS_LIST = [];
    $scope.PDQ_LIST = [];
    $scope.CARDS_ENTRY_LIST = [];
    $scope.TOTAL_CARD_AMOUNT = 0;
    $scope.SELECTED_FILES = [];
    $scope.SELECTED_ROW_FOR_UPLOAD = null;
    $scope.CASHUP_ENTRY_NOTE = "";

    $scope.GET_CASHUP_CARDS = function () {
        var Cardobj = new Object();
        Cardobj.BRANCH_ID = $scope.CASHUP_ENTRY_SEARCH.BRANCH_ID;
        Cardobj.CASHUP_HEADER_ID = $scope.CASHUP_HEADER_ID;
        PrcCommMethods.CASHUP_APP_API(Cardobj, 'GET_CASHUP_CARDS').then(function (data) {
            if (data.data && data.data.Table.length > 0) {
                $scope.CARDS_LIST = data.data.Table;
                $scope.ADD_ROW($scope.INIT_CARD_DECLARATION_LIST);
                if ($scope.ADD_NEW_ROW_FLAG == true) {
                    $scope.ADD_NEW_ROW_FLAG = false;
                    $scope.ADD_ROW();
                }
            } else {
                console.warn("No cards found for branch ID " + $scope.CASHUP_ENTRY_SEARCH.BRANCH_ID);
                //$scope.SESSION_MAPPING_LIST = [];
            }
        })
    };
    $scope.ADMIN_GET_PDQ_MASTER = function () {
        CommonObj = new Object();

        CommonObj.PDQ_MASTER_ID = 0;
        CommonObj.CUSTOMER_ID = $cookies.get("CUSTOMER_ID");
        CommonObj.LOCATION_ID = 0;
        CommonObj.PDQ_CODE = '';
        CommonObj.ENTITY_ID = $cookies.get("ENTITY_ID");
        CommonObj.BRANCH_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID;
        CommonObj.ACTIVE = 1;
        CommonObj.USER_ID = parseInt($cookies.get("USERID"));
        CommonObj.PAGE_NO = 0;
        CommonObj.PAGE_SIZE = 0;
        PrcCommMethods.ADMIN_API(CommonObj, 'ADMIN_GET_PDQ_MASTER').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.PDQ_LIST = data.data.Table;
            }
            else {
                $scope.PDQ_LIST = [];
            }
            $scope.GET_CASHUP_CARDS();
        });
    };
    $scope.INIT_CARD_DECLARATION_LIST = [];
    $scope.GET_CARD_DECLARATION = function () {
        CommonObj = new Object();
        CommonObj.CASHUP_HEADER_ID = $scope.CASHUP_HEADER_ID;
        PrcCommMethods.CASHUP_APP_API(CommonObj, 'GET_CARD_DECLERATION').then(function (data) {
            if (data.data.Table != null && data.data.Table.length > 0) {
                $scope.INIT_CARD_DECLARATION_LIST = data.data.Table;
            }
            $scope.ADMIN_GET_PDQ_MASTER();
        });
    };
    $scope.GET_CARD_DECLARATION();
    $scope.GET_CASHUP_HEADER_NOTES = function () {
        var CashupModelObj = new Object();
        CashupModelObj.NOTE_TYPE_ID = 3;
        CashupModelObj.CASHUP_HEADER_ID = $scope.CASHUP_HEADER_ID;
        PrcCommMethods.CASHUP_APP_API(CashupModelObj, 'GET_CASHUP_HEADER_NOTES').then(function (data) {
            if (data.data.Table != null && data.data.Table.length > 0) {
                $scope.CARD_TAB_NOTE_LIST = data.data.Table.map(function (item) {
                    item.isEditable = false;
                    return item;
                });;
            }
        });
    };
    $scope.GET_CASHUP_HEADER_NOTES();
    

    $scope.nginit_cards = function (_row) {
        if (_row.ACTIVE == 1) {
            $scope.$parent.$parent.GET_UPLOADS(_row, 11, _row.CARD_DECLARATION_ID);
            if (!isNaN(parseFloat(_row.TOTAL_AMOUNT))) {
                $scope.TOTAL_CARD_AMOUNT += parseFloat(_row.TOTAL_AMOUNT);
            }
        }
    };
    $scope.ADD_ROW = function (INIT_CARD_DECLARATION_LIST) {
        if (INIT_CARD_DECLARATION_LIST == undefined) {
            var NEW_ROW = new Object();
            NEW_ROW.INDEX = $scope.CARDS_ENTRY_LIST.length == 0 ? 1 : (Math.max(...$scope.CARDS_ENTRY_LIST.map(card => card.INDEX)) + 1);//$scope.CARDS_ENTRY_LIST.length + 1; //$scope.CARDS_ENTRY_LIST 
            NEW_ROW.CARD_DECLARATION_ID = 0;
            NEW_ROW.AUTH_CODE = '';
            NEW_ROW.NOTE = '';
            NEW_ROW.ACTIVE = 1;
            NEW_ROW.UPLOAD_IDS = null;
            NEW_ROW.FILE_NAME = '';
            NEW_ROW.IS_DELETED = 0;
            NEW_ROW.SELECTED_PDQ = null;
            angular.forEach($scope.CARDS_LIST, function (card) {
                if (card && card.CARD_NAME && card.CASHUP_CARD_ID) {
                    NEW_ROW[card.CARD_NAME + '_VALUE'] = {
                        INDEX_ID: NEW_ROW.INDEX,
                        CARD_DECLARATION_LINES_ID: 0,
                        CARD_DECLARATION_ID: 0,
                        CASHUP_CARD_ID: card.CASHUP_CARD_ID,
                        AMOUNT: null,
                        IS_DELETED: 0
                    };
                }
            });
            NEW_ROW.TOTAL_AMOUNT = 0;
            NEW_ROW.UploadedFiles = [];
            $scope.CARDS_ENTRY_LIST.push(NEW_ROW);
        }
        else {
            if (INIT_CARD_DECLARATION_LIST.length == 0) {
                var NEW_ROW = new Object();
                NEW_ROW.INDEX = $scope.CARDS_ENTRY_LIST.length == 0 ? 1 : (Math.max(...$scope.CARDS_ENTRY_LIST.map(card => card.INDEX)) + 1);//$scope.CARDS_ENTRY_LIST.length + 1; //$scope.CARDS_ENTRY_LIST 
                NEW_ROW.CARD_DECLARATION_ID = 0;
                NEW_ROW.AUTH_CODE = '';
                NEW_ROW.NOTE = '';
                NEW_ROW.ACTIVE = 1;
                NEW_ROW.UPLOAD_IDS = null;
                NEW_ROW.IS_DELETED = 0;
                NEW_ROW.SELECTED_PDQ = null;
                angular.forEach($scope.CARDS_LIST, function (card) {
                    if (card && card.CARD_NAME && card.CASHUP_CARD_ID) {
                        NEW_ROW[card.CARD_NAME + '_VALUE'] = {
                            INDEX_ID: NEW_ROW.INDEX,
                            CARD_DECLARATION_LINES_ID: 0,
                            CARD_DECLARATION_ID: 0,
                            CASHUP_CARD_ID: card.CASHUP_CARD_ID,
                            AMOUNT: null,
                            IS_DELETED: 0
                        };
                    }
                });
                NEW_ROW.TOTAL_AMOUNT = 0;
                NEW_ROW.UploadedFiles = [];
                $scope.CARDS_ENTRY_LIST.push(NEW_ROW);
            }
            else {
                // Initialize the final result array
                let result = [];

                // Group data by CARD_DECLARATION_ID
                let groupedData = {};

                INIT_CARD_DECLARATION_LIST.forEach(row => {
                    if (!groupedData[row.CARD_DECLARATION_ID]) {
                        groupedData[row.CARD_DECLARATION_ID] = [];
                    }
                    groupedData[row.CARD_DECLARATION_ID].push(row);
                });

                // Iterate over each unique CARD_DECLARATION_ID group
                for (let declarationId in groupedData) {
                    let rows = groupedData[declarationId];
                    let firstRow = rows[0]; // All rows in the same group will have the same CARD_DECLARATION_ID and INDEX_VALS

                    // Initialize the row object for this group
                    let row = {
                        INDEX: firstRow.INDEX_VALS,
                        CARD_DECLARATION_ID: firstRow.CARD_DECLARATION_ID,
                        AUTH_CODE: firstRow.AUTH_CODE,
                        NOTE: firstRow.NOTE,
                        UPLOAD_IDS: firstRow.UPLOAD_IDS,
                        IS_DELETED: firstRow.IS_DELETED,
                        ACTIVE: rows.some(row => row.ACTIVE == true) ? 1 : 0, // ACTIVE is 1 if any row in the group has ACTIVE = true
                        SELECTED_PDQ: $scope.PDQ_LIST.find(pdq => pdq.PDQ_MASTER_ID == firstRow.PDQ_ID) // Find the matching PDQ
                    };
                    let totalAmount = 0;
                    // For each card in CARDS_LIST, create the dynamic property
                    $scope.CARDS_LIST.forEach(card => {
                        // Filter rows for the current CASHUP_CARD_ID
                        let matchingRow = rows.find(row => row.CASHUP_CARD_ID == card.CASHUP_CARD_ID);

                        if (matchingRow) {
                            // If there's a matching row, populate the value for the card
                            row[card.CARD_NAME + '_VALUE'] = {
                                INDEX_ID: firstRow.INDEX_VALS,
                                CARD_DECLARATION_LINES_ID: matchingRow.CARD_DECLARATION_LINES_ID,
                                CARD_DECLARATION_ID: matchingRow.CARD_DECLARATION_ID,
                                CASHUP_CARD_ID: card.CASHUP_CARD_ID,
                                AMOUNT: matchingRow.CARD_DECLARATION_LINES_AMOUNT == 0 ? null : matchingRow.CARD_DECLARATION_LINES_AMOUNT,
                                IS_DELETED: matchingRow.IS_DELETED
                            };
                            if (matchingRow.CARD_DECLARATION_LINES_AMOUNT != null && matchingRow.CARD_DECLARATION_LINES_AMOUNT != "" && !isNaN(matchingRow.CARD_DECLARATION_LINES_AMOUNT)) {
                                totalAmount += matchingRow.CARD_DECLARATION_LINES_AMOUNT;
                            }
                        } else {
                            // If no matching row, create the default value object
                            row[card.CARD_NAME + '_VALUE'] = {
                                INDEX_ID: firstRow.INDEX_VALS,
                                CARD_DECLARATION_LINES_ID: 0,
                                CARD_DECLARATION_ID: 0,
                                CASHUP_CARD_ID: card.CASHUP_CARD_ID,
                                AMOUNT: null,
                                IS_DELETED: 0
                            };
                        }
                    });
                    row.TOTAL_AMOUNT = totalAmount;
                    row.UploadedFiles = [];
                    // Push the final row object into the result array
                    result.push(row);
                }

                // Final result
                $scope.CARDS_ENTRY_LIST = result;
                
            }
        }
    };
    $scope.ADD_NEW_ROW = function () {
        //if ($scope.INIT_CARD_DECLARATION_LIST.length==0) {
        //    $scope.ADD_ROW();
        //}
        //if ($scope.INIT_CARD_DECLARATION_LIST.length > 0) {
        //    $scope.ADD_NEW_ROW_FLAG = true;
        //    $scope.INS_UPD_DEL_CARD_DECLARATION(0);
        //}
        if ($scope.CARDS_ENTRY_LIST.length == 0) {
            $scope.ADD_ROW();
        }
        if ($scope.CARDS_ENTRY_LIST.length > 0) {
            $scope.ADD_NEW_ROW_FLAG = true;
            $scope.INS_UPD_DEL_CARD_DECLARATION(0);
        }
    }

    $scope.UPDATE_INDEXES = function () {
        angular.forEach($scope.CARDS_ENTRY_LIST, function (ROW, index) {
            // Assign the $index value to a property called INDEX inside each ROW
            ROW.INDEX = index+1; // You can add 1 to make it 1-based instead of 0-based
        });
    };

    $scope.CALCULATE_TOTAL_AMOUNT_ROWWISE = function (ROW,ENTRY_LIST) {
        var total = 0;
        angular.forEach($scope.CARDS_LIST, function (card) {
            if (!isNaN(parseFloat(ROW[card.CARD_NAME + '_VALUE'].AMOUNT))) {
                total += parseFloat(ROW[card.CARD_NAME + '_VALUE'].AMOUNT);
            }
        });
        ROW.TOTAL_AMOUNT = total;

        total = 0;
        angular.forEach(ENTRY_LIST, function (row) {
            if (row.ACTIVE == 1) {
                if (!isNaN(parseFloat(row.TOTAL_AMOUNT))) {
                    total += parseFloat(row.TOTAL_AMOUNT);
                }
            }
        });
        $scope.TOTAL_CARD_AMOUNT = total;
    };
    
    $scope.RESET_PDQ_SELECTION = function (ROW) {
        ROW.SELECTED_PDQ = null;
    };
    $scope.SELECT_PDQ = function (ROW, PDQ) {
        ROW.SELECTED_PDQ = PDQ;
    };
    
    $scope.EDIT_COMMENT = function (COMMENT) {
        COMMENT.isEditable = true;
    }
    // File upload codes
    
    $scope.SELECT_ROW_FOR_UPLOAD = function (ROW) {
        $scope.SELECTED_ROW_FOR_UPLOAD = ROW;
    }
    $scope.getTheFilesToUploadCards = function ($files, ControlName, FileSize, List, Attachment_UPLOAD_TYPE_ID, index) {

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
        $scope.uploadFiles(Attachment_UPLOAD_TYPE_ID, '', extension, List, index, 'Cards');
    };
    $scope.uploadFiles = function (Attachment_UPLOAD_TYPE_ID, ATTACHEMENT_TYPE_ID, filename, List, index, FolderName) {

        if (($scope.Files != undefined && $scope.Files.length > 0)) {
            $scope.DocImageResult = [];
            var data = new FormData();
            data.append("RelativeID", List.CARD_DECLARATION_ID == 0 ? $scope.generaterandom(12) + "" + index : List.CARD_DECLARATION_ID);
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
                var fileInput = document.getElementById("CardFile" + List.INDEX); // Reset the file input
                if (fileInput) {
                    fileInput.value = ""; // Clear the input field
                }
            });
        }
    };
    $scope.DELETE_UPLOAD = function (Array, item, index) {
        if (confirm('Are you sure you want to delete?')) {
            Array.UploadedFiles.splice(index, 1);
            var CashupModelObj = new Object();
            CashupModelObj.ID = parseInt(item.ID);
            PrcCommMethods.CASHUP_APP_API(CashupModelObj, 'DELETE_UPLOAD').then(function (data) {
                var fileInput = document.getElementById("CardFile" + Array.INDEX); // Reset the file input
                if (fileInput) {
                    fileInput.value = ""; // Clear the input field
                }
                alert("Deletion Success");
            });
        }
    };
    //File upload code ends

    //Delete individual row
    $scope.DELETE_ROW = function (ROW) {
        if (confirm('Are you sure you want to proceed?')) {
            ROW.IS_DELETED = 1;
            angular.forEach($scope.CARDS_LIST, function (card) {
                ROW[card.CARD_NAME + '_VALUE'].IS_DELETED = 1;
            });
            if (ROW.CARD_DECLARATION_ID == 0) {
                let index = $scope.CARDS_ENTRY_LIST.indexOf(ROW);
                if (index !== -1) {
                    $scope.CARDS_ENTRY_LIST.splice(index, 1);
                }
            }
            else {
                $scope.INS_UPD_DEL_CARD_DECLARATION(0);
            }
        }
    };
    $scope.RESET_ON_MODAL_CLOSE = function () {
        $scope.TOTAL_CARD_AMOUNT = 0;
        $scope.GET_CARD_DECLARATION();
    }
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
                CashupModelObj.NOTE_TYPE_ID = 3;
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
                    $scope.CARD_TAB_NOTE_LIST = [];
                    $scope.GET_CASHUP_HEADER_NOTES();

                });
            }
            else {
                alert('Comments cannot be empty while saving');
            }
        }
    };
    $scope.CONTINUE = function () {
        if ($scope.$parent.CASHUP_ENTRY_SEARCH.IS_DATA_ENTRY_ENABLED == true) {
            $scope.CardsEntryForm.submitted = true;
            if ($scope.CardsEntryForm.$valid) {
                if (!isNaN(parseFloat($scope.CASHUP_INFO.ACTUAL) - parseFloat($scope.CASHUP_INFO.EPOS))) {
                    if (parseFloat($scope.CASHUP_INFO.ACTUAL) - parseFloat($scope.CASHUP_INFO.EPOS) != 0) {
                        var myModal = new bootstrap.Modal(document.getElementById('proceed'), {
                            keyboard: false  // Optional: Close modal when pressing ESC
                        });
                        // Show the modal
                        myModal.show();
                    }
                    else {
                        $scope.INS_UPD_DEL_CARD_DECLARATION(1);
                    }
                }
                else {
                    $scope.INS_UPD_DEL_CARD_DECLARATION(1);

                }
            }
        }
        else {
            $scope.Fn_Cashup_entry_TAB_CLICK($scope.TAB_ID, 1);
        }
    }
    $scope.PREVIOUS = function () {
        if ($scope.$parent.CASHUP_ENTRY_SEARCH.IS_DATA_ENTRY_ENABLED == true) {
            $scope.INS_UPD_DEL_CARD_DECLARATION(0, 1);
        }
        else {
            $scope.Fn_Cashup_entry_TAB_CLICK($scope.TAB_ID, 0);
        }
    }
    $scope.INS_UPD_DEL_CARD_DECLARATION = function (isDraft,isPrevious) {
        $scope.CardsEntryForm.submitted = true;
        if ($scope.CardsEntryForm.$valid) {
            var CashupModelObj = new Object();
            CashupModelObj.ENTITY_ID = $cookies.get("ENTITY_ID");
            CashupModelObj.BRANCH_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID;
            CashupModelObj.AREA_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.AREA_ID == 0 || $scope.$parent.CASHUP_ENTRY_SEARCH.AREA_ID == undefined || $scope.$parent.CASHUP_ENTRY_SEARCH.AREA_ID == null ? null : $scope.$parent.CASHUP_ENTRY_SEARCH.AREA_ID;
            CashupModelObj.CASHUP_HEADER_ID = $scope.CASHUP_HEADER_ID;
            CashupModelObj.IS_DRAFT = isDraft;
            //CashupModelObj.TOTAL_CARD = $scope.TOTAL_CARD_AMOUNT;
            CashupModelObj.STEP_NO = 4;
            CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));

            var CARD_DECLARATION_LIST = [];
            var CARD_DECLARATION_LINE_LIST = []
            var totalCardAmount = 0;
            angular.forEach($scope.CARDS_ENTRY_LIST, function (ROW) {
                if (ROW.ACTIVE == true || ROW.ACTIVE == 1) {
                    if (ROW.IS_DELETED == false || ROW.IS_DELETED == 0) {
                        if (!isNaN(parseFloat(ROW.TOTAL_AMOUNT))) {
                            totalCardAmount += parseFloat(ROW.TOTAL_AMOUNT);
                        }
                    }
                    var card_declaration = new Object();
                    card_declaration.INDEX_ID = ROW.INDEX;
                    card_declaration.CARD_DECLARATION_ID = ROW.CARD_DECLARATION_ID;
                    card_declaration.PDQ_ID = ROW.SELECTED_PDQ.PDQ_MASTER_ID;
                    card_declaration.AMOUNT = ROW.TOTAL_AMOUNT;
                    card_declaration.AUTH_CODE = ROW.AUTH_CODE;
                    card_declaration.NOTE = ROW.NOTE;
                    card_declaration.ACTIVE = ROW.ACTIVE;
                    UPLOAD_IDS = "";
                    angular.forEach(ROW.UploadedFiles, function (FILE) {
                        if (UPLOAD_IDS == "") {
                            UPLOAD_IDS = FILE.RELATIVE_ID;
                        }
                        else {
                            UPLOAD_IDS = UPLOAD_IDS + "," + FILE.RELATIVE_ID;
                        }
                    });
                    card_declaration.UPLOAD_IDS = UPLOAD_IDS;
                    card_declaration.IS_DELETED = ROW.IS_DELETED;
                    CARD_DECLARATION_LIST.push(card_declaration);
                    angular.forEach($scope.CARDS_LIST, function (CARD) {
                        if (CARD.ACTIVE == true) {
                            var card_declaration_line = new Object();
                            card_declaration_line.INDEX_ID = ROW[CARD.CARD_NAME + '_VALUE'].INDEX_ID;
                            card_declaration_line.CARD_DECLARATION_LINES_ID = ROW[CARD.CARD_NAME + '_VALUE'].CARD_DECLARATION_LINES_ID;
                            card_declaration_line.CARD_DECLARATION_ID = ROW[CARD.CARD_NAME + '_VALUE'].CARD_DECLARATION_ID;
                            card_declaration_line.CASHUP_CARD_ID = ROW[CARD.CARD_NAME + '_VALUE'].CASHUP_CARD_ID;
                            card_declaration_line.AMOUNT = ROW[CARD.CARD_NAME + '_VALUE'].AMOUNT == null || ROW[CARD.CARD_NAME + '_VALUE'].AMOUNT == ""  ? '0': parseFloat(ROW[CARD.CARD_NAME + '_VALUE'].AMOUNT).toFixed(5)+'';
                            card_declaration_line.IS_DELETED = ROW[CARD.CARD_NAME + '_VALUE'].IS_DELETED;
                            CARD_DECLARATION_LINE_LIST.push(card_declaration_line);
                        }
                    });
                }
            });
            CashupModelObj.TOTAL_CARD = totalCardAmount;
            CashupModelObj.CARD_DECLARATION = CARD_DECLARATION_LIST;
            CashupModelObj.CARD_DECLARATION_LINES = CARD_DECLARATION_LINE_LIST;
            PrcCommMethods.CASHUP_APP_API(CashupModelObj, 'INS_UPD_DEL_CARD_DECLARATION').then(function (data) {
                $scope.CardsEntryForm.submitted = false;
                $scope.GET_CASHUP_ENTRY_HEADER($scope.CASHUP_HEADER_ID);
                if (isDraft == 1) {
                    $scope.Fn_Cashup_entry_TAB_CLICK($scope.TAB_ID, 1);
                }
                if (isPrevious == 1) {
                    $scope.Fn_Cashup_entry_TAB_CLICK($scope.TAB_ID, 0);
                }
                else {
                    $scope.TOTAL_CARD_AMOUNT = 0;
                    $scope.GET_CARD_DECLARATION();
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
    $scope.$on('$destroy', function () {
        $('.modal.show').modal('hide');
        $('.dropdown-menu').hide();
    });
});