app.controller('AccountCreditMgtController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    //$scope.$parent.DISPLAY_FLAG = false;
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(2);
    //$scope.CASHUP_COMMON_CODE_Fn();
    $scope.$parent.CASHUP_COMMON_RESET_Fn();
    $scope.warning_flag = false;
    $scope.GetData = true;
    $scope.GetDataCust = true;
    //document.getElementById("loader").style.display = "block";
    $scope.LOAD_FETCH_TEXT = "No Records Found !"
    $scope.sortColumn = 'CUSTOMER_NAME';
    $scope.setSort = function (column) {
        if ($scope.sortColumn === column) {
            $scope.reverseSort = !$scope.reverseSort;
        } else {
            $scope.sortColumn = column;
            $scope.reverseSort = false;
        }
    };
    $scope.getSortClass = function (column) {
        if ($scope.sortColumn === column) {
            return $scope.reverseSort ? 'fa-arrow-down txt-primary' : 'fa-arrow-up txt-primary' ;
        }
        //return '';
        return 'fa-arrow-up-arrow-down text-grey'; // default icon
    };

    $scope.sortColumnCust = 'CUSTOMER_NAME';
    $scope.setSortCust = function (column) {
        if ($scope.sortColumnCust === column) {
            $scope.reverseSortCust = !$scope.reverseSortCust;
        } else {
            $scope.sortColumnCust = column;
            $scope.reverseSortCust = false;
        }
    };
    $scope.getSortClassCust = function (column) {
        if ($scope.sortColumnCust === column) {
            return $scope.reverseSortCust ? 'fa-arrow-down txt-primary' : 'fa-arrow-up txt-primary';
        }
        //return '';
        return 'fa-arrow-up-arrow-down text-grey'; // default icon
    };



    $scope.ACCOUNT_MGT_SEARCH = {
        SELECTED_SITE: null,
        MODE_OF_PAYMENT: null,
        SEARCH_TEXT: '',
        IS_RECEIVED:false,
        CUSTOMER_ID: parseInt($cookies.get("CUSTOMER_ID")),
        ENTITY_ID: parseInt($cookies.get("ENTITY_ID")),
        USER_ID: parseInt($cookies.get("USERID")),
        MODULE_ID: parseInt($cookies.get("MODULE_ID")),
        START_DATE: null,
        END_DATE: null,
        DATA_ENTRY_ENABLED: false,
        PAGE_NO: 1,
        PAGE_SIZE: 10
    }
    $scope.ACCOUNT_CUST_SEARCH = {
        SELECTED_SITE: null,
        SEARCH_TEXT: '',
        DATA_ENTRY_ENABLED: false,
        PAGE_NO: 1,
        PAGE_SIZE: 10
    }
    $scope.CAHSUP_PRIVILEGE_ID = "1164";
    $scope.CASHUP_PRIVILEGE = true;
    $scope.SiteSearch = {};
    $scope.ADD_NEW_CUST = {
        SELECTED_SITE: null,
        CREDIT_DATE: null,
        CUSTOMER_NAME: null,
        CUSTOMER_EMAIL: null,
        CUSTOMER_PHONE: null,
        CUSTOMER_filteredSuggestions: [],
        COMPANY: null,
        CREDIT_AMOUNT: null,
        INVOICE: null,
        NOTE: null,
        CUSTOMER_ID: $scope.ACCOUNT_MGT_SEARCH.CUSTOMER_ID,
        ENTITY_ID: $scope.ACCOUNT_MGT_SEARCH.ENTITY_ID,
        USER_ID: $scope.ACCOUNT_MGT_SEARCH.USER_ID,
        MODULE_ID: $scope.ACCOUNT_MGT_SEARCH.MODULE_ID,
        ACCOUNT_CUSTOMER_CUSTOMERS_ID:null
    }
    $scope.USER_ROLES_BY_USER_ID = [];
    $scope.ACCOUNT_CUSTOMER_CUSTOMERS = [];
    $scope.MODE_OF_PAYMENT_LIST = [];
    $scope.ACCOUNT_TRANSACTION_MANAGEMENT = [];
    $scope.ACCOUNT_CUSTOMER_MANAGEMENT = [];
    $scope.CHECKED_ALL = false;
    $scope.CHECKED_ALL_CUST = false;
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
                        format: $scope.$parent.CALENDAR_DATE_FORMAT,
                        //format: 'yyyy-mm-dd',
                        clearBtn: true,
                        closeBtn: true,// close button visible
                        //  startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate())
                        endDate: today
                    };
                    date_input.datepicker(options).on("hide", function (e) {

                    })
                }
            }
        });
    }
    $scope.dateinputddmmyy(1);
    //$scope.$parent.Datelocaleformat = { format: 'DD/MM/YYYY' };
    function reportrange(startDate, endDate) {
        $scope.ACCOUNT_MGT_SEARCH.START_DATE = startDate.format($scope.$parent.DB_DATE_FORMAT);
        $scope.ACCOUNT_MGT_SEARCH.END_DATE = endDate.format($scope.$parent.DB_DATE_FORMAT);
        $('#reportrange span').html(startDate.format($scope.$parent.DATE_RANGE_FORMAT) + ' - ' + endDate.format($scope.$parent.DATE_RANGE_FORMAT));
        $scope.GET_ACCOUNT_TRANSACTION_MANAGEMENT();
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
    $scope.$watch('ACCOUNT_MGT_SEARCH.IS_RECEIVED', function (newValue, oldValue) {
        if (newValue !== oldValue) {
            $scope.CHECKED_ALL = false;
            angular.forEach($scope.ACCOUNT_TRANSACTION_MANAGEMENT, function (_row) {
                _row.CHECKED = false;
            });
        }
    });

    $scope.filterByRedeemedStatus = function (_item) {
        return _item.IS_REDEEMED == $scope.ACCOUNT_MGT_SEARCH.IS_RECEIVED;
    };
    
    $scope.GET_CASHUP_TYPE = function (Sites) {
        var CashupModelObj = {
            CUSTOMER_ID: $scope.ACCOUNT_MGT_SEARCH.CUSTOMER_ID,
            ENTITY_ID: $scope.ACCOUNT_MGT_SEARCH.ENTITY_ID
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
                    $scope.CASHUP_PRIVILEGE = true;
                }
                else {
                    $scope.CASHUP_PRIVILEGE = false;
                }
                $scope.SELECT_SITE(Sites[0]);
                $scope.SELECT_SITE_CUST(Sites[0]);
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
                $scope.GET_CASHUP_TYPE($scope.FILTERED_SITES_LIST);
            }
            else {
                console.log("User does not have required PRIVILEGE_ID" + $scope.CAHSUP_PRIVILEGE_ID);
                $scope.CASHUP_PRIVILEGE = false;
            }
        }
        else {
            console.log("User does not have required PRIVILEGE_ID" + $scope.CAHSUP_PRIVILEGE_ID);
            $scope.CASHUP_PRIVILEGE = false;
        }
    };

    $scope.GET_PRIVILEGE();
    //$scope.GET_USER_ROLES_BY_USER_ID();
    $scope.GET_ACCOUNT_TRANSACTION_MANAGEMENT = function (flag) {
        if (flag == null || flag == undefined) {
            $scope.ACCOUNT_MGT_SEARCH.PAGE_NO = 1;
            $scope.GetData = true;
        }
        var CashupAppModelObj = new Object();
        CashupAppModelObj.BRANCH_ID = $scope.ACCOUNT_MGT_SEARCH.SELECTED_SITE.BRANCH_ID;
        CashupAppModelObj.SEARCH = $scope.ACCOUNT_MGT_SEARCH.SEARCH_TEXT;
        CashupAppModelObj.PAYMENT_MODE_ID = $scope.ACCOUNT_MGT_SEARCH.MODE_OF_PAYMENT == null || $scope.ACCOUNT_MGT_SEARCH.MODE_OF_PAYMENT == undefined ? 0 : $scope.ACCOUNT_MGT_SEARCH.MODE_OF_PAYMENT.MODE_OF_PAYMENT_ID;
        CashupAppModelObj.START_DATE = $scope.ACCOUNT_MGT_SEARCH.START_DATE;
        CashupAppModelObj.END_DATE = $scope.ACCOUNT_MGT_SEARCH.END_DATE;
        CashupAppModelObj.PAGE_NO = $scope.ACCOUNT_MGT_SEARCH.PAGE_NO;
        CashupAppModelObj.PAGE_SIZE = $scope.ACCOUNT_MGT_SEARCH.PAGE_SIZE;
        PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'GET_ACCOUNT_TRANSACTION_MANAGEMENT').then(function (data) {
            if (data.data.Table.length > 0) {
                if (flag == null || flag == undefined) {
                    $scope.ACCOUNT_TRANSACTION_MANAGEMENT = data.data.Table;
                }
                else if (flag == 1) {
                    $scope.ACCOUNT_TRANSACTION_MANAGEMENT = $scope.ACCOUNT_TRANSACTION_MANAGEMENT.concat(data.data.Table);
                }
                if (data.data.Table.length < $scope.ACCOUNT_MGT_SEARCH.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.ACCOUNT_MGT_SEARCH.PAGE_NO = parseInt($scope.ACCOUNT_MGT_SEARCH.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else if ($scope.ACCOUNT_MGT_SEARCH.PAGE_NO > 1 && data.data.Table.length == 0) {
                $scope.GetData = false;
            }
            else if ($scope.ACCOUNT_MGT_SEARCH.PAGE_NO == 1 && data.data.Table.length == 0) {
                $scope.GetData = false;
                $scope.ACCOUNT_TRANSACTION_MANAGEMENT = [];
            }
            //document.getElementById("loader").style.display = "none";

        });
    }
    $scope.GET_ACCOUNT_CUSTOMER_MANAGEMENT = function (flag) {
        if (flag == null || flag == undefined) {
            $scope.ACCOUNT_CUST_SEARCH.PAGE_NO = 1;
            $scope.GetDataCust = true;
        }

        var CashupAppModelObj = new Object();
        CashupAppModelObj.BRANCH_ID = $scope.ACCOUNT_CUST_SEARCH.SELECTED_SITE.BRANCH_ID;
        CashupAppModelObj.SEARCH = $scope.ACCOUNT_CUST_SEARCH.SEARCH_TEXT;
        CashupAppModelObj.PAGE_NO = $scope.ACCOUNT_CUST_SEARCH.PAGE_NO;
        CashupAppModelObj.PAGE_SIZE = $scope.ACCOUNT_CUST_SEARCH.PAGE_SIZE;
        PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'GET_ACCOUNT_CUSTOMER_MANAGEMENT').then(function (data) {
            if (data.data.Table.length > 0) {

                if (flag == null || flag == undefined) {
                    $scope.ACCOUNT_CUSTOMER_MANAGEMENT = data.data.Table;
                }
                else if (flag == 1) {
                    $scope.ACCOUNT_CUSTOMER_MANAGEMENT = $scope.ACCOUNT_CUSTOMER_MANAGEMENT.concat(data.data.Table);
                }
                if (data.data.Table.length < $scope.ACCOUNT_CUST_SEARCH.PAGE_SIZE) {
                    $scope.GetDataCust = false;
                }
                else {
                    $scope.ACCOUNT_CUST_SEARCH.PAGE_NO = parseInt($scope.ACCOUNT_CUST_SEARCH.PAGE_NO) + 1;
                    $scope.GetDataCust = true;
                }
            }
            else if ($scope.ACCOUNT_CUST_SEARCH.PAGE_NO > 1 && data.data.Table.length == 0) {
                $scope.GetDataCust = false;
            }
            else if ($scope.ACCOUNT_CUST_SEARCH.PAGE_NO == 1 && data.data.Table.length == 0) {
                $scope.ACCOUNT_CUSTOMER_MANAGEMENT = [];

            }


            //if (data.data.Table.length > 0) {
            //    $scope.ACCOUNT_CUSTOMER_MANAGEMENT = data.data.Table;
            //}
            //else {
            //    $scope.ACCOUNT_CUSTOMER_MANAGEMENT = [];
                
            //}
        });
    }

    $scope.GET_ACCOUNT_CUSTOMER_CUSTOMERS = function () {
        var CashupModelObj = new Object();
        CashupModelObj.BRANCH_ID = $scope.ADD_NEW_CUST.SELECTED_SITE.BRANCH_ID;
        CashupModelObj.ACTIVE = 1;
        PrcCommMethods.CASHUP_APP_API(CashupModelObj, 'GET_ACCOUNT_CUSTOMER_CUSTOMERS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.ACCOUNT_CUSTOMER_CUSTOMERS = data.data.Table;
            }
            else {
                $scope.ACCOUNT_CUSTOMER_CUSTOMERS = [];
            }
        });
    };
    $scope.GET_MODE_OF_PAYMENTS = function (_site) {
        var ModelObj = new Object();
        ModelObj.BRANCH_ID = _site.BRANCH_ID;//$scope.VOUCHER_MGT_SEARCH.SELECTED_SITE.BRANCH_ID;
        PrcCommMethods.CASHUP_APP_API(ModelObj, 'GET_MODE_OF_PAYMENTS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.MODE_OF_PAYMENT_LIST = data.data.Table.filter(_row=>_row.ACTIVE==true);
            }
            else {
                $scope.MODE_OF_PAYMENT_LIST = [];
            }
        });
    };
    $scope.SELECT_SITE = function (_site, _flag) {
        $scope.ACCOUNT_MGT_SEARCH.SELECTED_SITE = _site;
        $scope.ACCOUNT_MGT_SEARCH.MODE_OF_PAYMENT = null;
        $scope.GET_MODE_OF_PAYMENTS(_site);
        if (_flag != 2) {
            $scope.GET_ACCOUNT_TRANSACTION_MANAGEMENT();
        }
        $scope.ADD_NEW_CUST.SELECTED_SITE = _site;
        if (_site.STANDARD_ROLE_ID == 16 || _site.STANDARD_ROLE_ID == 17 || _site.STANDARD_ROLE_ID == 18) {
            $scope.ACCOUNT_MGT_SEARCH.DATA_ENTRY_ENABLED = true;
        }
        else {
            $scope.ACCOUNT_MGT_SEARCH.DATA_ENTRY_ENABLED = false;
        }
        $scope.GET_ACCOUNT_CUSTOMER_CUSTOMERS();
        //if (_flag == 1) {
        //    $scope.ADD_NEW_CUST.SELECTED_SITE = _site;
        //    $scope.GET_ACCOUNT_CUSTOMER_CUSTOMERS();
        //}
        //else {
        //    $scope.ACCOUNT_MGT_SEARCH.SELECTED_SITE = _site;
        //    $scope.ACCOUNT_MGT_SEARCH.MODE_OF_PAYMENT = null;
        //    $scope.GET_MODE_OF_PAYMENTS(_site);
        //    if (_flag != 2) {
        //        $scope.GET_ACCOUNT_TRANSACTION_MANAGEMENT();
        //    }
        //}
    }
    $scope.SELECT_SITE_CUST = function (_site) {
        $scope.ACCOUNT_CUST_SEARCH.SELECTED_SITE = _site;
        $scope.ADD_NEW_CUST.SELECTED_SITE = _site;
        if (_site.STANDARD_ROLE_ID == 16 || _site.STANDARD_ROLE_ID == 17 || _site.STANDARD_ROLE_ID == 18) {
            $scope.ACCOUNT_CUST_SEARCH.DATA_ENTRY_ENABLED = true;
        }
        else {
            $scope.ACCOUNT_CUST_SEARCH.DATA_ENTRY_ENABLED = false;
        }
        $scope.GET_ACCOUNT_CUSTOMER_CUSTOMERS();
        $scope.GET_ACCOUNT_CUSTOMER_MANAGEMENT();
    }
    $scope.SELECT_MODE_OF_PAYMENT = function (_mode_of_payment) {
        if (_mode_of_payment == 'Choose') {
            $scope.ACCOUNT_MGT_SEARCH.MODE_OF_PAYMENT = null;
        }
        else {
            $scope.ACCOUNT_MGT_SEARCH.MODE_OF_PAYMENT = _mode_of_payment;
        }
        
        $scope.GET_ACCOUNT_TRANSACTION_MANAGEMENT();
    }
    $scope.RESET_BRANCH_SELECTION = function (_flag) {
        //flag == 1 is for Add Customer Branch Selection Dropdown List
        if (_flag == 1) {
            $scope.ADD_NEW_CUST.SELECTED_SITE = null;
            $scope.ACCOUNT_CUSTOMER_CUSTOMERS = [];
        }
    }
    $scope.RESET_ADD_CUSTOMER = function () {
        $scope.ADD_NEW_CUST.SELECTED_SITE = null;
        $scope.ADD_NEW_CUST.CREDIT_DATE = null;
        $scope.ADD_NEW_CUST.CUSTOMER_NAME = null;
        $scope.ADD_NEW_CUST.CUSTOMER_EMAIL = null;
        $scope.ADD_NEW_CUST.CUSTOMER_PHONE = null;
        $scope.ADD_NEW_CUST.CUSTOMER_filteredSuggestions = [];
        $scope.ADD_NEW_CUST.CUSTOMER_ID = null;
        $scope.ADD_NEW_CUST.COMPANY = null;
        $scope.ADD_NEW_CUST.CREDIT_AMOUNT = null;
        $scope.ADD_NEW_CUST.INVOICE = null;
        $scope.ADD_NEW_CUST.NOTE = null;
        $scope.ACCOUNT_CUSTOMER_CUSTOMERS = [];
    }

    $scope.RESET_ACCOUNT_TRANSACTION_SEARCH = function () {
        $scope.ACCOUNT_MGT_SEARCH.START_DATE = moment().startOf('month').format($scope.$parent.DB_DATE_FORMAT);
        $scope.ACCOUNT_MGT_SEARCH.END_DATE = moment().endOf('month').format($scope.$parent.DB_DATE_FORMAT);
        $scope.ACCOUNT_MGT_SEARCH.SELECTED_SITE = null;
        $scope.ACCOUNT_MGT_SEARCH.SEARCH_TEXT = '';
        $scope.ACCOUNT_MGT_SEARCH.IS_RECEIVED = false;       
        $scope.ACCOUNT_MGT_SEARCH.MODE_OF_PAYMENT = null;
        $scope.ACCOUNT_MGT_SEARCH.PAGE_NO = 1;
        $scope.ACCOUNT_MGT_SEARCH.PAGE_SIZE = 10;        
        $scope.SELECT_SITE($scope.FILTERED_SITES_LIST[0], 2);
        $scope.$parent.SetUpDateRangeMultiDatePicker('reportrange', startDate, endDate, reportrange);
        $('#reportrange span').html(startDate.format($scope.$parent.DATE_RANGE_FORMAT) + ' - ' + endDate.format($scope.$parent.DATE_RANGE_FORMAT));
    }
    $scope.RESET_ACCOUNT_CUSTOMER_SEARCH = function () {
        $scope.ACCOUNT_CUST_SEARCH.SELECTED_SITE = $scope.FILTERED_SITES_LIST[0];
        $scope.ACCOUNT_CUST_SEARCH.SEARCH_TEXT = '';
        $scope.GET_ACCOUNT_CUSTOMER_MANAGEMENT();
    }
    $scope.filterSuggestions = function () {
        $scope.ADD_NEW_CUST.CUSTOMER_filteredSuggestions = $scope.ACCOUNT_CUSTOMER_CUSTOMERS.filter(
            acc => acc.NAME.toLowerCase().includes($scope.ADD_NEW_CUST.CUSTOMER_NAME.toLowerCase()));
    }
    $scope.setSelectedCustomer = function (item) {
        $scope.ADD_NEW_CUST.CUSTOMER_EMAIL = item.EMAIL;
        $scope.ADD_NEW_CUST.CUSTOMER_PHONE = item.PHONE;
        $scope.ADD_NEW_CUST.ACCOUNT_CUSTOMER_CUSTOMERS_ID = item.ID;
    }
    $scope.nginit_account_transaction = function (_row) {
        _row.CHECKED = false;
    }
    $scope.nginit_account_customer = function (_row) {
        _row.CHECKED = false;
    }

    $scope.CHECK_ALL_ACCOUNT_TRANSACTIONS = function () {
        if ($scope.CHECKED_ALL == false) {
            angular.forEach($scope.ACCOUNT_TRANSACTION_MANAGEMENT, function (_row) {
                _row.CHECKED = true;
            });
        }
        else {
            angular.forEach($scope.ACCOUNT_TRANSACTION_MANAGEMENT, function (_row) {
                _row.CHECKED = false;
            });
        }
    }
    $scope.CHECK_ALL_ACCOUNT_CUST = function () {
        if ($scope.CHECKED_ALL_CUST == false) {
            angular.forEach($scope.ACCOUNT_CUSTOMER_MANAGEMENT, function (_row) {
                _row.CHECKED = true;
            });
        }
        else {
            angular.forEach($scope.ACCOUNT_CUSTOMER_MANAGEMENT, function (_row) {
                _row.CHECKED = false;
            });
        }
    }
    $scope.SELECT_MODE_OF_PAYMENT_REDEEM = function (_row,_mode_of_payment) {
        _row.MODE_OF_PAYMENT_ID = _mode_of_payment.MODE_OF_PAYMENT_ID;
        _row.MODE_OF_PAYMENT = _mode_of_payment.METHOD_NAME;
    }   
    $scope.VALIDATE_AMOUNT = function (_row) {
        if (!isNaN(parseFloat(_row.AMOUNT))) {
            if (parseFloat(_row.AMOUNT) > parseFloat(_row.REMAINING_AMOUNT)) {
                $scope.$parent.ShowAlertBox('Error','Entered amount cannot be greater than remaining amount');
                _row.AMOUNT = _row.REMAINING_AMOUNT;
            }
        }
    }
    $scope.NEW_CUSTOMER = function () {
        if ($scope.TAB_ID == 1) {
            $scope.ADD_NEW_CUST.SELECTED_SITE = $scope.ACCOUNT_MGT_SEARCH.SELECTED_SITE;
        }
        else if ($scope.TAB_ID == 2) {
            $scope.ADD_NEW_CUST.SELECTED_SITE = $scope.ACCOUNT_CUST_SEARCH.SELECTED_SITE;
        }
        $scope.GET_ACCOUNT_CUSTOMER_CUSTOMERS();
        var myModal = new bootstrap.Modal(document.getElementById('New_Customer'), {
            keyboard: false  // Optional: Close modal when pressing ESC
        });
        // Show the modal
        myModal.show();
    }
    $scope.RECEIVE = function () {
        $scope.ENTRY_LIST = [];
        angular.forEach($scope.ACCOUNT_TRANSACTION_MANAGEMENT, function (_row) {
            if (_row.CHECKED == true && parseFloat(_row.REMAINING_AMOUNT) > 0 && _row.IS_REDEEMED == $scope.ACCOUNT_MGT_SEARCH.IS_RECEIVED) {
                var account_customer_row = new Object();
                account_customer_row.ACCOUNT_CUSTOMER_ID = 0;
                account_customer_row.INVOICE_NUMBER = _row.INVOICE_NUMBER;
                account_customer_row.CUSTOMER_NAME = _row.CUSTOMER_NAME;
                account_customer_row.CUSTOMER_ID = _row.CUSTOMER_ID;
                account_customer_row.COMPANY = _row.COMPANY;
                account_customer_row.AMOUNT = parseFloat(_row.REMAINING_AMOUNT).toFixed(2);
                account_customer_row.MODE_OF_PAYMENT_ID = null;
                //account_customer_row.MODE_OF_PAYMENT_ID = _row.MODE_OF_PAYMENT_ID;
                account_customer_row.MODE_OF_PAYMENT = null;
                //account_customer_row.MODE_OF_PAYMENT = _row.MODE_OF_PAYMENT;
                account_customer_row.NOTE = _row.NOTE;
                account_customer_row.PARENT_ID = _row.ID;
                account_customer_row.ACTIVE = _row.ACTIVE;
                account_customer_row.IS_DELETED = _row.IS_DELETED;
                account_customer_row.IS_REDEEMED = 1;
                account_customer_row.TOTAL_AMT = parseFloat(_row.AMOUNT).toFixed(2);
                account_customer_row.REMAINING_AMOUNT = parseFloat(_row.REMAINING_AMOUNT).toFixed(2);
                account_customer_row.UPLOAD_IDS = _row.UPLOAD_IDS;
                account_customer_row.IS_EXTERNAL_RECORD = _row.IS_EXTERNAL_RECORD;
                $scope.ENTRY_LIST.push(account_customer_row);
            }
        });
        if ($scope.ENTRY_LIST.length > 0) {
            var myModal = new bootstrap.Modal(document.getElementById('Receive_Credit'), {
                keyboard: false  // Optional: Close modal when pressing ESC
            });
            // Show the modal
            myModal.show();
        }
    }

    $scope.EXPORT_ACCOUNT_TRANSACTION = function (export_flag) {
        var export_table = $scope.ACCOUNT_TRANSACTION_MANAGEMENT.filter(_row => _row.CHECKED == true && _row.IS_REDEEMED == $scope.ACCOUNT_MGT_SEARCH.IS_RECEIVED);
        if (export_table.length == 0) {
            $scope.$parent.ShowAlertBox("Error", "Please select any row to begin export!", 3000);
            return
        }
        var CashupAppModelObj = new Object();
        CashupAppModelObj.ACCOUNT_TRANSACTION_EXPORT_LIST = export_table
        CashupAppModelObj.EXPORT_FLAG = export_flag;
        CashupAppModelObj.FILE_PATH = "/ACCOUNT_MGT_TXN" + "/CUSTOMER_" + $scope.ACCOUNT_MGT_SEARCH.CUSTOMER_ID + "/" + "USER_ID_" + $scope.ACCOUNT_MGT_SEARCH.USER_ID + "/" + (export_flag == 1 ? "CSV" : "XLSX") + "/";
        CashupAppModelObj.FILE_NAME = "AccountTransactionRecord";
        PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'EXPORT_ACCOUNT_TRANSACTION').then(function (data) {
            if (data.data != null) {
                $scope.SERVER_FILE_PATH = '/' + data.data.FOLDER_NAME + data.data.RETURN_FILE_NAME;
                $scope.FILE_NAME = CashupAppModelObj.FILE_NAME;
                window.location.href = $scope.SERVER_FILE_PATH;
            } else {
                alert("Export failed. Please try again.");
            }
        });
    }
    $scope.EXPORT_ACCOUNT_CUSTOMER = function (export_flag) {
        var export_table = $scope.ACCOUNT_CUSTOMER_MANAGEMENT.filter(_row => _row.CHECKED == true);
        if (export_table.length == 0) {
            $scope.$parent.ShowAlertBox("Error", "Please select any row to begin export!", 3000);
            return
        }
        var CashupAppModelObj = new Object();
        CashupAppModelObj.ACCOUNT_CUSTOMER_EXPORT_LIST = export_table
        CashupAppModelObj.EXPORT_FLAG = export_flag;
        CashupAppModelObj.FILE_PATH = "/ACCOUNT_MGT_CUST" + "/CUSTOMER_" + $scope.ACCOUNT_MGT_SEARCH.CUSTOMER_ID + "/" + "USER_ID_" + $scope.ACCOUNT_MGT_SEARCH.USER_ID + "/" + (export_flag == 1 ? "CSV" : "XLSX") + "/";
        CashupAppModelObj.FILE_NAME = "AccountCustomerRecord";
        PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'EXPORT_ACCOUNT_CUSTOMER').then(function (data) {
            if (data.data != null) {
                $scope.SERVER_FILE_PATH = '/' + data.data.FOLDER_NAME + data.data.RETURN_FILE_NAME;
                $scope.FILE_NAME = CashupAppModelObj.FILE_NAME;
                window.location.href = $scope.SERVER_FILE_PATH;
            } else {
                alert("Export failed. Please try again.");
            }
        });
    }
    $scope.INS_ACCOUNT_CREDIT_MANAGEMENT = function (flag) { //1 for new customer
        if (flag == 1) {
            $scope.NewAccountCustomerForm.submitted = true;
            if ($scope.NewAccountCustomerForm.$valid) {
                var CashupAppModelObj = new Object();
                CashupAppModelObj.BRANCH_ID = $scope.ADD_NEW_CUST.SELECTED_SITE.BRANCH_ID;
                CashupAppModelObj.ENTITY_ID = $scope.ADD_NEW_CUST.ENTITY_ID;
                CashupAppModelObj.EMAIL = $scope.ADD_NEW_CUST.CUSTOMER_EMAIL;
                CashupAppModelObj.PHONE = $scope.ADD_NEW_CUST.CUSTOMER_PHONE;
                CashupAppModelObj.CUSTOMER_NAME = $scope.ADD_NEW_CUST.CUSTOMER_NAME;
                CashupAppModelObj.CREDIT_DATE = moment($scope.ADD_NEW_CUST.CREDIT_DATE, $scope.$parent.CONVERSION_DATE_FORMAT).format($scope.$parent.DB_DATE_FORMAT);
                //CashupAppModelObj.CREDIT_DATE = $scope.ADD_NEW_CUST.CREDIT_DATE;
                CashupAppModelObj.COMPANY = $scope.ADD_NEW_CUST.COMPANY;
                CashupAppModelObj.CREDIT_AMOUNT = $scope.ADD_NEW_CUST.CREDIT_AMOUNT;
                CashupAppModelObj.INVOICE_NUMBER = $scope.ADD_NEW_CUST.INVOICE;
                CashupAppModelObj.NOTE = $scope.ADD_NEW_CUST.NOTE;
                CashupAppModelObj.USER_ID = $scope.ADD_NEW_CUST.USER_ID;
                CashupAppModelObj.DELETE_FLAG = 0;
                CashupAppModelObj.ACCOUNT_CUSTOMER_CUSTOMERS_ID = null;//$scope.ADD_NEW_CUST.ACCOUNT_CUSTOMER_CUSTOMERS_ID;
                CashupAppModelObj.ACCOUNT_CUSTOMER_ID = null;
                PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'INS_ACCOUNT_CREDIT_MANAGEMENT').then(function (data) {
                    if (data.data == 1) {
                        //show success modal
                        $scope.$parent.ShowAlertBox("Success", "Account Customer is created successfully", 3000);
                    }
                    else if(data.data == 2) {
                        //case delete
                    }
                    else{
                        $scope.$parent.ShowAlertBox("Error", "Something went wrong!", 3000);
                    }
                    $scope.NewAccountCustomerForm.submitted = false;
                    $scope.RESET_ADD_CUSTOMER();    
                    $scope.GET_ACCOUNT_TRANSACTION_MANAGEMENT();
                    $scope.GET_ACCOUNT_CUSTOMER_MANAGEMENT();
                    var modalEl = document.getElementById('New_Customer');
                    var existingModal = bootstrap.Modal.getInstance(modalEl);
                    if (existingModal) {
                        existingModal.hide();
                    }
                });
            }
        }
    }
    $scope.INS_UPD_CASHUP_ACCOUNT = function () {
        $scope.AccountReceiveForm.submitted = true;
        if ($scope.AccountReceiveForm.$valid) {
            var CashupAppModelObj = new Object();
            CashupAppModelObj.CASHUP_HEADER_ID = null;
            CashupAppModelObj.ACCOUNT_TOTAL = null;
            CashupAppModelObj.ACCOUNT_RECEIVED_TOTAL = null;
            CashupAppModelObj.USER_ID = parseInt($cookies.get("USERID"));
            CashupAppModelObj.STEP_NO = null;
            CashupAppModelObj.IS_DRAFT = null;
            CashupAppModelObj.REDEEM_FLAG = 1;
            CashupAppModelObj.BRANCH_ID = $scope.ACCOUNT_MGT_SEARCH.SELECTED_SITE.BRANCH_ID;
            var ACCOUNT_CUSTOMER_LIST = [];
            angular.forEach($scope.ENTRY_LIST, function (_row) { // .filter(acl => acl.PARENT_ID == null || acl.PARENT_ID == undefined)
                var account_customer_row = new Object();
                account_customer_row.ACCOUNT_CUSTOMER_ID = 0;
                account_customer_row.INVOICE_NUMBER = _row.INVOICE_NUMBER;
                account_customer_row.CUSTOMER_NAME = _row.CUSTOMER_NAME;
                account_customer_row.CUSTOMER_ID = _row.CUSTOMER_ID;
                account_customer_row.COMPANY = _row.COMPANY;
                account_customer_row.AMOUNT = parseFloat(_row.AMOUNT).toFixed(5);
                account_customer_row.MODE_OF_PAYMENT_ID = _row.MODE_OF_PAYMENT_ID;
                account_customer_row.MODE_OF_PAYMENT = _row.MODE_OF_PAYMENT;
                account_customer_row.NOTE = _row.NOTE;
                account_customer_row.PARENT_ID = _row.PARENT_ID;
                account_customer_row.ACTIVE = _row.ACTIVE;
                account_customer_row.IS_DELETED = _row.IS_DELETED;
                account_customer_row.IS_REDEEMED = _row.IS_REDEEMED;
                account_customer_row.TOTAL_AMT = parseFloat(_row.TOTAL_AMT).toFixed(5);
                account_customer_row.UPLOAD_IDS = _row.UPLOAD_IDS;
                account_customer_row.IS_EXTERNAL_RECORD = _row.IS_EXTERNAL_RECORD;
                ACCOUNT_CUSTOMER_LIST.push(account_customer_row);
            });
            CashupAppModelObj.ACCOUNT_CUSTOMER = ACCOUNT_CUSTOMER_LIST;
            PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'INS_UPD_CASHUP_ACCOUNT').then(function (data) {
                $scope.AccountReceiveForm.submitted = false;
                var modalEl = document.getElementById('Receive_Credit');
                var existingModal = bootstrap.Modal.getInstance(modalEl);
                if (existingModal) {
                    existingModal.hide();
                }
                $scope.GET_ACCOUNT_TRANSACTION_MANAGEMENT();
                $scope.GET_ACCOUNT_CUSTOMER_MANAGEMENT();
            });
        }
    }
    $scope.$on('$destroy', function () {
        $('.modal.show').modal('hide');
    });
});