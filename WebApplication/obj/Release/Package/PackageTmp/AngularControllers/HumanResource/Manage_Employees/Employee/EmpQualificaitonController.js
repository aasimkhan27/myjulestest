app.controller('EmpQualificaitonController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    //$scope.$parent.DISPLAY_FLAG = false;
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(2);
    $(".modal-backdrop").remove();
    $scope.HR_COMMON_CODE_Fn();
    $scope.$parent.$parent.overlay_loading_HR_Loader = 'none';
    $scope.QulificationSearch = {
        EMPLY_PRSNL_ID: getUrlParameter('EMP_ID', $location.absUrl()),
        CUSTOMER_ID: $cookies.get("CUSTOMER_ID"),
        ENTITY_ID: null,// $cookies.get("ENTITY_ID"),
        MODULE_ID: $cookies.get("MODULE_ID"),
        USER_ID: $cookies.get("USERID"),
        CUSTOM_PAY_TYPE: 'Choose',
        DD_DEFAULT_TEXT: 'Choose',
    };
    $scope.RESET_QULIFICATION = function () {
        $scope.QulificationSearch = {
            EMPLY_PRSNL_ID: getUrlParameter('EMP_ID', $location.absUrl()),
            CUSTOMER_ID: $cookies.get("CUSTOMER_ID"),
            ENTITY_ID: $cookies.get("ENTITY_ID"),
            MODULE_ID: $cookies.get("MODULE_ID"),
            USER_ID: $cookies.get("USERID"),
            CUSTOM_PAY_TYPE: 'Choose',
            DD_DEFAULT_TEXT: 'Choose',
        };
    };
    $scope.STEP_FLAG = 8;
    $scope.EDIT_STEP_NO = getUrlParameter('STEP_NO', $location.absUrl());
    $scope.EDIT_STEP_NO = $scope.EDIT_STEP_NO == undefined ? 0 : $scope.EDIT_STEP_NO;
    $scope.EDIT_MODE = $scope.EDIT_STEP_NO < 9 ? false : true;
    if ($scope.$parent.CheckStandardRoleAccess(5) || $scope.$parent.CheckStandardRoleAccess(10) || $scope.$parent.CheckStandardRoleAccess(15)) {
        //Employee //5, 10, 15 Employee
        $scope.IS_EMPLOYEE = true;
    }

    $scope.HRM_GET_EMPLOYEE_STEP = function () {
        var UserModelObj = new Object();
        UserModelObj.EMPLY_PRSNL_ID = getUrlParameter('EMP_ID', $location.absUrl());
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'HRM_GET_EMPLOYEE_STEP').then(function (data) {
            if (data.data.Table.length > 0) {
                let RESULT_PERSNL = data.data.Table[0];
                $scope.HeaderPrimaryDetails.FIRST_NAME = RESULT_PERSNL.FIRST_NAME;
                $scope.HeaderPrimaryDetails.MIDDLE_NAME = RESULT_PERSNL.MIDDLE_NAME;
                $scope.HeaderPrimaryDetails.LAST_NAME = RESULT_PERSNL.LAST_NAME;
                $scope.DOB = new Date(RESULT_PERSNL.DOB); //moment(RESULT_PERSNL.DOB, 'DD/MM/YYYY').format('MMM DD, YYYY')
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
                        $scope.SHOW_EDIT_ACCESS = $scope.CheckEmployeeAccess(parseInt($cookies.get("ENTITY_ID")), RESULT_PERSNL.BRANCH_ID, "EDIT_EMPLOYEE");
                    }
                    if (RESULT_PERSNL.STEP_NO == 9) {
                        $scope.EDIT_STEP_NO = RESULT_PERSNL.STEP_NO == undefined ? 0 : RESULT_PERSNL.STEP_NO;
                    } else {
                        $scope.EDIT_STEP_NO = RESULT_PERSNL.STEP_NO;
                    }
                    $scope.EDIT_MODE = $scope.EDIT_STEP_NO < 9 ? false : true;
                    if (parseInt(getUrlParameter('EMP_ID', $location.absUrl())) == parseInt($cookies.get("EMPLY_PRSNL_ID"))) {
                        $scope.EDIT_MODE = true;
                        $scope.MY_PROFILE_FLAG = 1;
                        $scope.SHOW_EDIT_ACCESS = true;
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

    $scope.GET_UPLOADS = function (_qualification) {
        var PosiModelObj = new Object();
        PosiModelObj.RELATIVE_ID = _qualification.EMPLOYEE_QUALIFICATION_ID;
        PosiModelObj.UPLOAD_TYPE_ID = 42;
        PosiModelObj.VIRTUALPATH = '';
        PosiModelObj.TABLE_ID = -1;
        PosiModelObj.ORIGINAL_FILE_NAME = '';
        PosiModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.PAYROLL_API(PosiModelObj, 'GET_UPLOADS').then(function (data) {
            if (data.data.Table.length > 0) {
                _qualification.UploadedFiles = [];
                _qualification.UploadedFiles = data.data.Table;
            }
        });
    };

    $scope.DATE_INPUT_LOAD();

    $scope.QUALIFICATIONS_LIST = [];
    $scope.BLANK_QUALIFICATIONS_LIST = { EMPLOYEE_QUALIFICATION_ID: 0, QUALIFICATION_NAME: "", QUALIFICATION_TYPE_ID: "", ACCREDIATION: "", DATE_WHEN_ACHIEVED: "", VALID_UPTO_DATE: "", UPLOAD_IDS_ADD: "", UPLOAD_IDS_REMOVE: "", DELETE_FLAG: 0 };

    $scope.ADD_QUALIFICATIONS_LINE_Fn = function () {
        $scope.QUALIFICATIONS_LIST.push(angular.copy($scope.BLANK_QUALIFICATIONS_LIST));
        $scope.DateInputLoad();
    };

    $scope.QUALIFICATIONS_LIST_DELETE = [];
    $scope.REMOVE_QUALIFICATIONS_LINE_Fn = function (LINE, index) {
        if (confirm('Are you Sure?')) {
            if (LINE.TABLE_ID == 0) {
                $scope.QUALIFICATIONS_LIST.splice(index, 1);
            }
            else {
                LINE.DELETE_FLAG = 1;
                $scope.QUALIFICATIONS_LIST_DELETE.push(angular.copy(LINE));
                $scope.QUALIFICATIONS_LIST.splice(index, 1);
            }
        }
    };
    $scope.HRM_EDIT_DETAILS = function () {
        $scope.EDIT_MODE = false;
    }
    $scope.nginit_qualification = function (_qualification) {
        if ((_qualification.CUSTOM_QUALIFICATION_NAME == undefined || _qualification.CUSTOM_QUALIFICATION_NAME == "" || _qualification.CUSTOM_QUALIFICATION_NAME == null) && (_qualification.QUALIFICATION_TYPE == '' || _qualification.QUALIFICATION_TYPE == undefined || _qualification.QUALIFICATION_TYPE == null)) {
            _qualification.CUSTOM_QUALIFICATION_NAME = $scope.QulificationSearch.DD_DEFAULT_TEXT;
        }
        else if (_qualification.QUALIFICATION_TYPE != '' && _qualification.QUALIFICATION_TYPE != undefined && _qualification.QUALIFICATION_TYPE != null) {
            _qualification.CUSTOM_QUALIFICATION_NAME = _qualification.QUALIFICATION_TYPE;
        };
        if (_qualification.EMPLOYEE_QUALIFICATION_ID > 0) {

            //_qualification.DATE_WHEN_ACHIEVED = $filter('date')(new Date(_qualification.DATE_WHEN_ACHIEVED));
            _qualification.DATE_WHEN_ACHIEVED = moment(_qualification.DATE_WHEN_ACHIEVED).format($scope.$parent.CONVERSION_DATE_FORMAT);
            if (_qualification.VALID_UPTO_DATE != null && _qualification.VALID_UPTO_DATE != '' && _qualification.VALID_UPTO_DATE != undefined) {
                //_qualification.VALID_UPTO_DATE = $filter('date')(new Date(_qualification.VALID_UPTO_DATE));
                _qualification.VALID_UPTO_DATE = moment(_qualification.VALID_UPTO_DATE).format($scope.$parent.CONVERSION_DATE_FORMAT);
            }
            // _qualification.VALID_UPTO_DATE = $filter('date')(new Date(_qualification.VALID_UPTO_DATE));
            $scope.DATE_INPUT_LOAD();
        }
        _qualification.RANDOM_ID = $scope.$parent.$parent.generaterandom(12);
        $scope.GET_UPLOADS(_qualification);
    }
    $scope.SELECTED_QUALIFICATION_Fn = function (_param_qualification, _param_qualification_mapping) {
        if (_param_qualification == '') {
            _param_qualification_mapping.CUSTOM_QUALIFICATION_NAME = $scope.QulificationSearch.DD_DEFAULT_TEXT;;
            _param_qualification_mapping.QUALIFICATION_TYPE_ID = '';
        }
        else {
            _param_qualification_mapping.CUSTOM_QUALIFICATION_NAME = _param_qualification.QUALIFICATION_NAMES;
            _param_qualification_mapping.QUALIFICATION_TYPE_ID = _param_qualification.QUALIFICATION_TYPE_ID;
        }
    }

    $scope.HRM_GET_QUALIFICATION_TYPE = function () {
        var UserModelObj = new Object();
        UserModelObj.CUSTOMER_ID = $cookies.get("CUSTOMER_ID");
        UserModelObj.ENTITY_ID = null;
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'HRM_GET_QUALIFICATION_TYPE').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.QUALIFICATION_TYPE_LIST = data.data.Table;
                console.log('QUALIFICATION_TYPE_LIST', $scope.QUALIFICATION_TYPE_LIST);
            }
            else if (data.data == 0) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            } else {
                $scope.QUALIFICATION_TYPE_LIST = [];
            }
        });
    }

    $scope.HRM_GET_QUALIFICATION_TYPE();

    $scope.HRM_GET_EMPLOYEE_QUALIFICATIONS = function () {
        var PosiModelObj = new Object();
        PosiModelObj.EMPLY_PRSNL_ID = $scope.QulificationSearch.EMPLY_PRSNL_ID;
        PrcCommMethods.HUMANRESOURCE_API(PosiModelObj, 'HRM_GET_EMPLOYEE_QUALIFICATIONS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.QUALIFICATIONS_LIST = data.data.Table;
            } else {
                $scope.ADD_QUALIFICATIONS_LINE_Fn();
            }
        });
    };
    $scope.HRM_GET_EMPLOYEE_QUALIFICATIONS();

    $scope.getTheFilesToUploadCource = function ($files, ControlName, FileSize, List, ATTACHMENT_UPLOAD_TYPE_ID, index) {
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
                    $scope.ShowAlert('Error', 'Maximum File Size ' + FileSize + ' MB.', 5000);
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
        var fileUpload = document.getElementById("certificate" + index);
        extension = fileUpload.files[0].name;;
        $scope.uploadFiles(ATTACHMENT_UPLOAD_TYPE_ID, extension, List, index, ControlName);
    };
    $scope.uploadFiles = function (ATTACHMENT_UPLOAD_TYPE_ID, filename, List, index, ControlName) {
        if (($scope.Files != undefined && $scope.Files.length > 0)) {
            $scope.DocImageResult = [];
            var dataform = new FormData();
            //data.append("RelativeID", List.EMPLOYEE_QUALIFICATION_ID == 0 ? "EMP_" + $scope.QulificationSearch.EMPLY_PRSNL_ID + List.RANDOM_ID + "" + index : List.EMPLOYEE_QUALIFICATION_ID);
            dataform.append("RelativeID", "EMP_" + getUrlParameter('EMP_ID', $location.absUrl()) + List.RANDOM_ID + "" + index);
            dataform.append("UPLOAD_TYPE_ID", ATTACHMENT_UPLOAD_TYPE_ID);
            dataform.append("VIRTUALPATH", '/CUSTOMER_ID_' + $scope.QulificationSearch.CUSTOMER_ID + '/USER_ID_' + $scope.QulificationSearch.USER_ID + '/EMPLOYEE_ID_' + getUrlParameter('EMP_ID', $location.absUrl()) + '/QUALIFICATION/UPLOAD_TYPE_ID_' + ATTACHMENT_UPLOAD_TYPE_ID + '/');
            dataform.append("UPLOAD_ID", 0);
            dataform.append("ORIGINAL_FILE_NAME", filename);
            dataform.append("USER_ID", $scope.QulificationSearch.USER_ID);
            if (isNaN(parseInt($cookies.get("ENTITY_ID")))) {
                dataform.append("ENTITY_ID", 0);
            }
            else {
                dataform.append("ENTITY_ID", parseInt($cookies.get("ENTITY_ID")));
            }
            for (var i in $scope.Files) {
                dataform.append("uploadedFile", $scope.Files[i]);
            }
            var request = {
                method: 'POST',
                url: CommService.Get_CASHUP_API() + "api/PayrollAPI/UPLOADFILES",
                data: dataform,
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
                if (List.UPLOAD_IDS_REMOVE != undefined && List.UPLOAD_IDS_REMOVE.length > 0) {
                    angular.forEach(List.UPLOAD_IDS_REMOVE, function (REMOVE_FILE) {
                        var index = List.UploadedFiles.findIndex(x => x.UPLOAD_ID === REMOVE_FILE.UPLOAD_ID);
                        if (index > -1) {
                            List.UploadedFiles.splice(index, 1);
                        }
                    });
                }
                angular.element("input[id='" + ControlName + index + "']").val(null);
            });
        }
    };


    $scope.DELETE_UPLOAD_QUALIFICATION = function (Array, item, index, FLAG) {
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
    function isDateValid(dateString) {
        let date = moment(dateString, 'MMM D, YYYY', true);
        return date.isValid();
    }
    $scope.CHECK_VALIDDATE_TO_ACHIEVEDDATE = function (_qualification) {

        if (_qualification.VALID_UPTO_DATE != null && _qualification.VALID_UPTO_DATE != '' && _qualification.DATE_WHEN_ACHIEVED != null && _qualification.DATE_WHEN_ACHIEVED != ''
            && isDateValid(_qualification.VALID_UPTO_DATE) && new Date(_qualification.DATE_WHEN_ACHIEVED) > new Date(_qualification.VALID_UPTO_DATE)) {
            _qualification.DATE_FLAG = 1;
        } else {
            _qualification.DATE_FLAG = 0;
        }
    }
    $scope.CHECK_DATE_Fn = function (_asset) {
        if (_asset.VALID_UPTO_DATE != '' && _asset.VALID_UPTO_DATE != null && _asset.DATE_WHEN_ACHIEVED != '' && _asset.DATE_WHEN_ACHIEVED != null && (new Date(_asset.DATE_WHEN_ACHIEVED) > new Date($scope.DOB))) {
            _asset.DATE_DOB_FLAG = 0;
        };
    }

    $scope.HRM_INS_UPD_EMPLOYEE_QUALIFICATIONS = function (FLAG) {
        if (FLAG != 2) {
            $scope.QUALIFICATIONSFORM.submitted = true;
        }
        let valid = 0;
        if ($scope.QUALIFICATIONSFORM.$valid) {
            angular.forEach($scope.QUALIFICATIONS_LIST, function (val) {
                val.DATE_FLAG = 0;
                val.DATE_DOB_FLAG = 0;
                //if (new Date(val.DATE_WHEN_ACHIEVED) > new Date(val.VALID_UPTO_DATE)) {
                //    val.DATE_FLAG = 1;
                //    valid++;
                //if (new Date(val.DATE_WHEN_ACHIEVED) < new Date($scope.DOB)) {
                //    val.DATE_DOB_FLAG = 1;
                //    valid++;
                //}
                if (moment(val.DATE_WHEN_ACHIEVED, $scope.$parent.CONVERSION_DATE_FORMAT).toDate() > moment(val.VALID_UPTO_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).toDate()) {
                    val.DATE_FLAG = 1;
                    valid++;
                }
                if (moment(val.DATE_WHEN_ACHIEVED, $scope.$parent.CONVERSION_DATE_FORMAT).toDate() < moment($scope.DOB, $scope.$parent.CONVERSION_DATE_FORMAT).toDate()) {
                    val.DATE_DOB_FLAG = 1;
                    valid++;
                }
            });

        }
        if (FLAG == 2 || $scope.QUALIFICATIONSFORM.$valid && valid == 0) {
            var EmpModelObj = new Object();
            EmpModelObj.EMPLY_PRSNL_ID = $scope.QulificationSearch.EMPLY_PRSNL_ID;
            EmpModelObj.USER_ID = $scope.QulificationSearch.USER_ID;
            EmpModelObj.EMPLOYEE_QUALIFICATIONS_TYPE = [];
            var count = 0
            if (FLAG != 2) {
                angular.forEach($scope.QUALIFICATIONS_LIST, function (_loop_value) {
                    var CRSL = $scope.QUALIFICATIONS_LIST.filter(function (x) { return x.QUALIFICATION_TYPE_ID == _loop_value.QUALIFICATION_TYPE_ID });
                    if (CRSL.length > 1) {
                        count++;
                        $scope.$parent.ShowAlertBox('Error', 'Qualification type should not be duplicate', 3000);
                    }
                    else {
                        var QulificationObj = new Object();
                        QulificationObj.EMPLOYEE_QUALIFICATION_ID = parseInt(_loop_value.EMPLOYEE_QUALIFICATION_ID);
                        QulificationObj.QUALIFICATION_TYPE_ID = _loop_value.QUALIFICATION_TYPE_ID;
                        QulificationObj.ACCREDIATION = _loop_value.ACCREDIATION;

                        //QulificationObj.DATE_WHEN_ACHIEVED = _loop_value.DATE_WHEN_ACHIEVED == undefined || _loop_value.DATE_WHEN_ACHIEVED == "" || _loop_value.DATE_WHEN_ACHIEVED == null ? '01-JAN-0001' : _loop_value.DATE_WHEN_ACHIEVED;
                        //QulificationObj.VALID_UPTO_DATE = _loop_value.VALID_UPTO_DATE == undefined || _loop_value.VALID_UPTO_DATE == "" || _loop_value.VALID_UPTO_DATE == null ? null : _loop_value.VALID_UPTO_DATE;;

                        QulificationObj.DATE_WHEN_ACHIEVED = _loop_value.DATE_WHEN_ACHIEVED == undefined || _loop_value.DATE_WHEN_ACHIEVED == "" || _loop_value.DATE_WHEN_ACHIEVED == null ? '01-JAN-0001' : moment(_loop_value.DATE_WHEN_ACHIEVED, $scope.$parent.CONVERSION_DATE_FORMAT).format('L');
                        QulificationObj.VALID_UPTO_DATE = _loop_value.VALID_UPTO_DATE == undefined || _loop_value.VALID_UPTO_DATE == "" || _loop_value.VALID_UPTO_DATE == null ? null : moment(_loop_value.VALID_UPTO_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).format('L');


                        QulificationObj.UPLOAD_IDS_ADD = "";
                        QulificationObj.UPLOAD_IDS_REMOVE = "";
                        QulificationObj.DELETE_FLAG = 0;
                        if (_loop_value.UploadedFiles == "" || _loop_value.UploadedFiles == undefined || _loop_value.UploadedFiles == null || _loop_value.UploadedFiles.length == 0) {
                            //count++;
                            $scope.COURCE_VALID = false;
                        }
                        if (_loop_value.UploadedFiles !== undefined && _loop_value.UploadedFiles.length > 0) {
                            angular.forEach(_loop_value.UploadedFiles, function (_upload_val) {
                                if (QulificationObj.UPLOAD_IDS_ADD == "") {
                                    QulificationObj.UPLOAD_IDS_ADD = _upload_val.ID;
                                }
                                else {
                                    QulificationObj.UPLOAD_IDS_ADD = QulificationObj.UPLOAD_IDS_ADD + ',' + _upload_val.ID
                                }
                            });
                            //QulificationObj.UPLOAD_IDS_ADD = _loop_value.UPLOAD_IDS;
                        }

                        if (_loop_value.UPLOAD_IDS_REMOVE !== undefined && _loop_value.UPLOAD_IDS_REMOVE.length > 0) {
                            angular.forEach(_loop_value.UPLOAD_IDS_REMOVE, function (val) {
                                if (QulificationObj.UPLOAD_IDS_REMOVE == "") {
                                    QulificationObj.UPLOAD_IDS_REMOVE = val.UPLOAD_ID;;
                                }
                                else {
                                    QulificationObj.UPLOAD_IDS_REMOVE = QulificationObj.UPLOAD_IDS_REMOVE + ',' + val.UPLOAD_ID;
                                }
                            });
                        }
                        EmpModelObj.EMPLOYEE_QUALIFICATIONS_TYPE.push(QulificationObj);
                    }
                });
                if ($scope.QUALIFICATIONS_LIST_DELETE.length > 0) {
                    angular.forEach($scope.QUALIFICATIONS_LIST_DELETE, function (_loop_value) {
                        var QulificationObj = new Object();
                        QulificationObj.EMPLOYEE_QUALIFICATION_ID = parseInt(_loop_value.EMPLOYEE_QUALIFICATION_ID);
                        QulificationObj.QUALIFICATION_TYPE_ID = null;
                        QulificationObj.ACCREDIATION = null;
                        QulificationObj.DATE_WHEN_ACHIEVED = null;
                        QulificationObj.VALID_UPTO_DATE = null;
                        QulificationObj.UPLOAD_IDS_ADD = null;
                        QulificationObj.UPLOAD_IDS_REMOVE = null;
                        QulificationObj.DELETE_FLAG = 1;
                        EmpModelObj.EMPLOYEE_QUALIFICATIONS_TYPE.push(QulificationObj);
                    });
                }
            }
            if (FLAG == 2) {
                var QulificationObj = new Object();
                QulificationObj.EMPLOYEE_QUALIFICATION_ID = null;
                QulificationObj.QUALIFICATION_TYPE_ID = null;
                QulificationObj.ACCREDIATION = null;
                QulificationObj.DATE_WHEN_ACHIEVED = null;
                QulificationObj.VALID_UPTO_DATE = null;
                QulificationObj.UPLOAD_IDS_ADD = null;
                QulificationObj.UPLOAD_IDS_REMOVE = null;
                QulificationObj.DELETE_FLAG = null;
                EmpModelObj.EMPLOYEE_QUALIFICATIONS_TYPE.push(QulificationObj);
            }
            if (count == 0) {
                PrcCommMethods.HUMANRESOURCE_API(EmpModelObj, 'HRM_INS_UPD_EMPLOYEE_QUALIFICATIONS').then(function (data) {
                    if (data.data == 0) {
                        $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                        //$scope.$parent.ShowAlert('Error', $scope.SOMETHINGWENTWRONG, 5000);
                    }
                    else if (FLAG == 1 || FLAG == undefined) {
                        $scope.$parent.ShowAlertBox('Success', 'Qualifications Added Successfully', 5000);
                        $scope.TAB_CLICK_HR_HEADER_Fn(0);
                    }
                    else if (FLAG == 'VIEW') {
                        $scope.$parent.ShowAlertBox('Success', 'Qualifications Updated Successfully', 5000);
                        $scope.TAB_CLICK_HR_HEADER_Fn(0);
                    }
                    if (FLAG == 1) {
                        $scope.TAB_CLICK_HR_HEADER_Fn(0);
                    }
                    else {
                        $scope.TAB_CLICK_HR_HEADER_Fn(9, getUrlParameter('EMP_ID', $location.absUrl()));
                    }
                });
            }
        } else {
            if (valid == 0) {
                $scope.$parent.ShowAlertBox("Attention", $scope.$parent.MANDATORY_MSG, 3000);
            }
        }
    };

});
