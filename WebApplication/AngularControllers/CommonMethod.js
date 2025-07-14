app.service('PrcCommMethods', function ($http, CommService, $cookies) {
    var RspData = [];
    /////////////////////////////Start/////////////////////////////////////////
    this.STATUSLIST = function () {
        var STATUSLIST = [];
        STATUSLIST = [
            { STATUS_ID: 'ACTIVE', STATUS_NAME: 'ACTIVE', Selected: false },
            { STATUS_ID: 'NA', STATUS_NAME: 'NA', Selected: false },
            { STATUS_ID: 'EXPIRED', STATUS_NAME: 'EXPIRED', Selected: false },
            { STATUS_ID: '1', STATUS_NAME: 'Draft', Selected: false },
            { STATUS_ID: '2', STATUS_NAME: 'Negotiation', Selected: false }]
        return STATUSLIST;
    };

    this.BINTYPE = function () {
        var BINTYPE = [];
        BINTYPE = [{ BIN_TYPE_ID: 1, Name: 'Consignment' }, { BIN_TYPE_ID: 2, Name: 'Non Consignment' }]
        return BINTYPE;
    };
    this.ListStatus = function () {
        var ListStatus = [];
        ListStatus = [{ STATUS_ID: 106, STATUS_NAME: 'Completed' }, { STATUS_ID: 105, STATUS_NAME: 'In Progress' }, { STATUS_ID: 104, STATUS_NAME: 'Pending' }]
        return ListStatus;
    };
    this.ListMonth = function () {
        var ListStatus = [];
        ListStatus = [{ STATUS_ID: 4, STATUS_NAME: 'Monthly' }, { STATUS_ID: 3, STATUS_NAME: 'Quarterly' }, { STATUS_ID: 2, STATUS_NAME: 'Half Yearly' }, { STATUS_ID: 1, STATUS_NAME: 'Yearly' }]
        return ListStatus;
    };
    this.SearchSupplier = function (SupplierName, VendorCode) {
        var httprequest = '';
        var GetAll = new Object();
        GetAll.SupplierName = SupplierName;
        GetAll.VendorCode = VendorCode;
        var httprequest = $http({
            method: 'POST',
            url: CommService.GET_SUPPLIER_MANAGEMENT_API() + 'api/SM/GetSupplierByText',
            data: GetAll
        }).then(function (data) {
            RspData = data;
            return RspData;
        });
        return httprequest;
    }
    this.GET_SUPPLIER_LIST = function (LOCATION_ID, CUSTOMER_ID) {
        var httprequest = '';
        var GetAll = new Object();
        GetAll.LOCATION_ID = LOCATION_ID;
        GetAll.CUSTOMER_ID = CUSTOMER_ID;
        return this.RFQ_API(GetAll, 'GET_SUPPLIER_LIST');
    }
    this.GET_PAYMENT_TERMS = function (CUSTOMER_ID) {
        var RspData = [];
        var GetAll = new Object();
        GetAll.CUSTOMER_ID = CUSTOMER_ID;
        this.RFQ_API(GetAll, 'GET_PAYMENT_TERMS').then(function (rsp) {
            RspData = rsp;
            return RspData;
        })
        return RspData
    }
    this.GET_CURRENCY = function () {
        var RspData = [];
        var GetAll = new Object();
        this.RFQ_API(GetAll, 'GET_CURRENCY').then(function (rsp) {
            RspData = rsp;
            return RspData;
        })
        return RspData
    }
    this.monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        this.dayOfWeekNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        this.dayOfWeekNamesShort = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        this.twoDigitPad = function twoDigitPad(num) {
            return num < 10 ? "0" + num : num;
        }
    this.formatDate = function formatDate(date, patternStr) {
        if (!patternStr) {
            patternStr = 'M/d/yyyy';
        }
        var day = date.getDate(),
            month = date.getMonth(),
            year = date.getFullYear(),
            hour = date.getHours(),
            minute = date.getMinutes(),
            second = date.getSeconds(),
            miliseconds = date.getMilliseconds(),
            h = hour % 12,
            hh = this.twoDigitPad(h),
            HH = this.twoDigitPad(hour),
            mm = this.twoDigitPad(minute),
            ss = this.twoDigitPad(second),
            aaa = hour < 12 ? 'AM' : 'PM',
            EEEE = this.dayOfWeekNames[date.getDay()],
            EEE = EEEE.substr(0, 3),
            dd = this.twoDigitPad(day),
            M = month + 1,
            MM = this.twoDigitPad(M),
            MMMM = this.monthNames[month],
            MMM = MMMM.substr(0, 3),
            yyyy = year + "",
            yy = yyyy.substr(2, 2)
            ;
        // checks to see if month name will be used
        patternStr = patternStr
            .replace('hh', hh).replace('h', h)
            .replace('HH', HH).replace('H', hour)
            .replace('mm', mm).replace('m', minute)
            .replace('ss', ss).replace('s', second)
            .replace('S', miliseconds)
            .replace('dd', dd).replace('d', day)

            .replace('EEEE', EEEE).replace('EEE', EEE)
            .replace('yyyy', yyyy)
            .replace('yy', yy)
            .replace('aaa', aaa);
        if (patternStr.indexOf('MMM') > -1) {
            patternStr = patternStr
                .replace('MMMM', MMMM)
                .replace('MMM', MMM);
        }
        else {
            patternStr = patternStr
                .replace('MM', MM)
                .replace('M', M);
        }
        return patternStr;
    }

    this.getDifferenceInDays = function getDifferenceInDays(date1, date2) {
        const diffInMs = Math.abs(date2 - date1);
        return diffInMs / (1000 * 60 * 60 * 24);
    }

    this.getDifferenceInHours = function getDifferenceInHours(date1, date2) {
        const diffInMs = Math.abs(date2 - date1);
        return diffInMs / (1000 * 60 * 60);
    }

    this.getDifferenceInMinutes = function getDifferenceInMinutes(date1, date2) {
        const diffInMs = Math.abs(date2 - date1);
        return diffInMs / (1000 * 60);
    }

    this.getDifferenceInSeconds = function getDifferenceInSeconds(date1, date2) {
        const diffInMs = Math.abs(date2 - date1);
        return diffInMs / 1000;
    }

    this.PASS_VALUE_AS_A_SECOUND = function (val) {
        var PASS_VALUE_AS_A_SECOUND = [];
        var Minute = Math.round(val / 60);
        var Hour = Math.round(val / 3600);
        var Day = Math.round(val / 86400);
        var Week = Math.round(val / 604800);
        var Month = Math.round(val / 2628000);
        var Year = Math.round(val / 31540000);
        var Decade = Math.round(val / 315400000);
        PASS_VALUE_AS_A_SECOUND = [{ Minute: Minute, Hour: Hour, Day: Day, Week: Week, Month: Month, Year: Year, Decade: Decade }];
        return PASS_VALUE_AS_A_SECOUND;
    }
    this.PASS_VALUE_AS_A_MINUTE = function convertMinute() {
        var val = parseFloat(document.getElementById("input_2").value);
        document.getElementById("input_1").value = roundnum(val * 60);
        document.getElementById("input_3").value = roundnum(val / 60);
        document.getElementById("input_4").value = roundnum(val / 1440);
        document.getElementById("input_5").value = roundnum(val / 10080);
        document.getElementById("input_6").value = roundnum(val / 43800);
        document.getElementById("input_7").value = roundnum(val / 525600);
        document.getElementById("input_8").value = roundnum(val / 5256000);
        document.getElementById("input_9").value = roundnum(val / 52560000);
        return true;
    }
    this.PASS_VALUE_AS_A_HOURE = function convertHour(val) {
        var val = parseFloat(document.getElementById("input_3").value);
        document.getElementById("input_1").value = roundnum(val * 3600);
        document.getElementById("input_2").value = roundnum(val * 60);
        document.getElementById("input_4").value = roundnum(val / 24);
        document.getElementById("input_5").value = roundnum(val / 168);
        document.getElementById("input_6").value = roundnum(val / 730.001);
        document.getElementById("input_7").value = roundnum(val / 8760);
        document.getElementById("input_8").value = roundnum(val / 87600);
        document.getElementById("input_9").value = roundnum(val / 876000);
        return true;
    }
    this.PASS_VALUE_AS_A_DAYS = function convertDay(val) {
        var val = parseFloat(document.getElementById("input_4").value);
        document.getElementById("input_1").value = roundnum(val * 86400);
        document.getElementById("input_2").value = roundnum(val * 1440);
        document.getElementById("input_3").value = roundnum(val * 24);
        document.getElementById("input_5").value = roundnum(val / 7);
        document.getElementById("input_6").value = roundnum(val / 30.4167);
        document.getElementById("input_7").value = roundnum(val / 365);
        document.getElementById("input_8").value = roundnum(val / 3650);
        document.getElementById("input_9").value = roundnum(val / 36500);
        return true;
    }
    this.PASS_VALUE_AS_A_WEEK = function convertWeek(val) {
        var val = parseFloat(document.getElementById("input_5").value);
        document.getElementById("input_1").value = roundnum(val * 604800);
        document.getElementById("input_2").value = roundnum(val * 10080);
        document.getElementById("input_3").value = roundnum(val * 168);
        document.getElementById("input_4").value = roundnum(val * 7);
        document.getElementById("input_6").value = roundnum(val / 4.34524);
        document.getElementById("input_7").value = roundnum(val / 52.1429);
        document.getElementById("input_8").value = roundnum(val / 521.429);
        document.getElementById("input_9").value = roundnum(val / 5214.29);
        return true;
    }
    this.PASS_VALUE_AS_A_MONTH = function convertMonth() {
        var val = parseFloat(document.getElementById("input_6").value);
        document.getElementById("input_1").value = roundnum(val * 2628000);
        document.getElementById("input_2").value = roundnum(val * 43800);
        document.getElementById("input_3").value = roundnum(val * 730.001);
        document.getElementById("input_4").value = roundnum(val * 30.4167);
        document.getElementById("input_5").value = roundnum(val * 4.34524);
        document.getElementById("input_7").value = roundnum(val / 12);
        document.getElementById("input_8").value = roundnum(val / 120);
        document.getElementById("input_9").value = roundnum(val / 1200);
        return true;
    }
    this.PASS_VALUE_AS_A_YEAR = function convertYear() {
        var val = parseFloat(document.getElementById("input_7").value);
        document.getElementById("input_1").value = roundnum(val * 31540000);
        document.getElementById("input_2").value = roundnum(val * 525600);
        document.getElementById("input_3").value = roundnum(val * 8760);
        document.getElementById("input_4").value = roundnum(val * 365);
        document.getElementById("input_5").value = roundnum(val * 52.1429);
        document.getElementById("input_6").value = roundnum(val * 12);
        document.getElementById("input_8").value = roundnum(val / 10);
        document.getElementById("input_9").value = roundnum(val / 100);
        return true;
    }

    /////////////////////////////METHOD End //////////////////////////////////////////
    ////////////////////////////API//////////////////////////////

    this.PAYROLL_API = function (INPUT_PRA, ACTION_NAME) {
        var httprequest = '';
        var httprequest = $http({
            method: 'POST',
            url: CommService.Get_CASHUP_API() + 'api/PayrollAPI/' + ACTION_NAME,
            data: INPUT_PRA
        }).then(function (data) {
            RspData = data;
            return RspData;
        });
        return httprequest;
    }
    this.CASHUP_API = function (INPUT_PRA, ACTION_NAME) {
        var httprequest = '';
        var httprequest = $http({
            method: 'POST',
            url: CommService.Get_CASHUP_API() + 'api/CashupAPI/' + ACTION_NAME,
            data: INPUT_PRA
        }).then(function (data) {
            RspData = data;
            return RspData;
        });
        return httprequest;
    }
    this.CASHUP_APP_API = function (INPUT_PRA, ACTION_NAME) {
        var httprequest = '';
        var httprequest = $http({
            method: 'POST',
            url: CommService.GET_CASHUP_APP_API() + 'api/CashupAppAPI/' + ACTION_NAME,
            data: INPUT_PRA
        }).then(function (data) {
            RspData = data;
            return RspData;
        });
        return httprequest;
    }


    this.HR_API = function (INPUT_PRA, ACTION_NAME) {
        var httprequest = '';
        var httprequest = $http({
            method: 'POST',
            url: CommService.Get_HR_API() + 'api/HrAPI/' + ACTION_NAME,
            data: INPUT_PRA
        }).then(function (data) {
            RspData = data;
            return RspData;
        });
        return httprequest;
    }
    this.HUMANRESOURCE_API = function (INPUT_PRA, ACTION_NAME) {
        var httprequest = '';
        var httprequest = $http({
            method: 'POST',
            url: CommService.GET_HUMANRESOURCE_API() + 'api/HumanResourceAPI/' + ACTION_NAME,
            data: INPUT_PRA
        }).then(function (data) {
            RspData = data;
            return RspData;
        });
        return httprequest;
    }
    this.HUMANRESOURCE_API_SYNC = function (INPUT_PRA, ACTION_NAME) {
        var httprequest = '';
        var httprequest = $http({
            method: 'POST',
            url: CommService.GET_HUMANRESOURCE_API() + 'api/HumanResourceAPI/' + ACTION_NAME,
            data: INPUT_PRA
        }).then(function (data) {
            RspData = data;
            return RspData;
        });
        return httprequest;
    }

    this.DASHBOARD_API = function (INPUT_PRA, ACTION_NAME) {
        var httprequest = '';
        var httprequest = $http({
            method: 'POST',
            url: CommService.Get_CASHUP_API() + 'api/DashboardAPI/' + ACTION_NAME,
            data: INPUT_PRA
        }).then(function (data) {
            RspData = data;
            return RspData;
        });
        return httprequest;
    }
    this.ADMIN_API = function (INPUT_PRA, ACTION_NAME) {
        var httprequest = '';
        var httprequest = $http({
            method: 'POST',
            url: CommService.GET_ADMIN_API() + 'api/AdminAPI/' + ACTION_NAME,
            data: INPUT_PRA
        }).then(function (data) {
            RspData = data;
            return RspData;
        });
        return httprequest;
    }
    this.INVOICE_API = function (INPUT_PRA, ACTION_NAME) {
        var httprequest = '';
        var httprequest = $http({
            method: 'POST',
            url: CommService.GET_INVOICE_API() + 'api/InvoiceAPI/' + ACTION_NAME,
            data: INPUT_PRA
        }).then(function (data) {
            RspData = data;
            return RspData;
        });
        return httprequest;
    }
    this.PAYMENT_API = function (INPUT_PRA, ACTION_NAME) {
        var httprequest = '';
        var httprequest = $http({
            method: 'POST',
            url: CommService.GET_INVOICE_API() + 'api/PaymentAPI/' + ACTION_NAME,
            data: INPUT_PRA
        }).then(function (data) {
            RspData = data;
            return RspData;
        });
        return httprequest;
    }
    this.REPORT_API = function (INPUT_PRA, ACTION_NAME, PREFIX) {
        if (PREFIX == '' || PREFIX == undefined) {
            PREFIX = 'InventoryAPI'
        }
        var httprequest = '';
        var httprequest = $http({
            method: 'POST',
            url: CommService.GET_REPORT_API() + 'api/ReportsAPI/' + ACTION_NAME,
            data: INPUT_PRA
        }).then(function (data) {
            RspData = data;
            return RspData;
        });
        return httprequest;
    }
    this.LOGIN_API = function (INPUT_PRA, ACTION_NAME) {
        var httprequest = '';
        var httprequest = $http({
            method: 'POST',
            url: CommService.Get_Login_API() + 'api/LoginAPI/' + ACTION_NAME,
            data: INPUT_PRA
        }).then(function (data) {
            RspData = data;
            return RspData;
        });
        return httprequest;
    }

    this.P2P_API = function (INPUT_PRA, ACTION_NAME, API_KEY) {
        var httprequest = '';
        var httprequest = $http({
            method: 'POST',
            url: CommService.GET_P2P_API() + 'api/' + API_KEY + '/' + ACTION_NAME,
            data: INPUT_PRA
        }).then(function (data) {
            RspData = data;
            return RspData;
        });
        return httprequest;
    }

    this.DASHBOARD_MODULES_API = function (INPUT_PRA, ACTION_NAME, API_NAME) {
        var API_NAME_TEXT = 'DashboardAPI';
        if (API_NAME != undefined) {
            API_NAME_TEXT = API_NAME;
        }

        var httprequest = '';
        var httprequest = $http({
            method: 'POST',
            url: CommService.GET_DASHBOARD_API() + 'api/' + API_NAME_TEXT + '/' + ACTION_NAME,
            data: INPUT_PRA
        }).then(function (data) {
            RspData = data;
            return RspData;
        });
        return httprequest;
    }
    this.GET_BRANCH_LIST = function (ENTITY_ID, USER_ID, MODULE_ID) {
        var CashupModelObj = new Object();
        CashupModelObj.ENTITY_ID = ENTITY_ID;
        CashupModelObj.USER_ID = USER_ID;
        CashupModelObj.MODULE_ID = MODULE_ID;
        var httpreq = this.DASHBOARD_API(CashupModelObj, 'GET_BRANCH_LIST').then(function (data) {
            return data.data.Table;
        });
        return httpreq;
    };
    this.GET_CATEGORY_MASTER = function (CashupModelObj) {

        var httpreq = this.ADMIN_API(CashupModelObj, 'GET_CATEGORY_MASTER').then(function (data) {
            return data.data.Table;
        });
        return httpreq;
    };
    /////////////////////////////End //////////////////////////////////////////
});

