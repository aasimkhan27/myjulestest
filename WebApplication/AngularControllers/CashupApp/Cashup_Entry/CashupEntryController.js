app.controller('CashupEntryController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location,$localStorage) {
    //$scope.$parent.$parent.DISPLAY_FLAG = false;
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(2);
    //$scope.$parent.CASHUP_COMMON_CODE_Fn();
    $scope.$parent.TAB_ID = 1;
    $scope.EPOs_Search = {
        CUSTOMER_ID: $cookies.get("CUSTOMER_ID"),
        ENTITY_ID: null,
        MODULE_ID: $cookies.get("MODULE_ID"),
        USER_ID: $cookies.get("USERID"),
        DD_DEFAULT_TEXT: $scope.$parent.DD_DEFAULT_TEXT,
        DD_NO_HOLIDAY_DEFAULT_TEXT: $scope.DD_NO_HOLIDAY_DEFAULT_TEXT,
        HOURS: 8,
        UploadedFiles: [],
    };
    $scope.DD_DEFAULT_TEXT = {
        SITE: 'Site',
        AREA: 'Area',
        SESSION: 'Session'
    };
    $scope.HEADER_STATUS_LIST = {
        null: "-",
        0: "Pending",
        1: "Draft",
        3: "In Approval",
        4: "Approved",
        5: "Returned"
    }


    

    $scope.CASHUP_HEADER_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_ID;
    $scope.SELECTED_DATA = [];
    $scope.SITES_LIST = [];
    $scope.SESSION_LIST = [];
    $scope.AREA_LIST = [];
    $scope.Show_covers = false;
    //$scope.CASHUP_BY_AREA = true;
    //$scope.$parent.CASHUP_BY_AREA = true;
    $scope.CASHUP_BY_SESSION = true;
    $scope.EPOS_data = [];
    $scope.EPOS_data1 = [];
    $scope.COVERS_data = [];
    $scope.CARDS_LIST = [];
    $scope.PDQ_TERMINAL_LIST = [];
    $scope.CASHUP_DATA_UPLOAD_TYPE = null;
    $scope.FILTERED_SITES_LIST = [];
    $scope.CAHSUP_ENTRY_PRIVILEGE_ID = "1162";
    $scope.CASHUP_ENTRY_PRIVILEGE = true;
    $scope.CASHUP_DATA_UPLOAD_LIST = [];
    $scope.COVERS_DATA_UPLOAD_TYPE = null;
    $scope.PREVIEW_COVERS_ENTRY = [];

    $scope.GET_CASHUP_TYPE = function (flag, Sites) {
        var CashupModelObj = {
            CUSTOMER_ID: $cookies.get("CUSTOMER_ID"),
            ENTITY_ID: $cookies.get("ENTITY_ID")
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
            } else {
                $scope.CashupTypeData = [];
                console.error("No Cashup Types available.");
            }
            if (flag == 1) {

                if (Sites.filter(_branch => _branch.BRANCH_ID == $scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID).length > 0) {
                    var _site = Sites.filter(_branch => _branch.BRANCH_ID == $scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID)[0];
                    $scope.SELECT_SITE(_site);
                }
            }
            $scope.$parent.CASHUP_ENTRY_SEARCH.FILTERED_SITES_LIST = $scope.FILTERED_SITES_LIST;
        }).catch(function (error) {
            console.error("Error fetching Cashup Types:", error);
        });
    }

    $scope.GET_PRIVILEGE = function (flag) {
        if ($scope.$parent.$parent.CHECK_CASHUP_PRIVILEGE($scope.CAHSUP_ENTRY_PRIVILEGE_ID)) {
            $scope.FILTERED_SITES_LIST = $scope.$parent.$parent.CHECK_CASHUP_USER_PRIVILEGE($scope.CAHSUP_ENTRY_PRIVILEGE_ID, parseInt($cookies.get("ENTITY_ID")));
            if ($scope.FILTERED_SITES_LIST && $scope.FILTERED_SITES_LIST.length > 0) {
                $scope.FILTERED_SITES_LIST[0].IS_SELECTED = true;
                $scope.GET_CASHUP_TYPE(flag, $scope.FILTERED_SITES_LIST);
            }
            else {
                console.log("User does not have required PRIVILEGE_ID" + $scope.CAHSUP_ENTRY_PRIVILEGE_ID);
                $scope.CASHUP_ENTRY_PRIVILEGE = false;
            }
        }
        else {
            console.log("User does not have required PRIVILEGE_ID" + $scope.CAHSUP_ENTRY_PRIVILEGE_ID);
            $scope.CASHUP_ENTRY_PRIVILEGE = false;
        }
    };
    $scope.GET_PRIVILEGE();

    $scope.GET_CASHUP_SETTING_DATA_UPLOAD = function () {
        
        CommonObj = new Object();
        CommonObj.ENTITY_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.ENTITY_ID;
        CommonObj.CUSTOMER_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.CUSTOMER_ID;
        PrcCommMethods.CASHUP_APP_API(CommonObj, 'GET_CASHUP_SETTING_DATA_UPLOAD').then(function (data) {
            $scope.CASHUP_DATA_UPLOAD_LIST = data.data.Table;
        });
    };
    $scope.GET_CASHUP_SETTING_DATA_UPLOAD();


    
    $scope.GET_CASHUP_COVER_DATA = function () {
        var coverobj = new Object();
        coverobj.ENTITY_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.ENTITY_ID;
        coverobj.BRANCH_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID;
        coverobj.AREA_ID = 0;
        coverobj.SESSION_ID = 0;
        coverobj.DATE = moment($scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).format($scope.$parent.DB_DATE_FORMAT);
        //coverobj.DATE = $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_DATE;
        PrcCommMethods.CASHUP_APP_API(coverobj, 'GET_CASHUP_COVER_DATA').then(function (data) {
            if (data.data.Table && data.data.Table.length>0) {
                $scope.COVERS_data = $scope.BIFURCATE_COVERS_DATA(data.data.Table);
                $scope.Show_covers = true;
            }
        })
    };
    $scope.GET_CASHUP_EPOS_DATA = function () {
        var EPOSobj = new Object();
        EPOSobj.ENTITY_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.ENTITY_ID;
        EPOSobj.BRANCH_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID;
        EPOSobj.AREA_ID = 0;
        EPOSobj.DATE = moment($scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).format($scope.$parent.DB_DATE_FORMAT);
        //EPOSobj.DATE = moment($scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_DATE).format($scope.$parent.DB_DATE_FORMAT);
        
        PrcCommMethods.CASHUP_APP_API(EPOSobj, 'GET_CASHUP_EPOS_DATA').then(function (data) {
            if (data.data.Table && data.data.Table.length > 0) {
                $scope.EPOS_data = data.data.Table;
                $scope.EPOS_data1 = data.data.Table1;
                $scope.BIFURCATE_EPOS_DATA($scope.EPOS_data, $scope.EPOS_data1);
            }
        })
    };
    $scope.ADMIN_GET_CU_SESSION_MAPPING_Fn = function (_branchID) {
        var SessionObj = new Object();
        SessionObj.BRANCH_ID = _branchID;
        PrcCommMethods.CASHUP_APP_API(SessionObj, 'GET_SESSION_BY_BRANCH').then(function (data) {
            if (data.data && data.data.length > 0) {
                $scope.SESSION_LIST = data.data;
            } else {
                console.warn("No sessions found for branch ID " + BRANCH_ID);
                $scope.SESSION_MAPPING_LIST = [];
            }
        })
    };
    $scope.ADMIN_GET_AREA = function (_branchID) {
        var AreaModelObj = new Object();
        AreaModelObj.CUSTOMER_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.CUSTOMER_ID
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
                return [];
            }
        });
    };

    $scope.EPOS_REFRESH = function () {
        if (confirm('Are you sure you want to Refresh EPOS Data?')) {
            $scope.$parent.$parent.overlay_loading_coffee = 'block';

            var CashupModelObj = new Object();
            CashupModelObj.CASHUP_MAIN_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_MAIN_ID;
            CashupModelObj.INTEGRATION_STATUS = 7;
            CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
            CashupModelObj.SYNC_SOURCE = 3; //1 Auto Sync, 2 Web App, 3 Monitoring, 4 DB
            PrcCommMethods.CASHUP_APP_API(CashupModelObj, 'UPD_CASHUP_MAIN_FOR_INTEGRATION').then(function (data) {
                
            });
        }

    };

    $scope.BIFURCATE_EPOS_DATA = function (_epos_data, _epos_data1) {
        $scope.MEDIA_TYPES = [...new Set(_epos_data.map(item => item.MEDIA))];
        $scope.CATEGORY_TYPES = [...new Set(_epos_data1.map(item => item.CATEGORY_NAME))];
        $scope.SESSION_NAMES = ["BREAKFAST", "LUNCH", "DINNER", "ALL"];
        $scope.tableData = {};
        $scope.sessionTotals = {};
        $scope.categoryTableData = {};
        $scope.categorySessionTotals = {};
        $scope.MEDIA_TYPES.forEach(media => {
            $scope.tableData[media] = {};
            $scope.SESSION_NAMES.forEach(session => {
                let entry = _epos_data.find(item => item.MEDIA === media && item.SESSION_NAME === session);
                $scope.tableData[media][session] = entry ? entry.SALES_AMT : "-";
            });
        });
        $scope.CATEGORY_TYPES.forEach(category => {
            $scope.categoryTableData[category] = {};
            $scope.SESSION_NAMES.forEach(session => {
                let entry = _epos_data1.find(item => item.CATEGORY_NAME === category && item.SESSION_NAME === session);
                $scope.categoryTableData[category][session] = entry ? entry.NET : "-";
            });
        });
        $scope.SESSION_NAMES.forEach(session => {
            $scope.sessionTotals[session] = $scope.MEDIA_TYPES.reduce((sum, media) => {
                return sum + ($scope.tableData[media][session] !== "-" ? $scope.tableData[media][session] : 0);
            }, 0);
            $scope.categorySessionTotals[session] = $scope.CATEGORY_TYPES.reduce((sum, category) => {
                return sum + ($scope.categoryTableData[category][session] !== "-" ? $scope.categoryTableData[category][session] : 0);
            }, 0);
        });
    }

    $scope.BIFURCATE_COVERS_DATA = function (rawData) {
        let structuredData = {
            sources: [],
            statuses: [],
            totals: { Breakfast: 0, Lunch: 0, Dinner: 0, Total: 0 }
        };

        rawData.forEach(entry => {
            let sessionName = null;
            if (entry.SESSION_NAME) {
                sessionName = entry.SESSION_NAME.charAt(0).toUpperCase() + entry.SESSION_NAME.slice(1).toLowerCase(); // Format "BREAKFAST" -> "Breakfast"
            }
            // Categorizing into sources and statuses
            if (entry.HEADER === "Source") {
                let source = structuredData.sources.find(s => s.type === entry.SESSIONS);
                if (!source) {
                    source = { type: entry.SESSIONS, Breakfast: 0, Lunch: 0, Dinner: 0, Total: 0 };
                    structuredData.sources.push(source);
                }
                if (sessionName) {
                    source[sessionName] += entry.COVER_COUNT;
                    source.Total += entry.COVER_COUNT;
                }
                else {
                    source.Total += entry.COVER_COUNT;
                }
            } else if (entry.HEADER === "Status") {
                let status = structuredData.statuses.find(s => s.type === entry.SESSIONS);
                if (!status) {
                    status = { type: entry.SESSIONS, Breakfast: 0, Lunch: 0, Dinner: 0, Total: 0 };
                    structuredData.statuses.push(status);
                }
                if (sessionName) {
                    status[sessionName] += entry.COVER_COUNT;
                    status.Total += entry.COVER_COUNT;
                }
                else {
                    status.Total += entry.COVER_COUNT;
                }
            }
            // Updating totals
            if (sessionName) {
                structuredData.totals[sessionName] += entry.COVER_COUNT;
            }
            structuredData.totals.Total += entry.COVER_COUNT;
        });
        return structuredData;
    }

    $scope.RESET_SELECTIONS = function () {
        $scope.$parent.SELECTED_SITE = null;
        $scope.$parent.SELECTED_AREA = null;
        $scope.$parent.SELECTED_SESSION = null;
        $scope.AREA_LIST = [];
        $scope.SESSION_LIST = [];
        $scope.$parent.CASHUP_ENTRY_SEARCH.AREA_ID = 0;
        $scope.$parent.CASHUP_ENTRY_SEARCH.SESSION_ID = 0;
        $scope.CASHUP_BY_SESSION = true;
        $scope.CASHUP_BY_AREA = true;
        $scope.$parent.CASHUP_BY_AREA = true;
        $scope.TAB_ACTIVE_LIST.ENTRY.ACTIVE = false;
        $scope.TAB_ACTIVE_LIST.CASH.ACTIVE = false;
        $scope.TAB_ACTIVE_LIST.CARDS.ACTIVE = false;
        $scope.TAB_ACTIVE_LIST.PETTY_CASH.ACTIVE = false;
        $scope.TAB_ACTIVE_LIST.DELIVERY.ACTIVE = false;
        $scope.TAB_ACTIVE_LIST.ACCOUNT.ACTIVE = false;
        $scope.TAB_ACTIVE_LIST.VOUCHERS.ACTIVE = false;
        $scope.TAB_ACTIVE_LIST.DEPOSITS.ACTIVE = false;
        $scope.TAB_ACTIVE_LIST.COMPLIMENTARY.ACTIVE = false;
        $scope.TAB_ACTIVE_LIST.REVIEW.ACTIVE = false;
    };

    $scope.RESET_AREA = function () {
        $scope.$parent.SELECTED_AREA = null;
        $scope.$parent.CASHUP_ENTRY_SEARCH.AREA_ID = 0;
    };

    $scope.RESET_SESSION = function () {
        $scope.$parent.SELECTED_SESSION = null;
        $scope.$parent.CASHUP_ENTRY_SEARCH.SESSION_ID = 0;
    };

    $scope.SELECT_SITE = function (_branch) {
        $scope.SELECTED_DATA.BRANCH = _branch;
        $scope.$parent.SELECTED_SITE = _branch.BRANCH_NAME;
        $scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID = _branch.BRANCH_ID;
        $scope.$parent.CASHUP_ENTRY_SEARCH.STANDARD_ROLE_ID = _branch.STANDARD_ROLE_ID;
        $scope.$parent.CASHUP_ENTRY_SEARCH.USER_PRIVILEGE_IDS = _branch.USER_PRIVILEGE_IDS;
        if ($scope.CASHUP_DATA_UPLOAD_LIST.filter(_row => _row.BRANCH_ID == $scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID).length>0) {
            $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_DATA_UPLOAD_TYPE = $scope.CASHUP_DATA_UPLOAD_LIST.filter(_row => _row.BRANCH_ID == $scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID)[0].CASHUP_DATA_UPLOAD_MASTER_ID;

        }

        $scope.$parent.GET_CASHUP_INTEGRATION_FOR_EPOS_UPLOAD();


        //if (_branch.CASHUP_TYPE_MSTR_ID == 1) {
        //    $scope.CASHUP_BY_SESSION = true;
        //    $scope.CASHUP_BY_AREA = true;
        //    $scope.$parent.CASHUP_BY_AREA = true;
        //    //$scope.ADMIN_GET_AREA(_branch.BRANCH_ID);
        //}
        //else if (_branch.CASHUP_TYPE_MSTR_ID == 2) {
        //    $scope.CASHUP_BY_AREA = false;
        //    //$scope.SELECTED_AREA = null;
        //    $scope.$parent.SELECTED_AREA = null;
        //    $scope.$parent.CASHUP_BY_AREA = false;
        //    $scope.CASHUP_BY_SESSION = true;
        //}
        //else {
        //    $scope.CASHUP_BY_SESSION = true;
        //    $scope.CASHUP_BY_AREA = true;
        //    $scope.$parent.CASHUP_BY_AREA = true;
        //    //$scope.ADMIN_GET_AREA(_branch.BRANCH_ID);
        //}
        //$scope.ADMIN_GET_CU_SESSION_MAPPING_Fn(_branch.BRANCH_ID);
        $scope.GET_CASHUP_MANAGE_ENTRY_TABS($scope.SELECTED_DATA.BRANCH.BRANCH_ID);
        const date = new Date(moment($scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).format($scope.$parent.DB_DATE_FORMAT));
        if (!isNaN(date.getTime())) {
            $scope.FETCH_DATA();
        }
    };

    $scope.SELECT_AREA = function (_area) {
        $scope.SELECTED_DATA.AREA = _area;
        $scope.$parent.SELECTED_AREA = _area.AREA_NAME;
        $scope.$parent.CASHUP_ENTRY_SEARCH.AREA_ID = _area.AREA_ID;
    };

    $scope.SELECT_SESSION = function (_session) {
        $scope.SELECTED_DATA.SESSION = _session;
        $scope.$parent.SELECTED_SESSION = _session.SESSION_NAME;
        $scope.$parent.CASHUP_ENTRY_SEARCH.SESSION_ID = _session.SESSION_MAPPING_ID;
    }
    $scope.REDIRECT_COVERS_UPLOAD=function(){
        $location.path('CashUpApp_covers_upload');
    }


    
    $scope.INS_CASHUP_HEADER = function (flag) {
        if (flag == null || flag == undefined) {
            $scope.EntrySelectCashupDetailsForm.submitted = true;
        }
        else {
            $scope.EntrySelectCashupDetailsForm.submitted = false;
        }
        if ($scope.EntrySelectCashupDetailsForm.$valid || flag == 1) {
            var CashupAppModelObj = new Object();
            CashupAppModelObj.CASHUP_MAIN_ID = 0;
            //CashupAppModelObj.CASHUP_DATE = $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_DATE;
            CashupAppModelObj.CASHUP_DATE = moment($scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).format($scope.$parent.DB_DATE_FORMAT);
            CashupAppModelObj.BRANCH_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID;
            CashupAppModelObj.USER_ID = parseInt($cookies.get("USERID"));
            CashupAppModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'INS_CASHUP_HEADER').then(function (data) {
                if (data.data != null && data.data != undefined && data.data.Table.length > 0) {
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
                            var modalElement = document.getElementById('Select_Cashup_details');
                            var modalInstance = bootstrap.Modal.getInstance(modalElement);
                            modalInstance.hide();
                            $scope.GET_CASHUP_COVER_DATA();
                            $scope.GET_CASHUP_EPOS_DATA();
                            $scope.$parent.GET_CASHUP_MANAGE_ENTRY_TABS($scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID);
                            $scope.$parent.GET_CASHUP_ENTRY_HEADER($scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_ID, 1);
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

    $scope.FETCH_DATA = function (flag) {
        
        $scope.SELECTED_DATA.CASHUP_DATE = $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_DATE;
        $scope.$parent.CASHUP_DATE = $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_DATE;
        $scope.GET_CASHUP_COVER_DATA();
        $scope.GET_CASHUP_EPOS_DATA();
        if (flag != 1) {
            $scope.INS_CASHUP_HEADER(1);
        }
    }


    if ($scope.$parent.REDIRECT_REGISTER_ENTRY == true) {
        $scope.$parent.GET_CASHUP_MANAGE_ENTRY_TABS($scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID);
        $scope.$parent.GET_CASHUP_ENTRY_HEADER($scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_ID, 1);
        $scope.FETCH_DATA(1);
        $scope.GET_PRIVILEGE(1);
        $scope.$parent.REDIRECT_REGISTER_ENTRY == false;
    }
    else if ($scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID == null) {
        var myModal = new bootstrap.Modal(document.getElementById('Select_Cashup_details'), {
            backdrop: 'static', 
            keyboard: false
        });
        myModal.show();
        //$scope.FETCH_DATA(1);
        //if ($scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID != null) {
        //    $scope.GET_CASHUP_TYPE(1, $scope.FILTERED_SITES_LIST);
        //    $scope.GET_PRIVILEGE(1);
        //}
    }
    $scope.FETCH_DATA(1);
    //$scope.GET_PRIVILEGE(1);
    //$scope.GET_CASHUP_TYPE(1, $scope.FILTERED_SITES_LIST);

    $scope.SELECT_CASHUP_DETAILS = function () {
        const date = new Date(moment($scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).format($scope.$parent.DB_DATE_FORMAT));
        if ($scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID != null && !isNaN(date.getTime())) {
            $scope.INS_CASHUP_HEADER(1);

            //$scope.ADMIN_GET_AREA($scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID);
            //$scope.ADMIN_GET_CU_SESSION_MAPPING_Fn($scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID);
            $scope.FETCH_DATA();
        }

        var myModal = new bootstrap.Modal(document.getElementById('Select_Cashup_details'), {
            backdrop: 'static',
            keyboard: false
        });
        myModal.show();
    }

    $scope.getCardIcon = function (cardName) {
        let icons = {
            "Amex": "fa-brands fa-cc-amex",
            "Visa": "fa-brands fa-cc-visa",
            "Master Card": "fa-brands fa-cc-mastercard",
            "Spades": "fa-solid fa-card-spade rotate-90",
            "Qlub": "fa-brands fa-cc-diners-club",
            "Others": "fa-solid fa-closed-captioning"
        };
        return icons[cardName] || "fa-solid fa-credit-card"; // Default icon
    };

    

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
                        closeBtn: true,// close button visible
                        //  startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate())
                        endDate: today
                    };
                    date_input.off("hide").datepicker(options).on("hide", function (e) {
                        $scope.FETCH_DATA();
                    })
                }
            }
        });
    }
    $scope.dateinputddmmyy(1);



    //------------------COVERS UPLOAD -----------------------------//




    $scope.PREVIEW_COVERS_ENTRY = [];
    $scope.COVERS_UPLOAD_REPORT = [];
    $scope.COVER_TABLE = [{ ID: 1, COLUMN_NAME: 'SHIFT_NAME', IS_MANDATORY: true, HEADER_NAME: 'Shift Name', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true },
    { ID: 2, COLUMN_NAME: 'RESERVATION_DATE', IS_MANDATORY: true, HEADER_NAME: 'RESERVATION_DATE', FIELD_TYPE_ID: 9, VALUES_ENTITY: '', ACTIVE: true },
    { ID: 3, COLUMN_NAME: 'RESERVATION_TIME', IS_MANDATORY: true, HEADER_NAME: 'RESERVATION_TIME', FIELD_TYPE_ID: 14, VALUES_ENTITY: '', ACTIVE: true },//TIME DATATYPE
    { ID: 4, COLUMN_NAME: 'STATUS', IS_MANDATORY: true, HEADER_NAME: 'STATUS', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true },
    { ID: 5, COLUMN_NAME: 'BOOKING_SOURCE', IS_MANDATORY: true, HEADER_NAME: 'BOOKING_SOURCE', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true },
    { ID: 6, COLUMN_NAME: 'COVER_COUNT', IS_MANDATORY: true, HEADER_NAME: 'COVER_COUNT', FIELD_TYPE_ID: 5, VALUES_ENTITY: '', ACTIVE: true },
    { ID: 7, COLUMN_NAME: 'CREATED_DATE', IS_MANDATORY: true, HEADER_NAME: 'CREATED_DATE', FIELD_TYPE_ID: 9, VALUES_ENTITY: '', ACTIVE: true },
    { ID: 14, COLUMN_NAME: 'REVENUE_CENTRE', IS_MANDATORY: false, HEADER_NAME: 'REVENUE_CENTRE', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true },
    { ID: 8, COLUMN_NAME: 'REVENUE', IS_MANDATORY: true, HEADER_NAME: 'REVENUE', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, FIELD_MASTER_ID: -1 }];

    $scope.DOWNLOAD_FILE_PATH = "/Uploads/Covers_template.xlsx";

    $scope.COVERS_UPLOAD_MESSAGE = {
        0: "Covers uplaod type is not set. Please setup from Settings.",
        1: "Looks like you use Covers. Please download the template to fill in and & upload covers data.",
        2: "Looks like you use Manual entry. Please use Cashup Entry Page.",
        3: "Looks like you use ePOS. Please use Cashup Entry Page."
    }

    $scope.COVERS_UPLOAD_OBJ = {
        CUSTOMER_ID: parseInt($cookies.get("CUSTOMER_ID")),
        ENTITY_ID: parseInt($cookies.get("ENTITY_ID")),
        USER_ID: parseInt($cookies.get("USERID")),
        START_DATE: null,
        END_DATE: null,
        UploadedFiles: null
    }

    $scope.RESET_COVERS_UPLOAD = function () {
        $scope.PREVIEW_COVERS_ENTRY = [];
        $scope.COVERS_UPLOAD_OBJ.START_DATE = moment().startOf('month').format($scope.$parent.DB_DATE_FORMAT);
        $scope.COVERS_UPLOAD_OBJ.END_DATE = moment().endOf('month').format($scope.$parent.DB_DATE_FORMAT);
        $scope.COVERS_UPLOAD_OBJ.UploadedFiles = null;
        $('#reportrangeCoversUpload span').html(startDate.format($scope.$parent.DATE_RANGE_FORMAT) + ' - ' + endDate.format($scope.$parent.DATE_RANGE_FORMAT));      
        $scope.COVERS_UPLOAD_OBJ.UploadedFiles = null;
        $scope.TOGGLE_UPLOAD_VIEW = false;
        var fileInput = document.getElementById("uploadCoversExcel");
        if (fileInput) {
            fileInput.value = "";
        }
    }

    $scope.FILEUPLOADCLICK = function () {
        $scope.Refreshdata();
    };
    $scope.Refreshdata = function () {
        $scope.INVALID_EXCLE_CELL_COUNT = 0;
        $scope.COPY_CODE_ARRY = [];
        $scope.CODE_ARRY = [];
        $scope.submitted = false;
        $scope.TOGGLE_UPLOAD_VIEW = false;
        $scope.PREVIEW_COVERS_ENTRY = [];
    };


    $scope.EXCEL_COVERS_VALIDATE = function () {
        $scope.COPY_CODE_ARRY = [];
        $scope.CODE_ARRY = [];
        $scope.INVALID_EXCLE_CELL_COUNT = 0;
        if ((document.getElementById('uploadCoversExcel').value != null && document.getElementById('uploadCoversExcel').value != '')|| ($scope.Files != null && $scope.Files != undefined && $scope.Files.length > 0)) {
            ModelObj = new Object();
            ModelObj.UPLOAD_TYPE_ID = 1;
            ModelObj.SERVER_FILE_NAME = $scope.COVERS_UPLOAD_OBJ.UploadedFiles[0].SERVER_FILE_NAME;
            ModelObj.ORIGINAL_FILE_NAME = $scope.COVERS_UPLOAD_OBJ.UploadedFiles[0].ORIGINAL_FILE_NAME;
            ModelObj.FILE_PATH = $scope.COVERS_UPLOAD_OBJ.UploadedFiles[0].FILE_PATH + $scope.COVERS_UPLOAD_OBJ.UploadedFiles[0].SERVER_FILE_NAME;
            ModelObj.DATETIME_FORMAT_CULTURE = ["MM/dd/yyyy hh:mm:ss tt", "M/d/yyyy hh:mm:ss tt", "MM/dd/yyyy", "M/d/yyyy", "dd-MM-yyyy", "yyyy-MM-dd", "dd/MM/yyyy"]; //, "yyyy-MM-dd"
            //ModelObj.DATETIME_FORMAT_CULTURE = ["MM/dd/yyyy hh:mm:ss tt", "M/d/yyyy hh:mm:ss tt", "MM/dd/yyyy", "M/d/yyyy", "dd-MM-yyyy", "yyyy-MM-dd"]; //, "yyyy-MM-dd"
            ModelObj.LANGUAGE_SYMBOL = $scope.$parent.LANGUAGE_SYMBOL;

            ModelObj.EXCEL_DATATABLE = $scope.COVER_TABLE;
            PrcCommMethods.CASHUP_APP_API(ModelObj, 'EXCEL_COVERS_VALIDATE').then(function (data) {
                $scope.COVERS_VALIDATE_LIST = [];
                $scope.submitted = true;
                $scope.PREVIEW_COVERS_ENTRY = data.data.HEADER_CLOUMN_NAMES;
                //angular.forEach($scope.PREVIEW_COVERS_ENTRY, function (_row) {
                //    _row.RESERVATION_DATE = moment(_row.RESERVATION_DATE, "DD-MM-YYYY HH:mm:ss").format("DD-MM-YYYY");
                //    _row.CREATED_DATE = moment(_row.CREATED_DATE, "DD-MM-YYYY").format("DD-MM-YYYY");

                //})
                if (data.data.IS_VALID_COUNT > 0) {
                    $scope.INVALID_EXCLE_CELL_COUNT = parseInt(data.data.IS_VALID_COUNT);
                    $scope.INVALID_EXCLE_CELL_FLAG = true;
                }

                else if (data.data.error == "CODE0001") {
                    $scope.$parent.ShowAlertBox('Warning', 'No changes found in uploaded Excel', 3000);
                    $scope.submitted = false;
                    $scope.IS_VALID_UPLOAD_FILE = false;
                }
                else if (data.data.error == "CODE0003") {
                    $scope.$parent.ShowAlertBox('Warning', 'Some thing wrong in excel or Enable editing mode in excel', 3000);
                    $scope.submitted = false;
                    $scope.IS_VALID_UPLOAD_FILE = false;
                    if (data.data.Msg == 'A malformed URI was found in the document. Please provide a OpenSettings.RelationshipErrorRewriter to handle these errors while opening a package.') {
                        $scope.Message = "";
                        var List = { DISPLAY_TEXT: "", IS_VALID: false, IS_DATA_VALID: true, CODE: "CODE0003" };
                        $scope.CODE_ARRY.push(List);
                        $scope.COPY_CODE_ARRY.push(List);
                    };
                }
                else if (data.data.error == "CODE0002") {
                    $scope.$parent.ShowAlertBox('Warning', 'Invalid Excel,either the column header is deleted or mismatch', 3000);
                    $scope.submitted = false;
                    $scope.IS_VALID_UPLOAD_FILE = false;
                }
                else if (data.data.HEADER_CLOUMN_NAMES.length == 0) {
                    $scope.$parent.ShowAlertBox('Warning', 'No record found', 3000);
                    $scope.submitted = false;
                    $scope.IS_VALID_UPLOAD_FILE = false;
                }
                else {
                    $scope.INVALID_EXCLE_CELL_FLAG = false;
                    $scope.INVALID_EXCLE_CELL_COUNT = parseInt(data.data.IS_VALID_COUNT);
                    $scope.$parent.ShowAlertBox('Success', 'File validated successfully,please click on submit', 5000);
                }
            });
            $scope.submitted = false;
        }
        else {
            $scope.$parent.ShowAlertBox('Attention', 'Please Upload File', 3000);
            $scope.submitted = false;
        }
        var fileInput = document.getElementById("uploadCoversExcel"); // Reset the file input
        if (fileInput) {
            fileInput.value = ""; // Clear the input field
        }
    };


    $scope.getTheFilesToUploadCovers = function ($files, ControlName, FileSize, List, Attachment_UPLOAD_TYPE_ID, index) {

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
                if (($files[i].size / 1000000).toFixed(2) <= FileSize) {//File Size should not be more than 10 MB
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
                    $scope.$parent.ShowAlertBox('Error', 'Maximum File Size ' + FileSize + ' MB.', 5000);
                    angular.element("input[id='" + ControlName + "']").val(null);
                    return;
                }
            }
            else {
                $scope.$parent.ShowAlertBox('Error', 'Not a valid file.', 5000);
                angular.element("input[id='" + ControlName + "']").val(null);
                return;
            }
        }
        $scope.Files = $files;
        var fileUpload = document.getElementById("uploadCoversExcel");
        if (fileUpload.files[0] == null || fileUpload.files[0] == undefined) {
            var extension = $files[0].name;
        }
        else {
            extension = fileUpload.files[0].name;
        }
        //$scope.Files = $files;
        //var fileUpload = document.getElementById("uploadCoversExcel");
        //extension = fileUpload.files[0].name;
        $scope.uploadFiles(Attachment_UPLOAD_TYPE_ID, '', extension, List, index, 'uploadCoversExcel');
    };
    $scope.uploadFiles = function (Attachment_UPLOAD_TYPE_ID, ATTACHEMENT_TYPE_ID, filename, List, index, FolderName) {

        if (($scope.Files != undefined && $scope.Files.length > 0)) {
            $scope.DocImageResult = [];
            var data = new FormData();
            data.append("RelativeID", $scope.$parent.$parent.generaterandom(12));
            //data.append("RelativeID", List.ID == 0 ? $scope.generaterandom(12) + "" + index : List.ID);
            data.append("UPLOAD_TYPE_ID", Attachment_UPLOAD_TYPE_ID);
            data.append("VIRTUALPATH", '/CashUp/' + FolderName + '/' + parseInt($scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID) + '/');
            data.append("UPLOAD_ID", 0);
            data.append("ORIGINAL_FILE_NAME", filename);
            data.append("USER_ID", parseInt($cookies.get("USERID")));
            if (isNaN(parseInt($cookies.get("ENTITY_ID")))) {
                data.append("ENTITY_ID", 0);
            }
            else {
                data.append("ENTITY_ID", parseInt($cookies.get("ENTITY_ID")));
            }
            for (var i in $scope.Files) {
                data.append("uploadedfile", $scope.Files[i]);
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
                    $scope.$parent.ShowAlertBox('Error', d.data[0].UPLOADED_COMMENT, 5000);
                }
                else {
                    List.UploadedFiles = d.data;
                }
                $scope.EXCEL_COVERS_VALIDATE();
            });
        }
    };

    $scope.DELETE_UPLOAD_CARD_ALL = function (Array, item, index) {
        if (confirm('Are you sure you want to delete?')) {
            Array.UploadedFiles.splice(index, 1);
            var CashupModelObj = new Object();
            CashupModelObj.ID = parseInt(item.ID);
            PrcCommMethods.CASHUP_APP_API(CashupModelObj, 'DELETE_UPLOAD').then(function (data) {
                var fileInput = document.getElementById("uploadCoversExcel"); // Reset the file input
                if (fileInput) {
                    fileInput.value = ""; // Clear the input field
                }
                $scope.$parent.ShowAlertBox('Success', 'Deletion Success.', 3000);
                $scope.CODE_ARRY = [];
                $scope.COVERS_UPLOAD_OBJ.UploadedFiles = null;
                $scope.INVALID_EXCLE_CELL_COUNT = 0;
                $scope.COPY_CODE_ARRY = [];
                $scope.CODE_ARRY = [];
                $scope.submitted = false;
            });
        }
    };

    $scope.$on('ngRepeatFinishedRender', function (ngRepeatFinishedEvent) {
        $scope.CODE_ARRY = $scope.COPY_CODE_ARRY;
    });
    $scope.ngintvalidationvalue = function (key, value) {
        var List;
        if (value == "<i class='fa fa-exclamation-triangle text-danger'></i>") {
            List = { DISPLAY_TEXT: "", IS_VALID: true };
        }
        else {
            if (key == "COMMENTS") {

            }
            var val = value.split(':;:');
            if (val.length > 1) {
                if (val[1] == "DDL0004") {
                    List = { DISPLAY_TEXT: val[0], IS_VALID: false, IS_DATA_VALID: true, CODE: val[1], Suggestion: val, D_COLUMN_NAME: val[2] };
                    $scope.COPY_CODE_ARRY.push(List);
                }
                else {
                    List = { DISPLAY_TEXT: val[0], IS_VALID: false, IS_DATA_VALID: true, CODE: val[1], Suggestion: val };
                    $scope.COPY_CODE_ARRY.push(List);
                }
            }
            else {
                if (key == "NI Number" && value != '' || key == "NI Number*" && value != '') {
                    const repeatRegex = /^[A-CEGHJ-PR-TW-Z]{1}[A-CEGHJ-NPR-TW-Z]{1}[0-9]{6}[A-D]{1}$/i;
                    var found = value.match(repeatRegex);
                    if (found == null) {
                        List = { DISPLAY_TEXT: value, IS_VALID: false, IS_DATA_VALID: true, CODE: "INVALID0011" };
                        $scope.COPY_CODE_ARRY.push(List);
                    }
                    else {
                        List = { DISPLAY_TEXT: value, IS_VALID: false };
                    }
                }
                else {
                    if (key == "DATE" || key == "CREATED_DATE") {
                        value = value.split(' ')[0];
                    }
                    List = { DISPLAY_TEXT: value, IS_VALID: false };
                }
            }
        }
        return List;
    };


    function reportrangeCoversUpload(startDate, endDate) {
        if (!$scope.$$phase && !$scope.$root.$$phase) {
            $scope.$apply(function () {
                $scope.COVERS_UPLOAD_OBJ.START_DATE = startDate.format($scope.$parent.DB_DATE_FORMAT);
                $scope.COVERS_UPLOAD_OBJ.END_DATE = endDate.format($scope.$parent.DB_DATE_FORMAT);
            });
        } else {
            $scope.COVERS_UPLOAD_OBJ.START_DATE = startDate.format($scope.$parent.DB_DATE_FORMAT);
            $scope.COVERS_UPLOAD_OBJ.END_DATE = endDate.format($scope.$parent.DB_DATE_FORMAT);
        }
        $('#reportrangeCoversUpload span').html(startDate.format($scope.$parent.DATE_RANGE_FORMAT) + ' - ' + endDate.format($scope.$parent.DATE_RANGE_FORMAT));
    }
    $(function () {

        coversUploadStartDate = new moment().add(0, 'months').date(1);
        coversUploadEndDate = moment().endOf('month');
        $scope.$parent.SetUpDateRangeMultiDatePicker('reportrangeCoversUpload', coversUploadStartDate, coversUploadEndDate, reportrangeCoversUpload);
        $('#reportrangeCoversUpload span').html(coversUploadStartDate.format($scope.$parent.DATE_RANGE_FORMAT) + ' - ' + coversUploadEndDate.format($scope.$parent.DATE_RANGE_FORMAT));
    });

    $(document).on("click", ".ranges ul li", function (event) {

        var a = $(this).attr("data-range-key");
        if (a == "Custom Date" && ($scope.loader == 1)) {
            $scope.loader = 2;
            var startCovers = moment().startOf('month');
            var endCovers = moment().add(1, 'M').endOf('month');
            $scope.$parent.SetUpDateRangeMultiDatePicker('reportrangeCoversUpload', startCovers, endCovers, reportrangeCoversUpload, 1, "right", 'Open');
            $('#reportrangeCoversUpload').data('daterangepicker').show();
        }
        else {
            $scope.loader = 1;
        }
    });

    $scope.INS_UPD_CU_COVERS = function () {
        var IS_VALID = true;
        if (new Date($scope.COVERS_UPLOAD_OBJ.START_DATE) > new Date($scope.COVERS_UPLOAD_OBJ.END_DATE)) {
            $scope.$parent.ShowAlertBox("Error", "end date should be less then start date", 2000);
            IS_VALID = false;
        }
        if (IS_VALID) {
            //angular.forEach($scope.PREVIEW_COVERS_ENTRY, function (_row) {
            //    _row.RESERVATION_DATE = moment(_row.RESERVATION_DATE, "DD-MM-YYYY HH:mm:ss").format($scope.$parent.DB_DATE_FORMAT);
            //    _row.CREATED_DATE = moment(_row.CREATED_DATE, "DD-MM-YYYY HH:mm:ss").format($scope.$parent.DB_DATE_FORMAT);

            //})
            ModelObj = new Object();
            ModelObj.BRANCH_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID;
            ModelObj.ENTITY_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.ENTITY_ID;
            ModelObj.USER_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.USER_ID;
            ModelObj.SERVER_FILE_NAME = '../Uploads/' + $scope.COVERS_UPLOAD_OBJ.UploadedFiles[0].FILE_PATH + $scope.COVERS_UPLOAD_OBJ.UploadedFiles[0].SERVER_FILE_NAME;
            ModelObj.ORIGINAL_FILE_NAME = $scope.COVERS_UPLOAD_OBJ.UploadedFiles[0].ORIGINAL_FILE_NAME;
            ModelObj.START_DATE = $scope.COVERS_UPLOAD_OBJ.START_DATE;
            ModelObj.END_DATE = $scope.COVERS_UPLOAD_OBJ.END_DATE;
            ModelObj.CU_COVERS_TYPE_DETAIL = $scope.PREVIEW_COVERS_ENTRY;
            PrcCommMethods.CASHUP_APP_API(ModelObj, 'INS_UPD_CU_COVERS').then(function (data) {
                $scope.GET_CASHUP_COVER_DATA();
                $scope.RESET_COVERS_UPLOAD();
            });
        }
    };


    $scope.attachFile = function ($files, List) {
        List.UploadedFiles = $files;
    }
    $scope.REMOVE_UPLOAD_Fn = function(){
        $scope.EPOs_Search.UploadedFiles = [];
        var fileInput = document.getElementById("ngexcelfile"); // Reset the file input
        if (fileInput) {
            fileInput.value = ""; // Clear the input field
        }
    }


    $scope.uploadFilesx = function (Attachment_UPLOAD_TYPE_ID, var1, var2, exceljson, filename, FLAG) {
        if (($scope.Files != undefined && $scope.Files.length > 0)) {
            $scope.DocImageResult = [];
            var data = new FormData();
            data.append("CASHUP_HEADER_ID", $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_ID);
            data.append("UPLOAD_TYPE_ID", Attachment_UPLOAD_TYPE_ID);
            data.append("VIRTUALPATH", parseInt($cookies.get("ENTITY_ID")) + '/' + Attachment_UPLOAD_TYPE_ID + '/' + $scope.$parent.CASHUP_ENTRY_SEARCH.INTEGRATION_SYSTEM_ID + '/');
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
                if ($scope.$parent.CASHUP_ENTRY_SEARCH.INTEGRATION_SYSTEM_ID == 0) {
                    FLAG == 1 ? $scope.DECLARATION_DETAILS_UPLOAD_FLAG = true : '';
                    FLAG == 2 ? $scope.PAYMENT_DETAILS_UPLOAD_FLAG = true : '';
                    FLAG == 3 ? $scope.DEPARTMENT_DETAILS_UPLOAD_FLAG = true : '';
                    if ($scope.DEPARTMENT_DETAILS_UPLOAD_FLAG && $scope.PAYMENT_DETAILS_UPLOAD_FLAG && $scope.DECLARATION_DETAILS_UPLOAD_FLAG) {
                        var CashupModelObj = new Object();
                        CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
                        CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
                        CashupModelObj.CASHUP_HEADER_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_ID;//23//24
                        CashupModelObj.SESSION_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.SESSION_ID; // $scope.SESSION_ID;              
                        CashupModelObj.DECLARATION_DETAILS = $scope.DECLARATION_DETAILS;
                        CashupModelObj.PAYMENT_DETAILS = $scope.PAYMENT_DETAILS;
                        CashupModelObj.SQUIRREL_INTEGRATION_DATA = $scope.DEPARTMENT_DETAILS;
                        PrcCommMethods.CASHUP_APP_API(CashupModelObj, "EPOS_FILE_UPLOAD_ITEMSALES_SQUIRREL").then(function (data) {
                            $scope.Uploading = false;
                            //alert('File Uploaded Succesfully');
                            $scope.$parent.ShowAlert('Success', 'File Uploaded Succesfully', 2000);

                            $scope.ItemSalesFileValid = true;
                            $scope.PaymentsFileValid = true;
                            $scope.DepartmentFileValid = true;

                            $scope.DECLARATION_DETAILS_UPLOAD_FLAG = false;
                            $scope.PAYMENT_DETAILS_UPLOAD_FLAG = false;
                            $scope.DEPARTMENT_DETAILS_UPLOAD_FLAG = false;

                            angular.element("input[id='ngexcelfile_Deartments_Squirrel']").val(null);
                            angular.element("input[id='ngexcelfile_Payments_Squirrel']").val(null);
                            angular.element("input[id='ngexcelfile_ItemSales_Squirrel']").val(null);
                            $scope.GET_CASHUP_EPOS_DATA();
                            var modalEl = document.getElementById('ePos_upload');
                            var existingModal = bootstrap.Modal.getInstance(modalEl);
                            if (existingModal) {
                                existingModal.hide();
                            }

                        });
                    }
                }
                if ($scope.$parent.CASHUP_ENTRY_SEARCH.INTEGRATION_SYSTEM_ID == 12) {
                    var CashupModelObj = new Object();
                    CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
                    CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
                    CashupModelObj.CASHUP_HEADER_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_ID;
                    CashupModelObj.INTEGRATION_SYSTEM_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.INTEGRATION_SYSTEM_ID;
                    CashupModelObj.SESSION_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.SESSION_ID;
                    CashupModelObj.UPLOADED_JSON_ARRAY = JSON.stringify(exceljson);
                    CashupModelObj.BRANCH_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID;
                    CashupModelObj.CASHUP_MAIN_ID = parseInt($scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_MAIN_ID);
                    PrcCommMethods.CASHUP_APP_API(CashupModelObj, "EPOS_FILE_UPLOAD_ALINES").then(function (data) {
                        if (data.data == null) {
                            $scope.$parent.ShowAlertBox('Warning', "We found some changes in file, please validate uploaded file with support team", 30000);
                        }
                        else {
                            $scope.Uploading = false;
                            $scope.$parent.ShowAlertBox('Success', 'File Uploaded Succesfully', 2000);
                            $scope.GET_CASHUP_EPOS_DATA();
                            var modalEl = document.getElementById('ePos_upload');
                            var existingModal = bootstrap.Modal.getInstance(modalEl);
                            if (existingModal) {
                                existingModal.hide();
                            }
                            //$scope.SELECT_SESSION($scope.$parent.CASHUP.SESSION, $scope.$parent.CASHUP.INDEX);
                        }
                    });
                }
                if ($scope.$parent.CASHUP_ENTRY_SEARCH.INTEGRATION_SYSTEM_ID == 15) {
                    var CashupModelObj = new Object();
                    CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
                    CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
                    CashupModelObj.CASHUP_HEADER_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_ID;
                    CashupModelObj.INTEGRATION_SYSTEM_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.INTEGRATION_SYSTEM_ID;
                    CashupModelObj.SESSION_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.SESSION_ID;
                    CashupModelObj.UPLOADED_JSON_ARRAY = JSON.stringify(exceljson);
                    CashupModelObj.BRANCH_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID;
                    CashupModelObj.CASHUP_MAIN_ID = parseInt($scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_MAIN_ID);
                    PrcCommMethods.CASHUP_APP_API(CashupModelObj, "EPOS_FILE_UPLOAD_MICROS").then(function (data) {
                        if (data.data == null) {
                            $scope.$parent.ShowAlertBox('Warning', "We found some changes in file, please validate uploaded file with support team", 30000);
                        }
                        else {
                            $scope.Uploading = false;
                            $scope.$parent.ShowAlertBox('Success', 'File Uploaded Succesfully', 2000);
                            $scope.GET_CASHUP_EPOS_DATA();
                            var modalEl = document.getElementById('ePos_upload');
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
                if ($scope.$parent.CASHUP_ENTRY_SEARCH.INTEGRATION_SYSTEM_ID == 37) {
                    var CashupModelObj = new Object();
                    CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
                    CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
                    CashupModelObj.CASHUP_HEADER_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_ID;
                    CashupModelObj.INTEGRATION_SYSTEM_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.INTEGRATION_SYSTEM_ID;
                    CashupModelObj.SESSION_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID;
                    CashupModelObj.EPOS_SALES_START_DATE = moment($scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).format($scope.$parent.DB_DATE_FORMAT) + ' ' + $scope.$parent.CASHUP_ENTRY_SEARCH.SESSION_START;
                    CashupModelObj.EPOS_SALES_END_DATE = moment($scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).format($scope.$parent.DB_DATE_FORMAT) + ' ' +  $scope.$parent.CASHUP_ENTRY_SEARCH.SESSION_END;

                    //CashupModelObj.EPOS_SALES_START_DATE = $scope.$parent.CASHUP_ENTRY_SEARCH.SESSION_START;
                    //CashupModelObj.EPOS_SALES_END_DATE = $scope.$parent.CASHUP_ENTRY_SEARCH.SESSION_END;
                    CashupModelObj.UPLOADED_JSON_ARRAY = JSON.stringify(exceljson);
                    CashupModelObj.CASHUP_MAIN_ID = parseInt($scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_MAIN_ID);
                    CashupModelObj.BRANCH_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.BRANCH_ID;
                    PrcCommMethods.CASHUP_APP_API(CashupModelObj, "EPOS_FILE_UPLOAD_COMMON").then(function (data) {
                        if (data.data == null) {
                            $scope.$parent.ShowAlertBox('Warning', "We found some changes in file, please validate uploaded file with support team", 30000);
                        }
                        else {
                            $scope.Uploading = false;
                            $scope.$parent.ShowAlertBox('Success', 'File Uploaded Succesfully', 2000);
                            $scope.GET_CASHUP_EPOS_DATA();
                            var modalEl = document.getElementById('ePos_upload');
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
        if (document.getElementById("ngexcelfile").value != '') {
            if ($scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_ID != 0) {
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
                                if ($scope.$parent.CASHUP_ENTRY_SEARCH.INTEGRATION_SYSTEM_ID == 37) {
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
                                        if ($scope.$parent.CASHUP_ENTRY_SEARCH.INTEGRATION_SYSTEM_ID == 37) {
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
            if ($scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_ID != 0) {
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
        if ($scope.$parent.CASHUP_ENTRY_SEARCH.INTEGRATION_SYSTEM_ID == 0) {
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
        else if ($scope.$parent.CASHUP_ENTRY_SEARCH.INTEGRATION_SYSTEM_ID == 12) {

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
        else if ($scope.$parent.CASHUP_ENTRY_SEARCH.INTEGRATION_SYSTEM_ID == 11) {
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
        else if ($scope.$parent.CASHUP_ENTRY_SEARCH.INTEGRATION_SYSTEM_ID == 17) {
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


    $scope.UPD_RESET_CASHUP_HEADER = function () {
        var CashupAppModelObj = new Object();
        CashupAppModelObj.CASHUP_HEADER_ID = $scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_ID;
        PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'UPD_RESET_CASHUP_HEADER').then(function (data) {
            $scope.$parent.ShowAlertBox('Warning', 'The Cashup has been Reset');
            $scope.$parent.GET_CASHUP_ENTRY_HEADER($scope.$parent.CASHUP_ENTRY_SEARCH.CASHUP_HEADER_ID);
        });
    }


    $scope.$on('$destroy', function () {
        $('.modal.show').modal('hide');
        $('.dropdown-menu').hide();
    });
});