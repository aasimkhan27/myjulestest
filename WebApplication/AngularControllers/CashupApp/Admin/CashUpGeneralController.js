/// <reference path="../cashup_entry/cashupentrycontroller.js" />
app.controller('CashUpGeneralController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    //$scope.$parent.DISPLAY_FLAG = false;
    //$scope.$parent.$parent.DISPLAY_FLAG = true;
    
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(1);
    //$scope.CASHUP_COMMON_CODE_Fn();

    $scope.selectedOption = null;  // Variable to store the selected option
    $scope.NOTIFICATION_ERROR = null;
    $scope.CashupTypeData = [];
    $scope.OptionSelected = true;
    $scope.selectedTypes = [];
    $scope.SITE_DATA = [];
    $scope.CASHUP_MANAGE_ENTRY_TYPES = [];
    $scope.AREA_LIST = [];
    $scope.Is_DELETE = false;
    $scope.Is_ADDED = false;
    $scope.ISREQUESTED_SESSION = false;
    $scope.NewSession = {
        SESSION_NAME: '',
        START_TIME: '',
        END_TIME: ''
    };
    $scope.SiteSearch = {};
    $scope.CURRENT_DATE = new Date();
    //$scope.SESSION_DETAILS = [];
    $scope.IS_EDIT_MODE = false;
    $scope.General_search = [];
    $scope.SELECTED_BRANCH = null;
    $scope.General_search.CUSTOMER_ID = $cookies.get("CUSTOMER_ID");
    $scope.General_search.ENTITY_ID = $cookies.get("ENTITY_ID");
    $scope.General_search.USER_ID = $cookies.get("USERID");
    $scope.General_search.MODULE_ID = 1;
    
    $scope.DD_DEFAULT_TEXT = $scope.$parent.DD_DEFAULT_TEXT
    $scope.ENABLE_MANAGE_ENTRY_TABS = true;
    $scope.SHOW_SAVE_BUTTON = true;
    $scope.NEW_CARD_NAME = '';
    $scope.NEW_METHOD_NAME = '';
    $scope.IS_DUPLICATE = false;
    $scope.VALIDATION_MSG = '';
    $scope.Card_search = {
        CARD_NAME: ''
    };
    $scope.GetData = true;
    $scope.NOTIFICATION_MAIL_LOG_LIST = [];
    $scope.NOTIFICATION_SEARCH = {
        CUSTOMER_ID: parseInt($cookies.get("CUSTOMER_ID")),
        ENTITY_ID: $cookies.get("ENTITY_ID"),
        USER_ID : $cookies.get("USERID"),
        SELECTED_SITE: null,
        START_DATE: null,
        END_DATE: null,
        SEARCH_TEXT: '',
        NOTIFICATION_TYPE: null,
        STATUS: 0,
        PAGE_NO:1,
        PAGE_SIZE:10
    }
    //$scope.CARDS_FORM.CARD_NAME = '';

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

    //----------------------------------------------------SCOPE_VARIABLES------------------------------------------------------------------
    $scope.ADMIN_GET_BRANCH_LIST = function () {
        var commObj = new Object();
        commObj.CUSTOMER_ID = $scope.General_search.CUSTOMER_ID;
        commObj.ENTITY_ID = $scope.General_search.ENTITY_ID;
        PrcCommMethods.CASHUP_APP_API(commObj, 'ADMIN_GET_BRANCH_LIST').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.SITES_LIST = data.data.Table;
                $scope.selectedSite = $scope.SITES_LIST.length > 0 ? $scope.SITES_LIST[0].BRANCH_NAME : '';
                $scope.GET_SESSION_MASTER_Fn();
                $scope.GET_CASHUP_BASIC_SETUP($scope.SITES_LIST);
                $scope.SITES_LIST.forEach(function (site) {
                    $scope.GET_MODE_OF_PAYMENTS(site)
                    $scope.ADMIN_GET_CU_SESSION_MAPPING_Fn(site);
                    $scope.ADMIN_GET_AREA(site);
                    $scope.GET_CASHUP_CARDS(site);
                });
                $scope.GET_NOTIFICATIONS_MASTER_BY_MODULE_ID();
            }


        });
    };

    $scope.GET_CUSTOMERS_NOTIFICATIONS = function () {
        //$scope.CUST_NOTIFICATIONS_LIST = [];
        CommonObj = new Object();
        CommonObj.CUSTOMER_ID = $scope.General_search.CUSTOMER_ID;
        CommonObj.ENTITY_ID = $scope.General_search.ENTITY_ID;
        CommonObj.MODULE_ID = $scope.General_search.MODULE_ID;
        PrcCommMethods.CASHUP_APP_API(CommonObj, 'GET_CUSTOMERS_NOTIFICATIONS').then(function (data) {
            if (data.data.Table.length > 0) {
                //$scope.CUST_NOTIFICATIONS_LIST = ;
                $scope.NOTIFICATIONS_MASTER_LIST.forEach(function (_notification) {
                    //var matchingMapping = data.data.Table.find(function (mapping) {
                    //    return _notification.TABLE_ID === mapping.NTFCTN_MSTR_ID;
                    //});
                    //if (matchingMapping) {
                    //    _notification.ACTIVE = matchingMapping.ACTIVE === true ? true : false;
                    //}


                    const relatedMappings = data.data.Table.filter(function (mapping) {
                        return _notification.TABLE_ID === mapping.NTFCTN_MSTR_ID;
                    });

                    if (relatedMappings.length > 0) {
                        _notification.ACTIVE = relatedMappings.every(m => m.ACTIVE === true);
                    }
                });
            }
        });
    }

    $scope.GET_NOTIFICATIONS_MASTER_BY_MODULE_ID = function () {
        CommonObj = new Object();
        CommonObj.MODULE_ID = $scope.General_search.MODULE_ID;
        PrcCommMethods.CASHUP_APP_API(CommonObj, 'GET_NOTIFICATIONS_MASTER_BY_MODULE_ID').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.NOTIFICATIONS_MASTER_LIST = data.data.Table;
                $scope.GET_CUSTOMERS_NOTIFICATIONS();

            }
            else {
                $scope.NOTIFICATIONS_MASTER_LIST = [];
            }
        });
    };

    $scope.ADMIN_GET_AREA = function (_site) {
        var AreaModelObj = new Object();
        AreaModelObj.CUSTOMER_ID = $scope.General_search.CUSTOMER_ID
        AreaModelObj.AREA_CODE = null;
        AreaModelObj.AREA_NAME = null;
        AreaModelObj.ACTIVE = 1;
        AreaModelObj.PAGE_NO = 0;
        AreaModelObj.PAGE_SIZE = 0;
        AreaModelObj.BRANCH_ID = _site.BRANCH_ID ? _site.BRANCH_ID : null;
        _site.areaList = [];
        PrcCommMethods.ADMIN_API(AreaModelObj, 'ADMIN_GET_AREA').then(function (data) {
            if (data.data && data.data.Table.length > 0) {
                _site.areaList = data.data.Table;
                _site.areaList.forEach(function (area) { area.HIDE_SHOW = false; });
            } else {
                return [];
            }
        });
    }

    $scope.ADMIN_GET_BRANCH_LIST();

    $scope.GET_CASHUP_BASIC_SETUP = function (Sites) {
        var CashupModelObj = {
            CUSTOMER_ID: $scope.General_search.CUSTOMER_ID,
            ENTITY_ID: $scope.General_search.ENTITY_ID
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
            } else {
                $scope.CashupTypeData = [];
                console.error("No Cashup Types available.");
            }
        }).catch(function (error) {
            console.error("Error fetching Cashup Types:", error);
        });
    }

    $scope.ADMIN_GET_CASHUP_TAB_SETTINGS = function () {
        var CashupTabsObj = {};  // Initialize the object properly
        CashupTabsObj.ENTITY_ID = parseInt($scope.General_search.ENTITY_ID); // Ensure ENTITY_ID is available

        PrcCommMethods.ADMIN_API(CashupTabsObj, 'ADMIN_GET_CASHUP_TAB_SETTINGS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.CASHUP_TABS = data.data.Table;
                $scope.GET_CASHUP_MANAGE_ENTRY_TABS();
            } else {
                console.log("No cashup tab settings found.");
            }
        })
            .catch(function (error) {
                console.error("Error fetching cashup tab settings:", error);
            });
    };

    $scope.GET_CASHUP_MANAGE_ENTRY_TABS = function () {
        var CashupModelObj = {
            CUSTOMER_ID: $scope.General_search.CUSTOMER_ID,
            ENTITY_ID: $scope.General_search.ENTITY_ID
        };

        PrcCommMethods.CASHUP_APP_API(CashupModelObj, 'GET_CASHUP_MANAGE_ENTRY_TABS').then(function (data) {
            if (data.data) {
                $scope.items = data.data.Table;
                $scope.CASHUP_TABS = $scope.CASHUP_TABS.filter(function (tab) {
                    return tab.TAB_NAME !== 'Float';
                });
                $scope.CASHUP_TABS.forEach(function (tab) {
                    $scope.SITES_LIST.forEach(function (site) {
                        var matchingItem = $scope.items.find(function (item) {
                            return item.CASHUP_TAB_ID === tab.CASHUP_TAB_ID && item.BRANCH_ID === site.BRANCH_ID;
                        });
                        site['ACTIVE_' + tab.CASHUP_TAB_ID] = matchingItem ? matchingItem.ACTIVE : false;
                    });
                });
            } else {
                $scope.CashupTypeData = [];
                console.error("No Cashup Types available.");
            }
        }).catch(function (error) {
            console.error("Error fetching Cashup Types:", error);
        });
    };

    $scope.ADMIN_GET_CASHUP_TAB_SETTINGS();

    $scope.GET_CASHUP_TYPE_MASTER_Fn = function () {
        var CashupModelObj = new Object();
        PrcCommMethods.CASHUP_APP_API(CashupModelObj, 'GET_CASHUP_TYPE_MASTER').then(function (data) {
            if (data.data) {
                $scope.selectionOptions = data.data;
            } else {
                console.error("No Cashup Types available.");
            }
        }).catch(function (error) {
            console.error("Error fetching Cashup Types:", error);
        });
    };

    $scope.GET_CASHUP_TYPE_MASTER_Fn();

    $scope.GENERAL_TAB_CLICK_Fn = function (TAB_ID) {
        $scope.GENERAL_TAB_ID = TAB_ID;
    }
    $scope.GENERAL_TAB_CLICK_Fn(1);

    $scope.GET_SESSION_MASTER_Fn = function () {
        var SessionObj = new Object();
        SessionObj.ACTIVE = 1;
        SessionObj.PAGE_NO = 1
        SessionObj.PAGE_SIZE = 999;
        PrcCommMethods.ADMIN_API(SessionObj, 'GET_SESSION_MASTER').then(function (data) {
            $scope.SESSION_LIST = data.data.Table.filter(function (session) { return session.SESSION_MASTER_ID != 6; });
            if ($scope.SESSION_LIST.length > 0) $scope.CREATE_SESSION_LIST_Fn();
        });
    }

    $scope.ADMIN_GET_CU_SESSION_MAPPING_Fn = function (_site) {
        var SessionObj = new Object();
        SessionObj.BRANCH_ID = _site.BRANCH_ID;
        PrcCommMethods.CASHUP_APP_API(SessionObj, 'GET_SESSION_BY_BRANCH').then(function (data) {
            if (data.data && data.data.length > 0) {
                _site.SESSION_LIST = data.data;
            } else {
                console.warn("No sessions found for branch ID " + _site.BRANCH_ID);
                $scope.SESSION_MAPPING_LIST = [];
            }
        })
    };

    $scope.GET_CASHUP_CARDS = function (_site) {
        var Cardobj = new Object();
        if (_site.length > 0) {
            Cardobj.BRANCH_ID = _site[0].BRANCH_ID;
        }
        else {
            Cardobj.BRANCH_ID = _site.BRANCH_ID;
        }
        
        PrcCommMethods.CASHUP_APP_API(Cardobj, 'GET_CASHUP_CARDS').then(function (data) {
            if (data.data && data.data.Table.length > 0) {
                if (_site.length > 0) {
                    angular.forEach(_site, function (_item) {
                        _item.CARDS_LIST = data.data.Table;
                        _item.isCardInputDisabled = false;
                        _item.CARDS_LIST.forEach(function (_card) { _card.HIDE_SHOW = false; });
                        let activeCount = _item.CARDS_LIST.filter(card => card.ACTIVE).length;
                        if (activeCount == 6) {
                            _item.isCardInputDisabled = true;

                        }

                    });
                }
                else {
                    _site.CARDS_LIST = data.data.Table;
                    _site.isCardInputDisabled = false;
                    _site.CARDS_LIST.forEach(function (_card) { _card.HIDE_SHOW = false; });
                    let activeCount = _site.CARDS_LIST.filter(card => card.ACTIVE).length;
                    if (activeCount == 6) {
                        _site.isCardInputDisabled = true;

                    }
                }

                
            } else {
                //console.warn("No sessions found for branch ID " + BRANCH_ID);
                //$scope.SESSION_MAPPING_LIST = [];
            }
        })
    }

    $scope.GET_MODE_OF_PAYMENTS = function (_site) {
        var PMTObj = new Object();
        PMTObj.BRANCH_ID = _site.BRANCH_ID;
        _site.PAYMENT_METHODS = [];
        PrcCommMethods.CASHUP_APP_API(PMTObj, 'GET_MODE_OF_PAYMENTS').then(function (data) {
            if (data.data && data.data.Table.length > 0) {
                _site.PAYMENT_METHODS = data.data.Table;
                _site.ismethodInputDisabled = false;
                let activeCount = _site.PAYMENT_METHODS.filter(method => method.ACTIVE).length;
                if (activeCount == 15) {
                    _site.ismethodInputDisabled = true;

                }
                _site.PAYMENT_METHODS.forEach(function (_method) { _method.HIDE_SHOW = false; });
            } else {
                //console.warn("No sessions found for branch ID " + BRANCH_ID);
                //$scope.SESSION_MAPPING_LIST = [];
            }
        })
    }

    //------------------------------------------------GET_DONE------------------------------------------------------------------

    $scope.CREATE_SESSION_LIST_Fn = function () {
        $scope.SESSION_DETAILS = [];
        angular.forEach($scope.SESSION_LIST, function (session) {
            let sessionDetails = {
                SESSION_MASTER_ID: session.SESSION_MASTER_ID,
                SESSION_NAME: session.SESSION_NAME,
                SESSION_START: '',
                SESSION_END: '',
                ACTIVE: false
            };

            // Push the newly created session object into SESSION_DETAILS array
            $scope.SESSION_DETAILS.push(sessionDetails);
        });
    }

    $scope.selectOption = function (site, selectedCASHUP_TYPE_MSTR_ID, selectedCASHUP_TYPE) {
        $scope.SHOW_SAVE_BUTTON = false;

        site.CASHUP_TYPE = selectedCASHUP_TYPE;
        site.WILL_USE_IN_CASHUP = selectedCASHUP_TYPE_MSTR_ID === "" ? false : true;

        var siteData = {
            BRANCH_ID: site.BRANCH_ID,
            CASHUP_TYPE_MSTR_ID: selectedCASHUP_TYPE_MSTR_ID === "" ? null : selectedCASHUP_TYPE_MSTR_ID
        };

        $scope.SITE_DATA = $scope.SITE_DATA.filter(s => s.BRANCH_ID !== site.BRANCH_ID);

        $scope.SITE_DATA.push(siteData);

        site.CASHUP_TYPE_MSTR_ID = selectedCASHUP_TYPE_MSTR_ID;
    };

    $scope.ADD_NEW_CARD = function (_site) {

    };

    $scope.FILTER_Fn = function (site) {

        if ($scope.SITES_LIST.length === $scope.SITES_LIST.filter(site => site.IS_SELECTED).length) {
            $scope.SiteSearch.SelectAllSites = true;
        }
        else if ($scope.SITES_LIST.filter(site => !site.IS_SELECTED).length === $scope.SITES_LIST.length) {
            $scope.$parent.ShowAlertBox("Success", site.BRANCH_NAME + 'is Selected', 3000);
            //SITE_COUNT = 0;
        }
        else {
            $scope.SiteSearch.SelectAllSites = false;
        }

    };

    $scope.SITES_APPLY_ALL_Fn = function (SITE_COUNT) {
        $scope.SiteSearch.SelectAllSites = true;
        if (SITE_COUNT == $scope.SITES_LIST.length) {
            $scope.SiteSearch.SelectAllSites = false;
            $scope.$parent.ShowAlertBox("Success", "All sites deselected", 3000);
        }
        angular.forEach($scope.SITES_LIST, function (site) {
            site.IS_SELECTED = $scope.SiteSearch.SelectAllSites;
        });
    };

    $scope.MAP_SESSIONS = function (sessionMappings, BRANCH_ID) {
        var sessionHandled = false;

        angular.forEach($scope.SESSION_LIST, function (session) {
            var matchingMapping = sessionMappings.find(function (mapping) {
                return mapping.SESSION_MASTER_ID === session.SESSION_MASTER_ID;
            });

            if (matchingMapping) {
                session.START_TIME = moment(matchingMapping.SESSION_START, 'HH:mm:ss');
                session.END_TIME = moment(matchingMapping.SESSION_END, 'HH:mm:ss').format('HH:mm');
                session.BRANCH_ID = BRANCH_ID;

                if (matchingMapping.SESSION_MASTER_ID === 4) {
                    if (matchingMapping.USE_IN_CASHUP === true) {
                        session.active = true;
                        angular.forEach($scope.SESSION_LIST, function (otherSession) {
                            if (otherSession.SESSION_MASTER_ID !== 4) {
                                otherSession.active = false;
                            }
                        });
                        sessionHandled = true;
                    } else {
                        session.active = false;
                    }
                }

                if (!sessionHandled) {
                    session.active = matchingMapping.USE_IN_CASHUP ? true : false;
                }
            }
            return;
        });

        $scope.filteredSessions = $scope.SESSION_LIST;

    };

    $scope.UPDATE_AREA_Fn = function (area, newName, newCapacity, site) {
        if (!newName || !newCapacity) {
            alert("Both fields are required.");
            return;
        }

        area.AREA_NAME = newName;
        area.SEATING_CAPACITY = newCapacity;

        $scope.newArea = { name: '', capacity: '' };
        $scope.selectedArea = null;
        $scope.editMode = false;
    };

    $scope.SET_NOTIFICATION = function (_notification) {
        _notification.ACTIVE = _notification.ACTIVE ? true : false;
    }

    $scope.ADD_AREA_Fn = function (site) {
        if (!site.newArea.name || !site.newArea.capacity) {
            $scope.$parent.ShowAlertBox('Error', "Both fields are required.");
            return;
        }
        if (site.newArea.name && site.newArea.capacity) {
            site.areaList.forEach(function (_area) {
                if (site.newArea.name == _area.AREA_NAME && site.newArea.capacity == _area.SEATING_CAPACITY ) {
                    $scope.IS_DUPLICATE = true;
                }

            });
        }
        if ($scope.IS_DUPLICATE) {
            $scope.$parent.ShowAlertBox('Error', "Area " + site.newArea.name + " already exits. Please choose different name.", 3000);
            return;
        }
        var AreaModelObj = {
            AREA_ID: site.editMode ? site.selectedArea.AREA_ID : 0,
            AREA_NAME: site.newArea.name,
            SEATING_CAPACITY: site.newArea.capacity,
            ACTIVE: 1,
            USER_ID: parseInt($scope.General_search.USER_ID),
            BRANCH_ID: site.BRANCH_ID
        };

        $scope.ADMIN_INS_UPD_AREA_Fn(AreaModelObj, site);
    };

    $scope.EDIT_AREA_Fn = function (site, area) {
        site.newArea = {
            name: area.AREA_NAME,
            capacity: area.SEATING_CAPACITY
        };
        site.selectedArea = area;
        site.editMode = true;
    };

    $scope.EDIT_CARD_Fn = function (_card) {
        _card.OLD_NAME = _card.CARD_NAME;
        _card.HIDE_SHOW = !_card.HIDE_SHOW;
    }

    $scope.EDIT_METHOD_Fn = function (_method) {
        _method.OLD_NAME = _method.METHOD_NAME;
        _method.HIDE_SHOW = !_method.HIDE_SHOW;
    }

    $scope.SELECT_SITE = function (site) {
        $scope.selectedSite = site.BRANCH_NAME;
    }

    $scope.UPDATE_END_TIMES = function (_session) {

        let BreakfastSessionIndex = $scope.SESSION_DETAILS.findIndex(s => s.SESSION_MASTER_ID === 1);
        let LunchSessionIndex = $scope.SESSION_DETAILS.findIndex(s => s.SESSION_MASTER_ID === 2);
        let DinnerSessionIndex = $scope.SESSION_DETAILS.findIndex(s => s.SESSION_MASTER_ID === 3);
        let AlldaySessionIndex = $scope.SESSION_DETAILS.findIndex(s => s.SESSION_MASTER_ID === 4);

        if (_session.SESSION_MASTER_ID === 1) {
            $scope.SESSION_DETAILS[BreakfastSessionIndex].SESSION_START = moment(_session.SESSION_START, 'HH:mm');
            $scope.SESSION_DETAILS[AlldaySessionIndex].SESSION_START = moment(_session.SESSION_START, 'HH:mm');
            return;
        }

        if (_session.SESSION_MASTER_ID === 2) { // Lunch
            $scope.SESSION_DETAILS[BreakfastSessionIndex].SESSION_END = $scope.SESSION_DETAILS[BreakfastSessionIndex].SESSION_START ? moment(_session.SESSION_START, 'HH:mm').subtract(1, 'minute').format('HH:mm') : null;
            $scope.SESSION_DETAILS[LunchSessionIndex].SESSION_START = moment(_session.SESSION_START, 'HH:mm');
            return;
        }

        if (_session.SESSION_MASTER_ID === 3) { // Dinner
            $scope.SESSION_DETAILS[DinnerSessionIndex].SESSION_START = moment(_session.SESSION_START, 'HH:mm');
            $scope.SESSION_DETAILS[LunchSessionIndex].SESSION_END = $scope.SESSION_DETAILS[LunchSessionIndex].SESSION_START ? moment(_session.SESSION_START, 'HH:mm').subtract(1, 'minute').format('HH:mm') : null;
            $scope.SESSION_DETAILS[DinnerSessionIndex].SESSION_END = $scope.SESSION_DETAILS[DinnerSessionIndex].SESSION_START ? moment($scope.SESSION_DETAILS[BreakfastSessionIndex].SESSION_START, 'HH:mm').subtract(1, 'minute').format('HH:mm') : null;
            $scope.SESSION_DETAILS[AlldaySessionIndex].SESSION_END = $scope.SESSION_DETAILS[AlldaySessionIndex].SESSION_START ? moment($scope.SESSION_DETAILS[DinnerSessionIndex].SESSION_END, 'HH:mm').format('HH:mm') : null;

            return;
        }

        if (_session.SESSION_MASTER_ID === 4) { // All day
            $scope.SESSION_DETAILS[AlldaySessionIndex].SESSION_END = moment(_session.SESSION_START, 'HH:mm').subtract(1, 'minute').format('HH:mm');
            return;
        }

    };

    $scope.VALIDATE_SESSIONS = function (filteredSessions) {

        let _breakFast = filteredSessions.find(session => session.SESSION_MASTER_ID === 1);
        let _allDay = filteredSessions.find(session => session.SESSION_MASTER_ID === 4);


        if (moment(_breakFast.SESSION_START, 'HH:mm').format('HH:mm:00') != moment(_allDay.SESSION_START, 'HH:mm').format('HH:mm:00')) {
            $scope.VALIDATION_MSG = "First session Start time shall match with All Day start time. Please update to proceed"
            $('#session_setup ').modal('show');
            return false;
        }

        let activeSessionCount = 0;
        angular.forEach(filteredSessions, function (session) {
            if (!session.SESSION_START || !session.SESSION_END) {
                $scope.VALIDATION_MSG = "Please update session " + session.SESSION_NAME + " Start timings before proceeding"
                $('#session_setup ').modal('show');
                return false;
            }

            if (session.ACTIVE && session.SESSION_MASTER_ID != 4) {
                activeSessionCount++;
            }
            else if (session.ACTIVE && session.SESSION_MASTER_ID == 4) {
                activeSessionCount = 3
            }

        });
        if (activeSessionCount < 2) {
            //$scope.$parent.ShowAlertBox("Error", "At least two sessions must be active.", 3000);
            $scope.VALIDATION_MSG = "You have to activate minimum 2 sessions for carrying out cash up."
            $('#session_setup ').modal('show');
            return false;
        }
        return true;
    };

    $scope.SAVE_SESSIONS = function (SESSIONS_DATA) {
        $scope.SESSION_MAP_LIST = [];

        if ($scope.VALIDATE_SESSIONS(SESSIONS_DATA)) {
            angular.forEach($scope.SITES_LIST, function (_site) {
                //if (_site.SESSION_LIST) {
                    
                //}
                if (_site.IS_SELECTED && _site.WILl_USE_IN_CASHUP) {
                    angular.forEach(SESSIONS_DATA, function (_session) {

                        let newSession = angular.copy(_session);
                        newSession.BRANCH_ID = _site.BRANCH_ID;
                        $scope.SESSION_MAP_LIST.push(newSession);
                    });
                }  
            });
            $scope.CU_SESSION_MAPPING_TYPE = [];
            var SessionObj = new Object;
            SessionObj.CUSTOMER_ID = $scope.General_search.CUSTOMER_ID;
            SessionObj.ENTITY_ID = $scope.General_search.ENTITY_ID;
            SessionObj.USER_ID = $scope.General_search.USER_ID;
            SessionObj.CU_SESSION_MAPPING_TYPE = [];
            angular.forEach($scope.SESSION_MAP_LIST, function (session) {
                var readOnly = new Object;
                readOnly.SESSION_MASTER_ID = session.SESSION_MASTER_ID ? session.SESSION_MASTER_ID : 0,
                    readOnly.BRANCH_ID = session.BRANCH_ID, // Handle undefined branch
                    readOnly.SESSION_START = moment(session.SESSION_START, 'HH:mm').format('HH:mm:00'),
                    readOnly.END_TIME = moment(session.SESSION_END, 'HH:mm').format('HH:mm:59'),
                    readOnly.ACTIVE = session.ACTIVE ? 1 : 0 // Convert boolean to BIT type (1 or 0)
                SessionObj.CU_SESSION_MAPPING_TYPE.push(readOnly);
            });
            $scope.ADMIN_INS_UPD_CU_SESSION_MAPPING(SessionObj);

        }





    }

    $scope.REQUEST_SESSION = function () {
        $('#request_session').modal('show');
    }

    $scope.DELETE_AREA_Fn = function (site, area) {
        var AreaModelObj = {
            AREA_ID: area.AREA_ID || 0,
            AREA_CODE: null,
            AREA_NAME: area.AREA_NAME,
            ACTIVE: 0,
            SEATING_CAPACITY: area.SEATING_CAPACITY,
            USER_ID: parseInt($scope.General_search.USER_ID),
            BRANCH_ID: site.BRANCH_ID
        };
        site.editMode = false;
        $scope.ADMIN_INS_UPD_AREA_Fn(AreaModelObj, site);
    }

    $scope.SELECT_SITE_FOR_NEW_SESSION = function (BRANCH_ID) {
        $scope.SELECTED_SITE_FOR_NEW_SESSION = BRANCH_ID;
    }

    $scope.HANDLE_ACTIVE_CHANGE_Fn = function (session) {
        if (session.SESSION_MASTER_ID == 4 && session.ACTIVE == true) {
            angular.forEach($scope.SESSION_DETAILS, function (SESSION) {
                if (SESSION.SESSION_MASTER_ID != 4) {
                    SESSION.ACTIVE = false;
                }
            });
        }
        else if (session.SESSION_MASTER_ID != 4 && session.ACTIVE == true) {
            angular.forEach($scope.SESSION_DETAILS, function (SESSION) {
                if (SESSION.SESSION_MASTER_ID === 4) {
                    SESSION.ACTIVE = false;
                }
            });
        }
    };

    $scope.handleKeyPress = function ($event, site, field) {
        if ($event.keyCode === 13) {
            $event.preventDefault();
            if (field === 'name') {
                document.getElementById(`seating-${site.BRANCH_ID}`).focus();
            } else if (field === 'capacity') {
                document.getElementById(`save-${site.BRANCH_ID}`).click();
            }
        }
    };

    $scope.filterSuggestions = function (site) {
        if (site.newArea.name.length >= 1) {
            var Params = new Object();
            Params.BRANCH_ID = site.BRANCH_ID
            PrcCommMethods.CASHUP_APP_API(Params, 'GET_CASHUP_AREA_SUGGETIONS').then(function (data) {
                site.filteredSuggestions = data.data.map(function (area) {
                    return area.AREA_NAME;
                });
            }, function (error) {
                console.error("Error fetching suggestions:", error);
            });
        } else {
            site.filteredSuggestions = [];
        }
    };

    $scope.SET_DROPSCROLL = function () {
        $('.AddCustomScroll_Contact').find('.dropdown-menu').addClass('scrollbar-wrapper w-100');
        $('.AddCustomScroll_Contact').find('.dropdown-menu li').addClass('p-2');
    };

    $scope.EDIT_SESSION = function (_site) {
        $scope.IS_EDIT_MODE = true;
        $scope.SELECTED_BRANCH = _site;
        angular.forEach($scope.SITES_LIST, function (site) {
            if (site.BRANCH_ID == _site.BRANCH_ID) {
                site.IS_SELECTED = true;
            }
            else {
                site.IS_SELECTED = false;
            }
        });

        
        angular.forEach(_site.SESSION_LIST, function (session) {
            let existingSession = $scope.SESSION_DETAILS.find(item => item.SESSION_MASTER_ID === session.SESSION_MASTER_ID);
            if (existingSession) {
                existingSession.SESSION_START = moment(session.SESSION_START, "HH:mm");
                existingSession.SESSION_END = moment(session.SESSION_END, "HH:mm:ss").format("HH:mm");;
                existingSession.ACTIVE = session.ACTIVE;
                existingSession.SESSION_MAPPING_ID = session.SESSION_MAPPING_ID ? session.SESSION_MAPPING_ID : 0;
                existingSession.SESSION_DISABLED = _site.CASHUP_TYPE_MSTR_ID == 1 && (existingSession.SESSION_MASTER_ID == 1 || existingSession.SESSION_MASTER_ID == 2 || existingSession.SESSION_MASTER_ID == 3) ? true : false;
            }
        });
        
        if (_site.SESSION_LIST == undefined) {
            angular.forEach($scope.SESSION_DETAILS, function (_row) {
                _row.SESSION_START = null;
                _row.SESSION_END = null;
                _row.ACTIVE = false;
                _row.SESSION_MAPPING_ID = 0;
                _row.SESSION_DISABLED = _site.CASHUP_TYPE_MSTR_ID == 1 && (_row.SESSION_MASTER_ID == 1 || _row.SESSION_MASTER_ID == 2 || _row.SESSION_MASTER_ID == 3)? true:false;
            })
        }
    }
    $scope.VALIDATE_CARD_NAME = function () {
        const regex = /^[a-zA-Z][a-zA-Z0-9 _]*$/;
        //const regex = /^[a-zA-Z][a-zA-Z0-9 ]*$/;
        if (!regex.test($scope.NEW_CARD_NAME)) {
            $scope.$parent.ShowAlertBox("Error", "Invalid Card Name Format", 3000);
            $scope.NEW_CARD_NAME = null;
        }
    }

    $scope.VALIDATE_CARD_NAME_Fn = function (_card_name) {
        const regex = /^[a-zA-Z][a-zA-Z0-9 _]*$/;
        //const regex = /^[a-zA-Z][a-zA-Z0-9 ]*$/;
        return !regex.test(_card_name);
        //if (!regex.test(_card_name)) {
        //    //$scope.$parent.ShowAlertBox("Error", "Invalid Card Name Format", 3000);
        //    //$scope.NEW_CARD_NAME = null;
        //    return false;
        //}
    }
    $scope.VALIDATE_CARDS = function (_site, card_Name, _call_Flag) {
        var returnFlag = true;
        if (_call_Flag == 1 || _call_Flag == 2) {
            if (_call_Flag == 1) {
                if (card_Name.CARD_NAME.trim().toUpperCase().length == 0 || $scope.VALIDATE_CARD_NAME_Fn(card_Name.CARD_NAME.trim().toUpperCase())) {
                    $scope.$parent.ShowAlertBox('Error', "Please Enter Valid Card Name", 3000);
                    return false;
                }
            }
            else if (_call_Flag == 2) {
                card_Name = card_Name.trim().toUpperCase();
                if (card_Name.length == 0 || $scope.VALIDATE_CARD_NAME_Fn(card_Name)) {
                    $scope.$parent.ShowAlertBox('Error', "Please Enter Valid Card Name", 3000);
                    return false;
                }
            }
            if (_site.BRANCH_ID == null || _site.BRANCH_ID == undefined) {
                $scope.$parent.ShowAlertBox('Error', "Please Select a Branch", 3000);
                returnFlag = false;
            }
            angular.forEach(_site.CARDS_LIST, function (_card) {
                if (_call_Flag == 1 && _card.CASHUP_CARD_ID != card_Name.CASHUP_CARD_ID && _card.CARD_NAME.trim().toUpperCase() === card_Name.CARD_NAME.trim().toUpperCase()) {
                    $scope.$parent.ShowAlertBox('Error', card_Name.CARD_NAME + " exists in " + _site.BRANCH_NAME, 3000);
                    returnFlag = false;
                }
                else if (_card.CARD_NAME.trim().toUpperCase() === card_Name && _call_Flag == 2) {
                    $scope.$parent.ShowAlertBox('Error', card_Name + " exists in " + _site.BRANCH_NAME, 3000);
                    returnFlag = false;
                }
            });
        }
        else if (_call_Flag == 3) {
            card_Name = card_Name.trim().toUpperCase();
            if (card_Name.length == 0 || $scope.VALIDATE_CARD_NAME_Fn(card_Name)) {
                $scope.$parent.ShowAlertBox('Error', "Please Enter Valid Card Name", 3000);
                returnFlag = false;
            }
            if (_site.length > 0) {
                angular.forEach(_site, function (site) {
                    angular.forEach(site.CARDS_LIST, function (_card) {
                        if (_card.CARD_NAME.trim().toUpperCase() === card_Name) {
                            $scope.$parent.ShowAlertBox('Error', card_Name + " exists in " + site.BRANCH_NAME, 3000);
                            returnFlag = false;
                        }
                    });
                });
            }
            else {
                $scope.$parent.ShowAlertBox('Error', "Please Select a Branch", 3000);
                returnFlag = false;
            }
        }
        else if (_call_Flag == 4) {

        }
        return returnFlag;
    };

    $scope.VALIDATE_METHODS = function (_site, method_name, _call_Flag) {
        var returnFlag = true;
        if (_call_Flag == 1) {
            method_name = method_name.trim().toUpperCase();
            if (method_name.length == 0) {
                $scope.$parent.ShowAlertBox('Error', "Please Enter Valid Method Name", 3000);
                returnFlag = false;
            }
            if (_site.length > 0) {
                angular.forEach(_site, function (site) {
                    angular.forEach(site.PAYMENT_METHODS, function (_method) {
                        if (_method.METHOD_NAME.trim().toUpperCase() === method_name) {
                            $scope.$parent.ShowAlertBox('Error', method_name + " exists in " + site.BRANCH_NAME, 3000);
                            returnFlag = false;
                        }
                    });
                });
            }
            else {
                $scope.$parent.ShowAlertBox('Error', "Please Select a Branch", 3000);
                returnFlag = false;
            }
        }
        else if (_call_Flag == 2) {
            if (method_name.METHOD_NAME.trim().toUpperCase().length == 0) {
                $scope.$parent.ShowAlertBox('Error', "Please Enter Valid Method Name", 3000);
                returnFlag = false;
            }
            if (_site.BRANCH_ID == null || _site.BRANCH_ID == undefined) {
                $scope.$parent.ShowAlertBox('Error', "Please Select a Branch", 3000);
                returnFlag = false;
            }
            angular.forEach(_site.PAYMENT_METHODS, function (_method) {
                if (_method.MODE_OF_PAYMENT_ID != method_name.MODE_OF_PAYMENT_ID && _method.METHOD_NAME.trim().toUpperCase() === method_name.METHOD_NAME.trim().toUpperCase()) {
                    $scope.$parent.ShowAlertBox('Error', method_name.METHOD_NAME + " exists in " + _site.BRANCH_NAME, 3000);
                    returnFlag= false;
                }
            });
        }
        else if (_call_Flag == 3) {
            method_name = method_name.trim().toUpperCase();
            if (method_name.length == 0) {
                $scope.$parent.ShowAlertBox('Error', "Please Enter Valid Method Name", 3000);
                returnFlag = false;
            }
            if (_site.BRANCH_ID != null && _site.BRANCH_ID != undefined) {
                angular.forEach(_site.PAYMENT_METHODS, function (_method) {
                    if (_method.METHOD_NAME.trim().toUpperCase() === method_name) {
                        $scope.$parent.ShowAlertBox('Error', method_name + " exists in " + _site.BRANCH_NAME, 3000);
                        returnFlag = false;
                    }
                });
            }
            else {
                $scope.$parent.ShowAlertBox('Error', "Please Select a Branch", 3000);
                returnFlag = false;
            }
        }
        
        return returnFlag;
    };

    $scope.HANDLE_ACTIVE_SWITCH_CARDS = function (site, card) {
        let activeCount = site.CARDS_LIST.filter(card => card.ACTIVE).length;
        if (activeCount == 6) { site.isCardInputDisabled = true; }
        if (activeCount > 6) {
            $scope.IS_EDIT_MODE = true;
            $scope.$parent.ShowAlertBox('Error', site.BRANCH_NAME + " site can only have 6 card types activated at a time", 3000);
            card.ACTIVE = false;
            //let lastActivated = site.CARDS_LIST.find(card => card.ACTIVE && !card.wasAlreadyActive);
            //if (lastActivated) {
            //    lastActivated.ACTIVE = false;
            //}

            return;
        }
        $scope.INS_UPD_CASHUP_CARDS(site, card, 4);
        site.CARDS_LIST.forEach(card => {
            card.wasAlreadyActive = card.ACTIVE;
        });
    };

    $scope.HANDLE_ACTIVE_SWITCH_METHODS = function (site, method) {
        let activeCount = site.PAYMENT_METHODS.filter(method => method.ACTIVE).length;
        if (activeCount == 15) site.ismethodInputDisabled = true;
        if (activeCount > 15) {
            $scope.$parent.ShowAlertBox('Error', site.BRANCH_NAME + " site can only have 15 Ppayment method types activated at a time", 3000);
            method.ACTIVE = false;
            //let lastActivated = site.PAYMENT_METHODS.find(method => method.ACTIVE && !method.wasAlreadyActive);
            //if (lastActivated) {
            //    lastActivated.ACTIVE = false;
            //}

            return;
        }
        $scope.INS_UPD_MODE_OF_PAYMENTS(site, method, 4)
        site.PAYMENT_METHODS.forEach(method => {
            method.wasAlreadyActive = method.ACTIVE;
        });
    };

    $scope.CHECK_TAB_TOGGLE_PRIVILEGE = function (item, site) {
        if (item.CASHUP_TAB_ID == 1 || item.CASHUP_TAB_ID == 11) {
            return site['ACTIVE_' + item.CASHUP_TAB_ID];
        }
        else return false;
        //return false;
    }

    //-----------------------------------------------TOGGLE_FUNCTIONS_DONE---------------------------------------------------------

    $scope.INS_UPD_CASHUP_BASIC_SETUP = function () {


        var BasicObj = new Object();
        BasicObj.CUSTOMER_ID = $scope.General_search.CUSTOMER_ID;
        BasicObj.ENTITY_ID = $scope.General_search.ENTITY_ID;
        BasicObj.USER_ID = $scope.General_search.USER_ID;
        BasicObj.CASHUP_TYPE_TABLE = [];

        angular.forEach($scope.SITE_DATA, function (_loop_value) {
            var readonly = new Object();
            readonly.BRANCH_ID = _loop_value.BRANCH_ID;
            readonly.CASHUP_TYPE_MSTR_ID = _loop_value.CASHUP_TYPE_MSTR_ID;
            BasicObj.CASHUP_TYPE_TABLE.push(readonly);
        })

        PrcCommMethods.CASHUP_APP_API(BasicObj, 'INS_UPD_CASHUP_TYPE').then(function (data) {
            if (data.data) {
                $scope.GET_CASHUP_BASIC_SETUP($scope.SITES_LIST);
                $scope.ENABLE_MANAGE_ENTRY_TABS = false;
                $scope.$parent.ShowAlertBox("Success", 'Cashup Type saved Successfully.', 3000);
            } else {
                $scope.CashupTypeData = [];

            }
        }).catch(function (error) {
            console.error("Error fetching Cashup Types:", error);
        });

    };

    $scope.INS_UPD_CASHUP_MANAGE_ENTRY_TABS_Fn = function () {
        var BasicObj = new Object();
        BasicObj.CUSTOMER_ID = $scope.General_search.CUSTOMER_ID
        BasicObj.ENTITY_ID = $scope.General_search.ENTITY_ID;
        BasicObj.USER_ID = $scope.General_search.USER_ID;
        BasicObj.CASHUP_MANAGE_ENTRY_TYPE_TABLE = [];

        angular.forEach($scope.CASHUP_MANAGE_ENTRY_TYPES, function (_loop_value) {
            var readonly = new Object();
            readonly.CASHUP_TAB_ID = _loop_value.CASHUP_TAB_ID;
            readonly.BRANCH_ID = _loop_value.BRANCH_ID;
            readonly.ACTIVE = _loop_value.ACTIVE;
            BasicObj.CASHUP_MANAGE_ENTRY_TYPE_TABLE.push(readonly);
        })

        PrcCommMethods.CASHUP_APP_API(BasicObj, 'INS_UPD_CASHUP_MANAGE_ENTRY_TABS').then(function (data) {
            if (data.data) {
                $scope.$parent.ShowAlertBox("Success", 'Cashup Entry Tabs Updated Successfully.', 3000);
                $scope.SHOW_SAVE_BUTTON = false;
            } else {
                $scope.CashupTypeData = [];
                console.error("No Cashup Types available.");
            }
        }).catch(function (error) {
            console.error("Error Saving Cashup Types:", error);
        });
    }

    $scope.ADMIN_INS_UPD_AREA_Fn = function (Params, site) {
        PrcCommMethods.ADMIN_API(Params, 'ADMIN_INS_UPD_AREA').then(function (data) {
            if (data.status == 200) {
                $scope.ADMIN_GET_AREA(site);
                if (Params.ACTIVE != 0) {
                    var message = site.editMode ? "Area Updated Successfully" : "Area Saved Successfully";
                    $scope.$parent.ShowAlertBox("Success", message, 3000);
                }
                if (Params.ACTIVE === 0) {
                    $scope.$parent.ShowAlertBox("Success", 'Area Deleted Successfully', 3000);
                }
                site.newArea = { name: '', capacity: '' };
                site.selectedArea = null;
                site.editMode = false;
            }
        });
    };

    $scope.MANAGE_ENTRY_TABS = function (item, site, ISACTIVE) {
        $scope.cashupManageEntryType = {
            CASHUP_TAB_ID: item.CASHUP_TAB_ID,
            BRANCH_ID: site.BRANCH_ID,
            ACTIVE: ISACTIVE
        };

        var existingEntry = $scope.CASHUP_MANAGE_ENTRY_TYPES.find(function (entry) {
            return entry.BRANCH_ID === site.BRANCH_ID && entry.CASHUP_TAB_ID === item.CASHUP_TAB_ID;
        });

        if (existingEntry) {
            existingEntry.ACTIVE = ISACTIVE;
        } else {
            $scope.CASHUP_MANAGE_ENTRY_TYPES.push($scope.cashupManageEntryType);
        }
        $scope.CASHUP_TABS.forEach(function (tab) {
            if (tab.CASHUP_TAB_ID === item.CASHUP_TAB_ID) {
                $scope.SITES_LIST.forEach(function (site) {
                    if (site.BRANCH_ID === tab.BRANCH_ID) {
                        site['ACTIVE_' + item.CASHUP_TAB_ID] = ISACTIVE;
                    }
                });
            }
        });
    };

    $scope.SUBMIT_SESSION = function (session) {
        if (!session.SESSION_NAME) {
            $scope.$parent.ShowAlertBox("Error", 'Session name required', 3000);
            return;
        }
        if (!session.START_TIME) {
            $scope.$parent.ShowAlertBox("Error", 'Start Time is required.', 3000);
            return;
        }
        if (!session.END_TIME) {
            $scope.$parent.ShowAlertBox("Error", 'End Time is required.', 3000);
            return;
        }

        const startTime = parseTime(session.START_TIME);
        const endTime = parseTime(session.END_TIME);

        if (startTime >= endTime) {
            $scope.$parent.ShowAlertBox("Error", 'Start Time must be earlier than End Time.', 3000);
            return;
        }

        const requestData = {
            SESSION_NAME: session.SESSION_NAME,
            START_TIME: session.START_TIME,
            END_TIME: session.END_TIME,
            SITE: $scope.selectedSite
        };

    };

    

    $scope.ADMIN_INS_UPD_CU_SESSION_MAPPING = function (Params) {
        document.getElementById("loader").style.display = "block";
        PrcCommMethods.CASHUP_APP_API(Params, 'ADMIN_INS_UPD_CU_SESSION_MAPPING').then(function (data) {
            document.getElementById("loader").style.display = "none";
            if (data.data > 0) {
                if ($scope.IS_EDIT_MODE) {
                    $scope.$parent.ShowAlertBox("Success", "Sessions Updated succesfully", 3000);

                }
                else {
                    $scope.$parent.ShowAlertBox("Success", "Sessions Added succesfully", 3000);

                }
                $scope.SITES_LIST.forEach(function (site) {
                    site.IS_SELECTED = false;
                    $scope.ADMIN_GET_CU_SESSION_MAPPING_Fn(site);
                    //if (site.IS_SELECTED && site.WILl_USE_IN_CASHUP) $scope.ADMIN_GET_CU_SESSION_MAPPING_Fn(site);

                });
                if ($scope.SESSION_LIST.length > 0) $scope.CREATE_SESSION_LIST_Fn();

            }
            else {
                return false;
            }
        });
    }

    $scope.INS_UPD_CASHUP_CARDS = function (_site, card, _call_Flag) {
        var cardObj = new Object();
        cardObj.ENTITY_ID = $scope.General_search.ENTITY_ID;
        cardObj.CUSTOMER_ID = $scope.General_search.CUSTOMER_ID;
        cardObj.USER_ID = $scope.General_search.USER_ID;
        cardObj.CASHUP_CARD_TYPE = [];
        if ($scope.VALIDATE_CARDS(_site, card, _call_Flag)) { //$scope.VALIDATE_CARDS(_site, card.CARD_NAME ? card.CARD_NAME : card, _call_Flag)
            if (_call_Flag == 2) {
                var readOnly = new Object();
                readOnly.CASHUP_CARD_ID = 0,
                    readOnly.CARD_NAME = card.replace(/\s+/g, ''),
                    readOnly.BRANCH_ID = _site.BRANCH_ID,
                    readOnly.ACTIVE = 0,
                    cardObj.CASHUP_CARD_TYPE.push(readOnly);
            }
            if (_call_Flag == 1) {
                var readOnly = new Object();
                readOnly.CASHUP_CARD_ID = card.CASHUP_CARD_ID,
                    readOnly.CARD_NAME = card.CARD_NAME.replace(/\s+/g, ''),
                    readOnly.BRANCH_ID = _site.BRANCH_ID,
                    readOnly.ACTIVE = card.ACTIVE ? 1 : 0
                cardObj.CASHUP_CARD_TYPE.push(readOnly);
            }
            if (_call_Flag == 3) {
                angular.forEach(_site, function (site) {
                    var readOnly = new Object();
                    readOnly.CASHUP_CARD_ID = 0,
                        readOnly.CARD_NAME = card.replace(/\s+/g, ''),
                        readOnly.BRANCH_ID = site.BRANCH_ID,
                        readOnly.ACTIVE = 0,
                        cardObj.CASHUP_CARD_TYPE.push(readOnly);
                });
            }
            if (_call_Flag == 4) {
                var readOnly = new Object();
                readOnly.CASHUP_CARD_ID = card.CASHUP_CARD_ID,
                    readOnly.CARD_NAME = card.CARD_NAME.replace(/\s+/g, ''),
                    readOnly.BRANCH_ID = _site.BRANCH_ID,
                    readOnly.ACTIVE = card.ACTIVE ? 1 : 0
                cardObj.CASHUP_CARD_TYPE.push(readOnly);
            }

            PrcCommMethods.CASHUP_APP_API(cardObj, 'INS_UPD_CASHUP_CARDS').then(function (data) {
                if (data.status == 200) {
                    if (data.data == 1) {
                        $scope.GET_CASHUP_CARDS(_site);
                    }
                    else if (_site.length > 1) {
                        angular.forEach(_site, function (site) {
                            $scope.GET_CASHUP_CARDS(site);
                            site.IS_SELECTED = false;
                        });
                    }
                    _site.NEW_CARD_NAME = '';
                    $scope.NEW_CARD_NAME = '';
                    if (card.CASHUP_CARD_ID && data.data != -1) {
                        $scope.$parent.ShowAlertBox("Success", "Card Updated Successfully", 3000);
                    }
                    if (card.CASHUP_CARD_ID === undefined && data.data != -1) {
                        $scope.$parent.ShowAlertBox("Success", 'Cards added Successfully', 3000);
                    }
                    _site.newArea = { name: '', capacity: '' };
                    _site.selectedArea = null;
                    _site.editMode = false;
                    $scope.SiteSearch.SelectAllSites = false;
                    //$scope.ADMIN_GET_BRANCH_LIST();
                }
            });
        }
        else {
            $scope.NEW_CARD_NAME = null;

            if (_call_Flag == 1) {
                card.CARD_NAME = card.OLD_NAME;
                card.HIDE_SHOW = false;
            }
            _site.editMode = false;
            
        }
    }

    $scope.INS_UPD_MODE_OF_PAYMENTS = function (_site, method, _call_Flag) {
        var cardObj = new Object();
        cardObj.ENTITY_ID = $scope.General_search.ENTITY_ID;
        cardObj.CUSTOMER_ID = $scope.General_search.CUSTOMER_ID;
        cardObj.USER_ID = $scope.General_search.USER_ID;
        cardObj.MODE_OF_PAYMENTS_TYPE = [];
        if ($scope.VALIDATE_METHODS(_site, method, _call_Flag)) {   //$scope.VALIDATE_METHODS(_site, method.METHOD_NAME ? method.METHOD_NAME : method, _call_Flag)
            if (_call_Flag == 2) {
                var readOnly = new Object();
                readOnly.MODE_OF_PAYMENT_ID = method.MODE_OF_PAYMENT_ID;
                readOnly.METHOD_NAME = method.METHOD_NAME;
                readOnly.CUSTOMER_ID = $scope.General_search.CUSTOMER_ID;
                readOnly.BRANCH_ID = _site.BRANCH_ID;
                readOnly.ACTIVE = method.ACTIVE ? 1 : 0;
                cardObj.MODE_OF_PAYMENTS_TYPE.push(readOnly);
            }
            if (_call_Flag == 3) {
                var readOnly = new Object();
                readOnly.MODE_OF_PAYMENT_ID = 0;
                readOnly.METHOD_NAME = method;
                readOnly.CUSTOMER_ID = $scope.General_search.CUSTOMER_ID;
                readOnly.BRANCH_ID = _site.BRANCH_ID;
                readOnly.ACTIVE = 0
                cardObj.MODE_OF_PAYMENTS_TYPE.push(readOnly);
            }
            if (_call_Flag == 1) {
                angular.forEach(_site, function (site) {
                    var readOnly = new Object();
                    readOnly.MODE_OF_PAYMENT_ID = 0;
                    readOnly.METHOD_NAME = method;
                    readOnly.CUSTOMER_ID = $scope.General_search.CUSTOMER_ID;
                    readOnly.BRANCH_ID = site.BRANCH_ID;
                    readOnly.ACTIVE = 0,
                        cardObj.MODE_OF_PAYMENTS_TYPE.push(readOnly);
                });
            }
            if (_call_Flag == 4) {
                var readOnly = new Object();
                readOnly.MODE_OF_PAYMENT_ID = method.MODE_OF_PAYMENT_ID;
                readOnly.METHOD_NAME = method.METHOD_NAME;
                readOnly.CUSTOMER_ID = $scope.General_search.CUSTOMER_ID;
                readOnly.BRANCH_ID = _site.BRANCH_ID;
                readOnly.ACTIVE = method.ACTIVE ? 1 : 0;
                cardObj.MODE_OF_PAYMENTS_TYPE.push(readOnly);
            }

            PrcCommMethods.CASHUP_APP_API(cardObj, 'INS_UPD_MODE_OF_PAYMENTS').then(function (data) {
                if (data.status == 200) {
                    if (_call_Flag == 1) {
                        angular.forEach(_site, function (site) {
                            $scope.GET_MODE_OF_PAYMENTS(site);
                            site.IS_SELECTED = false;
                        });
                    }
                    else {
                        $scope.GET_MODE_OF_PAYMENTS(_site);
                    }
                    //if ((data.data == 1) || (data.data == 2)) {
                    //    $scope.GET_MODE_OF_PAYMENTS(_site);
                    //}
                    //else if (data.data == 3) {
                    //    angular.forEach(_site, function (site) {
                    //        $scope.GET_MODE_OF_PAYMENTS(site);
                    //        site.IS_SELECTED = false;
                    //    });
                    //}
                    _site.NEW_METHOD_NAME = '';
                    $scope.NEW_METHOD_NAME = '';
                    if (method.MODE_OF_PAYMENT_ID && data.data != -1) {
                        $scope.$parent.ShowAlertBox("Success", "Method Updated Successfully", 3000);
                    }
                    if (method.MODE_OF_PAYMENT_ID === undefined && data.data != -1) {
                        $scope.$parent.ShowAlertBox("Success", 'Method added Successfully', 3000);
                    }
                    _site.newArea = { name: '', capacity: '' };
                    _site.selectedArea = null;
                    _site.editMode = false;
                    //$scope.ADMIN_GET_BRANCH_LIST();
                }
            });
        }
        else {
            if (_call_Flag == 2) {
                method.METHOD_NAME = method.OLD_NAME;
                method.HIDE_SHOW = false;
            }
        }
    }

    $scope.INS_UPD_CUSTOMERS_NOTIFICATIONS = function () {
        var ntfObj = new Object();
        ntfObj.ENTITY_ID = $scope.General_search.ENTITY_ID;
        ntfObj.CUSTOMER_ID = $scope.General_search.CUSTOMER_ID;
        ntfObj.USER_ID = $scope.General_search.USER_ID;
        ntfObj.CUSTOMERS_NOTIFICATIONS_TYPE = [];

        angular.forEach($scope.NOTIFICATIONS_MASTER_LIST, function (_notification) {
            var notificationObj = new Object();
            notificationObj.NTFCTN_MSTR_ID = _notification.TABLE_ID;
            notificationObj.ACTIVE = _notification.ACTIVE ? 1 : 0;
            ntfObj.CUSTOMERS_NOTIFICATIONS_TYPE.push(notificationObj);
        });
        PrcCommMethods.CASHUP_APP_API(ntfObj, 'INS_UPD_CUSTOMERS_NOTIFICATIONS').then(function (data) {
            if (data.status == 200) {
                $scope.$parent.ShowAlertBox("Success", 'Notifications updated Successfully.', 3000);

            }
        });
    }

    //--------------------------------------- NOTIFICATION PAGE FUNCTIONS ------------------------------------------------------

    

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
    $scope.$on('$destroy', function () {
        $('.modal.show').modal('hide');
    });
});