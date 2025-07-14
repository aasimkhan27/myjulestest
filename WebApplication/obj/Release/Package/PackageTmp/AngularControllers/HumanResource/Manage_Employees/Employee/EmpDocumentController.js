app.controller('EmpDocumentController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    //$scope.$parent.DISPLAY_FLAG = false;
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(2);
    $scope.$parent.$parent.overlay_loading_HR_Loader = 'none';
    $scope.HR_COMMON_CODE_Fn();
    $(".modal-backdrop").remove();
    $scope.DocumentSearch = {
        EMPLY_PRSNL_ID: getUrlParameter('EMP_ID', $location.absUrl()),
        CUSTOMER_ID: $cookies.get("CUSTOMER_ID"),
        ENTITY_ID: null,// $cookies.get("ENTITY_ID"),
        MODULE_ID: $cookies.get("MODULE_ID"),
        USER_ID: $cookies.get("USERID"),
        CUSTOM_PAY_TYPE: 'Choose',
        DD_DEFAULT_TEXT: 'Choose'

    }

    $scope.STEP_FLAG = 6;
    $scope.EDIT_STEP_NO = getUrlParameter('STEP_NO', $location.absUrl());
    $scope.EDIT_STEP_NO = $scope.EDIT_STEP_NO == undefined ? 0 : $scope.EDIT_STEP_NO;
    $scope.EDIT_MODE = $scope.EDIT_STEP_NO < 9 ? false : true;
    $scope.MY_PROFILE_FLAG = 0;
    if (parseInt(getUrlParameter('EMP_ID', $location.absUrl())) == parseInt($cookies.get("EMPLY_PRSNL_ID"))) {
        $scope.EDIT_MODE = true;
        $scope.MY_PROFILE_FLAG = 1;
    };
    $scope.HRM_EDIT_DETAILS = function () {
        $scope.EDIT_MODE = false;
    }
    if ($scope.$parent.CheckStandardRoleAccess(5) || $scope.$parent.CheckStandardRoleAccess(10) || $scope.$parent.CheckStandardRoleAccess(15)) {
        //Employee //5, 10, 15 Employee
        $scope.IS_EMPLOYEE = true;
    }
    //44	HRM Contracts
    //45	HRM RTW Documents
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
                    }
                    else {
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

    $scope.EMP_CONTRACTS = [];
    $scope.EMP_RTW_DOCUMENTS = [];
    $scope.HRM_ID_PROOF_LICENCE_LIST = [];
    $scope.HRM_ID_PAYSLIP_LIST = [];
    $scope.DELETE_EMP_CONTRACTS = [];
    $scope.DELETE_EMP_RTW_DOCUMENTS = [];
    $scope.DELETE_HRM_ID_PROOF_LICENCE_LIST = [];

    $scope.DELETE_HRM_PAYSLIP_LIST = [];


    $scope.GET_UPLOADS = function (Attachment_UPLOAD_TYPE_ID) {
        var PosiModelObj = new Object();
        PosiModelObj.RELATIVE_ID = $scope.DocumentSearch.EMPLY_PRSNL_ID;
        PosiModelObj.UPLOAD_TYPE_ID = Attachment_UPLOAD_TYPE_ID;
        PosiModelObj.VIRTUALPATH = '';
        PosiModelObj.TABLE_ID = -1;
        PosiModelObj.ORIGINAL_FILE_NAME = '';
        PosiModelObj.USER_ID = $scope.DocumentSearch.USER_ID
        PrcCommMethods.PAYROLL_API(PosiModelObj, 'GET_UPLOADS').then(function (data) {
            if (data.data.Table.length > 0) {
                if (Attachment_UPLOAD_TYPE_ID == 44) {
                    $scope.EMP_CONTRACTS = data.data.Table;
                }
                else if (Attachment_UPLOAD_TYPE_ID == 45 || Attachment_UPLOAD_TYPE_ID == 48) {
                    $scope.EMP_RTW_DOCUMENTS = $scope.EMP_RTW_DOCUMENTS.concat(data.data.Table);
                }
                else if (Attachment_UPLOAD_TYPE_ID == 49) {
                    $scope.HRM_ID_PROOF_LICENCE_LIST = data.data.Table;
                }
                else if (Attachment_UPLOAD_TYPE_ID == 57) {
                    $scope.HRM_ID_PAYSLIP_LIST = data.data.Table;
                }
            }
        });
    };
    $scope.HRM_GET_DOCUMENT_REQUEST_MSTR = function () {
        var DocModelObj = new Object();
        DocModelObj.CUSTOMER_ID = $cookies.get("CUSTOMER_ID");
        DocModelObj.ENTITY_ID = null;
        PrcCommMethods.HUMANRESOURCE_API(DocModelObj, 'HRM_GET_DOCUMENT_REQUEST_MSTR').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.DOCUMENT_REQUEST_LIST = data.data.Table;

            }
            else if (data.data == 0) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
            //else {
            //    $scope.DOCUMENT_REQUEST_LIST.push(angular.copy($scope.BLANK_DOCUMENT_REQUEST));
            //}
        });
    }
    $scope.HRM_GET_EMPLOYEE_DOCUMENTS = function () {
        var DocModelObj = new Object();
        DocModelObj.EMPLY_PRSNL_ID = getUrlParameter('EMP_ID', $location.absUrl()),
            PrcCommMethods.HUMANRESOURCE_API(DocModelObj, 'HRM_GET_EMPLOYEE_DOCUMENTS').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.EMP_CONTRACTS = data.data.Table.filter(function (x) { return x.UPLOAD_TYPE_ID == 44 });
                    $scope.EMP_RTW_DOCUMENTS = data.data.Table.filter(function (x) { return x.UPLOAD_TYPE_ID == 45 || x.UPLOAD_TYPE_ID == 48 });
                    $scope.HRM_ID_PROOF_LICENCE_LIST = data.data.Table.filter(function (x) { return x.UPLOAD_TYPE_ID == 49 });
                    $scope.HRM_ID_PAYSLIP_LIST = data.data.Table.filter(function (x) { return x.UPLOAD_TYPE_ID == 57 });
                }
                else if (data.data == 0) {
                    $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                }
            });
    }
    $scope.HRM_GET_EMPLOYEE_DOCUMENTS();



    $scope.SELECTED_DOCUMENT_Fn = function (_document) {
        if (_document == '') {
            $scope.DocumentSearch.DOCUMENT_REQUEST_NAMES = $scope.DocumentSearch.DD_DEFAULT_TEXT;
            $scope.DocumentSearch.DOCUMENT_REQUEST_MSTR_ID = '';
        }
        else {
            $scope.DocumentSearch.DOCUMENT_REQUEST_NAMES = _document.DOCUMENT_REQUEST_NAMES;
            $scope.DocumentSearch.DOCUMENT_REQUEST_MSTR_ID = _document.DOCUMENT_REQUEST_MSTR_ID;
        }
    }
    $scope.HRM_GET_DOCUMENT_REQUEST_MSTR();
    $scope.SELECTED_DOCUMENT_Fn('');

    $scope.DELETE_DOCUMENT_Fn = function (_doc_dtls, Uploadtypeid, index) {
        if (Uploadtypeid == 44) {
            $scope.DELETE_EMP_CONTRACTS.push(angular.copy(_doc_dtls));
            $scope.EMP_CONTRACTS.splice(index, 1)
        }
        else if (Uploadtypeid == 45) {
            $scope.DELETE_EMP_RTW_DOCUMENTS.push(angular.copy(_doc_dtls));
            $scope.EMP_RTW_DOCUMENTS.splice(index, 1)
        }
        else if (Uploadtypeid == 49) {
            $scope.DELETE_HRM_ID_PROOF_LICENCE_LIST.push(angular.copy(_doc_dtls));
            $scope.HRM_ID_PROOF_LICENCE_LIST.splice(index, 1)
        } else if (Uploadtypeid == 57) {
            $scope.DELETE_HRM_ID_PAYSLIP_LIST.push(angular.copy(_doc_dtls));
            $scope.HRM_ID_PAYSLIP_LIST.splice(index, 1)
        };
    }


    //$scope.GET_UPLOADS(44);
    //$scope.GET_UPLOADS(45);
    //$scope.GET_UPLOADS(48);
    //$scope.GET_UPLOADS(49);


    $scope.getTheFilesToUpload_6 = function ($files, ControlName, FileSize, ATTACHMENT_UPLOAD_TYPE_ID) {
        if (FileSize == undefined || FileSize == null || FileSize == 0 || FileSize == '') {
            FileSize = AppVal.FileSize;
        }
        $scope.imagesrc = [];
        var valid = 0;
        for (var i = 0; i < $files.length; i++) {
            var validFormats = ['doc', 'pdf', 'csv', 'jpg', 'jpeg', 'png', 'xls'];
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
                    $scope.ShowAlertBox('Error', 'Maximum File Size ' + FileSize + ' MB.', 5000);
                    angular.element("input[id='" + ControlName + "']").val(null);
                    return;
                }
            }
            else {

                $scope.ShowAlertBox('Error', 'Not a valid file.Please upload only [file types, e.g., doc, docx, pdf, csv, jpg, jpeg, png, excel] files.Other types will not be accepted.', 5000);

                angular.element("input[id='" + ControlName + "']").val(null);
                return;
            }

        }
        $scope.Files = $files;
        var fileUpload = document.getElementById(ControlName);
        extension = fileUpload.files[0].name;;
        $scope.uploadFiles_6(ATTACHMENT_UPLOAD_TYPE_ID, extension, ControlName);
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
    $scope.DATEINPUT_DOCUMENT_LOAD = function (index, NAME) {
        var name = NAME + index;
        var date_inputs = document.getElementsByName(name) //our date input has the name "date"
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
    $scope.nginitdoc_fn = function (_doc_list, UPLOAD_TYPE_ID, index, DATE_NAME) {
        $scope.DATEINPUT_DOCUMENT_LOAD(index, DATE_NAME);
        if (_doc_list.EXPIRY_DATE !== null && _doc_list.EXPIRY_DATE !== undefined && _doc_list.EXPIRY_DATE !== "") {
            //_doc_list.EXPIRY_DATE = $filter('date')(new Date(_doc_list.EXPIRY_DATE));
            _doc_list.EXPIRY_DATE = _doc_list.EXPIRY_DATE == null ? '' : moment(_doc_list.EXPIRY_DATE).format($scope.$parent.CONVERSION_DATE_FORMAT);
        }
    };
    $scope.RendomNumber = $scope.$parent.generaterandom(12);
    $scope.uploadFiles_6 = function (ATTACHMENT_UPLOAD_TYPE_ID, filename, ControlName) {
        if (($scope.Files != undefined && $scope.Files.length > 0)) {
            $scope.DocImageResult = [];
            var data = new FormData();
            data.append("RelativeID", ControlName + $scope.DocumentSearch.CUSTOMER_ID + $scope.DocumentSearch.USER_ID + $scope.DocumentSearch.EMPLY_PRSNL_ID + ATTACHMENT_UPLOAD_TYPE_ID + $scope.$parent.$parent.generaterandom(12));
            data.append("UPLOAD_TYPE_ID", ATTACHMENT_UPLOAD_TYPE_ID);
            data.append("VIRTUALPATH", '/CUSTOMER_ID_' + $scope.DocumentSearch.CUSTOMER_ID + '/USER_ID_/' + $scope.DocumentSearch.USER_ID + '/EMPLOYEE_ID_' + $scope.DocumentSearch.EMPLY_PRSNL_ID + '/DOCUMENT/UPLOAD_TYPE_ID_' + ATTACHMENT_UPLOAD_TYPE_ID + '/');
            data.append("UPLOAD_ID", 0);
            data.append("ORIGINAL_FILE_NAME", filename);
            data.append("USER_ID", $scope.DocumentSearch.USER_ID);
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
                    if (ATTACHMENT_UPLOAD_TYPE_ID == 44) {
                        $scope.EMP_CONTRACTS = $scope.EMP_CONTRACTS.concat(d.data);
                    }
                    else if (ATTACHMENT_UPLOAD_TYPE_ID == 45 || ATTACHMENT_UPLOAD_TYPE_ID == 48) {
                        $scope.EMP_RTW_DOCUMENTS = $scope.EMP_RTW_DOCUMENTS.concat(d.data);
                    }
                    else if (ATTACHMENT_UPLOAD_TYPE_ID == 49) {
                        $scope.HRM_ID_PROOF_LICENCE_LIST = $scope.HRM_ID_PROOF_LICENCE_LIST.concat(d.data);
                    }
                    else if (ATTACHMENT_UPLOAD_TYPE_ID == 57) {
                        $scope.HRM_ID_PAYSLIP_LIST = $scope.HRM_ID_PAYSLIP_LIST.concat(d.data);
                    }
                }
                angular.element("input[id='" + ControlName + "']").val(null);
            });
        }
    };

    $scope.HRM_INS_UPD_EMPLOYEE_DOCUMENTS = function (FLAG) {
        $scope.Documentform.submitted = true;
        if ($scope.Documentform.$valid) {
            var PosiModelObj = new Object();
            PosiModelObj.EMPLY_PRSNL_ID = $scope.DocumentSearch.EMPLY_PRSNL_ID;
            PosiModelObj.USER_ID = $cookies.get("USERID");
            PosiModelObj.HRM_EMPLOYEE_DOCUMENTS_TYPE = [];
            angular.forEach($scope.EMP_CONTRACTS, function (_loop_value) {
                var readonly = new Object();
                readonly.EMPLY_DOCUMENT_ID = _loop_value.EMPLY_DOCUMENT_ID == undefined ? 0 : _loop_value.EMPLY_DOCUMENT_ID;
                readonly.UPLOAD_TYPE_ID = 44;
                readonly.UPLOAD_ID = _loop_value.UPLOAD_ID;
                //readonly.EXPIRY_DATE = _loop_value.EXPIRY_DATE == "" || _loop_value.EXPIRY_DATE == undefined ? null : _loop_value.EXPIRY_DATE;
                readonly.EXPIRY_DATE = _loop_value.EXPIRY_DATE == "" || _loop_value.EXPIRY_DATE == undefined ? null : moment(_loop_value.EXPIRY_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).format('L');
                readonly.DELETE_FLAG = 0;///--1 FOR DELETE
                PosiModelObj.HRM_EMPLOYEE_DOCUMENTS_TYPE.push(readonly);
            });
            angular.forEach($scope.DELETE_EMP_CONTRACTS, function (_loop_value) {
                var readonly = new Object();
                readonly.EMPLY_DOCUMENT_ID = _loop_value.EMPLY_DOCUMENT_ID == undefined ? 0 : _loop_value.EMPLY_DOCUMENT_ID;
                readonly.UPLOAD_TYPE_ID = 44;
                readonly.UPLOAD_ID = _loop_value.UPLOAD_ID;
                //
                //readonly.EXPIRY_DATE = _loop_value.EXPIRY_DATE == "" || _loop_value.EXPIRY_DATE == undefined ? null : _loop_value.EXPIRY_DATE;
                readonly.EXPIRY_DATE = _loop_value.EXPIRY_DATE == "" || _loop_value.EXPIRY_DATE == undefined ? null : moment(_loop_value.EXPIRY_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).format('L');
                readonly.DELETE_FLAG = 1;///--1 FOR DELETE
                PosiModelObj.HRM_EMPLOYEE_DOCUMENTS_TYPE.push(readonly);
            });
            angular.forEach($scope.EMP_RTW_DOCUMENTS, function (_loop_value) {
                var readonly = new Object();
                readonly.EMPLY_DOCUMENT_ID = _loop_value.EMPLY_DOCUMENT_ID == undefined ? 0 : _loop_value.EMPLY_DOCUMENT_ID;
                readonly.UPLOAD_TYPE_ID = 45;
                readonly.UPLOAD_ID = _loop_value.UPLOAD_ID;
                readonly.EXPIRY_DATE = _loop_value.EXPIRY_DATE == "" || _loop_value.EXPIRY_DATE == undefined ? null : moment(_loop_value.EXPIRY_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).format('L');;
                //readonly.EXPIRY_DATE = _loop_value.EXPIRY_DATE == "" || _loop_value.EXPIRY_DATE == undefined ? null : _loop_value.EXPIRY_DATE;

                readonly.DELETE_FLAG = 0;///--1 FOR DELETE
                PosiModelObj.HRM_EMPLOYEE_DOCUMENTS_TYPE.push(readonly);
            });
            angular.forEach($scope.DELETE_EMP_RTW_DOCUMENTS, function (_loop_value) {
                var readonly = new Object();
                readonly.EMPLY_DOCUMENT_ID = _loop_value.EMPLY_DOCUMENT_ID == undefined ? 0 : _loop_value.EMPLY_DOCUMENT_ID;
                readonly.UPLOAD_TYPE_ID = 45;
                readonly.UPLOAD_ID = _loop_value.UPLOAD_ID;
                readonly.EXPIRY_DATE = _loop_value.EXPIRY_DATE == "" || _loop_value.EXPIRY_DATE == undefined ? null : moment(_loop_value.EXPIRY_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).format('L');;
                readonly.DELETE_FLAG = 1;///--1 FOR DELETE
                PosiModelObj.HRM_EMPLOYEE_DOCUMENTS_TYPE.push(readonly);
            });

            angular.forEach($scope.HRM_ID_PROOF_LICENCE_LIST, function (_loop_value) {
                var readonly = new Object();
                readonly.EMPLY_DOCUMENT_ID = _loop_value.EMPLY_DOCUMENT_ID == undefined ? 0 : _loop_value.EMPLY_DOCUMENT_ID;
                readonly.UPLOAD_TYPE_ID = 49;
                readonly.UPLOAD_ID = _loop_value.UPLOAD_ID;
                //readonly.EXPIRY_DATE = _loop_value.EXPIRY_DATE == "" || _loop_value.EXPIRY_DATE == undefined ? null : _loop_value.EXPIRY_DATE;
                readonly.EXPIRY_DATE = _loop_value.EXPIRY_DATE == "" || _loop_value.EXPIRY_DATE == undefined ? null : moment(_loop_value.EXPIRY_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).format('L');
                readonly.DELETE_FLAG = 0;///--1 FOR DELETE
                PosiModelObj.HRM_EMPLOYEE_DOCUMENTS_TYPE.push(readonly);
            });
            angular.forEach($scope.DELETE_HRM_ID_PROOF_LICENCE_LIST, function (_loop_value) {
                var readonly = new Object();
                readonly.EMPLY_DOCUMENT_ID = _loop_value.EMPLY_DOCUMENT_ID == undefined ? 0 : _loop_value.EMPLY_DOCUMENT_ID;
                readonly.UPLOAD_TYPE_ID = 49;
                readonly.UPLOAD_ID = _loop_value.UPLOAD_ID;
                //readonly.EXPIRY_DATE = _loop_value.EXPIRY_DATE == "" || _loop_value.EXPIRY_DATE == undefined ? null : _loop_value.EXPIRY_DATE;
                readonly.EXPIRY_DATE = null;
                readonly.DELETE_FLAG = 1;///--1 FOR DELETE
                PosiModelObj.HRM_EMPLOYEE_DOCUMENTS_TYPE.push(readonly);
            });

            angular.forEach($scope.HRM_ID_PAYSLIP_LIST, function (_loop_value) {
                var readonly = new Object();
                readonly.EMPLY_DOCUMENT_ID = _loop_value.EMPLY_DOCUMENT_ID == undefined ? 0 : _loop_value.EMPLY_DOCUMENT_ID;
                readonly.UPLOAD_TYPE_ID = 57;
                readonly.UPLOAD_ID = _loop_value.UPLOAD_ID;
                //readonly.EXPIRY_DATE = _loop_value.EXPIRY_DATE == "" || _loop_value.EXPIRY_DATE == undefined ? null : _loop_value.EXPIRY_DATE;
                readonly.EXPIRY_DATE = _loop_value.EXPIRY_DATE == "" || _loop_value.EXPIRY_DATE == undefined ? null : moment(_loop_value.EXPIRY_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).format('L');
                readonly.DELETE_FLAG = 0;///--1 FOR DELETE
                PosiModelObj.HRM_EMPLOYEE_DOCUMENTS_TYPE.push(readonly);
            });
            angular.forEach($scope.DELETE_HRM_ID_PAYSLIP_LIST, function (_loop_value) {
                var readonly = new Object();
                readonly.EMPLY_DOCUMENT_ID = _loop_value.EMPLY_DOCUMENT_ID == undefined ? 0 : _loop_value.EMPLY_DOCUMENT_ID;
                readonly.UPLOAD_TYPE_ID = 57;
                readonly.UPLOAD_ID = _loop_value.UPLOAD_ID;
                //readonly.EXPIRY_DATE = _loop_value.EXPIRY_DATE == "" || _loop_value.EXPIRY_DATE == undefined ? null : _loop_value.EXPIRY_DATE;
                readonly.EXPIRY_DATE = null;
                readonly.DELETE_FLAG = 1;///--1 FOR DELETE
                PosiModelObj.HRM_EMPLOYEE_DOCUMENTS_TYPE.push(readonly);
            });


            if (PosiModelObj.HRM_EMPLOYEE_DOCUMENTS_TYPE.length == 0) {
                var readonly = new Object();
                readonly.EMPLY_DOCUMENT_ID = null;
                readonly.UPLOAD_TYPE_ID = null;
                readonly.UPLOAD_ID = null;
                readonly.EXPIRY_DATE = null;
                readonly.DELETE_FLAG = null;///--1 FOR DELETE
                PosiModelObj.HRM_EMPLOYEE_DOCUMENTS_TYPE.push(readonly);
            }
            PrcCommMethods.HUMANRESOURCE_API(PosiModelObj, 'HRM_INS_UPD_EMPLOYEE_DOCUMENTS').then(function (data) {
                if (FLAG == 1) {
                    $scope.TAB_CLICK_HR_HEADER_Fn(0);
                }
                else {
                    $scope.TAB_CLICK_HR_HEADER_Fn(7, getUrlParameter('EMP_ID', $location.absUrl()));
                }
                if (FLAG != 2) {
                    $scope.$parent.ShowAlertBox("Success", 'Updated successfully', 3000);
                }

            });
        } else {
            $scope.$parent.ShowAlertBox("Attention", 'Please, fill the all mandatory field.', 3000);
        }
    }
    $scope.HRM_INS_EMPLOYEE_DOCUMENT_REQUESTS = function () {
        $scope.RequestForm.submitted = true;
        if ($scope.RequestForm.$valid) {
            var CusModelObj = new Object();
            CusModelObj.EMPLY_PRSNL_ID = $scope.DocumentSearch.EMPLY_PRSNL_ID;
            CusModelObj.DOCUMENT_REQUEST_MASTER_ID = $scope.DocumentSearch.DOCUMENT_REQUEST_MSTR_ID;
            CusModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            CusModelObj.COMMENTS = $scope.DocumentSearch.COMMENTS;
            CusModelObj.USER_ID = $cookies.get("USERID");
            PrcCommMethods.HUMANRESOURCE_API(CusModelObj, 'HRM_INS_EMPLOYEE_DOCUMENT_REQUESTS').then(function (data) {
                if (data.data > 0) {
                    $scope.$parent.ShowAlertBox("Success", 'Request send successfully', 3000);
                    $scope.RequestForm.submitted = false;
                    $scope.DocumentSearch.COMMENTS = '';
                    $scope.SELECTED_DOCUMENT_Fn('');
                    $scope.DocumentSearch.DOCUMENT_REQUEST_MSTR_ID = '';
                    $('#Request_Document').modal('hide');
                }
                if (data.data == 0) {
                    $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                }
            });
        } else {
            $scope.$parent.ShowAlertBox("Attention", 'Please, fill the all mandatory field.', 3000);
        }
    }
});
