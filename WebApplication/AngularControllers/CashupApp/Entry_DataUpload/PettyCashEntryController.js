app.controller('PettyCashEntryController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    //$scope.$parent.DISPLAY_FLAG = false;
    //$scope.$parent.$parent.DISPLAY_FLAG = false;
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(2);
    //$scope.CASHUP_COMMON_CODE_Fn();
    $scope.$parent.CASHUP_COMMON_RESET_Fn();
    $scope.sortColumn = 'CASHUP_DATE';       // default sort column
    $scope.reverseSort = false;          // false = ascending, true = descending
    $scope.warning_flag = false;
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
            return $scope.reverseSort ? 'fa-arrow-down txt-primary' : 'fa-arrow-up txt-primary';
        }
        //return ''; // default icon
        return 'fa-arrow-up-arrow-down text-grey'; // default icon
    };
    //document.getElementById("loader").style.display = "block";
    $scope.petty_cash_entry = {
        CUSTOMER_ID: $cookies.get("CUSTOMER_ID"),
        USER_ID: $cookies.get("USERID"),
        ENTITY_ID: $cookies.get("ENTITY_ID"),
        BRANCH_ID: "",
        BRANCH_IDS: "",
        BRANCH_NAME: '',
        MODULE_ID: $cookies.get("MODULE_ID"),
        CASHUP_VENDOR_ID: "",
        Approver: null,
        APPROVER_ID: null,
        VENDOR_NAME: '',
        PETTY_CASH_COST_CATEGORIE_ID: null,
        COST_CATEGORY_NAME: null,
        SELECTED_SITE: null,
        NAME: null,
        START_DATE: null,
        END_DATE: null,
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        DATA_ENTRY_ENABLED:false
    };
    $scope.petty_cash_upload = {
        CUSTOMER_ID: $cookies.get("CUSTOMER_ID"),
        USER_ID: $cookies.get("USERID"),
        ENTITY_ID: $cookies.get("ENTITY_ID"),
        MODULE_ID: $cookies.get("MODULE_ID"),
        SELECTED_SITE: null,
        DATE: null,
        COST_CATEGORY_LIST: [],
        VENDOR_LIST: [],
        APPROVER_LIST : []
        //VENDOR: null,
        //PETTY_CASH_CATEGORY_ID: null,
        //GOODS: null,
        //GROSS:null,
        //APPROVER_ID: null,
        //APPROVER_NAME: null,
        //VAT_AMOUNT: null,
        //NET_AMOUNT: null,
        //UPLOAD_IDS: null,
        //CASHUP_VENDOR_ID:null
    }
    $scope.DD_DEFAULT_STATUS = 'Status';
    $scope.CAHSUP_PRIVILEGE_ID = "1169";
    $scope.CASHUP_PRIVILEGE = true;
    $scope.SiteSearch = {};
    $scope.PETTY_CASH_UPLOAD_LIST = [];
    $scope.DD_DEFAULT_CATEGORY = 'Cost Category';
    $scope.DD_DEFAULT_VENDOR = 'Vendor';
    $scope.DD_DEFAULT_APPROVER = 'Approver';
    $scope.DD_DEFAULT_SITE = "All Sites";
    $scope.TOTAL_GROSS = 0;
    $scope.TOTAL_VAT = 0;
    $scope.TOTAL_NET = 0;
    $scope.VENDOR_LIST = [];
    $scope.COST_CATEGORY_LIST = [];
    $scope.PETTY_CASH_ENTRY_RECORDS = [];
    $scope.PRIVILAGE_LIST = [];
    $scope.FILTERED_SITES_LIST = [];
    $scope.SITES_LIST = [];
    $scope.APPROVER_LIST = [];
    //$scope.SELECTED_SITE = null;

    //$scope.SELCTED_SITES_LIST = $scope.$parent.$parent.GET_USER_ROLES_BY_USER_ID();

    //$scope.$parent.Datelocaleformat = { format: 'DD/MM/YYYY' };
    function reportrange(startDate, endDate) {
        $scope.petty_cash_entry.START_DATE = startDate.format($scope.$parent.DB_DATE_FORMAT);
        $scope.petty_cash_entry.END_DATE = endDate.format($scope.$parent.DB_DATE_FORMAT);
        $('#reportrange span').html(startDate.format($scope.$parent.DATE_RANGE_FORMAT) + ' - ' + endDate.format($scope.$parent.DATE_RANGE_FORMAT));
        if ($scope.petty_cash_entry.BRANCH_ID != null) {
            $scope.GET_PETTY_CASH_ENTRY(1);
        }
        
    }
    $(function () {

        startDate = new moment().add(0, 'months').date(1);
        endDate = moment().endOf('month');
        $scope.$parent.SetUpDateRangeMultiDatePicker('reportrange', startDate, endDate, reportrange);
        $('#reportrange span').html(startDate.format($scope.$parent.DATE_RANGE_FORMAT) + ' - ' + endDate.format($scope.$parent.DATE_RANGE_FORMAT));
    });

    $(document).on("click", ".ranges ul li", function (event) {
        var a = $(this).attr("data-range-key");
        if (a == "Custom Date" && ($scope.loader == 1)) {
            $scope.loader = 2;
            var start = moment().startOf('month');
            var end = moment().add(1, 'M').endOf('month');
            $scope.$parent.SetUpDateRangeMultiDatePicker('reportrange', start, end, reportrange, 1, "right", 'Open');
            $('#reportrange').data('daterangepicker').show();
        }
        else {
            $scope.loader = 1;
        }
    });

    $scope.GET_PETTY_CASH_ENTRY = function (FLAG) {
        if (FLAG == 1) {
            $scope.PETTY_CASH_ENTRY_RECORDS = [];
            $scope.petty_cash_entry.PAGE_NO = 1;
        }

        
        var branchIds = [];
        var branch = new Object();
        branch.TABLE_ID = $scope.petty_cash_entry.BRANCH_ID;
        branchIds.push(branch);

        var PettyCashEntryModelObj = new Object();
        PettyCashEntryModelObj.TABLE_ID_LIST = branchIds;
        PettyCashEntryModelObj.START_DATE = $scope.petty_cash_entry.START_DATE;
        PettyCashEntryModelObj.END_DATE = $scope.petty_cash_entry.END_DATE;
        PettyCashEntryModelObj.VENDOR_NAME = $scope.petty_cash_entry.VENDOR_NAME || '';
        PettyCashEntryModelObj.APPROVER_ID = $scope.petty_cash_entry.APPROVER_ID || null;//$scope.petty_cash_entry.USER_ID;
        PettyCashEntryModelObj.COST_CATEGORY_ID = $scope.petty_cash_entry.PETTY_CASH_COST_CATEGORIE_ID || null;
        PettyCashEntryModelObj.PAGE_NO = $scope.petty_cash_entry.PAGE_NO;
        PettyCashEntryModelObj.PAGE_SIZE = $scope.petty_cash_entry.PAGE_SIZE;

        PrcCommMethods.CASHUP_APP_API(PettyCashEntryModelObj, 'GET_PETTY_CASH_ENTRY').then(function (data) {
            if (data.data.Table.length > 0) {
                if (FLAG == 1) {
                    $scope.PETTY_CASH_ENTRY_RECORDS = data.data.Table;
                }
                else if (FLAG == null || FLAG == undefined) {
                    $scope.PETTY_CASH_ENTRY_RECORDS = $scope.PETTY_CASH_ENTRY_RECORDS.concat(data.data.Table);
                    
                }
                if (data.data.Table.length < $scope.petty_cash_entry.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.petty_cash_entry.PAGE_NO = parseInt($scope.petty_cash_entry.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else if ($scope.petty_cash_entry.PAGE_NO > 1 && data.data.Table.length == 0) {
                $scope.GetData = false;
            }
            else if ($scope.petty_cash_entry.PAGE_NO == 1 && data.data.Table.length == 0) {
                $scope.PETTY_CASH_ENTRY_RECORDS = [];
                $scope.LOAD_FETCH_TEXT = 'No Records Found !';
            }
            //document.getElementById("loader").style.display = "none";

        }).catch(function (error) {
            console.error("Error fetching petty cash entries:", error);
            //document.getElementById("loader").style.display = "none";
        });
    };

    $scope.GetPettyCashEntry = function () {
        PettyCashEntryService.GET_PETTY_CASH_ENTRY().then(function (response) {
            if (response.data && response.data.length > 0) {
                $scope.pettyCashEntryList = response.data;
            } else {
                $scope.pettyCashEntryList = [];
            }
        }, function (error) {
            console.error('Error fetching petty cash entries:', error);
        });
    };

    $scope.INS_PETTY_CASH_DECLARATION = function (row) {

        var CashupAppModelObj = new Object();
        
        CashupAppModelObj.ENTITY_ID = $cookies.get("ENTITY_ID");
        CashupAppModelObj.BRANCH_ID = ($scope.petty_cash_entry && $scope.petty_cash_entry.BRANCH_ID) || $scope.selectedBranchId || null;
        CashupAppModelObj.CASHUP_HEADER_ID = null;
        CashupAppModelObj.USER_ID = parseInt($cookies.get("USERID"));

        var totalNet = 0;
        var declaration_list = [];
        var declaration = new Object();
        declaration.TABLE_ID = (row.ID == undefined || row.ID == null) ? 0 : row.ID;
        declaration.PAID_TO = null;
        declaration.PETTY_CASH_CATEGORY_ID = row.PETTY_CASH_CATEGORY_ID;
        declaration.ITEM = null;
        declaration.TOTAL_VALUE = null;
        declaration.AUTHORIZED_BY_ID = row.APPROVER_ID;
        declaration.AUTHORIZED_BY_NAME = row.AUTHORIZED_BY_NAME;
        declaration.VAT_AMOUNT = row.VAT_AMOUNT;
        declaration.NET_AMOUNT = row.NET_AMOUNT;
        declaration.ACTIVE = 0;

        var UPLOAD_IDS = "";
        angular.forEach(row.UploadedFiles, function (FILE) {
            if (UPLOAD_IDS == "") {
                UPLOAD_IDS = FILE.UPLOAD_ID;
            } else {
                UPLOAD_IDS += "," + FILE.UPLOAD_ID;
            }
        });
        declaration.UPLOAD_IDS = UPLOAD_IDS;

        declaration.IS_DELETED = row.IS_DELETED;
        declaration.CASHUP_VENDOR_ID = "";
        declaration_list.push(declaration);

        if (row.ACTIVE == true || row.ACTIVE == 1) {
            if (!isNaN(parseFloat(row.NET_AMOUNT))) {
                totalNet += parseFloat(row.NET_AMOUNT);
            }
        }

        CashupAppModelObj.TOTAL_PETTY_CASH = totalNet;
        CashupAppModelObj.PETTY_CASH_DECLERATION = declaration_list;

        PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'INS_PETTY_CASH_DECLARATION').then(function (data) {
            $scope.GET_PETTY_CASH_ENTRY(1);
        });
    };

    $scope.DELETE_PETTY_CASH_ENTRY = function (row) {
        //console.log("DELETE row: ", row);
        if (!row) {
            alert("Error: No row data provided for deletion.");
            return;
        }

        if (confirm('Are you sure you want to proceed?')) {
            row.IS_DELETED = 1;
            $scope.INS_PETTY_CASH_DECLARATION(row);
        }
    };

    $scope.LAZY_LOAD_GET_PETTY_CASH_ENTRY = function () {
        $scope.petty_cash_entry.IS_LAZY_LOAD_CLICKED = true;
        $scope.GET_PETTY_CASH_ENTRY(1);
    }

    $scope.EXPORT_PETTY_CASH_ENTRY_RECORD_LIST = function (_param_export_flag) {
        var UserModelObj = new Object();
        var branchIds = [];
        var branch = new Object();
        branch.TABLE_ID = $scope.petty_cash_entry.BRANCH_ID;
        branchIds.push(branch);
        UserModelObj.TABLE_ID_LIST = branchIds;
        UserModelObj.START_DATE = $scope.petty_cash_entry.START_DATE;
        UserModelObj.END_DATE = $scope.petty_cash_entry.END_DATE;
        UserModelObj.VENDOR_NAME = $scope.petty_cash_entry.VENDOR_NAME || '';
        UserModelObj.APPROVER_ID = $scope.petty_cash_entry.APPROVER_ID || null;
        UserModelObj.PETTY_CASH_COST_CATEGORIE_ID = $scope.petty_cash_entry.PETTY_CASH_COST_CATEGORIE_ID || null;
        UserModelObj.PAGE_NO = 0;
        UserModelObj.PAGE_SIZE = 0;
        UserModelObj.CASHUP_REPORT_TYPE = 15;
        UserModelObj.EXPORT_FLAG = _param_export_flag;
        UserModelObj.FILE_PATH = "/PETTY_CASH_ENTRY_" + $scope.petty_cash_entry.ENTITY_ID + "/" + "USER_ID_" + $scope.petty_cash_entry.USER_ID + "/" + (_param_export_flag == 1 ? "CSV" : "XLSX") + "/";
        UserModelObj.FILE_NAME = "Petty Cash Entry Report";
        PrcCommMethods.CASHUP_APP_API(UserModelObj, 'EXPORT_CASHUP_REPORTS').then(function (data) {
            if (data.data != null) {
                $scope.SERVER_FILE_PATH = '/' + data.data.FOLDER_NAME + data.data.RETURN_FILE_NAME;
                $scope.FILE_NAME = UserModelObj.FILE_NAME;
                window.location.href = $scope.SERVER_FILE_PATH;
            } else {
                alert("Export failed. Please try again.");
            }
        });
        
    }

    $scope.RESET_PETTY_CASH_ENTRY = function () {
        startDate = moment().startOf('month');
        endDate = moment().endOf('month');
        $scope.petty_cash_entry = {
            CUSTOMER_ID: $cookies.get("CUSTOMER_ID"),
            USER_ID: $cookies.get("USERID"),
            ENTITY_ID: $cookies.get("ENTITY_ID"),
            BRANCH_ID: "",
            BRANCH_IDS: "",
            BRANCH_NAME: '',
            MODULE_ID: $cookies.get("MODULE_ID"),
            CASHUP_VENDOR_ID: "",
            Approver: null,
            APPROVER_ID: null,
            VENDOR_NAME: '',
            PETTY_CASH_COST_CATEGORIE_ID: null,
            COST_CATEGORY_NAME: null,
            NAME: null,
            START_DATE: startDate.format('YYYY-MM-DD'),
            END_DATE: endDate.format('YYYY-MM-DD'),
            PAGE_NO: 1,
            PAGE_SIZE: 20,
        };
        $('#reportrange span').html(startDate.format($scope.$parent.DATE_RANGE_FORMAT) + ' - ' + endDate.format($scope.$parent.DATE_RANGE_FORMAT));
        $scope.petty_cash_entry.IS_LAZY_LOAD_CLICKED = false;
        $scope.PETTY_CASH_ENTRY_RECORDS = [];
        $scope.DD_DEFAULT_CATEGORY = 'Cost Category';
        $scope.DD_DEFAULT_VENDOR = 'Vendor';
        $scope.DD_DEFAULT_APPROVER = 'Approver';

        if ($scope.FILTERED_SITES_LIST && $scope.FILTERED_SITES_LIST.length > 0) {
            angular.forEach($scope.FILTERED_SITES_LIST, function (site) {
                site.IS_SELECTED = false;
            });

            $scope.FILTERED_SITES_LIST[0].IS_SELECTED = true;
            $scope.FILTER_Fn($scope.FILTERED_SITES_LIST[0]);
        } else {
            console.warn("No filtered sites available for reset.");
        }
    };


    $scope.GET_PETTY_CASH_COST_CATEGORIES = function (flag) {
        var Obj = new Object();
        if (flag == 'upload') {
            Obj.BRANCH_ID = $scope.petty_cash_upload.SELECTED_SITE.BRANCH_ID;
        }
        else {
            Obj.BRANCH_ID = $scope.petty_cash_entry.BRANCH_ID;
        }
        
        PrcCommMethods.CASHUP_APP_API(Obj, 'GET_PETTY_CASH_COST_CATEGORIES').then(function (data) {
            if (data.data.Table.length > 0) {
                if (flag == 'upload') {
                    $scope.petty_cash_upload.COST_CATEGORY_LIST = data.data.Table;
                    angular.forEach($scope.PETTY_CASH_UPLOAD_LIST, function (_row) {
                        _row.FILTERED_COST_CATEGORY_LIST = $scope.petty_cash_upload.COST_CATEGORY_LIST;
                    })
                }
                else {
                    $scope.COST_CATEGORY_LIST = data.data.Table;
                }
            }
            else {
                $scope.COST_CATEGORY_LIST = [];
                $scope.petty_cash_upload.COST_CATEGORY_LIST = [];
            }
        });
    }

    $scope.GET_CASHUP_VENDORS = function (flag) {
        var CommonObj = new Object();
        if (flag == 'upload') {
            CommonObj.BRANCH_ID = $scope.petty_cash_upload.SELECTED_SITE.BRANCH_ID;
        }
        else {
            CommonObj.BRANCH_ID = $scope.petty_cash_entry.BRANCH_ID;
        }
        PrcCommMethods.CASHUP_APP_API(CommonObj, 'GET_CASHUP_VENDORS').then(function (data) {
            if (data.data.Table.length > 0) {
                if (flag == 'upload') {
                    $scope.petty_cash_upload.VENDOR_LIST = data.data.Table;
                    angular.forEach($scope.PETTY_CASH_UPLOAD_LIST, function (_row) {
                        _row.FILTERED_VENDOR_LIST = $scope.petty_cash_upload.VENDOR_LIST;
                    })
                }
                else {
                    $scope.VENDOR_LIST = data.data.Table;
                }
            }
            else {
                $scope.VENDOR_LIST = [];
                $scope.petty_cash_upload.VENDOR_LIST=[];
            }
        });
    };

    $scope.ADMIN_GET_BRANCH_STAFF = function (flag) {
        
        if (flag == 'upload') {
            var CommonObj = new Object();
            CommonObj.CUSTOMER_ID = $scope.petty_cash_upload.CUSTOMER_ID;
            CommonObj.ENTITY_ID = $scope.petty_cash_upload.ENTITY_ID;
            CommonObj.LOCATION_ID = 0;
            CommonObj.BRANCH_ID = $scope.petty_cash_upload.SELECTED_SITE.BRANCH_ID;
            CommonObj.ACTIVE = 1;
            CommonObj.STAFF_NAME = '';
            CommonObj.PAGE_NO = 1;
            CommonObj.PAGE_SIZE = 100;
        }
        else {
            var CommonObj = new Object();
            CommonObj.CUSTOMER_ID = $scope.petty_cash_entry.CUSTOMER_ID;
            CommonObj.ENTITY_ID = $scope.petty_cash_entry.ENTITY_ID;
            CommonObj.LOCATION_ID = 0;
            CommonObj.BRANCH_ID = $scope.petty_cash_entry.BRANCH_ID;
            CommonObj.ACTIVE = 1;
            CommonObj.STAFF_NAME = '';
            CommonObj.PAGE_NO = 1;
            CommonObj.PAGE_SIZE = 100;
        }
        
        PrcCommMethods.ADMIN_API(CommonObj, 'ADMIN_GET_BRANCH_STAFF').then(function (data) {
            if (data.data.Table.length > 0) {
                if (flag == 'upload') {
                    $scope.petty_cash_upload.APPROVER_LIST = data.data.Table;
                }
                else {
                    $scope.APPROVER_LIST = data.data.Table;
                }
                
            }
            else {
                $scope.APPROVER_LIST = [];
                $scope.petty_cash_upload.APPROVER_LIST
            }
        });
    };
    $scope.GET_CASHUP_PTY_CSH_VNDR_SJTNS = function (_row) {
        var ModelObj = new Object();
        ModelObj.BRANCH_ID = $scope.petty_cash_upload.SELECTED_SITE.BRANCH_ID;
        ModelObj.VENDOR_NAME = _row.VENDOR_TEXT;
        PrcCommMethods.CASHUP_APP_API(ModelObj, 'GET_CASHUP_PTY_CSH_VNDR_SJTNS').then(function (data) {
            if (data.data.Table.length > 0) {
                _row.FILTERED_VENDOR_LIST = data.data.Table;
            }
        });
    };
    $scope.RESET_PCASH_UPLOAD = function () {
        $scope.PcashEntryForm.submitted = false;
        $scope.petty_cash_upload.SELECTED_SITE = null;
        $scope.petty_cash_upload.DATE = null;
        //$scope.COST_CATEGORY_LIST = [];
        //$scope.VENDOR_LIST = [];
        //$scope.APPROVER_LIST = [];        
        $scope.PETTY_CASH_UPLOAD_LIST = [];
        
        angular.forEach($scope.PETTY_CASH_UPLOAD_LIST, function (_row) {
            _row.FILTERED_VENDOR_LIST = null;
            _row.FILTERED_COST_CATEGORY_LIST = null;
        })
    }

    $scope.selectSite = function (_site) {
        $scope.petty_cash_entry.SELECTED_SITE = _site;
        $scope.petty_cash_entry.BRANCH_ID = _site.BRANCH_ID;
        $scope.VENDOR_LIST = [];
        $scope.petty_cash_upload.COST_CATEGORY_LIST = [];
        $scope.APPROVER_LIST = [];
        $scope.petty_cash_entry.VENDOR_NAME = null;
        $scope.petty_cash_entry.CASHUP_VENDOR_ID = null;
        $scope.petty_cash_entry.Approver = null;
        $scope.petty_cash_entry.NAME = null;
        $scope.petty_cash_entry.PETTY_CASH_COST_CATEGORIE_ID = null;
        $scope.petty_cash_entry.COST_CATEGORY_NAME = null;
        if (_site.STANDARD_ROLE_ID == 16 || _site.STANDARD_ROLE_ID == 17 || _site.STANDARD_ROLE_ID == 18) {
            $scope.petty_cash_entry.DATA_ENTRY_ENABLED = true;
        }
        else {
            $scope.petty_cash_entry.DATA_ENTRY_ENABLED = false;
        }
        $scope.selectSiteForUpload(_site);
        $scope.GET_PETTY_CASH_COST_CATEGORIES();
        $scope.GET_CASHUP_VENDORS();
        $scope.ADMIN_GET_BRANCH_STAFF();
        $scope.GET_PETTY_CASH_ENTRY(1);
    };
    $scope.selectSiteForUpload = function (site) {
        $scope.petty_cash_upload.SELECTED_SITE = site;
        angular.forEach($scope.PETTY_CASH_UPLOAD_LIST, function (_row) {
            _row.FILTERED_VENDOR_LIST = [];
            _row.FILTERED_COST_CATEGORY_LIST = [];
            _row.VENDOR = null;
            _row.CASHUP_VENDOR_ID = null;
            _row.PETTY_CASH_CATEGORY_ID = null;
            _row.PETTY_CASH_COST_CATEGORY_NAME = null;
            _row.APPROVER_ID = null;
            _row.APPROVER_NAME = null;
        })
        $scope.GET_PETTY_CASH_COST_CATEGORIES('upload');
        $scope.GET_CASHUP_VENDORS('upload');
        $scope.ADMIN_GET_BRANCH_STAFF('upload');

        //angular.forEach($scope.PETTY_CASH_UPLOAD_LIST, function (_row) {
        //    _row.FILTERED_VENDOR_LIST = $scope.petty_cash_upload.VENDOR_LIST;
        //    _row.FILTERED_COST_CATEGORY_LIST = $scope.petty_cash_upload.COST_CATEGORY_LIST;
        //})
    }
    $scope.selectCCForUpload = function (_row, _cc) {
        _row.PETTY_CASH_CATEGORY_ID = _cc.PETTY_CASH_COST_CATEGORIE_ID;
        _row.PETTY_CASH_COST_CATEGORY_NAME = _cc.COST_CATEGORY_NAME;
    }
    $scope.selectApproverForUpload = function (_row, _cc) {
        _row.APPROVER_ID = _cc.TABLE_ID;
        _row.APPROVER_NAME = _cc.NAME;
    }
    $scope.selectVendorForUpload = function (_row, _vendor) {
        _row.VENDOR = _vendor.VENDOR_NAME;
        _row.CASHUP_VENDOR_ID = _vendor.CASHUP_VENDOR_ID;
    }
    $scope.SEARCH_COST_CATEGORY = function (_row) {
        _row.FILTERED_COST_CATEGORY_LIST = $scope.COST_CATEGORY_LIST.filter(cc => cc.COST_CATEGORY_NAME.toLowerCase().includes(_row.COST_CATEGORY_TEXT.toLowerCase()));
    }
    $scope.CALCULATE_NET_AMOUNT = function (_row) {
        //if (_row.VAT_AMOUNT == null) {
        //    if (_row.GROSS != null) {
        //        _row.NET_AMOUNT = parseFloat(_row.GROSS);
        //    }
        //}
        //else if (parseFloat(_row.VAT_AMOUNT) < parseFloat(_row.GROSS)) {
        //    _row.NET_AMOUNT = parseFloat(_row.GROSS) - parseFloat(_row.VAT_AMOUNT);
        //}
        //else {
        //    _row.NET_AMOUNT = 0;
        //}


        if (!isNaN(parseFloat(_row.GROSS)) && isNaN(parseFloat(_row.VAT_AMOUNT))) {
            _row.NET_AMOUNT = _row.GROSS;

        }
        else if (parseFloat(_row.VAT_AMOUNT) <= parseFloat(_row.GROSS)) {
            _row.NET_AMOUNT = parseFloat(_row.GROSS) - parseFloat(_row.VAT_AMOUNT);
        }
        else {
            $scope.$parent.ShowAlertBox('Error', 'VAT Amount cannot be greater than GROSS Amount');
            _row.NET_AMOUNT = 0;
            _row.VAT_AMOUNT = null;
        }

        //var totalGross = 0;
        //var totalVAT = 0;
        //var totalNET = 0;
        //angular.forEach($scope.PETTY_CASH_UPLOAD_LIST, function (row) {
        //    if (row.ACTIVE == true || row.ACTIVE == 1) {
        //        if (!isNaN(parseFloat(row.GROSS))) {
        //            totalGross += parseFloat(row.GROSS);
        //        }
        //        if (!isNaN(parseFloat(row.VAT_AMOUNT))) {
        //            totalVAT += parseFloat(row.VAT_AMOUNT);
        //        }
        //        if (!isNaN(parseFloat(row.NET_AMOUNT))) {
        //            totalNET += parseFloat(row.NET_AMOUNT);
        //        }
        //    }
        //});
        //$scope.TOTAL_GROSS = totalGross;
        //$scope.TOTAL_VAT = totalVAT;
        //$scope.TOTAL_NET = totalNET;
    }
    $scope.SELECT_COST_CATEGORY = function (_option) {
        if (_option == 'Choose') {
            $scope.petty_cash_entry.COST_CATEGORY_NAME = null;
            $scope.petty_cash_entry.PETTY_CASH_COST_CATEGORIE_ID = null;
        }
        else {
            $scope.petty_cash_entry.COST_CATEGORY_NAME = _option.COST_CATEGORY_NAME;
            $scope.petty_cash_entry.PETTY_CASH_COST_CATEGORIE_ID = _option.PETTY_CASH_COST_CATEGORIE_ID;
        }
        
        $scope.GET_PETTY_CASH_ENTRY(1);
    }

    $scope.SELECT_VENDOR = function (_option) {
        if (_option == 'Choose') {
            $scope.petty_cash_entry.VENDOR_NAME = null;
            $scope.petty_cash_entry.CASHUP_VENDOR_ID = null;
        }
        else {
            $scope.petty_cash_entry.VENDOR_NAME = _option.VENDOR_NAME;
            $scope.petty_cash_entry.CASHUP_VENDOR_ID = _option.CASHUP_VENDOR_ID;
        }
        
        $scope.GET_PETTY_CASH_ENTRY(1);
    }

    $scope.SELECT_APPROVER = function (_option) {
        if (_option == 'Choose') {
            $scope.petty_cash_entry.NAME = null;
            $scope.petty_cash_entry.APPROVER_ID = null;
        }
        else {
            $scope.petty_cash_entry.NAME = _option.NAME;
            $scope.petty_cash_entry.APPROVER_ID = _option.TABLE_ID;
            
        }

        $scope.GET_PETTY_CASH_ENTRY(1);
    }

    $scope.GET_CASHUP_TYPE = function (Sites) {
        var CashupModelObj = {
            CUSTOMER_ID: $scope.petty_cash_entry.CUSTOMER_ID,
            ENTITY_ID: $scope.petty_cash_entry.ENTITY_ID
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
                    //$scope.FILTERED_SITES_LIST[0].IS_SELECTED = true;
                    $scope.CASHUP_PRIVILEGE = true;
                }
                else {
                    $scope.CASHUP_PRIVILEGE = false;
                }
                $scope.FILTER_Fn(Sites[0]);
            } else {
                $scope.CASHUP_PRIVILEGE = false;
            }
        }).catch(function (error) {
            $scope.CASHUP_PRIVILEGE = false;
        });
    }
    $scope.FILTER_Fn = function (selectedSite) {
        $scope.SELECTED_SITE = selectedSite;
        if (selectedSite.STANDARD_ROLE_ID == 16 || selectedSite.STANDARD_ROLE_ID == 17 || selectedSite.STANDARD_ROLE_ID == 18) {
            $scope.petty_cash_entry.DATA_ENTRY_ENABLED = true;
        }
        else {
            $scope.petty_cash_entry.DATA_ENTRY_ENABLED = false;
        }
        $scope.petty_cash_entry.SELECTED_SITE = selectedSite;
        $scope.petty_cash_entry.BRANCH_ID = selectedSite.BRANCH_ID;
        $scope.selectSiteForUpload(selectedSite);
        $scope.GET_PETTY_CASH_COST_CATEGORIES();
        $scope.GET_CASHUP_VENDORS();
        $scope.ADMIN_GET_BRANCH_STAFF();
        if ($scope.petty_cash_entry.START_DATE != null || $scope.petty_cash_entry.END_DATE != null) {
            $scope.GET_PETTY_CASH_ENTRY(1);
        }
    };


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
    $scope.nginit_petty_cash_records = function (_row) {
        $scope.$parent.$parent.GET_UPLOADS(_row, 13, _row.ID);
    }
    $scope.add_petty_cash_upload_row = function () {
        $scope.PETTY_CASH_UPLOAD_LIST = [];
        var ROW = new Object();
        ROW.VENDOR = null;
        ROW.PETTY_CASH_CATEGORY_ID = null;
        ROW.PETTY_CASH_COST_CATEGORY_NAME = null;
        ROW.GOODS = null;
        ROW.GROSS = null;
        ROW.APPROVER_ID = null;
        ROW.APPROVER_NAME = null;
        ROW.VAT_AMOUNT = null;
        ROW.NET_AMOUNT = null;
        ROW.UPLOAD_IDS = null;
        ROW.CASHUP_VENDOR_ID = null;
        $scope.PETTY_CASH_UPLOAD_LIST.push(ROW);
        $scope.selectSiteForUpload($scope.petty_cash_entry.SELECTED_SITE);
    }

    $scope.SHOW_DDL_Fn = function (FLAG) {
        if (FLAG == 1) {
            $(".searchableVendorButton").show();
        }
        if (FLAG == 1) {
            $(".searchableCostCategoryButton").show();
        }

    };
    $scope.dateinputddmmyy = function (index) {
        $(document).ready(function () {
            var date_inputs = document.getElementsByClassName("dateinputddmmyy") //our date input has the name "date"
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
                        format: $scope.$parent.CALENDAR_DATE_FORMAT,
                        //format: 'yyyy-mm-dd',
                        clearBtn: true,
                        closeBtn: true,// close button visible
                        endDate: new Date()
                        //  startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate())
                    };
                    date_input.datepicker(options).on("hide", function (e) {

                    })
                }
            }
        });
    }
    $scope.dateinputddmmyy(1);
    $scope.getTheFilesToUploadPcash = function ($files, ControlName, FileSize, List, Attachment_UPLOAD_TYPE_ID, index) {

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
                    reader.readAsText($files[i]);
                }
                else {
                    $scope.ShowAlert('Error', 'Maximum File Size ' + FileSize + ' MB.', 5000);
                    angular.element("input[id='" + ControlName + "']").val(null);
                    return;
                }
            }
            else {
                $scope.ShowAlert('Error', 'Not a valid file.', 5000);
                angular.element("input[id='" + ControlName + "']").val(null);
                return;
            }
        }

        $scope.Files = $files;
        var fileUpload = document.getElementById("CardFile" + index);
        extension = fileUpload.files[0].name;
        $scope.uploadFiles(Attachment_UPLOAD_TYPE_ID, '', extension, List, index, 'Pcash');
    };
    $scope.uploadFiles = function (Attachment_UPLOAD_TYPE_ID, ATTACHEMENT_TYPE_ID, filename, List, index, FolderName) {

        if (($scope.Files != undefined && $scope.Files.length > 0)) {
            $scope.DocImageResult = [];
            var data = new FormData();
            //data.append("RelativeID", List.ID == 0 ? $scope.generaterandom(12) + "" + index : List.ID);
            data.append("RelativeID", $scope.generaterandom(12) + "" + index);
            data.append("UPLOAD_TYPE_ID", Attachment_UPLOAD_TYPE_ID);
            data.append("VIRTUALPATH", '/CashUp/' + FolderName + '/' + parseInt($scope.petty_cash_upload.SELECTED_SITE.BRANCH_ID) + '/');
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
                    $scope.ShowAlert('Error', d.data[0].UPLOADED_COMMENT, 5000);
                }
                else {
                    List.UploadedFiles = d.data;
                }
                var fileInput = document.getElementById("CardFile" + index); // Reset the file input
                if (fileInput) {
                    fileInput.value = ""; // Clear the input field
                }
            });
        }
    };
    $scope.generaterandom = function (n) {
        var add = 1, max = 12 - add;   // 12 is the min safe number Math.random() can generate without it starting to pad the end with zeros.   
        if (n > max) {
            return $scope.generaterandom(max) + $scope.generaterandom(n - max);
        }
        max = Math.pow(10, n + add);
        var min = max / 10; // Math.pow(10, n) basically
        var number = Math.floor(Math.random() * (max - min + 1)) + min;
        return ("" + number).substring(add);
    };
    $scope.DELETE_UPLOAD_CARD_ALL = function (Array, item, index) {
        if (confirm('Are you sure you want to delete?')) {
            Array.UploadedFiles.splice(index, 1);
            var CashupModelObj = new Object();
            CashupModelObj.ID = parseInt(item.ID);
            PrcCommMethods.CASHUP_APP_API(CashupModelObj, 'DELETE_UPLOAD').then(function (data) {
                var fileInput = document.getElementById("CardFile" + index); // Reset the file input
                if (fileInput) {
                    fileInput.value = ""; // Clear the input field
                }
                alert("Deletion Success");
            });
        }
    };

    $scope.CURRENT_ROW_FOR_COMMENTS = null;
    $scope.COMMENT_TEXT = null;
    $scope.SELECT_ROW_FOR_COMMENT = function (_row) {
        $scope.COMMENT_TEXT = _row.COMMENTS;
        $scope.CURRENT_ROW_FOR_COMMENTS = _row;
    }
    $scope.CLOSE_COMMENT = function () {
        $scope.CURRENT_ROW_FOR_COMMENTS = null;
        $scope.COMMENT_TEXT = null;
    }

    $scope.INS_PETTY_CASH_ENTRY_COMMENTS = function () {
        $scope.COMMENT_FORM.submitted = true;
        if ($scope.COMMENT_FORM.$valid) {
            var CashupAppModelObj = new Object();
            CashupAppModelObj.PETTY_CASH_ENTRY_ID = $scope.CURRENT_ROW_FOR_COMMENTS.ID;
            CashupAppModelObj.COMMENTS = $scope.COMMENT_TEXT;
            PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'INS_PETTY_CASH_ENTRY_COMMENTS').then(function (data) {
                var modalEl = document.getElementById('add_comment');
                var existingModal = bootstrap.Modal.getInstance(modalEl);
                if (existingModal) {
                    existingModal.hide();
                }
                $scope.CURRENT_ROW_FOR_COMMENTS = null;
                $scope.COMMENT_TEXT = null;
                $scope.COMMENT_FORM.submitted = false;
                $scope.GET_PETTY_CASH_ENTRY(1);

            });
        }
        
    }
    $scope.INS_DATA_UPLOAD_PETTY_CASH = function () {
        $scope.PcashEntryForm.submitted = true;
        if ($scope.PcashEntryForm.$valid) {
            var CashupAppModedlObj = new Object();
            CashupAppModedlObj.BRANCH_ID = $scope.petty_cash_upload.SELECTED_SITE.BRANCH_ID;
            CashupAppModedlObj.ENTITY_ID = $scope.petty_cash_upload.ENTITY_ID;
            CashupAppModedlObj.DATE = moment($scope.petty_cash_upload.DATE, $scope.$parent.CONVERSION_DATE_FORMAT).format($scope.$parent.DB_DATE_FORMAT);
            //CashupAppModedlObj.DATE = $scope.petty_cash_upload.DATE;
            CashupAppModedlObj.VENDOR_NAME = $scope.PETTY_CASH_UPLOAD_LIST[0].VENDOR;
            CashupAppModedlObj.PETTY_CASH_CATEGORY_ID = $scope.PETTY_CASH_UPLOAD_LIST[0].PETTY_CASH_CATEGORY_ID;
            CashupAppModedlObj.GOODS = $scope.PETTY_CASH_UPLOAD_LIST[0].GOODS;
            CashupAppModedlObj.GROSS = $scope.PETTY_CASH_UPLOAD_LIST[0].GROSS;
            CashupAppModedlObj.APPROVER_ID = $scope.PETTY_CASH_UPLOAD_LIST[0].APPROVER_ID;
            CashupAppModedlObj.APPROVER_NAME = $scope.PETTY_CASH_UPLOAD_LIST[0].APPROVER_NAME;
            CashupAppModedlObj.VAT_AMOUNT = $scope.PETTY_CASH_UPLOAD_LIST[0].VAT_AMOUNT;
            CashupAppModedlObj.NET_AMOUNT = $scope.PETTY_CASH_UPLOAD_LIST[0].NET_AMOUNT;
            CashupAppModedlObj.USER_ID = $scope.petty_cash_upload.USER_ID;
            UPLOAD_IDS = "";
            if ($scope.PETTY_CASH_UPLOAD_LIST[0].UploadedFiles) {
                angular.forEach($scope.PETTY_CASH_UPLOAD_LIST[0].UploadedFiles, function (FILE) {
                    if (UPLOAD_IDS == "") {
                        UPLOAD_IDS = FILE.UPLOAD_ID;
                    }
                    else {
                        UPLOAD_IDS = UPLOAD_IDS + "," + FILE.UPLOAD_ID;
                    }
                });
            }
            CashupAppModedlObj.UPLOAD_IDS = UPLOAD_IDS;
            CashupAppModedlObj.CASHUP_VENDOR_ID = $scope.PETTY_CASH_UPLOAD_LIST[0].CASHUP_VENDOR_ID;
            PrcCommMethods.CASHUP_APP_API(CashupAppModedlObj, 'INS_DATA_UPLOAD_PETTY_CASH').then(function (data) {
                $scope.PcashEntryForm.submitted = false;
                $scope.RESET_PCASH_UPLOAD();
                var modalEl = document.getElementById('add_new_pettyCash');
                var existingModal = bootstrap.Modal.getInstance(modalEl);
                if (existingModal) {
                    existingModal.hide();
                }
                $scope.GET_PETTY_CASH_ENTRY(1);
            });
        }
    }

    $scope.EXPORT_PAGE_TO_PDF = function () {
        window.scrollTo(0, 0);
        document.getElementById("loader").style.display = "block";
        const node = document.getElementById("PRINT_REPORT");
        const clone = node.cloneNode(true);
        const liveSiteFilterValue = document.querySelector('#select_label') ?.textContent.trim();
        const liveDateRangeValue = document.querySelector('#reportrange span') ?.textContent.trim();
        //const liveDateRangeValue = document.querySelector('#reportrange span') ?.textContent.trim();


        var elementsToRemove = clone.querySelectorAll('.col-xxl-2.col-xl-2.col-md-2, .col-xxl-auto.col-xl-auto.col-md-auto');
        elementsToRemove.forEach(el => el.remove());

        elementsToRemove = clone.querySelectorAll('#cashup-report-hide');
        elementsToRemove.forEach(el => el.remove());
        const reportTitleElement = clone.querySelector('#cashup-report-header h6');

        if (reportTitleElement) {
            reportTitleElement.textContent = 'Petty Cash Entries';
        }

        const reportHeader = clone.querySelector('#report_header');

        if (reportHeader) {
            // a. Make the entire header container visible
            reportHeader.classList.remove('d-none');

            // b. Apply Flexbox for alignment
            reportHeader.style.display = 'flex';
            reportHeader.style.justifyContent = 'space-between';
            reportHeader.style.alignItems = 'center';
            reportHeader.style.marginBottom = '20px';

            // c. Find the logo wrapper inside the header and ensure it's visible
            const logoWrapper = reportHeader.querySelector('.logo-wrapper');
            if (logoWrapper) {
                // This removes the .ng-hide class added by ng-show="false"
                logoWrapper.classList.remove('ng-hide');

                // d. Resize the logo image for the PDF
                const logoImages = logoWrapper.querySelectorAll('img');
                logoImages.forEach(img => {
                    img.style.maxWidth = 'none';
                    img.style.maxHeight = 'none';
                    img.style.width = '200px';
                    img.style.height = 'auto';
                });
            }
        }

        // --- Filter Display Logic (uses the new variables) ---
        const filterDisplayBar = document.createElement('div');
        filterDisplayBar.style.display = 'flex';
        filterDisplayBar.style.flexWrap = 'wrap';
        filterDisplayBar.style.gap = '25px';
        filterDisplayBar.style.marginBottom = '20px';
        filterDisplayBar.style.padding = '10px';
        filterDisplayBar.style.border = '1px solid #e0e0e0';
        filterDisplayBar.style.borderRadius = '5px';
        filterDisplayBar.style.backgroundColor = '#f9f9f9';
        filterDisplayBar.style.alignItems = 'center';

        // Use the value read from the LIVE document
        if (liveSiteFilterValue) {
            const siteDisplay = document.createElement('div');
            siteDisplay.innerHTML = `<strong>Site:</strong> ${liveSiteFilterValue}`;
            filterDisplayBar.appendChild(siteDisplay);
        }

        // Use the value read from the LIVE document
        if (liveDateRangeValue) {
            const dateDisplay = document.createElement('div');
            dateDisplay.innerHTML = `<strong>Date Range:</strong> ${liveDateRangeValue}`;
            filterDisplayBar.appendChild(dateDisplay);
        }

        // Now, remove the original container from the clone
        const originalFilterContainer = clone.querySelector('.resCashupHeader');
        if (originalFilterContainer) {
            originalFilterContainer.remove();
        }

        // Insert the new bar into the clone
        if (reportHeader) {
            reportHeader.after(filterDisplayBar);
        }

        const actionColumnCells = clone.querySelectorAll('.cashup-action-column');
        actionColumnCells.forEach(cell => cell.remove());
        // --- END: Filter Display Logic ---

        var HTML = '<html><head><link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/timepicker/1.3.5/jquery.timepicker.min.css">' +
            '<link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />' +
            '<link href="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/fontawesome-pro-6.5.1-web/css/fontawesome.min.css" rel="stylesheet" />' +
            '<link href="https://app.wenodo.com/E_Scripts/Select2angularjs/select2.css" rel="stylesheet" />' +
            '<link href="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/fontawesome-pro-6.5.1-web/css/light.css" rel="stylesheet" />' +
            '<link href="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/fontawesome-pro-6.5.1-web/css/regular.css" rel="stylesheet" />' +
            '<link href="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/fontawesome-pro-6.5.1-web/css/solid.css" rel="stylesheet" />' +
            '<link href="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/fontawesome-pro-6.5.1-web/css/brands.css" rel="stylesheet" />' +
            '<link rel="stylesheet" href="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/bootstrap/bootstrap.css" />' +
            '<link href="https://app.wenodo.com/E_Scripts/daterangepicker-master/daterangepicker.css" rel="stylesheet" />' +
            '<link href="https://app.wenodo.com/E_Scripts/bootstrap-datepicker-1.6.4-dist/css/bootstrap-datepicker3.css" rel="stylesheet" />' +
            '<link href=" https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/css/select2.min.css" rel="stylesheet" />' +
            '<link rel="stylesheet" type="text/css" href="https://app.wenodo.com/E_Content/CustomCss/HR/hr-style.css?v=2" />' +
            '<link rel="stylesheet" type="text/css" href="https://app.wenodo.com/E_Content/CustomCss/HR/responsive.css">' +
            '<link href="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/Countries/intltelinput.min.css" rel="stylesheet" />' +
            '<script src="https://app.wenodo.com/AngularControllers/MasterCntrl.js"></script>' +
            '<script src="https://app.wenodo.com/AngularControllers/HumanResource/HRIndexController.js"></script>' +
            '<script src="https://app.wenodo.com/AngularControllers/HumanResource/UserJourneyController.js"></script>' +
            '<script src="https://app.wenodo.com/E_Scripts/angular-sanitize.min.js"></script>' +
            '<script src="https://app.wenodo.com/E_Scripts/MomentTimePicker/moment-with-locales.min.js"></script>' +
            '<script src="https://app.wenodo.com/E_Scripts/MomentTimePicker/angular-moment-picker.min.js"></script>' +
            '<link href="https://app.wenodo.com/E_Scripts/MomentTimePicker/angular-moment-picker.min.css" rel="stylesheet" />' +
            '<link href="https://app.wenodo.com/E_Content/plugins/croppie/croppie.css" rel="stylesheet" />' +
            '<script src="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/bootstrap/bootstrap.bundle.min.js"></script>' +
            '<script src="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/scrollbar/simplebar.js"></script>' +
            '<script src="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/scrollbar/custom.js"></script>' +
            '<script src="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/apex-chart/apex-chart.js"></script>' +
            '<script src="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/bootstrap/bootstrap-notify.min.js"></script>' +
            '<script src="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/wow/wow.min.js"></script>' +
            '<script src="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/tooltip-init.js"></script>' +
            '<script src="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/script.js"></script>' +
            '<script src="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/height-equal.js"></script>' +
            '<script src="https://app.wenodo.com/E_Scripts/bootstrap-datepicker-1.6.4-dist/js/bootstrap-datepicker.js"></script>' +
            '<script src="https://app.wenodo.com/E_Scripts/daterangepicker-master/daterangepicker.js"></script>' +
            '<script type="text/javascript" src="https://app.wenodo.com/E_Scripts/ExcelPdfJS/html2canvas.min.js"></script>' +
            '<script src="https://app.wenodo.com/E_Scripts/ExcelPdfJS/jspdf.min.js"></script>' +
            '<script src="https://app.wenodo.com/E_Scripts/Calendar/ui-bootstrap-tpls.min.js"></script>' +
            '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css">' +
            '<script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js"></script>' +
            '<script src="//cdnjs.cloudflare.com/ajax/libs/timepicker/1.3.5/jquery.timepicker.min.js"></script>' +
            '<script src="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/sidebar-menu.js"></script>' +
            '<script src="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/Countries/telephone-input.js"></script>' +
            '<script src="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/Countries/intltelinput.min.js"></script>' +
            '<script src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js"></script>' +
            '<script src="https://app.wenodo.com/E_Scripts/Select2angularjs/select2.js"></script>' +
            '<script src="https://app.wenodo.com/E_Scripts/Select2angularjs/select2_locale_sv.js"></script>' +
            '<script src="https://app.wenodo.com/E_Scripts/Select2angularjs/sc-select2.directive.js"></script>' +
            '<script src="https://app.wenodo.com/E_Scripts/ExcelPdfJS/alasql.min.js"></script>' +
            '<script src="https://app.wenodo.com/E_Scripts/ExcelPdfJS/xlsx.core.min.js"></script>' +
            '<script src="https://app.wenodo.com/E_Content/plugins/croppie/croppie.min.js"></script><script src ="https://app.wenodo.com/AngularControllers/CommonMethod.js"></script></head><body>' + clone.innerHTML + '</body></html>';
        let iframe = document.createElement("iframe");
        iframe.style.visibility = "hidden";
        iframe.height = "1000px";
        iframe.width = "1000px";
        document.body.appendChild(iframe);
        let iframedoc = iframe.contentDocument || iframe.contentWindow.document;
        iframedoc.body.innerHTML = HTML;
        html2canvas(iframedoc.body, { useCORS: true, scale: 2 }).then(function (canvas) {
            FILE_NAME = "Float Entry Export";
            var imgBase64 = canvas.toDataURL('image/jpeg', 2.0);
            var doc = "";
            doc = new jsPDF("l", "pt", [canvas.width, canvas.height]);
            const pageWidth = doc.internal.pageSize.width;
            const pageHeight = doc.internal.pageSize.height;
            const widthRatio = pageWidth / canvas.width;
            const heightRatio = pageHeight / canvas.height;
            const ratio = widthRatio > heightRatio ? heightRatio : widthRatio;
            const canvasHeight = canvas.height * ratio;
            const ratio_1 = heightRatio > widthRatio ? widthRatio : heightRatio;
            const canvasWidth = canvas.width * ratio;
            doc.addImage(imgBase64, 'PNG', 20, 50, canvasWidth - 40, canvasHeight);
            doc.save(FILE_NAME + '.pdf');
            document.getElementById("loader").style.display = "none";
            document.querySelectorAll('iframe').forEach(
                function (elem) {
                    elem.parentNode.removeChild(elem);
                });
        });
    }
    $scope.$on('$destroy', function () {
        $('.modal.show').modal('hide');
    });
});