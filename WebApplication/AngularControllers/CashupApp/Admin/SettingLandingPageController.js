app.controller('SettingLandingPageController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(2);

    $scope.CUSTOMER_ID = $cookies.get("CUSTOMER_ID");
    $scope.ENTITY_ID = $cookies.get("ENTITY_ID");
    $scope.USER_ID = $cookies.get("USERID");
    $scope.NOTIFICATIONS_MASTER_LIST = [];
    $scope.CUST_NOTIFICATIONS_LIST = [];
    $scope.NOTIFICATION_MAIL_LOG_LIST = [];
    $scope.NOTIFICATION_SEARCH = {
        CUSTOMER_ID: parseInt($cookies.get("CUSTOMER_ID")),
        ENTITY_ID: $cookies.get("ENTITY_ID"),
        USER_ID: $cookies.get("USERID"),
        SELECTED_SITE: null,
        START_DATE: null,
        END_DATE: null,
        SEARCH_TEXT: '',
        NOTIFICATION_TYPE: null,
        STATUS: 0,
        PAGE_NO: 1,
        PAGE_SIZE: 10
    }
    $scope.USER_Obj = {
        USER_NAME: null,
        USER_EMAIL: null,
        USER_PHONE: null,

        USER_CURRENT_PASSWORD: null,
        USER_NEW_PASSWORD: null,
        USER_CONFIRM_PASSWORD: null
    }
    $scope.SITES_LIST = [];
    $scope.GET_USER_ROLES_BY_CUSTOMER_ID = function () {
        var objuser = new Object();
        objuser.CUSTOMER_ID = $scope.CUSTOMER_ID;
        objuser.SEARCH = '';
        objuser.PAGE_NO = 1;
        objuser.PAGE_SIZE = 999999;
        PrcCommMethods.CASHUP_APP_API(objuser, 'GET_USER_ROLES_BY_CUSTOMER_ID').then(function (data) {
            if (data.data.Table != null && data.data.Table != undefined || data.data.Table.length > 0) {
                if (data.data.Table.filter(x => x.USER_ID == $scope.USER_ID).length > 0) {
                    var userObj = data.data.Table.filter(x => x.USER_ID == $scope.USER_ID)[0];
                    $scope.USER_Obj.USER_NAME = userObj.USER_NAME;
                    $scope.USER_Obj.USER_EMAIL = userObj.PRIMARY_EMAIL;
                    $scope.USER_Obj.USER_PHONE = userObj.MOBILE_NO;
                }
            }
            else {
                $scope.USER_Obj.USER_NAME = null;
                $scope.USER_Obj.USER_EMAIL = null;
                $scope.USER_Obj.USER_PHONE = null;
            }                   
        });                     
    }
    $scope.GET_USER_ROLES_BY_CUSTOMER_ID();

    $scope.GET_USER_NTFCTN_PREFRENCES = function () {
        CommonObj = new Object();
        CommonObj.ENTITY_ID = $scope.ENTITY_ID;
        CommonObj.USER_ID = $scope.USER_ID;
        PrcCommMethods.CASHUP_APP_API(CommonObj, 'GET_USER_NTFCTN_PREFRENCES').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.NOTIFICATIONS_MASTER_LIST.forEach(function (_notification) {
                    var matchingMapping = data.data.Table.find(function (mapping) {
                        return _notification.TABLE_ID === mapping.NOTIFICATION_MASTER_ID;
                    });
                    if (matchingMapping) {
                        _notification.ACTIVE = matchingMapping.EMAIL_NOTIFICATION;
                    }
                });
            }
            else {
                $scope.CUST_NOTIFICATIONS_LIST = [];
            }
        });
    }

    $scope.GET_NOTIFICATIONS_MASTER_BY_MODULE_ID = function () {
        CommonObj = new Object();
        CommonObj.MODULE_ID = 1;
        PrcCommMethods.CASHUP_APP_API(CommonObj, 'GET_NOTIFICATIONS_MASTER_BY_MODULE_ID').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.NOTIFICATIONS_MASTER_LIST = data.data.Table;
                $scope.GET_USER_NTFCTN_PREFRENCES();
            }
            else {
                $scope.NOTIFICATIONS_MASTER_LIST = [];
            }
        });
    };
    $scope.GET_NOTIFICATIONS_MASTER_BY_MODULE_ID();
    $scope.SetPassword = function () {
        $scope.AccountPasswordForm.submitted = true;
        if ($scope.AccountPasswordForm.$valid) {
            var UserModelObj = new Object();
            UserModelObj.OldPassword = $scope.USER_Obj.USER_CURRENT_PASSWORD;
            UserModelObj.Password = $scope.USER_Obj.USER_NEW_PASSWORD;
            UserModelObj.PassKey = '';
            UserModelObj.ID = parseInt($cookies.get("USERID"));
            var httpRequest = $http({
                method: 'POST',
                url: CommService.Get_CASHUP_API() + 'api/LoginAPI/PASSWORD_UPDATE',
                data: UserModelObj
            }).then(function (data) {
                if (data.data != null && data.data.length > 0) {
                    if (data.data[0].SUCCESS == 0) {
                        $scope.$parent.ShowAlertBox('Error', "The old password you have entered is incorrect", 5000);
                    }
                    if (data.data[0].SUCCESS == 1) {
                        $scope.$parent.ShowAlertBox('Success', 'Password updated successfully', 5000);
                        window.location.href = "../Login/Index";
                    }
                }
                else {
                    $scope.INVALID_LOGIN = true;
                }
            });
        }
    };

    
    $scope.ADMIN_GET_BRANCH_LIST = function () {
        var commObj = new Object();
        commObj.CUSTOMER_ID = $scope.CUSTOMER_ID;
        commObj.ENTITY_ID = $scope.ENTITY_ID;
        PrcCommMethods.CASHUP_APP_API(commObj, 'ADMIN_GET_BRANCH_LIST').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.SITES_LIST = data.data.Table;
            }
            else {
                $scope.SITES_LIST = [];
            }
        });
    };
    $scope.ADMIN_GET_BRANCH_LIST();

    $scope.SELECT_SITE_FOR_NOTIFICATION = function (_site) {
        if (_site == null || _site == undefined) {
            $scope.NOTIFICATION_SEARCH.SELECTED_SITE = null;
        }
        else {
            $scope.NOTIFICATION_SEARCH.SELECTED_SITE = _site;
        }
        $scope.GET_CASHUP_SETTING_MAIL_LOG();
    }
    $scope.SELECT_TYPE_FOR_NOTIFICATION = function (_type) {
        if (_type == null || _type == undefined) {
            $scope.NOTIFICATION_SEARCH.NOTIFICATION_TYPE = null;
        }
        else {
            $scope.NOTIFICATION_SEARCH.NOTIFICATION_TYPE = _type;
        }
        $scope.GET_CASHUP_SETTING_MAIL_LOG();
    }
    $scope.GET_CASHUP_SETTING_MAIL_LOG = function (flag) {

        if (flag == null || flag == undefined) {
            $scope.NOTIFICATION_SEARCH.PAGE_NO = 1;
            $scope.GetData = true;
        }

        var CashupAppModelObj = new Object();
        CashupAppModelObj.START_DATE = $scope.NOTIFICATION_SEARCH.START_DATE;
        CashupAppModelObj.END_DATE = $scope.NOTIFICATION_SEARCH.END_DATE;
        CashupAppModelObj.STATUS = $scope.NOTIFICATION_SEARCH.STATUS;
        CashupAppModelObj.BRANCH_ID = $scope.NOTIFICATION_SEARCH.SELECTED_SITE == null ? 0 : $scope.NOTIFICATION_SEARCH.SELECTED_SITE.BRANCH_ID;
        CashupAppModelObj.CUSTOMER_ID = $scope.NOTIFICATION_SEARCH.CUSTOMER_ID;
        CashupAppModelObj.NOTIFICATION_TYPE = $scope.NOTIFICATION_SEARCH.NOTIFICATION_TYPE == null ? 0 : $scope.NOTIFICATION_SEARCH.NOTIFICATION_TYPE.TABLE_ID;
        CashupAppModelObj.SEARCH_TEXT = $scope.NOTIFICATION_SEARCH.SEARCH_TEXT;
        CashupAppModelObj.PAGE_NO = $scope.NOTIFICATION_SEARCH.PAGE_NO;
        CashupAppModelObj.PAGE_SIZE = $scope.NOTIFICATION_SEARCH.PAGE_SIZE;
        CashupAppModelObj.ENTITY_ID = $scope.NOTIFICATION_SEARCH.ENTITY_ID;

        PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'GET_CASHUP_SETTING_MAIL_LOG').then(function (data) {
            if (data.data.Table.length > 0) {
                if (flag == null || flag == undefined) {
                    $scope.NOTIFICATION_MAIL_LOG_LIST = data.data.Table;
                }
                else if (flag == 1) {
                    $scope.NOTIFICATION_MAIL_LOG_LIST = $scope.NOTIFICATION_MAIL_LOG_LIST.concat(data.data.Table);
                }
                if (data.data.Table.length < $scope.NOTIFICATION_SEARCH.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.NOTIFICATION_SEARCH.PAGE_NO = parseInt($scope.NOTIFICATION_SEARCH.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else if ($scope.NOTIFICATION_SEARCH.PAGE_NO > 1 && data.data.Table.length == 0) {
                $scope.GetData = false;
            }
            else if ($scope.NOTIFICATION_SEARCH.PAGE_NO == 1 && data.data.Table.length == 0) {
                $scope.NOTIFICATION_MAIL_LOG_LIST = [];
                $scope.LOAD_FETCH_TEXT = 'No Records Found !';
            }
        });
    };
    $scope.RESEND_NOTIFICATION = function (_system_notification_id) {
        var CashupAppModelObj = new Object();
        CashupAppModelObj.TABLE_ID = _system_notification_id;//_message.SYSTEM_NOTIFICATION_ID;
        PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'RESEND_NOTIFICATION').then(function (data) {
            if (data.data > 0) {
                $scope.$parent.ShowAlertBox("Success", 'Success!', 3000);
            }
            else {
                $scope.$parent.ShowAlertBox("Error", 'Something went wrong!', 3000);
            }
        });
    }
    $scope.SHOW_ERROR = function (_item) {
        $scope.NOTIFICATION_ERROR = _item.EMAIL_ERROR;
        var myModal = new bootstrap.Modal(document.getElementById('notification_error'), {
            keyboard: false
        });

        myModal.show();



        //var modalEl = document.getElementById('notification_error');
        //var existingModal = bootstrap.Modal.getInstance(modalEl);
        //if (existingModal) {
        //    existingModal.show();
        //}
    }




    //----------------------------------------------------DATE_RANGE_PICKER FOR NOTIFICATION PAGE------------------------------------------------------------------
    $scope.$parent.Datelocaleformat = { format: 'DD/MM/YYYY' };
    function reportrange(startDate, endDate) {
        $scope.NOTIFICATION_SEARCH.START_DATE = startDate.format('YYYY-MM-DD');
        $scope.NOTIFICATION_SEARCH.END_DATE = endDate.format('YYYY-MM-DD');
        $('#reportrange span').html(startDate.format($scope.$parent.Datelocaleformat.format) + ' - ' + endDate.format($scope.$parent.Datelocaleformat.format));
        $scope.GET_CASHUP_SETTING_MAIL_LOG();

    }
    $(function () {

        startDate = new moment().add(0, 'months').date(1);//new moment().subtract(1, 'months').date(1); //moment().add('months', 1).date(0);//moment().startOf('month');   //moment().startOf('isoWeek');//moment().subtract(6, 'days');
        //console.log("SD", startDate);
        endDate = moment().endOf('month'); //moment().subtract(0, 'days');
        //console.log("ED", endDate);
        $scope.$parent.SetUpDateRangeMultiDatePicker('reportrange', startDate, endDate, reportrange);
        $('#reportrange span').html(startDate.format($scope.$parent.Datelocaleformat.format) + ' - ' + endDate.format($scope.$parent.Datelocaleformat.format));
    });

    $(document).on("click", ".ranges ul li", function (event) {

        var a = $(this).attr("data-range-key");
        if (a == "Custom Date" && ($scope.loader == 1)) {
            $scope.loader = 2;
            var start = moment().startOf('month');
            var end = moment().add(1, 'M').endOf('month');
            //$('#' + ControlName).trigger('show.daterangepicker')
            $scope.$parent.SetUpDateRangeMultiDatePicker('reportrange', start, end, reportrange, 1, "right", 'Open');
            $('#reportrange').data('daterangepicker').show();
        }
        else {
            $scope.loader = 1;
        }
    });
    //----------------------------------------------------DATE_RANGE_PICKER FOR NOTIFICATION PAGE------------------------------------------------------------------

    $scope.$on('$destroy', function () {
        $('.modal.show').modal('hide');
    });


});