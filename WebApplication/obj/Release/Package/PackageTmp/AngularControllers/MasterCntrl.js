app.controller('MasterController', function ($scope, $http, $cookies, $filter, CommService, $window, $localStorage, PrcCommMethods, $location) {
    $scope.UPDATE_UEM = function () {
        var UEM = $cookies.get("UEM");
        var expireDate = new Date();
        var expireDate1 = new Date(expireDate.getTime() + parseInt(UEM) * 60000);
        $cookies.put('USERID', $cookies.get("USERID"), { 'path': '/', 'expires': expireDate1 });
    }
    $scope.CheckUserLogin = function () {
        if ($cookies.get("USERID") == undefined || $cookies.get("USERID") == null || $cookies.get("USERID") == '' || $cookies.get("USERID") == "null" || parseInt($cookies.get("USERID")) == 0) {
            $window.location.href = '/Login';
            return;
        }
        else if ($cookies.get("CREATED_BY") == undefined && $cookies.get("CREATED_BY") == "999999999") {
            if ($filter('lowercase')($location.absUrl()).indexOf("basic_details") != -1
                || $filter('lowercase')($location.absUrl()).indexOf("enter_sites") != -1
                || ($filter('lowercase')($location.absUrl()).indexOf("userjr") != -1)
                || ($filter('lowercase')($location.absUrl()).indexOf("invite_personal_details") != -1)) {
            }
            else {
                $window.location.href = '/Login';
            }
        }
        else {
            $scope.UPDATE_UEM();
        }
    };
    var onFocus = function () {
        $scope.CheckUserLogin();
        if (parseInt($cookies.get("USERID")) != parseInt($scope.USER_ID) && $cookies.get("CREATED_BY") != "999999999"
            || parseInt($cookies.get("ENTITY_ID")) != parseInt($scope.SELECTED_ENTITY_ID) && $cookies.get("CREATED_BY") != "999999999") {
            $window.location.href = '../Main/MainIndex';
        }
    }
    $scope.AppVersion = AppVersion;
    $scope.child_scope = {
    }
    $scope.EMAIL_PATTERN = /^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$/;
    $scope.PERCENTAGE_PATTERN = /(^100(\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\.[0-9]{1,2})?$)/;
    $scope.DISSABLE_WINDOW_ICON = true;
    $scope.UPLOAD_FOLDER_NAME = "Uploads";
    $scope.Fn_result = function () {
        //alert(selectedvalue)
    }
    $scope.IS_PLAIN = false;
    $scope.HIDE_HEADER_DETAIL = true;
    if (window.location.href.toLowerCase().indexOf("plain/index") != -1) {
        if (window.location.href.toLowerCase().indexOf("plain/index#!/clock_in_out") != -1 || window.location.href.toLowerCase().indexOf("hr/hrm_o_index") != -1) {
        }
        else {
            $cookies.put('CREATED_BY', 999999999, { 'path': '/' });
            $cookies.put('USERID', 1, { 'path': '/' });
        }
        $scope.IS_PLAIN = true;//EMPLOYEE
        //PASSKEY:;:EMAIL:;:FIRSTNAME:;:LASTNAME
    } else if (window.location.href.toLowerCase().indexOf("hr/hrindex") != -1) {
        //$cookies.put('MODULE_ID', 24, { 'path': '/' });
        if (window.location.href.toLowerCase().indexOf("plain/index#!/clock_in_out") != -1) {
        }
        else {
            $scope.IS_PLAIN = true;
            //$cookies.put('CUSTOMER_ID_HR', 51, { 'path': '/' });
            if ($filter('lowercase')($location.absUrl()).indexOf("basic_details") != -1
                || $filter('lowercase')($location.absUrl()).indexOf("enter_sites") != -1) {
                $cookies.put('USERID', getUrlParameter('ID', $location.absUrl()), { 'path': '/' });
                $cookies.put('USER_ID_HR', getUrlParameter('ID', $location.absUrl()), { 'path': '/' });
                $cookies.put('MODULE_ID_HR', 24, { 'path': '/' });
                $cookies.put('MODULE_ID', 24, { 'path': '/' });
                $cookies.put('CREATED_BY', 999999999, { 'path': '/' });
                $scope.HIDE_HEADER_DETAIL = false;
                $scope.IS_PLAIN = false;
            }
            else if ($filter('lowercase')($location.absUrl()).indexOf("userjr") != -1) {
                $cookies.put('MODULE_ID_HR', 24, { 'path': '/' });
                $cookies.put('MODULE_ID', 24, { 'path': '/' });
                $cookies.put('CREATED_BY', 999999999, { 'path': '/' });
                $cookies.put('USERID', 1, { 'path': '/' });
                $scope.HIDE_HEADER_DETAIL = false;
            }
            else if ($filter('lowercase')($location.absUrl()).indexOf("invite_personal_details") != -1) {
                $cookies.put('MODULE_ID_HR', 24, { 'path': '/' });
                $cookies.put('MODULE_ID', 24, { 'path': '/' });
                $cookies.put('CREATED_BY', 999999999, { 'path': '/' });
                $cookies.put('USERID', 1, { 'path': '/' });
                $scope.HIDE_HEADER_DETAIL = false;
            }
            else {
                if ($cookies.get("USERID") == "1") {
                    $window.location.href = '/Login';
                }
            }
        }
    }
    else {
        $scope.CheckUserLogin();
    }
    $window.onfocus = onFocus;
    $scope.overlay_loading = 'none';
    $scope.overlay_loadingNew = 'none';
    $scope.overlay_loading_coffee = 'none';
    $scope.IS_CREATE_SHIFT_EXCESS = false;
    $scope.IS_VIEW_SHIFT_EXCESS = false;
    $scope.VIEWMORERECORD = 'Click here to see more..';
    $scope.IS_ADMIN = false;
    $scope.RANDOM_NUMBER = ''
    $scope.TO_NUMBER_DECIMAL_FIVE = 5;
    $scope.TO_NUMBER_DECIMAL_TWO = 2;
    $scope.ADD_ON_TEXT = "Add more field"
    $scope.SOMETHINGWENTWRONG = 'Error - Something went wrong, Please contact support.';
    $scope.ACCESS_TEXT = "you don't have permission to access";
    $('.modal-backdrop').removeClass('modal-backdrop fade show');
    document.cookie = "FRESHDSK_EMAIL=" + $cookies.get("EMAIL");
    $scope.USER_ID = $cookies.get("USERID");
    $scope.User_Name = $cookies.get("NAME");
    $scope.User_Email = $cookies.get("EMAIL");
    $scope.CREATED_BY = $cookies.get("CREATED_BY");
    $scope.EMPLOYEE_ID = $cookies.get("EMPLOYEE_ID");
    $scope.SELECTED_ENTITY_NAME = $cookies.get("ENTITY_NAME");
    $scope.SELECTED_ENTITY_ID = $cookies.get("ENTITY_ID");
    $scope.CURRENCY_ID = $cookies.get("CURRENCY_ID");
    $scope.CURRENCY_CODE = $cookies.get("CURRENCY_CODE");
    $scope.CURRENCY_SYMBOL = $cookies.get("CURRENCY_SYMBOL");
    $scope.MODULE_ID = parseInt($cookies.get("MODULE_ID"));


    $scope.LOGO_PATH = $cookies.get("LOGO_PATH") == "null" || $cookies.get("LOGO_PATH") == "" ? "../E_Content/images/logo.png" : $cookies.get("LOGO_PATH");
    $scope.IMAGE_PATH = $cookies.get("IMAGE_PATH") == "null" || $cookies.get("IMAGE_PATH") == "" || $cookies.get("IMAGE_PATH") == "../dist/img/user1-128x128.jpg" ? "../dist/img/user1-128x128.jpg" : $cookies.get("IMAGE_PATH");
    $scope.DESIGNATION = $cookies.get("DESIGNATION");
    $scope.SelectedTab = parseInt($cookies.get("SELECTED_TAB"));
    $scope.DATE_FORMATE_LABEL = 'MMM d, yyyy';// In datePicker 
    $scope.LANGUAGE_SYMBOL = 'en-gb';
    $scope.DATE_FORMATE_LABEL_DD_MM_YYYY = 'dd/MM/yyyy';
    $scope.DATE_FORMATE_CULTURE = ["dd/MM/yyyy", "d/M/yyyy", "dd/MM/yyyy hh:mm:ss", "dd/MM/yyyy hh:mm:ss tt", "dd/MM/yyyy hh:mm:ss", "dd/MM/yyyy hh:mm:ss tt"];// check in upload excel according to en-gb
    $scope.ObjectHistoryData = {}
    $scope.COLMD = 'col-md-4';
    $scope.FETCHING_RECORDS = 'Fetching Records';
    $scope.NO_RECORD_FOUND = 'No Record Found';
    $scope.NO_COMMENTS = "No comments!"
    $scope.WRITE_A_COMMENT = "Write a comment..."
    $scope.PAGE_ARRAY_LIST = [{ ID: 10, NAME: 10 }, { ID: 20, NAME: 20 }, { ID: 30, NAME: 30 }, { ID: 50, NAME: 50 }, { ID: 100, NAME: 100 }, { ID: 200, NAME: 200 }]

    $scope.INS_LOGOUT_LOG = function (USER_ID) {
        $window.location.href = "../Login/Index";
    }
    if ($scope.CREATED_BY != 999999999 && $scope.CREATED_BY !== undefined) { $scope.ENTITY_LIST = JSON.parse($localStorage.ENTITY_LIST); }

    var objarray = [];
    $scope.increment = function (val, charCode) {
        if (charCode.which == 43 && charCode.which == 45 && charCode.which == 46 || (charCode.which >= 48 && charCode.which <= 57)) {
            if (val != "" && val != undefined) { objarray.push(val) }
        }
        else {
            charCode.preventDefault();
        }
        if (val != "" && val != undefined) {
            var a = objarray.length;
            Result = $scope.$eval(objarray[a - 1]);
        }
        if (Result == undefined || Result == null) {
            Result = "";
        }
        $scope.PlusMinusValuenew = Result;

    };
    $scope.CheckSubModuleAccess = function (PRIVILEGE_ID) {
        if ($scope.CREATED_BY != 999999999) {
            if ($localStorage.USER_PRIVILEGE != undefined) {
                $scope.USER_PRIVILEGE = JSON.parse($localStorage.USER_PRIVILEGE);
                var PRIVILEGE = $scope.USER_PRIVILEGE.filter(function (PRIVILEGE) {
                    if (parseInt(PRIVILEGE.PRIVILEGE_ID) == 40) {
                        return true;
                    }
                    else if (parseInt(PRIVILEGE.PRIVILEGE_ID) == PRIVILEGE_ID) {
                        return true;
                    }
                });
                if (PRIVILEGE.length > 0) {
                    if (PRIVILEGE[0].PRIVILEGE_ID == 40) {
                        return true;
                    }
                    else {
                        return parseInt(PRIVILEGE[0].PRIVILEGE_ID) == PRIVILEGE_ID;
                    }
                }
            }
            return false;
        }
        else {
            return false;
        }
    }
    $scope.CheckAdminModuleAccess = function (MODULE_ID) {
        if ($localStorage.MODULE_IDS_FOR_CONTROL_PANEL != undefined) {
            $scope.MODULE_IDS_FOR_CONTROL_PANEL = JSON.parse($localStorage.MODULE_IDS_FOR_CONTROL_PANEL);
            var MODULE_ID_DTLS = $scope.MODULE_IDS_FOR_CONTROL_PANEL.filter(function (MODULE) {
                if (parseInt(MODULE.MODULE_ID) == 999) {
                    return true;
                }
                else if (parseInt(MODULE.MODULE_ID) == MODULE_ID) {
                    return true;
                }
            });
            if (MODULE_ID_DTLS.length > 0) {
                if (MODULE_ID_DTLS[0].MODULE_ID == 999) {
                    return true;
                }
                else {
                    return parseInt(MODULE_ID_DTLS[0].MODULE_ID) == MODULE_ID;
                }
            }
        }
        return false;
    }
    $scope.CheckStandardRoleAccess = function (STANDARD_ROLE_ID) {
        if ($scope.CREATED_BY != 999999999) {
            if ($localStorage.USER_PRIVILEGE != undefined) {
                $scope.USER_STANDARD_ROLE = JSON.parse($localStorage.USER_PRIVILEGE);
                var STANDARD_ROLE = $scope.USER_STANDARD_ROLE.filter(function (STANDARD_ROLE) {
                    if (parseInt(STANDARD_ROLE.STANDARD_ROLE_ID) == STANDARD_ROLE_ID) {
                        return true;
                    }
                });
                if (STANDARD_ROLE.length > 0) {
                    if (STANDARD_ROLE[0].STANDARD_ROLE_ID == 40) {
                        return true;
                    }
                    else {
                        return parseInt(STANDARD_ROLE[0].STANDARD_ROLE_ID) == STANDARD_ROLE_ID;
                    }
                }
            }
            return false;
        }
        else {
            return false;
        }
    }
    $scope.CheckEmployeepermission = function (_entityid, _branchid, STANDARD_ROLE_ID) {
        if ($scope.CREATED_BY != 999999999) {
            if ($localStorage.EMPLOYEE_ACCESS_LIST != undefined) {
                $scope.EMPLOYEE_PERMISSION_LIST = JSON.parse($localStorage.EMPLOYEE_ACCESS_LIST);
                var VAR_EMPLOYEE_PERMISSION = $scope.EMPLOYEE_PERMISSION_LIST.Permission.filter(function (EMPLOYEE_PERMISSION) {
                    if (parseInt(EMPLOYEE_PERMISSION.STANDARD_ROLE_ID) == STANDARD_ROLE_ID) { return true; }
                });
                if (VAR_EMPLOYEE_PERMISSION.length > 0) {
                    return VAR_EMPLOYEE_PERMISSION[0].ACTIVE;
                }
            }
            return false;
        }
        else {
            return false;
        }
    }
    $scope.CheckEmployeeAccess = function (_entityid, _branchid, _checkaccesscolumn) {
        if ($scope.CREATED_BY != 999999999) {
            if ($localStorage.EMPLOYEE_ACCESS_LIST != undefined) {
                $scope.EMPLOYEE_ACCESS_LIST = JSON.parse($localStorage.EMPLOYEE_ACCESS_LIST);
                var VAR_EMPLOYEE_ACCESS = $scope.EMPLOYEE_ACCESS_LIST.Table.filter(function (EMPLOYEE_ACCESS) {
                    if (parseInt(EMPLOYEE_ACCESS.BRANCH_ID) == _branchid) { return true; }
                });
                if (VAR_EMPLOYEE_ACCESS.length > 0) {
                    if (_checkaccesscolumn == "EDIT_EMPLOYEE") {
                        return VAR_EMPLOYEE_ACCESS[0].TIME_SHEETS;
                    }
                    else if (_checkaccesscolumn == "SHOW_WAGE") {
                        return VAR_EMPLOYEE_ACCESS[0].SHOW_WAGE;
                    }
                }
            }
            return false;
        }
        else {
            return false;
        }
    }
    $scope.CheckEmployeeAllBranchAccess = function (_checkaccesscolumn) {
        if ($localStorage.EMPLOYEE_ACCESS_LIST != undefined && $scope.CREATED_BY != 999999999) {
            $scope.EMPLOYEE_ACCESS_LIST = JSON.parse($localStorage.EMPLOYEE_ACCESS_LIST);
            var result = false;
            for (var i = 0; i < $scope.EMPLOYEE_ACCESS_LIST.Table.length; i++) {
                //   if ($scope.EMPLOYEE_ACCESS_LIST.Table[i].ACTIVE) {
                if (_checkaccesscolumn == "EDIT_EMPLOYEE") {
                    if ($scope.EMPLOYEE_ACCESS_LIST.Table[i].TIME_SHEETS) {
                        result = $scope.EMPLOYEE_ACCESS_LIST.Table[i].TIME_SHEETS;
                        break;
                    }
                }
                else if (_checkaccesscolumn == "SHOW_WAGE") {
                    if ($scope.EMPLOYEE_ACCESS_LIST.Table[i].SHOW_WAGE) {
                        result = $scope.EMPLOYEE_ACCESS_LIST.Table[i].SHOW_WAGE;
                        break;
                    }
                }
                else if (_checkaccesscolumn == "FEED_ACCESS") {
                    if ($scope.EMPLOYEE_ACCESS_LIST.Table[i].FEED_ACCESS) {
                        result = $scope.EMPLOYEE_ACCESS_LIST.Table[i].FEED_ACCESS;
                        break;
                    }
                }
                //}
            }
            return result;
        }
        return false;
    }
    $scope.CHECK_MODULE_ACCESS = function (PRIVILEGE_ID, REIGHTS_MASTER_IDS) {
        //1 View//2 Add//3 Edit//4 Delete // 5 Uploads
        if ($scope.CREATED_BY != 999999999) {
            $scope.USER_PRIVILEGE = JSON.parse($localStorage.USER_PRIVILEGE);
            var PRIVILEGE = $scope.USER_PRIVILEGE.filter(function (PRIVILEGE) {
                if (parseInt(PRIVILEGE.PRIVILEGE_ID) == 40) {
                    return true;
                }
                else if (parseInt(PRIVILEGE.PRIVILEGE_ID) == PRIVILEGE_ID) {
                    return true;
                }
            });
            if (PRIVILEGE.length > 0) {
                if (PRIVILEGE[0].PRIVILEGE_ID == 40) {
                    return true;
                }
                else {
                    var array = JSON.parse("[" + PRIVILEGE[0].RIGHTS_MASTER_IDS + "]");
                    const found = array.find(element => element == REIGHTS_MASTER_IDS);
                    if (found > 0) {
                        return true;
                    }
                    else {
                        return false;
                    }

                }
            }
            return false;
        }
        else {
            return true;
        }
    }
    $scope.CheckModuleAccessWithOutAdmin = function (PRIVILEGE_ID) {
        if ($scope.CREATED_BY != 999999999) {
            $scope.USER_PRIVILEGE = JSON.parse($localStorage.USER_PRIVILEGE);
            var PRIVILEGE = $scope.USER_PRIVILEGE.filter(function (PRIVILEGE) { return parseInt(PRIVILEGE.PRIVILEGE_ID) == PRIVILEGE_ID });
            if (PRIVILEGE.length > 0) { parseInt(PRIVILEGE[0].PRIVILEGE_ID) == PRIVILEGE_ID; return true; }
            return false;
        }
        else {
            return false;
        };
    };
    $scope.SCROLL_TOP = function () {
        $('body,html').animate({
            scrollTop: 0
        }, 500);
    }
    $scope.SELECTED_TAB_NAME = window.location.hash.substr(3);
    $scope.MENU_CLICK = function (ACTIVE_MENU, ACTIVE_MENU_NAME) {
        $cookies.put('SELECTED_TAB', ACTIVE_MENU, { 'path': '/' });
        $scope.SelectedTab = parseInt($cookies.get("SELECTED_TAB"));
        $scope.SELECTED_TAB_NAME = ACTIVE_MENU_NAME;
    }
    $scope.RE_DIRECT = function () {
        //if (localStorage.page_available == null || localStorage.page_available == undefined || localStorage.page_available == "") {
        window.open('../Plain/Index#!/Clock_In_Out', '_blank');
        //}
        //else {
        //   alert("One more page already open");
        //}
    }
    $scope.InitializeEntity = function (FQ) {
        FQ.SELECTED = false;
        if (FQ.ENTITY_ID == parseInt($cookies.get("ENTITY_ID"))) {
            $scope.SELECTED_ENTITY_NAME = FQ.ENTITY_NAME;
            FQ.SELECTED = true;
        }
    }

    $scope.SelectEntity = function (FQ, PATH_FLAG, USER_ID, ENTITY_LIST) {
        if (PATH_FLAG == 'HRM_ADMIN') {//When user come from UserJR Page
            $scope.ENTITY_LIST = ENTITY_LIST;
        }
        angular.forEach($scope.ENTITY_LIST, function (val) {
            val.SELECTED = false;
        });
        FQ.SELECTED = true;
        $scope.SELECTED_ENTITY_NAME = FQ.ENTITY_NAME;
        $cookies.put('CURRENCY_ID', FQ.CURRENCY_ID, { 'path': '/' });
        $cookies.put('CURRENCY_CODE', FQ.CURRENCY_CODE, { 'path': '/' });
        $cookies.put('TWO_DIGIT_COUNTRY_CODE', FQ.TWO_DIGIT_COUNTRY_CODE, { 'path': '/' });
        $cookies.put('CURRENCY_SYMBOL', FQ.CURRENCY_SYMBOL, { 'path': '/' });
        $cookies.put('TIMEZONE_OFFSET', FQ.TIMEZONE_OFFSET, { 'path': '/' });
        $cookies.put('ENTITY_ID', FQ.ENTITY_ID, { 'path': '/' });
        $cookies.put('ENTITY_NAME', FQ.ENTITY_NAME, { 'path': '/' });
        $cookies.put('EMPLOYEE_ID', FQ.EMPLOYEE_PERSONAL_ID, { 'path': '/' });
        let EMPLY_PRSNL_ID = FQ.EMPLY_PRSNL_ID == undefined || FQ.EMPLY_PRSNL_ID == null || FQ.EMPLY_PRSNL_ID == '' ? 0 : FQ.EMPLY_PRSNL_ID;
        $cookies.put('EMPLY_PRSNL_ID', EMPLY_PRSNL_ID, { 'path': '/' });
        $cookies.put('COUNTRY_ID', FQ.COUNTRY_ID, { 'path': '/' });
        $cookies.put('CUSTOMER_ID', FQ.CUSTOMER_ID, { 'path': '/' });
        $cookies.put('LOGO_PATH', FQ.LOGO_PATH, { 'path': '/' });
        $cookies.put('ENTITY_CREATION_YEAR', FQ.ENTITY_CREATION_YEAR, { 'path': '/' });
        $cookies.put('BRANCH_ID', "", { 'path': '/' });
        if (FQ.CURRENCY_CULTURE == undefined) {
            $cookies.put('CURRENCY_CULTURE', 'en-GB', { 'path': '/' });
        }
        else {
            $cookies.put('CURRENCY_CULTURE', FQ.CURRENCY_CULTURE, { 'path': '/' });
        }
        $localStorage.ENTITY_SETTINGS = undefined;
        delete $localStorage.USER_PRIVILEGE;
        //delete $localStorage.ENTITY_LIST;
        delete $localStorage.MODULE_LIST;
        delete $localStorage.SUB_MODULE_LIST;
        delete $localStorage.BRANCH_LOGIN_LIST;
        delete $localStorage.USER_FILTERS_LIST;
        delete $localStorage.HUMAN_RESOURCE_BRANCH_LIST;
        //delete $localStorage.EMPLOYEE_ACCESS_LIST;
        delete $localStorage.EMPLOYEE_ACCESS_LIST;



        //$localStorage.MODULE_LIST = undefined;
        //$localStorage.SUB_MODULE_LIST = undefined;
        //$localStorage.BRANCH_LOGIN_LIST = undefined;
        //$localStorage.USER_PRIVILEGE = undefined;


        $scope.User_Email = $cookies.get("EMAIL");
        $scope.CREATED_BY = $cookies.get("CREATED_BY");
        $scope.EMPLOYEE_ID = $cookies.get("EMPLOYEE_ID");
        $scope.SELECTED_ENTITY_NAME = $cookies.get("ENTITY_NAME");
        $scope.SELECTED_ENTITY_ID = $cookies.get("ENTITY_ID");
        $scope.CURRENCY_ID = $cookies.get("CURRENCY_ID");
        $scope.CURRENCY_CODE = $cookies.get("CURRENCY_CODE");
        $scope.CURRENCY_SYMBOL = $cookies.get("CURRENCY_SYMBOL");
        $scope.LOGO_PATH = $cookies.get("LOGO_PATH") == "null" || $cookies.get("LOGO_PATH") == "" ? "~/E_Content/images/logo.png" : $cookies.get("LOGO_PATH");
        $scope.IMAGE_PATH = $cookies.get("IMAGE_PATH") == "null" || $cookies.get("IMAGE_PATH") == "" ? "../dist/img/user1-128x128.jpg" : $cookies.get("IMAGE_PATH");
        $scope.DESIGNATION = $cookies.get("DESIGNATION");
        if (PATH_FLAG == 'HRM_ADMIN') {
            $cookies.put('USERID', USER_ID, { 'path': '/' });
            $cookies.put('CREATED_BY', USER_ID, { 'path': '/' });
            $scope.CREATED_BY = USER_ID;
            $scope.HIDE_HEADER_DETAIL = true;

            $scope.ADMIN_GET_ENTITY_LIST(PATH_FLAG);

        }
        else if (PATH_FLAG == 'HRM_ASIDE') {
            // window.location.reload();
            $scope.GET_ENTITY_MODULES($cookies.get("ENTITY_ID"), 'ASIDE_CLICK')
        }
        else if (PATH_FLAG == 'APP_SUIT') {
            window.location.href = "../Main/MainIndex";
        }
        else {
            ///   window.location.href = "../Main/MainIndex";
        }
    }
    $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
        //  $('.contentHolder').perfectScrollbar({ suppressScrollX: true });
        var date_inputs = document.getElementsByName("datecontrol") //our date input has the name "date"

        $(function () {
            $('[data-toggle="tooltip"]').tooltip();
            $('[data-toggle="popover"]').popover();
        });
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
                    format: 'M dd, yyyy',
                    startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate())
                };
                date_input.datepicker(options);
            }
        }

        $scope.overlay_loading = 'none';

        $scope.overlay_loading_coffee = 'none';

        let element = document.querySelector('#FIELD_NAME35810');
        if (element != null) {
            element.addEventListener('change', function () {
                element.value = this.value.toUpperCase();
            });
        }
    });
    $(document).ready(function () {
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
                    format: 'M dd, yyyy',
                    startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate())
                };
                date_input.datepicker(options);
            }
        };




    });
    $scope.imagesrc = [];
    $scope.generaterandom = function (n) {
        var add = 1, max = 12 - add;   // 12 is the min safe number Math.random() can generate without it starting to pad the end with zeros.   
        if (n > max) {
            return $scope.generaterandom(max) + $scope.generaterandom(n - max);
        }
        max = Math.pow(10, n + add);
        var min = max / 10; // Math.pow(10, n) basically
        var number = Math.floor(Math.random() * (max - min + 1)) + min;
        return ("" + number).substring(add);
    }
    var data = new Date();
    $scope.DASHBOARD_DATA = data;
    $scope.DateInputLoad = function (FLAG, SET_MONTH) {
        $(document).ready(function () {
            if (FLAG == "OPEN_ALL") {
                var date_inputs = document.getElementsByClassName("dateinputOpen") //our date input has the name "date"
            }
            else {
                var date_inputs = document.getElementsByClassName("dateinput") //our date input has the name "date"
            }
            $(function () {
                $('[data-toggle="tooltip"]').tooltip();
                $('[data-toggle="popover"]').popover();
            });
            if (date_inputs.length > 0) {
                for (var i = 0; i < date_inputs.length; i++) {
                    var date_input = $('input[name="' + date_inputs[i].name + '"]'); //our date input has the name "date"
                    var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
                    var date = new Date();
                    var getMonth = date.getMonth();
                    var getDate = date.getDate();
                    if (FLAG == "PO_REQ" || FLAG == "HRM_LEAVE" || SET_MONTH > 0) {
                        // var getMonth = date.getMonth()
                        date.setMonth(date.getMonth() - SET_MONTH);
                        getDate = 1;
                    }
                    else if (FLAG == "OPEN_ALL") {
                        // var getMonth = date.getMonth()
                        date.setMonth(date.getMonth() - SET_MONTH);
                        getDate = 1;
                    }
                    else if (FLAG == "EDIT_INVOICE") {
                        // var getMonth = date.getMonth()
                        date.setMonth(date.getMonth() - SET_MONTH);
                        getDate = 1;
                    }
                    var options = {
                        todayBtn: "linked",
                        daysOfWeekHighlighted: "0,6",
                        autoclose: true,
                        todayHighlight: true,
                        format: 'M dd, yyyy',
                        clearBtn: true,
                        closeBtn: true,// close button visible
                        startDate: (FLAG == "OPEN_ALL" ? null : new Date(date.getFullYear(), date.getMonth(), getDate))
                    };
                    date_input.datepicker(options);
                }

            }
        });
    }
    $scope.GET_LOCAL_TIME_ZONE = function () {

        const date = new Date();
        const offsetInMinutes = date.getTimezoneOffset();
        const totalMinutes = Math.abs(offsetInMinutes);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        const sign = offsetInMinutes <= 0 ? "+" : "-";
        const gmtOffset = `${sign}${hours}:${minutes.toString().padStart(2, '0')}`;
        return gmtOffset
    }
    $scope.LOAD_DATE_INPUT = function (FLAG, SET_MONTH, index, ParmDate) {
        $(document).ready(function () {
            if (index != undefined) {
                var date_inputs = document.getElementsByClassName("dateinput" + index) //our date input has the name "date"

            } else {
                if (FLAG == "OPEN_ALL") {
                    var date_inputs = document.getElementsByClassName("dateinputOpen") //our date input has the name "date"
                }
                else {
                    var date_inputs = document.getElementsByClassName("dateinput") //our date input has the name "date"
                }
            }
            $(function () {
                $('[data-toggle="tooltip"]').tooltip();
                $('[data-toggle="popover"]').popover();
            });
            if (date_inputs.length > 0) {
                for (var i = 0; i < date_inputs.length; i++) {
                    var date_input = $('input[name="' + date_inputs[i].name + '"]'); //our date input has the name "date"
                    var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
                    if (ParmDate != undefined) {
                        var date = new Date(ParmDate);
                    }
                    else {
                        var date = new Date($scope.SERVER_CURRENT_TIME);
                    }
                    var getMonth = date.getMonth();
                    var getDate = date.getDate();
                    if (ParmDate != undefined) {
                    }
                    else if (FLAG == "HRM") {
                        date.setMonth(getMonth - SET_MONTH);
                    }
                    else if (FLAG == "HRM_LEAVE" || SET_MONTH > 0) {
                        date.setMonth(getMonth - SET_MONTH);
                        getDate = 1;
                    }
                    var options = {
                        todayBtn: "linked",
                        daysOfWeekHighlighted: "0,6",
                        autoclose: true,
                        todayHighlight: true,
                        format: 'dd/mm/yyyy',
                        clearBtn: true,
                        closeBtn: true,// close button visible
                        startDate: (FLAG == "OPEN_ALL" ? null : new Date(date.getFullYear(), date.getMonth(), getDate))
                    };
                    date_input.datepicker(options);
                }

            }
        });
    }
    $scope.DATE_INPUT_LOAD = function (FLAG, SET_MONTH, index, date) {
        if ($scope.SERVER_CURRENT_TIME == undefined || $scope.SERVER_CURRENT_TIME == null || $scope.SERVER_CURRENT_TIME == '') {
            var ModelObj = new Object();
            ModelObj.TIMEZONE_OFFSET = $scope.GET_LOCAL_TIME_ZONE();
            ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            ModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
            PrcCommMethods.HR_API(ModelObj, 'GET_UTC_TIME').then(function (data) {
                $scope.SERVER_CURRENT_TIME = data.data;
                $scope.LOAD_DATE_INPUT(FLAG, SET_MONTH, index, date);
            });
        } else {
            $scope.LOAD_DATE_INPUT(FLAG, SET_MONTH, index, date);
        }
    }
    $scope.DateInputLoadStartForm = function (LL) {
        $(document).ready(function () {
            var date_inputs = document.getElementsByClassName("DateInputLoadStartForm") //our date input has the name "date"
            $(function () {
                $('[data-toggle="tooltip"]').tooltip();
                $('[data-toggle="popover"]').popover();
            });
            if (date_inputs.length > 0) {
                for (var i = 0; i < date_inputs.length; i++) {
                    var date_input = $('input[name="' + date_inputs[i].name + '"]'); //our date input has the name "date"
                    var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
                    var date = new Date(LL.TODAY_DATE);
                    var options = {
                        todayBtn: "linked",
                        daysOfWeekHighlighted: "0,6",
                        autoclose: true,
                        todayHighlight: true,
                        format: 'M dd, yyyy',
                        clearBtn: true,
                        closeBtn: true,// close button visible
                        startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate())
                    };
                    date_input.datepicker(options);
                }

            }
        });
    }
    $scope.DateInputLoadEndDate = function (LL) {
        $(document).ready(function () {
            var date_inputs = document.getElementsByClassName("DateInputLoadEndDate") //our date input has the name "date"
            $(function () {
                $('[data-toggle="tooltip"]').tooltip();
                $('[data-toggle="popover"]').popover();
            });
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
                        format: 'M dd, yyyy',
                        clearBtn: true,
                        closeBtn: true,// close button visible
                        endDate: new Date(date.getFullYear(), date.getMonth(), date.getDate())
                    };
                    date_input.datepicker(options);
                }

            }
        });
    }
    $scope.DisplayDetails = function (SelectedLine) {
        //console.log(SelectedLine)
        // $scope.GET_RFQ_LINES(SelectedLine);
        SelectedLine.TrBackColor == '#bcffd8' ? SelectedLine.TrBackColor = '' : SelectedLine.TrBackColor = '#bcffd8';
        if (SelectedLine.ShowDetails) {
            SelectedLine.ShowDetails = false;
            SelectedLine.RowBackgroundColor = '#ffffff;';
        }
        else {
            SelectedLine.ShowDetails = true;
            SelectedLine.RowBackgroundColor = '#e3f8e2;';
        }

    }
    $scope.dateinputOpenDateNew = function (LL) {
        $(document).ready(function () {
            var date_inputs = document.getElementsByClassName("dateinputOpenDateNew") //our date input has the name "date"
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
                        closeBtn: true,// close button visible
                        //  startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate())
                    };
                    date_input.datepicker(options).on("hide", function (e) {
                        if ($scope.CURRENT_CUSTOM_FIELD != '') {
                            if ($scope.CURRENT_CUSTOM_FIELD.FIELD_MASTER_ID == 353 || $scope.CURRENT_CUSTOM_FIELD.FIELD_MASTER_ID == 354) {
                                var index353 = $scope.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 353);
                                var index354 = $scope.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 354);
                                var START_DATE = $scope.CUSTOM_FIELDS_LIST[index353].FIELD_VALUE;
                                var END_DATE = $scope.CUSTOM_FIELDS_LIST[index354].FIELD_VALUE;
                                if (moment(START_DATE, "DD/MM/YYYY").toDate() > moment(END_DATE, "DD/MM/YYYY").toDate()) {
                                    if ($scope.CURRENT_CUSTOM_FIELD.FIELD_MASTER_ID == 353) {
                                        $scope.CUSTOM_FIELDS_LIST[index353].FIELD_VALUE = ''
                                        date_input.datepicker('clearDates');
                                        $scope.ShowAlert('Error', 'Directorship Start Date should be greater than Directorship End Date', 3000);
                                    }
                                    else if ($scope.CURRENT_CUSTOM_FIELD.FIELD_MASTER_ID == 354) {
                                        $scope.CUSTOM_FIELDS_LIST[index354].FIELD_VALUE = ''
                                        date_input.datepicker('clearDates');
                                        $scope.ShowAlert('Error', 'Directorship Start Date should be greater than Directorship End Date', 3000);
                                    }
                                }
                            }
                        }
                    })
                }
            }
        });
    }
    $scope.dateinputOpenDate = function (Position) {
        Position = Position == undefined ? "" : Position;
        $(document).ready(function () {
            var date_inputs = document.getElementsByClassName("dateinputOpenDate") //our date input has the name "date"
            if (date_inputs.length > 0) {
                for (var i = 0; i < date_inputs.length; i++) {
                    var date_input = $('input[name="' + date_inputs[i].name + '"]'); //our date input has the name "date"
                    var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
                    // var date = new Date();
                    var options = {
                        orientation: "auto " + Position,
                        todayBtn: "linked",
                        daysOfWeekHighlighted: "0,6",
                        autoclose: true,
                        forceParse: false,
                        todayHighlight: true,
                        format: 'M dd, yyyy',
                        clearBtn: true,
                        closeBtn: true,// close button visible
                        //  startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate())
                    };
                    date_input.datepicker(options);
                }
            }
        });
    }
    $scope.dateinputOpenDateddmmyyyy = function () {
        $(document).ready(function () {
            var date_inputs = document.getElementsByClassName("dateinputOpenDateddmmyyyy") //our date input has the name "date"
            if (date_inputs.length > 0) {
                for (var i = 0; i < date_inputs.length; i++) {
                    var date_input = $('input[name="' + date_inputs[i].name + '"]'); //our date input has the name "date"
                    var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
                    // var date = new Date();
                    var options = {
                        todayBtn: "linked",
                        daysOfWeekHighlighted: "0,6",
                        autoclose: true,
                        todayHighlight: true,
                        format: 'dd/mm/yyyy',
                        closeText: 'Clear',
                        forceParse: false,
                        validateOnBlur: false,
                        clearBtn: true,
                        closeBtn: true,// close button visible
                        //  startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate())
                    };
                    date_input.datepicker(options)
                }
            }
        });
    }
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
                        endDate: '-18Y',
                        closeBtn: true,// close button visible
                        //  startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate())

                    };
                    date_input.datepicker(options).on("hide", function (e) {
                        if (e.date != undefined) {
                            var dateString = e.date;
                            var a = (moment(dateString, "DD/MM/YYYY").toDate());
                            var date1 = moment().subtract(13, 'years');
                            var date2 = moment(date1).subtract(100, 'years');
                            var SY = new Date(e.date).getFullYear();
                            var D2Y = new Date(date2).getFullYear();
                            if (SY <= D2Y) {
                                $scope.ShowAlert('Error', 'Please select valid date format', 3000);
                                date_input.datepicker('clearDates');
                            };
                            if (moment(dateString, "DD/MM/YYYY").toDate() >= date1) {
                                $scope.ShowAlert('Error', 'Your age should be more than 13 Years.', 3000);
                                date_input.datepicker('clearDates');
                            };
                        }
                    })
                }
            }
        });
    }
    $scope.dateinputOpenDate();
    $scope.SetUpDateRangeMultiDatePicker = function (ControlName, startDate, endDate, FunctionName, DEFAULT_DISPLAY_FLAG, ARROW_POSITION, OpenFlag) {
        //var eventDates = {};
        //eventDates[new Date('02/07/2022')] = new Date('02/07/2022');
        //eventDates[new Date('02/12/2022')] = new Date('02/12/2022');
        //eventDates[new Date('02/18/2022')] = new Date('02/18/2022');
        //eventDates[new Date('02/23/2022')] = new Date('02/23/2022');
        $('#' + ControlName).daterangepicker({
            startDate: startDate,
            endDate: endDate,
            "opens": ARROW_POSITION == undefined ? "right" : "left",
            "linkedCalendars": false,
            "showCustomRangeLabel": true,
            ranges: {
                'Today': [moment(), moment()],
                'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Current Week': [moment().subtract(data.getDay() - 1, 'days'), moment().subtract(data.getDay() - 7, 'days')],
                'Last Week': [moment().subtract(6 + data.getDay(), 'days'), moment().subtract(data.getDay(), 'days')],
                'Current Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
            },
            //"alwaysShowCalendars": true,
            //locale: {
            //    format: 'DD-MMM-YYYY'
            //}
            locale: {
                format: 'M/DD hh:mm A',
                "customRangeLabel": "Custom Date",
                "weekLabel": "W",
                "daysOfWeek": [
                    "Su",
                    "Mo",
                    "Tu",
                    "We",
                    "Th",
                    "Fr",
                    "Sa"
                ],
                "monthNames": [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December"
                ],
                "firstDay": 1
            },

        }, FunctionName);

        if (DEFAULT_DISPLAY_FLAG == undefined || DEFAULT_DISPLAY_FLAG == 0) {
            FunctionName(startDate, endDate, 1);
            if (OpenFlag == "Open") {
                $('#' + ControlName).trigger('show.daterangepicker')
            }
        }

    };
    $scope.SetUpDateRangePicker = function (ControlName, startDate, endDate, FunctionName, DEFAULT_DISPLAY_FLAG) {
        $('#' + ControlName).daterangepicker({
            startDate: startDate,
            endDate: endDate,
            singleDatePicker: true,
            "linkedCalendars": false,
            ranges: {
                'Today': [moment(), moment()],
                'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Current Week': [moment().subtract(data.getDay() - 1, 'days'), moment().subtract(data.getDay() - 7, 'days')],
                'Last Week': [moment().subtract(6 + data.getDay(), 'days'), moment().subtract(data.getDay(), 'days')],
                'Current Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            },
            //locale: {
            //    format: 'DD-MMM-YYYY'
            //}
            locale: {
                format: 'M/DD hh:mm A',
                "customRangeLabel": "Custom Date",
                "weekLabel": "W",
                "daysOfWeek": [
                    "Su",
                    "Mo",
                    "Tu",
                    "We",
                    "Th",
                    "Fr",
                    "Sa"
                ],
                "monthNames": [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December"
                ],
                "firstDay": 1
            },

        }, FunctionName);
        if (DEFAULT_DISPLAY_FLAG == undefined || DEFAULT_DISPLAY_FLAG == 0) {
            FunctionName(startDate, endDate);
        }
    }
    $scope.ColorPicker = function (ColorPicker, OPEN_DTC, ColorPicker_Class_Flag) {
        OPEN_DTC == undefined ? OPEN_DTC = false : OPEN_DTC = true;
        ColorPicker_Class_Flag == undefined ? ColorPicker_Class_Flag = "pick-a-color" : ColorPicker_Class_Flag = ColorPicker_Class_Flag;

        $("." + ColorPicker_Class_Flag).pickAColor({
            showSpectrum: true,
            showSavedColors: true,
            saveColorsPerElement: true,
            fadeMenuToggle: true,
            showAdvanced: true,
            showBasicColors: true,
            showHexInput: false,
            allowBlank: false,
            inlineDropdown: OPEN_DTC
        });
        if (ColorPicker !== undefined) {
            document.getElementById('ids2').value = ColorPicker.DEPARTMENT_COLOR;
            var a = document.getElementsByClassName('current-color')
            a[0].style.backgroundColor = '#' + ColorPicker.DEPARTMENT_COLOR;
        }
    }
    $scope.Datelocaleformat = { format: 'MMM/DD/YYYY', }
    $scope.FilterModuleAccess = function (FILTER_PAGES_ID, PRAM_FILTER) {
        var Filter = [];
        if ($localStorage.USER_FILTERS_LIST != undefined) {
            $scope.USER_FILTERS_LIST = JSON.parse($localStorage.USER_FILTERS_LIST);
            Filter = $scope.USER_FILTERS_LIST.filter(function (FILTER) { return parseInt(FILTER.FILTER_PAGES_ID) == FILTER_PAGES_ID && FILTER.FILTERS_ID == PRAM_FILTER });
        }
        return Filter.length > 0 ? Filter[0] : "";
    }
    $scope.COMM_ROTA_LOAD = function () {
        var ShedulePage = $scope.FilterModuleAccess(1, 4);
        if (ShedulePage != "") {
            $scope.DEFAULT_ROTA_VIEW = ShedulePage.VALUE;
        }
    }
    if ($localStorage.USER_FILTERS_LIST != undefined) {
        $scope.COMM_ROTA_LOAD();
    }
    else {
        $scope.DEFAULT_ROTA_VIEW = "A_Week_View";
    }
    // NEW_HR_FLAG calling from new HR Schedule
    $scope.GET_USER_FILTERS = function (MODULE_ID, NEW_HR_FLAG) {
        if ($localStorage.USER_FILTERS_LIST == undefined || NEW_HR_FLAG) {
            var UserModelObj = new Object();
            UserModelObj.USER_ID = $cookies.get("USERID");
            UserModelObj.FILTER_PAGES_ID = 0;
            UserModelObj.ENTITY_ID = $cookies.get("ENTITY_ID");
            UserModelObj.MODULE_ID = MODULE_ID;
            PrcCommMethods.HR_API(UserModelObj, 'GET_USER_FILTERS').then(function (data) {
                if (data.data != null && data.data.Table.length > 0) {
                    if (NEW_HR_FLAG) {
                        $scope.child_scope.USER_FILTERS_LIST = data.data.Table;
                        $scope.child_scope.FETCHING_USER_FILTER = true;
                        $scope.child_scope.FILTER_LOAD_Fn();
                    } else {

                        $scope.USER_FILTERS_LIST = data.data.Table;
                        $localStorage.USER_FILTERS_LIST = JSON.stringify(data.data.Table);
                        $scope.COMM_ROTA_LOAD();
                    }
                } else {
                    if (NEW_HR_FLAG) {
                        $scope.child_scope.FETCHING_USER_FILTER = false;
                        $scope.child_scope.FILTER_LOAD_Fn();
                    }
                }
            });
        };
    };
    $scope.MASTER_GET_CUSTOMER_SETTINGS_VALUES = function (SETTING_MASTER_ID) {
        if ($localStorage.CUSTOMER_SETTING != undefined) {
            $scope.CUSTOMER_SETTING = JSON.parse($localStorage.CUSTOMER_SETTING);
            let CUSTOMER_SETTING = $scope.CUSTOMER_SETTING.find(SETTING => SETTING.SETTING_MASTER_ID == SETTING_MASTER_ID);
            if (CUSTOMER_SETTING != undefined) {
                return CUSTOMER_SETTING.SETTING_VALUE;
            }
        }
        //  return 0;
        return -9999;
    }
    $scope.MASTER_GET_CUSTOMER_SETTINGS = function (_param_tableids, calling_from_other_controller, NO_REDIRECTION, PATH_FLAG) {
        var readOnlyObject = new Object();
        readOnlyObject.CUSTOMER_ID = $cookies.get("CUSTOMER_ID");
        readOnlyObject.MODULE_ID = $cookies.get("MODULE_ID");
        readOnlyObject.TABLE_ID_LIST = [];
        //46	Time format // 47	First day of the week
        angular.forEach(_param_tableids.split(','), function (_loop_value) {
            var readonly = new Object();
            readonly.TABLE_ID = _loop_value;
            readOnlyObject.TABLE_ID_LIST.push(readonly);
        });
        PrcCommMethods.HUMANRESOURCE_API(readOnlyObject, 'GET_CUSTOMER_SETTINGS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.CUSTOMER_SETTING = JSON.stringify(data.data.Table);
                $localStorage.CUSTOMER_SETTING = JSON.stringify(data.data.Table);
                if (calling_from_other_controller) {
                    if (NO_REDIRECTION == "NO_REDIRECTION") {
                    }
                    else {
                        $location.path('Organisation').search('ID', parseInt($cookies.get("USERID")));
                    }
                } else {
                    if (PATH_FLAG == "ASIDE_CLICK") {
                        $scope.CLOSE_SIDE_BAR('entity_div_id');
                    }

                    window.location.href = '../Hr/HRIndex#!/Manager_Dashboard';
                }
            }
            else if (data.data == 0) {
                $scope.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
            else {
                if (PATH_FLAG == "ASIDE_CLICK") {
                    $scope.CLOSE_SIDE_BAR('entity_div_id');
                }
                window.location.href = '../Hr/HRIndex#!/Manager_Dashboard';
            }
        });
    };
    $scope.GET_BASE_DATA_FOR_POWER_INSIGHTS = function (Module) {
        if ($localStorage.SUB_MODULE_PAGE_LIST == undefined) {
            $scope.SUB_MODULE_PAGE_LIST = [];
            $scope.CURRENCY_LIST = [];
            $scope.SITE_LIST = [];
            var _pi_input_model_obj = new Object();
            _pi_input_model_obj.USER_ID = parseInt($cookies.get("USERID"));
            _pi_input_model_obj.MODULE_ID = parseInt($cookies.get("MODULE_ID"));
            _pi_input_model_obj.GET_PAGE_DATA = true;
            _pi_input_model_obj.GET_FILTER_DATA = true;
            PrcCommMethods.DASHBOARD_MODULES_API(_pi_input_model_obj, 'GET_BASE_DATA_FOR_POWER_INSIGHTS', 'POWERINSIGHTAPI').then(function (data) {
                if (data.data.SubModulePage_List.length > 0) {
                    $scope.SUB_MODULE_PAGE_LIST = data.data.SubModulePage_List;
                    $localStorage.SUB_MODULE_PAGE_LIST = JSON.stringify(data.data.SubModulePage_List);

                    $scope.CURRENCY_LIST = data.data.CurrencyList;
                    $scope.SITE_LIST = data.data.SiteList.filter(function (x) { x.IS_CHECK = true; return x });
                    if ($scope.SITE_LIST.length == 1) { }
                    if ($scope.CURRENCY_LIST.length > 0) { };
                    window.location.href = Module.REDIRECT_PATH;
                };
            });
        } else {
            $scope.SUB_MODULE_PAGE_LIST = JSON.parse($localStorage.SUB_MODULE_PAGE_LIST);
        }
    };
    $scope.ADMIN_GET_ENTITY_LIST = function (PATH_FLAG) {
        var UserModelObj = new Object();
        UserModelObj.CUSTOMER_ID = $cookies.get("CUSTOMER_ID");
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'ADMIN_GET_ENTITY_LIST').then(function (data) {
            if (data.data.Table.length > 0) {
                delete $localStorage.ENTITY_LIST;
                $localStorage.ENTITY_LIST = JSON.stringify(data.data.Table);
                $scope.GET_ENTITY_MODULES($cookies.get("ENTITY_ID"), PATH_FLAG)
            }
            else if (data.data == null) {
                $scope.$parent.ShowAlert("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
        });
    }
    $scope.HRM_GET_USER_MANAGEMENT_ACCESS = function (PATH_FLAG) {
        var UserModelObj = new Object();
        UserModelObj.CUSTOMER_ID = $cookies.get("CUSTOMER_ID");
        UserModelObj.ENTITY_ID = $cookies.get("ENTITY_ID");
        UserModelObj.EMPLY_PRSNL_ID = $cookies.get("EMPLY_PRSNL_ID");
        //UserModelObj.ADMIN_ENTITY_ID = $cookies.get("ENTITY_ID");
        UserModelObj.MODULE_ID = $cookies.get("MODULE_ID");
        UserModelObj.FLAG = 1;
        UserModelObj.STANDARD_ROLE_ID = $cookies.get("STANDARD_ROLE_ID");
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'HRM_GET_USER_MANAGEMENT_ACCESS').then(function (data) {
            $scope.EMPLOYEE_ACCESS_LIST = JSON.stringify(data.data);
            $localStorage.EMPLOYEE_ACCESS_LIST = JSON.stringify(data.data);
            $scope.MASTER_GET_CUSTOMER_SETTINGS('59,57,46,47,52,88,89,54,61,87,66,67,68', PATH_FLAG == "HRM_ADMIN" ? true : false, undefined, PATH_FLAG); // same function calling general controller, function (HRM_INS_UPD_HOLIDAY_CALENDAR_BRANCH_MAPPING). you need to update both places
        });
    }

    $scope.GET_CASHUP_SETUP_PERCENTAGE = function () {
        var CashupAppModelObj = new Object();
        CashupAppModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'GET_CASHUP_SETUP_PERCENTAGE').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.CASHUP_COMPLETION_PERCENTAGE = data.data.Table[0].COMPLETION_PERCENTAGE;
            }
            if (data.data.Table1.length > 0) {
                $scope.MISSING_ITEM_DESCRIPTION = data.data.Table1;
            }
            else {
                $scope.MISSING_ITEM_DESCRIPTION = [];
            }

            // 2. Select the element that will trigger the tooltip
            const tooltipTriggerEl = document.getElementById('cashup-completion-tooltip');

            // Proceed only if the element exists on the page
            if (tooltipTriggerEl) {
                let tooltipContent = 'All setup items are complete!';

                // 3. If there are items, format them into an HTML unordered list (<ul>)
                if ($scope.MISSING_ITEM_DESCRIPTION.length > 0) {
                    const listItems = $scope.MISSING_ITEM_DESCRIPTION.map((item, index) =>
                        `<li>${index + 1}. ${item.MISSING_ITEM_DESCRIPTION}</li>`
                    ).join('');

                    // Note the `text-start` class to align list items to the left
                    tooltipContent = `<ul class="list-unstyled mb-0 text-start">${listItems}</ul>`;
                }

                // 4. Initialize the Bootstrap Tooltip
                new bootstrap.Tooltip(tooltipTriggerEl, {
                    title: tooltipContent,      // The HTML content we just created
                    html: true,                 // IMPORTANT: This tells Bootstrap to render HTML
                    placement: 'top',           // Or 'bottom', 'left', 'right'
                    customClass: 'wide-tooltip' // Optional: A custom class for extra styling
                });
            }
        });
    }
    $scope.GET_CASHUP_SETUP_PERCENTAGE();


    $scope.CHECK_CASHUP_USER_PRIVILEGE = function (_privilege_id, _entity_id) {
        if ($scope.CHECK_CASHUP_PRIVILEGE(_privilege_id)) {
            if ($localStorage.USER_ROLES_BY_USER_ID != undefined) {
                $scope.CASHUP_SITES_LIST = JSON.parse($localStorage.USER_ROLES_BY_USER_ID);
                if ($scope.CASHUP_SITES_LIST != undefined && $scope.CASHUP_SITES_LIST != null && $scope.CASHUP_SITES_LIST.length > 0) {
                    $scope.CASHUP_SITES_LIST = $scope.CASHUP_SITES_LIST.filter(_row => _row.ENTITY_ID == _entity_id);
                    $scope.FILTERED_CASHUP_SITES_LIST = $scope.CASHUP_SITES_LIST.filter(function (site) {
                        if (!site.USER_PRIVILEGE_IDS) return false;
                        var userPrivileges = site.USER_PRIVILEGE_IDS.replace(/^,/, '').split(',');
                        return userPrivileges.includes(_privilege_id);
                    });
                    return $scope.FILTERED_CASHUP_SITES_LIST;
                }
                else {
                    return [];
                }
            }
            else {
                return [];
            }
        }
    }

    $scope.CHECK_CASHUP_PRIVILEGE = function (_privilege_id) {
        var hasRequiredPrivilege = JSON.parse($localStorage.CASHUP_PRIVILAGE_LIST).some(function (priv) {
            return priv.PRIVILEGE_ID == _privilege_id;
        });
        return hasRequiredPrivilege;
    }

    $scope.GET_USER_ROLES_BY_USER_ID_GET_PRIVILEGE = function (Module) {
        if ($localStorage.USER_ROLES_BY_USER_ID == undefined || $localStorage.CASHUP_PRIVILAGE_LIST == undefined) {
            var CashupAppModelObj = new Object();
            CashupAppModelObj.USER_ID = parseInt($cookies.get("USERID"));
            CashupAppModelObj.MODULE_ID = $cookies.get("MODULE_ID");
            CashupAppModelObj.ENTITY_ID = $cookies.get("ENTITY_ID");
            PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'GET_USER_ROLES_BY_USER_ID_GET_PRIVILEGE').then(function (data) {

                if (data.data.UserRoles != null && data.data.UserRoles.length > 0) {
                    $scope.USER_ROLES_BY_USER_ID = data.data.UserRoles;
                    $localStorage.USER_ROLES_BY_USER_ID = JSON.stringify(data.data.UserRoles);
                }
                else {
                    $scope.USER_ROLES_BY_USER_ID = [];
                }
                if (data.data.PrivilegeTable != null && data.data.PrivilegeTable.length > 0) {
                    $scope.CASHUP_PRIVILAGE_LIST = data.data.PrivilegeTable;
                    $localStorage.CASHUP_PRIVILAGE_LIST = JSON.stringify(data.data.PrivilegeTable);
                }
                else {
                    $scope.CASHUP_PRIVILAGE_LIST = [];
                }
                $scope.SELECTED_TAB_NAME = "AdminDashboard";
                window.location.href = Module.REDIRECT_PATH;
            });
        }
        else {
            $scope.USER_ROLES_BY_USER_ID = JSON.parse($localStorage.USER_ROLES_BY_USER_ID);
            $scope.CASHUP_PRIVILAGE_LIST = JSON.parse($localStorage.CASHUP_PRIVILAGE_LIST);
            if (Module) {
                $scope.SELECTED_TAB_NAME = "AdminDashboard";
                window.location.href = Module.REDIRECT_PATH;
            }
            return $scope.USER_ROLES_BY_USER_ID;
        }
    }

    $scope.GET_ENTITY_MODULE_ROLES = function (Module, PATH_FLAG) {
        $scope.GET_USER_FILTERS(Module.MODULE_ID);
        var UserModelObj = new Object();
        UserModelObj.MODULE_ID = Module.MODULE_ID;
        UserModelObj.USER_ID = parseInt($cookies.get("USERID"));
        UserModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        var httpRequest = $http({
            method: 'POST',
            url: CommService.Get_CASHUP_API() + 'api/LoginAPI/GET_ENTITY_MODULE_ROLES',
            data: UserModelObj
        }).then(function (data) {
            if ($cookies.get("USERID") == 31 || data.data != null && data.data.Table.length > 0) {
                $cookies.put('MODULE_ID', Module.MODULE_ID, { 'path': '/' });
                $scope.USER_PRIVILEGE = JSON.stringify(data.data.Table);
                $localStorage.USER_PRIVILEGE = JSON.stringify(data.data.Table);
                $cookies.put('STANDARD_ROLE_ID', data.data.Table[0].STANDARD_ROLE_ID, { 'path': '/' });


                //if (Module.MODULE_ID == 1) { //not commented beacause of old cashup not working 
                //    $scope.GET_USER_ROLES_BY_USER_ID_GET_PRIVILEGE(Module);
                //}
                if (Module.MODULE_ID == 1 && (Module.INTERNAL_REDIRECTION_PATH == '../Cashup/CashupAppIndex#!/Cashup_Dashboard' || Module.REDIRECT_PATH == '../Cashup/CashupAppIndex#!/Cashup_Dashboard')) { //not commented beacause of old cashup not working 
                    $scope.GET_USER_ROLES_BY_USER_ID_GET_PRIVILEGE(Module);
                }
                else if (Module.MODULE_ID == 20) {
                    $cookies.put('SELECTED_TAB', 6, { 'path': '/' });
                    if ($scope.CheckSubModuleAccess(53)) {
                        $scope.SELECTED_TAB_NAME = "Dashboard";
                        //  $cookies.put('SELECTED_TAB', 6, { 'path': '/' });
                        window.location.href = Module.REDIRECT_PATH;
                    }
                    else if ($scope.CheckSubModuleAccess(54) || $scope.CheckSubModuleAccess(55)) {
                        $scope.SELECTED_TAB_NAME = "Statement";
                        window.location.href = "../Payment/Index#!/Statement";
                    }
                    else if ($scope.CheckSubModuleAccess(56)) {
                        $scope.SELECTED_TAB_NAME = "Invoice";
                        window.location.href = "../Payment/Index#!/Invoice";
                    } else if ($scope.CheckSubModuleAccess(58) || $scope.CheckSubModuleAccess(127)) {
                        $scope.SELECTED_TAB_NAME = "Approvals";
                        window.location.href = "../Payment/Index#!/Approvals";
                    }
                    else if ($scope.CheckSubModuleAccess(56) || $scope.CheckSubModuleAccess(57)) {
                        $scope.SELECTED_TAB_NAME = "My_Schedule";
                        window.location.href = "../Payment/Index#!/My_Schedule";
                    }
                    else if ($scope.CheckSubModuleAccess(59) || $scope.CheckSubModuleAccess(60)) {
                        $scope.SELECTED_TAB_NAME = "Request";
                        window.location.href = "../Payment/Index#!/Request";
                    }

                }
                else if (Module.MODULE_ID == 22) {
                    if ($scope.CheckSubModuleAccess(131) || $scope.CheckSubModuleAccess(134)) {
                        $scope.SELECTED_TAB_NAME = "PR_Request";
                        $cookies.put('SELECTED_TAB', 6, { 'path': '/' });
                        window.location.href = Module.REDIRECT_PATH;
                    }
                    else if ($scope.CheckSubModuleAccess(132)) {
                        $scope.SELECTED_TAB_NAME = "Requisition";
                        $cookies.put('SELECTED_TAB', 6, { 'path': '/' });
                        window.location.href = "../P2P/P2Pindex#!/Requisition";
                    }
                    else if ($scope.CheckSubModuleAccess(133)) {

                        $cookies.put('SELECTED_TAB', 6, { 'path': '/' });
                        window.location.href = "../P2P/P2Pindex#!/Request_Approvals";
                    }
                    else if ($scope.CheckSubModuleAccess(135)) {
                        $cookies.put('SELECTED_TAB', 6, { 'path': '/' });
                        $scope.SELECTED_TAB_NAME = "Purchase_Order";
                        window.location.href = "../P2P/P2Pindex#!/Purchase_Order";
                    }
                    else if ($scope.CheckSubModuleAccess(146)) {
                        $cookies.put('SELECTED_TAB', 6, { 'path': '/' });
                        $scope.SELECTED_TAB_NAME = "Purchase_Order";
                        window.location.href = "../P2P/P2Pindex#!/P2PAP";
                    } else if ($scope.CheckSubModuleAccess(145)) {
                        $cookies.put('SELECTED_TAB', 6, { 'path': '/' });
                        $scope.SELECTED_TAB_NAME = "Purchase_Order";
                        window.location.href = "../P2P/P2Pindex#!/P2PReports";
                    } else if ($scope.CheckSubModuleAccess(147)) {
                        $cookies.put('SELECTED_TAB', 6, { 'path': '/' });
                        $scope.SELECTED_TAB_NAME = "Purchase_Order";
                        window.location.href = "../P2P/P2Pindex#!/P2PContact";
                    } else {
                        window.location.href = Module.REDIRECT_PATH;
                    }
                }
                else if (Module.MODULE_ID == 24) {
                    $scope.SELECTED_TAB_NAME = "HR_Manager_Dashboard";
                    $cookies.put('SELECTED_TAB', 1, { 'path': '/' });
                    $scope.HRM_GET_USER_MANAGEMENT_ACCESS(PATH_FLAG)
                }
                else if (Module.MODULE_ID == 25) {
                    $scope.SELECTED_TAB_NAME = "HR_Manager_Dashboard";
                    $cookies.put('SELECTED_TAB', 1, { 'path': '/' });
                    $scope.GET_BASE_DATA_FOR_POWER_INSIGHTS(Module);
                }
                else {
                    window.location.href = Module.REDIRECT_PATH;
                }
            }
            else {
                if (!Module.ROLE_REQUIRED) {
                    if (Module.MODULE_ID == 20) {
                        $cookies.put('SELECTED_TAB', 6, { 'path': '/' });
                    }
                    window.location.href = Module.REDIRECT_PATH
                }
                else {
                    alert("You do not have access to " + Module.MODULE_NAME + ".");
                }
            }
        });
    }
    $scope.GET_ENTITY_MODULES = function (ENTITY_ID, PATH_FLAG) {
        if ($localStorage.MODULE_LIST == undefined) {
            var UserModelObj = new Object();
            UserModelObj.ENTITY_ID = ENTITY_ID;
            var httpRequest = $http({
                method: 'POST',
                url: CommService.Get_CASHUP_API() + 'api/LoginAPI/GET_ENTITY_MODULES',
                data: UserModelObj
            }).then(function (data) {
                if (data.data != null && data.data.Table.length > 0) {
                    $scope.ModuleList = data.data.Table;
                    $localStorage.MODULE_LIST = JSON.stringify(data.data.Table);
                    if (PATH_FLAG == "ASIDE_CLICK" || PATH_FLAG == "HRM_ADMIN") {
                        var resultmodule = data.data.Table.filter(function (x) { return x.MODULE_ID == 24 });
                        if (resultmodule.length > 0) {
                            $scope.ModuleRedirection(resultmodule[0], PATH_FLAG);

                        }
                    };
                }
                else {
                    $scope.INS_LOGOUT_LOG();
                }
            });
        }
        else {
            $scope.ModuleList = JSON.parse($localStorage.MODULE_LIST);
            if (parseInt($cookies.get("MODULE_ID")) == 25) {
                $scope.SELECTED_TAB_NAME = "HR_Manager_Dashboard";
                $cookies.put('SELECTED_TAB', 1, { 'path': '/' });
                var resultmodule = $scope.ModuleList.filter(function (x) { return x.MODULE_ID == 25 });
                if (resultmodule.length > 0) {
                    $scope.GET_BASE_DATA_FOR_POWER_INSIGHTS(resultmodule[0]);
                }
            }
        }
    }
    $scope.GET_INTEGRATION_DETAILS_BY_CUST_ENT_BRNH = function () {
        if ($localStorage.BRANCH_LOGIN_LIST == undefined) {
            var UserModelObj = new Object();
            UserModelObj.INTEGRATION_SYSTEM_ID = 16
            UserModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
            UserModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            UserModelObj.BRANCH_ID = 0;
            PrcCommMethods.PAYMENT_API(UserModelObj, 'GET_INTEGRATION_DETAILS_BY_CUST_ENT_BRNH').then(function (data) {
                if (data.data != null && data.data.filter(function (x) { return x.IS_OUTBOUND == 0 && x.BRANCH_ID > 0 }).length > 0) {
                    $scope.GET_BRANCH_LIST();
                }
                else {
                    $scope.BRANCH_LOGIN_LIST = [];
                }
            });
        }
        else {
            $scope.BRANCH_LOGIN_LIST = JSON.parse($localStorage.BRANCH_LOGIN_LIST);
        }
    }

    $scope.GET_BRANCH_LIST = function (BRN_LIST) {
        var UserModelObj = new Object();
        UserModelObj.INTEGRATION_SYSTEM_ID = 16
        UserModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        UserModelObj.USER_ID = parseInt($cookies.get("USERID"));
        UserModelObj.MODULE_ID = parseInt($cookies.get("MODULE_ID"));
        PrcCommMethods.CASHUP_API(UserModelObj, 'GET_BRANCH_LIST').then(function (data) {
            if (data.data.length > 0) {
                $scope.BRANCH_LOGIN_LIST = data.data;
                $cookies.put('BRANCH_ID', data.data[0].BRANCH_ID, { 'path': '/' });
                $localStorage.BRANCH_LOGIN_LIST = JSON.stringify($scope.BRANCH_LOGIN_LIST);
            };
        });
    }
    $scope.GET_INTEGRATION_DETAILS_BY_CUST_ENT_BRNH();
    //================= Approvals Count

    $scope.GET_CASHUP_COUNTS = function () {
        var UserModelObj = new Object();
        UserModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        UserModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.CASHUP_API(UserModelObj, 'GET_CASHUP_COUNTS').then(function (data) {
            $scope.APPROVAL_COUNTS = data.data[0].IN_APPROVAL_COUNT;
        });
    }
    $scope.GET_CASHUP_COUNTS();
    //===============================
    $scope.GET_MODULES_EXCESS = function (SETTING_ID) {
        if ($localStorage.ENTITY_SETTINGS == undefined) {
            var UserModelObj = new Object();
            UserModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            UserModelObj.SETTING_ID = 0;
            PrcCommMethods.ADMIN_API(UserModelObj, 'ADMIN_GET_ENTITY_SETTINGS').then(function (data) {
                $scope.ENTITY_SETTINGS = JSON.stringify(data.data.Table);
                $localStorage.ENTITY_SETTINGS = JSON.stringify(data.data.Table);
                $scope.ENTITY_SETTINGS = data.data.Table;
                return $scope.ENTITY_SETTINGS.filter(function (x) { return x.SETTING_ID == SETTING_ID });
            });
        }
        else {
            $scope.ENTITY_SETTINGS = JSON.parse($localStorage.ENTITY_SETTINGS);
            return $scope.ENTITY_SETTINGS.filter(function (x) { return x.SETTING_ID == SETTING_ID });
        }
    }

    $scope.GET_MODULES_EXCESS_N_LEVEL = function (SETTING_ID, SETTING_ID_1) {
        if ($localStorage.ENTITY_SETTINGS == undefined) {
            var UserModelObj = new Object();
            UserModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            UserModelObj.SETTING_ID = 0;
            PrcCommMethods.ADMIN_API(UserModelObj, 'ADMIN_GET_ENTITY_SETTINGS').then(function (data) {
                $scope.ENTITY_SETTINGS = JSON.stringify(data.data.Table);
                $localStorage.ENTITY_SETTINGS = JSON.stringify(data.data.Table);
                $scope.ENTITY_SETTINGS = data.data.Table;
                return $scope.ENTITY_SETTINGS.filter(function (x) { return x.SETTING_ID == SETTING_ID && x.SETTING_ID == SETTING_ID_1 });
            });
        }
        else {
            $scope.ENTITY_SETTINGS = JSON.parse($localStorage.ENTITY_SETTINGS);
            return $scope.ENTITY_SETTINGS.filter(function (x) { return x.SETTING_ID == SETTING_ID && x.SETTING_ID == SETTING_ID_1 });
        }
    }

    $scope.GET_ENTITY_SUB_MODULE_ROLES = function (MODULE_ID) {
        if ($localStorage.SUB_MODULE_LIST == undefined) {
            var UserModelObj = new Object();
            UserModelObj.MODULE_ID = MODULE_ID;
            UserModelObj.USER_ID = parseInt($cookies.get("USERID"));
            UserModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            var httpRequest = $http({
                method: 'POST',
                url: CommService.Get_CASHUP_API() + 'api/LoginAPI/GET_ENTITY_MODULE_ROLES',
                data: UserModelObj
            }).then(function (data) {
                if (data.data != null && data.data.Table.length > 0) {
                    $scope.SUB_MODULE_LIST = data.data.Table;
                    $localStorage.SUB_MODULE_LIST = JSON.stringify(data.data.Table);
                    SUB_MODULE_FY();
                }
            });
        }
        else {
            $scope.SUB_MODULE_LIST = JSON.parse($localStorage.SUB_MODULE_LIST);
            SUB_MODULE_FY();

        }
    }
    function SUB_MODULE_FY() {
        var CREATE_SHIFT = $scope.SUB_MODULE_LIST.filter(function (x) { return x.PRIVILEGE_ID == 43 });
        if (CREATE_SHIFT.length > 0) {
            var array = JSON.parse("[" + CREATE_SHIFT[0].RIGHTS_MASTER_IDS + "]");
            if (array.find(element => element == 2) == 2 || array.find(element => element == 3) == 3 || array.find(element => element == 4) == 4) {
                $scope.IS_CREATE_SHIFT_EXCESS = true;
                if (array.find(element => element == 1) == 1) {
                    $scope.IS_VIEW_SHIFT_EXCESS = true;
                }
            }
            else if (array.find(element => element == 1) == 1) {
                $scope.IS_VIEW_SHIFT_EXCESS = true;
            }
        }
    }
    if (window.location.href.toLowerCase().indexOf("dashboard/hrindex") != -1 || window.location.href.toLowerCase().indexOf("scheduler/indexscheduler") != -1) {
        $scope.GET_ENTITY_SUB_MODULE_ROLES(17);
    }
    if ($filter('lowercase')($location.absUrl()).indexOf("invite_personal_details") != -1 || $filter('lowercase')($location.absUrl()).indexOf("enter_sites") != -1 || $filter('lowercase')($location.absUrl()).indexOf("basic_details") != -1) {
        $scope.HIDE_HEADER_DETAIL = false;
    };
    $scope.GET_ENTITY_SETTINGS = function (SETTING_ID) {
        if ($localStorage.ENTITY_SETTINGS == undefined) {
            var UserModelObj = new Object();
            UserModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            UserModelObj.SETTING_ID = 0;
            PrcCommMethods.ADMIN_API(UserModelObj, 'ADMIN_GET_ENTITY_SETTINGS').then(function (data) {
                $scope.ENTITY_SETTINGS = JSON.stringify(data.data.Table);
                $localStorage.ENTITY_SETTINGS = JSON.stringify(data.data.Table);
                $scope.ENTITY_SETTINGS = data.data.Table;
                return $scope.ENTITY_SETTINGS.filter(function (x) { return x.SETTING_ID == SETTING_ID });
            });
        }
        else {
            $scope.ENTITY_SETTINGS = JSON.parse($localStorage.ENTITY_SETTINGS);
            return $scope.ENTITY_SETTINGS.filter(function (x) { return x.SETTING_ID == SETTING_ID });
        }
    }
    $scope.GET_MODULE_IDS_FOR_CONTROL_PANEL = function () {
        if ($localStorage.MODULE_IDS_FOR_CONTROL_PANEL == undefined) {
            var SetupPageHdrModelObj = new Object()
            SetupPageHdrModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
            SetupPageHdrModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.ADMIN_API(SetupPageHdrModelObj, 'GET_MODULE_IDS_FOR_CONTROL_PANEL').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.MODULE_IDS_FOR_CONTROL_PANEL = data.data.Table;
                    $localStorage.MODULE_IDS_FOR_CONTROL_PANEL = JSON.stringify(data.data.Table);
                }
            });
        }
        else {
            $scope.MODULE_IDS_FOR_CONTROL_PANEL = JSON.parse($localStorage.MODULE_IDS_FOR_CONTROL_PANEL);
        }
    }
    $scope.GET_MODULE_IDS_FOR_CONTROL_PANEL();
    $scope.GET_ENTITY_SETTINGS(0)
    $scope.GET_ENTITY_MODULES(parseInt($cookies.get("ENTITY_ID")));
    var UserRoleIds = $cookies.get("ROLE_ID");
    $scope.Redirection = function () {
        window.location.href = "../Report/ReportIndex#!/RPT";
    }
    $scope.REDIRECTION_PAGE_Fn = function (PATH, MODULE_ID) {
        if ($scope.DISPLAY_FLAG == false) {
            $location.path(PATH);
        } else if ($scope.DISPLAY_FLAG == true && MODULE_ID == 24) {
            window.location.href = '../Hr/HRIndex#!/' + PATH;
        } else if ($scope.DISPLAY_FLAG == true && MODULE_ID == 1) {
            window.location.href = '../Cashup/CashupAppIndex#!/' + PATH;
        }
    }

    if ($localStorage.SELECTED_MODULE != undefined) {
        $scope.SELECTED_MODULE = JSON.parse($localStorage.SELECTED_MODULE);
    };
    $scope.ModuleoldRedirection = function (Module) {
        $scope.SELECTED_MODULE = Module;
        $localStorage.SELECTED_MODULE = JSON.stringify(Module);
        $localStorage.SUB_MODULE_LIST = undefined;
        if (!Module.ROLE_REQUIRED) {
            $cookies.put('MODULE_ID', Module.MODULE_ID, { 'path': '/' });
            if (Module.IN_APP == 1) {
                window.location.href = Module.REDIRECT_PATH;
            }
            else {
                window.open(Module.REDIRECT_PATH);
            }
            // Role SP Not call beacuse of Role is not aasign in this module.
        }
        else {

            if (Module.IN_APP == 1) {
                $scope.GET_ENTITY_MODULE_ROLES(Module);
            }
            else {
                window.open(Module.REDIRECT_PATH);
            }
        }
    };
    $scope.ModuleRedirection = function (Module, PATH_FLAG) {
        $scope.SELECTED_MODULE = Module;
        $localStorage.SELECTED_MODULE = JSON.stringify(Module);
        $localStorage.SUB_MODULE_LIST = undefined;
        if (Module.FLAG) {
            if (Module.IN_APP == 1) {
                $scope.GET_ENTITY_MODULE_ROLES(Module, PATH_FLAG);
            }
            else {
                window.open(Module.REDIRECT_PATH);
            }
        }
        else {
            window.open(Module.REDIRECT_PATH); //FLAG true mean module subscribe and redirection  enable ,IN_APP ==1 mean application module  .
            if (PATH_FLAG == "ASIDE_CLICK") {

            }
        }
    };
    $scope.Redirect = function (path, ModuleName, RoleIDs) {
        if (CheckAccess(RoleIDs)) {
            window.location.href = path;
        }
        else {
            alert("You do not have access to " + ModuleName + ".");
        }
    }
    function CheckAccess(RoleIDs) {
        var IsAccess = false;
        for (var i = 0; i < RoleIDs.length; i++) {
            for (var j = 0; j < UserRoleIds.length; j++) {
                if (parseInt(UserRoleIds[j]) == RoleIDs[i]) {
                    IsAccess = true;
                    break;
                }
            }
        }
        return IsAccess;
    }
    $scope.GET_CUSTOM_APP_FIELD_MAPPING = function (APP_PAGE_ID, COLMD, PRE_DEFINE_DATA) {
        var CustomFieldModelObj = new Object();
        CustomFieldModelObj.APP_PAGE_ID = APP_PAGE_ID;
        CustomFieldModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        CustomFieldModelObj.ACTIVE = 1;
        CustomFieldModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        if ($scope.IS_PLAIN) { CustomFieldModelObj.IS_MANAGER = 0; }
        else {
            CustomFieldModelObj.IS_MANAGER = ($cookies.get("EMPLOYEE_ID") == parseInt(getUrlParameter('EmpID', $location.absUrl()))) ? 0 : 1;
        }
        PrcCommMethods.ADMIN_API(CustomFieldModelObj, 'GET_APP_PAGE_FIELD_MASTER').then(function (data) {
            if (APP_PAGE_ID == 17) {
                data.data.Table.filter(x => x.ACTIVE = x.APPLICANT_ACTIVE)
            }
            $scope.HEADER_LIST = $filter('unique')(data.data.Table.filter(x => x.ACTIVE == true), 'APP_PAGE_HEADER_ID');
            if (APP_PAGE_ID == 9 && PRE_DEFINE_DATA != undefined && PRE_DEFINE_DATA.TOP_POSITION && $cookies.get("EMPLOYEE_ID") == parseInt(getUrlParameter('EmpID', $location.absUrl()))) {
                var MY_HIDE_COMPENTION = {
                    ACTIVE: true, API_FLAG: false, API_KEY: null, API_PASSWORD: null, API_PATH: null, API_USER_NAME: null, APP_PAGE_HEADER_ID: 54, APP_PAGE_ID: 9, CREATED_BY: 1,
                    CREATED_DATE: new Date(), CUSTOMER_ID: 6, DB_COLUMN_FOR_DISPLAY: "HIDE_MY_COMPENSATION", DB_COLUMN_FOR_EDIT: "HIDE_MY_COMPENSATION", DEFAULT_FIELD_TYPE_ID: 6, EDIT_ICON: 1,
                    ENTITY_COLUMN_NAME: "Hide My Compensation", ENTITY_ID: 9, FIELD_MASTER_COLUMN_NAME: "Hide My Compensation", FIELD_MASTER_ID: 999, FIELD_TYPE_ID: 6, FIELD_VALUE: null, HEADER_NAME: "Payment Details",
                    IS_COLOR_PICKER: false, IS_DB_DROPDOWN: true, IS_DEFAULT: true, IS_EDITABLE: 0, IS_EMP_EDIT: true, IS_MANDATORY: false, IS_MANDATORY_EMP: false, IS_MANDATORY_MANAGER: false,
                    NG_MODEL: "HIDE_MY_COMPENSATION", RESULT_COUNT: 52, SORT_ORDER: 1, TABLE_ID: 0, VALUES_ENTITY: null
                };
                data.data.Table.push(MY_HIDE_COMPENTION);
            }
            $scope.CUSTOM_FIELDS_LIST = data.data.Table.filter(function (x) { return x.ACTIVE == true });
            $scope.COLMD = COLMD;
            $scope.PRE_DEFINE_DATA = PRE_DEFINE_DATA
            $scope.overlay_loadingNew = 'none';
        });
        CustomFieldModelObj = null;
    };
    $scope.GET_CUSTOM_LABEL_APP_FIELD_MAPPING = function (APP_PAGE_ID, LIST, PRE_DEFINE_DATA) {
        var CustomFieldModelObj = new Object();
        CustomFieldModelObj.APP_PAGE_ID = APP_PAGE_ID;
        CustomFieldModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        CustomFieldModelObj.ACTIVE = 1;
        CustomFieldModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CustomFieldModelObj.IS_MANAGER = ($cookies.get("EMPLOYEE_ID") == parseInt(getUrlParameter('EmpID', $location.absUrl()))) ? 0 : 1
        //EMP = 0
        //MANAG==1
        PrcCommMethods.ADMIN_API(CustomFieldModelObj, 'GET_APP_PAGE_FIELD_MASTER').then(function (data) {
            var HEADER = $filter('unique')(data.data.Table.filter(x => x.ACTIVE == true), 'APP_PAGE_HEADER_ID');
            $scope.CUSTOM_FIELDS_ALL_LIST = [];
            $scope.CUSTOM_FIELDS_ALL_LIST = data.data.Table;
            if (APP_PAGE_ID == 9 && PRE_DEFINE_DATA != undefined && PRE_DEFINE_DATA.TOP_POSITION && $cookies.get("EMPLOYEE_ID") == parseInt(getUrlParameter('EmpID', $location.absUrl()))) {
                var MY_HIDE_COMPENTION = {
                    ACTIVE: true, API_FLAG: false, API_KEY: null, API_PASSWORD: null, API_PATH: null, API_USER_NAME: null, APP_PAGE_HEADER_ID: 54, APP_PAGE_ID: 9, CREATED_BY: 1,
                    CREATED_DATE: new Date(), CUSTOMER_ID: 6, DB_COLUMN_FOR_DISPLAY: "HIDE_MY_COMPENSATION", DB_COLUMN_FOR_EDIT: "HIDE_MY_COMPENSATION", DEFAULT_FIELD_TYPE_ID: 6, EDIT_ICON: 1,
                    ENTITY_COLUMN_NAME: "Hide My Compensation", ENTITY_ID: 9, FIELD_MASTER_COLUMN_NAME: "Hide My Compensation", FIELD_MASTER_ID: 999, FIELD_TYPE_ID: 6, FIELD_VALUE: null, HEADER_NAME: "Payment Details",
                    IS_COLOR_PICKER: false, IS_DB_DROPDOWN: true, IS_DEFAULT: true, IS_EDITABLE: 0, IS_EMP_EDIT: true, IS_MANDATORY: false, IS_MANDATORY_EMP: false, IS_MANDATORY_MANAGER: false,
                    NG_MODEL: "HIDE_MY_COMPENSATION", RESULT_COUNT: 52, SORT_ORDER: 1, TABLE_ID: 0, VALUES_ENTITY: null
                };
                data.data.Table.push(MY_HIDE_COMPENTION);
            }
            angular.forEach(HEADER, function (val) {
                val.CUSTOM_FIELDS_LIST = data.data.Table.filter(function (x) { return x.APP_PAGE_HEADER_ID == val.APP_PAGE_HEADER_ID });
            });
            LIST.HEADER_LIST = HEADER;
            $scope.overlay_loadingNew = 'none';
        });
    };
    $scope.DELETE_UPLOAD_FILE = function (Array, item, index, FILE_NAME) {
        if (confirm('Are you sure you want to delete the file?')) {
            Array.UploadedFiles.splice(index, 1);
            angular.element("input[id='" + FILE_NAME + "']").val(null);
        }
    };
    $scope.Bussph_numbr = /^\+?\d{10}$/
    $scope.TabActive = function (APP_PAGE) {
        $scope.DashboardSelected = false;
        $scope.TeamSelected = false;
        $scope.CalenderSelected = false;
        $scope.PayrollSelected = false;
        $scope.DocumentsSelected = false;
        $scope.TasksSelected = false;
        $scope.ReportsSelected = false;
        $scope.ScheduleSelected = false;
        switch (APP_PAGE) {
            case 1:
                $scope.DashboardSelected = true;
                break;
            case 2:
                $scope.TeamSelected = true;
                break;
            case 3:
                $scope.CalenderSelected = true;
                break;
            case 4:
                $scope.PayrollSelected = true;
                break;
            case 5:
                $scope.DocumentsSelected = true;
                break;
            case 6:
                $scope.TasksSelected = true;
                break;
            case 7:
                $scope.ReportsSelected = true;
                break;
            case 8:
                $scope.ScheduleSelected = true;
                break;
            default:
                $scope.DashboardSelected = true;
                break;
        }
    }
    $scope.PatternValidation = function (COUNT, CUSTOM_FIELD) {
        switch (COUNT) {
            case 10:
                CUSTOM_FIELD.PATTERN_VALIDATION = /^\+?\d{10}$/;
                break;
            case 11:
                CUSTOM_FIELD.PATTERN_VALIDATION = /^\+?\d{11}$/;
                break;
            case 12:
                CUSTOM_FIELD.PATTERN_VALIDATION = /^\+?\d{12}$/;
                break;
            case 13:
                CUSTOM_FIELD.PATTERN_VALIDATION = /^\+?\d{13}$/;
                break;
            case 14:
                CUSTOM_FIELD.PATTERN_VALIDATION = /^\+?\d{14}$/;
                break;
            case 15:
                CUSTOM_FIELD.PATTERN_VALIDATION = /^\+?\d{15}$/;
                break;
            case 16:
                CUSTOM_FIELD.PATTERN_VALIDATION = /^\+?\d{16}$/;
                break;
            case 358:
                //[A-Z]{5}\d{4}[A-Z]{1}
                CUSTOM_FIELD.PATTERN_VALIDATION = /^[A-CEGHJ-PR-TW-Z]{1}[A-CEGHJ-NPR-TW-Z]{1}[0-9]{6}[A-D]{1}$/;
                CUSTOM_FIELD.VALIDATION_MESSAGE = "Please Enter Valid National Insurance Number";


                break;
            default:
                CUSTOM_FIELD.PATTERN_VALIDATION = '';
                break;
        }
    }
    $scope.GET_DATE_VALIDATION = function (CUSTOM_FIELD) {
        $scope.CURRENT_CUSTOM_FIELD = '';
        switch (CUSTOM_FIELD.FIELD_MASTER_ID) {
            case 143:
                var index342 = $scope.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 342);
                var NO_OF_DAYS = []
                if ($scope.CUSTOM_FIELDS_LIST[index342].OPTION_LIST != undefined) {
                    var NO_OF_DAYS = $scope.CUSTOM_FIELDS_LIST[index342].OPTION_LIST.filter(function (x) { return x.TABLE_ID == $scope.CUSTOM_FIELDS_LIST[index342].FIELD_VALUE });
                }
                var index143 = $scope.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 143);
                var index144 = $scope.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 144);
                if (NO_OF_DAYS.length > 0) {
                    var hors = parseInt(NO_OF_DAYS[0].NO_OF_DAYS) * 24;
                    $scope.CUSTOM_FIELDS_LIST[index144].FIELD_VALUE = moment(new Date(new Date($scope.CUSTOM_FIELDS_LIST[index143].FIELD_VALUE).setHours(hors))).format("LL") == "Invalid date" ? '' : moment(new Date(new Date($scope.CUSTOM_FIELDS_LIST[index143].FIELD_VALUE).setHours(hors))).format("LL");
                    $scope.EFFICTIVE_ON_CHANGE($scope.CUSTOM_FIELDS_LIST[index144]);
                }
                break;
            case 353:
                $scope.CURRENT_CUSTOM_FIELD = CUSTOM_FIELD;
                break;
            case 354:
                $scope.CURRENT_CUSTOM_FIELD = CUSTOM_FIELD;
                break;
            default:
                break;
        }
        $scope.EFFICTIVE_ON_CHANGE(CUSTOM_FIELD);
    }
    $scope.CHECK_BOX_CLICK = function (FIELD_MASTER_ID, CUSTOM_FIELD) {
        var index = $scope.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === FIELD_MASTER_ID);
        if (FIELD_MASTER_ID != 0) {
            switch (CUSTOM_FIELD.FIELD_MASTER_ID) {
                case 151:
                    var INDEX_354 = $scope.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 354);
                    var INDEX_353 = $scope.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 353);
                    var INDEX_355 = $scope.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 355);
                    $scope.CUSTOM_FIELDS_LIST[INDEX_354].CHANGE_FLAG = 1;
                    $scope.CUSTOM_FIELDS_LIST[INDEX_353].CHANGE_FLAG = 1;
                    $scope.CUSTOM_FIELDS_LIST[INDEX_355].CHANGE_FLAG = 1;
                    if (!$scope.CUSTOM_FIELDS_LIST[index].FIELD_VALUE) {
                        $scope.CUSTOM_FIELDS_LIST[INDEX_354].IS_CUST_EMP_EDIT = false;
                        $scope.CUSTOM_FIELDS_LIST[INDEX_353].IS_CUST_EMP_EDIT = false;
                        $scope.CUSTOM_FIELDS_LIST[INDEX_355].IS_CUST_EMP_EDIT = false;

                        $scope.CUSTOM_FIELDS_LIST[INDEX_353].IS_MANDATORY = true;
                        $scope.CUSTOM_FIELDS_LIST[INDEX_354].IS_MANDATORY = true;
                    } else {
                        $scope.CUSTOM_FIELDS_LIST[INDEX_354].IS_CUST_EMP_EDIT = true;
                        $scope.CUSTOM_FIELDS_LIST[INDEX_353].IS_CUST_EMP_EDIT = true;
                        $scope.CUSTOM_FIELDS_LIST[INDEX_355].IS_CUST_EMP_EDIT = true;

                        $scope.CUSTOM_FIELDS_LIST[INDEX_353].IS_MANDATORY = false;
                        $scope.CUSTOM_FIELDS_LIST[INDEX_354].IS_MANDATORY = false;

                        $scope.CUSTOM_FIELDS_LIST[INDEX_354].FIELD_VALUE = '';
                        $scope.CUSTOM_FIELDS_LIST[INDEX_353].FIELD_VALUE = '';
                        $scope.CUSTOM_FIELDS_LIST[INDEX_355].FIELD_VALUE = false;

                    }
                    break;
                default:

                    break;
            }
        }
    }
    $scope.GET_APP_PAGE_HEADERS = function (APP_PAGE_ID) {
        var SetupPageHdrModelObj = new Object()
        SetupPageHdrModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        SetupPageHdrModelObj.PAGE_HEADER_NAME = "";
        SetupPageHdrModelObj.ACTIVE = 1;
        SetupPageHdrModelObj.PAGE_NO = 1;
        SetupPageHdrModelObj.PAGE_SIZE = 1000;
        SetupPageHdrModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        SetupPageHdrModelObj.APP_PAGE_ID = APP_PAGE_ID;
        PrcCommMethods.ADMIN_API(SetupPageHdrModelObj, 'GET_APP_PAGE_HEADERS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.APP_PAGE_HEADER_LIST = data.data.Table;
            }
        });
    };
    $scope.ADMIN_GET_CUSTOM_CONTROL_LIST = function (FIELD_TYPE_ID) {
        CustomFieldModelObj = new Object();
        PrcCommMethods.ADMIN_API(CustomFieldModelObj, 'GET_FIELD_TYPE_MASTER').then(function (data) {
            $scope.CUSTOM_FIELD_TYPE_LIST = data.data.Table;
            if (FIELD_TYPE_ID != undefined) {
                $scope.CustomFieldSearch.FIELD_TYPE_ID = FIELD_TYPE_ID;
            }
        });
    };
    $scope.INS_UPD_APP_PAGE_FIELD_ENTITY = function (APP_PAGE_ID) {
        $scope.CustomFieldMapingMstForm.submitted = true;
        var count = 0;
        CustomModelObj = new Object();

        if ($scope.CustomFieldMapingMstForm.$valid) {
            CustomFieldModelObj = new Object();
            //  angular.forEach($scope.CUSTOM_FIELDS_LIST, function (CUSTOM_FIELDS) {
            var TABLE_LIST = $scope.FIELDS_NAME_LIST.filter(function (x) { return x.FIELD_MASTER_ID == $scope.CustomFieldSearch.FIELD_MASTER_ID; })
            if (TABLE_LIST.length > 0) {
                CustomModelObj.TABLE_ID = TABLE_LIST[0].TABLE_ID;
            }
            else {
                CustomModelObj.TABLE_ID = 0;
            }
            CustomModelObj.APP_PAGE_FIELD_MASTER_ID = $scope.CustomFieldSearch.FIELD_MASTER_ID;
            CustomModelObj.COLUMN_NAME = $scope.CustomFieldSearch.ENTITY_COLUMN_NAME;
            CustomModelObj.ACTIVE = $scope.CustomFieldSearch.ACTIVE ? 1 : 0;
            CustomModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
            CustomModelObj.FIELD_TYPE_ID = $scope.CustomFieldSearch.FIELD_TYPE_ID;
            CustomModelObj.IS_MANDATORY_EMP = $scope.CustomFieldSearch.IS_MANDATORY_EMP ? 1 : 0;
            CustomModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));

            CustomModelObj.VALUES = null;
            if ($scope.CustomFieldSearch.FIELD_TYPE_ID == 3 && !$scope.CustomFieldSearch.IS_DB_DROPDOWN || $scope.CustomFieldSearch.FIELD_TYPE_ID == 7 || $scope.CustomFieldSearch.FIELD_TYPE_ID == 8) {
                var OPTION_VALUE = $scope.CustomFieldSearch.FIELD_TYPE_ID == 3 && !$scope.CustomFieldSearch.IS_DB_DROPDOWN || $scope.CustomFieldSearch.FIELD_TYPE_ID == 7 || $scope.CustomFieldSearch.FIELD_TYPE_ID == 8 ? $scope.CustomFieldSearch.OPTION_TEXT == undefined || $scope.CustomFieldSearch.OPTION_TEXT == null || $scope.CustomFieldSearch.OPTION_TEXT == "" ? [] : $scope.CustomFieldSearch.OPTION_TEXT.split('\n') : '';
                var VALUE = '';
                if (OPTION_VALUE.length > 0) {
                    for (var j = 0; j < OPTION_VALUE.length; j++) {
                        if (VALUE == '') {
                            VALUE = OPTION_VALUE[j];
                        }
                        else {
                            VALUE = VALUE + ':;:' + OPTION_VALUE[j];
                        }
                    }
                }
                if (OPTION_VALUE.length == 0) {
                    count++;
                }
                CustomModelObj.VALUES = VALUE;
            }
            CustomModelObj.APP_PAGES_ID = $scope.MASTER_APP_PAGE_ID;
            CustomModelObj.APP_PAGE_HEADER_ID = $scope.CustomFieldSearch.APP_PAGE_HEADER_ID;
            CustomModelObj.IS_EMP_EDIT = $scope.CustomFieldSearch.IS_EMP_EDIT ? 1 : 0;
            CustomModelObj.IS_MANDATORY_MANAGER = $scope.CustomFieldSearch.IS_MANDATORY_MANAGER ? 1 : 0;
            CustomModelObj.MAP_AS_ID = $scope.CustomFieldSearch.MAP_AS_ID == undefined ? null : $scope.CustomFieldSearch.MAP_AS_ID;
            CustomModelObj.COLUMN_DESCRIPTION = $scope.CustomFieldSearch.COLUMN_DESCRIPTION == undefined ? "" : $scope.CustomFieldSearch.COLUMN_DESCRIPTION;

            CustomFieldModelObj.USER_ID = parseInt($cookies.get("USERID"));
            CustomFieldModelObj.CUSTOM_SELECTED_FIELD_LIST = [];
            CustomFieldModelObj.CUSTOM_SELECTED_FIELD_LIST.push(CustomModelObj);
            //}
            //});
            // if ($scope.IS_EDITABLE_MANDATORY_COUNT == 0) {

            if (count == 0) {
                PrcCommMethods.ADMIN_API(CustomFieldModelObj, "INS_UPD_APP_PAGE_FIELD_ENTITY").then(function (data) {
                    $scope.ShowAlert("Success", "Save Successfully", 3000);
                    $scope.CustomFieldMapingMstForm.submitted = false;
                    $scope.child_scope.COMMON_PAGE_LOAD_FY();
                    $("#Add_Field").modal('hide');
                });
            }
            else {
                $scope.ShowAlert('Error', 'Please select plus icon and enter options to continue.', 3000)
            }
        }
        // }
        // else {
        // $scope.$parent.ShowAlert("Attention", "Please check, employee editable and  Employee/Manager mandatory are in sync", 3000);
        // }
    };
    $scope.CHANGE_FIELDS_NAME_FY = function () {
        var list = $scope.FIELDS_NAME_LIST.filter(function (x) { return x.FIELD_MASTER_ID == $scope.CustomFieldSearch.FIELD_MASTER_ID });
        if (list.length > 0) {
            $scope.CustomFieldSearch.IS_EDITABLE = list[0].IS_EDITABLE;
            $scope.CustomFieldSearch.ENTITY_COLUMN_NAME = list[0].ENTITY_COLUMN_NAME;
            $scope.CustomFieldSearch.IS_DB_DROPDOWN = list[0].IS_DB_DROPDOWN;
            $scope.CustomFieldSearch.DEFAULT_FIELD_TYPE_ID = list[0].DEFAULT_FIELD_TYPE_ID;
            $scope.CustomFieldSearch.FIELD_TYPE_ID = list[0].FIELD_TYPE_ID;
            $scope.CustomFieldSearch.IS_EMP_EDIT = list[0].IS_EMP_EDIT;
            $scope.CustomFieldSearch.ACTIVE = true;

        }
    }
    $scope.ADD_ON_FILED = function (APP_PAGE_ID) {
        $scope.MASTER_APP_PAGE_ID = APP_PAGE_ID;
        $scope.CustomFieldSearch = {
        };
        $scope.COMMON_CUSTOM_FIELD(APP_PAGE_ID, 1);
        $("#Add_Field").modal('show');
    }
    $scope.GET_HR_CUSTOM_APP_FIELD_MAPPING = function (APP_PAGE_ID, FLAG, CUSTOM_FIELD) {
        var CustomFieldModelObj = new Object();
        CustomFieldModelObj.APP_PAGE_ID = APP_PAGE_ID;
        CustomFieldModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        CustomFieldModelObj.ACTIVE = 1;
        CustomFieldModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CustomFieldModelObj.IS_MANAGER = 0;
        PrcCommMethods.ADMIN_API(CustomFieldModelObj, 'GET_APP_PAGE_FIELD_MASTER').then(function (data) {
            $("#Add_Field").modal('show');
            if (FLAG == 1) {
                $scope.FIELDS_NAME_LIST = data.data.Table.filter(function (x) { return x.ACTIVE == false });
                $scope.ADMIN_GET_CUSTOM_CONTROL_LIST();
            }
            else {
                $scope.FIELDS_NAME_LIST = data.data.Table.filter(function (x) { return x.FIELD_MASTER_ID == CUSTOM_FIELD.FIELD_MASTER_ID });
                if ($scope.FIELDS_NAME_LIST.length > 0) {
                    $scope.CustomFieldSearch = angular.copy($scope.FIELDS_NAME_LIST[0]);
                    $scope.ADMIN_GET_CUSTOM_CONTROL_LIST($scope.FIELDS_NAME_LIST[0].FIELD_TYPE_ID);
                    $scope.NG_CHANGE_FIELD_TYPE($scope.CustomFieldSearch, 1)
                }
            }

        });
        CustomFieldModelObj = null;
    };
    $scope.EDIT_CUSTOM_FIELD_FY = function (CUSTOM_FIELD) {
        $scope.MASTER_APP_PAGE_ID = CUSTOM_FIELD.APP_PAGE_ID;
        $scope.CustomFieldSearch = {
        };
        $scope.COMMON_CUSTOM_FIELD(CUSTOM_FIELD.APP_PAGE_ID, 2, CUSTOM_FIELD);

        $scope.COMMON_CODE_CHANGE();
    }
    $scope.COMMON_CUSTOM_FIELD = function (APP_PAGE_ID, FLAG, CUSTOM_FIELD) {
        $scope.FIELDS_NAME_LIST = [];
        $scope.CUSTOM_FIELD_TYPE_LIST = [];
        $scope.GET_APP_PAGE_HEADERS(APP_PAGE_ID);
        $scope.GET_HR_CUSTOM_APP_FIELD_MAPPING(APP_PAGE_ID, FLAG, CUSTOM_FIELD);
    }
    $scope.changeTimezone = function (date, FLAG) {
        var offset = $cookies.get("TIMEZONE_OFFSET");
        //  const moment = require('moment'); //
        var dateno = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        var monthno = date.getMonth() + 1;
        monthno = monthno < 10 ? "0" + monthno : monthno;
        var hrsno = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        var minno = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        var a = (date.getFullYear() + "-" + monthno + "-" + dateno + "T" + hrsno + ":" + minno + '' + offset);

        if (FLAG == undefined) {
            var a = (date.getFullYear() + "-" + monthno + "-" + dateno + "T" + hrsno + ":" + minno + '' + offset);
        }
        else {
            var a = (date.getFullYear() + "-" + monthno + "-" + dateno + "T" + hrsno + ":" + minno + '');
        }
        return moment(a);
    }
    $scope.GET_DEPENDANT_DATA_VALUES_ENTITY = function (CUSTOM_FIELD) {
        switch (CUSTOM_FIELD.FIELD_MASTER_ID) {
            case 85:
                var index = $scope.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 90);
                if (CUSTOM_FIELD.FIELD_VALUE == 'Mr') {
                    $scope.CUSTOM_FIELDS_LIST[index].FIELD_VALUE = "Male";
                }
                else {
                    $scope.CUSTOM_FIELDS_LIST[index].FIELD_VALUE = "Female";
                }
                $scope.EFFICTIVE_ON_CHANGE($scope.CUSTOM_FIELDS_LIST[index]);
                break;
            default:
                if (!CUSTOM_FIELD.IS_DB_DROPDOWN) {
                    CUSTOM_FIELD.OPTION_LIST = [];
                    var Arry = CUSTOM_FIELD.VALUES_ENTITY == null ? [] : CUSTOM_FIELD.VALUES_ENTITY.split(':;:')
                    CUSTOM_FIELD.OPTION_LIST = Arry;
                }
                break;
        }


        $scope.EFFICTIVE_ON_CHANGE(CUSTOM_FIELD);
    }
    $scope.RESET_CUSTOM_FIELD = function (CUSTOM_FIELD) {
        if (CUSTOM_FIELD.FIELD_MASTER_ID != 0) {
            switch (CUSTOM_FIELD.FIELD_MASTER_ID) {
                case 146:

                    var index_146 = $scope.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === CUSTOM_FIELD.DEPENDANT_ID_146);
                    var index_292 = $scope.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 292);
                    var index_337 = $scope.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === CUSTOM_FIELD.DEPENDANT_ID_337);
                    var index_338 = $scope.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === CUSTOM_FIELD.DEPENDANT_ID_338);
                    var index_339 = $scope.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === CUSTOM_FIELD.DEPENDANT_ID_339);
                    var index_340 = $scope.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === CUSTOM_FIELD.DEPENDANT_ID_340);
                    var index_341 = $scope.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 341);
                    var index_342 = $scope.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 342);
                    var index_343 = $scope.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 343);
                    var index_344 = $scope.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 344);
                    var index_345 = $scope.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 345);
                    var index_346 = $scope.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 346);
                    var index_347 = $scope.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 347);
                    var index_348 = $scope.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 348);
                    var index_349 = $scope.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 349);
                    var index_350 = $scope.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 350);

                    $scope.CUSTOM_FIELDS_LIST[index_146].FIELD_VALUE = $scope.CUSTOM_FIELDS_LIST[index_146].FIELD_VALUE_TEXT;

                    $scope.CUSTOM_FIELDS_LIST[index_337].FIELD_VALUE = $scope.CUSTOM_FIELDS_LIST[index_337].FIELD_VALUE_TEXT;
                    $scope.CUSTOM_FIELDS_LIST[index_338].FIELD_VALUE = $scope.CUSTOM_FIELDS_LIST[index_338].FIELD_VALUE_TEXT + '';
                    $scope.CUSTOM_FIELDS_LIST[index_339].FIELD_VALUE = $scope.CUSTOM_FIELDS_LIST[index_339].FIELD_VALUE_TEXT;
                    $scope.CUSTOM_FIELDS_LIST[index_340].FIELD_VALUE = $scope.CUSTOM_FIELDS_LIST[index_340].FIELD_VALUE_TEXT;

                    $scope.CUSTOM_FIELDS_LIST[index_341].FIELD_VALUE = $scope.CUSTOM_FIELDS_LIST[index_341].FIELD_VALUE_TEXT;
                    $scope.CUSTOM_FIELDS_LIST[index_342].FIELD_VALUE = $scope.CUSTOM_FIELDS_LIST[index_342].FIELD_VALUE_TEXT;
                    $scope.CUSTOM_FIELDS_LIST[index_343].FIELD_VALUE = $scope.CUSTOM_FIELDS_LIST[index_343].FIELD_VALUE_TEXT;
                    $scope.CUSTOM_FIELDS_LIST[index_344].FIELD_VALUE = $scope.CUSTOM_FIELDS_LIST[index_344].FIELD_VALUE_TEXT;
                    $scope.CUSTOM_FIELDS_LIST[index_345].FIELD_VALUE = $scope.CUSTOM_FIELDS_LIST[index_345].FIELD_VALUE_TEXT;
                    $scope.CUSTOM_FIELDS_LIST[index_346].FIELD_VALUE = $scope.CUSTOM_FIELDS_LIST[index_346].FIELD_VALUE_TEXT;
                    $scope.CUSTOM_FIELDS_LIST[index_347].FIELD_VALUE = $scope.CUSTOM_FIELDS_LIST[index_347].FIELD_VALUE_TEXT;

                    $scope.CUSTOM_FIELDS_LIST[index_349].FIELD_VALUE = $scope.CUSTOM_FIELDS_LIST[index_349].FIELD_VALUE_TEXT;
                    $scope.CUSTOM_FIELDS_LIST[index_348].FIELD_VALUE = $scope.CUSTOM_FIELDS_LIST[index_348].FIELD_VALUE_TEXT;
                    $scope.child_scope.GET_REPORTING_MANAGER_BY_POSITION($scope.CUSTOM_FIELDS_LIST[index_146], $scope.CUSTOM_FIELDS_LIST[index_292], $scope.CUSTOM_FIELDS_LIST[index_292]);
                    $scope.child_scope.GET_LOCATION_BRANCHES($scope.CUSTOM_FIELDS_LIST[index_347], $scope.CUSTOM_FIELDS_LIST[index_348]);
                    $scope.CUSTOM_FIELDS_LIST[index_348].FIELD_VALUE = $scope.CUSTOM_FIELDS_LIST[index_348].FIELD_VALUE_TEXT;

                    $scope.child_scope.SUB_GET_EMPLOYEE_CATEGORY($scope.CUSTOM_FIELDS_LIST[index_349], $scope.CUSTOM_FIELDS_LIST[index_350]);
                    $scope.CUSTOM_FIELDS_LIST[index_350].FIELD_VALUE = $scope.CUSTOM_FIELDS_LIST[index_350].FIELD_VALUE_TEXT;

                    break;
                default:
                    break;
            }
        }
    }
    $scope.POP_DATA_CUSTOM_FIELD = function (CUSTOM_FIELD) {
        if (CUSTOM_FIELD.FIELD_MASTER_ID != 0) {
            switch (CUSTOM_FIELD.FIELD_MASTER_ID) {
                case 146:
                    $scope.child_scope.POP_POSITION(CUSTOM_FIELD);
                    break;
                default:
                    break;
            }
        }
    }

    $scope.CUSTOM_FIELD_CLICK = function (opdList, CUSTOM_FIELD) {
        if (CUSTOM_FIELD.FIELD_MASTER_ID != 0) {
            switch (CUSTOM_FIELD.FIELD_MASTER_ID) {
                case 356:
                    CUSTOM_FIELD.FIELD_VALUE = opdList.TABLE_ID;
                    CUSTOM_FIELD.DISPLAY_FIELD_TEXT = opdList.DISPLAY_TEXT;
                    break;
                default:
                    break;
            }
        }
        $scope.EFFICTIVE_ON_CHANGE(CUSTOM_FIELD);
    }
    $scope.CUSTOM_FROM_CONTROL_BLUE = function (CUSTOM_FIELD) {
        switch (CUSTOM_FIELD.FIELD_MASTER_ID) {
            case 114:
                $scope.child_scope.HR_CHECK_BUSINESS_EMAIL(CUSTOM_FIELD);
                break;
            default:
                break;
        }
    }

    $scope.EFFICTIVE_ON_CHANGE = function (CUSTOM_FIELD) {
        //CUSTOM_FIELD.CHANGE_FLAG = 0;
        if (CUSTOM_FIELD.FIELD_VALUE_TEXT != CUSTOM_FIELD.FIELD_VALUE) {
            CUSTOM_FIELD.CHANGE_FLAG = 1;
        }
        if (CUSTOM_FIELD.FIELD_MASTER_ID == 358) {
            if (CUSTOM_FIELD.FIELD_VALUE != undefined && CUSTOM_FIELD.FIELD_VALUE != "" && CUSTOM_FIELD.FIELD_VALUE != null) {
                CUSTOM_FIELD.FIELD_VALUE = CUSTOM_FIELD.FIELD_VALUE.toUpperCase();
            }
        }
        else if (CUSTOM_FIELD.FIELD_MASTER_ID == 191) {
            var index = $scope.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID == 188);
            $scope.CUSTOM_FIELDS_LIST[index].CHANGE_FLAG = 1;
            $scope.CUSTOM_FIELDS_LIST[index].FIELD_VALUE = '0';
        }
        else if (CUSTOM_FIELD.FIELD_MASTER_ID == 188) {
            var index = $scope.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID == 191);
            $scope.CUSTOM_FIELDS_LIST[index].CHANGE_FLAG = 1;
            $scope.CUSTOM_FIELDS_LIST[index].FIELD_VALUE = '0';
        }
    }
    $scope.GET_DEPENDANT_DATA = function (FIELD_MASTER_ID, CUSTOM_FIELD, ONCHANGEFLAG) {
        //if (!CUSTOM_FIELD.DISABLED) {
        if (FIELD_MASTER_ID != 0) {
            var index = $scope.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === FIELD_MASTER_ID);
            //$scope.CUSTOM_FIELDS_LIST.filter(function (x) { return x.ACTIVE });
            switch (FIELD_MASTER_ID) {
                case 44:
                    $scope.child_scope.GET_LOCATION_BRANCHES(CUSTOM_FIELD, $scope.CUSTOM_FIELDS_LIST[index]);
                    //$scope.child_scope.GET_GROUP_MAPPING(CUSTOM_FIELD);//Hide as per over team discussion with teachnical Head.
                    break;
                case 46:
                    $scope.child_scope.SUB_GET_EMPLOYEE_CATEGORY(CUSTOM_FIELD, $scope.CUSTOM_FIELDS_LIST[index]);
                    break;
                case 66:
                    $scope.FTE = $scope.GET_ENTITY_SETTINGS(1)[0].SETTING_VALUE;
                    var index62 = $scope.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 62);
                    if ((($scope.CUSTOM_FIELDS_LIST[index62].FIELD_VALUE * 1) / parseFloat($scope.FTE)).toFixed(2) > 1) {
                        $scope.CUSTOM_FIELDS_LIST[index].FIELD_VALUE = 1;
                    }
                    else {
                        $scope.CUSTOM_FIELDS_LIST[index].FIELD_VALUE = (($scope.CUSTOM_FIELDS_LIST[index62].FIELD_VALUE * 1) / parseFloat($scope.FTE)).toFixed(2);
                    }

                    if (isNaN($scope.CUSTOM_FIELDS_LIST[index].FIELD_VALUE)) {
                        $scope.CUSTOM_FIELDS_LIST[index].FIELD_VALUE = '';
                    }
                    break;
                case -66:
                    var index66 = $scope.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 66);
                    if ($scope.CUSTOM_FIELDS_LIST[index66].FIELD_VALUE > 1) {
                        $scope.CUSTOM_FIELDS_LIST[index66].FIELD_VALUE = 1;
                    }
                    if (isNaN($scope.CUSTOM_FIELDS_LIST[index66].FIELD_VALUE)) {
                        $scope.CUSTOM_FIELDS_LIST[index66].FIELD_VALUE = '';
                    }
                    break;
                case 94:
                    $scope.child_scope.GET_NATIONALITY_ID_TYPES(CUSTOM_FIELD, $scope.CUSTOM_FIELDS_LIST[index]);
                    break;
                case 122:
                    var MobCodelst = CUSTOM_FIELD.OPTION_LIST.filter(function (x) { return x.TABLE_ID == CUSTOM_FIELD.FIELD_VALUE });
                    $scope.CUSTOM_FIELDS_LIST[index].MOBILE_LENGTH = MobCodelst[0].MOBILE_LENGTH;
                    //  $scope.PatternValidation(MobCodelst[0].MOBILE_LENGTH, $scope.CUSTOM_FIELDS_LIST[index]);
                    break;
                case 125:
                    var MobCodelst = CUSTOM_FIELD.OPTION_LIST.filter(function (x) { return x.TABLE_ID == CUSTOM_FIELD.FIELD_VALUE });
                    $scope.CUSTOM_FIELDS_LIST[index].MOBILE_LENGTH = MobCodelst[0].MOBILE_LENGTH;
                    //  $scope.PatternValidation(MobCodelst[0].MOBILE_LENGTH, $scope.CUSTOM_FIELDS_LIST[index]);
                    break;
                case 126:
                    var index2 = $scope.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === CUSTOM_FIELD.DEPENDANT_ID_2);
                    var MobCodelst = CUSTOM_FIELD.OPTION_LIST.filter(function (x) { return x.TABLE_ID == CUSTOM_FIELD.FIELD_VALUE });
                    if (index >= 0) {
                        $scope.CUSTOM_FIELDS_LIST[index].FIELD_VALUE = MobCodelst[0].TABLE_ID;
                    }
                    if (index2 >= 0) {
                        $scope.CUSTOM_FIELDS_LIST[index2].FIELD_VALUE = MobCodelst[0].TABLE_ID;
                    }
                    var MOBILE_NO_INDEX = $scope.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 122);
                    var EMP_NO_INDEX = $scope.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 125);
                    if (MOBILE_NO_INDEX >= 0) {
                        $scope.CUSTOM_FIELDS_LIST[MOBILE_NO_INDEX].MOBILE_LENGTH = MobCodelst[0].MOBILE_LENGTH;
                    }
                    if (EMP_NO_INDEX >= 0) {
                        $scope.CUSTOM_FIELDS_LIST[EMP_NO_INDEX].MOBILE_LENGTH = MobCodelst[0].MOBILE_LENGTH;
                    }
                    // $scope.PatternValidation(MobCodelst[0].MOBILE_LENGTH, $scope.CUSTOM_FIELDS_LIST[MOBILE_NO_INDEX]);
                    // $scope.PatternValidation(MobCodelst[0].MOBILE_LENGTH, $scope.CUSTOM_FIELDS_LIST[EMP_NO_INDEX]);
                    break;
                case 144:
                    //if (ONCHANGEFLAG != 1) {
                    var NO_OF_DAYS = CUSTOM_FIELD.OPTION_LIST.filter(function (x) { return x.TABLE_ID == CUSTOM_FIELD.FIELD_VALUE });
                    var index143 = $scope.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 143);
                    var index144 = $scope.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 144);
                    var hors = parseInt(NO_OF_DAYS[0].NO_OF_DAYS) * 24;
                    $scope.CUSTOM_FIELDS_LIST[index144].FIELD_VALUE = moment(new Date(new Date($scope.CUSTOM_FIELDS_LIST[index143].FIELD_VALUE).setHours(hors))).format("LL") == "Invalid date" ? '' : moment(new Date(new Date($scope.CUSTOM_FIELDS_LIST[index143].FIELD_VALUE).setHours(hors))).format("LL");
                    $scope.EFFICTIVE_ON_CHANGE($scope.CUSTOM_FIELDS_LIST[index144]);
                    //}
                    break;
                case 187:

                    var index = $scope.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 187);
                    var index2 = $scope.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === CUSTOM_FIELD.DEPENDANT_ID_190);
                    var index3 = $scope.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === CUSTOM_FIELD.DEPENDANT_ID_188);
                    if ($scope.CUSTOM_FIELDS_LIST[index].OPTION_LIST.length > 0) {
                        var PAY_FRE_NAME = $scope.CUSTOM_FIELDS_LIST[index].OPTION_LIST.filter(function (x) { return x.PAY_FREQUENCY_ID == $scope.CUSTOM_FIELDS_LIST[index].FIELD_VALUE });
                    }
                    if ($scope.CUSTOM_FIELDS_LIST[index].FIELD_VALUE == 1 && $scope.CUSTOM_FIELDS_LIST[index2].FIELD_VALUE == 1) {
                        if (isNaN(parseFloat($scope.CUSTOM_FIELDS_LIST[index3].FIELD_VALUE) / 52)) {
                            $scope.CUSTOM_FIELDS_LIST[index3].FIELD_VALUE_TEXT = '';
                        }
                        else {
                            $scope.CUSTOM_FIELDS_LIST[index3].FIELD_VALUE_TEXT = PAY_FRE_NAME[0].PAY_FREQUENCY_NAME + ": " + (parseFloat($scope.CUSTOM_FIELDS_LIST[index3].FIELD_VALUE) / 52).toFixed(2);
                        }
                    }
                    else if ($scope.CUSTOM_FIELDS_LIST[index].FIELD_VALUE == 2 && $scope.CUSTOM_FIELDS_LIST[index2].FIELD_VALUE == 1) {
                        if (isNaN(parseFloat($scope.CUSTOM_FIELDS_LIST[index3].FIELD_VALUE) / 12)) {
                            $scope.CUSTOM_FIELDS_LIST[index3].FIELD_VALUE_TEXT = '';
                        }
                        else {
                            $scope.CUSTOM_FIELDS_LIST[index3].FIELD_VALUE_TEXT = PAY_FRE_NAME[0].PAY_FREQUENCY_NAME + ": " + (parseFloat($scope.CUSTOM_FIELDS_LIST[index3].FIELD_VALUE) / 12).toFixed(2);
                        }
                    }
                    else if ($scope.CUSTOM_FIELDS_LIST[index].FIELD_VALUE == 3 && $scope.CUSTOM_FIELDS_LIST[index2].FIELD_VALUE == 1) {
                        if (isNaN(parseFloat($scope.CUSTOM_FIELDS_LIST[index3].FIELD_VALUE) / 26)) {
                            $scope.CUSTOM_FIELDS_LIST[index3].FIELD_VALUE_TEXT = '';
                        }
                        else {
                            $scope.CUSTOM_FIELDS_LIST[index3].FIELD_VALUE_TEXT = PAY_FRE_NAME[0].PAY_FREQUENCY_NAME + ": " + (parseFloat($scope.CUSTOM_FIELDS_LIST[index3].FIELD_VALUE) / 26).toFixed(2);
                        }
                    }
                    else if ($scope.CUSTOM_FIELDS_LIST[index].FIELD_VALUE == 4 && $scope.CUSTOM_FIELDS_LIST[index2].FIELD_VALUE == 1) {
                        if (isNaN(parseFloat($scope.CUSTOM_FIELDS_LIST[index3].FIELD_VALUE) / 365)) {
                            $scope.CUSTOM_FIELDS_LIST[index3].FIELD_VALUE_TEXT = '';
                        }
                        else {
                            $scope.CUSTOM_FIELDS_LIST[index3].FIELD_VALUE_TEXT = PAY_FRE_NAME[0].PAY_FREQUENCY_NAME + ": " + (parseFloat($scope.CUSTOM_FIELDS_LIST[index3].FIELD_VALUE) / 365).toFixed(2);
                        }
                    }
                    break;
                case 188:
                    var index2 = $scope.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === CUSTOM_FIELD.DEPENDANT_ID_2);
                    var index_187 = $scope.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === CUSTOM_FIELD.DEPENDANT_ID_187);
                    var index_191 = $scope.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 191);
                    var index_190 = $scope.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 190);
                    $scope.CUSTOM_FIELDS_LIST[index_190].CHANGE_FLAG = 1;
                    $scope.CUSTOM_FIELDS_LIST[index_191].CHANGE_FLAG = 1;
                    $scope.CUSTOM_FIELDS_LIST[index].FIELD_VALUE_TEXT = '';
                    if (CUSTOM_FIELD.FIELD_VALUE == 1) {
                        $scope.CUSTOM_FIELDS_LIST[index].DISABLED = CUSTOM_FIELD.IS_MANAGER ? false : true;
                        $scope.CUSTOM_FIELDS_LIST[index2].DISABLED = CUSTOM_FIELD.IS_MANAGER ? true : true;
                        $scope.CUSTOM_FIELDS_LIST[index].IS_MANDATORY = 1;
                        $scope.CUSTOM_FIELDS_LIST[index2].IS_MANDATORY = 0;
                        $scope.CUSTOM_FIELDS_LIST[index_191].FIELD_VALUE = 0;

                    };
                    if (CUSTOM_FIELD.FIELD_VALUE == 2 || CUSTOM_FIELD.FIELD_VALUE == 3 || CUSTOM_FIELD.FIELD_VALUE == 4) {
                        //$scope.CUSTOM_FIELDS_LIST[index].DISABLED = true;
                        $scope.CUSTOM_FIELDS_LIST[index].DISABLED = CUSTOM_FIELD.IS_MANAGER ? true : true;
                        $scope.CUSTOM_FIELDS_LIST[index2].DISABLED = CUSTOM_FIELD.IS_MANAGER ? false : true;
                        $scope.CUSTOM_FIELDS_LIST[index].IS_MANDATORY = 0;
                        $scope.CUSTOM_FIELDS_LIST[index2].IS_MANDATORY = 1;
                        $scope.CUSTOM_FIELDS_LIST[index].FIELD_VALUE_TEXT = '';
                    };
                    if (ONCHANGEFLAG != 1) {
                        $scope.CUSTOM_FIELDS_LIST[index].FIELD_VALUE = '';
                        $scope.CUSTOM_FIELDS_LIST[index2].FIELD_VALUE = '';
                        $scope.CUSTOM_FIELDS_LIST[index].FIELD_VALUE_TEXT = '';
                    }
                    if (!$scope.IS_COMPENSATION && $scope.EDIT_PAGE) {
                        $scope.CUSTOM_FIELDS_LIST[index].DISABLED = !$scope.IS_COMPENSATION;
                        $scope.CUSTOM_FIELDS_LIST[index2].DISABLED = !$scope.IS_COMPENSATION;
                        $scope.CUSTOM_FIELDS_LIST[index_190].DISABLED = !$scope.IS_COMPENSATION;
                    }
                    break;
                case 265:
                    var index_266 = $scope.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === CUSTOM_FIELD.DEPENDANT_ID_266);
                    var index_267 = $scope.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === CUSTOM_FIELD.DEPENDANT_ID_267);
                    if ($scope.CUSTOM_FIELDS_LIST[index].FIELD_VALUE == undefined || $scope.CUSTOM_FIELDS_LIST[index].FIELD_VALUE == null || $scope.CUSTOM_FIELDS_LIST[index].FIELD_VALUE == '') {
                        CUSTOM_FIELD.IS_MANDATORY = 0;
                        $scope.CUSTOM_FIELDS_LIST[index_266].IS_MANDATORY = 0;
                        $scope.CUSTOM_FIELDS_LIST[index_267].IS_MANDATORY = 0;
                    }
                    else {
                        CUSTOM_FIELD.IS_MANDATORY = 1;
                        $scope.CUSTOM_FIELDS_LIST[index_266].IS_MANDATORY = 1;
                        $scope.CUSTOM_FIELDS_LIST[index_267].IS_MANDATORY = 1;
                    }
                    break;
                case 292:

                    $scope.child_scope.GET_REPORTING_MANAGER_BY_POSITION(CUSTOM_FIELD, $scope.CUSTOM_FIELDS_LIST[index]);
                    if (ONCHANGEFLAG != 1) {
                        $scope.child_scope.HR_GET_POSITION_BY_ID(CUSTOM_FIELD);
                    }
                    break;
                case 340:
                    var WPTTE_LST = CUSTOM_FIELD.OPTION_LIST.filter(function (x) { return x.TABLE_ID == CUSTOM_FIELD.FIELD_VALUE });
                    var index_337 = $scope.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === CUSTOM_FIELD.DEPENDANT_ID_337);
                    var index_338 = $scope.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 338);
                    var index_339 = $scope.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === CUSTOM_FIELD.DEPENDANT_ID_339);
                    $scope.FTE = $scope.GET_ENTITY_SETTINGS(1)[0].SETTING_VALUE;
                    $scope.CUSTOM_FIELDS_LIST[index_337].FIELD_VALUE = WPTTE_LST[0].AVG_WEEKLY_HOURS;
                    //$scope.CUSTOM_FIELDS_LIST[index_339].FIELD_VALUE = parseFloat($scope.$parent.FTE) / $scope.CUSTOM_FIELDS_LIST[index_337].FIELD_VALUE
                    $scope.CUSTOM_FIELDS_LIST[index_339].FIELD_VALUE = ($scope.CUSTOM_FIELDS_LIST[index_337].FIELD_VALUE / parseFloat($scope.FTE)).toFixed(2);

                    $scope.CUSTOM_FIELDS_LIST[index_338].FIELD_VALUE = WPTTE_LST[0].NO_OF_SHIFTS_PER_WEEK;

                    if (isNaN($scope.CUSTOM_FIELDS_LIST[index_339].FIELD_VALUE)) {
                        $scope.CUSTOM_FIELDS_LIST[index_339].FIELD_VALUE = '';
                    }
                    break;
                case 337:
                    var index_339 = $scope.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 339);
                    $scope.FTE = $scope.GET_ENTITY_SETTINGS(1)[0].SETTING_VALUE;
                    if (((CUSTOM_FIELD.FIELD_VALUE * 1) / $scope.FTE).toFixed(2) > 1) {
                        $scope.CUSTOM_FIELDS_LIST[index_339].FIELD_VALUE = 1;
                    }
                    else {
                        $scope.CUSTOM_FIELDS_LIST[index_339].FIELD_VALUE = ((CUSTOM_FIELD.FIELD_VALUE * 1) / $scope.FTE).toFixed(2);
                    }
                    $scope.CUSTOM_FIELDS_LIST[index_339].CHANGE_FLAG = 1;
                    if (isNaN($scope.CUSTOM_FIELDS_LIST[index_339].FIELD_VALUE)) {
                        $scope.CUSTOM_FIELDS_LIST[index_339].FIELD_VALUE = '';
                    }
                    break;
                case -339:
                    var index339 = $scope.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 339);
                    if ($scope.CUSTOM_FIELDS_LIST[index339].FIELD_VALUE > 1) {
                        $scope.CUSTOM_FIELDS_LIST[index339].FIELD_VALUE = 1;
                    }
                    if (isNaN($scope.CUSTOM_FIELDS_LIST[index339].FIELD_VALUE)) {
                        $scope.CUSTOM_FIELDS_LIST[index339].FIELD_VALUE = '';
                    }
                    break;
                case 342:
                    $scope.child_scope.GET_LOCATION_BRANCHES(CUSTOM_FIELD, $scope.CUSTOM_FIELDS_LIST[index]);
                    break;
                case 348:
                    $scope.child_scope.GET_LOCATION_BRANCHES(CUSTOM_FIELD, $scope.CUSTOM_FIELDS_LIST[index]);
                    break;
                case 350:
                    $scope.child_scope.SUB_GET_EMPLOYEE_CATEGORY(CUSTOM_FIELD, $scope.CUSTOM_FIELDS_LIST[index]);
                    break;
                case 364:
                    $scope.CUSTOM_FIELDS_LIST[index].DISABLED = true;
                    var index365 = $scope.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 365);
                    if (CUSTOM_FIELD.FIELD_VALUE > 1) {
                        $scope.CUSTOM_FIELDS_LIST[index].DISABLED = false;
                        //      $scope.CUSTOM_FIELDS_LIST[index].OPTION_LIST = $scope.CUSTOM_FIELDS_LIST[index].OPTION_LIST_COPY.filter(function (x) { return x.TABLE_ID != CUSTOM_FIELD.FIELD_VALUE });
                    }
                    if (CUSTOM_FIELD.FIELD_VALUE == undefined || CUSTOM_FIELD.FIELD_VALUE == null || CUSTOM_FIELD.FIELD_VALUE == "") {
                        $scope.CUSTOM_FIELDS_LIST[index].FIELD_VALUE = null;
                        $scope.CUSTOM_FIELDS_LIST[index365].DISABLED = true;
                        $scope.CUSTOM_FIELDS_LIST[index365].FIELD_VALUE = null;
                    };
                    break;
                case 365:
                    $scope.CUSTOM_FIELDS_LIST[index].DISABLED = true;
                    var index292 = $scope.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 292);
                    if (CUSTOM_FIELD.FIELD_VALUE > 1) {
                        //          $scope.CUSTOM_FIELDS_LIST[index].OPTION_LIST = $scope.CUSTOM_FIELDS_LIST[index].OPTION_LIST_COPY.filter(function (x) { return x.TABLE_ID != CUSTOM_FIELD.FIELD_VALUE && x.TABLE_ID != $scope.CUSTOM_FIELDS_LIST[index292].FIELD_VALUE });
                        $scope.CUSTOM_FIELDS_LIST[index].DISABLED = false;
                        //        $scope.CUSTOM_FIELDS_LIST[index292].OPTION_LIST = $scope.CUSTOM_FIELDS_LIST[index292].OPTION_LIST_COPY.filter(function (x) { return x.TABLE_ID != CUSTOM_FIELD.FIELD_VALUE });
                    }
                    if (CUSTOM_FIELD.FIELD_VALUE == undefined || CUSTOM_FIELD.FIELD_VALUE == null || CUSTOM_FIELD.FIELD_VALUE == "") {
                        $scope.CUSTOM_FIELDS_LIST[index].FIELD_VALUE = null;
                    };
                    break;
                case -365:
                    var index292 = $scope.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 292);
                    break;
                case 351:
                    var OPLT = CUSTOM_FIELD.OPTION_LIST.filter(function (x) { return x.TABLE_ID == CUSTOM_FIELD.FIELD_VALUE });
                    //var index_94=$scope.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 94)
                    //var OPLT = $scope.CUSTOM_FIELDS_LIST[index_94].OPTION_LIST.filter(function (x) { return x.TABLE_ID == CUSTOM_FIELD.FIELD_VALUE });
                    var index_351 = $scope.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 351);
                    $scope.CUSTOM_FIELDS_LIST[index_351].ENTITY_COLUMN_NAME = OPLT[0].DISPLAY_TEXT + ' Number';
                    break;

                default:

                    break;
            }
        }
        $scope.EFFICTIVE_ON_CHANGE(CUSTOM_FIELD);
        //}
    }
    $scope.NG_CHANGE_FIELD_TYPE = function (LINE, FLAG) {
        if (LINE.FIELD_TYPE_ID == 3 || LINE.FIELD_TYPE_ID == 7 || LINE.FIELD_TYPE_ID == 8) {
            var i = '';
            $scope.OPTION_SELECTION = LINE;
            if (LINE.VALUES_ENTITY != null) {
                var Arry = LINE.VALUES_ENTITY.split(':;:')
                for (var j = 0; j < Arry.length; j++) {
                    if (i == '') {
                        i = Arry[j];
                    }
                    else {
                        i = i + '\n' + Arry[j];
                    }
                }
                LINE.VALUES_ENTITY = i;
                LINE.OPTION_TEXT = i;
                LINE.OPTION_VALUE_SEP = i;
            }
            if (FLAG != 1) {
                $('#MASTER_FIELD_VALUE').modal('show');
            }
        }
    };
    $scope.ADD_OPTION_COMMON = function (OPTION) {
        var OPTION_VALUE = OPTION.FIELD_TYPE_ID == 3 || OPTION.FIELD_TYPE_ID == 6 || OPTION.FIELD_TYPE_ID == 7 || OPTION.FIELD_TYPE_ID == 8 ? OPTION == undefined || OPTION == null || OPTION.OPTION_TEXT == undefined || OPTION.OPTION_TEXT == null || OPTION.OPTION_TEXT == "" ? [] : OPTION.OPTION_TEXT.split('\n') : '';
        if (OPTION.length == 0) {
            $scope.$parent.ShowAlert('Error', 'Please Enter Answer Options to Continue.', 3000)
        }
        else {
            var i = '';
            for (var j = 0; j < OPTION_VALUE.length; j++) {
                if (i == '') {
                    i = OPTION_VALUE[j];
                }
                else {
                    i = i + ':;:' + OPTION_VALUE[j];
                }
            }
            OPTION.OPTION_VALUE_SEP = i;
        }
        $('#MASTER_FIELD_VALUE').modal('hide');
    };
    $scope.INSERT_FIELD_TYPE_ID_SET_VALUE = function (FIELD_TYPE_ID, val, EDIT_PAGE) {
        if (FIELD_TYPE_ID != 0) {
            switch (FIELD_TYPE_ID) {
                case 6:
                    if (EDIT_PAGE) {
                        if (val.FIELD_VALUE != val.PREV_FIELD_VALUE) {
                            val.CHANGE_FLAG = 1;
                            val.FIELD_VALUE = val.FIELD_VALUE ? 1 : 0
                        }
                        else {
                            val.FIELD_VALUE = null;
                        }
                    }
                    else {
                        val.FIELD_VALUE = val.FIELD_VALUE ? 1 : 0
                    }
                    break;
                case 7:
                    var i = '';
                    for (var j = 0; j < val.checkedOption.length; j++) {
                        if (i == '') {
                            i = val.checkedOption[j];
                        }
                        else {
                            i = i + ':;:' + val.checkedOption[j];
                        }
                    }
                    if (EDIT_PAGE) {
                        if (JSON.stringify(val.Prev_checkedOption) != JSON.stringify(val.checkedOption)) {
                            val.CHANGE_FLAG = 1;
                            val.FIELD_VALUE = i;
                        }
                        else {
                            val.FIELD_VALUE = null;
                        }
                    }
                    else {
                        val.FIELD_VALUE = i;
                    };
                    break;
                case 9:

                    break;
                case 11:
                    if (val.UploadedFiles == undefined || val.UploadedFiles.length == 0) {
                        if (val.IS_MANDATORY == 1) {
                            val.IsValidCount++;
                        }
                    }
                    else {
                        if (EDIT_PAGE) {
                            val.CHANGE_FLAG = 1;
                        }
                        var FILE = '';
                        for (var j = 0; j < val.UploadedFiles.length; j++) {
                            if (FILE == '') {
                                FILE = val.UploadedFiles[j].FILE_PATH + ':;:' + val.UploadedFiles[j].ORIGINAL_FILE_NAME + ':;:' + val.UploadedFiles[j].SERVER_FILE_NAME;
                            }
                            else {
                                FILE = FILE + ':;:' + val.UploadedFiles[j].FILE_PATH + ':;:' + val.UploadedFiles[j].ORIGINAL_FILE_NAME + ':;:' + val.UploadedFiles[j].SERVER_FILE_NAME;
                            }
                        }
                        val.FIELD_VALUE = FILE;
                    }
                    break;
                default:
                    break;
            }
        }
    }

    $scope.GETDROPDOWNLISTDATA = function (FIELD_MASTER_ID, CUSTOM_FIELD, ONCHANGEFLAG, Data_Obj) {
        CUSTOM_FIELD.DEPENDANT_ID = 0;
        switch (FIELD_MASTER_ID) {
            case 3:
                $scope.child_scope.HR_GET_DIVISION(CUSTOM_FIELD);
                break;
            case 5:
                $scope.child_scope.HR_GET_REPORTING_DEPARTMENTS(CUSTOM_FIELD);
                break;
            case 23:
                $scope.child_scope.HR_GET_DEPARTMENTS(CUSTOM_FIELD);
                break;
            case 24:
                $scope.child_scope.HR_GET_POSITION_LIST(CUSTOM_FIELD);
                break;
            case 42:
                $scope.child_scope.GET_HR_COST_CENTER(CUSTOM_FIELD);
                //$scope.child_scope.GET_GROUP_MAPPING(CUSTOM_FIELD);
                break;
            case 43:
                CUSTOM_FIELD.DEPENDANT_ID = 44;
                $scope.child_scope.GET_LOCATION(CUSTOM_FIELD);
                if (ONCHANGEFLAG == 1) {
                    $scope.GET_DEPENDANT_DATA(CUSTOM_FIELD.DEPENDANT_ID, CUSTOM_FIELD);
                }
                break;
            case 45:
                CUSTOM_FIELD.DEPENDANT_ID = 46;
                $scope.child_scope.GET_EMPLOYEE_CATEGORY(CUSTOM_FIELD);
                if (ONCHANGEFLAG == 1) {
                    $scope.GET_DEPENDANT_DATA(CUSTOM_FIELD.DEPENDANT_ID, CUSTOM_FIELD);
                }
                break;
            case 62:
                CUSTOM_FIELD.DEPENDANT_ID = 66;
                break;
            case 65:
                $scope.child_scope.GET_HR_PROBATION_MASTER(CUSTOM_FIELD);
                break;
            case 66:
                CUSTOM_FIELD.DEPENDANT_ID = -66;
                break;
            case 64:
                $scope.child_scope.HR_GET_CONTRACT_TYPE(CUSTOM_FIELD);
                break;
            case 91:
                CUSTOM_FIELD.DEPENDANT_ID = 94;
                $scope.child_scope.GET_NATIONALITY(CUSTOM_FIELD);
                if (ONCHANGEFLAG == 1) {
                    $scope.GET_DEPENDANT_DATA(CUSTOM_FIELD.DEPENDANT_ID, CUSTOM_FIELD);
                }
                break;
            case 94:
                CUSTOM_FIELD.DEPENDANT_ID = 351;
                break;
            case 124:
                $scope.child_scope.GET_EMERGENCY_CONTACT_RELATIONSHIP(CUSTOM_FIELD);
                break;
            case 126:
                CUSTOM_FIELD.DEPENDANT_ID = 122;
                $scope.child_scope.GET_MOBILE_CODE(CUSTOM_FIELD);
                break;
            case 127:
                CUSTOM_FIELD.DEPENDANT_ID = 125;
                $scope.child_scope.GET_MOBILE_CODE(CUSTOM_FIELD);
                break
            case 146:
                CUSTOM_FIELD.DEPENDANT_ID = 292;
                CUSTOM_FIELD.DEPENDANT_ID_146 = 146;
                CUSTOM_FIELD.DEPENDANT_ID_340 = 340;
                CUSTOM_FIELD.DEPENDANT_ID_339 = 339;
                CUSTOM_FIELD.DEPENDANT_ID_337 = 337;
                CUSTOM_FIELD.DEPENDANT_ID_338 = 338;
                $scope.child_scope.HR_GET_POSITION(CUSTOM_FIELD, ONCHANGEFLAG);
                //if (ONCHANGEFLAG == 1) {
                //    $scope.GET_DEPENDANT_DATA(CUSTOM_FIELD.DEPENDANT_ID, CUSTOM_FIELD, ONCHANGEFLAG);
                //}
                break;
            case 151:
                CUSTOM_FIELD.DEPENDANT_ID = 151;
                break;
            case 153:
                $scope.child_scope.HR_GET_NOTICE_PERIOD(CUSTOM_FIELD);
                break;
            case 187:
                CUSTOM_FIELD.DEPENDANT_ID = 187;
                CUSTOM_FIELD.DEPENDANT_ID_190 = 190;
                CUSTOM_FIELD.DEPENDANT_ID_188 = 188;
                $scope.child_scope.GET_PAY_FREQUENCY(CUSTOM_FIELD, ONCHANGEFLAG, Data_Obj);
                break;
            case 188:

                CUSTOM_FIELD.DEPENDANT_ID = 187;
                CUSTOM_FIELD.DEPENDANT_ID_190 = 190;
                CUSTOM_FIELD.DEPENDANT_ID_188 = 188;
                break;
            case 197:
                $scope.child_scope.GET_PAY_FREQUENCY(CUSTOM_FIELD);
                break;
            case 190:
                CUSTOM_FIELD.DEPENDANT_ID = 188;
                CUSTOM_FIELD.DEPENDANT_ID_2 = 191;
                CUSTOM_FIELD.DEPENDANT_ID_187 = 187;
                $scope.child_scope.GET_PAID_BY(CUSTOM_FIELD);
                if (ONCHANGEFLAG == 1) {
                    // $scope.GET_DEPENDANT_DATA(CUSTOM_FIELD.DEPENDANT_ID, CUSTOM_FIELD);
                }
                break;
            case 192:
                $scope.child_scope.GET_CURRENCY(CUSTOM_FIELD, Data_Obj);
                break;
            case 193:
                $scope.child_scope.GET_PAY_CODE(CUSTOM_FIELD);
                break;
            case 194:
                $scope.child_scope.GET_UNITS(CUSTOM_FIELD);
                break;
            case 198:
                $scope.child_scope.GET_CURRENCY(CUSTOM_FIELD);
                break;
            case 223:
                $scope.child_scope.GET_PAYMENT_TYPE(CUSTOM_FIELD);
                break;
            case 225:
                $scope.child_scope.HR_GET_NI_CATEOGRY_MASTER(CUSTOM_FIELD);
                break
            case 265:
                CUSTOM_FIELD.DEPENDANT_ID = 265;
                CUSTOM_FIELD.DEPENDANT_ID_266 = 266;
                CUSTOM_FIELD.DEPENDANT_ID_267 = 267;
                $scope.child_scope.GET_WORK_PERMIT_TYPE(CUSTOM_FIELD);
                break;
            case 292:
                //CUSTOM_FIELD.DEPENDANT_ID_292 = 292;
                CUSTOM_FIELD.DEPENDANT_ID = 364;
                //CUSTOM_FIELD.DEPENDANT_ID_364 = 364;
                //CUSTOM_FIELD.DEPENDANT_ID_339 = 339;
                //CUSTOM_FIELD.DEPENDANT_ID_337 = 337;
                //CUSTOM_FIELD.DEPENDANT_ID_338 = 338;

                break;
            case 266:
                $scope.child_scope.GET_DOCUMENT_TYPE(CUSTOM_FIELD);
                break;
            case 291:
                CUSTOM_FIELD.DEPENDANT_ID = 126;
                CUSTOM_FIELD.DEPENDANT_ID_2 = 127;
                $scope.child_scope.GET_COUNTRY(CUSTOM_FIELD);
                break;
            case 226:
                $scope.child_scope.GET_HR_PENSION_SCHEME(CUSTOM_FIELD);
                break;
            case 290:
                $scope.child_scope.HR_GET_WORK_PATTERNS(CUSTOM_FIELD);
                break;
            case 340:
                CUSTOM_FIELD.DEPENDANT_ID = 340;
                CUSTOM_FIELD.DEPENDANT_ID_339 = 339;
                CUSTOM_FIELD.DEPENDANT_ID_337 = 337;
                CUSTOM_FIELD.DEPENDANT_ID_338 = 338;
                $scope.child_scope.HR_GET_WORK_PATTERNS(CUSTOM_FIELD);
                break;
            case 341:
                $scope.child_scope.HR_GET_CONTRACT_TYPE(CUSTOM_FIELD);
                break;
            case 342:
                CUSTOM_FIELD.DEPENDANT_ID = 144;
                $scope.child_scope.GET_HR_PROBATION_MASTER(CUSTOM_FIELD);
                break;
            case 346:
                $scope.child_scope.GET_HR_COST_CENTER(CUSTOM_FIELD);
                break;
            case 337:
                CUSTOM_FIELD.DEPENDANT_ID = 337;
                break;
            case 339:
                CUSTOM_FIELD.DEPENDANT_ID = -339;
                break;
            case 347:
                CUSTOM_FIELD.DEPENDANT_ID = 348;
                $scope.child_scope.GET_LOCATION(CUSTOM_FIELD);
                if (ONCHANGEFLAG == 1) {
                    $scope.GET_DEPENDANT_DATA(CUSTOM_FIELD.DEPENDANT_ID, CUSTOM_FIELD);
                }
                break;
            case 349:
                CUSTOM_FIELD.DEPENDANT_ID = 350;
                $scope.child_scope.GET_EMPLOYEE_CATEGORY(CUSTOM_FIELD);
                if (ONCHANGEFLAG == 1) {
                    $scope.GET_DEPENDANT_DATA(CUSTOM_FIELD.DEPENDANT_ID, CUSTOM_FIELD);
                }
                break;
            case 356:
                $scope.child_scope.ADMIN_GET_HR_EMP_DECLARATION_MASTER(CUSTOM_FIELD, ONCHANGEFLAG);
                break;
            case 363:
                $scope.child_scope.HR_GET_DEPARTMENTS(CUSTOM_FIELD);
                break;
            case 364:
                CUSTOM_FIELD.DEPENDANT_ID = 365;
                $scope.child_scope.GET_REPORTING_MANAGER_BY_POSITION_1_2(CUSTOM_FIELD);
                break;
            case 365:
                $scope.child_scope.GET_REPORTING_MANAGER_BY_POSITION_1_2(CUSTOM_FIELD);
                break;
            default:
                if (!CUSTOM_FIELD.IS_DB_DROPDOWN) {
                    CUSTOM_FIELD.OPTION_LIST = [];
                    var Arry = CUSTOM_FIELD.VALUES_ENTITY == null ? [] : CUSTOM_FIELD.VALUES_ENTITY.split(':;:')
                    CUSTOM_FIELD.OPTION_LIST = Arry;
                }
                break;
        }
    }
    $scope.RESET_CUSTOM_FIELD_PAGE = function () {
        angular.forEach($scope.CUSTOM_FIELDS_LIST, function (CUSTOM_FIELD) {
            CUSTOM_FIELD.FIELD_VALUE = '';
            if (CUSTOM_FIELD.FIELD_TYPE_ID == 7) {
                CUSTOM_FIELD.checkedOption = [];
                //checkbox
            }
            if (CUSTOM_FIELD.FIELD_TYPE_ID == 6) {
                CUSTOM_FIELD.FIELD_VALUE = false;
            }
            if (CUSTOM_FIELD.FIELD_TYPE_ID == 11) {
                if (CUSTOM_FIELD.UploadedFiles == undefined) {
                    CUSTOM_FIELD.UploadedFiles = [];
                }
            }
            if (CUSTOM_FIELD.FIELD_TYPE_ID == 9) {
            }
            if (CUSTOM_FIELD.FIELD_TYPE_ID == 3 || CUSTOM_FIELD.FIELD_TYPE_ID == 7 || CUSTOM_FIELD.FIELD_TYPE_ID == 8 || CUSTOM_FIELD.FIELD_TYPE_ID == 5 || CUSTOM_FIELD.FIELD_TYPE_ID == 10) {
                CUSTOM_FIELD.FIELD_VALUE = null;
            }
        });
    }
    $scope.SET_VALUES_CUSTOM_FIELD = function (FIELD_MASTER_ID, CUSTOM_FIELD, ONCHANGEFLAG) {
        if (FIELD_MASTER_ID != 0) {
            //var index = $scope.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === FIELD_MASTER_ID);
            switch (FIELD_MASTER_ID) {
                case 192:
                    CUSTOM_FIELD.DISABLED = true;
                    break;
                case 219:
                    ONCHANGEFLAG == 1 ? '' : CUSTOM_FIELD.FIELD_VALUE = PRE_DEFINE.FIRST_NAME + ' ' + PRE_DEFINE.LAST_NAME;
                case 188:
                    CUSTOM_FIELD.DISABLED = true;
                    break;
                case 191:
                    CUSTOM_FIELD.DISABLED = true;
                    if (ONCHANGEFLAG == 1) {
                        var FIELDS = $scope.CUSTOM_FIELDS_LIST.filter(function (x) { return x.FIELD_MASTER_ID == 190 })
                        FIELDS[0].DEPENDANT_ID = 188;
                        FIELDS[0].DEPENDANT_ID_2 = 191;
                        $scope.GET_DEPENDANT_DATA(188, FIELDS[0], ONCHANGEFLAG);
                    }
                    break;
                case 217:
                    ONCHANGEFLAG == 1 ? "" : CUSTOM_FIELD.FIELD_VALUE = true;
                    break;
                case 218:
                    ONCHANGEFLAG == 1 ? "" : CUSTOM_FIELD.FIELD_VALUE = true;
                    break;
                case 92:
                    CUSTOM_FIELD.DATEINPUT_TYPE = 'dateofbirth';
                    CUSTOM_FIELD.READONLY = false
                    if (ONCHANGEFLAG == 1) {
                        if (CUSTOM_FIELD.FIELD_VALUE != null && CUSTOM_FIELD.FIELD_VALUE != '') {
                            CUSTOM_FIELD.FIELD_VALUE = moment(CUSTOM_FIELD.FIELD_VALUE).format("DD/MM/YYYY");
                        }
                    }
                    if (CUSTOM_FIELD.FIELD_VALUE != null && CUSTOM_FIELD.FIELD_VALUE != '') {
                        CUSTOM_FIELD.FIELD_VALUE = moment(CUSTOM_FIELD.FIELD_VALUE).format("LL");
                    }
                    break;
                case 353:
                    CUSTOM_FIELD.DATEINPUT_TYPE = 'dateinputOpenDateNew';
                    CUSTOM_FIELD.READONLY = false
                    if (ONCHANGEFLAG == 1) {
                        if (CUSTOM_FIELD.FIELD_VALUE != null && CUSTOM_FIELD.FIELD_VALUE != '') {
                            CUSTOM_FIELD.FIELD_VALUE = moment(CUSTOM_FIELD.FIELD_VALUE).format("DD/MM/YYYY");
                        }
                    }
                    break;
                case 354:
                    CUSTOM_FIELD.DATEINPUT_TYPE = 'dateinputOpenDateNew';
                    CUSTOM_FIELD.READONLY = false
                    if (ONCHANGEFLAG == 1) {
                        if (CUSTOM_FIELD.FIELD_VALUE != null && CUSTOM_FIELD.FIELD_VALUE != '') {
                            CUSTOM_FIELD.FIELD_VALUE = moment(CUSTOM_FIELD.FIELD_VALUE).format("DD/MM/YYYY");
                        }
                    }
                    break;

                default:
                    break;
            }

            if (CUSTOM_FIELD.FIELD_MASTER_ID == 24) {
                if (ONCHANGEFLAG == 1) {
                    CUSTOM_FIELD.FIELD_VALUE == '' || CUSTOM_FIELD.FIELD_VALUE == null ? CUSTOM_FIELD.FIELD_VALUE = -1 : CUSTOM_FIELD.FIELD_VALUE;
                }
            }
            else if (CUSTOM_FIELD.FIELD_MASTER_ID == 114) {
                if ($scope.child_scope.EDIT_PAGE) {
                    CUSTOM_FIELD.IS_CUST_EMP_EDIT = true;
                }

            }
            else if (CUSTOM_FIELD.FIELD_MASTER_ID == 5) {
                if (ONCHANGEFLAG == 1) {
                    CUSTOM_FIELD.FIELD_VALUE == '' || CUSTOM_FIELD.FIELD_VALUE == null ? CUSTOM_FIELD.FIELD_VALUE = -1 : CUSTOM_FIELD.FIELD_VALUE;
                }
            }
            else if (CUSTOM_FIELD.FIELD_MASTER_ID == 354 || CUSTOM_FIELD.FIELD_MASTER_ID == 355 || CUSTOM_FIELD.FIELD_MASTER_ID == 353) {
                CUSTOM_FIELD.IS_CUST_EMP_EDIT = true;
            }
            else if (CUSTOM_FIELD.FIELD_MASTER_ID == 355) {
                if (ONCHANGEFLAG == 1) {
                    var index151 = $scope.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 151);
                    if ($scope.CUSTOM_FIELDS_LIST[index151].FIELD_VALUE) {
                        var INDEX_354 = $scope.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 354);
                        var INDEX_353 = $scope.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 353);
                        var INDEX_355 = $scope.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 355);
                        if (!$scope.CUSTOM_FIELDS_LIST[index151].FIELD_VALUE) {
                            $scope.CUSTOM_FIELDS_LIST[INDEX_354].IS_CUST_EMP_EDIT = true;
                            $scope.CUSTOM_FIELDS_LIST[INDEX_353].IS_CUST_EMP_EDIT = true;
                            $scope.CUSTOM_FIELDS_LIST[INDEX_355].IS_CUST_EMP_EDIT = true;
                            $scope.CUSTOM_FIELDS_LIST[INDEX_353].IS_MANDATORY = false;
                            $scope.CUSTOM_FIELDS_LIST[INDEX_354].IS_MANDATORY = false;
                        } else {
                            $scope.CUSTOM_FIELDS_LIST[INDEX_354].IS_CUST_EMP_EDIT = false;
                            $scope.CUSTOM_FIELDS_LIST[INDEX_353].IS_CUST_EMP_EDIT = false;
                            $scope.CUSTOM_FIELDS_LIST[INDEX_355].IS_CUST_EMP_EDIT = false;
                            $scope.CUSTOM_FIELDS_LIST[INDEX_353].IS_MANDATORY = true;
                            $scope.CUSTOM_FIELDS_LIST[INDEX_354].IS_MANDATORY = true;
                        }
                    }
                }
            }
        }

    }
    $scope.SET_FIELD_TYPE_ID = function (FIELD_TYPE_ID, CUSTOM_FIELD, ONCHANGEFLAG, Data_Obj) {
        if (FIELD_TYPE_ID != 0) {
            switch (FIELD_TYPE_ID) {
                case 1:
                    break;
                case 2:
                    break;
                case 3:
                    CUSTOM_FIELD.FIELD_VALUE == "" || CUSTOM_FIELD.FIELD_VALUE == undefined ? CUSTOM_FIELD.FIELD_VALUE = null : CUSTOM_FIELD.FIELD_VALUE;
                    break;
                case 4:
                    break;
                case 5:
                    break;
                case 6:
                    if (ONCHANGEFLAG == 1) {
                        if (parseInt(CUSTOM_FIELD.FIELD_VALUE) == 1) {
                            CUSTOM_FIELD.FIELD_VALUE = parseInt(CUSTOM_FIELD.FIELD_VALUE) == 1 ? true : false;
                        }
                        else if (parseInt(CUSTOM_FIELD.FIELD_VALUE) == 0) {
                            CUSTOM_FIELD.FIELD_VALUE = parseInt(CUSTOM_FIELD.FIELD_VALUE) == 1 ? true : false;
                        }
                        else if ((CUSTOM_FIELD.FIELD_VALUE) == "true") {
                            CUSTOM_FIELD.FIELD_VALUE = true;
                        }
                        else if ((CUSTOM_FIELD.FIELD_VALUE) == "false") {
                            CUSTOM_FIELD.FIELD_VALUE = false;
                        }
                        CUSTOM_FIELD.PREV_FIELD_VALUE = CUSTOM_FIELD.FIELD_VALUE
                    }
                    break;
                case 7:
                    //CUSTOM_FIELD.checkedOption = [];
                    //CUSTOM_FIELD.Prev_checkedOption = [];
                    //if (ONCHANGEFLAG == 1) {
                    //    if (Data_Obj[CUSTOM_FIELD.DB_COLUMN_FOR_EDIT] != null) {
                    //        var LntCheckBox = Data_Obj[CUSTOM_FIELD.DB_COLUMN_FOR_EDIT].split(':;:');
                    //        if (LntCheckBox.length == 1) {
                    //            CUSTOM_FIELD.checkedOption.push(LntCheckBox[0]);
                    //            CUSTOM_FIELD.Prev_checkedOption.push(LntCheckBox[0]);
                    //        }
                    //        else {
                    //            angular.forEach(LntCheckBox, function (val) {
                    //                CUSTOM_FIELD.checkedOption.push(val);
                    //                CUSTOM_FIELD.Prev_checkedOption.push(val);
                    //            });
                    //        }
                    //    }
                    //}
                    break;
                case 10:
                    CUSTOM_FIELD.FIELD_VALUE == "" || CUSTOM_FIELD.FIELD_VALUE == undefined ? CUSTOM_FIELD.FIELD_VALUE = null : CUSTOM_FIELD.FIELD_VALUE;
                    break;
                default:
                    break;
            }
        }
    }
    $scope.IS_MANAGER = false;
    $scope.POP_ADD_NEW_FIELD = function (CUSTOM_FIELD) {
        switch (CUSTOM_FIELD.FIELD_MASTER_ID) {
            case 363://Add department
                $('#AddDepartment').modal('show');

                break;
            case 146:
                $('#AddPosition').modal('show');
                break;
            default:
                $scope.DashboardSelected = true;
                break;
        }
    }
    $scope.INIT_CUST_FIELDS_FOR_FIELD_MASTER_ID = function (CUSTOM_FIELD, index, Data_Obj, PRE_DEFINE, ONCHANGEFLAG) {
        switch (CUSTOM_FIELD.FIELD_MASTER_ID) {
            case 92:
                if (ONCHANGEFLAG == 1) {
                    if (CUSTOM_FIELD.FIELD_VALUE != null && CUSTOM_FIELD.FIELD_VALUE != '') {
                        CUSTOM_FIELD.FIELD_VALUE = moment(CUSTOM_FIELD.FIELD_VALUE).format("DD/MM/YYYY");
                    }
                }
                break;
            case 353:
                if (ONCHANGEFLAG == 1) {
                    if (CUSTOM_FIELD.FIELD_VALUE != null && CUSTOM_FIELD.FIELD_VALUE != '') {
                        CUSTOM_FIELD.FIELD_VALUE = moment(CUSTOM_FIELD.FIELD_VALUE).format("DD/MM/YYYY");
                    }
                }
                break;
            case 354:
                if (ONCHANGEFLAG == 1) {
                    if (CUSTOM_FIELD.FIELD_VALUE != null && CUSTOM_FIELD.FIELD_VALUE != '') {
                        CUSTOM_FIELD.FIELD_VALUE = moment(CUSTOM_FIELD.FIELD_VALUE).format("DD/MM/YYYY");
                    }
                }
                break;
            case 217:
                if (ONCHANGEFLAG == 1) {
                }
                else {
                    CUSTOM_FIELD.FIELD_VALUE = true;
                }
                break;
            case 218:
                if (ONCHANGEFLAG == 1) {
                }
                else {
                    CUSTOM_FIELD.FIELD_VALUE = true;
                }
                break;
            case 188:
                CUSTOM_FIELD.DISABLED = true;
                //if (ONCHANGEFLAG == 1 && CUSTOM_FIELD.FIELD_MASTER_ID == 191) {
                //    var FIELDS = $scope.CUSTOM_FIELDS_LIST.filter(function (x) { return x.FIELD_MASTER_ID == 190 })
                //    FIELDS[0].DEPENDANT_ID = 188;
                //    FIELDS[0].DEPENDANT_ID_2 = 191;
                //    $scope.GET_DEPENDANT_DATA(188, FIELDS[0], ONCHANGEFLAG);
                //}
                break;
            case 191:
                CUSTOM_FIELD.DISABLED = true;
                if (ONCHANGEFLAG == 1) {
                    var FIELDS = $scope.CUSTOM_FIELDS_LIST.filter(function (x) { return x.FIELD_MASTER_ID == 190 })
                    FIELDS[0].DEPENDANT_ID = 188;
                    FIELDS[0].DEPENDANT_ID_2 = 191;
                    $scope.GET_DEPENDANT_DATA(188, FIELDS[0], ONCHANGEFLAG);
                }
                break;
            case 192:
                CUSTOM_FIELD.DISABLED = true;
                break;
            case 219:
                if (ONCHANGEFLAG == 1) {
                }
                else {
                    CUSTOM_FIELD.FIELD_VALUE = PRE_DEFINE.FIRST_NAME + ' ' + PRE_DEFINE.LAST_NAME;
                }
                break;
            case 364:
                CUSTOM_FIELD.DISABLED = true;
                if (CUSTOM_FIELD.FIELD_VALUE > 0) {
                    CUSTOM_FIELD.DISABLED = false;
                    //$scope.GET_DEPENDANT_DATA(CUSTOM_FIELD.FIELD_MASTER_ID, CUSTOM_FIELD, ONCHANGEFLAG);
                }
                if (CUSTOM_FIELD.DISABLED) {
                    var FIELDS = $scope.CUSTOM_FIELDS_LIST.filter(function (x) { return x.FIELD_MASTER_ID == 292 })
                    if (FIELDS[0].FIELD_VALUE > 0) {
                        CUSTOM_FIELD.DISABLED = false;
                    }
                }
                break;
            case 365:
                CUSTOM_FIELD.DISABLED = true;
                if (CUSTOM_FIELD.FIELD_VALUE > 0) {
                    CUSTOM_FIELD.DISABLED = false;
                    //$scope.GET_DEPENDANT_DATA(CUSTOM_FIELD.FIELD_MASTER_ID, CUSTOM_FIELD, ONCHANGEFLAG);
                }
                if (CUSTOM_FIELD.DISABLED) {
                    var FIELDS = $scope.CUSTOM_FIELDS_LIST.filter(function (x) { return x.FIELD_MASTER_ID == 364 })
                    if (FIELDS[0].FIELD_VALUE > 0) {
                        CUSTOM_FIELD.DISABLED = false;
                    }
                }
                break;
            case 348:
                if ($scope.DISABLE_BRANCH_CHANGE && (Data_Obj != undefined && Data_Obj != null)) {
                    if (Data_Obj.STEP_NO < 7) {
                        CUSTOM_FIELD.DISABLED = false;
                    }
                    if (Data_Obj.STEP_NO >= 7) {
                        CUSTOM_FIELD.DISABLED = true;
                    }
                }

                break;
            case 358:
                CUSTOM_FIELD.NG_CLASS = "text-uppercase";
                break;
            default:
                $scope.DashboardSelected = true;
                break;
        }
    }
    $scope.initializecustfields = function (CUSTOM_FIELD, index, Data_Obj, PRE_DEFINE) {
        CUSTOM_FIELD.CF_INDEX = index;
        //  CUSTOM_FIELD.IS_CUST_EMP_EDIT = false;
        //  CUSTOM_FIELD.IS_EMP_EDIT = false;
        if (CUSTOM_FIELD.APP_PAGE_ID == 17) {
            if (!$scope.IS_PLAIN) {// MANAGER
                CUSTOM_FIELD.IS_MANDATORY = CUSTOM_FIELD.IS_MANDATORY_MANAGER;
            }
            else {
                CUSTOM_FIELD.IS_MANDATORY = CUSTOM_FIELD.IS_MANDATORY_EMP;
                CUSTOM_FIELD.IS_EMP_EDIT ? CUSTOM_FIELD.IS_CUST_EMP_EDIT = false : CUSTOM_FIELD.IS_CUST_EMP_EDIT = true;
                CUSTOM_FIELD.DISABLED = CUSTOM_FIELD.IS_CUST_EMP_EDIT;
            }
        }
        else {
            if ($cookies.get("EMPLOYEE_ID") == parseInt(getUrlParameter('EmpID', $location.absUrl()))) {
                CUSTOM_FIELD.IS_MANAGER = false;
                $scope.IS_MANAGER = false;
            }
            else {
                CUSTOM_FIELD.IS_MANDATORY = CUSTOM_FIELD.IS_MANDATORY_MANAGER;
                CUSTOM_FIELD.IS_MANAGER = true;
                $scope.IS_MANAGER = true;
            }
        }

        if (CUSTOM_FIELD.APP_PAGE_ID == 1 || CUSTOM_FIELD.APP_PAGE_ID == 2 || CUSTOM_FIELD.APP_PAGE_ID == 3 || CUSTOM_FIELD.APP_PAGE_ID == 4) {
        }
        else {
            CUSTOM_FIELD.IS_EMP_EDIT ? CUSTOM_FIELD.IS_CUST_EMP_EDIT = false : CUSTOM_FIELD.IS_CUST_EMP_EDIT = true;
            CUSTOM_FIELD.DISABLED = CUSTOM_FIELD.IS_CUST_EMP_EDIT;
        }
        var ONCHANGEFLAG = Data_Obj != undefined && Data_Obj != null && Data_Obj.length != 0 ? 1 : 0;
        if (ONCHANGEFLAG == 1) {
            if ($cookies.get("EMPLOYEE_ID") == parseInt(getUrlParameter('EmpID', $location.absUrl()))) {
                CUSTOM_FIELD.IS_EMP_EDIT ? CUSTOM_FIELD.IS_CUST_EMP_EDIT = false : CUSTOM_FIELD.IS_CUST_EMP_EDIT = true;
                //  CUSTOM_FIELD.IS_CUST_EMP_EDIT = CUSTOM_FIELD.IS_EMP_EDIT;
                //CUSTOM_FIELD.DISABLED = CUSTOM_FIELD.IS_EMP_EDIT;
                CUSTOM_FIELD.DISABLED = CUSTOM_FIELD.IS_CUST_EMP_EDIT;
                CUSTOM_FIELD.IS_MANAGER = false;
                $scope.IS_MANAGER = false;
            }
            else {
                CUSTOM_FIELD.IS_MANAGER = true;
                $scope.IS_MANAGER = true;
            }
        }
        CUSTOM_FIELD.MAXLENGTH = 20;
        if (CUSTOM_FIELD.FIELD_TYPE_ID == 5 && CUSTOM_FIELD.FIELD_MASTER_ID == 222) {
            CUSTOM_FIELD.MAXLENGTH = 20;
        }
        if (CUSTOM_FIELD.FIELD_TYPE_ID == 7) {
            CUSTOM_FIELD.checkedOption = [];
            CUSTOM_FIELD.Prev_checkedOption = [];
        }
        if (Data_Obj != undefined && Data_Obj != null && Data_Obj.length != 0) {
            CUSTOM_FIELD.FIELD_VALUE_TEXT = angular.copy(Data_Obj[CUSTOM_FIELD.DB_COLUMN_FOR_EDIT]);
            CUSTOM_FIELD.FIELD_VALUE = Data_Obj[CUSTOM_FIELD.DB_COLUMN_FOR_EDIT];
            $scope.SET_FIELD_TYPE_ID(CUSTOM_FIELD.FIELD_TYPE_ID, CUSTOM_FIELD, ONCHANGEFLAG, Data_Obj)
            if (CUSTOM_FIELD.FIELD_TYPE_ID == 7) {
                if (Data_Obj[CUSTOM_FIELD.DB_COLUMN_FOR_EDIT] != null && Data_Obj[CUSTOM_FIELD.DB_COLUMN_FOR_EDIT] != "" && Data_Obj[CUSTOM_FIELD.DB_COLUMN_FOR_EDIT] != undefined) {
                    var LntCheckBox = Data_Obj[CUSTOM_FIELD.DB_COLUMN_FOR_EDIT].split(':;:');
                    if (LntCheckBox.length == 1) {
                        CUSTOM_FIELD.checkedOption.push(LntCheckBox[0]);
                        CUSTOM_FIELD.Prev_checkedOption.push(LntCheckBox[0]);
                    }
                    else {
                        angular.forEach(LntCheckBox, function (val) {
                            CUSTOM_FIELD.checkedOption.push(val);
                            CUSTOM_FIELD.Prev_checkedOption.push(val);
                        });
                    }
                }
            }
            if (CUSTOM_FIELD.FIELD_TYPE_ID == 6) {
                if (parseInt(CUSTOM_FIELD.FIELD_VALUE) == 1) {
                    CUSTOM_FIELD.FIELD_VALUE = parseInt(CUSTOM_FIELD.FIELD_VALUE) == 1 ? true : false;
                }
                if (parseInt(CUSTOM_FIELD.FIELD_VALUE) == 0) {
                    CUSTOM_FIELD.FIELD_VALUE = parseInt(CUSTOM_FIELD.FIELD_VALUE) == 1 ? true : false;
                }
                CUSTOM_FIELD.PREV_FIELD_VALUE = CUSTOM_FIELD.FIELD_VALUE
            }
            if (CUSTOM_FIELD.FIELD_TYPE_ID == 11) {
                if (CUSTOM_FIELD.UploadedFiles == undefined) {
                    CUSTOM_FIELD.UploadedFiles = [];
                }
                var Files = [];
                if (Data_Obj[CUSTOM_FIELD.DB_COLUMN_FOR_EDIT] == undefined || Data_Obj[CUSTOM_FIELD.DB_COLUMN_FOR_EDIT] == null || Data_Obj[CUSTOM_FIELD.DB_COLUMN_FOR_EDIT] == '') {
                }
                else {
                    Files = Data_Obj[CUSTOM_FIELD.DB_COLUMN_FOR_EDIT].split(':;:');
                }
                if (Files.length > 1) {
                    var Count = Files.length / 3;
                    for (var i = 0; i < Count; i++) {
                        var GETL = new Object();
                        GETL.FILE_PATH = Files[3 * i];
                        GETL.ORIGINAL_FILE_NAME = Files[3 * i + 1];
                        GETL.SERVER_FILE_NAME = Files[3 * i + 2];
                        CUSTOM_FIELD.UploadedFiles.push(GETL);
                    }
                    //})
                }
            }
        }
        if (CUSTOM_FIELD.FIELD_TYPE_ID == 9) {
            CUSTOM_FIELD.DATEINPUT_TYPE = 'dateinput';
            CUSTOM_FIELD.READONLY = true;
            CUSTOM_FIELD.FLAG = 1;
            if (CUSTOM_FIELD.FIELD_MASTER_ID == 143 || CUSTOM_FIELD.FIELD_MASTER_ID == 144) {
                // CUSTOM_FIELD.FLAG = 2;
                // CUSTOM_FIELD.READONLY = false
                CUSTOM_FIELD.DATEINPUT_TYPE = 'dateinputOpenDate';
            }
            else if (CUSTOM_FIELD.FIELD_MASTER_ID == 353 || CUSTOM_FIELD.FIELD_MASTER_ID == 354) {
                CUSTOM_FIELD.DATEINPUT_TYPE = 'dateinputOpenDateNew';
                CUSTOM_FIELD.READONLY = false
            }
            else if (CUSTOM_FIELD.FIELD_MASTER_ID == 92) {
                CUSTOM_FIELD.DATEINPUT_TYPE = 'dateofbirth';
                CUSTOM_FIELD.READONLY = false
            }
            if (ONCHANGEFLAG == 1) {
                // if (CUSTOM_FIELD.FLAG == 2) {
                //    CUSTOM_FIELD.FIELD_VALUE = moment(CUSTOM_FIELD.FIELD_VALUE).format("DD/MM/YYYY");
                // }
                //  else {
                if (CUSTOM_FIELD.FIELD_VALUE != null && CUSTOM_FIELD.FIELD_VALUE != '') {
                    CUSTOM_FIELD.FIELD_VALUE = moment(CUSTOM_FIELD.FIELD_VALUE).format("LL");
                }
                // }
            }
        }
        if (CUSTOM_FIELD.FIELD_TYPE_ID == 6 || CUSTOM_FIELD.FIELD_TYPE_ID == 3 || CUSTOM_FIELD.FIELD_TYPE_ID == 7 || CUSTOM_FIELD.FIELD_TYPE_ID == 8 || CUSTOM_FIELD.FIELD_TYPE_ID == 5 || CUSTOM_FIELD.FIELD_TYPE_ID == 10) {
            $scope.GETDROPDOWNLISTDATA(CUSTOM_FIELD.FIELD_MASTER_ID, CUSTOM_FIELD, ONCHANGEFLAG, Data_Obj);
        }
        if (CUSTOM_FIELD.FIELD_TYPE_ID == 2) {
            $scope.PatternValidation(CUSTOM_FIELD.FIELD_MASTER_ID, CUSTOM_FIELD);
            if (CUSTOM_FIELD.IS_COLOR_PICKER) {
            }
        }
        //if (CUSTOM_FIELD.FIELD_MASTER_ID == 192) {
        //    CUSTOM_FIELD.DISABLED = true;
        //}
        //if (CUSTOM_FIELD.FIELD_MASTER_ID == 219) {
        //    if (ONCHANGEFLAG == 1) {
        //    }
        //    else {
        //        CUSTOM_FIELD.FIELD_VALUE = PRE_DEFINE.FIRST_NAME + ' ' + PRE_DEFINE.LAST_NAME;
        //    }
        //}
        //if (CUSTOM_FIELD.FIELD_MASTER_ID == 188 || CUSTOM_FIELD.FIELD_MASTER_ID == 191) {
        //    CUSTOM_FIELD.DISABLED = true;
        //    if (ONCHANGEFLAG == 1 && CUSTOM_FIELD.FIELD_MASTER_ID == 191) {
        //        var FIELDS = $scope.CUSTOM_FIELDS_LIST.filter(function (x) { return x.FIELD_MASTER_ID == 190 })
        //        FIELDS[0].DEPENDANT_ID = 188;
        //        FIELDS[0].DEPENDANT_ID_2 = 191;
        //        $scope.GET_DEPENDANT_DATA(188, FIELDS[0], ONCHANGEFLAG);
        //    }
        //}
        //if (CUSTOM_FIELD.FIELD_MASTER_ID == 217 || CUSTOM_FIELD.FIELD_MASTER_ID == 218) {
        //    if (ONCHANGEFLAG == 1) {
        //    }
        //    else {
        //        CUSTOM_FIELD.FIELD_VALUE = true;
        //    }
        //}

        //if (CUSTOM_FIELD.FIELD_MASTER_ID == 92 || CUSTOM_FIELD.FIELD_MASTER_ID == 353 || CUSTOM_FIELD.FIELD_MASTER_ID == 354) {
        //    if (ONCHANGEFLAG == 1) {
        //        if (CUSTOM_FIELD.FIELD_VALUE != null && CUSTOM_FIELD.FIELD_VALUE != '') {
        //            CUSTOM_FIELD.FIELD_VALUE = moment(CUSTOM_FIELD.FIELD_VALUE).format("DD/MM/YYYY");
        //        }
        //    }
        //}

        if (CUSTOM_FIELD.FIELD_MASTER_ID == 24) {
            if (ONCHANGEFLAG == 1) {
                CUSTOM_FIELD.FIELD_VALUE == '' || CUSTOM_FIELD.FIELD_VALUE == null ? CUSTOM_FIELD.FIELD_VALUE = -1 : CUSTOM_FIELD.FIELD_VALUE;
            }
        }
        if (CUSTOM_FIELD.FIELD_MASTER_ID == 114) {
            if ($scope.child_scope.EDIT_PAGE || $scope.CURRENT_STEP_NO_EMP >= 5) {
                CUSTOM_FIELD.IS_CUST_EMP_EDIT = true;
            }
        }
        if (CUSTOM_FIELD.FIELD_MASTER_ID == 5) {
            ONCHANGEFLAG == 1 ? (CUSTOM_FIELD.FIELD_VALUE == '' || CUSTOM_FIELD.FIELD_VALUE == null ? CUSTOM_FIELD.FIELD_VALUE = -1 : CUSTOM_FIELD.FIELD_VALUE) : '';
        }
        if (CUSTOM_FIELD.FIELD_MASTER_ID == 144 || CUSTOM_FIELD.FIELD_MASTER_ID == 355 || CUSTOM_FIELD.FIELD_MASTER_ID == 353 || CUSTOM_FIELD.FIELD_MASTER_ID == 354) {
            CUSTOM_FIELD.IS_CUST_EMP_EDIT = true;
            CUSTOM_FIELD.READONLY = false;
        }
        if (CUSTOM_FIELD.FIELD_MASTER_ID == 355) {
            if (ONCHANGEFLAG == 1) {
                var index151 = $scope.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 151);
                if ($scope.CUSTOM_FIELDS_LIST[index151].FIELD_VALUE) {
                    var INDEX_354 = $scope.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 354);
                    var INDEX_353 = $scope.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 353);
                    var INDEX_355 = $scope.CUSTOM_FIELDS_LIST.findIndex(x => x.FIELD_MASTER_ID === 355);
                    if (!$scope.CUSTOM_FIELDS_LIST[index151].FIELD_VALUE) {
                        $scope.CUSTOM_FIELDS_LIST[INDEX_354].IS_CUST_EMP_EDIT = true;
                        $scope.CUSTOM_FIELDS_LIST[INDEX_353].IS_CUST_EMP_EDIT = true;
                        $scope.CUSTOM_FIELDS_LIST[INDEX_355].IS_CUST_EMP_EDIT = true;
                        $scope.CUSTOM_FIELDS_LIST[INDEX_353].IS_MANDATORY = false;
                        $scope.CUSTOM_FIELDS_LIST[INDEX_354].IS_MANDATORY = false;
                    } else {
                        $scope.CUSTOM_FIELDS_LIST[INDEX_354].IS_CUST_EMP_EDIT = false;
                        $scope.CUSTOM_FIELDS_LIST[INDEX_353].IS_CUST_EMP_EDIT = false;
                        $scope.CUSTOM_FIELDS_LIST[INDEX_355].IS_CUST_EMP_EDIT = false;
                        $scope.CUSTOM_FIELDS_LIST[INDEX_353].IS_MANDATORY = true;
                        $scope.CUSTOM_FIELDS_LIST[INDEX_354].IS_MANDATORY = true;
                    }
                }
            }
        }
        if (CUSTOM_FIELD.FIELD_MASTER_ID == 115 && CUSTOM_FIELD.APP_PAGE_ID != 6) {
            if (CUSTOM_FIELD.FIELD_VALUE != '' && CUSTOM_FIELD.FIELD_VALUE != null && CUSTOM_FIELD.FIELD_VALUE != undefined) {
                CUSTOM_FIELD.IS_CUST_EMP_EDIT = true;
            }
        }
        CUSTOM_FIELD.IS_ADD_PLUS = false;
        if (CUSTOM_FIELD.FIELD_MASTER_ID == 363 && $scope.GET_ENTITY_SETTINGS(31)[0].SETTING_VALUE == "1" && $scope.CHECK_MODULE_ACCESS(1, 2) || CUSTOM_FIELD.FIELD_MASTER_ID == 146 && $scope.GET_ENTITY_SETTINGS(32)[0].SETTING_VALUE == "1" && $scope.CHECK_MODULE_ACCESS(2, 2)) {
            CUSTOM_FIELD.IS_ADD_PLUS = true;
            //On 32 to 0
            //31 department 
            //32 position
        }

        $scope.INIT_CUST_FIELDS_FOR_FIELD_MASTER_ID(CUSTOM_FIELD, index, Data_Obj, PRE_DEFINE, ONCHANGEFLAG);
    }
    $scope.initializeviewcustfields = function (CUSTOM_FIELD, index, Data_Obj, data) {
        CUSTOM_FIELD.CF_INDEX = index;

        var ONCHANGEFLAG = Data_Obj != undefined && Data_Obj != null && Data_Obj.length != 0 ? 1 : 0;
        if (CUSTOM_FIELD.FIELD_TYPE_ID == 7) {
            CUSTOM_FIELD.checkedOption = [];
        }
        if (Data_Obj != undefined && Data_Obj != null && Data_Obj.length != 0) {
            CUSTOM_FIELD.FIELD_VALUE_ID = angular.copy(Data_Obj[CUSTOM_FIELD.DB_COLUMN_FOR_EDIT]);
            CUSTOM_FIELD.FIELD_VALUE = Data_Obj[CUSTOM_FIELD.DB_COLUMN_FOR_DISPLAY];
            if (CUSTOM_FIELD.FIELD_TYPE_ID == 7) {
                var LntCheckBox = Data_Obj[CUSTOM_FIELD.DB_COLUMN_FOR_EDIT].split(':;:');
                if (LntCheckBox.length == 1) {
                    CUSTOM_FIELD.checkedOption.push(LntCheckBox[0]);
                }
                else {
                    angular.forEach(LntCheckBox, function (val) {
                        CUSTOM_FIELD.checkedOption.push(val);
                    });
                }
            }
            if (CUSTOM_FIELD.FIELD_TYPE_ID == 6) {
                if (parseInt(CUSTOM_FIELD.FIELD_VALUE) == 1 || ((CUSTOM_FIELD.FIELD_VALUE) == "true")) {
                    CUSTOM_FIELD.FIELD_VALUE = true;
                }
                else if (parseInt(CUSTOM_FIELD.FIELD_VALUE) == 0 || ((CUSTOM_FIELD.FIELD_VALUE) == "false")) {
                    CUSTOM_FIELD.FIELD_VALUE = false;
                }
            }
            if (CUSTOM_FIELD.FIELD_TYPE_ID == 11) {
                if (CUSTOM_FIELD.UploadedFiles == undefined) {
                    CUSTOM_FIELD.UploadedFiles = [];
                }
                var Files = [];
                if (Data_Obj[CUSTOM_FIELD.DB_COLUMN_FOR_EDIT] == undefined || Data_Obj[CUSTOM_FIELD.DB_COLUMN_FOR_EDIT] == null || Data_Obj[CUSTOM_FIELD.DB_COLUMN_FOR_EDIT] == '') {
                }
                else {
                    Files = Data_Obj[CUSTOM_FIELD.DB_COLUMN_FOR_EDIT].split(':;:');
                }

                if (Files.length > 1) {
                    var Count = Files.length / 3;
                    for (var i = 0; i < Count; i++) {
                        var GETL = new Object();
                        GETL.FILE_PATH = Files[3 * i];
                        GETL.ORIGINAL_FILE_NAME = Files[3 * i + 1];
                        GETL.SERVER_FILE_NAME = Files[3 * i + 2];
                        CUSTOM_FIELD.UploadedFiles.push(GETL);
                    }
                }
                else { }
            }
            if (CUSTOM_FIELD.FIELD_TYPE_ID == 10) {
                if (CUSTOM_FIELD.FIELD_VALUE != '' && CUSTOM_FIELD.FIELD_VALUE != undefined && CUSTOM_FIELD.FIELD_VALUE != null) {
                    CUSTOM_FIELD.FIELD_VALUE = parseFloat(CUSTOM_FIELD.FIELD_VALUE).toFixed(2);
                }
            }
            if (CUSTOM_FIELD.FIELD_MASTER_ID == 292) {
                if (Data_Obj.Table1 != undefined && Data_Obj.Table1.length > 0) {
                    CUSTOM_FIELD.FIELD_VALUE = Array.prototype.map.call(Data_Obj.Table1, function (item) { return item.FIRST_NAME; }).join(",");
                }
            }
            if (CUSTOM_FIELD.FIELD_MASTER_ID == 24) {
                if (Data_Obj.Table3 != undefined && Data_Obj.Table3.length > 0) {
                    CUSTOM_FIELD.FIELD_VALUE = Array.prototype.map.call(Data_Obj.Table3, function (item) { return item.REPORTING_POSITION_TITLE; }).join(",");
                }
            }
        }
        CUSTOM_FIELD.IS_ADD_PLUS = false;
        if (CUSTOM_FIELD.FIELD_MASTER_ID == 363 && $scope.GET_ENTITY_SETTINGS(31)[0].SETTING_VALUE == "1" && $scope.CHECK_MODULE_ACCESS(1, 2) || CUSTOM_FIELD.FIELD_MASTER_ID == 146 && $scope.GET_ENTITY_SETTINGS(32)[0].SETTING_VALUE == "1" && $scope.CHECK_MODULE_ACCESS(2, 2)) {
            CUSTOM_FIELD.IS_ADD_PLUS = true;
            //On 32 to 0 //31 department  //32 position
        }
        //   if (CUSTOM_FIELD.FIELD_TYPE_ID == 3 || CUSTOM_FIELD.FIELD_TYPE_ID == 7 || CUSTOM_FIELD.FIELD_TYPE_ID == 8 || CUSTOM_FIELD.FIELD_TYPE_ID == 5 || CUSTOM_FIELD.FIELD_TYPE_ID == 10) {
        //  $scope.GETDROPDOWNLISTDATA(CUSTOM_FIELD.FIELD_MASTER_ID, CUSTOM_FIELD, ONCHANGEFLAG, Data_Obj);
        //  }
    }
    $scope.initializeHistoryviewcustfields = function (CUSTOM_FIELD, index, Data_Obj, DataHistory) {
        CUSTOM_FIELD.CF_INDEX = index;

        var ONCHANGEFLAG = Data_Obj != undefined && Data_Obj != null && Data_Obj.length != 0 ? 1 : 0;
        if (CUSTOM_FIELD.FIELD_TYPE_ID == 7) {
            CUSTOM_FIELD.checkedOption = [];
            CUSTOM_FIELD.Prev_checkedOption = [];
        }
        if (Data_Obj != undefined && Data_Obj != null && Data_Obj.length != 0) {
            CUSTOM_FIELD.FIELD_VALUE_ID = angular.copy(Data_Obj[CUSTOM_FIELD.DB_COLUMN_FOR_EDIT]);

            CUSTOM_FIELD.FIELD_VALUE = Data_Obj[CUSTOM_FIELD.DB_COLUMN_FOR_DISPLAY];
            CUSTOM_FIELD.PREV_FIELD_VALUE = DataHistory != undefined ? DataHistory[CUSTOM_FIELD.DB_COLUMN_FOR_DISPLAY] : null;
            if (CUSTOM_FIELD.FIELD_TYPE_ID == 7) {
                var LntCheckBox = CUSTOM_FIELD.FIELD_VALUE == null ? [] : Data_Obj[CUSTOM_FIELD.DB_COLUMN_FOR_EDIT].split(':;:');
                var PrevLntCheckBox = CUSTOM_FIELD.PREV_FIELD_VALUE == null ? [] : CUSTOM_FIELD.PREV_FIELD_VALUE.split(':;:');
                if (LntCheckBox.length == 1) {
                    CUSTOM_FIELD.checkedOption.push(LntCheckBox[0]);
                }
                else {
                    angular.forEach(LntCheckBox, function (val) {
                        CUSTOM_FIELD.checkedOption.push(val);
                    });
                }
                if (PrevLntCheckBox.length == 1) {
                    CUSTOM_FIELD.Prev_checkedOption.push(PrevLntCheckBox[0]);
                }
                else {
                    angular.forEach(PrevLntCheckBox, function (val) {
                        CUSTOM_FIELD.Prev_checkedOption.push(val);
                    });
                }
                if (CUSTOM_FIELD.FIELD_VALUE != null) {
                    if (JSON.stringify(CUSTOM_FIELD.Prev_checkedOption) != JSON.stringify(CUSTOM_FIELD.checkedOption)) {
                        CUSTOM_FIELD.IS_CHANGE_FLAG = 1;
                    }
                }
            }
            else if (CUSTOM_FIELD.FIELD_TYPE_ID == 6) {
                if (parseInt(CUSTOM_FIELD.FIELD_VALUE) == 1 || (CUSTOM_FIELD.FIELD_VALUE) == "true") {
                    CUSTOM_FIELD.FIELD_VALUE = true;
                }
                if (parseInt(CUSTOM_FIELD.FIELD_VALUE) == 0 || (CUSTOM_FIELD.FIELD_VALUE) == "false") {
                    CUSTOM_FIELD.FIELD_VALUE = false;
                }
                if (parseInt(CUSTOM_FIELD.PREV_FIELD_VALUE) == 1 || (CUSTOM_FIELD.PREV_FIELD_VALUE) == "true") {
                    CUSTOM_FIELD.PREV_FIELD_VALUE = true;
                }
                if (parseInt(CUSTOM_FIELD.PREV_FIELD_VALUE) == 0 || (CUSTOM_FIELD.PREV_FIELD_VALUE) == "false") {
                    CUSTOM_FIELD.PREV_FIELD_VALUE = false;
                }
                if (CUSTOM_FIELD.FIELD_VALUE != null) {
                    CUSTOM_FIELD.IS_CHANGE_FLAG = 1;
                }
            }
            else if (CUSTOM_FIELD.FIELD_TYPE_ID == 11) {
                if (CUSTOM_FIELD.UploadedFiles == undefined) {
                    CUSTOM_FIELD.UploadedFiles = [];
                }
                var Files = [];
                if (Data_Obj[CUSTOM_FIELD.DB_COLUMN_FOR_EDIT] == undefined || Data_Obj[CUSTOM_FIELD.DB_COLUMN_FOR_EDIT] == null || Data_Obj[CUSTOM_FIELD.DB_COLUMN_FOR_EDIT] == '') {
                }
                else {
                    Files = Data_Obj[CUSTOM_FIELD.DB_COLUMN_FOR_EDIT].split(':;:');
                }
                if (Files.length > 1) {
                    var GETL = new Object();
                    GETL.FILE_PATH = Files[0];
                    GETL.ORIGINAL_FILE_NAME = Files[1];
                    GETL.SERVER_FILE_NAME = Files[2];
                    CUSTOM_FIELD.UploadedFiles.push(GETL);
                }
            }
            if (CUSTOM_FIELD.FIELD_MASTER_ID == 292) {
                if (DataHistory.Table1 != undefined && DataHistory.Table1.length > 0) {
                    CUSTOM_FIELD.PREV_FIELD_VALUE = Array.prototype.map.call(DataHistory.Table1, function (item) { return item.FIRST_NAME; }).join(",");
                    CUSTOM_FIELD.FIELD_VALUE = Array.prototype.map.call(DataHistory.Table1, function (item) { return item.FIRST_NAME; }).join(",");
                }
                if (Data_Obj.Table1 != undefined && Data_Obj.Table1.length > 0) {
                    CUSTOM_FIELD.FIELD_VALUE = Array.prototype.map.call(Data_Obj.Table1, function (item) { return item.FIRST_NAME; }).join(",");
                }
            }
            else if (CUSTOM_FIELD.FIELD_MASTER_ID == 24) {
                if (Data_Obj.Table3 != undefined && Data_Obj.Table3.length > 0) {
                    CUSTOM_FIELD.FIELD_VALUE = Array.prototype.map.call(Data_Obj.Table3, function (item) { return item.REPORTING_POSITION_TITLE; }).join(",");
                }
            }
        }
    }
    $scope.toggleCheck = function (Optionvalue, LINE) {
        if (LINE.checkedOption == undefined) {
            LINE.checkedOption = [];
        }
        if (LINE.checkedOption.indexOf(Optionvalue) === -1) {
            LINE.checkedOption.push(Optionvalue);
        } else {
            LINE.checkedOption.splice(LINE.checkedOption.indexOf(Optionvalue), 1);
        }
        $scope.EFFICTIVE_ON_CHANGE(LINE);
    }
    $scope.getTheFilesToUploadall = function ($files, FileSize, List, index, UPLOAD_ID_NAME, LOGO_UPLOADED_BY, Attachment_UPLOAD_TYPE_ID) {
        if (FileSize == undefined || FileSize == null || FileSize == 0 || FileSize == '') {
            FileSize = AppVal.FileSize;
        }
        $scope.imagesrc = [];
        var valid = 0;
        for (var i = 0; i < $files.length; i++) {

            if ($scope.Attachment_UPLOAD_TYPE_ID == 12) {
                var validFormats = ['MPEG4', 'MP4', 'video/mp4'];
            }
            else if (Attachment_UPLOAD_TYPE_ID == 54 || Attachment_UPLOAD_TYPE_ID == 55 || Attachment_UPLOAD_TYPE_ID == 56) {
                var validFormats = ['excel', 'sheet'];
            }
            else if (Attachment_UPLOAD_TYPE_ID == 52) {
                var validFormats = ['csv', 'excel', 'sheet', 'csv'];
            }
            else {
                var validFormats = ['doc', 'docx', 'xml', 'pdf', 'csv', 'txt', 'text', 'jpg', 'jpeg', 'png', 'MPEG4', 'MP4', 'video/mp4', 'excel', 'sheet'];
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
                    if (Attachment_UPLOAD_TYPE_ID == 52) {
                        $scope.ShowAlertBox('Error', 'Maximum File Size ' + FileSize + ' MB.', 5000);
                    }
                    else {
                        $scope.ShowAlert('Error', 'Maximum File Size ' + FileSize + ' MB.', 5000);
                    }

                    angular.element("input[id='" + ControlName + "']").val(null);
                    return;
                }
            }
            else {
                if (Attachment_UPLOAD_TYPE_ID == 52) {
                    $scope.ShowAlertBox('Error', 'Not a valid file.', 5000);
                }
                else {
                    $scope.ShowAlert('Error', 'Not a valid file.', 5000);
                }

                angular.element("input[id='" + ControlName + "']").val(null);
                return;
            }

        }
        $scope.Files = $files;
        if (UPLOAD_ID_NAME == undefined) {
            //   var fileUpload = document.getElementById("certificate" + index);
            extension = $scope.Files[0].name;
        }
        else {
            var fileUpload = document.getElementById(UPLOAD_ID_NAME + index);
            extension = fileUpload.files.length == 0 || fileUpload.files == undefined ? $scope.Files[0].name : fileUpload.files[0].name;
        }
        Attachment_UPLOAD_TYPE_ID = Attachment_UPLOAD_TYPE_ID == undefined ? 1 : Attachment_UPLOAD_TYPE_ID;
        $scope.uploadFilesAll(Attachment_UPLOAD_TYPE_ID, '', extension, List, index, LOGO_UPLOADED_BY);
    };
    $scope.getTheFilesToUpload = function ($files, ControlName, FileSize, List, Attachment_UPLOAD_TYPE_ID, UPLOAD_OR_NOT_FLAG, FOLDER_NAME, MAX_ATTACHMENT_LENGTH, CONFIG_KEY_NAME, API_PATH, ALREADY_RELATIVE_ID) {
        if (List != undefined && List.UploadedFiles == undefined) {
            List.UploadedFiles = [];
        }
        if (MAX_ATTACHMENT_LENGTH == undefined || List.UploadedFiles.length < MAX_ATTACHMENT_LENGTH) {
            $scope.Files = [];
            if ($files.length == 0) {
                $scope.Files = [];
                $scope.child_scope.CANCEL_EXCEL_FY();
            }
            else {
                $scope.SelectedFile = $files[0];
                if (FileSize == undefined || FileSize == null || FileSize == 0 || FileSize == '') {
                    FileSize = AppVal.FileSize;
                }
                $scope.imagesrc = [];
                var valid = 0;
                for (var i = 0; i < $files.length; i++) {
                    if ($scope.Attachment_UPLOAD_TYPE_ID == 12) {
                        var validFormats = ['MPEG4', 'MP4', 'video/mp4'];
                    }
                    else if (Attachment_UPLOAD_TYPE_ID == 50) {
                        var validFormats = ['pdf', 'jpg', 'jpeg', 'png'];
                    }
                    else if (Attachment_UPLOAD_TYPE_ID == 51) {
                        var validFormats = ['pdf', 'jpg', 'jpeg', 'png', 'excel', 'doc', 'docx'];
                    }
                    else if (Attachment_UPLOAD_TYPE_ID == 31 || Attachment_UPLOAD_TYPE_ID == 32 || Attachment_UPLOAD_TYPE_ID == 33 || Attachment_UPLOAD_TYPE_ID == 34 || Attachment_UPLOAD_TYPE_ID == 35 || Attachment_UPLOAD_TYPE_ID == 36)
                        var validFormats = ['doc', 'docx', 'xml', 'pdf', 'csv', 'txt', 'text', 'jpg', 'jpeg', 'png', 'excel'];
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
                            if (Attachment_UPLOAD_TYPE_ID == 50 || Attachment_UPLOAD_TYPE_ID == 51) {
                                let result = parseFloat(FileSize) * 1000;
                                $scope.ShowAlertBox('Error', 'Maximum File Size ' + result + ' KB.', 5000);
                            }
                            else {
                                $scope.ShowAlert('Error', 'Maximum File Size ' + FileSize + ' MB.', 5000);
                            }
                            angular.element("input[id='" + ControlName + "']").val(null);
                            return;
                        }
                    }
                    else {
                        if (Attachment_UPLOAD_TYPE_ID == 50 || Attachment_UPLOAD_TYPE_ID == 51) {
                            $scope.ShowAlertBox('Error', 'Not a valid file.', 5000);
                        }
                        else {
                            $scope.ShowAlert('Error', 'Not a valid file.', 5000);
                        }
                        angular.element("input[id='" + ControlName + "']").val(null);
                        return;
                    }

                }
                $scope.Files = $files;
                if (UPLOAD_OR_NOT_FLAG == undefined && $files[0].name.length < 200 || UPLOAD_OR_NOT_FLAG == 1 && $files[0].name.length < 200) {
                    $scope.uploadFiles(Attachment_UPLOAD_TYPE_ID, '', List, FOLDER_NAME, CONFIG_KEY_NAME, API_PATH, ALREADY_RELATIVE_ID, ControlName)
                }
                else {
                    if ($files[0].name.length > 200) {
                        if (Attachment_UPLOAD_TYPE_ID == 50 || Attachment_UPLOAD_TYPE_ID == 51) {
                            $scope.ShowAlertBox('Error', 'File name is too long,maximum limit of 200 characters', 5000);
                        }
                        else {

                            $scope.ShowAlert('Error', 'File name is too long,maximum limit of 200 characters', 5000);
                        }
                    }
                }
            }
        }
        else {
            if (MAX_ATTACHMENT_LENGTH == List.UploadedFiles.length) {
                if (Attachment_UPLOAD_TYPE_ID == 50) {
                    $scope.ShowAlertBox('Warning', "You cannot provide more than " + MAX_ATTACHMENT_LENGTH + " attachments in a request.", 3000)
                } else {
                    $scope.ShowAlert('Warning', "You cannot provide more than " + MAX_ATTACHMENT_LENGTH + " attachments in a request.", 3000)
                }
                angular.element("input[id='" + ControlName + "']").val(null);
            }
        }
    };
    $scope.getTheFilesImageUpload = function ($files, ControlName, FileSize, FILE_TYPE, EMP_PRS_ID, USER_PROFIILE_UPDATE_FLAG) {
        if (FileSize == undefined || FileSize == null || FileSize == 0 || FileSize == '') {
            FileSize = 5;
        }
        $scope.imagesrc = [];
        var valid = 0;
        for (var i = 0; i < $files.length; i++) {

            if ($scope.Attachment_UPLOAD_TYPE_ID == 12) {
                var validFormats = ['MPEG4', 'MP4', 'video/mp4'];
            }
            else {
                var validFormats = ['jpg', 'jpeg', 'png'];
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
                    angular.element("input[id='file-input']").val(null);
                    return;
                }
            }
            else {
                $scope.ShowAlert('Error', 'Not a valid file.', 5000);
                angular.element("input[id='file-input']").val(null);
                return;
            }
        }
        $scope.Files = $files;
        var fileUpload = document.getElementById('file-input');
        extension = fileUpload.files[0].name;
        USER_PROFIILE_UPDATE_FLAG = USER_PROFIILE_UPDATE_FLAG == undefined ? 0 : USER_PROFIILE_UPDATE_FLAG;
        $scope.uploadFiles_Imag(FILE_TYPE, '', extension, EMP_PRS_ID, USER_PROFIILE_UPDATE_FLAG);
    };
    $scope.uploadFilesAll = function (Attachment_UPLOAD_TYPE_ID, ATTACHEMENT_TYPE_ID, filename, List, index, LOGO_UPLOADED_BY) {
        var count = 0;
        if (($scope.Files != undefined && $scope.Files.length > 0)) {
            $scope.DocImageResult = [];
            var data = new FormData();
            data.append("RelativeID", 1);
            data.append("UPLOAD_TYPE_ID", 1);
            if (LOGO_UPLOADED_BY == 'CUSTOMER') {
                data.append("VIRTUALPATH", '/Customer/');
                data.append("FLAG", 0);
            }
            else if (LOGO_UPLOADED_BY == 'ENTITY') {
                data.append("VIRTUALPATH", '/Customer/Entity/');
                data.append("FLAG", 0);
            }
            else if (LOGO_UPLOADED_BY == 'BRANCH') {
                data.append("VIRTUALPATH", '/Customer/Entity/Branch/');
                data.append("FLAG", 0);
            }
            else if (LOGO_UPLOADED_BY == 'MICROS') {
                data.append("VIRTUALPATH", '/Micros/');
                data.append("FLAG", 1);
            }
            else if (LOGO_UPLOADED_BY == 'BUDGET') {
                data.append("FLAG", 0);
                data.append("VIRTUALPATH", parseInt($cookies.get("CUSTOMER_ID")) + '/' + parseInt($cookies.get("ENTITY_ID")) + '/Budget/');
            }
            else if (LOGO_UPLOADED_BY == 'CASH_COVERS') {
                data.append("FLAG", 1);
                data.append("VIRTUALPATH", parseInt($cookies.get("CUSTOMER_ID")) + '/' + parseInt($cookies.get("ENTITY_ID")) + '/CASH_COVERS/');
            }
            else if (LOGO_UPLOADED_BY == 'INV_RECON') {
                if (List.BRANCH_ID == null || List.BRANCH_ID == null) {
                    count = 6;
                }
                data.append("UPLOAD_TYPE_ID", Attachment_UPLOAD_TYPE_ID);
                data.append("FLAG", 1);
                data.append("VIRTUALPATH", parseInt($cookies.get("CUSTOMER_ID")) + '/' + parseInt($cookies.get("ENTITY_ID")) + '/INV_RECORD/');
            }
            else if (LOGO_UPLOADED_BY == 'PNL_DASHBOARD') {
                //if (List.BRANCH_ID == null || List.BRANCH_ID == null) {
                //    count = 6;
                //}
                data.append("UPLOAD_TYPE_ID", Attachment_UPLOAD_TYPE_ID);
                data.append("FLAG", 1);
                data.append("VIRTUALPATH", parseInt($cookies.get("CUSTOMER_ID")) + '/' + parseInt($cookies.get("ENTITY_ID")) + '/PNL_UPLOAD/');
            }
            else if (LOGO_UPLOADED_BY == 'CURRENCY_CONVERSION') {
                data.append("FLAG", 0);
                data.append("VIRTUALPATH", '/CURRENCY_CONVERSION/');
                //data.append("VIRTUALPATH", parseInt($cookies.get("CUSTOMER_ID")) + '/' + parseInt($cookies.get("ENTITY_ID")) + '/CURRENCY_CONVERSION/');
            }
            else if (LOGO_UPLOADED_BY == 'PURCHASE_REQUEST') {
                data.append("FLAG", 0);
                data.append("VIRTUALPATH", parseInt($cookies.get("CUSTOMER_ID")) + '/' + parseInt($cookies.get("ENTITY_ID")) + '/P2P/PURCHASE_REQUEST/' + parseInt($cookies.get("USERID")));
            }
            else if (LOGO_UPLOADED_BY == 'DEPOSIT') {

                data.append("FLAG", 1);
                data.append("VIRTUALPATH", parseInt($cookies.get("CUSTOMER_ID")) + '/' + parseInt($cookies.get("ENTITY_ID")) + '/DIPOSIT/');
            } else if (LOGO_UPLOADED_BY == 'VOUCHER') {

                data.append("FLAG", 1);
                data.append("VIRTUALPATH", parseInt($cookies.get("CUSTOMER_ID")) + '/' + parseInt($cookies.get("ENTITY_ID")) + '/VOUCHER/');
            }
            else if (LOGO_UPLOADED_BY == 'NEW_SUPPLIER') {
                data.append("FLAG", 0);
                data.append("VIRTUALPATH", parseInt($cookies.get("CUSTOMER_ID")) + '/' + parseInt($cookies.get("ENTITY_ID")) + '/P2P/NEW_SUPPLIER/' + parseInt($cookies.get("USERID")));
            }
            else if (LOGO_UPLOADED_BY == 'HR_Holiday') {
                data.append("FLAG", 1);
                data.append("VIRTUALPATH", 'CUSTOMER_' + parseInt($cookies.get("CUSTOMER_ID")) + '/' + 'ENTITY_' + parseInt($cookies.get("ENTITY_ID")) + '/USER_ID_' + parseInt($cookies.get("USERID"))) + '/';
            } else if (LOGO_UPLOADED_BY == 'FORECAST') {
                data.append("FLAG", 1);
                data.append("VIRTUALPATH", 'CUSTOMER_' + parseInt($cookies.get("CUSTOMER_ID")) + '/' + 'ENTITY_' + parseInt($cookies.get("ENTITY_ID")) + '/USER_ID_' + parseInt($cookies.get("USERID"))) + '/' + LOGO_UPLOADED_BY + "/UPLOAD_TYPE_ID_" + Attachment_UPLOAD_TYPE_ID + '/';
            }
            else {
                data.append("FLAG", 0);
                data.append("VIRTUALPATH", parseInt($cookies.get("ENTITY_ID")) + '/Employ/Course/' + Attachment_UPLOAD_TYPE_ID + '/');
            }
            data.append("UPLOAD_ID", 0);
            data.append("ORIGINAL_FILE_NAME", filename);
            data.append("USER_ID", $scope.IS_PLAIN ? 0 : parseInt($cookies.get("USERID")));
            if (count == 0) {
                for (var i in $scope.Files) {
                    data.append("uploadedFile", $scope.Files[i]);
                }
                var request = {
                    method: 'POST',
                    url: CommService.Get_CASHUP_API() + "api/CashupAPI/ONLY_FILES_UPLOAD",
                    data: data,
                    headers: {
                        'Content-Type': undefined
                    }
                };
                $http(request).then(function (d) {
                    if (List != undefined) {
                        var GETL = new Object();
                        GETL.FILE_PATH = d.data.FILE_PATH
                        GETL.SERVER_FILE_NAME = d.data.SERVER_FILE_NAME;
                        GETL.ORIGINAL_FILE_NAME = d.data.ORIGINAL_FILE_NAME;
                        if (List.UploadedFiles == undefined || List.UPL_FILE_FLAG == 1) {
                            List.UploadedFiles = [];
                        }
                        List.UploadedFiles.push(angular.copy(GETL));
                        if (LOGO_UPLOADED_BY == "INV_RECON") {
                            $scope.child_scope.EXCEL_INV_RECO_VALIDATE();
                        }
                        if (LOGO_UPLOADED_BY == "PNL_DASHBOARD") {
                            $scope.child_scope.EXCEL_PNL_VALIDATE();
                        }
                        if (LOGO_UPLOADED_BY == "HR_Holiday") {
                            $scope.child_scope.EXCEL_HOLIDAY_CALENDAR_VALIDATE();
                        }
                        if (LOGO_UPLOADED_BY == "FORECAST") {
                            $scope.child_scope.EXCEL_FORECAST_VALIDATE();
                        }
                    }
                });
            }
            if (count == 6) {
            }
        }
    };
    $scope.uploadFiles = function (Attachment_UPLOAD_TYPE_ID, ATTACHEMENT_TYPE_ID, List, FOLDER_NAME, CONFIG_KEY_NAME, API_PATH, ALREADY_RELATIVE_ID, ControlName) {
        if (($scope.Files != undefined && $scope.Files.length > 0)) {
            var PATH = parseInt($cookies.get("ENTITY_ID")) + '/' + Attachment_UPLOAD_TYPE_ID + '/';
            if (FOLDER_NAME == "PURCHASE_REQUEST" || FOLDER_NAME == "PO" || FOLDER_NAME == "REQUISITION" || FOLDER_NAME == "INVOICE"
                || FOLDER_NAME == "OTHER_BILL" || FOLDER_NAME == "PO_GRN" || FOLDER_NAME == "RECEIVING" || FOLDER_NAME == "QUOTATION" || FOLDER_NAME == "NEW_SUPPLIER") {
                var TEM_MODULE_ID = 22
                PATH = "/" + FOLDER_NAME + "/ENTITY_" + parseInt($cookies.get("ENTITY_ID")) + '/USER_' + parseInt($cookies.get("USERID")) + '/' + '/UPLOAD_TYPE_' + Attachment_UPLOAD_TYPE_ID + '/';
                RELATIVE_ID = List == undefined ? 7 : TEM_MODULE_ID + '' + $scope.RANDOM_NUMBER + '' + parseInt($cookies.get("ENTITY_ID")) + '' + parseInt($cookies.get("USERID") + '' + Attachment_UPLOAD_TYPE_ID + '' + new Date().getFullYear() + parseInt(new Date().getDate()) + new Date().getMonth() + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds() + new Date().getMilliseconds());
            }
            else if (Attachment_UPLOAD_TYPE_ID == 50) {
                var RELATIVE_ID = List == undefined ? 7 : new Date().getFullYear() + parseInt(new Date().getDate()) + new Date().getMonth() + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds() + new Date().getMilliseconds() + parseInt($cookies.get("EMPLOYEE_ID")) + '' + $scope.generaterandom(12) + '' + parseInt($cookies.get("USERID")) + '' + parseInt($cookies.get("ENTITY_ID"));
            }
            else {
                var RELATIVE_ID = List == undefined ? 7 : parseInt($cookies.get("EMPLOYEE_ID")) + '' + $scope.RANDOM_NUMBER + '' + parseInt($cookies.get("USERID")) + '' + parseInt($cookies.get("ENTITY_ID") + '' + Attachment_UPLOAD_TYPE_ID + '' + new Date().getFullYear() + parseInt(new Date().getDate()) + new Date().getMonth() + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds() + new Date().getMilliseconds());
            }
            $scope.DocImageResult = [];
            var data = new FormData();
            data.append("CASHUP_HEADER_ID", ALREADY_RELATIVE_ID == undefined ? RELATIVE_ID : ALREADY_RELATIVE_ID); /// Use for old
            data.append("RELATIVE_ID", ALREADY_RELATIVE_ID == undefined ? RELATIVE_ID : ALREADY_RELATIVE_ID);// use for new api
            data.append("ALREADY_RELATIVE_ID", ALREADY_RELATIVE_ID == undefined ? 0 : 1);// use for new api
            data.append("UPLOAD_TYPE_ID", Attachment_UPLOAD_TYPE_ID);
            data.append("VIRTUALPATH", PATH);
            data.append("UPLOAD_ID", 0);
            data.append("USER_ID", parseInt($cookies.get("USERID")));
            data.append("CONFIG_KEY_NAME", CONFIG_KEY_NAME);
            data.append("MOB_FLAG", "0");
            if (isNaN(parseInt($cookies.get("ENTITY_ID")))) { data.append("ENTITY_ID", 0); } else { data.append("ENTITY_ID", parseInt($cookies.get("ENTITY_ID"))); }
            for (var i in $scope.Files) { data.append("uploadedFile", $scope.Files[i]); }
            var _api_path = CommService.Get_CASHUP_API() + "api/CashupAPI/UPLOADFILES";
            if (API_PATH == 'P2P') {
                _api_path = CommService.GET_UTILITY_API() + "api/PO/UPLOAD_FILES";
            }
            var request = { method: 'POST', url: _api_path, data: data, headers: { 'Content-Type': undefined } };
            $http(request).then(function (d) {
                $scope.UploadedFiles = d.data;
                if (List != undefined) {
                    if (List.IS_MULTI_FILE_UPLOAD_ALLOW) {
                        if (List.UploadedFiles.length == 0) {
                        }
                    }
                    else {
                        List.UploadedFiles = [];
                    }
                    angular.forEach(d.data.Table1, function (val) {
                        let resultlength = List.UploadedFiles.filter(function (x) { return x.ID == val.ID });
                        if (val.ID > 0 && resultlength.length == 0) {
                            List.UploadedFiles.push(val);
                        }
                    })
                }
                angular.element("input[id='" + ControlName + "']").val(null);
            });
        }
    };
    $scope.uploadFiles_Imag = function (FILE_TYPE, ATTACHEMENT_TYPE_ID, filename, EMP_PRS_ID, USER_PROFIILE_UPDATE_FLAG) {
        if (($scope.Files != undefined && $scope.Files.length > 0)) {
            $scope.DocImageResult = [];
            var data = new FormData();
            data.append("RelativeID", 0);
            data.append("UPLOAD_TYPE_ID", 0);
            if (USER_PROFIILE_UPDATE_FLAG == 1) {
                data.append("VIRTUALPATH", parseInt($cookies.get("ENTITY_ID")) + '/User/' + parseInt($cookies.get("USERID")) + '/');
            }
            else {
                data.append("VIRTUALPATH", parseInt($cookies.get("ENTITY_ID")) + '/Employee/Profile/' + EMP_PRS_ID + '/');
            }
            data.append("UPLOAD_ID", 0);
            data.append("ORIGINAL_FILE_NAME", filename);
            data.append("USER_ID", parseInt($cookies.get("USERID")));
            data.append("EMP_PRS_ID", parseInt(EMP_PRS_ID));
            data.append("USER_PROFIILE_UPDATE_FLAG", parseInt(USER_PROFIILE_UPDATE_FLAG));
            for (var i in $scope.Files) {
                data.append("uploadedFile", $scope.Files[i]);
            }
            var request = {
                method: 'POST',
                url: CommService.Get_HR_API() + "api/HrAPI/PROFILE_IMAGE_UPLOAD",
                data: data,
                headers: {
                    'Content-Type': undefined
                }
            };
            $http(request).then(function (d) {
                FILE_TYPE.IMAGE_PATH = d.data.FILE_PATH + '' + d.data.SERVER_FILE_NAME;
                $scope.IMAGE_PATH = FILE_TYPE.IMAGE_PATH;
                $cookies.put('IMAGE_PATH', FILE_TYPE.IMAGE_PATH, { 'path': '/' });
            });
        }
    };
    $scope.ShowAlertBox = function (alertType, DisplayMessage, Fadeoutinmillisecs) {
        $scope.OPTION = {
            "closeButton": true,
            "debug": false,
            "newestOnTop": false,
            "progressBar": true,
            "positionClass": "toast-top-center",
            "preventDuplicates": false,
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }
        toastr.options = $scope.OPTION;
        if (alertType == 'Error') {
            toastr.error(DisplayMessage)
        }
        else if (alertType == 'Success') {
            toastr.success(DisplayMessage)
        }
        else if (alertType == 'info') {
            toastr.info(DisplayMessage)
        }
        else if (alertType == 'Warning') {
            toastr.warning(DisplayMessage)
        }
        else if (alertType == 'Attention') {
            toastr.warning(DisplayMessage)
        }
    }
    $scope.ShowAlert = function (alertType, DisplayMessage, Fadeoutinmillisecs) {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: Fadeoutinmillisecs,
            onOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        });
        DisplayMessage = alertType + '! ' + DisplayMessage;
        var x = $scope.msgdivcount++;
        if (alertType == 'Error') {
            //$("#toastsContainerTopRight").append('<div class="alert alert-danger rounded" role="alert" id=Error' + x + '><strong>Error!</strong> ' + DisplayMessage + '</div>');
            ////jQuery("#Error" + x).fadeOut(Fadeoutinmillisecs + 5000);
            //setTimeout(function () {
            //    jQuery("#Error" + x).remove();
            //}, Fadeoutinmillisecs);
            Toast.fire({
                icon: 'error',
                title: DisplayMessage
            })
        }

        //if (alertType == 'Success') {
        //    $("#toastsContainerTopRight").append('<div class="alert alert-success rounded" role="alert" id=Success' + x + '><strong>Well done!</strong> ' + DisplayMessage + '</div>');
        //    //jQuery("#Error" + x).fadeOut(Fadeoutinmillisecs + 5000);
        //    setTimeout(function () {
        //        jQuery("#Success" + x).remove();
        //    }, Fadeoutinmillisecs);

        //}


        if (alertType == 'Success') {
            // $("#toastsContainerTopRight").append('<div class="alert alert-success rounded animated rubberBand infinite link-internal" role="alert" id=Success' + x + '><i class="far fa-check-circle animate__animated animate__bounce"></i> <strong>Well done!</strong> ' + DisplayMessage + '</div>');
            //jQuery("#Error" + x).fadeOut(Fadeoutinmillisecs + 5000);
            //setTimeout(function () {
            //    jQuery("#Success" + x).remove();
            //}, Fadeoutinmillisecs);
            Toast.fire({
                icon: 'success',
                title: DisplayMessage
            })
        }

        if (alertType == 'Warning') {
            //$("#toastsContainerTopRight").append('<div class="alert alert-warning rounded" role="alert" id=Warning' + x + '><strong>Warning!</strong> ' + DisplayMessage + '</div>');
            ////jQuery("#Error" + x).fadeOut(Fadeoutinmillisecs + 5000);
            //setTimeout(function () {
            //    jQuery("#Warning" + x).remove();
            //}, Fadeoutinmillisecs);

            Toast.fire({
                icon: 'warning',
                title: DisplayMessage
            })

        }
        //if (alertType == 'Attention') {
        //    $("#alertMessageDiv").append('<div class="alert alert-success rounded" role="alert" id=Attention' + x + '><strong>Heads Up!</strong> ' + DisplayMessage + '</div>');
        //    //jQuery("#Error" + x).fadeOut(Fadeoutinmillisecs + 5000);
        //    setTimeout(function () {
        //        jQuery("#Attention" + x).remove();
        //    }, Fadeoutinmillisecs);
        //}

        if (alertType == 'Attention') {
            Toast.fire({
                icon: 'info',
                title: DisplayMessage
            })
        }
    }
    $scope.VIEW_TAB_CLICK = function (FLAG) {
        $scope.STEP_FLAG = FLAG;
        if (FLAG == 1) {
            $location.path('EditProfile');
        }
        else if (FLAG == 2) {
            $location.path('ViewContact');
        }
        else if (FLAG == 3) {
            $location.path('ViewEmpemplment');
        }
        else if (FLAG == 4) {
            $location.path('ViewQualifi');
        }
        else if (FLAG == 5) {
            $location.path('ViewEmpComp');
        }
        else if (FLAG == 6) {
            $location.path('ViewEmpLev');
        }
        else if (FLAG == 7) {
            $location.path('ViewEmpDoc');
        }
        else if (FLAG == 8) {
            $location.path('ViewPosition');
        }
        else if (FLAG == 9) {
            $location.path('ViewOther');
        }
        else if (FLAG == 9) {
            $location.path('ViewOther');
        }
        else if (FLAG == 10) {
            $location.path('team');
        }
        else if (FLAG == 11) {
            $location.path('History');
        }
        else if (FLAG == 12) {
            $location.path('HR_Note');
        }
        else if (FLAG == 13) {
            $location.path('ViewPersonalNew');
        }
        else if (FLAG == 14) {
            $location.path('ViewContactNew');
        }
        else if (FLAG == 15) {
            $location.path('ViewEmpemplmentNew');
        }
        else if (FLAG == 16) {
            $location.path('ViewQualifiNew');
        }
        else if (FLAG == 17) {
            $location.path('ViewEmpCompNew');
        }
        else if (FLAG == 18) {
            $location.path('ViewLeaveNew');
        }
        else if (FLAG == 19) {
            $location.path('ViewEmpDocNew');
        }
        else if (FLAG == 20) {
            $location.path('ViewOtherNew');
        }
        else if (FLAG == 21) {
            $location.path('HistoryNew');
        }
        else {
            $scope.GET_VIEW_EMPLOYEE_PROFILE();
        }
    }
    $scope.DELETE_UPLOAD_ALL = function (Array, item, index, FLAG) {
        if (confirm('Are you sure you want to delete the file?')) {
            var CashupModelObj = new Object();
            CashupModelObj.ID = item.UPLOAD_ID;
            PrcCommMethods.CASHUP_API(CashupModelObj, 'DELETE_UPLOAD').then(function (data) {
                $scope.ShowAlert('Success', 'Deleted Successfully', 5000);
                if (FLAG == 1) {
                    Array.splice(index, 1);
                }
                else {
                    Array.UploadedFiles.splice(index, 1);
                }

            });
        }
    };
    $scope.GO_TAB_CLICK = function (FLAG) {
        if (FLAG == 1) {
            $location.path('Addemployee')
        }
        else if (FLAG == 2) {
            $location.path('EmpContact')
        }
        else if (FLAG == 3) {
            $location.path('Empemplment')
        }
        else if (FLAG == 4) {
            $location.path('EmpQualifi')
        }
        else if (FLAG == 5) {
            $location.path('EmpComp')
        }
        else if (FLAG == 6) {
            $location.path('EmpLev')
        }
    }
    $scope.CalculetteService = function (data) {
        $scope.EmployeeServices = '';
        var START_DATE = new Date(data.START_DATE);
        var getMonth = new Date(data.START_DATE).getMonth();
        var utc = new Date(data.utcDate);
        var dif = Math.abs(utc.getTime() - START_DATE.getTime());

        var starts = moment(data.START_DATE);
        var ends = moment(data.utcDate);
        var duration = moment.duration(ends.diff(starts));
        // example: { "years": 2, "months": 7, "days": 0, "hours": 6, "minutes": 29, "seconds": 17, "firstDateWasLater":  false }
        if (duration._data != null) {
            $scope.ALL_CONVERTION = [];
            $scope.ALL_CONVERTION.push(duration._data);
            if ($scope.ALL_CONVERTION.length > 0) {
                $scope.Employeesince = 'Employee since';
                //days: 29
                //hours: 10
                //milliseconds: 930
                //minutes: 1
                //months: 0
                //seconds: 5
                //years: 0
                if ($scope.ALL_CONVERTION[0].hours < 0) {
                    $scope.Employeesince = 'Joining Date';
                }
                else if ($scope.ALL_CONVERTION[0].days == 0 && $scope.ALL_CONVERTION[0].months == 0 && $scope.ALL_CONVERTION[0].years == 0 && $scope.ALL_CONVERTION[0].hours > 0) {
                    $scope.EmployeeServices = '(' + $scope.ALL_CONVERTION[0].hours + ' hours ' + ' in service)';
                }
                else if ($scope.ALL_CONVERTION[0].days > 0 && $scope.ALL_CONVERTION[0].months == 0 && $scope.ALL_CONVERTION[0].years == 0) {
                    var SS = 's';
                    if ($scope.ALL_CONVERTION[0].days == 1) { SS = "" }

                    $scope.EmployeeServices = '(' + $scope.ALL_CONVERTION[0].days + ' day' + SS + ' in service)';
                }
                else if ($scope.ALL_CONVERTION[0].months > 0 && $scope.ALL_CONVERTION[0].days == 0 && $scope.ALL_CONVERTION[0].hours > 0 && $scope.ALL_CONVERTION[0].years == 0) {
                    var SS = 's';
                    if ($scope.ALL_CONVERTION[0].months == 1) { SS = "" }
                    $scope.EmployeeServices = '(' + $scope.ALL_CONVERTION[0].months + ' Month' + SS + ' ' + $scope.ALL_CONVERTION[0].hours + ' hours ' + ' in service)';
                } else if ($scope.ALL_CONVERTION[0].years == 0) {
                    var DSS = 's';
                    var MSS = 's';
                    if ($scope.ALL_CONVERTION[0].days == 1) { DSS = "" }
                    if ($scope.ALL_CONVERTION[0].months == 1) { MSS = "" }
                    $scope.EmployeeServices = '(' + $scope.ALL_CONVERTION[0].months + ' Month' + MSS + ' ' + $scope.ALL_CONVERTION[0].days + ' day' + DSS + ' in service)';
                } else if ($scope.ALL_CONVERTION[0].years > 0 && $scope.ALL_CONVERTION[0].days == 0 && $scope.ALL_CONVERTION[0].hours > 0) {
                    var SS = 's';
                    var hSS = 's';
                    if ($scope.ALL_CONVERTION[0].hours == 1) { SS = "" }
                    if ($scope.ALL_CONVERTION[0].years == 1) { hSS = "" };

                    $scope.EmployeeServices = '(' + $scope.ALL_CONVERTION[0].years + ' Year' + hSS + ' ' + $scope.ALL_CONVERTION[0].hours + ' hour' + hSS + '  in service)';
                } else {
                    var SS = 's';
                    var hSS = 's';
                    var dSS = 's';
                    var MSS = 's';
                    if ($scope.ALL_CONVERTION[0].months == 1) { MSS = "" }
                    if ($scope.ALL_CONVERTION[0].hours == 1) { dSS = "" };
                    if ($scope.ALL_CONVERTION[0].years == 1) { SS = "" };
                    if ($scope.ALL_CONVERTION[0].hours == 1) { hSS = "" };
                    $scope.EmployeeServices = '(' + $scope.ALL_CONVERTION[0].years + ' Year' + SS + ' ' + $scope.ALL_CONVERTION[0].months + ' Month' + MSS + ' ' + $scope.ALL_CONVERTION[0].days + ' day' + dSS + ' in service)';
                };

                //if ($scope.ALL_CONVERTION[0].Hour > 0 && $scope.ALL_CONVERTION[0].Hour < 24) {
                //    $scope.EmployeeServices = '(' + $scope.ALL_CONVERTION[0].Hour + ' Hours in service)';
                //};
                //if ($scope.ALL_CONVERTION[0].days > 0 && $scope.ALL_CONVERTION[0].Hour > 24) {
                //    $scope.EmployeeServices = '(' + $scope.ALL_CONVERTION[0].Day + ' Day in service)';
                //};
                //if ($scope.ALL_CONVERTION[0].Week > 0 && $scope.ALL_CONVERTION[0].Hour > (24 * 7)) {
                //    $scope.EmployeeServices = '(' + $scope.ALL_CONVERTION[0].Week + ' Week in service)';
                //};
                //var Month = 0;
                //if ($scope.ALL_CONVERTION[0].Month > 0) {
                //    Month = parseInt(($scope.ALL_CONVERTION[0].Day / 30.41));
                //    $scope.EmployeeServices = '(' + Month + ' Month in service)';
                //};
                //if ($scope.ALL_CONVERTION[0].Year > 0 && Month == 12) {
                //    $scope.EmployeeServices = '(' + $scope.ALL_CONVERTION[0].Year + ' Year in service)';
                //};
                //if ($scope.ALL_CONVERTION[0].Year > 0 && Month > 12) {
                //    $scope.EmployeeServices = '(' + parseInt(Month / 12) + ' Year ' + (parseInt(Month) - (parseInt(Month / 12)) * 12) + ' Month in service)';
                //};
            }
        }
        else {
            $scope.Employeesince = 'Joining Date';
        }
        $('body').css('padding-right', '-0');
    }
    $scope.EFFECTIVE_RESET_LOAD = function () {
        $scope.EFFECTIVE_LINE = {
        }
        $scope.ViewEffEmpSearch_1 = {};
        $scope.ViewEmpSearch_UPD_6 = {};
        $scope.ViewEffEmpSearch_1.ABSENCE_TYPE_EMP_UPD = [];
        $scope.ViewEffEmpSearch_1.ADDITIONAL_PAY_LIST = [];
        $scope.ViewEffEmpSearch_1.ADDITIONAL_PAY_LIST_COPY = [];
    }
    $scope.HR_GET_PENDING_UPDATES_DATA = function (EFF) {
        $scope.overlay_loadingNew = 'block'
        var PosiModelObj = new Object();
        PosiModelObj.APP_PAGE_ID = EFF.APP_PAGE_ID;
        PosiModelObj.TABLE_ID = EFF.TABLE_ID;
        PosiModelObj.LOGIN_USER_EMP_ID = parseInt($cookies.get("EMPLOYEE_ID"));
        PosiModelObj.LOGIN_USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.HR_API(PosiModelObj, 'HR_GET_PENDING_UPDATES_DATA').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.ViewEffEmpSearch_1 = {};
                $scope.ViewEmpSearch_UPD_6 = {};
                $scope.ViewEffEmpSearch_1.ABSENCE_TYPE_EMP_UPD = [];
                $scope.ViewEffEmpSearch_1.ADDITIONAL_PAY_LIST = [];
                $scope.ViewEffEmpSearch_1.ADDITIONAL_PAY_LIST_COPY = [];
                if (EFF.APP_PAGE_ID == 10) {
                    $scope.ViewEffEmpSearch_1 = data.data.Table[0];
                    $scope.ViewEffEmpSearch_1.APP_PAGE_ID = EFF.APP_PAGE_ID;
                    $scope.ViewEffEmpSearch_1.ABSENCE_TYPE_EMP_UPD = data.data.Table;
                    $scope.ViewEffEmpSearch_1.COLMD = 'col-md-4';
                }
                else {
                    $scope.ViewEffEmpSearch_1 = data.data.Table[0];
                    $scope.ViewEffEmpSearch_1.APP_PAGE_ID = EFF.APP_PAGE_ID;
                    $scope.ViewEffEmpSearch_1.COLMD = 'col-md-4';
                    if (EFF.APP_PAGE_ID == 9) {
                        $scope.ViewEffEmpSearch_1.ADDITIONAL_PAY_LIST = data.data.Table1;
                        $scope.ViewEffEmpSearch_1.ADDITIONAL_PAY_LIST_COPY = angular.copy(data.data.Table1);
                    }
                    else if (EFF.APP_PAGE_ID == 11) {
                        $scope.ViewEffEmpSearch_1.WORK_PERMIT_UPD = [];
                        $scope.ViewEffEmpSearch_1.WORK_PERMIT_UPD = data.data.Table1;
                        $scope.ViewEffEmpSearch_1.APP_PAGE_ID = EFF.APP_PAGE_ID;
                        $scope.ViewEffEmpSearch_1.WORK_PERMIT_UPD_COPY = angular.copy(data.data.Table1);
                    }
                    else if (EFF.APP_PAGE_ID == 7) {
                        $scope.ViewEffEmpSearch_1.Table1 = data.data.Table1;
                        $scope.ViewEffEmpSearch_1.APP_PAGE_ID = EFF.APP_PAGE_ID;
                    }
                    $scope.GET_CUSTOM_LABEL_APP_FIELD_MAPPING(EFF.APP_PAGE_ID, data.data.Table[0]);
                }
                $scope.overlay_loadingNew = 'none'
            }
        });
    };
    $scope.POP_UPD_EFFECTIVE_CHANGES = function (LINE, STEP_NO) {
        $('#EFFECTIVE_DATA_VIEW').modal('show');
        $scope.EFFECTIVE_LINE = LINE;
        $scope.HR_GET_PENDING_UPDATES_DATA(LINE);
    }
    $scope.POP_DISCARD_CHANGES = function (LINE, FLAG_NO, UPDATE_TYPE_ID) {
        $('#DISCARD').modal('show');
        $scope.EFFECTIVE_LINE = LINE;
        $scope.EFFECTIVE_LINE.FLAG_NO = FLAG_NO;
        $scope.EFFECTIVE_LINE.UPDATE_TYPE_ID = UPDATE_TYPE_ID;
        if (FLAG_NO == 1) {
            $scope.EFFECTIVE_LINE.DISPLAY_TEXT = 'Discard'
        }
        if (FLAG_NO == 2) {
            $scope.EFFECTIVE_LINE.DISPLAY_TEXT = 'Process'
        }
    }

    $scope.SAVE_UPCOMING_UPDATES = function (LINE, FLAG_NO, UPDATE_TYPE_ID) {
        if ($scope.EFFECTIVE_LINE.DISCARD_COMMENTS != undefined && $scope.EFFECTIVE_LINE.DISCARD_COMMENTS != '' && $scope.EFFECTIVE_LINE.DISCARD_COMMENTS != null) {
            if (FLAG_NO == 1) {
                $scope.HR_DISCARD_PENDING_UPDATES(LINE);
            }
            if (FLAG_NO == 2) {
                $scope.HR_PROCESS_PENDING_UPDATES();
            }
        }
        else {
            $scope.ShowAlert('Error', 'please provide comments', 30000);
            $('#DISCARD').modal('show');
        }
    }

    $scope.HR_DISCARD_PENDING_UPDATES = function (LINE) {
        $scope.overlay_loadingNew = 'block'
        var PosiModelObj = new Object();
        PosiModelObj.UPDATE_TYPE_ID = $scope.EFFECTIVE_LINE.UPDATE_TYPE_ID;
        PosiModelObj.UPDATE_TABLE_ID = $scope.EFFECTIVE_LINE.TABLE_ID;
        PosiModelObj.APP_PAGE_ID = $scope.EFFECTIVE_LINE.APP_PAGE_ID;
        PosiModelObj.DISCARD_COMMENTS = $scope.EFFECTIVE_LINE.DISCARD_COMMENTS;
        PrcCommMethods.HR_API(PosiModelObj, 'HR_DISCARD_PENDING_UPDATES').then(function (data) {
            if (data.data == 1) {
                $scope.child_scope.EFFECTIVE_DATA_LIST.splice(LINE.index, 1);
                $scope.ShowAlert('Success', 'Discard Successfully', 3000);
                $('#DISCARD').modal('hide');
                if ($scope.EFFECTIVE_LINE.APP_PAGE_ID == undefined) {
                    $scope.child_scope.GET_EMPLOYEE_PROFILE_HEADER();
                }
            }
            else {
                $scope.ShowAlert('Error', $scope.SOMETHINGWENTWRONG, 3000);
            }
            $scope.overlay_loadingNew = 'none'
        });
    }
    $scope.HR_PROCESS_PENDING_UPDATES = function (EFF) {
        $scope.overlay_loadingNew = 'block'
        var PosiModelObj = new Object();
        PosiModelObj.UPDATE_TYPE_ID = $scope.EFFECTIVE_LINE.UPDATE_TYPE_ID;
        PosiModelObj.UPDATE_TABLE_ID = $scope.EFFECTIVE_LINE.TABLE_ID;
        PosiModelObj.APP_PAGE_ID = $scope.EFFECTIVE_LINE.APP_PAGE_ID;
        PosiModelObj.DISCARD_COMMENTS = $scope.EFFECTIVE_LINE.DISCARD_COMMENTS;
        PrcCommMethods.HR_API(PosiModelObj, 'HR_PROCESS_PENDING_UPDATES').then(function (data) {
            if (data.data == 1) {

                $scope.ShowAlert('Success', 'Process Successfully', 3000);
                $('#DISCARD').modal('hide');
                $scope.child_scope.HR_GET_EMPLOYEE();
                if ($scope.EFFECTIVE_LINE.APP_PAGE_ID == undefined) {
                    $scope.child_scope.GET_EMPLOYEE_PROFILE_HEADER();
                }
                $scope.overlay_loadingNew = 'none'

            }
            else {
                $scope.ShowAlert('Error', $scope.SOMETHINGWENTWRONG, 3000);
                $scope.overlay_loadingNew = 'none'
            }

        });

    }

    $scope.HistoryBack = function () {
        window.history.back();
    }

    $scope.openNav1 = function () {
        document.getElementById("Myfilters").style.zIndex = "1037";
        document.getElementById("Myfilters").style.width = "20%";
    }
    $scope.closeNav1 = function () {
        document.getElementById("Myfilters").style.zIndex = "-1";
        document.getElementById("Myfilters").style.width = "0%";

    }

    $scope.openNav2 = function () {
        document.getElementById("mySidenav2").style.width = "20%";
        document.getElementById("mySidenav2").style.zIndex = "1500";
    }
    $scope.closeNav2 = function () {
        document.getElementById("mySidenav2").style.width = "0";
        document.getElementById("mySidenav2").style.zIndex = "1500";
    }

    $scope.openNav3 = function () {
        document.getElementById("mySidenav3").style.width = "20%";
        document.getElementById("mySidenav3").style.zIndex = "1500";

    }
    $scope.closeNav3 = function () {
        document.getElementById("mySidenav3").style.width = "0";
        document.getElementById("mySidenav3").style.zIndex = "1500";
    }

    $scope.openNav4 = function () {
        document.getElementById("mySidenav4").style.width = "30%";
        document.getElementById("mySidenav4").style.zIndex = "1500";

    }
    $scope.closeNav4 = function () {
        document.getElementById("mySidenav4").style.width = "0";
        document.getElementById("mySidenav4").style.zIndex = "1500";
    }

    $scope.FILTER_SWTICH = function () {
        !$scope.FILTER_SWTICH_ON_OFF ? $scope.FILTER_SWTICH_ON_OFF = true : $scope.FILTER_SWTICH_ON_OFF = false;
    }
    $scope.FILTER_SWTICH_2 = function () {
        !$scope.FILTER_SWTICH_ON_OFF_2 ? $scope.FILTER_SWTICH_ON_OFF_2 = true : $scope.FILTER_SWTICH_ON_OFF_2 = false;
    }

    $scope.VIEW_INVOICE_DETAIL = function (INV, FLAG, SHOW_POP) {
        //        $scope.DOWNLOAD_INVOICE_ATTACHMENT(INV)
        $scope.GET_XERO_INVOICES_DETAILS(INV, FLAG, SHOW_POP);
    }
    $scope.Fetch_Xero_Invoice_Documents = function () {
        //var xero_url_parameters = $scope.INVOICES_RESULT.URL_PARAMETERS.split(':;:');

        ////xero_url_parameters[1];
        ////$scope.INVOICES_RESULT.URL_PATH

        //$http({
        //    method: 'GET', url: 'https://api.xero.com/api.xro/2.0/Invoices/' + $scope.INVOICES_RESULT.INVOICEID + '/Attachments', headers: {
        //        'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjFDQUY4RTY2NzcyRDZEQzAyOEQ2NzI2RkQwMjYxNTgxNTcwRUZDMTkiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJISy1PWm5jdGJjQW8xbkp2MENZVmdWY09fQmsifQ.eyJuYmYiOjE2Njc4MjgxODMsImV4cCI6MTY2NzgyOTk4MywiaXNzIjoiaHR0cHM6Ly9pZGVudGl0eS54ZXJvLmNvbSIsImF1ZCI6Imh0dHBzOi8vaWRlbnRpdHkueGVyby5jb20vcmVzb3VyY2VzIiwiY2xpZW50X2lkIjoiNDVENTBGREQ0Q0YzNDhEQTgwODMyQUJEODgzNkFCNjIiLCJzdWIiOiJhMmRmZjhkZjU3NWU1ZGNiOTdlOWMyMDNjMjU5YTFjNSIsImF1dGhfdGltZSI6MTY2NzM3ODk0MiwieGVyb191c2VyaWQiOiIyODM4NjU4Ni03YTBkLTQ4YjYtYTFhZi1jMDk4NjhlYmU2YjIiLCJnbG9iYWxfc2Vzc2lvbl9pZCI6IjA2ZTMwZjgxZGYxMDRkYTM4ZDBkYjQ0OGU5MmRlNjhlIiwianRpIjoiNDgwQTAzNDQxRTZEM0RFMEEyNUJFMEIxREU0RjYxQTMiLCJhdXRoZW50aWNhdGlvbl9ldmVudF9pZCI6ImMwNjZkMTAyLWIxZjItNGJhNy1iOWU5LWUyMTdiZTJhNGFjNCIsInNjb3BlIjpbImVtYWlsIiwicHJvZmlsZSIsIm9wZW5pZCIsImFjY291bnRpbmcuc2V0dGluZ3MiLCJhY2NvdW50aW5nLmF0dGFjaG1lbnRzIiwiYWNjb3VudGluZy50cmFuc2FjdGlvbnMiLCJhY2NvdW50aW5nLmpvdXJuYWxzLnJlYWQiLCJhY2NvdW50aW5nLmNvbnRhY3RzIiwib2ZmbGluZV9hY2Nlc3MiXSwiYW1yIjpbInB3ZCJdfQ.eXHfB5yQwoHxJEXyZsqWTEHB2dVTq1Gid_mSVf4sd1brxFI7ypRaxDxwXiWivR5aM-9F-BIVu0FdzbNHmdhRFgSD7jaMH-la-XH58g353ZfdW8fze-JYElv2oizGSSJYxkct8mV5Bagg3ZR6ThPu73qSPFRdKkbSStVMrEICzr-qZRhUMCMJHqs5tvQK9J0Yhmm0pOUCJ3WSYBb6tCJ4jivdSKYCQi1tGA094ZqPNvwo6kQQ8PdspaveRgiS5rqhs0U8LiJIBA_ShQ9oXDdQuX5oYMh01neDBpi_AP0XzvVH7jgMPBhnL9djIxQIa2A5Lk_uS-bt910TcqD1Iniomg',
        //        //'Authorization': 'Bearer'+$scope.INVOICES_RESULT.API_KEY,
        //        'Xero-Tenant-Id': xero_url_parameters[0],
        //        'Accept': 'application/json',
        //        'content-type':'application/x-www-form-urlencoded'
        //    }
        //}, function (response) {
        //    $scope.data = response.data;
        //    $scope.status = response.status;
        //}).then(function (data) {
        //    alert(1);
        //}).error(function (data) {
        //    alert(2);
        //});
    }
    $scope.GET_XERO_INVOICES_DETAILS = function (INV, FLAG, SHOW_POP) {
        if (SHOW_POP == undefined) {
            $scope.overlay_loadingNew = 'block';
        }
        var PaymentModelObj = new Object();
        if (FLAG == 2) {// For Reconcile page Name Inv_Upload_File Step no 3
            PaymentModelObj.INVOICE_ID = INV.XERO_INVOICE_ID;
        }
        else {
            PaymentModelObj.INVOICE_ID = FLAG == 1 ? INV.ID : INV.INVOICE_ID;
        }
        PrcCommMethods.PAYMENT_API(PaymentModelObj, 'GET_XERO_INVOICES_DETAILS').then(function (data) {
            if (data.data != undefined && data.data.Table.length > 0) {
                $scope.INVOICES_RESULT = data.data.Table[0];
                $scope.XERO_INVOICES_LINE_ITEMS = data.data.Table1;
                if (SHOW_POP == undefined) {
                    $("#View_Invoice").modal('show');
                }
                $scope.overlay_loadingNew = 'none';
                PaymentModelObj.INVOICE_NO = $scope.INVOICES_RESULT.INVOICEID;
                PaymentModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
                PaymentModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
                PaymentModelObj.BRANCH_ID = $scope.INVOICES_RESULT.BRANCH_ID;//parseInt($cookies.get("ENTITY_ID"));
                PaymentModelObj.URL_PARAMETERS = $scope.INVOICES_RESULT.URL_PARAMETERS;
                PrcCommMethods.PAYMENT_API(PaymentModelObj, 'GetInvoiceAttachmentsfromXero').then(function (data) {
                    $scope.INVOICES_RESULT.ATTACHMENTS = [];
                    INV.ATTACHMENTS = [];
                    if (data.data != undefined && data.data.length > 0) {
                        $scope.INVOICES_RESULT.ATTACHMENTS = data.data;
                        INV.ATTACHMENTS = data.data;
                    }
                });
            }
        });
    }
    $scope.DOWNLOAD_INVOICE_ATTACHMENT = function (Attachment) {
        var url = CommService.GET_INVOICE_API() + 'api/PaymentAPI/DOWNLOAD_INVOICE_ATTACHMENT?ATTACHMENT_URL=' + Attachment.Url +
            '&URL_PARAMETERS=' + $scope.INVOICES_RESULT.URL_PARAMETERS + '&FILE_NAME=' + Attachment.FileName
            + '&CUSTOMER_ID=' + parseInt($cookies.get("CUSTOMER_ID")) + '&ENTITY_ID=' + parseInt($cookies.get("ENTITY_ID")) + '&BRANCH_ID=' + parseInt($scope.INVOICES_RESULT.BRANCH_ID == null ? 0 : $scope.INVOICES_RESULT.BRANCH_ID);
        var httprequest = $http({
            method: 'GET',
            url: url,
        }).then(function (data) {
            window.open(url);

        });
    }
    $scope.COMMON_CODE_CHANGE = function () {
        $(".tooltip").remove();
        $scope.SELECTED_TAB_NAME = window.location.hash.substr(3);
        $('[data-toggle="tooltip"]').tooltip();
        $('[data-toggle="popover"]').popover();


        $("body").removeClass("modal-open")
        $("body").removeClass("modal-backdrop show")

    }

    //////////////////////////////Leave Apply Code/////////////////////////////////////////
    $scope.LeaveSearch = {
        ABSENCE_TYPE_ID: null,
        HOURS: '',
        DAYS: '',
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        COMMENT: '',
        SORT_BY: '',
        DEPARTMENT_IDS: '',
        POSITION_IDS: '',
        REPORTING_MANAGER_ID: '',
        START_DATE: '',
        END_DATE: '',
        START_TIME_VALID: false,
        END_TIME_VALID: false
    };
    $scope.RESET_VIEW_LEAVE = function () {
        $scope.LeaveSearch.ABSENCE_TYPE_ID = null,
            $scope.LeaveSearch.HOURS = '',
            $scope.LeaveSearch.DAYS = '',
            $scope.LeaveSearch.PAGE_NO = 1,
            $scope.LeaveSearch.PAGE_SIZE = 10,
            $scope.LeaveSearch.COMMENTS = '',
            $scope.CustomForm.submitted = false;
        $scope.LeaveSearch.CAL_DAY_OR_HOURES = '';
        $scope.DATE_SELECTE_FLAG = 0;
        $scope.START_DATE_REQUIRED_VALID = true;
        $scope.END_DATE_REQUIRED_VALID = true;
        $scope.REMAINING_DAYS = {
        };
        $scope.START_DATE_VALID = true;
        $scope.END_DATE_VALID = true;
        $scope.GET_ABSENCE_TYPE();
    }
    $scope.RESET_MASTER_LEAVE = function () {
        $scope.LeaveSearch = {
            ABSENCE_TYPE_ID: null,
            HOURS: '',
            DAYS: '',
            PAGE_NO: 1,
            PAGE_SIZE: 10,
            COMMENT: '',
            COMMENTS: '',
            START_DATE: '',
            END_DATE: '',
            START_TIME: '',
            END_TIME: '',
        };
        $scope.DATE_SELECTE_FLAG = 0;
        $scope.CustomForm.submitted = false;
        $scope.START_DATE_REQUIRED_VALID = true;
        $scope.END_DATE_REQUIRED_VALID = true;
        $scope.REMAINING_DAYS = {};
        $scope.LeaveSearch.CAL_DAY_OR_HOURES = '';
        $scope.START_DATE_VALID = true;
        $scope.END_DATE_VALID = true;
        $scope.LEAVE_SAME_EMP_CHK();
        $scope.GET_ABSENCE_TYPE();
        angular.element("input[id='certificate']").val(null);

    };
    $scope.START_DATE_REQUIRED_VALID = true;
    $scope.END_DATE_REQUIRED_VALID = true;
    $scope.START_DATE_VALID = true;
    $scope.END_DATE_VALID = true;
    $scope.ABSENCE_TYPE = [];

    function changeLeaveTimezone(date, timezone) {
        var dateno = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        var monthno = date.getMonth() + 1;
        monthno = monthno < 10 ? "0" + monthno : monthno;
        var hrsno = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        var minno = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        var a = moment.tz(date.getFullYear() + "-" + monthno + "-" + dateno + "T" + hrsno + ":" + minno, timezone);
        $scope.CURRENT_DATE = '';
        var CURRENT_DATE = moment().utcOffset(0, true).format(date.getFullYear() + "-" + monthno + "-" + dateno + "T" + hrsno + ":" + minno);
        $scope.CURRENT_DATE = angular.copy(CURRENT_DATE);
        // 
        return a.format();
    };
    $scope.SetCompleteDate = function (Time, HalfDate, dateType) {
        if (Time == undefined) {
            if ($scope.REMAINING_DAYS.END_DATE != null) {
                if (new Date($scope.REMAINING_DAYS.END_DATE) < new Date($scope.LeaveSearch.START_DATE)) {
                    $scope.ShowAlert('Error', 'you do not have entitlement for the selected period', 3000);
                    $scope.LeaveSearch.START_DATE = ''
                    $scope.LeaveSearch.END_DATE = ''
                    $scope.LeaveSearch.DAYS = '';
                }
                if (new Date($scope.REMAINING_DAYS.END_DATE) < new Date($scope.LeaveSearch.END_DATE)) {
                    $scope.ShowAlert('Error', 'Leave end date should less than leave entitlement end date', 3000);
                    $scope.LeaveSearch.END_DATE = ''
                    $scope.LeaveSearch.DAYS = '';
                }
            }
            if (new Date($scope.LeaveSearch.END_DATE) < new Date($scope.LeaveSearch.START_DATE)) {
                $scope.ShowAlert('Error', 'end date should not be less than start date', 3000);
                $scope.LeaveSearch.END_DATE = ''
                $scope.LeaveSearch.DAYS = '';
            }
            else if (dateType == 1 || dateType == 3) {
                if (dateType == 1) {
                    $scope.LeaveSearch.END_DATE = $scope.LeaveSearch.START_DATE
                }
                if (dateType == 3) {
                    $scope.LeaveSearch.END_TIME = null;
                    $scope.LeaveSearch.HOURS = '';
                }
                var END_DATE = new Date($scope.LeaveSearch.END_DATE).setHours(parseInt(24), parseInt(0), 0, 0);
                var DateList = PrcCommMethods.getDifferenceInDays(new Date(END_DATE), new Date($scope.LeaveSearch.START_DATE));
                if (DateList > 0) {
                    $scope.LeaveSearch.DAYS = DateList;
                }
            }
            else if (dateType == 2 || dateType == 4) {
                var END_DATE = new Date($scope.LeaveSearch.END_DATE).setHours(parseInt(24), parseInt(0), 0, 0);
                var DateList = PrcCommMethods.getDifferenceInDays(new Date(END_DATE), new Date($scope.LeaveSearch.START_DATE));
                if (DateList > 0) {
                    $scope.LeaveSearch.DAYS = DateList;
                }
            }
        }
        if (Time != undefined) {
            if ($scope.REMAINING_DAYS.END_DATE != null) {
                if (new Date($scope.REMAINING_DAYS.END_DATE) < new Date($scope.LeaveSearch.START_DATE)) {
                    $scope.ShowAlert('Error', 'you do not have entitlement for the selected period', 3000);
                    $scope.LeaveSearch.START_DATE = ''
                    $scope.LeaveSearch.END_DATE = ''
                    $scope.LeaveSearch.DAYS = '';
                }
                if (new Date($scope.REMAINING_DAYS.END_DATE) < new Date($scope.LeaveSearch.END_DATE)) {
                    $scope.ShowAlert('Error', 'Leave end date should less than leave entitlement end date', 3000);
                    $scope.LeaveSearch.END_DATE = ''
                    $scope.LeaveSearch.DAYS = '';
                }
            }
            if (new Date($scope.LeaveSearch.END_DATE) < new Date($scope.LeaveSearch.START_DATE)) {
                $scope.ShowAlert('Error', 'end date should not be less than start date', 3000);
                $scope.LeaveSearch.END_DATE = ''
                $scope.LeaveSearch.DAYS = '';
            }
            //   if (dateType == 1) {
            if ($scope.LeaveSearch.START_TIME != null) {
                var RUN_TIME = $scope.LeaveSearch.START_TIME.replace('AM', '');
                RUN_TIME = RUN_TIME.replace('PM', '');
                var arr = RUN_TIME.split(':');
                if (arr.length > 0) {
                    $scope.HOURS = arr[0] == "0" || arr[0] == null || arr[0] == "null" ? null : arr[0];
                    $scope.MINUTES = arr[1] == "0" || arr[1] == null || arr[1] == "null" ? null : arr[1];
                }
                var IsPM = $scope.LeaveSearch.START_TIME.indexOf('PM') != -1;
                //$scope.HOURS = IsPM ? $scope.HOURS * 1 + 12 : $scope.HOURS == "12" ? "00" : $scope.HOURS;
                if (dateType == 1) {
                    //if (IsPM) {
                    //    var MAKE_END_TIME = angular.copy($scope.LeaveSearch.START_TIME);
                    //    $scope.LeaveSearch.END_TIME = MAKE_END_TIME.replace('PM', 'AM')
                    //}
                    //else {
                    //    var MAKE_END_TIME =angular.copy($scope.LeaveSearch.START_TIME);
                    //    $scope.LeaveSearch.END_TIME = MAKE_END_TIME.replace('AM', 'PM')
                    //}
                }
            }
            else {
                $scope.HOURS = '00'
                $scope.MINUTES = '00'
            }

            var START_DATE = new Date($scope.LeaveSearch.START_DATE).setHours(parseInt($scope.HOURS), parseInt($scope.MINUTES), 0, 0);

            $scope.START_DATE_COMPLETE = changeLeaveTimezone(new Date(START_DATE), moment.tz.guess());
            $scope.START_DATE_COMPLETE_SEND = $scope.CURRENT_DATE;
            $scope.START_DATE_REQUIRED_VALID = ($scope.LeaveSearch.START_DATE == undefined || $scope.LeaveSearch.START_DATE == "" || $scope.LeaveSearch.START_DATE == undefined || $scope.LeaveSearch.START_DATE == "") ? false : true;
            $scope.START_DATE_REQUIRED_VALID ? ($scope.START_DATE_VALID = (Date.parse($scope.START_DATE_COMPLETE) < Date.parse(moment().tz(moment.tz.guess()).format())) ? false : true) : '';
            // }
            //  if (dateType == 2) {
            if ($scope.LeaveSearch.END_TIME != null) {
                var RUN_TIME = $scope.LeaveSearch.END_TIME.replace('AM', '');
                RUN_TIME = RUN_TIME.replace('PM', '');
                var arr = RUN_TIME.split(':');
                if (arr.length > 0) {
                    $scope.END_DATE_HOURS = arr[0] == "0" || arr[0] == null || arr[0] == "null" ? null : arr[0];
                    $scope.END_DATE_MINUTES = arr[1] == "0" || arr[1] == null || arr[1] == "null" ? null : arr[1];
                    //Time
                }
                var IsPM = $scope.LeaveSearch.END_TIME.indexOf('PM') != -1;
                //  $scope.END_DATE_HOURS = IsPM ? $scope.END_DATE_HOURS * 1 + 12 : $scope.END_DATE_HOURS == "12" ? "00" : $scope.END_DATE_HOURS;
            }
            else {
                $scope.END_DATE_HOURS = '00';
                $scope.END_DATE_MINUTES = '00';
            }
            var END_DATE = new Date($scope.LeaveSearch.END_DATE).setHours(parseInt($scope.END_DATE_HOURS), parseInt($scope.END_DATE_MINUTES), 0, 0);
            $scope.END_DATE_COMPLETE = changeLeaveTimezone(new Date(END_DATE), moment.tz.guess());
            $scope.END_DATE_COMPLETE_SEND = $scope.CURRENT_DATE;
            $scope.END_DATE_REQUIRED_VALID = ($scope.LeaveSearch.END_DATE == undefined || $scope.LeaveSearch.END_DATE == "" || $scope.LeaveSearch.END_DATE == undefined || $scope.LeaveSearch.END_DATE == "") ? false : true;
            $scope.END_DATE_REQUIRED_VALID ? $scope.END_DATE_VALID = (Date.parse($scope.END_DATE_COMPLETE) <= Date.parse($scope.START_DATE_COMPLETE)) ? false : true : '';
            // }
            if ($scope.START_DATE_COMPLETE != "" && $scope.END_DATE_COMPLETE != "") {
                b = Date.parse(($scope.END_DATE_COMPLETE)) - Date.parse(new Date($scope.START_DATE_COMPLETE));
                if (b != 0) {
                    var days = Math.floor(b / (1000 * 60 * 60 * 24));
                    var hours = Math.floor((b % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    var minutes = Math.floor((b % (1000 * 60 * 60)) / (1000 * 60));
                    $scope.LeaveSearch.DAYS = "";
                    $scope.LeaveSearch.HOURS = "";
                    if (days < 0) {
                    }
                    else {
                        $scope.LeaveSearch.DAYS = "";
                        $scope.LeaveSearch.DAYS = days;
                    }
                    if (hours < 0) {
                    }
                    else {
                        $scope.LeaveSearch.HOURS = "";
                        $scope.LeaveSearch.HOURS = hours;
                    }
                    if (minutes < 0) {
                    }
                    else {
                        $scope.LeaveSearch.minutes = "";
                        $scope.LeaveSearch.HOURS = hours + '.' + minutes;
                    }
                }
                else {
                    $scope.LeaveSearch.HOURS = "";
                    $scope.LeaveSearch.DAYS = '';
                }
            }

        }
    };

    $scope.MomentDiffBetweenDate = function (START_DATE, END_DATE) {
        var ms = moment(END_DATE, "DD/MM/YYYY HH:mm:ss").diff(moment(START_DATE, "DD/MM/YYYY HH:mm:ss"));
        var diffDuration = moment.duration(ms);
        var array = [];
        array = {
            days: END_DATE.diff(START_DATE, 'days'),
            hours: diffDuration._data.hours,
            minutes: diffDuration._data.minutes,
        }
        //console.log(END_DATE.diff(START_DATE, 'minutes')) // 44700
        //console.log(END_DATE.diff(START_DATE, 'hours')) // 745
        //console.log() // 31
        //console.log(END_DATE.diff(START_DATE, 'weeks')) // 4
        return array;
    };
    $scope.MomentsubtractBetweenDate = function (START_TIME, END_TIME) {
        var start = moment(START_TIME);
        var end = moment(END_TIME);
        moment(BL.BREAK_END, "DD/MM/YYYY HH:mm:ss").diff(moment(BL.BREAK_START, "DD/MM/YYYY HH:mm:ss"));
        return duration._data;
    };

    $scope.SetMomentStartCompleteDate = function (FLAG) {
        $scope.setdate_FY();
    };
    $scope.SetMomentEndCompleteDate = function (FLAG) {
        $scope.setdate_FY();
    };
    $scope.SetStartCompleteDate = function (A, B, FLAG) {
        if (($scope.LeaveSearch.START_DATE != undefined && $scope.LeaveSearch.START_DATE != '' && $scope.LeaveSearch.START_DATE != null) && ($scope.LeaveSearch.END_DATE != undefined && $scope.LeaveSearch.END_DATE != '' && $scope.LeaveSearch.END_DATE != null)) {
            if (new Date($scope.LeaveSearch.END_DATE) < new Date($scope.LeaveSearch.START_DATE)) {
                $scope.ShowAlert('Error', 'end date should not be less than start date', 3000);
                $scope.LeaveSearch.END_DATE = '';
                $scope.LeaveSearch.END_TIME = null;
                $scope.LeaveSearch.DAYS = '';
                $scope.LeaveSearch.HOURS = '';
            }
        };
        if (FLAG == 1) {
            if (($scope.LeaveSearch.START_DATE == undefined || $scope.LeaveSearch.START_DATE == '' || $scope.LeaveSearch.START_DATE == null)) {
                $scope.LeaveSearch.CAL_DAY_OR_HOURES = 0;
                $scope.LeaveSearch.DAYS = 0;
                $scope.LeaveSearch.HOURS = '';
            }
            else if (($scope.LeaveSearch.START_DATE != undefined && $scope.LeaveSearch.START_DATE != '' && $scope.LeaveSearch.START_DATE != null) && ($scope.LeaveSearch.END_DATE != undefined && $scope.LeaveSearch.END_DATE != '' && $scope.LeaveSearch.END_DATE != null)) {
                $scope.setdate_FY();
            }
            else {
                if ($scope.LeaveSearch.END_DATE == undefined || $scope.LeaveSearch.END_DATE == '' || $scope.LeaveSearch.END_DATE == null) {
                    if ($scope.LeaveSearch.START_TIME == undefined || $scope.LeaveSearch.START_TIME == '' || $scope.LeaveSearch.START_TIME == null) {
                        $scope.LeaveSearch.END_DATE = $scope.LeaveSearch.START_DATE;
                        $scope.setdate_FY();
                    }
                    else if ($scope.LeaveSearch.END_TIME == undefined || $scope.LeaveSearch.END_TIME == '' || $scope.LeaveSearch.END_TIME == null) {
                        $scope.setdate_FY();
                    }
                }
            };
        };
    };
    $scope.SetEndCompleteDate = function () {
        if (($scope.LeaveSearch.START_DATE != undefined && $scope.LeaveSearch.START_DATE != '' && $scope.LeaveSearch.START_DATE != null) && ($scope.LeaveSearch.END_DATE != undefined && $scope.LeaveSearch.END_DATE != '' && $scope.LeaveSearch.END_DATE != null)) {
            if (new Date($scope.LeaveSearch.END_DATE) < new Date($scope.LeaveSearch.START_DATE)) {
                $scope.ShowAlert('Error', 'end date should not be less than start date', 3000);
                $scope.LeaveSearch.END_DATE = '';
                $scope.LeaveSearch.END_TIME = null;
                $scope.LeaveSearch.DAYS = '';
                $scope.LeaveSearch.HOURS = '';
            }
        };
        if (($scope.LeaveSearch.START_DATE == undefined || $scope.LeaveSearch.START_DATE == '' || $scope.LeaveSearch.START_DATE == null) || ($scope.LeaveSearch.END_DATE == undefined || $scope.LeaveSearch.END_DATE == '' || $scope.LeaveSearch.END_DATE == null)) {
            $scope.LeaveSearch.CAL_DAY_OR_HOURES = 0;
        }
        else {
            $scope.setdate_FY();
        }
    };

    $scope.ngstarttimechange = function () {
        $scope.LeaveSearch.START_TIME_VALID = false;
        $scope.LeaveSearch.END_TIME_VALID = false;
        if (($scope.LeaveSearch.START_TIME != null && $scope.LeaveSearch.START_TIME != '' && $scope.LeaveSearch.START_TIME != undefined || $scope.LeaveSearch.END_TIME != null && $scope.LeaveSearch.END_TIME != '' && $scope.LeaveSearch.END_TIME != undefined)) {
            $scope.LeaveSearch.START_TIME_VALID = true;
            $scope.LeaveSearch.END_TIME_VALID = true;
        }

    }
    $scope.ngendtimechange = function () {
        $scope.LeaveSearch.START_TIME_VALID = false;
        $scope.LeaveSearch.END_TIME_VALID = false;
        if (($scope.LeaveSearch.START_TIME != null && $scope.LeaveSearch.START_TIME != '' && $scope.LeaveSearch.START_TIME != undefined || $scope.LeaveSearch.END_TIME != null && $scope.LeaveSearch.END_TIME != '' && $scope.LeaveSearch.END_TIME != undefined)) {
            $scope.LeaveSearch.START_TIME_VALID = true;
            $scope.LeaveSearch.END_TIME_VALID = true;
        }

    }

    $scope.setdate_FY = function () {
        if (($scope.LeaveSearch.START_DATE == undefined || $scope.LeaveSearch.START_DATE == '' || $scope.LeaveSearch.START_DATE == null || $scope.LeaveSearch.END_DATE == undefined || $scope.LeaveSearch.END_DATE == '' || $scope.LeaveSearch.END_DATE == null)) {
            // $scope.DATE_SELECTE_FLAG = 1;
            // $scope.GET_REMAINING_LEAVE_EMP();
            $scope.LeaveSearch.CAL_DAY_OR_HOURES = 0;
        }
        else {
            $scope.DATE_SELECTE_FLAG = 0;
            $scope.START_DATE_COMPLETE = angular.copy($scope.LeaveSearch.START_DATE);
            $scope.END_DATE_COMPLETE = angular.copy($scope.LeaveSearch.END_DATE);
            const START_DATE = moment($scope.START_DATE_COMPLETE);
            const END_DATE = moment($scope.END_DATE_COMPLETE);
            START_DATE.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
            END_DATE.set({ hour: 23, minute: 59, second: 59, millisecond: 0 });
            var DiffArray = $scope.MomentDiffBetweenDate(START_DATE, END_DATE);
            $scope.LeaveSearch.DAYS = DiffArray.days + 1;
            $scope.LeaveSearch.HOURS = 0;
            $scope.START_DATE_COMPLETE_SEND = START_DATE;
            $scope.END_DATE_COMPLETE_SEND = END_DATE;
            if ($scope.REMAINING_DAYS.ENTITLEMENT_UNIT_ID == 1 || $scope.REMAINING_DAYS.ENTITLEMENT_UNIT_ID == 3) {
                $scope.LeaveSearch.CAL_DAY_OR_HOURES = $scope.LeaveSearch.DAYS;
            }
            if ($scope.REMAINING_DAYS.ENTITLEMENT_UNIT_ID == 2) {
                $scope.HOURSES = $scope.GET_ENTITY_SETTINGS(2)[0].SETTING_VALUE;
                $scope.LeaveSearch.CAL_DAY_OR_HOURES = $scope.LeaveSearch.DAYS * parseFloat($scope.HOURSES);
            }
            // Code in close because, this calculation is done by applier with his own way, 
            //if (  $scope.LeaveSearch.START_TIME != undefined && $scope.LeaveSearch.START_TIME != '' && $scope.LeaveSearch.START_TIME != null) {
            //    var start = moment($scope.LeaveSearch.START_TIME).format('H:mm');
            //    var end = moment($scope.LeaveSearch.END_TIME).format('H:mm');

            //    var ST = start.split(':');
            //    var ET = end.split(':');
            //    const START_TIME = moment($scope.START_DATE_COMPLETE);
            //    const END_TIME = moment($scope.END_DATE_COMPLETE);

            //    if (ST.length > 0) {
            //        START_TIME.set({ hour: ST[0], minute: ST[1], second: 0, millisecond: 0 });
            //    }
            //    if (ET.length > 0) {
            //        END_TIME.set({ hour: ET[0], minute: ET[1], second: 0, millisecond: 0 });
            //    }

            //    $scope.START_DATE_COMPLETE_SEND = START_TIME;
            //    $scope.END_DATE_COMPLETE_SEND = END_TIME;

            //    var DiffArray = $scope.MomentDiffBetweenDate(START_TIME, END_TIME);
            //    $scope.LeaveSearch.DAYS = DiffArray.days;
            //    var Addm = 0;
            //    if (DiffArray.minutes > 0) {
            //        var Hors = '' + (DiffArray.minutes / 60);
            //        var a = Hors.split('.');
            //        Addm = a[1];
            //    }

            //    if ($scope.LeaveSearch.END_TIME != undefined && $scope.LeaveSearch.END_TIME != '' && $scope.LeaveSearch.END_TIME != null) {
            //        $scope.LeaveSearch.HOURS = parseFloat(DiffArray.hours + '.' + (Addm)).toFixed(2);
            //    }
            //    else {
            //        $scope.LeaveSearch.HOURS = 0;
            //    }
            //    if ($scope.REMAINING_DAYS.ENTITLEMENT_UNIT_ID == 1) {
            //        $scope.LeaveSearch.CAL_DAY_OR_HOURES = $scope.LeaveSearch.DAYS;
            //    }
            //    if ($scope.REMAINING_DAYS.ENTITLEMENT_UNIT_ID == 2) {
            //        $scope.HOURSES = $scope.GET_ENTITY_SETTINGS(2)[0].SETTING_VALUE;
            //        $scope.LeaveSearch.CAL_DAY_OR_HOURES = $scope.LeaveSearch.DAYS * parseFloat($scope.HOURSES);
            //    }
            //}
            if ($scope.REMAINING_DAYS.ENTITLEMENT_UNIT_ID != undefined && $scope.REMAINING_DAYS.ENTITLEMENT_UNIT_ID != null && $scope.REMAINING_DAYS.ENTITLEMENT_UNIT_ID != '') {
                //$scope.END_DATE_REQUIRED_VALID = ($scope.LeaveSearch.END_DATE == undefined || $scope.LeaveSearch.END_DATE == "" || $scope.LeaveSearch.END_DATE == undefined || $scope.LeaveSearch.END_DATE == "") ? false : true;
                //$scope.END_DATE_REQUIRED_VALID ? $scope.END_DATE_VALID = (Date.parse($scope.END_DATE_COMPLETE) <= Date.parse($scope.START_DATE_COMPLETE)) ? false : true : '';
                if ($scope.LeaveSearch.END_TIME != undefined && $scope.LeaveSearch.END_TIME != '' && $scope.LeaveSearch.END_TIME != null) {
                    if (new Date($scope.END_DATE_COMPLETE_SEND) < new Date($scope.START_DATE_COMPLETE_SEND)) {
                        $scope.ShowAlert('Error', 'end date should not be less than start date', 3000);
                        $scope.LeaveSearch.END_DATE = '';
                        $scope.LeaveSearch.END_TIME = null;
                        $scope.LeaveSearch.START_TIME = null;
                        $scope.LeaveSearch.DAYS = '';
                        $scope.LeaveSearch.HOURS = '';
                    }
                }
                else {
                    // $scope.END_DATE_REQUIRED_VALID ? $scope.END_DATE_VALID = (Date.parse($scope.END_DATE_COMPLETE) <= Date.parse($scope.START_DATE_COMPLETE)) ? false : true : '';
                }
                //if (new Date($scope.REMAINING_DAYS.END_DATE) < new Date($scope.START_DATE_COMPLETE_SEND)) {
                //    $scope.ShowAlert('Error', 'you do not have entitlement for the selected period', 3000);
                //    $scope.LeaveSearch.START_DATE = ''
                //    $scope.LeaveSearch.END_DATE = null;
                //    $scope.LeaveSearch.END_TIME = null;
                //    $scope.LeaveSearch.DAYS = '';
                //    $scope.LeaveSearch.HOURS = '';
                //}
                //var EndDate1 = new Date($scope.END_DATE_COMPLETE_SEND);
                //EndDate1.setHours(0);
                //EndDate1.setMinutes(0);
                //EndDate1.setSeconds(0);
                //if (new Date($scope.REMAINING_DAYS.END_DATE) < new Date(EndDate1)) {
                //    $scope.ShowAlert('Error', 'Leave end date should less than leave entitlement end date', 3000);
                //    $scope.LeaveSearch.END_DATE = ''
                //    $scope.LeaveSearch.DAYS = '';
                //    $scope.LeaveSearch.HOURS = '';
                //}
            }
            else {
                if (new Date($scope.END_DATE_COMPLETE_SEND) < new Date($scope.START_DATE_COMPLETE_SEND)) {
                    $scope.ShowAlert('Error', 'end date should not be less than start date', 3000);
                    $scope.LeaveSearch.END_DATE = '';
                    $scope.LeaveSearch.START_TIME = null;
                    $scope.LeaveSearch.END_TIME = null;
                    $scope.LeaveSearch.DAYS = '';
                    $scope.LeaveSearch.HOURS = '';
                }
            };
            $scope.LeaveSearch.START_TIME_VALID = false;
            $scope.LeaveSearch.END_TIME_VALID = false;
            if (($scope.LeaveSearch.START_TIME != null && $scope.LeaveSearch.START_TIME != '' && $scope.LeaveSearch.START_TIME != undefined && $scope.LeaveSearch.START_TIME != true || $scope.LeaveSearch.END_TIME != null && $scope.LeaveSearch.END_TIME != '' && $scope.LeaveSearch.END_TIME != undefined && $scope.LeaveSearch.END_TIME != true)) {
                $scope.LeaveSearch.START_TIME_VALID = true;
                $scope.LeaveSearch.END_TIME_VALID = true;
            }
            if ($scope.LeaveSearch.START_DATE != undefined && $scope.LeaveSearch.START_DATE != '' && $scope.LeaveSearch.START_DATE != null && $scope.LeaveSearch.END_DATE != undefined && $scope.LeaveSearch.END_DATE != '' && $scope.LeaveSearch.END_DATE != null) {
                $scope.DATE_SELECTE_FLAG = 1;
                $scope.GET_REMAINING_LEAVE_EMP();
            }
        }
    };

    $scope.GET_ABSENCE_TYPE = function () {
        $scope.ABSENCE_TYPE = [];
        var PosiModelObj = new Object();
        PosiModelObj.EMP_PRS_ID = $scope.LeaveSearch.REPORTING_EMPLOYEE_ID == undefined || $scope.LeaveSearch.REPORTING_EMPLOYEE_ID == null || $scope.LeaveSearch.REPORTING_EMPLOYEE_ID == '' ? parseInt($cookies.get("EMPLOYEE_ID")) : $scope.LeaveSearch.REPORTING_EMPLOYEE_ID;
        PosiModelObj.FLAG = $scope.LeaveSearch.REPORTING_EMPLOYEE_ID == undefined ? 1 : 2// 1 FOR SELF AND 2 FOR TEAM
        PrcCommMethods.HR_API(PosiModelObj, 'GET_ABSENCE_TYPE_FOR_EMP').then(function (data) {
            $scope.ABSENCE_TYPE = data.data.Table;
            $scope.LEAVE_START_DATE_CHECK = data.data.Table1[0];
        });
    };
    $scope.GET_REMAINING_LEAVE_EMP = function (FLAG) {
        $scope.REMAINING_DAYS = {
        };

        if ($scope.LeaveSearch.ABSENCE_TYPE_ID != undefined && $scope.LeaveSearch.ABSENCE_TYPE_ID != null && $scope.LeaveSearch.ABSENCE_TYPE_ID != '') {
            var PosiModelObj = new Object();
            PosiModelObj.EMP_PRS_ID = $scope.LeaveSearch.REPORTING_EMPLOYEE_ID == undefined ? parseInt($cookies.get("EMPLOYEE_ID")) : $scope.LeaveSearch.REPORTING_EMPLOYEE_ID;
            PosiModelObj.ABSENCE_TYPE_ID = $scope.LeaveSearch.ABSENCE_TYPE_ID;
            PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            PosiModelObj.LEAVE_START_DATE = $scope.LeaveSearch.START_DATE == undefined || $scope.LeaveSearch.START_DATE == '' || $scope.LeaveSearch.START_DATE == null ? null : $scope.LeaveSearch.START_DATE;
            PosiModelObj.LEAVE_END_DATE = $scope.LeaveSearch.END_DATE == undefined || $scope.LeaveSearch.END_DATE == '' || $scope.LeaveSearch.END_DATE == null ? null : $scope.LeaveSearch.END_DATE;
            if (PosiModelObj.LEAVE_START_DATE == null || PosiModelObj.LEAVE_END_DATE == null) {
                $scope.DATE_SELECTE_FLAG = 0;
            }
            else {
                $scope.DATE_SELECTE_FLAG = 1;
            }
            PrcCommMethods.HR_API(PosiModelObj, 'GET_REMAINING_LEAVE_EMP').then(function (data) {
                $scope.REMAINING_DAYS = data.data.Table[0];
                $scope.Showtext = true;



                if ($scope.DATE_SELECTE_FLAG == 1) {
                    if ($scope.REMAINING_DAYS.ALLOWED_RANGE_START == null && $scope.REMAINING_DAYS.ALLOWED_RANGE_END == null) {
                        $scope.ShowAlert('Error', 'You do not have entitlement for selected time period', 3000);
                    }
                    else if (!$scope.REMAINING_DAYS.IS_LEAVE_ASIGNED && $scope.REMAINING_DAYS.ENTITLEMENT_REQUIRED) {
                        $scope.ShowAlert('Error', 'You do not have entitlement for selected time period', 1000);
                    }
                    else {
                        var REND = new Date($scope.REMAINING_DAYS.ALLOWED_RANGE_END);
                        REND.setHours(23)
                        REND.setMinutes(59);
                        REND.setSeconds(59);
                        if (!(moment($scope.START_DATE_COMPLETE_SEND).isBetween(moment($scope.REMAINING_DAYS.ALLOWED_RANGE_START), moment(REND), undefined, '[]'))) {
                            $scope.ShowAlert('Error', 'You do not have entitlement for previous year', 1000);
                        }
                        if (!(moment($scope.END_DATE_COMPLETE_SEND).isBetween(moment($scope.REMAINING_DAYS.ALLOWED_RANGE_START), moment(REND), undefined, '[]'))) {
                            $scope.ShowAlert('Error', 'You do not have entitlement for next year', 1000);
                        }
                    }
                }
                //if ($scope.REMAINING_DAYS.ENTITLEMENT_UNIT_ID == null || $scope.LeaveSearch.START_DATE == undefined || $scope.LeaveSearch.START_DATE == '' || $scope.LeaveSearch.START_DATE == null || $scope.LeaveSearch.END_DATE == undefined || $scope.LeaveSearch.END_DATE == '' || $scope.LeaveSearch.END_DATE == null) {
                //    $scope.LeaveSearch.DAYS = 0;
                //}
                if ($scope.REMAINING_DAYS.ENTITLEMENT_UNIT_ID == 1) {
                    $scope.LeaveSearch.CAL_DAY_OR_HOURES = $scope.LeaveSearch.DAYS;
                }
                else if ($scope.REMAINING_DAYS.ENTITLEMENT_UNIT_ID == 2) {
                    $scope.HOURSES = $scope.GET_ENTITY_SETTINGS(2)[0].SETTING_VALUE;
                    $scope.LeaveSearch.CAL_DAY_OR_HOURES = $scope.LeaveSearch.DAYS * parseFloat($scope.HOURSES);
                }
            });
        }
        else {
            $scope.Showtext = false;
            $scope.REMAINING_DAYS = {
            };
        };
    };
    $scope.GET_UPLOADS = function (REQUEST, UPLOAD_TYPE_ID, RELATIVE_ID, REMOVE_TABLE_ID_TO_MOVE_NEXT_LEVEL, MOVE_TO_LIST) {
        REQUEST.UploadedFiles = [];
        var PosiModelObj = new Object();
        PosiModelObj.RELATIVE_ID = RELATIVE_ID;
        PosiModelObj.UPLOAD_TYPE_ID = UPLOAD_TYPE_ID;
        PosiModelObj.VIRTUALPATH = '';
        PosiModelObj.TABLE_ID = -1;
        PosiModelObj.ORIGINAL_FILE_NAME = '';
        PosiModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.PAYROLL_API(PosiModelObj, 'GET_UPLOADS').then(function (data) {

            if (data.data.Table.length > 0) {
                if (REMOVE_TABLE_ID_TO_MOVE_NEXT_LEVEL == 1) {
                    REQUEST.UploadedFiles = angular.copy(data.data.Table);
                    MOVE_TO_LIST.UploadedFiles = data.data.Table.filter(function (x) { x.ID = 0; return x.ID == 0 });
                } else {
                    REQUEST.UploadedFiles = data.data.Table;
                };
            }
        });
    };
    $scope.NG_CHANGE_LEAVE = function () {
        $scope.GET_ABSENCE_TYPE();
    };
    $scope.LeavechangeTimezone = function (date, FLAG) {

        var offset = $cookies.get("TIMEZONE_OFFSET");
        //  const moment = require('moment'); //
        var dateno = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        var monthno = date.getMonth() + 1;
        monthno = monthno < 10 ? "0" + monthno : monthno;
        var hrsno = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        var minno = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        if (FLAG == undefined) {
            var a = (date.getFullYear() + "-" + monthno + "-" + dateno + "T" + hrsno + ":" + minno + '' + offset);
        }
        else {
            var a = (date.getFullYear() + "-" + monthno + "-" + dateno + "T" + hrsno + ":" + minno + '');
        }

        return moment(a);
    };

    $scope.HR_INS_UPD_LEAVE_REQUESTS = function (VIEW_APPLY) {
        $scope.CustomForm.submitted = true;
        if ($scope.REMAINING_DAYS.ALLOWED_RANGE_START != null && $scope.REMAINING_DAYS.ALLOWED_RANGE_END != null) {
            var REND = new Date($scope.REMAINING_DAYS.ALLOWED_RANGE_END);
            REND.setHours(23)
            REND.setMinutes(59);
            REND.setSeconds(59);
        }
        if (!$scope.CustomForm.$valid) {
        }
        else if (new Date($scope.END_DATE_COMPLETE) < new Date($scope.START_DATE_COMPLETE)) {
            $scope.ShowAlert('Error', 'End date should not be less than start date', 3000);
        }
        else if (moment($scope.START_DATE_COMPLETE_SEND).isSame($scope.END_DATE_COMPLETE_SEND) && $scope.LeaveSearch.DAYS == 0 && $scope.LeaveSearch.HOURS == 0) {
            $scope.ShowAlert('Error', 'Apply leave should not be same.', 3000);
        }
        //$scope.REMAINING_DAYS.ENTITLEMENT_UNIT_ID 
        else if ($scope.LeaveSearch.CAL_DAY_OR_HOURES == 0 || $scope.LeaveSearch.CAL_DAY_OR_HOURES == '.') {
            $scope.ShowAlert('Error', 'Invalid Duration', 3000);
        }
        else if ($scope.LeaveSearch.HOURS > 24) {
            $scope.ShowAlert('Error', 'Hours should not be greater than 24.', 3000);
        }
        else if ($scope.LeaveSearch.ABSENCE_TYPE_ID == 5 && ($scope.REMAINING_DAYS.BALANCE_ACCURED - $scope.LeaveSearch.CAL_DAY_OR_HOURES) < 0) {
            $scope.ShowAlert('Error', 'Holiday should not be more than leave remaining', 3000);
        }
        else if ($scope.REMAINING_DAYS.ALLOWED_RANGE_START == null && $scope.REMAINING_DAYS.ALLOWED_RANGE_END == null) {
            $scope.ShowAlert('Error', 'You do not have entitlement for selected time period', 3000);
        }
        else if (!(moment($scope.START_DATE_COMPLETE_SEND).isBetween(moment($scope.REMAINING_DAYS.ALLOWED_RANGE_START), moment(REND), undefined, '[]'))) {
            $scope.ShowAlert('Error', 'You do not have entitlement for previous year', 1000);
        }
        else if (!(moment($scope.END_DATE_COMPLETE_SEND).isBetween(moment($scope.REMAINING_DAYS.ALLOWED_RANGE_START), moment(REND), undefined, '[]'))) {
            $scope.ShowAlert('Error', 'You do not have entitlement for next year', 1000);
        }
        else if (!$scope.REMAINING_DAYS.IS_LEAVE_ASIGNED && $scope.REMAINING_DAYS.ENTITLEMENT_REQUIRED) {
            $scope.ShowAlert('Error', 'You do not have entitlement for selected time period', 1000);
        }
        else if (($scope.LeaveSearch.START_TIME != undefined && $scope.LeaveSearch.START_TIME != null && $scope.LeaveSearch.START_TIME != '' && $scope.LeaveSearch.START_TIME != true) && ($scope.LeaveSearch.END_TIME == undefined || $scope.LeaveSearch.END_TIME == null || $scope.LeaveSearch.END_TIME == '' || $scope.LeaveSearch.END_TIME == true)) {
            $scope.ShowAlert('Error', 'Please select correct end time ', 1000);
        }
        else if (($scope.LeaveSearch.START_TIME == undefined || $scope.LeaveSearch.START_TIME == null || $scope.LeaveSearch.START_TIME == '' || $scope.LeaveSearch.START_TIME == true) && ($scope.LeaveSearch.END_TIME != undefined && $scope.LeaveSearch.END_TIME != null && $scope.LeaveSearch.END_TIME != '' && $scope.LeaveSearch.END_TIME != true)) {
            $scope.ShowAlert('Error', 'Please select correct start time', 1000);
        }
        else {
            var count = 0;
            if ($scope.REMAINING_DAYS != null && $scope.REMAINING_DAYS.ASSIGNED == 1) {
                isNaN(parseFloat($scope.LeaveSearch.HOURS)) ? $scope.LeaveSearch.HOURS = 0 : parseFloat($scope.LeaveSearch.HOURS)
                isNaN(parseInt($scope.LeaveSearch.DAYS)) ? $scope.LeaveSearch.DAYS = 0 : parseInt($scope.LeaveSearch.DAYS)
                var aa = parseFloat($scope.LeaveSearch.DAYS + '.' + $scope.LeaveSearch.HOURS);
                if (aa > $scope.REMAINING_DAYS.REMAINING_LEAVE) {//  count++; comment beacuse aasim says;
                }
            }
            var LevModelObj = new Object();
            if (count == 0) {
                LevModelObj.REPORT_LEAVE_ID = $scope.LeaveSearch.REPORT_LEAVE_ID;
                LevModelObj.EMP_PRS_ID = $scope.LeaveSearch.REPORTING_EMPLOYEE_ID == undefined || $scope.LeaveSearch.REPORTING_EMPLOYEE_ID == null || $scope.LeaveSearch.REPORTING_EMPLOYEE_ID == '' ? parseInt($cookies.get("EMPLOYEE_ID")) : $scope.LeaveSearch.REPORTING_EMPLOYEE_ID;
                LevModelObj.INITIATED_BY_EMP_ID = parseInt($cookies.get("EMPLOYEE_ID"));
                LevModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
                LevModelObj.ABSENCE_TYPE_ID = $scope.LeaveSearch.ABSENCE_TYPE_ID;
                LevModelObj.ENTITLEMENT_UNIT_ID = $scope.REMAINING_DAYS.ENTITLEMENT_UNIT_ID;
                //var arry = [];
                //if (parseFloat($scope.LeaveSearch.HOURS) > 0) {
                //    arry = $scope.LeaveSearch.HOURS.split('.');
                //}
                //var HOURS = 0;
                //if (arry.length > 0) {
                //    if (parseFloat(arry[1]) > 0) {
                //        var HOURS = parseFloat(arry[1]);
                //    }
                //}

                if ($scope.REMAINING_DAYS.ENTITLEMENT_UNIT_ID == 1 || $scope.REMAINING_DAYS.ENTITLEMENT_UNIT_ID == 3) {
                    LevModelObj.DURATION_DAYS = $scope.LeaveSearch.CAL_DAY_OR_HOURES;
                    LevModelObj.DURATION_HOURS = 0;
                }
                if ($scope.REMAINING_DAYS.ENTITLEMENT_UNIT_ID == 2) {
                    LevModelObj.DURATION_DAYS = 0;
                    LevModelObj.DURATION_HOURS = parseFloat($scope.LeaveSearch.CAL_DAY_OR_HOURES);
                }
                LevModelObj.START_DATE = $scope.START_DATE_COMPLETE_SEND;
                LevModelObj.END_DATE = $scope.END_DATE_COMPLETE_SEND;
                if ($scope.LeaveSearch.START_TIME == undefined || $scope.LeaveSearch.START_TIME == null || $scope.LeaveSearch.START_TIME == '' || $scope.LeaveSearch.START_TIME == true) {
                    LevModelObj.START_DATE = $scope.LeaveSearch.START_DATE;
                }
                if ($scope.LeaveSearch.END_TIME == undefined || $scope.LeaveSearch.END_TIME == null || $scope.LeaveSearch.END_TIME == '' || $scope.LeaveSearch.END_TIME == true) {
                    LevModelObj.END_DATE = $scope.LeaveSearch.END_DATE;
                    if ($scope.LeaveSearch.DAYS == 1 && ($scope.LeaveSearch.HOURS == 0 || $scope.LeaveSearch.HOURS == undefined || $scope.LeaveSearch.HOURS == '' || $scope.LeaveSearch.HOURS == null)) {
                        LevModelObj.END_DATE = new Date($scope.LeaveSearch.END_DATE);
                        LevModelObj.END_DATE.setHours(23)
                        LevModelObj.END_DATE.setMinutes(59);
                        LevModelObj.END_DATE.setSeconds(0);
                    }
                    else if ($scope.LeaveSearch.DAYS > 1 && ($scope.LeaveSearch.END_TIME == undefined || $scope.LeaveSearch.END_TIME == '' || $scope.LeaveSearch.END_TIME == null || $scope.LeaveSearch.END_TIME == true)) {
                        LevModelObj.END_DATE = new Date($scope.LeaveSearch.END_DATE);
                        LevModelObj.END_DATE.setHours(23)
                        LevModelObj.END_DATE.setMinutes(59);
                        LevModelObj.END_DATE.setSeconds(0);
                    }
                }
                if ($scope.LeaveSearch.START_TIME != undefined && $scope.LeaveSearch.START_TIME != '' && $scope.LeaveSearch.START_TIME != null && $scope.LeaveSearch.START_TIME != true) {
                    var start = moment($scope.LeaveSearch.START_TIME).format('H:mm');
                    var end = moment($scope.LeaveSearch.END_TIME).format('H:mm');
                    var ST = start.split(':');
                    var ET = end.split(':');
                    const START_TIME = moment($scope.START_DATE_COMPLETE);
                    const END_TIME = moment($scope.END_DATE_COMPLETE);

                    if (ST.length > 0) {
                        START_TIME.set({ hour: ST[0], minute: ST[1], second: 0, millisecond: 0 });
                    }
                    if (ET.length > 0) {
                        END_TIME.set({ hour: ET[0], minute: ET[1], second: 0, millisecond: 0 });
                    }
                    LevModelObj.START_DATE = START_TIME;
                    LevModelObj.END_DATE = END_TIME;
                }
                LevModelObj.START_DATE = $scope.LeavechangeTimezone(new Date(LevModelObj.START_DATE));
                LevModelObj.END_DATE = $scope.LeavechangeTimezone(new Date(LevModelObj.END_DATE));
                LevModelObj.COMMENTS = $scope.LeaveSearch.COMMENTS;
                LevModelObj.USER_ID = parseInt($cookies.get("USERID"));
                LevModelObj.UPLOAD_IDS = '';
                if ($scope.LeaveSearch.UploadedFiles != undefined && $scope.LeaveSearch.UploadedFiles != null && $scope.LeaveSearch.UploadedFiles.length > 0) {
                    angular.forEach($scope.LeaveSearch.UploadedFiles, function (val) { if (LevModelObj.UPLOAD_IDS == '') { LevModelObj.UPLOAD_IDS = val.UPLOAD_ID; } else { LevModelObj.UPLOAD_IDS = LevModelObj.UPLOAD_IDS + ',' + val.UPLOAD_ID; }; });
                }
                LevModelObj.TIME_ZONE = $cookies.get("TIMEZONE_OFFSET");
                LevModelObj.IS_WEB = 1;
                PrcCommMethods.HR_API(LevModelObj, 'HR_INS_UPD_LEAVE_REQUESTS').then(function (data) {
                    if (data.data.Table.length > 0) {
                        $scope.ShowAlert("Error", "there is already a leave in b/w of selected dates", 3000);
                    }
                    if (data.data.Table.length == 0) {
                        $scope.ShowAlert("Success", "leave request submitted for managers approval", 3000);
                        $('#leave').modal('hide');
                        $scope.RESET_MASTER_LEAVE();
                        if ($filter('lowercase')($location.absUrl()).indexOf("hr_index") != -1) {
                            $scope.child_scope.GET_LEAVE_REQUEST_FOR_CALENDAR();
                        }
                        //if ($filter('lowercase')($location.absUrl()).indexOf("calendar") != -1) {
                        //    $scope.child_scope.GET_PENDING_LEAVE_REQUESTS_COUNT();
                        //}
                        if ($filter('lowercase')($location.absUrl()).indexOf("viewemplev") != -1) {
                            $scope.child_scope.GET_LEAVE_REQUEST_LIST(1);
                            $scope.child_scope.HR_GET_EMPLOYEE();
                        }
                        if ($filter('lowercase')($location.absUrl()).indexOf("calendar") != -1) {
                            $scope.child_scope.GET_PENDING_LEAVE_REQUESTS_COUNT();
                            $scope.child_scope.GET_LEAVE_REQUEST_FOR_CALENDAR_PAGE();
                        }
                    }
                });
            }
            else {
                if (count > 0) {
                    $scope.ShowAlert('Error', 'apply leave should not be greater than remaining leave.', 3000);
                }
            }
        };
    };
    $scope.GET_REPORTING_EMPLOYEE_LIST = function (WHERE_CLICK) {
        var PosiModelObj = new Object();
        PosiModelObj.REPORTING_MANAGER_ID = parseInt($cookies.get("EMPLOYEE_ID"));
        PosiModelObj.ADMIN_FLAG = $scope.CheckSubModuleAccess(48) ? 1 : 0;
        PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PrcCommMethods.HR_API(PosiModelObj, 'GET_REPORTING_EMPLOYEE_LIST').then(function (data) {
            $scope.REPORTING_EMPLOYEE_LIST = data.data.Table;
            if (WHERE_CLICK == 'VIEW_LEAVE') {
                $scope.LEAVE_SAME_EMP_CHK();
                $scope.GET_ABSENCE_TYPE();
            }
        });
    };

    $scope.DDL_CUSTOM_CLICK = function (FIELD_MASTER_ID) {
        setTimeout(function () {
            $("F_" + FIELD_MASTER_ID).focus();
            $("F_" + FIELD_MASTER_ID + " input[type=text]").focus();
        }, 500);
    }
    $scope.CUSTOM_FIELD_KEY_UP = function (opd, CUSTOM_FIELD) {
    }

    $scope.CUSTOM_FIELD_KEY_DOWN = function (opd, CUSTOM_FIELD) {
    }
    $scope.CUSTOM_FIELD_KEY_PRESS = function (opd, CUSTOM_FIELD) {
    }
    $scope.Resetleave = function () {
        $scope.DATE_SELECTE_FLAG = 0;
        $scope.LeaveSearch.CAL_DAY_OR_HOURES = '';
        $scope.LeaveSearch.START_DATE = '';
        $scope.LeaveSearch.END_DATE = '';
        $scope.LeaveSearch.DAYS = '';
        $scope.LeaveSearch.HOURS = '';
        $scope.LeaveSearch.START_TIME = null;
        $scope.LeaveSearch.END_TIME = null;
        $scope.REMAINING_DAYS = {};
    };
    $scope.POP_LEAVE_MASTER_JS = function (WHERE_CLICK) {
        $scope.dateinputOpenDate();
        $scope.IS_LEAVE_TAB = JSON.parse($localStorage.ENTITY_SETTINGS).filter(x => x.SETTING_ID == 16)[0]["SETTING_VALUE"];
        if (WHERE_CLICK == "VIEW_LEAVE") {
            $scope.LEAVE_TEXT_HEADER = 'Record Leave'
            $scope.RECORD_LEAVE = true;
            $scope.RESET_MASTER_LEAVE();
            $scope.LEAVE_SAME_EMP_CHK();
        }
        else {
            $scope.LEAVE_TEXT_HEADER = 'Leave Request'
            $scope.RECORD_LEAVE = false;
            $scope.LeaveSearch.REPORTING_EMPLOYEE_ID = null;
            $scope.LeaveSearch.UploadedFiles = [];
        };

        $('#leave').modal('show')
        $scope.Resetleave();
        $scope.GET_ABSENCE_TYPE();
        $scope.RANDOM_NUMBER = $scope.generaterandom(12);
        $scope.GET_REPORTING_EMPLOYEE_LIST(WHERE_CLICK);
    }
    $scope.LEAVE_SAME_EMP_CHK = function () {
        $scope.EmpID = getUrlParameter('EmpID', $location.absUrl());
        if (parseInt($cookies.get("EMPLOYEE_ID")) == parseInt($scope.EmpID)) {

        }
        else {
            if ($scope.EmpID > 0) {
                $scope.LeaveSearch.REPORTING_EMPLOYEE_ID = parseInt($scope.EmpID);
            }
        }
    }
    //////////////////////////////Leave Apply End Code////////////////////////////////////////
    $scope.isEnabled = true;
    $scope.toggleEnabled = function () {
        $scope.isEnabled = !$scope.isEnabled;
    };
    $scope.onPrev = function (tour) {
        console.log('Moving back...', tour);
    };
    $scope.shouldMoveOn = function () {
        return $q(function (resolve, reject) {
            if (confirm('Click OK to go to the next step. Otherwise you can stay here...if you want.')) { resolve(); } else { reject(); }
        });
    };
    $scope.startDetached = function () { TourService.getTourByName('detachedDemoTour').start(); };
    $scope.goToReviewTour = function () {
        TourService.getTourByName('demoTour').end();
        TourService.getTourByName('detachedDemoTour').start();
    };
    $scope.navigateToAndWaitFor = function (tour, path, step) {
        $location.path(path);
        return tour.waitFor(step);
    }
    ////////////////////////////////////////End Tour////////////////////////////////////////////////////////
    $scope.PRINT_PDF = function (element_ID_To_PDF, portraitOrlandscape, unit, format, reportName, loaderElement_ID) {
        document.getElementById(loaderElement_ID).style.display = "block";
        html2canvas(document.getElementById(element_ID_To_PDF), { useCORS: true, scale: 2 }).then(function (canvas) {
            // Example portraitOrlandscape:p or l
            // Example unit : mm or cm
            // Example format : a3,a4,a0 etc.
            // Example URL : https://artskydj.github.io/jsPDF/docs/jsPDF.html
            var doc = new jsPDF(portraitOrlandscape, unit, format);
            const pageWidth = doc.internal.pageSize.width;
            const pageHeight = doc.internal.pageSize.height;

            const widthRatio = pageWidth / canvas.width;
            const heightRatio = pageHeight / canvas.height;
            const ratio = widthRatio > heightRatio ? heightRatio : widthRatio;

            //const canvasWidth = canvas.width * ratio;
            const canvasHeight = canvas.height * ratio;

            //const marginX = (pageWidth - canvasWidth);
            //const marginY = (pageHeight - canvasHeight);
            var imgBase64 = canvas.toDataURL('image/jpeg', 1.0);
            doc.addImage(imgBase64, 'JPEG', 2, 5, pageWidth - 4, canvasHeight);
            doc.save(reportName);
            document.getElementById(loaderElement_ID).style.display = "none";
        });
    };
    $scope.SIDE_PANAL_NAME_AND_URL = [
        {
            SIDE_PANAL_NAME: "Sales", URL: "../Payment/SalesIndex#!/SalesValidation", ACCESS_ID: 102, ID: 6
        },
        {
            SIDE_PANAL_NAME: "Invoice <br/> Reconciliation", URL: "../Payment/SalesIndex#!/InvUpload", ACCESS_ID: 99999, ID: 6
        },
        {
            SIDE_PANAL_NAME: "Rota Lock", URL: "../Payment/SalesIndex#!/Rota_Lock", ACCESS_ID: 120, ACCESS_ID_1: 121, ID: 6
        }
    ];

    $scope.COMMON_CODE_CHANGE_END_CONTROLLER = function () {
        $scope.SELECTED_TAB_NAME = window.location.hash.substr(3);
    }
    $scope.COMMON_CODE_CHANGE_END_CONTROLLER();
    $scope.STEP_PROCESS = function (STEP_NO) {
        switch (STEP_NO) {
            case 1:
                $("#line-progress").css("width", "0%");
                $(".Upload_Section").addClass("active").siblings().removeClass("active");
                break;
            case 2:
                $("#line-progress").css("width", "15.111%");
                $(".Contact_Mapping_Section").addClass("active").siblings().removeClass("active");
                break;
            case 3:
                $("#line-progress").css("width", "29.3333%");
                $(".Reconcile_Section").addClass("active").siblings().removeClass("active");
                break;
            case 4:
                $("#line-progress").css("width", "43%");
                $(".AccrualSetup").addClass("active").siblings().removeClass("active");
                break;
            case 5:
                $("#line-progress").css("width", "57.555555%");
                $(".Journal_Voucher_Section").addClass("active").siblings().removeClass("active");
                break;
            case 6:
                $("#line-progress").css("width", "72.555555%");
                $(".InvRec_PrepaymentStp").addClass("active").siblings().removeClass("active");
                break;
            case 7:
                $("#line-progress").css("width", "85.555555%");
                $(".InvRec_Prepayment_JV").addClass("active").siblings().removeClass("active");
                break;
            case 8:
                $("#line-progress").css("width", "100%");
                $(".Final_Section").addClass("active").siblings().removeClass("active");
                break;
            case 18:
                //$location.path('InvUpload');
                window.location.href = '../Payment/SalesIndex#!/InvUpload'
                break;
            default:
                break;
        }
    }
    $scope.INV_REC_PAGE_LOAD = function (INV, STEP_NO_FLAG) {
        var STEP_NO = INV.STEP_NO;
        if (STEP_NO >= STEP_NO_FLAG || STEP_NO_FLAG == undefined) {
            if (STEP_NO_FLAG != undefined) {
                STEP_NO = STEP_NO_FLAG;
            }
            switch (STEP_NO) {
                case 1:
                    $location.path('InvRec_Upload').search({ HEADER_ID: INV.ID })
                    break;
                case 2:
                    $location.path('InvRec_ContactMapp').search({ HEADER_ID: INV.ID })
                    break;
                case 3:
                    $location.path('InvRec_Reconcile').search({ HEADER_ID: INV.ID })
                    break;
                case 4:
                    $location.path('InvRec_AccrualStp').search({ HEADER_ID: INV.ID })
                    break;
                case 5:
                    $location.path('InvRec_AccrualJV').search({ HEADER_ID: INV.ID })
                    break;
                case 6:
                    $location.path('InvRec_PrepaymentStp').search({ HEADER_ID: INV.ID })
                    break;
                case 7:
                    $location.path('InvRec_Prepayment_JV').search({ HEADER_ID: INV.ID })
                    break;
                case 8:
                    $location.path('InvRec_Finalize').search({ HEADER_ID: INV.ID })
                    break;
                default:
                    break;
            }
        };
    };
    // NEW_HR_FLAG calling from new HR Schedule
    $scope.INS_UPD_USER_FILTERS = function (FILTER_PAGES_ID, USER_FILTERS, NEW_HR_FLAG) {
        var ModelObj = new Object();
        ModelObj.USER_ID = parseInt($cookies.get("USERID"));
        ModelObj.FILTER_PAGES_ID = FILTER_PAGES_ID;
        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        ModelObj.USER_FILTERS = [];
        ModelObj.USER_FILTERS = USER_FILTERS;
        PrcCommMethods.HR_API(ModelObj, 'INS_UPD_USER_FILTERS').then(function (data) {
            if (data.data == 1) {
                if (NEW_HR_FLAG) {
                    $scope.child_scope.UPDATING_USER_FILTER = true;
                    $scope.GET_USER_FILTERS(24, true); // for new HR
                    $scope.child_scope.$parent.ShowAlertBox('Success', 'Filter Save  Successfully', 3000);
                } else {
                    $scope.ShowAlert('Success', 'Filter Save  Successfully', 3000);
                    $localStorage.USER_FILTERS_LIST = undefined;
                    $scope.GET_USER_FILTERS(parseInt($cookies.get("MODULE_ID")))
                }

            };
            if (data.data == 0) {
                if (NEW_HR_FLAG) {
                    $scope.child_scope.FETCHING_USER_FILTER = false;
                } else {
                    $scope.ShowAlert('Error', $scope.SOMETHINGWENTWRONG, 3000);
                }
            };
        });
    }
    $scope.NAN_Fn = function (VALUE) {
        if (isNaN(VALUE)) {
            return true;
        }
    }
    $scope.ZERO_NAN_Fn = function (VALUE) {
        if (isNaN(VALUE)) {
            return parseFloat(0).toFixed(2);
        }
    }
    $scope.OPEN_SIDE_BAR = function (_param_div_id) {
        document.getElementById(_param_div_id).style.zIndex = "1500";
        document.getElementById(_param_div_id).style.width = "20%";
        $scope.ENTITY_LIST = JSON.parse($localStorage.ENTITY_LIST);
        // $scope.ADMIN_GET_BRANCH_LIST();
    };
    $scope.CLOSE_SIDE_BAR = function (_param_div_id) {
        document.getElementById(_param_div_id).style.width = "0%";
        document.getElementById(_param_div_id).style.zIndex = "1500";
        $scope.ENTITY_LIST = JSON.parse($localStorage.ENTITY_LIST);
    }
    $scope.PAGE_MENU_CLICK_Fn = function (LINE_MENU, _header_dtls) {
        if (_header_dtls.FLAG == 1 && $scope.DISPLAY_FLAG == false) {
            $location.path(LINE_MENU.PATH);
        } else if (_header_dtls.FLAG == 1 && $scope.DISPLAY_FLAG == true) {
            window.location.href = '../DashBoard/PowerInsightIndex#!/' + LINE_MENU.PATH;
        }
        else {
            $scope.ShowAlertBox("Attention", "You have not subscribe this module.", 3000);
        }
    }
    $scope.ADMIN_GET_BRANCH_LIST = function () {
        if ($localStorage.HUMAN_RESOURCE_BRANCH_LIST == undefined) {
            var UserModelObj = new Object();
            UserModelObj.CUSTOMER_ID = $cookies.get("CUSTOMER_ID"),
                PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'ADMIN_GET_BRANCH_LIST').then(function (data) {
                    if (data.data.Table.length > 0) {
                        $localStorage.HUMAN_RESOURCE_BRANCH_LIST = JSON.stringify(data.data.Table);
                        $scope.HUMAN_RESOURCE_BRANCH_LIST = data.data.Table;
                    }
                    else if (data.data == null) {
                        $scope.$parent.ShowAlert("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                    }
                });
        }
        else {
            $scope.HUMAN_RESOURCE_BRANCH_LIST = JSON.parse($localStorage.HUMAN_RESOURCE_BRANCH_LIST);
        }
    }
});
$(document).on("click", ".radio-btn", function (event) {
    event.stopPropagation();
});
$(document.body).on('hide.bs.modal,hidden.bs.modal', function () {
    $('body').css('padding-right', '-1');
});
$(document).on("click", ".radio-btn", function (event) {
    event.stopPropagation();
});
$(document).on("click", "[data-dismiss='modal']", function (event) {
    $('body').css('padding-right', '-0');
});
if ($('.datepicker').datepicker != undefined) {
    $('.datepicker').datepicker().on('changeDate', function (e) {
        (e.viewMode == 'days') ? $(this).datepicker('hide') : '';
    });
}
$(document).on("click", ".DontHideOnClick", function (event) {

    event.stopPropagation();
});
app.directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.myEnter);
                });

                event.preventDefault();
            }
        });
    };
});

