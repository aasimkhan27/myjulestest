app.controller('EPOSEntryController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    //$scope.$parent.DISPLAY_FLAG = false;
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(2);
    //$scope.CASHUP_COMMON_CODE_Fn();
    $scope.$parent.CASHUP_COMMON_RESET_Fn();
    $scope.EPOS_ENTRY_SEARCH = {
        CUSTOMER_ID: parseInt($cookies.get("CUSTOMER_ID")),
        ENTITY_ID: parseInt($cookies.get("ENTITY_ID")),
        USER_ID: parseInt($cookies.get("USERID")),
        SELECTED_SITE: null,
        BRANCH_IDS: "",
        START_DATE: null,
        END_DATE: null,
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        DATA_ENTRY_ENABLED: false
    }
    $scope.EPOS_UPLOAD_Obj = {
        CUSTOMER_ID: parseInt($cookies.get("CUSTOMER_ID")),
        ENTITY_ID: parseInt($cookies.get("ENTITY_ID")),
        USER_ID: parseInt($cookies.get("USERID")),
        SELECTED_SITE: null,
        CASHUP_DATE: null,
        SELECTED_AREA: null,
        SELECTED_SESSION: null,
        UploadedFiles: [],
        CASHUP_HEADER_ID: null,
        CASHUP_MAIN_ID: null,
        SESSION_START: null,
        SESSION_END: null,
        INTEGRATION_SYSTEM_ID: null,
        SYSTEM_NAME: null
    }
    $scope.FILTERED_SITES_LIST = [];
    $scope.EPOS_ENTRY_LIST = [];
    $scope.GetData = true;
    $scope.SiteSearch = {};
    $scope.CAHSUP_PRIVILEGE_ID = "1167";
    $scope.CASHUP_PRIVILEGE = true;
    $scope.AREA_LIST = [];
    $scope.SESSION_LIST = [];
    //////////////////////////////DATE RANGE PICKER FUN STARTS///////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////

    
    $scope.dateinputddmmyy = function (index) {

        $(document).ready(function () {
            var date_inputs = document.getElementsByClassName("dateinputddmmyy") //our date input has the name "date"
            if (date_inputs.length > 0) {
                for (var i = 0; i < date_inputs.length; i++) {
                    var date_input = $('input[name="' + date_inputs[i].name + '"]'); //our date input has the name "date"
                    var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
                    var today = new Date();
                    var options = {
                        todayBtn: "linked",
                        daysOfWeekHighlighted: "0,6",
                        autoclose: true,
                        todayHighlight: false,
                        format: 'yyyy-mm-dd',//,$scope.$parent.CALENDAR_DATE_FORMAT
                        format: $scope.$parent.CALENDAR_DATE_FORMAT,
                        clearBtn: true,
                        closeBtn: true,
                        endDate:today
                    };
                    date_input.off("hide").datepicker(options).on("hide", function (e) {
                        $scope.INS_CASHUP_HEADER(1);
                    })
                }
            }
        });
    }
    $scope.dateinputddmmyy(1);


    //$scope.$parent.Datelocaleformat = { format: 'DD/MM/YYYY' };
    function reportrange(startDate, endDate) {
        $scope.EPOS_ENTRY_SEARCH.START_DATE = startDate.format($scope.$parent.DB_DATE_FORMAT);
        $scope.EPOS_ENTRY_SEARCH.END_DATE = endDate.format($scope.$parent.DB_DATE_FORMAT);
        $('#reportrange span').html(startDate.format($scope.$parent.DATE_RANGE_FORMAT) + ' - ' + endDate.format($scope.$parent.DATE_RANGE_FORMAT));
        if ($scope.EPOS_ENTRY_SEARCH.SELECTED_SITE != null && $scope.EPOS_ENTRY_SEARCH.SELECTED_SITE != undefined) {
            $scope.GET_DATA_UPLOAD_EPOS_ENTRY();
        }
    }
    $(function () {

        startDate = new moment().add(0, 'months').date(1);//new moment().subtract(1, 'months').date(1); //moment().add('months', 1).date(0);//moment().startOf('month');   //moment().startOf('isoWeek');//moment().subtract(6, 'days');
        //console.log("SD", startDate);
        endDate = moment().endOf('month'); //moment().subtract(0, 'days');
        //console.log("ED", endDate);
        $scope.$parent.SetUpDateRangeMultiDatePicker('reportrange', startDate, endDate, reportrange);
        $('#reportrange span').html(startDate.format($scope.$parent.DATE_RANGE_FORMAT) + ' - ' + endDate.format($scope.$parent.DATE_RANGE_FORMAT));
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






    //////////////////////////////  DATE RANGE PICKER FUN ENDS ///////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////
    $scope.GET_CASHUP_INTEGRATION_FOR_EPOS_UPLOAD = function () {
        var CashupAppModelObj = new Object();
        CashupAppModelObj.ENTITY_ID = $scope.EPOS_UPLOAD_Obj.ENTITY_ID;
        CashupAppModelObj.BRANCH_ID = $scope.EPOS_UPLOAD_Obj.SELECTED_SITE.BRANCH_ID;
        PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'GET_CASHUP_INTEGRATION_FOR_EPOS_UPLOAD').then(function (data) {
            if (data.data != null && data.data != undefined && data.data.Table.length > 0) {
                
                $scope.EPOS_UPLOAD_Obj.INTEGRATION_SYSTEM_ID = data.data.Table[0].INTEGRATION_SYSTEM_ID;
                $scope.EPOS_UPLOAD_Obj.SYSTEM_NAME = data.data.Table[0].SYSTEM_NAME;
                

            }
            else {
                $scope.CASHUP_ENTRY_SEARCH.INTEGRATION_SYSTEM_ID = null;
                $scope.CASHUP_ENTRY_SEARCH.SYSTEM_NAME = null;
            }
        });
    }

    $scope.GET_CASHUP_ENTRY_HEADER = function (_cashup_header_id) {
        var CashupAppModelObj = new Object();
        CashupAppModelObj.CASHUP_HEADER_ID = _cashup_header_id;
        PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'GET_CASHUP_ENTRY_HEADER').then(function (data) {
            if (data.data.Table1.length > 0) {
                $scope.EPOS_UPLOAD_Obj.SESSION_START = data.data.Table1[0].SESSION_START;
                $scope.EPOS_UPLOAD_Obj.SESSION_END = data.data.Table1[0].SESSION_END;
            }

            else {
                $scope.EPOS_UPLOAD_Obj.SESSION_START = null;
                $scope.EPOS_UPLOAD_Obj.SESSION_END = null;
            }
        });
    }

    $scope.GET_DATA_UPLOAD_EPOS_ENTRY = function (flag) {
        if (flag == null || flag == undefined) {
            $scope.EPOS_ENTRY_SEARCH.PAGE_NO = 1;
            $scope.GetData = true;
        }

        var CashupAppModelObj = new Object();
        CashupAppModelObj.TABLE_ID_LIST = [];

        var readonly = new Object();
        readonly.TABLE_ID = $scope.EPOS_ENTRY_SEARCH.SELECTED_SITE.BRANCH_ID;
        CashupAppModelObj.TABLE_ID_LIST.push(readonly);
        CashupAppModelObj.START_DATE = $scope.EPOS_ENTRY_SEARCH.START_DATE;
        CashupAppModelObj.END_DATE = $scope.EPOS_ENTRY_SEARCH.END_DATE;
        CashupAppModelObj.PAGE_NO = $scope.EPOS_ENTRY_SEARCH.PAGE_NO;
        CashupAppModelObj.PAGE_SIZE = $scope.EPOS_ENTRY_SEARCH.PAGE_SIZE;
        
        PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'GET_DATA_UPLOAD_EPOS_ENTRY').then(function (data) {
            if (data.data.Table.length > 0) {

                if (flag == null || flag == undefined) {
                    $scope.EPOS_ENTRY_LIST = data.data.Table;
                }
                else if (flag == 1) {
                    $scope.EPOS_ENTRY_LIST = $scope.EPOS_ENTRY_LIST.concat(data.data.Table);
                }
                if (data.data.Table.length < $scope.EPOS_ENTRY_SEARCH.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.EPOS_ENTRY_SEARCH.PAGE_NO = parseInt($scope.EPOS_ENTRY_SEARCH.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else if ($scope.EPOS_ENTRY_SEARCH.PAGE_NO > 1 && data.data.Table.length == 0) {
                $scope.GetData = false;
            }
            else if ($scope.EPOS_ENTRY_SEARCH.PAGE_NO == 1 && data.data.Table.length == 0) {
                $scope.EPOS_ENTRY_LIST = [];
                $scope.LOAD_FETCH_TEXT = 'No Records Found !';
            }
        });
    }

    $scope.ADMIN_GET_AREA = function (_branchID) {
        var AreaModelObj = new Object();
        AreaModelObj.CUSTOMER_ID = $scope.EPOS_UPLOAD_Obj.CUSTOMER_ID;
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
    //////////////////////////////  BRANCH DROPDOWN FUN STARTS ///////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////
    $scope.SELECT_SITE_FOR_UPLOAD = function (site) {
        $scope.EPOS_UPLOAD_Obj.SELECTED_SITE = site;
        //$scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID = site.BRANCH_ID;
        $scope.GET_CASHUP_INTEGRATION_FOR_EPOS_UPLOAD();
        $scope.INS_CASHUP_HEADER(1);
    }
    
    $scope.RESET_EPOS_ENTRY_SEARCH = function () {
        $scope.EPOS_ENTRY_SEARCH.START_DATE = moment().startOf('month').format($scope.$parent.DB_DATE_FORMAT);
        $scope.EPOS_ENTRY_SEARCH.END_DATE = moment().endOf('month').format($scope.$parent.DB_DATE_FORMAT);
        $scope.selectSite($scope.FILTERED_SITES_LIST[0], 1);
        $scope.$parent.SetUpDateRangeMultiDatePicker('reportrange', startDate, endDate, reportrange);
        $('#reportrange span').html(startDate.format($scope.$parent.DATE_RANGE_FORMAT) + ' - ' + endDate.format($scope.$parent.DATE_RANGE_FORMAT));
    }

    $scope.selectSite = function (site, flag) {
        $scope.EPOS_ENTRY_SEARCH.SELECTED_SITE = site;
        $scope.SELECT_SITE_FOR_UPLOAD(site);        
        if (site.STANDARD_ROLE_ID == 16 || site.STANDARD_ROLE_ID == 17 || site.STANDARD_ROLE_ID == 18) {
            $scope.EPOS_ENTRY_SEARCH.DATA_ENTRY_ENABLED = true;
        }
        else {
            $scope.EPOS_ENTRY_SEARCH.DATA_ENTRY_ENABLED = false;
        }
        if (flag == null || flag == undefined) {
            $scope.GET_DATA_UPLOAD_EPOS_ENTRY();
        }
    }

    $scope.GET_CASHUP_TYPE = function (Sites) {
        var CashupModelObj = {
            CUSTOMER_ID: $scope.EPOS_ENTRY_SEARCH.CUSTOMER_ID,
            ENTITY_ID: $scope.EPOS_ENTRY_SEARCH.ENTITY_ID
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
                    $scope.FILTERED_SITES_LIST[0].IS_SELECTED = true;
                    $scope.selectSite($scope.FILTERED_SITES_LIST[0]); //change
                    $scope.CASHUP_PRIVILEGE = true;
                }
                else {
                    $scope.CASHUP_PRIVILEGE = false;
                }
                $scope.selectSite(Sites[0]);
            } else {
                $scope.CASHUP_PRIVILEGE = false;
            }
        }).catch(function (error) {
            $scope.CASHUP_PRIVILEGE = false;
        });
    }
    

    //$scope.GET_PRIVILEGE = function () {
    //    if ($scope.$parent.$parent.CHECK_CASHUP_PRIVILEGE($scope.CAHSUP_PRIVILEGE_ID)) {
    //        $scope.FILTERED_SITES_LIST = $scope.$parent.$parent.CHECK_CASHUP_USER_PRIVILEGE($scope.CAHSUP_PRIVILEGE_ID, parseInt($cookies.get("ENTITY_ID")));
    //        if ($scope.FILTERED_SITES_LIST && $scope.FILTERED_SITES_LIST.length > 0) {
    //            $scope.FILTERED_SITES_LIST[0].IS_SELECTED = true;
    //            $scope.FILTER_Fn($scope.FILTERED_SITES_LIST[0]);
    //            $scope.GET_CASHUP_TYPE($scope.FILTERED_SITES_LIST);
    //        }
    //        else {
    //            console.log("User does not have required PRIVILEGE_ID" + $scope.CAHSUP_PRIVILEGE_ID);
    //            $scope.CASHUP_PRIVILEGE = false;
    //        }
    //    }
    //    else {
    //        console.log("User does not have required PRIVILEGE_ID" + $scope.CAHSUP_PRIVILEGE_ID);
    //        $scope.CASHUP_PRIVILEGE = false;
    //    }
    //};

    $scope.GET_PRIVILEGE = function () {
        if ($scope.$parent.$parent.CHECK_CASHUP_PRIVILEGE($scope.CAHSUP_PRIVILEGE_ID)) {
            $scope.FILTERED_SITES_LIST = $scope.$parent.$parent.CHECK_CASHUP_USER_PRIVILEGE($scope.CAHSUP_PRIVILEGE_ID, parseInt($cookies.get("ENTITY_ID")));
            $scope.GET_CASHUP_TYPE($scope.FILTERED_SITES_LIST);

        }
        else {
            $scope.CASHUP_PRIVILEGE = false;
        }
    };
    $scope.GET_PRIVILEGE();
    //////////////////////////////   BRANCH DROPDOWN FUN ENDS  ///////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////

    
    

    $scope.RESET_AREA = function () {
        $scope.EPOS_UPLOAD_Obj.SELECTED_AREA = null;
        
    };

    $scope.RESET_SESSION = function () {
        $scope.EPOS_UPLOAD_Obj.SELECTED_SESSION = null;
        
    };

    $scope.SELECT_AREA = function (_area) {
        $scope.EPOS_UPLOAD_Obj.SELECTED_AREA = _area;
        $scope.INS_CASHUP_HEADER();
    };

    $scope.SELECT_SESSION = function (_session) {
        $scope.EPOS_UPLOAD_Obj.SELECTED_SESSION = _session;
        $scope.INS_CASHUP_HEADER();
    }

    $scope.attachFile = function ($files, List) {
        List.UploadedFiles = $files;
    }
    $scope.REMOVE_UPLOAD_Fn = function () {
        $scope.EPOS_UPLOAD_Obj.UploadedFiles = [];
        var fileInput = document.getElementById("ngexcelfile"); // Reset the file input
        if (fileInput) {
            fileInput.value = ""; // Clear the input field
        }
    }


    $scope.INS_CASHUP_HEADER = function (flag) {
        var CashupAppModelObj = new Object();
        CashupAppModelObj.CASHUP_MAIN_ID = 0;
        
        CashupAppModelObj.CASHUP_DATE = moment($scope.EPOS_UPLOAD_Obj.CASHUP_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).format($scope.$parent.DB_DATE_FORMAT);
        CashupAppModelObj.BRANCH_ID = $scope.EPOS_UPLOAD_Obj.SELECTED_SITE.BRANCH_ID;
        CashupAppModelObj.USER_ID = parseInt($cookies.get("USERID"));
        CashupAppModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'INS_CASHUP_HEADER').then(function (data) {
            if (data.data.Table.length > 0) {
                if (flag == 1) {
                    const areaMap = {};
                    const sessionMap = {};
                    angular.forEach(data.data.Table, function (item) {
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
                                SESSION_NAME: item.SESSION_NAME
                            };
                        }
                    });
                    $scope.AREA_LIST = Object.values(areaMap);
                    $scope.SESSION_LIST = Object.values(sessionMap);

                    if ($scope.AREA_LIST.length == 0) {
                        $scope.CASHUP_BY_AREA = false;
                        
                        $scope.CASHUP_BY_SESSION = true;
                    }
                    else {
                        $scope.CASHUP_BY_SESSION = true;
                        $scope.CASHUP_BY_AREA = true;
                       
                    }
                }
                if (flag == null || flag == undefined) {
                    if (($scope.EPOS_UPLOAD_Obj.SELECTED_AREA == null || $scope.EPOS_UPLOAD_Obj.SELECTED_AREA == undefined) && (($scope.EPOS_UPLOAD_Obj.SELECTED_SESSION != null) && ($scope.EPOS_UPLOAD_Obj.SELECTED_SESSION != undefined))) {
                        $scope.EPOS_UPLOAD_Obj.CASHUP_HEADER_ID = data.data.Table.filter(item => item.SESSION_MAPPING_ID === $scope.EPOS_UPLOAD_Obj.SELECTED_SESSION.SESSION_MAPPING_ID).map(item => item.CASHUP_HEADER_ID)[0];
                        $scope.EPOS_UPLOAD_Obj.CASHUP_MAIN_ID = data.data.Table.filter(item => item.SESSION_MAPPING_ID === $scope.EPOS_UPLOAD_Obj.SELECTED_SESSION.SESSION_MAPPING_ID).map(item => item.CASHUP_MAIN_ID)[0];
                    }
                    else if (($scope.EPOS_UPLOAD_Obj.SELECTED_SESSION == null || $scope.EPOS_UPLOAD_Obj.SELECTED_SESSION == undefined) && (($scope.EPOS_UPLOAD_Obj.SELECTED_AREA != null) && ($scope.EPOS_UPLOAD_Obj.SELECTED_AREA != undefined))) {
                        $scope.EPOS_UPLOAD_Obj.CASHUP_HEADER_ID = data.data.Table.filter(item => item.AREA_ID === $scope.EPOS_UPLOAD_Obj.SELECTED_AREA.AREA_ID).map(item => item.CASHUP_HEADER_ID)[0];
                        $scope.EPOS_UPLOAD_Obj.CASHUP_MAIN_ID = data.data.Table.filter(item => item.AREA_ID === $scope.EPOS_UPLOAD_Obj.SELECTED_AREA.AREA_ID).map(item => item.CASHUP_MAIN_ID)[0];
                    }
                    else if ($scope.EPOS_UPLOAD_Obj.SELECTED_SESSION != null && $scope.EPOS_UPLOAD_Obj.SELECTED_SESSION != undefined && $scope.EPOS_UPLOAD_Obj.SELECTED_AREA != null && $scope.EPOS_UPLOAD_Obj.SELECTED_AREA != undefined) {
                        $scope.EPOS_UPLOAD_Obj.CASHUP_HEADER_ID = data.data.Table.filter(item => item.AREA_ID === $scope.EPOS_UPLOAD_Obj.SELECTED_AREA.AREA_ID && item.SESSION_MAPPING_ID === $scope.EPOS_UPLOAD_Obj.SELECTED_SESSION.SESSION_MAPPING_ID).map(item => item.CASHUP_HEADER_ID)[0];
                        $scope.EPOS_UPLOAD_Obj.CASHUP_MAIN_ID = data.data.Table.filter(item => item.AREA_ID === $scope.EPOS_UPLOAD_Obj.SELECTED_AREA.AREA_ID && item.SESSION_MAPPING_ID === $scope.EPOS_UPLOAD_Obj.SELECTED_SESSION.SESSION_MAPPING_ID).map(item => item.CASHUP_MAIN_ID)[0];
                    }
                    $scope.GET_CASHUP_ENTRY_HEADER($scope.EPOS_UPLOAD_Obj.CASHUP_HEADER_ID);
                }
                //if ($scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_ID == undefined || $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_ID == null || $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_MAIN_ID == undefined || $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_MAIN_ID == null) {
                //    $scope.$parent.ShowAlertBox('Error', "Something went wrong.");
                //}
                
            }
            else {

                $scope.AREA_LIST = [];
                $scope.SESSION_LIST = [];
                $scope.CASHUP_BY_AREA = false;
                $scope.CASHUP_BY_SESSION = false;
                $scope.EPOS_UPLOAD_Obj.CASHUP_HEADER_ID = null;
                $scope.EPOS_UPLOAD_Obj.CASHUP_MAIN_ID = null;
            }
        });
    }

    $scope.EXPORT_EPOS_ENTRY = function (export_flag) {
        //var CashupAppModelObj = new Object();
        //CashupAppModelObj.EPOS_ENTRIES = $scope.EPOS_ENTRY_LIST;
        //CashupAppModelObj.EXPORT_FLAG = export_flag;
        //CashupAppModelObj.FILE_PATH = "/EPOS_ENTRY_" + "/CUSTOMER_" + $scope.EPOS_ENTRY_SEARCH.ENTITY_ID + "/" + "USER_ID_" + $scope.EPOS_ENTRY_SEARCH.USER_ID + "/" + (export_flag == 1 ? "CSV" : "XLSX") + "/";
        //CashupAppModelObj.FILE_NAME = "EPOS_Entry_Records";
        //PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'EXPORT_EPOS_ENTRY').then(function (data) {
        //    if (data.data != null) {
        //        $scope.SERVER_FILE_PATH = '/' + data.data.FOLDER_NAME + data.data.RETURN_FILE_NAME;
        //        $scope.FILE_NAME = CashupAppModelObj.FILE_NAME;
        //        window.location.href = $scope.SERVER_FILE_PATH;
        //    } else {
        //        alert("Export failed. Please try again.");
        //    }
        //});




        var CashupAppModelObj = new Object();
        CashupAppModelObj.TABLE_ID_LIST = [];
        var readonly = new Object();
        readonly.TABLE_ID = $scope.EPOS_ENTRY_SEARCH.SELECTED_SITE.BRANCH_ID;
        CashupAppModelObj.TABLE_ID_LIST.push(readonly);
        CashupAppModelObj.START_DATE = $scope.EPOS_ENTRY_SEARCH.START_DATE;
        CashupAppModelObj.END_DATE = $scope.EPOS_ENTRY_SEARCH.END_DATE;
        CashupAppModelObj.PAGE_NO = 0;
        CashupAppModelObj.PAGE_SIZE = 0;
        CashupAppModelObj.CASHUP_REPORT_TYPE = 13;
        CashupAppModelObj.EXPORT_FLAG = export_flag;
        CashupAppModelObj.FILE_PATH = "/EPOS_ENTRY_REPORT_" + "/CUSTOMER_" + $cookies.get('ENTITY_ID') + "/" + "USER_ID_" + $cookies.get('USERID') + "/" + (export_flag == 1 ? "CSV" : "XLSX") + "/";
        CashupAppModelObj.FILE_NAME = "Epos Entry Report";
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


    $scope.uploadFilesx = function (Attachment_UPLOAD_TYPE_ID, var1, var2, exceljson, filename, FLAG) {
        if (($scope.Files != undefined && $scope.Files.length > 0)) {
            $scope.DocImageResult = [];
            var data = new FormData();
            data.append("CASHUP_HEADER_ID", $scope.EPOS_UPLOAD_Obj.CASHUP_HEADER_ID);
            data.append("UPLOAD_TYPE_ID", Attachment_UPLOAD_TYPE_ID);
            data.append("VIRTUALPATH", parseInt($cookies.get("ENTITY_ID")) + '/' + Attachment_UPLOAD_TYPE_ID + '/' + $scope.EPOS_UPLOAD_Obj.INTEGRATION_SYSTEM_ID + '/');
            data.append("UPLOAD_ID", 0);
            data.append("USER_ID", parseInt($cookies.get("USERID")));
            data.append("TABLE", JSON.stringify(exceljson));
            data.append("ORIGINAL_FILE_NAME", filename);
            //data.append("USER_ID", ($cookies.get("USERID")));
            for (var i in $scope.Files) {
                data.append("uploadedFile", $scope.Files[i]);
            }

            var request = {
                method: 'POST',
                url: CommService.Get_CASHUP_API() + "api/CashupAppAPI/UPLOADFILES",
                data: data,
                headers: {
                    'Content-Type': undefined
                }
            };
            $http(request).then(function (d) {

                $scope.UploadedFiles = d.data;
                if ($scope.EPOS_UPLOAD_Obj.INTEGRATION_SYSTEM_ID == 0) {
                    FLAG == 1 ? $scope.DECLARATION_DETAILS_UPLOAD_FLAG = true : '';
                    FLAG == 2 ? $scope.PAYMENT_DETAILS_UPLOAD_FLAG = true : '';
                    FLAG == 3 ? $scope.DEPARTMENT_DETAILS_UPLOAD_FLAG = true : '';
                    if ($scope.DEPARTMENT_DETAILS_UPLOAD_FLAG && $scope.PAYMENT_DETAILS_UPLOAD_FLAG && $scope.DECLARATION_DETAILS_UPLOAD_FLAG) {
                        var CashupModelObj = new Object();
                        CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
                        CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
                        CashupModelObj.CASHUP_HEADER_ID = $scope.EPOS_UPLOAD_Obj.CASHUP_HEADER_ID;//23//24
                        CashupModelObj.SESSION_ID = $scope.EPOS_UPLOAD_Obj.SELECTED_SESSION.SESSION_MAPPING_ID; // $scope.SESSION_ID;              
                        CashupModelObj.DECLARATION_DETAILS = $scope.DECLARATION_DETAILS;
                        CashupModelObj.PAYMENT_DETAILS = $scope.PAYMENT_DETAILS;
                        CashupModelObj.SQUIRREL_INTEGRATION_DATA = $scope.DEPARTMENT_DETAILS;
                        PrcCommMethods.CASHUP_APP_API(CashupModelObj, "EPOS_FILE_UPLOAD_ITEMSALES_SQUIRREL").then(function (data) {
                            $scope.Uploading = false;
                            //alert('File Uploaded Succesfully');
                            $scope.$parent.ShowAlertBox('Success', 'File Uploaded Succesfully', 2000);

                            $scope.ItemSalesFileValid = true;
                            $scope.PaymentsFileValid = true;
                            $scope.DepartmentFileValid = true;

                            $scope.DECLARATION_DETAILS_UPLOAD_FLAG = false;
                            $scope.PAYMENT_DETAILS_UPLOAD_FLAG = false;
                            $scope.DEPARTMENT_DETAILS_UPLOAD_FLAG = false;

                            angular.element("input[id='ngexcelfile_Deartments_Squirrel']").val(null);
                            angular.element("input[id='ngexcelfile_Payments_Squirrel']").val(null);
                            angular.element("input[id='ngexcelfile_ItemSales_Squirrel']").val(null);
                            $scope.GET_DATA_UPLOAD_EPOS_ENTRY();
                            var modalEl = document.getElementById('ePos_upload');
                            var existingModal = bootstrap.Modal.getInstance(modalEl);
                            if (existingModal) {
                                existingModal.hide();
                            }

                        });
                    }
                }
                if ($scope.EPOS_UPLOAD_Obj.INTEGRATION_SYSTEM_ID == 12) {
                    var CashupModelObj = new Object();
                    CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
                    CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
                    CashupModelObj.CASHUP_HEADER_ID = $scope.EPOS_UPLOAD_Obj.CASHUP_HEADER_ID;
                    CashupModelObj.INTEGRATION_SYSTEM_ID = $scope.EPOS_UPLOAD_Obj.INTEGRATION_SYSTEM_ID;
                    CashupModelObj.SESSION_ID = $scope.EPOS_UPLOAD_Obj.SESSION_MAPPING_ID;
                    CashupModelObj.UPLOADED_JSON_ARRAY = JSON.stringify(exceljson);
                    CashupModelObj.BRANCH_ID = $scope.EPOS_UPLOAD_Obj.SELECTED_SITE.BRANCH_ID;
                    CashupModelObj.CASHUP_MAIN_ID = parseInt($scope.EPOS_UPLOAD_Obj.CASHUP_MAIN_ID);
                    PrcCommMethods.CASHUP_APP_API(CashupModelObj, "EPOS_FILE_UPLOAD_ALINES").then(function (data) {
                        if (data.data == null) {
                            $scope.$parent.ShowAlertBox('Warning', "We found some changes in file, please validate uploaded file with support team", 30000);
                        }
                        else {
                            $scope.Uploading = false;
                            $scope.$parent.ShowAlertBox('Success', 'File Uploaded Succesfully', 2000);
                            $scope.GET_DATA_UPLOAD_EPOS_ENTRY();
                            var modalEl = document.getElementById('ePos_upload_ext');
                            var existingModal = bootstrap.Modal.getInstance(modalEl);
                            if (existingModal) {
                                existingModal.hide();
                            }
                            //$scope.SELECT_SESSION($scope.$parent.CASHUP.SESSION, $scope.$parent.CASHUP.INDEX);
                        }
                    });
                }
                if ($scope.EPOS_UPLOAD_Obj.INTEGRATION_SYSTEM_ID == 15) {
                    var CashupModelObj = new Object();
                    CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
                    CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
                    CashupModelObj.CASHUP_HEADER_ID = $scope.EPOS_UPLOAD_Obj.CASHUP_HEADER_ID;
                    CashupModelObj.INTEGRATION_SYSTEM_ID = $scope.EPOS_UPLOAD_Obj.INTEGRATION_SYSTEM_ID;
                    CashupModelObj.SESSION_ID = $scope.EPOS_UPLOAD_Obj.SESSION_MAPPING_ID;
                    CashupModelObj.UPLOADED_JSON_ARRAY = JSON.stringify(exceljson);
                    CashupModelObj.BRANCH_ID = $scope.EPOS_UPLOAD_Obj.SELECTED_SITE.BRANCH_ID;
                    CashupModelObj.CASHUP_MAIN_ID = parseInt($scope.EPOS_UPLOAD_Obj.CASHUP_MAIN_ID);
                    PrcCommMethods.CASHUP_APP_API(CashupModelObj, "EPOS_FILE_UPLOAD_MICROS").then(function (data) {
                        if (data.data == null) {
                            $scope.$parent.ShowAlertBox('Warning', "We found some changes in file, please validate uploaded file with support team", 30000);
                        }
                        else {
                            $scope.Uploading = false;
                            $scope.$parent.ShowAlertBox('Success', 'File Uploaded Succesfully', 2000);
                            $scope.GET_DATA_UPLOAD_EPOS_ENTRY();
                            var modalEl = document.getElementById('ePos_upload_ext');
                            var existingModal = bootstrap.Modal.getInstance(modalEl);
                            if (existingModal) {
                                existingModal.hide();
                            }
                            //$scope.SELECT_SESSION($scope.$parent.CASHUP.SESSION, $scope.$parent.CASHUP.INDEX);
                        }
                    });
                }
                //if ($scope.$parent.CASHUP.INTEGRATION_SYSTEM_ID == 17) {
                //    var CashupModelObj = new Object();
                //    CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
                //    CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
                //    CashupModelObj.CASHUP_HEADER_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_ID;
                //    CashupModelObj.INTEGRATION_SYSTEM_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.INTEGRATION_SYSTEM_ID;
                //    CashupModelObj.SESSION_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.SESSION_ID;
                //    CashupModelObj.UPLOADED_JSON_ARRAY = JSON.stringify(exceljson);
                //    PrcCommMethods.CASHUP_API(CashupModelObj, "EPOS_FILE_UPLOAD_BIZZON").then(function (data) {
                //        if (data.data == null) {
                //            $scope.$parent.ShowAlert('Warning', "We found some changes in file, please validate uploaded file with support team", 30000);
                //        }
                //        else {
                //            $scope.Uploading = false;
                //            $scope.$parent.ShowAlert('Success', 'File Uploaded Succesfully', 2000);
                //            $scope.SELECT_SESSION($scope.$parent.CASHUP.SESSION, $scope.$parent.CASHUP.INDEX);
                //        }
                //    });
                //}
                if ($scope.EPOS_UPLOAD_Obj.INTEGRATION_SYSTEM_ID == 37) {
                    var CashupModelObj = new Object();
                    CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
                    CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
                    CashupModelObj.CASHUP_HEADER_ID = $scope.EPOS_UPLOAD_Obj.CASHUP_HEADER_ID;
                    CashupModelObj.INTEGRATION_SYSTEM_ID = $scope.EPOS_UPLOAD_Obj.INTEGRATION_SYSTEM_ID;
                    CashupModelObj.SESSION_ID = $scope.EPOS_UPLOAD_Obj.SESSION_MAPPING_ID;

                    CashupModelObj.EPOS_SALES_START_DATE = moment($scope.EPOS_UPLOAD_Obj.CASHUP_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).format($scope.$parent.DB_DATE_FORMAT) + ' ' + $scope.EPOS_UPLOAD_Obj.SESSION_START;
                    CashupModelObj.EPOS_SALES_END_DATE = moment($scope.EPOS_UPLOAD_Obj.CASHUP_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).format($scope.$parent.DB_DATE_FORMAT) + ' ' + $scope.EPOS_UPLOAD_Obj.SESSION_END;


                    //CashupModelObj.EPOS_SALES_START_DATE = $scope.EPOS_UPLOAD_Obj.SESSION_START;
                    //CashupModelObj.EPOS_SALES_END_DATE = $scope.EPOS_UPLOAD_Obj.SESSION_END;


                    CashupModelObj.UPLOADED_JSON_ARRAY = JSON.stringify(exceljson);
                    CashupModelObj.CASHUP_MAIN_ID = parseInt($scope.EPOS_UPLOAD_Obj.CASHUP_MAIN_ID);
                    CashupModelObj.BRANCH_ID = $scope.EPOS_UPLOAD_Obj.SELECTED_SITE.BRANCH_ID;
                    PrcCommMethods.CASHUP_APP_API(CashupModelObj, "EPOS_FILE_UPLOAD_COMMON").then(function (data) {
                        if (data.data == null) {
                            $scope.$parent.ShowAlertBox('Warning', "We found some changes in file, please validate uploaded file with support team", 30000);
                        }
                        else {
                            $scope.Uploading = false;
                            $scope.$parent.ShowAlertBox('Success', 'File Uploaded Succesfully', 2000);
                            $scope.GET_DATA_UPLOAD_EPOS_ENTRY();
                            var modalEl = document.getElementById('ePos_upload_ext');
                            var existingModal = bootstrap.Modal.getInstance(modalEl);
                            if (existingModal) {
                                existingModal.hide();
                            }
                            //$scope.SELECT_SESSION($scope.$parent.CASHUP.SESSION, $scope.$parent.CASHUP.INDEX);
                        }
                    });
                }
            });
        }

    };

    $scope.Uploading = false;

    $scope.ReadExcelData = function () {
        console.log($scope.EPOS_UPLOAD_Obj.UploadedFiles);
        console.log($scope.Files);

        if (document.getElementById("ngexcelfile").value != '') {
            if ($scope.EPOS_UPLOAD_Obj.CASHUP_HEADER_ID != 0) {
                $scope.Uploading = true;
                var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xlsx|.xls)$/;
                var fileUpload = document.getElementById("ngexcelfile");
                if (fileUpload.value.toLowerCase().indexOf('.xls') != -1 || fileUpload.value.toLowerCase().indexOf('.xlsx') != -1) {
                    /*Checks whether the file is a valid excel file*/
                    if (true) {
                        var xlsxflag = false; /*Flag for checking whether excel is .xls format or .xlsx format*/
                        if ($("#ngexcelfile").val().toLowerCase().indexOf(".xlsx") > 0) {
                            xlsxflag = true;
                        }
                        /*Checks whether the browser supports HTML5*/
                        if (typeof (FileReader) != "undefined") {
                            var reader = new FileReader();
                            reader.onload = function (e) {
                                var data = e.target.result;
                                /*Converts the excel data in to object*/
                                if ($scope.EPOS_UPLOAD_Obj.INTEGRATION_SYSTEM_ID == 37) {
                                    if (xlsxflag) {
                                        //var workbook = XLSX.read(data, { type: 'binary' });
                                        var workbook = XLSX.read(data, { type: 'array' });
                                    }
                                    else {
                                        var workbook = XLS.read(data, { type: 'array' });
                                    }
                                }
                                else {
                                    if (xlsxflag) {
                                        //var workbook = XLSX.read(data, { type: 'binary' });
                                        var workbook = XLSX.read(data, { type: 'binary' });
                                    }
                                    else {
                                        var workbook = XLS.read(data, { type: 'binary' });
                                    }
                                }

                                /*Gets all the sheetnames of excel in to a variable*/
                                var sheet_name_list = workbook.SheetNames;
                                var cnt = 0; /*This is used for restricting the script to consider only first sheet of excel*/
                                sheet_name_list.forEach(function (y) { /*Iterate through all sheets*/
                                    /*Convert the cell value to Json*/
                                    if (xlsxflag) {
                                        var worksheet = workbook.Sheets[y];
                                        if ($scope.EPOS_UPLOAD_Obj.INTEGRATION_SYSTEM_ID == 37) {
                                            delete worksheet.A2;
                                            delete worksheet.A3;
                                            delete worksheet.A4;
                                            delete worksheet.A5;
                                            worksheet["!ref"] = "A5:H165";
                                        }
                                        else {
                                            delete worksheet.A2;
                                            delete worksheet.A3;
                                            worksheet["!ref"] = "A4:H165";
                                        }
                                        //for (z in worksheet) {
                                        //    /* all keys that do not begin with "!" correspond to cell addresses */
                                        //    if(z[0] === '!' || z[0]==="A1" || z[0]==="A2"){
                                        //    }
                                        //    else{
                                        //        console.log(y + "!" + z + "=" + JSON.stringify(worksheet[z].v));
                                        //    }
                                        //}
                                        var exceljson = XLSX.utils.sheet_to_row_object_array(worksheet);
                                    }
                                    else {
                                        var exceljson = XLS.utils.sheet_to_row_object_array(workbook.Sheets[y]);
                                    }
                                    if (exceljson.length > 0) {
                                        if (exceljson.length > 0) {
                                            //for (var i = 0; i < exceljson.length; i++) {
                                            //    var FAV_FOLDER_UPD_Obj = new Object();
                                            //    FAV_FOLDER_UPD_Obj.PRODUCT_SKU = exceljson[i].PRODUCT_SKU;
                                            //    FAV_FOLDER_UPD_Obj.QUANTITY = exceljson[i].QUANTITY;
                                            //    $scope.RFQ_RESPONSE_UPDATE_LIST_Obj[i] = FAV_FOLDER_UPD_Obj;
                                            //}
                                            $scope.uploadFilesx(1, 0, 0, exceljson, fileUpload.value);
                                        }
                                        else {
                                            alert("Please enter the data in excel file");
                                        }
                                    }
                                });
                            }
                            if (xlsxflag) {/*If excel file is .xlsx extension than creates a Array Buffer from excel*/
                                reader.readAsArrayBuffer($("#ngexcelfile")[0].files[0]);
                            }
                            else {
                                reader.readAsBinaryString($("#ngexcelfile")[0].files[0]);
                            }
                        }
                        else {
                            alert("Sorry! Your browser does not support HTML5!");
                        }
                    }
                    else {
                        alert("Please upload a valid Excel file1!");
                    }
                }
                else if (fileUpload.value.toLowerCase().indexOf('.csv')) {
                    $scope.uploadFile_CSV();
                }
                else {
                    alert("Please upload a valid Excel file.");
                }
            }
            else {
                $scope.Uploading = false;
                alert('Please select a Session.');

            }
        }
        else {
            alert("Please select a file to upload.");
        }
    };

    $scope.MICROS_DATA_HEADER = function (Attachment_UPLOAD_TYPE_ID, var1, var2, exceljson, filename) {

        $scope.DataList = [];
        $scope.H = [];
        $scope.P = []; $scope.P_Obj = [];
        $scope.L = []; $scope.L_Obj = [];
        $scope.D = [];
        $scope.CHKID = null;
        $scope.Revenue_Center = null;

        $scope.count = 0;
        $scope.H_Tax = 0;
        $scope.Returns = 0;
        $scope.Voids = 0;
        $scope.Mgr_Voids = 0;
        $scope.CashTipsDecl = 0;
        $scope.IndirectTips = 0;

        var HEADER = {
            'CHECK_ID': '',
            'CHECK_NO': '',
            'OPEN_TIME': '',
            'CLOSE_TIME': '',
            'COVERS': 0,
            'REVENUE_CENTRE_CODE': '',
            'REVENUE_CENTRE_DESC': '',
            'SERVE_MODE': 'Eat In',
            'NET': 0,
            'TAX': 0,
            'GROSS': 0,
            'DISCOUNT': 0,
            'COMP': 0,
            'VOID': 0,
            'TIPS': 0,
            'SERVICE_CHARGE': 0,
            'DONATION': 0,
            'CURRENCY': null,
            'IS_TRAINING': false,
            'INTEGRATION_SYSTEM_ID': 15,
            'STAFF_ID': null,
            'STAFF_NAME': null
        };

        $scope.H = exceljson.filter(p => p.T == 'Business Dates' || p.T == 'Dine In' || p.T == 'Revenue Centers' || p.T == 'Net Sales' || p.T == '+Tax Collected'
            || p.T == 'Total Discounts' || p.T == 'Returns' || p.T == 'Voids' || p.T == 'Mgr Voids' || p.T == '+Cash Tips Decl' || p.T == '+Indirect Tips' || p.T == '+Charge Tips');
        $scope.P = exceljson.filter(p => p.T == 'VISA' || p.T == 'MASTER CARD' || p.T == 'SPADES' || p.T == 'AMEX' || p.T == 'CASH' || p.T == 'PM' || p.T == 'QLUB' || p.T == 'CUSTOMER CREDIT'
            || p.T == 'DEPOSIT' || p.T == 'ADVANCE PAYMENT' || p.T == 'ADDMIND');
        $scope.L = exceljson.filter(p => p.T.toLowerCase() == 'Food'.toLowerCase() || p.T.toLowerCase() == 'Alc Beverage'.toLowerCase() || p.T.toLowerCase() == 'Alc Wine'.toLowerCase()
            || p.T.toLowerCase() == 'Non Alcoholic Beverage'.toLowerCase() || p.T.toLowerCase() == 'Tobacco'.toLowerCase() || p.T.toLowerCase() == 'Condiment'.toLowerCase()
            || p.T.toLowerCase() == 'BEVERAGE'.toLowerCase() || p.T.toLowerCase() == 'OTHER'.toLowerCase());

        //head
        angular.forEach($scope.H, function (item) {
            if ($scope.count == 0) {
                $scope.CHKID = parseInt(new Date(item.__EMPTY).getFullYear()).toString() + parseInt(new Date(item.__EMPTY).getMonth() + 1).toString() + parseInt(new Date(item.__EMPTY).getDay()).toString() + new Date().getHours().toString() + new Date().getMinutes().toString() + new Date().getSeconds().toString() + new Date().getMilliseconds().toString();
                HEADER["CHECK_ID"] = $scope.CHKID;
                HEADER["CHECK_NO"] = $scope.CHKID;
                HEADER["OPEN_TIME"] = item.__EMPTY;
                HEADER["CLOSE_TIME"] = item.__EMPTY;
                $scope.count += 1;
            }
            if (item.T.toLowerCase() == "Dine In".toLowerCase())
                HEADER["COVERS"] = parseFloat(item.__EMPTY_2.toString().replace(/[',]+/g, ''));
            if (item.T.toLowerCase() == "Revenue Centers".toLowerCase()) {
                HEADER["REVENUE_CENTRE_CODE"] = item.__EMPTY;
                $scope.Revenue_Center = item.__EMPTY;;
            }
            if (item.T.toLowerCase() == "Revenue Centers".toLowerCase())
                HEADER["REVENUE_CENTRE_DESC"] = item.__EMPTY;
            if (item.T.toLowerCase() == "Net Sales".toLowerCase())
                HEADER["NET"] = parseFloat(item.__EMPTY_1.toString().replace(/[',]+/g, ''));
            if (item.T.toLowerCase() == "+Tax Collected".toLowerCase()) {
                HEADER["TAX"] = parseFloat(item.__EMPTY_1.toString().replace(/[',]+/g, ''));
                $scope.H_Tax = parseFloat(item.__EMPTY_1.toString().replace(/[',]+/g, ''));
            }
            if (item.T.toLowerCase() == "Total Discounts".toLowerCase()) {
                HEADER["DISCOUNT"] = parseFloat(item.__EMPTY_1.toString().replace(/[',]+/g, ''));
                $scope.Discount = parseFloat(item.__EMPTY_1.toString().replace(/[',]+/g, ''));
            }
            if (item.T.toLowerCase() == "Returns".toLowerCase())
                $scope.Returns = parseFloat(item.__EMPTY_1.toString().replace(/[',]+/g, ''));
            if (item.T.toLowerCase() == "Voids".toLowerCase())
                $scope.Voids = parseFloat(item.__EMPTY_1.toString().replace(/[',]+/g, ''));
            if (item.T.toLowerCase() == "Mgr Voids".toLowerCase())
                $scope.Mgr_Voids = parseFloat(item.__EMPTY_1.toString().replace(/[',]+/g, ''));
            if (item.T.toLowerCase() == "+Cash Tips Decl".toLowerCase())
                $scope.CashTipsDecl = parseFloat(item.__EMPTY_1.toString().replace(/[',]+/g, ''));
            if (item.T.toLowerCase() == "+Indirect Tips".toLowerCase())
                $scope.CashTipsDecl = parseFloat(item.__EMPTY_1.toString().replace(/[',]+/g, ''));
            if (item.T.toLowerCase() == "+Charge Tips".toLowerCase())
                HEADER["SERVICE_CHARGE"] = parseFloat(item.__EMPTY_1.toString().replace(/[',]+/g, ''));
        });
        HEADER["GROSS"] = parseFloat(HEADER["NET"]) + parseFloat(HEADER["TAX"]);
        HEADER["VOID"] = (parseFloat($scope.Returns) + parseFloat($scope.Voids) + parseFloat($scope.Mgr_Voids)) * -1;
        HEADER["TIPS"] = parseFloat($scope.CashTipsDecl) + parseFloat($scope.IndirectTips);
        HEADER["TYPE"] = 1;
        $scope.DataList.push(HEADER);
        $scope.count = 0;
        //pay
        angular.forEach($scope.P, function (item) {
            $scope.PAYMENT = [];
            $scope.PAYMENT = {
                "CHECK_ID": $scope.CHKID,
                "PAYMENT_METHOD_ID": null,
                "PAYMENT_METHOD_CODE": item.T,
                "PAYMENT_METHOD_DESC": item.T,
                "TOTAL_AMOUNT_WITH_TIPS": parseFloat(item.__EMPTY.toString().replace(/[',]+/g, '')),
                "TIPS": 0,
                "TYPE": 3
            };
            $scope.DataList.push($scope.PAYMENT);
        });
        //line
        angular.forEach($scope.L, function (item) {
            $scope.LINE = [];
            $scope.count += 1;
            $scope.LINE = {
                "CHECK_ID": $scope.CHKID,
                "REVENUE_CENTER_ID": $scope.Revenue_Center,
                "REVENUE_CENTER": $scope.Revenue_Center,
                "ACCOUNT_GROUP_ID": item.T,
                "ACCOUNT_GROUP_CODE": item.T,
                "ACCOUNT_GROUP_NAME": item.T,
                "CATEGORY_ID": item.T,
                "CATEGORY_CODE": item.T,
                "CATEGORY_NAME": item.T,
                "PRODUCT_SKU": item.T,
                "PRODUCT_NAME": item.T,
                "QUANITY": parseFloat(item.__EMPTY.toString().replace(/[',]+/g, '')),
                "NET": parseFloat(item.__EMPTY_3.toString().replace(/[',]+/g, '')),
                "TAX": 0,
                "GROSS": 0,
                "DISCOUNT": parseFloat(item.__EMPTY_2.toString().replace(/[',()]+/g, '')),
                "COMP": 0,
                "VOID": 0,
                "TIME_OF_SALE": HEADER["OPEN_TIME"],
                "STAFF_ID": null,
                "STAFF_NAME": null,
                "VOID_ID": null,
                "VOID_REASON": null,
                "DISCOUNT_ID": parseFloat(item.__EMPTY_2.toString().replace(/[',()]+/g, '')) != 0 ? '' : null,
                "DISCOUNT_REASON": parseFloat(item.__EMPTY_2.toString().replace(/[',()]+/g, '')) != 0 ? '' : null,
                "DISCOUNT_RATE": 0,
                "TAX_RATE": 0,
                "TYPE": 2
            };
            $scope.DataList.push($scope.LINE);
            if ($scope.count == 1 && (parseFloat($scope.Returns) + parseFloat($scope.Voids) + parseFloat($scope.Mgr_Voids)) > 0) {
                $scope.LINE = [];
                $scope.LINE = {
                    "CHECK_ID": $scope.CHKID,
                    "REVENUE_CENTER_ID": $scope.Revenue_Center,
                    "REVENUE_CENTER": $scope.Revenue_Center,
                    "ACCOUNT_GROUP_ID": item.T,
                    "ACCOUNT_GROUP_CODE": item.T,
                    "ACCOUNT_GROUP_NAME": item.T,
                    "CATEGORY_ID": item.T,
                    "CATEGORY_CODE": item.T,
                    "CATEGORY_NAME": item.T,
                    "PRODUCT_SKU": item.T,
                    "PRODUCT_NAME": item.T,
                    "QUANITY": 0,
                    "NET": 0,
                    "TAX": 0,
                    "GROSS": 0,
                    "DISCOUNT": 0,
                    "COMP": 0,
                    "VOID": (parseFloat($scope.Returns) + parseFloat($scope.Voids) + parseFloat($scope.Mgr_Voids)) * -1,
                    "TIME_OF_SALE": HEADER["OPEN_TIME"],
                    "STAFF_ID": null,
                    "STAFF_NAME": null,
                    "VOID_ID": '',
                    "VOID_REASON": '',
                    "DISCOUNT_ID": null,
                    "DISCOUNT_REASON": null,
                    "DISCOUNT_RATE": 0,
                    "TAX_RATE": 0,
                    "TYPE": 2
                };
                $scope.DataList.push($scope.LINE);
            }

        });
        //dis
        angular.forEach($scope.L, function (item) {
            if (parseFloat(item.__EMPTY_2.toString().replace(/[',()]+/g, '')) != 0) {
                $scope.DISCOUNT = [];
                $scope.DISCOUNT = {
                    "CHECK_ID": $scope.CHKID,
                    "DISCOUNT_ID": "",
                    "DISCOUNT_DESCRIPTION": "",
                    "DISCOUNT_AMOUNT": parseFloat(item.__EMPTY_2.toString().replace(/[',()]+/g, '')),
                    "STAFF_ID": "",
                    "STAFF_NAME": "",
                    "TYPE": 4
                };
                $scope.DataList.push($scope.DISCOUNT);
            }
        });

        $scope.uploadFilesx(1, 0, 0, $scope.DataList, filename);

    };


    $scope.ReadExcelData_Micros = function () {
        if (document.getElementById("ngexcelfile").value != '') {
            if ($scope.EPOS_UPLOAD_Obj.CASHUP_HEADER_ID != 0) {
                $scope.Uploading = true;
                var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xlsx|.xls)$/;
                var fileUpload = document.getElementById("ngexcelfile");
                if (fileUpload.value.toLowerCase().indexOf('.xls') != -1 || fileUpload.value.toLowerCase().indexOf('.xlsx') != -1) {
                    /*Checks whether the file is a valid excel file*/
                    if (true) {
                        var xlsxflag = false; /*Flag for checking whether excel is .xls format or .xlsx format*/
                        if ($("#ngexcelfile").val().toLowerCase().indexOf(".xlsx") > 0) {
                            xlsxflag = true;
                        }
                        /*Checks whether the browser supports HTML5*/
                        if (typeof (FileReader) != "undefined") {
                            var reader = new FileReader();
                            reader.onload = function (e) {

                                var data = e.target.result;
                                /*Converts the excel data in to object*/
                                if (xlsxflag) {
                                    //var workbook = XLSX.read(data, { type: 'binary' });

                                    var workbook = XLSX.read(data, { type: 'array' });
                                }
                                else {
                                    var workbook = XLS.read(data, { type: 'binary' });
                                }
                                /*Gets all the sheetnames of excel in to a variable*/
                                var sheet_name_list = workbook.SheetNames;
                                var cnt = 0; /*This is used for restricting the script to consider only first sheet of excel*/
                                sheet_name_list.forEach(function (y) { /*Iterate through all sheets*/
                                    /*Convert the cell value to Json*/
                                    if (xlsxflag) {
                                        var worksheet = workbook.Sheets[y];
                                        delete worksheet.A0;
                                        worksheet.A1.v = 'T';
                                        worksheet.A1.r = 'T';
                                        worksheet.A1.h = 'T';
                                        worksheet.A1.w = 'T';
                                        var exceljson = XLSX.utils.sheet_to_row_object_array(worksheet);
                                    }
                                    else {
                                        var exceljson = XLS.utils.sheet_to_row_object_array(workbook.Sheets[y]);
                                    }
                                    if (exceljson.length > 0) {
                                        if (exceljson.length > 0) {
                                            $scope.MICROS_DATA_HEADER(1, 0, 0, '', exceljson, fileUpload.value);
                                            //$scope.uploadFilesx(1, 0, 0, exceljson, fileUpload.value);
                                        }
                                        else {
                                            alert("Please enter the data in excel file");
                                        }
                                    }
                                });
                            }
                            if (xlsxflag) {/*If excel file is .xlsx extension than creates a Array Buffer from excel*/
                                reader.readAsArrayBuffer($("#ngexcelfile")[0].files[0]);
                            }
                            else {
                                reader.readAsBinaryString($("#ngexcelfile")[0].files[0]);
                            }
                        }
                        else {
                            alert("Sorry! Your browser does not support HTML5!");
                        }
                    }
                    else {
                        alert("Please upload a valid Excel file1!");
                    }
                }

                else {
                    alert("Please upload a valid Excel file.");
                }
            }
            else {
                $scope.Uploading = false;
                alert('Please select a Session.');
            }
        }
        else {
            alert("Please select a file to upload.");
        }
    };


    $scope.uploadFile_CSV = function () {
        if ($scope.EPOS_UPLOAD_Obj.INTEGRATION_SYSTEM_ID == 0) {
            $scope.fileDataObj = readFileData.processData($scope.imagesrc[0].Src, ',');
            delete $scope.fileDataObj[0];
            var someStr = 'He said "Hello, my name is Foo"';
            console.log(someStr.replace(/['"]+/g, ''));
            // delete $scope.fileDataObj[1];
            //$scope.fileDataObj = $scope.fileDataObj.splice(0, 1);
            //$scope.fileDataObj = $scope.fileDataObj.splice(1, 1);
            //$scope.fileData = JSON.stringify($scope.fileDataObj);
            $scope.DataTable = [];
            var count = 0;
            angular.forEach($scope.fileDataObj, function (value, index) {
                var array = value[0].split(';');

                if (array[0].replace(/['"]+/g, '') == 'Payment methods') {
                    count++;
                }
                if (array[0] != "" && array[0] != 'Payment methods' && count == 0) {
                    var EPObj = {
                        'Accounting groups': array[0].replace(/['"]+/g, ''),
                        'Quantity': parseFloat(array[1].replace(/['"]+/g, '')),
                        'Total': parseFloat(array[2].replace(/['"]+/g, '')),
                        'Discounts': parseFloat(array[3].replace(/['"]+/g, '')),
                        'Total with tax Less discounts': parseFloat(array[4].replace(/['"]+/g, '')),
                        'Amount charged': parseFloat(array[5].replace(/['"]+/g, '')),
                        'Service charge 12.5%': parseFloat(array[6].replace(/['"]+/g, '')),
                        'Amount taxed': parseFloat(array[7].replace(/['"]+/g, '')),
                        'VAT 5%': parseFloat(array[8].replace(/['"]+/g, '')),
                        'Amount taxed': parseFloat(array[9].replace(/['"]+/g, '')),
                        'VAT 20%': parseFloat(array[10].replace(/['"]+/g, '')),
                        'Amount taxed': parseFloat(array[11].replace(/['"]+/g, '')),
                        'Tax Exempt': parseFloat(array[12].replace(/['"]+/g, '')),
                        'Total taxes': parseFloat(array[13].replace(/['"]+/g, '')),
                        '%': parseFloat(array[14].replace(/['"]+/g, '')),
                        'Total without tax': parseFloat(array[15].replace(/['"]+/g, ''))
                    }
                    $scope.DataTable.push(EPObj);
                }
                else if (array[0] != "" && count != 0) {
                    var EPObj = {
                        'Accounting groups': array[0].replace(/['"]+/g, ''),
                        'Quantity': parseFloat(array[1].replace(/['"]+/g, '')),
                        'Total': 0,
                        'Discounts': 0,
                        'Total with tax Less discounts': 0,
                        'Amount charged': 0,
                        'Service charge 12.5%': 0,
                        'Amount taxed': 0,
                        'VAT 5%': 0,
                        'Amount taxed': 0,
                        'VAT 20%': 0,
                        'Amount taxed': 0,
                        'Tax Exempt': 0,
                        'Total taxes': 0,
                        '%': 0,
                        'Total without tax': 0
                    }
                    $scope.DataTable.push(EPObj);
                }
            });
            var fileUpload = document.getElementById("ngexcelfile");
            $scope.uploadFilesx(1, 0, 0, $scope.DataTable, fileUpload.value);
        }
        else if ($scope.EPOS_UPLOAD_Obj.INTEGRATION_SYSTEM_ID == 12) {

            var rows = $scope.imagesrc[0].Src.split("\r\n");
            $scope.DataTable = [];
            if (rows.length > 0) {
                var count = 0;
                for (var i = 3; i < rows.length; i++) {
                    var array = splitComponentsByComma(rows[i]);
                    if (array.length > 1 && array[0] !== "") {
                        count++;
                        if (array[0] != "" && count == 1) {
                            var EPObj = {
                                'Description': array[0].replace(/['"]+/g, ''),
                                'Units': (array[1].replace(/['"]+/g, '')),
                                'Gross': (array[2].replace(/['"]+/g, '')),
                                'Disc/Cpn': (array[3].replace(/['"]+/g, '')),
                                'VAT Tax': (array[4].replace(/['"]+/g, '')),
                                'Net': array[5].replace(/['"]+/g, '') == undefined || array[5].replace(/['"]+/g, '') == '' || array[5].replace(/['"]+/g, '') == null ? 0 : (array[5].replace(/['"]+/g, '')),
                                '% Total': (array[6].replace(/['"]+/g, '')),
                                'H': array[7] == undefined ? '' : (array[7].replace(/['"]+/g, '')),
                            }
                            $scope.DataTable.push(EPObj);
                        }

                        else if (array[0] != "" && count != 1) {
                            var EPObj = {
                                'Description': array[0].replace(/['"]+/g, ''),
                                'Units': (array[1].replace(/['"]+/g, '')),
                                'Gross': (array[2].replace(/['"]+/g, '')),
                                'Disc/Cpn': (array[3].replace(/['"]+/g, '')),
                                'VAT Tax': (array[4].replace(/['"]+/g, '')),
                                'Net': array[5].replace(/['"]+/g, '') == undefined || array[5].replace(/['"]+/g, '') == '' || array[5].replace(/['"]+/g, '') == null ? 0 : (array[5].replace(/['"]+/g, '')),
                                '% Total': (array[6].replace(/['"]+/g, '')),
                                'H': array[7] == undefined ? '' : (array[7].replace(/['"]+/g, '')),
                            }
                            $scope.DataTable.push(EPObj);
                        }
                    }
                }
                var array = splitComponentsByComma(rows[2]);
                var EPObj = {
                    'Description': 'Start_Date',
                    'Units': array[1].split('From')[1].split('to')[0],
                    'Gross': array[1].split('From')[1].split('to')[1].split('to')[0].split(',')[0],
                    'Disc/Cpn': "",
                    'VAT Tax': "",
                    'Net': "",
                    '% Total': "",
                    'H': "",
                };
                $scope.DataTable.push(EPObj);
                // $scope.uploadFilesx(1, 0, 0, $scope.DataTable, fileUpload.value);
                var fileUpload = document.getElementById("ngexcelfile");
                $scope.uploadFilesx(1, 0, 0, $scope.DataTable, fileUpload.value);

            }
            else {
                $scope.$parent.ShowAlert("Warning", "no record found", 30000);
            }
        }
        else if ($scope.EPOS_UPLOAD_Obj.INTEGRATION_SYSTEM_ID == 11) {
            var rows = $scope.imagesrc[0].Src.split("\r\n");
            $scope.DataTable = [];
            if (rows.length > 0) {
                var count = 0;
                for (var i = 3; i < rows.length; i++) {
                    var array = splitComponentsByComma(rows[i]);
                    if (array.length > 1 && array[0] !== "") {
                        count++;
                        if (array[0] != "" && count == 1) {
                            var EPObj = {
                                'Description': array[0].replace(/['"]+/g, ''),
                                'Units': (array[1].replace(/['"]+/g, '')),
                                'Gross': (array[2].replace(/['"]+/g, '')),
                                'Disc/Cpn': (array[3].replace(/['"]+/g, '')),
                                'VAT Tax': (array[4].replace(/['"]+/g, '')),
                                'Net': array[5].replace(/['"]+/g, '') == undefined || array[5].replace(/['"]+/g, '') == '' || array[5].replace(/['"]+/g, '') == null ? 0 : (array[5].replace(/['"]+/g, '')),
                                '% Total': (array[6].replace(/['"]+/g, '')),
                                'H': array[7] == undefined ? '' : (array[7].replace(/['"]+/g, '')),
                            }
                            $scope.DataTable.push(EPObj);
                        }

                        else if (array[0] != "" && count != 1) {
                            var EPObj = {
                                'Description': array[0].replace(/['"]+/g, ''),
                                'Units': (array[1].replace(/['"]+/g, '')),
                                'Gross': (array[2].replace(/['"]+/g, '')),
                                'Disc/Cpn': (array[3].replace(/['"]+/g, '')),
                                'VAT Tax': (array[4].replace(/['"]+/g, '')),
                                'Net': array[5].replace(/['"]+/g, '') == undefined || array[5].replace(/['"]+/g, '') == '' || array[5].replace(/['"]+/g, '') == null ? 0 : (array[5].replace(/['"]+/g, '')),
                                '% Total': (array[6].replace(/['"]+/g, '')),
                                'H': array[7] == undefined ? '' : (array[7].replace(/['"]+/g, '')),
                            }
                            $scope.DataTable.push(EPObj);
                        }
                    }
                }
                // $scope.uploadFilesx(1, 0, 0, $scope.DataTable, fileUpload.value);
                var fileUpload = document.getElementById("ngexcelfile");
                $scope.uploadFilesx(1, 0, 0, $scope.DataTable, fileUpload.value);

            }
            else {
                $scope.$parent.ShowAlert("Warning", "no record found", 30000);
            }
        }
        else if ($scope.EPOS_UPLOAD_Obj.INTEGRATION_SYSTEM_ID == 17) {
            var rows = $scope.imagesrc[0].Src.split("\r\n");
            $scope.DataTable = [];
            if (rows.length > 0) {
                var count = 0;
                for (var i = 1; i < rows.length; i++) {
                    var array = splitComponentsByComma(rows[i]);
                    if (array.length > 1 && array[0] !== "") {
                        count++;
                        console.log(i);
                        //if (array[0] != "" && count == 1) {
                        //    var EPObj = {
                        //        'Description': array[0].replace(/['"]+/g, ''),
                        //        'Units': (array[1].replace(/['"]+/g, '')),
                        //        'Gross': (array[2].replace(/['"]+/g, '')),
                        //        'Disc/Cpn': (array[3].replace(/['"]+/g, '')),
                        //        'VAT Tax': (array[4].replace(/['"]+/g, '')),
                        //        'Net': array[5].replace(/['"]+/g, '') == undefined || array[5].replace(/['"]+/g, '') == '' || array[5].replace(/['"]+/g, '') == null ? 0 : (array[5].replace(/['"]+/g, '')),
                        //        //'% Total': (array[6].replace(/['"]+/g, '')),
                        //'H': array[7] == undefined ? '' : (array[7].replace(/['"]+/g, '')),
                        //    }
                        //    $scope.DataTable.push(EPObj);
                        //}

                        //else if (array[0] != "" && count != 1) {
                        var EPObj = {
                            'Description': array[0].replace(/['"]+/g, ''),
                            'Units': (array[2].replace(/['"]+/g, '')),
                            'Gross': (array[4].replace(/['"]+/g, '')),
                            'Disc/Cpn': (array[3].replace(/['"]+/g, '')),
                            'VAT Tax': (array[4].replace(/['"]+/g, '')),
                            'Net': array[5] == undefined ? 0 : (array[5].replace(/['"]+/g, '')),
                            '% Total': (array[3].replace(/['"]+/g, '')),
                            'H': array[1] == undefined ? '' : (array[1].replace(/['"]+/g, '')),
                        }
                        $scope.DataTable.push(EPObj);
                        //}
                    }
                }
                // $scope.uploadFilesx(1, 0, 0, $scope.DataTable, fileUpload.value);
                var fileUpload = document.getElementById("ngexcelfile");
                $scope.uploadFilesx(1, 0, 0, $scope.DataTable, fileUpload.value);

            }
            else {
                $scope.$parent.ShowAlert("Warning", "no record found", 30000);
            }
        }

    };
    $scope.$on('$destroy', function () {
        $('.modal.show').modal('hide');
    });
});