app.controller('ForgotPasswordController', function ($scope, $http, $cookies, $window, $location, $localStorage, $filter, $timeout, CommService, ConfigurationService, CheckRole) {
    $scope.showhideTAB = false;
    $scope.ShowMessage = '';
    $scope.user = {
        username: '',
        password: '',
        urlparam: '',
        Key: '',
        EMAIL: '',
        confirmpassword: '',
    }
    $scope.passwordvalid = true;
    $scope.passwordfocus = false;
    $scope.CONFIRM_PASSWORD = true
    $scope.INVALID_LOGIN = false;
    $scope.uservalid = true;
    var input = $('.validate-input .input100');
    function validate(input) {
        if ($(input).attr('type') == 'email' && $(input).attr('name') == 'Useremail') {
            if ($(input).val().trim() == '') {
                $scope.UsernameValidationMessage = 'Enter User Email';
                $scope.uservalid = false;
                return false;
            }
            else if ($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                $scope.uservalid = false;
                $scope.UsernameValidationMessage = 'Enter valid User Email';
                return false;
            }
        }
        else {
            if ($scope.user.password == '') {
                $scope.passwordvalid = false;
                return false;
            }
        }
    }
    $scope.user.key = getUrlParameter('em', $location.absUrl());
    $scope.user.urlparam = getUrlParameter('x', $location.absUrl());
    $scope.ValidationStyle = "border: 1px solid white;border-radius: 10px !important;padding-left: 10px;";
    $scope.ValidateUpdate = function () {
        var validationCheck = true;
        for (var i = 0; i < input.length; i++) {
            if (validate(input[i]) == false) {
                validationCheck = false;
            }
        }
        if (validationCheck) {
            $scope.INVALID_LOGIN = false;
            $scope.overlay_loading = 'block';
            $scope.ValidationStyle = "border: 1px solid white;border-radius: 10px !important;padding-left: 10px;";
            //   window.location.href = '../login?em=' + $scope.user.urlparam;
            $scope.FORGOT_PASSWORD();
        }
        return validationCheck;
    }
    $scope.password_focus = function () {
        $scope.passwordvalid = true;
        $scope.passwordfocus = true;
    }
    $scope.username_focus = function () {
        $scope.usernamefocus = true;
        $scope.uservalid = true;
    }

    $scope.FORGOT_PASSWORD = function () {
        $scope.SubmitPassword.submitted = true;
        $scope.ShowMessage = '';
        if ($scope.SubmitPassword.$valid) {
            var GetAll = new Object();
            GetAll.CUSTOMER_ID = parseInt($cookies.get("CUSTOMERID"));
            GetAll.EMAIL = $scope.user.username;
            var httprequest = $http({
                method: 'POST',
                url: CommService.Get_Login_API() + 'api/LoginAPI/FORGOT_PASSWORD',
                data: GetAll
            }).then(function (data) {
                if (data.data == 1) {
                    $scope.showhideTAB = true;
                    $scope.ShowMessage = 'Password Reset link has been sent to your email.';
                    $scope.user.username = '';
                }
                if (data.data == 0) {
                    $scope.showhideTAB = false;
                    $scope.ShowMessage = 'Please enter a valid/registered username.';
                }
            });
        }
    }
});
app.controller('UpdatePasswordController', function ($scope, $http, $cookies, $window, $location, $localStorage, $filter, $timeout, CommService, ConfigurationService, CheckRole) {
    $scope.user = {
        username: '',
        password: '',
        urlparam: '',
        Key: '',
        EMAIL: '',
        confirmpassword: '',
    }
    $scope.passwordvalid = true;
    $scope.passwordfocus = false;
    $scope.CONFIRM_PASSWORD = true
    $scope.INVALID_LOGIN = false;
    $scope.uservalid = true;
    var input = $('.validate-input .input100');
    function validate(input) {
        if ($(input).attr('type') == 'email' && $(input).attr('name') == 'Useremail') {
            if ($(input).val().trim() == '') {
                $scope.UsernameValidationMessage = 'Enter User Email';
                $scope.uservalid = false;
                return false;
            }
            else if ($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                $scope.uservalid = false;
                $scope.UsernameValidationMessage = 'Enter valid User Email';
                return false;
            }
        }
        else {
            if ($scope.user.password == '') {
                $scope.passwordvalid = false;
                return false;
            }
        }
    }
    $scope.user.key = getUrlParameter('em', $location.absUrl());
    $scope.user.urlparam = getUrlParameter('x', $location.absUrl());

    $scope.ValidationStyle = "border: 1px solid white;border-radius: 10px !important;padding-left: 10px;";
    $scope.ValidateUpdate = function () {
        var validationCheck = true;
        for (var i = 0; i < input.length; i++) {
            if (validate(input[i]) == false) {
                validationCheck = false;
            }
        }
        if (validationCheck) {
            $scope.INVALID_LOGIN = false;
            $scope.overlay_loading = 'block';
            $scope.ValidationStyle = "border: 1px solid white;border-radius: 10px !important;padding-left: 10px;";
            //   window.location.href = '../login?em=' + $scope.user.urlparam;
            var x = $scope.user.urlparam.split(':;:');
            $scope.UPDATE_PASSWORD(x);
        }
        return validationCheck;
    }
    $scope.password_focus = function () {
        $scope.passwordvalid = true;
        $scope.passwordfocus = true;
    }
    $scope.VALIDATE_PASS_KEY = function () {
        x = $scope.user.urlparam.split(':;:');
        var GetAll = new Object();
        GetAll.PASS_KEY = x[0];
        GetAll.USER_ID = x[1];
        var httprequest = $http({
            method: 'POST',
            url: CommService.Get_Login_API() + 'api/AccountSettingAPI/VALIDATE_PASS_KEY',
            data: GetAll
        }).then(function (data) {
            if (data.data == 1) {
                $scope.showhideTAB = false;
                $scope.ShowMessage = '';
                $scope.user.username = '';
            }
            if (data.data == 0) {
                $scope.showhideTAB = true;
                $scope.ShowMessage = '"Your Password Reset link has expired."';
            }
        });
    }

    $scope.VALIDATE_PASS_KEY();
    $scope.UPDATE_PASSWORD = function (x) {
        $scope.SubmitPassword.submitted = true;
        if ($scope.SubmitPassword.$valid) {
            var GetAll = new Object();
            GetAll.OLD_PASSWORD = '';
            GetAll.NEW_PASSWORD = Sha1.hash($scope.user.password);
            GetAll.PASS_KEY = x[0];
            GetAll.USER_ID = x[1];
            var httprequest = $http({
                method: 'POST',
                url: CommService.Get_Login_API() + 'api/AccountSettingAPI/UPDATE_PASSWORD',
                data: GetAll
            }).then(function (data) {
                if (data.data == 1) {
                    $scope.passwordSucfail = false;
                    //$scope.$parent.ShowAlert('Success', 'Password changes Successfully.', 5000);
                    window.location.href = '../login';
                    //?em=' + x[0]
                }
                if (data.data == 0) {
                    $scope.passwordSucfail = true;
                    $scope.$parent.ShowAlert('Success', 'there is something wrong please try it again.', 5000);
                }
            });
        }
    }
});
