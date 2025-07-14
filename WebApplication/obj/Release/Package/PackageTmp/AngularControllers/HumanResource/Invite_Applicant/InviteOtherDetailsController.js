app.controller('InviteOtherDetailsController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
//    $scope.$parent.DISPLAY_FLAG = false;
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(2);
    $scope.$parent.HIDE_HEADER_DETAIL = false;
    $scope.$parent.$parent.overlay_loading_HR_Loader = 'none';
    $scope.InviteOtherDetails = {
        EMPLY_PRSNL_ID: getUrlParameter('EMP_ID', $location.absUrl()),
        CUSTOMER_ID: getUrlParameter('CUS_ID', $location.absUrl()), 
        ENTITY_ID: null,
        MODULE_ID: $cookies.get("MODULE_ID"),
        USER_ID: 1,//$cookies.get("USERID"),
        DD_DEFAULT_TEXT: $scope.$parent.DD_DEFAULT_TEXT,
        STARTER_DECLARATION_ID: '',
        CUSTOM_DECLARATION_NAME: $scope.$parent.DD_DEFAULT_TEXT,
        CUSTOM_DOCUMENT_NAME: $scope.$parent.DD_DEFAULT_TEXT,
        CUSTOM_STUDENT_LOAN_NAME: $scope.$parent.DD_DEFAULT_TEXT,
        STUDENT_LOAN_TYPE: 0,
    };

    $scope.DOCUMENT_TYPE_LIST = [
        { DOCUMENT_ID: 1, DOCUMENT_NAME: 'Passport', DOCUMENT_TYPE: 'HRM_RTW_DOCUMENTS', UPLOAD_TYPE_ID: 45, UPLOADS_LIST: [] },
        { DOCUMENT_ID: 2, DOCUMENT_NAME: 'Driving Licence', DOCUMENT_TYPE: 'HRM_ID_PROOF_LICENCE', UPLOAD_TYPE_ID: 49, UPLOADS_LIST: [] },
        { DOCUMENT_ID: 3, DOCUMENT_NAME: 'Work Permit', DOCUMENT_TYPE: 'HRM_RTW_DOCUMENTS', UPLOAD_TYPE_ID: 48, UPLOADS_LIST: [] },
    ];

    //$scope.STUDENT_LOAN_LIST = [
    //    { STUDENT_LOAN_MASTER_ID: 1, STUDENT_LOAN_NAME: 'Plan-1' },
    //    { STUDENT_LOAN_MASTER_ID: 2, STUDENT_LOAN_NAME: 'Plan-2' },
    //    { STUDENT_LOAN_MASTER_ID: 3, STUDENT_LOAN_NAME: 'Plan-3' },
    //    { STUDENT_LOAN_MASTER_ID: 4, STUDENT_LOAN_NAME: 'Plan-4' },
    //    { STUDENT_LOAN_MASTER_ID: 5, STUDENT_LOAN_NAME: 'Plan-5' },
    //    { STUDENT_LOAN_MASTER_ID: 6, STUDENT_LOAN_NAME: 'Postgraduation Loan' }
    //];

    $scope.INVITE_APPLICANT_HEADER = {
        ONBOARDING_STEP: 1,
        ACTIVE_TAB_ID: 3,
    }
    $scope.HRM_GET_STUDENT_LOAN_PLAN = function () {
        var UserModelObj = new Object();
        UserModelObj.COUNTRY_ID = $scope.InviteOtherDetails.COUNTRY_ID;
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'HRM_GET_STUDENT_LOAN_PLAN').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.STUDENT_LOAN_LIST = data.data.Table;
                if ($scope.InviteOtherDetails.STUDENT_LOAN_MASTER_ID > 0) {
                    var result = $scope.STUDENT_LOAN_LIST.filter(function (x) { return x.STUDENT_LOAN_MASTER_ID == $scope.InviteOtherDetails.STUDENT_LOAN_MASTER_ID });
                    if (result.length > 0) {
                        $scope.SELECTED_STUDENT_LOAN_Fn(result[0]);
                    }
                }
            }

        });
    }
    $scope.HRM_GET_EMPLOYEE_DECLARATION = function () {
        var OtherDetailsObject = new Object();
        OtherDetailsObject.CUSTOMER_ID = $scope.InviteOtherDetails.CUSTOMER_ID;
        OtherDetailsObject.COUNTRY_ID = $scope.InviteOtherDetails.COUNTRY_ID;
        PrcCommMethods.HUMANRESOURCE_API(OtherDetailsObject, 'HRM_GET_EMPLOYEE_DECLARATION').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.EMPLOYEE_DECLARATION_DROPDOWN = data.data.Table;
            }
            else if (data.data == 0) {
                $scope.EMPLOYEE_DECLARATION_DROPDOWN = [];
            }
        });
    };

    $scope.HRM_GET_EMPLOYEE_STEP = function () {
        var contactdetailsobj = new Object()
        contactdetailsobj.EMPLY_PRSNL_ID = $scope.InviteOtherDetails.EMPLY_PRSNL_ID;
        contactdetailsobj.CUSTOMER_ID = $scope.InviteOtherDetails.CUSTOMER_ID;
        PrcCommMethods.HUMANRESOURCE_API(contactdetailsobj, 'HRM_GET_EMPLOYEE_STEP').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.EMPLOYEE_STEP = data.data.Table[0];
                if ($scope.EMPLOYEE_STEP.ONBOARDING_STEP == null || $scope.EMPLOYEE_STEP.ONBOARDING_STEP == undefined || $scope.EMPLOYEE_STEP.ONBOARDING_STEP == 0) {
                    $scope.INVITE_APPLICANT_HEADER.ONBOARDING_STEP = 1;
                    $scope.INVITE_APPLICANT_HEADER.ACTIVE_TAB_ID = 1;
                    $scope.NEXT_Fn(1);
                } else {
                    $scope.INVITE_APPLICANT_HEADER.ONBOARDING_STEP = $scope.EMPLOYEE_STEP.ONBOARDING_STEP;
                }
            };
        });
    };
    $scope.HRM_GET_ONBOARDING_STEP_2 = function () {
        var UserModelObj = new Object();
        UserModelObj.EMPLY_PRSNL_ID = $scope.InviteOtherDetails.EMPLY_PRSNL_ID;
        UserModelObj.CUSTOMER_ID = $scope.InviteOtherDetails.CUSTOMER_ID;
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'HRM_GET_ONBOARDING_STEP_2').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.InviteOtherDetails.COUNTRY_ID = data.data.Table[0].COUNTRY_ID;
                $scope.HRM_GET_STUDENT_LOAN_PLAN();
            }
        });
    };
    $scope.HRM_GET_ONBOARDING_STEP_3 = function () {
        var UserModelObj = new Object();
        UserModelObj.EMPLY_PRSNL_ID = $scope.InviteOtherDetails.EMPLY_PRSNL_ID;
        UserModelObj.CUSTOMER_ID = $scope.InviteOtherDetails.CUSTOMER_ID;
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'HRM_GET_ONBOARDING_STEP_3').then(function (data) {
            if (data.data.Table.length > 0) {
                let RESULT_PERSNL = data.data.Table[0];
                angular.forEach($scope.DOCUMENT_TYPE_LIST, function (_loop_value) {
                    _loop_value.UPLOADS_LIST = data.data.Table1.filter(function (x) { return x.UPLOAD_TYPE_ID == _loop_value.UPLOAD_TYPE_ID });
                });

                $scope.STEP_NO = RESULT_PERSNL.STEP_NO;
                $scope.InviteOtherDetails.STARTER_DECLARATION_ID = RESULT_PERSNL.STARTER_DECLARATION_ID || '';
                $scope.InviteOtherDetails.CUSTOM_DECLARATION_NAME = RESULT_PERSNL.DECLARATION_NAME || $scope.InviteOtherDetails.DD_DEFAULT_TEXT;
                $scope.InviteOtherDetails.STUDENT_LOAN_TYPE = RESULT_PERSNL.STUDENT_LOAN_TYPE;
                
                $scope.InviteOtherDetails.STUDENT_LOAN_MASTER_ID = RESULT_PERSNL.STUDENT_LOAN_MASTER_ID || '';
                $scope.HRM_GET_ONBOARDING_STEP_2();
            }
            else {
                $scope.HRM_GET_ONBOARDING_STEP_2();
            }
        });
    };

    $scope.HRM_INS_UPD_ONBOARDING_STEP_3 = function (FLAG) {
        $scope.InviteOtherDetailsForm.submitted = true;
        if ($scope.InviteOtherDetailsForm.$valid) {
            var otherDetailsObject = new Object()
            otherDetailsObject.EMPLY_PRSNL_ID = $scope.InviteOtherDetails.EMPLY_PRSNL_ID;
            otherDetailsObject.ENTITY_ID = $scope.InviteOtherDetails.ENTITY_ID;
            otherDetailsObject.CUSTOMER_ID = $scope.InviteOtherDetails.CUSTOMER_ID;
            otherDetailsObject.USER_ID = $scope.InviteOtherDetails.USER_ID;
            otherDetailsObject.STARTER_DECLARATION_ID = $scope.InviteOtherDetails.STARTER_DECLARATION_ID;
            otherDetailsObject.STUDENT_LOAN_MASTER_ID = $scope.InviteOtherDetails.STUDENT_LOAN_MASTER_ID;
            otherDetailsObject.STUDENT_LOAN = $scope.InviteOtherDetails.STUDENT_LOAN_TYPE;
            otherDetailsObject.HRM_EMPLOYEE_DOCUMENTS_TYPE = [];
            angular.forEach($scope.DOCUMENT_TYPE_LIST, function (_loop_value) {
                if (_loop_value.UPLOADS_LIST.length > 0) {
                    var readonly = new Object();
                    if (_loop_value.UPLOADS_LIST.length > 0) {
                        readonly.EMPLY_DOCUMENT_ID = _loop_value.UPLOADS_LIST[0].EMPLY_DOCUMENT_ID == undefined || _loop_value.UPLOADS_LIST[0].EMPLY_DOCUMENT_ID == null || _loop_value.UPLOADS_LIST[0].EMPLY_DOCUMENT_ID == "" ? 0 : _loop_value.UPLOADS_LIST[0].EMPLY_DOCUMENT_ID
                    }
                    else {
                        readonly.EMPLY_DOCUMENT_ID = 0;
                    }
                    readonly.UPLOAD_TYPE_ID = _loop_value.UPLOAD_TYPE_ID;
                    readonly.UPLOAD_ID = _loop_value.UPLOADS_LIST != undefined || _loop_value.UPLOADS_LIST != null || _loop_value.UPLOADS_LIST != "" ? _loop_value.UPLOADS_LIST[0].UPLOAD_ID: 0 ;
                    readonly.EXPIRY_DATE = null;
                    readonly.DELETE_FLAG = 0;///--1 FOR DELETE
                    otherDetailsObject.HRM_EMPLOYEE_DOCUMENTS_TYPE.push(readonly);
                }
            });
            angular.forEach($scope.DELETE_DOCUMENT_TYPE_LIST, function (_loop_value) {
                var readonly = new Object();
                if (_loop_value.UPLOADS_LIST.length > 0) {
                    readonly.EMPLY_DOCUMENT_ID = _loop_value.UPLOADS_LIST[0].EMPLY_DOCUMENT_ID == undefined || _loop_value.UPLOADS_LIST[0].EMPLY_DOCUMENT_ID == null || _loop_value.UPLOADS_LIST[0].EMPLY_DOCUMENT_ID == "" ? 0 : _loop_value.UPLOADS_LIST[0].EMPLY_DOCUMENT_ID
                }
                else {
                    readonly.EMPLY_DOCUMENT_ID = 0;
                }
                readonly.UPLOAD_TYPE_ID = _loop_value.UPLOAD_TYPE_ID;
                readonly.UPLOAD_ID = _loop_value.UPLOADS_LIST != undefined || _loop_value.UPLOADS_LIST != null || _loop_value.UPLOADS_LIST != "" && _loop_value.UPLOADS_LIST.length > 0 ? _loop_value.UPLOADS_LIST[0].UPLOAD_ID : 0;
                readonly.EXPIRY_DATE = null;
                readonly.DELETE_FLAG = 1;///--1 FOR DELETE
                otherDetailsObject.HRM_EMPLOYEE_DOCUMENTS_TYPE.push(readonly);
            });
            if (otherDetailsObject.HRM_EMPLOYEE_DOCUMENTS_TYPE.length == 0) {
                var readonly = new Object();
                readonly.EMPLY_DOCUMENT_ID = null
                readonly.UPLOAD_TYPE_ID = null;
                readonly.UPLOAD_ID = null;
                readonly.EXPIRY_DATE = null;
                readonly.DELETE_FLAG = null
                otherDetailsObject.HRM_EMPLOYEE_DOCUMENTS_TYPE.push(readonly);
            }
            PrcCommMethods.HUMANRESOURCE_API(otherDetailsObject, 'HRM_INS_UPD_ONBOARDING_STEP_3').then(function (data) {
                if (data.data > 0) {
                    $scope.$parent.ShowAlertBox("Success", 'Data submitted successfully.', 3000);
                    $scope.NEXT_Fn(FLAG, 3);
                }
                if (data.data == 0) {
                    $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                }
            });
        } else {
            $scope.$parent.ShowAlertBox("Attention", $scope.$parent.MANDATORY_MSG, 3000);
        }
    }
    $scope.SELECTED_DECLARATION_Fn = function (declaration) {
        if (declaration == '') {
            $scope.InviteOtherDetails.CUSTOM_DECLARATION_NAME = $scope.InviteOtherDetails.DD_DEFAULT_TEXT;
            $scope.InviteOtherDetails.STARTER_DECLARATION_ID = '';
        } else {
            $scope.InviteOtherDetails.CUSTOM_DECLARATION_NAME = declaration.DECLARATION_NAME;
            $scope.InviteOtherDetails.STARTER_DECLARATION_ID = declaration.STARTER_DECLARATION_ID;
        }
    };
    $scope.SELECTED_DOCUMENT_Fn = function (document) {
        if (document == '') {
            $scope.InviteOtherDetails.CUSTOM_DOCUMENT_NAME = $scope.InviteOtherDetails.DD_DEFAULT_TEXT;
            $scope.InviteOtherDetails.DOCUMENT_ID = '';
        } else {
            $scope.InviteOtherDetails.CUSTOM_DOCUMENT_NAME = document.DOCUMENT_NAME;
            $scope.InviteOtherDetails.DOCUMENT_ID = document.DOCUMENT_ID;
        }
    };
    $scope.SELECTED_STUDENT_LOAN_Fn = function (_loan) {
        if (_loan == '') {
            $scope.InviteOtherDetails.CUSTOM_STUDENT_LOAN_NAME = $scope.InviteOtherDetails.DD_DEFAULT_TEXT;
            $scope.InviteOtherDetails.STUDENT_LOAN_MASTER_ID = '';
        } else {
            $scope.InviteOtherDetails.CUSTOM_STUDENT_LOAN_NAME = _loan.STUDENT_LOAN_PLAN;
            $scope.InviteOtherDetails.STUDENT_LOAN_MASTER_ID = _loan.STUDENT_LOAN_MASTER_ID;
        }
    };

    $scope.NEXT_Fn = function (_page_flag, current_page = 0) {
        if ($scope.EMPLOYEE_STEP.ONBOARDING_STEP >= _page_flag - 1 || current_page + 1 >= _page_flag) {
            $scope.INVITE_APPLICANT_HEADER.ACTIVE_TAB_ID = _page_flag;
            switch (_page_flag) {
                case 1:
                    $location.path("Invite_Personal_Details").search("CUS_ID", getUrlParameter('CUS_ID', $location.absUrl())).search("EMP_ID", getUrlParameter('EMP_ID', $location.absUrl()));
                    break;
                case 2:
                    $location.path("Invite_Contact_Details").search("CUS_ID", getUrlParameter('CUS_ID', $location.absUrl())).search("EMP_ID", getUrlParameter('EMP_ID', $location.absUrl()));
                    break;
                case 3:
                    $location.path("Invite_Other_Details").search("CUS_ID", getUrlParameter('CUS_ID', $location.absUrl())).search("EMP_ID", getUrlParameter('EMP_ID', $location.absUrl()));
                    break;
                case 4:
                    $location.path("Invite_Emergency_Contact").search("CUS_ID", getUrlParameter('CUS_ID', $location.absUrl())).search("EMP_ID", getUrlParameter('EMP_ID', $location.absUrl()));
                    break;
                case 5:
                    $location.path("Invite_Payment_Details").search("CUS_ID", getUrlParameter('CUS_ID', $location.absUrl())).search("EMP_ID", getUrlParameter('EMP_ID', $location.absUrl()));
                    break;
                default:
                    $location.path("#").search("CUS_ID", getUrlParameter('CUS_ID', $location.absUrl())).search("EMP_ID", getUrlParameter('EMP_ID', $location.absUrl()));   }
        } else {
            alert("Please complete each step in order before proceeding!");
        }
    };
    //44	HRM Contracts
    //45	HRM RTW Passport
    //48	HRM RTW Workpermit
    //49	HRM ID Proof licence
    $scope.GET_UPLOADS = function (Attachment_UPLOAD_TYPE_ID) {
        var PosiModelObj = new Object();
        PosiModelObj.RELATIVE_ID = $scope.InviteOtherDetails.EMPLY_PRSNL_ID;
        PosiModelObj.UPLOAD_TYPE_ID = Attachment_UPLOAD_TYPE_ID;
        PosiModelObj.VIRTUALPATH = '';
        PosiModelObj.TABLE_ID = -1;
        PosiModelObj.ORIGINAL_FILE_NAME = '';
        PosiModelObj.USER_ID = $scope.InviteOtherDetails.USER_ID
        PrcCommMethods.PAYROLL_API(PosiModelObj, 'GET_UPLOADS').then(function (data) {
            if (data.data.Table.length > 0) {
                if (Attachment_UPLOAD_TYPE_ID == 45) {
                    $scope.DOCUMENT_TYPE_LIST[0].UPLOADS_LIST = data.data.Table;
                }
                else if (Attachment_UPLOAD_TYPE_ID == 48 || Attachment_UPLOAD_TYPE_ID == 48) {
                    $scope.DOCUMENT_TYPE_LIST[2].UPLOADS_LIST = data.data.Table;
                }
                else if (Attachment_UPLOAD_TYPE_ID == 49) {
                    $scope.DOCUMENT_TYPE_LIST[1].UPLOADS_LIST = data.data.Table;
                }
            }
        });
    };
    // $scope.GET_UPLOADS(44); old


    //$scope.GET_UPLOADS(45); //HRM RTW Passport
    //$scope.GET_UPLOADS(48);
    //$scope.GET_UPLOADS(49);

    $scope.getTheFilesToUpload_6 = function ($files, _document, FileSize, ATTACHMENT_UPLOAD_TYPE_ID) {
        if (FileSize == undefined || FileSize == null || FileSize == 0 || FileSize == '') {
            FileSize = AppVal.FileSize;
        }
        $scope.imagesrc = [];
        var valid = 0;
        for (var i = 0; i < $files.length; i++) {
            var validFormats = ['doc', 'docx', 'pdf', 'csv', 'jpg', 'jpeg', 'png', 'excel'];
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
                    angular.element("input[id='" + _document.DOCUMENT_TYPE + "']").val(null);
                    return;
                }
            }
            else {

                $scope.ShowAlertBox('Error', 'Not a valid file.Please upload only [file types, e.g., doc, docx, pdf, csv, jpg, jpeg, png, excel] files.Other types will not be accepted.', 5000);

                angular.element("input[id='" + _document.DOCUMENT_TYPE + "']").val(null);
                return;
            }

        }
        $scope.Files = $files;
        var fileUpload = document.getElementById(_document.DOCUMENT_TYPE);
        extension = $scope.Files[0].name;
        $scope.uploadFiles_6(_document.UPLOAD_TYPE_ID, extension, _document);
    };

    $scope.uploadFiles_6 = function (ATTACHMENT_UPLOAD_TYPE_ID, filename, _document) {
        if (($scope.Files != undefined && $scope.Files.length > 0)) {
            $scope.DocImageResult = [];
            var data = new FormData();
            data.append("RelativeID", ATTACHMENT_UPLOAD_TYPE_ID + $scope.$parent.$parent.generaterandom(12) + $scope.InviteOtherDetails.CUSTOMER_ID + $scope.InviteOtherDetails.USER_ID + $scope.InviteOtherDetails.EMPLY_PRSNL_ID);
            data.append("UPLOAD_TYPE_ID", ATTACHMENT_UPLOAD_TYPE_ID);
            data.append("VIRTUALPATH", '/CUSTOMER_ID_' + $scope.InviteOtherDetails.CUSTOMER_ID + '/USER_ID_/' + $scope.InviteOtherDetails.USER_ID + '/EMPLOYEE_ID_' + $scope.InviteOtherDetails.EMPLY_PRSNL_ID + '/DOCUMENT/UPLOAD_TYPE_ID_' + ATTACHMENT_UPLOAD_TYPE_ID + '/');
            data.append("UPLOAD_ID", 0);
            data.append("ORIGINAL_FILE_NAME", filename);
            data.append("USER_ID", $scope.InviteOtherDetails.USER_ID);
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
                    _document.UPLOADS_LIST = d.data;
                    //if (ATTACHMENT_UPLOAD_TYPE_ID == 44) {
                    //    $scope.EMP_CONTRACTS = d.data;
                    //}
                    //else if (ATTACHMENT_UPLOAD_TYPE_ID == 45 || ATTACHMENT_UPLOAD_TYPE_ID == 48) {
                    //    $scope.EMP_RTW_DOCUMENTS = d.data;
                    //}
                    //else if (ATTACHMENT_UPLOAD_TYPE_ID == 49) {
                    //    $scope.HRM_ID_PROOF_LICENCE_LIST = d.data;
                    //}
                }

                angular.element("input[id='" + _document.DOCUMENT_TYPE + "']").val(null);
            });
        }
    };
    $scope.DELETE_DOCUMENT_TYPE_LIST = [];
    $scope.REMOVE_UPLOAD_Fn = function (_document, _upload, index) {
        //$scope.DOCUMENT_TYPE_LIST.map(function (item) {
        //    if (item.DOCUMENT_ID == _document.DOCUMENT_ID) {
        //        //$scope.DELETE_UPLOAD_ALL(item.UPLOADS_LIST, item.UPLOADS_LIST[index], index);
        //    }
        //});

        $scope.DELETE_DOCUMENT_TYPE_LIST.push(angular.copy(_document));
        $scope.DOCUMENT_TYPE_LIST[_document.INDEX].UPLOADS_LIST = [];
    };

    $scope.DELETE_UPLOAD_ALL = function (items, item, index) {
        if (confirm('Are you sure you want to delete the file?')) {
            var CashupModelObj = new Object();
            CashupModelObj.ID = item.UPLOAD_ID;
            PrcCommMethods.CASHUP_API(CashupModelObj, 'DELETE_UPLOAD').then(function (data) {
                $scope.$parent.ShowAlertBox('Success', 'Deleted Successfully', 5000);
                items.splice(index, 1);
                $scope.GET_UPLOADS(45);
                $scope.GET_UPLOADS(48);
                $scope.GET_UPLOADS(49);
            });
        }
    };

    $scope.PAGE_LOAD = 0;


    $scope.HRM_GET_EMPLOYEE_DETAILS_BY_PASSKEY = function () {
        var personaldetailobj = new Object()
        personaldetailobj.PASSKEY = getUrlParameter('passkey', $location.absUrl());
        PrcCommMethods.HUMANRESOURCE_API(personaldetailobj, 'HRM_GET_EMPLOYEE_DETAILS_BY_PASSKEY').then(function (data) {
            if (data.data.Table.length > 0) {
                $location.path("Invite_Other_Details").search("CUS_ID", data.data.Table[0].CUSTOMER_ID).search("EMP_ID", data.data.Table[0].EMPLY_PRSNL_ID);
                $scope.HRM_GET_EMPLOYEE_STEP();
                $scope.HRM_GET_EMPLOYEE_DECLARATION();
                $scope.HRM_GET_ONBOARDING_STEP_3();
            }
        });
    }

    $scope.VALIDATE_PASS_KEY = function () {
        var UserModelObj = new Object();
        UserModelObj.PassKey = getUrlParameter('passkey', $location.absUrl());
        UserModelObj.ID = 0;
        UserModelObj.FLAG = 3;
        var httprequest = $http({
            method: 'POST',
            url: CommService.Get_CASHUP_API() + 'api/LoginAPI/VALIDATE_PASS_KEY',
            data: UserModelObj
        }).then(function (data) {
            if (data.data.Table.length > 0) {
                if (data.data.Table[0].SUCCESS == 1) {
                    $scope.LINK_EXPIRE_FLAG = true;
                    $scope.HRM_GET_EMPLOYEE_DETAILS_BY_PASSKEY();
                }
                if (data.data.Table[0].SUCCESS == 0) {
                    $scope.LINK_EXPIRE_FLAG = false;
                }
                $scope.PAGE_LOAD = 1;
            }
        });
    };
    $scope.VALIDATE_PASS_KEY();

});