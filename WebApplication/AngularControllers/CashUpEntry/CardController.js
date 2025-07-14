app.controller('CardController', function ($scope, $http, $interval, CommService, $cookies, $filter, PrcCommMethods, $location, readFileData, readFileDataNew, $sce) {
     
    $scope.$parent.CASHUP.KeyColor = "Cards";
    $scope.$parent.CASHUP.ID = getUrlParameter('CHID', $location.absUrl());
    if ($scope.$parent.CASHUP.ACTUAL_STEP_NO <= 4) {
        $scope.$parent.CASHUP.ACTUAL_STEP_NO = 4;
    }
    $scope.TabValid = true;
    $scope.$parent.overlay_loadingNew = 'block';
    $scope.NOTE_TYPE_ID = 3;
    $scope.SETTING_MINTS = $scope.$parent.GET_ENTITY_SETTINGS(27)[0].SETTING_VALUE;
    $scope.$parent.CASHUP.CARD_NOTES = "";
    $scope.CardList = [];
    $scope.CARD_NOTE_LIST = [];
    $scope.AddCardFlag = false;
    $scope.AddCardLine = function () {
        $scope.AddCardFlag = true;
        $scope.InsertCardDeclaration();
        //$scope.CardList.push(angular.copy($scope.BlankCard));     

    };
    $scope.BlankCard = { ID: 0, PDQList: null, PDQ_ID: null, AREA_ID: $scope.$parent.CASHUP.AREA_ID, AMOUNT: null, AUTH_CODE: null, VISA: null, MASTERCARD: null, AMEX: null, DINNER: null, SWITCH: null, CLUB_PAYMENTS: null, SPADE: null, NOTE: null, UPLOADS: null, IS_DELETED: 0, DINERS:null };

    $scope.DeleteLine = function (Array, index, Card) {

        if (Card.ID == undefined || Card.ID == 0) {
            if (confirm("Are you sure, You want to delete the record ?")) {
                if (Array.length == 1) {
                    Card.IS_DELETED = 1;
                    //$scope.$parent.ShowAlert("Success", 'Are you sure, You want to delete the record ?', 3000);
                  //  alert("Are you sure, You want to delete the record ?");
                    $scope.CardList.push(angular.copy($scope.BlankCard));
                } else {
                    if (Card.AMEX != null || Card.DINNER != null || Card.MASTERCARD != null || Card.VISA != null || Card.CLUB_PAYMENTS != null || Card.SPADE != null) {
                        for (var i = 0; i < $scope.CardList.length; i++) {
                            if ($scope.CardList[i].ID == 0) {
                                $scope.CardList.splice(i, 1);
                            }
                        }
                        var len = 0;
                        angular.forEach($scope.CardList, function (item) {
                            if (item.IS_DELETED == 0) {
                                len = len + 1;
                            }
                        })
                        if (len == 0) {
                            $scope.CardList.push(angular.copy($scope.BlankCard));
                        }
                        //GET_CARD_DECLERATION();
                        $scope.GET_CARD_DECLERATION();
                    }
                }
            }
        }
        else {
            if (confirm("Are you sure, You want to delete the record ?")) {
                Card.IS_DELETED = 1;
                var Count = Array.length;
                var Cnt = 0;
                angular.forEach(Array, function (item) {
                    if (item.IS_DELETED == 1) {
                        Cnt = Cnt + 1;
                    }
                })
                if (Count == Cnt) {
                 //   alert("Are you sure, You want to delete the record?");
                    $scope.CardList.push({ ID: 0, PDQList: null, PDQ_ID: null, AREA_ID: $scope.$parent.CASHUP.AREA_ID, AMOUNT: null, AUTH_CODE: null, VISA: null, MASTERCARD: null, AMEX: null, DINNER: null, SWITCH: null, CLUB_PAYMENTS: null, SPADE: null, NOTE: null, UPLOADS: null, IS_DELETED: 0, DINERS: null });
                }
                $scope.InsertCardDeclaration();
                // GET_CARD_DECLERATION();
            }
        }
        $scope.COMMON_CODE_CHANGE();

        //// SetCardList(ID);
        // if (Array.length == 1) {
        //         alert("Are you sure, You want to delete the record ?");
        //         $scope.CardList = [];
        //         $scope.CardList.push(angular.copy($scope.BlankCard));

        // } else {
        //     if (ENTRY_TYPE_ID == undefined) {
        //     Array.splice(index, 1);
        // }
        //     else {
        //       

        //     Array = Array.filter(function (x) { return x.IS_REDEEMED == IS_REDEEMED && x.ENTRY_TYPE_ID == ENTRY_TYPE_ID }).splice(index, 1);
        // }
        // }

    };

    $scope.initcasdList = function (CARD_LINE) {
        if (CARD_LINE.ID != 0) {
            if (CARD_LINE.UploadedFiles == undefined) {
                CARD_LINE.UploadedFiles = [];
            }
            var FileArray = CARD_LINE.FILE_NAME != "" ? CARD_LINE.FILE_NAME.split(':;:') : [];
            if (FileArray.length > 0) {
                var obj = new Object()
                obj.ID = CARD_LINE.UPLOAD_IDS;
                obj.FILE_PATH = FileArray[0];
                obj.SERVER_FILE_NAME = FileArray[1];
                obj.ORIGINAL_FILE_NAME = FileArray[2];
                CARD_LINE.UploadedFiles.push(obj);
            }
        }
    }
    //GET_CARD_DECLERATION();
    //function GET_CARD_DECLERATION() {
    $scope.GET_CARD_DECLERATION = function () {
       // if ($scope.$parent.CASHUP.ID != null && $scope.$parent.CASHUP.ID != "" && $scope.$parent.CASHUP.ID != 0) { 
        var CashupModelObj = new Object();
        CashupModelObj.ID = $scope.$parent.CASHUP.ID;
        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_CARD_DECLERATION').then(function (data) {
            if (data != undefined && data.data != undefined && data.data.length > 0) {
                $scope.CardList = data.data;
                angular.forEach($scope.CardList, function (val) {
                    val.UPLOADS = null;
                })
                 
                $scope.CardList = $filter('orderBy')($scope.CardList, 'AUTH_CODE', '+ID');  //AUTH_CODE
                //$scope.CardListUpdate = $scope.CardList;

            }
            // else {            

            // $scope.CardList.push(angular.copy($scope.BlankCard));
            //}
            $scope.GET_PDQ_BY_BRANCH();

            $scope.$parent.overlay_loadingNew = 'none';
        });
  //  }
    }
    $scope.GET_PDQ_BY_BRANCH = function () {
         
        var CashupModelObj = new Object();
        CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CashupModelObj.BRANCH_ID = $scope.$parent.CASHUP.BRANCH_ID;
        //CashupModelObj.BRANCH_ID = $scope.BRANCH_ID;
        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_PDQ_BY_BRANCH').then(function (data) {
            if (data != undefined && data.data != undefined && data.data.length > 0) {
                $scope.BlankCard.PDQList = data.data;
                $scope.PDQList = data.data;
                var count_blank = 0;
                angular.forEach($scope.CardList, function (Card) {
                    Card.PDQList = data.data;
                    Card.AREA_ID = $scope.$parent.CASHUP.AREA_ID;
                    Card.ID == 0 ? count_blank++ : '';
                });
                count_blank == 0 ? $scope.CardList.push(angular.copy($scope.BlankCard)) : '';
            } else {
                var count_blank1 = 0;
                angular.forEach($scope.CardList, function (Card) {                  
                    Card.ID == 0 ? count_blank1++ : '';
                });
                count_blank1 == 0 ? $scope.CardList.push({ ID: 0, PDQList: null, PDQ_ID: null, AREA_ID: $scope.$parent.CASHUP.AREA_ID, AMOUNT: null, AUTH_CODE: null, VISA: null, MASTERCARD: null, AMEX: null, DINNER: null, SWITCH: null, CLUB_PAYMENTS: null, SPADE: null, NOTE: null, UPLOADS: null, IS_DELETED: 0, DINERS: null }) : '';
            }
         
        });
    };
    $scope.GET_CARD_DECLERATION();

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
                $scope.CARD_NOTE_LIST = data.data.Table;
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
        if ($scope.$parent.CASHUP.CARD_NOTES != undefined && $scope.$parent.CASHUP.CARD_NOTES != null && $scope.$parent.CASHUP.CARD_NOTES != "" || LINE != undefined && LINE != null && LINE != "") {
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
                CashupModelObj.NOTE = $scope.$parent.CASHUP.CARD_NOTES;
            }
            PrcCommMethods.CASHUP_API(CashupModelObj, 'INS_UPD_CASHUP_HEADER_NOTES').then(function (data) {
                $scope.$parent.CASHUP.CARD_NOTES = "";
                $scope.GET_CASHUP_HEADER_NOTES();
            });
        }
    }
    //////////////////////// END Comment Code////////////////////////////////////////////////
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
                    List.UploadedFiles = d.data;
                }

            });
        }
    };

    $scope.DELETE_UPLOAD_CARD_ALL = function (Array, item, index, FLAG) {
        if (confirm('Are you sure you want to delete?')) {
            Array.UploadedFiles.splice(index, 1);
            var CashupModelObj = new Object();
            CashupModelObj.ID = parseInt(item.ID);
            PrcCommMethods.CASHUP_API(CashupModelObj, 'DELETE_UPLOAD').then(function (data) {
                $scope.ShowAlert('Success', 'Delete success.', 5000);
            });
        }
    };
    $scope.InsertCardDeclaration = function () {
         
        $scope.CardList.filter(function (x) {
            if (x.AMEX == '' || x.AMEX == '0' || x.AMEX == null) {
                x.AMEX = "0";
            }
            if (x.VISA == '' || x.VISA == '0' || x.VISA == null) {
                x.VISA = "0";
            }
            if (x.MASTERCARD == '' || x.MASTERCARD == '0' || x.MASTERCARD == null) {
                x.MASTERCARD = "0";
            }
            if (x.CLUB_PAYMENTS == '' || x.CLUB_PAYMENTS == '0' || x.CLUB_PAYMENTS == null) {
                x.CLUB_PAYMENTS = "0";
            }
            if (x.SPADE == '' || x.SPADE == '0' || x.SPADE == null) {
                x.SPADE = "0";
            }
            if (x.DINNER == '' || x.DINNER == '0' || x.DINNER == null) {
                x.DINNER = "0";
            }

        });
         
        var CARD_TOTAL = 0;
        $scope.CardList.filter(function (x) {
            if (x.IS_DELETED == 0) {
              //  if (x.AMEX != null || x.VISA != null || x.MASTERCARD != null || x.DINNER != null)
                CARD_TOTAL += parseFloat(x.AMEX) + parseFloat(x.VISA) + parseFloat(x.MASTERCARD) + parseFloat(x.DINNER) + parseFloat(x.CLUB_PAYMENTS) + parseFloat(x.SPADE);
            }
           
        });
        var CashupModelObj = new Object();
        CashupModelObj.ID = $scope.$parent.CASHUP.ID;
        CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CashupModelObj.BRANCH_ID = $scope.$parent.CASHUP.BRANCH_ID;
        CashupModelObj.AREA_ID = $scope.$parent.CASHUP.AREA_ID;
        CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
        CashupModelObj.TOTAL_CARD = CARD_TOTAL;//$scope.$parent.CASHUP.TOTAL_CARD;
        //CashupModelObj.STEP_NO = $scope.GetNextStep();
        //if ($scope.$parent.CASHUP.ACTUAL_STEP_NO != 4) {
        //    CashupModelObj.STEP_NO = 4;
        //}
        CashupModelObj.STEP_NO = 4;
        angular.forEach($scope.CardList, function (x) {
            if (x.UploadedFiles != undefined && x.UploadedFiles.length > 0) {
                x.UPLOAD_IDS = x.UploadedFiles[0].ID.toString();
                x.FILE_NAME = x.UploadedFiles[0].FILE_PATH + ":;:" + x.UploadedFiles[0].SERVER_FILE_NAME + ":;:" + x.UploadedFiles[0].ORIGINAL_FILE_NAME;

            }
            else {
                x.UPLOAD_IDS = "";
                x.FILE_NAME = "";
                x.UploadedFiles = [];
            }
            x.VISA_BIFURCATION = 0;
            x.MASTERCARD_BIFURCATION = 0;
            x.AMEX_BIFURCATION = 0;
            x.DINERS_BIFURCATION = 0;
            //x.CLUB_PAYMENTS_BIFURCATION = 0;
            //x.SPADE_BIFURCATION = 0;
        });
        CashupModelObj.DECLARATION_DETAILS = $filter('orderBy')($scope.CardList, '-FILE_NAME');
        CashupModelObj.NOTE_TABLE_ID = $scope.$parent.CASHUP.CARD_NOTES_ID;
        CashupModelObj.NOTE_TYPE_ID = 3;
        CashupModelObj.NOTE = ($scope.$parent.CASHUP.CARD_NOTES != "" || $scope.$parent.CASHUP.CARD_NOTES != null) ? $scope.$parent.CASHUP.CARD_NOTES : "";

        PrcCommMethods.CASHUP_API(CashupModelObj, 'INS_CARD_DECLARATION').then(function (data) {
            //if (data != undefined && data.data != undefined) {
            //    if ($scope.CASHUP.CARD_NOTES_ID == 0) {
            //        $scope.CASHUP.CARD_NOTES_ID = data.data;
            //    }
            //} else {
            //    $scope.CASHUP.CARD_NOTES_ID = 0;
            //}
          
            /*Commented By Aasim
            if ($scope.AddCardFlag) {
                //GET_CARD_DECLERATION();
                $scope.GET_CARD_DECLERATION();
            }
            // GET_CARD_DECLERATION();
            if ($scope.CASHUP.KeyColor == "Cards") {
                $scope.GET_CARD_DECLERATION();
            }
            */
            $scope.GET_CARD_DECLERATION();
            //$scope.$parent.CASHUP.CARD_NOTES_ID = $scope.$parent.CASHUP.CARD_NOTES_ID != 0 ? $scope.$parent.CASHUP.CARD_NOTES_ID : data.data;
        });
    };


    

    $scope.NextLink = function (val) {

        $scope.TabValid = false;
        $scope.AddCardFlag = false;
        $scope.KeyColor = val;
        $scope.InsertCardDeclaration();
        if ($scope.$parent.CASHUP.TABLIST[4].FLAG == 1) {
            $location.path("PtyCash").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
        } else if ($scope.$parent.CASHUP.TABLIST[5].FLAG == 1) {
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
        $scope.$parent.overlay_loading_div_zindex = '-1';

    }
    $scope.PreviousLink = function () {

        $scope.TabValid = false;
        $scope.AddCardFlag = false;
        $scope.InsertCardDeclaration();
        if ($scope.$parent.CASHUP.TABLIST[2].FLAG == 1) {
            $location.path("Cash").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
        } else if ($scope.$parent.CASHUP.TABLIST[1].FLAG == 1) {
            $location.path("Float").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
        } else {
            $location.path("CEN").search({ CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
        }
    }
    $scope.$on('$destroy', function () {
         
        $scope.AddCardFlag = false;
        if ($scope.TabValid) {
            if ($scope.$parent.CASHUP.FG == null) {
                if ($scope.CardList.length > 0) {
                    $scope.InsertCardDeclaration();
                }
            }
            //else {
            //    $scope.$parent.CASHUP = $scope.$parent.CASHUP;
            //}
        }
    
    });
    $scope.NextLink_View = function (val) {
         
        $scope.TabValid = false;
        $scope.AddCardFlag = false;
        $scope.KeyColor = val;
        //  $scope.InsertCardDeclaration();
        if ($scope.$parent.CASHUP.TABLIST[4].FLAG == 1) {
            $location.path("PtyCash_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
        } else if ($scope.$parent.CASHUP.TABLIST[5].FLAG == 1) {
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
        $scope.$parent.overlay_loading_div_zindex = '-1';

    }
    $scope.PreviousLink_View = function () {

        $scope.TabValid = false;
        $scope.AddCardFlag = false;
        //   $scope.InsertCardDeclaration();
        if ($scope.$parent.CASHUP.TABLIST[2].FLAG == 1) {
            $location.path("Cash_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
        } else if ($scope.$parent.CASHUP.TABLIST[1].FLAG == 1) {
            $location.path("Float_View").search({ CHID: $scope.$parent.CASHUP.ID, CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
        } else {
            $location.path("CEN_VIEW").search({ CMID: $scope.$parent.CASHUP.CASHUP_MAIN_ID });
        }
    }
    
});