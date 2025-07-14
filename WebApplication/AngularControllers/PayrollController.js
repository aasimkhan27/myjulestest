app.controller('PayrollMainController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $localStorage) {
    $scope.PAYROLL_ID = 0;
    $scope.GetMonthName = function (MonthID) {
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return months[MonthID - 1];
    }
    $scope.GET_ENTITY_LIST = function () {
        $scope.ENTITY_LIST = JSON.parse($localStorage.ENTITY_LIST);
        //var GET_ALL = new Object()
        //GET_ALL.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        //PrcCommMethods.PAYROLL_API(new Object(), 'GET_ENTITY_LIST').then(function (data) {
        //    $scope.ENTITY_LIST = data.data.Table;
        //});
    }
    $scope.GET_ENTITY_LIST();
    $scope.goBack = function () {
        window.history.back();
    }
    var _selected;
    $scope.selected = undefined;
    $scope.statesWithFlags = [
        { 'name': 'Alabama', 'flag': 'https://images.pexels.com/photos/1767434/pexels-photo-1767434.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' },
        { 'name': 'Alaska', 'flag': 'https://images.pexels.com/photos/1767434/pexels-photo-1767434.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' },
        { 'name': 'Arizona', 'flag': 'https://images.pexels.com/photos/1767434/pexels-photo-1767434.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' },
        { 'name': 'Arkansas', 'flag': '9/9d/Flag_of_Arkansas.svg/45px-Flag_of_Arkansas.svg.png' },
        { 'name': 'California', 'flag': '0/01/Flag_of_California.svg/45px-Flag_of_California.svg.png' },
        { 'name': 'Colorado', 'flag': '4/46/Flag_of_Colorado.svg/45px-Flag_of_Colorado.svg.png' },
        { 'name': 'Connecticut', 'flag': '9/96/Flag_of_Connecticut.svg/39px-Flag_of_Connecticut.svg.png' },
        { 'name': 'Delaware', 'flag': 'c/c6/Flag_of_Delaware.svg/45px-Flag_of_Delaware.svg.png' },
        { 'name': 'Arkansas', 'flag': '9/9d/Flag_of_Arkansas.svg/45px-Flag_of_Arkansas.svg.png' },
        { 'name': 'California', 'flag': '0/01/Flag_of_California.svg/45px-Flag_of_California.svg.png' },
        { 'name': 'Colorado', 'flag': '4/46/Flag_of_Colorado.svg/45px-Flag_of_Colorado.svg.png' },
        { 'name': 'Connecticut', 'flag': '9/96/Flag_of_Connecticut.svg/39px-Flag_of_Connecticut.svg.png' },
        { 'name': 'Delaware', 'flag': 'c/c6/Flag_of_Delaware.svg/45px-Flag_of_Delaware.svg.png' },
        { 'name': 'Florida', 'flag': 'f/f7/Flag_of_Florida.svg/45px-Flag_of_Florida.svg.png' }];

});
app.controller('PayrollUploadController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {

    $scope.CreateRelativeID = function () {
        var date = new Date();
        $scope.RelativeID = "" + $cookies.get("USERID") + date.getDate() + date.getMonth() + date.getFullYear() + date.getHours() + date.getMinutes();
    }
    $scope.CreateRelativeID();

    $scope.GET_BRANCH_LIST = function (ENTITY_ID) {

        PrcCommMethods.GET_BRANCH_LIST(parseInt(ENTITY_ID), parseInt($cookies.get("USERID")), 3).then(function (data) {

            $scope.BRANCH_LIST = data;
        });
    }

    $scope.GET_UPLOAD_TYPES = function () {
        var PayrollModelObj = new Object();

        PrcCommMethods.PAYROLL_API(PayrollModelObj, 'GET_UPLOAD_TYPES').then(function (data) {
            $scope.UPLOAD_TYPES = data.data.Table;
        });
    }
    $scope.GET_PAYROLL_APPROVERS = function (BRANCH_ID) {
        var PayrollModelObj = new Object();
        $scope.BRANCH_ID = BRANCH_ID;
        PayrollModelObj.ENTITY_ID = $scope.ENTITY_ID;
        PayrollModelObj.BRANCH_ID = BRANCH_ID;
        PrcCommMethods.PAYROLL_API(PayrollModelObj, 'GET_WEFILE_APPROVERS').then(function (data) {
            $scope.APPROVER_LIST = data.data.Table;
        });
    }
    $scope.ORIGINAL_FILE_NAME = "";
    $scope.NEW_FILE_NAME = "";
    $scope.IS_VALID = true;
    $scope.PAYROLL = {
        ENTITY_ID: null,
        BRANCH_ID: null,
        MONTH_ID: null,
        APPROVER_ID: null,
        FREQUENCY: null,
        START_DATE: null,
        END_DATE: null,
        TITLE: null,
        FILE_LIST: [],
        APPROVAL_REQUIRED: false,
        UPLOAD_TYPE_ID: null,
        EXPIRATION_DATE: null,
        EXPIRATION_REMINDER_REQUIRED: false,
        EXPIRATION_REMINDER_FREQUENCY: null,
        EXPIRATION_REMINDER_EMAILS: null,
        EXPIRATION_REMINDER_START_DATE: null,


    };

    //====================================================
    $scope.GET_WEFILE_USERS_BY_BRANCH = function () {
        $scope.GROUP_LIST = [];
        $scope.USER_LIST = [];
        var PayrollModelObj = new Object();
        PayrollModelObj.ENTITY_ID = $scope.PAYROLL.ENTITY_ID;
        PayrollModelObj.BRANCH_ID = $scope.PAYROLL.BRANCH_ID;
        PrcCommMethods.PAYROLL_API(PayrollModelObj, 'GET_WEFILE_USERS_BY_BRANCH').then(function (data) {

            if (data.data != undefined && data.data.Table.length > 0) {
                $scope.USERLIST = data.data.Table;
            } else {
                $scope.USERLIST = [];
            }
            //$scope.GET_WEFILE_GROUP_NAME();
        });
    }
    $scope.GET_WEFILE_GROUP_NAME = function () {

        var PayrollModelObj = new Object();
        PayrollModelObj.ENTITY_ID = $scope.PAYROLL.ENTITY_ID;
        PayrollModelObj.BRANCH_ID = $scope.PAYROLL.BRANCH_ID;
        PrcCommMethods.PAYROLL_API(PayrollModelObj, 'GET_WEFILE_GROUP_NAME').then(function (data) {

            if (data.data != undefined && data.data.Table.length > 0) {
                $scope.GROUPLIST = data.data.Table;
            } else {
                $scope.GROUPLIST = [];
            }


        });
    }
    $scope.GET_WEFILE_APPROVER_NAME = function () {

        var PayrollModelObj = new Object();
        PayrollModelObj.BRANCH_ID = $scope.PAYROLL.BRANCH_ID;
        PrcCommMethods.PAYROLL_API(PayrollModelObj, 'GET_WEFILE_APPROVER_NAME').then(function (data) {

            if (data.data != undefined && data.data.Table.length > 0) {
                $scope.PAYROLL.APPROVER_LIST = data.data.Table;

            } else {
                $scope.PAYROLL.APPROVER_LIST = [];
            }

        });
    }

    $scope.SHOW_GROUP_POPUP = function () {
        $scope.USER_GROUPLIST = [];
        $scope.GROUP_NAME = null;
        $scope.GROUP_NAME_VALID = true;
        $scope.USERID_VALID = true;
        $('#Add_Group').modal('show');

    }

    //$scope.CANCEL_GROUP_POPUP = function () {
    //    $scope.USER_GROUPLIST = [];
    //    $scope.GROUP_NAME = null;
    //    $scope.GROUP_NAME_VALID = true;
    //    $scope.USERID_VALID = true;
    //    $('#Add_Group').modal('show');

    //}

    $scope.SET_USERLIST = function (val) {

        if ($scope.USER_GROUPLIST != null && $scope.USER_GROUPLIST.length > 0) {
            var Flag = true;
            for (var i = 0; i < $scope.USER_GROUPLIST.length; i++) {
                if (val.USER_ID == $scope.USER_GROUPLIST[i].USER_ID) {
                    Flag = false;
                    break;
                }
            }
            if (Flag) {
                $scope.USER_GROUPLIST.push({ USER_ID: val.USER_ID, USER_NAME: val.USER_NAME });
            }
        } else {
            $scope.USER_GROUPLIST.push({ USER_ID: val.USER_ID, USER_NAME: val.USER_NAME });
        }
        $scope.USER_ID = null;
    }
    $scope.DELETE_GROUPUSER = function (ID, index) {
        if (confirm('Are you sure you want to delete?')) {

            angular.forEach($scope.USER_GROUPLIST, function (val) {
                if (val.USER_ID == ID) {
                    $scope.USER_GROUPLIST.splice(index, 1);
                }
            })
        }
    }
    $scope.USER_LIST = [];
    $scope.SET_SELECTUSERLIST = function (val) {

        if ($scope.USER_LIST != null && $scope.USER_LIST.length > 0) {
            var Flag = true;
            for (var i = 0; i < $scope.USER_LIST.length; i++) {
                if (val.USER_ID == $scope.USER_LIST[i].USER_ID) {
                    Flag = false;
                    break;
                }
            }
            if (Flag) {
                $scope.USER_LIST.push({ USER_ID: val.USER_ID, USER_NAME: val.USER_NAME });
            }
        } else {
            $scope.USER_LIST.push({ USER_ID: val.USER_ID, USER_NAME: val.USER_NAME });
        }

        $scope.PAYROLL.USER_ID = null;
    }
    $scope.GROUP_LIST = [];
    $scope.SET_SELECT_GROUPLIST = function (val) {

        //$scope.GROUP_LIST.push({ ID: val.ID, GROUP_NAME: val.GROUP_NAME });

        if ($scope.GROUP_LIST != null && $scope.GROUP_LIST.length > 0) {
            var Flag = true;
            for (var i = 0; i < $scope.GROUP_LIST.length; i++) {
                if (val.ID == $scope.GROUP_LIST[i].ID) {
                    Flag = false;
                    break;
                }
            }
            if (Flag) {
                $scope.GROUP_LIST.push({ ID: val.ID, GROUP_NAME: val.GROUP_NAME });
            }
        } else {
            $scope.GROUP_LIST.push({ ID: val.ID, GROUP_NAME: val.GROUP_NAME });
        }
        $scope.PAYROLL.GROUP_ID = null;
    }
    $scope.SET_VALUE = function (val) {

        $scope.GROUP_LIST = [];
        $scope.USER_LIST = [];
    }
    $scope.DELETE_SELECTGROUP = function (ID, index) {
        if (confirm('Are you sure you want to delete?')) {

            angular.forEach($scope.GROUP_LIST, function (val) {
                if (val.ID == ID) {
                    $scope.GROUP_LIST.splice(index, 1);
                }
            })
        }
    }
    $scope.DELETE_SELECTUSER = function (ID, index) {
        if (confirm('Are you sure you want to delete?')) {

            angular.forEach($scope.USER_LIST, function (val) {
                if (val.USER_ID == ID) {
                    $scope.USER_LIST.splice(index, 1);
                }
            })
        }
    }
    $scope.SET_SELECTED_GROUPID = function (GROUP, index) {

        //alert(GROUP);
        $scope.GROUP_ID = 0;
        angular.forEach($scope.GROUPLIST, function (val) {
            if (val.GROUP_NAME == GROUP) {
                $scope.GROUP_ID = val.ID;
            }
        })
        if ($scope.GROUP_ID != 0) {
            var PayrollModelObj = new Object();
            PayrollModelObj.GROUP_ID = $scope.GROUP_ID;

            PrcCommMethods.PAYROLL_API(PayrollModelObj, 'GET_WEFILE_GROUP_USERS').then(function (data) {

                if (data.data != undefined && data.data.Table.length > 0) {
                    $scope.USER_GROUPLIST = data.data.Table;
                } else {
                    $scope.USER_GROUPLIST = [];
                }
            });
        }
    }
    $scope.GET_WEFILE_GROUP_USERS = function () {

        var PayrollModelObj = new Object();
        PayrollModelObj.ENTITY_ID = $scope.PAYROLL.ENTITY_ID;
        PayrollModelObj.BRANCH_ID = $scope.PAYROLL.BRANCH_ID;
        PrcCommMethods.PAYROLL_API(PayrollModelObj, 'GET_WEFILE_GROUP_USERS').then(function (data) {

            if (data.data != undefined && data.data.Table.length > 0) {
                $scope.GROUPLIST = data.data.Table;
            } else {
                $scope.GROUPLIST = [];
            }


        });
    }
    $scope.VALIDATE = function () {
        $scope.REQUESTVALID = true;
        $scope.GROUP_NAME_VALID = true;
        $scope.USERID_VALID = true;
        if ($scope.GROUP_NAME == null || $scope.GROUP_NAME == 0 || $scope.GROUP_NAME == "") {
            $scope.GROUP_NAME_VALID = false;
        }
        if ($scope.USER_GROUPLIST.length == 0) {
            $scope.USERID_VALID = false;
        }

        if (!$scope.GROUP_NAME_VALID || !$scope.USERID_VALID) {
            $scope.REQUESTVALID = false;
        }

    }
    $scope.INS_UPD_WEFILE_GROUP_MASTER = function () {

        $scope.VALIDATE();
        if ($scope.REQUESTVALID) {
            var PayrollModelObj = new Object();
            PayrollModelObj.GROUP_ID = $scope.GROUP_ID;
            PayrollModelObj.GROUP_NAME = $scope.GROUP_NAME;
            PayrollModelObj.ENTITY_ID = $scope.PAYROLL.ENTITY_ID;
            PayrollModelObj.BRANCH_ID = $scope.PAYROLL.BRANCH_ID;
            PayrollModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PayrollModelObj.ACTIVE = 1;
            PayrollModelObj.USER_IDS = [];
            angular.forEach($scope.USER_GROUPLIST, function (val) {
                PayrollModelObj.USER_IDS.push({ TABLE_ID: val.USER_ID });
            })

            PrcCommMethods.PAYROLL_API(PayrollModelObj, 'INS_UPD_WEFILE_GROUP_MASTER').then(function (data) {

                if (data.data == 1) {
                    $scope.$parent.ShowAlert("Success", 'Save Successfully', 3000);
                    $scope.USER_GROUPLIST = [];
                    $scope.GROUP_NAME = null;
                    $scope.GET_WEFILE_GROUP_NAME();
                    $('#Add_Group').modal('hide');
                }
                if (data.data == 0) {
                    $scope.$parent.ShowAlert("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                }

            });
        }
    }
    $scope.SET_APPROVER = function () {
        if ($scope.PAYROLL.APPROVAL_REQUIRED) {
            $scope.GROUP_LIST = [];
            $scope.USER_LIST = [];
        }
    }
    //$scope.GET_WEFILE_USERS_BY_BRANCH();
    //====================================================
    $scope.VALIDATE_PAYROLL_UPLOAD = function () {
        var count = 0;
        if ($scope.PAYROLL.TITLE == null || $scope.PAYROLL.TITLE == "") {
            return false;
        }
        if ($scope.PAYROLL.ENTITY_ID == null || $scope.PAYROLL.ENTITY_ID == "") {
            return false;
        }
        if ($scope.PAYROLL.BRANCH_ID == null || $scope.PAYROLL.BRANCH_ID == "") {
            return false;
        }
        if ($scope.PAYROLL.UPLOAD_TYPE_ID == null || $scope.PAYROLL.UPLOAD_TYPE_ID == "") {
            return false;
        }
        if ($scope.PAYROLL.UPLOAD_TYPE_ID == 2) {
            if ($scope.PAYROLL.MONTH_ID == null || $scope.PAYROLL.MONTH_ID == "") {
                return false;
            }
            if ($scope.PAYROLL.FREQUENCY == null || $scope.PAYROLL.FREQUENCY == "") {
                return false;
            }
            if ($scope.PAYROLL.END_DATE == null || $scope.PAYROLL.END_DATE == "") {
                return false;
            }
        }
        if ($scope.PAYROLL.FILE_LIST.length == 0) {
            return false;
        }
        if ($scope.PAYROLL.EXPIRATION_REMINDER_REQUIRED == true) {
            if ($scope.PAYROLL.EXPIRATION_REMINDER_START_DATE == null || $scope.PAYROLL.EXPIRATION_REMINDER_START_DATE == "") {
                return false;
            }
            if ($scope.PAYROLL.EXPIRATION_DATE == null || $scope.PAYROLL.EXPIRATION_DATE == "") {
                return false;
            }
            if ($scope.PAYROLL.EXPIRATION_REMINDER_FREQUENCY == null || $scope.PAYROLL.EXPIRATION_REMINDER_FREQUENCY == "") {
                return false;
            }
            if ($scope.PAYROLL.EXPIRATION_REMINDER_EMAILS == null || $scope.PAYROLL.EXPIRATION_REMINDER_EMAILS == "") {
                return false;
            }
        }

        return true;
    }
    $scope.INS_WEFILE_UPLOAD = function () {
        if ($scope.VALIDATE_PAYROLL_UPLOAD()) {
            var PayrollModelObj = new Object();
            PayrollModelObj.ENTITY_ID = $scope.PAYROLL.ENTITY_ID;
            PayrollModelObj.BRANCH_ID = $scope.PAYROLL.BRANCH_ID;
            PayrollModelObj.START_DATE = $scope.PAYROLL.START_DATE;
            PayrollModelObj.END_DATE = $scope.PAYROLL.END_DATE;
            PayrollModelObj.MONTH = $scope.PAYROLL.MONTH_ID;
            PayrollModelObj.UPLOADED_BY_USER_ID = parseInt($cookies.get("USERID"));
            PayrollModelObj.COMMENTS = $scope.PAYROLL.COMMENTS;
            PayrollModelObj.FREQUENCY = $scope.PAYROLL.FREQUENCY;
            PayrollModelObj.TITLE = $scope.PAYROLL.TITLE;
            PayrollModelObj.RELATIVE_ID = $scope.RelativeID;
            PayrollModelObj.UPLOAD_TYPE_ID = $scope.PAYROLL.UPLOAD_TYPE_ID;
            $scope.PAYROLL.UPLOAD_TYPE_ID == 2 ? $scope.PAYROLL.APPROVAL_REQUIRED = true : '';
            PayrollModelObj.SEND_FOR_APPROVAL = $scope.PAYROLL.APPROVAL_REQUIRED ? 1 : 0;

            if ($scope.PAYROLL.EXPIRATION_REMINDER_REQUIRED == true) {

                PayrollModelObj.EXPIRATION_DATE = $scope.PAYROLL.UPLOAD_TYPE_ID == 24 ? $scope.PAYROLL.EXPIRATION_DATE : null;
                PayrollModelObj.EXPIRATION_REMINDER_REQUIRED = $scope.PAYROLL.UPLOAD_TYPE_ID == 24 ? ($scope.PAYROLL.EXPIRATION_REMINDER_REQUIRED ? 1 : 0) : null;
                PayrollModelObj.EXPIRATION_REMINDER_START_DATE = $scope.PAYROLL.UPLOAD_TYPE_ID == 24 ? $scope.PAYROLL.EXPIRATION_REMINDER_START_DATE : null;
                PayrollModelObj.EXPIRATION_REMINDER_FREQUENCY = $scope.PAYROLL.UPLOAD_TYPE_ID == 24 ? $scope.PAYROLL.EXPIRATION_REMINDER_FREQUENCY : null;
                PayrollModelObj.EXPIRATION_REMINDER_EMAILS = $scope.PAYROLL.UPLOAD_TYPE_ID == 24 ? $scope.PAYROLL.EXPIRATION_REMINDER_EMAILS : null;
            }
            else {
                PayrollModelObj.EXPIRATION_DATE = null;
                PayrollModelObj.EXPIRATION_REMINDER_REQUIRED = null;
                PayrollModelObj.EXPIRATION_REMINDER_START_DATE = null;
                PayrollModelObj.EXPIRATION_REMINDER_FREQUENCY = null;
                PayrollModelObj.EXPIRATION_REMINDER_EMAILS = null;
            }

            if ($scope.PAYROLL.APPROVAL_REQUIRED == true || $scope.PAYROLL.UPLOAD_TYPE_ID == 2) {
                PayrollModelObj.IS_SHARED = 0;
            } else {
                if ($scope.SELECTCHOICE == "GROUP" || $scope.SELECTCHOICE == "USER") {
                    if ($scope.USER_LIST.length > 0 || $scope.GROUP_LIST.length > 0) {
                        PayrollModelObj.IS_SHARED = 1;
                    }
                } else {
                    PayrollModelObj.IS_SHARED = 0;
                }

            }

            PayrollModelObj.USER_IDS = [];
            PayrollModelObj.GROUP_IDS = [];

            if ($scope.USER_LIST.length > 0) {
                angular.forEach($scope.USER_LIST, function (val) {
                    PayrollModelObj.USER_IDS.push({ TABLE_ID: val.USER_ID });
                });
            } else if ($scope.USER_LIST.length == 0) {
                PayrollModelObj.USER_IDS.push({ TABLE_ID: -1 });
            }
            if ($scope.GROUP_LIST.length > 0) {
                angular.forEach($scope.GROUP_LIST, function (val) {
                    PayrollModelObj.GROUP_IDS.push({ GROUP_ID: val.ID });
                })
            } else if ($scope.GROUP_LIST.length == 0) {
                PayrollModelObj.GROUP_IDS.push({ GROUP_ID: -1 });
            }

            if (PayrollModelObj.IS_SHARED == 0) {
                PrcCommMethods.PAYROLL_API(PayrollModelObj, 'INS_WEFILE_UPLOAD').then(function (data) {
                    $location.path('PL');
                });
            } else {
                if (($scope.USER_LIST.length > 0 || $scope.GROUP_LIST.length > 0) && PayrollModelObj.IS_SHARED == 1) {
                    PrcCommMethods.PAYROLL_API(PayrollModelObj, 'INS_WEFILE_UPLOAD').then(function (data) {
                        $location.path('PL');
                    });
                } else {
                    alert('Please select any one Group/User.');
                }
            }
        }
        else {
            $scope.IS_VALID = false;
            alert('Please validate all the mandatory fields');
        }
    }
    $scope.DELETE_UPLOAD = function (UPLOADID, index) {
        if (confirm('Are you sure you want to delete?')) {
            var PayrollModelObj = new Object();
            PayrollModelObj.TABLE_ID = UPLOADID;
            PrcCommMethods.PAYROLL_API(PayrollModelObj, 'DELETE_UPLOAD').then(function (data) {
                $scope.PAYROLL.FILE_LIST.splice(index, 1);
            });
        }
    }
    $scope.goBack = function () {

        angular.forEach($scope.PAYROLL.FILE_LIST, function (file) {
            if (file.ID != null) {
                var PayrollModelObj = new Object();
                PayrollModelObj.TABLE_ID = file.ID;
                PrcCommMethods.PAYROLL_API(PayrollModelObj, 'DELETE_UPLOAD').then(function (data) {
                    //$scope.PAYROLL.FILE_LIST.splice(index, 1);                  
                });
            }
        })
        $location.path('PL');

    }
    $scope.uploadFiles_Payroll = function (Attachment_UPLOAD_TYPE_ID, ATTACHEMENT_TYPE_ID) {

        if (($scope.Files != undefined && $scope.Files.length > 0)) {
            $scope.Uploading = true;
            $scope.DocImageResult = [];
            var data = new FormData();
            data.append("RelativeID", $scope.RelativeID);
            data.append("UPLOAD_TYPE_ID", $scope.PAYROLL.UPLOAD_TYPE_ID);
            data.append("VIRTUALPATH", 'Payroll/');
            data.append("USER_ID", parseInt($cookies.get("USERID")));
            for (var i = 0; i < $scope.Files.length; i++) {
                data.append("uploadedFile", $scope.Files[i]);
                $scope.ORIGINAL_FILE_NAME = $scope.Files[i].name;
                data.append("ORIGINAL_FILE_NAME", $scope.Files[i].name);
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
                    $scope.PAYROLL.FILE_LIST = d.data;
                }
                $scope.Uploading = false;
                angular.element("input[id='ngexcelfile']").val(null);
            });
        }
    };

    $scope.getTheFilesToUpload_Payroll = function ($files, ControlName, FileSize) {
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
        $scope.uploadFiles_Payroll();
    };

    $scope.DateSetUp = function () {
        var date_inputs = document.getElementsByName("datecontrol") //our date input has the name "date"

        if (date_inputs.length > 0) {
            for (var i = 0; i < date_inputs.length; i++) {

                var date_input = $('input[name="' + date_inputs[i].name + '"]'); //our date input has the name "date"
                var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
                var date = new Date();
                var options = {
                    todayBtn: "linked",
                    daysOfWeekHighlighted: "0,6",
                    autoclose: true,
                    todayHighlight: true,
                    format: 'dd/M/yyyy'
                    //  startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate())
                };
                date_input.datepicker(options);
            }
        };
    }
    $scope.DateSetUp();
    $scope.GET_UPLOAD_TYPES();
    $scope.VALIDATE_ENTERED_EMAIL = function (emailString) {
        var EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
        var isValidEmails = true;
        var isLastEmailValid = false;
        $scope.EMAIL_INVALID = false;
        var emailLength = 0;
        if (emailString.length > 0) {
            var splitEmails = emailString.split(','); emailLength = splitEmails.length;
            if (splitEmails.length < 0) {
                isValidEmails = EMAIL_REGEXP.test(splitEmails[0].trim());
            }
            else {
                angular.forEach(splitEmails, function (item, index) {
                    if (!EMAIL_REGEXP.test(splitEmails[index].trim()) && index != emailLength - 1) {
                        isValidEmails = false;
                    }
                });

                var lastEmail = splitEmails[emailLength - 1].trim();
                if (EMAIL_REGEXP.test(lastEmail)) {
                    isLastEmailValid = true;
                }
                if (isValidEmails && isLastEmailValid) {
                    $scope.EMAIL_INVALID = true;
                }
                else { $scope.EMAIL_INVALID = false; }
            }
        }

    };
    $scope.GET_LOGIN_USER_EMAIL = function () {
        if ($scope.PAYROLL.EXPIRATION_REMINDER_REQUIRED == true) {
            $scope.PAYROLL.EXPIRATION_REMINDER_EMAILS = $cookies.get("EMAIL");
            $scope.VALIDATE_ENTERED_EMAIL($scope.PAYROLL.EXPIRATION_REMINDER_EMAILS);
        }
    };
    $scope.UPLOAD_TYPE_ID_CHANGE = function () {
        $scope.PAYROLL.APPROVAL_REQUIRED = false;
        $scope.PAYROLL.FILE_LIST = [];
        $scope.PAYROLL.MONTH_ID = null;
        $scope.PAYROLL.FREQUENCY = null;
        $scope.PAYROLL.EXPIRATION_REMINDER_REQUIRED = false;
        $scope.PAYROLL.EXPIRATION_DATE = null;
        $scope.PAYROLL.END_DATE = null;
        $scope.PAYROLL.EXPIRATION_REMINDER_START_DATE = null;
        $scope.PAYROLL.EXPIRATION_REMINDER_FREQUENCY = null;
        $scope.GROUP_LIST = [];
        $scope.USER_LIST = [];
        $scope.CreateRelativeID();
    };
});
app.controller('PayrollListController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.PAYROLL_FILTER = {
        ENTITY_ID: null,
        BRANCH_ID: null,
        MONTH_ID: null,
        UPLOAD_TYPE_IDS: null,
        STATUS_IDS: null,
        FILTER_BY_IDS: null,
        TITLE: null,
        PAGE_NO: 1,
        PAGE_SIZE: 10
    };
    $scope.Reset_Filter = function () {
        $scope.PAYROLL_FILTER = {
            ENTITY_ID: null,
            BRANCH_ID: null,
            MONTH_ID: null,
            UPLOAD_TYPE_IDS: null,
            STATUS_IDS: null,
            FILTER_BY_IDS: null,
            TITLE: null,
            PAGE_NO: 1,
            PAGE_SIZE: 10
        };
        $scope.BRANCH_LIST = [];
        //$scope.UPLOAD_TYPES = [];
        $scope.GET_WEFILE_UPLOADS(1);
    }
    $scope.PAYROLL_LIST = [];
    $scope.GET_WEFILE_UPLOADS = function (FLAG) {

        var PayrollModelObj = new Object();
        if (FLAG == 1) {
            $scope.PAYROLL_FILTER.CLICK_SEARCH = 1;
            $scope.PAYROLL_LIST = [];
            $scope.PAYROLL_FILTER.PAGE_NO = 1;
        }
        PayrollModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PayrollModelObj.PAGE_NO = $scope.PAYROLL_FILTER.PAGE_NO;
        PayrollModelObj.PAGE_SIZE = $scope.PAYROLL_FILTER.PAGE_SIZE;
        PayrollModelObj.ENTITY_ID = $scope.PAYROLL_FILTER.ENTITY_ID == null ? 0 : $scope.PAYROLL_FILTER.ENTITY_ID;
        PayrollModelObj.BRANCH_ID = $scope.PAYROLL_FILTER.BRANCH_ID == null ? null : $scope.PAYROLL_FILTER.BRANCH_ID;;
        PayrollModelObj.MONTH_ID = $scope.PAYROLL_FILTER.MONTH_ID == "" ? 0 : $scope.PAYROLL_FILTER.MONTH_ID;
        PayrollModelObj.STATUS_IDS = $scope.PAYROLL_FILTER.STATUS_IDS == "" ? null : $scope.PAYROLL_FILTER.STATUS_IDS;
        PayrollModelObj.UPLOAD_TYPE_IDS = $scope.PAYROLL_FILTER.UPLOAD_TYPE_IDS == "" ? null : $scope.PAYROLL_FILTER.UPLOAD_TYPE_IDS;
        PayrollModelObj.FILTER_BY_IDS = $scope.PAYROLL_FILTER.FILTER_BY_IDS == "" ? null : $scope.PAYROLL_FILTER.FILTER_BY_IDS;
        PayrollModelObj.TITLE = $scope.PAYROLL_FILTER.TITLE;//== "" ? null : $scope.PAYROLL_FILTER.TITLE;
        var METHOD_NAME = "GET_WEFILE_UPLOADS";

        PrcCommMethods.PAYROLL_API(PayrollModelObj, METHOD_NAME).then(function (data) {

            if (data.data != null && data.data.Table.length > 0) {
                $scope.PAYROLL_LIST = $scope.PAYROLL_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.PAYROLL_FILTER.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.PAYROLL_FILTER.PAGE_NO = parseInt($scope.PAYROLL_FILTER.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else {
                $scope.GetData = false;
            }

        });
    }

    $scope.RedirectToDetails = function (ID) {
        $scope.$parent.PAYROLL_ID = ID;
        $location.path('PDL');
    }
    //$scope.GET_BRANCH_LIST = function (ENTITY_ID) {
    //    var PayrollModelObj = new Object();
    //    PayrollModelObj.ENTITY_ID = ENTITY_ID;
    //    PrcCommMethods.DASHBOARD_API(PayrollModelObj, 'GET_BRANCH_LIST').then(function (data) {
    //        $scope.BRANCH_LIST = data.data.Table;
    //    });
    //}
    $scope.GET_BRANCH_LIST = function (ENTITY_ID) {

        PrcCommMethods.GET_BRANCH_LIST(parseInt(ENTITY_ID), parseInt($cookies.get("USERID")), 3).then(function (data) {
            $scope.BRANCH_LIST = data;
        });
    }
    $scope.GET_UPLOAD_TYPES = function () {
        var PayrollModelObj = new Object();

        PrcCommMethods.PAYROLL_API(PayrollModelObj, 'GET_UPLOAD_TYPES').then(function (data) {
            if (data.data.Table.length > 0 && data.data != null) {
                $scope.UPLOAD_TYPES = data.data.Table;
            } else {
                $scope.UPLOAD_TYPES = [];
            }
        });
    }
    $scope.GET_UPLOAD_TYPES();
    //  $scope.GET_RESTAURANT_LIST();
    $scope.GET_WEFILE_UPLOADS();
    $scope.LAZY_GET_WEFILE_UPLOADS = function () {
        $scope.GET_WEFILE_UPLOADS();
    };
});
app.controller('ApprovalUploadListController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.PAYROLL_LIST = [];
    $scope.BRANCH_LIST = [];
    $scope.PAYROLL_FILTER = {
        ENTITY_ID: null,
        BRANCH_ID: null,
        MONTH_ID: null,
        PAGE_NO: 1,
        PAGE_SIZE: 10
    };
    $scope.Reset_Filter = function () {
        $scope.PAYROLL_FILTER = {
            ENTITY_ID: null,
            BRANCH_ID: null,
            MONTH_ID: null,
            PAGE_NO: 1,
            PAGE_SIZE: 10
        };
        $scope.PAYROLL_LIST = [];
        $scope.BRANCH_LIST = [];
        $scope.GET_WEFILE_UPLOADS_APPROVERS(1);
    }
    $scope.GET_WEFILE_UPLOADS_APPROVERS = function (FLAG) {
        var PayrollModelObj = new Object();
        if (FLAG == 1) {
            $scope.PAYROLL_FILTER.CLICK_SEARCH = 1;
            $scope.PAYROLL_LIST = [];
            $scope.PAYROLL_FILTER.PAGE_NO = 1;
        }
        PayrollModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PayrollModelObj.PAGE_NO = $scope.PAYROLL_FILTER.PAGE_NO;
        PayrollModelObj.PAGE_SIZE = $scope.PAYROLL_FILTER.PAGE_SIZE;
        PayrollModelObj.STATUS_IDs = "0,1,2,3";
        PayrollModelObj.ENTITY_ID = $scope.PAYROLL_FILTER.ENTITY_ID;
        PayrollModelObj.BRANCH_ID = $scope.PAYROLL_FILTER.BRANCH_ID;
        PayrollModelObj.MONTH = $scope.PAYROLL_FILTER.MONTH_ID == "" ? 0 : $scope.PAYROLL_FILTER.MONTH_ID;
        var METHOD_NAME = "GET_WEFILE_UPLOADS_APPROVERS";
        PrcCommMethods.PAYROLL_API(PayrollModelObj, METHOD_NAME).then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.PAYROLL_LIST = $scope.PAYROLL_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.PAYROLL_FILTER.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.PAYROLL_FILTER.PAGE_NO = parseInt($scope.PAYROLL_FILTER.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else {
                $scope.GetData = false;
            }
        });
    }

    $scope.RedirectToDetails = function (ID) {
        $scope.$parent.PAYROLL_ID = ID;
        $location.path('PDL');
    }
    //$scope.GET_BRANCH_LIST = function (ENTITY_ID) {
    //    var PayrollModelObj = new Object();
    //    PayrollModelObj.ENTITY_ID = ENTITY_ID;
    //    PrcCommMethods.DASHBOARD_API(PayrollModelObj, 'GET_BRANCH_LIST').then(function (data) {
    //        $scope.BRANCH_LIST = data.data.Table;
    //    });
    //}
    $scope.GET_BRANCH_LIST = function (ENTITY_ID) {
        // PrcCommMethods.GET_BRANCH_LIST(parseInt(ENTITY_ID), parseInt($cookies.get("USERID")), 3).then(function (data) {
        PrcCommMethods.GET_BRANCH_LIST(parseInt(ENTITY_ID), parseInt($cookies.get("USERID")), 3).then(function (data) {
            $scope.BRANCH_LIST = data;
        });
    }

    //  $scope.GET_RESTAURANT_LIST();
    $scope.GET_WEFILE_UPLOADS_APPROVERS();
    $scope.LAZY_GET_WEFILE_UPLOADS_APPROVERS = function () {
        $scope.GET_WEFILE_UPLOADS_APPROVERS()
    };
});
app.controller('PayrollDetailController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {

    if ($scope.$parent.PAYROLL_ID == 0) {
        $location.path('PL');
    }
    $scope.USER_ID = parseInt($cookies.get("USERID"));
    $scope.ShowActionButtons = false;
    $scope.GET_WEFILE_UPLOADS_BY_ID = function () {
        var PayrollModelObj = new Object();
        PayrollModelObj.TABLE_ID = $scope.$parent.PAYROLL_ID;
        PayrollModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.PAYROLL_API(PayrollModelObj, 'GET_WEFILE_UPLOADS_BY_ID').then(function (data) {
            $scope.PAYROLL_DETAIL = data.data.Table[0];
            $scope.PAYROLL_COMMENTS_LIST = data.data.Table1;
            $scope.PAYROLL_FILE_LIST = data.data.Table2;
            $scope.PAYROLL_SHARE_LIST = data.data.Table3;
            $scope.PAYROLL_IS_APPROVED = data.data.Table4[0].IS_APPROVER;
            $scope.ShowActionButtons = $scope.PAYROLL_DETAIL.UPLOADED_BY_USER_ID == parseInt($cookies.get("USERID")) ? false : true;


        });
    };
    $scope.APPROVER_COMMENTS = "";
    $scope.APP_REJ_WEFILE_UPLOAD = function (STATUS_ID) {
        if (STATUS_ID == 1 || (STATUS_ID == 2 && $scope.APPROVER_COMMENTS != "")) {
            var PayrollModelObj = new Object();
            PayrollModelObj.TABLE_ID = $scope.$parent.PAYROLL_ID;
            PayrollModelObj.STATUS_ID = STATUS_ID;
            PayrollModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PayrollModelObj.COMMENTS = $scope.APPROVER_COMMENTS;
            PrcCommMethods.PAYROLL_API(PayrollModelObj, 'APP_REJ_WEFILE_UPLOAD').then(function (data) {
                $scope.$parent.PAYROLL_ID = 0;
                $location.path('PL');
            });
        }
        else {
            alert('Please provide comments.');
        }
    };
    $scope.SHOW_GROUPUSER = function (GROUP_ID, GROUP_NAME) {

        //Show_Users

        $scope.GROUP_NAME = GROUP_NAME;
        if (GROUP_ID != 0) {
            var PayrollModelObj = new Object();
            PayrollModelObj.GROUP_ID = GROUP_ID;

            PrcCommMethods.PAYROLL_API(PayrollModelObj, 'GET_WEFILE_GROUP_USERS').then(function (data) {
                if (data.data != undefined && data.data.Table.length > 0) {
                    $scope.USER_LIST = data.data.Table;
                } else {
                    $scope.USER_LIST = [];
                }
            });
        }
        $('#Show_Users').modal('show');
    }
    $scope.uploadFiles_Payroll = function (Attachment_UPLOAD_TYPE_ID, ATTACHEMENT_TYPE_ID) {

        if (($scope.Files != undefined && $scope.Files.length > 0)) {
            $scope.Uploading = true;
            $scope.DocImageResult = [];
            var data = new FormData();
            data.append("RelativeID", $scope.$parent.PAYROLL_ID);
            //---Previous code ----//
            //data.append("UPLOAD_TYPE_ID", 2); 
            //---------------------//
            data.append("UPLOAD_TYPE_ID", $scope.PAYROLL_DETAIL.UPLOAD_TYPE_ID);

            data.append("VIRTUALPATH", 'Payroll/');
            data.append("USER_ID", parseInt($cookies.get("USERID")));
            for (var i = 0; i < $scope.Files.length; i++) {
                data.append("uploadedFile", $scope.Files[i]);
                $scope.ORIGINAL_FILE_NAME = $scope.Files[i].name;
                data.append("ORIGINAL_FILE_NAME", $scope.Files[i].name);
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
                if (d.data.Table.length > 0 && d.data.Table[0].UPLOADED_COMMENT != undefined) {
                    $scope.ShowAlert('Error', d.data.Table[0].UPLOADED_COMMENT, 5000);
                }
                else {
                    $scope.PAYROLL_FILE_LIST = d.data;
                }
                $scope.Uploading = false;
                angular.element("input[id='ngexcelfile']").val(null);
            });
        }
    };
    $scope.DELETE_UPLOAD = function (UPLOADID, index) {
        if (confirm('Are you sure you want to delete?')) {
            var PayrollModelObj = new Object();
            PayrollModelObj.TABLE_ID = UPLOADID;
            PrcCommMethods.PAYROLL_API(PayrollModelObj, 'DELETE_UPLOAD').then(function (data) {
                $scope.GET_WEFILE_UPLOADS_BY_ID();
                //$scope.PAYROLL.FILE_LIST.splice(index, 1);

            });
        }
    };
    $scope.getTheFilesToUpload_Payroll = function ($files, ControlName, FileSize) {
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
        $scope.uploadFiles_Payroll();
    };
    $scope.GET_WEFILE_UPLOADS_BY_ID();
});