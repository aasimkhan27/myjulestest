app.controller('PettyCashController', function ($scope, $http, $interval, CommService, $cookies, $filter, PrcCommMethods, $location, readFileData, readFileDataNew, $sce) {
     
    $scope.$parent.CASHUP.KeyColor = "PtyCash";
    $scope.$parent.CASHUP.ID = getUrlParameter('CHID', $location.absUrl());
    if ($scope.$parent.CASHUP.ACTUAL_STEP_NO <= 5) {
        $scope.$parent.CASHUP.ACTUAL_STEP_NO = 5;
    }
    $scope.TabValid = true;
    $scope.$parent.overlay_loadingNew = 'block';
    $scope.NOTE_TYPE_ID = 4;
    $scope.SETTING_MINTS = $scope.$parent.GET_ENTITY_SETTINGS(27)[0].SETTING_VALUE;
    $scope.PETTY_NOTE_LIST = [];
    $scope.$parent.CASHUP.PCASH_NOTES = "";
    $scope.PettyCashList = [];
    $scope.AddPettyFlag = false;
   // $scope.$parent.CASHUP.PettyCashValid = true;
    $scope.AddPCashLine = function () {
        $scope.AddPettyFlag = true;
        $scope.InsertPettyCashDeclaration();
        //$scope.PettyCashList.push(angular.copy($scope.BlankPettyCash));
    };
    $scope.BlankPettyCash = { ID: 0, CategoryList: null, PETTY_CASH_CATEGORY_ID: null, PAID_TO: '', ITEM: '', TOTAL_VALUE: null, StaffList: null, AUTHORIZED_BY_ID: null, VAT_AMOUNT: null, NET_AMOUNT: null, IS_DELETED: 0 };
    $scope.DeleteLine = function (Array, index, Petty) {
      
        if (Petty.ID == undefined || Petty.ID == 0) {
            
            if (Array.length == 1) {
                if (Petty.PAID_TO != '' || Petty.PETTY_CASH_CATEGORY_ID != null || Petty.ITEM != '' || Petty.TOTAL_VALUE != null || Petty.AUTHORIZED_BY_ID != null || Petty.VAT_AMOUNT != null) { 
                if (confirm("Are you sure, You want to delete the record ?")) {
                    Petty.IS_DELETED = 1;
                    //alert("Are you sure, You want to delete the record ?");
                    $scope.PettyCashList.push(angular.copy($scope.BlankPettyCash));
                }
            }
            } else {
                 
                if (Petty.PAID_TO != '' || Petty.PETTY_CASH_CATEGORY_ID != null || Petty.ITEM != '' || Petty.TOTAL_VALUE != null || Petty.AUTHORIZED_BY_ID != null || Petty.VAT_AMOUNT != null ) {
                    if (confirm("Are you sure, You want to delete the record ?")) {
                       // if (Petty.PETTY_CASH_CATEGORY_ID != null && Petty.TOTAL_VALUE != null && Petty.AUTHORIZED_BY_ID != null) {
                        for (var i = 0; i < $scope.PettyCashList.length; i++) {
                            if ($scope.PettyCashList[i].ID == 0 && $scope.PettyCashList[i].IS_DELETED==0) {
                                $scope.PettyCashList.splice(i, 1);
                                $scope.PettyCashList.push(angular.copy($scope.BlankPettyCash));
                                }
                            }
                            var len = 0;
                            angular.forEach($scope.PettyCashList, function (item) {
                                if (item.IS_DELETED == 0) {
                                    len = len + 1;
                                }
                            })
                            if (len == 0) {
                                $scope.PettyCashList.push(angular.copy($scope.BlankPettyCash));
                            }
                            //$scope.GET_PETTY_CASH_DECLERATION();
                        //} else if ($scope.$parent.CASHUP.PETTYCASHVALID == false) {
                        //    Petty.IS_DELETED = 1;
                        //    $scope.PettyCashList.push(angular.copy($scope.BlankPettyCash));
                        //}
                    }
                }
                }
              
            
        }
        else {
            if (confirm("Are you sure, You want to delete the record ?")) { 
            Petty.IS_DELETED = 1;
            var Count = Array.length;
            var Cnt = 0;
            angular.forEach(Array, function (item) {
                if (item.IS_DELETED == 1) {
                    Cnt = Cnt + 1;
                }
            })
            if (Count == Cnt) {
               // alert("Are you sure, You want to delete the record?");
                $scope.PettyCashList.push(angular.copy($scope.BlankPettyCash));
            }
            $scope.InsertPettyCashDeclaration();
        }
        }
        $scope.COMMON_CODE_CHANGE();
        $scope.$parent.CASHUP.PETTYCASHVALID = true;
    };

    //$scope.DeleteLine = function (Array, index, IS_REDEEMED, ENTRY_TYPE_ID) {
    //    if (Array.length == 1) {
    //        alert("Are you sure, You want to delete the record ?");
    //        $scope.PettyCashList = [];
    //        $scope.PettyCashList.push(angular.copy($scope.BlankPettyCash));
    //    } else {
    //        if (ENTRY_TYPE_ID == undefined) {
    //            Array.splice(index, 1);
    //        }
    //        else {
    //            Array = Array.filter(function (x) { return x.IS_REDEEMED == IS_REDEEMED && x.ENTRY_TYPE_ID == ENTRY_TYPE_ID }).splice(index, 1);
    //        }
    //    }
    //};
    $scope.initcasdListpcash = function (CARD_LINE) {
      
        if (CARD_LINE.ID != 0) {
            if (CARD_LINE.UploadedFiles1 == undefined) {
                CARD_LINE.UploadedFiles1 = [];
            }
            if (CARD_LINE.UPLOAD_IDS != "" && CARD_LINE.UPLOAD_IDS != null) {
                var FileArray = (CARD_LINE.FILE_NAME != "") ? CARD_LINE.FILE_NAME.split(':;:') : [];
                if (FileArray.length > 0) {
                    var obj = new Object()
                    obj.ID = CARD_LINE.UPLOAD_IDS;
                    obj.FILE_PATH = FileArray[0];
                    obj.SERVER_FILE_NAME = FileArray[1];
                    obj.ORIGINAL_FILE_NAME = FileArray[2];
                    CARD_LINE.UploadedFiles1.push(obj);
                }
            }
        }
    }
    $scope.ValidControls = function (x) {
         
        if ($scope.$parent.CASHUP.PETTYCASHVALID) {
            x.PETTY_CASH_CATEGORY_VALID = true;
            x.TOTAL_VALUE_VALID = true;
            x.AUTHORIZED_BY_ID_VALID = true;
        }
    }
    $scope.GET_PETTY_CASH_DECLERATION = function () {
        var CashupModelObj = new Object();
        CashupModelObj.ID = $scope.$parent.CASHUP.ID;
        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_PETTY_CASH_DECLERATION').then(function (data) {

            if (data != undefined && data.data != undefined && data.data.length > 0) {
                $scope.PettyCashList = data.data;
               $scope.PettyCashList.push(angular.copy($scope.BlankPettyCash));
            }
            //else {
            //    $scope.PettyCashList.push(angular.copy($scope.BlankPettyCash));              
            //}
             
            if ($scope.$parent.CASHUP.PettyCashValid) {
                $scope.PettyCashList = $scope.$parent.CASHUP.AutoValid_Petty;       
                $scope.GET_CASHUP_BY_ID();
               
            }
            //$scope.PettyCashList = $filter('orderBy')($scope.PettyCashList, '+ID', '+UPLOAD_IDS');  //AUTH_CODE 
            $scope.GET_PETTY_CASH_CATEGORIES();
            $scope.$parent.overlay_loadingNew = 'none';
        });
    }
    $scope.GET_PETTY_CASH_CATEGORIES = function () {
        var CashupModelObj = new Object();
        CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CashupModelObj.BRANCH_ID = $scope.$parent.CASHUP.BRANCH_ID;
        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_PETTY_CASH_CATEGORIES').then(function (data) {
             
            if (data != undefined && data.data != undefined && data.data.length > 0) {
                $scope.BlankPettyCash.CategoryList = data.data;
                $scope.CategoryList = data.data;
                $scope.GET_ENTITY_STAFF();
            }

        });
    };
    $scope.GET_PETTY_CASH_DECLERATION();

    ////////////////////////Comment Code////////////////////////////////////////////////
    var timer = "";
    function clockUpdate() {
        var date = new moment($scope.CURRENT_UTC_TIME).add(1, 'seconds');
        $scope.CURRENT_UTC_TIME = date;
        $scope.$apply();
    }
    $scope.GET_CASHUP_HEADER_NOTES = function () {
        var CashupModelObj = new Object();
        CashupModelObj.NOTE_TYPE_ID = $scope.NOTE_TYPE_ID;
        CashupModelObj.CASHUP_HEADER_ID = $scope.$parent.CASHUP.ID;
        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_CASHUP_HEADER_NOTES').then(function (data) {
            $scope.CURRENT_UTC_TIME = angular.copy(data.data.UTC_TIME[0].UTC_TIME);
            if (timer) {
                clearInterval(timer);
            }
            timer = setInterval(clockUpdate, 1000);
            if (data.data.Table != null && data.data.Table.length > 0) {
                $scope.PETTY_NOTE_LIST = data.data.Table;
            }
        });
    };
    $scope.GET_CASHUP_HEADER_NOTES();
    $scope.EDIT_COMMENTS = function (LINE) {
        LINE.COPY_NOTE = angular.copy(LINE.NOTE);
        LINE.IS_EDIT = true;
    }
    $scope.SAVE_COMMENTS = function (LINE) {
        $scope.INS_UPD_CASHUP_HEADER_NOTES(LINE);

    }
    $scope.CHECK_EVENTS = function ($event, LINE) {
        if ($event.keyCode == 27) {
            $scope.EDIT_CANCEL(LINE);
        }
    }
    $scope.EDIT_CANCEL = function (LINE) {
        LINE.NOTE = angular.copy(LINE.COPY_NOTE);
        LINE.IS_EDIT = false;
    }
    $scope.SET_TIME_AND_DATE = function (LINE) {
        LINE.START_COUNTDOWN = {
            minutes: 0,
            seconds: 0,
            getTimeRemaining: function (endtime) {
                var b = Date.parse(endtime) - Date.parse(new Date($scope.CURRENT_UTC_TIME));
                var t = endtime.getTime() - new Date($scope.CURRENT_UTC_TIME).getTime();
                var minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
                var seconds = Math.floor((b % (1000 * 60)) / 1000);
                return {
                    'minutes': minutes,
                    'seconds': seconds
                };
            },
            initializeClock: function (endtime) {
                function updateClock() {
                    var t = LINE.START_COUNTDOWN.getTimeRemaining(endtime);
                    LINE.START_COUNTDOWN.minutes = t.minutes;
                    LINE.START_COUNTDOWN.seconds = t.seconds;
                    if (t.seconds < 0) {
                        $interval.cancel(timeinterval);
                        LINE.IS_TIME_EDIT_FLAG = false;
                        LINE.IS_EDIT = false;
                    }
                }
                updateClock();
                var timeinterval = $interval(updateClock, 1000);
            }
        }
        var deadline = new Date(LINE.RESPONSE_END_DATE);
        LINE.START_COUNTDOWN.initializeClock(deadline);
    }
    $scope.NOTE_INIT = function (LINE) {
        var CREATED_DATE_TIME = angular.copy(LINE.CREATED_DATE);
        LINE.CREATED_DATE_TIME = moment(CREATED_DATE_TIME).add($scope.SETTING_MINTS, 'Minute');
        if (moment(LINE.CREATED_DATE_TIME) > moment($scope.CURRENT_UTC_TIME)) {
            LINE.IS_TIME_EDIT_FLAG = true;
            LINE.RESPONSE_END_DATE = new Date(LINE.CREATED_DATE_TIME);
            $scope.SET_TIME_AND_DATE(LINE);
        }
    }
    $scope.INS_UPD_CASHUP_HEADER_NOTES = function (LINE) {
        if ($scope.$parent.CASHUP.PCASH_NOTES != undefined && $scope.$parent.CASHUP.PCASH_NOTES != null && $scope.$parent.CASHUP.PCASH_NOTES != "" || LINE != undefined) {
            var CashupModelObj = new Object();
            CashupModelObj.NOTE_TYPE_ID = $scope.NOTE_TYPE_ID;
            CashupModelObj.ID = $scope.$parent.CASHUP.ID;//CASHUP_HEADER_ID
            CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
            if (LINE != undefined) {
                CashupModelObj.NOTE_TABLE_ID = LINE.TABLE_ID;
                CashupModelObj.NOTE = LINE.NOTE;
                LINE.IS_EDIT = false;
            }
            else {
                CashupModelObj.NOTE_TABLE_ID = 0;
                CashupModelObj.NOTE = $scope.$parent.CASHUP.PCASH_NOTES;
            }


            PrcCommMethods.CASHUP_API(CashupModelObj, 'INS_UPD_CASHUP_HEADER_NOTES').then(function (data) {
                $scope.$parent.CASHUP.PCASH_NOTES = "";
                $scope.GET_CASHUP_HEADER_NOTES();
            });
        }
    }



    $scope.GET_ENTITY_STAFF = function () {
        var CashupModelObj = new Object();
        CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CashupModelObj.BRANCH_ID = $scope.$parent.CASHUP.BRANCH_ID;
        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_ENTITY_STAFF').then(function (data) {
             
            if (data != undefined && data.data != undefined && data.data.length > 0) {
                $scope.BlankPettyCash.StaffList = data.data;
                $scope.StaffList = data.data;
                var PCASHCOUNT = 0;
                angular.forEach($scope.PettyCashList, function (PCash) {
                    PCash.CategoryList = $scope.CategoryList;
                    PCash.StaffList = data.data;
                    PCash.ID == 0 ? PCASHCOUNT++ : '';
                    PCash.PETTY_CASH_CATEGORY_VALID = true;
                    PCash.TOTAL_VALUE_VALID = true;
                    PCash.AUTHORIZED_BY_ID_VALID = true;
                });
            }
            //else {
            //    $scope.PettyCashList.push(angular.copy($scope.BlankPettyCash));
            //}
            if ($scope.PettyCashList.length == 0) {
                $scope.PettyCashList.push(angular.copy($scope.BlankPettyCash));
            }
        });
    };

    $scope.GET_PETTY_CASH_DECLERATION1 = function () {
        var CashupModelObj = new Object();
        CashupModelObj.ID = $scope.$parent.CASHUP.ID;
        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_PETTY_CASH_DECLERATION').then(function (data) {

            if (data != undefined && data.data != undefined && data.data.length > 0) {
                $scope.PettyCashList = data.data;
                $scope.PettyCashList.push(angular.copy($scope.BlankPettyCash));
            }
            else {
                //$scope.PettyCashList = [];
                //$scope.AddPCashLine();
                $scope.PettyCashList.push(angular.copy($scope.BlankPettyCash));
            }
        });
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
                    //     reader.readAsDataURL($files[i]);
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

        var fileUpload = document.getElementById("PcashFile" + index);
        extension = fileUpload.files[0].name;;
        $scope.uploadFiles1(Attachment_UPLOAD_TYPE_ID, '', extension, List, index, 'PettyCash');
    };
    $scope.uploadFiles1 = function (Attachment_UPLOAD_TYPE_ID, ATTACHEMENT_TYPE_ID, filename, List, index, FolderName) {
        if (($scope.Files != undefined && $scope.Files.length > 0)) {
            $scope.DocImageResult = [];
            var data = new FormData();
            data.append("RelativeID", List.ID == 0 ? $scope.$parent.generaterandom(12) + "" + index : List.ID);
            data.append("UPLOAD_TYPE_ID", Attachment_UPLOAD_TYPE_ID);
            data.append("VIRTUALPATH", '/CashUp/' + FolderName + '/' + parseInt($scope.$parent.CASHUP.CASHUP_MAIN_ID)) + '/';
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
                    List.UploadedFiles1 = d.data;
                }


            });
        }
    };
    $scope.DELETE_UPLOAD_CARD_ALL = function (Array, item, index, FLAG) {
        if (confirm('Are you sure you want to delete?')) {
            Array.UploadedFiles1.splice(index, 1);
            var CashupModelObj = new Object();
            CashupModelObj.ID = parseInt(item.ID);
            PrcCommMethods.CASHUP_API(CashupModelObj, 'DELETE_UPLOAD').then(function (data) {
                $scope.ShowAlert('Success', 'Delete success.', 5000);

            });
        }
    };
    $scope.ValidatePettyCash = function () {
         
        $scope.$parent.CASHUP.PETTYCASHVALID = true;
        angular.forEach($scope.PettyCashList, function (x) {
            x.PETTY_CASH_CATEGORY_VALID = true;
            x.TOTAL_VALUE_VALID = true;
            x.AUTHORIZED_BY_ID_VALID = true;
            if (((x.PAID_TO != null && x.PAID_TO != "") || (x.PETTY_CASH_CATEGORY_ID != null && x.PETTY_CASH_CATEGORY_ID != "" && x.PETTY_CASH_CATEGORY_ID != 0) || (x.ITEM != null && x.ITEM != "") || (x.VAT_AMOUNT != null && x.VAT_AMOUNT != "" && x.VAT_AMOUNT != 0) || (x.TOTAL_VALUE != null && x.TOTAL_VALUE != "" && x.TOTAL_VALUE != 0) || (x.AUTHORIZED_BY_ID != null && x.AUTHORIZED_BY_ID != "" && x.AUTHORIZED_BY_ID != 0)) && (x.IS_DELETED==0)) {
           // if (x.IS_DELETED == 0) {
                if (x.PETTY_CASH_CATEGORY_ID == null || x.PETTY_CASH_CATEGORY_ID == "") {
                    x.PETTY_CASH_CATEGORY_VALID = false;
                }
                if (x.TOTAL_VALUE == null || x.TOTAL_VALUE == 0 || x.TOTAL_VALUE == "") {
                    x.TOTAL_VALUE_VALID = false;
                }
                if (x.AUTHORIZED_BY_ID == null || x.AUTHORIZED_BY_ID == "") {
                    x.AUTHORIZED_BY_ID_VALID = false;
                }
          //  }
            }
            if (!x.PETTY_CASH_CATEGORY_VALID || !x.TOTAL_VALUE_VALID || !x.AUTHORIZED_BY_ID_VALID) {
                $scope.$parent.CASHUP.PETTYCASHVALID = false;
            }
        });
         
        if ($scope.$parent.CASHUP.PETTYCASHVALID == false) {       
            if ($scope.PettyCashList.length > 0) {
                $scope.$parent.CASHUP.AutoValid_Petty = $scope.PettyCashList;            
            }
        }
    }
    $scope.InsertPettyCashDeclaration = function () {
        $scope.ValidatePettyCash();
        if ($scope.$parent.CASHUP.PETTYCASHVALID) {
            $scope.$parent.CASHUP.PettyCashValid = false;
            $scope.$parent.CASHUP.AutoValid_Petty = [];
             
            var PETTYCASH_TOTAL = 0;
            $scope.PettyCashList.filter(function (x) {
                if (x.IS_DELETED == 0) {
                    if (x.TOTAL_VALUE != null)
                        PETTYCASH_TOTAL += parseFloat(x.TOTAL_VALUE);
                }
            });
            var CashupModelObj = new Object();
            CashupModelObj.ID = $scope.$parent.CASHUP.ID;
            CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            CashupModelObj.BRANCH_ID = $scope.$parent.CASHUP.BRANCH_ID;
            CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
            CashupModelObj.TOTAL_PETTY_CASH = PETTYCASH_TOTAL;// $scope.$parent.CASHUP.TOTAL_TOTAL_VAL;
            angular.forEach($scope.PettyCashList, function (Pcash) {
                Pcash.UPLOAD_IDS = "";
                Pcash.FILE_NAME = "";
                if (Pcash.UploadedFiles1 != undefined && Pcash.UploadedFiles1.length > 0) {
                    angular.forEach(Pcash.UploadedFiles1, function (fl) {
                        Pcash.UPLOAD_IDS = Pcash.UPLOAD_IDS == "" ? fl.ID.toString() : Pcash.UPLOAD_IDS.toString() + ':;:' + fl.ID.toString();
                    });
                } else {
                    Pcash.UploadedFiles1 = [];
                }
            });
            $scope.PettyCashList.filter(function (x) {
                if (x.VAT_AMOUNT == 0 || x.VAT_AMOUNT == null) {
                    x.VAT_AMOUNT = null;
                } else {
                    x.VAT_AMOUNT = '' + x.VAT_AMOUNT;
                }
            });
            $scope.PettyCashList.filter(function (Z) {
                if (Z.NET_AMOUNT > 0 || Z.NET_AMOUNT == 0) {
                    Z.NET_AMOUNT = '' + Z.NET_AMOUNT;
                } else if (Z.NET_AMOUNT ==null) {
                    Z.NET_AMOUNT = 0;
                }
            });
            $scope.PettyCashList.filter(function (x) {
                if (x.TOTAL_VALUE > 0 || x.TOTAL_VALUE == 0) {
                    x.TOTAL_VALUE = '' + x.TOTAL_VALUE;
                }
            });

            CashupModelObj.DECLARATION_DETAILS = $filter('orderBy')($scope.PettyCashList, '-UPLOAD_IDS');//$scope.PettyCashList;
            CashupModelObj.NOTE_TABLE_ID = $scope.$parent.CASHUP.PCASH_NOTES_ID;
            CashupModelObj.NOTE_TYPE_ID = $scope.NOTE_TYPE_ID;
            CashupModelObj.NOTE = $scope.$parent.CASHUP.PCASH_NOTES;
            CashupModelObj.STEP_NO = 5;
            PrcCommMethods.CASHUP_API(CashupModelObj, 'INS_PETTY_CASH_DECLARATION').then(function (data) {
                //$scope.$parent.CASHUP.PCASH_NOTES_ID = $scope.$parent.CASHUP.PCASH_NOTES_ID != 0 ? $scope.$parent.CASHUP.PCASH_NOTES_ID:data.data;
                if (data != undefined && data.data != undefined) {
                    if ($scope.CASHUP.PCASH_NOTES_ID == 0) {
                        $scope.CASHUP.PCASH_NOTES_ID = data.data;
                    }
                } else {
                    $scope.CASHUP.PCASH_NOTES_ID = 0;
                }
                if ($scope.AddPettyFlag) {
                    $scope.GET_PETTY_CASH_DECLERATION();
                    //$scope.PettyCashList.push(angular.copy($scope.BlankPettyCash));
                }
                if ($scope.CASHUP.KeyColor == "PtyCash") {
                    $scope.GET_PETTY_CASH_DECLERATION();
                }
            });
        }
    };



    $scope.NextLink = function (val) {
        $scope.$parent.CASHUP.PettyCashValid = false;
        $scope.KeyColor = val;
        $scope.AddPettyFlag = false;
        $scope.InsertPettyCashDeclaration();
        if ($scope.$parent.CASHUP.PETTYCASHVALID) {
            $scope.TabValid = false;
            if ($scope.$parent.CASHUP.TABLIST[5].FLAG == 1) {
                $location.path("Delivery").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
            } else if ($scope.$parent.CASHUP.TABLIST[6].FLAG == 1) {
                $location.path("AccountCustomer").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
            } else if ($scope.$parent.CASHUP.TABLIST[7].FLAG == 1) {
                $location.path("Vouchers").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
            } else if ($scope.$parent.CASHUP.TABLIST[8].FLAG == 1) {
                $location.path("Deposits").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
            } else if ($scope.$parent.CASHUP.TABLIST[9].FLAG == 1) {
                $location.path("Complimentary").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
            }
        }
    }
    $scope.PreviousLink = function () {
        $scope.$parent.CASHUP.PettyCashValid = false;
        $scope.AddPettyFlag = false;
        $scope.InsertPettyCashDeclaration();
        if ($scope.$parent.CASHUP.PETTYCASHVALID) {
            $scope.TabValid = false;
            if ($scope.$parent.CASHUP.TABLIST[3].FLAG == 1) {
                $location.path("Cards").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
            } else if ($scope.$parent.CASHUP.TABLIST[2].FLAG == 1) {
                $location.path("Cash").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
            } else if ($scope.$parent.CASHUP.TABLIST[1].FLAG == 1) {
                $location.path("Float").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
            } else {
                $location.path("CEN").search({ CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
            }
        }
    }
    $scope.$on('$destroy', function () {
         
        if ($scope.TabValid) {
            $scope.AddPettyFlag = false;
            if ($scope.$parent.CASHUP.FG == null) { 
            $scope.ValidatePettyCash();
            if ($scope.$parent.CASHUP.PETTYCASHVALID) {
                $scope.$parent.CASHUP.PettyCashValid = false;
                if ($scope.PettyCashList.length > 0) {
                    $scope.InsertPettyCashDeclaration();
                    // $scope.$parent.CASHUP.PettyCashValid = false;
                }
            } else {
                if ($scope.$parent.CASHUP.AutoValid_Petty.length > 0) {
                    $scope.$parent.CASHUP.PettyCashValid = true;
                    $location.path("PtyCash").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                    $scope.$parent.CASHUP.AutoValid_Petty.filter(function (x) {
                        x.UploadedFiles1 = [];
                    });
                } else {
                    $location.path("PtyCash").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
                }
            }
        }
        }
    });
    $scope.GET_CASHUP_BY_ID = function () {
         
        var CashupModelObj = new Object();
        CashupModelObj.CASHUP_MAIN_ID = $scope.$parent.CASHUP.CASHUP_MAIN_ID;
        CashupModelObj.SESSION_ID = $scope.$parent.CASHUP.SESSION_ID;
        CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_CASHUP_BY_ID').then(function (data) {
             
            if (data != undefined && data.data != undefined && data.data.Table.length > 0) {
              
                $scope.$parent.CASHUP.TOTAL_FLOAT = data.data.Table[0].FLOAT_TOTAL != null ? parseFloat(data.data.Table[0].FLOAT_TOTAL) : 0;;
                $scope.$parent.CASHUP.TOTAL_CASH = data.data.Table[0].CASH_TOTAL != null ? parseFloat(data.data.Table[0].CASH_TOTAL) : 0;;

                $scope.$parent.CASHUP.TOTAL_CARD = data.data.Table[0].CARDS_TOTAL != null ? parseFloat(data.data.Table[0].CARDS_TOTAL) : 0;
                $scope.$parent.CASHUP.TOTAL_TOTAL_VAL = data.data.Table[0].PETTY_CASH != null ? parseFloat(data.data.Table[0].PETTY_CASH) : 0;
                $scope.$parent.CASHUP.TOTAL_CHEQUE = data.data.Table[0].CHEQUE != null ? parseFloat(data.data.Table[0].CHEQUE) : 0;
                $scope.$parent.CASHUP.ACCOUNT_TOTAL = data.data.Table[0].ACCOUNT_TOTAL != null ? parseFloat(data.data.Table[0].ACCOUNT_TOTAL) : 0;
                $scope.$parent.CASHUP.ACCOUNT_RECEIVED_TOTAL = data.data.Table[0].ACCOUNT_RECEIVED_TOTAL != null ? parseFloat(data.data.Table[0].ACCOUNT_RECEIVED_TOTAL) : 0;

                $scope.$parent.CASHUP.DEPOSIT_TOTAL = data.data.Table[0].DEPOSIT_RECEIVED_TOTAL != null ? parseFloat(data.data.Table[0].DEPOSIT_RECEIVED_TOTAL) : 0;
                $scope.$parent.CASHUP.DEPOSIT_REDEEMED_TOTAL = data.data.Table[0].DEPOSIT_REDEEMED_TOTAL != null ? parseFloat(data.data.Table[0].DEPOSIT_REDEEMED_TOTAL) : 0;
                $scope.$parent.CASHUP.ISSUE_TOTAL = data.data.Table[0].VOUCHER_ISSUED_TOTAL != null ? parseFloat(data.data.Table[0].VOUCHER_ISSUED_TOTAL) : 0;
                $scope.$parent.CASHUP.REDEEMED_TOTAL = data.data.Table[0].VOUCHER_REDEEMED_TOTAL != null ? parseFloat(data.data.Table[0].VOUCHER_REDEEMED_TOTAL) : 0;
                $scope.$parent.CASHUP.VOID_TOTAL = data.data.Table[0].VOID_TOTAL != null ? parseFloat(data.data.Table[0].VOID_TOTAL) : 0;
                $scope.$parent.CASHUP.COMP_TOTAL = data.data.Table[0].COMPLIMENTARY_TOTAL != null ? parseFloat(data.data.Table[0].COMPLIMENTARY_TOTAL) : 0;

                //$scope.GET_EPOS_HEADER();
                //$scope.GET_EPOS_DATA();

                
            }
            
        });

    };
    $scope.NextLink_View = function (val) {
        $scope.$parent.CASHUP.PettyCashValid = false;
        $scope.KeyColor = val;
        $scope.AddPettyFlag = false;
       // $scope.InsertPettyCashDeclaration();
       // if ($scope.$parent.CASHUP.PETTYCASHVALID) {
            $scope.TabValid = false;
            if ($scope.$parent.CASHUP.TABLIST[5].FLAG == 1) {
                $location.path("Delivery_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
            } else if ($scope.$parent.CASHUP.TABLIST[6].FLAG == 1) {
                $location.path("AccountCustomer_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
            } else if ($scope.$parent.CASHUP.TABLIST[7].FLAG == 1) {
                $location.path("Vouchers_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
            } else if ($scope.$parent.CASHUP.TABLIST[8].FLAG == 1) {
                $location.path("Deposits_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
            } else if ($scope.$parent.CASHUP.TABLIST[9].FLAG == 1) {
                $location.path("Complimentary_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
            }
      //  }
    }
    $scope.PreviousLink_View = function () {
        $scope.$parent.CASHUP.PettyCashValid = false;
        $scope.AddPettyFlag = false;
      //  $scope.InsertPettyCashDeclaration();
      //  if ($scope.$parent.CASHUP.PETTYCASHVALID) {
            $scope.TabValid = false;
            if ($scope.$parent.CASHUP.TABLIST[3].FLAG == 1) {
                $location.path("Cards_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
            } else if ($scope.$parent.CASHUP.TABLIST[2].FLAG == 1) {
                $location.path("Cash_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
            } else if ($scope.$parent.CASHUP.TABLIST[1].FLAG == 1) {
                $location.path("Float_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
            } else {
                $location.path("CEN_VIEW").search({ CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
            }
      //  }
    }

    $scope.SET_VAT_AMOUNT = function (Val) {
       
        if (parseFloat(Val.VAT_AMOUNT) > parseFloat(Val.TOTAL_VALUE)) {
            $scope.$parent.ShowAlert("Attention", "VAT Amount is not greater than Gross.", 3000);
            Val.VAT_AMOUNT = null;
        }
    }
    $scope.SET_GROSS_AMOUNT = function (Val) {
         
        //var Temp = null;
        if (parseFloat(Val.TOTAL_VALUE) < parseFloat(Val.VAT_AMOUNT)) {
            //Temp = Val.TOTAL_VALUE;
            $scope.$parent.ShowAlert("Attention", "Gross Amount can not be less than vat amount, Please recheck entries.", 3000);
            Val.TOTAL_VALUE = null;
        }
    }
});