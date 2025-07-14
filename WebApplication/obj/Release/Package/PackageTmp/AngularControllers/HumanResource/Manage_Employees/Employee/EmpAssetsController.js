app.controller('EmpAssetsController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    //$scope.$parent.DISPLAY_FLAG = false;
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(2);
    $(".modal-backdrop").remove();
    $scope.HR_COMMON_CODE_Fn();
    $scope.$parent.$parent.overlay_loading_HR_Loader = 'none';
    $scope.AssetSearch = {
        EMPLY_PRSNL_ID: getUrlParameter('EMP_ID', $location.absUrl()),
        PRSNL_DTLS_ID: getUrlParameter('EMP_ID', $location.absUrl()),
        CUSTOMER_ID: $cookies.get("CUSTOMER_ID"),
        ENTITY_ID: null,// $cookies.get("ENTITY_ID"),
        MODULE_ID: $cookies.get("MODULE_ID"),
        USER_ID: $cookies.get("USERID"),
        CUSTOM_PAY_TYPE: 'Choose',
        DD_DEFAULT_TEXT: 'Choose',
    }
    $scope.ASSET_TYPE_OBJ = [];
    $scope.STEP_FLAG = 7;
    $scope.EDIT_STEP_NO = getUrlParameter('STEP_NO', $location.absUrl());
    $scope.EDIT_STEP_NO = $scope.EDIT_STEP_NO == undefined ? 0 : $scope.EDIT_STEP_NO;
    $scope.EDIT_MODE = $scope.EDIT_STEP_NO < 9 ? false : true;
    $scope.MY_PROFILE_FLAG = 0;
    if (parseInt(getUrlParameter('EMP_ID', $location.absUrl())) == parseInt($cookies.get("EMPLY_PRSNL_ID"))) {
        $scope.EDIT_MODE = true;
        $scope.MY_PROFILE_FLAG = 1;
    };
    $scope.HRM_EDIT_PERSONAL_DETAILS = function () { $scope.EDIT_MODE = false; }
    $scope.HRM_GET_EMPLOYEE_STEP = function () {
        var UserModelObj = new Object();
        UserModelObj.EMPLY_PRSNL_ID = getUrlParameter('EMP_ID', $location.absUrl());
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'HRM_GET_EMPLOYEE_STEP').then(function (data) {
            if (data.data.Table.length > 0) {
                let RESULT_PERSNL = data.data.Table[0];
                $scope.HeaderPrimaryDetails.FIRST_NAME = RESULT_PERSNL.FIRST_NAME;
                $scope.HeaderPrimaryDetails.MIDDLE_NAME = RESULT_PERSNL.MIDDLE_NAME;
                $scope.HeaderPrimaryDetails.LAST_NAME = RESULT_PERSNL.LAST_NAME;
                $scope.STEP_NO = RESULT_PERSNL.STEP_NO;
                if (RESULT_PERSNL.EMPLOYEE_STATUS_ID == 5) {
                    $scope.SHOW_EDIT_ACCESS = false;
                    $scope.EDIT_MODE = true;

                }
                else {
                    if ($cookies.get("EMPLY_PRSNL_ID") == 0) {
                        $scope.SHOW_EDIT_ACCESS = true;
                    }
                    else if (RESULT_PERSNL.BRANCH_ID == null) {
                        $scope.SHOW_EDIT_ACCESS = $scope.CheckEmployeeAllBranchAccess('EDIT_EMPLOYEE');
                    }
                    else {
                        $scope.SHOW_EDIT_ACCESS = $scope.CheckEmployeeAccess(parseInt($cookies.get("ENTITY_ID")), RESULT_PERSNL.BRANCH_ID, 'EDIT_EMPLOYEE');
                    }
                    if (RESULT_PERSNL.STEP_NO == 9) {
                        $scope.EDIT_STEP_NO = RESULT_PERSNL.STEP_NO == undefined ? 0 : RESULT_PERSNL.STEP_NO;
                    } else {
                        $scope.EDIT_STEP_NO = RESULT_PERSNL.STEP_NO;
                    }
                    $scope.EDIT_MODE = $scope.EDIT_STEP_NO < 9 ? false : true;
                    if (parseInt(getUrlParameter('EMP_ID', $location.absUrl())) == parseInt($cookies.get("EMPLY_PRSNL_ID"))) {
                        $scope.EDIT_MODE = true;
                        if ($scope.SHOW_EDIT_ACCESS) {
                            $scope.MY_PROFILE_FLAG = 0;
                        }
                        else {
                            $scope.MY_PROFILE_FLAG = 1;
                        }
                    };
                }
            } else {
                if ($cookies.get("EMPLY_PRSNL_ID") == 0) {
                    $scope.SHOW_EDIT_ACCESS = true;
                } else {
                    $scope.SHOW_EDIT_ACCESS = $scope.CheckEmployeeAllBranchAccess('EDIT_EMPLOYEE');
                }
            }
        })
    }
    $scope.HRM_GET_EMPLOYEE_STEP();

    $scope.ASSERT_EM_LIST = [];
    $scope.ASSET_TYPE_LIST = [];
    $scope.EMPLOYEE_ASSETS_LIST = [];

    var assetobj = new Object();
    assetobj.EMPLOYEE_ASSETS_ID = 0;
    assetobj.ASSET_ID = '';
    assetobj.ISSUE_DATE = '';
    assetobj.RETURN_DATE = '';
    assetobj.NOTES = '';
    assetobj.UPLOAD_IDS_ADD = '';
    assetobj.UPLOAD_IDS_REMOVE = '';
    assetobj.DELETE_FLAG = 0;
    $scope.ASSET_TYPE_OBJ = assetobj;

    $scope.BLANK_ADD_ASSET = function () {
        $scope.EMPLOYEE_ASSETS_LIST.push(angular.copy($scope.ASSET_TYPE_OBJ));
        $scope.DATE_INPUT_LOAD();
    }

    $scope.GET_UPLOADS = function (_asset) {
        var PosiModelObj = new Object();
        PosiModelObj.RELATIVE_ID = _asset.EMPLOYEE_ASSETS_ID;
        PosiModelObj.UPLOAD_TYPE_ID = 42;
        PosiModelObj.VIRTUALPATH = '';
        PosiModelObj.TABLE_ID = -1;
        PosiModelObj.ORIGINAL_FILE_NAME = '';
        PosiModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.PAYROLL_API(PosiModelObj, 'GET_UPLOADS').then(function (data) {
            if (data.data.Table.length > 0) {
                _asset.UploadedFiles = [];
                _asset.UploadedFiles = data.data.Table;
            }
        });
    };

    $scope.HRM_GET_ASSETS = function () {
        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_ID = $scope.AssetSearch.CUSTOMER_ID;
        CusModelObj.ENTITY_ID = null;
        CusModelObj.PAGE_NO = 1;
        CusModelObj.PAGE_SIZE = 10;
        PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_GET_ASSETS').then(function (data) {
            $scope.ASSET_TYPE_LIST = data.data.Table;
        });
    }
    $scope.EMPLOYEE_ASSETS_LIST = [];
    $scope.HRM_GET_EMPLOYEE_ASSETS = function () {
        var PosiModelObj = new Object();
        PosiModelObj.EMPLY_PRSNL_ID = $scope.AssetSearch.EMPLY_PRSNL_ID;
        PrcCommMethods.HUMANRESOURCE_API(PosiModelObj, 'HRM_GET_EMPLOYEE_ASSETS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.EMPLOYEE_ASSETS_LIST = data.data.Table;

            }
            else {
                $scope.BLANK_ADD_ASSET();
            }
        });
    };

    $scope.HRM_GET_EMPLOYEE_ASSETS();

    $scope.CHECK_DATE_ISSUE_RETURN_Fn = function (_asset) {
        if (_asset.RETURN_DATE != '' && _asset.RETURN_DATE != null && _asset.ISSUE_DATE != '' && _asset.ISSUE_DATE != null &&
            new Date(_asset.RETURN_DATE) > new Date(_asset.ISSUE_DATE)) {
            _asset.RETURN_DATE_FLAG = 0;
        };
        if (_asset.ISSUE_DATE != '' && _asset.ISSUE_DATE != null && _asset.ISSUE_DATE != '' && _asset.ISSUE_DATE != null &&
            new Date($scope.HIRING_DATE) < new Date(_asset.ISSUE_DATE)) {
            _asset.ISSUE_HRING_DATE_FLAG = 0;
        };
    }
    $scope.getTheFilesToUploadAsset = function ($files, ControlName, FileSize, List, ATTACHMENT_UPLOAD_TYPE_ID, index) {
        if (FileSize == undefined || FileSize == null || FileSize == 0 || FileSize == '') {
            FileSize = AppVal.FileSize;
        }
        $scope.imagesrc = [];
        var valid = 0;
        for (var i = 0; i < $files.length; i++) {
            var validFormats = ['pdf', 'jpg', 'jpeg', 'png'];
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
                    $scope.ShowAlertBox('Error', 'Maximum File Size ' + FileSize + ' MB.', 5000);
                    angular.element("input[id='" + ControlName + index + "']").val(null);
                    return;
                }
            }
            else {
                $scope.ShowAlertBox('Error', 'Not a valid file.', 5000);
                angular.element("input[id='" + ControlName + index + "']").val(null);
                return;
            }
        }
        $scope.Files = $files;
        var fileUpload = document.getElementById("Asset" + index);
        extension = fileUpload.files[0].name;;
        $scope.uploadFiles(ATTACHMENT_UPLOAD_TYPE_ID, extension, List, index, ControlName);
    };
    $scope.uploadFiles = function (ATTACHMENT_UPLOAD_TYPE_ID, filename, List, index, ControlName) {
        if (($scope.Files != undefined && $scope.Files.length > 0)) {
            $scope.DocImageResult = [];
            var data = new FormData();
            data.append("RelativeID", "ASSET_" + $scope.AssetSearch.EMPLY_PRSNL_ID + List.RANDOM_ID + "" + index);
            data.append("UPLOAD_TYPE_ID", ATTACHMENT_UPLOAD_TYPE_ID);
            data.append("VIRTUALPATH", '/CUSTOMER_ID_' + $scope.AssetSearch.CUSTOMER_ID + '/USER_ID_/' + $scope.AssetSearch.USER_ID + '/EMPLOYEE_ID_' + $scope.AssetSearch.EMPLY_PRSNL_ID + '/ASSET/UPLOAD_TYPE_ID_' + ATTACHMENT_UPLOAD_TYPE_ID + '/');
            data.append("UPLOAD_ID", 0);
            data.append("ORIGINAL_FILE_NAME", filename);
            data.append("USER_ID", $scope.AssetSearch.USER_ID);
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
                    $scope.ShowAlertBox('Error', d.data[0].UPLOADED_COMMENT, 5000);
                }
                else {
                    List.UploadedFiles = d.data;
                }
                if (List.UPLOAD_IDS_REMOVE == undefined) {
                    List.UPLOAD_IDS_REMOVE = [];
                }

                if (List.UPLOAD_IDS_REMOVE.length > 0) {
                    angular.forEach(List.UPLOAD_IDS_REMOVE, function (REMOVE_FILE) {
                        var index = List.UploadedFiles.findIndex(x => x.UPLOAD_ID === REMOVE_FILE.UPLOAD_ID);
                        if (index > -1) {
                            List.UploadedFiles.splice(index, 1);
                        }
                    });
                    //angular.forEach(List.UploadedFiles, function (UPLOAD_FILE) {
                    //    var index = List.UPLOAD_IDS_REMOVE.findIndex(x=>x.TABLE_ID === UPLOAD_FILE.TABLE_ID);
                    //    List.UploadedFiles.splice(index, 1);

                    //    //angular.forEach(List.UPLOAD_IDS_REMOVE, function (REMOVE_FILE) {
                    //    //})
                    //});
                }
                angular.element("input[id='" + ControlName + index + "']").val(null);
            });
        }
    };


    $scope.DELETE_UPLOAD_ASSET_Fn = function (Array, item, index, FLAG) {
        if (confirm('Are you sure you want to delete the file?')) {
            if (FLAG == 1) {
                Array.splice(index, 1);
            }
            else {
                if (Array.UPLOAD_IDS_REMOVE == undefined || Array.UPLOAD_IDS_REMOVE == '') {
                    Array.UPLOAD_IDS_REMOVE = [];
                }
                Array.UPLOAD_IDS_REMOVE.push(angular.copy(item));
                Array.UploadedFiles.splice(index, 1);
            }
        }
    };
    $scope.GET_UTC_TIME = function () {
        var UserModelObj = new Object();
        UserModelObj.TIMEZONE_OFFSET = "00:00";
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'GET_UTC_TIME').then(function (data) {
            if (data.data != null) {
                $scope.CURRENT_DATE = new Date(data.data);          
            }
            if ($scope.CURRENT_DATE == '') {
                $scope.CURRENT_DATE = new Date();
            }
        })
    };
    $scope.GET_UTC_TIME();
    $scope.DATEINPUT_ASSET_LOAD = function (index, NAME) {
        var date_inputs = document.getElementById(NAME + index) //our date input has the name "date"
        if (date_inputs.length > 0) {
            for (var i = 0; i < date_inputs.length; i++) {
                var date_input = $('input[name="' + date_inputs[i].name + '"]'); //our date input has the name "date"
                var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
                var date = new Date($scope.CURRENT_DATE);
                var getMonth = date.getMonth();
                var getDate = date.getDate();
                var options = {
                    todayBtn: "linked",
                    daysOfWeekHighlighted: "0,6",
                    autoclose: true,
                    todayHighlight: true,
                    format: $scope.$parent.CALENDAR_DATE_FORMAT,
                    clearBtn: true,
                    closeBtn: true,// close button visible
                    startDate: new Date(date.getFullYear(), date.getMonth(), getDate)
                };
                date_input.datepicker(options);
            }
        }
    }


    $scope.nginit_asset = function (_asset, index) {
        if ((_asset.CUSTOM_ASSET_NAME == undefined || _asset.CUSTOM_ASSET_NAME == "" || _asset.CUSTOM_ASSET_NAME == null) && (_asset.ASSET_NAME == '' || _asset.ASSET_NAME == undefined || _asset.ASSET_NAME == null)) {
            _asset.CUSTOM_ASSET_NAME = $scope.AssetSearch.DD_DEFAULT_TEXT;
        }
        else if (_asset.ASSET_NAME != '' && _asset.ASSET_NAME != undefined && _asset.ASSET_NAME != null) {
            _asset.CUSTOM_ASSET_NAME = _asset.ASSET_NAME;
        };
        if (_asset.EMPLOYEE_ASSETS_ID > 0) {
            //_asset.ISSUE_DATE = $filter('date')(new Date(_asset.ISSUE_DATE));
            _asset.ISSUE_DATE = moment(_asset.ISSUE_DATE).format($scope.$parent.CONVERSION_DATE_FORMAT);
            if (_asset.RETURN_DATE != null && _asset.RETURN_DATE != '' && _asset.RETURN_DATE != undefined) {
                //_asset.RETURN_DATE = $filter('date')(new Date(_asset.RETURN_DATE));
                _asset.RETURN_DATE = moment(_asset.RETURN_DATE).format($scope.$parent.CONVERSION_DATE_FORMAT);
            }
        }
        $scope.DATE_INPUT_LOAD();
        _asset.RANDOM_ID = $scope.$parent.$parent.generaterandom(12);
        $scope.GET_UPLOADS(_asset);
    }
    $scope.HRM_GET_EMPLOYEE_EMPLOYMENT_INFO = function () {
        var EmploymentInfoObject = new Object();
        EmploymentInfoObject.EMPLY_PRSNL_ID = $scope.AssetSearch.EMPLY_PRSNL_ID;
        EmploymentInfoObject.ENTITY_ID = $cookies.get("ENTITY_ID");
        PrcCommMethods.HUMANRESOURCE_API(EmploymentInfoObject, 'HRM_GET_EMPLOYEE_EMPLOYMENT_INFO').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.HIRING_DATE = data.data.Table[0].HIRING_DATE;//moment(data.data.Table[0].HIRING_DATE, 'DD/MM/YYYY').format('MMM DD, YYYY') ;
            }
        })
    }

    $scope.HRM_GET_ASSETS();
    $scope.HRM_GET_EMPLOYEE_EMPLOYMENT_INFO();
    $scope.HRM_EDIT_DETAILS = function () {
        $scope.EDIT_MODE = !$scope.EDIT_MODE;
    }

    $scope.ADD_MORE_ASSET_Fn = function () {
        $scope.BLANK_ADD_ASSET();
    }
    $scope.EMPLOYEE_ASSETS_LIST_DELETE = [];
    $scope.REMOVE_ASSETS_LINE_Fn = function (LINE, index) {
        if (confirm('Are you Sure?')) {
            if (LINE.TABLE_ID == 0) {
                $scope.EMPLOYEE_ASSETS_LIST.splice(index, 1);
            }
            else {
                LINE.DELETE_FLAG = 1;
                $scope.EMPLOYEE_ASSETS_LIST_DELETE.push(angular.copy(LINE));
                $scope.EMPLOYEE_ASSETS_LIST.splice(index, 1);
            }
        }
    };

    $scope.HRM_INS_UPD_EMPLOYEE_ASSETS = function (FLAG_SET) {
        if (FLAG_SET != 2) {
            $scope.AssetForm.submitted = true;
        };
        let valid = 0;
        if ($scope.AssetForm.$valid) {
            var FLAG = false;
            angular.forEach($scope.EMPLOYEE_ASSETS_LIST, function (val) {
                val.ISSUE_HRING_DATE_FLAG = 0;
                if (val.ISSUE_DATE != "" && val.ISSUE_DATE != null && val.ISSUE_DATE != undefined) {

                    //if (new Date(val.ISSUE_DATE) < new Date($scope.HIRING_DATE)) {
                    //    val.ISSUE_HRING_DATE_FLAG = 1;
                    //    FLAG = true;
                    //    valid++;
                    //}
                    if (moment(val.ISSUE_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate() < moment($scope.HIRING_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate()) {
                        val.ISSUE_HRING_DATE_FLAG = 1;
                        FLAG = true;
                        valid++;
                    }
                }
                if (FLAG) {
                    val.RETURN_DATE = '';
                }

            });
            if (FLAG == false) {
                angular.forEach($scope.EMPLOYEE_ASSETS_LIST, function (val) {
                    val.RETURN_DATE_FLAG = 0;
                    if (val.RETURN_DATE != "" && val.RETURN_DATE != null && val.RETURN_DATE != undefined) {
                        //if (new Date(val.RETURN_DATE) < new Date(val.ISSUE_DATE)) {
                        //    val.RETURN_DATE_FLAG = 1;
                        //    valid++;
                        //}
                        if (moment(val.RETURN_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate() < moment(val.ISSUE_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate()) {
                            val.RETURN_DATE_FLAG = 1;
                            valid++;
                        }
                    }
                });
            }


        }

        if (FLAG_SET == 2 || $scope.AssetForm.$valid && valid == 0) {
            var EmpModelObj = new Object();
            EmpModelObj.EMPLY_PRSNL_ID = $scope.AssetSearch.EMPLY_PRSNL_ID;
            EmpModelObj.USER_ID = $scope.AssetSearch.USER_ID;
            EmpModelObj.EMPLOYEE_ASSETS_TYPE = [];
            if (FLAG_SET != 2) {
                angular.forEach($scope.EMPLOYEE_ASSETS_LIST, function (val) {
                    var assetobj = new Object();
                    assetobj.EMPLOYEE_ASSETS_ID = val.EMPLOYEE_ASSETS_ID == undefined ? 0 : val.EMPLOYEE_ASSETS_ID;
                    assetobj.ASSET_ID = val.ASSET_ID;
                    //assetobj.ISSUE_DATE = val.ISSUE_DATE;
                    assetobj.ISSUE_DATE = moment(val.ISSUE_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).format('L');;
                    //assetobj.RETURN_DATE = val.RETURN_DATE == '' ? null : val.RETURN_DATE;
                    assetobj.RETURN_DATE = val.RETURN_DATE == '' ? null : moment(val.RETURN_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).format('L');
                    assetobj.NOTES = val.NOTES;
                    assetobj.UPLOAD_IDS_ADD = "";
                    assetobj.UPLOAD_IDS_REMOVE = "";
                    if (val.UploadedFiles == "" || val.UploadedFiles == undefined || val.UploadedFiles == null || val.UploadedFiles.length == 0) {
                        valid = 0; // validation not in doc 
                    }
                    angular.forEach(val.UploadedFiles, function (_upload_val) {
                        if (assetobj.UPLOAD_IDS_ADD == "") {
                            assetobj.UPLOAD_IDS_ADD = _upload_val.ID;
                        }
                        else {
                            assetobj.UPLOAD_IDS_ADD = assetobj.UPLOAD_IDS_ADD + ',' + _upload_val.UPLOAD_ID;
                        }
                    });
                    angular.forEach(val.UPLOAD_IDS_REMOVE, function (_Remove_val) {
                        if (assetobj.UPLOAD_IDS_REMOVE == "") {
                            assetobj.UPLOAD_IDS_REMOVE = _Remove_val.UPLOAD_ID;
                        }
                        else {
                            assetobj.UPLOAD_IDS_REMOVE = assetobj.UPLOAD_IDS_REMOVE + ',' + _Remove_val.UPLOAD_ID;
                        }
                    });
                    assetobj.DELETE_FLAG = 0;
                    EmpModelObj.EMPLOYEE_ASSETS_TYPE.push(assetobj);
                });
                if ($scope.EMPLOYEE_ASSETS_LIST_DELETE.length > 0) {
                    angular.forEach($scope.EMPLOYEE_ASSETS_LIST_DELETE, function (_loop_value) {
                        var assetobj = new Object();
                        assetobj.EMPLOYEE_ASSETS_ID = _loop_value.EMPLOYEE_ASSETS_ID;
                        assetobj.ASSET_ID = null;
                        assetobj.ISSUE_DATE = null;
                        assetobj.RETURN_DATE = null;
                        assetobj.NOTES = null;
                        assetobj.UPLOAD_IDS_ADD = null;
                        assetobj.UPLOAD_IDS_REMOVE = null;
                        assetobj.DELETE_FLAG = 1;
                        EmpModelObj.EMPLOYEE_ASSETS_TYPE.push(assetobj);
                    });
                }
                //if (EmpModelObj.EMPLOYEE_ASSETS_TYPE.length == 0) {
                //    var assetobj = new Object();
                //    assetobj.EMPLOYEE_ASSETS_ID = null;
                //    assetobj.ASSET_ID = null;
                //    assetobj.ISSUE_DATE = null;
                //    assetobj.RETURN_DATE = null;
                //    assetobj.NOTES = null;
                //    assetobj.UPLOAD_IDS_ADD = null;
                //    assetobj.UPLOAD_IDS_REMOVE = null;
                //    assetobj.DELETE_FLAG = null;
                //    EmpModelObj.EMPLOYEE_ASSETS_TYPE.push(assetobj);
                //}
            }
            if (FLAG_SET == 2) {
                var assetobj = new Object();
                assetobj.EMPLOYEE_ASSETS_ID = null;
                assetobj.ASSET_ID = null;
                assetobj.ISSUE_DATE = null;
                assetobj.RETURN_DATE = null;
                assetobj.NOTES = null;
                assetobj.UPLOAD_IDS_ADD = null;
                assetobj.UPLOAD_IDS_REMOVE = null;
                assetobj.DELETE_FLAG = null;
                EmpModelObj.EMPLOYEE_ASSETS_TYPE.push(assetobj);
            }
            if (valid == 0) {
                PrcCommMethods.HUMANRESOURCE_API(EmpModelObj, 'HRM_INS_UPD_EMPLOYEE_ASSETS').then(function (data) {
                    if (data.data == 0 && FLAG_SET != 2) {
                        $scope.$parent.ShowAlertBox('Success', 'Assets Updated Successfully', 5000);
                    }
                    if (data.data > 0 && FLAG_SET != 2) {
                        $scope.$parent.ShowAlertBox('Success', 'Assets Added Successfully', 5000);
                        if (FLAG_SET == 1) {
                            $scope.TAB_CLICK_HR_HEADER_Fn(0);
                        }
                        else {
                            $scope.TAB_CLICK_HR_HEADER_Fn(8, getUrlParameter('EMP_ID', $location.absUrl()));
                        }
                    }
                    if (FLAG_SET == 2) {
                        $scope.TAB_CLICK_HR_HEADER_Fn(8, getUrlParameter('EMP_ID', $location.absUrl()));
                    }
                });
            }
            else {
                if (valid > 0) {

                    //$scope.$parent.ShowAlertBox('Success', 'Assets Added Successfully', 5000);
                }
            }
        } else {
            if (valid == 0) {
                $scope.$parent.ShowAlertBox("Attention", $scope.$parent.MANDATORY_MSG, 3000);
            }
        }
    };

    $scope.SELECTED_ASSET_Fn = function (_param_asset_type, _param_asset_mapping) {
        if (_param_asset_type == '') {
            _param_asset_mapping.CUSTOM_ASSET_NAME = $scope.AssetSearch.DD_DEFAULT_TEXT;;
            _param_asset_mapping.ASSET_ID = '';
        }
        else {
            _param_asset_mapping.CUSTOM_ASSET_NAME = _param_asset_type.ASSET_NAME;
            _param_asset_mapping.ASSET_ID = _param_asset_type.ASSET_ID;
        }
    }

});