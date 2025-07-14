app.controller('ResourcesInfoController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.RedirectToHtml_FY = function (FLAG) {
        $location.path(FLAG);
    }
    $scope.RedirectToHtml = function (FLAG) {
        switch (FLAG) {
            case 1:
                $location.path('Scanning_Process');
                break;
            case 2:
                $location.path('blog_des');
                //  $window.location.href = "../Resources/ResourcesIndex#!/Scanning_Process";
                break;
            case 3:
                $location.path('Approval_Max');
                //$window.location.href = "../Resources/ResourcesIndex#!/Resources";
                break;
            case 4:
                $location.path('Telleroo');
                //$window.location.href = "../Resources/ResourcesIndex#!/Resources";
                break;
            case 5:
                $location.path('Process_Documents');
                //$window.location.href = "../Resources/ResourcesIndex#!/Resources";
                break;
            case 6:
                $location.path('Wefyle_User_Manual');
                //$window.location.href = "../Resources/ResourcesIndex#!/Resources";
                break;
            case 7:
                $location.path('Cash_Up_User_Manual');
                //$window.location.href = "../Resources/ResourcesIndex#!/Resources";
                break;
            case 8:
                $location.path('autoentry');
                //$window.location.href = "../Resources/ResourcesIndex#!/Resources";
                break;
            case 9:
                $location.path('Employee_Onboard_Guide');
                //$window.location.href = "../Resources/ResourcesIndex#!/Resources";
                break;
            case 10:
                $location.path('Cash_Handling');
                //$window.location.href = "../Resources/ResourcesIndex#!/Resources";
                break;
            case 11:
                $location.path('Client_Onboarding_Checklist');
                //$window.location.href = "../Resources/ResourcesIndex#!/Resources";
                break;
            case 12:
                $location.path('Resources');
                $window.location.href = "../Resources/ResourcesIndex#!/Resources";
                break;
            default:
                CUSTOM_FIELD.PATTERN_VALIDATION = '';
                break;
        }
    }
    $scope.RESOURCE_LIST = [];
    $scope.RESOURCE_SEARCH = {}
    $scope.RESOURCE_SEARCH.RESOURCE_TILE_ID = parseInt(getUrlParameter('TITLE_ID', $location.absUrl()));
    $scope.TAGS_LPAGE_LIST = [{ ID: 1, NAME: 'HTML' }, { ID: 2, NAME: 'SVG' }];
    $scope.IS_ADD_EDIT_FLAG_PRIVEILAGE = false;

    if ($scope.RESOURCE_SEARCH.RESOURCE_TILE_ID > 0) {
        if ($scope.$parent.CHECK_MODULE_ACCESS(41, 3)) {
            $scope.IS_ADD_EDIT_FLAG_PRIVEILAGE = true;
        }

    } else {
        if ($scope.$parent.CHECK_MODULE_ACCESS(41, 2)) {
            $scope.IS_ADD_EDIT_FLAG_PRIVEILAGE = true;
        }
    };
    $scope.INS_UPD_RESOURCE_TILES = function (FLAG) {

        let value = document.getElementById("IMAGE_SRC").getAttribute("src");
        if (value == "#" || value == "" || value == null || value == undefined) {
            $scope.IS_IMG_VALID = true;
        }
        $scope.ResourceForm.submitted = true;
        if ($scope.ResourceForm.$valid && (value != '#' && value != "" && value != null && value != undefined)) {
            $scope.IS_IMG_VALID = false;
            var ModelObj = new Object();
            ModelObj.RESOURCE_TILE_ID = $scope.RESOURCE_SEARCH.RESOURCE_TILE_ID;
            ModelObj.TITLE = $scope.RESOURCE_SEARCH.TITLE;
            ModelObj.DESCRIPTION = $scope.RESOURCE_SEARCH.DESCRIPTION;
            ModelObj.IMAGE = $scope.RESOURCE_SEARCH.IMAGE;
            let result = $scope.RESOURCE_SEARCH.PAGE.replace(".html", "");
            ModelObj.PAGE = result;
            ModelObj.PAGE_TYPE = $scope.RESOURCE_SEARCH.PAGE_TYPE;
            ModelObj.DISPLAY_ORDER = $scope.RESOURCE_SEARCH.DISPLAY_ORDER;
            ModelObj.TAG_IDS = $scope.RESOURCE_SEARCH.TAG_ID;
            ModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
            ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            ModelObj.BRANCH_ID = $scope.RESOURCE_SEARCH.BRANCH_ID;
            ModelObj.ACTIVE = 1;//$scope.RESOURCE_SEARCH.ACTIVE ? 1 : 0;
            ModelObj.USER_ID = parseInt($cookies.get("USERID"));
            ModelObj.DISPLAY_DATE = $scope.RESOURCE_SEARCH.DISPLAY_DATE;
            PrcCommMethods.HR_API(ModelObj, 'INS_UPD_RESOURCE_TILES').then(function (data) {
                if (data.data >= 1) {
                    if ($scope.RESOURCE_SEARCH.RESOURCE_TILE_ID > 0) {
                        $scope.ShowAlert('Success', 'Edit Successfully', 5000);
                    } else {
                        $scope.ShowAlert('Success', 'Added Successfully', 5000);
                        $scope.RESET_RES();
                    };
                    if (FLAG == 2) {
                        $location.path('Resources');
                    }
                }
                if (data.data == 0) {
                    $scope.$parent.ShowAlert('Error', $scope.$parent.SOMETHINGWENTWRONG, 5000);
                };
            });
        }

    };

    $scope.DELETE_INS_UPD_RESOURCE_TILES = function (FLAG) {
        if (confirm('Are you sure, you want to delete?')) {
            let value = document.getElementById("IMAGE_SRC").getAttribute("src");
            if (value == "#" || value == "" || value == null || value == undefined) {
                $scope.IS_IMG_VALID = true;
            }
            $scope.ResourceForm.submitted = true;
            if ($scope.ResourceForm.$valid && (value != '#' && value != "" && value != null && value != undefined)) {
                $scope.IS_IMG_VALID = false;
                var ModelObj = new Object();
                ModelObj.RESOURCE_TILE_ID = $scope.RESOURCE_SEARCH.RESOURCE_TILE_ID;
                ModelObj.TITLE = $scope.RESOURCE_SEARCH.TITLE;
                ModelObj.DESCRIPTION = $scope.RESOURCE_SEARCH.DESCRIPTION;
                ModelObj.IMAGE = $scope.RESOURCE_SEARCH.IMAGE;
                let result = $scope.RESOURCE_SEARCH.PAGE.replace(".html", "");
                ModelObj.PAGE = result;
                ModelObj.PAGE_TYPE = $scope.RESOURCE_SEARCH.PAGE_TYPE;
                ModelObj.DISPLAY_ORDER = $scope.RESOURCE_SEARCH.DISPLAY_ORDER;
                ModelObj.TAG_IDS = $scope.RESOURCE_SEARCH.TAG_ID;
                ModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
                ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
                ModelObj.BRANCH_ID = $scope.RESOURCE_SEARCH.BRANCH_ID;
                ModelObj.ACTIVE = 0;//$scope.RESOURCE_SEARCH.ACTIVE ? 1 : 0;
                ModelObj.USER_ID = parseInt($cookies.get("USERID"));
                ModelObj.DISPLAY_DATE = $scope.RESOURCE_SEARCH.DISPLAY_DATE;
                PrcCommMethods.HR_API(ModelObj, 'INS_UPD_RESOURCE_TILES').then(function (data) {
                    if (data.data >= 1) {
                        $scope.ShowAlert('Success', 'Deleted Successfully', 5000);
                        if ($scope.RESOURCE_SEARCH.RESOURCE_TILE_ID > 0) { } else { $scope.RESET_RES(); };
                        if (FLAG == 2) { $location.path('Resources'); }
                    }
                    if (data.data == 0) {
                        $scope.$parent.ShowAlert('Error', $scope.$parent.SOMETHINGWENTWRONG, 5000);
                    };
                });
            }
        }
    };




    //$scope.IS_EDIT_RESOURCES = $scope.$parent.GET_ENTITY_SETTINGS(50)[0].SETTING_VALUE;
    //alert($scope.IS_EDIT_RESOURCES)
    $scope.GET_RESOURCE_TILES_BY_ID = function () {
        $scope.$parent.overlay_loadingNew = 'block';
        var ModelObj = new Object();
        ModelObj.SEARCH_TEXT = '';
        ModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        ModelObj.BRANCH_ID = 0;
        ModelObj.RESOURCE_TILE_ID = $scope.RESOURCE_SEARCH.RESOURCE_TILE_ID;
        PrcCommMethods.HR_API(ModelObj, 'GET_RESOURCE_TILES').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.RESOURCE_SEARCH.DESCRIPTION = data.data.Table[0].DESCRIPTION;
                $scope.RESOURCE_SEARCH.DISPLAY_ORDER = data.data.Table[0].DISPLAY_ORDER;
                $scope.RESOURCE_SEARCH.IMAGE = data.data.Table[0].IMAGE;
                $scope.RESOURCE_SEARCH.PAGE_TYPE = data.data.Table[0].PAGE_TYPE;
                $scope.RESOURCE_SEARCH.RESOURCE_TILE_ID = data.data.Table[0].RESOURCE_TILE_ID;
                $scope.RESOURCE_SEARCH.TAG_ID = parseInt(data.data.Table[0].TAG_IDS);
                $scope.RESOURCE_SEARCH.TAG_NAMES = data.data.Table[0].TAG_NAMES;
                $scope.RESOURCE_SEARCH.TITLE = data.data.Table[0].TITLE;
                $scope.RESOURCE_SEARCH.DISPLAY_DATE = data.data.Table[0].DISPLAY_DATE;
                $scope.RESOURCE_SEARCH.PAGE = data.data.Table[0].PAGE;
                $scope.RESOURCE_SEARCH.BRANCH_ID = data.data.Table[0].BRANCH_ID;
                $scope.RESOURCE_SEARCH.ACTIVE = data.data.Table[0].ACTIVE == 1 ? true : false;

                $('.image-upload-wrap').hide();
                $('.file-upload-image').attr('src', data.data.Table[0].IMAGE);
                $('.file-upload-content').show();
                $('.image-title').html('Test');
                $scope.$parent.overlay_loadingNew = 'none';

            }
        });
    };
    $scope.TEXT_EDIT = 'Add New';
    if ($scope.RESOURCE_SEARCH.RESOURCE_TILE_ID > 0) {
        $scope.TEXT_EDIT = 'Edit';
        $scope.GET_RESOURCE_TILES_BY_ID();
    }
    $scope.GET_RESOURCE_TILES = function () {
        $scope.$parent.overlay_loadingNew = 'block';
        //if (FLAG == '1') {
        $scope.RESOURCE_LIST = [];
        //    $scope.RESOURCE_SEARCH.PAGE_NO = 1;
        //}
        var ModelObj = new Object();
        ModelObj.SEARCH_TEXT = $scope.RESOURCE_SEARCH.SEARCH_TEXT;
        ModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        ModelObj.BRANCH_ID = 0;
        ModelObj.TAGS_ID = $scope.RESOURCE_SEARCH.SEARCH_TAG_ID;
        PrcCommMethods.HR_API(ModelObj, 'GET_RESOURCE_TILES').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.$parent.overlay_loadingNew = 'none';
                $scope.RESOURCE_LIST = data.data.Table;
                //if (data.data.Table.length < $scope.RESOURCE_SEARCH.PAGE_SIZE) {
                //    $scope.GetDataR = false;
                //}
                //else {
                //    $scope.RESOURCE_SEARCH.PAGE_NO = parseInt($scope.RESOURCE_SEARCH.PAGE_NO) + 1;
                //    $scope.GetDataR = true;
                //}

            }
            else {
                //if ($scope.RESOURCE_LIST.length == 0) { }
                //   $scope.GetDataR = false;
                $scope.$parent.overlay_loadingNew = 'none';
            }
        });
    };
    $scope.RESET_RES = function () {
        $scope.RESOURCE_SEARCH = {};
        $scope.ResourceForm.submitted = false;
        $scope.RESOURCE_SEARCH.RESOURCE_TILE_ID = getUrlParameter('TITLE_ID', $location.absUrl());
        $('.file-upload-input').replaceWith($('.file-upload-input').clone());
        $('.file-upload-content').hide();
        $('.image-upload-wrap').show();
        $('.image-upload-wrap').bind('dragover', function () {
            $('.image-upload-wrap').addClass('image-dropping');
        });
        $('.image-upload-wrap').bind('dragleave', function () {
            $('.image-upload-wrap').removeClass('image-dropping');
        })
    }
    $scope.getTheFilesToUploadimage = function ($files, FileSize) {
        if ($files.length == 0) {
            $scope.FilesImg = [];
        }
        else {
            if (FileSize == undefined || FileSize == null || FileSize == 0 || FileSize == '') {
                FileSize = AppVal.FileSize;
            }
            $scope.imagesrc = [];
            var valid = 0;
            for (var i = 0; i < $files.length; i++) {
                var validFormats = ['jpg', 'jpeg', 'png'];
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
            $scope.FilesImg = $files;
            $scope.uploadFiles_Img()
        }
    }
    $scope.uploadFiles_Img = function () {
        if (($scope.FilesImg != undefined && $scope.FilesImg.length > 0)) {
            var data = new FormData();
            data.append("FILE_PATH", "/" + parseInt($cookies.get("ENTITY_ID")) + "/Resources/");
            for (var i in $scope.FilesImg) {
                data.append("uploadedFile", $scope.FilesImg[i]);
            }
            var request = {
                method: 'POST',
                url: CommService.Get_HR_API() + "api/HrAPI/WEB_UPLOAD_IMG",
                data: data,
                headers: {
                    'Content-Type': undefined
                }
            };
            $http(request).then(function (d) {
                $scope.ImageFiles = d.data;
                $scope.RESOURCE_SEARCH.IMAGE = $scope.ImageFiles.API_PATH + '/' + $scope.ImageFiles.ORIGINAL_FILE_NAME;
                $('.file-upload-content').show();
            });
        }
    };
    $scope.removeUpload = function () {
        $('.file-upload-content').hide();
    }
    $scope.uploadFiles_html = function (Attachment_UPLOAD_TYPE_ID, ATTACHEMENT_TYPE_ID, List) {
        if (($scope.Files != undefined && $scope.Files.length > 0)) {
            $scope.DocImageResult = [];
            var data = new FormData();
            data.append("FOLDER_PATH", "~/WebApplication/AngularViews/Resources/");
            data.append("ENTITY_ID", parseInt($cookies.get("ENTITY_ID")));
            for (var i in $scope.Files) {
                data.append("uploadedFile", $scope.Files[i]);
            }
            var request = {
                method: 'POST',
                url: CommService.Get_HR_API() + "api/HrAPI/WEB_UPLOAD",
                data: data,
                headers: {
                    'Content-Type': undefined
                }
            };
            $http(request).then(function (d) {
                $scope.UploadedFiles = d.data;
                $scope.RESOURCE_SEARCH.PAGE = $scope.UploadedFiles.ORIGINAL_FILE_NAME;
            });
        }
    };
    $scope.getTheFilesToUpload_data = function ($files, ControlName, FileSize, List, Attachment_UPLOAD_TYPE_ID, UPLOAD_OR_NOT_FLAG) {
        if ($files.length == 0) {
            $scope.Files = [];
            $scope.child_scope.CANCEL_EXCEL_FY();
        }
        else {
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
            $scope.uploadFiles_html(Attachment_UPLOAD_TYPE_ID, '', List)
        }
    };

    //$scope.GET_BRANCH_LIST = function () {
    //    var DshBoardModelObj = new Object();
    //    DshBoardModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
    //    PrcCommMethods.DASHBOARD_API(DshBoardModelObj, 'GET_BRANCH_LIST').then(function (data) {
    //        $scope.BRANCH_LIST = data.data.Table;
    //    });
    //};\


    //$scope.GET_BRANCH_LIST = function () {
    //    var DshBoardModelObj = new Object();
    //    DshBoardModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
    //    PrcCommMethods.DASHBOARD_API(DshBoardModelObj, 'GET_BRANCH_LIST').then(function (data) {
    //        $scope.BRANCH_LIST = data.data.Table;
    //    });
    //};
    //$scope.GET_BRANCH_LIST();
    PrcCommMethods.GET_BRANCH_LIST(parseInt($cookies.get("ENTITY_ID")), parseInt($cookies.get("USERID"))).then(function (data) {
        $scope.BRANCH_LIST = data;
    });

    $scope.GET_RESOURCE_TAGS = function () {
        var ModelObj = new Object();
        ModelObj.TAG_NAME = "";
        ModelObj.ACTIVE = 1;
        ModelObj.PAGE_NO = 0;
        ModelObj.PAGE_SIZE = 0;
        PrcCommMethods.HR_API(ModelObj, 'GET_RESOURCE_TAGS').then(function (data) {
            if (data.data.Table.length > 0) {

                $scope.RESOURCE_TAGS_LIST = data.data.Table;
            }
            else {

            }
        });
    };

    $scope.GET_RESOURCE_TAGS();
    $scope.GET_RESOURCE_TILES();
    //$scope.RESOURCE_LIST = [{ TITLE: 'Invoice Scanning Process – Wenodo', NAME: 'Process', DEC: 'You will be receiving an invite to your email auto entry which will be the app we will use to scan the documents and digital invoices can be emailed to the provided email addresses.', DAY: '11', DATE: 'Feb, 2022', IMG_SRC: '../../../E_Content/images/scanning-process.jpg', REDIRECT_TO_HTML: 'Scanning_Process' },
    //{ TITLE: 'Wenodo Apps', NAME: 'Hr App', DEC: 'Wenodo helps Restaurants through complete digital transformation by refining their back-office operations, streamlining front office...', DAY: '11', DATE: 'Feb, 2022', IMG_SRC: '../../../E_Content/images/wenodo-apps.jpg', REDIRECT_TO_HTML: 'blog_des' },
    //{ TITLE: 'Approval Max- User Manual', NAME: 'Process', DEC: 'Approver Request Lists There are two main request lists for Approvers: The “Decision required” list shows...', DAY: '11', DATE: 'Feb, 2022', IMG_SRC: '../../../E_Content/images/approval-max1.jpg', REDIRECT_TO_HTML: 'Approval_Max' },
    //{ TITLE: 'Telleroo – User Manual', NAME: 'Process', DEC: 'Telleroo Basics Click Here Pay run statuses When a pay run is created, learn what...', DAY: '11', DATE: 'Feb, 2022', IMG_SRC: '../../../E_Content/images/Telleroo-user-manual.jpg', REDIRECT_TO_HTML: 'Telleroo' },
    //{ TITLE: 'Process Documents', NAME: 'Process', DEC: 'CLIENT STANDING ORDERS & DDs Standing Orders/Direct Debits  List of Standing Orders/Direct Debits  This can...', DAY: '11', DATE: 'Feb, 2022', IMG_SRC: '../../../E_Content/images/process-documents.jpg', REDIRECT_TO_HTML: 'Process_Documents' },
    //{ TITLE: 'Wefyle User Manual', NAME: 'Wefyle', DEC: 'Log-in: How to log-in to the cash-up app? 1. Launch app.wenodo.com & Log-in with your credentials. 2. From...', DAY: '11', DATE: 'Feb, 2022', IMG_SRC: '../../../E_Content/images/wefyle-user-manual.jpg', REDIRECT_TO_HTML: 'Wefyle_User_Manual' },

    $scope.GET_FILTER_TAGS_ALL = function () {
        $scope.RESOURCE_SEARCH.SEARCH_TAG_ID = null;
        $scope.GET_RESOURCE_TILES();
    }

    $scope.GET_FILTER_TAGS = function (TAG_DATEAIL) {
        $scope.RESOURCE_SEARCH.SEARCH_TAG_ID = TAG_DATEAIL.TAG_ID;
        $scope.GET_RESOURCE_TILES();
    }
    $scope.RESET_TILES = function () {
        $scope.RESOURCE_SEARCH.SEARCH_TEXT = '';
        $scope.RESOURCE_SEARCH.SEARCH_TAG_ID = null;

    }

});
app.controller('VendorOnboardingController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {

});