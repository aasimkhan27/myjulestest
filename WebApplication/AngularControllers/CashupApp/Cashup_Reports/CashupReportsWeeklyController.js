app.controller('CashupReportsWeeklyController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location,$localStorage) {
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(2);
    $scope.$parent.CASHUP_COMMON_RESET_Fn();
    var startDate;
    var endDate;
    var prv_6;
    Date.prototype.addDays = function (days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    };
    $scope.EXCEL_REPORT_DATA_LIST = [];
    $scope.CASHUP_PRIVILEGE = '1172';
    $scope.$parent.GET_PRIVILEGE($scope.CASHUP_PRIVILEGE);
    $scope.$watch('REPORTS_SITES_LIST', function (newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.selectSite($scope.REPORTS_SITES_LIST[0]);
        }
    });
    $scope.REPORT_WEEKLY_Obj = {
        SELECTED_SITE: null,
        START_DATE: null,
        END_DATE: null
    }
    $scope.selectSite = function (_site) {
        $scope.REPORT_WEEKLY_Obj.SELECTED_SITE = _site;
        $scope.GET_CASHUP_WEEKLY_REPORT();
    }
    $scope.$watch('REPORT_WEEKLY_Obj.START_DATE', function (newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.GET_CASHUP_WEEKLY_REPORT();
        }
    });
    

    $scope.START_DAY_OF_WEEK = 0;
    if (JSON.parse($localStorage.ENTITY_SETTINGS).length > 0) {
        $scope.START_DAY_OF_WEEK = JSON.parse($localStorage.ENTITY_SETTINGS).filter(x => x.SETTING_ID == 4)[0]["SETTING_VALUE"];
        if ($scope.START_DAY_OF_WEEK == null || $scope.START_DAY_OF_WEEK == undefined || $scope.START_DAY_OF_WEEK == '') {
            $scope.START_DAY_OF_WEEK = 0;
        }
    }
    function set_week_picker(date, FLAG) {
        var count = 0;
        if (parseInt($scope.START_DAY_OF_WEEK) == 6) {
            if (parseInt(prv_6) == 6) {
                start_date = new Date(date.getFullYear(), date.getMonth(), parseInt($scope.START_DAY_OF_WEEK) + date.getDate() - date.getDay());
                end_date = new Date(start_date).addDays(6);
            }
            else {
                start_date = new Date(date.getFullYear(), date.getMonth(), parseInt($scope.START_DAY_OF_WEEK) - 7 + date.getDate() - date.getDay());
                end_date = new Date(date.getFullYear(), date.getMonth(), parseInt($scope.START_DAY_OF_WEEK) - 7 + date.getDate() - date.getDay()).addDays(6);
            }
        }
        else {
            start_date = new Date(date.getFullYear(), date.getMonth(), parseInt($scope.START_DAY_OF_WEEK) + date.getDate() - date.getDay());
            end_date = new Date(date.getFullYear(), date.getMonth(), parseInt($scope.START_DAY_OF_WEEK) + date.getDate() - date.getDay() + 6);
        }
        //start_date = new Date(date.getFullYear(), date.getMonth(), parseInt($scope.START_DAY_OF_WEEK) + date.getDate() - date.getDay());        
        if (start_date > date) {
            if (FLAG == 1) {
                var increasedays = start_date.getDate() - date.getDate();
                start_date = new Date(date.getFullYear(), date.getMonth(), start_date.getDate() - ((7 - increasedays) + increasedays));
                end_date = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() + (1 + increasedays));
            }
        }

        weekpicker.datepicker('update', start_date);
        $scope.REPORT_WEEKLY_Obj.START_DATE = start_date;
        $scope.REPORT_WEEKLY_Obj.END_DATE = end_date;
        
        var StartDD = start_date.getDate();
        var Startmm = start_date.getMonth() + 1;
        var start_dateyyyy = start_date.getFullYear();
        var EndDD = end_date.getDate();
        var Endmm = end_date.getMonth() + 1;
        var Endyyyy = end_date.getFullYear();

        if (StartDD < 10) { StartDD = '0' + StartDD; }
        if (Startmm < 10) { Startmm = '0' + Startmm; }
        var start_dateddmmyy = StartDD + '/' + Startmm + '/' + start_dateyyyy;
        if (EndDD < 10) { EndDD = '0' + EndDD; }
        if (Endmm < 10) { Endmm = '0' + Endmm; }
        var end_dateddmmyy = EndDD + '/' + Endmm + '/' + Endyyyy;
        weekpicker.val(start_dateddmmyy + ' - ' + end_dateddmmyy);
        $scope.REPORT_BETWEEN_DATE = start_dateddmmyy + ' - ' + end_dateddmmyy;
        
    };
    $scope.DATEPICKERDATE_FY = function (date) {
        weekpicker = $('.week-picker');
        weekpicker.datepicker({
            weekStart: parseInt($scope.START_DAY_OF_WEEK),
            autoclose: true,
            forceParse: false,
            container: '#week-picker-wrapper',

        }).on("changeDate", function (e) {
            set_week_picker(e.date);
        });
        $('.week-prev').on('click', function () {
            var prev = new Date(start_date.getTime());
            prev.setDate(prev.getDate() - 6);
            prv_6 = "";
            set_week_picker(prev);
        });
        $('.week-next').on('click', function () {
            var next = new Date(end_date.getTime());
            next.setDate(next.getDate() + 1);
            parseInt($scope.START_DAY_OF_WEEK) == 6 ? prv_6 = "6" : prv_6 = "";
            set_week_picker(next);
        });
        set_week_picker(date, 1);
    }
    $scope.DATEPICKERDATE_FY(new Date())





    $scope.GET_CASHUP_WEEKLY_REPORT = function (RPTID, DISPLAY_HTML_FLAG) {
        $scope.CASHUP_REPORT_DATA_LIST = [];
        $scope.EXCEL_REPORT_DATA_LIST = [];
        $scope.enable = "false";
        $scope.LOADER_ICON = true;

        CashupAppModel = new Object();
        //CashupAppModel.ENTITY_ID = 99;
        //CashupAppModel.START_DATE = '2024-10-16';
        //CashupAppModel.END_DATE = '2024-10-22';
        //CashupAppModel.BRANCH_ID = 146;

        CashupAppModel.ENTITY_ID = parseInt($cookies.get('ENTITY_ID'));
        CashupAppModel.START_DATE = moment($scope.REPORT_WEEKLY_Obj.START_DATE).format($scope.$parent.DB_DATE_FORMAT);//(new Date($scope.REPORT_WEEKLY_Obj.START_DATE)).toDateString();
        CashupAppModel.END_DATE = moment($scope.REPORT_WEEKLY_Obj.END_DATE).format($scope.$parent.DB_DATE_FORMAT);// (new Date($scope.REPORT_WEEKLY_Obj.END_DATE)).toDateString();
        CashupAppModel.BRANCH_ID = $scope.REPORT_WEEKLY_Obj.SELECTED_SITE.BRANCH_ID;

        CashupAppModel.INCLUDE_CATEGORY_BIFURCATION_IN_REPORT = 0;

        PrcCommMethods.CASHUP_APP_API(CashupAppModel, 'GET_CASHUP_WEEKLY_REPORT').then(function (data) {
            if (data.data != null && data.data.Table1 != undefined) {

                $scope.CASHUP_REPORT_DATA_LIST = data.data.Table1;
                $scope.JSON_COLUMN_NAME = Object.keys(data.data.Table1[0]);
                $scope.CASHUP_REPORT_DATA_FOR_HTML = [];
                angular.forEach($scope.CASHUP_REPORT_DATA_LIST, function (item) {
                    var getEntityDate = new Date($scope.REPORT_WEEKLY_Obj.START_DATE);
                    CashupModel = new Object();
                    CashupModel.Session = item.Session;
                    for (var i = 0; i < 7; i++) {
                        var getDay = getEntityDate.getDay();
                        if (getDay == 0) {
                            CashupModel.SUNDAY = item.SUNDAY == null || item.SUNDAY == undefined ? item.SUNDAY : item.SUNDAY.toFixed(2);
                        }
                        if (getDay == 1) {
                            CashupModel.MONDAY = item.MONDAY == null || item.MONDAY == undefined ? item.MONDAY : item.MONDAY.toFixed(2);
                        }
                        if (getDay == 2) {
                            CashupModel.TUESDAY = item.TUESDAY == null || item.TUESDAY == undefined ? item.TUESDAY : item.TUESDAY.toFixed(2);
                        }
                        if (getDay == 3) {
                            CashupModel.WEDNESDAY = item.WEDNESDAY == null || item.WEDNESDAY == undefined ? item.WEDNESDAY : item.WEDNESDAY.toFixed(2);
                        }
                        if (getDay == 4) {
                            CashupModel.THURSDAY = item.THURSDAY == null || item.THURSDAY == undefined ? item.THURSDAY : item.THURSDAY.toFixed(2);
                        }
                        if (getDay == 5) {
                            CashupModel.FRIDAY = item.FRIDAY == null || item.FRIDAY == undefined ? item.FRIDAY : item.FRIDAY.toFixed(2);
                        }
                        if (getDay == 6) {
                            CashupModel.SATURDAY = item.SATURDAY == null || item.SATURDAY == undefined ? item.SATURDAY : item.SATURDAY.toFixed(2);
                        }
                        getEntityDate = getEntityDate.addDays(1);
                    }
                    CashupModel.TotalWeek = item.TotalWeek == null ? item.TotalWeek : item.TotalWeek.toFixed(2);
                    CashupModel.Var_Last_Week = item.Var_Last_Week == null ? item.Var_Last_Week : item.Var_Last_Week.toFixed(2);
                    CashupModel.Var_Last_Year = item.Var_Last_Year == null ? item.Var_Last_Year : item.Var_Last_Year.toFixed(2);
                    $scope.CASHUP_REPORT_DATA_FOR_HTML.push(CashupModel);

                });
                $scope.JSON_COLUMN_NAME = Object.keys($scope.CASHUP_REPORT_DATA_FOR_HTML[0]);
                $scope.JSON_COLUMN_NAME_FOR_HTML = Object.keys($scope.CASHUP_REPORT_DATA_FOR_HTML[0]);
                $scope.TEMP = [];
                angular.forEach($scope.JSON_COLUMN_NAME_FOR_HTML, function (jsonitem) {
                    if (jsonitem == "Session")
                        jsonitem = 'SESSION NAME';
                    if (jsonitem == "TotalWeek")
                        jsonitem = 'TOTAL WEEK';
                    if (jsonitem == "Var_Last_Week")
                        jsonitem = 'VAR. LAST WEEK';
                    if (jsonitem == "Var_Last_Year")
                        jsonitem = 'VAR. LAST YEAR';
                    $scope.TEMP.push(jsonitem);
                });
                $scope.JSON_COLUMN_NAME_FOR_HTML = []; $scope.JSON_COLUMN_NAME_FOR_HTML = $scope.TEMP;
                angular.forEach($scope.CASHUP_REPORT_DATA_FOR_HTML, function (item) {
                    $scope.SELECTED_DATA = [];
                    if (item.Session == "NET_REVENUE") { item.Session = "NET REVENUE"; }
                    if (item.Session == "Drinks") { item.Session = "DRINKS"; }
                    if (item.Session == "Food") { item.Session = "FOOD"; }
                    if (item.Session == "SRVC_CHARGE") { item.Session = "SERVICE CHARGE"; }
                    if (item.Session == "TOTAL_REVENUE") { item.Session = "TOTAL REVENUE"; }
                    if (item.Session == "TotalWeek") { item.Session = "TOTAL WEEK"; $scope.CSS_APPLY = "card-footer"; }
                    if (item.Session == "PETTY_CASH") { item.Session = "PETTY CASH"; }
                    if (item.Session == "VOUCHER_SOLD") { item.Session = "VOUCHER SOLD"; }
                    if (item.Session == "VOUCHER_REDEEMED") { item.Session = "VOUCHER REDEEMED"; }
                    if (item.Session == "DEPOSIT_SOLD") { item.Session = "DEPOSIT SOLD"; }
                    if (item.Session == "DEPOSIT_REDEEMED") { item.Session = "DEPOSIT REDEEMED"; }
                    if (item.Session == "ACCOUNT_RECEIVED") { item.Session = "ACCOUNT RECEIVED"; }
                    if (item.Session == "ACCOUNT_CREDIT") { item.Session = "ACCOUNT CREDIT"; }
                    if (item.Session == "Total Collection") { item.Session = "TOTAL COLLECTION"; $scope.CSS_APPLY = "card-footer"; }
                    if (item.Session == "VOID" || item.Session == "CASH") {
                        $scope.SELECTED_DATA[$scope.JSON_COLUMN_NAME[0]] = ' ';
                        $scope.SELECTED_DATA[$scope.JSON_COLUMN_NAME[1]] = ' ';
                        $scope.SELECTED_DATA[$scope.JSON_COLUMN_NAME[2]] = ' ';
                        $scope.SELECTED_DATA[$scope.JSON_COLUMN_NAME[3]] = ' ';
                        $scope.SELECTED_DATA[$scope.JSON_COLUMN_NAME[4]] = ' ';
                        $scope.SELECTED_DATA[$scope.JSON_COLUMN_NAME[5]] = ' ';
                        $scope.SELECTED_DATA[$scope.JSON_COLUMN_NAME[6]] = ' ';
                        $scope.SELECTED_DATA[$scope.JSON_COLUMN_NAME[7]] = ' ';
                        $scope.SELECTED_DATA[$scope.JSON_COLUMN_NAME[8]] = ' ';
                        $scope.SELECTED_DATA[$scope.JSON_COLUMN_NAME[9]] = ' ';
                        $scope.SELECTED_DATA[$scope.JSON_COLUMN_NAME[10]] = ' ';

                        $scope.EXCEL_REPORT_DATA_LIST.push($scope.SELECTED_DATA); $scope.SELECTED_DATA = [];
                    }

                    $scope.SELECTED_DATA[$scope.JSON_COLUMN_NAME[0]] = item[$scope.JSON_COLUMN_NAME[0]] == null ? '--' : item[$scope.JSON_COLUMN_NAME[0]];
                    $scope.SELECTED_DATA[$scope.JSON_COLUMN_NAME[1]] = item[$scope.JSON_COLUMN_NAME[1]] == null ? '--' : parseFloat(item[$scope.JSON_COLUMN_NAME[1]]).toFixed(2);
                    $scope.SELECTED_DATA[$scope.JSON_COLUMN_NAME[2]] = item[$scope.JSON_COLUMN_NAME[2]] == null ? '--' : parseFloat(item[$scope.JSON_COLUMN_NAME[2]]).toFixed(2);
                    $scope.SELECTED_DATA[$scope.JSON_COLUMN_NAME[3]] = item[$scope.JSON_COLUMN_NAME[3]] == null ? '--' : parseFloat(item[$scope.JSON_COLUMN_NAME[3]]).toFixed(2);
                    $scope.SELECTED_DATA[$scope.JSON_COLUMN_NAME[4]] = item[$scope.JSON_COLUMN_NAME[4]] == null ? '--' : parseFloat(item[$scope.JSON_COLUMN_NAME[4]]).toFixed(2);
                    $scope.SELECTED_DATA[$scope.JSON_COLUMN_NAME[5]] = item[$scope.JSON_COLUMN_NAME[5]] == null ? '--' : parseFloat(item[$scope.JSON_COLUMN_NAME[5]]).toFixed(2);
                    $scope.SELECTED_DATA[$scope.JSON_COLUMN_NAME[6]] = item[$scope.JSON_COLUMN_NAME[6]] == null ? '--' : parseFloat(item[$scope.JSON_COLUMN_NAME[6]]).toFixed(2);
                    $scope.SELECTED_DATA[$scope.JSON_COLUMN_NAME[7]] = item[$scope.JSON_COLUMN_NAME[7]] == null ? '--' : parseFloat(item[$scope.JSON_COLUMN_NAME[7]]).toFixed(2);
                    $scope.SELECTED_DATA[$scope.JSON_COLUMN_NAME[8]] = item[$scope.JSON_COLUMN_NAME[8]] == null ? '--' : parseFloat(item[$scope.JSON_COLUMN_NAME[8]]).toFixed(2);
                    $scope.SELECTED_DATA[$scope.JSON_COLUMN_NAME[9]] = item[$scope.JSON_COLUMN_NAME[9]] == null || item[$scope.JSON_COLUMN_NAME[9]] == '--' ? '--' : parseFloat(item[$scope.JSON_COLUMN_NAME[9]]).toFixed(2) + "%";
                    $scope.SELECTED_DATA[$scope.JSON_COLUMN_NAME[10]] = item[$scope.JSON_COLUMN_NAME[10]] == null || item[$scope.JSON_COLUMN_NAME[10]] == '--' ? '--' : parseFloat(item[$scope.JSON_COLUMN_NAME[10]]).toFixed(2) + "%";

                    $scope.EXCEL_REPORT_DATA_LIST.push($scope.SELECTED_DATA);
                    $scope.enable = "true";
                    $scope.LOADER_ICON = false;
                    $scope.CSS_APPLY = null;
                });
                if (DISPLAY_HTML_FLAG == undefined) {
                    {
                        if (RPTID == 27)
                            alasql('SELECT * INTO XLSX("WEEKLY CASHUP REPORT BY SESSION",{headers:true}) FROM ?', [$scope.EXCEL_REPORT_DATA_LIST]);
                        if (RPTID == 28)
                            alasql('SELECT * INTO XLSX("WEEKLY CASHUP REPORT BY SESSION CATEGORY",{headers:true}) FROM ?', [$scope.EXCEL_REPORT_DATA_LIST]);
                    }
                }
                if (DISPLAY_HTML_FLAG == 2) {
                    $scope.DISPLAY_HTML_FLAG = DISPLAY_HTML_FLAG;
                    if ($scope.CASHUP_REPORT_DATA_LIST.length > 0) {
                        $scope.SHOW_WEEKLY_CASHUP_HTML_TABLE_FLAG = true;
                        //$('#CASHUP_REPORT').modal('hide');
                        $scope.DISPLAY_HTML_FLAG = null;
                    }
                }
                //$('#CASHUP_REPORT').modal('hide');
                $scope.LOADER_ICON = false;
                $scope.enable = "true"
            }
            else {
                $scope.$parent.ShowAlertBox("Attention", "No Records Found.", 3000);
                $scope.enable = "true";
                $scope.LOADER_ICON = false;
                $scope.CASHUP_REPORT_DATA_FOR_HTML = [];
            }
            $scope.EPOS_DATA = $scope.CASHUP_REPORT_DATA_FOR_HTML.filter(x =>
                x.Session == 'NET REVENUE' ||
                x.Session == 'VAT' ||
                x.Session == 'SERVICE CHARGE' ||
                x.Session == 'TIP' || 
                x.Session == 'TOTAL REVENUE');
            $scope.ACTUALS_DATA = $scope.CASHUP_REPORT_DATA_FOR_HTML.filter(x =>
                x.Session == 'CASH' ||
                x.Session == 'PETTY CASH' ||
                x.Session == 'CARD' ||
                x.Session == 'ACCOUNT CREDIT' ||
                x.Session == 'VOUCHER SOLD' ||
                x.Session == 'VOUCHER REDEEMED' ||
                x.Session == 'DEPOSIT REDEEMED' ||
                x.Session == 'DELIVERY' ||
                x.Session == 'TRANSITORY' ||
                x.Session == 'TOTAL COLLECTION');
            $scope.OTHER_DATA = $scope.CASHUP_REPORT_DATA_FOR_HTML.filter(x =>
                x.Session == 'VARIANCE' ||
                x.Session == 'ACCOUNT RECEIVED' ||
                x.Session == 'DEPOSIT SOLD' ||
                x.Session == 'VOID' ||
                x.Session == 'COMP');
        });

    };
    $scope.EXPORT_WEEKLY_CASHUP_REPORT = function (export_flag) {
        var CashupAppModelObj = new Object();
        var excelList = [];
        excelList = excelList.concat($scope.EPOS_DATA);
        excelList = excelList.concat($scope.ACTUALS_DATA);
        excelList = excelList.concat($scope.OTHER_DATA);
        CashupAppModelObj.CASHUP_EXPORT_LIST = excelList;//$scope.EXCEL_REPORT_DATA_LIST.filter(x => x.Session != 'BREAKFAST' || x.Session != 'LUNCH' || x.Session != 'DINNER' || x.Session != 'ALL');
        CashupAppModelObj.CASHUP_REPORT_TYPE = 2;
        CashupAppModelObj.EXPORT_FLAG = export_flag;
        CashupAppModelObj.FILE_PATH = "/WEEKLY_CASHUP_REPORT_" + "/CUSTOMER_" + $cookies.get('ENTITY_ID') + "/" + "USER_ID_" + $cookies.get('USERID') + "/" + (export_flag == 1 ? "CSV" : "XLSX") + "/";
        CashupAppModelObj.FILE_NAME = "Weekly Cashup Report";
        PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'EXPORT_CASHUP_REPORTS').then(function (data) {
            if (data.data != null) {
                $scope.SERVER_FILE_PATH = '/' + data.data.FOLDER_NAME + data.data.RETURN_FILE_NAME;
                $scope.FILE_NAME = CashupAppModelObj.FILE_NAME;
                window.location.href = $scope.SERVER_FILE_PATH;
            } else {
                alert("Export failed. Please try again.");
            }
        });
    }
});