app.controller('CashupRegisterController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    //$scope.$parent.DISPLAY_FLAG = false;
    //$scope.$parent.$parent.DISPLAY_FLAG = true;
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(2);
    //$scope.CASHUP_COMMON_CODE_Fn();
    $scope.register_Search = {
        CUSTOMER_ID: $cookies.get("CUSTOMER_ID"),
        USER_ID: $cookies.get("USERID"),
        ENTITY_ID: $cookies.get("ENTITY_ID"),
        MODULE_ID: $cookies.get("MODULE_ID"),
        CASHUP_DATE_START: null,
        CASHUP_DATE_END: null,
        STATUS_IDS: "",
        BRANCH_IDS: "",
        APPROVER_NAME: null,
        PAGE_NO: 1,
        PAGE_SIZE: 20,
        SORT_COLUMN_NO: 1,
        SORT_ORDER_NO: 1,
        STATUS_NAME: null,
    };
    var startDate;
    var endDate;
    $scope.SITES_LIST = [];
    $scope.SESSION_LIST = [];
    $scope.SELECTED_RECORD = null;
    $scope.CASHUP_BY_SESSION = true;
    $scope.CASHUP_BY_AREA = true;
    $scope.$parent.CASHUP_BY_AREA = true;
    $scope.$parent.REDIRECT_REGISTER_ENTRY = false;
    $scope.CASHUP_RECORDS = [];
    $scope.AREA_LIST = [];
    $scope.$parent.CASHUP_COMMON_RESET_Fn();
    //console.log("Status List", $scope.STATUS_LIST);
    $scope.STATUS_LIST = [
        { id: null, name: "All"},
        { id: 0, name: "Pending"},
        { id: 1, name: "Draft"},
        { id: 2, name: "Submitted"},
        { id: 4, name: "Approved"},
        { id: 5, name: "Returned"}
    ];
    $scope.HEADER_STATUS_LIST = {
        null:"-",
        0: "Pending",
        1: "Draft",
        3: "In Approval",
        4: "Approved",
        5: "Returned"
    }
    // Default label
    $scope.DD_DEFAULT_STATUS = 'Status';
    $scope.CAHSUP_PRIVILEGE_ID = "1161";
    $scope.CASHUP_PRIVILEGE = true;
    $scope.CASHUP_CLOSE_PRIVILEGE = false;
    $scope.SiteSearch = {};
    $scope.SELECT_STATUS = function (_status_name, _status_id) {
        $scope.register_Search.STATUS_NAME = _status_name;
        //console.log("Status Name", $scope.register_Search.STATUS_NAME);
        $scope.register_Search.STATUS_IDS = _status_id;
        //console.log("Status ID", $scope.register_Search.STATUS_IDS);
        $scope.CASHUP_RECORDS = [];
        $scope.GET_CASHUP_REGISTER(1);
    };

    $scope.$parent.Datelocaleformat = { format: 'DD/MM/YYYY' };
    function reportrange(startDate, endDate) {
        $scope.register_Search.START_DATE = startDate.format('YYYY-MM-DD');
        $scope.register_Search.END_DATE = endDate.format('YYYY-MM-DD');
        $('#reportrange span').html(startDate.format('DD-MM-YYYY') + ' - ' + endDate.format('DD-MM-YYYY'));
        if ($scope.FILTERED_SITES_LIST.length>0) {
            $scope.GET_CASHUP_REGISTER(1)
        }
        //$scope.GET_CASHUP_REGISTER(1);
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

    $scope.GetData = true;

    //-------------------------------------------------------SCOPE DECLARACTION----------------------------------------------------------------
    
    
    $scope.LAZY_LOAD_GET_CASHUP_REGISTER = function () {
        $scope.register_Search.IS_LAZY_LOAD_CLICKED = true;
        $scope.GET_CASHUP_REGISTER();
    }

    $scope.FILTER_BY_DATE = function () {
        $scope.CASHUP_RECORDS = [];
        $scope.GET_CASHUP_REGISTER(1);
    }

    //$scope.SORT_BY_ORDER = function (ordNo) {
    //    if ($scope.register_Search.SORT_COLUMN_NO === ordNo) {
    //        $scope.register_Search.SORT_ORDER_NO = $scope.register_Search.SORT_ORDER_NO === 1 ? -1 : 1;
    //    } else {
    //        $scope.register_Search.SORT_COLUMN_NO = ordNo;
    //        $scope.register_Search.SORT_ORDER_NO = -1;
    //    }

    //    $scope.CASHUP_RECORDS = [];
    //    $scope.GET_CASHUP_REGISTER(1);
    //};

    $scope.SORT_BY_ORDER = function (columnNo) {
        if ($scope.register_Search.SORT_COLUMN_NO === columnNo) {
            $scope.register_Search.SORT_ORDER_NO *= -1;
        } else {
            $scope.register_Search.SORT_COLUMN_NO = columnNo;
            $scope.register_Search.SORT_ORDER_NO = 1;
        }
        
        $scope.GET_CASHUP_REGISTER(1);
    };
    $scope.ADMIN_GET_AREA = function (_branchID) {
        var AreaModelObj = new Object();
        AreaModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        AreaModelObj.AREA_CODE = null;
        AreaModelObj.AREA_NAME = null;
        AreaModelObj.ACTIVE = 1;
        AreaModelObj.PAGE_NO = 0;
        AreaModelObj.PAGE_SIZE = 0;
        AreaModelObj.BRANCH_ID = _branchID;
        PrcCommMethods.ADMIN_API(AreaModelObj, 'ADMIN_GET_AREA').then(function (data) {
            if (data.data && data.data.Table.length > 0) {
                $scope.AREA_LIST = data.data.Table;
            } else {
                $scope.AREA_LIST = [];
            }
        });
    };
    $scope.ADMIN_GET_CU_SESSION_MAPPING_Fn = function (_branchID) {
        var SessionObj = new Object();
        SessionObj.BRANCH_ID = _branchID;
        PrcCommMethods.CASHUP_APP_API(SessionObj, 'GET_SESSION_BY_BRANCH').then(function (data) {
            if (data.data && data.data.length > 0) {
                $scope.SESSION_LIST = data.data;
            } else {
                console.warn("No sessions found for branch ID " + BRANCH_ID);
                $scope.SESSION_LIST = [];
            }
        })
    };
    $scope.GET_CASHUP_REGISTER = function (flag) {
        if ($scope.register_Search.BRANCH_IDS != null && $scope.register_Search.BRANCH_IDS != undefined && $scope.register_Search.BRANCH_IDS!="") {
            if (flag == 1) {
                $scope.CASHUP_RECORDS = [];
                $scope.register_Search.PAGE_NO = 1
            }
            var CashupModelObj = new Object();
            CashupModelObj.ENTITY_ID = $scope.register_Search.ENTITY_ID;
            CashupModelObj.USER_ID = $scope.register_Search.USER_ID;
            CashupModelObj.CASHUP_DATE_START = $scope.register_Search.START_DATE == undefined ? moment().startOf('month').format($scope.$parent.Datelocaleformat.format) : $scope.register_Search.START_DATE;
            CashupModelObj.CASHUP_DATE_END = $scope.register_Search.END_DATE == undefined ? moment().endOf('month').format($scope.$parent.Datelocaleformat.format) : $scope.register_Search.END_DATE;
            CashupModelObj.STATUS_IDS = ($scope.register_Search.STATUS_IDS !== undefined && $scope.register_Search.STATUS_IDS !== null) ? $scope.register_Search.STATUS_IDS : null;
            CashupModelObj.BRANCH_IDS = $scope.register_Search.BRANCH_IDS ? $scope.register_Search.BRANCH_IDS : null;
            CashupModelObj.APPROVER_NAME = $scope.register_Search.APPROVER_NAME ? $scope.register_Search.APPROVER_NAME : null;
            CashupModelObj.PAGE_NO = $scope.register_Search.PAGE_NO;
            CashupModelObj.PAGE_SIZE = $scope.register_Search.PAGE_SIZE;

            CashupModelObj.SORT_COLUMN_NO = $scope.register_Search.SORT_COLUMN_NO || 1;
            CashupModelObj.SORT_ORDER_NO = $scope.register_Search.SORT_ORDER_NO || 1;

            PrcCommMethods.CASHUP_APP_API(CashupModelObj, 'GET_CASHUP_REGISTER').then(function (data) {
                if (data.data.Table.length > 0) {
                    if (flag == 1) {
                        $scope.CASHUP_RECORDS = data.data.Table;
                    }
                    else if (flag == null || flag == undefined) {
                        $scope.CASHUP_RECORDS = $scope.CASHUP_RECORDS.concat(data.data.Table);
                    }

                    //$scope.CASHUP_RECORDS = $scope.CASHUP_RECORDS.concat(data.data.Table);
                    if (data.data.Table.length < $scope.register_Search.PAGE_SIZE) {
                        $scope.GetData = false;
                    }
                    else {
                        $scope.register_Search.PAGE_NO = parseInt($scope.register_Search.PAGE_NO) + 1;
                        $scope.GetData = true;
                    }
                } else if ($scope.register_Search.PAGE_NO > 1 && data.data.Table.length == 0) {
                    $scope.GetData = false;
                }
                else {
                    $scope.CASHUP_RECORDS = [];
                    $scope.LOAD_FETCH_TEXT = 'No Records Found !';
                }
            });
        }
    }

    

    //-------------------------------------------------------GET FUNCTIONS DONE----------------------------------------------------------------

    $scope.FILTER_Fn = function (site) {

        if ($scope.FILTERED_SITES_LIST.length === $scope.FILTERED_SITES_LIST.filter(site => site.IS_SELECTED).length) {
            $scope.SiteSearch.SelectAllSites = true;
        }
        else if ($scope.FILTERED_SITES_LIST.filter(site => !site.IS_SELECTED).length === $scope.FILTERED_SITES_LIST.length) {
            $scope.$parent.ShowAlertBox("Success", site.BRANCH_NAME + 'is Selected', 3000);
        }
        else {
            $scope.SiteSearch.SelectAllSites = false;
        }

        $scope.register_Search.BRANCH_IDS = $scope.FILTERED_SITES_LIST
            .filter(site => site.IS_SELECTED)
            .map(site => site.BRANCH_ID)
            .join(',');
        if ($scope.register_Search.START_DATE != null && $scope.register_Search.START_DATE != undefined && $scope.register_Search.END_DATE != null && $scope.register_Search.START_DATE != undefined) {
            $scope.GET_CASHUP_REGISTER(1)
        }
        //$scope.GET_CASHUP_REGISTER(1);
    };

    
    $scope.ng_initrecords = function (_record, LAST_FLAG) {
        //_record.SHORT_NAME = $scope.TextReturn(_record.APPROVER);

        if (LAST_FLAG) {
            $(".dropstart").click(function () {
                $("td.ME_sticky_right").css("z-index", 0);
                $(this).parent().css("z-index", 9);
            });
        }
        
        var _standard_role_id = $scope.FILTERED_SITES_LIST.filter(_row => _row.BRANCH_ID == _record.BRANCH_ID)[0].STANDARD_ROLE_ID;
        if ((_record.STATUS_ID == 2 || _record.STATUS_ID == 3 || _record.STATUS_ID == 4) && (_standard_role_id == 16 || _standard_role_id == 17)) {
            _record.RESET_TO_DRAFT_PRIVILEGE = true;
        }
        else {
            _record.RESET_TO_DRAFT_PRIVILEGE = false;
        }

        //if ((_record.STATUS_ID == 0 || _record.STATUS_ID == 1) && (_standard_role_id == 16 || _standard_role_id == 17 || _standard_role_id == 18)) {
        //    $scope.CASHUP_CLOSE_PRIVILEGE = true;
        //}
        //else {
        //    $scope.CASHUP_CLOSE_PRIVILEGE = false;
        //}
    }



    $scope.SITES_APPLY_ALL_Fn = function (SITE_COUNT) {
        $scope.SiteSearch.SelectAllSites = true;
        if (SITE_COUNT == $scope.FILTERED_SITES_LIST.length) {
            $scope.SiteSearch.SelectAllSites = false;
            $scope.$parent.ShowAlertBox("Success", "All sites deselected", 3000);
        }
        angular.forEach($scope.FILTERED_SITES_LIST, function (site) {
            site.IS_SELECTED = $scope.SiteSearch.SelectAllSites;
        });
        $scope.register_Search.BRANCH_IDS = $scope.FILTERED_SITES_LIST
            .filter(site => site.IS_SELECTED)  // Filter sites where IS_SELECTED is true
            .map(site => site.BRANCH_ID)       // Extract BRANCH_IDs
            .join(',');
        if ($scope.register_Search.START_DATE != null && $scope.register_Search.START_DATE != undefined && $scope.register_Search.END_DATE != null && $scope.register_Search.START_DATE != undefined) {
            $scope.GET_CASHUP_REGISTER(1)
        }
        
    };

    
    $scope.GET_CASHUP_BASIC_SETUP = function (Sites) {
        var CashupModelObj = {
            CUSTOMER_ID: $scope.register_Search.CUSTOMER_ID,
            ENTITY_ID: $scope.register_Search.ENTITY_ID
        };
        PrcCommMethods.CASHUP_APP_API(CashupModelObj, 'GET_CASHUP_TYPE').then(function (data) {
            if (data.data) {
                $scope.CashupTypeData = data.data;
                Sites.forEach(function (site) {

                    var matchedData = $scope.CashupTypeData.Table.find(function (cashup) {
                        return cashup.BRANCH_ID === site.BRANCH_ID;
                    });

                    if (matchedData) {
                        site.CASHUP_TYPE = matchedData.CASHUP_TYPE;
                        site.CASHUP_TYPE_MSTR_ID = matchedData.CASHUP_TYPE_MSTR_ID;
                        site.WILl_USE_IN_CASHUP = true;
                    }
                    else {
                        site.WILl_USE_IN_CASHUP = false;
                    }

                });
                Sites = Sites.filter(_site => _site.WILl_USE_IN_CASHUP == true);
                $scope.FILTERED_SITES_LIST = Sites;
                if ($scope.FILTERED_SITES_LIST && $scope.FILTERED_SITES_LIST.length > 0) {
                    $scope.SITES_APPLY_ALL_Fn(0);
                    $scope.CASHUP_PRIVILEGE = true;
                }
                else {
                    $scope.CASHUP_PRIVILEGE = false;
                }
            } else {
                $scope.CASHUP_PRIVILEGE = false;
            }
        }).catch(function (error) {
            $scope.CASHUP_PRIVILEGE = false;
        });
    }

    $scope.GET_PRIVILEGE = function () {
        if ($scope.$parent.$parent.CHECK_CASHUP_PRIVILEGE($scope.CAHSUP_PRIVILEGE_ID)) {
            $scope.FILTERED_SITES_LIST = $scope.$parent.$parent.CHECK_CASHUP_USER_PRIVILEGE($scope.CAHSUP_PRIVILEGE_ID, parseInt($cookies.get("ENTITY_ID")));
            if ($scope.FILTERED_SITES_LIST && $scope.FILTERED_SITES_LIST.length > 0) {
                $scope.FILTERED_SITES_LIST[0].IS_SELECTED = true;
                $scope.FILTER_Fn($scope.FILTERED_SITES_LIST[0]);
                $scope.GET_CASHUP_BASIC_SETUP($scope.FILTERED_SITES_LIST);
            }
            else {
                $scope.CASHUP_PRIVILEGE = false;
            }
        }
        else {
            $scope.CASHUP_PRIVILEGE = false;
        }
    };

    $scope.GET_PRIVILEGE();

    $scope.EXPORT_CAHSUP_RECORD_LIST = function (_param_export_flag) {
        var UserModelObj = new Object();
        UserModelObj.ENTITY_ID = $scope.register_Search.ENTITY_ID;
        UserModelObj.USER_ID = $cookies.get("USERID");
        UserModelObj.MODULE_ID = $cookies.get("MODULE_ID");
        UserModelObj.CASHUP_DATE = $scope.register_Search.CASHUP_DATE ? $scope.register_Search.CASHUP_DATE : null;
        UserModelObj.MODIFIED_DATE = $scope.register_Search.MODIFIED_DATE ? $scope.register_Search.MODIFIED_DATE : null;
        UserModelObj.STATUS_IDS = $scope.register_Search.STATUS_IDS ? $scope.register_Search.STATUS_IDS : null;
        UserModelObj.BRANCH_IDS = $scope.register_Search.BRANCH_IDS ? $scope.register_Search.BRANCH_IDS : null;
        UserModelObj.APPROVER_NAME = $scope.register_Search.APPROVER_NAME ? $scope.register_Search.APPROVER_NAME : null;
        UserModelObj.PAGE_NO = 0;
        UserModelObj.PAGE_SIZE = 0;
        UserModelObj.SORT_COLUMN_NO = $scope.register_Search.SORT_COLUMN_NO ? $scope.register_Search.SORT_COLUMN_NO : 1;
        UserModelObj.SORT_ORDER_NO = $scope.register_Search.SORT_ORDER_NO ? $scope.register_Search.SORT_ORDER_NO : 1;

        UserModelObj.CASHUP_REPORT_TYPE = 20;
        UserModelObj.EXPORT_FLAG = _param_export_flag;
        UserModelObj.FILE_PATH = "/CUSTOMER_" + $scope.register_Search.ENTITY_ID + "/" + "USER_ID_" + /*6*/ $scope.register_Search.USER_ID + "/" + (_param_export_flag == 1 ? "CSV" : "XLSX") + "/";
        UserModelObj.FILE_NAME = "Cashup Records";
        
        PrcCommMethods.CASHUP_APP_API(UserModelObj, 'EXPORT_CASHUP_REPORTS').then(function (data) {
            if (data.data != null) {
                $scope.SERVER_FILE_PATH = '/' + data.data.FOLDER_NAME + data.data.RETURN_FILE_NAME;
                $scope.FILE_NAME = UserModelObj.FILE_NAME;
                window.location.href = $scope.SERVER_FILE_PATH;
                //alert("Export Successfull.");
            } else {
                alert("Export failed. Please try again.");
            }
        });
    }
    $scope.RESET_AREA = function () {
        $scope.$parent.SELECTED_AREA = null;
        $scope.$parent.CASHUP_ENTRY_SEARCH.AREA_ID = 0;
    };
    $scope.SELECT_AREA = function (_area) {
        $scope.$parent.SELECTED_AREA = _area.AREA_NAME;
        $scope.SELECTED_AREA = _area.AREA_NAME;
        $scope.$parent.CASHUP_ENTRY_SEARCH.AREA_ID = _area.AREA_ID;
    };
    $scope.SELECT_SESSION = function (_session) {
        $scope.$parent.SELECTED_SESSION = _session.SESSION_NAME;
        $scope.$parent.CASHUP_ENTRY_SEARCH.SESSION_ID = _session.SESSION_MAPPING_ID;
    }
    
    $scope.REDIRECT_CASHUP_ENTRY = function () {
        $scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID = null;
        $scope.$parent.CASHUP_ENTRY_SEARCH.AREA_ID = null;
        $scope.$parent.CASHUP_ENTRY_SEARCH.SESSION_ID = null;
        $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_DATE = null;
        $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_ID = null;
        $scope.$parent.CASHUP_ENTRY_SEARCH.FILTERED_SITES_LIST = [];
        $scope.$parent.CASHUP_ENTRY_SEARCH.STANDARD_ROLE_ID = null;
        $scope.$parent.CASHUP_ENTRY_SEARCH.IS_DATA_ENTRY_ENABLED = false;
        $scope.$parent.CASHUP_ENTRY_SEARCH.IS_SUBMIT_BUTTON = false;
        $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_APPROVAL = false;
        $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_LIST = [];
        $scope.$parent.SELECTED_SITE = null;
        $scope.$parent.SELECTED_AREA = null;
        $scope.$parent.SELECTED_SESSION = null;
        $scope.$parent.CASHUP_BY_AREA = null;
        $scope.$parent.CASHUP_DATE = null;
        $location.path('CashUpApp_Entry');
    }
    
    $scope.EDIT_CASHUP_REGISTER = function (_record,_param_edit_flag) {
        
        $scope.SELECTED_RECORD = _record;
        $scope.$parent.SELECTED_AREA = null;
        $scope.SELECTED_AREA = null;
        $scope.$parent.SELECTED_SESSION = null;
        $scope.$parent.CASHUP_ENTRY_SEARCH.AREA_ID = null;
        $scope.$parent.CASHUP_ENTRY_SEARCH.SESSION_ID = null;
        cashup_type_mstr_id = $scope.FILTERED_SITES_LIST.filter(sl => sl.BRANCH_ID == _record.BRANCH_ID)[0].CASHUP_TYPE_MSTR_ID;
        $scope.$parent.CASHUP_ENTRY_SEARCH.STANDARD_ROLE_ID = $scope.FILTERED_SITES_LIST.filter(sl => sl.BRANCH_ID == _record.BRANCH_ID)[0].STANDARD_ROLE_ID;

        $scope.CASHUP_ENTRY_PRIVILEGE_ID = '1162';
        var CASHUP_ENTRY_PRIVILEGE = $scope.FILTERED_SITES_LIST.filter(sl => sl.BRANCH_ID == _record.BRANCH_ID)[0].USER_PRIVILEGE_IDS.includes($scope.CASHUP_ENTRY_PRIVILEGE_ID);
        if (CASHUP_ENTRY_PRIVILEGE == false) {
            $scope.$parent.ShowAlertBox('Error', `You don't have access to Cashup Entry for the Site: ` + _record.BRANCH_NAME);
            return;
        }
        //var privilege_ids = $scope.FILTERED_SITES_LIST.filter(sl => sl.BRANCH_ID == _record.BRANCH_ID)[0].USER_PRIVILEGE_IDS.split(",");
        //if ("1163" in privilege_ids) {
        //    $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_APPROVAL = true;
        //}
        //else {
        //    $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_APPROVAL = false;
        //}
        //if (cashup_type_mstr_id == 1) {
        //    $scope.CASHUP_BY_SESSION = true;
        //    $scope.CASHUP_BY_AREA = true;
        //    $scope.$parent.CASHUP_BY_AREA = true;
        //    $scope.ADMIN_GET_AREA(_record.BRANCH_ID);
        //}
        //else if (cashup_type_mstr_id == 2) {
        //    $scope.CASHUP_BY_AREA = false;
        //    $scope.$parent.CASHUP_BY_AREA = false;
        //    $scope.CASHUP_BY_SESSION = true;
        //    $scope.SELECTED_AREA = null;
        //    $scope.$parent.SELECTED_AREA = null;
        //}
        //else {
        //    $scope.CASHUP_BY_SESSION = true;
        //    $scope.CASHUP_BY_AREA = true;
        //    $scope.$parent.CASHUP_BY_AREA = true;
        //    $scope.ADMIN_GET_AREA(_record.BRANCH_ID);
        //}
        //$scope.ADMIN_GET_CU_SESSION_MAPPING_Fn(_record.BRANCH_ID);
        $scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID = _record.BRANCH_ID;
        $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_DATE = moment(_record.CASHUP_DATE).format($scope.$parent.CONVERSION_DATE_FORMAT);
        //$scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_DATE = _record.CASHUP_DATE;
        $scope.$parent.SELECTED_SITE = _record.BRANCH_NAME;
        $scope.GET_CASHUP_INTEGRATION_FOR_EPOS_UPLOAD();
        $scope.$parent.CASHUP_DATE = $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_DATE;
        $scope.INS_CASHUP_HEADER(1);
        var myModal = new bootstrap.Modal(document.getElementById('Select_Cashup_details_reg'), {
            keyboard: false
        });
        myModal.show();
    };
    $scope.RESET_TO_DRAFT = function (_row) {

    }
    $scope.RESET_CASHUP_REGISTER = function () {
        startDate = moment().startOf('month');
        endDate = moment().endOf('month');
        $scope.register_Search = {
            CUSTOMER_ID: $cookies.get("CUSTOMER_ID"),
            USER_ID: $cookies.get("USERID"),
            ENTITY_ID: $cookies.get("ENTITY_ID"),
            MODULE_ID: $cookies.get("MODULE_ID"),
            START_DATE: startDate.format('YYYY-MM-DD'),
            END_DATE: endDate.format('YYYY-MM-DD'),
            STATUS_IDS: "",
            BRANCH_IDS: "",
            APPROVER_NAME: null,
            PAGE_NO: 1,
            PAGE_SIZE: 20,
            SORT_COLUMN_NO: 1,
            SORT_ORDER_NO: 1,
            STATUS_NAME: null,
        };
        
        $scope.$parent.SetUpDateRangeMultiDatePicker('reportrange', startDate, endDate, reportrange);
        $('#reportrange span').html(startDate.format($scope.$parent.Datelocaleformat.format) + ' - ' + endDate.format($scope.$parent.Datelocaleformat.format));
        
        //$scope.ADMIN_GET_BRANCH_LIST();
        //$scope.STATUS_LIST = [];
        //$scope.FILTERED_SITES_LIST = [];
        //$scope.SITES_LIST = [];
        //$scope.CASHUP_RECORDS = [];
        //$scope.register_Search.STATUS_NAME = null;
        //$scope.STATUS_LIST = angular.copy($scope.STATUS_LIST);
        //$scope.SELECT_STATUS();
        //console.log("Status List", $scope.STATUS_LIST);
        //$scope.GET_CASHUP_REGISTER(1);
        $scope.SITES_APPLY_ALL_Fn(0);
    };

    //-------------------------------------------------------TOGGLE FUNCTION DONE--------------------------------------------------------------

    //-------------------------------------------------------INS UPD FUNCTIONS DONE------------------------------------------------------------


    $scope.START_DAY_OF_WEEK = 1;
    $scope.addDays = function (date, days) { date.setDate(date.getDate() + days); return date; }
    $scope.set_week_picker = function (date, FLAG) {
        $scope.start_date = new Date(date.getFullYear(), date.getMonth(), parseInt($scope.START_DAY_OF_WEEK) + date.getDate() - date.getDay());//new Date(date.getFullYear(), date.getMonth(), 1 + date.getDate() - date.getDay());
        $scope.end_date = new Date(date.getFullYear(), date.getMonth(), parseInt($scope.START_DAY_OF_WEEK) + date.getDate() - date.getDay() + 6); //new Date(date.getFullYear(), date.getMonth(), $scope.start_date.getDate() + (6));
        if ($scope.start_date > date) {
            if (FLAG == 1) {
                var increasedays = $scope.start_date.getDate() - date.getDate();
                $scope.start_date = new Date(date.getFullYear(), date.getMonth(), $scope.start_date.getDate() - ((7 - increasedays) + increasedays));
                //  $scope.end_date = new Date(date.getFullYear(), date.getMonth(), $scope.start_date.getDate() + (6));
                $scope.end_date = $scope.addDays(new Date($scope.start_date), 6);
            }
        }
        var StartDD = $scope.start_date.getDate();
        var Startmm = $scope.start_date.getMonth() + 1;
        var start_dateyyyy = $scope.start_date.getFullYear();

        var EndDD = $scope.end_date.getDate();
        var Endmm = $scope.end_date.getMonth() + 1;
        var Endyyyy = $scope.end_date.getFullYear();

        if (StartDD < 10) { StartDD = '0' + StartDD; }
        if (Startmm < 10) { Startmm = '0' + Startmm; }
        var start_dateddmmyy = StartDD + '/' + Startmm + '/' + start_dateyyyy;

        if (EndDD < 10) { EndDD = '0' + EndDD; }
        if (Endmm < 10) { Endmm = '0' + Endmm; }
        var end_dateddmmyy = EndDD + '/' + Endmm + '/' + Endyyyy;

        $scope.weekpicker.datepicker('update', $scope.start_date); //(($scope.start_date.getMonth() + 1) + '/' + $scope.start_date.getDate() + '/' + $scope.start_date.getFullYear() + ' - ' + ($scope.end_date.getMonth() + 1) + '/' + $scope.end_date.getDate() + '/' + $scope.end_date.getFullYear()));
        $scope.weekpicker.val(start_dateddmmyy + ' - ' + end_dateddmmyy);

        $scope.START_DATE = $scope.start_date;
        $scope.END_DATE = $scope.end_date;
        // $scope.WEEK_NO = weekYear($scope.start_date);
        if (!$scope.$$phase) { $scope.$apply(); }
    };
    $scope.DATE_WEEK_PICKER = function (date, FLAG) {
        $scope.weekpicker = $('.week-picker');
        $scope.weekpicker.datepicker({
            weekStart: parseInt($scope.START_DAY_OF_WEEK),
            autoclose: true,
            forceParse: false,
            todayHighlight: true,
            container: '#week-picker-wrapper',
            calendarWeeks: true,

        }).on("changeDate", function (e) {
            $scope.set_week_picker(e.date);
        });
        $('.week-prev').on('click', function () {
            var prev = new Date($scope.start_date.getTime());
            prev.setDate(prev.getDate() - 6);
            $scope.set_week_picker(prev);
        });
        $('.week-next').on('click', function () {
            var next = new Date($scope.end_date.getTime());
            next.setDate(next.getDate() + 1);
            $scope.set_week_picker(next);
        });
        $scope.set_week_picker(date, FLAG != undefined ? 2 : 1);
    };
    var _day = $scope.addDays(new Date(), 0);
    $scope.DATE_WEEK_PICKER(_day, 1);
    $scope.dateinput = function (index) {
        $(document).ready(function () {
            var date_inputs = document.getElementsByClassName("dateinput") //our date input has the name "date"
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

                    })
                }
            }
        });
    }
    $scope.dateinput(1);
    $scope.ADMIN_GET_BRANCH_LIST();

    

    $scope.INS_CASHUP_HEADER = function (flag) {
        if (flag == null || flag == undefined) {
            $scope.RegSelectCashupDetailsForm.submitted = true;
        }
        else {
            $scope.RegSelectCashupDetailsForm.submitted = false;
        }
        if ($scope.RegSelectCashupDetailsForm.$valid || flag == 1) {

            var CashupAppModelObj = new Object();
            CashupAppModelObj.CASHUP_MAIN_ID = 0;
            //CashupAppModelObj.CASHUP_DATE = moment($scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_DATE).format($scope.$parent.DB_DATE_FORMAT);
            CashupAppModelObj.CASHUP_DATE = moment($scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).format($scope.$parent.DB_DATE_FORMAT);
            CashupAppModelObj.BRANCH_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID;
            CashupAppModelObj.USER_ID = parseInt($cookies.get("USERID"));
            CashupAppModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'INS_CASHUP_HEADER').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.RegSelectCashupDetailsForm.submitted = false;
                    $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_LIST = data.data.Table;
                    if (flag == 1) {
                        $scope.$parent.CASHUP_REVIEW();
                        const areaMap = {};
                        const sessionMap = {};
                        angular.forEach($scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_LIST, function (item) {
                            const areaKey = item.AREA_ID;
                            if (areaKey != null && !areaMap[areaKey]) { // If we haven't seen this area ID before...
                                areaMap[areaKey] = {
                                    AREA_ID: item.AREA_ID,
                                    AREA_NAME: item.AREA_NAME
                                };
                            }
                            const sessionKey = item.SESSION_MAPPING_ID;
                            if (!sessionMap[sessionKey]) { // If we haven't seen this session ID before...
                                sessionMap[sessionKey] = {
                                    SESSION_MAPPING_ID: item.SESSION_MAPPING_ID,
                                    SESSION_NAME: item.SESSION_NAME,
                                    SORT_ORDER: item.SORT_ORDER
                                };
                            }


                        });
                        $scope.AREA_LIST = Object.values(areaMap);
                        $scope.SESSION_LIST = Object.values(sessionMap);

                        if ($scope.AREA_LIST.length == 0) {
                            $scope.CASHUP_BY_AREA = false;
                            $scope.$parent.SELECTED_AREA = null;
                            $scope.$parent.CASHUP_BY_AREA = false;
                            $scope.CASHUP_BY_SESSION = true;
                        }
                        else {
                            $scope.CASHUP_BY_SESSION = true;
                            $scope.CASHUP_BY_AREA = true;
                            $scope.$parent.CASHUP_BY_AREA = true;
                        }
                    }
                    if (flag == null || flag == undefined) {
                        if (($scope.SELECTED_AREA == null || $scope.SELECTED_AREA == undefined) && (($scope.SELECTED_SESSION != null) && ($scope.SELECTED_SESSION != undefined))) {
                            $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_ID = data.data.Table.filter(item => item.SESSION_MAPPING_ID === $scope.$parent.CASHUP_ENTRY_SEARCH.SESSION_ID).map(item => item.CASHUP_HEADER_ID)[0];
                            $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_MAIN_ID = data.data.Table.filter(item => item.SESSION_MAPPING_ID === $scope.$parent.CASHUP_ENTRY_SEARCH.SESSION_ID).map(item => item.CASHUP_MAIN_ID)[0];
                        }
                        else if (($scope.SELECTED_SESSION == null || $scope.SELECTED_SESSION == undefined) && (($scope.SELECTED_AREA != null) && ($scope.SELECTED_AREA != undefined))) {
                            $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_ID = data.data.Table.filter(item => item.AREA_ID === $scope.$parent.CASHUP_ENTRY_SEARCH.AREA_ID).map(item => item.CASHUP_HEADER_ID)[0];
                            $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_MAIN_ID = data.data.Table.filter(item => item.AREA_ID === $scope.$parent.CASHUP_ENTRY_SEARCH.AREA_ID).map(item => item.CASHUP_MAIN_ID)[0];
                        }
                        else if ($scope.SELECTED_SESSION != null && $scope.SELECTED_SESSION != undefined && $scope.SELECTED_AREA != null && $scope.SELECTED_AREA != undefined) {
                            $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_ID = data.data.Table.filter(item => item.AREA_ID === $scope.$parent.CASHUP_ENTRY_SEARCH.AREA_ID && item.SESSION_MAPPING_ID === $scope.$parent.CASHUP_ENTRY_SEARCH.SESSION_ID).map(item => item.CASHUP_HEADER_ID)[0];
                            $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_MAIN_ID = data.data.Table.filter(item => item.AREA_ID === $scope.$parent.CASHUP_ENTRY_SEARCH.AREA_ID && item.SESSION_MAPPING_ID === $scope.$parent.CASHUP_ENTRY_SEARCH.SESSION_ID).map(item => item.CASHUP_MAIN_ID)[0];
                        }
                        if ($scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_ID == undefined || $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_ID == null || $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_MAIN_ID == undefined || $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_MAIN_ID == null) {
                            $scope.$parent.ShowAlertBox('Error', "Something went wrong.");
                        }
                        else {
                            var modalElement = document.getElementById('Select_Cashup_details_reg');
                            var modalInstance = bootstrap.Modal.getInstance(modalElement);
                            modalInstance.hide();
                            $scope.$parent.REDIRECT_REGISTER_ENTRY = true;
                            $scope.CALL_FUNCTIONS_TAB_WISE($scope.$parent.STEP_NO);
                            $location.path('CashUpApp_Entry');//.search({ 'CASHUP_MAIN_ID': _record.CASHUP_MAIN_ID,'CASHUP_HEADER_ID'});
                        }
                    }
                }
                else {
                    $scope.AREA_LIST = [];
                    $scope.SESSION_LIST = [];
                    $scope.CASHUP_BY_AREA = false;
                    $scope.$parent.SELECTED_AREA = null;
                    $scope.$parent.CASHUP_BY_AREA = false;
                    $scope.CASHUP_BY_SESSION = false;
                    $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_LIST = [];
                }
            });
        }
    }

    $scope.UPD_CASHUP_RESET_TO_DRAFT = function (_record) {
        var CashupAppModelObj = new Object();
        CashupAppModelObj.CASHUP_MAIN_ID = _record.CASHUP_MAIN_ID;
        PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'UPD_CASHUP_RESET_TO_DRAFT').then(function (data) {
            if (data.data != 0) {
                $scope.GET_CASHUP_REGISTER(1);
                $scope.$parent.ShowAlertBox("Success", "Success!", 3000);
            }
            else {
                $scope.$parent.ShowAlertBox("Error", "Something went wrong!", 3000);
            }
        });
    }
    $scope.$on('$destroy', function () {
        $('.modal.show').modal('hide');
    });
});