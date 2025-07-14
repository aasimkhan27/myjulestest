app.controller('BasicInfoController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.TAB_FLAG = 1;
    $scope.AccountSetting = {
        OldPassword: "",
        NewPassword: "",
        ConfirmPassword: "",
        IMAGE_PATH: $cookies.get("IMAGE_PATH"),
    };
    $scope.TAB_CLICK = function (FLAG) {
        $scope.TAB_FLAG = FLAG;
        if (FLAG == 3) {
            $scope.GET_USER_DELEGATIONS();
        }
    };
    $scope.GET_USER_NOTIFICATION_PREFERENCES = function () {
        var UserModelObj = new Object();
        UserModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        UserModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.LOGIN_API(UserModelObj, 'GET_USER_NOTIFICATION_PREFERENCES').then(function (data) {
            $scope.ENTITY_SETTINGS = data.data.Table;
        });
    };
    $scope.GET_USER_DELEGATIONS = function () {
        var UserModelObj = new Object();
        UserModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        UserModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.LOGIN_API(UserModelObj, 'GET_USER_DELEGATIONS').then(function (data) {
            $scope.USER_DELEGATIONS = angular.copy(data.data.Table)//$filter('unique')(data.data.Table, 'ENTITY_NAME');
            $scope.USER_DELEGATIONS_ENTITY = angular.copy($filter('unique')(data.data.Table, 'ENTITY_NAME'));
        });
    };
    $scope.FY_ED = function (ED, index) {
        ED.E_INDEX = index; ED.USER_DELEGATIONS = angular.copy($scope.USER_DELEGATIONS)
    }
    $scope.IS_PRF_EDIT = false;
    $scope.EDIT_USER_INFO = function () {
        $scope.IS_PRF_EDIT = true;
    }
    $scope.NG_REQU_USER_NAME = false;
    $scope.NG_REQU_SECONDARY_EMAIL = false;
    $scope.NG_REQU_MOBILE_NO = false;


    $scope.ADMIN_VALIDATE_USER_DATA = function (FLAG, VALUE) {
        if (VALUE !== undefined && VALUE !== undefined && VALUE !== "") {
            var UserModelObj = new Object();
            UserModelObj.USER_ID = parseInt($cookies.get("USERID"));
            UserModelObj.TYPE = FLAG;///-- 1 PRIMARY EMAIL,2 SECONDARY EMAIL,3 USER_NAME, 4 MOBILE NO
            UserModelObj.VALUE = VALUE;
            PrcCommMethods.ADMIN_API(UserModelObj, 'ADMIN_VALIDATE_USER_DATA').then(function (data) {
                if (data.data == -1) {
                    if (FLAG == 2) {
                        $scope.NG_REQU_SECONDARY_EMAIL = true;
                    }
                    else if (FLAG == 3) {
                        $scope.NG_REQU_USER_NAME = true;
                    }
                    else if (FLAG == 4) {
                        $scope.NG_REQU_MOBILE_NO = true;
                    }
                    //$scope.$parent.ShowAlert('Attention', FLAG == 1 ? 'Primary Email Already Exist.' : FLAG == 2 ? 'Secondary Email Already Exist.' : FLAG == 3 ? 'Provided User Name Already Exist.' : 'Provided Mobile Number Already Exist.', 5000);
                }
                if (data.data == 1) {
                    if (FLAG == 2) {
                        $scope.NG_REQU_SECONDARY_EMAIL = false;
                    }
                    else if (FLAG == 3) {
                        $scope.NG_REQU_USER_NAME = false;
                    }
                    else if (FLAG == 4) {
                        $scope.NG_REQU_MOBILE_NO = false;
                    }
                }
            });
        }
        else {
            if (FLAG == 2) {
                $scope.NG_REQU_SECONDARY_EMAIL = false;
            }
            else if (FLAG == 3) {
                $scope.NG_REQU_USER_NAME = false;
            }
            else if (FLAG == 4) {
                $scope.NG_REQU_MOBILE_NO = false;
            }
        }
    }
    $scope.SAVE_USER_INFO = function () {
        $scope.SubmitUserpro.submitted = true;
        if ($scope.SubmitUserpro.$valid && $scope.NG_REQU_SECONDARY_EMAIL == false && $scope.NG_REQU_USER_NAME == false && $scope.NG_REQU_MOBILE_NO == false) {
            var UserModelObj = new Object();
            UserModelObj.USER_ID = parseInt($cookies.get("USERID"));
            UserModelObj.NAME = $scope.USER_BASIC_INFO.NAME;
            UserModelObj.SECONDARY_EMAIL = $scope.USER_BASIC_INFO.SECONDARY_EMAIL;
            UserModelObj.NOTIFICATION_EMAIL = $scope.USER_BASIC_INFO.NOTIFICATION_EMAIL;
            UserModelObj.MOBILE_CODE = $scope.USER_BASIC_INFO.MOBILE_CODE;
            UserModelObj.MOBILE_NO = parseInt($scope.USER_BASIC_INFO.MOBILE_NO);
            UserModelObj.USER_NAME = $scope.USER_BASIC_INFO.USER_NAME;
            UserModelObj.DESIGNATION = $scope.USER_BASIC_INFO.DESIGNATION;
            PrcCommMethods.LOGIN_API(UserModelObj, 'UPD_USER_BASIC_INFO').then(function (data) {
                if (data.data == 1) {
                    $scope.$parent.ShowAlert('Success', 'updated successfully', 5000);
                    $scope.CANCEL_USER_INFO();
                }
                if (data.data == 0) {
                    $scope.$parent.ShowAlert('Error', $scope.SOMETHINGWENTWRONG, 5000);
                }
            });
        }
    }
    $scope.CANCEL_USER_INFO = function () {
        $scope.IS_PRF_EDIT = false;
        $scope.NG_REQU_USER_NAME = false;
        $scope.NG_REQU_SECONDARY_EMAIL = false;
        $scope.NG_REQU_MOBILE_NO = false;
        $scope.GET_USER_BASIC_INFO();
        $scope.SubmitUserpro.submitted = false;
    }

    $scope.USER_BASIC_INFO = {

    }
    $scope.GET_USER_BASIC_INFO = function () {
        var UserModelObj = new Object();
        UserModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.LOGIN_API(UserModelObj, 'GET_USER_BASIC_INFO').then(function (data) {
            $scope.USER_BASIC_INFO = data.data.Table[0];
        });
    };
    $scope.GET_USER_BASIC_INFO();
    $scope.GET_USER_NOTIFICATION_PREFERENCES();
    $scope.INS_UPD_USER_NOTIFICATION_PREFERENCES = function () {
        var UserModelObj = new Object();
        UserModelObj.USER_ID = parseInt($cookies.get("USERID"));
        UserModelObj.USER_NOTIFICATION_PREFERENCE = [];

        angular.forEach($scope.ENTITY_SETTINGS, function (item) {
            var _itemObject = new Object();
            _itemObject.TABLE_ID = item.TABLE_ID;
            _itemObject.ENTITY_ID = item.ENTITY_ID;
            _itemObject.NOTIFICATION_MASTER_ID = item.NOTIFICATION_MASTER_ID;
            _itemObject.EMAIL_NOTIFICATION = item.EMAIL_NOTIFICATION == true ? 1 : 0;
            _itemObject.MOBILE_APP_NOTIFICATION = item.MOBILE_APP_NOTIFICATION == true ? 1 : 0;
            _itemObject.WHATSAPP_NOTIFICATION = item.WHATSAPP_NOTIFICATION == true ? 1 : 0;
            UserModelObj.USER_NOTIFICATION_PREFERENCE.push(_itemObject);
        });
        
        //var obj = new Object();
        //obj.TABLE_ID = NOTIF.TABLE_ID;
        //obj.ENTITY_ID = NOTIF.ENTITY_ID;
        //obj.NOTIFICATION_MASTER_ID = NOTIF.NOTIFICATION_MASTER_ID;
        //obj.EMAIL_NOTIFICATION = NOTIF.EMAIL_NOTIFICATION ? 1 : 0;
        //UserModelObj.USER_NOTIFICATION_PREFERENCE.push(obj);
        PrcCommMethods.LOGIN_API(UserModelObj, 'INS_UPD_USER_NOTIFICATION_PREFERENCES').then(function (data) {
            if (data.data == 1) {
                //document.getElementById('NOTI' + index + ES_INDEX).className = 'successfully-saved';
                //NOTIF.MESSAGE = "Update Successfully";
                //var myVar = setInterval(myTimer, 3000);
                //function myTimer() {
                //    document.getElementById('NOTI' + index + ES_INDEX).className = 'hide-opacity';
                //    clearInterval(myVar);
                //}
                $scope.$parent.ShowAlert('Success', 'Records are updated successfully.', 3000);
            }
            if (data.data == 0) { }
        });
    };
    $scope.SET_INTERVAL_UPDATE = function (NOTIF) {

    };
    $scope.showpasswordedit = false;
    $scope.EDIT_PASSWORD = function (FLAG) {
        if (FLAG == 1) {
            $scope.showpasswordedit = false;
        }
        if (FLAG == 2) {
            $scope.SubmitPassword.submitted = true;
            if ($scope.SubmitPassword.$valid) {
                $scope.SetPassword();
            }
        }
        if (FLAG == 3) {
            $scope.AccountSetting = {
            };
            $scope.AccountSetting.NewPassword = '';
            $scope.showpasswordedit = true;
            $scope.SubmitPassword.submitted = false;
        }
    };
    $scope.SetPassword = function () {
        var UserModelObj = new Object();
        UserModelObj.OldPassword = $scope.AccountSetting.OldPassword;
        UserModelObj.Password = $scope.AccountSetting.NewPassword;
        UserModelObj.PassKey = '';
        UserModelObj.ID = parseInt($cookies.get("USERID"));
        var httpRequest = $http({
            method: 'POST',
            url: CommService.Get_CASHUP_API() + 'api/LoginAPI/PASSWORD_UPDATE',
            data: UserModelObj
        }).then(function (data) {
            if (data.data != null && data.data.length > 0) {
                if (data.data[0].SUCCESS == 0) {
                    $scope.$parent.ShowAlert('Error', "The old password you have entered is incorrect", 5000);
                }
                if (data.data[0].SUCCESS == 1) {
                    $scope.$parent.ShowAlert('Success', 'Password updated successfully', 5000);
                    window.location.href = "../Login/Index";
                }
            }
            else {
                $scope.INVALID_LOGIN = true;
            }
        });
    };
    //const togglePassword = document.querySelector('#togglePassword');
    //const password = document.querySelector('#password');
    //togglePassword.addEventListener('click', function (e) {
    //    debugger;
    //    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    //    password.setAttribute('type', type);
    //    $("#togglePassword").toggleClass("fa-eye-slash");
    //    this.classList.toggle('fa-eye');
    //});


});

