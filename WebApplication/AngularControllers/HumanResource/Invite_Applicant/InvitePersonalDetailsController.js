app.controller('InvitePersonalDetailsController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    console.log("local Data", localStorage.getItem("Selected_Employee"));
    //$scope.$parent.DISPLAY_FLAG = false;
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(2);
    $scope.$parent.HIDE_HEADER_DETAIL = false;
    $scope.$parent.$parent.overlay_loading_HR_Loader = 'none';
    $scope.UPLOAD_FOLDER_NAME = "Uploads";
    $scope.PlaceHolderText = 'Type here..';
    $scope.InvitePersonalDetails = {
        EMPLY_PRSNL_ID: getUrlParameter('EMP_ID', $location.absUrl()),
        CUSTOMER_ID: getUrlParameter('CUS_ID', $location.absUrl()),
        ENTITY_ID: null,
        MODULE_ID: $cookies.get("MODULE_ID"),
        USER_ID: 1,
        DD_DEFAULT_TEXT: $scope.$parent.DD_DEFAULT_TEXT,
        CUSTOM_GENDER_NAME: $scope.$parent.DD_DEFAULT_TEXT,
        CUSTOM_NATIONALITY_NAME: $scope.$parent.DD_DEFAULT_TEXT,
        CUSTOM_BRANCH_NAME: $scope.$parent.DD_DEFAULT_TEXT,
        FIRST_NAME: '',
        MIDDLE_NAME: '',
        PROFILE: '',
        KNOWN_AS: '',
        WORK_AT: '',
        GENDER_ID: '',
        DOB: '',
        EFFECTIVE_DATE: null,
        PROFILE_PIC_PATH: null,
        COUNTY_NAME: 'County',
    };
    $scope.INVITE_APPLICANT_HEADER = {
        ONBOARDING_STEP: 1,
        ACTIVE_TAB_ID: 1
    };

    $scope.LINK_EXPIRE_FLAG = "";
    $scope.PAGE_LOAD = 0;

    $scope.GENDER_LIST = [{ GENDER_ID: 1, GENDER_NAME: 'Male' },
    { GENDER_ID: 2, GENDER_NAME: 'Female' },
    { GENDER_ID: 3, GENDER_NAME: 'Do not wish to specify' },]
    $scope.STEP_FLAG = 1;

    $scope.EDIT_STEP_NO = getUrlParameter('STEP_NO', $location.absUrl());
    $scope.EDIT_STEP_NO = $scope.EDIT_STEP_NO == undefined ? 0 : $scope.EDIT_STEP_NO;

    $scope.HRM_GET_GENDERS = function () {
        var personaldetailobj = new Object()
        personaldetailobj.CUSTOMER_ID = $scope.InvitePersonalDetails.CUSTOMER_ID;
        PrcCommMethods.HUMANRESOURCE_API(personaldetailobj, 'HRM_GET_GENDERS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.GENDER_LIST = data.data.Table;
            };
        });
    };
    $scope.ADMIN_GET_BRANCH_LIST = function () {
        var modelObject = new Object();
        modelObject.CUSTOMER_ID = $scope.InvitePersonalDetails.CUSTOMER_ID;
        PrcCommMethods.HUMANRESOURCE_API(modelObject, 'ADMIN_GET_BRANCH_LIST').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.BRANCH_DROPDOWN = data.data.Table;
            }
            else if (data.data == 0) {
                $scope.BRANCH_DROPDOWN = [];
            }
        });
    };
    $scope.HRM_GET_EMPLOYEE_STEP = function () {
        var personaldetailobj = new Object()
        personaldetailobj.EMPLY_PRSNL_ID = $scope.InvitePersonalDetails.EMPLY_PRSNL_ID;
        personaldetailobj.CUSTOMER_ID = $scope.InvitePersonalDetails.CUSTOMER_ID;
        PrcCommMethods.HUMANRESOURCE_API(personaldetailobj, 'HRM_GET_EMPLOYEE_STEP').then(function (data) {
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
    $scope.EDIT_MODE = $scope.EDIT_STEP_NO < 9 ? false : true;
    $scope.HRM_EDIT_PERSONAL_DETAILS = function () {
        $scope.EDIT_MODE = false;
    }
    $scope.HRM_GET_ONBOARDING_STEP_1 = function () {
        var UserModelObj = new Object();
        UserModelObj.EMPLY_PRSNL_ID = $scope.InvitePersonalDetails.EMPLY_PRSNL_ID
        UserModelObj.CUSTOMER_ID = $scope.InvitePersonalDetails.CUSTOMER_ID
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'HRM_GET_ONBOARDING_STEP_1').then(function (data) {
            if (data.data.Table.length > 0) {
                let RESULT_PERSNL = data.data.Table[0];
                $scope.STEP_NO = RESULT_PERSNL.STEP_NO;

                $scope.InvitePersonalDetails.FIRST_NAME = RESULT_PERSNL.FIRST_NAME;
                $scope.InvitePersonalDetails.LAST_NAME = RESULT_PERSNL.LAST_NAME;
                $scope.InvitePersonalDetails.KNOWN_AS = RESULT_PERSNL.KNOWN_AS;

                $scope.InvitePersonalDetails.CUSTOM_BRANCH_NAME = RESULT_PERSNL.BRANCH_NAME || $scope.InvitePersonalDetails.DD_DEFAULT_TEXT;
                $scope.InvitePersonalDetails.BRANCH_ID = RESULT_PERSNL.BRANCH_ID || '';
                $scope.InvitePersonalDetails.CUSTOM_GENDER_NAME = RESULT_PERSNL.GENDER || $scope.InvitePersonalDetails.DD_DEFAULT_TEXT;
                $scope.InvitePersonalDetails.GENDER_ID = RESULT_PERSNL.GENDER_ID || '';
                if (RESULT_PERSNL.DOB != null && RESULT_PERSNL.DOB != undefined && RESULT_PERSNL.DOB != '') {

                    $scope.InvitePersonalDetails.DOB = moment(RESULT_PERSNL.DOB).format("DD/MM/YYYY");
                    $(".dateofbirth ").datepicker("setDate", moment(RESULT_PERSNL.DOB).format("DD/MM/YYYY"));
                }
                $scope.InvitePersonalDetails.CUSTOM_NATIONALITY_NAME = RESULT_PERSNL.NATIONALITY || $scope.InvitePersonalDetails.DD_DEFAULT_TEXT;
                $scope.InvitePersonalDetails.NATIONALITY_ID = RESULT_PERSNL.NATIONALITY_ID || '';
                $scope.InvitePersonalDetails.PROFILE_PIC_PATH = RESULT_PERSNL.PROFILE_PIC_PATH;

            }
        });
    };
    $scope.dateinputdateofbirth = function () {
        $(document).ready(function () {
            var date_inputs = document.getElementsByClassName("dateofbirth") //our date input has the name "date"
            if (date_inputs.length > 0) {
                for (var i = 0; i < date_inputs.length; i++) {
                    var date_input = $('input[name="' + date_inputs[i].name + '"]'); //our date input has the name "date"
                    var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
                    // var date = new Date();
                    var options = {
                        todayBtn: "linked",
                        daysOfWeekHighlighted: "0,6",
                        autoclose: true,
                        todayHighlight: false,
                        format: 'dd/mm/yyyy',
                        clearBtn: true,
                        //endDate: "today",
                        // minDate: '-30Y',
                        endDate: '-5Y',
                        closeBtn: true,// close button visible
                        //  startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate())

                    };
                    date_input.datepicker(options).on("hide", function (e) {
                        if (e.date != undefined) {
                            var dateString = e.date;
                            var a = (moment(dateString, "DD/MM/YYYY").toDate());
                            var date1 = moment().subtract(5, 'years');
                            var date2 = moment(date1).subtract(100, 'years');
                            var SY = new Date(e.date).getFullYear();
                            var D2Y = new Date(date2).getFullYear();
                            if (SY <= D2Y) {
                                $scope.ShowAlertBox('Error', 'Please select valid date format', 3000);
                                date_input.datepicker('clearDates');
                            };
                            if (moment(dateString, "DD/MM/YYYY").toDate() >= date1) {
                                $scope.ShowAlertBox('Error', 'Your age should be more than 5 Years.', 3000);
                                date_input.datepicker('clearDates');
                            };
                        }
                    })
                }
            }
        });
    }

    $scope.ADMIN_GET_COUNTRY = function () {
        var UserModelObj = new Object();
        PrcCommMethods.ADMIN_API(UserModelObj, 'GET_COUNTRY').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.NATIONALITY_LIST = data.data.Table;
                $scope.HRM_GET_ONBOARDING_STEP_1();
            }
            else if (data.data == null) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
        });
    }


    $scope.UPLOAD_FILES = function (FOLDER_NAME, INDEX, FILE) {
        let path = '/' + FOLDER_NAME + '/';
        //if ($scope.InvitePersonalDetails.PROFILE_PIC_PATH != "" && $scope.InvitePersonalDetails.PROFILE_PIC_PATH != null && $scope.InvitePersonalDetails.PROFILE_PIC_PATH != undefined) {
        //    let resultath = $scope.InvitePersonalDetails.PROFILE_PIC_PATH.split('/')
        //    path = resultath[2];
        //};
        var data = new FormData();
        data.append("CUSTOMER_ID", $scope.InvitePersonalDetails.CUSTOMER_ID); /// Use for old
        data.append("FILE_PATH", path);
        data.append("file", FILE);
        data.append("GUID", 1);
        //for (var i in $scope.Files) {
        //    data.append("file", $scope.Files[i]);
        //}
        var _api_path = CommService.GET_HUMANRESOURCE_API() + "api/HumanResourceAPI/UPLOAD_FILE";
        var request = { method: 'POST', url: _api_path, data: data, headers: { 'Content-Type': undefined } };
        $http(request).then(function (d) {
            if (FOLDER_NAME == 'PROFILE_UPLOAD') {
                $scope.InvitePersonalDetails.PROFILE_PIC_PATH = "";
                $scope.InvitePersonalDetails.PROFILE_PIC_PATH = d.data;
                $scope.CLOSE_UPLOAD_Fn();
            }
        });
    };

    $scope.HRM_INS_UPD_ONBOARDING_STEP_1 = function (FLAG) {

        $scope.InvitePersonalDetailsForm.submitted = true;
        if ($scope.InvitePersonalDetailsForm.$valid) {

            var personaldetailobj = new Object()
            personaldetailobj.EMPLY_PRSNL_ID = $scope.InvitePersonalDetails.EMPLY_PRSNL_ID;
            personaldetailobj.ENTITY_ID = $scope.InvitePersonalDetails.ENTITY_ID;
            personaldetailobj.CUSTOMER_ID = $scope.InvitePersonalDetails.CUSTOMER_ID;
            personaldetailobj.USER_ID = $scope.InvitePersonalDetails.USER_ID;

            personaldetailobj.PROFILE_PIC_PATH = $scope.InvitePersonalDetails.PROFILE_PIC_PATH;
            personaldetailobj.FIRST_NAME = $scope.InvitePersonalDetails.FIRST_NAME;
            personaldetailobj.LAST_NAME = $scope.InvitePersonalDetails.LAST_NAME;
            personaldetailobj.NATIONALITY_ID = $scope.InvitePersonalDetails.NATIONALITY_ID;
            personaldetailobj.KNOWN_AS = $scope.InvitePersonalDetails.KNOWN_AS;
            personaldetailobj.GENDER_ID = $scope.InvitePersonalDetails.GENDER_ID;
            personaldetailobj.DOB = moment($scope.InvitePersonalDetails.DOB, "DD/MM/YYYY").format('L');
            personaldetailobj.BRANCH_ID = $scope.InvitePersonalDetails.BRANCH_ID;

            PrcCommMethods.HUMANRESOURCE_API(personaldetailobj, 'HRM_INS_UPD_ONBOARDING_STEP_1').then(function (data) {
                if (data.data > 0) {
                    $scope.$parent.ShowAlertBox("Success", 'Data submitted successfully.', 3000);
                    //if (FLAG == 1) {
                    //}
                    //else {
                    //    $location.path("Invite_Contact_Details").search("EMP_ID", scope.InvitePersonalDetails.EMPLY_PRSNL_ID);
                    //}
                    $scope.NEXT_Fn(FLAG, 1);
                }
                if (data.data == 0) {
                    $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                }
            });
        } else {
            $scope.$parent.ShowAlertBox("Attention", $scope.$parent.MANDATORY_MSG, 3000);
        }
    }

    $scope.CLICK_FN = function () {
        let a = { age: 29, name: 'Dionysia' };
        let b = { name: 'Dionysia', age: 29 };

        console.log(_.isEqual(a, b)); // true
    }
    $scope.REMOVE_PROFILE_IMG = function () {
        $scope.InvitePersonalDetails.PROFILE_PIC_PATH = null;
    }

    $scope.SELECTED_GENDER_Fn = function (_param_gender) {
        if (_param_gender == '') {
            $scope.InvitePersonalDetails.CUSTOM_GENDER_NAME = $scope.InvitePersonalDetails.DD_DEFAULT_TEXT;
            $scope.InvitePersonalDetails.GENDER_ID = ''
        }
        else {
            $scope.InvitePersonalDetails.CUSTOM_GENDER_NAME = _param_gender.GENDER;
            $scope.InvitePersonalDetails.GENDER_ID = _param_gender.GENDER_ID;
        }
    }
    $scope.SELECTED_NATIONALITY_Fn = function (_param_nationality) {
        if (_param_nationality == '') {
            $scope.InvitePersonalDetails.CUSTOM_NATIONALITY_NAME = $scope.InvitePersonalDetails.DD_DEFAULT_TEXT;
            $scope.InvitePersonalDetails.NATIONALITY_ID = ''
        }
        else {
            $scope.InvitePersonalDetails.CUSTOM_NATIONALITY_NAME = _param_nationality.NATIONALITY;
            $scope.InvitePersonalDetails.NATIONALITY_ID = _param_nationality.COUNTRY_ID;
            $scope.InvitePersonalDetails.DISPLAY_NATIONALITY_TEXT_SEARCH = '';
        }
    }

    $scope.SELECTED_BRANCH_Fn = function (_branch, _invite) {
        if (_branch == '') {
            $scope.InvitePersonalDetails.CUSTOM_BRANCH_NAME = $scope.InvitePersonalDetails.DD_DEFAULT_TEXT;
            $scope.InvitePersonalDetails.BRANCH_ID = '';
        } else {
            $scope.InvitePersonalDetails.CUSTOM_BRANCH_NAME = _branch.BRANCH_NAME;
            $scope.InvitePersonalDetails.BRANCH_ID = _branch.BRANCH_ID;
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
                    $location.path("#").search("CUS_ID", getUrlParameter('CUS_ID', $location.absUrl())).search("EMP_ID", getUrlParameter('EMP_ID', $location.absUrl()));
            }
        } else {
            alert("Please complete each step in order before proceeding!");
        }
    };


    $scope.PAGE_LOAD = 0;
    $scope.HRM_GET_EMPLOYEE_DETAILS_BY_PASSKEY = function () {
        var personaldetailobj = new Object()
        personaldetailobj.PASSKEY = getUrlParameter('passkey', $location.absUrl());
        PrcCommMethods.HUMANRESOURCE_API(personaldetailobj, 'HRM_GET_EMPLOYEE_DETAILS_BY_PASSKEY').then(function (data) {
            if (data.data.Table.length > 0) {
                $location.path("Invite_Personal_Details").search("CUS_ID", data.data.Table[0].CUSTOMER_ID).search("EMP_ID", data.data.Table[0].EMPLY_PRSNL_ID);
                $scope.HRM_GET_EMPLOYEE_STEP();
                $scope.ADMIN_GET_BRANCH_LIST();
                $scope.HRM_GET_GENDERS();
                $scope.ADMIN_GET_COUNTRY();
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


    $scope.imageSrc = null;
    $scope.croppedImage = null;
    let cropper = null;
    // Upload and display image

    $scope.uploadImage = function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                $scope.$apply(() => {
                    $scope.imageSrc = e.target.result;
                });

                // Initialize Cropper.js
                const imageElement = document.getElementById('image');
                if (cropper) cropper.destroy(); // Destroy previous cropper instance
                cropper = new Cropper(imageElement, {
                    aspectRatio: 1,
                    viewMode: 2,
                    center: true,
                    //restore: false,
                    // zoomOnWheel: false,
                    background: false,
                    containWithinAspectRatio: true,
                    //cropBoxResizable: false,
                    minCropBoxWidth: 100,
                    minCropBoxHeight: 100,
                    maxCropBoxWidth: 420,
                    maxCropBoxHeight: 230,
                    minCropBoxWidth: 420,
                    minCropBoxHeight: 230,
                    minContainerWidth: 600,
                    minContainerHeight: 600,
                    modal: true,
                    scalable: true,
                    rotatable: true,
                    checkOrientation: true,
                    // cropBoxResizable: true,
                    dragMode: 'move',
                    minCropBoxWidth: 346,
                    minCropBoxHeight: 269,
                    minContainerHeight: 400,
                    minContainerWidth: 400,
                    minCanvasWidth: 400,
                    minCanvasHeight: 400,
                    responsive: true,
                    dragMode: 'move',
                    //autoCropArea: 1,
                    autoCropArea: 0.8,
                    initialAspectRatio: 1,
                    data: { //define cropbox size
                        width: 240,
                        height: 90,
                    },
                    ready() {
                        //Make the crop box circular
                        //const containerData = cropper.getContainerData();
                        //const imageData = cropper.getImageData();
                        const cropBox = this.cropper.cropper.querySelector('.cropper-view-box');
                        cropBox.style.borderRadius = '50%';

                        //const cropBoxData = cropper.getCropBoxData();
                        //cropBoxData.height = 200; // Fixed height in pixels
                        //cropper.setCropBoxData(cropBoxData);

                        //if (imageData.width > containerData.width || imageData.height > containerData.height) {
                        //    cropper.zoomTo(containerData.width / imageData.naturalWidth); // Scale the image to fit width
                        //}
                        //cropper.setCropBoxData({
                        //    width: 300, // Fixed width
                        //    height: 300, // Fixed height
                        //});

                    },
                });
            };
            reader.readAsDataURL(file);
        }
        $('#cropImagePop').modal('show');
    };
    $scope.CLOSE_UPLOAD_Fn = function () {
        $('#cropImagePop').modal('hide');
    }
    // Crop the image
    $scope.cropImage = function () {
        if (cropper) {
            //const canvas = cropper.getCroppedCanvas();
            //$scope.croppedImage = canvas.toBlob('image/png');
            cropper.getCroppedCanvas({
                width: 300,  // Optional: Specify output width
                height: 300, // Optional: Specify output height
            }).toBlob((blob) => {
                // Handle the Blob object
                console.log(blob);
                // Example: Create a URL for the Blob and display it
                // const blobUrl = URL.createObjectURL(blob);
                $scope.UPLOAD_FILES('PROFILE_UPLOAD', 1, blob);
                //const imgElement = document.createElement('img');
                //imgElement.src = blobUrl;
                //document.body.appendChild(imgElement);
            }, 'image/png');
        }
    }
    var result
    $scope.setMoveLeftMode = function () {
        if (cropper) {
            cropper.move(-10, 0); // move left
        }
    };
    // Set Crop Mode
    $scope.setCropRightMode = function () {
        if (cropper) {
            cropper.move(10, 0); //  move rigt
        }
    };
    $scope.setMoveUpMode = function () {
        if (cropper) {
            cropper.move(0, -10); //  move up
        }
    };
    // Set Crop Mode
    $scope.setCropDownMode = function () {
        if (cropper) {
            cropper.move(0, 10); //  move down
        }
    };
    $scope.zoomIn = function () {
        if (cropper) {
            cropper.zoom(0.1); // Zoom in by 10%
        }
    };
    // Zoom Out Function
    $scope.zoomOut = function () {
        if (cropper) {
            cropper.zoom(-0.1); // Zoom out by 10%
        }
    };
    let scaleX = 1; // Track horizontal flip state
    let scaleY = 1; // Track vertical flip state
    $scope.ScaleModeX = function () {
        if (cropper) {
            scaleX = scaleX === 1 ? -1 : 1; // Toggle horizontal flip
            cropper.scaleX(scaleX);
        }
    }
    //$scope.flipY = function () {
    //    if (cropper) {
    //        scaleY = scaleY === 1 ? -1 : 1; // Toggle vertical flip
    //        cropper.scaleY(scaleY);
    //    }
    //};
    $scope.ScaleModeY = function () {
        if (cropper) {
            scaleY = scaleY === 1 ? -1 : 1; // Toggle vertical flip
            cropper.scaleY(scaleY);
        }
    }
});